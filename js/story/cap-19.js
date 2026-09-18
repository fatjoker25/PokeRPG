/* ============================================================
   CAPÍTULO 19 — O VIVEIRO
   ============================================================ */
CAPITULOS.push(
{
num:19, titulo:'O Viveiro', local:'Estação 4 — Rota 21', ambiente:'campo', nivelArea:56,
tom:'muito sombrio', inicio:'c19_cerca',
cenas:{

c19_cerca:{
  texto:[
    'A Estação 4 tem oito hectares, cerca nova, e não parece um lugar de crime. Parece um lugar de trabalho.',
    'Tem estacionamento com sete carros. Tem uma placa de "24 DIAS SEM ACIDENTES".',
    'Tem gente de macacão tomando café na porta de um galpão às 9h40 da manhã.',
    d=>{
      if (d.flags.trabalha_para_comissao) return 'Você entra pela portaria, mostra a matrícula e é recebido por alguém do RH que te explica onde fica o banheiro.';
      if (d.flags.cracha_adnan) return 'O crachá do Adnan abre a catraca da portaria no primeiro toque. O sistema registra. O relógio das quarenta e oito horas começa agora.';
      return 'Você vai ter que entrar de outro jeito.';
    }
  ],
  ef:{registrar:'Chegou à Estação 4 na Rota 21.'},
  escolhas:[
    {texto:'Entrar pela portaria.', vai:'c19_dentro',
     cond:d=>!!(d.flags.trabalha_para_comissao||d.flags.cracha_adnan)},
    {texto:'Pular a cerca pelo lado do mar.', vai:'c19_cerca_mar'},
    {texto:'Entrar junto com o caminhão de insumos.', vai:'c19_caminhao'},
    {texto:'Bater na portaria e pedir para ver.', vai:'c19_pedir'}
  ]
},

c19_pedir:{
  texto:[
    'Você bate na portaria e pede pra ver.',
    'O porteiro liga para alguém. Alguém liga para outro alguém. Em onze minutos, uma técnica de jaleco vem até o portão com um sorriso profissional.',
    '"A gente faz visita monitorada às quintas." Ela é gentil de verdade. "Posso agendar?"',
    '"Hoje é quinta."',
    'O sorriso não cai, mas atrasa meio segundo. "Então venha. Sério. A gente tem orgulho do que faz aqui."',
    'E é isso que te desarma: ela tem orgulho mesmo.'
  ],
  ef:{flag:'visita_monitorada'},
  escolhas:[{texto:'Entrar na visita monitorada.', vai:'c19_visita'}]
},

c19_visita:{
  texto:[
    'A visita monitorada mostra as incubadoras.',
    'São bonitas. É a palavra: bonitas. Fileiras de câmaras de vidro com controle de umidade, cada uma com um ovo ou um filhote recém-saído, com temperatura registrada a cada quinze minutos.',
    'A técnica explica o processo com um cuidado que é indistinguível de amor.',
    '"A taxa de sobrevivência aqui é 96%." Ela fala com orgulho legítimo. "Na natureza, no mesmo nicho, é 31%."',
    'Ela não está mentindo. Nada do que ela diz na próxima meia hora é mentira.',
    d=>d.flags.sabe_do_galpao_do_fundo
       ? 'E o tempo todo, no fim do terreno, tem um galpão sem janela para o qual a visita não vai.'
       : 'A visita termina no refeitório, com café e um folheto.'
  ],
  ef:{flag:'viu_as_incubadoras'},
  escolhas:[
    {texto:'Perguntar sobre o galpão do fundo.', vai:'c19_pergunta_galpao'},
    {texto:'Sair da visita e ir ao galpão do fundo sozinho.', vai:'c19_galpao'},
    {texto:'Aceitar o café e ir embora.', vai:'c19_foi_embora'}
  ]
},

c19_pergunta_galpao:{
  texto:[
    '"E aquele galpão?"',
    'A técnica olha para onde você aponta e a resposta dela é boa demais para ser improvisada:',
    '"Processamento de material não viável."',
    'Ela continua sorrindo. É a mesma pessoa que passou meia hora falando de umidade com amor.',
    '"Material não viável."',
    '"Sim." Ela consulta o relógio. "A visita termina no refeitório. Tem café."'
  ],
  ef:{flag:'ouviu_material_nao_viavel'},
  escolhas:[
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Tomar o café e ir embora.', vai:'c19_foi_embora'}
  ]
},

c19_cerca_mar:{
  texto:['Pelo lado do mar a cerca chega até a pedra e a pedra é escorregadia.'],
  teste:{status:'forca', dificuldade:7, nomeStatus:'Força',
         critico:'c19_dentro', sucesso:'c19_dentro', parcial:'c19_dentro_visto', falha:'c19_caiu'}
},

c19_caiu:{
  texto:[
    'Você escorrega na pedra molhada e cai três metros dentro do terreno.',
    'O barulho é grande. Duas pessoas de macacão aparecem em quarenta segundos.',
    'Eles não te agridem. Um deles pergunta se você quebrou alguma coisa e o outro já está chamando a enfermaria.',
    'Você é atendido, enfaixado e escoltado até a portaria, e alguém pede desculpa pela cerca ser perigosa.'
  ],
  ef:{hp:-6, causa:'Queda na cerca da Estação 4', flag:'caiu_na_estacao'},
  escolhas:[
    {texto:'Voltar a tentar entrar.', vai:'c19_cerca'},
    {texto:'Pedir a visita monitorada, já que estão sendo tão gentis.', vai:'c19_visita'}
  ]
},

c19_caminhao:{
  texto:[
    'O caminhão de insumos chega às 11h. Ração, meio de cultura, embalagem.',
    'Você entra atrás dele a pé, encostado na lateral, e ninguém olha — porque ninguém aqui está esperando invasão.',
    'É uma estação de pesquisa numa rota litorânea. O sistema de segurança deles foi desenhado contra vandalismo, não contra você.'
  ],
  ef:{flag:'entrou_com_caminhao'},
  escolhas:[{texto:'Seguir para dentro.', vai:'c19_dentro'}]
},

c19_dentro_visto:{
  texto:[
    'Você entra, e um técnico te vê de longe e acena.',
    'Acena. Porque você está dentro de uma área restrita, e portanto você deve ser autorizado, porque pessoas não autorizadas não estão dentro de áreas restritas.',
    'Você acena de volta.',
    'Essa é a falha de segurança mais eficaz que existe e não custou nada.'
  ],
  ef:{flag:'entrou_acenando'},
  escolhas:[{texto:'Ir adiante.', vai:'c19_dentro'}]
},

c19_dentro:{
  texto:[
    'Por dentro, a Estação 4 é um complexo de quatro galpões ligados por corredores cobertos.',
    'Galpão 1: incubadoras. Galpão 2: berçário. Galpão 3: "adaptação" — um viveiro coberto de meio hectare, com mato plantado em grade, onde as unidades aprendem a ser Pokémon selvagens.',
    'Você fica olhando o galpão 3 por muito tempo. Tem trinta e poucos Pokémon lá dentro. Eles se comportam quase certo. Quase.',
    'Um Rattata corre em linha reta até a parede, para, e volta. Depois faz de novo. Depois de novo.',
    'Nenhum deles sabe o que fazer com um espaço que tem borda.',
    d=>d.flags.sabe_do_galpao_do_fundo ? 'E tem o galpão 4, no fundo, sem janela, com uma porta de aço e um sistema de ventilação grande demais para o tamanho do prédio.' : 'E tem um galpão 4, no fundo, sem janela.'
  ],
  ef:{flag:'viu_o_galpao_3', instabilidade:1,
      registrar:'Viu o galpão de adaptação: unidades aprendendo a ser selvagens dentro de uma grade.'},
  escolhas:[
    {texto:'Ir ao galpão 4.', vai:'c19_galpao'},
    {texto:'Abrir o galpão 3 e soltar as trinta e poucas.', vai:'c19_soltar_g3'},
    {texto:'Procurar o arquivo genético.', vai:'c19_arquivo'},
    {texto:'Procurar o Dr. Sena.', vai:'c19_sena'}
  ]
},

c19_soltar_g3:{
  texto:[
    'Você abre o portão do galpão 3.',
    'Nada acontece por quase um minuto.',
    'Depois um Nidoran sai — e para, a dois metros da porta, no meio do corredor coberto, e não anda mais.',
    'Nenhum dos outros sai.',
    'Eles não sabem o que é "fora". Eles nasceram numa bandeja, cresceram numa grade, e a grade é o mundo inteiro que eles conhecem.',
    'Você fica ali segurando um portão aberto por onze minutos e sai um total de três unidades, e as três ficam paradas no corredor esperando alguém dizer o que fazer.'
  ],
  ef:{flag:'tentou_soltar_g3', instabilidade:1,
      rep:{eixo:'bom',delta:1,motivo:'Tentou libertar unidades que não sabem o que é liberdade'},
      registrar:'Abriu o galpão 3. Três saíram e ficaram paradas no corredor.'},
  escolhas:[
    {texto:'Carregar as três para fora da estação.', vai:'c19_carregou_tres'},
    {texto:'Fechar o portão. Isso não é soltar, é abandonar.', vai:'c19_fechou_g3',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Entendeu que abrir a porta não era soltar'}}},
    {texto:'Ir ao galpão 4.', vai:'c19_galpao'}
  ]
},

c19_carregou_tres:{
  texto:[
    'Você carrega as três até a cerca e as coloca do lado de fora, no mato de verdade.',
    'Duas ficam paradas. A terceira anda uns dez metros, encontra um Pidgey silvestre, e é imediatamente atacada — porque território existe, e ela não sabe disso.',
    'Ela não revida. Não sabe revidar.',
    'Você tem que intervir. Você intervém.',
    'E fica ali, na beira da Rota 21, com três coisas que não sabem viver no lugar onde você acabou de colocá-las.'
  ],
  ef:{flag:'levou_tres_unidades',
      executar:d=>{
        const p = unidadeComissao(29, 24, '4-J');
        p.moral = 5;
        Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${nomeExib(p)} ficou com você. As outras duas você levou ao Centro Pokémon de Fuchsia, que não soube o que registrar na ficha.`}];
      },
      rep:{eixo:'bom',delta:2,motivo:'Assumiu a responsabilidade por três unidades que não sabem viver soltas'},
      registrar:'Tirou três unidades da Estação 4 e descobriu que elas não sobrevivem sozinhas.'},
  escolhas:[{texto:'Voltar para dentro.', vai:'c19_galpao'}]
},

c19_fechou_g3:{
  texto:[
    'Você fecha o portão.',
    'É a decisão mais difícil do dia e ela parece covardia e não é.',
    'Soltar uma coisa que não sabe viver solta não é liberdade. É só o mesmo abandono com uma palavra melhor.'
  ],
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_arquivo:{
  texto:[
    'O arquivo genético fica numa sala refrigerada do galpão 2. Não tem guarda — tem controle de temperatura e um alarme de temperatura.',
    'São gavetas. Centenas de gavetas com amostras etiquetadas por espécie, lote e origem.',
    'Muitas dizem "ZS-7". Algumas dizem "SPH-11". Sete dizem "IL-SN" e a etiqueta é mais nova que as outras.',
    d=>d.flags.chegou_na_ilha ? '"IL-SN". Ilha Sem Nome. Eles conseguiram material lá em alguma das expedições anteriores à sua.' : '"IL-SN". Você não sabe o que é e sabe que é ruim.',
    'E, numa gaveta sozinha, refrigerada em separado, com dois cadeados: "MATRIZ 01".'
  ],
  ef:{flag:['achou_o_arquivo','sabe_da_matriz01'], instabilidade:1,
      registrar:'Encontrou o arquivo genético. Uma gaveta com dois cadeados: MATRIZ 01.'},
  escolhas:[
    {texto:'Destruir o arquivo inteiro.', vai:'c19_destruiu_arquivo'},
    {texto:'Levar só a MATRIZ 01.', vai:'c19_levou_matriz'},
    {texto:'Fotografar tudo e deixar como está.', vai:'c19_fotografou_arquivo'},
    {texto:'Ir ao galpão 4.', vai:'c19_galpao'}
  ]
},

c19_destruiu_arquivo:{
  texto:[
    'Você desliga a refrigeração e abre todas as gavetas.',
    'Leva quatro minutos. Depois disso, a temperatura sobe sozinha, e em duas horas não existe mais nada de aproveitável ali.',
    'Você destruiu dezenove anos de coleta do setor 7, sete cargas do depósito de Celadon e o material do andar 11.',
    'Você também destruiu as únicas amostras que existiam de duas linhagens que a Zona Safári perdeu em 2019.',
    'As duas coisas são verdade. Você vai ter que decidir com qual delas dorme.'
  ],
  ef:{flag:['destruiu_o_arquivo','atrasou_a_comissao'], instabilidade:-1,
      rep:{eixo:'bom',delta:2,motivo:'Destruiu o arquivo genético da Comissão'},
      registrar:'Destruiu o arquivo genético inteiro da Estação 4.'},
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_levou_matriz:{
  texto:[
    'Os dois cadeados são bons. A gaveta não é.',
    'Dentro: um tubo de vinte centímetros numa caixa de transporte com bateria própria e visor de temperatura.',
    'A etiqueta diz MATRIZ 01 e embaixo, em letra menor: "origem: CIN-88 / FUJI, K."',
    'Você está segurando a coisa de que Mewtwo foi feito.',
    'E, pelas atas, a coisa de que a Fase III vai ser feita.'
  ],
  ef:{flag:['carrega_a_matriz','atrasou_a_comissao'],
      rep:{eixo:'bom',delta:1,motivo:'Tirou a MATRIZ 01 das mãos da Comissão'},
      registrar:'Está carregando a MATRIZ 01 — o material de origem de Mewtwo.'},
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_fotografou_arquivo:{
  texto:[
    'Você fotografa as etiquetas, as gavetas, a sala, a MATRIZ 01 com os dois cadeados.',
    'Trinta e uma fotos.',
    'É prova de que a origem do material é o setor 7, é Celadon, é a Silph e é uma ilha sem nome. É a cadeia inteira num arquivo só.',
    'E você deixa tudo exatamente onde estava, porque prova mexida é prova contestada.'
  ],
  ef:{flag:['provas_do_viveiro','escolha_fria'],
      rep:{eixo:'bom',delta:2,motivo:'Documentou a cadeia inteira do material genético'},
      registrar:'Fotografou o arquivo genético: 31 fotos ligando ZS-7, Celadon, SPH-11 e a ilha.'},
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_sena:{
  texto:[
    'O Dr. Sena está no galpão 2, de jaleco, anotando numa prancheta, e reconhece você antes de você se apresentar.',
    '"Ah." Ele não corre, não chama segurança, não parece nem um pouco surpreso. "O do andar 11."',
    '"Você estava lá."',
    '"Eu era o terceiro na cadeia. Eu assinava o que o segundo aprovava." Ele continua anotando. "Quando lacraram, eu vim pra cá com o projeto. Como quem muda de sala."',
    'Ele finalmente levanta a cabeça.',
    '"Você quer saber o que eu acho, de verdade? Eu acho que a gente estava errado no andar 11 e certo aqui."',
    '"Lá a gente tentou fazer uma mente. Aqui a gente faz população. Mente pergunta coisa. População não."'
  ],
  ef:{npc:{nome:'Dr. Sena', opiniao:0, memoria:'Migrou do andar 11 para a Estação 4 "como quem muda de sala".'},
      flag:'conheceu_sena'},
  escolhas:[
    {texto:'"E o galpão 4?"', vai:'c19_sena_galpao'},
    {texto:'Atacar.', vai:'c19_luta_sena'},
    {texto:'Ir ao galpão 4 sem ele.', vai:'c19_galpao'}
  ]
},

c19_sena_galpao:{
  texto:[
    '"E o galpão 4?"',
    'Ele para de anotar.',
    '"Art. 19." Ele diz o número do artigo como quem diz o nome de uma doença. "Unidade que não atinge parâmetro de viabilidade é descartada."',
    '"Quantas não atingem?"',
    '"Trinta e um por cento."',
    'Você faz a conta da Fase II na cabeça: quatrocentas unidades liberadas. Trinta e um por cento a mais produzidas e não liberadas.',
    '"Cento e oitenta."',
    '"Cento e oitenta" ele confirma, e volta a anotar, porque a prancheta dele tem uma coluna pra isso.'
  ],
  ef:{flag:['sabe_do_descarte','entendeu_o_galpao4'], instabilidade:1,
      registrar:'31% das unidades não atingem viabilidade. São descartadas no galpão 4.'},
  escolhas:[
    {texto:'Ir ao galpão 4.', vai:'c19_galpao'},
    {texto:'Atacar.', vai:'c19_luta_sena'}
  ]
},

c19_luta_sena:{
  texto:['"Eu esperava isso." Sena põe a prancheta na bancada com cuidado. "Eu sempre espero isso."'],
  batalha:{comissao:'tecnico', nivel:54, tipo:'treinador', treinador:'Dr. Sena', fuga:true,
           vitoria:'c19_venceu_sena', derrota:'c19_perdeu_sena', fuga2:'c19_galpao', gameover:'gameover'}
},

c19_venceu_sena:{
  texto:[
    'As quatro unidades dele caem e ficam onde caíram, esperando.',
    'Sena recolhe uma por uma com o mesmo cuidado com que pousou a prancheta.',
    '"Você sabe o que me incomoda?" Ele não parece abalado. "Que você acha que isso aqui foi uma vitória moral."',
    '"Você derrotou quatro unidades de lote. A gente produz quatro unidades de lote em dezoito dias."',
    'Ele guarda a última bola. "O galpão 4 fica no fim do corredor. A porta não está trancada. Nunca esteve."'
  ],
  ef:{flag:'venceu_sena',
      rep:{eixo:'bom',delta:1,motivo:'Derrotou o técnico-chefe do viveiro'},
      npc:{nome:'Dr. Sena', opiniao:-1, memoria:'Perdeu para você e te disse que o galpão 4 nunca esteve trancado.'}},
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_perdeu_sena:{
  texto:[
    'Você perde, e ele não comemora, e chama a enfermaria pro seu time.',
    'Enquanto os seus Pokémon são atendidos por uma equipe competente e educada, Sena volta a anotar na prancheta.',
    '"A porta do galpão 4 nunca esteve trancada", ele diz, sem levantar a cabeça. "Vai lá. Sério. Eu prefiro que as pessoas vejam."'
  ],
  ef:{hp:-4, causa:'Derrota no viveiro', curaTime:true},
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_galpao:{
  texto:[
    'A porta do galpão 4 não está trancada.',
    'Por dentro, não tem incubadora, não tem grade e não tem gaiola.',
    'Tem uma esteira, uma bancada de aço com dreno, um forno industrial e uma prancheta pendurada num prego.',
    'A prancheta tem uma planilha. Data, lote, quantidade, responsável, assinatura.',
    'A última linha é de anteontem. O campo "quantidade" diz 14.',
    'O forno está desligado agora. O galpão inteiro cheira a desinfetante industrial do tipo que se usa depois, não antes.',
    'Não tem nada de ilegal aqui. Está tudo previsto no Art. 19, que foi aprovado por onze votos a um, e a ata é pública, e custa oito reais.'
  ],
  ef:{flag:['viu_o_galpao4','tem_sangue_nas_maos_deles'], instabilidade:2,
      registrar:'Viu o galpão 4: esteira, bancada com dreno, forno e uma planilha de descarte.'},
  escolhas:[
    {texto:'Fotografar tudo.', vai:'c19_fotografou_galpao'},
    {texto:'Destruir o galpão.', vai:'c19_destruiu_galpao'},
    {texto:'Pegar a prancheta.', vai:'c19_pegou_prancheta'},
    {texto:'Sair. Você não aguenta ficar aqui.', vai:'c19_saiu_galpao'}
  ]
},

c19_fotografou_galpao:{
  texto:[
    'Você fotografa a esteira, o dreno, o forno e as trinta e nove páginas da planilha, uma por uma, com a mão tremendo nas primeiras seis.',
    'A planilha tem dois anos. Dá pra somar.',
    'Você soma.',
    'O número é quatro dígitos.'
  ],
  ef:{flag:['provas_do_galpao4','provas_do_viveiro'],
      rep:{eixo:'bom',delta:3,motivo:'Documentou o galpão 4 inteiro'},
      registrar:'Fotografou a planilha de descarte. Dois anos. Quatro dígitos.'},
  escolhas:[{texto:'Sair.', vai:'c19_saida'}]
},

c19_pegou_prancheta:{
  texto:[
    'Você tira a prancheta do prego e leva.',
    'É o objeto mais pesado que você já carregou e ele pesa trezentos gramas.'
  ],
  ef:{flag:['provas_do_galpao4','provas_do_viveiro'],
      rep:{eixo:'bom',delta:2,motivo:'Levou a planilha de descarte do galpão 4'},
      registrar:'Levou a prancheta do galpão 4.'},
  escolhas:[{texto:'Sair.', vai:'c19_saida'}]
},

c19_destruiu_galpao:{
  texto:[
    'Você destrói o galpão 4.',
    'A esteira, a bancada, o forno, o dreno. Leva vinte minutos e faz muito barulho e ninguém vem.',
    'Ninguém vem porque todo mundo aqui sabe o que é esse galpão e ninguém quer estar dentro dele hoje.',
    'Quando acaba, você está de pé no meio de uma sala destruída e o número da planilha continua sendo quatro dígitos, e o forno vai ser substituído em duas semanas pelo seguro.'
  ],
  ef:{flag:['destruiu_o_galpao4'],
      rep:{eixo:'bom',delta:1,motivo:'Destruiu o galpão de descarte'},
      hp:-3, causa:'Vinte minutos destruindo um galpão',
      registrar:'Destruiu o galpão 4. Será substituído em duas semanas.'},
  escolhas:[
    {texto:'Pegar a prancheta antes de sair.', vai:'c19_pegou_prancheta'},
    {texto:'Sair.', vai:'c19_saida'}
  ]
},

c19_saiu_galpao:{
  texto:[
    'Você sai do galpão 4 depois de quarenta segundos lá dentro e senta no chão do corredor coberto.',
    'Passa um técnico. Ele te vê sentado, entende exatamente de onde você saiu, e não diz nada.',
    'Ele te traz um copo de água e continua o turno dele.'
  ],
  ef:{hp:-2, causa:'O galpão 4'},
  escolhas:[{texto:'Levantar.', vai:'c19_saida'}]
},

c19_foi_embora:{
  texto:[
    'Você toma o café, pega o folheto e vai embora pela portaria.',
    'O folheto tem um gráfico de sobrevivência e a frase "conservação de segunda geração".',
    'Você lê esse folheto umas quinze vezes nos dias seguintes.'
  ],
  ef:{flag:'so_a_visita'},
  escolhas:[{texto:'Seguir.', vai:'c19_fim'}]
},

c19_saida:{
  texto:[
    'Na saída da Estação 4 tem alguém encostada num carro no estacionamento.',
    'Auditora Prado. Ela não faz nenhum movimento de te impedir.',
    '"Você viu o galpão."',
    '"Vi."',
    'Ela assente devagar.',
    d=>d.flags.cracha_adnan
      ? '"O crachá que você usou é do Adnan." Ela olha o chão. "O sistema me avisou às 9h41. Eu tinha quarenta e oito horas pra reportar e eu reportei às 9h44, porque se eu não reportasse eles descobririam de qualquer jeito e aí seríamos dois."'
      : '"Eu não vou te deter. Não tem crime. Isso é o mais difícil de explicar pra quem chega até aqui: não tem crime."'
  ],
  ef:{npc:{nome:'Auditora Prado', memoria:'Te esperou no estacionamento depois que você viu o galpão 4.'}},
  escolhas:[
    {texto:'"Como você dorme?"', vai:'c19_pergunta_prado'},
    {texto:'"Me leva até a Presidente."', vai:'c19_leva_presidente'},
    {texto:'Passar por ela sem falar nada.', vai:'c19_fim'}
  ]
},

c19_pergunta_prado:{
  texto:[
    '"Como você dorme?"',
    'Ela demora muito pra responder, e a demora é a resposta.',
    '"Eu tenho uma filha de seis anos." Ela abre a porta do carro. "Em 2019 um Rhyhorn entrou num quintal em Fuchsia e matou um menino de nove."',
    '"Eu fui na ocorrência. Eu era da Liga na época."',
    '"E aí você entrou nisso."',
    '"E aí eu entrei nisso." Ela entra no carro. "Eu não estou te dizendo que estou certa. Eu estou te dizendo por quê, que é diferente, e eu sei a diferença."',
    'É a terceira vez nesta jornada que alguém te diz exatamente essa frase.'
  ],
  ef:{flag:'prado_explicou',
      npc:{nome:'Auditora Prado', opiniao:4, memoria:'Te contou do menino de nove anos em Fuchsia, em 2019.'},
      rep:{eixo:'bom',delta:1,motivo:'Ouviu o motivo de alguém em vez de só o argumento'}},
  escolhas:[
    {texto:'"Me leva até a Presidente."', vai:'c19_leva_presidente'},
    {texto:'Deixar ela ir.', vai:'c19_fim'}
  ]
},

c19_leva_presidente:{
  texto:[
    '"Me leva até a Presidente."',
    'Prado olha o galpão 4 por cima do seu ombro.',
    '"Segunda-feira, 10h, sala 704." Ela liga o carro. "Reunião ordinária do conselho. É aberta. Consta no estatuto."',
    '"Aberta?"',
    '"Art. 27. Qualquer interessado pode assistir e pedir a palavra." Ela fecha a porta. "Em um ano e oito meses, nenhum interessado apareceu."'
  ],
  ef:{flag:['convite_conselho','endereco_presidente'],
      npc:{nome:'Auditora Prado', opiniao:5, memoria:'Te disse a data, a hora e o número da sala da reunião do conselho.'},
      registrar:'Reunião ordinária do conselho: segunda, 10h, sala 704. É aberta ao público.'},
  escolhas:[{texto:'Ir para Saffron.', vai:'c19_fim'}]
},

c19_fim:{
  texto:[
    'Você sai da Rota 21 e o mato do lado de fora da cerca continua desorganizado, cheio de buraco, com Pokémon brigando por território e morrendo de doença e vivendo trinta e um por cento.',
    'É feio. É muito mais feio que os oito hectares que você acabou de deixar.',
    'E ainda assim, quando você olha pra trás pela última vez, você sabe qual dos dois lados da cerca você escolheria pra nascer.',
    d=>d.flags.convite_conselho
       ? 'Segunda-feira, 10h, sala 704, Saffron. Aberta a qualquer interessado. Em um ano e oito meses, nenhum apareceu.'
       : 'Em algum lugar de Saffron tem uma sala onde onze pessoas votaram e uma perdeu.'
  ],
  fim:true, resumo:'Capítulo 19 concluído — o número da planilha tem quatro dígitos.'
}
}}

);
