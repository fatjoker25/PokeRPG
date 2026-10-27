/* ============================================================
   LIGA POKÉMON — Elite 4, o Campeão e o Torneio Aberto
   A cadeira de Campeão está vaga há dois anos.
   ============================================================ */

/* A Elite dos Quatro de Kanto é Lorelei, Bruno, Agatha e Lance.
   Há meses três deles não se apresentam (o capítulo 17 conta desde
   quando, pelo calendário). A Liga não tirou os nomes das portas: pôs
   substitutos embaixo deles. As quatro salas ficam num corredor (a
   ala, como diz o afazer do Planalto); o poço de pedra do capítulo 26
   é a arena de baixo, outra sala.
   Quem senta atrás de cada porta hoje sai de Titulares.membro(i)
   (titulares.js): o titular, se a visita trouxe ele de volta, ou o
   substituto daqui. Cada substituto tem o próprio jeito de olhar pro
   dono da placa — ambição, conta antiga, saudade de ser xingado —
   e conta, ganhando ou perdendo, onde o dono está (`pista`). */
const ELITE4 = [
{
  id:'giselle', ordem:1, nome:'Giselle', titular:'Lorelei', tipo:'variado', nivelBase:60, f:true,
  pista:'sabe_onde_lorelei',
  especies:[105, 40, 53, 31, 112],   // Marowak, Wigglytuff, Persian, Nidoqueen, Rhydon
  intro:d=>[
    'O corredor da ala tem quatro portas seguidas. A primeira tem uma placa de bronze parafusada na altura dos olhos: LORELEI.',
    'A sala atrás dela não parece sala de batalha. Parece sala de aula: quadro, carteira, projetor desligado.',
    'A mulher na frente tem uns vinte e poucos anos e um caderno aberto com a sua ficha dentro. Ela não é a Lorelei, e não faz cara de quem sente muito por isso.',
    '"Giselle. Primeira da turma na Escola Técnica Pokémon, no último ano em que a escola existiu."',
    '"A placa ainda diz Lorelei porque parafuso de bronze dá trabalho." Ela não olha pra porta. "Eu já medi. A minha cabe no mesmo furo."',
    '"Regra da ala, uma vez só, porque ninguém lê o regulamento: você não sai daqui até vencer os quatro ou perder para um. Não tem Centro Pokémon aqui dentro."',
    '"O que estiver na sua mochila é tudo o que você tem pelas próximas quatro batalhas."',
    d=>d.insignias.length >= 8 ? '"Oito insígnias." Ela anota alguma coisa. "Eu tenho dados de quatrocentos e onze desafiantes com oito insígnias. Cento e nove passaram desta sala. Eu pretendo baixar essa conta."' : ''
  ],
  vitoria:d=>[
    'O último dela cai e Giselle fecha o caderno com as duas mãos, sem pressa.',
    '"Cento e dez." Ela anota. "Eu odiei isso e eu vou registrar direito mesmo assim, porque dado torto não serve pra nada."',
    '"Eu mando a súmula de toda luta desta sala pra Lorelei, toda segunda, pela caixa de correio do cais velho de Fuchsia. Ela nunca respondeu."',
    'Ela arranca a folha do caderno e dobra em quatro.',
    '"Essa ela vai ler. Próxima sala. Não descansa: isso é de propósito."'
  ],
  derrota:d=>[
    'O seu último cai, e Giselle não comemora. Ela escreve.',
    '"Previsto na página quatro." Ela vira o caderno pra você ver, e está mesmo na página quatro.',
    '"Você perdeu pro que eu sabia de você. Isso tem conserto: muda o que eu sei."',
    '"E não adianta ir chorar com a dona da placa. A Lorelei mora no cais velho de Fuchsia e não abre carta da Liga. Nem as minhas."'
  ]
},
{
  id:'aj', ordem:2, nome:'A.J.', titular:'Bruno', tipo:'Terrestre', nivelBase:62,
  pista:'sabe_onde_bruno',
  especies:[28, 51, 105, 112, 76],   // Sandslash, Dugtrio, Marowak, Rhydon, Golem
  intro:d=>[
    'A segunda porta diz BRUNO. A sala atrás é de terra batida e não tem mobília nenhuma. Nem cadeira, nem bancada, nem água.',
    'O homem no centro tem chicote pendurado no cinto e não usa o chicote há anos — ele carrega porque a história dele carrega.',
    '"A.J." Ele nem estende a mão. "Noventa e oito vitórias seguidas antes de eu fazer dezesseis anos. Depois disso eu parei de contar, porque contar vira vaidade."',
    '"Eu treinei do jeito errado quando era moleque. Muita gente me disse isso e todas elas tinham razão." Ele se alonga sem pressa.',
    '"Eu mudei o método. Não mudei o resultado."',
    '"O dono da placa me ganhou duas vezes, quando eu tinha dezessete e dezenove anos. Eu esperei vinte anos pela terceira, e ele foi embora carregar pedra." Ele bate a terra da mão. "Então hoje {o senhor|a senhora} paga a conta dele."',
    d=>d.cemiterio.length ? `"E eu sei o que aconteceu com ${nomeExib(d.cemiterio[0])}." Ele fala isso sem acusação nenhuma, o que é pior. "Eu também perdi um. Continua doendo depois de doze anos. É pra doer."` : '',
    d=>d.flags.sabe_da_pergunta
      ? '"E {o senhor|a senhora} já sabe do vale." Ele se alonga do mesmo jeito, sem mudar nada na voz. "Aqui dentro a gente não fala disso. Aqui dentro é chão de terra e é batalha, e por quarenta minutos eu consigo não pensar naquilo. Deixa eu ter os quarenta minutos."'
      : (d.flags.conheceu_o_da_terceira ? '"A gente já se falou no vestiário." Ele assente uma vez. "Lá eu era um homem. Aqui eu sou a segunda porta. Não confunde as duas coisas."' : '')
  ],
  vitoria:d=>[
    'O Golem cai de lado e a sala vazia devolve o som três vezes.',
    'A.J. assente uma única vez e não fala nada por um tempo desconfortável.',
    '"Você aguentou cansad{o|a}." Ele abre a porta com o ombro. "Tem gente que só sabe vencer descansada."',
    '"Se passar por Pewter, diz pro Bruno que a sala dele está varrida. Turno da manhã, na pedreira." Ele quase sorri. "Ele vai rir. Ele ri de tudo, e é por isso que eu nunca ganhei dele."',
    '"Vai. O Mandi detesta esperar e faz questão de avisar."'
  ],
  derrota:d=>[
    'O seu último cai na terra batida e levanta poeira, e A.J. espera a poeira assentar antes de falar.',
    '"{O senhor|A senhora} lutou como quem tem pressa de ir embora daqui." Ele recolhe os dele. "Aqui não é lugar de pressa."',
    '"O Bruno dizia isso melhor. Ele está em Pewter, carregando pedra no turno da manhã da pedreira. Vai lá ouvir como ele fala." Ele vira as costas. "Ou não vai, e volta aqui com menos pressa."'
  ]
},
{
  id:'mandi', ordem:3, nome:'Mandi', titular:'Agatha', tipo:'Venenoso', nivelBase:64,
  pista:'sabe_onde_agatha',
  especies:[103, 117, 42, 49, 94],   // Exeggutor, Seadra, Golbat, Venomoth, Gengar
  intro:d=>[
    'A terceira porta diz AGATHA, e é a única das quatro que tem uma cadeira encostada do lado de fora, como se alguém costumasse esperar ali.',
    'A sala tem iluminação de palco. Refletor, fumaça de máquina, e uma música que começa quando você entra.',
    '"MANDI!" Ele abre os braços para uma plateia que não existe. "O ESPANTOSO!"',
    'Depois baixa os braços e fala em tom normal, o que é muito mais assustador:',
    '"Todo mundo acha que eu sou palhaço. Eu fui vice-campeão da Conferência do Planalto Indigo, e eu virei palhaço de propósito, porque desafiante nervoso erra mais do que desafiante assustado."',
    '"A cadeira lá fora é da Agatha. Oitenta e poucos anos, sentava ali entre os desafiantes pra fumar e dizer a cada um quanto tempo ia durar." Ele sorri. "Ela errava pouco. E me chamava de palhaço na frente de todo mundo, e eu respondia que palhaço cobra ingresso."',
    '"Eu deixo a cadeira ali porque sinto falta de ser xingado por alguém que entende do assunto."',
    '"Agora você sabe de tudo. E vai errar mesmo assim."'
  ],
  vitoria:d=>[
    'O Gengar se dissolve no ar e a música do palco para no meio de um compasso.',
    'Mandi acende a luz normal da sala, e sem o refletor ele parece dez anos mais velho.',
    '"Bom." Ele guarda as Pokébolas. "Sabe quantas pessoas descobriram que o truque era o truque e ganharam mesmo assim? Poucas."',
    '"Se um dia passar por Lavender: a casa de janela verde atrás da Torre." Ele pisca. "Conta pra ela que me ganhou. Ela vai adorar saber que eu perdi."',
    '"Última porta." Ele perde o tom de palco de vez. "Essa aí não tem substituto. Quem senta atrás dela é o dono da placa."'
  ],
  derrota:d=>[
    'O seu último cai, e o refletor gira devagar até achar você no chão da sala.',
    '"E o ESPANTOSO vence de novo!" Ele faz uma reverência pra plateia que não existe, e depois estende a mão pra você levantar.',
    '"Não fica assim. Você caiu no truque mais velho do mundo: olhou pra luz."',
    '"A Agatha teria acertado quanto tempo você ia durar. Ela está em Lavender, na casa de janela verde atrás da Torre, se quiser perguntar. Leva paciência, que ela não tem."'
  ]
},
{
  id:'lance', ordem:4, nome:'Lance', titular:'Lance', tipo:'Dragão', nivelBase:66,
  especies:[130, 148, 148, 142, 149],   // Gyarados, Dragonair, Dragonair, Aerodactyl, Dragonite
  /* A última porta, e a única que nunca ficou sem dono. O Lance não
     faz piada nem pede licença: fala pouco, fala de cima, e a sala
     inteira fala com ele — o fogo deita quando o dragão respira. */
  intro:d=>[
    'A quarta porta diz LANCE, e é a única da ala que está aberta. O calor sai por ela antes de você chegar.',
    'A sala é alta, de pedra escura, com fogo em quatro bacias de metal. No fundo, uma sombra do tamanho da parede se mexe devagar, e não é sombra de gente.',
    'O homem de capa está em pé no centro, como esteve ontem e anteontem. Quando você entra, o fogo das quatro bacias deita na sua direção, como se alguma coisa atrás dele tivesse respirado fundo.',
    `"Lance." A voz não sobe: ela ocupa a sala. "Mestre dos Dragões, e a última porta da Elite dos Quatro${Titulares.todosVoltaram(d) ? ', inteira de novo' : ''}."`,
    ...lanceSobreOsOutros(d),
    d=>d.flags.liga_aliada || d.flags.sabe_do_norte
      ? '"E eu sei o que te mandaram fazer no norte." Ele não muda de expressão. "O que está lá em cima é maior que esta sala. Então prove aqui que aguenta o que é grande."'
      : d.flags.elite_passou_lance
        ? '"Você já passou por mim nesta sala. Hoje eu descubro se foi acidente."'
        : '"Nesta sala eu nunca perdi. Não é orgulho. É registro."',
    '"Dragão não é estilo. É sangue: o meu avô treinava, o meu primo treina, e os meus nasceram pra ser o último obstáculo entre um desafiante e a cadeira do Campeão."',
    'Ele solta a primeira Pokébola sem cerimônia, e o Gyarados que sai dela ocupa metade da sala.',
    '"Vem."'
  ],
  /* a fala da vitória é lida antes do carimbo da porta (resultadoElite):
     elite_passou_lance aqui quer dizer que já foi vencido noutra vez */
  vitoria:d=>[
    'O Dragonite cai de joelhos primeiro e só depois de lado, o que é a coisa mais parecida com respeito que um Dragonite faz.',
    'Lance recolhe os cinco sem pressa nenhuma. O fogo das quatro bacias baixa junto, como se a sala também tivesse perdido.',
    d.flags.elite_passou_lance
      ? '"De novo." Ele se vira. "Então não foi acidente."'
      : Titulares.quantos(d)
        ? `"Faz meses que ninguém chegava aqui." Ele se vira. "{O senhor|A senhora} passou pelas quatro portas${Titulares.todosVoltaram(d) ? ', com as quatro defendidas por quem é dono delas' : ''}. Nada que passa por mim é sorte."`
        : '"Desde que os outros três pararam de vir, {o senhor|a senhora} é {o primeiro|a primeira} que chega aqui." Ele se vira. "E {o primeiro|a primeira} que me vence nesta sala."',
    'Ele vai até a parede do fundo e aperta um botão que você não tinha visto, e o que você achou que fosse parede começa a abrir.',
    '"A cadeira do Campeão está vaga no papel faz dois anos." Ele segura a porta. "No papel."',
    '"Vai. Quem atravessa esta porta não volta a ser desafiante."'
  ],
  derrota:d=>[
    'O seu último cai, e o Dragonite pousa na frente dele de asas abertas, e fica assim até o Lance levantar a mão. Só então ele recua.',
    '"É aqui que a maioria para." Ele recolhe os cinco sem pressa. "Não é vergonha. É a distância que ainda falta."',
    '"Esta porta abre todo dia, às oito. Volte quando os seus estiverem à altura dos meus."'
  ]
}
];

