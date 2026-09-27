/* ============================================================
   SPRITES — Kanto e Johto (1 a 251)

   A convenção de pastas é a do diretório sprites_nds/:

     sprites_nds/party_icons/{id}.png               ícone de equipe e PC
     sprites_nds/battle/front_full/{id}.png         frente: batalha e Pokédex
     sprites_nds/battle/front_full_shiny/{id}.png   frente brilhante
     sprites_nds/battle/back_full/{id}.png          costas: o seu, em combate
     sprites_nds/battle/back_full_shiny/{id}.png    costas brilhante

   Frente e costas são as artes de Black/White, de corpo inteiro. As
   de HeartGold/SoulSilver enquadram de perto e cortam nas bordas —
   Charizard perde a asa, Snorlax perde o pé. Ficam em battle/front/,
   front_shiny/, back/ e back_shiny/, fora de uso.

   O corpo inteiro vem com folga: a arte ocupa 53% do quadro, contra
   62% da antiga de frente e 76% da antiga de costas. Por isso o CSS
   desenha maior — senão o bicho encolhe na tela sem ter encolhido.
   Os números estão medidos, não chutados; ver CLAUDE.md.

   Nada aqui é obrigatório: se a pasta não estiver do lado do jogo,
   cada <img> se apaga sozinha e a tela volta a ser a de antes.
   No arquivo único, o build troca cada caminho por um data URI e
   o jogo continua funcionando offline, sem pasta nenhuma.
   ============================================================ */
const SPRITES_BASE = 'sprites_nds/';

const SPRITES_PASTA = {
  icone:        'party_icons/',
  frente:       'battle/front_full/',
  frenteShiny:  'battle/front_full_shiny/',
  costas:       'battle/back_full/',
  costasShiny:  'battle/back_full_shiny/'
};

/* Preenchido pelo build.py no arquivo único. Vazio no modo pasta. */
const SPRITES_EMBUTIDOS = (typeof SPRITES_DATA !== 'undefined') ? SPRITES_DATA : {};

/* vista: 'icone' | 'frente' | 'costas' */
function caminhoSprite(dexId, vista, shiny){
  const chave = (shiny && vista !== 'icone') ? vista + 'Shiny' : vista;
  const pasta = SPRITES_PASTA[chave] || SPRITES_PASTA.frente;
  const rel = SPRITES_BASE + pasta + dexId + '.png';
  return SPRITES_EMBUTIDOS[rel] || rel;
}

/* O <img> pronto, já sabendo se aquele bicho é brilhante.
   oculto: a espécie ainda não foi catalogada — sai em silhueta. */
function imgSprite(p, vista, opcoes){
  if (!p || !p.dex) return '';
  const o = opcoes || {};
  const src = caminhoSprite(p.dex, vista, p.shiny);
  const classes = ['sprite', 'sprite-' + vista];
  if (o.oculto) classes.push('silhueta');
  if (p.shiny && !o.oculto) classes.push('sprite-brilho');
  if (o.classe) classes.push(o.classe);
  const alt = o.oculto ? 'Espécie não catalogada' : (p.nome || '');
  /* onerror: sem a pasta de sprites, a imagem some e o layout fecha */
  return `<img class="${classes.join(' ')}" src="${src}" alt="${alt}" loading="lazy"
    onerror="this.remove()">`;
}

/* Versão por número da Pokédex, para telas que não têm instância */
function imgSpriteDex(dexId, vista, opcoes){
  return imgSprite({dex:dexId, nome:(DEX[dexId]||{}).nome}, vista, opcoes);
}

/* ============================================================
   ITENS — ícone da mochila e bola do arremesso

     sprites_nds/items/{arquivo}.png                ícone de item (30×30)
     sprites_nds/animations/pokeball/ball_closed.png  Poké Ball do arremesso

   O mapa vai do nome que o JOGO usa pro arquivo. Só entra item com
   equivalente exato nos jogos — Resto de Ração é Leftovers porque a
   ficha é a mesma (7% do HP por turno), Faixa Firme é Focus Band
   porque sobrevive com 1 HP. Ferramenta que só existe aqui (Machado,
   Picareta, Lanterna, Bandagem…) e papel de enredo ficam sem ícone:
   inventar arte pra eles seria pior que deixar o espaço vazio.
   ============================================================ */
const ITENS_PASTA = 'items/';
const ITEM_SPRITE = {
  /* bolas */
  'Poké Ball':'pokeball', 'Great Ball':'greatball',
  'Ultra Ball':'ultraball', 'Master Ball':'masterball',
  /* cura */
  'Potion':'potion', 'Super Potion':'super_potion', 'Hyper Potion':'hyper_potion',
  'Revive':'revive', 'Água Fresca':'fresh_water',
  'Éter':'ether', 'Elixir':'elixir',
  /* status */
  'Antidote':'antidote', 'Full Heal':'full_heal',
  /* campo */
  'Repelente':'repel', 'Corda':'escape_rope', 'Mapa de Kanto':'town_map',
  'Boneco':'poke_doll',
  /* evolução */
  'Moon Stone':'moon_stone', 'Pedra do Fogo':'fire_stone', 'Pedra da Água':'water_stone',
  'Pedra do Trovão':'thunder_stone', 'Pedra da Folha':'leaf_stone', 'Pedra do Sol':'sun_stone',
  /* segurados — mesma ficha do item dos jogos */
  'Resto de Ração':'leftovers', 'Faixa Firme':'focus_band', 'Sino Calmante':'soothe_bell',
  'Amuleto de Moeda':'amulet_coin', 'Punho de Ferro':'muscle_band', 'Óculos Grossos':'wise_glasses'
};

function caminhoItem(nome){
  const arq = ITEM_SPRITE[nome];
  if (!arq) return null;
  const rel = SPRITES_BASE + ITENS_PASTA + arq + '.png';
  return SPRITES_EMBUTIDOS[rel] || rel;
}

/* Sem arte, devolve uma casa vazia do mesmo tamanho: a coluna dos
   nomes não pode pular de linha pra linha só porque um item tem ícone
   e o de baixo não. */
function imgItem(nome, classe){
  const src = caminhoItem(nome);
  const c = 'item-icone' + (classe ? ' ' + classe : '');
  if (!src) return `<span class="${c} sem-arte" aria-hidden="true"></span>`;
  /* Sem loading="lazy": pra ícone de 30×30 ele não economiza nada — no
     arquivo único a arte já está na memória — e só faz o ícone de baixo
     da dobra aparecer atrasado quando a mochila rola. */
  return `<img class="${c}" src="${src}" alt=""
    onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'${c} sem-arte'}))">`;
}

/* A bola que voa no arremesso. A Poké Ball usa o quadro da pasta de
   animação; as outras usam o próprio ícone, que é a mesma bola vista
   do mesmo ângulo. Bola aberta não tem arquivo: o endereço dela não
   existe na origem, então a tela abre a fechada ao meio (ver CSS). */
function spriteDaBola(nome){
  if (nome === 'Poké Ball'){
    const rel = SPRITES_BASE + 'animations/pokeball/ball_closed.png';
    return SPRITES_EMBUTIDOS[rel] || rel;
  }
  return caminhoItem(nome) || caminhoItem('Poké Ball');
}
