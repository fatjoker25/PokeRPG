/* ============================================================
   CAPÍTULO 30 — AS ONZE LINHAS  (Lavender)  · CONDICIONAL

   Só acontece pra quem viu o livro de registro da guarita de
   Lavender: onze pessoas subiram a torre em dois meses e a
   coluna de descida está vazia nas onze. Oito subiram entre três
   e quatro da manhã, com a guarita fechada, escritas com a letra
   da funcionária.
   ============================================================ */
const C30_ABERTURAS = ['c30_a_guarita', 'c30_o_cartorio', 'c30_a_lista_dos_onze'];
function c30_cabe(id, d){
  if (id === 'c30_a_lista_dos_onze') return !!d.flags.oito_linhas_de_madrugada;
  return true;
}
function c30_abertura(d){ return Dados.escolher(C30_ABERTURAS.filter(id => c30_cabe(id, d))); }

CAPITULOS.push(
{
num:30, titulo:'As Onze Linhas', local:'Lavender — a guarita e o cartório', ambiente:'cemiterio', nivelArea:30,
tom:'muito sombrio',
requer: d => !!(d.flags.o_livro_da_guarita || d.flags.oito_linhas_de_madrugada ||
                d.flags.copia_das_tres_respostas),
proximo: d => 8,
entradas:C30_ABERTURAS,
inicio: d => c30_abertura(d),
cenas:{

c30_a_guarita:{
  texto:[
    'Você volta na guarita da entrada de Lavender às sete e dez da manhã e ela já está aberta, porque ela abre às sete.',
    'A funcionária te vê chegar e não finge surpresa. O crachá dela está na mesa, virado pra cima, e diz E. WREN — desde 1974, como o livro.',
    fala('Sra. Wren', 'Eu sabia que você ia voltar.'),
    d=>fala(d.jogador.nome, 'Como?'),
    fala('Sra. Wren', 'Porque ninguém pede pra ver o livro e vai embora.'),
    'Ela puxa o livro de baixo do balcão e abre nas últimas páginas sem precisar procurar.',
    fala('Sra. Wren', 'Eu fiz uma coisa ontem à noite depois que você saiu.'),
    'Ela vira uma folha solta, dobrada em quatro, e desdobra na bancada.',
    fala('Sra. Wren', 'Eu copiei as onze. Nome, data, hora de subida.'),
    fala('Sra. Wren', 'E depois eu fui na lista telefônica.'),
    'Ela alisa a folha com a palma.',
    fala('Sra. Wren', 'Sete dos onze têm telefone em Kanto. Eu liguei pros sete.', 'baixo')
  ],
  ef:{flag:['a_funcionaria_ligou','o_livro_da_guarita'],
      npc:{nome:'Sra. Wren', opiniao:3, viuVoce:'Copiou as onze linhas e ligou para sete, depois que você foi embora.'},
      registrar:'A funcionária da guarita copiou as onze linhas e ligou para os sete que tinham telefone.'},
  escolhas:[
    {texto:'Perguntar o que os sete disseram.', vai:'c30_os_sete_telefones'},
    {texto:'Pedir a folha copiada.', vai:'c30_a_lista_dos_onze'},
    {texto:'Perguntar o que ela vai fazer agora.', vai:'c30_o_que_ela_vai_fazer'}
  ]
},

c30_os_sete_telefones:{
  texto:[
    'Ela pega um lápis e vai apontando linha por linha enquanto fala, e ela fez isso a noite inteira e está precisa como quem fez a noite inteira.',
    fala('Sra. Wren', 'Três atenderam a própria pessoa. Os três subiram, desceram e foram embora, e a coluna de descida está vazia porque eu não estava aqui pra preencher.'),
    d=>fala(d.jogador.nome, 'Então três são erro de registro.'),
    fala('Sra. Wren', 'Três são erro meu. Eu registrei mal.'),
    'Ela não se defende. Anota o erro e segue.',
    fala('Sra. Wren', 'Dois atenderam parente. Os dois estão em casa, vivos, e os dois não lembram de ter subido nenhuma torre.'),
    d=>fala(d.jogador.nome, 'Não lembram?'),
    fala('Sra. Wren', 'Um deles tem sessenta e oito anos e a família falou que ele anda esquecido. Tudo bem.'),
    'Ela move o lápis.',
    fala('Sra. Wren', 'O outro tem vinte e seis.'),
    'Silêncio na guarita.',
    fala('Sra. Wren', 'E os dois últimos telefones dão errado. Não é fora de área, não é desligado: é número que nunca existiu.', 'baixo')
  ],
  ef:{flag:['os_dois_numeros_falsos','tres_erros_de_registro'],
      registrar:'Dos sete telefones: 3 erros de registro, 2 vivos e um deles de 26 anos que não lembra, 2 números que nunca existiram.',
      presagio:'Número que nunca existiu foi escrito por alguém que precisava escrever alguma coisa naquele campo.'},
  escolhas:[
    {texto:'Ir atrás do rapaz de vinte e seis anos.', vai:'c30_o_rapaz_de_vinte_e_seis'},
    {texto:'Ir atrás dos dois nomes de telefone falso.', vai:'c30_o_cartorio'},
    {texto:'Pedir a folha copiada.', vai:'c30_a_lista_dos_onze'}
  ]
},

c30_a_lista_dos_onze:{
  texto:[
    'A folha tem onze linhas em letra de quem escreve o dia inteiro: pequena, reta e legível.',
    'Nome. Data. Hora de subida. E, nas oito linhas de madrugada, um asterisco a lápis que ela pôs depois.',
    'Você lê as onze duas vezes e na segunda leitura vê a coisa que não dá pra desver.',
    'Os quatro nomes do primeiro mês são nomes comuns de Kanto: sobrenome de três sílabas, nome de duas.',
    'Os sete do segundo mês também.',
    'Mas as oito linhas de madrugada têm todas a mesma estrutura de nome: dois caracteres, ponto, sobrenome.',
    '**H. Sawada. K. Torii. M. Anzai. Y. Ihara. T. Ebina. R. Okuda. S. Fuse. N. Dahl.**',
    'Ninguém assina o próprio nome assim num livro de guarita.',
    'Gente assina assim em formulário de trabalho.'
  ],
  ef:{flag:['tem_a_lista_dos_onze','reika_precisa_de_papel'],
      registrar:'As oito linhas de madrugada têm formato de assinatura de formulário: inicial, ponto, sobrenome.',
      presagio:'Oito pessoas que assinam como quem assina no serviço, de madrugada, numa guarita fechada.'},
  escolhas:[
    {texto:'Ir ao cartório procurar os oito sobrenomes.', vai:'c30_o_cartorio'},
    {texto:'Perguntar o que os sete telefones disseram.', vai:'c30_os_sete_telefones'},
    {texto:'Subir a torre e procurar rastro deles.', vai:'c30_subiu_procurando'}
  ]
},

c30_o_que_ela_vai_fazer:{
  texto:[
    d=>fala(d.jogador.nome, 'O que a senhora vai fazer agora?'),
    'Ela fecha o livro e põe as duas mãos em cima dele.',
    fala('Sra. Wren', 'Eu tenho cinquenta e quatro anos e faltam seis pra aposentadoria.'),
    d=>fala(d.jogador.nome, 'Isso não é resposta.'),
    fala('Sra. Wren', 'É a resposta mais honesta que eu tenho às sete e dez da manhã.'),
    'Ela olha pra rua, onde ainda não passa ninguém.',
    fala('Sra. Wren', 'Eu reportei três vezes e ninguém veio. Eu liguei pra sete telefones ontem à noite sozinha, na minha casa, com a minha conta.'),
    fala('Sra. Wren', 'Eu não vou fazer mais nada e eu vou continuar abrindo essa guarita às sete todo dia.'),
    'Ela empurra a folha copiada na sua direção.',
    fala('Sra. Wren', 'Você faz.', 'baixo')
  ],
  ef:{flag:['tem_a_lista_dos_onze','reika_precisa_de_papel'],
      npc:{nome:'Sra. Wren', opiniao:4, viuVoce:'Te entregou a cópia e disse que não ia fazer mais nada.'},
      registrar:'A funcionária te entregou a cópia das onze linhas e disse que não vai adiante.'},
  escolhas:[
    {texto:'Ler as onze linhas com atenção.', vai:'c30_a_lista_dos_onze'},
    {texto:'Ir ao cartório com os nomes.', vai:'c30_o_cartorio'},
    {texto:'Subir a torre.', vai:'c30_subiu_procurando'}
  ]
},

c30_o_rapaz_de_vinte_e_seis:{
  texto:[
    'O nome na linha de madrugada é Nico Hart, e Nico Hart está na lista telefônica de Lavender, com endereço e tudo, porque gente viva está na lista telefônica.',
    'É uma casa geminada de fachada azul na terceira rua a partir da praça.',
    'Quem atende é ele mesmo. Vinte e seis anos, camiseta de time, chinelo, e a cara de quem acordou faz vinte minutos.',
    d=>fala(d.jogador.nome, 'Você subiu a Torre Pokémon no dia dezessete?'),
    fala('Nico', 'Não.'),
    d=>fala(d.jogador.nome, 'Tem o seu nome no livro da guarita.'),
    'Ele coça a cabeça. Não está mentindo — é possível ver quando alguém não está mentindo e ele não está.',
    fala('Nico', 'Eu nunca subi aquela torre na minha vida. Eu tenho medo.'),
    'Ele diz "eu tenho medo" com a naturalidade de quem já disse isso muitas vezes e parou de achar vergonhoso.',
    d=>fala(d.jogador.nome, 'Você perdeu algum documento nos últimos meses?'),
    'E aí ele para.',
    fala('Nico', 'Perdi a carteira em agosto. No ônibus.'),
    fala('Nico', 'Apareceu depois, na rodoviária. Tava tudo lá, até o dinheiro.', 'baixo')
  ],
  ef:{flag:['a_carteira_perdida','sabe_do_lote_unico'],
      npc:{nome:'Nico Hart', opiniao:1, viuVoce:'Você descobriu que o nome dele foi usado no livro da torre.'},
      registrar:'O nome de Nico Hart, 26 anos, foi usado no livro sem ele ter subido. A carteira dele sumiu e voltou intacta em agosto.',
      presagio:'Devolveram a carteira com o dinheiro. Ninguém devolve dinheiro. Eles só queriam o nome.'},
  escolhas:[
    {texto:'Pedir pra ele ir junto na guarita reconhecer a letra.', vai:'c30_a_letra'},
    {texto:'Ir ao cartório com os oito sobrenomes.', vai:'c30_o_cartorio'},
    {texto:'Subir a torre.', vai:'c30_subiu_procurando'}
  ]
},

c30_a_letra:{
  texto:[
    'Nico vai junto, de chinelo, porque são quatro quadras e porque ele quer ver.',
    'A funcionária abre o livro e vira na data.',
    'Ele olha a assinatura dele mesmo por uns dez segundos.',
    fala('Nico', 'Essa é a minha letra.'),
    d=>fala(d.jogador.nome, 'Você acabou de dizer que não subiu.'),
    fala('Nico', 'E não subi. Mas essa é a minha letra.'),
    'Ele pega uma caneta do balcão e assina numa folha em branco, do lado, e vira as duas pra vocês verem.',
    'São idênticas. Não parecidas: idênticas, inclusive na pressão do traço e no jeito que o "a" não fecha.',
    'A funcionária põe a mão na boca e não tira por um tempo.',
    fala('Sra. Wren', 'Isso é decalque.'),
    d=>fala(d.jogador.nome, 'Como assim decalque?'),
    fala('Sra. Wren', 'Papel por cima, luz por baixo, mão firme. Eu trabalhei em cartório por nove anos antes daqui.'),
    fala('Sra. Wren', 'Alguém teve a assinatura dele em papel e copiou por cima, aqui no meu livro.', 'frio')
  ],
  ef:{flag:['a_assinatura_decalcada','reika_precisa_de_papel'],
      rep:{eixo:'bom', delta:2, motivo:'Provou que uma assinatura do livro da torre foi decalcada.'},
      registrar:'A assinatura no livro da torre é decalque da carteira que sumiu e voltou.',
      presagio:'Decalque exige a assinatura original na mão e tempo. A carteira ficou sumida quatro dias.'},
  escolhas:[
    {texto:'Ir ao cartório com os oito sobrenomes.', vai:'c30_o_cartorio'},
    {texto:'Subir a torre procurando os outros dez.', vai:'c30_subiu_procurando'}
  ]
},

c30_o_cartorio:{
  texto:[
    'Lavender tem um cartório de registro civil que ocupa a sala da frente de uma casa e fecha para o almoço das doze às catorze, e tem uma escrivã que trabalha ali há vinte e nove anos.',
    'Você leva os oito sobrenomes.',
    'Ela pede quatro pokedólares por busca e você paga trinta e dois, que é o preço de saber uma coisa.',
    'A busca leva quarenta minutos e ela faz de pé, num arquivo de gavetas metálicas que vai do chão ao teto.',
    'Quando volta, ela põe oito fichas na bancada e nenhuma expressão no rosto.',
    fala('a escrivã', 'Os oito existem. Os oito nasceram em Kanto.'),
    d=>fala(d.jogador.nome, 'E?'),
    fala('a escrivã', 'E os oito têm registro de óbito.'),
    'Ela alinha as fichas.',
    fala('a escrivã', 'O mais antigo é de mil novecentos e setenta e um. O mais recente é de oitenta e nove.'),
    'Ela endireita a última.',
    fala('a escrivã', 'As oito pessoas que assinaram o seu livro nos últimos dois meses estão mortas há mais de dez anos, moço.'),
    'E ela fala isso sem drama nenhum, porque ela trabalha com óbito há vinte e nove anos e não tem drama nenhum numa ficha.'
  ],
  ef:{dinheiro:-32, flag:['os_oito_estao_mortos','reika_precisa_de_papel','sabe_do_lote_unico'],
      registrar:'As oito assinaturas de madrugada do livro da torre pertencem a pessoas mortas entre 1971 e 1989.',
      presagio:'Não é assombração. É que nome de morto não reclama, não é achado em busca e não aparece em lista de desaparecido.'},
  escolhas:[
    {texto:'Pedir cópia das oito certidões.', vai:'c30_as_certidoes'},
    {texto:'Perguntar de onde alguém tiraria oito nomes assim.', vai:'c30_de_onde_saem_os_nomes'},
    {texto:'Subir a torre com isso na cabeça.', vai:'c30_subiu_procurando'}
  ]
},

c30_de_onde_saem_os_nomes:{
  texto:[
    d=>fala(d.jogador.nome, 'De onde alguém tira oito nomes de morto com sobrenome de Lavender?'),
    'A escrivã olha pra você por três segundos inteiros e é o único momento da conversa em que ela demonstra alguma coisa.',
    fala('a escrivã', 'Daqui.'),
    d=>fala(d.jogador.nome, 'Daqui do cartório?'),
    fala('a escrivã', 'Daqui, do arquivo da torre, ou da lápide.'),
    'Ela aponta com o queixo pra janela, por onde dá pra ver o prédio de concreto no fim da rua.',
    fala('a escrivã', 'A torre tem um livro de sepultamento desde mil novecentos e sessenta e seis. Está no quinto andar, e é público.'),
    fala('a escrivã', 'Qualquer um sobe e lê.'),
    'Ela recolhe as fichas.',
    fala('a escrivã', 'Quem quer nome de morto em Lavender não precisa roubar nada. Precisa subir cinco andares.'),
    fala('a escrivã', 'E os que precisam subir cinco andares são os que assinam o livro da guarita.', 'baixo')
  ],
  ef:{flag:'o_livro_do_quinto_andar',
      registrar:'O livro de sepultamento do quinto andar da torre é público desde 1966. É de lá que saem os nomes.'},
  escolhas:[
    {texto:'Subir até o quinto andar.', vai:'c30_subiu_procurando'},
    {texto:'Pedir cópia das oito certidões antes.', vai:'c30_as_certidoes'}
  ]
},

c30_as_certidoes:{
  texto:[
    'Ela tira as oito certidões de óbito e carimba as oito e assina as oito, e leva quase uma hora, e cobra o preço de tabela que é caro.',
    'Você paga.',
    'Oito folhas de papel timbrado com selo em relevo, cada uma com um nome que subiu uma torre em Lavender entre uma e quatro da manhã, nos últimos dois meses, mais de dez anos depois de morrer.',
    'Não existe documento mais definitivo do que certidão de óbito, e é por isso que ninguém pensou em usar nomes de morto numa fraude: porque é fácil demais de conferir.',
    'Ninguém conferiu por dois meses.',
    fala('a escrivã', 'Guarda isso num plástico, que papel timbrado é frágil.')
  ],
  ef:{dinheiro:-320, flag:['tem_as_oito_certidoes','reika_precisa_de_papel'],
      npc:{nome:'a escrivã', opiniao:2, viuVoce:'Emitiu e assinou as oito certidões de óbito para você.'},
      registrar:'Está com as oito certidões de óbito carimbadas e assinadas.'},
  escolhas:[
    {texto:'Subir a torre.', vai:'c30_subiu_procurando'},
    {texto:'Ir embora de Lavender com isso.', vai:'c30_fim'}
  ]
},

c30_subiu_procurando:{
  texto:[
    'Você sobe a Torre Pokémon de manhã, com a torre aberta e com gente nela, e é uma experiência completamente diferente de subir a torre à noite.',
    'Tem uma família no segundo andar. Tem um zelador varrendo o terceiro. Tem duas mulheres conversando baixo no quarto, perto da janela de onde se vê a cidade.',
    'No quinto andar está o livro de sepultamento, numa bancada de madeira, aberto, com um lápis amarrado num barbante.',
    'É um livro enorme. Trinta e quatro anos de nomes.',
    'E, entre as páginas, marcando lugares, tem oito tiras de papel.',
    'Oito.',
    'Você abre nas oito e cada uma marca um nome, e os oito nomes são os oito da madrugada, e a tira de papel é papel de caderno rasgado à mão.',
    'Alguém marcou os oito e não tirou as marcas, porque quem marca não imagina que alguém vá procurar.'
  ],
  ef:{flag:['as_oito_tiras','sabe_do_lote_unico'],
      registrar:'No livro de sepultamento do quinto andar há oito tiras de papel marcando exatamente os oito nomes da madrugada.',
      presagio:'Oito marcadores deixados no lugar. Eles vão voltar pra pegar mais.'},
  escolhas:[
    {texto:'Ficar escondido no quinto andar e esperar.', vai:'c30_esperou_no_quinto'},
    {texto:'Levar as oito tiras.', vai:'c30_levou_as_tiras'},
    {texto:'Deixar tudo no lugar e sair.', vai:'c30_fim'}
  ]
},

c30_levou_as_tiras:{
  texto:[
    'Você tira as oito tiras do livro e guarda, e imediatamente entende que acabou de fazer uma coisa burra.',
    'Sem as tiras, o livro volta a ser um livro de sepultamento comum e quem voltar não vai saber que alguém descobriu.',
    'Com as tiras na sua mão, você tem oito pedaços de papel de caderno rasgados que não provam absolutamente nada pra ninguém.',
    'Você fica olhando os oito pedaços na palma da mão no quinto andar de uma torre e considera seriamente pôr de volta.'
  ],
  ef:{flag:'levou_as_tiras',
      registrar:'Levou as oito tiras que marcavam os nomes no livro de sepultamento.'},
  escolhas:[
    {texto:'Pôr de volta e esperar escondido.', vai:'c30_esperou_no_quinto'},
    {texto:'Levar mesmo assim e ir embora.', vai:'c30_fim'}
  ]
},

c30_esperou_no_quinto:{
  texto:[
    'O quinto andar da Torre Pokémon tem uma sala lateral com cadeira empilhada e vassoura, que é onde o zelador guarda coisa, e a porta não tranca.',
    'Você espera ali das seis da tarde às duas e quarenta da manhã.',
    'Oito horas e quarenta minutos sentado no escuro em cima de uma cadeira empilhada.',
    'A torre de noite não tem nada de sobrenatural e é pior por isso: é concreto, é frio, e o eco devolve o seu próprio movimento com meio segundo de atraso, e depois de duas horas você começa a se assustar consigo mesmo.',
    'Às duas e quarenta e um, alguém sobe.',
    'Passo de sapato de sola dura. Uma pessoa. Lanterna.',
    'E vai direto pro livro, sem procurar, porque já sabe onde ele fica.'
  ],
  ef:{hp:-3, causa:'Oito horas imóvel no escuro da torre',
      flag:'esperou_no_quinto',
      registrar:'Esperou até as 2h41 no quinto andar. Alguém subiu.'},
  escolhas:[
    {texto:'Acender a lanterna na cara dele.', vai:'c30_acendeu'},
    {texto:'Ficar quieto e ver o que ele faz.', vai:'c30_ficou_quieto'}
  ]
},

c30_ficou_quieto:{
  texto:[
    'Ele leva doze minutos.',
    'Abre o livro, passa o dedo pelas colunas, e copia nomes num caderninho — você ouve a caneta.',
    'Quando termina, rasga uma folha do próprio caderno em tiras e marca as páginas novas, do mesmo jeito que estava marcado antes, e você entende que ele faz isso sempre e que as oito tiras não eram descuido: eram método.',
    'Ele marca seis.',
    'Seis nomes novos, o que quer dizer que vão subir mais seis pessoas mortas naquela guarita nas próximas semanas.',
    'Ele desce.',
    'E você fica no escuro do quinto andar entendendo que acabou de ver o começo, não o fim.'
  ],
  ef:{flag:['viu_ele_marcar','sabe_do_lote_unico'],
      registrar:'Lorca marcou seis nomes novos no livro de sepultamento. Vão ser usados nas próximas semanas.',
      presagio:'Seis novos. Você sabe quais são e eles não sabem que você sabe.'},
  escolhas:[
    {texto:'Anotar os seis nomes que ele marcou.', vai:'c30_os_seis_novos'},
    {texto:'Descer atrás dele.', vai:'c30_desceu_atras'}
  ]
},

c30_os_seis_novos:{
  texto:[
    'Você acende a lanterna quando o passo dele chega no segundo andar e copia os seis nomes na sua própria folha, com data de óbito e número de registro, que estão os dois na mesma linha do livro.',
    'Seis nomes, seis datas, seis números.',
    'Daqui a algumas semanas, esses seis vão aparecer assinados num livro de guarita entre uma e quatro da manhã.',
    'Você é a única pessoa em Kanto que sabe disso com antecedência.',
    'E isso não é uma prova: é melhor que prova. É uma previsão que vai se cumprir e que está escrita antes de acontecer, na sua letra, com a data de hoje.'
  ],
  ef:{flag:['tem_os_seis_nomes','reika_precisa_de_papel'],
      rep:{eixo:'bom', delta:2, motivo:'Anotou, com antecedência, os seis nomes que ainda vão ser usados.'},
      registrar:'Anotou os seis nomes marcados, com data de óbito e número de registro, antes de serem usados.',
      presagio:'Uma previsão datada é a única prova que ninguém consegue dizer que foi plantada depois.'},
  escolhas:[
    {texto:'Ir embora de Lavender com isso.', vai:'c30_fim'}
  ]
},

c30_acendeu:{
  texto:[
    'Você acende a lanterna na cara dele a dois metros e ele derruba a dele, que rola e para apontada pro teto.',
    'É um homem de uns quarenta anos, de camisa social sem gravata, com um caderninho de bolso na mão.',
    'Na capa do caderninho, escrito a caneta no canto de cima do jeito que se escreve nome em material que pode ser esquecido em mesa de repartição: S. LORCA.',
    'Ele não corre. Ele fecha os olhos por causa da luz e levanta a mão livre.',
    fala('Lorca', 'Baixa isso, por favor.'),
    d=>fala(d.jogador.nome, 'O que você tá fazendo?'),
    fala('Lorca', 'Pesquisa de campo.'),
    d=>fala(d.jogador.nome, 'Às duas e quarenta da manhã.'),
    fala('Lorca', 'A torre é pública vinte e quatro horas. Está na placa.'),
    'E está mesmo. É a coisa mais irritante do capítulo: ele não está fazendo nada de ilegal neste exato momento.',
    fala('Lorca', 'Você é quem? Da prefeitura?'),
    'E aí ele te reconhece, e dá pra ver o momento em que reconhece, e a cara dele muda pra uma coisa muito pior que medo: alívio.',
    fala('Lorca', 'Ah. É você.', 'baixo')
  ],
  ef:{flag:'ele_te_reconheceu',
      registrar:'Lorca te reconheceu, e ficou aliviado.',
      presagio:'Alívio. Ele estava esperando outra pessoa e você não é ela.'},
  escolhas:[
    {texto:'"Quem você achou que eu era?"', vai:'c30_quem_voce_achou'},
    {texto:'Pegar o caderninho.', vai:'c30_pegou_o_caderninho'},
    {texto:'Enfrentar ele.', vai:'c30_luta'}
  ]
},

c30_quem_voce_achou:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem você achou que eu era?'),
    'Ele abaixa a mão e apanha a lanterna dele do chão, devagar, e você deixa.',
    fala('Lorca', 'Da Comissão.'),
    d=>fala(d.jogador.nome, 'Você não é da Comissão?'),
    fala('Lorca', 'Eu sou terceirizado.'),
    'Ele diz essa palavra com um cansaço específico de quem já explicou isso pra muita gente e pra si mesmo.',
    fala('Lorca', 'Eu presto serviço de levantamento cadastral. Eu recebo uma lista de requisitos e eu entrego nomes.'),
    d=>fala(d.jogador.nome, 'Nomes de morto.'),
    fala('Lorca', 'Nomes sem pendência, sem herdeiro reclamante e sem registro ativo em nenhum sistema.'),
    'Ele guarda o caderninho no bolso interno.',
    fala('Lorca', 'Eu nunca escrevi "morto" em nenhum documento meu. Eles é que sabem o que pedem.'),
    fala('Lorca', 'Eu ganho por nome entregue. Setecentos.', 'baixo')
  ],
  ef:{flag:['o_terceirizado','sabe_do_lote_unico'],
      npc:{nome:'Lorca', opiniao:0, viuVoce:'Te explicou o próprio serviço no quinto andar da torre, às três da manhã.'},
      registrar:'Lorca, terceirizado, entrega "nomes sem pendência" por 700 ₽ cada. Ele nunca escreveu "morto" em documento nenhum.',
      presagio:'Ninguém na cadeia inteira escreveu a palavra. Cada um escreveu a sua parte, e cada parte está em ordem.'},
  escolhas:[
    {texto:'Perguntar quem manda a lista de requisitos.', vai:'c30_quem_manda_a_lista'},
    {texto:'Pedir o caderninho.', vai:'c30_pegou_o_caderninho'},
    {texto:'Deixar ele ir e ir embora com o que você tem.', vai:'c30_fim'}
  ]
},

c30_quem_manda_a_lista:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem manda a lista de requisitos?'),
    fala('Lorca', 'Chega por malote. Eu entrego por malote.'),
    d=>fala(d.jogador.nome, 'De onde?'),
    'Ele tira do bolso um envelope pardo, usado, dobrado ao meio, e mostra o verso na luz da sua lanterna.',
    'Carimbo de expedição: Rua do Comércio, 118 — sala 704.',
    'Você fica olhando o carimbo mais tempo do que precisaria.',
    fala('Lorca', 'Você já tinha visto esse carimbo.'),
    'Não é pergunta.',
    fala('Lorca', 'Todo mundo que eu encontro já tinha visto esse carimbo em algum lugar.'),
    'Ele guarda o envelope.',
    fala('Lorca', 'É a coisa mais estranha desse serviço, moço. Não tem nada escondido. Tem carimbo em tudo.')
  ],
  ef:{flag:['o_endereco_no_envelope','sabe_do_lote_unico'],
      registrar:'O malote do Lorca vem da Rua do Comércio, 118, sala 704.',
      presagio:'Carimbo em tudo. O esconderijo é a papelada, não o segredo.'},
  escolhas:[
    {texto:'Pedir o envelope.', vai:'c30_pegou_o_caderninho'},
    {texto:'Deixar ele ir e ir embora.', vai:'c30_fim'}
  ]
},

