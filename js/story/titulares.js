/* ============================================================
   OS TITULARES DA ELITE — Lorelei, Bruno e Agatha
   Os três pararam de subir no mesmo mês, quando um mês inteiro
   passou sem desafiante (o capítulo 17 conta desde quando), e
   estão em casa: a Lorelei no cais velho de Fuchsia, o Bruno no
   turno da manhã da pedreira de Pewter, a Agatha na casa de
   janela verde atrás da Torre de Lavender.

   Ninguém volta sozinho, e ninguém volta porque a Liga pediu.
   Cada um lê uma coisa que você fez antes, no lugar dele — o gelo
   das Seafoam, a fenda da pedreira, o sexto andar da Torre — e o
   resto se decide na porta de casa, na visita. Quem volta toma a
   porta de volta de quem sentava nela, com o time e o jeito dele.
   O jogo não diz o que cada um pesa: a folha de regras diz só que
   pesa.

   O jeito de cada um, lido das flags (não guardado):
     'volta'  — o que você fez basta; a visita só conta isso;
     'raiva'  — volta pra ganhar de você (só a Agatha tem);
     'fecha'  — não volta, diga você o que disser;
     'talvez' — a conversa na porta decide.
   O que a visita decide fica em `titular_<id>` ('voltou' ou
   'ficou') e não se desfaz.
   ============================================================ */

