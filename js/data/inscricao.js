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
  Cinnabar: 'A ilha do vulcão, a uma travessia de barco de tudo.'
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
  viajante:'viajante de mochila', urbano:'urbano de fones', patinador:'patinador', colecionador:'colecionador',
  terno:'de terno', trilheiro:'trilheiro', roqueiro:'roqueiro', chamativo:'de óculos escuros', lutador:'lutador de quimono',
  mistico:'místico', piloto:'piloto', naturalista:'naturalista de rede', durao:'durão de jaqueta', criador:'criador',
  corredor:'corredor', ciclista:'ciclista',
  esportivo:'esportivo de boné', surfista:'surfista', artesao:'artesão de avental', prateado:'de cabelo prateado',
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

/* A customização da foto. Escolhido o corpo, o cabelo, os olhos, a
   pele, a camisa, a calça, os sapatos e os detalhes (boné, cinto,
   faixa, o que a pessoa carrega no corpo) trocam de cor sem trocar o
   desenho, que continua sendo o do artista: cada foto tem, em
   js/data/fotos-jogador.js (gerado por ferramentas/fotos-do-jogador.py,
   com as partes anotadas pixel a pixel em ferramentas/fotos-partes.py),
   quais cores da paleta dela são cada parte, e onde cada uma fica do
   escuro ao claro. A cor nova é uma escala do mesmo jeito — matiz h,
   saturação s, do escuro l[0] ao claro l[1] —, então a sombra e o
   brilho ficam onde o artista pôs. Tudo menos a pele vira a descrição
   que os outros fazem de você (o retrato falado do capítulo 6). Cor
   nova entra aqui e o gerador roda de novo: é ele que diz qual destas
   é a cor de cada foto como ela veio.
   O nome da cor vai nas quatro formas, [ele, ela, eles, elas], pela
   palavra da peça (PECAS_DO_RETRATO): "tênis preto", "saia preta",
   "sapatos pretos", "botas pretas"; nome que não muda é texto só. */
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
  /* o olho do desenho é quase sempre a pupila preta e, às vezes, a íris:
     o meio da escala é a cor da íris, o escuro dela é a pupila */
  olhos: [
    {id:'castanho',   nome:['castanho', 'castanha', 'castanhos', 'castanhas'],         h:25,  s:.55, l:[.10, .40]},
    {id:'preto',      nome:['preto', 'preta', 'pretos', 'pretas'],                     h:225, s:.10, l:[.04, .22]},
    {id:'mel',        nome:['mel', 'mel', 'cor de mel', 'cor de mel'],                 h:38,  s:.75, l:[.18, .55]},
    {id:'verde',      nome:['verde', 'verde', 'verdes', 'verdes'],                     h:135, s:.50, l:[.12, .48]},
    {id:'azul',       nome:['azul', 'azul', 'azuis', 'azuis'],                         h:212, s:.70, l:[.14, .54]},
    {id:'azul-claro', nome:['azul-claro', 'azul-clara', 'azul-claros', 'azul-claras'], h:196, s:.75, l:[.28, .72]},
    {id:'cinza',      nome:'cinza',                                                    h:210, s:.10, l:[.18, .60]},
    {id:'violeta',    nome:'violeta',                                                  h:275, s:.50, l:[.14, .52]},
    {id:'vermelho',   nome:['vermelho', 'vermelha', 'vermelhos', 'vermelhas'],         h:355, s:.65, l:[.14, .48]}
  ],
  pele: [
    {id:'muito-clara',  nome:'muito clara',  h:22, s:.70, l:[.50, .92]},
    {id:'clara',        nome:'clara',        h:24, s:.62, l:[.42, .86]},
    {id:'morena-clara', nome:'morena clara', h:24, s:.52, l:[.32, .74]},
    {id:'morena',       nome:'morena',       h:22, s:.48, l:[.22, .60]},
    {id:'escura',       nome:'escura',       h:18, s:.42, l:[.13, .46]}
  ],
  /* camisa, calça, sapatos e detalhes tiram a cor daqui */
  roupa: [
    {id:'vermelho',     nome:['vermelho', 'vermelha', 'vermelhos', 'vermelhas'],         h:355, s:.65, l:[.22, .62]},
    {id:'vinho',        nome:'vinho',                                                    h:345, s:.50, l:[.12, .42]},
    {id:'laranja',      nome:'laranja',                                                  h:25,  s:.80, l:[.30, .70]},
    {id:'amarelo',      nome:['amarelo', 'amarela', 'amarelos', 'amarelas'],             h:48,  s:.80, l:[.38, .80]},
    {id:'verde',        nome:['verde', 'verde', 'verdes', 'verdes'],                     h:130, s:.45, l:[.18, .55]},
    {id:'verde-agua',   nome:'verde-água',                                               h:172, s:.50, l:[.20, .70]},
    {id:'azul-claro',   nome:['azul-claro', 'azul-clara', 'azul-claros', 'azul-claras'], h:200, s:.60, l:[.38, .86]},
    {id:'azul',         nome:['azul', 'azul', 'azuis', 'azuis'],                         h:212, s:.60, l:[.20, .62]},
    {id:'azul-marinho', nome:'azul-marinho',                                             h:225, s:.45, l:[.10, .38]},
    {id:'roxo',         nome:['roxo', 'roxa', 'roxos', 'roxas'],                         h:275, s:.45, l:[.22, .62]},
    {id:'rosa',         nome:'rosa',                                                     h:330, s:.60, l:[.40, .82]},
    {id:'marrom',       nome:['marrom', 'marrom', 'marrons', 'marrons'],                 h:25,  s:.35, l:[.15, .45]},
    {id:'bege',         nome:'bege',                                                     h:38,  s:.30, l:[.45, .85]},
    {id:'preto',        nome:['preto', 'preta', 'pretos', 'pretas'],                     h:230, s:.08, l:[.06, .32]},
    {id:'cinza',        nome:'cinza',                                                    h:220, s:.06, l:[.30, .70]},
    {id:'branco',       nome:['branco', 'branca', 'brancos', 'brancas'],                 h:220, s:.08, l:[.62, .96]}
  ]
};
/* as abas da customização, da cabeça pro pé, e de que lista cada uma tira a cor */
const PARTES_DA_FOTO = [['cabelo', 'Cabelo'], ['olhos', 'Olhos'], ['pele', 'Pele'], ['camisa', 'Camisa'],
                        ['calca', 'Calça'], ['sapatos', 'Sapatos'], ['detalhes', 'Detalhes']];
