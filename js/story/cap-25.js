/* ------------------------------------------------------------
   ABERTURAS — a audiência é às dez. Dá pra chegar cedo demais,
   em cima da hora, ou acompanhado.
   ------------------------------------------------------------ */
const C25_ABERTURAS = ['c25_a_antessala', 'c25_ab_cedo_demais', 'c25_ab_em_cima_da_hora', 'c25_ab_o_corredor'];
function c25_cabe(id, d){ return true; }
function c25_abertura(d){ return Dados.escolher(C25_ABERTURAS.filter(id => c25_cabe(id, d))); }

/* ============================================================
   CAPÍTULO 25 — SEGUNDA, DEZ HORAS
   Saffron. A convocação chegou por telegrama, e o telegrama
   não dizia quem convocava.
   ============================================================ */
CAPITULOS.push(

{
num:25, titulo:'Segunda, Dez Horas', local:'Saffron — sala de audiência', ambiente:'cidade', nivelArea:57,
tom:'muito sombrio', entradas:C25_ABERTURAS,
inicio: d => c25_abertura(d),
cenas:{

c25_ab_cedo_demais:{
  texto:[
    'Você chega às oito e doze pra uma audiência das dez, o que é uma hora e quarenta e oito minutos de erro de cálculo que você cometeu de propósito.',
    'O prédio está aberto. A antessala está vazia. As seis cadeiras de plástico estão todas livres e você escolhe a do canto, de frente pra porta.',
    'A planta precisa de água e o relógio de parede atrasa, e nas próximas uma hora e quarenta e oito você vai olhar pros dois muitas vezes.',
    'Às oito e quarenta chega a recepcionista, que te vê sentad{o|a} e não se assusta.',
    d=>{ Nomes.apresentar('a recepcionista da Liga'); return 'Ela vira pra frente a plaquinha de acrílico da mesa, como faz toda manhã: LENA.'; },
    fala('a recepcionista da Liga', 'Audiência das dez?'),
    d=>fala(d.jogador.nome, 'Das dez.'),
    fala('a recepcionista da Liga', 'Tem café no fim do corredor. A máquina engole moeda mas devolve se você bater do lado.'),
    'Ela liga o computador e o computador leva quatro minutos pra ligar, e nos quatro minutos ela fica olhando pra tela preta.',
    'Duas pessoas esperando uma máquina, cada uma na sua.'
  ],
  ef:{flag:['chegou_na_audiencia','chegou_cedo_demais'],
      registrar:'Chegou uma hora e quarenta e oito minutos antes da audiência.'},
  escolhas:[
    {texto:'Regar a planta, que precisa de água.', vai:'c25_regou_a_planta'},
    {texto:'Ir pegar café no fim do corredor.', vai:'c25_ab_o_corredor'},
    {texto:'Ficar sentad{o|a} até dar dez.', vai:'c25_esperou_dar_dez'},
    {texto:'Perguntar à recepcionista quem convocou a audiência.', vai:'c25_ab_perguntou_a_recepcionista'}
  ]
},

c25_ab_perguntou_a_recepcionista:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem convocou essa audiência?'),
    'Ela olha a tela, que agora já ligou.',
    fala('a recepcionista da Liga', 'Aqui tá como "de ofício".'),
    d=>fala(d.jogador.nome, 'O que é "de ofício"?'),
    fala('a recepcionista da Liga', 'É quando não tem parte pedindo. A casa convoca sozinha.'),
    'Ela rola a tela.',
    fala('a recepcionista da Liga', 'É raro. Eu tô aqui há onze anos e vi umas cinco.'),
    d=>fala(d.jogador.nome, 'E as outras quatro?'),
    'Ela para de rolar.',
    fala('a recepcionista da Liga', 'Foram todas no mesmo ano. Oitenta e nove.'),
    'Ela olha pra você pela primeira vez desde que sentou.',
    fala('a recepcionista da Liga', 'Eu era estagiária. Eu servi o café das quatro.', 'baixo')
  ],
  ef:{flag:'audiencia_de_oficio',
      npc:{nome:'a recepcionista da Liga', opiniao:2, viuVoce:'Te contou que a última audiência de ofício foi em 1989.'},
      registrar:'A audiência foi convocada de ofício. As outras quatro da história da casa foram todas em 1989.',
      presagio:'Quatro audiências de ofício num ano só, e depois onze anos sem nenhuma.'},
  escolhas:[
    {texto:'Perguntar o que se decidiu nas quatro de oitenta e nove.', vai:'c25_ab_as_quatro_de_oitenta_e_nove'},
    {texto:'Regar a planta e esperar.', vai:'c25_regou_a_planta'},
    {texto:'Ficar sentad{o|a} até dar dez.', vai:'c25_esperou_dar_dez'}
  ]
},

c25_ab_as_quatro_de_oitenta_e_nove:{
  texto:[
    fala('a recepcionista da Liga', 'Eu tinha dezenove anos. Eu servia café e recolhia xícara.'),
    'Ela junta as mãos no balcão.',
    fala('a recepcionista da Liga', 'Eu não lembro do que decidiram. Eu lembro de como eles saíam.'),
    d=>fala(d.jogador.nome, 'Como?'),
    fala('a recepcionista da Liga', 'Rápido. As quatro. Nenhum deles ficou conversando no corredor.'),
    fala('a recepcionista da Liga', 'E em todas as quatro, quem saiu por último foi a mesma pessoa. Sozinha, sempre uns dez minutos depois.'),
    d=>fala(d.jogador.nome, 'Quem?'),
    'Ela balança a cabeça.',
    fala('a recepcionista da Liga', 'Uma mulher. Eu tinha dezenove anos e ela era a única que agradecia o café.'),
    fala('a recepcionista da Liga', 'É a única coisa que eu lembro dela e eu lembro há onze anos.')
  ],
  ef:{flag:'a_mulher_que_agradecia_o_cafe',
      registrar:'Nas quatro audiências de ofício de 1989, a última a sair foi sempre a mesma mulher.',
      presagio:'A única que agradecia o café, e a única que saía por último, sozinha.'},
  escolhas:[
    {texto:'Regar a planta e esperar dar dez.', vai:'c25_regou_a_planta'},
    {texto:'Ficar sentad{o|a} até dar dez.', vai:'c25_esperou_dar_dez'},
    {texto:'Ir pegar café no fim do corredor.', vai:'c25_ab_o_corredor'}
  ]
},

c25_ab_em_cima_da_hora:{
  texto:[
    'Você chega às nove e cinquenta e sete porque o ônibus atrasou, e chegar em cima da hora numa audiência é uma coisa que muda o seu corpo inteiro.',
    'Você sobe a escada em vez de esperar o elevador. Chega na antessala suando, com a mochila torta, e todo mundo já está sentado.',
    'Três pessoas em seis cadeiras. As três te olham.',
    d=>d.npcs['Blue']
      ? 'Blue está na terceira cadeira e levanta a sobrancelha pro seu estado, e não fala nada, o que da parte dele é um gesto de contenção heroico.'
      : 'Um rapaz da sua idade está na terceira cadeira e levanta a sobrancelha pro seu estado.',
    'Uma mulher de uns cinquenta com uma pasta de couro olha o relógio de parede, que atrasa, e depois o relógio de pulso dela, que não.',
    'Um homem de terno, com um crachá azul, não levanta os olhos do jornal.',
    fala('a recepcionista da Liga', 'A audiência é às dez. Os senhores podem entrar às dez.'),
    'São nove e cinquenta e oito. Você tem cento e vinte segundos pra parar de suar e não vai dar.'
  ],
  ef:{flag:['chegou_na_audiencia','chegou_em_cima_da_hora'], hp:-1,
      registrar:'Chegou na audiência às 9h57, sem fôlego.'},
  escolhas:[
    {texto:'Falar com o Blue.', vai:'c25_falou_com_blue', cond:d=>!!d.npcs['Blue']},
    {texto:'Perguntar à mulher da pasta de couro quem ela é.', vai:'c25_a_mulher_da_pasta'},
    {texto:'Perguntar ao homem de crachá azul quem convocou.', vai:'c25_o_cracha_azul'},
    {texto:'Sentar, respirar, e esperar dar dez.', vai:'c25_esperou_dar_dez'}
  ]
},

c25_ab_o_corredor:{
  texto:[
    'A máquina de café fica no fim do corredor, do lado de uma janela que dá pro estacionamento.',
    'Ela engole a sua moeda. Você bate do lado. Ela devolve.',
    'Você bate de novo, mais forte, e dessa vez ela aceita e começa a fazer um barulho de esforço.',
    'Enquanto o copo enche, você olha pro estacionamento pela janela.',
    'Tem sete carros. Seis são carros.',
    'O sétimo é uma van branca sem identificação, de traseira encostada na parede de serviço do prédio, com as portas abertas e ninguém em volta.',
    'Você fica olhando a van por tempo demais e o café transborda no copo.',
    'Quando você olha de volta, a van está com as portas fechadas e continua sem ninguém em volta.'
  ],
  ef:{flag:'a_van_no_estacionamento',
      registrar:'Uma van branca sem identificação está encostada na parede de serviço do prédio da audiência.',
      presagio:'Traseira encostada na parede de serviço, portas abertas. Alguém carregou ou descarregou alguma coisa aqui hoje de manhã.'},
  escolhas:[
    {texto:'Descer e olhar a van de perto.', vai:'c25_ab_a_van_de_perto'},
    {texto:'Voltar pra antessala. Já vai dar dez.', vai:'c25_a_antessala'},
    {texto:'Voltar e regar a planta.', vai:'c25_regou_a_planta'}
  ]
},

c25_ab_a_van_de_perto:{
  texto:[
    'Você desce pela escada de serviço com um copo de café na mão, o que te dá exatamente a aparência de alguém que trabalha ali.',
    'A van é uma van. Branca, suja de estrada, placa suja de propósito ou de estrada — não dá pra distinguir e é isso que é conveniente.',
    'A traseira está a quarenta centímetros da parede de serviço, que é a distância de quem descarrega direto na porta.',
    'No chão, entre a van e a parede, tem palha. Palha de embalagem, dessas de transporte.',
    'Você pega um punhado e cheira, o que é uma coisa que você aprendeu a fazer nos últimos meses e que você não fazia antes.',
    'Cheira a animal.',
    'E a nove minutos daqui, no terceiro andar, tem uma audiência de ofício às dez.'
  ],
  ef:{flag:['a_palha_da_van','chegou_na_audiencia'],
      registrar:'Havia palha de transporte com cheiro de animal entre a van e a parede de serviço.',
      presagio:'Descarregaram alguma coisa viva no prédio da audiência, na manhã da audiência.'},
  escolhas:[
    {texto:'Subir correndo pra antessala.', vai:'c25_a_antessala'},
    {texto:'Procurar a porta de serviço onde descarregaram.', vai:'c25_ab_a_porta_de_servico'}
  ]
},

c25_ab_a_porta_de_servico:{
  texto:[
    'A porta de serviço é de aço, com barra antipânico do lado de dentro, o que quer dizer que ela abre de dentro pra fora e não o contrário.',
    'Está encostada. Não trancada: encostada, com um calço de madeira no pé.',
    'Alguém calçou pra não fechar.',
    'Você empurra com dois dedos e ela abre num corredor de serviço com piso de cimento queimado e lâmpada de tubo.',
    'O corredor tem umas seis portas e uma rampa que desce.',
    'E, do fundo da rampa, vem som.',
    'Não é som de máquina. É som de muita coisa viva no mesmo lugar, abafado por parede, que é um som que ninguém esquece depois de ouvir uma vez.',
    d=>`E são nove e cinquenta e um da manhã, e a sua audiência é às dez, e você está a três andares e uma decisão de distância dela.`
  ],
  ef:{flag:['o_porao_do_predio','chegou_na_audiencia'], hp:-1,
      registrar:'Há uma rampa de serviço no prédio da audiência e, do fundo dela, som de muita coisa viva.',
      presagio:'Nove e cinquenta e um. Você tem nove minutos e duas coisas incompatíveis pra fazer.'},
  escolhas:[
    {texto:'Descer a rampa. A audiência que espere.', vai:'c25_ab_desceu_a_rampa'},
    {texto:'Subir pra audiência. É pra isso que você veio.', vai:'c25_a_antessala'}
  ]
},

c25_ab_desceu_a_rampa:{
  texto:[
    'Você desce.',
    'A rampa dá numa garagem de subsolo com pé-direito baixo e luz amarela, e na garagem, encostadas na parede do fundo, tem catorze gaiolas de transporte cobertas com lona cinza.',
    'Catorze. Cobertas. E o som vem delas e para quando você chega, todas ao mesmo tempo, do jeito que bicho faz quando entra gente.',
    'Tem uma prancheta pendurada num prego, do lado das gaiolas, e você lê a prancheta antes de levantar qualquer lona.',
    '**RECEBIMENTO — 14 UN. — DESTINO: SALA DE AUDIÊNCIA 3 — HORÁRIO: 10H00**',
    'Eles vão levar as catorze pra sala da sua audiência.',
    'Às dez.',
    'Você olha o relógio da parede da garagem e são nove e cinquenta e seis.'
  ],
  ef:{flag:['catorze_gaiolas','chegou_na_audiencia'],
      registrar:'Catorze gaiolas de transporte esperam no subsolo, com destino à sala de audiência, às 10h00.',
      presagio:'A audiência não é sobre papel. Eles vão levar as catorze pra dentro da sala.'},
  escolhas:[
    {texto:'Levantar uma lona.', vai:'c25_ab_levantou_a_lona'},
    {texto:'Subir pra audiência agora, sabendo disso.', vai:'c25_a_antessala'}
  ]
},

c25_ab_levantou_a_lona:{
  texto:[
    'Você levanta a lona da primeira gaiola.',
    d=>{
      const p = d.time[0];
      return p ? `E lá dentro tem um bicho que olha pra você do jeito que ${nomeExib(p)} olhava pra você no começo de tudo, quando ainda não sabia se você era o tipo de pessoa que abre ou o tipo que fecha.`
               : 'E lá dentro tem um bicho que olha pra você sem nenhuma expectativa, que é a pior versão de ser olhado.';
    },
    'A gaiola é limpa. Tem água. Tem uma etiqueta amarrada na grade com um número e uma letra.',
    'Está tudo em ordem. É isso que você vai ter que explicar lá em cima e é isso que não tem como explicar.',
    'Você abaixa a lona com cuidado, porque levantar de novo seria pior pra ele do que nunca ter levantado.',
    'E sobe os três andares com a palha ainda na mão.'
  ],
  ef:{flag:['viu_o_que_tem_nas_gaiolas','catorze_gaiolas'], moral:-1,
      registrar:'Viu o que há nas catorze gaiolas do subsolo. Estava tudo em ordem.',
      presagio:'Tudo em ordem é o argumento deles. Você vai ter que atacar a ordem, não a desordem.'},
  escolhas:[
    {texto:'Subir pra audiência.', vai:'c25_a_antessala'}
  ]
},


c25_a_antessala:{
  texto:[
    'A antessala tem seis cadeiras de plástico, uma planta que precisa de água e um relógio de parede que atrasa.',
    'São nove e quarenta e quatro.',
    'Tem mais três pessoas esperando, e você conhece uma delas.',
    d=>d.npcs['Blue']
      ? 'Blue está na terceira cadeira, de braços cruzados, olhando o relógio que atrasa como se fosse culpa dele.'
      : 'Um rapaz da sua idade está na terceira cadeira, de braços cruzados, olhando o relógio que atrasa como se fosse culpa dele.',
    'Os outros dois você não conhece: uma mulher de uns cinquenta com uma pasta de couro e um homem de terno com um crachá azul.',
    fala('a recepcionista da Liga', 'A audiência é às dez. Os senhores podem entrar às dez.', null,
         'Ela fala isso às nove e quarenta e cinco e volta a olhar a tela.')
  ],
  ef:{flag:'chegou_na_audiencia',
      registrar:'Chegou na antessala da audiência. Quatro pessoas, seis cadeiras.'},
  escolhas:[
    {texto:'Falar com o Blue.', vai:'c25_falou_com_blue', cond:d=>!!d.npcs['Blue']},
    {texto:'Perguntar à mulher da pasta de couro quem ela é.', vai:'c25_a_mulher_da_pasta'},
    {texto:'Perguntar ao homem de crachá azul quem convocou.', vai:'c25_o_cracha_azul'},
    {texto:'Ficar em silêncio e esperar dar dez.', vai:'c25_esperou_dar_dez'},
    {texto:'Regar a planta, que precisa de água.', vai:'c25_regou_a_planta'}
  ]
},

c25_regou_a_planta:{
  texto:[
    'Você pega o copo do bebedouro, enche, e rega a planta da antessala da audiência que vai decidir alguma coisa sobre a sua vida.',
    'A terra absorve tudo em três segundos, o que quer dizer que ela está seca há semanas.',
    'Você enche de novo. E de novo. Quatro copos.',
    'A recepcionista olha por cima da tela na metade do terceiro copo e não fala nada.',
    'No quarto copo, a mulher da pasta de couro solta uma risada curta pelo nariz.',
    fala('a mulher da pasta', 'Onze meses. Onze meses que eu venho nessa sala e ninguém nunca regou essa planta.')
  ],
  ef:{moral:3, flag:'regou_a_planta',
      npc:{nome:'Mulher da pasta de couro', opiniao:2, memoria:'Te viu regar a planta da antessala com quatro copos.'},
      rep:{eixo:'bom',delta:1,motivo:'Regou a planta da antessala antes da própria audiência'},
      registrar:'Regou a planta da antessala. Ninguém tinha regado em onze meses.'},
  escolhas:[
    {texto:'Perguntar o que ela faz aqui há onze meses.', vai:'c25_a_mulher_da_pasta'},
    {texto:'Sentar e esperar dar dez.', vai:'c25_esperou_dar_dez'}
  ]
},

c25_a_mulher_da_pasta:{
  texto:[
    d=>fala(d.jogador.nome, 'A senhora vem aqui há onze meses?'),
    fala('a mulher da pasta', 'Onze meses e quatro dias. Eu sou advogada de ofício.'),
    fala('a mulher da pasta', 'Eu represento pessoas que são convocadas por uma comissão que tecnicamente não existe, numa sala que tecnicamente é de audiência administrativa.'),
    fala('a mulher da pasta', 'Você tem direito a mim. Ninguém te disse isso no telegrama porque o telegrama tem quatro linhas.'),
    'Ela abre a pasta de couro e tira uma folha, e a folha é um formulário de constituição de defesa com o campo do nome em branco.',
    fala('a mulher da pasta', 'Custa nada. Eu sou paga pelo Estado e eu sou paga mal, e nas duas coisas eu tenho certeza.', 'riso')
  ],
  ef:{flag:'conheceu_a_advogada',
      npc:{nome:'Advogada de ofício', opiniao:2, memoria:'Ofereceu defesa de graça na antessala da sua audiência.'},
      rep:{eixo:'bom',delta:1,motivo:'Descobriu que tinha direito a uma coisa que ninguém contou'},
      registrar:'Existe advogada de ofício para as convocações. O telegrama não diz.'},
  escolhas:[
    {texto:'Assinar. Entrar com ela.', vai:'c25_com_advogada',
     ef:{flag:'entrou_com_advogada'}},
    {texto:'Não assinar. Entrar sozinh{o|a}.', vai:'c25_sozinho_na_sala',
     ef:{flag:'entrou_sozinho'}},
    {texto:'Avisar o Blue de que ele também tem direito.', vai:'c25_avisou_o_blue',
     cond:d=>!!d.npcs['Blue']}
  ]
},

c25_avisou_o_blue:{
  texto:[
    'Você atravessa a antessala e conta pro Blue que existe advogada de ofício, que custa nada, e que o telegrama não diz porque o telegrama tem quatro linhas.',
    'Ele olha pra você, olha pra mulher da pasta, e levanta na hora.',
    fala('Blue', 'Eu ia entrar sozinho.', 'baixo'),
    fala('Blue', 'Eu ia entrar sozinho porque eu achei que pedir ajuda ia parecer que eu tinha alguma coisa pra esconder.'),
    fala('Blue', 'É exatamente assim que eles querem que a gente pense, né.', 'frio'),
    'Ele assina. Você assina. A mulher da pasta de couro abre um sorriso que ela estava segurando há onze meses.'
  ],
  ef:{flag:'entrou_com_advogada', moral:4,
      npc:{nome:'Blue', opiniao:4, memoria:'Você avisou ele do direito à defesa. Ele ia entrar sozinho.'},
      rep:{eixo:'bom',delta:3,motivo:'Dividiu um direito que ninguém tinha contado', rep:{notorio:true}},
      registrar:'Avisou o Blue do direito à defesa. Os dois entraram com advogada.'},
  escolhas:[{texto:'Entrar na sala.', vai:'c25_com_advogada'}]
},

c25_o_cracha_azul:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem convocou?'),
    'O homem de crachá azul levanta os olhos do jornal com a educação exata de quem foi treinado pra ser educado.',
    fala('o homem de crachá azul', 'A comissão convocou.'),
    d=>fala(d.jogador.nome, 'Que comissão?'),
    fala('o homem de crachá azul', 'A que está no timbre do telegrama.'),
    'O telegrama não tem timbre. O telegrama tem quatro linhas em maiúsculo e a palavra COMPARECIMENTO duas vezes.',
    'Você diz isso. Ele volta pro jornal.',
    fala('o homem de crachá azul', 'Então {o senhor|a senhora} vai descobrir às dez horas, junto comigo.', 'frio')
  ],
  ef:{flag:'o_telegrama_nao_tem_timbre',
      rep:{eixo:'bom',delta:1,motivo:'Reparou que o telegrama não tinha timbre'},
      registrar:'O telegrama da convocação não tem timbre de comissão nenhuma.'},
  escolhas:[
    {texto:'Perguntar à mulher da pasta de couro.', vai:'c25_a_mulher_da_pasta'},
    {texto:'Sentar e esperar.', vai:'c25_esperou_dar_dez'}
  ]
},

