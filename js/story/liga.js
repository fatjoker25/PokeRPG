/* ============================================================
   LIGA POKÉMON — Elite 4, o Campeão e o Torneio Aberto
   A cadeira de Campeão está vaga há dois anos.
   ============================================================ */

/* A Elite dos Quatro de Kanto é Lorelei, Bruno, Agatha e Lance.
   Desde agosto, três deles não se apresentam. A Liga não tirou os
   nomes das portas: pôs substitutos embaixo deles. */
const ELITE4 = [
{
  id:'giselle', ordem:1, nome:'Giselle', titular:'Lorelei', tipo:'variado', nivelBase:60,
  especies:[105, 40, 53, 31, 112],   // Marowak, Wigglytuff, Persian, Nidoqueen, Rhydon
  intro:d=>[
    'A primeira porta da ala tem uma placa de bronze parafusada na altura dos olhos: LORELEI.',
    'A sala atrás dela não parece sala de batalha. Parece sala de aula: quadro, carteira, projetor desligado.',
    'A mulher na frente tem uns vinte e poucos anos e um caderno aberto com a sua ficha dentro. Ela não é a Lorelei e sabe que você reparou.',
    '"Giselle. Eu me formei em primeiro lugar na Escola Técnica Pokémon, no ano em que a escola ainda existia."',
    '"A placa da porta não é minha. Eu não vou tirar e eu não vou explicar, e a Liga também não."',
    '"Regra da ala, uma vez só, porque ninguém lê o regulamento: você não sai daqui até vencer os quatro ou perder para um. Não tem Centro Pokémon aqui dentro."',
    '"O que estiver na sua mochila é tudo o que você tem pelas próximas quatro batalhas."',
    d=>d.insignias.length >= 8 ? '"Oito insígnias." Ela anota alguma coisa. "Eu tenho dados de quatrocentos e onze desafiantes com oito insígnias. Cento e nove passaram desta sala."' : ''
  ],
  vitoria:d=>[
    'O último dela cai e Giselle fecha o caderno com as duas mãos, sem pressa.',
    '"Cento e dez." Ela anota. "Eu odiei isso e eu vou registrar direito mesmo assim, porque dado torto não serve pra nada."',
    'Ela olha a placa da porta por um segundo antes de abrir a próxima.',
    '"Próxima sala. Não descansa. Isso é de propósito."'
  ]
},
{
  id:'aj', ordem:2, nome:'A.J.', titular:'Bruno', tipo:'Terrestre', nivelBase:62,
  especies:[28, 51, 105, 112, 76],   // Sandslash, Dugtrio, Marowak, Rhydon, Golem
  intro:d=>[
    'A segunda porta diz BRUNO. A sala atrás é de terra batida e não tem mobília nenhuma. Nem cadeira, nem bancada, nem água.',
    'O homem no centro tem chicote pendurado no cinto e não usa o chicote há anos — ele carrega porque a história dele carrega.',
    '"A.J." Ele nem estende a mão. "Noventa e oito vitórias seguidas antes de eu fazer dezesseis anos. Depois disso eu parei de contar, porque contar vira vaidade."',
    '"Eu treinei do jeito errado quando era moleque. Muita gente me disse isso e todas elas tinham razão." Ele se alonga sem pressa.',
    '"Eu mudei o método. Não mudei o resultado."',
    '"E antes que {o senhor|a senhora} pergunte: o Bruno treinou nesta sala por dezenove anos e eu treino aqui há cinco meses. Eu varro o chão dele toda manhã e eu não me acho ele."',
    d=>d.cemiterio.length ? `"E eu sei o que aconteceu com ${nomeExib(d.cemiterio[0])}." Ele fala isso sem acusação nenhuma, o que é pior. "Eu também perdi um. Continua doendo depois de doze anos. É pra doer."` : '',
    d=>d.flags.sabe_da_pergunta
      ? '"E {o senhor|a senhora} já sabe do vale." Ele se alonga do mesmo jeito, sem mudar nada na voz. "Aqui dentro a gente não fala disso. Aqui dentro é chão de terra e é batalha, e por quarenta minutos eu consigo não pensar naquilo. Deixa eu ter os quarenta minutos."'
      : (d.flags.conheceu_o_da_terceira ? '"A gente já se falou no vestiário." Ele assente uma vez. "Lá eu era um homem. Aqui eu sou a segunda porta. Não confunde as duas coisas."' : '')
  ],
  vitoria:d=>[
    'O Sandslash cai de lado e a sala vazia devolve o som três vezes.',
    'A.J. assente uma única vez e não fala nada por um tempo desconfortável.',
    '"Você aguentou cansad{o|a}." Ele abre a porta com o ombro. "Tem gente que só sabe vencer descansada. Vai. O Mandi detesta esperar e faz questão de avisar."'
  ]
},
{
  id:'mandi', ordem:3, nome:'Mandi', titular:'Agatha', tipo:'Venenoso', nivelBase:64,
  especies:[103, 117, 42, 49, 94],   // Exeggutor, Seadra, Golbat, Venomoth, Gengar
  intro:d=>[
    'A terceira porta diz AGATHA, e é a única das quatro que tem uma cadeira encostada do lado de fora, como se alguém costumasse esperar ali.',
    'A sala tem iluminação de palco. Refletor, fumaça de máquina, e uma música que começa quando você entra.',
    '"MANDI!" Ele abre os braços para uma plateia que não existe. "O ESPANTOSO!"',
    'Depois baixa os braços e fala em tom normal, o que é muito mais assustador:',
    '"Todo mundo acha que eu sou palhaço. Eu fui vice-campeão da Conferência Indigo, e eu virei palhaço de propósito, porque desafiante nervoso erra mais do que desafiante assustado."',
    '"A cadeira lá fora é da Agatha. Ela tem oitenta e poucos anos e sentava ali entre os desafiantes pra fumar." Ele dá de ombros. "Eu não sento na cadeira dela. Eu só não deixo tirarem."',
    '"Agora você sabe de tudo. E vai errar mesmo assim."'
  ],
  vitoria:d=>[
    'O Gengar se dissolve no ar e a música do palco para no meio de um compasso.',
    'Mandi acende a luz normal da sala, e sem o refletor ele parece dez anos mais velho.',
    '"Bom." Ele guarda as bolas. "Sabe quantas pessoas descobriram que o truque era o truque e ganharam mesmo assim? Poucas."',
    '"Última porta." Ele perde o tom de palco de vez. "Essa aí não tem substituto. Essa aí é o dono da placa."'
  ]
},
{
  id:'lance', ordem:4, nome:'Lance', titular:'Lance', tipo:'Dragão', nivelBase:66,
  especies:[130, 148, 148, 142, 149],   // Gyarados, Dragonair, Dragonair, Aerodactyl, Dragonite
  intro:d=>[
    'A quarta porta diz LANCE, e é a única da ala que está aberta.',
    'A sala é alta, de pedra escura, com fogo em quatro bacias de metal que alguém acende todo dia de manhã e apaga todo dia à noite.',
    'O homem de capa está em pé no centro, e está em pé no centro desde as oito da manhã, como esteve ontem e anteontem.',
    '"Lance." Ele estende a mão, e a mão é firme e seca. "Da Elite dos Quatro. O que sobrou dela."',
    '"Eu não vou falar dos outros três e eu peço que {o senhor|a senhora} também não fale. Eles têm motivo, e motivo de gente cansada não é assunto de desafiante."',
    d=>d.flags.liga_aliada || d.flags.sabe_do_norte
      ? '"E eu sei o que te mandaram fazer no norte." Ele não muda de expressão. "Então vamos ser rápidos e vamos ser sérios, porque o que está lá em cima é maior que esta sala, e eu tenho consciência disso."'
      : '"Eu venho todo dia. Não é disciplina, é que eu não saberia o que fazer com um dia em que eu não viesse."',
    '"Eu treino dragão. Não é estilo, é família — o meu avô treinava, o meu primo treina." Ele solta a primeira bola sem cerimônia. "Vem."'
  ],
  vitoria:d=>[
    'O Dragonite cai de joelhos primeiro e só depois de lado, o que é a coisa mais parecida com respeito que um Dragonite faz.',
    'Lance recolhe os cinco sem pressa nenhuma e fica um tempo comprido de costas para você.',
    '"Em cinco meses {o senhor|a senhora} é {o primeiro|a primeira} que chega aqui." Ele finalmente se vira. "E o primeiro que passa."',
    'Ele vai até a parede do fundo e aperta um botão que você não tinha visto, e o que você achou que fosse parede começa a abrir.',
    '"A cadeira do Campeão está vaga no papel faz dois anos." Ele segura a porta. "No papel."',
    '"Boa sorte. E, quando {o senhor|a senhora} sair de lá, seja lá como for, eu vou estar aqui amanhã às oito."'
  ]
}
];

