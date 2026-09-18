/* ============================================================
   LIGA POKÉMON — Elite 4, o Campeão e o Torneio Aberto
   A cadeira de Campeão está vaga há dois anos.
   ============================================================ */

const ELITE4 = [
{
  id:'lorelei', ordem:1, nome:'Lorelei', tipo:'Gelo', nivelBase:60,
  especies:[87, 91, 124, 131, 144],       // Dewgong, Cloyster, Jynx, Lapras, Articuno
  intro:d=>[
    'A sala de Lorelei é mantida a quatro graus. Você vê a própria respiração antes de ver a adversária.',
    '"Eu vou explicar a regra uma vez, porque ninguém lê o regulamento." Ela nem olha pra cima. "Você não sai desta ala até vencer os quatro ou perder para um. Não tem Centro Pokémon aqui dentro."',
    '"O que estiver na sua mochila é tudo o que você tem pelas próximas quatro batalhas."',
    d.flags.salvou_o_filhote
      ? '"Ah." Ela finalmente levanta os olhos. "Você é o das Seafoam." Uma pausa longa. "Eu fui lá em março. Eu não consegui quebrar o gelo e voltei. Você quebrou."'
      : ''
  ],
  vitoria:d=>[
    'O último dela cede e a temperatura da sala sobe dois graus em algum lugar de um sistema automático.',
    '"Bom." Lorelei já está anotando alguma coisa numa prancheta. "Próxima sala. Não descansa. Isso é de propósito."'
  ]
},
{
  id:'bruno', ordem:2, nome:'Bruno', tipo:'Lutador', nivelBase:62,
  especies:[95, 107, 106, 68, 76],        // Onix, Hitmonchan, Hitmonlee, Machamp, Golem
  intro:d=>[
    'A sala de Bruno não tem mobília. Nenhuma. Só piso de pedra e ele, em pé, no centro.',
    '"Você venceu a Lorelei." Ele se alonga sem pressa. "Isso significa que o seu time está gasto e você está com pressa. As duas coisas jogam a meu favor."',
    '"Eu não vou pegar leve por causa disso. Isso é parte do teste."'
  ],
  vitoria:d=>[
    'O Machamp cai de joelhos e a sala vazia devolve o som três vezes.',
    'Bruno assente uma única vez.',
    '"Você aguentou cansado. Tem gente que só sabe vencer descansada." Ele abre a porta com o ombro. "Vai. A Agatha está esperando e ela detesta esperar."'
  ]
},
{
  id:'agatha', ordem:3, nome:'Agatha', tipo:'Fantasma', nivelBase:64,
  especies:[94, 93, 42, 89, 24],          // Gengar, Haunter, Golbat, Muk, Arbok
  intro:d=>[
    'A sala de Agatha é a única com carpete. É quente, tem cheiro de incenso e tem uma poltrona.',
    'Ela tem oitenta e poucos anos e está sentada na poltrona.',
    '"Você é novo." A voz é agradável. "Eu treino há sessenta anos. Você existe há quinze."',
    d.flags.escreveu_mural || d.cemiterio.length
      ? '"E você já enterrou alguém." Ela sorri sem nenhuma maldade. "Isso muda a sua batalha. Quem já enterrou não tem medo de fantasma — tem outra coisa, pior, e eu vou usar."'
      : '"Fantasma assusta quem nunca perdeu nada. Vamos descobrir qual é o seu caso."'
  ],
  vitoria:d=>[
    'O Gengar se dissolve no ar e o carpete fica com um vinco onde ele estava.',
    'Agatha aplaude três vezes, devagar, sentada.',
    '"Sessenta anos e um moleque." Ela parece genuinamente satisfeita. "Isso é a melhor coisa que pode acontecer com uma velha. O Lance está na última porta. Ele vai ser mais difícil e mais chato."'
  ]
},
{
  id:'lance', ordem:4, nome:'Lance', tipo:'Dragão', nivelBase:66,
  especies:[130, 148, 148, 142, 149],     // Gyarados, Dragonair, Dragonair, Aerodactyl, Dragonite
  intro:d=>[
    'A última sala da ala é um poço. Você desce por uma escada e a arena fica quinze metros abaixo do nível do corredor.',
    'Lance está no centro, de capa, com o maior Dragonite que você já viu na vida parado atrás dele.',
    '"Eu sou o último." Ele fala alto por causa do eco. "E, tecnicamente, há dois anos eu também sou o primeiro."',
    '"A cadeira de Campeão está vaga desde que o Red desapareceu. Eu assino os documentos. Eu não uso o título."',
    d.flags.liga_aliada
      ? '"E eu sei que te mandaram pro norte." Ele ajusta a capa. "Então vamos ser rápidos, porque o que está lá em cima é mais importante do que isto aqui."'
      : '"Se você me vencer, alguma coisa vai acontecer. Eu não sei o quê. Ninguém me venceu desde que a cadeira vagou."'
  ],
  vitoria:d=>[
    'O Dragonite cai de lado e o poço inteiro treme.',
    'Lance fica olhando pra cima, pro corredor de onde você desceu, por um tempo estranho.',
    '"Dois anos." Ele fala baixo. "Dois anos e ninguém tinha passado por essa porta."',
    'Ele aperta um botão numa parede que você não tinha visto, e ao fundo do poço uma porta que você achou que fosse parede começa a abrir.'
  ]
}
];

/* ── O CAMPEÃO ─────────────────────────────────────────── */
const CAMPEAO = {
  id:'red', nome:'Red', nivelBase:72,
  especies:[25, 143, 131, 3, 6, 9],       // Pikachu, Snorlax, Lapras, Venusaur, Charizard, Blastoise
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
      : 'Você fica sozinho num salão vazio com uma claraboia, como campeão de Kanto, sem ninguém pra contar.'
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
  {nome:'Téo', tipos:['Normal','Voador'], fala:'"A GENTE TÁ NO MESMO CHAVEAMENTO! Cara! Isso é tipo o destino!"',
   cond:d=>!!d.npcs['Téo'] && d.npcs['Téo'].opiniao >= 0},
  {nome:'Téo', tipos:['Normal','Voador'], fala:'"Não sorri pra mim." Téo não aperta a sua mão. "Eu treinei oito meses pra isso."',
   cond:d=>!!d.npcs['Téo'] && d.npcs['Téo'].opiniao < 0},
  {nome:'Caçador Vasco', tipos:['Venenoso','Terrestre'], fala:'"Torneio é o único lugar onde eu posso te bater na frente de gente e sair aplaudido."',
   cond:d=>!!d.npcs['Caçador Vasco']},
  {nome:'Marina, da Silph', tipos:['Elétrico','Psíquico'], fala:'"Eu pedi demissão." Ela dá de ombros. "Sobrou tempo pra treinar."',
   cond:d=>!!d.npcs['Marina (crachá azul)']},
  {nome:'Guia Nico', tipos:['Inseto','Grama'], fala:'"Eu saí da Zona." Nico está diferente. "Eu testemunhei. Perdi o emprego. Tô aqui."',
   cond:d=>!!d.npcs['Guia Nico']},
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
  // Téo entra com o time de verdade dele, no arco em que estiver
  if (rival.nome === 'Téo' && Estado.dados.rival){
    return {nome:'Téo', fala: rival.fala, time: timeRival()};
  }
  const pool = POOL_SELVAGEM.filter(d => {
    const p = DEX[d];
    return p.tipos.some(t => rival.tipos.includes(t)) && p.total >= 380 && !p.evo;
  });
  const fallback = POOL_SELVAGEM.filter(d => DEX[d].total >= 400 && !DEX[d].evo);
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
