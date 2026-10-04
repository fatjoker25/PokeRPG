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

   Em movimento são as de Black/White animadas, da PokeAPI
   (sprites/pokemon/versions/generation-v/black-white/animated/):

     sprites_nds/battle/front_ani/{id}.gif          frente animada
     sprites_nds/battle/front_ani_shiny/{id}.gif    frente animada brilhante
     sprites_nds/battle/back_ani/{id}.gif           costas animada
     sprites_nds/battle/back_ani_shiny/{id}.gif     costas animada brilhante

   Essas vêm recortadas no tamanho do bicho (Bulbasaur 37×38, Lugia
   153×94) e com o pé na borda de baixo: todo mundo na mesma escala de
   pixel, como no jogo. `ajustarSpriteAni` desenha cada uma na escala
   que o CSS dá ao quadro de 96 px da arte parada, então o tamanho na
   tela não muda. Sem a GIF (arquivo único, que não as embute por
   peso), a <img> cai sozinha na arte parada.

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
  costasShiny:  'battle/back_full_shiny/',
  frenteAni:      'battle/front_ani/',
  frenteAniShiny: 'battle/front_ani_shiny/',
  costasAni:      'battle/back_ani/',
  costasAniShiny: 'battle/back_ani_shiny/'
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

/* A GIF animada de Black/White, ou null quando ela não vai carregar:
   no arquivo único só existe o que foi embutido, e pedir o resto seria
   um erro de rede por Pokémon antes de cair na arte parada. */
function caminhoSpriteAni(dexId, vista, shiny){
  if (vista !== 'frente' && vista !== 'costas') return null;
  const rel = SPRITES_BASE + SPRITES_PASTA[vista + 'Ani' + (shiny ? 'Shiny' : '')] + dexId + '.gif';
  if (Object.keys(SPRITES_EMBUTIDOS).length) return SPRITES_EMBUTIDOS[rel] || null;
  return rel;
}

/* O <img> pronto, já sabendo se aquele bicho é brilhante.
   oculto: a espécie ainda não foi catalogada — sai em silhueta.
   estatico: força a arte parada (tela que compara duas artes). */
function imgSprite(p, vista, opcoes){
  if (!p || !p.dex) return '';
  const o = opcoes || {};
  const parado = caminhoSprite(p.dex, vista, p.shiny);
  const ani = o.estatico ? null : caminhoSpriteAni(p.dex, vista, p.shiny);
  const classes = ['sprite', 'sprite-' + vista];
  if (ani) classes.push('ani');
  if (o.oculto) classes.push('silhueta');
  if (p.shiny && !o.oculto) classes.push('sprite-brilho');
  if (o.classe) classes.push(o.classe);
  const alt = o.oculto ? 'Espécie não catalogada' : (p.nome || '');
  /* onerror: sem a GIF, a arte parada; sem a pasta, a imagem some e o
     layout fecha */
  if (ani) return `<img class="${classes.join(' ')}" src="${ani}" data-parado="${parado}" alt="${alt}" loading="lazy"
    onload="ajustarSpriteAni(this)" onerror="spriteParado(this)">`;
  return `<img class="${classes.join(' ')}" src="${parado}" alt="${alt}" loading="lazy"
    onerror="this.remove()">`;
}

/* A GIF vem no tamanho do bicho, sem a folga do quadro de 96 px da
   arte parada. Escala única: o que o CSS dá ao quadro dividido por 96
   — Bulbasaur sai pequeno e Lugia grande, como no jogo. E o pé, que na
   arte parada fica a 76% do quadro, aqui é a borda de baixo: a margem
   ganha os 24% que sobravam, pra ele pousar na mesma linha (na arena;
   fora dela a arte é centralizada e a margem fica como está). */