/* ── O CAMPEÃO ─────────────────────────────────────────── */
const CAMPEAO = {
  id:'red', nome:'Red', nivelBase:72,
  especies:[25, 143, 131, 3, 6, 9],       // Pikachu, Snorlax, Lapras, Venusaur, Charizard, Blastoise
  apelidos:{25:'Pika'},
  intro:d=>[
    'A sala atrás da última porta não é uma arena. É um salão vazio, sem iluminação de arena, com uma claraboia.',
    'Tem uma pessoa em pé no centro. Boné, jaqueta, mochila. Aparenta uns dezoito anos.',
    'Ele não se apresenta. Não fala. Não estende a mão.',
    'Ele solta a primeira bola, e é um Pikachu de nível oitenta e alguma coisa.',
    d.flags.leu_caderno || d.flags.viu_os_doze
      ? 'Você quer perguntar mil coisas. Sobre Mewtwo, sobre as aves, sobre por que ele soltou as três. Ele olha pra você de um jeito que fecha todas as perguntas antes delas saírem.'
      : 'Você entende quem é antes de qualquer confirmação, porque só existe uma pessoa em Kanto que entraria num salão desses e não diria nada.',
    'Red não fala. Red nunca falou.'
  ],
  vitoria:d=>[
    'O Pikachu é o último a cair, e cai encostado na perna dele.',
    'Red se agacha, coloca a mão na cabeça do Pikachu, e fica assim um tempo.',
    'Depois se levanta, olha você, e faz a única coisa que ele faz: assente uma vez.',
    'Ele sobe a escada do poço e sai pela porta do corredor, e ninguém no Planalto Indigo o vê passar, porque ninguém no Planalto Indigo estava esperando que ele estivesse lá.',
    d.flags.sabe_do_norte || d.flags.liga_aliada
      ? 'Na porta, antes de sumir, ele para. Sem virar, ele levanta a mão e aponta para o norte.\nDepois vai embora.'
      : 'Você fica sozinh{o|a} num salão vazio com uma claraboia, como campeão de Kanto, sem ninguém pra contar.',

    /* A entrega da Pokédex Nacional. Ela chega como papel, porque
       tudo importante nesta campanha chega como papel. */
    'Você fica ali um tempo que não dá pra medir. Depois a Pokédex apita no seu bolso, do jeito errado — dois apitos curtos, que ela nunca deu.',
    'Na tela: ATUALIZAÇÃO REMOTA AUTORIZADA. REGISTRO REGIONAL CONCLUÍDO. AGUARDE.',
    'Ela trava por quatro segundos, reinicia sozinha, e quando volta a barra de progresso embaixo não termina mais no cento e cinquenta e um.',
    'Uma auxiliar da Liga entra no salão com uma pasta e não olha pro chão nem pro teto, só pra você.',
    '"A Liga libera o registro nacional pra quem senta na cadeira." Ela entrega a pasta aberta na página certa. "São cem entradas novas. Todas vazias."',
    '"E a fronteira do norte?" — porque é o que você pergunta, e ela já estava esperando.',
    '"A fronteira do norte pede autorização da Liga." Ela fecha a pasta. "{O senhor|A senhora} é a Liga agora. Autoriza quando quiser."'
  ],
  derrota:d=>[
    'Você perde. Não tem vergonha nisso: você perdeu para a pessoa que derrubou a Equipe Rocket sozinha aos onze anos.',
    'Red cura o seu time — ele mesmo, um por um, com itens da própria mochila — e depois senta no chão do salão até você conseguir levantar.',
    'Quando você levanta, ele aponta a porta por onde você entrou.',
    'Não é expulsão. É "volta".'
  ]
};

