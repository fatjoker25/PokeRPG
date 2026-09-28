/* ============================================================
   EFEITOS DE BATALHA — o turno encenado
   O motor resolve o turno inteiro de uma vez e devolve a lista de
   eventos, cada um com a foto dos dois lutadores naquele instante
   (Batalha.ev). Aqui a lista é tocada um evento por vez: a linha
   entra no log, e o que mudou entre uma foto e a outra vira
   animação — golpe, dano, cura, condição nova, troca de lutador.

   Nada aqui decide nada. Se um evento não tem animação, ele só
   escreve a linha; se o jogador pediu menos movimento, só as
   linhas e as barras.

   Arte: os endereços de efeito dos roteiros (fire_slash, water_beam,
   heal_sparkle, status_burn…) apontam pra ÍCONES DE ITEM da PokeAPI —
   Fire Stone, Water Stone, Potion, Burn Heal. Uma pedra voando não é
   brasa, então os efeitos são desenhados em CSS, no espírito de cada
   pedido: brasas em linha reta, jato que cresce e ondula, faísca
   amarela piscando, anel que abre, bolha roxa, chama que sobe.

   Regra de sempre: o sprite NUNCA recebe filter. Cor por cima do
   Pokémon é um clone sem .sprite, pintado por filtro SVG que só lê o
   alfa (a cor dele nunca entra, então silhueta continua silhueta).
   ============================================================ */

const COR_EFEITO = {
  paralisia:'#FFFF00', queimadura:'#FF5500', veneno:'#AA00AA',
  cura:'#50FF50', fogo:'#FF2A1A', gelo:'#9FE8FF', sono:'#B8B8FF'
};

/* golpe que sacode o chão: a arena inteira treme */
const GOLPES_DE_CHAO = new Set(['Earthquake', 'Magnitude', 'Fissure', 'Bulldoze']);

const ROTULO_STATUS = {
  paralisia:['PAR', 'paralisado'], queimadura:['BRN', 'queimado'], veneno:['PSN', 'envenenado'],
  sono:['SLP', 'dormindo'], congelamento:['FRZ', 'congelado']
};

