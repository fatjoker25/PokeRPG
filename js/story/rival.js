/* ============================================================
   O RIVAL
   Téo, da pedra na Rota 1. Ele não é um obstáculo fixo:
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
  // o inicial dele é o que vence o seu — como sempre foi
  const contra = {1:4, 4:7, 7:1};     // Bulbasaur->Charmander, Charmander->Squirtle, Squirtle->Bulbasaur
  const meu = d.jogador.inicialDex;
  const dele = contra[meu] || Dados.escolher([1,4,7]);
  d.rival = {
    nome:'Téo',
    inicialDex: dele,
    vitorias:0,      // vitórias DELE sobre você
    derrotas:0,      // derrotas dele
    encontros:0,
    ultimoCap:0,
    arco:'rival'
  };
  return d.rival;
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
  const npc = d.npcs['Téo'];
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

/* linha evolutiva do inicial dele, conforme o nível */
function inicialDoRival(nivel){
  const linha = {1:[1,2,3], 4:[4,5,6], 7:[7,8,9]}[rival().inicialDex] || [1,2,3];
  if (nivel >= 36) return linha[2];
  if (nivel >= 16) return linha[1];
  return linha[0];
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
    const candidatos = POOL_SELVAGEM.filter(d => {
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

  let pool = POOL_ARCO[arco].slice();
  if (arco === 'perseguidor'){
    const contras = contraSeuTime();
    pool = contras.concat(pool.filter(x => !contras.includes(x)));
  }

  const time = [];
  for (let i = 0; i < qtd - 1 && i < pool.length; i++){
    time.push(criarPokemon(pool[i], Math.max(5, nivel - 2 + i), {moral: ARCOS_RIVAL[arco].moral}));
  }
  // o inicial dele entra por último e é sempre o ace
  const ini = criarPokemon(inicialDoRival(nivel), nivel + 2, {moral: ARCOS_RIVAL[arco].moral});
  if (arco === 'quebrado') ini.nivel = Math.max(5, nivel);
  time.push(ini);
  return time;
}

/* ============================================================
   ENCONTROS — ele aparece entre capítulos
   ============================================================ */
const CAPS_RIVAL = [5, 9, 13, 17, 21];

function rivalDeveAparecer(cap){
  const d = Estado.dados;
  if (!d.npcs['Téo']) return false;            // você nunca falou com ele na Rota 1
  const r = rival();
  if (r.ultimoCap === cap) return false;
  return CAPS_RIVAL.includes(cap);
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
    L.push('"EI!" Téo atravessa a rua correndo e quase é atropelado por uma bicicleta. "Cara, eu vi o teu nome numa parada e eu gritei no meio do Centro Pokémon."');
    if (d.insignias.length) L.push(`"${d.insignias.filter(i=>i!=='Título de Campeão').length} insígnias. ${d.insignias.length>4?'CARA.':'Já?'}"`);
    if (d.cemiterio.length) L.push(`Ele fica sério de repente. "Eu soube do ${nomeExib(d.cemiterio[0])}." Ele não sabe o que fazer com as mãos. "Desculpa. Eu não sei falar essas coisas."`);
    L.push(placar === 'perdendo'
      ? '"Eu perdi as últimas. Eu sei. Mas eu vim de novo, e eu vou vir de novo depois dessa."'
      : '"Bora? Bora. Eu tô pronto dessa vez, eu treinei de verdade."');
  }

  else if (arco === 'rival'){
    L.push('"Achei que ia te encontrar aqui." Téo já está com a mão no cinto. "Não é coincidência, eu perguntei pra umas pessoas."');
    if (d.insignias.length >= 4) L.push('"Você tá na minha frente. Tá tranquilo. Eu prefiro assim, dá menos vergonha de perder."');
    L.push(placar === 'ganhando' ? '"Eu tô ganhando a série. Você percebeu isso ou tá fingindo que não?"' : '"Bora resolver isso."');
  }

  else if (arco === 'ressentido'){
    L.push('Téo está encostado num poste e não se mexe quando você passa. Ele espera você notar.');
    L.push('"Oi." Ele não sorri. "Eu tenho treinado."');
    const npc = d.npcs['Téo'];
    const mem = npc && npc.memorias && npc.memorias.length ? npc.memorias[npc.memorias.length-1].texto : null;
    if (mem) L.push(`Ele não esqueceu. "${mem}"`);
    L.push('"Não precisa ser simpático. Eu não vim pra isso."');
  }

  else if (arco === 'perseguidor'){
    L.push('Téo está esperando no meio do caminho, e dá pra ver que ele está ali há horas.');
    L.push('"Eu não vim te desafiar."');
    if (d.cemiterio.length >= 2) L.push(`"Eu contei. Você perdeu ${d.cemiterio.length}. Isso não é acidente duas vezes."`);
    if (d.flags.trabalha_para_comissao || d.flags.conselheiro_da_comissao) L.push('"Eu li as atas. Tem o teu nome numa delas, numa lista de presença, do lado de gente que assina descarte."');
    if (d.flags.assumiu_a_rede) L.push('"Eu fui em Celadon. Eu vi o portão azul. Eu perguntei de quem era agora e eles falaram o teu nome."');
    if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=6) L.push(`"Tem gente com medo de você. Gente de verdade, não bicho."`);
    L.push('"A gente se conheceu numa pedra na Rota 1. Eu tava lá desde as seis da manhã e você foi a primeira pessoa que passou."');
    L.push('"Eu vou te parar. Eu não sei se eu consigo. Mas alguém tem que estar aqui, e quem te conhece sou eu."');
  }

  else { // quebrado
    L.push('Téo está sentado no chão do Centro Pokémon, de costas para a porta, e demora pra virar.');
    L.push('"Ah. Oi."');
    L.push(`"Eu perdi pra você ${r.derrotas} vezes." Ele diz o número sem drama. "Eu parei de contar como derrota faz um tempo. Agora eu conto como... sei lá. Estatística."`);
    L.push('"Eu vou lutar se você quiser. Eu só não vou fingir que eu acho que dá."');
  }

  return L;
}