const PALETA_DA_PARTE = {cabelo:'cabelo', olhos:'olhos', pele:'pele', camisa:'roupa', calca:'roupa', sapatos:'roupa', detalhes:'roupa'};

/* O que cada peça da foto é, e a forma da palavra, que decide a cor:
   m "tênis preto", f "saia preta", mp "sapatos pretos", fp "botas
   pretas" (peças juntas de gênero diferente vão no masculino plural,
   "capuz e capa azuis"). {cor} põe a cor no meio ("faixa verde na
   cintura"); sem ele, a cor vem no fim. É o que vai na descrição, e
   foto sem a parte não tem a peça (SEM_PARTE_DO_RETRATO diz por quê). */
const PECAS_DO_RETRATO = {
  viajante:     {camisa:['regata', 'f'], calca:['calça jeans', 'f'], sapatos:['tênis', 'm'], detalhes:['boné', 'm']},
  urbano:       {camisa:['regata', 'f'], calca:['bermuda', 'f'], sapatos:['tênis', 'm'], detalhes:['fones', 'mp']},
  patinador:    {camisa:['camiseta', 'f'], calca:['bermuda', 'f'], sapatos:['patins', 'mp'], detalhes:['capacete, luva e joelheira', 'mp']},
  colecionador: {camisa:['jaqueta', 'f'], calca:['bermuda', 'f'], sapatos:['tênis', 'm'], detalhes:['pochete', 'f']},
  terno:        {camisa:['paletó', 'm'], calca:['calça', 'f'], sapatos:['sapatos', 'mp'], detalhes:['gravata e colete', 'mp']},
  trilheiro:    {camisa:['camisa', 'f'], calca:['calça', 'f'], sapatos:['botas', 'fp'], detalhes:['cinto', 'm']},
  roqueiro:     {camisa:['regata', 'f'], calca:['calça', 'f'], sapatos:['tênis', 'm']},
  chamativo:    {camisa:['jaqueta', 'f'], calca:['calça camuflada', 'f'], sapatos:['tênis', 'm'], detalhes:['óculos e mangas', 'mp']},
  lutador:      {camisa:['quimono', 'm'], calca:['calça', 'f'], detalhes:['faixa', 'f']},
  mistico:      {camisa:['túnica', 'f'], calca:['calça', 'f'], sapatos:['chinelos', 'mp'], detalhes:['gola, punhos e faixa', 'mp']},
  piloto:       {camisa:['macacão', 'm'], calca:['calça', 'f'], detalhes:['capuz e capa', 'mp']},
  naturalista:  {camisa:['camisa', 'f'], calca:['bermuda', 'f'], sapatos:['tênis', 'm'], detalhes:['chapéu', 'm']},
  durao:        {camisa:['jaqueta', 'f'], calca:['calça', 'f'], sapatos:['tênis', 'm'], detalhes:['frisos {cor} da jaqueta', 'mp']},
  criador:      {camisa:['camisa', 'f'], calca:['macacão', 'm'], sapatos:['botas', 'fp'], detalhes:['boné', 'm']},
  corredor:     {camisa:['regata', 'f'], calca:['short', 'm'], sapatos:['tênis', 'm'], detalhes:['óculos', 'mp']},
  ciclista:     {camisa:['regata', 'f'], calca:['bermuda', 'f'], sapatos:['tênis', 'm'], detalhes:['capacete', 'm']},
  esportivo:    {camisa:['camiseta', 'f'], calca:['bermuda', 'f'], sapatos:['tênis', 'm'], detalhes:['boné', 'm']},
  surfista:     {calca:['bermuda', 'f'], detalhes:['pulseiras {cor} e colar', 'fp']},
  artesao:      {camisa:['camisa xadrez', 'f'], calca:['calça', 'f'], sapatos:['sapatos', 'mp'], detalhes:['avental', 'm']},
  prateado:     {camisa:['jaqueta', 'f'], calca:['calça', 'f'], sapatos:['tênis', 'm'], detalhes:['lenço e faixa', 'mp']},
  violeiro:     {camisa:['camisa jeans', 'f'], calca:['calça', 'f'], sapatos:['botas', 'fp'], detalhes:['chapéu', 'm']},
  explorador:   {camisa:['jaqueta', 'f'], calca:['calça', 'f'], sapatos:['botas', 'fp'], detalhes:['boné', 'm']},
  cinegrafista: {camisa:['camiseta', 'f'], calca:['calça', 'f'], sapatos:['tênis', 'm'], detalhes:['boné e jaqueta', 'mp']},
  lavrador:     {camisa:['camiseta', 'f'], calca:['calça', 'f'], sapatos:['botas', 'fp'], detalhes:['touca e avental', 'mp']},
  aventureira:  {camisa:['vestido', 'm'], calca:['short', 'm'], sapatos:['botas', 'fp'], detalhes:['boné e luvas', 'mp']},
  animada:      {camisa:['blusa de marinheiro', 'f'], calca:['saia', 'f'], sapatos:['sapatos', 'mp'], detalhes:['lenço', 'm']},
  urbana:       {camisa:['jaqueta', 'f'], calca:['short jeans', 'm'], sapatos:['tênis', 'm'], detalhes:['listras {cor} da jaqueta', 'fp']},
  atleta:       {camisa:['agasalho', 'm'], calca:['calça', 'f'], sapatos:['tênis', 'm'], detalhes:['listras {cor} do agasalho', 'fp']},
  estudante:    {camisa:['blazer', 'm'], calca:['saia', 'f'], sapatos:['sapatos', 'mp'], detalhes:['gravata', 'f']},
  elegante:     {camisa:['blazer', 'm'], calca:['saia', 'f'], sapatos:['botas', 'fp'], detalhes:['laço e frisos', 'mp']},
  trilheira:    {camisa:['blusa', 'f'], calca:['short', 'm'], sapatos:['botas', 'fp'], detalhes:['faixa {cor} na cintura', 'f']},
  punk:         {camisa:['jaqueta', 'f'], calca:['saia', 'f'], sapatos:['botas', 'fp'], detalhes:['meias e frisos', 'mp']},
  gotica:       {camisa:['corpete', 'm'], calca:['saia', 'f'], sapatos:['sapatos', 'mp'], detalhes:['tiara e lenço', 'mp']},
  lutadora:     {camisa:['quimono', 'm'], calca:['calça', 'f'], detalhes:['faixa', 'f']},
  dancarina:    {camisa:['jaqueta', 'f'], calca:['calça estampada', 'f'], sapatos:['tênis', 'm'], detalhes:['boné e munhequeiras', 'mp']},
  modelo:       {camisa:['casaco', 'm'], sapatos:['botas {cor} de salto', 'fp'], detalhes:['frisos {cor} do casaco', 'mp']},
  artista:      {camisa:['blusa', 'f'], calca:['calça', 'f'], sapatos:['sapatos', 'mp'], detalhes:['lenço e faixa', 'mp']},
  aviadora:     {camisa:['macacão', 'm'], calca:['calça', 'f'], detalhes:['capacete e capa', 'mp']},
  patinadora:   {camisa:['blusa', 'f'], calca:['saia', 'f'], sapatos:['patins', 'mp'], detalhes:['capacete e joelheira', 'mp']},
  ciclista_f:   {camisa:['regata', 'f'], calca:['short', 'm'], sapatos:['tênis', 'm'], detalhes:['viseira', 'f']},
  mochileira:   {calca:['bermuda', 'f'], sapatos:['tênis', 'm'], detalhes:['prendedor e munhequeira', 'mp']},
  despojada:    {camisa:['regata', 'f'], calca:['bermuda jeans', 'f'], sapatos:['tênis', 'm'], detalhes:['jaqueta {cor} amarrada na cintura', 'f']},
  esportiva:    {camisa:['camiseta', 'f'], calca:['saia', 'f'], sapatos:['tênis', 'm'], detalhes:['faixa {cor} no cabelo', 'f']},
  descolada:    {camisa:['blusa {cor} de alcinha', 'f'], calca:['calça jeans', 'f'], sapatos:['sapatos {cor} de salto', 'mp'], detalhes:['óculos {cor} e cinto', 'mp']},
  fazendeira:   {camisa:['camisa', 'f'], calca:['jardineira', 'f'], sapatos:['botas', 'fp'], detalhes:['chapéu, lenço e cinto', 'mp']},
  cantora:      {camisa:['corpete', 'm'], calca:['saia', 'f'], sapatos:['sapatos', 'mp'], detalhes:['fita {cor}, flor e brincos', 'f']},
  vidente:      {camisa:['quimono', 'm'], calca:['calça', 'f'], detalhes:['faixa {cor} na cintura', 'f']},
  guitarrista:  {camisa:['regata', 'f'], calca:['saia xadrez', 'f'], sapatos:['tênis', 'm'], detalhes:['prendedor e munhequeira', 'mp']}
};
/* parte que a foto não tem, e o que a aba diz no lugar das cores */
const SEM_PARTE_DO_RETRATO = {
  roqueiro:     {olhos:'De olhos fechados nesta foto.', detalhes:'Nenhum acessório nesta foto.'},
  chamativo:    {olhos:'Os óculos escuros escondem os olhos.'},
  mistico:      {olhos:'De olhos fechados nesta foto.'},
  naturalista:  {olhos:'Os óculos escondem os olhos.'},
  corredor:     {olhos:'Os óculos escondem os olhos.'},
  violeiro:     {olhos:'Os olhos ficam na sombra do chapéu.'},
  cinegrafista: {olhos:'Um olho na câmera, o outro fechado.'},
  ciclista:     {cabelo:'O capacete cobre o cabelo.'},
  lutador:      {sapatos:'Descalço nesta foto.'},
  surfista:     {camisa:'Sem camisa nesta foto.', sapatos:'Descalço nesta foto.'},
  lutadora:     {sapatos:'Descalça nesta foto.'},
  vidente:      {sapatos:'Descalça nesta foto.'},
  piloto:       {sapatos:'O macacão cobre os pés.'},
  aviadora:     {sapatos:'O macacão cobre os pés.'},
  mochileira:   {camisa:'A mochila cobre a blusa.'},
  modelo:       {calca:'O casaco vai até a coxa.'}
};

