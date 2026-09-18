/* ============================================================
   CAPÍTULO 11 — A TORRE DE VIDRO  (Saffron / Silph Co.)
   ============================================================ */
CAPITULOS.push(
{
num:11, titulo:'A Torre de Vidro', local:'Saffron / Silph Co.', ambiente:'cidade', nivelArea:38,
tom:'muito sombrio', inicio:'c11_saffron',
cenas:{

c11_saffron:{
  texto:[
    'Saffron não tem rota, não tem mato, não tem rio.',
    'É a única cidade de Kanto que não faz fronteira com natureza nenhuma: os quatro lados dela dão em estrada asfaltada, e a estrada dá em outra cidade.',
    'É concreto até onde a vista alcança, e a vista não alcança muito, porque tudo é alto.',
    'Você entra pelo sul às onze da manhã e a primeira coisa que te desorienta é a sombra: às onze da manhã, no meio do verão, metade das calçadas está na sombra de alguma coisa.',
    'A Silph Co. ocupa um quarteirão inteiro no centro. Fachada de vidro azul-espelhado do térreo ao décimo andar, recepção com pé-direito de doze metros, catraca, crachá, câmera em cada canto, e uma mulher no balcão que atende com um sorriso impecável e cronometrado.',
    'A dois quarteirões, o ginásio de Saffron está fechado.',
    'Não "fechado hoje". Fechado: portão de aço abaixado, corrente, e um papel A4 plastificado grudado com fita:',
    '**SUSPENSO POR TEMPO INDETERMINADO — S.**',
    'Tem gente acampada na calçada em frente. Seis, sete treinadores, com barraca e tudo, esperando reabrir. Um deles está lá há dezenove dias.',
    d=>{
      const via = Historia.via();
      if (via==='pesquisador') return 'Você tem um guardanapo de cassino com o número 11 e um livro de destinos que diz SPH-11 sete vezes. É o suficiente pra saber onde procurar e insuficiente pra absolutamente qualquer outra coisa.';
      if (via==='mercenario') return 'A Terceira te mandou fazer uma entrega aqui, quinta-feira, dezenove horas, doca de carga. Você é o entregador. Você tem acesso pela doca — o que é mais do que a Liga conseguiu em nove meses de mandado.';
      if (via==='foragido') return 'Você herdou um cliente quando herdou a rede. O cliente é este prédio. Você veio renegociar e ainda não decidiu se renegociar quer dizer cobrar mais caro ou parar de entregar.';
      if (via==='heroi') return 'Você não tem crachá, não tem mandado e não tem plano. Tem um livro de destinos, um número de andar e raiva suficiente pra atravessar uma catraca.';
      return 'Você não sabe direito por que veio. Sabe que veio, e que andou um dia inteiro pra isso.';
    }
  ],
  ef:{registrar:'Chegou a Saffron.',
      presagio:'Metade das calçadas na sombra às onze da manhã. Essa cidade tem camadas e nenhuma vê a outra.'},
  escolhas:[
    {texto:'Ir ao ginásio fechado primeiro.', vai:'c11_ginasio'},
    {texto:'Entrar pela recepção, na cara de pau.', vai:'c11_recepcao'},
    {texto:'Procurar quem trabalha lá — fila do almoço, ponto de ônibus, bar.', vai:'c11_funcionarios'},
    {texto:'Dar a volta no quarteirão e mapear o prédio.', vai:'c11_quarteirao'}
  ]
},

c11_quarteirao:{
  texto:[
    'Você dá a volta nos quatro lados do quarteirão da Silph. Leva vinte minutos e você faz três vezes, porque na primeira você olha o prédio e nas outras duas você olha as portas.',
    'Face norte: entrada principal. Vidro, catraca, dois seguranças, recepção.',
    'Face leste: garagem. Cancela, guarita, câmera com placa de reconhecimento. Entra carro, sai carro.',
    'Face sul: nada. Uma parede cega de concreto de cento e vinte metros, sem porta, sem janela, com um jardim de pedra e três bancos onde ninguém senta.',
    'Face oeste: doca de carga. Três vagas de caminhão, plataforma elevada, porta de enrolar, e — a parte que interessa — uma porta social do lado da plataforma, com maçaneta comum, que fica escancarada o dia inteiro porque o pessoal da carga entra e sai fumando.',
    'Uma empresa com catraca biométrica na frente e uma porta de maçaneta escancarada nos fundos.',
    'Segurança sempre é assim. Sempre.'
  ],
  ef:{flag:['mapeou_a_silph','sabe_da_doca'],
      rep:{eixo:'bom',delta:2,motivo:'Andou o quarteirão três vezes antes de tentar qualquer porta'},
      registrar:'A Silph tem catraca biométrica na frente e uma porta de maçaneta aberta na doca dos fundos.',
      presagio:'Cento e vinte metros de parede cega na face sul. Um prédio não desperdiça cento e vinte metros à toa.'},
  escolhas:[
    {texto:'Ir pra doca de carga.', vai:'c11_doca'},
    {texto:'Ir pra recepção.', vai:'c11_recepcao'},
    {texto:'Ir ao ginásio.', vai:'c11_ginasio'},
    {texto:'Perguntar sobre a parede cega da face sul.', vai:'c11_parede_cega'}
  ]
},

c11_parede_cega:{
  texto:[
    'Você senta num dos três bancos onde ninguém senta, de frente pro jardim de pedra, e olha cento e vinte metros de concreto.',
    'Depois de meia hora aparece um velho com um carrinho de pipoca que estaciona na esquina e claramente já entendeu que aquele é o pior ponto de Saffron e continua vindo mesmo assim.',
    '"Ninguém senta aí", ele diz, sem você perguntar. "Trinta anos que eu paro aqui e ninguém nunca sentou nesse banco."',
    '"Por quê?"',
    'Ele dá de ombros. "Sei lá. É frio. Você não tá sentindo frio?"',
    'Você está. Faz vinte e oito graus em Saffron e você está com frio, sentado num banco encostado numa parede cega, e não tinha reparado nisso até ele falar.',
    '"Tem gente que diz que é a refrigeração deles, que joga o calor pro outro lado. Eu acho que é isso mesmo, viu. Não tem mistério não."',
    'Ele vende pipoca pra você e você compra por educação e por gratidão.'
  ],
  ef:{flag:['viu_a_parede_cega','sentiu_o_frio'],
      itens:{'Saco de pipoca':1},
      dinheiro:-200,
      npc:{nome:'Pipoqueiro da face sul', opiniao:2, memoria:'Vende pipoca no pior ponto de Saffron há trinta anos, na esquina da parede cega.'},
      registrar:'A face sul da Silph é fria ao toque, com 28 graus na rua.',
      presagio:'A refrigeração joga calor pro outro lado. Então tem alguma coisa desse lado sendo resfriada.'},
  escolhas:[
    {texto:'"Tem porta desse lado? Alguma vez teve?"', vai:'c11_teve_porta'},
    {texto:'Ir pra doca de carga.', vai:'c11_doca'},
    {texto:'Ir pra recepção.', vai:'c11_recepcao'},
    {texto:'Ir ao ginásio.', vai:'c11_ginasio'}
  ]
},

c11_teve_porta:{
  texto:[
    '"Teve."',
    'Ele responde tão rápido que você entende que ele esperava alguém perguntar isso um dia.',
    '"Teve porta aí, ó, mais ou menos no meio. Porta de ferro, de duas folhas, larga. Passava caminhão pequeno."',
    '"E fecharam quando?"',
    'Ele pensa com a mão no queixo, do jeito de quem tem prazer em ser consultado.',
    '"Noventa e seis. Fecharam com bloco e rebocaram por cima. Demorou umas duas semanas a obra."',
    '"E você lembra do que passava por ela?"',
    '"Caminhão-baú branco. Uma, duas vezes por mês. E ambulância."',
    'Ele enfatiza sem dramatizar.',
    '"Ambulância entrando numa fábrica de aparelho eletrônico. Isso eu achava esquisito na época e continuo achando."'
  ],
  ef:{flag:['sabe_da_porta_fechada','sabe_da_ambulancia'],
      rep:{eixo:'bom',delta:2,motivo:'Perguntou ao único que estava lá há trinta anos'},
      npc:{nome:'Pipoqueiro da face sul', opiniao:4, memoria:'Te contou da porta de ferro fechada em 1996 e das ambulâncias.'},
      registrar:'Até 1996 a face sul da Silph tinha uma porta larga, com caminhão-baú e ambulância.',
      presagio:'Ambulância entrando numa fábrica de aparelho eletrônico. Em noventa e seis pararam de entrar — ou pararam de precisar.'},
  escolhas:[
    {texto:'Procurar a marca da porta no reboco.', vai:'c11_marca_da_porta'},
    {texto:'Ir pra doca de carga.', vai:'c11_doca'},
    {texto:'Ir ao ginásio falar com a Sabrina.', vai:'c11_ginasio'},
    {texto:'Procurar quem trabalha lá.', vai:'c11_funcionarios'}
  ]
},

c11_marca_da_porta:{
  texto:[
    'Você anda os cento e vinte metros com a mão na parede, como criança.',
    'No metro cinquenta e oito — você conta os passos — o reboco muda de textura. Fica um pouco mais liso, e a diferença tem três metros de largura e uns dois e meio de altura, e as bordas são retas.',
    'Você recua pra rua pra olhar de longe e aí dá pra ver o retângulo inteiro, porque a tinta envelheceu diferente: o retângulo é um tom mais claro.',
    'Uma porta de três metros, tapada com bloco, rebocada e pintada em mil novecentos e noventa e seis.',
    'E no canto inferior direito do retângulo, na junção do reboco novo com o velho, tem uma rachadura fina que desce até o chão.',
    'Você põe a mão na rachadura.',
    'Sai ar.',
    'Ar frio, constante, de uma rachadura numa parede tapada há quatro anos.',
    'Tem alguma coisa pressurizada do outro lado.'
  ],
  ef:{flag:['achou_a_rachadura','sabe_que_e_pressurizado'],
      rep:{eixo:'bom',delta:3,motivo:'Achou a porta que fecharam em 1996'},
      instabilidade:1,
      registrar:'A porta tapada da face sul tem uma rachadura que solta ar frio pressurizado.',
      presagio:'Pressurizado. Quem pressuriza um espaço quer que o ar saia, nunca que entre.'},
  escolhas:[
    {texto:'Ir pra doca de carga.', vai:'c11_doca'},
    {texto:'Ir ao ginásio contar isso pra Sabrina.', vai:'c11_ginasio'},
    {texto:'Procurar quem trabalha lá.', vai:'c11_funcionarios'},
    {texto:'Ir pra recepção.', vai:'c11_recepcao'}
  ]
},

/* ─────────────── O GINÁSIO FECHADO ─────────────── */

c11_ginasio:{
  texto:[
    'O ginásio de Saffron é um prédio baixo e sem janela, encaixado entre dois arranha-céus como se tivesse sido esquecido ali antes deles.',
    'Na calçada tem sete treinadores acampados, com barraca de camping, fogareiro e uma escala de revezamento escrita a giz no muro: quem fica de dia, quem fica de noite.',
    'Um deles, de uns dezoito anos, está lá há dezenove dias e tem a insígnia de sete ginásios.',
    '"Só falta essa", ele diz. "Dezenove dias. Eu tenho passagem comprada pra Liga em quarenta."',
    '"E se não abrir?"',
    '"Aí não abre." Ele não olha pra você quando diz isso. "E eu volto pra casa com sete."',
    'A porta está trancada. Mas a luz interna está acesa — dá pra ver pela fresta embaixo do portão de aço.',
    'Você bate.',
    'Ninguém responde por dois minutos inteiros, o que num lugar com sete pessoas olhando é constrangedor.',
    'Depois a fechadura gira. Sozinha. Do outro lado, sem ninguém tocando nela.',
    'E uma voz de mulher, dentro da sua cabeça, sem passar pelos ouvidos:',
    '"Você está pensando muito alto. Entra antes que a rua toda ouça."'
  ],
  ef:{flag:'entrou_no_ginasio_saffron',
      registrar:'A líder de Saffron abriu a porta para você sem tocar nela.',
      presagio:'Sete pessoas na calçada. Nenhuma foi chamada. Você foi.'},
  escolhas:[
    {texto:'Entrar.', vai:'c11_sabrina'},
    {texto:'"Por que eu e não eles?"', vai:'c11_porque_eu'},
    {texto:'Não entrar. Ir pra doca.', vai:'c11_doca'},
    {texto:'Perguntar pros acampados o que eles sabem.', vai:'c11_acampados'}
  ]
},

c11_acampados:{
  texto:[
    'Você senta com eles na calçada e eles te dão café de garrafa térmica, porque acampamento de calçada é uma república.',
    'Em vinte minutos você tem mais informação do que a Liga tem.',
    '"Ela fechou de uma hora pra outra. Tava aberto na terça, fechado na quarta."',
    '"Teve gente que estava lá dentro no meio do desafio. Ela parou no meio, pediu desculpa e mandou todo mundo sair."',
    '"E o pior é que ela devolveu o dinheiro da inscrição de todo mundo. Em dinheiro, na mão, contado."',
    'A garota que fala isso balança a cabeça.',
    '"Líder de ginásio devolvendo taxa de inscrição em dinheiro, contado, na mão, um por um. Isso é gente se despedindo."',
    'E outro, mais novo, olhando o prédio azul a dois quarteirões:',
    '"Ela olha pra lá. Se você ficar aqui de noite, dá pra ver: ela sai na porta, fica uns dez minutos, e fica olhando pro prédio da Silph."'
  ],
  ef:{flag:['sabe_da_despedida','sabrina_olha_a_silph'],
      rep:{eixo:'bom',delta:1,motivo:'Sentou na calçada e ouviu quem estava esperando'},
      registrar:'Sabrina devolveu todas as taxas de inscrição em dinheiro. Ela olha para a Silph todas as noites.',
      presagio:'Isso é gente se despedindo. A garota entendeu antes de todo mundo.'},
  escolhas:[
    {texto:'Entrar no ginásio.', vai:'c11_sabrina'},
    {texto:'"Por que eu e não eles?"', vai:'c11_porque_eu'},
    {texto:'Ir pra doca.', vai:'c11_doca'},
    {texto:'Ir procurar quem trabalha na Silph.', vai:'c11_funcionarios'}
  ]
},

c11_porque_eu:{
  texto:[
    'Você fala em voz alta, na calçada, na frente de sete pessoas, olhando pra uma porta fechada:',
    '"Por que eu e não eles?"',
    'Os sete olham pra você. Um deles pergunta com quem você está falando.',
    'E a resposta vem, dentro da sua cabeça, e é curta:',
    '"Porque eles querem uma insígnia e você quer entrar naquele prédio."',
    'Pausa.',
    '"E porque eles estão pensando em insígnia há dezenove dias e eu aguento. Você está pensando em onze tanques e eu não aguento."',
    'A fechadura gira de novo.',
    '"Entra. Por favor."',
    'O "por favor" é a primeira coisa que te assusta de verdade em Saffron.'
  ],
  ef:{flag:'sabrina_pediu_por_favor',
      registrar:'Sabrina sabe dos tanques. E pediu por favor.',
      presagio:'Onze tanques. Você nunca disse onze pra ninguém.'},
  escolhas:[{texto:'Entrar.', vai:'c11_sabrina'}]
},

c11_sabrina:{
  texto:[
    'A arena de Saffron é um quadrado de piso emborrachado com marcação branca, arquibancada pra cento e vinte pessoas, e uma iluminação de galpão esportivo que está toda acesa pra uma pessoa só.',
    'Sabrina está sentada no chão do centro da arena, de pernas cruzadas, de olhos abertos, e não se levanta quando você entra.',
    'Tem uma garrafa de água, um saco de pão de forma pela metade e um cobertor dobrado do lado dela. Ela mora aqui faz três semanas.',
    '"Eu fechei o ginásio porque eu não consigo mais separar."',
    'Ela diz isso sem drama nenhum, como quem relata sintoma pro médico na terceira consulta.',
    '"Todo pensamento neste quarteirão chega em mim. Todos. Ao mesmo tempo, o tempo inteiro, e eu aprendi a viver com isso aos nove anos e é a coisa que eu faço melhor na vida."',
    '"E tem um andar naquele prédio ali onde os pensamentos estão errados."',
    '"Não maus. Errados. Como uma frase com a gramática quebrada."',
    '"Doze vozes falando na primeira pessoa do plural sobre uma coisa que é singular."',
    'Ela finalmente olha pra você.',
    '"Você veio por causa do andar onze."'
  ],
  ef:{npc:{nome:'Sabrina', opiniao:2, memoria:'Fechou o ginásio porque o andar 11 da Silph não a deixa em paz.'},
      flag:['sabe_do_andar_11','sabrina_avisou'],
      registrar:'Sabrina confirmou: existe um andar 11 na Silph e os pensamentos de lá estão "errados".',
      presagio:'Primeira pessoa do plural sobre uma coisa singular. Guarde a frase inteira.'},
  escolhas:[
    {texto:'"O que tem lá?"', vai:'c11_sabrina_oque'},
    {texto:'"Por que você não entra você mesma?"', vai:'c11_sabrina_porque'},
    {texto:'"Há quanto tempo você ouve isso?"', vai:'c11_sabrina_quanto_tempo'},
    {texto:'"Me ajuda a entrar."', vai:'c11_sabrina_ajuda'}
  ]
},

c11_sabrina_oque:{
  texto:[
    '"Doze."',
    'Ela diz o número devagar, do jeito que se diz número que se contou muitas vezes.',
    '"Doze mentes que acham que são uma."',
    '"Eles não sabem que são doze. Cada um acha que é o único, e que os outros onze são lembrança dele mesmo."',
    '"Imagina acordar e achar que todo mundo que você ouve é você lembrando de coisas que você fez. Não dá medo. Dá solidão de um tipo que não existe nome."',
    'Ela mexe na garrafa de água sem beber.',
    '"E tem uma décima terceira coisa lá que não é mente. Que é... molde. Como uma forma de gelatina."',
    '"Eles estão sendo despejados nela um por um, e nenhum preenche, e aí esvaziam e tentam o próximo."',
    'Silêncio.',
    '"Eu já disse isso em voz alta pra três pessoas. Você é a primeira que não me perguntou se eu tenho dormido bem."'
  ],
  ef:{flag:'sabe_dos_doze',
      moral:-8,
      registrar:'São doze: onze mentes que se acham uma só, e um molde que nenhuma preenche.',
      presagio:'Solidão sem nome. É essa a palavra que falta no laudo de todo mundo nesse capítulo.'},
  escolhas:[
    {texto:'"Por que você não entra você mesma?"', vai:'c11_sabrina_porque'},
    {texto:'"Há quanto tempo você ouve isso?"', vai:'c11_sabrina_quanto_tempo'},
    {texto:'"Eles sabem que você está ouvindo?"', vai:'c11_eles_sabem'},
    {texto:'"Me ajuda a entrar."', vai:'c11_sabrina_ajuda'}
  ]
},

c11_eles_sabem:{
  texto:[
    '"Eles sabem que você está ouvindo?"',
    'Ela demora tanto pra responder que você acha que ela não vai.',
    '"Sabem."',
    '"E?"',
    '"E eles falam comigo." Ela encolhe os ombros, e é o gesto mais humano que ela faz na conversa inteira. "Não em palavra. Eles não têm palavra."',
    '"É uma pressão. Uma pressão específica, três vezes por dia, sempre no mesmo horário, e eu levei duas semanas pra entender o que era."',
    '"E o que era?"',
    '"Eles estão me cumprimentando."',
    'Ela olha o teto do ginásio.',
    '"Três vezes por dia. De manhã, de tarde e de noite. Doze coisas num tanque cumprimentando a única pessoa que responde, e eu tranquei um ginásio de Liga porque eu não aguento mais dar bom dia."'
  ],
  ef:{flag:['sabe_do_cumprimento','sabrina_quebrada'],
      moral:-12,
      rep:{eixo:'bom',delta:2,motivo:'Perguntou a coisa que ninguém tinha perguntado'},
      registrar:'Os onze cumprimentam Sabrina três vezes por dia. Foi por isso que ela fechou o ginásio.',
      presagio:'Ela não aguenta dar bom dia. Não é o horror que quebra as pessoas — é a educação.'},
  escolhas:[
    {texto:'"Então responde. Uma última vez, comigo aqui."', vai:'c11_responde_com_ela'},
    {texto:'"Por que você não entra você mesma?"', vai:'c11_sabrina_porque'},
    {texto:'"Me ajuda a entrar."', vai:'c11_sabrina_ajuda'},
    {texto:'Não dizer nada.', vai:'c11_silencio_com_sabrina'}
  ]
},

c11_responde_com_ela:{
  texto:[
    '"Então responde. Uma última vez, comigo aqui."',
    'Ela olha pra você como se você tivesse proposto uma coisa fisicamente impossível, e depois entende que você está propondo companhia, não coragem.',
    '"Você não vai ouvir nada."',
    '"Eu sei."',
    'Ela fecha os olhos.',
    'Você não ouve nada. Você olha uma mulher de vinte e poucos anos sentada de pernas cruzadas no meio de uma arena vazia, de olhos fechados, por uns quarenta segundos.',
    'No fim ela solta o ar.',
    'E a arquibancada inteira estala ao mesmo tempo — cento e vinte assentos de plástico, um estalo só, como se cento e vinte pessoas tivessem se mexido juntas.',
    'Você sente o cabelo do braço subir.',
    '"Eles agradeceram", ela diz, com os olhos ainda fechados. "Todos os onze, ao mesmo tempo, pela primeira vez em três semanas."',
    '"Porque tinha mais alguém na sala."'
  ],
  ef:{flag:['respondeu_com_sabrina','sabrina_aliada'],
      npc:{nome:'Sabrina', opiniao:8, memoria:'Você sentou com ela enquanto ela respondia aos onze pela última vez.'},
      rep:{eixo:'bom',delta:4,motivo:'Ficou na sala com alguém que estava sozinha há três semanas'},
      moral:15,
      registrar:'Sentou com Sabrina enquanto ela respondia aos onze. Os onze agradeceram.',
      presagio:'Porque tinha mais alguém na sala. É essa a diferença que você faz nesse capítulo.'},
  escolhas:[
    {texto:'"Me ajuda a entrar."', vai:'c11_sabrina_ajuda'},
    {texto:'"Por que você não entra você mesma?"', vai:'c11_sabrina_porque'},
    {texto:'Ficar em silêncio com ela um tempo.', vai:'c11_silencio_com_sabrina'},
    {texto:'"Há quanto tempo você ouve isso?"', vai:'c11_sabrina_quanto_tempo'}
  ]
},

c11_silencio_com_sabrina:{
  texto:[
    'Você senta no piso emborrachado a uns dois metros dela e não fala nada.',
    'Ela também não.',
    'Ficam assim um tempo que você não mede, numa arena vazia com a iluminação de galpão esportivo toda acesa, porque ela não desliga a luz há três semanas e você não vai perguntar por quê.',
    'Em algum momento ela empurra o saco de pão de forma na sua direção com o pé.',
    'Você come duas fatias de pão sem nada, sentado no chão de um ginásio de Liga, ao lado da líder mais forte de Kanto.',
    'Perto do fim ela fala uma coisa só:',
    '"Obrigada por não pensar alto agora."',
    'E você percebe que, pela primeira vez em muito tempo, você não estava pensando em nada.'
  ],
  ef:{flag:'silencio_com_sabrina',
      npc:{nome:'Sabrina', opiniao:5, memoria:'Dividiu pão de forma com você em silêncio no chão da arena.'},
      moral:12, hp:3,
      rep:{eixo:'bom',delta:1,motivo:'Ficou quieto com quem precisava de silêncio'},
      presagio:'Você não estava pensando em nada. Guarde a sensação — vai precisar dela lá embaixo.'},
  escolhas:[
    {texto:'"Me ajuda a entrar."', vai:'c11_sabrina_ajuda'},
    {texto:'"Por que você não entra você mesma?"', vai:'c11_sabrina_porque'},
    {texto:'"O que tem lá?"', vai:'c11_sabrina_oque'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c11_vim_desafiar'}
  ]
},

c11_sabrina_quanto_tempo:{
  texto:[
    '"Há quanto tempo você ouve isso?"',
    '"Vinte e três dias. Com essa gramática quebrada, vinte e três."',
    'Ela levanta um dedo.',
    '"Mas o prédio faz barulho pra mim desde que eu tenho memória."',
    '"Eu cresci em Saffron. Quando eu era criança aquele prédio era um zumbido de fundo, tipo geladeira. Todo mundo que é psíquico em Saffron cresce achando que aquele zumbido é normal."',
    '"Em noventa e seis o zumbido mudou."',
    'Você fica quieto.',
    '"Eu tinha dezesseis. Uma noite o zumbido parou completamente, por umas seis horas, e depois voltou diferente — mais baixo, mais organizado."',
    '"Eu achei que tinha melhorado. Eu comemorei."',
    '"E agora eu sei que o que aconteceu em noventa e seis foi que eles mudaram alguma coisa de lugar."'
  ],
  ef:{flag:['sabe_de_noventa_e_seis','sabrina_desde_crianca'],
      registrar:'Em 1996 o zumbido psíquico da Silph parou por seis horas e voltou diferente.',
      presagio:'Noventa e seis de novo. A porta da face sul foi tapada em noventa e seis.'},
  escolhas:[
    {texto:'"A porta da face sul foi tapada em noventa e seis."', vai:'c11_noventa_e_seis_bate', cond:d=>!!d.flags.sabe_da_porta_fechada},
    {texto:'"Por que você não entra você mesma?"', vai:'c11_sabrina_porque'},
    {texto:'"O que tem lá?"', vai:'c11_sabrina_oque'},
    {texto:'"Me ajuda a entrar."', vai:'c11_sabrina_ajuda'}
  ]
},

c11_noventa_e_seis_bate:{
  texto:[
    '"A porta da face sul foi tapada em noventa e seis."',
    'Ela para de mexer na garrafa.',
    '"Que porta?"',
    'Você conta: três metros, duas folhas, caminhão-baú branco, ambulância, fechada com bloco e rebocada por cima, tinta um tom mais clara, rachadura que solta ar frio.',
    'Ela ouve tudo sem interromper e depois faz uma coisa esquisita: ela ri. Uma vez, curto, sem nenhuma alegria.',
    '"Eu passei sete anos achando que era um sintoma meu."',
    '"Sete anos de médico, de exame, de gente me dizendo pra dormir melhor, e a resposta era uma porta que um pipoqueiro viu fecharem."',
    'Ela levanta pela primeira vez.',
    '"Se fecharam a porta de acesso em noventa e seis e o zumbido mudou em noventa e seis, então o que está lá embaixo hoje entrou antes de noventa e seis."',
    '"E nunca mais saiu."'
  ],
  ef:{flag:['entrou_antes_de_96','sabrina_aliada'],
      npc:{nome:'Sabrina', opiniao:7, memoria:'Você resolveu em dois minutos uma coisa que ela levou sete anos achando que era sintoma dela.'},
      rep:{eixo:'bom',delta:4,motivo:'Juntou o pipoqueiro e a líder de ginásio'},
      instabilidade:1,
      registrar:'O que está no andar 11 entrou antes de 1996 e nunca saiu.',
      presagio:'Nunca mais saiu. Agora some isso com o que está no arquivo morto de Cinnabar.'},
  escolhas:[
    {texto:'"Me ajuda a entrar."', vai:'c11_sabrina_ajuda'},
    {texto:'"Por que você não entra você mesma?"', vai:'c11_sabrina_porque'},
    {texto:'"Vem comigo até a porta."', vai:'c11_sabrina_ate_a_porta'},
    {texto:'"Me deixa desafiar o ginásio antes."', vai:'c11_vim_desafiar'}
  ]
},

c11_sabrina_porque:{
  texto:[
    '"Por que você não entra você mesma?"',
    '"Porque se eu entrar, eu escuto de perto."',
    'Ela fala isso com um medo muito específico, de quem sabe exatamente o que teme e já mediu.',
    '"Eu sou boa nisso. Eu sou a melhor de Kanto nisso, e isso não é vaidade, é diagnóstico."',
    '"Se eu chegar a dez metros dos doze, eu viro a décima terceira."',
    '"Não porque eles vão me atacar. Porque eles vão me cumprimentar de perto, e eu vou responder de perto, e a três semanas de distância eu já perdi duas vezes a noção de qual pensamento é meu."',
    'Ela olha as próprias mãos.',
    '"Você não é psíquico. Você é surdo pra isso."',
    '"É a sua melhor qualidade hoje. Provavelmente é a única vez na vida em que ser surdo pra alguma coisa vai ser a sua melhor qualidade, então aproveita."'
  ],
  ef:{flag:'sabe_porque_sabrina_nao_entra'},
  escolhas:[
    {texto:'"Então me ajuda a entrar."', vai:'c11_sabrina_ajuda'},
    {texto:'"Vem até a porta. Só até a porta."', vai:'c11_sabrina_ate_a_porta'},
    {texto:'"E se eu não voltar?"', vai:'c11_e_se_eu_nao_voltar'},
    {texto:'"O que tem lá?"', vai:'c11_sabrina_oque'}
  ]
},

c11_e_se_eu_nao_voltar:{
  texto:[
    '"E se eu não voltar?"',
    'Ela não te tranquiliza. É a segunda pessoa nesse jogo que não te tranquiliza e as duas são as que mais te ajudaram.',
    '"Aí eu vou saber na hora exata em que acontecer, porque eu vou estar ouvindo, e eu vou ter que decidir se eu desço."',
    '"E eu não sei o que eu vou decidir. Eu queria poder te dizer que eu desço."',
    'Ela pega o cobertor dobrado e desdobra, e dobra de novo, o que é uma coisa que gente faz com as mãos quando não sabe o que fazer com as mãos.',
    '"Eu tenho medo de descobrir que eu não desço."'
  ],
  ef:{flag:'sabrina_tem_medo',
      moral:-5,
      npc:{nome:'Sabrina', opiniao:4, memoria:'Admitiu que tem medo de descobrir que não desceria para te buscar.'},
      rep:{eixo:'bom',delta:1,motivo:'Perguntou a pergunta desconfortável'},
      presagio:'Ela tem medo de descobrir que não desce. Lembre disso no fim do capítulo.'},
  escolhas:[
    {texto:'"Tudo bem. Você já fez muito."', vai:'c11_sabrina_ajuda'},
    {texto:'"Vem até a porta. Só até a porta."', vai:'c11_sabrina_ate_a_porta'},
    {texto:'"Então não desce. Eu não ia querer."', vai:'c11_nao_desce'},
    {texto:'"Me ajuda a entrar."', vai:'c11_sabrina_ajuda'}
  ]
},

c11_nao_desce:{
  texto:[
    '"Então não desce. Eu não ia querer."',
    'Ela levanta a cabeça devagar.',
    '"Você não entendeu. Eu não estou pedindo permissão."',
    '"Eu estou te dizendo que existe uma versão de mim que fica sentada nesse chão ouvindo uma pessoa deixar de ser uma pessoa a quatrocentos metros daqui, e que essa versão de mim é bem provável."',
    'Silêncio longo.',
    '"Mas obrigada. Foi gentil."',
    'E ela guarda isso — dá pra ver ela guardar, literalmente: ela fecha os olhos meio segundo, do jeito de quem arquiva.'
  ],
  ef:{flag:'liberou_a_sabrina',
      npc:{nome:'Sabrina', opiniao:6, memoria:'Você disse que não ia querer que ela descesse. Ela arquivou isso.'},
      moral:8,
      rep:{eixo:'bom',delta:2,motivo:'Tirou um peso de cima de quem já carregava três semanas'},
      presagio:'Ela arquivou. Gente psíquica arquiva o que vai precisar usar.'},
  escolhas:[
    {texto:'"Me ajuda a entrar."', vai:'c11_sabrina_ajuda'},
    {texto:'"Vem até a porta."', vai:'c11_sabrina_ate_a_porta'},
    {texto:'"Me deixa desafiar o ginásio antes."', vai:'c11_vim_desafiar'},
    {texto:'Ficar em silêncio um tempo.', vai:'c11_silencio_com_sabrina'}
  ]
},

c11_vim_desafiar:{
  texto:[
    '"Me deixa desafiar o ginásio."',
    'Ela ri de verdade dessa vez, e a risada é boa e dura dois segundos.',
    '"Tem sete pessoas na minha calçada há dezenove dias e você entra aqui, ouve tudo isso, e ainda pede insígnia."',
    '"Eu tenho sete ginásios."',
    '"Eu sei quantos você tem. Eu sei sem perguntar, o que é chato, e eu peço desculpa por isso."',
    'Ela olha a arena vazia.',
    '"Não hoje. Eu não consigo separar, e se eu não consigo separar eu não consigo lutar sem te machucar de um jeito que não sai."',
    '"Mas eu vou te dizer o que ninguém diz: se você descer naquele prédio e voltar inteiro, você não vai precisar da minha insígnia pra provar nada pra ninguém."',
    '"E eu vou te dar ela do mesmo jeito, porque regra é regra e eu gosto de regra."'
  ],
  ef:{flag:'sabrina_promete_insignia',
      npc:{nome:'Sabrina', opiniao:3, memoria:'Prometeu a insígnia de Saffron se você voltar inteiro do andar 11.'},
      registrar:'Sabrina não luta enquanto não conseguir separar. Prometeu a insígnia se você voltar.',
      presagio:'"Se você voltar inteiro." Reparou que ela disse inteiro e não vivo?'},
  escolhas:[
    {texto:'"Me ajuda a entrar, então."', vai:'c11_sabrina_ajuda'},
    {texto:'"Vem até a porta."', vai:'c11_sabrina_ate_a_porta'},
    {texto:'"O que tem lá?"', vai:'c11_sabrina_oque'},
    {texto:'Sair e ir pra doca.', vai:'c11_doca'}
  ]
},

c11_sabrina_ajuda:{
  texto:[
    'Ela levanta e vai até um armário de metal no canto da arena, desses de vestiário, e tira duas coisas.',
    'A primeira é um crachá. Crachá de manutenção da Silph, vencido em noventa e sete, com foto de um homem de sessenta anos e o nome apagado pelo atrito do bolso.',
    '"Isso era do zelador do prédio. Ele me deu e pediu demissão no mesmo dia, e eu nunca mais vi ele, e eu procurei."',
    '"A catraca deles lê o chip, não a data. Empresa grande nunca limpa a base de crachá — dá trabalho e não dá multa."',
    'A segunda coisa ela não mostra.',
    'Ela encosta dois dedos na sua testa, rápido, antes que você recue.',
    '"Pronto."',
    '"Pronto o quê?"',
    '"Se você ficar sem saber quem você é lá dentro, você vai lembrar de uma coisa idiota e muito específica, e isso vai te trazer de volta."',
    '"Qual coisa?"',
    '"Você vai descobrir. Tem que ser surpresa, senão você fica procurando ela e não funciona."'
  ],
  ef:{flag:['crachas_sabrina','ancora_mental'], itens:{'Full Heal':2,'Crachá de manutenção':1},
      npc:{nome:'Sabrina', opiniao:5, memoria:'Te deu o crachá do zelador e uma âncora mental antes de você descer.'},
      rep:{eixo:'bom',delta:1,motivo:'Conseguiu a confiança da líder de Saffron'},
      registrar:'Recebeu de Sabrina o crachá do zelador e uma âncora mental.',
      presagio:'Uma coisa idiota e muito específica. Você já viveu ela em algum capítulo.'},
  escolhas:[
    {texto:'Ir pra Silph pela recepção.', vai:'c11_recepcao'},
    {texto:'Ir pela doca de carga.', vai:'c11_doca'},
    {texto:'"Vem até a porta comigo."', vai:'c11_sabrina_ate_a_porta'},
    {texto:'Procurar quem trabalha lá antes.', vai:'c11_funcionarios'}
  ]
},

c11_sabrina_ate_a_porta:{
  texto:[
    '"Vem até a porta. Só até a porta."',
    'Ela pensa muito tempo.',
    '"Até a garagem. Da garagem eu fico."',
    'E ela vai.',
    'Sabrina de Saffron atravessa dois quarteirões com você às nove da noite, de moletom, com os sete acampados da calçada olhando de boca aberta, e um deles filma com uma câmera descartável e você sabe que essa foto vai circular.',
    'Na rampa da garagem ela para na linha amarela do piso e não passa.',
    '"Aqui."',
    'Ela está branca. Tem suor na linha do cabelo e faz vinte e dois graus.',
    '"Daqui eu ouço eles falando entre si e não comigo, e isso é o máximo que eu consigo sem parar de ser eu."',
    'Ela te dá as costas e senta na guia, de frente pra rua, de costas pro prédio.',
    '"Eu fico. Até você sair ou até amanhecer."'
  ],
  ef:{flag:['sabrina_na_garagem','tem_quem_espera'],
      npc:{nome:'Sabrina', opiniao:8, memoria:'Atravessou dois quarteirões e sentou na rampa da garagem da Silph esperando você sair.'},
      rep:{eixo:'bom',delta:3,motivo:'Tirou a líder de Saffron de dentro do ginásio pela primeira vez em três semanas'},
      moral:12,
      registrar:'Sabrina esperou na rampa da garagem, de costas para o prédio.',
      presagio:'De costas pro prédio. Ela não quer ver, mas ficou.'},
  escolhas:[
    {texto:'Entrar pela garagem.', vai:'c11_garagem'},
    {texto:'Entrar pela doca.', vai:'c11_doca'},
    {texto:'Entrar pela recepção.', vai:'c11_recepcao'},
    {texto:'Sentar com ela um minuto antes.', vai:'c11_silencio_com_sabrina'}
  ]

},

/* ─────────────── QUEM TRABALHA LÁ ─────────────── */

c11_funcionarios:{
  texto:[
    'A fila da lanchonete em frente à Silph, doze e quinze.',
    'Quarenta pessoas de crachá, camisa por dentro, sapato social gasto no calcanhar. Prato feito a mil e duzentos, suco incluso.',
    'Ninguém fala de trabalho. Isso é normal — ninguém fala de trabalho no almoço.',
    'O que não é normal é que ninguém fala do prédio.',
    'Gente de escritório reclama do prédio. Do ar-condicionado, do elevador, do café, da faxina, da cadeira. É o assunto universal de escritório do mundo inteiro.',
    'Quarenta pessoas em fila, quarenta e cinco minutos, zero reclamação predial.',
    'Uma mulher de uns trinta anos, sozinha, come em pé olhando o celular, encostada na grade. Crachá azul.',
    'Todos os outros são brancos.'
  ],
  ef:{flag:'viu_a_fila',
      presagio:'Zero reclamação predial em quarenta pessoas. Isso é treinamento, não é acaso.'},
  escolhas:[
    {texto:'Ouvir a fila em silêncio por meia hora.', vai:'c11_fila'},
    {texto:'Puxar conversa com a do crachá azul.', vai:'c11_cracha_azul'},
    {texto:'Procurar quem limpa o prédio, não quem trabalha nele.', vai:'c11_terceirizado'},
    {texto:'Ir pro bar depois do expediente.', vai:'c11_bar'}
  ]
},

c11_fila:{
  texto:[
    'Você fica meia hora ouvindo, encostado na parede da lanchonete como quem espera alguém.',
    'Colhe quatro coisas.',
    '— Crachá branco vai até o andar 8. Crachá azul vai até o 10. Não existe crachá pra além do 10 e ninguém acha isso estranho.',
    '— O elevador de serviço não tem botão pro subsolo 4, mas a escada de incêndio tem o patamar, e todo mundo sabe porque todo mundo faz o treinamento de brigada de incêndio uma vez por ano e desce a escada inteira.',
    '— Toda quinta-feira, dezenove horas, sobe uma entrega pela doca que o administrativo não registra. Quem trabalha até tarde na quinta vê e ninguém pergunta.',
    '— E a quarta coisa, que ninguém falou e que você percebeu: em meia hora, três pessoas diferentes olharam o relógio e foram embora antes de terminar de comer.',
    'Todas as três às doze e quarenta e um.',
    'Não às doze e quarenta. Não às doze e quarenta e cinco. Doze e quarenta e um, três pessoas, três mesas diferentes.',
    'Hoje é quinta.'
  ],
  ef:{flag:['sabe_dos_crachas','sabe_da_quinta','sabe_do_andar_11','sabe_do_doze_quarenta_e_um'],
      rep:{eixo:'bom',delta:2,motivo:'Ficou meia hora ouvindo em vez de perguntar'},
      registrar:'Crachá branco vai até o 8, azul até o 10; entrega não registrada toda quinta às 19h.',
      presagio:'Doze e quarenta e um. Três pessoas. Guarde o minuto.'},
  escolhas:[
    {texto:'Falar com a mulher do crachá azul.', vai:'c11_cracha_azul'},
    {texto:'Seguir as três que saíram às 12h41.', vai:'c11_seguiu_as_tres'},
    {texto:'Procurar quem limpa o prédio.', vai:'c11_terceirizado'},
    {texto:'Ir pra doca de carga.', vai:'c11_doca'}
  ]
},

c11_seguiu_as_tres:{
  texto:[
    'Você segue as três no dia seguinte. É mais fácil do que devia ser, porque elas não estão se escondendo de nada.',
    'Às doze e quarenta e um, as três saem da lanchonete, atravessam a rua e entram na Silph pela recepção.',
    'Às doze e quarenta e quatro, as três estão na fila do elevador.',
    'Às doze e quarenta e seis, as três sobem juntas.',
    'Você não pode seguir mais. Mas você fica no saguão, na cadeira de visitante, com um crachá de visitante que a recepcionista te deu sem drama porque você disse que estava esperando alguém.',
    'E você conta os andares no display do elevador.',
    'Ele sobe até o 9 e para. E desce.',
    'Sobe até o 9 e desce, três vezes, ao longo da tarde.',
    'O andar 9 é onde se assina requisição de material biológico.',
    'E três pessoas sobem lá todo dia às doze e quarenta e seis, no horário de almoço, sem crachá azul.'
  ],
  ef:{flag:['sabe_do_nono','sabe_do_ritual'],
      rep:{eixo:'bom',delta:3,motivo:'Seguiu um horário estranho até descobrir o que ele era'},
      registrar:'Três funcionários de crachá branco sobem ao 9º andar todo dia às 12h46.',
      presagio:'Todo dia, no horário de almoço, no andar onde se assina requisição. Não é reunião.'},
  escolhas:[
    {texto:'Perguntar pra do crachá azul o que tem no 9.', vai:'c11_cracha_azul'},
    {texto:'Subir pro 9 de qualquer jeito.', vai:'c11_recepcao'},
    {texto:'Procurar quem limpa o prédio.', vai:'c11_terceirizado'},
    {texto:'Ir pra doca de carga.', vai:'c11_doca'}
  ]
},

c11_terceirizado:{
  texto:[
    'Você procura a entrada de serviço, e a entrada de serviço é sempre a mesma coisa em todo prédio de todo lugar do mundo: uma porta lateral, sem placa, ao lado da lixeira.',
    'Às seis da manhã saem quatorze pessoas de uniforme verde-água com o nome de uma empresa que não é a Silph: **LIMPTOTAL SERVIÇOS**.',
    'Terceirizadas. Elas não constam na folha da Silph, não aparecem na fila da lanchonete das doze e quinze, não têm crachá azul nem branco.',
    'Elas têm um crachá verde.',
    'E crachá verde abre tudo.',
    'Porque alguém tem que limpar tudo, e ninguém faz um crachá especial de faxina por andar, porque isso dobra o custo do contrato.',
    'Você espera na esquina e fala com a última a sair, uma senhora de uns sessenta anos com sacola de pano.',
    'Ela te ouve inteiro antes de responder, o que é raro.',
    '"O subsolo quatro a gente não limpa."'
  ],
  ef:{flag:['achou_as_terceirizadas','sabe_do_cracha_verde'],
      npc:{nome:'Sra. Lemos (Limptotal)', opiniao:1, memoria:'Faxineira terceirizada da Silph; te disse que o subsolo 4 não é limpo por elas.'},
      rep:{eixo:'bom',delta:3,motivo:'Procurou quem tem acesso em vez de quem tem cargo'},
      registrar:'As terceirizadas da limpeza têm crachá verde que abre tudo — menos o subsolo 4.',
      presagio:'O crachá verde abre tudo. E o subsolo 4 é o único lugar que elas não limpam.'},
  escolhas:[
    {texto:'"Quem limpa o subsolo quatro, então?"', vai:'c11_quem_limpa'},
    {texto:'"Me empresta o crachá."', vai:'c11_pediu_o_cracha'},
    {texto:'"Tem mais alguma coisa estranha no prédio?"', vai:'c11_estranho_no_predio'},
    {texto:'Agradecer e ir pra doca.', vai:'c11_doca'}
  ]
},

c11_quem_limpa:{
  texto:[
    '"Quem limpa o subsolo quatro, então?"',
    '"Eles."',
    '"Eles quem?"',
    '"Os de jaleco. Eles mesmos."',
    'Ela ajeita a sacola de pano no ombro.',
    '"Desce o carrinho de material deles pelo elevador de carga, na sexta de manhã, sempre. Detergente enzimático, desinfetante de hospital, saco branco de resíduo infectante."',
    '"Saco branco, meu filho. Saco branco é resíduo de hospital. Eu trabalhei doze anos em hospital antes disso."',
    '"E eles sobem o carrinho de volta com o saco cheio e a gente nem toca."',
    'Ela olha o prédio.',
    '"Eu limpo escritório há trinta e um anos. Quem limpa a própria sujeira num prédio grande é porque não quer que ninguém veja a sujeira."'
  ],
  ef:{flag:['sabe_do_saco_branco','sabe_do_residuo'],
      moral:-8,
      rep:{eixo:'bom',delta:2,motivo:'Continuou perguntando pra quem sabia'},
      npc:{nome:'Sra. Lemos (Limptotal)', opiniao:4, memoria:'Te explicou o que é saco branco de resíduo infectante e o que ele quer dizer.'},
      registrar:'No subsolo 4 os próprios cientistas limpam, com desinfetante de hospital e saco de resíduo infectante.',
      presagio:'Resíduo infectante, toda sexta de manhã. Alguma coisa produz resíduo lá embaixo, semanalmente.'},
  escolhas:[
    {texto:'"Me empresta o crachá."', vai:'c11_pediu_o_cracha'},
    {texto:'"Tem mais alguma coisa estranha?"', vai:'c11_estranho_no_predio'},
    {texto:'Ir pra doca de carga.', vai:'c11_doca'},
    {texto:'Ir contar isso pra Sabrina.', vai:'c11_ginasio'}
  ]
},

c11_estranho_no_predio:{
  texto:[
    '"Tem mais alguma coisa estranha?"',
    'Ela ri. "Tem a sala vazia."',
    '"No sétimo andar tem uma sala que a gente limpa toda segunda, quarta e sexta, e que não tem nada dentro. Nada. Piso, parede, teto, uma tomada."',
    '"E a gente limpa porque está no roteiro, e o roteiro tem trinta anos, e ninguém tira sala de roteiro de limpeza porque dá trabalho de mexer no contrato."',
    '"E por que é estranho?"',
    '"Porque suja."',
    'Ela para de andar.',
    '"Uma sala trancada, sem móvel, sem gente, suja. Toda semana. Pó no chão, marca de pé no pó."',
    '"Eu já limpei sala de defunto, sala de arquivo morto, sala de gerador. Nenhuma suja."',
    '"Essa suja."'
  ],
  ef:{flag:['sabe_da_sala_vazia','sala_do_setimo'],
      rep:{eixo:'bom',delta:2,motivo:'Perguntou mais uma vez e ganhou a melhor pista do capítulo'},
      instabilidade:1,
      registrar:'No 7º andar há uma sala vazia e trancada que suja toda semana, com marca de pé no pó.',
      presagio:'Marca de pé no pó de uma sala trancada e vazia. Alguém anda ali.'},
  escolhas:[
    {texto:'"Me empresta o crachá."', vai:'c11_pediu_o_cracha'},
    {texto:'Ir pra recepção e subir pro sétimo.', vai:'c11_recepcao'},
    {texto:'Ir pra doca.', vai:'c11_doca'},
    {texto:'Ir contar pra Sabrina.', vai:'c11_ginasio'}
  ]
},

c11_pediu_o_cracha:{
  texto:['"Me empresta o crachá."'],
  teste:{status:'carisma', dificuldade:8, nomeStatus:'Carisma',
         critico:'c11_cida_topou', sucesso:'c11_cida_topou', parcial:'c11_cida_meio', falha:'c11_cida_nao'}
},

c11_cida_topou:{
  texto:[
    'Ela olha o crachá verde pendurado no pescoço dela por um tempo.',
    '"Eu me aposento em quatorze meses."',
    '"Eu sei. Desculpa."',
    '"Não pediu desculpa não. Quem pede desculpa antes já sabe que tá pedindo coisa demais e mesmo assim pede, e isso é pior."',
    'Ela tira o crachá pelo pescoço.',
    '"Amanhã eu falo que perdi. Eu já perdi dois em trinta e um anos, eles dão bronca e fazem outro em três dias."',
    'Ela põe na sua mão e fecha os seus dedos por cima, do jeito que avó faz com dinheiro.',
    '"Verde abre tudo menos o subsolo quatro. E no subsolo quatro o que você precisa não é de crachá."',
    '"Do que eu preciso?"',
    '"De alguém abrindo por dentro, meu filho. Sempre é."'
  ],
  ef:{flag:['tem_cracha_verde','dentro_da_silph'],
      itens:{'Crachá verde (Limptotal)':1},
      npc:{nome:'Sra. Lemos (Limptotal)', opiniao:6, memoria:'Te emprestou o crachá verde dela a quatorze meses da aposentadoria.'},
      rep:{eixo:'bom',delta:2,motivo:'Alguém arriscou a aposentadoria por você'},
      registrar:'Sra. Lemos te emprestou o crachá verde. Ele abre tudo menos o subsolo 4.',
      presagio:'"De alguém abrindo por dentro." Anota — essa é a solução do capítulo.'},
  escolhas:[
    {texto:'Entrar pela recepção com o crachá verde.', vai:'c11_recepcao'},
    {texto:'Entrar pela porta de serviço às seis da manhã.', vai:'c11_porta_de_servico'},
    {texto:'Ir pra doca de carga.', vai:'c11_doca'},
    {texto:'Ir ver a sala vazia do sétimo.', vai:'c11_sala_vazia', cond:d=>!!d.flags.sabe_da_sala_vazia}
  ]
},

c11_cida_meio:{
  texto:[
    '"Não."',
    'Ela ajeita a sacola e começa a andar, e depois para.',
    '"Mas escuta uma coisa: sexta de manhã, seis e dez, o pessoal da carga abre a porta de serviço pra entrar o material e ela fica encostada uns quarenta minutos porque eles são preguiçosos e o trinco é duro."',
    '"Encostada. Não trancada."',
    '"E eu não falei nada disso pra você."',
    'Ela vai embora sem olhar pra trás, e no fim da rua levanta a mão, sem virar, como quem se despede de alguém que não está olhando.'
  ],
  ef:{flag:['sabe_da_porta_encostada','dentro_da_silph'],
      npc:{nome:'Sra. Lemos (Limptotal)', opiniao:3, memoria:'Não emprestou o crachá, mas te contou da porta de serviço encostada na sexta de manhã.'},
      registrar:'A porta de serviço da Silph fica encostada das 6h10 às 6h50 nas sextas.',
      presagio:'Ela não falou nada. E levantou a mão sem virar.'},
  escolhas:[
    {texto:'Entrar pela porta de serviço na sexta.', vai:'c11_porta_de_servico'},
    {texto:'Ir pra doca de carga.', vai:'c11_doca'},
    {texto:'Ir pra recepção.', vai:'c11_recepcao'},
    {texto:'Ir falar com a do crachá azul.', vai:'c11_cracha_azul'}
  ]
},

c11_cida_nao:{
  texto:[
    '"Não."',
    'Sem explicação, sem raiva, sem desculpa.',
    '"Eu tenho quatorze meses. Eu criei três filho com esse crachá."',
    'E vai embora, e você fica na esquina às seis e vinte da manhã com absolutamente nenhum direito de achar isso injusto.'
  ],
  ef:{flag:'cida_recusou',
      npc:{nome:'Sra. Lemos (Limptotal)', opiniao:0, memoria:'Recusou emprestar o crachá. Faltavam quatorze meses para a aposentadoria dela.'},
      presagio:'Ela criou três filhos com aquele crachá. Você ia trocar isso por uma noite.'},
  escolhas:[
    {texto:'Ir pra doca de carga.', vai:'c11_doca'},
    {texto:'Ir pra recepção.', vai:'c11_recepcao'},
    {texto:'Ir falar com a do crachá azul.', vai:'c11_cracha_azul'},
    {texto:'Ir ao ginásio falar com a Sabrina.', vai:'c11_ginasio'}
  ]
},

c11_bar:{
  texto:[
    'O bar fica na esquina de trás e se chama Ponto Certo, e às seis e meia da tarde ele recebe a primeira leva de crachás pendurados no pescoço.',
    'Você senta no balcão com um refrigerante e ouve.',
    'Na terceira rodada da mesa dos fundos, um homem de uns cinquenta anos com cara de quem trabalha ali desde sempre começa a falar mais alto do que devia.',
    '"...porque projeto de nove meses é projeto. Projeto de seis anos é outra coisa."',
    'Alguém manda ele baixar a voz. Ele não baixa.',
    '"Seis anos, cara. Seis anos e a rubrica é sempre a mesma: “desenvolvimento de dispositivo de contenção”. Dispositivo de contenção."',
    '"Eu faço orçamento. Eu não faço bicho, eu não faço tanque, eu faço planilha."',
    '"E eu sei que dispositivo de contenção que custa quatro milhões por ano por seis anos não é dispositivo."',
    'A mesa fica em silêncio e ele mesmo entende que falou demais, e pede a conta, e vai embora.'
  ],
  ef:{flag:['sabe_dos_seis_anos','sabe_do_orcamento'],
      rep:{eixo:'bom',delta:2,motivo:'Ficou no bar ouvindo em vez de perguntar'},
      registrar:'A rubrica "desenvolvimento de dispositivo de contenção" custa quatro milhões por ano há seis anos.',
      presagio:'Seis anos. Não é um projeto que começou ontem — é um que não consegue terminar.'},
  escolhas:[
    {texto:'Seguir o homem do orçamento.', vai:'c11_seguiu_o_orcamento'},
    {texto:'Falar com a do crachá azul.', vai:'c11_cracha_azul'},
    {texto:'Ir pra doca.', vai:'c11_doca'},
    {texto:'Ir ao ginásio.', vai:'c11_ginasio'}
  ]
},

c11_seguiu_o_orcamento:{
  texto:[
    'Você sai atrás dele e alcança no ponto de ônibus.',
    'Ele te vê chegando e a cara dele muda antes de você falar qualquer coisa, e ele fala primeiro:',
    '"Eu bebi três chopes e falei besteira. Não tem história aqui."',
    '"Eu não perguntei nada."',
    '"Então não pergunta."',
    'O ônibus dele demora oito minutos. Vocês ficam os oito minutos em silêncio, lado a lado, e no minuto sete ele fala sem olhar pra você:',
    '"Seis anos atrás a rubrica tinha outro nome. “Recuperação de acervo — Cinnabar”."',
    '"Mudou pra dispositivo de contenção em noventa e seis e o valor triplicou no mesmo ano."',
    'O ônibus encosta.',
    '"Eu tenho dezenove anos de casa e três anos pra aposentar. Boa noite."'
  ],
  ef:{flag:['sabe_de_cinnabar','sabe_do_acervo'],
      rep:{eixo:'bom',delta:3,motivo:'Esperou oito minutos em silêncio e recebeu o nome anterior da rubrica'},
      npc:{nome:'Homem do orçamento', opiniao:1, memoria:'Te contou que a rubrica se chamava "Recuperação de acervo — Cinnabar" antes de 1996.'},
      registrar:'A rubrica era "Recuperação de acervo — Cinnabar" e virou "dispositivo de contenção" em 1996, triplicando de valor.',
      presagio:'Cinnabar. O laboratório da ilha. Guarde — o capítulo dele vem.'},
  escolhas:[
    {texto:'Ir pra doca de carga.', vai:'c11_doca'},
    {texto:'Falar com a do crachá azul.', vai:'c11_cracha_azul'},
    {texto:'Ir contar pra Sabrina.', vai:'c11_ginasio'},
    {texto:'Ir pra recepção.', vai:'c11_recepcao'}
  ]
},

c11_cracha_azul:{
  texto:[
    'Ela te ouve sem olhar, do jeito que se ouve pedinte em semáforo.',
    'Quando você diz "andar onze", ela levanta a cabeça.',
    '"Quem te falou disso?"',
    'Você responde. Ela ouve, fecha o celular, olha pros dois lados da rua, e fala muito baixo e muito rápido — do jeito de quem já ensaiou essa conversa sozinha no chuveiro.',
    '"Eu trabalho no 9. Eu assino requisição de material biológico."',
    '"Eu assino há dois anos. Eu assinei quatrocentas e onze requisições e eu nunca vi o material."',
    '"Eu recebo uma planilha, eu confiro se o código bate com a nota, eu assino. Isso é o meu trabalho inteiro e eu ganho bem pra isso."',
    'Ela olha o prédio.',
    '"Eu não sou heroína. Eu tenho filho de quatro anos e financiamento de trinta e cinco anos."',
    '"Mas eu vou te falar uma coisa e depois vou embora e a gente nunca se viu."',
    '"O 11 não fica em cima do 10."',
    '"Fica embaixo do subsolo. Chamaram de 11 porque era o próximo número disponível na planilha de centro de custo."'
  ],
  ef:{flag:['sabe_onde_e_o_11','sabe_do_andar_11'],
      npc:{nome:'Marina (crachá azul)', opiniao:2, memoria:'Te contou onde fica o andar 11 e pediu para nunca ter acontecido.'},
      rep:{eixo:'bom',delta:1,motivo:'Alguém decidiu falar com você'},
      registrar:'O "andar 11" da Silph fica abaixo do subsolo. O nome vem de um número de centro de custo.',
      presagio:'O nome mais assustador de Kanto é um número de planilha. É sempre assim.'},
  escolhas:[
    {texto:'"O que você assina, exatamente?"', vai:'c11_o_que_ela_assina'},
    {texto:'"Me leva até a porta."', vai:'c11_marina_leva'},
    {texto:'"Obrigado. Some daqui."', vai:'c11_protegeu_marina'},
    {texto:'"Assina uma requisição pra mim."', vai:'c11_requisicao'}
  ]
},

c11_o_que_ela_assina:{
  texto:[
    '"O que você assina, exatamente?"',
    'Ela hesita, e depois tira o celular do bolso e abre a foto de uma tela de sistema — ela fotografa o sistema, o que quer dizer que ela já vinha juntando material sozinha faz tempo.',
    '"Código 4471-B. Descrição: “espécime metamórfico, lote semanal, sete unidades”."',
    '"Espécime metamórfico é Ditto. É a única coisa em Kanto que é classificada assim."',
    '"Sete por semana. Há dois anos."',
    'Você faz a conta em voz alta e a conta é setecentos e vinte e oito.',
    '"Setecentos e vinte e oito", ela repete. "Eu faço essa conta toda noite desde que eu percebi."',
    '"E onde eles estão?"',
    '"Essa é a parte." Ela guarda o celular. "Não tem código de saída. Nenhum. Em dois anos, nem um único registro de saída, de baixa, de óbito, de transferência."',
    '"Setecentos e vinte e oito entraram e a planilha nunca fechou nenhum."'
  ],
  ef:{flag:['sabe_dos_setecentos','sabe_dos_dittos'],
      moral:-12, instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Fez a conta junto com quem assinava'},
      npc:{nome:'Marina (crachá azul)', opiniao:4, memoria:'Dividiu com você a conta que ela refazia toda noite: 728.'},
      registrar:'728 Dittos entraram na Silph em dois anos. Nenhum registro de saída.',
      presagio:'Setecentos e vinte e oito. E no andar onze tem doze tanques.'},
  escolhas:[
    {texto:'"Me leva até a porta."', vai:'c11_marina_leva'},
    {texto:'"Assina uma requisição pra mim."', vai:'c11_requisicao'},
    {texto:'"Me manda as fotos do sistema."', vai:'c11_fotos_do_sistema'},
    {texto:'"Obrigado. Some daqui."', vai:'c11_protegeu_marina'}
  ]
},

c11_fotos_do_sistema:{
  texto:[
    '"Me manda as fotos do sistema."',
    '"Eu não posso mandar nada de mim pra você."',
    '"Então imprime."',
    'Ela fica quieta uns cinco segundos.',
    '"Impressora do nono anda com marca d’água de matrícula. Sai o meu número em cada folha."',
    'E aí ela faz uma coisa que você não esperava: ela dá de ombros.',
    '"Foda-se. Eu já assinei quatrocentas e onze."',
    'No dia seguinte, dezoito e cinquenta, ela passa por você na calçada sem parar e encosta um envelope pardo na sua mão sem olhar.',
    'Dezenove folhas. Marca d’água com a matrícula dela em todas.',
    'Ela assinou tudo isso de novo, de propósito, com o nome dela em cada página.'
  ],
  ef:{flag:['tem_as_planilhas','provas_do_11'],
      itens:{'Planilhas do nono andar':1},
      npc:{nome:'Marina (crachá azul)', opiniao:8, memoria:'Imprimiu dezenove folhas com a marca d’água da matrícula dela e te entregou na rua.'},
      rep:{eixo:'bom',delta:4,motivo:'Alguém pôs o próprio nome em dezenove folhas por você'},
      registrar:'Recebeu dezenove folhas do sistema da Silph, com a matrícula da Marina em cada uma.',
      presagio:'A matrícula dela em cada página. Isso não é prova contra a Silph — é prova contra ela.'},
  escolhas:[
    {texto:'"Me leva até a porta."', vai:'c11_marina_leva'},
    {texto:'"Tira o seu nome disso. Eu devolvo."', vai:'c11_devolveu_as_folhas'},
    {texto:'Ir pra doca com as folhas.', vai:'c11_doca'},
    {texto:'Ir pra recepção.', vai:'c11_recepcao'}
  ]
},

c11_devolveu_as_folhas:{
  texto:[
    'Você devolve o envelope no dia seguinte, no mesmo lugar, do mesmo jeito.',
    'Ela para de andar, o que ela não tinha feito nem na primeira vez.',
    '"Por quê?"',
    '"Porque isso aí prova que você assinou. Não prova que eles fizeram."',
    'Ela abre o envelope e olha as dezenove folhas e a marca d’água com o número dela em cada uma, e você vê o momento exato em que ela entende.',
    '"Ah."',
    '"É."',
    'Ela guarda o envelope na bolsa, com cuidado, e fica parada na calçada por um tempo.',
    '"Eu ia mandar isso pra Liga na segunda."',
    '"Eu sei."',
    '"E eles iam abrir processo contra mim."',
    '"Iam."',
    'Ela ajeita a alça da bolsa no ombro.',
    '"Me arruma um jeito que preste, então. Eu faço. Mas me arruma um que preste."'
  ],
  ef:{flag:['protegeu_marina','marina_aliada'],
      perdeItens:{'Planilhas do nono andar':1},
      npc:{nome:'Marina (crachá azul)', opiniao:10, memoria:'Você devolveu as folhas para não queimá-la. Ela topou fazer de novo, do jeito certo.'},
      rep:{eixo:'bom',delta:5,motivo:'Devolveu a prova para proteger quem te deu'},
      moral:15,
      registrar:'Devolveu as planilhas para não incriminar a Marina. Ela continua disposta.',
      presagio:'"Me arruma um jeito que preste." Ela vai cumprir. Você é que vai ter que arrumar.'},
  escolhas:[
    {texto:'"Me leva até a porta."', vai:'c11_marina_leva'},
    {texto:'"Assina uma requisição pra mim."', vai:'c11_requisicao'},
    {texto:'Ir pra doca.', vai:'c11_doca'},
    {texto:'Ir pra recepção.', vai:'c11_recepcao'}
  ]
},

c11_requisicao:{
  texto:[
    '"Assina uma requisição pra mim."',
    '"Uma requisição de quê?"',
    '"De acesso. Vocês não requisitam material biológico? Requisita uma inspeção."',
    'Ela abre a boca pra dizer que isso não existe, e fecha.',
    '"Existe."',
    '"Existe?"',
    '"Existe o formulário de “verificação física de lote”. Ninguém usa há anos porque ninguém quer descer, mas ele existe no sistema e ele é assinado pelo nono andar."',
    'Ela ri, e é uma risada meio histérica de quem não dorme direito.',
    '"Eu posso te credenciar como técnico auxiliar de verificação."',
    '"E eles vão aceitar?"',
    '"Eles vão aceitar porque está no sistema e porque ninguém vai conferir, exatamente do mesmo jeito que eu assinei setecentas e vinte e oito vezes uma coisa que eu nunca vi."',
    'Ela olha pro chão.',
    '"É o mesmo buraco. Só que agora ele é nosso."'
  ],
  ef:{flag:['tem_credencial_de_verificacao','dentro_da_silph'],
      itens:{'Crachá de verificação física':1},
      npc:{nome:'Marina (crachá azul)', opiniao:9, memoria:'Te credenciou como técnico auxiliar de verificação física de lote.'},
      rep:{eixo:'bom',delta:4,motivo:'Entrou pelo mesmo buraco que fazia o sistema funcionar'},
      registrar:'Foi credenciado no sistema da Silph como técnico auxiliar de verificação física de lote.',
      presagio:'É o mesmo buraco. Só que agora ele é nosso. Frase perigosa e correta.'},
  escolhas:[
    {texto:'Entrar pela recepção com a credencial.', vai:'c11_recepcao'},
    {texto:'"Me leva até a porta também."', vai:'c11_marina_leva'},
    {texto:'Entrar pela doca.', vai:'c11_doca'},
    {texto:'Ir ver a sala vazia do sétimo.', vai:'c11_sala_vazia', cond:d=>!!d.flags.sabe_da_sala_vazia}
  ]
},

c11_protegeu_marina:{
  texto:[
    '"Obrigado. Some daqui."',
    'Ela pisca.',
    '"Como assim?"',
    '"Você já falou. Se você falar mais, alguém lembra que você falou. Vai almoçar em outro lugar essa semana."',
    'Ela não agradece. Ela olha pra você com uma cara difícil de ler e depois vai embora sem dizer mais nada.',
    'Na quarta-feira seguinte ela não está na fila da lanchonete.',
    'Na quinta, também não.',
    'Na sexta, tem um envelope dobrado dentro do seu caderno, dentro da sua mochila, e você não faz ideia de quando ele entrou lá.'
  ],
  ef:{flag:['protegeu_marina','marina_aliada','sabe_onde_e_o_11'],
      itens:{'Envelope sem remetente':1},
      npc:{nome:'Marina (crachá azul)', opiniao:6, memoria:'Você mandou ela sumir antes de ela se queimar. Ela deixou um envelope na sua mochila.'},
      rep:{eixo:'bom',delta:3,motivo:'Protegeu a fonte antes de usar a fonte'},
      registrar:'Marina sumiu da fila do almoço e deixou um envelope na sua mochila.',
      presagio:'Você não sabe quando o envelope entrou ali. Pensa nisso.'},
  escolhas:[
    {texto:'Abrir o envelope.', vai:'c11_envelope'},
    {texto:'Ir pra doca de carga.', vai:'c11_doca'},
    {texto:'Ir pra recepção.', vai:'c11_recepcao'},
    {texto:'Ir ao ginásio.', vai:'c11_ginasio'}
  ]
},

c11_envelope:{
  texto:[
    'Dentro do envelope tem três coisas.',
    'Uma: um crachá de visitante da Silph, em branco, desses que a recepção imprime na hora — mas com o chip já gravado.',
    'Duas: um papel com um horário e uma frase. **"Quinta 19h. A porta de baixo fica aberta 11 segundos. Conta."**',
    'Três: um post-it amarelo colado no papel, com uma letra apressada:',
    '"não me procura mais. eu tenho filho de 4 anos. desculpa. eu fiz o que dava."',
    'Você lê o post-it três vezes.',
    'A pessoa que te ajudou mais nessa cidade te pediu desculpa por não ajudar mais.'
  ],
  ef:{flag:['tem_cracha_visitante','sabe_dos_onze_segundos','dentro_da_silph'],
      itens:{'Crachá de visitante (gravado)':1},
      moral:-5,
      rep:{eixo:'bom',delta:2,motivo:'Recebeu ajuda de quem não devia nada'},
      registrar:'Marina deixou um crachá gravado e o aviso: a porta de baixo fica aberta 11 segundos.',
      presagio:'Onze segundos. Conta. Ela mediu isso pra você.'},
  escolhas:[
    {texto:'Ir pra recepção com o crachá.', vai:'c11_recepcao'},
    {texto:'Ir pra doca de carga na quinta às 19h.', vai:'c11_doca'},
    {texto:'Ir direto pra escada de incêndio.', vai:'c11_escada'},
    {texto:'Ir ao ginásio contar pra Sabrina.', vai:'c11_ginasio'}
  ]
},

c11_marina_leva:{
  texto:[
    'Ela te olha por muito tempo, e dá pra ver ela fazendo contas: filho, financiamento, dois anos de assinatura, quatrocentas e onze folhas.'
  ],
  teste:{status:'carisma', dificuldade:9, nomeStatus:'Carisma',
         critico:'c11_marina_topa', sucesso:'c11_marina_topa', parcial:'c11_marina_meio', falha:'c11_marina_nao'}
},

c11_marina_topa:{
  texto:[
    '"Uma vez."',
    'Ela já está andando antes de terminar a frase, e você tem que correr dois passos pra alcançar.',
    '"Eu te passo pela catraca como visita técnica, te levo até a escada de incêndio e volto pra minha mesa."',
    '"Se te pegarem, eu não te conheço."',
    '"Combinado."',
    'Na catraca ela digita a matrícula dela pra te liberar.',
    'Ela sabe que isso fica registrado. Ela sabe que existe um log com o número dela, a data, a hora e o motivo, e que esse log vai existir pra sempre.',
    'Ela faz mesmo assim.',
    'No corredor do subsolo 1 ela para, aponta a porta corta-fogo, e diz uma coisa só antes de voltar:',
    '"Desce até acabar. Quando a placa parar de ter número, você chegou."'
  ],
  ef:{flag:['entrou_com_marina','dentro_da_silph'],
      npc:{nome:'Marina (crachá azul)', opiniao:5, memoria:'Usou a própria matrícula para te passar pela catraca da Silph.'},
      rep:{eixo:'bom',delta:2,motivo:'Convenceu alguém a arriscar o emprego pelo certo'},
      registrar:'Marina te passou pela catraca com a matrícula dela.',
      presagio:'Existe um log com o número dela. Ele vai existir pra sempre.'},
  escolhas:[
    {texto:'Descer pela escada de incêndio.', vai:'c11_escada'},
    {texto:'Subir pro sétimo ver a sala vazia primeiro.', vai:'c11_sala_vazia', cond:d=>!!d.flags.sabe_da_sala_vazia},
    {texto:'Subir pro nono ver de onde ela assina.', vai:'c11_nono_andar'},
    {texto:'Ir pra doca por dentro.', vai:'c11_doca'}
  ]
},

c11_marina_meio:{
  texto:[
    '"Não."',
    'Ela pega a bolsa.',
    '"Mas eu esqueci meu crachá reserva no bolso desse casaco aqui, que eu vou deixar nessa cadeira, porque eu sou muito distraída e faço isso o tempo todo."',
    'Ela vai embora sem olhar pra trás.',
    'O casaco fica na cadeira da lanchonete. O crachá está no bolso de dentro.',
    'Você espera quatro minutos antes de pegar, porque pegar rápido é o que chama atenção.'
  ],
  ef:{flag:['cracha_roubado','dentro_da_silph'],
      itens:{'Crachá azul reserva':1},
      npc:{nome:'Marina (crachá azul)', opiniao:3, memoria:'Deixou o crachá reserva num casaco para você, sem admitir.'},
      registrar:'Ficou com o crachá azul reserva da Marina.'},
  escolhas:[
    {texto:'Entrar pela recepção.', vai:'c11_recepcao'},
    {texto:'Entrar pela porta de serviço.', vai:'c11_porta_de_servico'},
    {texto:'Ir pra doca.', vai:'c11_doca'},
    {texto:'Devolver o casaco e o crachá.', vai:'c11_protegeu_marina'}
  ]
},

c11_marina_nao:{
  texto:[
    '"Não."',
    'Ela levanta e ajeita a bolsa.',
    '"Eu já falei demais. Boa sorte, sério, e eu digo sério."',
    'Ela vai embora rápido, e na esquina olha pra trás uma vez — não pra você.',
    'Pro prédio.'
  ],
  ef:{flag:'marina_recusou'},
  escolhas:[
    {texto:'Entrar pela recepção.', vai:'c11_recepcao'},
    {texto:'Entrar pela doca.', vai:'c11_doca'},
    {texto:'Procurar quem limpa o prédio.', vai:'c11_terceirizado'},
    {texto:'Ir ao ginásio.', vai:'c11_ginasio'}
  ]

},

/* ─────────────── AS ENTRADAS ─────────────── */

c11_recepcao:{
  texto:[
    'A recepção da Silph tem pé-direito de doze metros, piso de granito polido que reflete o teto, e uma catraca de vidro que abre com crachá e fecha em um segundo e meio.',
    'Atrás do balcão, uma parede inteira com o logotipo em aço escovado. Na frente do balcão, duas poltronas onde ninguém senta porque ninguém espera — quem vem aqui tem hora marcada.',
    'Dois seguranças. Um na porta giratória, um no fundo, perto do elevador.',
    d=>{
      if (d.flags.entrou_com_marina) return 'Marina já te passou. Você está do lado de dentro, com um crachá de visitante e uns quinze minutos de plausibilidade antes de alguém perguntar com quem você tem reunião.';
      if (d.flags.tem_credencial_de_verificacao) return 'Você tem uma credencial de técnico auxiliar de verificação física de lote, emitida pelo nono andar, válida, no sistema. A catraca abre sem hesitar e o segurança do fundo nem levanta a cabeça.';
      if (d.flags.tem_cracha_visitante) return 'O crachá que veio no envelope tem o chip gravado e a catraca não sabe a diferença entre um crachá gravado por um funcionário e um crachá gravado pela recepção.';
      if (d.flags.tem_cracha_verde) return 'O crachá verde da Sra. Lemos abre a catraca no primeiro toque, e o segurança do fundo te olha por meio segundo e desvia. Uniforme de faxina é o melhor camuflado de prédio comercial: ninguém olha duas vezes para quem limpa.';
      if (d.flags.crachas_sabrina) return 'O crachá do zelador é vencido faz três anos, mas a catraca da Silph lê o chip, não a data. Ela abre.';
      if (d.flags.cracha_roubado) return 'O crachá reserva da Marina abre a catraca no primeiro toque.';
      return 'Você não tem crachá. A recepcionista sorri com o sorriso cronometrado e pergunta com quem você tem hora marcada.';
    }
  ],
  ef:{flag:'entrou_na_recepcao'},
  escolhas:[
    {texto:'Descer pela escada de incêndio.', vai:'c11_escada',
     cond:d=>!!(d.flags.entrou_com_marina||d.flags.crachas_sabrina||d.flags.cracha_roubado||d.flags.dentro_da_silph||d.flags.tem_cracha_verde||d.flags.tem_credencial_de_verificacao||d.flags.tem_cracha_visitante)},
    {texto:'Subir pro sétimo ver a sala vazia.', vai:'c11_sala_vazia', cond:d=>!!d.flags.sabe_da_sala_vazia && !!d.flags.dentro_da_silph},
    {texto:'Subir pro nono andar.', vai:'c11_nono_andar', cond:d=>!!d.flags.dentro_da_silph},
    {texto:'Inventar uma reunião.', vai:'c11_inventar'},
    {texto:'Ir pela doca de carga.', vai:'c11_doca'}
  ]
},

c11_inventar:{
  texto:[
    '"Eu tenho reunião no nono andar. Verificação física de lote."',
    'Você escolhe as palavras com cuidado, porque você já ouviu essas palavras de alguém que trabalha lá, e palavra de dentro é o melhor documento falso que existe.'
  ],
  teste:{status:'intelecto', dificuldade:9, nomeStatus:'Intelecto',
         critico:'c11_entrou_blefe', sucesso:'c11_entrou_blefe', parcial:'c11_barrado', falha:'c11_barrado'}
},

c11_entrou_blefe:{
  texto:[
    'Você usou as palavras exatas, na ordem exata, com a segurança de quem já falou isso cem vezes.',
    'A recepcionista digita. Franze a testa por meio segundo — o meio segundo mais longo da sua vida — e depois a impressora cospe um crachá de visitante com a sua foto tirada por uma câmera que você não viu.',
    '"Nono andar. Elevador da direita."',
    'Ela te entrega o crachá e já está olhando pra próxima pessoa.',
    'Você atravessa a catraca de vidro.',
    'E a informação que importa é essa: o elevador da direita passa pelo subsolo.'
  ],
  ef:{flag:['dentro_da_silph','entrou_de_blefe'],
      rep:{eixo:'bom',delta:2,motivo:'Entrou na Silph com uma frase e nada mais'},
      registrar:'Entrou na Silph com um blefe de vocabulário interno.'},
  escolhas:[
    {texto:'Descer no subsolo em vez de subir.', vai:'c11_escada'},
    {texto:'Subir pro nono, já que é pra lá que você disse que ia.', vai:'c11_nono_andar'},
    {texto:'Parar no sétimo e ver a sala vazia.', vai:'c11_sala_vazia', cond:d=>!!d.flags.sabe_da_sala_vazia},
    {texto:'Descer pela garagem.', vai:'c11_garagem'}
  ]
},

c11_barrado:{
  texto:[
    'Ela sorri, digita, e o sorriso não muda nem um milímetro enquanto ela aperta um botão embaixo do balcão.',
    'Nenhum alarme toca. Nenhuma luz acende. Ela continua sorrindo e te oferece uma poltrona.',
    'A segurança chega em quarenta segundos. Dois homens grandes e muito educados, um de cada lado, sem tocar em você.',
    '"O senhor precisa se retirar."',
    'Eles te acompanham até a porta giratória andando no seu ritmo, e o da direita segura a porta, e nenhum dos dois encosta um dedo.',
    'Na calçada, o de sempre: sua mochila inteira, nada revistado, nada perguntado.'
  ],
  ef:{flag:'barrado_na_silph'},
  escolhas:[
    {texto:'Ir pra doca de carga.', vai:'c11_doca'},
    {texto:'Ir pra porta de serviço.', vai:'c11_porta_de_servico'},
    {texto:'Ir pra garagem.', vai:'c11_garagem'},
    {texto:'Reagir.', vai:'c11_reagiu_seguranca'}
  ]
},

c11_reagiu_seguranca:{
  texto:[
    'Você reage no saguão de uma empresa, sob quatro câmeras, num piso de granito polido, na frente de doze funcionários voltando do almoço.',
    'Isso não é uma batalha Pokémon.',
    'É uma ocorrência policial com registro audiovisual, e a diferença entre as duas coisas é a que vai definir os seus próximos capítulos.'
  ],
  batalha:{dex:82, nivel:36, tipo:'treinador', treinador:'Segurança da Silph', fuga:true,
           timeExtra:[{dex:57, nivel:36}],
           vitoria:'c11_venceu_seguranca', derrota:'c11_expulso', fuga2:'c11_doca', gameover:'gameover'}
},

c11_venceu_seguranca:{
  texto:[
    'Você derruba os dois. No saguão. Na frente da recepção, de doze funcionários e de quatro câmeras.',
    'A catraca não te impede — segurança derrubada não tranca porta, e a recepcionista já saiu de trás do balcão pelo lado e está andando muito rápido pro corredor dos fundos.',
    'Você atravessa.',
    'Mas a partir de agora existe um vídeo seu, com data, hora, ângulo de cima e qualidade suficiente pro seu rosto, invadindo uma empresa.',
    'Vídeo é diferente de boato. Vídeo não precisa de ninguém pra contar.'
  ],
  ef:{flag:['dentro_da_silph','video_da_silph'],
      rep:{eixo:'ruim',delta:2,motivo:'Invadiu a Silph à força, gravado por quatro câmeras'},
      instabilidade:1,
      executar:d=>{ d.liga.avisos++; return [{tipo:'liga', texto:'A Silph vai acionar a Liga. Isso é questão de horas.'}]; },
      registrar:'Invadiu o saguão da Silph à força, com vídeo.',
      presagio:'Vídeo não precisa de ninguém pra contar. Isso vale pros dois lados.'},
  escolhas:[
    {texto:'Descer pela escada de incêndio.', vai:'c11_escada'},
    {texto:'Descer pela garagem.', vai:'c11_garagem'},
    {texto:'Subir pro nono primeiro.', vai:'c11_nono_andar'},
    {texto:'Sair. Você já errou o suficiente hoje.', vai:'c11_desistiu'}
  ]
},

c11_expulso:{
  texto:[
    'Eles te tiram do saguão com uma eficiência que sugere prática e um treinamento com apostila.',
    'Você acorda na calçada, sem nada quebrado, com a mochila do lado e o zíper fechado.',
    'A porta de vidro atrás de você reflete a rua inteira e não mostra absolutamente nada do que tem dentro.',
    'Um vendedor de água de coco na esquina te olha e desvia, e você entende que ele já viu isso antes, mais de uma vez.'
  ],
  ef:{hp:-5, causa:'Retirado à força da Silph', flag:'expulso_da_silph', moral:-8},
  escolhas:[
    {texto:'Tentar a doca de carga.', vai:'c11_doca'},
    {texto:'Tentar a porta de serviço.', vai:'c11_porta_de_servico'},
    {texto:'Tentar a garagem.', vai:'c11_garagem'},
    {texto:'Desistir do prédio.', vai:'c11_desistiu'}
  ]
},

c11_porta_de_servico:{
  texto:[
    'Sexta-feira, seis e dez da manhã.',
    'A porta de serviço está encostada, do jeito que a Sra. Lemos disse, calçada com um pedaço de papelão dobrado porque o trinco é duro e ninguém quer ficar destrancando.',
    'Do lado de dentro é um corredor de piso sem acabamento, com carrinho de limpeza encostado, cheiro de desinfetante de pinho, e uma escala de turno colada na parede com fita crepe.',
    'Ninguém olha pra você. Ninguém olha pra ninguém às seis e dez da manhã.',
    'Você atravessa o corredor inteiro e sai numa área de serviço com três portas: elevador de carga, escada de incêndio e uma porta com placa de **CENTRAL TÉCNICA**.'
  ],
  ef:{flag:'dentro_da_silph',
      rep:{eixo:'bom',delta:1,motivo:'Entrou pela porta que ninguém tranca'},
      registrar:'Entrou na Silph pela porta de serviço, às 6h10 de uma sexta.',
      presagio:'Ninguém olha pra ninguém às seis e dez da manhã. Guarde o horário.'},
  escolhas:[
    {texto:'Descer pela escada de incêndio.', vai:'c11_escada'},
    {texto:'Pegar o elevador de carga.', vai:'c11_elevador_de_carga'},
    {texto:'Entrar na central técnica.', vai:'c11_central_tecnica'},
    {texto:'Subir pro sétimo ver a sala vazia.', vai:'c11_sala_vazia', cond:d=>!!d.flags.sabe_da_sala_vazia}
  ]
},

c11_central_tecnica:{
  texto:[
    'A central técnica é uma sala de quatro por seis com quadro de disjuntores, painel de alarme de incêndio, e o controlador do ar-condicionado central.',
    'No controlador tem uma tela de cristal líquido com uma lista de zonas e suas temperaturas.',
    'Você lê a lista inteira.',
    'Térreo 22. Andares 1 a 10: 22, todos. Subsolo 1: 22. Subsolo 2: 20. Subsolo 3: 20.',
    'E a última linha da lista, que não tem nome de andar, só um código:',
    '**Z-11 ....... 8,0**',
    'Oito graus.',
    'Oito graus é temperatura de câmara fria. É temperatura de necrotério, de banco de sangue, de conservação.',
    'E do lado de Z-11 tem um segundo campo, com um valor que você não sabe interpretar e que te dá um frio na barriga assim mesmo:',
    '**RENOV. AR: 0%**'
  ],
  ef:{flag:['viu_o_controlador','sabe_dos_oito_graus'],
      rep:{eixo:'bom',delta:3,motivo:'Leu a lista de zonas até o fim'},
      instabilidade:1,
      registrar:'A zona Z-11 da Silph fica a 8 graus com 0% de renovação de ar.',
      presagio:'Zero por cento de renovação de ar. Nada lá embaixo precisa respirar.'},
  escolhas:[
    {texto:'Mudar a temperatura da Z-11.', vai:'c11_mexeu_no_ar'},
    {texto:'Não mexer em nada. Descer pela escada.', vai:'c11_escada'},
    {texto:'Fotografar a tela.', vai:'c11_fotografou_tela', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Pegar o elevador de carga.', vai:'c11_elevador_de_carga'}
  ]
},

c11_mexeu_no_ar:{
  texto:[
    'Você põe a mão na tecla e para.',
    'Oito graus mantém alguma coisa. Vinte e dois graus mantém gente.',
    'Você não sabe qual das duas coisas está lá embaixo, e não saber é exatamente o motivo pra não mexer.',
    'Mas você mexe.',
    'Você sobe a Z-11 de oito para doze graus, que é um número que você escolhe por nenhum motivo bom, e confirma.',
    'A tela pisca e aceita.',
    'Em algum lugar quatro andares abaixo do chão, um compressor muda de regime.',
    'E dezenove segundos depois, o alarme de zona pisca em amarelo na outra tela: **Z-11 FORA DE FAIXA — NOTIFICAR SUPERVISÃO**.',
    'Você acabou de avisar alguém de que existe você.'
  ],
  ef:{flag:['mexeu_no_ar','alarme_silph'],
      rep:{eixo:'ruim',delta:1,motivo:'Mexeu num sistema que não entendia'},
      instabilidade:1,
      registrar:'Alterou a temperatura da Z-11 e disparou a notificação de supervisão.',
      presagio:'Dezenove segundos. Agora tem gente descendo.'},
  escolhas:[
    {texto:'Voltar pra oito antes que alguém chegue.', vai:'c11_voltou_o_ar'},
    {texto:'Descer correndo pela escada.', vai:'c11_escada'},
    {texto:'Esconder e ver quem desce.', vai:'c11_viu_quem_desce'},
    {texto:'Sair do prédio.', vai:'c11_desistiu'}
  ]
},

c11_voltou_o_ar:{
  texto:[
    'Você volta pra oito e confirma.',
    'A tela pisca e aceita, e o alarme amarelo apaga em quatro segundos, e o registro de ocorrência que ficou é: uma variação de temperatura de quatro graus, por dezenove segundos, às seis e dezessete de uma sexta-feira.',
    'Isso vai virar uma linha num relatório mensal que ninguém lê.',
    'Você fica com a mão no painel, respirando, e entende uma coisa pequena e útil: dá pra desfazer. Nem tudo, mas dá pra desfazer.'
  ],
  ef:{flag:'desfez_o_alarme', limpaFlag:'alarme_silph',
      rep:{eixo:'bom',delta:1,motivo:'Desfez o próprio erro antes que custasse'},
      presagio:'Dá pra desfazer. Nem tudo. Guarde a ressalva.'},
  escolhas:[
    {texto:'Descer pela escada de incêndio.', vai:'c11_escada'},
    {texto:'Pegar o elevador de carga.', vai:'c11_elevador_de_carga'},
    {texto:'Fotografar a tela.', vai:'c11_fotografou_tela', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Subir pro sétimo.', vai:'c11_sala_vazia', cond:d=>!!d.flags.sabe_da_sala_vazia}
  ]
},

c11_viu_quem_desce:{
  texto:[
    'Você se enfia atrás do quadro de disjuntores e espera.',
    'Quatro minutos.',
    'Desce uma mulher de jaleco, sozinha, de uns quarenta anos, com crachá que você não consegue ler e uma xícara de café na mão.',
    'Ela olha a tela, resmunga, ajeita o valor de volta pra oito sem nenhuma surpresa, e escreve alguma coisa numa prancheta pendurada ao lado do painel.',
    'Depois ela para.',
    'Fica olhando a tela mais uns dez segundos.',
    'E fala em voz alta, sozinha, numa central técnica às seis e vinte da manhã:',
    '"Não foi você que mexeu, foi?"',
    'Ela não está falando com você. Ela está falando com a Z-11.'
  ],
  ef:{flag:['viu_a_cientista','sabe_que_ela_fala_com_eles'],
      moral:-8, instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Esperou para ver quem descia'},
      registrar:'A cientista da Z-11 pergunta em voz alta, sozinha, se foram eles que mexeram.',
      presagio:'Ela pergunta. Ela já pergunta há quanto tempo?'},
  escolhas:[
    {texto:'Aparecer e falar com ela.', vai:'c11_dra_reis'},
    {texto:'Segui-la.', vai:'c11_seguiu_a_cientista'},
    {texto:'Deixar ela ir e descer pela escada.', vai:'c11_escada'},
    {texto:'Sair do prédio.', vai:'c11_desistiu'}
  ]
},

c11_seguiu_a_cientista:{
  texto:[
    'Você segue quinze passos atrás, e ela não olha pra trás uma vez, porque quem trabalha num prédio há anos não olha pra trás dentro dele.',
    'Ela pega a escada de incêndio — não o elevador.',
    'Desce. Subsolo 1, subsolo 2, subsolo 3.',
    'E continua descendo.',
    'No patamar seguinte ela para na frente de uma porta de aço com fechadura biométrica, encosta o polegar, e a porta abre com um estalo pneumático e um sopro de ar frio que sobe a escada inteira e chega em você três degraus acima.',
    'A porta fica aberta.',
    'Você conta.',
    'Onze segundos.'
  ],
  ef:{flag:['chegou_no_11','sabe_dos_onze_segundos'],
      rep:{eixo:'bom',delta:3,motivo:'Seguiu quem tinha o polegar certo'},
      registrar:'A porta do andar 11 abre com biometria e fica aberta onze segundos.',
      presagio:'Onze segundos. Se a Marina te avisou, você já sabia. Se não, você acabou de aprender.'},
  escolhas:[
    {texto:'Entrar nos onze segundos.', vai:'c11_onze'},
    {texto:'Esperar ela sair e entrar depois.', vai:'c11_esperou_11'},
    {texto:'Bater na porta.', vai:'c11_bateu_na_porta'},
    {texto:'Subir de volta. Isso é fundo demais.', vai:'c11_desistiu'}
  ]
},

c11_fotografou_tela:{
  texto:[
    'Você fotografa a tela do controlador com a câmera descartável, três vezes, com o flash desligado porque flash em tela de cristal líquido só devolve o flash.',
    'A terceira sai legível.',
    'É uma foto de uma tela de ar-condicionado.',
    'É a prova mais burocrática, mais chata e mais difícil de desmentir que você vai conseguir nesse prédio: uma zona chamada Z-11, a oito graus, com zero por cento de renovação de ar, num prédio que oficialmente tem dez andares e três subsolos.'
  ],
  ef:{flag:['provas_do_ar','provas_do_11'],
      executar:d=>{ Estado.usarItem('Câmera descartável'); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Fotografou a prova mais chata e mais forte'},
      registrar:'Fotografou a tela do controlador com a zona Z-11.',
      presagio:'A prova mais chata é sempre a que dura.'},
  escolhas:[
    {texto:'Descer pela escada de incêndio.', vai:'c11_escada'},
    {texto:'Sair com a foto e não descer.', vai:'c11_saiu_com_a_foto'},
    {texto:'Pegar o elevador de carga.', vai:'c11_elevador_de_carga'},
    {texto:'Subir pro nono.', vai:'c11_nono_andar'}
  ]
},

c11_saiu_com_a_foto:{
  texto:[
    'Você sai do prédio às seis e quarenta da manhã pela mesma porta encostada, com uma câmera descartável na mochila e nada mais.',
    'Não desceu. Não viu. Não abriu nada.',
    'E tem uma foto de uma tela de ar-condicionado que, levada à pessoa certa, obriga uma empresa a explicar o que é a zona onze de um prédio de dez andares.',
    'Você fica na calçada olhando o vidro azul e sabendo que essa é a decisão mais adulta que você tomou na vida e que ela não parece nem um pouco com vitória.'
  ],
  ef:{flag:['saiu_so_com_a_prova','escolha_fria'],
      rep:{eixo:'bom',delta:3,motivo:'Saiu com a prova em vez de descer'},
      registrar:'Saiu da Silph só com a foto do controlador.',
      presagio:'Não parece vitória. Quase nada do que funciona parece.'},
  escolhas:[
    {texto:'Levar à Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Levar à Liga.', vai:'c11_entregou_liga'},
    {texto:'Voltar e descer assim mesmo.', vai:'c11_escada'}
  ]
},

c11_elevador_de_carga:{
  texto:[
    'O elevador de carga é uma caixa de aço de dois por três com acolchoado de lona pendurado nas paredes pra não riscar móvel.',
    'O painel tem: SS3, SS2, SS1, T, 1 a 10.',
    'E, abaixo do SS3, um botão sem número, com o aro de plástico amarelado de tanto ser apertado.',
    'Mais amarelado que os outros. Muito mais.',
    'Esse botão é o mais usado do elevador inteiro.'
  ],
  ef:{flag:'achou_o_botao',
      presagio:'O botão mais usado do prédio é o que não tem número.'},
  escolhas:[
    {texto:'Apertar.', vai:'c11_onze'},
    {texto:'Não apertar. Descer pela escada e ver a porta primeiro.', vai:'c11_escada'},
    {texto:'Subir pro nono.', vai:'c11_nono_andar'},
    {texto:'Subir pro sétimo.', vai:'c11_sala_vazia', cond:d=>!!d.flags.sabe_da_sala_vazia}
  ]
},

c11_garagem:{
  texto:[
    'A garagem da Silph tem três níveis e uma cancela com reconhecimento de placa.',
    'Pedestre não passa pela cancela, mas pedestre passa pela rampa, e a rampa não tem nada além de uma faixa amarela pintada no chão e um aviso de "proibida a passagem de pedestres" que existe por causa de seguro.',
    'Você desce a rampa andando, como quem trabalha ali.',
    'Nível 1: carro de diretoria. Nível 2: carro de gente normal. Nível 3: quase vazio, com quatro vagas ocupadas e uma porta corta-fogo no fundo.',
    'As quatro vagas do nível 3 têm placa numerada na parede, pintada à mão, e os números não são 01 a 04.',
    'São 11-A, 11-B, 11-C e 11-D.'
  ],
  ef:{flag:['dentro_da_silph','viu_as_vagas'],
      rep:{eixo:'bom',delta:2,motivo:'Desceu a rampa e leu as vagas'},
      registrar:'No nível 3 da garagem há quatro vagas numeradas 11-A a 11-D.',
      presagio:'Quatro pessoas estacionam no andar onze. Quatro pessoas, com carro, com nome.'},
  escolhas:[
    {texto:'Anotar as placas dos quatro carros.', vai:'c11_anotou_placas'},
    {texto:'Entrar pela porta corta-fogo.', vai:'c11_escada'},
    {texto:'Esperar alguém sair.', vai:'c11_esperou_garagem'},
    {texto:'Subir e ir pra recepção.', vai:'c11_recepcao'}
  ]
},

c11_anotou_placas:{
  texto:[
    'Você anota as quatro placas no caderno, e o modelo, e a cor.',
    'Um sedã prata de meia-idade com cadeirinha de bebê no banco de trás. Uma perua com adesivo de faculdade no vidro. Um carro popular com uma pasta no banco do carona. E um utilitário com o para-choque amassado e uma caixa de papelão no porta-malas, aberta, com pastas dentro.',
    'Quatro pessoas. Uma tem filho pequeno. Uma faz pós-graduação.',
    'É a coisa mais desconcertante do capítulo até aqui: você veio procurar monstro e achou estacionamento.',
    'A caixa aberta no porta-malas do utilitário tem um lombo de pasta virado pra cima e dá pra ler, se você chegar perto do vidro:',
    '**PROJ. 11 — SÉRIE 3 — ENCERRAMENTO**'
  ],
  ef:{flag:['anotou_as_placas','sabe_do_encerramento'],
      rep:{eixo:'bom',delta:2,motivo:'Anotou as placas e leu o que dava pra ler'},
      instabilidade:1,
      registrar:'No porta-malas do carro da vaga 11-D: uma pasta marcada "PROJ. 11 — SÉRIE 3 — ENCERRAMENTO".',
      presagio:'Encerramento. Alguém já decidiu que a série 3 acaba.'},
  escolhas:[
    {texto:'Entrar pela porta corta-fogo.', vai:'c11_escada'},
    {texto:'Esperar o dono do utilitário descer.', vai:'c11_esperou_garagem'},
    {texto:'Abrir o porta-malas.', vai:'c11_abriu_o_porta_malas'},
    {texto:'Subir e ir pra recepção.', vai:'c11_recepcao'}
  ]
},

c11_abriu_o_porta_malas:{
  texto:[
    'O porta-malas não está trancado, porque ninguém tranca porta-malas dentro da própria garagem da própria empresa.',
    'Dentro da caixa de papelão tem seis pastas.',
    'Você tira a de cima e abre em pé, entre dois carros, no nível 3 de uma garagem, com a mão tremendo.',
    'É um relatório de encerramento de série, com trinta e uma páginas, e a primeira linha do sumário executivo é:',
    '"A série 3 apresentou cognição parcial em 11 de 11 exemplares, sem aquisição de vontade própria mensurável em nenhum. Recomenda-se descontinuidade."',
    'Descontinuidade.',
    'Você lê a palavra duas vezes e entende que é a palavra de planilha pra outra coisa, e que a outra coisa está marcada com data na página quatro.',
    'A data é daqui a nove dias.'
  ],
  ef:{flag:['leu_o_encerramento','sabe_dos_nove_dias','provas_do_11'],
      itens:{'Relatório de encerramento':1},
      rep:{eixo:'bom',delta:4,motivo:'Abriu o porta-malas e leu a data'},
      moral:-15, instabilidade:2,
      registrar:'A série 3 será descontinuada em nove dias. Onze exemplares com cognição parcial.',
      presagio:'Nove dias. Agora tudo que você fizer nesse capítulo tem prazo.'},
  escolhas:[
    {texto:'Levar a pasta e descer.', vai:'c11_escada'},
    {texto:'Levar a pasta e sair do prédio.', vai:'c11_saiu_com_a_foto'},
    {texto:'Esperar o dono do carro descer.', vai:'c11_esperou_garagem'},
    {texto:'Devolver a pasta e descer sem ela.', vai:'c11_escada'}
  ]
},

c11_esperou_garagem:{
  texto:[
    'Você espera entre dois carros do nível 3 por uma hora e quarenta.',
    'Às dezenove e dez a porta corta-fogo abre e sai uma mulher de jaleco por cima da roupa comum, com uma pasta embaixo do braço e uma xícara de café que ela claramente esqueceu que estava segurando.',
    'Ela vai pro utilitário da vaga 11-D.',
    'E para no meio do caminho, porque você está do lado do carro dela e não deu tempo de esconder.',
    'Ela não grita. Não corre. Não chama ninguém.',
    'Ela olha você, olha a caixa aberta no porta-malas, olha você de novo.',
    '"Quantas páginas você leu?"'
  ],
  ef:{flag:'encontrou_a_cientista',
      npc:{nome:'Dra. Reis', opiniao:0, memoria:'Te achou na garagem, do lado do carro dela, com o porta-malas aberto.'},
      presagio:'"Quantas páginas você leu?" Não é ameaça. É triagem.'},
  escolhas:[
    {texto:'"Trinta e uma."', vai:'c11_dra_reis'},
    {texto:'"Nenhuma."', vai:'c11_mentiu_pra_reis'},
    {texto:'"A que tem a data."', vai:'c11_dra_reis'},
    {texto:'Correr.', vai:'c11_escada'}
  ]
},

c11_mentiu_pra_reis:{
  texto:[
    '"Nenhuma."',
    'Ela olha o porta-malas aberto, a caixa aberta, a pasta de cima fora de ordem.',
    '"Tá."',
    'Ela abre a porta do carro, joga a pasta no banco do carona, e antes de entrar fala sem olhar pra você:',
    '"Se você não leu nenhuma, então você não sabe que tem uma data."',
    'Ela entra e fecha a porta.',
    'E pela janela, com o vidro subindo, ela diz a última coisa:',
    '"Era dia dezenove. Agora você sabe."',
    'E vai embora.'
  ],
  ef:{flag:['sabe_dos_nove_dias','reis_te_contou'],
      npc:{nome:'Dra. Reis', opiniao:2, memoria:'Você mentiu que não tinha lido e ela te contou a data mesmo assim.'},
      rep:{eixo:'bom',delta:1,motivo:'Recebeu a data de quem tinha todo motivo para esconder'},
      registrar:'A Dra. Reis te deu a data do encerramento: dia 19.',
      presagio:'Ela te contou. Pensa muito bem no porquê.'},
  escolhas:[
    {texto:'Descer pela porta corta-fogo.', vai:'c11_escada'},
    {texto:'Ir atrás dela.', vai:'c11_dra_reis'},
    {texto:'Ir contar pra Sabrina.', vai:'c11_ginasio'},
    {texto:'Sair do prédio e pensar.', vai:'c11_desistiu'}
  ]
},

c11_dra_reis:{
  texto:[
    'Ela se apresenta como Reis, sem primeiro nome, do jeito que gente de laboratório se apresenta.',
    'E faz uma coisa que desmonta completamente o que você esperava de um vilão de empresa: ela senta no capô do próprio carro e conversa com você por quarenta minutos.',
    '"Eu entrei nesse projeto em noventa e quatro. Eu tinha vinte e nove anos e achei que era a maior sorte da minha vida."',
    '"O material veio do arquivo morto de Cinnabar. Amostra congelada, degradada, de um projeto que já tinha dado certo uma vez."',
    '"Já tinha dado certo?"',
    '"Uma vez." Ela olha o chão da garagem. "E depois fugiu, e depois matou muita gente, e a empresa que financiou aquilo faliu, e todo mundo aprendeu a lição errada."',
    '"Qual era a lição certa?"',
    '"Que ele conversou com uma pessoa por duzentos e quarenta e um dias antes de virar aquilo."',
    '"E qual foi a lição que aprenderam?"',
    '"Que era perigoso deixar conversar."'
  ],
  ef:{flag:['conheceu_a_reis','sabe_de_cinnabar','sabe_dos_241'],
      npc:{nome:'Dra. Reis', opiniao:3, memoria:'Te contou na garagem que o projeto veio de Cinnabar e qual foi a lição que a empresa tirou.'},
      rep:{eixo:'bom',delta:3,motivo:'Conversou com quem podia ter chamado a segurança'},
      moral:-10,
      registrar:'A Dra. Reis: a empresa aprendeu que o perigo era deixar conversar.',
      presagio:'Duzentos e quarenta e um dias. Guarde o número; ele está escrito no quadro lá embaixo.'},
  escolhas:[
    {texto:'"Me deixa descer."', vai:'c11_reis_deixa'},
    {texto:'"Por que você continua?"', vai:'c11_porque_continua'},
    {texto:'"O que acontece no dia dezenove?"', vai:'c11_dia_dezenove'},
    {texto:'"Você já perguntou alguma coisa pra eles?"', vai:'c11_reis_ja_perguntou'}
  ]
},

c11_porque_continua:{
  texto:[
    '"Por que você continua?"',
    'Ela demora.',
    '"Porque se eu sair, contratam outro, e o outro não desce na central técnica às seis da manhã pra checar se a temperatura subiu quatro graus."',
    '"E porque eu tenho cinquenta e um anos e nove anos de projeto, e a única coisa que eu sei fazer nesse mundo é isso, e isso não existe em mais nenhum lugar legalizado de Kanto."',
    'Ela mexe o café frio.',
    '"E porque toda vez que eu penso em sair eu penso que eles vão ficar sem ninguém que fale com eles, e aí eu não saio, e aí eu passo mais um ano assinando relatório de série que não dá certo."',
    '"Você já entendeu, né? Eu sou a parte boa. Eu sou a melhor pessoa daquele andar."',
    '"E eu assino o encerramento."'
  ],
  ef:{flag:'reis_e_a_parte_boa',
      npc:{nome:'Dra. Reis', opiniao:4, memoria:'Admitiu que é a melhor pessoa do andar 11 e que é ela quem assina o encerramento.'},
      moral:-10,
      registrar:'"Eu sou a parte boa. E eu assino o encerramento."',
      presagio:'A melhor pessoa do andar. Guarde — isso vai definir o que você pede a ela.'},
  escolhas:[
    {texto:'"Me deixa descer."', vai:'c11_reis_deixa'},
    {texto:'"O que acontece no dia dezenove?"', vai:'c11_dia_dezenove'},
    {texto:'"Você já perguntou alguma coisa pra eles?"', vai:'c11_reis_ja_perguntou'},
    {texto:'"Então não assina."', vai:'c11_nao_assina'}
  ]
},

c11_dia_dezenove:{
  texto:[
    '"O que acontece no dia dezenove?"',
    'Ela não usa eufemismo, e você vai agradecer por isso depois.',
    '"Descontinuidade da série três. Onze exemplares."',
    '"Como?"',
    '"Sedação profunda por via do próprio tanque, redução térmica controlada, e depois incineração em unidade licenciada fora de Saffron."',
    'Ela olha pra você.',
    '"Eu vou estar lá. Eu estou em todas. Eu estive nas onze da série um e nas nove da série dois."',
    '"Por quê?"',
    '"Porque eu não vou deixar um estagiário fazer isso sozinho num sábado."',
    'Ela termina o café frio de uma vez, com nojo.',
    '"Eu tenho vinte e nove assinaturas dessas. Eu sei o nome que eu dei pra cada um deles e eu nunca escrevi nenhum em lugar nenhum, porque eles não têm nome no sistema, e nome em caderno particular dá problema em auditoria."'
  ],
  ef:{flag:['sabe_como_e_o_encerramento','reis_deu_nome'],
      moral:-18, instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Ouviu inteiro em vez de interromper'},
      registrar:'A Dra. Reis esteve em 29 descontinuidades e deu nome a todos, sem escrever em lugar nenhum.',
      presagio:'Ela deu nome aos vinte e nove. E não escreveu em lugar nenhum.'},
  escolhas:[
    {texto:'"Escreve os nomes. Eu levo."', vai:'c11_escreve_os_nomes'},
    {texto:'"Me deixa descer."', vai:'c11_reis_deixa'},
    {texto:'"Então não assina."', vai:'c11_nao_assina'},
    {texto:'"Você já perguntou alguma coisa pra eles?"', vai:'c11_reis_ja_perguntou'}
  ]
},

c11_escreve_os_nomes:{
  texto:[
    '"Escreve os nomes. Eu levo."',
    'Ela olha pra você como se você tivesse falado em outra língua.',
    '"Pra quê?"',
    '"Pra existir em algum lugar."',
    'Ela abre a boca pra dizer que isso não serve pra nada, e não diz.',
    'Ela pega o caderno da sua mão, apoia no capô do carro, e escreve.',
    'Leva onze minutos, porque ela para entre alguns.',
    'Quando devolve, tem vinte e nove nomes numa página e meia, em letra de médico, com um numerozinho de série do lado de cada um.',
    'Nenhum nome é científico. São nomes de gente: nomes curtos, nomes de avô, um apelido de time de futebol, dois repetidos com número romano porque ela ficou sem ideia na série dois.',
    '"Pronto." Ela fecha a caneta. "Agora existe."'
  ],
  ef:{flag:['tem_os_nomes','reis_aliada'],
      itens:{'Lista de vinte e nove nomes':1},
      npc:{nome:'Dra. Reis', opiniao:8, memoria:'Escreveu no seu caderno, no capô do carro, os vinte e nove nomes que ela deu e nunca registrou.'},
      rep:{eixo:'bom',delta:5,motivo:'Fez vinte e nove existirem em algum lugar'},
      moral:15,
      registrar:'A Dra. Reis escreveu no seu caderno os 29 nomes que ela deu.',
      presagio:'"Agora existe." Você não salvou ninguém e mudou tudo.'},
  escolhas:[
    {texto:'"Me deixa descer."', vai:'c11_reis_deixa'},
    {texto:'"Então não assina o dia dezenove."', vai:'c11_nao_assina'},
    {texto:'"Você já perguntou alguma coisa pra eles?"', vai:'c11_reis_ja_perguntou'},
    {texto:'Agradecer e descer sozinho.', vai:'c11_escada'}
  ]
},

c11_reis_ja_perguntou:{
  texto:[
    '"Você já perguntou alguma coisa pra eles?"',
    'A pergunta pega ela de um jeito que nenhuma outra pegou.',
    '"Como assim, perguntar?"',
    '"Perguntar. Falar. Em voz alta. Uma pergunta."',
    'Ela fica quieta muito tempo.',
    '"Eu falo com eles todo dia. Bom dia, boa noite, vou desligar a luz, vai doer um pouquinho."',
    '"Isso não é pergunta."',
    '"Não é."',
    'Ela põe a xícara no capô e não pega mais.',
    '"Tem um rabisco no quadro branco lá embaixo. Escrito, apagado e reescrito umas três vezes, sempre pela mesma pessoa, e essa pessoa sou eu, e eu não lembro de ter escrito nenhuma das três."',
    '"O rabisco diz: eles não falam porque ninguém pergunta."',
    'Ela olha pra você.',
    '"Eu escrevi isso três vezes e apaguei três vezes e nunca perguntei nada."'
  ],
  ef:{flag:['sabe_do_rabisco','reis_quebrada'],
      npc:{nome:'Dra. Reis', opiniao:6, memoria:'Percebeu, falando com você, que escreveu o rabisco três vezes e nunca perguntou nada.'},
      rep:{eixo:'bom',delta:4,motivo:'Fez a pergunta que desmontou uma pessoa inteira'},
      moral:-8,
      registrar:'O rabisco do quadro do andar 11 foi escrito e apagado três vezes pela própria Dra. Reis.',
      presagio:'Ela escreveu e apagou três vezes. Alguma parte dela sabia.'},
  escolhas:[
    {texto:'"Então desce comigo e pergunta."', vai:'c11_reis_desce'},
    {texto:'"Me deixa descer sozinho."', vai:'c11_reis_deixa'},
    {texto:'"Então não assina."', vai:'c11_nao_assina'},
    {texto:'"Escreve os nomes. Eu levo."', vai:'c11_escreve_os_nomes'}
  ]
},

c11_nao_assina:{
  texto:[
    '"Então não assina."',
    '"Se eu não assinar, assina o Bertoldo do jurídico, que nunca desceu lá, e aí é no sábado, com estagiário, e ninguém fala com eles antes."',
    '"Isso não é motivo pra assinar. É motivo pra estar lá."',
    'Ela abre a boca. Fecha.',
    '"É." Ela concorda devagar, e você vê o custo da concordância na cara dela. "É motivo pra estar lá. Não é motivo pra assinar."',
    '"Eu assino há nove anos achando que é a mesma coisa."',
    'Ela pega a xícara vazia e olha dentro dela.',
    '"Eu vou estar lá no dia dezenove. E eu não vou assinar."',
    '"E aí?"',
    '"E aí eles me demitem, e o Bertoldo assina, e acontece igual."',
    'Pausa.',
    '"Mas tem uma diferença: eu vou ter que ser demitida no meio."',
    '"E demissão no meio de um procedimento gera ocorrência, e ocorrência gera ata, e ata é documento."',
    'Ela olha pra você com uma cara nova.',
    '"Você me deu uma ideia horrível e ela é a primeira ideia que eu tenho em nove anos."'
  ],
  ef:{flag:['reis_nao_assina','reis_aliada'],
      npc:{nome:'Dra. Reis', opiniao:9, memoria:'Decidiu não assinar o encerramento e se fazer demitir no meio, para gerar ata.'},
      rep:{eixo:'bom',delta:5,motivo:'Convenceu a única pessoa boa daquele andar a parar de assinar'},
      moral:15, instabilidade:1,
      registrar:'A Dra. Reis vai se recusar a assinar no dia 19 para forçar uma ata.',
      presagio:'Ata é documento. Nove anos e a saída era administrativa.'},
  escolhas:[
    {texto:'"Me deixa descer agora."', vai:'c11_reis_deixa'},
    {texto:'"Desce comigo e pergunta."', vai:'c11_reis_desce'},
    {texto:'"Escreve os nomes. Eu levo."', vai:'c11_escreve_os_nomes'},
    {texto:'Agradecer e descer sozinho.', vai:'c11_escada'}
  ]
},

c11_reis_deixa:{
  texto:[
    '"Me deixa descer."',
    'Ela pensa por um tempo que parece muito longo pra uma decisão de vida inteira.',
    '"Eu vou te levar até a porta. Eu encosto o polegar. Você tem onze segundos."',
    '"E depois?"',
    '"E depois eu vou pro meu carro e vou pra casa, e amanhã de manhã eu descubro no log que alguém entrou às dezenove e quarenta com a minha biometria, e eu vou ter que explicar."',
    'Ela pega as chaves.',
    '"E eu vou explicar que eu desci pra checar a temperatura e esqueci a porta aberta, e eles vão me dar advertência, porque eu tenho nove anos de casa e ninguém abre inquérito por porta aberta."',
    '"Você já tinha pensado nisso."',
    '"Eu penso nisso desde noventa e sete." Ela fecha o porta-malas. "Vamos."'
  ],
  ef:{flag:['reis_te_leva','chegou_no_11'],
      npc:{nome:'Dra. Reis', opiniao:7, memoria:'Encostou o próprio polegar na biometria para você descer, sabendo que ia ter que explicar.'},
      rep:{eixo:'bom',delta:4,motivo:'Alguém de dentro abriu a porta por dentro'},
      registrar:'A Dra. Reis abriu a porta do andar 11 com a biometria dela.',
      presagio:'"Eu penso nisso desde noventa e sete." Ela esperava alguém aparecer.'},
  escolhas:[{texto:'Entrar nos onze segundos.', vai:'c11_onze'}]
},

c11_reis_desce:{
  texto:[
    '"Então desce comigo e pergunta."',
    'Ela ri e a risada morre no meio.',
    '"Eu não posso."',
    '"Você tem a digital. Você tem o crachá. Você tem nove anos de casa e o encerramento assinado por você."',
    '"Eu não posso ouvir a resposta."',
    'Silêncio.',
    '"E se a resposta for que eles querem viver?"',
    'Vocês dois ficam ali, no nível 3 de uma garagem, com o motor de exaustão ligado e ninguém mais no andar.',
    'Depois ela pega as chaves, tranca o carro, e anda na direção da porta corta-fogo.',
    '"Vem."'
  ],
  ef:{flag:['reis_desce_com_voce','chegou_no_11','reis_aliada'],
      npc:{nome:'Dra. Reis', opiniao:10, memoria:'Desceu ao andar 11 com você para fazer a pergunta que evitou por nove anos.'},
      rep:{eixo:'bom',delta:6,motivo:'Levou junto a pessoa que precisava estar lá'},
      moral:15,
      registrar:'A Dra. Reis desceu ao andar 11 com você.',
      presagio:'"E se a resposta for que eles querem viver?" Ela fez a pergunta antes de descer.'},
  escolhas:[{texto:'Descer com ela.', vai:'c11_onze'}]
},

/* ─────────────── A DOCA ─────────────── */

c11_doca:{
  texto:[
    'A doca de carga fica na face oeste e funciona até tarde.',
    'Quinta-feira, dezenove horas. Três vagas de caminhão, plataforma elevada na altura de carroceria, e a porta social do lado escancarada porque o pessoal da carga entra e sai fumando.',
    'Às dezenove e dois, um caminhão sem identificação nenhuma encosta de ré na vaga do meio. Placa suja. Motorista não desce.',
    'A carga é uma só: uma caixa branca de plástico rígido, de um metro e meio por sessenta, com quatro travas de pressão e uma etiqueta laranja de material biológico.',
    'Dois funcionários descem pra buscar com um carrinho hidráulico.',
    'Nenhum dos dois assina nada. Nenhum dos dois olha a etiqueta. Um deles está no meio de uma conversa sobre futebol e não interrompe pra carregar.',
    d=>{
      const via = Historia.via();
      if (via==='mercenario'||via==='foragido') return 'Você conhece essa caixa. Você provavelmente ajudou a carregar uma igual em algum lugar, em algum capítulo, sem perguntar o que tinha dentro.';
      if (d.flags.sabe_dos_setecentos) return 'Setecentos e vinte e oito. Esta é a caixa setecentos e vinte e nove até setecentos e trinta e cinco.';
      return 'Sete unidades por semana, segundo a mulher do crachá azul. Sete dentro daquela caixa.';
    }
  ],
  ef:{flag:'viu_a_entrega',
      registrar:'Quinta, 19h: chega uma caixa branca lacrada na doca da Silph, sem assinatura.',
      presagio:'Ninguém assina e ninguém olha. É assim que setecentas e vinte e oito passam.'},
  escolhas:[
    {texto:'Entrar junto com a caixa.', vai:'c11_com_a_caixa'},
    {texto:'Abrir a caixa ali mesmo, na doca.', vai:'c11_abriu_caixa_silph'},
    {texto:'Se passar por entregador.', vai:'c11_entregador'},
    {texto:'Seguir o caminhão quando ele sair.', vai:'c11_seguiu_o_caminhao'}
  ]
},

c11_seguiu_o_caminhao:{
  texto:[
    'Você não entra. Você espera o caminhão sair e segue ele a pé pelas seis quadras em que dá pra seguir um caminhão a pé numa cidade com semáforo.',
    'Ele para num posto na saída sul. O motorista desce, abastece, e vai ao banheiro.',
    'A carroceria está vazia e aberta.',
    'E no chão dela, encaixadas nas canaletas, tem quatro caixas brancas iguais à que ele acabou de entregar — vazias, empilhadas, prontas pra devolver.',
    'Cada uma tem uma etiqueta antiga por baixo da nova, mal raspada.',
    'Você levanta a ponta de uma etiqueta velha com a unha.',
    'Embaixo tem um carimbo em tinta desbotada: **INSTITUTO DE PESQUISA CINNABAR — PROPRIEDADE DA UNIÃO — NÃO DESVIAR**.',
    'A caixa é do laboratório de Cinnabar. Todas as quatro são.',
    'Alguém está entregando material biológico em Saffron dentro de caixas que pertencem, por carimbo, a um instituto público que pegou fogo em oitenta e nove.'
  ],
  ef:{flag:['sabe_das_caixas_de_cinnabar','sabe_de_cinnabar','provas_do_11'],
      rep:{eixo:'bom',delta:4,motivo:'Seguiu o caminhão em vez de entrar no prédio'},
      instabilidade:1,
      registrar:'As caixas brancas da Silph são material carimbado do Instituto de Pesquisa de Cinnabar.',
      presagio:'Propriedade da União. Não desviar. E estão desviando desde oitenta e nove.'},
  escolhas:[
    {texto:'Levar uma caixa vazia como prova.', vai:'c11_levou_a_caixa'},
    {texto:'Voltar e entrar pela doca.', vai:'c11_doca'},
    {texto:'Ir contar pra Sabrina.', vai:'c11_ginasio'},
    {texto:'Levar isso à Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c11_levou_a_caixa:{
  texto:[
    'Você tira uma caixa vazia da carroceria enquanto o motorista está no banheiro do posto.',
    'Ela é grande, branca, absurdamente visível, e você atravessa Saffron às vinte e uma horas carregando uma caixa de material biológico de um metro e meio.',
    'Ninguém te para.',
    'Três pessoas olham. Uma delas segura a porta do prédio pra você porque você está com as mãos ocupadas.',
    'É a coisa mais engraçada e mais deprimente do capítulo: você roubou uma prova federal e o que a cidade fez foi segurar a porta.'
  ],
  ef:{flag:['tem_a_caixa_de_cinnabar','provas_do_11'],
      itens:{'Caixa carimbada de Cinnabar':1},
      rep:{eixo:'bom',delta:3,motivo:'Saiu com a prova física mais indesmentível do capítulo'},
      registrar:'Levou uma caixa vazia carimbada do Instituto de Cinnabar.',
      presagio:'Alguém segurou a porta. Guarde essa piada; você vai precisar dela mais tarde.'},
  escolhas:[
    {texto:'Levar à Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Levar à Liga.', vai:'c11_entregou_liga'},
    {texto:'Voltar e descer no prédio assim mesmo.', vai:'c11_escada'}
  ]
},

c11_entregador:{
  texto:['"Chegou mais uma. Cadê o responsável pra assinar?"'],
  teste:{status:'carisma', dificuldade:7, nomeStatus:'Carisma',
         critico:'c11_com_a_caixa', sucesso:'c11_com_a_caixa', parcial:'c11_com_a_caixa', falha:'c11_barrado'}
},

c11_abriu_caixa_silph:{
  texto:[
    'Você abre as quatro travas de pressão na doca, com dois funcionários a dez metros de distância discutindo futebol.',
    'A tampa solta um sopro frio.',
    'Dentro, em berço de espuma cortada sob medida: um Ditto. Vivo, sedado, com um monitor adesivo colado no dorso e um fio fino saindo dele até um conector na parede da caixa.',
    'E, embaixo dele, separados por mais espuma, mais quatro. Depois mais dois.',
    'Sete. Todos Ditto. Todos com monitor.',
    'Ditto copia. É a única coisa que Ditto faz, é a definição da espécie, é o que qualquer criança de Kanto sabe.',
    'Você entende o experimento inteiro em dois segundos e queria muito não ter entendido.',
    'Eles não estão fabricando nada.',
    'Eles estão pedindo pra sete Dittos por semana copiarem uma coisa que existiu uma vez, e nenhum consegue, e todo mundo já sabe que nenhum vai conseguir, e continua chegando caixa toda quinta porque parar de encomendar é admitir.'
  ],
  ef:{flag:['viu_os_dittos','entendeu_o_projeto'],
      moral:-12, instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Abriu a caixa em vez de imaginar o que tinha dentro'},
      registrar:'A Silph recebe sete Dittos sedados por semana para copiar uma coisa que existiu uma vez.',
      presagio:'Parar de encomendar é admitir. É por isso que a caixa chega toda quinta.'},
  escolhas:[
    {texto:'Soltar os sete ali mesmo.', vai:'c11_soltou_dittos'},
    {texto:'Levar a caixa inteira e correr.', vai:'c11_roubou_caixa_silph'},
    {texto:'Fechar e entrar junto com ela.', vai:'c11_com_a_caixa'},
    {texto:'Fotografar e fechar.', vai:'c11_fotografou_a_caixa', cond:d=>Estado.contaItem('Câmera descartável')>0}
  ]
},

c11_fotografou_a_caixa:{
  texto:[
    'Você fotografa a caixa aberta: os sete berços de espuma, os sete monitores, os sete fios, a etiqueta laranja, o carimbo da nota presa na tampa com fita.',
    'Seis fotos.',
    'Depois fecha as quatro travas com cuidado, na ordem, do jeito que estavam, e sai da plataforma antes dos dois funcionários terminarem de discutir futebol.',
    'A caixa sobe. Os sete sobem.',
    'Você fica na rua com seis fotos, e as seis fotos vão durar mais do que os sete.'
  ],
  ef:{flag:['provas_dos_dittos','provas_do_11','escolha_fria'],
      executar:d=>{ Estado.usarItem('Câmera descartável'); return []; },
      rep:{eixo:'bom',delta:2,motivo:'Documentou a entrega semanal inteira'},
      moral:-10,
      registrar:'Fotografou a caixa aberta com os sete Dittos e a nota.',
      presagio:'As seis fotos vão durar mais do que os sete. Você fez a conta e ela está certa.'},
  escolhas:[
    {texto:'Entrar junto com a caixa mesmo assim.', vai:'c11_com_a_caixa'},
    {texto:'Levar à Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Descer pela escada.', vai:'c11_escada'}
  ]
},

c11_soltou_dittos:{
  texto:[
    'Você tira os sete e coloca no chão da doca, um por um, com o fio do monitor arrebentando com um estalinho em cada.',
    'Sedados, eles levam quase um minuto pra reagir. O primeiro que reage é o terceiro da fila, e o jeito que ele reage é: ele vira uma poça mais achatada, do jeito que Ditto faz quando está com medo.',
    'Depois eles fazem a única coisa que sabem fazer.',
    'Copiam o que está por perto.',
    'Dois viram carrinho hidráulico. Um vira a caixa branca.',
    'E quatro viram você.',
    'Você fica cara a cara com quatro cópias suas, com crachá e mochila e a mesma cara de susto, na doca de carga da Silph às sete e poucos de uma quinta-feira.',
    'Um deles copiou até a mancha de barro da sua bota.',
    'Nenhum dos dois funcionários sabe qual dos cinco perseguir, e um deles simplesmente desiste e senta na plataforma.'
  ],
  ef:{flag:['soltou_dittos','dentro_da_silph'],
      rep:{eixo:'bom',delta:3,motivo:'Libertou os sete da entrega semanal na frente de quem recebia'},
      moral:10,
      registrar:'Soltou sete Dittos na doca da Silph. Quatro copiaram você.',
      presagio:'Um copiou a mancha de barro da sua bota. Ditto copia o que vê, e ele te viu inteiro.'},
  escolhas:[
    {texto:'Entrar enquanto eles se confundem.', vai:'c11_escada'},
    {texto:'Levar um dos sete com você.', vai:'c11_levou_um_ditto'},
    {texto:'Ficar e tentar tirar os sete da doca.', vai:'c11_tirou_os_sete'},
    {texto:'Subir com a caixa vazia como se nada tivesse acontecido.', vai:'c11_com_a_caixa'}
  ]
},

c11_levou_um_ditto:{
  texto:[
    'Você pega o que virou a caixa branca, porque é o único que não está com a sua cara e você não consegue carregar uma cópia sua no colo.',
    'Ele volta ao normal no seu braço em uns dez segundos, e é mole e morno e absurdamente leve pro tamanho.',
    'Os outros seis somem pela rua em direções diferentes, e dois deles ainda estão com a sua cara, e isso é um problema que você não tem como resolver hoje.',
    'Ou nunca.'
  ],
  ef:{flag:'tem_um_ditto',
      umaVez:'c10-11_p1', pokemon:{dex:132, nivel:30, opcoes:{moral:30, historia:'Estava numa caixa branca com monitor colado no dorso, a caminho do andar 11 da Silph.'}},
      rep:{eixo:'bom',delta:1,motivo:'Tirou pelo menos um da entrega'},
      registrar:'Ficou com um dos sete Dittos da entrega da Silph.',
      presagio:'Dois deles ainda estão com a sua cara. Em Saffron. Hoje.'},
  escolhas:[
    {texto:'Entrar pela escada.', vai:'c11_escada'},
    {texto:'Ir embora de Saffron.', vai:'c11_fim'},
    {texto:'Ir contar pra Sabrina.', vai:'c11_ginasio'},
    {texto:'Voltar pra doca e tentar os outros seis.', vai:'c11_tirou_os_sete'}
  ]
},

c11_tirou_os_sete:{
  texto:[
    'Você fica.',
    'Fica na doca de carga de uma multinacional às sete e vinte da noite, empurrando sete Dittos sedados em direção à rua com as mãos e com a voz, como quem toca cabrito.',
    'É ridículo. É lento. Dois funcionários assistem e não ajudam e não impedem.',
    'Um deles, num momento que você vai lembrar por muito tempo, abre o portão de pedestre pra facilitar.',
    'Não diz nada. Só abre.',
    'Os sete saem. Quatro com a sua cara, dois de carrinho hidráulico, um de caixa branca, todos passando pelo portão de pedestre de uma empresa de tecnologia enquanto um funcionário segura a folha.',
    'Você não sabe o nome dele e nunca vai saber.'
  ],
  ef:{flag:['tirou_os_sete','soltou_dittos'],
      rep:{eixo:'bom',delta:4,motivo:'Não foi embora até os sete estarem na rua'},
      moral:15, hp:-3, causa:'Uma hora empurrando Ditto sedado',
      npc:{nome:'Funcionário da doca', opiniao:3, memoria:'Abriu o portão de pedestre para os sete Dittos saírem, e não disse nada.'},
      umaVez:'c10-11_p1', pokemon:{dex:132, nivel:30, opcoes:{moral:40, historia:'Foi o único dos sete que não foi embora. Ficou na calçada esperando você terminar.'}},
      registrar:'Tirou os sete Dittos da doca. Um funcionário segurou o portão.',
      presagio:'Ele só abriu. Às vezes é isso que as pessoas conseguem fazer, e às vezes é o suficiente.'},
  escolhas:[
    {texto:'Entrar no prédio agora.', vai:'c11_escada'},
    {texto:'Ir embora de Saffron com eles.', vai:'c11_fim'},
    {texto:'Ir contar pra Sabrina.', vai:'c11_ginasio'},
    {texto:'Voltar amanhã, com calma.', vai:'c11_recepcao'}
  ]
},

c11_roubou_caixa_silph:{
  texto:[
    'Você pega a caixa e corre. Ela pesa vinte e dois quilos com os sete dentro.',
    'Você corre quatro quarteirões com vinte e dois quilos, atravessa duas ruas no vermelho, e some numa galeria comercial fechada com a caixa apoiada no joelho e o ar não entrando direito.',
    'Dentro, sete Dittos sedados que ainda nem acordaram.',
    'E a certeza, que chega junto com o fôlego, de que a Silph vai receber outra caixa igual na quinta que vem, porque a encomenda é semanal e ninguém cancela encomenda por causa de um roubo de vinte e dois quilos.'
  ],
  ef:{flag:'roubou_caixa_silph', hp:-3, causa:'Fuga com vinte e dois quilos',
      rep:{eixo:'bom',delta:2,motivo:'Interceptou uma entrega da Silph'},
      umaVez:'c10-11_p1', pokemon:{dex:132, nivel:30, opcoes:{moral:30, historia:'Estava numa caixa branca com monitor colado no dorso, a caminho do andar 11 da Silph.'}},
      registrar:'Roubou a caixa de Dittos da doca da Silph.',
      presagio:'Quinta que vem chega outra. É por isso que roubo não resolve.'},
  escolhas:[
    {texto:'Voltar ao prédio mesmo assim.', vai:'c11_escada'},
    {texto:'Ir embora de Saffron com os sete.', vai:'c11_fim'},
    {texto:'Levar a caixa à Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou}
  ]
},

c11_com_a_caixa:{
  texto:[
    'Você entra empurrando o carrinho hidráulico, de cabeça baixa, como quem faz isso toda semana há dois anos.',
    'Ninguém questiona um carrinho.',
    'Essa é a lei mais forte de qualquer prédio do mundo: ninguém questiona um carrinho, ninguém questiona uma prancheta, ninguém questiona um uniforme.',
    'O elevador de carga desce. Não sobe.',
    'Subsolo 1. Subsolo 2. Subsolo 3.',
    'E continua descendo, e você olha o painel e o painel já parou de ter andar pra marcar.',
    'O último botão do painel não tem número. Só uma etiqueta de fita crepe escrita à mão, com caneta hidrográfica, numa letra que não é de nenhum departamento oficial de nenhuma empresa:',
    '**11**'
  ],
  ef:{flag:['dentro_da_silph','chegou_no_11'],
      registrar:'Desceu com a caixa até o botão sem número.',
      presagio:'Fita crepe e caneta hidrográfica. O andar mais caro da empresa é identificado à mão.'},
  escolhas:[{texto:'Sair do elevador.', vai:'c11_onze'}]
},

/* ─────────────── O CAMINHO PARA BAIXO ─────────────── */

c11_sala_vazia:{
  texto:[
    'Sétimo andar. A sala fica no fim do corredor, depois da copa, e não tem plaquinha.',
    d=>d.flags.tem_cracha_verde ? 'O crachá verde abre.' : 'A porta está trancada, mas é uma fechadura de escritório, dessas de chave simples, e o batente é de madeira.',
    'Dentro: nada.',
    'Cinco por seis metros, piso vinílico, parede pintada de branco-gelo, teto com quatro luminárias, uma tomada baixa na parede do fundo. Sem móvel, sem cortina, sem quadro, sem carpete.',
    'E pó no chão.',
    'Pó recente, de uma semana, numa sala trancada e vazia de um prédio com ar-condicionado central e filtro.',
    'E no pó, do lado da tomada baixa, uma marca.',
    'Não é pegada de sapato. É o contorno de alguém sentado no chão encostado na parede, com as costas apoiadas, por tempo suficiente pro pó marcar.',
    'Alguém senta nessa sala. Toda semana. No chão. Encostado na parede, do lado de uma tomada.',
    'E sai.'
  ],
  ef:{flag:['viu_a_sala_vazia','sabe_de_quem_senta'],
      rep:{eixo:'bom',delta:2,motivo:'Subiu sete andares por causa de uma pista de faxineira'},
      instabilidade:1,
      registrar:'A sala vazia do 7º andar tem a marca de alguém que senta no chão encostado na parede toda semana.',
      presagio:'Do lado de uma tomada. Guarde a tomada.'},
  escolhas:[
    {texto:'Sentar no mesmo lugar.', vai:'c11_sentou_na_sala'},
    {texto:'Descer pela escada de incêndio.', vai:'c11_escada'},
    {texto:'Ir pro nono andar.', vai:'c11_nono_andar'},
    {texto:'Sair da sala e do prédio.', vai:'c11_desistiu'}
  ]
},

c11_sentou_na_sala:{
  texto:[
    'Você senta no chão, encostado na parede, no mesmo lugar, do lado da tomada.',
    'E fica.',
    'Dez minutos. Quinze.',
    'Não acontece nada, e o nada é a informação: dessa sala não se vê nada, não se ouve nada, não se acessa nada. É a sala mais inútil do prédio.',
    'E aí você percebe, olhando a parede da frente, uma coisa que só se percebe sentado:',
    'A parede da frente não é a parede do corredor.',
    'Ela está um metro e meio mais pra dentro do que deveria, porque você contou os passos no corredor e a sala é mais curta do que o vão.',
    'Tem um metro e meio de espaço entre essa parede e o corredor.',
    'E na base dela, rente ao rodapé, tem quatro furos pequenos em linha, tampados com massa, do tipo que se faz quando se remove uma tubulação.',
    'Essa sala já foi outra coisa e alguém emparedou um metro e meio dela.'
  ],
  ef:{flag:['achou_o_vao','sabe_da_parede_falsa'],
      rep:{eixo:'bom',delta:3,motivo:'Sentou onde alguém sentava e viu o que só dá pra ver sentado'},
      instabilidade:1,
      registrar:'A sala vazia do 7º tem uma parede falsa com um metro e meio de vão e quatro furos tampados.',
      presagio:'Quem senta ali toda semana senta de frente pra essa parede.'},
  escolhas:[
    {texto:'Abrir a parede.', vai:'c11_abriu_a_parede'},
    {texto:'Não abrir. Descer pela escada.', vai:'c11_escada'},
    {texto:'Ir pro nono andar.', vai:'c11_nono_andar'},
    {texto:'Voltar depois, com ferramenta.', vai:'c11_escada'}
  ]
},

c11_abriu_a_parede:{
  texto:[
    'Você abre a parede com o que tem: o pé, a mochila e uma barra de apoio que você arranca do corredor.',
    'É drywall. Drywall cede em três chutes e faz um barulho de trovão num prédio silencioso, e você tem talvez cinco minutos.',
    'Atrás da parede tem um vão de um metro e meio, com o piso original e um trecho de tubulação cortada, e quatro caixas de arquivo empilhadas.',
    'Caixas de arquivo morto, de papelão, com etiqueta datilografada.',
    '**INSTITUTO DE PESQUISA CINNABAR — CAIXA 4 DE 9 — TRANSFERIDA 11/96**',
    'Quatro caixas de nove.',
    'Você abre a de cima e ela está cheia de cadernos. Cadernos comuns, de capa dura, de um só punho, numerados na lombada.',
    'O de cima é o caderno 6 e a primeira linha da primeira página é:',
    '"Dia 1. Ele piscou hoje e eu chorei, o que é pouco científico e eu vou anotar assim mesmo. — A.F."'
  ],
  ef:{flag:['achou_os_cadernos','sabe_do_fuji','provas_do_11'],
      itens:{'Caderno 6 do Dr. Fuji':1},
      rep:{eixo:'bom',delta:5,motivo:'Achou o arquivo morto de Cinnabar emparedado num sétimo andar'},
      moral:-8, instabilidade:2,
      registrar:'Atrás da parede falsa do 7º andar: quatro das nove caixas do arquivo de Cinnabar, com os cadernos do Dr. Fuji.',
      presagio:'Duzentos e quarenta e um dias de caderno. Você tem o número seis.'},
  escolhas:[
    {texto:'Ler o caderno 6 inteiro.', vai:'c11_leu_o_caderno'},
    {texto:'Levar o que der e descer.', vai:'c11_escada'},
    {texto:'Descer agora e ler depois.', vai:'c11_escada'},
    {texto:'Ir pro nono andar com o caderno.', vai:'c11_nono_andar'}
  ]
},

c11_leu_o_caderno:{
  texto:[
    'Você senta no vão, atrás da parede quebrada, e lê o caderno 6 inteiro em quarenta minutos, o que é rápido demais e você sabe.',
    'Não tem fórmula. Não tem gráfico. Não tem número.',
    'Tem uma pessoa anotando conversas.',
    '"Dia 47. Perguntei o que ele queria e ele demorou dois dias pra responder. A resposta foi: saber o que é fora."',
    '"Dia 88. Ele me perguntou se eu tinha medo dele. Eu menti. Ele soube."',
    '"Dia 134. Ele perguntou por que ele. Eu não tinha resposta e disse que não tinha resposta, e ele ficou quieto três dias, e no quarto dia ele disse que preferia isso a uma resposta inventada."',
    '"Dia 203. O conselho quer resultado. Eu disse que o resultado é esse, que ele fala comigo, que isso é o resultado. Eles perguntaram o que ele faz. Eu disse que ele pergunta. Eles perguntaram de novo o que ele FAZ."',
    'E a última página do caderno 6:',
    '"Dia 241. Eu vou dizer não. Amanhã, na reunião, eu vou dizer não, e eles vão me tirar do projeto, e eu não sei o que vai acontecer com ele depois, e eu estou escrevendo isso aqui pra que exista em algum lugar que eu sabia exatamente o que eu estava fazendo."',
    'O caderno 7 não está na caixa.'
  ],
  ef:{flag:['leu_o_caderno_do_fuji','sabe_dos_241'],
      rep:{eixo:'bom',delta:4,motivo:'Leu os duzentos e quarenta e um dias'},
      moral:-15, instabilidade:1,
      registrar:'O caderno 6 do Dr. Fuji: 241 dias de conversa. O caderno 7 não está na caixa.',
      presagio:'"Pra que exista em algum lugar que eu sabia." Você já ouviu essa frase nesse capítulo.'},
  escolhas:[
    {texto:'Descer para o andar 11 com o caderno.', vai:'c11_escada'},
    {texto:'Procurar o caderno 7 nas outras caixas.', vai:'c11_caderno_sete'},
    {texto:'Levar tudo e sair do prédio.', vai:'c11_saiu_com_a_foto'},
    {texto:'Ir pro nono andar.', vai:'c11_nono_andar'}
  ]
},

c11_caderno_sete:{
  texto:[
    'Você abre as outras três caixas.',
    'Caderno 1 ao 5 estão lá. Caderno 8 e 9 estão lá.',
    'O 7 não.',
    'E no lugar dele, na sequência, tem um envelope pardo de correspondência interna, sem remetente, com um carimbo de protocolo de 1996 e uma única folha dentro.',
    'A folha é um formulário de retirada de documento de arquivo.',
    '**DOCUMENTO: CADERNO 7 (DIAS 242–?) — RETIRADO POR: (assinatura ilegível) — MOTIVO: ANÁLISE JURÍDICA — DEVOLUÇÃO PREVISTA: 30 DIAS**',
    'Data da retirada: quatro de novembro de mil novecentos e noventa e seis.',
    'Nunca devolvido.',
    'Alguém tirou o caderno que contava o que aconteceu depois do dia em que o Dr. Fuji disse não, e essa pessoa tirou pra análise jurídica, e prometeu devolver em trinta dias, e faz quatro anos.'
  ],
  ef:{flag:['sabe_do_caderno_sete','provas_do_11'],
      itens:{'Formulário de retirada — Caderno 7':1},
      rep:{eixo:'bom',delta:3,motivo:'Procurou o que faltava em vez de se contentar com o que achou'},
      registrar:'O caderno 7 foi retirado para "análise jurídica" em 04/11/1996 e nunca devolvido.',
      presagio:'Análise jurídica. Alguém leu o dia 242 e decidiu que ninguém mais lia.'},
  escolhas:[
    {texto:'Descer para o andar 11.', vai:'c11_escada'},
    {texto:'Levar tudo e sair.', vai:'c11_saiu_com_a_foto'},
    {texto:'Ir pro nono andar.', vai:'c11_nono_andar'},
    {texto:'Ir contar pra Sabrina.', vai:'c11_ginasio'}
  ]
},

c11_nono_andar:{
  texto:[
    'O nono andar é escritório. Escritório mesmo: baias de divisória cinza, monitor de tubo, planta de plástico, cartaz de campanha de segurança do trabalho, bolo de aniversário na copa.',
    'Vinte e duas pessoas trabalhando às dez da manhã de uma terça, e nenhuma delas está fazendo nada de errado.',
    'Uma placa na parede diz **SUPRIMENTOS — ATIVOS BIOLÓGICOS**.',
    'É uma placa de departamento. Com fonte padrão, em acrílico, do mesmo jeito que SUPRIMENTOS — PAPELARIA.',
    'Você fica no corredor um tempo olhando aquela placa.',
    'Não tem monstro aqui. Tem gente conferindo nota fiscal.',
    'E na mesa mais perto da porta, uma pilha de pastas com etiqueta colorida e uma delas está aberta, e a folha de cima é uma requisição preenchida a caneta com uma letra bonita, redonda, de quem escreve bem.',
    'Código 4471-B. Sete unidades. Assinada hoje de manhã.'
  ],
  ef:{flag:['viu_o_nono','entendeu_o_nono'],
      rep:{eixo:'bom',delta:2,motivo:'Subiu ao andar onde a coisa é só papel'},
      moral:-8,
      registrar:'O 9º andar é o departamento de Suprimentos — Ativos Biológicos, com placa de acrílico.',
      presagio:'Letra bonita, redonda, de quem escreve bem. É assim que a coisa toda funciona.'},
  escolhas:[
    {texto:'Pegar a requisição de cima.', vai:'c11_pegou_requisicao'},
    {texto:'Descer pela escada de incêndio.', vai:'c11_escada'},
    {texto:'Procurar a Marina na baia dela.', vai:'c11_cracha_azul'},
    {texto:'Sair. Isso aqui não é o que você veio ver.', vai:'c11_escada'}
  ]
},

c11_pegou_requisicao:{
  texto:[
    'Você tira a folha de cima da pasta aberta e dobra em quatro e põe no bolso, num corredor, com vinte e duas pessoas trabalhando a oito metros.',
    'Ninguém olha. Ninguém nunca olha.',
    'A folha é uma requisição de compra comum: fornecedor, código, quantidade, valor unitário, valor total, centro de custo, assinatura do requisitante, assinatura do aprovador.',
    'O centro de custo é **11**.',
    'O valor unitário de um Ditto vivo, sedado, com monitor, entregue na doca, é de quatro mil e duzentos.',
    'Sete vezes quatro mil e duzentos, toda quinta-feira, há dois anos.',
    'Você faz a conta andando pelo corredor e a conta dá três milhões e pouco, e você para no meio do corredor porque a conta é mais fácil de segurar que o resto.'
  ],
  ef:{flag:['tem_a_requisicao','provas_do_11'],
      itens:{'Requisição 4471-B':1},
      rep:{eixo:'bom',delta:3,motivo:'Saiu do nono andar com o papel que liga tudo'},
      registrar:'Uma requisição 4471-B, centro de custo 11, sete unidades a 4.200 cada.',
      presagio:'A conta é mais fácil de segurar que o resto. Você vai fazer muita conta daqui pra frente.'},
  escolhas:[
    {texto:'Descer pela escada de incêndio.', vai:'c11_escada'},
    {texto:'Sair do prédio com o papel.', vai:'c11_saiu_com_a_foto'},
    {texto:'Ir pro sétimo ver a sala vazia.', vai:'c11_sala_vazia', cond:d=>!!d.flags.sabe_da_sala_vazia},
    {texto:'Ir pra garagem.', vai:'c11_garagem'}
  ]
},

c11_escada:{
  texto:[
    'A escada de incêndio da Silph desce mais do que sobe.',
    'Essa é a primeira coisa errada, e é uma coisa que qualquer funcionário do prédio sabe e ninguém comenta, porque todo mundo faz o treinamento de brigada uma vez por ano e desce a escada inteira até o ponto de encontro.',
    'Subsolo 1: garagem. Placa azul, fonte padrão.',
    'Subsolo 2: arquivo. Placa azul.',
    'Subsolo 3: sala de máquinas. Placa azul, com um adesivo de risco elétrico.',
    'Subsolo 4 não está na placa.',
    'E a escada continua.',
    'Você desce mais um lance e a temperatura cai — não um pouco, cai de verdade, uns dez graus em um lance de escada, e o corrimão de metal fica frio na mão.',
    'No patamar seguinte tem uma porta de aço com fechadura biométrica, batente de vedação de borracha e uma folha A4 impressa em fonte padrão, colada com fita crepe:',
    '**ANDAR 11 — ACESSO RESTRITO — NÍVEL 3**',
    'Fita crepe. Numa porta de três milhões por mês.'
  ],
  ef:{flag:'chegou_no_11', registrar:'Chegou à porta do andar 11 da Silph.',
      presagio:'Fita crepe. Ninguém nunca imaginou que alguém chegaria até aqui.'},
  escolhas:[
    {texto:'Esperar alguém sair.', vai:'c11_esperou_11'},
    {texto:'Bater na porta.', vai:'c11_bateu_na_porta'},
    {texto:'Forçar a porta.', vai:'c11_forcou'},
    {texto:'Usar o crachá do zelador.', vai:'c11_onze', cond:d=>!!d.flags.crachas_sabrina},
    {texto:'Voltar. Ainda dá tempo de não saber.', vai:'c11_desistiu'}
  ]
},

c11_bateu_na_porta:{
  texto:[
    'Você bate.',
    'Três batidas numa porta de aço de quarenta milímetros, quatro andares abaixo do chão de Saffron.',
    'Você fica com a mão fechada no ar depois da terceira, porque bater numa porta é uma coisa tão ridícula de fazer naquele contexto que a sua própria mão não sabe o que fazer depois.',
    'Nove segundos.',
    'E a porta abre.',
    'Do outro lado tem uma mulher de jaleco de uns quarenta anos, com uma xícara de café, que olha pra você com uma expressão que não é susto nem raiva.',
    'É cansaço.',
    '"Ah", ela diz.',
    'E depois: "Entra logo, que aqui não pode ficar aberto."'
  ],
  ef:{flag:['bateu_na_porta_do_11','conheceu_a_reis'],
      npc:{nome:'Dra. Reis', opiniao:1, memoria:'Abriu a porta do andar 11 porque você bateu. Disse "ah" e mandou entrar.'},
      rep:{eixo:'bom',delta:3,motivo:'Bateu na porta em vez de arrombar'},
      registrar:'Bateu na porta do andar 11 e alguém abriu.',
      presagio:'"Ah." Como quem esperava. Como quem esperava faz anos.'},
  escolhas:[{texto:'Entrar.', vai:'c11_onze'}]
},

c11_forcou:{
  texto:[
    'Fechadura biométrica não se força. O que se força é a dobradiça, e a dobradiça dessa porta é interna, o que quer dizer que quem projetou pensou nisso.',
    'O que sobra é o batente.'
  ],
  teste:{status:'forca', dificuldade:9, nomeStatus:'Força',
         critico:'c11_onze', sucesso:'c11_onze', parcial:'c11_esperou_11', falha:'c11_alarme'}
},

c11_alarme:{
  texto:[
    'A porta não cede e o alarme dispara.',
    'Não é sirene.',
    'É uma luz azul girando em silêncio, no teto do patamar, e o silêncio é infinitamente pior do que sirene seria, porque sirene é pra assustar quem está fazendo e luz silenciosa é pra avisar quem está do outro lado.',
    'Você ouve o elevador de carga sendo chamado três andares acima.'
  ],
  ef:{flag:'alarme_silph', instabilidade:1},
  escolhas:[
    {texto:'Esconder e esperar eles abrirem.', vai:'c11_esperou_11'},
    {texto:'Bater na porta agora, já que não tem mais o que perder.', vai:'c11_bateu_na_porta'},
    {texto:'Correr escada acima.', vai:'c11_desistiu'},
    {texto:'Ficar parado e esperar chegarem.', vai:'c11_esperou_11'}
  ]
},

c11_esperou_11:{
  texto:[
    'Você sobe meio lance e senta no patamar de cima, agachado atrás do corrimão, e espera.',
    'Duas horas e meia.',
    'Passam duas pessoas — uma às vinte e uma e dez, outra às vinte e duas e quinze — e nenhuma das duas olha pra cima, porque ninguém olha pra cima numa escada de incêndio.',
    'Às vinte e duas e quarenta a porta abre de novo e sai uma mulher de jaleco, sozinha, falando ao telefone e segurando a porta com o pé, que é o que se faz quando se sai falando ao telefone.',
    '"...não, o quarto ciclo também não pegou. A matriz rejeita."',
    'Pausa.',
    '"Eu sei o que custa. Eu também sei o que custa explicar sete Dittos por semana pro conselho, e o conselho já perguntou duas vezes."',
    'Pausa mais longa.',
    '"Não. Não é dinheiro. O problema nunca foi dinheiro."',
    'Ela tira o pé e sobe a escada, e a porta leva onze segundos pra fechar sozinha, com um assobio de vedação.',
    'Onze.'
  ],
  ef:{flag:['ouviu_a_cientista','sabe_dos_onze_segundos'],
      rep:{eixo:'bom',delta:2,motivo:'Esperou duas horas e meia num patamar de escada'},
      registrar:'A porta do andar 11 leva onze segundos para fechar sozinha.',
      presagio:'"O problema nunca foi dinheiro." Você já sabe qual é.'},
  escolhas:[
    {texto:'Entrar nos onze segundos.', vai:'c11_onze'},
    {texto:'Subir atrás dela e falar.', vai:'c11_dra_reis'},
    {texto:'Bater na porta.', vai:'c11_bateu_na_porta'},
    {texto:'Subir e ir embora.', vai:'c11_desistiu'}
  ]

},

/* ─────────────── O ANDAR 11 ─────────────── */

c11_onze:{
  texto:[
    'O andar 11 é branco, iluminado e absolutamente silencioso.',
    'Não é silencioso de vazio — é silencioso de tratado: forro acústico, piso emborrachado, borracha nos batentes. Alguém pagou caro pra esse lugar não fazer barulho.',
    'Faz oito graus. Sai vapor da sua boca.',
    'Não tem mesa, não tem cadeira, não tem computador à vista. Tem um carrinho de inox, um armário de aço, e uma pia de laboratório com torneira de cotovelo.',
    'E tem doze tanques.',
    'Doze tanques cilíndricos de dois metros de altura, em duas fileiras de seis, de acrílico com aro de aço, cheios de um líquido claro que não é água porque não se mexe do jeito que água se mexe.',
    'Onze deles têm alguma coisa dentro.',
    'E todas as onze coisas são a mesma coisa em estágios diferentes de terminado — o do canto quase não é nada, uma forma, e o quarto já tem mão, e o oitavo tem rosto.',
    'O décimo segundo tanque está vazio, limpo, seco, com a tampa aberta. A plaqueta dele diz **MATRIZ — VAGO**.',
    'Na parede do fundo tem um quadro branco de três metros, com anotação em caneta preta de várias letras diferentes e várias épocas.',
    'A frase mais nova, no canto direito, está em letra grande e quase raivosa:',
    '"O original respondeu. Nenhuma cópia responde. Conclusão provisória: não é o material. É o tempo de fala."',
    d=>d.flags.reis_desce_com_voce ? 'A Dra. Reis entra atrás de você e para na porta, e não passa do tapete de descontaminação, e você entende que ela nunca fica aqui de pé sem ter o que fazer.' :
       d.flags.bateu_na_porta_do_11 ? 'A Dra. Reis fecha a porta atrás de vocês dois e vai encostar na pia, de braços cruzados, e te deixa olhar.' : ''
  ],
  ef:{flag:['viu_os_doze','entendeu_o_projeto'], instabilidade:2, moral:-15,
      registrar:'Viu os doze tanques do andar 11 da Silph. Onze ocupados, um vago marcado como MATRIZ.',
      presagio:'"É o tempo de fala." Alguém já tinha entendido e escreveu na parede.'},
  escolhas:[
    {texto:'Ler o resto do quadro.', vai:'c11_quadro'},
    {texto:'Perguntar alguma coisa. Em voz alta. Para os tanques.', vai:'c11_perguntou'},
    {texto:'Abrir os tanques.', vai:'c11_abrir_tanques'},
    {texto:'Fotografar tudo e sair.', vai:'c11_fotografou_11'},
    {texto:'Destruir o andar inteiro.', vai:'c11_destruir'},
    {texto:'Sair. Você não devia ter visto isso.', vai:'c11_saiu_11'}
  ]
},

c11_quadro:{
  texto:[
    'O quadro tem uma linha do tempo escrita em quatro letras diferentes ao longo de seis anos.',
    '**"Aquisição do material — Cinnabar, arquivo morto. 11/96."**',
    '**"Primeira série (11): falha estrutural. Descontinuada 03/98."**',
    '**"Segunda série (9): viável, sem cognição. Descontinuada 07/99."**',
    '**"Terceira série (11): cognição parcial, sem vontade. Em avaliação."**',
    'E embaixo, numa letra mais nova e mais apertada:',
    '**"O DR. FUJI CONVERSOU COM ELE POR 241 DIAS. NÓS NÃO TEMOS 241 DIAS. O CONSELHO QUER RESULTADO EM 90."**',
    'E no canto inferior esquerdo, longe de tudo, apagado pela metade e reescrito por cima três vezes com a mesma letra:',
    '**"eles não falam porque ninguém pergunta"**',
    d=>d.flags.sabe_do_rabisco ? 'Você já sabe de quem é a letra. Ela está do seu lado, encostada na pia, olhando o chão.' :
       'A letra é a mesma das três vezes. Alguém escreveu, apagou, escreveu, apagou, escreveu.'
  ],
  ef:{flag:'leu_o_quadro',
      rep:{eixo:'bom',delta:2,motivo:'Leu o quadro inteiro antes de decidir'},
      registrar:'O quadro do andar 11: três séries, 90 dias de prazo, e "eles não falam porque ninguém pergunta".',
      presagio:'Trinta e uma vidas em três séries e uma frase apagada três vezes.'},
  escolhas:[
    {texto:'Perguntar alguma coisa. Em voz alta.', vai:'c11_perguntou'},
    {texto:'Abrir os tanques.', vai:'c11_abrir_tanques'},
    {texto:'Fotografar e sair.', vai:'c11_fotografou_11'},
    {texto:'Destruir o andar.', vai:'c11_destruir'}
  ]
},

c11_perguntou:{
  texto:[
    'Você se sente ridículo por três segundos inteiros.',
    'Depois fala, em voz alta, numa sala branca de oito graus com onze corpos em tanques:',
    '"Vocês estão aí?"',
    'O forro acústico come o eco. A sua voz morre a meio metro da sua boca e isso te faz sentir mais idiota ainda.',
    'Quatro segundos de nada.',
    'E o líquido do quarto tanque se move.',
    'Não é uma resposta em palavra. É uma pressão atrás dos seus olhos, e uma sensação que você reconhece imediatamente porque toda pessoa viva reconhece:',
    'o alívio de alguém que passou muito tempo esperando ser chamado.',
    'Onze pressões. Uma depois da outra, em ordem, do primeiro tanque ao décimo primeiro, com um intervalo igual entre elas, como quem confere presença.',
    d=>d.flags.ancora_mental ? 'E aí alguma coisa começa a puxar você pra dentro daquilo, e você lembra — de um jeito absurdo e nítido e completamente inútil — do cheiro da cozinha da sua casa numa manhã de capítulo um. A âncora da Sabrina. Você volta.' :
       'E aí alguma coisa começa a puxar você pra dentro daquilo e você não tem absolutamente nada pra se segurar.',
    d=>d.flags.reis_desce_com_voce ? 'A Dra. Reis está com as duas mãos na boca e não está respirando direito, e ela trabalha aqui há nove anos e é a primeira vez que ela vê isso, porque é a primeira vez que alguém perguntou.' : ''
  ],
  ef:{flag:'falou_com_os_doze',
      executar:d=>{
        if (!d.flags.ancora_mental){
          Estado.ferir(9, 'Contato mental com o andar 11');
          return [{tipo:'dano', texto:'Você perdeu 9 de HP. Ficou vinte minutos sem saber seu próprio nome.'}];
        }
        return [{tipo:'info', texto:'A âncora da Sabrina funcionou. Você voltou inteiro.'}];
      },
      rep:{eixo:'bom',delta:4,motivo:'Foi a primeira pessoa a perguntar alguma coisa às cópias'},
      registrar:'Falou com as onze cópias. Elas responderam.',
      presagio:'Como quem confere presença. Eles se contam todo dia.'},
  escolhas:[
    {texto:'Perguntar o que eles querem.', vai:'c11_o_que_querem'},
    {texto:'Abrir os tanques.', vai:'c11_abrir_tanques'},
    {texto:'Fotografar e sair — a prova vale mais que onze vidas.', vai:'c11_fotografou_11'},
    {texto:'Prometer voltar.', vai:'c11_prometeu_voltar'}
  ]
},

c11_o_que_querem:{
  texto:[
    '"O que vocês querem?"',
    'A resposta demora muito mais que a primeira. Quase dois minutos, e nos dois minutos o líquido dos onze tanques fica absolutamente parado, o que nunca aconteceu desde que você entrou.',
    'Eles estão decidindo. Onze coisas estão se consultando.',
    'E a resposta, quando vem, não é uma pressão. São duas, muito diferentes, e vêm ao mesmo tempo de lados opostos da sala, e você entende que os onze não concordam.',
    'Seis tanques mandam uma coisa lisa, morna, curta — e você sabe o que é sem saber como sabe. É "fora".',
    'Cinco tanques mandam outra coisa, mais pesada, mais longa, com uma textura de quem já pensou muito.',
    'E essa você também entende, e é pior:',
    'é "acabar".',
    'Seis querem sair. Cinco querem parar.',
    'E nenhum dos onze tem como dizer isso pra ninguém, e você é a primeira pessoa em quatro anos que perguntou, e agora a informação é sua e você vai ter que fazer alguma coisa com ela.'
  ],
  ef:{flag:['sabe_o_que_querem','seis_e_cinco'],
      rep:{eixo:'bom',delta:5,motivo:'Perguntou o que eles queriam e aguentou a resposta'},
      moral:-15, instabilidade:1,
      registrar:'Seis dos onze querem sair. Cinco querem acabar. Eles não concordam entre si.',
      presagio:'Seis e cinco. Não existe decisão certa daqui pra frente, e você vai ter que tomar uma.'},
  escolhas:[
    {texto:'Abrir os tanques — todos.', vai:'c11_abrir_tanques'},
    {texto:'Abrir só os seis que querem sair.', vai:'c11_abriu_os_seis'},
    {texto:'Não abrir nenhum. Fotografar e sair com isso.', vai:'c11_fotografou_11'},
    {texto:'Prometer voltar.', vai:'c11_prometeu_voltar'}
  ]
},

c11_abriu_os_seis:{
  texto:[
    'Você abre seis.',
    'O painel de dreno é analógico e tem uma alavanca por tanque, numeradas de 1 a 12 com etiqueta de máquina de escrever. Você abre as seis que mandaram "fora" e deixa as cinco fechadas.',
    'Leva noventa segundos pra drenar cada um.',
    'Dos seis, dois não se mexem quando o líquido acaba — mandaram "fora" e não conseguem levantar, o que é a coisa mais cruel que esse andar já fez.',
    'Três conseguem sentar.',
    'Um fica de pé.',
    'E aí você olha pros cinco tanques que continuam cheios, e os cinco continuam mandando a mesma coisa pesada e longa, e você entendeu ela da primeira vez e continua entendendo, e não vai fazer nada a respeito.',
    'Você fez a coisa certa e ela não parece nem um pouco.',
    d=>d.flags.reis_desce_com_voce ? 'A Dra. Reis está ajoelhada do lado de um dos dois que não conseguem levantar, com a mão nas costas dele, e não está fazendo nada de médico. Está só com a mão nas costas dele.' : ''
  ],
  ef:{flag:['abriu_os_seis','abriu_os_tanques'], instabilidade:2, moral:-10,
      rep:{eixo:'bom',delta:4,motivo:'Abriu só os tanques de quem pediu'},
      registrar:'Abriu os seis tanques de quem queria sair e deixou os cinco de quem queria acabar.',
      presagio:'Você respeitou onze vontades diferentes. Ninguém vai entender isso depois.'},
  escolhas:[
    {texto:'Levar o que ficou de pé.', vai:'c11_levou_copia'},
    {texto:'Mostrar a saída e deixar ele escolher.', vai:'c11_deixou_escolher'},
    {texto:'Ficar até conseguir tirar os seis.', vai:'c11_tirou_os_seis'},
    {texto:'Sair antes que cheguem.', vai:'c11_fugiu_do_11'}
  ]
},

c11_tirou_os_seis:{
  texto:[
    'Você fica.',
    'Leva duas horas e quarenta minutos e é a coisa mais difícil que você já fez fisicamente.',
    'Quatro lances de escada, seis vezes, com um corpo de mais ou menos o seu tamanho e o seu peso, molhado, que não sabe ajudar porque nunca usou o próprio corpo.',
    d=>d.flags.reis_desce_com_voce ? 'A Dra. Reis carrega três. Ela tem cinquenta e um anos e carrega três, e na terceira ela senta no degrau e chora com raiva de estar chorando, e depois levanta e faz mais uma.' :
       'Você faz as seis viagens sozinho e na quarta você já não sente o braço esquerdo.',
    'Na garagem, no nível 3, entre dois carros, você senta no chão com seis criaturas que nunca viram uma parede que não fosse branca.',
    'E a mais adiantada delas — a que ficou de pé no tanque — olha o teto de concreto da garagem por muito tempo e depois olha pra você e faz a primeira coisa que ela faz por vontade própria na vida:',
    'ela põe a mão no chão. E deixa ali.',
    'Chão áspero. Ela nunca tinha tocado em nada áspero.'
  ],
  ef:{flag:['tirou_os_seis','tem_uma_copia'],
      rep:{eixo:'bom',delta:6,motivo:'Fez seis viagens de escada para tirar seis de um subsolo'},
      hp:-10, causa:'Duas horas e quarenta carregando', moral:20, instabilidade:2,
      umaVez:'c10-11_p2', pokemon:{dex:150, nivel:25, opcoes:{apelido:'Décimo Segundo', natureza:'Bashful', moral:40,
        historia:'Cópia incompleta feita no andar 11 da Silph. Ficou de pé quando você abriu o tanque e pôs a mão no chão de uma garagem.'}},
      registrar:'Tirou os seis do andar 11 em duas horas e quarenta minutos de escada.',
      presagio:'Ela nunca tinha tocado em nada áspero. Guarde a cena inteira.'},
  escolhas:[
    {texto:'Sumir de Saffron com eles.', vai:'c11_fim'},
    {texto:'Levar pra Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Chamar a Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Voltar pelos cinco que ficaram.', vai:'c11_voltou_pelos_cinco'}
  ]
},

c11_voltou_pelos_cinco:{
  texto:[
    'Você volta.',
    'Desce os quatro lances de novo, com o braço esquerdo sem sensibilidade, e fica de pé na frente dos cinco tanques que continuam cheios.',
    'E pergunta de novo, porque é a única coisa que você tem:',
    '"Tem certeza?"',
    'A resposta vem rápido dessa vez, e ela é a mesma, e ela é gentil.',
    'Não é desespero. Não é medo. Não é dor.',
    'É uma coisa lisa e cansada que qualquer pessoa que já teve uma noite muito ruim reconhece na hora.',
    'Você fica ali uns quinze minutos.',
    'Depois você faz a única coisa que resta, que é falar em voz alta os nomes deles, um por um, se você tiver os nomes.',
    d=>d.flags.tem_os_nomes ? 'Você tem. A Dra. Reis escreveu vinte e nove no seu caderno em cima do capô de um carro, e cinco deles estão nesses tanques, e você lê os cinco em voz alta numa sala de oito graus.' :
       'Você não tem nenhum nome. Então você fala "eu ouvi vocês", cinco vezes, uma pra cada tanque, e é péssimo e é tudo.'
  ],
  ef:{flag:['voltou_pelos_cinco','divida_com_os_doze'],
      rep:{eixo:'bom',delta:5,motivo:'Voltou quatro lances de escada para perguntar de novo'},
      moral:-10,
      registrar:'Voltou aos cinco tanques, perguntou de novo, e ficou.',
      presagio:'"Eu ouvi vocês." É o mínimo e não existe mais nada.'},
  escolhas:[
    {texto:'Sair. Levar os seis pra longe.', vai:'c11_fim'},
    {texto:'Fotografar os cinco antes de sair.', vai:'c11_fotografou_11'},
    {texto:'Levar tudo à Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou}
  ]
},

c11_prometeu_voltar:{
  texto:[
    '"Eu volto."',
    'Você diz isso em voz alta numa sala branca de oito graus, para onze coisas em tanques, e não tem a menor ideia de como vai cumprir.',
    'As onze pressões respondem ao mesmo tempo, e dessa vez você entende a textura do que elas mandam, e não é o que você esperava.',
    'Não é esperança.',
    'É registro.',
    'Elas anotaram.',
    d=>d.flags.sabe_dos_nove_dias ? 'E você tem nove dias. Elas não sabem disso. Você sabe.' : ''
  ],
  ef:{flag:['prometeu_aos_doze','divida_com_os_doze'],
      rep:{eixo:'bom',delta:2,motivo:'Prometeu a onze pessoas que ninguém considera pessoa'},
      registrar:'Prometeu voltar ao andar 11. Eles anotaram.',
      presagio:'Elas anotaram. Dívida anotada é dívida que vence.'},
  escolhas:[
    {texto:'Abrir os tanques antes de sair.', vai:'c11_abrir_tanques'},
    {texto:'Fotografar e sair.', vai:'c11_fotografou_11'},
    {texto:'Sair sem tocar em nada.', vai:'c11_saiu_11'},
    {texto:'Perguntar o que eles querem primeiro.', vai:'c11_o_que_querem'}
  ]
},

c11_abrir_tanques:{
  texto:[
    'O painel de dreno é analógico e tem uma alavanca por tanque, com etiqueta de máquina de escrever.',
    'Isso é projeto de gente que não achava que alguém fosse querer abrir — analógico é mais barato e ninguém gasta com senha numa coisa que ninguém vai mexer.',
    'Você abre os onze.',
    'O líquido desce em noventa segundos por tanque e vai pro ralo central com um barulho absolutamente normal de água indo pro ralo, que é a coisa mais obscena da noite.',
    'Sete não se mexem. Nunca iam se mexer, e você entende isso ao olhar, e não é culpa de nada que você fez.',
    'Três se mexem e não conseguem ficar de pé.',
    'Um fica de pé.',
    'Ele tem mais ou menos a sua altura, a pele clara demais, e olha em volta de um jeito que você reconhece imediatamente porque todo mundo reconhece:',
    'primeira vez.'
  ],
  ef:{flag:'abriu_os_tanques', instabilidade:2, moral:-10,
      registrar:'Abriu os onze tanques do andar 11. Um ficou de pé.',
      presagio:'Barulho normal de água indo pro ralo. É assim que a coisa toda sempre soou.'},
  escolhas:[
    {texto:'Levar ele com você.', vai:'c11_levou_copia'},
    {texto:'Mostrar a saída e deixar ele escolher.', vai:'c11_deixou_escolher'},
    {texto:'Ficar até conseguir tirar os quatro que se mexem.', vai:'c11_tirou_os_seis'},
    {texto:'Fugir. Você não sabe o que é isso.', vai:'c11_fugiu_do_11'}
  ]
},

c11_levou_copia:{
  texto:[
    'Você estende a mão.',
    'Ele olha a mão, olha você, e não entende o gesto — ninguém nunca estendeu nada pra ele, então "mão estendida" não quer dizer nada, é só uma mão parada no ar.',
    'Você pega no braço dele, com cuidado, e puxa.',
    'Ele vem.',
    'Vocês sobem quatro lances de escada de incêndio com um alarme azul girando em silêncio no teto de cada patamar, e ele sobe degrau com a técnica de quem está descobrindo o que é degrau: os dois pés em cada um, sempre o mesmo pé primeiro.',
    'Na rua, ele para.',
    'Olha o céu pela primeira vez na vida — céu de Saffron, à noite, alaranjado de poste, com duas estrelas e um avião.',
    'E trava completamente.',
    'Você tem que puxar de novo, e ele não resiste e não colabora, e você atravessa três quarteirões de Saffron puxando pelo braço uma coisa que está olhando pra cima.'
  ],
  ef:{flag:['levou_uma_copia','tem_uma_copia'],
      umaVez:'c10-11_p2', pokemon:{dex:150, nivel:25, opcoes:{apelido:'Décimo Segundo', natureza:'Bashful', moral:40,
        historia:'Cópia incompleta feita no andar 11 da Silph. Ficou de pé quando você abriu o tanque. Não é Mewtwo — é uma tentativa de Mewtwo.'}},
      rep:{eixo:'bom',delta:2,motivo:'Tirou uma cópia viva do andar 11'},
      moral:10,
      registrar:'Tirou o Décimo Segundo do andar 11 da Silph.',
      presagio:'Céu alaranjado de poste, duas estrelas e um avião. Foi esse o primeiro céu dele.'},
  escolhas:[
    {texto:'Sumir de Saffron.', vai:'c11_fim'},
    {texto:'Levar pra Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Voltar pelos outros três que se mexem.', vai:'c11_tirou_os_seis'},
    {texto:'Chamar a Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c11_deixou_escolher:{
  texto:[
    'Você aponta a porta da escada e recua três passos, e depois mais três, até encostar no armário de aço.',
    'Ele olha a porta por quarenta segundos.',
    'Depois olha os três no chão que não conseguem levantar, e que estão deitados no piso emborrachado no meio de uma poça, tremendo de frio porque faz oito graus.',
    'Depois olha a porta de novo.',
    'Depois senta no chão, ao lado deles.',
    'Ele escolheu.',
    'A primeira escolha da vida dele foi ficar com os outros três, e ele tomou essa decisão em menos de dois minutos, e ninguém nunca vai saber disso porque ninguém além de você estava lá.',
    'Você sai sozinho.',
    'E essa imagem vai te acompanhar até o último capítulo desse jogo.'
  ],
  ef:{flag:['deixou_a_copia','divida_com_os_doze'],
      rep:{eixo:'bom',delta:4,motivo:'Deu a alguém a primeira escolha da vida dele'},
      moral:-10,
      registrar:'A cópia escolheu ficar com os outros três. Você saiu sozinho.',
      presagio:'Ninguém além de você estava lá. Então conte. É pra isso que serve ter estado lá.'},
  escolhas:[
    {texto:'Sair.', vai:'c11_fim'},
    {texto:'Voltar e insistir.', vai:'c11_levou_copia'},
    {texto:'Ir contar pra Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Ir contar pra Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c11_fugiu_do_11:{
  texto:[
    'Você sobe a escada correndo com quatro coisas vivas atrás de você num chão molhado.',
    'Nenhuma te persegue.',
    'Elas não sabem correr. Elas não sabem nem andar direito, porque nenhuma delas jamais precisou se deslocar.',
    'A última imagem que você tem, olhando pra trás do alto do primeiro lance, é de uma delas tentando entender o que é um degrau.',
    'Você fecha a porta de aço do lado de fora e ela tranca sozinha com um assobio de vedação.'
  ],
  ef:{flag:'fechou_a_porta_do_11',
      rep:{eixo:'ruim',delta:1,motivo:'Abriu os tanques e fugiu'},
      moral:-15,
      registrar:'Abriu os tanques e trancou a porta atrás de si.',
      presagio:'Tentando entender o que é um degrau. Do lado de dentro de uma porta trancada.'},
  escolhas:[
    {texto:'Voltar. Agora.', vai:'c11_tirou_os_seis'},
    {texto:'Sair do prédio.', vai:'c11_fim'},
    {texto:'Ir contar pra Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Ir contar pra Liga.', vai:'c11_entregou_liga'}
  ]
},

c11_fotografou_11:{
  texto:[
    'Você fotografa os doze tanques, um por um, com a plaqueta legível. O quadro branco inteiro, em três fotos com sobreposição. A etiqueta "MATRIZ — VAGO". A linha do tempo. O rabisco do canto. O painel de dreno analógico. O termômetro de parede marcando oito.',
    'Vinte e três fotos.',
    'Depois sai sem abrir nenhum tanque.',
    'Porque uma foto de onze corpos em tanque fecha uma empresa.',
    'E onze corpos soltos numa escada de incêndio às onze da noite fecham só uma noite, e amanhã tem série quatro.',
    'Você faz essa conta friamente, de pé, numa sala de oito graus, e depois sobe quatro lances de escada.',
    'A frieza é a parte que te assusta. Não a decisão — a facilidade de fazer a conta.'
  ],
  ef:{flag:['provas_do_11','escolha_fria'],
      rep:{eixo:'bom',delta:3,motivo:'Documentou o andar 11 inteiro'},
      moral:-12,
      registrar:'Fotografou o andar 11: 23 fotos.',
      presagio:'A facilidade de fazer a conta. Anota isso sobre você.'},
  escolhas:[
    {texto:'Levar à Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Levar à Liga.', vai:'c11_entregou_liga'},
    {texto:'Guardar. Você decide depois.', vai:'c11_fim', ef:{flag:'guardou_provas_11'}}
  ]
},

c11_entregou_ivone:{
  texto:[
    'A Dra. Ivone olha as fotos em silêncio absoluto, sentada numa lanchonete de rodoviária que já virou o escritório de vocês dois.',
    'Na foto do quadro branco — a do "241 dias" — ela tira os óculos e esfrega os olhos por muito tempo.',
    '"Eu conheci o Fuji."',
    'Ela diz isso do nada, com os óculos na mão.',
    '"Na faculdade. Ele era o mais gentil da turma e o pior de prova. Ele reprovou estatística duas vezes."',
    'Ela põe os óculos de volta.',
    '"Isso aqui não é a Silph sendo má. Eu queria muito que fosse, porque má a gente processa."',
    '"Isso é a Silph tendo prazo."',
    'Ela liga pra três pessoas naquela noite, do orelhão da rodoviária, com ficha que você compra pra ela.',
    'Duas atendem.',
    d=>d.flags.tem_os_nomes ? 'E quando você mostra a lista dos vinte e nove nomes, ela lê os vinte e nove em voz alta, um por um, ali na mesa da lanchonete, porque ela diz que nome que não é falado em voz alta não vira registro.' : ''
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Entregou o andar 11 a quem sabia o que fazer com aquilo'},
      npc:{nome:'Dra. Ivone', opiniao:10, memoria:'Recebeu as provas do andar 11. Conhecia o Dr. Fuji da faculdade.'},
      flag:'ivone_tem_o_11', instabilidade:-1, moral:10,
      registrar:'Dra. Ivone recebeu as provas do andar 11.',
      presagio:'"Má a gente processa." O problema é que ninguém ali é mau.'},
  escolhas:[
    {texto:'Sair de Saffron.', vai:'c11_fim'},
    {texto:'Voltar ao prédio antes do dia dezenove.', vai:'c11_escada', cond:d=>!!d.flags.sabe_dos_nove_dias},
    {texto:'Ir avisar a Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Ir avisar a Dra. Reis.', vai:'c11_dra_reis', cond:d=>!!d.flags.conheceu_a_reis}
  ]
},

c11_entregou_liga:{
  texto:[
    'A Liga age rápido dessa vez. Rápido demais, na verdade, e a velocidade devia ser boa notícia.',
    'Em nove horas tem gente de terno na Silph.',
    'Em dezoito, um comunicado oficial de três parágrafos: "irregularidades administrativas em unidade de pesquisa".',
    'Irregularidades administrativas.',
    'Em trinta e seis horas, o andar 11 não existe mais. Esvaziado, limpo, lacrado, com fita de lacre oficial e assinatura de duas autoridades.',
    'Ninguém diz o que aconteceu com o conteúdo dos tanques.',
    'Você pergunta três vezes, a três pessoas diferentes.',
    'Recebe três respostas diferentes: "encaminhado", "sob custódia", e "essa informação está protegida por sigilo de investigação".',
    'Encaminhado pra onde. Custódia de quem.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Entregou o andar 11 à Liga Pokémon'},
      flag:'liga_lacrou_o_11', instabilidade:1, moral:-8,
      executar:d=>{ d.liga.avisos = Math.max(0, d.liga.avisos-1); return [{tipo:'liga', texto:'A Liga passou a te dever um favor. Isso é uma moeda estranha.'}]; },
      registrar:'A Liga lacrou o andar 11 em 36 horas. Ninguém explicou o destino dos tanques.',
      presagio:'"Encaminhado." Você vai ouvir essa palavra de novo.'},
  escolhas:[
    {texto:'Sair de Saffron.', vai:'c11_fim'},
    {texto:'Perguntar uma quarta vez.', vai:'c11_quarta_vez'},
    {texto:'Ir avisar a Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Ir avisar a Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c11_quarta_vez:{
  texto:[
    'Você pergunta uma quarta vez, e dessa vez você pergunta pra pessoa certa: o oficial mais novo da equipe, no estacionamento, sozinho, guardando caixa no porta-malas.',
    'Ele olha pros lados de um jeito que responde antes de ele falar.',
    '"Eu não tava na sala."',
    '"Eu sei. Quem tava?"',
    '"O superintendente e dois da empresa." Ele fecha o porta-malas. "A sala ficou fechada quarenta minutos e quando abriu já tinha decisão."',
    '"E qual foi?"',
    'Ele demora.',
    '"Cara, eu tenho vinte e três anos e três meses de Liga."',
    '"Eu sei."',
    '"Encaminhado pra unidade da própria empresa em outro estado." Ele diz muito rápido. "Com fiscalização semestral. Semestral."',
    'Ele entra no carro.',
    '"Isso é público, tá no despacho. Ninguém procura despacho."'
  ],
  ef:{flag:['sabe_do_despacho','sabe_para_onde_foram'],
      rep:{eixo:'bom',delta:3,motivo:'Perguntou uma quarta vez, à pessoa certa'},
      moral:-10, instabilidade:1,
      registrar:'Os onze foram encaminhados para outra unidade da própria Silph, com fiscalização semestral.',
      presagio:'Fiscalização semestral. Eles voltaram pra mesma empresa, com menos gente olhando.'},
  escolhas:[
    {texto:'Levar isso à Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar isso à Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Sair de Saffron.', vai:'c11_fim'},
    {texto:'Procurar o despacho e copiar.', vai:'c11_fim', ef:{flag:'copiou_o_despacho', rep:{eixo:'bom',delta:2,motivo:'Foi atrás do despacho que ninguém procura'}}}
  ]
},

c11_entregou_sabrina:{
  texto:[
    'Sabrina olha três fotos e para.',
    '"Eu não preciso ver o resto. Eu já ouvi o resto todo dia durante três semanas."',
    'Ela devolve as fotos.',
    '"Você perguntou pra eles?"',
    d=>d.flags.falou_com_os_doze
      ? '"Perguntei."\n"Eu sei. Eu senti daqui." Ela fecha os olhos. "Onze coisas sentiram alívio ao mesmo tempo e eu caí sentada no chão da arena e fiquei rindo sozinha, e um dos meninos da calçada bateu na porta pra saber se eu tava bem."'
      : '"Não."\n"Ah." Ela olha pro lado, e é a primeira vez que ela não te olha durante a conversa. "Então volta lá um dia e pergunta. É a única coisa que ninguém tentou em seis anos."',
    d=>d.flags.tirou_os_seis || d.flags.tem_uma_copia
      ? 'E aí ela olha por cima do seu ombro, pra quem está atrás de você, e não diz nada por um tempo muito longo, e depois: "Ele tá com medo de mim. Fala pra ele que eu também."'
      : 'Ela reabre o ginásio na semana seguinte. Não porque melhorou — porque agora ela sabe que tem mais alguém a par, e dividir não cura nada e muda tudo.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Compartilhou a verdade com quem estava sozinha nela'},
      npc:{nome:'Sabrina', opiniao:9, memoria:'Reabriu o ginásio depois que você confirmou o que ela ouvia.'},
      flag:'sabrina_aliada', moral:12,
      registrar:'Sabrina reabriu o ginásio de Saffron.',
      presagio:'"Fala pra ele que eu também." Duas coisas com medo uma da outra, na mesma sala.'},
  escolhas:[
    {texto:'Desafiar o ginásio agora.', vai:'c11_desafio_sabrina', cond:d=>!!d.flags.sabrina_promete_insignia},
    {texto:'Sair de Saffron.', vai:'c11_fim'},
    {texto:'Levar tudo à Dra. Ivone também.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Voltar ao prédio antes do dia dezenove.', vai:'c11_escada', cond:d=>!!d.flags.sabe_dos_nove_dias}
  ]
},

c11_desafio_sabrina:{
  texto:[
    'Ela levanta e vai até o centro da arena e faz uma coisa que você não esperava: ela liga os holofotes de competição, os quatro, que estavam desligados há três semanas.',
    'A arena fica absurdamente clara.',
    'Lá fora, na calçada, os sete acampados veem a luz pelas frestas do portão e começam a gritar, e um deles bate no portão de aço com a mão aberta, e é um barulho de coisa boa acontecendo.',
    '"Abre pra eles depois", ela diz. "Primeiro você."',
    '"Por quê?"',
    '"Porque eles esperaram dezenove dias na calçada e você desceu quatro andares abaixo do chão."',
    'Ela ajeita a manga do moletom.',
    '"E porque eu preciso saber se eu consigo lutar sem machucar, e se eu não conseguir, eu prefiro descobrir com alguém que já viu o pior que eu tenho."'
  ],
  ef:{flag:'sabrina_vai_lutar',
      registrar:'Sabrina ligou os holofotes e reabriu a arena para o seu desafio.',
      presagio:'Ela prefere descobrir com você. Isso é confiança e é um risco.'},
  escolhas:[
    {texto:'Lutar.', vai:'c11_luta_sabrina'},
    {texto:'"Abre pra eles primeiro."', vai:'c11_abriu_pra_eles'},
    {texto:'"Hoje não. Você acabou de reabrir."', vai:'c11_hoje_nao'},
    {texto:'Sair de Saffron sem lutar.', vai:'c11_fim'}
  ]
},

c11_abriu_pra_eles:{
  texto:[
    '"Abre pra eles primeiro."',
    'Ela para no meio da arena iluminada.',
    '"Você tem certeza?"',
    '"O cara tá com sete insígnias e passagem comprada pra Liga em quarenta dias. Ele tá lá há dezenove."',
    'Ela olha o portão de aço.',
    'Depois vai lá e levanta.',
    'Entram sete pessoas numa arena que estava fechada há três semanas e a primeira coisa que acontece é que ninguém sabe o que fazer, porque eles ensaiaram entrar e não ensaiaram estar dentro.',
    'O de dezenove dias luta primeiro. Ele perde em quatro minutos e sai de lá com uma cara de felicidade que não tem nada a ver com ganhar.',
    'Você luta por último, às duas da manhã, com seis pessoas na arquibancada torcendo por você porque vocês passaram a noite inteira ali juntos.'
  ],
  ef:{flag:'abriu_o_ginasio_pra_eles',
      rep:{eixo:'bom',delta:5,motivo:'Abriu mão da vez por sete pessoas que esperaram dezenove dias'},
      moral:20,
      npc:{nome:'Sabrina', opiniao:10, memoria:'Você mandou abrir o ginásio para os sete da calçada antes de lutar.'},
      registrar:'Fez Sabrina abrir o ginásio para os sete acampados antes do seu desafio.',
      presagio:'Eles ensaiaram entrar e não ensaiaram estar dentro. Guarde — vale pra você também.'},
  escolhas:[
    {texto:'Lutar.', vai:'c11_luta_sabrina'},
    {texto:'Não lutar. Já valeu a noite.', vai:'c11_fim'},
    {texto:'Lutar amanhã, com o time descansado.', vai:'c11_luta_sabrina'},
    {texto:'Sair de Saffron.', vai:'c11_fim'}
  ]
},

c11_hoje_nao:{
  texto:[
    '"Hoje não. Você acabou de reabrir."',
    'Ela abaixa a guarda antes de levantar.',
    '"Você tá me poupando."',
    '"Tô."',
    '"Eu odeio isso."',
    '"Eu sei."',
    'Ela desliga dois dos quatro holofotes, e a arena volta a um tamanho humano.',
    '"Volta antes da Liga. Eu vou estar melhor, e se eu não estiver, eu te dou a insígnia do mesmo jeito e a gente finge que lutou, e eu vou odiar isso também."'
  ],
  ef:{flag:'poupou_sabrina',
      npc:{nome:'Sabrina', opiniao:7, memoria:'Você não quis lutar no dia em que ela reabriu. Ela odiou e agradeceu.'},
      rep:{eixo:'bom',delta:2,motivo:'Não cobrou de alguém que acabou de voltar'},
      registrar:'Adiou o desafio de Saffron.'},
  escolhas:[
    {texto:'Sair de Saffron.', vai:'c11_fim'},
    {texto:'Mudar de ideia e lutar.', vai:'c11_luta_sabrina'},
    {texto:'Abrir o ginásio pros sete da calçada.', vai:'c11_abriu_pra_eles'},
    {texto:'Ir se despedir da Dra. Reis.', vai:'c11_dra_reis', cond:d=>!!d.flags.conheceu_a_reis}
  ]
},

c11_luta_sabrina:{
  texto:[
    'Ela entra na marcação branca do lado dela e fecha os olhos, e depois abre.',
    '"Uma coisa antes: se eu passar do ponto, você grita. Não pensa — grita. Eu ouço pensamento e eu não estou confiando no meu."'
  ],
  batalha:{dex:65, nivel:43, tipo:'treinador', treinador:'Sabrina, Líder de Saffron', fuga:false,
           timeExtra:[{dex:64, nivel:38},{dex:122, nivel:38},{dex:49, nivel:37}],
           vitoria:'c11_venceu_sabrina', derrota:'c11_perdeu_sabrina', gameover:'gameover'}
},

c11_venceu_sabrina:{
  texto:[
    'Você vence.',
    'E ela senta no chão da arena de novo, mas dessa vez é de cansaço e não de outra coisa, e a diferença é visível a dez metros.',
    '"Eu consegui separar."',
    'Ela diz isso pro teto.',
    '"Quatro minutos e dezenove segundos, e eu consegui separar o tempo inteiro, porque eu tinha que prestar atenção em você."',
    'Ela ri.',
    '"Era isso. Era só ter o que fazer. Nove anos de treino de concentração e a resposta era ter o que fazer."',
    'Ela levanta e te entrega a insígnia — de bolso de moletom, sem cerimônia, meio amassada.'
  ],
  ef:{insignia:'Insígnia Pântano', flag:['venceu_sabrina','ginasio_saffron'],
      rep:{eixo:'bom',delta:3,motivo:'Venceu a líder de Saffron na noite em que ela reabriu'},
      npc:{nome:'Sabrina', opiniao:10, memoria:'Perdeu para você e descobriu que conseguia separar quando tinha o que fazer.'},
      moral:15,
      registrar:'Venceu Sabrina e recebeu a insígnia Pântano.'},
  escolhas:[
    {texto:'Sair de Saffron.', vai:'c11_fim'},
    {texto:'Abrir o ginásio pros sete da calçada.', vai:'c11_abriu_pra_eles'},
    {texto:'Ficar mais um dia em Saffron.', vai:'c11_fim'},
    {texto:'Voltar ao prédio antes do dia dezenove.', vai:'c11_escada', cond:d=>!!d.flags.sabe_dos_nove_dias}
  ]
},

c11_perdeu_sabrina:{
  texto:[
    'Você perde, e perde feio, e ela para no segundo em que percebe que acabou.',
    'Ela atravessa a arena e chega perto antes dos seus Pokémon terminarem de cair, o que líder de ginásio nenhum faz.',
    '"Desculpa. Eu passei do ponto e você não gritou."',
    '"Eu não achei que precisava."',
    '"Precisava."',
    'Ela ajuda a levantar seu time, um por um, com as mãos, sem usar nada psíquico, o que claramente é um esforço.',
    '"Volta antes da Liga. Eu vou estar melhor."',
    'E aí, na porta, ela diz a coisa que você vai carregar:',
    '"E obrigada por não gritar. Eu precisava saber que eu paro sozinha."'
  ],
  ef:{hp:-6, causa:'Derrota no ginásio de Saffron', flag:'perdeu_pra_sabrina',
      npc:{nome:'Sabrina', opiniao:8, memoria:'Passou do ponto na luta com você e parou sozinha.'},
      moral:5,
      registrar:'Perdeu para Sabrina. Ela descobriu que para sozinha.'},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c11_luta_sabrina'},
    {texto:'Sair de Saffron.', vai:'c11_fim'},
    {texto:'Abrir o ginásio pros sete da calçada.', vai:'c11_abriu_pra_eles'},
    {texto:'Descansar e voltar depois.', vai:'c11_fim'}
  ]
},

c11_destruir:{
  texto:[
    'Você destrói o andar 11.',
    'Não tem outra forma de descrever: você usa o seu time, o painel de dreno, o carrinho de inox, o que estiver à mão, e em doze minutos não tem mais tanque em pé.',
    'Onze coisas que nunca foram perguntadas sobre nada acabam sem que ninguém pergunte nada.',
    'Você acha que está fazendo misericórdia.',
    'Talvez esteja. Cinco deles teriam concordado, se você tivesse perguntado.',
    'Você nunca vai ter como saber quais cinco, porque você não perguntou.'
  ],
  ef:{rep:{eixo:'ruim',delta:3,motivo:'Destruiu os onze sem perguntar a nenhum deles'},
      flag:['destruiu_o_11','tem_sangue_nas_maos'], instabilidade:2, moral:-25,
      executar:d=>{ d.liga.avisos++; return [{tipo:'liga', texto:'A Silph vai registrar isso como terrorismo industrial. E vai estar tecnicamente correta.'}]; },
      registrar:'Destruiu o andar 11 e os onze tanques.',
      presagio:'Cinco teriam concordado. Você não vai saber quais.'},
  escolhas:[
    {texto:'Sair antes que cheguem.', vai:'c11_fim'},
    {texto:'Ficar e esperar chegarem.', vai:'c11_esperou_chegarem'},
    {texto:'Fotografar o que sobrou.', vai:'c11_fotografou_11'},
    {texto:'Subir e contar pra Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou}
  ]
},

c11_esperou_chegarem:{
  texto:[
    'Você senta no chão molhado do andar 11, entre acrílico quebrado, e espera.',
    'Chegam em dezoito minutos: dois seguranças e a Dra. Reis.',
    'Os seguranças param na porta. Ela passa.',
    'Ela anda entre os tanques quebrados devagar, olhando cada um, e não chora e não grita e não pergunta nada.',
    'No fim ela senta no chão molhado do lado de você, de jaleco, aos cinquenta e um anos.',
    'E fala uma coisa só, depois de muito tempo:',
    '"Eu ia fazer isso no dia dezenove com anestésico e um técnico de apoio e uma ata de três páginas."',
    '"Você fez com um Pokémon e um carrinho de inox."',
    'Ela olha o teto.',
    '"E eu não consigo te dizer qual dos dois é pior, e eu vou passar o resto da minha vida tentando."'
  ],
  ef:{flag:['reis_te_viu','encarou_o_que_fez'],
      npc:{nome:'Dra. Reis', opiniao:-2, memoria:'Te achou sentado no meio dos onze tanques quebrados e sentou do seu lado.'},
      rep:{eixo:'bom',delta:2,motivo:'Ficou para encarar o que fez'},
      moral:-10,
      registrar:'A Dra. Reis sentou no chão molhado ao seu lado, entre os tanques quebrados.',
      presagio:'"Qual dos dois é pior." Nenhum dos dois vai ter resposta.'},
  escolhas:[
    {texto:'Sair.', vai:'c11_fim'},
    {texto:'"Me denuncia."', vai:'c11_fim', ef:{flag:'pediu_denuncia', rep:{eixo:'bom',delta:2,motivo:'Pediu para responder pelo que fez'}}},
    {texto:'"Escreve os nomes deles."', vai:'c11_escreve_os_nomes'},
    {texto:'Não dizer nada e ficar sentado.', vai:'c11_fim'}
  ]
},

c11_saiu_11:{
  texto:[
    'Você sai do andar 11 sem tocar em nada.',
    'Sobe quatro lances de escada de incêndio, atravessa um saguão com pé-direito de doze metros e piso de granito polido, e sai pela porta giratória pra uma rua com gente comprando jantar.',
    'A distância entre essas duas coisas — a sala branca de oito graus e a rua com gente comprando jantar — é de quarenta metros verticais e nove minutos de escada.',
    'Você senta no meio-fio um tempo.',
    'Um casal passa discutindo qual pizzaria. Um entregador encosta a bicicleta no poste. Uma criança pede sorvete e ganha.',
    'Nenhuma dessas pessoas está fazendo nada de errado, e a cidade funciona perfeitamente, e quarenta metros abaixo tem onze coisas contando presença uma pra outra.'
  ],
  ef:{flag:'saiu_do_11_intacto', moral:-8},
  escolhas:[
    {texto:'Seguir.', vai:'c11_fim'},
    {texto:'Voltar e perguntar alguma coisa a eles.', vai:'c11_perguntou'},
    {texto:'Ir contar pra Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Ir contar pra Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c11_desistiu:{
  texto:[
    'Você sobe a escada de volta sem abrir a porta.',
    'Não saber é uma escolha. É uma escolha legítima, que muita gente faz todo dia, e quase sempre é a mais confortável das disponíveis.',
    'Você faz essa.',
    'No saguão, a recepcionista te deseja boa noite com o sorriso cronometrado, e você responde boa noite, e a porta giratória gira.',
    'Ela vai voltar.'
  ],
  ef:{flag:'nao_entrou_no_11',
      rep:{eixo:'ruim',delta:1,motivo:'Chegou à porta e escolheu não saber'},
      moral:-10,
      registrar:'Chegou à porta do andar 11 e voltou.',
      presagio:'Ela vai voltar. Sempre volta.'},
  escolhas:[
    {texto:'Sair de Saffron.', vai:'c11_fim'},
    {texto:'Mudar de ideia e descer.', vai:'c11_escada'},
    {texto:'Ir falar com a Sabrina antes.', vai:'c11_ginasio'},
    {texto:'Ir pra doca de carga.', vai:'c11_doca'}
  ]
},

c11_fim:{
  texto:[
    'Saffron continua funcionando.',
    'Esse é o detalhe que não sai da sua cabeça, e vai continuar não saindo por muitos capítulos.',
    'Quarenta metros abaixo do chão tem onze tanques. Quarenta metros acima deles tem gente discutindo planilha de suprimentos com placa de acrílico na parede. E trinta metros acima dessa gente tem gente comprando jantar.',
    'Nenhuma dessas camadas sabe da outra, ou sabe e não olha, e a cidade funciona perfeitamente assim, com transporte público pontual e coleta de lixo três vezes por semana.',
    d=>{
      if (d.flags.tirou_os_seis) return 'E atrás de você, andando meio devagar, tem seis coisas que nunca viram uma parede que não fosse branca, e você não tem plano nenhum, e vai ter que arrumar um até amanhã.';
      if (d.flags.tem_uma_copia) return 'E do seu lado, andando meio devagar, tem uma coisa de vinte e cinco níveis que nasceu num tanque e está vendo rua pela primeira vez, e para a cada vinte metros pra olhar alguma coisa banal.';
      if (d.flags.destruiu_o_11) return 'E você não sabe o nome de nenhum dos onze, porque eles não tinham nome no sistema, porque ninguém perguntou, e agora não tem mais a quem perguntar.';
      if (d.flags.tem_os_nomes) return 'E no seu caderno tem vinte e nove nomes escritos em letra de médico no capô de um carro, e é a única coisa no mundo que prova que aquelas vinte e nove coisas foram chamadas de alguma coisa por alguém.';
      if (d.flags.provas_do_11 || d.flags.ivone_tem_o_11) return 'E no seu bolso tem vinte e três fotos que valem mais do que tudo que você carregou até hoje, e que não valem nada até alguém fazer alguma coisa com elas.';
      return 'E você desce a avenida sabendo de uma coisa que a cidade inteira não sabe, e essa é a pior forma de solidão que existe.';
    },
    d=>d.flags.sabe_dos_nove_dias && !d.flags.abriu_os_tanques && !d.flags.destruiu_o_11 && !d.flags.tirou_os_seis
      ? 'E tem uma data marcada numa pasta no porta-malas de um utilitário com o para-choque amassado. Dia dezenove.'
      : '',
    'A próxima cidade é Fuchsia.',
    'Lá tem uma reserva de nove mil hectares que se chama Zona Safári, e o nome já diz tudo se você parar pra pensar cinco segundos, e ninguém para.'
  ],
  fim:true, resumo:'Capítulo 11 concluído — você viu o que Cinnabar virou, e viu que ele tem centro de custo.'

}

}}

);
