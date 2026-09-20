/* ============================================================
   CAPÍTULO 3 — O QUE TEM DEBAIXO DAS FOLHAS
   ============================================================ */
CAPITULOS.push(

{
num:3, titulo:'O Que Tem Debaixo das Folhas', local:'Floresta de Viridian', ambiente:'floresta', nivelArea:9,
tom:'inquieto', inicio:'c3_entrada',
cenas:{

c3_entrada:{
  texto:[
    'A Floresta de Viridian não é escura. É pior: é verde demais, e a luz que atravessa as copas deixa tudo com a mesma cor, e você perde a noção de profundidade.',
    'O barulho é constante — inseto, folha, alguma coisa grande longe. Depois de vinte minutos o barulho vira normal, e é o silêncio que assusta.',
    'Tem duas maneiras de atravessar: a trilha marcada, que é longa, e o mato fechado, que é curto e não é trilha.',
    d=>d.flags.teo_foi_pra_floresta && !d.flags.entrou_com_teo
      ? 'E, no barro da entrada, pegada de tênis novo. Uma pessoa só, andando rápido, entrando pelo mato fechado em vez da trilha.'
      : '',
    d=>d.flags.entrou_com_teo
      ? 'Téo anda atrás de você e fala sem parar, e você entende, depois de um tempo, que ele fala sem parar porque está com medo.'
      : ''
  ],
  ef:{registrar:'Entrou na Floresta de Viridian.'},
  escolhas:[
    {texto:'Seguir a trilha marcada. Mais longa, mais segura.', vai:'c3_trilha'},
    {texto:'Cortar pelo mato fechado.', vai:'c3_atalho'},
    {texto:'Seguir as pegadas de tênis novo.', vai:'c3_pegadas',
     cond:d=>!!d.flags.teo_foi_pra_floresta && !d.flags.entrou_com_teo},
    {texto:'Parar e escutar antes de escolher.', vai:'c3_escutar'}
  ]
},

c3_escutar:{
  texto:[
    'Você para e fecha os olhos, o que é uma ideia questionável numa floresta e ainda assim é o que se faz.',
    'Camadas: inseto de perto. Folha de longe. Água em algum lugar à esquerda, provavelmente um filete.',
    'E, embaixo de tudo isso, um som que não pertence: fino, curto, repetido em intervalo regular.',
    'Regular é a palavra errada pra floresta. Floresta não faz nada em intervalo regular.'
  ],
  ef:{flag:'ouviu_o_som',
      rep:{eixo:'bom',delta:1,motivo:'Parou para escutar uma floresta inteira'}},
  escolhas:[
    {texto:'Ir na direção do som.', vai:'c3_som'},
    {texto:'Seguir a trilha marcada e ignorar.', vai:'c3_trilha'},
    {texto:'Cortar pelo mato fechado.', vai:'c3_atalho'},
    {texto:'Seguir as pegadas de tênis novo.', vai:'c3_pegadas',
     cond:d=>!!d.flags.teo_foi_pra_floresta && !d.flags.entrou_com_teo}
  ]
},

c3_pegadas:{
  texto:[
    'As pegadas de Téo entram pelo mato fechado, o que é a decisão errada, e seguem em linha reta por uns duzentos metros, o que é a segunda decisão errada.',
    'Depois elas começam a fazer curva. Depois círculo.',
    'Ele andou em círculo por, você chuta, uns quarenta minutos.',
    'E aí as pegadas param de estar sozinhas.',
    'Tem marca de bota adulta por cima das dele, em dois pontos, indo na mesma direção.'
  ],
  ef:{flag:'seguiu_as_pegadas', instabilidade:0,
      registrar:'Seguiu as pegadas de Téo. Alguém adulto estava seguindo elas também.'},
  escolhas:[
    {texto:'Acelerar. Correr, se der.', vai:'c3_correu_atras'},
    {texto:'Sair da trilha das pegadas e contornar por fora.', vai:'c3_contornou'},
    {texto:'Gritar o nome dele.', vai:'c3_gritou_teo'},
    {texto:'Voltar e pegar a trilha marcada. Isso é grande demais.', vai:'c3_trilha',
     ef:{flag:'abandonou_o_teo', rep:{eixo:'ruim',delta:1,motivo:'Viu marca de bota adulta sobre a pegada de um amigo e voltou'}}}
  ]
},

c3_gritou_teo:{
  texto:[
    'Você grita o nome dele.',
    'A floresta come o som em uns quinze metros e devolve nada.',
    'Você grita de novo.',
    'Dessa vez tem resposta — não a voz dele. Um barulho de galho quebrando a uns quarenta metros, do lado errado, e depois nada.',
    'Quem quebrou o galho parou de andar porque ouviu você.'
  ],
  ef:{flag:'foi_ouvido_na_floresta'},
  escolhas:[
    {texto:'Ir na direção do galho.', vai:'c3_correu_atras'},
    {texto:'Ficar absolutamente parado.', vai:'c3_ficou_parado'},
    {texto:'Sair dali rápido e em silêncio.', vai:'c3_contornou'}
  ]
},

c3_ficou_parado:{
  texto:[
    'Você fica parado. Dois minutos, talvez três.',
    'A coisa do outro lado também fica parada, o que prova que é gente — bicho não espera desse jeito.',
    'Depois a pessoa se move. Não na sua direção: paralelo, contornando você, com bastante cuidado.',
    'Você ouve os passos passarem pelo seu lado a uns trinta metros e sumirem pra dentro.',
    'Quando você volta a respirar direito, percebe que está com a mão no cinto desde o começo, sem ter percebido que levou.'
  ],
  ef:{flag:'foi_contornado',
      rep:{eixo:'bom',delta:1,motivo:'Ficou parado quando parar era mais difícil que correr'}},
  escolhas:[
    {texto:'Seguir na direção em que a pessoa foi.', vai:'c3_som'},
    {texto:'Ir atrás das pegadas de Téo.', vai:'c3_correu_atras'}
  ]
},

c3_correu_atras:{
  texto:[
    'Você corre pelo mato fechado, o que numa floresta significa correr uns oito metros e depois andar rápido, repetidamente.',
    'Galho na cara. Raiz no pé. Você cai uma vez e levanta antes de sentir.',
    'E aí, numa clareira pequena, você acha o Téo.',
    'Ele está sentado no chão, de costas pra uma árvore, com o Pidgey no colo, e está bem — fisicamente ele está bem.',
    '"Cara." A voz dele sai errada. "Cara, tem um cara aqui."'
  ],
  ef:{hp:-2, causa:'Corrida pelo mato fechado', flag:'achou_o_teo',
      npc:{nome:'Téo', opiniao:4, memoria:'Você correu pelo mato fechado atrás dele quando ele se perdeu na floresta.'}},
  escolhas:[
    {texto:'"Que cara?"', vai:'c3_que_cara'},
    {texto:'Pegar ele e sair dali imediatamente.', vai:'c3_tirou_o_teo'},
    {texto:'Olhar em volta antes de falar qualquer coisa.', vai:'c3_olhou_em_volta'},
    {texto:'"Você tá bem?" Primeiro isso.', vai:'c3_tudo_bem'}
  ]
},

c3_tudo_bem:{
  texto:[
    '"Você tá bem?"',
    'Ele demora pra responder, o que já responde.',
    '"Tô." Ele não está. "Eu tô. Eu só — eu andei em círculo, e aí eu sentei, e aí eu ouvi um cara falando."',
    '"Falando o quê?"',
    '"Sozinho. Tipo, ele tava falando sozinho, mas não era sozinho." Téo aperta o Pidgey. "Ele tava contando. Tipo — um, dois, três. Contando bicho."'
  ],
  ef:{npc:{nome:'Téo', opiniao:2, memoria:'A primeira coisa que você perguntou foi se ele estava bem.'},
      rep:{eixo:'bom',delta:1,motivo:'Perguntou pela pessoa antes de perguntar pelo problema'},
      flag:'sabe_da_contagem'},
  escolhas:[
    {texto:'"Me leva onde você ouviu."', vai:'c3_som'},
    {texto:'Tirar ele da floresta primeiro.', vai:'c3_tirou_o_teo'},
    {texto:'Olhar em volta.', vai:'c3_olhou_em_volta'}
  ]
},

c3_que_cara:{
  texto:[
    '"Que cara?"',
    '"Um cara." Téo aponta com a cabeça, sem soltar o Pidgey. "Adulto. Roupa boa. Com um rolo de fio no ombro."',
    d=>d.flags.sabe_do_fio_de_aco
      ? 'Fio de aço. A atendente do Centro descreveu a mesma pessoa duas vezes no mesmo relatório.'
      : 'Fio. Rolo de fio, no ombro, numa floresta.',
    '"Ele te viu?"',
    '"Acho que não." Téo não parece convencido do que ele mesmo está falando. "Ele parou perto e ficou contando."'
  ],
  ef:{flag:['sabe_do_fio_de_aco','sabe_da_contagem']},
  escolhas:[
    {texto:'"Me leva onde ele tava."', vai:'c3_som'},
    {texto:'Tirar o Téo da floresta antes de qualquer coisa.', vai:'c3_tirou_o_teo'},
    {texto:'Olhar em volta.', vai:'c3_olhou_em_volta'},
    {texto:'"Fica aqui. Eu vou sozinho."', vai:'c3_som', ef:{flag:'deixou_teo_na_clareira'}}
  ]
},

c3_olhou_em_volta:{
  texto:[
    'Você olha em volta antes de falar qualquer coisa, que é a primeira coisa certa do dia.',
    'A clareira é pequena e o chão tem marca de bota adulta em três pontos, todas apontando para o mesmo lado.',
    'Tem também uma latinha de refrigerante amassada, recente, sem sujeira nenhuma.',
    'E, presa num galho na altura do peito, uma tira de fita plástica laranja, do tipo que se usa pra marcar trilha.',
    'Tem outra igual quinze metros adiante. E outra depois dela.',
    'Alguém marcou um caminho aqui dentro, e não é o caminho da trilha oficial.'
  ],
  ef:{flag:'achou_as_fitas',
      rep:{eixo:'bom',delta:1,motivo:'Leu o chão antes de falar'},
      registrar:'Alguém marcou um caminho próprio dentro da floresta, com fita plástica laranja.'},
  escolhas:[
    {texto:'Seguir as fitas.', vai:'c3_som'},
    {texto:'Arrancar todas as fitas que conseguir.', vai:'c3_arrancou_fitas'},
    {texto:'Tirar o Téo da floresta primeiro.', vai:'c3_tirou_o_teo'},
    {texto:'Fotografar e guardar pra mostrar a alguém.', vai:'c3_fotografou_fitas'}
  ]
},

c3_arrancou_fitas:{
  texto:[
    'Você arranca as fitas. Sete, oito, nove — elas continuam por mais longe do que você tem paciência.',
    'Na décima segunda, você entende duas coisas ao mesmo tempo:',
    'Primeiro, que quem colocou vai perceber.',
    'Segundo, que agora você também não sabe mais voltar pelo caminho que veio.'
  ],
  ef:{flag:'arrancou_as_fitas', hp:-2, causa:'Perdido na floresta',
      rep:{eixo:'bom',delta:1,motivo:'Estragou a marcação de alguém sem saber o preço'}},
  escolhas:[
    {texto:'Continuar na direção em que as fitas iam.', vai:'c3_som'},
    {texto:'Tentar refazer o caminho de volta.', vai:'c3_perdido'}
  ]
},

c3_fotografou_fitas:{
  texto:[
    'Você fotografa: a fita no galho, a bota no barro, a lata, a sequência de marcações indo pra dentro.',
    'Não é prova de crime nenhum. Fita plástica não é crime.',
    'Mas é a primeira vez nessa jornada que você guarda alguma coisa achando que vai precisar depois — e essa vai virar uma mania.'
  ],
  ef:{flag:'provas_da_floresta',
      rep:{eixo:'bom',delta:1,motivo:'Começou a guardar prova'}},
  escolhas:[
    {texto:'Seguir as fitas.', vai:'c3_som'},
    {texto:'Tirar o Téo da floresta.', vai:'c3_tirou_o_teo'}
  ]
},

c3_tirou_o_teo:{
  texto:[
    'Você levanta o Téo pelo braço e leva ele pra fora, e leva mais de uma hora porque ele andou em círculo e você não sabia disso.',
    'Na saída norte, já perto de Pewter, ele senta no chão de pedra e fica quieto por um tempo.',
    '"Valeu." Ele diz pro chão. "Eu ia ficar lá."',
    '"Você não ia ficar lá."',
    '"Eu ia." Ele levanta a cabeça. "Eu ia, cara. Eu já tinha decidido que ia esperar amanhecer."',
    'Você não sabe o que responder pra isso e não responde nada, e ele agradece o silêncio.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Tirou alguém da floresta antes de resolver o próprio assunto'},
      npc:{nome:'Téo', opiniao:6, memoria:'Você o tirou da Floresta de Viridian. Ele tinha decidido esperar amanhecer sentado.'},
      flag:'salvou_o_teo'},
  escolhas:[
    {texto:'Voltar pra dentro sozinho.', vai:'c3_som'},
    {texto:'Ir pra Pewter com ele e deixar a floresta pra lá.', vai:'c3_fim_sem_ver',
     ef:{flag:'nao_viu_a_armadilha'}}
  ]
},

c3_perdido:{
  texto:[
    'Você tenta refazer o caminho e não refaz.',
    'Quarenta minutos depois você passa pela mesma árvore caída pela segunda vez e entende o que aconteceu com o Téo.',
    'É humilhante de um jeito muito específico: a floresta não é grande. Você é que é pequeno dentro dela.',
    'Quando você finalmente acha uma referência, o som fino está mais perto do que estava.'
  ],
  ef:{hp:-3, causa:'Perdido na Floresta de Viridian'},
  escolhas:[{texto:'Ir na direção do som.', vai:'c3_som'}]
},

c3_contornou:{
  texto:[
    'Você sai da linha das pegadas e contorna por fora, andando devagar, pisando em raiz em vez de folha.',
    'Leva três vezes mais tempo e vale cada minuto: você chega numa posição de onde dá pra ver a clareira sem estar nela.',
    'E dá pra ver o que tem no meio dela.'
  ],
  ef:{flag:'chegou_por_fora',
      rep:{eixo:'bom',delta:1,motivo:'Chegou por fora, olhando antes de entrar'}},
  escolhas:[{texto:'Olhar.', vai:'c3_som'}]
},

c3_trilha:{
  texto:[
    'A trilha marcada tem cicatriz de facão nos troncos, velhas, algumas já engolidas pela casca.',
    'Alguém passou por aqui há muito tempo e quis que outros conseguissem passar depois. É um gesto que ninguém assina.',
    'Você anda quase duas horas sem incidente. A trilha é boa.',
    'Na segunda hora, o som fino aparece à sua direita, fora da trilha.'
  ],
  ef:{flag:'ouviu_o_som'},
  teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção',
         critico:'c3_achou_cedo', sucesso:'c3_achou_cedo', parcial:'c3_som', falha:'c3_emboscada'}
},

c3_atalho:{
  texto:[
    'O mato fecha atrás de você em cinco passos. Em quinze, você não sabe mais de que lado entrou.',
    'O chão aqui é mais fofo e o cheiro muda: fica adocicado e errado, como fruta passada.',
    'Tem menos bicho do que devia ter. Isso demora pra você perceber e é a informação mais importante da hora.'
  ],
  ef:{flag:'entrou_no_fechado'},
  teste:{status:'percepcao', dificuldade:8, nomeStatus:'Percepção',
         critico:'c3_achou_cedo', sucesso:'c3_som', parcial:'c3_emboscada', falha:'c3_emboscada'}
},

c3_emboscada:{
  texto:[
    'Você não vê chegar. Nenhum aviso — só o peso em cima de você e o chão vindo rápido demais.',
    'Alguma coisa te derruba de lado e você bate o ombro numa raiz. Dói do jeito que machucado de verdade dói: com atraso.',
    'Quando você levanta, o bicho já está entre você e o caminho de volta.'
  ],
  ef:{hp:-4, causa:'Emboscada na Floresta de Viridian'},
  batalha:{aleatorio:true, ambiente:'floresta', nivelBase:12, tipo:'selvagem',
           vitoria:'c3_som', derrota:'c3_som', fuga:'c3_som', captura:'c3_som', gameover:'gameover'}
},

c3_achou_cedo:{
  texto:[
    'Você vê antes de pisar: o chão à frente está errado.',
    'As folhas estão amassadas num rastro largo, e o rastro é fresco, e ele não é de arrasto de bicho — é de alguma coisa girando no mesmo lugar por muito tempo.',
    'Você contorna e chega por um ângulo de onde dá pra ver sem ser visto.',
    'Cinquenta metros depois, você entende o que era o cheiro.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Leu o chão antes de pisar nele'}},
  escolhas:[{texto:'Olhar.', vai:'c3_som'}]
},