c30_pegou_o_caderninho:{
  texto:[
    d=>fala(d.jogador.nome, 'Me dá o caderninho.'),
    fala('Lorca', 'Não.'),
    'E ele diz isso com uma firmeza que não estava na conversa até agora.',
    fala('Lorca', 'Esse caderno tem três anos de serviço meu e o nome de todo mundo que me pagou.'),
    d=>fala(d.jogador.nome, 'Exatamente.'),
    fala('Lorca', 'E é a única coisa que me segura vivo.'),
    'Ele dá dois passos pra trás na direção da escada.',
    fala('Lorca', 'Olha. Eu vou te dar uma coisa melhor que o caderno.'),
    'Ele arranca uma folha, a última escrita, e estende.',
    fala('Lorca', 'A entrega de hoje. Os seis nomes, com data de óbito e número de registro, na minha letra, com a minha data.'),
    fala('Lorca', 'Se aparecerem assinados numa guarita, você tem uma previsão datada.'),
    'Ele desce a escada.',
    fala('Lorca', 'E eu tenho o resto do caderno.', 'baixo')
  ],
  ef:{flag:['tem_os_seis_nomes','reika_precisa_de_papel','sabe_do_lote_unico'],
      npc:{nome:'Lorca', opiniao:1, viuVoce:'Te entregou a folha dos seis nomes e ficou com o caderno.'},
      registrar:'Está com a folha dos seis nomes, na letra e na data do Lorca.',
      presagio:'Ele ficou com o caderno de propósito. Esse caderno vai reaparecer.'},
  escolhas:[
    {texto:'Ir embora de Lavender.', vai:'c30_fim'}
  ]
},

