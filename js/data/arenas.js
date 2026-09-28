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

/* De onde o bicho sai e pra onde ele volta, em cada ambiente. Caverna
   não tem mato e cidade não tem galho: o texto da procura, do encontro
   e da fuga lê daqui. */
const TERRENO = {
  campo:    {procurar:'Procurar Pokémon no mato', sai:'do mato', volta:'para o mato',
             andar:'Você anda devagar pelo mato alto, parando a cada poucos passos.',
             fuga:'Você corre. O capim corta a canela, mas você escapa.'},
  floresta: {procurar:'Procurar Pokémon no mato', sai:'do meio das árvores', volta:'para o mato',
             andar:'Você anda devagar entre as árvores, parando a cada poucos passos.',
             fuga:'Você corre. Os galhos cortam sua cara, mas você escapa.'},
  caverna:  {procurar:'Procurar Pokémon nas galerias', sai:'do escuro', volta:'para o escuro',
             andar:'Você anda devagar pela galeria, com a mão na parede, parando a cada poucos passos.',
             fuga:'Você corre no escuro. Bate o ombro na pedra duas vezes, mas escapa.'},
  montanha: {procurar:'Procurar Pokémon entre as pedras', sai:'de trás de uma pedra', volta:'por entre as pedras',
             andar:'Você sobe devagar entre as pedras soltas, parando a cada poucos passos.',
             fuga:'Você desce correndo. As pedras soltas quase te derrubam, mas você escapa.'},
  agua:     {procurar:'Procurar Pokémon na beira da água', sai:'da água', volta:'para a água',
             andar:'Você anda devagar pela beira da água, parando a cada poucos passos.',
             fuga:'Você corre pela areia molhada e escapa.'},
  vulcao:   {procurar:'Procurar Pokémon entre as rochas', sai:'de trás de uma rocha', volta:'por entre as rochas',
             andar:'Você anda devagar entre as rochas quentes, parando a cada poucos passos.',
             fuga:'Você corre pela rocha quente, com a sola do tênis amolecendo, e escapa.'},
  cidade:   {procurar:'Procurar Pokémon pelos cantos', sai:'de um beco', volta:'por um beco',
             andar:'Você anda devagar pelos cantos, olhando atrás de lata e debaixo de escada.',
             fuga:'Você corre, vira duas esquinas e escapa.'},
  ruina:    {procurar:'Procurar Pokémon nos escombros', sai:'dos escombros', volta:'para os escombros',
             andar:'Você anda devagar entre os escombros, parando a cada poucos passos.',
             fuga:'Você corre por cima dos escombros, rala a mão, mas escapa.'},
  cemiterio:{procurar:'Procurar Pokémon entre as lápides', sai:'de trás de uma lápide', volta:'por entre as lápides',
             andar:'Você anda devagar entre as lápides, parando a cada poucos passos.',
             fuga:'Você corre entre as lápides sem olhar pra trás e escapa.'}
};

/* O fundo da página, atrás do texto: um cenário por lugar do mapa.
   É só ambiente — não muda regra nenhuma. Os mesmos nove fundos da
   batalha, mais o campo cercado (Pallet, Rota 1, Fuchsia) e a
   caverna de gelo das Seafoam. Cena de capítulo num canto que não é
   o do mapa (a caverna embaixo de uma cidade) usa o ambiente do
   capítulo. */
const CENARIO_POR_LOCAL = {
  pallet:'prado.png', rota1:'prado.png', viridian:'cidade.png', rota22:'montanha.png',
  rota2:'floresta.png', floresta:'floresta.png', pewter:'montanha.png', rota3:'montanha.png',
  monte_lua:'caverna.png', rota4:'campo.png', cerulean:'cidade.png', rota24:'agua.png',
  rota9:'montanha.png', usina:'ruina.png', tunel_rocha:'caverna.png', lavender:'cemiterio.png',
  rota5:'campo.png', saffron:'cidade.png', rota6:'campo.png', rota7:'campo.png', rota8:'campo.png',
  vermilion:'agua.png', rota11:'campo.png', rota12:'agua.png', rota13:'campo.png',
  celadon:'cidade.png', rota16:'campo.png', fuchsia:'prado.png', rota19:'agua.png',
  seafoam:'gelo.png', cinnabar:'vulcao.png', rota21:'agua.png', rota23:'montanha.png',
  caminho_vitoria:'caverna.png', planalto:'montanha.png', norte:'montanha.png',
  ilha_sem_nome:'montanha.png'
};

const Arenas = {
  /* caminho de um arquivo da pasta de cenários: embutido ou absoluto */
  caminho(arq){
    const rel = ARENAS_BASE + arq;
    if (typeof SPRITES_EMBUTIDOS !== 'undefined' && SPRITES_EMBUTIDOS[rel]) return SPRITES_EMBUTIDOS[rel];
    try { return new URL(rel, document.baseURI).href; }
    catch (e) { return rel; }
  },

  /* o fundo da página agora: o lugar do mapa, ou o chão do capítulo */
  cenarioDaTela(){
    const d = (typeof Estado !== 'undefined') ? Estado.dados : null;
    if (!d || typeof Mundo === 'undefined') return null;
    const id = Mundo.id();
    let arq = CENARIO_POR_LOCAL[id] || null;
    if (d.modo === 'cena' && typeof Historia !== 'undefined'){
      const cap = Historia.capAtual || Historia.capitulo(d.capitulo);
      const amb = cap && (typeof cap.ambiente === 'function' ? cap.ambiente(d) : cap.ambiente);
      const doLugar = (typeof LOCAIS !== 'undefined' && LOCAIS[id]) ? LOCAIS[id].ambiente : null;
      if (amb && (amb !== doLugar || !arq)) arq = FUNDO_POR_AMBIENTE[amb] || arq;
    }
    return arq ? this.caminho(arq) : null;
  },

  terreno(amb){ return TERRENO[amb || this.ambienteAtual()] || TERRENO.campo; },

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
    /* Caminho absoluto de propósito: dentro de var() o navegador
       resolve URL relativa pela pasta do CSS, não pela da página, e
       o fundo sumiria calado. */
    return this.caminho(arq);
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
