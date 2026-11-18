/* ============================================================
   O TUTORIAL DA LUTA
   Foi pedido assim: um tutorial breve, com balões apontando pro botão
   que brilha e dizendo o que ele faz dentro da batalha, e um Smeargle
   shiny do lado do balão mostrando tudo.

   - Aparece uma vez, na primeira luta deste navegador ('jc-tutorial-luta',
     como a letra e a velocidade, valendo pras três jornadas), quando o
     menu da luta fica pronto (o fim do Efeitos.abertura).
   - Diz o que cada coisa FAZ, nunca como ganhar: a regra do projeto de
     não explicar o jogo no meio da partida continua valendo pra todo o
     resto. Os números ficam na folha de regras.
   - "Pular" em todo balão; volta pelos Ajustes e pela aba Combate do
     Tutorial (rever(): agora, se a luta está na tela, ou na próxima).
   - Robô e verificador não veem (navigator.webdriver): um balão por
     cima do menu travaria todos eles. Quem testa chama comecar().

   Passo novo entra em PASSOS_DO_TUTORIAL: `alvo` é seletor (ou lista
   de seletores, e o foco cobre todos; `alvoCurto` é o que vale quando
   o alvo e o balão não cabem juntos na tela), `quando` diz se o passo vale
   nesta luta, `modo` põe o menu no andar certo (os golpes abrem de
   verdade) e `antes`/`depois` mexem na tela e desfazem. Passo cujo alvo
   não está na tela é pulado sozinho.
   ============================================================ */
const TUTORIAL_LUTA_CHAVE = 'jc-tutorial-luta';

/* o Smeargle que mostra: o brilhante, de frente */
const GUIA_DO_TUTORIAL = {dex:235, shiny:true, nome:'Smeargle'};

