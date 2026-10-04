/* ============================================================
   LUTA SALVA — recarregar não tira ninguém da luta
   Todo salvamento feito durante a luta (e na tela do Continuar,
   antes de o resultado ser aplicado) leva junto uma foto dela: o
   estado inteiro da batalha, quem está em campo, o time de lá e o
   contexto (ginásio, estrada, cena, rival, Elite…). Carregar o jogo
   volta pra mesma luta, no mesmo turno. A única saída de luta contra
   treinador é vencer, perder ou o Forfeit.
   ============================================================ */
const LutaSalva = {
  CONTEXTOS: ['cenaBatalha','ginasioAtual','eliteAtual','torneioAtual','rivalAtual','revancheAtual',
              'veteranoAtual','conferenciaAtual','estradaAtual','batalhaLivre'],

  foto(){
    const B = Batalha, d = Estado.dados;
    const b = {};
    for (const k of Object.keys(B)){
      const v = B[k];
      if (typeof v === 'function') continue;
      if (['aliado','eventos','aoTerminar','participantes','fim'].includes(k)) continue;
      b[k] = v;
    }
    b.aliadoUid = B.aliado ? B.aliado.uid : null;
    b.participantes = [...(B.participantes || [])];
    const ctx = {};
    for (const k of this.CONTEXTOS){
      const v = (typeof Jogo !== 'undefined') ? Jogo[k] : null;
      if (v == null || v === false) continue;
      if (k === 'cenaBatalha') ctx[k] = {cap:d.capitulo, cena:d.cena};
      else if (k === 'ginasioAtual') ctx[k] = {id:v.id};
      else ctx[k] = v;
    }
    /* resultado já decidido, esperando o Continuar */
    let fim = null;
    if (typeof Jogo !== 'undefined' && Jogo.fimPendente){
      fim = Object.assign({}, Jogo.fimPendente);
      if (fim.pokemon) fim.pokemonUid = fim.pokemon.uid, delete fim.pokemon;
    }
    return JSON.parse(JSON.stringify({b, ctx, fim, quando:Date.now()}));
  },

  /* chamado por Estado.salvar: a foto entra ou sai do save */
  anotar(d){
    if (!d) return;
    const pendente = typeof Jogo !== 'undefined' && Jogo.fimPendente;
    if (emLuta() || pendente){
      try { d.lutaSalva = this.foto(); } catch(e){ delete d.lutaSalva; }
    } else delete d.lutaSalva;
  },

  retomar(){
    const d = Estado.dados, s = d && d.lutaSalva;
    if (!s || !s.b) return false;
    const B = Batalha;
    Object.assign(B, s.b);
    B.aliado = (d.time || []).find(p => p.uid === s.b.aliadoUid) || Estado.primeiroApto() || (d.time || [])[0];
    B.participantes = new Set(s.b.participantes || []);
    B.eventos = []; B.aoTerminar = null; B.fim = null;

    /* o contexto: o que a luta vale e pra onde ela leva */
    this.CONTEXTOS.forEach(k => { Jogo[k] = (k === 'batalhaLivre') ? false : null; });
    for (const [k, v] of Object.entries(s.ctx || {})){
      if (k === 'cenaBatalha'){
        const cap = Historia.capitulo(v.cap);
        if (cap){ Historia.capAtual = cap; const cena = cap.cenas[v.cena]; if (cena){ Historia.cenaAtual = cena; Jogo.cenaBatalha = cena.batalha || null; } }
      } else if (k === 'ginasioAtual'){
        Jogo.ginasioAtual = (typeof GINASIOS !== 'undefined' ? GINASIOS.find(g => g.id === v.id) : null) || null;
      } else Jogo[k] = v;
    }
    Jogo.encenando = false; Jogo.animandoBola = false;

    if (s.fim){
      /* acabou antes do recarregar: mostra o fim de novo e segue */
      const fim = Object.assign({}, s.fim);
      if (fim.pokemonUid) fim.pokemon = (d.time || []).concat(d.pc || []).find(p => p.uid === fim.pokemonUid) || null;
      B.ativo = false;
      UI.telaBatalha(['A luta já tinha terminado.']);
      Jogo.fimDeBatalha(fim);
      return true;
    }
    B.ativo = true;
    UI.telaBatalha(['A luta continua de onde parou.']);
    /* quem estava em campo caiu e a troca não tinha sido feita */
    if (B.aliado && !estaVivo(B.aliado)){
      const reservas = d.time.filter(p => estaVivo(p) && p.uid !== B.aliado.uid).map(p => p.uid);
      if (reservas.length) setTimeout(() => UI.trocaObrigatoria(reservas), 2600);
    }
    return true;
  }
};
