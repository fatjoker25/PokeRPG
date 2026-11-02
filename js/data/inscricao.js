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

/* A foto do cartão. Rostos jovens — quem sai de casa tem quinze anos,
   então nada de criança —, de jeitos e tons de pele diferentes, que
   só o jogador usa: moram em sprites_nds/npcs/jogador/ e nenhum NPC
   tem a mesma cara, senão o rival ou o moço da rua aparecem com a
   sua. Protagonista dos jogos também não entra. Cada gênero tem a
   sua lista, e a ficha só mostra a dela: as RETRATOS_A_VISTA primeiras
   de cara, as outras a um toque ("Mais rostos"). A foto sorteada sai
   da lista inteira do gênero. */
const PASTA_DOS_RETRATOS = 'jogador/';
const RETRATOS_DA_FICHA = {
  Homem:  ['viajante', 'urbano', 'patinador', 'colecionador', 'terno', 'trilheiro', 'roqueiro', 'chamativo',
           'lutador', 'mistico', 'piloto', 'naturalista', 'durao', 'criador', 'corredor', 'ciclista',
           'esportivo', 'surfista', 'artesao', 'prateado', 'violeiro', 'explorador', 'cinegrafista', 'lavrador'],
  Mulher: ['aventureira', 'animada', 'urbana', 'atleta', 'estudante', 'elegante', 'trilheira', 'punk',
           'gotica', 'lutadora', 'dancarina', 'modelo', 'artista', 'aviadora', 'patinadora', 'ciclista_f',
           'mochileira', 'despojada', 'esportiva', 'descolada', 'fazendeira', 'cantora', 'vidente', 'guitarrista']
};
/* quantas a ficha mostra de cara; as outras do mesmo gênero abrem no "Mais rostos" */
const RETRATOS_A_VISTA = 16;
/* o nome de cada foto, pra quem lê a tela com leitor (e no toque longo) */
const ROTULO_DO_RETRATO = {
  viajante:'viajante de mochila', urbano:'urbano de boné', patinador:'patinador', colecionador:'colecionador',
  terno:'de terno', trilheiro:'trilheiro', roqueiro:'roqueiro', chamativo:'de óculos escuros', lutador:'lutador de quimono',
  mistico:'místico', piloto:'piloto', naturalista:'naturalista de rede', durao:'durão de jaqueta', criador:'criador',
  corredor:'corredor', ciclista:'ciclista',
  esportivo:'esportivo de boné pra trás', surfista:'surfista', artesao:'artesão de avental', prateado:'de cabelo prateado',
  violeiro:'violeiro de chapéu', explorador:'explorador de jaqueta', cinegrafista:'cinegrafista', lavrador:'lavrador de avental',
  aventureira:'aventureira de boné', animada:'animada', urbana:'urbana de jaqueta', atleta:'atleta de agasalho',
  estudante:'estudante', elegante:'elegante', trilheira:'trilheira', punk:'punk', gotica:'gótica', lutadora:'lutadora',
  dancarina:'dançarina', modelo:'modelo', artista:'artista', aviadora:'aviadora', patinadora:'patinadora', ciclista_f:'ciclista',
  mochileira:'mochileira', despojada:'de regata e bermuda', esportiva:'esportiva de faixa no cabelo', descolada:'descolada',
  fazendeira:'fazendeira de chapéu', cantora:'cantora de palco', vidente:'vidente', guitarrista:'guitarrista'
};
/* foto que a ficha aceita: qualquer uma das duas listas (save antigo
   pode ter foto da outra, do tempo em que o "Mais rostos" abria a
   lista do outro gênero) */
function retratoDaFicha(arq){
  return !!arq && (RETRATOS_DA_FICHA.Homem.includes(arq) || RETRATOS_DA_FICHA.Mulher.includes(arq));
}

/* As cores da foto. Escolhido o corpo, o cabelo, a pele e a roupa
   trocam de cor sem trocar o desenho, que continua sendo o do
   artista: cada foto tem, em js/data/fotos-jogador.js (gerado por
   ferramentas/fotos-do-jogador.py), quais cores da paleta dela são
   cabelo, pele e roupa, e onde cada uma fica do escuro ao claro. A
   cor nova é uma escala do mesmo jeito — matiz h, saturação s, do
   escuro l[0] ao claro l[1] —, então a sombra e o brilho ficam onde o
   artista pôs. Cabelo e roupa viram também a descrição que os outros
   fazem de você (o retrato falado do capítulo 6); a pele fica só na
   foto. Cor nova entra aqui e o gerador roda de novo: é ele que diz
   qual destas é a cor de cada foto como ela veio. */