c3_som:{
  texto:[
    'É um som fino e repetido. Não é chamado de acasalamento, não é aviso de território. Você não sabe nomear, mas o seu corpo sabe: é dor.',
    'Numa clareira pequena, um Pikachu está preso. Não numa armadilha de caça — num fio de aço amarrado em torno da pata traseira, preso a uma estaca de metal enfiada no chão.',
    'Amarrado por gente. Com nó. Com ferramenta.',
    'Ele está aqui há dias — dá pra ver pelo chão em volta, girado até virar terra batida num círculo perfeito de um metro e meio.',
    'A três metros, uma mochila jogada. De alguém que voltou pra buscar depois. Ou que não voltou.',
    'E em volta da clareira, em três árvores diferentes, fita plástica laranja.'
  ],
  ef:{flag:'achou_pikachu', registrar:'Encontrou um Pikachu preso por gente na Floresta de Viridian.'},
  escolhas:[
    {texto:'Soltar o Pikachu. Devagar, com as mãos.', vai:'c3_soltar'},
    {texto:'Soltar e tentar capturar antes que ele fuja.', vai:'c3_capturar'},
    {texto:'Pegar a mochila primeiro e ver o que tem dentro.', vai:'c3_mochila'},
    {texto:'Não mexer em nada e esperar quem armou voltar.', vai:'c3_esperar'}
  ]
},

