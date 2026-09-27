/* ============================================================
   COMBATE — turnos por Velocidade, tipos, PP, status, dados
   Dano: 1d10 × (poder ÷ 10), modificado por stats, tipo, STAB, crítico
   Precisão: 1d20 > (100-precisão)/5
   Crítico: 1d20 = 20 → ×1.5
   ============================================================ */

/* precisão e evasão têm tabela própria nos jogos (de 1/3 a 3) */
const PRECISAO_MULT = {'-6':0.33,'-5':0.36,'-4':0.43,'-3':0.5,'-2':0.6,'-1':0.75,'0':1,'1':1.33,'2':1.66,'3':2,'4':2.33,'5':2.66,'6':3};
/* o nome de cada atributo na frase do log */
const NOME_ESTAGIO = {atk:'o Ataque', def:'a Defesa', spa:'o Ataque Especial', spd:'a Defesa Especial',
                      spe:'a Velocidade', precisao:'a precisão', evasao:'a evasão'};
const ESTAGIO_MULT = {'-6':0.25,'-5':0.28,'-4':0.33,'-3':0.4,'-2':0.5,'-1':0.66,'0':1,'1':1.5,'2':2,'3':2.5,'4':3,'5':3.5,'6':4};

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
          : `Você já viu um parecido. Não sabe o nome, mas sabe o que ele é: ${inimigo.tipos.join('/')}.`);
        if (t.grau === 'critico'){
          inimigo.naturezaVista = true;
          this.ev('natureza', `E dá pra ler o jeito dele daqui: ${inimigo.natureza}.`);
        }
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

  introPadrao(){
    const i = this.inimigo;
    const conhece = Estado.conheceu(i.dex);
    const nat = i.naturezaVista ? `, ${i.natureza}` : '';
    if (this.tipo === 'selvagem'){
      return conhece
        ? `Um ${i.nome} selvagem (Nv ${i.nivel}${nat}) aparece!`
        : `Um Pokémon sai do mato e para na sua frente (Nv ${i.nivel}). Você nunca viu um desses.`;
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
    const m = [];
    const ROT = {atk:'ATK', def:'DEF', spa:'SPA', spd:'SPD', spe:'VEL', precisao:'PREC', evasao:'EVA'};
    for (const k of Object.keys(ROT)){
      const v = est[k] || 0;
      if (v) m.push({t:`${ROT[k]} ${v > 0 ? '+' : '−'}${Math.abs(v)}`, c: v > 0 ? 'alto' : 'baixo'});
    }
    if (est.confuso > 0)     m.push({t:'Confuso', c:'estado'});
    if (est.apaixonado)      m.push({t:'Apaixonado', c:'estado'});
    if (est.presoTurnos > 0) m.push({t:'Preso', c:'estado'});
    if (est.semente)         m.push({t:'Semeado', c:'estado'});
    if (est.maldito)         m.push({t:'Maldição', c:'estado'});
    if (est.pesadelo)        m.push({t:'Pesadelo', c:'estado'});
    if (est.desabilitado)    m.push({t:`${est.desabilitado.nome} travado`, c:'estado'});
    if (est.substituto > 0)  m.push({t:'Boneco', c:'bom'});
    if (est.focado)          m.push({t:'Focado', c:'bom'});
    if (est.identificado)    m.push({t:'Identificado', c:'estado'});
    if (est.transformado)    m.push({t:'Transformado', c:'bom'});
    if (L){
      if (L.reflexo > 0) m.push({t:`Reflect ${L.reflexo}`, c:'campo'});
      if (L.tela > 0)    m.push({t:`Light Screen ${L.tela}`, c:'campo'});
      if (L.nevoa > 0)   m.push({t:`Mist ${L.nevoa}`, c:'campo'});
      if (L.salva > 0)   m.push({t:`Safeguard ${L.salva}`, c:'campo'});
    }
    return m;
  },

  /* ---------- utilidades ---------- */
  mult(est, chave){ return ESTAGIO_MULT[String(Math.max(-6, Math.min(6, est[chave])))] || 1; },

  statEfetivo(p, est, chave){
    let v = p.stats[chave] * this.mult(est, chave);
    if (chave === 'spe' && p.status === 'paralisia') v *= 0.5;
    if (chave === 'atk' && p.status === 'queimadura') v *= 0.75;
    const seg = efeitoSegurado(p);
    if (seg && chave === 'spe' && seg.vel) v *= seg.vel;
    return Math.max(1, Math.floor(v));
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
    const desobedienciaBase = souAliado
      ? Math.max(0, (60 - moral) / 2 - insignias * 3 - carisma * 1.5 + af.obediencia)
      : 0;

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
    if (p.status === 'sono'){
      p.statusTurnos--;
      if (p.statusTurnos <= 0){ p.status = null; est.pesadelo = false; this.ev('status', `${nomeVisivel(p)} acordou!`); }
      else {
        this.ev('status', `${nomeVisivel(p)} está dormindo profundamente.`);
        /* Sleep Talk e Snore são os golpes de quem está dormindo */
        if (golpeNome === 'Sleep Talk' || golpeNome === 'Snore') return true;
        return false;
      }
    }
    if (est.apaixonado && Dados.chance(50)){
      this.ev('status', `${nomeVisivel(p)} está apaixonado e não consegue atacar.`, {travou:'apaixonado', lado:souAliado ? 'aliado' : 'inimigo'});
      return false;
    }
    if (p.status === 'congelamento'){
      if (Dados.chance(20)){ p.status = null; this.ev('status', `${nomeVisivel(p)} descongelou!`); }
      else { this.ev('status', `${nomeVisivel(p)} está congelado e não consegue se mover.`); return false; }
    }
    if (p.status === 'paralisia' && Dados.chance(25)){
      this.ev('status', `${nomeVisivel(p)} está paralisado! Não conseguiu se mover.`, {travou:'paralisia', lado:souAliado ? 'aliado' : 'inimigo'}); return false;
    }
    if (est.recarregando){
      est.recarregando = false;
      this.ev('status', `${nomeVisivel(p)} precisa se recuperar do golpe anterior.`); return false;
    }
    if (est.confuso > 0){
      est.confuso--;
      if (est.confuso === 0) this.ev('status', `${nomeVisivel(p)} saiu da confusão.`);
      else if (Dados.chance(33)){
        const d = Math.max(1, Math.round(Dados.d10('Dano de confusão') * 4 * (p.stats.atk / Math.max(1,p.stats.def))));
        p.hp = Math.max(0, p.hp - d);
        this.ev('dano', `${nomeVisivel(p)} está confuso e se machucou sozinho! (${d} de dano)`);
        return false;
      } else {
        this.ev('status', `${nomeVisivel(p)} está confuso...`);
      }
    }
    return true;
  },

  /* ---------- dano ---------- */
  calcularDano(atk, def, estAtk, estDef, golpeNome, poder){
    const g = GOLPES[golpeNome];
    const pw = poder || g.p;
    const res = {dano:0, critico:false, efic:1, msgs:[]};

    /* Foresight: Normal e Lutador passam a acertar Fantasma */
    const tiposDef = (estDef.identificado && (g.t === 'Normal' || g.t === 'Lutador'))
      ? def.tipos.filter(t => t !== 'Fantasma') : def.tipos;
    res.efic = eficacia(g.t, tiposDef.length ? tiposDef : ['Normal']);
    if (res.efic === 0){
      res.msgs.push(`Não afeta ${nomeVisivel(def)}...`);
      return res;
    }

    if (g.ef && g.ef.nivel){                      // Seismic Toss / Night Shade
      res.dano = atk.nivel;
      res.msgs.push(`Dano igual ao nível: ${res.dano}`);
      return res;
    }
    if (g.ef && g.ef.fixo){                       // Dragon Rage
      res.dano = g.ef.fixo;
      res.msgs.push(`Dano fixo: ${res.dano}`);
      return res;
    }

    const fisico = g.c === 'fis';
    const a = this.statEfetivo(atk, estAtk, fisico ? 'atk' : 'spa');
    const d = this.statEfetivo(def, estDef, fisico ? 'def' : 'spd');
    /* A diferença entre um Machamp e um Chansey tem que aparecer.
       A razão vem dos stats (que vêm da base da espécie) e a curva
       abre um pouco a distância em vez de achatar tudo no meio. */
    const bruta = a / Math.max(1, d);
    const razao = Math.max(0.33, Math.min(3.2, Math.pow(bruta, 1.15)));

    const golpes = (g.ef && g.ef.golpes) ? g.ef.golpes : 1;
    let total = 0;
    for (let i = 0; i < golpes; i++){
      const d10 = Dados.d10(`Dano de ${golpeNome}`);
      total += Math.round(d10 * (pw / 10) * razao);
    }
    if (golpes > 1) res.msgs.push(`Acertou ${golpes} vezes!`);

    /* Primeira geração: quem é rápido critica mais. A chance sai da
       velocidade base da espécie, não de um d20 igual para todos. */
    const baseVel = (DEX[atk.dex] && DEX[atk.dex].base) ? DEX[atk.dex].base.spe : 50;
    let limiteCrit = 20 - Math.max(0, Math.min(3, Math.floor(baseVel / 40)));  // 20 a 17 no d20
    if (g.ef && g.ef.critico) limiteCrit -= 3;
    if (estAtk.focado) limiteCrit -= 3;          // Focus Energy
    /* quem te entende acerta onde dói sem você apontar */
    if (typeof efeitosDeAfinidade === 'function' && _meuPokemon(atk))
      limiteCrit -= efeitosDeAfinidade(atk).crit;
    const dCrit = Dados.d20('Crítico');
    if (dCrit >= limiteCrit){
      res.critico = true;
      total = Math.round(total * 1.5);
      res.msgs.push('ACERTO CRÍTICO!');
    }

    if (atk.tipos.includes(g.t)) total = Math.round(total * 1.5);   // STAB
    /* chuva: Água ×1,5 e Fogo ×0,5 · sol: o contrário */
    if (this.clima && (this.clima.tipo === 'chuva' || this.clima.tipo === 'sol')){
      const forte = this.clima.tipo === 'chuva' ? 'Água' : 'Fogo';
      const fraco = this.clima.tipo === 'chuva' ? 'Fogo' : 'Água';
      if (g.t === forte) total = Math.round(total * 1.5);
      if (g.t === fraco) total = Math.round(total * 0.5);
    }
    total = Math.round(total * res.efic);
    /* Reflect corta o físico, Light Screen o especial — crítico atravessa */
    const ladoDef = this.lados && this.lados[def === this.aliado ? 'aliado' : 'inimigo'];
    if (ladoDef && !res.critico){
      if (fisico && ladoDef.reflexo > 0) total = Math.round(total * 0.5);
      if (!fisico && ladoDef.tela > 0)   total = Math.round(total * 0.5);
    }
    const txt = textoEficacia(res.efic);
    if (txt) res.msgs.push(txt);

    const segA = efeitoSegurado(atk);
    if (segA){
      if (fisico && segA.fis) total = Math.round(total * segA.fis);
      if (!fisico && segA.esp) total = Math.round(total * segA.esp);
    }
    const segD = efeitoSegurado(def);
    if (segD && segD.defesa) total = Math.round(total * segD.defesa);

    const cfg = (Estado.dados && Estado.dados.config) ? Estado.dados.config.danoMult : 1;
    res.dano = Math.max(1, Math.round(total * (cfg || 1)));
    return res;
  },

  acertou(golpeNome, estAtk, estDef){
    const g = GOLPES[golpeNome];
    if (g.a >= 999) return true;
    let prec = g.a;
    /* precisão de quem ataca contra evasão de quem apanha; Foresight
       anula a evasão que subiu */
    const eva = estDef ? (estDef.identificado ? Math.min(0, estDef.evasao || 0) : (estDef.evasao || 0)) : 0;
    const passo = Math.max(-6, Math.min(6, (estAtk.precisao || 0) - eva));
    prec *= PRECISAO_MULT[String(passo)] || 1;
    const limite = Math.floor((100 - Math.min(100, prec)) / 5);
    const d = Dados.d20(`Precisão de ${golpeNome}`);
    return d > limite;
  },

  aplicarStatus(alvo, tipoStatus, grave){
    if (tipoStatus === 'recuo') return false;
    if (alvo.status) return false;
    if (tipoStatus === 'veneno' && alvo.tipos.includes('Venenoso')) return false;
    if (tipoStatus === 'queimadura' && alvo.tipos.includes('Fogo')) return false;
    if (tipoStatus === 'congelamento' && alvo.tipos.includes('Gelo')) return false;
    if (tipoStatus === 'paralisia' && alvo.tipos.includes('Elétrico')) return false;
    alvo.status = tipoStatus;
    alvo.statusGrave = !!grave;
    alvo.statusTurnos = tipoStatus === 'sono' ? Dados.entre(1,3) : 0;
    return true;
  },

  /* ---------- um golpe ---------- */
  /* nomeForcado: o golpe vem de fora do slot (Mirror Move, Sleep Talk) e
     não gasta PP nem passa pela vontade da natureza. */
  usarGolpe(atacante, defensor, estAtk, estDef, indiceGolpe, souAliado, nomeForcado){
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
        this.ev('info', `${nomeVisivel(atacante)} está sem PP em ${slot.nome} — usa Forcejar!`);
        const d = Math.max(1, Math.round(Dados.d10('Forcejar') * 3));
        defensor.hp = Math.max(0, defensor.hp - d);
        atacante.hp = Math.max(0, atacante.hp - Math.round(d * 0.25));
        this.ev('dano', `${nomeVisivel(defensor)} sofreu ${d}. ${nomeVisivel(atacante)} se machucou no contragolpe.`);
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

    if (!this.acertou(nome, estAtk, estDef)){
      this.ev('erro', `${nomeVisivel(atacante)} errou o golpe!`);
      estAtk.cortes = 0;
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
    let poder = null;
    if (ef.corte){
      estAtk.cortes = Math.min(4, (estAtk.cortes || 0));
      poder = g.p * Math.pow(2, estAtk.cortes);
      estAtk.cortes++;
    }
    if (ef.amizade){
      const amizade = Math.round(Math.max(0, Math.min(100, atacante.moral == null ? 70 : atacante.moral)) * 2.55);
      poder = Math.max(1, Math.floor((ef.amizade === 'retorno' ? amizade : 255 - amizade) / 2.5));
    }

    const r = this.calcularDano(atacante, defensor, estAtk, estDef, nome, poder);
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
      this.ev('status', `${nomeVisivel(atacante)} ficou confuso pela própria fúria!`);
    }
    /* Wrap, Bind, Clamp, Fire Spin: prende de 2 a 5 turnos (2ª geração) */
    if (ef.preso && defensor.hp > 0 && !estDef.presoTurnos){
      estDef.presoTurnos = Dados.entre(2, 5);
      estDef.presoPor = nome;
      this.ev('status', `${nomeVisivel(defensor)} ficou preso por ${nome}!`);
    }
    if (ef.tipo && ef.chance && defensor.hp > 0 && Dados.chance(ef.chance)){
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
    if (ef.baixa && defensor.hp > 0 && Dados.chance(ef.chance || 100))
      this.mudarEstagio(defensor, estDef, ef.baixa, -1, true);
    if (ef.sobe && atacante.hp > 0 && Dados.chance(ef.chance || 100))
      this.mudarEstagio(atacante, estAtk, ef.sobe, +1, false);
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
    this.ev('status', `${nomeStat[0].toUpperCase() + nomeStat.slice(1)} de ${nomeVisivel(p)} ${verbo}!`);
    return true;
  },

  confundir(p, est){
    if (this.salvaguarda(p)) return false;
    if (est.confuso > 0){ this.ev('erro', `${nomeVisivel(p)} já está confuso.`); return false; }
    est.confuso = Dados.entre(2, 5);
    this.ev('status', `${nomeVisivel(p)} ficou confuso!`);
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
      if (e.dorme){ atacante.status = 'sono'; atacante.statusTurnos = 2; }
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
        return this.ev('status', `${eu} está concentrado. Acerto crítico fica mais fácil.`);

      case 'substituto': {
        const custo = Math.floor(atk.hpMax / 4);
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
            ? `${ele} é soprado pra longe. A batalha acabou.`
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
        return this.ev('status', `${ele} foi semeado! Vai perder HP todo turno pra quem plantou.`);

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
          const custo = Math.floor(atk.hpMax / 2);
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
  },

  /* ---------- fim de turno ---------- */
  fimDeTurno(p, est, quem){
    if (p.hp <= 0) return;
    if (p.status === 'veneno'){
      const frac = p.statusGrave ? 6 : 8;
      const d = Math.max(1, Math.floor(p.hpMax / frac));
      p.hp = Math.max(0, p.hp - d);
      this.ev('dano', `${nomeVisivel(p)} sofre ${d} pelo veneno. (${p.hp}/${p.hpMax})`, {causa:'veneno'});
    }
    if (p.status === 'queimadura'){
      const d = Math.max(1, Math.floor(p.hpMax / 16));
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
        const d = Math.min(p.hp, Math.max(1, Math.floor(p.hpMax / 8)));
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
      const c = Math.max(1, Math.round(p.hpMax * seg.regen));
      const antes = p.hp;
      p.hp = Math.min(p.hpMax, p.hp + c);
      this.ev('cura', `${nomeVisivel(p)} belisca o ${p.segurando} e recupera ${p.hp - antes}. (${p.hp}/${p.hpMax})`);
    }
  },

  /* Fim de turno do clima: a areia fere quem não é Pedra, Terrestre ou
     Metálico (1/8 do HP), e o clima acaba sozinho no quinto turno. */
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
        const d = Math.max(1, Math.floor(p.hpMax / 8));
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
      const fis = G.c === 'fis';
      const a = this.statEfetivo(p, estP, fis ? 'atk' : 'spa');
      const d = this.statEfetivo(alvo, estAlvo, fis ? 'def' : 'spd');
      let s = (G.p || 45) * ef * Math.min(2.2, a / Math.max(1,d)) * (G.a >= 999 ? 1 : G.a/100);
      if (p.tipos.includes(G.t)) s *= 1.5;
      if (nat.agressiva) s *= 1.1;
      return s;
    };
    disponiveis.sort((a,b) => pontuar(b) - pontuar(a));
    // não é uma máquina perfeita: às vezes erra a escolha
    if (disponiveis.length > 1 && Dados.chance(22)) return disponiveis[1].i;
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
        this.ev('erro', `${this.treinador || 'O treinador'} chama de volta antes da bola chegar perto. Pokémon dos outros não se captura — e num ginásio isso encerra a sua vez.`);
        return {eventos:this.eventos, fim:null};
      }
      return this.tentarCaptura(acao.nome);
    }
    if (acao.tipo === 'item')   { this.usarItemEmCombate(acao.nome, acao.alvoUid); return this.turnoInimigoSozinho(); }
    if (acao.tipo === 'trocar'){
      if (this.estAliado.presoTurnos > 0 && estaVivo(this.aliado)){
        this.eventos = []; this.turno--;
        this.ev('erro', `${nomeVisivel(this.aliado)} está preso por ${this.estAliado.presoPor} e não consegue voltar.`);
        return {eventos:this.eventos, fim:null};
      }
      this.trocarPokemon(acao.uid); return this.turnoInimigoSozinho();
    }

    // ordem por velocidade (prioridade primeiro)
    const gJog = GOLPES[this.aliado.golpes[acao.indice]?.nome || 'Tackle'];
    const iIA  = this.iaEscolher(this.inimigo, this.aliado, this.estInimigo, this.estAliado);
    const gIA  = GOLPES[this.inimigo.golpes[iIA]?.nome || 'Tackle'];
    const prioJ = (gJog.ef && gJog.ef.prioridade) || 0;
    const prioI = (gIA.ef && gIA.ef.prioridade) || 0;
    const vJ = this.statEfetivo(this.aliado, this.estAliado, 'spe');
    const vI = this.statEfetivo(this.inimigo, this.estInimigo, 'spe');
    let jogadorPrimeiro;
    if (prioJ !== prioI) jogadorPrimeiro = prioJ > prioI;
    else if (vJ !== vI)  jogadorPrimeiro = vJ > vI;
    else                 jogadorPrimeiro = Dados.chance(50);

    this.ev('turno', `— Turno ${this.turno} — (Vel ${vJ} vs ${vI})`);

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
    const novo = Estado.catalogou(p.dex);
    p.naturezaVista = true;          // a leitura expõe o temperamento do indivíduo
    this.ev('pokedex', `Você aponta a Pokédex. Ela leva três segundos e apita.`);
    this.ev('pokedex', `${esp.nome} — tipo ${p.tipos.join('/')}. Natureza ${p.natureza}.`);
    this.ev('pokedex', `ATK ${p.stats.atk} · DEF ${p.stats.def} · SPA ${p.stats.spa} · SPD ${p.stats.spd} · VEL ${p.stats.spe}`);
    this.ev('pokedex', `Base da espécie: ${esp.base.hp}/${esp.base.atk}/${esp.base.def}/${esp.base.spa}/${esp.base.spd}/${esp.base.spe} — soma ${esp.total}.`);
    if (p.shiny)
      this.ev('brilhante', 'Anomalia cromática confirmada. A Pokédex abre um campo que você nunca tinha visto abrir.');
    if ((NATUREZAS[p.natureza]||{}).agressiva)
      this.ev('perigo', 'Marcação da Pokédex: temperamento agressivo. Se o seu time cair, ele não recua.');
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
      if (alvo.hp <= 0 && !alvo.morto){ this.ev('erro', `${nomeVisivel(alvo)} está desmaiado — Potion não resolve.`); return; }
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
      if (alvo.hp > 0){ this.ev('erro', `${nomeVisivel(alvo)} não está desmaiado.`); return; }
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
    this.ev('info', `${nomeVisivel(this.aliado)} volta. Vai, ${nomeVisivel(novo)}!`);
    this.desfazerMudancas(this.aliado, this.estAliado);
    this.aliado = novo;
    this.estAliado = this.novoEstado();
    if (this.participantes) this.participantes.add(novo.uid);
  },

  /* ---------- fuga ---------- */
  tentarFugir(){
    if (!this.fuga){ this.ev('erro', 'Não dá para fugir daqui.'); return this.turnoInimigoSozinho(); }
    if (this.estAliado.presoTurnos > 0){
      this.ev('erro', `${nomeVisivel(this.aliado)} está preso por ${this.estAliado.presoPor}. Não dá pra fugir.`);
      return this.turnoInimigoSozinho();
    }
    const alvo = this.inimigo.stats.spe - this.aliado.stats.spe + 10;
    const d = Dados.d20('Fuga');
    this.ev('info', `Fuga: 1d20 = ${d} — precisa ≥ ${alvo}`);
    if (d >= alvo){
      this.ev('fuga', 'Você conseguiu escapar!');
      return this.encerrar('fuga');
    }
    this.ev('erro', 'Não deu para escapar!');
    return this.turnoInimigoSozinho();
  },

  /* ---------- captura ---------- */
  tentarCaptura(nomeBola){
    const r = Captura.tentar(this.inimigo, nomeBola, this);
    r.eventos.forEach(e => this.eventos.push(e));
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
        ? `${nomeVisivel(this.inimigo)} desmaiou e fugiu para o mato. Ele vai voltar.`
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
        const evs = ganharExp(p, cada);
        this.ev('exp', `${nomeVisivel(p)} ganhou ${cada} de experiência.`);
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
        const prox = this.timeInimigo.shift();
        if (this.revelaNatureza){ prox.naturezaVista = true; prox.nomeAnunciado = true; }
        this.ev('info', `${this.treinador} envia ${nomeVisivel(prox)} (Nv ${prox.nivel})${
          prox.naturezaVista ? ', ' + prox.natureza : ''}!`);
        this.desfazerMudancas(this.inimigo, this.estInimigo);
        this.inimigo = prox;
        this.estInimigo = this.novoEstado();
        this.participantes = new Set([this.aliado.uid]);
        return {eventos:this.eventos, fim:null};
      }
      return this.encerrar('vitoria');
    }

    if (this.aliado.hp <= 0){
      this.ev('derrota', `${nomeVisivel(this.aliado)} desmaiou.`);
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
    this.ev('perigo', `Natureza ${this.inimigo.natureza} (agressiva). 1d20 = ${d} — ataca com 10+`);
    if (d < 10){
      this.ev('info', `${nomeVisivel(this.inimigo)} te encara por um segundo longo demais... e vai embora.`);
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
        this.ev('fuga', 'Você corre. Os galhos cortam sua cara, mas você escapa.');
        return this.encerrar('escapou');
      }
      this.ev('erro', 'Você tropeça. Ele te alcança.');
      return this.golpeNoJogador();
    }
    if (acao.tipo === 'bola'){
      if (this.tipo === 'treinador'){
        this.ev('erro', 'Não se joga bola no Pokémon de outro treinador.');
        return {eventos:this.eventos, fim:null};
      }
      const r = Captura.tentar(this.inimigo, acao.nome, this);
      r.eventos.forEach(e => this.eventos.push(e));
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
      this.ev('erro', 'Encarar um animal assustado nunca foi um bom plano.');
      return this.golpeNoJogador();
    }
    return this.golpeNoJogador();
  },

  golpeNoJogador(){
    let dano = Math.max(1, Math.round((this.inimigo.stats.atk / 10) * Dados.d10('Dano no treinador')));
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
