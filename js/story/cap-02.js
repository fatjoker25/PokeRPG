/* ============================================================
   CAPÍTULO 2 — GENTE BOA E GENTE COMUM
   ============================================================ */
CAPITULOS.push(

{
num:2, titulo:'Gente Boa e Gente Comum', local:'Viridian', ambiente:'cidade', nivelArea:7,
tom:'leve', inicio:'c2_mural',
cenas:{

c2_mural:{
  texto:[
    'O Centro Pokémon de Viridian é três vezes maior que o posto da sua cidade e tem uma máquina de café que funciona.',
    'Na parede da entrada, o mural de recados: uma placa de cortiça de dois metros por um, coberta de papel em três camadas.',
    'Você fica ali mais tempo do que pretendia.',
    '"Procuro meu Growlithe. Sumiu dia 4 perto da Rota 22. Recompensa." — com uma foto colada, tirada de longe, meio tremida.',
    '"Meu filho saiu pra jornada em março. Se alguém vir, diz que a mãe não tá brava." — sem foto e sem nome.',
    '"COMPRO POKÉMON. QUALQUER UM. QUALQUER ESTADO." — letra de imprensa, sem telefone, só um horário e um lugar.',
    'E, escrito à mão com pressa e sublinhado três vezes, num pedaço de papel pardo:',
    '"NÃO ENTRE NA FLORESTA DE VIRIDIAN À NOITE."'
  ],
  ef:{flag:'leu_aviso_floresta', registrar:'Leu o mural de recados de Viridian.'},
  escolhas:[
    {texto:'Anotar o contato do Growlithe perdido. Pode ser que você o encontre.', vai:'c2_growlithe',
     ef:{flag:'anotou_growlithe'}},
    {texto:'Arrancar o cartaz de quem compra Pokémon.', vai:'c2_arrancou'},
    {texto:'Perguntar à atendente sobre o aviso da floresta.', vai:'c2_pergunta_floresta'},
    {texto:'Ler tudo e não mexer em nada.', vai:'c2_leu_tudo'}
  ]
},

c2_growlithe:{
  texto:[
    'Você anota o telefone no verso da sua licença, que é o único papel que você tem.',
    'A foto é de um Growlithe deitado no tapete de uma sala, com uma pata em cima do controle da televisão.',
    'Alguém tirou essa foto rindo. Dá pra ver pelo ângulo torto.',
    'A data no cartaz é de dezenove dias atrás.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Anotou o contato de quem perdeu um Pokémon'}},
  escolhas:[
    {texto:'Perguntar à atendente sobre o aviso da floresta.', vai:'c2_pergunta_floresta'},
    {texto:'Arrancar o cartaz de quem compra Pokémon.', vai:'c2_arrancou'},
    {texto:'Ir ver quem é o garoto que está sentado na escada.', vai:'c2_teo'},
    {texto:'Sair do Centro.', vai:'c2_saida_centro'}
  ]
},

c2_arrancou:{
  texto:[
    'Você tira o cartaz do mural. Ele sai inteiro, com a tachinha.',
    'A atendente vê. Não fala nada. Volta pro computador dela.',
    'Dez minutos depois, quando você olha de novo, tem um cartaz igual no mesmo lugar.',
    'A atendente continua sem falar nada, e agora o silêncio dela diz uma coisa completamente diferente.'
  ],
  ef:{flag:'arrancou_o_cartaz',
      rep:{eixo:'bom',delta:1,motivo:'Arrancou o cartaz de quem compra Pokémon'}},
  escolhas:[
    {texto:'"Quem cola isso aqui?"', vai:'c2_quem_cola'},
    {texto:'Arrancar de novo.', vai:'c2_arrancou_dnv'},
    {texto:'Deixar pra lá e ir ver o garoto na escada.', vai:'c2_teo'},
    {texto:'Sair do Centro.', vai:'c2_saida_centro'}
  ]
},

c2_quem_cola:{
  texto:[
    '"Quem cola isso aqui?"',
    'A atendente demora pra responder e escolhe as palavras.',
    '"O mural é público. Qualquer um cola qualquer coisa."',
    '"E se for crime?"',
    '"Aí eu ligo pra Liga e a Liga manda um oficial em dois dias e o oficial tira o cartaz." Ela finalmente olha pra você. "E no terceiro dia tem outro cartaz."',
    '"Eu já liguei quatro vezes. Eu paro de ligar quando?"',
    'Ela pergunta isso de verdade, como quem quer mesmo a resposta.'
  ],
  ef:{flag:'sabe_do_cartaz',
      npc:{nome:'Atendente de Viridian', opiniao:2, memoria:'Te perguntou quando é que ela deve parar de ligar para a Liga.'}},
  escolhas:[
    {texto:'"Nunca."', vai:'c2_nunca', ef:{rep:{eixo:'bom',delta:1,motivo:'Disse a alguém cansado para não parar'}}},
    {texto:'"Eu não sei."', vai:'c2_nao_sei_cartaz'},
    {texto:'"Quando cansar. Todo mundo cansa."', vai:'c2_nao_sei_cartaz'},
    {texto:'Não responder e ir embora.', vai:'c2_saida_centro'}
  ]
},

c2_nunca:{
  texto:[
    '"Nunca."',
    'Ela ri — cansada, mas ri.',
    '"É fácil falar com quinze anos."',
    '"É."',
    '"Mas é bom ouvir." Ela volta pro computador. "Boa jornada. E olha: guarda esse telefone do Growlithe. A mulher liga aqui toda terça."'
  ],
  ef:{flag:'anotou_growlithe'},
  escolhas:[{texto:'Ir ver o garoto na escada.', vai:'c2_teo'}]
},

c2_nao_sei_cartaz:{
  texto:[
    'Ela assente devagar, como quem recebeu a resposta que esperava.',
    '"É." Volta pro computador. "Também acho."',
    'Você fica com a sensação exata de ter falhado num teste que ninguém disse que era um teste.'
  ],
  escolhas:[{texto:'Ir ver o garoto na escada.', vai:'c2_teo'}]
},

c2_arrancou_dnv:{
  texto:[
    'Você arranca de novo. E de novo, quando aparece o terceiro.',
    'No quarto, a atendente vem com uma fita adesiva e cola no lugar um papel seu, escrito à mão, que diz: "ESTE MURAL É FISCALIZADO."',
    'Não é verdade. Ela escreveu na hora.',
    '"Vai funcionar por umas duas semanas", ela diz, voltando pro balcão. "Depois eles voltam."',
    '"E aí?"',
    '"E aí eu escrevo outro."'
  ],
  ef:{flag:'aliou_a_atendente',
      rep:{eixo:'bom',delta:2,motivo:'Insistiu numa coisa pequena até virar coisa de duas pessoas'},
      npc:{nome:'Atendente de Viridian', opiniao:5, memoria:'Vocês dois enfrentaram um cartaz de cortiça por meia hora. Ela não esqueceu.'}},
  escolhas:[{texto:'Ir ver o garoto na escada.', vai:'c2_teo'}]
},

c2_pergunta_floresta:{
  texto:[
    '"O que tem na Floresta de Viridian à noite?"',
    'A atendente para o que está fazendo, o que já responde metade.',
    '"Nada que a gente possa dizer oficialmente."',
    '"E não oficialmente?"',
    'Ela olha os lados, o que é engraçado num salão vazio.',
    '"Quatro pessoas registraram ocorrência esse ano. Duas falaram de gente. Duas falaram de bicho." Ela baixa a voz. "As duas que falaram de gente descreveram a mesma pessoa."'
  ],
  ef:{flag:['leu_aviso_floresta','sabe_das_ocorrencias'],
      registrar:'Quatro ocorrências na Floresta de Viridian este ano. Duas descreveram a mesma pessoa.'},
  escolhas:[
    {texto:'"Descreveram como?"', vai:'c2_descricao'},
    {texto:'"Então eu vou de dia."', vai:'c2_vou_de_dia'},
    {texto:'Agradecer e ir ver o garoto na escada.', vai:'c2_teo'},
    {texto:'"E ninguém faz nada?"', vai:'c2_quem_cola'}
  ]
},

c2_descricao:{
  texto:[
    '"Homem, quarenta e poucos, roupa boa demais pra mato." Ela recita de memória. "Carregando rolo de fio de aço no ombro, sem disfarçar."',
    '"Fio de aço."',
    '"Fio de aço." Ela volta ao computador. "Eu anotei a ocorrência duas vezes com essa mesma frase e mandei as duas pra Liga."',
    'Você vai lembrar dessa conversa daqui a uns dois dias, dentro de uma clareira, olhando um fio de aço amarrado numa estaca.'
  ],
  ef:{flag:'sabe_do_fio_de_aco',
      rep:{eixo:'bom',delta:1,motivo:'Perguntou o suficiente para receber a resposta inteira'}},
  escolhas:[{texto:'Ir ver o garoto na escada.', vai:'c2_teo'}]
},

c2_vou_de_dia:{
  texto:[
    '"Então eu vou de dia."',
    '"É o que todo mundo fala." Ela dá de ombros sem maldade. "E a floresta tem quatro horas de travessia, e ninguém sai de manhã cedo, e todo mundo entra depois do almoço."',
    'Ela olha o relógio da parede de propósito.',
    'São duas e quarenta.'
  ],
  escolhas:[{texto:'Ir ver o garoto na escada.', vai:'c2_teo'}]
},

c2_leu_tudo:{
  texto:[
    'Você lê o mural inteiro, camada por camada, levantando os papéis de cima para ver os de baixo.',
    'Tem coisa de três anos atrás ali embaixo. Tem um pedido de emprego. Tem um desenho de criança.',
    'Tem um bilhete que diz só "obrigado" e nada mais, e você fica um tempo tentando entender de quem para quem.',
    'Quando você se afasta, percebe que alguém está sentado na escada do outro lado do saguão, olhando você ler o mural há um tempo.'
  ],
  escolhas:[
    {texto:'Ir falar com ele.', vai:'c2_teo'},
    {texto:'Perguntar à atendente sobre o aviso da floresta.', vai:'c2_pergunta_floresta'},
    {texto:'Fingir que não viu e sair.', vai:'c2_saida_centro'},
    {texto:'Ficar lendo o mural mais um pouco, de propósito.', vai:'c2_provocou'}
  ]
},

c2_provocou:{
  texto:[
    'Você continua lendo. Sabendo que ele está olhando.',
    'Dura quase dois minutos. Depois ele desiste, levanta da escada, e vem até você.',
    '"Você lê rápido."',
    '"Você olha muito."',
    '"É." Ele não fica constrangido. "É que eu tô aqui desde as seis da manhã e você é a primeira pessoa com quem eu falo hoje."'
  ],
  escolhas:[{texto:'Ouvir.', vai:'c2_teo'}]
},

c2_teo:{
  texto:[
    'Ele tem mais ou menos a sua idade e a roupa dele é nova demais, do jeito de quem comprou tudo de uma vez pra viagem.',
    '"Téo." Ele estende a mão antes de você oferecer. "Eu tava numa pedra na Rota 1 desde as seis da manhã esperando alguém passar."',
    '"E ninguém passou?"',
    '"Passaram três. Duas eram adultas e uma me ignorou." Ele diz isso sem nenhuma autopiedade, o que é impressionante. "Aí eu vim pra cá, porque no Centro pelo menos tem gente."',
    'Ele já está com a mão no cinto. Não é ameaça — é ansiedade.',
    '"Você é treinador, né? Tipo, de verdade, com licença e tudo?"'
  ],
  ef:{npc:{nome:'Téo', opiniao:1, memoria:'Esperou numa pedra na Rota 1 desde as seis da manhã. Você foi a primeira pessoa que falou com ele.'},
      registrar:'Conheceu Téo no Centro Pokémon de Viridian.'},
  escolhas:[
    {texto:'"Sou. Quer lutar?"', vai:'c2_batalha_teo'},
    {texto:'Sentar na escada com ele antes.', vai:'c2_conversa'},
    {texto:'"Tô com pressa." E sair.', vai:'c2_recusa',
     ef:{npc:{nome:'Téo', opiniao:-1, memoria:'Você recusou a primeira batalha dele.'}}},
    {texto:'"Por que você tava esperando numa pedra?"', vai:'c2_pergunta_pedra'}
  ]
},

c2_pergunta_pedra:{
  texto:[
    '"Por que você tava esperando numa pedra?"',
    'Ele demora pra responder e a resposta é mais honesta do que a pergunta merecia.',
    '"Porque eu não sei ir sozinho." Ele olha o próprio tênis. "Tipo — eu sei andar. Eu não sei... ir."',
    '"Meu pai falou que eu não duro uma semana. Não de maldade, sabe? Ele falou tipo estatística."',
    '"E aí eu sentei na pedra e fiquei esperando aparecer alguém que fosse na mesma direção."',
    'Ele finalmente te olha. "Achei que ia ser mais fácil."'
  ],
  ef:{flag:'teo_abriu_o_jogo',
      npc:{nome:'Téo', opiniao:3, memoria:'Te contou, no primeiro dia, que não sabia ir sozinho.'}},
  escolhas:[
    {texto:'"Ninguém sabe. A gente só vai."', vai:'c2_conversa',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Disse a coisa certa para alguém com medo'},
         npc:{nome:'Téo', opiniao:2, memoria:'Você disse que ninguém sabe ir sozinho.'}}},
    {texto:'"Então volta pra casa."', vai:'c2_mandou_voltar',
     ef:{rep:{eixo:'ruim',delta:1,motivo:'Mandou alguém desistir no primeiro dia'},
         npc:{nome:'Téo', opiniao:-3, memoria:'Você mandou ele voltar pra casa no primeiro dia.'}}},
    {texto:'"Seu pai é um idiota."', vai:'c2_conversa',
     ef:{npc:{nome:'Téo', opiniao:2, memoria:'Você chamou o pai dele de idiota. Ele riu por quase um minuto.'}}},
    {texto:'Não dizer nada e esperar ele continuar.', vai:'c2_conversa',
     ef:{npc:{nome:'Téo', opiniao:1, memoria:'Você ficou calado e deixou ele falar. Foi o suficiente.'}}}
  ]
},

c2_mandou_voltar:{
  texto:[
    '"Então volta pra casa."',
    'Silêncio.',
    '"É." Ele assente muito devagar. "É, talvez."',
    'Ele não vai voltar pra casa. Ele vai continuar, e vai continuar sozinho, e vai lembrar dessa frase todas as vezes em que der errado.',
    '"Boa sorte aí." Ele estende a mão de novo, o que é pior do que se ele não estendesse.'
  ],
  escolhas:[
    {texto:'Apertar a mão e ir embora.', vai:'c2_saida_centro'},
    {texto:'"Espera. Desculpa. Eu falei merda."', vai:'c2_desculpa'}
  ]
},

c2_desculpa:{
  texto:[
    '"Espera. Desculpa. Eu falei merda."',
    'Ele para no meio do movimento de guardar o cinto.',
    '"Falou." Ele não facilita. "Mas todo mundo fala. Você foi só o primeiro hoje."',
    'Ele senta na escada de novo e bate no degrau do lado.'
  ],
  ef:{npc:{nome:'Téo', opiniao:2, memoria:'Você falou merda e pediu desculpa em menos de dez segundos. Ele reparou nos dez segundos.'},
      rep:{eixo:'bom',delta:1,motivo:'Voltou atrás depressa'}},
  escolhas:[{texto:'Sentar.', vai:'c2_conversa'}]
},

c2_conversa:{
  texto:[
    'Vocês sentam na escada do Centro Pokémon de Viridian e conversam por quarenta minutos.',
    'Ele te conta que trouxe comida pra dois "por precaução" e não sabe explicar precaução de quê. Que decorou o mapa inteiro e já se perdeu duas vezes. Que o Pidgey dele se chama Pidgey porque ele não conseguiu decidir um nome e agora é tarde.',
    'Você conta alguma coisa também. Não tudo. Mas alguma coisa.',
    'Em algum momento a atendente traz dois copos de água sem ninguém pedir.',
    '"Agora a gente luta?" ele pergunta, e é impossível dizer não.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Sentou e ouviu um estranho por quarenta minutos'},
      npc:{nome:'Téo', opiniao:4, memoria:'Vocês sentaram na escada do Centro de Viridian e conversaram quarenta minutos no primeiro dia.'},
      flag:'teo_amigo', moral:5},
  escolhas:[{texto:'Lutar.', vai:'c2_batalha_teo'}]
},

