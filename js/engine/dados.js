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

  /* escolha aleatória simples (não entra no histórico) */
  escolher(arr){ return arr[Math.floor(Math.random() * arr.length)]; },
  entre(a, b){ return Math.floor(Math.random() * (b - a + 1)) + a; },
  chance(pct){ return Math.random() * 100 < pct; },

  /* TESTE DE PERÍCIA: 1d10 + status contra dificuldade
     1-3 fracasso total | 4-6 parcial | 7-9 sucesso | 10+ crítico */
  teste(valorStatus, dificuldade, nomeStatus=''){
    const d = this.d10('Teste de ' + (nomeStatus || 'perícia'));
    const total = d + valorStatus;
    let grau, texto;
    if (total <= 3)      { grau = 'falha';    texto = 'Fracasso total'; }
    else if (total <= 6) { grau = 'parcial';  texto = 'Sucesso parcial'; }
    else if (total <= 9) { grau = 'sucesso';  texto = 'Sucesso'; }
    else                 { grau = 'critico';  texto = 'Sucesso crítico'; }
    // a dificuldade pode rebaixar o grau
    if (total < dificuldade){
      grau = (total >= dificuldade - 2) ? 'parcial' : 'falha';
      texto = (grau === 'parcial') ? 'Sucesso parcial (por pouco)' : 'Fracasso';
    }
    return {dado:d, bonus:valorStatus, nomeStatus, total, dificuldade, grau, texto};
  },

  /* ============================================================
     TESTE COM O TIME JUNTO
     O mesmo teste, mas quem está no seu cinto conta. Uma tarefa
     que pede silêncio vai melhor com um Quiet do que com um
     Jolly, e a linha de explicação sempre aparece — o jogador
     tem que ver por que o dado mudou.
     ============================================================ */
  testeComTime(valorStatus, dificuldade, nomeStatus, eixo){
    const t = (typeof modificadorDeTemperamento === 'function')
      ? modificadorDeTemperamento(eixo) : {mod:0, linha:null};
    /* quem vai na frente é quem você manda primeiro: se ele não te
       entende, a tarefa inteira fica mais difícil */
    const lider = (typeof Estado !== 'undefined' && Estado.primeiroApto) ? Estado.primeiroApto() : null;
    const af = (lider && typeof efeitosDeAfinidade === 'function')
      ? efeitosDeAfinidade(lider) : {teste:0, grau:'neutro'};
    const d = this.d10('Teste de ' + (nomeStatus || 'perícia'));
    const total = d + valorStatus + t.mod + af.teste;
    let grau, texto;
    if (total <= 3)      { grau = 'falha';    texto = 'Fracasso total'; }
    else if (total <= 6) { grau = 'parcial';  texto = 'Sucesso parcial'; }
    else if (total <= 9) { grau = 'sucesso';  texto = 'Sucesso'; }
    else                 { grau = 'critico';  texto = 'Sucesso crítico'; }
    if (total < dificuldade){
      grau = (total >= dificuldade - 2) ? 'parcial' : 'falha';
      texto = (grau === 'parcial') ? 'Sucesso parcial (por pouco)' : 'Fracasso';
    }
    return {dado:d, bonus:valorStatus, temperamento:t.mod + af.teste, linhaTime:t.linha,
            melhor:t.melhor, pior:t.pior, afinidade:af, eixo, nomeStatus,
            total, dificuldade, grau, texto};
  }
};
