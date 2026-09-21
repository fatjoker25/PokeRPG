/* ============================================================
   ARENAS — onde a batalha acontece
   O cenário não é enfeite: ele sai do lugar. O ambiente do
   capítulo (ou do ponto do mapa, quando o encontro é livre) cai
   numa das cinco arenas; ginásio, Elite e torneio entram por
   cima de tudo, porque lá o chão é quadra, não é mato.
   Nada disso baixa arquivo: as cinco arenas são desenhadas em
   CSS, então continuam funcionando com o jogo aberto offline.
   ============================================================ */

/* Nove ambientes escritos na história e no mapa, cinco arenas. */
const ARENA_POR_AMBIENTE = {
  campo:     'grama',     // rota aberta, pasto, mato alto
  floresta:  'grama',     // mesma arena, copa fechada por cima
  agua:      'agua',      // mar, rio, doca, ponte
  caverna:   'caverna',   // pedra e teto baixo
  montanha:  'caverna',   // mesma pedra, céu aberto
  vulcao:    'caverna',   // mesma pedra, brasa embaixo
  cidade:    'predio',    // asfalto, calçada, pátio
  ruina:     'predio',    // mesmo concreto, sem manutenção
  cemiterio: 'predio'     // mesmo piso, luz de vela
};

/* O fundo de verdade, um por ambiente. São imagens de cenário de
   batalha, na mesma pasta e pelo mesmo caminho dos 1255 sprites, então
   o arquivo único as embute junto e o jogo continua abrindo offline.
   Ginásio não tem imagem: quadra fechada é desenhada em CSS, porque
   fundo de ginásio livre não existe pra baixar. */
const ARENAS_BASE = 'sprites_nds/arenas/';
const FUNDO_POR_AMBIENTE = {
  campo:     'campo.png',       // rota de terra batida entre o mato
  floresta:  'floresta.png',    // copa fechada, tronco grosso
  agua:      'agua.png',        // areia e mar aberto
  caverna:   'caverna.png',     // pedra e boca de túnel
  montanha:  'montanha.png',    // mesma pedra com o céu por cima
  vulcao:    'vulcao.png',      // lava exposta no chão
  cidade:    'cidade.png',      // calçada e parede de tijolo
  ruina:     'ruina.png',       // mato seco tomando conta do lugar
  cemiterio: 'cemiterio.png'    // pedra cinza e névoa baixa
};

/* O nome que o jogador lê na ficha do combate. */
const NOME_DA_ARENA = {
  grama:   'campo aberto',
  agua:    'beira d\'água',
  caverna: 'rocha',
  predio:  'piso duro',
  ginasio: 'quadra de ginásio'
};

const Arenas = {
  /* Ginásio, Elite e torneio são quadra oficial, doa a onde for. */
  ehQuadra(){
    return typeof Jogo !== 'undefined' &&
      !!(Jogo.ginasioAtual || Jogo.eliteAtual || Jogo.torneioAtual);
  },

  /* Encontro livre olha o mapa; batalha de cena olha o capítulo. */
  ambienteAtual(){
    if (typeof Jogo !== 'undefined' && Jogo.batalhaLivre &&
        typeof Mundo !== 'undefined'){
      const L = Mundo.atual();
      if (L && L.ambiente) return L.ambiente;
    }
    if (typeof Historia !== 'undefined'){
      const cap = Historia.capAtual ||
        (Estado.dados ? Historia.capitulo(Estado.dados.capitulo) : null);
      if (cap && cap.ambiente) return cap.ambiente;
    }
    if (typeof Mundo !== 'undefined'){
      const L = Mundo.atual();
      if (L && L.ambiente) return L.ambiente;
    }
    return 'campo';
  },

  /* Resolve o caminho do fundo: embutido no arquivo único, ou o
     arquivo na pasta do lado. Sem a pasta, devolve nada e a arena
     cai no gradiente de CSS sem quebrar. */
  fundoDe(ambiente){
    const arq = FUNDO_POR_AMBIENTE[ambiente];
    if (!arq) return null;
    const rel = ARENAS_BASE + arq;
    if (typeof SPRITES_EMBUTIDOS !== 'undefined' && SPRITES_EMBUTIDOS[rel]) {
      return SPRITES_EMBUTIDOS[rel];
    }
    /* Caminho absoluto de propósito: dentro de var() o navegador
       resolve URL relativa pela pasta do CSS, não pela da página, e
       o fundo sumiria calado. */
    try { return new URL(rel, document.baseURI).href; }
    catch (e) { return rel; }
  },

  /* {arena, ambiente, nome, fundo} — a arena forçada pela cena ganha de tudo. */
  atual(){
    const forcada = (typeof Batalha !== 'undefined') ? Batalha.arena : null;
    const ambiente = this.ambienteAtual();
    let arena;
    if (forcada && NOME_DA_ARENA[forcada]) arena = forcada;
    else if (this.ehQuadra()) arena = 'ginasio';
    else arena = ARENA_POR_AMBIENTE[ambiente] || 'grama';
    /* na quadra o chão é desenhado, então ela não carrega imagem */
    const fundo = (arena === 'ginasio') ? null : this.fundoDe(ambiente);
    return {arena, ambiente, nome: NOME_DA_ARENA[arena], fundo};
  }
};
