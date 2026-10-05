/* ============================================================
   CAMINHO DA CRIAÇÃO — a Associação de Criadores
   Pra quem é criador na hora do desvio. Quem acompanha: a Sra. Linden,
   avaliadora, e a Mina Bray, tratadora do abrigo da Associação, que
   sabe o nome de todo Pokémon que passou por lá.
   ============================================================ */

/* ── I · OS ÓRFÃOS DO MANEJO (depois do 12) ────────────────── */
CAPITULOS.push(
{
num:12.05, titulo:'Os Órfãos do Manejo', local:'Rota 15 — a beira da cerca', ambiente:'campo', nivelArea:40,
tom:'sombrio',
ancora:{local:'rota13', chamada:'Na beira da cerca da reserva, na Rota 15, tem uma perua branca da Associação de Criadores parada com o pisca-alerta ligado.'},
entradas:['cn1_a_perua'],
inicio: d => 'cn1_a_perua',
cenas:{

cn1_a_perua:{
  texto:[
    'A perua da Associação de Criadores está encostada na cerca, com a porta de trás aberta e três caixas de transporte vazias forradas com toalha.',
    d => { Nomes.apresentar('a tratadora da Associação'); return 'Sentada no para-choque, de macacão manchado de ração até o cotovelo, uma moça de cabelo preso com caneta. No bolso do macacão, bordado: MINA BRAY — ABRIGO.'; },
    fala('a tratadora da Associação', 'Três filhotes de Nidoran do lado de fora da cerca, sozinhos, faz dois dias. A mãe saiu no manejo de terça.'),
    fala('a tratadora da Associação', 'A Associação não pode receber Pokémon de reserva sem papel da reserva. E a reserva diz que nenhum Nidoran saiu de lá terça.', 'baixo')
  ],
  ef:{flag:'cm_criacao_1', registrar:'Três filhotes de Nidoran ficaram órfãos do lado de fora da cerca da reserva depois do manejo.'},
  escolhas:[
    {texto:'Ir atrás dos filhotes antes de qualquer papel.', vai:'cn1_os_filhotes',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Foi atrás dos filhotes antes do papel'}}},
    {texto:'Ligar pra Sra. Linden.', vai:'cn1_a_linden'}
  ]
},

cn1_a_linden:{
  texto:[
    d => { Nomes.apresentar('a avaliadora da Associação'); return 'A Sra. Linden atende com barulho de cerca de criação atrás. Ela ouve a história inteira sem interromper.'; },
    fala('a avaliadora da Associação', 'O regulamento diz: sem papel, não entra no abrigo. Eu escrevi esse regulamento. Pra impedir gente de despejar ninhada lá.'),
    fala('a avaliadora da Associação', 'Ele não foi escrito pra isso. Mas ele diz isso.', 'baixo'),
    fala('a avaliadora da Associação', 'Você é associad{o|a}. Você pode pegar os três como seus, no seu nome, e o regulamento não tem nada com isso.')
  ],
  escolhas:[
    {texto:'Ir atrás dos filhotes.', vai:'cn1_os_filhotes'}
  ]
},

cn1_os_filhotes:{
  texto:[
    'Os filhotes estão num buraco de Diglett abandonado, debaixo da cerca, do lado de fora. Três, encolhidos um no outro, com o chifrinho ainda mole.',
    'Do outro lado da estrada, um homem de chapéu de palha e saco de juta está agachado, olhando o mesmo buraco.',
    fala('Caçador de filhote', 'Cheguei primeiro, criador. Filhote de reserva dá trezentos cada na feira de Celadon.'),
    fala('Caçador de filhote', 'Sem mãe, sem papel, sem dono. É de quem pegar.')
  ],
  escolhas:[
    {texto:'Ficar entre ele e o buraco.', vai:'cn1_luta',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Ficou entre o caçador e os filhotes'}}},
    {texto:'Oferecer novecentos pelos três, pra não ter briga.', vai:'cn1_comprou', cond:d => d.jogador.dinheiro >= 900,
     ef:{flag:'cm_criacao_comprou', dinheiro:-900, rep:{eixo:'bom', delta:1, motivo:'Pagou pra tirar os filhotes do caçador'}}}
  ]
},

cn1_luta:{
  texto:['Ele não larga o saco de juta. Solta o Pokémon com a outra mão.'],
  batalha:{dex:24, nivel:d => nivelDoCaminho(d, -3), tipo:'treinador', treinador:'Caçador de filhote', fuga:false,
           timeExtra:[{dex:22, nivel:d => nivelDoCaminho(d, -2)}],
           vitoria:'cn1_ficaram', derrota:'cn1_levou_um', gameover:'gameover'}
},

cn1_comprou:{
  texto:[
    'Ele conta as notas duas vezes, cospe no chão e vai embora assobiando.',
    fala('a tratadora da Associação', 'Agora ele sabe que filhote de reserva vale novecentos. Semana que vem tem mais buraco com caçador agachado.', 'baixo'),
    'Ela não diz que você fez errado. Ela só diz o que vai acontecer, e isso é pior.'
  ],
  ef:{presagio:'Ele assobia. Quem assobia indo embora já está pensando na próxima vez.'},
  escolhas:[
    {texto:'Tirar os filhotes do buraco.', vai:'cn1_ficaram'}
  ]
},

cn1_levou_um:{
  texto:[
    'O caçador pega um dos três pela nuca, mete no saco de juta e vai embora correndo pela estrada antes do seu time levantar.',
    'Ficam dois no buraco. Eles ficam olhando pro lugar onde estava o terceiro.'
  ],
  ef:{flag:'cm_criacao_levou_um', hp:-2, causa:'A beira da cerca da reserva'},
  escolhas:[
    {texto:'Tirar os dois do buraco.', vai:'cn1_ficaram'}
  ]
},

cn1_ficaram:{
  texto:[
    d => d.flags.cm_criacao_levou_um ? 'Dois. A Mina enrola cada um numa toalha e põe na caixa de transporte com uma garrafa de água morna do lado, que é o mais perto de mãe que dá.' : 'Três. A Mina enrola cada um numa toalha e põe na caixa de transporte com uma garrafa de água morna do lado, que é o mais perto de mãe que dá.',
    fala('a tratadora da Associação', 'E agora? No seu nome, sem papel, eles são seus. O que você faz com Pokémon seu é com você.')
  ],
  escolhas:[
    {texto:'Ficar com um, no time, e mandar os outros pro abrigo no seu nome.', vai:'cn1_ficou_com_um',
     ef:{flag:'cm_criacao_ficou_com_um', rep:{eixo:'bom', delta:2, motivo:'Assumiu os filhotes órfãos do manejo no próprio nome'},
         pokemon:{dex:29, nivel:12, opcoes:{moral:70, historia:'Órfã do manejo da Zona Safári. Achad{o} num buraco debaixo da cerca, do lado de fora.'}}}},
    {texto:'Mandar todos pro abrigo, no seu nome.', vai:'cn1_abrigo',
     ef:{flag:'cm_criacao_abrigo', rep:{eixo:'bom', delta:2, motivo:'Assinou pelos filhotes órfãos do manejo no abrigo'}}},
    {texto:'Devolver pra dentro da cerca, pela fresta, perto de onde a mãe vivia.', vai:'cn1_devolveu',
     ef:{flag:'cm_criacao_devolveu', rep:{eixo:'bom', delta:1, motivo:'Devolveu os filhotes pra dentro da reserva'}}}
  ]
},

cn1_ficou_com_um:{
  texto:[
    'A menor dos três não sai do seu pé desde o buraco. Você não escolheu; ela escolheu.',
    fala('a tratadora da Associação', 'Ela tem dente de leite ainda. Morde tudo. Deixa morder a sua mão e não puxa: ela tem que aprender o quanto dói sozinha.')
  ],
  ef:{npc:{nome:'Mina Bray', opiniao:3, memoria:'Você ficou com a menor dos filhotes órfãos do manejo.'}},
  escolhas:[
    {texto:'Voltar pra estrada.', vai:'cn1_fim'}
  ]
},

cn1_abrigo:{
  texto:[
    'O abrigo da Associação, em Cerulean, tem quarenta baias e uma lista na parede com o nome de cada Pokémon que passou ali.',
    'A Mina escreve os nomes à caneta, na hora: Tuca, Lume, e o terceiro, se tiver, Dois.',
    fala('a tratadora da Associação', 'Sem nome ninguém adota. Com nome, é alguém.', 'baixo')
  ],
  ef:{npc:{nome:'Mina Bray', opiniao:4, memoria:'Você assinou pelos filhotes órfãos e ela deu nome aos três.'}},
  escolhas:[
    {texto:'Voltar pra estrada.', vai:'cn1_fim'}
  ]
},

cn1_devolveu:{
  texto:[
    'A fresta da cerca, perto do buraco, dá pra passar um filhote de cada vez.',
    'Do lado de dentro, eles demoram pra andar. Depois correm todos pro mesmo lado, sem olhar pra trás, como quem conhece o caminho.',
    fala('a tratadora da Associação', 'Lá dentro tem mato e não tem mãe. Aqui fora tem mãe nenhuma e tem caçador. Eu não sei qual é melhor.', 'baixo'),
    fala('a tratadora da Associação', 'Ninguém sabe. Quem diz que sabe tá mentindo ou vendendo.', 'baixo')
  ],
  escolhas:[
    {texto:'Voltar pra estrada.', vai:'cn1_fim'}
  ]
},

cn1_fim:{
  texto:[
    'A perua da Associação vai embora com o pisca-alerta ainda ligado, porque a Mina esquece de desligar.',
    fala('a avaliadora da Associação', 'Eu vou mudar o regulamento. Vai levar um ano. Escreve o que aconteceu hoje, que eu preciso do caso.', 'baixo'),
    'Na cerca, o buraco debaixo da tela continua lá. Buraco de cerca é a única coisa que a reserva não maneja.'
  ],
  fim:true, resumo:'Os órfãos do manejo: um buraco debaixo da cerca, um caçador com saco de juta e um regulamento que vai mudar.'
}

}
},

/* ── II · O LAUDO (depois do 19) ───────────────────────────── */
{
num:19.05, titulo:'O Laudo', local:'Estação 4 — o berçário', ambiente:'campo', nivelArea:56,
tom:'muito sombrio',
ancora:{local:'rota21', chamada:'Na portaria da Estação 4, um envelope com o selo da Associação de Criadores espera em cima do balcão, com o seu nome à mão.'},
entradas:['cn2_o_envelope'],
inicio: d => 'cn2_o_envelope',
cenas:{

cn2_o_envelope:{
  texto:[
    'O envelope tem o selo da Associação, mas não foi a Associação que mandou. Dentro, um formulário de laudo e uma carta da Comissão.',
    '**"Solicitamos avaliação técnica das unidades do lote 12 para fins de distribuição a treinadores iniciantes, com atestado de saúde e aptidão."**',
    d => d.flags.ln_criacao_selo ? 'Você tem o selo regional. O carimbo de metal pesado está no bolso de dentro da mochila. É por isso que te escolheram.' : 'Você não tem o selo regional. Mesmo assim, te escolheram. Alguém achou que você assinaria mais fácil do que a Sra. Linden.',
    'Distribuição a treinadores iniciantes. O primeiro Pokémon de uma criança.'
  ],
  ef:{flag:'cm_criacao_2', registrar:'A Comissão pediu seu laudo pra distribuir unidades de viveiro como primeiro Pokémon de treinador iniciante.'},
  escolhas:[
    {texto:'Entrar e avaliar as unidades com honestidade.', vai:'cn2_o_bercario'},
    {texto:'Ligar pra Sra. Linden antes.', vai:'cn2_a_linden'}
  ]
},

cn2_a_linden:{
  texto:[
    fala('a avaliadora da Associação', 'Eles me pediram primeiro. Eu recusei sem abrir o envelope.'),
    fala('a avaliadora da Associação', 'Eu errei. Recusar sem olhar é o que eles queriam: assim ninguém viu. Olha. E depois decide.', 'baixo')
  ],
  ef:{npc:{nome:'Sra. Linden', opiniao:1, memoria:'Te disse que errou ao recusar o laudo sem olhar.'}},
  escolhas:[
    {texto:'Entrar.', vai:'cn2_o_bercario'}
  ]
},

cn2_o_bercario:{
  texto:[
    'O berçário da Estação 4 é limpo como hospital e quieto como hospital.',
    'O lote 12 tem vinte unidades jovens: Eevee, Pidgey, Rattata. Pelagem perfeita, peso perfeito, olho limpo.',
    'Você faz o que a Sra. Linden te ensinou: se agacha e espera eles se aproximarem.',
    'Eles não se aproximam. Eles também não se afastam. Eles ficam olhando pro técnico na porta, esperando ordem.'
  ],
  escolhas:[
    {texto:'Pedir pra ver uma unidade lutar.', vai:'cn2_a_demonstracao'},
    {texto:'Ficar a tarde inteira só olhando.', vai:'cn2_a_tarde',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Passou a tarde observando as unidades antes de avaliar'}}}
  ]
},

cn2_a_tarde:{
  texto:[
    'Quatro horas. Nenhuma unidade brinca. Nenhuma disputa comida. Nenhuma dorme encostada em outra.',
    'Às três da tarde, um Pidgey da baia oito cai da poleira e fica no chão. Os outros não olham.',
    'Você anota tudo, com hora, do jeito que se anota uma criação.'
  ],
  ef:{flag:'cm_criacao_observou', itens:{'Notas do berçário (lote 12)':1}},
  escolhas:[
    {texto:'Pedir pra ver uma unidade lutar.', vai:'cn2_a_demonstracao'},
    {texto:'Escrever o laudo.', vai:'cn2_o_laudo'}
  ]
},

cn2_a_demonstracao:{
  texto:[
    'O técnico chama o colega do galpão do lado, que traz as unidades de demonstração dele.',
    fala('Técnico do berçário', 'Pra atestar aptidão, você luta com elas. Elas obedecem perfeitamente. É o ponto de venda.')
  ],
  batalha:{comissao:'tecnico', nivel:d => nivelDoCaminho(d, -2), tipo:'treinador', treinador:'Técnico do berçário', fuga:true,
           vitoria:'cn2_viu_lutar', derrota:'cn2_viu_lutar', gameover:'gameover'}
},

cn2_viu_lutar:{
  texto:[
    'Elas lutam bem. Obedecem na hora. Nenhuma hesita.',
    'E quando caem, nenhuma tenta levantar. Elas ficam deitadas, esperando ordem pra levantar, como se cair fosse uma ordem também.',
    'Um Pokémon de criança precisa levantar sozinho às vezes. Às vezes a criança não está lá pra mandar.'
  ],
  ef:{flag:'cm_criacao_viu_lutar', registrar:'As unidades de viveiro não tentam levantar sozinhas. Esperam ordem até pra isso.'},
  escolhas:[
    {texto:'Escrever o laudo.', vai:'cn2_o_laudo'}
  ]
},

cn2_o_laudo:{
  texto:[
    'O formulário tem três campos: SAÚDE, APTIDÃO, OBSERVAÇÕES.',
    'Saúde: perfeita, isso é verdade. Aptidão: elas obedecem, isso também é verdade.',
    'Observações: quatro linhas.',
    'Na porta, o técnico espera com um envelope de honorário, que é dinheiro com outro nome.'
  ],
  escolhas:[
    {texto:'Assinar como apto.', vai:'cn2_assinou',
     ef:{flag:'cm_criacao_assinou', dinheiro:3000, rep:{eixo:'ruim', delta:3, motivo:'Assinou o laudo das unidades de viveiro como aptas pra criança'}}},
    {texto:'Assinar saúde e aptidão, e escrever nas observações que elas não levantam sozinhas.', vai:'cn2_ressalva',
     ef:{flag:'cm_criacao_ressalva', rep:{eixo:'bom', delta:2, motivo:'Assinou o laudo com uma ressalva que barra a distribuição'}}},
    {texto:'Não assinar. Devolver o formulário em branco.', vai:'cn2_recusou',
     ef:{flag:'cm_criacao_recusou', rep:{eixo:'bom', delta:2, motivo:'Recusou o laudo das unidades de viveiro'}}}
  ]
},

cn2_assinou:{
  texto:[
    'Você assina. O carimbo faz o barulho de sempre.',
    'O técnico guarda o laudo numa pasta e te dá o envelope, com um aperto de mão seco.',
    'Na baia oito, o Pidgey que caiu da poleira continua no chão.'
  ],
  ef:{npc:{nome:'Sra. Linden', opiniao:-4, memoria:'Você assinou o laudo das unidades como aptas pra criança.'}},
  escolhas:[
    {texto:'Sair.', vai:'cn2_fim'}
  ]
},

cn2_ressalva:{
  texto:[
    'Quatro linhas, letra pequena: "Unidades não apresentam comportamento de recuperação autônoma. Não recomendadas a tutor sem experiência."',
    'O técnico lê. Lê de novo. Liga pra alguém.',
    fala('Técnico do berçário', 'Com essa observação, o laudo não serve pra distribuição. Você sabe disso.', 'frio'),
    'Você sabe. Por isso escreveu.'
  ],
  ef:{npc:{nome:'Sra. Linden', opiniao:4, memoria:'Você assinou o laudo com uma ressalva que barrou a distribuição.'}},
  escolhas:[
    {texto:'Sair.', vai:'cn2_fim'}
  ]
},

cn2_recusou:{
  texto:[
    'O formulário volta em branco, dobrado no envelope com o selo da Associação.',
    fala('Técnico do berçário', 'Tem outros criadores. Sempre tem outro criador.', 'frio'),
    'Ele está certo. É isso que dói em recusar: não impede, só não é você.'
  ],
  ef:{npc:{nome:'Sra. Linden', opiniao:2, memoria:'Você recusou o laudo das unidades.'}},
  escolhas:[
    {texto:'Sair.', vai:'cn2_fim'}
  ]
},

cn2_fim:{
  texto:[
    d => d.flags.cm_criacao_assinou ? 'Em dois meses, a primeira criança de Kanto recebe um Eevee de lote como primeiro Pokémon, com laudo assinado. O seu.' : d.flags.cm_criacao_ressalva ? 'O laudo com a ressalva vai pra um arquivo da Comissão e trava a distribuição do lote 12 por quatro meses.' : 'O lote 12 é avaliado por outro criador, que assina sem observação.',
    'Na estrada, a sua mão ainda tem o cheiro do berçário: limpo como hospital.'
  ],
  fim:true, resumo:'O laudo: vinte unidades perfeitas, uma poleira e quatro linhas de observação.'
}

}
},

/* ── III · O SELO (depois do 25) ───────────────────────────── */
{
num:25.05, titulo:'O Selo', local:'Cerulean — a Associação de Criadores', ambiente:'agua', nivelArea:58,
tom:'muito sombrio',
ancora:{local:'cerulean', chamada:'Na Associação de Criadores de Cerulean tem assembleia hoje, e a pauta colada na porta tem o seu nome no item três.'},
entradas:['cn3_a_assembleia'],
inicio: d => 'cn3_a_assembleia',
cenas:{

cn3_a_assembleia:{
  texto:[
    'A assembleia da Associação acontece no galpão do abrigo, com cadeira de plástico e criador de bota de borracha.',
    'Item um: preço da ração. Item dois: o regulamento novo de órfão. Item três: o laudo do lote 12.',
    fala('a avaliadora da Associação', 'Depois da audiência de segunda, a Comissão vai pedir à Associação que reconheça unidade de viveiro como criação legítima. Se a gente reconhecer, todo criador de Kanto vira fornecedor deles.'),
    d => d.flags.cm_criacao_assinou ? 'Na terceira fila, alguém olha pra você e fala baixinho com quem está do lado.' : 'Na terceira fila, a Mina Bray, de macacão, acena pra você com a caneta do cabelo.'
  ],
  ef:{flag:'cm_criacao_3', registrar:'A Associação de Criadores vota se reconhece unidade de viveiro como criação legítima.'},
  escolhas:[
    {texto:'Pedir a palavra.', vai:'cn3_a_palavra'},
    {texto:'Votar em silêncio, como a maioria.', vai:'cn3_o_voto'}
  ]
},

cn3_a_palavra:{
  texto:[
    'Você fala do que viu. Não do que acha: do que viu.',
    d => d.flags.cm_criacao_viu_lutar ? 'Das unidades que caem e esperam ordem pra levantar.' : d.flags.cm_criacao_observou ? 'Do Pidgey da baia oito, que caiu da poleira e ninguém olhou.' : 'Dos filhotes órfãos debaixo da cerca e do caçador com saco de juta.',
    d => d.flags.cm_criacao_assinou ? 'E fala do laudo que você assinou. Na frente de todo mundo. Sem desculpa.' : '',
    'O galpão fica em silêncio. Um criador velho, de bota, tira o chapéu.'
  ],
  ef:{rep:{eixo:'bom', delta:2, motivo:'Falou na assembleia da Associação sobre o que viu no berçário'}},
  escolhas:[
    {texto:'Votar.', vai:'cn3_o_voto'}
  ]
},

cn3_o_voto:{
  texto:[
    'O voto é de mão levantada. A Sra. Linden conta em voz alta.',
    'Antes do resultado, um homem de colete preto entra pela porta do galpão, sem tirar o boné, e fica de pé no fundo.',
    fala('Representante da Comissão', 'A Comissão só quer acompanhar o processo democrático da Associação.', 'frio'),
    'Ele solta uma Pokébola na mão, sem abrir, e fica jogando pra cima.'
  ],
  escolhas:[
    {texto:'Ir até o fundo e pedir pra ele sair.', vai:'cn3_o_fundo',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Pediu ao representante da Comissão pra sair da assembleia'}}},
    {texto:'Ignorar e votar contra o reconhecimento.', vai:'cn3_a_decisao',
     ef:{flag:'cm_criacao_votou_contra', rep:{eixo:'bom', delta:1, motivo:'Votou contra reconhecer unidade de viveiro como criação'}}}
  ]
},

cn3_o_fundo:{
  texto:['Ele não sai. Ele abre a Pokébola.'],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 2), tipo:'treinador', treinador:'Representante da Comissão', fuga:false,
           timeExtra:[{dex:68, nivel:d => nivelDoCaminho(d, 2)}],
           vitoria:'cn3_saiu', derrota:'cn3_ficou', gameover:'gameover'}
},

cn3_saiu:{
  texto:[
    'As unidades caem no chão de cimento do galpão e esperam ordem. Ele recolhe e sai, devagar, sem bater a porta.',
    'O voto é contado de novo, sem ninguém no fundo. Não ao reconhecimento, por trinta e um a nove.'
  ],
  ef:{flag:'cm_criacao_venceu_votacao', rep:{eixo:'bom', delta:2, motivo:'Tirou a Comissão da assembleia e a Associação votou não'}},
  escolhas:[
    {texto:'Decidir o que vem depois.', vai:'cn3_a_decisao'}
  ]
},

cn3_ficou:{
  texto:[
    'Ele fica até o fim. O voto sai apertado: não ao reconhecimento, por vinte e um a dezenove.',
    'Dezenove criadores levantaram a mão olhando pro fundo do galpão.'
  ],
  ef:{flag:'cm_criacao_votacao_apertada', hp:-2, causa:'O galpão do abrigo'},
  escolhas:[
    {texto:'Decidir o que vem depois.', vai:'cn3_a_decisao'}
  ]
},

cn3_a_decisao:{
  texto:[
    'Depois da assembleia, no estacionamento, a Sra. Linden e a Mina te esperam do lado da perua.',
    fala('a avaliadora da Associação', 'A Associação disse não hoje. Daqui a um ano, com outro presidente, pode dizer sim.'),
    fala('a tratadora da Associação', 'Tem um terreno em Cerulean, depois da segunda ponte, que ninguém quer. Dá um criadouro aberto. Sem cerca de três metros. Pra quem sai de lote, de manejo, de buraco.', 'baixo'),
    d => d.flags.cm_criacao_assinou ? fala('a avaliadora da Associação', 'E tem o seu laudo. Ele ainda vale. Você decide se continua valendo.', 'frio') : ''
  ],
  escolhas:[
    {texto:'Fazer o criadouro aberto com elas.', vai:'cn3_final_criadouro', cond:d => !d.flags.cm_criacao_assinou,
     ef:{rep:{eixo:'bom', delta:3, motivo:'Fundou o criadouro aberto com a Associação'}}},
    {texto:'Ficar do lado de quem paga laudo. A Comissão tem mais futuro que a Associação.', vai:'cn3_final_laudo',
     ef:{rep:{eixo:'ruim', delta:4, motivo:'Virou certificador da Comissão'}}},
    {texto:'Largar a Associação e o selo, e soltar no mato quem não tem pra onde ir.', vai:'cn3_final_mato',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Largou a Associação e soltou quem não tinha pra onde ir'}}},
    {texto:'Retirar o seu laudo em público e fazer o criadouro com elas.', vai:'cn3_final_criadouro', cond:d => !!d.flags.cm_criacao_assinou,
     ef:{rep:{eixo:'bom', delta:3, motivo:'Retirou o laudo em público e fundou o criadouro aberto'}}},
    {texto:'Ainda não. O Planalto mandou chamar.', vai:'cn3_seguir',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Deixou o criadouro pra depois da jornada'}}}
  ]
},

cn3_seguir:{
  texto:[
    fala('a tratadora da Associação', 'Vai. O terreno não vai a lugar nenhum. Ninguém quer ele.', 'riso'),
    'O ônibus da Liga pro Planalto sai às oito e quinze. Você ainda tem cheiro de ração no casaco.'
  ],
  ef:{flag:'cm_criacao_seguiu_planalto'},
  fim:true, resumo:'O selo: uma assembleia de cadeira de plástico, um voto de mão levantada e um terreno que ninguém quer.'
},

cn3_final_criadouro:{
  texto:[
    'O terreno depois da segunda ponte de Cerulean tem quatro hectares de mato, um riacho e uma casa com o telhado pela metade.',
    'Vocês três consertam o telhado em duas semanas. A placa na porteira é de madeira, pintada à mão pela Mina: CRIADOURO ABERTO — ENTRA QUEM PRECISA.'
  ],
  final:{id:'criacao_criadouro', titulo:'O CRIADOURO ABERTO', texto:[
    'Em um ano, o criadouro tem duzentos Pokémon e nenhuma cerca de três metros. Tem órfão de manejo, tem unidade de lote que alguém soltou na estrada, tem Pokémon velho de treinador velho.',
    'A Mina escreve o nome de cada um na parede, à caneta. A parede acaba e ela começa na outra.',
    'As unidades de viveiro aprendem a levantar sozinhas. Levam meses. Um Eevee do lote 12 levanta pela primeira vez numa terça de chuva, e a Mina chora tanto que a Sra. Linden tem que segurar a prancheta.',
    'Criança de Cerulean vem buscar primeiro Pokémon no criadouro. Leva o que escolhe ela, não o que você escolhe.'
  ]}
},

cn3_final_laudo:{
  texto:[
    'O seu carimbo passa a assinar quarenta laudos por mês. A Comissão paga em dia, com nota.',
    'A Sra. Linden te expulsa da Associação numa assembleia que você não vai.'
  ],
  final:{id:'criacao_laudo', titulo:'O LAUDO ASSINADO', texto:[
    'Em dois anos, um em cada três treinadores iniciantes de Kanto começa a jornada com uma unidade de lote, e o laudo de cada uma tem a sua assinatura.',
    'Você fica {rico|rica}. Você compra uma casa com quintal e não cria nada nele.',
    'Às vezes, numa rota, você vê uma criança com um Eevee caído no chão, esperando ordem pra levantar, e a criança não sabe que tem que mandar.',
    'Você passa direto. Você aprendeu a passar direto. É a única coisa que você aprendeu a fazer melhor do que a Sra. Linden.'
  ]}
},

cn3_final_mato:{
  texto:[
    'O selo regional vai pro fundo do rio de Cerulean, de cima da segunda ponte, num arco bonito.',
    'Você passa um mês levando de perua, de rota em rota, quem não tinha pra onde ir, e abrindo a porta onde tem mato e não tem cerca.'
  ],
  final:{id:'criacao_mato', titulo:'DE VOLTA AO MATO', texto:[
    'Nem todos sobrevivem. Os que vêm de lote não sabem comer sozinhos e você aprende isso tarde, com dois deles.',
    'Os outros somem no capim, devagar, e você nunca mais vê nenhum, que era o que você queria e é o que dói.',
    'A Associação muda o regulamento de órfão um ano depois, com o seu caso como exemplo, sem o seu nome.',
    'Você vive de bico em fazenda, de rota em rota. Quando alguém te pergunta o que você faz, você diz que devolve. Ninguém entende. Você não explica.'
  ]}
}

}
}
);
