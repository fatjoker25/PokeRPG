/* ------------------------------------------------------------
   ABERTURAS — vinte e dois quilômetros de ciclovia vazia. Dá
   pra chegar nela de bicicleta emprestada, pela cabine de
   pedágio, atrás de quem esvaziou, ou com crachá na mão.
   ------------------------------------------------------------ */
const C15_ABERTURAS = ['c15_rotas', 'c15_ab_a_bicicleta', 'c15_ab_a_cabine', 'c15_ab_a_caminhonete', 'c15_ab_de_cracha'];
function c15_cabe(id, d){
  if (id === 'c15_ab_a_bicicleta') return d.jogador.dinheiro >= 400;
  if (id === 'c15_ab_de_cracha')   return typeof Cargos !== 'undefined' && Cargos.lista().length >= 1;
  return true;
}
function c15_abertura(d){
  const cand = C15_ABERTURAS.filter(id => c15_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 15 — OS TRÊS QUE CORREM  (Rotas 14–18)
   ============================================================ */
CAPITULOS.push(
{
num:15, titulo:'Os Três que Correm', local:'Rotas 14–18', ambiente:'campo', nivelArea:46,
tom:'muito sombrio', entradas:C15_ABERTURAS,
inicio: d => c15_abertura(d),
cenas:{

c15_ab_a_bicicleta:{
  texto:[
    'Tem uma locadora de bicicleta na entrada norte da ciclovia: um contêiner pintado de azul com dezesseis bicicletas do lado de fora e uma mulher lendo revista numa cadeira de plástico.',
    'Quatrocentos o dia. Ela nem levanta pra alugar.',
    fala('a mulher da locadora', 'Capacete é mais cem e ninguém leva.'),
    d=>fala(d.jogador.nome, 'Eu levo.'),
    'Ela levanta.',
    fala('a mulher da locadora', 'Ah.'),
    'Ela escolhe a bicicleta pra você, o que é um serviço que ela claramente não presta pra todo mundo, e escolhe a de aro vinte e seis com pneu novo.',
    fala('a mulher da locadora', 'Olha, um aviso.'),
    fala('a mulher da locadora', 'Não vai ter bicho. Se você tá indo pra ver bicho, é melhor eu te devolver os quatrocentos agora.'),
    d=>fala(d.jogador.nome, 'Desde quando?'),
    fala('a mulher da locadora', 'Umas seis semanas.'),
    'Ela volta pra cadeira de plástico.',
    fala('a mulher da locadora', 'Eu aluguei três bicicletas essa semana. No ano passado eu alugava trinta por dia.')
  ],
  ef:{dinheiro:-500, flag:'alugou_bicicleta',
      registrar:'Alugou bicicleta e capacete na entrada norte da ciclovia. A locação caiu de trinta por dia para três por semana.'},
  escolhas:[
    {texto:'Pedalar a ciclovia inteira.', vai:'c15_ciclovia'},
    {texto:'Perguntar se ela viu alguma coisa nas seis semanas.', vai:'c15_ab_o_que_ela_viu'},
    {texto:'Ir primeiro à cabine de pedágio.', vai:'c15_cabine'}
  ]
},

c15_ab_o_que_ela_viu:{
  texto:[
    'Ela fecha a revista e põe no colo, o que é o gesto de quem vai falar sério.',
    fala('a mulher da locadora', 'Caminhonete. Cabine dupla, branca, caçamba com lona.'),
    fala('a mulher da locadora', 'Passa de madrugada, pela ciclovia.'),
    d=>fala(d.jogador.nome, 'Pela ciclovia? Não é proibido veículo?'),
    fala('a mulher da locadora', 'É proibido. Mas a cancela da cabine tá quebrada há nove anos e ninguém consertou porque ninguém precisava.'),
    'Ela aponta com a revista pra entrada.',
    fala('a mulher da locadora', 'Eu durmo aqui. Meu contêiner é aqui.'),
    fala('a mulher da locadora', 'Nas últimas seis semanas eu ouvi ela passar dezessete vezes. Eu conto porque acorda.')
  ],
  ef:{flag:'a_caminhonete_da_madrugada',
      npc:{nome:'a mulher da locadora', opiniao:1, viuVoce:'Te contou das dezessete passagens da caminhonete.'},
      registrar:'Uma caminhonete branca de caçamba com lona passou dezessete vezes pela ciclovia em seis semanas, de madrugada.'},
  escolhas:[
    {texto:'Pedalar a ciclovia procurando o rastro.', vai:'c15_ciclovia'},
    {texto:'Ir à cabine de pedágio.', vai:'c15_cabine'},
    {texto:'Procurar quem more por aqui.', vai:'c15_vilarejo'}
  ]
},

c15_ab_a_cabine:{
  texto:[
    'A cabine de pedágio da entrada norte está desativada desde noventa e um, e desativada quer dizer: vidro inteiro, cancela quebrada na posição levantada, e uma porta que não tranca.',
    'Você abre a porta porque a porta está lá.',
    'Dentro tem uma cadeira giratória sem encosto, um calendário de mil novecentos e noventa e um com uma foto de Cerulean, e poeira em tudo.',
    'Em tudo menos numa coisa.',
    'O peitoril da janela da cabine, o de dentro, na altura de quem senta, está limpo numa faixa de uns quarenta centímetros. Limpo de cotovelo.',
    'Alguém senta aqui. Regularmente. Olhando pra ciclovia.',
    'E no chão, embaixo da cadeira, tem oito bitucas de cigarro, e as oito são da mesma marca, e três delas ainda estão com o filtro branco.'
  ],
  ef:{flag:'alguem_senta_na_cabine',
      registrar:'Alguém senta na cabine de pedágio desativada olhando a ciclovia. Oito bitucas, três recentes.',
      presagio:'De dentro da cabine dá pra ver quem entra na ciclovia. É por isso que se senta ali.'},
  escolhas:[
    {texto:'Ficar escondido na cabine e esperar quem senta.', vai:'c15_ab_esperou_na_cabine'},
    {texto:'Andar a ciclovia agora, antes que a pessoa chegue.', vai:'c15_ciclovia'},
    {texto:'Procurar quem more por aqui e conheça a cabine.', vai:'c15_vilarejo'}
  ]
},

c15_ab_esperou_na_cabine:{
  texto:[
    'Você senta no chão da cabine, atrás do balcão, onde de fora não se vê, e espera.',
    'Espera uma hora e quarenta. É muito tempo pra ficar em silêncio num lugar que cheira a poeira e cigarro velho.',
    'Às onze e dez chega um homem de uns trinta e cinco anos, de calça de brim e bota, com uma garrafa térmica.',
    'Ele senta na cadeira giratória sem encosto, apoia o cotovelo no peitoril limpo, acende um cigarro e não faz mais nada.',
    'Fica quarenta minutos olhando a ciclovia vazia.',
    'Em quarenta minutos, passa uma pessoa de bicicleta. Ele pega um caderninho do bolso de trás e anota alguma coisa.',
    'Anota. Guarda o caderninho. Volta a olhar.'
  ],
  ef:{flag:'o_homem_do_caderninho', hp:-1,
      registrar:'Um homem senta na cabine e anota num caderninho cada pessoa que entra na ciclovia.',
      presagio:'Ele não impede ninguém de entrar. Ele anota quem entra.'},
  escolhas:[
    {texto:'Aparecer e perguntar o que ele anota.', vai:'c15_ab_perguntou_o_caderninho'},
    {texto:'Esperar ele sair e seguir ele.', vai:'c15_ab_seguiu_o_homem'},
    {texto:'Sair sem ele ver e ir pra ciclovia.', vai:'c15_ciclovia'}
  ]
},

c15_ab_perguntou_o_caderninho:{
  texto:[
    'Você levanta de trás do balcão e ele quase cai da cadeira, o que é, por um segundo, engraçado.',
    d=>fala(d.jogador.nome, 'O que você anota?'),
    'Ele se recompõe rápido demais pra alguém que levou um susto de verdade.',
    fala('o homem da cabine', 'Fluxo. Eu sou da concessionária.'),
    d=>fala(d.jogador.nome, 'A cabine tá desativada desde noventa e um.'),
    'Silêncio.',
    fala('o homem da cabine', 'Estudo de reativação.'),
    d=>fala(d.jogador.nome, 'Com caderninho de bolso?'),
    'Ele apaga o cigarro no peitoril, o que estraga a faixa limpa que ele mesmo mantinha.',
    fala('o homem da cabine', 'Olha, menino. Você não tá entendendo o que tá acontecendo aqui e é melhor assim.'),
    'Ele sai. Não corre. Desce a rampa da cabine e entra numa caminhonete branca de cabine dupla que estava estacionada atrás do mato, fora do seu campo de visão, o tempo todo.'
  ],
  ef:{flag:['assustou_o_vigia','a_caminhonete_da_madrugada'],
      registrar:'O vigia da cabine foi embora numa caminhonete branca de cabine dupla escondida atrás do mato.',
      presagio:'Agora eles sabem que tem alguém perguntando. Isso muda o ritmo deles e o seu.'},
  escolhas:[
    {texto:'Ir pra ciclovia agora, rápido.', vai:'c15_ciclovia'},
    {texto:'Procurar o vilarejo e avisar as pessoas.', vai:'c15_vilarejo'}
  ]
},

c15_ab_seguiu_o_homem:{
  texto:[
    'Você espera. Ele fica mais uma hora e vinte e sai às doze e trinta, sem pressa, com a garrafa térmica vazia.',
    'Você deixa ele sair do seu campo de visão e sai atrás, pelo capinzal do lado, o que é lento e é barulhento e é a única opção.',
    'Ele anda trezentos metros pela beira da ciclovia e entra numa trilha de terra que não está em mapa nenhum, aberta por veículo, com o capim deitado nos dois lados.',
    'A trilha dá num barracão de madeira e telha de fibrocimento, com uma caminhonete branca estacionada na frente e um gerador ligado.',
    'E, encostadas na parede externa do barracão, sob uma lona: doze gaiolas de transporte vazias e empilhadas.',
    'Vazias. Empilhadas. Limpas.',
    'Doze gaiolas limpas quer dizer que o que estava nelas já foi levado.'
  ],
  ef:{flag:['o_barracao_da_trilha','caderno_do_trafico'],
      registrar:'Um barracão escondido a trezentos metros da ciclovia, com doze gaiolas de transporte vazias e limpas.',
      presagio:'Doze gaiolas limpas e empilhadas. Eles terminaram este trecho.'},
  escolhas:[
    {texto:'Chegar mais perto do barracão.', vai:'c15_ciclovia'},
    {texto:'Voltar e procurar o vilarejo.', vai:'c15_vilarejo'},
    {texto:'Voltar à cabine e pegar o caderninho, se ele deixou.', vai:'c15_ab_o_caderninho'}
  ]
},

c15_ab_o_caderninho:{
  texto:[
    'O caderninho não ficou na cabine. Claro que não ficou.',
    'Mas ficou outra coisa, e essa você não esperava: embaixo da cadeira giratória, junto com as oito bitucas, tem uma folha amassada e jogada fora.',
    'É uma folha arrancada do caderninho. Ele arrancou e amassou e jogou porque errou alguma coisa e refez.',
    'Você desamassa.',
    'É uma tabela. Três colunas: data, trecho, e um número.',
    '14/10 — km 4 ao 9 — 31. 16/10 — km 9 ao 14 — 27. 19/10 — km 14 ao 18 — 22.',
    'Eles estão contando quantos retiraram de cada trecho.',
    'E na quarta linha, a que ele errou e refez, está escrito: 22/10 — km 18 ao 22 — e o número está em branco.',
    'Hoje é dia vinte e dois.'
  ],
  ef:{flag:['a_folha_da_contagem','caderno_do_trafico'],
      registrar:'Uma folha arrancada do caderninho: 31, 27 e 22 Pokémon retirados de três trechos. O quarto trecho é hoje.',
      presagio:'A quarta linha está em branco porque o trabalho é hoje. Você não chegou tarde: você chegou junto.'},
  escolhas:[
    {texto:'Ir pro km 18. Agora.', vai:'c15_ciclovia'},
    {texto:'Procurar o vilarejo e juntar gente primeiro.', vai:'c15_vilarejo'}
  ]
},

c15_ab_a_caminhonete:{
  texto:[
    'Você está na ciclovia no quilômetro três quando ouve motor atrás de você, e motor na ciclovia é uma frase que não devia existir.',
    'Caminhonete branca de cabine dupla, caçamba com lona, vindo do norte, no meio do asfalto onde não cabe caminhonete.',
    'Você sai pro acostamento de brita. Ela passa a uns sessenta, a dois metros de você, e não desacelera nem um pouco.',
    'Dois homens na cabine. O do carona olha pra você pelo retrovisor de porta por uns quatro segundos, e você vê ele te olhando, e ele vê você vendo.',
    'A caminhonete continua e some na curva do quilômetro cinco.',
    'A lona da caçamba estava mal amarrada de um lado e balançava, e no balanço dava pra ver o que tinha embaixo: metal quadriculado.',
    'Grade.'
  ],
  ef:{flag:'a_caminhonete_te_viu', hp:-1,
      registrar:'Uma caminhonete branca com gaiolas na caçamba passou por você na ciclovia. O carona te viu.',
      presagio:'Ele te olhou por quatro segundos pelo retrovisor. Quatro segundos é tempo de decorar uma cara.'},
  escolhas:[
    {texto:'Seguir a caminhonete pela ciclovia.', vai:'c15_ciclovia'},
    {texto:'Voltar à cabine de pedágio e ver de onde ela saiu.', vai:'c15_cabine'},
    {texto:'Procurar quem more por aqui e avisar.', vai:'c15_vilarejo'}
  ]
},

c15_ab_de_cracha:{
  texto:[
    'A ciclovia das rotas 14 a 18 é área de concessão pública, e área de concessão pública tem um livro de ocorrências, e o livro de ocorrências fica numa gaveta da administração em Fuchsia.',
    d=>{
      const c = Cargos.principal();
      return `Com o crachá de ${c ? c.nome : 'serviço'}, a moça da administração — crachá de plástico no cordão, Yuka, sete anos de casa — te entrega o livro sem pedir ofício, o que provavelmente é irregular e é a coisa mais útil que te aconteceu no mês.`;
    },
    'O livro tem uma ocorrência por página e as páginas são quase todas de coisas pequenas: guarda-corpo amassado, buraco no asfalto, ciclista com torção de tornozelo.',
    'As últimas seis semanas têm onze ocorrências, e as onze são a mesma frase escrita por seis pessoas diferentes:',
    '"Usuário relata ausência de fauna no trecho."',
    'Onze relatos. E, na coluna de providência, onze vezes a mesma palavra: "aguardando".',
    fala('Yuka', 'Aguardando o quê, né.'),
    'Ela fala isso sem você perguntar.'
  ],
  ef:{flag:'o_livro_de_ocorrencias',
      registrar:'Onze ocorrências em seis semanas relatam ausência de fauna na ciclovia. Todas com providência "aguardando".'},
  escolhas:[
    {texto:'Perguntar quem escreve "aguardando".', vai:'c15_ab_quem_escreve'},
    {texto:'Pedir cópia das onze e ir pra ciclovia.', vai:'c15_ab_copia_das_onze'},
    {texto:'Ir direto pra ciclovia.', vai:'c15_rotas'}
  ]
},

c15_ab_quem_escreve:{
  texto:[
    fala('Yuka', 'A providência quem preenche é a chefia.'),
    d=>fala(d.jogador.nome, 'E a chefia é quem?'),
    'Ela vira o livro e aponta a rubrica no pé da página. É uma rubrica só, repetida onze vezes, feita com a mesma caneta.',
    fala('Yuka', 'Superintendente da concessão. Ele vem aqui duas vezes por mês.'),
    fala('Yuka', 'E ele assinou as onze no mesmo dia.'),
    d=>fala(d.jogador.nome, 'Como você sabe?'),
    fala('Yuka', 'Porque eu protocolei as onze em datas diferentes e as onze ficaram sem providência até o dia treze.'),
    'Ela fecha o livro.',
    fala('Yuka', 'No dia treze ele veio, sentou nessa cadeira, e assinou as onze de uma vez, em três minutos, sem ler nenhuma.', 'baixo')
  ],
  ef:{flag:'a_rubrica_do_superintendente',
      npc:{nome:'Yuka', opiniao:2, viuVoce:'Te mostrou que as onze providências foram assinadas de uma vez.'},
      registrar:'O superintendente da concessão assinou as onze ocorrências de uma vez, sem ler, no dia 13.'},
  escolhas:[
    {texto:'Pedir cópia das onze.', vai:'c15_ab_copia_das_onze'},
    {texto:'Ir pra ciclovia.', vai:'c15_rotas'}
  ]
},

c15_ab_copia_das_onze:{
  texto:[
    'Ela tira as cópias na máquina da sala do lado, que faz um barulho de avião, e as onze folhas saem quentes.',
    'Ela carimba cada uma com o carimbo de "confere com o original" e assina embaixo do carimbo.',
    fala('Yuka', 'Não precisava carimbar.'),
    d=>fala(d.jogador.nome, 'Então por que carimbou?'),
    fala('Yuka', 'Porque sem carimbo é fotocópia e com carimbo é documento.'),
    'Ela empilha, bate na mesa pra alinhar, e entrega.',
    fala('Yuka', 'Eu trabalho aqui há sete anos e é a primeira vez que alguém vem pedir esse livro.'),
    fala('Yuka', 'Eu reli as onze ontem à noite, depois que você marcou de vir.'),
    fala('Yuka', 'Onze pessoas diferentes escreveram a mesma coisa e ninguém foi lá ver.', 'baixo')
  ],
  ef:{flag:['copia_das_onze_ocorrencias','reika_precisa_de_papel'],
      npc:{nome:'Yuka', opiniao:3, viuVoce:'Carimbou as onze cópias como conferidas com o original.'},
      registrar:'Tem onze ocorrências carimbadas como documento: ausência de fauna na ciclovia, providência "aguardando".'},
  escolhas:[
    {texto:'Ir pra ciclovia.', vai:'c15_rotas'},
    {texto:'Ir direto ao vilarejo da ciclovia.', vai:'c15_vilarejo'}
  ]
},


c15_rotas:{
  texto:[
    'As Rotas 14 a 18 formam a única sequência de Kanto que a gente atravessa de bicicleta.',
    'É uma ciclovia de asfalto de vinte e dois quilômetros, construída em mil novecentos e oitenta e quatro, com guarda-corpo dos dois lados e uma cabine de pedágio na entrada norte onde ninguém cobra pedágio há nove anos.',
    'De um lado, o mar. Do outro, capinzal alto até onde a vista alcança.',
    'É bonito de um jeito banal e é o trecho mais tranquilo de Kanto.',
    'Foi o trecho mais tranquilo de Kanto.',
    'Você entra pela cabine de pedágio às sete da manhã e a primeira coisa que te incomoda leva vinte minutos pra virar pensamento:',
    'não tem bicho.',
    'Nada. Nem Spearow no poste, nem Rattata no capim, nem Doduo correndo paralelo à ciclovia, que é a coisa mais clássica que acontece nessa estrada e que vem em todo folheto turístico de Fuchsia.',
    'Vinte e dois quilômetros de capinzal em outubro, com fruta madura, sem um bicho.'
  ],
  ef:{registrar:'A ciclovia das rotas 14 a 18 está vazia de Pokémon.',
      presagio:'Capim alto, fruta madura, e nada. Isso não é caça: caça deixa sobra.'},
  escolhas:[
    {texto:'Andar a ciclovia inteira e procurar o motivo.', vai:'c15_ciclovia'},
    {texto:'Procurar alguém que more aqui.', vai:'c15_vilarejo'},
    {texto:'Voltar à cabine de pedágio e procurar quem trabalhava nela.', vai:'c15_cabine'},
    {texto:'Sair da ciclovia e entrar no capinzal.', vai:'c15_capinzal'}
  ]
},

c15_cabine:{
  texto:[
    'A cabine de pedágio é um cubo de concreto de dois por dois com uma janela de vidro quebrada e um banco de madeira.',
    'E tem alguém dentro.',
    'Um homem de uns sessenta anos, de camisa de botão, sentado no banco com um caderno de capa dura no colo e um binóculo pendurado no pescoço.',
    'Ele te vê chegando e continua escrevendo até terminar a linha, do jeito que faz quem anota coisa com horário.',
    '"Bom dia. Você é o quê?"',
    '"Como assim?"',
    '"Você é ciclista, pesquisador, turista ou treinador? São os quatro que passam aqui."',
    '"Treinador."',
    'Ele anota.',
    '"Sete e dezoito. Treinador. Um."',
    'E aí ele fecha o caderno e olha pra você por cima do óculos.',
    '"Você é o terceiro em dezenove dias. Em setembro passaram quarenta e um por dia."'
  ],
  ef:{flag:'conheceu_otavio',
      npc:{nome:'Tatsuya', opiniao:1, memoria:'Anota tudo o que passa pela cabine de pedágio da ciclovia, com horário.'},
      registrar:'O movimento na ciclovia caiu de 41 pessoas por dia para 3 em dezenove dias.',
      presagio:'Ele anota com horário. Numa cabine de pedágio que não cobra pedágio há nove anos.'},
  escolhas:[
    {texto:'"Por que você anota?"', vai:'c15_porque_anota'},
    {texto:'"O que aconteceu com os bichos?"', vai:'c15_o_que_aconteceu'},
    {texto:'"Quem é o terceiro?"', vai:'c15_o_terceiro'},
    {texto:'Agradecer e seguir a ciclovia.', vai:'c15_ciclovia'}
  ]
},

c15_porque_anota:{
  texto:[
    '"Por que você anota?"',
    '"Porque eu e minha mulher fazemos levantamento de fauna dessas rotas desde mil novecentos e oitenta e sete."',
    'Ele abre o caderno numa página aleatória e vira pra você.',
    'É uma tabela feita à mão, com régua, com coluna de data, hora, trecho, espécie e quantidade.',
    'Milhares de linhas.',
    '"Treze anos?"',
    '"Treze anos de um levantamento voluntário que a gente manda pra Comissão todo mês de janeiro e que ninguém lê."',
    '"Como você sabe que ninguém lê?"',
    'Ele ri.',
    '"Porque em noventa e um eu mandei com um erro de propósito. Eu escrevi que tinha uma população de cento e vinte Lapras no trecho quatorze."',
    '"Lapras em capinzal?"',
    '"Lapras em capinzal, meu jovem, a quatro quilômetros do mar, cento e vinte deles."',
    'Ele fecha o caderno.',
    '"Nove anos e ninguém nunca me ligou."'
  ],
  ef:{flag:['sabe_do_levantamento','otavio_confia'],
      npc:{nome:'Tatsuya', opiniao:4, memoria:'Faz levantamento de fauna desde 1987 e provou em 1991 que ninguém lê.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou por que ele anota'},
      registrar:'Tatsuya e a mulher fazem levantamento de fauna das rotas 14–18 desde 1987.',
      presagio:'Treze anos de dado bom que ninguém leu. Você acabou de virar a primeira pessoa a ler.'},
  escolhas:[
    {texto:'"Me mostra os últimos meses."', vai:'c15_os_ultimos_meses'},
    {texto:'"O que aconteceu com os bichos?"', vai:'c15_o_que_aconteceu'},
    {texto:'"Onde está sua mulher?"', vai:'c15_a_nair'},
    {texto:'Seguir a ciclovia.', vai:'c15_ciclovia'}
  ]
},

c15_o_que_aconteceu:{
  texto:[
    '"O que aconteceu com os bichos?"',
    'Ele não hesita.',
    '"Foram embora."',
    '"Morreram?"',
    '"Não. Foram embora. Tem diferença e a diferença é a única coisa importante desse assunto."',
    'Ele bate no caderno.',
    '"Se morressem, a gente achava. Bicho morto fica. Tem urubu, tem cheiro, tem osso."',
    '"A gente andou os vinte e dois quilômetros da ciclovia e mais os trechos de mato em oito dias, eu e a Sumi, e a gente achou dois bichos mortos, que é o número normal, que é atropelamento."',
    '"Então eles andaram."',
    '"Eles andaram. E andaram todos pro mesmo lado, que é o que me tira o sono."',
    '"Pra que lado?"',
    'Ele aponta com o queixo.',
    '"Norte."'
  ],
  ef:{flag:['sabe_que_foram_embora','sabe_que_foi_norte'],
      rep:{eixo:'bom',delta:3,motivo:'Perguntou e a resposta veio com método'},
      registrar:'A fauna das rotas 14–18 migrou toda para o norte em poucas semanas.',
      presagio:'Todos pro mesmo lado. Bicho não combina direção. Bicho foge da mesma coisa.'},
  escolhas:[
    {texto:'"Me mostra os últimos meses."', vai:'c15_os_ultimos_meses'},
    {texto:'"E o que veio do sul?"', vai:'c15_o_que_veio_do_sul'},
    {texto:'"Onde está sua mulher?"', vai:'c15_a_nair'},
    {texto:'Seguir a ciclovia.', vai:'c15_ciclovia'}
  ]
},

c15_os_ultimos_meses:{
  texto:[
    'Ele te dá o caderno e vai encher a garrafa térmica na bica, porque ele quer que você leia sozinho.',
    'Você lê uma hora e vinte.',
    'E a coisa aparece sozinha, sem você procurar, porque ele fez uma tabela boa:',
    'em julho, o trecho 18 — o mais ao sul, mais perto do mar de Cinnabar — zera.',
    'Em agosto, zera o 17.',
    'Em setembro, o 16.',
    'Em outubro, o 15, e o 14 está pela metade.',
    'Não é um esvaziamento: é uma frente.',
    'Uma linha se movendo de sul pra norte a uma velocidade de mais ou menos um trecho por mês, empurrando tudo na frente dela.',
    'Você pega o lápis do caderno e faz a conta na margem, do jeito que você aprendeu a fazer numa encosta olhando uma usina.',
    'Um trecho por mês. Faltam dois trechos até Fuchsia.',
    'Dois meses.'
  ],
  ef:{flag:['viu_a_frente','sabe_dos_dois_meses'],
      rep:{eixo:'bom',delta:5,motivo:'Leu treze anos de tabela e achou a frente'},
      instabilidade:1,
      registrar:'A fauna some de sul para norte, um trecho por mês. Faltam dois trechos até Fuchsia.',
      presagio:'Dois meses. Você já fez essa conta antes, numa encosta, e ela deu quarenta e um dias.'},
  escolhas:[
    {texto:'"E o que veio do sul?"', vai:'c15_o_que_veio_do_sul'},
    {texto:'Mostrar a conta pro Tatsuya.', vai:'c15_mostrou_a_conta'},
    {texto:'"Onde está sua mulher?"', vai:'c15_a_nair'},
    {texto:'Ir pro capinzal ver rastro.', vai:'c15_capinzal'}
  ]
},

c15_mostrou_a_conta:{
  texto:[
    'Ele volta com a garrafa térmica e você mostra a margem.',
    'Ele lê. Põe o óculos. Lê de novo.',
    'E faz uma coisa que velho que anota há treze anos faz: ele confere a sua conta com a régua, trecho por trecho, em silêncio, por quatro minutos.',
    '"Tá certo."',
    'Ele senta no banco de madeira.',
    '"Eu vi isso em setembro."',
    '"Você viu e não falou nada?"',
    '"Eu falei." Ele bebe café. "Eu peguei o ônibus até Fuchsia, entrei no posto da Liga, e falei com a oficial."',
    '"E?"',
    '"E ela me ouviu por quarenta minutos, anotou tudo, foi ótima, e no fim me disse a verdade: que migração de fauna não é competência da Liga, é da Comissão, e que a Comissão tem um canal de denúncia que é um formulário."',
    'Ele olha o caderno.',
    '"Eu mando formulário pra Comissão desde oitenta e sete, meu jovem."'
  ],
  ef:{flag:['otavio_avisou','sabe_dos_dois_meses'],
      npc:{nome:'Tatsuya', opiniao:6, memoria:'Já tinha visto a frente em setembro e já tinha avisado a Liga e a Comissão.'},
      rep:{eixo:'bom',delta:3,motivo:'Mostrou a conta a quem já tinha feito ela'},
      registrar:'Tatsuya avisou a Liga em setembro. Migração de fauna não é competência da Liga.',
      presagio:'Ele já tinha avisado. Todo mundo nesse jogo já avisou alguém.'},
  escolhas:[
    {texto:'"E o que veio do sul?"', vai:'c15_o_que_veio_do_sul'},
    {texto:'"Onde está sua mulher?"', vai:'c15_a_nair'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Ir ao vilarejo da rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_o_que_veio_do_sul:{
  texto:[
    '"E o que veio do sul?"',
    'Tatsuya fecha o caderno com as duas mãos.',
    '"Essa é a pergunta."',
    '"E a resposta?"',
    '"Três."',
    'Ele levanta três dedos.',
    '"Três coisas que a gente não consegue identificar, que passam pelo trecho de madrugada, sempre em fila, sempre no mesmo trajeto, e que fazem o chão vibrar antes de a gente ouvir."',
    '"Você viu?"',
    '"Eu vi duas vezes, de longe, com binóculo, e nas duas vezes eu tava mijando de medo e não consegui segurar o binóculo firme."',
    'Ele passa a mão no rosto.',
    '"A Sumi viu quatro vezes. Ela tem a mão mais firme."',
    '"E ela identificou?"',
    '"Ela desenhou."',
    'Ele abre o caderno na contracapa.',
    'Tem três desenhos a lápis, feitos por alguém que desenha bem por prática e não por talento.',
    'Você reconhece os três antes de ele falar os nomes.'
  ],
  ef:{flag:['sabe_dos_tres','otavio_viu'],
      npc:{nome:'Tatsuya', opiniao:5, memoria:'Viu os três duas vezes com binóculo e a mão tremendo.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou o que veio, em vez do que foi'},
      instabilidade:1,
      registrar:'Três criaturas passam pelas rotas de madrugada, em fila, no mesmo trajeto.',
      presagio:'Sempre o mesmo trajeto. Isso é ronda, não migração.'},
  escolhas:[
    {texto:'"Onde está sua mulher?"', vai:'c15_a_nair'},
    {texto:'"Qual é o trajeto?"', vai:'c15_o_trajeto'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Ir pro vilarejo da rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_a_nair:{
  texto:[
    '"Onde está sua mulher?"',
    'Ele olha o relógio.',
    '"No trecho dezesseis, contando. Ela faz a manhã e eu faço a cabine, e às treze a gente troca."',
    '"Ela anda sozinha numa rota vazia com três coisas dessas passando?"',
    '"Ela anda sozinha nessas rotas há trinta e um anos, meu jovem, e ela tem sessenta e três, e eu já tentei convencer ela de tudo na vida e nunca consegui de nada."',
    'Ele olha a estrada.',
    '"E ela diz uma coisa que eu não consigo rebater."',
    '"O quê?"',
    '"Que se a gente parar de contar agora, ninguém vai ter contado o que aconteceu enquanto aconteceu."',
    'Ele guarda o caderno na sacola.',
    '"Ela diz que o levantamento não é pra ninguém ler hoje. É pra alguém poder ler daqui a cinquenta anos."'
  ],
  ef:{flag:['sabe_da_nair','nair_no_dezesseis'],
      npc:{nome:'Tatsuya', opiniao:5, memoria:'A mulher dele, Sumi, conta o trecho 16 sozinha todas as manhãs.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou onde ela estava'},
      moral:8,
      registrar:'Sumi conta o trecho 16 sozinha toda manhã, há 31 anos.',
      presagio:'"É pra alguém poder ler daqui a cinquenta anos." Guarde essa definição de trabalho.'},
  escolhas:[
    {texto:'Ir andando até o trecho 16 encontrar ela.', vai:'c15_nair'},
    {texto:'"Qual é o trajeto dos três?"', vai:'c15_o_trajeto'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Ir pro vilarejo da rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_o_terceiro:{
  texto:[
    '"Quem é o terceiro?"',
    'Ele confere o caderno.',
    '"Você é o terceiro. Em dezenove dias."',
    '"E os outros dois?"',
    '"Uma moça de bicicleta no dia nove, que voltou em quarenta minutos e disse que tinha esquecido uma coisa."',
    'Ele vira a página.',
    '"E um homem de terno, no dia catorze, de carro, que atravessou os vinte e dois quilômetros, ficou quarenta minutos no mirante do trecho dezoito, e voltou."',
    '"Homem de terno de carro numa ciclovia?"',
    '"Carro não pode entrar na ciclovia. Ele entrou pela estrada de manutenção, que tem uma corrente com cadeado, e o cadeado é da Comissão."',
    'Ele fecha o caderno.',
    '"Eu anotei a placa porque eu anoto tudo."'
  ],
  ef:{flag:['sabe_do_homem_de_terno','placa_do_terno'],
      itens:{'Placa anotada num canto de caderno':1},
      npc:{nome:'Tatsuya', opiniao:4, memoria:'Anotou a placa de um carro da Comissão que ficou 40 minutos no mirante do trecho 18.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou quem mais tinha passado'},
      registrar:'No dia 14, um carro com cadeado da Comissão ficou 40 minutos no mirante do trecho 18.',
      presagio:'O mirante do trecho 18 é de onde se vê Cinnabar. Ele foi olhar a mesma coisa que os três.'},
  escolhas:[
    {texto:'"O que se vê do mirante do dezoito?"', vai:'c15_o_trajeto'},
    {texto:'"O que aconteceu com os bichos?"', vai:'c15_o_que_aconteceu'},
    {texto:'"Onde está sua mulher?"', vai:'c15_a_nair'},
    {texto:'Ir até o mirante do trecho 18.', vai:'c15_mirante'}
  ]
},

c15_o_trajeto:{
  texto:[
    '"Qual é o trajeto deles?"',
    'Tatsuya tira do bolso um mapa da ciclovia dobrado em oito — um mapa turístico, desses que a prefeitura de Fuchsia imprime, com desenho de Doduo no canto.',
    'E em cima do mapa turístico, a lápis, tem uma linha traçada à mão.',
    'A linha sai do mirante do trecho dezoito, sobe pelo capinzal paralelo à ciclovia até o trecho quinze, atravessa pro lado do mar, desce de volta pelo litoral até o trecho dezoito, e fecha.',
    'É um circuito.',
    'Um circuito fechado de uns trinta e quatro quilômetros, percorrido todas as madrugadas, sempre no mesmo sentido.',
    '"Quantas vezes por noite?"',
    '"Duas. Às vezes três."',
    'Você olha o desenho por um tempo e aí entende o que ele desenhou sem saber que estava desenhando.',
    'A linha não é uma rota de caça. É um perímetro.',
    'E no meio do perímetro não tem nada.',
    'Mas na ponta sul dele, do outro lado de trinta quilômetros de mar, tem uma ilha com um vulcão.'
  ],
  ef:{flag:['sabe_do_circuito','caes_olham_cinnabar'],
      itens:{'Mapa da ciclovia com o circuito a lápis':1},
      npc:{nome:'Tatsuya', opiniao:6, memoria:'Te deu o mapa com o circuito dos três traçado a lápis.'},
      rep:{eixo:'bom',delta:5,motivo:'Olhou o desenho até entender o que era'},
      instabilidade:1,
      registrar:'Os três percorrem um circuito fechado de 34 km, duas a três vezes por noite, ancorado no mirante do trecho 18.',
      presagio:'Perímetro. Eles não estão caçando nada aqui. Eles estão fechando.'},
  escolhas:[
    {texto:'Ir até o mirante do trecho 18.', vai:'c15_mirante'},
    {texto:'Ir encontrar a Sumi no trecho 16.', vai:'c15_nair'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'}
  ]
},

/* ─────────────── A CICLOVIA ─────────────── */

c15_ciclovia:{
  texto:[
    'Você anda os vinte e dois quilômetros. Leva o dia inteiro e você não encontra uma única pessoa.',
    'A ciclovia está limpa, o asfalto está bom, o guarda-corpo está inteiro, e a cada dois quilômetros tem um banco de concreto com uma placa de espécies parafusada em cima.',
    'As placas são bonitas. Alguém investiu nelas em oitenta e quatro: silhueta em relevo, nome comum, nome científico, e uma frase curta sobre o hábito.',
    '**"DODUO — corre paralelo a veículos. Não se aproxime da fêmea com filhote."**',
    '**"PINSIR — ativo ao amanhecer. Não alimente."**',
    'Onze placas em vinte e dois quilômetros, descrevendo onze espécies que não existem mais aqui.',
    'Você para na sétima e lê ela inteira duas vezes, sem motivo, e é a coisa mais triste do seu dia.'
  ],
  ef:{flag:'andou_a_ciclovia',
      rep:{eixo:'bom',delta:1,motivo:'Andou os vinte e dois quilômetros'},
      hp:-2, causa:'Um dia inteiro de caminhada',
      registrar:'Andou a ciclovia inteira. Onze placas descrevem espécies que sumiram.',
      presagio:'As placas continuam lá, descrevendo o que não existe mais. Ninguém desparafusa placa.'},
  escolhas:[
    {texto:'Ir até o mirante do trecho 18.', vai:'c15_mirante'},
    {texto:'Sair da ciclovia e entrar no capinzal.', vai:'c15_capinzal'},
    {texto:'Procurar o vilarejo da rota 17.', vai:'c15_vilarejo'},
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'}
  ]
},

c15_mirante:{
  texto:[
    'O mirante do trecho dezoito é uma varanda de concreto de oito metros por três, na ponta sul da ciclovia, em cima de uma falésia de quarenta metros.',
    'Tem um binóculo fixo de moeda, daqueles de mirante, que não funciona desde noventa e cinco.',
    'E tem vista.',
    'Vista de trinta quilômetros de mar aberto e, no fim dele, num dia limpo — e hoje está limpo —, uma ilha com um vulcão.',
    'Cinnabar.',
    'Você senta na mureta e olha por muito tempo.',
    'E depois você olha o chão.',
    'O chão do mirante é de concreto queimado pelo sol, cinza claro, com aquela superfície porosa.',
    'E tem marcas.',
    'Três conjuntos de marcas, de pata, em três pontos diferentes da mureta, todos virados pro sul.',
    'Fundas. Não é sujeira: é desgaste. É concreto gasto por apoio repetido, no mesmo lugar, muitas vezes.',
    'Você já viu isso antes, num poço de contenção de transformador, numa beirada de nicho escavado em gelo.',
    'Alguém apoia as patas aqui todas as noites há muito tempo.'
  ],
  ef:{flag:['viu_o_mirante','caes_olham_cinnabar'],
      rep:{eixo:'bom',delta:4,motivo:'Olhou o chão do mirante'},
      instabilidade:1,
      registrar:'No mirante do trecho 18 há três conjuntos de marcas de pata gastas no concreto, virados para Cinnabar.',
      presagio:'Terceira vez que você vê uma marca gasta por repetição. Você já sabe o que isso é.'},
  escolhas:[
    {texto:'Acampar no mirante e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Procurar a quarta marca.', vai:'c15_quarta_marca'},
    {texto:'Ir encontrar a Sumi no trecho 16.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_quarta_marca:{
  texto:[
    'Você procura uma quarta.',
    'Não tem motivo bom pra procurar. Você procura porque três é um número que sempre te deixa desconfiado desde que você contou doze tanques e onze ocupados.',
    'Leva quarenta minutos, e você acha.',
    'Não na mureta. No chão, a quatro metros dela, no canto do mirante, embaixo do banco de concreto.',
    'É uma marca de bota.',
    'Uma marca de bota gasta no concreto, do jeito que sapato gasta degrau de escola: rasa, ampla, com o formato do calcanhar mais fundo que o resto.',
    'Alguém senta no banco desse mirante, com os dois pés no mesmo lugar, olhando pro sul, há tempo suficiente pra gastar concreto.',
    'E a marca não é de hoje: tem musgo na borda dela.'
  ],
  ef:{flag:['achou_a_marca_de_bota','tem_mais_alguem'],
      rep:{eixo:'bom',delta:4,motivo:'Procurou a quarta quando três já bastava'},
      instabilidade:1,
      registrar:'No mirante há também uma marca de bota gasta no concreto, com musgo na borda.',
      presagio:'Uma pessoa senta aqui há anos olhando pro sul. Junto com eles.'},
  escolhas:[
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir perguntar ao Tatsuya quem senta ali.', vai:'c15_quem_senta'},
    {texto:'Ir encontrar a Sumi.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro vilarejo da rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_quem_senta:{
  texto:[
    'Você volta à cabine e pergunta ao Tatsuya quem senta no banco do mirante.',
    'Ele não hesita.',
    '"O Red."',
    'Você fica um tempo sem falar nada.',
    '"O Red."',
    '"É. Ele aparece de vez em quando, sobe até o mirante, senta lá e fica. Às vezes uma noite. Às vezes três."',
    '"E ele fala com você?"',
    '"Ele acena." Tatsuya dá de ombros. "Ele nunca falou uma palavra comigo em quatro anos e ele acena todas as vezes."',
    '"Ele vem fazer o quê?"',
    'Tatsuya olha a estrada.',
    '"Eu acho que ele vem olhar Cinnabar, meu jovem. Mesma coisa que os três."',
    'Ele bebe o café.',
    '"E eu acho que os três vêm porque ele vem, ou que ele vem porque os três vêm, e eu não sei qual das duas e eu já pensei muito."'
  ],
  ef:{flag:['sabe_do_red_no_mirante','tem_mais_alguem'],
      npc:{nome:'Tatsuya', opiniao:6, memoria:'Te contou que Red senta no mirante do trecho 18 há quatro anos, e nunca falou uma palavra.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou quem sentava no banco'},
      instabilidade:1,
      registrar:'Red senta no mirante do trecho 18 há quatro anos, olhando Cinnabar.',
      presagio:'Ele soltou as três aves e depois passou quatro anos sentado olhando uma ilha.'},
  escolhas:[
    {texto:'Acampar no mirante e esperar.', vai:'c15_esperou_a_madrugada'},
    {texto:'"Quando ele vem?"', vai:'c15_quando_ele_vem'},
    {texto:'Ir encontrar a Sumi.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro vilarejo da rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_quando_ele_vem:{
  texto:[
    '"Quando ele vem?"',
    'Tatsuya abre o caderno e vai direto numa página, porque ele anota.',
    '"Doze vezes em quatro anos. Sem padrão de mês."',
    'Ele passa o dedo pelas datas.',
    '"Mas tem uma coisa."',
    '"O quê?"',
    '"Nas doze vezes, os três passaram na madrugada seguinte."',
    'Ele fecha o caderno.',
    '"Doze em doze, meu jovem. Isso não é coincidência, isso é agenda."',
    'Ele olha pra você.',
    '"E a última vez que ele veio foi anteontem."'
  ],
  ef:{flag:['red_veio_anteontem','sabe_que_vem_hoje'],
      npc:{nome:'Tatsuya', opiniao:6, memoria:'Red esteve no mirante anteontem, e em doze de doze vezes os três passaram na madrugada seguinte.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou quando e a resposta tinha data'},
      instabilidade:1,
      registrar:'Red esteve no mirante anteontem. Os três passam sempre na madrugada seguinte.',
      presagio:'Anteontem. Então a madrugada deles já passou. Ou não.'},
  escolhas:[
    {texto:'Acampar no mirante hoje mesmo.', vai:'c15_esperou_a_madrugada'},
    {texto:'Procurar o Red na ciclovia.', vai:'c15_procurou_o_red'},
    {texto:'Ir encontrar a Sumi.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_procurou_o_red:{
  texto:[
    'Você anda a ciclovia inteira de novo, de ponta a ponta, procurando um homem.',
    'Não acha.',
    'Acha o mirante vazio, o banco vazio, e no banco — no assento, não no chão — uma coisa que não estava lá de manhã:',
    'um saco de papel pardo, dobrado na boca, com o peso pra baixo.',
    'Dentro tem dois pães, uma laranja e uma garrafa de água.',
    'Comida pra uma pessoa, deixada num banco de mirante numa ciclovia vazia.',
    'Você olha os vinte e dois quilômetros de estrada nos dois sentidos e não tem ninguém em nenhum deles.',
    'Ele sabia que você estava aqui.'
  ],
  ef:{flag:['red_deixou_comida','red_sabe_de_voce'],
      itens:{'Pão, laranja e água':1},
      rep:{eixo:'bom',delta:2,motivo:'Procurou um homem que não queria ser achado'},
      moral:10,
      registrar:'Alguém deixou comida para você no banco do mirante.',
      presagio:'Ele sabia que você estava aqui. E deixou comida em vez de aparecer.'},
  escolhas:[
    {texto:'Acampar no mirante e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Deixar um bilhete no lugar do saco.', vai:'c15_bilhete_pro_red'},
    {texto:'Ir encontrar a Sumi.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro capinzal.', vai:'c15_capinzal'}
  ]
},

c15_bilhete_pro_red:{
  texto:[
    'Você arranca uma folha do caderno e escreve.',
    'Você escreve três versões. A primeira é uma pergunta longa sobre as aves. A segunda é uma pergunta longa sobre Cinnabar.',
    'A terceira é o que fica, e é uma linha só:',
    '**"Eu subi o vulcão. Tinha três pedras empilhadas."**',
    d=>d.flags.empilhou_a_pedra ? 'E embaixo, você acrescenta: **"Agora tem quatro."**' :
       d.flags.achou_a_mochila_do_fuji ? 'E embaixo, você acrescenta: **"E a mochila dele."**' : '',
    'Você dobra e põe no banco, embaixo de uma pedra.',
    'No dia seguinte, o bilhete não está mais lá.',
    'E no lugar dele, no mesmo banco, embaixo da mesma pedra, tem uma Poké Ball vazia e velha, com a tinta descascada e um arranhão fundo na tampa.',
    'Sem bilhete.',
    'Só a bola.'
  ],
  ef:{flag:['red_respondeu','tem_a_bola_do_red'],
      itens:{'Poké Ball velha e arranhada':1},
      rep:{eixo:'bom',delta:5,motivo:'Escreveu a linha certa na terceira tentativa'},
      moral:15, instabilidade:-1,
      registrar:'Deixou um bilhete no mirante e recebeu uma Poké Ball vazia e arranhada.',
      presagio:'Uma bola vazia. Ele soltou alguma coisa dessa bola e guardou ela mesmo assim.'},
  escolhas:[
    {texto:'Acampar no mirante e esperar.', vai:'c15_esperou_a_madrugada'},
    {texto:'Escrever outro bilhete.', vai:'c15_segundo_bilhete'},
    {texto:'Ir encontrar a Sumi.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro capinzal.', vai:'c15_capinzal'}
  ]
},

c15_segundo_bilhete:{
  texto:[
    'Você escreve de novo. Uma linha só, de novo, porque a primeira funcionou.',
    '**"Eles estão fechando um perímetro em volta de Cinnabar. Você sabe o que tem lá dentro?"**',
    'Você põe embaixo da pedra e espera dois dias no mirante.',
    'No terceiro dia, o bilhete continua lá.',
    'Você abre pra conferir se é o mesmo e é o mesmo, com o mesmo vinco, e a pedra está no mesmo ângulo.',
    'Ele leu e não respondeu.',
    'Ou não voltou.',
    'E você vai passar um bom tempo decidindo qual das duas te incomoda mais.'
  ],
  ef:{flag:'red_nao_respondeu',
      moral:-8,
      registrar:'O segundo bilhete ficou no banco. Red não respondeu.',
      presagio:'Leu e não respondeu, ou não voltou. As duas são respostas.'},
  escolhas:[
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir encontrar a Sumi.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Ir pro vilarejo da rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_nair:{
  texto:[
    'Você acha a Sumi no trecho dezesseis, às dez e vinte da manhã, parada no acostamento com uma prancheta.',
    'Ela tem sessenta e três anos, chapéu de aba larga, calça de caminhada e uma bota que já foi reformada duas vezes.',
    'Ela levanta a mão pra você esperar antes de você abrir a boca, e termina de contar.',
    'Depois anota, e só então olha.',
    '"Quantos?", você pergunta.',
    '"Zero."',
    'Ela vira a prancheta pra você.',
    'A folha tem trinta e uma linhas, uma por trecho de setecentos metros, e em todas está escrito **0** com caneta, com a mesma firmeza.',
    '"E a senhora anota zero trinta e uma vezes?"',
    '"Eu anoto zero trinta e uma vezes, todo dia, há dois meses."',
    'Ela guarda a caneta no bolso da camisa.',
    '"Porque zero é dado, meu filho. Zero é o dado mais importante que existe e é o único que ninguém tem paciência de coletar."'
  ],
  ef:{flag:'conheceu_nair',
      npc:{nome:'Sumi', opiniao:3, memoria:'Anota zero trinta e uma vezes por dia, há dois meses, porque zero é dado.'},
      rep:{eixo:'bom',delta:3,motivo:'Esperou ela terminar de contar'},
      moral:8,
      registrar:'Sumi anota zero em 31 trechos por dia há dois meses.',
      presagio:'"Zero é o dado mais importante e o único que ninguém tem paciência de coletar."'},
  escolhas:[
    {texto:'Andar o trecho com ela.', vai:'c15_andou_com_a_nair'},
    {texto:'"A senhora viu os três."', vai:'c15_nair_viu'},
    {texto:'"A senhora não tem medo?"', vai:'c15_nair_medo'},
    {texto:'Agradecer e ir ao capinzal.', vai:'c15_capinzal'}
  ]
},

c15_andou_com_a_nair:{
  texto:[
    'Você anda o trecho dezesseis com ela. Onze quilômetros, quatro horas, trinta e uma paradas.',
    'Em cada parada ela fica em silêncio dois minutos cronometrados, olhando e ouvindo, e depois anota.',
    'É o trabalho mais chato que você já viu alguém fazer com prazer.',
    'No quilômetro sete, ela para fora do cronômetro e aponta um pé de goiaba na beira do capinzal.',
    '"Olha ali."',
    'O pé está carregado. Goiaba madura, muita, com algumas caídas e apodrecendo no chão.',
    '"Isso aí em setembro tinha quarenta Spearow de manhã. Eu contava quarenta e cinco em dois minutos e eu perdia a conta."',
    'Ela anota zero.',
    '"E a fruta cai e apodrece e ninguém come, e ano que vem esse pé dá menos, porque bicho comendo fruta é o que espalha semente."',
    'Ela guarda a caneta.',
    '"Some bicho, some pé. Some pé, some bicho. A gente tá vendo o começo de uma coisa que leva vinte anos."'
  ],
  ef:{flag:['andou_com_a_nair','entendeu_o_ciclo'],
      npc:{nome:'Sumi', opiniao:7, memoria:'Andou onze quilômetros com você e te mostrou a goiabeira carregada e vazia.'},
      rep:{eixo:'bom',delta:4,motivo:'Andou onze quilômetros só para ver alguém anotar zero'},
      moral:10, hp:-2, causa:'Onze quilômetros de caminhada',
      registrar:'Sem os Spearow, a goiabeira não espalha semente. É o começo de uma coisa de vinte anos.',
      presagio:'Vinte anos. Ninguém vai ligar uma coisa à outra daqui a vinte anos.'},
  escolhas:[
    {texto:'"A senhora viu os três."', vai:'c15_nair_viu'},
    {texto:'"A senhora não tem medo?"', vai:'c15_nair_medo'},
    {texto:'Acampar com ela e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_nair_viu:{
  texto:[
    '"A senhora viu os três."',
    '"Quatro vezes."',
    'Ela senta numa pedra e tira o chapéu.',
    '"Primeira vez em agosto, no dezessete, às quatro e vinte da manhã. Eu tava contando morcego, que é coisa de madrugada."',
    '"E?"',
    '"E eles passaram a uns sessenta metros e eu me agachei atrás de um cupinzeiro e fiquei lá até clarear."',
    '"E nas outras três?"',
    '"Nas outras três eu não me agachei."',
    'Ela mexe no chapéu.',
    '"Na segunda eu fiquei de pé. Na terceira eu fiquei de pé no acostamento, onde dava pra ver. E na quarta eu acendi a lanterna."',
    '"A senhora acendeu a lanterna pra três lendários?"',
    '"Acendi." Ela põe o chapéu. "E o do meio parou."',
    '"E?"',
    '"E olhou pra lanterna, e depois pra mim, e ficou uns dez segundos, e depois seguiu."',
    'Ela levanta da pedra.',
    '"E eu anotei: quatro e trinta e um, três indivíduos não identificados, sentido norte, um deles fez contato visual por dez segundos."',
    'Ela bate na prancheta.',
    '"Isso é dado, meu filho."'
  ],
  ef:{flag:['nair_viu','nair_fez_contato'],
      npc:{nome:'Sumi', opiniao:8, memoria:'Acendeu a lanterna para os três e anotou o contato visual de dez segundos como dado.'},
      rep:{eixo:'bom',delta:4,motivo:'Ouviu a única pessoa em Kanto que fez contato visual e anotou'},
      registrar:'Sumi fez contato visual com um dos três e registrou como dado de levantamento.',
      presagio:'Ela acendeu a lanterna na quarta vez. Guarde a progressão.'},
  escolhas:[
    {texto:'"Vamos hoje à noite. Juntos."', vai:'c15_esperou_a_madrugada'},
    {texto:'"A senhora não tem medo?"', vai:'c15_nair_medo'},
    {texto:'"Qual deles parou?"', vai:'c15_qual_parou'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_qual_parou:{
  texto:[
    '"Qual deles parou?"',
    'Ela vira a prancheta e procura, e acha, porque ela desenha.',
    'O desenho é a lápis, feito no acostamento às quatro e meia da manhã com uma lanterna na boca, e é bom.',
    'Pelagem azul-escura, uma crista que parece fita de tecido, duas caudas compridas.',
    'Suicune.',
    '"Esse."',
    '"A senhora sabe o nome dele?"',
    '"Não."',
    'Ela olha o desenho.',
    '"Eu passei trinta e um anos aprendendo nome de cento e cinquenta e uma espécies e essa aí não tá em nenhum livro que eu tenho, e eu tenho quatro."',
    'Ela fecha a prancheta.',
    '"E eu vou te dizer uma coisa que eu não falo nem pro Tatsuya: eu fiquei feliz."',
    '"Feliz?"',
    '"Sessenta e três anos, meu filho. Trinta e um contando as mesmas espécies nas mesmas rotas."',
    '"E numa madrugada de agosto passou uma coisa que não tem no livro e ela parou e olhou pra mim."',
    'Ela ajeita a mochila.',
    '"Eu voltei pra casa e chorei no banheiro pra ele não ver, e depois eu anotei direito."'
  ],
  ef:{flag:['sabe_que_e_suicune','nair_desenhou'],
      npc:{nome:'Sumi', opiniao:9, memoria:'Desenhou Suicune no acostamento às 4h30 e voltou para casa feliz e chorando.'},
      rep:{eixo:'bom',delta:5,motivo:'Perguntou qual deles, e a resposta era um desenho'},
      moral:15,
      executar:d=>{ Estado.lend(245).encontros++; return []; },
      registrar:'Foi Suicune que parou e olhou para a Sumi.',
      presagio:'Ela chorou de felicidade no banheiro. Depois anotou direito.'},
  escolhas:[
    {texto:'"Vamos hoje à noite. Juntos."', vai:'c15_esperou_a_madrugada'},
    {texto:'"A senhora não tem medo?"', vai:'c15_nair_medo'},
    {texto:'Contar pra ela o nome dele.', vai:'c15_contou_o_nome'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_contou_o_nome:{
  texto:[
    '"Ele se chama Suicune."',
    'Ela para de andar.',
    '"Como?"',
    '"Suicune. Os três se chamam Raikou, Entei e Suicune. Eles não são de Kanto, eles são de Johto, e quase ninguém aqui já viu."',
    'Ela pega a prancheta, tira a caneta do bolso da camisa, e escreve o nome ao lado do desenho.',
    'E escreve devagar, letra por letra, conferindo a grafia com você duas vezes.',
    'Depois ela olha a folha por um tempo.',
    '"Trinta e um anos", ela diz. "Eu nunca tinha escrito um nome que eu não sabia."',
    'Ela guarda a prancheta.',
    '"Obrigada."',
    'E aí ela faz uma coisa que te desmonta: ela aperta a sua mão. Formalmente, com as duas mãos, como quem agradece num velório.'
  ],
  ef:{flag:['nair_sabe_o_nome','nair_aliada'],
      npc:{nome:'Sumi', opiniao:10, memoria:'Escreveu o nome de Suicune ao lado do desenho e apertou sua mão com as duas.'},
      rep:{eixo:'bom',delta:5,motivo:'Deu a alguém um nome que ela procurou por meses'},
      moral:20,
      registrar:'Sumi escreveu o nome de Suicune ao lado do desenho dela.',
      presagio:'Ela agradeceu como quem agradece num velório. Reparou?'},
  escolhas:[
    {texto:'"Vamos hoje à noite. Juntos."', vai:'c15_esperou_a_madrugada'},
    {texto:'"A senhora não tem medo?"', vai:'c15_nair_medo'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Ir pro vilarejo da rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_nair_medo:{
  texto:[
    '"A senhora não tem medo?"',
    '"Tenho."',
    'Sem nenhuma bravata.',
    '"Eu tenho sessenta e três anos e eu sei correr zero metros, e se um daqueles três quiser me machucar eu não chego no acostamento."',
    '"E por que a senhora continua?"',
    'Ela pensa de verdade antes de responder, o que é raro em quem já tem a resposta pronta.',
    '"Porque eu já tive medo de câncer, de ficar viúva e de morrer sozinha, e esses três medos eu levo pra casa todo dia."',
    'Ela ajeita o chapéu.',
    '"Esse aqui é o único medo que vem com uma coisa nova do outro lado."',
    'Ela começa a andar pro próximo ponto de contagem.',
    '"Eu prefiro muito esse."'
  ],
  ef:{flag:'nair_falou_do_medo',
      npc:{nome:'Sumi', opiniao:8, memoria:'Explicou que prefere o medo que vem com uma coisa nova do outro lado.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou do medo'},
      moral:12,
      presagio:'"O único medo que vem com uma coisa nova do outro lado." Guarde, você vai precisar disso na Liga.'},
  escolhas:[
    {texto:'"Vamos hoje à noite. Juntos."', vai:'c15_esperou_a_madrugada'},
    {texto:'"Qual deles parou?"', vai:'c15_qual_parou'},
    {texto:'Andar o trecho com ela.', vai:'c15_andou_com_a_nair'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_vilarejo:{
  texto:[
    'O vilarejo da rota 17 tem dezenove casas, um armazém e um curral comunitário onde as famílias guardam os Tauros de tração.',
    'O curral está destruído.',
    'Não arrombado: destruído. Quatro seções de mourão de eucalipto de vinte centímetros de diâmetro, arrancadas do chão com o concreto da base junto.',
    'E os Tauros estão todos lá, no pasto do lado, pastando.',
    'Nenhum ferido. Nenhum sumido. Onze Tauros que ficaram a noite inteira com o curral aberto e não saíram de perto.',
    'Um homem de uns quarenta anos está recolocando o mourão, sozinho, com uma pá e muita raiva.',
    '"Terceira vez em dois meses", ele diz, sem você perguntar. "Terceira."',
    '"E levaram alguma coisa?"',
    'Ele para de cavar.',
    '"Essa é a parte."',
    '"Nunca levam nada. Nunca machucam ninguém. Só arrebentam o curral e vão embora."'
  ],
  ef:{flag:['viu_o_vilarejo','curral_destruido'],
      npc:{nome:'Dono do curral', opiniao:1, memoria:'Recoloca o mourão do curral comunitário pela terceira vez em dois meses.'},
      registrar:'O curral do vilarejo da rota 17 foi destruído três vezes em dois meses. Nada foi levado.',
      presagio:'Nunca levam nada. Nunca machucam. Só abrem.'},
  escolhas:[
    {texto:'"Eles não estão roubando. Estão abrindo."', vai:'c15_estao_abrindo'},
    {texto:'"Posso ajudar a recolocar?"', vai:'c15_ajudou_o_curral'},
    {texto:'"O senhor viu o que foi?"', vai:'c15_o_que_foi'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_ajudou_o_curral:{
  texto:[
    '"Posso ajudar a recolocar?"',
    'Ele para, olha você, olha a pá.',
    '"Pode."',
    'Vocês passam cinco horas recolocando quatro mourões de eucalipto num buraco de sessenta centímetros com concreto novo, e na terceira hora chegam mais duas pessoas do vilarejo sem ninguém chamar.',
    'É trabalho pesado e chato e ninguém fala quase nada, e no fim tem café e pão na varanda da casa dele.',
    'E aí, na varanda, com o café, ele conta a parte que não contou de pé no sol:',
    '"Meu pai construiu esse curral em setenta e dois."',
    '"E ele tá aberto há dois meses, porque eu conserto e eles abrem, e eu conserto e eles abrem."',
    'Ele olha os onze Tauros no pasto.',
    '"E os bicho não saem. Eu deixei aberto uma semana pra ver e nenhum saiu."',
    '"Eles não querem soltar os seus."',
    '"Não."',
    'Ele bebe o café.',
    '"Eu acho que eles tão treinando."'
  ],
  ef:{flag:['ajudou_o_curral','sabe_que_treinam'],
      npc:{nome:'Dono do curral', opiniao:7, memoria:'Passou cinco horas recolocando mourão com você e disse que acha que eles estão treinando.'},
      rep:{eixo:'bom',delta:5,motivo:'Passou cinco horas cavando buraco de mourão'},
      moral:15, hp:-3, causa:'Cinco horas de trabalho pesado',
      registrar:'Os três abrem o curral repetidamente e nada sai. O dono acha que estão treinando.',
      presagio:'Treinando. Pra abrir uma coisa maior, mais tarde, em outro lugar.'},
  escolhas:[
    {texto:'"Treinando pra quê?"', vai:'c15_estao_abrindo'},
    {texto:'Acampar no curral e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'"O senhor viu o que foi?"', vai:'c15_o_que_foi'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_estao_abrindo:{
  texto:[
    '"Eles não estão roubando. Estão abrindo."',
    'Ele encosta a pá no mourão.',
    '"Como assim abrindo?"',
    '"Três vezes em dois meses, sem levar nada, sem machucar ninguém, num curral onde nada quer sair."',
    '"Isso não é ataque. Isso é prática."',
    'Ele fica quieto.',
    '"Prática de quê?"',
    'E aí você diz em voz alta, pela primeira vez, a coisa que você vinha montando desde a cabine de pedágio:',
    '"De abrir uma coisa que tem alguém preso dentro."',
    'Ele olha o curral.',
    '"E onde é que tem uma coisa dessas?"',
    'Você olha pro sul.',
    'Ele acompanha o seu olhar, e do vilarejo da rota 17, num dia limpo, dá pra ver a linha do mar e, se você souber onde olhar, um ponto que é uma ilha.'
  ],
  ef:{flag:['entendeu_o_treino','caes_olham_cinnabar'],
      rep:{eixo:'bom',delta:5,motivo:'Disse em voz alta a coisa que estava montando'},
      instabilidade:1,
      registrar:'Os três estão praticando abrir estruturas. O alvo é Cinnabar.',
      presagio:'Eles estão treinando pra abrir. E você acabou de ler o caderno de quem escreveu "ele pediu para sair".'},
  escolhas:[
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir até o mirante do trecho 18.', vai:'c15_mirante'},
    {texto:'Ir pro capinzal procurar o rastro.', vai:'c15_capinzal'},
    {texto:'Ir avisar o Tatsuya e a Sumi.', vai:'c15_avisou_os_dois'}
  ]
},

c15_o_que_foi:{
  texto:[
    '"O senhor viu o que foi?"',
    '"Vi a terceira."',
    'Ele apoia a pá.',
    '"Eu dormi no cercado na terceira, com um cassetete de guarda-noturno que não machuca nem Pidgey, porque eu tava com raiva."',
    '"E?"',
    '"E às três e quarenta veio um que era azul e grande e não fez barulho nenhum, e ele arrancou o mourão com a boca."',
    '"Com a boca?"',
    '"Com a boca. Mordeu, puxou e soltou, e o mourão saiu com o concreto e tudo, e ele não olhou pra mim uma vez."',
    'Ele passa a mão na cara.',
    '"E eu tava com a espingarda de chumbinho na mão, deitado atrás do cocho, e eu não levantei."',
    '"O senhor fez certo."',
    '"Eu sei que eu fiz certo." Ele volta a cavar. "É pior saber."'
  ],
  ef:{flag:['dono_viu','sabe_que_e_suicune'],
      npc:{nome:'Dono do curral', opiniao:4, memoria:'Dormiu no curral com uma espingarda de chumbinho e não levantou.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou e deixou o homem admitir o resto'},
      moral:-5,
      executar:d=>{ Estado.lend(245).encontros++; return []; },
      registrar:'Suicune arranca os mourões do curral com a boca, sem olhar para quem está lá.',
      presagio:'"É pior saber." Guarde a frase. Metade do jogo é sobre ela.'},
  escolhas:[
    {texto:'"Eles não estão roubando. Estão abrindo."', vai:'c15_estao_abrindo'},
    {texto:'"Posso ajudar a recolocar?"', vai:'c15_ajudou_o_curral'},
    {texto:'Acampar no curral hoje.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_avisou_os_dois:{
  texto:[
    'Você volta à cabine de pedágio às seis da tarde, quando Tatsuya e Sumi trocam de turno, e conta tudo junto pros dois.',
    'A frente de um trecho por mês. O circuito de trinta e quatro quilômetros. O mirante com as três marcas gastas. O curral aberto três vezes sem nada sair.',
    'Eles ouvem sem interromper, e no fim Sumi abre a prancheta e Tatsuya abre o caderno, e os dois começam a conferir datas em voz alta, um com o outro, como quem faz isso há trinta e um anos.',
    '"Agosto, dia vinte e um, curral."',
    '"Agosto, dia vinte e dois, três indivíduos, sentido norte, quatro e vinte."',
    '"Setembro, dia dez, curral."',
    '"Setembro, dia onze, três indivíduos."',
    '"Outubro, dia dois, curral."',
    '"Outubro, dia três, três indivíduos."',
    'Tatsuya fecha o caderno.',
    '"Eles abrem o curral e no dia seguinte fazem o circuito inteiro."',
    'Sumi escreve na prancheta.',
    '"Isso é ensaio e revisão, meu filho. É o que professor faz."'
  ],
  ef:{flag:['juntou_os_dados','entendeu_o_treino'],
      npc:{nome:'Sumi', opiniao:9, memoria:'Cruzou as datas do curral com as passagens dos três e concluiu: ensaio e revisão.'},
      rep:{eixo:'bom',delta:6,motivo:'Juntou três fontes e deixou quem sabe cruzar'},
      instabilidade:1,
      registrar:'Os três abrem o curral e no dia seguinte refazem o circuito inteiro. É ensaio e revisão.',
      presagio:'"É o que professor faz." Numa semana em que você leu a definição de escola num caderno.'},
  escolhas:[
    {texto:'Acampar no mirante e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir pro capinzal procurar o rastro.', vai:'c15_capinzal'},
    {texto:'Ficar com eles e esperar juntos.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir até o mirante sozinho agora.', vai:'c15_mirante'}
  ]
},

c15_capinzal:{
  texto:[
    'Você sai da ciclovia e entra no capinzal, que tem um metro e meio de altura e que fecha atrás de você depois de quatro passos.',
    'Leva quarenta minutos até você achar a trilha.',
    'E quando você acha, você entende por que ninguém achou antes: ela não é uma trilha de pisoteio, é uma trilha de esmagamento.',
    'Uma faixa de um metro e oitenta de largura onde o capim está deitado, todo no mesmo sentido, e não quebrado.',
    'Deitado e não quebrado quer dizer velocidade muito alta e peso distribuído.',
    'Você segue a faixa por três quilômetros e ela não desvia de nada: passa por cima de formigueiro, de tronco caído, de vala.',
    'E no fundo da vala, na terra úmida onde o capim não cresce, tem pegada.',
    'Você agacha e conta.',
    'Três conjuntos.',
    'E, no barro mais fundo, no meio dos três: uma quarta.',
    'Bota.'
  ],
  ef:{flag:['achou_a_trilha','tem_mais_alguem'],
      rep:{eixo:'bom',delta:4,motivo:'Entrou no capinzal e seguiu três quilômetros de capim deitado'},
      instabilidade:1,
      registrar:'Na trilha dos três há também a pegada de uma bota, no meio das outras.',
      presagio:'No meio. Não atrás. Você já ouviu essa descrição em Cinnabar.'},
  escolhas:[
    {texto:'Seguir a trilha até o fim.', vai:'c15_seguiu_a_trilha'},
    {texto:'Medir e desenhar a pegada de bota.', vai:'c15_desenhou_a_bota'},
    {texto:'Acampar ali e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Voltar pra ciclovia e contar pro Tatsuya.', vai:'c15_avisou_os_dois'}
  ]
},

c15_desenhou_a_bota:{
  texto:[
    'Você mede com a régua da mochila e desenha no caderno.',
    'Bota de cano médio, solado de borracha com desenho em espinha, número quarenta e um, desgaste maior na borda externa do calcanhar direito — que é o que acontece com quem anda muito e pisa de fora pra dentro.',
    'E o desgaste é assimétrico e antigo: essa bota tem muitos quilômetros.',
    'Você desenha a sola inteira, quadrado por quadrado, o que leva vinte e cinco minutos.',
    d=>d.flags.achou_a_marca_de_bota ? 'E aí você compara com a marca gasta no concreto do mirante, que você também desenhou.\nÉ a mesma.' :
       'Você não tem com o que comparar ainda. Você vai ter.',
    'Você fecha o caderno.',
    'Alguém anda com eles. A pé. Em capinzal de um metro e meio, de madrugada, no meio de três lendários que fazem noventa por hora.',
    'E acompanha.'
  ],
  ef:{flag:['desenhou_a_bota','tem_mais_alguem'],
      itens:{'Desenho da sola':1},
      rep:{eixo:'bom',delta:4,motivo:'Mediu e desenhou em vez de supor'},
      registrar:'A pegada de bota da trilha é a mesma marca gasta no concreto do mirante.',
      presagio:'Ele acompanha a pé três coisas que fazem noventa por hora. Pensa no que isso quer dizer.'},
  escolhas:[
    {texto:'Seguir a trilha até o fim.', vai:'c15_seguiu_a_trilha'},
    {texto:'Acampar ali e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Voltar e perguntar ao Tatsuya quem usa bota 41.', vai:'c15_quem_senta'},
    {texto:'Ir até o mirante comparar.', vai:'c15_mirante'}
  ]
},

c15_seguiu_a_trilha:{
  texto:[
    'Você segue a faixa de capim deitado por onze quilômetros.',
    'Ela contorna o vilarejo da rota 17 a quatrocentos metros — contorna, não atravessa —, cruza a ciclovia em dois pontos onde o guarda-corpo está amassado pra fora, e desce pro lado do mar.',
    'E termina numa praia de pedra no fim do trecho dezoito, embaixo da falésia do mirante.',
    'Na praia de pedra, na faixa de areia grossa entre as pedras, tem três depressões.',
    'Três depressões do tamanho de um corpo grande deitado, lado a lado, viradas pro mar.',
    'E a quatro metros delas, no mesmo alinhamento, uma quarta depressão menor, do tamanho de uma pessoa sentada com as costas numa pedra.',
    'Os quatro lugares estão gastos. Muito gastos. Com a areia compactada e a pedra polida onde encosta.',
    'Anos.',
    'Eles ficam aqui. Há anos. Deitados na praia olhando trinta quilômetros de mar aberto.'
  ],
  ef:{flag:['achou_a_praia','caes_olham_cinnabar','tem_mais_alguem'],
      rep:{eixo:'bom',delta:5,motivo:'Seguiu onze quilômetros de capim deitado até o fim'},
      instabilidade:1, moral:-5,
      registrar:'Na praia de pedra do trecho 18 há quatro lugares gastos: três grandes e um de pessoa sentada.',
      presagio:'Quatro lugares gastos por anos. Ninguém está fazendo isso sozinho.'},
  escolhas:[
    {texto:'Sentar no quarto lugar.', vai:'c15_sentou_no_quarto'},
    {texto:'Acampar ali e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Voltar e contar pro Tatsuya e pra Sumi.', vai:'c15_avisou_os_dois'},
    {texto:'Subir ao mirante e olhar de cima.', vai:'c15_mirante'}
  ]
},

c15_sentou_no_quarto:{
  texto:[
    'Você senta no quarto lugar.',
    'A pedra encaixa nas suas costas, e encaixa bem, porque ela foi polida por anos de umas costas encostando.',
    'Daqui, sentado, a vista é exatamente o mar e a ilha e mais nada: a falésia corta os dois lados, o capinzal corta atrás.',
    'É um lugar que só serve pra uma coisa.',
    'Você fica sentado uma hora e quarenta.',
    'E na primeira meia hora você fica pensando em quem senta aqui, e na segunda meia hora você para de pensar em quem senta aqui e começa a só olhar a ilha, e na última quarenta você não está pensando em nada.',
    'E aí você entende por que ele senta aqui.',
    'Não é vigília. É a única coisa que dá pra fazer quando não dá pra fazer nada.'
  ],
  ef:{flag:['sentou_no_quarto_lugar'],
      rep:{eixo:'bom',delta:3,motivo:'Sentou uma hora e quarenta no lugar de outra pessoa'},
      moral:10,
      registrar:'Sentou no quarto lugar da praia por uma hora e quarenta.',
      presagio:'A única coisa que dá pra fazer quando não dá pra fazer nada. Você vai fazer isso de novo.'},
  escolhas:[
    {texto:'Acampar ali e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Voltar e contar pra Sumi.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Subir ao mirante.', vai:'c15_mirante'},
    {texto:'Ir embora dessas rotas.', vai:'c15_fim'}
  ]
},

/* ─────────────── A MADRUGADA ─────────────── */

c15_esperou_a_madrugada:{
  texto:[
    'Você espera.',
    d=>d.flags.conheceu_nair && d.flags.conheceu_otavio ? 'A Sumi e o Tatsuya esperam com você, sentados em cadeirinha de praia dobrável que eles levam há trinta e um anos, com garrafa térmica e a prancheta no colo.\n"Se passarem, eu conto e você olha", ela diz. "Não adianta os dois olharem e ninguém contar."' :
       'Sozinho, com o cobertor, encostado numa pedra, sem fogo, porque fogo se vê de longe.',
    'Faz frio. Vento de sudeste. O mar bate embaixo.',
    'Às duas da manhã você já não sente os dedos do pé.',
    'Às três e quarenta, o chão avisa antes do som.',
    'Não é tremor. É ritmo — batida de pata em solo duro, muito rápida, muito longe, vindo.',
    'E depois o som, e o som chega três segundos depois do chão, o que quer dizer que eles estão a mais ou menos um quilômetro e que você tem uns quarenta segundos.',
    'E aí o vento vira e traz cheiro.',
    'Ozônio, fumaça de mato queimado e uma coisa fria que não tem cheiro e que você sente assim mesmo.'
  ],
  ef:{flag:'esperou_a_madrugada',
      registrar:'Os três passaram às 3h40.',
      presagio:'Quarenta segundos. Decide agora.'},
  escolhas:[
    {texto:'Ficar parado onde está.', vai:'c15_ficou'},
    {texto:'Sair do caminho e se esconder.', vai:'c15_escondeu'},
    {texto:'Acender a lanterna. Como a Sumi fez.', vai:'c15_acendeu_a_lanterna'},
    {texto:'Correr.', vai:'c15_correu'}
  ]
},

c15_acendeu_a_lanterna:{
  texto:[
    'Você acende a lanterna e aponta pro chão a três metros da sua frente, que é o que a Sumi fez, porque apontar na cara é ameaça e apontar no chão é aviso.',
    'Quarenta segundos.',
    'Trinta.',
    'A dez segundos, o som muda: de galope pra galope mais curto, que é como bicho grande desacelera.',
    'Eles param.',
    'Os três, a uns quinze metros, na borda do cone de luz, em fila.',
    'Raikou na frente, com o pelo em pé por carga constante e o ar em volta dele estalando de leve.',
    'Entei no meio, e o capim seco a dois metros dele começa a enrolar de calor.',
    'Suicune atrás, imóvel, e é o mais assustador dos três exatamente por causa disso.',
    'E o do meio — Entei — olha a lanterna. Não você: a lanterna.',
    'Como quem reconhece uma coisa que já viu antes.',
    d=>d.flags.nair_fez_contato ? 'Porque já viu. Em agosto. Numa madrugada, no acostamento, na mão de uma mulher de sessenta e três anos.' : ''
  ],
  ef:{flag:['acendeu_a_lanterna','encarou_os_caes'],
      executar:d=>{ GRUPO_CAES.forEach(x=>Estado.lend(x).encontros++); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Apontou a luz pro chão e não pra cara'},
      registrar:'Acendeu a lanterna e os três pararam a quinze metros.',
      presagio:'Ele reconheceu a lanterna. Não você.'},
  escolhas:[{texto:'Não se mexer.', vai:'c15_encontro'}]
},

c15_correu:{
  texto:[
    'Você corre.',
    'Você corre de uma coisa que faz noventa quilômetros por hora em terreno acidentado, com uma mochila de doze quilos, em capim de um metro e meio, no escuro.',
    'Dura quarenta segundos.',
    'E nos quarenta segundos você não ouve nada atrás, o que é pior, porque quer dizer que eles não estão correndo atrás de você.',
    'Eles estão andando.'
  ],
  ef:{hp:-4, causa:'Queda ao correr na rota 18', moral:-5},
  escolhas:[{texto:'Se virar.', vai:'c15_encontro'}]
},

c15_escondeu:{
  texto:['Você sai do caminho e se joga atrás de um barranco, e a única coisa que existe no mundo nos próximos vinte segundos é a sua própria respiração, que parece absurdamente alta.'],
  teste:{status:'percepcao', dificuldade:8, nomeStatus:'Percepção',
         critico:'c15_viu_sem_ser_visto', sucesso:'c15_viu_sem_ser_visto', parcial:'c15_encontro', falha:'c15_encontro'}
},

c15_viu_sem_ser_visto:{
  texto:[
    'Você se esconde bem o suficiente pra ver sem participar, que é a única forma de ver essa coisa direito.',
    'Eles passam a quarenta metros.',
    'Três vultos, em fila, no mesmo passo, com quatro metros exatos entre um e outro.',
    'Raikou na frente. Entei no meio. Suicune atrás — e Suicune corre de um jeito que não levanta poeira, o que não deveria ser possível num solo que os outros dois estão levantando.',
    'Eles não estão caçando bicho. Não tem bicho pra caçar.',
    'Eles estão fazendo o circuito: mesmo trajeto, mesmo ritmo, com a precisão de coisa que já foi feita muitas vezes.',
    'Duzentos metros depois da sua posição, eles param.',
    'Os três ao mesmo tempo, sem desacelerar antes, com os quatro metros de distância mantidos.',
    'E olham para o sul.',
    'Ficam assim dezenove minutos.',
    'Você cronometra porque é a única coisa que dá pra fazer quando não dá pra fazer nada.'
  ],
  ef:{flag:['viu_os_tres','caes_olham_cinnabar'],
      executar:d=>{ GRUPO_CAES.forEach(x=>Estado.lend(x).encontros++); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Ficou escondido e cronometrou'},
      registrar:'Os três param no mesmo ponto e olham para Cinnabar por dezenove minutos.',
      presagio:'Dezenove minutos, parados, olhando. Todas as madrugadas.'},
  escolhas:[
    {texto:'Sair do esconderijo e chamar a atenção deles.', vai:'c15_encontro'},
    {texto:'Seguir eles.', vai:'c15_seguiu'},
    {texto:'Acampar a distância e vigiar junto.', vai:'c15_vigiou_junto'},
    {texto:'Deixar passar e seguir a rota.', vai:'c15_deixou_passar'}
  ]
},

c15_deixou_passar:{
  texto:[
    'Você espera quarenta minutos depois de eles sumirem e só então sai do barranco.',
    'A rota está vazia. Vai continuar vazia.',
    'Você fez a coisa sensata: você é uma pessoa de quinze anos com uma mochila, e eles são três coisas de cinquenta e cinco níveis, e não existe nenhuma leitura em que sair do barranco melhorasse alguma coisa.',
    'Você vai pensar nisso muitas vezes, e toda vez você vai concluir que fez certo, e toda vez isso não vai ajudar.'
  ],
  ef:{flag:'evitou_os_caes', moral:-8,
      presagio:'Toda vez você vai concluir que fez certo. E toda vez não vai ajudar.'},
  escolhas:[
    {texto:'Voltar e esperar outra madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir contar pro Tatsuya e pra Sumi.', vai:'c15_avisou_os_dois'},
    {texto:'Seguir eles pelo rastro.', vai:'c15_seguiu_a_trilha'},
    {texto:'Seguir viagem.', vai:'c15_fim'}
  ]
},

c15_seguiu:{
  texto:[
    'Você segue três lendários a pé.',
    'É uma ideia ruim e você tem consciência plena disso a cada passo, e você continua, e essa é a definição de tudo o que você faz desde o capítulo um.',
    'Eles não andam rápido quando não estão correndo — andam em ritmo de patrulha, uns seis quilômetros por hora, e dá pra acompanhar de longe se você não tiver pressa e não fizer barulho.',
    'Você segue por quatro horas.',
    'Ao amanhecer, eles chegam num ponto alto do trecho dezoito, de onde se vê o mar e Cinnabar do outro lado.',
    'E fazem uma coisa que você não esperava nunca.',
    'Deitam.',
    'Os três, virados pro sul, com quatro metros entre um e outro, no mesmo lugar onde a areia está compactada há anos.',
    'E ficam.'
  ],
  ef:{flag:['seguiu_os_caes','caes_vigiam_cinnabar','achou_a_praia'],
      rep:{eixo:'bom',delta:3,motivo:'Seguiu três lendários por quatro horas e não atacou nenhum'},
      hp:-3, causa:'Quatro horas seguindo a pé',
      registrar:'Os três deitam num ponto alto do trecho 18 e ficam olhando Cinnabar.',
      presagio:'Eles deitam. Depois do circuito inteiro, eles deitam e olham.'},
  escolhas:[
    {texto:'Acampar e vigiar junto, a distância.', vai:'c15_vigiou_junto'},
    {texto:'Chegar perto.', vai:'c15_encontro'},
    {texto:'Sentar no quarto lugar.', vai:'c15_sentou_no_quarto'},
    {texto:'Voltar e contar pro Tatsuya e pra Sumi.', vai:'c15_avisou_os_dois'}
  ]
},

c15_vigiou_junto:{
  texto:[
    'Você acampa a cento e cinquenta metros e vigia junto. Sem fogo, sem barulho, sem lanterna.',
    'Passa o dia inteiro.',
    'Eles não se mexem o dia inteiro — só um deles, Entei, levanta duas vezes, anda uns vinte metros e volta pro mesmo lugar, do jeito que Arcanine faz quando o corpo não aguenta mais ficar parado.',
    'Às três e quarenta da madrugada, Raikou levanta a cabeça e olha exatamente na sua direção.',
    'Não na direção geral. Na sua.',
    'Ele sabia que você estava ali desde o começo. Ele deixou.',
    'Depois volta a deitar.',
    'De manhã, quando você acorda — porque você dormiu, o que é absurdo —, eles não estão mais lá.',
    'E do lado da sua barraca, no chão de terra batida, tem três marcas de pata.',
    'Uma de cada. Em fila. A quarenta centímetros da sua cabeça.',
    'Eles vieram até você enquanto você dormia e escolheram não fazer absolutamente nada.'
  ],
  ef:{flag:'caes_te_toleram',
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); if(L.disposicao==='neutro') L.disposicao='passivo'; }); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Dormiu a cento e cinquenta metros de três lendários'},
      moral:10,
      registrar:'Os três passaram ao lado da sua barraca enquanto você dormia e não fizeram nada.',
      presagio:'A quarenta centímetros da sua cabeça. Eles quiseram que você soubesse.'},
  escolhas:[
    {texto:'Ficar e vigiar mais uma noite.', vai:'c15_vigiou_junto'},
    {texto:'Chegar perto quando eles voltarem.', vai:'c15_encontro'},
    {texto:'Ir contar pro Tatsuya e pra Sumi.', vai:'c15_avisou_os_dois'},
    {texto:'Seguir viagem.', vai:'c15_fim'}
  ]
},

c15_ficou:{
  texto:[
    'Você fica no meio do caminho.',
    'Não é coragem exatamente — é a sensação, que você não sabe explicar e que você vai passar anos tentando explicar, de que correr seria a pior decisão possível.',
    'Você fica de pé, com as mãos pra baixo, e conta.',
    'Trinta segundos.',
    'Vinte.',
    'A dez segundos você consegue ver o brilho, porque Raikou brilha.',
    'A cinco você sente o calor do Entei na cara.',
    'Eles param a doze metros.',
    'Os três, ao mesmo tempo, sem desacelerar antes — de noventa por hora pra zero em menos de um segundo, o que não é fisicamente possível e acontece.',
    'Silêncio absoluto por quatro segundos.',
    'E depois um barulho pequeno e ridículo: o capim seco voltando a se levantar atrás deles.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Não correu'}, flag:'encarou_os_caes',
      presagio:'De noventa pra zero. Eles pararam porque quiseram parar.'},
  escolhas:[{texto:'Continuar parado.', vai:'c15_encontro'}]
},

c15_encontro:{
  texto:[
    'Os três estão na sua frente.',
    'Raikou, com o pelo levantado por carga elétrica constante e um estalo baixo no ar em volta dele, como fio de alta perto de chuva.',
    'Entei, com o ar tremendo em volta do corpo inteiro e uma linha de capim seco enrolando de calor a dois metros dele.',
    'Suicune, absolutamente imóvel, sem um fio de crista se mexendo com o vento, e o mais assustador dos três por causa disso.',
    d=>{
      const presos = Estado.lendariosCapturados().filter(l=>GRUPO_CAES.includes(l.dex));
      if (presos.length===2) return 'Só que não são três. É um. O terceiro, sozinho, com os outros dois no seu cinto. E "sozinho" nesse caso é uma palavra que significa uma coisa muito específica e muito perigosa.';
      if (presos.length===1) return 'Só que não são três. São dois — porque o terceiro está numa bola no seu cinto, e os dois que sobraram vieram exatamente por causa disso, e vieram fazendo o circuito inteiro pra chegar até aqui.';
      return 'Eles não avançam. Ficam ali, os três, a doze metros, olhando.';
    },
    d=>{
      const presos = Estado.lendariosCapturados().filter(l=>GRUPO_CAES.includes(l.dex));
      if (presos.length) return 'Suicune dá um passo à frente e abaixa a cabeça — não em submissão. Em posição de investida.';
      if (d.flags.tem_sangue_nas_maos) return 'Entei dá um passo à frente. O asfalto embaixo da pata dele racha com o calor, e o som da rachadura é a coisa mais alta da noite.';
      if (d.flags.leu_o_caderno_do_fuji || d.flags.leu_o_sete) return 'E aí Suicune faz uma coisa: vira a cabeça e olha pro sul, e depois volta pra você, e repete. Duas vezes.\nÉ o mesmo gesto que uma ave lendária fez com você na borda de uma cratera.';
      return 'Nenhum dos três avança. Eles estão te medindo, e estão fazendo isso com calma, o que é pior.';
    }
  ],
  ef:{executar:d=>{ GRUPO_CAES.forEach(x=>Estado.lend(x).encontros++); return []; }},
  escolhas:[
    {texto:'Soltar os que você tem. Agora.', vai:'c15_soltou_caes',
     cond:d=>Estado.lendariosCapturados().some(l=>GRUPO_CAES.includes(l.dex))},
    {texto:'Mostrar as mãos vazias e não se mexer.', vai:'c15_maos_vazias'},
    {texto:'Falar com eles. Em voz alta. Como se entendessem.', vai:'c15_falou'},
    {texto:'Oferecer comida.', vai:'c15_comida_caes', cond:d=>Estado.contaItem('Ração')>0},
    {texto:'Atacar. Três lendários numa estrada é uma chance única.', vai:'c15_luta_cao'}
  ]
},

c15_soltou_caes:{
  texto:[
    'Você tira a bola do cinto e abre.',
    'O que sai dela não corre para os outros.',
    'Fica parado, entre vocês, sem saber pra que lado ir — porque passou tempo demais numa bola e o instinto de matilha não é uma chave que liga na hora.',
    'Os outros esperam. Não chamam, não empurram, não fazem nada.',
    'Leva quase dois minutos, e os dois minutos são insuportáveis.',
    'Depois ele anda até eles. Devagar.',
    'E os três se acertam ali, na estrada, na frente de uma pessoa, com uma sequência de gestos pequenos e rápidos que você não entende e que claramente significa alguma coisa.',
    'Só depois disso é que Suicune olha pra você de novo — e dessa vez não é investida.'
  ],
  ef:{executar:d=>{
        const avisos=[];
        [...d.time,...d.pc].filter(p=>GRUPO_CAES.includes(p.dex)).forEach(p=>{
          Captura.soltar(p).forEach(e=>avisos.push({tipo:e.tipo,texto:e.texto}));
        });
        GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); L.disposicao='desconfiado'; L.caçandoVoce=false; });
        Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade-3);
        return avisos;
      },
      rep:{eixo:'bom',delta:4,motivo:'Devolveu um Cão Lendário à matilha, na frente dela'},
      moral:15,
      flag:'devolveu_os_caes', registrar:'Soltou os cães capturados diante dos outros.',
      presagio:'O instinto de matilha não é uma chave que liga na hora. Dois minutos.'},
  escolhas:[
    {texto:'Ficar parado até eles irem.', vai:'c15_foram_embora'},
    {texto:'Falar com eles.', vai:'c15_falou'},
    {texto:'Mostrar as mãos vazias.', vai:'c15_maos_vazias'},
    {texto:'Sentar no chão.', vai:'c15_sentou_na_estrada'}
  ]
},

c15_sentou_na_estrada:{
  texto:[
    'Você senta no chão.',
    'É a coisa mais idiota que dá pra fazer e você faz porque em pé você está tremendo e sentado não dá pra ver tremer.',
    'Eles não reagem por uns vinte segundos.',
    'E aí Entei anda até uns quatro metros de você e deita.',
    'Não relaxado: deita com as patas dianteiras estendidas, a cabeça alta, do jeito que Arcanine deita quando decide que vai ficar um tempo.',
    'E depois Raikou faz o mesmo, do outro lado.',
    'E Suicune não deita. Suicune fica de pé e olha pro sul, e não muda de posição nenhuma vez.',
    'Os três te deram companhia e um deles continuou de guarda.',
    'Você fica sentado no meio de uma ciclovia às quatro da manhã com dois lendários deitados e um de guarda, e você não sabe o que está acontecendo, e nada de ruim está acontecendo.'
  ],
  ef:{flag:['sentou_com_os_caes','caes_te_toleram'],
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); if(L.disposicao!=='hostil') L.disposicao='passivo'; }); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Sentou no chão na frente de três lendários'},
      moral:20,
      registrar:'Sentou na ciclovia e dois dos três deitaram perto. O terceiro ficou de guarda.',
      presagio:'Um deles continuou de guarda. Sempre continua.'},
  escolhas:[
    {texto:'Falar com eles.', vai:'c15_falou'},
    {texto:'Ficar em silêncio até amanhecer.', vai:'c15_ate_amanhecer'},
    {texto:'Ver eles irem.', vai:'c15_foram_embora'},
    {texto:'Oferecer comida.', vai:'c15_comida_caes', cond:d=>Estado.contaItem('Ração')>0}
  ]
},

c15_ate_amanhecer:{
  texto:[
    'Você fica em silêncio até amanhecer.',
    'Duas horas e vinte.',
    'Em algum momento você deita de costas no asfalto da ciclovia, porque doía o quadril, e fica olhando o céu clarear.',
    'Entei dorme. Ele dorme de verdade — ronca de leve, e o ar em volta dele para de tremer quando ele dorme, o que quer dizer que aquilo é esforço e não natureza.',
    'Raikou não dorme mas fecha os olhos.',
    'Suicune fica de pé as duas horas e vinte, virado pro sul, sem mudar de posição.',
    'Às seis e dez o céu clareia o suficiente pra você ver a ilha no horizonte.',
    'E Suicune, que estava de guarda a noite inteira, vira a cabeça e olha pra você pela primeira vez.',
    'E depois olha pra ilha.',
    'E depois pra você.',
    'Três vezes, devagar, como quem explica pra criança.'
  ],
  ef:{flag:['noite_com_os_caes','caes_pediram','caes_olham_cinnabar'],
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); L.disposicao='passivo'; }); return []; },
      rep:{eixo:'bom',delta:6,motivo:'Passou a noite inteira no asfalto com os três'},
      moral:25, hp:-3, causa:'Uma noite no asfalto',
      registrar:'Passou a noite com os três. Suicune te mostrou a ilha três vezes.',
      presagio:'Como quem explica pra criança. É a terceira vez que alguém faz isso com você.'},
  escolhas:[
    {texto:'"Eu vou lá."', vai:'c15_prometeu_caes'},
    {texto:'"O que tem lá?"', vai:'c15_falou'},
    {texto:'Ficar em silêncio e deixar eles irem.', vai:'c15_foram_embora'},
    {texto:'"Eu já fui lá."', vai:'c15_ja_fui_la', cond:d=>!!d.flags.achou_moltres || !!d.flags.viu_a_sala_do_tanque}
  ]
},

c15_ja_fui_la:{
  texto:[
    '"Eu já fui lá."',
    'Os três levantam ao mesmo tempo.',
    'Não é ameaça — é o movimento de três coisas que estavam deitadas e que ficaram de pé por causa de uma frase.',
    'Suicune anda até você. Até muito perto. Até a distância em que você sente a temperatura do hálito dele, que é fria, o que não faz sentido nenhum.',
    'E fica ali.',
    'E você entende que está sendo perguntado e que a pergunta não tem palavra, então você responde com o que tem:',
    '"O tanque tá vazio. Faz quatro anos."',
    d=>d.flags.sabe_que_subiram ? '"E o homem que abriu subiu o vulcão com ele, e os dois passaram a noite lá em cima, e depois só um desceu, e ninguém sabe qual."' :
       '"E eu não sei o que saiu dele."',
    'Suicune fica na sua frente por uns quinze segundos.',
    'E depois faz uma coisa que você não vai conseguir contar direito pra ninguém pelo resto da vida:',
    'ele encosta a testa no seu ombro.',
    'E deixa ali. Uns três segundos.',
    'E depois vira e vai, e os outros dois vão atrás, e eles não correm — andam.'
  ],
  ef:{flag:['contou_pros_caes','caes_aliados'],
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); L.disposicao='passivo'; L.aliado=true; });
        Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade-2);
        return [{tipo:'mundo', texto:'Os três souberam. Eles estavam esperando alguém que tivesse ido.'}]; },
      rep:{eixo:'bom',delta:7,motivo:'Contou a três lendários o que eles esperavam há quatro anos'},
      moral:30, instabilidade:-2,
      registrar:'Contou aos três que o tanque está vazio há quatro anos. Suicune encostou a testa no seu ombro.',
      presagio:'Eles andaram. Depois de quatro anos correndo o mesmo circuito, eles andaram.'},
  escolhas:[
    {texto:'Ver eles irem.', vai:'c15_foram_embora'},
    {texto:'"Eu vou lá de novo. Se vocês quiserem."', vai:'c15_prometeu_caes'},
    {texto:'Ficar sentado no asfalto um tempo.', vai:'c15_foram_embora'},
    {texto:'Ir contar pro Tatsuya e pra Sumi.', vai:'c15_avisou_os_dois'}
  ]
},

c15_maos_vazias:{
  texto:[
    'Você abre as mãos, devagar, e não se mexe mais.',
    'Cinquenta segundos.',
    'Entei é o primeiro a relaxar — o ar em volta dele para de tremer, e o capim seco a dois metros dele para de enrolar.',
    'Depois Raikou: o estalo baixo some e o pelo baixa.',
    'Suicune leva mais tempo e nunca relaxa completamente.',
    'Eles contornam você pela estrada, os três, passando a menos de dois metros, na fila, mantendo os quatro metros entre eles.',
    'Entei encosta de leve no seu braço ao passar.',
    'Não é carinho. É o jeito de dizer "eu podia".',
    'O pelo dele está a uma temperatura que devia queimar e não queima, e você vai levar dias pra parar de pensar nisso.'
  ],
  ef:{executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); if(L.disposicao==='neutro') L.disposicao='passivo'; }); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Ficou de mãos abertas diante de três lendários'},
      moral:8,
      flag:'caes_passaram'},
  escolhas:[
    {texto:'Ver eles irem.', vai:'c15_foram_embora'},
    {texto:'Falar com eles antes de sumirem.', vai:'c15_falou'},
    {texto:'Seguir eles.', vai:'c15_seguiu'},
    {texto:'Sentar no chão.', vai:'c15_sentou_na_estrada'}
  ]
},

c15_comida_caes:{
  texto:[
    'Você coloca a ração na estrada e recua três passos.',
    'Raikou cheira de longe e ignora. Entei nem olha.',
    'Suicune anda até a ração, olha, e depois olha você — e você jura, pelo resto da vida, que aquele olhar era de pena.',
    'Eles não comem ração.',
    'Eles não comem nada que você tenha, nem nada que exista em loja, e você sabe disso desde antes de abrir a mochila e abriu mesmo assim porque não tinha outra coisa pra oferecer.',
    'Mas Suicune fica.',
    'Os outros dois seguem, e Suicune fica mais dez segundos olhando pra você antes de ir.',
    'E nesses dez segundos ele não olha a ração nenhuma vez.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Ração'); const L=Estado.lend(245); if(L.disposicao==='neutro') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:2,motivo:'Ofereceu o que tinha, mesmo sendo inútil'},
      flag:'suicune_ficou'},
  escolhas:[
    {texto:'Falar com ele.', vai:'c15_falou'},
    {texto:'Ver eles irem.', vai:'c15_foram_embora'},
    {texto:'Sentar no chão.', vai:'c15_sentou_na_estrada'},
    {texto:'Tentar capturar Suicune agora que ele ficou.', vai:'c15_luta_cao',
     ef:{rep:{eixo:'ruim',delta:2,motivo:'Atacou o único lendário que tinha ficado'}, flag:'traiu_suicune', moral:-20,
         executar:d=>{ GRUPO_CAES.forEach(x=>{Estado.lend(x).disposicao='hostil';}); return []; }}}
  ]
},

c15_falou:{
  texto:[
    '"Vocês estão olhando pra Cinnabar."',
    'Você diz isso em voz alta, numa estrada vazia, às quatro da manhã, para três animais lendários.',
    'Raikou vira a cabeça de lado.',
    'Um gesto tão de Growlithe de rua, tão comum, tão de bicho que não entendeu a frase mas entendeu que teve frase, que quebra alguma coisa na sua cabeça.',
    'Eles não entendem palavra.',
    'Mas entenderam que você falou, e entenderam que você falou olhando pro sul, porque direção do olhar é uma língua que todo bicho fala.',
    'Suicune anda até você — até muito perto, até você sentir o hálito frio — e depois vira e olha pro sul também.',
    'Vocês dois ficam ali, lado a lado, olhando a mesma ilha, por um tempo que você não consegue medir e que o Tatsuya, se estivesse aqui, mediria.'
  ],
  ef:{flag:['falou_com_os_caes','caes_vigiam_cinnabar'],
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); if(L.disposicao!=='hostil') L.disposicao='passivo'; }); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Falou com três lendários como quem fala com alguém'},
      moral:10,
      registrar:'Falou com os três cães. Suicune olhou para Cinnabar junto com você.',
      presagio:'Direção do olhar é uma língua que todo bicho fala. É a única que vocês dois têm.'},
  escolhas:[
    {texto:'"Eu vou lá."', vai:'c15_prometeu_caes'},
    {texto:'"Eu já fui lá."', vai:'c15_ja_fui_la', cond:d=>!!d.flags.achou_moltres || !!d.flags.viu_a_sala_do_tanque},
    {texto:'"Não tem mais nada lá."', vai:'c15_nao_tem_mais_nada', cond:d=>!!d.flags.viu_a_sala_do_tanque},
    {texto:'Ficar em silêncio.', vai:'c15_foram_embora'}
  ]
},

c15_nao_tem_mais_nada:{
  texto:[
    '"Não tem mais nada lá."',
    'Você diz isso e no segundo em que você termina a frase você percebe que é a coisa mais cruel que dá pra dizer, porque três coisas estão fazendo o mesmo circuito há quatro anos por causa do que tem lá.',
    'Raikou solta um som.',
    'Não é rugido. É um som baixo, curto, na garganta, e é exatamente o som que Arcanine faz quando alguém mexe na porta de casa.',
    'Suicune não reage.',
    'Entei senta. Literalmente senta, no asfalto, como Growlithe esperando o dono, e olha pro sul.',
    'E você fica com a sensação horrível de ter chegado num velório e dito "ele já morreu, gente" pra pessoas que estavam ali fazia quatro anos.'
  ],
  ef:{flag:'disse_que_nao_tem_nada',
      moral:-15,
      rep:{eixo:'bom',delta:1,motivo:'Disse a verdade mesmo sendo a pior versão dela'},
      registrar:'Disse aos três que o tanque está vazio. Entei sentou no asfalto.',
      presagio:'Chegar num velório e dizer "ele já morreu, gente". Pensa em como consertar.'},
  escolhas:[
    {texto:'"Mas alguém saiu vivo dali."', vai:'c15_ja_fui_la', cond:d=>!!d.flags.fuji_saiu || !!d.flags.sabe_que_subiram},
    {texto:'"Desculpa."', vai:'c15_sentou_na_estrada'},
    {texto:'"Eu vou lá de novo."', vai:'c15_prometeu_caes'},
    {texto:'Ficar em silêncio.', vai:'c15_foram_embora'}
  ]
},

c15_prometeu_caes:{
  texto:[
    '"Eu vou lá."',
    'Suicune olha pra você mais uma vez e sai andando — não corre. Anda.',
    'Os outros dois seguem.',
    'A trinta metros, os três param e olham pra trás ao mesmo tempo, esperando você começar a andar.',
    'Eles não estão te acompanhando.',
    'Eles estão conferindo se você vai cumprir.',
    'Você dá o primeiro passo e eles viram e vão, e a última coisa que você vê é o capim se levantando atrás deles.'
  ],
  ef:{flag:['caes_conferindo','prometeu_aos_caes'],
      rep:{eixo:'bom',delta:3,motivo:'Prometeu a três lendários que iria à ilha'},
      moral:10,
      registrar:'Prometeu aos três que iria a Cinnabar.',
      presagio:'Eles estão conferindo. Isso é uma dívida com prazo e sem número.'},
  escolhas:[
    {texto:'Começar a andar.', vai:'c15_fim'},
    {texto:'Ir contar pro Tatsuya e pra Sumi.', vai:'c15_avisou_os_dois'},
    {texto:'Voltar ao mirante primeiro.', vai:'c15_mirante'},
    {texto:'Ir direto pro porto de Fuchsia.', vai:'c15_fim'}
  ]
},

c15_luta_cao:{
  texto:[
    'Você saca uma bola numa estrada, contra três.',
    'Dois deles recuam — não por medo. Por acordo.',
    'Eles decidem, em algum lugar que não é aqui e que você não tem como ver, que é um contra um.',
    'O que fica é o que você escolheu olhar primeiro.'
  ],
  ef:{moral:-10},
  batalha:{aleatorio:false, dex:244, nivel:55, tipo:'lendario', fuga:true, ambiente:'campo',
           vitoria:'c15_pos_cao', derrota:'c15_pos_cao', fuga2:'c15_fugiu_dos_caes',
           captura:'c15_capturou_cao', gameover:'gameover'}
},

c15_pos_cao:{
  texto:[
    'Ele recua para junto dos outros.',
    'Os três te olham em silêncio por um tempo desconfortavelmente longo, e depois viram e vão embora juntos — no mesmo passo, sem pressa, com os quatro metros mantidos.',
    'Eles vieram, foram atacados por uma pessoa, e foram embora sem matar essa pessoa.',
    'Isso é a coisa mais próxima de julgamento que você já recebeu na vida.'
  ],
  ef:{executar:d=>{
        GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); L.ataquesSofridos++; if(L.ataquesSofridos>=2) L.disposicao='hostil'; });
        return [{tipo:'mundo', texto:'Os três se afastaram. Eles decidiram alguma coisa sobre você.'}];
      },
      rep:{eixo:'ruim',delta:2,motivo:'Atacou os Cães Lendários na rota 18'}, moral:-10},
  escolhas:[
    {texto:'Tentar de novo com outro.', vai:'c15_luta_cao'},
    {texto:'Parar e mostrar as mãos vazias.', vai:'c15_maos_vazias'},
    {texto:'Parar e falar com eles.', vai:'c15_falou'},
    {texto:'Parar.', vai:'c15_foram_embora'}
  ]
},

c15_fugiu_dos_caes:{
  texto:[
    'Você foge de três lendários numa estrada aberta, o que só funciona porque eles deixam.',
    'Você entende isso enquanto corre — no meio da corrida, com o ar acabando — e não é uma sensação boa.',
    'Você para depois de uns quatrocentos metros porque não dá mais, e olha pra trás, e eles estão exatamente onde estavam.',
    'Nem se mexeram.'
  ],
  ef:{hp:-3, causa:'Fuga na ciclovia', moral:-8},
  escolhas:[
    {texto:'Voltar.', vai:'c15_encontro'},
    {texto:'Continuar fugindo.', vai:'c15_fim'},
    {texto:'Ir contar pro Tatsuya.', vai:'c15_avisou_os_dois'},
    {texto:'Acampar e tentar outra noite.', vai:'c15_esperou_a_madrugada'}
  ]
},

c15_capturou_cao:{
  texto:[
    'A bola fecha numa estrada aberta, na frente dos outros dois.',
    'Eles não atacam.',
    'Isso é o mais perturbador de tudo: eles não atacam.',
    'Raikou dá um passo à frente e cheira a bola no seu cinto, com o focinho a dez centímetros da sua cintura, e você não se mexe porque não dá.',
    'Depois recua.',
    'E aí os dois saem correndo — não para longe. Em volta.',
    'Um círculo de duzentos metros de raio, em velocidade máxima, em torno de você, e o chão vibra o círculo inteiro, e a única coisa que existe no mundo por noventa segundos é o som de duas coisas correndo em volta de você.',
    'Eles dão três voltas e vão embora.',
    'Você acabou de ser marcado de um jeito que não sai.'
  ],
  ef:{instabilidade:2, flag:'marcado_pelos_caes', moral:-15,
      registrar:'Capturou um Cão Lendário. Os outros dois deram três voltas em torno de você antes de sumir.',
      presagio:'Três voltas. Eles fizeram um perímetro em volta de você.'},
  escolhas:[
    {texto:'Soltar imediatamente.', vai:'c15_soltou_caes'},
    {texto:'Ficar com ele.', vai:'c15_ficou_com_cao'},
    {texto:'Soltar e sentar no chão.', vai:'c15_soltou_caes'},
    {texto:'Sair correndo com ele.', vai:'c15_ficou_com_cao'}
  ]
},

c15_ficou_com_cao:{
  texto:[
    'Você segue viagem com um Cão Lendário no cinto.',
    'Nos dias seguintes, três coisas acontecem em ordem.',
    'Primeiro, você começa a ouvir passos à noite, sempre a uma distância que não dá pra confirmar, sempre parando quando você para.',
    'Segundo, Pokémon selvagens param de aparecer nas rotas onde você anda. Todos. Como se avisassem uns aos outros com dois dias de antecedência.',
    'Terceiro, num vilarejo da rota 17, você chega e encontra dois currais destruídos, sem nenhum ferido, e um homem de quarenta anos recolocando mourão de eucalipto sozinho, com uma pá e muita raiva, pela quarta vez em dois meses.',
    'E ele olha pra você e pergunta se você viu alguma coisa na estrada.',
    'E você diz que não.',
    'Eles não vão te atacar de frente.',
    'Eles vão andar na sua frente abrindo coisa até você entender.'
  ],
  ef:{flag:'caes_caçam_voce', instabilidade:2, moral:-20,
      rep:{eixo:'ruim',delta:3,motivo:'Manteve um Cão Lendário e os outros começaram a destruir propriedades'},
      executar:d=>{ GRUPO_CAES.forEach(x=>{const L=Estado.lend(x); if(L.estado!=='capturado'){L.disposicao='hostil';L.caçandoVoce=true;}}); return []; },
      registrar:'Os cães passaram a abrir currais no seu rastro.',
      presagio:'Eles vão abrir coisa até você entender. Eles são bons em abrir coisa.'},
  escolhas:[
    {texto:'Voltar e soltar.', vai:'c15_soltou_caes'},
    {texto:'Ajudar o homem a recolocar o mourão.', vai:'c15_ajudou_o_curral'},
    {texto:'Seguir.', vai:'c15_fim'},
    {texto:'Contar a verdade pro homem do curral.', vai:'c15_contou_pro_dono'}
  ]
},

c15_contou_pro_dono:{
  texto:[
    '"Foi por minha causa."',
    'Ele para de cavar.',
    'Você conta: a bola no cinto, a estrada, as três voltas.',
    'Ele ouve tudo apoiado na pá.',
    'E no fim ele não grita, não te bate, não te manda embora.',
    'Ele diz uma coisa pior:',
    '"E você vai soltar?"',
    'E fica esperando a resposta com a pá na mão, e você tem que responder na frente de um homem que está consertando um mourão pela quarta vez por sua causa.'
  ],
  ef:{flag:'contou_pro_dono',
      npc:{nome:'Dono do curral', opiniao:2, memoria:'Ouviu você admitir que os currais eram por sua causa, e perguntou se você ia soltar.'},
      rep:{eixo:'bom',delta:3,motivo:'Contou a verdade a quem estava pagando a conta'},
      moral:-5,
      presagio:'Ele perguntou e ficou esperando. Com a pá na mão.'},
  escolhas:[
    {texto:'"Vou." E soltar ali mesmo.', vai:'c15_soltou_caes'},
    {texto:'"Não." E encarar.', vai:'c15_disse_que_nao'},
    {texto:'Ajudar a recolocar o mourão primeiro.', vai:'c15_ajudou_o_curral'},
    {texto:'Ir embora sem responder.', vai:'c15_fim'}
  ]
},

c15_disse_que_nao:{
  texto:[
    '"Não."',
    'Ele assente devagar e volta a cavar.',
    'E é isso: ele não discute, não xinga, não te manda embora.',
    'Ele cava o buraco do mourão e você fica ali de pé uns dois minutos e depois vai embora, e ele não olha pra cima nenhuma vez.',
    'E na sua última olhada pra trás, saindo do vilarejo, dá pra ver ele ainda cavando, sozinho, no sol das duas da tarde.',
    'Ele vai consertar de novo na semana que vem.',
    'E na outra.'
  ],
  ef:{flag:'disse_que_nao_solta',
      npc:{nome:'Dono do curral', opiniao:-3, memoria:'Perguntou se você ia soltar, ouviu não, e voltou a cavar.'},
      rep:{eixo:'ruim',delta:3,motivo:'Disse que não ia soltar, na frente de quem paga a conta'},
      moral:-20,
      registrar:'Disse ao dono do curral que não ia soltar.',
      presagio:'Ele vai consertar de novo na semana que vem. E na outra.'},
  escolhas:[
    {texto:'Voltar e soltar.', vai:'c15_soltou_caes'},
    {texto:'Voltar e ajudar a cavar, pelo menos.', vai:'c15_ajudou_o_curral'},
    {texto:'Seguir.', vai:'c15_fim'},
    {texto:'Mandar dinheiro pro vilarejo depois.', vai:'c15_fim', ef:{dinheiro:-8000, rep:{eixo:'bom',delta:1,motivo:'Pagou o mourão que ele mesmo custou'}}}
  ]
},

c15_foram_embora:{
  texto:[
    'Eles vão embora em fila, no mesmo passo, e o som some antes deles sumirem de vista, o que é ao contrário do que deveria.',
    'A estrada leva quase uma hora pra voltar a ter bicho.',
    'Quando volta, um Rattata sai do capim, olha pra você, e some de novo.',
    'E é a coisa mais normal que aconteceu no seu dia, e você fica absurdamente feliz de ver um Rattata.'
  ],
  ef:{flag:'caes_foram_embora', moral:5},
  escolhas:[
    {texto:'Seguir.', vai:'c15_fim'},
    {texto:'Ir contar pro Tatsuya e pra Sumi.', vai:'c15_avisou_os_dois'},
    {texto:'Seguir eles pelo rastro.', vai:'c15_seguiu_a_trilha'},
    {texto:'Voltar amanhã à noite.', vai:'c15_esperou_a_madrugada'}
  ]
},

c15_fim:{
  texto:[
    d=>{
      if (d.flags.contou_pros_caes) return 'Você contou a três coisas de cinquenta e cinco níveis, numa ciclovia às seis da manhã, que o tanque está vazio faz quatro anos. E uma delas encostou a testa no seu ombro.';
      if (d.flags.caes_caçam_voce) return 'Nos próximos dias, cada lugar por onde você passa amanhece com alguma coisa aberta. Nunca ninguém ferido. Sempre alguma coisa aberta.';
      if (d.flags.caes_vigiam_cinnabar || d.flags.caes_olham_cinnabar) return 'Três lendários olhando pra mesma ilha por quatro anos não é comportamento de caça nem de território. É comportamento de quem espera uma coisa sair de lá.';
      return 'Você não sabe o que eles estavam fazendo ali. Ninguém sabe. Esse é o ponto dos lendários — eles não explicam, e a gente inventa a explicação, e quase sempre a nossa é pior que a deles.';
    },
    d=>{
      if (d.flags.juntou_os_dados || d.flags.viu_a_frente) return 'E no caderno de um homem que anota tudo há treze anos, numa cabine de pedágio que não cobra pedágio há nove, tem uma frente de esvaziamento de fauna de um trecho por mês, e faltam dois trechos até Fuchsia.';
      if (d.flags.nair_sabe_o_nome) return 'E numa prancheta, ao lado de um desenho a lápis feito às quatro e meia da manhã com uma lanterna na boca, tem um nome escrito com a grafia conferida duas vezes.';
      return 'E em cinco rotas de Kanto, onze placas de concreto continuam descrevendo espécies que não moram mais ali.';
    },
    'Em Fuchsia, no cais, um velho pescador está contando uma história que ninguém acredita.',
    '"Eu vi um arco-íris de noite", ele diz. "Sobre a ilha que não tem nome. De noite."',
    'Todo mundo ri.',
    'Você não.'
  ],
  fim:true, resumo:'Capítulo 15 concluído — os três estão esperando uma coisa sair de Cinnabar.'

}

}}

);