const TITULARES = {

/* ── LORELEI ─────────────────────────────────────────────
   Cabelo vermelho preso, óculos, terno escuro até pra dar ração
   pro Lapras. Exata, seca, com o humor de quem corrige a palavra
   dos outros; não suporta elogio nem pena. Mediu o gelo das
   Seafoam dezenove semanas sem perguntar o que ele esperava. */
lorelei:{
  id:'lorelei', ordem:1, porta:0, nome:'Lorelei', titular:'Lorelei', f:true,
  tipo:'Gelo', nivelBase:62, substituto:'giselle', local:'fuchsia',
  pista:'sabe_onde_lorelei', titulo:'O cais velho', afazer:'Bater na porta azul do cais velho',
  especies:[87, 91, 80, 124, 131],   // Dewgong, Cloyster, Slowbro, Jynx, Lapras
  jeito(f){
    if (f.capturou_articuno) return 'fecha';
    if (f.devolveu_o_filhote) return 'volta';
    if (f.traiu_articuno) return 'fecha';
    return 'talvez';
  },
  intro:d=>[
    'O corredor da ala tem quatro portas seguidas. A primeira tem uma placa de bronze na altura dos olhos: LORELEI. Hoje a placa não mente.',
    'A sala de aula continua sala de aula. O projetor está ligado, e na parede tem uma tabela: espessura de gelo, semana por semana, dezenove linhas.'
      + (d.flags.devolveu_o_filhote || d.flags.lorelei_devolveu ? ' Na última, o número cai pra zero.' : ''),
    'Lorelei está em pé na frente do quadro: cabelo vermelho preso, óculos, terno escuro. No fundo da sala, uma moça de vinte e poucos anos ocupa uma carteira, de caderno aberto.',
    '"A Giselle fica," diz a Lorelei, sem olhar pra trás. "Ela sentou na minha cadeira por meses e anotou cada desafiante. Eu quero os dados."',
    '"Você veio." Ela não pergunta; constata.',
    d.flags.devolveu_o_filhote
      ? '"Eu passei dezenove semanas medindo um gelo que você resolveu perguntando. Hoje eu descubro se você também sabe lutar, ou se só sabe perguntar."'
      : d.flags.lorelei_devolveu
        ? '"O mar de Fuchsia descongelou em onze dias. Eu contei cada um. Não vou te agradecer: agradecer seria dizer que eu não chegaria lá sozinha."'
        : '"Você olhou onde eu não olhei, de joelhos no meu gelo. Hoje eu olho você inteir{o|a}."',
    '"A regra da ala, que ninguém lê: daqui você só sai vencendo os quatro ou perdendo de um. Não tem Centro Pokémon aqui dentro."',
    '"Gelo não é o meu tipo. É o meu método: tudo fica mais devagar, e quem pensa devagar perde."'
  ],
  vitoria:d=>[
    'O Lapras é o último a cair, e cai devagar, como tudo que ela treinou.',
    'Lorelei tira os óculos, limpa na manga do terno e põe de volta.',
    '"Muito bem. Agora eu tenho um erro novo pra estudar, e eu estava precisando de um."',
    'No fundo da sala, a Giselle vira a página do caderno com força demais.',
    Titulares.voltou('bruno', d)
      ? '"Próxima porta. E não conta pro Bruno que eu perdi: ele conta pros outros de boca cheia."'
      : '"Próxima porta. Ninguém descansa aqui. Isso foi ideia minha, anos atrás, e eu continuo achando boa."'
  ],
  derrota:d=>[
    'O seu último cai, e a sala fica tão quieta que dá pra ouvir o ventilador do projetor.',
    '"Você pensou rápido. Rápido não é o mesmo que certo."',
    '"Volta quando tiver errado o bastante em casa. Eu levei dezenove semanas, e ninguém me deu desconto."'
  ]
},

/* ── BRUNO ───────────────────────────────────────────────
   Do tamanho de uma porta, cabelo preto comprido preso, sem
   camisa, calça branca de treino com pó de pedra na barra. Ri
   alto, come muito, dá tapa nas costas; não aguenta discurso e
   não perdoa quem entrega trabalhador. Começou na pedreira de
   Pewter com doze anos, e foi pra lá que voltou. */
bruno:{
  id:'bruno', ordem:2, porta:1, nome:'Bruno', titular:'Bruno',
  tipo:'Lutador', nivelBase:64, substituto:'aj', local:'pewter',
  pista:'sabe_onde_bruno', titulo:'O turno da manhã', afazer:'Descer na pedreira atrás do Bruno',
  /* a pedreira só trabalha de manhã: chegando fora disso, você chega com o turno */
  hora:{de:6, ate:12, vai:8},
  especies:[237, 107, 106, 95, 68],   // Hitmontop, Hitmonchan, Hitmonlee, Onix, Machamp
  jeito(f){
    if (f.entregou_o_rapaz) return 'fecha';
    if (f.protegeu_o_rapaz || f.pagou_o_rapaz || f.sugeriu_a_sirene) return 'volta';
    return 'talvez';
  },
  intro:d=>[
    'A segunda porta diz BRUNO. A sala de terra batida tem, pela primeira vez em meses, uma coisa além de terra: uma panela num fogareiro, no canto, soltando fumaça.',
    'Bruno está no centro, sem camisa, de calça branca de treino, com o cabelo preto comprido preso. O Machamp dele está sentado do lado da panela, tomando conta.',
    'Encostado na parede do fundo, de braços cruzados, tem um homem de uns quarenta anos com um chicote enrolado no cinto.',
    '"CHEGOU!" A voz do Bruno enche a sala vazia e volta das quatro paredes.',
    d.flags.sugeriu_a_sirene
      ? '"Os Zubat da pedreira mandaram lembrança. Tocou a sirene, eles somem. Faz meses que ninguém leva Golbat na cara."'
      : (d.flags.protegeu_o_rapaz || d.flags.pagou_o_rapaz)
        ? '"O moleque da fenda mandou lembrança. Pediu pra eu ganhar de você devagar, pra você aprender."'
        : '"Você carregou pedra comigo. Hoje quem carrega sou eu."',
    '"Esse aí é o A.J., que guardou a minha sala." Ele aponta o fundo com o queixo. "Eu pedi ela de volta. Ele disse não. Ele tinha razão de dizer não, e eu tinha razão de pedir, e a gente resolveu do único jeito que dá."',
    '"Ele me ganhou a terceira," diz o A.J., do fundo, sem descruzar os braços. "Vinte anos depois da segunda. Valeu a espera."',
    '"Come antes?" Bruno aponta a panela. "Não? Então depois. Depois a gente come junto, ganhe quem ganhar."'
  ],
  vitoria:d=>[
    'O Machamp cai sentado, e depois de costas, e fica olhando o teto com as quatro mãos abertas, como quem toma sol.',
    'Bruno solta uma gargalhada que não tem nada de derrota.',
    '"Meses carregando pedra, e eu achando que tava forte!"',
    'Ele te dá um tapa nas costas que quase te derruba, enche uma tigela da panela e põe na sua mão. No fundo da sala, o A.J. descruza os braços pela primeira vez.',
    Titulares.voltou('agatha', d)
      ? '"Come andando. A Agatha não espera ninguém, e com fome ela fica pior."'
      : '"Come andando. O Mandi já ligou a música, dá pra ouvir daqui."'
  ],
  derrota:d=>[
    'O seu último cai, e Bruno é o primeiro a ajoelhar do lado dele, antes de você.',
    '"Machucou? Não machucou. Tá inteiro."',
    'Ele confere com a mão aberta, do jeito que confere pedra.',
    '"Você bateu bem. Bateu cansad{o|a}. Volta descansad{o|a}, que eu apanho direito."'
  ]
},

/* ── AGATHA ──────────────────────────────────────────────
   Oitenta e poucos anos, pequena, xale verde por cima do vestido
   roxo, cabelo claro enrolado, bengala. Fuma, aposta, xinga com
   graça e adivinha quanto tempo cada desafiante dura. Despreza
   pena; gosta de cara de pau. Sabia que o osso no sexto andar não
   era fantasma, e a cidade acendeu vela. */
agatha:{
  id:'agatha', ordem:3, porta:2, nome:'Agatha', titular:'Agatha', f:true,
  tipo:'Fantasma', nivelBase:65, substituto:'mandi', local:'lavender',
  pista:'sabe_onde_agatha', titulo:'A janela verde', afazer:'Bater na janela verde atrás da Torre',
  especies:[169, 93, 24, 200, 94],   // Crobat, Haunter, Arbok, Misdreavus, Gengar
  jeito(f){
    if (f.usou_escudo) return 'raiva';
    if (f.bateu_no_marowak) return f.contou_a_verdade_ao_hideo ? 'talvez' : 'raiva';
    if (f.acalmou_marowak || f.entendeu_a_cena || f.era_chamado || f.sabe_o_que_o_marowak_faz) return 'volta';
    return 'talvez';
  },
  intro:d=> d.flags.agatha_com_raiva ? [
    'A terceira porta diz AGATHA. A cadeira do lado de fora está vazia, e a porta está aberta.',
    'Lá dentro a sala está escura de verdade: sem refletor, sem fumaça, sem música. Uma senhora pequena, de xale verde e bengala, espera em pé no meio dela.',
    d.flags.usou_escudo
      ? '"Faltava uma Pokébola no seu cinto quando você desceu a Torre," diz a Agatha. "Eu não esqueci, e os meus também não."'
      : '"Quatro dias aquele Marowak pediu socorro," diz a Agatha. "Você foi a única pessoa que subiu, e bateu nele."',
    '"Eu subi esta montanha por sua causa. Não fica lisonjead{o|a}."',
    d.flags.usou_escudo
      ? '"Os meus nunca foram escudo de ninguém. Vem ver o que isso dá."'
      : '"Os meus nunca pediram socorro pra quem bate antes de ouvir. Vem ver como é."'
  ] : [
    'A terceira porta diz AGATHA, e a cadeira do lado de fora está ocupada de novo.',
    'A senhora sentada nela é pequena, de xale verde e bengala, com um cinzeiro no colo, e olha quem chega como quem confere mercadoria.',
    '"Ah. Você." Ela não levanta.',
    '"O Mandi, o palhaço que guardou a minha sala, queria me anunciar com refletor e música. Eu disse que, se ele ligasse aquilo, eu entrava na sala dele de Gengar e saía sem o Mandi."',
    'De algum lugar do corredor, alguém desliga uma música no meio do compasso.',
    '"Eu vou te dizer quanto tempo você dura, que é o que eu fazia sentada aqui." Ela olha o seu cinto, Pokébola por Pokébola.',
    `"${cap1(porExtenso(Titulares.minutos(d)))} minutos."`,
    '"Eu errava pouco." Ela apaga o cigarro, levanta com a bengala e entra na sala na sua frente. "Vem. E não chora se perder: os meus não gostam de choro, preferem medo."'
  ],
  vitoria:d=> d.flags.agatha_com_raiva ? [
    'O Gengar cai sem rir, e a sala clareia um pouco, como se a escuridão fosse dele.',
    d.flags.usou_escudo
      ? '"Você ganhou." Ela apoia as duas mãos na bengala. "Isso não muda o que você deixou no sexto andar."'
      : '"Você ganhou." Ela apoia as duas mãos na bengala. "Isso não muda o que você fez no sexto andar."',
    '"Muda o que eu sei de você. Vai."'
  ] : [
    'O Gengar ri antes de cair. É o único Pokémon que você já viu rir de perder.',
    'Agatha olha você de cima a baixo de novo, como quem refaz uma conta.',
    '"Eu errei o tempo. Faz trinta anos que eu não erro o tempo."',
    '"Vai, que o Lance fica nervoso quando eu demoro, e é a única graça que ele tem."'
  ],
  derrota:d=> d.flags.agatha_com_raiva ? [
    'O seu último cai, e a sala continua escura.',
    '"Agora você sabe como é chamar e ninguém vir."',
    'Ela sai da sala antes de você levantar, e a bengala dela no corredor é o único barulho da ala.'
  ] : [
    'O seu último cai, e a Agatha olha o relógio da parede antes de olhar você.',
    '"Acertei. Quase no minuto."',
    '"Volta quando tiver medo de mim. Por enquanto você só tem educação, e educação perde."'
  ]
}
};

