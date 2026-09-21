/* ============================================================
   CAPÍTULO 21 — A RUA DE ONDE VOCÊ SAIU
   Pallet. Você tem oito insígnias, um telefone cheio de números
   e uma rua que continuou existindo sem você o tempo todo.
   ============================================================ */
CAPITULOS.push(

{
num:21, titulo:'A Rua de Onde Você Saiu', local:d=>d.jogador.cidade, ambiente:'campo', nivelArea:52,
tom:'sombrio', inicio:'c21_chegada_em_casa',
cenas:{

c21_chegada_em_casa:{
  texto:[
    d=>`Você desce do ônibus na entrada de ${d.jogador.cidade} às quatro e vinte da tarde e a primeira coisa que te ocorre é que a placa é menor do que você lembrava.`,
    'Não é que ela tenha encolhido. É que você viu placa de cidade grande desde então, e a sua cabeça refez a escala sem te avisar.',
    d=>{
      const p = d.time[0];
      if (!p) return 'A rua tem três pessoas nela e duas delas param de andar quando te veem.';
      return `${nomeExib(p)} desce atrás de você e para, e cheira o ar, e entende antes de você que isto aqui é casa.`;
    },
    d=>fala(nomeCasa(), 'Eu liguei TRÊS VEZES.', 'grita',
            'A voz vem da terceira casa antes mesmo de você ver quem é.'),
    d=>fala(nomeCasa(), 'Três! E o aparelho é meu, eu sei que ele toca!')
  ],
  ef:{flag:'voltou_pra_casa', registrar:'Voltou para a cidade de onde saiu, com oito insígnias.'},
  escolhas:[
    {texto:'Ir direto pra casa, sem parar em lugar nenhum.', vai:'c21_dentro_de_casa'},
    {texto:'Andar a rua inteira primeiro, devagar.', vai:'c21_a_rua'},
    {texto:'Passar na calçada do Sr. Ushio, que é onde se resolve coisa.', vai:'c21_rufino',
     cond:d=>!!d.npcs['Sr. Ushio']},
    {texto:'Ir ao Centro Pokémon antes de ver gente.', vai:'c21_centro_primeiro'},
    {texto:'Ligar pra casa do orelhão da esquina, mesmo estando a trinta metros.', vai:'c21_orelhao',
     cond:d=>Estado.temPokenav()},
    {texto:'Não entrar na sua rua. Comprar o que precisa e pegar a estrada.', vai:'c21_nao_foi_pra_casa'}
  ]
},

/* ── a rua ─────────────────────────────────────────────────── */
c21_a_rua:{
  texto:[
    'Você anda a rua inteira com a mochila no ombro, devagar, do jeito que só se anda numa rua que a gente conhece de cor.',
    'O muro do laboratório continua devolvendo a bola reto. Tem duas crianças novas jogando, e nenhuma delas sabe quem você é.',
    'A casa do número oito pintou de azul. A do quatorze não pintou de nada há mais tempo ainda.',
    'E tem uma coisa que você não esperava: tem um cartaz seu no poste.',
    'É pequeno, é impresso em papel comum, tem uma foto ruim da sua licença e a palavra PARABÉNS escrita à mão embaixo.'
  ],
  ef:{moral:4, flag:'viu_o_cartaz',
      registrar:'Alguém pregou um cartaz com a sua foto no poste da rua.'},
  escolhas:[
    {texto:'Descobrir quem pregou.', vai:'c21_quem_pregou'},
    {texto:'Tirar o cartaz do poste. É constrangedor.', vai:'c21_tirou_o_cartaz'},
    {texto:'Deixar. Ir pra casa.', vai:'c21_dentro_de_casa'}
  ]
},

c21_quem_pregou:{
  texto:[
    'Você bate em duas portas e na terceira acha, porque na terceira a pessoa fica vermelha antes de você terminar a pergunta.',
    fala('Sra. Chiyo', 'Foi eu. Foi eu e eu não peço desculpa.', 'grita'),
    fala('Sra. Chiyo', 'Eu imprimi vinte. Tem em Viridian também. Eu fui de ônibus e pus em Viridian.'),
    'Vinte cartazes. Ela pagou impressão de vinte cartazes com a sua cara de licença.',
    fala('Sra. Chiyo', 'Você trouxe a caixa?', 'baixo', 'Ela muda de assunto porque não aguenta o assunto.')
  ],
  ef:{moral:6,
      npc:{nome:'Sra. Chiyo', opiniao:4, memoria:'Imprimiu vinte cartazes com a sua cara e pôs até em Viridian.'},
      rep:{eixo:'bom',delta:2,motivo:'A vizinha imprimiu vinte cartazes com a sua cara', rep:{notorio:true}},
      registrar:'A Sra. Chiyo imprimiu vinte cartazes. Levou alguns até Viridian.'},
  escolhas:[
    {texto:'"Eu trouxe a caixa." (mesmo que não tenha)', vai:'c21_a_caixa_de_volta'},
    {texto:'Abraçar ela, que é o que ninguém faz com a dona Chiyo.', vai:'c21_abracou_odete'},
    {texto:'Ir pra casa antes que fique pior.', vai:'c21_dentro_de_casa'}
  ]
},

c21_a_caixa_de_volta:{
  texto:[
    'Você não tem a caixa. Você perdeu a caixa em algum lugar entre Pewter e Cerulean, e você sabe disso há meses.',
    'Você compra uma caixa de ventilador no armazém por quatrocentos pokedólares, tira a etiqueta, amassa um canto com a mão pra parecer usada, e entrega.',
    fala('Sra. Chiyo', 'Essa não é a minha caixa.', 'frio', 'Ela olha por dois segundos.'),
    fala('Sra. Chiyo', '...mas é melhor que a minha. Obrigada, menino.', 'riso')
  ],
  ef:{dinheiro:-400, moral:3,
      npc:{nome:'Sra. Chiyo', opiniao:2, memoria:'Comprou uma caixa nova pra devolver a que perdeu, e ela percebeu.'},
      registrar:'Comprou uma caixa nova pra devolver à Sra. Chiyo. Ela percebeu.'},
  escolhas:[
    {texto:'Ir pra casa.', vai:'c21_dentro_de_casa'},
    {texto:'Andar a rua inteira primeiro.', vai:'c21_a_rua', cond:d=>!d.flags.viu_o_cartaz},
    {texto:'Passar no Centro Pokémon antes.', vai:'c21_centro_primeiro', cond:d=>!d.flags.a_enfermeira_nova}
  ]
},

c21_abracou_odete:{
  texto:[
    'Você abraça a Sra. Chiyo no meio da calçada, o que é uma coisa que ninguém faz com a Sra. Chiyo.',
    'Ela fica rígida por uns dois segundos inteiros, como quem não sabe onde põe os braços.',
    'Depois ela sabe onde põe os braços.',
    fala('Sra. Chiyo', 'Tá bom. Tá bom. Chega. CHEGA.', 'grita',
         'Ela é quem solta por último, e por uma margem considerável.')
  ],
  ef:{moral:7,
      npc:{nome:'Sra. Chiyo', opiniao:5, memoria:'Você abraçou ela na calçada. Ela soltou por último.'},
      rep:{eixo:'bom',delta:1,motivo:'Abraçou quem ninguém abraça'},
      registrar:'Abraçou a Sra. Chiyo na calçada.'},
  escolhas:[
    {texto:'Ir pra casa.', vai:'c21_dentro_de_casa'},
    {texto:'Andar a rua inteira primeiro.', vai:'c21_a_rua', cond:d=>!d.flags.viu_o_cartaz},
    {texto:'Passar no Centro Pokémon antes.', vai:'c21_centro_primeiro', cond:d=>!d.flags.a_enfermeira_nova}
  ]
},

c21_tirou_o_cartaz:{
  texto:[
    'Você tira o cartaz do poste, dobra em quatro e põe no bolso, porque ver a própria cara num poste é uma coisa muito específica de constrangedora.',
    'Três postes adiante tem outro.',
    'Você conta onze na rua inteira. Onze cartazes com a sua cara de licença e a palavra PARABÉNS escrita à mão, onze vezes, com a mesma caneta.',
    'Você para de tirar no quinto.'
  ],
  ef:{flag:'tirou_os_cartazes', moral:-2,
      registrar:'Começou a tirar os cartazes com a sua cara e parou no quinto.'},
  escolhas:[
    {texto:'Repor os cinco que você tirou.', vai:'c21_repos_os_cartazes'},
    {texto:'Ir pra casa com os cinco no bolso.', vai:'c21_dentro_de_casa'}
  ]
},

c21_repos_os_cartazes:{
  texto:[
    'Você desdobra os cinco, alisa cada um na perna da calça, e prega de volta nos mesmos postes.',
    'Fica torto. Fica pior do que estava.',
    'Fica certo.'
  ],
  ef:{moral:4, limpaFlag:'tirou_os_cartazes',
      rep:{eixo:'bom',delta:1,motivo:'Repôs o que tinha arrancado por vergonha'},
      registrar:'Repôs os cartazes que tinha tirado.'},
  escolhas:[
    {texto:'Ir pra casa.', vai:'c21_dentro_de_casa'},
    {texto:'Andar a rua inteira primeiro.', vai:'c21_a_rua', cond:d=>!d.flags.viu_o_cartaz},
    {texto:'Passar no Centro Pokémon antes.', vai:'c21_centro_primeiro', cond:d=>!d.flags.a_enfermeira_nova}
  ]
},

/* ── o Sr. Ushio ──────────────────────────────────────────── */
c21_rufino:{
  texto:[
    'A calçada está varrida. Ela sempre está varrida.',
    'O Sr. Ushio está sentado no degrau, e não em pé com a vassoura, e é a primeira vez na sua vida que você vê ele sentado no degrau.',
    fala('Sr. Ushio', 'Demorou.', null, 'Ele não levanta.'),
    fala('Sr. Ushio', 'Senta aqui. Eu não subo mais em banquinho e você já é alto o suficiente pra isso não ser um problema seu.'),
    d=>d.flags.divida_pendente
      ? 'Você senta, e tem uma janela entre vocês dois que ninguém mencionou ainda.'
      : 'Você senta.'
  ],
  ef:{npc:{nome:'Sr. Ushio', opiniao:1, memoria:'Estava sentado no degrau quando você voltou.'},
      registrar:'O Sr. Ushio estava sentado no degrau, e não em pé com a vassoura.'},
  escolhas:[
    {texto:'Pagar a janela agora, com juros de oito anos.', vai:'c21_pagou_a_janela',
     cond:d=>!!d.flags.divida_pendente && d.jogador.dinheiro >= 2000},
    {texto:'Perguntar por que ele está sentado.', vai:'c21_por_que_sentado'},
    {texto:'Contar a viagem inteira, do começo.', vai:'c21_contou_tudo'},
    {texto:'Ficar em silêncio junto. Ele não pediu conversa.', vai:'c21_silencio_no_degrau'}
  ]
},

c21_pagou_a_janela:{
  texto:[
    'Você põe o dinheiro no degrau entre vocês dois, com o peso de uma pedrinha em cima pra não voar.',
    d=>fala(d.jogador.nome, 'Isso é a janela. E oito anos de juros que eu calculei mal, mas pra cima.'),
    'Ele olha o dinheiro. Não pega.',
    fala('Sr. Ushio', 'A janela foi vinte pokedólares em 1989 e eu consertei no mesmo dia com um vidro que eu já tinha.'),
    fala('Sr. Ushio', 'Eu cobrei porque eu queria ver se você lembrava. Você lembrou. Acabou ali.'),
    fala('Sr. Ushio', 'Pega o dinheiro de volta e compra Potion, menino. Todo mundo compra bola demais.', 'riso')
  ],
  ef:{limpaFlag:'divida_pendente', moral:5,
      npc:{nome:'Sr. Ushio', opiniao:5, memoria:'Você voltou pra pagar a janela. Ele nunca quis o dinheiro.'},
      rep:{eixo:'bom',delta:2,motivo:'Voltou anos depois para pagar uma dívida de vinte pokedólares', rep:{notorio:true}},
      registrar:'Voltou para pagar a janela. Ele não aceitou o dinheiro.'},
  escolhas:[
    {texto:'Insistir. Deixar o dinheiro mesmo assim.', vai:'c21_insistiu_rufino'},
    {texto:'Pegar de volta e ficar sentado ali.', vai:'c21_silencio_no_degrau'}
  ]
},

c21_insistiu_rufino:{
  texto:[
    'Você deixa o dinheiro no degrau e levanta, e ele deixa o dinheiro no degrau também, e vocês dois ficam olhando o dinheiro no degrau.',
    fala('Sr. Ushio', 'Você é teimoso igual a quem te criou.', 'riso'),
    fala('Sr. Ushio', 'Tá. Eu pego. E eu vou gastar em coisa que não presta, só pra você aprender.')
  ],
  ef:{dinheiro:-2000, moral:3,
      npc:{nome:'Sr. Ushio', opiniao:4, memoria:'Insistiu até ele aceitar o dinheiro da janela.'},
      registrar:'Insistiu e o Sr. Ushio aceitou o dinheiro.'},
  escolhas:[{texto:'Ficar sentado no degrau um pouco.', vai:'c21_silencio_no_degrau'}]
},

c21_por_que_sentado:{
  texto:[
    d=>fala(d.jogador.nome, 'Por que o senhor tá sentado?'),
    'Ele demora pra responder de um jeito que já é a resposta.',
    fala('Sr. Ushio', 'Porque o joelho. E porque a calçada já tá varrida desde as seis, e antes eu varria de novo às onze só pra ter o que fazer.'),
    fala('Sr. Ushio', 'Aí eu parei de varrer de novo às onze. Foi ano passado.'),
    fala('Sr. Ushio', 'Não faz essa cara. Todo mundo para de varrer às onze uma hora.', 'riso')
  ],
  ef:{flag:'sabe_do_joelho_do_rufino',
      npc:{nome:'Sr. Ushio', opiniao:3, memoria:'Te contou por que parou de varrer duas vezes por dia.'},
      rep:{eixo:'bom',delta:1,motivo:'Perguntou uma coisa que ninguém pergunta a um velho'},
      registrar:'O Sr. Ushio parou de varrer a calçada duas vezes por dia. Foi ano passado.'},
  escolhas:[
    {texto:'Pegar a vassoura e varrer a calçada dele.', vai:'c21_varreu_a_calcada'},
    {texto:'Contar a viagem inteira, do começo.', vai:'c21_contou_tudo'},
    {texto:'Ficar em silêncio junto.', vai:'c21_silencio_no_degrau'}
  ]
},

c21_varreu_a_calcada:{
  texto:[
    'Você pega a vassoura antes que ele reclame e varre a calçada inteira, que já está varrida, e você sabe que está varrida.',
    'Ele reclama assim mesmo. Ele reclama do jeito que você está segurando. Ele reclama do canto que você pulou.',
    'Ele reclama de olho fechado, encostado na parede, no sol das quatro e meia.',
    'Quando você termina, ele não fala nada sobre a calçada.',
    fala('Sr. Ushio', 'Na terça que vem eu não vou conseguir. Se você ainda estiver na cidade.', 'baixo',
         'É a coisa mais perto de um pedido que esse homem já fez a alguém.')
  ],
  ef:{moral:6, flag:'varreu_a_calcada_do_rufino',
      npc:{nome:'Sr. Ushio', opiniao:6, memoria:'Varreu a calçada dele e ele pediu pra terça que vem.'},
      rep:{eixo:'bom',delta:3,motivo:'Varreu a calçada de um velho com oito insígnias no bolso', rep:{notorio:true}},
      registrar:'Varreu a calçada do Sr. Ushio. Ele pediu pra terça que vem.'},
  escolhas:[
    {texto:'"Eu estou." Prometer a terça.', vai:'c21_prometeu_a_terca',
     ef:{flag:'prometeu_a_terca', moral:4}},
    {texto:'"Não vou estar." Ser honesto.', vai:'c21_nao_vai_estar',
     ef:{flag:'nao_prometeu_a_terca'}}
  ]
},

c21_prometeu_a_terca:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu estou.'),
    'Você não sabe se vai estar. Você tem uma convocação chegando, uma mesa comprida te esperando no Planalto e um vale no norte que ninguém desenhou.',
    'Mas você fala que está, e você fala sério na hora de falar, e essas duas coisas nem sempre são a mesma.',
    fala('Sr. Ushio', 'Então tá.', null, 'Ele anota na testa com dois dedos, como sempre.')
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Prometeu uma terça-feira comum a um velho'},
      registrar:'Prometeu voltar na terça pra varrer a calçada.'},
  escolhas:[
    {texto:'Ir pra casa.', vai:'c21_dentro_de_casa'},
    {texto:'Andar a rua inteira primeiro.', vai:'c21_a_rua', cond:d=>!d.flags.viu_o_cartaz},
    {texto:'Passar no Centro Pokémon antes.', vai:'c21_centro_primeiro', cond:d=>!d.flags.a_enfermeira_nova}
  ]
},

c21_nao_vai_estar:{
  texto:[
    d=>fala(d.jogador.nome, 'Não vou estar. Me chamaram pro Planalto.'),
    'Ele assente devagar, e não tem decepção na cara dele, o que é pior do que se tivesse.',
    fala('Sr. Ushio', 'Eu sei. Eu perguntei mesmo assim.'),
    fala('Sr. Ushio', 'Perguntar é de graça, menino. E de vez em quando a resposta é sim.')
  ],
  ef:{moral:2,
      npc:{nome:'Sr. Ushio', opiniao:2, memoria:'Você foi honesto sobre a terça em vez de prometer.'},
      rep:{eixo:'bom',delta:1,motivo:'Preferiu a verdade à promessa fácil'},
      registrar:'Foi honesto com o Sr. Ushio sobre a terça.'},
  escolhas:[
    {texto:'Ir pra casa.', vai:'c21_dentro_de_casa'},
    {texto:'Andar a rua inteira primeiro.', vai:'c21_a_rua', cond:d=>!d.flags.viu_o_cartaz},
    {texto:'Passar no Centro Pokémon antes.', vai:'c21_centro_primeiro', cond:d=>!d.flags.a_enfermeira_nova}
  ]
},

c21_contou_tudo:{
  texto:[
    'Você conta tudo. Do começo. A Floresta, o Monte Lua, o navio, o galpão de Celadon, a usina, a Silph, a Estação 4, a sala 704.',
    'Leva quarenta minutos e ele não interrompe uma vez.',
    'Quando você termina, ele fica quieto por um tempo comprido.',
    fala('Sr. Ushio', 'Eu varri essa calçada todo dia durante esses meses todos.'),
    fala('Sr. Ushio', 'E enquanto eu varria, tinha isso tudo acontecendo. A mesma quarta-feira pra mim e pra você.'),
    fala('Sr. Ushio', 'É engraçado. Eu não sei se é bom ou ruim, mas é engraçado.', 'baixo')
  ],
  ef:{moral:4,
      npc:{nome:'Sr. Ushio', opiniao:4, memoria:'Ouviu a sua viagem inteira sem interromper uma vez.'},
      rep:{eixo:'bom',delta:1,motivo:'Contou tudo a quem só queria ouvir'},
      registrar:'Contou a viagem inteira pro Sr. Ushio, do começo.'},
  escolhas:[
    {texto:'Pegar a vassoura e varrer a calçada dele.', vai:'c21_varreu_a_calcada'},
    {texto:'Ir pra casa.', vai:'c21_dentro_de_casa'}
  ]
},

c21_silencio_no_degrau:{
  texto:[
    'Vocês dois ficam sentados no degrau e não falam nada por uns bons vinte minutos.',
    'Passa um carro. Passa a mesma criança duas vezes, na mesma direção, sem explicação.',
    'O sol desce o suficiente pra sair da calçada e subir na parede.',
    'Não é constrangedor em momento nenhum, e você percebe que isso é uma coisa rara, e que você não tem isso com quase ninguém.'
  ],
  ef:{moral:3, rep:{eixo:'bom',delta:1,motivo:'Ficou vinte minutos em silêncio com quem não pediu conversa'},
      registrar:'Ficou vinte minutos sentado em silêncio no degrau do Sr. Ushio.'},
  escolhas:[
    {texto:'Levantar e ir pra casa.', vai:'c21_dentro_de_casa'},
    {texto:'Andar a rua inteira primeiro.', vai:'c21_a_rua', cond:d=>!d.flags.viu_o_cartaz},
    {texto:'Passar no Centro Pokémon antes.', vai:'c21_centro_primeiro', cond:d=>!d.flags.a_enfermeira_nova}
  ]
},

/* ── o centro e o orelhão ──────────────────────────────────── */
c21_centro_primeiro:{
  texto:[
    d=>`O posto do Centro Pokémon ${d.jogador.cidade === 'Pallet' ? 'continua funcionando numa sala dos fundos do mercado' : 'abriu um prédio novo de dois andares'}, e a enfermeira do balcão é outra.`,
    'A de antes foi transferida. A nova tem vinte e poucos anos e uma prancheta igual.',
    fala('a enfermeira nova', 'Cartão, por favor.'),
    'Você entrega o cartão e ela passa o leitor, e o leitor apita, e ela para.',
    fala('a enfermeira nova', 'Oito.', 'baixo'),
    fala('a enfermeira nova', 'Desculpa. É que a gente vê muito cartão e quase nunca vê oito.')
  ],
  ef:{flag:'a_enfermeira_nova',
      npc:{nome:'Enfermeira nova', opiniao:2, memoria:'Passou o seu cartão e viu oito insígnias pela primeira vez.'},
      registrar:'A enfermeira do balcão é outra. A de antes foi transferida.'},
  escolhas:[
    {texto:'Perguntar pra onde a outra foi.', vai:'c21_pra_onde_ela_foi'},
    {texto:'Curar o time e ir pra casa.', vai:'c21_dentro_de_casa',
     ef:{executar:d=>{ d.time.forEach(curarTotal); Estado.curarJogador(20);
       return [{tipo:'cura', texto:'O time voltou inteiro.'}]; }}}
  ]
},

c21_pra_onde_ela_foi:{
  texto:[
    d=>fala(d.jogador.nome, 'A enfermeira que estava aqui antes. Pra onde ela foi?'),
    fala('a enfermeira nova', 'Voltou pra estrada.', null, 'Ela diz isso como quem repete uma coisa que achou absurda.'),
    fala('a enfermeira nova', 'Trinta e seis anos, pediu exoneração, tirou licença nova. Disse que faltavam duas.'),
    'Faltavam duas insígnias. Ela parou em seis, e agora faltavam duas.',
    'Você fica com o cartão na mão por um tempo a mais do que precisava.'
  ],
  ef:{flag:'a_enfermeira_voltou_pra_estrada', moral:5,
      rep:{eixo:'bom',delta:1,motivo:'Alguém voltou pra estrada depois de conversar com você'},
      registrar:'A enfermeira do Centro pediu exoneração e voltou pra estrada. Faltavam duas.'},
  escolhas:[
    {texto:'Pedir o número dela.', vai:'c21_numero_da_enfermeira',
     cond:d=>Estado.temPokenav()},
    {texto:'Curar o time e ir pra casa.', vai:'c21_dentro_de_casa',
     ef:{executar:d=>{ d.time.forEach(curarTotal); Estado.curarJogador(20);
       return [{tipo:'cura', texto:'O time voltou inteiro.'}]; }}}
  ]
},

c21_numero_da_enfermeira:{
  texto:[
    'A enfermeira nova olha pros lados, o que é desnecessário porque não tem ninguém, e escreve num papel de receita.',
    fala('a enfermeira nova', 'Ela deixou isso aqui pro caso de alguém perguntar.'),
    fala('a enfermeira nova', 'Em seis meses você é a primeira pessoa que perguntou.', 'baixo')
  ],
  ef:{flag:'historia_da_enfermeira', moral:3,
      npc:{nome:'Enfermeira do Centro', opiniao:2, memoria:'Deixou o número no balcão pro caso de alguém perguntar. Você perguntou.'},
      rep:{eixo:'bom',delta:1,motivo:'Perguntou por alguém que ninguém procurou'},
      registrar:'Pegou o número da enfermeira que voltou pra estrada.'},
  escolhas:[{texto:'Curar o time e ir pra casa.', vai:'c21_dentro_de_casa',
     ef:{executar:d=>{ d.time.forEach(curarTotal); Estado.curarJogador(20);
       return [{tipo:'cura', texto:'O time voltou inteiro.'}]; }}}]
},

c21_orelhao:{
  texto:[
    'Você está a trinta metros da sua própria porta e liga do orelhão da esquina, o que não faz sentido nenhum e faz todo sentido.',
    'Dois toques.',
    d=>fala(nomeCasa(), 'Alô?', null, 'A voz está sem fôlego. Ela correu pro telefone.'),
    d=>fala(d.jogador.nome, 'Oi. Sou eu.'),
    'Silêncio do outro lado.',
    d=>fala(nomeCasa(), 'Você tá onde?', 'baixo'),
    d=>fala(d.jogador.nome, 'Na esquina.'),
    'Você ouve o telefone cair na mesa sem ser desligado, e ouve a porta, e ouve, de dentro do fone e de fora do fone ao mesmo tempo, a sua rua inteira.'
  ],
  ef:{moral:8, flag:'ligou_da_esquina',
      rep:{eixo:'bom',delta:1,motivo:'Ligou da esquina em vez de chegar de surpresa'},
      registrar:'Ligou pra casa do orelhão da esquina, a trinta metros da porta.'},
  escolhas:[
    {texto:'Ficar parado e deixar ela vir.', vai:'c21_dentro_de_casa'},
    {texto:'Andar a rua inteira primeiro.', vai:'c21_a_rua', cond:d=>!d.flags.viu_o_cartaz},
    {texto:'Passar no Centro Pokémon antes.', vai:'c21_centro_primeiro', cond:d=>!d.flags.a_enfermeira_nova}
  ]
},

/* ── dentro de casa ────────────────────────────────────────── */
c21_dentro_de_casa:{
  texto:[
    'A casa é menor. Não do jeito triste — do jeito real. Você cresceu quatro centímetros e viu prédio de onze andares, e a sua casa continuou a mesma, e a sua cabeça refez a escala.',
    'O seu quarto está exatamente como você deixou, o que quer dizer que alguém tem entrado ali pra deixar exatamente como você deixou.',
    d=>`${casaCompleto()} está na porta do quarto, com o pano na mão, e não entra.`,
    d=>fala(nomeCasa(), 'Eu não mexi em nada.'),
    d=>fala(nomeCasa(), 'Eu tirei o pó. Mas eu não mexi.', 'baixo')
  ],
  ef:{moral:6, flag:'entrou_no_quarto_de_novo',
      registrar:'Entrou no próprio quarto depois de meses. Não tinham mexido em nada.'},
  escolhas:[
    {texto:'Mostrar as oito insígnias uma por uma.', vai:'c21_mostrou_as_oito'},
    {texto:'Falar da convocação do Planalto agora, antes de esquentar.', vai:'c21_contou_da_convocacao'},
    {texto:'Perguntar o que aconteceu aqui enquanto você não estava.', vai:'c21_o_que_aconteceu_aqui'},
    {texto:'Não falar de nada. Dormir na sua cama, que é o que você veio fazer.', vai:'c21_dormiu_na_cama'}
  ]
},

c21_mostrou_as_oito:{
  texto:[
    'Você abre o cartão em cima da mesa da cozinha e conta as oito, uma por uma, com cidade e nome de líder.',
    d=>fala(nomeCasa(), 'Repete.'),
    'Você repete.',
    d=>fala(nomeCasa(), 'Repete de novo. Devagar. Eu quero decorar a ordem.', 'baixo'),
    'Você repete três vezes ao todo, e na terceira ela fecha os olhos pra ouvir melhor, e mexe os lábios junto.',
    'Ela vai contar essa lista pra rua inteira. Ela vai errar a ordem. Ninguém vai corrigir.'
  ],
  ef:{moral:8, flag:'mostrou_as_insignias_em_casa',
      rep:{eixo:'bom',delta:2,motivo:'Contou as oito insígnias em casa, três vezes, devagar'},
      registrar:'Mostrou as oito insígnias em casa. Repetiu três vezes.'},
  escolhas:[
    {texto:'Falar da convocação do Planalto.', vai:'c21_contou_da_convocacao'},
    {texto:'Deixar pra amanhã e dormir.', vai:'c21_dormiu_na_cama'}
  ]
},

c21_o_que_aconteceu_aqui:{
  texto:[
    d=>fala(d.jogador.nome, 'E aqui? O que aconteceu aqui?'),
    'A pergunta pega ela desprevenida, porque ninguém faz essa pergunta pra quem ficou.',
    d=>fala(nomeCasa(), 'Aqui? Aqui não acontece nada, menino.'),
    'E aí ela conta, por quarenta minutos, tudo que não aconteceu:',
    d=>fala(nomeCasa(), 'O telhado dos fundos. A conta de luz que veio errada duas vezes. A filha do Kuroda que casou. O cachorro do quatorze que morreu — aquele velho, você lembra dele.'),
    d=>fala(nomeCasa(), 'A Chiyo imprimindo cartaz. Eu falei pra ela não fazer isso. Ela fez vinte.', 'riso'),
    'Não aconteceu nada, e levou quarenta minutos pra contar.'
  ],
  ef:{moral:7, flag:'perguntou_o_que_aconteceu_em_casa',
      rep:{eixo:'bom',delta:2,motivo:'Perguntou o que aconteceu com quem ficou'},
      registrar:'Perguntou o que aconteceu em casa. Levou quarenta minutos de nada.'},
  escolhas:[
    {texto:'Subir no telhado dos fundos e olhar o que precisa.', vai:'c21_o_telhado'},
    {texto:'Falar da convocação do Planalto.', vai:'c21_contou_da_convocacao'},
    {texto:'Dormir.', vai:'c21_dormiu_na_cama'}
  ]
},

c21_o_telhado:{
  texto:[
    'Você sobe no telhado dos fundos às cinco e meia da tarde com uma chave de fenda e nenhuma competência.',
    'São três telhas. Uma rachada, duas fora de posição. Você resolve as duas fora de posição em dez minutos e a rachada não tem como resolver sem telha nova.',
    'Você desce, vai no armazém, compra três telhas por seiscentos, volta e sobe de novo.',
    d=>fala(nomeCasa(), 'DESCE DAÍ!', 'grita', 'Ela grita do quintal, e continua gritando o tempo inteiro, e não sai de lá em nenhum momento.'),
    'Você desce quando termina. O telhado não vai mais pingar neste inverno.'
  ],
  ef:{dinheiro:-600, moral:6, flag:'consertou_o_telhado',
      rep:{eixo:'bom',delta:2,motivo:'Consertou o telhado da casa com oito insígnias no bolso'},
      registrar:'Consertou as três telhas do telhado dos fundos.'},
  escolhas:[
    {texto:'Falar da convocação do Planalto.', vai:'c21_contou_da_convocacao'},
    {texto:'Tomar banho e dormir.', vai:'c21_dormiu_na_cama'}
  ]
},

c21_contou_da_convocacao:{
  texto:[
    'Você põe o telegrama em cima da mesa e empurra.',
    'É um papel amarelo com quatro linhas em maiúsculo, timbrado, e a palavra COMPARECIMENTO aparece duas vezes.',
    d=>fala(nomeCasa(), 'Isso é ruim?'),
    d=>fala(d.jogador.nome, 'Eu não sei.'),
    d=>fala(nomeCasa(), 'Você sabe alguma coisa?'),
    d=>fala(d.jogador.nome, 'Eu sei que eles não convocam quem não incomoda.'),
    'Ela lê o papel amarelo mais duas vezes, do começo, os dois lados, inclusive o lado sem nada escrito.',
    d=>fala(nomeCasa(), 'Come antes de ir. Só isso que eu tenho pra falar sobre isso.', 'baixo')
  ],
  ef:{flag:'contou_da_convocacao_em_casa', moral:3,
      registrar:'Mostrou a convocação do Planalto em casa.'},
  escolhas:[
    {texto:'Dormir na sua cama.', vai:'c21_dormiu_na_cama'},
    {texto:'Ficar acordado na cozinha com ela até tarde.', vai:'c21_acordados_ate_tarde'}
  ]
},

c21_acordados_ate_tarde:{
  texto:[
    'Vocês ficam acordados até uma e meia da manhã na cozinha, com a luz de cima apagada e a do fogão acesa, que é como esta casa conversa depois das onze.',
    'Não falam da convocação de novo. Falam de bobagem: de quando você caiu da bicicleta, do primo que virou treinador em 1989, do nome do cachorro do quatorze.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} dorme debaixo da mesa a noite inteira e ninguém manda ele sair.`
               : 'O relógio da parede continua três minutos adiantado. Ninguém nunca acertou.';
    },
    'Você vai lembrar desta cozinha depois, em lugares muito piores do que esta cozinha.'
  ],
  ef:{moral:9, flag:'a_noite_na_cozinha', hp:4,
      rep:{eixo:'bom',delta:1,motivo:'Ficou acordado até uma e meia por conversa de bobagem'},
      registrar:'Ficou até uma e meia da manhã na cozinha, com a luz do fogão.'},
  escolhas:[{texto:'Dormir.', vai:'c21_dormiu_na_cama'}]
},