/* ============================================================
   TORNEIO ABERTO DA LIGA
   Chaveamento de oito. Acontece o ano inteiro, qualquer um entra.
   ============================================================ */
const RIVAIS_TORNEIO = [
  {nome:'Ezra', tipos:['Normal','Voador'], fala:'"A GENTE TÁ NO MESMO CHAVEAMENTO! Cara! Isso é tipo o destino!"',
   cond:d=>!!d.npcs['Ezra'] && d.npcs['Ezra'].opiniao >= 0},
  {nome:'Ezra', tipos:['Normal','Voador'], fala:'"Não sorri pra mim." Ezra não aperta a sua mão. "Eu treinei oito meses pra isso."',
   cond:d=>!!d.npcs['Ezra'] && d.npcs['Ezra'].opiniao < 0},
  {nome:'Caçador Roque', tipos:['Venenoso','Terrestre'], fala:'"Torneio é o único lugar onde eu posso te bater na frente de gente e sair aplaudido."',
   cond:d=>!!d.npcs['Caçador Roque']},
  {nome:'Fenna, da Silph', tipos:['Elétrico','Psíquico'], fala:'"Eu pedi demissão." Ela dá de ombros. "Sobrou tempo pra treinar."',
   cond:d=>!!d.npcs['Fenna (crachá azul)']},
  {nome:'Guia Orin', tipos:['Inseto','Grama'], fala:'"Eu saí da Zona." Orin está diferente. "Eu testemunhei. Perdi o emprego. Tô aqui."',
   cond:d=>!!d.npcs['Guia Orin']},
  {nome:'Ás do Planalto', tipos:['Dragão','Voador'], fala:'"Eu treino aqui. Literalmente aqui. Boa sorte."'},
  {nome:'Veterana de Saffron', tipos:['Psíquico','Fantasma'], fala:'"Décimo quarto torneio. Eu não vim ganhar, eu vim continuar vindo."'},
  {nome:'Pescador de Fuchsia', tipos:['Água','Gelo'], fala:'"Eu não uso Poké Ball cara e ainda assim eu ganho de gente rica. É o meu hobby."'},
  {nome:'Criador de Pallet', tipos:['Normal','Lutador'], fala:'"Eu crio. Eu não batalho. Mas os meus batalham."'},
  {nome:'Estudante de Cinnabar', tipos:['Fogo','Pedra'], fala:'"O Blaine é meu professor. Ele disse pra eu não te subestimar."'},
  {nome:'Mochileiro da Rota 3', tipos:['Pedra','Terrestre'], fala:'"Eu durmo no mato há dois anos. Isso conta como treino?"'},
  {nome:'Enfermeira de folga', tipos:['Normal','Psíquico'], fala:'"Eu curo o seu time toda semana. Hoje eu machuco."'}
];