const Titulares = {
  todos(){ return Object.values(TITULARES); },

  /* o que a visita decidiu: 'voltou', 'ficou' ou nada ainda */
  estado(id, d){ d = d || Estado.dados; return (d && d.flags && d.flags['titular_' + id]) || null; },
  voltou(id, d){ return this.estado(id, d) === 'voltou'; },
  quantos(d){ return this.todos().filter(t => this.voltou(t.id, d)).length; },
  todosVoltaram(d){ return this.quantos(d) === this.todos().length; },

  /* quem senta atrás da porta i hoje: o titular, se voltou, ou quem
     sentava no lugar dele */
  membro(i, d){
    const t = this.todos().find(t => t.porta === i);
    return t && this.voltou(t.id, d) ? t : ELITE4[i];
  },

  jeito(id, d){
    d = d || Estado.dados;
    return TITULARES[id].jeito(d.flags || {});
  },

  /* A ausência é notícia do capítulo 17 (a voz do rádio): antes dele,
     nem pista nem visita, senão a notícia chegava velha. */
  liberado(d){
    d = d || Estado.dados;
    return (d.capitulosFechados || []).includes(17) || Math.floor(d.capitulo) >= 18;
  },
  /* a cidade ainda pode contar onde a pessoa está */
  pistaAberta(id, d){
    d = d || Estado.dados;
    return this.liberado(d) && !d.flags[TITULARES[id].pista] && !this.estado(id, d);
  },
  visitavel(id, d){
    d = d || Estado.dados;
    const t = TITULARES[id];
    return !!t && this.liberado(d) && !!d.flags[t.pista] && !this.estado(id, d) && !d.flags.campeao_de_kanto;
  },

  afazeres(local){
    return this.todos().filter(t => t.local === local && this.visitavel(t.id))
      .map(t => ({id:'tit_' + t.id, titulo:t.afazer}));
  },

  fazer(id){
    const t = TITULARES[id];
    const ev = Eventos.porId('tit_' + id);
    if (!t || !ev || !this.visitavel(id)) return Exploracao.tela();
    /* quem só trabalha numa parte do dia é achado nela */
    if (t.hora){
      sincronizarHora(Estado.dados.relogio);
      const h = Estado.dados.relogio.hora;
      if (h < t.hora.de || h >= t.hora.ate) Relogio.ate(t.hora.vai);
    }
    Estado.salvar('auto');
    UI.telaEvento(ev);
  },

  /* a visita decidiu; o que ela decide fica */
  decidir(id, volta, extra){
    const t = TITULARES[id], d = Estado.dados;
    if (!t || this.estado(id, d)) return [];
    Estado.marcar('titular_' + id, volta ? 'voltou' : 'ficou');
    if (extra && extra.raiva) Estado.marcar('agatha_com_raiva');
    if (volta){
      Estado.registrar(`${t.nome} vai voltar pra porta ${t.f ? 'dela' : 'dele'} na ala da Elite.`);
      return [{tipo:'mundo', texto:`${t.nome} volta pra ${t.ordem === 1 ? 'primeira' : t.ordem === 2 ? 'segunda' : 'terceira'} porta da ala da Elite. Quem sentava no lugar ${t.f ? 'dela' : 'dele'} sai da cadeira.`}];
    }
    Estado.registrar(`${t.nome} não vai voltar pra Elite.`);
    return [{tipo:'info', texto:`${t.nome} fica em casa.`}];
  },

  /* o mar de Fuchsia ainda parado: ninguém devolveu o pequeno nem
     tirou quem segurava o gelo (o fim do capítulo 13) */
  marParado(d){
    d = d || Estado.dados;
    const f = d.flags || {};
    return !f.devolveu_o_filhote && !f.capturou_articuno && !f.lorelei_devolveu;
  },

  /* quanto tempo a Agatha diz que você dura: três minutos por
     Pokémon em pé, e três de lambuja */
  minutos(d){
    d = d || Estado.dados;
    const n = (d.time || []).filter(p => p && !p.morto && p.hp > 0).length;
    return 3 + 3 * Math.max(1, n);
  }
};

/* ============================================================
   AS VISITAS — eventos encadeados: só chegam pelo afazer do lugar
   (Titulares.fazer), nunca pelo sorteio.
   ============================================================ */
