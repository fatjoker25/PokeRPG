/* ============================================================
   A PAISAGEM DA ABERTURA, EM PIXEL ART
   Kanto na hora de quem joga, desenhada em pixel de verdade: um canvas
   em baixa resolução mostrado em escala inteira (cada ponto do desenho
   é um quadrado de 2 a 5 px na tela, com image-rendering:pixelated),
   então todo canto é degrau e nenhuma borda sai borrada.

   - O céu vem em faixas, com uma linha pontilhada entre uma e outra.
   - Sol, lua, nuvens e estrelas são desenhados ponto a ponto.
   - Serra, vila, mata, morro, estrada, placa, árvores e capim são os
     caminhos de um desenho de 1440×600. Cada um é preenchido num
     rascunho e cortado a 50% de cobertura, sem meio-tom; a névoa da
     serra é pontilhado ordenado (Bayer).
   - As cores saem das variáveis do período no .tela-titulo
     (titulo.css), então o desenho é um só e a hora muda as cores.

   Anda a 8 quadros por segundo, só enquanto a abertura está na página:
   as nuvens, o capim, as estrelas, a cadente e os vagalumes. Quem pede
   menos movimento vê um quadro parado. O que é estático (o céu com o
   astro, o chão, as duas posições do capim) é desenhado de novo só
   quando muda o tamanho ou o período.
   ============================================================ */
