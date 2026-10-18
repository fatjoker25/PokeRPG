/* ============================================================
   CRIAÇÃO DE PERSONAGEM — o que a ficha de inscrição oferece

   A ficha antiga era um formulário de texto livre, e o jogo lia
   palavra por palavra: quem escrevia "ambiciosa" em vez de
   "teimosa" não ganhava afinidade nenhuma, e quem gostava de
   "Pokémon de grama" não ganhava moral nenhuma (o tipo se chama
   Grama, não Planta). Agora o que tem efeito é escolha:

   - traço de personalidade: cada um é uma palavra que a afinidade
     lê (TRACOS_JOGADOR, em afinidade.js), na forma do gênero da
     ficha;
   - objetivo: um dos sete rumos (METAS, em rumo.js), dito numa
     frase que o capítulo 1 põe na sua boca;
   - gosto: lugar (o ambiente do capítulo ou do mapa), tipo de
     Pokémon ou uma espécie;
   - forte: o status que começa em 2;
   - mochila e cartão: a cor que a interface usa.

   O que é só descrição (aparência e roupa) continua texto livre,
   com sugestão sorteada pra quem não quer escrever.
   ============================================================ */

/* os traços, em três grupos, [masculino, feminino] */
const TRACOS_DA_FICHA = [
  {grupo:'Diante do perigo', tracos:[
    ['corajoso','corajosa'], ['teimoso','teimosa'], ['impulsivo','impulsiva'], ['determinado','determinada'],
    ['ousado','ousada'], ['competitivo','competitiva'], ['cauteloso','cautelosa'], ['tímido','tímida']]},
  {grupo:'Com os outros', tracos:[
    ['leal','leal'], ['gentil','gentil'], ['alegre','alegre'], ['brincalhão','brincalhona'],
    ['protetor','protetora'], ['desconfiado','desconfiada'], ['solitário','solitária'], ['orgulhoso','orgulhosa']]},
  {grupo:'Na cabeça', tracos:[
    ['curioso','curiosa'], ['calmo','calma'], ['paciente','paciente'], ['observador','observadora'],
    ['organizado','organizada'], ['sonhador','sonhadora'], ['prático','prática'], ['distraído','distraída']]}
];
const TRACOS_MIN = 2, TRACOS_MAX = 3;

/* o objetivo, dito em voz alta: a frase sugerida pra cada rumo */
const OBJETIVOS_DA_FICHA = {
  campeao: {frase:'Eu vou ser {campeão|campeã} da Liga.',                     nota:'Oito insígnias, o Planalto e o título.'},
  pokedex: {frase:'Eu quero conhecer cada Pokémon que existe.',              nota:'Ver, anotar e entender cada espécie.'},
  heroi:   {frase:'Eu quero proteger quem não consegue se proteger.',        nota:'Ficar do lado de quem precisa.'},
  poder:   {frase:'Eu quero ter dinheiro e nome, e não depender de ninguém.', nota:'Ninguém manda em quem tem o bastante.'},
  vinculo: {frase:'Eu quero crescer junto com o meu time.',                  nota:'Ficar forte com eles, não por cima deles.'},
  explorar:{frase:'Eu quero ver Kanto inteira com os meus olhos.',           nota:'Cada rota, cada cidade, cada canto.'},
  casa:    {frase:'Eu quero voltar pra casa com orgulho.',                   nota:'Voltar e ter o que contar.'}
};

/* os lugares de gosto: as chaves são as de GOSTOS_LUGAR (rumo.js) */
const LUGARES_DA_FICHA = [
  ['agua', 'Mar, rio e praia'], ['caverna', 'Caverna e escuro'], ['montanha', 'Montanha e trilha'],
  ['floresta', 'Floresta e mato'], ['cidade', 'Cidade e movimento'], ['cemiterio', 'Torre e mistério'],
  ['vulcao', 'Calor e vulcão'], ['campo', 'Campo aberto']
];
const GOSTOS_MAX = 3, DESGOSTOS_MAX = 2;

/* a cidade natal em uma linha: o que se lembra de lá */
const CIDADES_DA_FICHA = {
  Pallet:   'Três ruas e o laboratório do Professor no alto da subida.',
  Viridian: 'Semáforo, prédio de dois andares e o Centro mais perto de Pallet.',
  Pewter:   'Cidade de pedra cinza, com o museu e a serra atrás.',
  Cerulean: 'Água pra todo lado, a ponte e o cabo ao norte.',
  Vermilion:'O porto, os navios e a estiva de madrugada.',
  Lavender: 'A Torre, o silêncio e o vento que desce da serra.',
  Celadon:  'A Grande Loja, as luzes e a cidade que não dorme.',
  Fuchsia:  'A Zona Safári do lado e o mar do outro.',
  Saffron:  'A maior cidade de Kanto, com a Silph no meio.',
  Cinnabar: 'A ilha do vulcão, a uma travessia de barco de tudo.',
  Indigo:   'O Planalto: a Liga mora na sua rua.'
};