c2_recusa:{
  texto:[
    '"Ah." Ele senta de novo na escada. "Tá."',
    'Você anda até a porta e ainda consegue sentir ele olhando.',
    'Na rua, você percebe que levou quatro segundos pra dizer que estava com pressa e que você não está com pressa nenhuma.'
  ],
  escolhas:[
    {texto:'Voltar.', vai:'c2_teo'},
    {texto:'Seguir em frente.', vai:'c2_saida_centro'}
  ]
},

c2_batalha_teo:{
  texto:[
    'Vocês saem pro pátio dos fundos do Centro, que existe exatamente pra isso e tem o chão marcado com tinta descascada.',
    'Téo joga a bola com mais força do que precisa. "VAI!"',
    'O Pidgey sai e pousa no chão em vez de voar, o que é errado, e Téo corrige ele em voz alta, e o Pidgey ignora.',
    'Nenhum dos dois faz ideia do que está fazendo. É a coisa mais honesta dessa cidade.'
  ],
  batalha:{dex:16, nivel:8, tipo:'treinador', treinador:'Téo', fuga:false,
           vitoria:'c2_pos_batalha', derrota:'c2_pos_derrota', gameover:'gameover'}
},

c2_pos_derrota:{
  texto:[
    'O seu último Pokémon senta no chão de tinta descascada e não levanta.',
    'Téo demora a entender que ganhou. Quando entende, não comemora — olha em volta primeiro, pra ver se teve gente vendo, e não teve.',
    '"Ô." Ele se aproxima com a carteira já na mão, o que é exatamente o contrário do que se faz. "Regra é regra, mas eu não vou pegar dinheiro de quem saiu de casa hoje."',
    'Ele guarda a carteira de novo. Fica evidente que ele ensaiou essa frase durante o combate inteiro e que ela saiu errada.',
    'A atendente aparece na porta dos fundos com dois frascos e não pergunta nada. Já viu isso mil vezes.'
  ],
  ef:{npc:{nome:'Téo', opiniao:1, memoria:'Ganhou de você no pátio do Centro de Viridian e se recusou a cobrar a aposta.'}},
  escolhas:[
    {texto:'"Pega o dinheiro. Você ganhou."', vai:'c2_derrota_insistiu',
     ef:{dinheiro:-200, rep:{eixo:'bom',delta:1,motivo:'Pagou uma aposta que o vencedor recusou'},
         npc:{nome:'Téo', opiniao:3, memoria:'Você insistiu pra ele aceitar o dinheiro que ele não quis cobrar.'}}},
    {texto:'Aceitar a piedade em silêncio e cuidar do seu time.', vai:'c2_derrota_silencio'},
    {texto:'"Foi sorte. Revanche."', vai:'c2_derrota_revanche',
     ef:{npc:{nome:'Téo', opiniao:-1, memoria:'Você chamou a vitória dele de sorte.'}}},
    {texto:'Perguntar o que ele fez que você não fez.', vai:'c2_derrota_aprendeu'}
  ]
},

