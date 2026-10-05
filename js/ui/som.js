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
const CONTEXTOS_DE_MUSICA = ['batalha', 'rota', 'cidade', 'caverna', 'torre', 'esconderijo'];

/* ---------- a equipe vilã ----------
   Os remanescentes da Rocket: a operação dentro do Monte da Lua
   (capítulo 5) e o depósito e os fundos do cassino de Celadon
   (capítulo 9). Nessas cenas toca o esconderijo; nas lutas contra eles,
   faixa radical — o punk de Black 2/White 2 na mina, o groove de vilão
   de Colosseum no cassino. */
const CENAS_DO_ESCONDERIJO = {
  5: /^c5_(entrou_com_imprensa|papeis_mesa|guardou_folha|mostrou_folha|o_que_e|filmou_papel|gaiolas_imprensa|saida_secreta|filmou_tunel|a_camera|guardou_saida|camara_vazia|entrada|cortou_cabo|escondeu|saiu_correndo|desvio|escutou_passarela|passarela_frente|levou_pasta|escondeu_pasta|fuga_tunel|cabo|observou_camara|camara|de_quem_e|nome_do_terno|acabar_hoje|onde_ficam|ataque|venceu|ficou_ate_o_fim|carregou_tres|perdeu|proposta|aceitou|planilha|traicao|duplo)$/,
  9: /^c9_(cassino_por_baixo|olhou_o_leilao|fotografou_leilao|entrou_no_leilao|achou_deposito|quem_terceira|terceira_sim|proposta_terceira|deposito|verdade_no_armazem|corrida_gaiolas|luta_deposito|venceu_deposito|perdeu_deposito|blefe_[a-z]+)$/
};
const FAIXA_DO_VILAO = {5:'bw2-homika-dogars', 9:'colosseum-miror-b'};
/* lutas contra eles fora do esconderijo */
const LUTAS_DO_VILAO = {'5:c5_luta_trio':'bw2-homika-dogars', '5:c5_ataque':'bw2-homika-dogars', '9:c9_luta_deposito':'colosseum-miror-b'};

/* ---------- um rival, uma faixa ----------
   Ezra (o de casa): o tema do rival de Black/White, o da amizade que vira
   disputa — e o de X/Y quando ele virou parceiro. Lior, que largou a
   pedreira: o do rival de Hoenn, o de quem treina na raça. Nolan, do
   cais: o de Alola, o garoto do mar que ri de tudo. Rory, de Fuchsia, que
   voltou a treinar por causa de um Rapidash: o de Hugh, que também luta
   por um Pokémon que não é só dele. Otto, o caçador: o de Sinnoh, rápido e na espreita. */
