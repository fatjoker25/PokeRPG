/* ============================================================
   SPRITES — HeartGold/SoulSilver, Kanto e Johto (1 a 251)

   A convenção de pastas é a do diretório sprites_nds/:

     sprites_nds/party_icons/{id}.png          ícone de equipe e PC
     sprites_nds/battle/front/{id}.png         frente: batalha e Pokédex
     sprites_nds/battle/front_shiny/{id}.png   frente brilhante
     sprites_nds/battle/back/{id}.png          costas: o seu, em combate
     sprites_nds/battle/back_shiny/{id}.png    costas brilhante

   Nada aqui é obrigatório: se a pasta não estiver do lado do jogo,
   cada <img> se apaga sozinha e a tela volta a ser a de antes.
   No arquivo único, o build troca cada caminho por um data URI e
   o jogo continua funcionando offline, sem pasta nenhuma.
   ============================================================ */
const SPRITES_BASE = 'sprites_nds/';

const SPRITES_PASTA = {
  icone:        'party_icons/',
  frente:       'battle/front/',
  frenteShiny:  'battle/front_shiny/',
  costas:       'battle/back/',
  costasShiny:  'battle/back_shiny/'
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
