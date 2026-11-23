/* ============================================================
   AS ILHAS SEVII — o lugar
   Sete ilhas ao sul de Kanto, pra onde o S.S. Anne leva quem tem a
   passagem que o Blue entrega depois do fim (sevii.js). Cada ilha tem
   a vila dela, com Centro, e uma ou duas áreas de mato, praia, gelo
   ou pedra. Tudo aqui é `regiao:'sevii'` e oculto: o mapa de Kanto não
   mostra, e o das ilhas é outra página (Exploracao.mapa).

   O mato daqui é Kanto e Johto misturados: foi pedido assim — os
   Pokémon da Pokédex Nacional ficam nas ilhas, não nas cidades de
   Kanto (o mato de Kanto é só de Kanto, habitats.js). Cada espécie de
   Johto que anda solta tem uma tabela aqui ou chega por evolução ou
   pela creche (chk-obtencao confere).

   Cenário: as vilas têm o mapa delas no FireRed/LeafGreen (a ilha só
   existe lá), recortado por ferramentas/recortar-cidades.py; as áreas
   usam o cenário de batalha do ambiente.
   ============================================================ */
const LOCAIS_SEVII = {

/* ─── Ilha Um: o porto, as termas, o monte ─── */
ilha_um:{
  nome:'Ilha Um', tipo:'cidade', ambiente:'agua', nivel:60, porte:'ilha', regiao:'sevii', oculto:true,
  conexoes:['vermilion', 'estrada_brasa', 'ilha_dois'],
  desc:[
    'Ilha Um é um cais comprido, uma rua de casa baixa subindo o morro e, no alto, a torre de rádio que liga as ilhas ao continente.',
    'O cheiro é de sal e de enxofre: as termas ficam do outro lado do morro, e o vento traz.'
  ],
  lugares:['centro', 'loja', 'porto']
},
estrada_brasa:{
  nome:'Estrada da Brasa', tipo:'rota', ambiente:'montanha', nivel:61, regiao:'sevii', oculto:true,
  conexoes:['ilha_um', 'monte_brasa'],
  desc:[
    'Uma trilha de pedra preta entre o mar e o morro, com fumaça saindo das frestas e poças de água quente onde ninguém devia pôr a mão.',
    'No meio dela tem uma casa de banho de madeira, com a placa das termas pintada à mão.'
  ]
},
monte_brasa:{
  nome:'Monte Brasa', tipo:'especial', ambiente:'vulcao', nivel:64, perigosa:true, regiao:'sevii', oculto:true,
  conexoes:['estrada_brasa'],
  desc:[
    'O vulcão da Ilha Um não dorme: cochila. A pedra é morna até no topo, e de noite as rachaduras brilham.',
    'Quem sobe vê as sete ilhas de uma vez, quando não tem fumaça.'
  ]
},

/* ─── Ilha Dois: a feira e o cabo ─── */
ilha_dois:{
  nome:'Ilha Dois', tipo:'cidade', ambiente:'campo', nivel:61, porte:'ilha', regiao:'sevii', oculto:true,
  conexoes:['ilha_um', 'cabo', 'ilha_tres'],
  desc:[
    'Ilha Dois vive da feira: barraca de lona colorida de um lado a outro da praça, e gente que vem das outras ilhas só pra vender e comprar.',
    'Atrás da praça o capim sobe até um cabo de pedra que acaba no mar sem aviso.'
  ],
  lugares:['centro', 'loja']
},
cabo:{
  nome:'Cabo da Ponta', tipo:'rota', ambiente:'campo', nivel:62, regiao:'sevii', oculto:true,
  conexoes:['ilha_dois'],
  desc:[
    'O capim do Cabo da Ponta é deitado pelo vento sempre pro mesmo lado, como cabelo penteado.',
    'Na ponta tem uma casa só, de uma velha que cria Mareep, e o resto é céu.'
  ]
},

/* ─── Ilha Três: a vila dos Faróis, a ponte e a floresta ─── */
ilha_tres:{
  nome:'Ilha Três', tipo:'cidade', ambiente:'cidade', nivel:62, porte:'ilha', regiao:'sevii', oculto:true,
  conexoes:['ilha_dois', 'ponte', 'ilha_quatro'],
  desc:[
    'Ilha Três tem uma rua de terra batida, uma loja, um Centro e moto demais pra uma ilha desse tamanho.',
    'As janelas fecham quando o ronco passa. Ninguém fala o porquê na frente de quem é de fora.'
  ],
  lugares:['centro', 'loja']
},
ponte:{
  nome:'Ponte do Laço', tipo:'rota', ambiente:'agua', nivel:63, regiao:'sevii', oculto:true,
  conexoes:['ilha_tres', 'floresta_frutas'],
  desc:[
    'Uma ponte comprida de madeira, de ilhota em ilhota, até a floresta do outro lado. Range com o vento e não cai faz cem anos.',
    'Embaixo dela a água é rasa e clara, e dá pra ver o que nada.'
  ]
},
floresta_frutas:{
  nome:'Floresta das Frutas', tipo:'especial', ambiente:'floresta', nivel:64, perigosa:true, regiao:'sevii', oculto:true,
  conexoes:['ponte'],
  desc:[
    'A floresta do fim da ponte é baixa e cheia de árvore de fruta que ninguém plantou.',
    'O chão é doce de tanta fruta caída, e os Pokémon daqui comem sem olhar pra você.'
  ]
},

/* ─── Ilha Quatro: o gelo ─── */
ilha_quatro:{
  nome:'Ilha Quatro', tipo:'cidade', ambiente:'agua', nivel:63, porte:'ilha', regiao:'sevii', oculto:true,
  conexoes:['ilha_tres', 'gruta_gelada', 'ilha_cinco'],
  desc:[
    'Ilha Quatro é fria fora de hora: a corrente que passa por ela vem do sul gelado, e o lago no meio da vila congela em pleno verão.',
    'As casas têm parede grossa e janela pequena, e todo mundo usa luva.'
  ],
  lugares:['centro', 'loja']
},
gruta_gelada:{
  nome:'Gruta Gelada', tipo:'especial', ambiente:'caverna', nivel:65, perigosa:true, regiao:'sevii', oculto:true,
  conexoes:['ilha_quatro'],
  desc:[
    'Uma caverna de gelo azul, com uma cachoeira congelada no meio que estala de hora em hora.',
    'O chão escorrega. O teto pinga. E lá no fundo alguma coisa canta, às vezes.'
  ]
},

/* ─── Ilha Cinco: a campina e o armazém ─── */
ilha_cinco:{
  nome:'Ilha Cinco', tipo:'cidade', ambiente:'campo', nivel:64, porte:'ilha', regiao:'sevii', oculto:true,
  conexoes:['ilha_quatro', 'campina', 'ilha_seis'],
  desc:[
    'Ilha Cinco é a mais verde das sete, com um relógio de torre na praça que adianta quatro minutos desde sempre.',
    'Do outro lado da campina tem um armazém velho de conserva, que fechou com a fábrica e não abriu mais.'
  ],
  lugares:['centro']
},
campina:{
  nome:'Campina da Ilha Cinco', tipo:'rota', ambiente:'campo', nivel:65, regiao:'sevii', oculto:true,
  conexoes:['ilha_cinco'],
  desc:[
    'Capim alto até a cintura, flor amarela no meio, e o armazém de telhado de zinco lá no fundo, com o cadeado novo numa porta velha.',
    'De noite a campina canta de bicho miúdo — de Pokémon miúdo, quem é daqui corrige.'
  ]
},

/* ─── Ilha Seis: as ruínas ─── */
ilha_seis:{
  nome:'Ilha Seis', tipo:'cidade', ambiente:'campo', nivel:65, porte:'ilha', regiao:'sevii', oculto:true,
  conexoes:['ilha_cinco', 'vale_ruinas', 'ilha_sete'],
  desc:[
    'Ilha Seis é cercada de mata e de pedra velha: casa nova encostada em muro que ninguém sabe quem levantou.',
    'Tem mais historiador que pescador, e os dois se dão mal.'
  ],
  lugares:['centro', 'loja']
},
vale_ruinas:{
  nome:'Vale das Ruínas', tipo:'especial', ambiente:'ruina', nivel:66, perigosa:true, regiao:'sevii', oculto:true,
  conexoes:['ilha_seis'],
  desc:[
    'Um vale fundo, cheio de pedra cortada em ângulo reto e coberta de musgo. Alguém morou aqui. Faz tempo.',
    'O eco devolve a sua voz um pouco mais grave do que saiu.'
  ]
},

/* ─── Ilha Sete: a arena ─── */
ilha_sete:{
  nome:'Ilha Sete', tipo:'cidade', ambiente:'montanha', nivel:66, porte:'ilha', regiao:'sevii', oculto:true,
  conexoes:['ilha_seis', 'canion'],
  desc:[
    'Ilha Sete é pedra, vento e a arena: um anel de arquibancada de pedra no alto do morro, construído por uma família que ganhava torneio.',
    'O resto da vila existe pra servir a arena: pousada, loja, Centro e um bar que abre só em semana de torneio.'
  ],
  lugares:['centro', 'loja', 'arena']
},
canion:{
  nome:'Cânion Sevault', tipo:'rota', ambiente:'montanha', nivel:68, perigosa:true, regiao:'sevii', oculto:true,
  conexoes:['ilha_sete'],
  desc:[
    'Um rasgo na ilha, de paredão vermelho e fundo seco, onde o vento assobia em três notas.',
    'Lá no fundo, as rochas têm marca de garra mais funda que a sua mão.'
  ]
}
};
Object.assign(LOCAIS, LOCAIS_SEVII);
/* a travessia: o cais de Vermilion liga na Ilha Um (o S.S. Anne na ida,
   a balsa depois). A passagem é que decide se dá (Sevii.trava) */