c21_dormiu_na_cama:{
  texto:[
    'Você dorme na sua cama pela primeira vez em meses e é pior do que você esperava.',
    'O colchão é mole demais. O travesseiro é alto demais. A casa faz barulhos que você desaprendeu.',
    'Você acorda três vezes e na terceira desiste, pega o cobertor e deita no chão do quarto, do lado da mochila.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} deita colado em você e adormece em nove segundos, porque pra ele o chão é o chão em qualquer lugar do mundo.`
               : 'Você adormece no chão em quatro minutos.';
    },
    'É essa a parte que ninguém te conta: que a estrada entra em você e não sai mais, e que a sua própria cama vira um lugar que você visita.'
  ],
  ef:{hp:8, flag:'dormiu_no_chao_de_casa',
      registrar:'Não conseguiu dormir na própria cama. Dormiu no chão, do lado da mochila.'},
  escolhas:[
    {texto:'Acordar, tomar café e ir pro Planalto.', vai:'c21_saida_de_casa'},
    {texto:'Ficar mais um dia. O Planalto espera.', vai:'c21_mais_um_dia'}
  ]
},

c21_mais_um_dia:{
  texto:[
    'Você fica mais um dia. A convocação diz uma data e a data tem folga de três dias, e você usa um.',
    'Não acontece nada de especial neste dia. Você conserta o que dá, come o que colocam no prato, anda a rua duas vezes.',
    'É exatamente por não acontecer nada que você vai lembrar dele.'
  ],
  ef:{moral:5, hp:6, flag:'ficou_mais_um_dia',
      rep:{eixo:'bom',delta:1,motivo:'Gastou um dia de folga da convocação em casa'},
      registrar:'Gastou um dia da folga da convocação em casa, sem fazer nada.'},
  escolhas:[{texto:'No dia seguinte, ir.', vai:'c21_saida_de_casa'}]
},

