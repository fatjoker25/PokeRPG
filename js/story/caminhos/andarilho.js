/* ============================================================
   CAMINHO DO ANDARILHO — sem lado nenhum
   Pra quem não tem posto nem via e anda Kanto por andar (menos de 4
   insígnias na hora do desvio). Quem acompanha: a Tamsin Reed, que
   anda Kanto há vinte anos com um mapa feito à mão, errado em lugares
   onde ninguém mais anda.
   ============================================================ */

/* ── I · O MAPA ERRADO (depois do 12) ──────────────────────── */
CAPITULOS.push(
{
num:12.10, titulo:'O Mapa Errado', local:'Rota 14 — fora da trilha', ambiente:'floresta', nivelArea:38,
tom:'inquieto',
ancora:{local:'rota13', chamada:'Na beira da Rota 14 tem uma mulher sentada numa pedra, desenhando num papel enorme dobrado em dezesseis, e apagando.'},
entradas:['ca1_a_pedra'],
inicio: d => 'ca1_a_pedra',
cenas:{

ca1_a_pedra:{
  texto:[
    'A mulher da pedra tem uns cinquenta anos, bota de lona remendada três vezes e um mapa de Kanto feito à mão, dobrado em dezesseis, com borracha em cima.',
    d => { Nomes.apresentar('a mulher do mapa'); return 'Na capa do caderno de desenho dela, a lápis: TAMSIN REED — MAPA 7.'; },
    fala('a mulher do mapa', 'Esse é o sétimo. Os outros seis estavam errados. Esse também está, mas eu ainda não sei onde.'),
    fala('a mulher do mapa', 'Tem um vale aqui atrás que não está em mapa nenhum da Liga. Nem no meu. Eu ouvi ele de noite, de longe. Quer ir ver?')
  ],
  ef:{flag:'cm_andarilho_1', registrar:'Conheceu Tamsin Reed, que faz mapas de Kanto à mão e está no sétimo.'},
  escolhas:[
    {texto:'Ir com ela.', vai:'ca1_fora_da_trilha'},
    {texto:'"Ouviu um vale?"', vai:'ca1_ouviu'}
  ]
},

ca1_ouviu:{
  falante:'a mulher do mapa',
  vozes:['P','N','N'],
  texto:[
    '"Ouviu um vale?"',
    '"Vale tem som. Água descendo, vento parando, Pokémon que não tem medo de gente porque nunca viu gente."',
    '"Esse aqui tem um som que eu nunca ouvi em Kanto. Parece canto. Quer ir ou quer ficar na estrada?"'
  ],
  escolhas:[
    {texto:'Ir com ela.', vai:'ca1_fora_da_trilha'}
  ]
},

ca1_fora_da_trilha:{
  texto:[
    'Fora da trilha, Kanto é outro lugar. Não tem placa, não tem lixo, não tem marca de pneu.',
    'A Tamsin anda olhando pro chão e pro céu ao mesmo tempo, e anota tudo: uma pedra virada, uma pena de Spearow, um galho quebrado na altura do joelho.',
    'No meio da tarde, o mato se abre num barranco, e embaixo do barranco tem um vale.'
  ],
  teste:{status:'percepcao', dificuldade:5, nomeStatus:'Percepção',
         critico:'ca1_o_vale', sucesso:'ca1_o_vale', parcial:'ca1_a_descida', falha:'ca1_a_descida'}
},

ca1_a_descida:{
  texto:[
    'Você escorrega na descida e rola os últimos metros do barranco, até um capim alto e macio.',
    'Quando levanta, tem uma dúzia de Bellsprout olhando pra você, sem medo nenhum, curiosos.',
    fala('a mulher do mapa', 'Viu? Nunca viram gente.', 'riso')
  ],
  ef:{hp:-1, causa:'O barranco da Rota 14'},
  escolhas:[
    {texto:'Olhar o vale.', vai:'ca1_o_vale'}
  ]
},

ca1_o_vale:{
  texto:[
    'O vale tem um riacho, capim alto, e Pokémon. Muitos. Bellsprout, Oddish, Venonat, um bando de Doduo dormindo de pé, e lá no fundo, perto da água, uma família de Nidorina.',
    'O som que a Tamsin ouviu é um bando de Jigglypuff cantando na beira do riacho, ao entardecer, todos juntos. Os Pokémon do vale dormem ouvindo.',
    'Não tem cerca. Não tem manejo. Não tem ninguém.',
    fala('a mulher do mapa', 'Isso aqui está fora da reserva. Fora de tudo. A planilha do manejo não sabe que isso existe.', 'baixo')
  ],
  ef:{flag:'cm_andarilho_o_vale', registrar:'Fora da trilha da Rota 14 tem um vale sem mapa, cheio de Pokémon que nunca viram gente.'},
  escolhas:[
    {texto:'Ficar até a noite, ouvindo.', vai:'ca1_a_noite',
     ef:{moral:4, rep:{eixo:'bom', delta:1, motivo:'Passou a noite no vale sem mapa sem incomodar ninguém'}}},
    {texto:'Chegar perto da família de Nidorina.', vai:'ca1_a_guardia'}
  ]
},

ca1_a_guardia:{
  texto:[
    'Você chega perto demais. Do capim, sem barulho, sai um Nidoking com uma cicatriz no chifre, velho, devagar.',
    'Ele não ataca. Ele fica entre você e a família e espera você decidir.'
  ],
  escolhas:[
    {texto:'Recuar devagar.', vai:'ca1_a_noite',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Recuou diante do Nidoking do vale'}}},
    {texto:'Testar o Nidoking.', vai:'ca1_luta'}
  ]
},

ca1_luta:{
  texto:['O Nidoking velho abaixa o chifre. Ele já fez isso muitas vezes.'],
  batalha:{dex:34, nivel:d => nivelDoCaminho(d, 0), tipo:'selvagem', fuga:true,
           vitoria:'ca1_venceu_o_velho', derrota:'ca1_a_noite', gameover:'gameover'}
},

ca1_venceu_o_velho:{
  texto:[
    'O Nidoking cai de lado no capim. A família dele não foge: ela vem e fica em volta dele.',
    'A Tamsin não diz nada. Ela risca alguma coisa no caderno com força.',
    fala('a mulher do mapa', 'Você ganhou de um velho que defendia a família. Parabéns. Agora ele sabe que gente existe.', 'frio')
  ],
  ef:{flag:'cm_andarilho_bateu_no_velho', rep:{eixo:'ruim', delta:2, motivo:'Derrubou o Nidoking velho que guardava o vale'},
      npc:{nome:'Tamsin Reed', opiniao:-2, memoria:'Você derrubou o Nidoking velho do vale.'}},
  escolhas:[
    {texto:'Ficar até a noite.', vai:'ca1_a_noite'}
  ]
},

ca1_a_noite:{
  texto:[
    'De noite, os Jigglypuff cantam de novo. A Tamsin deita no capim de olho aberto.',
    fala('a mulher do mapa', 'Agora vem a pergunta que eu me faço em todo lugar desses. Eu ponho no mapa ou não ponho?'),
    fala('a mulher do mapa', 'Se eu ponho, vem gente. Treinador, turista, manejo. Se eu não ponho, eu sou a única que sabe, e quem guarda segredo sozinha também decide por todo mundo.', 'baixo')
  ],
  escolhas:[
    {texto:'"Não põe. Deixa ele sem nome."', vai:'ca1_fim',
     ef:{flag:'cm_andarilho_sem_mapa', rep:{eixo:'bom', delta:1, motivo:'Pediu pra deixar o vale fora do mapa'},
         npc:{nome:'Tamsin Reed', opiniao:3, memoria:'Você pediu pra ela não pôr o vale no mapa.'}}},
    {texto:'"Põe, mas com o nome errado, longe daqui."', vai:'ca1_fim',
     ef:{flag:'cm_andarilho_mapa_errado', rep:{eixo:'bom', delta:1, motivo:'Inventou um mapa errado pra proteger o vale'},
         npc:{nome:'Tamsin Reed', opiniao:4, memoria:'Você inventou de pôr o vale no mapa no lugar errado. Ela riu a noite inteira.'}}},
    {texto:'"Me vende o lugar. Eu sei quem paga por um vale assim."', vai:'ca1_fim',
     ef:{flag:'cm_andarilho_vendeu', dinheiro:1500, rep:{eixo:'ruim', delta:3, motivo:'Comprou a localização do vale sem mapa pra revender'},
         npc:{nome:'Tamsin Reed', opiniao:-5, memoria:'Você quis comprar a localização do vale pra revender.'}}}
  ]
},

ca1_fim:{
  texto:[
    d => d.flags.cm_andarilho_vendeu ? 'Ela te dá o lugar, num papel arrancado do caderno, e vai embora antes do sol nascer, sem se despedir.' : d.flags.cm_andarilho_mapa_errado ? 'No mapa 7, a lápis, a quarenta quilômetros de onde vocês estão, aparece um vale pequeno com o nome VALE DO CANTO. Ele não existe ali. Ele existe aqui.' : 'No mapa 7, a lápis, no lugar onde vocês estão, não tem nada. Branco. Do jeito que ela quer.',
    'De manhã, o barranco tem a sua marca de bota, subindo. Em três chuvas some.'
  ],
  fim:true, resumo:'O mapa errado: um vale fora de tudo, um bando de Jigglypuff cantando e uma pergunta sem resposta.'
}

}
},

/* ── II · AS TRÊS FOGUEIRAS (depois do 19) ──────────────────── */
{
num:19.10, titulo:'As Três Fogueiras', local:'Rota 21 — a praia de pedra', ambiente:'agua', nivelArea:54,
tom:'inquieto',
ancora:{local:'rota21', chamada:'Na praia de pedra da Rota 21, de noite, tem três fogueiras acesas a cem metros uma da outra.'},
entradas:['ca2_a_praia'],
inicio: d => 'ca2_a_praia',
cenas:{

ca2_a_praia:{
  texto:[
    'Na praia de pedra da Rota 21, de noite, tem três fogueiras, cada uma com alguém sentado do lado.',
    d => { if (d.npcs['Tamsin Reed']) return fala('a mulher do mapa', 'Em praia de andarilho, a regra é antiga: quem chega senta em uma fogueira, ouve uma história e conta outra. Três fogueiras, três histórias.');
           Nomes.apresentar('a mulher do mapa'); return 'Numa pedra entre as fogueiras, uma mulher de cinquenta anos com um mapa dobrado em dezesseis no colo acena pra você. TAMSIN REED, a lápis, na capa do caderno dela.'; },
    'Na primeira, um velho de chapéu de palha. Na segunda, uma moça de macacão azul rasgado. Na terceira, um menino de dez anos com um Magikarp num balde.'
  ],
  ef:{flag:'cm_andarilho_2', registrar:'Três fogueiras na praia de pedra da Rota 21.'},
  escolhas:[
    {texto:'Sentar na fogueira do velho.', vai:'ca2_o_velho'},
    {texto:'Sentar na fogueira da moça de macacão.', vai:'ca2_a_moca'},
    {texto:'Sentar na fogueira do menino.', vai:'ca2_o_menino'}
  ]
},

ca2_o_velho:{
  falante:'o velho da primeira fogueira',
  vozes:['N','N','N'],
  texto:[
    'O velho foi treinador da Liga há quarenta anos. Ele tem um Machamp de pelo branco de tão velho, dormindo na areia.',
    '"Eu ganhei sete insígnias e perdi a oitava três vezes. Depois eu parei de contar insígnia e comecei a contar praia."',
    '"Essa é a praia trezentos e doze. Quer saber se o velho ainda luta? Luta. Não ganha, mas luta."'
  ],
  escolhas:[
    {texto:'Lutar com ele, por respeito.', vai:'ca2_luta_velho'},
    {texto:'Ouvir a história e contar a sua.', vai:'ca2_volta',
     ef:{flag:'cm_andarilho_velho', rep:{eixo:'bom', delta:1, motivo:'Ouviu a história do velho da primeira fogueira'}}}
  ]
},

ca2_luta_velho:{
  texto:['O Machamp acorda devagar, estala as quatro mãos e fica de pé na areia como quem lembra de outra época.'],
  batalha:{dex:68, nivel:d => nivelDoCaminho(d, 1), tipo:'treinador', treinador:'o velho da primeira fogueira', fuga:false,
           timeExtra:[{dex:76, nivel:d => nivelDoCaminho(d, 0)}],
           vitoria:'ca2_venceu_o_velho', derrota:'ca2_perdeu_pro_velho', gameover:'gameover'}
},

ca2_venceu_o_velho:{
  texto:[
    'O Machamp cai sentado na areia, e ri, do jeito que Machamp ri, com as quatro mãos na barriga.',
    fala('o velho da primeira fogueira', 'Bom. Muito bom. Eu perdi a oitava três vezes pra gente como você. Agora eu sei como era do outro lado.', 'riso')
  ],
  ef:{flag:'cm_andarilho_velho', rep:{eixo:'bom', delta:1, motivo:'Lutou com o velho da primeira fogueira, por respeito'}},
  escolhas:[
    {texto:'Ir pra outra fogueira.', vai:'ca2_volta'}
  ]
},

ca2_perdeu_pro_velho:{
  texto:[
    'O Machamp branco derruba o seu último com um golpe só, e depois se senta, cansado, como quem fez a coisa do dia.',
    fala('o velho da primeira fogueira', 'Ainda luta. Ainda ganha, às vezes. Não conta pra ninguém, que eu gosto da fama de velho.', 'riso')
  ],
  ef:{flag:'cm_andarilho_velho', hp:-1, causa:'A praia de pedra da Rota 21'},
  escolhas:[
    {texto:'Ir pra outra fogueira.', vai:'ca2_volta'}
  ]
},

ca2_a_moca:{
  falante:'a moça de macacão',
  vozes:['N','N','N'],
  texto:[
    'A moça de macacão azul tem um pedaço do macacão rasgado na altura da coxa, como de arame de cerca.',
    '"Eu trabalhava na estação da cerca alta, aqui do lado. Saí pulando a cerca, faz três dias. Desde então eu ando pela praia, de noite, porque de dia eles procuram."',
    '"Eu não tenho pra onde ir. Eu tenho uma mãe numa vila de pescadores que acha que eu tô bem."'
  ],
  escolhas:[
    {texto:'Dar o seu casaco e o que tem de comida.', vai:'ca2_volta',
     ef:{flag:'cm_andarilho_moca', rep:{eixo:'bom', delta:1, motivo:'Deu casaco e comida pra quem fugiu da Estação 4'}}},
    {texto:'Levar ela até a vila de pescadores, de noite, pela praia.', vai:'ca2_a_vila',
     ef:{flag:'cm_andarilho_levou_a_moca', rep:{eixo:'bom', delta:2, motivo:'Levou pela praia, de noite, quem fugiu da Estação 4'}}}
  ]
},

ca2_a_vila:{
  texto:[
    'A vila fica a duas horas pela praia, andando na pedra molhada, no escuro.',
    'Na porta da quarta casa, uma mulher acorda com a batida e abre a porta de camisola, e não diz nada, e abraça a filha com o macacão rasgado e tudo.',
    'Você volta pra fogueira sozinh{o|a}, com a maré subindo.'
  ],
  escolhas:[
    {texto:'Voltar.', vai:'ca2_volta'}
  ]
},

ca2_o_menino:{
  falante:'o menino do balde',
  vozes:['N','N','N'],
  texto:[
    'O menino do balde tem dez anos e um Magikarp que ele pescou hoje, o primeiro Pokémon da vida dele.',
    '"Todo mundo diz que Magikarp não serve pra nada. Eu vou criar ele. Eu vou dar o nome de Capitão."',
    '"Você acha que ele vira alguma coisa?"'
  ],
  escolhas:[
    {texto:'"Vira. Leva tempo. Não desiste dele."', vai:'ca2_volta',
     ef:{flag:'cm_andarilho_menino', moral:2, rep:{eixo:'bom', delta:1, motivo:'Disse a uma criança pra não desistir do Magikarp dela'}}},
    {texto:'Mostrar pra ele um dos seus Pokémon e contar como foi o começo.', vai:'ca2_volta',
     ef:{flag:'cm_andarilho_menino', moral:3, rep:{eixo:'bom', delta:1, motivo:'Contou a uma criança o começo da própria jornada'}}}
  ]
},

ca2_volta:{
  texto:[
    'A noite anda. A maré sobe e desce a primeira vez.',
    d => [d.flags.cm_andarilho_velho, d.flags.cm_andarilho_moca || d.flags.cm_andarilho_levou_a_moca, d.flags.cm_andarilho_menino].filter(Boolean).length >= 3
      ? 'Três fogueiras, três histórias. Agora falta a sua.'
      : 'Ainda tem fogueira acesa que você não sentou.'
  ],
  escolhas:[
    {texto:'Sentar na fogueira do velho.', vai:'ca2_o_velho', cond:d => !d.flags.cm_andarilho_velho},
    {texto:'Sentar na fogueira da moça de macacão.', vai:'ca2_a_moca', cond:d => !d.flags.cm_andarilho_moca && !d.flags.cm_andarilho_levou_a_moca},
    {texto:'Sentar na fogueira do menino.', vai:'ca2_o_menino', cond:d => !d.flags.cm_andarilho_menino},
    {texto:'Contar a sua história, pra quem ainda estiver acordado.', vai:'ca2_fim'}
  ]
},

ca2_fim:{
  texto:[
    'Você conta. Da última manhã em casa, do primeiro Pokémon, do que viu desde então. Não é bonita, mas é sua.',
    d => d.npcs['Tamsin Reed'] ? fala('a mulher do mapa', 'Toda história de andarilho é igual: começa numa casa e não termina. É por isso que a gente conta.', 'baixo') : 'Quem ainda está acordado ouve até o fim, e ninguém diz nada, que é o jeito da praia de agradecer.',
    'De manhã, as três fogueiras são três círculos de cinza na pedra. A maré leva o primeiro antes do sol subir.'
  ],
  fim:true, resumo:'As três fogueiras: um velho com um Machamp branco, uma moça de macacão rasgado e um Magikarp chamado Capitão.'
}

}
},

/* ── III · A ÚLTIMA PÁGINA DO MAPA (depois do 25) ───────────── */
{
num:25.10, titulo:'A Última Página do Mapa', local:'Rota 22 — a estrada velha do oeste', ambiente:'montanha', nivelArea:56,
tom:'sombrio',
ancora:{local:'rota22', chamada:'Na estrada velha da Rota 22, uma mulher com um mapa dobrado em dezesseis está sentada no marco de pedra, esperando alguém.'},
entradas:['ca3_o_marco'],
inicio: d => 'ca3_o_marco',
cenas:{

ca3_o_marco:{
  texto:[
    d => { Nomes.apresentar('a mulher do mapa'); return d.npcs['Tamsin Reed'] ? 'A Tamsin está no marco de pedra da Rota 22, com o mapa 7 no colo, aberto na última página.' : 'Uma mulher de cinquenta anos está no marco de pedra da Rota 22, com um mapa feito à mão no colo. TAMSIN REED, a lápis, no caderno.'; },
    fala('a mulher do mapa', 'Depois da audiência de segunda, o seu nome saiu no jornal. Eu li num balcão de padaria. Achei que você ia querer andar um pouco longe do jornal.'),
    fala('a mulher do mapa', 'Essa é a última página do mapa 7. A estrada velha do oeste. Vinte anos que eu deixo ela pro fim.', 'baixo')
  ],
  ef:{flag:'cm_andarilho_3', registrar:'Andou a estrada velha da Rota 22 com a Tamsin Reed, a última página do mapa 7.'},
  escolhas:[
    {texto:'Andar com ela.', vai:'ca3_a_estrada'}
  ]
},

ca3_a_estrada:{
  texto:[
    'A estrada velha do oeste é de pedra, de antes da Liga, com marco a cada légua. Ninguém usa desde que abriram a estrada nova.',
    'Vocês andam três dias. Ela desenha, você conta Pokémon, e à noite nenhum dos dois fala muito.',
    'No terceiro dia, a estrada acaba num muro de pedra caído, e do outro lado do muro tem uma casa sem telhado e uma árvore de Oran no quintal, carregada.',
    fala('a mulher do mapa', 'A casa onde eu nasci.', 'baixo')
  ],
  escolhas:[
    {texto:'Esperar ela entrar primeiro.', vai:'ca3_a_casa',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Esperou a Tamsin entrar primeiro na casa dela'}}}
  ]
},

ca3_a_casa:{
  texto:[
    'Dentro da casa sem telhado, na parede da cozinha, alguém desenhou a carvão, faz muito tempo, um mapa de Kanto torto, de criança, com uma estrela em cima da casa.',
    fala('a mulher do mapa', 'Mapa 1. Eu tinha seis anos. Eu achava que Kanto acabava ali, na Rota 22.', 'baixo'),
    fala('a mulher do mapa', 'Fiz mais seis pra descobrir que não acaba. Que nenhum mapa acaba. A gente que acaba antes.', 'baixo'),
    'Na árvore de Oran do quintal, um Spearow velho, sem metade das penas do rabo, está fazendo ninho.'
  ],
  escolhas:[
    {texto:'Perguntar o que ela vai fazer agora.', vai:'ca3_e_agora'}
  ]
},

ca3_e_agora:{
  texto:[
    fala('a mulher do mapa', 'Eu? Eu vou ficar uns dias. Pôr um telhado. Depois eu vejo.'),
    fala('a mulher do mapa', 'E você? Você tem estrada ainda. O Planalto te chamou, eu sei. Mas você pode não ir.', 'baixo'),
    'Na estrada velha, atrás de vocês, um bando de Doduo atravessa o marco de pedra no mesmo horário de sempre.',
    'Na beira da estrada, de pé, um treinador de capa de chuva parado olhando vocês. Ele está ali desde ontem, seguindo de longe.'
  ],
  escolhas:[
    {texto:'Ir até o treinador de capa de chuva.', vai:'ca3_o_da_capa'},
    {texto:'Decidir agora.', vai:'ca3_a_decisao'}
  ]
},

ca3_o_da_capa:{
  texto:[
    'O treinador de capa de chuva tem um crachá da Comissão escondido na lapela, que ele não esconde direito.',
    fala('o treinador de capa de chuva', 'Me mandaram ver se você ia pro Planalto ou se ia sumir. Só ver. Eu já vi.'),
    fala('o treinador de capa de chuva', 'Agora eu vou ver se você é o que dizem.', 'frio')
  ],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 2), tipo:'treinador', treinador:'o treinador de capa de chuva', fuga:true,
           timeExtra:[{dex:97, nivel:d => nivelDoCaminho(d, 2)}],
           vitoria:'ca3_foi_embora', derrota:'ca3_a_decisao', gameover:'gameover'}
},

ca3_foi_embora:{
  texto:[
    'As unidades dele caem na estrada de pedra e esperam. Ele recolhe e vai embora pela estrada nova, sem olhar pra trás.',
    fala('a mulher do mapa', 'Até aqui eles vêm. Até a última página de um mapa de criança.', 'baixo')
  ],
  ef:{rep:{eixo:'bom', delta:1, motivo:'Mandou embora o vigia da Comissão da estrada velha'}},
  escolhas:[
    {texto:'Decidir.', vai:'ca3_a_decisao'}
  ]
},

ca3_a_decisao:{
  texto:[
    'O sol desce atrás do muro de pedra caído. A árvore de Oran faz sombra comprida no quintal.',
    'Você tem um mapa na cabeça agora, feito de três dias de estrada velha e de tudo que veio antes. Ele também está errado em algum lugar.'
  ],
  escolhas:[
    {texto:'Começar o seu próprio mapa, e seguir andando sozinh{o|a}.', vai:'ca3_final_mapa',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Começou o próprio mapa de Kanto'}}},
    {texto:'Voltar pra casa. Pra sua.', vai:'ca3_final_casa',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Voltou pra casa no fim da estrada'}}},
    {texto:'Ficar, ajudar a pôr o telhado, e andar junto com ela depois.', vai:'ca3_final_junto',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Ficou pra andar junto com a Tamsin'}}},
    {texto:'Seguir pro Planalto. Ainda tem coisa no caminho.', vai:'ca3_seguir',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Seguiu pro Planalto depois da estrada velha'}}}
  ]
},

ca3_seguir:{
  texto:[
    fala('a mulher do mapa', 'Vai. Quando acabar lá, a estrada velha continua aqui. Ninguém usa.', 'riso'),
    'Você volta pela estrada de pedra, marco por marco, e conta os Doduo no caminho, sem querer.'
  ],
  ef:{flag:'cm_andarilho_seguiu'},
  fim:true, resumo:'A última página do mapa: uma estrada de pedra, uma casa sem telhado e um mapa de criança desenhado a carvão.'
},

ca3_final_mapa:{
  texto:[
    'A Tamsin te dá um caderno de desenho novo e uma borracha. Na capa, a lápis, ela escreve o seu nome e MAPA 1.',
    'Você sai pela estrada velha no dia seguinte, sozinh{o|a}, pro norte.'
  ],
  final:{id:'andarilho_mapa', titulo:'MAIS UM MAPA', texto:[
    'O seu mapa 1 está errado em onze lugares. O 2, em sete. O 3, em quatro.',
    'Você nunca termina um. Você aprende que terminar mapa não é o ponto: o ponto é andar o suficiente pra saber onde ele está errado.',
    'Em cada vale sem nome que você acha, você deixa o papel em branco, do jeito que alguém te ensinou.',
    'Às vezes, numa praia de pedra, você acende uma fogueira e espera. Quase sempre alguém senta. Você ouve uma história e conta outra.'
  ]}
},

ca3_final_casa:{
  texto:[
    'A estrada pra sua cidade é longa, mas a estrada pra casa é sempre mais curta que a de ida.',
    'Na porta, ninguém sabia que você vinha. Abre do mesmo jeito.'
  ],
  final:{id:'andarilho_casa', titulo:'CASA', texto:[
    'Em casa, quem ficou põe um prato a mais na mesa sem perguntar nada, como se você tivesse saído de manhã.',
    'O seu time descobre o quintal em uma tarde e decide que é dele.',
    'Você não volta pra Liga, nem pro jornal, nem pro Planalto. Você acha emprego na cidade, num lugar que não é importante.',
    'Toda manhã, você acorda na mesma cama em que acordou na última manhã antes da jornada. Agora você sabe exatamente o que tem do outro lado da porta. É isso que é casa.'
  ]}
},

ca3_final_junto:{
  texto:[
    'O telhado leva duas semanas. A Tamsin martela torto e você conserta, e ninguém comenta.',
    'No dia em que acaba, ela abre o mapa 7 na mesa nova da cozinha e desenha, a lápis, uma estrela em cima da casa.'
  ],
  final:{id:'andarilho_junto', titulo:'QUEM ANDA JUNTO', texto:[
    'Vocês andam Kanto juntos por anos. Ela desenha, você conta, e à noite nenhum dos dois fala muito.',
    'O mapa 8 tem duas letras: a dela, em lápis duro, e a sua, em lápis mole. Ele é o menos errado de todos.',
    'Quando ela fica velha demais pra estrada, ela fica na casa da Rota 22 e você manda notícia de cada vale que acha.',
    'Ela responde sempre com a mesma frase, a lápis, no verso: "Deixou em branco?" Você sempre deixou.'
  ]}
}

}
}
);