if (LOCAIS.vermilion && !LOCAIS.vermilion.conexoes.includes('ilha_um')) LOCAIS.vermilion.conexoes.push('ilha_um');

function ehSevii(id){ const L = LOCAIS[id]; return !!(L && L.regiao === 'sevii'); }

/* ── o mato das ilhas: Kanto e Johto misturados ─────────────── */
Object.assign(ENCONTROS, {
  ilha_um:         [[183,18],[194,14],[223,14],[170,10],[211,8],[222,6],[226,4],[60,10],[72,10],[129,8]],
  estrada_brasa:   [[77,14],[218,14],[66,12],[74,12],[21,10],[228,10],[185,8],[231,10],[155,3]],
  monte_brasa:     [[218,22],[219,8],[126,8],[228,14],[229,6],[74,14],[75,10],[58,9],[155,4]],
  ilha_dois:       [[161,18],[163,14],[165,14],[187,14],[16,10],[19,10],[234,6],[190,6],[241,4]],
  cabo:            [[179,18],[180,8],[177,14],[206,10],[203,10],[83,6],[21,10],[235,5],[158,3]],
  ilha_tres:       [[209,14],[19,18],[20,10],[216,10],[52,10],[163,10],[198,12],[88,8]],
  ponte:           [[194,14],[195,8],[183,14],[184,6],[60,12],[61,6],[223,10],[118,10],[211,8],[226,6]],
  floresta_frutas: [[191,14],[192,5],[204,14],[167,12],[193,10],[102,8],[43,10],[46,8],[213,8],[214,6],[152,3]],
  ilha_quatro:     [[220,14],[221,6],[225,10],[86,12],[87,5],[90,10],[215,10],[124,5],[131,2]],
  gruta_gelada:    [[215,14],[220,14],[221,8],[225,8],[41,14],[42,8],[86,8],[87,4],[124,6],[131,2]],
  ilha_cinco:      [[16,10],[17,6],[19,10],[52,10],[53,5],[163,10],[164,6],[177,10],[178,5],[200,6]],
  campina:         [[161,10],[162,8],[203,12],[234,10],[209,10],[210,5],[83,5],[17,8],[18,4],[231,8]],
  ilha_seis:       [[227,8],[207,10],[193,8],[204,8],[165,10],[166,6],[167,8],[168,4],[22,8],[246,3]],
  vale_ruinas:     [[202,14],[200,12],[92,10],[93,5],[177,10],[178,6],[206,10],[235,6],[63,8],[246,4],[247,2]],
  ilha_sete:       [[21,12],[22,8],[56,10],[57,6],[207,10],[227,6],[231,10],[232,5],[66,8],[67,4]],
  canion:          [[246,8],[247,5],[227,10],[207,10],[104,10],[105,6],[111,8],[112,4],[231,8],[232,6],[95,6],[74,10]]
});

