/* ============================================================
   O RIVAL
   Ezra, da pedra na Rota 1. Ele não é um obstáculo fixo:
   o time, o tom e o arco dele mudam conforme o que você faz —
   e, se você for longe demais, ele deixa de ser rival.
   ============================================================ */

const ARCOS_RIVAL = {
  parceiro:{
    nome:'Parceiro',
    resumo:'Ele torce por você em voz alta e sem vergonha nenhuma.',
    nivelExtra:0, moral:90
  },
  rival:{
    nome:'Rival',
    resumo:'Rivalidade saudável: ele quer te vencer e quer que você esteja bem.',
    nivelExtra:1, moral:70
  },
  ressentido:{
    nome:'Ressentido',
    resumo:'Ele treina demais, dorme pouco e não sorri mais quando te vê.',
    nivelExtra:3, moral:40
  },
  perseguidor:{
    nome:'Perseguidor',
    resumo:'Ele não quer mais te vencer. Ele quer te parar.',
    nivelExtra:5, moral:80
  },
  quebrado:{
    nome:'Quebrado',
    resumo:'Ele parou. Não de treinar — de tentar.',
    nivelExtra:-3, moral:25
  }
};

/* Inicializa o rival quando o jogador cria o personagem */
function iniciarRival(){
  const d = Estado.dados;
  // o Ezra não tem inicial de laboratório: tem o Pico, sorteado
  d.rival = {
    nome:'Ezra',
    picoDex: sortearPicoDoEzra(d),
    vitorias:0,      // vitórias DELE sobre você
    derrotas:0,      // derrotas dele
    encontros:0,
    ultimoCap:0,
    arco:'rival'
  };
  return d.rival;
}

/* O Pico, parceiro do Ezra, é sorteado como o inicial aleatório da
   casa: a mesma tabela (1d6 de coluna, 1d6 de linha), da mesma cidade.
   Ele achou o bicho embaixo da caixa d'água da rua e criou em casa, então
   fica de fora quem não sai da água, quem não cabe numa camiseta, quem
   só nasce fêmea (o texto chama o Pico de "ele") e a mesma espécie do seu. */
const PICO_NAO_SERVE = [129, 118, 116, 72, 90, 147, 111, 77];
function sortearPicoDoEzra(d){
  const seu = d.jogador && (d.jogador.inicialDex || (typeof dexReservado === 'function' ? dexReservado(d) : 0));
  for (let i = 0; i < 20; i++){
    const dex = sortearInicialDaCasa((d.jogador && d.jogador.cidade) || 'Pallet', '').dex;
    if (dex === seu || PICO_NAO_SERVE.includes(dex) || chanceDeMacho(dex) === 0) continue;
    return dex;
  }
  return 16;
}
function picoDex(){
  const r = rival();
  if (!r.picoDex) r.picoDex = sortearPicoDoEzra(Estado.dados);
  return r.picoDex;
}
/* o sexo do Pico: "ele", a não ser que a espécie não tenha sexo */
function picoGenero(){ return chanceDeMacho(picoDex()) === null ? null : 'm'; }
/* o nome da espécie como ele está agora, pra marca {pico} do texto */
function especieDoPico(){
  const base = picoDex();
  let nv = 6;
  try { nv = nivelRival(); } catch(e){}
  return DEX[formaAteONivel(finalDaLinha(base), nv)].nome;
}

function rival(){
  const d = Estado.dados;
  if (!d.rival) iniciarRival();
  return d.rival;
}

/* ============================================================
   ARCO — recalculado a cada encontro, a partir do que você fez
   ============================================================ */
function arcoRival(){
  const d = Estado.dados;
  const r = rival();
  const npc = d.npcs['Ezra'];
  const op = npc ? npc.opiniao : 0;

  // 1) você virou uma coisa que ele precisa parar
  const monstro = (d.reputacao.eixo === 'ruim' && d.reputacao.ruim >= 5)
    || d.flags.tem_sangue_nas_maos
    || d.flags.trabalha_para_comissao
    || d.flags.conselheiro_da_comissao
    || d.flags.assumiu_a_rede
    || d.cemiterio.length >= 2;
  if (monstro && op > -8) return 'perseguidor';

  // 2) ele desistiu: perdeu muito e foi tratado mal
  if (r.derrotas >= 4 && op <= 0) return 'quebrado';

  // 3) o resto é a opinião dele sobre você
  if (op >= 5) return 'parceiro';
  if (op <= -2) return 'ressentido';
  return 'rival';
}

/* ============================================================
   TIME — escala com você e se molda ao arco
   ============================================================ */
function nivelRival(){
  const t = Estado.dados.time.filter(p => !p.morto);
  const base = t.length ? Math.round(t.reduce((s,p)=>s+p.nivel,0)/t.length) : 8;
  return Math.max(6, base + (ARCOS_RIVAL[arcoRival()].nivelExtra || 0));
}

/* o Pico, na forma que o nível deixa */
function inicialDoRival(nivel){
  return formaAteONivel(finalDaLinha(picoDex()), nivel);
}

/* Contra o Perseguidor: ele treinou olhando o SEU time */
function contraSeuTime(){
  const meus = Estado.dados.time.filter(p => !p.morto);
  const tipos = {};
  meus.forEach(p => p.tipos.forEach(t => tipos[t] = (tipos[t]||0)+1));
  const ordenados = Object.keys(tipos).sort((a,b)=>tipos[b]-tipos[a]);
  const escolhidos = [];
  for (const t of ordenados){
    // acha uma espécie cujo tipo bate forte contra t
    const candidatos = poolSelvagem().filter(d => {
      const p = DEX[d];
      if (p.evo || p.total < 400) return false;
      return p.tipos.some(tp => (TABELA_TIPOS[tp]||{})[t] === 2);
    });
    if (candidatos.length){
      const dex = candidatos[(t.length * 7 + escolhidos.length * 13) % candidatos.length];
      if (!escolhidos.includes(dex)) escolhidos.push(dex);
    }
    if (escolhidos.length >= 4) break;
  }
  return escolhidos;
}

