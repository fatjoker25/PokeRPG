/* ============================================================
   CAMINHO DO MERCENÁRIO — quem paga
   Pra quem Kanto passou a ver como alguém que se resolve com dinheiro
   (a via do capítulo 9) na hora do desvio. Quem acompanha: o
   intermediário, de chapéu, que não diz o nome porque nome atrapalha
   negócio.
   ============================================================ */

/* ── I · A ESCOLTA DA CERCA (depois do 12) ─────────────────── */
CAPITULOS.push(
{
num:12.08, titulo:'A Escolta da Cerca', local:'Fuchsia — o setor 7, por dentro', ambiente:'campo', nivelArea:40,
tom:'muito sombrio',
ancora:{local:'fuchsia', chamada:'No banco da rodoviária de Fuchsia tem um chapéu esquecido em cima de um jornal dobrado. Ninguém esquece chapéu de propósito, a não ser ele.'},
entradas:['cm1_o_chapeu'],
inicio: d => 'cm1_o_chapeu',
cenas:{

cm1_o_chapeu:{
  texto:[
    'O intermediário senta do seu lado no banco da rodoviária como se o chapéu sempre tivesse sido dele, e pega o chapéu de volta.',
    fala('o intermediário', 'Dois serviços em Fuchsia, mesma noite, mesmo setor. Um paga quatro mil. O outro, oitocentos.'),
    fala('o intermediário', 'Quatro mil: escoltar uma equipe de manejo com autorização assinada pela reserva. Por dentro da cerca, setor 7. Ninguém vai mexer com eles, mas eles gostam de ter alguém.'),
    fala('o intermediário', 'Oitocentos: escoltar um caminhão de soltura que um velho de sessenta e sete anos quer dirigir pro norte, sem autorização. Ele tem hérnia e não tem dinheiro.', 'baixo')
  ],
  ef:{flag:'cm_merc_1', registrar:'O intermediário te ofereceu dois serviços no setor 7: escoltar o manejo ou escoltar uma soltura sem autorização.'},
  escolhas:[
    {texto:'Pegar o de quatro mil.', vai:'cm1_o_manejo',
     ef:{flag:'cm_merc_manejo', dinheiro:4000, rep:{eixo:'ruim', delta:2, motivo:'Escoltou a equipe de manejo da reserva por dinheiro'}}},
    {texto:'Pegar o de oitocentos.', vai:'cm1_a_soltura',
     ef:{flag:'cm_merc_soltura', dinheiro:800, rep:{eixo:'bom', delta:2, motivo:'Escoltou um caminhão de soltura por quase nada'}}},
    {texto:'"Quem paga os oitocentos?"', vai:'cm1_quem_paga'}
  ]
},

cm1_quem_paga:{
  falante:'o intermediário',
  vozes:['N','N','N'],
  texto:[
    '"Eu." Ele ajeita o chapéu.',
    '"O velho não tem. Eu cobro dele oitocentos e pago oitocentos. Margem zero."',
    '"Não conta pra ninguém. Margem zero estraga a reputação de qualquer um no meu ramo."'
  ],
  ef:{presagio:'Margem zero. Ele disse que não conta pra ninguém, e contou pra você.'},
  escolhas:[
    {texto:'Pegar o de oitocentos.', vai:'cm1_a_soltura',
     ef:{flag:'cm_merc_soltura', dinheiro:800, rep:{eixo:'bom', delta:2, motivo:'Escoltou um caminhão de soltura por quase nada'}}},
    {texto:'Pegar o de quatro mil.', vai:'cm1_o_manejo',
     ef:{flag:'cm_merc_manejo', dinheiro:4000, rep:{eixo:'ruim', delta:2, motivo:'Escoltou a equipe de manejo da reserva por dinheiro'}}}
  ]
},

cm1_o_manejo:{
  texto:[
    'A equipe de manejo são cinco homens de macacão, um caminhão com gaiola e uma lata de querosene na caçamba.',
    'Você anda na frente com o seu time solto. Eles trabalham atrás de você, com rede e lanterna, e não conversam.',
    'No meio da noite, um Nidoking enorme sai do capim e fica entre a equipe e a toca dele. Atrás dele, a fêmea e três filhotes.',
    fala('o chefe do manejo', 'Escolta. É pra isso que a gente paga. Tira ele.')
  ],
  escolhas:[
    {texto:'Lutar com o Nidoking.', vai:'cm1_o_nidoking',
     ef:{rep:{eixo:'ruim', delta:1, motivo:'Lutou com um Nidoking pra equipe de manejo pegar a toca dele'}}},
    {texto:'Dizer que o contrato é escoltar, não caçar, e ficar parad{o|a}.', vai:'cm1_parou',
     ef:{flag:'cm_merc_parou', rep:{eixo:'bom', delta:2, motivo:'Se recusou a tirar um Nidoking da toca pra equipe de manejo'}}}
  ]
},

cm1_o_nidoking:{
  texto:['Ele não recua. Toca de família não se defende recuando.'],
  batalha:{dex:34, nivel:d => nivelDoCaminho(d, -1), tipo:'selvagem', fuga:false,
           vitoria:'cm1_pegaram_a_toca', derrota:'cm1_parou', gameover:'gameover'}
},

cm1_pegaram_a_toca:{
  texto:[
    'O Nidoking cai. A equipe passa por cima dele com a rede antes de você recolher o seu time.',
    'A fêmea e os três filhotes vão pra gaiola do caminhão. O Nidoking fica deitado no capim, porque não cabe na gaiola.',
    fala('o chefe do manejo', 'Bom serviço. A gente chama de novo.')
  ],
  ef:{flag:'cm_merc_toca', registrar:'Você derrubou um Nidoking e a equipe de manejo levou a família dele.'},
  escolhas:[
    {texto:'Receber e ir embora.', vai:'cm1_fim'}
  ]
},

cm1_parou:{
  falante:'o chefe do manejo',
  vozes:['N','N'],
  texto:[
    'O chefe da equipe olha pra você, olha pro Nidoking, e faz a conta de quanto custa brigar com os dois.',
    '"Então tá. O contrato é escoltar. Escolta a gente de volta pro portão, que aqui hoje não dá."',
    'Ele pede o dinheiro de volta pelo rádio ao intermediário. O intermediário não devolve. Diz que serviço feito é serviço pago, e que a noite foi longa pra todo mundo.'
  ],
  ef:{npc:{nome:'o intermediário', opiniao:1, memoria:'Ficou do seu lado quando você se recusou a caçar.'}},
  escolhas:[
    {texto:'Ir embora.', vai:'cm1_fim'}
  ]
},

cm1_a_soltura:{
  texto:[
    d => d.npcs['Sr. Zane'] ? 'O velho do caminhão é o Sr. Zane, que dirigiu soltura por nove anos e tem hérnia, e que te reconhece de longe.' : 'O velho do caminhão tem sessenta e sete anos, hérnia e uma carteira de motorista categoria C dentro de um saquinho plástico.',
    'O caminhão de soltura sai pelo portão do setor 7 às duas da manhã, com doze Pokémon de manejo na gaiola de trás. Pro norte, pra Rota 14, onde tem mato.',
    'No meio da estrada de serviço, dois motoqueiros de colete preto aparecem de farol alto e fecham a passagem.',
    fala('Motoqueiro da escolta', 'Caminhão da reserva sem autorização é roubo. Volta.')
  ],
  escolhas:[
    {texto:'Descer e lutar pela passagem.', vai:'cm1_luta_soltura'}
  ]
},

cm1_luta_soltura:{
  texto:['O seu contrato é escoltar. Escoltar, às vezes, é isso.'],
  batalha:{dex:110, nivel:d => nivelDoCaminho(d, -2), tipo:'treinador', treinador:'Motoqueiro da escolta', fuga:false,
           timeExtra:[{dex:89, nivel:d => nivelDoCaminho(d, -1)}],
           vitoria:'cm1_soltou', derrota:'cm1_voltou', gameover:'gameover'}
},

cm1_soltou:{
  texto:[
    'Os motoqueiros recolhem e vão embora fazendo barulho, pra parecer que ganharam.',
    'Na Rota 14, de madrugada, o velho abre a gaiola. Doze Pokémon saem no mato escuro. Um Exeggcute fica, e dorme na roda do caminhão.',
    d => d.npcs['Sr. Zane'] ? fala('Sr. Zane', 'Nove anos eu fiz isso. Achei que nunca mais ia fazer.', 'baixo') : fala('o velho do caminhão', 'Nove anos eu fiz isso. Achei que nunca mais ia fazer.', 'baixo')
  ],
  ef:{flag:'cm_merc_soltou_doze', rep:{eixo:'bom', delta:2, motivo:'Fez a soltura de doze Pokémon de manejo na Rota 14'}},
  escolhas:[
    {texto:'Ir embora.', vai:'cm1_fim'}
  ]
},

cm1_voltou:{
  texto:[
    'O caminhão volta pro setor 7. O velho dirige devagar, sem dizer nada. A gaiola de trás bate a cada buraco.',
    'Você paga do seu bolso os oitocentos de volta pro intermediário, porque não fez o serviço.',
    fala('o intermediário', 'Não precisava. Mas eu aceito, porque recusar é ofensa.', 'baixo')
  ],
  ef:{dinheiro:-800, hp:-2, causa:'A estrada de serviço do setor 7'},
  escolhas:[
    {texto:'Ir embora.', vai:'cm1_fim'}
  ]
},

cm1_fim:{
  texto:[
    fala('o intermediário', 'Todo serviço tem um preço que se paga e um preço que se cobra. Você está aprendendo a diferença.'),
    d => d.flags.cm_merc_toca ? 'No capim do setor 7, um Nidoking fica deitado na frente de uma toca vazia até o sol nascer.' : 'Na estrada de serviço, de manhã, ficam marcas de pneu indo e voltando.',
    'O chapéu dele fica no banco da rodoviária. De propósito, você acha.'
  ],
  fim:true, resumo:'A escolta da cerca: quatro mil ou oitocentos, um Nidoking na frente da toca e um velho com hérnia.'
}

}
},

/* ── II · O CONTRATO DA ESTAÇÃO (depois do 19) ──────────────── */
{
num:19.08, titulo:'O Contrato da Estação', local:'Estação 4 — a cerca de três metros', ambiente:'campo', nivelArea:56,
tom:'muito sombrio',
ancora:{local:'rota21', chamada:'Na portaria da Estação 4, um colete preto do seu tamanho está pendurado num prego, com um crachá de PROVISÓRIO preso nele.'},
entradas:['cm2_o_colete'],
inicio: d => 'cm2_o_colete',
cenas:{

cm2_o_colete:{
  texto:[
    fala('o intermediário', 'A segurança da Estação 4 contratou por fora. Uma semana. Ronda de noite, cerca e alojamento. Paga seis mil, metade adiantado.'),
    fala('o intermediário', 'Você já esteve lá dentro. Eles sabem. Eles acham isso uma vantagem.', 'baixo'),
    'O colete preto tem o cheiro de quem usou antes. O crachá diz PROVISÓRIO, e embaixo, à caneta, o seu primeiro nome.'
  ],
  ef:{flag:'cm_merc_2', dinheiro:3000, rep:{eixo:'ruim', delta:1, motivo:'Aceitou uma semana de segurança na Estação 4'},
      registrar:'Aceitou uma semana de ronda noturna na segurança da Estação 4.'},
  escolhas:[
    {texto:'Fazer a primeira ronda.', vai:'cm2_a_ronda'}
  ]
},

cm2_a_ronda:{
  texto:[
    'A ronda da cerca leva duas horas a pé. Lanterna, rádio e um caderno de ocorrência que ninguém lê.',
    'Na terceira noite, às três da manhã, perto do bloco do alojamento, um vulto de macacão azul passa a mochila por cima da cerca e começa a subir atrás.',
    'É uma moça de uns vinte anos. Ela te vê. Ela não para de subir.',
    'No rádio, a voz do chefe de turno: "Alguma coisa no setor do alojamento?"'
  ],
  escolhas:[
    {texto:'"Nada." E olhar pro outro lado.', vai:'cm2_deixou',
     ef:{flag:'cm_merc_deixou', rep:{eixo:'bom', delta:2, motivo:'Deixou uma trabalhadora fugir da Estação 4'}}},
    {texto:'Puxar ela da cerca e levar pro chefe de turno.', vai:'cm2_entregou',
     ef:{flag:'cm_merc_entregou', dinheiro:1000, rep:{eixo:'ruim', delta:3, motivo:'Devolveu uma trabalhadora que fugia da Estação 4'}}},
    {texto:'Cobrar dela pra deixar passar.', vai:'cm2_cobrou',
     ef:{flag:'cm_merc_cobrou', rep:{eixo:'ruim', delta:2, motivo:'Cobrou de quem fugia da Estação 4 pra deixar passar'}}}
  ]
},

cm2_cobrou:{
  texto:[
    'Ela tem cento e vinte pokedólares no bolso do macacão, o salário do mês depois do alojamento.',
    'Ela te dá os cento e vinte sem discutir, porque não tem tempo pra discutir, e pula pro lado de fora.',
    'Cento e vinte. Você conta. Não muda nada no seu bolso. Muda alguma coisa em outro lugar.'
  ],
  ef:{dinheiro:120},
  escolhas:[
    {texto:'Continuar a ronda.', vai:'cm2_o_chefe'}
  ]
},

cm2_entregou:{
  texto:[
    'Ela não briga. Ela desce da cerca e espera, de cabeça baixa, como se já soubesse.',
    'O chefe de turno anota no caderno de ocorrência: "tentativa de abandono de posto, contida". Ele te dá um tapinha no ombro.',
    'No dia seguinte, ela está de novo na fila do turno, de macacão azul, e não olha pra você.'
  ],
  ef:{registrar:'Você devolveu ao alojamento uma trabalhadora que fugia da Estação 4.'},
  escolhas:[
    {texto:'Terminar a semana.', vai:'cm2_fim'}
  ]
},

cm2_deixou:{
  texto:[
    'Você vira a lanterna pro lado do galpão e conta até trinta.',
    'Quando vira de volta, a cerca está vazia, e tem um pedaço de pano azul preso no arame de cima.',
    '"Nada", você diz no rádio. "Só vento."'
  ],
  escolhas:[
    {texto:'Continuar a ronda.', vai:'cm2_o_chefe'}
  ]
},

cm2_o_chefe:{
  texto:[
    'De manhã, o chefe de turno conta o alojamento e falta uma. Ele olha o caderno de ocorrência e olha o pano azul no arame.',
    fala('Segurança da Estação 4', 'Vento não rasga macacão.'),
    fala('Segurança da Estação 4', 'Provisório que deixa sair não fica provisório. Fica de fora. Mas antes, eu quero ver se você vale o que eles iam te pagar.', 'frio')
  ],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 1), tipo:'treinador', treinador:'Segurança da Estação 4', fuga:false,
           vitoria:'cm2_saiu_pago', derrota:'cm2_saiu_sem', gameover:'gameover'}
},

cm2_saiu_pago:{
  texto:[
    'As unidades dele caem e ficam esperando. Ele recolhe e tira o crachá de PROVISÓRIO do seu colete, ele mesmo.',
    fala('Segurança da Estação 4', 'Leva a metade que você já recebeu. A outra metade fica com quem vai ter que explicar o pano azul.'),
    'Na saída, você vê ele arrancar o pano do arame e guardar no bolso, em vez de jogar fora.'
  ],
  ef:{flag:'cm_merc_saiu_com_a_metade'},
  escolhas:[
    {texto:'Ir embora.', vai:'cm2_fim'}
  ]
},

cm2_saiu_sem:{
  texto:[
    'Você perde. Ele tira o colete de você, não só o crachá.',
    fala('Segurança da Estação 4', 'O adiantamento fica de multa. Contrato é contrato.'),
    'Você sai a pé pela estrada da Rota 21, sem colete e sem os três mil.'
  ],
  ef:{dinheiro:-3000, hp:-2, causa:'A portaria da Estação 4'},
  escolhas:[
    {texto:'Ir embora.', vai:'cm2_fim'}
  ]
},

cm2_fim:{
  texto:[
    fala('o intermediário', 'Uma semana que durou três noites. Acontece.'),
    d => d.flags.cm_merc_entregou ? fala('o intermediário', 'Eles gostaram de você. Vão chamar de novo. Isso é bom pro negócio, e eu não vou fingir que acho bom pra você.', 'baixo') : fala('o intermediário', 'Eles não vão chamar de novo. Isso é ruim pro negócio, e eu não vou fingir que acho ruim.', 'baixo'),
    'Na Rota 21, numa vila de pescadores, alguém de macacão azul rasgado bate numa porta às seis da manhã.'
  ],
  fim:true, resumo:'O contrato da estação: um colete de segunda mão, um crachá provisório e um pano azul no arame.'
}

}
},