const PASSOS_DO_TUTORIAL = [
  {id:'inimigo', alvo:'#arena .lutador.inimigo .ficha', titulo:'Quem está do outro lado',
    texto:() => 'Nome, nível, condição e HP de quem você enfrenta. Espécie que a Pokédex ainda não catalogou aparece em silhueta, com o tipo em “?”.'},
  {id:'aliado', alvo:'#arena .lutador.aliado .ficha', titulo:'Quem está na frente',
    /* a alça abre de verdade, e fecha de novo quando o passo sai */
    antes(t){ if (!(UI._fichaAberta || {}).aliado){ UI.alternarFicha('aliado'); t._abriuFicha = true; } },
    depois(t){ if (t._abriuFicha){ t._abriuFicha = false; if ((UI._fichaAberta || {}).aliado) UI.alternarFicha('aliado'); } },
    texto(){
      const a = Batalha.aliado;
      const ele = a ? pron(a).ele : 'ele';
      return `HP, experiência e Vontade do seu Pokémon. A alça da ficha abre a parte de conferir: natureza, atributos e o item que ${ele} segura.`;
    }},
  {id:'lutar', alvo:'#acoes .mb-btn.lutar', titulo:'Lutar',
    texto:() => 'Abre a lista de golpes. Escolher um golpe é a sua ação do turno.'},
  /* a lista inteira e o balão não cabem juntos na tela baixa do
     celular: ali o foco fica só no primeiro golpe (alvoCurto) */
  {id:'golpes', alvo:['#acoes .grade-golpes', '#acoes .mb-btn.voltar'], alvoCurto:'#acoes .grade-golpes .golpe-btn',
    modo:'golpes', titulo:'Os golpes',
    texto:() => 'Cada golpe vem na cor do tipo, com a parada de dados embaixo. Quando o tipo de lá é conhecido, o botão avisa se é super eficaz, pouco eficaz ou sem efeito. Voltar fecha a lista sem gastar o turno.'},
  {id:'mochila', alvo:'#acoes .mb-btn.bag', titulo:'Mochila',
    texto:() => Batalha.tipo === 'treinador'
      ? 'Remédios e o que mais serve na luta. Usar um item gasta o turno. A Pokébola fica apagada: Pokémon de treinador não se captura.'
      : 'Remédios e Pokébolas. Usar um item gasta o turno, e a Pokébola é como se captura um Pokémon selvagem.'},
  {id:'time', alvo:'#acoes .mb-btn.time', titulo:'Time',
    texto:() => 'Troca quem está na frente. Trocar gasta o turno; pôr alguém no lugar de quem desmaiou, não.'},
  {id:'fugir', alvo:'#acoes .mb-btn.fugir', titulo:'Fugir', quando:() => Batalha.tipo !== 'treinador',
    texto:() => 'Tenta sair da luta contra o selvagem. Se não der, o turno passa e ele age.'},
  {id:'desistir', alvo:'#acoes .mb-btn.desistir', titulo:'Desistir', quando:() => Batalha.tipo === 'treinador',
    texto:() => 'Contra treinador não se foge. Desistir encerra a luta como derrota, e custa dinheiro e moral.'},
  {id:'vontade', alvo:'#acoes .mb-btn.vontade', titulo:'Vontade',
    texto:() => `Abre os gastos de Vontade, um ponto cada, armados antes do golpe: ${Object.values(USOS_DE_VONTADE).map(u => u.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' ou $1')}. Os pontos que sobram aparecem na ficha.`},
  {id:'dex', alvo:'#acoes .mb-btn.dex', titulo:'Pokédex',
    texto:() => 'Lê quem está do outro lado e cataloga a espécie: tipo, posto e atributos vão pro registro. Não gasta o turno.'},
  {id:'registro', alvo:'#log', titulo:'O registro',
    texto:() => 'Tudo o que aconteceu no turno, na ordem, com a conta de cada rolagem.'},
  {id:'bandeja', alvo:'#dados', titulo:'A bandeja',
    texto:() => 'Os dados do último turno, face por face: o que acende é sucesso. Antes do primeiro golpe, os três dados daqui giram à toa, sem efeito nenhum.'},
  {id:'velocidade', alvo:'#arena .vel-luta', titulo:'Velocidade',
    texto:() => '1×, 2× ou 3×. Só a animação anda mais rápido; os dados e a conta são os mesmos.'},
  {id:'fim', alvo:null, titulo:'Boa luta',
    texto:() => 'Os números de tudo isso estão em Regras, e este tutorial volta pelos Ajustes.'}
];

