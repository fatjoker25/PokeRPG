/* ============================================================
   COMBATE — regras do Pokérole 3.0, com o nível dos jogos
   Tudo é parada de d6: cada 4, 5 ou 6 é um sucesso.
   Precisão: atributo + perícia do golpe; precisa de 1 sucesso,
     menos a precisão baixa do golpe, a dor e a confusão.
   Crítico: 3 sucessos além do necessário (2 com crítico alto) → +2 dados.
   Dano: atributo + poder + 1 de STAB − Vitalidade (físico) ou
     Instinto (especial); cada sucesso é 1 de dano. Zero sucesso = 1.
     Fraqueza +1 por tipo, resistência −1 por tipo, imune = 0.
   HP = HP base da espécie + Vitalidade.
   Ordem: prioridade, depois iniciativa (1d6 na entrada + Destreza + Alerta).
   ============================================================ */

/* o nome de cada atributo na frase do log */
const NOME_ESTAGIO = {atk:'a Força', def:'a Vitalidade', spa:'o Especial', spd:'o Instinto',
                      spe:'a Destreza', precisao:'a precisão', evasao:'a evasão'};
/* estágio dos jogos (chave do golpe) → atributo do livro */
const ATRIB_DO_ESTAGIO = {atk:'for', def:'vit', spa:'esp', spd:'ins', spe:'des'};
const ESTAGIO_DO_ATRIB = {for:'atk', vit:'def', esp:'spa', ins:'spd', des:'spe'};
/* Seismic Toss, Night Shade e Psywave: dados pelo posto */
const DADOS_POR_POSTO = [1, 2, 4, 6, 8, 10, 10, 10];

/* o que o jogo diz quando o tempo muda */
const CLIMA_TEXTO = {
  chuva:{comeca:'Começa a chover forte.', acaba:'A chuva para.'},
  areia:{comeca:'Uma tempestade de areia se levanta.', acaba:'A tempestade de areia assenta.'},
  sol:{comeca:'O sol fica forte de repente.', acaba:'O sol volta ao normal.'}
};