/* Monta um adversário de torneio com time escalado ao jogador */
function adversarioTorneio(rival, nivelAlvo){
  // Ezra entra com o time de verdade dele, no arco em que estiver
  if (rival.nome === 'Ezra' && Estado.dados.rival){
    return {nome:'Ezra', fala: rival.fala, time: timeRival()};
  }
  const pool = poolSelvagem().filter(d => {
    const p = DEX[d];
    return p.tipos.some(t => rival.tipos.includes(t)) && p.total >= 380 && !p.evo;
  });
  const fallback = poolSelvagem().filter(d => DEX[d].total >= 400 && !DEX[d].evo);
  const base = pool.length >= 3 ? pool : fallback;
  const qtd = 3;
  const time = [];
  const usados = new Set();
  for (let i = 0; i < qtd; i++){
    let dex = Dados.escolher(base);
    let tentativas = 0;
    while (usados.has(dex) && tentativas++ < 12) dex = Dados.escolher(base);
    usados.add(dex);
    time.push(criarPokemon(dex, Math.max(5, nivelAlvo + Dados.entre(-2, 2)), {}));
  }
  return {nome: rival.nome, fala: rival.fala, time};
}

function nivelDoJogador(){
  const t = Estado.dados.time.filter(p => !p.morto);
  if (!t.length) return 10;
  return Math.round(t.reduce((s,p) => s + p.nivel, 0) / t.length);
}

/* Sorteia sete adversários coerentes com a sua história */
function montarChaveamento(){
  const d = Estado.dados;
  const disponiveis = RIVAIS_TORNEIO.filter(r => !r.cond || r.cond(d));
  const escolhidos = [];
  const vistos = new Set();
  // primeiro os que têm ligação com a sua história
  disponiveis.filter(r => r.cond).forEach(r => {
    if (escolhidos.length < 3 && !vistos.has(r.nome)){ escolhidos.push(r); vistos.add(r.nome); }
  });
  const resto = disponiveis.filter(r => !r.cond);
  while (escolhidos.length < 3 && resto.length){
    const r = resto.splice(Dados.entre(0, resto.length-1), 1)[0];
    if (!vistos.has(r.nome)){ escolhidos.push(r); vistos.add(r.nome); }
  }
  const nivel = nivelDoJogador();
  return escolhidos.slice(0,3).map((r,i) => adversarioTorneio(r, nivel + i*2));
}

const PREMIO_TORNEIO = [
  {rodada:'Quartas',   dinheiro:3000,  rep:0, itens:{'Hyper Potion':2}},
  {rodada:'Semifinal', dinheiro:8000,  rep:1, itens:{'Full Heal':2,'Ultra Ball':1}},
  {rodada:'Final',     dinheiro:25000, rep:2, itens:{'Ultra Ball':3,'Hyper Potion':3}}
];

const INSCRICAO_TORNEIO = 2000;

/* ── disponibilidade ───────────────────────────────────── */
function statusElite4(){
  const d = Estado.dados;
  if (d.flags.campeao_de_kanto) return {estado:'concluido', texto:'Você é o Campeão de Kanto'};
  if (numInsignias() < 8) return {estado:'trancado', texto:`Exige as 8 insígnias (você tem ${numInsignias()})`};
  return {estado:'disponivel', texto:'Ala da Elite 4 aberta'};
}

function statusTorneio(){
  const d = Estado.dados;
  if (d.capitulo < 2) return {estado:'trancado', texto:'Volte quando tiver estrada'};
  if (d.jogador.dinheiro < INSCRICAO_TORNEIO) return {estado:'sem_dinheiro', texto:`Inscrição: ${INSCRICAO_TORNEIO} ₽ (você tem ${d.jogador.dinheiro})`};
  return {estado:'disponivel', texto:`Inscrição: ${INSCRICAO_TORNEIO} ₽`};
}