/* ── o cenário: o mapa de cada vila e o fundo de cada área ─── */
Object.assign(CENARIO_POR_LOCAL, {
  ilha_um:'ilha_um.png', estrada_brasa:'montanha.png', monte_brasa:'vulcao.png',
  ilha_dois:'ilha_dois.png', cabo:'prado.png',
  ilha_tres:'ilha_tres.png', ponte:'agua.png', floresta_frutas:'floresta.png',
  ilha_quatro:'ilha_quatro.png', gruta_gelada:'gelo.png',
  ilha_cinco:'ilha_cinco.png', campina:'campo.png',
  ilha_seis:'ilha_seis.png', vale_ruinas:'ruina.png',
  ilha_sete:'ilha_sete.png', canion:'montanha.png'
});
/* onde a placa desce: o Centro, as casas e o cais de cada vila */
Object.assign(FOCO_DO_CENARIO, {
  'ilha_um.png':'45%', 'ilha_dois.png':'30%', 'ilha_tres.png':'50%', 'ilha_quatro.png':'60%',
  'ilha_cinco.png':'40%', 'ilha_seis.png':'30%', 'ilha_sete.png':'35%'
});

/* ── as lojas das ilhas ─────────────────────────────────── */
Object.assign(LOJAS, {
  ilha_um: {
    nome:'Mercearia do Cais',
    ar:'Corda, óleo, Poké Ball e pão no mesmo balcão. O dono pesa tudo na mesma balança, até a Poké Ball.',
    mult:1.1,
    itens:['Poké Ball','Great Ball','Ultra Ball','Potion','Super Potion','Hyper Potion','Full Heal','Revive','Repelente','Ração','Pilha','Corda']
  },
  ilha_dois: {
    nome:'A feira de Ilha Dois',
    ar:'Vinte barracas e um dono só pra cada coisa. A de pedra é de uma senhora que não baixa o preço e não explica de onde vem a pedra.',
    mult:1.0,
    itens:['Great Ball','Ultra Ball','Super Potion','Hyper Potion','Full Heal','Revive','Pedra do Fogo','Pedra do Trovão','Pedra da Folha','Moon Stone','Ração','Bandagem']
  },
  ilha_tres: {
    nome:'Loja da Ilha Três',
    ar:'A prateleira da frente está cheia. A de trás está vazia, e o dono não fala por quê.',
    mult:1.3,
    itens:['Poké Ball','Great Ball','Potion','Super Potion','Antidote','Ração']
  },
  ilha_quatro: {
    nome:'Armazém do Gelo',
    ar:'Vende luva, cachecol, Poké Ball e remédio pra queimadura de frio, que a balconista jura que existe.',
    mult:1.1,
    itens:['Great Ball','Ultra Ball','Super Potion','Hyper Potion','Full Heal','Revive','Ração','Pilha','Lanterna']
  },
  ilha_seis: {
    nome:'Loja da Ilha Seis',
    ar:'Metade é loja de treinador, metade é sebo de livro de história das ilhas. O dono acha a segunda metade mais importante.',
    mult:1.0,
    itens:['Ultra Ball','Hyper Potion','Full Heal','Revive','Ração','Caderno de campo']
  },
  ilha_sete: {
    nome:'Loja da Arena',
    ar:'A prateleira curta de quem vende pra quem vai lutar: nada de enfeite, tudo de remédio.',
    mult:1.0,
    itens:['Ultra Ball','Full Restore','Max Potion','Hyper Potion','Full Heal','Revive','Ração']
  }
});