const POOL_ARCO = {
  parceiro:   [17, 20, 58, 123, 128, 131],   // Pidgeotto, Raticate, Growlithe, Scyther, Tauros, Lapras
  rival:      [17, 20, 64, 57, 128, 130],    // Pidgeotto, Raticate, Kadabra, Primeape, Tauros, Gyarados
  ressentido: [93, 110, 97, 42, 89, 94],     // Haunter, Weezing, Hypno, Golbat, Muk, Gengar
  perseguidor:[65, 68, 130, 143, 112, 149],  // Alakazam, Machamp, Gyarados, Snorlax, Rhydon, Dragonite
  quebrado:   [16, 19, 21, 41]               // Pidgey, Rattata, Spearow, Zubat — nada evoluiu
};

function timeRival(){
  const d = Estado.dados;
  const arco = arcoRival();
  const nivel = nivelRival();
  const qtd = Math.max(2, Math.min(6, 2 + Math.round(numInsignias() * 0.6)));

  /* nada da linha do Pico no resto do time: ele é um só */
  const linhaPico = finalDaLinha(picoDex());
  let pool = POOL_ARCO[arco].filter(x => finalDaLinha(x) !== linhaPico);
  if (arco === 'perseguidor'){
    const contras = contraSeuTime();
    pool = contras.concat(pool.filter(x => !contras.includes(x)));
  }

  const time = [];
  for (let i = 0; i < qtd - 1 && i < pool.length; i++){
    const nv = Math.max(5, nivel - 2 + i);
    time.push(criarPokemon(formaAteONivel(pool[i], nv), nv, {moral: ARCOS_RIVAL[arco].moral}));
  }
  // o Pico entra por último e é sempre o ás
  const ini = criarPokemon(inicialDoRival(nivel + 2), nivel + 2, {moral: ARCOS_RIVAL[arco].moral, genero: picoGenero()});
  if (d.flags.sabe_do_pico) ini.apelido = 'Pico';
  if (arco === 'quebrado') ini.nivel = Math.max(5, nivel);
  time.push(ini);
  return time;
}

/* ============================================================
   ENCONTROS — ele aparece entre capítulos
   ============================================================ */
const CAPS_RIVAL = [5, 9, 13, 17, 21];

/* Devolve QUEM aparece neste capítulo, ou null.
   Ezra tem preferência: ele é o de casa. */
function rivalDeveAparecer(cap){
  const d = Estado.dados;
  if (d.npcs['Ezra'] && rival().ultimoCap !== cap && CAPS_RIVAL.includes(cap))
    return {tipo:'teo', nome:'Ezra'};
  for (const R of RIVAIS_EXTRA){
    if (!R.caps.includes(cap)) continue;
    const reg = registroRival(R.id);
    if (!reg || reg.ultimoCap === cap) continue;
    return {tipo:'extra', id:R.id, nome:R.nome};
  }
  return null;
}

/* ============================================================
   FALAS — mudam com o arco, o placar e o que você fez
   ============================================================ */
function falaRival(){
  const d = Estado.dados;
  const r = rival();
  const arco = arcoRival();
  const placar = r.derrotas > r.vitorias ? 'perdendo' : (r.vitorias > r.derrotas ? 'ganhando' : 'empatado');
  const L = [];

  if (arco === 'parceiro'){
    L.push('"EI!" Ezra atravessa a rua correndo e quase é atropelado por uma bicicleta. "Cara, eu vi o teu nome numa parada e eu gritei no meio do Centro Pokémon."');
    if (d.insignias.length) L.push(`"${d.insignias.filter(i=>i!=='Título de Campeão').length} insígnias. ${d.insignias.length>4?'CARA.':'Já?'}"`);
    if (d.cemiterio.length) L.push(`Ele fica sério de repente. "Eu soube ${pron(d.cemiterio[0]).do} ${nomeExib(d.cemiterio[0])}." Ele não sabe o que fazer com as mãos. "Desculpa. Eu não sei falar essas coisas."`);
    L.push(placar === 'perdendo'
      ? '"Eu perdi as últimas. Eu sei. Mas eu vim de novo, e eu vou vir de novo depois dessa."'
      : '"Bora? Bora. Eu tô pronto dessa vez, eu treinei de verdade."');
  }

  else if (arco === 'rival'){
    L.push('"Achei que ia te encontrar aqui." Ezra já está com a mão no cinto. "Não é coincidência, eu perguntei pra umas pessoas."');
    if (d.insignias.length >= 4) L.push('"Você tá na minha frente. Tá tranquilo. Eu prefiro assim, dá menos vergonha de perder."');
    L.push(placar === 'ganhando' ? '"Eu tô ganhando a série. Você percebeu isso ou tá fingindo que não?"' : '"Bora resolver isso."');
  }

  else if (arco === 'ressentido'){
    L.push('Ezra está encostado num poste e não se mexe quando você passa. Ele espera você notar.');
    L.push('"Oi." Ele não sorri. "Eu tenho treinado."');
    if (r.derrotas >= 2) L.push(`"${r.derrotas} a ${r.vitorias}. Eu sei de cor, não precisa falar."`);
    L.push('"Não precisa ser simpático. Eu não vim pra isso."');
  }

  else if (arco === 'perseguidor'){
    L.push('Ezra está esperando no meio do caminho, e dá pra ver que ele está ali há horas.');
    L.push('"Eu não vim te desafiar."');
    if (d.cemiterio.length >= 2) L.push(`"Eu contei. Você perdeu ${d.cemiterio.length}. Isso não é acidente duas vezes."`);
    if (d.flags.trabalha_para_comissao || d.flags.conselheiro_da_comissao) L.push('"Eu li as atas. Tem o teu nome numa delas, numa lista de presença, do lado de gente que assina descarte."');
    if (d.flags.assumiu_a_rede) L.push('"Eu fui em Celadon. Eu vi o portão azul. Eu perguntei de quem era agora e eles falaram o teu nome."');
    if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=6) L.push(`"Tem gente com medo de você. Gente de verdade, não Pokémon."`);
    L.push('"A gente se conheceu numa pedra na Rota 1. Eu tava lá desde as seis da manhã e você foi a primeira pessoa que passou."');
    L.push('"Eu vou te parar. Eu não sei se eu consigo. Mas alguém tem que estar aqui, e quem te conhece sou eu."');
  }

  else { // quebrado
    L.push('Ezra está sentado no chão do Centro Pokémon, de costas para a porta, e demora pra virar.');
    L.push('"Ah. Oi."');
    L.push(`"Eu perdi pra você ${r.derrotas} vezes." Ele diz o número sem drama. "Eu parei de contar como derrota faz um tempo. Agora eu conto como… sei lá. Estatística."`);
    L.push('"Eu vou lutar se você quiser. Eu só não vou fingir que eu acho que dá."');
  }

  return L;
}

