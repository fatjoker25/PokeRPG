/* ============================================================
   CAPÍTULO 13 — CONGELOU  (Ilhas Seafoam)
   ============================================================ */
CAPITULOS.push(
{
num:13, titulo:'Congelou', local:'Ilhas Seafoam', ambiente:'agua', nivelArea:42,
tom:'muito sombrio', inicio:'c13_cais',
cenas:{

c13_cais:{
  texto:[
    'O cais de Fuchsia tem quarenta e dois barcos e trinta e nove deles estão amarrados.',
    'Não é domingo. É uma terça-feira de outubro às cinco e meia da manhã, que é o horário em que um cais de pesca deveria estar vazio de barco e cheio de gente.',
    'Está o contrário.',
    'Tem umas sessenta pessoas no cais, sentadas, encostadas, jogando dominó numa mesa de plástico, e trinta e nove barcos amarrados atrás delas.',
    'Você pergunta pro primeiro o que aconteceu e ele responde apontando o horizonte com o queixo, sem falar nada.',
    'A duzentos e poucos quilômetros ao sul, num dia limpo como hoje, dá pra ver uma linha branca na altura do mar.',
    'Gelo.',
    'Gelo no mar, em Kanto, em outubro, a duzentos quilômetros da costa e avançando.'
  ],
  ef:{registrar:'A frota de Fuchsia está parada. Há gelo no mar, em outubro.',
      presagio:'Trinta e nove barcos amarrados numa terça de manhã. Isso é uma economia inteira parada.'},
  escolhas:[
    {texto:'Procurar quem te leve até lá.', vai:'c13_procurar_barco'},
    {texto:'Perguntar quando começou.', vai:'c13_quando_comecou'},
    {texto:'Ir à colônia de pescadores.', vai:'c13_colonia'},
    {texto:'Sentar na mesa de dominó e ouvir.', vai:'c13_domino'}
  ]
},

c13_quando_comecou:{
  texto:[
    '"Quando começou?"',
    'A resposta vem de três pessoas ao mesmo tempo e todas dão a mesma data, o que é raro num cais.',
    '"Quatro de junho."',
    '"Como vocês sabem o dia?"',
    'Um deles — magro, de boné — ri.',
    '"Porque no dia quatro de junho a água baixou três graus de um dia pro outro."',
    '"Três graus em um dia?"',
    '"Três graus em um dia. Todo barco daqui tem termômetro de fundo, moço, porque peixe segue temperatura. A gente anota todo dia desde sempre, é o caderno de bordo."',
    'Ele bate no bolso da camisa.',
    '"Três de junho: dezenove e meio. Quatro de junho: dezesseis e meio."',
    '"E depois?"',
    '"E depois desce meio grau por semana, sem falhar uma, até hoje."',
    'Ele faz a conta com o dedo no ar.',
    '"Dezenove semanas. Nove graus e meio a menos. E hoje tem gelo."'
  ],
  ef:{flag:['sabe_da_data','sabe_da_curva'],
      rep:{eixo:'bom',delta:2,motivo:'Perguntou quando, e a resposta era um número'},
      registrar:'A água baixou 3 graus em 4 de junho e desce meio grau por semana desde então.',
      presagio:'Meio grau por semana, sem falhar uma. Isso não é clima. Clima falha.'},
  escolhas:[
    {texto:'"O que aconteceu no dia quatro de junho?"', vai:'c13_quatro_de_junho'},
    {texto:'Ir à colônia ver os cadernos de bordo.', vai:'c13_colonia'},
    {texto:'Procurar quem te leve até lá.', vai:'c13_procurar_barco'},
    {texto:'Sentar na mesa de dominó.', vai:'c13_domino'}
  ]
},

c13_quatro_de_junho:{
  texto:[
    '"O que aconteceu no dia quatro de junho?"',
    'E aí o cais inteiro fica quieto.',
    'Não é silêncio dramático. É silêncio de gente que estava conversando e parou porque a conversa mudou de assunto e o assunto novo é ruim.',
    'O magro de boné olha pros outros. Os outros olham pro chão.',
    'Depois de uns dez segundos, uma mulher de uns cinquenta anos, sentada na beirada do cais com os pés pra fora, responde sem virar:',
    '"No dia três de junho o Estrela do Sul saiu pra arrasto de fundo na quebra das Seafoam."',
    '"E?"',
    '"E voltou no dia quatro de manhã com a rede rasgada e sem contar pra ninguém o que tinha rasgado."',
    'Ela cospe na água.',
    '"E o Dorival nunca mais saiu pra pescar."'
  ],
  ef:{flag:['sabe_do_estrela_do_sul','sabe_do_dorival'],
      rep:{eixo:'bom',delta:3,motivo:'Fez a pergunta que calou o cais'},
      registrar:'O barco Estrela do Sul pescou na quebra das Seafoam em 3 de junho e voltou com a rede rasgada.',
      presagio:'Ele nunca mais saiu pra pescar. Guarde o nome: Dorival.'},
  escolhas:[
    {texto:'"Onde mora o Dorival?"', vai:'c13_dorival'},
    {texto:'Ir à colônia ver os registros.', vai:'c13_colonia'},
    {texto:'Procurar quem te leve às Seafoam.', vai:'c13_procurar_barco'},
    {texto:'Não ir atrás dele. Ir direto pras ilhas.', vai:'c13_procurar_barco'}
  ]
},

c13_domino:{
  texto:[
    'Você senta no quarto lugar da mesa de dominó, que está vago, e ninguém reclama porque num cais parado a mesa aceita qualquer um.',
    'Você joga três partidas e perde três e ouve mais em uma hora do que conseguiria em uma semana de perguntas.',
    'Colhe isto:',
    '— A colônia tem seiscentos e quatro associados e trezentos e onze deles não tiram um centavo há dezenove semanas.',
    '— O seguro-defeso não cobre isso, porque isso não é defeso: defeso é época de reprodução e tem data no calendário, e o que está acontecendo não tem data no calendário.',
    '— Quatro famílias já foram embora pra Vermilion.',
    '— E a frase que se repete, dita por quatro pessoas diferentes, com as mesmas palavras, o que quer dizer que alguém disse primeiro e a cidade adotou:',
    '"O mar avisa três vezes. Essa foi a segunda."'
  ],
  ef:{flag:['ouviu_o_domino','sabe_do_defeso'],
      rep:{eixo:'bom',delta:2,motivo:'Sentou na mesa e perdeu três partidas'},
      registrar:'311 pescadores de Fuchsia estão sem renda há 19 semanas. O seguro-defeso não cobre.',
      presagio:'"O mar avisa três vezes." A terceira ainda não veio.'},
  escolhas:[
    {texto:'"Quem foi o primeiro a dizer isso das três vezes?"', vai:'c13_quem_disse'},
    {texto:'Ir à colônia.', vai:'c13_colonia'},
    {texto:'Procurar quem te leve às Seafoam.', vai:'c13_procurar_barco'},
    {texto:'Perguntar quando começou.', vai:'c13_quando_comecou'}
  ]
},

c13_quem_disse:{
  texto:[
    '"Quem foi o primeiro a dizer isso das três vezes?"',
    'Os três da mesa apontam, ao mesmo tempo e sem combinar, para o mesmo lugar: a ponta do molhe, onde tem um barco pequeno, azul, amarrado sozinho longe dos outros.',
    'E um homem muito velho sentado num caixote ao lado dele, sem fazer nada.',
    '"Sr. Furtado."',
    '"E por que ele fica lá sozinho?"',
    'O da direita joga uma pedra na mesa.',
    '"Porque ele é o único que tá dizendo que vai."'
  ],
  ef:{flag:'sabe_do_bento',
      presagio:'Ele é o único que está dizendo que vai. Ele já decidiu antes de você chegar.'},
  escolhas:[
    {texto:'Ir falar com ele.', vai:'c13_bento'},
    {texto:'Ir à colônia primeiro.', vai:'c13_colonia'},
    {texto:'Procurar o Dorival primeiro.', vai:'c13_dorival', cond:d=>!!d.flags.sabe_do_dorival},
    {texto:'Continuar jogando dominó.', vai:'c13_domino'}
  ]
},

c13_colonia:{
  texto:[
    'A Colônia de Pescadores Z-14 fica num sobrado de dois andares na rua do cais, com uma placa de esmalte de 1958 e uma bandeira desbotada.',
    'No térreo tem uma sala com quatro cadeiras, um balcão e uma parede inteira de armário de aço.',
    'A secretária tem sessenta e dois anos, é associada desde os dezessete, e faz questão de dizer isso na primeira frase.',
    '"Registro de saída de embarcação é documento público, meu bem. Qualquer um pode consultar. Ninguém consulta nunca."',
    'Ela abre o armário sem você pedir duas vezes.',
    'É um livro por ano, encadernado, com uma linha por saída: nome do barco, mestre, data e hora de saída, área declarada de pesca, data e hora de retorno.',
    'Cinquenta e dois anos de livros.'
  ],
  ef:{flag:'achou_a_colonia',
      npc:{nome:'Secretária da Colônia Z-14', opiniao:2, memoria:'Abriu o armário dos registros de saída de embarcação sem hesitar.'},
      rep:{eixo:'bom',delta:2,motivo:'Foi ao único lugar de Kanto onde o registro é aberto de verdade'},
      registrar:'A Colônia Z-14 tem 52 anos de registros de saída de embarcação, abertos a consulta.',
      presagio:'Documento público que ninguém consulta nunca. É a terceira vez nesse jogo.'},
  escolhas:[
    {texto:'Procurar as saídas para as Seafoam.', vai:'c13_saidas_espuma'},
    {texto:'Procurar o Estrela do Sul.', vai:'c13_estrela_do_sul', cond:d=>!!d.flags.sabe_do_estrela_do_sul},
    {texto:'Procurar quem sai mais.', vai:'c13_quem_sai_mais'},
    {texto:'Agradecer e ir pro cais.', vai:'c13_procurar_barco'}
  ]
},

c13_saidas_espuma:{
  texto:[
    'Você passa três horas no livro deste ano e no do ano passado.',
    '"Quebra das Seafoam" aparece como área declarada trinta e sete vezes em dois anos.',
    'E aí você percebe uma coisa lendo as colunas de horário:',
    'as saídas para a quebra das Seafoam são sempre entre vinte e duas e duas da manhã, e os retornos sempre entre nove e onze.',
    'Todas as outras áreas declaradas têm saída entre três e cinco da manhã, que é o horário normal de pesca.',
    'Você pergunta pra secretária e ela responde de cara, com o naturalidade de quem nunca precisou esconder:',
    '"Ah, arrasto de fundo na quebra é de noite porque o peixe da quebra sobe de noite."',
    'Pausa.',
    '"E porque arrasto de fundo é proibido num raio de seis milhas das ilhas, meu bem, e fiscal não trabalha de madrugada."',
    'Ela diz isso e volta a mexer no arquivo.',
    'Está escrito num livro público, na coluna de horário, há dois anos.'
  ],
  ef:{flag:['sabe_do_arrasto','provas_espuma'],
      rep:{eixo:'bom',delta:4,motivo:'Leu a coluna de horário e entendeu o que ela contava'},
      registrar:'Arrasto de fundo é proibido a seis milhas das Seafoam. As saídas para lá são sempre de madrugada.',
      presagio:'Fiscal não trabalha de madrugada. A informação estava na coluna de horário.'},
  escolhas:[
    {texto:'Procurar o Estrela do Sul.', vai:'c13_estrela_do_sul'},
    {texto:'Copiar as trinta e sete linhas.', vai:'c13_copiou_as_linhas'},
    {texto:'Procurar quem sai mais.', vai:'c13_quem_sai_mais'},
    {texto:'Ir pro cais achar um barco.', vai:'c13_procurar_barco'}
  ]
},

c13_estrela_do_sul:{
  texto:[
    'Você acha a linha.',
    '**ESTRELA DO SUL — mestre: D. Nogueira — saída 03/06, 23h10 — área declarada: quebra das Seafoam — retorno 04/06, 05h40**',
    'Cinco e quarenta.',
    'Todas as outras saídas pra quebra voltam entre nove e onze.',
    'Essa voltou às cinco e quarenta, no escuro, três a cinco horas antes do normal, no dia em que a água baixou três graus.',
    'E na coluna de observação, que é um campo que quase ninguém preenche, tem uma anotação a caneta com letra de quem escreveu com pressa:',
    '**"ret. antec. — avaria em petrecho"**',
    'Avaria em petrecho é como se escreve "a rede rasgou" num livro oficial.',
    'Você fica olhando a linha por um tempo.',
    'A coisa que congelou duzentos quilômetros de mar está escrita numa linha de um livro de capa dura num sobrado de rua de cais, em letra a caneta, e ninguém leu.'
  ],
  ef:{flag:['achou_a_linha','provas_espuma','sabe_do_dorival'],
      rep:{eixo:'bom',delta:4,motivo:'Achou a linha exata no livro exato'},
      instabilidade:1,
      registrar:'Estrela do Sul, mestre D. Nogueira: saída 03/06 23h10, retorno antecipado 04/06 05h40, avaria em petrecho.',
      presagio:'"Avaria em petrecho." Três palavras e dezenove semanas de gelo.'},
  escolhas:[
    {texto:'Copiar a linha.', vai:'c13_copiou_as_linhas'},
    {texto:'"Onde mora o Nogueira?"', vai:'c13_dorival'},
    {texto:'Ir pro cais achar um barco.', vai:'c13_procurar_barco'},
    {texto:'Ver as outras saídas para as Seafoam.', vai:'c13_saidas_espuma'}
  ]
},

c13_copiou_as_linhas:{
  texto:[
    'A secretária te empresta papel e caneta e te deixa copiar à vontade, e às tantas ela senta do outro lado do balcão e começa a ditar pra ir mais rápido, porque ela lê aquela letra melhor do que você.',
    'Trinta e sete linhas.',
    'Vinte e duas embarcações diferentes. Doze delas repetem.',
    'E quando você termina, ela olha a folha de cima a baixo, com os óculos na ponta do nariz, e faz um som com a boca.',
    '"Hm."',
    '"Que foi?"',
    '"Nada não." Ela devolve a folha. "É que dessas doze que repetem, sete são de gente que não tem barco."',
    '"Como assim não tem barco?"',
    '"Barco alugado. Sete deles são mestres contratados, meu bem. Eles não são donos. Eles levam o barco de outro."',
    '"E quem é o dono?"',
    'Ela vira pro armário.',
    '"Isso aí é outro livro."'
  ],
  ef:{flag:['tem_as_linhas','provas_espuma'],
      itens:{'Cópia das trinta e sete saídas':1},
      npc:{nome:'Secretária da Colônia Z-14', opiniao:5, memoria:'Ditou as trinta e sete linhas para você e apontou os sete mestres contratados.'},
      rep:{eixo:'bom',delta:4,motivo:'Copiou trinta e sete linhas e encontrou uma pergunta melhor'},
      registrar:'Das 22 embarcações que pescam na quebra das Seafoam, sete são operadas por mestres contratados.',
      presagio:'"Isso aí é outro livro." Sempre tem outro livro.'},
  escolhas:[
    {texto:'"Abre o outro livro."', vai:'c13_outro_livro'},
    {texto:'Procurar o Dorival.', vai:'c13_dorival', cond:d=>!!d.flags.sabe_do_dorival},
    {texto:'Ir pro cais achar um barco.', vai:'c13_procurar_barco'},
    {texto:'Procurar o Estrela do Sul no livro.', vai:'c13_estrela_do_sul'}
  ]
},

c13_outro_livro:{
  texto:[
    'O outro livro é o cadastro de embarcações, e é mais fino e mais chato e tem exatamente a informação que ninguém procura.',
    'Nome da embarcação, número de inscrição, tonelagem, ano, e proprietário.',
    'Você procura as sete.',
    'Quatro são de pessoas físicas de Fuchsia, com nome e endereço na rua do cais.',
    'Três são da mesma pessoa jurídica.',
    '**PESCA E ARMAZENAGEM LINHA VERDE LTDA.**',
    d=>d.flags.sabe_da_linha_verde ? 'Linha Verde. As quatro fazendas do lado do setor 7 da Zona Safári, compradas entre noventa e cinco e noventa e sete, são da Agropecuária Linha Verde S/A.' :
       'Você não conhece esse nome ainda. Anota do mesmo jeito, porque nome de empresa que aparece três vezes numa lista de sete é nome que reaparece.',
    'A secretária lê por cima do seu ombro.',
    '"Essa aí eu conheço. Eles compraram a fábrica de gelo em noventa e oito."',
    '"Fábrica de gelo?"',
    '"A fábrica de gelo do cais, meu bem. Todo barco compra gelo pra conservar peixe."',
    'Ela ajeita os óculos.',
    '"Eles são donos de três barcos e da fábrica que vende gelo pros outros trinta e nove."'
  ],
  ef:{flag:['sabe_da_linha_verde_pesca','provas_espuma','sabe_da_linha_verde'],
      rep:{eixo:'bom',delta:5,motivo:'Puxou o cadastro de embarcações e achou o nome'},
      instabilidade:1,
      registrar:'A Pesca e Armazenagem Linha Verde é dona de três barcos da quebra das Seafoam e da fábrica de gelo do cais.',
      presagio:'Dona da fábrica de gelo. Repare no que uma frota parada faz com quem vende gelo.'},
  escolhas:[
    {texto:'"Quem vende gelo com a frota parada?"', vai:'c13_fabrica_de_gelo'},
    {texto:'Procurar o Dorival.', vai:'c13_dorival', cond:d=>!!d.flags.sabe_do_dorival},
    {texto:'Ir pro cais achar um barco.', vai:'c13_procurar_barco'},
    {texto:'Copiar esse cadastro também.', vai:'c13_copiou_as_linhas'}
  ]
},

c13_fabrica_de_gelo:{
  texto:[
    '"Quem vende gelo com a frota parada?"',
    'Ela para de mexer no armário.',
    '"Ninguém."',
    'Pausa.',
    '"Eles fecharam em julho."',
    '"E os funcionários?"',
    '"Dezoito. Demitidos em julho, todos, com aviso prévio pago, o que é mais do que a maioria faz."',
    'Ela fecha o armário.',
    '"E aí é a parte esquisita, meu bem, que eu nunca contei pra ninguém porque nunca ninguém perguntou."',
    '"Qual?"',
    '"Eles não venderam o galpão. Eles não venderam a máquina. Eles pagaram o IPTU de agosto e setembro e a conta de luz continua no nome deles, e eu sei porque a conta de luz do cais vem toda junta e passa por aqui."',
    '"Uma fábrica de gelo fechada, sem funcionário, consumindo luz."',
    '"Consumindo luz."',
    'Ela olha pra você.',
    '"E eu tenho os valores aqui, meu bem, e o consumo dobrou em agosto."'
  ],
  ef:{flag:['sabe_da_fabrica','provas_espuma'],
      itens:{'Contas de luz da fábrica de gelo':1},
      npc:{nome:'Secretária da Colônia Z-14', opiniao:8, memoria:'Te contou que a fábrica de gelo fechada dobrou o consumo de luz em agosto.'},
      rep:{eixo:'bom',delta:5,motivo:'Perguntou quem vende gelo quando ninguém compra'},
      instabilidade:1,
      registrar:'A fábrica de gelo fechou em julho, demitiu 18, e dobrou o consumo de energia em agosto.',
      presagio:'Fábrica fechada com consumo dobrado. Alguém está armazenando alguma coisa fria.'},
  escolhas:[
    {texto:'Ir ver a fábrica de gelo.', vai:'c13_fabrica'},
    {texto:'Procurar o Dorival.', vai:'c13_dorival', cond:d=>!!d.flags.sabe_do_dorival},
    {texto:'Ir pro cais achar um barco.', vai:'c13_procurar_barco'},
    {texto:'Copiar as contas de luz.', vai:'c13_copiou_as_linhas'}
  ]
},

c13_fabrica:{
  texto:[
    'A fábrica de gelo fica na ponta oeste do cais, é um galpão de alvenaria de dois pavimentos com portão de enrolar e uma placa desbotada: **GELO — ATACADO E VAREJO**.',
    'Está fechada. Cadeado. Caixa de correio cheia.',
    'E você ouve o compressor daqui da calçada.',
    'Um compressor industrial de fábrica de gelo fechada há três meses, funcionando às onze da manhã de uma terça, num galpão trancado com cadeado e caixa de correio cheia.',
    'Você dá a volta.',
    'Nos fundos tem a saída do condensador, e o ar que sai dela é o único ar quente do cais inteiro, e tem uma poça embaixo dele que nunca seca, e em volta da poça o chão de concreto está com aquela mancha branca de sal que só se forma onde a água evapora sempre.',
    'Está funcionando há meses.',
    'E o portão dos fundos tem um cadeado novo. Novo de verdade: a chapa ainda tem o brilho de galvanização de fábrica.'
  ],
  ef:{flag:['viu_a_fabrica','cadeado_novo'],
      rep:{eixo:'bom',delta:3,motivo:'Foi ver a fábrica em vez de anotar o consumo'},
      registrar:'A fábrica de gelo está com o compressor funcionando e um cadeado novo nos fundos.',
      presagio:'Cadeado novo numa fábrica fechada. Alguém entra ali.'},
  escolhas:[
    {texto:'Esperar alguém aparecer.', vai:'c13_esperou_na_fabrica'},
    {texto:'Arrombar.', vai:'c13_arrombou_a_fabrica'},
    {texto:'Anotar e ir pras ilhas primeiro.', vai:'c13_procurar_barco'},
    {texto:'Procurar o Dorival.', vai:'c13_dorival', cond:d=>!!d.flags.sabe_do_dorival}
  ]
},

c13_esperou_na_fabrica:{
  texto:[
    'Você espera atrás de um contêiner de rede velha por cinco horas e quarenta.',
    'Às dezesseis e vinte chega um homem de uns quarenta anos, de camionete, sozinho, com uma sacola de supermercado.',
    'Ele abre o cadeado novo, entra, fica dentro dezenove minutos, sai com a sacola vazia e vai embora.',
    'Ele levou comida.',
    'Uma pessoa levou uma sacola de supermercado para dentro de uma fábrica de gelo fechada e saiu com ela vazia em dezenove minutos.',
    'Tem alguém morando ali dentro.',
    'Ou tem alguma coisa comendo.'
  ],
  ef:{flag:['viu_a_entrega_na_fabrica'],
      rep:{eixo:'bom',delta:3,motivo:'Esperou cinco horas e quarenta atrás de um contêiner'},
      instabilidade:1,
      registrar:'Alguém leva comida à fábrica de gelo fechada, três vezes por semana.',
      presagio:'Dezenove minutos e a sacola voltou vazia.'},
  escolhas:[
    {texto:'Arrombar agora.', vai:'c13_arrombou_a_fabrica'},
    {texto:'Voltar amanhã e seguir a camionete.', vai:'c13_seguiu_a_camionete'},
    {texto:'Ir pras ilhas primeiro.', vai:'c13_procurar_barco'},
    {texto:'Procurar o Dorival.', vai:'c13_dorival', cond:d=>!!d.flags.sabe_do_dorival}
  ]
},

c13_seguiu_a_camionete:{
  texto:[
    'Você espera no dia seguinte e segue a camionete a pé, o que só funciona porque Fuchsia tem quatro mil habitantes e sete semáforos.',
    'Ela para numa casa da rua de trás do posto de saúde.',
    'O homem desce, entra, e vinte minutos depois sai de novo — com outra pessoa.',
    'A outra pessoa tem uns sessenta anos, anda devagar, e carrega uma caixa térmica de isopor.',
    'E você reconhece ele pela descrição que a mulher do cais te deu sem dar nome nenhum: um homem que nunca mais saiu pra pescar.',
    'É o Dorival.'
  ],
  ef:{flag:['achou_o_dorival','sabe_do_dorival'],
      rep:{eixo:'bom',delta:3,motivo:'Seguiu a camionete até a pessoa certa'},
      registrar:'O homem que abastece a fábrica de gelo busca o Dorival antes de ir.',
      presagio:'Ele carrega uma caixa térmica. Pensa no que se carrega numa caixa térmica.'},
  escolhas:[
    {texto:'Abordar o Dorival agora.', vai:'c13_dorival'},
    {texto:'Seguir os dois até a fábrica.', vai:'c13_arrombou_a_fabrica'},
    {texto:'Ir pras ilhas primeiro.', vai:'c13_procurar_barco'},
    {texto:'Esperar os dois saírem e entrar depois.', vai:'c13_arrombou_a_fabrica'}
  ]
},

c13_arrombou_a_fabrica:{
  texto:[
    'O cadeado é novo mas o portão é velho, e a dobradiça de baixo já estava solta antes de você chegar.',
    'Dentro é escuro, é úmido e é frio de verdade — uns quatro graus, com o compressor martelando no fundo.',
    'A fábrica é uma sala grande com as formas de gelo em blocos, uma ponte rolante e a câmara fria no fundo, com porta de isolamento e trava de alavanca.',
    'A câmara fria está ligada e tem uma luz acesa por baixo da porta.',
    'E na porta da câmara, colada com fita, tem uma folha de caderno com uma lista escrita a lápis:',
    '**seg — 2 baldes / qua — 2 baldes / sex — 2 baldes e o remédio**',
    'E embaixo, na mesma letra, outra linha:',
    '**"ele tá comendo. escreve pro Bento."**'
  ],
  ef:{flag:['entrou_na_fabrica','sabe_que_tem_alguem'],
      instabilidade:1,
      registrar:'Dentro da fábrica de gelo há uma câmara fria ligada, com escala de alimentação três vezes por semana.',
      presagio:'"Escreve pro Bento." Duas pessoas nessa cidade sabem.'},
  escolhas:[
    {texto:'Abrir a câmara fria.', vai:'c13_camara_fria'},
    {texto:'Sair e procurar o Bento antes.', vai:'c13_bento'},
    {texto:'Sair e procurar o Dorival antes.', vai:'c13_dorival'},
    {texto:'Esperar ali dentro até alguém chegar.', vai:'c13_esperou_na_camara'}
  ]
},

c13_camara_fria:{
  texto:[
    'A trava de alavanca faz um estalo que ecoa no galpão inteiro.',
    'A câmara fria é um cubo de três por três com prateleira de aço nas paredes e uma lâmpada amarela no teto.',
    'E no chão, sobre uma cama improvisada de rede de pesca dobrada muitas vezes, tem um Articuno.',
    'Pequeno. Menor do que devia. Com a asa esquerda enfaixada com atadura de cavalo e esparadrapo.',
    'Ele está vivo. Ele levanta a cabeça quando a porta abre.',
    'E tem dois baldes ao lado dele, um com água e outro com peixe cortado, e uma cadeira de plástico encostada na parede, virada pra ele.',
    'Uma cadeira de plástico.',
    'Alguém senta aqui.'
  ],
  ef:{flag:['achou_o_filhote','viu_o_segundo_articuno'],
      rep:{eixo:'bom',delta:3,motivo:'Abriu a câmara fria'},
      instabilidade:2, moral:-5,
      registrar:'O segundo Articuno está vivo, numa câmara fria de fábrica de gelo em Fuchsia, com a asa enfaixada.',
      presagio:'Uma cadeira de plástico virada pra ele. Alguém senta ali e fica.'},
  escolhas:[
    {texto:'Sentar na cadeira e esperar quem vem.', vai:'c13_esperou_na_camara'},
    {texto:'Levar ele embora agora.', vai:'c13_levou_o_filhote'},
    {texto:'Fechar a porta e ir procurar o Dorival.', vai:'c13_dorival'},
    {texto:'Fechar a porta e ir procurar o Bento.', vai:'c13_bento'}
  ]
},

c13_esperou_na_camara:{
  texto:[
    'Você senta na cadeira de plástico e espera.',
    'Duas horas.',
    'O Articuno pequeno te olha esse tempo inteiro e não faz nada, e você não faz nada, e a lâmpada amarela zumbe.',
    'Às dezesseis e vinte a porta do galpão abre.',
    'Passos. Dois pares.',
    'A porta da câmara fria abre e tem um homem de sessenta anos com uma caixa térmica e um homem de quarenta com uma sacola, e os dois ficam parados na porta olhando um moleque sentado na cadeira deles.',
    'Ninguém grita.',
    'O de sessenta anos põe a caixa térmica no chão e fala, com a voz de quem já esperou isso acontecer todo dia por dezenove semanas:',
    '"Você é da Liga?"',
    '"Não."',
    'Ele solta o ar.',
    '"Ainda bem."'
  ],
  ef:{flag:['conheceu_o_dorival','achou_o_filhote'],
      npc:{nome:'Dorival', opiniao:1, memoria:'Te encontrou sentado na cadeira dele, dentro da câmara fria, e perguntou se você era da Liga.'},
      rep:{eixo:'bom',delta:2,motivo:'Esperou sentado em vez de levar embora'},
      registrar:'Dorival, mestre do Estrela do Sul, cuida do Articuno ferido há dezenove semanas.',
      presagio:'"Ainda bem." Ele tem medo da Liga, não de você.'},
  escolhas:[
    {texto:'"Foi você que pegou ele na rede."', vai:'c13_dorival_conta'},
    {texto:'"Por que você não devolveu?"', vai:'c13_porque_nao_devolveu'},
    {texto:'"Você sabe o que tá acontecendo no mar?"', vai:'c13_ele_sabe'},
    {texto:'Não dizer nada e deixar ele falar.', vai:'c13_dorival_conta'}
  ]
},

c13_dorival:{
  texto:[
    'A casa do Dorival fica na rua de trás do posto de saúde e tem uma âncora enferrujada no jardim.',
    'Ele atende de camiseta e chinelo e parece dez anos mais velho do que a idade dele.',
    'Quando você diz "Estrela do Sul", ele não fecha a porta.',
    'Ele encosta a testa no batente por uns três segundos e depois abre mais e diz:',
    '"Entra."',
    'A sala tem foto de barco na parede. Seis fotos, a mais antiga em preto e branco.',
    'Ele senta na poltrona sem oferecer nada e começa a falar antes de você perguntar, porque ele está esperando alguém perguntar desde quatro de junho.',
    '"Eu tava com dívida de motor."',
    'É essa a primeira frase.',
    '"Eu tava com dívida de motor de quarenta e dois mil e a quebra das Seafoam é o único lugar que dá pra tirar isso numa noite."'
  ],
  ef:{flag:['conheceu_o_dorival','sabe_da_divida'],
      npc:{nome:'Dorival', opiniao:2, memoria:'Te deixou entrar e a primeira coisa que disse foi a dívida do motor.'},
      rep:{eixo:'bom',delta:2,motivo:'Bateu na porta em vez de falar do lado de fora'},
      registrar:'Dorival pescou na quebra das Seafoam por causa de uma dívida de motor de 42 mil.',
      presagio:'Ele começou pela dívida. Guarde: ele já ensaiou essa conversa.'},
  escolhas:[
    {texto:'"Conta o que aconteceu."', vai:'c13_dorival_conta'},
    {texto:'"Por que você não devolveu?"', vai:'c13_porque_nao_devolveu'},
    {texto:'"Você sabe o que tá acontecendo no mar?"', vai:'c13_ele_sabe'},
    {texto:'"Me leva onde ele está."', vai:'c13_dorival_leva'}
  ]
},

c13_dorival_conta:{
  texto:[
    '"A rede subiu pesada demais às quatro e dez da manhã."',
    'Ele fala olhando a foto do barco na parede.',
    '"A gente achou que era entulho. Quebra tem entulho, tem casco velho, tem de tudo."',
    '"E aí a rede subiu e tinha uma coisa azul dentro dela, do tamanho de um homem, e ela tava se debatendo, e o guincho travou, e o barco adernou vinte graus pra boreste."',
    'Ele passa a mão no joelho.',
    '"Eu cortei a rede. Eu cortei a rede porque o barco ia virar e eu tenho dois tripulantes e um deles tem quinze anos e é filho do meu primo."',
    '"E ela caiu na água com a asa pendurada, e eu vi a asa pendurada, e eu vi que eu tinha feito aquilo."',
    'Silêncio.',
    '"E aí eu pulei."',
    'Você não esperava essa.',
    '"Você pulou?"',
    '"Eu pulei na água a quatro da manhã, com cinquenta e oito anos, e eu botei ela no bote de apoio com a ajuda do menino de quinze, e a gente voltou pra Fuchsia a cinco e quarenta com uma coisa azul no fundo do bote."',
    'Ele finalmente olha pra você.',
    '"E aí veio a parte que eu não sei resolver."'
  ],
  ef:{flag:['dorival_contou','sabe_do_corte'],
      npc:{nome:'Dorival', opiniao:5, memoria:'Cortou a rede para o barco não virar e depois pulou na água para tirar o Articuno.'},
      rep:{eixo:'bom',delta:3,motivo:'Ouviu a história inteira antes de julgar'},
      moral:-8,
      registrar:'Dorival cortou a rede, pulou na água às 4h e trouxe o Articuno ferido para Fuchsia.',
      presagio:'Ele fez a coisa errada e a coisa certa na mesma madrugada, com quatro minutos de diferença.'},
  escolhas:[
    {texto:'"Qual parte você não sabe resolver?"', vai:'c13_a_parte_dificil'},
    {texto:'"Por que você não devolveu?"', vai:'c13_porque_nao_devolveu'},
    {texto:'"Me leva onde ele está."', vai:'c13_dorival_leva'},
    {texto:'"Você sabe o que tá acontecendo no mar?"', vai:'c13_ele_sabe'}
  ]
},

c13_a_parte_dificil:{
  texto:[
    '"Qual parte você não sabe resolver?"',
    '"Devolver."',
    'Ele levanta e vai até a janela.',
    '"Ela não pode voar. A asa quebrou em dois lugares e o veterinário do Bento disse que ossifica mal e que sem voar ela não sobrevive um dia lá."',
    '"E se eu devolver, eu tenho que devolver onde eu peguei, que é a quebra das Seafoam, que é seis milhas de área proibida pra arrasto e que eu declarei que eu tava pescando."',
    '"Eu declarei no livro da colônia, moço. Tá escrito. Eu escrevi de próprio punho “quebra das Seafoam” às vinte e três e dez do dia três de junho."',
    '"E se eu chegar lá com ela, eu tô confessando arrasto em área proibida com dano a espécime protegido, que é três a cinco anos e perda da embarcação."',
    'Ele volta pra poltrona.',
    '"E eu tenho dívida de motor de quarenta e dois mil, e a embarcação é a garantia."',
    '"Então eu botei ela numa câmara fria que eu aluguei do meu cunhado por trezentos por mês, e eu levo peixe três vezes por semana, e faz dezenove semanas."',
    '"E o mar tá congelando por minha causa e eu não sei o que fazer."'
  ],
  ef:{flag:['entendeu_o_dorival','sabe_do_impasse'],
      npc:{nome:'Dorival', opiniao:6, memoria:'Explicou por que não consegue devolver: confessar o arrasto custa a embarcação que é garantia da dívida.'},
      rep:{eixo:'bom',delta:3,motivo:'Entendeu o nó em vez de cortar'},
      moral:-10,
      registrar:'Dorival não devolve o Articuno porque devolver é confessar arrasto em área proibida.',
      presagio:'Dezenove semanas. Ele levou peixe três vezes por semana durante dezenove semanas.'},
  escolhas:[
    {texto:'"Eu devolvo por você."', vai:'c13_eu_devolvo'},
    {texto:'"A gente devolve junto e eu falo com a Liga."', vai:'c13_juntos'},
    {texto:'"Me leva onde ele está."', vai:'c13_dorival_leva'},
    {texto:'"Você sabe o que tá acontecendo no mar?"', vai:'c13_ele_sabe'}
  ]
},

c13_porque_nao_devolveu:{
  texto:[
    '"Por que você não devolveu?"',
    'Ele não se irrita, e a falta de irritação é a coisa mais triste da conversa.',
    '"Eu tentei duas vezes."',
    '"Duas?"',
    '"Em julho e em agosto. Eu botei ela no bote e fui até a metade do caminho nas duas."',
    '"E?"',
    '"E na primeira eu voltei porque começou a chover e eu não sabia se ela aguentava molhar a atadura."',
    'Ele olha as mãos.',
    '"E essa é mentira. Eu voltei porque eu fiquei com medo."',
    '"E na segunda?"',
    '"Na segunda eu cheguei a ver a ilha."',
    'Longa pausa.',
    '"E tinha gelo, e o gelo tinha subido uns quatro metros de julho pra agosto, e eu entendi que quem tá fazendo aquilo tá esperando, e que se eu chegar lá com ela machucada eu não vou explicar nada pra ninguém porque ninguém vai me deixar falar."',
    '"E eu voltei."'
  ],
  ef:{flag:['dorival_tentou','sabe_do_impasse'],
      npc:{nome:'Dorival', opiniao:5, memoria:'Tentou devolver duas vezes e voltou as duas, e admitiu que a primeira foi medo.'},
      rep:{eixo:'bom',delta:2,motivo:'Deixou um homem se corrigir no meio da própria mentira'},
      moral:-8,
      registrar:'Dorival tentou devolver o Articuno duas vezes e voltou das duas.',
      presagio:'Ele se corrigiu sozinho, em voz alta. Isso é raro em qualquer capítulo desse jogo.'},
  escolhas:[
    {texto:'"Qual a parte que você não sabe resolver?"', vai:'c13_a_parte_dificil'},
    {texto:'"Eu devolvo por você."', vai:'c13_eu_devolvo'},
    {texto:'"A gente vai junto."', vai:'c13_juntos'},
    {texto:'"Me leva onde ele está."', vai:'c13_dorival_leva'}
  ]
},

c13_ele_sabe:{
  texto:[
    '"Você sabe o que tá acontecendo no mar?"',
    '"Sei."',
    'Sem hesitação nenhuma.',
    '"Todo mundo aqui acha que é fenômeno. A colônia contratou um oceanógrafo de Cerulean em agosto e o oceanógrafo disse que é anomalia térmica de origem indeterminada e cobrou oito mil."',
    'Ele ri sem alegria.',
    '"Oito mil pra escrever “origem indeterminada”."',
    '"E você sabe a origem."',
    '"Eu sei a origem, e a origem tá num galpão a seiscentos metros daqui comendo peixe cortado que eu compro com o dinheiro que eu não tenho."',
    'Ele encosta a cabeça na poltrona.',
    '"Trezentos e onze famílias, moço. Trezentos e onze. Eu conheço o nome de quase todo mundo."',
    '"E por que você não conta?"',
    '"Porque no dia que eu contar, eles vão saber que foi eu."',
    'Pausa.',
    '"E eu vou ter que aguentar ser eu, na frente deles, no cais, todo dia, pelo resto da vida."'
  ],
  ef:{flag:['dorival_sabe','sabe_do_oceanografo'],
      npc:{nome:'Dorival', opiniao:4, memoria:'Sabe exatamente qual é a origem do gelo e não conta porque teria que aguentar ser ele.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou o que ele sabia e ouviu a resposta inteira'},
      moral:-10,
      registrar:'A colônia pagou 8 mil a um oceanógrafo por um laudo de "origem indeterminada".',
      presagio:'"Eu vou ter que aguentar ser eu." É essa a moeda de Fuchsia.'},
  escolhas:[
    {texto:'"Então a gente resolve sem te entregar."', vai:'c13_eu_devolvo'},
    {texto:'"Você vai ter que aguentar. Vamos juntos."', vai:'c13_juntos'},
    {texto:'"Me leva onde ele está."', vai:'c13_dorival_leva'},
    {texto:'"Qual a parte que você não sabe resolver?"', vai:'c13_a_parte_dificil'}
  ]
},

c13_dorival_leva:{
  texto:[
    'Ele te leva.',
    'Vocês andam os seiscentos metros até a fábrica de gelo em silêncio, e ele cumprimenta quatro pessoas no caminho pelo nome, e as quatro respondem, e nenhuma pergunta pra onde ele vai porque todo mundo acha que ele vai pra lugar nenhum faz dezenove semanas.',
    'Ele abre o cadeado novo.',
    'Dentro é escuro e frio e o compressor martela.',
    'Ele acende a luz da câmara fria e abre a porta de isolamento com a alavanca, e faz isso do jeito de quem faz isso há dezenove semanas: sem pressa, com o corpo já sabendo onde ficar.',
    'E fala, pra dentro da câmara, antes de entrar, em voz normal:',
    '"Ô. Cheguei."',
    'E lá dentro, na cama de rede de pesca dobrada, o Articuno pequeno levanta a cabeça.'
  ],
  ef:{flag:['achou_o_filhote','viu_o_segundo_articuno','entrou_na_fabrica'],
      npc:{nome:'Dorival', opiniao:6, memoria:'Te levou à câmara fria e avisou em voz alta antes de entrar, como faz há dezenove semanas.'},
      moral:-5,
      registrar:'Dorival mantém o Articuno numa câmara fria alugada, e avisa em voz alta antes de entrar.',
      presagio:'"Ô. Cheguei." Ele diz isso três vezes por semana há dezenove semanas.'},
  escolhas:[
    {texto:'"Vamos devolver hoje."', vai:'c13_eu_devolvo'},
    {texto:'"A gente vai junto e eu falo com a Liga."', vai:'c13_juntos'},
    {texto:'"Ele aguenta a travessia?"', vai:'c13_aguenta'},
    {texto:'Ir falar com o Sr. Furtado antes.', vai:'c13_bento'}
  ]
},

/* ─────────────── SEU BENTO E A TRAVESSIA ─────────────── */

c13_procurar_barco:{
  texto:[
    'Você pergunta pra doze pessoas e recebe doze nãos.',
    'Não é medo de bicho. É medo de gelo: barco de madeira em água com gelo à deriva perde casco, e casco perdido é a vida inteira de uma família de pescador.',
    'O nono não te responde. O décimo primeiro diz "nem por dez mil". O décimo segundo pergunta se você tem dez mil, e quando você diz que não, ele diz "então não adianta a gente conversar" e volta pro dominó, sem grosseria nenhuma.',
    'E aí alguém, de algum lugar do cais, grita:',
    '"Fala com o Bento!"',
    'E o cais inteiro ri.',
    'Não é riso de deboche. É riso daquele tipo específico que as pessoas dão quando alguém sugere a coisa óbvia e terrível.'
  ],
  ef:{flag:'procurou_barco',
      presagio:'A coisa óbvia e terrível. Esse é o tom com que falam do Bento.'},
  escolhas:[
    {texto:'Ir falar com o Sr. Furtado.', vai:'c13_bento'},
    {texto:'"Por que vocês riem?"', vai:'c13_porque_riem'},
    {texto:'Ir à colônia antes.', vai:'c13_colonia'},
    {texto:'Perguntar quando começou.', vai:'c13_quando_comecou'}
  ]
},

c13_porque_riem:{
  texto:[
    '"Por que vocês riem?"',
    'O riso morre.',
    'O magro de boné responde, e responde sério.',
    '"Porque o Bento vai."',
    '"E isso é engraçado?"',
    '"Não."',
    'Ele mexe nas pedras do dominó.',
    '"O Bento tem setenta e quatro anos e um barco de doze pés que o pai dele construiu em cinquenta e três."',
    '"Ele parou de pescar em noventa e sete, quando o filho dele morreu no mar."',
    'Silêncio na mesa.',
    '"E desde noventa e sete ele sai com aquele barco toda quarta de manhã, sozinho, sem rede, sem linha, sem nada, e volta de tarde."',
    '"Fazer o quê?"',
    '"Ninguém sabe. Ninguém pergunta."',
    'Ele joga uma pedra.',
    '"E agora tem um gelo aparecendo no sul e o único homem de Fuchsia que quer ir olhar é o que já não tem o que perder."'
  ],
  ef:{flag:['sabe_do_bento','sabe_do_filho_do_bento'],
      rep:{eixo:'bom',delta:2,motivo:'Perguntou por que estavam rindo'},
      moral:-5,
      registrar:'Sr. Furtado parou de pescar em 1997, quando o filho morreu no mar, e sai sozinho toda quarta desde então.',
      presagio:'Toda quarta, sem rede, sem linha, sem nada. Ele vai a algum lugar.'},
  escolhas:[
    {texto:'Ir falar com o Sr. Furtado.', vai:'c13_bento'},
    {texto:'Ir à colônia procurar o registro de 1997.', vai:'c13_registro_97'},
    {texto:'Ir à colônia ver as saídas para as Seafoam.', vai:'c13_colonia'},
    {texto:'Perguntar do dia quatro de junho.', vai:'c13_quatro_de_junho'}
  ]
},

c13_registro_97:{
  texto:[
    'A secretária não precisa procurar. Ela sabe o ano e sabe o mês e vai direto.',
    'Ela abre o livro de 1997 em novembro e vira pra você sem falar nada.',
    '**ESTRELA-DO-MAR — mestre: B. Furtado — saída 12/11, 04h20 — área declarada: canal sul — retorno: —**',
    'O campo de retorno está em branco.',
    'E abaixo dele, na coluna de observação, com uma letra que não é a de quem preencheu a linha:',
    '**"emb. retornou 13/11 às 22h com o mestre. tripulante 1 não retornou. B. Furtado Filho, 26 anos."**',
    'Vinte e seis anos.',
    'A secretária fecha o livro devagar.',
    '"Ele sai toda quarta pro canal sul, meu bem."',
    '"Fazer o quê?"',
    '"Olhar."'
  ],
  ef:{flag:['sabe_do_filho_do_bento','sabe_do_canal_sul'],
      npc:{nome:'Secretária da Colônia Z-14', opiniao:4, memoria:'Abriu o livro de 1997 sem precisar procurar a data.'},
      rep:{eixo:'bom',delta:2,motivo:'Foi ver o registro em vez de perguntar de novo'},
      moral:-8,
      registrar:'O filho do Sr. Furtado, 26 anos, não voltou de uma saída em 12/11/1997.',
      presagio:'Ela não precisou procurar a data. Todo mundo nessa cidade sabe essa data.'},
  escolhas:[
    {texto:'Ir falar com o Sr. Furtado.', vai:'c13_bento'},
    {texto:'Ver as saídas para as Seafoam.', vai:'c13_saidas_espuma'},
    {texto:'Ver o Estrela do Sul.', vai:'c13_estrela_do_sul', cond:d=>!!d.flags.sabe_do_estrela_do_sul},
    {texto:'Ir pro cais.', vai:'c13_procurar_barco'}
  ]
},

c13_bento:{
  texto:[
    'Ele está sentado num caixote ao lado de um barco azul de doze pés com o nome pintado à mão na proa: **ESTRELA-DO-MAR**.',
    'A tinta do nome foi retocada muitas vezes, e as camadas se veem na borda das letras.',
    'Ele tem setenta e quatro anos, um boné sem logotipo nenhum, e está consertando um cabo de amarração que não precisa de conserto.',
    'No cais o chamam de Bento. Na colônia, no livro de saída de embarcação e na única placa de rua que esta cidade tem com nome de pescador, ele é Furtado.',
    'Ele te vê chegando de longe e espera você chegar, e a primeira coisa que ele fala é:',
    '"Eu levo."',
    '"Eu nem falei nada."',
    '"Tá escrito na sua cara e você andou o cais inteiro perguntando. Fuchsia é pequena, meu filho."',
    'Ele amarra o cabo.',
    '"Três horas de ida. A gente sai às cinco, chega às oito, e eu não fico depois das quinze porque o vento vira."',
    '"Quanto você quer?"',
    'Ele olha pra você como se a pergunta fosse esquisita.',
    '"Eu vou porque eu quero ver antes de morrer."'
  ],
  ef:{npc:{nome:'Sr. Furtado', opiniao:3, memoria:'Aceitou te levar às Seafoam antes de você pedir, e não quis dinheiro.'},
      flag:'conheceu_bento',
      registrar:'Sr. Furtado aceitou levar você às Ilhas Seafoam no barco do pai dele.',
      presagio:'"Antes de morrer." Ele tem setenta e quatro anos e sai toda quarta pro canal sul.'},
  escolhas:[
    {texto:'"Ver o quê?"', vai:'c13_ver_o_que'},
    {texto:'"Por que você sai toda quarta?"', vai:'c13_toda_quarta', cond:d=>!!d.flags.sabe_do_filho_do_bento},
    {texto:'Aceitar e embarcar.', vai:'c13_travessia'},
    {texto:'"Antes eu preciso resolver uma coisa em terra."', vai:'c13_cais'}
  ]
},

c13_ver_o_que:{
  texto:[
    '"Ver o quê?"',
    'Ele demora pra responder e a resposta não é a que você espera.',
    '"O mar fazendo uma coisa que eu não entendo."',
    'Ele guarda o cabo na caixa de ferramenta.',
    '"Eu tenho setenta e quatro anos e eu vivi desse mar desde os nove. Eu conheço o fundo daqui até a quebra melhor do que eu conheço a minha rua."',
    '"E em junho ele começou a fazer uma coisa que eu nunca vi, e que o meu pai nunca viu, e que o pai dele nunca viu, porque a gente conta essas coisas em casa e eu ia lembrar."',
    'Ele fecha a caixa.',
    '"Eu não quero salvar ninguém, meu filho. Eu tenho setenta e quatro anos e eu não salvo mais ninguém."',
    '"Eu quero entender uma coisa antes de acabar. Uma. Eu não fui muito longe na escola e eu não entendi quase nada da vida."',
    'Ele aponta o horizonte com o queixo, na direção da linha branca.',
    '"Essa aqui eu tenho chance."'
  ],
  ef:{flag:'bento_falou',
      npc:{nome:'Sr. Furtado', opiniao:5, memoria:'Disse que não vai salvar ninguém — quer entender uma coisa antes de acabar.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou ver o quê'},
      moral:8,
      registrar:'Sr. Furtado quer entender uma coisa antes de morrer.',
      presagio:'"Essa aqui eu tenho chance." Guarde a frase inteira.'},
  escolhas:[
    {texto:'"Por que você sai toda quarta?"', vai:'c13_toda_quarta', cond:d=>!!d.flags.sabe_do_filho_do_bento},
    {texto:'Embarcar.', vai:'c13_travessia'},
    {texto:'"Eu acho que eu sei o que é."', vai:'c13_contou_pro_bento', cond:d=>!!d.flags.achou_o_filhote || !!d.flags.sabe_do_dorival},
    {texto:'"Antes eu preciso resolver uma coisa em terra."', vai:'c13_cais'}
  ]
},

c13_toda_quarta:{
  texto:[
    '"Por que você sai toda quarta?"',
    'Ele para.',
    'E aí faz uma coisa que você não esperava: ele não se fecha. Ele responde na hora, como quem já respondeu isso pra si mesmo mil vezes e nunca em voz alta.',
    '"Porque foi numa quarta."',
    '"E você vai até onde?"',
    '"Até o ponto."',
    '"E fica quanto tempo?"',
    '"O tempo que der. Umas quatro horas."',
    'Ele olha o barco.',
    '"Eu não levo flor, não rezo, não jogo nada na água. Eu paro o motor e fico."',
    '"Faz quatro anos que eu faço isso e eu já perdi a conta de quantas quartas."',
    'Ele bate na borda do barco duas vezes com a palma da mão.',
    '"Duzentas e trinta e nove."',
    'Ele não perdeu a conta.'
  ],
  ef:{flag:['bento_contou_do_filho'],
      npc:{nome:'Sr. Furtado', opiniao:7, memoria:'Contou que sai toda quarta até o ponto onde o filho não voltou. Duzentas e trinta e nove vezes.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou e ele respondeu na primeira vez em quatro anos'},
      moral:10,
      registrar:'Sr. Furtado vai ao ponto onde o filho morreu toda quarta. Duzentas e trinta e nove vezes.',
      presagio:'Ele disse que perdeu a conta e deu o número. Guarde os dois.'},
  escolhas:[
    {texto:'Embarcar.', vai:'c13_travessia'},
    {texto:'"Eu acho que eu sei o que é o gelo."', vai:'c13_contou_pro_bento', cond:d=>!!d.flags.achou_o_filhote || !!d.flags.sabe_do_dorival},
    {texto:'Ficar em silêncio com ele um pouco.', vai:'c13_silencio_com_bento'},
    {texto:'"Antes eu preciso resolver uma coisa em terra."', vai:'c13_cais'}
  ]
},

c13_silencio_com_bento:{
  texto:[
    'Você senta no caixote do lado dele e não fala nada.',
    'Ele também não.',
    'Ficam ali umas duas horas, e nesse tempo ele conserta mais duas coisas que não precisavam de conserto, e você ajuda a segurar uma delas.',
    'Em algum momento ele divide uma laranja com você, descascada com a faca, em gomos, do jeito que se descasca laranja num barco.',
    'Perto do fim, sem mudar o tom:',
    '"O seu pai tá vivo?"',
    d=>'"Tá."',
    '"Liga pra ele hoje."',
    'E não fala mais nada, e não explica, e não precisa.'
  ],
  ef:{flag:'silencio_com_bento',
      npc:{nome:'Sr. Furtado', opiniao:6, memoria:'Dividiu uma laranja com você em silêncio e mandou você ligar para casa.'},
      moral:12, hp:2,
      rep:{eixo:'bom',delta:1,motivo:'Ficou em silêncio com quem precisava de companhia'},
      presagio:'"Liga pra ele hoje." Você vai lembrar disso em outro capítulo.'},
  escolhas:[
    {texto:'Embarcar.', vai:'c13_travessia'},
    {texto:'"Eu acho que eu sei o que é o gelo."', vai:'c13_contou_pro_bento', cond:d=>!!d.flags.achou_o_filhote || !!d.flags.sabe_do_dorival},
    {texto:'Ir resolver a coisa em terra primeiro.', vai:'c13_cais'},
    {texto:'"Por que você sai toda quarta?"', vai:'c13_toda_quarta', cond:d=>!!d.flags.sabe_do_filho_do_bento}
  ]
},

c13_contou_pro_bento:{
  texto:[
    '"Eu acho que eu sei o que é o gelo."',
    'Você conta tudo: o dia quatro de junho, o Estrela do Sul, a rede cortada, o bote, a câmara fria da fábrica de gelo, os dois baldes três vezes por semana, a asa que não abre.',
    'Ele ouve inteiro sem interromper uma vez.',
    'No fim, ele fica uns vinte segundos olhando o chão do cais.',
    '"O Dorival."',
    '"Você conhece?"',
    '"Eu tirei o pai dele da água em setenta e nove."',
    'Ele levanta do caixote com dificuldade.',
    '"Ele foi me ver em julho. Bateu na minha porta às onze da noite e ficou na calçada e não entrou."',
    '"E falou o quê?"',
    '"Perguntou se eu ia sair na quarta."',
    'Ele pega o boné e ajeita.',
    '"Eu disse que ia. Ele disse “tá bom” e foi embora."',
    '"E era isso?"',
    '"Era isso."',
    'Ele olha o horizonte.',
    '"O homem foi me perguntar se eu ia sair de barco e não conseguiu falar o resto. Quatro meses."'
  ],
  ef:{flag:['bento_sabe','bento_e_dorival'],
      npc:{nome:'Sr. Furtado', opiniao:8, memoria:'Descobriu que o Dorival foi à porta dele em julho e não conseguiu falar.'},
      rep:{eixo:'bom',delta:4,motivo:'Juntou as duas pessoas que estavam esperando uma pela outra'},
      moral:10,
      registrar:'O Dorival foi à casa do Bento em julho e não conseguiu contar.',
      presagio:'Quatro meses. Ele foi até a porta e não conseguiu.'},
  escolhas:[
    {texto:'"Vamos os três."', vai:'c13_os_tres'},
    {texto:'"Vai lá falar com ele."', vai:'c13_bento_vai_falar'},
    {texto:'Embarcar só nós dois.', vai:'c13_travessia'},
    {texto:'Voltar pro Dorival primeiro.', vai:'c13_dorival'}
  ]
},

c13_bento_vai_falar:{
  texto:[
    '"Vai lá falar com ele."',
    'Ele não responde. Pega a caixa de ferramenta, tranca o barco, e sai andando.',
    'Você não vai junto porque ele não te chama.',
    'Você fica no cais e espera, e demora duas horas e quarenta.',
    'Quando ele volta, ele volta com o Dorival andando três passos atrás, do jeito que anda quem está sendo trazido.',
    'Os dois chegam no barco e nenhum dos dois fala nada por um tempo.',
    'Depois o Sr. Furtado abre a caixa de ferramenta, tira um cabo de amarração novo, e entrega pro Dorival.',
    '"Segura a ponta."',
    'E é isso. É essa a conversa inteira.',
    'Os dois passam a hora seguinte amarrando uma coisa que não precisa ser amarrada, e no fim da hora estão indo juntos.'
  ],
  ef:{flag:['bento_e_dorival_juntos','dorival_vai'],
      npc:{nome:'Dorival', opiniao:7, memoria:'Foi trazido pelo Sr. Furtado ao cais e a conversa inteira foi "segura a ponta".'},
      rep:{eixo:'bom',delta:5,motivo:'Mandou um velho falar com o outro'},
      moral:15,
      registrar:'Sr. Furtado foi buscar o Dorival. Os dois vão às Seafoam juntos.',
      presagio:'"Segura a ponta." Foi a conversa inteira e foi o suficiente.'},
  escolhas:[
    {texto:'Buscar o Articuno na câmara fria e embarcar.', vai:'c13_os_tres'},
    {texto:'Embarcar sem ele, só pra ver primeiro.', vai:'c13_travessia'},
    {texto:'Chamar a Dra. Ivone antes.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Avisar a colônia inteira.', vai:'c13_avisou_a_colonia'}
  ]
},

c13_avisou_a_colonia:{
  texto:[
    'Você sobe na mesa de dominó.',
    'Literalmente: você sobe numa mesa de plástico no meio de um cais com sessenta pessoas paradas e fala alto.',
    'Você conta tudo. O quatro de junho, a rede, o bote, a câmara fria, os dezenove semanas de peixe cortado, a asa que não abre.',
    'Você não diz o nome do Dorival.',
    'Não adianta: quatro pessoas dizem o nome antes de você terminar a segunda frase, e uma delas grita.',
    'E aí acontece uma coisa que você não previu e que vai te ensinar uma coisa sobre cidade pequena que você vai carregar:',
    'ninguém vai atrás dele.',
    'Tem grito, tem raiva, tem uma mulher chorando de raiva mesmo, mas ninguém sai da mesa.',
    'E depois de uns dez minutos de barulho, o magro de boné fala mais alto que todo mundo:',
    '"Tá bom. E agora? Quem tem bote?"',
    'E onze pessoas levantam a mão.'
  ],
  ef:{flag:['avisou_a_colonia','mobilizou_gente'],
      rep:{eixo:'bom',delta:5,motivo:'Contou para o cais inteiro e o cais respondeu com botes'},
      moral:15, instabilidade:1,
      npc:{nome:'Dorival', opiniao:-1, memoria:'Você contou no cais. Quatro pessoas disseram o nome dele antes de você terminar.'},
      registrar:'Contou tudo no cais de Fuchsia. Onze pessoas ofereceram bote.',
      presagio:'Ninguém foi atrás dele. Guarde isso sobre cidade pequena: ela sabe a hora.'},
  escolhas:[
    {texto:'Ir com os onze botes.', vai:'c13_comboio'},
    {texto:'Ir só com o Sr. Furtado.', vai:'c13_travessia'},
    {texto:'Ir buscar o Dorival também.', vai:'c13_os_tres'},
    {texto:'Chamar a Dra. Ivone.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c13_chamou_ivone:{
  texto:[
    'A Dra. Ivone chega de ônibus em nove horas, com duas pessoas e uma câmera, do jeito de sempre.',
    'Mas dessa vez ela chega com uma terceira coisa: uma médica veterinária de fauna silvestre de Cerulean, de quarenta anos, que ela conhece de um caso de oito anos atrás.',
    'A veterinária olha a asa por vinte minutos, com o Articuno pequeno deitado numa mesa de inox emprestada do peixeiro, e no fim ela fala coisas que ninguém em Fuchsia sabia dizer:',
    '"Fratura cominutiva do úmero, consolidada viciosamente."',
    '"O que quer dizer?"',
    '"Que colou torto porque ninguém imobilizou direito nas primeiras duas semanas."',
    'Ela tira a luva.',
    '"E que dá pra refraturar e refazer, com cirurgia, em centro cirúrgico, com anestesia, e que a taxa de recuperação de voo nesse tipo de caso é de uns quarenta por cento."',
    '"E onde tem centro cirúrgico?"',
    '"Cerulean. Doze horas de estrada."',
    'Ela olha pro Articuno.',
    '"E antes disso alguém tem que explicar pro que congelou duzentos quilômetros de mar que a gente vai levar o filho dele pra doze horas de distância."'
  ],
  ef:{flag:['ivone_veio','sabe_da_cirurgia'],
      npc:{nome:'Dra. Ivone', opiniao:8, memoria:'Trouxe uma veterinária de fauna silvestre de Cerulean para avaliar a asa.'},
      rep:{eixo:'bom',delta:5,motivo:'Chamou quem sabia, e quem sabia trouxe quem sabia mais'},
      registrar:'A asa consolidou torta. Cirurgia em Cerulean dá 40% de chance de voltar a voar.',
      presagio:'Alguém tem que explicar pra ele. Essa é a parte que nenhuma veterinária resolve.'},
  escolhas:[
    {texto:'Ir explicar. Levar o pequeno junto, para ele ver.', vai:'c13_os_tres'},
    {texto:'Ir sozinho explicar primeiro, sem levar ele.', vai:'c13_travessia'},
    {texto:'Levar direto pra Cerulean sem explicar nada.', vai:'c13_levou_pra_cerulean'},
    {texto:'Ir com o comboio da colônia.', vai:'c13_comboio', cond:d=>!!d.flags.avisou_a_colonia}
  ]
},

c13_travessia:{
  texto:[
    'Vocês saem às cinco da manhã.',
    'O barco tem doze pés, motor de popa de quinze cavalos e um banco de madeira que o pai dele lixou em mil novecentos e cinquenta e três.',
    'A primeira hora é normal. Mar de dois pés, vento de través, e o Sr. Furtado cantarolando alguma coisa antiga sem letra.',
    'Na segunda hora a temperatura cai.',
    'Não gradualmente. Tem uma linha na água — dá pra ver, é uma faixa mais escura de uns cem metros de largura — e quando o barco cruza essa linha, o ar muda de uma vez.',
    'Você põe a mão na água antes e depois. Antes: fria. Depois: doer.',
    'Na terceira hora aparece o primeiro gelo à deriva, do tamanho de uma mesa, e o Sr. Furtado desvia sem comentar.',
    'Depois aparece outro. E outro.',
    'E a duzentos metros das ilhas, o mar acaba.',
    'Não tem transição. Tem água e tem chão branco, e a linha entre os dois é reta.',
    'Sr. Furtado desliga o motor e fica olhando por um tempo muito longo.',
    '"Pronto", ele diz baixinho, pra ele mesmo. "Agora eu vi."'
  ],
  ef:{flag:'atravessou',
      npc:{nome:'Sr. Furtado', opiniao:5, memoria:'Atravessou com você até a borda do gelo e disse "agora eu vi".'},
      registrar:'Atravessou até as Ilhas Seafoam. O mar vira chão a 200 metros da ilha.',
      presagio:'"Agora eu vi." Ele conseguiu o que queria antes de você conseguir o que você quer.'},
  escolhas:[
    {texto:'Desembarcar no gelo.', vai:'c13_ilha'},
    {texto:'"Sr. Furtado, volta. Isso não é lugar."', vai:'c13_voltou'},
    {texto:'Andar até a caverna pelo gelo.', vai:'c13_ilha'},
    {texto:'Perguntar o que ele viu.', vai:'c13_o_que_ele_viu'}
  ]
},

c13_o_que_ele_viu:{
  texto:[
    '"O que você viu?"',
    'Ele demora.',
    '"Eu vi que o mar não faz isso."',
    '"Isso eu já sabia."',
    '"Você sabia de ouvir. Eu sei de olhar." Ele aponta a linha reta entre a água e o gelo. "Olha o corte."',
    'Você olha.',
    '"Gelo natural não faz linha reta, meu filho. Gelo natural faz dedo, faz língua, faz borda podre. Ele avança onde é mais fácil e para onde é mais difícil."',
    '"Isso aí tem cento e poucos metros de linha reta."',
    'Ele engata a marcha lenta pra manter o barco.',
    '"Isso aí é alguém segurando na mão."',
    'Ele olha pra você.',
    '"E quem segura na mão, larga."'
  ],
  ef:{flag:['sabe_da_linha_reta','bento_entendeu'],
      npc:{nome:'Sr. Furtado', opiniao:6, memoria:'Reparou que a borda do gelo é uma linha reta, e que isso quer dizer que alguém segura.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou a um homem de setenta e quatro anos o que ele viu'},
      registrar:'A borda do gelo é uma linha reta de cem metros — não é gelo natural.',
      presagio:'"E quem segura na mão, larga." Ele disse isso como se fosse boa notícia.'},
  escolhas:[
    {texto:'Desembarcar no gelo.', vai:'c13_ilha'},
    {texto:'"E se soltar de uma vez?"', vai:'c13_se_soltar'},
    {texto:'"Sr. Furtado, volta."', vai:'c13_voltou'},
    {texto:'Andar até a caverna.', vai:'c13_ilha'}
  ]
},

c13_se_soltar:{
  texto:[
    '"E se soltar de uma vez?"',
    'Ele pensa com o queixo.',
    '"Aí vem tudo de uma vez."',
    '"Tudo o quê?"',
    '"A água." Ele bate na borda do barco. "Tem duzentos quilômetros de mar preso aí, meu filho. Preso quer dizer: não tá circulando, não tá subindo, não tá descendo."',
    '"E quando soltar, ele vai voltar a fazer tudo isso ao mesmo tempo."',
    'Ele olha a linha reta.',
    '"Vai ter uma onda."',
    '"De que tamanho?"',
    '"Sei lá. Nunca ninguém viu isso pra medir."',
    'Ele engata a ré e afasta o barco uns cinquenta metros da borda, sem você pedir.',
    '"Mas se você for lá dentro fazer ele largar, você me avisa antes, que eu vou querer estar longe e de proa pro mar."'
  ],
  ef:{flag:['sabe_da_onda'],
      rep:{eixo:'bom',delta:3,motivo:'Perguntou o que acontece quando solta'},
      instabilidade:1,
      registrar:'Se o gelo soltar de uma vez, haverá uma onda. Ninguém sabe de que tamanho.',
      presagio:'Ele afastou o barco antes de terminar a frase. Instinto de setenta e quatro anos.'},
  escolhas:[
    {texto:'Desembarcar no gelo.', vai:'c13_ilha'},
    {texto:'"Então volta pra Fuchsia e avisa o cais."', vai:'c13_mandou_avisar'},
    {texto:'"Sr. Furtado, volta. Isso não é lugar."', vai:'c13_voltou'},
    {texto:'Andar até a caverna.', vai:'c13_ilha'}
  ]
},

c13_mandou_avisar:{
  texto:[
    '"Então volta pra Fuchsia e avisa o cais."',
    '"E te deixo aqui?"',
    '"Me deixa aqui."',
    'Ele não gosta. Dá pra ver que ele não gosta pela primeira vez na viagem inteira.',
    '"Eu volto amanhã às oito."',
    '"E se eu não estiver aqui?"',
    '"Eu volto depois de amanhã às oito."',
    'Ele engata.',
    '"E depois no outro dia, e no outro. Eu tenho setenta e quatro anos e oito da manhã não é problema meu."',
    'Ele te deixa na borda do gelo com uma garrafa de água, meia laranja e um cobertor de lã que estava embaixo do banco, e dá meia-volta.',
    'A cem metros ele para o motor, vira, e grita:',
    '"Se o mar subir, sobe na rocha, não corre pra ilha! Rocha alta, não ilha!"',
    'E vai.',
    'E em Fuchsia, naquela tarde, trinta e nove barcos são puxados pra terra pela primeira vez em dezenove semanas, porque um velho de setenta e quatro anos chegou no cais e disse uma frase.'
  ],
  ef:{flag:['avisou_o_cais','bento_avisou'],
      itens:{'Cobertor de lã':1},
      npc:{nome:'Sr. Furtado', opiniao:9, memoria:'Te deixou na borda do gelo com um cobertor e voltou para tirar a frota de Fuchsia da água.'},
      rep:{eixo:'bom',delta:6,motivo:'Mandou avisar a cidade antes de tentar qualquer coisa'},
      moral:15, instabilidade:-1,
      registrar:'A frota de Fuchsia foi puxada para terra antes de você entrar na caverna.',
      presagio:'"Rocha alta, não ilha." Anota. Ele não disse isso à toa.'},
  escolhas:[{texto:'Entrar na ilha.', vai:'c13_ilha'}]
},

c13_voltou:{
  texto:[
    '"Sr. Furtado, volta. Isso não é lugar."',
    'Ele te olha muito tempo.',
    'Depois vira o barco sem discutir, e é isso que dói: ele não discute.',
    'No caminho de volta ele diz uma coisa só, umas duas horas depois, já perto da costa:',
    '"Meu pai dizia que o mar avisa três vezes."',
    'Pausa.',
    '"Essa foi a segunda."',
    'Duas semanas depois, o gelo alcança a costa de Fuchsia.',
    'A cidade perde a safra do trimestre inteiro e mais quatro famílias vão embora pra Vermilion.',
    'O Sr. Furtado continua saindo toda quarta, só que agora ele não consegue chegar no ponto, porque o ponto está debaixo de gelo.'
  ],
  ef:{flag:'nao_foi_seafoam', instabilidade:2, moral:-15,
      rep:{eixo:'ruim',delta:2,motivo:'Recuou das Seafoam e o gelo chegou à costa'},
      npc:{nome:'Sr. Furtado', opiniao:2, memoria:'Voltou sem discutir quando você pediu. Não consegue mais chegar ao ponto do filho.'},
      registrar:'Não desembarcou nas Seafoam. O gelo avançou até a costa.',
      presagio:'O ponto dele está debaixo de gelo. Você fez isso.'},
  escolhas:[
    {texto:'Voltar. Contratar de novo e ir.', vai:'c13_bento'},
    {texto:'Procurar o Dorival.', vai:'c13_dorival'},
    {texto:'Ir à colônia atrás dos registros.', vai:'c13_colonia'},
    {texto:'Seguir para Cinnabar.', vai:'c13_fim'}
  ]
},

/* ─────────────── AS ILHAS ─────────────── */

c13_ilha:{
  texto:[
    'As Ilhas Seafoam são duas formações de rocha branca furadas por dentro: a água entra por baixo e sai pelo outro lado, e o barulho que isso faz deu o nome delas.',
    'Hoje não faz barulho nenhum.',
    'Você desembarca andando, no gelo, por onde barco entrava.',
    'O gelo aguenta o seu peso e faz um som de coisa maciça, não de coisa fina, e isso é mais assustador do que se rachasse.',
    'A boca da caverna tem uns nove metros de altura e a maré está congelada exatamente na metade do ciclo, com a linha de maré alta marcada na rocha e o gelo parado quatro metros abaixo dela.',
    'Dentro, as paredes são de gelo transparente.',
    'E tem coisa dentro.',
    'Peixe. Muito peixe, em cardume, parado na posição exata em que estava nadando, todos virados pro mesmo lado.',
    'Tentacool, uns quinze, a um metro e meio de profundidade no gelo.',
    'E a três metros da parede, de olhos abertos, na horizontal, um Dewgong inteiro.'
  ],
  ef:{flag:'entrou_nas_espuma', instabilidade:1, moral:-8,
      registrar:'Entrou nas cavernas congeladas das Seafoam. A maré parou na metade do ciclo.',
      presagio:'Todos virados pro mesmo lado. O congelamento pegou todo mundo no mesmo segundo.'},
  escolhas:[
    {texto:'Ir mais fundo.', vai:'c13_fundo'},
    {texto:'Tentar quebrar o gelo e tirar o Dewgong.', vai:'c13_dewgong'},
    {texto:'Contar as camadas do gelo.', vai:'c13_camadas'},
    {texto:'Voltar. Isso é maior do que uma pessoa.', vai:'c13_voltou_da_caverna'}
  ]
},

c13_camadas:{
  texto:[
    'Você encosta a lanterna na parede e olha de lado, como se olha vidro.',
    'O gelo tem camadas.',
    'Camadas finas, regulares, paralelas, como anel de tronco de árvore — e cada uma separada da outra por uma linha mais escura de bolha aprisionada.',
    'Você conta.',
    'Dezenove.',
    'Dezenove camadas, e a água baixa meio grau por semana desde quatro de junho, e hoje faz dezenove semanas.',
    'Uma camada por semana.',
    'Isso não é congelamento. Congelamento é um evento.',
    'Isso é manutenção: alguém refaz uma camada por semana, há dezenove semanas, como quem passa pano.'
  ],
  ef:{flag:['contou_as_camadas','sabe_da_manutencao'],
      rep:{eixo:'bom',delta:4,motivo:'Contou as camadas e entendeu o que elas contavam'},
      registrar:'O gelo das Seafoam tem 19 camadas — uma por semana, desde 4 de junho.',
      presagio:'Como quem passa pano. Dezenove semanas. Ele está cansado.'},
  escolhas:[
    {texto:'Ir mais fundo.', vai:'c13_fundo'},
    {texto:'Tentar tirar o Dewgong.', vai:'c13_dewgong'},
    {texto:'Voltar e contar isso pro Sr. Furtado.', vai:'c13_voltou_da_caverna'},
    {texto:'Ir mais fundo com cuidado, contando camadas.', vai:'c13_fundo'}
  ]
},

c13_dewgong:{
  texto:[
    'Você quebra gelo por quarenta minutos com o que tem: uma pedra, o cabo de uma lanterna e, no fim, as mãos dentro da luva.',
    'Chega até ele.',
    'Ele está vivo.',
    'Em torpor — batimento tão lento que você precisa encostar o ouvido na caixa torácica dele por quase um minuto pra ter certeza, e no minuto inteiro você conta quatro batidas.',
    'Quatro batidas por minuto.',
    'Tirar do gelo é fácil agora. Manter vivo fora do gelo é outra coisa: sem o torpor, ele precisa de água, e a água aqui virou chão, e a água de fora está a dois graus.'
  ],
  ef:{flag:'achou_o_dewgong',
      presagio:'Quatro batidas por minuto. O gelo não está matando ele. O gelo está segurando ele.'},
  escolhas:[
    {texto:'Carregar até o barco. Sr. Furtado tem tanque de vivo.', vai:'c13_salvou_dewgong', cond:d=>!!d.flags.conheceu_bento},
    {texto:'Colocar de volta no gelo. O torpor era o que estava salvando ele.', vai:'c13_deixou_dewgong'},
    {texto:'Deixar como está e ir mais fundo.', vai:'c13_fundo'},
    {texto:'Fechar o buraco com os pedaços e ir mais fundo.', vai:'c13_deixou_dewgong'}
  ]
},

c13_salvou_dewgong:{
  texto:[
    'Você carrega um Dewgong de cento e vinte quilos por cento e setenta metros de caverna congelada.',
    'Não dá. Fisicamente não dá, e você sabe disso aos vinte metros.',
    'Você faz mesmo assim, arrastando os últimos setenta pelo gelo, com ele deitado no cobertor de lã usado como trenó.',
    'Sr. Furtado vê você chegar de longe e não faz uma pergunta. Só abre a tampa do tanque de vivo, que é um tanque de peixe de duzentos litros e não de Dewgong, e que não vai caber.',
    'Ele cabe até a metade. A outra metade fica pra fora, coberta com o cobertor molhado, e o Sr. Furtado vira a proa pra Fuchsia com o motor no talo.',
    'O Dewgong acorda três dias depois num aquário municipal e vive.',
    'E dezenove semanas de gelo continuam exatamente iguais atrás de vocês.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Arrastou um Dewgong por cento e setenta metros de gelo'},
      hp:-6, causa:'Esforço extremo nas Seafoam',
      flag:'salvou_dewgong',
      moral:10,
      npc:{nome:'Sr. Furtado', opiniao:7, memoria:'Te viu arrastar um Dewgong de 120 kg por 170 metros de gelo e não perguntou nada.'},
      registrar:'Tirou um Dewgong do gelo das Seafoam. Ele vive.',
      presagio:'Um. De uma caverna inteira.'},
  escolhas:[
    {texto:'Voltar à caverna.', vai:'c13_fundo'},
    {texto:'Voltar amanhã, com equipamento.', vai:'c13_fundo'},
    {texto:'Voltar e contar tudo no cais.', vai:'c13_avisou_a_colonia'},
    {texto:'Voltar e procurar o Dorival.', vai:'c13_dorival'}
  ]
},

c13_deixou_dewgong:{
  texto:[
    'Você recoloca ele na cavidade e empurra os pedaços de gelo de volta, encaixando um por um, como quebra-cabeça.',
    'Em quarenta minutos a cavidade fecha sozinha — a água do buraco congela por cima e sela.',
    'O batimento continua em quatro por minuto.',
    'Você fez a coisa mais difícil que existe, que é entender que a ajuda certa era não ajudar, e ninguém nunca vai saber que você fez.',
    'E é bom que ninguém saiba, porque se alguém soubesse ia parecer covardia, e a diferença entre as duas coisas só existe dentro da sua cabeça.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Entendeu que salvar não é sempre tirar de onde está'},
      flag:'entendeu_o_torpor',
      registrar:'Deixou o Dewgong no gelo, em torpor. O torpor era o que o mantinha vivo.',
      presagio:'A diferença entre sabedoria e covardia só existe dentro da sua cabeça. Vai doer de novo.'},
  escolhas:[
    {texto:'Ir mais fundo.', vai:'c13_fundo'},
    {texto:'Contar as camadas do gelo.', vai:'c13_camadas'},
    {texto:'Voltar pro barco.', vai:'c13_voltou_da_caverna'},
    {texto:'Procurar mais bichos em torpor.', vai:'c13_camadas'}
  ]
},

c13_voltou_da_caverna:{
  texto:[
    'Você sai.',
    'Sr. Furtado não pergunta nada e a viagem de volta é silenciosa, e o silêncio de três horas num barco de doze pés é uma coisa muito comprida.',
    'A três quilômetros da ilha ele desliga o motor e fica olhando pra trás por um tempo.',
    '"Eu vi", ele diz, finalmente.',
    'Pausa longa.',
    '"Tá bom. Eu vi."',
    'E liga o motor de novo, e é a única coisa que ele fala nas três horas.'
  ],
  ef:{flag:'recuou_espuma', instabilidade:1, moral:-8,
      registrar:'Saiu da caverna sem ir ao fundo.',
      presagio:'"Tá bom. Eu vi." Ele conseguiu o dele. Você não conseguiu o seu.'},
  escolhas:[
    {texto:'Voltar amanhã.', vai:'c13_ilha'},
    {texto:'Procurar o Dorival.', vai:'c13_dorival'},
    {texto:'Ir à colônia.', vai:'c13_colonia'},
    {texto:'Seguir para Cinnabar.', vai:'c13_fim'}
  ]
},

c13_fundo:{
  texto:[
    'Quanto mais fundo, mais frio e mais claro.',
    'O gelo do fundo é transparente como vidro de janela e não tem bolha nenhuma, o que quer dizer que congelou devagar, com paciência.',
    'A caverna se abre numa câmara enorme onde a água — a água antiga, de antes de tudo isso — formou colunas do chão ao teto ao longo de séculos.',
    'As colunas estão inteiras. Nenhuma quebrou.',
    'No centro da câmara, num pilar de gelo que subiu do chão como se tivesse crescido, está Articuno.',
    'Ele não está preso. Ele está pousado.',
    'E ao redor dele, num raio de uns dez metros, o gelo é diferente do resto: tem camada, como tronco de árvore, e você já contou as camadas na entrada e sabe quantas são.',
    'Ele está aqui há dezenove semanas.',
    'Sem sair. Sem caçar. Sem se mexer o suficiente pra deixar marca no chão.'
  ],
  ef:{executar:d=>{ Estado.lend(144).encontros++; return []; },
      flag:'achou_articuno',
      instabilidade:1,
      registrar:'Encontrou Articuno no fundo das Seafoam, parado há dezenove semanas.',
      presagio:'Nenhuma coluna quebrou. Ele teve cuidado com um lugar que ele está destruindo.'},
  escolhas:[
    {texto:'Ficar parado e observar.', vai:'c13_observar_articuno'},
    {texto:'Chegar perto devagar.', vai:'c13_perto'},
    {texto:'Falar com ele em voz alta.', vai:'c13_perguntou_articuno'},
    {texto:'Atacar. Ele está enfraquecido.', vai:'c13_luta_articuno'},
    {texto:'Sair. Deixar ele em paz.', vai:'c13_saiu_articuno'}
  ]
},

c13_observar_articuno:{
  texto:[
    'Você senta no gelo e espera.',
    'Vinte minutos. Quarenta. Uma hora.',
    'Ele não se move. Nem uma vez. Nem pra respirar de forma visível — e você fica tempo demais tentando ver ele respirar e chega a achar que ele está morto.',
    'Na hora e dez, você percebe.',
    'Ele está olhando pra uma direção específica e não muda.',
    'Você segue a linha do olhar dele.',
    'Do outro lado da câmara, a uns trinta metros, na parede, tem um vazio.',
    'Um vazio do formato exato de um Articuno pequeno, escavado no gelo, com as bordas lisas.',
    'Como uma cama.',
    'Ele está olhando pra um lugar onde tinha alguém e não tem mais.'
  ],
  ef:{flag:['viu_o_vazio','sabe_do_segundo'],
      rep:{eixo:'bom',delta:3,motivo:'Esperou uma hora e dez até ver'},
      moral:-12,
      registrar:'Há um vazio escavado na parede, do formato de um Articuno pequeno. Ele está olhando para lá.',
      presagio:'Ele escavou uma cama e a cama está vazia. Ele está esperando devolverem.'},
  escolhas:[
    {texto:'Ir até o vazio.', vai:'c13_o_vazio'},
    {texto:'Falar com ele em voz alta.', vai:'c13_perguntou_articuno'},
    {texto:'Chegar perto devagar.', vai:'c13_perto'},
    {texto:'Sair sem tocar em nada.', vai:'c13_saiu_articuno'}
  ]
},

c13_o_vazio:{
  texto:[
    'Você atravessa os trinta metros e chega no vazio da parede.',
    'De perto é pior.',
    'Não é buraco. É trabalho: as bordas foram alisadas, tem uma reentrância no fundo do formato de uma cabeça, e no chão do nicho tem um forro.',
    'Um forro de algas secas e penas azuis, arrumado.',
    'Alguém fez uma cama de algas dentro de uma parede de gelo e alisou as bordas com o bico, e o forro está intacto, e nunca foi usado.',
    'E na beirada do nicho, no gelo, tem uma marca.',
    'Uma marca comprida, de uns quarenta centímetros, com três sulcos paralelos, repetida dezenas de vezes, sobreposta, gasta.',
    'É garra.',
    'É a mesma garra passando no mesmo lugar dezenas de vezes.',
    'Ele vem aqui. Ele vem aqui todo dia, encosta a garra na beirada, e volta pro pilar.'
  ],
  ef:{flag:['viu_a_cama','sabe_do_segundo'],
      rep:{eixo:'bom',delta:3,motivo:'Foi olhar de perto a coisa que doía olhar de perto'},
      moral:-15, instabilidade:1,
      registrar:'Há uma cama de algas e penas escavada na parede, nunca usada, com marcas de garra na beirada.',
      presagio:'Ele preparou a cama antes. Ele preparou a cama pra quando devolverem.'},
  escolhas:[
    {texto:'Falar com ele em voz alta.', vai:'c13_perguntou_articuno'},
    {texto:'Chegar perto devagar.', vai:'c13_perto'},
    {texto:'Sair e ir buscar o pequeno em Fuchsia.', vai:'c13_voltar_buscar'},
    {texto:'Sair sem tocar em nada.', vai:'c13_saiu_articuno'}
  ]
},

c13_perto:{
  texto:[
    'Você anda pelo gelo em camadas, e a cada passo a temperatura cai mais.',
    'A cinco metros, sua respiração congela no ar e cai como pó de vidro, e você ouve o som que ela faz batendo no chão.',
    'A três metros, ele finalmente se move.',
    'Vira a cabeça, devagar, com o som de quem não move o pescoço há muito tempo, e olha.',
    'E você entende, na hora, que ele não está te ameaçando nem te aceitando.',
    'Ele está te avaliando pra uma tarefa.',
    'Ele olha pra você. Depois olha pro vazio da parede do outro lado da câmara. Depois olha pra você de novo.',
    'Três vezes, em ordem, devagar, como quem explica pra criança.'
  ],
  ef:{flag:['sabe_do_segundo','articuno_te_avaliou'],
      instabilidade:1,
      registrar:'Articuno te mostrou o vazio na parede, três vezes, em ordem.',
      presagio:'Como quem explica pra criança. Ele está pedindo. Ele não sabe pedir de outro jeito.'},
  escolhas:[
    {texto:'"Eu sei onde ele está."', vai:'c13_eu_sei_onde', cond:d=>!!d.flags.achou_o_filhote || !!d.flags.sabe_do_dorival},
    {texto:'"Eu não sei como."', vai:'c13_perguntou_articuno'},
    {texto:'Ir até o vazio ver o que é.', vai:'c13_o_vazio'},
    {texto:'Jogar a bola nele agora, que está distraído.', vai:'c13_traicao_articuno'}
  ]
},

c13_perguntou_articuno:{
  texto:[
    '"O que aconteceu aqui?"',
    'Você fala em voz alta numa câmara de gelo de quarenta metros e a sua voz não ecoa, porque gelo não ecoa, e isso faz a pergunta parecer menor do que ela é.',
    'Não vem resposta em palavra.',
    'Vem em temperatura.',
    'O gelo embaixo dos seus pés fica levemente morno por dois segundos — dois segundos exatos — e você vê, por dentro dele, como filme preso em âmbar:',
    'um casco de barco de baixo pra cima. Uma rede descendo. Luz de holofote na água. Gente se mexendo no convés.',
    'E depois a rede subindo com peso e uma faca cortando e a queda.',
    'Depois frio de novo, e a imagem some, e o gelo volta a ser gelo.',
    'Alguém pescou o menor.',
    'Alguém cortou a rede.',
    'E o maior congelou tudo — o mar, a caverna, a maré, o tempo — pra que nada piorasse enquanto ele não soubesse o que fazer.',
    'Ele não está atacando Kanto.',
    'Ele está segurando uma coisa no lugar há dezenove semanas porque parar tudo foi a única coisa que ele conseguiu pensar.'
  ],
  ef:{flag:['entendeu_articuno','sabe_do_barco','sabe_do_segundo'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Perguntou a um lendário o que tinha acontecido — e ele respondeu'},
      moral:-10,
      registrar:'Articuno congelou as Seafoam para segurar tudo no lugar enquanto não sabe o que fazer.',
      presagio:'Parar tudo foi a única coisa que ele conseguiu pensar. Você já fez isso.'},
  escolhas:[
    {texto:'"Eu sei onde ele está."', vai:'c13_eu_sei_onde', cond:d=>!!d.flags.achou_o_filhote || !!d.flags.sabe_do_dorival},
    {texto:'"Eu vou buscar quem sabe fazer isso."', vai:'c13_buscar_ajuda'},
    {texto:'"Ele tá vivo." — mesmo sem saber onde.', vai:'c13_ele_ta_vivo'},
    {texto:'Sair. Você não tem como ajudar nisso.', vai:'c13_saiu_articuno'}
  ]
},

c13_ele_ta_vivo:{
  texto:[
    '"Ele tá vivo."',
    'Você fala isso sem saber se é verdade, e essa é a parte que você vai ter que carregar se não for.',
    'A câmara inteira muda de temperatura.',
    'Não esfria: esquenta. Uns dois graus, de uma vez, em quarenta metros de câmara.',
    'E um pedaço de gelo do teto se solta e cai e estoura no chão a uns quinze metros de você, e depois outro, e depois pára.',
    'Ele para de segurar por dois segundos e depois volta a segurar.',
    'Você viu, em dois segundos, o que acontece quando ele solta.',
    'E você tem que tomar uma decisão agora, com um lendário de cinquenta e dois níveis olhando pra você, e a decisão é se você promete ou não promete.'
  ],
  ef:{flag:['disse_que_ta_vivo'],
      instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Disse a coisa que ele precisava ouvir'},
      registrar:'Disse a Articuno que o segundo está vivo. A caverna esquentou dois graus por dois segundos.',
      presagio:'Ele soltou por dois segundos. Guarde o que caiu do teto.'},
  escolhas:[
    {texto:'Prometer trazer.', vai:'c13_prometeu'},
    {texto:'"Eu não sei onde. Mas eu vou achar."', vai:'c13_buscar_ajuda'},
    {texto:'"Eu sei onde ele está."', vai:'c13_eu_sei_onde', cond:d=>!!d.flags.achou_o_filhote || !!d.flags.sabe_do_dorival},
    {texto:'Não prometer nada e sair.', vai:'c13_saiu_articuno'}
  ]
},

c13_prometeu:{
  texto:[
    '"Eu trago ele de volta."',
    'Você promete uma coisa que você não tem como garantir, numa caverna de gelo, para uma coisa de cinquenta e dois níveis que congelou duzentos quilômetros de mar.',
    'Ele olha pra você por um tempo muito longo.',
    'E aí ele desce do pilar.',
    'Pela primeira vez em dezenove semanas, e você sabe que é a primeira vez porque o gelo em volta da base do pilar não tem marca nenhuma de pouso e agora tem.',
    'Ele anda até o vazio da parede, encosta a garra na beirada — a marca que você já viu, sobreposta dezenas de vezes — e volta pro pilar.',
    'E te olha.',
    'Isso é um prazo.',
    'Você não sabe de quantos dias, e ele também não sabe dizer, e os dois sabem que existe.'
  ],
  ef:{flag:['prometeu_a_articuno','divida_com_articuno'],
      executar:d=>{ const L=Estado.lend(144); if(L.disposicao!=='hostil') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:4,motivo:'Prometeu uma coisa difícil na cara de quem ia cobrar'},
      moral:10,
      registrar:'Prometeu a Articuno trazer o segundo de volta.',
      presagio:'Isso é um prazo. Você não sabe de quantos dias.'},
  escolhas:[
    {texto:'Sair e ir buscar em Fuchsia.', vai:'c13_voltar_buscar'},
    {texto:'"Me dá o tempo de ir e voltar."', vai:'c13_voltar_buscar'},
    {texto:'Buscar ajuda em Fuchsia.', vai:'c13_buscar_ajuda'},
    {texto:'Sair sem prometer mais nada.', vai:'c13_saiu_articuno'}
  ]
},

c13_eu_sei_onde:{
  texto:[
    '"Eu sei onde ele está."',
    'A câmara inteira racha.',
    'Não é ataque. É perda de controle: o gelo sobe dois graus, quatro colunas racham pela metade, um pedaço do teto cai a dez metros de você e a água de dezenove semanas começa a aparecer por baixo do gelo do chão, escorrendo.',
    'Ele desce do pilar e para a dois metros de você e é grande de um jeito que não dá pra explicar por número.',
    'E aí ele para de racionar.',
    'Ele para. Fecha os olhos. E o gelo volta.',
    'Quatro segundos de descontrole em dezenove semanas de controle, e ele mesmo corta.',
    'E depois olha pra você e espera.',
    d=>d.flags.achou_o_filhote ? '"Ele tá numa câmara fria. Tem um homem que leva peixe pra ele três vezes por semana desde junho."' :
       '"Tem um homem em Fuchsia que sabe. Eu vou trazer ele de volta."',
    'Silêncio.',
    'E depois — e essa é a parte que você não vai conseguir contar direito pra ninguém pelo resto da vida — ele abaixa a cabeça.',
    'Não em ameaça. Abaixa a cabeça, como quem agradece.'
  ],
  ef:{flag:['contou_pra_articuno','prometeu_a_articuno','divida_com_articuno'],
      executar:d=>{ const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true;
        return [{tipo:'mundo', texto:'Articuno soltou o gelo por quatro segundos e voltou a segurar. Ele está esperando você.'}]; },
      rep:{eixo:'bom',delta:6,motivo:'Contou a verdade para quem tinha congelado um mar por não saber dela'},
      moral:20, instabilidade:1,
      registrar:'Contou a Articuno onde o segundo está. Ele abaixou a cabeça.',
      presagio:'Quatro segundos de descontrole e ele mesmo cortou. Guarde: ele tem mais controle que você.'},
  escolhas:[
    {texto:'Sair e ir buscar.', vai:'c13_voltar_buscar'},
    {texto:'Buscar ajuda em Fuchsia.', vai:'c13_buscar_ajuda'},
    {texto:'Avisar o cais antes.', vai:'c13_avisou_a_colonia'},
    {texto:'Chamar a Dra. Ivone.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c13_voltar_buscar:{
  texto:[
    'Você refaz os cento e setenta metros de caverna e os duzentos de gelo e o Sr. Furtado está exatamente onde disse que estaria, e ele te vê chegando correndo e já está ligando o motor antes de você gritar qualquer coisa.',
    'Três horas de volta.',
    'Você não dorme.',
    'Ele não pergunta nada por duas horas e quarenta e na última meia hora ele pergunta uma coisa só:',
    '"Tá vivo?"',
    '"Tá."',
    'Ele assente.',
    'E aumenta o motor, que já estava no máximo, e não adianta nada, e ele aumenta mesmo assim.'
  ],
  ef:{flag:'voltou_buscar',
      npc:{nome:'Sr. Furtado', opiniao:6, memoria:'Voltou correndo com você e aumentou o motor que já estava no máximo.'},
      presagio:'Ele aumentou o motor que já estava no máximo. Todo mundo faz isso.'},
  escolhas:[
    {texto:'Ir direto na fábrica de gelo.', vai:'c13_camara_fria', cond:d=>!!d.flags.sabe_da_fabrica || !!d.flags.entrou_na_fabrica},
    {texto:'Ir direto na casa do Dorival.', vai:'c13_dorival'},
    {texto:'Ir ao cais e contar pra todo mundo.', vai:'c13_avisou_a_colonia'},
    {texto:'Chamar a Dra. Ivone.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

/* ─────────────── A DEVOLUÇÃO ─────────────── */

c13_os_tres:{
  texto:[
    'Vocês vão os três. Quatro, contando quem está na caixa.',
    'O Articuno pequeno viaja num caixote de peixe forrado com a rede dobrada que era a cama dele, com gelo picado por baixo, porque o Dorival descobriu em julho que ele fica mais calmo com frio.',
    'O barco tem doze pés e agora tem quatro ocupantes e a borda livre é de vinte centímetros, e o Sr. Furtado vai a meia força as três horas inteiras, e nenhum dos dois velhos reclama de nada.',
    'O Dorival não fala nas três horas.',
    'Na última meia hora, quando a linha reta do gelo aparece no horizonte, ele fala uma frase só, pra ninguém:',
    '"Eu trouxe."',
    'Ele repete isso umas quatro vezes nos vinte minutos seguintes, baixinho, e não é pra você nem pro Bento.',
    'Ele está ensaiando.'
  ],
  ef:{flag:['foram_os_tres','levou_o_filhote'],
      npc:{nome:'Dorival', opiniao:8, memoria:'Foi de barco devolver o Articuno e ensaiou "eu trouxe" a viagem inteira.'},
      rep:{eixo:'bom',delta:5,motivo:'Levou junto quem precisava estar lá'},
      moral:15,
      registrar:'Foram os três às Seafoam com o Articuno pequeno num caixote de peixe.',
      presagio:'Ele está ensaiando. Dezenove semanas ensaiando.'},
  escolhas:[
    {texto:'Entrar na caverna com ele.', vai:'c13_devolveu'},
    {texto:'Deixar o Dorival entrar sozinho.', vai:'c13_dorival_sozinho'},
    {texto:'Entrar sozinho e deixar os dois no barco.', vai:'c13_devolveu'},
    {texto:'Avisar o cais antes de entrar.', vai:'c13_mandou_avisar'}
  ]
},

c13_dorival_sozinho:{
  texto:[
    '"Vai você."',
    'Ele olha pra você.',
    '"Sozinho?"',
    '"Sozinho."',
    'Ele fica um tempo parado com o caixote nos braços, na borda do gelo, com setenta e quatro anos de Sr. Furtado atrás dele no barco e você do lado.',
    'E vai.',
    'Você vê ele andando os duzentos metros de gelo com um caixote de peixe nos braços, sozinho, sem lanterna, e ele anda devagar porque ele não quer sacudir.',
    'Some na boca da caverna.',
    'Demora quarenta e três minutos.',
    'E aí a ilha inteira range.',
    'Não estala: range. Um som baixo e comprido de coisa grande cedendo, e o gelo debaixo dos seus pés vibra, e o Sr. Furtado engata a ré sem falar nada e afasta o barco quarenta metros.',
    'E o Dorival sai andando da boca da caverna com o caixote vazio nos braços, e ele está chorando de um jeito que gente de cinquenta e oito anos não chora em público, e ele não está tentando esconder.'
  ],
  ef:{flag:['dorival_devolveu','devolveu_o_filhote'],
      npc:{nome:'Dorival', opiniao:10, memoria:'Atravessou duzentos metros de gelo sozinho com um caixote para devolver o que pegou.'},
      rep:{eixo:'bom',delta:8,motivo:'Deixou o homem devolver com as próprias mãos'},
      moral:30, instabilidade:-2,
      executar:d=>{ const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true; if(Estado.dados.mundo) Estado.dados.mundo.clima='normal';
        return [{tipo:'mundo', texto:'Articuno recebeu o segundo. O gelo começou a ceder.'}]; },
      registrar:'Dorival devolveu o Articuno com as próprias mãos, sozinho.',
      presagio:'Ele saiu chorando e não escondeu. Guarde — foi ele que tinha que fazer isso.'},
  escolhas:[
    {texto:'Ficar e ver o gelo ceder.', vai:'c13_depois_salvou'},
    {texto:'Entrar na caverna pra ver.', vai:'c13_depois_salvou'},
    {texto:'Embarcar e ir embora rápido.', vai:'c13_depois_salvou'},
    {texto:'Não dizer nada e esperar ele falar.', vai:'c13_depois_salvou'}
  ]
},

c13_devolveu:{
  texto:[
    'Vocês atravessam os cento e setenta metros de caverna com o caixote.',
    'Na câmara do fundo, Articuno está no pilar exatamente onde estava, e ele vê vocês entrando de longe, e não se mexe.',
    'Vocês param no meio da câmara.',
    d=>d.flags.foram_os_tres ? 'O Dorival põe o caixote no chão e abre e recua três passos e diz, alto, com a voz falhando na terceira palavra:\n"Eu trouxe."' :
       'Você põe o caixote no chão e abre e recua três passos.',
    'O Articuno pequeno leva um tempo pra sair, porque ele está com a asa enfaixada e não coordena bem.',
    'Ele sai. Anda dois metros pelo chão de gelo. E para.',
    'E chama.',
    'Um som fino, curto, duas vezes. Não é grito. É a coisa que filhote faz quando acha que talvez não reconheçam ele.',
    'E aí a câmara racha.',
    'Todas as colunas, ao mesmo tempo, do chão ao teto, num barulho que não cabe em nenhuma palavra.',
    'E vocês têm que correr.'
  ],
  ef:{flag:['devolveu_o_filhote'],
      rep:{eixo:'bom',delta:8,motivo:'Devolveu o que tinha sido tirado'},
      moral:30, instabilidade:-2,
      executar:d=>{ const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true; if(Estado.dados.mundo) Estado.dados.mundo.clima='normal';
        return [{tipo:'mundo', texto:'O gelo das Seafoam começou a ceder. Dezenove semanas de mar vão voltar de uma vez.'}]; },
      registrar:'Devolveu o Articuno pequeno. A caverna começou a ceder.',
      presagio:'"A coisa que filhote faz quando acha que talvez não reconheçam ele." Guarde.'},
  escolhas:[
    {texto:'Correr para o barco.', vai:'c13_depois_salvou'},
    {texto:'Correr para a rocha alta, não pro barco.', vai:'c13_rocha_alta', cond:d=>!!d.flags.avisou_o_cais || !!d.flags.sabe_da_onda},
    {texto:'Ficar e ver.', vai:'c13_ficou_e_viu'},
    {texto:'Puxar os outros e correr.', vai:'c13_depois_salvou'}
  ]
},

c13_rocha_alta:{
  texto:[
    '"ROCHA ALTA, NÃO ILHA!"',
    'Você grita a frase de um velho de setenta e quatro anos numa caverna desabando e vocês sobem.',
    'Não pro barco: pra rocha.',
    'A parede leste da ilha tem uma escarpa de dezenove metros e vocês sobem doze deles em quatro minutos, com as mãos, com gelo caindo do teto da caverna atrás de vocês e água — água de verdade, escura, antiga — entrando por baixo.',
    'A doze metros de altura, deitados na rocha, vocês veem.',
    'O gelo de duzentos quilômetros solta de uma vez.',
    'Não tem onda de cinema. Tem uma coisa pior e mais silenciosa: o mar inteiro sobe uns três metros de uma vez, todo ele, ao mesmo tempo, sem quebrar.',
    'Sobe, fica dois segundos, e desce.',
    'E quando desce, a água volta a circular, e o barulho que duzentos quilômetros de mar fazem ao voltar a circular é a coisa mais absurda que você vai ouvir na vida.',
    'O barco do Sr. Furtado, que estava a quarenta metros, sobe três metros e desce três metros e continua inteiro, porque ele estava de proa pro mar.',
    'Porque ele sabia.'
  ],
  ef:{flag:['sobreviveu_a_onda','devolveu_o_filhote'],
      rep:{eixo:'bom',delta:6,motivo:'Lembrou do que o velho falou'},
      moral:20, hp:-4, causa:'Escalada de doze metros em quatro minutos',
      npc:{nome:'Sr. Furtado', opiniao:10, memoria:'Ficou de proa para o mar a quarenta metros e o barco do pai dele aguentou.'},
      registrar:'O mar subiu três metros de uma vez e desceu. Todos sobreviveram.',
      presagio:'Porque ele sabia. Setenta e quatro anos de saber.'},
  escolhas:[{texto:'Descer da rocha.', vai:'c13_depois_salvou'}]
},

c13_ficou_e_viu:{
  texto:[
    'Você fica.',
    'É burrice. É burrice completa e você sabe enquanto faz.',
    'Mas você fica e vê os dois se encontrarem no meio de uma câmara desabando, e o grande desce do pilar e não voa — ele desce andando, e chega devagar, e encosta a cabeça na cabeça do pequeno e fica assim.',
    'Fica assim uns quatro segundos com o teto caindo em volta e sem se importar com o teto caindo em volta.',
    'Depois ele pega o pequeno com as garras, com um cuidado absurdo pro tamanho dele, e sobe pelo furo do teto.',
    'E você fica sozinho numa caverna desabando com água até o joelho.',
    'E aí o teto abre de vez.',
    'E o que te salva é uma coisa que você não controla: a coluna de gelo que cai na sua direção bate numa outra e desvia dois metros, e dois metros é tudo.'
  ],
  ef:{flag:['ficou_e_viu','devolveu_o_filhote'],
      hp:-14, causa:'Ficou na caverna quando ela caiu',
      rep:{eixo:'bom',delta:3,motivo:'Ficou para ver, o que foi burrice e foi humano'},
      moral:25, instabilidade:-1,
      registrar:'Ficou na câmara e viu os dois se encontrarem. Quase não saiu.',
      presagio:'Dois metros é tudo. Você não controlou nenhum dos dois.'},
  escolhas:[
    {texto:'Sair como der.', vai:'c13_depois_salvou'},
    {texto:'Subir pela rocha.', vai:'c13_rocha_alta'},
    {texto:'Nadar até o barco.', vai:'c13_depois_salvou'},
    {texto:'Gritar pelo Sr. Furtado.', vai:'c13_depois_salvou'}
  ]
},

c13_levou_pra_cerulean:{
  texto:[
    'Você leva o Articuno pequeno pra Cerulean.',
    'Doze horas de estrada numa van emprestada, com a caixa térmica no chão entre os bancos e gelo picado renovado em três paradas.',
    'A cirurgia é na terça. Dura cinco horas e quarenta. Refraturam o úmero em dois pontos e fixam com placa.',
    'Ele fica quatro semanas.',
    'E nas quatro semanas, todo dia, o gelo em Fuchsia avança meio grau por semana, porque ninguém contou nada pra quem está segurando.',
    'Na quinta semana ele abre a asa.',
    'Não voa direito. Abre.',
    'E aí você faz as doze horas de volta e as três horas de barco, e quando você entra na câmara do fundo das Seafoam com ele, você entrega uma coisa melhor do que você tirou — e cinco semanas mais tarde do que dava.'
  ],
  ef:{flag:['operou_o_filhote','devolveu_o_filhote'],
      rep:{eixo:'bom',delta:6,motivo:'Escolheu a asa em vez da pressa'},
      moral:20, instabilidade:1,
      executar:d=>{ const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true; if(Estado.dados.mundo) Estado.dados.mundo.clima='normal';
        return [{tipo:'mundo', texto:'Articuno recebeu o segundo de volta, com a asa operada, cinco semanas depois.'}]; },
      registrar:'Levou o Articuno pequeno a Cerulean, operou a asa, e devolveu cinco semanas depois.',
      presagio:'Cinco semanas de gelo a mais, e uma asa que abre. Não existe resposta certa.'},
  escolhas:[
    {texto:'Ver o gelo ceder.', vai:'c13_depois_salvou'},
    {texto:'Voltar a Fuchsia com o Sr. Furtado.', vai:'c13_depois_salvou'},
    {texto:'Subir na rocha antes.', vai:'c13_rocha_alta', cond:d=>!!d.flags.sabe_da_onda},
    {texto:'Sair rápido.', vai:'c13_depois_salvou'}
  ]
},

c13_comboio:{
  texto:[
    'Onze botes e o barco do Sr. Furtado saem do cais de Fuchsia às quatro e quarenta da manhã.',
    'Ninguém combinou de sair junto. Todo mundo saiu junto.',
    'A travessia leva quatro horas em vez de três porque comboio anda na velocidade do mais lento, e ninguém reclama disso uma vez.',
    'Na borda do gelo, doze embarcações param em linha, e dá pra ver de longe que isso não é uma operação — é um cais inteiro que resolveu ir junto porque ninguém queria ser o que ficou.',
    d=>d.flags.dorival_vai || d.flags.bento_e_dorival_juntos ? 'O Dorival vai no bote do meio, com o caixote nos joelhos, e ninguém olha pra ele com raiva, e ninguém olha pra ele com pena, e ele aguenta as duas coisas não acontecerem.' :
       'Você vai no barco da frente com o caixote nos joelhos.',
    'Quatro homens sobem na rocha alta pra vigiar o mar, porque o Sr. Furtado mandou.',
    'Sete ficam nos botes, de proa pro mar, porque o Sr. Furtado mandou.',
    'E você atravessa os duzentos metros de gelo com doze embarcações olhando as suas costas.'
  ],
  ef:{flag:['foi_de_comboio','mobilizou_gente'],
      rep:{eixo:'bom',delta:6,motivo:'Levou a cidade inteira'},
      moral:20,
      registrar:'Onze botes e o barco do Sr. Furtado foram juntos às Seafoam.',
      presagio:'Ninguém queria ser o que ficou. É assim que cidade pequena funciona nos dois sentidos.'},
  escolhas:[
    {texto:'Entrar e devolver.', vai:'c13_devolveu'},
    {texto:'Deixar o Dorival entrar sozinho.', vai:'c13_dorival_sozinho', cond:d=>!!d.flags.dorival_vai || !!d.flags.bento_e_dorival_juntos},
    {texto:'Entrar com dois pra ajudar a carregar.', vai:'c13_devolveu'},
    {texto:'Subir na rocha alta primeiro e olhar.', vai:'c13_rocha_alta'}
  ]
},

c13_levou_o_filhote:{
  texto:[
    'Você tira o Articuno pequeno da câmara fria sem falar com ninguém.',
    'Ele não resiste, porque ele não tem como resistir, e ele é mais leve do que parece e cabe numa caixa de peixe.',
    'E enquanto você carrega ele pelos seiscentos metros até o cais, você passa por sete pessoas e nenhuma pergunta nada, porque na cidade toda o normal é ver alguém carregando caixa de peixe.',
    'A parte ruim vem depois: você não avisou o Dorival.',
    'Ele vai chegar na quarta às dezesseis e vinte com dois baldes e vai abrir a porta da câmara fria e não vai ter ninguém.',
    'E ele vai achar que morreu, ou que levaram, ou que a Liga veio.',
    'E ele vai passar um tempo com isso antes de descobrir.'
  ],
  ef:{flag:['levou_o_filhote','nao_avisou_o_dorival'],
      rep:{eixo:'bom',delta:1,motivo:'Tirou o Articuno da câmara fria'},
      moral:-10,
      npc:{nome:'Dorival', opiniao:-2, memoria:'Chegou na quarta com dois baldes e a câmara fria estava vazia.'},
      registrar:'Levou o Articuno pequeno sem avisar o Dorival.',
      presagio:'Ele vai abrir a porta e não vai ter ninguém. Dezenove semanas.'},
  escolhas:[
    {texto:'Voltar e avisar antes de embarcar.', vai:'c13_dorival'},
    {texto:'Embarcar com o Sr. Furtado.', vai:'c13_travessia'},
    {texto:'Deixar um bilhete na porta da câmara.', vai:'c13_bilhete'},
    {texto:'Chamar a Dra. Ivone antes.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c13_bilhete:{
  texto:[
    'Você arranca uma folha do caderno e escreve, e escreve cinco versões e amassa quatro.',
    'A que fica é:',
    '**"Eu levei ele pra casa. Ele tava vivo quando eu saí. Você cuidou bem. Não foi culpa sua a asa, foi culpa da rede e a rede você cortou. — um que passou por aqui"**',
    'Você prende com a fita que já estava na porta.',
    'E na quarta às dezesseis e vinte um homem de cinquenta e oito anos vai abrir um portão de fábrica de gelo com dois baldes na mão e vai achar um bilhete em vez de um vazio, e a diferença entre essas duas coisas é a diferença entre os próximos vinte anos de vida dele.'
  ],
  ef:{flag:['deixou_o_bilhete'], limpaFlag:'nao_avisou_o_dorival',
      npc:{nome:'Dorival', opiniao:5, memoria:'Achou um bilhete na porta da câmara fria em vez de um vazio.'},
      rep:{eixo:'bom',delta:4,motivo:'Escreveu cinco versões e deixou a certa'},
      moral:15,
      registrar:'Deixou um bilhete na porta da câmara fria para o Dorival.',
      presagio:'"Não foi culpa sua a asa." Você não sabia se era verdade e escreveu mesmo assim.'},
  escolhas:[
    {texto:'Embarcar com o Sr. Furtado.', vai:'c13_travessia'},
    {texto:'Voltar e falar com ele em pessoa mesmo assim.', vai:'c13_dorival'},
    {texto:'Chamar a Dra. Ivone.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Contar no cais antes de sair.', vai:'c13_avisou_a_colonia'}
  ]
},

c13_eu_devolvo:{
  texto:[
    '"Eu devolvo por você."',
    'Ele balança a cabeça na hora.',
    '"Não."',
    '"Por quê? Você não quer confessar o arrasto. Eu não tenho nada a confessar."',
    '"Não é isso."',
    'Ele olha as mãos, que são mãos de pescador de cinquenta e oito anos, com o dedo mínimo da esquerda torto de um acidente antigo.',
    '"Se você devolver por mim, eu vou ter feito só a parte de pegar."',
    'Ele fecha as mãos.',
    '"Eu preciso ter feito as duas."'
  ],
  ef:{flag:['dorival_quer_ir','dorival_vai'],
      npc:{nome:'Dorival', opiniao:7, memoria:'Recusou que você devolvesse por ele: precisa ter feito as duas partes.'},
      rep:{eixo:'bom',delta:3,motivo:'Ofereceu e aceitou o não'},
      moral:10,
      registrar:'Dorival quer devolver com as próprias mãos.',
      presagio:'"Eu preciso ter feito as duas." Não discuta com isso.'},
  escolhas:[
    {texto:'"Então a gente vai junto."', vai:'c13_juntos'},
    {texto:'"Hoje. Agora."', vai:'c13_juntos'},
    {texto:'Ir buscar o Sr. Furtado.', vai:'c13_bento'},
    {texto:'Chamar a Dra. Ivone antes.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c13_juntos:{
  texto:[
    '"A gente vai junto."',
    'Ele demora uns dez segundos.',
    '"E a Liga?"',
    '"A Liga vai saber de qualquer jeito, porque duzentos quilômetros de gelo não descongelam sem alguém perguntar por quê."',
    '"E eu vou perder o barco."',
    '"Provavelmente."',
    'Ele ri. É a primeira vez que ele ri.',
    '"Você é péssimo em convencer gente, moço."',
    '"Eu sei."',
    'Ele levanta da poltrona com dificuldade e pega a chave do cadeado no prego da parede.',
    '"Eu tenho dívida de motor de quarenta e dois mil e dezenove semanas de peixe cortado, que dá mais uns oito."',
    'Ele põe a chave no bolso.',
    '"Cinquenta mil e o mar parado. Já tá ruim demais pra piorar."'
  ],
  ef:{flag:['dorival_vai','vai_junto'],
      npc:{nome:'Dorival', opiniao:9, memoria:'Pegou a chave do cadeado e disse que já estava ruim demais para piorar.'},
      rep:{eixo:'bom',delta:5,motivo:'Convenceu mal e convenceu'},
      moral:15,
      registrar:'Dorival vai devolver o Articuno pessoalmente.',
      presagio:'"Já tá ruim demais pra piorar." É por isso que as pessoas finalmente agem.'},
  escolhas:[
    {texto:'Buscar o Sr. Furtado e ir os três.', vai:'c13_os_tres'},
    {texto:'Contar no cais antes.', vai:'c13_avisou_a_colonia'},
    {texto:'Chamar a Dra. Ivone antes.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir só vocês dois, num bote.', vai:'c13_travessia'}
  ]
},

c13_aguenta:{
  texto:[
    '"Ele aguenta a travessia?"',
    'Ele não sabe, e ele diz que não sabe, o que é raro.',
    '"Eu trouxe ele de lá num bote de apoio, então ele aguentou uma vez."',
    '"Em junho."',
    '"Em junho, com a asa sangrando e três horas de mar. Hoje ele tá melhor de tudo menos da asa."',
    'Ele olha pro caixote.',
    '"Mas hoje o mar tá dois graus e em junho tava dezenove."',
    'Ele encosta a mão na parede da câmara fria.',
    '"Eu botei ele aqui a quatro graus porque eu achei que ele gostava de frio."',
    '"E ele gosta?"',
    '"Eu não sei, moço. Eu sou pescador. Eu não sei nada."',
    'Longo silêncio.',
    '"Ele parou de tremer no segundo dia. Eu achei que era bom sinal. Faz dezenove semanas que eu acho que era bom sinal."'
  ],
  ef:{flag:'duvida_do_dorival',
      moral:-8,
      npc:{nome:'Dorival', opiniao:6, memoria:'Admitiu que não sabe se fez certo em nenhuma das dezenove semanas.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou a coisa prática'},
      presagio:'"Faz dezenove semanas que eu acho que era bom sinal." Ninguém nunca conferiu com ele.'},
  escolhas:[
    {texto:'"Então a gente chama alguém que sabe."', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'"A gente vai hoje. Junto."', vai:'c13_juntos'},
    {texto:'"Você fez certo."', vai:'c13_voce_fez_certo'},
    {texto:'"Eu devolvo por você."', vai:'c13_eu_devolvo'}
  ]
},

c13_voce_fez_certo:{
  texto:[
    '"Você fez certo."',
    'Ele não aceita.',
    '"Você não sabe disso."',
    '"Eu sei uma parte. Você cortou a rede pra não virar o barco com um menino de quinze anos a bordo, e depois você pulou na água de madrugada com cinquenta e oito anos pra pegar de volta o que você tinha derrubado."',
    'Você aponta os baldes.',
    '"E depois você levou peixe cortado três vezes por semana durante dezenove semanas com dinheiro que você não tem, pra uma coisa que não te agradece, escondido de uma cidade inteira."',
    'Ele não olha pra você.',
    '"Isso não apaga o arrasto."',
    '"Não apaga."',
    '"Então não fui certo."',
    '"Você foi as duas coisas. Igual a todo mundo que eu conheci desde que eu saí de casa."',
    'Ele fica quieto muito tempo.',
    'Depois: "Eu vou junto."'
  ],
  ef:{flag:['dorival_vai','vai_junto'],
      npc:{nome:'Dorival', opiniao:9, memoria:'Você disse que ele foi as duas coisas, e ele decidiu ir junto.'},
      rep:{eixo:'bom',delta:4,motivo:'Não absolveu nem condenou'},
      moral:15,
      registrar:'Dorival decidiu ir junto devolver.',
      presagio:'"Você foi as duas coisas." Essa é a frase mais verdadeira que você aprendeu em treze capítulos.'},
  escolhas:[
    {texto:'Buscar o Sr. Furtado e ir os três.', vai:'c13_os_tres'},
    {texto:'Ir hoje, os dois.', vai:'c13_juntos'},
    {texto:'Chamar a Dra. Ivone antes.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Contar no cais antes.', vai:'c13_avisou_a_colonia'}
  ]
},

c13_buscar_ajuda:{
  texto:[
    'Você sai da caverna e volta a Fuchsia na mesma noite.',
    d=>{
      if (d.flags.cartao_ivone) return 'A Dra. Ivone chega em dois dias com uma equipe de resgate de fauna marinha e equipamento de corte térmico emprestado de uma usina.';
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=5) return 'Você pede ajuda no cais e — pela primeira vez na jornada — a sua reputação faz o trabalho sozinha: onze pessoas aparecem. Onze, num cais onde ninguém te devia nada.';
      return 'Você pede ajuda em Fuchsia e duas pessoas aparecem: o Sr. Furtado e um veterinário aposentado que mora na rua do cais e que foi por curiosidade.';
    },
    'A operação leva um dia e meio.',
    d=>d.flags.achou_o_filhote || d.flags.sabe_do_dorival
       ? 'E a parte mais difícil não é técnica: é convencer um homem de cinquenta e oito anos a abrir a porta de uma câmara fria na frente de sete pessoas de Fuchsia.'
       : 'E a parte mais difícil é técnica: achar, num galpão da cidade, onde alguém escondeu uma coisa que ninguém sabia que existia.',
    'Quando acaba, tem gente chorando no gelo e ninguém se envergonha disso, e o Sr. Furtado é o único que não chora e o único que não tira o olho do horizonte.'
  ],
  ef:{rep:{eixo:'bom',delta:5,motivo:'Mobilizou gente em vez de tentar sozinho'},
      flag:['devolveu_o_filhote','mobilizou_gente'], instabilidade:-2, moral:20,
      executar:d=>{ const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true; if(Estado.dados.mundo) Estado.dados.mundo.clima='normal'; return []; },
      npc:{nome:'Sr. Furtado', opiniao:8, memoria:'Participou do resgate e foi o único que não tirou o olho do horizonte.'},
      registrar:'Uma equipe devolveu o segundo Articuno. As Seafoam começaram a descongelar.',
      presagio:'Ele não tirou o olho do horizonte. Ele sabia o que ia vir.'},
  escolhas:[
    {texto:'Ver o gelo ceder.', vai:'c13_depois_salvou'},
    {texto:'Subir na rocha alta primeiro.', vai:'c13_rocha_alta', cond:d=>!!d.flags.sabe_da_onda},
    {texto:'Ir para o barco.', vai:'c13_depois_salvou'},
    {texto:'Ficar e ver de perto.', vai:'c13_ficou_e_viu'}
  ]
},

/* ─────────────── O OUTRO CAMINHO ─────────────── */

c13_traicao_articuno:{
  texto:[
    'Ele está te mostrando o vazio na parede, pela terceira vez, devagar, como quem explica pra criança.',
    'E você joga a bola.',
    'Não tem como suavizar isso e você nem vai tentar depois.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(144); L.disposicao='hostil'; L.ataquesSofridos+=2; return []; },
      rep:{eixo:'ruim',delta:4,motivo:'Atacou um lendário no momento em que ele pediu ajuda'},
      moral:-25,
      flag:'traiu_articuno',
      registrar:'Jogou a bola em Articuno enquanto ele pedia ajuda.',
      presagio:'Ele explicou três vezes, devagar. E você jogou a bola.'},
  escolhas:[{texto:'Encarar o que vem.', vai:'c13_luta_articuno'}]
},

c13_luta_articuno:{
  texto:[
    'A câmara inteira baixa dez graus de uma vez e o ar fica com aquela densidade que faz doer respirar.',
    'As colunas de gelo começam a rachar no teto — não as dele, as antigas, as de séculos.',
    'Ele está gastando o que ele estava guardando.'
  ],
  batalha:{dex:144, nivel:52, tipo:'lendario', fuga:true, ambiente:'agua',
           vitoria:'c13_pos_articuno', derrota:'c13_pos_articuno', fuga2:'c13_saiu_articuno',
           captura:'c13_capturou_articuno', gameover:'gameover'}
},

c13_pos_articuno:{
  texto:[
    'Ele volta pro pilar.',
    'Não porque venceu ou perdeu.',
    'Porque o lugar dele é ali, e ele tem uma coisa pra fazer, e você foi uma interrupção de vinte minutos numa vigília de dezenove semanas.',
    'O gelo que rachou durante a luta volta a fechar em quatro minutos, camada por camada, e ele faz isso sem parecer estar fazendo esforço, e é aí que você entende que ele nunca lutou com força total.',
    'Ele não pode.',
    'Ele está usando tudo o que tem pra segurar duzentos quilômetros de mar, e o que sobrou pra você foi o troco.'
  ],
  ef:{executar:d=>{
        const L=Estado.lend(144); L.ataquesSofridos++;
        if (L.ataquesSofridos>=2){ L.disposicao='hostil'; return [{tipo:'perigo', texto:'Articuno te marcou. O frio vai te seguir.'}]; }
        return [];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou Articuno nas Seafoam'}, instabilidade:1,
      presagio:'O que sobrou pra você foi o troco. Pensa no que seria o resto.'},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c13_luta_articuno'},
    {texto:'Parar e olhar em volta.', vai:'c13_observar_articuno'},
    {texto:'Parar e perguntar.', vai:'c13_perguntou_articuno'},
    {texto:'Sair.', vai:'c13_saiu_articuno'}
  ]
},

c13_capturou_articuno:{
  texto:[
    'A bola fecha.',
    'E o gelo — o gelo que ele estava segurando, camada por camada, há dezenove semanas — começa a ceder no mesmo segundo, porque não tem mais ninguém segurando.',
    'A câmara racha inteira em menos de quatro segundos.',
    'Colunas de séculos caem. A água volta com força de maré represada por dezenove semanas, por baixo, pelos lados, por cima.',
    'E do outro lado da câmara, na parede que está se partindo, tem um vazio escavado, do formato de um Articuno pequeno, com um forro de algas secas e penas azuis arrumado no fundo.',
    'Você só vê durante um segundo e meio, quando a parede cede.',
    'E você não entende o que era.',
    'E não vai entender nunca, porque a única pessoa que podia te explicar está na sua mão.'
  ],
  ef:{instabilidade:3, flag:'capturou_articuno',
      rep:{eixo:'ruim',delta:3,motivo:'Capturou o guardião e a caverna cedeu'},
      moral:-20,
      registrar:'Capturou Articuno. A caverna cedeu e o mar voltou de uma vez.',
      presagio:'A única pessoa que podia te explicar está na sua mão.'},
  escolhas:[
    {texto:'Soltar. Agora.', vai:'c13_soltou_articuno'},
    {texto:'Correr para a saída.', vai:'c13_correu_da_agua'},
    {texto:'Mergulhar atrás do que você viu na parede.', vai:'c13_mergulhou'},
    {texto:'Subir na rocha alta.', vai:'c13_rocha_alta', cond:d=>!!d.flags.sabe_da_onda}
  ]
},

c13_soltou_articuno:{
  texto:[
    'Você abre a bola numa câmara que está caindo, com água até a canela.',
    'Ele sai e não te ataca.',
    'Ele olha em volta — pra água que já está subindo, pras colunas caídas, pro vazio da parede que está se partindo — e faz uma coisa que você não previu:',
    'ele volta pro pilar e recomeça.',
    'O gelo volta a fechar, camada por camada, e leva quarenta minutos pra voltar ao que era, e ele faz os quarenta minutos com você ali parado olhando.',
    'No fim, tudo está exatamente como estava quando você chegou.',
    'Exatamente como estava.',
    'Dezenove camadas. Um vazio na parede. Um pilar. Uma vigília.',
    'Ele te custou quarenta minutos e você custou a ele quarenta minutos, e é essa a conta inteira.'
  ],
  ef:{flag:'soltou_articuno', limpaFlag:'capturou_articuno',
      executar:d=>{
        const p=[...d.time,...d.pc].find(x=>x.dex===144);
        return p ? Captura.soltar(p).map(e=>({tipo:e.tipo,texto:e.texto})) : [];
      },
      rep:{eixo:'bom',delta:3,motivo:'Soltou o guardião antes de sair do lugar'},
      moral:10, instabilidade:-1,
      registrar:'Soltou Articuno. Ele recomeçou o gelo do zero em quarenta minutos.'},
  escolhas:[
    {texto:'Perguntar o que aconteceu.', vai:'c13_perguntou_articuno'},
    {texto:'Ir até o vazio da parede.', vai:'c13_o_vazio'},
    {texto:'Sair e ir buscar o pequeno.', vai:'c13_voltar_buscar', cond:d=>!!d.flags.sabe_do_dorival || !!d.flags.achou_o_filhote},
    {texto:'Sair.', vai:'c13_saiu_articuno'}
  ]
},

c13_mergulhou:{
  texto:[
    'Você mergulha em água de dois graus dentro de uma caverna desabando.',
    'Dois graus tira o seu ar em quatro segundos — não pelo frio, pelo reflexo: o corpo inspira sozinho quando bate água muito fria no peito, e você tem que lutar contra o próprio corpo pra não respirar embaixo d’água.',
    'Você não acha nada.',
    'Você quase não volta.',
    'Sr. Furtado te tira da água na entrada da caverna, sozinho, com setenta e quatro anos, puxando pela alça da mochila e xingando.',
    '"Burrice", ele diz, enrolando você no cobertor de lã. "Burrice bonita, mas burrice."',
    'E depois, mais baixo, com você tremendo no fundo do barco:',
    '"Meu filho também fez uma burrice bonita."'
  ],
  ef:{hp:-14, causa:'Mergulho em água de dois graus nas Seafoam',
      rep:{eixo:'bom',delta:1,motivo:'Arriscou a própria vida tentando consertar o próprio erro'},
      flag:'mergulhou_nas_espuma',
      moral:-10,
      npc:{nome:'Sr. Furtado', opiniao:5, memoria:'Te tirou da água gelada sozinho, aos setenta e quatro anos, e falou do filho.'},
      registrar:'Mergulhou na água de dois graus. Sr. Furtado te tirou.',
      presagio:'"Meu filho também fez uma burrice bonita." Ele nunca tinha dito isso pra ninguém.'},
  escolhas:[
    {texto:'Voltar para Fuchsia.', vai:'c13_fim'},
    {texto:'Voltar amanhã e procurar direito.', vai:'c13_cais'},
    {texto:'Perguntar do filho dele.', vai:'c13_toda_quarta'},
    {texto:'Não dizer nada a viagem inteira.', vai:'c13_fim'}
  ]
},

c13_correu_da_agua:{
  texto:[
    'Você corre.',
    'Cento e setenta metros de caverna desabando com uma bola no bolso e água subindo dez centímetros por minuto.',
    'Você chega no barco. Sr. Furtado arranca antes de você sentar direito.',
    'De cinquenta metros vocês veem a entrada da caverna sumir — não desabar: sumir, porque o mar sobe e tampa.',
    'E aí o mar sobe.',
    'Três metros, todo ele, ao mesmo tempo, sem quebrar.',
    'O barco de doze pés sobe três metros e desce três metros e continua inteiro porque o Sr. Furtado virou a proa sem você mandar.',
    'Ele não pergunta o que tem no seu bolso.',
    'Ele vê o seu rosto e decide não perguntar, e esse é um tipo específico de gentileza que você não merece hoje.'
  ],
  ef:{flag:'saiu_com_articuno',
      hp:-4, causa:'Fuga da caverna desabando',
      npc:{nome:'Sr. Furtado', opiniao:2, memoria:'Não perguntou o que você tinha no bolso.'},
      moral:-15,
      registrar:'Saiu das Seafoam com Articuno na bola. O mar subiu três metros.',
      presagio:'Ele decidiu não perguntar. Isso não é o mesmo que não saber.'},
  escolhas:[
    {texto:'Soltar ali mesmo, do barco.', vai:'c13_soltou_do_barco'},
    {texto:'Voltar a Fuchsia com ele.', vai:'c13_fim'},
    {texto:'Contar pro Sr. Furtado o que você fez.', vai:'c13_contou_pro_bento_o_que_fez'},
    {texto:'Não dizer nada a viagem inteira.', vai:'c13_fim'}
  ]
},

c13_soltou_do_barco:{
  texto:[
    'Você abre a bola apontando pro mar, de dentro de um barco de doze pés, a cinquenta metros de uma caverna que acabou de sumir.',
    'Ele sai e fica na água por uns quatro segundos, em cima da própria imagem, e olha o lugar onde a entrada da caverna estava.',
    'Depois sobe.',
    'Não voa embora: sobe reto, uns quarenta metros, e fica pairando em cima do ponto.',
    'E o mar em volta de vocês começa a esfriar de novo.',
    'Ele vai recomeçar. Sozinho. Do zero. Com o vazio da parede agora debaixo de duzentos metros de rocha e água.',
    'Sr. Furtado olha pra cima e depois olha pra você.',
    '"Ele vai fazer tudo de novo?"',
    '"Vai."',
    'O velho liga o motor.',
    '"Então a gente tem trabalho."'
  ],
  ef:{flag:'soltou_articuno', limpaFlag:'capturou_articuno',
      executar:d=>{
        const p=[...d.time,...d.pc].find(x=>x.dex===144);
        return p ? Captura.soltar(p).map(e=>({tipo:e.tipo,texto:e.texto})) : [];
      },
      rep:{eixo:'bom',delta:3,motivo:'Soltou antes de chegar em terra'},
      npc:{nome:'Sr. Furtado', opiniao:6, memoria:'Disse "então a gente tem trabalho" depois que você soltou Articuno de volta no mar.'},
      moral:10,
      registrar:'Soltou Articuno do barco. Ele voltou a esfriar o mar.',
      presagio:'"Então a gente tem trabalho." Ele falou no plural.'},
  escolhas:[
    {texto:'Voltar e procurar o Dorival.', vai:'c13_dorival'},
    {texto:'Voltar e procurar na fábrica de gelo.', vai:'c13_fabrica', cond:d=>!!d.flags.sabe_da_fabrica},
    {texto:'Voltar e contar no cais.', vai:'c13_avisou_a_colonia'},
    {texto:'Voltar pra Fuchsia e desistir.', vai:'c13_fim'}
  ]
},

c13_contou_pro_bento_o_que_fez:{
  texto:[
    'Você conta.',
    'Que tinha um segundo, menor, e uma cama escavada na parede, e que você jogou a bola, e que a caverna caiu por isso.',
    'Ele ouve inteiro com a mão no cabo do leme e o olho no horizonte.',
    'E no fim ele fala uma coisa que você não estava preparado pra ouvir:',
    '"Meu filho tinha vinte e seis anos e morreu porque eu deixei ele sair sozinho numa quarta-feira de novembro com vento de sudeste."',
    'Ele corrige o rumo.',
    '"Eu penso nisso todo dia faz quatro anos. Todo dia, meu filho, sem falta."',
    '"E o que eu aprendi em quatro anos é que não adianta nada."',
    '"Não adianta nada?"',
    '"Pensar não adianta nada. Devolver adianta."',
    'Ele olha pra você pela primeira vez desde que você começou a falar.',
    '"Eu não tenho o que devolver. Você tem."'
  ],
  ef:{flag:['bento_te_disse'],
      npc:{nome:'Sr. Furtado', opiniao:8, memoria:'Te disse que pensar não adianta nada e devolver adianta, e que ele não tem o que devolver.'},
      rep:{eixo:'bom',delta:3,motivo:'Contou o que fez a quem ia responder com a verdade'},
      moral:10,
      registrar:'"Pensar não adianta nada. Devolver adianta. Eu não tenho o que devolver. Você tem."',
      presagio:'Ele passou quatro anos chegando nessa frase. Use.'},
  escolhas:[
    {texto:'Soltar ali mesmo, do barco.', vai:'c13_soltou_do_barco'},
    {texto:'Voltar e devolver direito.', vai:'c13_soltou_do_barco'},
    {texto:'Voltar a Fuchsia e pensar.', vai:'c13_fim'},
    {texto:'Voltar e procurar o Dorival.', vai:'c13_dorival'}
  ]
},

c13_saiu_articuno:{
  texto:[
    'Você sai da câmara e refaz os cento e setenta metros de volta.',
    'Na saída, o ar de fora parece quente, o que é absurdo, porque está fazendo nove graus e ventando.',
    d=>d.flags.viu_a_cama || d.flags.sabe_do_segundo
       ? 'Você sabe o que tem lá dentro. Você sabe exatamente o que tem lá dentro — uma cama de algas nunca usada e uma marca de garra gasta na beirada — e está indo embora.'
       : 'Você não sabe o que viu. Sabe que viu, e que era grande, e que estava esperando alguma coisa.',
    'Sr. Furtado não pergunta nada.',
    'Ele te vê chegando, olha a sua cara, e começa a soltar a amarra sem falar.'
  ],
  ef:{flag:'saiu_das_espuma', moral:-10},
  escolhas:[
    {texto:'Voltar para o barco e ir embora.', vai:'c13_fim'},
    {texto:'Mudar de ideia e voltar.', vai:'c13_fundo'},
    {texto:'Voltar e procurar o Dorival em Fuchsia.', vai:'c13_dorival'},
    {texto:'Voltar e contar no cais.', vai:'c13_avisou_a_colonia'}
  ]
},

c13_depois_salvou:{
  texto:[
    'Você sai da caverna com água até o joelho — água, não gelo.',
    'Ela está subindo dois centímetros por minuto e está a nove graus, o que depois de dezenove semanas de dois é quase morno.',
    'Os dois Articuno saem pelo alto, pelo furo natural no teto da ilha, com uns dez minutos de diferença.',
    'O grande primeiro, devagar, e ele dá duas voltas em cima da ilha antes de subir.',
    'O pequeno depois, carregado, porque ele ainda não voa.',
    d=>d.flags.foram_os_tres || d.flags.dorival_devolveu ? 'O Dorival está sentado no gelo que está virando água, com a bunda molhada, olhando pra cima, e não se mexe até eles sumirem.' : '',
    'Sr. Furtado está no barco, de pé, com uma mão na borda, olhando pra cima.',
    'Ele não diz nada por muito tempo.',
    'Depois: "Eu queria ver antes de morrer."',
    'Ele senta.',
    '"Agora eu não sei mais o que fazer com o resto."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Devolveu o inverno ao lugar dele'},
      moral:15,
      flag:'viu_os_dois_saindo',
      npc:{nome:'Sr. Furtado', opiniao:8, memoria:'Viu os dois Articuno saírem pelo furo do teto. "Agora eu não sei mais o que fazer com o resto."'},
      registrar:'Os dois Articuno saíram pelo alto. As Seafoam descongelaram.',
      presagio:'"Agora eu não sei mais o que fazer com o resto." Pensa no que responder.'},
  escolhas:[
    {texto:'"Então a gente arruma outra coisa pro senhor ver."', vai:'c13_outra_coisa'},
    {texto:'Não responder e deixar ele com isso.', vai:'c13_fim'},
    {texto:'Voltar a Fuchsia em silêncio.', vai:'c13_fim'},
    {texto:'Perguntar do filho dele.', vai:'c13_toda_quarta', cond:d=>!!d.flags.sabe_do_filho_do_bento}
  ]
},

c13_outra_coisa:{
  texto:[
    '"Então a gente arruma outra coisa pro senhor ver."',
    'Ele ri. É uma risada de velho, curta e com tosse no fim.',
    '"Que coisa?"',
    '"Tem um vulcão em Cinnabar soltando fumaça vermelha e ninguém sabe por quê."',
    'Ele para de rir.',
    '"Você tá me convidando pra ir num vulcão?"',
    '"Eu tô te dizendo que tem um."',
    'Ele olha o horizonte na direção sul, onde tem uma ilha visível num dia limpo, e hoje está limpo.',
    'E fica olhando um tempo longo demais pra ser educação.',
    '"Cinco horas de barco daqui."',
    '"É."',
    '"Eu tenho combustível pra três."',
    'Ele engata.',
    '"A gente para em Fuchsia, enche o tanque, e a gente vê."'
  ],
  ef:{flag:['bento_vai_a_cinnabar','tem_barco_pra_cinnabar'],
      npc:{nome:'Sr. Furtado', opiniao:10, memoria:'Topou levar você a Cinnabar depois de ver os dois Articuno saírem.'},
      rep:{eixo:'bom',delta:3,motivo:'Deu a um velho uma próxima coisa'},
      moral:20,
      registrar:'Sr. Furtado vai te levar a Cinnabar.',
      presagio:'"A gente vê." Ele falou no plural de novo.'},
  escolhas:[{texto:'Voltar a Fuchsia.', vai:'c13_fim'}]
},

c13_fim:{
  texto:[
    d=>{
      if (d.flags.devolveu_o_filhote || d.flags.dorival_devolveu) return 'O gelo leva onze dias pra sumir inteiro, e some de trás pra frente, e o último pedaço a derreter é o que estava mais perto da costa de Fuchsia.';
      if (d.flags.capturou_articuno) return 'O gelo some em quatro dias, de uma vez, porque ninguém está mais segurando — e o mar volta com uma força que arrebenta seis barcos amarrados no cais de Fuchsia numa madrugada.';
      if (d.flags.soltou_articuno) return 'O gelo continua. Você viu ele recomeçar do zero e sabe exatamente quantas camadas vão ter daqui a uma semana.';
      return 'O gelo continua onde estava, avançando meio grau por semana, e Fuchsia continua com trinta e nove barcos amarrados.';
    },
    d=>{
      if (d.flags.devolveu_o_filhote && d.flags.avisou_a_colonia) return 'Na terça seguinte, trinta e nove barcos saem do cais de Fuchsia ao mesmo tempo, às quatro da manhã, e o barulho de trinta e nove motores de popa ligando junto é uma coisa que a cidade não ouvia desde junho.';
      if (d.flags.devolveu_o_filhote) return 'Na semana seguinte a pesca volta. Ninguém liga uma coisa à outra — ninguém sabe. Só você, o Sr. Furtado, o Dorival e dois Articuno.';
      if (d.flags.capturou_articuno) return 'A colônia contrata outro oceanógrafo pra explicar o descongelamento súbito. Ele cobra doze mil e escreve "origem indeterminada".';
      return 'Trezentas e onze famílias continuam sem renda, e o seguro-defeso continua não cobrindo, porque isso não é defeso.';
    },
    d=>d.flags.dorival_devolveu || d.flags.foram_os_tres
       ? 'E o Dorival volta pro cais e conta, na mesa de dominó, pra sessenta pessoas, o que ele fez em três de junho. Leva quatro minutos. Ninguém bate nele, ninguém abraça ele, e no fim o magro de boné fala: "Então vamo pescar." E é isso.'
       : d.flags.sabe_do_dorival ? 'E o Dorival continua levando dois baldes três vezes por semana, ou não continua, e você não vai saber.' : '',
    'Do cais de Fuchsia, Cinnabar é visível num dia limpo.',
    'Hoje está limpo.',
    'O vulcão está soltando fumaça.',
    'Vermelha.'
  ],
  fim:true, resumo:'Capítulo 13 concluído — o inverno tinha um motivo, e o motivo tinha nome e endereço.'

},

c13_quem_sai_mais:{
  texto:[
    '"Quem sai mais?"',
    'A secretária ri e faz a conta de cabeça, porque ela já fez essa conta sozinha em algum momento da vida por puro tédio.',
    '"O Terra Boa. Duzentas e quarenta saídas em dois anos."',
    '"Isso é muito?"',
    '"Isso é uma saída a cada três dias, meu bem, todo santo dia do ano, com chuva e com sol e com defeso."',
    'Ela para de rir.',
    '"Com defeso."',
    'Ela vira o livro do ano passado e procura com o dedo e acha, e mostra pra você: as datas de defeso estão carimbadas no topo da página, em vermelho, e embaixo delas tem quatro linhas do Terra Boa.',
    '"Isso aqui é do meu punho", ela diz. "Eu preenchi essas quatro linhas."',
    '"E ninguém nunca olhou."',
    '"Ninguém nunca olhou, meu bem. O livro fica aberto no balcão."',
    'Ela fecha com cuidado.',
    '"Eu trabalho aqui há quarenta e cinco anos e eu preenchi tudo certinho a vida inteira, e eu nunca virei a página pra ver o que eu tinha escrito."'
  ],
  ef:{flag:['sabe_do_terra_boa','provas_espuma'],
      npc:{nome:'Secretária da Colônia Z-14', opiniao:6, memoria:'Descobriu, com você, que preencheu de próprio punho quatro saídas em período de defeso.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou quem sai mais'},
      registrar:'O barco Terra Boa saiu 240 vezes em dois anos, incluindo quatro saídas em período de defeso.',
      presagio:'"Eu nunca virei a página pra ver o que eu tinha escrito." Quarenta e cinco anos.'},
  escolhas:[
    {texto:'"De quem é o Terra Boa?"', vai:'c13_outro_livro'},
    {texto:'Copiar as linhas.', vai:'c13_copiou_as_linhas'},
    {texto:'Procurar o Estrela do Sul.', vai:'c13_estrela_do_sul', cond:d=>!!d.flags.sabe_do_estrela_do_sul},
    {texto:'Ir pro cais achar um barco.', vai:'c13_procurar_barco'}
  ]

}

}}

);