/* O que o Lance diz dos outros três: nada de reverência e nada de
   piada. Ele é a parede que ficou, e fala da ala como quem fala de
   uma defesa: quem guardava lugar, quem voltou pra sala, e o que o
   desafiante já atravessou pra chegar até ele. */
function lanceSobreOsOutros(d){
  const v = id => typeof Titulares !== 'undefined' && Titulares.voltou(id, d);
  if (!v('lorelei') && !v('bruno') && !v('agatha')) return [
    '"Três salas desta ala estão sem dono há meses, e a ala não caiu. Não caiu porque esta porta nunca abriu pra quem não merecia."',
    '"Você passou por quem guarda o lugar dos outros. Aqui ninguém guarda lugar de ninguém."'
  ];
  const linhas = [];
  if (v('lorelei')) linhas.push('"Você passou pela Lorelei. Pouca gente sai daquela sala pensando direito."');
  if (v('bruno'))   linhas.push('"Você passou pelo Bruno e ainda está de pé. Isso já diz alguma coisa."');
  if (v('agatha'))  linhas.push('"Você passou pela Agatha. Ela não gasta tempo com quem não aguenta, e gastou com você."');
  linhas.push(Titulares.todosVoltaram(d)
    ? '"Os quatro estão nos seus lugares. Pela primeira vez em meses a Elite está inteira, e você chegou até a última porta dela."'
    : '"As salas que ainda estão sem dono vão ter dono. Esta nunca ficou sem."');
  return linhas;
}