/* ── o que se descobre andando ──────────────────────────── */
Object.assign(DESCOBERTAS, {
  ilha_um:[
    {chave:'s1_torre', texto:['A torre de rádio do alto do morro tem uma porta de ferro e um homem de macacão fumando cachimbo na frente. Ele diz que é dali que o PokéNav das ilhas pega sinal do continente.']},
    {chave:'loja_ilha_um', texto:['A mercearia do cais abre às cinco e vende de tudo um pouco no mesmo balcão: corda, pão e Poké Ball.'], descobre:'loja_ilha_um'},
    {chave:'s1_fabrica', texto:['No fim do cais tem a fábrica de conserva, de portão acorrentado e a placa caída. Pelas janelas quebradas dá pra ver as esteiras paradas.']}
  ],
  ilha_dois:[
    {chave:'loja_ilha_dois', texto:['A feira tem uma barraca só de pedra de evolução, de uma senhora de chapéu de palha que não sorri pra ninguém.'], descobre:'loja_ilha_dois'},
    {chave:'s2_mansao', texto:['Tem uma casa grande no alto da praça, de muro branco, com um velho na varanda que acena pra todo mundo que passa, todo mundo mesmo.']}
  ],
  ilha_tres:[
    {chave:'loja_ilha_tres', texto:['A loja da Ilha Três tem a prateleira de trás vazia. O dono fecha a cortina quando você olha muito.'], descobre:'loja_ilha_tres'},
    {chave:'s3_motos', texto:['Na frente do bar da praça tem seis motos estacionadas em fila, todas com um farol pintado no tanque.']}
  ],
  ilha_quatro:[
    {chave:'loja_ilha_quatro', texto:['O Armazém do Gelo tem um aquecedor no meio da loja e três velhos sentados em volta dele, que não compram nada.'], descobre:'loja_ilha_quatro'}
  ],
  ilha_seis:[
    {chave:'loja_ilha_seis', texto:['A loja da Ilha Seis é metade livro velho. O dono te mostra um mapa das ilhas desenhado à mão antes de te vender qualquer coisa.'], descobre:'loja_ilha_seis'}
  ],
  ilha_sete:[
    {chave:'loja_ilha_sete', texto:['Do lado da arena tem uma loja de prateleira curta: só remédio e Pokébola. Quem vem lutar não precisa de mais nada.'], descobre:'loja_ilha_sete'},
    {chave:'s7_quadro', texto:['Na entrada da arena tem um quadro de madeira com o nome dos campeões pintado a ouro. Dois nomes aparecem duas vezes: Magnus Holm e ninguém mais.']}
  ]
});