function falaVitoriaRival(){   // você venceu
  const arco = arcoRival();
  const r = rival();
  const d = Estado.dados;
  if (arco === 'parceiro') return [
    'Téo recolhe o time e vem te abraçar antes de recolher, o que é a ordem errada e é muito a cara dele.',
    `"${r.derrotas + 1}." Ele conta em voz alta. "Eu vou chegar em você um dia. Não hoje. Mas eu vou."`,
    'Ele te dá metade do dinheiro que tem no bolso e não aceita não.'
  ];
  if (arco === 'ressentido') return [
    'Ele recolhe o time em silêncio e leva mais tempo do que precisa.',
    '"É." Só isso, por uns dez segundos. "É."',
    '"Sabe o que é o pior? Eu treinei. Eu treinei de verdade dessa vez."',
    'Ele vai embora antes de você responder.'
  ];
  if (arco === 'perseguidor') return [
    'Téo cai de joelhos no chão junto com o último do time dele, e não é figura de linguagem.',
    '"Eu sabia." Ele está chorando e não está tentando esconder. "Eu sabia que não ia dar."',
    '"Eu vim mesmo assim porque não tinha mais ninguém."',
    d.flags.tem_sangue_nas_maos
      ? '"Você lembra da pedra? Na Rota 1?" Ele te olha. "Eu lembro. Eu lembro de quem entrou naquela floresta."'
      : '"Para. Por favor. É só isso que eu vim pedir."'
  ];
  if (arco === 'quebrado') return [
    'Acaba rápido. Rápido demais.',
    'Ele recolhe as bolas do chão e senta de novo.',
    '"Valeu por lutar." Ele diz isso sério. "Muita gente já não luta comigo."'
  ];
  return [
    'Téo aperta a sua mão antes de recolher o time, do jeito que ele faz desde a Rota 1.',
    `"${r.derrotas + 1} a ${r.vitorias}." Ele já está calculando outra coisa. "Da próxima eu troco a ordem do time."`
  ];
}

function falaDerrotaRival(){   // ele venceu
  const arco = arcoRival();
  const r = rival();
  if (arco === 'parceiro') return [
    'Téo ganha e fica genuinamente sem saber como comemorar na sua frente.',
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
    'Téo não recolhe o time. Fica de pé entre você e o caminho.',
    '"Volta." A voz dele é firme de um jeito que você nunca ouviu. "Volta pra tua cidade. Hoje."',
    'E depois, mais baixo: "Eu não sei o que eu faço se você não voltar."'
  ];
  if (arco === 'quebrado') return [
    'Téo ganha.',
    'Ele olha as bolas na mão dele como se não entendesse o que acabou de acontecer.',
    '"Espera." Ele ri, e o riso quebra no meio. "Espera, eu —"',
    'Ele não termina a frase. Ele não precisa.'
  ];
  return [
    'Téo ganha e grita alto demais para o tamanho do lugar.',
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
  Estado.registrar(`Encontro com Téo (${ARCOS_RIVAL[r.arco].nome}): ${venceuJogador ? 'você venceu' : 'ele venceu'}. Placar ${r.derrotas}×${r.vitorias}.`);
  return r;
}
