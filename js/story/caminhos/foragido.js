/* ============================================================
   CAMINHO DO FORAGIDO — quem te esconde
   Pra quem tem ficha aberta na Liga (a via do capítulo 9) na hora do
   desvio. Quem acompanha: a Dona Briar, que não pergunta nome e
   pergunta se paga, e o Corwin, que atravessa gente de noite.
   ============================================================ */

/* ── I · A ROTA 15 À NOITE (depois do 12) ──────────────────── */
CAPITULOS.push(
{
num:12.09, titulo:'A Rota 15 à Noite', local:'Rota 15 — a ponte', ambiente:'campo', nivelArea:40,
tom:'muito sombrio',
ancora:{local:'rota13', chamada:'No poste da entrada da Rota 15 tem um papel novo com um desenho parecido com você. Parecido demais.'},
entradas:['cf1_o_papel'],
inicio: d => 'cf1_o_papel',
cenas:{

cf1_o_papel:{
  texto:[
    'O papel no poste é novo, com cola ainda brilhando. O desenho é melhor que o do último: acertaram o nariz.',
    '**"PROCURA-SE PARA ESCLARECIMENTOS. FICHA DA LIGA. QUALQUER INFORMAÇÃO, CENTRO POKÉMON MAIS PRÓXIMO."**',
    'A ponte da Rota 15 é o único caminho pra fora de Fuchsia sem passar pela estação. Hoje tem uma guarita da Patrulha no meio dela, com farol.',
    d => { Nomes.apresentar('a dona da pensão'); return 'O PokéNav vibra com uma mensagem curta da Dona Briar: "Não atravessa a ponte. Espera o Corwin no ponto de ônibus velho. Ele cobra caro e não erra."'; }
  ],
  ef:{flag:'cm_foragido_1', registrar:'A Patrulha pôs uma guarita na ponte da Rota 15. O seu desenho está nos postes.'},
  escolhas:[
    {texto:'Esperar o Corwin no ponto de ônibus velho.', vai:'cf1_o_corwin'},
    {texto:'Atravessar a ponte de cabeça erguida, com documento.', vai:'cf1_a_ponte',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Atravessou a guarita da Patrulha de cabeça erguida'}}},
    {texto:'Ir até a guarita e se entregar.', vai:'cf1_entregou',
     ef:{flag:'cm_foragido_se_entregou', rep:{eixo:'bom', delta:2, motivo:'Se entregou à Patrulha na ponte da Rota 15'}}}
  ]
},

cf1_o_corwin:{
  falante:'o atravessador',
  vozes:['N','N','N'],
  texto:[
    'O ponto de ônibus velho não tem ônibus faz dez anos. O Corwin chega a pé, de casaco comprido, com um Hoothoot no ombro que gira a cabeça pra todo lado.',
    d => { Nomes.apresentar('o atravessador'); return '"Corwin." Ele não estende a mão. "A Briar mandou. Quinhentos pra atravessar. Por baixo da ponte, pelo leito seco do rio."'; },
    '"Tem mais duas pessoas hoje. Uma menina e um velho. Atravesso os três juntos ou nenhum."'
  ],
  ef:{npc:{nome:'Corwin', opiniao:0, memoria:'Te atravessou por baixo da ponte da Rota 15.'}},
  escolhas:[
    {texto:'Pagar os quinhentos.', vai:'cf1_o_leito', cond:d => d.jogador.dinheiro >= 500,
     ef:{dinheiro:-500, flag:'cm_foragido_pagou_corwin'}},
    {texto:'Pagar os quinhentos e mais quinhentos pela menina, que não tem.', vai:'cf1_o_leito', cond:d => d.jogador.dinheiro >= 1000,
     ef:{dinheiro:-1000, flag:['cm_foragido_pagou_corwin','cm_foragido_pagou_menina'], rep:{eixo:'bom', delta:2, motivo:'Pagou a travessia de uma menina que não tinha'}}},
    {texto:'Não tem dinheiro. Tentar a ponte.', vai:'cf1_a_ponte'}
  ]
},

cf1_o_leito:{
  texto:[
    'O leito seco do rio passa debaixo da ponte, a três metros da guarita, no escuro.',
    'A menina tem uns treze anos e um Nidoran♂ no colo, enrolado num pano. Ela tirou ele de um caminhão de manejo com as próprias mãos, e agora tem ficha também.',
    'O velho não diz por que tem ficha. Ele anda devagar e conversa baixinho com ninguém, que é o que gente velha faz em Kanto no escuro.',
    'No meio do caminho, o Nidoran da menina espirra.'
  ],
  teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção',
         critico:'cf1_passaram', sucesso:'cf1_passaram', parcial:'cf1_a_lanterna', falha:'cf1_a_lanterna'}
},

cf1_a_lanterna:{
  texto:[
    'A lanterna da guarita desce pro leito do rio e para em cima de vocês quatro.',
    fala('Guarda da ponte', 'Parado! Todo mundo!'),
    fala('o atravessador', 'Corre com os dois. Eu seguro.', 'baixo'),
    'O Corwin não corre. Ele fica, com o Hoothoot no ombro, entre a lanterna e vocês.'
  ],
  escolhas:[
    {texto:'Correr com a menina e o velho.', vai:'cf1_passaram',
     ef:{flag:'cm_foragido_corwin_ficou'}},
    {texto:'Ficar com o Corwin e enfrentar o guarda.', vai:'cf1_luta_ponte',
     ef:{rep:{eixo:'ruim', delta:2, motivo:'Lutou com a Patrulha pra atravessar a ponte'}}}
  ]
},

cf1_luta_ponte:{
  texto:['O guarda da ponte desce pro leito do rio com o Pokémon dele na frente.'],
  batalha:{dex:59, nivel:d => nivelDoCaminho(d, -2), tipo:'treinador', treinador:'Guarda da ponte', fuga:true,
           timeExtra:[{dex:58, nivel:d => nivelDoCaminho(d, -3)}],
           vitoria:'cf1_passaram', derrota:'cf1_entregou', gameover:'gameover'}
},

cf1_a_ponte:{
  texto:[
    'Você atravessa a ponte pela calçada, devagar, com o documento na mão.',
    'O guarda da guarita olha o documento, olha o seu rosto, olha o papel colado no vidro da guarita. Olha de novo.',
    fala('Guarda da ponte', 'Pode ir.', 'baixo'),
    'Ele espera você estar a vinte metros pra pegar o rádio. Você ouve a sua descrição atrás de você, em voz baixa, enquanto anda.'
  ],
  ef:{flag:'cm_foragido_atravessou_de_cara'},
  escolhas:[
    {texto:'Correr.', vai:'cf1_passaram'}
  ]
},

cf1_entregou:{
  texto:[
    'Na guarita da ponte tem uma cadeira de plástico e uma garrafa térmica de café. O guarda te serve uma xícara enquanto liga pro Centro mais próximo.',
    'A ficha da Liga, quando chega, é de três folhas. "Esclarecimentos sobre atividade em Celadon." Não é mandado. É conversa.',
    'Você esclarece por quatro horas, numa sala do Centro de Fuchsia, com uma atendente que digita devagar. No fim, ela carimba "aguardando".',
    fala('a atendente do Centro', 'Pode ir. Não sai de Kanto. E tira esse desenho do poste, que tá assustando as crianças.', 'riso')
  ],
  ef:{flag:'cm_foragido_ficha_aguardando'},
  escolhas:[
    {texto:'Seguir.', vai:'cf1_fim'}
  ]
},

cf1_passaram:{
  texto:[
    'Do outro lado do rio, na estrada de terra que vai pro norte, vocês param pra respirar.',
    'A menina do Nidoran agradece com um aceno e some pro lado do mato. O velho senta numa pedra e diz que daqui ele vai sozinho, devagar.',
    d => d.flags.cm_foragido_corwin_ficou ? 'O Corwin não aparece. Uma hora depois, o Hoothoot dele pousa no seu ombro, sozinho, e fica.' : fala('o atravessador', 'Atravessei. Não atravesso de novo esse mês. A ponte tá quente.')
  ],
  ef:{rep:{eixo:'ruim', delta:1, motivo:'Fugiu da Patrulha pela Rota 15'}},
  escolhas:[
    {texto:'Seguir pro norte.', vai:'cf1_fim'}
  ]
},

cf1_fim:{
  texto:[
    d => d.flags.cm_foragido_ficha_aguardando ? 'O desenho do poste fica lá mais uma semana. Depois a chuva leva.' : 'Na estrada de terra, de madrugada, você pensa no desenho do poste, que acertou o nariz. Você vai deixar o cabelo crescer.',
    d => d.flags.cm_foragido_corwin_ficou ? 'O Hoothoot do Corwin gira a cabeça pra trás a noite inteira, olhando a ponte.' : 'A ponte da Rota 15 fica pra trás, com o farol da guarita acendendo e apagando.'
  ],
  fim:true, resumo:'A Rota 15 à noite: um desenho que acertou o nariz, o leito seco de um rio e um atravessador de casaco comprido.'
}

}
},

/* ── II · O PORÃO DA PENSÃO (depois do 19) ──────────────────── */
{
num:19.09, titulo:'O Porão da Pensão', local:'Lavender — a Pensão Briar', ambiente:'cemiterio', nivelArea:56,
tom:'muito sombrio',
ancora:{local:'lavender', chamada:'Numa rua de Lavender, na porta de uma pensão com tinta azul descascada, tem um cartaz: QUARTO E CAFÉ. Embaixo, menor: NÃO PERGUNTO.'},
entradas:['cf2_a_pensao'],
inicio: d => 'cf2_a_pensao',
cenas:{

cf2_a_pensao:{
  texto:[
    d => { Nomes.apresentar('a dona da pensão'); return 'A Pensão Briar tem sete quartos em cima e um porão que não aparece em planta nenhuma. A Dona Briar te serve café às seis, como sempre.'; },
    fala('a dona da pensão', 'Tem uma moça no porão desde ontem. Veio da estação da Rota 21, a de cerca alta. Trouxe um Pokémon que não é dela, dentro de uma mochila.'),
    fala('a dona da pensão', 'Eu não pergunto. Mas eu vi o Pokémon. Ele não pisca.', 'baixo')
  ],
  ef:{flag:'cm_foragido_2', registrar:'Uma técnica fugida da Estação 4 se escondeu no porão da Pensão Briar com uma unidade de viveiro.'},
  escolhas:[
    {texto:'Descer ao porão.', vai:'cf2_o_porao'}
  ]
},

cf2_o_porao:{
  texto:[
    'O porão tem colchão no chão, um ventilador e uma lâmpada pendurada no fio.',
    'A moça é técnica do berçário da Estação 4, ainda de crachá. No colo dela, um Eevee de pelagem perfeita, quieto, olhando pra porta, esperando ordem.',
    fala('a técnica fugida', 'Ele ia pra destinação na terça. Inviável. Ele não é inviável, ele só não obedece rápido.', 'baixo'),
    fala('a técnica fugida', 'Eu pus na mochila e saí pela porta da frente, com crachá. Ninguém olha quem sai com crachá.', 'baixo')
  ],
  ef:{npc:{nome:'a técnica fugida', opiniao:2, memoria:'Você desceu ao porão da Pensão Briar e não fez perguntas.'}},
  escolhas:[
    {texto:'Ficar com ela e o Eevee até pensar num lugar seguro.', vai:'cf2_a_noite',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Ficou de guarda no porão da Pensão Briar'}}},
    {texto:'Perguntar o nome dela.', vai:'cf2_o_nome'}
  ]
},

cf2_o_nome:{
  texto:[
    fala('a técnica fugida', 'Não.', 'baixo'),
    fala('a técnica fugida', 'Não é por você. É que eu passei três anos sendo um número de crachá, e agora eu quero passar uns dias sem nome nenhum.', 'baixo')
  ],
  escolhas:[
    {texto:'Ficar com ela até a noite.', vai:'cf2_a_noite'}
  ]
},

cf2_a_noite:{
  texto:[
    'Às onze da noite, a Dona Briar desce a escada do porão sem fazer barulho, o que pra ela é um esforço enorme.',
    fala('a dona da pensão', 'Tem dois de colete preto na porta. Educados. Perguntando de uma hóspede que eu não tenho.', 'baixo'),
    fala('a dona da pensão', 'Eu disse que não pergunto nome. Eles disseram que eles perguntam.', 'baixo'),
    'Lá em cima, alguém bate na porta da frente três vezes, com o nó do dedo.'
  ],
  escolhas:[
    {texto:'Subir e enfrentar os dois na porta.', vai:'cf2_a_porta',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Subiu pra enfrentar a Comissão na porta da pensão'}}},
    {texto:'Tirar a técnica e o Eevee pela janela do porão, que dá pro cemitério.', vai:'cf2_o_cemiterio',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Tirou a técnica fugida pela janela do porão'}}}
  ]
},

cf2_o_cemiterio:{
  texto:[
    'A janela do porão dá pro muro do cemitério de Lavender. Do outro lado do muro, no escuro, as lápides de Pokémon em fileira, e a Torre ao fundo.',
    'Vocês atravessam o cemitério devagar. O Eevee no colo dela olha pras lápides e, pela primeira vez, pisca.',
    'No portão de trás do cemitério, um homem de colete preto já está esperando. Alguém pensou na janela também.'
  ],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 0), tipo:'treinador', treinador:'Segurança da Estação 4', fuga:false,
           vitoria:'cf2_salvou', derrota:'cf2_levaram', gameover:'gameover'}
},

cf2_a_porta:{
  texto:[
    'Na porta, os dois de colete preto. Um deles tem uma prancheta com a foto da técnica e a foto do Eevee, lado a lado, do mesmo tamanho.',
    fala('Segurança da Estação 4', 'Propriedade da Estação. Os dois. A moça tem contrato e o Pokémon tem lote.', 'frio'),
    fala('a dona da pensão', 'Na minha porta ninguém é propriedade de ninguém. Nem quem paga atrasado.', 'frio')
  ],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 1), tipo:'treinador', treinador:'Segurança da Estação 4', fuga:false,
           timeExtra:[{dex:42, nivel:d => nivelDoCaminho(d, 0)}],
           vitoria:'cf2_salvou', derrota:'cf2_levaram', gameover:'gameover'}
},

cf2_salvou:{
  texto:[
    'As unidades caem e esperam ordem. Eles recolhem e vão embora, e o de prancheta anota a placa da pensão.',
    'De madrugada, o Corwin aparece na porta dos fundos, de casaco comprido, pra levar a técnica e o Eevee pro norte.',
    'Antes de ir, ela põe o Eevee no chão e diz "vem". Ele demora. E vem.'
  ],
  ef:{flag:'cm_foragido_salvou_a_tecnica', rep:{eixo:'bom', delta:2, motivo:'Protegeu uma técnica fugida e uma unidade de viveiro na Pensão Briar'},
      npc:{nome:'Dona Briar', opiniao:4, memoria:'Você protegeu a porta da pensão contra dois de colete preto.'}},
  escolhas:[
    {texto:'Ver eles irem.', vai:'cf2_fim'}
  ]
},

cf2_levaram:{
  texto:[
    'Eles levam a técnica pelo braço, sem violência, e o Eevee numa caixa de transporte com respiro.',
    'A Dona Briar fecha a porta e encosta a testa na madeira por um minuto.',
    fala('a dona da pensão', 'Vinte e dois anos de pensão. É a terceira vez. Nunca fica mais fácil.', 'baixo')
  ],
  ef:{flag:'cm_foragido_levaram_a_tecnica', hp:-2, causa:'A porta da Pensão Briar'},
  escolhas:[
    {texto:'Ficar com ela até amanhecer.', vai:'cf2_fim'}
  ]
},

cf2_fim:{
  texto:[
    d => d.flags.cm_foragido_salvou_a_tecnica ? 'De manhã, o porão está vazio. No colchão, um crachá da Estação 4 cortado ao meio com tesoura.' : 'De manhã, o porão está vazio. No colchão, o pelo de um Eevee, e a marca de alguém que dormiu sentada.',
    fala('a dona da pensão', 'Café às seis. Como sempre.', 'baixo'),
    'Lavender não tem música. Na pensão, às seis, tem barulho de xícara, que é quase.'
  ],
  fim:true, resumo:'O porão da pensão: um colchão no chão, um Eevee que não pisca e dois coletes pretos na porta.'
}

}
},