function falaVitoriaRival(){   // você venceu
  const arco = arcoRival();
  const r = rival();
  const d = Estado.dados;
  if (arco === 'parceiro') return [
    'Ezra recolhe o time e vem te abraçar antes de recolher, o que é a ordem errada e é muito a cara dele.',
    `Ele conta nos dedos, em voz alta: "${r.derrotas + 1} pra você. Eu vou chegar em você um dia. Não hoje. Mas eu vou."`,
    'Ele te dá metade do dinheiro que tem no bolso e não aceita não.'
  ];
  if (arco === 'ressentido') return [
    'Ele recolhe o time em silêncio e leva mais tempo do que precisa.',
    '"É." Só isso, por uns dez segundos. "É."',
    '"Sabe o que é o pior? Eu treinei. Eu treinei de verdade dessa vez."',
    'Ele vai embora antes de você responder.'
  ];
  if (arco === 'perseguidor') return [
    'Ezra cai de joelhos no chão junto com o último do time dele, e não é figura de linguagem.',
    '"Eu sabia." Ele está chorando e não está tentando esconder. "Eu sabia que não ia dar."',
    '"Eu vim mesmo assim porque não tinha mais ninguém."',
    d.flags.tem_sangue_nas_maos
      ? '"Você lembra da pedra? Na Rota 1?" Ele te olha. "Eu lembro. Eu lembro de quem entrou naquela floresta."'
      : '"Para. Por favor. É só isso que eu vim pedir."'
  ];
  if (arco === 'quebrado') return [
    'Acaba rápido. Rápido demais.',
    'Ele recolhe as Pokébolas do chão e senta de novo.',
    '"Valeu por lutar." Ele diz isso sério. "Muita gente já não luta comigo."'
  ];
  return [
    'Ezra aperta a sua mão antes de recolher o time, do jeito que ele faz desde a Rota 1.',
    `"${r.derrotas + 1} a ${r.vitorias}." Ele já está calculando outra coisa. "Da próxima eu troco a ordem do time."`
  ];
}

function falaDerrotaRival(){   // ele venceu
  const arco = arcoRival();
  const r = rival();
  if (arco === 'parceiro') return [
    'Ezra ganha e fica genuinamente sem saber como comemorar na sua frente.',
    '"Foi sorte." Ele diz isso e nenhum dos dois acredita. "Foi sorte, cara."',
    'Ele te acompanha até o Centro Pokémon e paga a sua sopa.'
  ];
  if (arco === 'ressentido') return [
    'Ele ganha e não comemora. Fica olhando o chão por um tempo longo.',
    '"Pronto." A voz dele treme um pouco. "Pronto, agora eu ganhei uma."',
    'Ele esperou muito tempo por isso e agora não sabe o que fazer com isso.'
  ];
  if (arco === 'perseguidor') return [
    'Ele ganha, e é a primeira vez em toda a jornada que você perde uma batalha e sente que mereceu.',
    'Ezra não recolhe o time. Fica de pé entre você e o caminho.',
    '"Volta." A voz dele é firme de um jeito que você nunca ouviu. "Volta pra tua cidade. Hoje."',
    'E depois, mais baixo: "Eu não sei o que eu faço se você não voltar."'
  ];
  if (arco === 'quebrado') return [
    'Ezra ganha.',
    'Ele olha as Pokébolas na mão dele como se não entendesse o que acabou de acontecer.',
    '"Espera." Ele ri, e o riso quebra no meio. "Espera, eu —"',
    'Ele não termina a frase. Ele não precisa.'
  ];
  return [
    'Ezra ganha e grita alto demais para o tamanho do lugar.',
    `"${r.vitorias + 1} a ${r.derrotas}!" Ele aponta pra você. "ANOTA ISSO."`
  ];
}

/* Registra o resultado e move a opinião dele */
function registrarResultadoRival(venceuJogador){
  const r = rival();
  r.encontros++;
  r.ultimoCap = Estado.dados.capitulo;
  if (venceuJogador) r.derrotas++; else r.vitorias++;
  r.arco = arcoRival();
  Estado.registrar(`Encontro com Ezra (${ARCOS_RIVAL[r.arco].nome}): ${venceuJogador ? 'você venceu' : 'ele venceu'}. Placar ${r.derrotas}×${r.vitorias}.`);
  return r;
}

/* ============================================================
   OS OUTROS RIVAIS
   Ezra é o rival de fábrica: ele estava na pedra da Rota 1 e
   entrou na sua história porque você passou por lá.
   Os outros você conquista. Cada um nasce de uma escolha que
   você fez sem saber que estava escolhendo um rival — e o tom
   de cada um é o tom da escolha que o criou.
   ============================================================ */
