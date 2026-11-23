/* ============================================================
   ILHAS SEVII · II — O NAVIO (capítulo 34, pós-jogo)
   O cais três de Vermilion, o S.S. Anne de novo, uma noite de mar com
   o pessoal de Johto que veio de Olivine pro torneio, e a chegada à
   Ilha Um junto com o navio de Hoenn — e, no meio do povo do cais, o
   primeiro roubo que você vê. Quem você ouve no jantar (sv_conheceu_*)
   volta nos outros capítulos. Ver sevii.js.
   ============================================================ */
/* quem dá pra ouvir no jantar: três, no máximo, e cada um uma vez */
function _c34Salao(){
  const ouvidos = d => ['gideon', 'ziggy', 'etta', 'soren', 'saskia', 'florian', 'zev'].filter(id => d.flags['sv_conheceu_' + id]).length;
  const pode = id => d => !d.flags['sv_conheceu_' + id] && ouvidos(d) < 3;
  return [
    {texto:'Sentar com o velho de chapéu de pano que joga paciência.', vai:'c34_gideon', cond:pode('gideon')},
    {texto:'Ir até o rapaz de topete que fala sozinho num transmissor.', vai:'c34_ziggy', cond:pode('ziggy')},
    {texto:'Olhar a mesa da menina que vende Pokébola feita à mão.', vai:'c34_etta', cond:pode('etta')},
    {texto:'Subir pro convés, onde um rapaz de capa está sozinho na amurada.', vai:'c34_soren', cond:pode('soren')},
    {texto:'Ver quem está fazendo flexão no meio do convés.', vai:'c34_saskia', cond:pode('saskia')},
    {texto:'Sentar do lado do homem que janta com uma caixa térmica no colo.', vai:'c34_florian', cond:pode('florian')},
    {texto:'Sentar na mesa vazia, do homem que todo mundo evita.', vai:'c34_zev', cond:pode('zev')},
    {texto:d => ouvidos(d) ? 'Ir pra cabine 14.' : 'Jantar sozinh{o|a} e ir pra cabine 14.', vai:'c34_a_noite'}
  ];
}