/* ── III · O ÚLTIMO PREÇO (depois do 25) ────────────────────── */
{
num:25.08, titulo:'O Último Preço', local:'Vermilion — o bar do cais', ambiente:'agua', nivelArea:58,
tom:'muito sombrio',
ancora:{local:'vermilion', chamada:'No bar do cais de Vermilion, numa mesa do fundo, tem dois copos servidos e duas cadeiras vazias, uma de cada lado.'},
entradas:['cm3_as_duas_mesas'],
inicio: d => 'cm3_as_duas_mesas',
cenas:{

cm3_as_duas_mesas:{
  texto:[
    'O bar do cais de Vermilion cheira a sal e a óleo de motor. O intermediário está no balcão, de chapéu, sem beber.',
    fala('o intermediário', 'Depois da audiência de segunda, todo mundo quer alguém como você. Duas ofertas, mesma noite. Eu só trouxe. Eu não recomendo.'),
    fala('o intermediário', 'Na mesa da esquerda, um advogado de terno cinza claro. Na da direita, uma mulher que fuma e não quer ser vista. Os dois sabem que o outro está aqui.', 'baixo')
  ],
  ef:{flag:'cm_merc_3', registrar:'No bar do cais de Vermilion, a Comissão e a Terceira fizeram oferta pelo mesmo serviço.'},
  escolhas:[
    {texto:'Sentar na mesa da esquerda.', vai:'cm3_a_esquerda'},
    {texto:'Sentar na mesa da direita.', vai:'cm3_a_direita'}
  ]
},

cm3_a_esquerda:{
  falante:'Dr. Bramble',
  vozes:['N','N','N'],
  texto:[
    '"Existe uma testemunha da audiência de segunda que pretende depor de novo, com documentos. Uma funcionária de cartório de Saffron."',
    '"A Comissão pagaria quarenta mil pra que ela estivesse viajando, de férias, na data do depoimento. Férias longas. Pagas por nós. Ninguém se machuca."',
    '"Só uma viagem. É a coisa mais limpa que eu já pedi a alguém."'
  ],
  escolhas:[
    {texto:'Ouvir a outra mesa antes.', vai:'cm3_a_direita'},
    {texto:'Aceitar os quarenta mil.', vai:'cm3_aceitou_bramble',
     ef:{flag:'cm_merc_bramble', dinheiro:20000, rep:{eixo:'ruim', delta:4, motivo:'Aceitou da Comissão o serviço de sumir com uma testemunha'}}}
  ]
},

cm3_a_direita:{
  falante:'A Terceira',
  vozes:['N','N','N'],
  texto:[
    'A Terceira sopra a fumaça pro lado, longe do seu rosto.',
    '"A mesma testemunha. Eu pago oito mil pra que ela chegue viva e no horário ao depoimento. Com escolta. Com você."',
    '"Não é bondade. Se ela depõe, a Comissão cai, e a Comissão é a minha coleira. Oito mil é o que eu tenho. Eles têm quarenta. Eu sei."'
  ],
  escolhas:[
    {texto:'Ouvir a outra mesa antes.', vai:'cm3_a_esquerda'},
    {texto:'Aceitar os oito mil e escoltar a testemunha.', vai:'cm3_escolta',
     ef:{flag:'cm_merc_terceira', dinheiro:4000, rep:{eixo:'bom', delta:2, motivo:'Aceitou escoltar a testemunha da audiência'}}},
    {texto:'Aceitar as duas ofertas.', vai:'cm3_as_duas',
     ef:{flag:'cm_merc_as_duas', dinheiro:24000, rep:{eixo:'ruim', delta:3, motivo:'Aceitou dinheiro dos dois lados pelo mesmo serviço'}}}
  ]
},

cm3_aceitou_bramble:{
  texto:[
    'O Dr. Bramble te dá metade num envelope e um endereço num cartão: a funcionária de cartório mora em cima de uma papelaria, em Saffron.',
    'No balcão, o intermediário tira o chapéu e põe na mesa. É a primeira vez que você vê a cabeça dele: careca, com uma cicatriz antiga.',
    fala('o intermediário', 'Todo mundo tem preço. Eu achava que o seu era diferente.', 'baixo')
  ],
  ef:{npc:{nome:'o intermediário', opiniao:-3, memoria:'Você aceitou os quarenta mil da Comissão pela testemunha.'}},
  escolhas:[
    {texto:'Ir até a papelaria e fazer o serviço.', vai:'cm3_final_preco'},
    {texto:'Ir até a papelaria e contar tudo pra ela.', vai:'cm3_escolta',
     ef:{flag:'cm_merc_virou', rep:{eixo:'bom', delta:3, motivo:'Pegou o dinheiro da Comissão e avisou a testemunha'}}}
  ]
},

cm3_as_duas:{
  texto:[
    'Dois envelopes. Um de cada mesa. O intermediário vê você recebendo os dois e não diz nada.',
    'Agora você tem dinheiro pra sumir com a testemunha e pra protegê-la, e só dá pra fazer uma coisa.',
    'Ou nenhuma.'
  ],
  escolhas:[
    {texto:'Proteger a testemunha.', vai:'cm3_escolta'},
    {texto:'Não fazer nenhuma das duas e sumir com os dois envelopes.', vai:'cm3_final_calote',
     ef:{rep:{eixo:'ruim', delta:3, motivo:'Deu calote nos dois lados e sumiu'}}}
  ]
},

cm3_escolta:{
  texto:[
    'A funcionária de cartório chama Edith, tem cinquenta anos e um Bellsprout num vaso na janela. Ela não pergunta quem te mandou. Ela pega a bolsa.',
    'Às oito da manhã do depoimento, na esquina do fórum de Saffron, um carro cinza fecha a calçada.',
    d => d.flags.cm_merc_virou ? 'Quem desce é o Dr. Bramble, sem terno, de casaco. Ele não esperava ver você do lado errado da calçada.' : 'Quem desce são dois homens de colete preto.'
  ],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 3), tipo:'treinador', treinador:'Segurança da Estação 4', fuga:false,
           timeExtra:[{dex:94, nivel:d => nivelDoCaminho(d, 3)}],
           vitoria:'cm3_chegou', derrota:'cm3_atrasou', gameover:'gameover'}
},

