/* ============================================================
   SOM — volumes, trilha e efeitos
   Preferência do aparelho, não da partida: vale pra todo save e mora
   no localStorage ('jc-audio').

   Canais, cada um com o seu controle: geral (multiplica os outros),
   música, sons da interface (`efeitos`: o toque de cada botão, abrir a
   Pokédex, a varredura, o arremesso, usar item, comprar) e sons dos
   Pokémon (`gritos`); e um mudo que cala tudo. Os sons da interface
   são sintetizados na hora com WebAudio: não tem arquivo.

   Trilha por tema:
   - a luta toca as faixas de batalha do Pokémon Showdown
     (sons/musica/showdown/), uma por tipo de luta: selvagem,
     treinador, rival, líder e Elite/torneio (`luta` no tema);
   - rota, cidade e caverna não têm faixa no Showdown: tocam o arquivo
     de quem joga, se houver, em sons/musica/<pasta>/rota.mp3 (e
     cidade, caverna; .ogg, .mp3 ou .m4a), senão a trilha sintetizada;
   - 'sintetizada' é a de chip, gerada aqui, pra tudo.
   O build deixa a pasta de música fora do arquivo único.
   ============================================================ */
const AUDIO_PADRAO = {v:2, geral:0.8, efeitos:0.6, gritos:0.8, musica:0.45, mudo:false, tema:'bw'};
/* luta: selvagem, treinador, rival, líder, elite (Elite, torneio,
   Conferência) → faixa em sons/musica/showdown/<nome>.mp3. O líder é
   o de Kanto de Black 2/White 2 em todos: é o único tema de ginásio
   que o Showdown tem, e é justamente o de Kanto. */
const LIDER_KANTO = 'bw2-kanto-gym-leader';
const TEMAS_DE_MUSICA = [
  {id:'bw',   nome:'Black/White', pasta:'bw',
   luta:{selvagem:'bw-subway-trainer', treinador:'bw-trainer', rival:'bw-rival', lider:LIDER_KANTO, elite:'bw2-rival'}},
  {id:'hgss', nome:'HeartGold/SoulSilver', pasta:'hgss',
   luta:{selvagem:'hgss-johto-trainer', treinador:'hgss-kanto-trainer', rival:'hgss-johto-trainer', lider:LIDER_KANTO, elite:'dpp-rival'}},
  {id:'dpp',  nome:'Diamond/Pearl', pasta:'dpp',
   luta:{selvagem:'dpp-trainer', treinador:'dpp-trainer', rival:'dpp-rival', lider:LIDER_KANTO, elite:'dpp-rival'}},
  {id:'xy',   nome:'X/Y', pasta:'xy',
   luta:{selvagem:'xy-trainer', treinador:'xy-trainer', rival:'xy-rival', lider:LIDER_KANTO, elite:'xy-rival'}},
  {id:'oras', nome:'Omega Ruby/Alpha Sapphire', pasta:'oras',
   luta:{selvagem:'oras-trainer', treinador:'oras-trainer', rival:'oras-rival', lider:LIDER_KANTO, elite:'oras-rival'}},
  {id:'sm',   nome:'Sun/Moon', pasta:'sm',
   luta:{selvagem:'sm-trainer', treinador:'sm-trainer', rival:'sm-rival', lider:LIDER_KANTO, elite:'sm-rival'}},
  {id:'meus', nome:'Meus arquivos (sons/musica/meus)', pasta:'meus'},
  {id:'sintetizada', nome:'Sintetizada (chip)'},
  {id:'nenhuma', nome:'Sem música'}
];
const CONTEXTOS_DE_MUSICA = ['batalha', 'rota', 'cidade', 'caverna'];

/* ---------- as faixas do Showdown e o que cada uma é ----------
   laco: os pontos de volta que o próprio Showdown usa (ms), pra emendar
   sem o silêncio do começo; energia de 1 a 5; marcas do clima. */