/* o retrato do cartão: rosto de treinador, pelo gênero da ficha */
const RETRATOS_DA_FICHA = {
  Homem:  ['lucas', 'youngster', 'camper', 'backpacker', 'cyclist', 'schoolkid', 'ace_trainer', 'punk_guy'],
  Mulher: ['lass', 'picnicker', 'backpacker_f', 'cyclist_f', 'schoolkid_f', 'ace_trainer_f', 'battle_girl', 'punk_girl']
};

/* a cor da mochila que sai de casa com você: chaves de CORES_MOCHILA */
const MOCHILAS_DA_FICHA = ['bege', 'preta', 'branca', 'vermelha', 'azul', 'verde', 'amarela', 'roxa', 'rosa', 'laranja', 'cinza', 'marrom'];

/* sugestão pra quem não quer escrever: {o|a} resolve pelo gênero */
const APARENCIAS_DA_FICHA = [
  'Alt{o|a} pra idade, cabelo curto e escuro, uma cicatriz pequena no queixo.',
  'Baixinh{o|a}, cabelo castanho sempre bagunçado, sardas no nariz.',
  'Magr{o|a}, cabelo comprido preso atrás, olhos que não param quietos.',
  'Cabelo ruivo cortado em casa e um dente lascado que aparece quando ri.',
  'Moren{o|a}, cabelo crespo, um calombo na sobrancelha de quando caiu da árvore.',
  'Óculos remendados e uma franja que vive caindo no olho.',
  'Ombros largos de quem carrega peso desde cedo, mãos sempre arranhadas.',
  'Cabelo platinado de sol, pele queimada e um sorriso torto.'
];
const VESTIMENTAS_DA_FICHA = [
  'Boné desbotado, jaqueta grande demais e tênis de lona.',
  'Moletom com capuz, bermuda e bota de trilha emprestada.',
  'Camiseta velha da Liga, calça de brim e um cachecol que alguém tricotou.',
  'Colete de lona cheio de bolso e calça dobrada na canela.',
  'Chapéu de palha, camisa xadrez e sandália de borracha.',
  'Jaqueta de vinil, luva sem dedo e tênis branco que já foi branco.',
  'Capa de chuva amarela e galocha, por via das dúvidas.',
  'Uniforme da escola com as mangas cortadas e um apito no pescoço.'
];

/* {a|b} pelo gênero da ficha, antes de existir jogo pra resolver */
function generoDaFicha(texto, genero){
  const homem = genero !== 'Mulher';
  return String(texto || '').replace(/\{([^{}|]*)\|([^{}]*)\}/g, (m, a, b) => homem ? a : b);
}
/* "teimosa, leal e curiosa" */
function juntarComE(lista){
  const l = (lista || []).filter(Boolean);
  if (l.length <= 1) return l.join('');
  return l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1];
}
/* o traço na forma do gênero */
function tracoNoGenero(par, genero){ return genero === 'Mulher' ? par[1] : par[0]; }
/* "teimosa" -> o par dele, pra trocar de gênero sem perder a escolha */
function parDoTraco(palavra){
  for (const g of TRACOS_DA_FICHA) for (const par of g.tracos) if (par.includes(palavra)) return par;
  return null;
}

/* O gosto escolhido na ficha no formato que o rumo lê (j.gostos), com o
   texto que a Ficha mostra: "Mar, rio e praia · Pokémon de Fogo · Eevee". */
function gostoDaFicha(escolha){
  const e = escolha || {};
  const lugares = (e.lugares || []).filter(k => LUGARES_DA_FICHA.some(l => l[0] === k));
  const tipos = (e.tipos || []).filter(t => typeof TIPOS === 'undefined' || TIPOS.includes(t));
  const dex = (e.dex || []).filter(n => typeof DEX === 'undefined' || DEX[n]);
  const partes = []
    .concat(lugares.map(k => LUGARES_DA_FICHA.find(l => l[0] === k)[1]))
    .concat(tipos.map(t => 'Pokémon de ' + t))
    .concat(dex.map(n => typeof DEX !== 'undefined' ? DEX[n].nome : String(n)));
  return {lugares, tipos, dex, texto: partes.join(' · ')};
}