/* a lista de cores de uma parte, e uma cor dela */
function coresDaParte(parte){ return CORES_DA_FOTO[PALETA_DA_PARTE[parte] || parte] || []; }
function corDaFoto(parte, id){
  return coresDaParte(parte).find(c => c.id === id) || null;
}
/* o nome da cor na forma da peça: 'm', 'f', 'mp' ou 'fp' (true e false,
   de antes das quatro formas, são 'f' e 'm') */
function nomeDaCorDaFoto(parte, id, forma){
  const c = corDaFoto(parte, id);
  if (!c) return '';
  if (!Array.isArray(c.nome)) return c.nome;
  const i = {m:0, f:1, mp:2, fp:3}[forma === true ? 'f' : forma === false || forma == null ? 'm' : forma] || 0;
  return c.nome[i] || c.nome[0];
}
/* só o que existe e que a foto tem: o save pode ter vindo de arquivo de
   outra pessoa, e cor de cabelo em foto de capacete não entra */
function coresDaFotoValidas(arq, cores){
  const f = typeof FOTOS_DO_JOGADOR !== 'undefined' && FOTOS_DO_JOGADOR[arq];
  const ok = {};
  if (!f || !cores || typeof cores !== 'object') return ok;
  for (const [parte] of PARTES_DA_FOTO)
    if (f[parte] && typeof cores[parte] === 'string' && corDaFoto(parte, cores[parte])) ok[parte] = cores[parte];
  return ok;
}
/* a peça com a cor no lugar dela: "regata verde", "faixa verde na cintura" */
function pecaComCor(texto, cor){
  return texto.includes('{cor}') ? texto.replace('{cor}', cor) : `${texto} ${cor}`;
}
/* a descrição que sai da foto, na cor escolhida ou na que o desenho tem:
   o cabelo e os olhos (aparência) e a roupa (vestimenta), com o detalhe
   depois de um "com" — "regata preta, bermuda azul e tênis branco, com
   boné e luvas azuis", e nunca "tênis branco e boné e luvas azuis" */
