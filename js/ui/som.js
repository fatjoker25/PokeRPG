/* ============================================================
   SOM — volumes, trilha e efeitos
   Preferência do aparelho, não da partida: vale pra todo save e mora
   no localStorage ('jc-audio').

   Quatro canais: geral (multiplica os outros), efeitos, gritos e
   música, e um mudo que cala tudo. Os efeitos (abrir a Pokédex, a
   varredura, o arremesso, usar item, comprar) são sintetizados na
   hora com WebAudio: não tem arquivo, então funcionam em file:// e no
   arquivo único.

   Trilha por tema. A música dos jogos não é nossa pra distribuir, e a
   PokeAPI não tem música — só sprite e grito. Então:
   - 'sintetizada': uma trilha curta de chip, gerada aqui, por contexto
     (luta, rota, cidade, caverna);
   - os outros temas leem arquivos que quem joga põe na pasta
     sons/musica/<tema>/ com os nomes batalha, rota, cidade e caverna
     (.ogg, .mp3 ou .m4a). Sem o arquivo, cai na sintetizada sem erro.
   ============================================================ */
const AUDIO_PADRAO = {geral:0.8, efeitos:0.7, gritos:0.8, musica:0.4, mudo:false, tema:'sintetizada'};
const TEMAS_DE_MUSICA = [
  {id:'nenhuma',     nome:'Sem música'},
  {id:'sintetizada', nome:'Sintetizada (chip)'},
  {id:'bw',          nome:'Black/White (arquivos locais)', pasta:'bw'},
  {id:'rby',         nome:'Red/Blue (arquivos locais)', pasta:'rby'},
  {id:'gsc',         nome:'Gold/Silver (arquivos locais)', pasta:'gsc'}
];
const CONTEXTOS_DE_MUSICA = ['batalha', 'rota', 'cidade', 'caverna'];

const Som = {
  pref(){
    let p = null;
    try { p = JSON.parse(localStorage.getItem('jc-audio') || 'null'); } catch(e){}
    p = Object.assign({}, AUDIO_PADRAO, p || {});
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
  contexto(){
    if (typeof emLuta === 'function' && emLuta()) return 'batalha';
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
    if (!vol || p.tema === 'nenhuma') return;
    const tema = TEMAS_DE_MUSICA.find(t => t.id === p.tema);
    if (tema && tema.pasta) return this.tocarArquivo(tema.pasta, ctx, vol, () => this.tocarSintetizada(ctx, vol));
    this.tocarSintetizada(ctx, vol);
  },
  volumeMusica(vol){
    if (this._audio) this._audio.volume = Math.min(1, vol);
    if (this._ganho) this._ganho.gain.value = vol * .12;
  },
  pararMusica(){
    if (this._audio){ try { this._audio.pause(); } catch(e){} this._audio = null; }
    if (this._seq){ clearInterval(this._seq); this._seq = null; }
    if (this._ganho){ try { this._ganho.disconnect(); } catch(e){} this._ganho = null; }
  },
  tocarArquivo(pasta, ctx, vol, senao){
    const exts = ['ogg', 'mp3', 'm4a'];
    const tenta = i => {
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
  tocarSintetizada(ctx, vol){
    const c = this.ctx(); if (!c) return;
    const tr = this.TRILHAS[ctx] || this.TRILHAS.rota;
    const g = c.createGain(); g.gain.value = vol * .12; g.connect(c.destination);
    this._ganho = g;
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
  const abre = () => Som.destravar();
  document.addEventListener('pointerdown', abre, {once:true});
  document.addEventListener('keydown', abre, {once:true});
  /* janela fora de foco: a trilha para, como o relógio */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) Som.pararMusica(), Som._tocando = null;
    else Som.aplicarMusica(true);
  });
}
