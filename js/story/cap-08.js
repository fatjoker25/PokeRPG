/* ------------------------------------------------------------
   ABERTURAS — porto é lugar de portão, e portão separa quem
   entra de quem fica. Quem chega com dinheiro, quem chega sem,
   quem chega com crachá e quem chega com nome na boca do povo
   encontram portões diferentes.
   ------------------------------------------------------------ */
const C8_ABERTURAS = ['c8_chegada', 'c8_ab_sem_passagem', 'c8_ab_parede_de_gente', 'c8_ab_convite', 'c8_ab_pelo_portao_de_carga'];
function c8_cabe(id, d){
  if (id === 'c8_ab_sem_passagem') return d.jogador.dinheiro < 2000;
  if (id === 'c8_ab_convite')      return Estado.rep.eixo === 'bom' && Estado.rep.bom >= 4;
  if (id === 'c8_ab_pelo_portao_de_carga')
    return Estado.rep.eixo === 'ruim' && Estado.rep.ruim >= 3 || d.via === 'foragido';
  return true;
}
function c8_abertura(d){
  const cand = C8_ABERTURAS.filter(id => c8_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 8 — TODO MUNDO PAGA PASSAGEM  (Vermilion / S.S. Anne)
   ============================================================ */
CAPITULOS.push(
{
num:8, titulo:'Todo Mundo Paga Passagem', local:'Vermilion / S.S. Anne', ambiente:'agua', nivelArea:30,
tom:'sombrio', entradas:C8_ABERTURAS,
inicio: d => c8_abertura(d),
cenas:{

c8_ab_sem_passagem:{
  texto:[
    'A passarela do cais três tem uma roleta e a roleta tem um preço, e o preço está numa placa de acrílico em quatro idiomas.',
    'Visitação a bordo: 2.000 ₽.',
    d=>`Você tem ${d.jogador.dinheiro} ₽.`,
    'Tem umas quinze pessoas encostadas no gradil do lado de fora, olhando o navio, e você entende em cinco segundos que as quinze estão na mesma situação que você.',
    'Ninguém fala isso em voz alta. Todo mundo olha o navio como se estivesse ali pela vista.',
    'Um rapaz mais ou menos da sua idade cospe no chão sem mirar em nada.',
    fala('o rapaz do gradil', 'Dois mil pra subir num barco que não vai a lugar nenhum.'),
    d=>fala(d.jogador.nome, 'Ele não navega?'),
    fala('o rapaz do gradil', 'Navega quatro vezes por ano. O resto do tempo ele é um hotel que flutua.'),
    fala('o rapaz do gradil', 'E quem tá lá dentro não pagou dois mil, ó. Quem tá lá dentro foi convidado.')
  ],
  ef:{flag:'ficou_do_lado_de_fora', registrar:'A visitação ao S.S. Anne custa 2.000 ₽. Você ficou no gradil.'},
  escolhas:[
    {texto:'Perguntar como se consegue convite.', vai:'c8_ab_como_se_consegue'},
    {texto:'Procurar trabalho no cais pra levantar os dois mil.', vai:'c8_ab_trabalho'},
    {texto:'Dar a volta e procurar outro jeito de entrar.', vai:'c8_ab_a_volta'},
    {texto:'Deixar o navio pra depois e andar pela cidade.', vai:'c8_cidade'}
  ]
},

c8_ab_como_se_consegue:{
  texto:[
    'Ele ri e o riso não é simpático nem antipático, é só cansado.',
    fala('o rapaz do gradil', 'Três jeitos. Ser rico, ser famoso, ou trabalhar lá dentro.'),
    fala('o rapaz do gradil', 'Meu tio trabalha. Cozinha. Entra pelo portão de carga às quatro da manhã e sai às onze da noite, e ele já subiu nesse navio mais vezes que qualquer milionário de Kanto.'),
    d=>fala(d.jogador.nome, 'E ele conta o que tem lá dentro?'),
    'O rapaz para de olhar o navio e olha pra você pela primeira vez.',
    fala('o rapaz do gradil', 'Ele contava. Faz umas três semanas que ele parou de contar.', 'baixo'),
    fala('o rapaz do gradil', 'Continua indo todo dia. Só parou de contar.')
  ],
  ef:{flag:'o_tio_parou_de_contar',
      registrar:'Um cozinheiro do S.S. Anne parou de contar o que vê a bordo, mas continua indo todo dia.',
      presagio:'Quem para de contar viu alguma coisa que dá medo de repetir.'},
  escolhas:[
    {texto:'Perguntar onde fica o portão de carga.', vai:'c8_ab_a_volta'},
    {texto:'Procurar trabalho no cais.', vai:'c8_ab_trabalho'},
    {texto:'Ir andar pela cidade.', vai:'c8_cidade'}
  ]
},

c8_ab_trabalho:{
  texto:[
    'O cais contrata por dia e contrata na hora: tem um quadro de giz do lado do galpão dois com o que precisa e quanto paga.',
    'Descarga de contêiner refrigerado, 400 ₽ por turno de quatro horas. Limpeza de casco, 700 ₽ e você trabalha pendurado. Conferência de carga, 900 ₽ e precisa saber ler rápido.',
    'O homem da prancheta te mede de cima a baixo sem nenhuma grosseria, do jeito que se mede um saco pra saber se cabe.',
    fala('o conferente', 'Idade?'),
    d=>fala(d.jogador.nome, 'Quinze.'),
    fala('o conferente', 'Então não é limpeza de casco. Pendurado só com dezoito.'),
    'Ele escreve o seu nome numa lista de doze e a lista de doze é o turno das duas.'
  ],
  ef:{flag:'pegou_turno_no_cais', registrar:'Se inscreveu para um turno de trabalho no cais de Vermilion.'},
  escolhas:[
    {texto:'Pegar a descarga de refrigerado. 400 ₽.', vai:'c8_ab_refrigerado'},
    {texto:'Pegar a conferência de carga. 900 ₽.', vai:'c8_ab_conferencia'},
    {texto:'Desistir e ir andar pela cidade.', vai:'c8_cidade'}
  ]
},

c8_ab_refrigerado:{
  texto:[
    'Quatro horas dentro de um contêiner a dois graus, tirando caixa de peixe de um lado e pondo do outro.',
    'Nos primeiros quarenta minutos é suportável. Depois da primeira hora, as pontas dos dedos param de ter opinião sobre o que estão segurando.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} passa os quatro turnos do lado de fora do contêiner, sentado na doca, e não sai de lá.`
               : 'Você faz as quatro horas sozinho e não é a pior coisa que já aconteceu essa semana.';
    },
    'No fim, o conferente conta quatrocentos na sua mão em notas usadas e você sai do galpão com o cheiro no cabelo.',
    'O cheiro vai levar dois dias pra sair. Isso não estava no quadro de giz.'
  ],
  ef:{dinheiro:400, hp:-3, flag:'trabalhou_no_frio',
      registrar:'Trabalhou quatro horas num contêiner refrigerado. 400 ₽.'},
  escolhas:[
    {texto:'Pegar outro turno.', vai:'c8_ab_trabalho'},
    {texto:'Ir pro navio com o que você tem.', vai:'c8_cais'},
    {texto:'Chega. Andar pela cidade.', vai:'c8_cidade'}
  ]
},

c8_ab_conferencia:{
  texto:[
    'Conferência de carga é o trabalho mais fácil do cais e por isso paga mais, o que é uma das coisas mais estranhas que você já viu.',
    'Você fica com uma prancheta na mão de manifesto e confere número de contêiner contra número de lista enquanto eles passam.',
    'Quatro horas. Duzentos e onze contêineres. Duzentos e nove batem.',
    'Os dois que não batem estão no manifesto do S.S. Anne e a descrição dos dois é "suprimentos de bordo — perecível".',
    'Contêiner de perecível é refrigerado. Esses dois não são: são secos, lacrados, e têm furo de ventilação de trinta em trinta centímetros na lateral.',
    'Você aponta pro conferente. Ele olha, confere, e faz uma coisa que você não esperava: risca a sua observação da prancheta com a caneta dele.',
    fala('o conferente', 'Esses dois são do navio.'),
    d=>fala(d.jogador.nome, 'Eu sei. Tá errado.'),
    fala('o conferente', 'Esses dois são do navio.', 'frio')
  ],
  ef:{dinheiro:900, flag:'dois_conteineres_com_furo',
      registrar:'Dois contêineres do S.S. Anne têm furo de ventilação e manifesto de perecível seco. O conferente riscou a observação.',
      presagio:'Furo de ventilação existe por um motivo só, e não é para conservar comida.'},
  escolhas:[
    {texto:'Insistir com o conferente.', vai:'c8_ab_insistiu'},
    {texto:'Não insistir. Pegar o dinheiro e ir pro navio.', vai:'c8_cais'},
    {texto:'Não insistir. Andar pela cidade e pensar.', vai:'c8_cidade'}
  ]
},

c8_ab_insistiu:{
  texto:[
    d=>fala(d.jogador.nome, 'Tem furo de ventilação na lateral.'),
    'Ele para de andar. Olha pros lados antes de falar, e no cais de Vermilion olhar pros lados não adianta nada porque tem trezentas pessoas em volta.',
    fala('o conferente', 'Escuta. Eu faço isso há dezenove anos.'),
    fala('o conferente', 'Eu já conferi carga que eu sabia o que era. Já conferi carga que eu não quis saber.'),
    fala('o conferente', 'A diferença entre as duas é que na segunda eu ainda tenho emprego.', 'baixo'),
    'Ele arranca a folha do manifesto, dobra em quatro, e põe no seu bolso sem pedir licença.',
    fala('o conferente', 'Some com isso. E não trabalha mais nesse cais essa semana.')
  ],
  ef:{flag:'provas_navio',
      npc:{nome:'o conferente', opiniao:1, viuVoce:'Te deu a folha do manifesto e te mandou sumir do cais.'},
      registrar:'O conferente te entregou a folha do manifesto com os dois contêineres irregulares.'},
  escolhas:[
    {texto:'Ir pro cais três olhar o navio de perto.', vai:'c8_cais'},
    {texto:'Andar pela cidade primeiro.', vai:'c8_cidade'}
  ]
},

c8_ab_a_volta:{
  texto:[
    'O cais três tem um portão de visitação e tem um portão de carga, e o de carga fica oitocentos metros mais pro norte, depois do galpão sete.',
    'Não tem roleta. Tem uma cancela de ferro, um guarita com um homem dentro e um fluxo de caminhão que não para.',
    'Você fica vinte minutos olhando e aprende três coisas.',
    'Uma: ninguém apresenta documento. Duas: todo mundo que entra a pé está de colete laranja. Três: tem uma pilha de coletes laranja num carrinho do lado de fora da guarita, e o carrinho está ali porque os coletes são de todo mundo e de ninguém.',
    'O homem da guarita está de costas, resolvendo alguma coisa num telefone de fio.'
  ],
  ef:{flag:'viu_o_portao_de_carga', registrar:'O portão de carga do cais três não pede documento — pede colete laranja.'},
  escolhas:[
    {texto:'Pegar um colete e entrar.', vai:'c8_ab_de_colete_entrou'},
    {texto:'Não. Voltar pro portão de visitação.', vai:'c8_cais'},
    {texto:'Andar pela cidade e pensar no assunto.', vai:'c8_cidade'}
  ]
},

c8_ab_de_colete_entrou:{
  texto:[
    'Você veste o colete no meio do caminho, sem parar de andar, que é a única maneira de fazer isso sem parecer que você está fazendo isso.',
    'Passa pela cancela atrás de um carrinho de empilhadeira. O homem da guarita não olha.',
    'Do lado de dentro, o porto é outro lugar: menos organizado, mais barulhento, e com muito mais gente parada do que se vê de fora.',
    'Ninguém pergunta nada. Um colete laranja é um passaporte perfeito porque ele responde a pergunta antes dela ser feita.',
    'O S.S. Anne está a duzentos metros e daqui dá pra ver o que não dá pra ver do gradil: tem uma segunda passarela, menor, na popa, e por ela não sobe passageiro nenhum.'
  ],
  ef:{flag:['entrou_de_colete','segunda_passarela'],
      rep:{eixo:'ruim', delta:1, motivo:'Entrou na área restrita do porto vestindo um colete que não era seu.'},
      registrar:'Entrou no cais três pelo portão de carga, de colete. Tem uma segunda passarela na popa.'},
  escolhas:[
    {texto:'Seguir até a segunda passarela.', vai:'c8_cais'},
    {texto:'Andar pela área de carga vendo o que dá pra ver.', vai:'c8_olhou_o_porto'}
  ]
},

c8_ab_parede_de_gente:{
  texto:[
    'Vermilion cheira a sal, diesel e fritura, e hoje cheira também a gente parada, que é um cheiro diferente de gente andando.',
    'Tem uma parede de gente no fim da Avenida do Porto. Umas duzentas pessoas, faixa pintada à mão, e um homem em cima de uma caixa de feira com um megafone de pilha.',
    'A faixa diz: CONTÊINER LACRADO NÃO É CARGA, É CONTRABANDO.',
    fala('o homem do megafone', 'Dezenove! Dezenove contêineres em dois meses que ninguém abriu, ninguém pesou, ninguém conferiu!'),
    fala('o homem do megafone', 'E todos com destino registrado no mesmo navio!'),
    'Do outro lado da rua, a uns quarenta metros, tem oito guardas portuários parados em linha, sem capacete, sem escudo, com as mãos pra trás.',
    'Eles não estão ali pra dispersar ninguém. Estão ali pra ser vistos.',
    d=>{
      const r = Estado.nomeRep();
      if (Estado.rep.eixo === 'bom' && Estado.rep.bom >= 4) return `Alguém no meio da multidão te reconhece e fala "${r}" alto demais, e umas trinta cabeças viram ao mesmo tempo.`;
      return 'Ninguém te reconhece. Você é mais uma pessoa que parou pra ver o que era.';
    }
  ],
  ef:{flag:'a_manifestacao_do_porto',
      registrar:'Duzentas pessoas protestam no porto de Vermilion contra dezenove contêineres lacrados em dois meses.'},
  escolhas:[
    {texto:'Ficar e ouvir o homem do megafone até o fim.', vai:'c8_ab_ouviu'},
    {texto:'Ir falar com os guardas do outro lado.', vai:'c8_ab_os_guardas'},
    {texto:'Contornar e descer pro cais três.', vai:'c8_cais'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'}
  ]
},

c8_ab_ouviu:{
  texto:[
    'Ele fala mais dezoito minutos e nos dezoito minutos não repete nenhum número, o que quer dizer que ele anotou tudo antes.',
    'No fim ele desce da caixa e vira uma pessoa normal de uns cinquenta anos com uma camisa suada, e é essa versão dele que fala com você quando você chega perto.',
    fala('o homem do megafone', 'Você é de onde?'),
    d=>fala(d.jogador.nome, 'De passagem.'),
    fala('o homem do megafone', 'Todo mundo aqui é de passagem. Eu sou daqui e sou de passagem.'),
    'Ele enrola o fio do megafone com muito cuidado, na dobra certa, como quem vai usar de novo amanhã.',
    fala('o homem do megafone', 'A gente tá aqui há onze dias. Sabe quantos jornalistas vieram?'),
    d=>fala(d.jogador.nome, 'Quantos?'),
    fala('o homem do megafone', 'Dois. Os dois do jornal de Vermilion. Os dois escreveram. Nenhum dos dois saiu impresso.')
  ],
  ef:{flag:'nada_saiu_impresso',
      npc:{nome:'o homem do megafone', opiniao:1, viuVoce:'Você ficou até o fim da fala dele no porto.'},
      registrar:'Dois repórteres escreveram sobre os contêineres de Vermilion. Nenhuma das duas matérias saiu impressa.',
      presagio:'Matéria escrita que não sai impressa foi parada por alguém acima do repórter.'},
  escolhas:[
    {texto:'Perguntar o nome dos dois jornalistas.', vai:'c8_ab_os_nomes'},
    {texto:'Descer pro cais três.', vai:'c8_cais'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'}
  ]
},

c8_ab_os_nomes:{
  texto:[
    fala('o homem do megafone', 'Saya Kurata e um rapaz novo que eu não lembro o sobrenome.'),
    'Você anota. Ele repara que você anota e isso muda a cara dele.',
    fala('o homem do megafone', 'A Kurata voltou aqui depois. Sozinha, sem crachá, de tarde.'),
    fala('o homem do megafone', 'Ela não perguntou nada sobre o protesto. Ela perguntou o horário da maré.'),
    d=>fala(d.jogador.nome, 'Da maré?'),
    fala('o homem do megafone', 'Da maré. E foi embora com o horário anotado.'),
    'Ele dá de ombros, mas é um dar de ombros que sabe que aquilo significa alguma coisa.'
  ],
  ef:{flag:'kurata_perguntou_da_mare',
      npc:{nome:'Saya Kurata', conhece:true, viuVoce:'Ainda não te viu — você ouviu falar dela primeiro.'},
      registrar:'Saya Kurata voltou ao porto sem crachá e perguntou o horário da maré.'},
  escolhas:[
    {texto:'Descer pro cais três.', vai:'c8_cais'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'}
  ]
},

c8_ab_os_guardas:{
  texto:[
    'Você atravessa a rua e chega nos oito, e os oito te veem chegar de longe e nenhum muda de posição.',
    'O do meio é o que fala, o que quer dizer que ele é o que manda.',
    fala('o guarda do meio', 'Não pode passar por aqui.'),
    d=>fala(d.jogador.nome, 'Eu não ia passar. Eu ia perguntar.'),
    'Isso desarma ele por meio segundo.',
    fala('o guarda do meio', 'Pergunta.'),
    d=>fala(d.jogador.nome, 'Vocês vão abrir os contêineres?'),
    'Silêncio. O guarda da ponta esquerda muda o peso de perna.',
    fala('o guarda do meio', 'A gente não abre contêiner. A gente guarda portão.'),
    fala('o guarda do meio', 'Quem abre contêiner é a alfândega.'),
    d=>fala(d.jogador.nome, 'E a alfândega tá aonde?'),
    'Ele olha pro lado, pro prédio da alfândega, que está a cento e vinte metros com as luzes acesas e a porta fechada, e que está assim há onze dias.',
    fala('o guarda do meio', 'Boa pergunta.', 'baixo')
  ],
  ef:{flag:'alfandega_fechada_ha_onze_dias',
      registrar:'A alfândega de Vermilion está de luz acesa e porta fechada há onze dias.'},
  escolhas:[
    {texto:'Ir até a porta da alfândega.', vai:'c8_ab_a_porta'},
    {texto:'Voltar pro protesto.', vai:'c8_ab_ouviu'},
    {texto:'Descer pro cais três.', vai:'c8_cais'}
  ]
},

c8_ab_a_porta:{
  texto:[
    'A porta da alfândega é de vidro fumê com um adesivo do brasão de Kanto descascando na altura do joelho.',
    'Tem um papel colado por dentro, impresso, com data de onze dias atrás:',
    'ATENDIMENTO SUSPENSO POR TEMPO INDETERMINADO — REESTRUTURAÇÃO INTERNA.',
    'Você bate. Bate de novo. Na terceira vez, uma sombra passa do lado de dentro e não para.',
    'Você fica olhando o vidro até entender que o reflexo é melhor que a transparência: no reflexo, dá pra ver os oito guardas do outro lado da rua todos virados pra você.',
    'Os oito. Ao mesmo tempo.'
  ],
  ef:{flag:'bateu_na_alfandega',
      registrar:'Tem gente dentro da alfândega de Vermilion, com o atendimento suspenso há onze dias.',
      presagio:'Prédio fechado com gente dentro não está fechado. Está escolhendo quem entra.'},
  escolhas:[
    {texto:'Descer pro cais três.', vai:'c8_cais'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'}
  ]
},

c8_ab_convite:{
  texto:[
    'Você não chega a andar cem metros dentro de Vermilion.',
    'Tem um homem de terno claro encostado num carro parado na entrada da cidade, e ele levanta a mão quando te vê, do jeito que se chama um táxi.',
    d=>{
      const r = Estado.nomeRep();
      return `Ele fala o seu nome e depois "${r}" e depois sorri, e a ordem dessas três coisas foi ensaiada.`;
    },
    fala('o homem de terno claro', 'O comandante pediu pra eu te esperar aqui desde ontem.'),
    d=>fala(d.jogador.nome, 'Que comandante?'),
    fala('o homem de terno claro', 'Do S.S. Anne. Ele acompanha o que sai nos jornais.'),
    'Ele abre a porta de trás do carro, o que é um jeito de encerrar a conversa.',
    fala('o homem de terno claro', 'Jantar às oito. Terno a gente empresta. Você só precisa entrar no carro.'),
    'A distância da entrada de Vermilion até o cais três é de dois quilômetros e meio, e a pé leva quarenta minutos, e você tem as duas opções na mão.'
  ],
  ef:{flag:'convite_do_comandante',
      registrar:'O comandante do S.S. Anne mandou um carro te esperar na entrada de Vermilion.',
      presagio:'Convite que te espera desde ontem não é convite. É captura com boas maneiras.'},
  escolhas:[
    {texto:'Entrar no carro.', vai:'c8_ab_entrou_no_carro'},
    {texto:'Recusar e ir a pé.', vai:'c8_ab_recusou_o_carro'},
    {texto:'Perguntar por que ele está te esperando desde ontem.', vai:'c8_ab_desde_ontem'}
  ]
},

c8_ab_desde_ontem:{
  texto:[
    'Ele não perde o sorriso mas leva um segundo a mais pra responder do que levou pra falar o seu nome.',
    fala('o homem de terno claro', 'Porque o comandante achou que você chegaria ontem.'),
    d=>fala(d.jogador.nome, 'E como ele sabia que eu chegaria?'),
    fala('o homem de terno claro', 'Você veio de Lavender pela Rota 11. Tem uma estrada só.'),
    'Isso é verdade e não responde nada.',
    fala('o homem de terno claro', 'Olha, eu sou motorista. Eu dirijo e eu espero. Quem sabe as coisas é quem manda esperar.'),
    'Ele destranca a porta de trás de novo, e dessa vez o gesto tem menos certeza.'
  ],
  ef:{flag:'o_motorista_nao_sabe',
      registrar:'O carro te esperava desde ontem. O motorista não sabe como sabiam da sua rota.'},
  escolhas:[
    {texto:'Entrar no carro.', vai:'c8_ab_entrou_no_carro'},
    {texto:'Recusar e ir a pé.', vai:'c8_ab_recusou_o_carro'}
  ]
},

c8_ab_entrou_no_carro:{
  texto:[
    'O carro desce a cidade inteira em seis minutos e não para em nenhum sinal, o que quer dizer que ele não pegou nenhum vermelho ou que ele não para em vermelho.',
    'Pela janela, Vermilion passa em ordem inversa à que você teria visto a pé: primeiro o cais, depois a cidade, depois o resto.',
    'Ele entra pelo portão de carga, não pelo de visitação. A cancela sobe antes do carro chegar.',
    'No cais três, do lado da passarela, tem um homem de uniforme branco com quatro listras douradas na manga esperando, e ele começa a andar na sua direção antes do carro parar.',
    'Você ainda não desceu do carro e já deve alguma coisa pra alguém. Você não sabe ainda o quê.'
  ],
  ef:{flag:['aceitou_o_convite','entrou_pelo_portao_de_carga'],
      registrar:'Entrou no S.S. Anne pelo portão de carga, a convite do comandante.',
      presagio:'A cancela subiu antes do carro chegar. Esse carro passa por ali todo dia.'},
  escolhas:[
    {texto:'Descer e cumprimentar o comandante.', vai:'c8_cais'}
  ]
},

c8_ab_recusou_o_carro:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu vou a pé.'),
    fala('o homem de terno claro', 'São dois quilômetros e meio.'),
    d=>fala(d.jogador.nome, 'Eu sei.'),
    'Ele fecha a porta de trás sem bater, entra no carro e desce a avenida devagar, no seu ritmo, os dois quilômetros e meio inteiros.',
    'Ele não te ultrapassa. Ele desce na sua frente, a trinta metros, em segunda marcha, durante quarenta minutos.',
    'No fim dos quarenta minutos você chega no cais três a pé e ele já está lá, parado, com a porta de trás aberta.',
    fala('o homem de terno claro', 'Jantar às oito.', 'frio')
  ],
  ef:{flag:['recusou_o_convite','o_carro_te_seguiu'],
      registrar:'Recusou o carro do comandante. Ele desceu a avenida inteira na sua frente, em segunda marcha.',
      presagio:'Recusar um convite assim não cancela o convite. Só informa quem convidou.'},
  escolhas:[
    {texto:'Ir até a passarela do cais três.', vai:'c8_cais'},
    {texto:'Ignorar o carro e andar pela cidade.', vai:'c8_cidade'}
  ]
},

c8_ab_pelo_portao_de_carga:{
  texto:[
    'Você entra em Vermilion pela linha do trem, não pela estrada, porque a estrada tem um posto na entrada e o posto tem uma lista.',
    'Andar em leito de linha é ilegal, cansativo e razoavelmente perigoso, e é a coisa mais sensata que você faz hoje.',
    'Do leito da linha, o porto aparece de trás: pátio de contêiner, oficina, galpão, e só no fim a água.',
    d=>{
      if (d.via === 'foragido') return 'Você conhece esse tipo de entrada agora. Aprendeu em algum momento dos últimos meses e não lembra exatamente quando, o que é a parte que incomoda.';
      return 'Você nunca tinha entrado numa cidade assim. Foi mais fácil do que devia ser, e essa é a parte que incomoda.';
    },
    'No pátio tem um carrinho com coletes laranja de todo mundo e de ninguém, e ninguém olha duas vezes pra quem está de colete.',
    'A duzentos metros, o S.S. Anne: um prédio deitado na água com nove fileiras de janela acesa.'
  ],
  ef:{flag:'entrou_por_tras', registrar:'Entrou em Vermilion pela linha do trem, evitando o posto da estrada.'},
  escolhas:[
    {texto:'Pegar um colete e andar pelo pátio como se fosse seu.', vai:'c8_ab_de_colete_entrou'},
    {texto:'Sair do pátio e entrar na cidade normalmente.', vai:'c8_cidade'},
    {texto:'Sentar num canto e olhar o porto trabalhar antes de decidir.', vai:'c8_olhou_o_porto'}
  ]
},


c8_chegada:{
  texto:[
    'Vermilion cheira a três coisas na mesma proporção: sal, óleo diesel e fritura.',
    'O porto trabalha vinte e quatro horas e o barulho não para nunca — guindaste, buzina de ré, corrente, metal em metal. Depois de duas horas você para de ouvir. Depois de seis, você vai reparar que parou de ouvir.',
    'A cidade é toda em declive até a água. De qualquer rua dá pra ver o mar no fim, e no mar tem navio.',
    'E tem o S.S. Anne.',
    'Ele está atracado no cais três e é grande de um jeito que fotografia não transmite: um prédio deitado na água, com janelas acesas em nove fileiras.',
    d=>{
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=5) return 'Um funcionário do cais te reconhece, cutuca o colega, e os dois discutem baixo se devem te chamar. Não chamam. Mas discutem, e você vê.';
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) return 'Dois seguranças mudam de posição quando você passa. Não é coincidência: eles se posicionam entre você e a passarela do cais três.';
      return 'Ninguém olha pra você duas vezes. Num porto, isso é um privilégio e você ainda não sabe disso.';
    }
  ],
  ef:{registrar:'Chegou ao porto de Vermilion.'},
  escolhas:[
    {texto:'Descer até o cais três e ver o navio de perto.', vai:'c8_cais'},
    {texto:'Andar pela cidade primeiro.', vai:'c8_cidade'},
    {texto:'Procurar onde se come nessa cidade.', vai:'c8_fritura'},
    {texto:'Sentar num banco e olhar o porto trabalhar.', vai:'c8_olhou_o_porto'}
  ]
},

c8_olhou_o_porto:{
  texto:[
    'Você senta na mureta de um canteiro e fica olhando.',
    'Um porto é a coisa mais organizada que você já viu. Tudo tem lugar, tudo tem ordem, tudo tem alguém apontando com uma prancheta.',
    'Um contêiner sai do navio, pousa num caminhão, o caminhão anda quarenta metros, para numa balança, e segue. Repete. Repete.',
    'Depois de quarenta minutos você entende a coisa mais importante do porto: ninguém abre nada.',
    'Nada é aberto. Nada é conferido por dentro. Tudo é conferido por número, por lacre e por peso.',
    d=>d.flags.conferem_por_numero
      ? 'Você já ouviu isso numa passarela de grade dentro de uma montanha. "Eles conferem por número, não por bicho."'
      : 'Você não sabe por que isso te incomoda tanto.'
  ],
  ef:{flag:'entendeu_o_porto',
      presagio:'Ninguém abre nada. Um porto inteiro funciona confiando num número e num lacre.'},
  escolhas:[
    {texto:'Descer até o cais três.', vai:'c8_cais'},
    {texto:'Ir falar com quem tem a prancheta.', vai:'c8_prancheta'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'},
    {texto:'Ir comer.', vai:'c8_fritura'}
  ]
},

c8_prancheta:{
  texto:[
    'O homem da prancheta tem uns quarenta anos e uma caneta amarrada com barbante na prancheta, porque caneta some.',
    '"Pois não."',
    '"Como funciona a conferência?"',
    'Ele te olha de cima a baixo e decide que você é curioso e não problema.',
    '"Lacre, número, peso." Ele mostra. "Se o lacre tá inteiro e o número bate e o peso tá dentro da margem, passa."',
    '"E se tiver coisa errada dentro?"',
    '"Aí é problema do destinatário."',
    'Ele já está olhando o próximo contêiner.',
    '"Eu confiro cento e oitenta por turno, garoto. Se eu abrisse um, eu atrasava o porto inteiro."'
  ],
  ef:{flag:'lacre_numero_peso',
      npc:{nome:'Conferente do porto', opiniao:1, memoria:'Te explicou que a conferência é por lacre, número e peso — nunca por dentro.'},
      presagio:'"Aí é problema do destinatário." A frase inteira desse sistema cabe nessas quatro palavras.'},
  escolhas:[
    {texto:'"E se o peso não bater?"', vai:'c8_peso'},
    {texto:'Descer até o cais três.', vai:'c8_cais'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'},
    {texto:'Agradecer e sair.', vai:'c8_fritura'}
  ]
},

c8_peso:{
  texto:[
    '"E se o peso não bater?"',
    '"Aí retém."',
    'Ele vira uma folha da prancheta.',
    '"Acontece umas três vezes por semana. Quase sempre é erro de digitação."',
    '"Quase sempre?"',
    'Ele para de escrever.',
    '"Ano passado reteve um que tava quarenta quilo mais leve que a nota." Ele coça a orelha com a caneta amarrada. "Aí veio um cara de terno com um papel e liberou em quarenta minuto."',
    '"Que papel?"',
    '"Papel." Ele dá de ombros. "Eu leio número, moço. Eu não leio papel."'
  ],
  ef:{flag:'papel_libera_carga', registrar:'No porto, um homem de terno já liberou carga retida com um papel em quarenta minutos.',
      presagio:'Um papel que libera quarenta quilos de diferença em quarenta minutos. Você conhece o cabeçalho.'},
  escolhas:[
    {texto:'"Que cara de terno? Você lembra?"', vai:'c8_lembra_do_terno'},
    {texto:'Descer até o cais três.', vai:'c8_cais'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'}
  ]
},

c8_lembra_do_terno:{
  texto:[
    '"Que cara de terno? Você lembra?"',
    '"Lembro do sapato."',
    'Ele ri de si mesmo.',
    '"Sério. Eu trabalho num porto há vinte e dois ano e eu reparo em sapato. Sapato limpo aqui é notícia."',
    d=>d.flags.sapato_limpo
      ? 'Você já ouviu isso, num chão de caverna, de um homem que limpava a mão no jeans.'
      : 'Você guarda isso sem saber por quê.',
    '"E o crachá dele não era do porto e não era de Liga." Ele volta pra prancheta. "Tinha um desenho de balança."'
  ],
  ef:{flag:['sapato_limpo','brasao_no_porto'],
      registrar:'O homem de terno que libera carga retida no porto usa crachá com uma balança.',
      presagio:'A balança tem acesso ao porto de Vermilion. Isso é outro patamar.'},
  escolhas:[
    {texto:'Descer até o cais três.', vai:'c8_cais'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'},
    {texto:'Ir comer e pensar.', vai:'c8_fritura'}
  ]
},

c8_cidade:{
  texto:[
    'Vermilion acima do porto é uma cidade normal que finge não depender do porto.',
    'Tem praça com coreto, tem escola, tem farmácia. E tem, em cada duas quadras, um bar que abre às cinco da manhã pro turno da noite.',
    'Na rua paralela ao cais, um galpão baixo de manutenção portuária, reformado, com um cabo mais grosso que o seu braço saindo por baixo da porta e entrando numa caixa de passagem na calçada.',
    'De fora dá pra sentir cheiro de ozônio — aquele cheiro de depois de raio.',
    'Não tem placa. Tem uma marca de queimado no batente da porta, na altura do ombro.'
  ],
  ef:{executar:d=>{ Mundo.descobrir('ginasio_vermilion'); Mundo.descobrir('achou_ginasio_vermilion'); return [{tipo:'eco', texto:'Você vai lembrar desse galpão.'}]; }},
  escolhas:[
    {texto:'Chegar perto da porta do galpão.', vai:'c8_galpao'},
    {texto:'Entrar num dos bares que abrem às cinco.', vai:'c8_bar'},
    {texto:'Descer até o cais três.', vai:'c8_cais'},
    {texto:'Ir comer.', vai:'c8_fritura'}
  ]
},

c8_galpao:{
  texto:[
    'Você chega perto. O cabo entra na caixa de passagem da calçada e a tampa da caixa está quente.',
    'Lá dentro tem um zumbido constante, e de uns quarenta em quarenta segundos um estalo.',
    'A porta abre sozinha — não sozinha: alguém abre, de dentro, e sai um rapaz de uns dezoito anos com o cabelo em pé de um jeito que não é penteado.',
    'Ele te vê.',
    '"Tá aberto", ele diz. "Mas se você tá aqui por acaso, não entra."',
    '"Por quê?"',
    '"Porque quem entra por acaso apanha." Ele acende um cigarro com a mão tremendo um pouco. "Quem entra de propósito apanha também. Mas aí é escolha."'
  ],
  ef:{flag:'aviso_do_galpao',
      presagio:'Ele estava tremendo. Não era medo — era outra coisa, e passa em uns vinte minutos.'},
  escolhas:[
    {texto:'"Quem tá lá dentro?"', vai:'c8_quem_ta_dentro'},
    {texto:'Entrar de propósito.', vai:'c8_entrou_galpao'},
    {texto:'"Valeu." E ir pro cais.', vai:'c8_cais'},
    {texto:'Perguntar do cabo e da caixa de passagem.', vai:'c8_o_cabo'}
  ]
},

c8_quem_ta_dentro:{
  texto:[
    '"Quem tá lá dentro?"',
    '"O Surge."',
    'Ele fala o nome como quem fala de clima.',
    '"Ele foi militar. De verdade, não de história." O rapaz traga. "Não é ruim. É que ele acha que gentileza atrapalha o aprendizado."',
    '"E atrapalha?"',
    'O rapaz pensa nisso com uma seriedade genuína.',
    '"Eu vim aqui três vez. Na primeira eu chorei. Na segunda eu durei quatro turno." Ele joga o cigarro no chão e pisa. "Na terceira eu ganhei."',
    '"E o que mudou?"',
    '"Eu parei de tentar não apanhar."'
  ],
  ef:{flag:'sabe_do_surge',
      presagio:'"Eu parei de tentar não apanhar." Isso não é sabedoria. É uma coisa que fica na cabeça mesmo assim.'},
  escolhas:[
    {texto:'Entrar de propósito.', vai:'c8_entrou_galpao'},
    {texto:'Voltar outro dia.', vai:'c8_cais'},
    {texto:'Perguntar do cabo.', vai:'c8_o_cabo'},
    {texto:'Ir comer e pensar.', vai:'c8_fritura'}
  ]
},

c8_o_cabo:{
  texto:[
    '"Por que o cabo é tão grosso?"',
    'O rapaz olha o cabo como se nunca tivesse reparado.',
    '"Ah. É que o ginásio puxa da subestação do porto direto."',
    '"Isso pode?"',
    '"Pode não." Ele ri. "É gambiarra de trinta ano. Eles fizeram na época que o porto era do governo e ninguém desfez."',
    'Ele aponta a caixa de passagem.',
    '"Quando ele treina forte, a luz da rua pisca. Você vai ver. Todo mundo dessa quadra sabe a hora que tem desafio."'
  ],
  ef:{flag:'a_luz_pisca',
      presagio:'A luz da rua pisca quando ele treina. A cidade inteira sabe e ninguém reclama.'},
  escolhas:[
    {texto:'Entrar de propósito.', vai:'c8_entrou_galpao'},
    {texto:'Ir pro cais.', vai:'c8_cais'},
    {texto:'Ir comer.', vai:'c8_fritura'}
  ]
},

c8_entrou_galpao:{
  texto:[
    'Você empurra a porta.',
    'O chão do galpão é de concreto com pintura de quadra descascada e tem cheiro de ozônio de um jeito que dá gosto metálico na boca.',
    'No fundo, um homem enorme está prendendo um cabo num poste de aterramento com uma chave de fenda, agachado, de costas pra porta.',
    'Ele não vira.',
    '"Desafio é quinta e sexta, das duas às seis. Hoje não é nem um nem outro."',
    '"Como o senhor sabe que eu—"',
    '"Porque ninguém entra aqui por outro motivo." Ele aperta o parafuso. "Volta quinta. E vem com o time descansado, porque eu não pego leve e eu não vou pegar leve com você."'
  ],
  ef:{flag:'falou_com_surge',
      npc:{nome:'Líder Surge', opiniao:1, memoria:'Você entrou no galpão fora do horário. Ele te mandou voltar na quinta.'},
      executar:d=>{ Mundo.descobrir('ginasio_vermilion'); Mundo.descobrir('achou_ginasio_vermilion'); return []; },
      presagio:'Ele nem virou pra olhar. Você vai querer que ele vire, um dia.'},
  escolhas:[
    {texto:'"Por que o senhor não pega leve?"', vai:'c8_porque_nao_pega_leve'},
    {texto:'Sair e ir pro cais.', vai:'c8_cais'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'},
    {texto:'Ir comer.', vai:'c8_fritura'}
  ]
},

c8_porque_nao_pega_leve:{
  texto:[
    '"Por que o senhor não pega leve?"',
    'Aí ele vira.',
    'Ele tem uns quarenta e cinco anos e uma cicatriz que entra no cabelo acima da orelha esquerda.',
    '"Porque eu peguei leve uma vez."',
    'Ele volta pro aterramento.',
    '"Moleque de dezesseis. Eu vi que ele não tava pronto, eu segurei, ele ganhou a insígnia e saiu daqui feliz."',
    'Ele aperta o parafuso com mais força do que o parafuso precisa.',
    '"Ele foi pro Monte da Lua na semana seguinte."',
    'Ele não termina a frase. Não precisa.'
  ],
  ef:{flag:'a_historia_do_surge',
      npc:{nome:'Líder Surge', opiniao:2, memoria:'Te contou por que não pega leve: pegou leve uma vez, com um garoto de dezesseis.'},
      presagio:'Uma insígnia dada por gentileza matou alguém. É por isso que a sua vai custar caro.'},
  escolhas:[
    {texto:'"Isso não foi culpa sua."', vai:'c8_nao_foi_culpa'},
    {texto:'Ficar calado e sair.', vai:'c8_cais'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'},
    {texto:'"Eu volto na quinta."', vai:'c8_cais'}
  ]
},

c8_nao_foi_culpa:{
  texto:[
    '"Isso não foi culpa sua."',
    'Surge ri. É uma risada sem nada dentro.',
    '"Eu sei que não foi."',
    'Ele levanta. É muito maior de pé.',
    '"Isso é o tipo de coisa que todo mundo me fala e que é verdade e que não muda nada." Ele guarda a chave de fenda no bolso do macacão. "Eu não mudei porque me sinto culpado, garoto. Eu mudei porque funciona melhor."',
    'Ele pega uma toalha.',
    '"Todo moleque que sai daqui apanhado vai pro Monte da Lua sabendo que existe uma coisa maior que ele. Isso salva vida. Insígnia de graça não salva ninguém."'
  ],
  ef:{flag:'entendeu_o_surge',
      npc:{nome:'Líder Surge', opiniao:3, memoria:'Você disse que não foi culpa dele. Ele explicou que não muda por culpa, muda porque funciona.'},
      presagio:'"Existe uma coisa maior que você." Ele está falando de um Raichu. Você vai encontrar coisas bem maiores.'},
  escolhas:[
    {texto:'Sair e ir pro cais.', vai:'c8_cais'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'},
    {texto:'"E o navio? O senhor sabe do S.S. Anne?"', vai:'c8_surge_navio'}
  ]
},

c8_surge_navio:{
  texto:[
    '"O senhor sabe do S.S. Anne?"',
    'Surge para de enxugar a nuca.',
    '"Sei que ele atraca quatro vezes por ano e que a cidade fatura o ano inteiro nessas quatro semanas."',
    '"E?"',
    '"E que na semana que ele atraca, o número de ocorrência policial no porto cai quase a zero." Ele joga a toalha no ombro. "Isso não é porque melhora, garoto. É porque ninguém registra."',
    'Ele olha pra porta do galpão, pra rua em declive, pro mar no fim.',
    '"Eu fui militar. Eu sei como é lugar onde ninguém registra nada."'
  ],
  ef:{flag:'aviso_do_surge_sobre_o_navio',
      registrar:'Na semana em que o S.S. Anne atraca, as ocorrências policiais do porto caem a quase zero.',
      presagio:'Ninguém registra. Você vai entrar naquele navio sabendo disso.'},
  escolhas:[
    {texto:'Ir pro cais.', vai:'c8_cais'},
    {texto:'"O senhor já entrou nele?"', vai:'c8_surge_entrou'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'}
  ]
},

c8_surge_entrou:{
  texto:[
    '"O senhor já entrou nele?"',
    '"Uma vez. Convidado, de gravata, como líder de ginásio."',
    'Ele faz uma careta com a palavra gravata.',
    '"Fiquei quarenta minutos e desci."',
    '"Por quê?"',
    '"Porque tinha um sujeito no salão explicando pra uma roda de gente, com taça na mão, que existe um jeito certo e um jeito errado de ser dono de um bicho."',
    'Ele pendura a toalha num gancho.',
    '"E todo mundo tava concordando."'
  ],
  ef:{flag:'o_sujeito_do_salao',
      presagio:'Um jeito certo e um jeito errado de ser dono de um bicho. E todo mundo concordando, com taça na mão.'},
  escolhas:[
    {texto:'Ir pro cais.', vai:'c8_cais'},
    {texto:'"Quem era o sujeito?"', vai:'c8_quem_era_o_sujeito'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'}
  ]
},

c8_quem_era_o_sujeito:{
  texto:[
    '"Quem era o sujeito?"',
    '"Não sei o nome." Surge dá de ombros. "Sei que ele volta todo ano. Camarote de cima."',
    'Ele pega a chave de fenda de novo.',
    '"E sei que ele é educado do jeito que assusta. Aquele educado que não é pra ser gentil, é pra deixar claro que ele não precisa levantar a voz."',
    'Ele volta pro aterramento.',
    '"Eu conheci oficial assim. Os que levantam a voz você aprende a lidar. Os que não levantam, não."'
  ],
  ef:{flag:'o_homem_do_camarote', registrar:'Um homem de camarote superior volta ao S.S. Anne todo ano.',
      presagio:'Educado do jeito que assusta. Camarote de cima. Todo ano.'},
  escolhas:[
    {texto:'Ir pro cais.', vai:'c8_cais'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'},
    {texto:'Ir comer e pensar.', vai:'c8_fritura'}
  ]
},

c8_olhou_surge:{
  texto:[
    'Você fica encostado no batente vendo um homem de quarenta e cinco anos consertar um aterramento.',
    'Ele leva quase uma hora. Testa três vezes. Refaz uma vez inteira porque não gostou do jeito que ficou.',
    'Quando acaba, ele solta um Raichu do cinto sem cerimônia nenhuma e diz uma frase curta, e o Raichu descarrega no poste, e a luz do galpão pisca, e os dois olham o medidor.',
    'Ele não comemora e não comemora de um jeito que é claramente a versão dele de comemorar.',
    'Depois ele coça a cabeça do Raichu, uma vez, rápido, do jeito de quem não quer que ninguém veja.'
  ],
  ef:{flag:'viu_o_surge_com_o_raichu', moral:5,
      npc:{nome:'Líder Surge', opiniao:1, memoria:'Você ficou uma hora vendo ele consertar um aterramento.'},
      presagio:'Uma coçada rápida na cabeça, de quem não quer que ninguém veja. Guarda isso pra quando ele te derrubar.'},
  escolhas:[
    {texto:'Ir pro cais.', vai:'c8_cais'},
    {texto:'Ir comer.', vai:'c8_fritura'},
    {texto:'Ir pro bar do turno da noite.', vai:'c8_bar'}
  ]
},

c8_bar:{
  texto:[
    'O bar abre às cinco da manhã e às onze da noite está cheio de gente do turno que acabou.',
    'Ninguém está bêbado. É diferente: é gente cansada bebendo devagar, com o corpo ainda em posição de trabalho.',
    'Você pede uma coisa qualquer e fica ouvindo, porque bar de porto é onde tudo se fala e ninguém repara em adolescente.',
    '"...o Anne atraca amanhã à noite." / "Já atracou." / "Já?" / "Cais três, desde as quatro."',
    'E numa mesa do fundo, mais baixo: "Esse ano eles vão levar de novo?" / "Todo ano levam." / "Não é da nossa conta."'
  ],
  ef:{flag:'ouviu_no_bar',
      presagio:'"Todo ano levam." "Não é da nossa conta." Você vai ouvir essa dupla de frases até o fim.'},
  escolhas:[
    {texto:'Ir até a mesa do fundo.', vai:'c8_mesa_do_fundo'},
    {texto:'Continuar ouvindo sem se meter.', vai:'c8_continuou_ouvindo'},
    {texto:'Ir pro cais três agora.', vai:'c8_cais'},
    {texto:'Sair e dormir.', vai:'c8_fritura'}
  ]
},

c8_mesa_do_fundo:{
  texto:[
    'Você senta na mesa do fundo sem ser convidado, o que é uma coisa que só funciona com quinze anos.',
    'São dois estivadores. O mais velho te olha e ri.',
    '"Ô."',
    '"Levam o quê?"',
    'Silêncio de três segundos.',
    '"Carga", diz o mais novo.',
    '"Carga viva", diz o mais velho, e o mais novo chuta ele por baixo da mesa e todo mundo vê.'
  ],
  ef:{flag:'carga_viva'},
  escolhas:[
    {texto:'"Carga viva de quê?"', vai:'c8_carga_viva'},
    {texto:'Ficar quieto e deixar eles decidirem se falam.', vai:'c8_deixou_falarem'},
    {texto:'Pagar a mesa e ficar.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Levantar e ir pro cais.', vai:'c8_cais'}
  ]
},

c8_deixou_falarem:{
  texto:[
    'Você não pergunta nada. Fica sentado.',
    'Os dois se olham. O mais velho dá de ombros e o mais novo bufa.',
    '"Olha, garoto." O mais velho empurra o copo. "A gente carrega contêiner. A gente não abre contêiner."',
    '"Mas vocês sabem."',
    '"A gente escuta." Ele corrige. "Contêiner de carga geral não faz barulho."',
    'Ele bebe.',
    '"E uma vez por ano, na semana do Anne, passa contêiner que faz barulho."'
  ],
  ef:{flag:['carga_viva','conteiner_que_faz_barulho'],
      registrar:'Uma vez por ano, na semana do S.S. Anne, passa contêiner que faz barulho pelo porto de Vermilion.',
      presagio:'Contêiner que faz barulho. E um lacre inteiro, um número que bate e um peso dentro da margem.'},
  escolhas:[
    {texto:'"Quando passa? Que horas?"', vai:'c8_que_horas'},
    {texto:'"Vocês nunca reportaram?"', vai:'c8_nunca_reportaram'},
    {texto:'Pagar a mesa deles.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Agradecer e ir pro cais.', vai:'c8_cais'}
  ]
},

c8_carga_viva:{
  texto:[
    '"Carga viva de quê?"',
    'O mais novo levanta e vai embora da mesa sem terminar o copo, o que é a coisa mais eloquente da noite.',
    'O mais velho fica.',
    '"Ele tem filho pequeno", ele explica. "Eu não tenho mais ninguém, então eu posso falar."',
    'Ele empurra o copo pro meio da mesa.',
    '"Carga viva é carga viva, garoto. Nem sempre é bicho."'
  ],
  ef:{flag:['carga_viva','nem_sempre_e_bicho'],
      registrar:'Um estivador insinuou que a carga viva do porto nem sempre é Pokémon.',
      presagio:'"Nem sempre é bicho." Ele pode estar exagerando. Bar de porto exagera. Você vai querer ter certeza.'},
  escolhas:[
    {texto:'"Como assim nem sempre é bicho?"', vai:'c8_nem_sempre'},
    {texto:'"Quando passa? Que horas?"', vai:'c8_que_horas'},
    {texto:'Pagar a mesa dele.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Isso é conversa de bar. Ir embora.', vai:'c8_cais'}
  ]
},

c8_nem_sempre:{
  texto:[
    '"Como assim nem sempre é bicho?"',
    'O homem ri e balança a cabeça.',
    '"Ah, não. Não é isso que você tá pensando."',
    'Ele bebe.',
    '"Eu falo de gente que embarca por vontade. Moleque de dezesseis, dezessete ano, que não tem passagem e que aceita ir no porão até Cinnabar em troca de nada."',
    'Ele apoia os dois cotovelos.',
    '"Eles chamam de vaga de trabalho. Não tem contrato, não tem registro, não tem nome em lista de passageiro." Ele olha pra você. "Você sabe o que acontece com quem não tem nome em lista de passageiro?"',
    '"O quê?"',
    '"Nada." Ele encolhe os ombros. "Não acontece nada. Nunca aconteceu nada com ninguém que não tem nome em lista."'
  ],
  ef:{flag:['vagas_de_trabalho','nem_sempre_e_bicho'],
      registrar:'O S.S. Anne leva adolescentes sem passagem no porão como "vaga de trabalho", sem registro.',
      presagio:'Ninguém na lista de passageiros. Você está pensando em embarcar de graça.'},
  escolhas:[
    {texto:'"Quando passa o contêiner? Que horas?"', vai:'c8_que_horas'},
    {texto:'"Vocês nunca reportaram?"', vai:'c8_nunca_reportaram'},
    {texto:'Pagar a mesa dele.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Ir pro cais três.', vai:'c8_cais'}
  ]
},

c8_que_horas:{
  texto:[
    '"Quando passa? Que horas?"',
    'Ele ri.',
    '"Você quer ver."',
    '"Quero."',
    '"Três e quarenta da manhã." Ele fala sem hesitar, o que quer dizer que ele já pensou muito nisso. "Portão cinco, o de serviço. Não passa pela balança principal — passa pela balança dois, a que tá em manutenção desde março."',
    'Ele termina o copo.',
    '"E antes que você pergunte: sim, eu já pensei em ir ver. Todo ano eu penso."',
    '"E por que não vai?"',
    '"Porque eu trabalho às seis."'
  ],
  ef:{flag:'portao_cinco', registrar:'3h40, portão cinco, balança dois (em manutenção desde março).',
      presagio:'"Porque eu trabalho às seis." É essa a razão. Não é medo. É que amanhã tem trabalho.'},
  escolhas:[
    {texto:'"Eu vou."', vai:'c8_eu_vou'},
    {texto:'Pagar a mesa dele.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"Vocês nunca reportaram?"', vai:'c8_nunca_reportaram'}
  ]
},

c8_eu_vou:{
  texto:[
    '"Eu vou."',
    'Ele te olha por um tempo comprido.',
    'Depois tira uma coisa do bolso do macacão e põe na mesa: um crachá velho de estivador, com foto de um homem de uns vinte e cinco anos que é ele há vinte anos.',
    '"Isso aqui é vencido. Não abre porta nenhuma."',
    'Ele empurra na sua direção.',
    '"Mas se alguém te parar no portão cinco e você mostrar isso rápido e continuar andando, dá uns quatro segundo."',
    'Ele bebe o resto.',
    '"Quatro segundo é muita coisa, garoto."'
  ],
  ef:{flag:'cracha_do_estivador',
      npc:{nome:'Estivador velho', opiniao:5, memoria:'Te deu o crachá vencido dele e o horário do contêiner do portão cinco.'},
      registrar:'Ganhou um crachá de estivador vencido.',
      presagio:'Quatro segundos. Ele mediu isso. Ele mediu isso um dia, em algum lugar.'},
  escolhas:[
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco'},
    {texto:'Ir pro cais três primeiro.', vai:'c8_cais'},
    {texto:'Pagar a mesa dele.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}}
  ]
},

c8_nunca_reportaram:{
  texto:[
    '"Vocês nunca reportaram?"',
    '"Reportar pra quem?"',
    'Não é retórica. Ele está genuinamente perguntando.',
    '"Pra polícia do porto, que é contratada pela administração do porto. Pra administração do porto, que fatura com o Anne. Pra Liga, que credencia o torneio que acontece a bordo."',
    'Ele conta nos dedos e fica sem dedos.',
    '"Ou pro sindicato, que é o único que ia escutar, e que tem trinta e dois filiado e um advogado que atende de terça."',
    'Ele empurra o copo.',
    '"Eu não sou covarde, garoto. Eu sou realista, que é pior."'
  ],
  ef:{flag:'reportar_pra_quem',
      presagio:'"Reportar pra quem?" Em algum momento você vai ter que ser a resposta dessa pergunta.'},
  escolhas:[
    {texto:'"Quando passa? Que horas?"', vai:'c8_que_horas'},
    {texto:'Pagar a mesa dele.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Ir pro cais três.', vai:'c8_cais'}
  ]
},

c8_pagou_a_mesa:{
  texto:[
    'Você paga a mesa. Não é muito dinheiro e é muito mais do que eles esperavam de um garoto de quinze anos.',
    'O estivador velho fica genuinamente sem graça, o que num homem daquele tamanho é engraçado.',
    '"Não precisava."',
    '"Precisava."',
    'Ele faz que sim.',
    '"Então senta direito e escuta uma coisa que eu não ia falar."'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Pagou a mesa de quem trabalhou a noite toda'},
      npc:{nome:'Estivador velho', opiniao:4, memoria:'Você pagou a mesa dele no bar do porto.'}},
  escolhas:[
    {texto:'Escutar.', vai:'c8_eu_vou'},
    {texto:'"Quando passa o contêiner?"', vai:'c8_que_horas'},
    {texto:'"Carga viva de quê?"', vai:'c8_carga_viva'}
  ]
},

c8_continuou_ouvindo:{
  texto:[
    'Você fica no balcão e não se mete.',
    'Ouve: que o Anne atracou às quatro. Que a cozinha do navio contrata dez pessoas da cidade por temporada e paga bem. Que tem torneio a bordo hoje à noite.',
    'Que faltou um no torneio.',
    'E ouve, de uma mulher no balcão, sem nenhum contexto: "Esse ano de novo aquele negócio do camarote quarenta."',
    'Ninguém responde. Ela também não continua.'
  ],
  ef:{flag:['ouviu_camarote_40','sabe_do_torneio']},
  escolhas:[
    {texto:'Perguntar pra ela o que é o camarote quarenta.', vai:'c8_a_mulher_do_balcao'},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir até a mesa do fundo.', vai:'c8_mesa_do_fundo'},
    {texto:'Sair e comer alguma coisa.', vai:'c8_fritura'}
  ]
},

c8_a_mulher_do_balcao:{
  texto:[
    '"O que é o camarote quarenta?"',
    'Ela olha pra você. Tem uns cinquenta anos e mãos de quem lava louça há muito tempo.',
    '"Você trabalha no navio?"',
    '"Não."',
    '"Então esquece." Ela volta pro copo. E depois, porque você não sai: "Eu trabalho. Na temporada. Cozinha."',
    'Ela mexe o gelo.',
    '"Camarote quarenta é o que a gente não limpa. Tem um cara na porta e a gente deixa a bandeja no chão do corredor."',
    '"E o que tem dentro?"',
    '"Eu deixo a bandeja no chão do corredor", ela repete, exatamente igual, e isso é a resposta inteira.'
  ],
  ef:{flag:'ouviu_camarote_40',
      npc:{nome:'Cozinheira do Anne', opiniao:1, memoria:'Trabalha na cozinha do S.S. Anne por temporada. Não limpa o camarote 40.'},
      registrar:'O camarote 40 do S.S. Anne não é limpo. A bandeja fica no chão do corredor.',
      presagio:'A bandeja fica no chão do corredor. Alguém come essa bandeja.'},
  escolhas:[
    {texto:'"Quantas bandejas?"', vai:'c8_quantas_bandejas'},
    {texto:'"A senhora pode me arrumar um trabalho lá?"', vai:'c8_pediu_trabalho'},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Deixar ela em paz.', vai:'c8_fritura'}
  ]
},

c8_quantas_bandejas:{
  texto:[
    '"Quantas bandejas?"',
    'Ela para de mexer o gelo.',
    'É a pergunta que ela não esperava e dá pra ver exatamente o momento em que ela decide responder.',
    '"Quatro."',
    'Ela bebe.',
    '"Quatro bandeja pra um camarote de duas cama."',
    'Ela põe o copo no balcão com muito cuidado.',
    '"Eu monto quatro bandeja todo dia da temporada há seis ano e eu conto quatro todo dia e eu nunca falei isso em voz alta até agora."'
  ],
  ef:{flag:'quatro_bandejas',
      npc:{nome:'Cozinheira do Anne', opiniao:4, memoria:'Te contou que monta quatro bandejas por dia para um camarote de duas camas. Nunca tinha dito isso em voz alta.'},
      rep:{eixo:'bom',delta:1,motivo:'Fez a pergunta que ninguém fazia'},
      registrar:'Quatro bandejas por dia para o camarote 40, que tem duas camas.',
      presagio:'Quatro bandejas, duas camas, seis anos. Ela contou todos os dias e nunca disse em voz alta.'},
  escolhas:[
    {texto:'"A senhora pode me arrumar um trabalho lá?"', vai:'c8_pediu_trabalho'},
    {texto:'"A senhora quer que alguém veja?"', vai:'c8_quer_que_alguem_veja'},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Deixar ela em paz e sair.', vai:'c8_fritura'}
  ]
},

c8_quer_que_alguem_veja:{
  texto:[
    '"A senhora quer que alguém veja?"',
    'Ela demora muito.',
    '"Eu tenho cinquenta e dois anos e eu ganho mais em três semana de temporada do que em quatro mês de restaurante da cidade."',
    'Ela olha o copo.',
    '"E eu conto quatro bandeja todo dia."',
    'Ela abre a bolsa, tira uma chave de latão pequena e velha, e põe no balcão sem empurrar na sua direção.',
    '"Isso aqui abre o corredor de serviço do convés três. Eu perdi ela em duas mil e dezenove." Ela olha pra frente, não pra você. "Eu não sei onde ela tá."'
  ],
  ef:{flag:'chave_do_corredor',
      npc:{nome:'Cozinheira do Anne', opiniao:6, memoria:'Te deu a chave do corredor de serviço do convés três, fingindo que a tinha perdido.'},
      rep:{eixo:'bom',delta:1,motivo:'Deu a alguém a chance de fazer a coisa certa sem se expor'},
      registrar:'Ganhou a chave do corredor de serviço do convés três do S.S. Anne.',
      presagio:'Ela não empurrou a chave. Ela só parou de saber onde estava.'},
  escolhas:[
    {texto:'Pegar a chave.', vai:'c8_pegou_chave'},
    {texto:'Não pegar. Isso vai queimar ela.', vai:'c8_nao_pegou_chave'},
    {texto:'"A senhora pode me arrumar um trabalho lá?"', vai:'c8_pediu_trabalho'}
  ]
},

c8_pegou_chave:{
  texto:[
    'Você pega a chave do balcão sem falar nada e guarda no bolso da frente.',
    'Ela não olha. Continua olhando pra frente, pro espelho atrás das garrafas.',
    'Depois de uns vinte segundos ela pede outro e paga o seu também.',
    'Vocês não trocam mais nenhuma palavra.'
  ],
  ef:{flag:'tem_a_chave'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"A senhora pode me arrumar um trabalho lá?"', vai:'c8_pediu_trabalho'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_nao_pegou_chave:{
  texto:[
    '"Não. Se sumir uma chave e aparecer alguém no corredor, eles vão até a senhora em duas horas."',
    'Ela pega a chave de volta devagar.',
    'E aí ela faz uma coisa: guarda a chave, pega um guardanapo, e escreve uma coisa nele com o lápis de conta do bar.',
    'Empurra o guardanapo.',
    'Está escrito: "CONVÉS 3 — PORTA DE SERVIÇO FICA DESTRANCADA DAS 23H ÀS 23H20 (TROCA DE TURNO DA COPA)."',
    '"Guardanapo some", ela diz. "Chave não some."'
  ],
  ef:{flag:'janela_das_23h',
      npc:{nome:'Cozinheira do Anne', opiniao:8, memoria:'Você recusou a chave pra proteger ela, e ela te deu o horário da troca de turno num guardanapo.'},
      rep:{eixo:'bom',delta:3,motivo:'Recusou a ferramenta que queimaria quem te ajudou'},
      registrar:'Convés 3, porta de serviço destrancada das 23h às 23h20.',
      presagio:'Vinte minutos por noite. Guardanapo some.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"A senhora pode me arrumar um trabalho lá?"', vai:'c8_pediu_trabalho'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_pediu_trabalho:{
  texto:[
    '"A senhora pode me arrumar um trabalho lá?"',
    'Ela ri pela primeira vez.',
    '"Você quer lavar louça pra oitocentas pessoa?"',
    '"Quero."',
    'Ela para de rir.',
    '"Tá." Ela escreve um nome num guardanapo. "Fala pro contramestre que a Neusa mandou. Turno começa às seis. Oito hora."',
    'Ela devolve o lápis pro balcão.',
    '"E, garoto: quem trabalha na cozinha entra pelo corredor de serviço. Ninguém repara em quem entra pelo corredor de serviço."'
  ],
  ef:{flag:'indicacao_da_neusa',
      npc:{nome:'Cozinheira do Anne', opiniao:3, memoria:'Te indicou para o turno de cozinha do S.S. Anne.'},
      presagio:'Ninguém repara em quem entra pelo corredor de serviço. Ela falou isso devagar.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir direto procurar o contramestre.', vai:'c8_trabalho'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_fritura:{
  texto:[
    'A fritura do porto é uma janela numa parede com três banquinhos na calçada.',
    'Peixe, mandioca e um molho que a dona não explica. Custa pouco e é excelente.',
    'Você come em pé olhando o cais três, onde um navio do tamanho de um quarteirão está acendendo as luzes do salão uma fileira por vez.',
    'Do banquinho do lado, um menino de uns dez anos come batata com a mão e tem uma caixa de isopor entre os pés.',
    'A caixa se mexe.'
  ],
  ef:{dinheiro:-200, hp:4},
  escolhas:[
    {texto:'Perguntar o que tem na caixa.', vai:'c8_a_caixa_do_menino'},
    {texto:'Não perguntar nada e ir pro cais.', vai:'c8_cais'},
    {texto:'Comprar batata pra ele também.', vai:'c8_batata',
     ef:{dinheiro:-100, rep:{eixo:'bom',delta:1,motivo:'Comprou comida pra uma criança sem motivo'}}},
    {texto:'Ficar comendo em silêncio.', vai:'c8_a_caixa_do_menino'}
  ]
},

c8_batata:{
  texto:[
    'Você pede outra porção e põe no banquinho do lado sem falar nada.',
    'O menino olha a batata. Olha você. Olha a batata.',
    '"Eu tenho dinheiro", ele diz, ofendido.',
    '"Eu sei."',
    'Ele come a batata.',
    'Dois minutos depois ele empurra a caixa de isopor com o pé pra você ver melhor.',
    '"É meu", ele diz rápido. "Eu peguei. Não roubei."'
  ],
  ef:{npc:{nome:'Menino do cais', opiniao:3, memoria:'Você comprou batata pra ele na fritura do porto.'}},
  escolhas:[
    {texto:'Olhar na caixa.', vai:'c8_a_caixa_do_menino'},
    {texto:'"Eu sei que é seu." E continuar comendo.', vai:'c8_a_caixa_do_menino'},
    {texto:'Ir pro cais.', vai:'c8_cais'}
  ]
},

c8_a_caixa_do_menino:{
  texto:[
    'Na caixa de isopor tem um Krabby, com um dedo de água e um pano molhado por cima, o que é mais cuidado do que a maioria dos adultos teria.',
    '"É meu", ele diz. "Eu peguei na pedra do quebra-mar. Não roubei."',
    '"Tá vendendo?"',
    '"Tô." Ele endireita as costas. "Quatrocentos."',
    'Quatrocentos.',
    'Um Krabby daquele nível vale seis vezes isso em qualquer loja de Cerulean, e ele não sabe, e o rosto dele mostra que quatrocentos é um número que ele achou ousado.'
  ],
  ef:{flag:'o_krabby_do_menino'},
  escolhas:[
    {texto:'Pagar o preço justo — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo a quem não sabia o preço'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu e explicou por quê.'}}},
    {texto:'Pagar os 400 que ele pediu.', vai:'c8_krabby_barato', cond:d=>d.jogador.dinheiro>=400,
     ef:{dinheiro:-400, rep:{eixo:'ruim',delta:2,motivo:'Levou vantagem sobre uma criança no cais'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:40, historia:'Comprado de uma criança por um sexto do que valia.'}},
         npc:{nome:'Menino do cais', opiniao:0, memoria:'Você comprou o Krabby dele por 400. Ele ficou feliz na hora.'}}},
    {texto:'Explicar o valor e não comprar.', vai:'c8_krabby_licao',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Ensinou em vez de aproveitar'},
         npc:{nome:'Menino do cais', opiniao:4, memoria:'Você explicou quanto valia o Krabby dele e foi embora sem comprar.'}}},
    {texto:'"Por que você tá vendendo?"', vai:'c8_porque_vender'}
  ]
},

c8_porque_vender:{
  texto:[
    '"Por que você tá vendendo?"',
    'Ele encolhe os ombros.',
    '"Porque eu pego outro."',
    'É a resposta mais simples e mais devastadora possível.',
    '"Eu pego dois, três por semana na pedra do quebra-mar. Eu vendo pra quem vai pro navio." Ele aponta o S.S. Anne com a batata. "Gente do navio compra qualquer coisa."',
    '"E o que você faz com o dinheiro?"',
    '"Guardo."',
    '"Pra quê?"',
    'Ele olha pro navio.',
    '"Passagem."'
  ],
  ef:{flag:'o_menino_quer_a_passagem',
      registrar:'O menino do cais junta dinheiro vendendo Krabby pra comprar a passagem do S.S. Anne.',
      presagio:'Ele está juntando oito mil, quatrocentos por vez. Faz a conta de quantos Krabby são.'},
  escolhas:[
    {texto:'Pagar o preço justo — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo a quem não sabia o preço'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu e explicou por quê.'}}},
    {texto:'"Não compra passagem. Tem gente que embarca de graça e some."', vai:'c8_avisou_o_menino',
     cond:d=>!!d.flags.vagas_de_trabalho},
    {texto:'Explicar o valor e não comprar.', vai:'c8_krabby_licao',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Ensinou em vez de aproveitar'},
         npc:{nome:'Menino do cais', opiniao:4, memoria:'Você explicou quanto valia o Krabby dele.'}}},
    {texto:'Ir pro cais sem comprar nada.', vai:'c8_cais'}
  ]
},

c8_avisou_o_menino:{
  texto:[
    'Você conta. As vagas de trabalho, o porão, a ausência de nome em lista de passageiro.',
    'O menino escuta com a batata parada no meio do caminho.',
    '"Eu sei."',
    'Ele volta a comer.',
    '"O Denis foi ano passado. Ele tinha dezesseis." Ele mastiga. "Ele mandou carta de Cinnabar. Aí parou."',
    '"Parou como?"',
    '"Parou." Ele dá de ombros com uma naturalidade que te gela. "Mas ele mandou carta. Ele chegou."',
    'Ele fecha a caixa de isopor.',
    '"Eu vou de passagem. Com nome na lista. Por isso eu tô juntando."'
  ],
  ef:{flag:'o_denis', registrar:'Denis, 16 anos, foi de "vaga de trabalho" ano passado. Mandou uma carta de Cinnabar e parou.',
      npc:{nome:'Menino do cais', opiniao:4, memoria:'Te contou do Denis, que foi de vaga de trabalho e mandou uma carta só.'},
      presagio:'Ele mandou carta e chegou. Uma carta. Uma.'},
  escolhas:[
    {texto:'Pagar o preço justo — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo a quem não sabia o preço'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu.'}}},
    {texto:'Dar oito mil pra ele comprar a passagem. (8.000 ₽)', vai:'c8_pagou_a_passagem_dele',
     cond:d=>d.jogador.dinheiro>=8000},
    {texto:'"Guarda a carta do Denis." Perguntar dela.', vai:'c8_a_carta_do_denis'},
    {texto:'Ir pro cais.', vai:'c8_cais'}
  ]
},

c8_pagou_a_passagem_dele:{
  texto:[
    'Você conta oito mil na frente dele, em cima de um banquinho de fritura de porto.',
    'Ele não pega.',
    '"Isso é de mentira."',
    '"Não é."',
    '"Isso é de mentira", ele repete, e a voz falha, e ele fica com muita raiva da própria voz.',
    'Ele pega. Conta. Conta de novo. Guarda dentro da meia, que é onde criança de porto guarda dinheiro.',
    '"Eu vou pagar de volta."',
    '"Não vai."',
    '"EU VOU PAGAR DE VOLTA." Ele grita isso na calçada e duas pessoas olham.',
    'E aí ele pega a caixa de isopor e enfia na sua mão e sai correndo antes que você recuse.'
  ],
  ef:{dinheiro:-8000, rep:{eixo:'bom',delta:5,motivo:'Pagou a passagem de um menino do cais'},
      umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:70, historia:'Um menino de dez anos do cais de Vermilion enfiou essa caixa na sua mão e saiu correndo.'}},
      npc:{nome:'Menino do cais', opiniao:10, memoria:'Você pagou a passagem inteira dele. Ele jurou pagar de volta.'},
      flag:'pagou_a_passagem_do_menino',
      registrar:'Pagou os oito mil da passagem do menino do cais.',
      presagio:'"EU VOU PAGAR DE VOLTA." Ele tem dez anos e acabou de fazer uma promessa que vai carregar.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir atrás dele.', vai:'c8_atras_do_menino'}
  ]
},

c8_atras_do_menino:{
  texto:[
    'Você vai atrás e não acha. Menino de porto some em porto melhor do que qualquer um.',
    'Duas quadras depois você desiste e volta pro banquinho.',
    'A dona da fritura está olhando pra você com uma expressão que você não sabe ler.',
    '"Você deu oito mil pro Toshi."',
    '"É o nome dele?"',
    '"É." Ela vira o peixe. "Ele vende Krabby na minha porta faz três ano."',
    'Ela serve outra porção e empurra pra você sem cobrar.',
    '"A mãe dele embarcou nesse navio há quatro ano. Pra trabalhar. Ela mandou uma carta de Cinnabar."'
  ],
  ef:{flag:['o_nome_do_menino','a_mae_do_tunico'],
      registrar:'O menino se chama Toshi. A mãe dele embarcou no S.S. Anne há quatro anos e mandou uma carta.',
      npc:{nome:'Menino do cais', opiniao:2, memoria:'Nome: Toshi. A mãe embarcou no Anne há quatro anos.'},
      presagio:'Uma carta de Cinnabar. De novo. Sempre uma carta de Cinnabar.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"Ele vai atrás dela."', vai:'c8_vai_atras_dela'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_vai_atras_dela:{
  texto:[
    '"Ele vai atrás dela."',
    'A dona da fritura não responde na hora.',
    '"Vai."',
    'Ela vira o peixe.',
    '"E eu passei três ano torcendo pra ele não juntar o dinheiro."',
    'Ela olha pra você pela primeira vez, direto.',
    '"E você juntou pra ele numa tarde."'
  ],
  ef:{flag:'o_peso_dos_oito_mil', moral:-5,
      presagio:'Você fez uma coisa boa e acelerou uma coisa. As duas são verdade ao mesmo tempo.'},
  escolhas:[
    {texto:'"Então eu vou junto."', vai:'c8_vai_junto',
     ef:{flag:'prometeu_ir_junto', rep:{eixo:'bom',delta:2,motivo:'Assumiu o que acelerou'}}},
    {texto:'"Desculpa."', vai:'c8_cais'},
    {texto:'"Ela pode estar viva."', vai:'c8_pode_estar_viva'}
  ]
},

c8_pode_estar_viva:{
  texto:[
    '"Ela pode estar viva."',
    '"Pode." A dona da fritura fecha a tampa da panela. "Muita gente vai pra Cinnabar e fica. Tem trabalho lá."',
    'Ela limpa as mãos.',
    '"Eu não digo que morreu. Eu digo que não escreveu de novo, e que são coisas diferentes, e que uma delas eu consigo viver."',
    'Ela serve outro cliente.',
    '"O Toshi não consegue viver com nenhuma das duas. Por isso ele junta."'
  ],
  ef:{flag:'nao_escreveu_de_novo',
      presagio:'Não morreu: não escreveu de novo. Você vai conhecer muita gente que vive na diferença entre essas duas coisas.'},
  escolhas:[
    {texto:'"Então eu vou junto."', vai:'c8_vai_junto',
     ef:{flag:'prometeu_ir_junto', rep:{eixo:'bom',delta:2,motivo:'Assumiu o que acelerou'}}},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_vai_junto:{
  texto:[
    '"Então eu vou junto."',
    'A dona da fritura para.',
    '"Você vai junto."',
    '"Eu vou no navio. Se ele for, eu vou junto."',
    'Ela olha pra você por uns cinco segundos e depois faz uma coisa que ninguém fez com você nessa jornada: ela escreve o seu nome num papel.',
    '"Como você chama?"',
    'Você fala. Ela escreve num pedaço de papel de embrulho e prende com ímã na parede da fritura, entre as contas a pagar.',
    '"Pronto." Ela volta pro peixe. "Agora tem registro."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Prometeu acompanhar quem você empurrou'},
      flag:'nome_na_parede_da_fritura',
      npc:{nome:'Dona da fritura', opiniao:5, memoria:'Pregou o seu nome na parede da fritura dela, entre as contas a pagar.'},
      registrar:'Seu nome está pregado na parede de uma fritura do porto de Vermilion.',
      presagio:'"Agora tem registro." É a coisa mais parecida com um contrato que você assinou até hoje.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_a_carta_do_denis:{
  texto:[
    '"Você tem a carta do Denis?"',
    'O menino tira do bolso de trás uma folha dobrada em oito, mole de tanto ser aberta.',
    'Letra ruim. Caneta esferográfica. Sete linhas.',
    '"Cheguei. Tá tudo certo. O trabalho é de descarregar e eles pagam no fim. Fala pra minha tia que eu ligo quando der. Não conta pra ninguém que eu fui assim. Eu tô bem. Denis."',
    'No verso, escrito de cabeça pra baixo, quase apagado, como quem escreveu com a folha em cima do joelho e depois desistiu de mandar:',
    '"eles contaram a gente duas vezes"'
  ],
  ef:{flag:'a_carta_do_denis', registrar:'No verso da carta do Denis: "eles contaram a gente duas vezes".',
      presagio:'Contaram duas vezes. Conferência. Ele viu conferência e não soube o nome do que viu.'},
  escolhas:[
    {texto:'Pedir a carta emprestada.', vai:'c8_pegou_a_carta'},
    {texto:'"Mostra isso pra sua tia."', vai:'c8_mostra_pra_tia'},
    {texto:'Pagar o preço justo pelo Krabby — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu.'}}},
    {texto:'Ir pro cais.', vai:'c8_cais'}
  ]
},

c8_pegou_a_carta:{
  texto:[
    '"Me empresta essa carta."',
    '"Não."',
    'Na hora, sem pensar.',
    '"É a única que ele mandou."',
    'Você não insiste. Em vez disso você tira o seu caderno e copia as sete linhas e a frase do verso, palavra por palavra, sentado num banquinho de fritura, com o menino conferindo cada letra por cima do seu ombro.',
    '"Tá errado", ele diz duas vezes, e as duas vezes está errado mesmo.',
    'No fim ele lê a sua cópia inteira e faz que sim.'
  ],
  ef:{flag:'copiou_a_carta',
      rep:{eixo:'bom',delta:1,motivo:'Copiou em vez de tomar'},
      npc:{nome:'Menino do cais', opiniao:4, memoria:'Você copiou a carta do Denis em vez de levar a dele.'},
      registrar:'Copiou a carta do Denis, com a frase do verso.',
      presagio:'Você tem uma cópia. Ele ficou com o original. Alguém em Cerulean te ensinou a diferença.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco},
    {texto:'Pagar o preço justo pelo Krabby — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu.'}}}
  ]
},

c8_mostra_pra_tia:{
  texto:[
    '"Mostra isso pra sua tia."',
    '"A tia é do Denis, não minha."',
    '"Mostra pra ela."',
    'Ele dobra a carta em oito de novo, com uma precisão de quem dobra essa carta há um ano.',
    '"Ela já viu."',
    'Ele guarda no bolso de trás.',
    '"Ela leu e falou: graças a Deus ele tá bem."',
    'Ele olha pro navio.',
    '"Ela não virou o papel."'
  ],
  ef:{flag:'ela_nao_virou_o_papel',
      presagio:'Ela não virou o papel. Quase ninguém vira o papel.'},
  escolhas:[
    {texto:'Copiar a carta.', vai:'c8_pegou_a_carta'},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Pagar o preço justo pelo Krabby — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu.'}}}
  ]
},

c8_krabby_justo:{
  texto:[
    'Ele conta o dinheiro três vezes e ainda acha que você errou.',
    '"Por que você fez isso?"',
    'Você explica o que é uma tabela de preço. Que existe um valor de mercado. Que loja de Cerulean vende esse Krabby por seis vezes o que ele pediu.',
    'Ele ouve com uma seriedade de adulto, e no meio da explicação ele tira um lápis do bolso e começa a anotar na tampa de isopor.',
    'Semanas depois, você vai ouvir falar de um menino em Vermilion que virou o melhor avaliador de Pokémon do porto e que cobra pelo serviço.',
    'Boa sorte pra quem tentar enganá-lo.'
  ],
  ef:{presagio:'Você ensinou uma criança a pôr preço nas coisas. Isso pode ser a melhor ou a pior coisa que você fez hoje.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"Por que você tá vendendo?"', vai:'c8_porque_vender'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_krabby_barato:{
  texto:[
    'Ele te entrega a caixa de isopor e sai correndo, feliz, com quatrocentos no bolso.',
    'Você fica olhando ele ir embora.',
    'Não foi crime. Foi só o tipo de coisa que, depois, você não conta pra ninguém.',
    'A dona da fritura viu. Ela não diz nada. Ela vira o peixe e não diz nada, e você paga a conta e ela não diz nada.'
  ],
  ef:{presagio:'Ela não disse nada. Você vai lembrar do silêncio dela por muito mais tempo do que de qualquer bronca.'},
  escolhas:[
    {texto:'Ir atrás dele e pagar a diferença.', vai:'c8_pagou_diferenca',
     cond:d=>d.jogador.dinheiro>=2000},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_pagou_diferenca:{
  texto:[
    'Você acha ele duas quadras adiante, contando as notas sentado num meio-fio.',
    'Você entrega o resto.',
    '"Isso é o preço certo. Eu te paguei errado."',
    'Ele não entende. Você explica. Ele entende e fica bravo — não com você, com ele mesmo.',
    '"Eu ia vender por quatrocentos pra qualquer um."',
    '"Agora não vai mais."',
    'Ele guarda dentro da meia.'
  ],
  ef:{dinheiro:-2000, rep:{eixo:'bom',delta:2,motivo:'Voltou e pagou a diferença'},
      npc:{nome:'Menino do cais', opiniao:5, memoria:'Você voltou e pagou a diferença do Krabby.'},
      limpaFlag:'levou_vantagem_no_cais'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"Por que você tá vendendo?"', vai:'c8_porque_vender'}
  ]
},

c8_krabby_licao:{
  texto:[
    '"Dois mil e quatrocentos?"',
    'Ele olha a caixa de isopor de um jeito completamente novo.',
    '"Então eu não vou vender."',
    '"Boa", você diz. E é boa mesmo.',
    'Ele fecha a caixa com as duas mãos e senta em cima, como quem guarda um cofre.',
    '"Como você sabe disso?"',
    '"Eu vi numa banca em Cerulean."',
    'Ele repete "Cerulean" baixinho, do jeito de quem está guardando.'
  ],
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"Por que você tá vendendo?"', vai:'c8_porque_vender'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_cais:{
  texto:[
    'O cais três de perto é outra coisa.',
    'O S.S. Anne não parece um navio daqui: parece uma parede. Uma parede branca de nove andares com janelas, encostada num muro de concreto, com uma passarela coberta ligando os dois.',
    'Na entrada da passarela tem uma mesa com duas moças de uniforme, uma fila de gente bem vestida, e um preço numa placa de acrílico.',
    'PASSAGEM — VERMILION / CINNABAR — ₽ 8.000.',
    'Tem gente pagando isso sem piscar. Um casal na sua frente paga quatro passagens e a mulher reclama do preço do jeito que se reclama de uma coisa que não dói.',
    'E, do lado, uma porta de serviço sem placa, com um cabo de energia entrando por baixo.'
  ],
  ef:{registrar:'Chegou ao cais três, onde o S.S. Anne está atracado.'},
  escolhas:[
    {texto:'Comprar a passagem. (8.000 ₽)', vai:'c8_bordo', cond:d=>d.jogador.dinheiro>=8000,
     ef:{dinheiro:-8000, flag:'pagou_passagem'}},
    {texto:'Procurar um jeito de entrar sem pagar.', vai:'c8_clandestino'},
    {texto:'Perguntar se precisam de mão de obra a bordo.', vai:'c8_trabalho'},
    {texto:'Ficar no cais e esperar escurecer.', vai:'c8_noite_porto'}
  ]
},

c8_noite_porto:{
  texto:[
    'À noite, o navio acende. Da beira do cais dá pra ver as janelas do salão de festas, cheias de gente que nunca dormiu no mato.',
    'Tem música lá dentro. Música ao vivo, com piano, e o som sai pela passarela coberta e morre na água.',
    'Você fica sentado num cabeço de amarração por quase uma hora olhando isso.',
    'E aí uma mulher de uniforme da tripulação desce a passarela e vem direto na sua direção, andando rápido, olhando o seu cinto.',
    '"Você é treinador?"',
    '"Sou."',
    '"Tem um torneio a bordo hoje. Faltou um." Ela já está fazendo sinal pra alguém lá em cima. "Entrada de graça. Só entra e luta."'
  ],
  ef:{flag:'sabe_do_torneio'},
  escolhas:[
    {texto:'Aceitar.', vai:'c8_bordo', ef:{flag:'entrou_pelo_torneio'}},
    {texto:'"Por que faltou um?"', vai:'c8_por_que_faltou'},
    {texto:'"Quanto paga o primeiro lugar?"', vai:'c8_premio'},
    {texto:'Recusar e ficar no porto.', vai:'c8_recusou_torneio'}
  ]
},

c8_premio:{
  texto:[
    '"Quanto paga o primeiro lugar?"',
    '"Vinte mil."',
    'Ela fala isso e espera a sua reação, e a sua reação é exatamente a que ela esperava.',
    '"E o segundo?"',
    '"Nada." Ela dá de ombros. "É torneio de rico, garoto. Eles não fazem por dinheiro. Eles fazem porque dá pra apostar."',
    'Ela olha pra cima, pro salão iluminado.',
    '"Cada um deles põe um valor num dos oito. Esse é o jogo. Vocês são o jogo."'
  ],
  ef:{flag:['premio_do_torneio','voces_sao_o_jogo'],
      presagio:'Vocês são o jogo. Não os Pokémon: vocês.'},
  escolhas:[
    {texto:'Aceitar mesmo assim.', vai:'c8_bordo', ef:{flag:'entrou_pelo_torneio'}},
    {texto:'"Por que faltou um?"', vai:'c8_por_que_faltou'},
    {texto:'Recusar.', vai:'c8_recusou_torneio'},
    {texto:'"Quem aposta em quem?"', vai:'c8_quem_aposta'}
  ]
},

c8_quem_aposta:{
  texto:[
    '"Quem aposta em quem?"',
    'Ela ri sem alegria.',
    '"Isso eu não sei e eu não quero saber."',
    'Ela olha o relógio.',
    '"Mas eu vou te dizer uma coisa porque eu já vi isso acontecer três vez: se você ganhar, alguém vai te chamar pra conversar depois."',
    '"Conversar sobre o quê?"',
    '"Sobre você." Ela começa a subir a passarela. "Você vem ou não vem?"'
  ],
  ef:{flag:'aviso_da_conversa',
      presagio:'Se você ganhar, alguém vai querer conversar. Ela já viu isso três vezes.'},
  escolhas:[
    {texto:'Ir.', vai:'c8_bordo', ef:{flag:'entrou_pelo_torneio'}},
    {texto:'Recusar.', vai:'c8_recusou_torneio'},
    {texto:'"Por que faltou um?"', vai:'c8_por_que_faltou'}
  ]
},

c8_por_que_faltou:{
  texto:[
    '"Por que faltou um?"',
    'Ela hesita meio segundo. É o suficiente.',
    '"O garoto passou mal."',
    '"Passou mal como?"',
    '"Passou mal." Ela olha pra trás, pro navio. "Você entra ou não entra?"',
    'E aí, porque você não responde, ela baixa a voz:',
    '"Ele tá na enfermaria do convés dois. Ele tem dezesseis anos e ele entrou pelo porão, e ele lutou três luta seguida hoje porque falta gente todo ano."'
  ],
  ef:{flag:['desconfiou_torneio','o_garoto_da_enfermaria'],
      registrar:'Um garoto de 16 anos está na enfermaria do convés dois depois de três lutas seguidas no torneio.',
      presagio:'Falta gente todo ano. Todo ano alguém luta três vezes seguidas.'},
  escolhas:[
    {texto:'Entrar. Você quer ver o que tem lá dentro.', vai:'c8_bordo', ef:{flag:'entrou_pelo_torneio'}},
    {texto:'"Me leva na enfermaria."', vai:'c8_bordo', ef:{flag:['entrou_pelo_torneio','vai_na_enfermaria']}},
    {texto:'"Quanto paga o primeiro lugar?"', vai:'c8_premio'},
    {texto:'Recusar.', vai:'c8_recusou_torneio'}
  ]
},

c8_recusou_torneio:{
  texto:[
    '"Não."',
    'Ela não insiste. Faz que sim, vira, e sobe a passarela.',
    'No meio ela para e fala por cima do ombro, sem virar:',
    '"Boa."',
    'Só isso. Uma palavra.',
    'Você fica no cabeço de amarração e vê ela sumir na passarela coberta, e a música do piano continua, e você não sabe se acabou de fazer a coisa certa ou de perder a única chance.'
  ],
  ef:{flag:'recusou_o_torneio',
      presagio:'"Boa." Ela disse isso de costas e você não vai conseguir decidir o que significou.'},
  escolhas:[
    {texto:'Mudar de ideia e subir.', vai:'c8_bordo', ef:{flag:'entrou_pelo_torneio'}},
    {texto:'Comprar a passagem. (8.000 ₽)', vai:'c8_bordo', cond:d=>d.jogador.dinheiro>=8000,
     ef:{dinheiro:-8000, flag:'pagou_passagem'}},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco},
    {texto:'Ficar no porto. O navio não é seu problema.', vai:'c8_fim_porto'}
  ]
},

c8_portao_cinco:{
  texto:[
    'Três e quarenta da manhã.',
    'O portão cinco é o de serviço, no fim do muro, com uma guarita vazia e uma cancela levantada.',
    'A balança dois tem uma faixa de PARADA PARA MANUTENÇÃO amarrada no poste, e a faixa está desbotada de sol de vários meses.',
    'Você espera agachado atrás de uma pilha de pallets.',
    'Três e quarenta e dois: entra um caminhão.',
    'Contêiner de vinte pés, lacre azul, plaquinha com número. Ele passa reto pela balança dois — reto, sem parar — e vai até o cais três.',
    'E na descida, quando o caminhão reduz na lombada, dá pra ouvir.'
  ],
  ef:{flag:'viu_o_conteiner', registrar:'Viu o contêiner passar reto pela balança dois às 3h42.',
      presagio:'Você ouviu. Na lombada, quando reduziu. Não dá pra desouvir.'},
  escolhas:[
    {texto:'Seguir o caminhão a pé.', vai:'c8_seguiu_caminhao'},
    {texto:'Ir até a balança dois olhar.', vai:'c8_balanca_dois'},
    {texto:'Anotar o número do lacre e da plaquinha.', vai:'c8_anotou_lacre'},
    {texto:'Levantar, pôr o colete e ir perguntar o lacre de frente.',
     vai:'c8_de_colete', cond:d=>typeof Cargos !== 'undefined'
       && (Cargos.tem('guarda_rota') || Cargos.tem('investigador') || Cargos.tem('comissao'))},
    {texto:'Sair correndo e gritar.', vai:'c8_gritou_no_portao'}
  ]
},

c8_de_colete:{
  texto:[
    'Você sai de trás dos pallets, põe o colete e anda até a cancela pelo meio do asfalto, que é o jeito de andar de quem tem motivo pra estar ali.',
    'O motorista te vê pelo retrovisor e para sozinho, antes de você pedir. É isso que o colete faz.',
    fala('o motorista', 'Problema?'),
    d=>fala(d.jogador.nome, 'Conferência. Lacre e plaquinha.'),
    'Ele entrega os dois papéis pela janela sem nenhuma resistência, porque quem entrega papel a noite inteira entrega papel.',
    'Você lê com a lanterna. O lacre bate com a plaquinha. A plaquinha bate com o manifesto.',
    'E o manifesto diz que o contêiner tem quatro mil e duzentos quilos de ração seca.',
    'Quatro mil e duzentos quilos de ração seca não fazem o barulho que esse contêiner fez na lombada.',
    fala('o motorista', 'Tá certo?'),
    d=>fala(d.jogador.nome, 'Tá certo.'),
    'E está mesmo. Está certo no papel, que é exatamente o problema.'
  ],
  ef:{flag:['viu_o_manifesto','sabe_do_peso_errado'],
      rep:{eixo:'bom', delta:2, motivo:'Usou a credencial na cara, à noite, no portão cinco'},
      npc:{nome:'Motorista do turno', opiniao:1, memoria:'Parou por causa do seu colete e te entregou os papéis sem discutir.'},
      registrar:'O manifesto do contêiner das 3h42 declara 4.200 kg de ração seca.',
      presagio:'Papel certo é mais difícil de derrubar que papel errado, e alguém sabe disso.'},
  escolhas:[
    {texto:'"Quem assina esse manifesto?"', vai:'c8_quem_assina'},
    {texto:'Deixar ele ir e seguir o caminhão até o cais.', vai:'c8_seguiu_caminhao'},
    {texto:'Anotar tudo e ir embora antes que alguém repare.', vai:'c8_anotou_lacre'}
  ]
},

c8_quem_assina:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem assina esse manifesto?'),
    'Ele vira o papel pra ler, o que quer dizer que ele nunca leu.',
    fala('o motorista', 'Tem uma rubrica aqui e um carimbo. O carimbo é do expedidor.'),
    d=>fala(d.jogador.nome, 'E o expedidor é quem?'),
    fala('o motorista', 'Moço, eu pego no cinco e largo no três. Eu não sei nem o que tem dentro.'),
    'Uma pausa.',
    fala('o motorista', 'E eu prefiro não saber, se for pra ser honesto, e você tá de colete então eu tô sendo honesto.'),
    'Você devolve os papéis. Ele engata e sai devagar pela lombada, e o barulho acontece de novo, igualzinho.',
    'Você fica olhando as luzes de trás até elas virarem no cais três.'
  ],
  ef:{flag:'sabe_do_carimbo_do_expedidor',
      rep:{eixo:'bom', delta:1, motivo:'Perguntou quem assinou em vez de acusar quem dirigia'},
      registrar:'O manifesto tem carimbo de expedidor e rubrica, e o motorista nunca leu nenhum dos dois.'},
  escolhas:[
    {texto:'Seguir o caminhão a pé.', vai:'c8_seguiu_caminhao'},
    {texto:'Ir até a balança dois olhar.', vai:'c8_balanca_dois'},
    {texto:'Anotar tudo e sair.', vai:'c8_anotou_lacre'}
  ]
},

c8_anotou_lacre:{
  texto:[
    'Você anota no caderno, com a lanterna do Pokégear por baixo da jaqueta pra não vazar luz:',
    'Contêiner: KTU 409 118-2. Lacre azul nº 77451. Caminhão: placa coberta com papelão e fita.',
    'Placa coberta com papelão e fita.',
    'Dentro de um porto. Passando por um portão. Com um lacre oficial e um número de contêiner válido.',
    'Alguém fez o trabalho inteiro direito e deixou a placa coberta, porque a placa é a única parte que uma pessoa lê.'
  ],
  ef:{flag:'anotou_o_lacre', registrar:'Contêiner KTU 409 118-2, lacre 77451, caminhão com placa coberta.',
      rep:{eixo:'bom',delta:1,motivo:'Anotou o número em vez de correr atrás'},
      presagio:'Você tem um número de contêiner. Isso entra em sistema. Isso é rastreável.'},
  escolhas:[
    {texto:'Seguir o caminhão a pé.', vai:'c8_seguiu_caminhao'},
    {texto:'Ir até a balança dois.', vai:'c8_balanca_dois'},
    {texto:'Voltar pro cais e embarcar.', vai:'c8_cais'},
    {texto:'Procurar o conferente da prancheta amanhã cedo.', vai:'c8_voltou_no_conferente'}
  ]
},

c8_balanca_dois:{
  texto:[
    'A balança dois não está em manutenção.',
    'Você olha o painel: está ligado, com o display aceso, mostrando zero.',
    'A faixa de manutenção está amarrada no poste com nó de quem amarra faixa todo dia, e o nó está desgastado de ser amarrado e desamarrado muitas vezes.',
    'Embaixo do painel tem uma etiqueta de aferição do Inmetro.',
    'Válida. Deste ano.',
    'Uma balança funcionando, aferida e válida, com uma faixa de manutenção amarrada por cima, num portão de serviço que abre às três e quarenta da manhã.'
  ],
  ef:{flag:'a_balanca_funciona', registrar:'A balança dois do portão cinco funciona: aferição válida, faixa de manutenção falsa.',
      presagio:'Alguém amarra e desamarra essa faixa todo dia. Alguém tem essa função.'},
  escolhas:[
    {texto:'Anotar tudo e ir embora.', vai:'c8_anotou_lacre'},
    {texto:'Seguir o caminhão.', vai:'c8_seguiu_caminhao'},
    {texto:'Ficar e esperar quem vem desamarrar a faixa.', vai:'c8_esperou_a_faixa'},
    {texto:'Voltar pro cais.', vai:'c8_cais'}
  ]
},

c8_esperou_a_faixa:{
  texto:[
    'Você espera atrás dos pallets.',
    'Quatro e vinte: vem um homem de colete refletivo. Ele desamarra a faixa, enrola, e guarda numa caixa de ferramenta ao lado da guarita.',
    'Depois liga a balança na tomada, confere o display, e vai embora.',
    'Ele faz isso em noventa segundos com a naturalidade de quem faz isso há anos.',
    'E antes de ir, ele anota uma coisa numa prancheta pendurada na guarita.',
    'Quando ele some, você vai lá e lê.',
    'É uma folha de controle. Colunas: DATA, HORA, VEÍCULO, LACRE. E a última coluna: RESP.',
    'Na coluna RESP, a mesma sigla em todas as linhas dos últimos oito meses. Três letras.'
  ],
  ef:{flag:'a_folha_de_controle', registrar:'Existe uma folha de controle na guarita do portão cinco, com a mesma sigla de responsável em oito meses.',
      rep:{eixo:'bom',delta:2,motivo:'Esperou quarenta minutos por noventa segundos de informação'},
      presagio:'Três letras na coluna RESP. Em oito meses, sempre as mesmas.'},
  escolhas:[
    {texto:'Fotografar / copiar a folha.', vai:'c8_copiou_a_folha'},
    {texto:'Levar a folha.', vai:'c8_levou_a_folha'},
    {texto:'Deixar tudo como está e ir embarcar.', vai:'c8_cais'},
    {texto:'Seguir o caminhão.', vai:'c8_seguiu_caminhao'}
  ]
},

c8_copiou_a_folha:{
  texto:[
    'Você copia as últimas quinze linhas no caderno e devolve a prancheta ao gancho, no mesmo ângulo.',
    'Leva doze minutos e você tem que parar duas vezes porque passa gente.',
    'Quando acaba, a prancheta está exatamente como estava, e você tem quinze datas, quinze horários e quinze números de lacre.',
    'E a sigla, quinze vezes.'
  ],
  ef:{flag:['copiou_o_controle','papel_com_brasao'],
      rep:{eixo:'bom',delta:2,motivo:'Copiou sem levar'},
      registrar:'Copiou quinze linhas da folha de controle do portão cinco.',
      presagio:'Quinze linhas. Cópia. Guardada em outro lugar. Alguém em Cerulean ficaria orgulhosa.'},
  escolhas:[
    {texto:'Ir embarcar no navio.', vai:'c8_cais'},
    {texto:'Seguir o caminhão.', vai:'c8_seguiu_caminhao'},
    {texto:'Procurar o conferente da prancheta de manhã.', vai:'c8_voltou_no_conferente'}
  ]
},

c8_levou_a_folha:{
  texto:[
    'Você arranca a folha e guarda.',
    'Às sete da manhã, um homem de colete refletivo vai chegar na guarita, procurar a folha, não achar, e ligar pra alguém.',
    'E às oito, alguém vai amarrar a faixa de manutenção na balança dois de manhã, o que nunca aconteceu antes, e o portão cinco vai ficar fechado por três semanas.',
    'Você tem a folha. Eles têm três semanas pra mudar tudo.',
    'Você só vai entender o tamanho desse erro muito depois.'
  ],
  ef:{flag:['levou_o_controle','papel_com_brasao','queimou_o_portao'],
      registrar:'Levou a folha de controle. O portão cinco fechou por três semanas.',
      presagio:'Você tem a prova e eles têm o aviso. Quase sempre o aviso vale mais.'},
  escolhas:[
    {texto:'Ir embarcar.', vai:'c8_cais'},
    {texto:'Devolver a folha antes que alguém veja.', vai:'c8_copiou_a_folha',
     ef:{limpaFlag:['levou_o_controle','queimou_o_portao']}},
    {texto:'Seguir o caminhão.', vai:'c8_seguiu_caminhao'}
  ]
},

c8_seguiu_caminhao:{
  texto:[
    'Você segue o caminhão a pé pelo pátio, usando as pilhas de contêiner como cobertura.',
    'Ele para embaixo do guindaste do cais três.',
    'E aí acontece a coisa mais banal do mundo: o guindaste pega o contêiner, gira, e põe no porão do S.S. Anne.',
    'Quatro minutos. Dois homens, um operador de guindaste e um conferente com prancheta.',
    'O conferente não abre nada. Ele confere o número, o lacre e o peso, e assina.',
    'Você viu o crime inteiro e o crime inteiro foi legal.'
  ],
  ef:{flag:'viu_o_embarque', registrar:'O contêiner das 3h42 foi embarcado no S.S. Anne com conferência normal.',
      presagio:'Você viu o crime inteiro e o crime inteiro foi legal. Guarda essa frase; vai servir várias vezes.'},
  escolhas:[
    {texto:'Anotar o número do lacre.', vai:'c8_anotou_lacre'},
    {texto:'Embarcar nesse navio de qualquer jeito.', vai:'c8_cais'},
    {texto:'Ir até o conferente e falar.', vai:'c8_falou_com_conferente'},
    {texto:'Voltar pro portão e olhar a balança.', vai:'c8_balanca_dois'}
  ]
},

c8_falou_com_conferente:{
  texto:[
    'Você anda até o conferente no meio do pátio às quatro da manhã, o que é uma das coisas mais burras que você já fez.',
    'Ele leva um susto de verdade.',
    '"O que você tá fazendo aqui?"',
    '"Tem coisa viva nesse contêiner."',
    'Ele olha o contêiner, que já está no porão. Olha a prancheta. Olha você.',
    '"Lacre inteiro, número bate, peso dentro da margem."',
    '"Eu ouvi."',
    '"Eu também ouço." Ele fala isso e o rosto dele não muda nada. "Todo ano eu ouço, garoto."',
    'Ele assina a última linha.',
    '"E todo ano o lacre tá inteiro, o número bate e o peso tá dentro da margem."'
  ],
  ef:{flag:'o_conferente_ouve',
      npc:{nome:'Conferente do porto', opiniao:2, memoria:'Admitiu que ouve o contêiner todo ano e assina do mesmo jeito.'},
      registrar:'O conferente ouve a carga viva todos os anos e assina.',
      presagio:'Ele não é cúmplice. Ele é conferente. É exatamente isso que faz funcionar.'},
  escolhas:[
    {texto:'"E se eu abrir?"', vai:'c8_e_se_eu_abrir'},
    {texto:'Anotar o número do lacre.', vai:'c8_anotou_lacre'},
    {texto:'Embarcar no navio.', vai:'c8_cais'},
    {texto:'Ir embora.', vai:'c8_fim_porto'}
  ]
},

c8_e_se_eu_abrir:{
  texto:[
    '"E se eu abrir?"',
    'Pela primeira vez ele te olha de verdade.',
    '"Se você romper lacre de contêiner embarcado, você comete crime federal, garoto. Com pena."',
    'Ele guarda a caneta amarrada com barbante.',
    '"E o que tiver dentro passa a ser prova de um processo em que você é réu."',
    'Ele começa a andar e depois para.',
    '"É por isso que funciona. Não é medo. É que quem abre vira o criminoso."'
  ],
  ef:{flag:'quem_abre_vira_o_criminoso',
      presagio:'Quem abre vira o criminoso. Esse é o desenho inteiro, e ele foi projetado por alguém.'},
  escolhas:[
    {texto:'Embarcar no navio.', vai:'c8_cais'},
    {texto:'Anotar o número do lacre.', vai:'c8_anotou_lacre'},
    {texto:'Ir embora do porto.', vai:'c8_fim_porto'}
  ]
},

c8_voltou_no_conferente:{
  texto:[
    'De manhã você procura o conferente da prancheta e mostra o que anotou.',
    'Ele lê o número do contêiner. Lê o número do lacre.',
    'E aí ele faz uma coisa que você não esperava: entra no sistema, num terminal velho de tela verde no escritório do pátio, e digita.',
    '"KTU 409 118-2." Ele lê a tela. "Carga geral. Peças de reposição náutica. Destinatário: um CNPJ de Saffron."',
    'Ele copia o CNPJ num papel e te dá, sem você pedir.',
    '"Eu não te dei isso."',
    '"Não deu."',
    '"E, garoto." Ele desliga a tela. "Peça de reposição náutica não faz barulho na lombada."'
  ],
  ef:{flag:['cnpj_de_saffron','destinacao_saffron'],
      npc:{nome:'Conferente do porto', opiniao:4, memoria:'Puxou o contêiner no sistema e te deu o CNPJ do destinatário em Saffron.'},
      rep:{eixo:'bom',delta:2,motivo:'Levou um número a quem tinha o sistema'},
      registrar:'O contêiner KTU 409 118-2 vai para um CNPJ de Saffron, declarado como peças náuticas.',
      presagio:'Um CNPJ. Empresa tem endereço, sócio e contrato social. Tudo público.'},
  escolhas:[
    {texto:'Ir embarcar no navio.', vai:'c8_cais'},
    {texto:'"Como eu descubro de quem é esse CNPJ?"', vai:'c8_como_descubro'},
    {texto:'Ir pro cais e entrar pelo torneio.', vai:'c8_noite_porto'}
  ]
},

c8_como_descubro:{
  texto:[
    '"Como eu descubro de quem é esse CNPJ?"',
    '"Cartório." Ele fala sem pensar. "Ou junta comercial. Contrato social é público."',
    'Ele guarda o barbante da caneta.',
    '"Você vai em cartório, pede certidão simplificada, paga uns oito pokedólares a página e sai com o nome dos sócio."',
    '"É legal?"',
    '"É legal, é barato e ninguém faz." Ele dá de ombros. "Todo mundo acha que segredo de empresa é segredo. Empresa é a coisa mais pública que existe, garoto. O que é secreto é gente."'
  ],
  ef:{flag:'sabe_do_cartorio',
      registrar:'Certidão simplificada em cartório revela os sócios de um CNPJ. É legal, barato e ninguém faz.',
      presagio:'Cartório da rua Dez, em Saffron, abre até as cinco e cobra oito pokedólares a cópia.'},
  escolhas:[
    {texto:'Ir embarcar.', vai:'c8_cais'},
    {texto:'Ir pro cais e entrar pelo torneio.', vai:'c8_noite_porto'}
  ]
},

c8_gritou_no_portao:{
  texto:[
    'Você sai de trás dos pallets e grita.',
    'O caminhão não para. Ele nem desacelera — o motorista olha no retrovisor, vê um adolescente gritando num pátio de porto às três e quarenta da manhã, e continua.',
    'Você corre atrás por uns cinquenta metros e desiste.',
    'Ninguém aparece. Nenhum alarme, nenhuma sirene, nenhum segurança.',
    'Você fica sozinho no meio de um pátio de contêineres, sem fôlego, tendo gritado com um caminhão.',
    'Isso é o que acontece quando se grita: nada.'
  ],
  ef:{flag:'gritou_no_portao', hp:-2, causa:'Corrida no pátio do porto',
      presagio:'Nada aconteceu. Guardar isso é mais útil do que parece.'},
  escolhas:[
    {texto:'Ir até a balança dois.', vai:'c8_balanca_dois'},
    {texto:'Seguir o caminhão até o cais.', vai:'c8_seguiu_caminhao'},
    {texto:'Voltar pro cais e embarcar.', vai:'c8_cais'}
  ]
},

c8_clandestino:{
  texto:[
    'Tem três jeitos de entrar num navio sem passagem.',
    'O primeiro é a passarela de serviço, que tem gente.',
    'O segundo é o cabo de amarração, que é filme.',
    'O terceiro você encontra na terceira volta pelo cais: a escotilha de carga do convés inferior, aberta pra ventilação, com uma escada de gato do lado de fora do casco.',
    'Passa das onze da noite quando você tenta.',
    d=>d.flags.janela_das_23h ? 'E o guardanapo dizia: das 23h às 23h20. Você olha o relógio. São 23h04.' : ''
  ],
  teste:{status:'percepcao', dificuldade:8, nomeStatus:'Percepção',
         critico:'c8_entrou_bem', sucesso:'c8_entrou_bem', parcial:'c8_entrou_visto', falha:'c8_pego'}
},

c8_entrou_bem:{
  texto:[
    'Você entra e ninguém vê.',
    'O corredor de carga é quente de um jeito que não faz sentido num navio, e cheira a ferrugem, tinta e óleo.',
    'Você acha um uniforme de tripulante pendurado num gancho, com o nome de outra pessoa bordado no peito, e veste por cima da sua roupa.',
    'Ninguém olha duas vezes pra um uniforme. Isso é a descoberta mais útil da sua semana.'
  ],
  ef:{flag:['clandestino','uniforme_tripulacao'], rep:{eixo:'ruim',delta:1,motivo:'Entrou clandestino no S.S. Anne'},
      presagio:'Você está usando o nome de outra pessoa bordado no peito. Vai dar certo até não dar.'},
  escolhas:[
    {texto:'Subir para o salão.', vai:'c8_bordo'},
    {texto:'Explorar o porão agora, com uniforme.', vai:'c8_porao'},
    {texto:'Procurar a enfermaria do convés dois.', vai:'c8_enfermaria', cond:d=>!!d.flags.o_garoto_da_enfermaria},
    {texto:'Procurar o corredor de serviço do convés três.', vai:'c8_corredor_servico', cond:d=>!!d.flags.tem_a_chave || !!d.flags.janela_das_23h}
  ]
},

c8_entrou_visto:{
  texto:[
    'Você entra. Um marinheiro te vê de costas no fim do corredor e grita alguma coisa.',
    'Você corre. Ele não corre atrás — só anota, mentalmente, que tem alguém a bordo que não devia estar.',
    'A partir de agora tem gente procurando você neste navio, e o navio tem nove andares e você não conhece nenhum deles.'
  ],
  ef:{flag:['clandestino','procurado_no_navio'], rep:{eixo:'ruim',delta:1,motivo:'Entrou clandestino e foi visto'}},
  escolhas:[
    {texto:'Subir para o salão e se misturar.', vai:'c8_bordo'},
    {texto:'Ficar no porão, longe de gente.', vai:'c8_porao'},
    {texto:'Procurar um uniforme.', vai:'c8_procurou_uniforme'}
  ]
},

c8_procurou_uniforme:{
  texto:[
    'Você passa quarenta minutos procurando alguma coisa pra vestir e acha: um avental de cozinha branco, num carrinho de rouparia.',
    'Avental de cozinha é pior que uniforme de tripulante e melhor que roupa de rota.',
    'Com o avental, você vira um garoto da cozinha, e garoto da cozinha pode andar por três conveses.',
    'Não pelo salão. Não pelos camarotes de cima. Mas por três conveses.'
  ],
  ef:{flag:'uniforme_tripulacao', limpaFlag:'procurado_no_navio'},
  escolhas:[
    {texto:'Subir para o salão mesmo assim.', vai:'c8_bordo'},
    {texto:'Ir pro porão.', vai:'c8_porao'},
    {texto:'Procurar a enfermaria do convés dois.', vai:'c8_enfermaria'},
    {texto:'Procurar o corredor de serviço do convés três.', vai:'c8_corredor_servico'}
  ]
},

c8_pego:{
  texto:[
    'Você é pego antes de passar da escotilha. Dois seguranças, sem conversa.',
    'Eles não chamam a polícia. Levam você pra uma sala do convés inferior com uma mesa e duas cadeiras, revistam sua mochila item por item, e tiram o que acharem que compensa o incômodo.',
    'Um deles anota o seu nome numa folha.',
    '"Some do porto", diz o outro. "Hoje."',
    'Na saída você repara na folha: é uma lista. Tem umas trinta linhas preenchidas. Você é a trinta e uma.'
  ],
  ef:{dinheiro:-800, hp:-4, causa:'Segurança do S.S. Anne', flag:['expulso_do_navio','a_lista_dos_trinta'],
      rep:{eixo:'ruim',delta:1,motivo:'Pego entrando clandestino no S.S. Anne'},
      registrar:'Seu nome entrou numa lista de trinta e uma pessoas na segurança do S.S. Anne.',
      presagio:'Trinta e uma linhas. Trinta pessoas tentaram entrar nesse navio antes de você essa temporada.'},
  escolhas:[
    {texto:'Tentar de novo por outro caminho.', vai:'c8_clandestino'},
    {texto:'Procurar trabalho a bordo.', vai:'c8_trabalho'},
    {texto:'Ficar no cais e esperar o torneio.', vai:'c8_noite_porto'},
    {texto:'Desistir do navio.', vai:'c8_fim_porto'}
  ]
},

c8_trabalho:{
  texto:[
    'O contramestre é um homem de sessenta anos com antebraços de trinta e um bigode que já foi moda.',
    d=>d.flags.indicacao_da_neusa ? '"A Neusa mandou?" Ele lê o guardanapo. "Então tá."' : '"Mão de obra." Ele te mede de cima a baixo. "Cozinha ou carga?"',
    'Nenhuma das duas tem a ver com Pokémon. As duas pagam a passagem.',
    '"Carga é seis hora e é pesado. Cozinha é oito hora e é chato."',
    'Ele já está olhando o próximo da fila, que também é um adolescente.'
  ],
  escolhas:[
    {texto:'Carga. Trabalho pesado, seis horas.', vai:'c8_carga'},
    {texto:'Cozinha. Trabalho chato, oito horas.', vai:'c8_cozinha'},
    {texto:'"Quantos como eu vocês contratam por temporada?"', vai:'c8_quantos_como_eu'},
    {texto:'Desistir e comprar passagem. (8.000 ₽)', vai:'c8_bordo', cond:d=>d.jogador.dinheiro>=8000,
     ef:{dinheiro:-8000, flag:'pagou_passagem'}}
  ]
},

c8_quantos_como_eu:{
  texto:[
    '"Quantos como eu vocês contratam por temporada?"',
    'O contramestre para de olhar a fila.',
    '"Registrado? Uns quarenta."',
    '"E não registrado?"',
    'Ele te olha por um tempo longo e responde uma coisa completamente diferente:',
    '"Eu contrato registrado, garoto. Com carteira, com exame, com nome em lista."',
    'Ele bate na prancheta dele.',
    '"O que acontece dois convés abaixo do meu não é meu departamento, e eu já perguntei duas vez, e das duas vez me disseram que não é meu departamento."'
  ],
  ef:{flag:'nao_e_meu_departamento',
      npc:{nome:'Contramestre Arai', opiniao:2, memoria:'Já perguntou duas vezes sobre o que acontece dois conveses abaixo. Disseram que não é o departamento dele.'},
      presagio:'Ele perguntou duas vezes. Duas é mais do que quase todo mundo.'},
  escolhas:[
    {texto:'Carga.', vai:'c8_carga'},
    {texto:'Cozinha.', vai:'c8_cozinha'},
    {texto:'"Pergunta uma terceira vez."', vai:'c8_terceira_vez'},
    {texto:'"O que tem dois conveses abaixo?"', vai:'c8_dois_conveses'}
  ]
},

c8_terceira_vez:{
  texto:[
    '"Pergunta uma terceira vez."',
    'Ele ri.',
    '"Eu tenho sessenta anos e três neto."',
    '"Então pergunta."',
    'O riso para.',
    'Ele olha a fila de adolescentes atrás de você, que é comprida, e depois olha a prancheta, e depois olha o navio.',
    '"Eu vou perguntar."',
    'Ele fala isso devagar, como quem se ouve falando.',
    '"Depois que esse navio zarpar e eu tiver o contrato da temporada assinado, eu vou perguntar uma terceira vez."',
    'É covardia. É também muito mais do que ele ia fazer há cinco minutos.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Empurrou alguém pra uma terceira pergunta'},
      flag:'a_terceira_pergunta',
      npc:{nome:'Contramestre Arai', opiniao:4, memoria:'Você o convenceu a perguntar uma terceira vez, depois do contrato assinado.'},
      presagio:'Ele vai perguntar depois de assinar o contrato. É covardia e é muito mais do que ontem.'},
  escolhas:[
    {texto:'Carga.', vai:'c8_carga'},
    {texto:'Cozinha.', vai:'c8_cozinha'},
    {texto:'"O que tem dois conveses abaixo?"', vai:'c8_dois_conveses'}
  ]
},

c8_dois_conveses:{
  texto:[
    '"O que tem dois conveses abaixo?"',
    '"Porão de carga."',
    'Ele responde rápido demais.',
    'E depois, porque você não sai, ele baixa a voz sem baixar a guarda:',
    '"E um corredor de acomodação que não tá na planta que eles me deram."',
    'Ele volta pra fila.',
    '"Cozinha ou carga, garoto?"'
  ],
  ef:{flag:'corredor_fora_da_planta', registrar:'Existe um corredor de acomodação fora da planta, dois conveses abaixo do porão de carga do S.S. Anne.',
      presagio:'Fora da planta. Alguém desenhou uma planta e alguém construiu outra coisa.'},
  escolhas:[
    {texto:'Carga.', vai:'c8_carga'},
    {texto:'Cozinha.', vai:'c8_cozinha'},
    {texto:'"Pergunta uma terceira vez."', vai:'c8_terceira_vez'}
  ]
},

c8_carga:{
  texto:[
    'Seis horas carregando caixa num corredor de aço a trinta e oito graus.',
    'Você entende, na primeira hora, que trabalho braçal de verdade não tem nada a ver com esforço: tem a ver com repetição.',
    'É a mesma caixa, o mesmo caminho, o mesmo movimento, seiscentas vezes.'
  ],
  teste:{status:'forca', dificuldade:6, nomeStatus:'Força',
         critico:'c8_carga_ok', sucesso:'c8_carga_ok', parcial:'c8_carga_meio', falha:'c8_carga_ruim'}
},

c8_carga_ok:{
  texto:[
    'Você aguenta. Mais que isso: você aguenta bem o suficiente pro contramestre reparar.',
    '"Você tem passagem, comida e cama de tripulante até Cinnabar." Ele te dá um tapa no ombro que quase te derruba. "E se quiser emprego depois, me procura."',
    'No meio do turno você percebe uma coisa que não consegue mais desperceber.',
    'Três caixas do fundo do corredor têm furo de ventilação.',
    'Caixa de carga não tem furo de ventilação.'
  ],
  ef:{flag:['trabalhou_no_navio','viu_caixas_furadas'], dinheiro:600,
      npc:{nome:'Contramestre Arai', opiniao:4, memoria:'Você aguentou seis horas de carga sem reclamar.'},
      rep:{eixo:'bom',delta:1,motivo:'Trabalhou honestamente pela passagem'}},
  escolhas:[
    {texto:'Subir para o salão — e pensar nas caixas.', vai:'c8_bordo'},
    {texto:'Ficar no porão e abrir uma agora.', vai:'c8_porao'},
    {texto:'Contar pro contramestre.', vai:'c8_contou_ao_contramestre'},
    {texto:'Procurar a enfermaria do convés dois.', vai:'c8_enfermaria'}
  ]
},

c8_contou_ao_contramestre:{
  texto:[
    '"Tem três caixa com furo de ventilação no fundo do corredor."',
    'Bruno para de escrever.',
    'Ele vai lá. Você vai junto. Ele olha as três caixas por um tempo longo, e passa a mão nos furos, e cheira, o que é a coisa mais eficiente que dá pra fazer.',
    'Depois ele endireita as costas.',
    '"Caixa lacrada de carga geral."',
    '"Tem furo."',
    '"Tem furo." Ele confirma. E aí: "Isso é do manifesto do convés inferior. Isso não é meu."',
    'Ele volta pro corredor. No meio do caminho, sem virar:',
    '"Eu vou perguntar. Não hoje."'
  ],
  ef:{flag:'bruno_vai_perguntar',
      npc:{nome:'Contramestre Arai', opiniao:3, memoria:'Você mostrou as caixas com furo pra ele. Ele disse que vai perguntar, não hoje.'},
      presagio:'"Não hoje." Você vai ouvir isso de muita gente boa.'},
  escolhas:[
    {texto:'Abrir uma caixa você mesmo.', vai:'c8_porao'},
    {texto:'Subir para o salão.', vai:'c8_bordo'},
    {texto:'Procurar a enfermaria.', vai:'c8_enfermaria'}
  ]
},

c8_carga_meio:{
  texto:[
    'Você aguenta, mal. Nas últimas duas horas é só teimosia e o gosto de ferro na boca.',
    'O contramestre te dá a passagem e nenhum elogio, o que é justo.',
    'Antes de sair do porão, você repara em três caixas com furo de ventilação no fundo do corredor.',
    'Você está cansado demais pra reagir. Mas você repara, e reparar já muda alguma coisa.'
  ],
  ef:{flag:['trabalhou_no_navio','viu_caixas_furadas'], hp:-3, causa:'Turno de carga no S.S. Anne'},
  escolhas:[
    {texto:'Subir para o salão.', vai:'c8_bordo'},
    {texto:'Ficar no porão e olhar as caixas.', vai:'c8_porao'},
    {texto:'Contar pro contramestre.', vai:'c8_contou_ao_contramestre'},
    {texto:'Dormir. Você não aguenta mais.', vai:'c8_bordo'}
  ]
},

c8_carga_ruim:{
  texto:[
    'Você não aguenta.',
    'Na quarta hora, o contramestre te manda parar antes que você se machuque de verdade. Não tem deboche nenhum no jeito dele.',
    '"Sem julgamento", ele diz. "Você tem quinze ano e sessenta quilo. Mas sem passagem também."',
    'Ele te dá comida e um lugar pra sentar no corredor de serviço. É o que ele pode.',
    'Você fica sentado no chão de aço comendo arroz com a mão tremendo, olhando outros adolescentes carregarem caixa.'
  ],
  ef:{hp:-5, causa:'Esforço no porão do S.S. Anne',
      presagio:'Outros adolescentes carregando caixa. Você está sentado olhando. Repara em quantos são.'},
  escolhas:[
    {texto:'Tentar a cozinha.', vai:'c8_cozinha'},
    {texto:'Contar quantos adolescentes estão carregando.', vai:'c8_contou_os_adolescentes'},
    {texto:'Tentar entrar clandestino mais tarde.', vai:'c8_clandestino'},
    {texto:'Desistir do navio.', vai:'c8_fim_porto'}
  ]
},

c8_contou_os_adolescentes:{
  texto:[
    'Você conta.',
    'Dezenove. Dezenove pessoas de menos de vinte anos carregando caixa naquele corredor, no mesmo turno.',
    'Você pergunta pro que está mais perto quantos são registrados.',
    '"Registrado?" Ele nem para de andar. "Eu, não. Eu tô por passagem."',
    'Você pergunta pro próximo. Mesma resposta.',
    'Você pergunta pra cinco. Cinco "por passagem".',
    'Ninguém está mentindo, ninguém está escondendo nada, ninguém acha que isso é errado.',
    'É só como funciona.'
  ],
  ef:{flag:'dezenove_por_passagem',
      registrar:'Dezenove adolescentes carregando carga no S.S. Anne, "por passagem", sem registro.',
      rep:{eixo:'bom',delta:1,motivo:'Contou o que ninguém conta'},
      presagio:'Ninguém acha que é errado. É só como funciona. Essa frase é o motor de tudo.'},
  escolhas:[
    {texto:'Tentar a cozinha.', vai:'c8_cozinha'},
    {texto:'Falar com o contramestre sobre isso.', vai:'c8_quantos_como_eu'},
    {texto:'Tentar entrar clandestino mais tarde.', vai:'c8_clandestino'},
    {texto:'Desistir do navio.', vai:'c8_fim_porto'}
  ]
},

c8_cozinha:{
  texto:[
    'Oito horas descascando, lavando e carregando bandeja. A cozinha do S.S. Anne alimenta setecentas pessoas por noite e tem trinta e dois funcionários.',
    'É quente, é barulhento, e ninguém para.',
    'E você ouve muita coisa, porque cozinha é onde tudo se fala.',
    '"...o do camarote 40 trouxe de novo."',
    '"Não é da nossa conta."',
    '"Tinha um garoto junto, esse ano."',
    '"NÃO É DA NOSSA CONTA."'
  ],
  ef:{flag:['trabalhou_no_navio','ouviu_camarote_40'], dinheiro:400,
      rep:{eixo:'bom',delta:1,motivo:'Trabalhou honestamente pela passagem'},
      registrar:'Ouviu falar do camarote 40 na cozinha do S.S. Anne.'},
  escolhas:[
    {texto:'Perguntar quem montou as bandejas do 40.', vai:'c8_bandejas_do_40'},
    {texto:'Se oferecer pra levar a bandeja do 40.', vai:'c8_levou_a_bandeja'},
    {texto:'Subir para o salão quando o turno acabar.', vai:'c8_bordo'},
    {texto:'Não se meter. Terminar o turno.', vai:'c8_bordo'}
  ]
},

c8_bandejas_do_40:{
  texto:[
    '"Quem monta as bandeja do quarenta?"',
    'A cozinha inteira não para, mas três pessoas olham pra você ao mesmo tempo, e isso é mais eloquente que qualquer resposta.',
    'Um cozinheiro de uns trinta anos responde sem olhar:',
    '"A Neusa monta."',
    '"Quantas?"',
    'Pausa de dois segundos e o barulho de panela continua.',
    '"Quatro."',
    'Ele vira a chapa.',
    '"E a gente não fala disso na cozinha, garoto. A gente fala disso no bar."'
  ],
  ef:{flag:'quatro_bandejas',
      registrar:'Quatro bandejas por dia para o camarote 40.',
      presagio:'"A gente não fala disso na cozinha. A gente fala disso no bar." Todo lugar tem o cômodo onde se fala.'},
  escolhas:[
    {texto:'Se oferecer pra levar a bandeja.', vai:'c8_levou_a_bandeja'},
    {texto:'Terminar o turno e subir.', vai:'c8_bordo'},
    {texto:'Procurar o corredor de serviço do convés três.', vai:'c8_corredor_servico'}
  ]
},

c8_levou_a_bandeja:{
  texto:[
    '"Eu levo a do quarenta."',
    'Ninguém discute. Ninguém quer levar a do quarenta.',
    'São quatro bandejas empilhadas num carrinho, com cúpula de metal em cima de cada prato.',
    'O corredor do convés três é carpetado e silencioso de um jeito que o resto do navio não é.',
    'Na porta do 40 tem um homem sentado numa cadeira dobrável, lendo um livro de bolso.',
    'Ele levanta a cabeça, olha o carrinho, e aponta o chão.',
    '"Aí."',
    'Você põe as quatro bandejas no chão do corredor. Ele volta pro livro.',
    'A porta não abre enquanto você está lá. Você demora de propósito arrumando o carrinho. A porta não abre.'
  ],
  ef:{flag:['levou_a_bandeja','ouviu_camarote_40','quatro_bandejas'],
      registrar:'Levou as quatro bandejas ao camarote 40. A porta não abriu.',
      presagio:'A porta não abre enquanto tem alguém no corredor. Isso é uma regra, e regras têm horário.'},
  escolhas:[
    {texto:'Voltar depois pra pegar as bandejas vazias.', vai:'c8_bandejas_vazias'},
    {texto:'Perguntar alguma coisa pro homem da cadeira.', vai:'c8_homem_da_cadeira'},
    {texto:'Terminar o turno e subir pro salão.', vai:'c8_bordo'},
    {texto:'Procurar o corredor de serviço.', vai:'c8_corredor_servico'}
  ]
},

c8_bandejas_vazias:{
  texto:[
    'Quarenta minutos depois você volta com o carrinho.',
    'As quatro bandejas estão empilhadas no chão do corredor, vazias.',
    'Você recolhe.',
    'E aí você repara: três estão limpas do jeito que prato fica quando alguém come com talher.',
    'A quarta está limpa do jeito que prato fica quando alguém come com a mão.'
  ],
  ef:{flag:'a_quarta_bandeja',
      registrar:'Das quatro bandejas do camarote 40, três foram comidas com talher e uma com a mão.',
      presagio:'Três com talher, uma com a mão. Repara em quantas informações cabem num prato sujo.'},
  escolhas:[
    {texto:'Perguntar alguma coisa pro homem da cadeira.', vai:'c8_homem_da_cadeira'},
    {texto:'Voltar amanhã e conferir de novo.', vai:'c8_conferiu_de_novo'},
    {texto:'Subir pro salão.', vai:'c8_bordo'},
    {texto:'Procurar o corredor de serviço.', vai:'c8_corredor_servico'}
  ]
},

c8_conferiu_de_novo:{
  texto:[
    'Você faz o serviço do camarote 40 por três dias.',
    'Todo dia: quatro bandejas. Três com talher, uma sem.',
    'No segundo dia você põe, sem falar com ninguém, um bilhete embaixo da quarta bandeja.',
    'Está escrito: "VOCÊ TÁ BEM?"',
    'No terceiro dia, quando você recolhe, o bilhete voltou.',
    'Do outro lado, escrito com o dedo molhado em molho, quase ilegível, uma palavra:',
    '"NAO"'
  ],
  ef:{flag:['contato_no_40','o_bilhete'],
      rep:{eixo:'bom',delta:3,motivo:'Mandou um bilhete pra dentro de uma porta que não abre'},
      registrar:'Alguém dentro do camarote 40 respondeu "NAO" num bilhete escrito com molho.',
      presagio:'Escrito com o dedo molhado em molho. Quem está lá dentro não tem caneta.'},
  escolhas:[
    {texto:'Mandar outro bilhete perguntando o nome.', vai:'c8_segundo_bilhete'},
    {texto:'Procurar o capitão agora.', vai:'c8_capitao'},
    {texto:'Entrar no camarote 40 de qualquer jeito.', vai:'c8_camarote'},
    {texto:'Procurar o corredor de serviço.', vai:'c8_corredor_servico'}
  ]
},

c8_segundo_bilhete:{
  texto:[
    'Você manda outro. "QUAL SEU NOME?"',
    'Volta no dia seguinte, com o mesmo molho, num guardanapo em vez do bilhete, porque o bilhete não voltou.',
    'Está escrito: "DENIS"',
    d=>d.flags.a_carta_do_denis || d.flags.copiou_a_carta
      ? 'Você senta no chão do corredor de serviço com um guardanapo na mão e fica um tempo sem conseguir respirar direito.'
      : 'Você não conhece nenhum Denis. Mas agora tem um nome, e nome é tudo.',
    'Embaixo, menor, quase sem molho porque estava acabando:',
    '"SOMOS 2"'
  ],
  ef:{flag:['o_denis_esta_no_40','somos_2'],
      rep:{eixo:'bom',delta:2,motivo:'Insistiu até ter um nome'},
      registrar:'Dentro do camarote 40: Denis, e mais um. "SOMOS 2".',
      presagio:'Somos dois. Quatro bandejas, duas camas, dois que comem com talher e dois que não.'},
  escolhas:[
    {texto:'Procurar o capitão.', vai:'c8_capitao'},
    {texto:'Entrar no camarote 40.', vai:'c8_camarote'},
    {texto:'Procurar o corredor de serviço do convés três.', vai:'c8_corredor_servico'},
    {texto:'Subir pro salão e achar quem é do camarote.', vai:'c8_bordo'}
  ]
},

c8_homem_da_cadeira:{
  texto:[
    'Você pergunta a coisa mais inofensiva que consegue pensar.',
    '"O senhor quer água?"',
    'Ele levanta a cabeça do livro de bolso.',
    'Tem uns cinquenta anos, camisa social sem gravata, e um jeito de sentar que não é de segurança de balada: é de quem já ficou muito tempo sentado em cadeira dobrável em corredor.',
    '"Quero."',
    'Você traz. Ele agradece e volta pro livro.',
    'O livro é um romance policial de banca. Ele está na página duzentos e poucos.',
    'No terceiro dia ele vai estar com outro livro.'
  ],
  ef:{flag:'o_homem_do_corredor',
      npc:{nome:'Homem do corredor', opiniao:1, memoria:'Você levou água pra ele no corredor do camarote 40.'},
      presagio:'Ele lê um romance por temporada e não pergunta nada. É a pessoa mais perigosa desse navio.'},
  escolhas:[
    {texto:'Voltar depois pra pegar as bandejas vazias.', vai:'c8_bandejas_vazias'},
    {texto:'Perguntar o que tem lá dentro.', vai:'c8_perguntou_o_que_tem'},
    {texto:'Terminar o turno e subir.', vai:'c8_bordo'},
    {texto:'Procurar o corredor de serviço.', vai:'c8_corredor_servico'}
  ]
},

c8_perguntou_o_que_tem:{
  texto:[
    '"O que tem aí dentro?"',
    'Ele marca a página com o dedo.',
    '"Hóspede."',
    '"Quatro bandeja pra dois hóspede."',
    'Ele olha pra você por uns três segundos e volta pro livro.',
    '"Você tem quantos anos?"',
    '"Quinze."',
    '"Quinze." Ele vira a página. "Então você ainda vai fazer muita pergunta e um dia você vai parar. Eu parei aos trinta e um."',
    'Ele não olha mais pra você.',
    '"Traz a água amanhã também."'
  ],
  ef:{flag:'ele_parou_aos_31',
      presagio:'"Eu parei aos trinta e um." Ele falou isso sem nenhum arrependimento, e é isso que gela.'},
  escolhas:[
    {texto:'Voltar pra pegar as bandejas vazias.', vai:'c8_bandejas_vazias'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'},
    {texto:'Subir pro salão.', vai:'c8_bordo'},
    {texto:'Procurar o corredor de serviço.', vai:'c8_corredor_servico'}
  ]
}
,

/* ─────────────── A BORDO ─────────────── */

c8_bordo:{
  texto:[
    'O salão do S.S. Anne tem lustre.',
    'Lustre. Num navio. Você fica parado na porta olhando um lustre balançar de leve com o marulho e entende, de uma vez, que existem dois Kantos e você passou quinze anos num deles.',
    'Tem gente de trinta cidades diferentes aqui, e a maioria delas nunca dormiu no chão de uma rota. Tem piano ao vivo. Tem gente de gravata às onze da noite por vontade própria.',
    d=>{
      if (d.flags.uniforme_tripulacao) return 'De uniforme, você é invisível. Ninguém olha para tripulação — não por desprezo, é mais simples que desprezo: tripulação não é gente que se olha. Dá pra andar por quase tudo.';
      if (d.flags.clandestino) return 'Você está com roupa de rota num salão de smoking. Todo mundo sabe que você não pertence aqui, e ninguém diz nada, que é pior do que se dissessem.';
      if (d.flags.trabalhou_no_navio) return 'Você entra pelo corredor de serviço e ninguém repara. Cansaço nos braços, passagem no bolso, e o direito de estar aqui que você pagou com o corpo.';
      if (d.flags.entrou_pelo_torneio) return 'Você entrou pela porta da frente com um crachá de participante e a moça do balcão te chamou de "atleta", o que é a coisa mais engraçada que já te falaram.';
      return 'Você pagou para estar aqui, então você pertence aqui. É assim que funciona, aparentemente, e você acabou de descobrir por oito mil pokedólares.';
    },
    'Num canto do salão, uma arena montada com corda e piso emborrachado. O torneio começa em vinte minutos e tem gente já apostando no balcão.',
    'No corredor dos camarotes do convés três, o número 40 tem um homem sentado numa cadeira dobrável lendo um romance de banca.',
    'Camarote não tem alguém sentado na porta.'
  ],
  ef:{registrar:'Entrou no S.S. Anne.'},
  escolhas:[
    {texto:'Entrar no torneio.', vai:'c8_torneio'},
    {texto:'Ir até o camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão ver as caixas com furo.', vai:'c8_porao'},
    {texto:'Circular pelo salão e ouvir.', vai:'c8_salao'}
  ]
},

c8_salao:{
  texto:[
    'Você anda pelo salão sem destino. Isso é uma habilidade — parecer que você está indo a algum lugar.',
    '"...ele paga adiantado, sempre."',
    '"Eu não quero saber o que tem na caixa."',
    '"Se descarrega em Celadon, não é problema de Vermilion."',
    'Numa mesa perto da janela, um homem de cinquenta anos sozinho com três taças vazias te chama com a mão.',
    '"Você é novo." Não é pergunta. "Senta. Eu pago a sua bebida e você me ouve reclamar. É um bom negócio pra você."'
  ],
  escolhas:[
    {texto:'Sentar e ouvir.', vai:'c8_homem_mesa'},
    {texto:'Continuar circulando.', vai:'c8_mais_salao'},
    {texto:'Ir para o torneio.', vai:'c8_torneio'},
    {texto:'Ir para o camarote 40.', vai:'c8_camarote'}
  ]
},

c8_mais_salao:{
  texto:[
    'Você dá mais uma volta e presta atenção em outra coisa: não nas conversas, nas pessoas.',
    'Tem três tipos de gente neste salão.',
    'Tem quem veio se divertir, que é a maioria e que não sabe de nada.',
    'Tem quem veio trabalhar, de uniforme, que sabe de tudo e olha pro chão.',
    'E tem umas seis ou sete pessoas que não são nenhum dos dois. Elas estão em pé, em pontos diferentes do salão, sozinhas, sem beber, olhando as portas.',
    'Uma delas olha pra você, checa alguma coisa numa lista mental, e volta a olhar a porta.'
  ],
  ef:{flag:'as_seis_pessoas',
      presagio:'Seis pessoas olhando portas num salão de festa. Nenhuma delas de uniforme.'},
  escolhas:[
    {texto:'Chegar perto de uma delas.', vai:'c8_chegou_perto'},
    {texto:'Sentar com o homem das três taças.', vai:'c8_homem_mesa'},
    {texto:'Ir para o torneio.', vai:'c8_torneio'},
    {texto:'Ir para o camarote 40.', vai:'c8_camarote'}
  ]
},

c8_chegou_perto:{
  texto:[
    'Você anda até a mais perto, uma mulher de uns trinta e cinco anos encostada numa coluna.',
    'Ela te vê chegando de longe e não muda de posição.',
    '"Boa noite."',
    '"Boa noite. A senhora trabalha aqui?"',
    '"Não."',
    'Ela responde e não completa, que é o jeito mais eficiente de encerrar uma conversa.',
    'Você fica ali de pé por uns três segundos constrangedores.',
    '"Você é do torneio?" ela pergunta.',
    '"Sou."',
    'Ela olha o seu cinto, conta as bolas, e anota alguma coisa num telefone.',
    '"Boa sorte."'
  ],
  ef:{flag:'foi_contado_no_salao',
      registrar:'Alguém no salão do S.S. Anne contou os Pokémon do seu cinto e anotou.',
      presagio:'Ela contou o seu cinto e anotou. Você acabou de virar uma linha.'},
  escolhas:[
    {texto:'"O que a senhora anotou?"', vai:'c8_o_que_anotou'},
    {texto:'Ir para o torneio.', vai:'c8_torneio'},
    {texto:'Ir para o camarote 40.', vai:'c8_camarote'},
    {texto:'Sentar com o homem das três taças.', vai:'c8_homem_mesa'}
  ]
},

c8_o_que_anotou:{
  texto:[
    '"O que a senhora anotou?"',
    'Ela guarda o telefone.',
    '"Seis."',
    '"Seis o quê?"',
    '"Você tem seis participantes registrados e a média é quatro." Ela fala com uma paciência profissional. "Isso muda a cotação."',
    '"Vocês apostam."',
    '"Eu não aposto. Eu precifico."',
    'Ela olha a porta de novo.',
    '"É a mesma coisa que o rapaz do balcão faz, mas ele chama de aposta porque ele perde dinheiro e eu não."'
  ],
  ef:{flag:'entendeu_a_cotacao',
      presagio:'Ela precifica. Você é um número numa planilha antes mesmo de entrar na arena.'},
  escolhas:[
    {texto:'"E quanto eu valho?"', vai:'c8_quanto_valho'},
    {texto:'Ir para o torneio.', vai:'c8_torneio'},
    {texto:'Ir para o camarote 40.', vai:'c8_camarote'}
  ]
},

c8_quanto_valho:{
  texto:[
    '"E quanto eu valho?"',
    'Pela primeira vez ela olha pra você como pessoa.',
    '"Você tem quantos anos?"',
    '"Quinze."',
    'Ela faz uma careta muito rápida, de nojo, e não é de você.',
    '"Não entra nessa arena."',
    '"Por quê?"',
    '"Porque eu precifiquei quatro de vocês hoje e três eram menores de idade." Ela bota o telefone no bolso. "E porque quem ganha é convidado a conversar depois. E a conversa não é sobre o prêmio."'
  ],
  ef:{flag:'aviso_da_cotacao',
      npc:{nome:'Mulher da coluna', opiniao:2, memoria:'Te avisou pra não entrar na arena do S.S. Anne.'},
      presagio:'Ela te avisou e você vai entrar assim mesmo. Todo mundo entra.'},
  escolhas:[
    {texto:'Entrar no torneio mesmo assim.', vai:'c8_torneio'},
    {texto:'"Que conversa?"', vai:'c8_que_conversa'},
    {texto:'Ir para o camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'}
  ]
},

c8_que_conversa:{
  texto:[
    '"Que conversa?"',
    'Ela suspira.',
    '"Olha, garoto. Eu trabalho com número. Eu não sei o conteúdo da conversa e eu não quero saber."',
    'Ela ajeita a bolsa.',
    '"Eu sei que ela acontece no convés três, que dura uns quarenta minutos, e que dos quatro vencedores dos últimos quatro anos, dois continuam competindo em Kanto normalmente."',
    '"E os outros dois?"',
    '"Os outros dois eu não achei." Ela dá de ombros. "E eu sou boa de achar gente. É literalmente o meu trabalho."'
  ],
  ef:{flag:'dois_de_quatro', registrar:'Dos quatro vencedores do torneio do Anne, dois sumiram.',
      presagio:'Dois de quatro. E ela é boa de achar gente.'},
  escolhas:[
    {texto:'Entrar no torneio.', vai:'c8_torneio'},
    {texto:'Ir direto pro camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'}
  ]
},

c8_homem_mesa:{
  texto:[
    'Você senta. Ele empurra uma taça cheia na sua direção e você não bebe, e ele não insiste, e isso já diz que ele não é mau sujeito.',
    'Ele trabalhou dezoito anos na Silph. Saiu ano passado.',
    '"Eu não vou dizer por quê. Mas vou dizer uma coisa: quando uma empresa começa a chamar o setor de pesquisa de “setor de recursos”, você atualiza o currículo."',
    'Ele bebe.',
    '"Você já ouviu falar do que tinha em Cinnabar?"'
  ],
  ef:{npc:{nome:'Ex-Silph', opiniao:1, memoria:'Te abordou no salão do S.S. Anne e falou do "setor de recursos".'}},
  escolhas:[
    {texto:'"Não. O que tinha?"', vai:'c8_cinnabar_conta'},
    {texto:'"Ouvi. Um laboratório que fechou no papel."', vai:'c8_cinnabar_conta',
     cond:d=>!!d.flags.conta_de_luz_cinnabar || !!d.flags.fossil_e_material},
    {texto:'"Por que o senhor tá me contando isso?"', vai:'c8_porque_me_conta'},
    {texto:'Agradecer e levantar.', vai:'c8_mais_salao'}
  ]
},

c8_cinnabar_conta:{
  texto:[
    '"Tinha um tanque."',
    'Ele mede com as duas mãos e as mãos não chegam.',
    '"Do tamanho de um carro. Vidro de doze centímetros. Instalado em setenta e nove e desativado em oitenta e nove."',
    '"E o que tinha dentro?"',
    '"Água."',
    'Ele bebe.',
    '"Depois de oitenta e nove, água. Antes disso eu não sei, porque o meu crachá era branco e o andar era de crachá preto."',
    'Ele põe a taça na mesa com cuidado exagerado de bêbado educado.',
    '"Mas eu sei quanto o tanque consumia. Isso passava pela minha mesa. E eu sei que o que estava lá dentro dobrou de tamanho em quatorze meses, porque o consumo dobrou em quatorze meses."'
  ],
  ef:{flag:['sabe_do_tanque','fossil_e_material'],
      registrar:'Um tanque de doze centímetros de vidro em Cinnabar; o que estava dentro dobrou em quatorze meses.',
      presagio:'Dobrou de tamanho em quatorze meses. Guarda o número. Você vai conhecer o que cresceu.'},
  escolhas:[
    {texto:'"E aí?"', vai:'c8_e_ai_cinnabar'},
    {texto:'"Por que o senhor tá me contando isso?"', vai:'c8_porque_me_conta'},
    {texto:'"O senhor falou com alguém sobre isso?"', vai:'c8_falou_com_alguem'},
    {texto:'Agradecer e levantar.', vai:'c8_mais_salao'}
  ]
},

c8_e_ai_cinnabar:{
  texto:[
    '"E aí em oitenta e nove teve o incidente."',
    'Ele fala a palavra "incidente" com um desprezo profundo.',
    '"Nunca foi divulgado nada. Nem número de ferido, nem causa, nem nome de ninguém."',
    '"E o senhor sabe?"',
    '"Eu sei que o setor foi encerrado, que quatro pessoas foram transferidas pra Saffron com promoção, e que o prédio continuou com luz acesa."',
    'Ele olha a janela do salão, onde não dá pra ver nada porque é noite e é mar.',
    '"Quatro pessoas com promoção, garoto. Isso não é encobrir um acidente. Isso é premiar um resultado."'
  ],
  ef:{flag:'premiar_um_resultado',
      registrar:'Quatro pessoas do setor encerrado de Cinnabar foram promovidas e transferidas para Saffron.',
      presagio:'Premiar um resultado. Seja o que for que aconteceu naquele laboratório, alguém achou que deu certo.'},
  escolhas:[
    {texto:'"O senhor sabe o nome dos quatro?"', vai:'c8_os_quatro_nomes'},
    {texto:'"Por que o senhor tá me contando isso?"', vai:'c8_porque_me_conta'},
    {texto:'Agradecer e levantar.', vai:'c8_mais_salao'},
    {texto:'"O senhor devia contar isso pra alguém que possa fazer algo."', vai:'c8_falou_com_alguem'}
  ]
},

c8_os_quatro_nomes:{
  texto:[
    '"O senhor sabe o nome dos quatro?"',
    'Ele para com a taça na metade do caminho.',
    '"Eu sei um."',
    'Ele põe a taça na mesa.',
    '"E eu vou te falar porque eu tô com três taça e porque eu vou descer em Cinnabar amanhã e provavelmente nunca mais te ver."',
    'Ele diz um nome. É um sobrenome curto, comum, do tipo que tem em qualquer lista telefônica.',
    '"Amano. Doutor alguma coisa Amano. Ele era da parte técnica e ele é o único que eu vi de perto, porque ele descia pro nosso andar pra pegar café, o que nenhum crachá preto fazia."',
    'Ele volta pra taça.',
    '"Ele era simpático. Isso é o que me tira o sono."'
  ],
  ef:{flag:['sabe_de_sena','sabe_do_tanque'],
      registrar:'Dr. Amano, da parte técnica do laboratório de Cinnabar, foi promovido e transferido para Saffron.',
      npc:{nome:'Ex-Silph', opiniao:3, memoria:'Te deu o nome do Dr. Amano com três taças na frente.'},
      presagio:'"Ele era simpático. Isso é o que me tira o sono." Você vai apertar a mão dele.'},
  escolhas:[
    {texto:'"O senhor devia contar isso pra alguém."', vai:'c8_falou_com_alguem'},
    {texto:'Anotar o nome e agradecer.', vai:'c8_mais_salao',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Anotou um nome que ninguém tinha anotado'}}},
    {texto:'"Por que o senhor tá me contando isso?"', vai:'c8_porque_me_conta'}
  ]
},

c8_porque_me_conta:{
  texto:[
    '"Por que o senhor tá me contando isso?"',
    'Ele olha em volta do salão inteiro, devagar, de um jeito que não é paranoia — é hábito.',
    '"Porque você é ninguém."',
    'Ele não está sendo cruel.',
    '"Se eu contar pra um jornalista, ele pede fonte e eu viro fonte. Se eu contar pra um advogado, ele quer documento e eu não tenho. Se eu contar pra Liga, eles anotam e arquivam."',
    'Ele encolhe os ombros.',
    '"Se eu contar pra você, não acontece nada. E eu preciso muito que isso saia da minha cabeça e vá pra cabeça de outra pessoa, porque faz um ano que eu carrego sozinho."'
  ],
  ef:{flag:'carregar_sozinho',
      rep:{eixo:'bom',delta:1,motivo:'Serviu de lugar onde alguém pôde pôr uma coisa pesada'},
      presagio:'"Se eu contar pra você, não acontece nada." Ele vai errar nisso.'},
  escolhas:[
    {texto:'"Pode acontecer alguma coisa."', vai:'c8_pode_acontecer'},
    {texto:'"E o senhor sabe o nome de alguém?"', vai:'c8_os_quatro_nomes'},
    {texto:'Ficar mais um pouco ouvindo.', vai:'c8_cinnabar_conta'},
    {texto:'Agradecer e levantar.', vai:'c8_mais_salao'}
  ]
},

c8_pode_acontecer:{
  texto:[
    '"Pode acontecer alguma coisa."',
    'Ele ri, e é a risada de alguém que quer muito acreditar.',
    '"Pode?"',
    '"Eu tenho isso." Você mostra o que você tem — o caderno, a folha, a cópia, o que for.',
    d=>d.flags.papel_com_brasao || d.flags.leu_o_estatuto
      ? 'Ele lê. E o rosto dele muda de um jeito que você vai lembrar por muito tempo: ele fica com medo e aliviado ao mesmo tempo, e as duas coisas na mesma cara não deviam caber.'
      : 'Ele olha. Não tem nada demais ali ainda, e ele é educado demais pra dizer isso.',
    '"Anota o meu telefone", ele diz. "Não me liga. Anota."',
    '"Pra quê, então?"',
    '"Pra você ter, no dia em que precisar de alguém que trabalhou dezoito ano lá dentro e que aceite assinar."'
  ],
  ef:{flag:'telefone_do_ex_silph',
      npc:{nome:'Ex-Silph', opiniao:5, memoria:'Te deu o telefone dele para o dia em que você precisar de alguém de dentro que assine.'},
      rep:{eixo:'bom',delta:2,motivo:'Deu a alguém um motivo pra acreditar que ia acontecer alguma coisa'},
      registrar:'Tem um ex-funcionário da Silph disposto a assinar, se um dia você precisar.',
      presagio:'Alguém de dentro, disposto a assinar. Isso vale mais que qualquer insígnia e você ainda não sabe.'},
  escolhas:[
    {texto:'Anotar e agradecer.', vai:'c8_mais_salao'},
    {texto:'"O senhor sabe o nome de alguém de lá?"', vai:'c8_os_quatro_nomes'},
    {texto:'Ir para o torneio.', vai:'c8_torneio'}
  ]
},

c8_falou_com_alguem:{
  texto:[
    '"O senhor falou com alguém sobre isso?"',
    '"Falei com a minha mulher."',
    'Ele gira a taça.',
    '"E com um repórter de Celadon, ano passado. Ele foi ótimo. Anotou tudo, gravou, me tratou bem."',
    '"E saiu?"',
    '"Saiu uma matéria de quarenta linhas sobre modernização do parque industrial de Cinnabar."',
    'Ele termina a taça.',
    '"Ele não foi comprado. Eu acho que ele não foi comprado. Eu acho que ele levou pra chefia dele e a chefia perguntou quem era a fonte, e a fonte era um contador de cinquenta anos com uma conta de energia impressa."'
  ],
  ef:{flag:'a_materia_de_quarenta_linhas',
      presagio:'Quarenta linhas sobre modernização do parque industrial. É assim que as coisas não saem.'},
  escolhas:[
    {texto:'"Pode acontecer alguma coisa."', vai:'c8_pode_acontecer'},
    {texto:'"O senhor sabe o nome dos quatro?"', vai:'c8_os_quatro_nomes'},
    {texto:'Agradecer e levantar.', vai:'c8_mais_salao'}
  ]
},

/* ─────────────── TORNEIO ─────────────── */

c8_torneio:{
  texto:[
    'A arena é um quadrado de piso emborrachado cercado por corda, montado no canto do salão, com gente de taça na mão em volta.',
    'São oito participantes. Você olha os outros sete.',
    'Dois são adultos com equipamento caro. Um é uma mulher de uns vinte e cinco anos que claramente sabe o que está fazendo.',
    'Os outros quatro têm menos de dezoito anos, e dois deles têm menos que você.',
    'O locutor é um funcionário do navio com microfone e uma alegria profissional insuportável.',
    d=>d.flags.o_garoto_da_enfermaria ? 'Tem uma cadeira vazia na fila dos participantes com um número de inscrição colado no encosto.' : '',
    '"PRIMEIRA LUTA!"'
  ],
  ef:{registrar:'Entrou no torneio do S.S. Anne.'},
  batalha:{dex:26, nivel:32, tipo:'treinador', treinador:'Adversário do torneio', fuga:false,
           timeExtra:[{dex:57, nivel:33}],
           vitoria:'c8_ganhou_torneio', derrota:'c8_perdeu_torneio', gameover:'gameover'}
},

c8_ganhou_torneio:{
  texto:[
    'Três lutas. Você ganha as três.',
    'A terceira é contra a mulher de vinte e cinco anos, e ela aperta a sua mão no fim e diz "bom, hein" de um jeito que vale mais que o prêmio.',
    'O locutor fala o seu nome no microfone, errado, e o salão bate palma por uns oito segundos e volta a conversar.',
    'Vinte mil pokedólares. Em dinheiro, num envelope, numa bandeja.',
    'E enquanto você conta — porque você conta, na frente de todo mundo, porque você tem quinze anos e nunca viu vinte mil pokedólares —, um homem de terno para do seu lado e espera você terminar de contar.',
    '"Parabéns", ele diz. "Sério. Foi bonito de assistir."',
    'Ele espera.',
    '"Você tem dez minutos? Eu queria conversar."'
  ],
  ef:{dinheiro:20000, rep:{eixo:'bom',delta:2,motivo:'Venceu o torneio do S.S. Anne'},
      flag:'venceu_torneio_navio',
      registrar:'Venceu o torneio do S.S. Anne. Um homem de terno pediu dez minutos.',
      presagio:'Ele esperou você terminar de contar o dinheiro. Ele fez isso de propósito.'},
  escolhas:[
    {texto:'"Tenho."', vai:'c8_a_conversa'},
    {texto:'"Não tenho." E ir pro camarote 40.', vai:'c8_camarote', ef:{flag:'recusou_a_conversa'}},
    {texto:'"Sobre o quê?"', vai:'c8_sobre_o_que'},
    {texto:'Olhar o sapato dele.', vai:'c8_o_sapato'}
  ]
},

c8_o_sapato:{
  texto:[
    'Você olha pra baixo antes de responder qualquer coisa.',
    'Sapato social preto. Solado de couro. Limpo de um jeito que não existe num navio de porto.',
    d=>d.flags.sapato_limpo
      ? 'Você já ouviu sobre esse sapato duas vezes. De um caçador numa caverna e de um conferente num pátio.'
      : 'Você não sabe por que reparou nisso.',
    'Ele percebe que você olhou pro sapato dele e acha graça — graça de verdade, sem nenhuma ameaça.',
    '"Ninguém nunca olha pro sapato", ele diz. "Isso é muito bom."',
    'Ele estende a mão.',
    '"Dez minutos."'
  ],
  ef:{flag:['sapato_limpo','ele_reparou_que_voce_reparou'],
      presagio:'"Isso é muito bom." Você acabou de ser promovido de irrelevante a interessante, e as duas coisas eram mais seguras antes.'},
  escolhas:[
    {texto:'Apertar a mão. "Dez minutos."', vai:'c8_a_conversa'},
    {texto:'Não apertar. "Sobre o quê?"', vai:'c8_sobre_o_que'},
    {texto:'Não apertar e ir embora.', vai:'c8_camarote', ef:{flag:'recusou_a_conversa'}}
  ]
},

c8_sobre_o_que:{
  texto:[
    '"Sobre o quê?"',
    '"Sobre você."',
    'Ele responde na hora e sem nenhum jogo, o que é desarmante.',
    '"Eu trabalho numa fundação que cuida de bem-estar de espécimes. A gente acompanha treinadores promissores. Bolsa, equipamento, cobertura veterinária."',
    'Ele não entrega cartão. Ele não insiste.',
    '"Dez minutos numa mesa daquele canto, com o salão inteiro olhando. Não tem nada de sigiloso nisso."',
    'E ele está certo: não tem. É a coisa mais pública do mundo.',
    'É exatamente por isso que é assustador.'
  ],
  ef:{flag:'a_fundacao_se_apresentou',
      registrar:'Uma "fundação de bem-estar de espécimes" te abordou depois do torneio.',
      presagio:'Bem-estar de espécimes. Guarda a palavra espécime.'},
  escolhas:[
    {texto:'Aceitar os dez minutos.', vai:'c8_a_conversa'},
    {texto:'"Não, obrigado."', vai:'c8_recusa_venda'},
    {texto:'Olhar o sapato dele.', vai:'c8_o_sapato'},
    {texto:'"Que fundação?"', vai:'c8_que_fundacao'}
  ]
},

c8_que_fundacao:{
  texto:[
    '"Que fundação?"',
    'Ele diz o nome. É comprido, sério e completamente esquecível — três substantivos abstratos e uma preposição.',
    d=>d.flags.folheto_comissao
      ? 'Você já viu esse nome. Num folheto de papel bom, debaixo do balcão do museu de Pewter, com um brasão pequeno de balança no rodapé.'
      : 'Você nunca ouviu falar. Ninguém nunca ouviu falar.',
    'Ele repara na sua cara.',
    '"Você conhece."',
    'Não é pergunta.'
  ],
  ef:{flag:'nomeou_a_fundacao'},
  escolhas:[
    {texto:'"Não."', vai:'c8_a_conversa', ef:{flag:'mentiu_pra_fundacao'}},
    {texto:'"Conheço. Vocês tentaram levar um fóssil de Pewter."', vai:'c8_encarou_a_fundacao',
     cond:d=>!!d.flags.folheto_comissao || !!d.flags.ivone_foi_demitida},
    {texto:'"Conheço o desenho da balança."', vai:'c8_encarou_a_fundacao',
     cond:d=>!!d.flags.papel_com_brasao || !!d.flags.brasao_na_van},
    {texto:'Não responder e aceitar os dez minutos.', vai:'c8_a_conversa'}
  ]
},

c8_encarou_a_fundacao:{
  texto:[
    'Você fala.',
    'E ele escuta inteiro, sem interromper, com uma atenção genuína e sem nenhum sinal de desconforto, e quando você acaba ele faz que sim três vezes.',
    '"Tudo isso é verdade."',
    'Ele não nega uma vírgula.',
    '"O museu de Pewter tem um espécime fossilizado sob guarda de um município que não consegue manter o telhado. A gente ofereceu custódia técnica e a curadora se opôs, e ela tinha razão de se opor, e eu, pessoalmente, achei a oposição dela excelente."',
    'Ele bebe água, não álcool.',
    '"E a gente vai voltar a oferecer no ano que vem."',
    '"Por quê?"',
    '"Porque o telhado continua vazando."'
  ],
  ef:{flag:'a_fundacao_admitiu',
      registrar:'O homem de terno admitiu tudo sem piscar. Eles vão voltar ao museu de Pewter no ano que vem.',
      presagio:'Ele não negou nada. Não precisa. É essa a diferença entre isso e uma quadrilha.'},
  escolhas:[
    {texto:'Aceitar os dez minutos. Agora você quer ouvir.', vai:'c8_a_conversa'},
    {texto:'"Vocês são piores que ladrão."', vai:'c8_recusa_venda'},
    {texto:'"E o que vocês querem comigo?"', vai:'c8_a_conversa'},
    {texto:'Virar as costas.', vai:'c8_camarote', ef:{flag:'recusou_a_conversa'}}
  ]
},

c8_a_conversa:{
  texto:[
    'A mesa fica no canto do salão, com vista pro mar preto, e o salão inteiro consegue ver vocês dois — o que, você entende depois, é o ponto.',
    'Ele fala por nove minutos.',
    'Bolsa mensal. Equipamento. Cobertura veterinária pro time inteiro. Acesso a instalações de recuperação em quatro cidades. Nada de exclusividade, nada de contrato de imagem, nada de obrigação de resultado.',
    'É uma proposta boa. É uma proposta absurdamente boa e você fica com vergonha de quanto ela é boa.',
    '"E o que vocês ganham?"',
    '"Dado."',
    'Ele diz isso simplesmente.',
    '"A gente acompanha o desenvolvimento dos seus espécimes ao longo da jornada. Peso, nível, incidentes. Você preenche uma ficha por mês."',
    'Ele empurra um papel pela mesa. É uma ficha. Tem campos.',
    'E no rodapé tem um brasão pequeno com uma balança.'
  ],
  ef:{flag:'ouviu_a_proposta', registrar:'A fundação ofereceu bolsa e cobertura em troca de uma ficha mensal dos seus Pokémon.'},
  escolhas:[
    {texto:'Assinar.', vai:'c8_assinou'},
    {texto:'"Não."', vai:'c8_recusa_venda'},
    {texto:'"Posso levar a ficha e pensar?"', vai:'c8_levou_a_ficha'},
    {texto:'"O que acontece com o dado depois?"', vai:'c8_o_que_acontece_com_o_dado'}
  ]
},

c8_o_que_acontece_com_o_dado:{
  texto:[
    '"O que acontece com o dado depois?"',
    'Ele sorri, e é a primeira vez que o sorriso chega nos olhos.',
    '"Essa é a pergunta certa e quase ninguém faz."',
    'Ele apoia os cotovelos na mesa.',
    '"O dado vira parâmetro. Parâmetro vira média. Média vira referência."',
    '"E referência vira o quê?"',
    '"Referência vira o que se considera cuidado adequado."',
    'Uma pausa exatamente do tamanho certo.',
    '"E quem está abaixo da referência está, por definição, abaixo do adequado."'
  ],
  ef:{flag:'entendeu_a_referencia',
      registrar:'O dado vira parâmetro, o parâmetro vira média, a média vira o que se considera cuidado adequado.',
      presagio:'Quem está abaixo da referência está abaixo do adequado. Você acabou de ouvir como se constrói um critério para tirar bichos de gente pobre.'},
  escolhas:[
    {texto:'"Vocês estão construindo uma régua."', vai:'c8_a_regua'},
    {texto:'Assinar mesmo assim.', vai:'c8_assinou'},
    {texto:'"Não."', vai:'c8_recusa_venda'},
    {texto:'"Posso levar a ficha e pensar?"', vai:'c8_levou_a_ficha'}
  ]
},

c8_a_regua:{
  texto:[
    '"Vocês estão construindo uma régua."',
    'Ele para.',
    'Depois recosta na cadeira e olha pra você de um jeito completamente novo, e você entende que acabou de fazer a pior coisa possível: você foi interessante.',
    '"Estamos."',
    'Ele não disfarça nem por um segundo.',
    '"E antes que você ache que isso é confissão: está no estatuto, é público, tem número de registro e sai no diário oficial. Art. 4º."',
    'Ele guarda a ficha na pasta.',
    '"O problema não é a régua, garoto. Régua é boa. Sem régua, qualquer um pode fazer qualquer coisa com um bicho e ninguém pode dizer nada."',
    'Ele fecha a pasta.',
    '"O problema é que alguém tem que segurar a régua. E ninguém nunca discute isso na hora de fazer a régua. Só depois."'
  ],
  ef:{flag:['a_regua','leu_o_estatuto_de_ouvido'],
      rep:{eixo:'bom',delta:1,motivo:'Nomeou em voz alta o que estava sendo construído'},
      registrar:'"O problema não é a régua. É quem segura a régua."',
      presagio:'Ele te explicou o plano inteiro numa mesa de salão porque não tem por que esconder. Isso devia te assustar mais do que assusta.'},
  escolhas:[
    {texto:'"E quem segura?"', vai:'c8_quem_segura'},
    {texto:'Assinar.', vai:'c8_assinou'},
    {texto:'"Não."', vai:'c8_recusa_venda'},
    {texto:'"Posso levar a ficha?"', vai:'c8_levou_a_ficha'}
  ]
},

c8_quem_segura:{
  texto:[
    '"E quem segura?"',
    '"Onze pessoas."',
    'Ele responde na hora.',
    '"Um conselho de onze. Sete técnicos, dois juristas, um representante de federação esportiva e uma presidência."',
    '"E quem elegeu?"',
    'E aí, pela primeira vez na conversa inteira, ele demora.',
    '"Ninguém."',
    'Ele bebe água.',
    '"Foi constituída. É diferente de eleita. Eu sei que é diferente. Eu penso nisso."'
  ],
  ef:{flag:['o_conselho_de_onze','sabe_da_comissao'],
      registrar:'A Comissão é um conselho de onze pessoas. Constituída, não eleita.',
      presagio:'Onze. Constituída, não eleita. Ele pensa nisso, e continua indo trabalhar.'},
  escolhas:[
    {texto:'"E o senhor continua trabalhando lá."', vai:'c8_continua_trabalhando'},
    {texto:'Assinar.', vai:'c8_assinou'},
    {texto:'"Não."', vai:'c8_recusa_venda'},
    {texto:'"Posso levar a ficha?"', vai:'c8_levou_a_ficha'}
  ]
},

c8_continua_trabalhando:{
  texto:[
    '"E o senhor continua trabalhando lá."',
    '"Continuo."',
    'Ele guarda a caneta no bolso interno do paletó.',
    '"Eu tenho quarenta e sete anos, dois filhos e uma especialização que só serve pra isso."',
    'Ele levanta e ajeita o paletó.',
    '"E, olha: eu acho que a gente faz mais bem que mal. Eu acho isso na maior parte dos dias."',
    'Ele estende a mão.',
    '"Nos outros dias eu não acho. Mas nesses dias eu também vou trabalhar."'
  ],
  ef:{flag:'a_maior_parte_dos_dias',
      npc:{nome:'Curador Ren', opiniao:2, memoria:'Conversou com você por dez minutos num salão de navio e admitiu que em alguns dias não acha que faz mais bem que mal.'},
      presagio:'Nos outros dias ele também vai trabalhar. É isso que faz a máquina girar, e não é maldade.'},
  escolhas:[
    {texto:'Apertar a mão.', vai:'c8_levou_a_ficha'},
    {texto:'Não apertar.', vai:'c8_recusa_venda'},
    {texto:'Assinar.', vai:'c8_assinou'},
    {texto:'"Como é o seu nome?"', vai:'c8_o_nome_dele'}
  ]
},

c8_o_nome_dele:{
  texto:[
    '"Como é o seu nome?"',
    'Ele para de ajeitar o paletó.',
    '"Ren."',
    '"Ren de quê?"',
    'Uma pausa mínima.',
    '"Ren é suficiente." Ele sorri. "Curador Ren, se você for escrever."',
    '"Curador de quê?"',
    '"De acervo."',
    'Ele vai embora pelo salão e a multidão abre e fecha atrás dele sem ninguém reparar.',
    'Acervo. Você fica sentado naquela mesa com vinte mil pokedólares no bolso pensando na palavra acervo.'
  ],
  ef:{flag:['sabe_do_adnan','sabe_da_comissao'],
      registrar:'Curador Ren, de acervo.',
      npc:{nome:'Curador Ren', opiniao:1, memoria:'Você perguntou o nome dele. Ele deu o primeiro e o cargo.'},
      presagio:'Curador de acervo. Acervo é onde as coisas ficam quando param de ser de alguém.'},
  escolhas:[
    {texto:'Ir pro camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'},
    {texto:'Ficar sentado um tempo.', vai:'c8_levou_a_ficha'}
  ]
},

c8_assinou:{
  texto:[
    'Você assina.',
    'Leva quatro segundos e é a coisa mais fácil que você fez em Kanto.',
    'Ele guarda a via dele na pasta, te entrega a sua dobrada em três, e aperta a sua mão com as duas mãos.',
    'A primeira bolsa cai na sua conta em nove dias. É mais dinheiro do que a sua mãe ganha por mês.',
    'A primeira ficha você preenche em Celadon, sentado num banco de praça, e demora quarenta minutos porque você tenta ser honesto.',
    'A segunda você preenche em vinte.',
    'A sexta você preenche em quatro.'
  ],
  ef:{flag:['assinou_com_a_comissao','sabe_da_comissao'],
      dinheiro:5000,
      rep:{eixo:'ruim',delta:2,motivo:'Assinou um acompanhamento de espécimes sem ler o estatuto'},
      npc:{nome:'Curador Ren', opiniao:5, memoria:'Você assinou o termo de acompanhamento numa mesa do S.S. Anne.'},
      registrar:'Assinou o termo de acompanhamento da Comissão.',
      presagio:'A sexta você preenche em quatro minutos. Repara em quando parar de doer.'},
  escolhas:[
    {texto:'Ir pro camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'},
    {texto:'Voltar e rasgar a via.', vai:'c8_rasgou'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'}
  ]
},

c8_levou_a_ficha:{
  texto:[
    '"Posso levar a ficha e pensar?"',
    '"Pode." Ele empurra. "Leva duas, aliás. Uma pra você e uma pra dar pra alguém que você ache que devia ter."',
    'Ele guarda a pasta e levanta.',
    '"Eu não vou te procurar. A gente não procura. Se você quiser, o endereço está no rodapé."',
    'Ele vai embora.',
    'Você fica com duas fichas em branco na mão, com brasão de balança no rodapé e um endereço em Saffron: sétimo andar, sala 704.'
  ],
  ef:{flag:['tem_a_ficha','sabe_da_sala704','sabe_da_comissao'],
      registrar:'Ficou com duas fichas em branco da Comissão. Endereço no rodapé: Saffron, sala 704.',
      rep:{eixo:'bom',delta:1,motivo:'Pegou o papel sem assinar'},
      presagio:'Sala 704. Agora você tem o endereço e não precisou roubar de ninguém.'},
  escolhas:[
    {texto:'Ir pro camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'},
    {texto:'"Como é o seu nome?"', vai:'c8_o_nome_dele'}
  ]
},

c8_recusa_venda:{
  texto:[
    '"Não."',
    'Ele aceita na hora. Sem insistência, sem segunda tentativa, sem cara feia.',
    '"Certo."',
    'Ele guarda a ficha na pasta e levanta e ajeita o paletó.',
    '"Obrigado pelos dez minutos."',
    'E aí ele diz a coisa que vai te acompanhar:',
    '"A gente não precisa de você, sabe? Isso não é ameaça, é o contrário. É pra você ficar tranquilo."',
    'Ele sorri.',
    '"A gente tem quatro mil e duzentas fichas."'
  ],
  ef:{flag:['recusou_a_comissao','sabe_da_comissao'],
      rep:{eixo:'bom',delta:2,motivo:'Recusou a bolsa e a ficha'},
      npc:{nome:'Curador Ren', opiniao:1, memoria:'Você recusou a proposta dele no S.S. Anne. Ele não insistiu.'},
      registrar:'A Comissão tem quatro mil e duzentas fichas.',
      presagio:'Quatro mil e duzentas. Você recusar não muda nada, e é exatamente por isso que ele te contou.'},
  escolhas:[
    {texto:'"Quatro mil e duzentas de quê?"', vai:'c8_quatro_mil'},
    {texto:'Ir pro camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'}
  ]
},

c8_quatro_mil:{
  texto:[
    '"Quatro mil e duzentas de quê?"',
    '"De treinadores acompanhados."',
    'Ele responde de pé, já indo.',
    '"Em Kanto tem por volta de nove mil treinadores licenciados ativos."',
    'Ele faz a conta na sua frente com uma delicadeza brutal.',
    '"Quase metade, garoto. Quase metade preenche a ficha todo mês, por vontade própria, porque a bolsa é boa e a cobertura veterinária é real."',
    'Ele vai.',
    '"E a média deles é o que vai virar a referência."'
  ],
  ef:{flag:'quatro_mil_e_duzentas',
      registrar:'4.200 treinadores de 9.000 já preenchem a ficha da Comissão.',
      presagio:'Quase metade. A régua já está quase pronta e ninguém precisou de violência nenhuma.'},
  escolhas:[
    {texto:'Ir pro camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'},
    {texto:'Sentar e ficar um tempo sem fazer nada.', vai:'c8_mais_salao'}
  ]
},

c8_rasgou:{
  texto:[
    'Você acha ele no corredor do convés dois e rasga a sua via na frente dele, em quatro, e deixa cair no chão carpetado.',
    'Ele olha os pedaços.',
    '"A sua via era a cópia."',
    'Ele fala com uma gentileza sincera, sem nenhum triunfo.',
    '"O original está na pasta. Assinado, com data, testemunhado pelo garçom da mesa três."',
    'Ele se abaixa e junta os quatro pedaços do chão, porque ele é o tipo de pessoa que não deixa papel no chão.',
    '"Se você quiser rescindir, é por escrito, com trinta dias. Está na cláusula seis."',
    'Ele te devolve os pedaços na sua mão.'
  ],
  ef:{flag:'rasgou_a_via', rep:{eixo:'bom',delta:1,motivo:'Tentou desfazer na mesma noite'},
      presagio:'Trinta dias, por escrito. Anota o prazo e escreve a carta.'},
  escolhas:[
    {texto:'"Então eu escrevo hoje."', vai:'c8_escreveu_rescisao',
     ef:{flag:'rescindiu', limpaFlag:'assinou_com_a_comissao', rep:{eixo:'bom',delta:2,motivo:'Rescindiu por escrito na mesma noite'}}},
    {texto:'Ficar com os pedaços e não fazer nada.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'}
  ]
},

c8_escreveu_rescisao:{
  texto:[
    'Você escreve à mão, num papel de carta do camarote de outra pessoa, às duas da manhã, com uma caneta emprestada da recepção.',
    'Sete linhas. Você refaz três vezes porque erra o nome comprido da fundação.',
    'De manhã você entrega na mão dele no café.',
    'Ele lê, faz que sim, tira uma caneta do bolso e escreve "RECEBIDO" com a data e a hora e assina embaixo, e devolve pra você ficar com o comprovante.',
    '"Guarda", ele diz. "Sempre guarda o recebido."',
    'E é, provavelmente, o melhor conselho jurídico que alguém já te deu.'
  ],
  ef:{flag:['rescindiu','sempre_guarda_o_recebido'],
      rep:{eixo:'bom',delta:1,motivo:'Aprendeu a guardar o comprovante'},
      registrar:'Rescindiu o termo. Ele assinou o recebido e mandou guardar.',
      presagio:'"Sempre guarda o recebido." Ele te ensinou a se defender dele mesmo, e não achou isso estranho.'},
  escolhas:[
    {texto:'Ir pro camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'}
  ]
},

c8_perdeu_torneio:{
  texto:[
    'Você perde na segunda luta.',
    'Não é humilhante e não é bonito: é uma derrota normal, de alguém que treinou menos que a outra pessoa.',
    'O locutor fala o nome do adversário e o salão bate palma e volta a conversar, e você desce do emborrachado e ninguém olha.',
    'Nos vestiários improvisados — que são um corredor de serviço com duas cadeiras —, um dos participantes que perdeu antes de você está sentado com a cabeça entre as mãos.',
    'Ele tem uns catorze anos.'
  ],
  ef:{flag:'perdeu_torneio_navio', hp:-2, causa:'Torneio do S.S. Anne'},
  escolhas:[
    {texto:'Sentar do lado dele.', vai:'c8_o_de_catorze'},
    {texto:'Passar direto.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'}
  ]
},

c8_o_de_catorze:{
  texto:[
    'Você senta na outra cadeira e não fala nada por um tempo.',
    '"Eu vim de Fuchsia", ele diz sem levantar a cabeça. "Meu tio pagou a passagem."',
    '"Foi mal."',
    '"Não é isso." Ele levanta a cabeça e está com os olhos vermelhos e com raiva de estar. "Eu tinha que ganhar. Eu tinha que ganhar porque o prêmio é vinte mil e a cirurgia do meu Rapidash é dezoito."',
    'Ele passa a mão na cara.',
    '"E eu treinei. Eu treinei seis meses."',
    d=>d.flags.venceu_torneio_navio ? 'Você tem vinte mil pokedólares num envelope no bolso interno da sua mochila.' : 'Você não tem vinte mil pokedólares.'
  ],
  ef:{flag:'o_garoto_de_fuchsia',
      npc:{nome:'Garoto de Fuchsia', opiniao:1, memoria:'Perdeu o torneio do Anne. Precisava de dezoito mil para a cirurgia do Rapidash dele.'},
      presagio:'Dezoito mil. Você vai lembrar desse número.'},
  escolhas:[
    {texto:'Dar os vinte mil pra ele. (20.000 ₽)', vai:'c8_deu_o_premio', cond:d=>d.jogador.dinheiro>=20000},
    {texto:'Dar o que você puder. (5.000 ₽)', vai:'c8_deu_um_pouco', cond:d=>d.jogador.dinheiro>=5000,
     ef:{dinheiro:-5000, rep:{eixo:'bom',delta:2,motivo:'Deu o que dava a um desconhecido de catorze anos'}}},
    {texto:'Ficar sentado com ele sem dizer nada.', vai:'c8_ficou_sentado'},
    {texto:'"Foi mal." E ir embora.', vai:'c8_camarote'}
  ]
},

c8_deu_o_premio:{
  texto:[
    'Você tira o envelope da mochila e põe no colo dele.',
    'Ele não entende. Leva uns bons cinco segundos pra ele entender, e quando entende ele empurra de volta com as duas mãos, com força.',
    '"NÃO."',
    '"É seu."',
    '"NÃO É MEU, EU PERDI."',
    'E aí vocês dois têm uma discussão absurda num corredor de serviço de navio, com um envelope de vinte mil pokedólares indo e voltando entre duas cadeiras de plástico, até você simplesmente levantar e ir embora deixando o envelope na cadeira.',
    'Ele grita o seu nome no corredor. Você não volta.'
  ],
  ef:{dinheiro:-20000, rep:{eixo:'bom',delta:5,motivo:'Deu o prêmio inteiro do torneio a um garoto de catorze anos'},
      flag:'deu_o_premio', moral:15,
      npc:{nome:'Garoto de Fuchsia', opiniao:10, memoria:'Você deixou vinte mil pokedólares numa cadeira de plástico e foi embora enquanto ele gritava o seu nome.'},
      registrar:'Deu o prêmio do torneio para o garoto de Fuchsia.',
      presagio:'O Rapidash dele vai viver mais nove anos e você nunca vai ver isso.'},
  escolhas:[
    {texto:'Ir pro camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'}
  ]
},

c8_deu_um_pouco:{
  texto:[
    'Você dá o que dá. Não é dezoito mil e não resolve.',
    'Ele conta, e você vê ele fazendo a conta na cabeça de quanto ainda falta, e vê o rosto dele quando a conta não fecha.',
    'E aí ele faz uma coisa que te desmonta: ele agradece de verdade, com as duas mãos na sua, e diz que agora falta menos.',
    '"Agora falta menos", ele repete, pra ele mesmo, umas três vezes.',
    'Isso é o que gente faz com a esperança que sobra.'
  ],
  ef:{flag:'agora_falta_menos', moral:8,
      npc:{nome:'Garoto de Fuchsia', opiniao:6, memoria:'Você deu cinco mil dos dezoito que ele precisava. Ele ficou repetindo que agora faltava menos.'},
      presagio:'"Agora falta menos." Não fecha a conta. Muda o dia dele.'},
  escolhas:[
    {texto:'Ficar sentado com ele.', vai:'c8_ficou_sentado'},
    {texto:'Ir pro camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'}
  ]
},

c8_ficou_sentado:{
  texto:[
    'Você fica. Duas cadeiras de plástico num corredor de serviço, com barulho de cozinha vindo de uma porta e música de piano vindo da outra.',
    'Vinte e cinco minutos sem falar quase nada.',
    'Em algum momento ele solta o Rapidash — que não devia estar solto num corredor de navio — e o bicho enche o corredor inteiro e não cabe, e tem uma cicatriz cirúrgica antiga numa das patas dianteiras.',
    'O garoto encosta a testa no pescoço dele.',
    '"Ele tem onze anos", ele diz. "Ele era do meu pai."',
    'E é só isso. Não tem mais história.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Ficou vinte e cinco minutos num corredor com um desconhecido'},
      flag:'ficou_com_o_de_catorze', moral:8,
      npc:{nome:'Garoto de Fuchsia', opiniao:5, memoria:'Vocês ficaram vinte e cinco minutos calados num corredor de serviço.'},
      presagio:'"Ele era do meu pai." Você vai encontrar esse Rapidash de novo, ou não. As duas coisas doem.'},
  escolhas:[
    {texto:'Ir pro camarote 40.', vai:'c8_camarote'},
    {texto:'Descer ao porão.', vai:'c8_porao'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'},
    {texto:'Dar o que você puder. (5.000 ₽)', vai:'c8_deu_um_pouco', cond:d=>d.jogador.dinheiro>=5000,
     ef:{dinheiro:-5000, rep:{eixo:'bom',delta:2,motivo:'Deu o que dava'}}}
  ]
},

/* ─────────────── PORÃO ─────────────── */

c8_porao:{
  texto:[
    'O porão de carga do S.S. Anne é um corredor de aço de sessenta metros com caixa empilhada dos dois lados até o teto.',
    'É quente. Muito mais quente do que devia ser, porque a casa de máquinas é do outro lado da antepara.',
    'A luz é de emergência: amarela, a cada oito metros.',
    d=>d.flags.uniforme_tripulacao ? 'De uniforme, você é só mais alguém conferindo carga. Ninguém pergunta nada.' : 'Se alguém te ver aqui, não tem explicação que funcione.',
    'No fundo do corredor, as três caixas.',
    'Furo de ventilação. Doze furos em cada uma, feitos com broca, em fileira, na altura certa pra uma coisa do tamanho de um Growlithe respirar.'
  ],
  ef:{registrar:'Desceu ao porão do S.S. Anne.'},
  escolhas:[
    {texto:'Abrir uma.', vai:'c8_abriu_caixa'},
    {texto:'Encostar o ouvido na caixa primeiro.', vai:'c8_escutou_caixa'},
    {texto:'Ler as etiquetas antes de tocar em qualquer coisa.', vai:'c8_etiquetas'},
    {texto:'Fotografar e sair.', vai:'c8_fotografou', cond:d=>Estado.contaItem('Câmera descartável')>0}
  ]
},

c8_escutou_caixa:{
  texto:[
    'Você encosta o ouvido no papelão reforçado.',
    'Primeiro não tem nada.',
    'Depois tem: uma respiração. Curta, rápida, e um som de unha em papelão, baixo, três vezes e para.',
    'Você fica com o rosto encostado numa caixa no porão de um navio por quase um minuto, ouvindo uma coisa viva respirar do outro lado de dois centímetros de papelão.',
    'Na terceira caixa não tem som nenhum.',
    'Você fica mais tempo nessa.'
  ],
  ef:{flag:'escutou_as_caixas',
      presagio:'Na terceira não tem som. Você vai abrir a terceira e vai ter que ver.'},
  escolhas:[
    {texto:'Abrir a terceira.', vai:'c8_abriu_caixa'},
    {texto:'Abrir a primeira.', vai:'c8_abriu_caixa'},
    {texto:'Ler as etiquetas.', vai:'c8_etiquetas'},
    {texto:'Ir buscar o capitão agora.', vai:'c8_capitao'}
  ]
},

c8_etiquetas:{
  texto:[
    'As etiquetas são adesivas, impressas, com código de barras.',
    'REMETENTE: um CNPJ.',
    'DESTINATÁRIO: um CNPJ.',
    'CONTEÚDO DECLARADO: "MATERIAL BIOLÓGICO — TRANSPORTE AUTORIZADO".',
    'Material biológico. Transporte autorizado.',
    'E no canto inferior direito, impresso junto com o resto, pequeno e limpo: um brasão com uma balança, e embaixo, em corpo seis, uma inscrição que você lê três vezes pra ter certeza:',
    '"GUIA DE REMESSA Nº 1.192 — ART. 11 DO ESTATUTO".'
  ],
  ef:{flag:['papel_com_brasao','etiqueta_1192'],
      registrar:'As caixas do porão têm guia de remessa nº 1.192, Art. 11 do Estatuto, conteúdo "material biológico".',
      presagio:'Mil cento e noventa e dois. Oito a mais do que a pasta da caverna. Em quanto tempo?'},
  escolhas:[
    {texto:'Abrir uma.', vai:'c8_abriu_caixa'},
    {texto:'Arrancar uma etiqueta inteira.', vai:'c8_arrancou_etiqueta',
     ef:{flag:'tem_a_etiqueta', rep:{eixo:'bom',delta:1,motivo:'Guardou uma etiqueta com número de guia'}}},
    {texto:'Fotografar.', vai:'c8_fotografou', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Ir buscar o capitão.', vai:'c8_capitao'}
  ]
},

c8_arrancou_etiqueta:{
  texto:[
    'Você descola a etiqueta com a unha. Ela sai inteira, o que é sorte, e o adesivo continua pegajoso, então você cola na última página do seu caderno.',
    'Agora tem, no seu caderno, um código de barras, dois CNPJs, um número de guia e um brasão.',
    'E uma caixa no porão de um navio sem etiqueta nenhuma, o que alguém vai notar.'
  ],
  ef:{presagio:'Uma caixa sem etiqueta. Alguém vai conferir e vai faltar uma etiqueta.'},
  escolhas:[
    {texto:'Abrir a caixa que ficou sem etiqueta.', vai:'c8_abriu_caixa'},
    {texto:'Ir buscar o capitão.', vai:'c8_capitao'},
    {texto:'Subir e não fazer mais nada hoje.', vai:'c8_bordo'},
    {texto:'Fotografar o resto.', vai:'c8_fotografou', cond:d=>Estado.contaItem('Câmera descartável')>0}
  ]
},

c8_fotografou:{
  texto:[
    'Você usa a câmera descartável. É barulhenta — o rebobinar é alto demais pra um porão de navio — e você tira sete fotos em quarenta segundos e para porque o coração está batendo na orelha.',
    'Etiqueta de perto. Furo de ventilação. Empilhamento. O corredor inteiro com as três caixas no fundo.',
    'Revelar vai custar mais que a câmera e vai levar cinco dias e vai ter um funcionário de laboratório fotográfico em Celadon olhando essas imagens antes de você.',
    'Você pensa nisso e tira mais três fotos assim mesmo.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Câmera descartável'); return []; },
      flag:['fotografou_o_porao','papel_com_brasao'],
      rep:{eixo:'bom',delta:2,motivo:'Documentou em vez de só ver'},
      registrar:'Fotografou as caixas com furo de ventilação no porão do S.S. Anne.',
      presagio:'Um funcionário de laboratório fotográfico em Celadon vai ver essas imagens antes de você.'},
  escolhas:[
    {texto:'Abrir uma caixa.', vai:'c8_abriu_caixa'},
    {texto:'Ir buscar o capitão.', vai:'c8_capitao'},
    {texto:'Subir e guardar o filme.', vai:'c8_bordo'},
    {texto:'Ler as etiquetas com atenção.', vai:'c8_etiquetas'}
  ]
},

c8_abriu_caixa:{
  texto:[
    'Você abre.',
    'A fita é de embalagem industrial e não sai com a mão; sai com a chave da sua mochila, rasgando o papelão junto.',
    'Dentro tem palha, um recipiente de água preso com abraçadeira, e um Growlithe.',
    'Ele não se mexe quando a luz entra. Fica encolhido no canto, com o focinho enfiado na palha, e só os olhos acompanham você.',
    'Tem uma etiqueta amarrada no pescoço dele com barbante e um número escrito a caneta.',
    'Nas outras duas: um Sandshrew, que sibila e recua, e — na terceira, a silenciosa — um Growlithe menor que não recua nem sibila nem se mexe.',
    'Esse você não vai conseguir esquecer.'
  ],
  ef:{flag:'abriu_as_caixas_do_navio',
      registrar:'Nas caixas do porão: dois Growlithe e um Sandshrew, etiquetados e sedados.',
      presagio:'O da terceira caixa não recuou. Isso tem nome e o nome é dose.'},
  escolhas:[
    {texto:'Tirar os três e soltar no convés.', vai:'c8_soltou_caixas'},
    {texto:'Tirar só o da terceira caixa e correr pra enfermaria.', vai:'c8_enfermaria',
     ef:{flag:'levou_o_da_terceira'}},
    {texto:'Fechar tudo e ir buscar o capitão.', vai:'c8_capitao', ef:{flag:'fechou_e_foi_buscar'}},
    {texto:'Fotografar antes de qualquer coisa.', vai:'c8_fotografou', cond:d=>Estado.contaItem('Câmera descartável')>0}
  ]
},

c8_soltou_caixas:{
  texto:[
    'Você tira os três e sobe pelo corredor de serviço carregando um por vez, três viagens, com o coração na garganta.',
    'No convés de popa, de madrugada, com vento de mar, você abre e deixa sair.',
    'O Sandshrew corre pro canto e fica atrás de um rolo de cabo e não sai mais.',
    'O Growlithe maior anda em círculo pelo convés inteiro, cheirando tudo, e depois senta na porta que dá pro salão e fica olhando a porta.',
    'O menor não levanta.',
    'Você fica sentado no convés com ele até clarear, e às cinco e vinte da manhã um marinheiro do turno te encontra assim e não chama ninguém.',
    'Ele só pergunta: "Quantos eram?"'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Tirou três Pokémon de dentro de caixas lacradas num porão'},
      hp:-3, causa:'Noite em claro no convés do S.S. Anne',
      flag:'soltou_do_porao',
      registrar:'Soltou os três do porão no convés de popa do S.S. Anne.',
      presagio:'"Quantos eram?" Ele perguntou quantos. Ele já sabia que eram alguns.'},
  escolhas:[
    {texto:'"Três." E contar tudo pra ele.', vai:'c8_o_marinheiro'},
    {texto:'"Três." E mais nada.', vai:'c8_fim_navio'},
    {texto:'Levar o menor pra enfermaria.', vai:'c8_enfermaria'},
    {texto:'Ir procurar o capitão agora.', vai:'c8_capitao'}
  ]
},

c8_o_marinheiro:{
  texto:[
    'Você conta tudo. As caixas, os furos, a etiqueta, o número da guia.',
    'Ele escuta agachado ao lado do Growlithe menor, com a mão nas costas dele.',
    '"Eu trabalho nesse navio faz nove anos", ele diz. "Eu carreguei caixa com furo nove vezes. Uma por ano."',
    'Ele levanta.',
    '"E eu nunca abri nenhuma, porque abrir lacre é crime e eu tenho filho."',
    'Ele olha os três Pokémon soltos no convés.',
    '"Você não tem filho."',
    'E aí ele faz a coisa que você não esperava: ele tira o rádio do cinto, desliga, e põe no bolso.',
    '"Eu não te vi. Leva eles pra enfermaria do convés dois e fala que achou no convés. A enfermeira é gente boa e ela não pergunta."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Contou a verdade para alguém que podia te entregar'},
      flag:'o_marinheiro_ajudou',
      npc:{nome:'Marinheiro do turno', opiniao:6, memoria:'Desligou o rádio e mandou você levar os três pra enfermaria.'},
      registrar:'Um marinheiro do S.S. Anne desligou o rádio em vez de te entregar.',
      presagio:'Nove anos, nove caixas, nenhuma aberta. E ele desligou o rádio.'},
  escolhas:[
    {texto:'Levar os três pra enfermaria.', vai:'c8_enfermaria'},
    {texto:'"Vem comigo falar com o capitão."', vai:'c8_capitao'},
    {texto:'"Por que você nunca abriu?"', vai:'c8_porque_nunca_abriu_nav'}
  ]
},

c8_porque_nunca_abriu_nav:{
  texto:[
    '"Por que você nunca abriu?"',
    'Ele demora.',
    '"Porque na primeira vez eu perguntei pro contramestre o que tinha na caixa."',
    'Ele olha o mar.',
    '"E no dia seguinte o meu nome tava na escala do turno da madrugada, que é o turno que ninguém quer, e ficou lá por sete meses."',
    'Ele encolhe os ombros.',
    '"Ninguém me ameaçou. Ninguém me chamou numa sala. Só mudou a escala."',
    'Ele bate no bolso onde está o rádio desligado.',
    '"É assim que funciona, garoto. Não é filme."'
  ],
  ef:{flag:'so_mudou_a_escala',
      presagio:'Ninguém ameaça ninguém. Só muda a escala. Isso é muito mais eficiente e não deixa rastro.'},
  escolhas:[
    {texto:'Levar os três pra enfermaria.', vai:'c8_enfermaria'},
    {texto:'Ir procurar o capitão.', vai:'c8_capitao'},
    {texto:'Ficar no convés até o navio atracar.', vai:'c8_fim_navio'}
  ]
},

/* ─────────────── ENFERMARIA ─────────────── */

c8_enfermaria:{
  texto:[
    'A enfermaria do convés dois tem duas macas, um armário trancado e uma enfermeira de uns sessenta anos que está acordada às quatro da manhã porque sempre está.',
    'Ela olha o que você trouxe e não faz uma única pergunta.',
    'Trabalha por quarenta minutos em silêncio.',
    d=>d.flags.levou_o_da_terceira || d.flags.soltou_do_porao
      ? '"Sedativo veterinário", ela diz por fim, sem levantar a cabeça. "Dose de contenção prolongada. Não é ilegal. É o que se usa em transporte de longa distância autorizado."' : '',
    d=>d.flags.o_garoto_da_enfermaria
      ? 'Na segunda maca tem um garoto de dezesseis anos dormindo, com soro no braço. É o que faltou no torneio.' : '',
    'Ela lava as mãos.',
    '"Eu vou registrar como achado no convés."',
    '"Isso é mentira."',
    '"É." Ela seca as mãos. "É a mentira que não faz eles sumirem de novo."'
  ],
  ef:{flag:'passou_pela_enfermaria',
      npc:{nome:'Enfermeira do Anne', opiniao:4, memoria:'Atendeu o que você tirou do porão e registrou como achado no convés.'},
      rep:{eixo:'bom',delta:2,motivo:'Levou quem precisava a quem sabia'},
      registrar:'A enfermeira do S.S. Anne registrou os do porão como "achados no convés".'},
  escolhas:[
    {texto:'Perguntar do garoto da outra maca.', vai:'c8_o_garoto_da_maca', cond:d=>!!d.flags.o_garoto_da_enfermaria},
    {texto:'"Quantas vezes a senhora já fez isso?"', vai:'c8_quantas_vezes'},
    {texto:'Ficar até clarear.', vai:'c8_fim_navio'},
    {texto:'Ir procurar o capitão.', vai:'c8_capitao'}
  ]
},

c8_o_garoto_da_maca:{
  texto:[
    '"O que aconteceu com ele?"',
    'A enfermeira olha a segunda maca.',
    '"Três lutas em duas horas."',
    'Ela ajusta o soro.',
    '"Ele não comeu desde ontem de manhã porque comida a bordo é paga e ele entrou por vaga de trabalho."',
    'Ela cruza os braços.',
    '"Ele desmaiou na terceira e o locutor anunciou que ele desistiu por indisposição, e o torneio continuou, e o salão bateu palma."',
    'Ela olha pra você.',
    '"Ele tem dezesseis anos e ele ia ganhar."'
  ],
  ef:{flag:'o_garoto_ia_ganhar',
      registrar:'O garoto que faltou no torneio desmaiou de fome depois de três lutas. Ele ia ganhar.',
      presagio:'Ele ia ganhar. E o prêmio era vinte mil. Faz a conta do que isso significava pra ele.'},
  escolhas:[
    {texto:'Deixar dinheiro com a enfermeira pra ele. (5.000 ₽)', vai:'c8_deixou_pro_garoto',
     cond:d=>d.jogador.dinheiro>=5000,
     ef:{dinheiro:-5000, rep:{eixo:'bom',delta:3,motivo:'Deixou dinheiro para um garoto que não ia saber de quem foi'},
         flag:'deixou_pro_garoto'}},
    {texto:'"Quantas vezes a senhora já fez isso?"', vai:'c8_quantas_vezes'},
    {texto:'Ficar até ele acordar.', vai:'c8_esperou_acordar'},
    {texto:'Ir procurar o capitão.', vai:'c8_capitao'}
  ]
},

c8_deixou_pro_garoto:{
  texto:[
    'Você põe o dinheiro na mão dela.',
    '"Não fala que fui eu."',
    'Ela não discute e não agradece. Guarda no bolso do jaleco.',
    '"Ele vai perguntar."',
    '"Fala que foi da administração."',
    'Ela ri uma risada curta e feia.',
    '"Ele não ia acreditar."',
    'Ela pensa um pouco.',
    '"Eu falo que foi do prêmio de participação. Isso existe e é duzentos, e ele nunca leu o regulamento."'
  ],
  ef:{presagio:'Ele vai achar que foi prêmio de participação. É melhor assim, e você sabe, e mesmo assim incomoda um pouco.'},
  escolhas:[
    {texto:'"Quantas vezes a senhora já fez isso?"', vai:'c8_quantas_vezes'},
    {texto:'Ficar até clarear.', vai:'c8_fim_navio'},
    {texto:'Ir procurar o capitão.', vai:'c8_capitao'}
  ]
},

c8_esperou_acordar:{
  texto:[
    'Você fica na cadeira de plástico da enfermaria até as sete e quarenta, quando ele acorda.',
    'Ele leva um susto de ver alguém.',
    '"Eu desmaiei?"',
    '"Desmaiou."',
    'Ele fecha os olhos.',
    '"Que vergonha."',
    'E é isso que ele diz. Não "que fome", não "que injustiça", não "eu ia ganhar". Que vergonha.',
    'Vocês conversam por uns vinte minutos. Ele se chama Seiji, é de Saffron, e ele não vai voltar pra casa porque em casa ele teria que explicar.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Esperou um desconhecido acordar'},
      flag:'conhece_o_wilton',
      npc:{nome:'Seiji', opiniao:5, memoria:'Desmaiou no torneio do Anne. Você esperou ele acordar. Ele é de Saffron e não vai voltar pra casa.'},
      registrar:'Seiji, 16 anos, de Saffron. Não vai voltar pra casa porque teria que explicar.',
      presagio:'Ele não vai voltar pra casa porque teria que explicar. Kanto está cheia de gente que não volta por isso.'},
  escolhas:[
    {texto:'Deixar dinheiro com a enfermeira pra ele. (5.000 ₽)', vai:'c8_deixou_pro_garoto',
     cond:d=>d.jogador.dinheiro>=5000,
     ef:{dinheiro:-5000, rep:{eixo:'bom',delta:3,motivo:'Deixou dinheiro sem se identificar'}, flag:'deixou_pro_garoto'}},
    {texto:'"Vem comigo até Cinnabar."', vai:'c8_fim_navio',
     ef:{flag:'convidou_o_wilton', rep:{eixo:'bom',delta:2,motivo:'Convidou alguém a andar junto'}}},
    {texto:'"Quantas vezes a senhora já fez isso?"', vai:'c8_quantas_vezes'},
    {texto:'Se despedir e subir.', vai:'c8_fim_navio'}
  ]
},

c8_quantas_vezes:{
  texto:[
    '"Quantas vezes a senhora já fez isso? Registrar como achado no convés."',
    'Ela não responde na hora. Termina de guardar uma coisa no armário e tranca.',
    '"Quatorze."',
    'Ela vira.',
    '"Em onze temporadas. Quatorze vezes."',
    'Ela senta na cadeira dela.',
    '"E eu vou te dizer a parte que ninguém pergunta: das quatorze, doze foram trazidas por alguém da tripulação."',
    '"E as outras duas?"',
    '"Por garoto." Ela olha pra você. "Garoto que entrou onde não devia e viu o que não devia e não conseguiu subir a escada sem pegar."'
  ],
  ef:{flag:'as_quatorze_vezes',
      npc:{nome:'Enfermeira do Anne', opiniao:5, memoria:'Já registrou quatorze "achados no convés" em onze temporadas. Duas foram trazidas por garotos.'},
      registrar:'Quatorze "achados no convés" em onze temporadas do S.S. Anne.',
      presagio:'Duas em quatorze. Você é a terceira.'},
  escolhas:[
    {texto:'"E os doze da tripulação?"', vai:'c8_os_doze_da_tripulacao'},
    {texto:'Ficar até clarear.', vai:'c8_fim_navio'},
    {texto:'Ir procurar o capitão.', vai:'c8_capitao'},
    {texto:'Ir pro camarote 40.', vai:'c8_camarote'}
  ]
},

c8_os_doze_da_tripulacao:{
  texto:[
    '"E os doze da tripulação?"',
    '"Doze pessoas diferentes."',
    'Ela fala isso com um orgulho seco.',
    '"Nenhuma repetiu. Cada uma fez uma vez, na temporada dela, e depois nunca mais."',
    '"Por quê?"',
    '"Porque depois muda a escala." Ela dá de ombros. "Ninguém aguenta duas."',
    'Ela olha o armário trancado.',
    '"Eu aguento porque eu sou a enfermeira e eles não têm outra. Eu sou insubstituível e insubstituível é a única liberdade que existe num navio."'
  ],
  ef:{flag:['so_mudou_a_escala','insubstituivel'],
      presagio:'Insubstituível é a única liberdade que existe num navio. E em muitos outros lugares.'},
  escolhas:[
    {texto:'Ficar até clarear.', vai:'c8_fim_navio'},
    {texto:'Ir procurar o capitão.', vai:'c8_capitao'},
    {texto:'Ir pro camarote 40.', vai:'c8_camarote'}
  ]
},

/* ─────────────── CAMAROTE 40 ─────────────── */

c8_camarote:{
  texto:[
    'O corredor do convés três é carpetado e silencioso de um jeito que o resto do navio não é.',
    'O camarote 40 fica no fim, e na frente dele tem um homem de uns cinquenta anos sentado numa cadeira dobrável, lendo um romance policial de banca.',
    'Ele levanta a cabeça quando você chega e volta pro livro. Não te barra, não te avisa, não pergunta nada.',
    'A porta do 40 é igual às outras trinta e nove.',
    d=>d.flags.quatro_bandejas ? 'Quatro bandejas. Duas camas.' : '',
    d=>d.flags.somos_2 ? 'Somos 2.' : ''
  ],
  escolhas:[
    {texto:'Bater na porta.', vai:'c8_bateu_no_40'},
    {texto:'Falar com o homem da cadeira.', vai:'c8_homem_da_cadeira'},
    {texto:'Procurar outro caminho — corredor de serviço.', vai:'c8_corredor_servico'},
    {texto:'Ir procurar o capitão.', vai:'c8_capitao'}
  ]
},

c8_bateu_no_40:{
  texto:[
    'Você bate.',
    'O homem da cadeira não levanta a cabeça do livro.',
    'Dentro do camarote não acontece nada por uns oito segundos.',
    'E aí a porta abre uns quinze centímetros e aparece um homem de uns quarenta anos, de camisa social sem gravata, com uma cara absolutamente comum.',
    '"Pois não?"',
    'Atrás dele, dá pra ver um pedaço do camarote: uma mesa com pastas empilhadas, duas camas feitas, e uma terceira porta interna que devia ser banheiro e que está fechada com uma cadeira encostada na maçaneta.',
    'Uma cadeira encostada na maçaneta pelo lado de fora.'
  ],
  ef:{flag:'viu_a_cadeira_na_maçaneta',
      registrar:'No camarote 40 tem uma porta interna com uma cadeira encostada na maçaneta pelo lado de fora.',
      presagio:'Cadeira encostada na maçaneta. Pelo lado de fora.'},
  escolhas:[
    {texto:'"Desculpa. Quarto errado."', vai:'c8_corredor_servico', ef:{flag:'recuou_no_40'}},
    {texto:'"Quem tá no banheiro?"', vai:'c8_quem_ta_no_banheiro'},
    {texto:'Empurrar a porta e entrar.', vai:'c8_entrou_no_40'},
    {texto:'"Eu trouxe a bandeja." (mesmo sem bandeja)', vai:'c8_a_bandeja_falsa'}
  ]
},

c8_a_bandeja_falsa:{
  texto:[
    '"Eu trouxe a bandeja."',
    'Ele olha as suas mãos vazias.',
    'Silêncio de três segundos.',
    '"Você não trouxe a bandeja."',
    'Ele fala isso com uma paciência de professor, sem nenhuma agressividade, e é muito pior.',
    '"Olha, garoto." Ele encosta o ombro no batente. "Eu vou te dar um conselho e você vai achar que é ameaça e não é."',
    '"Vai pro salão. Tem torneio, tem comida de graça pra participante e tem música ao vivo."',
    'Ele começa a fechar a porta.',
    '"E não volta nesse corredor."'
  ],
  ef:{flag:'foi_avisado_no_40'},
  escolhas:[
    {texto:'Pôr o pé na porta.', vai:'c8_entrou_no_40'},
    {texto:'"Quem tá no banheiro?"', vai:'c8_quem_ta_no_banheiro'},
    {texto:'Obedecer e procurar outro caminho.', vai:'c8_corredor_servico'},
    {texto:'Ir direto no capitão.', vai:'c8_capitao'}
  ]
},

c8_quem_ta_no_banheiro:{
  texto:[
    '"Quem tá no banheiro?"',
    'A cara dele não muda nem um milímetro.',
    '"Ninguém."',
    '"Tem uma cadeira na maçaneta."',
    '"A maçaneta está quebrada e a porta abre sozinha com o balanço do navio."',
    'É uma explicação perfeita. É boa demais. É o tipo de explicação que se tem pronta.',
    'Ele espera você aceitar.',
    'E o silêncio dura tempo suficiente pra você entender que ele vai ficar ali, com a porta a quinze centímetros, pelo tempo que for necessário, sem levantar a voz, até você ir embora.'
  ],
  ef:{flag:'a_explicacao_pronta',
      presagio:'A explicação estava pronta. Guarda isso: gente que tem a explicação pronta já precisou dela antes.'},
  escolhas:[
    {texto:'Empurrar a porta.', vai:'c8_entrou_no_40'},
    {texto:'"Tá bom." E ir pro corredor de serviço.', vai:'c8_corredor_servico'},
    {texto:'Gritar no corredor.', vai:'c8_gritou_no_corredor'},
    {texto:'Ir buscar o capitão.', vai:'c8_capitao'}
  ]
},

c8_gritou_no_corredor:{
  texto:[
    'Você grita.',
    'Não uma frase — um som, alto, num corredor carpetado de navio às onze da noite.',
    'Três portas abrem. Gente de roupão. Um casal. Um homem com uma revista na mão.',
    'E aí acontece a coisa que você não previu: todo mundo olha pra VOCÊ.',
    'O homem do 40 não fecha a porta. Ele abre mais, para que todos vejam que ele está calmo, de camisa social, com as mãos à mostra.',
    '"Está tudo bem", ele diz pros vizinhos, com um sorriso de desculpas. "O garoto se perdeu."',
    'E as três portas fecham.'
  ],
  ef:{flag:'gritou_no_corredor', rep:{eixo:'ruim',delta:1,motivo:'Gritou num corredor e ninguém acreditou'},
      presagio:'"O garoto se perdeu." Ele resolveu isso em quatro palavras.'},
  escolhas:[
    {texto:'Empurrar a porta agora, com testemunha.', vai:'c8_entrou_no_40'},
    {texto:'Ir pro corredor de serviço.', vai:'c8_corredor_servico'},
    {texto:'Ir buscar o capitão.', vai:'c8_capitao'},
    {texto:'Bater nas três portas dos vizinhos.', vai:'c8_bateu_nos_vizinhos'}
  ]
},

c8_bateu_nos_vizinhos:{
  texto:[
    'Você bate na 38. Abre o homem da revista.',
    'Você fala rápido demais: as quatro bandejas, a cadeira na maçaneta, as caixas com furo no porão.',
    'Ele escuta tudo. Não interrompe.',
    'E no fim ele diz, com uma gentileza sincera:',
    '"Filho, eu vou chamar alguém pra te ajudar. Você quer água?"',
    'Ele acha que você está em surto.',
    'E, olhando de fora, com a informação que ele tem, ele está sendo a melhor pessoa possível.'
  ],
  ef:{flag:'nao_acreditaram',
      presagio:'Ele está sendo a melhor pessoa possível com a informação que tem. É por isso que funciona.'},
  escolhas:[
    {texto:'"Só vem comigo até a porta. Dois minutos."', vai:'c8_levou_testemunha'},
    {texto:'Aceitar a água e desistir.', vai:'c8_corredor_servico'},
    {texto:'Ir buscar o capitão.', vai:'c8_capitao'}
  ]
},

c8_levou_testemunha:{
  texto:[
    '"Só vem comigo até a porta. Dois minutos."',
    'E ele vem. Um homem de uns sessenta anos, de pijama, com uma revista na mão, andando descalço num corredor carpetado atrás de um garoto de quinze anos.',
    'Você bate no 40.',
    'O homem de camisa social abre, vê os dois, e o rosto dele faz uma coisa muito rápida que só dura um quarto de segundo.',
    'E o vizinho de pijama olha por cima do ombro dele e vê a mesa com pastas, as duas camas feitas, e a cadeira encostada na maçaneta do banheiro.',
    '"Por que tem uma cadeira na porta do banheiro?" pergunta o homem de pijama.',
    'E é a pergunta mais banal do mundo, feita por um senhor de sessenta anos que quer voltar a dormir, e é a primeira coisa naquele corredor que tem peso.'
  ],
  ef:{flag:'a_testemunha', rep:{eixo:'bom',delta:3,motivo:'Trouxe uma testemunha em vez de bater na porta sozinho'},
      npc:{nome:'Vizinho do 38', opiniao:3, memoria:'Foi de pijama até a porta do 40 com você, e fez a pergunta certa.'},
      registrar:'Um vizinho testemunhou a cadeira na maçaneta do camarote 40.',
      presagio:'Sozinho você é um garoto surtado. Com um senhor de pijama você é um relato.'},
  escolhas:[
    {texto:'Empurrar a porta agora.', vai:'c8_entrou_no_40'},
    {texto:'Deixar o senhor conduzir.', vai:'c8_o_senhor_conduziu'},
    {texto:'Ir buscar o capitão com ele junto.', vai:'c8_capitao', ef:{flag:'com_testemunha'}}
  ]
},

c8_o_senhor_conduziu:{
  texto:[
    'Você fica calado e deixa o senhor de pijama conduzir.',
    'E ele conduz. Com uma competência assustadora de quem trabalhou a vida inteira em alguma coisa.',
    'Ele pede pra ver o banheiro. O homem do 40 diz que a maçaneta está quebrada. O senhor de pijama diz que então não custa nada abrir.',
    'Isso dura quatro minutos e o homem do 40 não cede.',
    'E aí o senhor de pijama diz a frase:',
    '"Eu fui fiscal de vigilância sanitária por trinta e um anos e eu sei exatamente o que é uma pessoa que não abre uma porta."',
    'Ele vira pra você.',
    '"Chama o comissário de bordo. Agora."'
  ],
  ef:{flag:'o_fiscal', rep:{eixo:'bom',delta:2,motivo:'Deixou alguém competente conduzir'},
      npc:{nome:'Vizinho do 38', opiniao:6, memoria:'Foi fiscal de vigilância sanitária por trinta e um anos. Assumiu a porta do 40.'},
      registrar:'O vizinho do 38 é fiscal aposentado e assumiu a situação do camarote 40.',
      presagio:'Trinta e um anos de fiscal. Era a pessoa certa atrás da porta errada, por acaso, num navio.'},
  escolhas:[
    {texto:'Correr buscar o comissário.', vai:'c8_capitao', ef:{flag:'com_testemunha'}},
    {texto:'Empurrar a porta você mesmo.', vai:'c8_entrou_no_40'}
  ]
},

c8_entrou_no_40:{
  texto:[
    'Você empurra.',
    'Ele não te bate — ele tenta segurar a porta, e você tem quinze anos e sessenta quilos e uma quantidade absurda de raiva acumulada desde uma floresta, e a porta abre.',
    'O camarote tem duas camas feitas, uma mesa com onze pastas empilhadas e etiquetadas, um notebook aberto com uma planilha, e a terceira porta com a cadeira.',
    'Você tira a cadeira.',
    'Dentro do banheiro tem dois adolescentes sentados no chão, entre a privada e o box, e um deles é mais novo que você.',
    'Eles não gritam, não correm, não pedem ajuda.',
    'Eles olham pro homem de camisa social primeiro, pra ver se podem levantar.'
  ],
  ef:{flag:'abriu_o_40', rep:{eixo:'bom',delta:4,motivo:'Abriu a porta do camarote 40'},
      registrar:'Dentro do camarote 40: dois adolescentes trancados no banheiro.',
      presagio:'Eles olharam pra ele primeiro, pra ver se podiam levantar. Isso leva tempo pra aprender.'},
  escolhas:[
    {texto:'"Vocês podem levantar."', vai:'c8_podem_levantar'},
    {texto:'Gritar por socorro agora, com a porta aberta.', vai:'c8_socorro_com_porta_aberta'},
    {texto:'Pegar as onze pastas.', vai:'c8_pegou_as_pastas'},
    {texto:'Encarar o homem de camisa social.', vai:'c8_encarou_o_do_40'}
  ]
},

c8_podem_levantar:{
  texto:[
    '"Vocês podem levantar."',
    'Nenhum dos dois levanta.',
    'Eles continuam olhando pro homem de camisa social.',
    'E ele, porque é competente, faz a única coisa que ainda funciona: ele fala com eles com uma voz muito calma.',
    '"Está tudo bem. Pode levantar."',
    'E aí eles levantam.',
    'E é nesse segundo que você entende o tamanho exato da coisa, e o tamanho é pior do que gaiola: gaiola é ferro, e isso aqui não tem ferro nenhum.',
    'Um deles se chama Denis e ele não te reconhece porque vocês nunca se viram.'
  ],
  ef:{flag:['achou_o_denis','abriu_o_40'],
      registrar:'Denis está vivo. Ele levantou quando o homem de camisa social autorizou.',
      rep:{eixo:'bom',delta:3,motivo:'Falou com quem ninguém falava'},
      presagio:'Não tem ferro nenhum. É essa a parte que você não vai conseguir explicar depois.'},
  escolhas:[
    {texto:'"Denis. Sua tia tem uma carta sua."', vai:'c8_a_carta_de_volta',
     cond:d=>!!(d.flags.a_carta_do_denis||d.flags.copiou_a_carta||d.flags.o_denis_esta_no_40)},
    {texto:'Pegar os dois pela mão e sair andando.', vai:'c8_saiu_andando'},
    {texto:'Gritar por socorro com a porta aberta.', vai:'c8_socorro_com_porta_aberta'},
    {texto:'Pegar as onze pastas.', vai:'c8_pegou_as_pastas'}
  ]
},

c8_a_carta_de_volta:{
  texto:[
    '"Denis. Sua tia tem uma carta sua."',
    'Ele para no meio do movimento de levantar.',
    '"Como você sabe meu nome?"',
    '"Um menino do cais de Vermilion tem a sua carta dobrada em oito no bolso de trás. Faz um ano."',
    'E aí ele chora.',
    'De uma vez, sem aviso, do jeito que chora quem segurou muito tempo, sentado de novo no chão do box do banheiro de um camarote.',
    '"Eu escrevi de novo", ele diz. "Eu escrevi de novo quatro vezes."',
    'Ele olha pro homem de camisa social.',
    '"Ele disse que ia postar."'
  ],
  ef:{flag:'o_denis_chorou', rep:{eixo:'bom',delta:4,motivo:'Levou o nome de alguém até dentro de uma porta fechada'},
      registrar:'Denis escreveu outras quatro cartas. Nenhuma foi postada.',
      presagio:'Quatro cartas que nunca foram postadas. Alguém guardou quatro cartas.'},
  escolhas:[
    {texto:'Procurar as quatro cartas nas pastas.', vai:'c8_pegou_as_pastas'},
    {texto:'Pegar os dois e sair andando.', vai:'c8_saiu_andando'},
    {texto:'Gritar por socorro.', vai:'c8_socorro_com_porta_aberta'},
    {texto:'Encarar o homem de camisa social.', vai:'c8_encarou_o_do_40'}
  ]
},

c8_encarou_o_do_40:{
  texto:[
    'Você vira pro homem de camisa social.',
    'Ele está parado no meio do camarote com as mãos à mostra, calmo, sem nenhuma intenção de correr ou de reagir.',
    '"Eles embarcaram por vontade própria", ele diz. "Os dois assinaram termo de vaga de trabalho. Está na pasta três."',
    '"Eles estavam trancados num banheiro."',
    '"A porta estava encostada com uma cadeira porque a maçaneta está quebrada."',
    'Ele olha você nos olhos sem piscar.',
    '"E, garoto: eu sei que você não acredita. Mas quando isso virar processo — e vai virar —, vai ter um termo assinado, um laudo de maçaneta e a sua palavra."',
    'Ele senta na cama.',
    '"Chama quem você quiser. Eu espero."'
  ],
  ef:{flag:'ele_esperou',
      presagio:'"Chama quem você quiser. Eu espero." Ele não está blefando e é isso que dá medo.'},
  escolhas:[
    {texto:'Pegar as onze pastas.', vai:'c8_pegou_as_pastas'},
    {texto:'Chamar o capitão.', vai:'c8_capitao', ef:{flag:'com_testemunha'}},
    {texto:'Pegar os dois e sair andando.', vai:'c8_saiu_andando'},
    {texto:'Gritar por socorro.', vai:'c8_socorro_com_porta_aberta'}
  ]
},

c8_pegou_as_pastas:{
  texto:[
    'Você pega as onze pastas da mesa e enfia na mochila, o que não cabe, então você enfia sete e carrega quatro embaixo do braço.',
    'Ele não te impede. Ele senta na cama e olha, com uma expressão de quem está calculando prejuízo.',
    '"Aquilo é material de trabalho."',
    '"É prova."',
    '"É material de trabalho de uma entidade regularmente constituída e você está cometendo furto." Ele fala sem raiva. "Mas tudo bem. Leva."',
    'E o "leva" dele é a coisa mais assustadora da noite, porque quer dizer que ele já calculou e que a conta fecha pro lado dele.',
    'Dentro de uma das pastas, presas com clipe, tem quatro cartas fechadas com selo e endereço, nunca postadas.'
  ],
  ef:{flag:['tem_as_pastas_do_40','papel_com_brasao','as_quatro_cartas'],
      rep:{eixo:'bom',delta:3,motivo:'Levou as pastas e as cartas do camarote 40'},
      registrar:'Levou onze pastas do camarote 40, com quatro cartas seladas e nunca postadas.',
      presagio:'Ele deixou você levar. Ele já fez a conta. Você vai passar meses descobrindo qual era.'},
  escolhas:[
    {texto:'Pegar os dois e sair andando.', vai:'c8_saiu_andando'},
    {texto:'Chamar o capitão com tudo na mão.', vai:'c8_capitao', ef:{flag:'com_testemunha'}},
    {texto:'"Por que você não postou as cartas?"', vai:'c8_porque_nao_postou'},
    {texto:'Gritar por socorro.', vai:'c8_socorro_com_porta_aberta'}
  ]
},

c8_porque_nao_postou:{
  texto:[
    '"Por que você não postou as cartas?"',
    'Pela primeira vez na conversa inteira, ele demora.',
    '"Porque correspondência de menor sob acompanhamento passa por triagem."',
    '"Isso é regra de quê?"',
    '"Do protocolo interno."',
    '"Quem escreveu o protocolo interno?"',
    'Silêncio.',
    '"Eu escrevi uma parte."',
    'Ele olha as próprias mãos.',
    '"A parte da triagem foi minha. Em dois mil e vinte e dois. Eu achei que era pra proteger eles de pedido de dinheiro de família."'
  ],
  ef:{flag:'ele_escreveu_a_triagem',
      registrar:'O homem do camarote 40 escreveu a regra de triagem de correspondência que reteve as cartas.',
      presagio:'Ele escreveu a regra achando que protegia. Quase todas as regras assim começam assim.'},
  escolhas:[
    {texto:'"Posta agora."', vai:'c8_posta_agora'},
    {texto:'Pegar os dois e sair andando.', vai:'c8_saiu_andando'},
    {texto:'Chamar o capitão.', vai:'c8_capitao', ef:{flag:'com_testemunha'}}
  ]
},

c8_posta_agora:{
  texto:[
    '"Posta agora."',
    'Ele olha as quatro cartas na sua mão.',
    '"Não é assim que—"',
    '"Posta agora." Você põe as quatro na mesa dele. "Tem caixa de correio no convés dois. Eu vi."',
    'Ele fica olhando as cartas por um tempo muito longo.',
    'Depois levanta, pega as quatro, e sai do camarote com você atrás, e desce um convés, e põe as quatro na caixa de correio do navio, uma por uma.',
    'E quando acaba ele fica parado na frente da caixa de correio por uns bons dez segundos.',
    '"Vai dar problema", ele diz, pra ninguém.',
    '"Pra você?"',
    '"Pra mim."'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Fez um homem postar quatro cartas que ele mesmo tinha retido'},
      flag:'as_cartas_foram_postadas',
      npc:{nome:'Homem do camarote 40', opiniao:3, memoria:'Você o fez postar as quatro cartas do Denis. Ele disse que ia dar problema pra ele.'},
      registrar:'As quatro cartas do Denis foram postadas na caixa do convés dois.',
      presagio:'"Pra mim." Ele postou sabendo. Isso não o absolve de nada e aconteceu mesmo assim.'},
  escolhas:[
    {texto:'Pegar os dois e sair andando.', vai:'c8_saiu_andando'},
    {texto:'Chamar o capitão.', vai:'c8_capitao', ef:{flag:'com_testemunha'}},
    {texto:'Ir pra enfermaria com os dois.', vai:'c8_enfermaria'}
  ]
},

c8_saiu_andando:{
  texto:[
    'Você pega os dois pela mão — literalmente pela mão, como criança, o que é constrangedor e é o que funciona — e sai andando pelo corredor.',
    'O homem da cadeira dobrável levanta a cabeça do romance policial.',
    'E não faz nada.',
    'Ele olha os três passarem, e volta pro livro, e você entende que ele é segurança de porta e não de gente, e que ninguém nunca definiu isso claramente pra ele, e que ele acabou de escolher sozinho.',
    'Vocês três atravessam o convés três inteiro, descem dois lances, e chegam na enfermaria às onze e quarenta da noite.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Tirou duas pessoas de um camarote pela mão'},
      flag:'tirou_os_dois_do_40',
      registrar:'Tirou os dois adolescentes do camarote 40 e levou para a enfermaria.',
      presagio:'O da cadeira escolheu sozinho. Muita coisa em Kanto depende de gente escolhendo sozinha, sem ninguém saber.'},
  escolhas:[
    {texto:'Entrar na enfermaria.', vai:'c8_enfermaria'},
    {texto:'Ir direto no capitão.', vai:'c8_capitao', ef:{flag:'com_testemunha'}}
  ]
},

c8_socorro_com_porta_aberta:{
  texto:[
    'Você grita com a porta aberta e os dois adolescentes visíveis atrás de você.',
    'Dessa vez funciona de um jeito diferente.',
    'Abre a 38 e o senhor de pijama. Abre a 42 e um casal. Abre a 36.',
    'E as pessoas veem dois adolescentes saindo de um banheiro de camarote alheio às onze da noite, e a expressão coletiva daquele corredor muda de uma vez.',
    'Alguém diz "chama o comissário".',
    'E é a primeira frase útil que alguém disse nesse navio.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Gritou na hora certa, com a porta aberta'},
      flag:['com_testemunha','corredor_viu'],
      registrar:'O corredor do convés três viu os dois adolescentes saindo do camarote 40.',
      presagio:'Agora tem seis testemunhas. Seis é muito mais que uma.'},
  escolhas:[
    {texto:'Ir com o comissário até o capitão.', vai:'c8_capitao'},
    {texto:'Levar os dois pra enfermaria antes.', vai:'c8_enfermaria'},
    {texto:'Voltar e pegar as onze pastas.', vai:'c8_pegou_as_pastas'}
  ]
},

c8_corredor_servico:{
  texto:[
    'O corredor de serviço do convés três corre paralelo ao dos camarotes, do outro lado da antepara, e serve pra copa, rouparia e manutenção.',
    d=>d.flags.tem_a_chave ? 'A chave de latão que a Neusa perdeu em dois mil e dezenove abre a porta no primeiro giro.'
       : d.flags.janela_das_23h ? 'A porta está destrancada, porque são 23h07 e a troca de turno da copa vai até 23h20.'
       : 'A porta está trancada. Você espera dezoito minutos encostado na parede e uma copeira sai empurrando um carrinho e você segura a porta pra ela, e ela agradece, e você entra.',
    'Lá dentro é estreito, quente e cheio de cano.',
    'E, na altura do camarote 40, tem uma grade de ventilação na antepara, de trinta por trinta, com quatro parafusos de fenda.',
    'Dá pra ouvir o que está sendo dito do outro lado.'
  ],
  ef:{flag:'achou_a_grade'},
  escolhas:[
    {texto:'Escutar.', vai:'c8_escutou_pela_grade'},
    {texto:'Desparafusar a grade.', vai:'c8_desparafusou'},
    {texto:'Voltar e bater na porta do 40.', vai:'c8_bateu_no_40'},
    {texto:'Ir buscar o capitão com isso.', vai:'c8_capitao'}
  ]
},

c8_escutou_pela_grade:{
  texto:[
    'Você senta no chão de aço do corredor de serviço, com o ouvido na grade, e escuta por vinte e dois minutos.',
    'A maior parte é chato. É chatíssimo: é um homem ao telefone falando de logística, de prazo, de uma reunião de segunda.',
    'E no meio, sem nenhuma mudança de tom, ele diz:',
    '"Os dois de Vermilion eu levo até Cinnabar e entrego lá mesmo, porque o alojamento daqui não comporta."',
    'Pausa.',
    '"Não, os dois estão bem. Comendo, dormindo, sem incidente."',
    'Pausa.',
    '"Doutor, com todo o respeito: eu faço isso há quatro anos e nunca perdi um."'
  ],
  ef:{flag:['ouviu_pela_grade','sabe_de_sena'],
      registrar:'Pela grade: "eu faço isso há quatro anos e nunca perdi um". Ele chama o outro de Doutor.',
      presagio:'"Nunca perdi um." Ele tem orgulho disso. Genuinamente.'},
  escolhas:[
    {texto:'Continuar escutando.', vai:'c8_continuou_escutando'},
    {texto:'Desparafusar a grade.', vai:'c8_desparafusou'},
    {texto:'Ir buscar o capitão com isso.', vai:'c8_capitao'},
    {texto:'Ir bater na porta do 40.', vai:'c8_bateu_no_40'}
  ]
},

c8_continuou_escutando:{
  texto:[
    'Você fica mais quarenta minutos.',
    'Ele desliga o telefone e fala com os dois do banheiro — e a voz muda completamente. Fica mais macia, mais lenta, de professor.',
    '"Vocês querem comer?"',
    'Um deles responde alguma coisa que você não ouve.',
    '"Eu sei, eu sei. Amanhã a gente chega e aí melhora. Alojamento tem janela."',
    'Silêncio.',
    '"Denis, vira pra cá. Olha. Você assinou por vontade própria, lembra? Eu perguntei três vezes."',
    'E a coisa mais horrível da noite inteira:',
    '"Lembro", diz o menino.'
  ],
  ef:{flag:'lembro_disse_o_menino',
      registrar:'"Você assinou por vontade própria, lembra? Eu perguntei três vezes." "Lembro."',
      presagio:'"Lembro." Vai ser essa palavra que você vai ouvir de novo num tribunal, se chegar a ter tribunal.'},
  escolhas:[
    {texto:'Desparafusar a grade.', vai:'c8_desparafusou'},
    {texto:'Ir buscar o capitão agora.', vai:'c8_capitao'},
    {texto:'Ir bater na porta do 40.', vai:'c8_bateu_no_40'},
    {texto:'Fotografar a grade e o corredor.', vai:'c8_fotografou', cond:d=>Estado.contaItem('Câmera descartável')>0}
  ]
},

c8_desparafusou:{
  texto:[
    'Você desparafusa os quatro com a chave da sua mochila. Leva onze minutos e os parafusos são de fenda e velhos e o último quase não sai.',
    'A grade sai.',
    'Do outro lado tem um duto de trinta centímetros que dá na parte de cima do box do banheiro do camarote 40, e você não cabe.',
    'Mas dá pra ver.',
    'E dá pra falar.',
    'Você põe a boca no duto e fala, muito baixo: "Denis."',
    'E do outro lado, depois de uns quatro segundos, uma voz de menino responde, muito baixa: "Quem é?"'
  ],
  ef:{flag:'falou_com_o_denis',
      rep:{eixo:'bom',delta:3,motivo:'Falou com quem estava do outro lado da parede'},
      registrar:'Falou com Denis por um duto de ventilação do camarote 40.',
      presagio:'"Quem é?" Ninguém perguntou isso pra ele há muito tempo.'},
  escolhas:[
    {texto:'"Um amigo do menino do cais."', vai:'c8_amigo_do_cais'},
    {texto:'"Alguém que vai tirar vocês daí."', vai:'c8_vai_tirar'},
    {texto:'"Quantos são?"', vai:'c8_quantos_sao_no_40'},
    {texto:'Fechar tudo e ir buscar o capitão.', vai:'c8_capitao', ef:{flag:'com_testemunha'}}
  ]
},

c8_amigo_do_cais:{
  texto:[
    '"Um amigo do menino do cais."',
    'Silêncio comprido do outro lado.',
    '"Do Toshi?"',
    '"Do Toshi."',
    'E aí você ouve, através de trinta centímetros de duto de ventilação de aço galvanizado, um menino de dezessete anos chorando o mais baixo que ele consegue.',
    'Você fica com o rosto encostado no duto até ele parar.',
    'Leva seis minutos.'
  ],
  ef:{flag:['achou_o_denis','o_denis_chorou'],
      rep:{eixo:'bom',delta:3,motivo:'Levou um nome conhecido através de uma parede'},
      registrar:'Denis está vivo, no camarote 40, e sabe o nome do Toshi.',
      presagio:'Seis minutos com o rosto num duto de ventilação. Isso vai ficar.'},
  escolhas:[
    {texto:'"Eu vou tirar vocês daí."', vai:'c8_vai_tirar'},
    {texto:'"Quantos são?"', vai:'c8_quantos_sao_no_40'},
    {texto:'Ir buscar o capitão agora.', vai:'c8_capitao', ef:{flag:'com_testemunha'}},
    {texto:'Ir bater na porta do 40.', vai:'c8_bateu_no_40'}
  ]
},

c8_quantos_sao_no_40:{
  texto:[
    '"Quantos são?"',
    '"Dois."',
    'Pausa.',
    '"Nesse camarote."',
    'Você demora a entender a correção.',
    '"E nos outros?"',
    '"Tem mais três no convés um, no alojamento de tripulação." A voz dele está firme agora, e é pior do que quando estava chorando. "E tem gente que embarcou em Celadon."',
    '"Quantos ao todo?"',
    '"Nove."'
  ],
  ef:{flag:'sao_nove',
      registrar:'Nove pessoas embarcadas por "vaga de trabalho" no S.S. Anne desta temporada.',
      presagio:'Nove. Não dois. Você achou dois e são nove, e essa é sempre a proporção.'},
  escolhas:[
    {texto:'"Eu vou tirar vocês daí."', vai:'c8_vai_tirar'},
    {texto:'Ir buscar o capitão agora, com o número.', vai:'c8_capitao', ef:{flag:['com_testemunha','sabe_do_numero']}},
    {texto:'Ir bater na porta do 40.', vai:'c8_bateu_no_40'},
    {texto:'Ir ao alojamento do convés um.', vai:'c8_porao'}
  ]
},

c8_vai_tirar:{
  texto:[
    '"Eu vou tirar vocês daí."',
    'Silêncio.',
    '"Não."',
    'A resposta dele é imediata e você não estava preparado.',
    '"Como não?"',
    '"Porque se você abrir essa porta hoje, amanhã eu não tenho nada." A voz dele é de alguém que já pensou muito nisso. "Eu não tenho casa, eu não tenho dinheiro de passagem de volta e eu devo três meses de alojamento."',
    'Pausa.',
    '"Eu tenho um contrato. É ruim. É o que eu tenho."',
    'E aí a frase que vai ficar:',
    '"Tira eu daqui e me põe aonde?"'
  ],
  ef:{flag:'me_poe_aonde',
      registrar:'Denis recusou ser tirado: "tira eu daqui e me põe aonde?"',
      presagio:'"Me põe aonde?" É a pergunta que derruba quase toda intenção boa de Kanto.'},
  escolhas:[
    {texto:'"Comigo."', vai:'c8_comigo'},
    {texto:'"Eu não sei. Mas não aí."', vai:'c8_nao_sei_mas_nao_ai'},
    {texto:'Respeitar e ir buscar o capitão mesmo assim.', vai:'c8_capitao', ef:{flag:'com_testemunha'}},
    {texto:'Respeitar e não fazer nada.', vai:'c8_fim_navio', ef:{flag:'respeitou_o_denis'}}
  ]
},

c8_comigo:{
  texto:[
    '"Comigo."',
    'Você fala isso através de um duto de ventilação, agachado num corredor de serviço, com quinze anos, sem plano nenhum.',
    'Silêncio muito longo.',
    '"Você tem quantos anos?"',
    '"Quinze."',
    'E o Denis ri. Ri de verdade, do outro lado, um riso curto e sem nenhuma maldade.',
    '"Cara."',
    'Pausa.',
    '"Tá bom."'
  ],
  ef:{flag:['o_denis_topou','achou_o_denis'],
      rep:{eixo:'bom',delta:3,motivo:'Ofereceu o que não tinha e ofereceu mesmo assim'},
      registrar:'Denis topou sair, com você, sem plano nenhum.',
      presagio:'"Tá bom." Ele topou porque alguém ofereceu. Era só isso que faltava, e faltou por um ano.'},
  escolhas:[
    {texto:'Ir bater na porta do 40 agora.', vai:'c8_bateu_no_40'},
    {texto:'Ir buscar o capitão.', vai:'c8_capitao', ef:{flag:'com_testemunha'}},
    {texto:'Voltar pelo corredor e abrir a porta pelo lado de fora.', vai:'c8_entrou_no_40'}
  ]
},

c8_nao_sei_mas_nao_ai:{
  texto:[
    '"Eu não sei. Mas não aí."',
    'Silêncio.',
    '"Essa é a resposta mais honesta que eu ouvi em um ano", ele diz.',
    'Pausa.',
    '"E não serve, cara. Honesta não serve. Eu preciso de uma cama."',
    'Você fica agachado no corredor de serviço sem nada pra dizer, porque ele está certo.',
    'E depois de um tempo longo ele fala de novo, mais baixo:',
    '"Mas obrigado por perguntar em vez de arrombar."'
  ],
  ef:{flag:'honesta_nao_serve',
      presagio:'Honesta não serve. Ele precisa de uma cama. Essa é a distância entre querer ajudar e ajudar.'},
  escolhas:[
    {texto:'"Então eu arranjo a cama primeiro."', vai:'c8_arranjou_a_cama'},
    {texto:'Ir buscar o capitão.', vai:'c8_capitao', ef:{flag:'com_testemunha'}},
    {texto:'Ir bater na porta do 40.', vai:'c8_bateu_no_40'},
    {texto:'Respeitar e ir embora.', vai:'c8_fim_navio', ef:{flag:'respeitou_o_denis'}}
  ]
},

c8_arranjou_a_cama:{
  texto:[
    'Você passa a madrugada inteira nisso.',
    'Acorda a enfermeira. Acorda o contramestre. Acorda a Neusa da cozinha, que dorme no alojamento de temporada e que te xinga por quatro minutos antes de escutar.',
    'E às cinco e quarenta da manhã existe, escrito num papel de carta de camarote, assinado por três funcionários do S.S. Anne:',
    'uma vaga de auxiliar de cozinha, com registro, com carteira, com alojamento, começando na próxima temporada — e um lugar pra dormir em Cinnabar até lá, na casa da irmã da Neusa, que aluga quarto.',
    'Não é resgate. É muito mais chato que resgate e leva sete horas e envolve três pessoas assinando coisa.',
    'Você bate na porta do 40 às seis da manhã com o papel na mão.'
  ],
  ef:{rep:{eixo:'bom',delta:5,motivo:'Passou a madrugada inteira arranjando uma cama antes de abrir uma porta'},
      hp:-3, causa:'Noite em claro no S.S. Anne',
      flag:['arranjou_a_cama','com_testemunha'],
      npc:{nome:'Cozinheira do Anne', opiniao:6, memoria:'Você a acordou às três da manhã e ela assinou uma vaga de auxiliar de cozinha pro Denis.'},
      registrar:'Arranjou vaga com registro e alojamento para o Denis antes de abrir a porta.',
      presagio:'Não é resgate. É sete horas e três assinaturas. É assim que as coisas funcionam de verdade.'},
  escolhas:[
    {texto:'Bater na porta.', vai:'c8_bateu_no_40'},
    {texto:'Chamar o capitão antes.', vai:'c8_capitao'}
  ]
},

/* ─────────────── CAPITÃO ─────────────── */

c8_capitao:{
  texto:[
    'A ponte de comando do S.S. Anne fica dois conveses acima do salão e tem uma escada com corrente e uma placa de "ACESSO RESTRITO" que ninguém obedece.',
    'O capitão tem uns sessenta anos, está de camisa branca sem paletó, e está tomando café às onze da noite olhando um radar que não mostra nada.',
    'Ele te escuta por seis minutos sem interromper uma vez.',
    d=>d.flags.com_testemunha ? 'Você não está sozinho, e isso muda o jeito que ele escuta: ele olha pra outra pessoa três vezes durante o seu relato, conferindo.' : 'Você está sozinho, e ele te escuta do jeito que adulto escuta adolescente sozinho.',
    'Quando você acaba, ele põe a caneca na bancada.',
    '"Eu sei do camarote quarenta."'
  ],
  ef:{flag:'falou_com_o_capitao', registrar:'O capitão do S.S. Anne sabe do camarote 40.'},
  escolhas:[
    {texto:'"E o senhor não faz nada?"', vai:'c8_nao_faz_nada'},
    {texto:'Ficar calado e esperar ele continuar.', vai:'c8_ele_continuou'},
    {texto:'Mostrar o que você tem.', vai:'c8_mostrou_ao_capitao',
     cond:d=>!!(d.flags.papel_com_brasao||d.flags.fotografou_o_porao||d.flags.tem_as_pastas_do_40||d.flags.tem_a_etiqueta)},
    {texto:'"Eu vou contar pra imprensa quando descer."', vai:'c8_ameacou_o_capitao'}
  ]
},

c8_ele_continuou:{
  texto:[
    'Você não fala nada.',
    'Ele espera. Você continua não falando.',
    'E ele continua, porque silêncio faz as pessoas continuarem:',
    '"Eu sei do camarote quarenta e eu sei das caixas do porão e eu sei que tem nove garoto embarcado sem nome em lista de passageiro nessa temporada."',
    'Ele bebe café.',
    '"Eu sou capitão de um navio de passageiros. Eu não sou autoridade policial, eu não sou fiscal do trabalho e eu não sou juiz."',
    'Ele olha o radar.',
    '"Eu sou responsável pela segurança da embarcação. E, do ponto de vista da segurança da embarcação, não tem absolutamente nada errado acontecendo a bordo."',
    'Uma pausa.',
    '"Isso é verdade e é uma desgraça, e eu tenho consciência das duas coisas há quatro anos."'
  ],
  ef:{flag:'o_capitao_sabe',
      registrar:'O capitão sabe de tudo há quatro anos e não tem competência formal sobre nada disso.',
      presagio:'Ninguém é responsável. Cada um é responsável por um pedaço, e o pedaço de cada um está em ordem.'},
  escolhas:[
    {texto:'"Então quem é responsável?"', vai:'c8_quem_e_responsavel'},
    {texto:'"O senhor pode registrar em diário de bordo."', vai:'c8_diario_de_bordo'},
    {texto:'"O senhor pode atracar e chamar a capitania."', vai:'c8_capitania'},
    {texto:'Mostrar o que você tem.', vai:'c8_mostrou_ao_capitao',
     cond:d=>!!(d.flags.papel_com_brasao||d.flags.fotografou_o_porao||d.flags.tem_as_pastas_do_40||d.flags.tem_a_etiqueta)}
  ]
},

c8_nao_faz_nada:{
  texto:[
    '"E o senhor não faz nada?"',
    'Ele não se ofende, o que é irritante.',
    '"Eu fiz duas vezes."',
    'Ele abre uma gaveta da bancada e tira duas folhas.',
    'São cópias de comunicações internas, de dois anos atrás e de um ano atrás, dirigidas à administração da companhia, relatando "transporte de pessoal não registrado" e solicitando orientação.',
    'As duas têm carimbo de recebido.',
    'As duas têm, grampeada, uma resposta de duas linhas: "Acusamos recebimento. A questão está sendo tratada no âmbito competente."',
    '"Eu guardei", ele diz. "Eu guardo tudo."'
  ],
  ef:{flag:['o_capitao_comunicou','sempre_guarda_o_recebido'],
      npc:{nome:'Capitão do Anne', opiniao:3, memoria:'Comunicou duas vezes à companhia e guardou as duas respostas de duas linhas.'},
      registrar:'O capitão comunicou duas vezes por escrito. Recebeu duas respostas de duas linhas.',
      presagio:'"A questão está sendo tratada no âmbito competente." Não existe âmbito competente. É o ponto.'},
  escolhas:[
    {texto:'"Me dá cópia dessas duas folhas."', vai:'c8_copia_do_capitao'},
    {texto:'"Então quem é responsável?"', vai:'c8_quem_e_responsavel'},
    {texto:'"O senhor pode registrar em diário de bordo."', vai:'c8_diario_de_bordo'},
    {texto:'"O senhor pode chamar a capitania."', vai:'c8_capitania'}
  ]
},

c8_copia_do_capitao:{
  texto:[
    '"Me dá cópia dessas duas folhas."',
    'Ele para.',
    '"Pra quê?"',
    '"Pra ter."',
    'Ele olha as folhas. Olha você. Olha o radar.',
    'E aí vai até a copiadora da sala de rádio, que é uma máquina velha e barulhenta, e tira duas cópias, e carimba as duas com o carimbo do navio, e assina embaixo com data.',
    '"Isso aqui não é prova de crime nenhum", ele avisa. "Isso é prova de que eu avisei."',
    'Ele te entrega.',
    '"O que é uma coisa completamente diferente, e que um dia vai ser importante pra alguém, e provavelmente não pra mim."'
  ],
  ef:{flag:['tem_as_comunicacoes','papel_com_brasao'],
      rep:{eixo:'bom',delta:3,motivo:'Pediu a prova de que alguém avisou'},
      npc:{nome:'Capitão do Anne', opiniao:6, memoria:'Te deu cópia carimbada e assinada das duas comunicações que ele fez à companhia.'},
      registrar:'Tem cópias carimbadas das duas comunicações do capitão à companhia.',
      presagio:'Prova de que ele avisou. Num processo, isso é o que separa cúmplice de testemunha.'},
  escolhas:[
    {texto:'"Então quem é responsável?"', vai:'c8_quem_e_responsavel'},
    {texto:'"O senhor pode registrar em diário de bordo."', vai:'c8_diario_de_bordo'},
    {texto:'"O senhor pode chamar a capitania."', vai:'c8_capitania'},
    {texto:'Agradecer e descer.', vai:'c8_fim_navio'}
  ]
},

c8_quem_e_responsavel:{
  texto:[
    '"Então quem é responsável?"',
    'Ele ri um riso sem nada.',
    '"Ninguém."',
    'Ele conta nos dedos, devagar, como quem já fez isso muitas vezes sozinho.',
    '"O conferente confere lacre, número e peso, e está em ordem."',
    '"O contramestre contrata registrado, e está em ordem."',
    '"A companhia loca espaço de carga a um terceiro com documentação válida, e está em ordem."',
    '"A fundação tem estatuto publicado, CNPJ e autorização de transporte, e está em ordem."',
    '"E os garotos assinaram termo de vaga de trabalho por vontade própria, e está em ordem."',
    'Ele abre as mãos.',
    '"Não tem nenhuma peça errada. A máquina inteira está errada e não tem nenhuma peça errada."'
  ],
  ef:{flag:'nenhuma_peca_errada',
      registrar:'"A máquina inteira está errada e não tem nenhuma peça errada."',
      presagio:'Nenhuma peça errada. É por isso que não adianta quebrar uma peça.'},
  escolhas:[
    {texto:'"Então tem que mudar a regra."', vai:'c8_mudar_a_regra'},
    {texto:'"O senhor pode registrar em diário de bordo."', vai:'c8_diario_de_bordo'},
    {texto:'"O senhor pode chamar a capitania."', vai:'c8_capitania'},
    {texto:'"Me dá cópia do que o senhor comunicou."', vai:'c8_copia_do_capitao'}
  ]
},

c8_mudar_a_regra:{
  texto:[
    '"Então tem que mudar a regra."',
    'Ele olha pra você de um jeito novo.',
    '"Isso."',
    'Ele bebe o resto do café.',
    '"E pra mudar a regra você precisa estar na sala onde a regra é feita. E pra estar na sala você precisa de legitimidade formal — cargo, credencial, mandato, alguma coisa."',
    'Ele põe a caneca na bancada.',
    '"Eu sou capitão. A minha legitimidade acaba no costado do navio."',
    'Ele olha pro seu cinto.',
    '"A sua, se você juntar as oito, vai mais longe do que a minha."'
  ],
  ef:{flag:'plano_das_insignias',
      rep:{eixo:'bom',delta:2,motivo:'Entendeu que insígnia não é troféu'},
      npc:{nome:'Capitão do Anne', opiniao:4, memoria:'Te disse que a credencial de oito insígnias vai mais longe que a autoridade dele.'},
      registrar:'As oito insígnias servem para entrar na sala onde a regra é feita.',
      presagio:'A sua legitimidade vai mais longe que a de um capitão. Falta ganhar as oito.'},
  escolhas:[
    {texto:'"Me dá cópia do que o senhor comunicou."', vai:'c8_copia_do_capitao'},
    {texto:'"O senhor pode chamar a capitania."', vai:'c8_capitania'},
    {texto:'"O senhor pode registrar em diário de bordo."', vai:'c8_diario_de_bordo'},
    {texto:'Descer e terminar a noite.', vai:'c8_fim_navio'}
  ]
},

c8_diario_de_bordo:{
  texto:[
    '"O senhor pode registrar em diário de bordo."',
    'Ele para com a caneca no meio do caminho.',
    '"Eu posso."',
    'Ele põe a caneca na bancada.',
    '"Diário de bordo é documento público de guarda obrigatória por vinte anos e é o único papel desse navio que eu assino sozinho e que ninguém pode mandar eu não assinar."',
    'Ele olha pra você por um tempo longo.',
    '"Por que eu não pensei nisso?"',
    'E ele responde sozinho, antes de você:',
    '"Porque ninguém nunca me perguntou nada. Ninguém nunca subiu essa escada."'
  ],
  ef:{flag:'sugeriu_o_diario'},
  escolhas:[
    {texto:'"Então registra."', vai:'c8_registrou_no_diario'},
    {texto:'"O senhor pode chamar a capitania também."', vai:'c8_capitania'},
    {texto:'"Me dá cópia do que o senhor comunicou."', vai:'c8_copia_do_capitao'},
    {texto:'Deixar ele decidir sozinho.', vai:'c8_fim_navio'}
  ]
},

c8_registrou_no_diario:{
  texto:[
    '"Então registra."',
    'Ele abre o diário de bordo, que é um livro grande de capa dura com folhas numeradas e sem espaço pra rasura.',
    'E escreve, à caneta, na página do dia, com letra de quem escreve em diário de bordo há trinta anos:',
    'a data, a hora, o número do camarote, o número de pessoas, o conteúdo declarado das três caixas do porão com furo de ventilação, e o número da guia de remessa.',
    'Leva dezoito minutos.',
    'Quando acaba, assina, carimba, e fecha o livro.',
    '"Pronto."',
    'Ele apoia a mão em cima da capa dura.',
    '"Agora isso existe por vinte anos e ninguém pode apagar sem cometer crime."'
  ],
  ef:{rep:{eixo:'bom',delta:5,motivo:'Fez um capitão registrar em diário de bordo o que ninguém ia registrar'},
      flag:['diario_de_bordo_registrado','com_testemunha'],
      npc:{nome:'Capitão do Anne', opiniao:8, memoria:'Registrou tudo no diário de bordo por sua causa. Vinte anos de guarda obrigatória.'},
      registrar:'O capitão registrou o camarote 40 e as caixas do porão no diário de bordo.',
      presagio:'Vinte anos de guarda obrigatória. É a coisa mais lenta e mais indestrutível que você fez em Kanto.'},
  escolhas:[
    {texto:'"E a capitania?"', vai:'c8_capitania'},
    {texto:'"Me dá cópia dessa página."', vai:'c8_copia_da_pagina'},
    {texto:'Agradecer e descer.', vai:'c8_fim_navio'},
    {texto:'Voltar pro camarote 40 com isso.', vai:'c8_camarote'}
  ]
},

c8_copia_da_pagina:{
  texto:[
    '"Me dá cópia dessa página."',
    'Ele abre o livro de novo, tira a cópia na máquina barulhenta da sala de rádio, carimba e assina.',
    '"Guarda em dois lugares", ele diz, entregando. "Nunca no mesmo lugar do original."',
    d=>d.flags.conselho_da_copia ? 'É exatamente o que a Misty te falou, com outras palavras, na borda de uma piscina em Cerulean.' : 'É a segunda vez em pouco tempo que um adulto te diz isso.',
    'Você guarda uma cópia no bolso interno da mochila e dobra a outra dentro do caderno.'
  ],
  ef:{flag:['tem_copia_do_diario','papel_com_brasao','conselho_da_copia'],
      rep:{eixo:'bom',delta:2,motivo:'Guardou cópia em dois lugares'},
      registrar:'Tem cópia carimbada da página do diário de bordo.',
      presagio:'Duas cópias em dois lugares. Você está virando uma pessoa que faz isso.'},
  escolhas:[
    {texto:'"E a capitania?"', vai:'c8_capitania'},
    {texto:'Agradecer e descer.', vai:'c8_fim_navio'},
    {texto:'Voltar pro camarote 40.', vai:'c8_camarote'}
  ]
},

c8_capitania:{
  texto:[
    '"O senhor pode atracar e chamar a capitania."',
    'Ele balança a cabeça devagar.',
    '"Posso. E a capitania dos portos tem competência sobre segurança da navegação."',
    'Ele abre as mãos.',
    '"Eles vêm, conferem colete salva-vidas, botes, extintores, e vão embora. Eles não têm competência pra abrir camarote de passageiro."',
    'Ele pensa.',
    '"Mas."',
    'Ele pega a caneca vazia e não bebe.',
    '"Se eu chamar a capitania por suspeita de irregularidade em transporte de carga viva não declarada, eles são obrigados a lavrar termo. E termo lavrado por capitania vai pro Ministério Público por obrigação legal, não por escolha de ninguém."',
    'Ele olha pra você.',
    '"Isso eu posso. E isso me custa o emprego em uns seis meses, por outro motivo que vão inventar."'
  ],
  ef:{flag:'sabe_da_capitania'},
  escolhas:[
    {texto:'"Então não chama. Registra no diário e me dá as cópias."', vai:'c8_registrou_no_diario',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Não pediu que outro pagasse a conta'}}},
    {texto:'"Chama."', vai:'c8_chamou_a_capitania'},
    {texto:'"O senhor decide. Eu não tenho o direito de pedir isso."', vai:'c8_ele_decidiu'},
    {texto:'"Me dá cópia do que o senhor já comunicou."', vai:'c8_copia_do_capitao'}
  ]
},

c8_chamou_a_capitania:{
  texto:[
    '"Chama."',
    'Ele olha pra você por um tempo muito longo.',
    'E chama.',
    'Pelo rádio, na frequência da capitania, às onze e cinquenta da noite, com a voz absolutamente normal de quem faz comunicação de rotina.',
    'A capitania sobe às seis da manhã, no cais de Cinnabar, com quatro agentes e uma prancheta.',
    'Eles lavram termo. Leva três horas. Abrem as três caixas do porão e fotografam.',
    'O camarote 40 está vazio quando eles chegam, e as onze pastas também, e os nove adolescentes desembarcaram na madrugada por uma prancha de serviço que ninguém registrou.',
    'Mas o termo foi lavrado, e termo lavrado vai pro Ministério Público por obrigação legal.',
    'E, sete meses depois, o capitão do S.S. Anne é desligado por reestruturação de quadro.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Fez a capitania lavrar termo'},
      flag:['termo_lavrado','capitao_demitido'],
      npc:{nome:'Capitão do Anne', opiniao:4, memoria:'Chamou a capitania a seu pedido e perdeu o emprego sete meses depois.'},
      registrar:'A capitania lavrou termo no S.S. Anne. O capitão foi desligado sete meses depois.',
      presagio:'Você pediu e ele pagou. Vai ter que decidir o que fazer com esse tipo de conta.'},
  escolhas:[
    {texto:'Descer em Cinnabar.', vai:'c8_fim_navio'},
    {texto:'"Me dá cópia de tudo antes de eu descer."', vai:'c8_copia_do_capitao'}
  ]
},

c8_ele_decidiu:{
  texto:[
    '"O senhor decide. Eu não tenho o direito de pedir isso."',
    'Ele para.',
    'Fica olhando o radar que não mostra nada por uns bons vinte segundos.',
    '"Você tem quinze anos e acabou de ser mais cuidadoso comigo do que a minha companhia foi em trinta anos."',
    'Ele pega o diário de bordo da bancada.',
    '"Eu vou registrar. Registrar eu faço sozinho e ninguém pode mandar eu não fazer."',
    'Ele abre na página do dia.',
    '"A capitania eu chamo na próxima temporada, quando eu tiver aposentadoria integral. Faltam catorze meses."',
    'Ele começa a escrever.',
    '"Isso é covardia e é um plano, e eu prefiro o plano."'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Não empurrou a conta para outra pessoa'},
      flag:['diario_de_bordo_registrado','o_plano_de_catorze_meses'],
      npc:{nome:'Capitão do Anne', opiniao:9, memoria:'Você deixou a decisão com ele. Ele registrou no diário e prometeu chamar a capitania em catorze meses.'},
      registrar:'O capitão registrou no diário e vai chamar a capitania daqui a catorze meses.',
      presagio:'Catorze meses. Anota a data. Ele vai cumprir e ninguém vai estar lá pra ver.'},
  escolhas:[
    {texto:'"Me dá cópia dessa página."', vai:'c8_copia_da_pagina'},
    {texto:'Agradecer e descer.', vai:'c8_fim_navio'},
    {texto:'Voltar pro camarote 40.', vai:'c8_camarote'}
  ]
},

c8_mostrou_ao_capitao:{
  texto:[
    'Você põe tudo na bancada da ponte de comando: a etiqueta, as fotos que ainda não foram reveladas, as pastas, a folha com o brasão — o que você tiver.',
    'Ele olha sem tocar.',
    'Depois pega a etiqueta, ou a folha, e lê o rodapé.',
    '"Guia de remessa. Artigo onze."',
    'Ele põe de volta na bancada.',
    '"Eu vou te falar uma coisa que eu nunca falei em voz alta em quatro anos."',
    'Ele olha a porta da ponte, que está fechada.',
    '"Eu li esse estatuto inteiro. Uma vez, sozinho, num hotel em Saffron, em duas mil e vinte e três. Cento e quatro páginas."',
    'Ele volta pro radar.',
    '"E eu não achei uma única frase ilegal."'
  ],
  ef:{flag:'o_capitao_leu_o_estatuto',
      registrar:'O capitão leu as 104 páginas do estatuto e não achou uma frase ilegal.',
      presagio:'Nenhuma frase ilegal em cento e quatro páginas. Alguém muito competente escreveu aquilo.'},
  escolhas:[
    {texto:'"Então quem é responsável?"', vai:'c8_quem_e_responsavel'},
    {texto:'"O senhor pode registrar em diário de bordo."', vai:'c8_diario_de_bordo'},
    {texto:'"Me dá cópia do que o senhor comunicou."', vai:'c8_copia_do_capitao'},
    {texto:'"Então tem que mudar a regra."', vai:'c8_mudar_a_regra'}
  ]
},

c8_ameacou_o_capitao:{
  texto:[
    '"Eu vou contar pra imprensa quando descer."',
    'Ele não reage como você esperava.',
    '"Conta."',
    'Ele bebe café.',
    '"E quando o repórter perguntar a sua fonte, você vai dizer que ouviu por um duto de ventilação, e ele vai perguntar se você tem documento, e se você não tiver, sai uma nota de quarenta linhas sobre modernização de frota."',
    d=>d.flags.a_materia_de_quarenta_linhas ? 'Quarenta linhas. É a segunda vez na mesma noite que alguém diz esse número pra você.' : '',
    'Ele põe a caneca na bancada.',
    '"Eu não tô te desencorajando, garoto. Eu tô te dizendo pra subir aqui de novo antes de descer e pedir papel."'
  ],
  ef:{flag:'o_capitao_mandou_pedir_papel'},
  escolhas:[
    {texto:'"Então me dá papel."', vai:'c8_copia_do_capitao'},
    {texto:'"O senhor pode registrar em diário de bordo."', vai:'c8_diario_de_bordo'},
    {texto:'"Então quem é responsável?"', vai:'c8_quem_e_responsavel'},
    {texto:'Descer sem nada.', vai:'c8_fim_navio'}
  ]
},

/* ─────────────── FINS ─────────────── */

c8_fim_navio:{
  texto:[
    'O S.S. Anne atraca em Cinnabar às sete e dez da manhã.',
    'O desembarque leva quarenta minutos e é alegre: gente de chapéu, gente tirando foto da passarela, gente reclamando de mala.',
    'Você desce com o resto e ninguém te olha duas vezes.',
    d=>{
      if (d.flags.tirou_os_dois_do_40 || d.flags.abriu_o_40) return 'Dois adolescentes descem atrás de você, sem mala, com a roupa do corpo, e param no fim da passarela sem saber pra onde ir.';
      if (d.flags.arranjou_a_cama) return 'Denis desce com um papel de carta dobrado no bolso e um endereço em Cinnabar escrito atrás, e uma vaga com registro pra próxima temporada.';
      if (d.flags.o_denis_topou) return 'Você procura o Denis no desembarque e não acha. O camarote 40 desembarcou antes, por uma prancha de serviço, às cinco da manhã.';
      if (d.flags.respeitou_o_denis) return 'Em algum lugar dessa passarela tem um menino de dezessete anos que te pediu pra não abrir a porta, e você não abriu, e você vai carregar isso.';
      return 'Em algum lugar desse navio ficou uma coisa que você viu e não resolveu, e o navio vai zarpar de novo em três dias.';
    },
    d=>d.flags.diario_de_bordo_registrado
      ? 'E numa gaveta da ponte de comando tem um livro de capa dura com uma página escrita à mão, carimbada e assinada, com guarda obrigatória por vinte anos.'
      : 'E nada do que aconteceu a bordo foi escrito em lugar nenhum.',
    'Cinnabar cheira a enxofre. O vulcão está soltando fumaça e a fumaça está vermelha, e fumaça não é vermelha.'
  ],
  fim:true, resumo:'O S.S. Anne: todo mundo paga passagem, e alguns pagam com o que não tinham.'
},

c8_fim_porto:{
  texto:[
    'Você não entra no navio.',
    'Fica em Vermilion e vê o S.S. Anne zarpar às seis da manhã do dia seguinte, e ele é enorme e lento e leva onze minutos pra sair do enquadramento do cais.',
    'Metade da cidade vai ver. É um evento.',
    d=>d.flags.viu_o_conteiner ? 'Você fica pensando no contêiner que passou reto pela balança dois às três e quarenta e dois.' : 'Você fica com a sensação clara de que perdeu alguma coisa e não sabe o quê.',
    d=>d.flags.nome_na_parede_da_fritura ? 'Na fritura do porto, o seu nome continua pregado na parede entre as contas a pagar.' : '',
    'Depois você vai embora de Vermilion por terra, pela Rota 11, e leva quatro dias a mais do que levaria de navio.',
    'Nesses quatro dias você pensa no navio todo dia.'
  ],
  fim:true, resumo:'Vermilion: um navio zarpou com uma coisa dentro, e você ficou no cais.'
}


}}

);