c3_esperar:{
  texto:[
    'Você sai da clareira, se encosta atrás de um tronco a uns vinte metros, e espera.',
    'O som fino continua o tempo todo. Você fica ouvindo o som fino por quarenta minutos.',
    'Essa é uma das coisas mais difíceis que você vai fazer em toda a jornada, e você faz de propósito, e por um motivo que você mesmo ainda não sabe explicar.',
    'Aos quarenta e três minutos, eles chegam.',
    'Dois. Roupa boa demais pra mato. Um com rolo de fio de aço no ombro, sem disfarçar. Eles entram na clareira sem olhar em volta, porque não esperam ninguém aqui.',
    'E você vê o que eles fazem quando acham que não tem testemunha.'
  ],
  ef:{flag:['esperou_os_cacadores','viu_sem_ser_visto'],
      rep:{eixo:'bom',delta:2,motivo:'Esperou quarenta minutos ouvindo para ver quem chegava'},
      registrar:'Esperou e viu os caçadores chegarem à clareira.'},
  escolhas:[
    {texto:'Atacar agora, com a vantagem da surpresa.', vai:'c3_surpresa'},
    {texto:'Continuar olhando. Deixar eles se irem e seguir eles.', vai:'c3_seguir_cacadores'},
    {texto:'Sair do esconderijo e falar com eles.', vai:'c3_caçadores'},
    {texto:'Ir embora em silêncio. Você viu o suficiente.', vai:'c3_foi_embora_calado'}
  ]
},