/* ── as conversas de cada ilha ──────────────────────────── */
Object.assign(CONVERSAS, {
  ilha_um:[
    [fala('o homem da torre', 'Daqui sai o sinal do PokéNav pras sete ilhas. Se a torre cai, as ilhas ficam surdas.'),
     fala('o homem da torre', 'Já caiu duas vezes. Ninguém morreu. Todo mundo reclamou.', 'riso')],
    ['Um Slowpoke dorme na escada do cais com o rabo dentro d\'água. Ninguém tira ele de lá: dizem que ele estava ali antes da escada.'],
    [fala('a senhora das termas', 'A água da Estrada da Brasa cura dor de costas, dor de cotovelo e dor de cabeça de marido. Só não cura saudade.')],
    {cond:d=>Sevii.fase(d) < 3, texto:[fala('o pescador de boné', 'Desde que a fábrica fechou, o cais virou ponto de moleque. Moleque com fome não é ruim. É moleque com fome.', 'baixo')]}
  ],
  ilha_dois:[
    [fala('o vendedor de lona', 'Aqui tudo tem preço, até a conversa. Essa é de graça porque você não perguntou nada.')],
    ['Um Smeargle pinta a placa de uma barraca com o rabo, e a dona da barraca corrige com um pincel de verdade, sem brigar.'],
    [fala('a menina da barraca de pedra', 'A Pedra do Trovão é de Ilha Seis. Ninguém sabe disso. A minha avó sabe.')]
  ],
  ilha_tres:[
    {cond:d=>Sevii.fase(d) < 4, texto:[fala('a balconista da Ilha Três', 'Fala baixo. Se o ronco passar, a gente entra.', 'baixo')]},
    {cond:d=>Sevii.fase(d) >= 4, texto:[fala('a balconista da Ilha Três', 'Faz uma semana que ninguém fecha janela quando passa moto. É estranho. É bom.')]},
    ['Um Snubbull dorme na porta da padaria com cara de quem está de guarda. Ele está de guarda.'],
    [fala('o velho do banco', 'Essa ilha tinha festa de pipa todo inverno. Hoppip amarrado em linha, o céu cheio. Faz tempo que não tem.')]
  ],
  ilha_quatro:[
    [fala('o menino do trenó', 'O lago congela no verão e derrete no inverno. Meu avô diz que é a ilha que é do contra.')],
    ['Três Swinub fuçam a neve da praça atrás de raiz, um atrás do outro, e o último sempre come o que o primeiro achou.'],
    [fala('a balconista do Armazém', 'Lá na gruta tem um que canta. Não vai atrás. Quem vai atrás volta resfriado e não conta o que viu.')]
  ],
  ilha_cinco:[
    [fala('o relojoeiro', 'O relógio da torre adianta quatro minutos. Eu podia acertar. A ilha inteira já se acostumou a chegar quatro minutos antes.')],
    ['Um Hoothoot dorme no ponteiro das horas do relógio da torre e roda junto com ele, sem acordar.'],
    {cond:d=>Sevii.fase(d) < 5, texto:[fala('a mulher do varal da praça', 'De noite tem barco sem luz encostando lá no armazém. A Guarda sabe. A Guarda é um homem só.', 'baixo')]}
  ],
  ilha_seis:[
    [fala('o historiador', 'As ruínas do vale têm mais de mil anos. As casas da vila têm cento e poucos. Adivinha qual das duas eu estudo.')],
    ['Um Natu encara o horizonte do alto de um muro de pedra, sem piscar, o dia inteiro. Os meninos da vila apostam quando ele vai piscar.'],
    [fala('a pescadora', 'Historiador chega, mede pedra, vai embora. Pescador fica. Quem você acha que sabe mais da ilha?')]
  ],
  ilha_sete:[
    [fala('o rapaz da pousada', 'Em semana de torneio a pousada lota e eu durmo na cozinha. Fora dela, a pousada é minha e eu durmo onde quiser.')],
    ['Na arquibancada de pedra da arena tem nome riscado em tudo que é degrau: de quem assistiu, de quem lutou, de quem só passou.'],
    [fala('a velha da bilheteria', 'O Magnus ganhou duas vezes. Faz cinquenta anos que ele conta como se fosse ontem. E eu escuto como se fosse a primeira vez.')]
  ]
});