/* ── O CAMPEÃO ─────────────────────────────────────────── */
const CAMPEAO = {
  id:'red', nome:'Red', nivelBase:72,
  especies:[25, 143, 131, 3, 6, 9],       // Pikachu, Snorlax, Lapras, Venusaur, Charizard, Blastoise
  apelidos:{25:'Pika'},
  intro:d=>[
    'A sala atrás da última porta não é uma arena. É um salão vazio, sem iluminação de arena, com uma claraboia.',
    'Tem uma pessoa em pé no centro. Boné, jaqueta, mochila. Aparenta uns dezoito anos.',
    'Ele não se apresenta. Não fala. Não estende a mão.',
    `Ele solta a primeira Pokébola, e é um Pikachu de nível ${porExtenso(CAMPEAO.nivelBase)}.`,
    d.flags.leu_caderno || d.flags.viu_os_doze
      ? `Você quer perguntar mil coisas. Sobre Mewtwo, sobre as aves${d.flags.sabe_do_red_no_mirante ? ', sobre o banco do mirante' : ''}. Ele olha pra você de um jeito que fecha todas as perguntas antes delas saírem.`
      : 'Você entende quem é antes de qualquer confirmação, porque só existe uma pessoa em Kanto que entraria num salão desses e não diria nada.',
    'Red não fala. Red nunca falou.'
  ],
  vitoria:d=>[
    'O último dele cai, e o Pikachu, que caiu primeiro, sai sozinho da Pokébola pra encostar na perna dele.',
    'Red se agacha, coloca a mão na cabeça do Pikachu, e fica assim um tempo.',
    'Depois se levanta, olha você, e faz a única coisa que ele faz: assente uma vez.',
    'Ele sai pela porta do fundo do salão, e ninguém no Planalto Indigo o vê passar, porque ninguém no Planalto Indigo estava esperando que ele estivesse lá.',
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
    /* do norte, só pergunta quem já ouviu falar dele */
    d.flags.sabe_do_norte || d.flags.liga_aliada || d.flags.sabe_do_norte_antes
      ? '"E a fronteira do norte?" — porque é o que você pergunta, e ela já estava esperando.'
      : 'Ela fica parada um segundo a mais, como quem tem mais uma coisa pra dizer.',
    d.flags.sabe_do_norte || d.flags.liga_aliada || d.flags.sabe_do_norte_antes
      ? '"A fronteira do norte pede autorização da Liga." Ela fecha a pasta. "{O senhor|A senhora} é a Liga agora. Autoriza quando quiser."'
      : '"E tem a fronteira do norte, que ninguém cruza sem autorização da Liga." Ela fecha a pasta. "{O senhor|A senhora} é a Liga agora. Autoriza quando quiser."'
  ],
  derrota:d=>[
    'Você perde. Não tem vergonha nisso: você perdeu para a pessoa que derrubou a Equipe Rocket sozinha aos dezesseis anos.',
    'Red se agacha do lado de cada um do seu time, um por um, e olha sem pressa, como quem confere se ficou tudo inteiro. Depois senta no chão do salão até você conseguir levantar.',
    'Quando você levanta, ele aponta a porta por onde você entrou.',
    'Não é expulsão. É "volta".'
  ]
};