function descricaoDaFoto(arq, cores){
  const f = typeof FOTOS_DO_JOGADOR !== 'undefined' && FOTOS_DO_JOGADOR[arq];
  if (!f) return {aparencia:'', vestimenta:'', cabeca:[], roupa:[], detalhe:''};
  const c = coresDaFotoValidas(arq, cores);
  const cor = (parte, forma) => nomeDaCorDaFoto(parte, c[parte] || f[parte].cor, forma);
  const cabeca = [f.cabelo ? `cabelo ${cor('cabelo', 'm')}` : '', f.olhos ? `olhos ${cor('olhos', 'mp')}` : ''].filter(Boolean);
  const pecas = PECAS_DO_RETRATO[arq] || {};
  const peca = p => f[p] && pecas[p] ? pecaComCor(pecas[p][0], cor(p, pecas[p][1])) : '';
  const roupa = ['camisa', 'calca', 'sapatos'].map(peca).filter(Boolean);
  const detalhe = peca('detalhes');
  const vestimenta = juntarComE(roupa) + (detalhe ? (roupa.length ? ', com ' : '') + detalhe : '');
  return {aparencia:juntarComE(cabeca), vestimenta, cabeca, roupa, detalhe};
}
/* quem te descreve numa frase só: cabelo, olhos e roupa numa lista, o
   detalhe com "com" e a bolsa que você carrega no fim, por extenso
   (bolsaPorExtenso: "…e tênis branco, com boné vermelho, de mochila
   verde", "…de bolsa dourada de festa") */
