/* ============================================================
   ANIMADOR DE SPRITE — o Pokémon se mexendo na luta, como no DS
   Só o corpo do lutador: respirar, investir, conjurar, apanhar,
   desmaiar, entrar e voltar pra Pokébola. Efeito de golpe, partícula
   e texto moram em Efeitos e CenaShowdown; aqui não entra nenhum.

   Estados (um por lado, frente e costas independentes):
     IDLE             respira em loop (ou flutua, quem paira)
     ATTACK_PHYSICAL  avança acelerando, achata no impacto, volta freando
     ATTACK_SPECIAL   treme no lugar e pulsa escala e opacidade
     TAKE_DAMAGE      tremor horizontal que vai morrendo, piscando
     FAINT            afunda no chão e some
     ENTRY            desliza da lateral até a base e cresce
     RETREAT          encolhe e desliza até a Pokébola
     STAT_BOOST/DROP  sobe ou desce um pouco e volta

   Três regras que seguram isso junto com o resto da arena:
   - mexe só em `translate`, `scale` e `opacity`. O `transform` é da
     cena do Showdown e do tremor de golpe; as propriedades separadas
     se somam a ele em vez de brigar. E `filter` nunca: o estado do
     sprite (silhueta, brilho) mora em --fx-sprite;
   - todo movimento é interpolado aqui (lerp com curva) e entregue
     pronto pro Web Animations: roda fora do loop de desenho, e quem
     chama recebe uma Promise pra encaixar no turno encenado;
   - a escala gira em torno do pé (transform-origin 50% 76% no CSS,
     onde a arte de corpo inteiro termina), senão respirar seria o
     Pokémon flutuando acima da própria sombra.
   ============================================================ */
const ESTADOS_SPRITE = {
  IDLE:'IDLE', ATTACK_PHYSICAL:'ATTACK_PHYSICAL', ATTACK_SPECIAL:'ATTACK_SPECIAL',
  TAKE_DAMAGE:'TAKE_DAMAGE', FAINT:'FAINT', ENTRY:'ENTRY', RETREAT:'RETREAT',
  STAT_BOOST:'STAT_BOOST', STAT_DROP:'STAT_DROP', EVADE:'EVADE'
};

/* Quem paira no ar não respira de pé: sobe e desce. */
const PAIRA_NO_AR = new Set([12, 41, 42, 49, 81, 82, 92, 93, 109, 110, 169, 193, 200, 201]);

/* Sprites quadro a quadro (estilo Gen 5): por número de dex e vista.
   Vazio de propósito — a arte que o projeto embute é estática, e
   quem não tem quadro respira pela escala. Pra animar um, registre:
     AnimadorSprite.registrarQuadros(25, 'frente', {quadros:['a.png','b.png'], fps:12})
     AnimadorSprite.registrarQuadros(25, 'costas', {folha:'pikachu.png', n:8, fps:10})
   `quadros` é uma sequência de imagens; `folha` é uma tira horizontal
   de `n` quadros do mesmo tamanho. Caminho relativo a sprites_nds/.
   Brilhante tem os seus em `quadrosBrilhante` / `folhaBrilhante`; sem
   eles, o brilhante fica na arte estática (quadro normal num brilhante
   seria o jogo apagando a cor que ele tem). */
const QUADROS_SPRITE = {};

/* Curvas de interpolação: recebem t de 0 a 1 e devolvem o progresso. */
const CURVAS = {
  linear:    t => t,
  easeIn:    t => t * t * t,
  easeOut:   t => 1 - Math.pow(1 - t, 3),
  easeInOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutBack: t => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  seno:      t => (1 - Math.cos(t * Math.PI * 2)) / 2   /* 0 → 1 → 0: um ciclo de respiração */
};

