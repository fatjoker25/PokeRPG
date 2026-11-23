/* ============================================================
   TAREFAS DA CIDADE — quem mora ali e precisa de uma mão
   Foi pedido assim: tarefas com gente das cidades — resgatar um
   Pokémon que se perdeu, colher alguma coisa, levar uma encomenda,
   mostrar um Pokémon —, feitas no jeito de jogo de hoje. Quem pede
   aparece na tela do lugar, na seção Tarefas, com o rosto numa moeda e
   a marca (! tem um pedido, ✓ está pronto pra entregar, … ainda espera);
   o passo de fora da cidade aparece no lugar onde ele se faz, com o
   rosto de quem pediu; e o Diário guarda o que cada um pediu, como
   memória: o que a pessoa disse, nunca a solução.

   Cada tarefa:
     id, cidade (onde mora quem pede), quem (o nome; o rosto é
     trainers/<arq>), quadro ([x, y, lado] da cabeça no desenho de
     80 px, que a moeda recorta), f (mulher), tipo ('resgate',
     'coleta', 'entrega', 'mostrar'), titulo (a linha do Diário), desde
     (a posição na jornada em que ela aparece, por capNaJornada) ou
     fase (a das Ilhas Sevii, Sevii.fase); contato {rotulo, falas}, de
     quem tem telefone e deixa o número na volta;
     oferta {titulo, sub}: como a pessoa aparece antes de pedir;
     pedido (as falas), aceitar e recusar (os botões), recusou (o que
     ela diz), entrega (o item que ela põe na sua mão, na entrega);
     lembrete: o que ela pediu, como você lembra (o Diário);
     passo: o que se faz fora da cidade — onde, titulo, sub, texto e
       escolhas; na coleta, `item` e `meta`; no resgate, `luta` (quem
       está em volta do Pokémon perdido) depois de achar;
     volta {titulo, requer, falta, falas, premio}: de volta a quem
       pediu, com o que ela pediu (o mostrar só tem a volta).
   Cada escolha do passo: {texto, cond, teste:{status, dificuldade,
   nome, eixo}, bom, ruim, resultado, achou, ganha (na coleta; o
   crítico ganha um a mais), gasta {item: n}, desgaste, espera (leva o
   relógio até a hora), entrega, luta {dex, intro, venceu, perdeu,
   ganha}, tempo (períodos; 1 se não disser)}.
   O que está escrito aqui está na folha de regras ("Tarefas da cidade").
   ============================================================ */

const OPINIAO_DA_TAREFA = 3;      // quanto quem pediu passa a gostar de você
const MORAL_DO_MOSTRAR = 5;       // o Pokémon que você mostrou sai contente