c25_falou_com_blue:{
  texto:[
    'Você senta na cadeira ao lado dele. Ele não descruza os braços.',
    fala('Blue', 'Você leu o arquivo.'),
    d=>fala(d.jogador.nome, d.flags.leu_a_folha_dezenove ? 'Li.' : 'Parte.'),
    fala('Blue', 'Então você sabe que a gente é as duas pessoas dessa antessala que não deviam estar aqui.'),
    fala('Blue', 'Aqueles dois trabalham aqui. Um de terno e uma de pasta. Eles são móveis desta sala.'),
    fala('Blue', 'A gente é o assunto.', 'frio')
  ],
  ef:{npc:{nome:'Blue', opiniao:2, memoria:'Sentou ao lado dele na antessala.'},
      registrar:'Blue: "a gente é o assunto".'},
  escolhas:[
    {texto:'Perguntar à mulher da pasta de couro quem ela é.', vai:'c25_a_mulher_da_pasta'},
    {texto:'Combinar o que falar e o que não falar lá dentro.', vai:'c25_combinaram'},
    {texto:'Esperar dar dez em silêncio.', vai:'c25_esperou_dar_dez'}
  ]
},

c25_combinaram:{
  texto:[
    'Vocês dois combinam em voz baixa, com dez minutos e uma antessala com mais duas pessoas dentro.',
    'O que falar: tudo que está em papel, com data e carimbo.',
    'O que não falar: nome de quem ajudou sem assinar nada.',
    fala('Blue', 'Quem te ajudou sem assinar não existe hoje. Nem nome, nem cidade, nem cara.'),
    d=>d.flags.viu_o_visor ? fala(d.jogador.nome, 'O guarda da terceira guarita.') : fala(d.jogador.nome, 'Nem quem me deu café no caminho?'),
    d=>d.flags.viu_o_visor ? fala('Blue', 'Quem?') : fala('Blue', 'Principalmente quem te deu café no caminho.'),
    d=>d.flags.viu_o_visor ? fala(d.jogador.nome, 'Um cara que virou uma tela dez graus pra eu ler. Ele tem filho.') : '',
    d=>d.flags.viu_o_visor ? fala('Blue', 'Então ele não existe hoje.', null, 'Sem hesitar nem meio segundo.') : ''
  ],
  ef:{flag:'combinou_com_o_blue', moral:3,
      npc:{nome:'Blue', opiniao:4, memoria:'Combinou com você o que não falar na audiência.'},
      rep:{eixo:'bom',delta:2,motivo:'Combinou proteger quem ajudou sem assinar nada'},
      registrar:'Combinou com o Blue os nomes que não seriam ditos na audiência.'},
  escolhas:[
    {texto:'Entrar quando chamarem.', vai:'c25_esperou_dar_dez'},
    {texto:'Perguntar à mulher da pasta de couro quem ela é.', vai:'c25_a_mulher_da_pasta'}
  ]
},

