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
/* golpe de raio: sai como feixe */
const GOLPES_DE_RAIO = /Beam$|^Solar Beam$|^Psybeam$|^Hyper Beam$|^Swift$|^Tri Attack$/;
/* golpe físico que é arremesso: sai como projétil do tipo */
const PROJETEIS_FISICOS = /^(Razor Leaf|Rock Throw|Rock Slide|Pin Missile|Twineedle|Egg Bomb|Barrage|Spike Cannon|Sky Attack|Icicle Spear|Bullet Seed)$/;
/* físico que não encosta no outro: quem usa não investe */
const SEM_INVESTIDA = /^(Bonemerang|Pay Day|Present|Sacred Fire|Self-Destruct|Explosion)$/;
/* golpe de status que levanta proteção */
const BARREIRAS = new Set(['Protect','Detect','Reflect','Light Screen','Barrier','Withdraw','Harden',
  'Defense Curl','Acid Armor','Safeguard','Mist','Substitute','Iron Defense']);

/* o projétil de cada tipo no golpe especial: imagem, quantos saem em
   fila, tamanho, se gira, e o que estoura no alvo no fim */
const FX_TIPO = {
  Normal:     {img:'special_beam', n:1, tam:50},
  Fogo:       {img:'special_fire', n:6, tam:26, fim:'special_fire_burst'},
  'Água':     {img:'special_water', n:2, tam:54},
  Grama:      {img:['special_grass', 'special_grass_2'], n:7, tam:26, gira:true},
  'Elétrico': {img:'special_electric', n:1, tam:54, fim:'special_electric_bolt'},
  Gelo:       {img:'special_ice_shard', n:5, tam:30, fim:'special_ice'},
  Lutador:    {img:'physical_punch', n:1, tam:44, fim:'physical_tackle'},
  Venenoso:   {img:'special_poison', n:3, tam:46, arco:-30},
  Terrestre:  {img:'special_ground', n:3, tam:52},
  Voador:     {img:'special_flying', n:3, tam:44},
  'Psíquico': {img:'special_psychic', n:1, tam:64},
  Inseto:     {img:'special_bug', n:5, tam:24, gira:true},
  Pedra:      {img:['special_rock', 'special_rock_2', 'special_rock_3'], n:4, tam:28, cai:true},
  Fantasma:   {img:'special_ghost', n:1, tam:64},
  'Dragão':   {img:'special_dragon', n:7, tam:28, arco:-18},
  Sombrio:    {img:'special_dark', n:1, tam:64},
  'Metálico': {img:'special_steel', n:3, tam:32, gira:true}
};

/* como um golpe físico bate, pelo nome */
function jeitoDeBater(nome){
  if (/Bone/.test(nome)) return 'osso';
  if (/Bite|Crunch|Fang/.test(nome)) return 'mordida';
  if (/Kick|Stomp/.test(nome)) return 'chute';
  if (/Punch|Chop|Submission|Seismic|Karate|Mach|Dynamic|Cross|Comet|Dizzy|Counter|Vital/.test(nome)) return 'soco';
  if (/Slash|Cut|Scratch|Claw|Swipe|Cutter|Fury Attack/.test(nome)) return 'corte';
  return 'investida';
}

