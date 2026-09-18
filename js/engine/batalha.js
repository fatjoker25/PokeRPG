/* ============================================================
   COMBATE — turnos por Velocidade, tipos, PP, status, dados
   Dano: 1d10 × (poder ÷ 10), modificado por stats, tipo, STAB, crítico
   Precisão: 1d20 > (100-precisão)/5
   Crítico: 1d20 = 20 → ×1.5
   ============================================================ */

const ESTAGIO_MULT = {'-6':0.25,'-5':0.28,'-4':0.33,'-3':0.4,'-2':0.5,'-1':0.66,'0':1,'1':1.5,'2':2,'3':2.5,'4':3,'5':3.5,'6':4};

const Batalha = {
  ativo:false, aliado:null, inimigo:null, tipo:'selvagem',
  turno:0, fuga:true, eventos:[], fim:null, fase:'normal',
  estAliado:null, estInimigo:null, aoTerminar:null, contexto:null,

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
    this.eventos = [];
    this.aoTerminar = opts.aoTerminar || null;
    this.contexto = opts.contexto || null;
    this.treinador = opts.treinador || null;
    this.timeInimigo = opts.timeInimigo || null;
    this.estAliado = this.novoEstado();
    this.estInimigo = this.novoEstado();
    this.pdexUsada = false;
    if (Estado.viu(inimigo.dex)) this.ev('pokedex', 'A Pokédex vibra no bolso: espécie nova, ainda não catalogada.');
    this.ev('inicio', opts.introducao || this.introPadrao());
    return this.eventos;
  },

  novoEstado(){
    return {atk:0, def:0, spa:0, spd:0, spe:0, precisao:0, confuso:0, preso:0, carregando:null, recarregando:false};
  },

  introPadrao(){
    if (this.tipo === 'selvagem') return `Um ${this.inimigo.nome} selvagem (Nv ${this.inimigo.nivel}, ${this.inimigo.natureza}) aparece!`;
    if (this.tipo === 'lendario') return `${this.inimigo.nome} encara você. O ar fica pesado.`;
    return `${this.treinador || 'Um treinador'} enviou ${this.inimigo.nome} (Nv ${this.inimigo.nivel})!`;
  },

  ev(tipo, texto, extra){ this.eventos.push(Object.assign({tipo, texto}, extra||{})); },

  /* ---------- utilidades ---------- */
  mult(est, chave){ return ESTAGIO_MULT[String(Math.max(-6, Math.min(6, est[chave])))] || 1; },

  statEfetivo(p, est, chave){
    let v = p.stats[chave] * this.mult(est, chave);
    if (chave === 'spe' && p.status === 'paralisia') v *= 0.5;
    if (chave === 'atk' && p.status === 'queimadura') v *= 0.75;
    return Math.max(1, Math.floor(v));
  },

  /* ---------- naturezas: o bicho tem vontade própria ---------- */
  vontade(p, golpeNome, souAliado){
    const nat = NATUREZAS[p.natureza] || {};
    const g = GOLPES[golpeNome];
    const moral = souAliado ? (p.moral !== undefined ? p.moral : 70) : 50;
    // cada insígnia conquistada faz o time confiar mais nas suas ordens
    const insignias = (Estado.dados && Estado.dados.insignias) ? Estado.dados.insignias.length : 0;
    const desobedienciaBase = souAliado ? Math.max(0, (60 - moral) / 2 - insignias * 3) : 0;

    if (p.natureza === 'Brave' && g.c === 'esp' && Dados.chance(35))
      return {recusa:true, texto:`${nomeExib(p)} é Brave — recusa o golpe especial. Quer sentir o impacto.`};
    if (p.natureza === 'Timid' && g.c === 'fis' && Dados.chance(30))
      return {recusa:true, texto:`${nomeExib(p)} é Timid — hesita em chegar perto e não ataca.`};
    if (p.natureza === 'Naughty' && Dados.chance(18))
      return {trocaAlvo:true, texto:`${nomeExib(p)} é Naughty — usa o golpe do jeito errado, de propósito.`};
    if ((p.natureza === 'Hasty' || p.natureza === 'Lonely') && Dados.chance(15))
      return {outroGolpe:true, texto:`${nomeExib(p)} não espera o comando e ataca por conta própria.`};
    if (desobedienciaBase > 0 && Dados.chance(desobedienciaBase))
      return {recusa:true, texto:`${nomeExib(p)} ignora sua ordem. O vínculo entre vocês está fraco.`};
    return null;
  },

  /* ---------- pode agir? ---------- */
  podeAgir(p, est, souAliado){
    if (p.status === 'sono'){
      p.statusTurnos--;
      if (p.statusTurnos <= 0){ p.status = null; this.ev('status', `${nomeExib(p)} acordou!`); }
      else { this.ev('status', `${nomeExib(p)} está dormindo profundamente.`); return false; }
    }
    if (p.status === 'congelamento'){
      if (Dados.chance(20)){ p.status = null; this.ev('status', `${nomeExib(p)} descongelou!`); }
      else { this.ev('status', `${nomeExib(p)} está congelado e não consegue se mover.`); return false; }
    }
    if (p.status === 'paralisia' && Dados.chance(25)){
      this.ev('status', `${nomeExib(p)} está paralisado! Não conseguiu se mover.`); return false;
    }
    if (est.recarregando){
      est.recarregando = false;
      this.ev('status', `${nomeExib(p)} precisa se recuperar do golpe anterior.`); return false;
    }
    if (est.confuso > 0){
      est.confuso--;
      if (est.confuso === 0) this.ev('status', `${nomeExib(p)} saiu da confusão.`);
      else if (Dados.chance(33)){
        const d = Math.max(1, Math.round(Dados.d10('Dano de confusão') * 4 * (p.stats.atk / Math.max(1,p.stats.def))));
        p.hp = Math.max(0, p.hp - d);
        this.ev('dano', `${nomeExib(p)} está confuso e se machucou sozinho! (${d} de dano)`);
        return false;
      } else {
        this.ev('status', `${nomeExib(p)} está confuso...`);
      }
    }
    return true;
  },

  /* ---------- dano ---------- */
  calcularDano(atk, def, estAtk, estDef, golpeNome){
    const g = GOLPES[golpeNome];
    const res = {dano:0, critico:false, efic:1, msgs:[]};

    res.efic = eficacia(g.t, def.tipos);
    if (res.efic === 0){
      res.msgs.push(`Não afeta ${nomeExib(def)}...`);
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
    const razao = Math.max(0.45, Math.min(2.2, a / Math.max(1, d)));

    const golpes = (g.ef && g.ef.golpes) ? g.ef.golpes : 1;
    let total = 0;
    for (let i = 0; i < golpes; i++){
      const d10 = Dados.d10(`Dano de ${golpeNome}`);
      total += Math.round(d10 * (g.p / 10) * razao);
    }
    if (golpes > 1) res.msgs.push(`Acertou ${golpes} vezes!`);

    const dCrit = Dados.d20('Crítico');
    if (dCrit === 20 || (g.ef && g.ef.critico && dCrit >= 18)){
      res.critico = true;
      total = Math.round(total * 1.5);
      res.msgs.push('ACERTO CRÍTICO!');
    }

    if (atk.tipos.includes(g.t)) total = Math.round(total * 1.5);   // STAB
    total = Math.round(total * res.efic);
    const txt = textoEficacia(res.efic);
    if (txt) res.msgs.push(txt);

    const cfg = (Estado.dados && Estado.dados.config) ? Estado.dados.config.danoMult : 1;
    res.dano = Math.max(1, Math.round(total * (cfg || 1)));
    return res;
  },

  acertou(golpeNome, estAtk, estDef){
    const g = GOLPES[golpeNome];
    if (g.a >= 999) return true;
    let prec = g.a;
    prec *= this.mult(estAtk, 'precisao');
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
  usarGolpe(atacante, defensor, estAtk, estDef, indiceGolpe, souAliado){
    const slot = atacante.golpes[indiceGolpe];
    if (!slot){ this.ev('info', `${nomeExib(atacante)} não tem esse golpe.`); return; }
    if (slot.pp <= 0){
      this.ev('info', `${nomeExib(atacante)} está sem PP em ${slot.nome} — usa Forcejar!`);
      const d = Math.max(1, Math.round(Dados.d10('Forcejar') * 3));
      defensor.hp = Math.max(0, defensor.hp - d);
      atacante.hp = Math.max(0, atacante.hp - Math.round(d * 0.25));
      this.ev('dano', `${nomeExib(defensor)} sofreu ${d}. ${nomeExib(atacante)} se machucou no contragolpe.`);
      return;
    }

    let nome = slot.nome;
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

    const g = GOLPES[nome];

    // golpes de carga (Dig, Fly, Solar Beam, Sky Attack)
    if (g.ef && g.ef.carga && estAtk.carregando !== nome){
      estAtk.carregando = nome;
      this.ev('info', `${nomeExib(atacante)} se prepara para ${nome}!`);
      return;
    }
    estAtk.carregando = null;

    this.ev('golpe', `${nomeExib(atacante)} usou ${nome}!`, {golpe:nome, tipoGolpe:g.t});

    if (!this.acertou(nome, estAtk, estDef)){
      this.ev('erro', `${nomeExib(atacante)} errou o golpe!`);
      return;
    }

    if (g.c === 'status'){
      this.efeitoStatus(atacante, defensor, estAtk, estDef, g, nome);
      return;
    }

    if (g.ef && g.ef.soDormindo && defensor.status !== 'sono'){
      this.ev('erro', `${nome} só funciona em alvos dormindo. Nada acontece.`);
      return;
    }

    const r = this.calcularDano(atacante, defensor, estAtk, estDef, nome);
    r.msgs.forEach(m => this.ev('info', m));
    if (r.efic === 0) return;

    defensor.hp = Math.max(0, defensor.hp - r.dano);
    this.ev('dano', `${nomeExib(defensor)} sofreu ${r.dano} de dano. (${defensor.hp}/${defensor.hpMax})`, {alvo:souAliado?'inimigo':'aliado', dano:r.dano});

    if (g.ef && g.ef.drena){
      const cura = Math.max(1, Math.round(r.dano * g.ef.drena));
      atacante.hp = Math.min(atacante.hpMax, atacante.hp + cura);
      this.ev('cura', `${nomeExib(atacante)} drenou ${cura} de HP.`);
    }
    if (g.ef && g.ef.recuo){
      const rec = Math.max(1, Math.round(r.dano * g.ef.recuo));
      atacante.hp = Math.max(0, atacante.hp - rec);
      this.ev('dano', `${nomeExib(atacante)} sofreu ${rec} de recuo.`);
    }
    if (g.ef && g.ef.recarga) estAtk.recarregando = true;
    if (g.ef && g.ef.confundeSe && Dados.chance(50)){
      estAtk.confuso = Dados.entre(2,4);
      this.ev('status', `${nomeExib(atacante)} ficou confuso pela própria fúria!`);
    }
    if (g.ef && g.ef.tipo && g.ef.chance && defensor.hp > 0 && Dados.chance(g.ef.chance)){
      if (g.ef.tipo === 'confusao'){
        estDef.confuso = Dados.entre(2,4);
        this.ev('status', `${nomeExib(defensor)} ficou confuso!`);
      } else if (g.ef.tipo === 'recuo'){
        estDef.recuou = true;
        this.ev('status', `${nomeExib(defensor)} se encolheu de medo!`);
      } else if (this.aplicarStatus(defensor, g.ef.tipo, g.ef.grave)){
        this.ev('status', `${nomeExib(defensor)} está com ${g.ef.tipo}!`);
      }
    }
    if (g.ef && g.ef.baixa && defensor.hp > 0){
      estDef[g.ef.baixa] = Math.max(-6, (estDef[g.ef.baixa]||0) - 1);
      this.ev('status', `${g.ef.baixa.toUpperCase()} de ${nomeExib(defensor)} caiu!`);
    }
  },

  efeitoStatus(atacante, defensor, estAtk, estDef, g, nome){
    const e = g.ef || {};
    if (e.cura){
      const antes = atacante.hp;
      atacante.hp = Math.min(atacante.hpMax, atacante.hp + Math.round(atacante.hpMax * e.cura));
      if (e.dorme){ atacante.status = 'sono'; atacante.statusTurnos = 2; }
      this.ev('cura', `${nomeExib(atacante)} recuperou ${atacante.hp - antes} de HP.`);
      return;
    }
    if (e.sobe){
      const q = e.forte ? 2 : 1;
      estAtk[e.sobe] = Math.min(6, (estAtk[e.sobe]||0) + q);
      this.ev('status', `${e.sobe.toUpperCase()} de ${nomeExib(atacante)} ${e.forte?'subiu MUITO':'subiu'}!`);
      return;
    }
    if (e.baixa){
      const q = e.forte ? 2 : 1;
      estDef[e.baixa] = Math.max(-6, (estDef[e.baixa]||0) - q);
      this.ev('status', `${e.baixa.toUpperCase()} de ${nomeExib(defensor)} ${e.forte?'despencou':'caiu'}!`);
      return;
    }
    if (e.tipo === 'confusao'){
      estDef.confuso = Dados.entre(2,4);
      this.ev('status', `${nomeExib(defensor)} ficou confuso!`);
      return;
    }
    if (e.tipo){
      if (this.aplicarStatus(defensor, e.tipo, e.grave))
        this.ev('status', `${nomeExib(defensor)} está com ${e.tipo}${e.grave?' GRAVE':''}!`);
      else
        this.ev('erro', `Não teve efeito em ${nomeExib(defensor)}.`);
    }
  },

  /* ---------- fim de turno ---------- */
  fimDeTurno(p, est, quem){
    if (p.hp <= 0) return;
    if (p.status === 'veneno'){
      const frac = p.statusGrave ? 6 : 8;
      const d = Math.max(1, Math.floor(p.hpMax / frac));
      p.hp = Math.max(0, p.hp - d);
      this.ev('dano', `${nomeExib(p)} sofre ${d} pelo veneno. (${p.hp}/${p.hpMax})`);
    }
    if (p.status === 'queimadura'){
      const d = Math.max(1, Math.floor(p.hpMax / 16));
      p.hp = Math.max(0, p.hp - d);
      this.ev('dano', `${nomeExib(p)} sofre ${d} pela queimadura. (${p.hp}/${p.hpMax})`);
    }
  },

  /* ---------- IA ---------- */
  iaEscolher(p, alvo, estP, estAlvo){
    const disponiveis = p.golpes.map((g,i) => ({i, g})).filter(x => x.g.pp > 0);
    if (!disponiveis.length) return 0;
    const nat = NATUREZAS[p.natureza] || {};
    const pontuar = (x) => {
      const G = GOLPES[x.g.nome];
      if (G.c === 'status'){
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

    if (this.fase === 'ameaca') return this.acaoAmeaca(acao);

    // ações que não gastam o turno de golpe
    if (acao.tipo === 'pokedex') return this.escanear();
    if (acao.tipo === 'fugir')  return this.tentarFugir();
    if (acao.tipo === 'bola')   return this.tentarCaptura(acao.nome);
    if (acao.tipo === 'item')   { this.usarItemEmCombate(acao.nome, acao.alvoUid); return this.turnoInimigoSozinho(); }
    if (acao.tipo === 'trocar') { this.trocarPokemon(acao.uid); return this.turnoInimigoSozinho(); }

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
      if (this.aliado.hp <= 0 || this.inimigo.hp <= 0) return;
      if (this.estAliado.recuou){ this.estAliado.recuou = false; this.ev('status', `${nomeExib(this.aliado)} está encolhido e não ataca.`); return; }
      if (!this.podeAgir(this.aliado, this.estAliado, true)) return;
      this.usarGolpe(this.aliado, this.inimigo, this.estAliado, this.estInimigo, acao.indice, true);
    };
    const agirInimigo = () => {
      if (this.aliado.hp <= 0 || this.inimigo.hp <= 0) return;
      if (this.estInimigo.recuou){ this.estInimigo.recuou = false; this.ev('status', `${nomeExib(this.inimigo)} está encolhido e não ataca.`); return; }
      if (!this.podeAgir(this.inimigo, this.estInimigo, false)) return;
      this.usarGolpe(this.inimigo, this.aliado, this.estInimigo, this.estAliado, iIA, false);
    };

    if (jogadorPrimeiro){ agirJogador(); agirInimigo(); }
    else { agirInimigo(); agirJogador(); }

    if (this.aliado.hp > 0 && this.inimigo.hp > 0){
      this.fimDeTurno(this.aliado, this.estAliado, 'aliado');
      this.fimDeTurno(this.inimigo, this.estInimigo, 'inimigo');
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
    if (this.pdexUsada){
      this.ev('erro', 'A Pokédex já leu tudo o que conseguia ler daqui.');
      return {eventos:this.eventos, fim:null};
    }
    this.pdexUsada = true;
    const p = this.inimigo;
    const esp = DEX[p.dex];
    const novo = Estado.catalogou(p.dex);
    this.ev('pokedex', `Você aponta a Pokédex. Ela leva três segundos e apita.`);
    this.ev('pokedex', `${esp.nome} — tipo ${p.tipos.join('/')}. Natureza ${p.natureza}.`);
    this.ev('pokedex', `${(NATUREZAS[p.natureza]||{}).traco || ''}`);
    this.ev('pokedex', `ATK ${p.stats.atk} · DEF ${p.stats.def} · SPA ${p.stats.spa} · SPD ${p.stats.spd} · VEL ${p.stats.spe}`);
    if ((NATUREZAS[p.natureza]||{}).agressiva)
      this.ev('perigo', 'Marcação da Pokédex: temperamento agressivo. Se o seu time cair, ele não recua.');
    if (novo) this.ev('pokedex', `Registro novo: ${esp.nome} catalogado.`);
    return {eventos:this.eventos, fim:null};
  },

  turnoInimigoSozinho(){
    if (this.inimigo.hp > 0 && this.aliado.hp > 0){
      if (this.podeAgir(this.inimigo, this.estInimigo, false)){
        const i = this.iaEscolher(this.inimigo, this.aliado, this.estInimigo, this.estAliado);
        this.usarGolpe(this.inimigo, this.aliado, this.estInimigo, this.estAliado, i, false);
      }
      this.fimDeTurno(this.aliado, this.estAliado);
      this.fimDeTurno(this.inimigo, this.estInimigo);
    }
    return this.verificarFim();
  },

  /* ---------- itens e troca ---------- */
  usarItemEmCombate(nome, alvoUid){
    const info = ITENS_INFO[nome];
    if (!info || !Estado.contaItem(nome)){ this.ev('erro', 'Você não tem esse item.'); return; }
    const alvo = Estado.dados.time.find(p => p.uid === alvoUid) || this.aliado;
    if (info.tipo === 'cura'){
      if (alvo.hp <= 0 && !alvo.morto){ this.ev('erro', `${nomeExib(alvo)} está desmaiado — Potion não resolve.`); return; }
      Estado.usarItem(nome);
      const antes = alvo.hp;
      alvo.hp = Math.min(alvo.hpMax, alvo.hp + info.valor);
      this.ev('cura', `Você usou ${nome}. ${nomeExib(alvo)} recuperou ${alvo.hp - antes} de HP.`);
    } else if (info.tipo === 'revive'){
      if (alvo.morto){
        this.ev('erro', `Você aplica o Revive em ${nomeExib(alvo)} e não acontece nada. Nem uma reação.`);
        this.ev('info', 'Tem uma diferença entre desmaiar e morrer, e você acabou de aprender qual é.');
        Estado.marcar('revive_nao_ressuscita');
        return;
      }
      if (alvo.hp > 0){ this.ev('erro', `${nomeExib(alvo)} não está desmaiado.`); return; }
      Estado.usarItem(nome);
      alvo.hp = Math.floor(alvo.hpMax / 2);
      this.ev('cura', `${nomeExib(alvo)} voltou a si com ${alvo.hp} de HP.`);
    } else if (info.tipo === 'status'){
      Estado.usarItem(nome);
      alvo.status = null; alvo.statusTurnos = 0;
      this.ev('cura', `${nomeExib(alvo)} teve as condições curadas.`);
    } else if (info.tipo === 'curaJogador'){
      Estado.usarItem(nome);
      Estado.curarJogador(info.valor);
      this.ev('cura', `Você se enfaixou. HP: ${Estado.j.hp}/${Estado.hpMaxJogador()}`);
    } else {
      this.ev('erro', 'Esse item não serve aqui.');
    }
  },

  trocarPokemon(uid){
    const novo = Estado.dados.time.find(p => p.uid === uid);
    if (!novo || !estaVivo(novo)){ this.ev('erro', 'Esse Pokémon não pode lutar.'); return; }
    this.ev('info', `${nomeExib(this.aliado)} volta. Vai, ${nomeExib(novo)}!`);
    this.aliado = novo;
    this.estAliado = this.novoEstado();
  },

  /* ---------- fuga ---------- */
  tentarFugir(){
    if (!this.fuga){ this.ev('erro', 'Não dá para fugir daqui.'); return this.turnoInimigoSozinho(); }
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
      this.ev('perigo', `${this.inimigo.nome} está FURIOSO. Isso não vai acabar bem.`);
      return this.turnoInimigoSozinho();
    }
    return this.turnoInimigoSozinho();
  },

  /* ---------- verificação de fim ---------- */
  verificarFim(){
    if (this.inimigo.hp <= 0){
      this.ev('vitoria', this.tipo === 'selvagem'
        ? `${this.inimigo.nome} desmaiou e fugiu para o mato. Ele vai voltar.`
        : `${this.inimigo.nome} desmaiou!`);
      const ganho = expGanha(this.inimigo, this.aliado);
      const evs = ganharExp(this.aliado, ganho);
      this.ev('exp', `${nomeExib(this.aliado)} ganhou ${ganho} de experiência.`);
      evs.forEach(e => {
        if (e.tipo === 'nivel') this.ev('nivel', `${nomeExib(this.aliado)} subiu para o nível ${e.nivel}!`);
        if (e.tipo === 'golpe') this.ev('golpeNovo', `${nomeExib(this.aliado)} aprendeu ${e.golpe}!` + (e.esqueceu ? ` (esqueceu ${e.esqueceu})` : ''));
        if (e.tipo === 'evolucao') this.ev('evolucao', `${e.de} evoluiu para ${e.para}!`);
      });
      // time adversário com mais Pokémon
      if (this.timeInimigo && this.timeInimigo.length){
        const prox = this.timeInimigo.shift();
        this.ev('info', `${this.treinador} envia ${prox.nome} (Nv ${prox.nivel})!`);
        this.inimigo = prox;
        this.estInimigo = this.novoEstado();
        return {eventos:this.eventos, fim:null};
      }
      return this.encerrar('vitoria');
    }

    if (this.aliado.hp <= 0){
      this.ev('derrota', `${nomeExib(this.aliado)} desmaiou.`);
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
      this.ev('info', `${this.inimigo.nome} rosna, hostil, mas não avança sobre você. Some no mato.`);
      return this.encerrar('derrota');
    }
    const d = Dados.d20('O selvagem ataca você?');
    this.ev('perigo', `Natureza ${this.inimigo.natureza} (agressiva). 1d20 = ${d} — ataca com 10+`);
    if (d < 10){
      this.ev('info', `${this.inimigo.nome} te encara por um segundo longo demais... e vai embora.`);
      return this.encerrar('derrota');
    }
    this.fase = 'ameaca';
    this.ev('perigo', `${this.inimigo.nome} avança em VOCÊ. Não tem mais Pokémon entre vocês dois.`);
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
      const r = Captura.tentar(this.inimigo, acao.nome, this);
      r.eventos.forEach(e => this.eventos.push(e));
      if (r.capturou) return this.encerrar('captura', {pokemon:this.inimigo, bola:acao.nome});
      return this.golpeNoJogador();
    }
    if (acao.tipo === 'item'){
      this.usarItemEmCombate(acao.nome, acao.alvoUid);
      const revivido = Estado.dados.time.find(p => estaVivo(p));
      if (revivido){
        this.ev('info', `${nomeExib(revivido)} se põe de pé entre você e ${this.inimigo.nome}.`);
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
        this.ev('info', `Você não desvia o olhar. ${this.inimigo.nome} hesita — e recua para o mato.`);
        return this.encerrar('encarou');
      }
      this.ev('erro', 'Encarar um animal assustado nunca foi um bom plano.');
      return this.golpeNoJogador();
    }
    return this.golpeNoJogador();
  },

  golpeNoJogador(){
    const dano = Math.max(1, Math.round((this.inimigo.stats.atk / 10) * Dados.d10('Dano no treinador')));
    const morreu = Estado.ferir(dano, `Ataque de ${this.inimigo.nome} selvagem`);
    this.ev('danoJogador', `${this.inimigo.nome} te acerta. Você perde ${dano} de HP. (${Estado.j.hp}/${Estado.hpMaxJogador()})`, {dano});
    if (morreu){
      this.ev('gameover', 'Seu corpo cede. O mato fica quieto. Você não levanta mais.');
      return this.encerrar('gameover');
    }
    return {eventos:this.eventos, fim:null, ameaca:true};
  },

  encerrar(resultado, extra){
    this.ativo = false;
    this.fase = 'normal';
    this.fim = Object.assign({resultado}, extra||{});
    return {eventos:this.eventos, fim:this.fim};
  }
};