c25_esperou_dar_dez:{
  texto:[
    'O relógio da antessala atrasa quatro minutos, e você descobre isso porque a porta abre às dez em ponto no relógio de pulso da recepcionista e às nove e cinquenta e seis no da parede.',
    'Quem abre a porta é a mulher de crachá azul do carro preto.',
    fala('a mulher de crachá azul', 'Só os dois.', null, 'Ela olha você e olha o rapaz de braços cruzados.'),
    fala('a mulher de crachá azul', 'Os outros dois já sabem o que tem aqui dentro.')
  ],
  escolhas:[
    {texto:'Entrar.', vai:'c25_sozinho_na_sala', cond:d=>!d.flags.entrou_com_advogada},
    {texto:'Entrar com a advogada.', vai:'c25_com_advogada', cond:d=>!!d.flags.entrou_com_advogada},
    {texto:'Parar na porta e pedir a advogada agora.', vai:'c25_pediu_na_porta',
     cond:d=>!d.flags.entrou_com_advogada && !!d.flags.conheceu_a_advogada}
  ]
},

c25_pediu_na_porta:{
  texto:[
    'Você para na soleira, com a mão no batente, e pede a advogada de ofício em voz normal, na frente de todo mundo.',
    'A mulher de crachá azul não muda de expressão nem um grau.',
    fala('a mulher de crachá azul', 'É direito seu.'),
    fala('a mulher de crachá azul', 'É direito seu e você é a terceira pessoa em onze meses a pedir, e as outras duas pediram depois de sentar.', 'frio'),
    'A advogada de ofício levanta e pega a pasta de couro em quatro segundos, como quem esperava há onze meses.'
  ],
  ef:{flag:'entrou_com_advogada', moral:3,
      rep:{eixo:'bom',delta:2,motivo:'Pediu na porta o que quase ninguém pede'},
      registrar:'Pediu a advogada de ofício na soleira da porta.'},
  escolhas:[{texto:'Entrar.', vai:'c25_com_advogada'}]
},