/* ============================================================
   TORNEIO ABERTO DA LIGA
   Chaveamento de oito. Acontece o ano inteiro, qualquer um entra, e
   você luta com três dos inscritos, um por rodada. Todo inscrito tem
   nome, cidade e time montado: as linhas, como o treinador de estrada
   (o nível escolhe a forma), golpes de TM do dono e um item no ás. O
   time cresce com as suas insígnias e acompanha os seus três mais
   fortes, um pouco acima a cada rodada — o torneio não fica fácil
   quando você cresce, nem impossível quando você começa. Medido com
   ferramentas/sim-torneio.js; os números estão na folha de regras.
   ============================================================ */
const NIVEL_TORNEIO = [-3, -2, 0];                 // o ás de cada rodada, perto dos seus três mais fortes
const TAM_TORNEIO = [3, 3, 4, 4, 5, 5, 6, 6, 6];   // pelas suas insígnias
const TAM_EXTRA_TORNEIO = [0, 0, 0];               // a mais por rodada (a final já é a mais alta)
const ERRO_IA_TORNEIO = [12, 10, 8];               // escolha errada de golpe, por rodada (o resto erra 22)
const MORAL_TORNEIO = 85;

/* `linhas` vai do mais fraco ao ás: o time pega as últimas, do tamanho
   da rodada. `segura` é o item do ás. `ajuste` é o acerto de nível de
   cada um, medido no sim-torneio: time de tipo que o jogador comum não
   aguenta (a água e o gelo do Ewan) vem mais baixo, o que cai fácil vem mais
   alto, e todos ficam perto da mesma dureza. */