const CORES_DA_FOTO = {
  cabelo: [
    {id:'preto',           nome:'preto',           h:225, s:.12, l:[.07, .30]},
    {id:'castanho-escuro', nome:'castanho-escuro', h:22,  s:.40, l:[.12, .34]},
    {id:'castanho',        nome:'castanho',        h:26,  s:.45, l:[.22, .52]},
    {id:'ruivo',           nome:'ruivo',           h:14,  s:.70, l:[.28, .62]},
    {id:'loiro',           nome:'loiro',           h:45,  s:.70, l:[.45, .85]},
    {id:'platinado',       nome:'platinado',       h:50,  s:.30, l:[.62, .93]},
    {id:'prateado',        nome:'prateado',        h:220, s:.08, l:[.45, .88]},
    {id:'vermelho',        nome:'vermelho',        h:355, s:.65, l:[.25, .58]},
    {id:'rosa',            nome:'rosa',            h:330, s:.65, l:[.42, .82]},
    {id:'roxo',            nome:'roxo',            h:275, s:.45, l:[.24, .62]},
    {id:'azul',            nome:'azul',            h:215, s:.60, l:[.22, .62]},
    {id:'verde',           nome:'verde',           h:145, s:.45, l:[.20, .58]}
  ],
  pele: [
    {id:'muito-clara',  nome:'muito clara',  h:22, s:.70, l:[.50, .92]},
    {id:'clara',        nome:'clara',        h:24, s:.62, l:[.42, .86]},
    {id:'morena-clara', nome:'morena clara', h:24, s:.52, l:[.32, .74]},
    {id:'morena',       nome:'morena',       h:22, s:.48, l:[.22, .60]},
    {id:'escura',       nome:'escura',       h:18, s:.42, l:[.13, .46]}
  ],
  /* roupa: [masculino, feminino], pela palavra da peça (PECA_DO_RETRATO) */
  roupa: [
    {id:'vermelho',     nome:['vermelho', 'vermelha'],  h:355, s:.65, l:[.22, .62]},
    {id:'vinho',        nome:'vinho',                   h:345, s:.50, l:[.12, .42]},
    {id:'laranja',      nome:'laranja',                 h:25,  s:.80, l:[.30, .70]},
    {id:'amarelo',      nome:['amarelo', 'amarela'],    h:48,  s:.80, l:[.38, .80]},
    {id:'verde',        nome:'verde',                   h:130, s:.45, l:[.18, .55]},
    {id:'verde-agua',   nome:'verde-água',              h:172, s:.50, l:[.20, .70]},
    {id:'azul-claro',   nome:['azul-claro', 'azul-clara'], h:200, s:.60, l:[.38, .86]},
    {id:'azul',         nome:'azul',                    h:212, s:.60, l:[.20, .62]},
    {id:'azul-marinho', nome:'azul-marinho',            h:225, s:.45, l:[.10, .38]},
    {id:'roxo',         nome:['roxo', 'roxa'],          h:275, s:.45, l:[.22, .62]},
    {id:'rosa',         nome:'rosa',                    h:330, s:.60, l:[.40, .82]},
    {id:'marrom',       nome:'marrom',                  h:25,  s:.35, l:[.15, .45]},
    {id:'bege',         nome:'bege',                    h:38,  s:.30, l:[.45, .85]},
    {id:'preto',        nome:['preto', 'preta'],        h:230, s:.08, l:[.06, .32]},
    {id:'cinza',        nome:'cinza',                   h:220, s:.06, l:[.30, .70]},
    {id:'branco',       nome:['branco', 'branca'],      h:220, s:.08, l:[.62, .96]}
  ]
};
/* a ordem em que a ficha mostra as três, da cabeça pro pé */
const PARTES_DA_FOTO = [['cabelo', 'Cabelo'], ['pele', 'Pele'], ['roupa', 'Roupa']];

/* o que a roupa de cada foto é, e o gênero da palavra, que decide a
   cor ("vestido preto", "saia preta"): é o que vai na descrição */
