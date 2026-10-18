/* ============================================================
   FOME — o time come, e a Ração é o que garante a refeição
   Cada Pokémon guarda a hora da última refeição (`p.comeu`, em horas
   corridas do relógio do jogo). Um dia inteiro sem comer não muda nada.
   Passou de um dia e tem Ração na mochila, o time come sozinho: uma
   Ração por dia que passou, pra todo mundo, e o topo da tela avisa
   quanto sobrou (`Fome.avisos`). Sem Ração, a fome chega primeiro na
   luta: com fome (24 h) ele às vezes se distrai e não faz o que você
   mandou; faminto (48 h) se distrai mais e começa a perder moral,
   FOME_MORAL a cada 12 horas, até FOME_TETO por jejum. Comer acaba com
   tudo isso na hora.
   Come no Centro, em casa, em toda cura completa, nos dias que a
   história conta como vividos, quando volta do PC, com Ração na mão
   (um) ou alimentando o time (uma Ração dá pra todos) e no acampamento.
   ============================================================ */
const FOME_LIVRE_H = 24;      // um dia sem comer não muda nada
const FAMINTO_H = 48;         // dois dias: faminto
const FOME_PASSO_H = 12;      // faminto, a cada meio dia…
const FOME_MORAL = 2;         // …a moral cai isto
const FOME_TETO = 10;         // e um jejum inteiro não tira mais que isto
const FOME_DISTRAI = 10;      // % de se distrair na luta, com fome
const FAMINTO_DISTRAI = 20;   // % de se distrair na luta, faminto

const Fome = {
  /* o que o topo da próxima tela conta: "o time comeu da mochila" */
  avisos: [],
  agora(){
    const r = Estado.dados && Estado.dados.relogio;
    return r ? (r.dia || 0) * 24 + (r.hora || 0) : 0;
  },
  /* horas desde a última refeição; quem nunca foi contado começa agora */
  horas(p){
    if (p.comeu == null){ p.comeu = this.agora(); p.fomeCobrada = 0; }
    return Math.max(0, this.agora() - p.comeu);
  },
  estado(p){
    if (!p || p.morto) return null;
    const h = this.horas(p);
    return h >= FAMINTO_H ? 'faminto' : h >= FOME_LIVRE_H ? 'com fome' : null;
  },
  /* o pior estado do time, pro topo da tela */
  doTime(){
    const d = Estado.dados;
    if (!d || !d.time) return null;
    const e = d.time.map(p => this.estado(p));
    return e.includes('faminto') ? 'faminto' : e.includes('com fome') ? 'com fome' : null;
  },
  /* % de ele se distrair na luta e não fazer o que você mandou */
  distrai(p){
    const e = this.estado(p);
    return e === 'faminto' ? FAMINTO_DISTRAI : e === 'com fome' ? FOME_DISTRAI : 0;
  },
  alimentar(p){
    if (!p) return;
    p.comeu = this.agora(); p.fomeCobrada = 0;
  },
  alimentarTime(){ (Estado.dados.time || []).forEach(p => { if (!p.morto) this.alimentar(p); }); },
  /* chamado sempre que o relógio anda */
  passar(){
    const d = Estado.dados;
    if (!d || !d.time) return [];
    const vivos = d.time.filter(p => !p.morto);
    if (!vivos.length) return [];
    /* com Ração na mochila, o time come sozinho: uma por dia que passou */
    const maisFaminto = Math.max(...vivos.map(p => this.horas(p)));
    const tem = Estado.contaItem('Ração');
    if (maisFaminto >= FOME_LIVRE_H && tem > 0){
      const refeicoes = Math.min(tem, Math.floor(maisFaminto / FOME_LIVRE_H));
      for (let i = 0; i < refeicoes; i++) Estado.usarItem('Ração');
      this.alimentarTime();
      vivos.forEach(p => { p.moral = Math.min(100, (p.moral || 0) + 2); });
      const resta = Estado.contaItem('Ração');
      this.avisos = [resta
        ? `O time comeu da mochila. Sobr${resta > 1 ? 'am' : 'a'} ${resta} ${resta > 1 ? 'Rações' : 'Ração'}.`
        : 'O time comeu a última Ração da mochila.'];
      if (!resta) Estado.registrar('Acabou a Ração da mochila.');
      return [];
    }
    /* sem Ração, só quem passou de dois dias perde moral, e pouco */
    const caiu = [];
    const maxCobrancas = Math.floor(FOME_TETO / FOME_MORAL);
    vivos.forEach(p => {
      const h = this.horas(p);
      const devidos = h < FAMINTO_H ? 0 : Math.min(maxCobrancas, Math.floor((h - FAMINTO_H) / FOME_PASSO_H) + 1);
      const novos = devidos - (p.fomeCobrada || 0);
      if (novos > 0){
        p.moral = Math.max(0, (p.moral || 0) - novos * FOME_MORAL);
        p.fomeCobrada = devidos;
        caiu.push(p);
      }
    });
    return caiu;
  },
  /* o aviso sai uma vez, na próxima tela */
  tirarAvisos(){ const a = this.avisos; this.avisos = []; return a; },
  /* Alimentar o time: uma Ração serve pra todo mundo */
  daRacaoPraTodos(){
    if (Estado.contaItem('Ração') <= 0) return false;
    Estado.usarItem('Ração');
    this.alimentarTime();
    (Estado.dados.time || []).forEach(p => { if (!p.morto) p.moral = Math.min(100, (p.moral || 0) + 2); });
    return true;
  }
};