c21_saida_de_casa:{
  texto:[
    'A saída é curta, porque segunda saída sempre é curta. A primeira é que é comprida.',
    d=>fala(nomeCasa(), 'Vai.', null, 'Nada de discurso. Nada de "volta". Ela já disse isso uma vez e não repete.'),
    'Na porta, ela enfia alguma coisa no bolso de fora da sua mochila, do jeito que ela faz, sem avisar o que é.',
    'Você só vai descobrir depois, na estrada, e é uma foto três por quatro da sua licença — daquelas vinte que a Sra. Chiyo imprimiu — com uma coisa escrita atrás.',
    d=>fala(nomeCasa(), 'pra você lembrar da cara que você tinha quando saiu', 'baixo',
            'Escrito a lápis, na letra que você conhece desde que aprendeu a ler.')
  ],
  ef:{itens:{'Foto três por quatro com um bilhete atrás':1}, moral:6,
      flag:'saiu_de_casa_a_segunda_vez',
      registrar:'Saiu de casa pela segunda vez. Levou uma foto com um bilhete atrás.'},
  fim:true
},

/* ── quem pula tudo ────────────────────────────────────────── */
c21_nao_foi_pra_casa:{
  texto:[
    'Você passa pela sua rua sem entrar na sua rua, o que exige um desvio de dois quarteirões e alguma determinação.',
    'Você compra o que precisa no armazém, de cabeça baixa, e o homem do armazém te reconhece e não fala nada, porque ele entende de cabeça baixa.',
    'E aí você pega a estrada de novo.',
    'Não tem punição nenhuma nisso. Ninguém te cobra. É só que vai ficar.'
  ],
  ef:{flag:'nao_entrou_na_propria_rua', moral:-5,
      rep:{eixo:'ruim',delta:1,motivo:'Passou pela própria rua sem entrar nela'},
      registrar:'Passou por casa e não entrou.'},
  fim:true
}

}
}

);