CAPITULOS.push(
{
num:34, titulo:'O Navio', local:'Vermilion — o cais três', ambiente:'agua', nivelArea:60,
tom:'inquieto', posJogo:true,
ancora:{local:'vermilion', chamada:'No cais três de Vermilion o S.S. Anne está atracado de novo, com uma faixa pendurada no costado: TORNEIO DAS ILHAS.'},
entradas:['c34_o_cais'],
inicio: d => 'c34_o_cais',
cenas:{

c34_o_cais:{
  texto:[
    'O S.S. Anne está atracado no cais três como se nunca tivesse saído, branco de tinta nova, com uma faixa de lona no costado: TORNEIO DAS ILHAS.',
    'No cais do lado acabou de encostar o barco que vem de Olivine, e desce dele uma fila de gente de mochila nas costas, de Johto, olhando pra Vermilion com cara de quem esperava outra coisa.',
    d => Sevii.procurado(d)
      ? 'No pé da prancha do Anne tem dois oficiais de cinza, com uma folha na mão, olhando a cara de cada um que sobe.'
      : 'No pé da prancha, um marinheiro de luva branca confere passagem e rasga o canto de cada uma.',
    d => (d.flags.encontrou_o_anne || d.flags.anne_visitado) ? 'Você já esteve nesse navio. O corredor de baixo ainda deve cheirar a cera.' : ''
  ],
  escolhas:[
    {texto:'Mostrar a passagem e subir.', vai:'c34_a_prancha', cond:d => !Sevii.procurado(d)},
    {texto:'Subir no meio da fila de Johto, de cabeça baixa.', vai:'c34_no_meio', cond:d => Sevii.procurado(d)},
    {texto:'Ir direto até os oficiais, com a passagem na mão.', vai:'c34_os_oficiais', cond:d => Sevii.procurado(d)},
    {texto:'Procurar a porta da carga, do outro lado do casco.', vai:'c34_a_carga', cond:d => Sevii.procurado(d) && Sevii.daRede(d)}
  ]
},

c34_a_prancha:{
  texto:[
    'O marinheiro olha a passagem, olha você, e rasga o canto devagar, como quem rasga canto de passagem de cabine 14 pela primeira vez.',
    fala('o marinheiro da prancha', 'Cabine catorze. A do Campeão. O comandante pediu pra avisar que o jantar é às oito e que no Anne ninguém pede autógrafo.'),
    'Você sobe. Atrás de você, a fila de Johto sobe olhando pras próprias mochilas.'
  ],
  ef:{perdeItens:{'Passagem':1}},
  escolhas:[
    {texto:'Ir pro salão.', vai:'c34_o_salao'}
  ]
},

c34_no_meio:{
  texto:['A fila de Johto anda devagar, de mochila nas costas e conversa alta, e você entra no meio dela.'],
  teste:{status:'sorte', dificuldade:6, nomeStatus:'Sorte', critico:'c34_passou', sucesso:'c34_passou', parcial:'c34_quase', falha:'c34_quase'}
},
c34_passou:{
  texto:[
    'Um velho de chapéu de pano na sua frente para no meio da prancha pra amarrar o sapato, e a fila inteira se embola em volta dele.',
    'Quando desembola, você já está no convés. Os oficiais ainda estão olhando a folha.'
  ],
  ef:{perdeItens:{'Passagem':1}, registrar:'Embarcou no S.S. Anne no meio da turma de Johto, debaixo do nariz da Patrulha.'},
  escolhas:[
    {texto:'Ir pro salão.', vai:'c34_o_salao'}
  ]
},
c34_quase:{
  texto:[
    'Um dos oficiais levanta a cabeça da folha bem quando você passa. Olha. Olha a folha. Abre a boca.',
    fala('o comandante do Anne', 'No meu navio, quem confere passageiro sou eu.', 'frio', 'A voz vem de cima, do alto da prancha. Ele não grita.'),
    'É um homem de barba branca e quepe, com a mão no corrimão. Os oficiais olham um pro outro. Um deles fecha a folha.',
    fala('o comandante do Anne', 'Sobe.')
  ],
  ef:{perdeItens:{'Passagem':1}, registrar:'A Patrulha quase te parou na prancha do S.S. Anne. O comandante não deixou.'},
  escolhas:[
    {texto:'Subir.', vai:'c34_o_salao'}
  ]
},

c34_os_oficiais:{
  texto:[
    'Você vai direto até eles, com a passagem na mão, olhando nos olhos do mais novo.',
    'Ele olha a sua cara. Olha a folha. Olha a sua cara de novo.'
  ],
  teste:{status:'carisma', dificuldade:7, nomeStatus:'Carisma', critico:'c34_encarou', sucesso:'c34_encarou', parcial:'c34_quase', falha:'c34_quase'}
},
c34_encarou:{
  texto:[
    fala('o oficial da prancha', 'A passagem é de cabine?', null, 'Ele pergunta pra ganhar tempo, e todo mundo sabe.'),
    'Você mostra o carimbo da arena redonda. Ele não sabe o que é. O colega dele também não.',
    'Atrás de você a fila de Johto começou a reclamar em voz alta, num sotaque que nenhum dos dois entende.',
    fala('o oficial da prancha', 'Sobe. Sobe logo.', null, 'E volta pra folha como se a folha tivesse mudado.')
  ],
  ef:{perdeItens:{'Passagem':1}, registrar:'Subiu no S.S. Anne passando de frente pela Patrulha, de passagem na mão.'},
  escolhas:[
    {texto:'Ir pro salão.', vai:'c34_o_salao'}
  ]
},

c34_a_carga:{
  texto:[
    'Do outro lado do casco, onde ninguém olha, tem a porta da carga aberta e um homem de macacão fumando sentado num caixote.',
    'Ele vê o pino no seu peito antes de ver o seu rosto.',
    fala('o homem da carga', 'Cabine catorze, né. Disseram que você vinha.', 'baixo'),
    'Ele levanta, abre caminho entre os caixotes e aponta uma escada de ferro.',
    fala('o homem da carga', 'Isso aqui não é favor da rede. É que o comandante não gosta de cinza no navio dele. Sobe.')
  ],
  ef:{perdeItens:{'Passagem':1}, rep:{eixo:'ruim', delta:1, motivo:'Embarcou no S.S. Anne pela porta da carga, pela rede, fugindo da Patrulha'},
      registrar:'Embarcou no S.S. Anne pela porta da carga. O homem do macacão sabia que você vinha.'},
  escolhas:[
    {texto:'Subir a escada de ferro.', vai:'c34_o_salao'}
  ]
},

c34_o_salao:{
  texto:[
    d => {
      const n = ['gideon', 'ziggy', 'etta', 'soren', 'saskia', 'florian', 'zev'].filter(id => d.flags['sv_conheceu_' + id]).length;
      if (n === 0) return 'O navio sai do cais com o sol baixo, e às oito o salão de jantar enche. É o mesmo salão de antes, de lustre e toalha branca, mas a gente que senta nele é outra: quase todo mundo de mochila, quase todo mundo falando de torneio.';
      if (n < 3) return 'O salão continua cheio. Vermilion já virou um risco de luz atrás do navio.';
      return 'O salão começa a esvaziar. Um garçom recolhe as toalhas com pressa de quem quer dormir.';
    },
    d => d.flags.sv_conheceu_zev ? '' : 'Numa mesa de canto, um homem de cabelo comprido janta sozinho, e as mesas em volta dele estão vazias. Alguém sussurra "Mahogany" quando passa, e ninguém explica.'
  ],
  escolhas:_c34Salao()
},

c34_gideon:{
  texto:[
    'Ele joga paciência com um baralho tão velho que as cartas são da mesma cor dos dois lados.',
    fala('Gideon', 'Senta, {moço|moça}. Eu não mordo. O Lapras morde, mas ele está lá embaixo.'),
    fala('Gideon', 'Gideon. Pescador de Olivine. Quarenta e duas vezes eu peguei esse barco pro Torneio das Ilhas. Essa é a quadragésima terceira.'),
    'Ele vira uma carta, não gosta, e vira outra, que não é como se joga paciência.',
    fala('Gideon', 'A primeira vez eu tinha dezenove anos e um Lapras novinho. Cheguei na final. Perdi pra um rapaz da Ilha Sete, um tal de Magnus Holm, que hoje organiza o torneio e anda de bengala.'),
    fala('Gideon', 'Ele ganhou duas vezes. Eu perdi quarenta e duas. A gente se cumprimenta todo ano como se tivesse sido ontem.', 'riso'),
    'Ele para de virar carta.',
    fala('Gideon', 'Minha mulher acenava do cais de Olivine, todo ano, na saída. Esse ano não tinha ninguém acenando. Mas o barco saiu do mesmo jeito. Barco não sabe.', 'baixo')
  ],
  ef:{flag:'sv_conheceu_gideon', npc:{nome:'Gideon', opiniao:2, memoria:'Ouviu a história das quarenta e duas finais perdidas no jantar do S.S. Anne.'},
      registrar:'No S.S. Anne: o Gideon, pescador de Olivine, na quadragésima terceira viagem pro torneio. Perdeu a final de cinquenta anos atrás pro Magnus Holm, da Ilha Sete.'},
  escolhas:[
    {texto:'"Esse ano o barco leva você até o fim."', vai:'c34_o_salao',
     ef:{npc:{nome:'Gideon', opiniao:1, memoria:'Disse que esse ano o barco ia levar ele até o fim.'}}},
    {texto:'Ficar mais um pouco vendo ele roubar na paciência, e voltar pro salão.', vai:'c34_o_salao'}
  ]
},

c34_ziggy:{
  texto:[
    'Ele fala num transmissor de mão, com o fio enrolado no braço, num tom de quem está no ar há seis anos.',
    fala('Ziggy', 'Boa noite, ouvinte de Johto! Aqui é o Ziggy, direto do salão do S.S. Anne, rumo às Ilhas Sevii, e quem senta na minha frente agora é…'),
    'Ele vira o transmissor pra você. A luzinha vermelha está acesa.',
    fala('Ziggy', '…{o Campeão|a Campeã} de Kanto, ouvinte! Ao vivo! Bom, ao vivo gravado. Uma palavra pros caminhoneiros da madrugada?')
  ],
  escolhas:[
    {texto:'"Boa noite, Johto. Eu vim aprender."', vai:'c34_ziggy_fim',
     ef:{flag:'sv_ziggy_humilde', npc:{nome:'Ziggy', opiniao:2, memoria:'Disse no transmissor dele que veio às ilhas pra aprender.'}}},
    {texto:'"Eu vim ganhar. Avisa os caminhoneiros."', vai:'c34_ziggy_fim',
     ef:{flag:'sv_ziggy_ousado', npc:{nome:'Ziggy', opiniao:2, memoria:'Disse no transmissor dele que veio às ilhas pra ganhar.'}}},
    {texto:'Fazer uma careta pro transmissor, que é rádio, e ninguém vê.', vai:'c34_ziggy_fim',
     ef:{flag:'sv_ziggy_careta', npc:{nome:'Ziggy', opiniao:1, memoria:'Fez careta pro transmissor dele, que é rádio.'}}}
  ]
},
c34_ziggy_fim:{
  texto:[
    d => d.flags.sv_ziggy_careta
      ? fala('Ziggy', 'E {o Campeão|a Campeã} faz uma careta, ouvinte! Vocês não viram, mas foi das boas!', 'riso')
      : d.flags.sv_ziggy_ousado
      ? fala('Ziggy', 'Ouviram, ouvintes? Anota a placa do caminhão!', 'riso')
      : fala('Ziggy', 'Humildade, ouvinte! Coisa rara no ar da madrugada!'),
    'Ele desliga o transmissor, e no mesmo segundo fica quieto, de outro jeito, como se tivessem tirado ele da tomada.',
    fala('Ziggy', 'Vão tirar o programa do ar daqui a três meses. Ninguém mais escuta rádio de madrugada, diz o diretor.', 'baixo'),
    fala('Ziggy', 'Se o Ziggy da madrugada ganhar o Torneio das Ilhas, eles não têm coragem. Por isso eu gravo tudo.')
  ],
  ef:{flag:'sv_conheceu_ziggy', registrar:'No S.S. Anne: o Ziggy, radialista de Goldenrod, grava o torneio pra salvar o programa da madrugada.'},
  escolhas:[
    {texto:'Voltar pro salão.', vai:'c34_o_salao'}
  ]
},

c34_etta:{
  texto:[
    'A mesa dela é uma toalha estendida em cima de duas cadeiras, com fileiras de Pokébola de casca de Apricorn, cada uma de uma cor, cada uma com uma costura diferente.',
    'Ela tem uns catorze anos, cabelo loiro preso, a roupa manchada de tinta, e uma mochila do tamanho dela no chão, cheia de mais Pokébola pendurada por fora.',
    fala('Etta', 'Não é Pokébola comum. Ninguém diz "Pokébola comum" na minha mesa.', null, 'Ela diz isso antes de você dizer qualquer coisa.'),
    fala('Etta', 'É Apricorn. Azalea. A rua de baixo da rua do mestre famoso. Todo mundo conhece a de cima.'),
    'Ela pega uma verde, de tampa riscada, e põe na sua mão com cuidado de quem empresta uma coisa viva.',
    fala('Etta', 'Essa foi a primeira que fechou. Eu tinha nove anos. O Heracross mora nela desde então. Oitenta e quatro bolas eu fiz depois, e eu sei o dia de cada uma.')
  ],
  ef:{flag:'sv_conheceu_etta', npc:{nome:'Etta', opiniao:2, memoria:'Viu a mesa de Pokébolas de Apricorn dela no jantar do S.S. Anne, e a bola verde do Heracross.'},
      registrar:'No S.S. Anne: a Etta, de Azalea, catorze anos, com oitenta e quatro Pokébolas de Apricorn feitas à mão.'},
  escolhas:[
    {texto:'Devolver a bola verde com as duas mãos.', vai:'c34_o_salao',
     ef:{npc:{nome:'Etta', opiniao:1, memoria:'Devolveu a bola do Heracross com as duas mãos.'}}},
    {texto:'Perguntar quanto custa uma.', vai:'c34_o_salao',
     ef:{npc:{nome:'Etta', opiniao:1, memoria:'Perguntou o preço de uma Pokébola de Apricorn.'}}}
  ]
},

c34_soren:{
  texto:[
    'O vento do convés é frio e empurra a capa dele pro lado do mar. Ele está na amurada com uma Pokébola na mão, sem olhar pra ela, olhando a água.',
    'Cabelo azul-escuro curto, roupa vinho de domador, o forro dourado da capa aparecendo quando o vento vira. Uns dezenove anos.',
    fala('Soren', 'Soren. Blackthorn.', null, 'Ele não estende a mão.'),
    'Você fica do lado dele. Ele demora um minuto inteiro pra falar de novo.',
    fala('Soren', 'Ele não nasceu no Covil.', null, 'Ele levanta a Pokébola um pouco, só o bastante.'),
    fala('Soren', 'Nasceu numa caixa de papelão, no porto de Olivine. Eu troquei um Rattata do meu irmão pelo ovo, com um marinheiro de Hoenn. Os anciãos disseram que dragão que não nasceu da água do Covil não é dragão.'),
    fala('Soren', 'Ele virou Salamence no dia em que me disseram isso pela segunda vez.', 'frio')
  ],
  ef:{flag:'sv_conheceu_soren', npc:{nome:'Soren', opiniao:2, memoria:'Ficou do lado dele na amurada do S.S. Anne enquanto ele contava do Salamence.'},
      registrar:'No S.S. Anne: o Soren, domador de dragões de Blackthorn, com um Salamence que o clã dele não aceita.'},
  escolhas:[
    {texto:'"Ele voa. É o que importa."', vai:'c34_o_salao',
     ef:{npc:{nome:'Soren', opiniao:2, memoria:'Disse que o Salamence voa, e que é isso que importa.'}}},
    {texto:'Não dizer nada e ficar ali mais um pouco.', vai:'c34_o_salao',
     ef:{npc:{nome:'Soren', opiniao:1, memoria:'Ficou em silêncio do lado dele, na amurada.'}}}
  ]
},

c34_saskia:{
  texto:[
    'Ela faz flexão no meio do convés, de quimono azul e descalça, contando alto e rindo entre um número e outro.',
    fala('Saskia', '…noventa e oito, noventa e nove, CEM!', 'grita'),
    'Ela levanta num pulo, sacode os braços cheios de arranhão de pedra e te olha de cima a baixo.',
    fala('Saskia', 'Saskia, de Cianwood! Você é {o|a} de Kanto. Aperta aqui.', null, 'Ela estende o braço, não a mão.'),
    fala('Saskia', 'Não, de verdade. Braço de ferro, ali na mesa. Eu quero saber a força de quem eu vou enfrentar.')
  ],
  escolhas:[
    {texto:'Sentar na mesa e pegar a mão dela.', vai:'c34_saskia_braco'},
    {texto:'"Eu luto com Pokémon, não com o braço."', vai:'c34_saskia_fim',
     ef:{npc:{nome:'Saskia', opiniao:1, memoria:'Recusou o braço de ferro no convés do S.S. Anne.'}}}
  ]
},
c34_saskia_braco:{
  texto:['A mão dela é dura como corda molhada. Ela conta até três e não espera o três.'],
  teste:{status:'forca', dificuldade:8, nomeStatus:'Força', critico:'c34_saskia_ganhou', sucesso:'c34_saskia_ganhou', parcial:'c34_saskia_perdeu', falha:'c34_saskia_perdeu'}
},
c34_saskia_ganhou:{
  texto:[
    'O braço dela desce. Devagar, e depois de uma vez.',
    'Ela fica olhando a própria mão em cima da mesa como se a mão tivesse feito aquilo sozinha. Depois ri tão alto que o garçom derruba uma bandeja.',
    fala('Saskia', 'HA! Isso! Amanhã de manhã a gente nada até a boia. Os dois. É assim que se agradece.', 'riso')
  ],
  ef:{flag:'sv_saskia_braco', npc:{nome:'Saskia', opiniao:3, memoria:'Ganhou dela no braço de ferro, no convés do S.S. Anne.'}},
  escolhas:[
    {texto:'Voltar pro salão, com o braço doendo.', vai:'c34_saskia_fim'}
  ]
},
c34_saskia_perdeu:{
  texto:[
    'O seu braço desce. Rápido.',
    fala('Saskia', 'Ai, você segurou bem no começo! Isso é bom! A maioria nem segura.', 'riso'),
    'Ela bate no seu ombro com uma força que dá pra sentir no dia seguinte.'
  ],
  ef:{hp:-1, causa:'O braço de ferro com a Saskia', npc:{nome:'Saskia', opiniao:2, memoria:'Perdeu pra ela no braço de ferro, no convés do S.S. Anne, mas segurou no começo.'}},
  escolhas:[
    {texto:'Voltar pro salão.', vai:'c34_saskia_fim'}
  ]
},
c34_saskia_fim:{
  texto:[
    fala('Saskia', 'A minha mãe diz que eu nunca termino nada. Eu vim terminar um torneio.', null, 'Ela já voltou pro chão, contando a primeira flexão da segunda centena.')
  ],
  ef:{flag:'sv_conheceu_saskia', registrar:'No S.S. Anne: a Saskia, lutadora de Cianwood, que veio terminar um torneio.'},
  escolhas:[
    {texto:'Voltar pro salão.', vai:'c34_o_salao'}
  ]
},

c34_florian:{
  texto:[
    'Ele janta com uma mão só. A outra está em cima de uma caixa térmica azul, no colo, como quem segura a mão de alguém dormindo.',
    'Boné claro, roupa de trabalho verde, um caderno de capa mole aberto do lado do prato, cheio de número.',
    fala('Florian', 'Florian. Da creche da Rota 34. Desculpa a caixa. Ela vai comigo até no banheiro.'),
    fala('Florian', 'Seis ovos. Da mesma linhagem. Filhos e netos de uma Eevee só, que mora na creche dos meus avós desde antes de eu nascer.'),
    fala('Florian', 'É tradição minha: em todo torneio eu dou um ovo pra quem chega na final. A chance de chocar no caminho de volta é de oitenta e dois por cento. Desculpa. Eu sempre calculo.', 'riso'),
    'Ele levanta a tampa um dedo, pra você ver: seis ovos creme, em fila, num ninho de pano dobrado.'
  ],
  ef:{flag:'sv_conheceu_florian', npc:{nome:'Florian', opiniao:2, memoria:'Viu os seis ovos da linhagem dele no jantar do S.S. Anne.'},
      registrar:'No S.S. Anne: o Florian, criador da Rota 34, com uma caixa térmica de seis ovos pra quem chegar na final.'},
  escolhas:[
    {texto:'"Então eu vou chegar na final."', vai:'c34_o_salao',
     ef:{npc:{nome:'Florian', opiniao:1, memoria:'Disse que ia chegar na final pra ganhar um ovo.'}}},
    {texto:'"Cuida bem dessa caixa."', vai:'c34_o_salao',
     ef:{npc:{nome:'Florian', opiniao:1, memoria:'Disse pra ele cuidar bem da caixa térmica.'}}}
  ]
},

c34_zev:{
  texto:[
    'As três mesas em volta dele estão vazias. Ele janta devagar, de jaqueta marrom de viagem, com uma Pokébola do lado do prato em vez do guardanapo.',
    'Cabelo preto comprido, preso; barba de semanas. Ele levanta os olhos quando você puxa a cadeira, e não diz nada.',
    fala('Zev', 'Pode olhar. Todo mundo olha. Eu prefiro que olhe de frente.'),
    d => Sevii.daRede(d)
      ? fala('Zev', 'Esse pino que você usa. Eu tinha um parecido, de outra letra. Tira do peito no navio. Aqui todo mundo sabe ler.', 'baixo')
      : Sevii.daLei(d)
      ? fala('Zev', 'Você tem cara de quem trabalha com fichário. Eu já tenho ficha. Cumpri o que estava nela.', 'frio')
      : fala('Zev', 'Zev. Mahogany. O resto o salão já te contou.')
  ],
  escolhas:[
    {texto:'"O que tem em Mahogany pra pescar?"', vai:'c34_zev_lago'},
    {texto:'"É verdade o que dizem? Da Rocket?"', vai:'c34_zev_rocket'},
    {texto:'Comer junto, em silêncio.', vai:'c34_zev_silencio'}
  ]
},
c34_zev_lago:{
  texto:[
    'Ele demora. Depois a boca dele faz uma coisa que quase é sorriso.',
    fala('Zev', 'Magikarp. Muito Magikarp. E um Gyarados vermelho, uma vez, faz tempo, que todo mundo viu e ninguém pegou.'),
    fala('Zev', 'O meu é dos comuns. Mordeu a linha numa terça de chuva.'),
    fala('Zev', 'O lago é bom porque ninguém pergunta nada. Só se o Magikarp está mordendo.')
  ],
  ef:{flag:'sv_conheceu_zev', npc:{nome:'Zev', opiniao:2, memoria:'Perguntou do lago de Mahogany, e não do resto.'},
      registrar:'No S.S. Anne: o Zev, de Mahogany, que todo mundo evita. Vocês falaram do lago.'},
  escolhas:[
    {texto:'Voltar pro salão.', vai:'c34_o_salao'}
  ]
},
c34_zev_rocket:{
  texto:[
    fala('Zev', 'Pergunta pra eles.', 'frio'),
    'Ele levanta, pega a Pokébola do lado do prato, e sai do salão sem terminar a comida. Na porta, sem virar:',
    fala('Zev', 'Eu abri as gaiolas quando o esconderijo caiu. Fiquei pra abrir. Peguei dois anos por isso. É a única parte que eu conto.')
  ],
  ef:{flag:'sv_conheceu_zev', npc:{nome:'Zev', opiniao:-1, memoria:'Perguntou da Rocket no jantar do S.S. Anne.'},
      registrar:'No S.S. Anne: o Zev, de Mahogany, ex-recruta da Rocket. Ficou pra abrir as gaiolas quando o esconderijo caiu.'},
  escolhas:[
    {texto:'Voltar pro salão.', vai:'c34_o_salao'}
  ]
},
c34_zev_silencio:{
  texto:[
    'Vocês comem. O garçom passa duas vezes e não para. O navio balança um pouco, e o copo dele anda sozinho na mesa, e ele segura sem olhar.',
    'No fim ele empurra o prato, levanta, e antes de ir põe a mão no encosto da sua cadeira por um segundo.',
    fala('Zev', 'Obrigado. Faz tempo que ninguém janta comigo sem querer saber de nada.', 'baixo')
  ],
  ef:{flag:'sv_conheceu_zev', npc:{nome:'Zev', opiniao:3, memoria:'Jantou com ele em silêncio no S.S. Anne, sem perguntar nada.'},
      registrar:'No S.S. Anne: jantou em silêncio com o Zev, de Mahogany, o homem que todo mundo evita.'},
  escolhas:[
    {texto:'Voltar pro salão.', vai:'c34_o_salao'}
  ]
},

c34_a_noite:{
  texto:[
    'A cabine 14 tem uma escotilha redonda e uma cama que balança junto com o mar.',
    'De madrugada você acorda sem saber por quê. Pela escotilha, longe, no escuro, uma luz vermelha pisca no alto de um morro, sozinha: a torre de rádio de alguma ilha.',
    'Pisca, apaga, pisca. Ninguém mais no navio está olhando pra ela.'
  ],
  ef:{executar:() => { Relogio.amanhaAs(8); }},
  escolhas:[
    {texto:'Dormir de novo e acordar com o navio parando.', vai:'c34_a_chegada'}
  ]
},

c34_a_chegada:{
  texto:[
    'O Anne encosta no cais da Ilha Um às oito da manhã, no mesmo minuto em que encosta, do outro lado do cais, um navio de casco azul com o nome pintado em letra grande: ESTRELA DE SLATEPORT.',
    'O cais, que é comprido e estreito, enche de uma vez. Gente de Johto descendo de um lado, gente de Hoenn do outro, carregador, criança da ilha vendendo água, e no meio de tudo um Slowpoke dormindo na escada com o rabo dentro d\'água.',
    'Do Estrela desce uma turma de doze homens de capacete laranja, cantando uma música de cais em coro, e um deles, o maior, chora sem vergonha nenhuma porque nunca tinha viajado com a turma inteira.',
    'Desce uma menina de boné azul, verde de enjoo, agarrada no corrimão. Desce uma mulher de quimono preto negociando o preço do carregador antes de pisar no cais. Desce, por último, um homem de terno escuro e luva numa mão só, que olha pro Anne como quem procura uma pessoa.',
    'E desce, com três fotógrafos na frente, uma moça de vestido lilás de palco e laço no cabelo, acenando pra uma plateia que não está ali. Na cintura dela, presa numa fita, uma Pokébola com adesivo de concurso.',
    'Uma menina de jaqueta preta grande demais esbarra nela no meio do povo, diz "desculpa" sem parar de andar e some entre os carregadores.',
    'Dois segundos depois a moça de lilás grita. A fita da cintura está vazia.'
  ],
  escolhas:[
    {texto:'Correr atrás da jaqueta preta.', vai:'c34_a_corrida'},
    {texto:'Segurar a moça de lilás, que está quase pulando no mar atrás de ninguém.', vai:'c34_a_esme'},
    {texto:'Gritar pra alguém chamar a Guarda.', vai:'c34_a_guarda'}
  ]
},

c34_a_corrida:{
  texto:['A jaqueta preta passa entre dois carregadores, por baixo de um caixote içado, e vira pro fim do cais. Você vai atrás, empurrando gente que não sabe o que está acontecendo.'],
  teste:{status:'percepcao', dificuldade:7, nomeStatus:'Percepção', critico:'c34_o_bote', sucesso:'c34_o_bote', parcial:'c34_perdeu_de_vista', falha:'c34_perdeu_de_vista'}
},
c34_o_bote:{
  texto:[
    'No fim do cais tem um bote de madeira com o motor ligado e dois moleques dentro. A menina da jaqueta joga uma coisa redonda pra eles sem parar de correr, e o bote sai antes de a coisa cair no fundo dele.',
    'Ela não entra no bote. Vira pra trás e te vê.',
    'Pele morena de sol, cabelo verde-mar preso no alto, uns dezesseis anos. Um Murkrow pousa no ombro dela de onde ninguém viu ele sair.',
    'Ela olha pra você um segundo inteiro, sem medo nenhum, e se joga no mar pelo lado do cais.',
    'Você chega na beirada. Ela já está nadando por baixo do píer, e quando você vê de novo, sobe do outro lado, no meio dos barcos de pesca, e some.',
    'Na sua frente, encostada no poste de amarrar, uma garota de cabelo comprido e roupa preta fecha o caminho com os braços cruzados e uma Pokébola na mão.',
    fala('uma garota da Maré', 'Calma. O cais é nosso. Quem corre no cais paga pedágio.', 'frio')
  ],
  ef:{flag:'sv_viu_a_noa', registrar:'No cais da Ilha Um, a menina da jaqueta preta jogou a Pokébola da moça de lilás num bote e pulou no mar. Cabelo verde-mar, um Murkrow no ombro.'},
  escolhas:[
    {texto:'Pagar o pedágio do jeito dela.', vai:'c34_a_garota'}
  ]
},
c34_a_garota:{
  texto:['Ela solta a Pokébola com um estalo de dedo, como quem já fez isso mil vezes no mesmo cais.'],
  batalha:{sevii:'mare', mais:-6, tipo:'treinador', fuga:false,
           intro:'A garota da Maré solta a Pokébola sem tirar o outro braço do peito.',
           vitoria:'c34_a_garota_perdeu', derrota:'c34_a_garota_ganhou'}
},
c34_a_garota_perdeu:{
  texto:[
    'O último dela cai na beira do cais. Ela recolhe sem pressa nenhuma, e sem raiva.',
    fala('uma garota da Maré', 'Tá. Passa.'),
    fala('uma garota da Maré', 'Mas não adianta correr. A gente não guarda nada. O que pega, sobe.', 'baixo'),
    'Ela aponta pro mar, pro norte, e vai embora antes de você perguntar sobe pra onde.'
  ],
  ef:{flag:'sv_mare_subiu', registrar:'Uma garota da Maré disse que a turma do cais não guarda nada: "o que pega, sobe".'},
  escolhas:[
    {texto:'Voltar pro meio do cais.', vai:'c34_o_fim'}
  ]
},
c34_a_garota_ganhou:{
  texto:[
    'O seu último cai, e ela não comemora. Só descruza os braços.',
    fala('uma garota da Maré', 'Bem-vind{o|a} à Ilha Um.', 'frio'),
    'Ela vai embora pelo meio dos barcos, assobiando, e um Pokémon de cada barco olha ela passar.'
  ],
  escolhas:[
    {texto:'Voltar pro meio do cais.', vai:'c34_o_fim'}
  ]
},
c34_perdeu_de_vista:{
  texto:[
    'Um caixote içado desce bem na sua frente. Quando você dá a volta nele, o fim do cais tem dez pessoas, três barcos e nenhuma jaqueta preta.',
    'Lá longe, um bote de madeira sai pro norte, rápido demais pra um bote de pesca.'
  ],
  escolhas:[
    {texto:'Voltar pro meio do cais.', vai:'c34_o_fim'}
  ]
},

c34_a_esme:{
  texto:[
    'Ela já está com um pé na beirada do cais, olhando a água como se a Pokébola pudesse estar lá embaixo. Você segura pelo braço.',
    'De perto ela é mais nova do que parece de longe, uns vinte anos, e a maquiagem de palco começou a escorrer de um lado só.',
    fala('Esme', 'Ela tem nove anos. Desde Feebas. Você sabe o que é criar um Feebas?', null, 'O sorriso de palco continua no rosto dela, e é a pior parte.'),
    fala('Esme', 'Ninguém consegue. Eu consegui. Ela é a Milotic mais bonita de Hoenn, e não é porque eu disse: foram três jurados, três vezes.'),
    'Um dos fotógrafos tira uma foto dela chorando. Ela vira pra ele com uma calma que dá medo.',
    fala('Esme', 'Se essa foto sair, eu acho você.', 'frio')
  ],
  ef:{flag:'sv_esme_ajudou', npc:{nome:'Esme', opiniao:2, memoria:'Te segurou na beirada do cais quando levaram a Milotic.'}},
  escolhas:[
    {texto:'"Eu vou achar a sua Milotic."', vai:'c34_esme_prometeu'},
    {texto:'Ficar com ela até a Guarda chegar.', vai:'c34_o_fim'}
  ]
},
c34_esme_prometeu:{
  texto:[
    'Ela te olha de verdade pela primeira vez. Olha a Pokébola no seu cinto, a sua roupa, a sua cara.',
    fala('Esme', 'Você é {o Campeão|a Campeã} de Kanto. O moço do jornal disse no navio.'),
    fala('Esme', 'Então me diz que isso serve pra alguma coisa.', 'baixo')
  ],
  ef:{flag:'sv_esme_pediu', npc:{nome:'Esme', opiniao:1, memoria:'Prometeu achar a Milotic dela, no cais da Ilha Um.'},
      registrar:'Prometeu à Esme, de Lilycove, achar a Milotic que levaram no cais da Ilha Um.'},
  escolhas:[
    {texto:'Ficar com ela até a Guarda chegar.', vai:'c34_o_fim'}
  ]
},

c34_a_guarda:{
  texto:[
    'Ninguém se mexe. Um carregador aponta o morro com o queixo, e um menino sai correndo naquela direção.',
    'Dez minutos depois desce o morro, de bicicleta, um homem grande de farda verde-escura, quepe e um caderno no bolso da camisa. Ele desce da bicicleta antes de ela parar.',
    fala('Sargento Lund', 'Lund. Sargento. Guarda das Ilhas.', null, 'Ele já está com o caderno aberto.'),
    fala('Sargento Lund', 'A Guarda inteira. Pode olhar em volta: não tem mais ninguém.'),
    'Ele ouve a moça de lilás, anota, ouve você, anota. Anota devagar, com letra grande.',
    fala('Sargento Lund', 'Terceira essa semana. Vigésima terceira do mês. Todas de quem veio de fora, todas de Pokémon que não se acha no mato daqui.', 'baixo'),
    fala('Sargento Lund', 'Moleque não escolhe Milotic. Moleque escolhe o que dá pra vender na esquina. Alguém está escolhendo pra eles.')
  ],
  ef:{flag:'sv_lund_conheceu', npc:{nome:'Sargento Lund', opiniao:2, memoria:'Chamou a Guarda quando levaram a Milotic, no cais da Ilha Um.'},
      registrar:'O Sargento Lund, a Guarda das Ilhas inteira, contou vinte e três roubos no mês, todos de Pokémon de quem veio de fora.'},
  escolhas:[
    {texto:'"Aqui não tem a Patrulha de Kanto?"', vai:'c34_lund_patrulha'},
    {texto:'"Eu posso ajudar."', vai:'c34_o_fim',
     ef:{flag:'sv_lund_ofereceu', npc:{nome:'Sargento Lund', opiniao:1, memoria:'Ofereceu ajuda no primeiro dia, no cais.'}}}
  ]
},
c34_lund_patrulha:{
  texto:[
    fala('Sargento Lund', 'Kanto fica do outro lado do mar. As ilhas ficam deste.'),
    fala('Sargento Lund', 'A Patrulha nunca atravessou. Quando a fábrica fechou e metade da Ilha Um ficou sem emprego, também não atravessou ninguém.', 'frio'),
    d => Sevii.procurado(d)
      ? 'Ele te olha um segundo a mais do que olhou os outros, e volta pro caderno sem anotar nada.'
      : 'Ele volta pro caderno.'
  ],
  escolhas:[
    {texto:'"Eu posso ajudar."', vai:'c34_o_fim',
     ef:{flag:'sv_lund_ofereceu', npc:{nome:'Sargento Lund', opiniao:1, memoria:'Ofereceu ajuda no primeiro dia, no cais.'}}},
    {texto:'Deixar ele trabalhar.', vai:'c34_o_fim'}
  ]
},

c34_o_fim:{
  texto:[
    'No meio da manhã o cais esvazia. O Anne apita uma vez e começa a desatracar pra voltar a Vermilion, e o Estrela de Slateport segue pra Ilha Dois com quem ainda não desceu.',
    d => d.flags.sv_esme_ajudou ? 'A moça de lilás está sentada num caixote, sem fotógrafo nenhum, com a fita vazia nas duas mãos.' : 'A moça de lilás foi levada pra pousada pelos fotógrafos, que agora fotografam a pousada.',
    d => d.flags.sv_lund_conheceu ? 'O sargento sobe o morro de volta empurrando a bicicleta, com o caderno no bolso da camisa.' : 'Ninguém da Guarda apareceu. Um carregador diz que a Guarda é um homem só, e que o homem só mora no alto do morro.',
    'E na ponta do cais, sentados num barco de pesca encalhado, três moleques da ilha olham pra todo mundo que desceu, um por um, como quem conta.',
    'Atrás deles, na ponta do cais, a fábrica de conserva fechada, de portão acorrentado. A placa caiu e ficou de cabeça pra baixo, e ainda dá pra ler: CONSERVAS PENROSE.'
  ],
  ef:{flag:'sv_chegou', registrar:'Chegou à Ilha Um, nas Ilhas Sevii. No primeiro minuto, levaram a Milotic de uma coordenadora de Hoenn no cais.'},
  fim:true, sai:'ilha_um',
  resumo:'O Navio: uma noite de mar com quem veio de Johto, e, no cais da Ilha Um, uma Pokébola arrancada de uma fita no meio do povo.'
}

}
});