/* ── a sala ────────────────────────────────────────────────── */
c25_com_advogada:{
  texto:[
    d=>d.flags.sabe_da_convocacao || d.flags.falou_com_o_cracha_azul ? 'A sala tem uma mesa comprida e não tem quatro cadeiras: tem nove.' : 'A sala tem uma mesa comprida e nove cadeiras.',
    'Cinco do lado de lá, quatro do lado de cá.',
    'Do lado de lá tem a mulher de crachá azul, dois homens de terno, uma mulher de uns sessenta com um broche da Liga no colarinho, e uma cadeira vazia.',
    'Do lado de cá senta você, o Blue, a advogada de ofício e outra cadeira vazia.',
    fala('a advogada de ofício', 'Antes de qualquer coisa: consta em ata que os convocados constituíram defesa.'),
    fala('a mulher do broche da Liga', 'Consta.', null, 'Ela escreve à mão, o que ninguém mais nessa mesa está fazendo.'),
    fala('a mulher de crachá azul', 'Bom. Então a gente pode começar pelo começo, que é a parte que ninguém gosta.'),
    fala('a mulher de crachá azul', 'Nós três aqui desta mesa assinamos o convênio de 1995. Eu, ele, e a cadeira vazia.', 'frio')
  ],
  ef:{flag:'a_audiencia_comecou',
      registrar:'A sala tem nove cadeiras. Três dos que assinaram o convênio estão nela.'},
  escolhas:[
    {texto:'Perguntar de quem é a cadeira vazia.', vai:'c25_a_cadeira_vazia'},
    {texto:'Pôr tudo que você tem em cima da mesa, agora.', vai:'c25_pos_tudo_na_mesa'},
    {texto:'Deixar a advogada falar primeiro.', vai:'c25_a_advogada_fala'},
    {texto:'Perguntar por que convocaram vocês dois e não a imprensa.', vai:'c25_por_que_nos'}
  ]
},