const RIVAIS_TORNEIO = [
  {nome:'Ezra', tipos:['Normal','Voador'], fala:'"A GENTE TÁ NO MESMO CHAVEAMENTO! Cara! Isso é tipo o destino!"',
   cond:d=>!!d.npcs['Ezra'] && d.npcs['Ezra'].opiniao >= 0},
  {nome:'Ezra', tipos:['Normal','Voador'], fala:'"Não sorri pra mim." Ezra não aperta a sua mão. "Eu treinei pra isso todo dia desde que saí de casa."',
   cond:d=>!!d.npcs['Ezra'] && d.npcs['Ezra'].opiniao < 0},
  {nome:'Caçador Roque', de:'da Floresta de Viridian', fala:'"Torneio é o único lugar onde eu posso te bater na frente de gente e sair aplaudido."',
   linhas:[49, 42, 89, 110, 34, 24], golpes:['Earthquake', 'Sludge Bomb', 'Rock Slide', 'Body Slam'], segura:'Faixa Firme',
   cond:d=>!!d.npcs['Caçador Roque']},
  {nome:'Fenna, da Silph', f:true, de:'de Saffron', fala:'"Eu pedi demissão." Ela dá de ombros. "Sobrou tempo pra treinar."',
   linhas:[137, 101, 82, 64, 125, 135], golpes:['Thunderbolt', 'Psychic', 'Thunder Wave', 'Ice Beam'], segura:'Óculos Grossos',
   cond:d=>!!d.npcs['Fenna (crachá azul)']},
  {nome:'Guia Orin', de:'de Fuchsia', fala:'"Eu saí da Zona." Orin está diferente. "Pedi as contas depois de tudo aquilo. Tô aqui."',
   linhas:[47, 49, 103, 114, 127, 123], golpes:['Swords Dance', 'Body Slam', 'Solar Beam', 'Double-Edge'], segura:'Punho de Ferro', ajuste:2,
   cond:d=>!!d.npcs['Guia Orin']},
  /* quem não vem da sua história: sete inscritos de sempre */
  {nome:'Domador de Dragões Ronan', curto:'Ronan', arq:'dragon_tamer', de:'do Planalto',
   fala:'"Eu treino aqui. Literalmente aqui. Boa sorte."',
   linhas:[18, 142, 117, 130, 6, 149], golpes:['Earthquake', 'Fire Blast', 'Thunderbolt', 'Ice Beam'], segura:'Faixa Firme', ajuste:3},
  {nome:'Paranormal Sabine', curto:'Sabine', f:true, arq:'psychic_f', de:'de Saffron',
   fala:'"Décimo quarto torneio. Eu não vim ganhar, eu vim continuar vindo."',
   linhas:[122, 178, 200, 203, 97, 94], golpes:['Psychic', 'Shadow Ball', 'Thunderbolt', 'Ice Punch'], segura:'Óculos Grossos', ajuste:-4},
  {nome:'Pescador Ewan', curto:'Ewan', arq:'ewan', de:'de Fuchsia',
   fala:'"Eu não uso Poké Ball cara e ainda assim eu ganho de gente rica. É o meu hobby."',
   linhas:[119, 99, 73, 87, 91, 130], golpes:['Ice Beam', 'Blizzard', 'Thunderbolt', 'Earthquake'], segura:'Resto de Ração', ajuste:-4},
  {nome:'Criador Abel', curto:'Abel', arq:'pokemonbreeder_gen6xy', de:'de Pallet',
   fala:'"Eu crio. Eu não batalho. Mas os meus batalham."',
   linhas:[20, 53, 108, 57, 115, 128], golpes:['Body Slam', 'Earthquake', 'Rock Slide', 'Submission'], segura:'Punho de Ferro', ajuste:-4},
  {nome:'Estudante Felix', curto:'Felix', arq:'schoolkid_gen4dp', de:'de Cinnabar',
   fala:'"O Blaine é meu professor. Ele diz pra nunca subestimar quem chega com a mochila suja."',
   linhas:[78, 139, 141, 38, 126, 59], golpes:['Fire Blast', 'Rock Slide', 'Body Slam', 'Hyper Beam'], segura:'Faixa Firme', ajuste:4},
  {nome:'Mochileira Kaia', curto:'Kaia', f:true, arq:'backpacker_gen6', de:'da Rota 3',
   fala:'"Eu durmo no mato há dois anos. Isso conta como treino?"',
   linhas:[95, 28, 51, 75, 105, 112], golpes:['Earthquake', 'Rock Slide', 'Body Slam', 'Swords Dance'], segura:'Punho de Ferro', ajuste:-2},
  {nome:'Enfermeira Mabel', curto:'Mabel', f:true, arq:'pokemoncenterlady', de:'de folga',
   fala:'"Eu curo time a semana inteira. Hoje eu machuco."',
   linhas:[40, 36, 103, 80, 121, 113], golpes:['Psychic', 'Thunderbolt', 'Ice Beam', 'Thunder Wave'], segura:'Resto de Ração', ajuste:-2}
];
/* rosto e nome de quem se inscreve: o nome sai do sorteio, como o do
   treinador de estrada, e o rosto é só dele */