const TutorialLuta = {
  ativo: false,
  i: 0,
  _passos: [],
  _raf: 0,
  _abriuFicha: false,

  /* ---------- quem vê ---------- */
  visto(){
    try { return localStorage.getItem(TUTORIAL_LUTA_CHAVE) === 'visto'; } catch (e) { return false; }
  },
  marcar(v){
    try {
      if (v) localStorage.setItem(TUTORIAL_LUTA_CHAVE, 'visto');
      else localStorage.removeItem(TUTORIAL_LUTA_CHAVE);
    } catch (e) {}
  },
  /* robô e verificador não veem: o balão por cima do menu trava a mão deles */
  automatizado(){ return typeof navigator !== 'undefined' && navigator.webdriver === true; },

  /* o menu da luta está pronto pra mostrar: o de sempre ou o dos
     golpes (o passo põe no andar dele), sem turno sendo encenado */
  menuPronto(){
    if (typeof Batalha === 'undefined' || !Batalha.ativo || Batalha.fase === 'ameaca') return false;
    const acoes = document.getElementById('acoes');
    return !!(acoes && !acoes.classList.contains('esperando') && acoes.querySelector('.menu-batalha, .grade-golpes'));
  },

  /* chamado quando a abertura da luta termina */
  talvez(){
    if (this.ativo || this.visto() || this.automatizado()) return;
    if (document.querySelector('.modal-fundo')) return;
    if (!this.menuPronto()) return;
    this.comecar();
  },

  /* Ajustes e Tutorial: agora, com a luta na tela; senão, na próxima */
  rever(botao){
    this.marcar(false);
    if (this.menuPronto()){
      if (typeof UI !== 'undefined') UI.fecharModal(true);
      setTimeout(() => this.comecar(), 60);
      return;
    }
    if (botao){
      const det = botao.querySelector('.esc-det');
      if (det) det.textContent = 'combinado: ele volta na próxima luta';
      botao.disabled = true;
    }
  },
  textoDoRever(){
    return this.menuPronto() ? 'os botões da luta, um por vez, agora' : 'os botões da luta, um por vez, na próxima luta';
  },

  /* ---------- o passo a passo ---------- */
  comecar(){
    if (this.ativo) this.fechar(false);
    if (!this.menuPronto()) return false;
    this._passos = PASSOS_DO_TUTORIAL.filter(p => !p.quando || p.quando());
    this.i = -1;
    this.ativo = true;
    this.montar();
    this.mostrar(0, 1);
    return true;
  },

  montar(){
    const velho = document.getElementById('tutorial-luta');
    if (velho) velho.remove();
    const raiz = document.createElement('div');
    raiz.id = 'tutorial-luta';
    raiz.className = 'tutorial-luta';
    raiz.setAttribute('role', 'dialog');
    raiz.setAttribute('aria-modal', 'true');
    raiz.setAttribute('aria-labelledby', 'tl-titulo');
    raiz.setAttribute('aria-describedby', 'tl-texto');
    const arte = typeof imgSprite === 'function' ? imgSprite(GUIA_DO_TUTORIAL, 'frente') : '';
    raiz.innerHTML = `<div class="tl-foco" aria-hidden="true"></div>
      <div class="tl-guia">
        <div class="tl-smeargle" aria-hidden="true"><div class="tl-arte">${arte}</div></div>
        <div class="tl-balao">
          <span class="tl-rabo" aria-hidden="true"></span>
          <div class="tl-cab"><span class="tl-rotulo">Tutorial da luta</span><span class="tl-conta" aria-live="polite"></span></div>
          <b class="tl-titulo" id="tl-titulo"></b>
          <p class="tl-texto" id="tl-texto"></p>
          <div class="tl-botoes">
            <button type="button" class="tl-pular" onclick="TutorialLuta.fechar(true)">Pular</button>
            <span class="tl-vai">
              <button type="button" class="tl-voltar" onclick="TutorialLuta.voltar()" aria-label="Passo anterior">‹</button>
              <button type="button" class="tl-proximo" onclick="TutorialLuta.proximo()">Próximo</button>
            </span>
          </div>
        </div>
      </div>`;
    /* o toque fora do balão não chega no menu de baixo */
    raiz.addEventListener('click', e => { if (!e.target.closest('.tl-balao')) e.stopPropagation(); });
    document.body.appendChild(raiz);
    /* a caixa do Smeargle abraça a arte, que só tem tamanho depois de
       carregar (a GIF é redimensionada no onload, ou cai na parada) */
    const img = raiz.querySelector('.tl-arte img');
    if (img) img.addEventListener('load', () => this.posicionar(false));
    this._tecla = e => this.tecla(e);
    this._mexeu = () => this.agendar();
    /* o lado do balão só se escolhe de novo quando a largura muda: no
       celular a barra do navegador encolhe ao rolar e muda só a altura */
    this._largura = innerWidth;
    this._redim = () => {
      if (innerWidth !== this._largura){ this._largura = innerWidth; this._lado = null; }
      this.agendar();
    };
    window.addEventListener('keydown', this._tecla, true);
    window.addEventListener('resize', this._redim);
    window.addEventListener('scroll', this._mexeu, true);
  },

  /* sentido: 1 pra frente, -1 pra trás; passo sem alvo na tela é pulado */
  mostrar(n, sentido){
    const raiz = document.getElementById('tutorial-luta');
    if (!raiz || !this.ativo) return;
    const ant = this._passos[this.i];
    let k = n;
    while (k >= 0 && k < this._passos.length){
      const p = this._passos[k];
      this.prepararModo(p);
      if (!p.alvo || this.achar(p.alvo).length) break;
      k += sentido;
    }
    if (k < 0) k = this.i >= 0 ? this.i : 0;
    if (k >= this._passos.length){ this.fechar(true); return; }
    if (ant && ant !== this._passos[k] && ant.depois) ant.depois(this);
    const p = this._passos[k];
    this.prepararModo(p);
    if (p.antes) p.antes(this);
    this.i = k;
    const ultimo = k === this._passos.length - 1;
    raiz.dataset.passo = p.id;
    raiz.querySelector('.tl-titulo').textContent = p.titulo;
    raiz.querySelector('.tl-texto').textContent = typeof concordaJogador === 'function' ? concordaJogador(p.texto()) : p.texto();
    raiz.querySelector('.tl-conta').textContent = `${k + 1} de ${this._passos.length}`;
    raiz.querySelector('.tl-voltar').hidden = k === 0;
    raiz.querySelector('.tl-pular').hidden = ultimo;
    raiz.querySelector('.tl-proximo').textContent = ultimo ? 'Lutar!' : 'Próximo';
    raiz.classList.toggle('sem-alvo', !p.alvo);
    /* o Smeargle dá um pulinho a cada passo */
    const sm = raiz.querySelector('.tl-smeargle');
    sm.classList.remove('pula'); void sm.offsetWidth; sm.classList.add('pula');
    this.enquadrar(p);
    this.posicionar(true);
    /* a ficha cresce com transição: o foco acompanha */
    setTimeout(() => this.posicionar(true), 280);
    const pr = raiz.querySelector('.tl-proximo');
    try { pr.focus({preventScroll:true}); } catch (e) { pr.focus(); }
  },
  proximo(){ if (this.ativo) this.mostrar(this.i + 1, 1); },
  voltar(){ if (this.ativo && this.i > 0) this.mostrar(this.i - 1, -1); },

  /* o menu no andar do passo: a lista de golpes abre de verdade */
  prepararModo(p){
    const quer = p.modo || 'menu';
    if (typeof UI === 'undefined' || UI.modoBatalha === quer) return;
    if (quer === 'golpes') UI.abrirGolpes(); else UI.voltarAoMenu();
  },

  fechar(visto){
    const raiz = document.getElementById('tutorial-luta');
    const p = this._passos[this.i];
    if (p && p.depois) p.depois(this);
    this.ativo = false;
    if (typeof UI !== 'undefined' && UI.modoBatalha === 'golpes' && document.getElementById('acoes')) UI.voltarAoMenu();
    if (this._tecla) window.removeEventListener('keydown', this._tecla, true);
    if (this._mexeu) window.removeEventListener('scroll', this._mexeu, true);
    if (this._redim) window.removeEventListener('resize', this._redim);
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
    if (raiz) raiz.remove();
    if (visto) this.marcar(true);
    /* o foco volta pro menu da luta */
    const lutar = document.querySelector('#acoes .mb-btn.lutar');
    if (lutar) try { lutar.focus({preventScroll:true}); } catch (e) {}
  },

  /* Enter, espaço e → seguem; ← volta; Esc pula; o Tab anda só dentro
     do balão. Nenhuma tecla chega no jogo enquanto o balão está aberto
     (a tecla de opção, a do menu), mas atalho do navegador continua. */
  tecla(e){
    if (!this.ativo) return;
    const raiz = document.getElementById('tutorial-luta');
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Tab' && raiz){
      const bts = [...raiz.querySelectorAll('.tl-balao button:not([hidden])')];
      if (bts.length){
        const at = bts.indexOf(document.activeElement);
        const prox = e.shiftKey ? (at <= 0 ? bts.length - 1 : at - 1) : (at + 1) % bts.length;
        bts[prox].focus();
      }
      e.preventDefault();
      return;
    }
    const foco = document.activeElement;
    /* no botão, Enter e espaço apertam o próprio botão (Pular, ‹) */
    const noBotao = foco && raiz && raiz.contains(foco) && foco.tagName === 'BUTTON';
    if ((e.key === 'Enter' || e.key === ' ') && noBotao) return;
    if (e.key === 'Escape') this.fechar(true);
    else if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') this.proximo();
    else if (e.key === 'ArrowLeft') this.voltar();
    else return;
    e.preventDefault();
  },

  /* ---------- onde fica o balão ---------- */
  achar(sels){
    return [].concat(sels || []).map(s => document.querySelector(s)).filter(el => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
  },
  caixaDe(els){
    if (!els.length) return null;
    const rs = els.map(el => el.getBoundingClientRect());
    const l = Math.min(...rs.map(r => r.left)), t = Math.min(...rs.map(r => r.top));
    const r = Math.max(...rs.map(x => x.right)), b = Math.max(...rs.map(x => x.bottom));
    const raio = parseFloat(getComputedStyle(els[0]).borderTopLeftRadius) || 10;
    return {left:l, top:t, right:r, bottom:b, width:r - l, height:b - t, raio};
  },
  /* o alvo da vez, escolhido no enquadrar */
  caixa(){ return this.caixaDe(this.achar(this._sels)); },
  /* topo: até onde o alto da tela fica tapado pelo .topo, que gruda no
     alto quando a página rola. O que está embaixo dele não se vê: o
     botão de velocidade, no alto da arena, já ficou ali com o foco em
     cima do topo. O balão pode ficar por cima do topo; o alvo, não. */
  medidas(){
    const vw = document.documentElement.clientWidth || window.innerWidth;
    let topo = 0;
    const t = document.querySelector('#app > .topo, .topo');
    if (t){
      const cs = getComputedStyle(t);
      if (cs.position === 'sticky' || cs.position === 'fixed') topo = Math.max(0, t.getBoundingClientRect().bottom);
    }
    return {vw, vh:window.innerHeight, folga:vw < 520 ? 4 : 6, margem:vw < 520 ? 10 : 16, rabo:14, topo};
  },
  /* Quanto rolar a página pro alvo e o balão caberem juntos, com o
     balão embaixo ou em cima: o menor rolar que a página deixa (ela
     não passa do começo nem do fim). null quando não cabe de jeito
     nenhum. */
  rolarPraCaber(c, gh){
    const {vh, folga, margem, rabo, topo} = this.medidas();
    const y = window.scrollY || 0;
    const yMax = Math.max(0, document.documentElement.scrollHeight - vh);
    const precisa = gh + rabo + folga + margem;
    /* o alto do alvo fica abaixo do topo grudado */
    const alto = Math.max(margem, topo + folga + 4);
    let melhor = null;
    for (const [lado, a0, b0] of [
      ['baixo', c.bottom + precisa - vh, c.top - folga - alto],
      ['cima', c.bottom + folga + margem - vh, Math.min(c.top - precisa, c.top - folga - alto)]
    ]){
      const a = Math.max(a0, -y), b = Math.min(b0, yMax - y);
      if (a > b + .5) continue;
      const d = a > 0 ? a : (b < 0 ? b : 0);
      if (!melhor || Math.abs(d) < Math.abs(melhor.d) - .5) melhor = {lado, d:Math.round(d)};
    }
    return melhor;
  },
  /* Uma vez por passo: qual alvo (o inteiro, ou o curto quando o
     inteiro e o balão não cabem juntos), quanto rolar e de que lado
     o balão fica. O lado fica guardado, senão ele trocaria de lado no
     meio da rolagem. */
  enquadrar(p){
    this._lado = null;
    this._sels = p.alvo ? [].concat(p.alvo) : null;
    if (!p.alvo) return;
    const guia = document.querySelector('#tutorial-luta .tl-guia');
    const gh = guia ? guia.offsetHeight : 220;
    let c = this.caixa();
    if (!c) return;
    let r = this.rolarPraCaber(c, gh);
    if (!r && p.alvoCurto && this.achar(p.alvoCurto).length){
      this._sels = [].concat(p.alvoCurto);
      c = this.caixa();
      r = this.rolarPraCaber(c, gh);
    }
    const suave = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (r){
      this._lado = r.lado;
      if (r.d) window.scrollBy({top:r.d, behavior:suave ? 'smooth' : 'auto'});
      return;
    }
    /* não cabe junto: pelo menos o alvo inteiro na tela, fora do topo */
    const {vh, topo} = this.medidas();
    if (c.top < topo + 8 || c.bottom > vh - 8){
      const el = this.achar(this._sels)[0];
      try { el.scrollIntoView({block:'center', behavior:suave ? 'smooth' : 'auto'}); } catch (e) { el.scrollIntoView(); }
    }
  },
  /* rolar e redimensionar: o balão gruda no alvo, sem transição */
  agendar(){
    if (!this.ativo || this._raf) return;
    this._raf = requestAnimationFrame(() => { this._raf = 0; this.posicionar(false); });
  },
  /* suave: de um passo pro outro o foco e o balão deslizam */
  posicionar(suave){
    const raiz = document.getElementById('tutorial-luta');
    if (!raiz || !this.ativo) return;
    raiz.classList.toggle('seguindo', !suave);
    const p = this._passos[this.i];
    const foco = raiz.querySelector('.tl-foco');
    const guia = raiz.querySelector('.tl-guia');
    const balao = raiz.querySelector('.tl-balao');
    const sm = raiz.querySelector('.tl-smeargle');
    const {vw, vh, folga, margem, rabo} = this.medidas();
    const c = p && p.alvo ? this.caixa() : null;
    if (!c){
      /* sem alvo: o balão no meio da tela, tudo escuro em volta */
      Object.assign(foco.style, {left:(vw / 2) + 'px', top:(vh / 2) + 'px', width:'0px', height:'0px', borderRadius:'0px'});
      guia.style.left = Math.max(margem, (vw - guia.offsetWidth) / 2) + 'px';
      guia.style.top = Math.max(margem, (vh - guia.offsetHeight) / 2) + 'px';
      raiz.dataset.lado = 'meio';
      return;
    }
    Object.assign(foco.style, {
      left:(c.left - folga) + 'px', top:(c.top - folga) + 'px',
      width:(c.width + folga * 2) + 'px', height:(c.height + folga * 2) + 'px',
      borderRadius:(c.raio + folga) + 'px'
    });
    const gw = guia.offsetWidth, gh = guia.offsetHeight;
    const cabeBaixo = vh - (c.bottom + folga) - margem >= gh + rabo;
    const cabeCima = (c.top - folga) - margem >= gh + rabo;
    /* o lado que o enquadrar escolheu; sem ele, o que tem espaço */
    const embaixo = this._lado ? this._lado === 'baixo'
      : (cabeBaixo || (!cabeCima && (vh - c.bottom) >= c.top));
    let top = embaixo ? c.bottom + folga + rabo : c.top - folga - rabo - gh;
    top = Math.min(Math.max(margem, top), Math.max(margem, vh - gh - margem));
    /* o balão (não o Smeargle) fica no meio do alvo, sem sair da tela */
    const cx = (c.left + c.right) / 2;
    const offBalao = balao.offsetLeft;
    let left = cx - offBalao - balao.offsetWidth / 2;
    left = Math.min(Math.max(margem, left), Math.max(margem, vw - gw - margem));
    guia.style.left = left + 'px';
    guia.style.top = top + 'px';
    raiz.dataset.lado = embaixo ? 'baixo' : 'cima';
    /* o rabo aponta pro meio do alvo */
    const x = Math.min(Math.max(22, cx - left - offBalao), balao.offsetWidth - 22);
    balao.style.setProperty('--rabo-x', x + 'px');
    /* o Smeargle olha pro botão: a arte de frente olha pra esquerda */
    const meioSm = left + sm.offsetLeft + sm.offsetWidth / 2;
    sm.classList.toggle('olha-direita', cx > meioSm + 8);
  }
};