c2_derrota_insistiu:{
  texto:[
    'Você põe as notas na mão dele. Ele olha o dinheiro como se fosse uma prova de alguma coisa.',
    '"Cara, eu não—"',
    '"Se você não pegar, não valeu. E eu não quero que não tenha valido."',
    'Ele guarda. Depois fica quieto de um jeito que você já vai aprender a reconhecer nele: é assim que ele fica quando alguém faz uma coisa decente com ele.',
    '"Então a revanche é de graça", ele decide. "Em Pewter."'
  ],
  escolhas:[
    {texto:'"Combinado."', vai:'c2_encontro_pewter'},
    {texto:'"Talvez." Não prometer nada.', vai:'c2_saida_centro'},
    {texto:'Perguntar o que ele fez que você não fez.', vai:'c2_derrota_aprendeu'}
  ]
},

c2_derrota_silencio:{
  texto:[
    'Você não diz nada. Pega seu time, agradece a atendente com a cabeça e senta no banco de concreto do pátio.',
    'Téo fica de pé perto, mudando o peso de um pé pro outro, esperando uma deixa que você não dá.',
    '"Todo mundo perde a primeira", ele fala, pro muro.',
    'É mentira. Ele não sabe se é mentira. Ele acabou de inventar isso e vai acreditar nisso pelo resto da vida, porque é o tipo de mentira que serve.'
  ],
  ef:{flag:'perdeu_a_primeira'},
  escolhas:[
    {texto:'"Não foi a primeira dele." Falar do Pidgey.', vai:'c2_critica'},
    {texto:'Perguntar o que ele fez que você não fez.', vai:'c2_derrota_aprendeu'},
    {texto:'Levantar e ir embora.', vai:'c2_saida_centro'},
    {texto:'"Te encontro em Pewter."', vai:'c2_encontro_pewter'}
  ]
},