const PaisagemPixel = {
  QPS: 8,
  _t: null, _ro: null, _mo: null, _e: null,

  /* liga no canvas.tt-pixel de dentro da abertura; aoMudar é chamado
     toda vez que a abertura muda de tamanho (a vitrine e o desfile
     refazem o zoom inteiro deles) */
  montar(tela, aoMudar){
    this.parar();
    const cv = tela && tela.querySelector('canvas.tt-pixel');
    if (!cv || !cv.getContext) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    this._e = {tela, cv, ctx, aoMudar, semente:(Math.random() * 4294967295) >>> 0, inicio:Date.now()};
    this.refazer();
    if (typeof ResizeObserver !== 'undefined'){
      let espera = null;
      this._ro = new ResizeObserver(() => { clearTimeout(espera); espera = setTimeout(() => this.refazer(), 120); });
      this._ro.observe(tela);
    }
    if (typeof MutationObserver !== 'undefined'){
      this._mo = new MutationObserver(() => this.refazer(true));
      this._mo.observe(tela, {attributes:true, attributeFilter:['data-periodo']});
    }
    const quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!quieto) this._t = setInterval(() => this.quadro(), 1000 / this.QPS);
  },

  parar(){
    clearInterval(this._t); this._t = null;
    if (this._ro) this._ro.disconnect();
    if (this._mo) this._mo.disconnect();
    this._ro = this._mo = this._e = null;
  },

  /* ---------- cor ---------- */
  rgb(txt){
    txt = String(txt || '').trim();
    let m = txt.match(/^#([0-9a-f]{3})$/i);
    if (m) return [...m[1]].map(h => parseInt(h + h, 16)).concat(1);
    m = txt.match(/^#([0-9a-f]{6})$/i);
    if (m) return [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)).concat(1);
    m = txt.match(/^rgba?\(([^)]+)\)$/i);
    if (m){
      const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
      return [p[0] || 0, p[1] || 0, p[2] || 0, p.length > 3 ? p[3] : 1];
    }
    return [0, 0, 0, 1];
  },
  mix(a, b, t){ return [0, 1, 2].map(i => Math.round(a[i] + (b[i] - a[i]) * t)); },
  /* o ponto na memória do canvas (RGBA, little-endian) */
  num(c){ return ((255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0]) >>> 0; },
  css(c){ return `rgb(${c[0]},${c[1]},${c[2]})`; },
  /* sorteio repetível: a mesma abertura desenha as mesmas estrelas */
  sorteio(s){
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  },
  folha(w, h){
    const c = document.createElement('canvas');
    c.width = Math.max(1, w); c.height = Math.max(1, h);
    return c;
  },

  /* ---------- o desenho do chão, em unidades de 1440×600 ---------- */
  caminhos(){
    /* uma serra pelos pontos, com o topo e o fundo redondos */
    const serra = pts => 'M0 600 L' + pts[0].join(' ') + pts.slice(1).map((q, i) => {
      const [x0, y0] = pts[i], [x1, y1] = q, d = (x1 - x0) * .48;
      return ` C${x0 + d} ${y0} ${x1 - d} ${y1} ${x1} ${y1}`;
    }).join('') + ' L1440 600 Z';
    const circulo = (cx, cy, r) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
    const ret = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}Z`;
    /* a mata: copas em fila */
    let mata = 'M0 600 L0 442', x = 0, k = 0;
    const raios = [18, 24, 15, 21, 27, 17, 22, 19, 25, 16];
    while (x < 1440){ const r = raios[k % raios.length], y = 440 + (k * 7 % 9); mata += ` L${x} ${y} A${r} ${r} 0 0 1 ${x + 2 * r} ${y}`; x += 2 * r - 4; k++; }
    mata += ' L1440 600 Z';
    /* o capim da frente: lâminas em zigue-zague */
    let capim = 'M0 600 L0 556';
    for (let i = 0, cx = 0; cx < 1440; i++, cx += 12) capim += ` L${cx + 6} ${538 + (i * 5 % 11)} L${cx + 12} ${556 - (i * 3 % 5)}`;
    capim += ' L1440 600 Z';
    /* os tufos do morro, em duas posições: o vento leva a ponta */
    const tufo = ([tx, ty], v) => `M${tx} ${ty} l${4 + v} -13 l${3 - v} 11 l${4 + v} -17 l${3 - v} 17 l${4 + v} -11 l${3 - v} 13 Z`;
    const TUFOS = [[180,480],[430,470],[930,468],[1210,462],[1330,476],[300,488],[640,474],[1060,472]];
    /* árvore redonda: tronco, a copa em três e o brilho de cima */
    const arvores = lista => ({
      tronco: lista.map(([ax, ay, r]) => ret(ax - r * .17, ay - r * 1.25, r * .34, r * 1.3)).join(''),
      copa: lista.map(([ax, ay, r]) => circulo(ax, ay - r * 1.85, r) + circulo(ax - r * .72, ay - r * 1.38, r * .7) + circulo(ax + r * .74, ay - r * 1.42, r * .72)).join(''),
      luz: lista.map(([ax, ay, r]) => circulo(ax - r * .3, ay - r * 2.15, r * .34)).join('')
    });
    const longe = arvores([[318, 456, 16], [1150, 448, 14]]), perto = arvores([[176, 566, 40], [1282, 566, 46]]);
    /* a vila no alto da serra de perto */
    const casas = [[1298, 343, 18, 12], [1328, 342, 26, 17], [1364, 347, 20, 13]];
    return {
      fundo: [
        ['serra-1', serra([[0,300],[90,252],[210,292],[330,214],[470,286],[560,262],[650,294],[790,206],[930,284],[1040,304],[1150,246],[1270,292],[1370,230],[1440,262]])],
        ['@nevoa', [250, 370]],
        ['serra-2', serra([[0,362],[140,320],[300,374],[460,332],[600,380],[760,346],[880,374],[1010,324],[1180,372],[1320,336],[1440,356]])],
        ['parede', casas.map(([cx, cy, w, h]) => ret(cx, cy - h, w, h)).join('')],
        ['telhado', casas.map(([cx, cy, w, h]) => `M${cx - 4} ${cy - h + 1} L${cx + w / 2} ${cy - h - w * .48} L${cx + w + 4} ${cy - h + 1} Z`).join('')],
        ['janela', casas.map(([cx, cy, w, h]) => ret(cx + w * .2, cy - h * .7, w * .24, w * .24) + ret(cx + w * .56, cy - h * .7, w * .24, w * .24)).join('')],
        ['mata', mata],
        ['tronco', longe.tronco], ['mata', longe.copa], ['copa-luz', longe.luz],
        ['morro', 'M0 600 L0 472 C240 440 420 452 620 462 C800 471 980 444 1160 450 C1300 455 1380 468 1440 478 L1440 600 Z'],
        ['trilha', 'M560 600 C600 572 700 556 690 530 C682 508 652 492 690 476 C700 472 707 468 709 463 L718 463 C718 470 713 476 706 480 C682 496 712 510 724 530 C740 556 702 580 822 600 Z'],
        ['tronco', ret(852, 520, 8, 34)], ['madeira', ret(826, 506, 58, 24)], ['madeira-2', ret(832, 512, 46, 4) + ret(832, 520, 30, 4)]
      ],
      tufos: v => TUFOS.map(p => tufo(p, v)).join(''),
      frente: [['tronco', perto.tronco], ['arvore', perto.copa], ['copa-luz', perto.luz], ['capim', capim]]
    };
  },

  /* preenche o caminho no rascunho e passa pro desenho o que cobre
     metade do ponto ou mais: borda em degrau, sem meio-tom */
  pintar(buf, e, d, cor){
    const c = e.rasc.getContext('2d', {willReadFrequently:true});
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, e.cw, e.ch);
    c.setTransform(e.s, 0, 0, e.s, e.ox, e.oy);
    c.fillStyle = '#fff'; c.fill(new Path2D(d));
    const a = c.getImageData(0, 0, e.cw, e.ch).data, n = this.num(cor);
    for (let i = 0, j = 3; i < buf.length; i++, j += 4) if (a[j] >= 128) buf[i] = n;
  },

  /* ---------- o que não muda entre um quadro e outro ---------- */
  refazer(forca){
    const e = this._e;
    if (!e) return;
    if (!e.cv.isConnected){ this.parar(); return; }
    if (e.aoMudar) try { e.aoMudar(); } catch (erro) {}
    const caixa = e.tela.getBoundingClientRect();
    const W = Math.max(1, Math.round(caixa.width)), H = Math.max(1, Math.round(caixa.height));
    const vh = window.innerHeight || H;
    const px = Math.max(2, Math.min(5, Math.round(vh / 210)));
    const cw = Math.ceil(W / px), ch = Math.ceil(H / px);
    const per = e.tela.dataset.periodo || 'dia';
    if (!forca && e.pronto && e.cw === cw && e.ch === ch && e.px === px && e.per === per) return;
    Object.assign(e, {W, H, px, cw, ch, per, vha:Math.ceil(Math.min(vh, H) / px)});
    e.cv.width = cw; e.cv.height = ch;
    e.cv.style.width = cw * px + 'px'; e.cv.style.height = ch * px + 'px';

    const cs = getComputedStyle(e.tela), C = n => this.rgb(cs.getPropertyValue('--' + n));
    const noite = per === 'noite' || per === 'madrugada', baixo = per === 'manha' || per === 'tarde';
    const rnd = this.sorteio(e.semente);

    /* o céu: faixas, com a linha pontilhada entre uma e outra */
    const c1 = C('ceu-1'), c2 = C('ceu-2'), c3 = C('ceu-3');
    const corEm = t => t < .4 ? this.mix(c1, c2, t / .4) : t < .7 ? this.mix(c2, c3, (t - .4) / .3) : c3.slice(0, 3);
    const hb = Math.max(3, Math.round(ch / 26));
    e.ceu = this.folha(cw, ch);
    const cc = e.ceu.getContext('2d'), img = cc.createImageData(cw, ch), ceu = new Uint32Array(img.data.buffer);
    const linha = [];
    for (let y = 0; y < ch; y++){
      const b = Math.floor(y / hb);
      const agora = corEm(Math.min(1, (b * hb + hb / 2) / ch)), antes = b > 0 ? corEm(Math.min(1, ((b - 1) * hb + hb / 2) / ch)) : agora;
      const na = this.num(agora), nb = this.num(antes), pont = b > 0 && y % hb === 0;
      linha[y] = agora;
      for (let x = 0; x < cw; x++) ceu[y * cw + x] = pont && ((x + y) & 1) ? nb : na;
    }
    const ponto = (x, y, cor) => { if (x >= 0 && y >= 0 && x < cw && y < ch) ceu[y * cw + x] = this.num(cor); };
    const doCeu = y => linha[Math.max(0, Math.min(ch - 1, y))];

    /* o astro: o sol do dia, o sol baixo e quente, ou a lua com as crateras */
    const estreito = W < 600;
    let r, ax, ay;
    /* no celular o astro vai pro canto, pequeno e com o halo curto,
       longe do logo */
    if (estreito){ r = Math.max(4, Math.min(7, Math.round(cw * .05))); ax = cw - r - 1; ay = r + 2; }
    else {
      r = Math.round(Math.max(7, Math.min(baixo ? 28 : 22, e.vha * (baixo ? .095 : noite ? .068 : .075))));
      ax = Math.round(cw - Math.max(cw * .1, r * 2.3)); ay = Math.round(e.vha * (baixo ? .2 : .12) + r);
    }
    const h1 = estreito ? 1.3 : baixo ? 3.3 : noite ? 3.3 : 2.3, h2 = estreito ? 2.3 : baixo ? 7.3 : 5.3;
    const sol = C('sol'), sol2 = C('sol-2'), halo = C('halo');
    const CRATERAS = [[.3, -.35, .2], [-.28, .22, .26], [.38, .38, .15], [-.05, -.62, .12]];
    for (let y = ay - r - 7; y <= ay + r + 7; y++) for (let x = ax - r - 7; x <= ax + r + 7; x++){
      const dx = x - ax, dy = y - ay, d = Math.sqrt(dx * dx + dy * dy), fundo = doCeu(y), xadrez = (x + y) & 1;
      if (noite){
        if (d <= r + .3){
          let cor = (dx + dy) / r > .45 ? [221, 211, 162] : (dx + dy) / r < -.5 ? [255, 254, 242] : [246, 239, 203];
          for (const [cx, cy, cr] of CRATERAS){ const ex = dx - cx * r, ey = dy - cy * r; if (ex * ex + ey * ey <= (cr * r + .3) ** 2) cor = (dx + dy) / r > .2 ? [196, 185, 138] : [207, 197, 150]; }
          ponto(x, y, cor);
        } else if (d <= r + h1 && xadrez) ponto(x, y, this.mix(fundo, [220, 230, 255], .22));
      } else if (baixo){
        if (d <= r + .3) ponto(x, y, d / r < .5 ? sol : d / r < .8 ? this.mix(sol, sol2, .5) : sol2);
        else if (d <= r + h1) ponto(x, y, this.mix(fundo, halo, Math.min(.75, (halo[3] || 1) * .95)));
        else if (d <= r + h2 && xadrez) ponto(x, y, this.mix(fundo, halo, Math.min(.5, (halo[3] || 1) * .55)));
      } else {
        if (d <= r + .3) ponto(x, y, d / r < .55 ? [255, 253, 240] : d / r < .85 ? [255, 242, 184] : [255, 214, 107]);
        else if (d <= r + h1) ponto(x, y, this.mix(fundo, [255, 246, 200], .55));
        else if (d <= r + h2 && xadrez) ponto(x, y, this.mix(fundo, [255, 246, 200], .3));
      }
    }
    /* o sol baixo atravessado por duas faixas de nuvem */
    if (baixo) for (const [f, esp] of [[.32, 1], [.62, 2]]){
      const yy = Math.round(ay + r * f), largura = Math.round(r * 1.35);
      for (let y = yy; y < yy + esp; y++) for (let x = ax - largura; x <= ax + largura; x++) ponto(x, y, this.mix(doCeu(y), c1, .45));
    }
    cc.putImageData(img, 0, 0);

    /* as estrelas e a cadente (só de noite), as nuvens e os vagalumes */
    const longeDoAstro = (x, y) => (x - ax) ** 2 + (y - ay) ** 2 > (r + 8) ** 2;
    e.estrelas = [];
    if (noite){
      const n = Math.min(160, Math.round(cw * e.vha * .0035));
      for (let i = 0; i < n; i++){
        const x = Math.floor(rnd() * cw), y = Math.floor(rnd() * e.vha * .62);
        if (!longeDoAstro(x, y)) continue;
        const f = doCeu(y);
        e.estrelas.push({x, y, grande:rnd() < .08, fase:rnd() * 6.3, vel:.6 + rnd() * 1.8,
          cores:['#ffffff', this.css(this.mix(f, [255, 255, 255], .6)), this.css(this.mix(f, [255, 255, 255], .25))]});
      }
    }
    e.proximaCadente = 4 + rnd() * 6;
    const meio = corEm(.25);
    const nuvem = noite ? this.mix(meio, [255, 255, 255], .12) : per === 'manha' ? [255, 226, 214] : per === 'tarde' ? [255, 192, 164] : [255, 255, 255];
    e.nuvens = [[.17, .2, .55], [.11, .36, .85], [.21, .09, .38], [.09, .48, 1.05]].map(([fw, fy, vel]) => {
      const w = Math.max(12, Math.round(cw * fw * (estreito ? 1.7 : 1))), h = Math.max(4, Math.round(w * .24)), alto = Math.round(w * .5);
      const folha = this.folha(w, alto), fc = folha.getContext('2d'), im = fc.createImageData(w, alto), b = new Uint32Array(im.data.buffer);
      const dentro = (x, y) => {
        if (x < 0 || y < 0 || x >= w || y >= alto) return false;
        const base = alto - h;
        if (y >= base){ const rr = h / 2, cxl = rr, cxr = w - rr, yc = base + rr; if (x >= cxl && x <= cxr) return true; const ex = x < cxl ? x - cxl : x - cxr; return ex * ex + (y - yc) ** 2 <= rr * rr; }
        return (x - w * .36) ** 2 + (y - base) ** 2 <= (w * .22) ** 2 || (x - w * .64) ** 2 + (y - base - h * .1) ** 2 <= (w * .16) ** 2;
      };
      const y0 = Math.round(e.vha * fy);
      const sombra = this.num(this.mix(nuvem, doCeu(y0 + alto), .3)), corN = this.num(nuvem);
      for (let y = 0; y < alto; y++) for (let x = 0; x < w; x++) if (dentro(x + .5, y + .5)) b[y * w + x] = dentro(x + .5, y + 1.5) ? corN : sombra;
      fc.putImageData(im, 0, 0);
      return {cv:folha, w, y:y0, x0:rnd() * (cw + w), vel:vel * (estreito ? .7 : 1)};
    });

    /* o chão: o desenho de 1440×600 encostado embaixo, cobrindo a largura */
    const tch = Math.max(vh * .6, 340) / px;
    e.s = Math.max(cw / 1440, tch / 600);
    e.ox = (cw - 1440 * e.s) / 2; e.oy = ch - 600 * e.s;
    e.rasc = this.folha(cw, ch);
    const cores = {};
    for (const n of ['serra-1', 'serra-2', 'mata', 'morro', 'capim', 'capim-2', 'trilha', 'tronco', 'arvore', 'copa-luz', 'parede', 'telhado', 'janela', 'madeira', 'madeira-2']) cores[n] = C(n);
    const camadas = this.caminhos();
    const desenhar = lista => {
      const folha = this.folha(cw, ch), fc = folha.getContext('2d'), im = fc.createImageData(cw, ch), b = new Uint32Array(im.data.buffer);
      for (const [cor, d] of lista){
        if (cor === '@nevoa'){
          /* a névoa no pé da serra de longe, em pontilhado ordenado */
          const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
          const nv = C('nevoa'), s1 = this.num(cores['serra-1']);
          const claro = this.num(this.mix(cores['serra-1'], nv, Math.min(.6, (nv[3] || 1) * 1.5)));
          const y0 = Math.max(0, Math.floor(e.oy + d[0] * e.s)), y1 = Math.min(ch - 1, Math.ceil(e.oy + d[1] * e.s));
          for (let y = y0; y <= y1; y++){
            const lim = (1 - Math.abs((y - y0) / Math.max(1, y1 - y0) * 2 - 1)) * .8 * 16;
            for (let x = 0; x < cw; x++){ const i = y * cw + x; if (b[i] === s1 && BAYER[(y & 3) * 4 + (x & 3)] < lim) b[i] = claro; }
          }
          continue;
        }
        this.pintar(b, e, d, cores[cor]);
      }
      fc.putImageData(im, 0, 0);
      return folha;
    };
    e.fundo = desenhar(camadas.fundo);
    e.tufos = [desenhar([['capim-2', camadas.tufos(0)]]), desenhar([['capim-2', camadas.tufos(5)]])];
    e.frente = desenhar(camadas.frente);
    e.rasc = null;

    /* os vagalumes da noite, rente ao morro */
    e.vagalumes = noite ? Array.from({length:8}, () => ({
      x:e.ox + (220 + rnd() * 1000) * e.s, y:e.oy + (446 + rnd() * 70) * e.s, fase:rnd() * 6.3, vel:.4 + rnd() * .6
    })) : [];
    e.pronto = true;
    this.quadro();
  },

  /* ---------- um quadro ---------- */
  quadro(){
    const e = this._e;
    if (!e || !e.pronto) return;
    if (!e.cv.isConnected){ this.parar(); return; }
    if (typeof document !== 'undefined' && document.hidden) return;
    const t = (Date.now() - e.inicio) / 1000, c = e.ctx;
    c.imageSmoothingEnabled = false;
    c.drawImage(e.ceu, 0, 0);
    /* as estrelas piscam cada uma no seu ritmo */
    for (const s of e.estrelas){
      const b = Math.sin(t * s.vel + s.fase);
      c.fillStyle = s.cores[b > .55 ? 0 : b > -.3 ? 1 : 2];
      c.fillRect(s.x, s.y, 1, 1);
      if (s.grande && b > .2){ c.fillRect(s.x - 1, s.y, 3, 1); c.fillRect(s.x, s.y - 1, 1, 3); }
    }
    /* a cadente: de tempos em tempos, um risco que desce pro lado */
    if (e.estrelas.length){
      const dt = t - e.proximaCadente;
      if (dt > 1.2){ e.proximaCadente = t + 7 + Math.random() * 8; e.cadente = null; }
      else if (dt >= 0){
        if (!e.cadente) e.cadente = {x:Math.random() * e.cw * .6, y:Math.random() * e.vha * .25};
        const passo = Math.floor(dt * 24);
        for (let k = 0; k < 6; k++){
          const x = Math.round(e.cadente.x + (passo - k) * 2), y = Math.round(e.cadente.y + (passo - k));
          c.fillStyle = k === 0 ? '#ffffff' : k < 3 ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.35)';
          c.fillRect(x, y, k === 0 ? 2 : 1, 1);
        }
      }
    }
    /* as nuvens andam devagar e dão a volta */
    for (const n of e.nuvens) c.drawImage(n.cv, Math.round(((n.x0 + t * n.vel) % (e.cw + n.w)) - n.w), n.y);
    c.drawImage(e.fundo, 0, 0);
    c.drawImage(e.tufos[Math.floor(t / .7) % 2], 0, 0);
    c.drawImage(e.frente, 0, 0);
    /* os vagalumes acendem e apagam */
    for (const v of e.vagalumes){
      const b = Math.sin(t * 2.2 * v.vel + v.fase);
      if (b < -.2) continue;
      c.fillStyle = b > .5 ? '#fff6a6' : '#c9b84a';
      c.fillRect(Math.round(v.x + Math.sin(t * v.vel + v.fase) * 3), Math.round(v.y + Math.cos(t * v.vel * .8 + v.fase) * 2), 1, 1);
    }
  }
};
