/* ------------------------------------------------------------
   ABERTURAS — as sete guaritas da Rota 23 têm gente dentro pela
   primeira vez. Você descobre isso na primeira cancela, na fila,
   no mato ou pela boca de quem voltou.
   ------------------------------------------------------------ */
const C24_ABERTURAS = ['c24_a_primeira', 'c24_ab_a_fila', 'c24_ab_quem_voltou', 'c24_ab_o_aviso'];
function c24_cabe(id, d){ return true; }
function c24_abertura(d){ return Dados.escolher(C24_ABERTURAS.filter(id => c24_cabe(id, d))); }

/* ============================================================
   CAPÍTULO 24 — SETE GUARITAS
   Rota 23. O caminho para o Planalto agora tem controle de
   acesso, e controle de acesso é um lugar onde se decide quem
   é gente e quem é processo.
   ============================================================ */
CAPITULOS.push(

{
num:24, titulo:'Sete Guaritas', local:'Rota 23 — controle de acesso', ambiente:'montanha', nivelArea:56,
tom:'muito sombrio', entradas:C24_ABERTURAS,
inicio: d => c24_abertura(d),
cenas:{

c24_ab_a_fila:{
  texto:[
    'Tem fila na primeira guarita, o que é a coisa mais absurda que já aconteceu na Rota 23.',
    'Onze pessoas em fila indiana numa estrada de montanha, com mochila no chão, esperando a vez de mostrar o cartão de treinador.',
    'O décimo é atendido em quarenta segundos. O nono levou quarenta segundos. O oitavo levou quatro minutos e foi mandado de volta.',
    'Você não viu por quê. Ninguém viu por quê. Ele desceu a estrada sem falar com ninguém da fila.',
    'A pessoa na sua frente vira pra trás.',
    fala('a mulher da fila', 'É o terceiro hoje.'),
    d=>fala(d.jogador.nome, 'Terceiro que volta?'),
    fala('a mulher da fila', 'Terceiro. E são nove da manhã.'),
    'Ela puxa a mochila com o pé pra frente, avançando um lugar.',
    fala('a mulher da fila', 'Eu tô com as oito insígnias e a licença em dia e eu tô com medo, e eu nem sei do quê.')
  ],
  ef:{flag:['entrou_nas_guaritas','tres_voltaram_hoje'],
      registrar:'Três pessoas foram barradas na primeira guarita antes das nove da manhã.',
      presagio:'Oito insígnias e licença em dia não estão bastando pra alguma coisa que ninguém explicou.'},
  escolhas:[
    {texto:'Esperar a vez e passar.', vai:'c24_a_terceira'},
    {texto:'Perguntar ao guarda por que barraram os três.', vai:'c24_perguntou_por_que'},
    {texto:'Perguntar de quem é o uniforme cinza.', vai:'c24_o_uniforme'},
    {texto:'Sair da fila e contornar pelo mato.', vai:'c24_contornou'}
  ]
},

c24_ab_quem_voltou:{
  texto:[
    'Você encontra ele a quatro quilômetros da primeira guarita, descendo, sentado numa pedra da beira da estrada com a mochila no colo.',
    'Uns vinte e cinco anos. Não está chorando e não está bravo: está sentado do jeito de quem parou pra entender uma coisa e não conseguiu.',
    'O cartão de treinador está aberto na mão dele, virado pra cima, e dá pra ler o nome de onde você está: Riku.',
    fala('Riku', 'Não sobe hoje.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('Riku', 'Porque eles têm uma lista e eu tava nela.'),
    'Ele abre o cartão de treinador na mão e olha pra ele.',
    fala('Riku', 'Oito insígnias. Licença em dia. Sem ocorrência.'),
    fala('Riku', 'O cara passou o leitor, a máquina apitou uma vez, e ele olhou uma segunda tela que eu não vi.'),
    fala('Riku', 'E falou "hoje não".'),
    d=>fala(d.jogador.nome, 'Só isso?'),
    fala('Riku', 'Só isso. Educado. Ele até pediu desculpa.', 'baixo')
  ],
  ef:{flag:['entrou_nas_guaritas','a_segunda_tela'],
      npc:{nome:'Riku', opiniao:1, viuVoce:'Te avisou, descendo, que existe uma segunda tela.'},
      registrar:'As guaritas consultam uma segunda tela que o desafiante não vê.',
      presagio:'A primeira tela diz se você pode. A segunda diz se querem.'},
  escolhas:[
    {texto:'Subir mesmo assim e passar pela primeira guarita.', vai:'c24_a_primeira'},
    {texto:'Perguntar o que ele vai fazer agora.', vai:'c24_ab_o_que_ele_vai_fazer'},
    {texto:'Subir contornando as guaritas pelo mato.', vai:'c24_contornou'}
  ]
},

c24_ab_o_que_ele_vai_fazer:{
  texto:[
    fala('Riku', 'Voltar. Tentar de novo semana que vem.'),
    d=>fala(d.jogador.nome, 'E se semana que vem for igual?'),
    'Ele demora.',
    fala('Riku', 'Aí eu volto de novo.'),
    'Ele põe o cartão no bolso e fecha o zíper da mochila.',
    fala('Riku', 'Eu levei quatro anos pras oito insígnias. Quatro.'),
    fala('Riku', 'Eu não vou parar por causa de um sujeito com um leitor.'),
    'Ele levanta da pedra e começa a descer, e depois de uns dez metros para e vira.',
    fala('Riku', 'Ô. Se você passar, olha a segunda tela.'),
    fala('Riku', 'Não pra mim. Pra você saber o que é.')
  ],
  ef:{flag:'prometeu_olhar_a_segunda_tela',
      npc:{nome:'Riku', opiniao:2, viuVoce:'Te pediu pra olhar a segunda tela se você passasse.'},
      registrar:'Prometeu olhar a segunda tela das guaritas.'},
  escolhas:[
    {texto:'Subir e passar pela primeira guarita.', vai:'c24_a_primeira'},
    {texto:'Contornar pelo mato.', vai:'c24_contornou'}
  ]
},

c24_ab_o_aviso:{
  texto:[
    'Na entrada da Rota 23, pregado num poste de madeira com quatro tachinhas, tem um aviso que não estava lá da última vez.',
    'Papel A4 plastificado, impresso, com o brasão da Liga:',
    '**"CONTROLE DE ACESSO REATIVADO. Desafiantes devem portar cartão de treinador válido. A Liga reserva-se o direito de indeferir o acesso a qualquer tempo, sem necessidade de motivação."**',
    'Você lê a última parte duas vezes.',
    '"Sem necessidade de motivação."',
    'Isso é a frase mais honesta que a Liga escreveu em qualquer papel que chegou às suas mãos, e ela está pregada num poste onde todo mundo passa.',
    'E, escrito à mão embaixo do aviso, a caneta esferográfica azul, com a letra torta de quem escreveu em pé:',
    '**"e sem necessidade de explicação, e sem ninguém pra reclamar"**',
    'A caneta furou o papel em dois pontos.'
  ],
  ef:{flag:['entrou_nas_guaritas','o_aviso_do_poste'],
      registrar:'A Liga reativou o controle de acesso da Rota 23 e reserva-se o direito de indeferir sem motivação.',
      presagio:'Alguém já leu esse aviso antes de você e escreveu a resposta com a caneta furando o papel.'},
  escolhas:[
    {texto:'Seguir e passar pela primeira guarita.', vai:'c24_a_primeira'},
    {texto:'Arrancar o aviso e levar.', vai:'c24_ab_arrancou_o_aviso'},
    {texto:'Contornar as guaritas pelo mato.', vai:'c24_contornou'}
  ]
},

c24_ab_arrancou_o_aviso:{
  texto:[
    'Você tira as quatro tachinhas com a unha, o que leva mais tempo do que arrancar, e é de propósito: você quer o papel inteiro.',
    'Plastificado, com brasão, com a frase da não-motivação, e com a resposta a caneta azul no rodapé.',
    'Você dobra ao meio, o que o plástico não gosta, e guarda com o resto.',
    'E aí você olha pro poste vazio e entende uma coisa desconfortável: quem vier depois de você não vai ler o aviso.',
    'Não vai saber que pode ser barrado sem motivo. Vai subir os quatro quilômetros e descobrir na guarita.',
    'Você fica com o papel na mão por um tempo, sem decidir.'
  ],
  ef:{flag:'tem_o_aviso_do_poste',
      registrar:'Arrancou do poste o aviso do controle de acesso da Rota 23.'},
  escolhas:[
    {texto:'Pregar de volta e seguir. O papel é mais útil no poste.', vai:'c24_ab_pregou_de_volta'},
    {texto:'Levar. Papel com brasão vale mais na sua pilha.', vai:'c24_a_primeira'}
  ]
},

c24_ab_pregou_de_volta:{
  texto:[
    'Você prega de volta com as quatro tachinhas, nos mesmos furos, o que é difícil e você consegue.',
    'E aí faz uma coisa a mais: tira a caneta e escreve, abaixo da frase de quem passou antes de você, numa letra também torta porque você também está em pé:',
    '**"mas tem. tem gente pra reclamar. sobe."**',
    'É bobo. Você sabe que é bobo enquanto escreve.',
    'Você sobe os quatro quilômetros até a primeira guarita pensando em quem vai ler isso, e é a primeira vez em muito tempo que você pensa em alguém que não tem nome.'
  ],
  ef:{flag:'escreveu_no_aviso', moral:1,
      rep:{eixo:'bom', delta:1, motivo:'Deixou o aviso no poste e escreveu uma linha embaixo pra quem vier.'},
      registrar:'Deixou o aviso no poste e escreveu uma linha embaixo para quem subir depois.'},
  escolhas:[
    {texto:'Passar pela primeira guarita.', vai:'c24_a_primeira'},
    {texto:'Contornar pelo mato.', vai:'c24_contornou'}
  ]
},


c24_a_primeira:{
  texto:[
    'A Rota 23 sempre teve as sete guaritas. Elas estavam lá antes de você nascer, de pedra, com telhado de duas águas e nenhuma porta.',
    'A diferença é que agora elas têm gente dentro.',
    'Sete guaritas, sete pessoas de uniforme cinza que não é uniforme da Liga, e uma cancela de madeira pintada de branco e vermelho em cada uma.',
    fala('o guarda da primeira', 'Cartão de treinador, por favor.'),
    'Você entrega. Ele passa o leitor. A máquina apita uma vez.',
    fala('o guarda da primeira', 'Oito insígnias, licença válida, sem restrição.'),
    fala('o guarda da primeira', 'Passa na segunda que eles conferem de novo.', 'frio')
  ],
  ef:{flag:'entrou_nas_guaritas',
      registrar:'As sete guaritas da Rota 23 agora têm gente dentro. Uniforme cinza.'},
  escolhas:[
    {texto:'Passar. São sete e você tem o dia inteiro.', vai:'c24_a_terceira'},
    {texto:'Perguntar por que conferem de novo se já conferiram.', vai:'c24_perguntou_por_que'},
    {texto:'Perguntar de quem é o uniforme cinza.', vai:'c24_o_uniforme'},
    {texto:'Contornar as guaritas pelo mato. Elas não têm porta e nem cerca.', vai:'c24_contornou'}
  ]
},

c24_perguntou_por_que:{
  texto:[
    d=>fala(d.jogador.nome, 'Se o senhor já conferiu, por que a segunda confere de novo?'),
    'O guarda olha pra você com a paciência exausta de quem já respondeu isso doze vezes hoje.',
    fala('o guarda da primeira', 'Porque a minha máquina lê o cartão e a máquina dele lê outra coisa.'),
    fala('o guarda da primeira', 'A da terceira lê outra. A da quinta lê outra.'),
    d=>fala(d.jogador.nome, 'Lê o quê?'),
    fala('o guarda da primeira', 'Moço, eu ganho por turno.', 'baixo'),
    fala('o guarda da primeira', 'Eu sei ligar a minha e sei desligar a minha. Passa.')
  ],
  ef:{flag:'as_maquinas_leem_coisas_diferentes',
      rep:{eixo:'bom',delta:1,motivo:'Perguntou o que as máquinas liam'},
      registrar:'Cada guarita tem uma máquina que lê uma coisa diferente.'},
  escolhas:[
    {texto:'Seguir e prestar atenção em cada máquina.', vai:'c24_a_terceira'},
    {texto:'Perguntar de quem é o uniforme cinza.', vai:'c24_o_uniforme'}
  ]
},

c24_o_uniforme:{
  texto:[
    d=>fala(d.jogador.nome, 'Esse uniforme é de quem? Não é da Liga.'),
    'Ele puxa a manga e mostra o bordado no ombro, que é uma coisa que ele claramente já fez hoje e que já cansou de fazer.',
    'O bordado é um círculo com três linhas dentro e uma sigla embaixo em letra pequena.',
    fala('o guarda da primeira', 'Empresa terceirizada. Eu sou de Celadon, eu fiz uma prova, eu passei, eu vim.'),
    fala('o guarda da primeira', 'Quem paga eu não sei. O contracheque vem de um banco de Saffron e é o que eu sei.'),
    'A sigla embaixo do círculo tem quatro letras e você já viu essas quatro letras em papel timbrado antes.'
  ],
  ef:{flag:'as_guaritas_sao_terceirizadas',
      rep:{eixo:'bom',delta:1,motivo:'Identificou quem controla o acesso ao Planalto'},
      registrar:'As guaritas são de empresa terceirizada, paga por um banco de Saffron.'},
  escolhas:[
    {texto:'Seguir.', vai:'c24_a_terceira'},
    {texto:'Anotar a sigla e o número do bordado.', vai:'c24_anotou_a_sigla',
     ef:{itens:{'Sigla e número do bordado, anotados':1}, flag:'anotou_a_sigla'}}
  ]
},

c24_anotou_a_sigla:{
  texto:[
    'Você pede um papel emprestado, o guarda te dá o verso de um comprovante, e você copia a sigla e o número de série bordado embaixo dela.',
    fala('o guarda da primeira', 'Isso não é proibido.', null, 'Ele fala mais pra si mesmo do que pra você.'),
    fala('o guarda da primeira', 'Eu acho que não é proibido. Passa logo.')
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Anotou o que estava à vista de todo mundo'},
      registrar:'Anotou a sigla e o número de série do bordado dos uniformes.'},
  escolhas:[{texto:'Seguir para a terceira guarita.', vai:'c24_a_terceira'}]
},

c24_contornou:{
  texto:[
    'As guaritas não têm porta, não têm cerca e não têm nada dos lados. Elas são sete casinhas de pedra numa estrada de montanha.',
    'Você sai da estrada, anda trinta metros de mato, e passa as sete em quarenta minutos sem falar com ninguém.',
    'Do outro lado, esperando na pedra, sentado, tem um oitavo guarda que não tem guarita.',
    fala('o oitavo guarda', 'Todo mundo tenta.', null, 'Ele nem levanta.'),
    fala('o oitavo guarda', 'Eu fico aqui justamente porque todo mundo tenta, e porque sair da estrada não é crime, e porque eu não posso te prender.'),
    fala('o oitavo guarda', 'Eu só anoto. Você quer me dizer o seu nome ou eu escrevo "desconhecido" e descrevo a sua cara?', 'frio')
  ],
  ef:{flag:'contornou_as_guaritas',
      registrar:'Contornou as sete guaritas pelo mato. Tinha um oitavo guarda do outro lado.'},
  escolhas:[
    {texto:'Dar o nome.', vai:'c24_deu_o_nome',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Deu o próprio nome quando podia mentir'}}},
    {texto:'Deixar ele escrever "desconhecido".', vai:'c24_desconhecido',
     ef:{flag:'anotado_como_desconhecido', rep:{eixo:'ruim',delta:1,motivo:'Passou como desconhecido no controle de acesso'}}},
    {texto:'Voltar e passar pelas sete, do jeito certo.', vai:'c24_voltou_pra_estrada'}
  ]
},

c24_deu_o_nome:{
  texto:[
    d=>fala(d.jogador.nome, d.jogador.nome + '. De ' + d.jogador.cidade + '.'),
    'Ele escreve devagar, com letra de forma, e mostra o papel pra você conferir a grafia, o que é uma cortesia estranha nas circunstâncias.',
    fala('o oitavo guarda', 'Tá certo assim?'),
    d=>fala(d.jogador.nome, 'Tá.'),
    fala('o oitavo guarda', 'Passa. E olha: da próxima vez vai pela estrada. Não porque é regra.'),
    fala('o oitavo guarda', 'É que quem vai pela estrada aparece em sete papéis, e quem vem pelo mato aparece só no meu.', 'baixo'),
    fala('o oitavo guarda', 'Papel sozinho some. Sete papéis não somem.')
  ],
  ef:{flag:'conselho_do_oitavo_guarda', moral:2,
      npc:{nome:'Oitavo guarda', opiniao:3, memoria:'Te ensinou que sete papéis não somem e um papel sozinho some.'},
      rep:{eixo:'bom',delta:1,motivo:'Escutou um conselho que ninguém era obrigado a dar'},
      registrar:'O oitavo guarda: "papel sozinho some, sete papéis não somem".'},
  escolhas:[
    {texto:'Voltar e passar pelas sete guaritas mesmo assim.', vai:'c24_voltou_pra_estrada'},
    {texto:'Seguir pro Planalto.', vai:'c24_chegou_no_planalto'}
  ]
},

c24_desconhecido:{
  texto:[
    'Ele escreve DESCONHECIDO em letra de forma e, embaixo, três linhas descrevendo a sua roupa, a sua altura e o Pokémon que estava do seu lado.',
    'A descrição é boa. A descrição é boa demais. Qualquer pessoa que leia isso te identifica na rua.',
    fala('o oitavo guarda', 'Pronto. Agora existe um papel com a sua descrição e sem o seu nome.'),
    fala('o oitavo guarda', 'Você acha que isso te protege. Eu trabalho com papel há onze anos.', 'frio'),
    fala('o oitavo guarda', 'Papel com descrição e sem nome é o papel mais perigoso que existe, porque ele serve pra qualquer um que caiba na descrição.')
  ],
  ef:{flag:'existe_um_papel_sem_seu_nome', moral:-3,
      registrar:'Existe um papel no controle de acesso com a sua descrição e sem o seu nome.'},
  escolhas:[
    {texto:'Voltar atrás e dar o nome.', vai:'c24_deu_o_nome',
     ef:{limpaFlag:'anotado_como_desconhecido'}},
    {texto:'Seguir assim mesmo.', vai:'c24_chegou_no_planalto'}
  ]
},

c24_voltou_pra_estrada:{
  texto:[
    'Você desce os trinta metros de mato de volta, entra na estrada antes da segunda guarita, e passa pelas seis que faltavam na ordem.',
    'Leva uma hora e quarenta. Cada uma confere uma coisa diferente e nenhuma explica o quê.',
    'Na sétima, a mulher de uniforme cinza olha o seu cartão e o histórico de passagem e franze a testa.',
    fala('a guarda da sétima', 'O senhor entrou pela primeira e reapareceu na segunda quarenta minutos depois.'),
    fala('a guarda da sétima', 'Isso é sete minutos de caminhada.'),
    d=>fala(d.jogador.nome, 'Eu me perdi.'),
    fala('a guarda da sétima', 'Aqui não tem onde se perder.', 'frio', 'Ela escreve alguma coisa. Ela escreve mais do que caberia em "se perdeu".')
  ],
  ef:{flag:'anotado_na_setima',
      registrar:'A sétima guarita anotou os quarenta minutos que você sumiu.'},
  escolhas:[{texto:'Seguir pro Planalto.', vai:'c24_chegou_no_planalto'}]
},

/* ── a via da estrada ──────────────────────────────────────── */
c24_a_terceira:{
  texto:[
    'Segunda guarita: leitor de cartão, apita, passa.',
    'Terceira guarita: a máquina é diferente. É maior, tem um visor verde, e o guarda digita alguma coisa antes de passar o cartão.',
    'Ele lê o visor. Ele lê de novo. Ele olha pra você.',
    fala('o guarda da terceira', 'O senhor tem registro de acompanhamento ativo.'),
    d=>fala(d.jogador.nome, 'O que é isso?'),
    fala('o guarda da terceira', 'Eu não sei o que é. Aparece no meu visor e eu sou obrigado a informar ao portador.'),
    fala('o guarda da terceira', 'Tá informado. Passa.', 'frio')
  ],
  ef:{flag:'registro_de_acompanhamento_ativo',
      registrar:'A terceira guarita informou: você tem registro de acompanhamento ativo.'},
  escolhas:[
    {texto:'Exigir ver o visor.', vai:'c24_exigiu_o_visor'},
    {texto:'Perguntar desde quando.', vai:'c24_desde_quando'},
    {texto:'Passar e seguir.', vai:'c24_a_quinta'}
  ]
},

c24_exigiu_o_visor:{
  texto:[
    'Você pede pra ver, e ele diz que não pode, e você pede de novo, e ele olha pros lados e vira o visor dez graus.',
    'Dez graus é o suficiente.',
    fala('o visor', 'ACOMP. ATIVO — ORIGEM: 704 — NÍVEL: 2 — REVISÃO: TRIMESTRAL', 'frio'),
    'Sala 704. Sétimo andar. Prédio comercial com farmácia no térreo.',
    'Nível 2. Existe nível 1 e existem níveis acima de 2.',
    fala('o guarda da terceira', 'O senhor não viu isso.', 'baixo'),
    fala('o guarda da terceira', 'Eu tenho filho. Passa.')
  ],
  ef:{flag:'viu_o_visor', moral:-2,
      itens:{'Anotação: ACOMP. ATIVO — 704 — NÍVEL 2':1},
      npc:{nome:'Guarda da terceira', opiniao:2, memoria:'Virou o visor dez graus pra você ver. Tem filho.'},
      rep:{eixo:'bom',delta:2,motivo:'Insistiu até ver o que estava escrito sobre você', rep:{notorio:true}},
      registrar:'ACOMP. ATIVO — ORIGEM 704 — NÍVEL 2 — REVISÃO TRIMESTRAL.'},
  escolhas:[
    {texto:'Agradecer sem chamar atenção e seguir.', vai:'c24_a_quinta'},
    {texto:'Perguntar quantos níveis existem.', vai:'c24_quantos_niveis'}
  ]
},

c24_quantos_niveis:{
  texto:[
    d=>fala(d.jogador.nome, 'Quantos níveis existem?'),
    'Ele fecha o visor com a mão, o que é tarde demais e ele sabe.',
    fala('o guarda da terceira', 'Quatro.'),
    fala('o guarda da terceira', 'No quatro a cancela não levanta. Eu nunca vi um quatro. O turno da noite viu um em março.'),
    d=>fala(d.jogador.nome, 'E aí?'),
    fala('o guarda da terceira', 'E aí a cancela não levantou.', 'frio')
  ],
  ef:{flag:'sabe_dos_quatro_niveis',
      rep:{eixo:'bom',delta:1,motivo:'Perguntou o que estava no fim da escala'},
      registrar:'Existem quatro níveis de acompanhamento. No quatro, a cancela não levanta.'},
  escolhas:[{texto:'Seguir.', vai:'c24_a_quinta'}]
},

c24_desde_quando:{
  texto:[
    d=>fala(d.jogador.nome, 'Desde quando eu tenho isso?'),
    'Ele digita. Espera. Lê.',
    fala('o guarda da terceira', 'Data de abertura...', null, 'Ele para e confere de novo, porque o número parece errado.'),
    d=>fala('o guarda da terceira', `Três semanas depois da sua primeira licença. O senhor tinha... ${d.insignias.length ? 'nenhuma insígnia ainda' : 'nada ainda'}.`),
    'Três semanas. Você ainda estava na Floresta de Viridian errando o caminho marcado.',
    fala('o guarda da terceira', 'Passa, moço. Por favor.', 'baixo')
  ],
  ef:{flag:'sabe_desde_quando_te_seguem', moral:-3,
      rep:{eixo:'bom',delta:1,motivo:'Descobriu há quanto tempo era observado'},
      registrar:'O acompanhamento foi aberto três semanas depois da sua primeira licença.'},
  escolhas:[
    {texto:'Exigir ver o visor.', vai:'c24_exigiu_o_visor'},
    {texto:'Seguir.', vai:'c24_a_quinta'}
  ]
},

c24_a_quinta:{
  texto:[
    'Quarta guarita: leitor, apita, passa. A guarda não levanta a cabeça.',
    'Quinta guarita: tem duas pessoas dentro em vez de uma, e a cancela está abaixada com um carro parado na frente.',
    'É um carro preto de vidro escuro com placa de Saffron, e ele está parado ali há tempo suficiente pro motor estar frio.',
    'Um dos dois guardas está do lado de fora da guarita, de costas pro carro, olhando a estrada de onde você vem.',
    'Ele te vê chegar e faz uma coisa muito pequena com a cabeça: um movimento de dois centímetros, pra trás, na direção do carro.',
    'É um aviso. Ele está te avisando.'
  ],
  ef:{flag:'o_carro_preto_na_quinta',
      registrar:'Um carro preto de placa de Saffron parado na quinta guarita, com o motor frio.'},
  escolhas:[
    {texto:'Ir até o carro e bater no vidro.', vai:'c24_bateu_no_vidro'},
    {texto:'Passar reto, sem olhar pro carro.', vai:'c24_passou_reto'},
    {texto:'Esperar. Sentar na pedra e ver quanto tempo eles aguentam.', vai:'c24_esperou'},
    {texto:'Agradecer o aviso do guarda antes de decidir.', vai:'c24_agradeceu_o_aviso'}
  ]
},

c24_agradeceu_o_aviso:{
  texto:[
    'Você chega perto e fala baixo, olhando pra estrada e não pra ele, do jeito que se fala com alguém que arriscou alguma coisa por você.',
    d=>fala(d.jogador.nome, 'Obrigado.'),
    fala('o guarda da quinta', 'Eu não fiz nada.'),
    fala('o guarda da quinta', 'Estão aí desde as sete da manhã. Não desceram, não falaram comigo, não mostraram documento.'),
    fala('o guarda da quinta', 'E o meu visor apitou quando eles chegaram, e eu não apertei nada.', 'baixo')
  ],
  ef:{flag:'o_guarda_da_quinta_ajudou',
      npc:{nome:'Guarda da quinta', opiniao:3, memoria:'Te avisou do carro preto com um movimento de dois centímetros.'},
      rep:{eixo:'bom',delta:1,motivo:'Agradeceu quem se arriscou por você'},
      registrar:'O carro preto estava na quinta guarita desde as sete da manhã.'},
  escolhas:[
    {texto:'Ir até o carro.', vai:'c24_bateu_no_vidro'},
    {texto:'Passar reto.', vai:'c24_passou_reto'},
    {texto:'Sentar na pedra e esperar.', vai:'c24_esperou'}
  ]
},

c24_bateu_no_vidro:{
  texto:[
    'Você atravessa os quinze metros e bate no vidro do motorista com dois nós do dedo, duas vezes, como se fosse a coisa mais normal do mundo.',
    'Silêncio de cinco segundos.',
    'O vidro de trás desce vinte centímetros.',
    fala('a mulher de crachá azul', 'Você é a primeira pessoa que bate no vidro.', null, 'Dá pra ver só os olhos dela e parte da boca.'),
    fala('a mulher de crachá azul', 'Em três anos fazendo isso, ninguém nunca bateu no vidro. Todo mundo passa reto e olha pelo canto.'),
    fala('a mulher de crachá azul', 'Segunda, dez horas, Planalto. Eu vou estar na sala.'),
    fala('a mulher de crachá azul', 'Eu vim aqui só pra ter certeza de que você ia subir essa estrada. Agora eu tenho.', 'frio'),
    'O vidro sobe. O carro liga. Eles vão embora na direção de Saffron e não olham pra trás.'
  ],
  ef:{flag:'bateu_no_vidro_do_carro', moral:3,
      npc:{nome:'Mulher de crachá azul', opiniao:2, memoria:'Você bateu no vidro do carro dela. Ninguém nunca tinha batido.'},
      rep:{eixo:'bom',delta:3,motivo:'Bateu no vidro do carro que estava te esperando', rep:{notorio:true}},
      registrar:'Bateu no vidro do carro preto. Ela disse que ninguém nunca tinha batido.'},
  escolhas:[{texto:'Seguir para a sexta e a sétima.', vai:'c24_chegou_no_planalto'}]
},

c24_passou_reto:{
  texto:[
    'Você passa reto, olha pra frente, não vira a cabeça um grau sequer, e sente o carro do lado direito do seu corpo por quinze metros inteiros.',
    'Ninguém desce. O vidro não abre.',
    'Trinta metros adiante você ouve o motor ligar atrás de você, e o carro passa devagar pelo seu lado, e continua subindo a estrada, e some na curva.',
    'Eles estavam indo pro mesmo lugar que você o tempo todo. Só chegaram antes.'
  ],
  ef:{flag:'passou_reto_pelo_carro',
      registrar:'O carro preto subiu a estrada na frente de você.'},
  escolhas:[{texto:'Continuar subindo.', vai:'c24_chegou_no_planalto'}]
},

c24_esperou:{
  texto:[
    'Você senta na pedra do acostamento a dez metros do carro e espera.',
    'Quinze minutos. Trinta. Quarenta e cinco.',
    'Os dois guardas da quinta fingem muito mal que não estão prestando atenção. Um deles limpa o mesmo vidro três vezes.',
    'Aos cinquenta e dois minutos, o vidro de trás desce vinte centímetros.',
    fala('a mulher de crachá azul', 'Você venceu.', 'riso'),
    fala('a mulher de crachá azul', 'Eu tenho uma reunião às três e você acabou de gastar cinquenta minutos meus, e eu não consigo nem ficar brava.'),
    fala('a mulher de crachá azul', 'Segunda, dez horas, Planalto. Sobe a estrada.', 'frio')
  ],
  ef:{flag:'esperou_o_carro', moral:4,
      npc:{nome:'Mulher de crachá azul', opiniao:3, memoria:'Sentou numa pedra e esperou cinquenta e dois minutos até ela abrir o vidro.'},
      rep:{eixo:'bom',delta:3,motivo:'Sentou numa pedra e ganhou no tempo', rep:{notorio:true}},
      registrar:'Esperou cinquenta e dois minutos sentado numa pedra até o vidro descer.'},
  escolhas:[{texto:'Subir a estrada.', vai:'c24_chegou_no_planalto'}]
},

c24_chegou_no_planalto:{
  texto:[
    'Sexta guarita: leitor, apita, passa. A guarda deseja boa sorte e parece estar falando sério.',
    'Sétima guarita: a máquina não apita. Ela faz um som diferente, mais grave, uma nota só.',
    'O guarda da sétima olha o visor, olha você, e levanta a cancela sem falar nada — e é a única das sete que levanta a cancela antes de devolver o cartão.',
    'Do outro lado das sete guaritas a estrada sobe mais quatro quilômetros e vira à direita, e do alto da curva dá pra ver o Planalto Indigo inteiro.',
    d=>d.flags.bateu_no_vidro_do_carro || d.flags.esperou_o_carro
      ? 'Tem um carro preto estacionado no pátio, de vidro escuro, com placa de Saffron. Chegou primeiro.'
      : 'Tem um carro preto estacionado no pátio, de vidro escuro, com placa de Saffron. Você não sabe há quanto tempo.',
    'Segunda, dez horas. Sala com mesa comprida, quatro cadeiras.'
  ],
  ef:{flag:'chegou_pro_planalto',
      registrar:'Passou as sete guaritas. A sétima levantou a cancela antes de devolver o cartão.'},
  fim:true
}

}
}

);