/* caminho da imagem de efeito, trocado por data URI no arquivo único */
function fxGolpe(arq){
  const rel = SPRITES_BASE + 'animations/moves/' + arq + '.png';
  return (typeof SPRITES_EMBUTIDOS !== 'undefined' && SPRITES_EMBUTIDOS[rel]) || rel;
}

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
    /* GIF de Black/White: recortada no bicho, do topo ao pé */
    if (s && s.classList.contains('ani'))
      return {x, y, w:r.width, h:r.height, cx: x + r.width / 2, cy: y + r.height * 0.5, pe: y + r.height, topo: y};
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

  /* ---------- barra de experiência que enche ----------
     Sobe até onde chegou; se encheu no meio, vai até o fim, pisca,
     zera e continua — uma vez por nível. Só a do seu lutador aparece. */
  async encherXP(xp){
    const a = this.arena();
    const al = Batalha.aliado;
    if (!a || !al || al.uid !== xp.uid) return this.esperar(120);
    const i = a.querySelector('.lutador.aliado .ficha .barra-exp i');
    if (!i) return this.esperar(120);
    const ir = async (pct, ms) => { i.style.transition = `width ${ms}ms linear`; i.style.width = pct + '%'; await this.esperar(ms + 30); };
    i.style.transition = 'none'; i.style.width = xp.de + '%'; void i.offsetWidth;
    for (let k = 0; k < Math.min(xp.encheu || 0, 3); k++){
      await ir(100, 420);
      i.parentNode.classList.add('cheia'); await this.esperar(160); i.parentNode.classList.remove('cheia');
      i.style.transition = 'none'; i.style.width = '0%'; void i.offsetWidth;
    }
    await ir(xp.para, 520);
    i.style.transition = '';
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
     As imagens são as de efeito de golpe do Pokémon Showdown, em
     sprites_nds/animations/moves/ (os endereços do roteiro eram ícones
     de item da PokeAPI: pedras evolutivas, X Attack, discos de TM).

     Físico: o atacante investe (AnimadorSprite), o golpe acontece no alvo pelo
     jeito de bater (corte, soco, chute, mordida, osso, investida) e ele
     volta. Especial: o atacante brilha 0,2 s na cor do tipo, o projétil
     do tipo viaja até o alvo, e o alvo pisca em branco. Status: quem
     sobe atributo solta partículas subindo; quem baixa, descendo. */
  async golpe(lado, nome){
    const g = GOLPES[nome] || {};
    const outro = lado === 'aliado' ? 'inimigo' : 'aliado';
    /* o corpo de quem ataca vem antes do efeito (AnimadorSprite):
       especial conjura no lugar; físico investe — a não ser que a
       cena do Showdown já leve o atacante até o outro */
    const temSD = typeof CenaShowdown !== 'undefined' && CenaShowdown.tem(nome);
    if (g.c === 'esp') await AnimadorSprite.ataqueEspecial(lado);
    else if (g.c === 'fis' && temSD && !PROJETEIS_FISICOS.test(nome) && !GOLPES_DE_CHAO.has(nome) && !SEM_INVESTIDA.test(nome)
             && !CenaShowdown.mexeAtacante(nome, lado)) await AnimadorSprite.ataqueFisico(lado, outro);
    /* a animação do próprio golpe, a do Showdown; sem ela, a nossa */
    const sd = temSD ? CenaShowdown.tocar(nome, lado) : null;
    if (sd) return sd;
    if (g.c === 'status') return this.golpeStatus(lado, outro, nome, g);
    if (GOLPES_DE_CHAO.has(nome)) return this.terremoto(lado, outro);
    /* físico que é arremesso (folha, pedra, ferrão) viaja como projétil */
    if (g.c === 'fis' && !PROJETEIS_FISICOS.test(nome)) return this.golpeFisico(lado, outro, nome, g);
    return this.golpeEspecial(lado, outro, nome, g);
  },

  /* imagem de efeito solta na camada, centrada em (x, y) */
  fxImg(arq, x, y, tam, estilo){
    const c = this.camada();
    if (!c) return null;
    const e = document.createElement('img');
    e.className = 'fx fx-img';
    e.src = fxGolpe(arq); e.alt = '';
    e.onerror = () => e.remove();
    Object.assign(e.style, {left:x + 'px', top:y + 'px', width:tam + 'px'}, estilo || {});
    c.appendChild(e);
    return e;
  },
  /* aparece no lugar, cresce um pouco e some */
  estalo(arq, x, y, tam, ms, extra){
    const e = this.fxImg(arq, x, y, tam, extra && extra.estilo);
    const rot = (extra && extra.rot) || 0;
    return this.soltar(e, [
      {transform:`translate(-50%,-50%) rotate(${rot}deg) scale(.4)`, opacity:0},
      {transform:`translate(-50%,-50%) rotate(${rot}deg) scale(1)`, opacity:1, offset:.3},
      {transform:`translate(-50%,-50%) rotate(${rot}deg) scale(1.08)`, opacity:1, offset:.7},
      {transform:`translate(-50%,-50%) rotate(${rot}deg) scale(1.2)`, opacity:0}], ms || 360, {delay:(extra && extra.delay) || 0});
  },
  /* de um ponto a outro, em linha (ou girando) */
  voar(arq, de, para, tam, ms, extra){
    const x = extra || {};
    const e = this.fxImg(arq, de.x, de.y, tam);
    const dx = para.x - de.x, dy = para.y - de.y;
    const g0 = x.gira ? 0 : (x.ang || 0), g1 = x.gira ? 540 : (x.ang || 0);
    const arco = x.arco || 0;
    const q = [{transform:`translate(-50%,-50%) rotate(${g0}deg) scale(.7)`, opacity:0},
               {transform:`translate(-50%,-50%) rotate(${g0}deg) scale(1)`, opacity:1, offset:.12}];
    if (arco) q.push({transform:`translate(calc(-50% + ${dx / 2}px), calc(-50% + ${dy / 2 + arco}px)) rotate(${(g0 + g1) / 2}deg)`, opacity:1, offset:.5});
    q.push({transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${g1}deg) scale(1)`, opacity:1, offset:.88},
           {transform:`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${g1}deg) scale(1.3)`, opacity:0});
    return this.soltar(e, q, ms || 420, {delay:x.delay || 0, easing:'linear'});
  },
  /* a tela inteira sacode: investida e golpe de chão */
  sacudirTela(ms, amp){
    const a = this.arena(), q = [];
    for (let i = 0; i < 8; i++) q.push({transform:`translate(${i % 2 ? amp : -amp}px, ${i % 3 ? 2 : -2}px)`});
    q.push({transform:'translate(0,0)'});
    return this.tocar(a, q, ms || 360, {easing:'linear'});
  },

  async golpeFisico(lado, outro, nome, g){
    const u = this.alvo(outro), t = this.alvo(lado);
    if (!u || !t) return;
    /* investida do AnimadorSprite: resolve no impacto, a volta segue sozinha */
    if (!SEM_INVESTIDA.test(nome)) await AnimadorSprite.ataqueFisico(lado, outro);
    const jeito = jeitoDeBater(nome);
    const passos = [];
    if (jeito === 'corte'){
      const garra = /Scratch|Claw|Swipe/.test(nome);
      /* o traço é escuro: contorno claro, senão some em cima de silhueta */
      const claro = {filter:'drop-shadow(0 0 2px #fff) drop-shadow(0 0 4px rgba(255,255,255,.8))'};
      passos.push(this.estalo(garra ? 'physical_scratch' : 'physical_slash', u.cx + 8, u.cy - 4, 60, 320, {estilo:claro}),
                  this.estalo(garra ? 'physical_scratch_2' : 'physical_slash_2', u.cx - 8, u.cy + 4, 60, 320, {delay:110, estilo:claro}));
    } else if (jeito === 'soco' || jeito === 'chute'){
      passos.push(this.estalo('physical_tackle', u.cx, u.cy, 88, 360, {estilo:{opacity:.8}}),
                  this.estalo(jeito === 'soco' ? 'physical_punch' : 'physical_kick', u.cx, u.cy, 50, 380),
                  this.tremer(outro, 380, 7));
    } else if (jeito === 'mordida'){
      const cima = this.fxImg('physical_bite_top', u.cx, u.cy - 34, 84), baixo = this.fxImg('physical_bite_bottom', u.cx, u.cy + 34, 84);
      const fecha = (e, dy) => this.soltar(e, [{transform:'translate(-50%,-50%)', opacity:0},
        {transform:'translate(-50%,-50%)', opacity:1, offset:.25},
        {transform:`translate(-50%, calc(-50% + ${dy}px))`, opacity:1, offset:.6},
        {transform:`translate(-50%, calc(-50% + ${dy}px))`, opacity:0}], 380, {easing:'ease-in'});
      passos.push(fecha(cima, 22), fecha(baixo, -22), this.esperar(220).then(() => this.tremer(outro, 280, 5)));
    } else if (jeito === 'osso'){
      passos.push(this.voar('physical_bone', {x:t.cx, y:t.cy}, {x:u.cx, y:u.cy}, 34, 420, {gira:true}),
                  this.esperar(380).then(() => this.estalo('physical_tackle', u.cx, u.cy, 70, 300)));
    } else {
      /* investida: impacto no alvo e a tela treme */
      passos.push(this.estalo('physical_tackle', u.cx, u.cy, 92, 360), this.sacudirTela(340, 5), this.tremer(outro, 340, 6));
    }
    /* o tipo aparece no golpe de corpo também: Fire Punch pega fogo */
    const fx = FX_TIPO[g.t];
    if (g.t !== 'Normal' && fx){
      const arq = fx.fim || (Array.isArray(fx.img) ? fx.img[0] : fx.img);
      passos.push(this.esperar(140).then(() => Promise.all([
        this.estalo(arq, u.cx, u.cy, Math.min(64, (fx.tam || 30) * 1.4), 380),
        this.tingir(outro, COR_TIPO[g.t] || '#fff', 360, 2, .45)])));
    }
    await Promise.all(passos);
  },

  async golpeEspecial(lado, outro, nome, g){
    const t = this.alvo(lado), u = this.alvo(outro);
    if (!t || !u) return;
    const cor = COR_TIPO[g.t] || '#ffffff';
    /* 1. quem usa brilha na cor do tipo por 0,2 s */
    await this.tingir(lado, cor, 200, 1, .7);
    const fx = FX_TIPO[g.t] || FX_TIPO.Normal;
    const de = {x:t.cx, y:t.cy}, para = {x:u.cx, y:u.cy};
    const imgs = Array.isArray(fx.img) ? fx.img : [fx.img];
    const viagem = [];
    /* 2. o projétil viaja até o alvo */
    if (GOLPES_DE_RAIO.test(nome)){
      /* feixe: uma fila cerrada do projétil do tipo, rápida */
      const arq = g.t === 'Normal' ? 'special_beam' : imgs[0];
      for (let i = 0; i < 12; i++) viagem.push(this.voar(arq, de, para, fx.tam > 40 ? 40 : fx.tam + 6, 300, {delay:i * 28}));
    } else if (fx.cai){
      /* pedra cai de cima do alvo, não vem do atacante */
      for (let i = 0; i < fx.n; i++){
        const x = u.cx - 24 + i * 16;
        viagem.push(this.voar(imgs[i % imgs.length], {x, y:u.topo - 70}, {x, y:u.cy}, fx.tam, 400, {delay:i * 90, gira:true}));
      }
    } else {
      for (let i = 0; i < fx.n; i++){
        const oy = fx.n > 1 ? (i % 3 - 1) * 12 : 0;
        viagem.push(this.voar(imgs[i % imgs.length], {x:de.x, y:de.y + oy}, {x:para.x, y:para.y - oy}, fx.tam,
          fx.n > 1 ? 440 : 480, {delay:i * 60, gira:fx.gira, arco:fx.arco || 0}));
      }
    }
    await Promise.all(viagem);
    /* 3. o alvo pisca em branco por dois quadros, com o fecho do tipo */
    const fecho = fx.fim ? this.estalo(fx.fim, u.cx, g.t === 'Elétrico' ? u.cy - 10 : u.cy, g.t === 'Elétrico' ? 46 : 70, 420) : Promise.resolve();
    await Promise.all([fecho, this.tingir(outro, '#ffffff', 140, 2, .95)]);
  },

  async golpeStatus(lado, outro, nome, g){
    const ef = g.ef || {};
    const eu = this.alvo(lado), ele = this.alvo(outro);
    if (!eu || !ele) return;
    const passos = [];
    if (BARREIRAS.has(nome) || ['proteger', 'reflexo', 'tela', 'salvaguarda', 'substituto', 'nevoa'].includes(ef.acao)){
      passos.push(this.estalo('status_barrier', eu.cx, eu.cy, 70, 620, {estilo:{opacity:.85}}), this.anel(lado, COR_TIPO[g.t] || '#d8d8ff'));
    }
    if (/^(Leer|Glare|Scary Face|Mean Look)$/.test(nome)) passos.push(this.estalo('status_stare', ele.cx, ele.topo + 10, 84, 520));
    if (/^(Attract|Charm|Sweet Kiss|Lovely Kiss)$/.test(nome)) passos.push(this.subir(outro, 'status_heart', 5, 22, false));
    if (/^(String Shot|Spider Web)$/.test(nome)) passos.push(this.estalo('status_web', ele.cx, ele.cy, 90, 620));
    if (nome === 'Swords Dance') passos.push(this.estalo('status_sword', eu.cx, eu.cy - 10, 30, 520, {rot:0}), this.estalo('status_sword', eu.cx, eu.cy - 10, 30, 520, {rot:90, delay:120}));
    if (ef.sobe) passos.push(this.subir(lado, 'stat_boost', 6, 22, false, '#6fe0ff'));
    if (ef.baixa) passos.push(this.subir(outro, 'stat_drop', 6, 18, true, '#ff7a3a'));
    if (ef.cura) passos.push(this.cura(lado));
    if (!passos.length) passos.push(this.anel(ef.sobe || ef.cura ? lado : outro, COR_TIPO[g.t] || '#d8d8ff'));
    await Promise.all(passos);
  },
  /* partículas subindo (atributo que sobe) ou descendo (que cai) */
  subir(lado, arq, n, tam, desce, brilho){
    const u = this.alvo(lado);
    if (!u) return Promise.resolve();
    const tinta = brilho ? this.tingir(lado, brilho, 520, 1, .35) : Promise.resolve();
    return Promise.all([tinta, ...Array.from({length:n}, (_, i) => {
      const x = u.cx - 30 + (i * 13) % 60;
      const y0 = desce ? u.topo : u.pe - 4, y1 = desce ? u.pe : u.topo;
      const e = this.fxImg(arq, x, y0, tam, brilho ? {filter:`drop-shadow(0 0 5px ${brilho})`} : null);
      return this.soltar(e, [{transform:'translate(-50%,-50%) scale(.6)', opacity:0},
        {transform:'translate(-50%,-50%) scale(1)', opacity:1, offset:.25},
        {transform:`translate(-50%, calc(-50% + ${y1 - y0}px)) scale(.8)`, opacity:0}], 640, {delay:i * 70});
    })]);
  },
  /* Earthquake e parentes: o chão inteiro treme, e sobe lama no alvo */
  async terremoto(lado, outro){
    const u = this.alvo(outro);
    await Promise.all([this.sacudirTela(620, 6),
      u ? this.estalo('special_ground', u.cx, u.pe - 6, 96, 620) : Promise.resolve(),
      this.tremer(outro, 620, 6)]);
    await this.tingir(outro, '#ffffff', 140, 2, .95);
  },

  /* elétrico: faísca piscando em amarelo em cima do alvo, e ele treme */
  async faisca(outro){
    const u = this.alvo(outro);
    if (!u) return;
    const pos = [[-20, -18], [16, -6], [-4, 14]];
    const f = pos.map(([dx, dy], i) => {
      const e = this.particula('fx-faisca', u.cx + dx, u.cy + dy);
      /* o degrau vai em cada quadro: no tempo da animação inteira ele
         segura o primeiro quadro até o fim, e a faísca nunca acende */
      return this.soltar(e, [0, 1, 0, 1, 0, 1, 0].map(o => ({opacity:o, easing:'steps(1, end)'})),
                         420, {delay:i * 40, easing:'linear'});
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
      /* quem sai de pé volta pra Pokébola; quem caiu já afundou */
      const saem = [];
      if (trocouA && ant.A.hp > 0) saem.push(AnimadorSprite.recolher('aliado'));
      if (trocouI && ant.I.hp > 0) saem.push(AnimadorSprite.recolher('inimigo'));
      await Promise.all(saem);
      UI.atualizarArena();
      this.pintarHP('aliado', e.fotoA, false);
      this.pintarHP('inimigo', e.fotoI, false);
      if (trocouI) await AnimadorSprite.entrar('inimigo', {daBola:true});
      if (trocouA) await this.entrada(Batalha.aliado);
      return;
    }
    /* atributo que mexeu: o corpo sobe ou desce junto */
    if (e.estagio){ await AnimadorSprite.atributo(e.estagio.lado, e.estagio.delta > 0); return; }
    if (e.tipo === 'golpe' && e.lado){ await this.golpe(e.lado, e.golpe); return; }
    if (e.xp){ await this.encherXP(e.xp); return; }
    /* Transform: a arte troca na hora */
    if (e.transformou){
      UI.atualizarArena(); this.pintarHP('aliado', e.fotoA, false); this.pintarHP('inimigo', e.fotoI, false);
      await this.esperar(450); return;
    }
    if (e.clima !== undefined){ this.pintarClima(e.clima); await this.esperar(e.clima ? 700 : 300); return; }
    if (e.travou && e.lado){ await this.condicao(e.lado, e.travou, true); return; }

    const passos = [], caem = [];
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
        else passos.push(AnimadorSprite.dano(lado));
        this.pintarHP(lado, f, true);
        passos.push(this.esperar(560));
        if (f.hp <= 0 && a.hp > 0) caem.push(lado);
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
    /* a barra chegou a zero: afunda depois de piscar, como nos jogos */
    if (caem.length) await Promise.all(caem.map(l => AnimadorSprite.desmaio(l)));
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
    AnimadorSprite.marcar('aliado', ESTADOS_SPRITE.ENTRY);
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
    voo.innerHTML = `<div class="gira"><img class="meia baixo" src="${bola}" alt=""><span class="fenda"></span><img class="meia cima" src="${bola}" alt=""></div>`;
    c.appendChild(voo);
    const cima = voo.querySelector('.meia.cima');
    const baixo = voo.querySelector('.meia.baixo');
    const fenda = voo.querySelector('.fenda');

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
    await abrirBola(cima, baixo, fenda, 150);
    const clarao = this.particula('fx-clarao', t.cx, t.pe - 10);
    const luz = this.soltar(clarao, [{transform:'translate(-50%,-50%) scale(.2)', opacity:0},
      {transform:'translate(-50%,-50%) scale(1)', opacity:1, offset:.35},
      {transform:'translate(-50%,-50%) scale(1.5)', opacity:0}], 460);

    /* 3 — nasce branco, do pé pra cima, e a cor vem por baixo */
    const m = document.createElement('img');
    m.className = 'fx-tinta';
    m.src = s.currentSrc || s.src; m.alt = '';
    Object.assign(m.style, {left:t.x + 'px', top:t.y + 'px', width:t.w + 'px', height:t.h + 'px',
      filter:this.filtroDeCor('#FFFFFF'), transformOrigin:`50% ${peDoSprite(s) * 100}%`});
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
    AnimadorSprite.repouso('aliado');
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
          await Promise.all([this.soltar(cl, [{transform:'translate(-50%,-50%) scale(.2)', opacity:0},
            {transform:'translate(-50%,-50%) scale(.9)', opacity:1, offset:.35},
            {transform:'translate(-50%,-50%) scale(1.3)', opacity:0}], 380),
            AnimadorSprite.entrar('inimigo', {daBola:true})]);
        }
      } else if (si){
        /* selvagem: desliza da lateral até a base */
        if (li) li.classList.remove('por-entrar');
        await AnimadorSprite.entrar('inimigo');
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