const RIVAIS_EXTRA = [
{
  id:'nilo', nome:'Lior', npc:'Lior', desde:'Pewter', caps:[8, 14, 20],
  origem:'O rapaz do portão da pedreira de Pewter. Você ouviu a história dele inteira e ele largou a pedreira.',
  gatilho:d => !!d.flags.historia_do_nilo,
  nascimento:'Lior pediu demissão da pedreira de Pewter na segunda-feira seguinte. Ele não avisou a mãe.',
  pool:[76, 112, 105, 51, 28, 142],          // Golem, Rhydon, Marowak, Dugtrio, Sandslash, Aerodactyl
  ace:95, nivelExtra:0, moral:75,           // o Onix é o dele desde a pedreira
  cor:'var(--destaque-2)',

  /* quem perdeu tudo pra você volta pra pedreira; quem te admira foi
     cavar fóssil na pedreira velha; quem ouviu falar mal de você não
     senta mais no meio-fio */
  arco:(d, r) => {
    if (r.derrotas >= 3 && r.vitorias === 0) return 'cansado';
    if (ladoEscuro(d) || repRuim(3)) return 'desconfiado';
    if (opiniaoRival(defRival('nilo'), d) >= 6 || repBoa(3)) return 'inspirado';
    return 'teimoso';
  },
  arcos:{
    teimoso:{nome:'Teimoso', resumo:'Anota o placar num caderno e volta sempre.'},
    inspirado:{nome:'Inspirado', resumo:'Foi cavar fóssil na pedreira velha por sua causa.',
      pool:[141, 139, 76, 142, 112, 105], ace:95, nivelExtra:1, moral:90},   // Kabutops e Omastar da parede do fundo
    desconfiado:{nome:'Desconfiado', resumo:'Ouviu falar de você e não gostou do que ouviu.',
      pool:[112, 105, 51, 28, 76], ace:95, nivelExtra:2, moral:55},
    cansado:{nome:'Cansado', resumo:'Voltou pra pedreira em meio período e treina quando dá.',
      pool:[74, 27, 104, 50], ace:95, nivelExtra:-2, moral:40}
  },

  fala:(d, r, arco) => {
    if (arco === 'inspirado') return [
      'Lior está te esperando na saída da cidade com um caderno novo, de capa dura, e um Kabuto no ombro que não estava lá da outra vez.',
      r.encontros === 0
        ? '"Eu larguei a pedreira." Ele ri sozinho. "E depois eu voltei nela. Na velha, a que fechou."'
        : `"${r.derrotas} a ${r.vitorias}." Ele vira o caderno pra você. "Agora tem uma coluna de coisa que eu aprendi. Tá mais cheia que a outra."`,
      '"Tem fóssil na parede do fundo que ninguém tirava porque não dava lucro." Ele coça a cabeça do Kabuto. "Dava outra coisa."',
      '"Eu quero ganhar de você do jeito que você ganha. Bora."'
    ];
    if (arco === 'desconfiado') return [
      'Lior não está sentado dessa vez. Ele está de pé, de braço cruzado, e o Geodude não está do lado dele.',
      '"Eu ouvi coisa de você." Ele não diz o quê. "Na pedreira tinha gente que pagava por fora e sorria por dentro. Eu reconheço o jeito."',
      r.encontros === 0 ? '"Mas eu disse que ia lutar com você, e eu cumpro o que eu digo. Alguém tem que cumprir."'
                        : '"Essa eu não vou anotar no caderno. Essa é só pra mim."',
      '"Bora."'
    ];
    if (arco === 'cansado') return [
      'Lior está de uniforme laranja da pedreira, com o nome bordado no peito.',
      '"Voltei. Meio período." Ele não te olha direito. "Treino de noite, quando dá. Quase nunca dá."',
      '"Luta assim mesmo? Eu trouxe o que eu tenho."'
    ];
    const L = ['Lior está sentado no meio-fio com um Geodude do lado, e o Geodude está sentado exatamente do mesmo jeito que ele.'];
    L.push(r.encontros === 0
      ? '"Eu larguei." Ele diz isso antes de dizer oi. "Eu larguei a pedreira e a minha mãe ficou três semanas sem falar comigo, e eu larguei do mesmo jeito."'
      : `"${r.derrotas} a ${r.vitorias}." Ele fala o placar como quem fala a hora. "Eu anoto num caderno. Eu sei que é ridículo."`);
    if (d.insignias.length >= 5) L.push('"Você tem insígnia demais pra estar perdendo tempo comigo e vem mesmo assim. Eu reparo nisso."');
    L.push('"Eu não tenho jeito bonito. Eu tenho pedra." Ele se levanta e o Geodude se levanta junto. "Bora."');
    return L;
  },
  vitoria:(d, r, arco) => arco === 'inspirado' ? [
    'O Onix dele deita no chão devagar, do jeito que pedra deita.',
    `"${r.derrotas + 1}." Ele anota e mostra: do lado do número tem uma pedrinha desenhada. "É assim que eu marco as boas. Essa foi boa."`
  ] : arco === 'desconfiado' ? [
    'Ele recolhe o time sem olhar o que caiu.',
    '"Você ganha." Ele já está indo embora. "Ganhar nunca foi o problema das pessoas que eu conheço."'
  ] : arco === 'cansado' ? [
    'O Onix dele cai e ele demora a recolher, como quem está cansado demais pra se levantar também.',
    '"Tá certo." Ele fecha o caderno sem anotar. "Amanhã é às seis."'
  ] : [
    'O último dele cai e faz barulho de coisa pesada caindo, porque é exatamente isso.',
    'Lior anota no caderno antes de recolher o time, o que é uma ordem esquisita de fazer as coisas.',
    `"${r.derrotas + 1}." Ele fecha o caderno. "Tá certo. Eu volto."`,
    'Ele não parece abalado. Ele parece um cara que calculou quantas vezes ia perder antes de começar.'
  ],
  derrota:(d, r, arco) => arco === 'inspirado' ? [
    'Lior ganha e não comemora. Ele fica sério, como quem confere uma conta.',
    '"Eu ganhei de quem eu queria ganhar." Ele mostra o caderno. "Agora eu sei que dá."'
  ] : arco === 'desconfiado' ? [
    '"Pronto." Ele guarda as Pokébolas sem pressa.',
    '"Essa eu anoto."'
  ] : arco === 'cansado' ? [
    '"Opa." Ele olha a própria mão como se ela tivesse feito aquilo sozinha. "Opa. Peraí."',
    'Ele anota no caderno, e a mão treme um pouco, e não é de cansaço.'
  ] : [
    'Lior ganha, e a primeira coisa que ele faz é olhar em volta pra ver se alguém viu.',
    'Ninguém viu. Tem só vocês dois numa rua de cidade pequena.',
    `"Uma." Ele mostra o caderno pra você, aberto, com a coluna certa. "Uma de ${r.vitorias + 1}. Eu queria que a minha mãe tivesse visto essa."`
  ]
},
{
  id:'tunico', nome:'Nolan', npc:'Menino do cais', desde:'Vermilion', caps:[11, 16, 22],
  origem:'O menino do cais de Vermilion. Você tratou ele como gente e ele resolveu que ia ser treinador.',
  gatilho:d => { const n = d.npcs['Menino do cais']; return !!n && n.opiniao >= 4; },
  nascimento:'Nolan saiu do cais de Vermilion com o Krabby e uma mochila emprestada. A carta da mãe dele continua sem resposta.',
  pool:[99, 73, 117, 55, 91, 131],           // Kingler, Tentacruel, Seadra, Golduck, Cloyster, Lapras
  ace:121, nivelExtra:1, moral:85,          // o Starmie veio depois e é o orgulho dele
  cor:'var(--destaque-3)',

  /* ele copia quem ele admira: se você ajudou com a carta, ele foi
     responder; se você faz negócio com Pokémon, ele também faz */
  arco:(d, r) => {
    if (ladoEscuro(d) || repRuim(3)) return 'vendedor';
    if (d.flags.a_carta_do_denis || d.flags.copiou_a_carta || opiniaoRival(defRival('tunico'), d) >= 8) return 'esperanca';
    return 'orgulhoso';
  },
  arcos:{
    orgulhoso:{nome:'Orgulhoso', resumo:'Saiu do cais e conta isso pra todo mundo.'},
    esperanca:{nome:'Esperança', resumo:'Respondeu a carta da mãe, e luta mais calmo por isso.',
      pool:[131, 119, 55, 117, 91], ace:121, nivelExtra:1, moral:95},
    vendedor:{nome:'Vendedor', resumo:'Aprendeu com você que Pokémon também é negócio.',
      pool:[73, 91, 99, 130, 117], ace:121, nivelExtra:2, moral:50}
  },

  fala:(d, r, arco) => {
    if (arco === 'esperanca') return [
      'Nolan está sentado na mureta, quieto, o que é a coisa mais estranha que você já viu ele fazer.',
      '"Eu respondi a carta." Ele fala devagar, como quem ensaiou. "Da minha mãe. Eu escrevi três folhas e mandei."',
      '"Ela não respondeu ainda. Mas eu respondi, e isso é meu."',
      '"Luta comigo? Eu tô lutando melhor. Eu tô dormindo melhor, aí eu luto melhor."'
    ];
    if (arco === 'vendedor') return [
      'Nolan tem uma banca agora. Uma lona no chão, três Pokébolas em cima, preço escrito em papelão.',
      '"Me falaram que você faz negócio." Ele não está acusando. Está orgulhoso, e é isso que dói. "Eu também faço agora. Eu aprendi."',
      r.encontros === 0 ? '"O Krabby eu não vendo. Esse não."' : '"O Starmie eu não vendo. Me ofereceram e eu não vendi."',
      '"Mas luta comigo primeiro. Se eu ganhar, você compra um."'
    ];
    const L = ['Nolan te vê primeiro e grita o seu nome inteiro de longe, do jeito que só criança de cais grita.'];
    L.push(r.encontros === 0
      ? '"EU SAÍ!" Ele chega correndo. "Eu saí do cais! Eu peguei o Krabby e eu saí e eu não avisei ninguém e agora eu tô aqui!"'
      : '"Eu tenho seis agora." Ele mostra o cinto com um orgulho que não cabe nele. "SEIS."');
    L.push('"Eu ainda vendo coisa. Não Pokémon — coisa. Isca, corda, concha. Dá pra viver."');
    if (d.flags.a_carta_do_denis || d.flags.copiou_a_carta || (d.npcs['Menino do cais'] || {}).opiniao >= 8)
      L.push('"E eu não perguntei da minha mãe." Ele fala isso rápido, pra passar logo. "Eu vou perguntar. Só não hoje."');
    L.push('"Luta comigo. Luta de verdade, hein. Não faz aquela coisa de adulto de deixar ganhar."');
    return L;
  },
  vitoria:(d, r, arco) => arco === 'esperanca' ? [
    'O Starmie dele gira uma última vez e para.',
    'Nolan recolhe e fica olhando a Pokébola na mão um tempo.',
    '"Quando ela responder, eu vou contar que perdi pra você." Ele sorri. "Ela vai achar que é coisa boa. E é."'
  ] : arco === 'vendedor' ? [
    'O Starmie dele para de girar.',
    'Nolan recolhe e volta pra banca sem dizer nada, e arruma as três Pokébolas em fila, mais retas do que precisava.'
  ] : [
    'O Starmie dele gira uma última vez e para.',
    'Nolan senta no chão onde estava de pé, sem drama nenhum, e fica olhando o núcleo apagar.',
    '"Tá." Ele levanta antes de você dizer qualquer coisa. "Tá, eu vi o que você fez no terceiro. Eu vou copiar."',
    'Ele te aperta a mão com as duas mãos, que é como ele aprendeu a fechar negócio no cais.'
  ],
  derrota:(d, r, arco) => arco === 'vendedor' ? [
    'Nolan ganha e aponta pra banca.',
    '"Combinado é combinado." Ele espera. Depois ri, sem graça. "Brincadeira. Eu não vendo pra você. Pra você não."'
  ] : [
    'Nolan ganha e não comemora na hora — ele leva uns três segundos pra acreditar.',
    'Aí ele comemora. Muito. Alto. Sozinho, no meio da rua.',
    '"EU GANHEI DE VOCÊ." Ele aponta pra você e depois pra ele. "EU. DE VOCÊ."',
    'Ele vai te contar isso toda vez que se encontrarem pelo resto da vida, e você sabe disso agora.'
  ]
},
{
  id:'fuchsia', nome:'Rory', npc:'Rory', desde:'S.S. Anne', caps:[12, 18, 23],
  origem:'O garoto de Fuchsia que caiu na primeira rodada do torneio do Anne. O Rapidash dele precisava de dezoito mil.',
  gatilho:d => !!d.flags.o_garoto_de_fuchsia,
  nascimento:'Rory voltou a treinar. Ninguém pediu pra ele voltar a treinar.',
  pool:[59, 38, 89, 110, 126, 136],          // Arcanine, Ninetales, Muk, Weezing, Magmar, Flareon
  ace:78, nivelExtra:2, moral:60,           // o Rapidash é o motivo de tudo
  aceFixo:true,                             // tem onze anos: é Rapidash em qualquer nível, nunca Ponyta
  cor:'var(--perigo)',

  /* quatro versões do mesmo garoto, conforme o corredor do navio: deu o
     prêmio, deu cinco mil, ficou sentado sem ter o que dar (perdeu
     também), ou passou — com o envelope ou sem ele */
  arco:d => d.flags.deu_o_premio ? 'devedor'
          : d.flags.agora_falta_menos ? 'quase'
          : (d.flags.ficou_com_o_de_catorze && !d.flags.venceu_torneio_navio) ? 'companhia'
          : 'ressentido',
  arcos:{
    devedor:{nome:'Devedor', resumo:'O Rapidash operou com o seu dinheiro, e ele luta pra pagar do único jeito que sabe.',
      pool:[59, 38, 126, 136], ace:78, nivelExtra:2, moral:90},
    quase:{nome:'Quase', resumo:'A cirurgia saiu com atraso, e cada luta é uma conta que diminui.',
      pool:[38, 126, 110, 59], ace:78, nivelExtra:2, moral:65},
    companhia:{nome:'Companhia', resumo:'O Rapidash anda em três patas, e ele lembra de quem sentou do lado.',
      pool:[59, 38, 136, 89], ace:78, nivelExtra:1, moral:75},
    ressentido:{nome:'Ressentido', resumo:'Ele não esqueceu o corredor, e o time dele ficou venenoso.',
      pool:[89, 110, 24, 126], ace:78, nivelExtra:3, moral:45}
  },

  fala:(d, r, arco) => {
    if (arco === 'devedor') return [
      'Ele está te esperando, e dá pra ver pelo chão em volta dos pés dele que está há um tempo.',
      'O Rapidash está atrás, inteiro. A pata dianteira que tinha uma cicatriz agora tem duas.',
      '"Nove anos." Ele fala isso sem contexto nenhum, e você demora a entender. "O médico de Pokémon disse que ele ganhou mais nove anos. Nove anos por sua causa."',
      '"Eu não consigo te pagar. Eu fiz a conta de quanto eu ganharia por ano e não fecha até os trinta."',
      `"Então eu vou fazer isso." Ele solta a primeira Pokébola. "Eu vou te dar uma luta boa toda vez que eu te encontrar, pelo resto da vida. É o que eu tenho."`
    ];
    if (arco === 'quase') return [
      'Ele te reconhece e demora um segundo a mais do que o normal para decidir o que fazer com a cara.',
      '"Deu certo." Ele diz. "Deu certo com atraso de cinco meses e o médico de Pokémon falou que atrasar teve custo, mas deu."',
      'O Rapidash manca. Não muito. O bastante.',
      `"Eu não sei o que eu te devo." Ele fala isso honesto, sem acusar. "Você me deu cinco. Faltavam treze. Eu passei cinco meses juntando treze."`,
      '"Então luta comigo e a gente descobre junto."'
    ];
    if (arco === 'companhia') return [
      'Ele te vê e levanta a mão antes de você levantar a sua.',
      'O Rapidash está do lado dele, firme em três patas, com a dianteira da cicatriz encolhida.',
      r.encontros === 0
        ? '"Não deu." Ele fala antes de você perguntar. "Não fiz a cirurgia. O médico de Pokémon disse que dá pra viver assim, e ele vive."'
        : '"Continua em três." Ele passa a mão no pescoço do Rapidash. "Continua querendo."',
      '"Eu lembro do corredor." Ele não olha pra você quando diz isso. "Todo mundo passou. Você sentou."',
      '"Então eu vou te dar a melhor luta que eu tiver. É o que eu sei fazer com o que eu lembro."'
    ];
    if (!d.flags.venceu_torneio_navio) return [
      'Ele está encostado num muro e não finge que não te viu.',
      '"Foi mal." Ele repete o que você disse no corredor do Anne, do jeito que você disse. "Todo mundo que passou por aquele corredor disse foi mal."',
      r.encontros === 0
        ? '"Eu não tô te culpando. Você perdeu também, eu sei." Ele empurra o muro com o ombro e fica de pé. "Eu só não esqueci."'
        : '"E eu continuo não esquecendo, se você ia perguntar."',
      '"Ele vive. Manca e vive. Bora."'
    ];
    return [
      'Ele está encostado num muro e não finge que não te viu.',
      '"Vinte mil." Ele diz o número primeiro. "Você saiu do navio com vinte mil e eu saí com um Rapidash que não anda direito."',
      d.flags.ficou_com_o_de_catorze
        ? '"Você ficou vinte e cinco minutos sentad{o|a} do meu lado com o envelope na mochila. Eu contei os minutos depois."'
        : '',
      r.encontros === 0
        ? '"Eu não tô te culpando. Eu treinei seis meses e você foi melhor e é isso." Ele empurra o muro com o ombro e fica de pé. "Eu só não esqueci."'
        : '"E eu continuo não esquecendo, se você ia perguntar."',
      '"Ele vive. Manca e vive. Bora."'
    ];
  },
  vitoria:(d, r, arco) => {
    if (arco === 'devedor') return [
      'O Rapidash cai de lado e ele está do lado dele antes de tocar o chão.',
      '"Tá bom, tá bom." Ele fala com o Rapidash, não com você. "Tá bom, foi boa."',
      'Ele olha pra você de baixo, agachado, e faz que sim com a cabeça uma vez.',
      '"Da próxima eu chego mais perto. Eu cheguei mais perto essa vez."'
    ];
    return [
      'O Rapidash cai e leva um tempo a mais do que devia pra se levantar de novo, por causa da perna.',
      'Ele não diz nada. Recolhe, passa a mão no pescoço do Pokémon, e guarda.',
      arco === 'quase'
        ? '"Falta menos." Ele diz, e dessa vez não é sobre dinheiro. "Cada vez falta menos."'
        : arco === 'companhia'
          ? '"Foi boa." Ele fala com o Rapidash, que se apoia nele pra levantar. "Foi boa, né?"'
          : '"Um dia." Ele já está de costas. "Um dia não vai ser você saindo com tudo."'
    ];
  },
  derrota:(d, r, arco) => {
    if (arco === 'devedor') return [
      'O Rapidash queima o seu último e ele levanta os dois braços e depois abaixa, envergonhado da própria comemoração.',
      '"Desculpa." Ele está rindo. "Desculpa, eu não devia comemorar, você — desculpa."',
      '"Eu ia falar que eu te devo uma, mas essa piada é de mau gosto."'
    ];
    return [
      'Ele ganha, e a cara dele quando ganha é a de quem esperou muito tempo por uma coisa pequena.',
      '"Pronto." Ele guarda as Pokébolas. "Pronto, agora tá mais perto de zero."',
      'Ele não explica o que é o zero. Você entende assim mesmo.'
    ];
  }
},
{
  id:'vasco', nome:'Otto', npc:'Caçador Roque', desde:'Floresta de Viridian', caps:[7, 10, 15, 19],
  origem:'O caçador da Floresta de Viridian. Você o obrigou a abrir as gaiolas e ele anotou o seu rosto.',
  gatilho:d => { const n = d.npcs['Caçador Roque']; return !!n && n.opiniao <= -3; },
  nascimento:'O Caçador Roque perguntou o seu nome em três Centros Pokémon diferentes esta semana.',
  pool:[42, 49, 89, 94, 71, 110],            // Golbat, Venomoth, Muk, Gengar, Victreebel, Weezing
  ace:24, nivelExtra:3, moral:35,           // o Arbok é o que ele usa para prender
  cor:'var(--ruim)',

  /* quem trabalha pros mesmos que ele vira colega, o que é pior; quem
     ficou famoso pelo bem cansa ele, e a opinião dele pode sair do fundo */
  arco:(d, r) => {
    if (ladoEscuro(d)) return 'colega';
    if (opiniaoRival(defRival('vasco'), d) > -3 || repBoa(6)) return 'cansado';
    return 'cacador';
  },
  arcos:{
    cacador:{nome:'Caçador', resumo:'Tem paciência e anota o seu rosto.'},
    colega:{nome:'Colega', resumo:'Acha que vocês trabalham pros mesmos, e trata você como igual.',
      pool:[94, 89, 42, 110, 49], ace:24, nivelExtra:4, moral:40},
    cansado:{nome:'Cansado', resumo:'Largou a rede, e ainda não sabe o que fazer com as mãos.',
      pool:[49, 71, 42], ace:24, nivelExtra:1, moral:55}
  },

  fala:(d, r, arco) => {
    if (arco === 'colega') return [
      'Otto está encostado numa caminhonete com a caçamba coberta por uma lona, e acena pra você como se vocês tivessem marcado.',
      '"A gente trabalha pros mesmos agora." Ele fala baixo, cúmplice. "Eu soube. Todo mundo que paga sabe de todo mundo que recebe."',
      '"Isso não muda nada entre nós. Eu só quero ver se você é bom de verdade, ou só tem sorte com quem te contrata."'
    ];
    if (arco === 'cansado') return [
      'Otto está sem a rede. As mãos dele estão vazias de um jeito diferente: não de ameaça, de falta.',
      '"Eu larguei." Ele diz isso sem você perguntar. "A floresta. A rede. Os dois que eu tinha pegado com a mão, eu não pego mais."',
      '"Não foi por você. Foi por mim." Ele pensa. "Foi um pouco por você."',
      '"Uma luta. Sem prender ninguém no fim."'
    ];
    const L = ['Otto não está escondido. Ele está parado no meio do caminho com as mãos vazias, o que é pior do que se estivessem cheias.'];
    L.push(r.encontros === 0
      ? '"Você me custou dois." Ele não levanta a voz nenhuma vez, nesta nem nas próximas. "Dois que eu tinha pegado com a minha mão."'
      : `"${r.vitorias} a ${r.derrotas}." Ele sabe o placar de cor e você não gosta que ele saiba. "Eu tenho paciência. É o único talento que eu tenho de verdade."`);
    if (d.cemiterio.length) L.push(`"E eu soube do seu." Ele diz isso sem prazer nenhum, o que é o mais desagradável de tudo. "${nomeExib(d.cemiterio[0])}. Então você também perde Pokémon. A gente é mais parecido do que você aceita."`);
    if (Estado.rep.eixo === 'bom' && Estado.rep.bom >= 5) L.push('"Todo mundo fala bem de você agora. Isso facilita a minha vida: quem é conhecido é fácil de achar."');
    L.push('"Eu não vou te machucar. Eu vou te cansar."');
    return L;
  },
  vitoria:(d, r, arco) => arco === 'colega' ? [
    'O Arbok dele desenrola no chão e para.',
    '"Bom de verdade." Otto bate duas vezes na lona da caçamba, e alguma coisa lá dentro se mexe. "Vou falar bem de você pra quem paga."'
  ] : arco === 'cansado' ? [
    'O Arbok dele desenrola no chão e para.',
    'Otto se agacha do lado do Pokémon e fica ali, sem recolher, um tempo comprido.',
    '"Ele nunca tinha perdido sem eu estar segurando a rede." Ele recolhe. "Acho que nem ele sabia lutar sem ela."'
  ] : [
    'O Arbok dele desenrola no chão e para.',
    'Otto recolhe sem pressa, e a falta de pressa é a mensagem.',
    '"Anotado." Ele passa por você no caminho, ombro a ombro, sem empurrar. "Eu tenho mais floresta do que você tem estrada."',
    'Você fica com a sensação de que ele conseguiu o que veio buscar, e você não sabe o que era.'
  ],
  derrota:(d, r, arco) => arco === 'cansado' ? [
    'Ele ganha e fica surpreso, de verdade.',
    '"Eu ganhei sem prender ninguém." Ele olha as próprias mãos. "Dá."'
  ] : arco === 'colega' ? [
    'Ele ganha e passa a mão no seu ombro, como colega de trabalho.',
    '"Sorte com quem te contrata, então." Ele sobe na caminhonete. "Melhora, que eu quero te indicar."'
  ] : [
    'Ele ganha e não comemora, porque comemorar seria admitir que era uma competição.',
    'Otto se agacha na sua frente, na altura dos seus olhos, e fala baixo.',
    '"A floresta não é sua." Ele se levanta. "Nunca foi."',
    'Ele abre a sua mochila na sua frente, tira uma coisa qualquer de pouco valor, e leva. É sobre poder fazer isso.'
  ]
}
];