c2_derrota_revanche:{
  texto:[
    '"Foi sorte. Revanche."',
    'A cara dele muda. Não fecha — desaba um pouco, que é pior.',
    '"Foi sorte", ele repete, sem tom nenhum. "Tá."',
    'Ele devolve o Pidgey pra bola com cuidado demais, que é como gente magoada guarda as coisas.',
    '"Em Pewter, então. Aí você vê se é sorte."'
  ],
  ef:{flag:'chamou_de_sorte'},
  escolhas:[
    {texto:'Voltar atrás. "Não foi sorte. Desculpa."', vai:'c2_derrota_desculpa',
     ef:{npc:{nome:'Téo', opiniao:2, memoria:'Você voltou atrás depois de chamar a vitória dele de sorte.'}}},
    {texto:'Deixar como está.', vai:'c2_encontro_pewter'},
    {texto:'Ir embora sem combinar nada.', vai:'c2_saida_centro'}
  ]
},

c2_derrota_desculpa:{
  texto:[
    '"Não foi sorte. Desculpa."',
    'Téo levanta a cabeça devagar.',
    '"Você me enrolou com o troço de campo aberto e eu fui atrás", você diz. "Isso não é sorte, isso é você ter pensado antes."',
    '"Eu pensei nisso ontem à noite", ele admite, e o orgulho volta ao rosto dele inteiro de uma vez só. "Eu pensei em oito coisas ontem à noite. Sete eram ruins."'
  ],
  escolhas:[
    {texto:'"Me conta as sete."', vai:'c2_derrota_aprendeu'},
    {texto:'"Te encontro em Pewter."', vai:'c2_encontro_pewter'}
  ]
},