/* ── III · RENDIÇÃO OU ESTRADA (depois do 25) ───────────────── */
{
num:25.09, titulo:'Rendição ou Estrada', local:'Lavender — a cozinha da pensão', ambiente:'cemiterio', nivelArea:58,
tom:'muito sombrio',
ancora:{local:'lavender', chamada:'Na cozinha da Pensão Briar tem uma carta da Liga em cima da mesa, aberta, e a Dona Briar não está lendo.'},
entradas:['cf3_a_carta'],
inicio: d => 'cf3_a_carta',
cenas:{

cf3_a_carta:{
  texto:[
    'A carta da Liga chegou pro endereço da pensão, que não é o seu endereço em lugar nenhum. Alguém sabe.',
    '**"Depois da audiência de segunda, a ficha de esclarecimentos foi convertida em mandado de condução. Apresentação voluntária em quinze dias reduz as medidas."**',
    fala('a dona da pensão', 'Quinze dias. Isso é tempo de fugir ou de se entregar com dignidade. Eu já vi gente fazer as duas coisas.'),
    fala('a dona da pensão', 'Os dois funcionam. Os dois cobram.', 'baixo')
  ],
  ef:{flag:'cm_foragido_3', registrar:'A ficha da Liga virou mandado de condução. Quinze dias pra se apresentar.'},
  escolhas:[
    {texto:'Juntar tudo o que você sabe antes de decidir.', vai:'cf3_o_que_tem'},
    {texto:'Ligar pro Corwin.', vai:'cf3_o_corwin'}
  ]
},

cf3_o_que_tem:{
  texto:[
    'Em cima da mesa da cozinha, você espalha o que juntou na estrada: papel, foto, nota, o que a memória guarda.',
    d => d.flags.cm_foragido_salvou_a_tecnica ? 'Um crachá da Estação 4 cortado ao meio com tesoura.' : 'O pelo de um Eevee, que você guardou num envelope sem saber por quê.',
    'Não é processo. É uma vida de quem viu coisa demais pra quem tem ficha.',
    fala('a dona da pensão', 'Quem se entrega com documento não se entrega. Depõe.', 'baixo')
  ],
  ef:{flag:'cm_foragido_juntou', rep:{eixo:'bom', delta:1, motivo:'Juntou o que sabia antes de decidir o próprio destino'}},
  escolhas:[
    {texto:'Ligar pro Corwin.', vai:'cf3_o_corwin'},
    {texto:'Decidir.', vai:'cf3_a_decisao'}
  ]
},

cf3_o_corwin:{
  texto:[
    d => d.flags.cm_foragido_corwin_ficou ? 'O Corwin atende. Ele saiu da guarita da ponte depois de dois meses. O Hoothoot dele ainda está com você.' : 'O Corwin atende no terceiro toque.',
    fala('o atravessador', 'Eu atravesso você pro sul, de barco, pra uma ilha que não tem Centro Pokémon nem Liga. Dois mil. É a última que eu faço.', 'baixo'),
    fala('o atravessador', 'Ou você fica, e eu fico também, e a gente vê.', 'baixo')
  ],
  escolhas:[
    {texto:'Decidir.', vai:'cf3_a_decisao'}
  ]
},

cf3_a_decisao:{
  texto:[
    'Na rua da pensão, um carro preto estaciona de ré, devagar, e não desliga o motor.',
    'Não é a Liga. A Liga manda carta. Quem estaciona de ré na frente de pensão é quem não quer que você chegue no dia quinze.',
    fala('a dona da pensão', 'Comissão. Eles não querem você na Liga. Na Liga você fala.', 'frio')
  ],
  escolhas:[
    {texto:'Sair pela frente e enfrentar o carro.', vai:'cf3_o_carro'},
    {texto:'Sair pelos fundos, pelo cemitério.', vai:'cf3_os_fundos'}
  ]
},

cf3_os_fundos:{
  texto:[
    'O cemitério de Lavender de madrugada é o lugar mais quieto de Kanto. A Torre ao fundo tem uma janela acesa no último andar, como sempre.',
    'No portão de trás, ninguém dessa vez. Eles não pensaram duas vezes na mesma janela.'
  ],
  ef:{flag:'cm_foragido_fundos'},
  escolhas:[
    {texto:'Ir pro Centro de Lavender e se apresentar à Liga.', vai:'cf3_final_rendicao',
     ef:{rep:{eixo:'bom', delta:3, motivo:'Se apresentou voluntariamente à Liga, com o que sabia'}}},
    {texto:'Ir pro cais encontrar o Corwin.', vai:'cf3_final_estrada',
     ef:{rep:{eixo:'ruim', delta:1, motivo:'Fugiu de Kanto de barco'}}},
    {texto:'Voltar pra pensão de manhã e ficar. Alguém tem que abrir a porta pra próxima.', vai:'cf3_final_pensao',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Ficou na Pensão Briar pra esconder quem precisa'}}},
    {texto:'Ainda não. Seguir pro Planalto, com o mandado no bolso.', vai:'cf3_seguir',
     ef:{rep:{eixo:'ruim', delta:1, motivo:'Seguiu viagem com mandado de condução aberto'}}}
  ]
},

cf3_o_carro:{
  texto:['Do carro preto descem dois. Um deles você já viu numa porta de pensão, com prancheta.'],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 3), tipo:'treinador', treinador:'Segurança da Estação 4', fuga:false,
           timeExtra:[{dex:94, nivel:d => nivelDoCaminho(d, 3)}],
           vitoria:'cf3_venceu_o_carro', derrota:'cf3_os_fundos', gameover:'gameover'}
},

cf3_venceu_o_carro:{
  texto:[
    'As unidades caem na calçada da pensão. Os dois recolhem e vão embora, de ré, como chegaram.',
    'A rua inteira assistiu da janela. Ninguém liga pra ninguém.',
    fala('a dona da pensão', 'Agora você escolhe sem pressa. Ninguém escolhe direito com carro de ré na porta.', 'baixo')
  ],
  ef:{rep:{eixo:'bom', delta:1, motivo:'Enfrentou a Comissão na porta da Pensão Briar'}},
  escolhas:[
    {texto:'Ir pro Centro de Lavender e se apresentar à Liga.', vai:'cf3_final_rendicao',
     ef:{rep:{eixo:'bom', delta:3, motivo:'Se apresentou voluntariamente à Liga, com o que sabia'}}},
    {texto:'Ir pro cais encontrar o Corwin.', vai:'cf3_final_estrada',
     ef:{rep:{eixo:'ruim', delta:1, motivo:'Fugiu de Kanto de barco'}}},
    {texto:'Ficar na pensão. Alguém tem que abrir a porta pra próxima.', vai:'cf3_final_pensao',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Ficou na Pensão Briar pra esconder quem precisa'}}},
    {texto:'Ainda não. Seguir pro Planalto, com o mandado no bolso.', vai:'cf3_seguir',
     ef:{rep:{eixo:'ruim', delta:1, motivo:'Seguiu viagem com mandado de condução aberto'}}}
  ]
},

cf3_seguir:{
  texto:[
    fala('a dona da pensão', 'Vai. O quarto fica. Eu não alugo.', 'baixo'),
    'O ônibus da Liga pro Planalto sai às oito e quinze. Você compra a passagem com o nome que está no seu documento, porque esconder já cansou.'
  ],
  ef:{flag:'cm_foragido_seguiu'},
  fim:true, resumo:'Rendição ou estrada: uma carta da Liga num endereço que não é seu e um carro estacionado de ré.'
},

cf3_final_rendicao:{
  texto:[
    'No Centro de Lavender, a atendente lê a carta da Liga, olha pra você, e liga a chaleira antes de ligar pra Liga.',
    'O depoimento dura dois dias. Você conta tudo: Celadon, a rede, a ponte, o porão.'
  ],
  final:{id:'foragido_rendicao', titulo:'RENDIÇÃO', texto:[
    'A medida é a mais leve que existe: licença suspensa por um ano e serviço comunitário num abrigo de Pokémon em Cerulean.',
    'No abrigo, uma tratadora de macacão manchado de ração te ensina a dar nome a quem chega. Você dá nome a cento e doze em um ano.',
    'O seu depoimento vira anexo de um processo maior, contra quem estacionava de ré na porta das pensões.',
    'A licença volta num dia de chuva, pelo correio, dentro de um envelope que a Dona Briar guardou sem abrir. Ela te entrega no café das seis.'
  ]}
},

cf3_final_estrada:{
  texto:[
    d => d.flags.cm_foragido_corwin_ficou ? 'No cais, o Corwin está de casaco comprido, sem Hoothoot. Você devolve o Hoothoot. Ele não aceita: diz que o Hoothoot escolheu.' : 'No cais, o Corwin está de casaco comprido, com o Hoothoot no ombro girando a cabeça.',
    'O barco é baixo e não tem nome. Sai às quatro da manhã, sem luz, pro sul.'
  ],
  final:{id:'foragido_estrada', titulo:'A ESTRADA', texto:[
    'A ilha do sul não tem Centro Pokémon, nem Liga, nem poste pra colar desenho.',
    'Você vive de pescar com o time e de consertar barco. Ninguém pergunta o seu nome, e depois de um ano você para de lembrar de esconder.',
    'Às vezes chega um barco baixo sem nome, de madrugada, com alguém dentro que precisa de lugar. Você tem um quarto.',
    'Kanto continua do outro lado do mar, com a sua ficha aberta. Nunca fecha. Você aprende que tem ficha que é melhor deixar aberta.'
  ]}
},

cf3_final_pensao:{
  texto:[
    'A Dona Briar não diz nada. Ela te entrega uma chave de número rasurado: a do porão.',
    fala('a dona da pensão', 'Café às seis. E quem bater com a palma, você abre. Quem bater com o nó do dedo, você me chama.', 'baixo')
  ],
  final:{id:'foragido_pensao', titulo:'A PENSÃO', texto:[
    'Em dois anos, o porão da Pensão Briar esconde quarenta e uma pessoas e dezenove Pokémon que não piscavam.',
    'A ficha da Liga continua aberta. Ninguém vem buscar: quem sabe onde você está não conta, e quem conta não sabe.',
    'A Dona Briar morre num inverno, dormindo, e deixa a pensão no seu nome, num testamento de uma linha só: "NÃO PERGUNTA."',
    'Você pinta a porta de azul de novo, mais forte. Café às seis. Como sempre.'
  ]}
}

}
}
);