c3_surpresa:{
  texto:[
    'Você sai de trás do tronco com a bola já na mão.',
    'Eles levam três segundos inteiros pra entender o que está acontecendo, e três segundos é muita coisa.',
    '"Ô —" começa o mais velho, e não termina.'
  ],
  ef:{flag:'atacou_de_surpresa'},
  batalha:{dex:23, nivel:16, tipo:'treinador', treinador:'Caçador Vasco', fuga:false,
           vitoria:'c3_venceu_cacador', derrota:'c3_perdeu_cacador', gameover:'gameover'}
},

c3_seguir_cacadores:{
  texto:[
    'Você deixa eles pegarem o Pikachu — e isso custa uma coisa em você que não volta.',
    'Eles enrolam o fio, colocam o bicho numa bolsa de lona com respiro e saem pela marcação de fita.',
    'Você segue a sessenta metros, o que é a distância certa, e descobre onde termina a fita laranja:',
    'Uma estrada de terra fora da floresta, com uma caminhonete branca e mais três bolsas de lona no chão da caçamba.',
    'Você anota a placa. Fotografa, se conseguir. E fica olhando eles irem embora.',
    'Você trocou um bicho por um endereço. Vai levar um tempo até decidir se isso foi certo.'
  ],
  ef:{flag:['seguiu_os_cacadores','provas_da_floresta','placa_da_caminhonete'],
      rep:{eixo:'ruim',delta:1,motivo:'Deixou levarem um Pokémon para descobrir para onde levavam'},
      rep2:null,
      registrar:'Seguiu os caçadores até a caminhonete. Anotou a placa e viu mais três bolsas.'},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_foi_embora_calado:{
  texto:[
    'Você sai em silêncio, do jeito que entrou.',
    'Atrás de você, na clareira, duas pessoas trabalham com competência e sem pressa.',
    'Você não faz nada, e não fazer nada dessa vez foi uma decisão tomada com informação completa, o que é pior do que não fazer nada por ignorância.'
  ],
  ef:{flag:'ignorou_pikachu',
      rep:{eixo:'ruim',delta:2,motivo:'Viu tudo, entendeu tudo e foi embora'},
      registrar:'Viu os caçadores levarem o Pikachu e não interveio.'},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_soltar:{
  texto:[
    'Você chega agachado, de lado, sem encarar — do jeito que se chega em bicho assustado e em gente assustada, que é o mesmo jeito.',
    'Leva quatro minutos pra chegar perto o suficiente pra tocar no fio.',
    'Ele te dá um choque. Não de ataque — de pânico. Queima a palma da mão e você não solta, porque soltar agora significa recomeçar os quatro minutos.',
    'O fio cede. O nó era bom, feito por quem sabe.',
    'O Pikachu não corre. Fica ali, tremendo, olhando a pata que não sabe mais como usar.'
  ],
  ef:{hp:-3, causa:'Choque ao soltar o Pikachu',
      rep:{eixo:'bom',delta:2,motivo:'Libertou um Pokémon preso por caçadores'},
      registrar:'Libertou o Pikachu da armadilha.'},
  escolhas:[
    {texto:'Ficar até ele conseguir andar.', vai:'c3_ficar'},
    {texto:'Dar comida e água antes de qualquer coisa.', vai:'c3_comida', cond:d=>Estado.contaItem('Ração')>0},
    {texto:'Ir embora. Você fez a sua parte.', vai:'c3_ir_embora'},
    {texto:'Arrancar a estaca e levar como prova.', vai:'c3_levou_estaca',
     ef:{flag:'levou_a_estaca'}}
  ]
},

c3_comida:{
  texto:[
    'Você abre a ração e coloca no chão, longe o suficiente pra ele não precisar chegar perto de você.',
    'Ele não come. Olha a comida, olha você, e não come.',
    'Você recua mais três passos. Depois mais três.',
    'Aos oito metros, ele come. Devagar no começo e depois muito rápido, e no fim ele engasga e você não pode ajudar.',
    'Quando termina, ele fica olhando o lugar onde estava a comida por um tempo longo demais.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Ração'); return []; },
      rep:{eixo:'bom',delta:1,motivo:'Deu comida a oito metros de distância, do jeito certo'}},
  escolhas:[
    {texto:'Ficar até ele conseguir andar.', vai:'c3_ficar'},
    {texto:'Ir embora agora que ele comeu.', vai:'c3_ir_embora'}
  ]
},