const FAIXA_DO_RIVAL = {ezra:'bw-rival', ezra_parceiro:'xy-rival', nilo:'oras-rival', tunico:'sm-rival', fuchsia:'bw2-rival', vasco:'dpp-rival'};

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
    const d = (typeof Estado !== 'undefined' && Estado.dados) || {};
    /* a equipe vilã: luta marcada ou qualquer luta dentro do esconderijo */
    const chave = `${d.capitulo}:${d.cena}`;
    if (J.cenaBatalha && LUTAS_DO_VILAO[chave]) return 'faixa:' + LUTAS_DO_VILAO[chave];
    if (J.cenaBatalha && this.noEsconderijo()) return 'faixa:' + FAIXA_DO_VILAO[d.capitulo];
    /* rival: o extra pelo id, o de casa pelo arco */
    if (J.rivalAtual){
      if (J.rivalAtual.extra && FAIXA_DO_RIVAL[J.rivalAtual.extra]) return 'faixa:' + FAIXA_DO_RIVAL[J.rivalAtual.extra];
      return 'faixa:' + (J.rivalAtual.arco === 'parceiro' ? FAIXA_DO_RIVAL.ezra_parceiro : FAIXA_DO_RIVAL.ezra);
    }
    if (typeof Batalha !== 'undefined' && Batalha.treinador){
      const t = String(Batalha.treinador);
      if (/\bEzra\b/.test(t)) return 'faixa:' + FAIXA_DO_RIVAL.ezra;
      if (/\bLior\b/.test(t)) return 'faixa:' + FAIXA_DO_RIVAL.nilo;
      if (/\bNolan\b/.test(t)) return 'faixa:' + FAIXA_DO_RIVAL.tunico;
    }
    if (J.eliteAtual || J.torneioAtual || J.conferenciaAtual) return 'elite';
    if (J.ginasioAtual) return 'lider:' + J.ginasioAtual.id;
    if (J.rivalAtual) return 'rival';
    if (J.revancheAtual && J.revancheAtual.ginasio) return 'lider:' + J.revancheAtual.ginasio;
    if (typeof Batalha !== 'undefined' && Batalha.tipo === 'selvagem') return 'selvagem';
    return 'treinador';
  },
  noEsconderijo(){
    const d = (typeof Estado !== 'undefined' && Estado.dados) || {};
    const re = CENAS_DO_ESCONDERIJO[d.capitulo];
    return !!(re && d.modo === 'cena' && d.cena && re.test(d.cena));
  },
  contexto(){
    if (typeof emLuta === 'function' && emLuta()) return 'batalha:' + this.tipoDeLuta();
    const d = (typeof Estado !== 'undefined' && Estado.dados) || {};
    if (this.noEsconderijo()) return 'esconderijo';
    try {
      /* cena de capítulo vale pelo ambiente do capítulo; mapa, pelo lugar */
      const cap = d.modo === 'cena' && typeof Historia !== 'undefined' ? Historia.capAtual : null;
      const L = Mundo.atual();
      const amb = (cap && cap.ambiente) || (L && L.ambiente);
      if (amb === 'cemiterio') return 'torre';
      if (amb === 'caverna') return 'caverna';
      if (L && L.tipo === 'cidade' && !(cap && cap.ambiente && cap.ambiente !== L.ambiente)) return 'cidade';
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
    const [base, sub, resto] = ctx.split(':');   /* 'batalha:lider:pewter' → sub 'lider'; 'batalha:faixa:bw-rival' */
    const sintetizada = vale(() => this.tocarSintetizada(base, vol));
    if (!tema || p.tema === 'sintetizada') return sintetizada();
    /* luta: a faixa do Showdown do tipo de luta; sem ela, o arquivo da pasta */
    const daPasta = vale(() => tema.pasta ? this.tocarArquivo(tema.pasta, base, vol, sintetizada, geracao) : sintetizada());
    /* ginásio: a faixa que mais parece com ele, seja qual for o tema */
    const gin = sub === 'lider' ? (resto || this.ginasioDaLuta()) : null;
    const faixa = !tema.luta ? null
                : sub === 'faixa' ? resto
                : gin ? faixasDosGinasios()[gin] : tema.luta[sub];
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
    if (this._ganho) this._ganho.gain.value = vol * (this._calma ? (this._k || .32) : .12);
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
    /* a Torre: caixinha de música desafinando num salão grande — Dó
       menor, a quarta aumentada no meio da frase, o acorde napolitano,
       tremor no colchão e um sussurro de vez em quando */
    torre:{bpm:56, compasso:4, menor:true, assombrado:true,
      acordes:[[48,51,55],[44,48,51],[41,44,48],[43,47,50],[48,51,55],[49,53,56],[44,48,51],[43,47,50]],
      melodia:[[79,1],[78,1],[75,2], [75,1],[74,1],[72,2], [77,1.5],[80,.5],[79,2], [78,3],[null,1],
               [72,1],[73,1],[77,2], [80,1],[79,1],[75,2], [74,1],[71,1],[68,2], [67,3],[null,1]]}
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
    this._ganho = g; this._calma = true; this._k = .32;
    const envelope = (no, t, at, dur, rel, pico) => {
      const e = c.createGain(); e.gain.setValueAtTime(0.0001, t);
      e.gain.linearRampToValueAtTime(pico, t + at);
      e.gain.setValueAtTime(pico, t + Math.max(at, dur));
      e.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(at, dur) + rel);
      no.connect(e); e.connect(g); return e;
    };
    const flauta = (m, t, dur) => {
      if (P.assombrado){
        /* caixinha de música: ataque seco, cai rápido, um fio desafinado */
        [0, 1200].forEach((ct, j) => {
          const o = c.createOscillator(); o.type = j ? 'sine' : 'triangle'; o.frequency.value = hz(m); o.detune.value = ct + (Math.random() * 14 - 7);
          envelope(o, t, .004, .05, Math.min(2.2, dur + .8), j ? .08 : .3); o.start(t); o.stop(t + dur + 2.5);
        });
        return;
      }
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
      const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = hz(m); o.detune.value = cents * (P.assombrado ? 4 : 1);
      const e = envelope(o, t, .5, dur - .4, .8, P.assombrado ? .06 : .045);
      if (P.assombrado){
        /* tremor: o volume do colchão treme devagar */
        const lfo = c.createOscillator(), prof = c.createGain();
        lfo.frequency.value = 3.2; prof.gain.value = .03; lfo.connect(prof); prof.connect(e.gain);
        lfo.start(t); lfo.stop(t + dur + 1);
      }
      o.start(t); o.stop(t + dur + 1);
    }));
    const sussurro = t => {
      const n = Math.floor(c.sampleRate * 1.6), buf = c.createBuffer(1, n, c.sampleRate), dd = buf.getChannelData(0);
      for (let k = 0; k < n; k++) dd[k] = (Math.random() * 2 - 1) * Math.sin(Math.PI * k / n);
      const src = c.createBufferSource(), f = c.createBiquadFilter();
      src.buffer = buf; f.type = 'bandpass'; f.Q.value = 6;
      f.frequency.setValueAtTime(700 + Math.random() * 500, t); f.frequency.linearRampToValueAtTime(1400 + Math.random() * 600, t + 1.6);
      src.connect(f); envelope(f, t, .6, .5, .6, .09); src.start(t);
    };
    const baixo = (m, t, dur) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = hz(m - 12);
      envelope(o, t, .04, dur * .8, .4, .32); o.start(t); o.stop(t + dur + .5);
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
    if (P.assombrado) for (let k = 0; k < 2; k++){ const tg = (k + .3 + Math.random() * .5) * volta_s / 2; eventos.push({t:tg, f:sussurro}); }
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
  /* saída comum: volume → filtro → seco + eco; devolve o ganho */
  saida(vol, k, corte, atraso, retorno, molhar){
    const c = this.ctx();
    const g = c.createGain(); g.gain.value = vol * k;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = corte;
    const eco = c.createDelay(2); eco.delayTime.value = atraso;
    const volta = c.createGain(); volta.gain.value = retorno;
    const mol = c.createGain(); mol.gain.value = molhar;
    g.connect(f); f.connect(c.destination); f.connect(eco); eco.connect(volta); volta.connect(eco); eco.connect(mol); mol.connect(c.destination);
    this._ganho = g; this._calma = true; this._k = k;
    return g;
  },
  /* ---------- caverna: quase silêncio ----------
     Um grave que quase não se ouve, gota caindo sem hora marcada, cada
     uma num tom, eco comprido — e de vez em quando alguma coisa lá no
     fundo: um ronco, um tom que sobe e some. Não tem melodia: é o lugar. */
  tocarCaverna(vol){
    const c = this.ctx();
    const g = this.saida(vol, .5, 1800, .62, .5, .55);
    const env = (no, t, at, dur, rel, pico) => {
      const e = c.createGain(); e.gain.setValueAtTime(0.0001, t);
      e.gain.linearRampToValueAtTime(pico, t + at); e.gain.setValueAtTime(pico, t + at + dur);
      e.gain.exponentialRampToValueAtTime(0.0001, t + at + dur + rel); no.connect(e); e.connect(g); return e;
    };
    const drone = t => [55, 82.4].forEach((f, j) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = j ? 6 : 0;
      env(o, t, 6, 6, 6, j ? .05 : .09); o.start(t); o.stop(t + 19);
    });
    const gota = t => {
      const o = c.createOscillator(); o.type = 'sine';
      const alto = 1100 + Math.random() * 1500;
      o.frequency.setValueAtTime(alto, t); o.frequency.exponentialRampToValueAtTime(alto * .45, t + .09);
      env(o, t, .002, .01, .18, .05 + Math.random() * .05); o.start(t); o.stop(t + .4);
    };
    const coisa = t => {
      if (Math.random() < .5){
        /* ronco: ruído grave filtrado, longe */
        const n = Math.floor(c.sampleRate * 3), buf = c.createBuffer(1, n, c.sampleRate), dd = buf.getChannelData(0);
        for (let k = 0; k < n; k++) dd[k] = Math.random() * 2 - 1;
        const src = c.createBufferSource(), f = c.createBiquadFilter(); src.buffer = buf; f.type = 'lowpass'; f.frequency.value = 120;
        src.connect(f); env(f, t, 1.2, .6, 1.2, .35); src.start(t);
      } else {
        /* um tom que sobe devagar, desafinado, e some no eco */
        const o = c.createOscillator(); o.type = 'triangle';
        const base = 180 + Math.random() * 120;
        o.frequency.setValueAtTime(base, t); o.frequency.linearRampToValueAtTime(base * 1.41, t + 2.5);
        env(o, t, 1, 1, 1.5, .035); o.start(t); o.stop(t + 4);
      }
    };
    let proxDrone = c.currentTime + .2, proxGota = c.currentTime + .8, proxCoisa = c.currentTime + 12 + Math.random() * 10;
    const agendar = () => {
      const lim = c.currentTime + .8;
      while (proxDrone < lim){ drone(proxDrone); proxDrone += 12; }
      while (proxGota < lim){
        gota(proxGota);
        /* às vezes duas seguidas, como quem pinga do mesmo lugar */
        if (Math.random() < .25) gota(proxGota + .35 + Math.random() * .2);
        proxGota += .9 + Math.random() * 3.2;
      }
      while (proxCoisa < lim){ coisa(proxCoisa); proxCoisa += 18 + Math.random() * 20; }
    };
    agendar();
    this._seq = setInterval(agendar, 200);
  },
  /* ---------- esconderijo: radical ----------
     Lá frígio, 132 batidas: bumbo em todo tempo, chimbal no contratempo,
     baixo serrote em colcheias pulando de oitava, acorde sujo no 2 e no
     4 e um riff de quatro compassos por cima. Sem eco: é sala fechada. */
  tocarEsconderijo(vol){
    const c = this.ctx();
    const g = this.saida(vol, .3, 5200, .15, .12, .08);
    const hz = m => 440 * Math.pow(2, (m - 69) / 12);
    const env = (no, t, at, dur, rel, pico) => {
      const e = c.createGain(); e.gain.setValueAtTime(0.0001, t);
      e.gain.linearRampToValueAtTime(pico, t + at); e.gain.setValueAtTime(pico, t + at + dur);
      e.gain.exponentialRampToValueAtTime(0.0001, t + at + dur + rel); no.connect(e); e.connect(g); return e;
    };
    const ruido = (() => { const n = c.sampleRate, b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let k = 0; k < n; k++) d[k] = Math.random() * 2 - 1; return b; })();
    const bumbo = t => { const o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + .12); env(o, t, .002, .02, .16, .9); o.start(t); o.stop(t + .3); };
    const chimbal = (t, forte) => { const s = c.createBufferSource(), f = c.createBiquadFilter(); s.buffer = ruido; f.type = 'highpass'; f.frequency.value = 7000; s.connect(f); env(f, t, .001, .005, forte ? .09 : .04, forte ? .22 : .14); s.start(t, Math.random() * .5, .2); };
    const caixa = t => { const s = c.createBufferSource(), f = c.createBiquadFilter(); s.buffer = ruido; f.type = 'bandpass'; f.frequency.value = 1800; s.connect(f); env(f, t, .001, .01, .12, .45); s.start(t, Math.random() * .5, .25); };
    const baixo = (m, t, d) => { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(m); env(o, t, .004, d * .6, .05, .32); o.start(t); o.stop(t + d + .1); };
    const acorde = (ms, t) => ms.forEach(m => { const o = c.createOscillator(); o.type = 'square'; o.frequency.value = hz(m); o.detune.value = Math.random() * 10 - 5; env(o, t, .003, .06, .12, .07); o.start(t); o.stop(t + .3); });
    const lider = (m, t, d) => { const o = c.createOscillator(); o.type = 'square'; o.frequency.value = hz(m); env(o, t, .005, d * .8, .06, .13); o.start(t); o.stop(t + d + .1); };
    const tempo = 60 / 132, col = tempo / 2;
    const raizes = [45, 46, 45, 43, 45, 46, 48, 40];         /* A Bb A G A Bb C E */
    const riff = [[81,1],[80,.5],[76,.5],[77,1],[76,1], [74,.5],[76,.5],[77,.5],[80,.5],[81,2],
                  [84,1],[82,.5],[81,.5],[77,1],[76,1], [74,1],[73,1],[76,2]];   /* quatro compassos */
    const eventos = [];
    raizes.forEach((r, i) => {
      const t0 = i * 4 * tempo;
      for (let k = 0; k < 4; k++){ eventos.push({t:t0 + k * tempo, f:bumbo}); if (k % 2) eventos.push({t:t0 + k * tempo, f:t => { caixa(t); acorde([r + 24, r + 27, r + 31], t); }}); }
      for (let k = 0; k < 8; k++){ eventos.push({t:t0 + k * col, f:t => baixo(r + (k % 4 === 2 ? 12 : 0), t, col)}); eventos.push({t:t0 + k * col + col / 2, f:t => chimbal(t, k % 2)}); }
    });
    /* o riff entra na segunda metade */
    let at = 4 * 4 * tempo; riff.forEach(([m, d]) => { const dur = d * tempo; eventos.push({t:at, f:t => lider(m, t, dur)}); at += dur; });
    eventos.sort((a, b) => a.t - b.t);
    const volta_s = raizes.length * 4 * tempo;
    let inicio = c.currentTime + .1, i = 0;
    const agendar = () => {
      while (true){
        if (i >= eventos.length){ i = 0; inicio += volta_s; }
        const t = inicio + eventos[i].t;
        if (t > c.currentTime + .5) break;
        if (t >= c.currentTime - .05) eventos[i].f(t);
        i++;
      }
    };
    agendar();
    this._seq = setInterval(agendar, 100);
  },
  tocarSintetizada(ctx, vol){
    const c = this.ctx(); if (!c) return;
    /* fora da luta: caverna é quase silêncio, esconderijo é radical,
       e o resto é a calma */
    if (ctx === 'caverna') return this.tocarCaverna(vol);
    if (ctx === 'esconderijo') return this.tocarEsconderijo(vol);
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