c30_desceu_atras:{
  texto:[
    'Descer sete andares de escada de concreto atrás de alguém que tem lanterna, sem lanterna, é possível por um motivo só: o eco.',
    'O passo dele chega até você com meio segundo de atraso e você anda no atraso dele.',
    'Na base da torre ele sai e atravessa a praça e entra num carro estacionado na rua lateral, e o carro parte, e você anota a placa na palma da mão com a caneta.',
    'E, quando o carro vira a esquina, você olha pra base da torre e vê a coisa que muda o capítulo.',
    'Tem uma segunda pessoa encostada na parede lateral da torre, na sombra, que estava ali o tempo todo e que não estava esperando o carro.',
    'Estava esperando você descer.'
  ],
  ef:{flag:'a_segunda_pessoa', hp:-1,
      registrar:'Havia uma segunda pessoa esperando na base da torre.',
      presagio:'O do caderninho ficou aliviado ao te ver. Esta é a pessoa que ele estava esperando.'},
  escolhas:[
    {texto:'Ir até ela.', vai:'c30_luta'},
    {texto:'Voltar pra dentro da torre.', vai:'c30_fim'},
    {texto:'Andar na direção contrária, devagar, sem correr.', vai:'c30_fim'}
  ]
},

c30_luta:{
  texto:[
    'Não tem conversa. A pessoa solta o dela antes de você chegar a cinco metros, e isso responde todas as perguntas que você ia fazer.'
  ],
  batalha:{dex:42, nivel:29, tipo:'treinador', treinador:'a pessoa da sombra', fuga:true,
           timeExtra:[{dex:93, nivel:28}],
           vitoria:'c30_venceu', derrota:'c30_perdeu', gameover:'gameover'}
},

