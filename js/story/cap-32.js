/* ============================================================
   CAPÍTULO 32 — O GALPÃO DA ZONA NORTE  (Saffron)  · CONDICIONAL

   Só acontece pra quem entrou em Saffron pela zona industrial —
   porque as outras três entradas estavam com triagem — e viu um
   caminhão-gaiola entrar num galpão sem placa.

   É o capítulo mais curto da jornada e o mais direto: não tem
   mistério pra desvendar. Você já sabe o que tem lá dentro.
   ============================================================ */
const C32_ABERTURAS = ['c32_a_rua_de_galpao', 'c32_a_lanchonete', 'c32_o_turno_da_noite'];
function c32_cabe(id, d){
  if (id === 'c32_o_turno_da_noite') return !!d.flags.o_som_do_galpao;
  return true;
}
function c32_abertura(d){ return Dados.escolher(C32_ABERTURAS.filter(id => c32_cabe(id, d))); }

CAPITULOS.push(
{
num:32, titulo:'O Galpão da Zona Norte', local:'Saffron — zona industrial', ambiente:'cidade', nivelArea:39,
tom:'muito sombrio',
requer: d => !!(d.flags.o_som_do_galpao || d.flags.o_galpao_do_norte),
proximo: d => 12,
entradas:C32_ABERTURAS,
inicio: d => c32_abertura(d),
cenas:{

c32_a_rua_de_galpao:{
  texto:[
    'A zona industrial norte de Saffron tem quatro ruas e as quatro se chamam rua, sem nome, com número: Rua Industrial 1 a 4.',
    'O galpão sem placa fica na 3, entre uma oficina de empilhadeira e um depósito de material de construção.',
    'De dia é o prédio mais discreto da rua: portão de aço rolante, porta social pintada da mesma cor da parede, e nenhuma janela na fachada.',
    'Tem uma caixa de correio parafusada do lado da porta social, e ela está cheia.',
    'Correspondência acumulada numa caixa de um lugar onde entra caminhão toda semana quer dizer uma coisa só: ninguém que trabalha ali é responsável por pegar a correspondência.',
    'E quem não pega correspondência não tem endereço.',
    'Você puxa o maço pela fresta. São nove envelopes.',
    'Oito são propaganda. O nono é uma conta de energia.'
  ],
  ef:{flag:'a_caixa_de_correio',
      registrar:'A caixa de correio do galpão sem placa está cheia. Nove envelopes, um deles conta de energia.',
      presagio:'Conta de energia tem titular, endereço e CNPJ impressos na frente.'},
  escolhas:[
    {texto:'Abrir a conta de energia.', vai:'c32_a_conta_de_energia'},
    {texto:'Pôr tudo de volta e observar o galpão.', vai:'c32_observou'},
    {texto:'Bater na porta social.', vai:'c32_bateu_na_porta'},
    {texto:'Procurar quem trabalha na rua.', vai:'c32_a_lanchonete'}
  ]
},

c32_a_conta_de_energia:{
  texto:[
    'Você abre a conta de energia num galpão de rua industrial em Saffron, o que é violação de correspondência, e você sabe que é.',
    'A conta tem três informações que valem alguma coisa.',
    'A primeira: o titular. Não é pessoa física e não é a sigla. É uma razão social com quatro palavras e um "Ltda." no fim, que você nunca viu em nenhum papel desta jornada.',
    'A segunda: o consumo. Dezenove mil e quatrocentos quilowatt-hora no mês.',
    'Isso é consumo de uma fábrica. Não é consumo de um galpão de armazenagem, que gasta luz e mais nada.',
    'A terceira é a que fecha: a classificação tarifária.',
    '**GRUPO A4 — SUBGRUPO INDUSTRIAL — ATIVIDADE: CLIMATIZAÇÃO E REFRIGERAÇÃO CONTÍNUA**',
    'Alguém climatiza esse galpão vinte e quatro horas por dia.',
    'Ninguém climatiza caixa.'
  ],
  ef:{flag:['a_conta_de_energia','reika_precisa_de_papel','sabe_do_lote_unico'],
      registrar:'O galpão consome 19.400 kWh/mês em climatização contínua, no nome de uma Ltda. de quatro palavras.',
      presagio:'Climatização contínua é o que se paga por coisa que estraga. Ou por coisa que sente frio.'},
  escolhas:[
    {texto:'Guardar a conta e observar o galpão.', vai:'c32_observou'},
    {texto:'Bater na porta social com a conta na mão.', vai:'c32_bateu_na_porta'},
    {texto:'Procurar quem trabalha na rua.', vai:'c32_a_lanchonete'}
  ]
},

c32_a_lanchonete:{
  texto:[
    'Toda rua de galpão de Kanto tem uma lanchonete, porque quatro ruas de galpão dão umas quatrocentas pessoas e quatrocentas pessoas almoçam.',
    'A da Industrial 2 tem seis mesas de fórmula e um balcão, e às onze e meia já tem fila.',
    'Você senta no balcão e pede o prato do dia, que custa oito e vem com arroz, feijão, uma carne e salada de repolho.',
    'Na mesa do fundo tem quatro homens de macacão azul da oficina de empilhadeira e eles falam alto porque trabalham com máquina e ficaram com o hábito.',
    'Você aprende o nome de dois deles sem precisar perguntar, do jeito que se aprende nome em mesa de lanchonete: porque eles se chamam o tempo todo. O mais velho é o Otto. O de boné é o Rico.',
    'Você ouve quarenta minutos de conversa sobre: futebol, um colega que se aposentou, o preço do aluguel em Saffron, e — nos últimos seis minutos — o galpão da 3.',
    fala('o homem de macacão', 'Aquilo ali é laboratório.'),
    fala('Rico', 'Laboratório nada. É armazém.'),
    fala('o homem de macacão', 'Armazém com ar-condicionado central, Rico?'),
    'Os quatro riem.',
    fala('Rico', 'Armazém de remédio tem.'),
    fala('o homem de macacão', 'Então é armazém de remédio que solta cheiro de bicho na sexta-feira.', 'baixo')
  ],
  ef:{flag:'a_conversa_da_lanchonete',
      registrar:'Os mecânicos da rua ao lado discutem o que é o galpão. Ele solta cheiro na sexta-feira.'},
  escolhas:[
    {texto:'Puxar conversa com os quatro.', vai:'c32_os_quatro_mecanicos'},
    {texto:'Perguntar ao dono da lanchonete.', vai:'c32_o_dono_da_lanchonete'},
    {texto:'Ir observar o galpão.', vai:'c32_observou'}
  ]
},

c32_os_quatro_mecanicos:{
  texto:[
    'Você vira no banquinho e pergunta direto, o que numa lanchonete de rua industrial é normal, porque todo mundo pergunta tudo.',
    d=>fala(d.jogador.nome, 'Cheiro de bicho como?'),
    'Os quatro param de comer ao mesmo tempo.',
    fala('o homem de macacão', 'Você é de onde?'),
    d=>fala(d.jogador.nome, 'De passagem.'),
    'Eles se olham, e é o Otto, que não tinha falado ainda, que responde.',
    fala('Otto', 'Cheiro de canil, moço. De canil grande.'),
    fala('Otto', 'Toda sexta, de manhã cedo, quando eles abrem o portão pra carregar.'),
    d=>fala(d.jogador.nome, 'Carregar o quê?'),
    fala('Otto', 'Caixa branca. Fechada. Do tamanho de uma caixa de feira.'),
    'Ele volta pro prato.',
    fala('Otto', 'Eu trabalho nessa rua há vinte e seis anos e eu já vi galpão de tudo. De pneu, de tecido, de azulejo, de frango congelado.'),
    fala('Otto', 'Aquele é o primeiro que eu não sei dizer o que é, e eu paro em frente dele todo dia às sete da manhã.', 'baixo')
  ],
  ef:{flag:['carregam_na_sexta','sabe_do_lote_unico'],
      npc:{nome:'Otto', opiniao:1, viuVoce:'Te contou do cheiro e das caixas brancas da sexta-feira.'},
      registrar:'Toda sexta de manhã o galpão abre e carrega caixas brancas fechadas. Sai cheiro de canil grande.'},
  escolhas:[
    {texto:'Perguntar que horas exatamente.', vai:'c32_que_horas'},
    {texto:'Ir observar o galpão agora.', vai:'c32_observou'},
    {texto:'Voltar na sexta de manhã.', vai:'c32_a_sexta'}
  ]
},

c32_que_horas:{
  texto:[
    fala('Otto', 'Seis e quarenta. Sempre.'),
    d=>fala(d.jogador.nome, 'Como o senhor sabe que é sempre?'),
    'Ele aponta o próprio pulso com o garfo.',
    fala('Otto', 'Porque eu entro às sete e eu passo em frente às seis e quarenta e cinco, e já tá acontecendo, e já acabou quando eu volto do café às sete e dez.'),
    'Ele come mais um pouco.',
    fala('Otto', 'Trinta minutos. Todo sexta. Faz uns três anos.'),
    fala('Rico', 'Quatro, Otto. Começou quando a empilhadeira nova chegou.'),
    fala('Otto', 'Quatro, então.'),
    'Quatro anos de trinta minutos toda sexta-feira, a cinquenta metros de uma oficina com vinte e seis anos de rua.',
    'E ninguém nunca perguntou o que era, porque em rua de galpão a educação é não perguntar o que tem no galpão do vizinho.'
  ],
  ef:{flag:'seis_e_quarenta_na_sexta',
      registrar:'O carregamento acontece toda sexta, às 6h40, e dura trinta minutos. Faz quatro anos.'},
  escolhas:[
    {texto:'Voltar na sexta às seis e quarenta.', vai:'c32_a_sexta'},
    {texto:'Ir observar o galpão agora.', vai:'c32_observou'},
    {texto:'Bater na porta social.', vai:'c32_bateu_na_porta'}
  ]
},

c32_o_dono_da_lanchonete:{
  texto:[
    'O dono tem uns sessenta anos e um avental que já foi branco, e ele limpa o balcão com um pano enquanto conversa porque ele nunca para de limpar o balcão.',
    d=>fala(d.jogador.nome, 'O pessoal do galpão da 3 almoça aqui?'),
    'Ele para de limpar.',
    fala('o dono da lanchonete', 'Não.'),
    d=>fala(d.jogador.nome, 'Nunca?'),
    fala('o dono da lanchonete', 'Em quatro anos, nenhuma vez.'),
    'Ele volta a limpar.',
    fala('o dono da lanchonete', 'Eu sirvo o pessoal da oficina, do depósito, da serralheria, da gráfica e da transportadora. Quatro ruas.'),
    fala('o dono da lanchonete', 'Do galpão da 3, ninguém.'),
    d=>fala(d.jogador.nome, 'E eles comem o quê?'),
    'Ele dobra o pano no ombro.',
    fala('o dono da lanchonete', 'Chega marmita. Numa van, meio-dia, quinze marmitas de uma vez, todo dia.'),
    fala('o dono da lanchonete', 'Quinze pessoas trabalhando lá dentro todo dia há quatro anos e nenhuma delas nunca atravessou a rua pra tomar um café.', 'baixo')
  ],
  ef:{flag:['quinze_marmitas','sabe_do_lote_unico'],
      npc:{nome:'o dono da lanchonete', opiniao:1, viuVoce:'Te contou que ninguém do galpão nunca almoçou ali em quatro anos.'},
      registrar:'Quinze marmitas chegam de van ao galpão todo dia. Ninguém de lá nunca entrou na lanchonete.',
      presagio:'Quinze pessoas com contrato de sigilo almoçam dentro do prédio. É o custo de não deixar ninguém conversar na rua.'},
  escolhas:[
    {texto:'Esperar a van das marmitas.', vai:'c32_a_van_das_marmitas'},
    {texto:'Ir observar o galpão.', vai:'c32_observou'},
    {texto:'Falar com os quatro mecânicos.', vai:'c32_os_quatro_mecanicos'}
  ]
},

c32_a_van_das_marmitas:{
  texto:[
    'A van chega às onze e cinquenta e cinco e é uma van de cozinha industrial, com adesivo e telefone, o que é o oposto de discreto.',
    'O entregador é um rapaz de uns vinte anos e ele desce com duas caixas térmicas empilhadas e toca a campainha da porta social.',
    'A porta abre quinze centímetros. Uma mão pega as duas caixas. A porta fecha.',
    'Ele volta pra van com as caixas do dia anterior.',
    'Você fala com ele antes dele arrancar.',
    d=>fala(d.jogador.nome, 'Quinze marmitas todo dia?'),
    fala('o entregador de marmita', 'Quinze de segunda a quinta. Vinte e duas na sexta.'),
    d=>fala(d.jogador.nome, 'Por que mais na sexta?'),
    'Ele dá de ombros e sobe na van.',
    fala('o entregador de marmita', 'Sei lá. Sexta tem mais gente. Eles pedem sete a mais desde que eu peguei a rota.'),
    'Ele dá a partida.',
    fala('o entregador de marmita', 'E na sexta eles pegam na porta do portão, não na porta social. É a única coisa que muda.')
  ],
  ef:{flag:['vinte_e_duas_na_sexta','carregam_na_sexta'],
      registrar:'São 15 marmitas de segunda a quinta e 22 na sexta. Na sexta a entrega é pelo portão, não pela porta social.',
      presagio:'Sete pessoas a mais só na sexta. Sete pessoas que não trabalham ali: trabalham no carregamento.'},
  escolhas:[
    {texto:'Voltar na sexta às seis e quarenta.', vai:'c32_a_sexta'},
    {texto:'Ir observar o galpão.', vai:'c32_observou'},
    {texto:'Bater na porta social.', vai:'c32_bateu_na_porta'}
  ]
},

c32_observou:{
  texto:[
    'Existe um jeito certo de observar um galpão em rua industrial e ele não é escondido: é sentar no meio-fio com uma marmita no colo, porque em rua de galpão, ao meio-dia, tem quarenta pessoas sentadas em meio-fio com marmita no colo.',
    'Você fica quatro horas.',
    'Em quatro horas o portão rolante não abre nenhuma vez. A porta social abre três vezes: a van da marmita, um homem que sai pra fumar e volta em sete minutos, e uma entrega de material de escritório.',
    'O homem que sai pra fumar fica virado pra parede do prédio, não pra rua, o que é uma coisa que ninguém faz.',
    'Ninguém fuma de frente pra parede.',
    'A não ser quem não quer ser visto de frente.'
  ],
  ef:{flag:'observou_o_galpao',
      registrar:'Quatro horas de observação: o portão não abriu, e o único funcionário que saiu fumou virado para a parede.'},
  escolhas:[
    {texto:'Falar com o fumante na próxima vez que ele sair.', vai:'c32_o_fumante'},
    {texto:'Voltar na sexta às seis e quarenta.', vai:'c32_a_sexta'},
    {texto:'Bater na porta social.', vai:'c32_bateu_na_porta'},
    {texto:'Voltar à noite.', vai:'c32_o_turno_da_noite'}
  ]
},

c32_o_fumante:{
  texto:[
    'Ele sai às quatro e dez e você atravessa a rua antes dele acender.',
    d=>fala(d.jogador.nome, 'Tem fogo?'),
    'É a abordagem mais velha do mundo e funciona porque ele está com o isqueiro na mão.',
    'Ele te dá fogo pra um cigarro que você não tem e você fica com a mão em concha em volta de nada por dois segundos, e ele vê, e não fala nada.',
    'É um homem de uns trinta e cinco anos, de calça de uniforme e camiseta, com um crachá virado pra dentro preso no cós.',
    fala('o fumante', 'Você tá aqui desde meio-dia.'),
    d=>fala(d.jogador.nome, 'Tô.'),
    fala('o fumante', 'A gente viu pela câmera.'),
    'Ele fuma.',
    fala('o fumante', 'Não é ameaça. É só pra você saber que não adianta ficar sentado no meio-fio.'),
    d=>fala(d.jogador.nome, 'O que tem lá dentro?'),
    'Ele olha pro cigarro dele.',
    fala('o fumante', 'Eu assinei um papel de quatro páginas que diz que eu não posso responder isso.'),
    fala('o fumante', 'E eu leio esse papel de novo umas duas vezes por mês.', 'baixo')
  ],
  ef:{flag:'o_fumante_do_galpao',
      npc:{nome:'o fumante', opiniao:1, viuVoce:'Sabia que você estava ali desde meio-dia e saiu pra falar com você mesmo assim.'},
      registrar:'Um funcionário do galpão saiu para falar com você. Ele relê o contrato de sigilo duas vezes por mês.',
      presagio:'Quem relê o próprio contrato de sigilo duas vezes por mês está procurando a brecha.'},
  escolhas:[
    {texto:'"Tem alguma coisa que o papel deixa você dizer?"', vai:'c32_a_brecha'},
    {texto:'"Você quer sair de lá?"', vai:'c32_quer_sair'},
    {texto:'Agradecer o fogo e ir embora.', vai:'c32_a_sexta'}
  ]
},

c32_a_brecha:{
  texto:[
    d=>fala(d.jogador.nome, 'Tem alguma coisa que o papel deixa você dizer?'),
    'Ele para com o cigarro na metade do caminho e é a primeira vez que alguém faz essa pergunta pra ele.',
    fala('o fumante', 'Tem.'),
    'Ele pensa por uns dez segundos, de verdade, procurando na memória o texto de quatro páginas que ele relê duas vezes por mês.',
    fala('o fumante', 'O sigilo é sobre espécimes, procedimentos, instalações e pessoas.'),
    d=>fala(d.jogador.nome, 'E?'),
    fala('o fumante', 'E não é sobre mim.'),
    'Ele fuma.',
    fala('o fumante', 'Eu posso falar de mim. Eu sou ferramenteiro. Eu fui contratado pra manutenção de equipamento.'),
    fala('o fumante', 'Eu faço manutenção de trezentas e onze unidades de um equipamento que eu não posso descrever.'),
    'Ele apaga o cigarro na sola do sapato e guarda a guimba no bolso, porque em rua industrial não se joga guimba no chão.',
    fala('o fumante', 'Trezentas e onze. Esse número é meu. Tá na minha ordem de serviço com o meu nome.', 'baixo')
  ],
  ef:{flag:['trezentas_e_onze_unidades','reika_precisa_de_papel','sabe_do_lote_unico'],
      rep:{eixo:'bom', delta:2, motivo:'Achou, com um ferramenteiro, a brecha no próprio contrato de sigilo dele.'},
      npc:{nome:'o fumante', opiniao:4, viuVoce:'Você achou a brecha do contrato dele e ele usou.'},
      registrar:'Um ferramenteiro faz manutenção de 311 unidades de equipamento no galpão. O número está na ordem de serviço dele.',
      presagio:'Trezentas e onze unidades de um equipamento que precisa de manutenção e de climatização contínua. Guarde o número.'},
  escolhas:[
    {texto:'Perguntar se ele guarda cópia das ordens de serviço.', vai:'c32_as_ordens_de_servico'},
    {texto:'"Você quer sair de lá?"', vai:'c32_quer_sair'},
    {texto:'Voltar na sexta às seis e quarenta.', vai:'c32_a_sexta'}
  ]
},

c32_as_ordens_de_servico:{
  texto:[
    d=>fala(d.jogador.nome, 'Você guarda cópia das suas ordens de serviço?'),
    fala('o fumante', 'Guardo. Todo ferramenteiro guarda.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('o fumante', 'Porque quando quebra alguma coisa e querem descontar do teu salário, a ordem de serviço é o que te salva.'),
    'Ele encosta na parede.',
    fala('o fumante', 'Eu tenho quatro anos de ordem de serviço numa caixa de sapato na minha casa.'),
    'Silêncio de uns cinco segundos.',
    fala('o fumante', 'E cada uma delas tem quantidade, tipo de intervenção e data. Sem falar de espécime, sem falar de procedimento, sem falar de instalação e sem falar de pessoa.'),
    fala('o fumante', 'É só manutenção de equipamento.'),
    'Ele olha pra porta social do galpão.',
    fala('o fumante', 'Quatro anos de número.'),
    d=>fala(d.jogador.nome, 'Você me daria?'),
    fala('o fumante', 'Não hoje.'),
    'Ele tira o crachá do cós, olha, e põe de volta virado pra dentro.',
    fala('o fumante', 'Mas eu não vou jogar fora, e eu sei onde te achar se você continuar perguntando por Kanto.', 'baixo'),
    d=>fala(d.jogador.nome, 'Como é o seu nome?'),
    'Ele leva a mão até o crachá de novo e para no meio do caminho.',
    fala('o fumante', 'O sigilo é sobre espécimes, procedimentos, instalações e pessoas.'),
    d=>fala(d.jogador.nome, 'Você me disse que não é sobre você.'),
    fala('o fumante', 'Eu disse que o que eu faço não é sobre mim.'),
    'Ele abotoa o bolso onde guardou a guimba.',
    fala('o fumante', 'Eu sou uma pessoa. Pessoa tá na cláusula.'),
    'E é aí que você entende que ele não achou uma brecha: ele achou os dois lados da mesma frase e usou os dois, um pra te contar e outro pra se proteger, e ele fez isso de cabeça, em pé numa calçada, sem consultar nada.',
    fala('o fumante', 'Quando eu te entregar a caixa de sapato eu te digo o meu nome.'),
    fala('o fumante', 'Aí já não vai fazer diferença.', 'baixo')
  ],
  ef:{flag:['a_caixa_de_sapato_do_ferramenteiro','sabe_do_lote_unico'],
      npc:{nome:'o fumante', opiniao:5, viuVoce:'Tem quatro anos de ordem de serviço numa caixa de sapato e sabe onde te achar.'},
      registrar:'O ferramenteiro guarda quatro anos de ordens de serviço com quantidade e data, numa caixa de sapato. Não disse o nome.',
      presagio:['Ele não deu hoje. Ele disse que sabe onde te achar. Isso é um compromisso.',
                'Ele te contou tudo e não disse o nome, e usou a mesma cláusula pras duas coisas.']},
  escolhas:[
    {texto:'Voltar na sexta às seis e quarenta.', vai:'c32_a_sexta'},
    {texto:'Ir embora de Saffron com isso.', vai:'c32_fim'}
  ]
},

c32_quer_sair:{
  texto:[
    d=>fala(d.jogador.nome, 'Você quer sair de lá?'),
    'Ele ri sem alegria nenhuma e é uma risada curta que morre rápido.',
    fala('o fumante', 'Eu ganho o dobro do mercado.'),
    d=>fala(d.jogador.nome, 'Não foi isso que eu perguntei.'),
    'Ele fica quieto.',
    fala('o fumante', 'Eu tenho uma filha de seis anos e uma prestação de nove anos.'),
    fala('o fumante', 'Todo mundo que trabalha ali dentro tem uma dessas duas coisas. Não é coincidência: eles perguntam na entrevista.'),
    d=>fala(d.jogador.nome, 'Perguntam?'),
    fala('o fumante', 'Perguntam se você tem dependente e se você tem financiamento. Tá no formulário, é normal, todo lugar pergunta.'),
    'Ele fuma o resto do cigarro em duas tragadas.',
    fala('o fumante', 'Aí você descobre depois pra que serve a pergunta.', 'frio')
  ],
  ef:{flag:'perguntam_na_entrevista', moral:-1,
      registrar:'O galpão pergunta na entrevista se o candidato tem dependente e financiamento.',
      presagio:'Não contratam quem pode ir embora.'},
  escolhas:[
    {texto:'"Tem alguma coisa que o papel deixa você dizer?"', vai:'c32_a_brecha'},
    {texto:'Voltar na sexta às seis e quarenta.', vai:'c32_a_sexta'},
    {texto:'Ir embora de Saffron.', vai:'c32_fim'}
  ]
},

c32_bateu_na_porta:{
  texto:[
    'Você toca a campainha da porta social do galpão da Industrial 3 às três da tarde de uma quarta-feira.',
    'A porta abre quinze centímetros, no limite da corrente, e atrás dela tem uma mulher de uns quarenta anos de jaleco branco.',
    fala('a mulher de jaleco', 'Pois não.'),
    d=>fala(d.jogador.nome, 'O que é aqui?'),
    'Ela não hesita e não se irrita.',
    fala('a mulher de jaleco', 'Instalação privada. Não tem atendimento ao público.'),
    d=>fala(d.jogador.nome, 'Instalação privada de quê?'),
    fala('a mulher de jaleco', 'De uma empresa privada.'),
    'E é tudo verdade, e é tudo suficiente, e não tem uma única palavra ali que dê pra transformar em denúncia.',
    fala('a mulher de jaleco', 'O senhor precisa de alguma coisa?'),
    d=>fala(d.jogador.nome, 'Preciso.'),
    fala('a mulher de jaleco', 'Então o senhor pode protocolar um pedido na sede da empresa. O endereço está na junta comercial.'),
    'E fecha a porta, educadamente, sem bater.'
  ],
  ef:{flag:'bateu_no_galpao',
      registrar:'Bateram a porta educadamente: instalação privada, sem atendimento ao público, endereço na junta comercial.',
      presagio:'Ela te mandou pra junta comercial. Ela não precisava. Ou é treinamento, ou é outra coisa.'},
  escolhas:[
    {texto:'Ir à junta comercial procurar o endereço da sede.', vai:'c32_a_junta'},
    {texto:'Voltar na sexta às seis e quarenta.', vai:'c32_a_sexta'},
    {texto:'Observar o galpão de fora.', vai:'c32_observou'}
  ]
},

c32_a_junta:{
  texto:[
    'A junta comercial de Saffron fica no segundo andar de um prédio público, atende das nove às dezesseis, e cobra doze pokedólares por certidão simplificada.',
    'Você entrega a razão social de quatro palavras da conta de energia — ou, se não tem a conta, o endereço do galpão, que também dá.',
    'A certidão sai em vinte minutos.',
    'Objeto social: "armazenagem e logística de material biológico, com climatização controlada".',
    'Capital social: baixo. Quadro societário: duas pessoas físicas, com nome e documento.',
    'E na última linha, onde vai o administrador designado, tem um nome que não é nenhum dos dois sócios.',
    'É uma administradora contratada, também pessoa jurídica.',
    'E o nome dela é a sigla de cinco caracteres.'
  ],
  ef:{dinheiro:-12, flag:['a_certidao_da_junta','sabe_o_nome_da_comissao','reika_precisa_de_papel','sabe_do_lote_unico'],
      registrar:'A certidão da junta: armazenagem de material biológico com climatização, administrada pela sigla.',
      presagio:'Dois sócios que ninguém conhece e uma administradora que aparece em todo papel desta jornada.'},
  escolhas:[
    {texto:'Pedir também a ficha dos dois sócios.', vai:'c32_os_dois_socios'},
    {texto:'Voltar na sexta às seis e quarenta.', vai:'c32_a_sexta'},
    {texto:'Ir embora de Saffron com a certidão.', vai:'c32_fim'}
  ]
},

c32_os_dois_socios:{
  texto:[
    'Mais doze pokedólares e mais vinte minutos.',
    'Os dois sócios são pessoas físicas com documento válido e endereço declarado em Saffron.',
    'E a atendente da junta, que tem uns cinquenta anos e já viu muita certidão, faz uma coisa que ninguém pediu: ela roda os dois documentos numa segunda consulta.',
    fala('a atendente da junta', 'Esses dois são sócios de mais quarenta e uma empresas.'),
    d=>fala(d.jogador.nome, 'Quarenta e uma?'),
    fala('a atendente da junta', 'Quarenta e uma. Todas com a mesma administradora contratada.'),
    'Ela vira a tela.',
    fala('a atendente da junta', 'Isso aqui a gente chama de laranja, moço. É um par de laranja.'),
    fala('a atendente da junta', 'E eu sou obrigada a te falar uma coisa: ser sócio de quarenta e uma empresas não é crime.'),
    'Ela imprime a lista das quarenta e uma, que sai em três folhas.',
    fala('a atendente da junta', 'Só que quem monta quarenta e uma empresas com dois nomes e uma administradora só não está economizando papel.', 'baixo')
  ],
  ef:{dinheiro:-12, flag:['as_quarenta_e_uma_empresas','reika_precisa_de_papel','sabe_o_nome_da_comissao'],
      rep:{eixo:'bom', delta:2, motivo:'Puxou na junta comercial a lista das quarenta e uma empresas do mesmo par de sócios.'},
      npc:{nome:'a atendente da junta', opiniao:3, viuVoce:'Rodou a segunda consulta sem você pedir e imprimiu as quarenta e uma.'},
      registrar:'Os dois sócios do galpão são sócios de 41 empresas, todas com a mesma administradora contratada.',
      presagio:'Quarenta e uma empresas. Uma delas é um galpão climatizado com trezentas e onze unidades de equipamento.'},
  escolhas:[
    {texto:'Voltar na sexta às seis e quarenta.', vai:'c32_a_sexta'},
    {texto:'Ir embora de Saffron com as três folhas.', vai:'c32_fim'}
  ]
},

c32_o_turno_da_noite:{
  texto:[
    'Você volta na Industrial 3 às onze da noite e a rua inteira está apagada, menos duas coisas: um poste na esquina e uma fresta de luz embaixo do portão rolante do galpão.',
    'Uma fresta de luz embaixo de um portão às onze da noite quer dizer turno da noite.',
    'Você encosta na parede do depósito de material de construção do outro lado e fica.',
    'E é aqui que o galpão finalmente para de ser discreto.',
    'Porque de dia a rua tem barulho de oficina e de caminhão e de gente, e de noite a rua não tem nada.',
    'E, sem nada, dá pra ouvir.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} está do seu lado e para de andar antes de você, e vira a cabeça pro galpão, e as orelhas ${pron(p).dele} fazem uma coisa que você já viu ${pron(p).ele} fazer duas vezes na vida.`
               : 'Você para de andar sem decidir parar.';
    },
    'Muita coisa viva no mesmo lugar, abafada por parede de alvenaria e por portão de aço, às onze da noite, numa rua de galpão em Saffron.',
    'E não é barulho de agitação.',
    'É constante. É um murmúrio que não sobe e não desce, e um murmúrio que não sobe e não desce é de quem está acordado há muito tempo e não espera mais nada.'
  ],
  ef:{flag:['o_som_do_galpao','ouviu_a_noite'], hp:-1, moral:-2,
      registrar:'À noite, sem o barulho da rua, dá para ouvir o galpão por fora.',
      presagio:'Um murmúrio que não sobe e não desce.'},
  escolhas:[
    {texto:'Voltar às seis e quarenta da sexta.', vai:'c32_a_sexta'},
    {texto:'Procurar uma entrada agora, à noite.', vai:'c32_procurou_entrada'},
    {texto:'Sair de Saffron. Você não vai conseguir dormir de qualquer jeito.', vai:'c32_fim'}
  ]
},

c32_procurou_entrada:{
  texto:[
    'Você dá a volta no quarteirão e o galpão tem, além do portão rolante e da porta social, exatamente mais uma abertura: uma janela basculante de vidro aramado na empena lateral, a três metros e meio do chão, aberta em quarenta e cinco graus pra ventilação.',
    'Três metros e meio é alto. Tem um contêiner de entulho do depósito vizinho encostado na parede e o contêiner tem um metro e oitenta.',
    'Em cima do contêiner, com os braços esticados, você alcança o peitoril.',
    'E não entra, porque você não cabe numa basculante, e porque não era pra entrar.',
    'Era pra ver.',
    'O interior do galpão é iluminado com luz fria e é organizado de um jeito que dói: quatro corredores, gaiolas empilhadas em três alturas dos dois lados, numeração pintada no chão, e duas pessoas de jaleco andando entre os corredores com prancheta.',
    'Está tudo limpo.',
    'Está tudo em ordem.',
    'E você fica pendurado numa basculante de vidro aramado, às onze e vinte da noite, contando corredores, até os braços não aguentarem mais.'
  ],
  ef:{hp:-3, causa:'Pendurado numa janela por tempo demais',
      flag:['viu_dentro_do_galpao','sabe_do_lote_unico'], moral:-2,
      rep:{eixo:'ruim', delta:1, motivo:'Subiu num contêiner de entulho para olhar dentro de uma instalação privada.'},
      registrar:'Viu o interior do galpão: quatro corredores, gaiolas em três alturas, numeração no chão, duas pessoas de jaleco.',
      presagio:'Limpo, iluminado, numerado e com prancheta. É pior do que se fosse um porão.'},
  escolhas:[
    {texto:'Voltar na sexta às seis e quarenta.', vai:'c32_a_sexta'},
    {texto:'Ir embora de Saffron.', vai:'c32_fim'}
  ]
},

c32_a_sexta:{
  texto:[
    'Sexta, seis e trinta e cinco da manhã. A rua Industrial 3 já tem gente: a oficina abre às sete e o pessoal chega antes.',
    'Às seis e quarenta o portão rolante do galpão sobe.',
    'Sobe inteiro, o que ele não faz em nenhum outro dia da semana, e atrás dele tem um caminhão-baú já posicionado de ré e sete pessoas de jaleco esperando.',
    'O carregamento é rápido e é silencioso e é organizado.',
    'Caixa branca fechada, do tamanho de uma caixa de feira, passada de mão em mão em corrente humana, do corredor do galpão até o baú.',
    'Você conta.',
    'Quarenta e uma caixas em vinte e seis minutos.',
    'Às sete e seis o baú fecha, o portão desce, e a rua Industrial 3 volta a ser uma rua de galpão numa manhã de sexta-feira.',
    'A cinquenta metros, o Otto está encostado na porta da oficina com um copo de café, olhando.',
    'Ele olha pra você. Você olha pra ele.',
    'Nenhum dos dois fala nada, porque não tem nada pra falar que já não tenha sido dito por vinte e seis minutos de corrente humana.'
  ],
  ef:{flag:['viu_o_carregamento','sabe_do_lote_unico'], moral:-2,
      registrar:'Quarenta e uma caixas brancas carregadas em 26 minutos, numa manhã de sexta, na Industrial 3.',
      presagio:'Quarenta e uma caixas. Quarenta e uma empresas. O número te persegue e não é coincidência: é o mesmo lote.'},
  escolhas:[
    {texto:'Seguir o caminhão-baú.', vai:'c32_seguiu_o_bau'},
    {texto:'Ir falar com o Otto.', vai:'c32_o_mecanico_de_novo'},
    {texto:'Ir embora de Saffron com o que você tem.', vai:'c32_fim'}
  ]
},

c32_seguiu_o_bau:{
  texto:[
    'Seguir caminhão-baú a pé numa zona industrial de manhã funciona por quatro quarteirões, que é o tempo que ele leva pra chegar na avenida.',
    'Na avenida acaba.',
    'Você fica na esquina vendo o baú entrar no fluxo e virar um caminhão branco entre outros vinte caminhões brancos, e a única coisa que você consegue guardar é a direção.',
    'Sul.',
    'Sul de Saffron é Vermilion, e Vermilion é porto.',
    'E porto é onde carga com nota atravessa e ninguém abre nada.'
  ],
  ef:{flag:['o_bau_foi_pro_sul','sabe_do_lote_unico'],
      registrar:'O caminhão-baú do carregamento de sexta seguiu para o sul: sentido Vermilion.'},
  escolhas:[
    {texto:'Ir embora de Saffron.', vai:'c32_fim'}
  ]
},

c32_o_mecanico_de_novo:{
  texto:[
    'Você atravessa a rua e ele te oferece o copo de café antes de você falar, e você aceita porque recusar seria grosseria.',
    fala('Otto', 'Quarenta e uma.'),
    d=>fala(d.jogador.nome, 'Você conta?'),
    fala('Otto', 'Todo sexta, há quatro anos.'),
    'Ele toma o café dele do outro copo.',
    fala('Otto', 'Tem semana de trinta e seis. Tem semana de cinquenta e dois. A média é quarenta e uma.'),
    d=>fala(d.jogador.nome, 'Você anota?'),
    'Ele entra na oficina e volta em quarenta segundos com um calendário de parede de fornecedor de peça, do tipo que vem de graça em janeiro.',
    'Cada sexta-feira tem um número escrito a caneta no canto do quadrinho.',
    'Quatro calendários. Quatro anos.',
    fala('Otto', 'Eu não sei o que eu tô contando, moço.'),
    fala('Otto', 'Eu só sei que quando eu comecei era vinte e dois.', 'baixo')
  ],
  ef:{flag:['os_calendarios_do_mecanico','reika_precisa_de_papel','sabe_do_lote_unico'],
      rep:{eixo:'bom', delta:2, motivo:'Um mecânico de vinte e seis anos de rua te mostrou quatro anos de contagem em calendário de parede.'},
      npc:{nome:'Otto', opiniao:4, viuVoce:'Te mostrou quatro calendários com a contagem de sexta-feira.'},
      registrar:'O mecânico tem quatro anos de contagem: começou em 22 caixas por sexta e hoje é 41.',
      presagio:'De vinte e dois pra quarenta e um em quatro anos. Isso dobrou, e nada para de dobrar sozinho.'},
  escolhas:[
    {texto:'Pedir os calendários.', vai:'c32_pediu_os_calendarios'},
    {texto:'Ir embora de Saffron.', vai:'c32_fim'}
  ]
},

c32_pediu_os_calendarios:{
  texto:[
    d=>fala(d.jogador.nome, 'Me dá os calendários.'),
    'Ele olha pros quatro, empilhados no braço dele.',
    fala('Otto', 'Eu ia jogar fora esse ano.'),
    d=>fala(d.jogador.nome, 'Então me dá.'),
    fala('Otto', 'É que aí eu paro de contar.'),
    'E ele fica com os quatro no braço e essa frase no ar por uns bons dez segundos, e é o dilema mais honesto que alguém te apresentou em Kanto.',
    'Aí ele entrega três.',
    fala('Otto', 'Leva os três velhos. Esse ano é meu até dezembro.'),
    'Ele volta pra oficina com o de dois mil pendurado no braço e é sete e vinte da manhã e ele tem que abrir.',
    fala('Otto', 'Volta em janeiro que eu te dou esse.')
  ],
  ef:{flag:['tem_os_tres_calendarios','reika_precisa_de_papel'],
      npc:{nome:'Otto', opiniao:6, viuVoce:'Te deu três dos quatro calendários e ficou contando o do ano corrente.'},
      registrar:'Está com três calendários de parede com a contagem semanal de caixas, de três anos.',
      presagio:'Ele ficou com o do ano em curso pra continuar contando. Volta em janeiro.'},
  escolhas:[
    {texto:'Ir embora de Saffron.', vai:'c32_fim'}
  ]
},

c32_fim:{
  texto:[
    'Você sai de Saffron pelo sul, pela avenida, no mesmo sentido em que o baú saiu.',
    d=>{
      if (d.flags.tem_os_tres_calendarios) return 'Na mochila tem três calendários de parede de fornecedor de peça de empilhadeira, com um número escrito a caneta em cada sexta-feira de três anos.';
      if (d.flags.as_quarenta_e_uma_empresas) return 'Na mochila tem três folhas impressas com quarenta e uma razões sociais, dois nomes de sócio e uma administradora contratada.';
      if (d.flags.a_certidao_da_junta) return 'Na mochila tem uma certidão simplificada de doze pokedólares que diz "armazenagem de material biológico com climatização controlada".';
      if (d.flags.a_conta_de_energia) return 'Na mochila tem uma conta de energia de dezenove mil e quatrocentos quilowatt-hora que não é sua e que você não devia ter aberto.';
      return 'Na mochila não tem nada. Na cabeça tem quatro corredores, três alturas de gaiola e numeração pintada no chão.';
    },
    d=>d.flags.trezentas_e_onze_unidades
      ? 'E um número que um ferramenteiro te deu porque o contrato de sigilo dele falava de espécime, de procedimento, de instalação e de pessoa, e não falava dele: trezentas e onze.'
      : 'E a certeza de que aquele galpão tem quatro anos, quinze funcionários que nunca atravessam a rua pra tomar café, e climatização contínua.',
    'Fuchsia fica a dois dias, e lá tem nove mil hectares de reserva com trinta e um quilômetros de cerca e uma frase em letra garrafal na fachada da recepção.'
  ],
  fim:true, resumo:'O galpão da Industrial 3: climatização contínua, trezentas e onze unidades, quarenta e uma caixas por sexta-feira e quatro anos de contagem num calendário de parede.'
}

}
});