cm3_chegou:{
  texto:[
    'Às oito e cinquenta e nove, a Edith entra no fórum com a bolsa debaixo do braço.',
    'Ela depõe por três horas. Você espera no banco do corredor, do lado do bebedouro.',
    'Quando ela sai, ela te dá a mão, e na mão tem uma muda de Bellsprout num copinho plástico.'
  ],
  ef:{flag:'cm_merc_iris_depos', rep:{eixo:'bom', delta:3, motivo:'Levou a testemunha viva e no horário ao depoimento'},
      npc:{nome:'Edith', opiniao:6, memoria:'Você levou ela ao depoimento, e ela te deu uma muda de Bellsprout.'}},
  escolhas:[
    {texto:'Decidir o que fazer com o que sobrou.', vai:'cm3_depois'}
  ]
},

cm3_atrasou:{
  texto:[
    'Ela chega às nove e quarenta. O depoimento foi remarcado pra daqui a dois meses, "por ausência da testemunha".',
    'A Edith senta no banco do corredor com a bolsa no colo e não chora.',
    'Ela diz que volta em dois meses. Ela diz isso como quem já sabe que vão tentar de novo.'
  ],
  ef:{flag:'cm_merc_iris_remarcou', hp:-2, causa:'A esquina do fórum de Saffron'},
  escolhas:[
    {texto:'Decidir o que fazer com o que sobrou.', vai:'cm3_depois'}
  ]
},