/* ---------- registro: quem já virou rival ---------- */
function registroRivais(){
  const d = Estado.dados;
  if (!d.rivais) d.rivais = {};
  return d.rivais;
}
function defRival(id){ return RIVAIS_EXTRA.find(r => r.id === id) || null; }
function registroRival(id){ return registroRivais()[id] || null; }

/* Chamada no fim de cada capítulo: transforma escolhas em rivais.
   Devolve avisos para a tela de encerramento. */
function conquistarRivais(){
  const d = Estado.dados;
  const reg = registroRivais();
  const avisos = [];
  for (const R of RIVAIS_EXTRA){
    if (reg[R.id]) continue;
    let virou = false;
    try { virou = !!R.gatilho(d); } catch(e){ virou = false; }
    if (!virou) continue;
    reg[R.id] = {id:R.id, nome:R.nome, vitorias:0, derrotas:0, encontros:0,
                 ultimoCap:0, desdeCap:d.capitulo};
    Estado.registrar(`Novo rival: ${R.nome}. ${R.origem}`);
    avisos.push({tipo:'rival', texto:`${R.nome} virou seu rival. ${R.nascimento}`});
  }
  return avisos;
}

function rivaisConquistados(){
  const reg = registroRivais();
  return RIVAIS_EXTRA.filter(R => reg[R.id]).map(R => ({def:R, reg:reg[R.id]}));
}