function ajustarSpriteAni(img){
  if (!img.classList.contains('ani') || !img.naturalWidth) return;
  img.style.width = img.style.height = img.style.marginBottom = '';
  const cs = getComputedStyle(img);
  const quadro = parseFloat(cs.width) || 96;
  const k = quadro / 96;
  img.dataset.quadro = quadro;
  img.style.width = (img.naturalWidth * k).toFixed(1) + 'px';
  img.style.height = (img.naturalHeight * k).toFixed(1) + 'px';
  /* só na arena o pé importa (é ele que pousa na base); Pokédex, PC e
     sumário centralizam a arte, e lá a margem só a tiraria do meio */
  if (img.closest('.lutador .arte'))
    img.style.marginBottom = ((parseFloat(cs.marginBottom) || 0) + quadro * .24).toFixed(1) + 'px';
}
function spriteParado(img){
  const p = img.dataset.parado;
  if (!p || img.src.endsWith(p) || img.getAttribute('src') === p){ img.remove(); return; }
  img.classList.remove('ani');
  img.style.width = img.style.height = img.style.marginBottom = '';
  img.removeAttribute('onload');
  img.onerror = () => img.remove();
  img.src = p;
  /* sem a GIF o repouso volta a ser o do animador */
  const lut = img.closest && img.closest('.lutador');
  if (lut && typeof AnimadorSprite !== 'undefined')
    AnimadorSprite.repouso(lut.classList.contains('aliado') ? 'aliado' : 'inimigo');
}
/* onde fica o pé, em fração da altura da caixa: a arte parada tem 24%
   de folga embaixo; a GIF termina no pé */
function peDoSprite(img){ return img && img.classList.contains('ani') ? 1 : .76; }

/* Versão por número da Pokédex, para telas que não têm instância */
function imgSpriteDex(dexId, vista, opcoes){
  return imgSprite({dex:dexId, nome:(DEX[dexId]||{}).nome}, vista, opcoes);
}

/* ============================================================
   ITENS — ícone da mochila e bola do arremesso

     sprites_nds/items/{arquivo}.png                ícone de item (30×30)
     sprites_nds/animations/pokeball/{tipo}-ball.png  a bola na arena (24×24)

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
  'Amuleto de Moeda':'amulet_coin', 'Punho de Ferro':'muscle_band', 'Óculos Grossos':'wise_glasses',
  /* o mapa da região: o ícone do Town Map abre o mapa desenhado */
  'Mapa de Kanto':'town_map',
  'PP Up':'pp_up', 'Exp. Share':'exp_share'
};

/* Disco de TM: o ícone é o do tipo do golpe que ele ensina. O nome do
   item carrega o golpe ("TM24 Thunderbolt"), então o tipo sai da tabela
   de golpes e nenhuma lista de TM precisa ser mantida à mão. */
const TM_ARQ_TIPO = {
  'Normal':'normal', 'Fogo':'fire', 'Água':'water', 'Grama':'grass', 'Elétrico':'electric',
  'Gelo':'ice', 'Lutador':'fighting', 'Venenoso':'poison', 'Terrestre':'ground', 'Voador':'flying',
  'Psíquico':'psychic', 'Inseto':'bug', 'Pedra':'rock', 'Fantasma':'ghost', 'Dragão':'dragon',
  'Metálico':'steel', 'Sombrio':'dark'
};
function arquivoTM(nome){
  const m = /^(?:TM|MT)\s*\d+\s+(.+)$/i.exec(nome || '');
  const g = m && typeof GOLPES !== 'undefined' ? GOLPES[m[1].trim()] : null;
  return g && TM_ARQ_TIPO[g.t] ? 'tms/tm_' + TM_ARQ_TIPO[g.t] : null;
}