c25_sozinho_na_sala:{
  texto:[
    'A sala tem uma mesa comprida e nove cadeiras.',
    'Cinco do lado de lá, ocupadas. Quatro do lado de cá, e você ocupa uma.',
    'Sem advogada, o lado de cá fica com três cadeiras vazias, e três cadeiras vazias numa mesa comprida são uma coisa que se sente no corpo.',
    fala('a mulher de crachá azul', 'Nós três desta mesa assinamos o convênio de 1995. Eu, ele, e a cadeira vazia.'),
    fala('a mulher de crachá azul', 'Nós convocamos vocês porque vocês dois juntaram, em alguns meses, mais papel sobre isso do que a Liga juntou em quatro anos.', 'frio')
  ],
  ef:{flag:'a_audiencia_comecou',
      registrar:'Entrou sozinho na sala. Três cadeiras vazias do seu lado.'},
  escolhas:[
    {texto:'Perguntar de quem é a cadeira vazia.', vai:'c25_a_cadeira_vazia'},
    {texto:'Pôr tudo que você tem em cima da mesa, agora.', vai:'c25_pos_tudo_na_mesa'},
    {texto:'Perguntar por que convocaram vocês dois e não a imprensa.', vai:'c25_por_que_nos'},
    {texto:'Não falar nada. Deixar eles falarem primeiro.', vai:'c25_deixou_falarem'}
  ]
},

c25_a_cadeira_vazia:{
  texto:[
    d=>fala(d.jogador.nome, 'De quem é a cadeira vazia?'),
    'A pergunta cai na mesa e fica lá por uns bons três segundos.',
    fala('a mulher do broche da Liga', 'Do terceiro signatário.'),
    fala('a mulher do broche da Liga', 'Ele foi notificado e não compareceu. É a décima primeira vez que ele não comparece.'),
    d=>d.flags.leu_o_verso_da_segunda_pagina || d.flags.achou_a_segunda_pagina
      ? fala(d.jogador.nome, 'Ele é o titular anterior do ginásio de Viridian.')
      : fala(d.jogador.nome, 'Ele tem nome?'),
    d=>d.flags.leu_o_verso_da_segunda_pagina || d.flags.achou_a_segunda_pagina
      ? 'Ninguém confirma. Ninguém desmente. A mulher do broche escreve à mão e não levanta a cabeça.'
      : 'Ninguém responde. A mulher do broche escreve à mão e não levanta a cabeça.',
    fala('a mulher de crachá azul', 'A cadeira fica na sala porque a ata exige que fique.', 'frio'),
    fala('a mulher de crachá azul', 'Onze convocações, onze ausências, onze atas. É a coisa mais documentada deste processo inteiro.')
  ],
  ef:{flag:'onze_ausencias_do_terceiro',
      rep:{eixo:'bom',delta:2,motivo:'Perguntou de quem era a cadeira vazia'},
      registrar:'O terceiro signatário foi convocado onze vezes e faltou onze.'},
  escolhas:[
    {texto:'Pôr tudo que você tem em cima da mesa.', vai:'c25_pos_tudo_na_mesa'},
    {texto:'Perguntar o que acontece na décima segunda.', vai:'c25_decima_segunda'},
    {texto:'Perguntar por que convocaram vocês dois.', vai:'c25_por_que_nos'}
  ]
},

c25_decima_segunda:{
  texto:[
    d=>fala(d.jogador.nome, 'O que acontece na décima segunda ausência?'),
    'Silêncio.',
    fala('a mulher do broche da Liga', 'Nada.'),
    fala('a mulher do broche da Liga', 'Não existe décima segunda consequência. Não existe décima primeira. Não existe nenhuma.'),
    fala('a mulher do broche da Liga', 'Eu estou nesta comissão há três anos e o meu trabalho é escrever à mão que ele não veio.', 'baixo'),
    'Ela larga a caneta em cima da ata, o que é o gesto mais violento que aconteceu nesta sala até agora.'
  ],
  ef:{flag:'nao_existe_consequencia', moral:-3,
      npc:{nome:'Conselheira do broche', opiniao:3, memoria:'Largou a caneta na ata ao admitir que não existe consequência nenhuma.'},
      rep:{eixo:'bom',delta:2,motivo:'Fez a pergunta que fez alguém largar a caneta', rep:{notorio:true}},
      registrar:'Onze ausências e nenhuma consequência. A conselheira largou a caneta.'},
  escolhas:[
    {texto:'Pôr tudo que você tem em cima da mesa.', vai:'c25_pos_tudo_na_mesa'},
    {texto:'"Então pra que eu vim?"', vai:'c25_pra_que_eu_vim'}
  ]
},