const Batalha = {
  ativo:false, aliado:null, inimigo:null, tipo:'selvagem',
  turno:0, fuga:true, eventos:[], fim:null, fase:'normal',
  estAliado:null, estInimigo:null, aoTerminar:null, contexto:null, arena:null,

  /* ---------- ciclo de vida ---------- */
  iniciar(aliado, inimigo, opts={}){
    this.ativo = true;
    this.aliado = aliado;
    this.inimigo = inimigo;
    this.tipo = opts.tipo || 'selvagem';
    this.fuga = opts.fuga !== false;
    this.turno = 0;
    this.fim = null;
    this.fase = 'normal';
    this.bonusDinheiro = 1;
    this.revelaNatureza = !!opts.revelarNatureza;   // líder/NPC que fala do próprio time
    /* quanto a IA erra a escolha do golpe, em %: veterano erra menos */
    this.erroIA = (opts.erroIA != null) ? opts.erroIA : 22;
    if (this.revelaNatureza && inimigo){ inimigo.naturezaVista = true; inimigo.nomeAnunciado = true; }
    if (this.revelaNatureza && opts.timeInimigo) opts.timeInimigo.forEach(p => { p.nomeAnunciado = true; });
    if (Estado.dados) (Estado.dados.time || []).forEach(p => { p.faixaUsada = false; });
    this.eventos = [];
    this.aoTerminar = opts.aoTerminar || null;
    this.contexto = opts.contexto || null;
    /* Cena pode fixar a arena quando o ambiente do capítulo não
       descreve o canto exato da briga (um porão dentro do mato). */
    this.arena = opts.arena || null;
    this.treinador = opts.treinador || null;
    this.timeInimigo = opts.timeInimigo || null;
    this.estAliado = this.novoEstado();
    this.estInimigo = this.novoEstado();
    this.pdexUsada = false;
    /* quem enfrentou o adversário da vez: é entre eles que a experiência
       se divide, como nos jogos */
    this.participantes = new Set(aliado ? [aliado.uid] : []);
    /* o que vale pro lado inteiro, e fica mesmo se trocar de Pokémon:
       Reflect, Light Screen, Mist e Safeguard, cinco turnos cada */
    this.lados = {aliado:{reflexo:0, tela:0, nevoa:0, salva:0}, inimigo:{reflexo:0, tela:0, nevoa:0, salva:0}};
    /* chuva ou areia: dura cinco turnos, como na 2ª geração */
    this.clima = null;
    /* quem viu o par cair nesta luta e ainda não entrou: uid → nome do par */
    this.viuOParCair = {};
    /* A cena que vem depois quer saber se sobrou pra você. */
    this.hpJogadorInicio = (Estado.j && Estado.j.hp) || 0;
    this.leituraIntelecto = false;
    if (Estado.viu(inimigo.dex)) this.ev('pokedex', 'A Pokédex vibra no bolso: espécie nova, ainda não catalogada.');
    if (inimigo.shiny){
      Estado.viuBrilhante(inimigo.dex);
      this.ev('brilhante', this.tipo === 'treinador'
        ? 'A cor está errada. Não é doença e não é luz: é um brilhante, e está do lado de lá.'
        : 'A cor está errada. Você olha duas vezes e ela continua errada — e aí você entende o que está na sua frente.');
    }
    this.ev('inicio', opts.introducao || this.introPadrao());
    /* Intelecto: você já viu um parecido, e isso vale meia Pokédex.
       Vem depois da entrada, porque primeiro a coisa aparece. */
    if (inimigo && !Estado.conheceu(inimigo.dex) && Estado.dados && Estado.j){
      const t = Dados.teste(Estado.j.status.intelecto, 7, 'Intelecto');
      if (t.grau === 'sucesso' || t.grau === 'critico'){
        this.leituraIntelecto = true;
        this.ev('natureza', inimigo.nomeAnunciado
          ? `Você ouviu o nome, mas é a primeira vez que vê um de perto — e dá pra ver o que ele é: ${inimigo.tipos.join('/')}.`
          : `Você não sabe o nome, mas já viu desenho de um parecido e sabe o que ele é: ${inimigo.tipos.join('/')}.`);
      }
    }
    /* o jeito do bicho se lê olhando, não com aparelho: Percepção alta
       pega pelo modo como ele se mexe antes do primeiro golpe */
    if (inimigo && !inimigo.naturezaVista && Estado.dados && Estado.j){
      const t = Dados.teste(Estado.j.status.percepcao, 10, 'Percepção');
      if (t.grau === 'sucesso' || t.grau === 'critico'){
        inimigo.naturezaVista = true;
        this.ev('natureza', `Pelo jeito que ${nomeVisivel(inimigo)} se mexe antes do primeiro golpe, dá pra ler: ${inimigo.natureza}.`);
      }
    }
    return this.eventos;
  },

  novoEstado(){
    return {atk:0, def:0, spa:0, spd:0, spe:0, precisao:0, evasao:0, confuso:0, carregando:null, recarregando:false,
            /* estados que os golpes deixam: somem quando o Pokémon sai da luta */
            presoTurnos:0, presoPor:null, semente:false, maldito:false, pesadelo:false, apaixonado:false,
            desabilitado:null, substituto:0, focado:false, identificado:false, protegido:false,
            aguentando:false, seguidas:0, cortes:0, ultimoGolpe:null, transformado:null, origTipos:null};
  },

  /* o chão da briga: a arena fixada pela cena, senão o lugar */
  terreno(){
    if (typeof Arenas === 'undefined') return {sai:'do mato', volta:'para o mato', fuga:'Você corre e escapa.'};
    return Arenas.terreno(TERRENO[this.arena] ? this.arena : null);
  },

  introPadrao(){
    const i = this.inimigo;
    const conhece = Estado.conheceu(i.dex);
    const nat = i.naturezaVista ? `, ${i.natureza}` : '';
    if (this.tipo === 'selvagem'){
      return conhece
        ? `Um ${i.nome} selvagem (Nv ${i.nivel}${nat}) aparece!`
        : `Um Pokémon sai ${this.terreno().sai} e para na sua frente (Nv ${i.nivel}). Você nunca viu um desses de perto.`;
    }
    if (this.tipo === 'lendario') return `${nomeVisivel(i)} encara você. O ar fica pesado.`;
    return `${this.treinador || 'Um treinador'} enviou ${nomeVisivel(i)} (Nv ${i.nivel}${nat})!`;
  },

  /* Cada evento leva uma foto dos dois lutadores e do treinador naquele
     instante. É dela que a tela tira o que animar — quem levou dano,
     quem curou, quem ganhou condição, quem entrou — sem o motor
     precisar saber que existe animação. */
  ev(tipo, texto, extra){
    const e = Object.assign({tipo, texto}, extra||{});
    const foto = (p, lado) => p ? {uid:p.uid, hp:Math.max(0, p.hp), hpMax:p.hpMax, status:p.status || null,
                                   marcas:this.marcas(lado)} : null;
    e.fotoA = foto(this.aliado, 'aliado');
    e.fotoI = foto(this.inimigo, 'inimigo');
    if (typeof Estado !== 'undefined' && Estado.j) e.fotoJ = Estado.j.hp;
    this.eventos.push(e);
  },

  /* O que está valendo em cada lado agora: estágio que subiu ou caiu e
     estado que um golpe deixou. É o que a ficha de HP mostra na luta. */
  marcas(lado){
    const est = lado === 'aliado' ? this.estAliado : this.estInimigo;
    const L = this.lados && this.lados[lado];
    if (!est) return [];
    const p = lado === 'aliado' ? this.aliado : this.inimigo;
    const o = pron(p).o;
    const m = [];
    const ROT = {atk:'FOR', def:'VIT', spa:'ESP', spd:'INS', spe:'DES', precisao:'PREC', evasao:'EVA'};
    for (const k of Object.keys(ROT)){
      const v = est[k] || 0;
      if (v) m.push({t:`${ROT[k]} ${v > 0 ? '+' : '−'}${Math.abs(v)}`, c: v > 0 ? 'alto' : 'baixo'});
    }
    if (est.confuso > 0)     m.push({t:'Confus' + o, c:'estado'});
    if (est.apaixonado)      m.push({t:'Apaixonad' + o, c:'estado'});
    if (est.presoTurnos > 0) m.push({t:'Pres' + o, c:'estado'});
    if (est.semente)         m.push({t:'Semead' + o, c:'estado'});
    if (est.maldito)         m.push({t:'Maldição', c:'estado'});
    if (est.pesadelo)        m.push({t:'Pesadelo', c:'estado'});
    if (est.desabilitado)    m.push({t:`${est.desabilitado.nome} travado`, c:'estado'});
    if (est.substituto > 0)  m.push({t:'Boneco', c:'bom'});
    if (est.focado)          m.push({t:'Focad' + o, c:'bom'});
    if (est.identificado)    m.push({t:'Identificad' + o, c:'estado'});
    if (est.transformado)    m.push({t:'Transformad' + o, c:'bom'});
    if (L){
      if (L.reflexo > 0) m.push({t:`Reflect ${L.reflexo}`, c:'campo'});
      if (L.tela > 0)    m.push({t:`Light Screen ${L.tela}`, c:'campo'});
      if (L.nevoa > 0)   m.push({t:`Mist ${L.nevoa}`, c:'campo'});
      if (L.salva > 0)   m.push({t:`Safeguard ${L.salva}`, c:'campo'});
    }
    return m;
  },

  /* ---------- atributos na luta ----------
     O estágio que sobe ou cai (Growl, Swords Dance) soma direto no
     atributo, um ponto por estágio, como no livro. Paralisia tira 2
     de Destreza. Nenhum atributo fica abaixo de 1. */
  attr(p, est, k){
    let v = (p.stats[k] || 1) + ((est && est[ESTAGIO_DO_ATRIB[k]]) || 0);
    if (k === 'des' && p.status === 'paralisia') v -= 2;
    return Math.max(1, v);
  },
  /* atributo que entra numa parada: social e Vontade não moram na ficha */
  valorAtrib(p, est, k){
    if (k === 'soc') return socialDoNivel(p.nivel);
    if (k === 'von') return this.attr(p, est, 'ins') + 2;
    return this.attr(p, est, k);
  },
  /* o melhor atributo entre os que o golpe aceita ("Destreza/Força") */
  melhorAtrib(p, est, lista, padrao){
    const l = (lista && lista.length) ? lista : [padrao];
    return l.reduce((m, k) => this.valorAtrib(p, est, k) > this.valorAtrib(p, est, m) ? k : m, l[0]);
  },
  /* dor: −1 sucesso na metade do HP, −2 com 1 de HP */
  dor(p){
    if (p.hp <= 1 && p.hpMax > 1) return 2;
    return p.hp * 2 <= p.hpMax ? 1 : 0;
  },
  /* iniciativa: o d6 sai uma vez, na entrada; Destreza e Alerta somam
     na hora, então paralisia e Agility mudam a ordem no meio da luta */
  iniciativa(p, est){
    if (est.ini6 == null) est.ini6 = Dados.d6(`Iniciativa de ${nomeVisivel(p)}`);
    const seg = efeitoSegurado(p);
    return est.ini6 + this.attr(p, est, 'des') + periciaDoNivel(p.nivel) + ((seg && seg.vel) || 0);
  },

  /* ---------- naturezas: o bicho tem vontade própria ---------- */
  vontade(p, golpeNome, souAliado){
    const nat = NATUREZAS[p.natureza] || {};
    const g = GOLPES[golpeNome];
    const moral = souAliado ? (p.moral !== undefined ? p.moral : 70) : 50;
    // cada insígnia conquistada faz o time confiar mais nas suas ordens,
    // e quem sabe mandar precisa de menos insígnia para ser obedecido
    const insignias = (Estado.dados && Estado.dados.insignias) ? Estado.dados.insignias.length : 0;
    const carisma = (Estado.dados && Estado.j) ? (Estado.j.status.carisma || 0) : 0;
    /* e o jeito dele contra o seu: quem te entende obedece mais fácil,
       quem não te entende faz você repetir a ordem */
    const af = souAliado && typeof efeitosDeAfinidade === 'function'
      ? efeitosDeAfinidade(p) : {obediencia:0, grau:'neutro'};
    let desobedienciaBase = souAliado
      ? Math.max(0, (60 - moral) / 2 - insignias * 3 - carisma * 1.5 + af.obediencia)
      : 0;
    /* com o par no mesmo time, ele briga mais perto de você: metade da recusa */
    if (souAliado && desobedienciaBase > 0 && parDe(p)) desobedienciaBase /= 2;

    if (p.natureza === 'Brave' && g.c === 'esp' && Dados.chance(35))
      return {recusa:true, texto:`${nomeVisivel(p)} é Brave — recusa o golpe especial. Quer sentir o impacto.`};
    if (p.natureza === 'Timid' && g.c === 'fis' && Dados.chance(30))
      return {recusa:true, texto:`${nomeVisivel(p)} é Timid — hesita em chegar perto e não ataca.`};
    if (p.natureza === 'Naughty' && Dados.chance(18))
      return {trocaAlvo:true, texto:`${nomeVisivel(p)} é Naughty — usa o golpe do jeito errado, de propósito.`};
    if ((p.natureza === 'Hasty' || p.natureza === 'Lonely') && Dados.chance(15))
      return {outroGolpe:true, texto:`${nomeVisivel(p)} não espera o comando e ataca por conta própria.`};
    if (desobedienciaBase > 0 && Dados.chance(desobedienciaBase))
      return {recusa:true, texto: (af.grau === 'atrito' || af.grau === 'desencontro')
        ? `${nomeVisivel(p)} olha pra você, demora, e faz outra coisa.`
        : `${nomeVisivel(p)} ignora sua ordem. O vínculo entre vocês está fraco.`};
    return null;
  },

  /* ---------- pode agir? ---------- */
  podeAgir(p, est, souAliado, golpeNome){
    est.penalConf = 0;
    if (p.status === 'sono'){
      /* dormindo: rola Instinto a cada vez, e acorda quando somar os
         sucessos que faltam (5, pelo livro; o Rest deixa 2) */
      const r = Dados.pool(this.attr(p, est, 'ins'), `${nomeVisivel(p)} tenta acordar`);
      p.statusTurnos = (p.statusTurnos || 0) - r.suc;
      if (p.statusTurnos <= 0){ p.status = null; p.statusTurnos = 0; est.pesadelo = false; this.ev('status', `${nomeVisivel(p)} acordou!`); }
      else {
        this.ev('status', `${nomeVisivel(p)} está dormindo profundamente.`);
        /* Sleep Talk e Snore são os golpes de quem está dormindo */
        if (golpeNome === 'Sleep Talk' || golpeNome === 'Snore') return true;
        return false;
      }
    }
    if (p.status === 'congelamento'){
      if (Dados.chance(20)){ p.status = null; this.ev('status', `${nomeVisivel(p)} descongelou!`); }
      else { this.ev('status', `${nomeVisivel(p)} está congelad${pron(p).o} e não consegue se mover.`); return false; }
    }
    if (est.recarregando){
      est.recarregando = false;
      this.ev('status', `${nomeVisivel(p)} precisa se recuperar do golpe anterior.`); return false;
    }
    if (est.confuso > 0){
      est.confuso--;
      if (est.confuso === 0) this.ev('status', `${nomeVisivel(p)} saiu da confusão.`);
      else {
        /* no começo da vez: 2 sucessos de Instinto e a confusão não pesa agora */
        const r = Dados.pool(this.attr(p, est, 'ins'), `${nomeVisivel(p)} resiste à confusão`);
        if (r.suc >= 2) this.ev('status', `${nomeVisivel(p)} balança a cabeça e se concentra.`);
        else {
          const posto = postoDoNivel(p.nivel);
          est.penalConf = posto <= 2 ? 1 : posto <= 5 ? 2 : 3;
          this.ev('status', `${nomeVisivel(p)} está confus${pron(p).o}…`);
        }
      }
    }
    return true;
  },

  /* ---------- precisão ----------
     Parada = atributo + perícia do golpe. Precisa de 1 sucesso; a
     precisão baixa do golpe, a dor e a confusão tiram sucessos, e o
     estágio de precisão contra o de evasão soma ou tira. Três além do
     necessário é crítico (dois, com crítico alto ou Focus Energy). */
  rolarPrecisao(atk, def, estAtk, estDef, nome){
    const g = GOLPES[nome];
    const pr = PR_GOLPE[nome] || {};
    const res = {acertou:true, critico:false, extra:0, rolou:false};
    /* golpe no próprio corpo (Swords Dance, Recover) não erra */
    if (g.c === 'status' && !this.miraNoOutro(g)) return res;
    const k = this.melhorAtrib(atk, estAtk, pr.a, g.c === 'esp' ? 'esp' : 'des');
    const atrib = this.valorAtrib(atk, estAtk, k);
    const per = pr.h ? periciaDoNivel(atk.nivel) : 0;
    const r = Dados.pool(atrib + per, `Precisão de ${nome}`);
    res.rolou = true;
    const eva = estDef ? (estDef.identificado ? Math.min(0, estDef.evasao || 0) : (estDef.evasao || 0)) : 0;
    const passo = (estAtk.precisao || 0) - eva;
    const menos = (pr.r || 0) + this.dor(atk) + (estAtk.penalConf || 0);
    const liquido = r.suc + passo - menos;
    res.extra = liquido - 1;
    const nomeA = k === 'soc' ? 'Social' : k === 'von' ? 'Vontade' : SIGLA_ATRIB[k];
    const partes = [`${nomeA} ${atrib}`];
    if (per) partes.push(`${pr.h} ${per}`);
    let conta = `${partes.join(' + ')} = ${atrib + per}d6 → ${r.suc}`;
    if (pr.r) conta += ` − ${pr.r} precisão baixa`;
    if (this.dor(atk)) conta += ` − ${this.dor(atk)} dor`;
    if (estAtk.penalConf) conta += ` − ${estAtk.penalConf} confusão`;
    if (passo) conta += ` ${passo > 0 ? '+' : '−'} ${Math.abs(passo)} estágio`;
    this.ev('rolagem', `Precisão: ${conta}${liquido !== r.suc ? ` = ${Math.max(0, liquido)}` : ''}`);
    /* não erra (Swift): acerta sempre, mas o dado ainda decide o crítico */
    res.acertou = pr.nunca || g.a >= 999 ? true : liquido >= 1;
    res.extra = liquido - 1;
    if (g.c !== 'status'){
      /* No livro, o Pokémon de posto alto gasta a sobra em ações extras
         na mesma rodada. Aqui cada um age uma vez por turno, então a
         sobra que vira crítico sobe com o posto: 3 no Iniciante e no
         Novato, e um a mais por posto dali pra cima. */
      let limite = 3 + Math.max(0, postoDoNivel(atk.nivel) - 1);
      if (pr.crit || (g.ef && g.ef.critico)) limite--;
      if (estAtk.focado) limite--;
      /* quem te entende acerta onde dói sem você apontar */
      if (typeof efeitosDeAfinidade === 'function' && _meuPokemon(atk) && efeitosDeAfinidade(atk).crit > 0) limite--;
      res.critico = res.acertou && (pr.semprecrit || res.extra >= Math.max(1, limite));
    }
    return res;
  },

  /* ---------- dano ----------
     Cada acerto rola a sua parada; o golpe de ação dupla ou tripla
     acerta duas ou três vezes, e o de ações sucessivas acerta uma vez
     a mais por sucesso sobrando na precisão, até cinco. */
  calcularDano(atk, def, estAtk, estDef, golpeNome, poder, prec){
    const g = GOLPES[golpeNome];
    const pr = PR_GOLPE[golpeNome] || {};
    prec = prec || {critico:false, extra:0};
    const res = {dano:0, critico:false, efic:1, msgs:[], contas:[]};

    /* Foresight: Normal e Lutador passam a acertar Fantasma */
    const tiposDef = (estDef.identificado && (g.t === 'Normal' || g.t === 'Lutador'))
      ? def.tipos.filter(t => t !== 'Fantasma') : def.tipos;
    res.efic = eficacia(g.t, tiposDef.length ? tiposDef : ['Normal']);
    if (res.efic === 0){
      res.msgs.push(`Não afeta ${nomeVisivel(def)}…`);
      return res;
    }
    /* fraqueza e resistência contam por tipo: ×2 é +1, ×4 é +2, ×½ é −1 */
    const passos = Math.round(Math.log2(res.efic));

    if (pr.ohko || (g.ef && g.ef.fixo >= 200)){
      res.dano = def.hp;
      res.msgs.push('Um golpe só, e acabou.');
      return res;
    }
    if (pr.fixo || (g.ef && g.ef.fixo)){           // Dragon Rage, Sonic Boom
      res.dano = pr.fixo || 1;
      res.msgs.push(`Dano fixo: ${res.dano}`);
      return res;
    }
    if (pr.posto || pr.metade || (g.ef && g.ef.nivel)){
      /* Seismic Toss, Night Shade, Psywave: dados pelo posto de quem
         usa; Super Fang: metade do HP que o outro ainda tem. Ignoram
         a defesa. */
      const n = pr.metade ? Math.min(10, Math.max(1, Math.floor(def.hp / 2)))
                          : DADOS_POR_POSTO[postoDoNivel(atk.nivel)];
      const r = Dados.pool(n, `Dano de ${golpeNome}`);
      res.dano = Math.max(1, r.suc);
      res.contas.push(`Dano: ${pr.metade ? 'metade do HP' : 'posto ' + nomePosto(atk.nivel)} = ${n}d6 → ${r.suc}`);
      return res;
    }

    const fisico = g.c === 'fis';
    const kAtk = this.melhorAtrib(atk, estAtk, pr.d, fisico ? 'for' : 'esp');
    const aVal = this.valorAtrib(atk, estAtk, kAtk);
    let pw = poder != null ? poder : (pr.p || Math.max(1, Math.round((g.p || 40) / 25)));
    /* chuva: Água +1 de poder e Fogo −1 de dano · sol: o contrário */
    let climaDano = 0;
    if (this.clima && (this.clima.tipo === 'chuva' || this.clima.tipo === 'sol')){
      const forte = this.clima.tipo === 'chuva' ? 'Água' : 'Fogo';
      const fraco = this.clima.tipo === 'chuva' ? 'Fogo' : 'Água';
      if (g.t === forte) pw++;
      if (g.t === fraco) climaDano = -1;
    }
    const stab = atk.tipos.includes(g.t) ? 1 : 0;
    const segA = efeitoSegurado(atk);
    const item = segA ? ((fisico && segA.fis) || (!fisico && segA.esp) || 0) : 0;

    /* defesa: Vitalidade contra físico, Instinto contra especial.
       Reflect e Light Screen somam 2 — o crítico passa por cima. */
    let dVal = 0, dBase = 0, extraDef = '';
    if (!pr.ign){
      dVal = dBase = this.attr(def, estDef, fisico ? 'vit' : 'ins');
      const ladoDef = this.lados && this.lados[def === this.aliado ? 'aliado' : 'inimigo'];
      if (ladoDef && !prec.critico){
        if (fisico && ladoDef.reflexo > 0){ dVal += 2; extraDef += ' + 2 Reflect'; }
        if (!fisico && ladoDef.tela > 0) { dVal += 2; extraDef += ' + 2 Light Screen'; }
      }
      if (!fisico && this.clima && this.clima.tipo === 'areia' && def.tipos.includes('Pedra')){ dVal++; extraDef += ' + 1 areia'; }
      const segD = efeitoSegurado(def);
      if (segD && segD.defesa){ dVal += segD.defesa; extraDef += ` + ${segD.defesa} colete`; }
    }
    const crit = prec.critico ? 2 : 0;
    if (crit) res.critico = true;
    const n = Math.max(0, aVal + pw + stab + crit + item - dVal);

    let golpes = 1;
    if (pr.dupla) golpes = 2;
    else if (pr.tripla) golpes = 3;
    else if (pr.suc) golpes = Math.max(1, Math.min(5, 1 + (prec.extra || 0)));
    else if (!PR_GOLPE[golpeNome] && g.ef && g.ef.golpes) golpes = g.ef.golpes;

    /* apaixonado: metade do dano, a menos que o Instinto segure (3 sucessos) */
    let metade = false;
    if (estAtk.apaixonado){
      const r = Dados.pool(this.attr(atk, estAtk, 'ins'), `${nomeVisivel(atk)} resiste à paixão`);
      if (r.suc < 3){ metade = true; res.msgs.push(`${nomeVisivel(atk)} está apaixonad${pron(atk).o} e bate sem vontade.`); }
    }

    const nomeA = SIGLA_ATRIB[kAtk];
    let conta = `${nomeA} ${aVal} + poder ${pw}`;
    if (stab) conta += ' + 1 STAB';
    if (crit) conta += ' + 2 crítico';
    if (item) conta += ` + ${item} item`;
    if (pr.ign) conta += ' (ignora defesa)';
    else conta += ` − ${fisico ? 'VIT' : 'INS'} ${dBase}${extraDef}`;
    let total = 0;
    const suces = [];
    for (let i = 0; i < golpes; i++){
      if (i > 0 && def.hp - total <= 0) { golpes = i; break; }
      const r = Dados.pool(n, `Dano de ${golpeNome}${golpes > 1 ? ` (${i + 1})` : ''}`);
      suces.push(r.suc);
      let d;
      if (r.suc === 0) d = 1;                       // zero sucesso: 1 de dano, e só
      else d = Math.max(1, r.suc + passos + climaDano);
      if (metade) d = Math.max(1, Math.floor(d / 2));
      total += d;
    }
    res.contas.push(`Dano: ${conta} = ${n}d6 → ${suces.join(' + ')}${passos ? ` ${passos > 0 ? '+' : '−'} ${Math.abs(passos) * suces.filter(x => x > 0).length} ${passos > 0 ? 'fraqueza' : 'resistência'}` : ''}${suces.some(x => x === 0) ? ' (zero sucesso vale 1)' : ''} = ${total}`);
    if (golpes > 1) res.msgs.push(`Acertou ${golpes} vezes!`);
    if (res.critico) res.msgs.push('ACERTO CRÍTICO!');
    const txt = textoEficacia(res.efic);
    if (txt) res.msgs.push(txt);
    res.dano = total;
    return res;
  },

  aplicarStatus(alvo, tipoStatus, grave){
    if (tipoStatus === 'recuo') return false;
    if (alvo.status) return false;
    if (tipoStatus === 'veneno' && (alvo.tipos.includes('Venenoso') || alvo.tipos.includes('Metálico'))) return false;
    if (tipoStatus === 'queimadura' && alvo.tipos.includes('Fogo')) return false;
    if (tipoStatus === 'congelamento' && alvo.tipos.includes('Gelo')) return false;
    if (tipoStatus === 'paralisia' && alvo.tipos.includes('Elétrico')) return false;
    alvo.status = tipoStatus;
    alvo.statusGrave = !!grave;
    /* sono: 5 sucessos de Instinto pra acordar, somados vez a vez */
    alvo.statusTurnos = tipoStatus === 'sono' ? 5 : 0;
    alvo.venenoRodadas = 0;
    return true;
  },

  /* ---------- um golpe ---------- */
  /* nomeForcado: o golpe vem de fora do slot (Mirror Move, Sleep Talk) e
     não gasta PP nem passa pela vontade da natureza. */
  /* Self-Destruct e Explosion: quem usa cai, acertando ou não — como
     nos jogos. O resto do golpe (precisão, dano, boneco) é o de sempre. */
  usarGolpe(atacante, defensor, estAtk, estDef, indiceGolpe, souAliado, nomeForcado){
    const antes = this.eventos.length;
    this.usarGolpeBase(atacante, defensor, estAtk, estDef, indiceGolpe, souAliado, nomeForcado);
    const usado = this.eventos.slice(antes).find(e => e.tipo === 'golpe' && e.golpe);
    const G = usado && GOLPES[usado.golpe];
    if (G && G.ef && G.ef.autodestroi && atacante.hp > 0){
      const tinha = atacante.hp;
      atacante.hp = 0;
      this.ev('dano', `${nomeVisivel(atacante)} gasta tudo o que tinha no estouro.`, {alvo:souAliado ? 'aliado' : 'inimigo', dano:tinha});
    }
  },

  usarGolpeBase(atacante, defensor, estAtk, estDef, indiceGolpe, souAliado, nomeForcado){
    let nome;
    if (nomeForcado){
      nome = nomeForcado;
    } else {
      const slot = atacante.golpes[indiceGolpe];
      if (!slot){ this.ev('info', `${nomeVisivel(atacante)} não tem esse golpe.`); return; }
      if (estAtk.desabilitado && estAtk.desabilitado.nome === slot.nome){
        this.ev('erro', `${nomeVisivel(atacante)} não consegue usar ${slot.nome}: está desabilitado.`);
        return;
      }
      if (slot.pp <= 0){
        /* Forcejar (Struggle): Força + 1 de poder, sem tipo, e 1 de volta */
        this.ev('info', `${nomeVisivel(atacante)} está sem PP em ${slot.nome} — usa Forcejar!`);
        const n = Math.max(0, this.attr(atacante, estAtk, 'for') + 1 - this.attr(defensor, estDef, 'vit'));
        const r = Dados.pool(n, 'Forcejar');
        const d = Math.max(1, r.suc);
        this.ev('rolagem', `Dano: FOR ${this.attr(atacante, estAtk, 'for')} + poder 1 − VIT ${this.attr(defensor, estDef, 'vit')} = ${n}d6 → ${r.suc}`);
        defensor.hp = Math.max(0, defensor.hp - d);
        atacante.hp = Math.max(0, atacante.hp - 1);
        this.ev('dano', `${nomeVisivel(defensor)} sofreu ${d}. ${nomeVisivel(atacante)} se machucou no contragolpe.`, {alvo:souAliado?'inimigo':'aliado', dano:d});
        return;
      }
      nome = slot.nome;
      const v = this.vontade(atacante, nome, souAliado);
      if (v){
        this.ev('natureza', v.texto);
        if (v.recusa) return;
        if (v.outroGolpe){
          const outros = atacante.golpes.filter((g,i) => i !== indiceGolpe && g.pp > 0);
          if (outros.length){ const alt = Dados.escolher(outros); nome = alt.nome; alt.pp--; }
          else slot.pp--;
        } else slot.pp--;
      } else slot.pp--;
    }

    const g = GOLPES[nome];
    const ef = g.ef || {};
    /* golpe que não é o mesmo de antes quebra a sequência de Protect e
       de Fury Cutter */
    if (ef.acao !== 'proteger' && ef.acao !== 'aguentar') estAtk.seguidas = 0;
    if (!ef.corte) estAtk.cortes = 0;

    // golpes de carga (Dig, Fly, Solar Beam, Sky Attack)
    /* no sol, Solar Beam dispara sem carregar */
    const semCarga = nome === 'Solar Beam' && this.clima && this.clima.tipo === 'sol';
    if (ef.carga && estAtk.carregando !== nome && !semCarga){
      estAtk.carregando = nome;
      this.ev('info', `${nomeVisivel(atacante)} se prepara para ${nome}!`);
      return;
    }
    estAtk.carregando = null;

    this.ev('golpe', `${nomeVisivel(atacante)} usou ${nome}!`, {golpe:nome, tipoGolpe:g.t, lado:souAliado ? 'aliado' : 'inimigo'});
    if (nome !== 'Mirror Move') estAtk.ultimoGolpe = nome;

    /* Snore e Sleep Talk só saem de quem está dormindo */
    if (ef.soSeDormindo && atacante.status !== 'sono'){
      this.ev('erro', 'Mas nada aconteceu.');
      return;
    }

    /* Protect/Detect do outro lado: golpe mirado nele não passa */
    if (estDef.protegido && this.miraNoOutro(g)){
      this.ev('erro', `${nomeVisivel(defensor)} se protegeu!`);
      estAtk.cortes = 0;
      return;
    }

    const prec = this.rolarPrecisao(atacante, defensor, estAtk, estDef, nome);
    if (!prec.acertou){
      this.ev('erro', `${nomeVisivel(atacante)} errou o golpe!`);
      estAtk.cortes = 0;
      /* confuso que falha a ação se machuca: 1 de dano */
      if (estAtk.penalConf){
        atacante.hp = Math.max(0, atacante.hp - 1);
        this.ev('dano', `${nomeVisivel(atacante)} tropeça na própria confusão e se machuca. (${atacante.hp}/${atacante.hpMax})`, {alvo:souAliado?'aliado':'inimigo', dano:1});
      }
      return;
    }

    if (g.c === 'status'){
      /* Splash e companhia não têm efeito nenhum — e é canônico que não
         tenham. O que não pode é o turno passar em branco, sem uma linha. */
      if (!g.ef){ this.ev('info', 'Mas nada aconteceu.'); return; }
      /* o boneco segura o que é jogado em cima de quem está atrás dele */
      if (estDef.substituto > 0 && this.miraNoOutro(g) && ef.acao !== 'soprar'){
        this.ev('erro', `O boneco segurou. Não teve efeito em ${nomeVisivel(defensor)}.`);
        return;
      }
      this.efeitoStatus(atacante, defensor, estAtk, estDef, g, nome);
      return;
    }

    if (ef.soDormindo && defensor.status !== 'sono'){
      this.ev('erro', `${nome} só funciona em alvos dormindo. Nada acontece.`);
      return;
    }

    /* poder que muda: Fury Cutter dobra a cada acerto seguido (até 160);
       Return e Frustration saem da amizade */
    /* poder que muda: Fury Cutter ganha 1 a cada acerto seguido (até +4);
       Return e Frustration saem da amizade, de 0 a 5 */
    let poder = null;
    const prG = PR_GOLPE[nome] || {};
    if (ef.corte){
      estAtk.cortes = Math.min(4, (estAtk.cortes || 0));
      poder = (prG.p || 1) + estAtk.cortes;
      estAtk.cortes++;
    }
    if (ef.amizade){
      const amizade = Math.max(0, Math.min(100, atacante.moral == null ? 70 : atacante.moral));
      poder = Math.round((ef.amizade === 'retorno' ? amizade : 100 - amizade) / 20);
    }

    const r = this.calcularDano(atacante, defensor, estAtk, estDef, nome, poder, prec);
    r.contas.forEach(m => this.ev('rolagem', m));
    r.msgs.forEach(m => this.ev('info', m));
    if (r.efic === 0) return;

    /* o boneco apanha no lugar */
    if (estDef.substituto > 0){
      estDef.substituto = Math.max(0, estDef.substituto - r.dano);
      this.ev('info', estDef.substituto > 0
        ? `O boneco de ${nomeVisivel(defensor)} segurou o golpe.`
        : `O boneco de ${nomeVisivel(defensor)} se desfez.`);
      if (ef.recarga) estAtk.recarregando = true;
      return;
    }

    if (estDef.aguentando && r.dano >= defensor.hp){
      defensor.hp = 1;
      this.ev('dano', `${nomeVisivel(defensor)} sofreu ${r.dano} de dano.`, {alvo:souAliado?'inimigo':'aliado', dano:r.dano});
      this.ev('cura', `${nomeVisivel(defensor)} aguentou firme! Fica de pé com 1 de HP.`);
    } else if (this.aguentou(defensor, r.dano)){
      defensor.hp = 1;
      this.ev('dano', `${nomeVisivel(defensor)} sofreu ${r.dano} de dano.`, {alvo:souAliado?'inimigo':'aliado', dano:r.dano});
      this.ev('cura', `A Faixa Firme segurou. ${nomeVisivel(defensor)} fica de pé com 1 de HP.`);
    } else {
      defensor.hp = Math.max(0, defensor.hp - r.dano);
      this.ev('dano', `${nomeVisivel(defensor)} sofreu ${r.dano} de dano. (${defensor.hp}/${defensor.hpMax})`, {alvo:souAliado?'inimigo':'aliado', dano:r.dano});
    }

    if (ef.drena){
      const cura = Math.max(1, Math.round(r.dano * ef.drena));
      atacante.hp = Math.min(atacante.hpMax, atacante.hp + cura);
      this.ev('cura', `${nomeVisivel(atacante)} drenou ${cura} de HP.`);
    }
    if (ef.recuo){
      const rec = Math.max(1, Math.round(r.dano * ef.recuo));
      atacante.hp = Math.max(0, atacante.hp - rec);
      this.ev('dano', `${nomeVisivel(atacante)} sofreu ${rec} de recuo.`);
    }
    if (ef.recarga) estAtk.recarregando = true;
    if (ef.confundeSe && Dados.chance(50)){
      estAtk.confuso = Dados.entre(2,4);
      this.ev('status', `${nomeVisivel(atacante)} ficou confus${pron(atacante).o} pela própria fúria!`);
    }
    /* Wrap, Bind, Clamp, Fire Spin: prende de 2 a 5 turnos (2ª geração) */
    if (ef.preso && defensor.hp > 0 && !estDef.presoTurnos){
      estDef.presoTurnos = Dados.entre(2, 5);
      estDef.presoPor = nome;
      this.ev('status', `${nomeVisivel(defensor)} ficou pres${pron(defensor).o} por ${nome}!`);
    }
    if (ef.tipo && ef.chance && defensor.hp > 0 && this.sorteEfeito(nome, ef.chance)){
      if (ef.tipo === 'recuo'){
        estDef.recuou = true;
        this.ev('status', `${nomeVisivel(defensor)} se encolheu de medo!`);
      } else if (ef.tipo === 'confusao'){
        this.confundir(defensor, estDef);
      } else if (!this.salvaguarda(defensor) && this.aplicarStatus(defensor, ef.tipo, ef.grave)){
        this.ev('status', `${nomeVisivel(defensor)} está com ${ef.tipo}!`);
      }
    }
    /* efeito de atributo de golpe de dano: só na chance dos jogos */
    if (ef.baixa && defensor.hp > 0 && this.sorteEfeito(nome, ef.chance || 100))
      this.mudarEstagio(defensor, estDef, ef.baixa, -1, true);
    if (ef.sobe && atacante.hp > 0 && this.sorteEfeito(nome, ef.chance || 100))
      this.mudarEstagio(atacante, estAtk, ef.sobe, +1, false);
  },

  /* Efeito secundário: com dados de chance do livro, qualquer 6 pega;
     golpe sem essa ficha segue a chance dos jogos */
  sorteEfeito(nome, pct){
    const cd = (PR_GOLPE[nome] || {}).cd;
    if (cd) return Dados.chanceDados(cd, `Chance de ${nome}`);
    return Dados.chance(pct);
  },

  /* O golpe é jogado em cima do outro? (Protect e o boneco só param esses) */
  miraNoOutro(g){
    if (g.c !== 'status') return true;
    const e = g.ef || {};
    if (e.baixa || e.tipo) return true;
    return ['semente', 'desabilitar', 'fanfarra', 'atracao', 'pesadelo', 'transformar', 'identificar', 'soprar'].includes(e.acao)
;
  },

  /* muda um estágio, com o texto dos jogos; a Névoa segura queda que vem
     do outro lado */
  mudarEstagio(p, est, chave, delta, doOutro){
    if (delta < 0 && doOutro && this.lados && this.lados[this.ladoDe(p)].nevoa > 0){
      this.ev('erro', `A névoa protege ${nomeVisivel(p)}.`);
      return false;
    }
    const antes = est[chave] || 0;
    const depois = Math.max(-6, Math.min(6, antes + delta));
    const nomeStat = NOME_ESTAGIO[chave] || chave;
    if (depois === antes){
      this.ev('erro', `${nomeStat[0].toUpperCase() + nomeStat.slice(1)} de ${nomeVisivel(p)} não ${delta > 0 ? 'sobe' : 'desce'} mais.`);
      return false;
    }
    est[chave] = depois;
    const forte = Math.abs(delta) >= 2;
    const verbo = delta > 0 ? (forte ? 'subiu muito' : 'subiu') : (forte ? 'caiu muito' : 'caiu');
    this.ev('status', `${nomeStat[0].toUpperCase() + nomeStat.slice(1)} de ${nomeVisivel(p)} ${verbo}!`,
            {estagio:{lado:this.ladoDe(p), delta}});
    return true;
  },

  confundir(p, est){
    if (this.salvaguarda(p)) return false;
    if (est.confuso > 0){ this.ev('erro', `${nomeVisivel(p)} já está confus${pron(p).o}.`); return false; }
    est.confuso = Dados.entre(2, 5);
    this.ev('status', `${nomeVisivel(p)} ficou confus${pron(p).o}!`);
    return true;
  },

  ladoDe(p){ return p === this.aliado ? 'aliado' : 'inimigo'; },
  salvaguarda(p){
    if (this.lados && this.lados[this.ladoDe(p)].salva > 0){
      this.ev('erro', `O Safeguard protege ${nomeVisivel(p)}.`);
      return true;
    }
    return false;
  },

  efeitoStatus(atacante, defensor, estAtk, estDef, g, nome){
    const e = g.ef || {};
    if (e.acao) return this.acaoEspecial(e.acao, atacante, defensor, estAtk, estDef, nome);
    if (e.clima){
      if (this.clima && this.clima.tipo === e.clima){ this.ev('erro', 'Mas nada aconteceu.'); return; }
      this.clima = {tipo:e.clima, turnos:5};
      this.ev('status', CLIMA_TEXTO[e.clima].comeca, {clima:e.clima});
      return;
    }
    if (e.cura){
      if (atacante.hp >= atacante.hpMax){ this.ev('erro', `O HP de ${nomeVisivel(atacante)} já está cheio.`); return; }
      const antes = atacante.hp;
      atacante.hp = Math.min(atacante.hpMax, atacante.hp + Math.round(atacante.hpMax * e.cura));
      if (e.dorme){ atacante.status = 'sono'; atacante.statusTurnos = 2; }   // Rest: 2 sucessos pra acordar
      this.ev('cura', `${nomeVisivel(atacante)} recuperou ${atacante.hp - antes} de HP.`);
      return;
    }
    if (e.sobe){ this.mudarEstagio(atacante, estAtk, e.sobe, e.forte ? 2 : 1, false); return; }
    if (e.baixa){ this.mudarEstagio(defensor, estDef, e.baixa, e.forte ? -2 : -1, true); return; }
    if (e.tipo === 'confusao'){ this.confundir(defensor, estDef); return; }
    if (e.tipo){
      if (this.salvaguarda(defensor)) return;
      if (this.aplicarStatus(defensor, e.tipo, e.grave))
        this.ev('status', `${nomeVisivel(defensor)} está com ${e.tipo}${e.grave?' GRAVE':''}!`);
      else
        this.ev('erro', `Não teve efeito em ${nomeVisivel(defensor)}.`);
    }
  },

  /* ---------- golpes que não mexem em número: mexem na luta ---------- */
  acaoEspecial(acao, atk, def, estAtk, estDef, nome){
    const eu = nomeVisivel(atk), ele = nomeVisivel(def);
    const meuLado = this.lados[this.ladoDe(atk)];
    const falhou = () => { this.ev('erro', 'Mas não funcionou.'); };
    const selvagem = this.tipo === 'selvagem' || this.tipo === 'lendario';
    switch (acao){

      case 'foco':
        if (estAtk.focado) return falhou();
        estAtk.focado = true;
        return this.ev('status', `${eu} está concentrad${pron(atk).o}. Acerto crítico fica mais fácil.`);

      case 'substituto': {
        const custo = Math.max(1, Math.floor(atk.hpMax / 4));
        if (estAtk.substituto > 0){ return this.ev('erro', `${eu} já tem um boneco na frente.`); }
        if (atk.hp <= custo){ return this.ev('erro', `${eu} não tem HP pra fazer o boneco.`); }
        atk.hp -= custo;
        estAtk.substituto = custo + 1;
        return this.ev('status', `${eu} gastou ${custo} de HP e pôs um boneco na frente.`);
      }

      case 'conversao': {
        const tipos = [...new Set(atk.golpes.map(x => (GOLPES[x.nome] || {}).t).filter(t => t && !atk.tipos.includes(t)))];
        if (!tipos.length) return falhou();
        if (!estAtk.origTipos) estAtk.origTipos = atk.tipos.slice();
        const t = Dados.escolher(tipos);
        atk.tipos = [t];
        return this.ev('status', `${eu} virou do tipo ${t}!`);
      }

      case 'reflexo': case 'tela': case 'nevoa': case 'salvaguarda': {
        const chave = {reflexo:'reflexo', tela:'tela', nevoa:'nevoa', salvaguarda:'salva'}[acao];
        if (meuLado[chave] > 0) return falhou();
        meuLado[chave] = 5;
        const txt = {
          reflexo:'Uma parede de luz levanta: golpe físico passa pela metade.',
          tela:'Uma tela de luz levanta: golpe especial passa pela metade.',
          nevoa:'Uma névoa branca cobre o seu lado: ninguém baixa atributo de quem está nela.',
          salvaguarda:'Um véu cobre o seu lado: nenhuma condição pega em quem está nele.'
        }[acao];
        return this.ev('status', txt.replace('o seu lado', this.ladoDe(atk) === 'aliado' ? 'o seu lado' : 'o lado de lá'));
      }

      case 'haze':
        for (const est of [this.estAliado, this.estInimigo])
          for (const k of ['atk','def','spa','spd','spe','precisao','evasao']) est[k] = 0;
        return this.ev('status', 'Uma névoa escura desfaz todas as mudanças de atributo dos dois lados.');

      case 'soprar': {
        if (def.nivel > atk.nivel && Dados.chance(50)) return falhou();
        if (selvagem){
          this.ev('fuga', this.ladoDe(atk) === 'aliado'
            ? `${ele} é soprad${pron(def).o} pra longe. A batalha acabou.`
            : `${eu} te soprou pra fora da briga. A batalha acabou.`);
          return this.encerrar('fuga');
        }
        return this.trocaForcada(def);
      }

      case 'teleporte':
        if (!selvagem) return falhou();
        this.ev('fuga', this.ladoDe(atk) === 'aliado'
          ? `${eu} te leva junto num piscar. Vocês saíram da briga.`
          : `${eu} some num piscar. A batalha acabou.`);
        return this.encerrar('fuga');

      case 'desabilitar': {
        const alvo = estDef.ultimoGolpe;
        if (!alvo || estDef.desabilitado || !def.golpes.some(x => x.nome === alvo)) return falhou();
        estDef.desabilitado = {nome:alvo, turnos:Dados.entre(2, 7)};
        return this.ev('status', `${alvo} de ${ele} foi desabilitado!`);
      }

      case 'transformar':
        if (estAtk.transformado || estDef.transformado) return falhou();
        this.transformar(atk, def, estAtk, estDef);
        return this.ev('status', `${eu} virou uma cópia de ${ele}!`, {transformou:true});

      case 'espelho': {
        const alvo = estDef.ultimoGolpe;
        if (!alvo || alvo === 'Mirror Move' || !GOLPES[alvo]) return falhou();
        return this.usarGolpe(atk, def, estAtk, estDef, -1, atk === this.aliado, alvo);
      }

      case 'semente':
        if (def.tipos.includes('Grama') || estDef.semente) return this.ev('erro', `Não teve efeito em ${ele}.`);
        estDef.semente = true;
        return this.ev('status', `${ele} foi semead${pron(def).o}! Vai perder HP todo turno pra quem plantou.`);

      case 'identificar':
        estDef.identificado = true;
        estDef.evasao = Math.min(0, estDef.evasao || 0);
        return this.ev('status', `${eu} identificou ${ele}. Esquiva e imunidade de Fantasma não valem mais.`);

      case 'fanfarra':
        this.mudarEstagio(def, estDef, 'atk', +2, false);
        this.confundir(def, estDef);
        return;

      case 'proteger': case 'aguentar': {
        const chance = 100 / Math.pow(2, estAtk.seguidas || 0);
        if (!Dados.chance(chance)){ estAtk.seguidas = 0; return falhou(); }
        estAtk.seguidas = (estAtk.seguidas || 0) + 1;
        if (acao === 'proteger'){ estAtk.protegido = true; return this.ev('status', `${eu} se fechou numa defesa.`); }
        estAtk.aguentando = true;
        return this.ev('status', `${eu} firmou os pés pra aguentar.`);
      }

      case 'maldicao':
        if (atk.tipos.includes('Fantasma')){
          if (estDef.maldito) return falhou();
          const custo = Math.max(1, Math.floor(atk.hpMax / 2));
          atk.hp = Math.max(0, atk.hp - custo);
          estDef.maldito = true;
          return this.ev('dano', `${eu} cortou metade do próprio HP e amaldiçoou ${ele}!`);
        }
        this.mudarEstagio(atk, estAtk, 'spe', -1, false);
        this.mudarEstagio(atk, estAtk, 'atk', +1, false);
        this.mudarEstagio(atk, estAtk, 'def', +1, false);
        return;

      case 'atracao': {
        const a = generoDe(atk), b = generoDe(def);
        if (!a || !b || a === b || estDef.apaixonado) return falhou();
        estDef.apaixonado = true;
        return this.ev('status', `${ele} se apaixonou por ${eu}!`);
      }

      case 'pesadelo':
        if (def.status !== 'sono' || estDef.pesadelo) return falhou();
        estDef.pesadelo = true;
        return this.ev('status', `${ele} começou a ter um pesadelo!`);

      case 'copiar':
        for (const k of ['atk','def','spa','spd','spe','precisao','evasao']) estAtk[k] = estDef[k] || 0;
        return this.ev('status', `${eu} copiou as mudanças de atributo de ${ele}.`);

      case 'sonambulo': {
        const opcoes = atk.golpes.map(x => x.nome).filter(n => n !== 'Sleep Talk' && GOLPES[n] && !(GOLPES[n].ef || {}).carga);
        if (!opcoes.length) return falhou();
        return this.usarGolpe(atk, def, estAtk, estDef, -1, atk === this.aliado, Dados.escolher(opcoes));
      }
    }
  },

  /* Transform: vira a cópia do outro — tipos, atributos (menos HP),
     golpes com 5 PP e estágios. Desfaz quando sai da luta. */
  transformar(atk, def, estAtk, estDef){
    estAtk.transformado = {tipos:atk.tipos.slice(), stats:Object.assign({}, atk.stats), golpes:atk.golpes};
    atk.tipos = def.tipos.slice();
    atk.stats = Object.assign({}, def.stats, {hp:atk.stats.hp});
    atk.golpes = def.golpes.map(x => ({nome:x.nome, pp:5, ppMax:5}));
    atk.transformadoEm = def.dex;
    for (const k of ['atk','def','spa','spd','spe','precisao','evasao']) estAtk[k] = estDef[k] || 0;
  },
  desfazerMudancas(p, est){
    if (!p || !est) return;
    if (est.transformado){
      p.tipos = est.transformado.tipos; p.stats = est.transformado.stats; p.golpes = est.transformado.golpes;
      delete p.transformadoEm;
      est.transformado = null;
    }
    if (est.origTipos){ p.tipos = est.origTipos; est.origTipos = null; }
  },

  /* Roar e Whirlwind em batalha de treinador: o outro volta pra bola e
     entra um qualquer do time. Sem ninguém pra entrar, não funciona. */
  trocaForcada(def){
    if (def === this.aliado){
      const outros = Estado.dados.time.filter(p => estaVivo(p) && p.uid !== def.uid);
      if (!outros.length) return this.ev('erro', 'Mas não funcionou.');
      const novo = Dados.escolher(outros);
      this.desfazerMudancas(def, this.estAliado);
      this.ev('info', `${nomeVisivel(def)} é arrancado da luta. ${nomeVisivel(novo)} entra no lugar!`);
      this.aliado = novo;
      this.estAliado = this.novoEstado();
      if (this.participantes) this.participantes.add(novo.uid);
      this.entrouEmCampo(novo, this.estAliado);
      return;
    }
    if (!this.timeInimigo || !this.timeInimigo.length) return this.ev('erro', 'Mas não funcionou.');
    const i = Dados.entre(0, this.timeInimigo.length - 1);
    const novo = this.timeInimigo.splice(i, 1, def)[0];
    this.desfazerMudancas(def, this.estInimigo);
    this.ev('info', `${nomeVisivel(def)} é arrancado da luta. ${this.treinador || 'O treinador'} manda ${nomeVisivel(novo)}!`);
    this.inimigo = novo;
    this.estInimigo = this.novoEstado();
    this.participantes = new Set([this.aliado.uid]);
    this.entrouEmCampo(novo, this.estInimigo);
  },

  /* ---------- o par ----------
     Quando um Pokémon cai e o par dele está no mesmo time, de pé, o par
     viu. Na próxima vez que ele entrar nesta luta, entra com Força e
     Especial um ponto acima. Vale pros dois lados: o time do treinador
     também tem par. */
  parViuCair(caido, time){
    if (!this.viuOParCair) this.viuOParCair = {};
    const par = parDe(caido, (time || []).filter(x => estaVivo(x)));
    if (!par || this.viuOParCair[par.uid]) return;
    this.viuOParCair[par.uid] = nomeVisivel(caido);
  },
  entrouEmCampo(p, est){
    const nomePar = this.viuOParCair && this.viuOParCair[p.uid];
    if (!nomePar) return;
    delete this.viuOParCair[p.uid];
    /* nome que você ainda não sabe continua sem nome */
    const quem = nomePar === '???' ? 'o outro' : nomePar;
    this.ev('status', `${nomeVisivel(p)} viu ${quem} cair e entra diferente.`);
    this.mudarEstagio(p, est, 'atk', 1);
    this.mudarEstagio(p, est, 'spa', 1);
  },

  /* ---------- fim de turno ---------- */
  fimDeTurno(p, est, quem){
    if (p.hp <= 0) return;
    /* veneno: 2 por rodada; o grave (Toxic) sobe 2 a cada rodada.
       queimadura: 1 por rodada. Números do livro. */
    if (p.status === 'veneno'){
      p.venenoRodadas = (p.venenoRodadas || 0) + 1;
      const d = p.statusGrave ? 2 * p.venenoRodadas : 2;
      p.hp = Math.max(0, p.hp - d);
      this.ev('dano', `${nomeVisivel(p)} sofre ${d} pelo veneno. (${p.hp}/${p.hpMax})`, {causa:'veneno'});
    }
    if (p.status === 'queimadura'){
      const d = 1;
      p.hp = Math.max(0, p.hp - d);
      this.ev('dano', `${nomeVisivel(p)} sofre ${d} pela queimadura. (${p.hp}/${p.hpMax})`, {causa:'queimadura'});
    }
    /* o que os golpes deixaram grudado, na ordem dos jogos */
    if (est){
      const outro = p === this.aliado ? this.inimigo : this.aliado;
      const tira = (frac, texto, causa) => {
        if (p.hp <= 0) return 0;
        const d = Math.max(1, Math.floor(p.hpMax / frac));
        p.hp = Math.max(0, p.hp - d);
        this.ev('dano', `${texto(d)} (${p.hp}/${p.hpMax})`, {causa});
        return d;
      };
      if (est.semente && outro && outro.hp > 0){
        const d = Math.min(p.hp, 1);
        p.hp = Math.max(0, p.hp - d);
        outro.hp = Math.min(outro.hpMax, outro.hp + d);
        this.ev('dano', `A semente suga ${d} de ${nomeVisivel(p)} pra ${nomeVisivel(outro)}. (${p.hp}/${p.hpMax})`, {causa:'semente'});
      }
      if (est.pesadelo && p.status === 'sono') tira(4, d => `${nomeVisivel(p)} se debate no pesadelo e perde ${d}.`, 'pesadelo');
      if (est.maldito) tira(4, d => `A maldição corrói ${nomeVisivel(p)}: ${d} de dano.`, 'maldicao');
      if (est.presoTurnos > 0 && p.hp > 0){
        tira(16, d => `${nomeVisivel(p)} sofre ${d} de ${est.presoPor}.`, 'preso');
        if (--est.presoTurnos <= 0){ this.ev('status', `${nomeVisivel(p)} se soltou de ${est.presoPor}.`); est.presoPor = null; }
      }
      if (est.desabilitado && --est.desabilitado.turnos <= 0){
        this.ev('status', `${est.desabilitado.nome} de ${nomeVisivel(p)} voltou a funcionar.`);
        est.desabilitado = null;
      }
    }
    /* item segurado: regeneração lenta */
    const seg = efeitoSegurado(p);
    if (seg && seg.regen && p.hp > 0 && p.hp < p.hpMax){
      const c = seg.regen;
      const antes = p.hp;
      p.hp = Math.min(p.hpMax, p.hp + c);
      this.ev('cura', `${nomeVisivel(p)} belisca o ${p.segurando} e recupera ${p.hp - antes}. (${p.hp}/${p.hpMax})`);
    }
  },

  /* Fim de turno do clima: a areia fere quem não é Pedra, Terrestre ou
     Metálico (1 de dano), e o clima acaba sozinho no quinto turno. */
  /* Reflect, Light Screen, Mist e Safeguard contam os cinco turnos */
  passarLados(){
    const NOME = {reflexo:'Reflect', tela:'Light Screen', nevoa:'Mist', salva:'Safeguard'};
    for (const lado of ['aliado', 'inimigo']){
      const L = this.lados && this.lados[lado];
      if (!L) continue;
      for (const k of Object.keys(NOME)){
        if (L[k] > 0 && --L[k] === 0)
          this.ev('status', `${NOME[k]} ${lado === 'aliado' ? 'do seu lado' : 'do lado de lá'} acabou.`);
      }
    }
  },

  passarClima(){
    this.passarLados();
    if (!this.clima) return;
    if (this.clima.tipo === 'areia'){
      for (const p of [this.aliado, this.inimigo]){
        if (!p || p.hp <= 0 || p.tipos.some(t => ['Pedra', 'Terrestre', 'Metálico'].includes(t))) continue;
        const d = 1;
        p.hp = Math.max(0, p.hp - d);
        this.ev('dano', `A areia fere ${nomeVisivel(p)}. (${p.hp}/${p.hpMax})`, {causa:'areia'});
      }
    }
    if (--this.clima.turnos <= 0){
      const t = this.clima.tipo;
      this.clima = null;
      this.ev('status', CLIMA_TEXTO[t].acaba, {clima:null});
    }
  },

  /* Faixa Firme: uma vez por combate, não deixa cair de um golpe só */
  aguentou(p, danoPrevisto){
    const seg = efeitoSegurado(p);
    if (!seg || !seg.aguenta) return false;
    if (p.faixaUsada) return false;
    if (p.hp - danoPrevisto > 0) return false;
    if (p.hp <= 1) return false;
    p.faixaUsada = true;
    return true;
  },

  /* ---------- IA ---------- */
  iaEscolher(p, alvo, estP, estAlvo){
    const disponiveis = p.golpes.map((g,i) => ({i, g}))
      .filter(x => x.g.pp > 0 && !(estP.desabilitado && estP.desabilitado.nome === x.g.nome));
    if (!disponiveis.length) return 0;
    const nat = NATUREZAS[p.natureza] || {};
    const pontuar = (x) => {
      const G = GOLPES[x.g.nome];
      const E = G.ef || {};
      /* o que não vai funcionar agora não se escolhe */
      if (E.soSeDormindo && p.status !== 'sono') return 0;
      if (p.status === 'sono' && (x.g.nome === 'Sleep Talk' || x.g.nome === 'Snore')) return 90;
      if (E.soDormindo && alvo.status !== 'sono') return 0;
      if (E.acao === 'pesadelo' && (alvo.status !== 'sono' || estAlvo.pesadelo)) return 0;
      if (E.acao === 'semente' && (estAlvo.semente || alvo.tipos.includes('Grama'))) return 0;
      if (E.acao === 'substituto' && (estP.substituto > 0 || p.hp <= p.hpMax / 4)) return 0;
      if (E.acao === 'foco' && estP.focado) return 0;
      if (E.acao === 'desabilitar' && (estAlvo.desabilitado || !estAlvo.ultimoGolpe)) return 0;
      if (E.acao === 'atracao' && (estAlvo.apaixonado || !generoDe(p) || generoDe(p) === generoDe(alvo))) return 0;
      if (['reflexo','tela','nevoa','salvaguarda'].includes(E.acao)){
        const L = this.lados[p === this.aliado ? 'aliado' : 'inimigo'];
        if (L[{reflexo:'reflexo', tela:'tela', nevoa:'nevoa', salvaguarda:'salva'}[E.acao]] > 0) return 0;
      }
      if ((E.acao === 'proteger' || E.acao === 'aguentar') && estP.seguidas > 0) return 3;
      if (E.acao === 'transformar' && estP.transformado) return 0;
      if (E.tipo === 'confusao' && G.c === 'status' && estAlvo.confuso > 0) return 0;
      if (G.c === 'status'){
        /* clima que já está valendo não se chama de novo */
        if (G.ef && G.ef.clima) return (this.clima && this.clima.tipo === G.ef.clima) ? 0 : 40;
        if (alvo.status || (G.ef && G.ef.tipo && alvo.status)) return 5;
        return (p.hp / p.hpMax > 0.6) ? 45 : 20;
      }
      const ef = eficacia(G.t, alvo.tipos);
      if (ef === 0) return 0;
      /* quanto de dano ele espera: metade da parada, mais a fraqueza */
      const fis = G.c === 'fis';
      const PR = PR_GOLPE[x.g.nome] || {};
      const pw = PR.fixo ? 0 : (PR.p || Math.max(1, Math.round((G.p || 40) / 25)));
      const a = this.valorAtrib(p, estP, this.melhorAtrib(p, estP, PR.d, fis ? 'for' : 'esp'));
      const d = PR.ign ? 0 : this.attr(alvo, estAlvo, fis ? 'vit' : 'ins');
      let s = PR.fixo ? PR.fixo
            : (PR.posto || PR.metade) ? DADOS_POR_POSTO[postoDoNivel(p.nivel)] / 2
            : Math.max(1, (a + pw + (p.tipos.includes(G.t) ? 1 : 0) - d) / 2 + Math.round(Math.log2(ef)));
      s *= Math.max(0.2, 1 - (PR.r || 0) * 0.2);
      if (PR.dupla) s *= 2; if (PR.tripla) s *= 3; if (PR.suc) s *= 1.6;
      s *= 20;
      if (nat.agressiva) s *= 1.1;
      return s;
    };
    disponiveis.sort((a,b) => pontuar(b) - pontuar(a));
    // não é uma máquina perfeita: às vezes erra a escolha
    if (disponiveis.length > 1 && Dados.chance(this.erroIA != null ? this.erroIA : 22)) return disponiveis[1].i;
    return disponiveis[0].i;
  },

  /* ---------- AÇÃO DO JOGADOR: resolve o turno inteiro ---------- */
  acao(acao){
    this.eventos = [];
    if (!this.ativo) return {eventos:[], fim:this.fim};
    this.turno++;
    /* Protect e Endure valem só pro turno em que foram usados */
    for (const est of [this.estAliado, this.estInimigo]){ est.protegido = false; est.aguentando = false; }

    if (this.fase === 'ameaca') return this.acaoAmeaca(acao);

    // ações que não gastam o turno de golpe
    if (acao.tipo === 'pokedex') return this.escanear();
    if (acao.tipo === 'fugir')  return this.tentarFugir();
    if (acao.tipo === 'bola'){
      if (this.tipo === 'treinador'){
        this.eventos = [];
        this.turno--;
        this.ev('erro', `${this.treinador || 'O treinador'} chama de volta antes da Pokébola chegar perto. Pokémon dos outros não se captura — e num ginásio isso encerra a sua vez.`);
        return {eventos:this.eventos, fim:null};
      }
      return this.tentarCaptura(acao.nome);
    }
    if (acao.tipo === 'item')   { this.usarItemEmCombate(acao.nome, acao.alvoUid); return this.turnoInimigoSozinho(); }
    if (acao.tipo === 'trocar'){
      if (this.estAliado.presoTurnos > 0 && estaVivo(this.aliado)){
        this.eventos = []; this.turno--;
        this.ev('erro', `${nomeVisivel(this.aliado)} está pres${pron(this.aliado).o} por ${this.estAliado.presoPor} e não consegue voltar.`);
        return {eventos:this.eventos, fim:null};
      }
      /* Substituir quem desmaiou não é trocar: como nos jogos, o novo
         entra e o turno começa com ele, sem apanhar de graça. */
      const substituicao = !estaVivo(this.aliado);
      this.trocarPokemon(acao.uid);
      if (substituicao){ this.turno--; return {eventos:this.eventos, fim:null}; }
      return this.turnoInimigoSozinho();
    }

    // ordem por velocidade (prioridade primeiro)
    const gJog = GOLPES[this.aliado.golpes[acao.indice]?.nome || 'Tackle'];
    const iIA  = this.iaEscolher(this.inimigo, this.aliado, this.estInimigo, this.estAliado);
    const gIA  = GOLPES[this.inimigo.golpes[iIA]?.nome || 'Tackle'];
    const prioJ = (gJog.ef && gJog.ef.prioridade) || 0;
    const prioI = (gIA.ef && gIA.ef.prioridade) || 0;
    const vJ = this.iniciativa(this.aliado, this.estAliado);
    const vI = this.iniciativa(this.inimigo, this.estInimigo);
    let jogadorPrimeiro;
    if (prioJ !== prioI) jogadorPrimeiro = prioJ > prioI;
    else if (vJ !== vI)  jogadorPrimeiro = vJ > vI;
    else                 jogadorPrimeiro = this.attr(this.aliado, this.estAliado, 'des') !== this.attr(this.inimigo, this.estInimigo, 'des')
                           ? this.attr(this.aliado, this.estAliado, 'des') > this.attr(this.inimigo, this.estInimigo, 'des')
                           : Dados.chance(50);

    this.ev('turno', `— Turno ${this.turno} — (Iniciativa ${vJ} vs ${vI})`);

    const agirJogador = () => {
      if (!this.ativo || this.aliado.hp <= 0 || this.inimigo.hp <= 0) return;
      if (this.estAliado.recuou){ this.estAliado.recuou = false; this.ev('status', `${nomeVisivel(this.aliado)} está encolhido e não ataca.`); return; }
      if (!this.podeAgir(this.aliado, this.estAliado, true, (this.aliado.golpes[acao.indice] || {}).nome)) return;
      this.usarGolpe(this.aliado, this.inimigo, this.estAliado, this.estInimigo, acao.indice, true);
    };
    const agirInimigo = () => {
      if (!this.ativo || this.aliado.hp <= 0 || this.inimigo.hp <= 0) return;
      if (this.estInimigo.recuou){ this.estInimigo.recuou = false; this.ev('status', `${nomeVisivel(this.inimigo)} está encolhido e não ataca.`); return; }
      if (!this.podeAgir(this.inimigo, this.estInimigo, false, (this.inimigo.golpes[iIA] || {}).nome)) return;
      this.usarGolpe(this.inimigo, this.aliado, this.estInimigo, this.estAliado, iIA, false);
    };

    if (jogadorPrimeiro){ agirJogador(); agirInimigo(); }
    else { agirInimigo(); agirJogador(); }
    /* Roar, Whirlwind e Teleport podem acabar a luta no meio do turno */
    if (!this.ativo) return {eventos:this.eventos, fim:this.fim};

    if (this.aliado.hp > 0 && this.inimigo.hp > 0){
      this.fimDeTurno(this.aliado, this.estAliado, 'aliado');
      this.fimDeTurno(this.inimigo, this.estInimigo, 'inimigo');
      this.passarClima();
    }
    return this.verificarFim();
  },

  /* Escanear não gasta o turno — mas só dá uma vez por batalha */
  escanear(){
    this.eventos = [];
    this.turno--;
    if (!Estado.dados.flags.tem_pokedex){
      this.ev('erro', 'Você não tem Pokédex.');
      return {eventos:this.eventos, fim:null};
    }
    this.pdexUsada = true;
    const p = this.inimigo;
    const esp = DEX[p.dex];
    const jaTinha = Estado.conheceu(p.dex);
    const novo = Estado.catalogou(p.dex);
    /* espécie já catalogada não se cadastra de novo: a Pokédex só abre a ficha */
    this.ev('pokedex', jaTinha ? `A Pokédex abre a ficha de ${esp.nome}.` : `Você aponta a Pokédex. Ela leva três segundos e apita.`);
    this.ev('pokedex', `${esp.nome} — tipo ${p.tipos.join('/')}.`);
    this.ev('pokedex', `Posto ${nomePosto(p.nivel)} · HP ${p.hpMax} · FOR ${p.stats.for} · DES ${p.stats.des} · VIT ${p.stats.vit} · ESP ${p.stats.esp} · INS ${p.stats.ins}`);
    const pr = PR_ESPECIE[p.dex];
    if (pr) this.ev('pokedex', `Teto da espécie: FOR ${pr[6]} · DES ${pr[7]} · VIT ${pr[8]} · ESP ${pr[9]} · INS ${pr[10]} — HP base ${pr[0]}.`);
    if (p.shiny)
      this.ev('brilhante', 'Anomalia cromática confirmada. A Pokédex abre um campo que você nunca tinha visto abrir.');
    if (novo) this.ev('pokedex', `Registro novo: ${esp.nome} catalogado.`);
    return {eventos:this.eventos, fim:null};
  },

  turnoInimigoSozinho(){
    if (this.inimigo.hp > 0 && this.aliado.hp > 0){
      const i = this.iaEscolher(this.inimigo, this.aliado, this.estInimigo, this.estAliado);
      if (this.podeAgir(this.inimigo, this.estInimigo, false, (this.inimigo.golpes[i] || {}).nome)){
        this.usarGolpe(this.inimigo, this.aliado, this.estInimigo, this.estAliado, i, false);
      }
      if (!this.ativo) return {eventos:this.eventos, fim:this.fim};
      this.fimDeTurno(this.aliado, this.estAliado);
      this.fimDeTurno(this.inimigo, this.estInimigo);
      this.passarClima();
    }
    return this.verificarFim();
  },

  /* ---------- itens e troca ---------- */
  usarItemEmCombate(nome, alvoUid){
    const info = ITENS_INFO[nome];
    if (!info || !Estado.contaItem(nome)){ this.ev('erro', 'Você não tem esse item.'); return; }
    const alvo = Estado.dados.time.find(p => p.uid === alvoUid) || this.aliado;
    if (info.tipo === 'cura'){
      if (alvo.hp <= 0 && !alvo.morto){ this.ev('erro', `${nomeVisivel(alvo)} está desmaiad${pron(alvo).o} — Potion não resolve.`); return; }
      Estado.usarItem(nome);
      const antes = alvo.hp;
      alvo.hp = Math.min(alvo.hpMax, alvo.hp + info.valor);
      this.ev('cura', `Você usou ${nome}. ${nomeVisivel(alvo)} recuperou ${alvo.hp - antes} de HP.`);
    } else if (info.tipo === 'revive'){
      if (alvo.morto){
        this.ev('erro', `Você aplica o Revive em ${nomeVisivel(alvo)} e não acontece nada. Nem uma reação.`);
        this.ev('info', 'Tem uma diferença entre desmaiar e morrer, e você acabou de aprender qual é.');
        Estado.marcar('revive_nao_ressuscita');
        return;
      }
      if (alvo.hp > 0){ this.ev('erro', `${nomeVisivel(alvo)} não está desmaiad${pron(alvo).o}.`); return; }
      Estado.usarItem(nome);
      alvo.hp = Math.floor(alvo.hpMax / 2);
      this.ev('cura', `${nomeVisivel(alvo)} voltou a si com ${alvo.hp} de HP.`);
    } else if (info.tipo === 'status'){
      Estado.usarItem(nome);
      alvo.status = null; alvo.statusTurnos = 0;
      this.ev('cura', `${nomeVisivel(alvo)} teve as condições curadas.`);
    } else if (info.tipo === 'curaJogador'){
      Estado.usarItem(nome);
      Estado.curarJogador(info.valor);
      this.ev('cura', `Você se enfaixou. HP: ${Estado.j.hp}/${Estado.hpMaxJogador()}`);
    } else if (info.tipo === 'pp'){
      const g = alvo.golpes.find(x => x.pp < x.ppMax);
      if (!g){ this.ev('erro', `Os golpes de ${nomeVisivel(alvo)} estão cheios.`); return; }
      Estado.usarItem(nome);
      g.pp = Math.min(g.ppMax, g.pp + info.valor);
      this.ev('cura', `${g.nome} voltou a ter fôlego: ${g.pp}/${g.ppMax}.`);
    } else if (info.tipo === 'ppTodos'){
      Estado.usarItem(nome);
      alvo.golpes.forEach(g => { g.pp = Math.min(g.ppMax, g.pp + info.valor); });
      this.ev('cura', `Todos os golpes de ${nomeVisivel(alvo)} recuperaram um pouco.`);
    } else if (info.tipo === 'moral'){
      Estado.usarItem(nome);
      alvo.moral = Math.min(100, alvo.moral + info.valor);
      this.ev('natureza', `${nomeVisivel(alvo)} come no meio da briga, o que é ridículo, e depois te olha diferente.`);
    } else if (info.tipo === 'fuga'){
      if (this.tipo === 'treinador'){ this.ev('erro', 'Não dá pra jogar um boneco de pano na cara de um treinador e sair andando.'); return; }
      Estado.usarItem(nome);
      this.ev('vitoria', 'Você joga o boneco pro lado. O Pokémon vai atrás dele. Você sai andando sem correr, que é o jeito certo.');
      this.fugiuComBoneco = true;
      this.encerrar('fuga');
      return;
    } else {
      this.ev('erro', 'Esse item não serve aqui.');
    }
  },

  trocarPokemon(uid){
    const novo = Estado.dados.time.find(p => p.uid === uid);
    if (!novo || !estaVivo(novo)){ this.ev('erro', 'Esse Pokémon não pode lutar.'); return; }
    this.ev('info', estaVivo(this.aliado)
      ? `${nomeVisivel(this.aliado)} volta. Vai, ${nomeVisivel(novo)}!`
      : `Vai, ${nomeVisivel(novo)}!`);
    this.desfazerMudancas(this.aliado, this.estAliado);
    this.aliado = novo;
    this.estAliado = this.novoEstado();
    if (this.participantes) this.participantes.add(novo.uid);
    this.entrouEmCampo(novo, this.estAliado);
  },

  /* ---------- fuga ---------- */
  tentarFugir(){
    if (!this.fuga){ this.ev('erro', 'Não dá para fugir daqui.'); return this.turnoInimigoSozinho(); }
    if (this.estAliado.presoTurnos > 0){
      this.ev('erro', `${nomeVisivel(this.aliado)} está pres${pron(this.aliado).o} por ${this.estAliado.presoPor}. Não dá pra fugir.`);
      return this.turnoInimigoSozinho();
    }
    /* Fugir: Destreza + Atletismo de quem está na frente, contra os do
       selvagem. Empate é seu. */
    const nJ = this.attr(this.aliado, this.estAliado, 'des') + periciaDoNivel(this.aliado.nivel);
    const nI = this.attr(this.inimigo, this.estInimigo, 'des') + periciaDoNivel(this.inimigo.nivel);
    const rJ = Dados.pool(nJ, 'Fuga'), rI = Dados.pool(nI, 'Perseguição');
    const dorJ = this.dor(this.aliado);
    const sucJ = Math.max(0, rJ.suc - dorJ);
    this.ev('rolagem', `Fuga: DES + Atletismo = ${nJ}d6 → ${rJ.suc}${dorJ ? ` − ${dorJ} dor` : ''} · o selvagem: ${nI}d6 → ${rI.suc}`);
    if (sucJ >= rI.suc){
      this.ev('fuga', 'Você conseguiu escapar!');
      return this.encerrar('fuga');
    }
    this.ev('erro', 'Não deu para escapar!');
    return this.turnoInimigoSozinho();
  },

  /* ---------- captura ---------- */
  tentarCaptura(nomeBola){
    const r = Captura.tentar(this.inimigo, nomeBola, this);
    /* pelo ev, pra cada evento da bola levar a foto dos lutadores */
    r.eventos.forEach(e => this.ev(e.tipo, e.texto, e));
    if (r.capturou) return this.encerrar('captura', {pokemon:this.inimigo, bola:nomeBola});
    if (r.enfurecido){
      this.ev('perigo', `${nomeVisivel(this.inimigo)} está FURIOSO. Isso não vai acabar bem.`);
      return this.turnoInimigoSozinho();
    }
    return this.turnoInimigoSozinho();
  },

  /* ---------- verificação de fim ---------- */
  verificarFim(){
    if (this.inimigo.hp <= 0){
      this.ev('vitoria', this.tipo === 'selvagem'
        ? `${nomeVisivel(this.inimigo)} desmaiou e fugiu ${this.terreno().volta}. ${pron(this.inimigo).Ele} vai voltar.`
        : `${nomeVisivel(this.inimigo)} desmaiou!`);
      /* Como nos jogos: a experiência se divide por igual entre quem
         entrou contra esse adversário e ainda está de pé, e vale 1,5×
         quando o Pokémon era de um treinador. */
      const part = this.participantes || new Set([this.aliado.uid]);
      const time = (Estado.dados.time || []).filter(p => estaVivo(p));
      const quem = time.filter(p => part.has(p.uid));
      /* Exp. Share (2ª geração): quem segura fica com metade, entre
         eles; quem lutou divide a outra metade */
      const donos = time.filter(p => (efeitoSegurado(p) || {}).expShare);
      const total = Math.floor(expGanha(this.inimigo, this.aliado) * (this.tipo === 'treinador' ? 1.5 : 1));
      const metade = donos.length ? Math.floor(total / 2) : total;
      const ganhos = new Map();
      if (quem.length) quem.forEach(p => ganhos.set(p, Math.max(1, Math.floor(metade / quem.length))));
      if (donos.length) donos.forEach(p => ganhos.set(p, (ganhos.get(p) || 0) + Math.max(1, Math.floor((total - metade) / donos.length))));
      for (const [p, cada] of ganhos){
        /* a barra de experiência anda na tela: o evento leva de onde
           ela saiu, aonde chegou e quantas vezes encheu no meio */
        const pctDe = p.expProx ? Math.min(100, p.exp / p.expProx * 100) : 0, nvDe = p.nivel;
        const evs = ganharExp(p, cada);
        const pctPara = p.expProx ? Math.min(100, p.exp / p.expProx * 100) : 100;
        this.ev('exp', `${nomeVisivel(p)} ganhou ${cada} de experiência.`,
          {xp:{uid:p.uid, de:pctDe, para:pctPara, encheu:p.nivel - nvDe}});
        evs.forEach(e => {
          if (e.tipo === 'nivel') this.ev('nivel', `${nomeVisivel(p)} subiu para o nível ${e.nivel}!`);
          if (e.tipo === 'golpe') this.ev('golpeNovo', `${nomeVisivel(p)} aprendeu ${e.golpe}!`);
          /* não coube: a pergunta de qual esquecer vem logo depois, na tela */
          if (e.tipo === 'querAprender')
            this.ev('golpeNovo', `${nomeVisivel(p)} quer aprender ${e.golpe}, mas já sabe quatro golpes.`);
          /* evolução não se anuncia no meio da luta: ela vem depois, na tela própria */
        });
      }
      // time adversário com mais Pokémon
      if (this.timeInimigo && this.timeInimigo.length){
        this.parViuCair(this.inimigo, this.timeInimigo);
        const prox = this.timeInimigo.shift();
        if (this.revelaNatureza){ prox.naturezaVista = true; prox.nomeAnunciado = true; }
        this.ev('info', `${this.treinador} envia ${nomeVisivel(prox)} (Nv ${prox.nivel})${
          prox.naturezaVista ? ', ' + prox.natureza : ''}!`);
        this.desfazerMudancas(this.inimigo, this.estInimigo);
        this.inimigo = prox;
        this.estInimigo = this.novoEstado();
        this.participantes = new Set([this.aliado.uid]);
        this.entrouEmCampo(prox, this.estInimigo);
        /* os dois caíram juntos (Explosion, recuo): o de lá já mandou o
           próximo, e o seu ainda precisa ser trocado — senão a luta
           ficava com um desmaiado em campo e sem pergunta nenhuma */
        if (this.aliado.hp > 0) return {eventos:this.eventos, fim:null};
      } else return this.encerrar('vitoria');
    }

    if (this.aliado.hp <= 0){
      this.ev('derrota', `${nomeVisivel(this.aliado)} desmaiou.`);
      this.parViuCair(this.aliado, Estado.dados.time);
      const reservas = Estado.dados.time.filter(p => estaVivo(p) && p.uid !== this.aliado.uid);
      if (reservas.length){
        return {eventos:this.eventos, fim:null, precisaTrocar:true, reservas:reservas.map(p=>p.uid)};
      }
      // ninguém mais pode lutar
      if (this.tipo === 'selvagem' || this.tipo === 'lendario'){
        return this.avaliarAmeaca();
      }
      this.ev('derrota', 'Você não tem mais ninguém em pé. O treinador adversário venceu.');
      return this.encerrar('derrota');
    }
    return {eventos:this.eventos, fim:null};
  },

  /* ---------- ⚠️ O SELVAGEM ATACA O TREINADOR ---------- */
  avaliarAmeaca(){
    const nat = NATUREZAS[this.inimigo.natureza] || {};
    if (!nat.agressiva){
      this.ev('info', `${nomeVisivel(this.inimigo)} rosna, hostil, mas não avança sobre você. Some no mato.`);
      return this.encerrar('derrota');
    }
    const d = Dados.d20('O selvagem ataca você?');
    this.inimigo.naturezaVista = true;   // quem avança em gente mostra o jeito que tem
    this.ev('perigo', `${nomeVisivel(this.inimigo)} não recua: ${this.inimigo.natureza}, agressiv${pron(this.inimigo).o}. 1d20 = ${d} — ataca com 10+`);
    if (d < 10){
      this.ev('info', `${nomeVisivel(this.inimigo)} te encara por um segundo longo demais… e vai embora.`);
      return this.encerrar('derrota');
    }
    this.fase = 'ameaca';
    this.ev('perigo', `${nomeVisivel(this.inimigo)} avança em VOCÊ. Não tem mais Pokémon entre vocês dois.`);
    return {eventos:this.eventos, fim:null, ameaca:true};
  },

  acaoAmeaca(acao){
    if (acao.tipo === 'fugirAmeaca'){
      const d = Dados.d10('Fuga do selvagem');
      const total = d + Estado.j.status.forca;
      this.ev('info', `Fuga: 1d10(${d}) + Força(${Estado.j.status.forca}) = ${total} — precisa ≥ 7`);
      if (total >= 7){
        this.ev('fuga', this.terreno().fuga);
        return this.encerrar('escapou');
      }
      this.ev('erro', 'Você tropeça. Ele te alcança.');
      return this.golpeNoJogador();
    }
    if (acao.tipo === 'bola'){
      if (this.tipo === 'treinador'){
        this.ev('erro', 'Não se joga Pokébola no Pokémon de outro treinador.');
        return {eventos:this.eventos, fim:null};
      }
      const r = Captura.tentar(this.inimigo, acao.nome, this);
      /* pelo ev, pra cada evento da bola levar a foto dos lutadores */
    r.eventos.forEach(e => this.ev(e.tipo, e.texto, e));
      if (r.capturou) return this.encerrar('captura', {pokemon:this.inimigo, bola:acao.nome});
      return this.golpeNoJogador();
    }
    if (acao.tipo === 'item'){
      this.usarItemEmCombate(acao.nome, acao.alvoUid);
      const revivido = Estado.dados.time.find(p => estaVivo(p));
      if (revivido){
        this.ev('info', `${nomeVisivel(revivido)} se põe de pé entre você e ${nomeVisivel(this.inimigo)}.`);
        this.desfazerMudancas(this.aliado, this.estAliado);
        this.aliado = revivido;
        this.estAliado = this.novoEstado();
        this.entrouEmCampo(revivido, this.estAliado);
        this.fase = 'normal';
        return {eventos:this.eventos, fim:null, voltouAoCombate:true};
      }
      return this.golpeNoJogador();
    }
    if (acao.tipo === 'encarar'){
      const t = Dados.teste(Estado.j.status.carisma, 8, 'Carisma');
      this.ev('info', `Encarar: 1d10(${t.dado}) + Carisma(${t.bonus}) = ${t.total} — ${t.texto}`);
      if (t.grau === 'sucesso' || t.grau === 'critico'){
        this.ev('info', `Você não desvia o olhar. ${nomeVisivel(this.inimigo)} hesita — e recua para o mato.`);
        return this.encerrar('encarou');
      }
      this.ev('erro', 'Encarar um Pokémon assustado nunca foi um bom plano.');
      return this.golpeNoJogador();
    }
    return this.golpeNoJogador();
  },

  golpeNoJogador(){
    /* O treinador não tem Vitalidade de Pokémon: a parada é Força + 2,
       e cada sucesso vale 3 de HP de gente. */
    const nD = this.attr(this.inimigo, this.estInimigo, 'for') + 2;
    const rD = Dados.pool(nD, 'Dano no treinador');
    let dano = Math.max(1, rD.suc * 3);
    this.ev('rolagem', `Dano: FOR + 2 = ${nD}d6 → ${rD.suc} × 3`);
    /* Quando sobra para o treinador, o corpo é que segura. */
    const t = Dados.teste(Estado.j.status.resistencia, 6, 'Resistência');
    const corte = {critico:0.45, sucesso:0.7, parcial:0.9, falha:1.15}[t.grau];
    dano = Math.max(1, Math.round(dano * corte));
    this.ev('info', `Aguentar: 1d10(${t.dado}) + Resistência(${t.bonus}) = ${t.total} — ${t.texto}`);
    if (t.grau === 'critico') this.ev('info', 'Você vira o corpo na hora certa e o pior passa de raspão.');
    if (t.grau === 'falha')   this.ev('perigo', 'Você recebe inteiro, do jeito errado.');
    const morreu = Estado.ferir(dano, `Ataque de ${nomeVisivel(this.inimigo)} selvagem`);
    this.ev('danoJogador', `${nomeVisivel(this.inimigo)} te acerta. Você perde ${dano} de HP. (${Estado.j.hp}/${Estado.hpMaxJogador()})`, {dano});
    if (morreu){
      this.ev('gameover', 'Seu corpo cede. O mato fica quieto. Você não levanta mais.');
      return this.encerrar('gameover');
    }
    return {eventos:this.eventos, fim:null, ameaca:true};
  },

  encerrar(resultado, extra){
    this.ativo = false;
    this.fase = 'normal';
    /* Transform e Conversion não saem da luta com o Pokémon */
    this.desfazerMudancas(this.aliado, this.estAliado);
    this.desfazerMudancas(this.inimigo, this.estInimigo);
    /* efeitos de item segurado que só valem no fim */
    if (resultado === 'vitoria' && Estado.dados){
      (Estado.dados.time || []).forEach(p => {
        p.faixaUsada = false;
        const seg = efeitoSegurado(p);
        if (seg && seg.moral && p.hp > 0){
          p.moral = Math.min(100, (p.moral || 70) + seg.moral);
        }
      });
      const seg = efeitoSegurado(this.aliado);
      if (seg && seg.dinheiro && this.tipo === 'treinador'){
        this.bonusDinheiro = seg.dinheiro;
        this.ev('info', `O Amuleto de Moeda vale alguma coisa depois de uma vitória dessas.`);
      }
      /* convivência e leitura de natureza */
      if (Estado.tickNatureza) Estado.tickNatureza().forEach(a => this.ev('natureza', a.texto));
    } else if (Estado.dados){
      (Estado.dados.time || []).forEach(p => { p.faixaUsada = false; });
    }
    this.fim = Object.assign({resultado, bonusDinheiro:this.bonusDinheiro || 1}, extra||{});
    this.bonusDinheiro = 1;
    return {eventos:this.eventos, fim:this.fim};
  }
};
