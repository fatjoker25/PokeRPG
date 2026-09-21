/* ------------------------------------------------------------
   ABERTURAS — Cinnabar é ilha: só se chega de barco, e o barco
   em que você chega decide o que você vê primeiro.
   ------------------------------------------------------------ */
const C14_ABERTURAS = ['c14_ilha', 'c14_ab_a_travessia', 'c14_ab_a_cinza', 'c14_ab_sem_passagem', 'c14_ab_de_cracha'];
function c14_cabe(id, d){
  if (id === 'c14_ab_sem_passagem') return d.jogador.dinheiro < 600 && !d.flags.ryuzo_vai_a_cinnabar;
  if (id === 'c14_ab_de_cracha')    return typeof Cargos !== 'undefined' && Cargos.lista().length >= 1;
  if (id === 'c14_ab_a_travessia')  return !d.flags.ryuzo_vai_a_cinnabar;
  return true;
}
function c14_abertura(d){
  const cand = C14_ABERTURAS.filter(id => c14_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 14 — O CADERNO DE CINNABAR  (Ilha Cinnabar)
   ============================================================ */
CAPITULOS.push(
{
num:14, titulo:'O Caderno de Cinnabar', local:'Ilha Cinnabar', ambiente:'vulcao', nivelArea:36,
tom:'muito sombrio', entradas:C14_ABERTURAS,
inicio: d => c14_abertura(d),
cenas:{

c14_ab_a_travessia:{
  texto:[
    'O ferry de Cinnabar sai de Fuchsia às sete, leva duas horas e quarenta, e tem quatorze passageiros contando você.',
    'Dos treze restantes, onze moram na ilha. Dá pra saber porque eles não olham pro mar.',
    'Os outros dois são um casal de uns sessenta anos com uma mala só e uma cara que você reconhece de Lavender: cara de quem vai visitar alguém que não vai visitar de volta.',
    'Na terceira hora de travessia, um homem da tripulação passa recolhendo o canhoto das passagens e para do seu lado.',
    fala('o tripulante', 'Primeira vez na ilha?'),
    d=>fala(d.jogador.nome, 'Primeira.'),
    fala('o tripulante', 'Duas coisas, então.'),
    'Ele destaca o seu canhoto com a unha do polegar, sem olhar.',
    fala('o tripulante', 'Uma: o cheiro de enxofre passa em três dias. Não é você que acostuma, é o nariz que desiste.'),
    fala('o tripulante', 'Duas: o próximo ferry é sábado.'),
    'E vai embora, porque as duas coisas eram só duas.'
  ],
  ef:{dinheiro:-600, flag:'veio_no_ferry',
      registrar:'Atravessou pro Cinnabar no ferry das sete, com treze outros passageiros.'},
  escolhas:[
    {texto:'Ir falar com o casal da mala.', vai:'c14_ab_o_casal'},
    {texto:'Ficar olhando a ilha crescer no horizonte.', vai:'c14_ab_a_ilha_crescendo'},
    {texto:'Desembarcar e andar pela cidade.', vai:'c14_cidade'}
  ]
},

c14_ab_o_casal:{
  texto:[
    'Você senta no banco de trás deles, que é o único jeito de puxar conversa num ferry sem parecer que você puxou conversa.',
    'A mulher fala primeiro, porque ela estava esperando alguém pra falar.',
    fala('a mulher do ferry', 'A gente vai ver o prédio.'),
    d=>fala(d.jogador.nome, 'Que prédio?'),
    fala('o homem do ferry', 'O laboratório.'),
    'Ele fala isso sem tirar os olhos da água.',
    fala('a mulher do ferry', 'Nosso filho trabalhava lá. Faz doze anos.'),
    fala('a mulher do ferry', 'Ele morreu em oitenta e oito, num acidente que eles chamaram de acidente.'),
    'Ela alisa a alça da mala com as duas mãos, pra frente e pra trás.',
    fala('a mulher do ferry', 'A gente vinha todo ano, no aniversário. Doze anos.'),
    fala('o homem do ferry', 'Esse ano a gente veio porque queimou.', 'baixo'),
    fala('o homem do ferry', 'A gente quer ver com os nossos olhos o que sobrou.')
  ],
  ef:{flag:'o_casal_do_filho',
      npc:{nome:'o casal do ferry', opiniao:1, viuVoce:'Vocês conversaram na travessia para Cinnabar.'},
      registrar:'Um casal atravessa há doze anos pro aniversário da morte do filho, que trabalhava no laboratório.',
      presagio:'Morreu em oitenta e oito, num acidente que "eles chamaram de acidente".'},
  escolhas:[
    {texto:'Perguntar o nome do filho.', vai:'c14_ab_o_nome_do_filho'},
    {texto:'Desembarcar junto com eles e ir ao laboratório.', vai:'c14_lab'},
    {texto:'Desembarcar e andar pela cidade.', vai:'c14_cidade'}
  ]
},

c14_ab_o_nome_do_filho:{
  texto:[
    fala('a mulher do ferry', 'Kaoru. Kaoru Ishida.'),
    'Ela fala o nome inteiro, com sobrenome, do jeito que se fala um nome que ninguém mais fala.',
    fala('a mulher do ferry', 'Ele era bioquímico. Vinte e nove anos.'),
    d=>fala(d.jogador.nome, 'E o que foi o acidente?'),
    'O homem responde dessa vez, e responde rápido demais, o que quer dizer que ele já respondeu muitas vezes.',
    fala('o homem do ferry', 'Exposição a reagente. Foi o que a carta disse.'),
    fala('o homem do ferry', 'Caixão lacrado. Também foi o que a carta disse.'),
    'A mulher olha pra fora da janela e não fala nada.',
    fala('o homem do ferry', 'A gente assinou tudo que mandaram assinar. Na época a gente não tinha cabeça.'),
    fala('o homem do ferry', 'Hoje eu tenho cabeça e não tenho mais nada pra assinar.')
  ],
  ef:{flag:'kaoru_ishida',
      registrar:'Kaoru Ishida, bioquímico, 29 anos, morreu no laboratório de Cinnabar em 1988. Caixão lacrado.',
      presagio:'Caixão lacrado por exposição a reagente é decisão de quem não quer que se veja o corpo.'},
  escolhas:[
    {texto:'Desembarcar e ir direto ao laboratório.', vai:'c14_lab'},
    {texto:'Desembarcar e andar pela cidade.', vai:'c14_cidade'}
  ]
},

c14_ab_a_ilha_crescendo:{
  texto:[
    'Cinnabar aparece como uma mancha e vira uma ilha ao longo de quarenta minutos, e nos quarenta minutos você não faz mais nada.',
    'Primeiro o vulcão, que é a única coisa alta. Depois a linha da costa. Depois as casas, que são poucas e baixas e coloridas.',
    'E, na ponta leste, uma mancha preta na costa que não é rocha vulcânica.',
    'Rocha vulcânica é preta e fosca. Essa mancha tem brilho e tem forma retangular.',
    'Você fica vinte minutos sem entender o que está olhando até o ferry virar o suficiente pra você entender.',
    'É um prédio queimado. De longe, um prédio queimado parece exatamente uma mancha.'
  ],
  ef:{flag:'viu_o_lab_do_mar',
      registrar:'Viu o laboratório queimado da ponta leste ainda do ferry, a quarenta minutos da costa.'},
  escolhas:[
    {texto:'Desembarcar e ir direto ao laboratório.', vai:'c14_lab'},
    {texto:'Desembarcar e andar pela cidade primeiro.', vai:'c14_cidade'},
    {texto:'Ir falar com o casal da mala.', vai:'c14_ab_o_casal'}
  ]
},

c14_ab_sem_passagem:{
  texto:[
    'A passagem do ferry pra Cinnabar custa seiscentos e é a única linha regular, e a bilheteria é uma janelinha de madeira num galpão do porto de Fuchsia.',
    d=>`Você tem ${d.jogador.dinheiro} ₽, e o homem da janelinha olha a sua mão aberta com o dinheiro e não diz nada, porque não é ele que faz o preço.`,
    'Você fica no galpão. Sai o ferry das sete. O galpão esvazia.',
    'Às oito e pouco entra um homem de setenta e quatro anos com um boné de pano desbotado e uma lata de óleo na mão, e ele vai até a janelinha e não compra passagem: ele reclama de alguma coisa sobre taxa de atracação, e reclama com intimidade.',
    d=>d.flags.sabe_do_ryuzo
      ? 'Você já ouviu falar dele numa mesa de dominó. Amos, setenta e quatro anos, barco de doze pés que o pai construiu em cinquenta e três, sai toda quarta de manhã sem rede e sem linha e ninguém pergunta o que ele vai fazer.'
      : 'O homem da janelinha o chama de Amos e o trata como quem trata alguém há quarenta anos.',
    'Quando ele sai, você sai junto.',
    d=>fala(d.jogador.nome, 'O senhor tem barco?'),
    fala('Amos', 'Tenho doze pés e setenta e quatro anos. Que é o que eu tenho.'),
    d=>fala(d.jogador.nome, 'O senhor vai pra Cinnabar?'),
    'Ele para de andar.',
    fala('Amos', 'Por que é que você quer ir pra Cinnabar?')
  ],
  ef:{flag:'conheceu_o_ryuzo',
      npc:{nome:'Amos', opiniao:0, viuVoce:'Você o abordou no porto de Fuchsia pedindo travessia.'},
      registrar:'Não tinha os 600 ₽ do ferry. Abordou Amos, dono de um barco de doze pés.'},
  escolhas:[
    {texto:'Contar a verdade inteira.', vai:'c14_ab_a_verdade_pro_velho'},
    {texto:'Dizer que é a trabalho.', vai:'c14_ab_mentiu_pro_velho'},
    {texto:'Oferecer tudo que você tem.', vai:'c14_ab_ofereceu_tudo'}
  ]
},

c14_ab_a_verdade_pro_velho:{
  texto:[
    'Você conta. Conta o laboratório, conta o que te trouxe até aqui, conta a parte que faz você parecer ingênuo e conta a parte que faz você parecer perigoso.',
    'Leva uns seis minutos. Ele não interrompe e não olha pra você: olha pro mar, com a lata de óleo na mão.',
    'Quando você termina, ele mexe no boné.',
    fala('Amos', 'Cinco horas de combustível.'),
    d=>fala(d.jogador.nome, 'Eu não tenho como pagar cinco horas de combustível.'),
    fala('Amos', 'Eu sei. Eu falei quanto custa, não falei que você vai pagar.'),
    'Ele desce a rampa na direção de um barco azul de doze pés com o motor de popa levantado.',
    fala('Amos', 'Meu filho morreu no mar em noventa e sete e desde noventa e sete eu saio toda quarta e não pesco nada.'),
    d=>fala(d.jogador.nome, 'Pra fazer o quê?'),
    fala('Amos', 'Pra ninguém perguntar.'),
    'Ele destrava o motor de popa e baixa.',
    fala('Amos', 'Você falou seis minutos direto comigo. Isso não acontecia desde noventa e sete.', 'baixo')
  ],
  ef:{flag:'ryuzo_vai_a_cinnabar', moral:2,
      rep:{eixo:'bom', delta:1, motivo:'Contou a verdade inteira pra um desconhecido que podia recusar.'},
      npc:{nome:'Amos', opiniao:4, viuVoce:'Te levou a Cinnabar sem cobrar, por seis minutos de conversa.'},
      registrar:'Amos te levou a Cinnabar num barco de doze pés, sem cobrar.'},
  escolhas:[
    {texto:'Embarcar.', vai:'c14_ilha'}
  ]
},

c14_ab_mentiu_pro_velho:{
  texto:[
    d=>fala(d.jogador.nome, 'É a trabalho.'),
    'Ele te olha por dois segundos inteiros.',
    fala('Amos', 'A trabalho de quem?'),
    'Você não tem a segunda frase. Mentira boa precisa de segunda frase e você só preparou a primeira.',
    fala('Amos', 'Pois é.'),
    'Ele desce a rampa. Na metade do caminho ele para, sem virar:',
    fala('Amos', 'Eu levo você assim mesmo. Só não fala mais nada até a gente chegar.'),
    'A travessia leva cinco horas e vocês não trocam uma palavra, e as cinco horas são muito compridas.'
  ],
  ef:{flag:'ryuzo_vai_a_cinnabar',
      npc:{nome:'Amos', opiniao:0, viuVoce:'Te levou a Cinnabar depois de te pegar numa mentira.'},
      registrar:'Mentiu pro Amos e ele te levou a Cinnabar em silêncio.'},
  escolhas:[
    {texto:'Embarcar.', vai:'c14_ilha'}
  ]
},

c14_ab_ofereceu_tudo:{
  texto:[
    d=>fala(d.jogador.nome, `Eu tenho ${d.jogador.dinheiro}. É tudo. Leva tudo.`),
    'Você estende a mão aberta com as notas e as moedas, e esse gesto é humilhante de um jeito muito específico.',
    'Ele olha a mão. Não pega.',
    fala('Amos', 'Guarda isso.'),
    d=>fala(d.jogador.nome, 'É sério. Pode levar tudo.'),
    fala('Amos', 'Menino, se eu levar tudo o que você tem, você chega numa ilha sem ferry até sábado e sem um tostão.'),
    'Ele empurra a sua mão de volta com as costas da dele.',
    fala('Amos', 'Aí eu não te levei. Eu te abandonei mais longe.'),
    'Ele desce a rampa.',
    fala('Amos', 'Vem. E guarda o dinheiro no bolso de dentro, que lá o vento leva.')
  ],
  ef:{flag:'ryuzo_vai_a_cinnabar', moral:1,
      npc:{nome:'Amos', opiniao:3, viuVoce:'Recusou o seu dinheiro e te levou a Cinnabar mesmo assim.'},
      registrar:'Ofereceu tudo que tinha pela travessia. O velho recusou e levou mesmo assim.'},
  escolhas:[
    {texto:'Embarcar.', vai:'c14_ilha'}
  ]
},

c14_ab_a_cinza:{
  texto:[
    'Está caindo cinza em Cinnabar.',
    'Não é muita: é uma poeira clara, fina, que assenta na calçada preta e deixa ela cinzenta, e que as pessoas da ilha varrem da frente de casa do jeito que se varre folha.',
    'Você desembarca e em quatro minutos tem cinza no ombro da sua roupa.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} espirra duas vezes seguidas e sacode a cabeça, e você limpa a cinza dele com a manga.`
               : 'Você espirra duas vezes seguidas e ninguém repara, porque todo mundo aqui espirra.';
    },
    'Na rua principal, um homem de uns quarenta anos está varrendo a calçada da loja dele e cumprimenta você com a cabeça.',
    d=>fala(d.jogador.nome, 'Isso é normal?'),
    fala('o homem da vassoura', 'É vulcão, meu amigo. Vulcão solta cinza.'),
    d=>fala(d.jogador.nome, 'Mas ele não tá inativo?'),
    'Ele para de varrer.',
    fala('o homem da vassoura', 'Tá.'),
    'E volta a varrer, e não fala mais nada, e continua varrendo depois que você vai embora.'
  ],
  ef:{flag:'esta_caindo_cinza',
      registrar:'Está caindo cinza em Cinnabar. O vulcão consta como inativo.',
      presagio:'Vulcão inativo não solta cinza. Ele parou de varrer quando você perguntou.'},
  escolhas:[
    {texto:'Subir até o vulcão ver de onde vem.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Andar pela cidade e perguntar por aí.', vai:'c14_cidade'},
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'}
  ]
},

c14_ab_de_cracha:{
  texto:[
    'O porto de Cinnabar tem uma rampa só e um posto de capitania com um homem de camisa branca e um livro de bordo aberto.',
    'Ele registra quem entra e quem sai da ilha desde que existe capitania, que é desde mil novecentos e cinquenta e um.',
    d=>{
      const c = Cargos.principal();
      return `Você mostra o crachá de ${c ? c.nome : 'serviço'} porque parece a coisa certa a fazer, e ele vira o livro na sua direção sem você pedir.`;
    },
    fala('o capitão do porto', 'Já que o senhor é do serviço: olha a página de doze dias atrás.'),
    'Doze dias atrás, na coluna de entrada: um barco fretado, quatro pessoas, sem nome de passageiro.',
    'Na coluna de saída, no mesmo dia: o mesmo barco, três pessoas.',
    fala('o capitão do porto', 'Eu anotei quatro na entrada. Eu conto. É o meu trabalho contar.'),
    d=>fala(d.jogador.nome, 'E os três não falaram nada?'),
    fala('o capitão do porto', 'Falaram que eu tinha contado errado.'),
    'Ele fecha o livro com as duas mãos.',
    fala('o capitão do porto', 'Eu faço isso há vinte e dois anos. Eu não conto errado.')
  ],
  ef:{flag:['quatro_entraram_tres_sairam','fugiu_da_visao'],
      npc:{nome:'o capitão do porto', opiniao:2, viuVoce:'Te mostrou o livro de bordo por causa do crachá.'},
      registrar:'Há doze dias um barco fretado entrou em Cinnabar com quatro pessoas e saiu com três.',
      presagio:'Tem uma quarta pessoa nessa ilha que não consta em lugar nenhum. E o laboratório queimou há sete dias.'},
  escolhas:[
    {texto:'Perguntar como era o barco.', vai:'c14_ab_como_era_o_barco'},
    {texto:'Pedir cópia da página.', vai:'c14_ab_a_pagina'},
    {texto:'Ir direto ao laboratório queimado.', vai:'c14_lab'}
  ]
},

c14_ab_como_era_o_barco:{
  texto:[
    fala('o capitão do porto', 'Fretado de Vermilion. Casco branco, quarenta e dois pés, motor de dentro.'),
    'Ele fala isso de cabeça, sem consultar nada, porque barco é o assunto dele.',
    fala('o capitão do porto', 'Barco de empresa. Não é de pescador e não é de turista.'),
    d=>fala(d.jogador.nome, 'Como é que o senhor sabe?'),
    fala('o capitão do porto', 'Pelo jeito que atracaram.'),
    'Ele faz um gesto com a mão, de encostar de lado.',
    fala('o capitão do porto', 'Pescador atraca com a proa. Turista atraca torto e xinga.'),
    fala('o capitão do porto', 'Esses aí atracaram de ré, no primeiro movimento, com alguém de luva na amarra.'),
    fala('o capitão do porto', 'Isso é tripulação paga.')
  ],
  ef:{flag:'barco_fretado_de_vermilion',
      registrar:'O barco que trouxe os quatro era fretado de Vermilion, com tripulação paga.'},
  escolhas:[
    {texto:'Pedir cópia da página do livro.', vai:'c14_ab_a_pagina'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Procurar o barco fretado na ilha.', vai:'c14_barco_fretado'}
  ]
},

c14_ab_a_pagina:{
  texto:[
    fala('o capitão do porto', 'Cópia eu não tiro. O livro não sai daqui e não tem máquina.'),
    'Ele empurra uma folha em branco e uma caneta na sua direção.',
    fala('o capitão do porto', 'Mas você pode copiar à mão, e eu assino embaixo como conferido.'),
    'Você copia a página inteira: data, hora, embarcação, entrada quatro, saída três.',
    'Ele lê o que você escreveu, corrige um horário com a própria caneta, e assina com o nome inteiro e a matrícula.',
    fala('o capitão do porto', 'Pronto. Agora isso não é boato.'),
    d=>fala(d.jogador.nome, 'Por que o senhor tá fazendo isso?'),
    'Ele guarda a caneta no bolso da camisa branca.',
    fala('o capitão do porto', 'Porque eles falaram que eu contei errado.', 'frio')
  ],
  ef:{flag:'copia_do_livro_de_bordo',
      npc:{nome:'o capitão do porto', opiniao:3, viuVoce:'Assinou como conferida a sua cópia manuscrita do livro de bordo.'},
      registrar:'Tem cópia manuscrita e assinada da página do livro de bordo: entraram 4, saíram 3.'},
  escolhas:[
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Procurar o barco fretado na ilha.', vai:'c14_barco_fretado'},
    {texto:'Andar pela cidade.', vai:'c14_cidade'}
  ]
},


c14_ilha:{
  texto:[
    'Cinnabar é uma ilha de nove quilômetros quadrados com um vulcão no meio e um laboratório na beira.',
    'Os dois estão inativos. Os dois estão mentindo.',
    'Setecentos e quarenta habitantes, uma rua principal com calçada de pedra vulcânica preta, um porto de uma única rampa, e um cheiro constante de enxofre que as pessoas daqui não sentem mais e que os visitantes sentem por três dias e depois também não.',
    'O ferry vem duas vezes por semana, terça e sábado.',
    d=>d.flags.ryuzo_vai_a_cinnabar ? 'Você não veio de ferry. Você veio num barco azul de doze pés com um velho de setenta e quatro anos que gastou cinco horas de combustível e não aceitou dinheiro.' :
       'Você veio de ferry, na terça, com quatorze passageiros e uma carga de botijão de gás.',
    d=>{
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) return 'A recepcionista da pousada olha o seu rosto duas vezes, depois olha uma tela, depois sorri de um jeito que não chega aos olhos. "Quarto 12." Você não deu o seu nome.';
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=6) return 'Duas crianças te seguem do porto até a pousada a uma distância constante de dez metros, cochichando. Quando você vira, elas param de andar. Quando você anda, elas andam. Numa ilha de setecentas pessoas, notícia chega antes do barco.';
      return 'Ninguém te nota no porto. O barco vai embora e você fica, e a rampa fica vazia, e você percebe que o próximo é sábado.';
    },
    'E tem uma coisa que você vê da rampa do porto e que não estava em nenhuma informação que você tinha:',
    'o prédio do laboratório queimou.',
    'Não há dois anos. Há uma semana.',
    'A fita de isolamento é nova, o cheiro de queimado ainda está no ar, e tem um buraco na cerca que também é novo.',
    'Alguém entrou antes de você.',
    'E o buraco tem a borda dobrada pra dentro.'
  ],
  ef:{registrar:'Chegou à Ilha Cinnabar. O laboratório queimou há uma semana.',
      presagio:'A borda dobrada pra dentro quer dizer que alguém entrou. Ninguém saiu por ali.'},
  escolhas:[
    {texto:'Perguntar na cidade o que aconteceu.', vai:'c14_cidade'},
    {texto:'Entrar pelo buraco na cerca.', vai:'c14_lab'},
    {texto:'Procurar o ginásio da ilha.', vai:'c14_ginasio'},
    {texto:'Subir o vulcão. Tem fumaça errada saindo dele.', vai:'c14_vulcao'}
  ]
},

c14_cidade:{
  texto:[
    'Ninguém quer falar do laboratório.',
    'Todo mundo fala do laboratório.',
    'Você passa uma tarde na rua principal e colhe seis versões, todas contadas em voz baixa e todas contadas sem você pedir duas vezes:',
    '"Fechou há anos." / "Fechou no papel." / "Tinha gente entrando de madrugada até semana passada."',
    '"Foi curto-circuito." / "Foi curto-circuito uma ova, a luz do prédio tá cortada desde noventa e nove, eu trabalhei na companhia."',
    'E a sexta, dita por um homem no bar, que é a que muda tudo:',
    '"Quem botou fogo foi de fora. Chegou no sábado e foi embora no sábado. Duas pessoas, num barco fretado, que não é barco daqui."',
    '"Como você sabe que não é daqui?"',
    '"Porque barco daqui eu conheço pelo motor, moço. Setecentas pessoas. Eu conheço todos os motores."'
  ],
  ef:{flag:['ouviu_as_versoes','sabe_do_barco_fretado'],
      rep:{eixo:'bom',delta:2,motivo:'Ouviu seis versões antes de acreditar em uma'},
      registrar:'Duas pessoas de fora chegaram e saíram no sábado, em barco fretado, e o laboratório queimou.',
      presagio:'Ele conhece todos os motores. Numa ilha de setecentos, isso é um sistema de segurança.'},
  escolhas:[
    {texto:'Procurar quem trabalhou no laboratório.', vai:'c14_selma'},
    {texto:'Procurar o dono do barco fretado.', vai:'c14_barco_fretado'},
    {texto:'Entrar no laboratório.', vai:'c14_lab'},
    {texto:'Procurar o ginásio.', vai:'c14_ginasio'}
  ]
},

c14_barco_fretado:{
  texto:[
    'O homem do bar te leva até a rampa e aponta uma marca na madeira da defensa.',
    '"Ó. Encostaram aqui e não amarraram direito."',
    'A marca é uma tinta azul raspada na madeira, e ele raspa com a unha e te mostra a lasquinha.',
    '"Isso é tinta de casco de fretado de Vermilion. Aqui a gente usa tinta cinza, que é mais barata e aguenta mais enxofre."',
    '"E tem registro de atracação?"',
    'Ele ri.',
    '"Registro? Moço, aqui não tem capitania. Tem o Sr. Nagai, que anota quem usa o guincho porque ele cobra por uso."',
    'Ele aponta um caderno pendurado num prego na parede do barracão do guincho.',
    'Um caderno espiral, pendurado num prego, com um lápis amarrado num barbante.',
    'Você folheia até sábado passado.',
    '**"sáb 14 — fretado azul — 2 pessoas — 40 min — pagou"**',
    'E embaixo, na mesma linha, na letra do Sr. Nagai:',
    '**"levaram 4 caixa de papelão"**'
  ],
  ef:{flag:['sabe_das_quatro_caixas','provas_cinnabar'],
      rep:{eixo:'bom',delta:4,motivo:'Achou o registro num caderno pendurado num prego'},
      registrar:'No sábado, duas pessoas de fora levaram quatro caixas de papelão de Cinnabar, num fretado de Vermilion.',
      presagio:'Quatro caixas. Você já viu quatro caixas emparedadas num sétimo andar em Saffron.'},
  escolhas:[
    {texto:'"Quantas caixas ficaram?"', vai:'c14_quantas_ficaram'},
    {texto:'Entrar no laboratório.', vai:'c14_lab'},
    {texto:'Procurar quem trabalhou lá.', vai:'c14_selma'},
    {texto:'Procurar o ginásio.', vai:'c14_ginasio'}
  ]
},

c14_quantas_ficaram:{
  texto:[
    '"Quantas caixas ficaram?"',
    'O homem do bar franze a testa.',
    '"Como assim ficaram? Eles levaram quatro."',
    '"Eu sei. Quantas tinha no total?"',
    'E aí o Sr. Nagai, que estava ouvindo encostado no barracão sem participar, fala pela primeira vez.',
    '"Nove."',
    'Os dois olham pra ele.',
    '"Nove", ele repete. "Eu sei porque em noventa e seis eu carreguei as nove no guincho. Quatro foram pro fretado e cinco voltaram pro prédio."',
    '"Em noventa e seis?"',
    '"Em novembro de noventa e seis. Mesma coisa: barco de fora, duas pessoas, quarenta minutos."',
    'Ele cospe.',
    '"E agora voltaram pra buscar as cinco e não acharam, e aí botaram fogo."'
  ],
  ef:{flag:['sabe_das_nove_caixas','sabe_das_cinco'],
      npc:{nome:'Sr. Nagai', opiniao:3, memoria:'Carregou as nove caixas em 1996. Quatro foram embora, cinco voltaram para o prédio.'},
      rep:{eixo:'bom',delta:5,motivo:'Perguntou quantas eram no total'},
      instabilidade:1,
      registrar:'Em 1996 saíram quatro das nove caixas. As cinco restantes não foram achadas no sábado, e o prédio foi incendiado.',
      presagio:'Não acharam as cinco. Quer dizer que alguém em Cinnabar escondeu elas.'},
  escolhas:[
    {texto:'"Quem escondeu as cinco?"', vai:'c14_quem_escondeu'},
    {texto:'Entrar no laboratório.', vai:'c14_lab'},
    {texto:'Procurar quem trabalhou lá.', vai:'c14_selma'},
    {texto:'Procurar o ginásio.', vai:'c14_ginasio'}
  ]
},

c14_quem_escondeu:{
  texto:[
    '"Quem escondeu as cinco?"',
    'Os dois ficam quietos.',
    'E aí o Sr. Nagai fala uma coisa e você percebe que ele já tinha decidido falar isso antes de você chegar na ilha, e que ele está esperando alguém perguntar faz quatro anos:',
    '"Em noventa e seis, quando as cinco voltaram do guincho pro prédio, eu levei elas num carrinho até a porta do subsolo."',
    '"E?"',
    '"E o que abriu a porta pra mim não era da Silph."',
    'Ele ajeita o boné.',
    '"Era o Doutor Blaine."'
  ],
  ef:{flag:['sabe_do_blaine','blaine_tem_as_caixas'],
      rep:{eixo:'bom',delta:5,motivo:'Perguntou quem, e alguém estava esperando quatro anos pra responder'},
      instabilidade:1,
      registrar:'Em 1996, quem recebeu as cinco caixas restantes foi o Blaine, líder do ginásio de Cinnabar.',
      presagio:'O líder de ginásio da ilha guardou cinco caixas de arquivo por quatro anos.'},
  escolhas:[
    {texto:'Ir ao ginásio agora.', vai:'c14_ginasio'},
    {texto:'Entrar no laboratório primeiro.', vai:'c14_lab'},
    {texto:'Procurar quem trabalhou lá.', vai:'c14_selma'},
    {texto:'Subir o vulcão primeiro.', vai:'c14_vulcao'}
  ]
},

c14_selma:{
  texto:[
    'Ela se chama Sra. Maeda, tem setenta e um anos, e trabalhou na limpeza do laboratório de mil novecentos e setenta e nove a mil novecentos e noventa e sete.',
    'Dezoito anos.',
    'Ela te recebe no portão e não abre o portão, e você conversa com ela por cima de um muro de meio metro, e ela aceita o café que você compra na padaria da esquina e bebe em pé.',
    'E fala, depois de aceitar o café e antes de se arrepender:',
    '"Tinha um tanque."',
    '"Grande, do tamanho de um carro, no subsolo, na sala que a gente não limpava."',
    '"Por que não limpavam?"',
    '"Porque não podia. A gente limpava até a porta e parava. Tinha uma linha de fita amarela no chão e a gente parava na fita."',
    'Ela bebe o café.',
    '"E o que tava dentro cresceu rápido demais pro tanque."',
    '"E aí?"',
    '"E aí um dia não tinha mais tanque, não tinha mais teto, e não tinha mais o Doutor Fuji."'
  ],
  ef:{flag:'ouviu_historia_lab',
      npc:{nome:'Sra. Maeda', opiniao:2, memoria:'Limpou o laboratório de Cinnabar por dezoito anos, até a linha de fita amarela no chão.'},
      registrar:'Havia um tanque no subsolo do laboratório. O que estava dentro cresceu demais para ele.',
      presagio:'Ela limpava até a fita e parava. Dezoito anos parando na fita.'},
  escolhas:[
    {texto:'"O senhor Fuji morreu?"', vai:'c14_fuji_morreu'},
    {texto:'"Você chegou a ver o que tinha no tanque?"', vai:'c14_viu_o_tanque'},
    {texto:'"E o incêndio de semana passada?"', vai:'c14_incendio_da_semana'},
    {texto:'Agradecer e entrar no laboratório.', vai:'c14_lab'}
  ]
},

c14_fuji_morreu:{
  texto:[
    '"O senhor Fuji morreu?"',
    'Ela demora.',
    '"Não sei."',
    '"Como assim não sabe?"',
    '"Não teve enterro."',
    'Ela põe a xícara no muro.',
    '"Numa ilha de setecentas pessoas, meu bem, todo mundo vai em todo enterro. É a coisa que a gente faz aqui. Morreu, vai todo mundo, e depois tem café na casa da família."',
    '"O Doutor Fuji trabalhou nessa ilha vinte e dois anos e não teve enterro, não teve missa de sétimo dia, não teve nada."',
    '"E a casa dele?"',
    '"A casa dele tá lá. Fechada. O IPTU tá pago."',
    'Ela olha pra você.',
    '"Tem gente que paga o IPTU dele. E não sou eu, e não é a prefeitura."'
  ],
  ef:{flag:['sabe_do_iptu','fuji_sem_enterro'],
      rep:{eixo:'bom',delta:4,motivo:'Perguntou pelo enterro'},
      npc:{nome:'Sra. Maeda', opiniao:5, memoria:'Te contou que o Dr. Fuji não teve enterro e que alguém paga o IPTU da casa dele.'},
      registrar:'O Dr. Fuji não teve enterro. Alguém paga o IPTU da casa dele até hoje.',
      presagio:'Numa ilha de setecentas pessoas todo mundo vai em todo enterro. Menos nesse.'},
  escolhas:[
    {texto:'"Onde é a casa dele?"', vai:'c14_casa_do_fuji'},
    {texto:'"Quem paga o IPTU?"', vai:'c14_quem_paga'},
    {texto:'"E o incêndio de semana passada?"', vai:'c14_incendio_da_semana'},
    {texto:'Ir ao laboratório.', vai:'c14_lab'}
  ]
},

c14_quem_paga:{
  texto:[
    '"Quem paga o IPTU?"',
    '"Vai na prefeitura e pergunta, meu bem. É público."',
    'A prefeitura de Cinnabar tem duas salas e funciona das oito às catorze.',
    'A funcionária do setor de tributos consulta a inscrição imobiliária, anota num papelzinho e vira o monitor pra você, porque ela não vê problema nenhum nisso e porque de fato não tem problema nenhum nisso.',
    '**INSCRIÇÃO 2.117 — TITULAR: FUJI, A. — SITUAÇÃO: EM DIA — PAGAMENTO: DÉBITO AUTOMÁTICO — TITULAR DA CONTA: B. OYAMA**',
    '"B. Oyama?"',
    'Ela ri.',
    '"Ah, esse é o Doutor Blaine. Blaine é como ele se chama no ginásio. O nome dele é Bruno Oyama e ele é o cara mais chato da ilha na fila do banco."'
  ],
  ef:{flag:['blaine_paga_o_iptu','sabe_do_blaine'],
      rep:{eixo:'bom',delta:4,motivo:'Foi na prefeitura e perguntou'},
      registrar:'Blaine paga, por débito automático, o IPTU da casa do Dr. Fuji há anos.',
      presagio:'Ele paga há anos. Ninguém paga IPTU de morto por acaso.'},
  escolhas:[
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'},
    {texto:'Ir à casa do Fuji.', vai:'c14_casa_do_fuji'},
    {texto:'Ir ao laboratório.', vai:'c14_lab'},
    {texto:'Voltar e perguntar mais pra Sra. Maeda.', vai:'c14_selma'}
  ]
},

c14_casa_do_fuji:{
  texto:[
    'A casa do Dr. Fuji fica no fim da rua de trás, encostada na encosta do vulcão, e é uma casa de madeira com telhado de zinco e um portão de ferro trabalhado que alguém pintou recentemente.',
    'Recentemente.',
    'Uma casa fechada há quatro anos com o portão pintado, o jardim aparado e a caixa de correio vazia.',
    'Vazia. Não cheia: vazia.',
    'Alguém recolhe a correspondência.',
    'A porta está trancada. A janela da cozinha, não — ela está encostada, com o trinco quebrado, e o trinco foi quebrado faz muito tempo porque a madeira já escureceu no lugar da quebra.',
    'E na varanda, ao lado da porta, tem uma cadeira de balanço com uma almofada.',
    'A almofada está achatada no meio.'
  ],
  ef:{flag:['achou_a_casa','casa_cuidada'],
      rep:{eixo:'bom',delta:2,motivo:'Foi olhar a casa em vez de acreditar na versão'},
      registrar:'A casa do Dr. Fuji está fechada há quatro anos, com o jardim aparado e a correspondência recolhida.',
      presagio:'A almofada está achatada no meio. Alguém senta ali com frequência.'},
  escolhas:[
    {texto:'Entrar pela janela da cozinha.', vai:'c14_dentro_da_casa'},
    {texto:'Esperar na rua pra ver quem vem.', vai:'c14_esperou_na_casa'},
    {texto:'Não entrar. Ir ao ginásio perguntar.', vai:'c14_ginasio'},
    {texto:'Ir ao laboratório.', vai:'c14_lab'}
  ]
},

c14_esperou_na_casa:{
  texto:[
    'Você espera do outro lado da rua, encostado num muro, por seis horas e vinte.',
    'Às dezoito e quarenta chega um homem de uns setenta anos, de bermuda, com uma sacola de pão e uma garrafa térmica.',
    'Ele abre o portão com chave própria, senta na cadeira de balanço, serve café numa xícara que estava ali em cima, e come pão.',
    'Não entra na casa.',
    'Fica na varanda uma hora e dez, olhando a rua, sozinho, com a luz apagada.',
    'Depois lava a xícara numa torneira de jardim, deixa ela virada no mesmo lugar, tranca o portão e vai embora.',
    'Ele faz isso todo dia.',
    'Você entende que ele faz isso todo dia pelo jeito que ele faz: sem pensar em nada, com o corpo já sabendo onde pôr a xícara.'
  ],
  ef:{flag:['viu_o_blaine_na_varanda','sabe_do_blaine'],
      rep:{eixo:'bom',delta:4,motivo:'Esperou seis horas e vinte para ver quem vinha'},
      moral:-5,
      registrar:'Um homem de setenta anos vai todo dia à varanda da casa do Dr. Fuji, come pão e vai embora.',
      presagio:'Ele não entra. Ele só senta na varanda.'},
  escolhas:[
    {texto:'Abordar ele ali mesmo.', vai:'c14_blaine_na_varanda'},
    {texto:'Segui-lo.', vai:'c14_ginasio'},
    {texto:'Entrar pela janela depois que ele sair.', vai:'c14_dentro_da_casa'},
    {texto:'Voltar amanhã e esperar de novo.', vai:'c14_blaine_na_varanda'}
  ]
},

c14_blaine_na_varanda:{
  texto:[
    'Você atravessa a rua e para na calçada, do lado de fora do portão.',
    'Ele te vê chegar e não se assusta e não levanta.',
    'Serve café na xícara que estava virada e estende por cima do portão.',
    '"Senta. Tem outra cadeira lá dentro, mas eu não entro na casa."',
    'Você entra, pega a cadeira da varanda que é a única, e ele fica de pé encostado na coluna.',
    '"Você é o que tá perguntando de caixa no porto."',
    '"Sou."',
    '"Setecentas pessoas, meu filho."',
    'Ele bebe o café.',
    '"Eu sou o Bruno. No ginásio me chamam de Blaine porque o nome do meu avô era Blaine e eu achei bonito aos vinte e dois anos, e agora eu tenho setenta e dois e tô preso com ele."',
    'Ele olha a porta fechada da casa.',
    '"E o Amauri era meu amigo desde sessenta e nove."'
  ],
  ef:{flag:['conheceu_blaine','sabe_do_blaine'],
      npc:{nome:'Blaine', opiniao:2, memoria:'Te serviu café na varanda da casa do amigo dele e disse que não entra na casa.'},
      rep:{eixo:'bom',delta:3,motivo:'Atravessou a rua em vez de continuar olhando'},
      registrar:'Blaine, líder de Cinnabar, era amigo do Dr. Fuji desde 1969 e vai à varanda dele todo dia.',
      presagio:'"Eu não entro na casa." Ele tem a chave e não entra.'},
  escolhas:[
    {texto:'"Por que você não entra na casa?"', vai:'c14_porque_nao_entra'},
    {texto:'"Onde estão as cinco caixas?"', vai:'c14_as_cinco_caixas', cond:d=>!!d.flags.sabe_das_cinco || !!d.flags.blaine_tem_as_caixas},
    {texto:'"O que aconteceu com o Fuji?"', vai:'c14_o_que_aconteceu_com_fuji'},
    {texto:'"Eu vi o andar onze da Silph."', vai:'c14_falou_do_onze', cond:d=>!!d.flags.viu_os_doze || !!d.flags.sabe_do_andar_11}
  ]
},

c14_porque_nao_entra:{
  texto:[
    '"Por que você não entra na casa?"',
    'Ele demora tanto que você acha que não vai responder.',
    '"Porque tá tudo do jeito que ele deixou."',
    '"E isso é ruim?"',
    '"Isso é o contrário de ruim, e por isso é pior."',
    'Ele encosta a testa na coluna da varanda por um segundo e desencosta.',
    '"Tem uma xícara de café na pia dele desde novembro de noventa e seis, meu filho. Com café dentro. Virou uma pedra preta."',
    '"E eu não lavo. E eu não deixo ninguém lavar. E eu pago o IPTU pra prefeitura não tomar e vender."',
    '"Faz quatro anos."',
    'Ele termina o café.',
    '"E eu sei exatamente o que isso é, tá? Eu tenho setenta e dois anos e eu não sou bobo. Isso é eu não aceitar."',
    '"E eu vou continuar não aceitando, porque a alternativa é aceitar, e eu não quero."'
  ],
  ef:{flag:'blaine_falou_da_casa',
      npc:{nome:'Blaine', opiniao:5, memoria:'Te explicou por que não entra na casa e por que paga o IPTU há quatro anos.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou e ouviu a resposta inteira'},
      moral:-5,
      registrar:'Blaine mantém a casa do Fuji intacta desde novembro de 1996.',
      presagio:'Novembro de noventa e seis. A mesma data das quatro caixas, do caderno 7 e da porta tapada em Saffron.'},
  escolhas:[
    {texto:'"O que aconteceu em novembro de noventa e seis?"', vai:'c14_o_que_aconteceu_com_fuji'},
    {texto:'"Onde estão as cinco caixas?"', vai:'c14_as_cinco_caixas'},
    {texto:'"Eu vi o andar onze da Silph."', vai:'c14_falou_do_onze', cond:d=>!!d.flags.viu_os_doze || !!d.flags.sabe_do_andar_11},
    {texto:'"Me deixa entrar na casa."', vai:'c14_deixa_entrar'}
  ]
},

c14_o_que_aconteceu_com_fuji:{
  texto:[
    '"O que aconteceu com o Fuji?"',
    'Blaine senta no degrau da varanda, porque a única cadeira é sua e ele não vai te pedir pra levantar.',
    '"Em novembro de noventa e seis ele disse não."',
    '"Não pra quê?"',
    '"Pra continuar."',
    'Ele apoia os cotovelos nos joelhos.',
    '"Ele trabalhou duzentos e quarenta e um dias com aquilo. Duzentos e quarenta e um dias conversando, todo dia, anotando tudo num caderno."',
    '"E no dia duzentos e quarenta e um ele foi numa reunião e disse não, e disse que o resultado do experimento era que existia alguém ali e que o experimento acabava."',
    '"E eles tiraram ele do projeto na hora, na reunião, no mesmo dia."',
    'Ele olha a rua.',
    '"E três dias depois teve o incidente. O tanque, o teto, tudo."',
    '"E ele?"',
    '"Ele estava lá dentro."',
    'Silêncio comprido.',
    '"E aí é a parte que eu não conto pra ninguém há quatro anos, meu filho, e eu vou contar porque você perguntou do enterro e ninguém pergunta do enterro."',
    '"Não acharam corpo."'
  ],
  ef:{flag:['sabe_do_nao','nao_acharam_corpo'],
      npc:{nome:'Blaine', opiniao:7, memoria:'Te contou que o Fuji disse não no dia 241 e que não acharam corpo.'},
      rep:{eixo:'bom',delta:5,motivo:'Perguntou do enterro, que é o que ninguém pergunta'},
      instabilidade:1, moral:-10,
      registrar:'O Dr. Fuji foi retirado do projeto no dia 241 e desapareceu no incidente. Não acharam corpo.',
      presagio:'Não acharam corpo. Guarde as duas palavras separadas.'},
  escolhas:[
    {texto:'"Você acha que ele tá vivo?"', vai:'c14_esta_vivo'},
    {texto:'"Onde estão as cinco caixas?"', vai:'c14_as_cinco_caixas'},
    {texto:'"Eu vi o andar onze da Silph."', vai:'c14_falou_do_onze', cond:d=>!!d.flags.viu_os_doze || !!d.flags.sabe_do_andar_11},
    {texto:'"Me deixa entrar na casa."', vai:'c14_deixa_entrar'}
  ]
},

c14_esta_vivo:{
  texto:[
    '"Você acha que ele tá vivo?"',
    '"Não."',
    'Sem hesitação.',
    '"Eu acho que ele morreu no dia doze de novembro de noventa e seis num subsolo de um prédio a oitocentos metros daqui."',
    '"Então por que a casa?"',
    'Ele olha a xícara vazia.',
    '"Porque “não acharam corpo” é uma frase que não deixa a gente terminar."',
    '"Eu sei que ele morreu. Eu sei com a cabeça. Eu tenho setenta e dois anos e eu enterrei minha mulher e meus dois irmãos e eu sei muito bem como é."',
    '"Mas enterro não é pro morto, meu filho. Enterro é pra gente poder parar."',
    'Ele levanta com dificuldade.',
    '"E eu não tive."',
    'Ele pega a xícara e vai lavar na torneira do jardim, e vira ela no mesmo lugar de sempre.'
  ],
  ef:{flag:'blaine_sem_enterro',
      npc:{nome:'Blaine', opiniao:8, memoria:'Disse que enterro não é para o morto, é para a gente poder parar.'},
      rep:{eixo:'bom',delta:3,motivo:'Deixou um velho terminar o raciocínio'},
      moral:-8,
      registrar:'"Enterro não é pro morto. Enterro é pra gente poder parar."',
      presagio:'Ele precisa de um enterro. Guarde isso — você vai poder dar um.'},
  escolhas:[
    {texto:'"Onde estão as cinco caixas?"', vai:'c14_as_cinco_caixas'},
    {texto:'"Eu vi o andar onze da Silph."', vai:'c14_falou_do_onze', cond:d=>!!d.flags.viu_os_doze || !!d.flags.sabe_do_andar_11},
    {texto:'"Me deixa entrar na casa."', vai:'c14_deixa_entrar'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_ginasio'}
  ]
},

/* ─────────────── AS CINCO CAIXAS ─────────────── */

c14_falou_do_onze:{
  texto:[
    '"Eu vi o andar onze da Silph."',
    'Blaine não se mexe.',
    '"Como é que é?"',
    'Você conta. Os doze tanques. Os onze ocupados. O décimo segundo vazio com a plaqueta MATRIZ — VAGO. O quadro branco com a linha do tempo. As três séries. A frase em caneta preta:',
    '"O DR. FUJI CONVERSOU COM ELE POR 241 DIAS. NÓS NÃO TEMOS 241 DIAS."',
    'E o rabisco do canto, escrito e apagado três vezes: "eles não falam porque ninguém pergunta".',
    'Blaine senta no chão da varanda. Não no degrau: no chão, com as costas na parede da casa, e ele tem setenta e dois anos e leva um tempo pra sentar.',
    '"Eles continuaram."',
    '"Continuaram."',
    '"Com o material que saiu daqui em noventa e seis, nas quatro caixas."',
    '"É."',
    'Ele passa as duas mãos no rosto.',
    '"Eu deixei sair quatro."',
    '"Você não deixou nada. Você escondeu cinco."',
    '"Eu escondi cinco e deixei sair quatro."',
    'Ele olha a porta fechada da casa.',
    '"Quatro anos eu me disse que eu tinha salvado cinco."'
  ],
  ef:{flag:['blaine_sabe_do_onze','blaine_quebrado'],
      npc:{nome:'Blaine', opiniao:6, memoria:'Descobriu com você que a Silph continuou o projeto com as quatro caixas que saíram em 1996.'},
      rep:{eixo:'bom',delta:4,motivo:'Contou a um velho a coisa que ele passou quatro anos sem saber'},
      moral:-10, instabilidade:1,
      registrar:'Blaine soube que a Silph continuou o projeto com o material das quatro caixas.',
      presagio:'"Eu escondi cinco e deixei sair quatro." Ele nunca tinha somado desse jeito.'},
  escolhas:[
    {texto:'"Então me mostra as cinco."', vai:'c14_as_cinco_caixas'},
    {texto:'"A gente pode parar isso."', vai:'c14_pode_parar'},
    {texto:'"Não é culpa sua."', vai:'c14_nao_e_culpa'},
    {texto:'"O que tem nas cinco?"', vai:'c14_as_cinco_caixas'}
  ]
},

c14_nao_e_culpa:{
  texto:[
    '"Não é culpa sua."',
    'Ele levanta a mão sem levantar a cabeça.',
    '"Não faz isso."',
    '"Fazer o quê?"',
    '"Isso aí. Eu tenho setenta e dois anos e eu já ouvi isso de sete pessoas diferentes e nenhuma das sete estava tentando me ajudar, todas as sete estavam tentando encerrar o assunto porque assunto assim é chato de ouvir."',
    'Ele finalmente olha pra você.',
    '"E você não tá tentando encerrar. Eu sei. Mas essa frase encerra igual."',
    'Pausa.',
    '"Se você quiser me ajudar de verdade, me pergunta o que tem nas caixas."',
    '"Por quê?"',
    '"Porque faz quatro anos que ninguém me pergunta o que tem nas caixas."'
  ],
  ef:{flag:'blaine_te_ensinou',
      npc:{nome:'Blaine', opiniao:6, memoria:'Te ensinou que "não é culpa sua" encerra o assunto, e pediu que você perguntasse das caixas.'},
      rep:{eixo:'bom',delta:2,motivo:'Aceitou ser corrigido'},
      presagio:'"Essa frase encerra igual." Guarde. Você vai querer usar ela em alguém.'},
  escolhas:[
    {texto:'"O que tem nas caixas?"', vai:'c14_as_cinco_caixas'},
    {texto:'"A gente pode parar isso."', vai:'c14_pode_parar'},
    {texto:'"Me deixa entrar na casa."', vai:'c14_deixa_entrar'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_ginasio'}
  ]
},

c14_as_cinco_caixas:{
  texto:[
    '"O que tem nas cinco caixas?"',
    'Ele demora tanto que a rua escurece.',
    '"Caderno."',
    'Ele se levanta com dificuldade, apoiando na coluna.',
    '"Nove caixas de arquivo, todas com caderno. O Amauri escrevia tudo à mão e numerava a lombada. Ele tinha quarenta e um cadernos de vinte e dois anos de trabalho nessa ilha."',
    '"E as quatro que saíram?"',
    '"Levaram os cadernos do projeto. Um ao nove, mais oito e nove que são de resultado."',
    '"E as cinco?"',
    'Ele pega as chaves do bolso.',
    '"As cinco tinham o resto."',
    'Ele começa a andar na direção do vulcão, e você vai atrás, e ele fala andando, sem olhar pra trás:',
    '"Dia a dia de laboratório, controle de estoque, protocolo de esterilização, coisa que ninguém quer."',
    '"E o caderno sete."'
  ],
  ef:{flag:['sabe_do_caderno_sete','blaine_vai_mostrar'],
      npc:{nome:'Blaine', opiniao:7, memoria:'Está levando você até onde escondeu as cinco caixas.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou o que tinha nas caixas'},
      registrar:'As cinco caixas escondidas por Blaine contêm o caderno 7 do Dr. Fuji.',
      presagio:'O caderno sete. O que foi retirado para "análise jurídica" em Saffron e nunca devolvido.'},
  escolhas:[
    {texto:'Ir com ele.', vai:'c14_ginasio_por_dentro'},
    {texto:'"Espera. O sete não foi retirado pela Silph em noventa e seis?"', vai:'c14_o_sete_falso'},
    {texto:'Ir com ele em silêncio.', vai:'c14_ginasio_por_dentro'},
    {texto:'"Por que você nunca leu pra ninguém?"', vai:'c14_nunca_leu'}
  ]
},

c14_o_sete_falso:{
  texto:[
    '"Espera. Em Saffron tem um formulário de retirada do caderno sete, de quatro de novembro de noventa e seis, pra análise jurídica."',
    'Blaine para de andar no meio da rua.',
    'E ri.',
    'Ele ri alto, na rua principal de Cinnabar, às sete da noite, e duas pessoas na calçada olham.',
    '"Eles levaram o sete?"',
    '"Levaram um caderno com sete escrito na lombada."',
    'Ele continua andando, e agora está andando mais rápido.',
    '"Meu filho, o Amauri era o cara mais organizado que eu conheci na vida e o mais desconfiado depois de outubro de noventa e seis."',
    '"Ele trocou as lombadas."',
    '"Ele o quê?"',
    '"Ele passou uma tarde inteira trocando etiqueta de lombada em quarenta e um cadernos, em outubro, três semanas antes."',
    '"Eu vi ele fazendo. Eu perguntei se ele tava ficando maluco."',
    'Ele para na porta do ginásio e procura a chave certa no molho.',
    '"O que a Silph levou como sete é o inventário de material de limpeza de mil novecentos e oitenta e dois."'
  ],
  ef:{flag:['sabe_da_troca','caderno_sete_e_falso'],
      npc:{nome:'Blaine', opiniao:8, memoria:'Descobriu, rindo na rua, que o caderno 7 que a Silph guardou há quatro anos é falso.'},
      rep:{eixo:'bom',delta:6,motivo:'Ligou o formulário de Saffron ao homem que viu o Fuji trocar as lombadas'},
      moral:15,
      registrar:'O Dr. Fuji trocou as etiquetas de lombada dos 41 cadernos em outubro de 1996. O caderno 7 da Silph é falso.',
      presagio:'Uma tarde trocando etiqueta. Foi essa a defesa dele e funcionou por quatro anos.'},
  escolhas:[
    {texto:'Entrar no ginásio com ele.', vai:'c14_ginasio_por_dentro'},
    {texto:'"Então onde está o sete de verdade?"', vai:'c14_ginasio_por_dentro'},
    {texto:'"Por que você nunca leu pra ninguém?"', vai:'c14_nunca_leu'},
    {texto:'Entrar em silêncio.', vai:'c14_ginasio_por_dentro'}
  ]
},

c14_nunca_leu:{
  texto:[
    '"Por que você nunca leu pra ninguém?"',
    'Ele para com a chave na fechadura.',
    '"Eu li."',
    '"Pra quem?"',
    '"Pra mim."',
    'Ele gira a chave e não abre.',
    '"Eu li os quarenta e um cadernos, do um ao quarenta e um, em ordem, em noventa e sete. Levou sete meses."',
    '"E depois?"',
    '"E depois eu botei tudo numa sala com porta de aço e não abri mais."',
    '"Por quê?"',
    'Ele empurra a porta.',
    '"Porque o que tem no sete não é prova de crime, meu filho. É prova de amizade."',
    '"E eu não sei o que fazer com prova de amizade, e faz quatro anos que eu não sei, e você é a primeira pessoa que aparece nessa ilha perguntando do enterro em vez de perguntar do tanque."'
  ],
  ef:{flag:'blaine_leu_tudo',
      npc:{nome:'Blaine', opiniao:9, memoria:'Leu os 41 cadernos em ordem, em sete meses, e nunca mostrou a ninguém.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou por que ele nunca leu pra ninguém'},
      moral:-5,
      registrar:'Blaine leu os 41 cadernos em 1997 e nunca mostrou a ninguém.',
      presagio:'"Prova de amizade." Ele não sabe o que fazer com isso. Você vai ter que saber.'},
  escolhas:[{texto:'Entrar.', vai:'c14_ginasio_por_dentro'}]
},

c14_pode_parar:{
  texto:[
    '"A gente pode parar isso."',
    '"Como?"',
    'Você conta o que tem: as fotos, as planilhas, os nomes, o que a Dra. Sonoda disse, a data do encerramento, a Dra. Cordell.',
    'Ele ouve inteiro.',
    '"Isso é bom."',
    '"Mas?"',
    '"Mas isso tudo é sobre o que eles fizeram."',
    'Ele olha a porta fechada da casa do amigo.',
    '"E o que derruba o projeto não é o que eles fizeram. É o que eles não podem ter feito."',
    '"Não entendi."',
    '"O material de Cinnabar era de um instituto público. Federal. A propriedade nunca foi da Silph, meu filho, a Silph tinha contrato de pesquisa."',
    '"E contrato de pesquisa de material biológico de instituto federal tem uma cláusula que eu li quarenta vezes em noventa e sete porque eu sou chato e advogado de ilha não faz nada."',
    '"Que cláusula?"',
    '"Devolução integral do acervo em caso de encerramento do vínculo."',
    'Ele bate na chave no bolso.',
    '"E o vínculo foi encerrado em novembro de noventa e seis, quando o instituto foi extinto por decreto."',
    '"E o acervo?"',
    '"O acervo tá na minha sala há quatro anos."'
  ],
  ef:{flag:['sabe_da_clausula','provas_cinnabar'],
      npc:{nome:'Blaine', opiniao:8, memoria:'Leu o contrato quarenta vezes em 1997 e sabe a cláusula de devolução integral do acervo.'},
      rep:{eixo:'bom',delta:6,motivo:'Achou a alavanca jurídica de tudo'},
      instabilidade:1,
      registrar:'O material de Cinnabar é de instituto federal extinto; a Silph deveria ter devolvido o acervo integral em 1996.',
      presagio:'Devolução integral. As quatro caixas que a Silph tem são posse ilegal desde noventa e seis.'},
  escolhas:[
    {texto:'"Então me mostra o acervo."', vai:'c14_ginasio_por_dentro'},
    {texto:'"Por que você não denunciou?"', vai:'c14_nunca_leu'},
    {texto:'"O que tem nas cinco caixas?"', vai:'c14_as_cinco_caixas'},
    {texto:'"Vamos ligar pra Dra. Cordell agora."', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c14_deixa_entrar:{
  texto:[
    '"Me deixa entrar na casa."',
    'Ele olha pra você por muito tempo.',
    'Depois tira a chave do bolso, gira na fechadura, e não abre a porta.',
    '"Abre você."',
    'Ele senta na cadeira de balanço e fica olhando a rua.',
    'Você abre.',
    'Dentro é o dia doze de novembro de mil novecentos e noventa e seis, preservado por acidente e por teimosia.',
    'Uma xícara de café na pia que virou um disco preto duro. Um jornal dobrado na mesa. Um par de óculos em cima do jornal, na página aberta, como quem ia voltar.',
    'Um casaco fino no encosto da cadeira.',
    'E na parede da sala, seis fotos: cinco de gente e uma que não é de gente.',
    'A que não é de gente é uma foto Polaroid, tremida, mal enquadrada, de alguma coisa de pé dentro de um tanque, com as duas mãos encostadas no vidro por dentro.',
    'E embaixo da Polaroid, colada na parede com fita, uma folha de caderno com quatro palavras na letra do Fuji:',
    '**"o que eu fiz"**'
  ],
  ef:{flag:['entrou_na_casa_do_fuji','viu_a_polaroid'],
      rep:{eixo:'bom',delta:3,motivo:'Entrou numa casa que um velho não conseguia abrir'},
      moral:-15, instabilidade:1,
      npc:{nome:'Blaine', opiniao:7, memoria:'Destrancou a porta e deixou você abrir, e ficou na cadeira de balanço olhando a rua.'},
      registrar:'Na casa do Fuji há uma Polaroid de Mewtwo no tanque com a legenda "o que eu fiz".',
      presagio:'As duas mãos encostadas no vidro por dentro. Ele fotografou isso e pendurou na sala de casa.'},
  escolhas:[
    {texto:'Chamar o Blaine pra entrar.', vai:'c14_blaine_entrou'},
    {texto:'Pegar a Polaroid.', vai:'c14_pegou_a_polaroid'},
    {texto:'Sair sem tocar em nada.', vai:'c14_saiu_da_casa'},
    {texto:'Ler o jornal aberto na mesa.', vai:'c14_o_jornal'}
  ]
},

c14_o_jornal:{
  texto:[
    'O jornal está aberto na página seis, com os óculos em cima.',
    'É a página de classificados e obituário, e o óculos está pousado exatamente em cima de uma coluna.',
    'A coluna é de classificados de emprego.',
    'E uma das linhas está circulada a caneta:',
    '**"PROFESSOR — Ensino fundamental, Ilha Cinnabar. Ciências. 20h semanais. Contato na Secretaria de Educação."**',
    'Você olha a data do jornal.',
    'Onze de novembro de mil novecentos e noventa e seis.',
    'Um dia antes.',
    'O homem que disse não numa reunião e que ia morrer no dia seguinte tinha circulado a caneta uma vaga de professor de ciências do fundamental de uma escola de ilha, vinte horas semanais.',
    'Ele ia dar aula.'
  ],
  ef:{flag:['viu_o_classificado'],
      rep:{eixo:'bom',delta:3,motivo:'Olhou o que os óculos estavam apontando'},
      moral:-15,
      registrar:'No jornal aberto na casa do Fuji, de 11/11/1996, está circulada uma vaga de professor de ciências.',
      presagio:'Ele ia dar aula. Guarde. Isso é o que Blaine precisa saber.'},
  escolhas:[
    {texto:'Chamar o Blaine pra ver.', vai:'c14_blaine_entrou'},
    {texto:'Levar o jornal.', vai:'c14_levou_o_jornal'},
    {texto:'Pegar a Polaroid.', vai:'c14_pegou_a_polaroid'},
    {texto:'Sair sem tocar em nada.', vai:'c14_saiu_da_casa'}
  ]
},

c14_blaine_entrou:{
  texto:[
    '"Bruno. Vem cá."',
    'Ele não vem.',
    'Você chama de novo e ele não vem, e aí você faz a única coisa que resta, que é sair, pegar ele pelo braço e puxar, e ele resiste dois passos e depois deixa.',
    'Ele entra na casa pela primeira vez em quatro anos.',
    'E fica parado na porta da sala uns quarenta segundos com a mão na parede.',
    d=>d.flags.viu_o_classificado ? 'Você mostra o jornal e o óculos em cima e a linha circulada a caneta.\nEle lê. Lê de novo.\n"Professor de ciências."\nEle senta no sofá, que levanta pó.\n"Ele ia dar aula pros meninos daqui."\nEle põe a mão na boca.\n"Ele ia ficar."' :
       'Ele olha a xícara na pia, o casaco no encosto, os óculos no jornal.\n"Eu achei que ia ser pior."\nPausa.\n"É pior."',
    'Vocês ficam ali um tempo comprido.',
    'Depois ele levanta, vai até a pia, e lava a xícara.',
    'Leva quatro minutos porque o café virou pedra, e ele esfrega com a unha, e ele chora fazendo isso e não para de esfregar.',
    'Quando termina, ele põe a xícara virada no escorredor.',
    '"Pronto."'
  ],
  ef:{flag:['blaine_entrou_na_casa','blaine_lavou_a_xicara'],
      npc:{nome:'Blaine', opiniao:10, memoria:'Entrou na casa do amigo pela primeira vez em quatro anos e lavou a xícara.'},
      rep:{eixo:'bom',delta:6,motivo:'Puxou um velho pelo braço para dentro de uma casa'},
      moral:25,
      registrar:'Blaine entrou na casa do Fuji e lavou a xícara que estava na pia desde 1996.',
      presagio:'"Pronto." Foi esse o enterro dele.'},
  escolhas:[
    {texto:'"Agora me mostra as caixas."', vai:'c14_ginasio_por_dentro'},
    {texto:'Ajudar a arrumar a casa.', vai:'c14_arrumou_a_casa'},
    {texto:'Ficar em silêncio com ele.', vai:'c14_arrumou_a_casa'},
    {texto:'"O que você faz com a casa agora?"', vai:'c14_arrumou_a_casa'}
  ]
},

c14_arrumou_a_casa:{
  texto:[
    'Vocês passam a noite arrumando a casa.',
    'Não é uma cena bonita: é varrer, é tirar teia, é abrir janela, é encontrar comida de quatro anos numa despensa e jogar fora, é discutir sobre o que fazer com um par de sapatos.',
    'Às três da manhã, Blaine acha uma caixa de sapato em cima do armário do quarto com cento e poucas fotos soltas.',
    'Ele senta na cama e olha as cento e poucas, uma por uma, e comenta umas trinta em voz alta pra você, que não conhece ninguém em nenhuma delas.',
    '"Esse aqui é o Amauri no dia que o barco dele afundou na rampa."',
    '"Essa é a formatura dele. Olha esse bigode."',
    '"Essa aqui sou eu com cabelo."',
    'Às cinco da manhã ele guarda a caixa de volta em cima do armário, no mesmo lugar.',
    '"Amanhã eu doo a roupa."',
    'E você entende que "amanhã eu doo a roupa" é a coisa mais difícil que ele disse a noite inteira.'
  ],
  ef:{flag:['arrumou_a_casa','blaine_aliado'],
      npc:{nome:'Blaine', opiniao:10, memoria:'Passou uma noite com você arrumando a casa do amigo e decidiu doar a roupa.'},
      rep:{eixo:'bom',delta:5,motivo:'Passou a noite varrendo a casa de um morto com um velho'},
      moral:25, hp:-3, causa:'Uma noite inteira sem dormir',
      registrar:'Arrumou com Blaine a casa do Dr. Fuji.',
      presagio:'"Amanhã eu doo a roupa." Quatro anos.'},
  escolhas:[
    {texto:'"Agora me mostra as caixas."', vai:'c14_ginasio_por_dentro'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine'},
    {texto:'Ir subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'}
  ]
},

c14_pegou_a_polaroid:{
  texto:[
    'Você tira a Polaroid da parede com cuidado, com a folha de caderno junto, porque as duas estão presas pela mesma fita.',
    'De perto, a foto é pior.',
    'Tem uma coisa em pé dentro de um tanque, e ela é alta, e ela tem as duas mãos abertas encostadas no vidro por dentro, na altura do rosto, como quem olha uma vitrine.',
    'E atrás do vidro, desfocado, refletido, dá pra ver o Fuji — porque ele está tirando a foto de frente, e o flash devolveu ele.',
    'Ele está de pé, com a câmera na altura do peito, olhando pra cima.',
    'Os dois estão se olhando.',
    'Na hora em que a foto foi tirada, os dois estavam se olhando, e ele apertou o botão assim mesmo.'
  ],
  ef:{flag:['tem_a_polaroid','provas_cinnabar'],
      itens:{'Polaroid do tanque':1},
      rep:{eixo:'bom',delta:3,motivo:'Guardou a única foto que existe'},
      moral:-10,
      registrar:'Ficou com a Polaroid do tanque, com a legenda "o que eu fiz".',
      presagio:'Os dois estavam se olhando. Ele apertou o botão assim mesmo.'},
  escolhas:[
    {texto:'Chamar o Blaine pra entrar.', vai:'c14_blaine_entrou'},
    {texto:'Ler o jornal na mesa.', vai:'c14_o_jornal'},
    {texto:'Sair e ir ver as caixas.', vai:'c14_ginasio_por_dentro'},
    {texto:'Devolver pra parede.', vai:'c14_saiu_da_casa'}
  ]
},

c14_levou_o_jornal:{
  texto:[
    'Você dobra o jornal na página seis e leva, com os óculos dentro, porque separar os dois parece errado.',
    'Na rua, Blaine te vê saindo com o jornal debaixo do braço e não pergunta nada.',
    'Você não mostra.',
    'Você vai mostrar depois, num momento melhor, e "um momento melhor" é uma coisa que você vai passar três capítulos procurando e que não existe.'
  ],
  ef:{flag:['tem_o_jornal','provas_cinnabar'],
      itens:{'Jornal de 11/11/96 e um par de óculos':1},
      moral:-5,
      registrar:'Levou o jornal de 11/11/96 com a vaga de professor circulada.',
      presagio:'"Um momento melhor" não existe. Mostra logo.'},
  escolhas:[
    {texto:'Mostrar agora mesmo.', vai:'c14_blaine_entrou'},
    {texto:'Ir ver as caixas.', vai:'c14_ginasio_por_dentro'},
    {texto:'Ir ao laboratório.', vai:'c14_lab'},
    {texto:'Ir subir o vulcão.', vai:'c14_vulcao'}
  ]
},

c14_saiu_da_casa:{
  texto:[
    'Você sai sem tocar em nada e fecha a porta atrás de você.',
    'Blaine está na cadeira de balanço.',
    '"E aí?"',
    '"Tá do jeito que ele deixou."',
    'Ele assente.',
    '"Eu sei."',
    'Ele continua balançando.',
    '"É por isso que eu não entro."'
  ],
  ef:{flag:'nao_mexeu_na_casa',
      rep:{eixo:'bom',delta:1,motivo:'Não mexeu no que não era seu'},
      presagio:'Ele sabia o que tinha lá dentro sem entrar. Quatro anos sabendo.'},
  escolhas:[
    {texto:'"Me mostra as caixas."', vai:'c14_ginasio_por_dentro'},
    {texto:'"Entra comigo."', vai:'c14_blaine_entrou'},
    {texto:'Ir ao laboratório.', vai:'c14_lab'},
    {texto:'Ir subir o vulcão.', vai:'c14_vulcao'}
  ]
},

c14_dentro_da_casa:{
  texto:[
    'Você entra pela janela da cozinha, que está encostada, e cai em cima da pia.',
    'E a primeira coisa que a sua mão encosta no escuro é uma xícara.',
    'Você acende a lanterna.',
    'A xícara tem uma coisa preta e dura no fundo, e o resto da casa está exatamente como alguém deixou quando saiu achando que ia voltar: um casaco no encosto da cadeira, um jornal aberto na mesa com um par de óculos em cima, e seis fotos na parede da sala.',
    'Cinco são de gente.',
    'A sexta é uma Polaroid tremida de alguma coisa de pé dentro de um tanque, com as duas mãos encostadas no vidro por dentro.',
    'E embaixo dela, colada com fita, uma folha de caderno com quatro palavras:',
    '**"o que eu fiz"**',
    'Você está sozinho, de madrugada, na casa de um homem que sumiu há quatro anos, e não tem ninguém pra dividir isso.'
  ],
  ef:{flag:['entrou_na_casa_do_fuji','viu_a_polaroid'],
      rep:{eixo:'bom',delta:1,motivo:'Entrou pela janela'},
      moral:-15, instabilidade:1,
      registrar:'Entrou sozinho na casa do Fuji e achou a Polaroid do tanque.',
      presagio:'Não tem ninguém pra dividir isso. Vai ter que ir buscar alguém.'},
  escolhas:[
    {texto:'Ler o jornal aberto na mesa.', vai:'c14_o_jornal'},
    {texto:'Pegar a Polaroid.', vai:'c14_pegou_a_polaroid'},
    {texto:'Ir buscar o Blaine.', vai:'c14_blaine_na_varanda'},
    {texto:'Sair sem tocar em nada.', vai:'c14_saiu_da_casa'}
  ]
},

/* ─────────────── O GINÁSIO E O ACERVO ─────────────── */

c14_ginasio:{
  texto:[
    'O ginásio de Cinnabar não é um prédio. É uma porta.',
    'Uma porta de aço encaixada na rocha, na base do vulcão, no fim de uma escada de cimento de sessenta e dois degraus que alguém construiu nos anos setenta e que ninguém consertou desde então.',
    'Na porta, uma placa de metal gravada: **GINÁSIO CINNABAR — BLAINE — FOGO**.',
    'E, colada abaixo, uma folha de papel plastificada com fita, escrita à mão:',
    '"Desafios: quinta-feira, das 14h às 18h. Quem chegar fora do horário espera até quinta. Quem não quiser esperar, tem sete outros ginásios em Kanto."',
    'Hoje é terça.',
    'A porta está destrancada.',
    'Você empurra e dentro tem um corredor de rocha escavada, quente, com luz de lâmpada amarela, e ao fundo se ouve alguém mexendo em papel.'
  ],
  ef:{flag:'achou_ginasio_cinnabar',
      executar:d=>{ Mundo.descobrir('ginasio_cinnabar'); return []; },
      registrar:'O ginásio de Cinnabar fica dentro do vulcão. Desafios só às quintas.',
      presagio:'A porta está destrancada e alguém está mexendo em papel lá dentro.'},
  escolhas:[
    {texto:'Entrar.', vai:'c14_ginasio_por_dentro'},
    {texto:'Gritar da porta.', vai:'c14_ginasio_por_dentro'},
    {texto:'Voltar na quinta.', vai:'c14_desafio_blaine'},
    {texto:'Ir ao laboratório primeiro.', vai:'c14_lab'}
  ]
},

c14_ginasio_por_dentro:{
  texto:[
    'O corredor de rocha desce quarenta metros e desemboca numa câmara natural que alguém transformou em arena: piso de concreto queimado, marcação branca refeita muitas vezes, e uma abertura no teto por onde entra luz e sai calor.',
    'Faz trinta e oito graus.',
    'E nos fundos da arena, atrás de uma porta comum de escritório, tem uma sala.',
    'A sala tem quatro por quatro metros, um ventilador de teto, uma mesa, uma cadeira, e cinco caixas de arquivo de papelão empilhadas em duas pilhas.',
    'Nas caixas, etiqueta datilografada:',
    '**INSTITUTO DE PESQUISA CINNABAR — CAIXAS 5 A 9 DE 9**',
    'E em cima da mesa, sozinho, aberto, com um marcador de página feito de tira de jornal: um caderno de capa dura.',
    d=>d.flags.conheceu_blaine ? 'Blaine acende a luz e não entra na sala. Fica na porta.\n"Eu li em noventa e sete e deixei aberto nessa página."\n"Faz quatro anos que tá aberto nessa página?"\n"Faz."' :
       'Não tem ninguém aqui. Alguém deixou a luz acesa e a porta destrancada e foi embora, e o caderno está aberto numa página específica, e a página tem um marcador feito à mão.'
  ],
  ef:{flag:['achou_o_acervo','achou_as_cinco_caixas'],
      instabilidade:1,
      registrar:'As caixas 5 a 9 do Instituto de Cinnabar estão na sala dos fundos do ginásio.',
      presagio:'Aberto na mesma página há quatro anos.'},
  escolhas:[
    {texto:'Ler a página aberta.', vai:'c14_caderno'},
    {texto:'Procurar o caderno 7 nas caixas.', vai:'c14_caderno'},
    {texto:'Perguntar por que essa página.', vai:'c14_essa_pagina', cond:d=>!!d.flags.conheceu_blaine},
    {texto:'Não ler. Sair da sala.', vai:'c14_nao_leu'}
  ]
},

c14_essa_pagina:{
  texto:[
    '"Por que essa página?"',
    'Blaine continua na porta.',
    '"Porque é a última em que ele fala comigo."',
    '"Como assim com você?"',
    '"O Amauri escrevia os cadernos pra ele mesmo, sempre. Relatório, observação, hipótese, tudo na terceira pessoa, do jeito certo."',
    'Ele aponta a página com o queixo.',
    '"Menos essa."',
    '"Essa aí ele escreveu pra mim, e eu sei porque tem o meu nome, e porque ele nunca escreveu o meu nome em nenhum dos quarenta e um cadernos em vinte e dois anos."'
  ],
  ef:{flag:'blaine_explicou_a_pagina',
      npc:{nome:'Blaine', opiniao:8, memoria:'Explicou que a página aberta é a única em que o Fuji escreveu o nome dele.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou por que aquela página'},
      presagio:'Uma página com o nome dele em vinte e dois anos de caderno.'},
  escolhas:[
    {texto:'Ler.', vai:'c14_caderno'},
    {texto:'"Lê você."', vai:'c14_blaine_leu_em_voz_alta'},
    {texto:'Não ler.', vai:'c14_nao_leu'},
    {texto:'Ler em silêncio e não comentar.', vai:'c14_caderno'}
  ]
},

c14_caderno:{
  texto:[
    'O caderno tem sete na lombada, em etiqueta colada, e a etiqueta tem uma marca de cola antiga por baixo, de onde saiu outra.',
    'É o caderno 7 de verdade.',
    'Dias duzentos e quarenta e dois em diante.',
    '**"Dia 242. Tiraram-me do projeto ontem às 15h20. Entreguei crachá, chave e as chaves do carro do instituto. Não entreguei os cadernos porque ninguém pediu os cadernos."**',
    '**"Dia 243. Fui ao prédio à noite. O vigia é o Sr. Tokuda e ele me deixou entrar porque eu trabalho aqui há vinte e dois anos e ninguém avisou o Sr. Tokuda de nada."**',
    '**"Dia 243 (cont.). Falei com ele por quatro horas. Contei que eu tinha sido afastado. Contei que eu não ia mais poder vir. Ele perguntou por quê e eu disse a verdade, que é que eu disse não."**',
    '**"Ele perguntou não pra quê."**',
    '**"Eu disse: não pra continuar."**',
    '**"E ele perguntou: continuar o quê?"**',
    '**"E eu percebi, no dia duzentos e quarenta e três, que em duzentos e quarenta e três dias eu nunca tinha explicado pra ele o que era o projeto."**',
    '**"Ele não sabia que era um experimento. Ele achava que eram conversas."**'
  ],
  ef:{flag:['leu_caderno','leu_o_sete'], instabilidade:2, moral:-20,
      rep:{eixo:'bom',delta:3,motivo:'Leu o caderno sete'},
      registrar:'Caderno 7: em 243 dias, o Dr. Fuji nunca explicou a Mewtwo que aquilo era um experimento.',
      presagio:'Ele achava que eram conversas. Segura essa frase, ela volta no último capítulo.'},
  escolhas:[
    {texto:'Continuar lendo.', vai:'c14_caderno2'},
    {texto:'"Lê você." — pedir pro Blaine ler.', vai:'c14_blaine_leu_em_voz_alta', cond:d=>!!d.flags.conheceu_blaine},
    {texto:'Parar de ler.', vai:'c14_nao_leu'},
    {texto:'Ler até o fim de uma vez.', vai:'c14_caderno2'}
  ]
},

c14_caderno2:{
  texto:[
    '**"Dia 244. Ele passou a noite inteira sem responder. O Sr. Tokuda me deixou ficar."**',
    '**"Dia 245. Pediu pra sair. Segunda vez. Usou a palavra por favor as duas vezes."**',
    '**"Dia 245 (cont.). Eu disse que não tenho autoridade. Ele perguntou quem tem. Eu disse um conselho em Saffron. Ele perguntou se o conselho já conversou com ele alguma vez."**',
    '**"Eu disse que não."**',
    '**"Ele perguntou como um conselho decide sobre alguém com quem nunca conversou."**',
    '**"Eu não soube responder e não vou saber nunca."**',
    '**"Dia 246. Escrevi ao conselho pedindo audiência. Protocolo 11.409."**',
    '**"Dia 250. Indeferido. Motivo: requerente sem vínculo institucional."**',
    'E aí a letra muda: fica maior, mais espaçada, de quem escreveu com a mão inteira em vez de com os dedos.',
    '**"Dia 251. Bruno: se você estiver lendo isso, foi porque aconteceu alguma coisa, e eu quero que você saiba que eu não fui lá me matar."**',
    '**"Eu fui lá abrir o tanque."**',
    '**"Eu fui explicar pra ele o que ele é, que é a única coisa que ele pediu em duzentos e cinquenta e um dias e a única que eu devo."**',
    '**"E depois eu ia abrir."**',
    '**"Se der errado, não é culpa sua e não é culpa de ninguém dessa ilha, e por favor cuida da casa até a prefeitura tomar, que eu não quero que tomem no primeiro ano."**',
    '**"Amauri."**',
    'A página seguinte está em branco.',
    'E todas as outras, até o fim.'
  ],
  ef:{flag:['leu_o_fim_do_sete','sabe_que_ele_abriu'],
      instabilidade:2, moral:-25,
      rep:{eixo:'bom',delta:4,motivo:'Leu até o fim'},
      registrar:'O Dr. Fuji foi ao laboratório para explicar a Mewtwo o que ele era, e depois abrir o tanque.',
      presagio:'"Cuida da casa até a prefeitura tomar, que eu não quero que tomem no primeiro ano." Quatro anos.'},
  escolhas:[
    {texto:'Chamar o Blaine e ler em voz alta pra ele.', vai:'c14_blaine_leu_em_voz_alta'},
    {texto:'Levar o caderno.', vai:'c14_pegou_caderno'},
    {texto:'Deixar o caderno onde estava.', vai:'c14_saida_lab'},
    {texto:'Queimar. Ninguém mais precisa ler isso.', vai:'c14_queimou'}
  ]
},

c14_blaine_leu_em_voz_alta:{
  texto:[
    'Você pede pra ele ler em voz alta.',
    'Ele diz que não, e você não insiste, e ele fica na porta mais um tempo, e depois entra na sala pela primeira vez em quatro anos e senta na cadeira.',
    'E lê.',
    'Ele lê as quatro páginas em voz alta, inteiras, pra um moleque de quinze anos numa sala de quatro por quatro dentro de um vulcão, e ele tropeça em três lugares.',
    'Na parte do "ele achava que eram conversas", ele para por quase um minuto.',
    'E na parte do "cuida da casa até a prefeitura tomar", ele lê muito rápido, quase atropelando, porque é a única forma de terminar a frase.',
    'Quando acaba, ele fecha o caderno e põe as duas mãos em cima.',
    '"Quatro anos eu achei que ele tinha ido lá se entregar."',
    'Ele bate na capa com a palma.',
    '"Ele foi lá pedir desculpa."'
  ],
  ef:{flag:['blaine_leu_em_voz_alta','blaine_aliado'],
      npc:{nome:'Blaine', opiniao:10, memoria:'Leu em voz alta as quatro páginas finais do caderno 7, para você, dentro do vulcão.'},
      rep:{eixo:'bom',delta:6,motivo:'Fez um velho ler em voz alta o que ele guardou por quatro anos'},
      moral:20,
      registrar:'Blaine leu o caderno 7 em voz alta e entendeu que o amigo foi pedir desculpa.',
      presagio:'"Ele foi lá pedir desculpa." Quatro anos pra ler quatro páginas em voz alta.'},
  escolhas:[
    {texto:'"Então a gente publica isso."', vai:'c14_publicar'},
    {texto:'"Então a gente devolve o acervo."', vai:'c14_devolver_acervo'},
    {texto:'"Me dá o caderno. Eu levo."', vai:'c14_pegou_caderno'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine'}
  ]
},

c14_publicar:{
  texto:[
    '"Então a gente publica isso."',
    'Ele balança a cabeça.',
    '"Publicar o quê? Um caderno de um homem que ninguém conhece sobre uma coisa que oficialmente nunca existiu?"',
    '"Uma coisa que tem onze cópias num subsolo em Saffron."',
    'Ele para.',
    '"Isso muda."',
    'Ele passa a mão no rosto.',
    '"Isso muda tudo, porque aí o caderno não é memória, é antecedente. Aí ele deixa de ser “um cientista escreveu isso” e vira “isso já aconteceu antes e está documentado”."',
    d=>d.flags.cartao_ivone ? '"E você conhece alguém que publica?"\n"Conheço."\n"Então liga."' :
       '"E você conhece alguém que publica?"\n"Não."\n"Aí é mais difícil. Mas eu conheço um professor aposentado em Cerulean que escreve numa revista chata que ninguém lê e que é citada em processo."',
    'Ele olha as cinco caixas.',
    '"E a gente não publica o sete."',
    '"Por quê?"',
    '"Porque o sete é carta. Carta não se publica."',
    'Ele bate na pilha.',
    '"A gente publica o um ao seis, que é o método. E aí o sete fica sendo o que ele é."'
  ],
  ef:{flag:['vai_publicar','blaine_aliado'],
      npc:{nome:'Blaine', opiniao:10, memoria:'Decidiu publicar os cadernos 1 a 6 e guardar o 7, porque carta não se publica.'},
      rep:{eixo:'bom',delta:6,motivo:'Separou o que é prova do que é carta'},
      moral:15,
      registrar:'Blaine vai publicar os cadernos 1 a 6 do Dr. Fuji e guardar o 7.',
      presagio:'"Carta não se publica." Anota — é uma regra e é uma boa.'},
  escolhas:[
    {texto:'Chamar a Dra. Cordell.', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'"E o acervo? A cláusula de devolução."', vai:'c14_devolver_acervo'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine'}
  ]
},

c14_devolver_acervo:{
  texto:[
    '"Então a gente devolve o acervo."',
    '"Devolve pra quem? O instituto foi extinto por decreto."',
    '"Extinto por decreto quer dizer que o patrimônio foi pra algum lugar. Sempre vai."',
    'Blaine olha pra você com uma cara nova.',
    '"Você tem quinze anos."',
    '"Eu passei um capítulo inteiro numa junta comercial."',
    'Ele ri.',
    'E aí ele vai até a estante, tira uma pasta de plástico com o Diário Oficial de novembro de noventa e seis dentro — porque ele guardou, porque ele é chato, porque advogado de ilha não faz nada —, e procura, e acha.',
    '**"Art. 4º. O acervo técnico e científico do Instituto ora extinto fica incorporado ao patrimônio da Comissão de Bem-Estar Pokémon, com obrigação de guarda e acesso público."**',
    'Guarda e acesso público.',
    'As quatro caixas que a Silph tem estão em posse de patrimônio público desde noventa e seis.',
    'E as cinco que estão nessa sala também.',
    'Blaine fecha a pasta devagar.',
    '"Eu também tô com coisa que não é minha."'
  ],
  ef:{flag:['sabe_do_artigo_quarto','provas_cinnabar'],
      itens:{'Diário Oficial de 11/1996':1},
      npc:{nome:'Blaine', opiniao:9, memoria:'Achou o artigo que incorporou o acervo à Comissão e admitiu que também está com coisa que não é dele.'},
      rep:{eixo:'bom',delta:6,motivo:'Achou para onde o patrimônio foi'},
      instabilidade:1,
      registrar:'O acervo do Instituto de Cinnabar pertence à Comissão de Bem-Estar Pokémon desde 1996, com acesso público.',
      presagio:'Acesso público. Repare no que isso faz com tudo o que você viu em Celadon.'},
  escolhas:[
    {texto:'"Então a gente entrega à Comissão. À Auditora Brill."', vai:'c14_entregar_prado', cond:d=>!!d.flags.conheceu_prado},
    {texto:'"Então a gente entrega à Comissão."', vai:'c14_entregar_comissao'},
    {texto:'"E a gente publica antes."', vai:'c14_publicar'},
    {texto:'Chamar a Dra. Cordell.', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c14_entregar_prado:{
  texto:[
    'Você conta pro Blaine da Auditora Brill: a prancheta, o pregão no cassino, o corredor de azulejo, a via amarela carbonada, as vinte e seis sessões por ano.',
    'Ele ouve e faz uma pergunta só:',
    '"Ela te deu o papel?"',
    '"Deu."',
    '"Então serve."',
    'Ele começa a empilhar as caixas.',
    '"Auditoria interna tem competência de requisição. Se ela requisitar as quatro caixas da Silph como patrimônio incorporado, a Silph tem trinta dias pra devolver ou justificar, e justificar é pior pra eles do que devolver."',
    '"E as cinco daqui?"',
    'Ele para de empilhar.',
    '"As cinco daqui eu entrego na mão dela."',
    '"Você pode ser processado."',
    '"Eu tenho setenta e dois anos, meu filho, e retenção de acervo público prescreve em cinco anos, e falta um ano e três meses."',
    'Ele volta a empilhar.',
    '"Eu prefiro entregar antes de prescrever. Prescrever é a Justiça dizendo que não importa mais. E importa."'
  ],
  ef:{flag:['vai_entregar_a_prado','blaine_aliado'],
      npc:{nome:'Blaine', opiniao:10, memoria:'Vai entregar as cinco caixas à Auditora Brill antes de a retenção prescrever.'},
      rep:{eixo:'bom',delta:7,motivo:'Ligou o acervo de Cinnabar à auditoria que preside os pregões de Celadon'},
      moral:20, instabilidade:-1,
      registrar:'Blaine vai entregar as cinco caixas à Auditora Brill, e a Comissão pode requisitar as quatro da Silph.',
      presagio:'"Prescrever é a Justiça dizendo que não importa mais. E importa."'},
  escolhas:[
    {texto:'Subir o vulcão antes de ir.', vai:'c14_vulcao'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Chamar a Dra. Cordell também.', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c14_entregar_comissao:{
  texto:[
    '"Então a gente entrega à Comissão."',
    'Ele faz uma cara.',
    '"À Comissão que aprovou tudo isso em noventa e seis?"',
    '"À Comissão que tem obrigação de guarda e acesso público escrita num decreto."',
    'Ele pensa.',
    '"Guarda e acesso público."',
    '"Acesso público, Bruno. Se o acervo for incorporado formalmente, qualquer pessoa pode pedir vista. Qualquer pessoa. Inclusive jornalista, inclusive advogado de quem for processar, inclusive um moleque com caderno."',
    'Ele olha as cinco caixas por muito tempo.',
    '"Eu sempre achei que entregar era perder."',
    'Ele começa a empilhar.',
    '"Entregar é publicar por outro caminho."'
  ],
  ef:{flag:['vai_entregar_comissao','blaine_aliado'],
      npc:{nome:'Blaine', opiniao:9, memoria:'Entendeu que entregar o acervo à Comissão é publicá-lo por outro caminho.'},
      rep:{eixo:'bom',delta:6,motivo:'Transformou uma entrega em publicação'},
      moral:15,
      registrar:'Blaine vai incorporar formalmente as cinco caixas ao acervo público, com direito de vista.',
      presagio:'"Entregar é publicar por outro caminho." Guarde a jogada.'},
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine'},
    {texto:'Chamar a Dra. Cordell.', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'}
  ]
},

c14_chamou_ivone_cinnabar:{
  texto:[
    'A Dra. Cordell chega no ferry de sábado, porque não tem outro jeito de chegar em Cinnabar.',
    'Ela passa dois dias na sala do ginásio lendo, com Blaine trazendo café e sem falar nada, e os dois velhos se dando bem de um jeito imediato e chato de assistir.',
    'No fim do segundo dia ela fecha a caixa nove e fala:',
    '"Eu não vou publicar isso."',
    'Blaine levanta a cabeça.',
    '"Como é?"',
    '"Eu vou publicar o decreto, o artigo quarto, e a prova de que a Silph está com patrimônio público desde noventa e seis."',
    '"Isso é seco."',
    '"Isso é uma página e meia e não tem nenhuma emoção e vai obrigar um órgão público a responder em trinta dias."',
    'Ela tira os óculos.',
    '"E aí, quando eles responderem, o acervo vira público, e aí eu publico os cadernos como documento público e não como vazamento."',
    'Ela olha os dois.',
    '"E aí ninguém pode dizer que eu roubei, ninguém pode dizer que o Bruno reteve, e ninguém pode dizer que o Amauri era um maluco que escrevia caderno."',
    'Blaine olha pra ela por um tempo.',
    '"A senhora é bem pior que eu."',
    '"Eu sou muito pior que o senhor."'
  ],
  ef:{flag:['ivone_tem_cinnabar','plano_de_publicacao'],
      npc:{nome:'Dra. Cordell', opiniao:10, memoria:'Passou dois dias em Cinnabar e montou o caminho para publicar os cadernos como documento público.'},
      rep:{eixo:'bom',delta:7,motivo:'Juntou o arquivo, o decreto e quem sabe publicar'},
      moral:20, instabilidade:-1,
      registrar:'A Dra. Cordell vai publicar primeiro o decreto, para tornar o acervo público antes de publicar os cadernos.',
      presagio:'Documento público e não vazamento. É essa a diferença que decide tudo.'},
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Ficar os dois dias com eles.', vai:'c14_ficou_os_dois_dias'}
  ]
},

c14_ficou_os_dois_dias:{
  texto:[
    'Você fica os dois dias.',
    'Não faz quase nada: busca café, carrega caixa, segura a lanterna quando falta luz na ilha às dezenove e dez de sábado, como falta todo sábado.',
    'E ouve dois velhos discutirem por dezoito horas sobre ordem de publicação, prazo de resposta, competência de órgão e a diferença entre documento público e vazamento.',
    'É a coisa mais chata que você já assistiu na vida.',
    'E em algum momento da madrugada de domingo você entende que é isso.',
    'Que é essa a coisa.',
    'Que tudo que você viu em treze capítulos — o armazém, o pregão, a reserva, o andar onze — não vai ser desfeito por ninguém entrando em lugar nenhum de madrugada.',
    'Vai ser desfeito por dois velhos brigando sobre ordem de publicação numa sala de quatro por quatro dentro de um vulcão, com café ruim.',
    'E que isso é péssimo de assistir e é a única coisa que funciona.'
  ],
  ef:{flag:['entendeu_como_funciona'],
      rep:{eixo:'bom',delta:4,motivo:'Ficou os dois dias e entendeu o que estava vendo'},
      moral:15, hp:2,
      registrar:'Passou dois dias assistindo dois velhos montarem o caso.',
      presagio:'É péssimo de assistir e é a única coisa que funciona. Não esqueça isso no último capítulo.'},
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Ir embora de Cinnabar.', vai:'c14_fim'}
  ]
},

c14_pegou_caderno:{
  texto:[
    'Você põe o caderno 7 na mochila.',
    d=>d.flags.conheceu_blaine ? 'Blaine não impede. Ele olha a mochila fechar e diz uma coisa só:\n"Devolve."\n"Quando?"\n"Quando não precisar mais. Você vai saber."' :
       'Ninguém te vê pegar, e é justamente por isso que você fica com uma sensação ruim na garganta pelo resto do dia.',
    'O caderno pesa oitocentos gramas e você vai sentir esses oitocentos gramas em cada capítulo daqui pra frente.'
  ],
  ef:{flag:['pegou_caderno','tem_o_caderno_sete'],
      itens:{'Caderno 7 do Dr. Fuji':1},
      rep:{eixo:'bom',delta:2,motivo:'Ficou com o documento que explica tudo'},
      registrar:'Levou o caderno 7 do Dr. Fuji.',
      presagio:'"Você vai saber." Guarde — vai ter um momento.'},
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!!d.flags.conheceu_blaine},
    {texto:'Chamar a Dra. Cordell.', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c14_nao_leu:{
  texto:[
    'Você fecha o caderno sem ler.',
    d=>d.flags.conheceu_blaine ? 'Blaine, da porta:\n"Por quê?"\n"Porque você disse que é carta."\nEle fica quieto um tempo bem longo.\n"É."' :
       'É uma decisão esquisita e você não sabe explicar ela nem pra você mesmo, a não ser assim: aquele caderno estava aberto na mesma página há quatro anos e não era pra você.',
    'Você sai da sala e apaga a luz.'
  ],
  ef:{flag:'nao_leu_o_sete',
      rep:{eixo:'bom',delta:2,motivo:'Não leu a carta de um homem para outro'},
      moral:5,
      registrar:'Não leu o caderno 7.',
      presagio:'Você não vai saber o que tinha lá. Vai ter que viver com isso.'},
  escolhas:[
    {texto:'"Então me conta o que tem nele."', vai:'c14_blaine_leu_em_voz_alta', cond:d=>!!d.flags.conheceu_blaine},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!!d.flags.conheceu_blaine}
  ]
},

c14_queimou:{
  texto:[
    'Você queima.',
    'A capa dura demora e fede, e o papel de gramatura alta queima devagar, folha por folha, e você fica lá o tempo inteiro porque queimar caderno leva muito mais tempo do que as pessoas imaginam.',
    'No meio do fogo, você percebe uma coisa.',
    'Sem esse caderno, o que fizeram com ele nunca aconteceu oficialmente.',
    'E o que ele fez, também não.',
    'Você acabou de apagar a única vez em que alguém escreveu, de próprio punho, "ele pediu para sair" e "eu fui lá pedir desculpa".',
    d=>d.flags.conheceu_blaine ? 'Blaine assiste da porta e não impede, e não fala nada, e quando acaba ele vira e sobe os quarenta metros de corredor sozinho.\nE você nunca mais fala com ele nesse capítulo.' : ''
  ],
  ef:{flag:['queimou_caderno'], instabilidade:2, moral:-20,
      rep:{eixo:'ruim',delta:3,motivo:'Destruiu a única prova do que fizeram em Cinnabar'},
      npc:{nome:'Blaine', opiniao:-5, memoria:'Assistiu você queimar o caderno do amigo dele e subiu o corredor sozinho.'},
      registrar:'Queimou o caderno 7 do Dr. Fuji.',
      presagio:'Queimar caderno leva muito mais tempo do que as pessoas imaginam. Você teve tempo de parar.'},
  escolhas:[
    {texto:'Sair.', vai:'c14_saida_lab'},
    {texto:'Ir atrás do Blaine.', vai:'c14_fim'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'}
  ]
},

c14_desafio_blaine:{
  texto:[
    'Quinta, catorze horas.',
    'Ele não faz nenhuma concessão por você ter passado a semana com ele. Isso, de um jeito esquisito, é o maior elogio do capítulo.',
    '"Regra da casa: se o teu bicho cair e tu quiser continuar, tu continua. Se eu vir que tu tá continuando por teimosia, eu paro a luta."',
    '"E como você sabe a diferença?"',
    'Ele entra na marcação.',
    '"Setenta e dois anos, meu filho."',
    'Faz trinta e oito graus e a luz vem do buraco do teto e ninguém tem sombra.'
  ],
  ef:{flag:'vai_lutar_com_blaine'},
  batalha:{dex:59, nivel:47, tipo:'treinador', treinador:'Blaine, Líder de Cinnabar', fuga:false,
           timeExtra:[{dex:58, nivel:42},{dex:77, nivel:42},{dex:126, nivel:45}],
           vitoria:'c14_venceu_blaine', derrota:'c14_perdeu_blaine', gameover:'gameover'}
},

c14_venceu_blaine:{
  texto:[
    'Você vence.',
    'Ele senta na beirada da marcação, com a toalha no pescoço, e demora pra recuperar o fôlego de um jeito que assusta um pouco.',
    '"Boa."',
    'Ele tira do bolso da bermuda uma insígnia amassada, que ele claramente carrega no bolso o tempo todo em vez de guardar numa caixa como os outros líderes.',
    '"Toma."',
    'E enquanto você guarda, ele fala olhando a arena vazia:',
    '"Eu perdi trinta e uma vezes em quarenta anos de ginásio."',
    '"E as trinta e uma eu lembro o nome."',
    'Ele levanta com dificuldade.',
    '"Qual é o teu mesmo?"'
  ],
  ef:{insignia:'Insígnia Vulcão', flag:['venceu_blaine','ginasio_cinnabar'],
      rep:{eixo:'bom',delta:3,motivo:'Venceu o líder de Cinnabar'},
      npc:{nome:'Blaine', opiniao:9, memoria:'Perdeu para você. Lembra o nome das trinta e uma pessoas que o venceram em quarenta anos.'},
      moral:15,
      registrar:'Venceu Blaine e recebeu a Insígnia Vulcão.'},
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Ir embora de Cinnabar.', vai:'c14_fim'},
    {texto:'Ficar mais um dia na ilha.', vai:'c14_ficou_os_dois_dias'}
  ]
},

c14_perdeu_blaine:{
  texto:[
    'Você perde, e ele para no segundo em que dá pra parar, e não deixa passar disso.',
    '"Pronto. Chega."',
    'Ele atravessa a arena e ajuda a levantar o seu time, um por um, e comenta cada um como quem avalia ferramenta.',
    '"Esse aqui tá bom. Esse aqui tá cansado, não de hoje, de faz tempo. Esse aqui tá com medo de você."',
    'Você abre a boca e ele levanta a mão.',
    '"Não é acusação. É observação. Eu tenho quarenta anos de ginásio e eu vejo o que eu vejo."',
    'Ele põe a toalha no pescoço.',
    '"Volta quinta que vem. Ou não volta, que também tá bom."'
  ],
  ef:{hp:-6, causa:'Derrota no ginásio de Cinnabar', flag:'perdeu_pro_blaine',
      npc:{nome:'Blaine', opiniao:6, memoria:'Parou a luta na hora e comentou seu time um por um.'},
      registrar:'Perdeu para Blaine. Ele avaliou seu time um por um.',
      presagio:'"Esse aqui tá com medo de você." Confere isso depois.'},
  escolhas:[
    {texto:'Tentar de novo na quinta seguinte.', vai:'c14_desafio_blaine'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Ir embora de Cinnabar.', vai:'c14_fim'}
  ]
},

/* ─────────────── O LABORATÓRIO E O VULCÃO ─────────────── */

c14_lab:{
  texto:[
    'O laboratório por dentro é um museu de coisa interrompida — e agora é um museu queimado, o que é duas coisas ao mesmo tempo e nenhuma delas combina.',
    'A ala oeste está intacta: café petrificado numa caneca, um jaleco pendurado num cabide de parede, uma cadeira caída que ninguém levantou em quatro anos, um calendário de mesa em novembro de noventa e seis.',
    'A ala leste queimou.',
    'E queimou de dentro pra fora.',
    'Você não é perito, mas você já viu duas casas queimadas na vida e as duas queimaram do jeito contrário: o fogo entra por uma janela e sai por um teto. Aqui as vidraças estão estufadas pra fora e os batentes estão tostados por dentro.',
    'Alguém acendeu de dentro, no meio da sala, e fechou a porta.',
    'E no chão, no meio da ala leste, no ponto onde o fogo começou, tem um retângulo de cinza mais clara.',
    'Do tamanho de uma caixa de arquivo.',
    'Eles não acharam as cinco. Então queimaram uma vazia pra parecer que acharam.'
  ],
  ef:{flag:['viu_o_lab','sabe_que_foi_forjado'],
      rep:{eixo:'bom',delta:3,motivo:'Reparou que o fogo queimou do lado errado'},
      instabilidade:1,
      registrar:'O incêndio começou de dentro, e havia uma caixa de arquivo vazia no ponto de origem.',
      presagio:'Queimaram uma caixa vazia. Pra alguém escrever num relatório que o acervo foi perdido.'},
  escolhas:[
    {texto:'Descer para o subsolo.', vai:'c14_subsolo'},
    {texto:'Procurar a sala do tanque.', vai:'c14_subsolo'},
    {texto:'Fotografar a direção da queima.', vai:'c14_fotografou_lab', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Sair e ir ao ginásio.', vai:'c14_ginasio'}
  ]
},

c14_fotografou_lab:{
  texto:[
    'Você fotografa o que um perito fotografaria, porque você já viu perito trabalhar num capítulo e prestou atenção.',
    'As vidraças estufadas pra fora, em três ângulos. Os batentes tostados por dentro. O retângulo de cinza clara no ponto de origem. A régua da sua mochila do lado do retângulo, pra dar escala.',
    'E a fechadura da porta da ala leste, que está trancada por fora.',
    'Trancada por fora.',
    'Quem acendeu não estava dentro quando acendeu, o que quer dizer que tinha uma mecha, o que quer dizer que foi planejado com antecedência e não no susto.',
    'Onze fotos.'
  ],
  ef:{flag:['provas_do_incendio','provas_cinnabar'],
      executar:d=>{ Estado.usarItem('Câmera descartável'); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Documentou o incêndio como perito'},
      registrar:'Fotografou o incêndio do laboratório: origem interna, porta trancada por fora, caixa vazia no foco.',
      presagio:'Trancada por fora. Foi planejado antes de o barco chegar.'},
  escolhas:[
    {texto:'Descer para o subsolo.', vai:'c14_subsolo'},
    {texto:'Levar as fotos pro Blaine.', vai:'c14_ginasio'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Sair.', vai:'c14_saida_lab'}
  ]
},

c14_subsolo:{
  texto:[
    'O subsolo não queimou, porque concreto não queima.',
    'A escada desce nove metros e no fim tem um corredor com uma linha de fita amarela no chão, desbotada, com a borda descolando.',
    'A fita que a Sra. Maeda nunca passou em dezoito anos.',
    'Você passa.',
    'A sala do tanque tem trinta metros por quinze e nove de pé-direito, e não tem tanque.',
    'Tem o buraco onde ele estava: um poço de concreto de quatro metros de diâmetro e três de profundidade, com a estrutura de fixação arrancada e o aço torcido pra fora.',
    'Pra fora.',
    'E o teto tem um rombo que sobe três andares até o céu, e você vê nuvem daqui, e é de tarde.',
    'Na borda do poço, num ponto só, tem duas marcas.',
    'Duas marcas de mão, em tamanho de mão de gente adulta, queimadas no concreto da borda a uns vinte centímetros uma da outra.',
    'Alguém se apoiou na borda do poço com as duas mãos e o concreto marcou.'
  ],
  ef:{flag:['viu_a_sala_do_tanque','viu_as_maos'],
      instabilidade:2, moral:-12,
      rep:{eixo:'bom',delta:3,motivo:'Passou da fita amarela'},
      registrar:'No subsolo, o tanque foi arrancado de dentro para fora. Há duas marcas de mãos na borda do poço.',
      presagio:'Marca de mão de gente adulta. Não de mão de Mewtwo.'},
  escolhas:[
    {texto:'Olhar as marcas de perto.', vai:'c14_as_maos'},
    {texto:'Procurar o caderno na mesa da parede.', vai:'c14_mesa_do_subsolo'},
    {texto:'Subir e ir ao ginásio.', vai:'c14_ginasio'},
    {texto:'Sair do laboratório.', vai:'c14_saida_lab'}
  ]
},

c14_as_maos:{
  texto:[
    'Você agacha na borda e põe as suas mãos por cima das marcas, sem encostar.',
    'As marcas são maiores que as suas — mão de homem adulto — e estão viradas pra dentro do poço.',
    'Pra dentro.',
    'Quem fez essas marcas estava debruçado sobre o poço, olhando pra baixo, apoiado com as duas mãos.',
    'E o concreto só marca assim com calor muito alto e contato muito curto.',
    'Você fica agachado ali por um tempo longo, e depois faz a conta que não queria fazer:',
    'o Dr. Fuji foi ao laboratório na noite do dia duzentos e cinquenta e um pra explicar a alguém o que ele era, e depois abrir o tanque.',
    'E as marcas das mãos dele estão na borda do poço, viradas pra baixo, com o tanque já vazio.',
    'Ele abriu.',
    'E depois ele se debruçou e olhou pra dentro.'
  ],
  ef:{flag:['entendeu_as_maos'],
      rep:{eixo:'bom',delta:4,motivo:'Ficou agachado até entender'},
      moral:-18, instabilidade:1,
      registrar:'As marcas de mão na borda do poço são do Dr. Fuji, depois de abrir o tanque.',
      presagio:'Ele abriu, e depois olhou pra dentro. Guarde a ordem.'},
  escolhas:[
    {texto:'Procurar a mesa da parede.', vai:'c14_mesa_do_subsolo'},
    {texto:'Levar isso pro Blaine.', vai:'c14_ginasio'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Sair do laboratório.', vai:'c14_saida_lab'}
  ]
},

c14_mesa_do_subsolo:{
  texto:[
    'Encostada na parede, longe do poço, tem uma mesa de laboratório de aço inox.',
    'Em cima dela: um copo de vidro, uma caneta, e um livro de registro de acesso ao subsolo — daqueles de portaria, com coluna de nome, hora de entrada e hora de saída.',
    'A última página escrita é a do dia doze de novembro de mil novecentos e noventa e seis.',
    '**21h40 — FUJI, A. — entrada — autorizado por: TOKUDA, S. (vigia)**',
    'E a coluna de saída, na mesma linha, está preenchida.',
    'Preenchida.',
    '**04h10 — saída**',
    'Na letra do vigia.',
    'Ele saiu.',
    'O Dr. Fuji entrou às nove e quarenta da noite do dia doze de novembro, ficou seis horas e meia, e saiu às quatro e dez da manhã do dia treze, e o vigia anotou a saída no livro.',
    'E o incidente, segundo tudo o que já te contaram, foi na noite do dia doze.'
  ],
  ef:{flag:['achou_o_livro_de_acesso','fuji_saiu'],
      itens:{'Folha do livro de acesso':1},
      rep:{eixo:'bom',delta:6,motivo:'Achou a coluna de saída preenchida'},
      instabilidade:2,
      registrar:'O livro de acesso registra a SAÍDA do Dr. Fuji às 04h10 do dia 13/11/1996.',
      presagio:'Ele saiu. Quatro anos de luto e ele saiu, e está escrito num livro de portaria.'},
  escolhas:[
    {texto:'Levar isso pro Blaine. Correndo.', vai:'c14_correu_pro_blaine'},
    {texto:'Procurar o vigia Tokuda.', vai:'c14_tokuda'},
    {texto:'Arrancar a folha e guardar.', vai:'c14_correu_pro_blaine'},
    {texto:'Ficar ali sentado com isso um tempo.', vai:'c14_tokuda'}
  ]
},

c14_tokuda:{
  texto:[
    'Numa ilha de setecentas pessoas, achar o Sr. Tokuda leva quarenta minutos e três perguntas.',
    'Ele tem oitenta e um anos, mora com a filha, e está sentado na varanda vendo a rua, do jeito que velho de ilha faz.',
    'Quando você diz "livro de acesso", ele te olha com olho de quem enxerga mal e ouve bem.',
    '"Eu anotei a saída."',
    '"O senhor anotou."',
    '"Eu anotei porque ele saiu. Eu não ia anotar uma coisa que não aconteceu."',
    'Ele mexe na bengala.',
    '"Eu falei isso pra polícia, pro bombeiro, pro pessoal da empresa e pra uma moça de terno que veio de Saffron em dezembro."',
    '"E?"',
    '"E a moça de terno pegou o livro, olhou, e me disse que eu tinha me confundido de data porque eu sou velho."',
    'Ele ri sem nenhum humor.',
    '"Eu tinha setenta e sete anos e trabalhava naquela portaria há dezenove."'
  ],
  ef:{flag:['conheceu_tokuda','tokuda_confirma'],
      npc:{nome:'Sr. Tokuda', opiniao:5, memoria:'Anotou a saída do Dr. Fuji às 4h10 e foi chamado de velho confuso por uma mulher de terno de Saffron.'},
      rep:{eixo:'bom',delta:5,motivo:'Foi perguntar ao homem que escreveu a linha'},
      moral:-8,
      registrar:'O Sr. Tokuda confirma que o Dr. Fuji saiu do laboratório às 4h10 de 13/11/1996.',
      presagio:'Disseram que ele se confundiu porque é velho. Ele lembra a hora exata em quatro anos.'},
  escolhas:[
    {texto:'"Pra onde ele foi?"', vai:'c14_pra_onde_ele_foi'},
    {texto:'Levar isso pro Blaine.', vai:'c14_correu_pro_blaine'},
    {texto:'"O senhor viu alguém sair com ele?"', vai:'c14_pra_onde_ele_foi'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'}
  ]
},

c14_pra_onde_ele_foi:{
  texto:[
    '"Pra onde ele foi?"',
    'O Sr. Tokuda aponta com a bengala.',
    'Ele aponta pro vulcão.',
    '"Ele saiu e virou à direita, e à direita é a estrada da encosta, e a estrada da encosta não vai pra lugar nenhum a não ser pra cima."',
    '"Sozinho?"',
    'Ele demora.',
    '"Não."',
    'Ele apoia as duas mãos na bengala.',
    '"Eu tenho oitenta e um anos, meu filho, e eu vou morrer em uns cinco, e eu vou te contar porque eu não contei pra mais ninguém e tá ficando pesado."',
    '"Tinha uma coisa andando do lado dele."',
    '"Do lado. Não atrás e não na frente. Do lado, no mesmo passo."',
    '"E os dois subiram a estrada da encosta às quatro e dez da manhã e eu fiquei na portaria e não segui."',
    'Ele olha as próprias mãos.',
    '"E faz quatro anos que eu penso que eu devia ter seguido."'
  ],
  ef:{flag:['subiram_juntos','sabe_que_subiram'],
      npc:{nome:'Sr. Tokuda', opiniao:8, memoria:'Viu o Dr. Fuji subir a estrada da encosta às 4h10 com alguma coisa andando do lado dele, no mesmo passo.'},
      rep:{eixo:'bom',delta:6,motivo:'Perguntou pra onde ele foi'},
      instabilidade:2, moral:-10,
      registrar:'O Dr. Fuji subiu o vulcão às 4h10 com alguma coisa andando ao lado dele, no mesmo passo.',
      presagio:'Do lado. No mesmo passo. Não atrás, não na frente.'},
  escolhas:[
    {texto:'Subir o vulcão agora.', vai:'c14_vulcao'},
    {texto:'Buscar o Blaine antes.', vai:'c14_correu_pro_blaine'},
    {texto:'"Por que o senhor não contou?"', vai:'c14_correu_pro_blaine'},
    {texto:'Levar o Tokuda pra falar com o Blaine.', vai:'c14_correu_pro_blaine'}
  ]
},

c14_correu_pro_blaine:{
  texto:[
    'Você atravessa Cinnabar correndo, que é uma coisa que ninguém faz em Cinnabar, e quatro pessoas te veem correr e uma delas grita perguntando se aconteceu alguma coisa.',
    'Você acha o Blaine na varanda da casa do Fuji, na cadeira de balanço, com a garrafa térmica.',
    'E você mostra a folha do livro de acesso.',
    'Ele lê a linha.',
    'Lê de novo.',
    'E depois lê pela terceira vez, com o dedo em cima da coluna de saída, e o dedo dele treme de um jeito que não é de idade.',
    '"Quatro e dez."',
    '"Quatro e dez."',
    d=>d.flags.subiram_juntos ? '"E o Tokuda diz que os dois subiram a estrada da encosta."\n"Os dois?"\n"Os dois."\nEle se levanta da cadeira de balanço de uma vez, sem apoiar em nada, o que ele não faz há uns dez anos.' :
       'Ele levanta da cadeira sem apoiar em nada, o que ele não faz há uns dez anos.',
    '"Quarenta anos de ginásio dentro daquele vulcão."',
    '"Quarenta anos, meu filho, e eu nunca subi até a cratera."'
  ],
  ef:{flag:['blaine_sabe_da_saida','blaine_vai_subir'],
      npc:{nome:'Blaine', opiniao:10, memoria:'Leu três vezes a linha da saída às 4h10 e levantou da cadeira sem apoiar.'},
      rep:{eixo:'bom',delta:5,motivo:'Atravessou a ilha correndo com uma folha de papel'},
      moral:10, instabilidade:1,
      registrar:'Blaine soube que o amigo saiu vivo do laboratório e subiu o vulcão.',
      presagio:'Quarenta anos de ginásio dentro do vulcão e ele nunca subiu até a cratera.'},
  escolhas:[
    {texto:'Subir o vulcão com ele.', vai:'c14_vulcao'},
    {texto:'"O senhor não precisa subir."', vai:'c14_vulcao'},
    {texto:'Ir buscar o Tokuda também.', vai:'c14_vulcao'},
    {texto:'Ir ver o acervo antes.', vai:'c14_ginasio_por_dentro'}
  ]
},

c14_saida_lab:{
  texto:[
    'Ao sair do laboratório, você percebe que a fumaça do vulcão está mais densa do que quando você chegou.',
    'E vermelha.',
    'Fumaça não é vermelha. Fumaça é cinza, ou branca, ou preta se for borracha.',
    'Vermelha é outra coisa.'
  ],
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'},
    {texto:'Procurar quem trabalhou no laboratório.', vai:'c14_selma'},
    {texto:'Voltar pro subsolo.', vai:'c14_subsolo'}
  ]
},

c14_vulcao:{
  texto:[
    'A subida leva quase quatro horas por uma estrada de encosta que foi de terra batida e hoje é pedra solta.',
    d=>d.flags.blaine_vai_subir ? 'Blaine sobe com você e leva cinco horas e vinte, porque ele tem setenta e dois anos, e ele para nove vezes e xinga em todas, e ele não aceita ajuda em nenhuma.' : '',
    'O chão fica quente através da sola do sapato no último terço, e nos últimos quatrocentos metros tem fumarola saindo de fenda no chão, e o cheiro de enxofre fica tão forte que arde no olho.',
    'Na borda da cratera, o calor deforma o ar e faz o horizonte inteiro tremer.',
    'A cratera tem uns duzentos metros de diâmetro e não tem lava à vista — tem uma crosta escura com veios vermelhos, como brasa de carvão coberta de cinza.',
    'E tem alguma coisa pousada na borda do outro lado.',
    'Grande. Parada. Com o corpo inteiro parecendo brasa que não apaga.',
    'Moltres.',
    'Solto por Red há dois anos e nunca mais visto por ninguém que soubesse contar direito.',
    'E ele já estava olhando pra você antes de você chegar.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(146); L.encontros++; return [{tipo:'mundo',texto:'Moltres, uma das três Aves Lendárias de Kanto. Solto por Red. Nunca capturado desde então.'}]; },
      flag:'achou_moltres',
      registrar:'Encontrou Moltres na cratera do vulcão de Cinnabar.',
      presagio:'Ele já estava olhando antes de você chegar. Pensa em quanto tempo antes.'},
  escolhas:[
    {texto:'Ficar parado. Só olhar.', vai:'c14_olhar'},
    {texto:'Procurar sinal de que alguém esteve aqui.', vai:'c14_procurou_sinal', cond:d=>!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu},
    {texto:'Oferecer comida e recuar devagar.', vai:'c14_comida', cond:d=>Estado.contaItem('Ração')>0},
    {texto:'Atacar. Uma chance dessas não se repete.', vai:'c14_luta_moltres'},
    {texto:'Descer o vulcão sem fazer nada.', vai:'c14_desceu'}
  ]
},

c14_procurou_sinal:{
  texto:[
    'Você anda a borda da cratera procurando, e é uma coisa idiota de se fazer com um lendário a duzentos metros olhando.',
    'Ele não te impede.',
    'Leva quarenta minutos e você acha no lado leste, num abrigo natural de rocha onde a fumarola não chega.',
    'Uma mochila.',
    'Mochila de lona, velha, com a alça arrebentada e a lona rachada pelo sol de quatro anos, e dentro dela: uma garrafa térmica, um casaco enrolado, e um par de óculos de grau numa capinha rígida.',
    'Óculos de grau.',
    'E ao lado da mochila, no chão de rocha, encostada na parede do abrigo, uma pedra vulcânica de uns quarenta centímetros que alguém pôs ali de pé, de propósito, com outras duas menores em cima.',
    'Três pedras empilhadas.',
    'Isso não é geologia. Isso é sinalização.',
    'Alguém empilhou três pedras nesse abrigo pra marcar que alguém esteve aqui.',
    d=>d.flags.blaine_vai_subir ? 'Blaine chega no abrigo dez minutos depois de você, ofegante, e vê os óculos antes de ver qualquer outra coisa.\nEle senta no chão de rocha.\n"Esse é o de leitura."' : ''
  ],
  ef:{flag:['achou_a_mochila_do_fuji','sabe_que_ele_chegou'],
      itens:{'Óculos de leitura':1},
      rep:{eixo:'bom',delta:6,motivo:'Andou a borda de uma cratera procurando'},
      moral:-15, instabilidade:1,
      registrar:'Na borda da cratera há a mochila do Dr. Fuji e três pedras empilhadas.',
      presagio:'Três pedras empilhadas. Alguém marcou. E não foi ele quem empilhou a terceira.'},
  escolhas:[
    {texto:'Olhar dentro da garrafa térmica.', vai:'c14_garrafa'},
    {texto:'Ficar parado e olhar Moltres.', vai:'c14_olhar'},
    {texto:'Levar a mochila.', vai:'c14_levou_a_mochila'},
    {texto:'Descer e contar pra ilha.', vai:'c14_desceu'}
  ]
},

c14_garrafa:{
  texto:[
    'A garrafa térmica está fechada e a rosca cede com dificuldade.',
    'Dentro não tem café.',
    'Tem papel.',
    'Um rolo de papel enfiado dentro de uma garrafa térmica, que é a coisa mais improvisada e mais esperta que alguém podia fazer com um documento numa borda de vulcão: térmica isola, rosca veda, e quatro anos depois o papel está seco e legível.',
    'É uma folha só, arrancada de caderno, escrita dos dois lados.',
    'A letra é a mesma dos cadernos.',
    '**"Dia 252. Subimos. Ele quis subir e eu fui junto porque foi a primeira coisa que ele escolheu sem me perguntar se podia."**',
    '**"Passamos a noite aqui. Não conversamos quase nada. Ele ficou olhando a cratera por seis horas e eu fiquei do lado."**',
    '**"De manhã ele me perguntou se eu ia embora e eu disse que sim, que eu ia dar aula numa escola, e ele perguntou o que é uma escola."**',
    '**"Eu expliquei."**',
    '**"Ele disse: é isso que você fez comigo."**',
    '**"E eu disse: não. Escola é quando o outro também pode perguntar."**',
    '**"E ele ficou quieto muito tempo e depois disse: então você nunca foi minha escola."**',
    '**"E ele tem razão, e eu não tenho como consertar isso, e é a última coisa que eu escrevo."**',
    '**"Vou deixar aqui porque ele pediu que eu não levasse nada escrito. Ele tem o direito de pedir. É a primeira coisa que ele me pede que eu posso cumprir."**',
    '**"A. F."**'
  ],
  ef:{flag:['achou_a_folha','leu_o_dia_252'],
      itens:{'Folha da garrafa térmica':1},
      rep:{eixo:'bom',delta:7,motivo:'Abriu a garrafa térmica'},
      moral:-20, instabilidade:2,
      registrar:'Dia 252: os dois subiram o vulcão juntos e passaram a noite ali. É a última coisa que o Dr. Fuji escreveu.',
      presagio:'"Escola é quando o outro também pode perguntar." Guarde a definição.'},
  escolhas:[
    {texto:'Ler em voz alta pro Blaine.', vai:'c14_leu_pro_blaine', cond:d=>!!d.flags.blaine_vai_subir},
    {texto:'Guardar e descer.', vai:'c14_desceu'},
    {texto:'Ficar parado e olhar Moltres.', vai:'c14_olhar'},
    {texto:'Devolver a folha à garrafa e fechar.', vai:'c14_devolveu_a_folha'}
  ]
},

c14_devolveu_a_folha:{
  texto:[
    'Você enrola a folha do jeito que ela estava, enfia de volta na garrafa térmica, e rosqueia.',
    'E põe a garrafa de volta na mochila, e a mochila de volta encostada na parede do abrigo, e as três pedras continuam empilhadas onde estavam.',
    'Ele pediu pra não levar nada escrito.',
    'Ele pediu, e a folha diz que ele pediu, e a folha está no lugar onde foi deixada porque foi isso que combinaram.',
    'Você não é parte desse combinado e não vai desfazer ele.',
    d=>d.flags.blaine_vai_subir ? 'Blaine olha você fazer isso, do chão do abrigo, com os óculos de leitura na mão.\nEle não diz nada e assente uma vez.' : ''
  ],
  ef:{flag:['devolveu_a_folha','respeitou_o_pedido'],
      perdeItens:{'Folha da garrafa térmica':1},
      rep:{eixo:'bom',delta:6,motivo:'Devolveu a folha ao lugar onde foi deixada'},
      moral:20,
      registrar:'Devolveu a folha à garrafa térmica e deixou a mochila no abrigo.',
      presagio:'Você não é parte do combinado. Poucas pessoas entendem isso.'},
  escolhas:[
    {texto:'Ficar parado e olhar Moltres.', vai:'c14_olhar'},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Oferecer comida.', vai:'c14_comida', cond:d=>Estado.contaItem('Ração')>0},
    {texto:'Empilhar uma quarta pedra.', vai:'c14_quarta_pedra'}
  ]
},

c14_quarta_pedra:{
  texto:[
    'Você acha uma pedra de uns quinze centímetros e põe em cima das três.',
    'Fica torto. Você tira e põe de novo três vezes até ficar de pé.',
    'Quatro pedras empilhadas na borda de uma cratera de vulcão numa ilha de setecentos habitantes.',
    'Ninguém nunca vai saber o que isso quer dizer, e você não vai explicar pra ninguém, e daqui a trinta anos alguém vai subir aqui e achar quatro pedras e vai achar que é geologia.',
    'E tudo bem.',
    d=>d.flags.blaine_vai_subir ? 'Blaine levanta do chão do abrigo, com dificuldade, procura uma pedra, e põe a quinta.\nE senta de novo.\nE os dois ficam olhando cinco pedras empilhadas por um tempo bem longo.' : ''
  ],
  ef:{flag:['empilhou_a_pedra'],
      rep:{eixo:'bom',delta:4,motivo:'Empilhou a quarta pedra'},
      moral:20,
      registrar:'Empilhou uma quarta pedra no abrigo da cratera.',
      presagio:'Daqui a trinta anos alguém vai achar que é geologia. E tudo bem.'},
  escolhas:[
    {texto:'Ficar parado e olhar Moltres.', vai:'c14_olhar'},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Oferecer comida.', vai:'c14_comida', cond:d=>Estado.contaItem('Ração')>0},
    {texto:'Ficar até o sol nascer.', vai:'c14_olhar'}
  ]
},

c14_leu_pro_blaine:{
  texto:[
    'Você lê a folha em voz alta, na borda de uma cratera, pra um homem de setenta e dois anos sentado no chão de um abrigo de rocha com um par de óculos de leitura na mão.',
    'Ele ouve inteiro sem interromper.',
    'Na parte do "eu ia dar aula numa escola", ele fecha os olhos.',
    'Na parte do "então você nunca foi minha escola", ele abre.',
    'Quando você termina, ele não fala nada por uns três minutos.',
    'Depois:',
    '"Ele não morreu no laboratório."',
    '"Não."',
    '"Ele morreu aqui?"',
    'E aí você tem que dizer a coisa difícil, que é a verdade:',
    '"Eu não sei. A folha acaba no dia duzentos e cinquenta e dois de manhã."',
    'Blaine olha a mochila.',
    '"A mochila tá aqui."',
    '"Tá."',
    '"E ele não desceu a estrada, porque se ele descesse a estrada alguém teria visto. Setecentas pessoas, meu filho."',
    'Ele põe os óculos de leitura no bolso da camisa, com muito cuidado.',
    '"Então é isso."',
    'E levanta.',
    '"Pronto. Agora eu posso parar."'
  ],
  ef:{flag:['blaine_pode_parar','leu_o_dia_252'],
      npc:{nome:'Blaine', opiniao:10, memoria:'Ouviu a última folha do amigo lida em voz alta na borda da cratera e disse "agora eu posso parar".'},
      rep:{eixo:'bom',delta:8,motivo:'Deu a um velho o enterro que ele não teve'},
      moral:30, instabilidade:-1,
      registrar:'Blaine ouviu a última folha do Dr. Fuji e conseguiu parar.',
      presagio:'"Agora eu posso parar." Foi isso que você veio fazer em Cinnabar e você não sabia.'},
  escolhas:[
    {texto:'Empilhar uma quarta pedra.', vai:'c14_quarta_pedra'},
    {texto:'Devolver a folha à garrafa.', vai:'c14_devolveu_a_folha'},
    {texto:'Ficar parado e olhar Moltres.', vai:'c14_olhar'},
    {texto:'Descer com ele.', vai:'c14_desceu'}
  ]
},

c14_levou_a_mochila:{
  texto:[
    'Você põe a mochila do Fuji dentro da sua.',
    'Ela pesa quase nada — uma garrafa térmica, um casaco e um par de óculos numa capinha — e ainda assim muda o equilíbrio da sua mochila de um jeito que você vai sentir a descida inteira.',
    d=>d.flags.blaine_vai_subir ? 'Blaine não impede.\n"Devolve pra ilha", ele diz. "Não pra mim. Pra ilha."\n"Como assim pra ilha?"\n"A escola daqui tem uma sala de memória com uma vitrine e três coisas dentro. Bota lá."' :
       'As três pedras empilhadas continuam onde estavam, e você olha elas uma última vez antes de descer, e não empilha a quarta porque não te ocorre.'
  ],
  ef:{flag:['tem_a_mochila_do_fuji'],
      itens:{'Mochila de lona do Dr. Fuji':1},
      rep:{eixo:'bom',delta:2,motivo:'Trouxe de volta o que estava numa borda de cratera'},
      registrar:'Levou a mochila do Dr. Fuji da borda da cratera.',
      presagio:'"Pra ilha. Não pra mim." Ele já pensou nisso.'},
  escolhas:[
    {texto:'Descer e entregar na escola.', vai:'c14_escola'},
    {texto:'Ficar parado e olhar Moltres.', vai:'c14_olhar'},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Devolver a mochila ao abrigo.', vai:'c14_devolveu_a_folha'}
  ]
},

c14_escola:{
  texto:[
    'A Escola Municipal de Cinnabar tem noventa e um alunos, três salas e uma sala de memória com uma vitrine de vidro e três coisas dentro: uma pedra-pomes grande, uma foto da inauguração em mil novecentos e sessenta e um, e um remo.',
    'A diretora tem trinta e poucos anos e estudou nessa escola.',
    'Você conta o que é a mochila e de quem era, e ela ouve tudo de pé, no corredor, com o sinal tocando no meio.',
    'E aí ela faz uma pergunta que você não esperava:',
    '"Ele era bom?"',
    '"Como assim?"',
    '"Meu pai fala dele. Diz que ele dava palestra aqui uma vez por ano, sobre vulcão, pros terceiros anos."',
    'Ela abre a vitrine.',
    '"Ele era bom de explicar?"',
    d=>d.flags.leu_o_dia_252 ? '"Ele era. Ele explicou o que é uma escola pra uma coisa que nunca tinha visto uma."' : '"Pelo que eu li, era."',
    'Ela põe a mochila na vitrine, ao lado do remo, e fecha.',
    'E escreve numa etiqueta de papel, com caneta, e cola no vidro:',
    '**"Mochila do Prof. Amauri Fuji, que dava aula de vulcão aqui."**',
    'Professor.',
    'Ela escreveu professor.'
  ],
  ef:{flag:['entregou_a_mochila','fuji_virou_professor'],
      perdeItens:{'Mochila de lona do Dr. Fuji':1},
      npc:{nome:'Diretora da escola de Cinnabar', opiniao:6, memoria:'Pôs a mochila do Dr. Fuji na vitrine da sala de memória e escreveu "Prof." na etiqueta.'},
      rep:{eixo:'bom',delta:7,motivo:'Fez um homem virar o que ele queria ser'},
      moral:30,
      registrar:'A mochila do Dr. Fuji está na vitrine da escola de Cinnabar, com a etiqueta "Prof.".',
      presagio:'Ela escreveu professor. Ele circulou a vaga e nunca chegou a assinar o contrato, e agora está escrito.'},
  escolhas:[
    {texto:'Ir contar pro Blaine.', vai:'c14_fim'},
    {texto:'Ir embora de Cinnabar.', vai:'c14_fim'},
    {texto:'Voltar ao vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'}
  ]
},

/* ─────────────── MOLTRES ─────────────── */

c14_olhar:{
  texto:[
    'Você fica parado.',
    'Onze minutos. Ele fica parado onze minutos.',
    'O calor da cratera passa pelo meio de vocês dois em onda e deforma o ar, e ele fica com as bordas trêmulas, como coisa vista através de fogo de churrasqueira.',
    'Em algum momento você para de achar que está sendo avaliado e começa a achar que está sendo lembrado — como se ele estivesse arquivando o seu rosto pra usar depois.',
    d=>d.flags.achou_a_mochila_do_fuji ? 'E aí ele faz uma coisa: ele vira a cabeça, devagar, na direção do abrigo de rocha do lado leste. Onde está a mochila. Onde estão as três pedras.\nE volta a olhar você.\nEle sabe que está ali. Ele provavelmente viu ser deixada.' : '',
    'Depois ele abre as asas, e o calor que sai disso te derruba de joelhos, e quando você levanta a cratera está vazia.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(146); L.disposicao='neutro'; return []; },
      rep:{eixo:'bom',delta:2,motivo:'Encontrou um lendário e não tentou pegá-lo'},
      moral:8,
      flag:'respeitou_moltres',
      registrar:'Ficou onze minutos parado olhando Moltres e ele foi embora.',
      presagio:'Ele olhou o abrigo. Ele viu tudo o que aconteceu ali em quatro anos.'},
  escolhas:[
    {texto:'Procurar sinal de quem esteve aqui.', vai:'c14_procurou_sinal', cond:d=>!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Ficar até o sol nascer.', vai:'c14_desceu'},
    {texto:'Descer e ir ao ginásio.', vai:'c14_ginasio'}
  ]
},

c14_comida:{
  texto:[
    'Você abre o pacote de ração, coloca na pedra, e anda pra trás sem virar as costas.',
    'É um gesto ridículo e você sabe que é ridículo enquanto faz: você está oferecendo comida de loja, com código de barras e prazo de validade, a uma coisa que existe desde antes das cidades terem nome.',
    'Ele desce.',
    'Olha a ração. Olha você. E come.',
    'Não porque precisa — uma coisa que se alimenta de calor geotérmico não precisa de ração — mas porque entendeu o que o gesto queria dizer, e responder a um gesto é a única coisa que um gesto pede.',
    'Quando ele levanta voo, o rastro de calor passa a dois metros de você e não te queima.',
    'Isso foi escolha dele e foi precisa, e é a coisa mais assustadora da tarde: ele controla até o ponto de não te queimar a dois metros.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Ração'); const L=Estado.lend(146); L.disposicao='passivo'; return [{tipo:'mundo',texto:'Moltres agora te vê como não-ameaça. Isso tem valor.'}]; },
      rep:{eixo:'bom',delta:3,motivo:'Tratou bem uma Ave Lendária'},
      moral:10,
      flag:'moltres_amigo', registrar:'Moltres aceitou comida de você e ficou passivo.'},
  escolhas:[
    {texto:'Procurar sinal de quem esteve aqui.', vai:'c14_procurou_sinal', cond:d=>!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu},
    {texto:'Ficar parado e olhar.', vai:'c14_olhar'},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Jogar a bola agora que ele desceu.', vai:'c14_luta_moltres'}
  ]
},

c14_luta_moltres:{
  texto:[
    'Você joga a primeira bola sem nem tentar enfraquecer.',
    'A bola derrete no ar antes de chegar. Literalmente derrete: o plástico deforma a meio metro dele e cai no chão como uma gota.',
    'Moltres desce da borda e a cratera inteira fica dez graus mais quente, e o ar fica com aquela densidade de forno aberto.',
    'E você entende, tarde, que a coisa não estava te ameaçando em nenhum momento antes desse.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(146); L.ataquesSofridos++; return []; },
      moral:-10},
  batalha:{dex:146, nivel:50, tipo:'lendario', fuga:true, ambiente:'vulcao',
           vitoria:'c14_pos_moltres', derrota:'c14_pos_moltres', fuga2:'c14_pos_moltres',
           captura:'c14_capturou_moltres', gameover:'gameover'}
},

c14_pos_moltres:{
  texto:[
    'Acabe como acabar, uma coisa fica:',
    'ele viu o seu rosto enquanto você tentava.',
    'Aves lendárias não esquecem rosto.',
    'Foi por isso que Red soltou as três em vez de ficar com elas: porque uma coisa que lembra rosto e que vive setecentos anos é uma dívida que não vence.'
  ],
  ef:{executar:d=>{
        const L = Estado.lend(146);
        if (L.ataquesSofridos >= 2){ L.disposicao='hostil'; return [{tipo:'perigo', texto:'Moltres agora é hostil a você. Ele vai te procurar.'}]; }
        return [{tipo:'mundo', texto:'Moltres foi embora. Desconfiado.'}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou uma Ave Lendária'}},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c14_luta_moltres'},
    {texto:'Parar. Procurar sinal de quem esteve aqui.', vai:'c14_procurou_sinal', cond:d=>!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu},
    {texto:'Parar e ficar olhando.', vai:'c14_olhar'},
    {texto:'Descer o vulcão.', vai:'c14_desceu'}
  ]
},

c14_capturou_moltres:{
  texto:[
    'A bola fecha.',
    'E o vulcão fica em silêncio de um jeito que vulcão não fica.',
    'As fumarolas param. As três que estavam soltando vapor a trinta metros de você param ao mesmo tempo, e o chão para de fazer aquele ruído contínuo de coisa muito grande respirando devagar.',
    'Você segura na mão uma coisa que existia antes de Kanto ter nome.',
    'A trezentos quilômetros daqui, no norte, uma tempestade que não estava em mapa nenhum começa a se formar em céu limpo.',
    'E numa caverna de gelo, outra coisa abre os olhos.'
  ],
  ef:{instabilidade:3, flag:'capturou_moltres', moral:-10,
      registrar:'Capturou Moltres na cratera de Cinnabar. As fumarolas pararam.',
      presagio:'As três aves são um sistema. Você acabou de tirar uma parte dele.'},
  escolhas:[
    {texto:'Soltar. Agora, antes de descer.', vai:'c14_soltou_moltres'},
    {texto:'Descer com ele.', vai:'c14_fim', ef:{flag:'desceu_com_moltres', rep:{eixo:'ruim',delta:2,motivo:'Desceu o vulcão com uma Ave Lendária na mochila'}}},
    {texto:'Ficar sentado na borda pensando.', vai:'c14_soltou_moltres'},
    {texto:'Procurar sinal de quem esteve aqui antes de descer.', vai:'c14_procurou_sinal', cond:d=>!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu}
  ]
},

c14_soltou_moltres:{
  texto:[
    'Você abre a bola na mesma pedra onde ele estava.',
    'Ele sai e não vai embora na hora. Fica na pedra, no mesmo lugar, na mesma posição, como se nada tivesse acontecido — e as fumarolas voltam a soltar vapor em menos de um minuto, uma por uma.',
    'E depois ele vira a cabeça e olha você.',
    'E é um olhar diferente do de antes, e você vai passar uns capítulos tentando decidir se o que mudou foi pra melhor ou pra pior.'
  ],
  ef:{flag:'soltou_moltres', limpaFlag:'capturou_moltres',
      executar:d=>{
        const p = [...d.time, ...d.pc].find(x=>x.dex===146);
        if (p) return Captura.soltar(p).map(e=>({tipo:e.tipo, texto:e.texto}));
        return [];
      },
      rep:{eixo:'bom',delta:3,motivo:'Soltou um lendário antes de descer com ele'},
      moral:10, instabilidade:-1,
      registrar:'Soltou Moltres na cratera. As fumarolas voltaram.'},
  escolhas:[
    {texto:'Ficar parado e olhar.', vai:'c14_olhar'},
    {texto:'Procurar sinal de quem esteve aqui.', vai:'c14_procurou_sinal', cond:d=>!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Oferecer comida.', vai:'c14_comida', cond:d=>Estado.contaItem('Ração')>0}
  ]
},

c14_desceu:{
  texto:[
    'Você desce sem olhar pra trás.',
    'Leva três horas e quarenta, e nas três horas e quarenta você pensa na mesma coisa em loop.',
    d=>d.flags.blaine_vai_subir ? 'Blaine desce do lado, devagar, e não fala nada nas três horas e quarenta, e nos últimos quatrocentos metros ele aceita apoio no seu ombro pela primeira vez.' :
       'Você não sabe se o que sentiu foi respeito ou covardia, e provavelmente nunca vai saber, porque as duas coisas parecem exatamente iguais de dentro.',
    'Lá embaixo, a ilha continua: setecentas pessoas, uma rua, um ferry duas vezes por semana.'
  ],
  ef:{flag:'desceu_o_vulcao'},
  escolhas:[
    {texto:'Voltar para o porto.', vai:'c14_fim'},
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Subir de novo amanhã.', vai:'c14_vulcao'}
  ]
},

c14_fim:{
  texto:[
    'No porto, o ferry de sábado está atrasado quarenta minutos e tem um homem de terno sentado no banco de espera.',
    'Só ele, e você, e o mar.',
    'Ele não olha pra você quando fala.',
    d=>{
      if (d.flags.tem_o_caderno_sete || d.flags.pegou_caderno) return '"Esse caderno não é seu." Ele levanta quando o barco chega. "Mas também não é meu, e a diferença entre as duas frases é a única coisa que eu não consigo resolver por telefone. Boa leitura."';
      if (d.flags.queimou_caderno) return '"Obrigado." Ele levanta quando o barco chega. "Sério. Você me poupou uma viagem e um relatório."';
      if (d.flags.vai_entregar_a_prado || d.flags.vai_entregar_comissao || d.flags.ivone_tem_cinnabar) return '"Incorporação de acervo." Ele levanta quando o barco chega. "Isso é um caminho que o jurídico não previu, e eu trabalho lá há nove anos, e eu queria dizer que é elegante."';
      if (Estado.lendariosCapturados().length) return '"A Liga Pokémon gostaria de conversar. Não hoje." Ele levanta quando o barco chega. "Só queria que você soubesse que a gente sabe."';
      return '"Você subiu o vulcão." Ele levanta quando o barco chega. "Pouca gente sobe o vulcão e desce igual."';
    },
    'Ele embarca primeiro.',
    'No barco inteiro, que leva duas horas e vinte até Fuchsia, ele não senta perto de você nenhuma vez, e desce primeiro, e some na rua do cais sem olhar pra trás.',
    d=>{
      if (d.flags.blaine_pode_parar) return 'E em Cinnabar, atrás de você, tem um homem de setenta e dois anos que vai conseguir dormir hoje.';
      if (d.flags.fuji_virou_professor) return 'E na sala de memória de uma escola de noventa e um alunos, numa vitrine com um remo e uma pedra-pomes, tem uma mochila de lona com uma etiqueta que diz Prof.';
      if (d.flags.queimou_caderno) return 'E em Cinnabar, atrás de você, tem um homem de setenta e dois anos que subiu quarenta metros de corredor sozinho e não desceu mais.';
      if (d.flags.blaine_aliado) return 'E em Cinnabar, atrás de você, tem cinco caixas de arquivo que vão sair da ilha pela primeira vez em quatro anos — desta vez pela porta.';
      return 'E em Cinnabar, atrás de você, tem uma casa com uma xícara na pia e um jornal aberto na página seis.';
    },
    'O mar entre Cinnabar e o continente é o trecho mais fundo de Kanto.',
    'Você fica na popa olhando a ilha diminuir, e o vulcão é a última coisa a sumir, porque é a coisa mais alta.'
  ],
  fim:true, resumo:'Capítulo 14 concluído — você leu o que ninguém devia ter escrito, e devolveu o que ninguém devia ter levado.'

},

c14_viu_o_tanque:{
  texto:[
    '"A senhora chegou a ver o que tinha no tanque?"',
    'Ela bebe o café até o fim antes de responder, e devolve a xícara por cima do muro.',
    '"Uma vez."',
    '"Uma vez?"',
    '"Em noventa e cinco, num sábado, porque a porta ficou aberta e eu passei pra pegar o carrinho de limpeza que o menino tinha deixado lá dentro."',
    'Ela ajeita o portão que não abre.',
    '"Eu olhei porque qualquer pessoa olha, meu bem. Não adianta ninguém dizer que não ia olhar."',
    '"E?"',
    '"E tinha uma criança grande dentro de um vidro com água."',
    'Ela corrige.',
    '"Não era criança. Eu sei que não era criança. Mas era do tamanho de uma criança grande e tava com as mãos no vidro."',
    'Pausa.',
    '"E olhou pra mim."',
    '"E a senhora fez o quê?"',
    '"Eu acenei."',
    'Ela dá de ombros com uma vergonha enorme.',
    '"Eu acenei, meu bem. Eu tenho três filhos. Eu vi uma coisa do tamanho de uma criança grande olhando pra mim por um vidro e eu acenei antes de pensar."',
    '"E ele?"',
    '"Tirou uma mão do vidro e mexeu."',
    'Ela olha o chão.',
    '"E eu peguei o carrinho e saí, e eu nunca mais entrei naquele corredor, e faz cinco anos que eu acordo com isso umas duas vezes por mês."'
  ],
  ef:{flag:['selma_acenou','ouviu_historia_lab'],
      npc:{nome:'Sra. Maeda', opiniao:6, memoria:'Acenou para Mewtwo por um vidro em 1995 e ele acenou de volta. Acorda com isso duas vezes por mês.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou se ela tinha visto'},
      moral:-15,
      registrar:'Sra. Maeda acenou para o que estava no tanque em 1995, e ele acenou de volta.',
      presagio:'Ela acenou antes de pensar. Foi a única pessoa naquele prédio que fez isso.'},
  escolhas:[
    {texto:'"O senhor Fuji morreu?"', vai:'c14_fuji_morreu'},
    {texto:'"E o incêndio de semana passada?"', vai:'c14_incendio_da_semana'},
    {texto:'"A senhora contou isso pra alguém?"', vai:'c14_selma_contou'},
    {texto:'Agradecer e ir ao laboratório.', vai:'c14_lab'}
  ]
},

c14_selma_contou:{
  texto:[
    '"A senhora contou isso pra alguém?"',
    '"Contei pro meu marido em noventa e cinco e ele disse que eu tinha visto errado."',
    '"E depois?"',
    '"E depois pra mais ninguém, porque contar uma coisa dessas duas vezes e ouvir duas vezes que eu vi errado ia ser demais."',
    'Ela pega a xícara de volta e segura com as duas mãos.',
    '"Você é o segundo."',
    '"Segundo?"',
    '"O primeiro foi o Doutor Bruno, em noventa e sete."',
    'Ela olha a rua.',
    '"Ele bateu aqui uma noite, sentou nesse degrau, e ficou umas duas horas me perguntando se eu tinha visto alguma coisa em todos aqueles anos de limpeza."',
    '"E a senhora contou?"',
    '"Contei."',
    '"E ele disse o quê?"',
    'Ela demora.',
    '"Ele chorou, meu bem. Um homem de setenta anos sentado no meu degrau."',
    '"E depois ele disse: “então ele conhecia mais gente do que a gente achava”."'
  ],
  ef:{flag:['selma_e_blaine','sabe_do_blaine'],
      npc:{nome:'Sra. Maeda', opiniao:8, memoria:'Contou ao Blaine em 1997 sobre o aceno, e ele chorou no degrau dela.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou se ela tinha contado'},
      moral:-8,
      registrar:'Blaine ouviu de Sra. Maeda em 1997 sobre o aceno. "Então ele conhecia mais gente do que a gente achava."',
      presagio:'Ele conhecia mais gente do que a gente achava. Some as pessoas desse capítulo.'},
  escolhas:[
    {texto:'"O senhor Fuji morreu?"', vai:'c14_fuji_morreu'},
    {texto:'"E o incêndio de semana passada?"', vai:'c14_incendio_da_semana'},
    {texto:'Ir procurar o Blaine.', vai:'c14_ginasio'},
    {texto:'Ir ao laboratório.', vai:'c14_lab'}
  ]
},

c14_incendio_da_semana:{
  texto:[
    '"E o incêndio de semana passada?"',
    'Ela faz uma cara.',
    '"Ah, isso eu vi."',
    '"A senhora viu?"',
    '"Minha casa é essa aqui, meu bem. O prédio é ali ó." Ela aponta e é mesmo: dá pra ver o muro do laboratório do portão dela. "Eu durmo mal e eu fico na janela."',
    '"Que horas?"',
    '"Três e pouco da manhã de sábado. Eram dois homens e um carro alugado."',
    '"E a senhora chamou o bombeiro?"',
    '"Cinnabar não tem bombeiro, meu bem. Tem uma brigada de sete voluntários e eu liguei pro João da brigada, e o João chegou em onze minutos, que é rápido."',
    'Ela ajeita a xícara.',
    '"E os dois homens já tinham ido embora, e o fogo já tava só na ala leste, e o João entrou e apagou em quarenta minutos com mangueira de jardim porque a ala leste é pequena."',
    'Ela olha pra você.',
    '"Eles não queriam queimar o prédio, meu bem. Eles queriam queimar uma sala."'
  ],
  ef:{flag:['selma_viu_o_incendio','sabe_que_foi_forjado'],
      npc:{nome:'Sra. Maeda', opiniao:5, memoria:'Viu os dois homens e o carro alugado às 3h de sábado, e chamou o João da brigada.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou a quem mora do lado'},
      registrar:'Sra. Maeda viu dois homens e um carro alugado às 3h de sábado. O fogo foi contido em 40 minutos.',
      presagio:'Eles queriam queimar uma sala. E a sala não tinha o que eles procuravam.'},
  escolhas:[
    {texto:'"A senhora sabe o nome deles?"', vai:'c14_barco_fretado'},
    {texto:'"O senhor Fuji morreu?"', vai:'c14_fuji_morreu'},
    {texto:'Ir ao laboratório ver a ala leste.', vai:'c14_lab'},
    {texto:'Ir procurar o João da brigada.', vai:'c14_lab'}
  ]

}

}}

);