c25_por_que_nos:{
  texto:[
    d=>fala(d.jogador.nome, 'Por que a gente? Por que não a imprensa, a polícia, um juiz?'),
    fala('a mulher de crachá azul', 'Porque imprensa publica, polícia indicia e juiz condena.'),
    fala('a mulher de crachá azul', 'E as três coisas transformam isso num caso, e um caso tem um réu, e um réu é uma pessoa só.'),
    fala('a mulher de crachá azul', 'Não tem uma pessoa só. Tem um convênio de quatro anos com onze órgãos envolvidos e trezentas assinaturas.'),
    fala('a mulher de crachá azul', 'Vocês dois são as únicas pessoas vivas que juntaram isso sem serem pagas pra juntar.', 'frio'),
    fala('a mulher de crachá azul', 'Eu não convoquei vocês pra depor. Eu convoquei vocês pra decidir o que fazer com o que vocês têm.')
  ],
  ef:{flag:'entendeu_a_convocacao',
      rep:{eixo:'bom',delta:1,motivo:'Perguntou por que eram vocês na sala'},
      registrar:'A convocação não era pra depor. Era pra decidir o que fazer com o que você juntou.'},
  escolhas:[
    {texto:'Pôr tudo em cima da mesa.', vai:'c25_pos_tudo_na_mesa'},
    {texto:'Perguntar de quem é a cadeira vazia.', vai:'c25_a_cadeira_vazia'},
    {texto:'Recusar. Sair da sala com tudo que você tem.', vai:'c25_saiu_com_tudo'}
  ]
},

c25_deixou_falarem:{
  texto:[
    'Você não fala nada.',
    'Eles falam por quarenta minutos: o convênio, os anexos, as onze ausências do terceiro signatário, e coisas com nome de código que você nunca ouviu.',
    'Eles falam tudo que você descobriu, na ordem certa, com as datas certas, e sem você ter aberto a boca.',
    'Eles sabiam de tudo. Sabiam desde antes de você.',
    fala('a mulher de crachá azul', 'Agora {o senhor|a senhora} entende por que a gente convocou.'),
    fala('a mulher de crachá azul', 'A gente não precisa do que você sabe. A gente precisa que alguém de fora tenha sabido.', 'frio')
  ],
  ef:{flag:'eles_sabiam_de_tudo', moral:-4,
      rep:{eixo:'bom',delta:1,motivo:'Ficou quarenta minutos calado e ouviu tudo'},
      registrar:'Eles sabiam de tudo antes de você. Precisavam que alguém de fora soubesse.'},
  escolhas:[
    {texto:'Pôr tudo em cima da mesa mesmo assim.', vai:'c25_pos_tudo_na_mesa'},
    {texto:'"Então pra que eu vim?"', vai:'c25_pra_que_eu_vim'},
    {texto:'Sair da sala com tudo que você tem.', vai:'c25_saiu_com_tudo'}
  ]
},

c25_a_advogada_fala:{
  texto:[
    'A advogada de ofício abre a pasta de couro e fala por doze minutos sem consultar uma anotação.',
    'Ela lista: o que é obrigação de informar, o que é prazo prescricional, o que é dever de apuração de ofício, o que acontece quando um órgão convoca sem timbre.',
    'Ela usa a palavra "nulidade" quatro vezes.',
    'Do lado de lá da mesa, os dois homens de terno olham um pro outro na terceira.',
    fala('a advogada de ofício', 'Então o que a gente tem aqui não é uma audiência. É uma conversa.'),
    fala('a advogada de ofício', 'E numa conversa os meus constituídos podem levantar e ir embora a qualquer momento, e eu vou registrar que eu disse isso a eles nesta sala.', 'frio'),
    fala('a mulher de crachá azul', 'Registra.', null, 'Sem irritação nenhuma. Quase com alívio.')
  ],
  ef:{flag:'a_advogada_falou', moral:3,
      npc:{nome:'Advogada de ofício', opiniao:4, memoria:'Falou doze minutos sem consultar anotação e chamou a audiência de conversa.'},
      rep:{eixo:'bom',delta:2,motivo:'Deixou falar quem sabia falar'},
      registrar:'A advogada de ofício provou que a audiência era uma conversa.'},
  escolhas:[
    {texto:'Pôr tudo em cima da mesa, agora que dá pra sair quando quiser.', vai:'c25_pos_tudo_na_mesa'},
    {texto:'Perguntar de quem é a cadeira vazia.', vai:'c25_a_cadeira_vazia'},
    {texto:'Levantar e ir embora, justamente porque dá.', vai:'c25_saiu_com_tudo'}
  ]
},

c25_pra_que_eu_vim:{
  texto:[
    d=>fala(d.jogador.nome, 'Então pra que eu vim?'),
    fala('a mulher de crachá azul', 'Porque papel de comissão apodrece na gaveta e pessoa não apodrece.'),
    fala('a mulher de crachá azul', 'Em quatro anos eu vi dezessete relatórios completos, bem escritos, com prova, sumirem por decurso de prazo.'),
    fala('a mulher de crachá azul', 'Nenhum deles tinha uma pessoa de quinze anos com uma licença de treinador e uma cidade inteira sabendo o nome {dele|dela}.'),
    fala('a mulher de crachá azul', 'Eu não preciso do seu papel. Eu preciso que você exista e que você tenha visto.', 'baixo'),
    'E aí ela empurra uma folha pela mesa comprida, e a folha para exatamente na sua frente.'
  ],
  ef:{flag:'entendeu_pra_que_veio',
      rep:{eixo:'bom',delta:2,motivo:'Fez a pergunta direta na mesa comprida'},
      registrar:'"Eu preciso que você exista e que você tenha visto."'},
  escolhas:[
    {texto:'Ler a folha.', vai:'c25_a_folha_na_mesa'},
    {texto:'Empurrar a folha de volta sem ler.', vai:'c25_empurrou_de_volta'}
  ]
},