/* ---------- time e arco de um rival extra ---------- */
/* O arco é recalculado a cada encontro, como o do Ezra: muda com a
   opinião dele, a sua reputação, o lado em que você está e o placar. */
function arcoRivalExtra(R){
  const reg = registroRival(R.id) || {encontros:0, vitorias:0, derrotas:0};
  try { return typeof R.arco === 'function' ? R.arco(Estado.dados, reg) : (R.arco || 'padrao'); }
  catch(e){ return 'padrao'; }
}
/* o que o arco muda no time: lista, ace, nível e moral */
function defArcoExtra(R, arco){
  const A = (R.arcos && R.arcos[arco || arcoRivalExtra(R)]) || {};
  return {nome:A.nome || 'Rival', resumo:A.resumo || '', pool:A.pool || R.pool, ace:A.ace || R.ace,
          nivelExtra:A.nivelExtra != null ? A.nivelExtra : (R.nivelExtra || 0), moral:A.moral || R.moral || 70};
}
/* ajudantes dos gatilhos */
function opiniaoRival(R, d){ const n = (d || Estado.dados).npcs[R.npc]; return n ? (n.opiniao || 0) : 0; }
function repRuim(n){ const r = Estado.rep; return r.eixo === 'ruim' && r.ruim >= n; }
function repBoa(n){ const r = Estado.rep; return r.eixo === 'bom' && r.bom >= n; }
function ladoEscuro(d){ return ['rocket', 'mercenario', 'foragido'].includes(typeof linhaAtual === 'function' ? linhaAtual(d) : null); }

