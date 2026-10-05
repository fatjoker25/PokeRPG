/* ============================================================
   CAMINHO DA ROCKET — o envelope sem timbre
   Pra quem carrega o envelope do armário 14 na hora do desvio. Quem
   acompanha: a voz do outro lado, o Rook (o contato da Terceira, do
   capítulo 12) e a própria Terceira.
   ============================================================ */

/* ── I · A CERCA DE TRÁS (depois do 12) ────────────────────── */
CAPITULOS.push(
{
num:12.02, titulo:'A Cerca de Trás', local:'Fuchsia — o setor 7, por fora', ambiente:'campo', nivelArea:40,
tom:'muito sombrio',
ancora:{local:'fuchsia', chamada:'No orelhão da saída sul de Fuchsia tem um adesivo com um número de armário e mais nada.'},
entradas:['cr1_o_armario', 'cr1_a_ligacao'],
inicio: d => d.flags.ln_rocket_soltou ? 'cr1_a_ligacao' : 'cr1_o_armario',
cenas:{

cr1_o_armario:{
  texto:[
    'O armário da rodoviária de Fuchsia tem o número do adesivo e abre com a chave que veio no último envelope.',
    'Dentro, um bilhete datilografado e um boné sem logotipo.',
    '**"SETOR 7, CERCA DE TRÁS. DUAS DA MANHÃ. O ROOK LEVA. VOCÊ CONTA."**',
    'Contar, pra quem manda o bilhete, é a coisa mais importante que existe. Você aprendeu isso no Centro de Vermilion, contando gente depois das dez.'
  ],
  ef:{flag:'cm_rocket_1', registrar:'O envelope sem timbre mandou você contar uma carga na cerca de trás do setor 7.'},
  escolhas:[
    {texto:'Ir pra cerca na hora marcada.', vai:'cr1_o_rook'},
    {texto:'Ir mais cedo e ver o lugar sozinh{o|a}.', vai:'cr1_antes',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Foi olhar a cerca antes de fazer o serviço'}}},
    {texto:'Ligar pro ginásio de Fuchsia e contar o horário.', vai:'cr1_o_koga', cond:d => !!d.flags.achou_ginasio_fuchsia || !!d.npcs['Koga'],
     ef:{flag:'cm_rocket_dedurou', rep:{eixo:'bom', delta:2, motivo:'Contou ao ginásio de Fuchsia o horário da cerca de trás'}}}
  ]
},

cr1_a_ligacao:{
  texto:[
    'O aparelho do envelope toca no meio da tarde, no meio de Fuchsia, no meio de uma fila de padaria.',
    fala('a voz do outro lado', 'A caixa do Vulpix chegou vazia, e a gente achou isso útil. Quem pensa conta melhor.', 'frio'),
    fala('a voz do outro lado', 'Setor 7, cerca de trás, duas da manhã. O Rook leva. Você conta. Contar certo é o serviço.'),
    'Ele desliga antes de você responder, que é o jeito dele de dizer que você não ia recusar.'
  ],
  ef:{flag:'cm_rocket_1', registrar:'O envelope sem timbre mandou você contar uma carga na cerca de trás do setor 7.'},
  escolhas:[
    {texto:'Ir pra cerca na hora marcada.', vai:'cr1_o_rook'},
    {texto:'Ir mais cedo e ver o lugar sozinh{o|a}.', vai:'cr1_antes',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Foi olhar a cerca antes de fazer o serviço'}}}
  ]
},

cr1_o_koga:{
  texto:[
    'Quem atende o telefone do ginásio é a filha do Koga, que ouve sem interromper e repete o horário em voz alta, uma vez.',
    fala('Filha do Koga', 'Meu pai não vai prender ninguém. Ele não é polícia. Ele vai estar lá, olhando.', 'baixo'),
    fala('Filha do Koga', 'E vai lembrar de quem ligou.', 'baixo'),
    'Você desliga e vai pra cerca do mesmo jeito. Se não for, o envelope sabe por quê.'
  ],
  ef:{npc:{nome:'Koga', opiniao:2, memoria:'Você ligou pro ginásio com o horário da cerca de trás do setor 7.'}},
  escolhas:[
    {texto:'Ir pra cerca.', vai:'cr1_o_rook'}
  ]
},

cr1_antes:{
  texto:[
    'A cerca de trás do setor 7 tem trinta e um quilômetros como o resto, mas aqui ela tem um corte: dois metros de tela cortada e dobrada pra dentro, presa com arame pra parecer inteira.',
    'Do lado de dentro, marca de pneu de carrinho de mão. Do lado de fora, marca de caminhão.',
    'No chão, uma etiqueta de papel rasgada ao meio, com metade de um código à caneta.',
    'Alguém usa esse corte duas ou três vezes por mês. A cerca foi feita pra não deixar sair, e foi aberta pra deixar sair por um preço.'
  ],
  ef:{flag:'cm_rocket_viu_o_corte', itens:{'Meia etiqueta de código':1},
      registrar:'Na cerca de trás do setor 7 tem um corte de dois metros, disfarçado com arame.'},
  escolhas:[
    {texto:'Esperar o Rook.', vai:'cr1_o_rook'}
  ]
},

cr1_o_rook:{
  falante:'o contato da Terceira',
  vozes:['N','N','P','N'],
  texto:[
    'O caminhão chega às duas menos dez, de farol apagado, e quem desce dele é o homem que da outra vez contou dezoito mil na sua frente.',
    d => { Nomes.apresentar('o contato da Terceira'); return 'Por baixo da jaqueta dele, preso do avesso, tem um broche velho com uma letra que ninguém usa mais em Kanto. No bordado do bolso: ROOK.'; },
    '"Você conta. Eu carrego. Ninguém fala."',
    '"Conta o quê?"',
    '"O que passar pelo buraco." Ele ri sem barulho. "O manejo daqui chama de excedente. A gente chama de mercadoria. O bicho não chama de nada."'
  ],
  ef:{npc:{nome:'Rook', opiniao:0, memoria:'Carregou com você a carga da cerca de trás do setor 7.'}},
  escolhas:[
    {texto:'Ir pro corte da cerca.', vai:'cr1_a_cerca'}
  ]
},

cr1_a_cerca:{
  texto:[
    'Do lado de dentro do corte, dois homens de macacão da reserva empurram carrinho de mão com gaiola em cima.',
    'Um deles você já viu no portão da reserva, de dia, dando bom-dia pra turista.',
    'As gaiolas passam pelo buraco de mão em mão. Nidorino. Dois Exeggcute. Um Kangaskhan filhote sem a mãe. Um Scyther com uma asa enfaixada.',
    'O Rook carrega. Você tem um caderninho e um lápis. Todo mundo olha pra você esperando o número.'
  ],
  escolhas:[
    {texto:'Contar certo. Dezenove.', vai:'cr1_contou',
     ef:{flag:'cm_rocket_contou_certo', dinheiro:1200, rep:{eixo:'ruim', delta:2, motivo:'Contou a carga da cerca de trás pra rede'}}},
    {texto:'Contar dezesseis e deixar três pra trás, no escuro, com a gaiola aberta.', vai:'cr1_tres',
     ef:{flag:'cm_rocket_tres', dinheiro:900, moral:3, rep:{eixo:'bom', delta:1, motivo:'Deixou três pra trás na cerca de trás, de gaiola aberta'}}},
    {texto:'Abrir a gaiola do Kangaskhan filhote na frente de todo mundo.', vai:'cr1_o_filhote',
     ef:{flag:'cm_rocket_filhote', rep:{eixo:'bom', delta:2, motivo:'Abriu na frente da rede a gaiola de um Kangaskhan filhote'}}}
  ]
},

cr1_contou:{
  texto:[
    'Dezenove. O Rook confere de cabeça e balança a cabeça.',
    'Os homens de macacão pegam um envelope do Rook e voltam pelo buraco empurrando o carrinho vazio, que agora não faz barulho.',
    'O Kangaskhan filhote chora baixinho na gaiola de cima a estrada inteira até Celadon. Você não sabia que eles choravam.'
  ],
  ef:{registrar:'Contou dezenove na cerca de trás. Um deles era um Kangaskhan filhote.'},
  escolhas:[
    {texto:'Seguir com o caminhão pra Celadon.', vai:'cr1_a_guarda'}
  ]
},

cr1_tres:{
  texto:[
    'Você conta em voz alta, devagar, e erra três vezes no lugar certo.',
    'No escuro, atrás do caminhão, três gaiolas ficam no chão com a trava solta. O Nidorino sai primeiro. O Scyther da asa enfaixada não sai: fica olhando pra você de dentro da porta aberta, e só vai quando o motor liga.',
    'O Rook olha o caderninho, olha o caminhão, olha você.',
    fala('o contato da Terceira', 'Dezesseis.', 'baixo'),
    fala('o contato da Terceira', 'Eu também sei contar. Eu vou dizer dezesseis lá em Celadon. Da próxima, você me avisa antes.', 'baixo')
  ],
  ef:{npc:{nome:'Rook', opiniao:2, memoria:'Viu você contar errado de propósito e cobriu.'}},
  escolhas:[
    {texto:'Seguir com o caminhão pra Celadon.', vai:'cr1_a_guarda'}
  ]
},

cr1_o_filhote:{
  falante:'o contato da Terceira',
  vozes:['N','N'],
  texto:[
    'O filhote sai da gaiola e fica parado no chão, sem saber pra onde, até um dos homens de macacão tentar pegar de volta.',
    'O filhote morde a mão dele e corre pro escuro do lado de dentro da cerca, pro lado da reserva.',
    '"Isso foi caro." O Rook não grita. Ele anota no caderninho dele, que você não sabia que existia.',
    '"Vai sair do seu. E vai pra cima, pra quem lê o que eu anoto."'
  ],
  ef:{dinheiro:-800, npc:{nome:'Rook', opiniao:-1, memoria:'Abriu a gaiola do Kangaskhan filhote na frente dos homens da reserva.'}},
  escolhas:[
    {texto:'Seguir com o caminhão pra Celadon.', vai:'cr1_a_guarda'}
  ]
},

cr1_a_guarda:{
  texto:[
    'Na estrada de terra que contorna a reserva, um farol de bicicleta aparece de frente e para no meio do caminho.',
    'Uma guarda da reserva, de colete verde, com a mão levantada e a outra no cinto.',
    d => d.flags.cm_rocket_dedurou ? 'Atrás dela, na sombra de uma árvore, alguém magro de roupa escura que não se mexe nem pra olhar.' : 'Ela está sozinha. Isso é corajoso ou é burro, e com guarda de reserva costuma ser os dois.',
    fala('Guarda da reserva', 'Caminhão sem placa na estrada de serviço às três da manhã. Desce.'),
    fala('o contato da Terceira', 'Resolve.', 'baixo')
  ],
  escolhas:[
    {texto:'Lutar com ela pra passar.', vai:'cr1_luta_guarda',
     ef:{rep:{eixo:'ruim', delta:2, motivo:'Lutou com uma guarda da reserva pra passar com carga roubada'}}},
    {texto:'Descer e se entregar.', vai:'cr1_entregou',
     ef:{flag:'cm_rocket_se_entregou', rep:{eixo:'bom', delta:2, motivo:'Se entregou à guarda da reserva com a carga'}}},
    {texto:'Mandar o Rook acelerar.', vai:'cr1_acelerou',
     ef:{rep:{eixo:'ruim', delta:3, motivo:'Mandou acelerar um caminhão em cima de uma guarda'}}}
  ]
},

cr1_luta_guarda:{
  texto:['Ela não recua. Solta um Pokémon que conhece aquela estrada melhor que você.'],
  batalha:{dex:115, nivel:d => nivelDoCaminho(d, -2), tipo:'treinador', treinador:'Guarda da reserva', fuga:false,
           timeExtra:[{dex:128, nivel:d => nivelDoCaminho(d, -1)}],
           vitoria:'cr1_passou', derrota:'cr1_entregou', gameover:'gameover'}
},

cr1_passou:{
  texto:[
    'O Kangaskhan dela cai devagar, como árvore. Ela fica de pé do lado dele, segurando a cabeça dele no colo.',
    'O caminhão passa por ela devagar. Ela olha a placa que não existe e olha pra você, que existe.',
    fala('Guarda da reserva', 'Eu sei o seu rosto agora.', 'frio')
  ],
  ef:{flag:'cm_rocket_bateu_na_guarda',
      npc:{nome:'Guarda da reserva', opiniao:-4, memoria:'Você derrubou o Kangaskhan dela pra passar com a carga da cerca de trás.'}},
  escolhas:[
    {texto:'Chegar em Celadon.', vai:'cr1_celadon'}
  ]
},

cr1_acelerou:{
  texto:[
    'O Rook acelera sem perguntar duas vezes.',
    'A guarda pula pro mato no último segundo. A bicicleta não pula.',
    'No retrovisor, ela está de pé na estrada, mancando, com a lanterna apontada pra traseira do caminhão.',
    fala('o contato da Terceira', 'Você manda bem. Ela também. Ela vai lembrar.', 'baixo')
  ],
  ef:{flag:'cm_rocket_atropelou_a_bicicleta',
      npc:{nome:'Guarda da reserva', opiniao:-6, memoria:'Mandaram o caminhão acelerar em cima dela na estrada de serviço.'}},
  escolhas:[
    {texto:'Chegar em Celadon.', vai:'cr1_celadon'}
  ]
},

cr1_entregou:{
  texto:[
    'Você desce do caminhão com as mãos à vista.',
    'O Rook não espera: dá ré, vira no mato e some pela estrada de serviço de farol apagado, com a carga inteira.',
    'A guarda te leva até a guarita da reserva e te dá café enquanto preenche um formulário de três folhas.',
    fala('Guarda da reserva', 'Você vai responder por invasão. Eles vão responder por nada. Isso não é justo e é o que vai acontecer.', 'baixo'),
    d => d.flags.cm_rocket_dedurou ? 'Às cinco da manhã, um homem magro entra na guarita, assina o formulário embaixo do seu nome e vai embora sem dizer quem é. Você é liberad{o|a} às seis.' : 'Às seis da manhã você é liberad{o|a}, com uma multa e uma ficha.'
  ],
  ef:{flag:'cm_rocket_ficha_na_reserva', dinheiro:-500,
      npc:{nome:'Guarda da reserva', opiniao:3, memoria:'Você desceu do caminhão e se entregou.'}},
  escolhas:[
    {texto:'Ligar pra voz do outro lado e dizer o que aconteceu.', vai:'cr1_fim',
     ef:{flag:'cm_rocket_contou_que_caiu', rep:{eixo:'ruim', delta:1, motivo:'Prestou contas à rede depois de cair'}}},
    {texto:'Jogar o aparelho do envelope no canal.', vai:'cr1_fim',
     ef:{flag:'cm_rocket_jogou_aparelho', rep:{eixo:'bom', delta:2, motivo:'Jogou fora o aparelho da rede'},
         executar:d => { if (typeof Cargos !== 'undefined' && Cargos.tem('rocket')) Cargos.largar('rocket'); return [{tipo:'info', texto:'O envelope não vai mais estar no armário 14.'}]; }}}
  ]
},

cr1_celadon:{
  texto:[
    'O depósito de portão azul, na rua de serviço atrás do cassino, abre por dentro antes de vocês buzinarem.',
    'Um homem conta as gaiolas e confere com o seu caderninho, número por número, e no fim olha pra você em vez de olhar pra mercadoria.',
    d => d.flags.cm_rocket_tres ? 'Dezesseis. Ele confere duas vezes e escreve dezesseis.' : d.flags.cm_rocket_filhote ? 'Dezoito. Ele escreve dezoito e um número do lado, que é o que vai sair do seu bolso.' : 'Dezenove. Ele escreve dezenove.',
    fala('a voz do outro lado', 'Chegou. Bom trabalho, pelo que contaram.', 'frio')
  ],
  ef:{rep:{eixo:'ruim', delta:1, motivo:'Entregou carga da cerca de trás no depósito de Celadon'}},
  escolhas:[
    {texto:'Ir embora.', vai:'cr1_fim'},
    {texto:'Perguntar pra onde vai a carga depois daqui.', vai:'cr1_pra_onde',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Perguntou pra onde ia a carga'}}}
  ]
},

cr1_pra_onde:{
  texto:[
    'O homem do depósito não responde. Quem responde, pelo aparelho, é a voz.',
    fala('a voz do outro lado', 'Pra quem compra com nota.', 'frio'),
    fala('a voz do outro lado', 'É a primeira coisa que você pergunta, e é uma pergunta boa. Não faz a segunda tão cedo.'),
    'No fundo do depósito, empilhadas, tem caixas de papelão com etiqueta de transportadora, prontas pra sair. O destino na etiqueta é uma sigla e uma rota: ROTA 21.'
  ],
  ef:{flag:'cm_rocket_rota21', registrar:'A carga do depósito de Celadon sai pra quem compra com nota, numa rota: Rota 21.'},
  escolhas:[
    {texto:'Ir embora.', vai:'cr1_fim'}
  ]
},

cr1_fim:{
  texto:[
    d => {
      if (d.flags.cm_rocket_se_entregou) return 'Você sai da guarita da reserva com uma ficha que vai te seguir, e com a sensação estranha de que pela primeira vez em semanas alguém te tratou como gente.';
      if (d.flags.cm_rocket_tres) return 'Em algum lugar dentro da cerca, um Scyther com a asa enfaixada aprendeu que porta aberta às vezes é só porta aberta.';
      if (d.flags.cm_rocket_filhote) return 'Em algum lugar dentro da reserva, um Kangaskhan filhote está procurando a mãe, e talvez ache.';
      return 'O envelope do mês que vem, no armário 14, vai ter um pouco mais de dinheiro dentro.';
    },
    'A cerca de trás continua com o corte, disfarçado com arame. Duas ou três vezes por mês.'
  ],
  fim:true, resumo:'A cerca de trás do setor 7: um corte de dois metros, um caderninho e dezenove números.'
}

}
},

/* ── II · A NOTA FISCAL (depois do 19) ──────────────────────── */
{
num:19.02, titulo:'A Nota Fiscal', local:'Celadon e o píer da Rota 21', ambiente:'agua', nivelArea:57,
tom:'muito sombrio',
ancora:{local:'celadon', chamada:'No depósito de material de construção, um funcionário que não olha pra ninguém está olhando pra você.'},
entradas:['cr2_o_galpao'],
inicio: d => 'cr2_o_galpao',
cenas:{

cr2_o_galpao:{
  falante:'A Terceira',
  vozes:['N','N','N'],
  texto:[
    'A Terceira te recebe no galpão de material de construção, entre um saco de areia e uma pilha de tijolo. Ned, o funcionário, olha pra você pela primeira vez desde que você conhece ele.',
    '"Você esteve na Estação 4. Eu sei, porque eu sei o nome de todo mundo que entra lá. É pra lá que vai metade do que eu vendo."',
    '"Amanhã sai um lote pelo píer da Rota 21. Com nota. Eu quero alguém meu no barco que saiba ler o que está escrito na nota e o que não está."',
    '"Esse alguém é você."'
  ],
  ef:{flag:'cm_rocket_2', npc:{nome:'A Terceira', opiniao:1, memoria:'Te mandou no barco do lote da Rota 21, pra ler a nota.'},
      registrar:'A Terceira te mandou no barco que leva um lote dela pra Estação 4, com nota fiscal.'},
  escolhas:[
    {texto:'"Por que eu?"', vai:'cr2_por_que'},
    {texto:'Aceitar.', vai:'cr2_o_pier'},
    {texto:'Recusar. Você não carrega lote pra Estação 4.', vai:'cr2_recusou',
     ef:{flag:'cm_rocket_recusou_lote', rep:{eixo:'bom', delta:2, motivo:'Recusou levar lote pra Estação 4'}}}
  ]
},

cr2_por_que:{
  falante:'A Terceira',
  vozes:['P','N','N'],
  texto:[
    '"Por que eu?"',
    '"Porque você ainda pergunta." Ela acende um cigarro e sopra a fumaça pro lado, longe de você. "Quem pergunta lê nota inteira. Quem não pergunta lê só o total."',
    '"E porque eu estou com medo, e eu não posso mandar ninguém que saiba disso."',
    'Ned olha pro chão de novo.'
  ],
  ef:{flag:'cm_rocket_ela_tem_medo'},
  escolhas:[
    {texto:'Aceitar.', vai:'cr2_o_pier'},
    {texto:'Recusar.', vai:'cr2_recusou',
     ef:{flag:'cm_rocket_recusou_lote', rep:{eixo:'bom', delta:2, motivo:'Recusou levar lote pra Estação 4'}}}
  ]
},

cr2_recusou:{
  falante:'A Terceira',
  vozes:['N','N'],
  texto:[
    'Ela não fica brava. Fica cansada, o que é pior de ver.',
    '"Então me faz outro favor: não conta pra ninguém que eu pedi."',
    '"Se alguém da Comissão souber que eu quis ler a nota, eu deixo de ser fornecedora e passo a ser problema."',
    'O Rook te leva até o portão. Na saída, ele te entrega uma folha dobrada.',
    fala('o contato da Terceira', 'A nota de amanhã. Cópia. Ela não sabe que eu tirei.', 'baixo')
  ],
  ef:{flag:'cm_rocket_copia_da_nota', itens:{'Cópia da nota do lote':1},
      npc:{nome:'Rook', opiniao:2, memoria:'Te deu a cópia da nota do lote sem a Terceira saber.'}},
  escolhas:[
    {texto:'Ler a nota.', vai:'cr2_a_nota'}
  ]
},

cr2_o_pier:{
  texto:[
    'O píer da Rota 21 tem luz hoje: o barco é registrado, pintado e tem nome.',
    'Na prancheta do marinheiro, a nota fiscal: QUARENTA UNIDADES — MATERIAL BIOLÓGICO PARA PESQUISA — DESTINO ESTAÇÃO 4.',
    'Quarenta caixas de transporte, de plástico, com respiro. Você conta as caixas. Depois conta o que tem dentro.',
    'Quarenta e três.'
  ],
  ef:{flag:'cm_rocket_43', registrar:'O lote da Terceira pra Estação 4 tinha quarenta e três Pokémon numa nota de quarenta.'},
  escolhas:[
    {texto:'Ler a nota inteira.', vai:'cr2_a_nota'}
  ]
},

cr2_a_nota:{
  texto:[
    'A nota tem três folhas. A terceira é um anexo técnico com a procedência de cada unidade.',
    'Procedência: "captura de manejo". Mas no rodapé, em letra miúda, uma observação que ninguém escreveu pra ser lida: "inclui recolhimento urbano".',
    'Recolhimento urbano. Pokémon de rua. Pokémon de praça. Pokémon com coleira.',
    d => d.flags.cm_rocket_43 ? 'Numa das caixas tem um Meowth com uma coleira de vinil, com um nome bordado à mão: TICO.' : 'Na lista, uma linha diz "felino, adulto, coleira presente".'
  ],
  ef:{flag:'cm_rocket_recolhimento_urbano',
      registrar:'A nota do lote da Terceira esconde "recolhimento urbano": Pokémon de rua e com coleira, vendidos como captura de manejo.'},
  escolhas:[
    {texto:'Fazer a entrega e contar à Terceira o que tem no rodapé.', vai:'cr2_entregou',
     ef:{flag:'cm_rocket_entregou_43', dinheiro:2500, rep:{eixo:'ruim', delta:2, motivo:'Entregou o lote com recolhimento urbano na Estação 4'}}},
    {texto:'Tirar do barco os três que não estão na nota. O Meowth da coleira primeiro.', vai:'cr2_tirou_tres', cond:d => !!d.flags.cm_rocket_43,
     ef:{flag:'cm_rocket_tirou_tres', moral:4, rep:{eixo:'bom', delta:2, motivo:'Tirou do barco os três que não estavam na nota'}}},
    {texto:'Fotografar a nota e levar pra polícia.', vai:'cr2_a_policia',
     ef:{flag:'cm_rocket_foi_a_policia', rep:{eixo:'bom', delta:2, motivo:'Levou a nota do lote à polícia'}}}
  ]
},

cr2_tirou_tres:{
  texto:[
    'Três caixas. Ninguém confere o que não está escrito.',
    'Quem confere é um homem de colete preto, da Estação 4, que chega no píer quando você está tirando a terceira.',
    fala('Segurança da Estação 4', 'Unidade fora de nota é unidade extraviada. Extravio é comigo.'),
    'Ele solta o time dele no píer, de pé no meio das caixas.'
  ],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 0), tipo:'treinador', treinador:'Segurança da Estação 4', fuga:false,
           vitoria:'cr2_salvou', derrota:'cr2_perdeu_os_tres', gameover:'gameover'}
},

cr2_salvou:{
  texto:[
    'As unidades dele caem no píer e ficam esperando ordem. Ele recolhe sem pressa.',
    'Você sai com três caixas de plástico. No Centro de Celadon, a enfermeira lê a coleira do Meowth e liga pra um número de telefone bordado do lado de dentro.',
    'Uma senhora chega de táxi quarenta minutos depois, de chinelo, e não consegue falar nada.'
  ],
  ef:{flag:'cm_rocket_tico_em_casa', rep:{eixo:'bom', delta:2, motivo:'Devolveu o Meowth da coleira pra casa'},
      registrar:'O Meowth TICO voltou pra casa. A dona chegou de chinelo.'},
  escolhas:[
    {texto:'Voltar pro galpão.', vai:'cr2_volta'}
  ]
},

cr2_perdeu_os_tres:{
  texto:[
    'O segurança devolve as três caixas pro barco ele mesmo, com cuidado, e escreve na prancheta: "três unidades reintegradas ao lote".',
    'O barco sai. A coleira do Meowth aparece na luz do convés por um segundo, na última caixa da pilha.'
  ],
  ef:{hp:-2, causa:'O píer da Rota 21'},
  escolhas:[
    {texto:'Voltar pro galpão.', vai:'cr2_volta'}
  ]
},

cr2_a_policia:{
  texto:[
    d => d.flags.ln_rocket_duplo ? 'O policial do café, o do número único, atende no primeiro toque e não diz alô.' : 'Na delegacia de Celadon, o plantonista olha a foto, olha você, e pergunta como você conseguiu.',
    'A nota é verdadeira. O rodapé é verdadeiro. E nada disso é crime, porque "recolhimento urbano" está na licença da Estação 4, numa linha que ninguém leu antes de assinar.',
    'O que é crime é a diferença: três Pokémon que não estão em nota nenhuma.',
    'Só que o barco já saiu.'
  ],
  ef:{registrar:'"Recolhimento urbano" está na licença da Estação 4. O crime é só a diferença entre a nota e o barco.'},
  escolhas:[
    {texto:'Voltar pro galpão.', vai:'cr2_volta'}
  ]
},

cr2_entregou:{
  texto:[
    'O barco sai. Você volta de ônibus, com dois mil e quinhentos no bolso de dentro, e ensaia a frase pro galpão.',
    'Quando você conta à Terceira o que tem no rodapé, ela fica sem fumar por um minuto inteiro.'
  ],
  escolhas:[
    {texto:'Ouvir o que ela vai fazer com isso.', vai:'cr2_volta'}
  ]
},

cr2_volta:{
  falante:'A Terceira',
  vozes:['N','N','N'],
  texto:[
    '"Recolhimento urbano." Ela repete devagar, como quem prova uma comida estragada.',
    '"Eu vendo excedente de manejo. Eu nunca vendi coleira. Eles botaram coleira na minha nota pra que, no dia em que eu falar, a nota diga que eu vendi."',
    '"Eu tenho dois caminhos agora. Eu continuo vendendo e eles continuam me usando. Ou eu paro, e eles mandam a nota pra quem quiser ler."',
    d => d.flags.cm_rocket_tico_em_casa ? 'Ela olha pra você de um jeito diferente. "Você tirou três do barco. Eu soube."' : ''
  ],
  escolhas:[
    {texto:'"Para. Eu seguro a nota com você."', vai:'cr2_fim',
     ef:{flag:'cm_rocket_pediu_pra_parar', rep:{eixo:'bom', delta:2, motivo:'Pediu à Terceira pra parar de vender pra Comissão'},
         npc:{nome:'A Terceira', opiniao:3, memoria:'Você pediu pra ela parar e disse que segurava a nota com ela.'}}},
    {texto:'"Continua. E me põe no lugar do Rook."', vai:'cr2_fim',
     ef:{flag:'cm_rocket_quer_subir', dinheiro:2000, rep:{eixo:'ruim', delta:3, motivo:'Pediu um lugar maior na rede da Terceira'},
         npc:{nome:'Rook', opiniao:-3, memoria:'Você pediu o lugar dele na frente da Terceira.'}}},
    {texto:'Não dizer nada e guardar a cópia da nota.', vai:'cr2_fim',
     ef:{flag:'cm_rocket_guardou_a_nota', rep:{eixo:'ruim', delta:1, motivo:'Guardou a nota pra usar depois'},
         executar:d => { if (!Estado.contaItem('Cópia da nota do lote')) Estado.darItem('Cópia da nota do lote', 1); return []; }}}
  ]
},

cr2_fim:{
  texto:[
    'O galpão fecha às seis. Ned apaga as luzes uma por uma, do fundo pra frente, e não olha pra ninguém de novo.',
    d => d.flags.cm_rocket_quer_subir ? 'Na saída, o Rook está encostado no portão. Ele não diz nada. Ele só fica ali até você passar.' : 'Na saída, o Rook acende o cigarro dele com o da Terceira, que é uma coisa que só se faz com quem se confia.',
    'Rota 21, quarenta e três numa nota de quarenta. A conta não fecha, e alguém conta com isso.'
  ],
  fim:true, resumo:'A nota fiscal: quarenta unidades no papel, quarenta e três no barco e uma coleira bordada TICO.'
}

}
},

/* ── III · A CADEIRA DO PRIMEIRO (depois do 25) ─────────────── */
{
num:25.02, titulo:'A Cadeira do Primeiro', local:'Celadon — o subsolo de carga', ambiente:'cidade', nivelArea:58,
tom:'muito sombrio',
ancora:{local:'celadon', chamada:'O portão azul da rua de serviço está aberto de dia, e de dentro sai cheiro de fumaça de cigarro.'},
entradas:['cr3_o_subsolo'],
inicio: d => 'cr3_o_subsolo',
cenas:{

cr3_o_subsolo:{
  falante:'A Terceira',
  vozes:['N','N','N'],
  texto:[
    'O subsolo de carga liga o shopping, o cassino e o depósito, num mesmo lote, por um erro de planta antigo. A Terceira está sentada numa cadeira de escritório no meio do corredor, sozinha, com uma mala aos pés.',
    '"Depois da audiência de segunda, a Comissão mandou avisar que a minha nota fiscal vai virar prova. Contra mim. Não contra eles."',
    '"Então eu vou embora hoje. E a rede fica. Rede não vai embora, só muda de quem atende o telefone."',
    '"O Giovanni foi o primeiro. Teve um segundo. Eu sou a terceira. Alguém vai ser o quarto até a meia-noite."'
  ],
  ef:{flag:'cm_rocket_3', registrar:'A Terceira vai embora. A rede vai ter um quarto até a meia-noite.'},
  escolhas:[
    {texto:'"Quem?"', vai:'cr3_quem'},
    {texto:'"Eu."', vai:'cr3_eu',
     ef:{rep:{eixo:'ruim', delta:2, motivo:'Se ofereceu pra comandar a rede'}}}
  ]
},

cr3_quem:{
  falante:'A Terceira',
  vozes:['P','N','N','N'],
  texto:[
    '"Quem?"',
    '"O Rook acha que é ele. Ele carregou tudo por quatro anos e nunca pediu nada, e isso é o que faz gente achar que merece."',
    d => d.flags.cm_rocket_quer_subir ? '"E você pediu o lugar dele na frente dele. Ele não esqueceu. Ele não esquece nada que dá pra anotar."' : '"E ele gosta de você. Isso complica, porque ele vai querer você do lado dele, e lado é uma coisa que acaba."',
    '"Eu vou embora às dez. Até lá, é com vocês."'
  ],
  escolhas:[
    {texto:'"Eu."', vai:'cr3_eu',
     ef:{rep:{eixo:'ruim', delta:2, motivo:'Se ofereceu pra comandar a rede'}}},
    {texto:'Procurar o Rook antes que ele procure você.', vai:'cr3_o_rook'}
  ]
},

cr3_eu:{
  falante:'A Terceira',
  vozes:['N','N'],
  texto:[
    'Ela ri, de verdade, pela primeira vez desde que você conhece ela.',
    '"Então vai ter que dizer isso pro Rook. Eu não vou dizer por você. Quem assume rede assume na frente de quem carregou ela."'
  ],
  escolhas:[
    {texto:'Ir até o Rook.', vai:'cr3_o_rook'}
  ]
},

cr3_o_rook:{
  falante:'o contato da Terceira',
  vozes:['N','N','N'],
  texto:[
    'O Rook está no fim do corredor, sentado na caçamba do caminhão de sempre, com o caderninho aberto.',
    '"Quatro anos. Dezenove, dezesseis, quarenta e três. Eu anotei tudo. Tudo que essa rede fez tem número no meu caderno."',
    '"Esse caderno é a rede. Quem tem o caderno atende o telefone."',
    d => d.npcs['Rook'] && d.npcs['Rook'].opiniao >= 2 ? '"Eu queria que fosse você do meu lado. Mas tem que ser um só na cadeira."' : '"Eu não vou entregar o caderno pra quem não carregou nada."'
  ],
  escolhas:[
    {texto:'Lutar pelo caderno.', vai:'cr3_luta'},
    {texto:'Convencer o Rook a entregar o caderno à polícia, junto com você.', vai:'cr3_convencer',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Tentou convencer o Rook a entregar a rede'}}},
    {texto:'Deixar a cadeira pro Rook e pegar a sua parte do caixa.', vai:'cr3_o_caixa',
     ef:{rep:{eixo:'ruim', delta:1, motivo:'Deixou a rede pro Rook e pegou o dinheiro'}}}
  ]
},

cr3_convencer:{
  texto:[
    d => (d.npcs['Rook'] && d.npcs['Rook'].opiniao >= 2) || d.flags.cm_rocket_tres
      ? fala('o contato da Terceira', 'Dezesseis.', 'baixo')
      : fala('o contato da Terceira', 'Polícia. Você acha que eu carreguei quatro anos pra terminar num depoimento.', 'frio'),
    d => (d.npcs['Rook'] && d.npcs['Rook'].opiniao >= 2) || d.flags.cm_rocket_tres
      ? 'Ele fecha o caderno. "Você contou dezesseis na cerca e eu disse dezesseis em Celadon. A gente já mentiu junto uma vez pela coisa certa. Dá pra fazer de novo, do outro lado."'
      : 'Ele guarda o caderno no bolso de dentro e solta a primeira Pokébola na caçamba.'
  ],
  escolhas:[
    {texto:'Ir com ele até a delegacia.', vai:'cr3_final_duplo', cond:d => (d.npcs['Rook'] && d.npcs['Rook'].opiniao >= 2) || !!d.flags.cm_rocket_tres,
     ef:{rep:{eixo:'bom', delta:4, motivo:'Entregou a rede inteira à polícia, com o caderno'}}},
    {texto:'Lutar.', vai:'cr3_luta', cond:d => !((d.npcs['Rook'] && d.npcs['Rook'].opiniao >= 2) || d.flags.cm_rocket_tres)}
  ]
},

cr3_luta:{
  texto:['O Rook desce da caçamba. No corredor de concreto do subsolo, o barulho de cada Pokébola abrindo volta duas vezes.'],
  batalha:{dex:24, nivel:d => nivelDoCaminho(d, 2), tipo:'treinador', treinador:'Rook', fuga:false,
           timeExtra:[{dex:110, nivel:d => nivelDoCaminho(d, 2)}, {dex:42, nivel:d => nivelDoCaminho(d, 3)}, {dex:57, nivel:d => nivelDoCaminho(d, 4)}],
           vitoria:'cr3_o_caderno', derrota:'cr3_perdeu', gameover:'gameover'}
},

cr3_perdeu:{
  texto:[
    'O Rook recolhe o time e sobe na caçamba de novo, com o caderno no bolso.',
    fala('o contato da Terceira', 'Vai embora. Hoje eu sou o quarto. O quarto não precisa de inimigo no primeiro dia.', 'baixo'),
    'Você sai pelo portão azul. Lá fora, Celadon continua comprando.'
  ],
  ef:{flag:'cm_rocket_rook_e_o_quarto', hp:-2, causa:'O subsolo de Celadon'},
  escolhas:[
    {texto:'Ir embora de Celadon.', vai:'cr3_seguir'}
  ]
},

cr3_o_caderno:{
  texto:[
    'O Rook senta no chão do corredor, de costas pra roda do caminhão, e te estende o caderno sem você pedir.',
    fala('o contato da Terceira', 'Quatro anos. Faz o que quiser. Eu vou dormir uma semana.', 'baixo'),
    'O caderno tem capa de plástico azul e quatro anos de números. Data, hora, cerca, barco, nota. Quem vendeu, quem comprou.',
    'É a rede inteira. É também a Comissão inteira, do lado de quem compra.'
  ],
  ef:{flag:'cm_rocket_tem_caderno', itens:{'Caderno azul do Rook':1},
      npc:{nome:'Rook', opiniao:1, memoria:'Perdeu pra você no subsolo e te entregou o caderno.'},
      registrar:'O caderno azul do Rook tem quatro anos da rede e de quem comprava dela.'},
  escolhas:[
    {texto:'Sentar na cadeira. A rede agora atende o seu telefone.', vai:'cr3_final_quarto',
     ef:{rep:{eixo:'ruim', delta:5, motivo:'Assumiu a rede como o quarto'}}},
    {texto:'Levar o caderno à polícia.', vai:'cr3_final_duplo',
     ef:{rep:{eixo:'bom', delta:4, motivo:'Entregou a rede inteira à polícia, com o caderno'}}},
    {texto:'Ainda não. O caderno vai com você pro Planalto.', vai:'cr3_seguir',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Guardou o caderno da rede pra decidir depois'}}}
  ]
},

cr3_o_caixa:{
  texto:[
    'O caixa da rede é uma mala de lona azul no fundo do depósito, com dinheiro dobrado em maços de mil, preso com elástico.',
    'O Rook te deixa contar a sua parte. Você conta.',
    fala('o contato da Terceira', 'Você conta bem. Sempre contou.', 'baixo')
  ],
  ef:{dinheiro:12000},
  escolhas:[
    {texto:'Sumir com a sua parte, hoje, pela porta dos fundos.', vai:'cr3_final_porta',
     ef:{rep:{eixo:'ruim', delta:2, motivo:'Sumiu com a parte do caixa da rede'}}},
    {texto:'Ficar com a sua parte e seguir pro Planalto.', vai:'cr3_seguir',
     ef:{rep:{eixo:'ruim', delta:1, motivo:'Ficou com a parte do caixa da rede'}}}
  ]
},

cr3_seguir:{
  texto:[
    'Às dez, a Terceira sai pelo portão azul com a mala, a pé, e não olha pra trás. Na esquina, ela para e acende um cigarro e aí sim olha, uma vez.',
    'Você pega o ônibus da Liga pro Planalto às oito e quinze do dia seguinte.'
  ],
  ef:{flag:'cm_rocket_seguiu_planalto'},
  fim:true, resumo:'A cadeira do primeiro: uma mala, um caderno azul e um quarto até a meia-noite.'
},

cr3_final_quarto:{
  texto:[
    'O telefone da rede toca às onze e quarenta. É a primeira ligação que você atende.',
    'Do outro lado, uma voz educada, com nota fiscal na voz, pergunta se o fornecimento continua.',
    'Você diz que sim.'
  ],
  final:{id:'rocket_quarto', titulo:'O QUARTO', texto:[
    'O Giovanni foi o primeiro. Teve um segundo, que durou nove meses. A Terceira durou o que durou.',
    'Você dura mais. Você aprendeu com os três: não quer Kanto, não quer ginásio, não quer aparecer. Quer logística.',
    'Em Vermilion, no armário 14, um envelope sem timbre chega todo mês pra alguém que ainda pergunta, e você lê o relatório do que essa pessoa contou.',
    'De vez em quando você pega o caderno azul, já cheio, e lê os números da cerca de trás. Dezenove. Você não lembra mais do choro do filhote. Isso é o que você ganhou.'
  ]}
},

cr3_final_duplo:{
  texto:[
    'A delegacia de Celadon recebe o caderno às onze e cinquenta e cinco.',
    d => d.flags.ln_rocket_duplo ? 'O policial do café, o do número único, lê a primeira página em pé e senta pra ler a segunda.' : 'O plantonista lê a primeira página em pé e senta pra ler a segunda.',
    'O Rook depõe ao seu lado. Ele lê os números do caderno em voz alta, um por um, sem olhar o caderno.'
  ],
  final:{id:'rocket_duplo', titulo:'ATÉ O FIM DO DUPLO', texto:[
    'O caderno azul vira três processos: um contra a rede, um contra a Comissão e um contra você, porque você também contou.',
    'O seu é o menor. O juiz lê o que você fez na cerca de trás e no píer, e as três caixas que saíram do barco.',
    'A rede não tem um quarto. A Comissão perde o fornecedor e a nota fiscal vira prova pro outro lado.',
    'Uma senhora de Celadon, que um dia chegou de táxi de chinelo, manda um cartão pro endereço da delegacia, com uma foto de um Meowth dormindo numa almofada. Atrás: "TICO manda lembrança."'
  ]}
},

cr3_final_porta:{
  texto:[
    'A porta dos fundos do depósito dá pra um beco, e o beco dá pra rodoviária, e a rodoviária dá pra qualquer lugar.',
    'Você compra uma passagem pro lugar mais longe que o guichê vende.'
  ],
  final:{id:'rocket_porta', titulo:'A PORTA DOS FUNDOS', texto:[
    'Você nunca mais volta a Celadon.',
    'O dinheiro dura dois anos, num lugar onde ninguém te conhece e ninguém pergunta, e você aprende a não perguntar também.',
    'Às vezes, numa fila de padaria, um aparelho toca no bolso de alguém, e você para de respirar por um segundo antes de lembrar que não é o seu.',
    'A rede continua sem você. Não fez diferença nenhuma, e você sabe disso, e é a única coisa que você sabe com certeza.'
  ]}
}

}
}
);