c30_venceu:{
  texto:[
    'A pessoa recolhe o time e recua, de costas, até a esquina, e some.',
    'Não fala nada a briga inteira e não fala nada no fim, e é isso que fica com você: não teve uma palavra.',
    'No chão, onde ela estava encostada, tem um maço de cigarro amassado e uma fita de crachá sem o crachá.',
    'A fita é azul com escrita branca repetida, dessas de evento. A escrita diz um nome de empresa que você não reconhece e um ano.',
    'Você guarda a fita.'
  ],
  ef:{flag:['a_fita_de_cracha','reika_precisa_de_papel'],
      rep:{eixo:'bom', delta:1, motivo:'Enfrentou quem esperava na base da torre.'},
      registrar:'Ficou com uma fita de crachá sem crachá, com nome de empresa e ano.'},
  escolhas:[
    {texto:'Ir embora de Lavender.', vai:'c30_fim'}
  ]
},

c30_perdeu:{
  texto:[
    'Você perde e a pessoa não faz mais nada: não te revista, não te ameaça, não fala.',
    'Recolhe o time dela e vai embora andando, no passo normal, pela praça, na frente da Torre Pokémon, às três e vinte da manhã.',
    'Você fica sentado na base da torre com o seu time no chão e a certeza muito clara de que aquilo não foi um aviso.',
    'Foi só alguém te tirando do caminho por uma noite, porque uma noite era o que eles precisavam.'
  ],
  ef:{hp:-5, causa:'Briga na base da torre', flag:'perdeu_na_base_da_torre', moral:-3,
      registrar:'Perdeu na base da torre. A pessoa foi embora andando.',
      presagio:'Eles precisavam de uma noite. Amanhã de manhã alguma coisa em Lavender vai estar diferente.'},
  escolhas:[
    {texto:'Ir embora de Lavender.', vai:'c30_fim'}
  ]
},