/* o Pokémon de quem pediu, que a cena chama pelo nome (não é seu) */
const TAREFAS = [

/* ─── Pallet: a Lia e o Pipoca ─────────────────────────── */
{
  id:'pidgey_da_lia', cidade:'pallet', quem:'Lia', f:true, arq:'lia', quadro:[24, 36, 24], tipo:'resgate', desde:2,
  titulo:'O Pidgey da Lia',
  oferta:{titulo:'A menina do varal', sub:'Ela está em pé num balde virado, olhando pro varal vazio, com a mão fechada.'},
  pedido:[
    'No quintal da casa do lado, uma menina de uns nove anos está em pé num balde virado, olhando pro alto do varal vazio.',
    fala('Lia', 'Ele voou com a ventania de ontem. O Pipoca. É um Pidgey, tem uma fita vermelha no pé.'),
    fala('Lia', 'A minha mãe disse que Pidgey volta sozinho. Ele não voltou.'),
    fala('Lia', 'Ele foi pro lado da Rota 1. Eu não posso ir sozinha até lá.', 'baixo'),
    'Ela abre a mão: um punhado de semente de girassol, quente de tanto segurar.'
  ],
  aceitar:'"Eu procuro o Pipoca."', recusar:'"Hoje não dá, Lia."',
  recusou:[fala('Lia', 'Tá.', null, 'Ela volta a olhar pro varal.')],
  lembrete:'A Lia disse que o Pipoca, o Pidgey de fita vermelha no pé, voou com a ventania pro lado da Rota 1.',
  passo:{
    onde:'rota1', titulo:'Procurar o Pipoca, o Pidgey da Lia', sub:'Um Pidgey com uma fita vermelha no pé, em algum lugar da rota.',
    texto:['Pidgey é o que não falta na Rota 1. Um com fita vermelha no pé, não.'],
    escolhas:[
      {texto:'Andar pela beira do mato olhando o alto das árvores.', teste:{status:'percepcao', dificuldade:6, nome:'Percepção', eixo:'paciencia'},
       bom:{achou:true, resultado:['Na terceira árvore depois da placa, um ponto vermelho balança num galho alto. É a fita.']},
       ruim:{resultado:['Você conta quarenta Pidgey e nenhuma fita.']}},
      {texto:'Chamar "Pipoca!" alto, como a Lia chamaria.', teste:{status:'carisma', dificuldade:6, nome:'Carisma'},
       bom:{achou:true, resultado:['Do alto de uma árvore vem um pio curto, e depois outro. Ele responde pelo nome.']},
       ruim:{resultado:['Um bando inteiro de Pidgey levanta voo de uma vez. Nenhum tem fita.']}},
      {texto:'Espalhar um pouco de Ração na trilha e esperar quieto.', cond:d => Estado.contaItem('Ração') > 0, gasta:{'Ração':1}, tempo:2,
       achou:true, resultado:['Você espera sentad{o|a} na pedra da beira. Os Pidgey descem um por um, desconfiados, e o último a descer tem uma fita vermelha no pé.']}
    ],
    luta:{dex:21, intro:['Mas ele não desce sozinho: um Spearow pousa no galho de cima e abre as asas na frente dele.'],
      venceu:['O Spearow vai embora gritando. O Pipoca desce do galho direto pro seu ombro, como se você fosse o varal.'],
      perdeu:['O Spearow te enxota do pé da árvore, e o Pipoca some no alto, mais assustado que antes.']}
  },
  volta:{
    titulo:'Levar o Pipoca de volta pra Lia', falta:'A Lia ainda olha pro varal.',
    falas:[
      'A Lia está no mesmo balde. Ela vê o Pipoca no seu ombro antes de você abrir o portão.',
      fala('Lia', 'PIPOCA!', 'grita'),
      'O Pidgey pula do seu ombro pro dela, e ela quase cai do balde.',
      fala('Lia', 'A minha mãe mandou te dar isso. E eu mandei te dar isso aqui.', null, 'Ela põe na sua mão duas Potion e uma pena marrom, comprida, do Pipoca.')
    ],
    premio:{itens:{'Potion':2, 'Pena de Pidgey':1}, rep:'Achou o Pidgey de uma menina de Pallet'}
  }
},

/* ─── Viridian: o verde do Emil ────────────────────────── */
{
  id:'tintas_do_emil', cidade:'viridian', quem:'Emil', arq:'emil', quadro:[33, 3, 22], tipo:'coleta', desde:3,
  titulo:'O verde do Emil',
  oferta:{titulo:'O pintor do banco da praça', sub:'Ele pinta a mesma árvore há três dias, e a tela continua sem verde.'},
  pedido:[
    'No banco da praça, um senhor de boina e avental manchado pinta a árvore da frente só com azul e marrom.',
    fala('Emil', 'Acabou o meu verde. Eu faço a minha tinta, sabe. Não compro.'),
    fala('Emil', 'Tem uma frutinha na Floresta de Viridian que mancha a mão de verde por uma semana. Roxa por fora, verde por dentro. É dela que eu faço.'),
    fala('Emil', 'Três, e eu termino o quadro. Os meus joelhos não entram mais na floresta.', null, 'Ele bate no joelho com o cabo do pincel.')
  ],
  aceitar:'"Eu trago três."', recusar:'"Agora não posso."',
  recusou:[fala('Emil', 'Então a árvore fica azul mais um dia. Ela não se importa.')],
  lembrete:'O Emil, pintor da praça de Viridian, precisa de três frutinhas-tinta da Floresta de Viridian, roxas por fora e verdes por dentro.',
  passo:{
    onde:'floresta', titulo:'Colher frutinha-tinta pro Emil', sub:'Miúda e roxa, baixa, no meio das moitas de folha larga.',
    item:'Frutinha-tinta', meta:3,
    texto:['A frutinha-tinta cresce baixa, no meio das moitas de folha larga. Por fora é roxa como as outras. Por dentro, diz o Emil, é verde.'],
    escolhas:[
      {texto:'Procurar nas moitas da beira da trilha.', teste:{status:'percepcao', dificuldade:6, nome:'Percepção', eixo:'paciencia'},
       bom:{ganha:1, resultado:['Debaixo de uma folha larga, um cacho de três. Você aperta uma: verde por dentro. Essa.']},
       ruim:{resultado:['Você enche a mão de frutinha roxa e aperta uma por uma. Roxas por dentro também. Não são essas.']}},
      {texto:'Ir na moita grande, onde zumbe alguma coisa.',
       luta:{dex:15, ganha:2, intro:['A moita grande é a mais carregada, e é de um Beedrill. Ele sai de dentro antes de você esticar a mão.'],
         venceu:['O Beedrill vai embora, e a moita é sua. Você enche o bolso.'],
         perdeu:['Você recua até a trilha com o Beedrill atrás. A moita fica com ele.']}}
    ]
  },
  volta:{
    titulo:'Levar as frutinhas pro Emil', falta:'O Emil continua pintando sem verde.',
    falas:[
      'O Emil esmaga a primeira frutinha na paleta com o cabo do pincel. Sai um verde escuro, de mato molhado.',
      fala('Emil', 'Isso. Esse é o verde da floresta. O de loja é verde de parede.'),
      'Ele pinta a copa da árvore em seis pinceladas. A árvore da tela fica mais parecida com a da praça do que a da praça.',
      fala('Emil', 'Volta aqui daqui a uns dias. Vou estar pintando outra coisa, mas com o mesmo verde.', null, 'Ele limpa a mão no avental e te passa o que tinha no bolso.')
    ],
    premio:{dinheiro:300, itens:{'Poké Ball':3}, rep:'Ajudou o pintor da praça de Viridian a terminar um quadro'}
  }
},

/* ─── Pewter: a vitrine do Oskar ───────────────────────── */
{
  id:'cacos_do_oskar', cidade:'pewter', quem:'Oskar', arq:'oskar', quadro:[26, 13, 24], tipo:'coleta', desde:5,
  titulo:'A vitrine do Oskar',
  oferta:{titulo:'O arqueólogo na escada do museu', sub:'Ele separa pedrinhas em três montes, com uma lupa, numa folha de jornal aberta no degrau.'},
  pedido:[
    'Na escada do museu, um homem de chapéu de explorador e mochila maior que ele separa pedrinhas em três montes, com uma lupa.',
    fala('Oskar', 'Calcário, calcário, calcário. Tudo calcário.'),
    fala('Oskar', 'O museu quer uma vitrine de pedra-da-lua. Não a pedra inteira, que essa é rara. Os cacos: as lascas que soltam do teto do Monte da Lua.'),
    fala('Oskar', 'Dois cacos. Eu fui três vezes e voltei com calcário três vezes. Dizem que eles brilham um pouco quando a luz bate.', null, 'Ele dá de ombros.')
  ],
  aceitar:'"Eu procuro os cacos."', recusar:'"Hoje eu não entro em caverna."',
  recusou:[fala('Oskar', 'Ninguém entra. Por isso a vitrine está vazia.')],
  lembrete:'O Oskar, do museu de Pewter, quer dois cacos de pedra-da-lua, as lascas que soltam do teto do Monte da Lua e brilham quando a luz bate.',
  passo:{
    onde:'monte_lua', titulo:'Procurar cacos de pedra-da-lua pro Oskar', sub:'Lascas que soltam do teto e brilham quando a luz bate.',
    item:'Caco de pedra-da-lua', meta:2,
    texto:['No chão da caverna, no meio do cascalho, um caco de pedra-da-lua é igual a qualquer pedra, até a luz bater nele.'],
    escolhas:[
      {texto:d => { const l = Campo.iluminar(); return `Varrer o chão ${l.como || 'com luz'}.`; }, cond:d => Campo.iluminar().pode,
       desgaste:d => Campo.iluminar().semPilha ? null : 'Lanterna',
       teste:{status:'percepcao', dificuldade:4, nome:'Percepção'},
       bom:{ganha:1, resultado:['Na terceira passada da luz, o chão devolve um brilho azul, fraco. Um caco, do tamanho de uma unha.']},
       ruim:{resultado:['A luz acha calcário, mais calcário e um Zubat que não gostou nada dela.']}},
      {texto:'Procurar no escuro, pelo tato e pelo brilho.', teste:{status:'percepcao', dificuldade:8, nome:'Percepção', eixo:'paciencia'},
       bom:{ganha:1, resultado:['Você passa a mão no chão até uma pedra ficar fria de um jeito diferente das outras. É um caco.']},
       ruim:{resultado:['Você volta com as mãos cheias de calcário. O Oskar ia rir.']}},
      {texto:'Esperar os Clefairy em silêncio, num canto da galeria.', teste:{status:'sorte', dificuldade:7, nome:'Sorte'}, tempo:2,
       bom:{ganha:1, resultado:['Dois Clefairy passam por você sem te ver, arrastando alguma coisa que brilha. Na curva, um caco cai e fica pra trás.']},
       ruim:{resultado:['Os Clefairy não aparecem. Um Zubat aparece no lugar deles, e não fica.']}}
    ]
  },
  volta:{
    titulo:'Levar os cacos pro Oskar', falta:'O Oskar continua separando calcário.',
    falas:[
      'O Oskar põe os cacos na palma da mão e fecha a outra mão em concha por cima, pra fazer escuro.',
      fala('Oskar', 'Olha. Olha isso.', 'baixo'),
      'Pela fresta dos dedos dele sai uma luz azul fraca, de lua atrás de nuvem.',
      fala('Oskar', 'Na vitrine vai ter uma plaquinha. Eu vou pôr o seu nome nela, se você deixar.', null, 'Ele já está escrevendo.')
    ],
    premio:{dinheiro:600, itens:{'Super Potion':2}, rep:'Ajudou o museu de Pewter a montar uma vitrine'}
  }
},

/* ─── Cerulean: o Pim e o Dodó ─────────────────────────── */
{
  id:'psyduck_do_pim', cidade:'cerulean', quem:'Pim', arq:'pim', quadro:[20, 24, 24], tipo:'resgate', desde:7,
  titulo:'O Psyduck do Pim',
  oferta:{titulo:'O menino da boia', sub:'Ele está de boia na cintura, na beira do rio, e não entra na água.'},
  pedido:[
    'Na beira do rio, um menino de uns dez anos com uma boia azul na cintura olha pra água sem entrar.',
    fala('Pim', 'O Dodó desceu o rio boiando. Ele faz isso. Só que dessa vez ele foi longe.'),
    fala('Pim', 'É um Psyduck. Ele não nada direito, ele só boia. Ele parou numa pedra no meio do rio, lá pra cima da Rota 24, e não sai de lá.'),
    fala('Pim', 'Eu tenho boia. Eu não tenho coragem.', 'baixo')
  ],
  aceitar:'"Eu tiro ele de lá."', recusar:'"Agora eu não consigo, Pim."',
  recusou:[fala('Pim', 'Tudo bem. Ele está segurando a cabeça, mas está segurando.')],
  lembrete:'O Pim, de Cerulean, perdeu o Dodó, um Psyduck que boiou rio acima e parou numa pedra no meio do rio, na Rota 24.',
  passo:{
    onde:'rota24', titulo:'Tirar o Dodó da pedra do rio', sub:'Um Psyduck sentado numa pedra no meio da correnteza.',
    texto:['Lá está ele: um Psyduck sentado numa pedra no meio da correnteza, segurando a cabeça com as duas mãos.'],
    escolhas:[
      {texto:d => `Atravessar ${Campo.surfar().como}.`, cond:d => Campo.surfar().pode,
       achou:true, resultado:d => [`A correnteza empurra, mas ${nomeExib(Campo.surfar().quem)} segura firme. O Dodó sobe nas costas de ${nomeExib(Campo.surfar().quem)} sem perguntar nada.`]},
      {texto:'Pegar o cabo de amarrar barco da margem e jogar pra ele.', teste:{status:'forca', dificuldade:7, nome:'Força', eixo:'coragem'},
       bom:{achou:true, resultado:['O cabo cai no colo dele na segunda tentativa. Ele segura com o bico, e você puxa.']},
       ruim:{resultado:['O cabo cai na água três vezes. Na terceira ele tenta pegar e quase cai junto.']}},
      {texto:'Gritar pra ele boiar até a margem.', teste:{status:'carisma', dificuldade:8, nome:'Carisma'},
       bom:{achou:true, resultado:['Ele olha pra você, olha pra água, e se joga. Boia. A correnteza traz ele até a sua mão.']},
       ruim:{resultado:['Ele olha pra você e segura a cabeça com mais força.']}}
    ],
    luta:{dex:118, intro:['Quando o Dodó chega na margem, um Goldeen pula da água atrás dele, de chifre na frente.'],
      venceu:['O Goldeen volta pro fundo. O Dodó não solta mais a sua perna.'],
      perdeu:['O Goldeen leva a melhor, e o Dodó, de susto, volta boiando pra pedra.']}
  },
  volta:{
    titulo:'Levar o Dodó de volta pro Pim', falta:'O Pim continua na beira do rio, de boia.',
    falas:[
      'O Pim corre pela margem com a boia batendo no joelho.',
      fala('Pim', 'Dodó! Você não sabe nadar!', 'grita'),
      'O Psyduck segura a cabeça. Pode ser vergonha. Pode ser dor de cabeça.',
      fala('Pim', 'O meu pai disse que quem trouxesse o Dodó ganhava isso aqui. Ele achou que ninguém ia trazer.', 'riso')
    ],
    premio:{itens:{'Great Ball':2, 'Super Potion':1}, rep:'Tirou o Psyduck de um menino de Cerulean do meio do rio'}
  }
},

/* ─── Vermilion: a caixinha do Abner ───────────────────── */
{
  id:'caixinha_do_abner', cidade:'vermilion', quem:'Abner', arq:'abner', quadro:[27, 8, 26], tipo:'entrega', desde:9,
  titulo:'A caixinha do Abner',
  oferta:{titulo:'O marinheiro aposentado do cais', sub:'Ele tem uma caixinha embrulhada num lenço no colo e olha pro lado de Lavender.'},
  pedido:[
    'No banco do cais, um marinheiro velho e largo, de uniforme branco desbotado, segura uma caixinha embrulhada num lenço como se ela estivesse dormindo.',
    fala('Abner', 'A minha sobrinha mora em Lavender. Faz dois anos que eu não subo até lá.'),
    fala('Abner', 'A perna não deixa. E o correio de Lavender perde encomenda. Já perdeu duas.'),
    fala('Abner', 'É uma caixinha de música. Era da mãe dela. A Mirela vai saber.', null, 'Ele estende a caixinha antes de você dizer que leva.')
  ],
  aceitar:'"Eu levo pra ela."', recusar:'"Não vou pra aqueles lados agora."',
  recusou:[fala('Abner', 'Tudo bem. Ela esperou dois anos, espera mais uns dias.', 'baixo')],
  entrega:'Caixinha de música',
  lembrete:'O Abner, marinheiro aposentado de Vermilion, pediu pra levar uma caixinha de música pra sobrinha dele, a Mirela, em Lavender.',
  passo:{
    onde:'lavender', titulo:'Entregar a caixinha do Abner pra Mirela', sub:'A casa de portão baixo mais perto da Torre.',
    texto:[
      'A Mirela mora na casa de portão baixo mais perto da Torre. Ela abre a porta de roupa branca de médium, e para quando vê o lenço.'
    ],
    escolhas:[
      {texto:'Entregar a caixinha.', entrega:true, tempo:0, resultado:[
        'Ela desembrulha ali mesmo, na porta. A caixinha toca três notas e engasga na quarta.',
        fala('Mirela', 'Era da minha mãe. Ele guardou esse tempo todo.', 'baixo'),
        fala('Mirela', 'Diz pra ele que ainda engasga na quarta. Ele vai entender.')
      ]}
    ]
  },
  volta:{
    titulo:'Contar pro Abner como foi', falta:'O Abner continua no banco do cais, olhando pro lado de Lavender.',
    falas:[
      'O Abner está no mesmo banco. Ele não pergunta: espera você dizer.',
      'Você conta que ela desembrulhou na porta, e que a caixinha ainda engasga na quarta nota.',
      fala('Abner', 'Ainda engasga.', 'riso', 'Ele ri pela primeira vez desde que você chegou.'),
      fala('Abner', 'A mãe dela deixou cair da escada quando a Mirela tinha seis anos. Nunca mais tocou a quarta direito.'),
      fala('Abner', 'Toma. E grava o meu número. Marinheiro aposentado tem tempo demais.')
    ],
    premio:{dinheiro:1000, itens:{'Revive':1}, rep:'Levou uma encomenda de Vermilion até Lavender'}
  },
  contato:{rotulo:'Perguntar da Mirela', falas:[
    'Ela ligou ontem. Pôs a caixinha no telefone pra eu ouvir. Engasgou na quarta.',
    'A Mirela vai descer pra Vermilion no mês que vem. Eu já varri o barco três vezes.',
    'Ela disse que você subiu a escada da casa dela sem pisar no degrau que range. Ninguém faz isso.'
  ]}
},

/* ─── Lavender: as flores da Mirela ────────────────────── */
{
  id:'flores_da_mirela', cidade:'lavender', quem:'Mirela', f:true, arq:'mirela', quadro:[29, 24, 22], tipo:'coleta', desde:8,
  titulo:'As flores da Mirela',
  oferta:{titulo:'A médium do portão baixo', sub:'Ela varre, de roupa branca, uma calçada que já está varrida, e olha pro lado da Rota 8.'},
  pedido:[
    d => d.tarefas && d.tarefas.caixinha_do_abner && d.tarefas.caixinha_do_abner.entregou
      ? 'A Mirela está na calçada de novo, de vassoura. Ela te reconhece pelo jeito de abrir o portão.'
      : 'Na casa de portão baixo mais perto da Torre, uma moça de roupa branca de médium varre uma calçada que já está varrida.',
    fala('Mirela', 'Toda semana eu subo a Torre com flor-de-sino. Esta semana eu não posso sair de perto dela: é a semana da vigília.'),
    fala('Mirela', 'A flor-de-sino cresce no capim da Rota 8. De dia ela fica fechada e some no meio do mato. De noite ela abre, branca, e dá pra ver de longe.'),
    fala('Mirela', 'Três. Não precisa ser bonita. Precisa ser de lá.')
  ],
  aceitar:'"Eu trago três."', recusar:'"Esta semana eu não posso."',
  recusou:[fala('Mirela', 'Ninguém pode, esta semana. Eu entendo.', 'baixo')],
  lembrete:'A Mirela, médium de Lavender, quer três flores-de-sino do capim da Rota 8. Ela disse que de dia elas ficam fechadas, e de noite abrem.',
  passo:{
    onde:'rota8', titulo:'Colher flor-de-sino pra Mirela', sub:'No capim da rota: fechadas de dia, abertas de noite.',
    item:'Flor-de-sino', meta:3,
    texto:d => ehNoite()
      ? ['O capim da Rota 8 está pontilhado de branco: as flores-de-sino abertas, balançando sem vento.']
      : ['De dia o capim da Rota 8 é só capim. Se tem flor-de-sino aqui, está fechada.'],
    escolhas:[
      {texto:'Colher as que estão abertas.', cond:d => ehNoite(), teste:{status:'percepcao', dificuldade:4, nome:'Percepção'},
       bom:{ganha:2, resultado:['Você colhe duas sem pisar no capim. As outras fecham quando a sua sombra passa por cima.']},
       ruim:{ganha:1, resultado:['Você colhe uma. As outras fecham quando a sua sombra passa por cima.']}},
      {texto:'Procurar as fechadas no meio do capim.', cond:d => !ehNoite(), teste:{status:'percepcao', dificuldade:8, nome:'Percepção', eixo:'paciencia'},
       bom:{ganha:1, resultado:['No meio do capim, um botão branco do tamanho de um dedal, fechado. Você corta pelo talo.']},
       ruim:{resultado:['Tudo que você acha é capim, e um Ekans que não gostou de ser achado.']}},
      {texto:'Esperar a noite no barranco.', cond:d => !ehNoite(), espera:19,
       resultado:['Você senta no barranco e espera o sol ir embora. Quando escurece, o capim acende de branco.']}
    ]
  },
  volta:{
    titulo:'Levar as flores-de-sino pra Mirela', falta:'A Mirela continua varrendo a calçada.',
    falas:[
      'A Mirela segura as flores pelo talo, juntas, e elas fecham na mão dela, devagar, uma de cada vez.',
      fala('Mirela', 'Elas fecham quando sentem mão de gente. Lá em cima, abrem de novo.'),
      d => d.tarefas && d.tarefas.caixinha_do_abner && d.tarefas.caixinha_do_abner.entregou
        ? fala('Mirela', 'A caixinha do meu tio está na janela. Ainda engasga na quarta nota.') : '',
      fala('Mirela', 'Obrigada. Como a minha mãe dizia: obrigada por mim e por quem não pode dizer.', 'baixo')
    ],
    premio:{dinheiro:500, itens:{'Repelente':3, 'Full Heal':1}, rep:'Levou flores pra Torre de Lavender na semana da vigília'}
  }
},

/* ─── Celadon: o perfume da Lotte ──────────────────────── */
{
  id:'perfume_da_lotte', cidade:'celadon', quem:'Lotte', f:true, arq:'lotte', quadro:[26, 7, 26], tipo:'coleta', desde:10,
  titulo:'O perfume da Lotte',
  oferta:{titulo:'A perfumista da vitrine', sub:'Na vitrine da loja de perfume tem um frasco vazio com uma etiqueta escrita à mão: "Rota 7".'},
  pedido:[
    'A loja de perfume da avenida tem cheiro de dez lojas de perfume. A dona, uma moça loira de vestido rosa, cheira o próprio pulso e faz careta.',
    fala('Lotte', 'Celadon inteira usa perfume de flor. Eu quero fazer um que tenha cheiro de mato de verdade.'),
    fala('Lotte', 'O Oddish da Rota 7 solta a folha velha quando se planta pra dormir. Aquela folha tem o cheiro que eu quero.'),
    fala('Lotte', 'Três folhas inteiras, sem rasgar. E não arranca do Oddish, por favor. Ele chora.')
  ],
  aceitar:'"Eu trago as folhas."', recusar:'"Agora não."',
  recusou:[fala('Lotte', 'O frasco espera. Frasco é bom nisso.')],
  lembrete:'A Lotte, perfumista de Celadon, quer três folhas de Oddish da Rota 7, das que o Oddish solta quando se planta pra dormir.',
  passo:{
    onde:'rota7', titulo:'Juntar folha de Oddish pra Lotte', sub:'As folhas velhas que o Oddish solta quando se planta pra dormir.',
    item:'Folha de Oddish', meta:3,
    texto:d => ehNoite()
      ? ['No capim da Rota 7, os Oddish estão plantados em fila, de olhos fechados, e o chão em volta deles está forrado de folha.']
      : ['Os Oddish da Rota 7 andam pelo capim, acordados. Folha no chão, só a que o vento derrubou.'],
    escolhas:[
      {texto:'Juntar as folhas do chão, devagar, sem acordar ninguém.', cond:d => ehNoite(), teste:{status:'percepcao', dificuldade:5, nome:'Percepção', eixo:'cuidado'},
       bom:{ganha:2, resultado:['Você junta duas folhas inteiras, compridas, ainda mornas. Nenhum Oddish abre o olho.']},
       ruim:{resultado:['Um Oddish acorda, olha pra você e vai se replantar mais longe, levando as folhas dele.']}},
      {texto:'Pedir com jeito pra um Oddish acordado.', cond:d => !ehNoite(), teste:{status:'carisma', dificuldade:7, nome:'Carisma', eixo:'simpatia'},
       bom:{ganha:1, resultado:['O Oddish te olha, balança as folhas da cabeça e deixa cair uma, inteira.']},
       ruim:{resultado:['O Oddish solta um pó amarelo na sua direção e vai embora. A folha fica com ele.']}},
      {texto:'Esperar a noite, quando eles se plantam.', cond:d => !ehNoite(), espera:19,
       resultado:['Você espera na beira da rota. Quando escurece, os Oddish param de andar, um por um, e se plantam em fila.']}
    ]
  },
  volta:{
    titulo:'Levar as folhas pra Lotte', falta:'A Lotte continua cheirando o próprio pulso.',
    falas:[
      'A Lotte encosta o nariz na primeira folha e fecha os olhos por tempo demais.',
      fala('Lotte', 'Isso. Mato molhado, terra e alguma coisa doce que eu não sei o nome.'),
      fala('Lotte', 'O primeiro frasco é seu. Não tem nome ainda. Se tiver, vai ser Rota 7.', 'riso')
    ],
    premio:{dinheiro:1200, itens:{'Frasco de perfume':1, 'Super Potion':2}, rep:'Ajudou a perfumista de Celadon a fazer um perfume novo'}
  }
},

/* ─── Saffron: a janela da Bea ─────────────────────────── */
{
  id:'janela_da_bea', cidade:'saffron', quem:'Bea', f:true, arq:'bea', quadro:[27, 25, 24], tipo:'mostrar', desde:12,
  titulo:'A janela da Bea',
  oferta:{titulo:'A menina da janela do segundo andar', sub:'Ela está de pijama de Eevee, com a testa encostada no vidro, acenando pra quem passa.'},
  pedido:[
    'Numa janela de segundo andar, uma menina de pijama de Eevee, com o capuz das orelhas na cabeça, acena pra todo treinador que passa.',
    'A mãe dela desce pra abrir o portão antes de você bater.',
    fala('Bea', 'Eu tô de cama. Febre. Não pega, a minha mãe já disse pra todo mundo.'),
    fala('Bea', 'Eu nunca vi um Pokémon de gelo de verdade. Só na televisão. Diz que eles são frios de encostar.', null, 'Ela encosta a mão no vidro, que não está frio.'),
    fala('Bea', 'Se você tiver um, você traz aqui? Só pra eu encostar.')
  ],
  aceitar:'"Quando eu tiver um, eu trago."', recusar:'"Eu não tenho como, Bea."',
  recusou:[fala('Bea', 'Tá bom. Eu fico olhando a janela, então.')],
  lembrete:'A Bea, menina de Saffron que está de cama, nunca viu um Pokémon do tipo Gelo de perto, e queria encostar num.',
  volta:{
    titulo:d => { const p = Tarefas.doTipo('Gelo'); return p ? `Mostrar ${nomeExib(p)} pra Bea` : 'Mostrar um Pokémon de gelo pra Bea'; },
    requer:d => !!Tarefas.doTipo('Gelo'), falta:'A Bea quer encostar num Pokémon do tipo Gelo.',
    falas:d => {
      const p = Tarefas.doTipo('Gelo');
      if (!p) return [];
      const n = nomeExib(p), pr = pron(p);
      return [
        `Você sobe a escada com ${n} atrás. A Bea senta na cama de uma vez.`,
        fala('Bea', 'Pode encostar? Posso?', 'grita'),
        `${n} chega perto da cama e abaixa a cabeça, e ela põe a mão aberta em cima ${pr.dele}.`,
        fala('Bea', 'É frio! Mãe, é frio de verdade!', 'grita'),
        'A febre não passa por causa disso. Mas ela dorme antes de você ir embora, com a mão ainda fechada, guardando o frio.'
      ];
    },
    premio:{dinheiro:500, itens:{'Full Heal':2, 'Revive':1}, rep:'Mostrou um Pokémon de gelo a uma menina doente de Saffron', moral:'Gelo'}
  }
},

/* ─── Fuchsia: o Slowpoke do Gustav ────────────────────── */
{
  id:'slowpoke_do_gustav', cidade:'fuchsia', quem:'Gustav', arq:'gustav', quadro:[33, 8, 22], tipo:'resgate', desde:13,
  titulo:'O Slowpoke do Gustav',
  oferta:{titulo:'O velho guia da cerca', sub:'Um senhor de mochila enorme e cajado olha um mapa da Rota 13 de cabeça pra baixo.'},
  pedido:[
    'Encostado na cerca da Zona Safári, um senhor de mochila maior que as costas dele e cajado de madeira olha um mapa da Rota 13 de cabeça pra baixo.',
    fala('Gustav', 'Trinta anos de guia na Zona. Eu nunca perdi um turista. Perdi o meu Slowpoke.'),
    fala('Gustav', 'Ele sai pra pescar com o rabo no mar e dorme no meio. Dessa vez ele dormiu no labirinto de cerca da Rota 13, e a maré subiu em volta.'),
    fala('Gustav', 'Eu sei onde ele está. O meu fôlego é que não chega lá.', null, 'Ele bate no peito com o punho fechado.')
  ],
  aceitar:'"Eu busco o Slowpoke."', recusar:'"Hoje não dá."',
  recusou:[fala('Gustav', 'Ele não tem pressa. Ele nunca teve.', 'riso')],
  lembrete:'O Gustav, velho guia da Zona Safári, perdeu o Slowpoke dele no labirinto de cerca da Rota 13, com a maré subindo.',
  passo:{
    onde:'rota13', titulo:'Achar o Slowpoke do Gustav', sub:'Uma cauda rosa boiando, no meio do labirinto de cerca.',
    texto:['O labirinto de cerca da Rota 13 tem água pela canela, e mais em cada volta. Lá no meio, uma cauda rosa boia parada.'],
    escolhas:[
      {texto:'Ir pela cerca, de volta em volta, até ele.', teste:{status:'resistencia', dificuldade:7, nome:'Resistência'},
       bom:{achou:true, resultado:['Na sexta volta a água chega na cintura. Na sétima, você chega nele. Ele está dormindo.']},
       ruim:{resultado:['A água sobe rápido demais. Você volta pela mesma cerca antes que ela suba mais.']}},
      {texto:'Pular a cerca e cortar caminho.', teste:{status:'forca', dificuldade:8, nome:'Força', eixo:'coragem'},
       bom:{achou:true, resultado:['Três cercas e um tombo depois, você cai sentad{o|a} na água do lado dele. Ele não acorda.']},
       ruim:{resultado:['A cerca é mais alta do que parecia, e do outro lado tem mais cerca.']}},
      {texto:d => `Ir pela água ${Campo.surfar().como}.`, cond:d => Campo.surfar().pode,
       achou:true, resultado:d => [`${nomeExib(Campo.surfar().quem)} passa por cima da cerca baixa e para do lado da cauda rosa.`]}
    ],
    luta:{dex:70, intro:['Ele não está só dormindo: um Weepinbell enrolou o cipó na cauda dele e puxa pro lado do mato.'],
      venceu:['O Weepinbell solta. O Slowpoke acorda, boceja e te segue pela água sem a menor pressa.'],
      perdeu:['O Weepinbell arrasta o Slowpoke mais pro fundo do mato. Ele nem acordou.']}
  },
  volta:{
    titulo:'Levar o Slowpoke pro Gustav', falta:'O Gustav continua com o mapa de cabeça pra baixo.',
    falas:[
      'O Gustav vê a cauda rosa primeiro, por cima da cerca.',
      fala('Gustav', 'Trinta anos de guia, e quem eu precisei guiar foi esse aí.', 'riso'),
      'O Slowpoke encosta a cabeça na mochila dele e dorme de novo, em pé.',
      fala('Gustav', 'Leva isso, e grava o meu número. Se um dia você quiser um atalho da Zona, eu sei todos.')
    ],
    premio:{dinheiro:1500, itens:{'Ultra Ball':2}, rep:'Achou o Slowpoke de um velho guia de Fuchsia'}
  },
  contato:{rotulo:'Perguntar do Slowpoke', falas:[
    'Ele dormiu na cerca de novo. Dessa vez do lado de dentro. Eu chamo isso de progresso.',
    'Ele pescou um Magikarp ontem. Soltou. Acho que ele só gosta de pescar.',
    'Ele senta na porta de casa toda tarde, olhando pro lado da Rota 13. Acho que é saudade. Ou sono.'
  ]}
},

/* ─── Cinnabar: o livro do Linus ───────────────────────── */
{
  id:'livro_do_linus', cidade:'cinnabar', quem:'Linus', arq:'linus', quadro:[28, 19, 25], tipo:'mostrar', desde:15,
  titulo:'O livro do Linus',
  oferta:{titulo:'O menino do livro grosso', sub:'Ele lê um livro de fósseis na escada do laboratório, com o dedo em cima de um desenho.'},
  pedido:[
    'Na escada do laboratório, um menino de óculos e cabelo verde lê um livro de capa dura do tamanho do colo dele.',
    fala('Linus', 'Omanyte. Kabuto. Aerodactyl.', null, 'Ele aponta cada desenho sem tirar o olho do livro.'),
    fala('Linus', 'O laboratório traz eles de volta do fóssil. Eu moro aqui do lado e nunca vi um. Só o desenho.'),
    fala('Linus', 'Se você tiver um, você mostra pra mim? Eu quero ver se o desenho está certo.')
  ],
  aceitar:'"Se eu tiver um, eu mostro."', recusar:'"Isso não é comigo."',
  recusou:[fala('Linus', 'Tudo bem. O desenho espera. Desenho é bom nisso.')],
  lembrete:'O Linus, menino de Cinnabar, quer ver de perto um Pokémon que voltou de um fóssil, pra conferir o desenho do livro dele.',
  volta:{
    titulo:d => { const p = Tarefas.doFossil(); return p ? `Mostrar ${nomeExib(p)} pro Linus` : 'Mostrar um Pokémon de fóssil pro Linus'; },
    requer:d => !!Tarefas.doFossil(), falta:'O Linus quer ver de perto um Pokémon que voltou de um fóssil.',
    falas:d => {
      const p = Tarefas.doFossil();
      if (!p) return [];
      return [
        `O Linus fecha o livro com o dedo dentro, pra não perder a página, e anda em volta de ${nomeExib(p)} três vezes.`,
        fala('Linus', 'O desenho está errado.', null, 'Ele parece contente com isso.'),
        fala('Linus', 'É maior. E a cor está errada. E ninguém desenhou o jeito que ele olha.'),
        fala('Linus', 'Eu vou escrever pra editora. Você assina como testemunha?')
      ];
    },
    premio:{itens:{'PP Up':1}, rep:'Mostrou um Pokémon de fóssil a um menino de Cinnabar', moral:'fossil'}
  }
},

/* ─── Ilha Dois: as compotas da Hattie ─────────────────── */
{
  id:'compotas_da_hattie', cidade:'ilha_dois', quem:'Hattie', f:true, arq:'hattie', quadro:[24, 10, 24], tipo:'coleta', fase:3,
  titulo:'As compotas da Hattie',
  oferta:{titulo:'A senhora das compotas', sub:'Na porta da casa amarela, ela arruma potes vazios numa prateleira, com dois Marill dormindo no colo.'},
  pedido:[
    'Na porta da casa amarela da vila, uma senhora de vestido vermelho arruma potes vazios numa prateleira. Dois Marill dormem no colo dela.',
    fala('Hattie', 'A feira do cabo é no sábado, e eu não tenho fruta pra compota.'),
    fala('Hattie', 'A fruta-do-mato dá na Floresta das Frutas, na Ilha Três. O barqueiro não me leva mais: diz que eu trago fruta demais e afundo o barco.', 'riso'),
    fala('Hattie', 'Três cachos. Os vermelhos, não os roxos. Os roxos são dos Heracross.')
  ],
  aceitar:'"Eu trago três cachos."', recusar:'"Não vou pra Ilha Três agora."',
  recusou:[fala('Hattie', 'Então o sábado vai ser de compota de nada. Vende pouco.', 'riso')],
  lembrete:'A Hattie, das compotas da Ilha Dois, quer três cachos de fruta-do-mato vermelha da Floresta das Frutas, na Ilha Três. Os roxos, ela disse, são dos Heracross.',
  passo:{
    onde:'floresta_frutas', titulo:'Colher fruta-do-mato pra Hattie', sub:'Os cachos vermelhos. Os roxos são dos Heracross.',
    item:'Fruta-do-mato', meta:3,
    texto:['A Floresta das Frutas tem fruta em toda altura, e Pokémon comendo em quase todas.'],
    escolhas:[
      {texto:'Procurar os cachos vermelhos nos galhos baixos.', teste:{status:'percepcao', dificuldade:6, nome:'Percepção', eixo:'paciencia'},
       bom:{ganha:1, resultado:['Num galho baixo, escondido atrás de dois cachos roxos, um vermelho. Você colhe sem balançar o galho.']},
       ruim:{resultado:['Você só acha cacho roxo, e cada um tem alguém comendo.']}},
      {texto:'Subir na árvore grande, a mais carregada.', teste:{status:'forca', dificuldade:7, nome:'Força'},
       bom:{ganha:2, resultado:['Lá em cima tem dois cachos vermelhos inteiros, e ninguém comendo. Você desce com um em cada mão.']},
       ruim:{resultado:['O galho estala. Você desce antes dele.']}},
      {texto:'Mexer nos cachos roxos mesmo.',
       luta:{dex:214, ganha:1, intro:['Você nem toca no primeiro cacho: um Heracross desce do tronco de chifre baixo.'],
         venceu:['O Heracross se afasta. Atrás do cacho roxo dele, escondido, tinha um vermelho.'],
         perdeu:['O Heracross te tira da árvore com o chifre, sem pressa e sem raiva. O cacho é dele.']}}
    ]
  },
  volta:{
    titulo:'Levar as frutas pra Hattie', falta:'A Hattie continua arrumando potes vazios.',
    falas:[
      'A Hattie pesa os cachos na mão, um por um, como quem pesa ouro.',
      fala('Hattie', 'Vermelho, vermelho, vermelho. Você escuta.', 'riso'),
      'Antes de você ir embora, a casa inteira já cheira a fruta quente, e os Marill acordam.',
      fala('Hattie', 'O primeiro pote é seu. E grava o meu número: quando sair a próxima fornada, eu te aviso.')
    ],
    premio:{dinheiro:3000, itens:{'Pote de compota':1, 'Hyper Potion':3}, rep:'Colheu fruta pras compotas da Ilha Dois'}
  },
  contato:{rotulo:'Perguntar das compotas', falas:[
    'Vendi tudo no sábado. Tudo! Até o pote rachado.',
    'Os Marill comeram metade da fornada nova. Eu deixei. Eles trabalharam: ficaram olhando.',
    'Guardei um pote com o seu nome na tampa. Não precisa vir buscar. Ele espera.'
  ]}
},

/* ─── Ilha Quatro: o Swinub do Sven ────────────────────── */
{
  id:'swinub_do_sven', cidade:'ilha_quatro', quem:'Sven', arq:'sven', quadro:[27, 18, 25], tipo:'resgate', fase:4,
  titulo:'O Swinub do Sven',
  oferta:{titulo:'O pescador do gelo da beira do cais', sub:'Ele tem um buraco no gelo, uma vara e nenhuma vontade de pescar.'},
  pedido:[
    'Na beira do cais, um pescador de macacão azul acolchoado e óculos de neve está sentado do lado de um buraco no gelo, com a vara no chão.',
    fala('Sven', 'O meu Swinub fareja Magikarp debaixo do gelo. É o melhor pescador da ilha, e não sou eu.'),
    fala('Sven', 'Ontem ele farejou alguma coisa dentro da Gruta Gelada e entrou correndo. Não saiu.'),
    fala('Sven', 'Lá dentro tem Sneasel. Sneasel não gosta de Swinub. Ninguém sabe por quê.', 'baixo')
  ],
  aceitar:'"Eu vou buscar."', recusar:'"Agora não posso."',
  recusou:[fala('Sven', 'Tá. Eu fico aqui. Alguém tem que olhar o buraco.')],
  lembrete:'O Sven, pescador do gelo da Ilha Quatro, perdeu o Swinub dele dentro da Gruta Gelada, onde tem Sneasel.',
  passo:{
    onde:'gruta_gelada', titulo:'Procurar o Swinub do Sven', sub:'Em algum lugar da gruta, alguma coisa funga.',
    texto:['A Gruta Gelada é azul por dentro, e cada som volta três vezes. Em algum lugar, alguma coisa funga.'],
    escolhas:[
      {texto:'Seguir o fungado.', teste:{status:'percepcao', dificuldade:7, nome:'Percepção', eixo:'paciencia'},
       bom:{achou:true, resultado:['O fungado para quando você para e volta quando você anda. Na quarta curva, ele está lá.']},
       ruim:{resultado:['O eco te leva pra três lugares diferentes. Em nenhum tem Swinub.']}},
      {texto:d => `Iluminar o fundo da gruta ${Campo.iluminar().como || 'com luz'}.`, cond:d => Campo.iluminar().pode,
       desgaste:d => Campo.iluminar().semPilha ? null : 'Lanterna',
       teste:{status:'percepcao', dificuldade:5, nome:'Percepção'},
       bom:{achou:true, resultado:['A luz bate no gelo e volta azul pra todo lado. Num canto, dois olhinhos piscam.']},
       ruim:{resultado:['O gelo devolve a luz pra todo lado, e você não acha o fundo de nada.']}},
      {texto:'Deixar um pouco de Ração no chão e esperar quieto.', cond:d => Estado.contaItem('Ração') > 0, gasta:{'Ração':1}, tempo:2,
       achou:true, resultado:['Você espera encostad{o|a} na parede fria. O fungado chega primeiro, e o Swinub chega atrás dele.']}
    ],
    luta:{dex:215, intro:['O Swinub está encolhido num canto, e um Sneasel está entre vocês dois, de garra de fora.'],
      venceu:['O Sneasel some pelo teto. O Swinub sai do canto e encosta o focinho na sua bota.'],
      perdeu:['O Sneasel te obriga a recuar até a boca da gruta. O Swinub continua lá dentro.']}
  },
  volta:{
    titulo:'Levar o Swinub pro Sven', falta:'O Sven continua olhando o buraco no gelo.',
    falas:[
      'O Sven levanta tão rápido que derruba a vara no buraco do gelo.',
      fala('Sven', 'Ah, seu… vem cá.', null, 'O Swinub já está no colo dele antes de ele terminar a frase.'),
      fala('Sven', 'Pega a minha vara. Mentira, a vara foi pro fundo.', 'riso'),
      fala('Sven', 'Toma isso, e grava o meu número. Quando o gelo abrir de novo, eu te ligo.')
    ],
    premio:{dinheiro:4000, itens:{'Max Potion':2}, rep:'Tirou o Swinub de um pescador da Gruta Gelada'}
  },
  contato:{rotulo:'Perguntar do Swinub', falas:[
    'Ele farejou um cardume de Magikarp ontem, debaixo do gelo grosso. A ilha jantou por causa dele.',
    'Ele não chega mais perto da gruta. Eu também não. Nós dois combinamos.',
    'Ele dorme em cima do meu pé de noite. Esquenta o pé. Esfria o resto.'
  ]}
}
];