function caminhoItem(nome){
  const arq = ITEM_SPRITE[nome] || arquivoTM(nome);
  /* sem arte dos jogos: o desenho de js/data/icones.js */
  if (!arq) return (typeof desenhoDoItem === 'function' && nome) ? desenhoDoItem(nome) : null;
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
/* O grito de cada espécie, na versão das primeiras gerações (a da
   PokeAPI, pasta legacy): combina com Kanto e pesa ~6 KB cada. */
function caminhoGrito(dexId){
  const rel = 'sons/gritos/' + dexId + '.ogg';
  return SPRITES_EMBUTIDOS[rel] || rel;
}
/* Som é preferência do aparelho, não da partida: vale pra todo save. */
function somLigado(){
  try { return localStorage.getItem('jc-som') !== '0'; } catch (e) { return true; }
}
function tocarGrito(dexId){
  try {
    if (!dexId || dexId > 251 || !somLigado()) return;
    const a = new Audio(caminhoGrito(dexId));
    a.volume = 0.45;
    const r = a.play();
    if (r && r.catch) r.catch(() => {});
  } catch (e) { /* sem áudio: segue calado */ }
}

/* As oito insígnias de Kanto, pelo ginásio (não pelo líder: aqui quem
   está em Viridian é o Blue). Arte da PokeAPI, sprites/badges/1..8 — o
   endereço items/*-badge não existe lá. */
const INSIGNIA_ARQ = {
  pewter:'boulder', cerulean:'cascade', vermilion:'thunder', celadon:'rainbow',
  fuchsia:'soul', saffron:'marsh', cinnabar:'volcano', viridian:'earth'
};
function caminhoInsignia(idGinasio){
  const a = INSIGNIA_ARQ[idGinasio];
  if (!a) return null;
  const rel = SPRITES_BASE + 'badges/' + a + '_badge.png';
  return SPRITES_EMBUTIDOS[rel] || rel;
}

/* A bola na arena é a da mochila de Black/White (PokeAPI,
   sprites/items/gen5): a mesma geração dos sprites de batalha, e a
   bola ocupa 18 px de 24, que na escala da arena (1,1× a 1,3×) fica
   do tamanho que ela tem perto de um Pokémon nos jogos. O ícone da
   mochila continua o outro. A PokeAPI não tem arremesso nem bola
   aberta: o movimento é desenhado (UI.animarArremesso, Efeitos). */
const BOLA_NA_ARENA = {'Poké Ball':'poke-ball', 'Great Ball':'great-ball', 'Ultra Ball':'ultra-ball',
                       'Master Ball':'master-ball', 'Safari Ball':'safari-ball'};
function spriteDaBola(nome){
  const rel = SPRITES_BASE + 'animations/pokeball/' + (BOLA_NA_ARENA[nome] || 'poke-ball') + '.png';
  return SPRITES_EMBUTIDOS[rel] || rel;
}


/* A Pokébola abre no meio, como nos jogos de DS: a metade de cima sobe
   e tomba pra trás na dobradiça, a de baixo assenta, e entre as duas
   aparece a fenda de luz. Serve pro arremesso e pra entrada. */
/* Abre pela costura: as duas cascas se afastam na vertical, a de cima
   sobe e a de baixo desce na mesma medida, e o clarão sai do meio,
   onde fica a fenda. Fechar é o mesmo ao contrário. */
const ABRE_CASCA = '30%';
function abrirBola(cima, baixo, fenda, ms){
  const o = {duration:ms || 150, fill:'forwards', easing:'cubic-bezier(.3,1.35,.5,1)'};
  const p = [cima.animate([{transform:'translateY(0)'}, {transform:`translateY(-${ABRE_CASCA})`}], o).finished];
  if (baixo) p.push(baixo.animate([{transform:'translateY(0)'}, {transform:`translateY(${ABRE_CASCA})`}], o).finished);
  if (fenda) p.push(fenda.animate([
    {opacity:0, transform:'scale(.2, .4)'},
    {opacity:1, transform:'scale(1.35, 3.4)', offset:.5},
    {opacity:.95, transform:'scale(1.05, 2.2)'}], Object.assign({}, o, {duration:(ms || 150) * 1.6, easing:'ease-out'})).finished);
  return Promise.all(p);
}
function fecharBola(cima, baixo, fenda, ms){
  const o = {duration:ms || 130, fill:'forwards', easing:'ease-in'};
  const p = [cima.animate([{transform:`translateY(-${ABRE_CASCA})`}, {transform:'translateY(0)'}], o).finished];
  if (baixo) p.push(baixo.animate([{transform:`translateY(${ABRE_CASCA})`}, {transform:'translateY(0)'}], o).finished);
  if (fenda) p.push(fenda.animate([{opacity:.95, transform:'scale(1.05, 2.2)'}, {opacity:0, transform:'scale(.6, .4)'}], o).finished);
  return Promise.all(p);
}