const VISITAS_DOS_TITULARES = [

/* ── Lorelei, no cais velho de Fuchsia ─────────────────── */
{
  id:'tit_lorelei', encadeado:true,
  titulo:'O cais velho',
  texto:[
    d=>Titulares.marParado(d)
      ? 'A última casa do cais velho de Fuchsia tem porta azul e uma rampa de barco que não leva barco nenhum: leva um Lapras, deitado de lado, dormindo com a barriga encostada no gelo da beira.'
      : 'A última casa do cais velho de Fuchsia tem porta azul e uma rampa de barco que não leva barco nenhum: leva um Lapras, deitado de lado, dormindo com metade do corpo na água.',
    /* volta: ela sabe quem devolveu o pequeno */
    d=>Titulares.jeito('lorelei', d) === 'volta' ? 'A porta abre antes de você bater.' : '',
    d=>Titulares.jeito('lorelei', d) === 'volta' ? 'A mulher que abre tem cabelo vermelho preso, óculos e um terno escuro bem passado, que ninguém usa pra dar ração a um Lapras. Ela usa.' : '',
    d=>Titulares.jeito('lorelei', d) === 'volta' ? fala('Lorelei', 'Você é a pessoa por causa de quem o pequeno voltou pras Seafoam.', null, 'Não é pergunta.') : '',
    d=>Titulares.jeito('lorelei', d) === 'volta' ? fala('Lorelei', 'Lorelei. Entra ou fala daí. Eu não sirvo café.') : '',
    d=>Titulares.jeito('lorelei', d) === 'volta' ? 'A sala é uma mesa, uma cadeira e quatro paredes de caderno. Cada caderno tem uma data na lombada, e as datas são todas deste ano.' : '',
    d=>Titulares.jeito('lorelei', d) === 'volta' ? fala('Lorelei', 'Dezenove semanas. Eu fui até as ilhas onze vezes, de Lapras, com régua e termômetro, e voltei onze vezes com números.', null, 'Ela encosta a mão na lombada mais nova.') : '',
    d=>Titulares.jeito('lorelei', d) === 'volta' ? fala('Lorelei', 'Espessura, temperatura, quanto avançava por semana. Eu sabia tudo daquele gelo, menos o que ele estava esperando.') : '',
    d=>Titulares.jeito('lorelei', d) === 'volta' ? fala('Lorelei', 'Você foi uma vez e perguntou.', 'frio') : '',
    /* fecha: o pássaro na Pokébola, ou a Pokébola jogada nele */
    d=>Titulares.jeito('lorelei', d) === 'fecha' ? 'Você bate duas vezes. Ninguém abre.' : '',
    d=>Titulares.jeito('lorelei', d) === 'fecha' ? 'Pela janela do lado, entreaberta, dá pra ver uma mesa, uma cadeira e quatro paredes de caderno.' : '',
    d=>Titulares.jeito('lorelei', d) === 'fecha' ? fala('Lorelei', 'Eu sei quem você é.', 'frio', 'A voz vem de dentro, de perto da janela. Ninguém aparece nela.') : '',
    d=>Titulares.jeito('lorelei', d) !== 'fecha' ? ''
      : d.flags.capturou_articuno
        ? fala('Lorelei', 'O gelo das Seafoam caiu em quatro dias, de uma vez. Eu medi a queda. Ninguém segura dezenove semanas de mar e solta em quatro dias por vontade própria.')
        : fala('Lorelei', 'Na tarde em que você foi até as ilhas, o gelo engrossou dois centímetros em quarenta minutos. Eu medi. Gelo não engrossa assim por frio.'),
    d=>Titulares.jeito('lorelei', d) === 'fecha' ? fala('Lorelei', 'Eu não volto pra sala, e não é por sua causa. É que eu não tenho nada pra ensinar a quem resolve as coisas desse jeito, e nada que eu queira aprender.') : '',
    /* talvez: o mar ainda parado, e ela de joelhos nele */
    d=>Titulares.jeito('lorelei', d) === 'talvez' ? 'Ninguém atende a porta. Quem atende é o cais.' : '',
    d=>Titulares.jeito('lorelei', d) === 'talvez' ? 'Na ponta do píer, onde a água devia bater, tem gelo, e em cima dele, de joelhos, uma mulher de terno escuro mede o gelo com uma régua de metal comprida e anota num caderno.' : '',
    d=>Titulares.jeito('lorelei', d) === 'talvez' ? 'Cabelo vermelho preso, óculos. Ela não levanta a cabeça.' : '',
    d=>Titulares.jeito('lorelei', d) === 'talvez' ? fala('Lorelei', 'Trinta e um centímetros. Semana passada, trinta e um. Ele parou de engrossar e não começou a afinar.', null, 'Ela fala com o caderno, não com você.') : '',
    d=>Titulares.jeito('lorelei', d) === 'talvez' ? fala('Lorelei', 'Lorelei. Você é {o terceiro|a terceira} desafiante este ano que desce até aqui em vez de subir. Os outros dois queriam autógrafo.') : ''
  ],
  escolhas:[
    {texto:'"Por que a senhora parou de subir pro Planalto?"', continua:true,
     cond:d=>Titulares.jeito('lorelei', d) !== 'fecha',
     resultado:[
       fala('Lorelei', 'Porque a placa na minha porta diz que eu entendo de gelo, e o mar da minha janela passou dezenove semanas parado sem eu entender por quê.'),
       fala('Lorelei', 'E porque ninguém subia. Um mês inteiro sem desafiante, e a Liga mandou uma carta. Uma. Com o meu nome escrito errado.'),
       'Ela fala "errado" do jeito que outra pessoa falaria "morto".'
     ]},

    /* volta */
    {texto:'"Volta. A sala é sua."',
     cond:d=>Titulares.jeito('lorelei', d) === 'volta',
     ef:{executar:()=>Titulares.decidir('lorelei', true),
         npc:{nome:'Lorelei', opiniao:3, memoria:'Devolveu o pequeno ao gelo que ela mediu dezenove semanas. Ela voltou pra sala pra ganhar de você.'}},
     resultado:[
       fala('Lorelei', 'Eu vou voltar. Não porque você pediu.', null, 'Ela tira os óculos e limpa na manga do terno.'),
       fala('Lorelei', 'Uma especialista que errou tem duas saídas: sumir, ou voltar pra perder de quem acertou. Eu já sumi. Não serviu de nada.'),
       fala('Lorelei', 'Quando você subir, eu vou estar na sala. E não fica contente: eu vou voltar pra ganhar de você.'),
       'O Lapras abre um olho na rampa, como quem ouviu o próprio nome, e fecha de novo.'
     ]},
    {texto:'Não pedir nada. Só agradecer pela conversa.',
     cond:d=>Titulares.jeito('lorelei', d) === 'volta',
     ef:{executar:()=>Titulares.decidir('lorelei', true),
         npc:{nome:'Lorelei', opiniao:3, memoria:'Foi até a porta dela sem pedir nada. Ela pediu por você.'}},
     resultado:[
       fala('Lorelei', 'Você veio até aqui pra não pedir nada?', null, 'Ela olha você de cima a baixo, como quem confere uma medida.'),
       fala('Lorelei', 'Então eu peço. A primeira porta da ala: quando você subir, eu vou estar atrás dela.'),
       fala('Lorelei', 'Eu quero ver se quem sabe perguntar também sabe perder.')
     ]},

    /* fecha */
    {texto:'Ir embora.',
     cond:d=>Titulares.jeito('lorelei', d) === 'fecha',
     ef:{executar:()=>Titulares.decidir('lorelei', false)},
     resultado:[
       'A janela fecha. O Lapras, na rampa, não abre os olhos.',
       'Você volta pelo cais velho. Atrás de você fica uma porta azul que não abriu e não vai abrir.'
     ]},

    /* talvez: contar o que o gelo esperava */
    {texto:'"Ele não está segurando o mar. Ele está esperando alguém."',
     cond:d=>Titulares.jeito('lorelei', d) === 'talvez' && !d.flags.devolveu_o_filhote
       && !!(d.flags.achou_o_filhote || d.flags.viu_o_segundo_articuno || d.flags.sabe_do_segundo || d.flags.viu_a_cama || d.flags.viu_o_vazio),
     ef:{executar:d=>{
           Estado.marcar('lorelei_devolveu');
           /* quem segura o mar para de esperar: o pequeno volta pela mão dela */
           const L = Estado.lend(144);
           if (L && L.disposicao !== 'hostil') L.disposicao = 'passivo';
           return Titulares.decidir('lorelei', true).concat([
             {tipo:'mundo', texto:'Uma semana depois, o gelo da costa de Fuchsia começa a recuar, de trás pra frente.'}]);
         },
         rep:{eixo:'bom', delta:3, motivo:'Contou pra quem media o gelo o que o gelo estava esperando'},
         npc:{nome:'Lorelei', opiniao:4, memoria:'Contou o que o gelo esperava. Ela foi buscar o pequeno e voltou pra sala.'},
         registrar:'Contou à Lorelei o que o gelo das Seafoam esperava. Ela foi buscar o pequeno.'},
     resultado:[
       'A régua para no meio do caminho.',
       fala('Lorelei', 'Esperando quem?'),
       d=>d.flags.achou_o_filhote || d.flags.viu_o_segundo_articuno
         ? fala(d.jogador.nome, 'Um filhote, com a asa quebrada. Ele estava numa câmara fria da fábrica de gelo, aqui em Fuchsia.')
         : fala(d.jogador.nome, 'Um filhote. Eu vi a cama dele na parede da caverna, vazia.'),
       d=>d.flags.prometeu_a_articuno ? fala(d.jogador.nome, 'Eu prometi trazer. E não trouxe.') : '',
       'Ela fica olhando o gelo um tempo comprido, com a régua parada na mão.',
       fala('Lorelei', 'Dezenove semanas medindo espessura.', 'baixo'),
       fala('Lorelei', 'Nenhuma vez eu perguntei o que ele queria. Eu achei que gelo não quer nada.'),
       'Ela fecha o caderno, levanta, e pela primeira vez olha pra você.',
       d=>d.flags.prometeu_a_articuno
         ? fala('Lorelei', 'Você prometeu pra um lendário e foi embora. Alguém vai ter que cumprir, e vai ser quem entende de frio.', 'frio')
         : fala('Lorelei', 'Eu acho esse filhote. E depois eu subo.'),
       fala('Lorelei', 'Depois eu volto pra primeira porta da ala. Quando você subir, eu vou ter um mar descongelado pra contar.')
     ]},
    /* talvez: ajoelhar no gelo e medir junto */
    {texto:'Ajoelhar no gelo e ajudar a medir.',
     cond:d=>Titulares.jeito('lorelei', d) === 'talvez',
     teste:{status:'percepcao', dificuldade:7, nomeStatus:'Percepção', eixo:'paciencia'},
     bom:{ef:{executar:()=>Titulares.decidir('lorelei', true),
              npc:{nome:'Lorelei', opiniao:3, memoria:'Ajoelhou no gelo do cais e viu o que ela não via. Ela voltou pra sala.'}},
          resultado:[
            'Ela te passa a régua sem comentário. Você mede onde ela aponta, e ela anota o que você diz.',
            'Na quinta medida você nota uma coisa que não é número: logo abaixo da superfície tem penas presas, azuis, todas viradas pro mesmo lado, pras Seafoam.',
            'Lorelei olha as penas por um tempo. Depois olha você.',
            fala('Lorelei', 'Eu medi esse gelo dezenove semanas e nunca olhei acima da régua.', 'baixo'),
            fala('Lorelei', 'Eu volto pra sala. Quem olha onde eu não olhei merece perder pra mim de perto.')
          ]},
     ruim:{ef:{executar:()=>Titulares.decidir('lorelei', false)},
          resultado:[
            'Você mede três vezes o mesmo lugar e dá três números diferentes.',
            fala('Lorelei', 'Obrigada.', null, 'Ela pega a régua de volta com educação, que é pior que grosseria.'),
            fala('Lorelei', 'Volta pra estrada. Eu tenho trinta e um centímetros pra entender.'),
            'Ela não te olha de novo, e você entende que essa porta fechou.'
          ]}},
    /* talvez: falar em nome da Liga */
    {texto:'"A Liga precisa da senhora."',
     cond:d=>Titulares.jeito('lorelei', d) === 'talvez',
     ef:{executar:()=>Titulares.decidir('lorelei', false)},
     resultado:[
       fala('Lorelei', 'A Liga precisa de quarenta pessoas e tem quatro. Eu não sou a falta mais grave dela.'),
       fala('Lorelei', 'E quem precisa de alguém manda carta com o nome certo.', 'frio'),
       'Ela volta pro gelo. A conversa acabou, e você sabe que não tem outra.'
     ]},
    {texto:'Deixar ela medir em paz e ir embora.',
     cond:d=>Titulares.jeito('lorelei', d) === 'talvez',
     resultado:['Você volta pelo cais velho. Atrás de você, a régua bate no gelo de dez em dez passos, sem mudar de ritmo.']}
  ]
},

/* ── Bruno, no fundo da pedreira de Pewter ─────────────── */
{
  id:'tit_bruno', encadeado:true,
  titulo:'O turno da manhã',
  texto:[
    'A pedreira de Pewter começa a trabalhar às seis da manhã. Quando você chega, o setor dois já tem pó de pedra suspenso no ar, parado, dourado de sol.',
    'O guarda da guarita nem pergunta. Aponta com o queixo: lá embaixo, no fundo da bancada.',
    'No fundo da bancada, um homem do tamanho de uma porta empurra um carrinho de pedra, sem camisa, de calça branca de treino suja de pó até o joelho, com o cabelo preto comprido preso. Do lado dele, um Machamp empurra quatro carrinhos de uma vez e parece se divertir.',
    /* volta: ele ouviu falar de você na pedreira */
    d=>Titulares.jeito('bruno', d) === 'volta' ? 'Ele te vê descendo e larga o carrinho.' : '',
    d=>Titulares.jeito('bruno', d) !== 'volta' ? ''
      : d.flags.sugeriu_a_sirene
        ? fala('Bruno', 'Ei! Você é quem deu a ideia da sirene!', 'grita')
        : fala('Bruno', 'Ei! Você é quem não entregou o moleque da fenda!', 'grita'),
    d=>Titulares.jeito('bruno', d) === 'volta' && d.flags.sugeriu_a_sirene
      ? fala('Bruno', 'O guarda andou meses com o seu papel no bolso da camisa. Eu li. A gente toca a sirene antes de toda detonação agora, e os Zubat aprenderam em duas semanas: tocou, sumiram.', 'riso') : '',
    d=>Titulares.jeito('bruno', d) === 'volta' && (d.flags.protegeu_o_rapaz || d.flags.pagou_o_rapaz)
      ? fala('Bruno', `${d.flags.sugeriu_a_sirene ? 'E o moleque da fenda me contou o resto' : 'O moleque me contou'}. Ele conta pra todo mundo, na verdade. Trabalha comigo agora, no turno da tarde, e não arma mais gaiola nenhuma: eu conversei com ele do único jeito que eu sei, dando serviço dobrado.`) : '',
    d=>Titulares.jeito('bruno', d) === 'volta' ? fala('Bruno', 'Bruno. Da segunda porta, a que eu larguei.', null, 'Ele estende a mão, e a mão dele é do tamanho da sua cabeça.') : '',
    /* fecha: o moleque perdeu o emprego */
    d=>Titulares.jeito('bruno', d) === 'fecha' ? 'Ele te vê descendo e não larga o carrinho.' : '',
    d=>Titulares.jeito('bruno', d) === 'fecha' ? fala('Bruno', 'Eu sei quem você é.', null, 'Ele não para de trabalhar.') : '',
    d=>Titulares.jeito('bruno', d) === 'fecha' ? fala('Bruno', 'Tinha um moleque que trabalhava aqui. Dezenove anos, uniforme grande demais, a mãe tomando remédio pela metade. Justa causa.') : '',
    d=>Titulares.jeito('bruno', d) === 'fecha' ? fala('Bruno', 'Eu arrumei um bico pra ele no depósito de areia. Paga menos.') : '',
    d=>Titulares.jeito('bruno', d) === 'fecha' ? 'Ele vira o carrinho, e a pedra cai, e o barulho enche a bancada inteira.' : '',
    d=>Titulares.jeito('bruno', d) === 'fecha' ? fala('Bruno', 'Eu não subo montanha pra lutar com quem entrega trabalhador. Vai ganhar do A.J.; ele é melhor do que eu, de qualquer jeito.') : '',
    /* talvez: ele não sabe nada de você */
    d=>Titulares.jeito('bruno', d) === 'talvez' ? 'Ele te vê descendo e acena com o braço inteiro, como quem acena pra navio.' : '',
    d=>Titulares.jeito('bruno', d) === 'talvez' ? fala('Bruno', 'Visita? A gente não faz visita!', 'grita', 'É uma imitação perfeita do guarda da guarita, e ele ri da própria imitação.') : '',
    d=>Titulares.jeito('bruno', d) === 'talvez' ? fala('Bruno', 'Bruno. Você é desafiante, pela cara. Desafiante tem cara de quem dormiu mal.') : ''
  ],
  escolhas:[
    {texto:'"Por que o senhor largou a Elite?"', continua:true,
     cond:d=>Titulares.jeito('bruno', d) !== 'fecha',
     resultado:[
       fala('Bruno', 'Um mês sem ninguém subir.', null, 'Ele senta numa pedra.'),
       fala('Bruno', 'Eu ficava socando o ar num chão de terra, oito horas por dia. Aí abriu vaga no turno da manhã daqui, que é onde eu comecei, com doze anos, carregando pedra com um Machop do tamanho de um balde.'),
       fala('Bruno', 'Aqui a pedra pelo menos quebra quando eu bato.', 'riso'),
       fala('Bruno', 'E ninguém da Liga ligou. Nenhuma vez. Eu fiquei esperando ligarem pra eu poder dizer não, e nem isso.')
     ]},

    /* volta */
    {texto:'"Volta pra sua sala."',
     cond:d=>Titulares.jeito('bruno', d) === 'volta',
     ef:{executar:()=>Titulares.decidir('bruno', true),
         npc:{nome:'Bruno', opiniao:4, memoria:'Ouviu falar de você na pedreira antes de você descer. Voltou pra segunda porta.'}},
     resultado:[
       fala('Bruno', 'Volto.', null, 'Sem pensar, como quem já tinha decidido antes de você descer.'),
       fala('Bruno', 'Faz tempo que eu não apanho de ninguém e tô ficando mole. E o A.J. tá sentado na minha sala esse tempo todo; vou ter que tirar ele de lá no braço, e ele vai gostar.', 'riso'),
       fala('Bruno', 'Termino o turno, que eu prometi, e subo. Quando você chegar lá em cima, a sala vai estar com cheiro de comida.'),
       'O Machamp larga os quatro carrinhos ao mesmo tempo, como quem entendeu.'
     ]},
    {texto:'Pegar um carrinho e ajudar até o almoço.',
     cond:d=>Titulares.jeito('bruno', d) === 'volta',
     ef:{executar:()=>{ Relogio.ate(12); return Titulares.decidir('bruno', true); }, hp:-2, causa:'Uma manhã carregando pedra na pedreira de Pewter',
         npc:{nome:'Bruno', opiniao:5, memoria:'Carregou pedra com ele até o almoço. Ele voltou pra segunda porta.'}},
     resultado:[
       'Você carrega pedra até o meio-dia. As suas mãos aprendem uma coisa nova sobre o próprio peso.',
       'No almoço, ele divide com você o que trouxe de casa, que dá pra três pessoas, e ele come como se desse pra uma.',
       fala('Bruno', 'Eu subo.', null, 'Ele fala de boca cheia.'),
       fala('Bruno', 'Eu tava esperando alguém me dar um motivo que não fosse a Liga.', 'riso')
     ]},

    /* fecha */
    {texto:'"Eu errei com ele."',
     cond:d=>Titulares.jeito('bruno', d) === 'fecha',
     ef:{executar:()=>Titulares.decidir('bruno', false),
         npc:{nome:'Bruno', opiniao:-1, memoria:'Você entregou o moleque da fenda e foi dizer que errou. Ele não voltou pra Elite.'}},
     resultado:[
       'Ele para o carrinho. Pela primeira vez, olha pra você inteiro.',
       fala('Bruno', 'Errar todo mundo erra.'),
       fala('Bruno', 'Mas ele perdeu o emprego, e você ganhou uma linha num relatório. Não é a mesma conta.', 'baixo'),
       'Ele volta a empurrar. Você sobe a rampa da pedreira com o barulho de pedra caindo atrás, no mesmo ritmo, e sabe que não é bem-vind{o|a} de volta.'
     ]},
    {texto:'Ir embora.',
     cond:d=>Titulares.jeito('bruno', d) === 'fecha',
     ef:{executar:()=>Titulares.decidir('bruno', false)},
     resultado:['Você sobe a rampa da pedreira. Lá embaixo, o barulho de pedra caindo continua, no mesmo ritmo, como se você nunca tivesse descido.']},

    /* talvez: o corpo diz mais que a boca */
    {texto:'Pegar um carrinho e carregar pedra com ele até o almoço.',
     cond:d=>Titulares.jeito('bruno', d) === 'talvez',
     teste:{status:'forca', dificuldade:7, nomeStatus:'Força'},
     bom:{ef:{executar:()=>{ Relogio.ate(12); return Titulares.decidir('bruno', true); }, hp:-2, causa:'Uma manhã carregando pedra na pedreira de Pewter',
              npc:{nome:'Bruno', opiniao:4, memoria:'Carregou pedra com ele a manhã inteira e aguentou. Ele voltou pra segunda porta.'}},
          resultado:[
            'Você carrega pedra até o meio-dia. No terceiro carrinho as mãos ardem; no sétimo, param de arder, o que é pior.',
            'Ele não diz nada a manhã inteira. Só uma vez ajeita o seu pé no cabo do carrinho com a ponta da bota, e o peso muda de lugar.',
            'No almoço, ele divide com você o que trouxe de casa, que dá pra três pessoas, e ele come como se desse pra uma.',
            fala('Bruno', 'Você aguentou.', null, 'Ele fala de boca cheia.'),
            fala('Bruno', 'Quem aguenta merece apanhar de alguém que aguenta mais. Eu subo.', 'riso')
          ]},
     ruim:{ef:{executar:()=>{ Relogio.ate(12); return Titulares.decidir('bruno', true); }, hp:-4, causa:'Uma manhã carregando pedra na pedreira de Pewter',
              npc:{nome:'Bruno', opiniao:4, memoria:'Caiu no terceiro carrinho e voltou pro quarto. Ele voltou pra segunda porta.'}},
          resultado:[
            'No terceiro carrinho a sua perna esquerda decide sozinha que acabou, e você senta no pó.',
            'Ele não ri. Espera você levantar, e você levanta, e pega o quarto carrinho.',
            fala('Bruno', 'Caiu no terceiro e voltou pro quarto.', null, 'Ele fala de boca cheia, no almoço.'),
            fala('Bruno', 'Aguentar, todo mundo aguenta. Voltar pro carrinho é outra coisa. Eu subo.')
          ]}},
    {texto:'Explicar por que a Liga precisa dele de volta.',
     cond:d=>Titulares.jeito('bruno', d) === 'talvez',
     ef:{executar:()=>Titulares.decidir('bruno', false)},
     resultado:[
       'Você fala por uns dois minutos. Ele escuta inteiro, de braços cruzados, com uma educação que dá pra ver que custa.',
       fala('Bruno', 'Bonito.', null, 'Ele pega o carrinho de volta.'),
       fala('Bruno', 'Dezenove anos eu ouvi discurso lá em cima. Aqui embaixo ninguém discursa, e a pedra sai do mesmo jeito.'),
       'Ele volta pro fundo da bancada. Dá pra ver, pelo jeito das costas, que a conversa acabou, e que não tem outra.'
     ]},
    {texto:'Deixar ele trabalhar e ir embora.',
     cond:d=>Titulares.jeito('bruno', d) === 'talvez',
     resultado:['Você sobe a rampa da pedreira. Lá de baixo vem uma gargalhada, que não é de você, e o barulho de quatro carrinhos virando de uma vez.']}
  ]
},

/* ── Agatha, na casa de janela verde ───────────────────── */
{
  id:'tit_agatha', encadeado:true,
  titulo:'A janela verde',
  texto:[
    'A rua de trás da Torre tem quatro casas, e só uma tem janela pintada: verde, de um verde que ninguém mais em Lavender usaria.',
    'Na varanda, uma cadeira de vime e um cinzeiro cheio. No parapeito da janela, um Gengar dorme de barriga pra cima, com a língua de fora.',
    /* volta: ela sabe o que você fez no sexto andar */
    d=>Titulares.jeito('agatha', d) === 'volta' ? 'A janela abre antes de você chegar no portão.'
      : Titulares.jeito('agatha', d) === 'raiva' ? 'Tem alguém na janela antes de você chegar no portão, parado, como quem espera há dias.' : '',
    d=>Titulares.jeito('agatha', d) !== 'talvez' ? 'A senhora na janela é pequena, de xale verde por cima de um vestido roxo, com o cabelo claro todo enrolado e uma bengala apoiada no batente. Tem uns oitenta e poucos anos, e todos eles estão olhando pra você.' : '',
    d=>Titulares.jeito('agatha', d) === 'volta' ? fala('Agatha', 'Ah. {O menino|A menina} do sexto andar.') : '',
    d=>Titulares.jeito('agatha', d) !== 'volta' ? ''
      : d.flags.acalmou_marowak
        ? fala('Agatha', 'Quatro dias aquele Marowak batendo osso, e a cidade inteira acendendo vela. Você subiu, sentou no chão e esperou ele baixar o osso.')
        : fala('Agatha', 'Quatro dias aquele Marowak batendo osso, e a cidade inteira acendendo vela. Você subiu e olhou antes de fazer besteira.'),
    d=>Titulares.jeito('agatha', d) === 'volta' ? fala('Agatha', 'Eu sabia que não era fantasma. Fantasma não bate três vezes e pausa; fantasma não tem pressa. Eu disse isso pro zelador na segunda-feira.', null, 'Ela bate a cinza no parapeito, do lado do Gengar.') : '',
    d=>Titulares.jeito('agatha', d) === 'volta' ? fala('Agatha', 'Ele acendeu mais uma vela.', 'frio') : '',
    d=>Titulares.jeito('agatha', d) === 'volta' ? fala('Agatha', 'Agatha. Mas isso você sabia, senão não vinha bater na janela de uma velha.') : '',
    /* raiva: ela também sabe, e não perdoa */
    d=>Titulares.jeito('agatha', d) !== 'raiva' ? ''
      : d.flags.usou_escudo
        ? fala('Agatha', 'O zelador da Torre contou as suas Pokébolas quando você desceu.', 'frio')
        : fala('Agatha', 'Quatro dias aquele Marowak bateu osso pedindo socorro, e a cidade inteira acendeu vela.', 'frio'),
    d=>Titulares.jeito('agatha', d) !== 'raiva' ? ''
      : d.flags.usou_escudo ? fala('Agatha', 'Faltava uma.') : fala('Agatha', 'Você foi a única pessoa que subiu. E bateu nele.'),
    d=>Titulares.jeito('agatha', d) === 'raiva' ? fala('Agatha', 'Lavender inteira sabe. Aqui ninguém liga rádio, então a gente conversa.') : '',
    d=>Titulares.jeito('agatha', d) === 'raiva' ? fala('Agatha', 'Agatha. Da terceira porta da ala, aquela que tem uma cadeira do lado de fora.') : '',
    /* talvez: ela joga cartas sozinha */
    d=>Titulares.jeito('agatha', d) === 'talvez' ? 'Ninguém aparece na janela, mas a porta está aberta. Lá dentro, numa mesa de cozinha, uma senhora joga cartas sozinha contra três cadeiras vazias.' : '',
    d=>Titulares.jeito('agatha', d) === 'talvez' ? 'É pequena, de xale verde por cima de um vestido roxo, com o cabelo claro todo enrolado e uma bengala encostada na mesa. Uns oitenta e poucos anos.' : '',
    d=>Titulares.jeito('agatha', d) === 'talvez' ? fala('Agatha', 'Entra, que eu não grito.', null, 'Ela não levanta os olhos das cartas.') : '',
    d=>Titulares.jeito('agatha', d) === 'talvez' ? fala('Agatha', 'Agatha. Você é desafiante, pela cara. Desafiante tem cara de quem perdeu alguma coisa e ainda não sabe o quê.') : ''
  ],
  escolhas:[
    {texto:'"Por que a senhora parou de subir?"', continua:true,
     cond:d=>Titulares.jeito('agatha', d) !== 'raiva',
     resultado:[
       fala('Agatha', 'Porque eu tenho oitenta e quatro anos, e ninguém subia.'),
       fala('Agatha', 'Um mês inteiro sentada naquela cadeira do corredor, fumando e esperando desafiante. Na quarta semana eu fiz a conta de quanto tempo eu ainda tenho, e não dava pra gastar com corredor vazio.'),
       fala('Agatha', 'E a Liga não ligou. Mandaram um panfleto. Um panfleto, pra mim, sobre "valorização do quadro técnico".', 'riso')
     ]},

    /* volta */
    {texto:'"Sobe com a gente. A ala está pela metade."',
     cond:d=>Titulares.jeito('agatha', d) === 'volta',
     ef:{executar:()=>Titulares.decidir('agatha', true),
         npc:{nome:'Agatha', opiniao:4, memoria:'Subiu o sexto andar e ouviu antes de bater. Ela voltou pra terceira porta pra ver você de perto.'}},
     resultado:[
       fala('Agatha', 'Com a gente? Você nem chegou lá e já fala "a gente".', 'riso'),
       fala('Agatha', 'Eu subo. Não pela ala, que a ala se vira. Pra ver você numa sala minha, onde nenhum dos meus pede socorro.'),
       fala('Agatha', 'E alguém diz pro Mandi desligar aquela música antes de eu chegar.'),
       'O Gengar, no parapeito, ri dormindo.'
     ]},
    {texto:'Agradecer pela conversa e ir embora.',
     cond:d=>Titulares.jeito('agatha', d) === 'volta',
     ef:{executar:()=>Titulares.decidir('agatha', true),
         npc:{nome:'Agatha', opiniao:3, memoria:'Foi agradecer na janela dela. Ela voltou pra terceira porta.'}},
     resultado:[
       fala('Agatha', 'Agradecer? Pelo quê? Eu só fiquei te olhando.'),
       fala('Agatha', 'Vai. Eu subo. Gente que ouve antes de bater é rara, e eu quero ver de perto antes de morrer.')
     ]},

    /* raiva: ela volta, e volta por sua causa */
    {texto:'"Eu não sabia o que ele estava fazendo."',
     cond:d=>Titulares.jeito('agatha', d) === 'raiva' && !d.flags.usou_escudo,
     ef:{executar:()=>Titulares.decidir('agatha', true, {raiva:true}),
         npc:{nome:'Agatha', opiniao:-3, memoria:'Bateu no Marowak que pedia socorro. Ela voltou pra Elite pra ganhar de você.'}},
     resultado:[
       fala('Agatha', 'Ninguém sabe. É pra isso que se olha antes.'),
       fala('Agatha', 'Eu volto pra minha sala. Não por você: pra você.', 'frio'),
       fala('Agatha', 'Os meus nunca pediram socorro pra quem não ouve. Vou te mostrar como é chamar e ninguém vir.')
     ]},
    {texto:'"Eu salvei uma pessoa."',
     cond:d=>Titulares.jeito('agatha', d) === 'raiva' && !!d.flags.usou_escudo,
     ef:{executar:()=>Titulares.decidir('agatha', true, {raiva:true}),
         npc:{nome:'Agatha', opiniao:-4, memoria:'Pôs um dos seus de escudo na Torre. Ela voltou pra Elite pra ganhar de você.'}},
     resultado:[
       fala('Agatha', 'Salvou. Com o corpo de outro.', 'frio'),
       fala('Agatha', 'Eu subo aquela montanha por sua causa. Os meus nunca foram escudo de ninguém, e você vai ver o que isso dá.')
     ]},
    {texto:'Ficar quiet{o|a} e ouvir.',
     cond:d=>Titulares.jeito('agatha', d) === 'raiva',
     ef:{executar:()=>Titulares.decidir('agatha', true, {raiva:true}),
         npc:{nome:'Agatha', opiniao:-2, memoria:'Ouviu calad{o|a} o que ela tinha pra dizer da Torre. Ela voltou pra Elite pra ganhar de você.'}},
     resultado:[
       'Você não diz nada. Ela também não, por um tempo.',
       fala('Agatha', 'Pelo menos isso você aprendeu.', 'baixo'),
       fala('Agatha', 'Quando você subir, eu vou estar na minha sala. Vem perder pra mim, que é a única aula que eu ainda dou.')
     ]},

    /* talvez: ela aposta, ela gosta de cara de pau, ela odeia pena */
    {texto:'Jogar uma mão de cartas com ela. Ganhando, ela sobe; perdendo, você some.',
     cond:d=>Titulares.jeito('agatha', d) === 'talvez',
     teste:{status:'sorte', dificuldade:7, nomeStatus:'Sorte'},
     bom:{ef:{executar:()=>Titulares.decidir('agatha', true),
              npc:{nome:'Agatha', opiniao:3, memoria:'Ganhou dela nas cartas, valendo a volta. Ela pagou a aposta e voltou pra terceira porta.'}},
          resultado:[
            'Ela perde a primeira mão e olha as suas cartas como quem desconfia do baralho.',
            'Perde a segunda e ri, um riso curto, de quem não ri faz tempo.',
            fala('Agatha', 'Sorte de principiante. Que é a única sorte que existe.', 'riso'),
            fala('Agatha', 'Eu subo. Aposta é aposta, e eu nunca dei calote em ninguém, nem em morto.')
          ]},
     ruim:{ef:{executar:()=>Titulares.decidir('agatha', false)},
          resultado:[
            'Ela ganha as duas mãos sem esforço, e a segunda ela ganha olhando pela janela.',
            fala('Agatha', 'Some.', null, 'Sem raiva nenhuma. Aposta é aposta.'),
            'Ela volta a jogar contra as três cadeiras vazias. Essa porta não abre de novo.'
          ]}},
    {texto:'"A senhora tem medo de perder pra mim?"',
     cond:d=>Titulares.jeito('agatha', d) === 'talvez',
     ef:{executar:()=>Titulares.decidir('agatha', true),
         npc:{nome:'Agatha', opiniao:2, memoria:'Perguntou na cara dela se ela tinha medo de perder. Ela gostou e voltou pra terceira porta.'}},
     resultado:[
       'Ela larga as cartas. Pela primeira vez, levanta os olhos.',
       fala('Agatha', 'Medo?', null, 'Ela ri, e o riso vira tosse, e a tosse vira riso de novo.'),
       fala('Agatha', '{Menino|Menina}, na minha idade a gente tem medo de uma coisa só, e não é de criança de cinto cheio.'),
       fala('Agatha', 'Mas eu gostei da cara de pau. Eu subo, pra tirar ela de você.')
     ]},
    {texto:'"A senhora está bem? Precisa de alguma coisa?"',
     cond:d=>Titulares.jeito('agatha', d) === 'talvez',
     ef:{executar:()=>Titulares.decidir('agatha', false)},
     resultado:[
       'Ela demora pra responder, e quando responde é olhando as cartas.',
       fala('Agatha', 'Eu tenho oitenta e quatro anos, um Gengar e um baralho. Eu não preciso de nada que você tenha.', 'frio'),
       fala('Agatha', 'Fecha a porta quando sair.'),
       'Você fecha. E entende, pelo barulho das cartas lá dentro, que ela não abre de novo.'
     ]},
    {texto:'Deixar ela jogar em paz e ir embora.',
     cond:d=>Titulares.jeito('agatha', d) === 'talvez',
     resultado:['Você sai devagar. Atrás de você, as cartas continuam batendo na mesa, uma por uma, contra as três cadeiras vazias.']}
  ]
}
];

/* as visitas moram no banco geral, como a figura de capuz: encadeadas,
   não entram no sorteio de nenhum lugar */
if (typeof EVENTOS_GERAIS !== 'undefined') VISITAS_DOS_TITULARES.forEach(ev => EVENTOS_GERAIS.push(ev));