/* as espécies que voltam de fóssil no laboratório de Cinnabar */
const DEX_DE_FOSSIL = [138, 139, 140, 141, 142];

/* rosto e nome: cada um com o desenho dele, e o nome na lista da
   história (o sorteio não dá "Lia" pra uma desconhecida) */
TAREFAS.forEach(t => {
  if (typeof NOMES_DA_HISTORIA !== 'undefined') NOMES_DA_HISTORIA.add(t.quem);
  if (typeof RETRATO_POR_NOME !== 'undefined' && !RETRATO_POR_NOME[t.quem]) RETRATO_POR_NOME[t.quem] = 'trainers/' + t.arq;
});

const Tarefas = {
  porId(id){ return TAREFAS.find(t => t.id === id) || null; },
  reg(d){ d = d || Estado.dados; return (d.tarefas = d.tarefas || {}); },
  de(id, d){ return this.reg(d)[id] || null; },
  feita(id, d){ const r = this.de(id, d); return !!(r && r.estado === 'feita'); },
  aberta(id, d){ const r = this.de(id, d); return !!(r && r.estado === 'aberta'); },

  /* aparece pra quem chegou nela: a posição na jornada (ou a fase das
     ilhas) e a cidade pisada; quem recusou ouve de novo outro dia */
  disponivel(t, d){
    d = d || Estado.dados;
    if (!d || !t) return false;
    const r = this.de(t.id, d);
    if (r && r.estado) return false;
    if (r && r.recusou === d.relogio.dia) return false;
    if (t.fase != null){
      if (typeof Sevii === 'undefined' || !Sevii.aberto(d) || Sevii.fase(d) < t.fase) return false;
    } else if (typeof capNaJornada === 'function' && capNaJornada(d) < t.desde && !d.depoisDoFim) return false;
    if (typeof Mundo !== 'undefined' && Mundo.visitado && !Mundo.visitado(t.cidade)) return false;
    try { return !t.cond || t.cond(d); } catch(e){ return false; }
  },

  /* ---------- o andamento ---------- */
  passoFeito(t, d){
    d = d || Estado.dados;
    const r = this.de(t.id, d) || {};
    if (!t.passo) return true;
    if (t.tipo === 'coleta') return Estado.contaItem(t.passo.item) >= t.passo.meta;
    if (t.tipo === 'entrega') return !!r.entregou;
    return !!r.resgatou;
  },
  pronta(t, d){
    d = d || Estado.dados;
    if (!this.aberta(t.id, d) || !this.passoFeito(t, d)) return false;
    try { return !t.volta.requer || t.volta.requer(d); } catch(e){ return false; }
  },
  /* quanto falta, pro Diário e pra tela do passo ("2 de 3") */
  progresso(t, d){
    if (t.tipo !== 'coleta' || !t.passo) return null;
    return {tem:Math.min(t.passo.meta, Estado.contaItem(t.passo.item)), meta:t.passo.meta, item:t.passo.item};
  },
  /* o Pokémon do seu time que serve pro mostrar */
  doTipo(tipo){ return (Estado.dados.time || []).find(p => p && !p.morto && p.hp > 0 && (DEX[p.dex] || {}).tipos && DEX[p.dex].tipos.includes(tipo)) || null; },
  doFossil(){ return (Estado.dados.time || []).find(p => p && !p.morto && p.hp > 0 && DEX_DE_FOSSIL.includes(Number(p.dex))) || null; },

  /* ---------- na tela do lugar ----------
     Cada uma vira uma linha da seção Tarefas: quem pede (marca !), o
     passo onde ele se faz, quem espera (apagada, com o que falta) e a
     volta (marca ✓). O rosto é o de quem pediu, inclusive no passo. */
  afazeres(localId){
    const d = Estado.dados, out = [];
    if (!d) return out;
    for (const t of TAREFAS){
      const rosto = typeof retratoDe === 'function' ? retratoDe(t.quem) : null;
      if (t.cidade === localId){
        if (this.disponivel(t, d)) out.push({id:'tf_' + t.id, titulo:t.oferta.titulo, sub:t.oferta.sub, tarefa:'nova', rosto, quadro:t.quadro});
        else if (this.pronta(t, d)) out.push({id:'tf_' + t.id + '__volta', titulo:txt(t.volta.titulo), tarefa:'pronta', rosto, quadro:t.quadro});
        /* quem espera fica na tela, apagado, com o que ainda falta */
        else if (this.aberta(t.id, d)) out.push({id:'tf_' + t.id + '__volta', titulo:t.titulo, tarefa:'espera', rosto, quadro:t.quadro, fechada:t.volta.falta});
      }
      if (t.passo && t.passo.onde === localId && this.aberta(t.id, d) && !this.passoFeito(t, d)){
        const p = this.progresso(t, d);
        out.push({id:'tf_' + t.id + '__passo', titulo:t.passo.titulo, sub:p ? `${t.passo.sub} · ${p.tem} de ${p.meta}` : t.passo.sub,
          tarefa:'passo', rosto, quadro:t.quadro, fechada: t.tipo === 'entrega' && !Estado.contaItem(t.entrega) ? `Sem ${t.entrega.toLowerCase()} na mochila.` : null});
      }
    }
    return out;
  },
  fazer(x){
    const [id, qual] = String(x).split('__');
    const t = this.porId(id);
    if (!t) return Exploracao.tela();
    if (qual === 'passo') return this.passo(id);
    if (qual === 'volta') return this.entregar(id);
    return this.oferecer(id);
  },

  /* ---------- o pedido ---------- */
  oferecer(id){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !this.disponivel(t, d)) return Exploracao.tela();
    const L = LOCAIS[t.cidade] || {};
    UI.telaConversa({num:L.nome || '', titulo:t.oferta.titulo, loc:'Tarefa · ' + t.titulo,
      falas:t.pedido, quem:t.quem,
      botoes:[{texto:t.aceitar, classe:'diz', acao:`Tarefas.aceitar('${t.id}')`},
              {texto:t.recusar, classe:'fim', acao:`Tarefas.recusar('${t.id}')`}]});
  },
  aceitar(id){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !this.disponivel(t, d)) return Exploracao.tela();
    this.reg(d)[id] = {estado:'aberta', desde:d.relogio.dia};
    const avisos = [{tipo:'tarefa', texto:`Nova tarefa: ${t.titulo}.`}];
    if (t.entrega){ Estado.darItem(t.entrega, 1); avisos.push({tipo:'item', texto:`Recebeu 1× ${t.entrega}.`}); }
    Estado.registrar(`Aceitou um pedido de ${t.quem}, em ${(LOCAIS[t.cidade] || {}).nome}. ${t.lembrete}`);
    Estado.salvar('auto');
    Exploracao.tela(avisos);
  },
  recusar(id){
    const t = this.porId(id), d = Estado.dados;
    if (!t) return Exploracao.tela();
    this.reg(d)[id] = {recusou:d.relogio.dia};
    Estado.salvar('auto');
    const L = LOCAIS[t.cidade] || {};
    UI.telaConversa({num:L.nome || '', titulo:t.oferta.titulo, loc:'Tarefa · ' + t.titulo, falas:t.recusou || [], quem:t.quem,
      botoes:[{texto:'Seguir.', classe:'fim', acao:'Exploracao.tela()'}]});
  },

  /* ---------- o passo, fora da cidade ---------- */
  escolhasDe(t){
    const d = Estado.dados;
    return (t.passo.escolhas || []).map((e, i) => ({e, i})).filter(({e}) => { try { return !e.cond || e.cond(d); } catch(err){ return false; } });
  },
  passo(id, avisos){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !t.passo || !this.aberta(id, d) || this.passoFeito(t, d) || Mundo.id() !== t.passo.onde) return Exploracao.tela(avisos);
    const r = this.de(id, d), L = LOCAIS[t.passo.onde] || {};
    /* achou o Pokémon perdido e alguém está em volta dele: a luta é o que falta */
    if (t.tipo === 'resgate' && r.achou && t.passo.luta)
      return UI.telaConversa({num:L.nome || '', titulo:t.passo.titulo, loc:'Tarefa de ' + t.quem, falas:t.passo.luta.intro, avisos,
        botoes:[{texto:'Encarar.', classe:'luta', icone:'lutar', acao:`Tarefas.lutar('${id}')`},
                {texto:'Deixar pra depois.', classe:'fim', acao:'Exploracao.tela()'}]});
    const p = this.progresso(t, d);
    const botoes = this.escolhasDe(t).map(({e, i}) => ({texto:txt(e.texto), classe:e.luta ? 'luta' : e.teste ? 'teste' : '',
      icone:e.luta ? 'lutar' : e.teste ? 'dado' : null, acao:`Tarefas.escolher('${id}',${i})`}));
    botoes.push({texto:'Deixar pra depois.', classe:'fim', acao:'Exploracao.tela()'});
    UI.telaConversa({num:L.nome || '', titulo:t.passo.titulo, loc:'Tarefa de ' + t.quem,
      falas:txt(t.passo.texto) || [], extra:p ? this.htmlProgresso(t, p) : '', avisos, botoes});
  },
  htmlProgresso(t, p){
    const icone = typeof imgItem === 'function' ? imgItem(p.item) : '';
    return `<div class="tf-progresso" style="--tf-feito:${Math.round(p.tem / p.meta * 100)}%">${icone}<span class="tf-prog-nome">${UI.esc(p.item)}</span>
      <span class="tf-prog-barra" aria-hidden="true"><i></i></span><span class="tf-prog-n">${p.tem} de ${p.meta}</span></div>`;
  },
  escolher(id, i){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !t.passo || !this.aberta(id, d) || this.passoFeito(t, d)) return Exploracao.tela();
    const e = (t.passo.escolhas || [])[i];
    if (!e) return this.passo(id);
    try { if (e.cond && !e.cond(d)) return this.passo(id); } catch(err){ return this.passo(id); }
    const r = this.de(id, d), L = LOCAIS[t.passo.onde] || {};
    /* esperar: o relógio vai até a hora, e o lugar muda com ela */
    if (e.espera != null){
      Relogio.ate(e.espera);
      Estado.salvar('auto');
      return UI.telaConversa({num:L.nome || '', titulo:t.passo.titulo, loc:'Tarefa de ' + t.quem, falas:txt(e.resultado) || [],
        botoes:[{texto:'Voltar à procura.', acao:`Tarefas.passo('${id}')`}]});
    }
    /* luta antes de qualquer coisa: a moita do Beedrill, o cacho do Heracross */
    if (e.luta) return this.lutar(id, i);
    const avisos = [];
    if (e.tempo !== 0) Mundo.passar(e.tempo || 1);
    for (const [nome, q] of Object.entries(e.gasta || {})){
      for (let k = 0; k < q; k++) Estado.usarItem(nome);
      avisos.push({tipo:'item', texto:`Usou ${q}× ${nome}.`});
    }
    if (e.desgaste) avisos.push(...(Historia.aplicar({desgaste:e.desgaste}) || []));
    let rol = null, ramo = e, critico = false;
    if (e.teste){
      const valor = Estado.j.status[e.teste.status] || 0;
      rol = e.teste.eixo ? Dados.testeComTime(valor, e.teste.dificuldade, e.teste.nome || e.teste.status, e.teste.eixo)
                         : Dados.teste(valor, e.teste.dificuldade, e.teste.nome || e.teste.status);
      const passou = rol.grau === 'sucesso' || rol.grau === 'critico';
      critico = rol.grau === 'critico';
      ramo = (passou ? e.bom : e.ruim) || {};
      if (rol.afinidade && rol.afinidade.linha) avisos.push({tipo:'natureza', texto:rol.afinidade.linha});
      if (rol.linhaTime) avisos.push({tipo:'natureza', texto:rol.linhaTime});
    }
    if (ramo.achou) r.achou = true;
    if (ramo.ganha){
      const n = ramo.ganha + (critico ? 1 : 0);
      Estado.darItem(t.passo.item, n);
      avisos.push({tipo:'item', texto:`Recebeu ${n}× ${t.passo.item}.`});
    }
    if (e.entrega){
      Estado.usarItem(t.entrega);
      r.entregou = true;
      avisos.push({tipo:'item', texto:`Entregou 1× ${t.entrega}.`});
      Estado.registrar(`Entregou ${t.entrega.toLowerCase()} de ${t.quem} em ${L.nome}.`);
    }
    /* achou e ninguém em volta: resgatado; com alguém em volta, a luta */
    if (t.tipo === 'resgate' && r.achou && !t.passo.luta) r.resgatou = true;
    Estado.salvar('auto');
    if (typeof Exploracao !== 'undefined' && Exploracao.toque) Exploracao.toque();
    const feito = this.passoFeito(t, d);
    const linhaRol = rol ? `<div class="teste-linha"><span class="k">${UI.esc(rol.nomeStatus || e.teste.nome || 'teste')}</span>
      <span class="v mono">${UI.esc(Dados.contaDoTeste(rol))}</span><span class="grau ${UI.esc(rol.grau)}">${UI.esc(rol.texto)}</span></div>` : '';
    const p = this.progresso(t, d);
    const botoes = [];
    if (t.tipo === 'resgate' && r.achou && t.passo.luta && !r.resgatou) botoes.push({texto:'Ir até ele.', classe:'luta', icone:'lutar', acao:`Tarefas.passo('${id}')`});
    else if (!feito) botoes.push({texto:'Continuar procurando.', acao:`Tarefas.passo('${id}')`});
    botoes.push({texto:feito ? `Voltar pra ${t.quem}.` : 'Deixar pra depois.', classe:'fim', acao:'Exploracao.tela()'});
    if (feito) avisos.push({tipo:'tarefa', texto:`Pronto: ${t.volta.falta ? 'é só voltar pra ' + t.quem : t.titulo}.`});
    UI.telaConversa({num:L.nome || '', titulo:t.passo.titulo, loc:'Tarefa de ' + t.quem,
      falas:txt(ramo.resultado || e.resultado) || [], extra:linhaRol + (p ? this.htmlProgresso(t, p) : ''), avisos, botoes});
  },

  /* ---------- a luta do passo ----------
     Selvagem, no nível do lugar, que entra pela porta de sempre
     (Exploracao.encontro) e volta pra cá pelo Jogo.depoisDaEstrada.
     Recarregar no meio da luta perde a volta, e só isso: o passo
     continua na lista do lugar. */
  lutar(id, i){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !t.passo) return Exploracao.tela();
    const e = i != null ? t.passo.escolhas[i] : null;
    const def = e ? e.luta : t.passo.luta;
    if (!def) return this.passo(id);
    if (!Estado.primeiroApto()) return this.passo(id, [{tipo:'dano', texto:'Ninguém do time está em pé pra encarar.'}]);
    const L = LOCAIS[t.passo.onde] || {};
    const nivel = Math.max(3, (L.nivel || 5) + 1);
    const selvagem = criarPokemon(def.dex, nivel);
    const r = this.de(id, d);
    r.luta = {uid:selvagem.uid, escolha:i != null ? i : null};
    Estado.salvar('auto');
    Jogo.depoisDaEstrada = avisos => Tarefas.depoisDaLuta(id, avisos);
    Exploracao.encontro(selvagem, def.intro, {fixo:true});
  },
  depoisDaLuta(id, avisos){
    const t = this.porId(id), d = Estado.dados;
    const r = t && this.de(id, d);
    if (!t || !r || !r.luta) return Exploracao.tela(avisos);
    const lut = r.luta;
    delete r.luta;
    const def = lut.escolha != null ? t.passo.escolhas[lut.escolha].luta : t.passo.luta;
    const fim = Batalha.fim || {};
    const foiEssa = Batalha.inimigo && Batalha.inimigo.uid === lut.uid;
    const venceu = foiEssa && ['vitoria', 'captura', 'encarou'].includes(fim.resultado);
    const out = (avisos || []).slice();
    if (venceu){
      if (def.ganha){ Estado.darItem(t.passo.item, def.ganha); out.push({tipo:'item', texto:`Recebeu ${def.ganha}× ${t.passo.item}.`}); }
      if (t.tipo === 'resgate') r.resgatou = true;
    } else if (t.tipo === 'resgate') r.achou = false;
    Estado.salvar('auto');
    const L = LOCAIS[t.passo.onde] || {};
    const feito = this.passoFeito(t, d);
    if (feito) out.push({tipo:'tarefa', texto:`Pronto: é só voltar pra ${t.quem}.`});
    const p = this.progresso(t, d);
    UI.telaConversa({num:L.nome || '', titulo:t.passo.titulo, loc:'Tarefa de ' + t.quem,
      falas:venceu ? def.venceu : (def.perdeu || []).concat(['Dá pra tentar de novo.']), extra:p ? this.htmlProgresso(t, p) : '', avisos:out,
      botoes:[!feito ? {texto:'Continuar procurando.', acao:`Tarefas.passo('${id}')`} : null,
              {texto:feito ? `Voltar pra ${t.quem}.` : 'Deixar pra depois.', classe:'fim', acao:'Exploracao.tela()'}].filter(Boolean)});
  },

  /* ---------- a volta: o que ela pediu, na mão dela ---------- */
  entregar(id){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !this.pronta(t, d)) return Exploracao.tela();
    const falas = (txt(t.volta.falas) || []).filter(Boolean);
    const pr = t.volta.premio || {}, avisos = [];
    /* a pessoa fica com tudo o que você colheu: a de noite dá duas de uma
       vez, e a que sobrava ficava nos Itens-chave sem servir pra nada */
    if (t.tipo === 'coleta'){
      const n = Estado.contaItem(t.passo.item);
      for (let k = 0; k < n; k++) Estado.usarItem(t.passo.item);
      avisos.push({tipo:'item', texto:`Entregou ${n}× ${t.passo.item}.`});
    }
    /* o Pokémon que você mostrou sai contente */
    if (pr.moral){
      const p = pr.moral === 'fossil' ? this.doFossil() : this.doTipo(pr.moral);
      if (p){ p.moral = Math.min(100, (p.moral || 50) + MORAL_DO_MOSTRAR); avisos.push({tipo:'info', texto:`${nomeExib(p)} gostou da visita.`}); }
    }
    if (pr.dinheiro){ Estado.j.dinheiro += pr.dinheiro; avisos.push({tipo:'item', texto:`+${pr.dinheiro.toLocaleString('pt-BR')} ₽`}); }
    for (const [nome, q] of Object.entries(pr.itens || {})){ Estado.darItem(nome, q); avisos.push({tipo:'item', texto:`Recebeu ${q}× ${nome}.`}); }
    const atual = (d.npcs[t.quem] || {}).opiniao || 0;
    Estado.lembrarNPC(t.quem, {opiniao:atual + OPINIAO_DA_TAREFA, memoria:`Você cumpriu o que ${t.f ? 'ela' : 'ele'} pediu: ${t.titulo.toLowerCase()}.`});
    if (pr.rep){
      const m = Estado.mudarRep('bom', 1, pr.rep, {});
      if (m && m.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${m.de} → ${m.para}`});
    }
    const r = this.de(id, d);
    r.estado = 'feita'; r.dia = d.relogio.dia;
    Estado.marcar('tarefa_feita_' + id);
    /* quem tem telefone deixa o número */
    if (t.contato && Estado.temPokenav() && Estado.registrarNumero('tarefa_' + id))
      avisos.push({tipo:'nav', texto:`Gravou o número de ${t.quem} no PokéNav.`});
    Estado.registrar(`Cumpriu a tarefa de ${t.quem}: ${t.titulo.toLowerCase()}.`);
    Estado.salvar('auto');
    if (typeof Som !== 'undefined' && Som.efeito) Som.efeito('item');
    const L = LOCAIS[t.cidade] || {};
    UI.telaConversa({num:L.nome || '', titulo:t.titulo, loc:'Tarefa cumprida', falas, quem:t.quem, avisos,
      extra:this.htmlSelo(t), botoes:[{texto:'Seguir.', classe:'fim', acao:'Exploracao.tela()'}]});
  },
  /* a moeda com o rosto de quem pediu, e a marca no canto (! ✓ …) */
  moeda(rosto, marca, classe, quadro){
    const sinal = {nova:'!', pronta:'✓', espera:'…'}[marca] || '';
    /* o quadro da cabeça no desenho de 80 px: [x, y, lado] (o resto fica fora da janela) */
    const q = quadro ? ` style="--q-x:${quadro[0]};--q-y:${quadro[1]};--q-l:${quadro[2]}"` : '';
    return `<span class="tf-moeda${classe ? ' ' + classe : ''}"><span class="tf-janela"${q}>${rosto ? `<img src="${rosto}" alt="">` : ''}</span>${
      sinal ? `<span class="tf-marca" data-marca="${marca}" aria-hidden="true">${sinal}</span>` : ''}</span>`;
  },
  /* o selo de tarefa cumprida: o rosto de quem pediu, carimbado */
  htmlSelo(t){
    const r = typeof retratoDe === 'function' ? retratoDe(t.quem) : null;
    return `<div class="tf-selo">${this.moeda(r, null, null, t.quadro)}
      <span class="tf-selo-t"><small>Tarefa cumprida</small><b>${UI.esc(t.titulo)}</b></span><span class="tf-selo-ok" aria-hidden="true">✓</span></div>`;
  },

  /* ---------- o Diário: o que cada um pediu, como você lembra ---------- */
  htmlDiario(){
    const d = Estado.dados;
    if (!d) return '';
    const abertas = TAREFAS.filter(t => this.aberta(t.id, d)), feitas = TAREFAS.filter(t => this.feita(t.id, d));
    if (!abertas.length && !feitas.length) return '';
    const rosto = t => this.moeda(typeof retratoDe === 'function' ? retratoDe(t.quem) : null, null, 'pequena', t.quadro);
    const linha = t => {
      const p = this.progresso(t, d), pronta = this.pronta(t, d);
      return `<li class="tf-diario${pronta ? ' pronta' : ''}">${rosto(t)}<span class="tf-d-txt"><b>${UI.esc(t.titulo)}${pronta ? ' <em>pronta pra entregar</em>' : ''}</b>
        <span>${UI.esc(t.lembrete)}</span>${p ? `<small>${UI.esc(p.item)}: ${p.tem} de ${p.meta}</small>` : ''}</span></li>`;
    };
    return `<h3>Tarefas da cidade</h3>
      ${abertas.length ? `<ul class="tf-lista">${abertas.map(linha).join('')}</ul>` : '<p class="nada">Nenhuma em aberto.</p>'}
      ${feitas.length ? `<p class="tf-feitas"><span>Cumpridas</span>${feitas.map(t => `<span class="tf-feita" title="${UI.esc(t.titulo)}">${rosto(t)}${UI.esc(t.quem)}</span>`).join('')}</p>` : ''}`;
  },

  /* tudo o que se fala aqui, pra conferência (chk-baloes) */
  amostras(){
    const out = [];
    for (const t of TAREFAS){
      out.push({onde:`tarefa/${t.id}/pedido`, dono:t.quem, linhas:t.pedido});
      if (t.recusou) out.push({onde:`tarefa/${t.id}/recusou`, dono:t.quem, linhas:t.recusou});
      if (t.passo){
        out.push({onde:`tarefa/${t.id}/passo`, dono:null, linhas:txt(t.passo.texto) || []});
        (t.passo.escolhas || []).forEach((e, i) => {
          for (const [k, ramo] of [['', e], ['bom', e.bom], ['ruim', e.ruim]])
            if (ramo && ramo.resultado) out.push({onde:`tarefa/${t.id}/passo>${i}${k}`, dono:t.passo.onde === 'lavender' ? 'Mirela' : null, linhas:txt(ramo.resultado) || []});
          if (e.luta) for (const k of ['intro', 'venceu', 'perdeu']) out.push({onde:`tarefa/${t.id}/luta${i}/${k}`, dono:null, linhas:e.luta[k] || []});
        });
        if (t.passo.luta) for (const k of ['intro', 'venceu', 'perdeu']) out.push({onde:`tarefa/${t.id}/luta/${k}`, dono:null, linhas:t.passo.luta[k] || []});
      }
      out.push({onde:`tarefa/${t.id}/volta`, dono:t.quem, linhas:(txt(t.volta.falas) || []).filter(Boolean)});
      if (t.contato) out.push({onde:`tarefa/${t.id}/telefone`, dono:t.quem, linhas:t.contato.falas.map(l => fala(t.quem, l))});
    }
    return out;
  }
};

/* ── PokéNav: quem tem telefone deixa o número na volta ──
   Liga como todo mundo da agenda (recados.js: a ligação à toa, o
   recado com presente, o pedido de favor), e você liga pra saber do
   que foi resolvido. */
function contatosDasTarefas(){
  return TAREFAS.filter(t => t.contato).map(t => ({
    id:'tarefa_' + t.id, tipo:'figura', nome:t.quem, papel:'', cidade:(LOCAIS[t.cidade] || {}).nome || '',
    requer:d => Tarefas.feita(t.id, d),
    oferece:['prova'],
    prova:{
      rotulo:t.contato.rotulo, esperaCap:1, limite:99,
      texto:d => [fala(t.quem, Dados.escolher(t.contato.falas))],
      rep:{eixo:'bom', delta:1, motivo:`Ligou pra ${t.quem} pra saber como estão as coisas`}
    }
  }));
}