cm3_depois:{
  texto:[
    'No bar do cais, de noite, o intermediário te espera no balcão. O chapéu está em cima do balcão, não na cabeça.',
    fala('o intermediário', 'Fim de serviço. Você me deve a comissão de praxe. Dez por cento.'),
    fala('o intermediário', 'Ou você pode não pagar, e a gente fica quite de outro jeito.', 'baixo')
  ],
  escolhas:[
    {texto:'Pagar os dez por cento e devolver o resto à Terceira. Você fez de graça.', vai:'cm3_final_graca',
     ef:{rep:{eixo:'bom', delta:3, motivo:'Fez o último serviço de graça'}}},
    {texto:'Pagar os dez por cento e seguir pro Planalto.', vai:'cm3_seguir',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Fechou o serviço da testemunha e seguiu viagem'}}}
  ]
},

cm3_seguir:{
  texto:[
    fala('o intermediário', 'Vai. Se precisar de mim, deixa um chapéu num banco de rodoviária. Eu acho.', 'riso'),
    'O ônibus da Liga pro Planalto sai às oito e quinze, de Vermilion.'
  ],
  ef:{flag:'cm_merc_seguiu'},
  fim:true, resumo:'O último preço: duas mesas, dois envelopes e uma funcionária de cartório com um Bellsprout na janela.'
},

cm3_final_preco:{
  texto:[
    'A Edith viaja. Férias longas, pagas, numa ilha do sul. Ninguém se machuca. O depoimento é arquivado.',
    'Os outros vinte mil chegam numa terça, sem envelope: direto na sua conta, com a descrição "consultoria".'
  ],
  final:{id:'merc_preco', titulo:'O PREÇO', texto:[
    'Você descobre o seu preço. É quarenta mil, e é limpo, e ninguém se machucou. É isso que você se repete.',
    'A Comissão te chama mais seis vezes em dois anos. Sempre limpo. Sempre ninguém se machuca.',
    'O intermediário nunca mais senta do seu lado em banco nenhum.',
    'Às vezes você passa por uma papelaria de Saffron e tem um vaso vazio na janela de cima. Você não sabe se ela voltou. Você nunca pergunta.'
  ]}
},

cm3_final_calote:{
  texto:[
    'Você sai do bar pela porta da cozinha, com dois envelopes no bolso de dentro, e pega o primeiro barco que sai do cais.',
    'Os dois lados descobrem no mesmo dia. É a única coisa em que eles concordam a vida inteira.'
  ],
  final:{id:'merc_calote', titulo:'CALOTE', texto:[
    'Vinte e quatro mil, num barco pro sul, com dois lados de Kanto querendo o seu nome.',
    'Você vive bem por um tempo e mal por muito tempo, olhando por cima do ombro em todo porto.',
    'A Edith depõe sozinha, sem escolta, de ônibus, com a bolsa debaixo do braço. Chega às oito e cinquenta e oito.',
    'Você lê isso num jornal velho, numa praia, e é a primeira coisa que te faz rir em meses: ela não precisava de você. Nunca precisou.'
  ]}
},

cm3_final_graca:{
  texto:[
    'O envelope da Terceira volta pra ela pelo Rook, inteiro, menos os dez por cento do intermediário.',
    d => d.flags.cm_merc_virou ? 'O envelope do Dr. Bramble você manda pra sede da Comissão, inteiro, com um recibo: "Serviço não prestado."' : 'Você fica sem nada no bolso, e com uma muda de Bellsprout num copinho plástico.'
  ],
  final:{id:'merc_graca', titulo:'DE GRAÇA', texto:[
    'O intermediário pega os dez por cento, conta, e devolve.',
    'Ele diz que é a primeira vez em trinta anos que ele vê alguém trabalhar de graça no ramo, e que comissão sobre zero é zero.',
    'Você larga o ramo. Ele também, um ano depois, e te manda um cartão de uma cidade pequena sem dizer o nome dela, assinado só com um desenho de chapéu.',
    'A muda de Bellsprout vira um Weepinbell na janela da sua casa nova. Você não sabe onde você aprendeu a cuidar de planta. Aprendeu.'
  ]}
}

}
}
);