const FAIXAS_SHOWDOWN = {
  'hgss-kanto-trainer':  {laco:[13003, 94656],  energia:3, marcas:['classico','kanto','firme','solido','montanha','nostalgia']},
  'bw2-kanto-gym-leader':{laco:[14626, 58986],  energia:4, marcas:['classico','kanto','desafio','firme','epico']},
  'hgss-johto-trainer':  {laco:[23731, 125086], energia:3, marcas:['tradicional','tranquilo','elegante','natureza','flor']},
  'oras-trainer':        {laco:[13579, 91548],  energia:4, marcas:['mar','agua','tropical','energica','jovem','sol']},
  'sm-trainer':          {laco:[8323, 89230],   energia:4, marcas:['ilha','tropical','quente','vulcao','festivo','sol']},
  'bw-subway-trainer':   {laco:[15503, 110984], energia:5, marcas:['tecnologico','maquinario','rapido','eletrico','militar','metropole']},
  'bw2-homika-dogars':   {laco:[1661, 68131],   energia:5, marcas:['rebelde','barulhento','rock','veneno','sombrio']},
  'colosseum-miror-b':   {laco:[896, 47462],    energia:3, marcas:['excentrico','festivo','disco','danca','cidade-grande']},
  'xd-miror-b':          {laco:[9000, 57815],   energia:4, marcas:['excentrico','festivo','vilao','danca']},
  'xy-trainer':          {laco:[7802, 82469],   energia:3, marcas:['elegante','cidade-grande','moderno','jovem']},
  'dpp-trainer':         {laco:[13440, 96959],  energia:3, marcas:['firme','frio','serio','montanha']},
  'dpp-rival':           {laco:[13888, 66352],  energia:4, marcas:['rapido','jovem','rival','furtivo']},
  'bw-trainer':          {laco:[14629, 110109], energia:3, marcas:['moderno','metropole','serio']},
  'bw-rival':            {laco:[19180, 57373],  energia:4, marcas:['rival','emocao','epico']},
  'bw2-rival':           {laco:[7152, 68708],   energia:4, marcas:['tenso','sombrio','dramatico','misterioso','frio','rival']},
  'xy-rival':            {laco:[7802, 58634],   energia:4, marcas:['jovem','energica','rival']},
  'oras-rival':          {laco:[14303, 69149],  energia:4, marcas:['jovem','energica','rival','mar']},
  'sm-rival':            {laco:[11389, 62158],  energia:4, marcas:['jovem','alegre','tropical']},
  'spl-elite4':          {laco:[3962, 152509],  energia:5, marcas:['epico','final','grandioso','classico','arrogante']}
};

/* ---------- cada ginásio, por quatro lados ----------
   o tipo do ginásio, o jeito do líder, o lugar (cidade e prédio) e a
   dificuldade (que vira a energia que a faixa deve ter). A faixa é a
   que mais casa, pesando tipo ×3, líder ×2, lugar ×2 e energia −1,2
   por ponto de distância; dois ginásios nunca dividem a mesma faixa. */
const MARCAS_DO_TIPO = {
  'Pedra':['solido','firme','montanha'], 'Água':['agua','mar','tropical'], 'Elétrico':['eletrico','tecnologico','rapido'],
  'Grama':['natureza','tranquilo','flor'], 'Venenoso':['veneno','sombrio','furtivo'], 'Psíquico':['misterioso','tenso','frio'],
  'Fogo':['quente','vulcao','festivo'], 'variado':['epico','final','rival']
};
const MARCAS_DO_LIDER = {
  pewter:['firme','classico','serio'], cerulean:['energica','jovem','alegre'], vermilion:['militar','barulhento','maquinario'],
  celadon:['tranquilo','tradicional','elegante'], fuchsia:['furtivo','sombrio','tradicional'], saffron:['frio','misterioso','dramatico'],
  cinnabar:['excentrico','festivo','classico'], viridian:['arrogante','rival','grandioso']
};
const MARCAS_DO_LUGAR = {
  pewter:['montanha','solido','nostalgia'], cerulean:['agua','sol'], vermilion:['maquinario','mar','metropole'],
  celadon:['cidade-grande','flor','elegante'], fuchsia:['natureza','furtivo'], saffron:['metropole','tenso'],
  cinnabar:['ilha','vulcao','quente'], viridian:['final','kanto','epico']
};
function energiaDoGinasio(g){ return Math.max(2, Math.min(5, 3 + Math.round((g.dificuldade || 0) / 2.5))); }
function notaDaFaixa(g, f){
  const m = new Set(f.marcas), conta = l => (l || []).filter(x => m.has(x)).length;
  return conta(MARCAS_DO_TIPO[g.tipo]) * 3 + conta(MARCAS_DO_LIDER[g.id]) * 2 + conta(MARCAS_DO_LUGAR[g.id]) * 2
       - Math.abs(f.energia - energiaDoGinasio(g)) * 1.2;
}
let _faixasDosGinasios = null;
function faixasDosGinasios(){
  if (_faixasDosGinasios) return _faixasDosGinasios;
  const gs = (typeof GINASIOS !== 'undefined') ? GINASIOS : [];
  const pares = [];
  gs.forEach(g => Object.entries(FAIXAS_SHOWDOWN).forEach(([nome, f]) => pares.push({g:g.id, nome, nota:notaDaFaixa(g, f)})));
  pares.sort((a, b) => b.nota - a.nota);
  const r = {}, usadas = new Set();
  for (const p of pares) if (!r[p.g] && !usadas.has(p.nome)){ r[p.g] = p.nome; usadas.add(p.nome); }
  return (_faixasDosGinasios = r);
}

