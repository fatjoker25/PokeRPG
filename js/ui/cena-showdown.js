/* ============================================================
   CENA DO SHOWDOWN — roda a animação de golpe do Showdown na nossa arena
   As animações (js/data/golpes-showdown.js, geradas) foram escritas
   pra cena do Showdown: 640×360, o seu Pokémon em z=0 e o de lá em
   z=200, com perspectiva. Aqui elas rodam contra uma cena de mentira
   que só anota o que foi pedido — efeito, movimento de lutador, fundo
   — e depois toca tudo de uma vez com Web Animations, com as posições
   do Showdown levadas pras posições reais dos nossos lutadores.

   O mapa é uma semelhança pelos dois pontos que as duas cenas
   têm: o centro do seu Pokémon e o centro do de lá. No computador
   isso é quase só escala; no celular, empilhado, gira — e o efeito
   continua indo de um bicho pro outro.
   ============================================================ */
const CenaShowdown = {
  /* onde os dois lutadores ficam na cena do Showdown (pos() de z=0 e z=200) */
  P_EU: {x:210, y:245}, P_ELE: {x:430, y:135},
  /* animação mais longa que isso anda mais rápido, pra não travar o turno */
  TETO_MS: 2200,

  tem(nome){
    return typeof SD_ID_DO_GOLPE !== 'undefined' && !!SD_ID_DO_GOLPE[nome] && !!SD_GOLPES[SD_ID_DO_GOLPE[nome]];
  },

  /* ---------- posição: a conta do Showdown (pos), levada pra arena ----------
     No Showdown a profundidade z vai de 0 (o seu) a 200 (o de lá) e
     encolhe as coisas com a distância (escala 1,5 → 1). Aqui z anda
     pela linha entre o centro dos nossos dois lutadores, e o que é
     deslocamento (x, y, tamanho) cresce pelo tamanho do bicho, não pela
     distância — senão um pulo de "y + 80" sai pelo teto da arena. */
  posSD(loc, obj){
    loc = Object.assign({x:0, y:0, z:0, scale:1, opacity:1}, loc);
    if (!loc.xscale && loc.xscale !== 0) loc.xscale = loc.scale;
    if (!loc.yscale && loc.yscale !== 0) loc.yscale = loc.scale;
    const t = loc.z / 200, k = this._k || 1, Q0 = this._Q0 || this.P_EU, Q1 = this._Q1 || this.P_ELE;
    let esc = 1.5 - 0.5 * t;
    if (esc < 0.1) esc = 0.1;
    const bx = Q0.x + (Q1.x - Q0.x) * t, by = Q0.y + (Q1.y - Q0.y) * t;
    const ax = bx + loc.x * esc * k, ay = by - loc.y * esc * (this._ky || k);
    const w = obj.w * esc * k * loc.xscale, h = obj.h * esc * k * loc.yscale;
    const hoff = (obj.h - (obj.y || 0) * 2) * esc * k * loc.yscale;
    return {cx:ax, cy: ay - hoff / 2 + h / 2, w, h, top: ay - hoff / 2, opacity:loc.opacity};
  },

  /* as curvas do Showdown ($.easing no fim de battle-animations.ts) */
  curva(nome, p){
    switch (nome){
      case 'ballisticUp':   return -3 * p * p + 4 * p;
      case 'ballisticDown': { const x = 1 - p; return 1 - (-3 * x * x + 4 * x); }
      case 'quadUp':        { const x = 1 - p; return 1 - x * x; }
      case 'quadDown':      return p * p;
      case 'swing':         return 0.5 - Math.cos(p * Math.PI) / 2;
      default:              return p;
    }
  },
  /* que curva cada propriedade usa, pela transição pedida (posT) */
  curvas(trans, de, para, locPara){
    const m = {x:'linear', y:'linear', t:'linear'};
    const subiu = para.top < de.top;
    if (trans === 'ballistic')       m.y = subiu ? 'ballisticUp' : 'ballisticDown';
    if (trans === 'ballisticUnder')  m.y = subiu ? 'ballisticDown' : 'ballisticUp';
    if (trans === 'ballistic2')      m.y = subiu ? 'quadUp' : 'quadDown';
    if (trans === 'ballistic2Back')  m.y = (locPara.z > 0) ? 'quadUp' : 'quadDown';
    if (trans === 'ballistic2Under') m.y = subiu ? 'quadDown' : 'quadUp';
    if (trans === 'swing')  { m.x = m.y = m.t = 'swing'; }
    if (trans === 'accel')  { m.x = m.y = m.t = 'quadDown'; }
    if (trans === 'decel')  { m.x = m.y = m.t = 'quadUp'; }
    return m;
  },

  /* ---------- a cena de mentira: anota, não desenha ---------- */
  montar(lado){
    const eu = lado === 'aliado';
    const reg = {efeitos:[], fundos:[], sprites:{}};
    const cena = {
      timeOffset:0,
      battle:{gen:9, gameType:'singles'},
      wait(ms){ this.timeOffset += ms; },
      showEffect(fx, start, end, trans, after){
        const obj = typeof fx === 'string' ? SD_EFEITOS[fx] : fx;
        if (!obj) return null;
        start = Object.assign({}, start); end = Object.assign({}, end);
        if (!start.time) start.time = 0;
        if (!end.time) end.time = start.time + 500;
        start.time += this.timeOffset; end.time += this.timeOffset;
        if (!end.scale && end.scale !== 0 && start.scale) end.scale = start.scale;
        if (!end.xscale && end.xscale !== 0 && start.xscale) end.xscale = start.xscale;
        if (!end.yscale && end.yscale !== 0 && start.yscale) end.yscale = start.yscale;
        end = Object.assign({}, start, end);
        reg.efeitos.push({obj, start, end, trans, after});
        return null;
      },
      animateEffect(){ return null; },
      backgroundEffect(bg, dur, opacidade, atraso){
        reg.fundos.push({bg, dur, op: opacidade === undefined ? 1 : opacidade, atraso: atraso || 0});
      }
    };
    const sprite = (qual, frente) => {
      const el = Efeitos.sprite(qual);
      const nw = (el && el.naturalWidth) || 96, nh = (el && el.naturalHeight) || 96;
      const s = {
        x:0, y:0, z: frente ? 200 : 0, isFrontSprite:frente, isMissedPokemon:false, isSubActive:false,
        /* cópia do sprite (rastro do Quick Attack, sombra do Double Team) leva
           o filtro dele junto: silhueta continua silhueta, brilho continua brilho */
        sp:{url: el ? (el.currentSrc || el.src) : '', w:nw, h:nh, filtro: el ? getComputedStyle(el).filter : ''},
        lado:qual, cursor:0, segs:[], atual:null,
        behind(o){ return this.z + (this.isFrontSprite ? 1 : -1) * o; },
        leftof(o){ return this.x + (this.isFrontSprite ? 1 : -1) * o; },
        behindx(o){ return this.x + (this.isFrontSprite ? 1 : -1) * o; },
        behindy(o){ return this.y + (this.isFrontSprite ? -1 : 1) * o; },
        delay(ms){ this.cursor += ms; return this; },
        anim(end, trans){
          end = Object.assign({x:this.x, y:this.y, z:this.z, scale:1, opacity:1, time:500}, end);
          const de = this.atual || {x:this.x, y:this.y, z:this.z, scale:1, opacity:1};
          this.segs.push({de, para:end, t0:this.cursor, dur:end.time, trans});
          this.cursor += end.time; this.atual = end;
          return this;
        }
      };
      reg.sprites[qual] = s;
      return s;
    };
    const atacante = sprite(lado, !eu);
    const alvo = sprite(eu ? 'inimigo' : 'aliado', eu);
    return {cena, atacante, alvo, reg};
  },

  /* O golpe do Showdown já leva o atacante até o outro? Se não, quem
     faz a investida do golpe físico é o AnimadorSprite. */
  mexeAtacante(nome, lado){
    if (!this.tem(nome)) return false;
    try {
      const {cena, atacante, alvo} = this.montar(lado);
      SD_GOLPES[SD_ID_DO_GOLPE[nome]].anim(cena, [atacante, alvo]);
      return atacante.segs.some(g => g.para.x !== g.de.x || g.para.y !== g.de.y || g.para.z !== g.de.z);
    } catch (e){ return false; }
  },

  /* ---------- tocar ---------- */
  tocar(nome, lado){
    if (!this.tem(nome)) return null;
    const A = Efeitos.arena(), camada = Efeitos.camada();
    const qEu = Efeitos.alvo('aliado'), qEle = Efeitos.alvo('inimigo');
    if (!A || !camada || !qEu || !qEle) return null;
    const {cena, atacante, alvo, reg} = this.montar(lado);
    try { SD_GOLPES[SD_ID_DO_GOLPE[nome]].anim(cena, [atacante, alvo]); }
    catch (e){ return null; }

    /* as duas âncoras: o centro de cada lutador na nossa arena; e o
       tamanho — o de lá tem 96 px no Showdown (escala 1 em z=200) */
    this._Q0 = {x:qEu.cx, y:qEu.cy}; this._Q1 = {x:qEle.cx, y:qEle.cy};
    this._k = Math.max(0.35, Math.min(1.6, qEle.h / 96));
    /* altura: no Showdown o de lá tem 135 px de céu acima do centro; aqui
       tem o que a arena der — pulo e voo sobem na mesma proporção */
    const ceu = qEle.cy - 6;   /* alvo() já é relativo à arena */
    this._ky = Math.min(this._k, Math.max(0.3, ceu / 135));
    const mapa = (x, y) => ({x, y});

    /* duração total, e a velocidade que cabe no teto */
    let total = 0;
    reg.efeitos.forEach(e => { total = Math.max(total, e.end.time + (e.after === 'fade' ? 100 : e.after === 'explode' ? 200 : 0)); });
    reg.fundos.forEach(f => { total = Math.max(total, f.atraso + Math.max(f.dur, 500)); });
    Object.values(reg.sprites).forEach(s => { total = Math.max(total, s.cursor); });
    if (!total) return null;
    const vel = total > this.TETO_MS ? this.TETO_MS / total : 1;
    const T = total * vel;
    const promessas = [], lixo = [];

    /* efeitos: uma imagem por pedido, com os quadros amostrados */
    for (const e of reg.efeitos){
      const src = e.obj.arq ? fxShowdown(e.obj.arq) : e.obj.url;
      if (!src) continue;
      const img = document.createElement('img');
      img.className = 'fx fx-sd'; img.alt = ''; img.src = src;
      img.onerror = () => img.remove();
      if (e.obj.filtro && e.obj.filtro !== 'none') img.style.filter = e.obj.filtro;
      camada.appendChild(img); lixo.push(img);
      const pa = this.posSD(e.start, e.obj), pb = this.posSD(e.end, e.obj);
      const cv = this.curvas(e.trans, pa, pb, e.end);
      const quadros = [];
      const caixa = (p, op) => { const c = mapa(p.cx, p.cy), w = p.w, h = p.h;
        return {left:(c.x - w / 2) + 'px', top:(c.y - h / 2) + 'px', width:w + 'px', height:h + 'px', opacity:op}; };
      const t0 = e.start.time, t1 = e.end.time;
      /* antes da hora ele existe, invisível, no ponto de partida */
      quadros.push(Object.assign(caixa(pa, 0), {offset:0}));
      if (t0 > 0) quadros.push(Object.assign(caixa(pa, 0), {offset:Math.min(1, t0 * vel / T)}));
      const N = 10;
      for (let i = 0; i <= N; i++){
        const p = i / N;
        const px = this.curva(cv.x, p), py = this.curva(cv.y, p), pt = this.curva(cv.t, p);
        const q = {cx: pa.cx + (pb.cx - pa.cx) * px, cy: pa.cy + (pb.cy - pa.cy) * py,
                   w: pa.w + (pb.w - pa.w) * pt, h: pa.h + (pb.h - pa.h) * pt};
        const op = pa.opacity + (pb.opacity - pa.opacity) * p;
        quadros.push(Object.assign(caixa(q, op), {offset:Math.min(1, (t0 + (t1 - t0) * p) * vel / T)}));
      }
      let fim = t1;
      if (e.after === 'fade'){ fim += 100; quadros.push(Object.assign(caixa(pb, 0), {offset:Math.min(1, fim * vel / T)})); }
      if (e.after === 'explode'){
        fim += 200;
        const ex = this.posSD(Object.assign({}, e.end, {scale:(e.end.scale || 1) * 3,
          xscale:e.end.xscale ? e.end.xscale * 3 : undefined, yscale:e.end.yscale ? e.end.yscale * 3 : undefined}), e.obj);
        quadros.push(Object.assign(caixa(ex, 0), {offset:Math.min(1, fim * vel / T)}));
      }
      /* depois de acabar, some (quem não tem 'fade' fica parado até o fim no Showdown;
         aqui ele some no fim da cena inteira) */
      const ult = quadros[quadros.length - 1];
      if (ult.offset < 1) quadros.push(Object.assign({}, ult, {offset:1}));
      /* offsets têm que crescer: arredondamento pode empatar */
      for (let i = 1; i < quadros.length; i++) if (quadros[i].offset < quadros[i - 1].offset) quadros[i].offset = quadros[i - 1].offset;
      promessas.push(Efeitos.tocar(img, quadros, T, {easing:'linear', fill:'both'}));
    }

    /* fundo: pinta só o cenário, atrás dos lutadores e nunca por cima das
       fichas de HP. No computador é uma faixa só, do alto da arena até o
       topo das fichas; no celular, empilhado, vai dentro da moldura de
       cada lutador, como a camada de clima. */
    const artes = [...A.querySelectorAll('.lutador .arte')];
    const [ra, rb] = artes.map(x => x.getBoundingClientRect());
    const empilhado = ra && rb && (ra.bottom <= rb.top + 4 || rb.bottom <= ra.top + 4);
    const RA = A.getBoundingClientRect();
    const topoFichas = Math.min(...[...A.querySelectorAll('.lutador .ficha')].map(x => x.getBoundingClientRect().top), RA.bottom);
    for (const f of reg.fundos){
      let bg = String(f.bg).replace(/url\((['"]?)https?:\/\/[^)'"]*\/([\w-]+\.(?:jpg|png))\1\)/g,
        (m, q, arq) => `url("${fxShowdown(arq)}")`);
      if (/^url\(/.test(bg)) bg += ' center / cover';
      const onde = empilhado ? artes : [A];
      const a0 = f.atraso * vel, dur = Math.max(f.dur, 500) * vel;
      const o = (t) => Math.min(1, t / T);
      for (const pai of onde){
        const d = document.createElement('div');
        d.className = 'sd-fundo'; d.style.background = bg;
        if (!empilhado) d.style.height = Math.max(40, topoFichas - RA.top - 6) + 'px';
        pai.insertBefore(d, pai.firstChild); lixo.push(d);
        promessas.push(Efeitos.tocar(d, [
          {opacity:0, offset:0}, {opacity:0, offset:o(a0)}, {opacity:f.op, offset:o(a0 + 250 * vel)},
          {opacity:f.op, offset:o(a0 + dur - 250 * vel)}, {opacity:0, offset:o(a0 + dur)}, {opacity:0, offset:1}], T, {easing:'linear', fill:'both'}));
      }
    }

    /* lutadores: deslocamento e escala relativos ao lugar de descanso */
    for (const s of Object.values(reg.sprites)){
      if (!s.segs.length) continue;
      const el = Efeitos.sprite(s.lado);
      if (!el) continue;
      const repouso = this.posSD({x:s.x, y:s.y, z:s.z}, s.sp);
      const mRep = mapa(repouso.cx, repouso.cy);
      const estado = (L) => {
        const p = this.posSD(L, s.sp), c = mapa(p.cx, p.cy);
        return {dx: c.x - mRep.x, dy: c.y - mRep.y, s: p.w / repouso.w, op: L.opacity === undefined ? 1 : L.opacity, top:p.top};
      };
      /* o sprite escala em volta do pé (transform-origin 50% 76%) e a
         conta do Showdown é pelo centro: a diferença é 26% da altura */
      const pe = el.offsetHeight * .26;
      const tr = (q) => ({transform:`translate(${q.dx.toFixed(1)}px, ${(q.dy - (1 - q.s) * pe).toFixed(1)}px) scale(${q.s.toFixed(3)})`, opacity:q.op});
      const quadros = [Object.assign(tr({dx:0, dy:0, s:1, op:1}), {offset:0})];
      for (const g of s.segs){
        const A0 = estado(g.de), B0 = estado(g.para);
        const cv = this.curvas(g.trans, {top:repouso.top}, {top:B0.top}, g.para);
        if (g.t0 > 0) quadros.push(Object.assign(tr(A0), {offset:Math.min(1, g.t0 * vel / T)}));
        const N = g.dur > 150 ? 8 : 3;
        for (let i = 1; i <= N; i++){
          const p = i / N, px = this.curva(cv.x, p), py = this.curva(cv.y, p), pt = this.curva(cv.t, p);
          quadros.push(Object.assign(tr({dx:A0.dx + (B0.dx - A0.dx) * px, dy:A0.dy + (B0.dy - A0.dy) * py,
            s:A0.s + (B0.s - A0.s) * pt, op:A0.op + (B0.op - A0.op) * p}), {offset:Math.min(1, (g.t0 + g.dur * p) * vel / T)}));
        }
      }
      /* sempre termina em casa, inteiro e visível */
      quadros.push(Object.assign(tr({dx:0, dy:0, s:1, op:1}), {offset:1}));
      for (let i = 1; i < quadros.length; i++) if (quadros[i].offset < quadros[i - 1].offset) quadros[i].offset = quadros[i - 1].offset;
      promessas.push(Efeitos.tocar(el, quadros, T, {easing:'linear'}));
    }

    /* quem ataca passa por cima de tudo enquanto a cena dura: no celular
       ele atravessa o cartão do outro, e por baixo sumiria */
    const luta = Efeitos.sprite(lado) && Efeitos.sprite(lado).closest('.lutador');
    if (luta) luta.style.zIndex = 4;
    return Promise.all(promessas).then(() => { lixo.forEach(x => x.remove()); if (luta) luta.style.zIndex = ''; });
  }
};

/* imagem da pasta do Showdown, trocada por data URI no arquivo único */
function fxShowdown(arq){
  const rel = SPRITES_BASE + 'animations/showdown/' + arq;
  return (typeof SPRITES_EMBUTIDOS !== 'undefined' && SPRITES_EMBUTIDOS[rel]) || rel;
}