RIVAIS_TORNEIO.forEach(r => {
  if (!r.arq) return;
  if (typeof NOMES_DA_HISTORIA !== 'undefined') NOMES_DA_HISTORIA.add(r.curto);
  if (typeof RETRATO_POR_NOME !== 'undefined') RETRATO_POR_NOME[r.nome] = 'trainers/' + r.arq;
});

/* o ás de cada rodada e o tamanho do time, pelo seu time e pelas suas insígnias */
function nivelDoTorneio(rodada){ return Math.min(85, nivelDeReferencia() + NIVEL_TORNEIO[rodada]); }
function tamanhoDoTorneio(rodada){
  return Math.min(6, TAM_TORNEIO[Math.min(8, numInsignias())] + TAM_EXTRA_TORNEIO[rodada]);
}

/* Monta o inscrito da rodada: time das linhas dele, ou das do veterano */
function adversarioTorneio(rival, rodada){
  // Ezra entra com o time de verdade dele, no arco em que estiver
  if (rival.nome === 'Ezra' && Estado.dados.rival){
    return {nome:'Ezra', f:false, fala: rival.fala, time: timeRival()};
  }
  let linhas = rival.linhas, golpes = rival.golpes;
  if (rival.veterano && typeof veterano === 'function'){
    const v = veterano(rival.veterano);
    linhas = v.times; golpes = v.golpes;
  }
  const nivel = Math.max(5, nivelDoTorneio(rodada) + (rival.ajuste || 0));
  const time = timeDeLinhas(linhas, nivel, tamanhoDoTorneio(rodada), golpes, MORAL_TORNEIO);
  if (rival.segura && time.length) time[time.length - 1].segurando = rival.segura;
  return {nome: rival.nome, f:!!rival.f, fala: rival.fala, de: rival.de || '', time};
}