/* ── a cena leve de cada ilha ───────────────────────────── */
Object.assign(EVENTOS_CIDADE, {
ilha_um:[
{
  id:'s1_ovo_das_termas', umaVez:true, peso:3,
  titulo:'O ovo das termas',
  texto:[
    'Na beira da fonte quente que escorre pelo cais tem uma senhora de lenço com uma cesta de ovo cozido na água da termas.',
    'Do lado dela, um Slugma dorme encostado na pedra, e é por causa dele que a água não esfria nem de madrugada.',
    fala('a senhora das termas', 'Três minutos na água do Slugma. Nem um a mais. Quem cozinha quatro come borracha.')
  ],
  escolhas:[
    {texto:'Comprar um ovo e comer ali mesmo, na beira da fonte.',
     ef:{dinheiro:-50, moral:3, registrar:'Comeu ovo cozido na fonte quente do cais da Ilha Um.'},
     resultado:[
       'O ovo tem gosto de sal e de pedra quente. É o melhor ovo que você comeu na vida, e você não sabe explicar por quê.',
       fala('a senhora das termas', 'É o Slugma. Ele não esquenta a água: ele esquenta com carinho. Dá diferença.', 'riso')
     ]},
    {texto:'Perguntar se dá pra deixar o seu time esquentar as patas na água.',
     ef:{moral:4, registrar:'O time esquentou as patas na fonte quente do cais da Ilha Um.'},
     resultado:[
       d=>{ const p = d.time[0]; return p ? `${nomeExib(p)} põe a pata na água, tira, põe de novo e acaba sentad${pron(p).o} dentro da fonte até o pescoço.` : 'Você põe a mão na água e deixa ficar.'; },
       'O Slugma abre um olho, olha a cena e fecha de novo, satisfeito.'
     ]},
    {texto:'Seguir pelo cais.', ef:{}, resultado:['Você segue. O cheiro de enxofre e ovo cozido vem junto até o fim do cais.']}
  ]
}
],
ilha_dois:[
{
  id:'s2_a_placa_do_smeargle', umaVez:true, peso:3,
  titulo:'A placa da barraca',
  texto:[
    'Uma barraca de frutinha está sem placa. A dona deixou um Smeargle pintar uma nova, e o Smeargle pintou uma Pokébola enorme em vez de escrever "frutinha".',
    fala('a vendedora de frutinha', 'É a terceira placa que ele pinta. As três são Pokébola. Eu vendo frutinha.')
  ],
  escolhas:[
    {texto:'Sugerir que ela venda a placa e deixe a Pokébola.',
     ef:{moral:2, rep:{eixo:'bom', delta:1, motivo:'Ajudou a vender a placa pintada por um Smeargle na feira de Ilha Dois'}, registrar:'Convenceu a dona da barraca a vender a placa que o Smeargle pintou.'},
     resultado:[
       'Ela pensa, olha a placa, olha o Smeargle, e escreve num papelão: PLACA À VENDA, PINTADA POR SMEARGLE.',
       'Em meia hora um turista de Hoenn compra a placa por mais do que a barraca vende no dia. O Smeargle já está pintando a quarta.'
     ]},
    {texto:'Segurar a placa pro Smeargle escrever a palavra certa.',
     ef:{moral:3, registrar:'Segurou a placa pro Smeargle de Ilha Dois tentar escrever "frutinha".'},
     resultado:[
       'O Smeargle olha a palavra que você aponta, pensa muito, e pinta uma frutinha. Uma frutinha redonda, vermelha e branca, com um botão no meio.',
       fala('a vendedora de frutinha', 'Tá. Essa eu aceito.', 'riso')
     ]},
    {texto:'Seguir pela feira.', ef:{}, resultado:['Você segue. Atrás de você, o Smeargle mergulha o rabo na tinta e recomeça.']}
  ]
}
],
ilha_tres:[
{
  id:'s3_a_pipa', umaVez:true, peso:3,
  cond:d=>deDia(d),
  titulo:'A pipa de Hoppip',
  texto:[
    'Um menino tenta empinar um Hoppip amarrado numa linha de pipa, no meio da rua de terra. O Hoppip sobe, gira, desce, e não sai do lugar.',
    fala('o menino da pipa', 'Tinha festa disso aqui. Meu pai contava. O céu inteiro cheio de Hoppip. Agora só tem eu.')
  ],
  escolhas:[
    {texto:'Correr com ele pela rua até o vento pegar.',
     ef:{moral:3, rep:{eixo:'bom', delta:1, motivo:'Ajudou um menino a empinar um Hoppip na rua de Ilha Três'}, registrar:'Correu com um menino até o Hoppip dele pegar vento na rua de Ilha Três.'},
     resultado:[
       'Na terceira corrida o vento pega. O Hoppip sobe até o alto da linha e fica lá, rodando devagar, as folhas abertas.',
       'Uma janela abre. Depois outra. Uma senhora sai na calçada pra olhar, com a mão na boca.',
       fala('o menino da pipa', 'Viu? Viu? Tá vendo, vó?', 'grita')
     ]},
    {texto:'Mostrar como se solta a linha devagar, sem puxar.',
     ef:{moral:2, registrar:'Ensinou um menino de Ilha Três a soltar a linha da pipa de Hoppip sem puxar.'},
     resultado:[
       'Você solta a linha um palmo de cada vez. O Hoppip para de brigar com o vento e começa a usar ele.',
       'O menino pega a linha de volta e faz igual. Quando você vai embora, ele ainda está lá, olhando pra cima.'
     ]},
    {texto:'Seguir pela rua.', ef:{}, resultado:['Você segue. Quando olha pra trás, o Hoppip está no chão de novo, e o menino recomeça.']}
  ]
}
],
ilha_quatro:[
{
  id:'s4_o_lago', umaVez:true, peso:3,
  titulo:'O lago de verão',
  texto:[
    'O lago do meio da vila está congelado, e as crianças da ilha escorregam nele em cima de Swinub, que deixam, e de bandeja de padaria, que não deixa.',
    fala('a menina do gelo', 'Quer descer? Tem Swinub sobrando. O Bolinha não morde. O Bolinha é o gordo.')
  ],
  escolhas:[
    {texto:'Descer o lago montad{o|a} no Bolinha.',
     ef:{moral:4, registrar:'Escorregou no lago congelado da Ilha Quatro em cima de um Swinub chamado Bolinha.'},
     resultado:[
       'O Bolinha desce o lago inteiro em linha reta, roncando, e para exatamente na margem, como quem fez isso mil vezes. Fez.',
       'As crianças batem palma. Você levanta com a calça molhada e a cara quente.'
     ]},
    {texto:'Ficar na margem segurando a fila.',
     ef:{moral:2, registrar:'Organizou a fila das crianças no lago congelado da Ilha Quatro.'},
     resultado:[
       'Você vira fiscal de fila. Ninguém fura, ninguém chora, e o Bolinha ganha três descidas seguidas porque ninguém tem coragem de tirar ele.',
       fala('a menina do gelo', 'Você é bom nisso. Volta amanhã?')
     ]},
    {texto:'Seguir.', ef:{}, resultado:['Você segue. O riso das crianças em cima do gelo vai com você até a outra rua.']}
  ]
}
],
ilha_cinco:[
{
  id:'s5_o_relogio', umaVez:true, peso:3,
  titulo:'Os quatro minutos',
  texto:[
    'O relojoeiro da praça está no alto da escada, de chave na mão, olhando o relógio da torre que adianta quatro minutos.',
    fala('o relojoeiro', 'Eu podia acertar. Hoje eu acho que acerto. Todo ano eu acho que acerto.')
  ],
  escolhas:[
    {texto:'Dizer que a ilha inteira já chega quatro minutos antes, e que isso é bom.',
     ef:{moral:2, registrar:'Convenceu o relojoeiro de Ilha Cinco a deixar o relógio adiantado.'},
     resultado:[
       'Ele desce a escada devagar, guarda a chave no bolso e olha o relógio de baixo.',
       fala('o relojoeiro', 'Quatro minutos. Dá pra dar bom-dia com calma. Tá certo. Fica.', 'riso')
     ]},
    {texto:'Segurar a escada enquanto ele acerta.',
     ef:{moral:2, registrar:'Segurou a escada enquanto o relojoeiro acertava o relógio da torre de Ilha Cinco.'},
     resultado:[
       'Ele acerta. O ponteiro grande volta quatro minutos com um estalo, e o Hoothoot que dorme nele acorda, olha em volta e dorme de novo.',
       'No dia seguinte, metade da ilha chega atrasada em tudo. Ninguém reclama com você, mas todo mundo sabe.'
     ]},
    {texto:'Seguir pela praça.', ef:{}, resultado:['Você segue. Lá em cima, o relojoeiro continua parado, de chave na mão, decidindo.']}
  ]
}
],
ilha_seis:[
{
  id:'s6_o_natu', umaVez:true, peso:3,
  titulo:'A aposta do Natu',
  texto:[
    'Três meninos de Ilha Seis estão sentados no muro olhando um Natu que olha o horizonte. Cada um apostou um doce numa hora em que ele vai piscar.',
    fala('o menino do meio', 'Ele não piscou ontem. Nem anteontem. Meu primo diz que ele pisca uma vez por ano.')
  ],
  escolhas:[
    {texto:'Sentar no muro e apostar também.',
     ef:{moral:3, registrar:'Apostou um doce com os meninos de Ilha Seis na hora em que o Natu ia piscar.'},
     resultado:[
       'Você aposta no fim da tarde. O sol desce, o céu fica laranja, o Natu continua olhando.',
       'No último minuto de luz ele pisca. Os quatro gritam juntos, e ninguém sabe dizer quem ganhou.'
     ]},
    {texto:'Ficar olhando o horizonte junto com o Natu.',
     ef:{moral:3, registrar:'Ficou olhando o horizonte junto com o Natu do muro de Ilha Seis.'},
     resultado:[
       'Você olha pra onde ele olha. Tem mar, tem nuvem, tem a Ilha Sete lá longe, pequena.',
       'Os meninos param de falar e olham também. Ninguém sabe o que está procurando, e ninguém quer ser o primeiro a parar.'
     ]},
    {texto:'Seguir.', ef:{}, resultado:['Você segue. Atrás de você, o Natu não pisca.']}
  ]
}
],
ilha_sete:[
{
  id:'s7_a_lousa', umaVez:true, peso:3,
  titulo:'A lousa da arena',
  texto:[
    'Na entrada da arena, um rapaz de macacão repinta a lousa do chaveamento com cal, linha por linha, apagando os nomes do torneio passado.',
    fala('o rapaz da cal', 'Todo torneio eu pinto os dezesseis risquinhos. Todo torneio eu apago. Um dia eu escrevo o meu.')
  ],
  escolhas:[
    {texto:'Pegar o outro pincel e ajudar a pintar as linhas.',
     ef:{moral:2, registrar:'Ajudou a repintar a lousa do chaveamento da arena de Ilha Sete.'},
     resultado:[
       'A cal pinga no seu sapato. As linhas saem tortas no começo e retas no fim.',
       fala('o rapaz da cal', 'A sua linha é a da final. Dá sorte pra quem pinta, dizem.', 'riso')
     ]},
    {texto:'Perguntar o nome dele, pra ler na lousa um dia.',
     ef:{moral:2, registrar:'Perguntou o nome do rapaz que pinta a lousa da arena de Ilha Sete.'},
     resultado:[
       'Ele fica vermelho, ri, e escreve o nome num canto da lousa, bem pequeno, com o dedo molhado de cal.',
       'Depois apaga. Mas você viu.'
     ]},
    {texto:'Seguir.', ef:{}, resultado:['Você segue. Atrás de você, o rapaz recomeça a primeira linha.']}
  ]
}
]
});