const AnimadorSprite = {
  estado: {aliado:null, inimigo:null},
  _loops: {aliado:null, inimigo:null},
  _quadros: new Map(),          /* elemento → tocador de quadros */
  _raf: 0,

  reduzido(){ return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); },
  sprite(lado){ return (typeof Efeitos !== 'undefined') ? Efeitos.sprite(lado) : null; },
  vista(lado){ return lado === 'aliado' ? 'costas' : 'frente'; },
  pokemon(lado){
    if (typeof Batalha === 'undefined') return null;
    const p = lado === 'aliado' ? Batalha.aliado : Batalha.inimigo;
    return p ? Object.assign({}, p, p.transformadoEm ? {dex:p.transformadoEm} : {}) : null;
  },

  /* ---------- interpolação ----------
     `de` e `para` têm qualquer um de x, y (px), sx, sy (escala) e a
     (opacidade). O caminho é amostrado com a curva — o lerp acontece
     aqui — e o navegador só liga os pontos, em linha. */
  lerp(a, b, t){ return a + (b - a) * t; },
  quadro(v){
    const q = {};
    if (v.x !== undefined || v.y !== undefined) q.translate = `${(v.x || 0).toFixed(2)}px ${(v.y || 0).toFixed(2)}px`;
    if (v.sx !== undefined || v.sy !== undefined) q.scale = `${(v.sx ?? 1).toFixed(4)} ${(v.sy ?? 1).toFixed(4)}`;
    if (v.a !== undefined) q.opacity = v.a.toFixed(3);
    if (v.clip !== undefined) q.clipPath = `inset(0 0 ${v.clip.toFixed(1)}px 0)`;
    return q;
  },
  caminho(de, para, curva, passos){
    const f = typeof curva === 'function' ? curva : (CURVAS[curva] || CURVAS.linear);
    const n = passos || 14, out = [];
    for (let i = 0; i <= n; i++){
      const t = i / n, k = f(t), v = {};
      for (const c of Object.keys(Object.assign({}, de, para))){
        const a = de[c] ?? (c === 'sx' || c === 'sy' || c === 'a' ? 1 : 0);
        const b = para[c] ?? a;
        v[c] = this.lerp(a, b, k);
      }
      out.push(Object.assign(this.quadro(v), {offset:t}));
    }
    return out;
  },
  /* Uma perna de movimento. Promise que resolve no fim. */
  mover(el, de, para, ms, curva, op){
    if (!el || !el.animate) return Promise.resolve();
    const o = op || {};
    const a = el.animate(this.caminho(de, para, curva, o.passos), {duration:ms, easing:'linear',
      fill:o.fill || 'none', composite:o.composite || 'replace', delay:o.atraso || 0});
    return a.finished.catch(() => {});
  },
  /* Várias pernas encadeadas numa animação só, com a duração de cada uma. */
  sequencia(el, pernas, op){
    if (!el || !el.animate) return Promise.resolve();
    const total = pernas.reduce((s, p) => s + p.ms, 0) || 1;
    let t0 = 0;
    const quadros = [];
    pernas.forEach((p, i) => {
      this.caminho(p.de, p.para, p.curva, p.passos || 8).forEach((q, j) => {
        if (i > 0 && j === 0) return;
        q.offset = (t0 + q.offset * p.ms) / total;
        quadros.push(q);
      });
      t0 += p.ms;
    });
    const o = op || {};
    return el.animate(quadros, {duration:total, easing:'linear', fill:o.fill || 'none',
      composite:o.composite || 'replace'}).finished.catch(() => {});
  },

  /* ---------- o jeito de cada um ----------
     Determinístico pelo número da dex: o mesmo Pokémon respira sempre
     igual, e dois Pidgey não respiram em uníssono por acaso porque a
     fase sai do uid. Grande respira devagar e pouco; pequeno, rápido. */
  ritmo(p){
    const dex = p ? Number(p.dex) : 0;
    const porte = (typeof porteDe === 'function' && dex) ? porteDe(dex) : 'medio';
    const base = {pequeno:{ms:1500, amp:.045, fps:12}, medio:{ms:2100, amp:.032, fps:10}, grande:{ms:2900, amp:.022, fps:8}}[porte]
              || {ms:2100, amp:.032, fps:10};
    const jit = ((dex * 37) % 31) / 100 - .15;          /* ±15% por espécie */
    const fase = p && p.uid ? (String(p.uid).split('').reduce((s, c) => s + c.charCodeAt(0), 0) % 100) / 100 : 0;
    return {ms:Math.round(base.ms * (1 + jit)), amp:base.amp, fps:base.fps, fase, paira:PAIRA_NO_AR.has(dex)};
  },

  marcar(lado, estado){ this.estado[lado] = estado; },
  limparLoop(lado){
    const l = this._loops[lado];
    if (l){ try { l.cancel(); } catch(e){} }
    this._loops[lado] = null;
  },

  /* ======================== IDLE ======================== */
  repouso(lado){
    const s = this.sprite(lado), p = this.pokemon(lado);
    this.limparLoop(lado);
    if (!s || !p) return;
    this.marcar(lado, ESTADOS_SPRITE.IDLE);
    /* GIF de Black/White: o repouso é o dela, nada por cima */
    if (s.classList.contains('ani')) return;
    this.tocarQuadros(s, p, lado);
    if (this.reduzido()) return;
    const r = this.ritmo(p);
    /* com quadro desenhado o corpo já se mexe; a escala só acompanha de leve */
    const amp = this._quadros.has(s) ? r.amp * .3 : r.amp;
    const quadros = r.paira
      ? this.caminho({y:0}, {y:-Math.max(3, s.offsetHeight * .05)}, 'seno', 16)
      : this.caminho({sx:1, sy:1}, {sx:1 + amp * .35, sy:1 + amp}, 'seno', 16);
    const anim = s.animate(quadros, {duration:r.ms, iterations:Infinity, easing:'linear',
      delay:-r.ms * r.fase, composite:r.paira ? 'add' : 'replace'});
    this._loops[lado] = anim;
  },
  /* Depois de a arena se redesenhar: quem está de pé volta a respirar. */
  montar(){
    for (const lado of ['aliado', 'inimigo']){
      const s = this.sprite(lado), p = this.pokemon(lado);
      if (!s || !p){ this.limparLoop(lado); this.marcar(lado, null); continue; }
      if (p.hp <= 0){ this.limparLoop(lado); this.marcar(lado, ESTADOS_SPRITE.FAINT); continue; }
      this.repouso(lado);
    }
  },

  /* ======================== ATTACK_PHYSICAL ========================
     Avança acelerando na direção do outro (uns 18% do caminho, até 40
     px; 18 px no celular), achata no impacto e volta freando. A Promise resolve NO
     IMPACTO — é quando o golpe acerta e o efeito tem que aparecer; a
     volta segue sozinha, e `.volta` é a Promise dela. */
  ataqueFisico(lado, alvoLado){
    const s = this.sprite(lado);
    if (!s || this.reduzido()){ const z = Promise.resolve(); z.volta = z; return z; }
    const outro = alvoLado || (lado === 'aliado' ? 'inimigo' : 'aliado');
    const t = Efeitos.alvo(lado), u = Efeitos.alvo(outro);
    let dx = 0, dy = 0;
    if (t && u){
      const vx = u.cx - t.cx, vy = u.cy - t.cy, d = Math.hypot(vx, vy) || 1;
      /* empilhado (celular) o outro está embaixo, do outro lado da
         ficha: avanço curto, senão o corpo passa por cima do cartão */
      const passo = Math.min(Math.abs(vy) > Math.abs(vx) ? 18 : 40, d * .18);
      dx = vx / d * passo; dy = vy / d * passo;
    }
    this.marcar(lado, ESTADOS_SPRITE.ATTACK_PHYSICAL);
    const IDA = 170, BATE = 70, VOLTA = 230;
    const tudo = this.sequencia(s, [
      {de:{x:0, y:0, sx:1, sy:1}, para:{x:dx, y:dy, sx:1, sy:1}, ms:IDA, curva:'easeIn'},
      {de:{x:dx, y:dy, sx:1, sy:1}, para:{x:dx * 1.08, y:dy * 1.08, sx:1.07, sy:.93}, ms:BATE / 2, curva:'easeOut', passos:3},
      {de:{x:dx * 1.08, y:dy * 1.08, sx:1.07, sy:.93}, para:{x:dx, y:dy, sx:1, sy:1}, ms:BATE / 2, curva:'easeIn', passos:3},
      {de:{x:dx, y:dy, sx:1, sy:1}, para:{x:0, y:0, sx:1, sy:1}, ms:VOLTA, curva:'easeOut'}
    ]).then(() => { if (this.estado[lado] === ESTADOS_SPRITE.ATTACK_PHYSICAL) this.marcar(lado, ESTADOS_SPRITE.IDLE); });
    const impacto = new Promise(r => setTimeout(r, IDA + BATE / 2));
    impacto.volta = tudo;
    return impacto;
  },

  /* ======================== ATTACK_SPECIAL ========================
     Treme no lugar e pulsa: cresce um pouco e fica translúcido, duas
     vezes, como quem junta força antes de soltar. */
  ataqueEspecial(lado){
    const s = this.sprite(lado);
    if (!s || this.reduzido()) return Promise.resolve();
    this.marcar(lado, ESTADOS_SPRITE.ATTACK_SPECIAL);
    const MS = 340, q = [];
    const n = 12;
    for (let i = 0; i <= n; i++){
      const t = i / n, onda = Math.sin(t * Math.PI * 2);            /* dois pulsos */
      const tremor = i === 0 || i === n ? 0 : (i % 2 ? 1.6 : -1.6);
      q.push(Object.assign(this.quadro({x:tremor, y:0, sx:1 + .05 * Math.abs(onda), sy:1 + .05 * Math.abs(onda),
                                          a:1 - .28 * Math.abs(onda)}), {offset:t}));
    }
    return s.animate(q, {duration:MS, easing:'linear'}).finished.catch(() => {})
      .then(() => { if (this.estado[lado] === ESTADOS_SPRITE.ATTACK_SPECIAL) this.marcar(lado, ESTADOS_SPRITE.IDLE); });
  },

  /* ======================== TAKE_DAMAGE ========================
     Tremor horizontal que perde força a cada vaivém, e por cima o
     pisca-pisca: visível, sumido, visível, três vezes. São duas
     animações em propriedades diferentes, então andam juntas. */
  dano(lado){
    const s = this.sprite(lado);
    if (!s) return Promise.resolve();
    if (this.reduzido()) return Promise.resolve();
    this.marcar(lado, ESTADOS_SPRITE.TAKE_DAMAGE);
    const MS = 480, AMP = Math.max(5, s.offsetWidth * .07), vai = 6, q = [];
    for (let i = 0; i <= vai; i++){
      const queda = 1 - i / vai;                                  /* atenuação */
      q.push({translate:`${(i === 0 || i === vai ? 0 : (i % 2 ? -1 : 1) * AMP * queda).toFixed(2)}px 0px`,
              offset:i / vai, easing:'ease-in-out'});
    }
    const tremor = s.animate(q, {duration:MS, easing:'linear', composite:'add'}).finished.catch(() => {});
    /* o degrau vai em cada quadro: no tempo da animação inteira ele
       seguraria o primeiro quadro até o fim e nada piscaria */
    const p = [];
    for (let i = 0; i < 3; i++) p.push({opacity:1, easing:'steps(1, end)'}, {opacity:0, easing:'steps(1, end)'});
    p.push({opacity:1});
    const pisca = s.animate(p, {duration:MS, easing:'linear'}).finished.catch(() => {});
    return Promise.all([tremor, pisca])
      .then(() => { if (this.estado[lado] === ESTADOS_SPRITE.TAKE_DAMAGE) this.marcar(lado, ESTADOS_SPRITE.IDLE); });
  },

  /* ======================== FAINT ========================
     Afunda na vertical como se o chão engolisse: a linha do pé fica
     parada (o recorte de baixo cresce junto com a descida) e a
     opacidade vai a zero. Fica sumido até a arena se redesenhar —
     e aí quem caiu volta como `.caido`, sem sprite. */
  desmaio(lado){
    const s = this.sprite(lado);
    this.limparLoop(lado);
    this.marcar(lado, ESTADOS_SPRITE.FAINT);
    if (!s) return Promise.resolve();
    if (this.reduzido()){ s.style.visibility = 'hidden'; return Promise.resolve(); }
    const H = s.offsetHeight || 100, PE = H * (1 - peDoSprite(s)) * .85, D = H * .8;
    return this.mover(s, {x:0, y:0, sx:1, sy:1, a:1, clip:PE}, {x:0, y:D, sx:1, sy:1, a:0, clip:PE + D},
                      650, 'easeIn', {fill:'forwards', passos:16});
  },

  /* ======================== ENTRY ========================
     Desliza da lateral até a base e cresce até o tamanho certo. O de
     lá vem da direita, o seu da esquerda — cada um do próprio lado da
     tela. `daBola` faz nascer do pé, sem deslizar: é o que acontece
     depois do clarão da Pokébola. */
  entrar(lado, op){
    const s = this.sprite(lado), o = op || {};
    this.limparLoop(lado);
    if (!s) return Promise.resolve();
    const lut = s.closest('.lutador');
    if (lut) lut.classList.add('fixo');                /* sem o surgeSprite do CSS por baixo */
    /* o que ficou preso do recolher ou do desmaio (fill forwards) sai antes */
    s.getAnimations().forEach(x => x.cancel());
    s.style.visibility = '';
    if (this.reduzido()){ this.repouso(lado); return Promise.resolve(); }
    this.marcar(lado, ESTADOS_SPRITE.ENTRY);
    const lado0 = lado === 'aliado' ? -1 : 1;
    const DX = o.daBola ? 0 : lado0 * Math.max(90, s.offsetWidth * 1.1);
    const pernas = o.daBola
      ? [{de:{x:0, y:0, sx:0, sy:0, a:1}, para:{x:0, y:0, sx:1, sy:1, a:1}, ms:380, curva:'easeOutBack'}]
      : [{de:{x:DX, y:0, sx:.55, sy:.55, a:0}, para:{x:DX * .1, y:0, sx:.92, sy:.92, a:1}, ms:330, curva:'easeOut'},
         {de:{x:DX * .1, y:0, sx:.92, sy:.92, a:1}, para:{x:0, y:0, sx:1, sy:1, a:1}, ms:200, curva:'easeOutBack'}];
    return this.sequencia(s, pernas).then(() => this.repouso(lado));
  },

  /* ======================== RETREAT ========================
     Encolhe até sumir indo pra onde a Pokébola dele está: o seu pro
     canto de baixo à esquerda (de onde a bola veio), o de lá pro alto
     à direita, onde fica o treinador. */
  recolher(lado){
    const s = this.sprite(lado);
    this.limparLoop(lado);
    if (!s) return Promise.resolve();
    this.marcar(lado, ESTADOS_SPRITE.RETREAT);
    if (this.reduzido()){ s.style.visibility = 'hidden'; return Promise.resolve(); }
    const W = s.offsetWidth || 100;
    const para = lado === 'aliado' ? {x:-W * .45, y:W * .1} : {x:W * .4, y:-W * .12};
    return this.mover(s, {x:0, y:0, sx:1, sy:1, a:1}, {x:para.x, y:para.y, sx:0, sy:0, a:.2},
                      360, 'easeIn', {fill:'forwards'})
      .then(() => { s.style.visibility = 'hidden'; });
  },

  /* ======================== EVADE ========================
     Esquivar com Vontade: um salto curto pro lado, rápido na ida e
     devagar na volta, como quem sai da frente e se recompõe. */
  esquivar(lado){
    const s = this.sprite(lado);
    if (!s || this.reduzido()) return Promise.resolve();
    this.marcar(lado, ESTADOS_SPRITE.EVADE);
    const dx = (lado === 'aliado' ? -1 : 1) * Math.max(16, s.offsetWidth * .3);
    return this.sequencia(s, [
      {de:{x:0, y:0}, para:{x:dx, y:-4}, ms:140, curva:'easeOut'},
      {de:{x:dx, y:-4}, para:{x:dx, y:0}, ms:160, curva:'linear', passos:2},
      {de:{x:dx, y:0}, para:{x:0, y:0}, ms:280, curva:'easeInOut'}
    ], {composite:'add'}).then(() => { if (this.estado[lado] === ESTADOS_SPRITE.EVADE) this.marcar(lado, ESTADOS_SPRITE.IDLE); });
  },

  /* ======================== STAT_BOOST / STAT_DROP ========================
     Sobe (ou desce) uns pixels e volta. A partícula do atributo é de
     Efeitos; aqui é só o corpo acompanhando. */
  atributo(lado, sobe){
    const s = this.sprite(lado);
    if (!s || this.reduzido()) return Promise.resolve();
    const est = sobe ? ESTADOS_SPRITE.STAT_BOOST : ESTADOS_SPRITE.STAT_DROP;
    this.marcar(lado, est);
    const dy = (sobe ? -1 : 1) * Math.max(5, s.offsetHeight * .07);
    return this.sequencia(s, [
      {de:{x:0, y:0}, para:{x:0, y:dy}, ms:200, curva:'easeOut'},
      {de:{x:0, y:dy}, para:{x:0, y:dy}, ms:120, curva:'linear', passos:1},
      {de:{x:0, y:dy}, para:{x:0, y:0}, ms:260, curva:'easeInOut'}
    ], {composite:'add'}).then(() => { if (this.estado[lado] === est) this.marcar(lado, ESTADOS_SPRITE.IDLE); });
  },

  /* ---------- quadros (Gen 5): sequência ou folha ----------
     Um loop de desenho só (requestAnimationFrame) toca todos, cada um
     no próprio fps. Elemento que saiu da página sai do loop sozinho. */
  registrarQuadros(dex, vista, def){
    QUADROS_SPRITE[`${Number(dex)}:${vista}`] = def;
  },
  resolver(rel){
    if (/^(data:|blob:|https?:|file:)/.test(rel)) return rel;
    const base = (typeof SPRITES_BASE !== 'undefined' ? SPRITES_BASE : '');
    const k = rel.startsWith(base) ? rel : base + rel;
    return (typeof SPRITES_EMBUTIDOS !== 'undefined' && SPRITES_EMBUTIDOS[k]) || k;
  },
  tocarQuadros(s, p, lado){
    this._quadros.delete(s);
    const def = QUADROS_SPRITE[`${Number(p.dex)}:${this.vista(lado)}`];
    if (!def) return;
    const r = this.ritmo(p), fps = def.fps || r.fps;
    const lista = p.shiny ? def.quadrosBrilhante : def.quadros;
    const folha = p.shiny ? def.folhaBrilhante : def.folha;
    if (lista && lista.length){
      const urls = lista.map(u => this.resolver(u));
      urls.forEach(u => { const i = new Image(); i.src = u; });          /* pré-carrega */
      this._quadros.set(s, {i:0, n:urls.length, ms:1000 / fps, ult:0, pintar:(k) => { s.src = urls[k]; }});
    } else if (folha && def.n > 1 && window.CSS && CSS.supports('object-view-box', 'inset(0)')){
      s.src = this.resolver(folha);
      const n = def.n;
      const pintar = (k) => {
        const W = s.naturalWidth / n;
        if (W) s.style.objectViewBox = `inset(0 ${(s.naturalWidth - (k + 1) * W).toFixed(1)}px 0 ${(k * W).toFixed(1)}px)`;
      };
      this._quadros.set(s, {i:0, n, ms:1000 / fps, ult:0, pintar});
    } else return;
    if (!this._raf) this._raf = requestAnimationFrame(t => this.ciclo(t));
  },
  ciclo(t){
    for (const [el, q] of this._quadros){
      if (!el.isConnected){ this._quadros.delete(el); continue; }
      if (t - q.ult < q.ms) continue;
      q.ult = t; q.i = (q.i + 1) % q.n; q.pintar(q.i);
    }
    this._raf = this._quadros.size ? requestAnimationFrame(t2 => this.ciclo(t2)) : 0;
  }
};

/* Os nomes da especificação, pra quem procura por eles. */
const PokemonSpriteAnimator = {
  STATES: ESTADOS_SPRITE,
  play_idle:            lado => AnimadorSprite.repouso(lado),
  play_physical_attack: (lado, alvo) => AnimadorSprite.ataqueFisico(lado, alvo),
  play_special_attack:  lado => AnimadorSprite.ataqueEspecial(lado),
  play_take_damage:     lado => AnimadorSprite.dano(lado),
  play_faint:           lado => AnimadorSprite.desmaio(lado),
  play_entry:           (lado, op) => AnimadorSprite.entrar(lado, op),
  play_retreat:         lado => AnimadorSprite.recolher(lado),
  play_stat_boost:      lado => AnimadorSprite.atributo(lado, true),
  play_stat_drop:       lado => AnimadorSprite.atributo(lado, false),
  play_evade:           lado => AnimadorSprite.esquivar(lado),
  slide_in:             (lado, op) => AnimadorSprite.entrar(lado, op),
  slide_out:            lado => AnimadorSprite.recolher(lado),
  dash_attack:          (lado, alvo) => AnimadorSprite.ataqueFisico(lado, alvo)
};