function nivelRivalExtra(R){
  const t = Estado.dados.time.filter(p => !p.morto);
  const base = t.length ? Math.round(t.reduce((s,p)=>s+p.nivel,0)/t.length) : 8;
  return Math.max(6, base + defArcoExtra(R).nivelExtra);
}

function timeRivalExtra(R){
  const A = defArcoExtra(R);
  R = Object.assign({}, R, {pool:A.pool, ace:A.ace, moral:A.moral});
  const nivel = nivelRivalExtra(R);
  const qtd = Math.max(2, Math.min(6, 2 + Math.round(numInsignias() * 0.5)));
  const time = [];
  /* a linha evolutiva acompanha o nível: nada de Kingler Nv28
     num rival cujo time inteiro está no Nv9. E ninguém leva dois
     do mesmo bicho só porque duas formas colapsaram no mesmo estágio. */
  const nvAce = nivel + 2;
  const usados = new Set([R.aceFixo ? R.ace : formaAteONivel(R.ace, nvAce)]);
  for (let i = 0; i < R.pool.length && time.length < qtd - 1; i++){
    const nv = Math.max(5, nivel - 2 + time.length);
    const dex = formaAteONivel(R.pool[i], nv);
    if (usados.has(dex)) continue;
    usados.add(dex);
    time.push(criarPokemon(dex, nv, {moral:R.moral || 70}));
  }
  time.push(criarPokemon(R.aceFixo ? R.ace : formaAteONivel(R.ace, nvAce), nvAce, {moral:R.moral || 70}));
  return time;
}

function falaRivalExtra(R){
  const reg = registroRival(R.id) || {encontros:0, vitorias:0, derrotas:0};
  return R.fala(Estado.dados, reg, arcoRivalExtra(R)).filter(Boolean);
}
function falaVitoriaRivalExtra(R){
  const reg = registroRival(R.id) || {encontros:0, vitorias:0, derrotas:0};
  return R.vitoria(Estado.dados, reg, arcoRivalExtra(R));
}
function falaDerrotaRivalExtra(R){
  const reg = registroRival(R.id) || {encontros:0, vitorias:0, derrotas:0};
  return R.derrota(Estado.dados, reg, arcoRivalExtra(R));
}

function registrarResultadoRivalExtra(id, venceuJogador){
  const reg = registroRival(id);
  if (!reg) return null;
  reg.encontros++;
  reg.ultimoCap = Estado.dados.capitulo;
  if (venceuJogador) reg.derrotas++; else reg.vitorias++;
  const R = defRival(id);
  if (R) reg.arco = arcoRivalExtra(R);
  Estado.registrar(`Encontro com ${R ? R.nome : id}: ${venceuJogador ? 'você venceu' : 'ele venceu'}. Placar ${reg.derrotas}×${reg.vitorias}.`);
  return reg;
}
