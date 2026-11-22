/* ============================================================
   ILHAS SEVII · III — A MARÉ (capítulo 35, pós-jogo)
   Ilha Um e Ilha Dois. A turma do cais (a Maré) é a molecada que
   ficou sem nada quando a fábrica de conserva fechou: eles pegam, e o
   que pegam sobe de bote pra Ilha Três de madrugada. Você pergunta no
   cais, na Guarda, na pousada e na feira, entra na fábrica, e acha a
   Noa no fim do cais com a mochila da Etta no colo. O que você faz com
   ela decide a rival (sv_noa_*). Ver sevii.js.
   ============================================================ */
/* o que dá pra investigar de manhã: cada lugar uma vez, e a fábrica sempre */
function _c35Manha(){
  const ainda = id => d => !Historia.jaAconteceu(id);
  return [
    {texto:'Perguntar no cais pela menina da jaqueta preta.', vai:'c35_o_pescador', cond:ainda('c35_o_pescador')},
    {texto:'Subir o morro até a Guarda.', vai:'c35_o_sargento', cond:ainda('c35_o_sargento')},
    {texto:'Ir até a pousada onde levaram a caixa térmica.', vai:'c35_a_pousada', cond:ainda('c35_a_pousada')},
    {texto:'Pegar a balsa da manhã pra feira da Ilha Dois.', vai:'c35_a_feira', cond:ainda('c35_a_feira')},
    {texto:'Ir até a fábrica de conserva fechada, no fim do cais.', vai:'c35_a_fabrica'}
  ];
}