const PECA_DO_RETRATO = {
  viajante:['calça', 'f'], urbano:['bermuda', 'f'], patinador:['bermuda', 'f'], colecionador:['bermuda', 'f'],
  terno:['terno', 'm'], trilheiro:['camisa', 'f'], roqueiro:['roupa', 'f'], chamativo:['jaqueta', 'f'],
  lutador:['quimono', 'm'], mistico:['calça', 'f'], piloto:['macacão', 'm'], naturalista:['camisa', 'f'],
  durao:['jaqueta', 'f'], criador:['uniforme', 'm'], corredor:['regata', 'f'], ciclista:['camiseta', 'f'],
  esportivo:['camiseta', 'f'], surfista:['bermuda', 'f'], artesao:['avental', 'm'], prateado:['jaqueta', 'f'],
  violeiro:['calça', 'f'], explorador:['jaqueta', 'f'], cinegrafista:['jaqueta', 'f'], lavrador:['avental', 'm'],
  aventureira:['vestido', 'm'], animada:['blusa', 'f'], urbana:['short', 'm'], atleta:['agasalho', 'm'],
  estudante:['casaco', 'm'], elegante:['casaco', 'm'], trilheira:['blusa', 'f'], punk:['saia', 'f'],
  gotica:['vestido', 'm'], lutadora:['quimono', 'm'], dancarina:['calça', 'f'], modelo:['casaco', 'm'],
  artista:['calça', 'f'], aviadora:['macacão', 'm'], patinadora:['roupa', 'f'], ciclista_f:['camiseta', 'f'],
  mochileira:['bermuda', 'f'], despojada:['regata', 'f'], esportiva:['saia', 'f'], descolada:['macacão', 'm'],
  fazendeira:['jardineira', 'f'], cantora:['vestido', 'm'], vidente:['túnica', 'f'], guitarrista:['saia', 'f']
};
/* foto em que o cabelo não aparece ou não se separa do que está por
   cima: não tem cor de cabelo, e a descrição diz o que tem na cabeça */
const CABECA_DO_RETRATO = {
  urbano:'boné', patinador:'capacete', criador:'boné', ciclista:'boné', esportivo:'boné pra trás',
  violeiro:'chapéu', explorador:'boné', cinegrafista:'boné pra trás', aviadora:'capacete', patinadora:'capacete'
};

function corDaFoto(parte, id){
  return (CORES_DA_FOTO[parte] || []).find(c => c.id === id) || null;
}
function nomeDaCorDaFoto(parte, id, feminino){
  const c = corDaFoto(parte, id);
  if (!c) return '';
  return Array.isArray(c.nome) ? c.nome[feminino ? 1 : 0] : c.nome;
}
/* só o que existe e que a foto tem: o save pode ter vindo de arquivo de
   outra pessoa, e cor de cabelo em foto de boné não entra */
function coresDaFotoValidas(arq, cores){
  const f = typeof FOTOS_DO_JOGADOR !== 'undefined' && FOTOS_DO_JOGADOR[arq];
  const ok = {};
  if (!f || !cores || typeof cores !== 'object') return ok;
  for (const [parte] of PARTES_DA_FOTO)
    if (f[parte] && typeof cores[parte] === 'string' && corDaFoto(parte, cores[parte])) ok[parte] = cores[parte];
  return ok;
}
/* a descrição que sai da foto: o cabelo (ou o que está na cabeça) e a
   roupa, na cor escolhida ou na que o desenho tem */
function descricaoDaFoto(arq, cores){
  const f = typeof FOTOS_DO_JOGADOR !== 'undefined' && FOTOS_DO_JOGADOR[arq];
  if (!f) return {aparencia:'', vestimenta:''};
  const c = coresDaFotoValidas(arq, cores);
  const aparencia = f.cabelo ? `cabelo ${nomeDaCorDaFoto('cabelo', c.cabelo || f.cabelo.cor)}` : (CABECA_DO_RETRATO[arq] || '');
  const [peca, gen] = PECA_DO_RETRATO[arq] || ['roupa', 'f'];
  const vestimenta = f.roupa ? `${peca} ${nomeDaCorDaFoto('roupa', c.roupa || f.roupa.cor, gen === 'f')}` : '';
  return {aparencia, vestimenta};
}

/* a cor da mochila que sai de casa com você: chaves de CORES_MOCHILA */
const MOCHILAS_DA_FICHA = ['bege', 'preta', 'branca', 'vermelha', 'azul', 'verde', 'amarela', 'roxa', 'rosa', 'laranja', 'cinza', 'marrom'];

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