/* ── o encanto da estrada das ilhas ─────────────────────── */
(function(){
  const enc = [
    ['campo', {
      id:'enc_s_os_swablu', umaVez:true, peso:3, ambientes:['campo','montanha'], sevii:true,
      cond:d=>ehSevii(d.local) && horaAgora(d) >= 6 && horaAgora(d) <= 10,
      titulo:'A chegada dos Swablu',
      texto:[
        'De manhã cedo o céu das ilhas fica branco de algodão.',
        'São Swablu, centenas, chegando do mar em fila torta, cansados da travessia, e pousando onde der: no capim, no muro, no seu ombro.',
        'Ninguém espanta. As ilhas sabem que eles vêm todo ano, e que vão embora sozinhos.'
      ],
      escolhas:[
        {texto:'Ficar parad{o|a} até o do seu ombro decidir ir embora.',
         ef:{moral:4, executar:d=>{ Estado.viu(333); }, registrar:'Um Swablu descansou no seu ombro na chegada da migração às ilhas.'},
         resultado:['Ele fica quase uma hora. Quando vai, deixa uma pena branca no seu ombro, leve como nada.',
           d=>{ const p = d.time[0]; return p ? `${nomeExib(p)} passou a hora inteira olhando pro Swablu sem se mexer, com medo de assustar.` : 'Você passou a hora inteira sem se mexer.'; }]},
        {texto:'Seguir devagar, desviando de onde eles pousaram.',
         ef:{moral:2, executar:d=>{ Estado.viu(333); }},
         resultado:['Você anda em zigue-zague por meia hora, desviando de Swablu dormindo no caminho. É a caminhada mais lenta e mais bonita do dia.']}
      ]
    }],
    ['agua', {
      id:'enc_s_o_lapras_da_gruta', umaVez:true, peso:3, ambientes:['agua','caverna'], sevii:true,
      cond:d=>ehSevii(d.local) && (horaAgora(d) >= 19 || horaAgora(d) <= 4),
      titulo:'O canto do lado de lá',
      texto:[
        'De noite, a água entre as ilhas fica parada como vidro, e de algum lugar vem um canto grave e comprido, de uma nota só, que volta e volta.',
        'Lá longe, quase na linha do escuro, uma forma grande passa nadando com a cabeça fora d\'água: um Lapras, sozinho, cantando pra ninguém.'
      ],
      escolhas:[
        {texto:'Ficar ouvindo até ele sumir.',
         ef:{moral:4, executar:d=>{ Estado.viu(131); }, registrar:'Ouviu um Lapras cantando sozinho entre as ilhas, de noite.'},
         resultado:['O canto vai ficando longe sem ficar baixo, como se o mar carregasse. Quando acaba, o silêncio fica com o formato dele.']},
        {texto:'Seguir, com o canto nas costas.',
         ef:{moral:2, executar:d=>{ Estado.viu(131); }},
         resultado:['Você segue. O canto vai junto por um bom pedaço, e depois não vai mais.']}
      ]
    }]
  ];
  for (const [amb, ev] of enc){
    if (!EVENTOS_ROTA[amb]) EVENTOS_ROTA[amb] = [];
    if (!EVENTOS_ROTA[amb].some(e => e.id === ev.id)) EVENTOS_ROTA[amb].push(ev);
  }
})();