const Efeitos = {
  reduzido(){ return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); },
  esperar(ms){ return new Promise(r => setTimeout(r, ms)); },
  tocar(el, quadros, ms, extra){
    if (!el || !el.animate) return Promise.resolve();
    return el.animate(quadros, Object.assign({duration:ms, easing:'ease-out'}, extra || {})).finished.catch(() => {});
  },

  arena(){ return document.getElementById('arena'); },
  camada(){
    const a = this.arena();
    if (!a) return null;
    let c = a.querySelector(':scope > .fx-camada');
    if (!c){ c = document.createElement('div'); c.className = 'fx-camada'; a.appendChild(c); }
    return c;
  },
  sprite(lado){ const a = this.arena(); return a && a.querySelector(`.lutador.${lado} .arte .sprite`); },

  /* onde está o bicho, em coordenadas da arena. A arte ocupa mais ou
     menos de 23% a 76% da altura do quadro (medido nas 251). */
  alvo(lado){
    const a = this.arena(), s = this.sprite(lado);
    if (!a) return null;
    const A = a.getBoundingClientRect();
    const r = s ? s.getBoundingClientRect()
                : (a.querySelector(`.lutador.${lado} .arte`) || a).getBoundingClientRect();
    const x = r.left - A.left, y = r.top - A.top;
    return {x, y, w:r.width, h:r.height,
            cx: x + r.width / 2, cy: y + r.height * 0.52, pe: y + r.height * 0.76,
            topo: y + r.height * 0.24};
  },

  /* partícula solta na camada, já no lugar; some sozinha no fim */
  particula(cls, x, y, estilo){
    const c = this.camada();
    if (!c) return null;
    const e = document.createElement('span');
    e.className = 'fx ' + cls;
    e.style.left = x + 'px'; e.style.top = y + 'px';
    if (estilo) Object.assign(e.style, estilo);
    c.appendChild(e);
    return e;
  },
  soltar(e, quadros, ms, extra){
    return this.tocar(e, quadros, ms, extra).then(() => e && e.remove());
  },

  /* ---------- cor por cima do sprite, sem tocar no sprite ---------- */
  filtroDeCor(cor){
    const id = 'fx-cor-' + cor.replace('#', '').toLowerCase();
    if (!document.getElementById(id)){
      const caixa = document.createElement('div');
      caixa.setAttribute('aria-hidden', 'true');
      caixa.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      caixa.innerHTML = `<svg width="0" height="0"><filter id="${id}" color-interpolation-filters="sRGB">
        <feFlood flood-color="${cor}" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in"/>
      </filter></svg>`;
      document.body.appendChild(caixa);
    }
    return `url(#${id})`;
  },
  /* pisca uma cor por cima: `vezes` flashes em `ms` no total */
  tingir(lado, cor, ms, vezes, forca){
    const s = this.sprite(lado), c = this.camada(), t = this.alvo(lado);
    if (!s || !c || !t) return Promise.resolve();
    const m = document.createElement('img');
    m.className = 'fx-tinta';
    m.src = s.currentSrc || s.src; m.alt = '';
    Object.assign(m.style, {left:t.x + 'px', top:t.y + 'px', width:t.w + 'px', height:t.h + 'px',
                            filter:this.filtroDeCor(cor)});
    c.appendChild(m);
    const f = forca || .7, q = [];
    for (let i = 0; i < (vezes || 1); i++){ q.push({opacity:0}, {opacity:f}); }
    q.push({opacity:0});
    return this.tocar(m, q, ms || 360, {easing:'linear'}).then(() => m.remove());
  },
  tremer(lado, ms, amp){
    const s = this.sprite(lado), a = amp || 5;
    return this.tocar(s, [{transform:'translateX(0)'}, {transform:`translateX(-${a}px)`},
      {transform:`translateX(${a}px)`}, {transform:`translateX(-${a}px)`},
      {transform:`translateX(${a}px)`}, {transform:'translateX(0)'}], ms || 320, {easing:'linear'});
  },
  /* reação ao impacto: 100% → 0% → 100%, três vezes */
  piscar(lado){
    const s = this.sprite(lado);
    const q = [];
    for (let i = 0; i < 3; i++) q.push({opacity:1}, {opacity:0});
    q.push({opacity:1});
    return this.tocar(s, q, 480, {easing:'steps(1, end)'});
  },

  /* ---------- barra de HP que desliza ---------- */
  pintarHP(lado, foto, suave){
    const a = this.arena();
    if (!a || !foto) return;
    const ficha = a.querySelector(`.lutador.${lado} .ficha`);
    if (!ficha) return;
    const barra = ficha.querySelector('.barra'), i = barra && barra.querySelector('i');
    const pct = Math.max(0, (foto.hp / foto.hpMax) * 100);
    if (i){
      if (!suave){ i.style.transition = 'none'; i.style.width = pct + '%'; void i.offsetWidth; i.style.transition = ''; }
      else i.style.width = pct + '%';
      barra.classList.toggle('medio', pct <= 50 && pct > 22);
      barra.classList.toggle('baixo', pct <= 22);
    }
    const num = ficha.querySelector('.hp-num');
    if (num) num.textContent = `${foto.hp} / ${foto.hpMax} HP`;
    this.pintarStatus(lado, foto.status);
    this.pintarMarcas(lado, foto);
  },
  pintarMarcas(lado, foto){
    const a = this.arena();
    const onde = a && a.querySelector(`.lutador.${lado} .ficha .marcas-luta`);
    if (!onde || !foto || !foto.marcas) return;
    const html = UI.marcasHTML(foto.marcas);
    if (onde.innerHTML !== html) onde.innerHTML = html;
  },
  pintarStatus(lado, st){
    const a = this.arena();
    const onde = a && a.querySelector(`.lutador.${lado} .ficha .linha-tipos`);
    if (!onde) return;
    const velho = onde.querySelector('.status-tag');
    if ((velho ? velho.dataset.st : null) === (st || null)) return;
    if (velho) velho.remove();
    if (st) onde.insertAdjacentHTML('beforeend', UI.etiquetaStatus(st));
  },

  /* ---------- golpes ----------
     Cada tipo tem o seu desenho. Golpe de corpo (físico) avança antes e
     o efeito do tipo acontece no alvo; golpe à distância (especial) sai
     de quem usou e chega em quem recebe. Golpe de raio é um feixe da cor
     do tipo, e o que sacode o chão sacode a arena inteira. */
  async golpe(lado, nome){
    const g = GOLPES[nome] || {};
    const outro = lado === 'aliado' ? 'inimigo' : 'aliado';
    const ef = g.ef || {};
    if (g.c === 'status'){
      /* golpe que sobe o próprio atributo abre o anel em quem usou */
      const quem = (ef.sobe || ef.cura) ? lado : outro;
      return this.anel(quem, COR_TIPO[g.t] || '#d8d8ff');
    }
    const fis = g.c === 'fis';
    if (GOLPES_DE_CHAO.has(nome)) return this.terremoto(outro);
    if (/Beam$|^Solar Beam$|^Psybeam$/.test(nome)) return this.feixe(lado, outro, COR_TIPO[g.t] || '#fff', g.t);
    if (fis) await this.avancar(lado, outro);
    const f = this.porTipo[g.t];
    if (f) return f.call(this, lado, outro, fis);
    return fis ? this.garras(outro) : this.orbe(lado, outro, COR_TIPO[g.t] || '#ffffff');
  },

  porTipo: {
    Fogo(l, o){ return this.brasas(l, o); },
    'Água'(l, o){ return this.jato(o); },
    'Elétrico'(l, o){ return this.faisca(o); },
    Normal(l, o, fis){ return fis ? Promise.all([this.garras(o), this.estrelas(o, '#fff7cf')]) : this.orbe(l, o, '#ffffff', true); },
    Grama(l, o, fis){ return this.folhas(l, o, fis); },
    Gelo(l, o){ return this.cristais(o); },
    Lutador(l, o){ return this.impacto(o, '#ffb24a'); },
    Venenoso(l, o, fis){ return this.veneno(l, o, fis); },
    Terrestre(l, o){ return this.poeira(o, true); },
    Voador(l, o, fis){ return fis ? Promise.all([this.estrelas(o, '#eef4ff'), this.vento(o, 1)]) : this.vento(o, 3); },
    'Psíquico'(l, o){ return this.psiquico(o); },
    Inseto(l, o){ return this.ferroes(l, o); },
    Pedra(l, o){ return this.pedras(o); },
    Fantasma(l, o){ return this.sombra(o); },
    'Dragão'(l, o){ return this.dragao(l, o); },
    Sombrio(l, o){ return Promise.all([this.garras(o, true), this.tingir(o, '#2a1f33', 420, 2, .7)]); },
    'Metálico'(l, o){ return this.metal(o); }
  },

  /* corpo a corpo: avança 15 px na direção do alvo e volta */
  async avancar(lado, outro){
    const s = this.sprite(lado);
    const t = this.alvo(lado), u = this.alvo(outro);
    if (!t || !u) return;
    const dx = Math.sign(u.cx - t.cx) * 15, dy = Math.sign(u.cy - t.cy) * 6;
    await this.tocar(s, [{transform:'translate(0,0)'}, {transform:`translate(${dx}px,${dy}px)`},
                         {transform:'translate(0,0)'}], 260, {easing:'ease-in-out'});
  },
  /* três riscos de garra no alvo (escuros no golpe Sombrio) */
  async garras(outro, escura){
    const u = this.alvo(outro);
    if (!u) return;
    await Promise.all([-12, 0, 12].map((d, i) => {
      const e = this.particula('fx-garra' + (escura ? ' escura' : ''), u.cx + d - 4, u.cy - 22);
      return this.soltar(e, [{transform:'rotate(28deg) scaleY(0)', opacity:1},
                             {transform:'rotate(28deg) scaleY(1)', opacity:1, offset:.55},
                             {transform:'rotate(28deg) scaleY(1)', opacity:0}], 300, {delay:i * 45});
    }));
  },
  /* compatibilidade: quem chamava investida continua chamando */
  async investida(lado, outro){ await this.avancar(lado, outro); return this.garras(outro); },

  /* estrelinhas de impacto espirrando do ponto atingido */
  estrelas(outro, cor){
    const u = this.alvo(outro);
    if (!u) return Promise.resolve();
    return Promise.all([0, 1, 2, 3, 4].map(i => {
      const ang = (i / 5) * Math.PI * 2 + .4, r = 30;
      const e = this.particula('fx-estrela', u.cx, u.cy, {background:cor});
      return this.soltar(e, [{transform:'translate(-50%,-50%) scale(.4)', opacity:1},
        {transform:`translate(calc(-50% + ${Math.cos(ang) * r}px), calc(-50% + ${Math.sin(ang) * r}px)) scale(1.3)`, opacity:0}],
        380, {delay:i * 20});
    }));
  },
  /* explosão de impacto: estrela grande que abre e some, e o alvo sacode */
  impacto(outro, cor){
    const u = this.alvo(outro);
    if (!u) return Promise.resolve();
    const e = this.particula('fx-impacto', u.cx, u.cy, {background:`radial-gradient(circle,#fff 0 25%,${cor} 55%,transparent 70%)`});
    return Promise.all([
      this.soltar(e, [{transform:'translate(-50%,-50%) scale(.2) rotate(0deg)', opacity:1},
                      {transform:'translate(-50%,-50%) scale(1.1) rotate(20deg)', opacity:1, offset:.45},
                      {transform:'translate(-50%,-50%) scale(1.4) rotate(30deg)', opacity:0}], 380),
      this.tremer(outro, 380, 8), this.estrelas(outro, cor)]);
  },

  /* grama: folhas girando do atacante ao alvo; no corpo a corpo, o
     chicote cruza o alvo e as folhas espirram dele */
  async folhas(lado, outro, fis){
    const t = this.alvo(lado), u = this.alvo(outro);
    if (!t || !u) return;
    const voo = [];
    if (fis){
      [0, 1].forEach(i => {
        const e = this.particula('fx-chicote', u.cx, u.cy);
        voo.push(this.soltar(e, [{transform:`translate(-50%,-50%) rotate(${i ? 35 : -35}deg) scaleX(0)`, opacity:1},
                                 {transform:`translate(-50%,-50%) rotate(${i ? 35 : -35}deg) scaleX(1)`, opacity:1, offset:.5},
                                 {transform:`translate(-50%,-50%) rotate(${i ? 35 : -35}deg) scaleX(1)`, opacity:0}], 320, {delay:i * 120}));
      });
    }
    for (let i = 0; i < (fis ? 4 : 7); i++){
      const de = fis ? u : t, y0 = (i % 3 - 1) * 14;
      const e = this.particula('fx-folha', de.cx, de.cy + y0);
      const dx = fis ? (i % 2 ? 1 : -1) * (30 + i * 6) : u.cx - t.cx, dy = fis ? -20 - i * 6 : u.cy - t.cy - y0;
      voo.push(this.soltar(e, [
        {transform:'translate(-50%,-50%) rotate(0deg) scale(.7)', opacity:0},
        {transform:'translate(-50%,-50%) rotate(120deg) scale(1)', opacity:1, offset:.15},
        {transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${540 + i * 40}deg) scale(1)`, opacity:1, offset:.88},
        {transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${600 + i * 40}deg) scale(.6)`, opacity:0}
      ], 520, {delay:i * 55, easing:'ease-in'}));
    }
    await Promise.all([...voo, this.esperar(fis ? 200 : 420).then(() => this.tingir(outro, '#4CC44C', 360, 2, .55))]);
  },

  /* gelo: cristais vindo de todos os lados e fechando no alvo, que fica azul */
  async cristais(outro){
    const u = this.alvo(outro);
    if (!u) return;
    const c = [0, 1, 2, 3, 4, 5].map(i => {
      const ang = (i / 6) * Math.PI * 2, r = 58;
      const e = this.particula('fx-cristal', u.cx + Math.cos(ang) * r, u.cy + Math.sin(ang) * r);
      return this.soltar(e, [{transform:`translate(-50%,-50%) rotate(${i * 60}deg) scale(.5)`, opacity:0},
        {transform:`translate(-50%,-50%) rotate(${i * 60 + 45}deg) scale(1)`, opacity:1, offset:.3},
        {transform:`translate(calc(-50% + ${-Math.cos(ang) * r}px), calc(-50% + ${-Math.sin(ang) * r}px)) rotate(${i * 60 + 90}deg) scale(.8)`, opacity:1, offset:.85},
        {transform:`translate(calc(-50% + ${-Math.cos(ang) * r}px), calc(-50% + ${-Math.sin(ang) * r}px)) scale(1.5)`, opacity:0}],
        480, {delay:i * 35, easing:'ease-in'});
    });
    await Promise.all([...c, this.esperar(380).then(() => this.tingir(outro, COR_EFEITO.gelo, 460, 1, .75))]);
  },

  /* veneno: gotas roxas em arco até o alvo (ou borbulhando nele) */
  async veneno(lado, outro, fis){
    const t = this.alvo(lado), u = this.alvo(outro);
    if (!t || !u) return;
    const p = [];
    for (let i = 0; i < 5; i++){
      if (fis){
        const e = this.particula('fx-bolha', u.cx - 22 + i * 11, u.cy + (i % 2) * 10);
        p.push(this.soltar(e, [{transform:'translate(-50%,-50%) scale(.3)', opacity:0},
          {transform:'translate(-50%,-50%) scale(1.2)', opacity:1, offset:.4},
          {transform:'translate(-50%,calc(-50% - 24px)) scale(.8)', opacity:0}], 520, {delay:i * 50}));
      } else {
        const e = this.particula('fx-bolha', t.cx, t.cy);
        const dx = u.cx - t.cx, dy = u.cy - t.cy, arco = -40 - i * 6;
        p.push(this.soltar(e, [{transform:'translate(-50%,-50%) scale(.6)', opacity:0},
          {transform:`translate(calc(-50% + ${dx * .5}px), calc(-50% + ${dy * .5 + arco}px)) scale(1.2)`, opacity:1, offset:.5},
          {transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.4)`, opacity:1, offset:.92},
          {transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(2)`, opacity:0}], 520, {delay:i * 60, easing:'linear'}));
      }
    }
    await Promise.all([...p, this.esperar(360).then(() => this.tingir(outro, COR_EFEITO.veneno, 420, 2, .55))]);
  },

  /* terra: nuvem de poeira no pé do alvo; `chao` sacode a arena */
  async poeira(outro, chao){
    const u = this.alvo(outro);
    if (!u) return;
    const p = [0, 1, 2, 3, 4, 5].map(i => {
      const e = this.particula('fx-poeira', u.cx - 30 + i * 12, u.pe);
      return this.soltar(e, [{transform:'translate(-50%,-50%) scale(.3)', opacity:.9},
        {transform:`translate(calc(-50% + ${(i - 2.5) * 6}px), calc(-50% - ${14 + (i % 3) * 8}px)) scale(1.4)`, opacity:0}], 560, {delay:i * 30});
    });
    const sacode = chao ? this.tremer(outro, 420, 7) : Promise.resolve();
    await Promise.all([...p, sacode, this.tingir(outro, '#b0863a', 420, 1, .45)]);
  },
  /* Earthquake e parentes: o chão inteiro treme, e os dois sentem */
  async terremoto(outro){
    const a = this.arena();
    const q = [];
    for (let i = 0; i < 8; i++) q.push({transform:`translate(${i % 2 ? 6 : -6}px, ${i % 3 ? 2 : -2}px)`});
    q.push({transform:'translate(0,0)'});
    await Promise.all([this.tocar(a, q, 620, {easing:'linear'}), this.poeira(outro, false)]);
  },

  /* vento: lâminas de ar cortando o alvo na horizontal */
  vento(outro, n){
    const u = this.alvo(outro);
    if (!u) return Promise.resolve();
    return Promise.all(Array.from({length:n}, (_, i) => {
      const y = u.cy - 18 + i * 18;
      const e = this.particula('fx-vento', u.cx - 70, y);
      return this.soltar(e, [{transform:'translate(-50%,-50%) scaleX(.3)', opacity:0},
        {transform:'translate(-50%,-50%) scaleX(1)', opacity:1, offset:.3},
        {transform:'translate(calc(-50% + 140px),-50%) scaleX(1)', opacity:0}], 420, {delay:i * 90, easing:'ease-in'});
    }).concat([this.tremer(outro, 300, 4)]));
  },

  /* psíquico: anéis rosa pulsando para dentro, e o alvo ondula */
  async psiquico(outro){
    const u = this.alvo(outro), s = this.sprite(outro);
    if (!u) return;
    const an = [0, 1, 2].map(i => {
      const e = this.particula('fx-anel', u.cx, u.cy, {borderColor:'#ff6fae', boxShadow:'0 0 12px #ff6fae'});
      return this.soltar(e, [{transform:'translate(-50%,-50%) scale(1.5)', opacity:0},
        {transform:'translate(-50%,-50%) scale(1)', opacity:.95, offset:.4},
        {transform:'translate(-50%,-50%) scale(.2)', opacity:0}], 520, {delay:i * 140});
    });
    const onda = this.tocar(s, [{transform:'skewX(0)'}, {transform:'skewX(10deg)'}, {transform:'skewX(-10deg)'},
      {transform:'skewX(6deg)'}, {transform:'skewX(0)'}], 620, {easing:'ease-in-out'});
    await Promise.all([...an, onda, this.tingir(outro, '#ff6fae', 560, 2, .5)]);
  },

  /* inseto: ferrões rápidos em rajada até o alvo */
  async ferroes(lado, outro){
    const t = this.alvo(lado), u = this.alvo(outro);
    if (!t || !u) return;
    const dx = u.cx - t.cx, dy = u.cy - t.cy, ang = Math.atan2(dy, dx) * 180 / Math.PI;
    const f = [0, 1, 2, 3, 4].map(i => {
      const oy = (i % 3 - 1) * 10;
      const e = this.particula('fx-ferrao', t.cx, t.cy + oy);
      return this.soltar(e, [{transform:`translate(-50%,-50%) rotate(${ang}deg)`, opacity:0},
        {transform:`translate(-50%,-50%) rotate(${ang}deg)`, opacity:1, offset:.1},
        {transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy - oy}px)) rotate(${ang}deg)`, opacity:1, offset:.9},
        {transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy - oy}px)) rotate(${ang}deg)`, opacity:0}], 300, {delay:i * 70, easing:'linear'});
    });
    await Promise.all([...f, this.esperar(260).then(() => Promise.all([this.tremer(outro, 320, 4), this.tingir(outro, '#9cc02a', 320, 2, .5)]))]);
  },

  /* pedra: pedras caindo de cima no alvo, e ele sacode */
  async pedras(outro){
    const u = this.alvo(outro);
    if (!u) return;
    const p = [-22, 4, 22, -6].map((dx, i) => {
      const e = this.particula('fx-pedra', u.cx + dx, u.topo - 60);
      return this.soltar(e, [{transform:'translate(-50%,-50%) rotate(0deg)', opacity:0},
        {transform:'translate(-50%,-50%) rotate(40deg)', opacity:1, offset:.15},
        {transform:`translate(-50%, calc(-50% + ${u.cy - u.topo + 60}px)) rotate(160deg)`, opacity:1, offset:.8},
        {transform:`translate(-50%, calc(-50% + ${u.cy - u.topo + 50}px)) rotate(180deg) scale(.6)`, opacity:0}], 460, {delay:i * 90, easing:'ease-in'});
    });
    await Promise.all([...p, this.esperar(400).then(() => Promise.all([this.tremer(outro, 380, 7), this.poeira(outro, false)]))]);
  },

  /* fantasma: sombra roxa subindo em volta do alvo, que some pela metade */
  async sombra(outro){
    const u = this.alvo(outro), s = this.sprite(outro);
    if (!u) return;
    const p = [0, 1, 2, 3, 4].map(i => {
      const e = this.particula('fx-sombra', u.cx - 26 + i * 13, u.pe);
      return this.soltar(e, [{transform:'translate(-50%,-50%) scale(.5)', opacity:0},
        {transform:'translate(-50%,calc(-50% - 20px)) scale(1.2)', opacity:.85, offset:.4},
        {transform:`translate(-50%,calc(-50% - ${u.h * .5}px)) scale(1.6)`, opacity:0}], 700, {delay:i * 70});
    });
    const some = this.tocar(s, [{opacity:1}, {opacity:.35}, {opacity:1}], 700, {easing:'ease-in-out'});
    await Promise.all([...p, some, this.tingir(outro, '#3a2a6a', 640, 1, .6)]);
  },

  /* dragão: chama azul-violeta viajando em onda até o alvo */
  async dragao(lado, outro){
    const t = this.alvo(lado), u = this.alvo(outro);
    if (!t || !u) return;
    const dx = u.cx - t.cx, dy = u.cy - t.cy;
    const v = [0, 1, 2, 3, 4, 5, 6].map(i => {
      const e = this.particula('fx-dragao', t.cx, t.cy);
      const q = [];
      for (let k = 0; k <= 4; k++){
        const f = k / 4, onda = Math.sin(f * Math.PI * 2 + i * .6) * 16;
        q.push({transform:`translate(calc(-50% + ${dx * f}px), calc(-50% + ${dy * f + onda}px)) scale(${.6 + f * .8})`, opacity:k === 0 || k === 4 ? 0 : 1});
      }
      return this.soltar(e, q, 560, {delay:i * 50, easing:'linear'});
    });
    await Promise.all([...v, this.esperar(480).then(() => this.tingir(outro, '#6a5cff', 420, 2, .6))]);
  },

  /* metálico: lâmina prateada cruzando o alvo e um brilho */
  async metal(outro){
    const u = this.alvo(outro);
    if (!u) return;
    const l = [0, 1].map(i => {
      const e = this.particula('fx-lamina', u.cx, u.cy);
      return this.soltar(e, [{transform:`translate(-50%,-50%) rotate(${i ? -40 : 40}deg) scaleX(0)`, opacity:1},
        {transform:`translate(-50%,-50%) rotate(${i ? -40 : 40}deg) scaleX(1)`, opacity:1, offset:.5},
        {transform:`translate(-50%,-50%) rotate(${i ? -40 : 40}deg) scaleX(1.1)`, opacity:0}], 320, {delay:i * 110});
    });
    await Promise.all([...l, this.estrelas(outro, '#e8eef6'), this.tingir(outro, '#d8dee8', 360, 2, .6)]);
  },

  /* raio: feixe reto da cor do tipo, do atacante ao alvo */
  async feixe(lado, outro, cor, tipo){
    const t = this.alvo(lado), u = this.alvo(outro);
    if (!t || !u) return;
    const dx = u.cx - t.cx, dy = u.cy - t.cy;
    const comp = Math.hypot(dx, dy), ang = Math.atan2(dy, dx) * 180 / Math.PI;
    const e = this.particula('fx-feixe', t.cx, t.cy, {width:comp + 'px',
      background:`linear-gradient(180deg, transparent, ${cor} 30%, #fff 50%, ${cor} 70%, transparent)`,
      boxShadow:`0 0 12px ${cor}`, transform:`translate(0,-50%) rotate(${ang}deg)`});
    const f = this.soltar(e, [{transform:`translate(0,-50%) rotate(${ang}deg) scaleX(0)`, opacity:1},
      {transform:`translate(0,-50%) rotate(${ang}deg) scaleX(1)`, opacity:1, offset:.35},
      {transform:`translate(0,-50%) rotate(${ang}deg) scaleX(1) scaleY(1.4)`, opacity:1, offset:.75},
      {transform:`translate(0,-50%) rotate(${ang}deg) scaleX(1) scaleY(.2)`, opacity:0}], 640, {easing:'ease-out'});
    const reacao = tipo === 'Gelo' ? this.tingir(outro, COR_EFEITO.gelo, 500, 1, .7)
                 : Promise.all([this.tremer(outro, 400, 6), this.tingir(outro, cor, 460, 2, .55)]);
    await Promise.all([f, this.esperar(220).then(() => reacao)]);
  },

  /* fogo: brasas repetidas em linha reta, do atacante ao alvo, e um
     clarão vermelho no alvo quando chegam */
  async brasas(lado, outro){
    const t = this.alvo(lado), u = this.alvo(outro);
    if (!t || !u) return;
    const voo = [];
    for (let i = 0; i < 6; i++){
      const e = this.particula('fx-brasa', t.cx, t.cy);
      voo.push(this.soltar(e, [
        {transform:'translate(-50%,-50%) scale(.6)', opacity:0},
        {transform:'translate(-50%,-50%) scale(1)', opacity:1, offset:.15},
        {transform:`translate(calc(-50% + ${u.cx - t.cx}px), calc(-50% + ${u.cy - t.cy}px)) scale(1.2)`, opacity:1, offset:.9},
        {transform:`translate(calc(-50% + ${u.cx - t.cx}px), calc(-50% + ${u.cy - t.cy}px)) scale(1.6)`, opacity:0}
      ], 420, {delay:i * 70, easing:'linear'}));
    }
    await this.esperar(420);
    await Promise.all([...voo, this.tingir(outro, COR_EFEITO.fogo, 360, 2, .65)]);
  },

  /* água: jato que cresce de 0 a 100% no centro do alvo, com ondulação */
  async jato(outro){
    const u = this.alvo(outro);
    if (!u) return;
    const e = this.particula('fx-agua', u.cx, u.cy);
    const ondas = [0, 1, 2].map(i => {
      const o = this.particula('fx-onda', u.cx, u.cy);
      return this.soltar(o, [{transform:'translate(-50%,-50%) scale(.2)', opacity:.9},
                             {transform:'translate(-50%,-50%) scale(1.5)', opacity:0}], 520, {delay:180 + i * 120});
    });
    await Promise.all([this.soltar(e, [
      {transform:'translate(-50%,-50%) scale(0)', opacity:.95},
      {transform:'translate(-50%,-50%) scale(1)', opacity:.95, offset:.55},
      {transform:'translate(-50%,-50%) scale(1.05)', opacity:0}], 560), ...ondas]);
  },

  /* elétrico: faísca piscando em amarelo em cima do alvo, e ele treme */
  async faisca(outro){
    const u = this.alvo(outro);
    if (!u) return;
    const pos = [[-20, -18], [16, -6], [-4, 14]];
    const f = pos.map(([dx, dy], i) => {
      const e = this.particula('fx-faisca', u.cx + dx, u.cy + dy);
      return this.soltar(e, [{opacity:0}, {opacity:1}, {opacity:0}, {opacity:1}, {opacity:0}, {opacity:1}, {opacity:0}],
                         420, {delay:i * 40, easing:'steps(1, end)'});
    });
    await Promise.all([...f, this.tingir(outro, COR_EFEITO.paralisia, 420, 3, .55), this.tremer(outro, 420, 6)]);
  },

  /* status: anel que abre em volta de quem recebe */
  async anel(lado, cor){
    const u = this.alvo(lado);
    if (!u) return;
    const an = [0, 1].map(i => {
      const e = this.particula('fx-anel', u.cx, u.cy, {borderColor:cor, boxShadow:`0 0 10px ${cor}`});
      return this.soltar(e, [{transform:'translate(-50%,-50%) scale(.3)', opacity:.95},
                             {transform:'translate(-50%,-50%) scale(1.25)', opacity:0}], 620, {delay:i * 160});
    });
    await Promise.all(an);
  },

  /* especial de outros tipos: uma esfera da cor do tipo, do atacante ao alvo */
  async orbe(lado, outro, cor, clarao){
    const t = this.alvo(lado), u = this.alvo(outro);
    if (!t || !u) return;
    const e = this.particula('fx-orbe', t.cx, t.cy, {background:`radial-gradient(circle, #fff 0 22%, ${cor} 48%, transparent 72%)`});
    await this.soltar(e, [
      {transform:'translate(-50%,-50%) scale(.5)', opacity:0},
      {transform:'translate(-50%,-50%) scale(1)', opacity:1, offset:.2},
      {transform:`translate(calc(-50% + ${u.cx - t.cx}px), calc(-50% + ${u.cy - t.cy}px)) scale(1.1)`, opacity:1, offset:.85},
      {transform:`translate(calc(-50% + ${u.cx - t.cx}px), calc(-50% + ${u.cy - t.cy}px)) scale(2)`, opacity:0}], 460, {easing:'ease-in'});
    if (clarao) await this.estrelas(outro, '#ffffff');
  },

  /* ---------- cura: brilho verde subindo e tinta verde clara ---------- */
  async cura(lado){
    const u = this.alvo(lado);
    if (!u) return;
    const p = [];
    for (let i = 0; i < 7; i++){
      const x = u.cx + (i % 2 ? 1 : -1) * (6 + (i * 9) % 28);
      const e = this.particula('fx-cura', x, u.pe - 6);
      p.push(this.soltar(e, [{transform:'translate(-50%,0) scale(.6)', opacity:0},
                             {transform:'translate(-50%,-14px) scale(1)', opacity:1, offset:.3},
                             {transform:`translate(-50%,-${u.h * .5}px) scale(.8)`, opacity:0}], 700, {delay:i * 60}));
    }
    await Promise.all([...p, this.tingir(lado, COR_EFEITO.cura, 620, 1, .5)]);
  },

  /* ---------- condição: o efeito de cada uma ---------- */
  async condicao(lado, st, travou){
    const u = this.alvo(lado);
    if (!u) return;
    if (st === 'paralisia'){
      if (travou) return Promise.all([this.tingir(lado, COR_EFEITO.paralisia, 420, 3, .6), this.tremer(lado, 420, 7)]);
      return this.faisca(lado);
    }
    if (st === 'queimadura'){
      const ch = [0, 1, 2, 3].map(i => {
        const e = this.particula('fx-chama', u.cx - 18 + i * 12, u.pe - 4);
        return this.soltar(e, [{transform:'translate(-50%,0) scale(.5)', opacity:0},
                               {transform:'translate(-50%,-10px) scale(1)', opacity:1, offset:.35},
                               {transform:`translate(-50%,-${u.h * .42}px) scale(.6)`, opacity:0}], 620, {delay:i * 70});
      });
      return Promise.all([...ch, this.tingir(lado, COR_EFEITO.queimadura, 560, 2, .55)]);
    }
    if (st === 'veneno'){
      const b = [0, 1, 2, 3, 4].map(i => {
        const e = this.particula('fx-bolha', u.cx - 22 + i * 11, u.topo + (i % 2) * 10);
        return this.soltar(e, [{transform:'translate(-50%,-50%) scale(.3)', opacity:0},
                               {transform:'translate(-50%,-50%) scale(1)', opacity:1, offset:.4},
                               {transform:'translate(-50%,calc(-50% + 26px)) scale(.9)', opacity:0}], 640, {delay:i * 60});
      });
      return Promise.all([...b, this.tingir(lado, COR_EFEITO.veneno, 560, 2, .5)]);
    }
    if (st === 'congelamento') return this.tingir(lado, COR_EFEITO.gelo, 520, 1, .6);
    if (st === 'areia') return Promise.all([this.tingir(lado, '#C8A060', 420, 2, .5), this.tremer(lado, 300, 3)]);
    if (st === 'semente') return this.tingir(lado, '#6FCF4A', 460, 2, .55);
    if (st === 'maldicao') return Promise.all([this.tingir(lado, '#4B2A6B', 500, 2, .65), this.tremer(lado, 300, 3)]);
    if (st === 'pesadelo') return this.tingir(lado, '#2E2450', 520, 2, .6);
    if (st === 'preso') return Promise.all([this.tingir(lado, '#C9722E', 420, 2, .5), this.tremer(lado, 320, 4)]);
    if (st === 'apaixonado') return Promise.all([this.tingir(lado, '#FF7AB6', 420, 2, .55), this.anel(lado, '#FF7AB6')]);
    if (st === 'sono') return this.anel(lado, COR_EFEITO.sono);
  },

  /* chuva ou areia por cima de cada lutador (a ficha fica limpa), entrando
     e saindo devagar. Dentro da moldura de cada um porque no celular a
     arena empilha e cada lutador tem o próprio cenário. */
  pintarClima(tipo){
    const a = this.arena();
    if (!a) return;
    a.querySelectorAll('.lutador .arte').forEach(arte => {
      const velha = arte.querySelector('.clima-camada');
      if (velha){ velha.classList.add('saindo'); setTimeout(() => velha.remove(), 450); }
      if (tipo) arte.insertAdjacentHTML('beforeend', `<div class="clima-camada clima-${tipo} chegando" aria-hidden="true"></div>`);
    });
  },

  /* ---------- o turno inteiro ---------- */
  async encenar(eventos){
    const log = document.getElementById('log');
    const acoes = document.getElementById('acoes');
    const anima = !this.reduzido();
    if (acoes){ acoes.classList.add('esperando'); acoes.setAttribute('aria-busy', 'true'); }
    let ant = this.foto || {};
    for (const e of (eventos || [])){
      if (log){ log.appendChild(UI.el(`<div class="l ${UI.esc(e.tipo)}">${UI.esc(e.texto)}</div>`)); log.scrollTop = log.scrollHeight; }
      if (!anima){ ant = this.fotoDe(e, ant); continue; }
      try { await this.reagir(e, ant); } catch (err) { /* efeito quebrado não trava a luta */ }
      /* estágios e estados mudam no meio do turno: a ficha acompanha */
      if (e.fotoA && ant.A && e.fotoA.uid === ant.A.uid) this.pintarMarcas('aliado', e.fotoA);
      if (e.fotoI && ant.I && e.fotoI.uid === ant.I.uid) this.pintarMarcas('inimigo', e.fotoI);
      ant = this.fotoDe(e, ant);
    }
    this.foto = ant;
    const dd = document.getElementById('dados');
    if (dd){ dd.innerHTML = UI.htmlDados(); UI.girarNovos(); }
    if (acoes){ acoes.classList.remove('esperando'); acoes.removeAttribute('aria-busy'); }
  },
  fotoDe(e, ant){
    return {A: e.fotoA || ant.A, I: e.fotoI || ant.I, J: e.fotoJ !== undefined ? e.fotoJ : ant.J};
  },

  async reagir(e, ant){
    /* entrou outro lutador de algum lado: a arena se redesenha com a
       foto do instante, não com o fim do turno */
    const trocouA = e.fotoA && ant.A && e.fotoA.uid !== ant.A.uid;
    const trocouI = e.fotoI && ant.I && e.fotoI.uid !== ant.I.uid;
    if (trocouA || trocouI){
      UI.atualizarArena();
      this.pintarHP('aliado', e.fotoA, false);
      this.pintarHP('inimigo', e.fotoI, false);
      if (trocouA) await this.entrada(Batalha.aliado);
      else await this.esperar(420);
      return;
    }
    if (e.tipo === 'golpe' && e.lado){ await this.golpe(e.lado, e.golpe); return; }
    /* Transform: a arte troca na hora */
    if (e.transformou){
      UI.atualizarArena(); this.pintarHP('aliado', e.fotoA, false); this.pintarHP('inimigo', e.fotoI, false);
      await this.esperar(450); return;
    }
    if (e.clima !== undefined){ this.pintarClima(e.clima); await this.esperar(e.clima ? 700 : 300); return; }
    if (e.travou && e.lado){ await this.condicao(e.lado, e.travou, true); return; }

    const passos = [];
    for (const [lado, k] of [['aliado', 'A'], ['inimigo', 'I']]){
      const f = e['foto' + k], a = ant[k];
      if (!f || !a || f.uid !== a.uid) continue;
      if (f.status && f.status !== a.status && !e.causa)
        passos.push(this.condicao(lado, f.status).then(() => this.pintarStatus(lado, f.status)));
      else if (f.status !== a.status){
        this.pintarStatus(lado, f.status);
        if (!f.status && e.tipo === 'cura' && f.hp === a.hp) passos.push(this.cura(lado));
      }
      if (f.hp < a.hp){
        if (e.causa) await this.condicao(lado, e.causa);
        else passos.push(this.piscar(lado));
        this.pintarHP(lado, f, true);
        passos.push(this.esperar(560));
      } else if (f.hp > a.hp){
        passos.push(this.cura(lado));
        this.pintarHP(lado, f, true);
        passos.push(this.esperar(560));
      }
    }
    /* o selvagem acertou você */
    if (e.fotoJ !== undefined && ant.J !== undefined && e.fotoJ < ant.J){
      const ar = this.arena();
      passos.push(this.tocar(ar, [{transform:'translate(0,0)'}, {transform:'translate(-6px,2px)'},
        {transform:'translate(5px,-2px)'}, {transform:'translate(-3px,1px)'}, {transform:'translate(0,0)'}], 320));
      UI.pintarVidaJogador(e.fotoJ, true);
    }
    if (passos.length) await Promise.all(passos);
    else if (e.tipo === 'dano' || e.tipo === 'cura') await this.esperar(160);
  },

  /* ========================================================
     ENTRADA DO SEU POKÉMON — a sequência dos jogos
       1 ARREMESSO  a bola dele sai do canto de baixo à esquerda, em
                    parábola, girando uma volta inteira, até a base
       2 ABERTURA   abre em cima da base e solta um clarão branco
       3 SURGIR     o sprite de costas nasce branco em 0% e cresce até
                    100%, e o branco se desfaz na cor dele (ou na de
                    brilhante); brilhos e o grito
       4 FIM        a bola some, a ficha desliza pra dentro e o menu
                    é liberado por quem chamou
     A bola é aquela em que ele foi pego: quem veio de Great Ball
     entra de Great Ball. Sem registro, Poké Ball.
     ======================================================== */
  async entrada(p){
    const arena = this.arena(), s = this.sprite('aliado');
    const ficha = arena && arena.querySelector('.lutador.aliado .ficha');
    const lut = arena && arena.querySelector('.lutador.aliado');
    if (!arena || !s || !p){ if (lut) lut.classList.remove('por-entrar'); return; }
    if (this.reduzido()){ lut.classList.remove('por-entrar'); tocarGrito(p.dex); return; }
    s.style.visibility = 'hidden';
    if (ficha) ficha.classList.add('ficha-fora');
    lut.classList.remove('por-entrar');
    const c = this.camada();
    const A = arena.getBoundingClientRect();
    const t = this.alvo('aliado');
    const TAM = 30;
    const bola = spriteDaBola((p.capturadoEm && p.capturadoEm.bola) || 'Poké Ball');
    const voo = document.createElement('div');
    voo.className = 'bola-voo entrada';
    voo.style.width = voo.style.height = TAM + 'px';
    voo.innerHTML = `<div class="gira"><img class="meia baixo" src="${bola}" alt=""><img class="meia cima" src="${bola}" alt=""></div>`;
    c.appendChild(voo);
    const cima = voo.querySelector('.meia.cima');

    /* 1 — parábola do canto de baixo à esquerda até a base */
    const x0 = 4, y0 = A.height - TAM - 4;
    const x1 = t.cx - TAM / 2, y1 = t.pe - TAM + 2;
    const cx = (x0 + x1) / 2, cy = Math.min(y0, y1) - 80;
    const quadros = [];
    for (let i = 0; i <= 14; i++){
      const k = i / 14, u = 1 - k;
      const x = u*u*x0 + 2*u*k*cx + k*k*x1, y = u*u*y0 + 2*u*k*cy + k*k*y1;
      quadros.push({transform:`translate(${x}px, ${y}px) rotate(${360 * k}deg)`});
    }
    await this.tocar(voo, quadros, 540, {easing:'linear', fill:'forwards'});

    /* 2 — abre e solta o clarão */
    await this.tocar(cima, [{transform:'rotate(0deg)'}, {transform:'rotate(-62deg)'}], 120, {fill:'forwards'});
    const clarao = this.particula('fx-clarao', t.cx, t.pe - 10);
    const luz = this.soltar(clarao, [{transform:'translate(-50%,-50%) scale(.2)', opacity:0},
      {transform:'translate(-50%,-50%) scale(1)', opacity:1, offset:.35},
      {transform:'translate(-50%,-50%) scale(1.5)', opacity:0}], 460);

    /* 3 — nasce branco, do pé pra cima, e a cor vem por baixo */
    const m = document.createElement('img');
    m.className = 'fx-tinta';
    m.src = s.currentSrc || s.src; m.alt = '';
    Object.assign(m.style, {left:t.x + 'px', top:t.y + 'px', width:t.w + 'px', height:t.h + 'px',
      filter:this.filtroDeCor('#FFFFFF'), transformOrigin:`50% 76%`});
    c.appendChild(m);
    await this.tocar(m, [{transform:'scale(0)', opacity:1}, {transform:'scale(1)', opacity:1}], 380,
                     {easing:'cubic-bezier(.2,1.3,.5,1)', fill:'forwards'});
    s.style.visibility = '';
    tocarGrito(p.dex);
    const brilhos = [-70, -20, 25, 160, 205].map((g, i) => {
      const r = g * Math.PI / 180, d = t.w * .32;
      const e = this.particula('fx-estrela', t.cx, t.cy);
      return this.soltar(e, [
        {transform:'translate(-50%,-50%) scale(.3)', opacity:0},
        {transform:`translate(calc(-50% + ${Math.cos(r) * d * .6}px), calc(-50% + ${Math.sin(r) * d * .6}px)) scale(1.1)`, opacity:1, offset:.4},
        {transform:`translate(calc(-50% + ${Math.cos(r) * d}px), calc(-50% + ${Math.sin(r) * d}px)) scale(.5)`, opacity:0}
      ], 560, {delay:i * 35});
    });
    await Promise.all([this.tocar(m, [{opacity:1}, {opacity:0}], 340, {fill:'forwards'}), luz, ...brilhos,
                       this.tocar(voo, [{opacity:1}, {opacity:0}], 260, {fill:'forwards'})]);
    m.remove(); voo.remove();

    /* 4 — a ficha entra deslizando */
    if (ficha){ ficha.classList.remove('ficha-fora'); ficha.classList.add('ficha-entra'); }
    await this.esperar(320);
    if (ficha) ficha.classList.remove('ficha-entra');
  },

  /* ========================================================
     ABERTURA — o outro lado antes do seu
     Treinador com rosto: ele entra deslizando pela direita até o
     meio do lado dele, espera, e recua pro fundo, onde fica a luta
     inteira; o Pokémon dele aparece na frente. Selvagem: só aparece.
     Depois disso, a sua entrada.
     ======================================================== */
  async abertura(){
    const arena = this.arena();
    if (!arena) return;
    const acoes = document.getElementById('acoes');
    if (acoes){ acoes.classList.add('esperando'); acoes.setAttribute('aria-busy', 'true'); }
    const tr = arena.querySelector('.lutador.inimigo .treinador-fundo');
    const si = this.sprite('inimigo');
    const li = arena.querySelector('.lutador.inimigo');
    if (!this.reduzido()){
      if (tr && si){
        si.style.visibility = 'hidden';
        if (li) li.classList.remove('por-entrar');
        /* FLIP: mede o treinador no fundo e na frente, e anima a diferença */
        const r0 = tr.getBoundingClientRect();
        tr.classList.add('na-frente');
        const r1 = tr.getBoundingClientRect();
        await this.tocar(tr, [{transform:'translateX(170px)', opacity:0}, {transform:'translateX(0)', opacity:1}], 460,
                         {easing:'cubic-bezier(.2,.8,.3,1)'});
        await this.esperar(520);
        tr.classList.remove('na-frente');
        const k = r0.width ? r1.width / r0.width : 1;
        await this.tocar(tr, [{transformOrigin:'0 0', transform:`translate(${r1.left - r0.left}px, ${r1.top - r0.top}px) scale(${k})`},
                              {transformOrigin:'0 0', transform:'none'}], 380, {easing:'ease-in-out'});
        si.style.visibility = '';
        const u = this.alvo('inimigo');
        if (u){
          const cl = this.particula('fx-clarao', u.cx, u.pe - 10);
          await this.soltar(cl, [{transform:'translate(-50%,-50%) scale(.2)', opacity:0},
            {transform:'translate(-50%,-50%) scale(.9)', opacity:1, offset:.35},
            {transform:'translate(-50%,-50%) scale(1.3)', opacity:0}], 380);
        }
      } else {
        await this.esperar(380);
      }
    }
    if (li) li.classList.remove('por-entrar');
    if (Batalha.inimigo) tocarGrito(Batalha.inimigo.dex);
    await this.esperar(this.reduzido() ? 0 : 260);
    await this.entrada(Batalha.aliado);
    if (acoes){ acoes.classList.remove('esperando'); acoes.removeAttribute('aria-busy'); }
  }
};