const Som = {
  pref(){
    let p = null;
    try { p = JSON.parse(localStorage.getItem('jc-audio') || 'null'); } catch(e){}
    const velho = p && !p.v;
    p = Object.assign({}, AUDIO_PADRAO, p || {});
    /* preferência de antes das faixas do Showdown: quem estava no padrão
       (sintetizada) passa pro novo padrão; tema que sumiu volta pro padrão */
    if (velho && p.tema === 'sintetizada') p.tema = AUDIO_PADRAO.tema;
    if (!TEMAS_DE_MUSICA.some(t => t.id === p.tema)) p.tema = AUDIO_PADRAO.tema;
    p.v = AUDIO_PADRAO.v;
    /* quem desligou no botão antigo continua mudo */
    try { if (!localStorage.getItem('jc-audio') && localStorage.getItem('jc-som') === '0') p.mudo = true; } catch(e){}
    return p;
  },
  salvar(p){
    try { localStorage.setItem('jc-audio', JSON.stringify(p)); localStorage.setItem('jc-som', p.mudo ? '0' : '1'); } catch(e){}
    this.aplicarMusica(true);
  },
  ajustar(chave, valor){
    const p = this.pref();
    if (chave === 'mudo') p.mudo = !!valor;
    else if (chave === 'tema') p.tema = valor;
    else p[chave] = Math.max(0, Math.min(1, +valor));
    this.salvar(p);
  },
  /* volume efetivo de um canal, já com o geral e o mudo */
  volume(canal){
    const p = this.pref();
    if (p.mudo) return 0;
    return p.geral * (p[canal] == null ? 1 : p[canal]);
  },

  /* ---------- WebAudio ---------- */
  ctx(){
    if (this._ctx) return this._ctx;
    const AC = (typeof window !== 'undefined') && (window.AudioContext || window.webkitAudioContext);
    if (!AC) return null;
    try { this._ctx = new AC(); } catch(e){ return null; }
    return this._ctx;
  },
  /* navegador só deixa tocar depois do primeiro toque na página */
  destravar(){
    if (this._destravado) return;
    this._destravado = true;
    const c = this.ctx();
    if (c && c.state === 'suspended') c.resume().catch(() => {});
    this.aplicarMusica(true);
  },
  nota(freq, t, dur, tipo, vol, destino){
    const c = this.ctx(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = tipo || 'square'; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(destino || c.destination);
    o.start(t); o.stop(t + dur + 0.02);
    return o;
  },

  /* ---------- efeitos ---------- */
  EFEITOS: {
    /* abrir a Pokédex: dois bipes subindo */
    pokedex: (S, t, v) => { S.nota(880, t, .09, 'square', v * .5); S.nota(1320, t + .09, .12, 'square', v * .5); },
    /* varredura: um zumbido que sobe, e o bipe de leitura */
    scan: (S, t, v) => {
      const c = S.ctx(); const o = c.createOscillator(), g = c.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(1800, t + .7);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v * .18, t + .05); g.gain.exponentialRampToValueAtTime(0.0001, t + .75);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + .8);
      S.nota(1568, t + .8, .1, 'square', v * .45); S.nota(2093, t + .92, .14, 'square', v * .45);
    },
    /* arremesso: um vento que passa */
    arremesso: (S, t, v) => {
      const c = S.ctx(); const n = Math.floor(c.sampleRate * .35);
      const buf = c.createBuffer(1, n, c.sampleRate), dados = buf.getChannelData(0);
      for (let i = 0; i < n; i++) dados[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      src.buffer = buf; f.type = 'bandpass'; f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(2400, t + .3);
      g.gain.setValueAtTime(v * .55, t);
      src.connect(f); f.connect(g); g.connect(c.destination); src.start(t);
    },
    /* a bola abrindo: um estalo */
    abrir: (S, t, v) => { S.nota(220, t, .06, 'square', v * .5); S.nota(660, t + .03, .09, 'triangle', v * .4); },
    /* capturou: o clique */
    clique: (S, t, v) => { S.nota(1200, t, .04, 'square', v * .6); S.nota(600, t + .05, .08, 'square', v * .4); },
    /* usar item: um brilho de três notas */
    item: (S, t, v) => { [988, 1319, 1976].forEach((f, i) => S.nota(f, t + i * .07, .16, 'triangle', v * .4)); },
    /* o toque de qualquer botão: curto e baixo, pra não cansar */
    toque: (S, t, v) => { S.nota(1046, t, .035, 'square', v * .16); S.nota(1568, t + .028, .045, 'triangle', v * .14); },
    /* comprar: moedinha */
    compra: (S, t, v) => { S.nota(988, t, .07, 'square', v * .4); S.nota(1319, t + .07, .2, 'square', v * .4); }
  },
  efeito(nome){
    try {
      const v = this.volume('efeitos');
      if (!v || !this.EFEITOS[nome]) return;
      const c = this.ctx(); if (!c) return;
      if (c.state === 'suspended') c.resume().catch(() => {});
      this.EFEITOS[nome](this, c.currentTime + 0.01, v);
    } catch(e){ /* sem áudio: segue calado */ }
  },

  /* ---------- trilha ---------- */
  /* o tipo de luta escolhe a faixa (e o ginásio entra na chave, pra
     trocar de faixa de um ginásio pro outro) */
  tipoDeLuta(){
    const J = (typeof Jogo !== 'undefined') ? Jogo : {};
    if (J.eliteAtual || J.torneioAtual || J.conferenciaAtual) return 'elite';
    if (J.ginasioAtual) return 'lider:' + J.ginasioAtual.id;
    if (J.rivalAtual) return 'rival';
    if (J.revancheAtual && J.revancheAtual.ginasio) return 'lider:' + J.revancheAtual.ginasio;
    if (typeof Batalha !== 'undefined' && Batalha.tipo === 'selvagem') return 'selvagem';
    return 'treinador';
  },
  contexto(){
    if (typeof emLuta === 'function' && emLuta()) return 'batalha:' + this.tipoDeLuta();
    try {
      const L = Mundo.atual();
      if (!L) return 'rota';
      if (L.ambiente === 'caverna') return 'caverna';
      if (L.tipo === 'cidade') return 'cidade';
    } catch(e){}
    return 'rota';
  },
  /* chamada a cada tela: troca a trilha só quando o contexto muda */
  aplicarMusica(forcar){
    if (typeof document === 'undefined' || !this._destravado) return;
    const p = this.pref(), vol = this.volume('musica');
    const ctx = this.contexto();
    const chave = `${p.tema}:${ctx}`;
    if (!forcar && chave === this._tocando){ this.volumeMusica(vol); return; }
    this.pararMusica();
    this._tocando = chave;
    this.semArquivo = null;
    /* tentativa de arquivo é assíncrona: o erro de uma trilha velha não
       pode ligar a sintetizada por cima da trilha nova */
    const geracao = this._geracao = (this._geracao || 0) + 1;
    const vale = f => (...a) => { if (geracao === this._geracao) f(...a); };
    if (!vol || p.tema === 'nenhuma') return;
    const tema = TEMAS_DE_MUSICA.find(t => t.id === p.tema);
    const [base, sub] = ctx.split(':');   /* 'batalha:lider:pewter' → sub 'lider' */
    const sintetizada = vale(() => this.tocarSintetizada(base, vol));
    if (!tema || p.tema === 'sintetizada') return sintetizada();
    /* luta: a faixa do Showdown do tipo de luta; sem ela, o arquivo da pasta */
    const daPasta = vale(() => tema.pasta ? this.tocarArquivo(tema.pasta, base, vol, sintetizada, geracao) : sintetizada());
    /* ginásio: a faixa que mais parece com ele, seja qual for o tema */
    const gin = sub === 'lider' ? this.ginasioDaLuta() : null;
    const faixa = gin && tema.luta ? faixasDosGinasios()[gin] : (tema.luta && tema.luta[sub]);
    if (base === 'batalha' && faixa)
      return this.tocarUrl(`sons/musica/showdown/${faixa}.mp3`, vol, daPasta, geracao, FAIXAS_SHOWDOWN[faixa]);
    daPasta();
  },
  ginasioDaLuta(){
    const J = (typeof Jogo !== 'undefined') ? Jogo : {};
    return (J.ginasioAtual && J.ginasioAtual.id) || (J.revancheAtual && J.revancheAtual.ginasio) || null;
  },
  tocarUrl(url, vol, senao, geracao, info){
    const a = new Audio(url);
    a.loop = true; a.volume = Math.min(1, vol);
    /* volta no ponto de laço do Showdown, não no começo do arquivo */
    if (info && info.laco){
      const [ini, fim] = info.laco.map(x => x / 1000);
      const vigia = setInterval(() => {
        if (geracao !== this._geracao || this._audio !== a){ clearInterval(vigia); return; }
        if (a.currentTime >= fim) a.currentTime = ini + (a.currentTime - fim);
      }, 40);
    }
    a.onerror = () => { if (geracao !== this._geracao) return; if (this._audio === a) this._audio = null; this.semArquivo = url; senao(); };
    this._audio = a;
    const r = a.play(); if (r && r.catch) r.catch(() => {});
  },
  volumeMusica(vol){
    if (this._audio) this._audio.volume = Math.min(1, vol);
    if (this._ganho) this._ganho.gain.value = vol * (this._seq && this._calma ? .32 : .12);
  },
  pararMusica(){
    this._geracao = (this._geracao || 0) + 1;
    if (this._audio){ try { this._audio.pause(); } catch(e){} this._audio = null; }
    if (this._seq){ clearInterval(this._seq); this._seq = null; }
    if (this._ganho){ try { this._ganho.disconnect(); } catch(e){} this._ganho = null; }
  },
  tocarArquivo(pasta, ctx, vol, senao, geracao){
    const exts = ['ogg', 'mp3', 'm4a'];
    const tenta = i => {
      if (geracao != null && geracao !== this._geracao) return;
      if (i >= exts.length){ this.semArquivo = `${pasta}/${ctx}`; return senao(); }
      const a = new Audio(`sons/musica/${pasta}/${ctx}.${exts[i]}`);
      a.loop = true; a.volume = Math.min(1, vol);
      a.onerror = () => { if (this._audio === a) this._audio = null; tenta(i + 1); };
      this._audio = a;
      const r = a.play(); if (r && r.catch) r.catch(() => {});
    };
    tenta(0);
  },
  /* Chip de quatro compassos por contexto: baixo, arpejo e um sino. */
  TRILHAS: {
    batalha:{bpm:150, acordes:[[57,60,64],[55,59,62],[53,57,60],[52,56,59]], onda:'square'},
    rota:   {bpm:112, acordes:[[60,64,67],[57,60,64],[65,69,72],[67,71,74]], onda:'triangle'},
    cidade: {bpm:96,  acordes:[[62,65,69],[60,64,67],[58,62,65],[60,64,67]], onda:'triangle'},
    caverna:{bpm:72,  acordes:[[57,60,64],[56,59,62],[57,60,63],[52,55,59]], onda:'sine'}
  },
  /* ---------- trilha calma de exploração ----------
     Composição própria, no clima das cidades pequenas e tranquilas dos
     jogos (Verdanturf, Pallet): flauta macia com vibrato, dedilhado em
     arpejo, um colchão de acordes e eco leve. Cada lugar tem a sua:
     cidade em 3/4 e Fá maior, rota em 4/4 e Sol maior, caverna em Lá
     menor, espaçada, com gota d'água. melodia: [midi, tempos] (null é
     pausa); acordes: um por compasso. */
  CALMAS: {
    cidade:{bpm:84, compasso:3,
      acordes:[[53,57,60],[50,53,57],[46,50,53],[48,52,55],[53,57,60],[45,48,52],[46,50,53],[48,52,55],
               [50,53,57],[46,50,53],[53,57,60],[48,52,55],[46,50,53],[48,52,55],[53,57,60],[53,57,60]],
      melodia:[[69,1.5],[67,.5],[65,1], [74,2],[72,1], [70,1],[72,1],[74,1], [72,3],
               [69,1.5],[70,.5],[72,1], [76,2],[72,1], [74,1],[72,.5],[70,.5],[69,1], [67,3],
               [77,1.5],[76,.5],[74,1], [74,1],[72,2], [69,1],[72,1],[77,1], [76,2],[67,1],
               [74,1.5],[72,.5],[70,1], [69,1],[67,1],[64,1], [65,3], [null,3]]},
    rota:{bpm:96, compasso:4,
      acordes:[[55,59,62],[52,55,59],[48,52,55],[50,54,57],[55,59,62],[47,50,54],[48,52,55],[50,54,57],
               [52,55,59],[48,52,55],[55,59,62],[50,54,57],[48,52,55],[50,54,57],[55,59,62],[55,59,62]],
      melodia:[[71,1],[74,1],[79,2], [76,1.5],[74,.5],[71,2], [72,1],[76,1],[79,1],[76,1], [74,3],[null,1],
               [71,1],[69,.5],[71,.5],[74,2], [78,2],[74,2], [76,1],[74,1],[72,1],[71,1], [69,4],
               [79,1.5],[78,.5],[76,2], [76,1],[74,1],[72,2], [71,1],[74,1],[79,1],[71,1], [69,2],[66,2],
               [76,1.5],[74,.5],[72,2], [74,1],[76,1],[78,2], [79,3],[null,1], [null,4]]},
    caverna:{bpm:66, compasso:4, gotas:true, menor:true,
      acordes:[[45,48,52],[41,45,48],[43,47,50],[40,43,47],[45,48,52],[38,41,45],[40,44,47],[40,44,47]],
      melodia:[[76,2],[null,2], [72,2],[69,2], [71,3],[null,1], [67,4],
               [69,2],[72,2], [74,1.5],[72,.5],[69,2], [71,2],[68,2], [null,4]]}
  },
  tocarCalma(ctx, vol){
    const c = this.ctx(); if (!c) return;
    const P = this.CALMAS[ctx] || this.CALMAS.rota;
    const hz = m => 440 * Math.pow(2, (m - 69) / 12);
    /* saída: volume → filtro morno → seco + eco */
    const g = c.createGain(); g.gain.value = vol * .32;
    const filtro = c.createBiquadFilter(); filtro.type = 'lowpass'; filtro.frequency.value = P.menor ? 2200 : 3400;
    const eco = c.createDelay(1); eco.delayTime.value = P.menor ? .48 : .34;
    const volta = c.createGain(); volta.gain.value = P.menor ? .42 : .26;
    const molhado = c.createGain(); molhado.gain.value = P.menor ? .5 : .22;
    g.connect(filtro); filtro.connect(c.destination);
    filtro.connect(eco); eco.connect(volta); volta.connect(eco); eco.connect(molhado); molhado.connect(c.destination);
    this._ganho = g; this._calma = true;
    const envelope = (no, t, at, dur, rel, pico) => {
      const e = c.createGain(); e.gain.setValueAtTime(0.0001, t);
      e.gain.linearRampToValueAtTime(pico, t + at);
      e.gain.setValueAtTime(pico, t + Math.max(at, dur));
      e.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(at, dur) + rel);
      no.connect(e); e.connect(g); return e;
    };
    const flauta = (m, t, dur) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = hz(m);
      const vib = c.createOscillator(), prof = c.createGain();
      vib.frequency.value = 5; prof.gain.setValueAtTime(0, t); prof.gain.linearRampToValueAtTime(hz(m) * .004, t + .35);
      vib.connect(prof); prof.connect(o.frequency);
      const o2 = c.createOscillator(); o2.type = 'triangle'; o2.frequency.value = hz(m);
      const mistura = c.createGain(); mistura.gain.value = .35; o2.connect(mistura);
      envelope(o, t, .07, dur * .92, .35, .5); envelope(mistura, t, .07, dur * .92, .35, .5);
      [o, o2, vib].forEach(x => { x.start(t); x.stop(t + dur + .5); });
    };
    const dedilhado = (m, t) => {
      const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = hz(m);
      envelope(o, t, .006, .02, .9, .2); o.start(t); o.stop(t + 1);
    };
    const colchao = (ac, t, dur) => ac.forEach(m => [-4, 4].forEach(cents => {
      const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = hz(m); o.detune.value = cents;
      envelope(o, t, .5, dur - .4, .8, .045); o.start(t); o.stop(t + dur + 1);
    }));
    const baixo = (m, t, dur) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = hz(m - 12);
      envelope(o, t, .04, dur * .8, .4, .32); o.start(t); o.stop(t + dur + .5);
    };
    const gota = t => {
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(1800 + Math.random() * 900, t); o.frequency.exponentialRampToValueAtTime(700, t + .12);
      envelope(o, t, .003, .01, .25, .07); o.start(t); o.stop(t + .4);
    };
    /* a partitura em segundos, uma volta inteira */
    const tempo = 60 / P.bpm, porCompasso = P.compasso * tempo;
    const volta_s = P.acordes.length * porCompasso;
    const eventos = [];
    P.acordes.forEach((ac, i) => {
      const t0 = i * porCompasso;
      eventos.push({t:t0, f:t => { colchao(ac, t, porCompasso); baixo(ac[0], t, porCompasso * .9); }});
      /* arpejo em colcheias: tônica, quinta, terça em cima, quinta... */
      const arp = [ac[0] + 12, ac[2] + 12, ac[1] + 24, ac[2] + 12];
      const passos = P.compasso * 2;
      if (!P.menor) for (let k = 0; k < passos; k++) eventos.push({t:t0 + k * tempo / 2, f:t => dedilhado(arp[k % arp.length], t)});
      else for (let k = 0; k < P.compasso; k += 2) eventos.push({t:t0 + k * tempo, f:t => dedilhado(arp[k % arp.length], t)});
    });
    let at = 0;
    P.melodia.forEach(([m, d]) => { const dur = d * tempo; if (m != null) eventos.push({t:at, f:t => flauta(m, t, dur)}); at += dur; });
    if (P.gotas) for (let k = 0; k < 6; k++){ const tg = Math.random() * volta_s; eventos.push({t:tg, f:gota}); }
    eventos.sort((a, b) => a.t - b.t);
    let inicio = c.currentTime + .15, i = 0;
    const agendar = () => {
      while (true){
        if (i >= eventos.length){ i = 0; inicio += volta_s; }
        const t = inicio + eventos[i].t;
        if (t > c.currentTime + .6) break;
        if (t >= c.currentTime - .05) eventos[i].f(t);
        i++;
      }
    };
    agendar();
    this._seq = setInterval(agendar, 150);
  },
  tocarSintetizada(ctx, vol){
    const c = this.ctx(); if (!c) return;
    /* fora da luta, a trilha é a calma */
    if (ctx !== 'batalha') return this.tocarCalma(ctx, vol);
    const tr = this.TRILHAS[ctx] || this.TRILHAS.rota;
    const g = c.createGain(); g.gain.value = vol * .12; g.connect(c.destination);
    this._ganho = g; this._calma = false;
    const hz = m => 440 * Math.pow(2, (m - 69) / 12);
    const passo = 60 / tr.bpm / 2;          /* colcheia */
    let proximo = c.currentTime + .1, k = 0;
    const agendar = () => {
      while (proximo < c.currentTime + .4){
        const ac = tr.acordes[Math.floor(k / 8) % tr.acordes.length];
        if (k % 8 === 0) this.nota(hz(ac[0] - 12), proximo, passo * 3.5, 'triangle', .9, g);
        this.nota(hz(ac[k % 3] + (k % 8 >= 4 ? 12 : 0)), proximo, passo * .9, tr.onda, .45, g);
        if (k % 16 === 6) this.nota(hz(ac[2] + 24), proximo, passo * 2, 'sine', .25, g);
        proximo += passo; k++;
      }
    };
    agendar();
    this._seq = setInterval(agendar, 120);
  }
};

if (typeof document !== 'undefined' && document.addEventListener){
  /* o toque de cada opção: qualquer botão, escolha, porta e aba */
  document.addEventListener('click', e => {
    const el = e.target && e.target.closest && e.target.closest('button, .escolha, .porta, .aba, [role="radio"], .item-linha');
    if (!el || el.disabled || el.dataset.semToque !== undefined) return;
    Som.efeito('toque');
  }, true);
  const abre = () => Som.destravar();
  document.addEventListener('pointerdown', abre, {once:true});
  document.addEventListener('keydown', abre, {once:true});
  /* janela fora de foco: a trilha para, como o relógio */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) Som.pararMusica(), Som._tocando = null;
    else Som.aplicarMusica(true);
  });
}