c3_ficar:{
  texto:[
    'Você fica. Uma hora, talvez mais — dá pra medir porque a luz muda de ângulo entre as árvores.',
    'Divide a água. Ele aceita na terceira tentativa.',
    'Em algum momento você começa a falar, sem motivo nenhum, porque o silêncio estava pesado. Fala do seu quarto, da casca de ovo no pote, da fivela quebrada da mochila. Coisa idiota.',
    'Ele não entende uma palavra e fica escutando mesmo assim, do jeito que bicho escuta: pela cadência.',
    'Quando ele finalmente apoia a pata no chão e dá dois passos, olha pra você de um jeito que não é gratidão — Pokémon selvagem não faz gratidão. É reconhecimento. Ele decorou você.',
    'Depois some no mato.',
    'E volta em dez minutos. E te segue.'
  ],
  ef:{umaVez:'c03_p1', pokemon:{dex:25, nivel:12, opcoes:{natureza:'Jolly', moral:85, historia:'Você o soltou de uma armadilha na Floresta de Viridian e ficou uma hora esperando ele conseguir andar.'}},
      rep:{eixo:'bom',delta:2,motivo:'Esperou o Pokémon ferido se recuperar'},
      flag:'pikachu_aliado', registrar:'O Pikachu libertado passou a te seguir.'},
  escolhas:[{texto:'Seguir com ele.', vai:'c3_caçadores'}]
},

c3_ir_embora:{
  texto:[
    'Você vira as costas.',
    'Atrás de você, o som fino continua por mais um tempo, mais baixo agora, e depois muda de qualidade — ele para de ser dor e vira outra coisa que você não vai conseguir nomear nunca.',
    'Não é culpa. É só que você vai lembrar disso.'
  ],
  ef:{registrar:'Soltou o Pikachu e foi embora sem olhar para trás.'},
  escolhas:[{texto:'Continuar.', vai:'c3_caçadores'}]
},

c3_levou_estaca:{
  texto:[
    'A estaca sai do chão com esforço. Tem quarenta centímetros e é de metal galvanizado, do tipo que se compra em loja de construção.',
    'Tem um número gravado na base. Número de série, de lote, de alguma coisa.',
    'Você enrola o fio de aço em volta dela e guarda na mochila, e a mochila fica pesada de um jeito novo.',
    'Isso é prova. Prova de quê, você ainda não sabe — mas coisa numerada tem dono.'
  ],
  ef:{flag:['provas_da_floresta','tem_a_estaca'],
      rep:{eixo:'bom',delta:1,motivo:'Guardou a estaca numerada'},
      registrar:'Levou a estaca com número de série gravado.'},
  escolhas:[
    {texto:'Ficar até o Pikachu conseguir andar.', vai:'c3_ficar'},
    {texto:'Ir embora.', vai:'c3_ir_embora'}
  ]
},