c2_derrota_aprendeu:{
  texto:[
    '"O que você fez que eu não fiz?"',
    'A pergunta pega ele desprevenido. Ninguém nunca perguntou nada pra ele.',
    '"Eu... esperei." Ele pensa enquanto fala. "Você atacou toda vez que deu. Eu deixei passar uma pra ver o que você ia fazer."',
    'Ele encolhe os ombros, com vergonha de estar dando aula.',
    '"Meu pai joga carta. É a mesma coisa, ele fala. Quem tem pressa mostra a mão."',
    'Você vai lembrar disso numa floresta, num ginásio e num lugar bem pior, e nas três vezes vai ser útil.'
  ],
  ef:{flag:'licao_da_espera', presagio:'Alguma coisa que ele disse vai voltar quando você menos quiser ouvir.'},
  escolhas:[
    {texto:'"Te encontro em Pewter."', vai:'c2_encontro_pewter'},
    {texto:'"Seu Pidgey não sabe voar direito."', vai:'c2_critica'},
    {texto:'Agradecer e sair.', vai:'c2_saida_centro'}
  ]
},

c2_pos_batalha:{
  texto:[
    'Téo pega o Pidgey no colo antes mesmo de devolver pra bola. "Foi mal, foi mal, você foi bem."',
    'Ele fala isso pro Pidgey, não pra você. Leva uns bons quinze segundos até lembrar que você existe.',
    'Depois tira dinheiro do bolso e te entrega sem você pedir. É pouco. É quase tudo o que ele tem — dá pra ver porque a carteira fica visivelmente diferente.'
  ],
  ef:{dinheiro:400, npc:{nome:'Téo', opiniao:2, memoria:'Perdeu para você em Viridian e pagou com quase tudo que tinha.'}},
  escolhas:[
    {texto:'Devolver o dinheiro.', vai:'c2_devolveu',
     ef:{dinheiro:-400, rep:{eixo:'bom',delta:2,motivo:'Devolveu o prêmio a quem não tinha'},
         npc:{nome:'Téo', opiniao:4, memoria:'Você devolveu o dinheiro da aposta. Ele nunca contou isso pra ninguém e nunca esqueceu.'}}},
    {texto:'"Te encontro em Pewter, hein?"', vai:'c2_encontro_pewter',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Rivalidade sadia com Téo'},
         npc:{nome:'Téo', opiniao:2, memoria:'Vocês combinaram de se encontrar em Pewter.'}}},
    {texto:'Pegar o dinheiro e ir embora sem responder.', vai:'c2_saida_centro',
     ef:{npc:{nome:'Téo', opiniao:-2, memoria:'Você pegou o dinheiro dele e não disse nada.'}}},
    {texto:'"Seu Pidgey não sabe voar direito."', vai:'c2_critica'}
  ]
},