function faladoDaFoto(desc, bolsa){
  const d = desc || {};
  const base = juntarComE((d.cabeca || []).concat(d.roupa || []));
  return [base, d.detalhe ? 'com ' + d.detalhe : '', bolsa ? 'de ' + bolsa : ''].filter(Boolean).join(', ');
}

/* Save de antes das sete partes: a foto tinha cabelo, pele e roupa, e
   a roupa pintava uma peça só (ou o macacão, o quimono e o vestido
   inteiros). A cor dela vai pra parte que ela pintava, e a descrição
   que a foto tinha escrito ("cabelo ruivo", "bermuda vermelha") é
   refeita com tudo; a que alguém escreveu à mão, de antes da foto
   decidir a descrição, fica. */
const ROUPA_DE_ANTES = {
  viajante:['calça', 'calca'], urbano:['bermuda', 'camisa', 'calca'], patinador:['bermuda', 'calca'], colecionador:['bermuda', 'calca'],
  terno:['terno', 'camisa', 'calca'], trilheiro:['camisa', 'camisa', 'calca'], roqueiro:['roupa', 'camisa', 'calca'], chamativo:['jaqueta', 'camisa', 'sapatos'],
  lutador:['quimono', 'camisa', 'calca'], mistico:['calça', 'calca', 'detalhes'], piloto:['macacão', 'detalhes'],
  naturalista:['camisa', 'camisa'], durao:['jaqueta', 'camisa'], criador:['uniforme', 'camisa', 'calca'], corredor:['regata', 'camisa'],
  ciclista:['camiseta', 'camisa'], esportivo:['camiseta', 'camisa', 'calca'], surfista:['bermuda', 'calca'], artesao:['avental', 'camisa', 'detalhes'],
  prateado:['jaqueta', 'camisa'], violeiro:['calça', 'camisa', 'calca'], explorador:['jaqueta', 'camisa'], cinegrafista:['jaqueta', 'detalhes'],
  lavrador:['avental', 'detalhes'], aventureira:['vestido', 'camisa', 'sapatos'], animada:['blusa', 'detalhes'], urbana:['short', 'calca', 'detalhes'],
  atleta:['agasalho', 'camisa', 'calca'], estudante:['casaco', 'camisa'], elegante:['casaco', 'camisa', 'calca', 'sapatos'], trilheira:['blusa', 'camisa', 'calca'],
  punk:['saia', 'calca'], gotica:['vestido', 'camisa', 'calca'], lutadora:['quimono', 'camisa', 'calca'], dancarina:['calça', 'calca'],
  modelo:['casaco', 'camisa', 'sapatos'], artista:['calça', 'calca', 'sapatos'], aviadora:['macacão', 'detalhes'], patinadora:['roupa', 'camisa', 'calca'],
  ciclista_f:['camiseta', 'camisa'], mochileira:['bermuda', 'calca'], despojada:['regata', 'camisa', 'calca'], esportiva:['saia', 'camisa', 'calca'],
  descolada:['macacão', 'camisa', 'calca'], fazendeira:['jardineira', 'calca'], cantora:['vestido', 'camisa', 'calca'],
  vidente:['túnica', 'camisa', 'calca'], guitarrista:['saia', 'calca']
};
const CABECA_DE_ANTES = {
  urbano:'boné', patinador:'capacete', criador:'boné', ciclista:'boné', esportivo:'boné pra trás',
  violeiro:'chapéu', explorador:'boné', cinegrafista:'boné pra trás', aviadora:'capacete', patinadora:'capacete'
};
function converterFotoAntiga(j){
  if (!j || j.fotoPartes || typeof j.retrato !== 'string' || !j.retrato.startsWith(PASTA_DOS_RETRATOS)) return;
  const arq = j.retrato.slice(PASTA_DOS_RETRATOS.length);
  if (typeof FOTOS_DO_JOGADOR === 'undefined' || !FOTOS_DO_JOGADOR[arq]) return;
  const antes = ROUPA_DE_ANTES[arq] || ['roupa'];
  let cores = j.retratoCores && typeof j.retratoCores === 'object' ? Object.assign({}, j.retratoCores) : null;
  if (cores && typeof cores.roupa === 'string'){
    for (const p of antes.slice(1)) if (!cores[p]) cores[p] = cores.roupa;
    delete cores.roupa;
  }
  const ok = coresDaFotoValidas(arq, cores);
  if (Object.keys(ok).length) j.retratoCores = ok; else delete j.retratoCores;
  /* a descrição é a que a foto escreveu? cabelo e a cor (ou o que ia na
     cabeça), e a peça de antes e a cor */
  const nomes = lista => new Set(lista.flatMap(k => [].concat(k.nome)));
  const cabelos = nomes(CORES_DA_FOTO.cabelo), roupas = nomes(CORES_DA_FOTO.roupa);
  const ap = String(j.aparencia || ''), ve = String(j.vestimenta || '');
  const apDaFoto = !ap || ap === CABECA_DE_ANTES[arq] || (ap.startsWith('cabelo ') && cabelos.has(ap.slice(7)));
  const veDaFoto = !ve || (ve.startsWith(antes[0] + ' ') && roupas.has(ve.slice(antes[0].length + 1)));
  if (apDaFoto && veDaFoto){
    const d = descricaoDaFoto(arq, ok);
    j.aparencia = d.aparencia; j.vestimenta = d.vestimenta;
  }
  j.fotoPartes = 1;
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
