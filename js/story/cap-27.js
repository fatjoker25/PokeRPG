/* ------------------------------------------------------------
   ABERTURAS — dois dias de caminhada até o norte. O primeiro dia
   é só cansaço, e o começo dele depende de com quem você sobe.
   ------------------------------------------------------------ */
const C27_ABERTURAS = ['c22_subida', 'c27_ab_o_posto_fechado', 'c27_ab_a_mula', 'c27_ab_sozinho_mesmo'];
function c27_cabe(id, d){
  if (id === 'c27_ab_a_mula') return d.jogador.dinheiro >= 1200;
  return true;
}
function c27_abertura(d){ return Dados.escolher(C27_ABERTURAS.filter(id => c27_cabe(id, d))); }

/* ============================================================
   CAPÍTULO 27 — O VALE
   Acima da Rota 10, onde o mapa só tem hachura.
   ============================================================ */
CAPITULOS.push(
{
num:27, titulo:'O Vale', local:'Norte de Kanto, acima da Rota 10', ambiente:'montanha', nivelArea:58,
tom:'muito sombrio', entradas:C27_ABERTURAS,
inicio: d => c27_abertura(d),
cenas:{

c27_ab_o_posto_fechado:{
  texto:[
    'O posto velho da estrada de baixo, o de antes do posto florestal da Rota 10, é uma casa de madeira com um mastro sem bandeira.',
    'Está fechado.',
    'Não é "fechado hoje": tem um cadeado com ferrugem de meses e uma janela com teia de Spinarak por dentro, e na porta um aviso de papel que a chuva comeu e do qual sobra uma linha:',
    '**"…atendimento transferido para a unidade de Cerulean."**',
    'Cerulean fica a quatro dias daqui.',
    'No degrau do posto tem um caderno de capa dura amarrado num barbante preso ao corrimão, do jeito que se prende caneta em banco.',
    'É um livro de registro de subida improvisado. Alguém pôs ali.',
    'A última assinatura é de dezenove dias atrás.',
    'Você lê as últimas dez linhas e nenhuma tem a coluna de descida preenchida.'
  ],
  ef:{flag:'o_posto_fechado',
      registrar:'O posto velho da estrada de baixo está fechado há meses. O livro improvisado tem dez subidas sem descida.',
      presagio:'Dez sem descida pode ser gente que desceu por outro lado. Pode.'},
  escolhas:[
    {texto:'Assinar o caderno antes de subir.', vai:'c27_ab_assinou_o_caderno'},
    {texto:'Não assinar. Subir direto.', vai:'c22_primeiro_dia'},
    {texto:'Procurar a trilha antiga, a que não está no mapa.', vai:'c22_trilha_antiga'}
  ]
},

c27_ab_assinou_o_caderno:{
  texto:[
    d=>`Você escreve o seu nome, a data e a hora, e deixa a coluna de descida em branco como todo mundo deixou.`,
    'E aí você faz uma coisa que ninguém das dez linhas anteriores fez: escreve embaixo, na coluna de observação, a data em que você pretende descer.',
    'É uma bobagem. Ninguém vai ler esse caderno.',
    'Mas se alguém ler, e se a data passar, vai existir no mundo uma linha dizendo que você devia ter voltado e não voltou.',
    'Você amarra o barbante de volta no corrimão e sobe.'
  ],
  ef:{flag:'assinou_o_caderno_do_posto',
      registrar:'Assinou o livro improvisado do posto e escreveu a data em que pretende descer.'},
  escolhas:[
    {texto:'Seguir a trilha antiga, a que não está no mapa.', vai:'c22_trilha_antiga'},
    {texto:'Subir direto.', vai:'c22_primeiro_dia'},
    {texto:'Procurar o lugar do acidente da primeira equipe.', vai:'c22_o_acidente', cond:d=>!!d.flags.sabe_das_tres_equipes}
  ]
},

c27_ab_a_mula:{
  texto:[
    'Na última vila antes da estrada acabar tem um homem que aluga Tauros de carga, e o nome dele está numa placa de madeira pregada no mourão do curral: ENZO — ALUGA-SE.',
    'Mil e duzentos por dois dias, e ele sobe junto, porque ele não aluga o Tauros: ele aluga o Tauros com ele.',
    fala('Enzo', 'Eu subo até a pedra. Da pedra pra cima o Tauros não vai e eu também não.'),
    d=>fala(d.jogador.nome, 'Por que você não vai?'),
    fala('Enzo', 'Porque eu tenho quarenta e nove anos e dois filhos.'),
    'Ele afivela a cilha com o joelho apoiado na barriga do Pokémon.',
    fala('Enzo', 'E porque eu já subi. Em oitenta e oito, com uma equipe da universidade.'),
    d=>fala(d.jogador.nome, 'E o que tinha lá em cima?'),
    'Ele para de afivelar.',
    fala('Enzo', 'Frio. Muito frio e uma boca de caverna que não sai vento.'),
    fala('Enzo', 'Caverna sempre sai vento, {moço|moça}. Sempre. É o primeiro negócio que a gente aprende.'),
    fala('Enzo', 'Daquela não sai.', 'baixo')
  ],
  ef:{dinheiro:-1200, flag:['subiu_de_mula','a_caverna_sem_vento'],
      npc:{nome:'Enzo', opiniao:1, viuVoce:'Subiu com você até a pedra, pelo preço combinado.'},
      registrar:'Alugou Tauros de carga e guia até a pedra. Ele subiu em 1988 com uma equipe da universidade.',
      presagio:'Caverna sem vento não tem outra saída. Ou não é caverna.'},
  escolhas:[
    {texto:'Perguntar o que aconteceu com a equipe de oitenta e oito.', vai:'c27_ab_a_equipe_de_oitenta_e_oito'},
    {texto:'Subir com ele até a pedra.', vai:'c22_primeiro_dia'},
    {texto:'Pedir pra ele te levar pela trilha antiga.', vai:'c22_trilha_antiga'}
  ]
},

c27_ab_a_equipe_de_oitenta_e_oito:{
  texto:[
    fala('Enzo', 'Eram seis. Quatro professores e dois alunos.'),
    'Ele puxa o Tauros pela rédea e começa a andar, e você anda do lado, e é assim que a conversa vai acontecer.',
    fala('Enzo', 'Ficaram onze dias. Eu subi três vezes levando mantimento.'),
    d=>fala(d.jogador.nome, 'E depois?'),
    fala('Enzo', 'Na quarta vez eu subi e não tinha mais ninguém.'),
    'O Tauros bufa. Ele afrouxa a rédea.',
    fala('Enzo', 'O acampamento tava montado. Barraca em pé, fogareiro, mantimento da terceira viagem intacto.'),
    fala('Enzo', 'Eu desci e avisei. Vieram uns quinze, da Liga e da polícia, subiram no dia seguinte.'),
    d=>fala(d.jogador.nome, 'Acharam?'),
    fala('Enzo', 'Acharam os seis. Todos vivos, todos em lugares diferentes da montanha, todos em três dias.'),
    'Ele para de andar.',
    fala('Enzo', 'E nenhum dos seis soube dizer como tinha chegado onde tinha chegado.', 'baixo')
  ],
  ef:{flag:['a_equipe_de_oitenta_e_oito','sabe_das_tres_equipes'],
      registrar:'Em 1988 uma equipe de seis sumiu do acampamento e foi achada em três dias, viva, espalhada e sem saber como chegou lá.'},
  escolhas:[
    {texto:'Procurar o lugar do acidente da primeira equipe.', vai:'c22_o_acidente'},
    {texto:'Subir direto.', vai:'c22_primeiro_dia'},
    {texto:'Seguir a trilha antiga.', vai:'c22_trilha_antiga'}
  ]
},

c27_ab_sozinho_mesmo:{
  texto:[
    'Ninguém te leva, ninguém te acompanha, ninguém te vende nada. A estrada acaba no posto e vira trilha, e a trilha acaba em duas horas e vira pedra, e você faz as duas horas sem encontrar uma pessoa.',
    'O primeiro dia é só cansaço, e cansaço sozinho é diferente de cansaço acompanhado: não tem ninguém pra quem reclamar, então você não reclama, então você não repara que está cansad{o|a} até parar.',
    'Você para às cinco da tarde porque a luz vai embora e monta o acampamento com as mãos que já não fecham direito.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} deita colado na sua perna e não sai de lá a noite inteira, e você acorda duas vezes só pra conferir que ${pron(p).ele} continua ali.`
               : 'Você deita e olha pro teto da barraca por um tempo comprido, e não tem ninguém pra conferir se continua ali.';
    },
    'De madrugada você acorda uma terceira vez, sem motivo.',
    'E fica deitad{o|a} escutando, e o que você escuta é: nada.',
    'Nada mesmo. Nenhum Pokémon, nenhum vento, nenhuma folha.',
    'Você está a mil e duzentos metros de altitude numa mata fechada e não tem um único som.'
  ],
  ef:{flag:'a_noite_sem_som', hp:-2,
      registrar:'Passou a primeira noite da subida sozinh{o|a}. De madrugada, silêncio absoluto.',
      presagio:'Mata sem som é mata que se calou. E mata se cala por alguma coisa.'},
  escolhas:[
    {texto:'Levantar e seguir de madrugada mesmo.', vai:'c22_primeiro_dia'},
    {texto:'Esperar clarear e procurar a trilha antiga.', vai:'c22_trilha_antiga'},
    {texto:'Esperar clarear e descer até o posto florestal.', vai:'c22_posto'}
  ]
},


c22_subida:{
  texto:[
    'O norte de Kanto, acima da Rota 10, é uma região que os mapas resolvem com a palavra acidentado.',
    'A estrada acaba no posto florestal e vira trilha, e a trilha acaba em duas horas e vira pedra.',
    d=>{
      if (d.flags.deixou_o_mapa) return 'Você não tem o mapa. Está indo pela lembrança das coordenadas que leu de cabeça para baixo em cima de uma mesa.';
      if (d.jogador.cargo) return `Você está subindo como ${d.jogador.cargo}, o que não ajuda em nada aqui em cima.`;
      return 'O mapa da Liga marca um ponto e não marca mais nada em volta dele por quinze quilômetros.';
    },
    'São dois dias de caminhada. O primeiro é só cansaço.'
  ],
  ef:{registrar:'Subiu ao norte de Kanto.'},
  escolhas:[
    {texto:'Parar no posto florestal antes de subir.', vai:'c22_posto'},
    {texto:'Seguir a trilha antiga, a que não está no mapa.', vai:'c22_trilha_antiga'},
    {texto:'Subir direto.', vai:'c22_primeiro_dia'},
    {texto:'Procurar o lugar do acidente da primeira equipe.', vai:'c22_o_acidente', cond:d=>!!d.flags.sabe_das_tres_equipes}
  ]
},

c22_posto:{
  texto:[
    'O posto florestal da Rota 10 é uma casa de madeira com antena, um gerador e uma caixa d água em cima de quatro pernas.',
    'Quem atende é um homem de uns cinquenta anos de camisa cáqui desbotada, que se apresenta como Sr. Emory Poplar e que está sozinho aqui há dois anos e meio.',
    '"{O senhor|A senhora} vai subir." Não é pergunta. "Assina o livro."',
    'O livro fica num prego, do lado da porta. É um caderno de capa dura com uma coluna de nomes, uma de datas de subida e uma de datas de descida.',
    'Você passa o dedo pela terceira coluna e conta seis linhas em branco.'
  ],
  ef:{flag:'assinou_o_livro',
      npc:{nome:'Sr. Emory Poplar', opiniao:1, memoria:'Guarda do posto florestal da Rota 10, sozinho há dois anos e meio.'},
      registrar:'Assinou o livro do posto florestal. Quatro linhas sem data de descida.'},
  escolhas:[
    {texto:'Perguntar quem são as seis linhas em branco.', vai:'c22_as_quatro_linhas'},
    {texto:'Perguntar o que ele vê daqui.', vai:'c22_o_que_ele_ve'},
    {texto:'Perguntar se ele já subiu.', vai:'c22_ele_ja_subiu'},
    {texto:'Assinar e subir.', vai:'c22_primeiro_dia'}
  ]
},

c22_as_quatro_linhas:{
  texto:[
    'Ele não precisa olhar o livro.',
    fala('Sr. Emory Poplar', 'Duas da primeira equipe, faz dezoito meses.', null, 'Ele conta com o queixo.'),
    fala('Sr. Emory Poplar', 'Vernon, em março. E três de agora, de quatro meses atrás.'),
    d=>fala(d.jogador.nome, 'Três? Eles voltaram. A Liga disse que a terceira equipe voltou inteira.'),
    'Ele olha para você com uma paciência de quem já explicou isso.',
    fala('Sr. Emory Poplar', 'Voltaram seis do vale e desceram três daqui.', null, 'Ele bate no livro com o dedo.'),
    fala('Sr. Emory Poplar', 'Três ficaram. Montaram acampamento lá em cima, num ponto que dá para ver daqui com binóculo, e estão lá até hoje.'),
    d=>fala(d.jogador.nome, 'Até hoje?'),
    fala('Sr. Emory Poplar', 'Até hoje. Eu levo comida de quinze em quinze dias e eles agradecem e comem.')
  ],
  ef:{flag:['tres_ficaram','achou_o_acampamento_existe'], instabilidade:1,
      registrar:'Três da terceira equipe nunca desceram. Estão acampados lá em cima há quatro meses.'},
  escolhas:[
    {texto:'"O senhor conversa com eles?"', vai:'c22_conversa_com_eles'},
    {texto:'"Por que o senhor não desce eles à força?"', vai:'c22_porque_nao_desce'},
    {texto:'Subir.', vai:'c22_primeiro_dia'}
  ]
},

c22_conversa_com_eles:{
  texto:[
    '"Converso."',
    'Ele enche uma caneca de café de um bule que está sempre em cima do fogão.',
    '"Eles são educados e falam normal, de tudo. Da Liga, de comida, de chuva." Ele estende a caneca para você. "Só tem uma coisa."',
    '"Qual?"',
    '"Se eu pergunto quanto tempo faz que eles estão lá, eles erram sempre para menos." Ele sopra o café dele. "Já perguntei nove vezes. A resposta mais alta foi duas semanas."',
    'Ele bebe.',
    '"E faz quatro meses, {moço|moça}. Eu marco no calendário."'
  ],
  ef:{flag:['sabe_do_tempo_errado'], instabilidade:2,
      registrar:'Os três acampados erram o tempo sempre para menos. A resposta mais alta foi duas semanas.'},
  escolhas:[
    {texto:'"Por que o senhor não desce eles à força?"', vai:'c22_porque_nao_desce'},
    {texto:'"O senhor já subiu até o vale?"', vai:'c22_ele_ja_subiu'},
    {texto:'Subir.', vai:'c22_primeiro_dia'}
  ]
},

c22_porque_nao_desce:{
  texto:[
    '"Porque eu tenho cinquenta e um anos e eles são três adultos que não estão presos."',
    'Ele põe a caneca na pia.',
    '"E porque eu tentei." Ele diz isso de costas. "No segundo mês eu peguei um pelo braço e trouxe até aqui embaixo, andando."',
    '"E?"',
    '"E ele chegou aqui, sentou nessa cadeira, tomou café e conversou comigo duas horas." Ele se vira. "E no dia seguinte de manhã ele tinha subido de novo, e ele deixou um bilhete pedindo desculpa pelo incômodo."',
    'Ele pega o bilhete de dentro do livro, onde ele guarda, e mostra sem entregar.',
    'Desculpe o incômodo. Eu preciso estar lá quando ele perguntar de novo.'
  ],
  ef:{flag:['sabe_do_bilhete'], instabilidade:2, moral:-2,
      npc:{nome:'Sr. Emory Poplar', opiniao:2, memoria:'Já trouxe um deles para baixo e ele subiu de novo na manhã seguinte.'},
      registrar:'Eu preciso estar lá quando ele perguntar de novo.'},
  escolhas:[
    {texto:'"O senhor já subiu até o vale?"', vai:'c22_ele_ja_subiu'},
    {texto:'"O que o senhor vê daqui?"', vai:'c22_o_que_ele_ve'},
    {texto:'Subir.', vai:'c22_primeiro_dia'}
  ]
},

c22_ele_ja_subiu:{
  texto:[
    '"Até o acampamento, de quinze em quinze dias."',
    '"E até o vale?"',
    'Ele demora.',
    '"Uma vez. No primeiro ano, antes de tudo isso, quando eu ainda achava que o meu trabalho era conhecer a área."',
    'Ele abre uma gaveta e tira um binóculo velho, de correia rachada.',
    '"Eu cheguei na borda, olhei para baixo, e desci sem entrar."',
    '"Por quê?"',
    '"Porque tinha dois Pokémon grandes lá embaixo virados para o mesmo lado, e eu tenho trinta anos de mato, {moço|moça}." Ele fecha a gaveta. "Pokémon não fica virado para o mesmo lado. Pokémon fica virado um contra o outro."'
  ],
  ef:{flag:['sabe_dos_dois_virados'], instabilidade:1,
      registrar:'Ele viu dois Pokémon grandes no vale, virados para o mesmo lado. Pokémon não faz isso.'},
  escolhas:[
    {texto:'"Me empresta o binóculo."', vai:'c22_pediu_binoculo'},
    {texto:'"O que o senhor vê daqui, do posto?"', vai:'c22_o_que_ele_ve'},
    {texto:'Subir.', vai:'c22_primeiro_dia'}
  ]
},

c22_pediu_binoculo:{
  texto:[
    'Ele entrega sem pensar duas vezes e depois se arrepende visivelmente, e mesmo assim não pede de volta.',
    '"É do meu pai. Volta com ele."',
    'Você pendura a correia rachada no pescoço e promete voltar com ele, e é a primeira promessa que você faz nesta subida.'
  ],
  ef:{flag:'tem_o_binoculo', itens:{'Binóculo do pai do Sr. Poplar':1},
      npc:{nome:'Sr. Emory Poplar', opiniao:3, memoria:'Te emprestou o binóculo do pai dele.'},
      registrar:'Pegou emprestado o binóculo do pai do Sr. Poplar, com promessa de devolver.'},
  escolhas:[
    {texto:'"O que o senhor vê daqui?"', vai:'c22_o_que_ele_ve'},
    {texto:'Subir.', vai:'c22_primeiro_dia'}
  ]
},

c22_o_que_ele_ve:{
  texto:[
    '"Do posto? Nada do vale, que fica atrás daquela lomba."',
    'Ele aponta com o queixo.',
    '"Mas eu vejo o céu em cima dele, e eu vejo os Pokémon daqui de baixo, e é isso que eu ia te contar de qualquer jeito."',
    '"Que Pokémon?"',
    '"Todos." Ele abre os braços. "Desde março que não sobe Pokémon nenhum acima da lomba. Nenhum. Nem Pidgey, nem Rattata, nem Pokémon de rio."',
    'Ele deixa os braços caírem.',
    '"E não é medo, porque medo eles mostram. Eles chegam na lomba, param, ficam um tempo, e vão para o lado. Do jeito que a gente faz quando vê uma fita de isolamento."'
  ],
  ef:{flag:['sabe_da_lomba'], instabilidade:2,
      registrar:'Desde março, nenhum Pokémon passa da lomba. Eles param, olham e contornam.'},
  escolhas:[
    {texto:'Subir.', vai:'c22_primeiro_dia'},
    {texto:'"Me empresta o binóculo."', vai:'c22_pediu_binoculo'},
    {texto:'Perguntar das seis linhas em branco.', vai:'c22_as_quatro_linhas'}
  ]
},

c22_trilha_antiga:{
  texto:[
    'Existe uma trilha antiga que sobe pelo lado leste e que não está no mapa da Liga, e que dá para achar se você souber que existe.',
    'Ela é larga demais para trilha de Pokémon e tem, de dois em dois quilômetros, marcos de pedra empilhada com uma laje em cima.',
    'No terceiro marco, a laje tem alguma coisa gravada.',
    'Não é escrita. São traços: um grupo de riscos verticais e, embaixo, um risco horizontal.',
    'Você conta os verticais. São onze.'
  ],
  ef:{flag:['achou_a_trilha_antiga','achou_os_marcos'], instabilidade:1,
      registrar:'Uma trilha antiga com marcos de pedra. No terceiro, onze riscos verticais e um horizontal.'},
  escolhas:[
    {texto:'Seguir contando os marcos.', vai:'c22_contou_os_marcos'},
    {texto:'Cavar embaixo do marco.', vai:'c22_cavou_o_marco'},
    {texto:'Seguir em frente pela trilha.', vai:'c22_primeiro_dia'}
  ]
},

c22_contou_os_marcos:{
  texto:[
    'São nove marcos até a lomba.',
    'Os quatro primeiros não têm nada gravado. Do quinto em diante, todos têm.',
    'Quinto: quatro riscos. Sexto: seis. Sétimo: onze, com o risco horizontal. Oitavo: seis de novo. Nono: seis, e o risco horizontal atravessando.',
    'Quatro, seis, onze, seis, seis.',
    'Você fica um tempo com esses números até entender o que está olhando, e quando entende, senta na pedra.',
    'É uma contagem de quem subiu. E o risco horizontal é quem não desceu.'
  ],
  ef:{flag:['entendeu_os_marcos'], instabilidade:2, moral:-2,
      registrar:'Os marcos contam quem subiu: 4, 6, 11, 6, 6. O risco horizontal é quem não desceu.'},
  escolhas:[
    {texto:'Riscar o seu próprio no décimo marco.', vai:'c22_riscou_o_seu'},
    {texto:'Cavar embaixo de um marco.', vai:'c22_cavou_o_marco'},
    {texto:'Seguir.', vai:'c22_primeiro_dia'}
  ]
},

c22_riscou_o_seu:{
  texto:[
    'O décimo marco não existe. Você faz um.',
    'Leva quarenta minutos empilhando pedra até ficar na altura dos outros, e depois procura uma laje, e a laje leva mais vinte.',
    'Você risca um traço vertical com a ponta da faca. Um.',
    'E fica olhando para ele por um tempo comprido, porque um traço vertical sozinho numa laje é a coisa mais franca que você já escreveu.'
  ],
  ef:{flag:'fez_o_decimo_marco', moral:2,
      rep:{eixo:'bom',delta:1,motivo:'Fez um marco novo e riscou um traço só'},
      registrar:'Fez o décimo marco e riscou um traço vertical.'},
  escolhas:[{texto:'Seguir.', vai:'c22_primeiro_dia'}]
},

c22_cavou_o_marco:{
  texto:[
    'Você desmonta a base do sétimo marco, o dos onze riscos, e cava.',
    'A quarenta centímetros tem uma lata de biscoito enferrujada.',
    'Dentro: fósforos secos, um coto de vela, e um caderninho de bolso com a capa comida de umidade.',
    'A primeira página diz: se você achou isso, você subiu pelo leste, e quem sobe pelo leste não é da Liga.',
    'A segunda página tem um desenho tosco do vale com dois X marcados nas bordas e um círculo no fundo.',
    'A terceira e última tem uma frase: o círculo não é caverna. O círculo é o que sobrou de uma coisa que desceu.'
  ],
  ef:{flag:['achou_a_lata','sabe_do_circulo'], instabilidade:2,
      itens:{'Caderninho da lata de biscoito':1},
      rep:{eixo:'bom',delta:2,motivo:'Cavou embaixo de um marco em vez de passar por ele'},
      registrar:'Um caderninho enterrado: o círculo no fundo do vale é o que sobrou de uma coisa que desceu.'},
  escolhas:[
    {texto:'Continuar contando os marcos.', vai:'c22_contou_os_marcos'},
    {texto:'Seguir.', vai:'c22_primeiro_dia'}
  ]
},

c22_o_acidente:{
  texto:[
    'O acidente da primeira equipe foi na descida, na estrada de terra, na segunda curva depois do posto.',
    'Dezoito meses de chuva não apagaram o lugar, porque a árvore que o carro pegou continua ali com a casca arrancada de um lado.',
    'Alguém pregou uma cruz de madeira, pequena, e alguém repintou a cruz recentemente, porque a tinta está viva.',
    'Você fica um tempo e depois se agacha para ver o nome.',
    'É um nome de mulher e uma data de dezoito meses atrás, e embaixo, escrito com pincel fino por outra mão: ELA VOLTOU.'
  ],
  ef:{flag:['viu_a_cruz'], instabilidade:1, moral:-2,
      registrar:'Uma cruz na curva, com o nome da agente que morreu na descida, e a frase ELA VOLTOU.'},
  escolhas:[
    {texto:'Perguntar no posto quem repinta a cruz.', vai:'c22_quem_repinta'},
    {texto:'Subir.', vai:'c22_primeiro_dia'}
  ]
},

c22_quem_repinta:{
  texto:[
    '"Eu."',
    'O Sr. Poplar diz isso sem nenhum floreio, do jeito que se diz que a gente varre a própria calçada.',
    '"De ano em ano, no aniversário. Com tinta de esmalte, que aguenta."',
    '"E a frase?"',
    '"A frase foi ideia minha e eu apanhei por isso." Ele enche a caneca. "A Liga mandou um ofício pedindo que eu retirasse, porque é impróprio. Eu respondi que a cruz é minha, que a tinta é minha, e que o terreno é público."',
    'Ele bebe.',
    '"Eu botei porque ela voltou. Eles mandaram três equipes e falam das que não voltaram, e ninguém nunca escreveu em lugar nenhum que essa aqui voltou."'
  ],
  ef:{flag:['ela_voltou'], moral:3,
      npc:{nome:'Sr. Emory Poplar', opiniao:3, memoria:'Repinta a cruz todo ano e brigou com a Liga pela frase.'},
      rep:{eixo:'bom',delta:1,motivo:'Perguntou quem cuidava da cruz'},
      registrar:'O Sr. Poplar repinta a cruz todo ano e escreveu ELA VOLTOU contra um ofício da Liga.'},
  escolhas:[
    {texto:'Perguntar das seis linhas em branco.', vai:'c22_as_quatro_linhas'},
    {texto:'Subir.', vai:'c22_primeiro_dia'}
  ]
},

c22_primeiro_dia:{
  texto:[
    'O primeiro dia é só cansaço.',
    'Pedra, subida, vento, e a mesma vista virando devagar à sua esquerda.',
    d=>`Às quatro da tarde você passa ${d.flags.sabe_da_lomba ? 'a lomba que o Sr. Poplar apontou' : 'uma lomba de pedra'}, e a partir dali é diferente, e a diferença leva quarenta minutos para você nomear.`,
    'Não tem Pokémon.',
    'Nenhum. Nem inseto, nem Pidgey, nem barulho de coisa pequena fugindo do lado da trilha.',
    d=>{
      const inst = d.mundo.instabilidade;
      if (inst >= 7) return 'E o silêncio não é silêncio: é um zumbido baixo, contínuo, que você só percebe quando tapa um ouvido e ele continua.';
      if (inst >= 4) return 'E a temperatura oscila doze graus em vinte minutos, duas vezes, sem nenhum motivo.';
      if (inst >= 1) return 'E o vento fica errado: constante, sem rajada, sempre do mesmo lado. Vento não faz isso.';
      return 'E é só silêncio mesmo, o que de alguma maneira é pior.';
    }
  ],
  ef:{flag:'passou_a_lomba', instabilidade:1,
      registrar:'Passou a lomba. Acima dela não tem Pokémon nenhum.'},
  escolhas:[
    {texto:'Acampar aqui e observar a noite.', vai:'c22_acampou'},
    {texto:'Andar mais duas horas antes de parar.', vai:'c22_andou_mais'},
    {texto:'Usar o binóculo no vale à distância.', vai:'c22_binoculo_no_vale', cond:d=>!!d.flags.tem_o_binoculo},
    {texto:'Continuar até achar o acampamento da equipe.', vai:'c22_terceira_equipe'}
  ]
},

c22_acampou:{
  texto:[
    'Você acampa num ponto alto e passa a noite acordad{o|a} olhando o vale a dois quilômetros.',
    'Às duas da manhã, uma luz azul acende no fundo do vale e apaga. Uma vez só, e dura menos de um segundo.',
    'Às três e dez você percebe que está com fome e que não jantou, e que não sentiu fome antes disso, e que isso é estranho.',
    'Às quatro e quarenta, alguma coisa cruza o céu acima do vale: grande, rápida, e reta demais para ser um Fearow.',
    'De manhã você desce sabendo três coisas a mais e com quatro horas a menos de sono.'
  ],
  ef:{flag:'observou_o_vale', hp:-2, causa:'Noite em claro no norte', instabilidade:1,
      registrar:'Luz azul às 2h. Alguma coisa cruzando o céu às 4h40.'},
  escolhas:[
    {texto:'Usar o binóculo agora, de manhã.', vai:'c22_binoculo_no_vale', cond:d=>!!d.flags.tem_o_binoculo},
    {texto:'Descer para o acampamento da equipe.', vai:'c22_terceira_equipe'},
    {texto:'Descer direto ao vale.', vai:'c22_encontro'}
  ]
},

c22_andou_mais:{
  texto:[
    'Você anda duas horas a mais e para às seis e vinte, quando a luz acaba de vez.',
    'Monta sozinh{o|a}, come sem fome e deita.',
    'E aí acontece uma coisa pequena e horrível: você acorda às onze e quarenta da noite achando que dormiu a noite inteira, e você dormiu quarenta minutos.',
    'Você confere o relógio três vezes.',
    'Depois disso não dorme mais.'
  ],
  ef:{flag:'a_noite_curta', hp:-2, causa:'Noite ruim no norte', instabilidade:1,
      registrar:'Dormiu quarenta minutos e acordou achando que tinha sido a noite inteira.'},
  escolhas:[
    {texto:'Usar o binóculo assim que clarear.', vai:'c22_binoculo_no_vale', cond:d=>!!d.flags.tem_o_binoculo},
    {texto:'Seguir para o acampamento da equipe.', vai:'c22_terceira_equipe'},
    {texto:'Ir direto ao vale.', vai:'c22_encontro'}
  ]
},

c22_binoculo_no_vale:{
  texto:[
    'Você deita na pedra e aponta o binóculo do pai do Sr. Poplar para o fundo do vale.',
    'A lente é velha e tem uma mancha no canto, e mesmo assim dá para ver.',
    'Dois vultos grandes, um em cada borda, parados.',
    'Os dois virados para o mesmo lado, que é a parede de pedra do fundo.',
    'E no fundo, no ponto para onde os dois olham, uma abertura escura numa parede lisa demais.',
    'Você fica vinte minutos olhando e nenhum dos dois se mexe uma vez.'
  ],
  ef:{flag:['viu_pelo_binoculo'], instabilidade:1,
      registrar:'Do alto, os dois vultos não se mexem por vinte minutos. Os dois olham a mesma abertura.'},
  escolhas:[
    {texto:'Procurar o acampamento da equipe pelo binóculo.', vai:'c22_achou_pelo_binoculo'},
    {texto:'Descer para o acampamento.', vai:'c22_terceira_equipe'},
    {texto:'Descer direto ao vale.', vai:'c22_encontro'}
  ]
},

c22_achou_pelo_binoculo:{
  texto:[
    'Você varre a encosta e acha.',
    'O acampamento fica a uns quatrocentos metros da borda do vale, e são três barracas montadas em triângulo, com uma mesa dobrável no meio.',
    'E, a uns duzentos metros do acampamento, numa depressão de pedra, três pontos pequenos que não se mexem.',
    'Você olha por quatro minutos e eles não se mexem.',
    'No quinto minuto, um deles levanta o braço e coça a cabeça, e você solta o ar sem perceber que estava segurando.'
  ],
  ef:{flag:['achou_o_acampamento_de_longe'],
      registrar:'Viu o acampamento e os três, sentados numa depressão de pedra, virados para o vale.'},
  escolhas:[
    {texto:'Descer para o acampamento.', vai:'c22_terceira_equipe'},
    {texto:'Ir direto até os três.', vai:'c22_achou_equipe'},
    {texto:'Descer direto ao vale.', vai:'c22_encontro'}
  ]
},

/* ── O acampamento da terceira equipe ───────────────────── */
c22_terceira_equipe:{
  texto:[
    'A cerca de um quilômetro do vale você acha o acampamento da terceira equipe.',
    'Está montado. Três barracas em triângulo, de pé, com as portas fechadas e o zíper subido. Fogareiro. Equipamento em cima de uma lona.',
    'Nada revirado, nada quebrado, nada saqueado, e todo o material de valor à mostra.',
    'Tem café numa térmica que ainda está morna.',
    'Não tem ninguém.',
    'Num caderno em cima da mesa dobrável, a última anotação, com letra tranquila:',
    '**Dia 4. Ele nos deixou entrar. Vamos descer amanhã. O R. quer voltar e avisar; nós três queremos descer. Decidimos no par ou ímpar. Ganhou descer.**'
  ],
  ef:{flag:'achou_o_acampamento',
      registrar:'Encontrou o acampamento intacto da terceira equipe. Ninguém.'},
  escolhas:[
    {texto:'Ler o caderno desde o começo.', vai:'c22_pegou_caderno_equipe'},
    {texto:'Abrir as barracas.', vai:'c22_as_barracas'},
    {texto:'Olhar o equipamento na lona.', vai:'c22_o_equipamento'},
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'},
    {texto:'Ir direto ao vale.', vai:'c22_encontro'}
  ]
},

c22_pegou_caderno_equipe:{
  texto:[
    'Você folheia para trás.',
    '**Dia 1. Chegamos. O vale tem dois guardas. Não são hostis. Não nos impedem.**',
    '**Dia 2. Eles não estão impedindo a gente de entrar. Eles estão impedindo alguma coisa de sair. Isso muda o cálculo inteiro.**',
    '**Dia 3. Ouvimos uma voz. Não com o ouvido. Ela perguntou o que a gente queria e ninguém soube responder e ela não insistiu.**',
    '**Dia 4. Ele nos deixou entrar.**',
    'Depois disso são páginas em branco. Vinte e duas folhas, todas em branco, e na última, no canto inferior, quase invisível, um risco de lápis que alguém fez sem querer ao apoiar a mão.'
  ],
  ef:{flag:['leu_caderno_equipe','caderno_da_equipe'],
      itens:{'Caderno da terceira equipe':1},
      registrar:'A terceira equipe foi convidada a entrar. O caderno para no dia 4.'},
  escolhas:[
    {texto:'Olhar as folhas em branco contra a luz.', vai:'c22_contra_a_luz'},
    {texto:'Abrir as barracas.', vai:'c22_as_barracas'},
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_contra_a_luz:{
  texto:[
    'Você levanta as folhas em branco contra o céu, uma por uma, procurando marca de lápis apagado ou de pressão da folha de cima.',
    'Nas dezenove primeiras não tem nada.',
    'Na vigésima tem: a marca de pressão de uma escrita que foi feita numa folha que depois foi arrancada.',
    'Dá para ler quatro palavras inteiras e o formato do resto.',
    '**AINDA NÃO SEI RESPONDER.**',
    'E, embaixo, na linha seguinte, uma palavra só, escrita com muita força: AMANHÃ.'
  ],
  ef:{flag:['leu_a_marca_no_papel'], instabilidade:2,
      rep:{eixo:'bom',delta:1,motivo:'Olhou vinte e duas folhas em branco contra a luz'},
      registrar:'Marca de pressão numa folha arrancada: ainda não sei responder. Amanhã.'},
  escolhas:[
    {texto:'Abrir as barracas.', vai:'c22_as_barracas'},
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_as_barracas:{
  texto:[
    'As três barracas estão fechadas por dentro do jeito que se fecha quando se vai voltar: zíper subido até em cima e o duplo puxador pendurado.',
    'Na primeira: saco de dormir aberto, uma muda de roupa dobrada, um livro de bolso marcado na página 140.',
    'Na segunda: saco de dormir enrolado e amarrado, mochila fechada, tudo arrumado como quem foi criado assim.',
    'Na terceira: saco de dormir aberto, uma foto presa com fita na parede da barraca, e um rádio portátil desligado com pilha nova.',
    'A foto é de duas crianças num quintal.'
  ],
  ef:{flag:'abriu_as_barracas', instabilidade:1,
      registrar:'Três barracas fechadas por dentro do jeito de quem vai voltar.'},
  escolhas:[
    {texto:'Ligar o rádio.', vai:'c22_ligou_o_radio'},
    {texto:'Ver o livro marcado na página 140.', vai:'c22_o_livro'},
    {texto:'Olhar o equipamento na lona.', vai:'c22_o_equipamento'},
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'}
  ]
},

c22_ligou_o_radio:{
  texto:[
    'O rádio liga no primeiro clique, com pilha nova, e pega uma emissora com muito chiado.',
    'É o programa das seis da manhã de uma rádio comunitária de Fuchsia, e a locutora está lendo pedidos de emprego de ouvintes.',
    'Você fica ouvindo dois minutos inteiros, no meio da pedra, a duzentos quilômetros de Fuchsia, sozinh{o|a}, num acampamento vazio.',
    d=>d.flags.contato_nadia
      ? 'E você reconhece a voz.'
      : 'É a voz de uma mulher que fala devagar e lê nome completo e endereço de cada um.',
    'Você desliga e a pedra fica silenciosa outra vez, e agora é pior, porque agora é uma escolha sua.'
  ],
  ef:{flag:'ligou_o_radio', moral:1,
      registrar:'O rádio da terceira barraca ainda pega a rádio de Fuchsia.'},
  escolhas:[
    {texto:'Deixar o rádio ligado e ir.', vai:'c22_deixou_ligado'},
    {texto:'Ver o livro marcado.', vai:'c22_o_livro'},
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'}
  ]
},

c22_deixou_ligado:{
  texto:[
    'Você liga de novo, aumenta um pouco o volume e deixa em cima da mesa dobrável, virado para o vale.',
    'Não faz sentido nenhum e você faz mesmo assim.',
    'Durante o resto do dia, de onde você estiver, vai dar para ouvir um chiado com voz humana no meio do nada, e isso vai ser a coisa mais útil que você trouxe.'
  ],
  ef:{flag:'deixou_o_radio_ligado', moral:2,
      rep:{eixo:'bom',delta:1,motivo:'Deixou uma voz humana tocando num acampamento vazio'},
      registrar:'Deixou o rádio ligado em cima da mesa, virado para o vale.'},
  escolhas:[
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_o_livro:{
  texto:[
    'É um romance policial de banca, com a lombada quebrada e o preço a lápis na primeira página.',
    'A página 140 está marcada com um bilhete de ônibus.',
    'No verso do bilhete, escrito a caneta, com a letra apertada de quem escreve em cima do joelho:',
    'Se eu não voltar: a senha do cofre é o aniversário da Nell. Não deixem a minha mãe assinar nada sem advogado. E digam a ela que eu não estava com medo, porque eu não estou.',
    'Não tem assinatura e não tem data.',
    'Você põe o bilhete de volta na página 140 e fecha o livro com cuidado, e depois fica um tempo com a mão em cima da capa.'
  ],
  ef:{flag:['leu_o_bilhete_do_livro'], instabilidade:1, moral:-2,
      registrar:'Um bilhete na página 140: se eu não voltar, digam a ela que eu não estava com medo.'},
  escolhas:[
    {texto:'Levar o bilhete para entregar.', vai:'c22_levou_o_bilhete'},
    {texto:'Deixar exatamente onde estava.', vai:'c22_deixou_o_bilhete'},
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'}
  ]
},

c22_levou_o_bilhete:{
  texto:[
    'Você tira o bilhete e guarda no bolso de dentro, e no lugar dele deixa um pedaço de papel do seu caderno dizendo onde o original está e quem levou.',
    'Se essa pessoa voltar, vai achar o recado.',
    'Se não voltar, alguém vai entregar o bilhete à mãe dela, e vai ser você.'
  ],
  ef:{flag:'tem_o_bilhete_do_livro', itens:{'Bilhete de ônibus escrito no verso':1}, moral:2,
      rep:{eixo:'bom',delta:2,motivo:'Assumiu entregar o bilhete e deixou recado no lugar'},
      registrar:'Levou o bilhete e deixou um recado explicando quem levou.'},
  escolhas:[
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_deixou_o_bilhete:{
  texto:[
    'Você põe tudo no lugar exato: o bilhete na página 140, o livro na mesma posição, a barraca fechada com o zíper até em cima e o duplo puxador pendurado do mesmo jeito.',
    'É o único respeito que se pode ter por uma barraca fechada por dentro de quem ia voltar.'
  ],
  ef:{moral:1, rep:{eixo:'bom',delta:1,motivo:'Deixou tudo exatamente como estava'},
      registrar:'Deixou o acampamento exatamente como encontrou.'},
  escolhas:[
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_o_equipamento:{
  texto:[
    'O equipamento está sobre uma lona, organizado por tipo, do jeito que só fica quando alguém tem método.',
    'Cordas. Ganchos. Um teodolito de campanha. Dois medidores que você não reconhece. Uma caixa de baterias.',
    'E um deles, um aparelho do tamanho de um livro com uma agulha e um mostrador, está ligado e continua marcando.',
    'A agulha está encostada no fim da escala e tem uma fita adesiva colada no vidro com uma anotação a caneta.',
    '**Desde dia 2. Não é defeito. Trocamos o aparelho.**'
  ],
  ef:{flag:['viu_o_aparelho'], instabilidade:2,
      registrar:'Um medidor da terceira equipe está com a agulha no fim da escala desde o dia 2. Não é defeito.'},
  escolhas:[
    {texto:'Levar o aparelho.', vai:'c22_levou_o_aparelho'},
    {texto:'Procurar a mochila do Vernon.', vai:'c22_a_mochila_do_nogueira', cond:d=>!!d.flags.procura_o_nogueira},
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_levou_o_aparelho:{
  texto:[
    'Você desprende o aparelho e leva, e ele continua marcando o fim da escala o caminho inteiro.',
    'Não serve para nada, porque você não sabe o que ele mede.',
    'Serve para uma coisa, que é esta: quando a agulha cair, você vai saber que saiu.'
  ],
  ef:{flag:'tem_o_aparelho', itens:{'Medidor com a agulha no fim da escala':1},
      registrar:'Levou o medidor. Quando a agulha cair, você saiu.'},
  escolhas:[
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_a_mochila_do_nogueira:{
  texto:[
    'A mochila do Vernon não está aqui, porque ele era da segunda equipe e a segunda equipe desceu.',
    'Mas tem uma coisa que você não esperava, encostada na perna da mesa dobrável, dentro de um saco plástico de mercado bem amarrado.',
    'É um casaco impermeável azul, tamanho grande, com a etiqueta da Liga costurada no peito.',
    'No bolso de cima, do lado de dentro, uma medalha de natação de participação infantil, com uma fita azul e branca desbotada.',
    'A terceira equipe achou. E não desceu com ela.',
    'Do lado, preso ao saco com um elástico, um bilhete: achamos no dia 2, a 60 m da entrada. Fica aqui para quem vier atrás. Não é nosso para levar.'
  ],
  ef:{flag:['achou_a_medalha'], instabilidade:1, moral:-2,
      itens:{'Medalha de natação da filha do Vernon':1},
      rep:{eixo:'bom',delta:2,motivo:'A medalha estava esperando quem viesse atrás, e veio você'},
      registrar:'A medalha do Vernon estava no acampamento, guardada para quem viesse atrás.'},
  escolhas:[
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_procurou_equipe:{
  texto:['Você procura em volta do acampamento por três horas, em círculos cada vez maiores, marcando o caminho com pedra.'],
  teste:{status:'percepcao', dificuldade:8, nomeStatus:'Percepção',
         critico:'c22_achou_equipe', sucesso:'c22_achou_equipe', parcial:'c22_achou_pegadas', falha:'c22_nao_achou'}
},

c22_achou_equipe:{
  texto:[
    'Você acha os três. Vivos.',
    'Estão sentados numa depressão de pedra a quatrocentos metros do acampamento, os três, virados para o vale.',
    'Eles te veem chegar e não reagem muito. Um deles acena devagar.',
    d=>fala(d.jogador.nome, 'Faz quanto tempo que vocês estão aqui?'),
    /* o nome dela está na jaqueta da Liga: é a primeira coisa que tem
       nome naquela pedra, e é o que a equipe esqueceu de usar */
    d=>{ Nomes.apresentar('a mulher de trinta');
         return 'Quem se vira pra responder é uma mulher de uns trinta anos, com a jaqueta da Liga fechada até o pescoço e uma fita de nome costurada no peito, desbotada de sol: **TESSA RUE · EQUIPE 3**.'; },
    fala('a mulher de trinta', 'Não sei. Uma semana?', null, 'Os outros dois assentem.'),
    fala('a mulher de trinta', 'É. Parecia menos.'),
    'Eles não estão feridos, não estão drogados e não estão presos. Eles estão esperando, e não sabem dizer o quê, e quando você pergunta eles ficam sinceramente confusos com a pergunta.'
  ],
  ef:{flag:'achou_a_equipe',
      rep:{eixo:'bom',delta:2,motivo:'Encontrou a terceira equipe viva'},
      registrar:'Encontrou os três da terceira equipe, vivos, sentados olhando o vale.'},
  escolhas:[
    {texto:'"Faz quatro meses."', vai:'c22_faz_quatro_meses'},
    {texto:'Perguntar o que eles ouviram.', vai:'c22_o_que_ouviram'},
    {texto:'Tirar eles dali à força.', vai:'c22_tirou_equipe'},
    {texto:'Sentar com eles e olhar o vale também.', vai:'c22_sentou_com_eles'},
    {texto:'Deixar eles e ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_faz_quatro_meses:{
  texto:[
    d=>fala(d.jogador.nome, 'Faz quatro meses.'),
    'Os três olham para você e a mulher de trinta ri, de leve, do jeito que se ri de uma piada que não é boa.',
    fala('a mulher de trinta', 'Não faz.'),
    'Você tira o caderno, mostra a data de hoje, mostra a anotação do dia 4 que está no caderno deles.',
    'Eles conferem. Os três, um por um, com cuidado.',
    'E aí acontece uma coisa lenta e horrível: o rosto dos três muda ao mesmo tempo e nenhum deles fala nada por uns quarenta segundos.',
    fala('o mais novo', 'Quatro meses.', 'baixo', 'A voz dele sai errada.')
  ],
  ef:{flag:['contou_o_tempo_pra_equipe'], instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Mostrou a data a três pessoas que tinham perdido a conta'},
      registrar:'Mostrou à terceira equipe que faziam quatro meses. Eles conferiram um por um.'},
  escolhas:[
    {texto:'"Vocês vão descer comigo agora."', vai:'c22_descem_comigo'},
    {texto:'Perguntar o que eles ouviram.', vai:'c22_o_que_ouviram'},
    {texto:'Deixar que eles decidam.', vai:'c22_eles_decidem'}
  ]
},

c22_descem_comigo:{
  texto:[
    '"Vocês vão descer comigo agora."',
    'O mais novo levanta na hora, e é quase um alívio ver alguém obedecer depressa.',
    'A mulher de trinta demora, e o terceiro, que não falou nada até agora, não levanta.',
    '"Eu fico."',
    'Ele diz isso olhando o vale, sem desafio nenhum.',
    '"Eu estou aqui há quatro meses e eu acabei de descobrir isso, e eu vou te dizer a única coisa que eu tenho certeza: se eu descer agora, eu volto amanhã."',
    'Ele finalmente olha para você.',
    '"Eu prefiro descer quando eu souber responder."'
  ],
  ef:{flag:['dois_vao_descer'], instabilidade:1,
      registrar:'Dois da terceira equipe aceitaram descer. Um não.'},
  escolhas:[
    {texto:'Descer os dois até o posto e voltar.', vai:'c22_desceu_os_dois'},
    {texto:'"Então me diz o que ele perguntou."', vai:'c22_o_que_ouviram'},
    {texto:'Levar os três à força.', vai:'c22_tirou_equipe'}
  ]
},

c22_desceu_os_dois:{
  texto:[
    'Você desce os dois até o posto florestal, e leva sete horas, e ninguém fala quase nada no caminho.',
    'No posto, o Sr. Poplar não faz nenhuma pergunta. Ele põe café, tira dois cobertores do armário e escreve duas datas na terceira coluna do livro.',
    'Depois acompanha você até a porta.',
    fala('Sr. Emory Poplar', '{O senhor|A senhora} vai subir de novo.'),
    d=>fala(d.jogador.nome, 'Vou.'),
    fala('Sr. Emory Poplar', 'Então eu escrevo a sua data de subida outra vez, porque tem que constar.', null, 'Ele assente.'),
    'E escreve.'
  ],
  ef:{flag:['desceu_dois'], hp:-4, causa:'Sete horas de descida e a subida de volta',
      rep:{eixo:'bom',delta:3,motivo:'Desceu duas pessoas e subiu de novo'},
      npc:{nome:'Sr. Emory Poplar', opiniao:3, memoria:'Escreveu a sua data de subida duas vezes no mesmo livro.'},
      registrar:'Desceu dois da terceira equipe até o posto e subiu de novo.'},
  escolhas:[
    {texto:'Subir e ir ao vale.', vai:'c22_encontro'},
    {texto:'Subir e falar com o que ficou.', vai:'c22_o_que_ficou'}
  ]
},

c22_o_que_ficou:{
  texto:[
    'Ele está exatamente onde estava, na mesma depressão de pedra, na mesma posição.',
    'Você senta ao lado dele sem pedir licença.',
    'Passam uns bons dois minutos.',
    fala('o que ficou', 'Eles chegaram bem?'),
    d=>fala(d.jogador.nome, 'Chegaram.'),
    'Ele assente.',
    fala('o que ficou', 'Eu sei o que {o senhor|a senhora} está pensando e está cert{o|a}.', null, 'Ele não tira os olhos do vale.'),
    fala('o que ficou', 'Eu sei que estou esperando uma coisa que talvez não venha, e que quatro meses é muito, e que a minha filha faz aniversário em novembro.'),
    'Ele encolhe os ombros.',
    fala('o que ficou', 'E mesmo assim eu não consigo descer sem responder. É assim que é. Eu não sei explicar melhor e eu já tentei muito.')
  ],
  ef:{flag:['falou_com_o_que_ficou'], instabilidade:1, moral:-1,
      npc:{nome:'o que ficou', opiniao:2, memoria:'Não consegue descer sem responder, e sabe disso.'},
      registrar:'Um dos três não consegue descer sem ter respondido.'},
  escolhas:[
    {texto:'"Então eu respondo por você."', vai:'c22_respondo_por_voce'},
    {texto:'Perguntar o que foi perguntado.', vai:'c22_o_que_ouviram'},
    {texto:'Deixar ele e ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_respondo_por_voce:{
  texto:[
    d=>fala(d.jogador.nome, 'Então eu respondo por você.'),
    'Ele vira a cabeça pela primeira vez.',
    fala('o que ficou', '{O senhor|A senhora} não pode responder por mim.'),
    d=>fala(d.jogador.nome, 'Eu posso descer e perguntar se ele ainda quer a resposta.'),
    'Ele fica quieto muito tempo.',
    'Depois tira do bolso um papel dobrado, pequeno, gasto nas dobras de tanto abrir e fechar.',
    fala('o que ficou', 'Então leva isso.', null, 'Ele entrega.'),
    fala('o que ficou', 'Eu escrevi no dia dez e eu reescrevi quarenta vezes e essa é a versão que eu não mudo há três semanas.')
  ],
  ef:{flag:['leva_a_resposta_dele','vai_responder'],
      itens:{'A resposta dobrada quarenta vezes':1}, moral:3,
      npc:{nome:'o que ficou', opiniao:4, memoria:'Te deu a resposta que ele reescreveu quarenta vezes.'},
      rep:{eixo:'bom',delta:2,motivo:'Aceitou levar a resposta de outra pessoa'},
      registrar:'Está levando a resposta que um deles escreveu quarenta vezes.'},
  escolhas:[
    {texto:'Ler o papel.', vai:'c22_leu_a_resposta'},
    {texto:'Não ler. Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_leu_a_resposta:{
  texto:[
    'Você abre no caminho, o que provavelmente é errado.',
    'O papel tem uma linha só, escrita com muito cuidado, com a letra endireitada de quem quis que ficasse bonito.',
    '**Eu queria que a minha filha não tivesse medo de Pokémon grande.**',
    'Você lê três vezes.',
    'Não é bonito, não é profundo e não é o que a Liga chamaria de objetivo de missão.',
    'É só verdade, e levou quatro meses e quarenta versões para chegar nessa forma.'
  ],
  ef:{flag:'leu_a_resposta_dele', moral:2, instabilidade:1,
      registrar:'A resposta dele: eu queria que a minha filha não tivesse medo de Pokémon grande.'},
  escolhas:[{texto:'Descer ao vale.', vai:'c22_encontro'}]
},

c22_eles_decidem:{
  texto:[
    'Você não decide por eles.',
    'Você mostra a data, senta, e espera, e eles conversam entre si por quase uma hora, baixo, do jeito que colegas de trabalho conversam.',
    'No fim, dois decidem descer e um decide ficar, e eles se abraçam de um jeito desengonçado antes de se separar, porque as três são pessoas que trabalham juntas e não sabem fazer isso.',
    'Os dois descem sozinhos, sem você, porque conhecem o caminho e porque é a decisão deles.',
    'O terceiro fica sentado onde estava.'
  ],
  ef:{flag:['eles_decidiram','dois_vao_descer'],
      rep:{eixo:'bom',delta:3,motivo:'Deixou três adultos decidirem por si depois de dar a informação'},
      registrar:'Dois desceram por decisão própria. Um ficou.'},
  escolhas:[
    {texto:'Falar com o que ficou.', vai:'c22_o_que_ficou'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_sentou_com_eles:{
  texto:[
    'Você senta na depressão de pedra com os três e olha o vale também.',
    'Não acontece nada.',
    'Passam vinte minutos, e depois quarenta, e a certa altura você percebe que parou de pensar e que isso é agradável, e é exatamente aí que você se levanta de um pulo.',
    'A mulher de trinta te olha de baixo.',
    fala('a mulher de trinta', 'É.', null, 'Ela não parece surpresa.'),
    fala('a mulher de trinta', 'É assim mesmo. No começo a gente levanta.')
  ],
  ef:{flag:'sentou_com_a_equipe', instabilidade:2, moral:-2,
      registrar:'Sentou com eles e levou quarenta minutos para perceber que tinha parado de pensar.'},
  escolhas:[
    {texto:'"Faz quatro meses."', vai:'c22_faz_quatro_meses'},
    {texto:'Perguntar o que eles ouviram.', vai:'c22_o_que_ouviram'},
    {texto:'Tirar os três à força.', vai:'c22_tirou_equipe'}
  ]
},

c22_o_que_ouviram:{
  texto:[
    'Os três respondem ao mesmo tempo e dizem a mesma coisa com palavras diferentes:',
    fala('os três', 'Ele perguntou o que a gente queria.'),
    d=>fala(d.jogador.nome, 'E vocês responderam o quê?'),
    'Silêncio longo. A mulher de trinta finalmente fala:',
    fala('a mulher de trinta', 'A gente respondeu com o objetivo da missão. Avaliação de risco.', null, 'Ela ri sem alegria.'),
    fala('a mulher de trinta', 'A gente respondeu com o formulário.'),
    d=>fala(d.jogador.nome, 'E ele?'),
    fala('a mulher de trinta', 'Ele parou de falar com a gente. Faz cinco dias.'),
    'Ela olha para o vale.',
    fala('a mulher de trinta', 'A gente está esperando ele perguntar de novo. Para responder direito.')
  ],
  ef:{flag:'sabe_da_pergunta',
      registrar:'Ele perguntou o que eles queriam. Eles responderam com o formulário.'},
  escolhas:[
    {texto:'"E o que vocês responderiam agora?"', vai:'c22_o_que_responderiam'},
    {texto:'Tirar eles dali à força.', vai:'c22_tirou_equipe'},
    {texto:'"Faz quatro meses."', vai:'c22_faz_quatro_meses'},
    {texto:'"Eu vou responder por vocês."', vai:'c22_encontro',
     ef:{flag:'vai_responder', rep:{eixo:'bom',delta:1,motivo:'Assumiu responder o que três adultos não conseguiram'}}}
  ]
},

c22_o_que_responderiam:{
  texto:[
    d=>fala(d.jogador.nome, 'E o que vocês responderiam agora?'),
    'É a primeira vez em cinco dias, ou em quatro meses, que alguém faz essa pergunta em voz alta para eles.',
    'A mulher de trinta abre a boca e fecha.',
    'O mais novo diz "eu queria" e para no meio, e tenta de novo, e para no mesmo lugar.',
    'O terceiro não tenta.',
    'E aí a mulher de trinta diz uma coisa que muda a temperatura da pedra:',
    fala('a mulher de trinta', 'Eu acho que ninguém aqui sabe o que quer, e é por isso que a gente está sentado numa pedra há cinco dias, e eu acho que isso não tem nada a ver com ele.')
  ],
  ef:{flag:['a_pergunta_e_deles'], instabilidade:1, moral:2,
      rep:{eixo:'bom',delta:2,motivo:'Fez a pergunta que destravou três pessoas'},
      registrar:'Ninguém ali sabe o que quer, e isso pode não ter nada a ver com ele.'},
  escolhas:[
    {texto:'"Faz quatro meses."', vai:'c22_faz_quatro_meses'},
    {texto:'"Vocês vão descer comigo."', vai:'c22_descem_comigo'},
    {texto:'Deixar que eles decidam.', vai:'c22_eles_decidem'}
  ]
},

c22_tirou_equipe:{
  texto:[
    'Você levanta os três pelo braço, um por um. Eles não resistem: vão, com a mesma docilidade com que estavam sentados.',
    'A duzentos metros do acampamento, o mais novo para de repente e olha para trás.',
    fala('o mais novo', 'Espera.', null, 'A voz dele muda completamente.'),
    fala('o mais novo', 'Espera, o que —'),
    'E aí eles todos acordam, ao mesmo tempo, e o pânico chega de uma vez em três pessoas adultas.',
    'Vocês levam quatro horas para descer até o posto da Rota 10. Nenhum dos três fala nada no caminho.',
    'No posto, o Sr. Poplar olha os três, olha você, e vai pôr água no fogo sem dizer uma palavra.'
  ],
  ef:{flag:'salvou_a_equipe',
      rep:{eixo:'bom',delta:3,motivo:'Tirou três pessoas do vale antes que fosse tarde'},
      hp:-3, causa:'Descida forçada carregando gente',
      registrar:'Tirou a terceira equipe do vale. Eles acordaram a 200 metros.'},
  escolhas:[
    {texto:'Voltar sozinh{o|a} ao vale.', vai:'c22_encontro'},
    {texto:'Perguntar a eles, agora acordados, o que foi perguntado.', vai:'c22_acordados'}
  ]
},

c22_acordados:{
  texto:[
    'Acordados, no posto, com café na mão, eles contam tudo em vinte minutos e contam igual.',
    'Dia 3, à tarde, no fundo do vale. Não foi uma voz: foi uma pergunta que já estava na cabeça quando eles perceberam.',
    'O que vocês querem.',
    fala('a mulher de trinta', 'E a gente respondeu com o formulário.', null, 'Agora ela cobre os olhos com a mão.'),
    fala('a mulher de trinta', 'A gente respondeu avaliação de risco para uma coisa que perguntou o que a gente queria.'),
    'O mais novo fala baixo, olhando a caneca.',
    fala('o mais novo', 'E ele não ficou bravo. Foi pior. Ele acreditou na gente.', 'baixo')
  ],
  ef:{flag:['sabe_da_pergunta','ele_acreditou'], instabilidade:1, moral:-2,
      rep:{eixo:'bom',delta:1,motivo:'Esperou eles acordarem para perguntar'},
      registrar:'Ele não ficou bravo com a resposta do formulário. Ele acreditou.'},
  escolhas:[{texto:'Subir de volta ao vale.', vai:'c22_encontro'}]
},

c22_achou_pegadas:{
  texto:[
    'Você acha pegadas. Três pares, indo na direção do vale, sem nenhum par voltando.',
    'As pegadas são regulares, com passada normal. Ninguém correu, ninguém foi arrastado.',
    'Eles foram andando.',
    'E a uns oitenta metros, onde a pedra fica lisa e as pegadas somem, tem um cantil no chão, em pé, colocado — não caído.',
    'Alguém pôs ali de propósito, em pé, cheio, como quem deixa água para quem vem atrás.'
  ],
  ef:{flag:['achou_pegadas','achou_o_cantil'], itens:{'Cantil cheio, deixado em pé':1},
      registrar:'Três pares de pegadas indo, nenhum voltando, e um cantil cheio deixado em pé no caminho.'},
  escolhas:[
    {texto:'Seguir as pegadas.', vai:'c22_achou_equipe'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_nao_achou:{
  texto:[
    'Três horas e nada.',
    'Você volta ao acampamento e a térmica de café esfriou.',
    'Isso, por algum motivo, é a coisa mais triste do dia.',
    'Você lava a térmica, ferve água de novo e faz café, e deixa em cima da mesa dobrável, tampado.',
    'Não é para você.'
  ],
  ef:{flag:'fez_cafe_novo', moral:2,
      registrar:'Fez café novo na térmica da terceira equipe e deixou tampado na mesa.'},
  escolhas:[
    {texto:'Procurar mais uma vez.', vai:'c22_procurou_equipe'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

/* ── O vale ─────────────────────────────────────────────── */
c22_encontro:{
  texto:[
    'O vale fica entre duas paredes de pedra e não tem saída no fundo.',
    'É menor do que você imaginou. Quatrocentos metros de comprimento, talvez cento e cinquenta de largura, com o chão de cascalho e algumas moitas secas.',
    'E tem coisa demais aqui.',
    d=>{
      const a=Estado.dados.lendarios[144], z=Estado.dados.lendarios[145];
      const artPreso = a && a.estado==='capturado', zapPreso = z && z.estado==='capturado';
      if (artPreso && zapPreso) return 'Ou tinha. Os dois postos estão vazios, porque os dois guardas estão no seu cinto. A entrada da caverna, no fundo do vale, está completamente desguardada.';
      if (artPreso) return 'Zapdos está pousado numa pedra alta, sozinho, com o ar em volta zumbindo. O outro posto — o do fundo do vale — está vazio, porque quem devia estar nele está no seu cinto.';
      if (zapPreso) return 'Articuno está no fundo do vale, imóvel, e o chão embaixo dele está branco de gelo. O posto alto está vazio, porque quem devia estar nele está no seu cinto.';
      return 'Zapdos, pousado numa pedra alta, com o ar em volta zumbindo. Articuno, no fundo do vale, imóvel, com o chão branco de gelo embaixo.';
    },
    'Aves lendárias não dividem território. Nunca dividiram, em nenhum registro.',
    'Eles não estão olhando um para o outro. Estão olhando para a mesma coisa: uma abertura na parede de pedra, no fundo do vale.',
    'Eles não estão caçando. Estão montando guarda.'
  ],
  ef:{executar:d=>{ Estado.lend(144).encontros++; Estado.lend(145).encontros++;
        return [{tipo:'mundo', texto:'Articuno e Zapdos, juntos, guardando a entrada de uma caverna.'}]; },
      flag:'viu_guarda_aves', registrar:'As duas aves guardam a entrada da caverna do norte.'},
  escolhas:[
    {texto:'Ficar na borda e observar uma hora antes de descer.', vai:'c22_observou_uma_hora'},
    {texto:'Procurar o círculo no chão.', vai:'c22_o_circulo', cond:d=>!!d.flags.sabe_do_circulo},
    {texto:'Passar entre eles, devagar, sem tocar em Pokébola nenhuma.', vai:'c22_passou'},
    {texto:'Soltar as aves que você tem, aqui, nos postos delas.', vai:'c22_recolocou',
     cond:d=>Estado.lendariosCapturados().some(l=>GRUPO_AVES.includes(l.dex))},
    {texto:'Tentar capturar Zapdos.', vai:'c22_luta_zapdos',
     cond:d=>!(Estado.dados.lendarios[145]&&Estado.dados.lendarios[145].estado==='capturado')},
    {texto:'Tentar capturar Articuno.', vai:'c22_luta_articuno',
     cond:d=>!(Estado.dados.lendarios[144]&&Estado.dados.lendarios[144].estado==='capturado')},
    {texto:'Voltar. Isso é maior do que você.', vai:'c22_voltou'}
  ]
},

c22_observou_uma_hora:{
  texto:[
    'Você deita na borda e observa uma hora inteira, com o relógio no pulso virado para cima.',
    'Em uma hora, Zapdos muda de posição duas vezes, e nas duas para reajustar o ângulo do corpo em direção à mesma abertura.',
    'Articuno não se move nenhuma vez. Nem para respirar de um jeito que dê para ver.',
    'Aos quarenta e dois minutos, uma pedra pequena rola da encosta e faz barulho, e nenhum dos dois vira a cabeça na direção do barulho.',
    'Eles não estão vigiando o vale. Eles estão vigiando um ponto.',
    'E, aos cinquenta e nove minutos, você percebe a última coisa: os dois estão a exatamente a mesma distância da abertura.'
  ],
  ef:{flag:['observou_a_guarda'], instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Passou uma hora deitado na borda antes de descer'},
      registrar:'Uma hora de observação: eles vigiam um ponto, não o vale, e estão à mesma distância dele.'},
  escolhas:[
    {texto:'Procurar o círculo no chão.', vai:'c22_o_circulo', cond:d=>!!d.flags.sabe_do_circulo},
    {texto:'Contornar pela borda até ver a abertura de frente.', vai:'c22_contornou'},
    {texto:'Passar entre eles, devagar.', vai:'c22_passou'},
    {texto:'Descer e tentar capturar um deles.', vai:'c22_luta_zapdos',
     cond:d=>!(Estado.dados.lendarios[145]&&Estado.dados.lendarios[145].estado==='capturado')}
  ]
},

c22_contornou:{
  texto:[
    'Você contorna pela borda, por cima, e leva uma hora e meia para chegar ao ponto de onde dá para ver a abertura de frente.',
    'A parede do fundo é lisa. Não é lisa de erosão: é lisa de uma coisa que derreteu e esfriou, com ondulações congeladas no meio do movimento.',
    'A abertura tem uns quatro metros de altura e é perfeitamente redonda na parte de cima.',
    'E do lado de dentro, a três ou quatro metros, o chão desce numa rampa lisa.',
    'Vem de lá um calor morno, sem vento nenhum, e você sente daqui de cima, a sessenta metros, o que não deveria ser possível.'
  ],
  ef:{flag:['viu_a_abertura_de_frente'], instabilidade:1,
      registrar:'A parede do fundo não foi cavada: foi derretida e esfriada. Sai ar morno da abertura.'},
  escolhas:[
    {texto:'Procurar o círculo no chão.', vai:'c22_o_circulo', cond:d=>!!d.flags.sabe_do_circulo},
    {texto:'Descer e passar entre eles.', vai:'c22_passou'},
    {texto:'Descer e tentar capturar Articuno.', vai:'c22_luta_articuno',
     cond:d=>!(Estado.dados.lendarios[144]&&Estado.dados.lendarios[144].estado==='capturado')}
  ]
},

c22_o_circulo:{
  texto:[
    d=>d.flags.achou_a_lata ? 'O caderninho da lata falava de um círculo, e o círculo existe.' : 'No chão do vale tem um círculo.',
    'Fica a uns cinquenta metros da abertura, no chão de cascalho, e só dá para ver de cima: é uma área de uns doze metros de diâmetro onde o cascalho está vitrificado.',
    'Não é queimado. É vidro. Areia que virou vidro e esfriou, com bolhas paradas dentro.',
    'No meio do círculo tem uma depressão rasa, do tamanho de um corpo grande deitado.',
    'E, na borda do círculo, meio enterradas no vidro, tem sucata: parafuso, chapa retorcida, um pedaço de tubo, tudo do mesmo metal e tudo com a mesma marca de fábrica.',
    'A marca de fábrica é a da Silph.'
  ],
  ef:{flag:['viu_o_circulo','achou_a_sucata'], instabilidade:2,
      rep:{eixo:'bom',delta:2,motivo:'Achou o círculo que o caderninho da lata marcava'},
      registrar:'Um círculo de doze metros de areia vitrificada, com sucata da Silph na borda.'},
  escolhas:[
    {texto:'Pegar um pedaço da sucata.', vai:'c22_pegou_sucata'},
    {texto:'Deitar na depressão.', vai:'c22_deitou_na_depressao'},
    {texto:'Descer e passar entre eles.', vai:'c22_passou'},
    {texto:'Voltar para a borda.', vai:'c22_encontro'}
  ]
},

c22_pegou_sucata:{
  texto:[
    'Você solta um pedaço de chapa do vidro com a faca e leva quarenta minutos, porque o vidro segura.',
    'A chapa tem uns vinte centímetros e ainda dá para ler parte de uma numeração estampada e um símbolo.',
    'SPH e três dígitos, e o terceiro dígito é um 1.',
    d=>d.flags.viu_os_doze
      ? 'Você já viu essa numeração. Estava estampada na base de doze tanques, num andar que foi lacrado.'
      : 'Você não sabe o que é e sabe muito bem de onde vem.',
    'Alguma coisa da Silph esteve aqui, e alguma coisa aconteceu com ela.'
  ],
  ef:{flag:['tem_a_sucata'], itens:{'Chapa de metal com marca da Silph':1}, instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Trouxe do vale a única prova material que existe'},
      registrar:'Uma chapa com numeração SPH, arrancada do vidro do círculo.'},
  escolhas:[
    {texto:'Deitar na depressão.', vai:'c22_deitou_na_depressao'},
    {texto:'Descer e passar entre eles.', vai:'c22_passou'},
    {texto:'Voltar para a borda.', vai:'c22_encontro'}
  ]
},

c22_deitou_na_depressao:{
  texto:[
    'Você deita na depressão do meio do círculo, e ela é grande demais para você, e as bordas ficam a meio metro de cada lado.',
    'O vidro é morno. Depois de tantos anos, ainda é morno.',
    'Você fica deitad{o|a} olhando o céu entre duas paredes de pedra, que daqui é uma faixa comprida e nada mais.',
    'E aí uma coisa muito simples e muito ruim ocorre a você: quem esteve deitado aqui olhou exatamente para isto.',
    'Uma faixa de céu entre duas paredes, e nada mais, por muito tempo.'
  ],
  ef:{flag:'deitou_no_circulo', instabilidade:2, moral:-2,
      registrar:'Deitou na depressão do círculo. O vidro ainda é morno.'},
  escolhas:[
    {texto:'Levantar e passar entre eles.', vai:'c22_passou'},
    {texto:'Pegar um pedaço da sucata.', vai:'c22_pegou_sucata'},
    {texto:'Voltar para a borda.', vai:'c22_encontro'}
  ]
},

c22_passou:{
  texto:[
    'Você desce e anda pelo meio do vale.',
    'Os dois te acompanham com a cabeça, sem sair do lugar. Você passa a doze metros de Articuno e o frio atravessa o casaco como se o casaco não existisse.',
    d=>{
      if (d.flags.salvou_o_filhote) return 'E Articuno — que te reconhece das Seafoam — abaixa a cabeça um centímetro quando você passa. Um centímetro. É a maior honra da sua vida.';
      if (d.flags.respeitou_zapdos||d.flags.zapdos_desceu) return 'E Zapdos, na pedra alta, para de zumbir enquanto você atravessa. Só enquanto você atravessa.';
      return 'Nenhum dos dois te impede.';
    },
    'E é aí que você entende a parte ruim: eles não estão te impedindo de entrar.',
    'Eles estão impedindo alguma coisa de sair.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Passou entre dois lendários sem tentar capturá-los'},
      flag:'passou_pelas_aves',
      executar:d=>{ [144,145].forEach(x=>{const L=Estado.lend(x); if(L.disposicao!=='hostil') L.disposicao='passivo';}); return []; }},
  escolhas:[
    {texto:'Parar no meio e olhar os dois, um de cada vez.', vai:'c22_olhou_os_dois'},
    {texto:'Entrar na caverna.', vai:'c22_fim'}
  ]
},

c22_olhou_os_dois:{
  texto:[
    'Você para no meio do vale, entre os dois, e olha primeiro para um e depois para o outro.',
    'Zapdos, na pedra alta, tem as penas do peito arrepiadas de um jeito constante, sem descarga, sem trovão, só arrepiadas.',
    'Articuno, embaixo, tem uma camada de gelo no dorso com três centímetros de espessura, formada de fora para dentro, ao longo de meses.',
    'Nenhum dos dois caçou nesse tempo. Nenhum dos dois bebeu, que você possa ver.',
    'Eles não estão em posição de guarda porque escolheram estar. Eles estão em posição de guarda porque não pararam.',
    'Você olha de novo e vê: os dois estão exaustos.'
  ],
  ef:{flag:['viu_que_estao_exaustos'], instabilidade:2, moral:-2,
      rep:{eixo:'bom',delta:2,motivo:'Reparou que os guardas estavam exaustos'},
      registrar:'As duas aves estão exaustas. Meses de guarda sem parar.'},
  escolhas:[
    {texto:'Deixar comida e água para os dois antes de entrar.', vai:'c22_deixou_comida'},
    {texto:'Entrar na caverna.', vai:'c22_fim'}
  ]
},

c22_deixou_comida:{
  texto:[
    'Você tira o que tem da mochila e divide em dois montes, a uma distância respeitosa de cada um.',
    'Ração, o que sobrou da comida seca, e água do cantil em duas cavidades de pedra que você enche com as mãos.',
    'Nenhum dos dois olha para a comida.',
    'Você sobe de volta pela trilha e, do alto, antes de entrar, olha uma última vez.',
    'Articuno está bebendo.',
    'Ele para assim que percebe que você olhou, e volta à posição, e a água continua ali.'
  ],
  ef:{flag:'deixou_comida_pras_aves', moral:4,
      rep:{eixo:'bom',delta:3,motivo:'Deixou comida e água para dois guardas exaustos'},
      perdeItens:{'Ração':1},
      executar:d=>{ [144,145].forEach(x=>{const L=Estado.lend(x); L.disposicao='amistoso';}); return [{tipo:'mundo', texto:'Os dois guardas te olham de outro jeito agora.'}]; },
      registrar:'Deixou comida e água para as duas aves. Articuno bebeu quando achou que você não via.'},
  escolhas:[{texto:'Entrar na caverna.', vai:'c22_fim'}]
},

c22_recolocou:{
  texto:[
    'Você abre a Pokébola — ou as Pokébolas — apontando para as pedras onde eles deviam estar.',
    'Eles saem e não hesitam nem um segundo: voam direto para o posto, assumem a posição e voltam a olhar a caverna.',
    'Nenhum olha para você. Nenhum agradece. Eles tinham um trabalho e voltaram para ele.',
    'O outro — o que nunca saiu do lugar — solta um som curto. Não é saudação. É conferência de efetivo.'
  ],
  ef:{executar:d=>{
        const avisos=[];
        [...d.time,...d.pc].filter(p=>GRUPO_AVES.includes(p.dex)).forEach(p=>{
          Captura.soltar(p).forEach(e=>avisos.push({tipo:e.tipo,texto:e.texto}));
        });
        Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade-3);
        return avisos;
      },
      rep:{eixo:'bom',delta:3,motivo:'Recolocou os guardas no posto antes de descer'},
      flag:'recolocou_guarda'},
  escolhas:[
    {texto:'Deixar comida e água para os dois.', vai:'c22_deixou_comida'},
    {texto:'Entrar na caverna.', vai:'c22_fim'}
  ]
},

c22_luta_zapdos:{
  texto:['Você tira a Pokébola do cinto e o vale inteiro fica com cheiro de metal quente antes de você jogar.'],
  ef:{executar:d=>{ Estado.lend(145).ataquesSofridos++; return []; }},
  batalha:{dex:145, nivel:56, tipo:'lendario', fuga:true, ambiente:'montanha',
           vitoria:'c22_pos_ave', derrota:'c22_pos_ave', fuga2:'c22_pos_ave', captura:'c22_capturou_ave', gameover:'gameover'}
},

c22_luta_articuno:{
  texto:['O ar em volta dele é vinte graus mais frio. Você joga a Pokébola e vê ela congelar no meio do arco.'],
  ef:{executar:d=>{ Estado.lend(144).ataquesSofridos++; return []; }},
  batalha:{dex:144, nivel:56, tipo:'lendario', fuga:true, ambiente:'montanha',
           vitoria:'c22_pos_ave', derrota:'c22_pos_ave', fuga2:'c22_pos_ave', captura:'c22_capturou_ave', gameover:'gameover'}
},

c22_pos_ave:{
  texto:[
    'Quando acaba, os dois estão olhando para você em vez da caverna.',
    'Pela primeira vez desde que você chegou, eles pararam de montar guarda.',
    'Isso dura quatro segundos. Depois voltam a olhar a caverna.',
    'E os quatro segundos ficam na sua cabeça por muito tempo, porque nesses quatro segundos alguma coisa podia ter saído.'
  ],
  ef:{rep:{eixo:'ruim',delta:2,motivo:'Atacou os guardiões que protegiam a entrada'}, instabilidade:1},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c22_luta_zapdos',
     cond:d=>!(Estado.dados.lendarios[145]&&Estado.dados.lendarios[145].estado==='capturado')},
    {texto:'Deixar comida e água para os dois.', vai:'c22_deixou_comida'},
    {texto:'Parar. Entrar na caverna.', vai:'c22_fim'}
  ]
},

c22_capturou_ave:{
  texto:[
    'A Pokébola fecha.',
    'E o outro — o que sobrou — solta um som que não é de ataque. É de alarme.',
    'Ele abandona o posto e vem na sua direção, e você percebe tarde demais que tirou um dos dois guardas de uma porta que precisava de dois.',
    'Dentro da caverna, muito fundo, alguma coisa se mexe pela primeira vez em muito tempo.'
  ],
  ef:{instabilidade:3, flag:'quebrou_a_guarda',
      registrar:'Capturou uma das aves da guarda. A porta ficou com um guarda só.'},
  escolhas:[
    {texto:'Soltar imediatamente. Recolocar o guarda no posto.', vai:'c22_recolocou'},
    {texto:'Ficar com ele e entrar na caverna.', vai:'c22_fim', ef:{flag:'entrou_com_ave'}}
  ]
},

c22_voltou:{
  texto:[
    'Você volta. Dois dias de caminhada no sentido contrário, com o vale nas costas o tempo todo.',
    d=>d.flags.assinou_o_livro
      ? 'No posto, o Sr. Poplar escreve a sua data de descida na terceira coluna e não pergunta nada, e é justamente o não perguntar que dói.'
      : 'Ninguém te vê descer, porque não tem ninguém para ver.',
    'Em Saffron, você tenta explicar para alguém da Liga o que viu. Eles anotam. Agradecem.',
    'Onze dias depois, os jornais publicam que a temperatura na Rota 10 caiu sozinha, que houve relato de descarga elétrica sem tempestade, e que uma equipe de campo não retornou.',
    'Você vai ter que voltar lá. Todo mundo sabe disso, principalmente você.'
  ],
  ef:{instabilidade:2, flag:'adiou_o_norte',
      rep:{eixo:'ruim',delta:1,motivo:'Recuou quando era a única pessoa no lugar certo'}},
  escolhas:[{texto:'Voltar ao vale. Dessa vez até o fim.', vai:'c22_encontro'}]
},

c22_fim:{
  texto:[
    'A boca da caverna é mais alta que uma casa e o ar parado na boca dela é morno, o que está errado para essa altitude e para esse frio.',
    'Lá dentro, a passagem desce. Muito.',
    'As paredes são lisas demais para serem naturais: não foram cavadas, foram derretidas e esfriadas, com ondulações paradas no meio do movimento.',
    d=>{
      if (d.flags.leu_caderno) return 'Dia 241. Ele pediu para sair. Usou a palavra por favor. Você lembra disso agora, e devia ter lembrado antes.';
      if (d.flags.viu_os_doze) return 'Você pensa nos onze tanques do andar 11 e no décimo segundo, vazio, com a placa MATRIZ.';
      if (d.flags.sabe_da_pergunta) return 'Três adultos ficaram meses sentados numa pedra esperando uma segunda chance de responder uma pergunta. Você vai ter a primeira.';
      return 'Alguém morou aqui. Alguém mora aqui.';
    },
    d=>{
      if (d.flags.leva_a_resposta_dele) return 'No bolso de dentro, você está carregando uma linha escrita quarenta vezes por um homem que não conseguia descer sem entregá-la.';
      if (d.flags.achou_a_medalha) return 'No bolso de dentro, você está carregando uma medalha de natação infantil com a fita desbotada.';
      if (d.flags.deixou_comida_pras_aves) return 'Atrás de você, no vale, dois guardas exaustos estão bebendo água de uma cavidade de pedra que você encheu com as mãos.';
      return 'Você não trouxe nada que sirva aqui, e é bom que não tenha trazido.';
    },
    'Você não precisa de mais nenhuma pista para saber o que tem no fim dessa descida.'
  ],
  fim:true, resumo:'Capítulo 22 concluído — você chegou onde só cabe ir sozinh{o|a}.'
}
}}

);