/* Sorteia os três que você enfrenta: até dois que conhecem você (o Ezra
   sempre na final), o resto entre os inscritos de sempre. */
function montarChaveamento(){
  const d = Estado.dados;
  /* o Ezra só entra com o time de rival dele; o resto, com linhas */
  const disponiveis = RIVAIS_TORNEIO.filter(r => (!r.cond || r.cond(d)) && (r.linhas || r.veterano || (r.nome === 'Ezra' && d.rival)));
  const embaralha = l => l.map(r => [Math.random(), r]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  const conhecidos = embaralha(disponiveis.filter(r => r.cond)).sort((a, b) => (a.nome === 'Ezra') - (b.nome === 'Ezra'));
  const daHistoria = conhecidos.slice(-2);
  const deSempre = embaralha(disponiveis.filter(r => !r.cond)).slice(0, 3 - daHistoria.length);
  return deSempre.concat(daHistoria).map((r, i) => adversarioTorneio(r, i));
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
  if (d.flags.campeao_de_kanto) return {estado:'concluido', texto:'Você é {o Campeão|a Campeã} de Kanto'};
  if (numInsignias() < 8) return {estado:'trancado', texto:`Exige as 8 insígnias (você tem ${numInsignias()})`};
  return {estado:'disponivel', texto:'Ala da Elite 4 aberta'};
}

function statusTorneio(){
  const d = Estado.dados;
  if (d.capitulo < 2) return {estado:'trancado', texto:'Volte quando tiver estrada'};
  if (d.jogador.dinheiro < INSCRICAO_TORNEIO) return {estado:'sem_dinheiro', texto:`Inscrição: ${fmtDin(INSCRICAO_TORNEIO)} ₽ (você tem ${fmtDin(d.jogador.dinheiro)})`};
  return {estado:'disponivel', texto:`Inscrição: ${fmtDin(INSCRICAO_TORNEIO)} ₽`};
}