CAPITULOS.push(
{
num:35, titulo:'A Maré', local:'Ilha Um — o cais e a fábrica fechada', ambiente:'agua', nivelArea:62,
tom:'inquieto', posJogo:true,
ancora:{local:'ilha_um', chamada:'No cais da Ilha Um, um homem de transmissor na mão conta pra ninguém, em voz alta, quantas Pokébolas sumiram desde ontem.'},
entradas:['c35_a_manha'],
inicio: d => 'c35_a_manha',
cenas:{

c35_a_manha:{
  texto:[
    'O cais da Ilha Um amanhece com cheiro de sal e de enxofre, e com uma roda de gente em volta de um rapaz de topete azul que fala num transmissor de mão.',
    d => d.flags.sv_conheceu_ziggy
      ? fala('Ziggy', 'Ouvinte, {o Campeão|a Campeã} de Kanto acabou de chegar na roda! Fica aí, que você vai querer ouvir.', null, 'Ele te vê e acena com o fio do microfone.')
      : fala('Ziggy', 'Ouvinte, aqui é o Ziggy, de Goldenrod, direto do cais da Ilha Um, e as notícias não são boas.'),
    fala('Ziggy', 'Ontem de manhã, a Milotic de uma coordenadora de Lilycove, aqui neste cais. Ontem de noite, uma caixa térmica com seis ovos, da pousada lá de cima. E hoje cedo, na feira da Ilha Dois, a mochila inteira de uma artesã de Azalea, com oitenta e quatro Pokébolas e dois Pokémon dentro.'),
    fala('Ziggy', 'Três em um dia, ouvinte. E o torneio nem começou.', 'baixo'),
    d => d.flags.sv_conheceu_florian ? 'A caixa térmica é a do Florian. Você lembra da tampa levantada um dedo, dos seis ovos creme em fila.' : '',
    d => d.flags.sv_conheceu_etta ? 'A mochila é a da Etta. Oitenta e quatro bolas, e ela sabe o dia de cada uma.' : ''
  ],
  escolhas:_c35Manha()
},

c35_a_hub:{
  texto:[
    d => {
      const feitos = ['c35_o_pescador', 'c35_o_sargento', 'c35_a_pousada', 'c35_a_feira'].filter(id => Historia.jaAconteceu(id)).length;
      return feitos >= 3 ? 'O sol já passou do meio do céu. No fim do cais, o portão acorrentado da fábrica continua no mesmo lugar, e os três moleques do barco encalhado continuam olhando.'
                         : 'O cais continua cheio. Os três moleques do barco encalhado continuam lá, olhando quem passa.';
    }
  ],
  escolhas:_c35Manha()
},

c35_o_pescador:{
  texto:[
    'O pescador de boné pesa Magikarp numa balança de mola, um por um, e devolve pro balde os pequenos.',
    fala('o pescador de boné', 'Menina de jaqueta preta grande demais? Com Murkrow no ombro?', null, 'Ele nem levanta os olhos da balança.'),
    fala('o pescador de boné', 'É a filha do Kelp. Noa. O pai dela tinha o melhor barco do cais, até a fábrica fechar.'),
    fala('o pescador de boné', 'Fábrica fechou, ninguém comprava mais nada, e o Kelp pegou óleo fiado com os Faróis pra continuar saindo. Os Faróis são os das motos, da Ilha Três. Óleo fiado com eles é óleo que você paga com o barco.'),
    fala('o pescador de boné', 'Levaram o barco faz um ano. O Kelp parou de sair de casa. A menina começou a andar com a Maré.'),
    'Ele joga um Magikarp pequeno de volta no balde, e o Magikarp pula três vezes antes de se conformar.',
    fala('o pescador de boné', 'A Maré é a molecada do cais. Filho de quem trabalhava na fábrica. Quem manda neles é o Jory, que era o menino da entrega da fábrica. O que eles pegam não fica na ilha: sai de bote, de madrugada, pro norte, pra Três.', 'baixo')
  ],
  ef:{flag:['sv_sabe_da_noa', 'sv_sabe_do_jory', 'sv_sabe_dos_farois'],
      registrar:'O pescador do cais contou: a menina da jaqueta é a Noa, filha do Kelp; a Maré é a molecada da fábrica fechada, comandada pelo Jory; e o que eles pegam sobe de bote pros Faróis, na Ilha Três.'},
  escolhas:[
    {texto:'Agradecer e comprar um Magikarp grande, pra ele fechar a balança.', vai:'c35_a_hub',
     ef:{dinheiro:-200, npc:{nome:'o pescador de boné', opiniao:2, memoria:'Comprou um Magikarp grande e ouviu a história da Noa.'}}},
    {texto:'Agradecer e seguir.', vai:'c35_a_hub'}
  ]
},

c35_o_sargento:{
  texto:[
    'A Guarda das Ilhas é uma sala no alto do morro, do lado da torre de rádio: uma mesa, um arquivo de aço, um mapa das sete ilhas na parede e uma cela vazia com a porta aberta.',
    'O Sargento Lund está sentado com o caderno aberto e uma lista grudada na parede com fita: vinte e três linhas, cada uma com um nome de Pokémon e uma cidade de longe.',
    fala('Sargento Lund', 'Ecruteak. Lilycove. Fortree. Olivine. Ninguém daqui perdeu nada.', null, 'Ele bate na lista com o dedo.'),
    fala('Sargento Lund', 'A Maré pega. Disso eu sei. Mas a Maré é criança. Criança não sabe que um Feebas criado vale mais que a fábrica inteira. Alguém sabe, e diz pra eles o que pegar.'),
    d => Sevii.procurado(d)
      ? 'Ele abre a gaveta da mesa, tira uma folha de Kanto com a sua foto e o carimbo da Patrulha, olha a folha, olha você, e guarda de volta na gaveta. Fecha a gaveta.'
      : 'Ele fecha o caderno.',
    d => Sevii.procurado(d) ? fala('Sargento Lund', 'Kanto que venha buscar. Aqui eu preciso de gente.', 'frio') : ''
  ],
  ef:{flag:'sv_lund_ouviu', registrar:'Na Guarda das Ilhas, o Sargento Lund mostrou a lista: vinte e três roubos, todos de Pokémon de gente de fora. Alguém escolhe o que a Maré pega.'},
  escolhas:[
    {texto:'"Me põe como auxiliar da Guarda. Eu vou atrás."', vai:'c35_auxiliar'},
    {texto:'"Por que você não vai na Ilha Três?"', vai:'c35_por_que_nao_vai'},
    {texto:'Voltar pro cais.', vai:'c35_a_hub'}
  ]
},
c35_por_que_nao_vai:{
  texto:[
    fala('Sargento Lund', 'Porque se eu for pra Três, a Um fica sem ninguém. E a Dois. E a Quatro.'),
    fala('Sargento Lund', 'E porque quando eu fui, no ano passado, voltei a pé pela ponte, sem a bicicleta e sem dois dentes.', 'frio')
  ],
  escolhas:[
    {texto:'"Me põe como auxiliar da Guarda. Eu vou atrás."', vai:'c35_auxiliar'},
    {texto:'Voltar pro cais.', vai:'c35_a_hub'}
  ]
},
c35_auxiliar:{
  texto:[
    'Ele te olha um tempo comprido, do jeito que olhou a lista.',
    d => (Sevii.daLei(d) || d.flags.sv_lund_ofereceu)
      ? fala('Sargento Lund', 'Você já tinha oferecido no cais. Eu anotei. Eu anoto tudo.')
      : fala('Sargento Lund', 'Gente de fora oferece muita coisa no primeiro dia. No segundo, pega o navio de volta.'),
    'Ele abre a gaveta de baixo, tira uma braçadeira verde desbotada, com GUARDA bordado à mão, e põe em cima da mesa.',
    fala('Sargento Lund', 'Isso não vale nada em Kanto. Aqui vale uma coisa: quando você disser "Guarda", a ilha sabe que é comigo.'),
    fala('Sargento Lund', 'E quando você pegar alguém, você traz pra mim. Não resolve na mão.')
  ],
  ef:{flag:'sv_lund_auxiliar', itens:{'Braçadeira da Guarda':1},
      npc:{nome:'Sargento Lund', opiniao:2, memoria:'Virou auxiliar da Guarda das Ilhas, com a braçadeira verde.'},
      rep:{eixo:'bom', delta:1, motivo:'Virou auxiliar da Guarda das Ilhas pra ir atrás dos roubos'},
      registrar:'O Sargento Lund te deu a braçadeira de auxiliar da Guarda das Ilhas.'},
  escolhas:[
    {texto:'Pôr a braçadeira e voltar pro cais.', vai:'c35_a_hub'}
  ]
},

c35_a_pousada:{
  texto:[
    'A pousada do cais tem dois andares e uma varanda de madeira, e no quarto do fundo o Florian está sentado na cama, olhando o lugar da mesa onde a caixa térmica estava.',
    d => d.flags.sv_conheceu_florian ? fala('Florian', 'Ah. Você. Do navio.', null, 'Ele tenta sorrir e desiste no meio.') : fala('Florian', 'Florian. Desculpa. Eu não estou recebendo ninguém hoje.'),
    fala('Florian', 'Fora da caixa, um ovo aguenta umas quarenta horas. Dentro de uma caixa desligada, menos. Eu calculei. Eu não devia ter calculado.', 'baixo'),
    'A janela do quarto dá pro telhado da varanda. No peitoril tem marca de pé molhado, pequeno, de quem andou descalço, e uma pena preta comprida presa na lasca da madeira.'
  ],
  escolhas:[
    {texto:'Olhar a pena de perto.', vai:'c35_a_pena'},
    {texto:'"Eu vou trazer a sua caixa."', vai:'c35_a_hub',
     ef:{flag:'sv_florian_prometeu', npc:{nome:'Florian', opiniao:2, memoria:'Prometeu trazer de volta a caixa térmica com os seis ovos.'},
         registrar:'Prometeu ao Florian trazer de volta a caixa térmica dos seis ovos.'}}
  ]
},
c35_a_pena:{
  texto:[
    'É pena de Murkrow. Preta com reflexo azul, do tamanho de um dedo, ainda com a penugem da base.',
    d => d.flags.sv_viu_a_noa || d.flags.sv_sabe_da_noa
      ? 'Você lembra de um Murkrow num ombro, no cais, olhando você antes da dona.'
      : 'No cais tem Murkrow em todo poste. Mas não em todo peitoril de pousada.'
  ],
  ef:{flag:'sv_pista_pena', itens:{'Pena de Murkrow':1}, registrar:'No peitoril da pousada, de onde levaram a caixa do Florian: marca de pé descalço e uma pena de Murkrow.'},
  escolhas:[
    {texto:'"Eu vou trazer a sua caixa."', vai:'c35_a_hub',
     ef:{flag:'sv_florian_prometeu', npc:{nome:'Florian', opiniao:2, memoria:'Prometeu trazer de volta a caixa térmica com os seis ovos.'},
         registrar:'Prometeu ao Florian trazer de volta a caixa térmica dos seis ovos.'}},
    {texto:'Guardar a pena e voltar pro cais.', vai:'c35_a_hub'}
  ]
},

c35_a_feira:{
  texto:[
    'A balsa da manhã leva meia hora até a Ilha Dois. A feira já está montada, de lona colorida de ponta a ponta da praça, e no meio dela uma barraca sem nada em cima: só uma toalha estendida em duas cadeiras.',
    'A Etta está sentada atrás da toalha, de braço cruzado, olhando pra frente com uma raiva tão grande que as pessoas desviam da barraca.',
    d => d.flags.sv_conheceu_etta ? fala('Etta', 'Sobrou a toalha.', null, 'Ela diz isso antes de você chegar.') : fala('Etta', 'Se veio comprar, sobrou a toalha.'),
    fala('Etta', 'Uma garota de cabelo comprido, roupa preta. Pediu pra ver a bola azul de perto. Enquanto eu mostrava a azul, outro levou a mochila de baixo da mesa.'),
    fala('Etta', 'Oitenta e quatro. O Heracross. O Ninjask, que eu peguei com uma bola que levou três meses.', 'baixo'),
    'Ela aperta os olhos e não deixa cair nada.',
    fala('Etta', 'Eu vou lutar sem os dois, se for preciso. Eu não vou chorar na frente de turista.')
  ],
  ef:{flag:'sv_viu_a_etta', registrar:'Na feira da Ilha Dois, a Etta contou: uma garota de roupa preta pediu pra ver a bola azul enquanto outro levava a mochila.'},
  escolhas:[
    {texto:'"A garota de roupa preta eu já vi. No cais da Um."', vai:'c35_feira_volta',
     cond:d => !!d.flags.sv_mare_subiu || Historia.jaAconteceu('c34_a_garota'),
     ef:{flag:'sv_etta_sabe', npc:{nome:'Etta', opiniao:2, memoria:'Disse que já tinha visto a garota de roupa preta, no cais da Ilha Um.'}}},
    {texto:'"Eu vou trazer a mochila."', vai:'c35_feira_volta',
     ef:{flag:'sv_etta_prometeu', npc:{nome:'Etta', opiniao:2, memoria:'Prometeu trazer a mochila de volta.'}}},
    {texto:'Pegar a balsa de volta pra Ilha Um.', vai:'c35_a_hub'}
  ]
},
c35_feira_volta:{
  texto:[
    'Ela te olha de lado, desconfiada de tudo e de todo mundo, e depois faz que sim com a cabeça uma vez só, curta.',
    fala('Etta', 'Se você achar, não abre a mochila. As bolas estão em ordem. Eu sei a ordem.')
  ],
  escolhas:[
    {texto:'Pegar a balsa de volta pra Ilha Um.', vai:'c35_a_hub'}
  ]
},

c35_a_fabrica:{
  texto:[
    'A fábrica de conserva ocupa o fim do cais inteiro: um galpão de tijolo com as janelas de cima quebradas, o portão acorrentado com um cadeado novo, e no muro, em tinta azul, uma onda desenhada e a palavra MARÉ.',
    'Lá dentro alguém ri. Alguém assobia. Um Pokémon late pra alguma coisa que ninguém vê.',
    d => d.flags.sv_lund_auxiliar ? 'A braçadeira verde aperta o seu braço. Ela não vale nada lá dentro. Ou vale tudo.' : ''
  ],
  escolhas:[
    {texto:'Entrar pela janela quebrada dos fundos, sem ninguém ver.', vai:'c35_a_janela'},
    {texto:'Bater no portão e chamar o Jory pelo nome.', vai:'c35_o_portao', cond:d => !!d.flags.sv_sabe_do_jory},
    {texto:'Mostrar o pino da rede pela grade do portão.', vai:'c35_a_rede', cond:d => Sevii.daRede(d)},
    {texto:'Bater no portão.', vai:'c35_o_portao', cond:d => !d.flags.sv_sabe_do_jory}
  ]
},

c35_a_janela:{
  texto:['A janela dos fundos dá pra uma passarela de ferro em cima das esteiras paradas. Ela range. Tudo nessa fábrica range.'],
  teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção', critico:'c35_dentro', sucesso:'c35_dentro', parcial:'c35_pego', falha:'c35_pego'}
},
c35_dentro:{
  texto:[
    'Da passarela dá pra ver tudo. Embaixo, em cima das esteiras de lata, uns dez moleques e meninas, de treze a dezoito anos, contando Pokébola numa caixa de madeira escrita TRÊS a carvão.',
    'Do lado da caixa, um rapaz de agasalho preto e branco e uma faixa laranja no cabelo, que só pode ser o Jory, anota num caderno de entrega velho, com o timbre da fábrica.',
    'E de frente pra ele, de jaqueta preta grande demais, a menina do cais.',
    fala('Noa', 'A Milotic era de uma moça que chorou no cais. Eu vi ela chorar.'),
    fala('Jory', 'Todo dono chora. É por isso que tem dono.'),
    fala('Jory', 'O barco do teu pai está na rampa do farol, Noa. Hoje a entrega é tua. A mochila da feira, no fim do cais, às duas.', 'frio'),
    'Ela pega a mochila cheia de Pokébola pendurada e sai pela porta lateral sem dizer nada. O Murkrow sai voando atrás.'
  ],
  ef:{flag:['sv_ouviu_a_maré', 'sv_sabe_do_barco_da_noa'], registrar:'Na fábrica fechada: o Jory mandou a Noa levar a mochila da Etta pro fim do cais às duas da manhã. O barco do pai dela está na rampa do farol, na Ilha Três.'},
  escolhas:[
    {texto:'Descer da passarela, na frente de todo mundo.', vai:'c35_o_jory'},
    {texto:'Sair pela janela e esperar a Noa no fim do cais.', vai:'c35_o_fim_do_cais'}
  ]
},
c35_pego:{
  texto:[
    'A passarela range alto demais no terceiro passo. Embaixo, dez cabeças viram ao mesmo tempo.',
    'Uma garota de cabelo comprido e roupa preta assobia com dois dedos, e a molecada se espalha em volta da escada da passarela, cada um com uma Pokébola na mão.',
    fala('uma garota da Maré', 'Você de novo. O pedágio subiu.', 'frio', 'Ela é a mesma do cais.')
  ],
  escolhas:[
    {texto:'Descer e pagar.', vai:'c35_a_garota'}
  ]
},
c35_a_garota:{
  texto:['Ela solta a Pokébola com o mesmo estalo de dedo do cais.'],
  batalha:{sevii:'mare', mais:-4, tipo:'treinador', fuga:false,
           intro:'A garota da Maré solta a Pokébola do alto de uma esteira parada.',
           vitoria:'c35_o_jory', derrota:'c35_jory_ganhou'}
},

c35_o_portao:{
  texto:[
    d => d.flags.sv_sabe_do_jory ? 'Você bate no portão e chama: Jory.' : 'Você bate no portão.',
    'O riso lá dentro para. Depois de um minuto, o cadeado abre por dentro, e um rapaz de agasalho preto e branco, com uma faixa laranja no cabelo, segura o portão entreaberto com o pé.',
    d => fala('Jory', d.flags.sv_sabe_do_jory ? 'Quem te deu o meu nome?' : 'A fábrica está fechada. Faz três anos.'),
    d => d.flags.sv_lund_auxiliar ? 'Ele vê a braçadeira verde e ri pelo nariz.' : '',
    d => d.flags.sv_lund_auxiliar ? fala('Jory', 'O Lund agora contrata turista. A Guarda cresceu.', 'riso') : ''
  ],
  escolhas:[
    {texto:'"Vim buscar a mochila da feira."', vai:'c35_o_jory'}
  ]
},

c35_a_rede:{
  texto:[
    'Você encosta o pino no ferro do portão, do lado de dentro da grade, onde dá pra ver de longe.',
    'O riso lá dentro para. O rapaz que vem abrir tem faixa laranja no cabelo e um caderno de entrega velho debaixo do braço.',
    fala('Jory', 'A rede de Kanto.', null, 'Ele olha o pino, não você.'),
    fala('Jory', 'A rede de Kanto não manda aqui. Mas a rede de Kanto paga. Entra.'),
    'Lá dentro ele te mostra a caixa escrita TRÊS a carvão, cheia de Pokébola, como quem mostra mercadoria.',
    fala('Jory', 'A gente pega. Os Faróis compram. Quem compra dos Faróis eu nunca vi, e não quero ver. A mochila da feira já saiu daqui: está com a Noa, no fim do cais, pro bote das duas.')
  ],
  ef:{flag:['sv_sabe_dos_farois', 'sv_sabe_do_barco_da_noa'], registrar:'Pela rede, o Jory abriu a fábrica: a Maré pega, os Faróis compram, e alguém compra dos Faróis. A mochila da Etta está com a Noa, pro bote das duas da manhã.'},
  escolhas:[
    {texto:'"Quanto pela caixa inteira? Eu levo pra devolver."', vai:'c35_comprou_a_caixa', cond:d => d.jogador.dinheiro >= 4000},
    {texto:'"A caixa fica comigo. Você me deve o pino."', vai:'c35_o_jory'},
    {texto:'Ir atrás da Noa, no fim do cais.', vai:'c35_o_fim_do_cais'}
  ]
},
c35_comprou_a_caixa:{
  texto:[
    'Ele pensa menos do que devia. Moleque com fome pensa rápido em dinheiro.',
    fala('Jory', 'Quatro mil. E você não esteve aqui.'),
    'Você paga. Ele te entrega a caixa escrita TRÊS, com nove Pokébolas de gente de fora dentro, e uma etiqueta de papel em cada uma: Ecruteak, Fortree, Mauville.',
    fala('Jory', 'Os Faróis vão perguntar. Eu vou dizer que a Guarda levou. O Lund leva a fama, você leva a caixa, e todo mundo fica feliz menos o Kaspar.', 'riso')
  ],
  ef:{dinheiro:-4000, flag:'sv_caixa_tres', itens:{'Caixa da Maré':1},
      rep:{eixo:'ruim', delta:1, motivo:'Comprou da Maré, pela rede, a caixa de Pokémon roubados'},
      npc:{nome:'Jory', opiniao:2, memoria:'Comprou a caixa TRÊS pela rede, por quatro mil.'},
      registrar:'Comprou do Jory, pela rede, a caixa com nove Pokébolas roubadas de gente de fora.'},
  escolhas:[
    {texto:'Ir atrás da Noa, no fim do cais.', vai:'c35_o_fim_do_cais'}
  ]
},

c35_o_jory:{
  texto:[
    'O Jory se põe na frente da caixa TRÊS, com o caderno de entrega embaixo do braço e uma Pokébola na mão.',
    fala('Jory', 'A fábrica fechou e ninguém atravessou o mar pra perguntar como a gente ia comer. Nem a Patrulha, nem a Liga, nem {o Campeão|a Campeã} de Kanto.'),
    fala('Jory', 'Agora atravessou {um|uma}. Pra quê? Pra levar a mochila de uma artesã de Johto de volta pra ela.', 'frio'),
    'Os moleques fazem roda em volta. Ninguém sai.'
  ],
  batalha:{sevii:'jory', mais:-3, tipo:'treinador', fuga:false, treinador:'Jory',
           intro:'Jory joga o caderno de entrega pra um dos moleques e solta a primeira Pokébola.',
           vitoria:'c35_jory_caiu', derrota:'c35_jory_ganhou'}
},
c35_jory_caiu:{
  texto:[
    'O último do Jory cai em cima de uma esteira parada, e a esteira range sozinha por um metro.',
    'A molecada da roda olha pro Jory. O Jory olha pra caixa TRÊS.',
    fala('Jory', 'Leva. A caixa. Nove de gente de fora.', null, 'Ele empurra a caixa com o pé.'),
    fala('Jory', 'A mochila da feira não está aqui. Está com a Noa, no fim do cais, pro bote das duas. A Milotic e a caixa dos ovos já subiram ontem, pros Faróis. O Kaspar escolhe o que fica com ele e o que vai pro homem do armazém.', 'baixo'),
    fala('Jory', 'Eu nunca vi o homem do armazém. Ninguém da Maré viu. A gente só vê o barco sem luz.')
  ],
  ef:{flag:['sv_jory_vencido', 'sv_caixa_tres', 'sv_sabe_dos_farois'], itens:{'Caixa da Maré':1},
      rep:{eixo:'bom', delta:1, motivo:'Ganhou do Jory na fábrica fechada e tirou da Maré a caixa de Pokémon roubados'},
      registrar:'Ganhou do Jory na fábrica. Ficou com a caixa de nove Pokébolas roubadas. A Milotic e os ovos já subiram pros Faróis; acima dos Faróis tem um homem do armazém que a Maré nunca viu.'},
  escolhas:[
    {texto:'Levar o Jory pro Sargento Lund.', vai:'c35_jory_preso'},
    {texto:'"Some da ilha uns dias. E larga a Maré."', vai:'c35_jory_solto'},
    {texto:'"Quanto o Kaspar paga por Pokébola?"', vai:'c35_jory_conta'}
  ]
},
c35_jory_preso:{
  texto:[
    'Ele não resiste. Desce o morro na sua frente, de mão no bolso, e a molecada vai atrás em silêncio até a porta da Guarda.',
    fala('Sargento Lund', 'Jory.', null, 'O sargento levanta da mesa.'),
    fala('Sargento Lund', 'Eu te dei o primeiro emprego, lembra? Entregar a correspondência da Guarda. Você tinha onze anos.', 'baixo'),
    'O Jory entra na cela sozinho, sem ninguém mandar, e senta no catre de costas pra porta.'
  ],
  ef:{flag:'sv_jory_preso', npc:{nome:'Jory', opiniao:-3, memoria:'Você levou ele pra cela da Guarda das Ilhas.'},
      rep:{eixo:'bom', delta:1, motivo:'Entregou à Guarda das Ilhas o chefe da Maré'},
      registrar:'Entregou o Jory ao Sargento Lund. Ele entrou na cela sozinho.'},
  escolhas:[
    {texto:'Descer pro fim do cais, atrás da Noa.', vai:'c35_o_fim_do_cais'}
  ]
},
c35_jory_solto:{
  texto:[
    fala('Jory', 'Largar a Maré.', 'riso', 'Ele ri, mas não muito.'),
    fala('Jory', 'A Maré não é clube. É o que sobrou. Se eu largar, eles ficam com o Kaspar direto, sem ninguém no meio.'),
    'Mesmo assim ele pega o caderno de entrega, olha, e joga no tanque de salmoura velho no canto do galpão. O caderno afunda devagar.',
    fala('Jory', 'Uns dias. Só uns dias.')
  ],
  ef:{flag:'sv_jory_solto', npc:{nome:'Jory', opiniao:2, memoria:'Você deixou ele ir e mandou largar a Maré. Ele jogou o caderno de entrega na salmoura.'},
      registrar:'Deixou o Jory ir. Ele jogou o caderno de entrega da Maré no tanque de salmoura.'},
  escolhas:[
    {texto:'Descer pro fim do cais, atrás da Noa.', vai:'c35_o_fim_do_cais'}
  ]
},
c35_jory_conta:{
  texto:[
    fala('Jory', 'Trinta. Trinta por bola, qualquer bola.', null, 'Ele fala sem raiva nenhuma, de quem já fez essa conta muitas vezes.'),
    fala('Jory', 'Uma Milotic criada vale quarenta mil em Kanto, diz o Kaspar. Ele ri quando diz. A gente ganhou trinta por ela.'),
    'A molecada da roda escuta isso pela primeira vez. Dá pra ver na cara de cada um.'
  ],
  ef:{flag:'sv_mare_soube_a_conta', npc:{nome:'Jory', opiniao:1, memoria:'Você fez ele dizer em voz alta quanto a Maré ganha por Pokébola.'},
      registrar:'A Maré ganha trinta por Pokébola. Uma Milotic criada vale quarenta mil em Kanto, segundo o Kaspar.'},
  escolhas:[
    {texto:'Levar o Jory pro Sargento Lund.', vai:'c35_jory_preso'},
    {texto:'"Some da ilha uns dias. E larga a Maré."', vai:'c35_jory_solto'}
  ]
},
c35_jory_ganhou:{
  texto:[
    'O seu último cai em cima da esteira. A molecada não grita, não comemora: já viu isso antes, com gente maior.',
    fala('Jory', 'Volta pra Kanto. Aqui o cais é nosso.', 'frio'),
    'Dois moleques levam a caixa TRÊS pela porta lateral. O Jory vai atrás, sem pressa.',
    'Na porta, uma menina mais nova fica pra trás e fala baixo, sem olhar pra você:',
    fala('uma garota da Maré', 'A mochila da feira está com a Noa. No fim do cais. Às duas.', 'baixo')
  ],
  ef:{registrar:'Perdeu pro Jory na fábrica fechada. A Maré levou a caixa. Uma menina contou que a mochila da Etta está com a Noa, no fim do cais, às duas.'},
  escolhas:[
    {texto:'Esperar a noite no fim do cais.', vai:'c35_o_fim_do_cais'}
  ]
},

c35_o_fim_do_cais:{
  texto:[
    'De madrugada o cais da Ilha Um é outro lugar: os barcos batem um no outro devagar, a água bate na pedra, e a única luz é a vermelha da torre de rádio, lá em cima, piscando.',
    'No último poste de amarrar barco, sentada, com o tênis sem cadarço balançando por cima da água, está a Noa. A mochila da Etta no colo. O Murkrow no ombro.',
    'Ela te vê chegando e não se mexe.',
    d => d.flags.sv_viu_a_noa
      ? fala('Noa', 'Você é {o|a} do cais. Você corre mal.')
      : fala('Noa', 'Você é {o|a} de Kanto. O pessoal do cais disse.'),
    fala('Noa', 'O bote chega em dez minutos. Se você quer a mochila, tem dez minutos.')
  ],
  ef:{executar:() => { Relogio.ate(2); }},
  escolhas:[
    {texto:'"Me dá a mochila, Noa."', vai:'c35_noa_luta', cond:d => !!d.flags.sv_sabe_da_noa},
    {texto:'"Me dá a mochila."', vai:'c35_noa_luta', cond:d => !d.flags.sv_sabe_da_noa},
    {texto:'"O barco do seu pai está na rampa do farol. Eu sei."', vai:'c35_noa_conversa', cond:d => !!d.flags.sv_sabe_do_barco_da_noa},
    {texto:'Mostrar a pena de Murkrow da janela da pousada.', vai:'c35_noa_pena', cond:d => !!d.flags.sv_pista_pena}
  ]
},
c35_noa_pena:{
  texto:[
    'Você estende a pena preta, de reflexo azul, na palma da mão.',
    'O Murkrow no ombro dela olha a pena. Ela olha o Murkrow.',
    fala('Noa', 'Ele não sabe ficar quieto em peitoril.', 'baixo'),
    fala('Noa', 'A caixa dos ovos já subiu. Ontem. Eu levei até o bote, como a mochila hoje. Eu não sabia que era ovo. Achei que era só uma caixa.'),
    'Ela fica olhando a água embaixo do poste, e embaixo da água uma barbatana escura passa devagar.'
  ],
  ef:{flag:'sv_noa_confessou', npc:{nome:'Noa', opiniao:1, memoria:'Você mostrou a pena do Murkrow, da janela da pousada.'}},
  escolhas:[
    {texto:'"Me dá a mochila, Noa."', vai:'c35_noa_luta'},
    {texto:'"O barco do seu pai está na rampa do farol. Eu sei."', vai:'c35_noa_conversa', cond:d => !!d.flags.sv_sabe_do_barco_da_noa}
  ]
},
c35_noa_conversa:{
  texto:[
    'Ela para de balançar o pé.',
    fala('Noa', 'Todo mundo sabe. Todo mundo da ilha passa na ponte e vê o barco na rampa, com o nome do meu pai descascando. Ninguém faz nada. Por que você ia fazer?'),
    'O motor do bote aparece no escuro, longe, baixo.',
    fala('Noa', 'Se eu entregar essa mochila, o Kaspar tira mais um pedaço da dívida. Se eu não entregar, ele põe mais um pedaço. Faz a conta, {Campeão|Campeã}.')
  ],
  escolhas:[
    {texto:'"Me dá a mochila, e eu vou buscar o barco do seu pai na Ilha Três."', vai:'c35_noa_convencer'},
    {texto:'"Me dá a mochila, Noa."', vai:'c35_noa_luta'}
  ]
},
c35_noa_convencer:{
  texto:['Ela te olha nos olhos. Quem conhece a Noa sabe: olho no olho é quando ela acha que você está mentindo.'],
  teste:{status:'carisma', dificuldade:8, nomeStatus:'Carisma', critico:'c35_noa_deu', sucesso:'c35_noa_deu', parcial:'c35_noa_luta', falha:'c35_noa_luta'}
},
c35_noa_deu:{
  texto:[
    'O bote chega. O motor diminui. Um moleque de dentro estende a mão pra mochila.',
    'A Noa olha a mão do moleque, olha você, e olha pro chão.',
    'E joga a mochila pra você, não pro bote.',
    fala('Noa', 'Vai. Fala pro Kaspar que caiu na água.', null, 'Ela diz isso pro moleque, olhando pro chão, que é quando a Noa fala a verdade.'),
    'O bote vai embora vazio. A Noa fica no poste.'
  ],
  ef:{flag:['sv_rec_etta', 'sv_noa_deu_a_mochila'], npc:{nome:'Noa', opiniao:3, memoria:'Jogou a mochila da Etta pra você em vez de pro bote, porque você prometeu buscar o barco do pai dela.'},
      rep:{eixo:'bom', delta:1, motivo:'Convenceu a Noa a devolver a mochila da Etta sem briga'},
      registrar:'A Noa jogou a mochila da Etta pra você em vez de pro bote dos Faróis. Você prometeu buscar o barco do pai dela.'},
  escolhas:[
    {texto:'Sentar do lado dela no poste.', vai:'c35_a_escolha'}
  ]
},
c35_noa_luta:{
  texto:[
    'Ela levanta no poste, em pé, equilibrada em cima da madeira como quem nasceu ali.',
    fala('Noa', 'Então pega.', 'frio'),
    'O Murkrow sai do ombro dela. Embaixo do poste, na água, o Sharpedo sobe com a boca aberta.'
  ],
  batalha:{sevii:'noa', mais:-2, tipo:'treinador', fuga:false, treinador:'Noa',
           intro:'A Noa salta do poste pro cais sem largar a mochila.',
           vitoria:'c35_noa_perdeu', derrota:'c35_noa_ganhou'}
},
c35_noa_perdeu:{
  texto:[
    'O último dela cai na beira do cais. O Sharpedo afunda devagar, contrariado, e volta só com a barbatana de fora.',
    'Ela fica parada com a mochila na mão. O bote chega, diminui o motor, e o moleque de dentro estende a mão.',
    'Ela não entrega. Ela também não te dá. Fica parada no meio, com a mochila pendurada, e o bote espera.',
    fala('Noa', 'Vai. Fala pro Kaspar que a de Kanto pegou.', 'frio', 'Ela diz isso pro bote, sem tirar os olhos de você.'),
    'O bote vai embora vazio. Ela estende a mochila pra você com o braço esticado, sem chegar perto.'
  ],
  ef:{flag:'sv_rec_etta', npc:{nome:'Noa', opiniao:1, memoria:'Perdeu pra você no fim do cais, de madrugada, e entregou a mochila da Etta.'},
      rep:{eixo:'bom', delta:1, motivo:'Ganhou da Noa no fim do cais e recuperou a mochila da Etta'},
      registrar:'Ganhou da Noa no fim do cais, de madrugada. Ela entregou a mochila da Etta e mandou o bote embora vazio.'},
  escolhas:[
    {texto:'Pegar a mochila.', vai:'c35_a_escolha'}
  ]
},
c35_noa_ganhou:{
  texto:[
    'O seu último cai, e a Noa fica parada um segundo, sem acreditar.',
    fala('Noa', '…eu ganhei.', null, 'Baixo, primeiro pra ela.'),
    'O bote chega. Ela entrega a mochila pro moleque de dentro, devagar, e o bote vai embora pro norte, sem luz.',
    'Ela fica no poste olhando o bote sumir, e quando fala é sem virar.',
    fala('Noa', 'Eu não te devo nada. Mas a mochila não fica na Três. O Kaspar não gosta de Pokébola de Apricorn, diz que é coisa de criança. Ele manda tudo que não quer pro armazém.', 'baixo'),
    'Ela pula do poste pro barco do lado, do barco pro próximo, e some entre os cascos.'
  ],
  ef:{flag:['sv_noa_rival', 'sv_mochila_subiu'], npc:{nome:'Noa', opiniao:0, memoria:'Ganhou de você no fim do cais e mandou a mochila da Etta pros Faróis.'},
      registrar:'Perdeu pra Noa no fim do cais. A mochila da Etta subiu no bote pros Faróis. Ela disse que o que o Kaspar não quer vai pro armazém.'},
  escolhas:[
    {texto:'Voltar pro cais, de mão vazia.', vai:'c35_o_fim'}
  ]
},

c35_a_escolha:{
  texto:[
    'O cais fica em silêncio. A água bate na pedra. A luz vermelha da torre pisca lá em cima.',
    'A Noa senta de novo no poste, com o Murkrow de volta no ombro, e olha a água.',
    fala('Noa', 'E agora, {Campeão|Campeã}? Agora você me leva pro Lund?')
  ],
  escolhas:[
    {texto:'Levar a Noa pro Sargento Lund.', vai:'c35_noa_entregue'},
    {texto:'"Quanto o seu pai deve pros Faróis?"', vai:'c35_noa_ajudada'},
    {texto:'"Vai pra casa, Noa."', vai:'c35_noa_solta'}
  ]
},
c35_noa_entregue:{
  texto:[
    'Ela não resiste. Sobe o morro na sua frente, de mão no bolso da jaqueta grande demais, e o Murkrow vai voando de poste em poste atrás.',
    fala('Sargento Lund', 'Noa.', null, 'Ele levanta da mesa de pijama e farda, metade de cada.'),
    d => d.flags.sv_jory_preso ? 'Na cela, o Jory levanta a cabeça do catre. Ela entra e senta do outro lado, sem olhar pra ele.' : 'Ela entra na cela vazia e senta no catre.',
    fala('Sargento Lund', 'Ela tem dezesseis anos. De manhã eu solto. A ilha precisa dela mais do que a cela.', 'baixo', 'Ele diz isso pra você, não pra ela.'),
    'Pelas grades, a Noa olha pra você do jeito que olhou no cais, no primeiro dia: sem medo nenhum.'
  ],
  ef:{flag:['sv_noa_rival', 'sv_noa_entregue'], npc:{nome:'Noa', opiniao:-3, memoria:'Você entregou ela pro Sargento Lund, de madrugada.'},
      rep:{eixo:'bom', delta:1, motivo:'Entregou à Guarda das Ilhas a menina que levou a Milotic'},
      registrar:'Entregou a Noa ao Sargento Lund. Ele disse que de manhã solta: ela tem dezesseis anos.'},
  escolhas:[
    {texto:'Descer o morro com a mochila.', vai:'c35_o_fim'}
  ]
},
c35_noa_ajudada:{
  texto:[
    'Ela ri, curto, sem graça nenhuma.',
    fala('Noa', 'Doze mil, mais o que o Kaspar inventa todo mês. Ninguém paga. É feito pra ninguém pagar.'),
    fala('Noa', 'O caderno do Kaspar fica no farol. Quem deve está no caderno. Quem paga também está, e o número não desce.'),
    'Ela olha pra você de novo, e dessa vez olha pro chão no meio da frase, que é quando a Noa fala a verdade.',
    fala('Noa', 'Se você for no farol… o barco do meu pai se chama Dente, igual ao meu Sharpedo. Fui eu que dei o nome dos dois.', 'baixo')
  ],
  ef:{flag:['sv_noa_rival', 'sv_noa_ajudou', 'sv_sabe_do_caderno'], npc:{nome:'Noa', opiniao:4, memoria:'Você perguntou da dívida do pai dela em vez de levar ela pro Lund.'},
      rep:{eixo:'bom', delta:1, motivo:'Não entregou a Noa e perguntou da dívida que prende ela à gangue'},
      registrar:'Não entregou a Noa. Ela contou do caderno de dívidas do Kaspar, no farol, e do barco do pai, que se chama Dente.'},
  escolhas:[
    {texto:'"Larga a Maré. Se inscreve no torneio."', vai:'c35_noa_torneio'},
    {texto:'Descer o cais com a mochila.', vai:'c35_o_fim'}
  ]
},
c35_noa_torneio:{
  texto:[
    fala('Noa', 'Torneio.', null, 'Ela repete a palavra como quem prova uma fruta que nunca comeu.'),
    fala('Noa', 'O prêmio paga a dívida duas vezes. Eu já sonhei com isso. Mas quem trabalha pra gangue não se inscreve: o velho Holm não deixa.'),
    'Ela levanta do poste.',
    fala('Noa', 'Se a Maré acabar, eu não trabalho pra ninguém. Aí eu me inscrevo. E aí eu te ganho na frente de todo mundo.', 'riso')
  ],
  ef:{flag:'sv_noa_quer_torneio'},
  escolhas:[
    {texto:'Descer o cais com a mochila.', vai:'c35_o_fim'}
  ]
},
c35_noa_solta:{
  texto:[
    fala('Noa', 'Pra casa.', null, 'Ela repete como se a palavra tivesse outro sentido pra ela.'),
    fala('Noa', 'Eu não vou te agradecer.'),
    'Ela pula do poste pro barco do lado, do barco pro próximo, e some entre os cascos. O Murkrow fica mais um segundo no poste, olhando você, e vai atrás.'
  ],
  ef:{flag:'sv_noa_rival', npc:{nome:'Noa', opiniao:1, memoria:'Você mandou ela pra casa em vez de entregar pro Lund.'},
      registrar:'Mandou a Noa pra casa. Ela disse que não ia agradecer.'},
  escolhas:[
    {texto:'Descer o cais com a mochila.', vai:'c35_o_fim'}
  ]
},

c35_o_fim:{
  texto:[
    d => d.flags.sv_rec_etta
      ? 'De manhã você pega a primeira balsa pra Ilha Dois, com a mochila da Etta no colo, sem abrir.'
      : 'De manhã você pega a primeira balsa pra Ilha Dois, de mão vazia, pra contar pra Etta.',
    d => d.flags.sv_rec_etta
      ? 'Ela está na barraca de toalha vazia. Vê a mochila de longe e levanta tão rápido que a cadeira cai. Abre, conta em voz baixa, bola por bola, na ordem: setenta e nove, oitenta, oitenta e um… oitenta e quatro.'
      : 'Ela está na barraca de toalha vazia. Você conta. Ela escuta sem piscar, e no fim cruza os braços.',
    d => d.flags.sv_rec_etta
      ? fala('Etta', 'Oitenta e quatro.', null, 'E aí ela chora, na frente de turista e de todo mundo, abraçada na mochila.')
      : fala('Etta', 'Tá. Então o Heracross está na Ilha Três. Então eu vou na Ilha Três.', 'frio'),
    d => d.flags.sv_rec_etta ? fala('Etta', 'Toma. É Apricorn azul. Fecha igual uma Great Ball, e não fala "comum" perto dela.', null, 'Ela tira uma bola azul da mochila e põe na sua mão.') : '',
    d => d.flags.sv_caixa_tres ? 'A caixa da Maré, com as nove Pokébolas de gente de fora, você deixa na Guarda: o Sargento Lund passa a manhã inteira devolvendo uma por uma, de etiqueta na mão.' : '',
    'Do cais da Ilha Dois dá pra ver a Ilha Três, ao norte, e na ponta dela um farol de pedra que não acende faz anos.',
    'O barqueiro da balsa, quando você pergunta, diz que pra lá ele não vai.'
  ],
  ef:{executar:d => {
        if (d.flags.sv_rec_etta){
          Estado.darItem('Great Ball', 1);
          Historia.aplicar({npc:{nome:'Etta', opiniao:4, memoria:'Trouxe de volta a mochila com as oitenta e quatro bolas, o Heracross e o Ninjask.'}});
          Estado.registrar('Devolveu a mochila da Etta, com as oitenta e quatro Pokébolas de Apricorn. Ela deu uma Apricorn azul.');
        }
        if (d.flags.sv_caixa_tres && (d.itens['Caixa da Maré'] || 0) > 0) Estado.usarItem('Caixa da Maré');
        if (d.flags.sv_caixa_tres) Estado.mudarRep('bom', 1, 'Devolveu à Guarda das Ilhas a caixa da Maré, com nove Pokémon de gente de fora', {rep:{notorio:true}});
      }},
  fim:true, sai:'ilha_dois',
  resumo:'A Maré: a molecada da fábrica fechada pega, e o que pega sobe de bote pra Ilha Três, pros Faróis. No fim do cais, de madrugada, a Noa.'
}

}
});