c30_fim:{
  texto:[
    'Você sai de Lavender pela estrada do sul, de manhã, e a cidade continua sem música atrás de você.',
    d=>{
      if (d.flags.tem_os_seis_nomes) return 'Na mochila tem seis nomes de gente morta que ainda não foram usados, com data de óbito, número de registro e a data de hoje escrita por cima.';
      if (d.flags.tem_as_oito_certidoes) return 'Na mochila tem oito certidões de óbito com selo em relevo, de oito pessoas que assinaram um livro de guarita depois de mortas.';
      if (d.flags.as_oito_tiras) return 'Na cabeça ficam oito tiras de papel de caderno marcando oito páginas de um livro de sepultamento, e a certeza de que elas vão ser substituídas por seis.';
      return 'Na mochila não tem nada e na cabeça tem onze linhas com a coluna de descida vazia.';
    },
    d=>d.flags.o_endereco_no_envelope
      ? 'E um endereço que apareceu duas vezes agora, em duas cidades diferentes, carimbado no verso de dois envelopes pardos: Rua do Comércio, 118, sala 704.'
      : 'E a sensação, que ainda não é uma ideia, de que tudo isso passa por um lugar só.',
    'Vermilion fica a dois dias, e lá tem um porto que trabalha vinte e quatro horas e um navio atracado no cais três.'
  ],
  fim:true, resumo:'As onze linhas do livro da guarita: oito assinaturas de gente morta há mais de dez anos, decalcadas, e seis nomes novos já marcados.'
}

}
});
