/* ============================================================
   FOME — o time come, ou o vínculo cobra
   Cada Pokémon guarda a hora da última refeição (`p.comeu`, em horas
   corridas do relógio do jogo). O primeiro dia é de graça; dali em
   diante, a cada doze horas sem comer, a moral cai FOME_MORAL. Quem
   passou de dois dias está faminto. Come no Centro, em casa, em toda
   cura completa, com Ração na mão (um) ou alimentando o time (uma
   Ração dá pra todos) e no acampamento, que gasta uma Ração.
   Moral baixa é desobediência: a fome chega na luta por ali.
   ============================================================ */
const FOME_LIVRE_H = 24;     // um dia sem comer não muda nada
const FOME_PASSO_H = 12;     // depois disso, a cada meio dia…
const FOME_MORAL = 4;        // …a moral cai isto
const FAMINTO_H = 48;

const Fome = {
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
  alimentar(p){
    if (!p) return;
    p.comeu = this.agora(); p.fomeCobrada = 0;
  },
  alimentarTime(){ (Estado.dados.time || []).forEach(p => { if (!p.morto) this.alimentar(p); }); },
  /* chamado sempre que o relógio anda: cobra os meios-dias novos */
  passar(){
    const d = Estado.dados;
    if (!d || !d.time) return [];
    const caiu = [];
    d.time.forEach(p => {
      if (p.morto) return;
      const h = this.horas(p);
      const devidos = h < FOME_LIVRE_H ? 0 : Math.floor((h - FOME_LIVRE_H) / FOME_PASSO_H) + 1;
      const novos = devidos - (p.fomeCobrada || 0);
      if (novos > 0){
        p.moral = Math.max(0, (p.moral || 0) - novos * FOME_MORAL);
        p.fomeCobrada = devidos;
        caiu.push(p);
      }
    });
    return caiu;
  },
  /* Alimentar o time: uma Ração serve pra todo mundo */
  daRacaoPraTodos(){
    if (Estado.contaItem('Ração') <= 0) return false;
    Estado.usarItem('Ração');
    this.alimentarTime();
    (Estado.dados.time || []).forEach(p => { if (!p.morto) p.moral = Math.min(100, (p.moral || 0) + 2); });
    return true;
  }
};