c25_pos_tudo_na_mesa:{
  texto:[
    'Você abre a mochila e põe tudo em cima da mesa comprida, um por um, com nome e data, do jeito que você aprendeu a fazer em nove meses de estrada.',
    d=>{
      const provas = ['Segunda página do convênio','Folha 19 — recomendação de convocação',
                      'Dezenove folhas com o seu nome','Anotação: ACOMP. ATIVO — 704 — NÍVEL 2',
                      'Foto de quatro pessoas de jaleco','Sigla e número do bordado, anotados'];
      const tem = provas.filter(x => Estado.contaItem(x) > 0);
      return tem.length
        ? `Em cima da mesa: ${tem.join('; ')}. E o resto que você juntou desde que saiu de casa.`
        : 'Em cima da mesa: tudo que você juntou desde que saiu de casa, e é mais do que cabe na mesa.';
    },
    'Leva onze minutos. Ninguém interrompe.',
    'Quando você termina, a mulher do broche da Liga está escrevendo à mão numa velocidade completamente diferente da de antes.',
    fala('a mulher de crachá azul', 'Tem coisa aí que eu não tinha.', 'baixo'),
    fala('a mulher de crachá azul', 'Tem três coisas aí que eu não tinha.')
  ],
  ef:{flag:'pos_tudo_na_mesa', moral:5,
      rep:{eixo:'bom',delta:4,motivo:'Pôs tudo que juntou em cima da mesa comprida', rep:{notorio:true, peso:2}},
      registrar:'Pôs tudo em cima da mesa. Três coisas eles não tinham.'},
  escolhas:[
    {texto:'Exigir cópia carimbada de tudo antes de sair.', vai:'c25_exigiu_copia'},
    {texto:'Perguntar o que eles vão fazer com isso.', vai:'c25_o_que_vao_fazer'},
    {texto:'Perguntar de quem é a cadeira vazia.', vai:'c25_a_cadeira_vazia'}
  ]
},

c25_exigiu_copia:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu quero cópia carimbada de tudo. Antes de eu sair desta sala.'),
    d=>d.flags.entrou_com_advogada ? 'A advogada de ofício fecha os olhos e assente uma vez só, como quem viu o aluno acertar.' : '',
    fala('a mulher de crachá azul', 'A copiadora é no quarto andar.'),
    d=>fala(d.jogador.nome, 'Eu espero.'),
    'Você espera. Uma hora e dez minutos, sentad{o|a} na mesa comprida, com todo mundo na sala e ninguém falando nada.',
    'A cópia volta carimbada, com protocolo e data, e a data é hoje.',
    fala('a mulher de crachá azul', 'Agora existem duas.', 'frio'),
    fala('a mulher de crachá azul', 'Uma comigo e uma com você. É assim que uma coisa deixa de sumir.')
  ],
  ef:{flag:'tem_copia_carimbada', moral:4,
      itens:{'Cópia carimbada de tudo, com protocolo':1},
      rep:{eixo:'bom',delta:3,motivo:'Esperou uma hora e dez pela cópia carimbada', rep:{notorio:true}},
      registrar:'Saiu da audiência com cópia carimbada e protocolo de tudo.'},
  escolhas:[{texto:'Perguntar o que eles vão fazer com isso.', vai:'c25_o_que_vao_fazer'}]
},

c25_o_que_vao_fazer:{
  texto:[
    d=>fala(d.jogador.nome, 'O que vocês vão fazer com isso?'),
    fala('a mulher de crachá azul', 'Honestamente? Não sei.'),
    fala('a mulher de crachá azul', 'A comissão tem poder de recomendar. Quem decide é a Liga, e a Liga é aquela senhora ali com o broche e mais catorze pessoas que não vieram.'),
    fala('a mulher do broche da Liga', 'Eu vou levar.', null, 'Ela fala pela terceira vez em duas horas.'),
    fala('a mulher do broche da Liga', 'Eu vou levar na reunião de quinta e vou ler em voz alta, do começo, inclusive a parte que fala de mim.'),
    fala('a mulher do broche da Liga', 'Eu assinei o anexo técnico em 1996. Está na folha sete.', 'baixo'),
    'Ninguém sabia disso. Dá pra ver na cara dos dois homens de terno que ninguém sabia disso.'
  ],
  ef:{flag:'a_conselheira_assinou', moral:3,
      npc:{nome:'Conselheira do broche', opiniao:5, memoria:'Admitiu na mesa que assinou o anexo técnico em 1996.'},
      rep:{eixo:'bom',delta:2,motivo:'Estava na sala quando alguém se entregou sozinha'},
      registrar:'A conselheira da Liga assinou o anexo técnico em 1996 e admitiu na mesa.'},
  escolhas:[{texto:'Sair da sala.', vai:'c25_saiu_da_sala'}]
},

c25_a_folha_na_mesa:{
  texto:[
    'A folha é curta. Tem um timbre de verdade, desta vez, e um número de protocolo.',
    'É uma convocação para depor na reunião ordinária da Liga Pokémon, quinta-feira, com direito a voz e sem direito a voto.',
    'Embaixo, no campo de qualificação do depoente, alguém já preencheu à máquina:',
    d=>`**QUALIFICAÇÃO: {TREINADOR LICENCIADO|TREINADORA LICENCIADA}, ${c21_insignias(d).toUpperCase()}, TESTEMUNHA PRESENCIAL.**`,
    'Eles preencheram antes de você entrar na sala.'
  ],
  ef:{flag:'recebeu_a_convocacao_da_liga',
      itens:{'Convocação para a reunião da Liga':1},
      registrar:'Recebeu convocação para depor na reunião da Liga, com voz e sem voto.'},
  escolhas:[
    {texto:'Assinar o recebimento.', vai:'c25_assinou_o_recebimento'},
    {texto:'Exigir direito a voto antes de assinar.', vai:'c25_exigiu_voto'},
    {texto:'Não assinar.', vai:'c25_nao_assinou'}
  ]
},

c25_exigiu_voto:{
  texto:[
    d=>fala(d.jogador.nome, 'Com voz e sem voto?'),
    fala('a mulher de crachá azul', 'Voto é de conselheiro. Você não é {conselheiro|conselheira}.'),
    d=>fala(d.jogador.nome, 'Então me faz {conselheiro|conselheira}.'),
    'A sala inteira para.',
    'Um dos homens de terno começa a rir e para na metade, porque percebe que você não está brincando, e percebe que a mulher do broche não está rindo.',
    fala('a mulher do broche da Liga', 'O estatuto prevê cadeira de conselheiro extraordinário para o Campeão de Kanto.'),
    fala('a mulher do broche da Liga', 'A cadeira está vaga há dois anos, porque o Campeão está vago há dois anos.', 'baixo'),
    'E aí ela olha pra você, e é a primeira vez que ela olha pra você, e o olhar dura mais do que devia.'
  ],
  ef:{flag:'a_cadeira_de_conselheiro', moral:5,
      rep:{eixo:'bom',delta:3,motivo:'Exigiu voto numa sala onde ninguém exige nada', rep:{notorio:true}},
      npc:{nome:'Conselheira do broche', opiniao:4, memoria:'Te contou que a cadeira de conselheiro extraordinário é do Campeão de Kanto.'},
      registrar:'A cadeira de conselheiro extraordinário da Liga é do Campeão, e está vaga há dois anos.'},
  escolhas:[
    {texto:'Assinar o recebimento.', vai:'c25_assinou_o_recebimento'},
    {texto:'Não assinar nada e sair.', vai:'c25_saiu_com_tudo'}
  ]
},

