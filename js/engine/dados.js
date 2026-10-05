/* ============================================================
   DADOS — todas as rolagens passam por aqui e ficam registradas
   ============================================================ */
const Dados = {
  historico: [],

  rolar(faces, motivo=''){
    const v = Math.floor(Math.random() * faces) + 1;
    const reg = {dado:'d'+faces, valor:v, motivo, faces};
    this.historico.push(reg);
    if (this.historico.length > 200) this.historico.shift();
    if (typeof UI !== 'undefined' && UI.mostrarDado) UI.mostrarDado(reg);
    return v;
  },

  d4 (m){ return this.rolar(4, m); },
  d6 (m){ return this.rolar(6, m); },
  d10(m){ return this.rolar(10, m); },
  d20(m){ return this.rolar(20, m); },

  /* POKÉROLE: parada de d6. Cada 4, 5 ou 6 é um sucesso. A parada vai
     inteira pra bandeja numa entrada só, com as faces, senão doze dados
     de um golpe empurravam o resto pra fora. */
  pool(n, motivo=''){
    n = Math.max(0, Math.floor(n));
    const faces = [];
    for (let i = 0; i < n; i++) faces.push(Math.floor(Math.random() * 6) + 1);
    const suc = faces.filter(v => v >= 4).length;
    const reg = {dado:n + 'd6', valor:suc, motivo, faces:6, pool:faces};
    this.historico.push(reg);
    if (this.historico.length > 200) this.historico.shift();
    if (typeof UI !== 'undefined' && UI.mostrarDado) UI.mostrarDado(reg);
    return {n, faces, suc};
  },

  /* Dados de chance: o efeito acontece se algum der 6. */
  chanceDados(n, motivo=''){
    if (n <= 0) return false;
    const faces = [];
    for (let i = 0; i < n; i++) faces.push(Math.floor(Math.random() * 6) + 1);
    const seis = faces.filter(v => v === 6).length;
    const reg = {dado:n + 'd6', valor:seis, motivo, faces:6, pool:faces, chance:true};
    this.historico.push(reg);
    if (this.historico.length > 200) this.historico.shift();
    if (typeof UI !== 'undefined' && UI.mostrarDado) UI.mostrarDado(reg);
    return seis > 0;
  },

  /* escolha aleatória simples (não entra no histórico) */
  escolher(arr){ return arr[Math.floor(Math.random() * arr.length)]; },
  entre(a, b){ return Math.floor(Math.random() * (b - a + 1)) + a; },
  chance(pct){ return Math.random() * 100 < pct; },

  /* ============================================================
     TESTE DO TREINADOR — Pokérole
     O status é o atributo, e a perícia de quem anda por Kanto conta
     PERICIA_BASE dados. Parada de d6, sucesso em 4+, como no combate.
     A dificuldade escrita nas cenas (na escala antiga, de 4 a 11) vira
     o número de sucessos pedidos. Os quatro graus continuam, pela
     sobra: um a mais é crítico, na conta é sucesso, faltou um é
     parcial, faltaram dois é fracasso. A Vontade é o Forçar o destino
     do livro: um sucesso a mais, de graça.
     ============================================================ */
  PERICIA_BASE: 2,
  sucessosPedidos(dif){
    return dif <= 4 ? 1 : dif <= 7 ? 2 : dif <= 9 ? 3 : dif <= 11 ? 4 : 5;
  },
  paradaDoTreinador(valorStatus, extra, nomeStatus, dificuldade, auto){
    const n = Math.max(1, (valorStatus || 0) + this.PERICIA_BASE + (extra || 0));
    const r = this.pool(n, 'Teste de ' + (nomeStatus || 'perícia'));
    const req = this.sucessosPedidos(dificuldade);
    const suc = r.suc + (auto || 0);
    const m = suc - req;
    const grau = m >= 1 ? 'critico' : m === 0 ? 'sucesso' : m === -1 ? 'parcial' : 'falha';
    const texto = {critico:'Sucesso crítico', sucesso:'Sucesso', parcial:'Sucesso parcial', falha:'Fracasso'}[grau];
    return {n, faces:r.faces, suc, req, grau, texto};
  },

  teste(valorStatus, dificuldade, nomeStatus='', auto=0){
    /* lugar de gosto dá um dado a mais, de desgosto um a menos (js/story/rumo.js) */
    const gosto = (typeof bonusDeGosto === 'function') ? bonusDeGosto() : 0;
    const p = this.paradaDoTreinador(valorStatus, gosto, nomeStatus, dificuldade, auto);
    return {dados:p.n, faces:p.faces, sucessos:p.suc, pedidos:p.req, auto:auto || 0,
            bonus:valorStatus, gosto, nomeStatus, dificuldade, grau:p.grau, texto:p.texto,
            total:p.suc};
  },

  /* ============================================================
     TESTE COM O TIME JUNTO
     O mesmo teste, mas quem está no seu cinto conta. Uma tarefa
     que pede silêncio vai melhor com um Quiet do que com um
     Jolly, e a linha de explicação sempre aparece — o jogador
     tem que ver por que a parada mudou.
     ============================================================ */
  testeComTime(valorStatus, dificuldade, nomeStatus, eixo, auto=0){
    const t = (typeof modificadorDeTemperamento === 'function')
      ? modificadorDeTemperamento(eixo) : {mod:0, linha:null};
    /* quem vai na frente é quem você manda primeiro: se ele não te
       entende, a tarefa inteira fica mais difícil */
    const lider = (typeof Estado !== 'undefined' && Estado.primeiroApto) ? Estado.primeiroApto() : null;
    const af = (lider && typeof efeitosDeAfinidade === 'function')
      ? efeitosDeAfinidade(lider) : {teste:0, grau:'neutro'};
    const gosto = (typeof bonusDeGosto === 'function') ? bonusDeGosto() : 0;
    const p = this.paradaDoTreinador(valorStatus, t.mod + af.teste + gosto, nomeStatus, dificuldade, auto);
    return {dados:p.n, faces:p.faces, sucessos:p.suc, pedidos:p.req, auto:auto || 0,
            bonus:valorStatus, gosto, temperamento:t.mod + af.teste, linhaTime:t.linha,
            melhor:t.melhor, pior:t.pior, afinidade:af, eixo, nomeStatus,
            dificuldade, grau:p.grau, texto:p.texto, total:p.suc};
  },

  /* a conta inteira, escrita: número que decide a cena tem que estar
     à vista, senão o jogador não tem como conferir */
  contaDoTeste(r){
    const mods = (r.temperamento ? ` ${r.temperamento > 0 ? '+' : '−'} ${Math.abs(r.temperamento)} (o cinto)` : '')
               + (r.gosto ? (r.gosto > 0 ? ' + 1 (gosto)' : ' − 1 (desgosto)') : '');
    return `${r.dados}d6 [${r.faces.join(' ')}] — ${r.nomeStatus || 'status'} ${r.bonus} + perícia ${this.PERICIA_BASE}${mods}`
         + ` = ${r.sucessos} sucesso${r.sucessos === 1 ? '' : 's'}${r.auto ? ' (1 da Vontade)' : ''}, pede ${r.pedidos}`;
  }
};