c3_capturar:{
  texto:[
    'Você solta o fio e joga a bola no mesmo movimento, antes que ele consiga sair do lugar.',
    'Ele não luta. Não tem como lutar — está há dias amarrado, sem comer, com a pata inutilizada.',
    'A bola fecha sem resistência nenhuma. Nem uma sacudida.',
    'Foi fácil demais. Isso devia significar alguma coisa e significa.'
  ],
  ef:{executar:d=>{
        const p = criarPokemon(25, 12, {natureza:'Lonely', moral:15, historia:'Capturado enquanto estava preso e ferido. Não escolheu você.'});
        p.status = 'veneno'; p.hp = Math.max(1, Math.floor(p.hpMax*0.3));
        Estado.adicionar(p);
        Estado.registrar('Capturou o Pikachu enquanto ele estava preso e indefeso.');
        return [{tipo:'pokemon', texto:'Pikachu entrou no time. Ele está ferido, envenenado, e não olha para você.'}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Capturou um Pokémon indefeso numa armadilha'},
      flag:'pikachu_capturado_preso'},
  escolhas:[
    {texto:'Soltar de volta. Isso não foi captura.', vai:'c3_arrependeu_captura'},
    {texto:'Seguir.', vai:'c3_caçadores'},
    {texto:'Pegar a mochila também.', vai:'c3_mochila'}
  ]
},

c3_arrependeu_captura:{
  texto:[
    'Você abre a bola dois minutos depois.',
    'Ele sai e cai de lado, porque a pata continua não funcionando, e fica ali.',
    'Você não consertou nada. Você só fez a mesma coisa duas vezes, na ordem contrária.',
    'Mas ele está do lado de fora, e isso é diferente de estar do lado de dentro, mesmo que não pareça.'
  ],
  ef:{executar:d=>{
        const p = d.time.find(x=>x.dex===25);
        if (p){ Estado.removerDoTime(p.uid); }
        return [];
      },
      rep:{eixo:'bom',delta:1,motivo:'Desfez a própria captura'},
      flag:'soltou_o_pikachu_de_volta'},
  escolhas:[
    {texto:'Ficar até ele conseguir andar.', vai:'c3_ficar'},
    {texto:'Ir embora.', vai:'c3_ir_embora'}
  ]
},

c3_mochila:{
  texto:[
    'A mochila é boa. Cara. Do tipo que se compra pra usar dez anos.',
    'Dentro: comida velha, um mapa rabiscado com marcação a caneta em seis pontos da floresta, três Great Balls e um caderno de capa dura.',
    'O caderno tem uma lista. Data, lugar, espécie — e do lado de cada linha, um preço.',
    'A última linha é de hoje. Espécie: Pikachu. Preço: em branco.',
    'O Pikachu continua girando na estaca atrás de você enquanto você lê.'
  ],
  ef:{itens:{'Great Ball':3}, dinheiro:600, flag:['pegou_mochila_cacador','provas_da_floresta'],
      registrar:'Pegou a mochila do caçador, com o caderno de preços dentro.'},
  escolhas:[
    {texto:'Largar tudo e soltar o Pikachu.', vai:'c3_soltar',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Largou o que achou para soltar o que estava preso'}}},
    {texto:'Levar o caderno e soltar o Pikachu.', vai:'c3_soltar',
     ef:{flag:'levou_o_caderno_do_cacador'}},
    {texto:'Levar tudo e ir embora.', vai:'c3_caçadores',
     ef:{rep:{eixo:'ruim',delta:2,motivo:'Saqueou e deixou um Pokémon preso para trás'}, flag:'ignorou_pikachu'}},
    {texto:'Ler o caderno inteiro antes de decidir.', vai:'c3_caderno_inteiro'}
  ]
},

c3_caderno_inteiro:{
  texto:[
    'Você senta no chão da clareira, com o som fino a três metros, e lê trinta e uma páginas.',
    'Dois anos de lista. Cento e poucas linhas.',
    'Os preços sobem com o tempo. Os lugares mudam: começa na Rota 2, vai pra floresta, e nas últimas páginas aparecem nomes que você não conhece — "MT LUA", "ZS-7", "SPH".',
    'E, na contracapa, a mesma letra escreveu um endereço em Celadon e um horário: depois das 23h.',
    'Você fecha o caderno e o som fino continua.'
  ],
  ef:{flag:['leu_o_caderno_do_cacador','provas_da_floresta','endereco_celadon_cedo'],
      rep:{eixo:'bom',delta:1,motivo:'Leu as trinta e uma páginas em vez de só pegar as bolas'},
      registrar:'Leu o caderno do caçador: dois anos de lista, com Monte da Lua, ZS-7, SPH e um endereço em Celadon.'},
  escolhas:[
    {texto:'Soltar o Pikachu agora.', vai:'c3_soltar'},
    {texto:'Esperar os donos voltarem.', vai:'c3_esperar'}
  ]
},

c3_caçadores:{
  texto:[
    'Dois homens vêm pela trilha em sentido contrário.',
    'Roupa boa demais pra floresta. Um deles carrega um rolo de fio de aço no ombro, sem disfarçar, do jeito de quem carrega ferramenta de trabalho.',
    'Eles param quando te veem. O da frente olha pras suas mãos, depois pro seu cinto, depois pros seus olhos. Nessa ordem exata, que é a ordem de quem já fez isso muitas vezes.',
    d=>d.flags.pegou_mochila_cacador ? '"Essa mochila é minha", ele diz. Sem levantar a voz nenhum tom.' :
       (d.flags.pikachu_aliado || d.flags.pikachu_capturado_preso ? '"Cadê o amarelo." Não é pergunta.' :
        '"Viu alguma coisa aí atrás?" Ele sorri. O sorriso não sobe até os olhos.')
  ],
  ef:{npc:{nome:'Caçador Vasco', opiniao:0, memoria:'Te encontrou na trilha da Floresta de Viridian.'}},
  escolhas:[
    {texto:'Enfrentar. Alguém tem que enfrentar.', vai:'c3_luta_cacador'},
    {texto:'Mentir. Dizer que não viu nada.', vai:'c3_mentir'},
    {texto:'Negociar — eles têm dinheiro, você tem informação.', vai:'c3_negociar'},
    {texto:'"Eu sei o seu nome." Blefar com o caderno.', vai:'c3_blefe_caderno',
     cond:d=>!!(d.flags.pegou_mochila_cacador||d.flags.leu_o_caderno_do_cacador)}
  ]
},

c3_blefe_caderno:{
  texto:[
    '"Eu sei o seu nome."',
    'Você não sabe o nome dele. O caderno não tem nome em lugar nenhum — você conferiu.',
    'Mas ele não sabe que você conferiu.',
    'Os dois se olham por meio segundo, e meio segundo entre duas pessoas que trabalham juntas há anos é uma conversa inteira.',
    '"Tá com a mochila", diz o mais novo.',
    '"Tô vendo." O mais velho não tira os olhos de você. "Garoto, devolve e vai embora e a gente esquece a manhã inteira."'
  ],
  ef:{flag:'blefou_com_o_caderno'},
  escolhas:[
    {texto:'"Devolvo se vocês soltarem tudo que tiver na caminhonete."', vai:'c3_negociou_alto'},
    {texto:'Devolver e ir embora.', vai:'c3_devolveu_mochila'},
    {texto:'Recusar e lutar.', vai:'c3_luta_cacador'},
    {texto:'Correr com a mochila.', vai:'c3_correu_com_mochila'}
  ]
},

c3_negociou_alto:{
  texto:[
    '"Devolvo se vocês soltarem tudo que tiver na caminhonete."',
    'O mais velho ri — curto, genuíno, surpreso.',
    '"Como é que você sabe da caminhonete?"',
    'Você não sabia da caminhonete. Você chutou a palavra e ela acertou.',
    'Ele para de rir. Olha o parceiro. Olha você de novo, com uma atenção completamente diferente.',
    '"Anota aí", ele diz pro outro. E o outro anota. Anota o seu rosto.',
    'Eles soltam dois. Só dois, das quatro bolsas — e fazem questão de você ver que são só dois.',
    '"Isso é o máximo que a manhã de hoje vale", diz o mais velho. "A gente se vê."'
  ],
  ef:{flag:['inimigo_cacadores','soltou_dois_da_caminhonete'],
      rep:{eixo:'bom',delta:2,motivo:'Negociou a soltura de dois Pokémon com quem os capturou'},
      npc:{nome:'Caçador Vasco', opiniao:-4, memoria:'Você o forçou a soltar dois. Ele anotou seu rosto na floresta.'},
      registrar:'Negociou a soltura de dois Pokémon. Os caçadores anotaram seu rosto.'},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_devolveu_mochila:{
  texto:[
    'Você devolve a mochila. Ele confere o conteúdo na sua frente, sem pressa, item por item.',
    'Quando chega no caderno, ele para.',
    '"Você leu?"',
    d=>d.flags.leu_o_caderno_do_cacador ? 'Você não responde nada, e o não responder responde.' : '"Não."',
    'Ele guarda o caderno no bolso interno, não na mochila.',
    '"Vai embora, garoto."'
  ],
  ef:{perdeItens:{'Great Ball':3},
      npc:{nome:'Caçador Vasco', opiniao:-1, memoria:'Você devolveu a mochila dele na trilha.'}},
  escolhas:[{texto:'Ir embora.', vai:'c3_fim'}]
},

c3_correu_com_mochila:{
  texto:[
    'Você corre com a mochila deles pelo mato fechado de uma floresta que você não conhece, perseguido por dois adultos que conhecem.',
    'Dura oito minutos. Você ganha oito minutos porque eles não esperavam que você fosse burro o suficiente pra correr pra dentro em vez de pra fora.',
    'No nono minuto você acha a trilha marcada por acidente e corre nela por mais quinze.',
    'Quando para, não tem ninguém atrás de você. Tem uma mochila cara, três Great Balls, um caderno de trinta e uma páginas e um ponto na barriga que não passa.'
  ],
  ef:{hp:-4, causa:'Corrida com a mochila roubada',
      flag:['inimigo_cacadores','provas_da_floresta'],
      npc:{nome:'Caçador Vasco', opiniao:-5, memoria:'Você roubou a mochila dele e correu. Ele te procurou por dois dias.'},
      rep:{eixo:'bom',delta:1,motivo:'Roubou de quem rouba'}},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_luta_cacador:{
  texto:[
    'O homem suspira como quem já fez isso antes e não gosta de fazer.',
    'Ele solta a bola no chão em vez de jogar. Nem olha o próprio Pokémon sair.',
    '"Rápido", ele diz pro parceiro. "A gente tem que descer ainda hoje."'
  ],
  batalha:{dex:23, nivel:16, tipo:'treinador', treinador:'Caçador Vasco', fuga:false,
           vitoria:'c3_venceu_cacador', derrota:'c3_perdeu_cacador', gameover:'gameover'}
},

c3_venceu_cacador:{
  texto:[
    'O Arbok volta pra bola e o homem não reclama, não xinga, não ameaça.',
    'Ele só te olha com uma atenção nova, do jeito que se olha uma despesa inesperada que vai ter que entrar na planilha.',
    '"Anota aí", ele diz pro parceiro. E o parceiro anota. Anota o seu rosto.',
    'Eles saem pela trilha. Sem pressa nenhuma. O mais velho para uma vez e olha pra trás, não pra você — pra clareira.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Enfrentou caçadores na Floresta de Viridian'},
      npc:{nome:'Caçador Vasco', opiniao:-5, memoria:'Você o derrotou na floresta. Ele anotou seu rosto.'},
      flag:'inimigo_cacadores', registrar:'Fez inimigos: os caçadores da floresta anotaram seu rosto.'},
  escolhas:[
    {texto:'Seguir eles.', vai:'c3_seguir_depois'},
    {texto:'Voltar pra clareira.', vai:'c3_som'},
    {texto:'Sair da floresta.', vai:'c3_fim'}
  ]
},

c3_seguir_depois:{
  texto:[
    'Você segue os dois a sessenta metros por quase meia hora.',
    'A marcação de fita laranja termina numa estrada de terra fora da floresta. Tem uma caminhonete branca parada e três bolsas de lona no chão da caçamba.',
    'Você anota a placa.',
    'Eles carregam a mochila, entram e vão embora, e nenhum dos dois olha pra trás uma vez.'
  ],
  ef:{flag:['placa_da_caminhonete','provas_da_floresta'],
      rep:{eixo:'bom',delta:1,motivo:'Seguiu até saber para onde ia'},
      registrar:'Anotou a placa da caminhonete branca na estrada de terra.'},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_perdeu_cacador:{
  texto:[
    'Quando acaba, ele se agacha na sua frente pra ficar na sua altura, o que é pior que qualquer coisa que ele podia fazer de pé.',
    '"Você é novo. Então eu vou te explicar uma vez."',
    'Ele fala baixo, quase gentil.',
    '"Essa floresta é grande e ninguém vem procurar ninguém aqui. Da próxima vez que você me ver, você olha pro chão e passa."',
    'Ele pega o que quer da sua mochila. Não pega tudo — deixa o suficiente pra você chegar em Pewter, porque um morto na floresta dá trabalho e você vivo e calado não dá nenhum.',
    'É aritmética. Tudo nele é aritmética.'
  ],
  ef:{dinheiro:-500, hp:-5, causa:'Espancamento na Floresta de Viridian',
      npc:{nome:'Caçador Vasco', opiniao:-3, memoria:'Te derrubou na floresta e te deixou ir. Como aviso.'},
      flag:'humilhado_cacadores', registrar:'Perdeu para os caçadores e foi deixado como aviso.'},
  escolhas:[
    {texto:'Levantar e voltar pra clareira.', vai:'c3_som'},
    {texto:'Levantar e sair da floresta.', vai:'c3_fim'}
  ]
},

c3_mentir:{
  texto:['"Não vi nada."'],
  teste:{status:'carisma', dificuldade:7, nomeStatus:'Carisma',
         critico:'c3_mentiu_bem', sucesso:'c3_mentiu_bem', parcial:'c3_mentiu_mal', falha:'c3_luta_cacador'}
},

c3_mentiu_bem:{
  texto:[
    'Você mente bem. Mais fácil do que devia ser, e essa facilidade é uma informação sobre você que você preferia não ter recebido hoje.',
    'Ele acredita, ou finge acreditar, o que dá no mesmo pelos próximos cinco minutos. Eles passam por você e seguem trilha adentro.',
    'Quando somem na curva, você percebe que estava segurando a respiração.'
  ],
  ef:{flag:'mentiu_cacadores'},
  escolhas:[
    {texto:'Voltar pra clareira correndo.', vai:'c3_som'},
    {texto:'Sair da floresta.', vai:'c3_fim'}
  ]
},

c3_mentiu_mal:{
  texto:[
    'Você mente, mas o rosto entrega. Ele olha pra você mais um segundo do que seria confortável.',
    '"Certo", ele diz. Não acreditou. Deixou passar mesmo assim — porque não vale o trabalho hoje.',
    '"A gente se vê."',
    'Vocês vão se ver.'
  ],
  ef:{npc:{nome:'Caçador Vasco', opiniao:-2, memoria:'Você mentiu mal para ele na floresta.'}},
  escolhas:[
    {texto:'Voltar pra clareira.', vai:'c3_som'},
    {texto:'Sair da floresta.', vai:'c3_fim'}
  ]
},

c3_negociar:{
  texto:['"Tem um Pikachu preso lá atrás. Quanto vale a informação?"'],
  teste:{status:'carisma', dificuldade:8, nomeStatus:'Carisma',
         critico:'c3_negociou', sucesso:'c3_negociou', parcial:'c3_negociou_mal', falha:'c3_negociou_mal'}
},

c3_negociou:{
  texto:[
    'O homem ri pela primeira vez de verdade.',
    'Conta as notas na sua mão, uma por uma, olhando pra você o tempo todo em vez de olhar o dinheiro.',
    '"Olha só. Você aprende rápido."',
    'Ele guarda a carteira. "Se cansar de brincar de treinador, pergunta por mim em Celadon. Tem um lugar lá que abre depois das onze."',
    'O dinheiro pesa no bolso de um jeito estranho, e você vai reparar nesse peso várias vezes nos próximos dias.'
  ],
  ef:{dinheiro:1500, rep:{eixo:'ruim',delta:2,motivo:'Vendeu a localização de um Pokémon preso a caçadores'},
      npc:{nome:'Caçador Vasco', opiniao:2, memoria:'Você vendeu informação pra ele. Ele te acha promissor.'},
      flag:['vendeu_para_cacadores','endereco_celadon_cedo'],
      registrar:'Vendeu informação para os caçadores. Eles gostaram de você.'},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_negociou_mal:{
  texto:[
    '"Informação." Ele repete a palavra como se fosse engraçada. "Garoto, eu amarrei o bicho. Eu sei onde ele tá."',
    'Ele te dá uma nota pequena. Menos por pena e mais por achar graça.',
    '"Toma. Compra um lanche."',
    'A nota fica na sua mão por um tempo antes de você guardar.'
  ],
  ef:{dinheiro:300, rep:{eixo:'ruim',delta:1,motivo:'Tentou vender informação a caçadores'},
      flag:'vendeu_para_cacadores'},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_fim_sem_ver:{
  texto:[
    'Vocês dois saem da floresta pelo norte e não voltam.',
    'Téo fala o caminho inteiro, agora sem medo, e você deixa.',
    'Atrás de vocês, numa clareira que você nunca vai ver, alguma coisa continua girando em volta de uma estaca até não conseguir mais.'
  ],
  ef:{flag:'nao_viu_a_armadilha'},
  escolhas:[{texto:'Seguir.', vai:'c3_fim'}]
},

c3_fim:{
  texto:[
    'A saída norte da floresta dá numa descida de pedra, e Pewter aparece lá embaixo — cinza, sólida, com fumaça de chaminé subindo reta.',
    'Você senta na pedra por um tempo antes de descer. As pernas pedem.',
    d=>{
      if (d.flags.ignorou_pikachu || d.flags.vendeu_para_cacadores)
        return 'Alguma coisa ficou naquela floresta que era sua. Você não vai conseguir explicar o que foi, nem pra você mesmo, e vai tentar algumas vezes.';
      if (d.flags.pikachu_aliado)
        return 'O Pikachu senta na pedra do seu lado, ainda mancando um pouco, e olha Pewter lá embaixo com uma curiosidade que não combina com o que aconteceu com ele esta semana.';
      if (d.flags.salvou_o_teo)
        return 'Téo desce na frente e para no meio da descida pra esperar você, duas vezes, como se não confiasse que você vem atrás.';
      return 'Você entrou numa floresta achando que o perigo era o mato. O mato era a parte fácil.';
    },
    'Daqui pra frente, a estrada é sua de novo: dá pra descer pra Pewter, dá pra voltar, dá pra ficar.'
  ],
  fim:true, resumo:'A floresta te mostrou que gente é pior que bicho.'
}
}}

);