c25_assinou_o_recebimento:{
  texto:[
    'Você assina no campo do depoente com a caneta que eles empurram pela mesa, que é uma caneta boa e pesada, e que eles não pedem de volta.',
    'A cópia amarela fica com você.',
    fala('a mulher de crachá azul', 'Quinta, nove horas. Não é aqui, é no Planalto.'),
    fala('a mulher de crachá azul', 'E olha: leva a advogada.', null,
         'Ela diz isso olhando pro lado de cá da mesa, e é a coisa mais parecida com bondade que saiu da boca dela hoje.')
  ],
  ef:{flag:'assinou_a_convocacao_da_liga', moral:3,
      rep:{eixo:'bom',delta:2,motivo:'Assinou para depor na reunião da Liga'},
      registrar:'Assinou o recebimento. Quinta, nove horas, no Planalto.'},
  escolhas:[{texto:'Sair da sala.', vai:'c25_saiu_da_sala'}]
},

c25_nao_assinou:{
  texto:[
    'Você empurra a folha de volta pelo comprido da mesa e ela para exatamente na frente dela, o que exige uma pontaria que você não sabia que tinha.',
    d=>fala(d.jogador.nome, 'Não.'),
    fala('a mulher de crachá azul', 'Posso perguntar por quê?'),
    d=>fala(d.jogador.nome, 'Porque vocês preencheram a minha qualificação antes de eu entrar.'),
    'Ela olha a folha. Ela vê o campo preenchido à máquina. Ela fecha os olhos por um segundo.',
    fala('a mulher de crachá azul', 'Isso foi burrice nossa.'),
    fala('a mulher de crachá azul', 'Não foi má-fé, foi burrice, e as duas coisas produzem exatamente este resultado.', 'baixo')
  ],
  ef:{flag:'recusou_a_convocacao_da_liga',
      rep:{eixo:'bom',delta:2,motivo:'Recusou uma convocação com o campo preenchido de antemão'},
      registrar:'Recusou assinar a convocação da Liga. Tinham preenchido a sua qualificação antes.'},
  escolhas:[{texto:'Sair da sala.', vai:'c25_saiu_da_sala'}]
},

c25_empurrou_de_volta:{
  texto:[
    'Você empurra a folha de volta sem ler uma linha, e ela desliza o comprido da mesa e para na frente dela.',
    fala('a mulher de crachá azul', 'Você nem leu.'),
    d=>fala(d.jogador.nome, 'Eu não preciso ler pra saber que é um papel que vocês escreveram sobre mim.'),
    fala('a mulher de crachá azul', 'É. É exatamente isso.'),
    fala('a mulher de crachá azul', 'É a nona vez esta semana que alguém desta comissão escreve um papel sobre uma pessoa sem perguntar nada pra ela.', 'frio'),
    fala('a mulher de crachá azul', 'Então tá. Pergunta você. Pergunta você o que você quiser, e eu respondo, e aí a gente vê.')
  ],
  ef:{flag:'inverteu_a_mesa', moral:4,
      rep:{eixo:'bom',delta:3,motivo:'Devolveu o papel sem ler e virou a mesa', rep:{notorio:true}},
      registrar:'Empurrou a folha de volta sem ler. Ela ofereceu responder o que você perguntasse.'},
  escolhas:[
    {texto:'Perguntar de quem é a cadeira vazia.', vai:'c25_a_cadeira_vazia'},
    {texto:'Perguntar por que convocaram vocês dois.', vai:'c25_por_que_nos'},
    {texto:'Pôr tudo em cima da mesa e perguntar depois.', vai:'c25_pos_tudo_na_mesa'}
  ]
},

c25_saiu_com_tudo:{
  texto:[
    'Você levanta no meio da frase de alguém, põe a mochila no ombro, e sai da sala com tudo que você juntou em nove meses ainda dentro dela.',
    'Ninguém te impede. É esse o detalhe que você vai pensar depois: ninguém te impede, porque ninguém nunca teve poder nenhum de te impedir.',
    'A porta é pesada e fecha sozinha, devagar, com um amortecedor.',
    'Na antessala, a planta continua precisando de água.'
  ],
  ef:{flag:'saiu_da_audiencia_com_tudo',
      rep:{eixo:'bom',delta:1,motivo:'Saiu de uma sala que não tinha poder de te segurar'},
      registrar:'Levantou e saiu da audiência com tudo.'},
  escolhas:[{texto:'Descer as escadas.', vai:'c25_a_rua'}]
},

c25_saiu_da_sala:{
  texto:[
    'Você sai da sala às treze e vinte, com fome, com dor de cabeça, e com um envelope a mais do que quando entrou.',
    d=>d.flags.entrou_com_advogada
      ? 'A advogada de ofício aperta a sua mão no corredor e te dá o cartão dela, que é de papel comum e impresso em casa.'
      : 'No corredor não tem ninguém. Os quatro do lado de lá ficaram na sala.',
    d=>d.npcs['Blue']
      ? fala('Blue', 'Eu fiquei três horas sentado numa sala e não bati em ninguém. Anota isso.', 'riso')
      : 'Você desce sozinh{o|a}.',
    'Na antessala, a planta que você regou continua molhada e vai continuar molhada por uns quatro dias, e depois não.'
  ],
  ef:{flag:'saiu_da_audiencia',
      registrar:'Saiu da audiência às treze e vinte.'},
  escolhas:[{texto:'Sair do prédio.', vai:'c25_a_rua'}]
},

c25_a_rua:{
  texto:[
    'A rua de Saffron às treze e meia de uma segunda-feira é a coisa mais normal do mundo.',
    'Tem fila na lanchonete. Tem gente de crachá branco almoçando na escada. Tem uma mulher de terno dizendo "não" no Pokégear com catorze entonações diferentes.',
    'Nada disso sabe que existe uma sala com nove cadeiras e um convênio de 1995 três andares acima.',
    d=>d.flags.combinou_de_subir_com_blue
      ? 'E tem uma montanha no norte que você prometeu subir, e uma pessoa que já subiu duas vezes e vai subir a terceira com você.'
      : 'E tem uma montanha no norte onde o mapa só tem hachura, e você vai acabar indo pra lá, porque tudo o que você leu nos últimos meses aponta pra lá.',
    'Você come alguma coisa em pé, que é como se come em Saffron, e pega a estrada.'
  ],
  ef:{flag:'terminou_a_audiencia',
      registrar:'Saiu do prédio em Saffron. A estrada agora aponta pro norte.'},
  fim:true
}

}
}

);