c2_devolveu:{
  texto:[
    'Você devolve o dinheiro.',
    'Ele não aceita. Você insiste. Ele não aceita de novo. Você põe na mão dele e fecha os dedos dele em volta, que é o único jeito que funciona com gente assim.',
    '"Regra é regra", ele reclama.',
    '"A regra é entre profissional. A gente é dois moleques num pátio."',
    'Ele guarda. Fica quieto um tempo.',
    '"Valeu." Muito baixo. E depois, alto demais, pra compensar: "MAS EU VOU GANHAR A PRÓXIMA!"'
  ],
  escolhas:[
    {texto:'"Te encontro em Pewter."', vai:'c2_encontro_pewter'},
    {texto:'Ir embora antes que fique sentimental.', vai:'c2_saida_centro'}
  ]
},

c2_critica:{
  texto:[
    '"Seu Pidgey não sabe voar direito."',
    'Téo olha pro Pidgey. O Pidgey olha pro Téo.',
    '"Eu sei." Ele coça a cabeça. "Ele nasceu numa gaiola. A gente comprou ele numa loja quando eu tinha nove anos."',
    '"Ele nunca voou?"',
    '"Ele voa tipo... um metro." Téo mostra com a mão. "Aí ele desce e anda."',
    'Vocês dois ficam olhando o Pidgey. O Pidgey anda até a cerca e volta.'
  ],
  ef:{flag:'sabe_do_pidgey', npc:{nome:'Téo', opiniao:1, memoria:'Te contou que o Pidgey dele nasceu numa gaiola e nunca aprendeu a voar direito.'}},
  escolhas:[
    {texto:'"Dá pra ensinar."', vai:'c2_ensinar',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Ofereceu esperança em vez de diagnóstico'}}},
    {texto:'"Então ele não serve pra rota."', vai:'c2_nao_serve',
     ef:{npc:{nome:'Téo', opiniao:-2, memoria:'Você disse que o Pidgey dele não servia.'}}},
    {texto:'"Te encontro em Pewter."', vai:'c2_encontro_pewter'}
  ]
},

c2_ensinar:{
  texto:[
    '"Dá pra ensinar."',
    '"Você acha?"',
    '"Sei lá. Acho." Você não faz a menor ideia. "Deve dar."',
    'Téo passa o resto da tarde no pátio jogando comida em cima de um muro baixo pro Pidgey ter que subir.',
    'Na quinta tentativa o Pidgey sobe voando em vez de pular.',
    'Téo grita tão alto que a atendente sai pra ver se aconteceu alguma coisa.'
  ],
  ef:{flag:'ensinou_o_pidgey',
      npc:{nome:'Téo', opiniao:5, memoria:'Você ficou uma tarde inteira ajudando o Pidgey dele a voar. Ele conta essa história até hoje.'},
      rep:{eixo:'bom',delta:2,motivo:'Passou uma tarde ensinando um Pidgey alheio a voar'}},
  escolhas:[{texto:'Ir embora quando escurecer.', vai:'c2_encontro_pewter'}]
},

c2_nao_serve:{
  texto:[
    '"Então ele não serve pra rota."',
    'Téo não responde na hora. Guarda o Pidgey.',
    '"Ele é o que eu tenho", ele diz, e é a frase mais adulta que sai da boca dele nesse dia.'
  ],
  escolhas:[{texto:'Ir embora.', vai:'c2_saida_centro'}]
},

c2_encontro_pewter:{
  texto:[
    '"Te encontro em Pewter."',
    '"Combinado." Ele bate na sua mão com uma solenidade ridícula. "Não chega antes de mim."',
    '"Você vai sair amanhã cedo?"',
    '"Vou sair AGORA." Ele já está pegando a mochila. "Cara, eu tô nessa escada desde as seis da manhã."',
    'E ele vai. Sai pela porta do Centro às três e meia da tarde, em direção a uma floresta que leva quatro horas pra atravessar.',
    'Você fica olhando a porta por um tempo.'
  ],
  ef:{flag:'teo_foi_pra_floresta'},
  escolhas:[
    {texto:'Ir atrás dele.', vai:'c2_atras_do_teo',
     ef:{flag:'foi_atras_do_teo', rep:{eixo:'bom',delta:1,motivo:'Foi atrás de alguém que entrou na floresta tarde demais'}}},
    {texto:'Deixar. Ele é adulto o suficiente pra decidir.', vai:'c2_saida_centro'},
    {texto:'Gritar pra ele que a floresta leva quatro horas.', vai:'c2_gritou'}
  ]
},

c2_gritou:{
  texto:[
    'Você grita da porta. Ele já está a uns trinta metros.',
    '"QUATRO HORAS! A FLORESTA LEVA QUATRO HORAS!"',
    'Ele para. Olha o relógio. Olha você. Faz a conta na cabeça, e dá pra ver ele fazendo a conta na cabeça.',
    'Depois levanta o braço num aceno que quer dizer "eu sei" e continua andando.',
    'Ele não sabia. Ele sabe agora e vai mesmo assim, porque voltar pro Centro depois de sair seria pior.'
  ],
  ef:{flag:'avisou_o_teo',
      npc:{nome:'Téo', opiniao:1, memoria:'Você gritou da porta do Centro pra avisar do horário. Ele foi mesmo assim.'}},
  escolhas:[
    {texto:'Ir atrás dele.', vai:'c2_atras_do_teo', ef:{flag:'foi_atras_do_teo'}},
    {texto:'Deixar.', vai:'c2_saida_centro'}
  ]
},

c2_atras_do_teo:{
  texto:[
    'Você pega a mochila e sai atrás dele.',
    'Alcança na saída norte da cidade, onde a Rota 2 começa a estreitar.',
    '"Você tá me seguindo?"',
    '"Tô."',
    '"Por quê?"',
    'Você não tem uma resposta boa. Diz alguma coisa sobre ser o mesmo caminho.',
    'Téo aceita a resposta ruim sem discutir, que é uma coisa que amigo faz.',
    'Vocês entram na Rota 2 juntos às quatro e dez da tarde.'
  ],
  ef:{flag:'entrou_com_teo',
      npc:{nome:'Téo', opiniao:3, memoria:'Você saiu atrás dele e entrou na Rota 2 junto.'}},
  escolhas:[{texto:'Seguir.', vai:'c2_fim'}]
},

c2_saida_centro:{
  texto:[
    'Você sai do Centro Pokémon de Viridian.',
    'A cidade tem semáforo, prédio de dois andares e uma loja com fachada tão sem graça que você passou por ela duas vezes antes de entender que era uma loja.',
    'No fim da tarde, a luz bate de lado nas casas e Viridian fica quase bonita.'
  ],
  escolhas:[
    {texto:'Seguir.', vai:'c2_fim'},
    {texto:'Voltar ao Centro. Tem uma coisa que você não terminou.', vai:'c2_mural'}
  ]
},

c2_fim:{
  texto:[
    d=>d.flags.entrou_com_teo
      ? 'Vocês dois andam pela Rota 2 conversando sobre nada, e a Rota 2 vai estreitando até virar um corredor entre dois paredões de árvore.'
      : 'A Rota 2 vai estreitando até virar um corredor entre dois paredões de árvore, e o céu vira uma faixa.',
    'No fim dela, a Floresta de Viridian começa sem aviso nenhum: num passo você está numa trilha e no outro você está dentro.',
    d=>d.flags.leu_aviso_floresta
      ? 'Você pensa no papel pardo sublinhado três vezes. Olha o relógio. Faz a conta.'
      : 'Ninguém te avisou de nada. Talvez não tenha nada pra avisar.',
    'Depois daqui, o caminho é seu. Você decide quando entra, por onde, e se entra.'
  ],
  fim:true, resumo:'Viridian ficou pra trás, e alguém entrou na floresta antes de você.'
}
}}

);
