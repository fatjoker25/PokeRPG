/* ============================================================
   INTERFACE
   ============================================================ */
/* O vermelho do recolher: pinta só o alfa da imagem (a cor dela nunca
   entra) e desenha em volta uma linha de aura borrada. Filtro SVG no
   próprio documento, porque mask-image com arquivo local esbarra em
   CORS no file:// e o efeito sumiria calado. */
function garantirFiltroVermelho(){
  if (document.getElementById('fx-vermelho')) return;
  const caixa = document.createElement('div');
  caixa.setAttribute('aria-hidden', 'true');
  caixa.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  caixa.innerHTML =
    `<svg width="0" height="0"><filter id="fx-vermelho" x="-25%" y="-25%" width="150%" height="150%"
        color-interpolation-filters="sRGB">
      <feFlood flood-color="#e8242f" result="cor"/>
      <feComposite in="cor" in2="SourceAlpha" operator="in" result="corpo"/>
      <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="gordo"/>
      <feComposite in="gordo" in2="SourceAlpha" operator="out" result="contorno"/>
      <feFlood flood-color="#ff8a80" result="cor2"/>
      <feComposite in="cor2" in2="contorno" operator="in" result="linha"/>
      <feGaussianBlur in="linha" stdDeviation="4" result="aura"/>
      <feMerge><feMergeNode in="aura"/><feMergeNode in="aura"/><feMergeNode in="corpo"/><feMergeNode in="linha"/></feMerge>
    </filter></svg>`;
  document.body.appendChild(caixa);
}

/* Cor do Cartão de Treinador: o jogador escolhe. [clara, base, escura, nome] */
const CORES_CARTAO = {
  azul:    ['#5b96d6', '#2f6fb5', '#1d4373', 'Azul'],
  vermelho:['#e0675c', '#c0392b', '#7d2219', 'Vermelho'],
  verde:   ['#6cc08a', '#2e8b57', '#1b5435', 'Verde'],
  roxo:    ['#a487d6', '#6f4bb0', '#432b70', 'Roxo'],
  laranja: ['#f2a65a', '#d9752b', '#8a4517', 'Laranja'],
  rosa:    ['#f093b8', '#d0578a', '#843056', 'Rosa'],
  dourado: ['#e7cd6e', '#c49a2c', '#7a5c14', 'Dourado'],
  grafite: ['#7d8794', '#4a525d', '#262b31', 'Grafite']
};
function varsCartao(k){
  const c = CORES_CARTAO[k] || CORES_CARTAO.azul;
  return {'--cart-clara':c[0], '--cart':c[1], '--cart-esc':c[2]};
}

/* cores de balão: distintas entre si e legíveis nos dois fundos */
const CORES_DE_FALA = ['#e0a33a', '#5aa9e6', '#e36f8f', '#b18cf0', '#4cc3c3', '#d6c341', '#c9d1dc', '#e86a4a'];   // sem verde: verde é o seu balão

/* ============================================================
   COR DA MOLDURA — preferência de quem joga, fora do save
   Azul é o padrão e não sobrepõe nada: segue o tom de cada capítulo.
   As outras pintam painel, borda e fundo por cima do tom.
   ============================================================ */
const CORES_MOLDURA = [
  {id:'azul',     nome:'Azul (padrão)', amostra:'#2f6076'},
  {id:'vermelho', nome:'Vermelho',      amostra:'#a8404a'},
  {id:'laranja',  nome:'Laranja',       amostra:'#b06a2c'},
  {id:'amarelo',  nome:'Amarelo',       amostra:'#a8922a'},
  {id:'verde',    nome:'Verde',         amostra:'#3f8a5b'},
  {id:'roxo',     nome:'Roxo',          amostra:'#6a4ea6'},
  {id:'rosa',     nome:'Rosa',          amostra:'#a8467f'},
  {id:'grafite',  nome:'Grafite',       amostra:'#5a6372'}
];
function molduraSalva(){
  try { const v = localStorage.getItem('jc-moldura'); return CORES_MOLDURA.some(c => c.id === v) ? v : 'azul'; }
  catch (e) { return 'azul'; }
}
function aplicarMoldura(id){
  const v = id && id !== 'azul' ? id : null;
  [document.documentElement, document.body].forEach(el => {
    if (!el || typeof el.setAttribute !== 'function') return;
    if (v) el.setAttribute('data-moldura', v); else el.removeAttribute('data-moldura');
  });
}
if (typeof document !== 'undefined' && document.addEventListener){
  if (document.body) aplicarMoldura(molduraSalva());
  else document.addEventListener('DOMContentLoaded', () => aplicarMoldura(molduraSalva()));
}

const UI = {
  app:null, dadosRecentes:[],

  init(){ this.app = document.getElementById('app'); },

  /* ---------- helpers ---------- */
  /* Todo texto passa por aqui antes da tela, e é aqui que {o|a} vira a
     forma do gênero de quem joga (ver concordaJogador, em motor.js). */
  esc(s){ return concordaJogador(String(s==null?'':s)).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); },
  el(html){ const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; },
  /* Marca de brilhante. Fica do lado do nome, nunca dentro dele. */
  /* Depois do nome: o sexo e, se for o caso, o brilho. */
  shi(p){ return this.sexo(p) + ((p && p.shiny) ? '<span class="shiny-marca" title="Brilhante">✦</span>' : ''); },
  sexo(p){
    if (!p || !p.uid) return '';
    const g = generoDe(p);
    return g ? `<span class="sexo-marca sexo-${g}" title="${g === 'm' ? 'Macho' : 'Fêmea'}">${g === 'm' ? '♂' : '♀'}</span>` : '';
  },
  /* Tela nova é conversa nova: o dono das falas da última cena não
     passa pra tela seguinte (o Ezra saía com o balão do Brock). */
  limpar(){
    this.app.innerHTML = '';
    this.npcDaCena = null; this.npcEhProprio = false; this.falanteDaCena = null;
    this.vozesDaCena = null; this.minhasFalasDaCena = null;
  },
  add(html){ const e = this.el(html); if (e) this.app.appendChild(e); return e; },
  tom(t){ document.body.setAttribute('data-tom', t || 'leve'); },
  rolarTopo(){ window.scrollTo({top:0, behavior:'smooth'}); },

  mostrarDado(reg){
    this.dadosRecentes.push(reg);
    if (this.dadosRecentes.length > 8) this.dadosRecentes.shift();
  },
  limparDados(){ this.dadosRecentes = []; },
  /* os cinco atributos do Pokérole numa linha */
  linhaAtrib(p){
    return ATRIBUTOS.map(k => `${SIGLA_ATRIB[k]} ${p.stats[k]}`).join(' · ');
  },
  /* ---------- DADOS: eles giram na tela e você pode girar de novo ---------- */
  htmlDados(){
    if (!this.dadosRecentes.length) return this.htmlBandeja();
    const soltos = this.dadosRecentes.filter(d => !d.pool);
    const paradas = this.dadosRecentes.filter(d => d.pool);
    const dados = soltos.map((d,k) => {
      const cls = d.valor === d.faces ? ' max' : (d.valor === 1 ? ' min' : '');
      return `<button class="dado d${d.faces}${cls}" data-v="${d.valor}" data-faces="${d.faces}"
        title="${this.esc(d.motivo||d.dado)} — clique para girar de novo"
        onclick="UI.girarDado(this)" style="animation-delay:${k*70}ms">
        <span class="face">${d.valor}</span>
        <span class="rot">d${d.faces}</span>
      </button>`;
    }).join('');
    const motivos = soltos.map(d =>
      `<span class="dado-legenda"><b>d${d.faces}</b> ${this.esc(d.motivo||'')} <b class="v">${d.valor}</b></span>`).join('');
    /* Pokérole: a parada de d6 aparece inteira, com cada face; o que é
       sucesso (4+, ou 6 no dado de chance) acende */
    const htmlParadas = paradas.map((d, k) => {
      const alvo = d.chance ? 6 : 4;
      const faces = d.pool.length
        ? d.pool.map((v, i) => `<i class="f${v >= alvo ? ' s' : ''}" style="animation-delay:${k*60 + i*25}ms">${v}</i>`).join('')
        : '<span class="p-vazia">nenhum dado</span>';
      const res = d.chance ? (d.valor ? 'pegou' : 'não pegou')
                           : `${d.valor} sucesso${d.valor === 1 ? '' : 's'}`;
      return `<div class="parada${d.valor ? ' deu' : ''}" title="${this.esc(d.motivo || '')}">
        <span class="p-mot">${this.esc(d.motivo || '')} <b class="mono">${d.pool.length}d6</b></span>
        <span class="p-res">${res}</span>
        <span class="p-faces">${faces}</span></div>`;
    }).join('');
    return `<div class="dados-area">
      ${soltos.length ? `<div class="dados-linha">${dados}</div>
      <div class="dados-legendas">${motivos}</div>` : ''}
      ${paradas.length ? `<div class="paradas">${htmlParadas}</div>` : ''}
    </div>` + this.htmlBandeja();
  },

  /* bandeja livre: rolar por rolar, sem efeito nenhum no jogo */
  htmlBandeja(){
    const d = [20,10,6,4].map(f =>
      `<button class="dado d${f} livre" data-faces="${f}" data-v="?"
        title="Girar um d${f}" onclick="UI.girarLivre(this)">
        <span class="face">?</span><span class="rot">d${f}</span>
      </button>`).join('');
    return `<div class="bandeja">
      <span class="bandeja-rot">bandeja</span>
      <div class="dados-linha">${d}</div>
    </div>`;
  },

  girarDado(el){
    const faces = parseInt(el.dataset.faces, 10) || 20;
    const alvo  = parseInt(el.dataset.v, 10);
    this._tumbar(el, faces, alvo);
  },
  girarLivre(el){
    const faces = parseInt(el.dataset.faces, 10) || 20;
    const v = Math.floor(Math.random() * faces) + 1;
    el.dataset.v = v;
    el.classList.toggle('max', v === faces);
    el.classList.toggle('min', v === 1);
    this._tumbar(el, faces, v);
  },
  _tumbar(el, faces, alvo){
    if (el._girando) return;
    el._girando = true;
    const face = el.querySelector('.face');
    el.classList.remove('parou');
    el.classList.add('girando');
    const t0 = Date.now(), dur = 620;
    const it = setInterval(() => {
      face.textContent = Math.floor(Math.random() * faces) + 1;
      if (Date.now() - t0 >= dur){
        clearInterval(it);
        face.textContent = alvo;
        el.classList.remove('girando');
        el.classList.add('parou');
        el._girando = false;
        setTimeout(() => el.classList.remove('parou'), 700);
      }
    }, 55);
  },
  /* faz girar tudo o que acabou de entrar na tela */
  girarNovos(){
    document.querySelectorAll('.dados-linha .dado:not(.livre)').forEach(el => this.girarDado(el));
  },

  tipoTag(t){ return `<span class="tipo-tag" style="background:${COR_TIPO[t]||'#888'}">${t}</span>`; },

  /* experiência até o próximo nível: barra fina, azul, como nos jogos */
  barraExp(p){
    if (!p || p.morto || !p.expProx || p.nivel >= 100) return '';
    const pct = Math.max(0, Math.min(100, Math.round(p.exp / p.expProx * 100)));
    return `<div class="barra-exp" title="${p.exp} / ${p.expProx} de experiência"><i style="width:${pct}%"></i></div>`;
  },
  /* Vontade do seu Pokémon na luta: um ponto por bolinha, e o gasto
     que está armado pro turno que vem */
  linhaVontade(p){
    const v = vontadeDe(p), max = vontadeMaxDe(p);
    const pips = Array.from({length:max}, (_, i) => `<i class="${i < v ? 'cheio' : ''}"></i>`).join('');
    const armada = (Batalha.ativo && Batalha.aliado === p && Batalha.vontadeArmadaAgora) ? Batalha.vontadeArmadaAgora() : null;
    return `<div class="vontade-linha" title="Vontade ${v}/${max}"><span class="k">Vontade</span><span class="pips">${pips}</span>
      <span class="mono">${v}/${max}</span>${armada ? `<span class="vontade-armada">${this.esc(USOS_DE_VONTADE[armada])}</span>` : ''}</div>`;
  },

  /* exp: true põe a barra de experiência colada embaixo da de HP;
     'vaga' guarda o mesmo espaço sem barra, pra que as duas fichas da
     luta tenham a barra de HP na mesma altura e do mesmo tamanho */
  barraHP(p, exp){
    const pct = Math.max(0, (p.hp / p.hpMax) * 100);
    const cls = pct > 50 ? '' : (pct > 22 ? 'medio' : 'baixo');
    const xp = exp === 'vaga' ? '<div class="barra-exp vaga" aria-hidden="true"></div>'
             : exp ? (this.barraExp(p) || '<div class="barra-exp vaga" aria-hidden="true"></div>') : '';
    return `<div class="barra ${cls}"><i style="width:${pct}%"></i></div>${xp}
            <div class="hp-num">${p.hp} / ${p.hpMax} HP</div>`;
  },

  /* o relógio do topo anda sem redesenhar a tela */
  pintarRelogio(){
    document.querySelectorAll('.topo .relogio').forEach(e => { e.textContent = Relogio.texto(); });
  },

  /* ---------- barra superior ---------- */
  /* o lugar onde você está, atrás de tudo */
  pintarCenario(){
    const url = (typeof Arenas !== 'undefined' && Arenas.cenarioDaTela) ? Arenas.cenarioDaTela() : null;
    const b = document.body;
    if (url){ b.style.setProperty('--cenario-lugar', `url("${url}")`); b.classList.add('com-cenario'); }
    else { b.style.removeProperty('--cenario-lugar'); b.classList.remove('com-cenario'); }
    if (typeof Luz !== 'undefined') Luz.aplicar();
  },

  topo(){
    const d = Estado.dados;
    this.pintarCenario();
    /* a trilha segue a tela: luta, rota, cidade, caverna */
    if (typeof Som !== 'undefined') setTimeout(() => Som.aplicarMusica(), 0);
    if (!d) return '';
    const rep = Estado.nomeRep();
    const cap = Historia.capitulo(d.capitulo);
    return `<div class="topo">
      <div>
        <h1>${this.esc(d.jogador.nome)} — ${this.esc(rep)}</h1>
        <div class="sub">${d.local && LOCAIS[d.local] ? this.esc(LOCAIS[d.local].nome) : 'Kanto'} ·
          <span class="relogio">${this.esc(Relogio.texto())}</span> ·
          HP ${d.jogador.hp}/${Estado.hpMaxJogador()} · Vontade ${Estado.vontadeJogador()}/${Estado.vontadeMaxJogador()} · ${fmtDin(d.jogador.dinheiro)} ₽</div>
      </div>
      <div class="topo-acoes">
        <!-- na luta, time e mochila são da barra de ações: aqui em cima ficam trancados -->
        <button class="btn mini" ${emLuta() ? 'disabled title="Na luta, o time é pela barra de ações"' : 'onclick="UI.modalTime()"'}>Time</button>
        <button class="btn mini${Estado.temPokenav() && Estado.numerosDisponiveis().length ? ' pisca' : ''}" ${emLuta() ? 'disabled title="Na luta, a mochila é pela barra de ações"' : 'onclick="UI.modalItens()"'}>Mochila${
          Estado.temPokenav() && Estado.numerosDisponiveis().length ? ' <b>' + Estado.numerosDisponiveis().length + '</b>' : ''}</button>
        <button class="btn mini" onclick="UI.modalFicha()">Ficha</button>
        <button class="btn mini" onclick="UI.modalDiario()">Diário</button>
        <button class="btn mini" onclick="UI.modalAjustes()">Ajustes</button>
      </div>
    </div>`;
  },

  /* ========================================================
     TELA INICIAL
     ======================================================== */
  telaInicial(){
    this.tom('leve'); this.limpar();
    const temSave = Estado.existeSave('auto');
    this.add(`<div class="painel" style="text-align:center;padding:46px 26px">
      <div style="font-size:11.5px;letter-spacing:.24em;color:var(--texto-fraco);text-transform:uppercase">RPG de Mesa · Kanto</div>
      <h2 style="font-size:30px;margin:12px 0 6px;color:var(--destaque);font-weight:300;letter-spacing:.06em">JORNADA DO CAMPEÃO</h2>
      <p style="color:var(--texto-fraco);max-width:520px;margin:0 auto 8px">
        A cadeira de Campeão está vazia há dois anos e a Liga não explica direito por quê.
        E hoje você sai de casa.
      </p>
      <p class="sussurro" style="max-width:520px;margin:0 auto 30px">
        Escolhas são permanentes. O mundo lembra. Se o seu HP chegar a zero, acabou de verdade.
      </p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        ${temSave ? '<button class="btn destaque" onclick="Jogo.continuar()">Continuar</button>' : ''}
        <button class="btn ${temSave?'':'destaque'}" onclick="Jogo.novo()">${temSave ? 'Nova jornada' : 'Começar'}</button>
        <button class="btn" onclick="UI.modalTutorial()">Tutorial</button>
        <button class="btn" onclick="UI.modalRegras()">Regras do sistema</button>
        <button class="btn" onclick="UI.modalFinais()">Códice de finais</button>
      </div>
      ${temSave ? '<div class="sussurro" style="margin-top:18px">Começar uma nova jornada apaga a atual.</div>' : ''}
    </div>`);
  },

  /* ========================================================
     CRIAÇÃO DE PERSONAGEM
     ======================================================== */
  telaCriacao(){
    this.tom('leve'); this.limpar();
    const cidades = CIDADES.map(c => `<option value="${c}">${c}</option>`).join('');
    this.add(`<div class="painel">
      <h2>Criação de Personagem</h2>
      <div class="campo"><label>Nome do treinador</label>
        <input id="f-nome" maxlength="24" placeholder="Como te chamam?"></div>
      <div class="campo"><label>Gênero</label>
        <div class="opcoes-radio" id="f-genero">
          <button data-v="Homem" class="sel">Homem</button>
          <button data-v="Mulher">Mulher</button>
        </div></div>
      <div class="campo"><label>Data de nascimento</label>
        <div class="data-nasc">
          <select id="f-nasc-dia" aria-label="Dia">${Array.from({length:31}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}</select>
          <select id="f-nasc-mes" aria-label="Mês">${MESES_DO_ANO.map((m, i) => `<option value="${i + 1}">${m}</option>`).join('')}</select>
          <select id="f-nasc-ano" aria-label="Ano">${Array.from({length:IDADE_SAIDA_MAX - IDADE_SAIDA_MIN + 2}, (_, i) => ANO_DO_JOGO - IDADE_SAIDA_MAX - 1 + i)
              .map(a => `<option value="${a}">${a}</option>`).join('')}</select>
        </div>
        <div class="sussurro" id="f-nasc-idade"></div></div>
      <div class="campo"><label>Características físicas</label>
        <textarea id="f-aparencia" maxlength="240" placeholder="Altura, cabelo, olhos, cicatriz, o que for."></textarea></div>
      <div class="campo"><label>Personalidade (2 a 3 traços)</label>
        <input id="f-personalidade" maxlength="120" placeholder="teimoso, leal, impulsivo"></div>
      <div class="campo"><label>Vestimenta</label>
        <input id="f-vestimenta" maxlength="160" placeholder="jaqueta velha do seu pai, tênis furado"></div>
      <div class="dois">
        <div class="campo"><label>Cidade de nascimento</label>
          <select id="f-cidade">${cidades}</select></div>
        <div class="campo"><label>Objetivo</label>
          <input id="f-objetivo" maxlength="120" placeholder="O que você quer de verdade?"></div>
      </div>
      <div class="dois">
        <div class="campo"><label>Do que você gosta</label>
          <input id="f-gosta" maxlength="120" placeholder="mar, pescar, Pokémon de fogo, Eevee"></div>
        <div class="campo"><label>Do que você não gosta</label>
          <input id="f-nao-gosta" maxlength="120" placeholder="escuro, multidão, Zubat"></div>
      </div>

      <h3>Quem fica em casa</h3>
      <div class="dois">
        <div class="campo"><label>Nome</label>
          <input id="f-casa-nome" maxlength="24" placeholder="Delia"></div>
        <div class="campo"><label>É sua/seu</label>
          <select id="f-casa-quem">
            <option value="">sortear</option>
            ${PARENTESCOS_F.map((f, i) => `<option>${f}</option><option>${PARENTESCOS_M[i]}</option>`).join('')}
          </select></div>
      </div>
      <div class="sussurro">É essa pessoa que te acorda, te empurra pela porta e vai ficar
        esperando notícia. Ela fala com você pelo nome dela — e você sabe de quem é a voz.</div>

      <h3>Pokémon inicial</h3>
      <div class="opcoes-radio" id="f-inicial" style="margin-bottom:10px">
        <button data-v="classico" class="sel">Um dos três clássicos</button>
        <button data-v="rand">Aleatório (o que já estava na casa)</button>
      </div>
      <div class="sussurro" id="f-inicial-desc">Tradição: você não começa com ele. Bulbasaur, Charmander ou Squirtle — a escolha é na hora, com os três fora da Pokébola, na sua frente. Em Pallet, quem traz é o Professor; em outra cidade, a perua do laboratório.</div>

      <h3>Ritmo do combate</h3>
      <div class="opcoes-radio" id="f-ritmo" style="margin-bottom:10px">
        <button data-v="fiel" class="sel">Pokérole (do livro)</button>
        <button data-v="longo">Combate prolongado</button>
      </div>
      <div class="sussurro" id="f-ritmo-desc">
        Pokérole: parada de d6, HP do livro. Cada golpe pesa.
      </div>

      <div style="margin-top:26px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn destaque" onclick="Jogo.criar()">Sair de casa</button>
        <button class="btn" onclick="UI.telaInicial()">Voltar</button>
      </div>
      <div id="f-erro" style="color:var(--perigo);margin-top:12px;font-size:13.5px"></div>
    </div>`);

    const grupo = (id, onSel) => {
      const cont = document.getElementById(id);
      cont.querySelectorAll('button').forEach(b => b.onclick = () => {
        cont.querySelectorAll('button').forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
        if (onSel) onSel(b.dataset.v);
      });
    };
    grupo('f-genero');
    /* começa em alguém que sai de casa com quinze anos; a idade de saída
       aparece embaixo e muda com a data e com a cidade (o dia da perua) */
    const pD = document.getElementById('f-nasc-dia'), pM = document.getElementById('f-nasc-mes'), pA = document.getElementById('f-nasc-ano');
    pD.value = String(Dados.entre(1, 28)); pM.value = String(Dados.entre(4, 12)); pA.value = String(ANO_DO_JOGO - 16);
    const mostrarIdade = () => {
      const f = this.lerCriacao();
      const i = idadeNaSaidaDaFicha(f);
      const el = document.getElementById('f-nasc-idade');
      const fora = i < IDADE_SAIDA_MIN || i > IDADE_SAIDA_MAX;
      el.textContent = fora ? `A jornada começa entre ${IDADE_SAIDA_MIN} e ${IDADE_SAIDA_MAX} anos. Com essa data você sairia com ${i}.`
                            : `Você sai de casa com ${i} anos.`;
      el.classList.toggle('erro-campo', fora);
    };
    [pD, pM, pA, document.getElementById('f-cidade')].forEach(x => x.addEventListener('change', mostrarIdade));
    mostrarIdade();
    grupo('f-inicial', v => {
      document.getElementById('f-inicial-desc').textContent = v === 'rand'
        ? 'Aleatório: um Pokémon de 1ª Geração, primeiro estágio. Ele já morava na sua casa quando você decidiu sair — não é seu de papel, é seu de convivência. Vínculo máximo.'
        : 'Tradição: você não começa com ele. Bulbasaur, Charmander ou Squirtle — a escolha é na hora, com os três fora da Pokébola, na sua frente. Em Pallet, quem traz é o Professor; em outra cidade, a perua do laboratório.';
    });
    grupo('f-ritmo', v => {
      document.getElementById('f-ritmo-desc').textContent = v === 'fiel'
        ? 'Pokérole: parada de d6, HP do livro. Cada golpe pesa.'
        : 'Prolongado: mesmo dado, HP base de cada espécie em dobro. Combates duram mais turnos.';
    });
  },

  lerCriacao(){
    const sel = id => { const b = document.querySelector('#'+id+' button.sel'); return b ? b.dataset.v : null; };
    const v = id => (document.getElementById(id).value || '').trim();
    return {
      nome:v('f-nome'), genero:sel('f-genero'), aparencia:v('f-aparencia'),
      personalidade:v('f-personalidade'), vestimenta:v('f-vestimenta'),
      cidade:document.getElementById('f-cidade').value, objetivo:v('f-objetivo'),
      gosta:v('f-gosta'), naoGosta:v('f-nao-gosta'),
      inicial:sel('f-inicial'), ritmo:sel('f-ritmo'),
      nascimento:{dia:+document.getElementById('f-nasc-dia').value, mes:+document.getElementById('f-nasc-mes').value,
                  ano:+document.getElementById('f-nasc-ano').value},
      casaNome: (v('f-casa-nome') || '').trim(),
      casaQuem: (v('f-casa-quem') || '').trim()
    };
  },

  /* ========================================================
     NARRAR — texto puro vira parágrafo; fala com dono vira balão
     com o nome de quem falou em cima. Assim dá pra saber quem
     está falando com você sem ter que deduzir pelo contexto.
     ======================================================== */
  /* ------------------------------------------------------------
     DE QUEM É A CENA
     A história registra quem você conheceu: `ef:{npc:{nome:'...'}}`.
     Esse nome é autoral e não erra. A partir dele, a conversa se
     espalha pelas cenas seguintes — uma conversa é um punhado de
     cenas ligadas, e quem estava falando continua falando.
     ------------------------------------------------------------ */
  donosDoCapitulo(cap){
    if (!cap || !cap.cenas) return {};
    this._donos = this._donos || {};
    if (this._donos[cap.num]) return this._donos[cap.num];

    const nomeDoEf = ef => {
      if (!ef) return null;
      const n = ef.npc;
      if (!n || typeof n === 'function') return null;
      if (Array.isArray(n)) return n.length === 1 && n[0] && n[0].nome ? n[0].nome : null;
      return n.nome || null;
    };

    const dono = {}, proprio = {};
    /* semente forte: a própria cena registra de quem é */
    for (const id in cap.cenas){
      const n = nomeDoEf(cap.cenas[id].ef);
      if (n){ dono[id] = n; proprio[id] = true; }
    }

    /* espalha: uma conversa é um punhado de cenas ligadas, e quem
       estava falando continua falando na cena seguinte. Vale pros
       dois lados — a cena em que a pessoa aparece costuma vir antes
       da cena em que a história registra o nome dela. */
    const ehDono = id => Object.prototype.hasOwnProperty.call(dono, id);
    for (let passo = 0; passo < 4; passo++){
      const novos = {};
      for (const id in cap.cenas){
        const c = cap.cenas[id];
        for (const e of (c.escolhas || [])){
          const alvo = e && e.vai;
          if (!alvo || !cap.cenas[alvo]) continue;
          /* pra frente */
          if (ehDono(id) && !ehDono(alvo) && !novos[alvo] && !nomeDoEf(cap.cenas[alvo].ef))
            novos[alvo] = dono[id];
          /* pra trás: só quando não há dúvida — TODA saída da cena leva
             à mesma pessoa. Uma opção "contar pra Misty" no meio de uma
             conversa com o motorista não faz da cena uma cena da Misty. */
          if (!ehDono(id) && !nomeDoEf(c.ef) && novos[id] === undefined){
            const saidas = (c.escolhas || []).map(x => x && x.vai).filter(v => v && cap.cenas[v]);
            const quem = saidas.length && saidas.every(v => ehDono(v) && dono[v] === dono[saidas[0]]) ? dono[saidas[0]] : null;
            if (quem) novos[id] = quem;
          }
        }
      }
      let mudou = false;
      for (const k in novos){ if (!ehDono(k) && novos[k]){ dono[k] = novos[k]; mudou = true; } }
      if (!mudou) break;
    }

    /* semente fraca, só pro que sobrou: a narração cita um nome
       conhecido, e só um. Vale menos porque a cena pode estar
       falando SOBRE a pessoa em vez de falar COM ela — por isso
       vem depois de tudo. */
    const nomes = this.registroDeNomes();
    for (const id in cap.cenas){
      if (ehDono(id)) continue;
      const achados = new Set();
      for (const linha of (cap.cenas[id].texto || [])){
        if (typeof linha === 'function') continue;
        const t = (linha && linha.diz != null) ? String(linha.quem || '') : String(linha || '');
        for (const nome of nomes) if (nome && t.indexOf(nome) !== -1) achados.add(nome);
      }
      if (achados.size === 1) dono[id] = achados.values().next().value;
    }

    /* o que VOCÊ disse: quando a opção escolhida era uma frase entre
       aspas, a cena de destino repete essa frase. Ela é sua, e isso
       vale mesmo depois de fechar o jogo e voltar. */
    const minhas = {};
    for (const id in cap.cenas){
      for (const e of (cap.cenas[id].escolhas || [])){
        if (!e || !e.vai || typeof e.texto !== 'string') continue;
        const reg = minhas[e.vai] = minhas[e.vai] || {quotes:[], acoes:[]};
        const m = /[\u201C\"]([^\u201C\u201D\"]+)[\u201D\"]/.exec(e.texto);
        if (m) reg.quotes.push(m[1].trim());
        else reg.acoes.push(e.texto);
      }
    }

    this._donos[cap.num] = {dono, minhas, proprio};
    return this._donos[cap.num];
  },

  /* Todo nome próprio que o jogo conhece. Serve pra descobrir quem
     está falando quando a linha é só uma frase entre aspas. */
  registroDeNomes(){
    if (this._nomes) return this._nomes;
    const n = new Set();
    const por = arr => (arr||[]).forEach(x => { const v = x && (x.nome || x.lider); if (v) n.add(v); });
    if (typeof CONTATOS !== 'undefined') por(CONTATOS);
    if (typeof GINASIOS !== 'undefined') por(GINASIOS);
    if (typeof ELITE4  !== 'undefined') por(ELITE4);
    if (typeof CAMPEAO !== 'undefined' && CAMPEAO && CAMPEAO.nome) n.add(CAMPEAO.nome);
    if (typeof RIVAIS_EXTRA !== 'undefined') por(RIVAIS_EXTRA);
    ['Ezra','Oak','Professor Oak','Bill','Dr. Fuji','Lance','Agatha','Bruno','Lorelei',
     'Blue','Red','Fabre','Nadia','Vernon','Aldous'].forEach(x => n.add(x));
    /* e todo nome que a história registra como gente que você conheceu */
    if (typeof CAPITULOS !== 'undefined')
      for (const cap of CAPITULOS)
        for (const id in (cap.cenas || {})){
          const ef = cap.cenas[id].ef;
          if (!ef || !ef.npc || typeof ef.npc === 'function') continue;
          const lista = Array.isArray(ef.npc) ? ef.npc : [ef.npc];
          lista.forEach(x => { if (x && x.nome) n.add(x.nome); });
        }
    this._nomes = n;
    return n;
  },

  /* Uma linha que é só uma frase entre aspas é fala de alguém. Quem,
     a gente tenta descobrir pela linha de narração logo antes: se ela
     cita um nome só, é dele. Se cita dois, ou nenhum, o balão fica sem
     nome — melhor sem nome do que com o nome errado. */
  quemFalouAntes(narracao){
    if (!narracao) return null;
    const achados = new Set();
    const nomes = this.registroDeNomes();
    if (Estado.dados && Estado.j){
      if (Estado.j.nome) nomes.add(Estado.j.nome);
      if (typeof nomeCasa === 'function'){ const c = nomeCasa(); if (c) nomes.add(c); }
    }
    for (const nome of nomes){
      if (!nome) continue;
      if (narracao.indexOf(nome) !== -1) achados.add(nome);
    }
    /* 'Blue' dentro de 'Bluezinho' não vale, mas 'Brock' dentro de
       'Brock e Ezra' vale pros dois — e aí são dois, e some o nome. */
    if (achados.size !== 1) return null;
    return achados.values().next().value;
  },


  /* Quebra uma linha em pedaços de narração e de fala. Devolve null
     quando não há fala nenhuma, pra linha seguir sendo parágrafo. */
  partirFalas(texto){
    /* aspas dentro de aspas: “achado atípico” dentro de "..." vira
       ‘achado atípico’, senão a curva fecha a fala no meio da frase */
    if (texto.indexOf('"') !== -1)
      texto = texto.replace(/"([^"]*)"/g, (m, d) => '"' + d.replace(/“/g, '‘').replace(/”/g, '’') + '"');
    const re =/[\u201C\"]([^\u201C\u201D\"]+)[\u201D\"]/g;
    /* quantas aspas dessa linha terminam em pontuação: se pelo menos
       uma termina, a linha é diálogo e as outras também são fala */
    const pontuadas = (texto.match(/[\u201C\"][^\u201C\u201D\"]+[.?!\u2026\u2014,:;)][\u201D\"]/g) || []).length;
    const pedacos = []; let fim = 0, m, achouFala = false;
    while ((m = re.exec(texto))){
      const dentro = m[1].trim();
      /* fala de verdade termina em pontuação; o resto é aspas de ironia,
         a não ser que a linha já seja diálogo e o trecho tenha fôlego */
      const pontuada = /[.?!\u2026\u2014,:;)]$/.test(dentro);
      if (dentro.length < 2) continue;
      if (!pontuada && !(pontuadas > 0 && dentro.indexOf(' ') !== -1)) continue;
      const antes = texto.slice(fim, m.index).trim();
      if (antes) pedacos.push({tipo:'narracao', texto:antes});
      pedacos.push({tipo:'fala', texto:dentro});
      fim = m.index + m[0].length;
      achouFala = true;
    }
    if (!achouFala) return null;
    const resto = texto.slice(fim).trim();
    if (resto) pedacos.push({tipo:'narracao', texto:resto});
    return pedacos;
  },

  /* Quem fala a próxima frase entre aspas. Uma conversa é uma troca:
     alterna entre você e a outra pessoa, e a narração no meio corrige
     o rumo quando diz de quem é a vez. */
  ladoDaFala(narracao, anterior, npc){
    if (!narracao) return anterior === 'npc' ? 'voce' : 'npc';
    const n = narracao.trim();
    /* "Você diz", "Você pergunta", "Você responde" — é sua vez */
    /* Quem é o sujeito da frase manda. "Ele desliga a televisão quando
       você pergunta" é dele, não seu — por isso o sujeito vem primeiro
       e o "você <verbo>" solto vem por último.
       (E nada de \b depois de "Você": o ê não é caractere de palavra
       em JS e a borda simplesmente não existe ali.) */
    /* Narração que termina em dois-pontos anuncia a fala que vem: quem
       fala é o sujeito da última oração ("...e ela responde:"). Sem os
       dois-pontos, vale o primeiro sujeito da frase. */
    const doisPontos = /:$/.test(n);
    const todos = [];
    const re = /(^|[^a-zà-ÿ])(ele|ela|eles|elas|você|voce)([^a-zà-ÿ]|$)/gi;
    let m; while ((m = re.exec(n))) todos.push({i:m.index, lado: /^(você|voce)$/i.test(m[2]) ? 'voce' : 'npc'});
    /* o nome da pessoa vale tanto quanto o pronome dela: "Ezra olha
       pro Pidgey e depois pra você" é fala do Ezra, não sua */
    if (npc){
      const curto = npc.split(' ').filter(x => x.length > 2).pop() || npc;
      let i = n.indexOf(curto);
      while (i !== -1){ todos.push({i, lado:'npc'}); i = n.indexOf(curto, i + 1); }
      todos.sort((a, b) => a.i - b.i);
    }
    if (todos.length) return doisPontos ? todos[todos.length-1].lado : todos[0].lado;
    if (/^(O |A |Os |As |Um |Uma )/.test(n)) return 'npc';
    /* narração que não diz de quem é ("Uma pausa.", "Rápido demais.")
       não troca a vez: quem estava falando continua */
    return anterior || 'npc';
  },

  /* A primeira fala da cena é a mais difícil: ninguém falou antes dela.
     A pista está na opção que trouxe você até aqui. */
  _normaliza(t){
    return String(t||'').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  },
  primeiraEhSua(fala, suas, comecaNaFala){
    const f = this._normaliza(fala);
    for (const q of (suas && suas.quotes || [])){
      const n = this._normaliza(q);
      if (n === f) return true;
      if (n.slice(0,20) && f.slice(0,20) && n.slice(0,20) === f.slice(0,20)) return true;
    }
    /* Sem casar com nenhuma opção: a cena que abre na boca do jogador
       quase sempre abre com uma pergunta. Resposta é do outro lado. */
    if (!comecaNaFala) return false;
    return /\?$/.test(String(fala||'').trim());
  },

  /* Alguém novo entra em cena ("sai um rapaz de uns dezoito anos") e é
     ELE quem fala, não quem estava conversando com você antes. Nesses
     casos o balão fica sem nome: melhor sem nome do que com o errado. */
  _ALGUEM_NOVO: /\b(um|uma)\s+(rapaz|mo[çc]o|mo[çc]a|senhor|senhora|garoto|garota|menino|menina|homem|mulher|cara|sujeito|velho|velha|guarda|policial|atendente|funcion[áa]ri[oa]|vendedor|vendedora|enfermeir[oa]|m[ée]dic[oa]|motorista|pescador|treinador|treinadora|crian[çc]a|adolescente|estudante|senhorinha|sujeita)\b/i,

  /* A cena apresenta alguém ("sai um rapaz de uns dezoito anos")? Então
     é ELE quem fala, e o nome dele é a descrição que a própria cena deu. */
  quemAcabouDeEntrar(linhas){
    const ARTIGO = {um:'o', uma:'a', Um:'o', Uma:'a'};
    for (const linha of (linhas || [])){
      if (typeof linha === 'function') continue;
      const t = (linha && linha.diz != null) ? '' : String(linha || '');
      const m = this._ALGUEM_NOVO.exec(t);
      this._ALGUEM_NOVO.lastIndex = 0;
      if (m) return (ARTIGO[m[1]] || 'o') + ' ' + m[2].toLowerCase();
    }
    return null;
  },

  nomeConfiavel(npc, linhas, proprio){
    if (proprio && npc) return npc;
    const novo = this.quemAcabouDeEntrar(linhas);
    if (novo) return novo;                                  // quem entrou agora é quem fala
    if (!npc) return null;
    const curto = npc.split(' ').filter(x => x.length > 3).pop() || npc;
    /* "Homem das tigelas": rótulo de cargo não é nome, e "tigelas" numa
       fala não quer dizer que estão falando dele */
    if (!/^[A-ZÀ-Ú]/.test(curto)) return npc;
    for (const linha of (linhas || [])){
      if (typeof linha === 'function') continue;
      const t = (linha && linha.diz != null) ? String(linha.diz) : String(linha || '');
      const q = /[\u201C\"]([^\u201C\u201D\"]+)[\u201D\"]/g; let m;
      while ((m = q.exec(t))) if (m[1].indexOf(curto) !== -1) return null;  // falam DELE
    }
    return npc;
  },

  /* só o que de fato carrega texto escrito — nada de "carimbo" ou
     "crachá", que aparecem em cena de conversa e roubavam a fala */
  _ESCRITO: /\b(placa|cartaz|letreiro|plaquinha|pichação|manchete|mural|painel|outdoor|banner|escrito à mão|escrita a caneta|está escrito|escrito assim|escreve no seu caderno|letra de (criança|imprensa|fôrma|forma))\b/i,
  /* Papel também se reconhece pela descrição logo depois: "…" — com
     uma foto colada, "…" — letra de imprensa. O travessão ali descreve
     o papel, não quem falou. */
  pareceEscrito(fala, depois){
    return /^\s*[\u2014\u2013]\s*(com uma foto|sem foto|letra d|escrit|a caneta|a lápis|assinad|datilograf|impress)/i.test(depois || '');
  },

  /* Quem fala sozinho numa tela sem cena (o rival na estrada): toda
     aspa é dele, e nenhuma vira fala sua por alternância. */
  narrarMonologo(linhas, quem){
    this.monologoDe = quem;
    try { return this.narrar(linhas); } finally { this.monologoDe = null; }
  },

  narrar(linhas, dono, minhas){
    const bruto = dono || this.npcDaCena || null;
    /* `falante` na cena manda em tudo: é o autor dizendo quem fala. */
    const npc = this.monologoDe || this.falanteDaCena || this.nomeConfiavel(bruto, linhas, this.npcEhProprio);
    const suas = minhas || this.minhasFalasDaCena || null;
    const meuNome = (Estado.dados && Estado.j) ? Estado.j.nome : null;
    /* `pendente` é a narração que veio IMEDIATAMENTE antes da próxima
       fala. Duas falas coladas, sem narração no meio, são uma troca:
       a vez passa pro outro. */
    let pendente = null, primeira = true, lado = null, ultimaBoca = null;
    /* cor por pessoa: sai do nome, e se outra pessoa da mesma tela já
       usa aquela cor, pega a próxima livre */
    const coresUsadas = new Map();
    const corDe = (quem) => {
      if (!quem || quem === meuNome) return '';
      if (coresUsadas.has(quem)) return coresUsadas.get(quem);
      const usadas = new Set(coresUsadas.values());
      let h = 0; for (const ch of String(quem)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      let k = h % CORES_DE_FALA.length, n = 0;
      while (usadas.has(CORES_DE_FALA[k]) && n++ < CORES_DE_FALA.length) k = (k + 1) % CORES_DE_FALA.length;
      coresUsadas.set(quem, CORES_DE_FALA[k]);
      return CORES_DE_FALA[k];
    };
    const estiloCor = (quem) => { const c = corDe(quem); return c ? ` style="--fala-cor:${c}"` : ''; };
    /* `vozes` na cena: o autor diz, aspa por aspa, quem fala — 'P' é
       você, 'N' é o falante da cena, qualquer outro texto é o nome de
       uma terceira pessoa. Manda mais que qualquer adivinhação. */
    const vozes = this.monologoDe ? null : this.vozesDaCena;
    let voz = 0;

    return (linhas||[]).map(bruto => {
      const f = (typeof falaDe === 'function') ? falaDe(bruto) : null;
      if (f){
        const tom = f.tom ? ' ' + f.tom : '';
        /* A sua própria fala encosta no outro lado, pra conversa ler como
           conversa e não como uma pessoa só falando sete vezes. */
        const meu = (meuNome && f.quem === meuNome) ? ' voce' : '';
        lado = meu ? 'voce' : 'npc';
        /* balão sem nome parece conversa sem ninguém: toda fala leva o
           nome, mesmo a segunda seguida da mesma boca (só o retrato some) */
        const repete = (ultimaBoca === f.quem);
        ultimaBoca = f.quem;
        return `<div class="fala${tom}${meu}${repete ? ' segue' : ''}"${meu ? '' : estiloCor(f.quem)}>
          <div class="fala-quem">${repete ? '' : this.retratoFala(f.quem, f.rotulo)}${this.esc(f.quem)}</div>
          <p class="fala-diz">${this.esc(f.diz)}</p>
          ${f.nota ? `<div class="fala-nota">${this.esc(f.nota)}</div>` : ''}
        </div>`;
      }
      const t = txt(bruto);
      if (!t) return '';

      /* **PLACA, BILHETE, CABEÇALHO**: linha inteira em negrito é coisa
         escrita. Aspas dentro dela são do papel, não de alguém falando. */
      const bloco = /^\s*\*\*([\s\S]*?)\*\*\s*$/.exec(t);
      if (bloco && !/\*\*/.test(bloco[1])){
        const dentro = bloco[1].trim().replace(/^["\u201C]([\s\S]*)["\u201D]$/, '\u201C$1\u201D');
        pendente = t; ultimaBoca = null;
        return `<p class="escrito">${this.esc(dentro)}</p>`;
      }

      /* Trecho entre aspas é fala. Aspas curtas sem pontuação final
         são aspas de ironia ("análise jurídica") e ficam na narração. */
      const pedacos = this.partirFalas(t);
      if (!pedacos){
        pendente = t; ultimaBoca = null; return `<p>${this.esc(t)}</p>`;
      }

      let html = '';
      let papelNaLinha = false;
      for (let k = 0; k < pedacos.length; k++){
        const pe = pedacos[k];
        if (pe.tipo === 'narracao'){
          /* ", diz a atendente" é atribuição da fala anterior, não
             parágrafo novo: tira a vírgula que ficou órfã na frente. */
          const limpo = html ? pe.texto.replace(/^[,;]\s*/, '') : pe.texto;
          html += html ? `<p class="entre-falas">${this.esc(limpo)}</p>`
                       : `<p>${this.esc(limpo)}</p>`;
          pendente = pe.texto; ultimaBoca = null;
          continue;
        }
        /* o que está escrito numa placa não é alguém falando com você */
        const depois = pedacos[k + 1] && pedacos[k + 1].tipo === 'narracao' ? pedacos[k + 1].texto : '';
        /* "AQUI TEM VULCÃO" e "PERIGO???": a segunda vem do mesmo papel
           quando o que separa as duas é um "e" */
        const mesmoPapel = papelNaLinha && (pendente || '').split(/\s+/).length <= 3;
        /* com `vozes`, o autor já disse o que cada aspa é: 'E' é papel */
        const vozAqui = (vozes && voz < vozes.length) ? vozes[voz] : null;
        if (vozAqui === 'E' || (!vozAqui && (this._ESCRITO.test(pendente || '') || mesmoPapel || this.pareceEscrito(pe.texto, depois)))){
          if (vozAqui === 'E') voz++;
          papelNaLinha = true;
          html += `<p class="escrito">${this.esc('“' + pe.texto + '”')}</p>`;
          continue;
        }
        let outro = null;
        /* a frase que você acabou de escolher é sua, sem discussão */
        if (vozes && voz < vozes.length){
          const v = vozes[voz++];
          lado = v === 'P' ? 'voce' : 'npc';
          if (v !== 'P' && v !== 'N') outro = v;
        }
        else if (this.monologoDe) lado = 'npc';
        else if (this.falaDoJogador && pe.texto === this.falaDoJogador) lado = 'voce';
        else if (primeira)
          lado = this.primeiraEhSua(pe.texto, suas, pendente === null) ? 'voce'
               : this.ladoDaFala(pendente, null, npc);
        else if (pendente !== null) lado = this.ladoDaFala(pendente, lado, npc);
        else lado = (lado === 'voce') ? 'npc' : 'voce';
        /* '"Eu sei", ele diz.' — a atribuição vem depois da aspa e manda
           mais que a alternância: "ele diz" nunca é você falando */
        if (!outro && !(vozes && voz <= vozes.length && voz > 0) && !this.monologoDe && !(this.falaDoJogador && pe.texto === this.falaDoJogador)){
          const verbo = '(diz|disse|repete|concorda|pergunta|responde|fala|completa|continua|murmura|insiste|corrige|acrescenta|emenda)';
          if (new RegExp('^[,;]?\\s*(ele|ela)\\s+' + verbo + '\\b', 'i').test(depois)) lado = 'npc';
          else if (new RegExp('^[,;]?\\s*você\\s+' + verbo + '\\b', 'i').test(depois)) lado = 'voce';
        }
        primeira = false; pendente = null;

        /* quem já disse o nome (ou teve o nome perguntado) aparece com ele,
           mesmo quando o balão veio do `falante` da cena */
        const rotulo = outro || npc;
        const quem = lado === 'voce' ? meuNome
                   : (rotulo && typeof Nomes !== 'undefined' ? Nomes.comoChamar(rotulo) : rotulo);
        const meu = lado === 'voce' ? ' voce' : '';
        const repete = quem && ultimaBoca === quem;
        ultimaBoca = quem || null;
        html += `<div class="fala${quem ? '' : ' anonima'}${meu}${repete ? ' segue' : ''}"${meu ? '' : estiloCor(quem)}>`
              + (quem ? `<div class="fala-quem">${lado === 'voce' || repete ? '' : this.retratoFala(quem, rotulo)}${this.esc(quem)}</div>` : '')
              + `<p class="fala-diz">${this.esc(pe.texto)}</p></div>`;
      }
      return html;
    }).filter(Boolean).join('')
      /* **trecho** no meio da frase: o crachá, o número do processo */
      .replace(/\*\*([^*<>]+?)\*\*/g, '<strong>$1</strong>');
  },

  /* ========================================================
     CENA NARRATIVA
     ======================================================== */
  telaCena(cena, avisos){
    Estado.dados.modo = 'cena';
    const cap = Historia.capAtual;
    this.tom(cap.tom); this.limpar(); this.limparDados();
    this.add(this.topo());

    /* de quem é essa conversa: a história registra o nome, e ele
       vale pra cena inteira e pras cenas em que a conversa continua */
    const mapa = this.donosDoCapitulo(cap);
    this.npcDaCena = mapa.dono[Estado.dados.cena] || null;
    this.npcEhProprio = !!mapa.proprio[Estado.dados.cena];
    this.falanteDaCena = cena.falante || null;
    this.vozesDaCena = cena.vozes || null;
    this.minhasFalasDaCena = (mapa.minhas[Estado.dados.cena]) || null;
    /* quem já te conhece te reconhece antes da primeira fala */
    const paras = this.narrar(typeof Reencontros !== 'undefined'
      ? Reencontros.prefaciar(cena.texto, Estado.dados.capitulo + ':' + Estado.dados.cena) : cena.texto);
    this.vozesDaCena = null;      // vale só pro texto da própria cena
    if (typeof Jogo !== 'undefined' && Jogo.tocarAdiada) Jogo.tocarAdiada();

    const html = `<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">Capítulo ${cap.num}</div>
        <div class="tit">${this.esc(cap.titulo)}</div>
        <div class="loc">${this.esc(txt(cap.local))}</div>
      </div>
      <div class="narrativa">${paras}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas"></div>
    </div>`;
    this.add(html);

    if (avisos && avisos.length) this.avisos(avisos);
    this.montarAcoes(cena);
    this.rolarTopo();
    this.talvezApelido();
  },

  /* chegou alguém novo enquanto a tela era outra: pergunta o nome agora */
  talvezApelido(){
    const d = Estado.dados;
    if (!d || !(d.apelidar || []).length || document.getElementById('modal')) return;
    setTimeout(() => { if (!document.getElementById('modal')) Jogo.resolverApelidos(() => {}); }, 60);
  },

  avisos(lista, alvo){
    const c = document.getElementById(alvo || 'avisos');
    if (!c) return;
    lista.forEach(a => {
      /* Um aviso pode carregar uma fala com dono (conversa de cidade, por
         exemplo). Nesse caso ele vira balão, não tarja. */
      const f = (typeof falaDe === 'function') ? falaDe(a.texto) : null;
      if (f){
        c.appendChild(this.el(`<div class="narrativa aviso-fala">${this.narrar([a.texto])}</div>`));
        return;
      }
      if (a.tipo === 'eco'){
        c.appendChild(this.el(`<div class="eco">${this.esc(txt(a.texto))}</div>`));
        return;
      }
      c.appendChild(this.el(`<div class="aviso ${this.esc(a.tipo||'info')}">${this.esc(txt(a.texto))}</div>`));
    });
  },

  montarAcoes(cena){
    const c = document.getElementById('escolhas');
    if (!c) return;

    if (cena.batalha){ c.appendChild(this.el(`<button class="escolha" onclick="Jogo.iniciarBatalhaDaCena()">Encarar.</button>`)); return; }
    if (cena.teste){
      const t = cena.teste;
      c.appendChild(this.el(`<button class="escolha" onclick="Jogo.rolarTeste()">Rolar ${this.esc(t.nomeStatus||t.status)} — 1d10 + ${Estado.j.status[t.status]} (dificuldade ${t.dificuldade})</button>`));
      /* Forçar o destino, do lado do treinador: 1 de Vontade, +2 no d10 */
      if (Estado.vontadeJogador() > 0)
        c.appendChild(this.el(`<button class="escolha" onclick="Jogo.rolarTeste(true)">Rolar gastando 1 de Vontade — 1d10 + ${Estado.j.status[t.status]} + 2</button>`));
      return;
    }
    if (cena.sacrificio){
      const vivos = Estado.timeVivo();
      c.appendChild(this.el(`<div class="sussurro">${this.esc(cena.sacrificio.pergunta)} — essa escolha é permanente.</div>`));
      if (!vivos.length){
        c.appendChild(this.el(`<button class="escolha" onclick="Jogo.irPara('${cena.sacrificio.vai}')">Você não tem ninguém. Vai sozinh{o|a}.</button>`));
      } else {
        vivos.forEach(p => {
          c.appendChild(this.el(`<button class="escolha perigo" onclick="Jogo.sacrificar('${p.uid}')">
            ${this.esc(nomeExib(p))} — Nv ${p.nivel}${p.naturezaVista ? ', ' + this.esc(p.natureza) : ''}, moral ${p.moral}</button>`));
        });
      }
      return;
    }
    if (cena.final){ c.appendChild(this.el(`<button class="escolha" onclick="Jogo.mostrarFinal()">…</button>`)); return; }
    if (cena.fim){ c.appendChild(this.el(`<button class="escolha" onclick="Jogo.fecharCapitulo()">Encerrar o capítulo.</button>`)); return; }

    /* Primeiro com o filtro de "já fiz isso e não deu nada"; se isso
       apagar a cena inteira, mostra tudo — ninguém fica preso. */
    const id = cena.id || Estado.dados.cena;
    let visiveis = (cena.escolhas||[]).map((e,i)=>({e,i}))
      .filter(x => Historia.disponivel(x.e, id, x.i));
    if (!visiveis.length)
      visiveis = (cena.escolhas||[]).map((e,i)=>({e,i})).filter(x => Historia.disponivel(x.e));
    visiveis.forEach(({e, i}) => {
      c.appendChild(this.el(`<button class="escolha" onclick="Jogo.escolher(${i})">${this.esc(txt(e.texto))}</button>`));
    });
    /* O capítulo acontece numa cidade com Centro: dá pra passar lá sem
       largar a história — cura, PC, mapa — e voltar pro mesmo ponto. */
    const aqui = Mundo.atual();
    if (Estado.dados.capitulo > 1 && aqui && aqui.tipo === 'cidade' && (aqui.lugares || []).includes('centro'))
      c.appendChild(this.el(`<button class="escolha utilitaria" onclick="Cidade.centro()">Ir ao balcão do Centro Pokémon e voltar</button>`));

    /* Parar e olhar vale uma vez por cena: a segunda olhada nunca
       mostrou nada e virava um botão que convidava a clicar à toa. */
    if (visiveis.length && visiveis.length < 4 && !Historia.jaOlhou(id)){
      c.appendChild(this.el(`<button class="escolha" onclick="Jogo.observarCena()">
        Parar e olhar mais um pouco antes de decidir.</button>`));
    }

    /* Quase todo mundo neste jogo é chamado pela função. Quando tem
       alguém assim falando na cena, dá pra desfazer isso. */
    if (visiveis.length && typeof Jogo !== 'undefined' && Jogo.anonimosDaCena){
      const anon = Jogo.anonimosDaCena();
      if (anon.length){
        const quem = anon[0];
        const ela = /^(a|as|uma)\s/i.test(quem);
        c.appendChild(this.el(`<button class="escolha discreta" onclick="Jogo.perguntarNome(${JSON.stringify(quem).replace(/"/g,'&quot;')})">
          Perguntar como ${ela ? 'ela' : 'ele'} se chama.</button>`));
      }
    }

    if (visiveis.length) c.appendChild(this.campoLivre());
  },

  /* O campo onde o jogador escreve o que faz */
  campoLivre(){
    const caixa = this.el(`<div class="acao-livre">
      <label for="acao-livre">Ou faça outra coisa — escreva:</label>
      <div class="linha-acao">
        <input id="acao-livre" type="text" maxlength="160" autocomplete="off"
               placeholder="ex.: chego devagar e estendo a mão · qual é o seu nome?">
        <button class="btn destaque" onclick="Jogo.acaoLivre()">Fazer</button>
      </div>

    </div>`);
    setTimeout(() => {
      const i = document.getElementById('acao-livre');
      if (i) i.addEventListener('keydown', ev => { if (ev.key === 'Enter') Jogo.acaoLivre(); });
    }, 0);
    return caixa;
  },

  /* ========================================================
     COMBATE
     ======================================================== */
  telaBatalha(introLinhas){
    this.modoBatalha = 'menu';
    this.limpar();
    this.add(this.topo());
    /* Tudo numa tela só: a introdução entra no topo do log (em vez de
       um painel a mais em cima da arena), e no computador o log e as
       ações ficam lado a lado, com a bandeja embaixo do log. */
    const intro = (introLinhas || []).map(t => `<div class="l intro">${this.esc(txt(t))}</div>`).join('');
    this.add(`<div class="painel painel-batalha">
      <div class="arena" id="arena"></div>
      <div class="combate-baixo">
        <div class="combate-registro">
          <div class="log-combate" id="log">${intro}</div>
          <div id="dados"></div>
        </div>
        <div class="acoes-combate" id="acoes"></div>
      </div>
    </div>`);
    this._arenaUltima = null;
    this.atualizarArena({entrando:true});
    this.escreverLog(Batalha.eventos);
    this.acoesCombate();
    this.rolarTopo();
    /* o outro lado aparece, depois a sua bola; o menu espera os dois */
    if (typeof Efeitos !== 'undefined') Efeitos.abertura();
  },

  /* Cor da moldura: tocar na bolinha mostra na hora; só fica com o
     Salvar. Fechar sem salvar volta pra cor que estava. */
  provarMoldura(id){
    this._molduraProva = id;
    aplicarMoldura(id);
    document.querySelectorAll('.ajuste-moldura .bolinha').forEach(b => {
      const s = b.dataset.cor === id; b.classList.toggle('sel', s); b.setAttribute('aria-checked', s);
    });
    const c = CORES_MOLDURA.find(x => x.id === id);
    const n = document.getElementById('moldura-nome'); if (n) n.textContent = c ? c.nome : '';
    const bt = document.getElementById('moldura-salvar'); if (bt){ bt.disabled = id === molduraSalva(); bt.textContent = 'Salvar'; }
  },
  salvarMoldura(){
    const id = this._molduraProva || molduraSalva();
    try { localStorage.setItem('jc-moldura', id); } catch (e) {}
    this._molduraProva = null;
    aplicarMoldura(id);
    const bt = document.getElementById('moldura-salvar'); if (bt){ bt.disabled = true; bt.textContent = 'Salvo'; }
  },

  /* Forfeit pede confirmação: é derrota, e custa */
  confirmarForfeit(){
    if (!Batalha.ativo || Batalha.tipo !== 'treinador') return;
    this.modal('Forfeit', `<p>Desistir desta luta? Conta como derrota.</p>
      <button class="escolha" onclick="UI.fecharModal(true);Jogo.acaoBatalha({tipo:'desistir'})">Desistir</button>
      <button class="escolha" onclick="UI.fecharModal(true)">Continuar lutando</button>`, true);
  },

  /* Som: quatro barras, o mudo e o tema da trilha */
  ajustesDeSom(){
    if (typeof Som === 'undefined') return '';
    const p = Som.pref();
    const barra = (k, nome) => `<label class="som-linha" for="som-${k}"><span>${nome}</span>
        <input type="range" id="som-${k}" min="0" max="100" step="5" value="${Math.round(p[k] * 100)}"
          oninput="Som.ajustar('${k}', this.value / 100);this.nextElementSibling.textContent=this.value+'%'">
        <span class="som-pct">${Math.round(p[k] * 100)}%</span></label>`;
    return `<div class="ajuste-som">
      <h3>Som</h3>
      <label class="som-mudo" for="som-mudo"><input type="checkbox" id="som-mudo" ${p.mudo ? 'checked' : ''}
        onchange="Som.ajustar('mudo', this.checked)"> Mudo</label>
      ${barra('geral', 'Geral')}${barra('efeitos', 'Efeitos')}${barra('gritos', 'Gritos')}${barra('musica', 'Música')}
      <label class="som-linha" for="som-tema"><span>Trilha</span>
        <select id="som-tema" onchange="Som.ajustar('tema', this.value)">
          ${TEMAS_DE_MUSICA.map(t => `<option value="${t.id}"${t.id === p.tema ? ' selected' : ''}>${this.esc(t.nome)}</option>`).join('')}
        </select></label>
      <p class="sussurro">Os temas de arquivo tocam o que estiver em sons/musica/&lt;tema&gt;/ (batalha, rota, cidade e caverna, .ogg, .mp3 ou .m4a). Sem o arquivo, toca a sintetizada.</p>
      <div class="som-testes">
        <button class="btn mini" onclick="Som.efeito('pokedex')">Testar efeito</button>
        <button class="btn mini" onclick="tocarGrito(25)">Testar grito</button>
      </div>
    </div>`;
  },

  alternarSom(bt){
    const liga = !somLigado();
    try { localStorage.setItem('jc-som', liga ? '1' : '0'); } catch (e) {}
    if (bt){ bt.textContent = liga ? 'Som' : 'Mudo'; bt.classList.toggle('mudo', !liga); bt.setAttribute('aria-pressed', liga ? 'false' : 'true'); }
  },

  /* rosto de quem fala, quando o jogo tem um (js/data/treinadores.js) */
  /* `rotulo` é o que a cena escreveu ("a atendente"); `quem` é o que o
     balão mostra, que vira o nome depois de perguntado. O rosto é o
     mesmo antes e depois: nome sorteado não tem rosto próprio, então o
     rótulo segura o retrato. */
  retratoFala(quem, rotulo){
    const r = (typeof retratoDe === 'function' ? (retratoDe(quem) || (rotulo && retratoDe(rotulo))) : null)
           || (typeof rostoGenerico === 'function' ? ((rotulo && rostoGenerico(rotulo)) || rostoGenerico(quem)) : null);
    return r ? `<img class="fala-retrato" src="${r}" alt="" onerror="this.remove()">` : '';
  },

  /* As Pokébolas do time, como nos jogos: cheia quem está de pé,
     apagada quem caiu. Do seu lado, o seu time; do outro, o time do
     treinador (selvagem não tem). */
  bolasDoLado(meu){
    let bolas = [];
    if (meu){
      bolas = (Estado.dados.time || []).map(x => estaVivo(x) ? 'vivo' : 'caido');
    } else {
      if (Batalha.tipo !== 'treinador') return '';
      const total = Batalha.totalInimigo || 1;
      const resta = (Batalha.timeInimigo ? Batalha.timeInimigo.length : 0) + (Batalha.inimigo && estaVivo(Batalha.inimigo) ? 1 : 0);
      for (let k = 0; k < total; k++) bolas.push(k < resta ? 'vivo' : 'caido');
    }
    if (!bolas.length) return '';
    const vivos = bolas.filter(b => b === 'vivo').length;
    return `<div class="bolas-time" role="img" aria-label="${vivos} de ${bolas.length} de pé">${
      bolas.map(b => `<i class="pb ${b}"></i>`).join('')}</div>`;
  },

  marcasHTML(lista){
    return (lista || []).map(m => `<span class="marca-luta ${this.esc(m.c)}">${this.esc(m.t)}</span>`).join('');
  },

  /* PAR, BRN, PSN… a etiqueta dos jogos, com a palavra no título */
  etiquetaStatus(st){
    const r = ROTULO_STATUS[st] || [String(st).slice(0, 3).toUpperCase(), st];
    return `<span class="status-tag st-${this.esc(st)}" data-st="${this.esc(st)}" title="${this.esc(r[1])}">${r[0]}</span>`;
  },

  /* A sua vida, quando não sobrou ninguém entre você e o selvagem */
  vidaJogadorHTML(){
    const hp = Math.max(0, Estado.j.hp), max = Estado.hpMaxJogador();
    const pct = Math.max(0, hp / max * 100);
    const cls = pct > 50 ? '' : (pct > 22 ? 'medio' : 'baixo');
    return `<div class="vida-jogador" role="group" aria-label="Sua vida">
      <div class="vj-nome"><span>${this.esc(Estado.j.nome || 'Você')}</span><span class="nv">treinador</span></div>
      <div class="barra ${cls}"><i style="width:${pct}%"></i></div>
      <div class="hp-num">${hp} / ${max} HP</div>
    </div>`;
  },
  pintarVidaJogador(hp, suave){
    const v = document.querySelector('#arena .vida-jogador');
    if (!v){ if (Batalha.fase === 'ameaca') this.atualizarArena(); return; }
    const max = Estado.hpMaxJogador(), pct = Math.max(0, hp / max * 100);
    const barra = v.querySelector('.barra'), i = barra.querySelector('i');
    if (!suave) i.style.transition = 'none';
    i.style.width = pct + '%';
    barra.classList.toggle('medio', pct <= 50 && pct > 22);
    barra.classList.toggle('baixo', pct <= 22);
    v.querySelector('.hp-num').textContent = `${Math.max(0, hp)} / ${max} HP`;
  },

  atualizarArena(op){
    const a = Batalha.aliado, i = Batalha.inimigo;
    op = op || {};
    /* Mesmo lutador de antes: a arte não entra de novo a cada turno.
       Só quem acabou de chegar ganha a animação de surgir. */
    const chave = p => p ? `${p.uid}:${p.dex}:${p.shiny ? 1 : 0}` : '';
    const ult = this._arenaUltima || {};
    const kA = chave(a), kI = chave(i);
    const trocouA = !!ult.A && ult.A !== kA, trocouI = !!ult.I && ult.I !== kI;
    const rosto = (Batalha.tipo === 'treinador' && typeof retratoDe === 'function') ? retratoDe(Batalha.treinador) : null;
    /* O fundo e as duas bases saem do lugar onde a briga acontece. */
    const cen = (typeof Arenas !== 'undefined') ? Arenas.atual() : null;
    const card = (p, cls, meu) => {
      /* A Pokédex abre a ficha inteira. Um bom Intelecto abre só o
         tipo: você já viu um parecido, não leu o registro dele. */
      const catalogado = meu || Estado.conheceu(p.dex);
      const leuTipo = catalogado || (!meu && !!Batalha.leituraIntelecto);
      const tipos = leuTipo
        ? p.tipos.map(t=>this.tipoTag(t)).join('')
        : '<span class="tipo-tag desconhecido">tipo ?</span>';
      const nat = p.naturezaVista
        ? `${this.esc(p.natureza)}${(NATUREZAS[p.natureza]||{}).agressiva?' · agressivo':''}`
        : 'natureza ?';
      const ficha = catalogado
        ? `<span class="mono">${this.linhaAtrib(p)}</span>`
        : (leuTipo ? '<span class="mono">tipo lido de olho · ficha não catalogada</span>'
                   : '<span class="mono">ficha não catalogada</span>');
      const seg = p.segurando ? `<div class="segurado-tag" title="${this.esc(fichaItem(p.segurando))}">segura ${this.esc(p.segurando)}</div>` : '';
      /* O seu aparece de costas, como em qualquer combate; o do outro
         lado, de frente. Espécie não catalogada sai em silhueta. */
      /* Transform: a arte vira a do outro enquanto durar a luta */
      const visto = p.transformadoEm ? Object.assign({}, p, {dex:p.transformadoEm}) : p;
      const arte = imgSprite(visto, meu ? 'costas' : 'frente', {oculto: !catalogado});
      /* A arte fica fora da ficha de propósito: é ela que deixa o
         cenário aparecer atrás do lutador, com a base sob os pés. */
      const fixo = (meu ? ult.A === kA : ult.I === kI) ? ' fixo' : '';
      const entrando = op.entrando && (meu || rosto) ? ' por-entrar' : '';
      /* quem te desafia fica atrás do próprio Pokémon a luta inteira */
      const fundo = (!meu && rosto) ? `<img class="treinador-fundo" src="${rosto}" alt="${this.esc(Batalha.treinador)}" onerror="this.remove()">` : '';
      const vida = (meu && Batalha.fase === 'ameaca') ? this.vidaJogadorHTML() : '';
      const caido = p.hp <= 0 ? ' caido' : '';
      /* o capturado está na bola: a ficha fica, o corpo não volta */
      const preso = (!meu && p.capturadoEm) ? ' capturado' : '';
      return `<div class="lutador ${cls}${fixo}${entrando}${caido}${preso}">
        <div class="arte">${fundo}${arte}${Batalha.clima ? `<div class="clima-camada clima-${Batalha.clima.tipo}" aria-hidden="true"></div>` : ''}</div>
        <div class="ficha">
          ${vida}
          <div class="nome"><span>${this.esc(nomeVisivel(p))}${this.shi(p)}</span><span class="nv">Nv ${p.nivel}</span></div>
          ${this.bolasDoLado(meu)}
          <div class="linha-tipos" style="margin-top:5px">${tipos}${p.status ? this.etiquetaStatus(p.status) : ''}</div>
          <div class="marcas-luta">${this.marcasHTML(Batalha.marcas ? Batalha.marcas(meu ? 'aliado' : 'inimigo') : [])}</div>
          ${this.barraHP(p, meu ? true : 'vaga')}
          ${(meu || Batalha.vontadeIA) ? this.linhaVontade(p) : ''}
          <div class="meta">${nat}</div>
          <div class="meta">${ficha}</div>
          ${seg}
        </div>
      </div>`;
    };
    const el = document.getElementById('arena');
    /* a tela já mudou (a luta acabou no meio da encenação): nada a pintar */
    if (!el) return null;
    el.innerHTML = card(a,'aliado',true) + card(i,'inimigo',false);
    this._arenaUltima = {A:kA, I:kI};
    /* arte nova: quem está de pé volta a respirar */
    if (typeof AnimadorSprite !== 'undefined') AnimadorSprite.montar();
    if (typeof Efeitos !== 'undefined'){
      const foto = p => p ? {uid:p.uid, hp:Math.max(0, p.hp), hpMax:p.hpMax, status:p.status || null} : null;
      Efeitos.foto = {A:foto(a), I:foto(i), J:Estado.j ? Estado.j.hp : undefined};
    }
    if (cen){
      el.className = 'arena arena-' + cen.arena;
      el.dataset.ambiente = cen.ambiente;
      el.title = `Arena: ${cen.nome}`;
      /* Com a imagem, o fundo é cenário; sem ela (pasta ausente), a
         arena fica no gradiente da paleta e nada quebra. */
      if (cen.fundo){
        el.style.setProperty('--ar-fundo', `url("${cen.fundo}")`);
        el.classList.add('com-cenario');
      } else {
        el.style.removeProperty('--ar-fundo');
      }
    }
    return {trocouA, trocouI};
  },

  /* ========================================================
     ARREMESSO — a bola faz o que o dado decidiu

     Máquina de estados (a mesma dos jogos de DS):

       1 ARCO      a bola girando numa parábola de Bézier, do
                   treinador até um ponto no alto, sobre a cabeça
       2 CAPTURA   abre lá em cima; um raio vermelho liga a bola ao
                   Pokémon, ele fica vermelho com uma linha de aura
                   em volta (o recolher do anime) e encolhe pra dentro
                   junto com o raio; a bola fecha e cai até a base
       3 CHACOALHO 15° pra esquerda, centro, 15° pra direita, centro;
                   0,5 s de pausa entre uma validação e a outra
       4 FINAL     captura: bola quieta no chão e brilho em cima
                   fuga: abre, feixe de luz, e o sprite de frente volta

     Lê Captura.ultimo: {bola, desfecho, sacudidas}. Nada é inventado
     aqui — duas chacoalhadas no dado são duas na tela. Os três
     desfechos que só lendário tem continuam: recusou (bate e cai
     aberta), quebrou (racha no ar), rompeu (sai antes de chacoalhar).

     Bola aberta e brilho não têm arquivo: os endereços de ball_open e
     de sparkle não existem na origem, e tilt_left/tilt_right são o
     mesmo byte a byte da bola fechada. Então a aberta é a fechada
     cortada ao meio, a inclinação é rotação e o brilho é desenhado.

     O sprite do alvo NUNCA recebe filter — o filter dele carrega a
     silhueta. A máscara é um clone à parte. A branca começa com
     brightness(0), e a vermelha é um filtro SVG que só lê o alfa da
     imagem (feFlood dentro de SourceAlpha): nas duas a cor morre
     antes, então nem espécie não catalogada vaza a cor por ela.
     ======================================================== */
  animarArremesso(anim){
    const arena = document.getElementById('arena');
    const alvo = arena && arena.querySelector('.lutador.inimigo .arte .sprite');
    if (!arena || !anim) return Promise.resolve();
    const src = spriteDaBola(anim.bola);
    const reduzido = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    const A = arena.getBoundingClientRect();
    const T = alvo ? alvo.getBoundingClientRect()
                   : {left:A.right-160, top:A.top+40, width:100, height:100, bottom:A.top+140};
    const artAli = arena.querySelector('.lutador.aliado .arte');
    const S = artAli ? artAli.getBoundingClientRect()
                     : {left:A.left+40, top:A.bottom-150, width:120, height:120};
    const TAM = 30;               // bola de 24 px a 1,25×: a escala da arena
    const GIRO = 720;             // volta inteira: pousa de pé
    const x0 = S.left - A.left + S.width * 0.62 - TAM/2;
    const y0 = S.top  - A.top  + S.height * 0.30 - TAM/2;
    const xt = T.left - A.left + T.width/2 - TAM/2;
    /* a arte ocupa ~23%..76% do quadro: a cabeça fica perto de 23% */
    const yAlto = T.top - A.top + T.height * 0.08 - TAM/2;   // sobre a cabeça
    const yPeito = T.top - A.top + T.height * 0.42 - TAM/2;  // onde a bola bate
    const yChao = T.top - A.top + T.height * 0.76 - TAM + 4; // pé do bicho

    const camada = document.createElement('div');
    camada.className = 'arremesso';
    camada.innerHTML =
      `<div class="bola-voo" style="width:${TAM}px;height:${TAM}px">
         <div class="gira">
           <img class="meia baixo" src="${src}" alt="">
           <span class="fenda"></span>
           <img class="meia cima"  src="${src}" alt="">
         </div>
       </div>
       <div class="feixe"></div>
       <div class="raio"></div>`;
    garantirFiltroVermelho();
    arena.appendChild(camada);
    const bola  = camada.querySelector('.bola-voo');
    const gira  = camada.querySelector('.gira');
    const cima  = camada.querySelector('.meia.cima');
    const baixo = camada.querySelector('.meia.baixo');
    const feixe = camada.querySelector('.feixe');
    const raio  = camada.querySelector('.raio');
    const acoes = document.getElementById('acoes');
    if (acoes){ acoes.setAttribute('aria-busy', 'true'); acoes.classList.add('esperando'); }

    /* a máscara branca: clone do sprite, sem classe de sprite */
    let mascara = null;
    if (alvo){
      mascara = document.createElement('img');
      mascara.className = 'mascara-branca';
      mascara.src = alvo.currentSrc || alvo.src;
      mascara.alt = '';
      Object.assign(mascara.style, {
        left:(T.left - A.left) + 'px', top:(T.top - A.top) + 'px',
        width:T.width + 'px', height:T.height + 'px',
        transformOrigin:`${xt + TAM/2 - (T.left - A.left)}px ${yAlto + TAM/2 - (T.top - A.top)}px`
      });
      camada.insertBefore(mascara, bola);
    }

    const pos = (x, y, g) => `translate(${x}px, ${y}px) rotate(${g || 0}deg)`;
    const tocar = (el, quadros, ms, extra) =>
      el.animate(quadros, Object.assign({duration:ms, fill:'forwards', easing:'ease-in-out'}, extra || {})).finished;
    const esperar = ms => new Promise(r => setTimeout(r, ms));
    /* Abre no meio, como nos jogos de DS: a metade de cima sobe e
       tomba pra trás, a de baixo desce um pouco, e a luz sai da fenda. */
    const fenda = camada.querySelector('.fenda');
    const abrir  = () => { if (typeof Som !== 'undefined') Som.efeito('abrir'); return abrirBola(cima, baixo, fenda, 160); };
    const fechar = () => fecharBola(cima, baixo, fenda, 130);
    const luz = (x, y) => {
      feixe.style.left = (x + TAM/2) + 'px'; feixe.style.top = (y + TAM/2) + 'px';
      return tocar(feixe, [{opacity:0, transform:'translate(-50%,-50%) scale(.2)'},
                           {opacity:1, transform:'translate(-50%,-50%) scale(1)', offset:.35},
                           {opacity:0, transform:'translate(-50%,-50%) scale(1.4)'}], 420);
    };
    /* visibility, e não opacity: o sprite entra com a animação
       surgeSprite (fill both), e animação CSS ganha de estilo inline —
       opacity 0 aqui era ignorado e o Pokémon ficava de pé ao lado da
       bola que devia estar com ele dentro. visibility ela não toca. */
    const lutAlvo = alvo && alvo.closest('.lutador');
    const esconderAlvo = () => { if (alvo) alvo.style.visibility = 'hidden'; if (lutAlvo) lutAlvo.classList.add('sem-sombra'); };

    /* 2 — o raio sai da bola aberta e pega o Pokémon pelo meio */
    const bx = xt + TAM/2, by = yAlto + TAM/2;
    const mx = T.left - A.left + T.width/2, my = T.top - A.top + T.height * 0.5;
    const ang = Math.atan2(my - by, mx - bx) * 180 / Math.PI;
    Object.assign(raio.style, {left:bx + 'px', top:(by - 3) + 'px',
                               width:Math.hypot(mx - bx, my - by) + 'px'});
    const esticar = (de, ate, ms) => tocar(raio,
      [{opacity:1, transform:`rotate(${ang}deg) scaleX(${de})`},
       {opacity:ate ? 1 : .6, transform:`rotate(${ang}deg) scaleX(${ate})`}], ms, {easing:'ease-out'});
    /* 2 — fica vermelho, com a linha de aura, e encolhe até a bola */
    const sugar = async () => {
      if (!mascara) return;
      mascara.classList.add('vermelha');
      await esticar(0, 1, 170);
      await tocar(mascara, [{opacity:0}, {opacity:1}], 240);
      esconderAlvo();
      await tocar(mascara, [{transform:'scale(1)'}, {transform:'scale(1.07)'}], 120);
      await Promise.all([
        tocar(mascara, [{transform:'scale(1.07)', opacity:1},
                        {transform:'scale(.05)', opacity:.15}], 400, {easing:'ease-in'}),
        esticar(1, 0, 400).then(() => tocar(raio, [{opacity:.6}, {opacity:0}], 60))
      ]);
    };
    /* 4 fuga — o inverso: sai branco da bola e revela o sprite de frente */
    const soltar = async () => {
      if (!mascara || !alvo) return;
      mascara.classList.remove('vermelha');
      await tocar(mascara, [{transform:'scale(.05)', opacity:0},
                            {transform:'scale(1)', opacity:1}], 320, {easing:'ease-out'});
      alvo.style.visibility = '';
      if (lutAlvo) lutAlvo.classList.remove('sem-sombra');
      await tocar(mascara, [{opacity:1}, {opacity:0}], 220);
    };
    /* 1 — parábola de Bézier quadrática, amostrada em quadros */
    const arco = (x1, y1, ate) => {
      const cx = (x0 + x1)/2, cy = Math.min(y0, y1) - 95;
      const N = 16, quadros = [];
      const corte = ate === 'meio' ? 0.55 : 1;
      for (let i = 0; i <= N; i++){
        const t = (i / N) * corte, u = 1 - t;
        const x = u*u*x0 + 2*u*t*cx + t*t*x1;
        const y = u*u*y0 + 2*u*t*cy + t*t*y1;
        quadros.push({transform: pos(x, y, GIRO * t), offset: i / N});
      }
      return tocar(bola, quadros, ate === 'meio' ? 360 : 620, {easing:'linear'})
        .then(() => quadros[quadros.length - 1]);
    };
    /* 3 — cai na vertical até a base, com um quique */
    const cair = (deY) => tocar(bola, [
      {transform: pos(xt, deY, GIRO)},
      {transform: pos(xt, yChao, GIRO), offset:.72},
      {transform: pos(xt, yChao - 9, GIRO), offset:.86},
      {transform: pos(xt, yChao, GIRO)}], 400, {easing:'ease-in'});
    /* 3 — esquerda, centro, direita, centro: pivô no pé da bola */
    const chacoalhar = () => tocar(gira, [
      {transform:'rotate(0deg)'},  {transform:'rotate(-15deg)', offset:.25},
      {transform:'rotate(0deg)', offset:.5}, {transform:'rotate(15deg)', offset:.75},
      {transform:'rotate(0deg)'}], 560);
    /* 4 captura — brilho: estrelinhas saindo em volta da bola */
    const brilhar = () => {
      const cx = xt + TAM/2, cy = yChao + TAM*0.3;
      /* duas levas de estrelas, como nos jogos: a primeira abre em
         leque por cima da bola, a segunda fecha o círculo por baixo.
         Com 10 px e uma leva só ninguém percebia que tinha brilho. */
      const leva = (giros, atraso) => giros.map((g, i) => {
        const e = document.createElement('span');
        e.className = 'brilho';
        e.style.left = cx + 'px'; e.style.top = cy + 'px';
        camada.appendChild(e);
        const r = g * Math.PI / 180, d = 34 + (i % 2) * 10;
        return tocar(e, [
          {transform:'translate(-50%,-50%) scale(.3) rotate(0deg)', opacity:0},
          {transform:`translate(calc(-50% + ${Math.cos(r)*d*.55}px), calc(-50% + ${Math.sin(r)*d*.55}px)) scale(1.25) rotate(45deg)`, opacity:1, offset:.35},
          {transform:`translate(calc(-50% + ${Math.cos(r)*d}px), calc(-50% + ${Math.sin(r)*d}px)) scale(.5) rotate(90deg)`, opacity:0}
        ], 820, {easing:'ease-out', delay:atraso + i * 45});
      });
      return Promise.all([
        ...leva([-90, -45, -135, -20, -160], 0),
        ...leva([0, 180, 30, 150, 90], 260)
      ]);
    };
    const fim = () => {
      if (acoes){ acoes.removeAttribute('aria-busy'); acoes.classList.remove('esperando'); }
      camada.remove();
    };

    /* Sem movimento: um quadro parado da bola, e segue. */
    if (reduzido){
      bola.style.transform = pos(xt, anim.desfecho === 'captura' ? yChao : yAlto, GIRO);
      return esperar(450).then(fim);
    }

    if (typeof Som !== 'undefined') Som.efeito('arremesso');
    const sequencia = async () => {
      /* quebrou — racha no alto do arco, antes de chegar */
      if (anim.desfecho === 'quebrou'){
        const q = await arco(xt, yAlto, 'meio');
        const [, mx, my] = q.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/) || [0, xt, yAlto];
        camada.classList.add('rachou');
        await Promise.all([
          luz(+mx, +my),
          tocar(cima,  [{transform:'translate(0,0) rotate(0)'},
                        {transform:'translate(-18px,40px) rotate(-120deg)', opacity:0}], 520),
          tocar(baixo, [{transform:'translate(0,0) rotate(0)'},
                        {transform:'translate(20px,60px) rotate(140deg)', opacity:0}], 520)
        ]);
        return;
      }

      /* recusou — bate no peito e cai aberta, sem sugar nada */
      if (anim.desfecho === 'recusou'){
        await arco(xt, yPeito);
        await tocar(bola, [{transform: pos(xt, yPeito, GIRO)},
                           {transform: pos(xt - 34, yPeito - 26, GIRO + 70), offset:.35},
                           {transform: pos(xt - 50, yChao, GIRO + 160)}], 480, {easing:'ease-in'});
        await abrir();
        await esperar(420);
        return;
      }

      /* 1 arco até o alto, sobre a cabeça */
      await arco(xt, yAlto);
      /* 2 abre lá em cima, suga, fecha, cai na vertical */
      await abrir();
      await Promise.all([luz(xt, yAlto), sugar()]);
      await fechar();
      await cair(yAlto);

      /* rompeu — o lendário sai antes da primeira chacoalhada */
      if (anim.desfecho === 'rompeu'){
        await esperar(160);
        await abrir();
        await Promise.all([luz(xt, yChao), soltar()]);
        return;
      }

      /* 3 as chacoalhadas que o dado deu, com 0,5 s entre cada uma */
      for (let i = 0; i < anim.sacudidas; i++){
        await esperar(500);
        await chacoalhar();
      }

      /* 4 */
      if (anim.desfecho === 'captura'){
        /* fica dentro: a ficha do lado de lá não volta a mostrar ele */
        if (lutAlvo) lutAlvo.classList.add('capturado');
        if (typeof Som !== 'undefined') Som.efeito('clique');
        await esperar(260);
        await brilhar();
        /* a bola pisca três vezes e some, como quem vai pro bolso */
        /* o degrau vai em cada quadro, nunca no tempo inteiro */
        const D = 'steps(1, end)';
        await tocar(bola, [{opacity:1, easing:D}, {opacity:.25, offset:.17, easing:D}, {opacity:1, offset:.33, easing:D},
                           {opacity:.25, offset:.5, easing:D}, {opacity:1, offset:.67, easing:D}, {opacity:.25, offset:.83, easing:D},
                           {opacity:1}], 720, {easing:'linear', fill:'none'});
        await tocar(bola, [{opacity:1, filter:'brightness(1)'}, {opacity:0, filter:'brightness(2.2)'}], 380, {easing:'ease-in'});
        return;
      }
      await esperar(300);
      await abrir();
      await Promise.all([luz(xt, yChao), soltar()]);
    };

    return sequencia().catch(() => {}).then(fim);
  },

  /* ========================================================
     GOLPE NOVO QUE NÃO COUBE — como nos jogos
     Mostra o golpe novo e os quatro que ele sabe; o jogador clica no
     que quer esquecer, ou desiste. Na batalha a pergunta ocupa o menu
     de combate (a luta espera); fora dela, abre um modal que não fecha
     sem resposta. Quem chama decide o que acontece depois.
     ======================================================== */
  /* A ficha do golpe no Pokérole, curta: poder e de onde sai a precisão */
  resumoGolpe(nome){
    const g = GOLPES[nome] || {}, pr = (typeof PR_GOLPE !== 'undefined' && PR_GOLPE[nome]) || {};
    const sig = k => k === 'soc' ? 'Social' : k === 'von' ? 'Vontade' : SIGLA_ATRIB[k];
    const partes = [];
    if (g.c !== 'status'){
      if (pr.fixo) partes.push(`dano fixo ${pr.fixo}`);
      else if (pr.ohko) partes.push('nocaute');
      else if (pr.posto) partes.push('dados pelo posto');
      else if (pr.metade) partes.push('metade do HP dele');
      else partes.push(`poder ${pr.p || Math.max(1, Math.round((g.p || 40) / 25))}`);
    }
    const aPrec = (pr.a || []).map(sig).join('/');
    if (pr.nunca || g.a >= 999) partes.push(g.c === 'status' && !pr.a ? 'em si' : 'não erra');
    else if (aPrec) partes.push(aPrec + (pr.h ? ' + ' + pr.h : ''));
    if (pr.r) partes.push(`−${pr.r}`);
    return partes.join(' · ');
  },

  cartaoGolpe(nome, pp){
    const g = GOLPES[nome] || {};
    const cat = {fis:'Físico', esp:'Especial', status:'Status'}[g.c] || '—';
    return `<span class="golpe-cartao">
      <span class="gc-topo"><span class="gc-nome">${this.esc(nome)}</span>${g.t ? this.tipoTag(g.t) : ''}</span>
      <span class="gc-num">${cat} · ${this.esc(this.resumoGolpe(nome))} · PP ${pp || g.pp || '—'}</span>
    </span>`;
  },

  perguntarGolpe(p, nome, onde, aoResponder){
    this._respostaGolpe = {aoResponder, onde};
    const quem = this.esc(nomeExib(p));
    const html = `<div class="aprender">
      <p class="aprender-pergunta"><b>${quem}</b> quer aprender <b>${this.esc(nome)}</b>.</p>
      <p class="sussurro">Mas ${quem} já sabe quatro golpes. Esquecer um pra aprender ${this.esc(nome)}?</p>
      <div class="aprender-novo"><span class="aprender-rot">novo</span>${this.cartaoGolpe(nome)}</div>
      <div class="aprender-lista">${p.golpes.map((g, i) =>
        `<button class="aprender-op" onclick="UI.responderGolpe(${i})">
           ${this.cartaoGolpe(g.nome, `${g.pp}/${g.ppMax}`)}
           <span class="aprender-acao">esquecer</span></button>`).join('')}</div>
      <button class="btn aprender-nao" onclick="UI.responderGolpe(-1)">Não aprender ${this.esc(nome)}</button>
    </div>`;
    if (onde === 'batalha'){
      const c = document.getElementById('acoes');
      if (c){ c.className = 'acoes-combate livre'; c.innerHTML = html; return; }
    }
    this.modal('Golpe novo', html, true, 'aprender-modal');
  },

  responderGolpe(i){
    const r = this._respostaGolpe;
    this._respostaGolpe = null;
    if (!r) return;
    if (r.onde !== 'batalha') this.fecharModal(true);
    r.aoResponder(i);
  },

  /* Fim de batalha: o menu vira um botão só. A tela não fecha sozinha. */
  mostrarContinuar(fn){
    this._aoContinuar = fn;
    const c = document.getElementById('acoes');
    if (!c) return fn();
    c.className = 'acoes-combate livre';
    c.innerHTML = `<button class="mb-btn continuar-batalha" onclick="UI.continuarBatalha()">
      <span class="rot">Continuar</span></button>`;
    setTimeout(() => { const b = c.querySelector('button'); if (b) b.focus(); }, 0);
  },
  continuarBatalha(){
    const fn = this._aoContinuar;
    this._aoContinuar = null;
    if (fn) fn();
  },

  /* Recado curto que some sozinho: o que aconteceu fora da batalha
     (golpe aprendido no treino, por exemplo). */
  avisar(linhas){
    let caixa = document.getElementById('recados');
    if (!caixa){
      caixa = this.el('<div id="recados" class="recados" aria-live="polite"></div>');
      document.body.appendChild(caixa);
    }
    (linhas || []).forEach(l => {
      const el = this.el(`<div class="recado ${this.esc(l.tipo || '')}">${this.esc(l.texto)}</div>`);
      caixa.appendChild(el);
      setTimeout(() => el.classList.add('saindo'), 3400);
      setTimeout(() => el.remove(), 3900);
    });
  },

  /* ========================================================
     EVOLUÇÃO — a tela pequena, com a aura azul do anime
     O Pokémon vira um vulto azul-claro, pisca entre a forma velha e
     a nova cada vez mais rápido, clarão, e a forma nova aparece. Dá
     pra parar no meio — como apertar B —, e aí ele tenta de novo no
     próximo nível. Os vultos são clones sem a classe .sprite: o
     filter deles é o do vulto, não o estado de silhueta da Pokédex.
     ======================================================== */
  telaEvolucao(p, destino, aoFim){
    const antigo = nomeExib(p);
    const novoNome = DEX[destino].nome;
    const srcVelho = caminhoSprite(p.dex, 'frente', p.shiny);
    const srcNovo  = caminhoSprite(destino, 'frente', p.shiny);
    const bolhas = Array.from({length:16}, (_, i) =>
      `<span class="evo-bolha" style="left:${(i*37)%100}%;animation-delay:${(i*0.23).toFixed(2)}s;animation-duration:${(2.2+(i%5)*0.35).toFixed(2)}s"></span>`).join('');
    this.modal('', `<div class="evo">
      <div class="evo-palco">
        <div class="evo-aura"></div>
        <div class="evo-bolhas">${bolhas}</div>
        <img class="evo-cor velho" src="${srcVelho}" alt="">
        <img class="evo-cor novo"  src="${srcNovo}"  alt="">
        <img class="evo-vulto velho" src="${srcVelho}" alt="">
        <img class="evo-vulto novo"  src="${srcNovo}"  alt="">
        <div class="evo-clarao"></div>
      </div>
      <p class="evo-texto">O quê? <b>${this.esc(antigo)}</b> está evoluindo!</p>
      <div class="evo-botoes">
        <button class="btn" id="evo-parar">Parar</button>
        <button class="btn destaque" id="evo-seguir" hidden>Continuar</button>
      </div>
    </div>`, true, 'evolucao');

    const M = document.querySelector('.modal.evolucao') || document;
    const $ = sel => M.querySelector(sel);
    const cV = $('.evo-cor.velho'), cN = $('.evo-cor.novo');
    const vV = $('.evo-vulto.velho'), vN = $('.evo-vulto.novo');
    const aura = $('.evo-aura'), clarao = $('.evo-clarao'), texto = $('.evo-texto');
    const parar = $('#evo-parar'), seguir = $('#evo-seguir');
    const reduzido = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let parou = false, evoluiu = false;
    parar.onclick = () => { parou = true; };
    /* A animação grava o quadro final no style e se desfaz. Com fill
       'forwards' ela ficava segurando a opacidade, e o mostrar() de
       depois não escondia mais nada: o vulto velho nunca saía da tela
       e terminava por cima da forma nova, que aparecia esbranquiçada. */
    const tocar = (el, q, ms, ex) => {
      const a = el.animate(q, Object.assign({duration:ms, fill:'forwards', easing:'ease-in-out'}, ex||{}));
      return a.finished.then(() => { try { a.commitStyles(); } catch(e){} a.cancel(); });
    };
    const esperar = ms => new Promise(r => setTimeout(r, ms));
    const mostrar = (el, on) => { el.style.opacity = on ? '1' : '0'; };

    const terminar = (ok) => {
      evoluiu = ok;
      parar.hidden = true;
      seguir.hidden = false;
      seguir.focus();
      seguir.onclick = () => { this.fecharModal(true); aoFim(evoluiu); };
    };
    const desistir = async () => {
      mostrar(vN, false);
      await tocar(vV, [{opacity:1}, {opacity:0}], 380);
      mostrar(cV, true);
      tocar(aura, [{opacity:getComputedStyle(aura).opacity}, {opacity:0}], 500);
      M.querySelector('.evo').classList.remove('evoluindo');
      texto.innerHTML = `Hm? <b>${this.esc(antigo)}</b> parou de evoluir.`;
      terminar(false);
    };

    if (reduzido){
      mostrar(cV, false); mostrar(cN, true);
      texto.innerHTML = `Parabéns! <b>${this.esc(antigo)}</b> evoluiu para <b>${this.esc(novoNome)}</b>!`;
      terminar(true);
      return;
    }

    (async () => {
      M.querySelector('.evo').classList.add('evoluindo');
      await tocar(aura, [{opacity:0, transform:'scale(.7)'}, {opacity:.75, transform:'scale(1)'}], 800);
      if (parou) return desistir();
      /* vira vulto azul */
      mostrar(vV, true);
      await tocar(vV, [{opacity:0}, {opacity:1}], 520);
      mostrar(cV, false);
      /* pisca entre a forma velha e a nova, cada vez mais rápido */
      let ms = 520, lado = false;
      while (ms > 55){
        if (parou) return desistir();
        lado = !lado;
        mostrar(vV, !lado); mostrar(vN, lado);
        await esperar(ms);
        ms = Math.round(ms * 0.84);
      }
      if (parou) return desistir();
      /* clarão, e a forma nova */
      parar.hidden = true;
      await tocar(clarao, [{opacity:0}, {opacity:1}], 260);
      mostrar(vV, false); mostrar(vN, false); mostrar(cN, true);
      tocar(aura, [{opacity:.75, transform:'scale(1)'}, {opacity:0, transform:'scale(1.35)'}], 900);
      await tocar(clarao, [{opacity:1}, {opacity:0}], 700);
      M.querySelector('.evo').classList.remove('evoluindo');
      M.querySelector('.evo').classList.add('pronto');
      texto.innerHTML = `Parabéns! <b>${this.esc(antigo)}</b> evoluiu para <b>${this.esc(novoNome)}</b>!`;
      terminar(true);
    })();
  },

  escreverLog(eventos){
    const log = document.getElementById('log');
    if (!log) return;
    (eventos||[]).forEach(e => log.appendChild(this.el(`<div class="l ${this.esc(e.tipo)}">${this.esc(e.texto)}</div>`)));
    log.scrollTop = log.scrollHeight;
    const dd = document.getElementById('dados');
    if (dd){ dd.innerHTML = this.htmlDados(); this.girarNovos(); }
  },

  /* O menu de combate tem dois andares: o principal (Lutar, Bag,
     Time, Fugir, com a Pokédex sozinha embaixo) e a lista de golpes,
     que só abre quando você escolhe Lutar. */
  modoBatalha: 'menu',

  acoesCombate(extra){
    const c = document.getElementById('acoes');
    if (!c) return;
    c.innerHTML = '';
    c.className = 'acoes-combate';
    if (extra){ c.classList.add('livre'); extra.forEach(h => c.appendChild(this.el(h))); return; }

    if (Batalha.fase === 'ameaca'){
      c.classList.add('livre');
      c.appendChild(this.el(`<button class="golpe-btn perigo" onclick="Jogo.acaoBatalha({tipo:'fugirAmeaca'})">
        <span>Correr</span><span class="pd">1d10 + Força ≥ 7</span></button>`));
      c.appendChild(this.el(`<button class="golpe-btn" onclick="Jogo.acaoBatalha({tipo:'encarar'})">
        <span>Encarar</span><span class="pd">1d10 + Carisma</span></button>`));
      c.appendChild(this.el(`<button class="golpe-btn" onclick="UI.menuItens()">
        <span>Usar item</span><span class="pd">Potion, Revive…</span></button>`));
      if (Batalha.tipo !== 'treinador')
        c.appendChild(this.el(`<button class="golpe-btn" onclick="UI.menuBolas()">
          <span>Jogar Pokébola</span><span class="pd">Capturar agora</span></button>`));
      return;
    }

    if (this.modoBatalha === 'golpes') this.painelGolpes(c);
    else this.painelPrincipal(c);
  },

  abrirGolpes(){ this.modoBatalha = 'golpes'; this.acoesCombate(); },
  voltarAoMenu(){ this.modoBatalha = 'menu'; this.acoesCombate(); },

  painelPrincipal(c){
    const d = Estado.dados;
    const a = Batalha.aliado;
    const vivos = d.time.filter(p => estaVivo(p) && p.uid !== a.uid).length;
    const contraTreinador = Batalha.tipo === 'treinador';
    const bolas = contraTreinador ? 0 : Object.keys(d.itens).filter(n => (ITENS_INFO[n]||{}).tipo === 'bola').length;
    /* O contador da Bag mostra o que serve aqui, não o que está na mochila. */
    const itens = Object.keys(d.itens).filter(n => usavelEmBatalha(n)).length + bolas;

    /* botão é o nome do que ele faz, sem legenda embaixo */
    const bt = (cls, rot, nota, acao, off) =>
      `<button class="mb-btn ${cls}" ${off ? 'disabled' : ''} ${off ? '' : 'onclick="' + acao + '"'}>
        <span class="rot">${rot}</span></button>`;

    const vontade = bt('vontade', 'Vontade', '', 'UI.menuVontade()', vontadeDe(a) <= 0);
    const dex = d.flags.tem_pokedex
      ? `<div class="mb-linha">${vontade}${bt('dex', 'Pokédex',
          '',
          "Jogo.acaoBatalha({tipo:'pokedex'})")}</div>`
      : `<div class="mb-linha centro">${vontade}</div>`;

    c.appendChild(this.el(`<div class="menu-batalha">
      <div class="mb-linha">
        ${bt('lutar', 'Lutar', `golpes de ${this.esc(nomeExib(a))}`, 'UI.abrirGolpes()')}
        ${bt('bag', 'Bag', itens ? `${bolas ? bolas + (bolas === 1 ? ' tipo de Pokébola · ' : ' tipos de Pokébola · ') : ''}${itens} ${itens === 1 ? 'item' : 'itens'}` : 'nada que sirva aqui', 'UI.menuBag()', !itens)}
      </div>
      <div class="mb-linha">
        ${bt('time', 'Time', vivos ? `${vivos} em pé no banco` : 'ninguém mais em pé', 'UI.menuTroca()', !vivos)}
        ${Batalha.tipo === 'treinador'
          ? bt('desistir', 'Forfeit', '', 'UI.confirmarForfeit()')
          : bt('fugir', 'Fugir', Batalha.fuga ? 'Destreza + Atletismo' : 'daqui não se foge',
             "Jogo.acaoBatalha({tipo:'fugir'})", !Batalha.fuga)}
      </div>
      ${dex}
    </div>`));
  },

  /* Os gastos de Vontade do livro. O nome é o botão; o que cada um faz
     está na folha de regras. */
  menuVontade(){
    const a = Batalha.aliado;
    if (!a) return;
    const op = uso => `<button class="escolha" ${Batalha.podeGastarVontade(uso) ? '' : 'disabled'}
      onclick="UI.gastarVontade('${uso}')">${this.esc(USOS_DE_VONTADE[uso])} <span class="pd">1 ponto</span></button>`;
    this.modal(`Vontade de ${nomeExib(a)}`, `${this.linhaVontade(a)}
      <div class="escolhas" style="margin-top:10px">${['destino', 'chances', 'esquiva', 'dor'].map(op).join('')}</div>`);
  },
  gastarVontade(uso){
    const txt = Batalha.gastarVontade(uso);
    this.fecharModal(true);
    if (!txt) return;
    const log = document.getElementById('log');
    if (log){ log.appendChild(this.el(`<div class="l status">${this.esc(txt)}</div>`)); log.scrollTop = log.scrollHeight; }
    /* a ficha mostra os pontos e o gasto armado */
    const v = document.querySelector('#arena .lutador.aliado .vontade-linha');
    if (v) v.outerHTML = this.linhaVontade(Batalha.aliado);
    this.acoesCombate();
    Estado.salvar('auto');
  },

  painelGolpes(c){
    const a = Batalha.aliado;
    const conhecido = Estado.conheceu(Batalha.inimigo.dex) || !!Batalha.leituraIntelecto;
    const grade = this.el('<div class="grade-golpes"></div>');
    /* Sem PP em nada, o que sobra é Forcejar — e ele tem que caber num botão,
       senão o jogador fica sem ação nenhuma numa luta de onde não se foge. */
    const semPP = a.golpes.every(g => g.pp <= 0);
    if (semPP){
      c.appendChild(this.el(`<div class="mb-linha centro">
        <button class="mb-btn lutar" onclick="UI.modoBatalha='menu';Jogo.acaoBatalha({tipo:'golpe',indice:0})">
          <span class="rot">Forcejar</span>
          <span class="nota">Força + 1 em d6 · ${this.esc(nomeExib(a))} perde 1 no contragolpe</span></button></div>`));
      c.appendChild(this.el(`<div class="mb-linha centro">
        <button class="mb-btn voltar" onclick="UI.voltarAoMenu()">
          <span class="rot">Voltar</span><span class="nota">sem gastar o turno</span></button></div>`));
      return;
    }
    a.golpes.forEach((g, i) => {
      const G = GOLPES[g.nome];
      // a dica de eficácia só existe se você souber contra o que está lutando
      const ef = conhecido ? eficacia(G.t, Batalha.inimigo.tipos) : 1;
      const marca = !conhecido ? '' : ef === 0 ? ' (imune)' : ef >= 2 ? ' ✦' : ef <= 0.5 ? ' ·' : '';
      const travado = Batalha.estAliado && Batalha.estAliado.desabilitado && Batalha.estAliado.desabilitado.nome === g.nome;
      grade.appendChild(this.el(`<button class="golpe-btn${travado ? ' travado' : ''}" ${g.pp<=0 || travado ?'disabled':''} title="${travado ? 'Desabilitado' : ''}" onclick="UI.modoBatalha='menu';Jogo.acaoBatalha({tipo:'golpe',indice:${i}})">
        <span>${this.esc(g.nome)}${marca}<br><span class="pd">${G.t} · ${G.c==='status'?'status · ':''}${this.esc(this.resumoGolpe(g.nome))}</span></span>
        <span class="pp">${g.pp}/${g.ppMax}</span></button>`));
    });
    c.appendChild(grade);
    c.appendChild(this.el(`<div class="mb-linha centro">
      <button class="mb-btn voltar" onclick="UI.voltarAoMenu()">
        <span class="rot">Voltar</span><span class="nota">sem gastar o turno</span></button></div>`));
  },

  /* Uma bolsa só: bolas em cima, o resto embaixo — como na mochila de verdade */
  menuBag(){
    const d = Estado.dados;
    const nomes = Object.keys(d.itens);
    if (!nomes.length) return this.modal('Mochila', '<p class="nada">Mochila vazia.</p>');
    /* Pokémon de treinador não se captura: a bola nem aparece na bolsa. */
    const contraTreinador = Batalha.ativo && Batalha.tipo === 'treinador';
    const bolas = contraTreinador ? [] : nomes.filter(n => (ITENS_INFO[n]||{}).tipo === 'bola');
    /* Prova de processo, crachá e caderno continuam na mochila — mas não se
       usa papel em cima de um Onix, e clicar neles custava o turno. */
    const resto = nomes.filter(n => usavelEmBatalha(n));
    const guardados = nomes.filter(n => !usavelEmBatalha(n) && (ITENS_INFO[n]||{}).tipo !== 'bola').length;
    const linhasBolas = bolas.map(n =>
      `<button class="escolha com-item" onclick="UI.fecharModal();UI.modoBatalha='menu';Jogo.acaoBatalha({tipo:'bola',nome:'${n}'})">
        ${imgItem(n)}${this.esc(n)} <span class="pd">×${Estado.contaItem(n)}</span></button>`).join('');
    const linhasItens = resto.map(n => {
      const info = ITENS_INFO[n] || {};
      if (info.tipo === 'curaJogador')
        return `<button class="escolha com-item" onclick="UI.fecharModal();UI.modoBatalha='menu';Jogo.acaoBatalha({tipo:'item',nome:'${n}'})">${imgItem(n)}${this.esc(n)} ×${Estado.contaItem(n)} — em você</button>`;
      return `<button class="escolha com-item" onclick="UI.bagEmQuem('${n.replace(/'/g, "\\'")}')">
          ${imgItem(n)}${this.esc(n)} <span class="pd">×${Estado.contaItem(n)}</span></button>`;
    }).join('');
    const corpo =
      (contraTreinador ? '<p class="sussurro" style="margin:0 0 10px">As Pokébolas ficam no fundo da mochila: não se joga Pokébola no Pokémon de outro treinador.</p>' : '') +
      (linhasBolas ? '<h3>Pokébolas</h3>' + linhasBolas : '') +
      (linhasItens ? '<h3>Itens</h3>' + linhasItens : '') +
      (guardados > 0 ? `<p class="sussurro" style="margin:10px 0 0">${guardados} ${guardados === 1 ? 'objeto fica guardado' : 'objetos ficam guardados'} — papel, crachá e afins não servem de nada aqui.</p>` : '');
    this.modal('Mochila', (linhasBolas || linhasItens) ? corpo
      : corpo + '<p class="nada">Nada que sirva agora.</p>');
  },

  /* Apelido: o campo vem vazio; deixar vazio é ficar com o nome da espécie. */
  modalApelido(p){
    this.modal('', `<div class="apelido">
        <div class="apelido-arte">${imgSprite(p, 'frente')}</div>
        <label for="campo-apelido">Quer dar um apelido a ${this.esc(p.nome)}?</label>
        <input id="campo-apelido" maxlength="12" autocomplete="off" placeholder="${this.esc(p.nome)}"
          onkeydown="if(event.key==='Enter')Jogo.darApelido('${p.uid}', this.value)">
        <div class="apelido-botoes">
          <button class="btn destaque" onclick="Jogo.darApelido('${p.uid}', document.getElementById('campo-apelido').value)">Dar o apelido</button>
          <button class="btn" onclick="Jogo.darApelido('${p.uid}', '')">Não</button>
        </div>
      </div>`, true);
    setTimeout(() => { const c = document.getElementById('campo-apelido'); if (c) c.focus(); }, 50);
  },

  /* Lista do time pra escolher quem recebe: ícone, nome e HP. */
  escolherDoTime(acao, filtro){
    const d = Estado.dados;
    const alvos = d.time.filter(p => !p.morto && (!filtro || filtro(p)));
    return alvos.map(p => {
      const pct = p.hpMax ? Math.max(0, Math.round(p.hp / p.hpMax * 100)) : 0;
      const faixa = pct > 50 ? '' : (pct > 22 ? 'medio' : 'baixo');
      return `<button class="time-linha${p.hp <= 0 ? ' caido' : ''}" onclick="${acao(p)}">
        <span class="time-icone">${imgSprite(p, 'icone')}</span>
        <span class="time-nome">${this.esc(nomeExib(p))}${this.shi(p)}${p.status ? ' ' + this.etiquetaStatus(p.status) : ''}</span>
        <span class="time-hp"><span class="barra ${faixa}"><i style="width:${pct}%"></i></span><span class="hp-num">${p.hp}/${p.hpMax}</span></span>
      </button>`;
    }).join('');
  },

  /* Bag na batalha: escolhe o item, depois quem recebe */
  bagEmQuem(n){
    const lista = this.escolherDoTime(p =>
      `UI.fecharModal();UI.modoBatalha='menu';Jogo.acaoBatalha({tipo:'item',nome:'${n.replace(/'/g, "\\'")}',alvoUid:'${p.uid}'})`);
    this.modal(n, `<div class="time-lista">${lista}</div>
      <div style="margin-top:12px"><button class="btn" onclick="UI.menuBag()">Voltar</button></div>`, true);
  },

  /* ========================================================
     ESCANEAMENTO — a Pokédex leva três segundos e apita
     ======================================================== */
  escaneamento(){
    const alvo = Batalha.inimigo;
    if (Jogo.encenando || Jogo.animandoBola) return;
    if (typeof Som !== 'undefined') Som.efeito('scan');
    const jaTinha = Estado.conheceu(alvo.dex);
    const r = Batalha.acao({tipo:'pokedex'});
    const erro = (r.eventos || []).find(e => e.tipo === 'erro');
    if (erro){ this.escreverLog(r.eventos); this.acoesCombate(); return; }

    const esp = DEX[alvo.dex];
    const num = String(alvo.dex).padStart(3, '0');
    /* Espécie já catalogada não se cadastra de novo — mas a Pokédex
       ainda é apontada e ainda lê: lente acesa, a arte já em cor, duas
       linhas e a ficha. Sem isso, contra treinador (onde quase tudo já
       foi visto) o botão parecia travado. */

    this.modal('', `<div class="pokedex-topo">
        <span class="pokedex-lente lendo"></span>
        <span class="pokedex-luzes lendo"><i></i><i></i><i></i></span>
      </div>
      <div class="dex-scan" id="dex-scan">
        <div class="alvo">
          <span class="${jaTinha ? 'conhecido' : 'silhueta'}${alvo.shiny ? ' brilho' : ''}">${imgSprite(alvo, 'frente', {oculto:!jaTinha, classe:'scan-arte'})}</span>
          <span class="varredura"></span>
        </div>
        <div class="linhas mono" id="dex-scan-linhas"></div>
        <div class="dex-barra lendo"><i id="dex-scan-barra" style="width:0%"></i></div>
      </div>`, true, 'pokedex');

    const passos = jaTinha ? [
      `registro #${num} encontrado`,
      'lendo este exemplar…'
    ] : [
      'travando alvo…',
      `silhueta #${num}`,
      'lendo estrutura de tipo…',
      'medindo atributos…',
      alvo.shiny ? 'ANOMALIA CROMÁTICA' : 'comparando com a base da espécie…'
    ];
    const cxLinhas = document.getElementById('dex-scan-linhas');
    const barra = document.getElementById('dex-scan-barra');
    let i = 0;
    this._scanTimer = setInterval(() => {
      if (!cxLinhas || !document.getElementById('dex-scan')) return clearInterval(this._scanTimer);
      if (i < passos.length){
        const l = this.el(`<div class="lin${alvo.shiny && i === passos.length-1 ? ' alerta' : ''}">${this.esc(passos[i])}</div>`);
        cxLinhas.appendChild(l);
        if (barra) barra.style.width = Math.round(((i+1)/passos.length)*100) + '%';
        i++;
      } else {
        clearInterval(this._scanTimer);
        this.fichaEscaneada(alvo, esp, r.eventos);
      }
    }, 290);
  },

  fichaEscaneada(p, esp, eventos){
    const num = String(p.dex).padStart(3, '0');
    const nat = NATUREZAS[p.natureza] || {};
    /* a barra é o atributo contra o teto da espécie (de 1 a 10 no livro) */
    const pr = PR_ESPECIE[p.dex] || [0,1,1,1,1,1,1,1,1,1,1];
    const par = (k, i) => `<div class="base-linha dupla">
      <span class="k">${NOME_ATRIB[k]}</span>
      <span class="barrinha"><i style="width:${Math.min(100, Math.round(p.stats[k] / 10 * 100))}%"></i></span>
      <span class="v mono">${p.stats[k]}</span>
      <span class="ind mono">máx ${pr[6 + i]}</span></div>`;

    this.modal('', `<div class="pokedex-topo">
        <span class="pokedex-lente"></span>
        <span class="pokedex-luzes"><i></i><i></i><i></i></span>
      </div>
      <div class="dex-ficha">
        <div class="cab"><span class="num">#${num}</span>
          <span class="nomeg">${this.esc(esp.nome)}${this.shi(p)}</span>
          <span style="margin-left:auto">${esp.tipos.map(t=>this.tipoTag(t)).join('')}</span></div>
        <div class="dex-arte">${imgSprite(p, 'frente')}</div>
        <div class="nota">Nível ${p.nivel} · ${{m:'macho', f:'fêmea'}[generoDe(p)] || 'sem sexo'}${p.naturezaVista ? ' · ' + this.esc(p.natureza) : ''}</div>
        ${p.shiny ? '<div class="nota brilho-v">✦ Anomalia cromática. A ficha é a mesma; a cor não.</div>' : ''}
        ${nat.agressiva && p.naturezaVista ? `<div class="nota alerta">Temperamento agressivo: se o seu time cair, ${pron(p).ele} não recua.</div>` : ''}

        <h3 class="cat-item">Atributos <span class="fraco">· este exemplar, posto ${nomePosto(p.nivel)}</span></h3>
        ${ATRIBUTOS.map(par).join('')}
        <div class="nota mono">HP ${p.hpMax} = base ${p.hpMax - p.stats.vit} + Vitalidade ${p.stats.vit}</div>

        <h3 class="cat-item">Contra o seu time</h3>
        <div class="linha"><span class="k">Fraco contra</span><span class="v">${this.esc(this.fraquezas(esp.tipos).join(', ') || '—')}</span></div>
        <div class="linha"><span class="k">Resiste a</span><span class="v">${this.esc(this.resistencias(esp.tipos).join(', ') || '—')}</span></div>
        <div class="linha"><span class="k">Taxa de captura</span><span class="v">${esp.captura} <span class="fraco">(quanto maior, mais fácil)</span></span></div>
      </div>
      <div style="margin-top:12px"><button class="btn destaque" onclick="UI.fecharEscaneamento()">Fechar a Pokédex</button></div>`,
      true, 'pokedex');
    this._eventosScan = eventos;
  },

  fecharEscaneamento(){
    this.fecharModal(true);
    if (this._eventosScan){ this.escreverLog(this._eventosScan); this._eventosScan = null; }
    this.atualizarArena();
    this.acoesCombate();
    Estado.salvar('auto');
  },

  /* ========================================================
     PC — o cinto cabe seis, o resto fica no sistema
     ======================================================== */
  /* ========================================================
     EVENTO DE CIDADE — uma situação acontecendo enquanto você passa
     ======================================================== */
  telaEvento(ev){
    this.limpar();
    this.add(this.topo());
    const opcoes = (ev.escolhas || []).map((o, i) => ({o, i}))
      .filter(({o}) => { try { return !o.cond || o.cond(Estado.dados); } catch(e){ return false; } });
    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">${this.esc((LOCAIS[Mundo.id()]||{}).nome || 'Kanto')}</div>
        <div class="tit">${this.esc(txt(ev.titulo))}</div>
        <div class="loc">acontecendo agora</div>
      </div>
      <div class="narrativa">${this.narrar(typeof Reencontros !== 'undefined' ? Reencontros.prefaciar(ev.texto, 'ev:' + ev.id) : ev.texto)}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas">
        ${opcoes.map(({o, i}) => `<button class="escolha" onclick="Jogo.resolverEvento('${ev.id}',${i})">
          ${this.esc(txt(o.texto))}</button>`).join('')}
      </div>
    </div>`);
    this.rolarTopo();
  },

  telaResultadoEvento(r){
    this.limpar();
    this.add(this.topo());
    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">${this.esc((LOCAIS[Mundo.id()]||{}).nome || 'Kanto')}</div>
        <div class="tit">${this.esc(txt(r.ev.titulo))}</div>
        <div class="loc">${this.esc(txt(r.esc.texto)).slice(0, 80)}</div>
      </div>
      ${r.rolagem ? `<div class="teste-linha">
        <span class="k">${this.esc(r.rolagem.nomeStatus || 'teste')}</span>
        <span class="v mono">1d10(${r.rolagem.dado}) + ${r.rolagem.bonus}${
          r.rolagem.temperamento ? (r.rolagem.temperamento > 0 ? ' + ' : ' − ') + Math.abs(r.rolagem.temperamento) : ''
        }${r.rolagem.gosto ? (r.rolagem.gosto > 0 ? ' + 1 (gosto)' : ' − 1 (desgosto)') : ''} = ${r.rolagem.total} · dif ${r.rolagem.dificuldade}</span>
        <span class="grau ${this.esc(r.rolagem.grau)}">${this.esc(r.rolagem.texto)}</span>
      </div>` : ''}
      <div class="narrativa">${this.narrar(r.resultado || r.esc.resultado || [])}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas" style="margin-top:16px">
        ${r.continua
          ? `<button class="escolha" onclick="UI.telaEvento(Eventos.porId('${r.ev.id}'))">Voltar à pergunta.</button>`
          : '<button class="escolha" onclick="Exploracao.tela()">Seguir.</button>'}
      </div>
    </div>`);
    if (r.avisos && r.avisos.length) this.avisos(r.avisos);
    this.rolarTopo();
  },

  /* Toda comunicação acontece dentro do PokéNav, por cima do que
     estava na tela: a tela de baixo não muda, e desligar devolve pra
     ela. `navTela` é a moldura: o aparelho aberto, a agenda do lado e
     a conversa no lugar da ficha. */
  navTela(contato, nome, papel, corpo, chamando, selo){
    this.modalNav(contato && Estado.temNumero(contato.id) ? contato.id : undefined);
    const m = document.getElementById('modal');
    const ficha = m && m.querySelector('#nav-ficha');
    if (!ficha) return null;
    if (chamando) m.querySelector('.modal').classList.add('chamando');
    ficha.innerHTML = `
      <div class="nav-ficha-cab">
        ${contato ? this.navRosto(contato, true) : `<span class="nav-inicial grande figura">${selo || '?'}</span>`}
        <span>
          <span class="nav-ficha-nome">${this.esc(nome)}</span>
          <span class="nav-ficha-papel">${this.esc(papel)}</span>
        </span>
      </div>${corpo}`;
    ficha.scrollTop = 0;
    return ficha;
  },

  /* O telefone tocando: você atende ou não, e não atender custa. */
  telaChamada(c){
    /* toca no meio da luta: espera ela acabar e toca depois */
    if (emLuta()){ Jogo.chamadaAdiada = c; return; }
    const contato = contatoPorId(c.de);
    const falas = (typeof c.falas === 'function' ? c.falas(Estado.dados) : c.falas) || [];
    const opcoes = (c.escolhas || []).map((o, i) => ({o, i}))
      .filter(({o}) => { try { return !o.cond || o.cond(Estado.dados); } catch(e){ return false; } });
    const nome = contato ? textoContato(contato,'nome') : 'Número desconhecido';
    this.navTela(contato, nome, 'chamada recebida', `
      <div class="nav-conversa narrativa">${this.narrar(falas, contato ? nome : null)}</div>
      <div id="avisos-nav" class="avisos"></div>
      <div class="nav-servicos nav-respostas">
        ${opcoes.map(({o, i}) => `<button class="btn" onclick="Jogo.responderChamada('${c.id}',${i})">${this.esc(txt(o.texto))}</button>`).join('')}
        <button class="btn recusar" onclick="Jogo.recusarChamada('${c.id}')">Não atender.</button>
      </div>`, true);
  },

  telaResultadoChamada(r){
    const contato = contatoPorId(r.chamada.de);
    const nome = contato ? textoContato(contato,'nome') : '';
    this.navTela(contato, nome, r.recusou ? 'não atendida' : 'em linha', `
      <div class="nav-conversa narrativa">${r.recusou
        ? this.narrar(['O aparelho toca oito vezes e para.',
            'Você olha o nome na tela o tempo inteiro e não atende, o que é diferente de não ouvir.',
            'Não vai ligar de novo hoje.'])
        : this.narrar(r.esc.resultado || [], contato ? nome : null)}</div>
      <div id="avisos-nav" class="avisos"></div>
      <div class="nav-servicos"><button class="btn" onclick="Jogo.voltarDaLigacao()">Guardar o aparelho</button></div>`);
    if (r.avisos && r.avisos.length) this.avisos(r.avisos, 'avisos-nav');
  },

  /* mensagens que chegam juntas (o aniversário): uma conversa só, no aparelho */
  navMensagens(titulo, falas, avisos){
    if (!Estado.temPokenav()) return;
    if (emLuta()) return;
    this.navTela(null, titulo, 'mensagens', `
      <div class="nav-conversa narrativa">${this.narrar(falas)}</div>
      <div id="avisos-nav" class="avisos"></div>
      <div class="nav-servicos"><button class="btn" onclick="Jogo.voltarDaLigacao()">Guardar o aparelho</button></div>`, true, '✉');
    if (avisos && avisos.length) this.avisos(avisos, 'avisos-nav');
  },

  /* só o alto da tela: dinheiro, HP e relógio depois de uma ligação */
  atualizarTopo(){
    const t = document.querySelector('.topo');
    if (!t) return;
    const novo = this.el(this.topo());
    if (novo) t.replaceWith(novo);
  },

  /* Ligação que você faz: a conversa acontece dentro do próprio PokéNav,
     por cima do que estava na tela, e desligar volta pra ficha do
     contato. Nada do texto que você estava lendo se perde. */
  telaLigacao(c, falas, avisos){
    if (!c) return;
    this.modalNav(c.id);
    const m = document.getElementById('modal');
    const ficha = m && m.querySelector('#nav-ficha');
    if (!ficha) return;
    ficha.innerHTML = `
      <div class="nav-ficha-cab">
        ${this.navRosto(c, true)}
        <span>
          <span class="nav-ficha-nome">${this.esc(textoContato(c,'nome'))}</span>
          <span class="nav-ficha-papel">em linha</span>
        </span>
      </div>
      <div class="nav-conversa narrativa">${this.narrarMonologo(falas || [], textoContato(c,'nome'))}</div>
      <div id="avisos-nav" class="avisos"></div>
      <div class="nav-servicos"><button class="btn" onclick="UI.modalNav('${c.id}')">Desligar</button></div>`;
    if (avisos && avisos.length) this.avisos(avisos, 'avisos-nav');
    ficha.scrollTop = 0;
  },

  /* ========================================================
     POKÉNAV — a agenda de quem te atende
     Aparelho azul de tampa, tela de cristal. Lista de contatos
     à esquerda, ficha de quem você selecionou à direita, e um
     botão por serviço: revanche, favor, missão, dar notícia.
     ======================================================== */
  navSel: null,

  modalNav(sel){
    const d = Estado.dados;
    if (!Estado.temPokenav()) return;
    if (sel !== undefined) this.navSel = sel;
    const agenda = Estado.contatosNaAgenda();
    const novos = Estado.numerosDisponiveis();
    if (this.navSel && !agenda.some(c=>c.id===this.navSel)) this.navSel = null;
    if (!this.navSel && agenda.length) this.navSel = agenda[0].id;

    const linha = c => {
      const reg = Estado.nav().contatos[c.id] || {};
      return `<button class="nav-contato${c.id===this.navSel?' sel':''}" onclick="UI.modalNav('${c.id}')">
        ${this.navRosto(c)}
        <span class="nav-linha-txt">
          <span class="nav-nome">${this.esc(textoContato(c,'nome'))}</span>
          <span class="nav-papel">${this.esc(textoContato(c,'papel'))}</span>
        </span>
        <span class="nav-cidade">${this.esc(textoContato(c,'cidade') || '')}</span>
      </button>`;
    };

    const pendentes = novos.length ? `
      <div class="nav-novos">
        <div class="nav-titulo">Números que te deram e você não gravou</div>
        ${novos.map(c => `<button class="nav-gravar" onclick="UI.navGravar('${c.id}')">
          <span>${this.esc(textoContato(c,'nome'))}</span>
          <span class="nav-papel">${this.esc(textoContato(c,'papel'))}</span>
          <b>gravar</b></button>`).join('')}
      </div>` : '';

    this.modal('', this.abasMochila('nav') + `
      <div class="nav-topo">
        <span class="nav-antena"></span>
        <span class="nav-marca">POKÉNAV</span>
        <span class="nav-sinal">${agenda.length} contato${agenda.length===1?'':'s'}</span>
      </div>
      ${pendentes}
      <div class="nav-colunas">
        <div class="nav-lista">
          <div class="nav-titulo">Agenda</div>
          ${agenda.length ? agenda.map(linha).join('') : '<div class="nav-vazio">Nenhum número ainda.</div>'}
        </div>
        <div class="nav-ficha" id="nav-ficha">${this.navFicha()}</div>
      </div>`, false, 'nav');
  },

  navFicha(){
    const c = this.navSel ? contatoPorId(this.navSel) : null;
    if (!c) return `<div class="nav-vazio">Selecione um contato.</div>`;
    const reg = Estado.nav().contatos[c.id] || {usos:{}};

    const ROTULO = {
      revanche:'Chamar para uma revanche',
      favor:(c.favor && c.favor.rotulo) || 'Pedir um favor',
      missao:(() => {
        const f = Estado.faseDaMissao(c.id);
        if (f === 'entregar') return (c.missao && c.missao.rotuloEntrega) || 'Ligar e dizer que está feito';
        if (f === 'fazendo')  return (c.missao && c.missao.rotulo) || 'Perguntar se precisa de alguma coisa';
        if (f === 'feita')    return 'Já resolvido';
        return (c.missao && c.missao.rotulo) || 'Perguntar se precisa de alguma coisa';
      })(),
      prova:(c.prova && c.prova.rotulo) || 'Dar notícia'
    };
    const botoes = (c.oferece||[]).map(serv => {
      const r = emLuta() ? {ok:false, motivo:'No meio da luta não dá pra ligar.'} : Estado.podeLigar(c.id, serv);
      return `<div class="nav-servico">
        <button class="btn" ${r.ok ? `onclick="UI.navLigar('${c.id}','${serv}')"` : 'disabled'}>${this.esc(ROTULO[serv]||serv)}</button>
        ${r.ok ? '' : `<span class="nav-nota">${this.esc(r.motivo)}</span>`}
      </div>`;
    }).join('');

    const hist = (Estado.nav().ligacoes||[]).filter(l => l.id === c.id).slice(-3).reverse();

    return `
      <div class="nav-ficha-cab">
        ${this.navRosto(c, true)}
        <span>
          <span class="nav-ficha-nome">${this.esc(textoContato(c,'nome'))}</span>
          <span class="nav-ficha-papel">${this.esc(textoContato(c,'papel'))}</span>
        </span>
      </div>
      <div class="nav-servicos">${botoes || '<span class="nav-nota">Nada a pedir agora.</span>'}</div>
      ${hist.length ? `<div class="nav-hist">${hist.map(l =>
        `<span>cap ${l.cap} · ${this.esc(l.servico)}</span>`).join('')}</div>` : ''}`;
  },

  /* o rosto de quem está na agenda, quando o jogo tem um; sem rosto,
     a inicial do nome na bolinha colorida */
  navRosto(c, grande){
    const nome = textoContato(c, 'nome');
    const r = (typeof retratoDe === 'function') ? (retratoDe(nome) || retratoDe(c.nome && typeof c.nome === 'string' ? c.nome : '')) : null;
    const cls = `nav-inicial${grande ? ' grande' : ''} ${c.tipo === 'treinador' ? 'treinador' : 'figura'}`;
    return r
      ? `<span class="${cls} com-rosto"><img src="${r}" alt="" onerror="this.parentNode.classList.remove('com-rosto');this.replaceWith(document.createTextNode('${this.esc(nome.slice(0,1))}'))"></span>`
      : `<span class="${cls}">${this.esc(nome.slice(0,1))}</span>`;
  },

  navGravar(id){
    Estado.registrarNumero(id);
    Estado.salvar('auto');
    this.modalNav(id);
  },
  navLigar(id, servico){
    this.fecharModal(true);
    Jogo.ligarPara(id, servico);
  },

  /* ========================================================
     PC — o terminal do Centro Pokémon
     Carcaça bege, tela verde de fósforo. Cinto de seis à
     esquerda, caixa à direita, ficha do selecionado embaixo.
     ======================================================== */
  pcSel: null,

  modalPC(sel){
    const d = Estado.dados;
    if (sel !== undefined) this.pcSel = sel;
    /* o selecionado pode ter mudado de lado ou saído do jogo */
    const existe = u => d.time.some(p=>p.uid===u) || d.pc.some(p=>p.uid===u);
    if (this.pcSel && !existe(this.pcSel)) this.pcSel = null;
    if (!this.pcSel) this.pcSel = (d.time[0] && d.time[0].uid) || (d.pc[0] && d.pc[0].uid) || null;

    const slot = (p, onde) => {
      if (!p) return `<div class="pc-slot vazio"><span class="pc-vazio">—</span></div>`;
      const selecionado = p.uid === this.pcSel ? ' sel' : '';
      const ruim = p.morto ? ' morto' : (p.hp <= 0 ? ' caido' : '');
      const pct = p.hpMax ? Math.max(0, Math.round(p.hp / p.hpMax * 100)) : 0;
      return `<button class="pc-slot${selecionado}${ruim}" onclick="UI.modalPC('${p.uid}')" title="${this.esc(nomeExib(p))}">
        <span class="pc-icone">${imgSprite(p, 'icone')}</span>
        <span class="pc-nome">${this.esc(nomeExib(p))}${this.shi(p)}</span>
        <span class="pc-nv">Nv ${p.nivel}</span>
        <span class="pc-barra"><i style="width:${pct}%"></i></span>
      </button>`;
    };

    const cinto = Array.from({length:6}, (_, i) => slot(d.time[i], 'time')).join('');
    const caixa = d.pc.length
      ? d.pc.map(p => slot(p, 'pc')).join('')
      : `<div class="pc-caixa-vazia">A caixa está vazia.<br><span>Tudo o que passar de seis aparece aqui.</span></div>`;

    this.modal('', `
      <div class="pc-topo">
        <span class="pc-led"></span>
        <span class="pc-marca">SISTEMA DE ARMAZENAMENTO</span>
        <span class="pc-versao">v3.1</span>
      </div>
      <div class="pc-colunas">
        <div class="pc-lado">
          <div class="pc-titulo">Cinto <span>${d.time.length}/6</span></div>
          <div class="pc-grade cinto">${cinto}</div>
        </div>
        <div class="pc-lado">
          <div class="pc-titulo">Caixa <span>${d.pc.length} guardado${d.pc.length===1?'':'s'}</span></div>
          <div class="pc-grade caixa">${caixa}</div>
        </div>
      </div>
      <div class="pc-ficha" id="pc-ficha">${this.pcFicha()}</div>
    `, false, 'pc');
  },

  pcFicha(){
    const d = Estado.dados;
    const p = d.time.find(x => x.uid === this.pcSel) || d.pc.find(x => x.uid === this.pcSel);
    if (!p) return `<div class="pc-nada">Nenhum Pokémon no sistema. Nem no cinto, nem na caixa.</div>`;
    const noTime = d.time.some(x => x.uid === p.uid);
    const esp = DEX[p.dex] || {};
    const pct = p.hpMax ? Math.max(0, Math.round(p.hp / p.hpMax * 100)) : 0;
    const moral = Math.max(0, Math.min(100, p.moral == null ? 50 : p.moral));

    /* o botão diz por que não dá, quando não dá */
    let acao, rotulo, trava = null;
    if (noTime){
      acao = `UI.pcGuardar('${p.uid}')`; rotulo = 'Guardar na caixa';
      if (!p.morto && d.time.filter(x=>!x.morto).length <= 1)
        trava = 'É o único que você tem em pé. Ninguém anda por Kanto de cinto vazio.';
    } else {
      acao = `UI.pcTirar('${p.uid}')`; rotulo = 'Levar no cinto';
      if (d.time.length >= 6) trava = 'O cinto já tem seis. Guarde um antes de tirar outro.';
    }

    const tipos = (esp.tipos||[]).map(t =>
      `<span class="tipo-tag" style="background:${COR_TIPO[t]||'#555'}">${this.esc(t)}</span>`).join('');

    return `
      <div class="pc-arte">${imgSprite(p, 'frente')}</div>
      <div class="pc-dados">
        <div class="pc-cab">
          <span class="pc-ficha-nome">${this.esc(nomeExib(p))}${this.shi(p)}</span>
          <span class="pc-ficha-nv">Nv ${p.nivel}</span>
          ${p.morto ? '<span class="pc-tag morto">morto</span>' :
            p.hp <= 0 ? '<span class="pc-tag caido">desmaiado</span>' : ''}
        </div>
        <div class="pc-tipos">${tipos}${p.naturezaVista ? `<span class="pc-nat">${this.esc(p.natureza)}</span>` : '<span class="pc-nat fraca">temperamento ainda não lido</span>'}</div>
        <div class="pc-medida"><span class="rot">HP</span>
          <span class="pc-barra grossa"><i style="width:${pct}%"></i></span>
          <span class="num mono">${p.hp}/${p.hpMax}</span></div>
        <div class="pc-medida"><span class="rot">Moral</span>
          <span class="pc-barra grossa moral"><i style="width:${moral}%"></i></span>
          <span class="num mono">${moral}</span></div>
        <div class="pc-golpes">${(p.golpes||[]).map(g =>
          `<span class="pc-golpe">${this.esc(g.nome)} <b>${g.pp}/${g.ppMax}</b></span>`).join('') || '<span class="pc-golpe">—</span>'}</div>
        ${(() => { const l = (typeof linhaDeAfinidade === 'function') ? linhaDeAfinidade(p) : null;
            return l ? `<div class="pc-afinidade">${this.esc(l)}</div>` : ''; })()}
        ${p.historia ? `<div class="pc-historia">${this.esc(p.historia)}</div>` : ''}
        <div class="pc-acao">
          <button class="btn" ${trava ? 'disabled' : `onclick="${acao}"`}>${rotulo}</button>
          ${trava ? `<span class="pc-trava">${this.esc(trava)}</span>` : ''}
        </div>
      </div>`;
  },

  pcGuardar(uid){
    const r = Estado.depositar(uid);
    if (!r.ok) return this.pcAviso(r.motivo);
    Estado.salvar('auto');
    this.modalPC(uid);
  },
  pcTirar(uid){
    const r = Estado.retirar(uid);
    if (!r.ok) return this.pcAviso(r.motivo);
    Estado.salvar('auto');
    this.modalPC(uid);
  },
  pcAviso(motivo){
    const f = document.getElementById('pc-ficha');
    if (!f) return;
    const velho = f.querySelector('.pc-erro');
    if (velho) velho.remove();
    f.appendChild(this.el(`<div class="pc-erro">${this.esc(motivo)}</div>`));
  },

  menuBolas(){
    if (Batalha.ativo && Batalha.tipo === 'treinador')
      return this.modal('Pokébolas', '<p class="nada">Não se joga Pokébola no Pokémon de outro treinador.</p>');
    const bolas = Object.keys(Estado.dados.itens).filter(n => (ITENS_INFO[n]||{}).tipo === 'bola');
    if (!bolas.length) return this.modal('Mochila', '<p class="nada">Você não tem nenhuma Pokébola.</p>');
    this.modal('Qual Pokébola?', bolas.map(n =>
      `<button class="escolha com-item" onclick="UI.fecharModal();Jogo.acaoBatalha({tipo:'bola',nome:'${n}'})">
        ${imgItem(n)}${this.esc(n)} <span class="pd">×${Estado.contaItem(n)}</span></button>`).join(''));
  },

  menuItens(){
    const itens = Object.keys(Estado.dados.itens).filter(n => usavelEmBatalha(n));
    if (!itens.length) return this.modal('Mochila', '<p class="nada">Mochila vazia.</p>');
    this.modal('Usar em quem?', itens.map(n => {
      const info = ITENS_INFO[n];
      if (info.tipo === 'curaJogador')
        return `<button class="escolha com-item" onclick="UI.fecharModal();Jogo.acaoBatalha({tipo:'item',nome:'${n}'})">${imgItem(n)}${this.esc(n)} ×${Estado.contaItem(n)} — em você</button>`;
      return Estado.dados.time.filter(p=>!p.morto).map(p =>
        `<button class="escolha com-item" onclick="UI.fecharModal();Jogo.acaoBatalha({tipo:'item',nome:'${n}',alvoUid:'${p.uid}'})">
          ${imgItem(n)}${this.esc(n)} ×${Estado.contaItem(n)} → ${this.esc(nomeExib(p))} (${p.hp}/${p.hpMax})</button>`).join('');
    }).join(''));
  },

  menuTroca(){
    const outros = Estado.dados.time.filter(p => estaVivo(p) && p.uid !== Batalha.aliado.uid);
    if (!outros.length) return this.modal('Trocar', '<p class="nada">Não tem mais ninguém em pé.</p>');
    this.modal('Trocar por quem?', outros.map(p =>
      `<button class="escolha" onclick="UI.fecharModal();Jogo.acaoBatalha({tipo:'trocar',uid:'${p.uid}'})">
        ${imgSprite(p, 'icone')}${this.esc(nomeExib(p))}${this.shi(p)} — Nv ${p.nivel} · ${p.hp}/${p.hpMax} HP</button>`).join(''));
  },

  trocaObrigatoria(uids){
    const ps = uids.map(u => Estado.dados.time.find(p => p.uid === u)).filter(Boolean);
    this.modal('Quem entra agora?', ps.map(p =>
      `<button class="escolha" onclick="UI.fecharModal();Jogo.acaoBatalha({tipo:'trocar',uid:'${p.uid}'})">
        ${imgSprite(p, 'icone')}${this.esc(nomeExib(p))}${this.shi(p)} — Nv ${p.nivel} · ${p.hp}/${p.hpMax} HP</button>`).join(''), true);
  },

  /* ========================================================
     FIM DE CAPÍTULO — distribuição de pontos
     ======================================================== */
  telaFimCapitulo(avisosMundo){
    this.limpar();
    this.add(this.topo());
    const cap = Historia.capAtual;
    const j = Estado.j;
    const nomes = {forca:'Força',percepcao:'Percepção',intelecto:'Intelecto',carisma:'Carisma',sorte:'Sorte',resistencia:'Resistência'};
    const desc = {
      forca:'Golpes manuais, carregar, resistir, fugir de ataques.',
      percepcao:'Emboscadas, esconderijos, pistas, intenções.',
      intelecto:'Tática, rotas, mensagens, identificar tipos.',
      carisma:'Conversa, negociação, liderança, persuasão.',
      sorte:'Encontros, itens, eventos aleatórios, fugas.',
      resistencia:'HP máximo (+2 por ponto), veneno, intimidação.'
    };
    const linhas = Object.keys(nomes).map(k => {
      const v = j.status[k];
      const pontos = Array.from({length:10}, (_,i) => `<i class="${i < v ? 'on':''}"></i>`).join('');
      return `<div class="status-linha">
        <span class="nome">${nomes[k]}</span>
        <span class="status-pontos">${pontos}</span>
        <span class="mono" style="width:30px;text-align:right">${v}</span>
        <button class="btn mini" id="up-${k}" onclick="Jogo.gastarPonto('${k}')">+1</button>
      </div><div class="sussurro" style="margin:-4px 0 8px 122px">${desc[k]}</div>`;
    }).join('');

    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">Encerramento</div>
        <div class="tit">${this.esc(cap.titulo)}</div>
        <div class="loc">${this.esc(txt(cap.cenas[Estado.dados.cena].resumo) || '')}</div>
      </div>
      <div id="avisos" class="avisos"></div>
      <h3>Pontos de progressão</h3>
      <p class="sussurro">Você tem <b id="pts">${j.pontos}</b> <span id="pts-p">${j.pontos === 1 ? 'ponto' : 'pontos'}</span>. Máximo de +1 por status neste capítulo.</p>
      <div id="status-lista">${linhas}</div>
      <div style="margin-top:22px">
        <button class="btn destaque" id="btn-seguir" onclick="Jogo.voltarAoMundo()">Voltar para a estrada</button>
      </div>
    </div>`);
    if (avisosMundo && avisosMundo.length) this.avisos(avisosMundo.map(t => ({tipo:'mundo', texto:t})));
    this.atualizarPontos();
    this.rolarTopo();
  },

  atualizarPontos(){
    const j = Estado.j;
    const p = document.getElementById('pts');
    if (p) p.textContent = j.pontos;
    const pp = document.getElementById('pts-p');
    if (pp) pp.textContent = j.pontos === 1 ? 'ponto' : 'pontos';
    Object.keys(j.status).forEach(k => {
      const b = document.getElementById('up-'+k);
      if (b) b.disabled = j.pontos <= 0 || j.status[k] >= 10 || (Jogo.subidosNoCap||[]).includes(k);
    });
  },

  /* ========================================================
     VIAGEM — a estrada entre um capítulo e o outro
     ======================================================== */
  telaViagem(deId, paraId, dias, aoChegar, rota){
    this.limpar();
    this.add(this.topo());
    const de = LOCAIS[deId] || {nome:'onde você estava'};
    const para = LOCAIS[paraId] || {nome:'o próximo lugar'};
    const d = Estado.dados;

    const trechos = [
      'A estrada é estrada: pedra solta, mato dos dois lados, e horas em que não acontece absolutamente nada.',
      'Você anda atrás de uma família com carrinho por meio dia e depois eles param pra almoçar e você segue sozinh{o|a}.',
      'Chove numa parte do caminho e não chove na outra, e dá pra ver a linha exata onde uma coisa vira a outra.',
      'Um caminhão de carga te dá carona por doze quilômetros e o motorista não fala nada a viagem inteira, e é confortável.',
      'Você dorme uma noite fora, num acostamento com outras quatro pessoas que também estão indo pra algum lugar.',
      'Tem um trecho em que a estrada acompanha o rio e você anda mais devagar de propósito.',
      'Você erra uma bifurcação e perde três horas, e a parte pior é que dá pra ver a estrada certa do outro lado do valo.',
      'Um grupo de treinadores acampa na curva e te chama pra comer. Você come. Ninguém pergunta o seu nome e isso é uma gentileza.'
    ];
    const cansaço = [
      'Chega com o pé doendo de um jeito específico que você vai passar a conhecer bem.',
      'Chega com poeira até dentro da mochila.',
      'Chega com fome e com aquela irritação de quem andou demais.',
      'Chega inteiro, o que é mais do que muita gente consegue.'
    ];

    const linhas = [];
    linhas.push(`De ${de.nome} até ${para.nome} são ${dias === 1 ? 'um dia' : dias + ' dias'} de caminho.`);
    /* o trajeto de verdade, nomeado: você não é teleportado */
    if (rota && rota.length > 2)
      linhas.push('Você passa por ' + rota.slice(1, -1).map(x => (LOCAIS[x]||{}).nome || x).join(', ') + '.');
    const usados = new Set();
    for (let i = 0; i < Math.min(dias, 3); i++){
      let t = Dados.escolher(trechos), guarda = 0;
      while (usados.has(t) && guarda++ < 10) t = Dados.escolher(trechos);
      usados.add(t); linhas.push(t);
    }
    if (d.time.length) linhas.push(
      `${nomeExib(d.time[0])} anda do seu lado o tempo todo e em nenhum momento pergunta se falta muito.`);
    linhas.push(Dados.escolher(cansaço));

    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">A estrada</div>
        <div class="tit">${this.esc(de.nome)} → ${this.esc(para.nome)}</div>
        <div class="loc">${dias === 1 ? 'um dia' : dias + ' dias'} de caminho</div>
      </div>
      <div class="narrativa">${this.narrar(linhas)}</div>
      <div id="escolhas" class="escolhas" style="margin-top:18px">
        <button class="escolha" onclick="${aoChegar}">Chegar.</button>
      </div>
    </div>`);
    this.rolarTopo();
  },

  /* ========================================================
     GINÁSIOS
     ======================================================== */
  telaResultadoGinasio(g, venceu, avisos){
    this.limpar();
    this.add(this.topo());
    let falas = (venceu ? g.vitoria : g.derrota)(Estado.dados).filter(Boolean);
    /* a primeira fala já saiu no log da batalha, como frase de derrota */
    if (Jogo.citacaoMostrada){ falas = falas.slice(1); Jogo.citacaoMostrada = false; }
    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">Ginásio de ${this.esc(g.cidade)}</div>
        <div class="tit">${venceu ? this.esc(g.insignia) : 'Derrota'}</div>
        <div class="loc">Líder ${this.esc(g.lider)} · tipo ${this.esc(g.tipo)}</div>
      </div>
      <div class="narrativa">${this.narrarMonologo(falas, g.lider)}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas" style="margin-top:20px">
        ${!venceu ? `<button class="escolha" onclick="Jogo.hubCentro()">Curar o time e tentar de novo</button>` : ''}
        <button class="escolha" onclick="Jogo.voltarDosGinasios()">Continuar a jornada</button>
      </div>
    </div>`);
    if (avisos && avisos.length) this.avisos(avisos);
    this.rolarTopo();
  },

  /* ========================================================
     O RIVAL
     ======================================================== */
  telaRival(){
    const enc = Jogo.encontroRival || {tipo:'teo'};
    if (enc.tipo === 'extra') return this.telaRivalExtra(enc.id);

    this.limpar();
    this.add(this.topo());
    const r = rival();
    const arco = arcoRival();
    const A = ARCOS_RIVAL[arco];
    const time = timeRival();
    const cor = {parceiro:'var(--bom)', rival:'var(--destaque)', ressentido:'var(--ruim)',
                 perseguidor:'var(--perigo)', quebrado:'var(--texto-fraco)'}[arco];

    this.add(`<div class="painel">
      <div class="cap-cabecalho" style="border-left-color:${cor}">
        <div class="num">Na estrada</div>
        <div class="tit">${this.esc(r.nome)}</div>
        <div class="loc" style="color:${cor}">${this.esc(A.nome)} — ${this.esc(A.resumo)}</div>
      </div>
      <div class="narrativa">${this.narrarMonologo(falaRival(), r.nome)}</div>
      <div class="linha" style="margin-top:14px"><span class="k">Placar entre vocês</span>
        <span class="v">você ${r.derrotas} × ${r.vitorias} ele</span></div>
      <div class="linha"><span class="k">Time dele agora</span>
        <span class="v">${this.esc(time.map(p=>p.nome+' Nv'+p.nivel).join(', '))}</span></div>
      <div id="escolhas" class="escolhas" style="margin-top:20px">
        <button class="escolha" onclick="Jogo.lutarRival()">Lutar.</button>
        <button class="escolha" onclick="Jogo.evitarRival()">Passar por ele sem parar.</button>
        <button class="escolha" onclick="Jogo.hubCentro()">Curar o time antes.</button>
      </div>
    </div>`);
    this.rolarTopo();
  },

  /* Os rivais que você conquistou pelo caminho */
  telaRivalExtra(id){
    this.limpar();
    this.add(this.topo());
    const R = defRival(id);
    const reg = registroRival(id) || {vitorias:0, derrotas:0, encontros:0};
    const time = timeRivalExtra(R);
    const cor = R.cor || 'var(--destaque)';

    this.add(`<div class="painel">
      <div class="cap-cabecalho" style="border-left-color:${cor}">
        <div class="num">Na estrada</div>
        <div class="tit">${this.esc(R.nome)}</div>
        <div class="loc" style="color:${cor}">${this.esc(R.desde)} — ${this.esc(R.origem)}</div>
      </div>
      <div class="narrativa">${this.narrarMonologo(falaRivalExtra(R), R.nome)}</div>
      <div class="linha" style="margin-top:14px"><span class="k">Placar entre vocês</span>
        <span class="v">você ${reg.derrotas} × ${reg.vitorias} ${R.nome === 'Nolan' ? 'ele' : 'ele'}</span></div>
      <div class="linha"><span class="k">Time dele agora</span>
        <span class="v">${this.esc(time.map(p=>p.nome+' Nv'+p.nivel).join(', '))}</span></div>
      <div id="escolhas" class="escolhas" style="margin-top:20px">
        <button class="escolha" onclick="Jogo.lutarRival()">Lutar.</button>
        <button class="escolha" onclick="Jogo.evitarRival()">Passar por ele sem parar.</button>
        <button class="escolha" onclick="Jogo.hubCentro()">Curar o time antes.</button>
      </div>
    </div>`);
    this.rolarTopo();
  },

  telaResultadoRival(venceu, avisos, idExtra, falasProntas){
    this.limpar();
    this.add(this.topo());
    const extra = idExtra ? defRival(idExtra) : null;
    const reg = extra ? (registroRival(idExtra) || {vitorias:0, derrotas:0}) : rival();
    const nome = extra ? extra.nome : rival().nome;
    /* quem chama calcula as falas antes do placar mudar */
    const falas = falasProntas || (extra
      ? (venceu ? falaVitoriaRivalExtra(extra) : falaDerrotaRivalExtra(extra))
      : (venceu ? falaVitoriaRival() : falaDerrotaRival()));
    this.add(`<div class="painel">
      <div class="cap-cabecalho"${extra ? ` style="border-left-color:${extra.cor || 'var(--destaque)'}"` : ''}>
        <div class="num">${venceu ? 'Você venceu' : 'Ele venceu'}</div>
        <div class="tit">${this.esc(nome)}</div>
        <div class="loc">Placar: você ${reg.derrotas} × ${reg.vitorias} ele</div>
      </div>
      <div class="narrativa">${this.narrarMonologo(falas, nome)}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas" style="margin-top:20px">
        <button class="escolha" onclick="Jogo.seguirDepoisDoRival()">Seguir viagem.</button>
      </div>
    </div>`);
    if (avisos && avisos.length) this.avisos(avisos);
    this.rolarTopo();
  },

  /* ========================================================
     LIGA — Elite 4, Campeão e Torneio
     ======================================================== */
  telaLiga(){
    this.limpar();
    this.add(this.topo());
    const d = Estado.dados;
    const e4 = statusElite4(), tor = statusTorneio();
    /* Quem são os quatro é coisa que você descobre chegando lá, ou
       ouvindo da Conselheira no capítulo 21. Com o cinto vazio, o
       Planalto Indigo é só um nome e quatro portas. */
    const nInsig = d.insignias.filter(i => i !== 'Título de Campeão').length;
    const sabeQuemSao = !!d.flags.sabe_da_elite || nInsig >= 8 || !!d.flags.campeao_de_kanto;

    const membros = sabeQuemSao
      ? ELITE4.map(m => {
          const substituto = m.titular && m.titular !== m.nome;
          return `<div class="linha"><span class="k">${m.ordem}. ${this.esc(m.nome)}
            <span class="fraco">· ${this.esc(m.tipo)}${substituto ? ' · na cadeira de ' + this.esc(m.titular) : ''}</span></span>
           <span class="v">Nv ${m.nivelBase}–${m.nivelBase + m.especies.length + 1}</span></div>`;
        }).join('')
      : ELITE4.map(m => `<div class="linha"><span class="k">${m.ordem}. <span class="fraco">${this.esc(m.titular)}</span></span>
           <span class="v fraco">—</span></div>`).join('') +
        `<p class="sussurro" style="margin:8px 0 0">Os quatro nomes estão nas portas desde sempre. Quem senta atrás de cada uma hoje é outra conversa, e não é conversa que se tenha daqui.</p>`;

    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">Planalto Indigo</div>
        <div class="tit">Liga Pokémon</div>
        <div class="loc">${d.insignias.filter(i=>i!=='Título de Campeão').length} de 8 insígnias${d.flags.campeao_de_kanto ? ' · Campeão de Kanto' : ''}</div>
      </div>

      <div class="grade">
        <div class="carta ginasio">
          <div class="t"><span>Elite 4</span><span class="fraco">${e4.estado==='concluido'?'✓':''}</span></div>
          <div class="fraco" style="margin-bottom:8px">Quatro salas seguidas, sem Centro Pokémon entre elas. O que estiver na sua mochila é tudo o que você tem.</div>
          ${membros}
          <div class="linha"><span class="k">Campeão</span><span class="v">${d.flags.campeao_de_kanto ? 'você' : 'cadeira vaga há 2 anos'}</span></div>
          <div class="rodape">
            <span class="fraco">${this.esc(e4.texto)}</span>
            ${e4.estado==='disponivel' ? `<button class="btn destaque mini" onclick="Jogo.iniciarElite4()">Entrar na ala</button>` : ''}
          </div>
        </div>

        <div class="carta ginasio">
          <div class="t"><span>Torneio Aberto</span><span class="fraco">${d.torneiosVencidos ? d.torneiosVencidos+'× campeão' : ''}</span></div>
          <div class="fraco" style="margin-bottom:8px">Chaveamento de oito, três rodadas, o ano inteiro. Qualquer um entra — e os adversários saem da sua própria história.</div>
          <div class="linha"><span class="k">Quartas</span><span class="v">${PREMIO_TORNEIO[0].dinheiro.toLocaleString('pt-BR')} ₽</span></div>
          <div class="linha"><span class="k">Semifinal</span><span class="v">${PREMIO_TORNEIO[1].dinheiro.toLocaleString('pt-BR')} ₽</span></div>
          <div class="linha"><span class="k">Final</span><span class="v">${PREMIO_TORNEIO[2].dinheiro.toLocaleString('pt-BR')} ₽</span></div>
          <div class="linha"><span class="k">Nível dos adversários</span><span class="v">~${nivelDoJogador()}</span></div>
          <div class="rodape">
            <span class="fraco">${this.esc(tor.texto)}</span>
            ${tor.estado==='disponivel' ? `<button class="btn destaque mini" onclick="Jogo.iniciarTorneio()">Inscrever-se</button>` : ''}
          </div>
        </div>
        ${d.flags.campeao_de_kanto ? (() => {
          const co = statusConferencia();
          return `<div class="carta ginasio">
          <div class="t"><span>Conferência do Planalto Indigo</span><span class="fraco">${d.conferenciasVencidas ? this.esc(d.conferenciasVencidas + '× {campeão|campeã}') : ''}</span></div>
          <div class="fraco" style="margin-bottom:8px">Três rodadas, times inteiros, e ninguém do outro lado com menos estrada que você.</div>
          <div class="linha"><span class="k">Quartas</span><span class="v">${PREMIO_CONFERENCIA[0].dinheiro.toLocaleString('pt-BR')} ₽</span></div>
          <div class="linha"><span class="k">Semifinal</span><span class="v">${PREMIO_CONFERENCIA[1].dinheiro.toLocaleString('pt-BR')} ₽</span></div>
          <div class="linha"><span class="k">Final</span><span class="v">${PREMIO_CONFERENCIA[2].dinheiro.toLocaleString('pt-BR')} ₽</span></div>
          <div class="rodape">
            <span class="fraco">${this.esc(co.texto)}</span>
            ${co.estado==='disponivel' ? `<button class="btn destaque mini" onclick="Conferencia.iniciar()">Inscrever-se</button>` : ''}
          </div>
        </div>`; })() : ''}
      </div>

      <div style="margin-top:20px">
        <button class="btn" onclick="Jogo.voltarDosGinasios()">Voltar</button>
        <button class="btn" onclick="Jogo.hubCentro()">Curar o time</button>
      </div>
    </div>`);
    this.rolarTopo();
  },

  telaTorneio(){
    this.limpar();
    this.add(this.topo());
    const t = Jogo.torneioAtual;
    if (!t) return this.telaLiga();
    const chave = t.adversarios.map((a,i) => {
      const est = i < t.rodada ? '✓ vencido' : (i === t.rodada ? 'agora' : 'aguardando');
      const cor = i < t.rodada ? 'var(--bom)' : (i === t.rodada ? 'var(--destaque)' : 'var(--texto-fraco)');
      return `<div class="linha"><span class="k">${PREMIO_TORNEIO[i].rodada} · ${this.esc(a.nome)}
        <span class="fraco">${a.time.map(p=>p.nome+' Nv'+p.nivel).join(', ')}</span></span>
        <span class="v" style="color:${cor}">${est}</span></div>`;
    }).join('');

    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">Torneio Aberto</div>
        <div class="tit">${this.esc(PREMIO_TORNEIO[t.rodada].rodada)}</div>
        <div class="loc">Arena do Planalto Indigo</div>
      </div>
      ${chave}
      <div id="escolhas" class="escolhas" style="margin-top:20px">
        <button class="escolha" onclick="Jogo.lutarRodadaTorneio()">Entrar na arena — ${this.esc(t.adversarios[t.rodada].nome)}</button>
        <button class="escolha" onclick="Jogo.curarNoTorneio()">Usar os vinte minutos para curar o time</button>
        <button class="escolha" onclick="Jogo.desistirTorneio()">Desistir do torneio</button>
      </div>
    </div>`);
    this.rolarTopo();
  },

  telaConferencia(){
    const c = Jogo.conferenciaAtual;
    if (!c) return this.telaLiga();
    this.limpar();
    this.add(this.topo());
    /* o time você só vê na arena: na Conferência ninguém mostra antes */
    const chave = c.adversarios.map((id, i) => {
      const v = veterano(id);
      const conhece = Veteranos.registro(id).conheceu;
      const est = i < c.rodada ? '✓ vencido' : (i === c.rodada ? 'agora' : 'aguardando');
      const cor = i < c.rodada ? 'var(--bom)' : (i === c.rodada ? 'var(--destaque)' : 'var(--texto-fraco)');
      return `<div class="linha"><span class="k">${PREMIO_CONFERENCIA[i].rodada} · ${this.esc(nomeDeLuta(v))}
        <span class="fraco">${conhece ? this.esc((LOCAIS[v.local] || {}).nome || '') : 'nunca se viram'}</span></span>
        <span class="v" style="color:${cor}">${est}</span></div>`;
    }).join('');
    const adv = veterano(c.adversarios[c.rodada]);
    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">Conferência do Planalto Indigo</div>
        <div class="tit">${this.esc(PREMIO_CONFERENCIA[c.rodada].rodada)}</div>
        <div class="loc">Arena do Planalto Indigo</div>
      </div>
      ${chave}
      <div id="escolhas" class="escolhas" style="margin-top:20px">
        <button class="escolha" onclick="Conferencia.lutar()">Entrar na arena — ${this.esc(nomeDeLuta(adv))}</button>
        <button class="escolha" onclick="Conferencia.curar()">Usar os vinte minutos para curar o time</button>
        <button class="escolha" onclick="Conferencia.desistir()">Desistir da Conferência</button>
      </div>
    </div>`);
    this.rolarTopo();
  },

  /* Conversa fora de capítulo (veterano, convite): falas, avisos e botões.
     `botoes` leva {texto, acao} com a chamada já montada. */
  telaConversa(o){
    this.limpar();
    this.add(this.topo());
    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">${this.esc(o.num || '')}</div>
        <div class="tit">${this.esc(o.titulo || '')}</div>
        <div class="loc">${this.esc(o.loc || '')}</div>
      </div>
      <div class="narrativa">${o.quem && o.monologo ? this.narrarMonologo(o.falas || [], o.quem) : this.narrar(o.falas || [], o.quem || null)}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas" style="margin-top:18px">
        ${(o.botoes || []).map(b => `<button class="escolha" onclick="${b.acao}">${this.esc(txt(b.texto))}</button>`).join('')}
      </div>
    </div>`);
    if (o.avisos && o.avisos.length) this.avisos(o.avisos);
    this.rolarTopo();
  },

  telaResultadoLiga(o){
    this.limpar();
    this.add(this.topo());
    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">${this.esc(o.sub||'Liga Pokémon')}</div>
        <div class="tit">${this.esc(o.titulo)}</div>
        <div class="loc">Planalto Indigo</div>
      </div>
      <div class="narrativa">${o.quem ? this.narrarMonologo((o.falas||[]).filter(Boolean), o.quem) : (o.falas||[]).filter(Boolean).map(t=>`<p>${this.esc(txt(t))}</p>`).join('')}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas" style="margin-top:20px">
        ${o.continuar ? `<button class="escolha" onclick="Jogo.continuarElite()">Abrir a próxima porta</button>` : ''}
        ${o.torneio ? `<button class="escolha" onclick="UI.telaTorneio()">Voltar ao chaveamento</button>` : ''}
        ${o.conferencia ? `<button class="escolha" onclick="UI.telaConferencia()">Voltar ao chaveamento</button>` : ''}
        ${!o.venceu ? `<button class="escolha" onclick="Jogo.hubCentro()">Curar o time</button>` : ''}
        <button class="escolha" onclick="UI.telaLiga()">Voltar à Liga</button>
        <button class="escolha" onclick="Jogo.voltarDosGinasios()">Continuar a jornada</button>
      </div>
    </div>`);
    if (o.avisos && o.avisos.length) this.avisos(o.avisos);
    this.rolarTopo();
  },

  /* ========================================================
     FINAIS
     ======================================================== */
  telaFinal(final){
    this.tom('final'); this.limpar();
    const d = Estado.dados;
    const codice = Estado.registrarFinal(final.id || 'fim', final.titulo);
    const totalFinais = (typeof CAPITULOS !== 'undefined')
      ? CAPITULOS.reduce((n,c) => n + Object.values(c.cenas).filter(x=>x.final).length, 0) : 0;
    const mortos = d.cemiterio.length
      ? `<h3>Quem não voltou</h3><p class="sussurro">${d.cemiterio.map(p=>this.esc(nomeExib(p))+' — '+this.esc(p.causaMorte)).join('<br>')}</p>` : '';
    const presos = Estado.lendariosCapturados();
    /* O final conta o que aconteceu com Kanto. O epílogo conta o que
       aconteceu com você, e quem escolhe é o crachá, a via e o que
       Kanto conta de você. */
    const ep = (typeof epilogoDaJornada === 'function') ? epilogoDaJornada() : null;
    const rodape = (typeof rodapeDaJornada === 'function') ? rodapeDaJornada() : [];
    if (ep) Estado.registrarFinal('ep_' + ep.id, 'Epílogo: ' + ep.titulo);

    this.add(`<div class="painel final">
      <div class="tit">${this.esc(final.titulo)}</div>
      ${final.texto.map(t=>`<p>${this.esc(txt(t))}</p>`).join('')}
      ${ep ? `<hr style="border:none;border-top:1px solid var(--borda);margin:32px 0">
        <div class="tit epilogo">${this.esc(ep.titulo)}</div>
        ${ep.texto.map(t=>`<p>${this.esc(txt(t))}</p>`).join('')}
        ${rodape.length ? `<div class="epilogo-rodape">${rodape.map(t=>`<p>${this.esc(txt(t))}</p>`).join('')}</div>` : ''}` : ''}
      <hr style="border:none;border-top:1px solid var(--borda);margin:32px 0">
      <div style="text-align:left;max-width:610px;margin:0 auto">
        <h3>Como você terminou</h3>
        <div class="linha"><span class="k">Reputação final</span><span class="v">${this.esc(Estado.nomeRep())} (${d.reputacao.eixo})</span></div>
        <div class="linha"><span class="k">Insígnias</span><span class="v">${d.insignias.length}</span></div>
        <div class="linha"><span class="k">Time</span><span class="v">${d.time.length} Pokémon</span></div>
        <div class="linha"><span class="k">Mortes permanentes</span><span class="v">${d.cemiterio.length}</span></div>
        <div class="linha"><span class="k">Lendários em cativeiro</span><span class="v">${presos.length ? presos.map(l=>DEX[l.dex].nome).join(', ') : 'nenhum'}</span></div>
        <div class="linha"><span class="k">Instabilidade de Kanto</span><span class="v">${d.mundo.instabilidade}</span></div>
        <div class="linha"><span class="k">Dias de jornada</span><span class="v">${d.relogio.dia}</span></div>
        ${mortos}
      </div>
      <div style="text-align:left;max-width:610px;margin:26px auto 0">
        <h3>Finais descobertos — ${codice.length} de ${totalFinais}</h3>
        ${codice.map(f=>`<div class="linha"><span class="k">${this.esc(f.titulo)}</span><span class="v">${f.titulo===final.titulo?'agora':'✓'}</span></div>`).join('')}
        <p class="sussurro">Escolhas diferentes levam a finais diferentes. A campanha tem ${totalFinais}.</p>
      </div>
      <div style="margin-top:34px">
        ${final.continua ? '<button class="btn destaque" onclick="Jogo.continuarPelaEstrada()">Continuar pela estrada</button>' : ''}
        <button class="btn${final.continua ? '' : ' destaque'}" onclick="Jogo.novo()">Nova jornada</button>
        <button class="btn" onclick="UI.modalDiario()">Ler o diário completo</button>
        <button class="btn" onclick="UI.modalRota()">Ver a rota que você percorreu</button>
      </div>
    </div>`);
    this.rolarTopo();
  },

  telaGameOver(motivo){
    this.tom('final'); this.limpar();
    const d = Estado.dados;
    this.add(`<div class="painel gameover">
      <div class="tit">FIM</div>
      <p style="max-width:540px;margin:0 auto 20px">${this.esc(motivo || 'Seu HP chegou a zero.')}</p>
      <p class="sussurro" style="max-width:540px;margin:0 auto 26px">
        Morte de treinador é permanente. Não tem Centro Pokémon para isso.
      </p>
      <div style="text-align:left;max-width:520px;margin:0 auto 30px">
        <div class="linha"><span class="k">Capítulo</span><span class="v">${d.capitulo}</span></div>
        <div class="linha"><span class="k">Reputação</span><span class="v">${this.esc(Estado.nomeRep())}</span></div>
        <div class="linha"><span class="k">Dias</span><span class="v">${d.relogio.dia}</span></div>
        <div class="linha"><span class="k">Pokémon deixados para trás</span><span class="v">${d.time.length}</span></div>
      </div>
      <button class="btn destaque" onclick="Jogo.novo()">Começar de novo</button>
    </div>`);
    Estado.apagarSave('auto');
    this.rolarTopo();
  },

  /* ========================================================
     MODAIS
     ======================================================== */
  /* classe: 'mochila' | 'pokedex' | '' — muda o jeito que a caixa abre
     vars:   { '--alguma-cor': '#hex' } — aplicado na caixa, para o tema da aba */
  modal(titulo, html, semFechar, classe, vars){
    this.fecharModal(true);
    /* Pokédex e Cartão são aparelho na mão: cabem na tela, não rolam
       por fora, e só fecham no X — tocar fora não guarda o aparelho */
    const soX = classe === 'pokedex' || classe === 'cartao';
    const m = this.el(`<div class="modal-fundo ${classe ? 'fundo-' + classe : ''}" id="modal">
      <div class="modal ${classe || ''}${soX ? ' so-x' : ''}">
        ${soX ? '<button class="modal-x" aria-label="Fechar" title="Fechar" onclick="UI.fecharModal()">×</button>' : ''}
        ${titulo ? `<h2>${this.esc(titulo)}</h2>` : ''}
        <div class="modal-corpo">${html}</div>
        ${semFechar || soX ? '' : '<div class="modal-pe"><button class="btn" onclick="UI.fecharModal()">Fechar</button></div>'}
      </div></div>`);
    if (!vars && classe === 'mochila' && typeof paletaMochila === 'function')
      vars = paletaMochila(mochilaAtual().cor);
    if (vars){
      const caixa = m.querySelector('.modal');
      for (const [k, v] of Object.entries(vars)) caixa.style.setProperty(k, v);
    }
    document.body.appendChild(m);
    if (!semFechar && !soX){
      m.onclick = e => { if (e.target === m) this.fecharModal(); };
      this._escModal = ev => { if (ev.key === 'Escape') this.fecharModal(); };
      document.addEventListener('keydown', this._escModal);
    }
  },
  fecharModal(imediato){
    /* cor provada e não salva volta pra salva */
    if (this._molduraProva){ this._molduraProva = null; aplicarMoldura(molduraSalva()); }
    const m = document.getElementById('modal');
    if (this._escModal){ document.removeEventListener('keydown', this._escModal); this._escModal = null; }
    if (!m) return;
    m.id = '';
    if (imediato) return m.remove();
    m.classList.add('saindo');
    setTimeout(() => m.remove(), 200);
  },

  /* O time: só nome e HP. Tocar num abre o que dá pra fazer com ele. */
  modalTime(){
    const d = Estado.dados;
    const linha = (p, i) => {
      const pct = p.hpMax ? Math.max(0, Math.round(p.hp / p.hpMax * 100)) : 0;
      const cls = p.morto ? ' morto' : (p.hp <= 0 ? ' caido' : '');
      const faixa = pct > 50 ? '' : (pct > 22 ? 'medio' : 'baixo');
      return `<button class="time-linha${cls}" data-uid="${p.uid}" onclick="UI.timeAcoes('${p.uid}')">
        <span class="time-icone">${imgSprite(p, 'icone')}</span>
        <span class="time-nome">${this.esc(nomeExib(p))}${this.shi(p)}${p.segurando ? `<span class="time-segura" title="${this.esc(p.segurando)}">${imgItem(p.segurando)}</span>` : ''}${
          (() => { const f = typeof Fome !== 'undefined' ? Fome.estado(p) : null; return f ? `<span class="time-fome ${f === 'faminto' ? 'grave' : ''}">${f}</span>` : ''; })()}</span>
        <span class="time-hp"><span class="barra ${faixa}"><i style="width:${pct}%"></i></span><span class="hp-num">${p.morto ? 'morto' : `${p.hp}/${p.hpMax}`}</span></span>
      </button>`;
    };
    const cem = d.cemiterio.length
      ? `<h3>Não voltaram</h3><div class="time-lista">${d.cemiterio.map(p => `<button class="time-linha morto" onclick="UI.sumario('${p.uid}')">
          <span class="time-icone">${imgSprite(p, 'icone')}</span><span class="time-nome">${this.esc(nomeExib(p))}</span>
          <span class="time-hp"><span class="hp-num">${this.esc(p.causaMorte || '')}</span></span></button>`).join('')}</div>` : '';
    this.modal('Seu time',
      (d.time.length ? `<div class="time-lista arrastavel" id="time-arrastavel">${d.time.map(linha).join('')}</div>` : '<p class="nada">Você não tem nenhum Pokémon.</p>') +
      (d.time.some(p => !p.morto) && !emLuta() ? `<div style="margin-top:10px"><button class="escolha" ${Estado.contaItem('Ração') > 0 ? 'onclick="UI.alimentarTime()"' : 'disabled'}>Alimentar o time — 1 Ração (tem ${Estado.contaItem('Ração')})</button></div>` : '') +
      (d.pc.length ? `<p class="sussurro" style="margin-top:10px">No PC: ${d.pc.length}.</p>` : '') +
      (d.time.length > 1 ? '<p class="sussurro" style="margin-top:8px">Segure e arraste pra mudar a ordem.</p>' : '') + cem);
    this.ativarArrastoDoTime();
  },

  /* Segurar e arrastar: segura meio segundo numa linha do time e ela
     solta da lista; arrasta pra cima ou pra baixo e solta onde quiser.
     Toque curto continua abrindo o menu do Pokémon. O primeiro da
     lista é quem entra na briga. */
  ativarArrastoDoTime(){
    const lista = document.getElementById('time-arrastavel');
    if (!lista || lista.children.length < 2) return;
    const SEGURAR = 450;
    let timer = null, arrastando = null, inicioY = 0, ultimoY = 0, engoleClique = false;
    const linhas = () => [...lista.querySelectorAll('.time-linha')];
    const soltar = () => {
      clearTimeout(timer); timer = null;
      if (!arrastando) return;
      const el = arrastando; arrastando = null;
      el.classList.remove('arrastando'); el.style.transform = '';
      lista.classList.remove('em-arrasto');
      const ordem = linhas().map(x => x.dataset.uid);
      const d = Estado.dados;
      const novo = ordem.map(u => d.time.find(p => p.uid === u)).filter(Boolean);
      if (novo.length === d.time.length && novo.some((p, i) => p !== d.time[i])){
        d.time = novo; Estado.salvar('auto');
      }
      engoleClique = true; setTimeout(() => { engoleClique = false; }, 60);
      this.modalTime();
    };
    lista.addEventListener('click', e => { if (engoleClique){ e.stopPropagation(); e.preventDefault(); } }, true);
    lista.addEventListener('contextmenu', e => { if (timer || arrastando) e.preventDefault(); });
    lista.addEventListener('pointerdown', e => {
      const el = e.target.closest('.time-linha');
      if (!el || el.classList.contains('morto')) return;
      inicioY = ultimoY = e.clientY;
      timer = setTimeout(() => {
        timer = null; arrastando = el;
        el.classList.add('arrastando'); lista.classList.add('em-arrasto');
        try { el.setPointerCapture(e.pointerId); } catch(_){}
        if (navigator.vibrate) try { navigator.vibrate(15); } catch(_){}
      }, SEGURAR);
    });
    lista.addEventListener('pointermove', e => {
      if (timer && Math.abs(e.clientY - inicioY) > 8){ clearTimeout(timer); timer = null; }
      if (!arrastando) return;
      e.preventDefault();
      ultimoY = e.clientY;
      arrastando.style.transform = `translateY(${ultimoY - inicioY}px)`;
      /* troca de lugar quando passa do meio do vizinho */
      const irmaos = linhas().filter(x => x !== arrastando);
      const r = arrastando.getBoundingClientRect(), meio = r.top + r.height / 2;
      let alvo = null;
      for (const x of irmaos){ const q = x.getBoundingClientRect(); if (meio < q.top + q.height / 2){ alvo = x; break; } }
      const antes = arrastando.getBoundingClientRect().top;
      if (alvo){ if (alvo !== arrastando.nextElementSibling) lista.insertBefore(arrastando, alvo); }
      else if (arrastando !== lista.lastElementChild) lista.appendChild(arrastando);
      const depois = arrastando.getBoundingClientRect().top;
      /* o elemento mudou de lugar no DOM: compensa pra ele não pular */
      if (depois !== antes){ inicioY += depois - antes; arrastando.style.transform = `translateY(${ultimoY - inicioY}px)`; }
    });
    lista.addEventListener('pointerup', soltar);
    lista.addEventListener('pointercancel', soltar);
  },

  alimentarTime(){
    if (emLuta() || !Fome.daRacaoPraTodos()) return this.modalTime();
    Estado.salvar('auto');
    this.modalTime();
    const av = document.querySelector('#modal .modal-corpo');
    if (av) av.insertAdjacentHTML('afterbegin', '<p class="sussurro">Você abre o saco e divide em partes. Ninguém espera a sua vez.</p>');
  },

  timeAcoes(uid){
    const d = Estado.dados;
    const p = d.time.find(x => x.uid === uid);
    if (!p) return this.modalTime();
    const temEquipavel = Object.entries(d.itens).some(([n, q]) => q > 0 && (ITENS_INFO[n] || {}).tipo === 'equipar');
    this.modal(nomeExib(p), `<div class="time-cab">${imgSprite(p, 'icone')}<span>${this.esc(nomeExib(p))}${this.shi(p)} · Nv ${p.nivel}</span>
        ${p.segurando ? `<span class="time-segura">${imgItem(p.segurando)}${this.esc(p.segurando)}</span>` : ''}</div>
      <button class="escolha" onclick="UI.sumario('${uid}')">Sumário</button>
      ${p.morto ? '' : (p.segurando
        ? `<button class="escolha" onclick="UI.tirarItem('${uid}')">Retirar item</button>`
        : `<button class="escolha" ${temEquipavel ? `onclick="UI.menuEquipar('${uid}')"` : 'disabled'}>Dar item</button>`)}
      <button class="escolha" onclick="UI.modalTime()">Voltar</button>`, true);
  },

  /* a ficha inteira de um Pokémon */
  sumario(uid){
    const d = Estado.dados;
    const p = d.time.find(x => x.uid === uid) || d.pc.find(x => x.uid === uid) || d.cemiterio.find(x => x.uid === uid);
    if (!p) return this.modalTime();
    const noTime = d.time.some(x => x.uid === uid);
    this.modal('', `<div class="carta sumario ${p.morto?'morto':''}">
      <div class="t"><span class="com-icone">${imgSprite(p, 'icone')}${this.esc(nomeExib(p))}${this.shi(p)}</span><span class="mono">Nv ${p.nivel}</span></div>
      <div class="sumario-arte">${imgSprite(p, 'frente')}</div>
      <div>${p.tipos.map(t=>this.tipoTag(t)).join('')}${p.status ? this.etiquetaStatus(p.status) : ''}</div>
      ${p.morto ? '<div class="sussurro" style="margin-top:8px">MORTO — '+this.esc(p.causaMorte)+'</div>' : this.barraHP(p, true)}
      <div class="sussurro" style="margin-top:7px">Natureza <b>${p.naturezaVista ? this.esc(p.natureza) : '???'}</b></div>
      <div class="sussurro">Moral ${p.moral}/100${(() => { const f = (!p.morto && typeof Fome !== 'undefined' && noTime) ? Fome.estado(p) : null; return f ? ` · <b>${f}</b>` : ''; })()}</div>
      ${(() => { const l = (typeof linhaDeAfinidade === 'function') ? linhaDeAfinidade(p) : null;
          return l ? `<div class="sussurro afinidade">${this.esc(l)}</div>` : ''; })()}
      ${p.morto ? '' : `<div class="segurado-linha">${p.segurando
          ? `${imgItem(p.segurando)}<span class="segurado-tag">segura ${this.esc(p.segurando)}</span>
             <span class="fraco">${this.esc(fichaItem(p.segurando))}</span>`
          : '<span class="fraco">mão livre</span>'}</div>`}
      <div style="margin-top:8px;font-size:12.5px;color:var(--texto-fraco)">
        ${p.golpes.map(g=>`${this.esc(g.nome)} <span class="mono">${g.pp}/${g.ppMax}</span>`).join(' · ')}</div>
      <div class="sussurro" style="margin-top:6px">${nomePosto(p.nivel)} · ${this.linhaAtrib(p)}</div>
      ${p.historia ? `<div class="sussurro" style="margin-top:7px;font-style:italic">${this.esc(p.historia)}</div>` : ''}
    </div>
    <div style="margin-top:12px"><button class="btn" onclick="${noTime ? `UI.timeAcoes('${uid}')` : 'UI.modalTime()'}">Voltar</button></div>`, true);
  },

  /* A mochila em abas: os aparelhos moram dentro dela. */
  abasMochila(atual){
    const d = Estado.dados;
    const novos = Estado.temPokenav() ? Estado.numerosDisponiveis().length : 0;
    const abas = [
      ['itens', 'Itens', 'UI.modalItens()', true],
      ['pokedex', 'Pokédex', 'UI.modalPokedex()', !!d.flags.tem_pokedex],
      ['nav', 'PokéNav' + (novos ? ` <b>${novos}</b>` : ''), 'UI.modalNav()', Estado.temPokenav()],
      ['cartao', 'Cartão', 'UI.modalCartao()', !!(d.flags.tem_cartao && d.flags.tem_pokedex)],
      ['mapa', 'Mapa', "Exploracao.mapa('mochila')", Estado.contaItem('Mapa de Kanto') > 0]
    ].filter(a => a[3]);
    if (abas.length < 2) return '';
    return `<nav class="abas-mochila" aria-label="Mochila">${abas.map(([id, rot, acao]) =>
      `<button class="aba${id === atual ? ' sel' : ''}" ${id === atual ? 'aria-current="page"' : `onclick="${acao}"`}>${svgIcone(id === 'nav' ? 'pokenav' : id)}${rot}</button>`).join('')}</nav>`;
  },

  /* Ajustes: o que não é do jogo, e sim de quem joga. */
  modalAjustes(){
    const salva = molduraSalva();
    this._molduraProva = null;
    this.modal('Ajustes', `
      <div class="ajuste-moldura">
        <h3>Cor da moldura</h3>
        <div class="bolinhas" role="radiogroup" aria-label="Cor da moldura">
          ${CORES_MOLDURA.map(c => `<button class="bolinha${c.id === salva ? ' sel' : ''}" role="radio"
              aria-checked="${c.id === salva}" aria-label="${c.nome}" title="${c.nome}" data-cor="${c.id}"
              style="--c:${c.amostra}" onclick="UI.provarMoldura('${c.id}')"></button>`).join('')}
        </div>
        <div class="moldura-pe">
          <span class="moldura-nome" id="moldura-nome">${this.esc((CORES_MOLDURA.find(c => c.id === salva) || CORES_MOLDURA[0]).nome)}</span>
          <button class="btn mini" id="moldura-salvar" onclick="UI.salvarMoldura()" disabled>Salvar</button>
        </div>
      </div>
      <button class="escolha" onclick="UI.modalRegras()">Regras</button>
      <button class="escolha" onclick="UI.modalTutorial()">Tutorial</button>
      ${this.ajustesDeSom()}`);
  },

  modalItens(){
    const d = Estado.dados;
    const itens = Object.entries(d.itens).filter(([,q]) => q > 0);
    const total = itens.reduce((a,[,q]) => a + q, 0);
    const bolsa = mochilaAtual();
    const topo = this.abasMochila('itens') + `<div class="mochila-topo">
      <span class="fecho"></span>
      <span class="bolsa-nome">${this.esc(bolsa.rotulo)}</span>
      <span class="peso">${total} ${total === 1 ? 'unidade' : 'unidades'} · ${itens.length} tipos</span>
    </div>`;

    if (!itens.length)
      return this.modal('Mochila', topo +
        '<p class="nada">A mochila está vazia. Tudo o que você tiver vai ter vindo de alguém ou de algum balcão.</p>',
        false, 'mochila');

    const ORDEM = ['Captura','Recuperação','Máquina','Segurado','Evolução','Campo','Treinador','Vínculo','Ferramenta','Vestuário','Outro'];
    const grupos = {};
    itens.forEach(([n,q]) => {
      const c = categoriaItem(n);
      (grupos[c] = grupos[c] || []).push([n,q]);
    });

    const corpo = ORDEM.filter(c => grupos[c]).map(c => {
      const linhas = grupos[c].map(([n,q]) => {
        const info = ITENS_INFO[n] || {};
        const usavel = (['pedra','curaJogador','cura','revive','status','moral','repelente','pp','ppTodos','tm'].includes(info.tipo)
                        || info.tipo === 'ppUp'
                        || (info.tipo === 'mapa' && Estado.dados.modo === 'mundo'))
                       && !emLuta();
        const equipavel = info.tipo === 'equipar' && !emLuta();
        const ebolsa = info.tipo === 'bolsa';
        const emUso = ebolsa && bolsa.nome === n;
        return `<div class="item-linha">
          ${imgItem(n)}
          <span class="qtd">×${q}</span>
          <span class="corpo">
            <span class="nome">${this.esc(n)}</span>
            <span class="ficha">${this.esc(fichaItem(n))}</span>
            ${info.desc && info.tipo !== 'bola' ? `<span class="desc">${this.esc(descricaoItem(n))}</span>` : ''}
          </span>
          ${usavel ? `<button class="btn mini" style="flex:0 0 auto;align-self:center"
            onclick="UI.usarDaMochila('${n.replace(/'/g,"\\'")}')">usar</button>` : ''}
          ${equipavel ? `<button class="btn mini" style="flex:0 0 auto;align-self:center"
            onclick="UI.menuEquiparItem('${n.replace(/'/g,"\\'")}')">equipar</button>` : ''}
          ${ebolsa && !emUso ? `<button class="btn mini" style="flex:0 0 auto;align-self:center"
            onclick="UI.usarBolsa('${n.replace(/'/g,"\\'")}')">usar</button>` : ''}
          ${emUso ? '<span class="qtd" style="align-self:center">em uso</span>' : ''}
        </div>`;
      }).join('');
      return `<h3 class="cat-item">${this.esc(c)}</h3>${linhas}`;
    }).join('');

    this.modal('Mochila', topo + corpo, false, 'mochila');
  },

  usarBolsa(nome){
    if (!Estado.contaItem(nome)) return;
    Estado.dados.jogador.bolsa = nome;
    Estado.salvar('auto');
    this.modalItens();
  },

  /* ---------- TM ----------
     Como nos jogos: a lista do time diz na hora quem aprende e quem não
     aprende. Quem já sabe quatro golpes escolhe qual esquecer, e a TM só
     some se o golpe ficar. */
  ensinarTM(nome){
    const info = ITENS_INFO[nome] || {};
    const golpe = info.golpe;
    const time = (Estado.dados.time || []).filter(p => !p.morto);
    const linhas = time.map(p => {
      const sabe = p.golpes.some(g => g.nome === golpe);
      const pode = aprendeTM(p, nome);
      const estado = sabe ? 'já sabe' : (pode ? 'aprende' : 'não aprende');
      return `<button class="escolha com-item tm-alvo${pode && !sabe ? '' : ' nao'}" ${pode && !sabe ? '' : 'disabled'}
        onclick="UI.ensinarTMa('${p.uid}','${nome.replace(/'/g, "\\'")}')">
        ${imgSprite(p, 'icone')}${this.esc(nomeExib(p))} <span class="pd">Nv ${p.nivel} · ${estado}</span></button>`;
    }).join('');
    this.modal(nome, `<div class="aprender-novo">${this.cartaoGolpe(golpe)}</div>
      <p class="sussurro">Ensinar pra quem?</p>${linhas || '<p class="nada">Ninguém no time.</p>'}`, false, 'mochila');
  },
  ensinarTMa(uid, nome){
    const p = (Estado.dados.time || []).find(x => x.uid === uid);
    const golpe = (ITENS_INFO[nome] || {}).golpe;
    if (!p || !golpe || !aprendeTM(p, nome) || !Estado.contaItem(nome)) return;
    const quem = this.esc(nomeExib(p));
    const pronto = (velho) => {
      Estado.usarItem(nome);
      Estado.registrar(`${nomeExib(p)} aprendeu ${golpe} com a ${nome}.`);
      Estado.salvar('auto');
      this.modal('', `${velho ? `<p>1, 2 e… pronto! ${quem} esqueceu <b>${this.esc(velho)}</b>.</p>` : ''}
        <p>E… ${quem} aprendeu <b>${this.esc(golpe)}</b>!</p>`, false, 'mochila');
    };
    if (p.golpes.length < 4){ ofertarGolpe(p, golpe); return pronto(null); }
    this.perguntarGolpe(p, golpe, 'modal', (i) => {
      if (i < 0){
        aprenderNoLugar(p, golpe, -1);
        return this.modal('', `<p>${quem} não aprendeu ${this.esc(golpe)}.</p><p class="sussurro">A ${this.esc(nome)} continua na mochila.</p>`, false, 'mochila');
      }
      pronto(aprenderNoLugar(p, golpe, i));
    });
  },

  /* ---------- PP Up: +1/5 do PP base, até três vezes por golpe ---------- */
  escolherPPUp(nome, uid){
    const d = Estado.dados;
    const esc = s => s.replace(/'/g, "\\'");
    if (!uid){
      const alvos = d.time.filter(p => !p.morto);
      return this.modal('Em quem?', alvos.map(p =>
        `<button class="escolha com-item" onclick="UI.escolherPPUp('${esc(nome)}','${p.uid}')">
          ${imgSprite(p, 'icone')}${this.esc(nomeExib(p))} <span class="pd">Nv ${p.nivel}</span></button>`).join(''), false, 'mochila');
    }
    const p = d.time.find(x => x.uid === uid);
    if (!p) return;
    this.modal('Em qual golpe?', p.golpes.map((g, i) => {
      const cheio = (g.ups || 0) >= 3;
      return `<button class="escolha" ${cheio ? 'disabled' : ''} onclick="UI.aplicarPPUp('${esc(nome)}','${p.uid}',${i})">
        ${this.esc(g.nome)} <span class="pd">PP ${g.pp}/${g.ppMax}${cheio ? ' · no máximo' : ''}</span></button>`;
    }).join(''), false, 'mochila');
  },
  aplicarPPUp(nome, uid, i){
    const p = Estado.dados.time.find(x => x.uid === uid);
    const g = p && p.golpes[i];
    if (!g || !GOLPES[g.nome] || (g.ups || 0) >= 3 || !Estado.contaItem(nome)) return;
    const mais = Math.max(1, Math.floor(GOLPES[g.nome].pp / 5));
    Estado.usarItem(nome);
    g.ups = (g.ups || 0) + 1;
    g.ppMax += mais; g.pp += mais;
    Estado.salvar('auto');
    this.modal('', `<p>O PP de ${this.esc(g.nome)} subiu: agora ${g.ppMax}.</p>`, false, 'mochila');
  },

  /* ---------- EQUIPAR ---------- */
  menuEquipar(uid){
    const d = Estado.dados;
    const disp = Object.entries(d.itens).filter(([n,q]) => q > 0 && (ITENS_INFO[n]||{}).tipo === 'equipar');
    if (!disp.length)
      return this.modal('Equipar', '<p class="nada">Você não tem nenhum item que se segura. Eles aparecem em loja de cidade grande e em rota.</p>', false, 'mochila');
    this.modal('Equipar em quem?', disp.map(([n,q]) =>
      `<button class="escolha" onclick="UI.equipar('${uid}','${n.replace(/'/g,"\\'")}')">
        ${this.esc(n)} <span class="pd">${this.esc(fichaItem(n))} · você tem ${q}</span></button>`).join(''),
      false, 'mochila');
  },
  menuEquiparItem(nome){
    const vivos = Estado.dados.time.filter(p => !p.morto);
    if (!vivos.length) return this.modal('Equipar', '<p class="nada">Não tem em quem.</p>', false, 'mochila');
    this.modal('Quem segura?', vivos.map(p =>
      `<button class="escolha" onclick="UI.equipar('${p.uid}','${nome.replace(/'/g,"\\'")}')">
        ${this.esc(nomeExib(p))} <span class="pd">${p.segurando ? 'já segura '+this.esc(p.segurando)+' — volta pra mochila' : 'mão livre'}</span></button>`).join(''),
      false, 'mochila');
  },
  equipar(uid, nome){
    const p = Estado.equipar(uid, nome);
    Estado.salvar('auto');
    if (!p) return this.modal('', '<p class="nada">Não deu.</p>', false, 'mochila');
    this.modal('', `<p>${this.esc(nomeExib(p))} passa a segurar <b>${this.esc(nome)}</b>.</p>
      <p class="ficha-bloco">${this.esc(fichaItem(nome))}</p>
      <p class="sussurro">${this.esc(descricaoItem(nome))}</p>`, false, 'mochila');
  },
  tirarItem(uid){
    const p = Estado.desequipar(uid);
    Estado.salvar('auto');
    if (!p) return;
    this.timeAcoes(uid);
  },

  /* usar item fora de combate: pedra evolutiva, cura, PP, repelente */
  usarDaMochila(nome){
    const info = ITENS_INFO[nome] || {};
    const d = Estado.dados;
    if (!Estado.contaItem(nome)) return;
    /* na luta, item se usa pelo Bag, gastando o turno; a mochila do topo só mostra */
    if (emLuta()) return this.modal('', '<p>No meio da luta, item se usa pelo Bag.</p>', false, 'mochila');
    if (info.tipo === 'tm') return this.ensinarTM(nome);
    if (info.tipo === 'ppUp') return this.escolherPPUp(nome);
    if (info.tipo === 'mapa') return Exploracao.mapa('mochila');

    if (info.tipo === 'curaJogador'){
      Estado.usarItem(nome); Estado.curarJogador(info.valor); Estado.salvar('auto');
      this.modal('', `<p>Você se cuida sozinh{o|a}, sentad{o|a} em algum lugar que não é confortável.</p>
        <p class="sussurro">HP ${Estado.j.hp}/${Estado.hpMaxJogador()}.</p>`, false, 'mochila');
      return;
    }
    if (info.tipo === 'repelente'){
      Estado.usarItem(nome);
      sincronizarHora(d.relogio);
      d.repelenteAte = (d.relogio.dia * 24 + d.relogio.hora) + info.valor * 6;   // valor em períodos
      Estado.salvar('auto');
      this.modal('', '<p>O cheiro é horrível e funciona. Por uns períodos, o mato em volta fica mais quieto do que devia.</p>', false, 'mochila');
      return;
    }
    if (info.tipo === 'pedra'){
      const tabela = pedrasDe(nome) || {};
      const alvos = d.time.filter(p => !p.morto && tabela[p.dex]);
      if (!alvos.length)
        return this.modal('', `<p class="nada">Você segura a pedra perto de cada um deles, um por um, e não acontece nada.
          Ou nenhum deles é do tipo, ou nenhum deles está pronto. Não dá pra saber qual das duas.</p>`, false, 'mochila');
      return this.modal('Em quem?', alvos.map(p =>
        `<button class="escolha" onclick="UI.aplicarPedra('${nome.replace(/'/g,"\\'")}','${p.uid}')">
          ${this.esc(nomeExib(p))} <span class="pd">vira ${this.esc(DEX[tabela[p.dex]].nome)} — e não volta</span></button>`).join(''),
        false, 'mochila');
    }
    /* cura, revive, status, moral, pp: abre o time e você toca em quem */
    const lista = this.escolherDoTime(p => `UI.aplicarItemFora('${nome.replace(/'/g,"\\'")}','${p.uid}')`);
    if (!lista) return this.modal('', '<p class="nada">Não tem em quem usar.</p>', false, 'mochila');
    this.modal(nome, `<div class="time-lista">${lista}</div>
      <div style="margin-top:12px"><button class="btn" onclick="UI.modalItens()">Voltar</button></div>`, true, 'mochila');
  },

  aplicarPedra(nome, uid){
    const d = Estado.dados;
    const p = d.time.find(x => x.uid === uid);
    const destino = (pedrasDe(nome)||{})[p && p.dex];
    if (!p || !destino) return;
    Estado.usarItem(nome);
    const antigo = nomeExib(p);
    evoluir(p, destino);
    Estado.marcar('usou_pedra');
    Estado.registrar(`${antigo} virou ${p.nome} com ${nome}.`);
    Estado.salvar('auto');
    this.modal('', `<p>Leva uns quatro segundos e não tem som nenhum.</p>
      <p>${this.esc(antigo)} muda de tamanho, de cor e de peso na sua mão, e quando acaba você está segurando ${this.esc(nomeExib(p))} e a pedra virou pó entre os seus dedos.</p>
      <p class="sussurro">Ele te olha exatamente do mesmo jeito. Isso é a parte que ninguém conta.</p>`, false, 'mochila');
  },

  aplicarItemFora(nome, uid){
    const info = ITENS_INFO[nome] || {};
    const p = Estado.dados.time.find(x => x.uid === uid);
    if (!p) return;
    const hpAntes = Math.max(0, p.hp);
    let msg = '';
    if (info.tipo === 'cura'){
      if (p.hp <= 0) msg = `${nomeExib(p)} está desmaiad${pron(p).o}. Potion não resolve isso.`;
      else { Estado.usarItem(nome); const a = p.hp; p.hp = Math.min(p.hpMax, p.hp + info.valor);
             msg = `${nomeExib(p)} recuperou ${p.hp - a} de HP.`; }
    } else if (info.tipo === 'revive'){
      if (p.hp > 0) msg = `${nomeExib(p)} não está desmaiad${pron(p).o}.`;
      else { Estado.usarItem(nome); p.hp = Math.floor(p.hpMax/2); msg = `${nomeExib(p)} voltou a si com ${p.hp} de HP.`; }
    } else if (info.tipo === 'status'){
      Estado.usarItem(nome); p.status = null; p.statusTurnos = 0;
      msg = `${nomeExib(p)} teve as condições curadas.`;
    } else if (info.tipo === 'moral'){
      Estado.usarItem(nome); p.moral = Math.min(100, p.moral + info.valor);
      if (typeof Fome !== 'undefined') Fome.alimentar(p);
      msg = `${nomeExib(p)} come devagar e depois encosta em você. É pouco e é alguma coisa.`;
    } else if (info.tipo === 'pp'){
      const g = p.golpes.find(x => x.pp < x.ppMax);
      if (!g) msg = `Os golpes de ${nomeExib(p)} estão cheios.`;
      else { Estado.usarItem(nome); g.pp = Math.min(g.ppMax, g.pp + info.valor);
             msg = `${this.esc(g.nome)} voltou a ter fôlego: ${g.pp}/${g.ppMax}.`; }
    } else if (info.tipo === 'ppTodos'){
      Estado.usarItem(nome);
      p.golpes.forEach(g => { g.pp = Math.min(g.ppMax, g.pp + info.valor); });
      msg = `Todos os golpes de ${nomeExib(p)} recuperaram um pouco.`;
    }
    Estado.salvar('auto');
    if (typeof Som !== 'undefined') Som.efeito('item');
    /* a barra sai de onde estava e anda até onde ficou, como na luta */
    const mudou = p.hp !== hpAntes;
    const linha = mudou ? `<div class="time-lista">${this.escolherDoTime(() => '', x => x.uid === p.uid)}</div>` : '';
    this.modal('', `${linha}<p>${this.esc(msg)}</p>`, false, 'mochila');
    if (mudou) this.animarBarraDoTime(p, hpAntes);
  },
  /* Fora da luta, o XP ganho (treino) aparece como na luta: a barra de
     cada um sai de onde estava, enche, e a cada nível vai ao fim, pisca,
     zera e continua. */
  barrasDeXP(antes){
    const caixa = document.getElementById('avisos');
    if (!caixa || !antes || !antes.length) return;
    const time = Estado.dados.time;
    const linhas = antes.map(a => ({a, p:time.find(x => x.uid === a.uid)})).filter(x => x.p && !x.p.morto);
    if (!linhas.length) return;
    const bloco = this.el(`<div class="xp-treino">${linhas.map(({a, p}) => `
      <div class="xp-linha" data-uid="${p.uid}">
        <span class="time-icone">${imgSprite(p, 'icone')}</span>
        <span class="xp-nome">${this.esc(nomeExib(p))} <span class="mono nv">Nv ${a.nivel}</span></span>
        <div class="barra-exp"><i style="width:${Math.round(a.exp / a.expProx * 100)}%"></i></div>
      </div>`).join('')}</div>`);
    caixa.appendChild(bloco);
    const reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    linhas.forEach(({a, p}, k) => {
      const lin = bloco.querySelector(`.xp-linha[data-uid="${p.uid}"]`);
      const i = lin.querySelector('.barra-exp i'), nv = lin.querySelector('.nv');
      /* os trechos: até o fim de cada nível subido, e o que sobrou no último */
      const trechos = [];
      let pct = a.exp / a.expProx * 100;
      for (let n = a.nivel; n < p.nivel; n++){ trechos.push({de:pct, para:100, nivel:n + 1}); pct = 0; }
      trechos.push({de:pct, para:p.expProx ? p.exp / p.expProx * 100 : 100, nivel:null});
      if (reduz){ i.style.width = trechos[trechos.length - 1].para + '%'; nv.textContent = 'Nv ' + p.nivel; return; }
      const tocar = (t) => new Promise(ok => {
        const ms = 300 + Math.abs(t.para - t.de) * 7, t0 = performance.now();
        const passo = agora => {
          const q = Math.min(1, (agora - t0) / ms), e = 1 - Math.pow(1 - q, 2);
          i.style.width = (t.de + (t.para - t.de) * e).toFixed(1) + '%';
          if (q < 1) requestAnimationFrame(passo); else ok();
        };
        requestAnimationFrame(passo);
      });
      (async () => {
        await new Promise(z => setTimeout(z, 250 + k * 120));
        for (const t of trechos){
          await tocar(t);
          if (t.nivel){
            lin.classList.add('subiu'); nv.textContent = 'Nv ' + t.nivel;
            await new Promise(z => setTimeout(z, 260));
            lin.classList.remove('subiu'); i.style.width = '0%';
          }
        }
      })();
    });
  },

  /* barra de HP de uma linha do time indo de `de` até o HP atual */
  animarBarraDoTime(p, de){
    const caixa = document.querySelector('#modal .time-lista .time-linha');
    if (!caixa) return;
    caixa.removeAttribute('onclick');
    const barra = caixa.querySelector('.barra'), i = barra && barra.querySelector('i'), num = caixa.querySelector('.hp-num');
    const pct = v => Math.max(0, Math.min(100, v / p.hpMax * 100));
    const faixa = v => pct(v) > 50 ? '' : (pct(v) > 22 ? 'medio' : 'baixo');
    if (!i) return;
    const para = Math.max(0, p.hp), ms = 650;
    barra.className = 'barra ' + faixa(de);
    i.style.width = pct(de) + '%';
    if (num) num.textContent = `${de}/${p.hpMax}`;
    caixa.classList.toggle('caido', de <= 0);
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches){
      i.style.width = pct(para) + '%'; barra.className = 'barra ' + faixa(para);
      if (num) num.textContent = `${para}/${p.hpMax}`; caixa.classList.toggle('caido', para <= 0); return;
    }
    const t0 = performance.now();
    const passo = t => {
      const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      const v = de + (para - de) * e;
      i.style.width = pct(v) + '%';
      barra.className = 'barra ' + faixa(v);
      if (num) num.textContent = `${Math.round(v)}/${p.hpMax}`;
      if (k < 1) requestAnimationFrame(passo);
      else caixa.classList.toggle('caido', para <= 0);
    };
    setTimeout(() => requestAnimationFrame(passo), 220);
  },

  modalFicha(){
    const d = Estado.dados, j = d.jogador;
    const nomes = {forca:'Força',percepcao:'Percepção',intelecto:'Intelecto',carisma:'Carisma',sorte:'Sorte',resistencia:'Resistência'};
    const st = Object.entries(nomes).map(([k,n]) =>
      `<div class="status-linha"><span class="nome">${n}</span>
       <span class="status-pontos">${Array.from({length:10},(_,i)=>`<i class="${i<j.status[k]?'on':''}"></i>`).join('')}</span>
       <span class="mono" style="width:26px;text-align:right">${j.status[k]}</span></div>`).join('');
    const nivel = Estado.nivelRep();
    const eixo = d.reputacao.eixo;
    const val = eixo === 'bom' ? d.reputacao.bom : d.reputacao.ruim;
    const npcs = Object.values(d.npcs);
    const lend = Object.values(d.lendarios);
    this.modal('Ficha do treinador', `
      <div class="linha"><span class="k">Nome</span><span class="v">${this.esc(j.nome)} (${this.esc(j.genero)}, ${idadeJogador()} anos)</span></div>
      <div class="linha"><span class="k">Nascimento</span><span class="v">${this.esc(textoNascimento(nascimentoDe()))}</span></div>
      <div class="linha"><span class="k">Cidade natal</span><span class="v">${this.esc(j.cidade)}</span></div>
      <div class="linha"><span class="k">Objetivo</span><span class="v">${this.esc(j.objetivo)}</span></div>
      ${(() => { const r = rumoDe(); const m = METAS.find(x => x.id === r.meta);
        return `<div class="linha"><span class="k">O que isso quer dizer</span><span class="v">${this.esc(m ? m.nome : '')}</span></div>`
          + (r.gostos.texto ? `<div class="linha"><span class="k">Gosta de</span><span class="v">${this.esc(r.gostos.texto)}</span></div>` : '')
          + (r.desgostos.texto ? `<div class="linha"><span class="k">Não gosta de</span><span class="v">${this.esc(r.desgostos.texto)}</span></div>` : ''); })()}
      <div class="linha"><span class="k">Personalidade</span><span class="v">${this.esc(j.personalidade)}</span></div>
      <div style="margin:0 0 14px"><button class="btn mini" onclick="UI.modalCredenciais()">Credenciais${
        (typeof Cargos !== 'undefined' && Cargos.lista().length) ? ' (' + Cargos.lista().length + ')' : ''}</button></div>
      <div class="linha"><span class="k">HP</span><span class="v">${j.hp} / ${Estado.hpMaxJogador()}</span></div>
      <div class="linha"><span class="k">Insígnias</span><span class="v">${d.insignias.filter(i=>i!=='Título de Campeão').length}/8</span></div>
      ${d.insignias.length ? d.insignias.map(i => {
        const g = GINASIOS.find(x => x.insignia === i), src = g && caminhoInsignia(g.id);
        return `<div class="linha"><span class="k com-icone" style="padding-left:12px">${src ? `<img class="insignia-mini" src="${src}" alt="" onerror="this.remove()">` : ''}${this.esc(i)}</span><span class="v">✓</span></div>`;
      }).join('') : ''}
      <h3>Reputação — ${this.esc(nivel.nome)} (${eixo}, nível ${val}/8)</h3>
      <div class="rep-barra ${eixo}"><i style="width:${(val/8)*100}%"></i></div>
      <p class="sussurro">${this.esc(nivel.ef)}</p>
      <h3>Status</h3>${st}
      ${d.rival && d.npcs['Ezra'] ? `<h3>Rival — ${this.esc(ARCOS_RIVAL[arcoRival()].nome)}</h3>
        <p class="sussurro">${this.esc(ARCOS_RIVAL[arcoRival()].resumo)}</p>
        <div class="linha"><span class="k">${this.esc(d.rival.nome)}</span><span class="v">você ${d.rival.derrotas} × ${d.rival.vitorias} ele</span></div>
        <div class="linha"><span class="k">Inicial dele</span><span class="v">${this.esc(DEX[d.rival.inicialDex].nome)}</span></div>` : ''}
      ${(typeof rivaisConquistados === 'function' && rivaisConquistados().length)
        ? '<h3>Rivais que você arrumou</h3>' + rivaisConquistados().map(({def, reg}) =>
            `<div class="linha"><span class="k">${this.esc(def.nome)} <span class="sussurro">${this.esc(def.desde)} · ${this.esc(def.origem)}</span></span>
             <span class="v">você ${reg.derrotas} × ${reg.vitorias} ele</span></div>`).join('')
        : ''}
      ${(typeof Campo !== 'undefined') ? '<h3>O que dá pra fazer no mundo</h3>' + Campo.resumo().map(([nome, r]) =>
        `<div class="linha"><span class="k">${this.esc(nome)}</span><span class="v ${r.pode?'':'nao'}">${
          r.pode ? this.esc(r.como || 'sim') : this.esc('falta ' + r.falta)}</span></div>`).join('') : ''}
      ${npcs.length ? '<h3>Quem lembra de você</h3>' + npcs.map(n =>
        `<div class="linha"><span class="k">${this.esc(n.nome)} <span class="sussurro">${this.esc((n.memorias||[]).slice(-1)[0]?.texto||'')}</span></span>
         <span class="v" style="color:${n.opiniao>0?'var(--bom)':n.opiniao<0?'var(--ruim)':'var(--texto-fraco)'}">${n.opiniao>0?'+':''}${n.opiniao}</span></div>`).join('') : ''}
      ${lend.length ? '<h3>Lendários</h3>' + lend.map(l =>
        `<div class="linha"><span class="k">${this.esc(DEX[l.dex].nome)}</span>
         <span class="v">${this.esc(l.estado)} · ${this.esc(l.disposicao)}${l.caçandoVoce?' · TE CAÇANDO':''}</span></div>`).join('') : ''}
      <h3>Mundo</h3>
      <div class="linha"><span class="k">Clima de Kanto</span><span class="v">${this.esc(d.mundo.clima)}</span></div>
      <div class="linha"><span class="k">Instabilidade</span><span class="v">${d.mundo.instabilidade}</span></div>
      <div class="linha"><span class="k">Avisos da Liga</span><span class="v">${d.liga.avisos}${d.liga.detencao?' · DETENÇÃO ATIVA':d.liga.ordemDevolucao?' · ordem de devolução':''}</span></div>
    `);
  },

  /* ========================================================
     CARTÃO DE TREINADOR
     ======================================================== */
  corDoCartao(k){
    if (!CORES_CARTAO[k]) return;
    Estado.j.corCartao = k;
    Estado.salvar('auto');
    this.modalCartao();
  },

  modalCartao(){
    const d = Estado.dados;
    if (!d.flags.tem_cartao || !d.flags.tem_pokedex) return this.modalFicha();
    const j = d.jogador;
    const c = Estado.contagemDex();
    const nivel = Estado.nivelRep();
    const eixo = d.reputacao.eixo;
    const val = eixo === 'bom' ? d.reputacao.bom : d.reputacao.ruim;
    const prog = Estado.progressoRep();
    const id = String((d.criadoEm || 0) % 100000).padStart(5, '0');
    const campeao = d.insignias.includes('Campeão de Kanto') || d.flags.campeao_de_kanto;

    /* O cartão só sabe o que você já sabe: enquanto a cidade não
       for pisada, o slot é um recorte vazio sem nome e sem lugar. */
    const insignias = GINASIOS.map(g => {
      const tem = d.insignias.includes(g.insignia);
      const sabe = tem || (typeof Mundo !== 'undefined' && Mundo.visitado(g.id));
      const cor = g.tipo === 'variado' ? '#d9b53a' : (COR_TIPO[g.tipo] || '#a8aeb8');
      const nome = g.insignia.replace(/^Insígnia\s+/, '');
      const titulo = sabe ? `${this.esc(g.cidade)} · ${this.esc(g.lider)}` : 'Um ginásio que você ainda não encontrou';
      return `<div class="insignia-slot ${tem ? 'tem' : ''} ${sabe ? '' : 'oculta'}" title="${titulo}">
        ${caminhoInsignia(g.id)
          ? `<img class="insignia-img${tem ? '' : ' vaga'}" src="${caminhoInsignia(g.id)}" alt="${this.esc(g.insignia)}" onerror="this.remove()">`
          : `<span class="forma ins-${g.id}" style="--ins-cor:${sabe ? cor : 'transparent'}"></span>`}
        <span class="rot">${tem || sabe ? this.esc(nome) : '—'}</span>
        <span class="cid">${sabe ? this.esc(g.cidade) : '???'}</span>
      </div>`;
    }).join('');

    const nInsig = d.insignias.filter(i => i !== 'Título de Campeão' && i !== 'Campeão de Kanto').length;

    this.modal('', this.abasMochila('cartao') + `
      <div class="cartao-topo">
        <span class="cartao-sigla">REGISTRO DE TREINADOR</span>
        <span class="cartao-id">Nº ${id}</span>
      </div>

      <div class="cartao-corpo">
        <div class="cartao-retrato">
          <span class="silhueta" aria-hidden="true"></span>
        </div>
        <div class="cartao-dados">
          <div class="cartao-nome">${this.esc(j.nome)}</div>
          <div class="cartao-titulo">${this.esc(j.cargo || (campeao ? '{Campeão|Campeã} de Kanto' : '{Treinador registrado|Treinadora registrada}'))}</div>
          <div class="cartao-linha"><span class="k">Idade</span><span class="v">${idadeJogador()} anos</span></div>
          <div class="cartao-linha"><span class="k">Cidade natal</span><span class="v">${this.esc(j.cidade)}</span></div>
          <div class="cartao-linha"><span class="k">Na estrada há</span><span class="v">${d.relogio.dia} ${d.relogio.dia === 1 ? 'dia' : 'dias'}</span></div>
          <div class="cartao-linha grana"><span class="k">Dinheiro</span><span class="v mono">${fmtDin(j.dinheiro)} ₽</span></div>
          <div class="cartao-linha"><span class="k">Pokédex</span><span class="v mono">${c.catalogados} catalogados · ${c.vistos} vistos</span></div>
          <div class="cartao-linha"><span class="k">Time</span><span class="v">${d.time.length} em mãos${d.pc.length ? ' · ' + d.pc.length + ' no PC' : ''}</span></div>
          ${d.cemiterio.length ? `<div class="cartao-linha"><span class="k">Não voltaram</span><span class="v perdas">${d.cemiterio.length}</span></div>` : ''}
        </div>
      </div>

      <div class="cartao-rep">
        <div class="cartao-linha"><span class="k">Reputação</span><span class="v">${this.esc(nivel.nome)} · ${eixo} ${val}/8</span></div>
        <div class="rep-barra ${eixo}"><i style="width:${Math.round(prog.atual*100)}%"></i></div>
        <div class="rep-nota">${prog.prox
          ? `${prog.pontos} ponto${prog.pontos === 1 ? '' : 's'} · faltam ${prog.falta} para o próximo degrau`
          : `${prog.pontos} pontos · não tem degrau acima deste`}</div>
      </div>

      <div class="cartao-insignias">
        <div class="cartao-sub">Insígnias — ${nInsig} de 8${campeao ? ' · Campeão de Kanto' : ''}</div>
        <div class="grade-insignias">${insignias}</div>
      </div>

      <div class="cartao-pe">
        <div class="cartao-cores" role="group" aria-label="Cor do cartão">
          ${Object.entries(CORES_CARTAO).map(([k, c]) => `<button class="cartao-cor${(j.corCartao || 'azul') === k ? ' sel' : ''}"
            style="background:${c[1]}" title="${this.esc(c[3])}" aria-label="${this.esc(c[3])}" onclick="UI.corDoCartao('${k}')"></button>`).join('')}
        </div>
        <button class="btn mini" onclick="UI.modalFicha()">Ficha completa</button>
      </div>
    `, false, 'cartao', varsCartao(j.corCartao));
  },

  modalPokedex(){
    if (typeof Som !== 'undefined' && !(document.querySelector('#modal .modal.pokedex'))) Som.efeito('pokedex');
    const c = Estado.contagemDex();
    const pd = Estado.pdex();
    /* Antes do upgrade, o aparelho mostra Kanto e os lendários que
       a sua história atravessou. Depois, mostra os duzentos e
       cinquenta e um e não pede desculpa pelo tamanho da lista. */
    const nacional = dexNacional();
    const ids = registroAtivo();
    const cat = ids.filter(d => pd.catalogados[d]).length;
    const vis = ids.filter(d => pd.vistos[d]).length;
    const pct = Math.round((cat / ids.length) * 100);

    const cabeca = `<div class="pokedex-topo">
      <span class="pokedex-lente"></span>
      <span class="pokedex-luzes"><i></i><i></i><i></i></span>
    </div>
    <div class="dex-leitura">
      <span class="campo"><b>${cat}</b><small>catalogados</small></span>
      <span class="campo"><b>${vis}</b><small>vistos</small></span>
      <span class="campo"><b>${ids.length}</b><small>${nacional ? 'nacional' : 'registros'}</small></span>
      ${c.brilhantes ? `<span class="campo brilho"><b>✦ ${c.brilhantesPegos}/${c.brilhantes}</b><small>brilhantes</small></span>` : ''}
      <span class="pct">${pct}%</span>
    </div>
    <div class="dex-barra"><i style="width:${pct}%"></i></div>`;

    const celas = ids.map(dex => {
      const esp = DEX[dex];
      const num = String(dex).padStart(3,'0');
      const cat = pd.catalogados[dex];
      const vis = pd.vistos[dex];
      const bri = (pd.brilhantes || {})[dex];
      const est = bri ? ` brilho${bri === 'capturado' ? ' pego' : ''}` : '';
      const sel = bri ? '<span class="dex-brilho">✦</span>' : '';
      const arte = d => imgSpriteDex(dex, 'icone', {oculto:!d, classe:'dex-icone'});
      if (cat) return `<button class="dex-cela cat${est}" onclick="UI.dexEntrada(${dex})">
        ${arte(true)}<span class="n">${num}</span><span class="nm">${this.esc(esp.nome)}</span>${sel}</button>`;
      if (vis) return `<button class="dex-cela vis${est}" onclick="UI.dexEntrada(${dex})">
        ${arte(false)}<span class="n">${num}</span><span class="nm">${this.esc(esp.nome)}</span>${sel}
        <span class="marca">visto</span></button>`;
      return `<span class="dex-cela vazia"><span class="n">${num}</span><span class="nm">???</span></span>`;
    }).join('');

    const faixas = nacional
      ? `<div class="dex-faixas">
           <span><b>Kanto</b> ${DEX_KANTO_IDS.concat(pd.catalogados[151] || pd.vistos[151] ? [151] : []).filter(d => pd.catalogados[d]).length}/${DEX_KANTO_IDS.length + (pd.catalogados[151] || pd.vistos[151] ? 1 : 0)}</span>
           <span><b>Johto</b> ${DEX_NACIONAL_IDS.filter(d => d > 151 && pd.catalogados[d]).length}/${DEX_NACIONAL_IDS.filter(d => d > 151).length}</span>
         </div>`
      : '';

    this.modal('', this.abasMochila('pokedex') + cabeca + faixas +
      `<div class="dex-grade">${celas}</div>`, false, 'pokedex');
  },

  /* ficha técnica de um registro */
  dexEntrada(dex){
    const esp = DEX[dex];
    const pd = Estado.pdex();
    const num = String(dex).padStart(3,'0');
    if (!pd.catalogados[dex]){
      return this.modal('', `<div class="pokedex-topo">
          <span class="pokedex-lente"></span>
          <span class="pokedex-luzes"><i></i><i></i><i></i></span>
        </div>
        <div class="dex-ficha">
          <div class="cab"><span class="num">#${num}</span><span class="nomeg">${this.esc(esp.nome)}</span></div>
          <div class="dex-arte">${imgSpriteDex(dex, 'frente', {oculto:true})}</div>
          <div class="nota">Avistado. A Pokédex guardou o número e o nome e mais nada.</div>
        </div>
        <div style="margin-top:12px"><button class="btn" onclick="UI.modalPokedex()">Voltar à lista</button></div>`,
        true, 'pokedex');
    }
    /* a espécie no Pokérole: de onde cada atributo parte e até onde vai */
    const pr = PR_ESPECIE[dex] || [0,1,1,1,1,1,1,1,1,1,1];
    const linha = (k, i) => `<div class="base-linha dupla">
      <span class="k">${NOME_ATRIB[k]}</span>
      <span class="barrinha faixa"><i style="left:${pr[1 + i] * 10}%;width:${(pr[6 + i] - pr[1 + i]) * 10}%"></i></span>
      <span class="v mono">${pr[1 + i]}</span>
      <span class="ind mono">até ${pr[6 + i]}</span></div>`;
    this.modal('', `<div class="pokedex-topo">
        <span class="pokedex-lente"></span>
        <span class="pokedex-luzes"><i></i><i></i><i></i></span>
      </div>
      <div class="dex-ficha">
        <div class="cab"><span class="num">#${num}</span><span class="nomeg">${this.esc(esp.nome)}</span>
          <span style="margin-left:auto">${esp.tipos.map(t=>this.tipoTag(t)).join('')}</span></div>
        <div class="dex-arte">${imgSprite({dex, nome:esp.nome, shiny: Estado.brilhanteDe(dex) === 'capturado'}, 'frente')}</div>

        <h3 class="cat-item">Atributos da espécie</h3>
        ${ATRIBUTOS.map(linha).join('')}
        <div class="nota mono">HP base ${pr[0]} · soma dos máximos ${pr.slice(6).reduce((a, b) => a + b, 0)}</div>

        <h3 class="cat-item">Ficha</h3>
        <div class="linha"><span class="k">Tipos</span><span class="v">${this.esc(esp.tipos.join(' / '))}</span></div>
        <div class="linha"><span class="k">Taxa de captura</span><span class="v">${esp.captura} <span class="fraco">(quanto maior, mais fácil)</span></span></div>
        <div class="linha"><span class="k">Sexo</span><span class="v">${this.esc(proporcaoGenero(dex))}</span></div>
        <div class="linha"><span class="k">Evolução</span><span class="v">${esp.evo
          ? this.esc(DEX[esp.evo].nome) + (esp.nivelEvo ? ' — nível ' + esp.nivelEvo : ' — por pedra ou troca')
          : 'forma final'}</span></div>
        <div class="linha"><span class="k">Classificação</span><span class="v">${esp.lendario ? 'lendário' : 'comum'}</span></div>
        ${Estado.brilhanteDe(dex) ? `<div class="linha"><span class="k">Anomalia cromática</span><span class="v brilho-v">✦ ${Estado.brilhanteDe(dex) === 'capturado' ? 'exemplar brilhante no seu registro' : 'um exemplar brilhante avistado'}</span></div>` : ''}
        <div class="linha"><span class="k">Fraco contra</span><span class="v">${this.esc(this.fraquezas(esp.tipos).join(', ') || '—')}</span></div>
        <div class="linha"><span class="k">Resiste a</span><span class="v">${this.esc(this.resistencias(esp.tipos).join(', ') || '—')}</span></div>

        ${this.dexGolpes(dex)}
      </div>
      <div style="margin-top:12px"><button class="btn" onclick="UI.modalPokedex()">Voltar à lista</button></div>`,
      true, 'pokedex');
  },

  /* Golpes da espécie: a lista de nível é a dos jogos, mas o nome só
     aparece depois que um Pokémon dessa espécie aprendeu o golpe na
     sua mão — o aparelho cadastra o que viu, não o que leu. O nível
     fica à mostra, que é o espaço em branco pedindo pra ser preenchido. */
  dexGolpes(dex){
    const pd = Estado.pdex();
    const sabidos = new Set(((pd.golpes || {})[dex]) || []);
    const lista = (typeof APRENDE !== 'undefined' && APRENDE[dex]) || [];
    if (!lista.length && !sabidos.size) return '';
    const vistos = new Set();
    const linhas = lista.map(([nv, nome]) => {
      vistos.add(nome);
      const g = GOLPES[nome] || {};
      const tem = sabidos.has(nome);
      return `<div class="dex-golpe ${tem ? 'tem' : 'falta'}">
        <span class="nv">${nv <= 1 ? 'início' : 'Nv ' + nv}</span>
        <span class="nm">${tem ? this.esc(nome) : '???'}</span>
        <span class="tp">${tem && g.t ? this.tipoTag(g.t) : ''}</span>
      </div>`;
    }).join('');
    /* golpe que a espécie sabe na sua mão mas não é da lista dela
       (veio de TM, ou da forma anterior antes de evoluir) */
    const fora = [...sabidos].filter(n => !vistos.has(n));
    /* a tabela repete golpe (Ember no início e no 9): conta cada um uma vez */
    const unicos = [...vistos];
    const nTem = unicos.filter(n => sabidos.has(n)).length;
    return `<h3 class="cat-item">Golpes <span class="fraco">· ${nTem} de ${unicos.length} cadastrados</span></h3>
      <div class="dex-golpes">${linhas}</div>
      ${fora.length ? `<div class="nota">Também sabe na sua mão: ${fora.map(n => this.esc(n)).join(', ')}.</div>` : ''}`;
  },

  /* A ficha só cita tipo que o aparelho conhece: Sombrio e
     Metálico não existem para quem ainda está em Kanto. */
  tiposConhecidos(){ return dexNacional() ? TIPOS : TIPOS_KANTO; },
  fraquezas(tipos){
    const T = this.tiposConhecidos();
    return T.filter(t => eficacia(t, tipos) > 1).map(t => t + ' ×' + eficacia(t, tipos));
  },
  resistencias(tipos){
    const T = this.tiposConhecidos();
    return T.filter(t => eficacia(t, tipos) < 1).map(t => t + ' ×' + eficacia(t, tipos));
  },

  modalDiario(){
    const log = Estado.dados.log.slice().reverse();
    const resumo = Historia.resumo().map(l=>`<p class="sussurro" style="margin:3px 0">${this.esc(l)}</p>`).join('');
    this.modal('Diário de campanha', `
      <h3>Onde você está</h3>${resumo}
      <h3>O que aconteceu</h3>
      ${log.length ? log.map(l=>`<div class="linha"><span class="k">Cap ${l.cap} · dia ${l.dia}</span><span style="text-align:right;flex:1">${this.esc(l.texto)}</span></div>`).join('')
                   : '<p class="nada">Nada registrado ainda.</p>'}`);
  },

  modalRota(){
    const d = Estado.dados;
    const percorridos = CAPITULOS.filter(c => c.num <= d.capitulo);
    const pulados = Historia.capitulosPulados();
    this.modal('A sua rota', `
      <div class="linha"><span class="k">Rota narrativa</span><span class="v">${this.esc(NOME_VIA[d.via]||d.via||'neutro')}</span></div>
      <h3>Capítulos vividos</h3>
      ${percorridos.map(c=>`<div class="linha"><span class="k">${c.num}. ${this.esc(c.titulo)}</span><span class="v">${this.esc(c.tom)}</span></div>`).join('')}
      ${pulados.length ? '<h3>O que não aconteceu nesta jornada</h3>' + pulados.map(t=>`<div class="linha"><span class="k">${this.esc(t)}</span><span class="v">—</span></div>`).join('') : ''}
      <h3>Decisões que o mundo registrou</h3>
      ${d.reputacao.historico.length
        ? d.reputacao.historico.slice(-25).map(h=>`<div class="linha"><span class="k">Cap ${h.cap} · ${this.esc(h.motivo)}</span><span class="v" style="color:${h.eixo==='bom'?'var(--bom)':'var(--ruim)'}">${h.eixo} +${h.delta}</span></div>`).join('')
        : '<p class="nada">Nada ainda.</p>'}
    `);
  },

  modalFinais(){
    const codice = Estado.finaisDescobertos();
    const totalFim = CAPITULOS.reduce((n,c)=>n+Object.values(c.cenas).filter(x=>x.final).length,0);
    const totalEp = (typeof EPILOGOS !== 'undefined') ? EPILOGOS.length : 0;
    const eps = codice.filter(f => String(f.id||'').indexOf('ep_') === 0 || /^Epílogo/.test(f.titulo));
    const fins = codice.filter(f => eps.indexOf(f) === -1);
    const bloco = (titulo, lista, total, vazio) =>
      `<h3>${titulo} — ${lista.length} de ${total}</h3>` +
      (lista.length ? lista.map(f=>`<div class="linha"><span class="k">${this.esc(String(f.titulo).replace(/^Epílogo: /,''))}</span><span class="v">✓</span></div>`).join('')
                    : `<p class="nada">${vazio}</p>`);
    this.modal('Códice de finais',
      bloco('Finais', fins, totalFim, 'Nenhum ainda.') +
      bloco('Epílogos', eps, totalEp, 'Nenhum ainda.') +
      `<p class="sussurro">O final é o que aconteceu com Kanto. O epílogo é o que aconteceu com você, e depende do crachá que você carregava, do caminho que Kanto viu você seguir e do que Kanto conta de você.</p>`);
  },

  /* ========================================================
     CREDENCIAIS — o balcão onde se assume posto
     ======================================================== */
  modalCredenciais(lugar){
    /* No balcão do Centro só se pega a licença de treinador. O resto
       se pega no lugar de cada um (delegacia, redação, laboratório…),
       e cada lugar diz o que pede. */
    const quadro = Cargos.quadro();
    const daqui = x => lugar ? x.cargo.lugar === lugar && x.cargo.onde === Mundo.id() : x.cargo.onde === 'centro';
    const meus = lugar ? quadro.filter(x => x.tem && daqui(x)) : quadro.filter(x => x.tem);
    const abertos = quadro.filter(x => !x.tem && x.ok && daqui(x));
    const fechados = quadro.filter(x => !x.tem && !x.ok && daqui(x) && !x.cedo);

    const ben = b => {
      const L = [];
      if (b.renda) L.push(`${fmtDin(b.renda)} ₽ por capítulo`);
      if (b.loja) L.push(`${Math.round((1 - b.loja) * 100)}% de desconto nas lojas`);
      if (b.centro) L.push('Centro Pokémon sem custo');
      if (b.status) L.push(({forca:'Força',percepcao:'Percepção',intelecto:'Intelecto',carisma:'Carisma',sorte:'Sorte',resistencia:'Resistência'}[b.status] || b.status) + ' +1');
      if (b.moral) L.push(`+${b.moral} de moral no time por capítulo`);
      if (b.guarita) L.push('passa em guarita e cerca');
      if (b.fila) L.push('entra onde tem fila');
      if (b.semEspera) L.push('revanche sem espera de capítulo');
      if (b.lei) L.push('voz onde a regra é escrita');
      if (b.repRuim) L.push(`reputação piora ${b.repRuim} por capítulo`);
      return L.join(' · ') || '—';
    };

    const cartao = (x, acao) => `<div class="cargo ${x.tem ? 'meu' : (x.ok ? 'aberto' : 'fechado')}">
      <div class="cargo-topo">
        <span class="cargo-nome">${this.esc(x.cargo.nome)}</span>
        <span class="cargo-orgao">${this.esc(x.cargo.orgao)}</span>
        <span class="cargo-peso">${'●'.repeat(x.cargo.peso)}${'○'.repeat(5 - x.cargo.peso)}</span>
      </div>
      <div class="cargo-resumo">${this.esc(x.cargo.resumo)}</div>
      <div class="cargo-ben mono">${this.esc(ben(x.cargo.beneficios || {}))}</div>
      ${x.cargo.aviso ? `<div class="cargo-aviso">${this.esc(x.cargo.aviso)}</div>` : ''}
      ${acao}
    </div>`;

    const corpo =
      (meus.length ? `<h3>No seu bolso</h3>` + meus.map(x => cartao(x,
        `<button class="btn mini" onclick="Jogo.largarCargo('${x.cargo.id}')">largar</button>`)).join('') : '') +
      (abertos.length ? `<h3>Aberto pra você</h3>` + abertos.map(x => cartao(x,
        `<button class="btn destaque" onclick="Jogo.assumirCargo('${x.cargo.id}')">Assumir</button>`)).join('') : '') +
      (fechados.length ? `<h3>Ainda não</h3>` : '') +
      fechados.map(x => cartao(x, `<ul class="cargo-pede">${Cargos.pedidos(x.cargo).map(p =>
        `<li class="${p.ok ? 'ok' : 'falta'}">${p.ok ? '✓' : '✗'} ${this.esc(p.t)}</li>`).join('')}</ul>`)).join('');

    this.modal(lugar || 'Credenciais', corpo, false, 'credencial');
  },

  telaDoacao(c, avisos){
    this.fecharModal(true);   // o balcão fica por cima da tela se não fechar
    this.npcDaCena = null; this.minhasFalasDaCena = null;
    this.falanteDaCena = null; this.vozesDaCena = null;
    this.limpar();
    this.add(this.topo());
    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">${fmtDin(c.valor)} ₽</div>
        <div class="tit">${this.esc(c.nome)}</div>
        <div class="loc">${this.esc(c.linha)}</div>
      </div>
      <div class="narrativa">${this.narrar(c.texto || [])}</div>
      <div id="avisos" class="avisos"></div>
      <div class="escolhas" style="margin-top:16px">
        <button class="escolha" onclick="Exploracao.tela()">Seguir.</button>
      </div>
    </div>`);
    if (avisos && avisos.length) this.avisos(avisos);
    this.rolarTopo();
  },

  telaCargo(c, avisos){
    this.fecharModal(true);   // o balcão fica por cima da tela se não fechar
    this.npcDaCena = null; this.minhasFalasDaCena = null;
    this.falanteDaCena = c.falante || null; this.vozesDaCena = c.vozes || null;
    this.limpar();
    this.add(this.topo());
    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">${this.esc(c.orgao)}</div>
        <div class="tit">${this.esc(c.nome)}</div>
        <div class="loc">${this.esc(c.resumo)}</div>
      </div>
      <div class="narrativa">${this.narrar(c.fala || [])}</div>
      <div id="avisos" class="avisos"></div>
      <div class="escolhas" style="margin-top:16px">
        <button class="escolha" onclick="Exploracao.tela()">Guardar o crachá e seguir.</button>
      </div>
    </div>`);
    if (avisos && avisos.length) this.avisos(avisos);
    this.rolarTopo();
  },

  /* ========================================================
     TUTORIAL — a apostila. Fica fora da partida, aberta por
     quem quiser estudar, pra que nada precise ser explicado
     no meio da cena.
     ======================================================== */
  modalTutorial(aba){
    const atual = aba || this._abaTutorial || 'passos';
    this._abaTutorial = atual;
    const ABAS = [
      ['passos',   'Primeiros passos'],
      ['comeco',   'Começo'],
      ['ficha',    'A ficha'],
      ['combate',  'Combate'],
      ['natureza', 'Naturezas'],
      ['vinculo',  'Vínculo'],
      ['mundo',    'Mundo'],
      ['pokenav',  'PokéNav'],
      ['risco',    'Risco']
    ];
    const barra = `<div class="tut-abas">${ABAS.map(([k, r]) =>
      `<button class="tut-aba${k === atual ? ' sel' : ''}" onclick="UI.modalTutorial('${k}')">${r}</button>`
    ).join('')}</div>`;

    this.modal('Tutorial', barra + `<div class="tut-corpo">${this.tutorialAba(atual)}</div>`, false, 'tutorial');
  },

  tutorialAba(k){
    const L = (a, b) => `<div class="linha"><span class="k">${a}</span><span class="v">${b}</span></div>`;

    /* passo a passo, na ordem em que as coisas acontecem na primeira hora */
    if (k === 'passos') return `
      <h3>A primeira hora, passo a passo</h3>
      <ol class="tut-passos">
        <li><b>Ficha.</b> Nome, gênero, cidade natal, objetivo e do que você gosta e não gosta. O jogo lê o que você escreveu: o objetivo vira o rumo que abre cada capítulo, e lugar ou Pokémon de que você gosta pesa nos dados e na moral.</li>
        <li><b>O capítulo 1.</b> Você acorda em casa. Leia a cena e toque numa opção — ou escreva o que quer fazer no campo de baixo. Não tem opção certa: tem o que você fez.</li>
        <li><b>O primeiro Pokémon.</b> Os três iniciais saem da Pokébola na sua frente; escolha um e, se quiser, dê um apelido.</li>
        <li><b>A licença.</b> No Centro Pokémon (em Pallet, no laboratório). Com ela, o Centro cura de graça.</li>
        <li><b>O mapa.</b> Fora das cenas você está num lugar: <i>Onde entrar</i> são portas (Centro, loja, ginásio, sua casa), <i>O que fazer</i> gasta o tempo (vasculhar, procurar, treinar, acampar à noite) e <i>Para onde ir</i> leva ao vizinho. O capítulo seguinte aparece em <i>Aqui</i>, na cidade em que ele acontece.</li>
        <li><b>A luta.</b> Lutar escolhe o golpe; Bag usa item (o item primeiro, depois quem recebe); Time troca quem está na frente; Pokédex lê o adversário. Cada golpe rola dados de seis lados: cada 4, 5 ou 6 é um acerto, e a conta aparece no registro da luta.</li>
        <li><b>Quando cair.</b> Pokémon desmaiado volta com Revive ou no Centro. Se o time inteiro cair diante de um selvagem bravo, quem apanha é você.</li>
        <li><b>Ginásio.</b> Na porta do ginásio, na cidade, na ordem que você quiser. O capítulo seguinte pede um mínimo de insígnias, e a porta fechada diz quantas faltam.</li>
        <li><b>Mochila.</b> Itens, Pokédex, PokéNav, Cartão e Mapa moram nas abas da mochila. Regras, este tutorial e o som ficam em Ajustes.</li>
        <li><b>O tempo.</b> Um minuto jogando é uma hora em Kanto. De noite aparecem outros Pokémon e outra gente na estrada.</li>
      </ol>
      <p class="sussurro">O jogo salva sozinho a cada passo. As contas de tudo, com os números, estão em Regras.</p>`;

    if (k === 'comeco') return `
      <h3>O que é isto</h3>
      <p class="sussurro">Um RPG de mesa de Kanto jogado por texto. Você lê uma cena, escolhe o que faz, e o dado decide o que não é só sua vontade. Não existe caminho certo e não existe desfazer: o mundo guarda o que você fez e devolve depois.</p>
      ${L('Escolhas', 'permanentes — o jogo salva sozinho')}
      ${L('Opção que some', 'você já fez aquilo e não tem mais nada ali')}
      ${L('Parar e olhar', 'uma vez por cena — a segunda olhada nunca mostra nada')}
      ${L('Escrever em vez de escolher', 'o campo embaixo das opções aceita qualquer coisa')}
      <p class="sussurro">O campo livre lê o que você escreveu: se bate com uma saída que já existe, ele segue por ela; se não bate, o jogo improvisa e isso conta igual.</p>
      <h3>Criar o personagem</h3>
      ${L('Personalidade', 'texto livre — e ela vale como regra, veja Vínculo')}
      ${L('Gênero', 'o texto inteiro concorda com ele — narração, tratamento, cargo e título')}
      ${L('Quem fica em casa', 'a voz que te acorda e o primeiro número do PokéNav · o parentesco decide como a história fala dessa pessoa · o que ficar em branco é sorteado combinando nome e parentesco')}
      ${L('Inicial clássico', 'nasceu em Pallet: o Professor entrega na rua, na manhã da saída · fora de Pallet: a perua do laboratório, uma vez por mês')}
      ${L('Pokédex e cartão', 'fora de Pallet, os dois saem do Centro da sua cidade, no cadastro · em Pallet, a Pokédex sai da mão do Professor, no laboratório, e o cartão só no Centro de Viridian, que é o primeiro do caminho')}
      ${L('Inicial aleatório', 'já morava na sua casa — vínculo máximo desde o primeiro dia · sai da tabela de inicial: 1d6 escolhe a coluna (1–4, o que vive na sua cidade natal; 5–6, o que combina com o jeito que você escreveu) e 1d6 a linha')}
      ${L('Ritmo do combate', 'Pokérole (o HP do livro) ou prolongado (HP base em dobro)')}`;

    if (k === 'ficha') return `
      <h3>Os seis status</h3>
      ${L('Força', 'escapar de quem te encurralou · testes de cena')}
      ${L('Percepção', 'vasculhar · ler a natureza do seu time · observar · com 3, ler a natureza de quem está do outro lado')}
      ${L('Intelecto', 'a hora de pegar a estrada · andar pela cidade · com Percepção, ler o tipo de um desconhecido em combate (os dois em 4)')}
      ${L('Carisma', 'treinar · encarar um selvagem · ser obedecido com a moral baixa')}
      ${L('Sorte', 'o que o vasculho acha · pescaria · chance de brilhante')}
      ${L('Resistência', 'HP máximo · aguentar o golpe que sobra pra você')}
      <p class="sussurro">Sobem por ponto: 1 no fim de cada capítulo, no máximo +1 por status por capítulo. Alguns cargos e algumas cenas dão um ponto fora disso.</p>
      <h3>Perícia</h3>
      ${L('A rolagem', '1d10 + status + o cinto, contra a dificuldade')}
      ${L('1 a 3', 'fracasso')} ${L('4 a 6', 'parcial')} ${L('7 a 9', 'sucesso')} ${L('10+', 'crítico')}
      <p class="sussurro">Toda rolagem aparece na bandeja de dados, inclusive as que o jogo faz sozinho. O que o cinto soma está na aba Vínculo.</p>
      <h3>Reputação</h3>
      ${L('Como sobe', 'por pontos, não por ato · degraus em 36, 114, 257, 458, 715, 1.030 e 1.430 pontos · um ato vale 1, 3, 6, 10… conforme o tamanho')}
      ${L('Diante de quem manda', 'vale o dobro')}
      ${L('Ginásio, Liga, conselho', 'passa por cima do teto do capítulo')}
      ${L('O mesmo feito', 'conta uma vez por capítulo')}
      <p class="sussurro">Os dois eixos se pagam: enquanto você deve de um lado, o que faz do outro serve primeiro pra quitar.</p>`;

    if (k === 'combate') return `
      <h3>A conta — Pokérole</h3>
      ${L('Os dados', 'parada de d6 · cada 4, 5 ou 6 é um sucesso')}
      ${L('Precisão', 'atributo + perícia · 1 sucesso acerta · dor e precisão baixa tiram')}
      ${L('Dano', 'Força ou Especial + poder + 1 de STAB − Vitalidade ou Instinto · sucesso = 1 de dano')}
      ${L('Tipo', '+1 por fraqueza · −1 por resistência · imune não sofre')}
      ${L('Crítico', 'sobra de 3 sucessos na precisão (mais no posto alto) → +2 dados')}
      ${L('Ordem', 'prioridade · depois 1d6 + Destreza + Alerta')}
      ${L('Fuga', 'Destreza + Atletismo contra os do selvagem')}
      ${L('Sem PP', 'Forcejar: Força + 1, e 1 volta em você')}
      <h3>Na sua vez</h3>
      ${L('Golpe', 'gasta PP · sem PP sobra Forcejar')}
      ${L('Pokébola', 'só em selvagem — não se joga Pokébola no Pokémon de treinador')}
      ${L('Mochila', 'só o que serve em combate aparece')}
      ${L('Pokédex', 'quantas vezes quiser · não gasta o turno')}
      ${L('Trocar', 'gasta o turno')}
      ${L('Substituir quem desmaiou', 'não gasta · o novo entra sem apanhar')}
      <h3>Status</h3>
      ${L('Sono', '5 sucessos de Instinto somados pra acordar')} ${L('Paralisia', '−2 de Destreza')}
      ${L('Queimadura', '1 de dano por turno')} ${L('Veneno', '2 de dano por turno · o grave sobe 2 a cada turno')}
      ${L('Congelamento', '20% de descongelar por turno')} ${L('Confusão', 'tira sucessos · errar tira 1 de HP')}`;

    if (k === 'natureza') {
      const NOMES = {atk:'Força', def:'Vitalidade', spa:'Especial', spd:'Instinto', spe:'Destreza'};
      const linhas = Object.keys(NATUREZAS).map(n => {
        const x = NATUREZAS[n];
        const stats = x.mais ? `pontos puxam pra ${NOMES[x.mais]} · fogem de ${NOMES[x.menos]}` : 'não puxa pra lado nenhum';
        return `<div class="tut-nat${x.agressiva ? ' agressiva' : ''}">
          <span class="tut-nat-nome">${n}</span>
          <span class="tut-nat-stat mono">${stats}</span>
          <span class="tut-nat-traco">${this.esc(x.traco)}</span>
        </div>`;
      }).join('');
      return `
        <h3>As vinte e cinco naturezas</h3>
        <p class="sussurro">A natureza é do indivíduo, não da espécie. Ela decide pra onde vão os pontos de atributo que ele ganha subindo de nível, e mexe no que ele faz quando você manda. As marcadas em vermelho são agressivas: se o seu time cair contra um selvagem assim, ele pode atacar VOCÊ.</p>
        <div class="tut-nats">${linhas}</div>
        <p class="sussurro">Nos seus, a natureza aparece sozinha depois de alguns combates juntos, por um teste de Percepção. Nos dos outros, só com Percepção 3 ou mais, pelo jeito que eles se mexem — a Pokédex lê espécie, tipo e atributos, não temperamento.</p>`;
    }

    if (k === 'vinculo') {
      const nomes = {discricao:'discrição', paciencia:'paciência', coragem:'coragem', simpatia:'simpatia', cuidado:'cuidado'};
      const linhas = Object.keys(TEMPERAMENTO).map(n => {
        const t = TEMPERAMENTO[n];
        const eixos = Object.keys(t).filter(e => t[e] !== 0)
          .map(e => `${t[e] > 0 ? '+' : '−'}${Math.abs(t[e])} ${nomes[e]}`).join(' · ') || 'neutro em tudo';
        return `<div class="tut-nat"><span class="tut-nat-nome">${n}</span><span class="tut-nat-traco mono">${eixos}</span></div>`;
      }).join('');
      return `
        <h3>Moral e obediência</h3>
        ${L('Chance de desobedecer', '(60 − moral) ÷ 2 − insígnias × 3 − Carisma × 1,5')}
        ${L('Afinidade', 'soma ou desconta dessa conta')}
        <p class="sussurro">Moral alta zera a conta sozinha. Além disso, cada natureza tem a sua teimosia própria: tem quem recuse golpe especial, quem hesite em chegar perto, quem ataque antes da ordem e quem erre o alvo de propósito.</p>
        <h3>Os cinco eixos</h3>
        <p class="sussurro">A personalidade que você escreve na ficha e a natureza de cada Pokémon são lidas nos mesmos cinco eixos. O encontro dos dois dá a afinidade, de −10 a +10, e a convivência amacia o desencontro com o tempo.</p>
        ${L('+5 ou mais', 'obedece muito mais fácil · crítico um ponto mais perto · +1 nas perícias')}
        ${L('+2 a +4', 'obedece mais fácil')}
        ${L('−2 a −4', 'obedece pior · −1 nas perícias')}
        ${L('−5 ou menos', 'obedece muito pior · −1 nas perícias')}
        <h3>Como cada natureza pesa fora do combate</h3>
        <p class="sussurro">Numa perícia, o melhor do time naquele eixo soma, o pior desconta metade, e a afinidade de quem vai na frente entra por cima. Percepção pede cuidado, Carisma pede simpatia, Força pede coragem, Intelecto pede paciência.</p>
        <div class="tut-nats">${linhas}</div>`;
    }

    if (k === 'mundo') return `
      <h3>Cidade</h3>
      ${L('Centro Pokémon', 'com licença é de graça · sem licença, 300 ₽ + 250 por ferido')}
      ${L('PC', 'no saguão do Centro — guarda e retira do cinto de seis')}
      ${L('Loja', 'dez cidades · cada uma vende o que a cidade é')}
      ${L('Ginásio', 'a insígnia é permanente e muda quem te obedece')}
      ${L('Situações', 'cidade e rota têm coisa acontecendo por conta própria')}
      ${L('Doação', 'aparece quando existe uma causa que você já conheceu · rende reputação, nunca item')}
      ${L('Como te recebem', 'uma linha no alto da tela que muda com reputação e crachá')}
      <h3>Preço por cidade</h3>
      ${L('Celadon', '0,85× — o mais barato de Kanto, sete andares')}
      ${L('Cais de Vermilion', '0,9× — metade do estoque entra sem imposto')}
      ${L('Pallet, Viridian, Fuchsia', '1×')}
      ${L('Cerulean', '1,05×')} ${L('Lavender', '1,1×')} ${L('Pewter', '1,15×')}
      ${L('Cinnabar', '1,25×')} ${L('Saffron', '1,3× — tudo com nota fiscal')}
      <h3>Cortar, atravessar, voar, forçar, iluminar</h3>
      <div class="linha"><span class="k">Não existe HM</span><span class="v">nenhum Pokémon aprende "Corte" nem "Surf" neste jogo</span></div>
      <div class="linha"><span class="k">Cortar</span><span class="v">machado na mochila · 900 ₽ na ferragem de Pewter e no posto do Safári</span></div>
      <div class="linha"><span class="k">Quebrar pedra</span><span class="v">picareta na mochila · 1.100 ₽ na ferragem de Pewter</span></div>
      <div class="linha"><span class="k">Atravessar água</span><span class="v">Pokémon do tipo Água de porte médio ou grande</span></div>
      <div class="linha"><span class="k">Voar</span><span class="v">Pokémon do tipo Voador de grande porte, e que voe de verdade</span></div>
      <div class="linha"><span class="k">Forçar o que é pesado</span><span class="v">qualquer Pokémon de grande porte</span></div>
      <div class="linha"><span class="k">Enxergar no escuro</span><span class="v">lanterna, que gasta pilha · ou um Pokémon que emita luz, que não gasta</span></div>
      <div class="linha"><span class="k">Onde conferir</span><span class="v">a passagem fechada no mapa diz o que falta (machado, picareta, porte, luz) e quem do time já serve</span></div>
      <p class="sussurro">Metade disso é objeto e metade é o corpo do Pokémon. Machado e picareta são ferramenta de gente: qualquer um compra, ninguém precisa ensinar nada a ninguém. Atravessar, voar e forçar dependem do tamanho de quem está com você — um Pidgey não te levanta por mais nível que tenha, e um Lapras te atravessa no primeiro dia. Luz é a única que tem os dois caminhos: a lanterna resolve e acaba; Lanturn e Ampharos resolvem e não acabam.</p>
      <p class="sussurro">Tem seis lugares no mapa que só abrem assim — um bambuzal plantado na Floresta de Viridian, uma parede de alvenaria dentro do Monte da Lua, o subsolo da Torre de Lavender, a ilhota no meio do rio de Cerulean, um contêiner virado pro muro no pátio de Vermilion e a ilha do sudoeste vista de cima. Nenhum é obrigatório pra terminar a jornada. Todos aparecem na tela mesmo quando você não pode entrar, dizendo o que falta, porque ver a porta fechada é o que faz querer a chave.</p>

      <h3>Perguntar o nome</h3>
      <div class="linha"><span class="k">Quando aparece</span><span class="v">sempre que fala com você alguém que o jogo chama pela função</span></div>
      <div class="linha"><span class="k">Como</span><span class="v">o botão no fim da cena, ou escrevendo "qual é o seu nome?"</span></div>
      <div class="linha"><span class="k">O que muda</span><span class="v">o balão passa a usar o nome — nessa cena e em todas depois</span></div>
      <div class="linha"><span class="k">Custa</span><span class="v">nada: não gasta dia, não muda reputação, não fecha escolha</span></div>
      <div class="linha"><span class="k">Nem todo mundo diz</span><span class="v">alguns recusam, e a recusa é sobre quem eles são</span></div>
      <div class="linha"><span class="k">Quem se apresenta</span><span class="v">crachá, placa, nome pintado na porta: o balão passa a usar o nome sem você perguntar</span></div>
      <p class="sussurro">Este jogo chama quase todo mundo de "a enfermeira", "o barqueiro", "a dona do armazém" — que é como a gente enxerga desconhecido de verdade. Perguntar o nome é a única ação do jogo que não serve pra nada mecanicamente e existe só pra desfazer isso. Uma mesma jornada sempre dá o mesmo nome pra mesma pessoa; jornadas diferentes dão nomes diferentes — menos pra quem a própria cena apresenta, que é sempre quem é.</p>

      <h3>Caminho que a escolha fecha</h3>
      <div class="linha"><span class="k">Boca do Túnel de Pedra</span><span class="v">fechada pra quem virou inimigo dos caçadores da floresta · abre vencendo o caçador que espera ali (a luta aparece na lista da Rota 9 e do túnel) · o outro caminho é por Saffron e pela Rota 8</span></div>
      <div class="linha"><span class="k">Entrada da Ciclovia</span><span class="v">fechada pra quem foi expulso do cassino · abre vencendo o chefe da segurança (em Celadon e na Rota 16) · o outro caminho é por Lavender e pelas Rotas 12 e 13</span></div>
      <div class="linha"><span class="k">Guarita norte de Saffron</span><span class="v">fechada com reputação Ruim 4 ou pior · abre quando a reputação sai daí · as outras três guaritas continuam abertas</span></div>
      <p class="sussurro">Toda barreira tem outro caminho, mais comprido. A porta aparece fechada no mapa e diz quem está nela.</p>

      <h3>Capítulos que podem não acontecer</h3>
      <div class="linha"><span class="k">Quantos</span><span class="v">4 dos 32 são condicionais</span></div>
      <div class="linha"><span class="k">O que abre</span><span class="v">uma coisa que você descobriu antes, não uma insígnia nem um nível</span></div>
      <div class="linha"><span class="k">Se não abrir</span><span class="v">a jornada segue reto e você nunca fica sabendo que existia</span></div>
      <div class="linha"><span class="k">Onde conferir</span><span class="v">"Ver a rota que você percorreu", na tela final, lista "o que não aconteceu nesta jornada"</span></div>
      <p class="sussurro">Quatro capítulos só existem pra quem passou por onde precisava passar: uma casa de portão verde em Cerulean, onze linhas num livro de guarita em Lavender, um fax que chega toda segunda em Celadon e um galpão sem placa na zona industrial de Saffron. Cada um deles nasce de uma cena de abertura específica dos capítulos 6, 7, 9 e 11 — e as aberturas são sorteadas de acordo com o seu estado. Duas jornadas seguidas podem ver capítulos diferentes.</p>

      <h3>Finais e epílogos</h3>
      <div class="linha"><span class="k">Final</span><span class="v">o que aconteceu com Kanto — sai das suas escolhas no fim</span></div>
      <div class="linha"><span class="k">Epílogo</span><span class="v">o que aconteceu com você — sai do crachá, da via e da reputação</span></div>
      <div class="linha"><span class="k">Quem desempata</span><span class="v">crachá fala mais alto que via · via fala mais alto que reputação</span></div>
      <div class="linha"><span class="k">Rodapé</span><span class="v">quem ficou pelo caminho, promessa cumprida, Pokédex, credenciais, lendário no cinto</span></div>
      <div class="linha"><span class="k">Onde a história fecha</span><span class="v">a caverna do norte é um dos nove lugares, não o único</span></div>
      <p class="sussurro">São 49 finais e 20 epílogos, e os dois se combinam: a mesma cena termina diferente pra quem é Líder de Ginásio, pra quem carrega o envelope sem timbre e pra quem não virou nada. O códice guarda os dois em listas separadas.</p>
      <p class="sussurro">Trinta e seis finais estão na caverna do norte e treze estão antes dela, espalhados por oito capítulos. Esses treze não são derrota nem desistência: são escolhas escritas, que só aparecem quando o seu caminho pagou por elas, e que encerram a campanha ali com epílogo e tudo. Assinar um contrato, sentar numa cadeira vazia, assumir um ginásio, voltar pra casa e não sair mais — cada um desses é um fim de verdade, e o jogo não avisa antes qual escolha é qual.</p>

      <h3>O que o crachá muda na história</h3>
      <div class="linha"><span class="k">Opção que só existe com posto</span><span class="v">cais de Vermilion · recepção da Silph · cerca de Fuchsia</span></div>
      <div class="linha"><span class="k">Como o lugar te recebe</span><span class="v">uma linha no alto da tela, que muda com reputação e crachá</span></div>
      <p class="sussurro">Com credencial na mão dá pra entrar pela porta da frente onde antes só dava pra pular a cerca — e o que você acha entrando pela frente não é o mesmo que você acha pulando.</p>

      <h3>Onde o dinheiro vira outra coisa</h3>
      <div class="linha"><span class="k">Doação</span><span class="v">aparece na cidade quando existe uma causa que você conhece</span></div>
      <div class="linha"><span class="k">O que rende</span><span class="v">reputação notória — nada material, nunca</span></div>
      <div class="linha"><span class="k">Uma vez cada</span><span class="v">causa paga não volta a pedir</span></div>
      <p class="sussurro">As causas são pontas soltas que a história deixou e que você só vê depois de ter passado por elas. Quem nunca entrou no museu de Pewter não sabe que tem uma lona no telhado desde 2015.</p>

      <h3>Cargos</h3>
      <div class="linha"><span class="k">O que dá</span><span class="v">renda por capítulo · desconto de loja · Centro sem custo · passagem · status</span></div>
      <div class="linha"><span class="k">Salário</span><span class="v">o maior entre os seus postos, não a soma</span></div>
      <div class="linha"><span class="k">Onde se assume</span><span class="v">no lugar de cada um: licença de treinador no balcão do Centro · Auxiliar, Pesquisador e Professor no laboratório de Pallet · Guarda de rota no posto da Patrulha, em Viridian · Criador na Associação, em Cerulean · Repórter na redação, em Fuchsia · Policial na delegacia, Investigador na Auditoria e Perito na Comissão, em Saffron · Conselheiro na prefeitura de Celadon · Instrutor, Líder e Elite no Planalto · o envelope sem timbre, nos armários do porto de Vermilion</span></div>
      <div class="linha"><span class="k">O que cada um pede</span><span class="v">a lista aparece no lugar, com ✓ no que você já tem e ✗ no que falta</span></div>
      <div class="linha"><span class="k">Idade</span><span class="v">Guarda de rota e Repórter pedem 16 · Policial, Investigador, Perito da Comissão, Instrutor, Líder, Elite, Professor e Conselheiro pedem 18</span></div>
      <div class="linha"><span class="k">Policial de Kanto</span><span class="v">18 anos · 3 insígnias · reputação boa Reconhecido ou mais · ter sido Guarda de rota · 800 ₽ por capítulo, Centro sem custo, passagem e Força +1</span></div>
      <p class="sussurro">Quinze postos, de licença de treinador a conselheiro regional. Cada um pede uma coisa diferente — espécies catalogadas, insígnias, reputação, o time que você leva — e alguns só existem depois de muita estrada. Quem carrega o envelope sem timbre não recebe crachá da Liga, e vice-versa; e esse envelope piora a sua reputação sozinho, todo capítulo.</p>

      <h3>Estrada e tempo</h3>
      ${L('Viagem', 'um dia por trecho do caminho real — não existe teleporte')}
      ${L('O que passa', 'quatro horas por trecho · cada lugar do trajeto fica visitado')}
      ${L('Na cidade', 'cada ação gasta um período do dia, e o dia acaba')}
      <h3>Pokédex e captura</h3>
      ${L('Espécie não catalogada', 'aparece como ???')}
      ${L('O que entra pro time', 'catalogado na hora — captura, troca, presente')}
      ${L('Brilhante', 'cerca de 1 em 1000 · Sorte aperta até 1 em 300')}
      ${L('Troca', 'quem só evolui trocando chega já evoluído na sua mão')}`;

    if (k === 'pokenav') return `
      <h3>A agenda</h3>
      <p class="sussurro">Só entra número que te deram. Quando alguém te dá o dele, aparece pra gravar — e número não gravado não some, fica esperando.</p>
      ${L('Revanche', 'a ligação marca o lugar (a rota, a cidade ou o ginásio onde a pessoa está); chegando lá, "Procurar" começa a luta, com o time subido junto com você')}
      ${L('Favor', 'tem limite de vezes e espera de capítulos')}
      ${L('Depois do último capítulo', 'cada capítulo de espera vira 7 dias')}
      ${L('Missão', 'pedir · cumprir no mundo · ligar de volta pra entregar')}
      ${L('Notícia', 'não rende nada material — muda o que a pessoa pensa de você')}
      <p class="sussurro">Missão entregue não se pede de novo e missão aberta não se entrega antes da hora. Algumas pessoas ligam pra você primeiro: atender custa tempo e não atender custa outra coisa.</p>
      <h3>Cargos</h3>
      <p class="sussurro">Kanto tem postos, e posto é papel assinado: muda o que você paga, o que você recebe todo capítulo, onde você entra, como as pessoas te recebem e com que epílogo a sua história termina. Cada posto se pega no lugar dele — delegacia, redação, laboratório, Planalto —, e o lugar diz o que pede.</p>
      ${L('Peso 1 · cedo', 'Treinador licenciado · Auxiliar de campo')}
      ${L('Peso 2 · meio', 'Guarda de rota · Criador registrado · Repórter credenciado')}
      ${L('Peso 3 · tarde', 'Informante · Policial · Investigador de campo · Pesquisador associado')}
      ${L('Peso 4 · muito tarde', 'Perito da Comissão · Instrutor do Planalto')}
      ${L('Peso 5 · fim', 'Líder de ginásio · Elite dos Quatro · Professor · Conselheiro')}
      ${L('Salário', 'quem tem dois postos recebe o maior, não a soma')}
      ${L('Incompatível', 'crachá da Liga e envelope sem timbre não cabem no mesmo bolso')}`;

    return `
      <h3>Como isso acaba</h3>
      ${L('Final', 'o que aconteceu com Kanto — 36 deles')}
      ${L('Epílogo', 'o que aconteceu com você — 20 deles')}
      ${L('Quem escolhe o epílogo', 'o crachá primeiro, depois a via, depois a reputação')}
      <p class="sussurro">Terminar a campanha duas vezes com as mesmas escolhas e credenciais diferentes dá dois desfechos diferentes. O códice de finais guarda os dois em listas separadas.</p>

      <h3>Morte</h3>
      <p class="sussurro">Em combate normal é desmaio — ele volta. Morte permanente só acontece por escolha narrativa: escudo, abandono, sacrifício, treino forçado, não intervir. O cemitério não esvazia.</p>
      ${L('Treinador com 0 HP', 'fim de jogo permanente')}
      ${L('Pokémon desmaiado', 'volta no Centro')}
      ${L('Pokémon morto', 'não volta nunca')}
      <h3>Quando o seu cai contra um selvagem</h3>
      <p class="sussurro">Se o selvagem tem natureza agressiva, rola-se 1d20: com 10 ou mais ele ataca VOCÊ. Dano = Força dele + 2 em d6, e cada sucesso tira 3 do seu HP. As naturezas agressivas estão marcadas na aba Naturezas.</p>
      <h3>O que não dá pra desfazer</h3>
      ${L('Salvar', 'automático — não existe voltar atrás')}
      ${L('Nova jornada', 'apaga a atual')}
      ${L('Insígnia, morte, reputação', 'ficam')}`;
  },

  modalRegras(){
    this.modal('Regras do sistema', `
      <h3>Como ler esta folha</h3>
      <p class="sussurro">Cada linha é uma regra: à esquerda o que é, à direita a conta. Duas coisas rolam dado, e elas não se misturam: <b>gente e cena</b> rolam 1d10 + o status do treinador contra uma dificuldade; <b>Pokémon brigando</b> rola uma parada de d6 e conta os 4, 5 e 6.</p>
      <div class="exemplo-regra">
        <b>Exemplo de golpe.</b> Seu Charmander (Força 2) usa Scratch (poder 2) num Rattata (Vitalidade 1).
        Precisão: Destreza 2 + Briga 1 = 3d6 → 2, 5, 6 = 2 sucessos (precisa de 1: acertou).
        Dano: Força 2 + poder 2 − Vitalidade 1 = 3d6 → 4, 1, 6 = 2 sucessos = 2 de dano. É essa conta que aparece no registro da luta.
      </div>
      <div class="exemplo-regra">
        <b>Exemplo de teste de cena.</b> Vasculhar pede Percepção contra 5. Você tem Percepção 2 e tira 4 no d10: 4 + 2 = 6, sucesso parcial. Num lugar de que você gosta seria 7, sucesso.
      </div>

      <h3>Combate — Pokérole</h3>
      <p class="sussurro">O combate segue o Pokérole 3.0. Tudo é parada de d6: cada 4, 5 ou 6 é um sucesso. A bandeja mostra cada parada com as faces, e o log mostra a conta.</p>
      <div class="linha"><span class="k">Precisão</span><span class="v">atributo + perícia do golpe · precisa de 1 sucesso</span></div>
      <div class="linha"><span class="k">Precisão baixa</span><span class="v">o golpe tira sucessos: Take Down 2, Sing 3, Horn Drill 5</span></div>
      <div class="linha"><span class="k">Dor</span><span class="v">−1 sucesso com metade do HP ou menos · −2 com 1 de HP</span></div>
      <div class="linha"><span class="k">Crítico</span><span class="v">3 sucessos além do necessário no Iniciante e no Novato · +1 por posto do Regular pra cima · crítico alto e Focus Energy tiram 1 · +2 dados de dano</span></div>
      <div class="linha"><span class="k">Dano</span><span class="v">Força (físico) ou Especial + poder do golpe + 1 de STAB − Vitalidade (físico) ou Instinto (especial) · cada sucesso é 1 de dano</span></div>
      <div class="linha"><span class="k">Zero sucesso</span><span class="v">1 de dano, e só</span></div>
      <div class="linha"><span class="k">Tipo</span><span class="v">+1 por fraqueza · −1 por resistência · imune não sofre nada · golpe que acerta tira pelo menos 1</span></div>
      <div class="linha"><span class="k">Ação dupla e tripla</span><span class="v">Double Kick, Triple Kick… cada acerto rola a sua parada</span></div>
      <div class="linha"><span class="k">Ações sucessivas</span><span class="v">Fury Attack, Pin Missile… 1 acerto e mais 1 por sucesso sobrando na precisão, até 5</span></div>
      <div class="linha"><span class="k">Pelo posto</span><span class="v">Seismic Toss, Night Shade, Psywave: 1, 2, 4, 6, 8 ou 10 dados pelo posto, ignorando a defesa</span></div>
      <div class="linha"><span class="k">Dano fixo</span><span class="v">Dragon Rage 2 · Sonic Boom 1 · Super Fang: dados iguais à metade do HP que sobra, até 10</span></div>
      <div class="linha"><span class="k">Efeito secundário</span><span class="v">dados de chance do livro: pega se algum d6 der 6 (Ember 1 dado, Body Slam 3)</span></div>
      <div class="linha"><span class="k">Ordem</span><span class="v">prioridade primeiro · depois iniciativa: 1d6 na entrada + Destreza + Alerta</span></div>
      <div class="linha"><span class="k">Fuga</span><span class="v">Destreza + Atletismo do seu contra os do selvagem · empate é seu</span></div>
      <div class="linha"><span class="k">Sem PP</span><span class="v">Forcejar: Força + 1 − Vitalidade · você leva 1 de volta</span></div>
      <p class="sussurro">Duas adaptações pro jogo de um golpe por turno. No livro, o Pokémon de posto alto gasta a sobra da precisão em mais ações na mesma rodada; aqui ele age uma vez, então a sobra que vira crítico sobe com o posto. E não existe choque, e a esquiva não sai de graça: no livro ela é uma reação que gasta uma das ações da rodada; aqui, onde cada um age uma vez, ela custa 1 de Vontade.</p>

      <h3>Vontade</h3>
      <p class="sussurro">Os pontos de Vontade (Will) do Pokérole 3.0. Ficam no Pokémon de uma luta pra outra e aparecem como bolinhas na ficha dele; o botão Vontade, no menu da luta, gasta. Os três primeiros valem pro turno que vem e só um deles por turno.</p>
      <div class="linha"><span class="k">Quanto</span><span class="v">Instinto + 2 pontos</span></div>
      <div class="linha"><span class="k">Forçar o destino</span><span class="v">+1 sucesso na precisão do golpe (no livro, Pushing Fate · não vale em dano nem em chance)</span></div>
      <div class="linha"><span class="k">Arriscar</span><span class="v">um dado da precisão que falhou rola de novo (Take Your Chances)</span></div>
      <div class="linha"><span class="k">Esquivar</span><span class="v">quando o golpe do outro acerta: Destreza + Evasão (a perícia do posto) contra os sucessos da precisão dele · empate é seu · golpe social e golpe que não erra não se esquivam</span></div>
      <div class="linha"><span class="k">Aguentar a dor</span><span class="v">ignora uma penalidade de dor até o fim da luta · não ocupa o turno (Power Through the Pain)</span></div>
      <div class="linha"><span class="k">Zerou</span><span class="v">quem gasta toda a Vontade numa luta desmaia quando ela acaba</span></div>
      <div class="linha"><span class="k">Recupera</span><span class="v">toda no Centro e em casa · +2 num dia de treino · +1 por vitória, pra quem está de pé</span></div>
      <div class="linha"><span class="k">Do outro lado</span><span class="v">todo adversário tem Vontade (Instinto + 2) e gasta, selvagem também · Aguentar a dor quando a dor tira dois sucessos · Esquivar com metade do HP ou menos · Forçar o destino quando o golpe é impreciso ou a dor já pesa · Arriscar com golpe forte, atrás do crítico · nunca o último ponto</span></div>
      <div class="linha"><span class="k">Quem gasta mais</span><span class="v">líder, Elite dos Quatro, rival, torneio e veterano gastam sempre que o critério bate na chance cheia · selvagem e treinador de estrada, com metade dessa chance</span></div>
      <h3>Vontade do treinador</h3>
      <div class="linha"><span class="k">Quanto</span><span class="v">2 + Resistência · aparece no topo da tela, do lado do HP</span></div>
      <div class="linha"><span class="k">Gastar</span><span class="v">num teste de cena, rolar gastando 1 de Vontade: +2 no total do d10 (o Forçar o destino do livro, levado pro d10)</span></div>
      <div class="linha"><span class="k">Zerou</span><span class="v">quando a cena acaba você desaba e perde metade do HP que tinha (no livro, desmaia; aqui isso não vira fim de jogo)</span></div>
      <div class="linha"><span class="k">Recupera</span><span class="v">toda no Centro e em casa · +2 num dia de treino</span></div>

      <h3>Atributos do Pokémon</h3>
      <div class="linha"><span class="k">Força · FOR</span><span class="v">dano físico · precisão de golpe de impacto</span></div>
      <div class="linha"><span class="k">Destreza · DES</span><span class="v">precisão da maioria dos golpes · iniciativa · fuga</span></div>
      <div class="linha"><span class="k">Vitalidade · VIT</span><span class="v">desconta do dano físico · soma no HP</span></div>
      <div class="linha"><span class="k">Especial · ESP</span><span class="v">dano especial · precisão de golpe de energia</span></div>
      <div class="linha"><span class="k">Instinto · INS</span><span class="v">desconta do dano especial · acordar · resistir a confusão e paixão</span></div>
      <div class="linha"><span class="k">HP</span><span class="v">HP base da espécie + Vitalidade · de 4 a uns 20</span></div>
      <div class="linha"><span class="k">De onde partem</span><span class="v">o mínimo da espécie no livro · cada espécie tem um teto por atributo</span></div>
      <div class="linha"><span class="k">Pontos por nível</span><span class="v">1 a cada 7 níveis, até 14 no nível 98</span></div>
      <div class="linha"><span class="k">Pra onde vai o ponto</span><span class="v">pro atributo que a espécie mais usa, pesado pelos atributos base dos jogos · a natureza puxa ×1,3 pro que ela sobe e ×0,7 pro que ela desce · nunca passa do teto</span></div>
      <div class="linha"><span class="k">Evoluir</span><span class="v">refaz a conta com o mínimo e o teto da forma nova</span></div>
      <div class="linha"><span class="k">Posto</span><span class="v">Iniciante até o 9 · Novato 10 · Regular 20 · Avançado 35 · Especialista 50 · Ás 65 · Mestre 80 · Campeão 90</span></div>
      <div class="linha"><span class="k">Perícias</span><span class="v">todas no teto do posto: 1 no Iniciante, até 5 do Especialista pra cima</span></div>
      <div class="linha"><span class="k">Golpes pelo posto</span><span class="v">quem nasce no mato ou num time alheio sabe 2 golpes no Iniciante, 3 no Novato e 4 do Regular pra cima · os mais recentes da tabela, sempre com pelo menos um que bate · o seu aprende mais subindo de nível, até 4</span></div>
      <div class="linha"><span class="k">Posto da área</span><span class="v">rota e lugar mostram o posto do que vive ali, pelo nível da área · andar pra frente é subir de posto</span></div>
      <div class="linha"><span class="k">Social e Vontade</span><span class="v">golpe de status que pede atributo social usa 1 + um ponto a cada três · Vontade é Instinto + 2</span></div>
      <p class="sussurro">A Pokédex mostra, na ficha da espécie, de onde cada atributo parte e até onde vai; na ficha de um exemplar escaneado, onde ele está agora.</p>

      <h3>Onde a batalha acontece</h3>
      <p class="sussurro">O fundo do combate não é enfeite: ele sai do lugar. Cada ponto do mapa e cada capítulo têm um ambiente, e cada ambiente tem o seu cenário. Os nove ambientes escritos se agrupam em cinco arenas, que é o que decide o tipo de chão sob os pés. As duas bases embaixo dos lutadores seguem a arena — a sua fica maior e mais perto, a do outro lado menor e mais longe.</p>
      <div class="linha"><span class="k">Grama</span><span class="v">campo · floresta</span></div>
      <div class="linha"><span class="k">Água</span><span class="v">mar, rio, doca e ponte</span></div>
      <div class="linha"><span class="k">Rocha</span><span class="v">caverna · montanha · vulcão</span></div>
      <div class="linha"><span class="k">Piso duro</span><span class="v">cidade · ruína · cemitério</span></div>
      <div class="linha"><span class="k">Quadra</span><span class="v">ginásio, Elite dos Quatro, torneio e Conferência, em qualquer lugar · a exibição marcada na arena central também</span></div>
      <p class="sussurro">Quadra ganha de tudo: se é desafio de líder, Elite ou torneio, o chão é piso oficial, não importa a cidade. Encontro livre no mapa usa o ambiente do ponto onde você está; batalha de cena usa o ambiente do capítulo. Uma cena pode fixar a arena quando a briga acontece num canto que o ambiente do capítulo não descreve.</p>
      <p class="sussurro">Praia e mar são o cenário de água; a ruína é o mato seco que tomou conta da usina; o cemitério é a pedra da torre na luz errada. A quadra é a única arena sem cenário fotografado: ela é desenhada, com arquibancada, refletor e o círculo do meio.</p>

      <h3>Quando ele não faz o que você mandou</h3>
      <div class="linha"><span class="k">Chance de desobedecer</span><span class="v">(60 − moral) ÷ 2 − insígnias × 3 − Carisma × 1,5</span></div>
      <div class="linha"><span class="k">Afinidade</span><span class="v">soma ou desconta dessa conta</span></div>
      <div class="linha"><span class="k">Par no time</span><span class="v">a chance que sobrar cai pela metade</span></div>
      <div class="linha"><span class="k">Moral do inicial</span><span class="v">chega com 50 de 100 · quem já morava na sua casa chega com 100 · o resto vocês constroem juntos</span></div>
      <div class="linha"><span class="k">Fome</span><span class="v">o primeiro dia sem comer não muda nada · depois, −4 de moral a cada 12 horas do relógio do jogo · 24 h: com fome · 48 h: faminto</span></div>
      <div class="linha"><span class="k">Comer</span><span class="v">Centro, casa e toda cura completa alimentam · Ração na mão: um Pokémon, +10 de moral · Alimentar o time (no Seu time): uma Ração pra todos, +2 de moral cada · acampar e treinar gastam uma Ração cada</span></div>
      <p class="sussurro">Moral alta zera a conta sozinha. Além disso, cada natureza tem a sua própria teimosia em combate — tem quem recuse golpe especial, quem hesite em chegar perto, quem ataque antes da ordem e quem use o golpe errado de propósito. O jogo diz na hora qual natureza fez o quê; a lista inteira você monta jogando.</p>
      <h3>Condições</h3>
      <div class="linha"><span class="k">PAR · paralisado</span><span class="v">−2 de Destreza (precisão e iniciativa)</span></div>
      <div class="linha"><span class="k">BRN · queimado</span><span class="v">1 de dano no fim do turno</span></div>
      <div class="linha"><span class="k">PSN · envenenado</span><span class="v">2 de dano no fim do turno · no grave, 2 a mais a cada turno (2, 4, 6…)</span></div>
      <div class="linha"><span class="k">SLP · dormindo</span><span class="v">rola Instinto a cada vez · acorda quando somar 5 sucessos (Rest: 2)</span></div>
      <div class="linha"><span class="k">FRZ · congelado</span><span class="v">20% por turno de descongelar</span></div>
      <p class="sussurro">Tipo Elétrico não paralisa, Fogo não queima, Venenoso e Metálico não envenenam e Gelo não congela. O congelado é regra da casa: no livro ele só sai quebrando o gelo por fora, e numa luta de um contra um isso não acaba nunca.</p>
      <h3>Estágios de atributo</h3>
      <div class="linha"><span class="k">Faixa</span><span class="v">de −6 a +6 · aparece na ficha de HP durante a luta</span></div>
      <div class="linha"><span class="k">FOR, VIT, ESP, INS, DES</span><span class="v">cada estágio é 1 ponto no atributo · nenhum fica abaixo de 1</span></div>
      <div class="linha"><span class="k">Precisão e evasão</span><span class="v">cada estágio é 1 sucesso a mais ou a menos · a precisão de quem ataca contra a evasão de quem apanha</span></div>
      <div class="linha"><span class="k">Efeito de golpe de dano</span><span class="v">nos dados de chance do livro · golpe sem essa ficha segue a chance dos jogos</span></div>

      <h3>Estados que os golpes deixam</h3>
      <div class="linha"><span class="k">Confusão</span><span class="v">2 a 5 turnos · no começo da vez, 2 sucessos de Instinto ignoram · senão −1 sucesso (−2 do Avançado ao Ás, −3 do Mestre pra cima), e golpe que erra tira 1 de quem usou</span></div>
      <div class="linha"><span class="k">Preso</span><span class="v">Wrap, Bind, Clamp, Fire Spin · 2 a 5 turnos · 1 de dano por turno · não foge nem troca</span></div>
      <div class="linha"><span class="k">Leech Seed</span><span class="v">1 de HP por turno vai pra quem plantou · Grama não pega</span></div>
      <div class="linha"><span class="k">Curse</span><span class="v">Fantasma: gasta metade do HP e o outro perde 1/4 por turno · outros: FOR +1, VIT +1, DES −1</span></div>
      <div class="linha"><span class="k">Nightmare</span><span class="v">só em quem dorme · 1/4 do HP por turno enquanto dormir</span></div>
      <div class="linha"><span class="k">Attract</span><span class="v">só entre sexos opostos · o apaixonado bate com metade do dano, a menos que tire 3 sucessos de Instinto</span></div>
      <div class="linha"><span class="k">Disable</span><span class="v">trava o último golpe do outro por 2 a 7 turnos</span></div>
      <div class="linha"><span class="k">Substitute</span><span class="v">custa 1/4 do HP · o boneco apanha no lugar e segura golpe de status</span></div>
      <div class="linha"><span class="k">Protect, Detect, Endure</span><span class="v">agem antes de tudo · Endure fica com 1 de HP · usar seguido: metade da chance a cada vez</span></div>
      <div class="linha"><span class="k">Reflect / Light Screen</span><span class="v">5 turnos pro lado inteiro · +2 de Vitalidade / Instinto contra dano · crítico atravessa</span></div>
      <div class="linha"><span class="k">Mist / Safeguard</span><span class="v">5 turnos · ninguém baixa atributo / nenhuma condição pega, vindo do outro lado</span></div>
      <div class="linha"><span class="k">Haze</span><span class="v">zera os estágios dos dois lados</span></div>
      <div class="linha"><span class="k">Focus Energy</span><span class="v">o crítico pede 1 sucesso a menos</span></div>
      <div class="linha"><span class="k">Foresight</span><span class="v">tira a evasão que subiu · Normal e Lutador passam a acertar Fantasma</span></div>
      <div class="linha"><span class="k">Roar, Whirlwind</span><span class="v">agem por último · em selvagem acabam a luta · em treinador trocam o Pokémon dele</span></div>
      <div class="linha"><span class="k">Teleport</span><span class="v">sai de luta contra selvagem</span></div>
      <div class="linha"><span class="k">Transform</span><span class="v">vira cópia do outro: tipos, atributos (menos HP), golpes com 5 PP e estágios · desfaz no fim</span></div>
      <div class="linha"><span class="k">Mirror Move · Psych Up · Conversion</span><span class="v">repete o último golpe do outro · copia os estágios dele · vira do tipo de um golpe seu</span></div>
      <div class="linha"><span class="k">Swagger</span><span class="v">Força do outro +2 e confusão</span></div>
      <div class="linha"><span class="k">Sleep Talk · Snore</span><span class="v">só dormindo · Sleep Talk sorteia outro golpe seu · Snore pode fazer encolher (30%)</span></div>
      <div class="linha"><span class="k">Fury Cutter</span><span class="v">+1 de poder a cada acerto seguido, até +4</span></div>
      <div class="linha"><span class="k">Self-Destruct · Explosion</span><span class="v">quem usa desmaia no fim do golpe, acertando ou não · se os dois caem juntos, o adversário manda o próximo e você troca o seu</span></div>
      <div class="linha"><span class="k">Return · Frustration</span><span class="v">poder pela moral: 5 com moral 100 · 5 com moral 0 (moral ÷ 20)</span></div>
      <p class="sussurro">Esses estados somem quando o Pokémon sai da luta; Reflect, Light Screen, Mist e Safeguard ficam no lado inteiro até acabar o tempo.</p>

      <h3>Clima</h3>
      <div class="linha"><span class="k">Rain Dance · chuva</span><span class="v">5 turnos · Água +1 de poder · Fogo −1 de dano</span></div>
      <div class="linha"><span class="k">Sunny Day · sol</span><span class="v">5 turnos · Fogo +1 de poder · Água −1 de dano · Solar Beam sem carregar</span></div>
      <div class="linha"><span class="k">Sandstorm · areia</span><span class="v">5 turnos · 1 de dano no fim do turno, menos Pedra, Terrestre e Metálico · Pedra ganha +1 de Instinto</span></div>
      <h3>Captura</h3>
      <div class="linha"><span class="k">Chance</span><span class="v">(3 × HP máx − 2 × HP) ÷ (3 × HP máx) × taxa da espécie × Pokébola × condição ÷ 255</span></div>
      <div class="linha"><span class="k">Condição</span><span class="v">dormindo ou congelado ×2 · outra condição ×1,5</span></div>
      <div class="linha"><span class="k">Sacudidas</span><span class="v">três, cada uma passa com a raiz cúbica da chance: as três juntas dão a chance que aparece no log</span></div>
      <h3>Centro Pokémon</h3>
      <div class="linha"><span class="k">Lá dentro</span><span class="v">enfermeira, PC, balcão de credenciais, mapa na parede e mural de recados</span></div>
      <div class="linha"><span class="k">Sem licença</span><span class="v">a enfermeira cobra 300 ₽ + 250 por Pokémon ferido · com licença, de graça</span></div>
      <div class="linha"><span class="k">No meio de um capítulo</span><span class="v">se ele acontece numa cidade com Centro, dá pra passar lá e voltar pro mesmo ponto da história</span></div>
      <div class="linha"><span class="k">Achado andando</span><span class="v">loja, ginásio, quem quer trocar e o Relembrador de Golpes: nada disso tem placa, você acha andando pela cidade</span></div>
      <h3>Quem aparece onde</h3>
      <div class="linha"><span class="k">Espécie</span><span class="v">cada lugar do mapa tem a sua lista, com o comum e o raro · a de FireRed/LeafGreen, em quase tudo</span></div>
      <div class="linha"><span class="k">Cidade</span><span class="v">o que vem das rotas em volta e da água do porto</span></div>
      <div class="linha"><span class="k">Nunca no mato</span><span class="v">fóssil (só renasce no laboratório), lendário e Porygon</span></div>
      <div class="linha"><span class="k">Nível</span><span class="v">o do lugar, nunca o do seu time · a maioria entre 3 abaixo e 3 acima · 12 em 100 vêm de 3 a 6 abaixo · 8 em 100 vêm de 4 a 9 acima · 3 em 100, a partir do capítulo 2, são um velho do mato: de 14 a 26 acima (no mínimo 20), já evoluído quando a linha evolui por nível — um Raticate de nível 30 na Rota 1</span></div>
      <div class="linha"><span class="k">Forma</span><span class="v">a da tabela do lugar · quem veio acima do lugar e já passou do nível de evoluir aparece evoluído (só evolução por nível: pedra e troca não acontecem no mato)</span></div>
      <div class="linha"><span class="k">Dia e noite</span><span class="v">quem é da noite (Zubat, Gastly, Oddish, Venonat, Meowth, Clefairy, Hoothoot, Murkrow…) aparece o triplo à noite e 1/5 de dia · quem é do dia (Pidgey, Spearow, Caterpie, Weedle, Doduo, Sentret, Ledyba…) aparece 1,5× de dia e 1/5 à noite</span></div>
      <div class="linha"><span class="k">Gente na estrada</span><span class="v">quem treina de dia (garoto, garota, caçador de inseto, campista, nadador, ciclista) some à noite · quem anda de noite (motoqueiro, jogador, médium, guitarrista) só aparece à noite · o resto, a qualquer hora</span></div>
      <p class="sussurro">O que nos jogos era presente ou troca aparece raro, no lugar da história da espécie. Depois que Johto abre, um quarto dos encontros pode ser de lá, pelo tipo do lugar.</p>

      <h3>Objetivo e gostos</h3>
      <div class="linha"><span class="k">Objetivo</span><span class="v">o jogo lê o que você escreveu e guarda o que entendeu: ser campeão, completar a Pokédex, proteger quem precisa, ter poder e dinheiro, crescer com o time, conhecer Kanto ou voltar pra casa com orgulho · aparece na Ficha</span></div>
      <div class="linha"><span class="k">Cada capítulo</span><span class="v">abre com uma linha da sua via (como Kanto te vê) e do seu objetivo · quando a via muda no meio, o capítulo diz que mudou</span></div>
      <div class="linha"><span class="k">A sua linha</span><span class="v">o lado em que você está: o posto de maior peso (Patrulha e Polícia são a Lei, o envelope sem timbre é a Rocket, o Laboratório é a Ciência, o Jornal, a Associação de Criadores, a Liga) ou, sem posto, a via (herói, mercenário, foragido)</span></div>
      <div class="linha"><span class="k">Cenas da linha</span><span class="v">na virada de capítulo, quem é do seu lado te acha: no máximo uma cena por capítulo, em ordem, e cada uma lembra o que você escolheu na anterior · mexem em reputação, dinheiro e moral como qualquer escolha</span></div>
      <div class="linha"><span class="k">Trocar de linha</span><span class="v">a linha que você deixou reage uma vez · a nova começa do começo</span></div>
      <div class="linha"><span class="k">No fim</span><span class="v">o epílogo fecha cada linha em que você viveu alguma coisa, pelo que você escolheu nela</span></div>
      <div class="linha"><span class="k">Lugar de que você gosta</span><span class="v">+1 nos testes de d10 lá dentro (mar, caverna, montanha, floresta, cidade, torre, calor, campo) · de que não gosta, −1</span></div>
      <div class="linha"><span class="k">Pokémon de que você gosta</span><span class="v">pelo tipo ou pelo nome: chega com +10 de moral · o de que você não gosta, −10</span></div>

      <h3>Quem já te conhece</h3>
      <div class="linha"><span class="k">Reencontro</span><span class="v">quem a história registrou e tem opinião 3 ou mais sobre você (pra cima ou pra baixo), ou duas lembranças, te reconhece pelo nome quando aparece num capítulo seguinte · uma vez por capítulo · com a cara que a opinião manda</span></div>

      <h3>Idade e aniversário</h3>
      <div class="linha"><span class="k">Nascimento</span><span class="v">a ficha pede dia, mês e ano · a jornada começa entre 10 e 20 anos, contados no dia em que ela começa</span></div>
      <div class="linha"><span class="k">Idade</span><span class="v">sai da data de nascimento e da data do jogo (a jornada começa em março de 2010) · sobe sozinha no aniversário · aparece na Ficha e no Cartão de Treinador</span></div>
      <div class="linha"><span class="k">Aniversário</span><span class="v">na primeira tela de mapa do dia: quem ficou em casa liga (ou manda carta, sem PokéNav), quem te conhece bem manda parabéns · +1.000 ₽, 2× Super Potion e +5 de moral no time inteiro · uma vez por ano</span></div>
      <div class="linha"><span class="k">Lembrança</span><span class="v">o que a história conta da sua infância conta a partir dos 3 anos: as coisas de casa têm, no máximo, a sua idade menos três</span></div>
      <div class="linha"><span class="k">Responsável</span><span class="v">a licença pede assinatura de responsável abaixo dos 16</span></div>
      <div class="linha"><span class="k">16 anos</span><span class="v">estiva do cais de Vermilion (5h às 11h, paga por Força) · Guarda de rota · Repórter</span></div>
      <div class="linha"><span class="k">18 anos</span><span class="v">cassino de Celadon (aposta pela Sorte) · Polícia, Auditoria, Comissão, Instrutor, Líder de ginásio, Elite, Professor e Conselho · algumas cenas tratam você como adulto</span></div>
      <p class="sussurro">Abaixo da idade, a porta aparece fechada e diz quantos anos pede.</p>

      <h3>Relógio e calendário</h3>
      <div class="linha"><span class="k">Hora</span><span class="v">um minuto de jogo aberto é uma hora em Kanto, e um segundo é um minuto · parado durante a luta e com a janela fora de foco</span></div>
      <div class="linha"><span class="k">Luz</span><span class="v">o céu do cenário segue o relógio, minuto a minuto: madrugada azul e escura, amanhecer rosado, dia claro, pôr do sol laranja · caverna, vulcão e ginásio não mudam</span></div>
      <div class="linha"><span class="k">Período</span><span class="v">madrugada 0h–5h · manhã 6h–11h · tarde 12h–17h · noite 18h–23h</span></div>
      <div class="linha"><span class="k">Sem Relógio</span><span class="v">você só sabe o período, pelo céu · hora, data e dia da semana não aparecem em lugar nenhum</span></div>
      <div class="linha"><span class="k">Com Relógio</span><span class="v">item de mochila (Viridian, Vermilion, Saffron e Celadon) · o alto da tela mostra dia da semana, data e hora</span></div>
      <div class="linha"><span class="k">Calendário</span><span class="v">1º de março é uma segunda · a jornada começa no dia em que a perua do laboratório passa pela sua cidade (Pallet, dia 1) · os meses têm o tamanho de verdade</span></div>
      <div class="linha"><span class="k">Dia marcado</span><span class="v">algumas coisas só acontecem num dia do mês ou da semana, numa faixa de hora e num lugar · quem marca anuncia no mural do Centro · na hora certa, aparece na lista do lugar · cada uma, uma vez por data</span></div>
      <div class="linha"><span class="k">Fazer coisa</span><span class="v">vasculhar, procurar, pescar, andar, conversar e esperar levam o dia pro começo do próximo período · treinar, dois</span></div>
      <div class="linha"><span class="k">Acampar</span><span class="v">só de noite ou de madrugada · acorda às 6h · gasta 1 Ração, e o time janta</span></div>
      <div class="linha"><span class="k">Treinar</span><span class="v">um dia de treino por dia do jogo · gasta 1 Ração, e o time come no fim · entre um treino e outro, ${TREINO_ESPERA_MIN} minutos de verdade, mesmo que o acampamento pule a noite</span></div>

      <h3>Andar pela rota</h3>
      <div class="linha"><span class="k">Entrar ou sair de uma rota</span><span class="v">30% de um treinador dali te parar · se não, teste de Intelecto (dif. 5) e um selvagem sai do mato: 15% no crítico, 25% no sucesso, 35% no parcial, 45% na falha</span></div>
      <div class="linha"><span class="k">Viagem entre capítulos</span><span class="v">uma parada no máximo, num trecho de estrada do caminho: 35% de treinador, e senão a mesma conta do selvagem · depois da briga a viagem continua</span></div>
      <div class="linha"><span class="k">Procurar Pokémon</span><span class="v">20% de ser um treinador em vez de um selvagem</span></div>
      <div class="linha"><span class="k">Vasculhar</span><span class="v">22% de treinador · 15% de selvagem que estava debaixo do que você mexeu</span></div>
      <div class="linha"><span class="k">O que se acha vasculhando</span><span class="v">40% de alguma coisa acontecendo ali (o que acontece depende do tipo de lugar) · senão, teste de Percepção (dif. 5): no sucesso, lugar escondido ou achado do ambiente (item pequeno, ou rastro que acende a espécie na Pokédex), e com Sorte crítica, coisa rara · no parcial, só o rastro</span></div>
      <div class="linha"><span class="k">Treinar</span><span class="v">25% de treinador · 12% de selvagem atraído pelo barulho · a briga vira o treino do dia</span></div>
      <div class="linha"><span class="k">Acampar</span><span class="v">18% de selvagem mexendo na mochila de noite</span></div>
      <div class="linha"><span class="k">Esperar</span><span class="v">15% de treinador · 10% de selvagem</span></div>
      <div class="linha"><span class="k">Repelente</span><span class="v">segura o selvagem · não segura gente</span></div>
      <p class="sussurro">Você não escolhe: acontece. Com o time inteiro caído, ninguém te para.</p>

      <h3>Quem treina na estrada</h3>
      <div class="linha"><span class="k">Onde</span><span class="v">65 treinadores em 23 rotas e lugares, de 1 a 4 por lugar</span></div>
      <div class="linha"><span class="k">Quatro times</span><span class="v">um por escalão de insígnias: 0–1, 2–3, 4–5 e 6–8 · parte do time é sorteada a cada luta (40% por lugar, menos o último)</span></div>
      <div class="linha"><span class="k">Tamanho do time</span><span class="v">sem insígnia, 1 Pokémon · depois, até 2, 3, 3 e 3 por escalão · os três do Caminho da Vitória levam um a mais</span></div>
      <div class="linha"><span class="k">Nível</span><span class="v">o maior entre o do escalão (5, 14, 24 e 34, +2 por insígnia além do mínimo) e o do lugar − 4 · o time inteiro cabe em 2 níveis, o último no topo · alguns treinadores vêm mais pesados</span></div>
      <div class="linha"><span class="k">Forma</span><span class="v">o nível escolhe: o mesmo treinador leva Pidgey no começo e Pidgeot no fim · quem evolui por pedra só aparece a partir do nível 30, por troca ou amizade a partir do 36</span></div>
      <div class="linha"><span class="k">Vencido</span><span class="v">não te para de novo até você subir de escalão · aí volta com o time novo</span></div>
      <div class="linha"><span class="k">Ir atrás</span><span class="v">na rota, dá pra procurar quem ainda não lutou com você neste escalão</span></div>
      <div class="linha"><span class="k">Fuga</span><span class="v">não existe: na estrada, quem cruza o olhar luta</span></div>

      <h3>Veteranos</h3>
      <div class="linha"><span class="k">Onde</span><span class="v">12, cada um num lugar só: Monte da Lua, Cerulean, Vermilion, Lavender, Celadon, Saffron, Rota 16, Fuchsia, Seafoam, Cinnabar, Caminho da Vitória e Planalto Indigo</span></div>
      <div class="linha"><span class="k">Quando aparecem</span><span class="v">com 1 a 8 insígnias, conforme o lugar · o do Planalto, só depois da cadeira do Campeão</span></div>
      <div class="linha"><span class="k">Quem começa</span><span class="v">você: veterano não te para na estrada, você vai atrás dele</span></div>
      <div class="linha"><span class="k">Nível</span><span class="v">o do lugar + 9 · se a média dos seus três mais fortes passou disso, essa média · o time vai de 3 abaixo desse número até ele, o último no topo</span></div>
      <div class="linha"><span class="k">Tamanho do time</span><span class="v">fixo, pelas insígnias que o lugar pede: 3 com 1, 4 com 2–3, 5 com 4–5, 6 com 6 ou mais · voltar mais forte vale a pena</span></div>
      <div class="linha"><span class="k">Golpes</span><span class="v">os de nível da espécie, e o mais fraco trocado por um golpe de TM do dono, quando a espécie aprende</span></div>
      <div class="linha"><span class="k">Escolha do golpe</span><span class="v">todo adversário pega o segundo melhor golpe 22% das vezes · veterano, 8%</span></div>
      <div class="linha"><span class="k">Prêmio</span><span class="v">valor da classe × nível do último Pokémon × 3 · na primeira vitória, uma TM e um item que o veterano carrega</span></div>
      <div class="linha"><span class="k">Perder</span><span class="v">não custa dinheiro · ele continua lá</span></div>
      <div class="linha"><span class="k">Lutar de novo no lugar</span><span class="v">depois da primeira vitória, só pelo gosto: não paga dinheiro · a revanche que paga é a do PokéNav</span></div>
      <div class="linha"><span class="k">Depois de vencer</span><span class="v">dá o número do PokéNav · revanche com time de 6 e +2 níveis · três dias depois ele pode ligar com um convite</span></div>
      <div class="linha"><span class="k">Convite</span><span class="v">aceito na chamada, vira um lugar pra ir no mapa · uma luta, um treino ou outra coisa · perdendo a luta, o convite continua de pé</span></div>
      <div class="linha"><span class="k">Torneio Aberto</span><span class="v">veterano que você venceu pode cair no seu chaveamento, com 3 Pokémon</span></div>

      <h3>Conferência do Planalto Indigo</h3>
      <div class="linha"><span class="k">Quem entra</span><span class="v">só quem sentou na cadeira do Campeão · inscrição de 5.000 ₽</span></div>
      <div class="linha"><span class="k">Chaveamento</span><span class="v">três rodadas · dois veteranos, primeiro os que você já venceu, e na final sempre a dona de três Conferências</span></div>
      <div class="linha"><span class="k">Nível</span><span class="v">a média dos seus três mais fortes + 2 + a rodada, nunca abaixo de 66, 68 e 72 · time de 6</span></div>
      <div class="linha"><span class="k">Entre as rodadas</span><span class="v">dá pra curar o time</span></div>
      <div class="linha"><span class="k">Prêmio</span><span class="v">12.000, 25.000 e 60.000 ₽, com itens · perdendo, 20% do prêmio da rodada · a primeira Conferência vem com uma Master Ball</span></div>
      <h3>Quando o seu Pokémon cai contra um selvagem</h3>
      <p class="sussurro">Se o selvagem tem natureza agressiva (Naughty, Brave, Adamant, Hasty, Impish, Jolly, Naive, Lonely, Rash), rola-se 1d20: com 10+ ele ataca VOCÊ. Dano = Força dele + 2 em d6, e cada sucesso tira 3 do seu HP, que é HP de gente e não de Pokémon. Naturezas passivas não atacam o treinador. A sua barra de vida aparece na arena enquanto isso durar.</p>
      <h3>Nível, golpes e evolução</h3>
      <div class="linha"><span class="k">Experiência por nocaute</span><span class="v">total de base do vencido × nível dele ÷ 22 · ×1,5 se era de treinador</span></div>
      <div class="linha"><span class="k">Diferença de nível</span><span class="v">× ((2 × nível dele + 10) ÷ (nível dele + o seu + 10))^2,5 · bater em quem é bem mais fraco quase não rende</span></div>
      <div class="linha"><span class="k">Treinar</span><span class="v">uma vez por dia · rende até 5 níveis acima da área e menos a cada nível acima dela · Carisma decide quanto</span></div>
      <div class="linha"><span class="k">Divisão</span><span class="v">por igual entre quem entrou contra aquele adversário e ainda está de pé</span></div>
      <div class="linha"><span class="k">Exp. Share</span><span class="v">quem segura fica com metade, mesmo sem entrar · quem lutou divide a outra metade</span></div>
      <div class="linha"><span class="k">PP Up</span><span class="v">+1/5 do PP base de um golpe, pra sempre · até 3 vezes no mesmo golpe</span></div>
      <div class="linha"><span class="k">Próximo nível</span><span class="v">nível³ × 0,08 + nível × 12 + 20</span></div>
      <div class="linha"><span class="k">Golpe de nível</span><span class="v">aprende todos os que a espécie aprende naquele nível, pela tabela dela</span></div>
      <div class="linha"><span class="k">Selvagem e de treinador</span><span class="v">os quatro últimos golpes da tabela da espécie até o nível dele</span></div>
      <div class="linha"><span class="k">Já sabe quatro</span><span class="v">você escolhe qual esquecer, ou desiste do novo</span></div>
      <div class="linha"><span class="k">Evolução</span><span class="v">no fim da batalha, depois de Continuar · Parar adia pro próximo nível</span></div>
      <div class="linha"><span class="k">Relembrador de golpes</span><span class="v">Cerulean, Celadon e Planalto Indigo · 1.000 ₽ por golpe aprendido</span></div>
      <p class="sussurro">A pergunta do golpe novo aparece na hora, na própria tela de batalha. A tabela é a da espécie atual, como nos jogos: o que a forma anterior aprendia fica pra trás na evolução. O Relembrador ensina qualquer golpe de nível que a espécie já passou e que ele não sabe mais, e só cobra quando o golpe fica. A Pokédex cadastra cada golpe que um Pokémon da espécie aprende com você; os outros aparecem como ???.</p>

      <h3>TM</h3>
      <div class="linha"><span class="k">Quais</span><span class="v">44 das 50 de Red/Blue e as 37 de Gold/Silver que não repetem golpe, cada uma com o número dos jogos dela</span></div>
      <div class="linha"><span class="k">Quem aprende</span><span class="v">a tabela de TM da espécie nos jogos de Game Boy</span></div>
      <div class="linha"><span class="k">Uso</span><span class="v">fora de batalha, pela mochila · some ao ensinar · desistiu, ela fica</span></div>
      <div class="linha"><span class="k">Onde</span><span class="v">Grande Loja de Celadon, 2º andar · prêmio de seis líderes de ginásio e dos doze veteranos</span></div>
      <div class="linha"><span class="k">Gold/Silver</span><span class="v">Sunny Day, Rain Dance e Sandstorm desde o começo · as outras com a Pokédex Nacional</span></div>

      <h3>Fim da batalha</h3>
      <div class="linha"><span class="k">Log</span><span class="v">resultado, fala do adversário, dinheiro e captura que foi pro PC</span></div>
      <div class="linha"><span class="k">Líder de ginásio</span><span class="v">prêmio do ginásio · revanche: 900 + 420 por insígnia</span></div>
      <div class="linha"><span class="k">Torneio</span><span class="v">o prêmio da rodada · perdendo, 30% dele</span></div>
      <div class="linha"><span class="k">Rival da Rota 1</span><span class="v">perder custa 800 ₽ · às vezes ganhar rende 3.000</span></div>
      <div class="linha"><span class="k">Rival que você fez na estrada</span><span class="v">perder custa 700 ₽, ou 1.200</span></div>
      <div class="linha"><span class="k">Campeão</span><span class="v">80.000 ₽</span></div>
      <div class="linha"><span class="k">Treinador de cena</span><span class="v">valor da classe × nível do último Pokémon dele · se a cena já te paga, é esse o prêmio</span></div>
      <div class="linha"><span class="k">Treinador de estrada</span><span class="v">a mesma conta · perdendo, você paga a ele o que ele te pagaria</span></div>
      <div class="linha"><span class="k">Veterano</span><span class="v">a mesma conta × 3, só na primeira vitória · perdendo, nada</span></div>
      <div class="linha"><span class="k">Conferência do Planalto Indigo</span><span class="v">o prêmio da rodada · perdendo, 20% dele</span></div>
      <div class="linha"><span class="k">Valor por classe</span><span class="v">o de Red/Blue: 10 (Bug Catcher) a 99 (líder e Elite) · sem classe, 20</span></div>
      <div class="linha"><span class="k">Captura com o time cheio</span><span class="v">vai direto pro PC</span></div>
      <p class="sussurro">A tela não fecha sozinha: nada anda até você apertar Continuar.</p>

      <h3>Vocês dois</h3>
      <p class="sussurro">A personalidade que você escreveu na ficha e a natureza de cada Pokémon são lidas nos mesmos cinco eixos: discrição, paciência, coragem, simpatia e cuidado. O encontro dos dois dá a afinidade, de −10 a +10, e a convivência amacia o desencontro com o tempo.</p>
      <div class="linha"><span class="k">+5 ou mais</span><span class="v">obedece muito mais fácil · crítico um ponto mais perto · +1 nas perícias</span></div>
      <div class="linha"><span class="k">+2 a +4</span><span class="v">obedece mais fácil</span></div>
      <div class="linha"><span class="k">−2 a −4</span><span class="v">obedece pior · −1 nas perícias</span></div>
      <div class="linha"><span class="k">−5 ou menos</span><span class="v">obedece muito pior · −1 nas perícias</span></div>
      <p class="sussurro">Quem vai na frente é quem pesa nas perícias. O jogo não diz qual natureza combina com qual traço, e não avisa antes de uma tarefa que tipo de Pokémon ela pede: isso é pra reparar, não pra consultar.</p>
      <h3>Sexo</h3>
      <p class="sussurro">Todo Pokémon nasce macho (♂), fêmea (♀) ou sem sexo, na proporção dos jogos, e fica assim pra sempre — evoluir não muda. A ficha da espécie na Pokédex mostra a proporção. Sexo não mexe em atributo nem em jeito: o jeito é a natureza. A história fala dele como ele é, e algumas cenas reparam nisso.</p>
      <div class="linha"><span class="k">Proporção</span><span class="v">meio a meio na maioria · 7♂ pra 1♀ nos iniciais, fósseis, Eevee, Togepi e Snorlax · 3♂ pra 1♀ em Growlithe, Abra, Machop, Elekid, Magby · 1♂ pra 3♀ em Clefairy, Vulpix, Jigglypuff, Snubbull</span></div>
      <div class="linha"><span class="k">Sem sexo</span><span class="v">Magnemite, Voltorb, Staryu, Ditto, Porygon, Unown e os lendários</span></div>
      <div class="linha"><span class="k">Attract</span><span class="v">só pega em sexo oposto · sem sexo não se apaixona nem apaixona</span></div>
      <div class="linha"><span class="k">Par</span><span class="v">mesma linha de evolução (os dois Nidoran contam como uma) e sexos opostos, no mesmo time · cada um tem um par só</span></div>
      <div class="linha"><span class="k">Par no time</span><span class="v">desobedece metade do que desobedeceria</span></div>
      <div class="linha"><span class="k">Par cai na luta</span><span class="v">o outro entra com FOR +1 e ESP +1, uma vez por luta · vale pro time do adversário também</span></div>
      <div class="linha"><span class="k">Par solto</span><span class="v">quem fica perde 10 de moral</span></div>
      <div class="linha"><span class="k">Par morre</span><span class="v">quem fica perde 20 de moral</span></div>
      <h3>Morte</h3>
      <p class="sussurro">Em combate normal é desmaio — ele volta. Morte permanente só acontece por escolha narrativa: escudo, abandono, sacrifício, treino forçado, não intervir. Treinador com 0 HP = fim de jogo permanente.</p>
      ${Object.values(Estado.dados.lendarios||{}).some(l=>l.encontros) ? `
      <h3>Captura de lendários</h3>
      <p class="sussurro">${Estado.dados.flags.bola_fraca_em_lendario ? 'Poké Ball e Great Ball não funcionam — você viu.' : 'Pokébola comum parece não bastar, mas você ainda não testou.'}
      ${Estado.dados.flags.ultra_prende_lendario ? 'Ultra Ball: 1d20, só 1–2 prendem.' : ''}
      ${Estado.dados.flags.master_quase_sempre ? 'Master Ball normalmente captura.' : ''}
      ${Object.values(Estado.dados.lendarios||{}).some(l=>l.quebrouBola) ? 'E existem coisas que simplesmente quebram a Pokébola no ar.' : ''}</p>` : ''}
      <h3>Perícias</h3>
      <p class="sussurro">Parar e olhar vale uma vez por cena: a segunda olhada nunca mostrou nada.</p>
      <p class="sussurro">1d10 + status + o cinto, contra a dificuldade. 1–3 fracasso · 4–6 parcial · 7–9 sucesso · 10+ crítico. Toda rolagem aparece na bandeja de dados, inclusive as que o jogo faz sozinho.</p>
      <p class="sussurro">O cinto conta porque cada perícia puxa um eixo — Percepção pede cuidado, Carisma pede simpatia, Força pede coragem, Intelecto pede paciência. O melhor do time naquele eixo soma, o pior desconta metade, e a afinidade de quem vai na frente entra por cima. A linha embaixo do resultado mostra a soma e quem ajudou; por que aquele ajudou é com você.</p>
      <div class="linha"><span class="k">Força</span><span class="v">fugir de um selvagem que te encurralou · testes de cena</span></div>
      <div class="linha"><span class="k">Percepção</span><span class="v">vasculhar · ler a natureza do seu time · observar a cena · testes · com 3, ler a natureza de quem está do outro lado</span></div>
      <div class="linha"><span class="k">Intelecto</span><span class="v">escolher a hora de pegar a estrada · andar pela cidade · com Percepção, ler o tipo de um desconhecido em combate (os dois em 4)</span></div>
      <div class="linha"><span class="k">Carisma</span><span class="v">treinar · encarar um selvagem · o time obedecer quando a moral está baixa</span></div>
      <div class="linha"><span class="k">Sorte</span><span class="v">o que o vasculho acha · pescaria · chance de brilhante</span></div>
      <div class="linha"><span class="k">Resistência</span><span class="v">HP máximo · aguentar o golpe que sobra pra você · dormir no chão</span></div>
      <h3>Reputação</h3>
      <div class="linha"><span class="k">Como sobe</span><span class="v">por pontos, não por ato</span></div>
      <div class="linha"><span class="k">Ato pequeno</span><span class="v">1 ponto — precisa de oito para o primeiro degrau</span></div>
      <div class="linha"><span class="k">Diante de quem manda</span><span class="v">vale o dobro</span></div>
      <div class="linha"><span class="k">Ginásio, Liga, conselho</span><span class="v">vale muito mais e não tem teto</span></div>
      <div class="linha"><span class="k">Teto por capítulo</span><span class="v">o que passa dele conta por 15%</span></div>
      <div class="linha"><span class="k">O mesmo feito</span><span class="v">conta uma vez por capítulo</span></div>
      <div class="linha"><span class="k">Líder que recusa</span><span class="v">Misty volta a aceitar o desafio com reputação Boa 4, Erika com Boa 5, Sabrina com Boa 6</span></div>
      <div class="linha"><span class="k">Saffron</span><span class="v">com menos de 3 insígnias, Sabrina recebe quem aparecer · da terceira em diante, a Silph é tomada e o ginásio fecha até a Silph (capítulo 11) se resolver</span></div>
      <p class="sussurro">Consertar a calha da vizinha é uma coisa boa e não é notícia. Reputação é o que Kanto conta sobre você, então só muda de degrau o que foi grande o bastante para ser contado — ou o que aconteceu na frente de quem conta. Cada capítulo tem um teto: fazer tudo o que dá num capítulo rende mais que fazer metade, mas não rende o dobro, porque Kanto só fala de você na medida em que te viu. Ginásio e Liga passam por cima do teto — isso é notícia em qualquer altura. Os dois eixos se pagam: enquanto você deve de um lado, o que você faz do outro serve primeiro para quitar.</p>

      <h3>O que você sabe</h3>
      <div class="linha"><span class="k">Espécie não catalogada</span><span class="v">aparece como ???</span></div>
      <div class="linha"><span class="k">Troca de novo</span><span class="v">a primeira troca de cada pessoa é a da história, sempre a mesma · depois ela troca de novo: até 3 propostas sorteadas por dia, cada uma pedindo um Pokémon comum daquele lugar e oferecendo um comum de outro canto de Kanto, no nível do lugar ± 3 · fechou uma, as outras do dia somem · e passa o número, pra você ligar e perguntar do que foi com ela</span></div>
      <div class="linha"><span class="k">Apelido do seu</span><span class="v">quem chega por captura ou presente pode ganhar um, na hora (até 12 letras) · quem chega por troca fica com o nome que veio</span></div>
      <div class="linha"><span class="k">Pokémon de treinador com apelido</span><span class="v">só o apelido</span></div>
      <div class="linha"><span class="k">Depois de apontar a Pokédex</span><span class="v">Apelido (Espécie)</span></div>
      <div class="linha"><span class="k">Ler a Pokédex em combate</span><span class="v">quantas vezes quiser · não gasta o turno</span></div>
      <div class="linha"><span class="k">Ordem do time</span><span class="v">em Seu time, segure meio segundo num Pokémon e arraste · o primeiro da lista é quem entra na briga</span></div>
      <div class="linha"><span class="k">Na luta</span><span class="v">Time e Mochila do alto da tela ficam trancados: troca e item são pela barra de ações, e gastam o turno · as Pokébolas na ficha mostram quem de cada lado ainda está de pé</span></div>
      <div class="linha"><span class="k">Comprar</span><span class="v">a loja pergunta antes de cobrar</span></div>
      <div class="linha"><span class="k">Pokédex de Kanto</span><span class="v">150 casas · o 151 e os lendários de Johto que cruzam Kanto só ganham casa depois que a Pokédex registra um deles · a Nacional mostra os 251</span></div>
      <div class="linha"><span class="k">O que entra pro seu time</span><span class="v">catalogado na hora</span></div>
      <p class="sussurro">A natureza é do indivíduo, não da espécie. Nos seus, ela aparece sozinha depois de alguns combates juntos, por um teste de Percepção — quanto mais tempo com você, mais fácil. Nos dos outros, só com Percepção 3 ou mais: aí você lê pelo jeito que eles se mexem, sem dado, quando entram. A Pokédex lê espécie, tipo e atributos, não temperamento, e treinador nenhum entrega o temperamento do próprio time.</p>
      <p class="sussurro">O tipo de quem está do outro lado fica escondido até a espécie estar catalogada. Sem Pokédex, só Percepção 4 e Intelecto 4 juntos leem o tipo de um desconhecido. Espécie já catalogada não se cadastra de novo: a Pokédex só abre a ficha.</p>

      <h3>Brilhantes</h3>
      <div class="linha"><span class="k">Frequência</span><span class="v">cerca de 1 em 1000</span></div>
      <div class="linha"><span class="k">Sorte</span><span class="v">cada ponto aperta a conta — no máximo, 1 em 300</span></div>
      <div class="linha"><span class="k">Atributos</span><span class="v">idênticos aos da espécie</span></div>
      <p class="sussurro">A cor é a única diferença, e é a diferença inteira. Um brilhante avistado fica marcado na Pokédex mesmo que escape; capturado, a marca muda. Evoluir não tira a cor.</p>

      <h3>PokéNav</h3>
      <div class="linha"><span class="k">No aparelho</span><span class="v">chamada recebida, ligação que você faz, mensagem e recado de quem é do seu lado acontecem dentro do PokéNav, por cima da tela · guardar o aparelho volta pra onde você estava</span></div>
      <div class="linha"><span class="k">Forfeit</span><span class="v">contra treinador não se foge: desiste · conta como derrota (com o que a derrota já custa ali) · multa de arena de 60 ₽ por nível de quem está em campo do lado de lá · −5 de moral no time inteiro</span></div>
      <div class="linha"><span class="k">Recarregar</span><span class="v">a luta continua de onde parou, no mesmo turno · recarregar na tela do Continuar mostra o mesmo resultado de novo</span></div>
      <div class="linha"><span class="k">Na luta</span><span class="v">não dá pra ligar · chamada que toca no meio da luta espera ela acabar e toca depois · item só pelo Bag, gastando o turno</span></div>
      <div class="linha"><span class="k">Agenda</span><span class="v">só entra número que te deram · você grava na hora ou depois</span></div>
      <div class="linha"><span class="k">Revanche</span><span class="v">ninguém luta pelo telefone: a ligação marca o lugar (a rota de quem é de rota, o ginásio do líder, a cidade de quem mora nela, uma rota do lado de onde você está pra quem vive na estrada) · chegando lá, aparece "Procurar" · o time vem subido junto com você · vencer dá +1 de reputação</span></div>
      <div class="linha"><span class="k">Ligação que você faz</span><span class="v">acontece dentro do PokéNav, por cima do que você estava fazendo · desligar volta pra agenda</span></div>
      <div class="linha"><span class="k">Favor</span><span class="v">tem limite de vezes e espera de capítulos</span></div>
      <div class="linha"><span class="k">Depois do último capítulo</span><span class="v">cada capítulo de espera vira 7 dias</span></div>
      <div class="linha"><span class="k">Missão</span><span class="v">pedir · cumprir no mundo · ligar de volta pra entregar</span></div>
      <div class="linha"><span class="k">Notícia</span><span class="v">não rende nada material · muda o que a pessoa pensa de você</span></div>
      <div class="linha"><span class="k">Gente da estrada</span><span class="v">19 dos treinadores de rota passam o número na primeira vez que perdem pra você · a revanche vem com o time de quem tem duas insígnias a mais, e +2 de nível</span></div>
      <div class="linha"><span class="k">Gente da história</span><span class="v">quem gostou de você o bastante passa o número depois do capítulo em que vocês se conheceram</span></div>
      <p class="sussurro">Missão entregue não se pede de novo, e missão aberta não se entrega antes da hora. Algumas pessoas ligam pra você primeiro — atender custa tempo e não atender custa outra coisa. Quem te dá o número não explica quem é: isso está na conversa em que você conheceu a pessoa.</p>

      <h3>De onde vem o seu primeiro</h3>
      <div class="linha"><span class="k">Qual dos três</span><span class="v">você escolhe na hora, com os três fora da Pokébola, na sua frente · nenhuma vem escolhida</span></div>
      <div class="linha"><span class="k">Nasceu em Pallet</span><span class="v">o Professor traz a bandeja pra rua, na manhã em que você sai de casa</span></div>
      <div class="linha"><span class="k">Nasceu em qualquer outra</span><span class="v">a perua do laboratório passa uma vez por mês</span></div>
      <div class="linha"><span class="k">O que já morava na casa</span><span class="v">não passa por ninguém: já é seu</span></div>
      <div class="linha"><span class="k">Onde a jornada começa</span><span class="v">na cidade em que você nasceu · quem nasceu longe de Pallet e Viridian tem, na rodoviária da cidade, o ônibus da Liga até Viridian, uma vez, se quiser · com licença a passagem é de graça, sem licença custa 500 ₽</span></div>
      <div class="linha"><span class="k">Sua casa</span><span class="v">na sua cidade natal · cura o time inteiro e você, de graça, e a noite passa</span></div>
      <div class="linha"><span class="k">Pallet</span><span class="v">não tem Centro Pokémon nem loja · o cadastro de treinador é no laboratório do Professor</span></div>
      <p class="sussurro">Bulbasaur, Charmander e Squirtle saem de Pallet numa caixa térmica, uma fileira de cada. Quem assina a inscrição é quem é responsável por você; a espécie ninguém escolhe no papel. Se a manhã acabar sem você na frente da caixa, a Pokébola que o laboratório separou te espera no balcão do Centro (em Pallet, na porta de casa). Quem não aparece vira duas letras no caderno. A volta é mensal e a perua não deixa de passar por chuva.</p>

      <h3>Loja</h3>
      <div class="linha"><span class="k">Onde</span><span class="v">nove cidades (Pallet não tem loja) · cada uma vende o que a cidade é</span></div>
      <div class="linha"><span class="k">Como nos jogos</span><span class="v">Poké Ball e Potion desde Viridian · Repelente a partir de Cerulean · Super Potion a partir de Vermilion · Great Ball e Revive a partir de Lavender e Celadon · Ultra Ball em Fuchsia e Cinnabar · Full Heal em Fuchsia, Saffron e Cinnabar · Hyper Potion em Saffron e Cinnabar</span></div>
      <div class="linha"><span class="k">Preço</span><span class="v">base × o multiplicador da cidade</span></div>
      <div class="linha"><span class="k">Mais barato</span><span class="v">Celadon (0,85×) e o cais de Vermilion (0,9×)</span></div>
      <div class="linha"><span class="k">Mais caro</span><span class="v">Saffron (1,3×) e Cinnabar (1,25×)</span></div>
      <p class="sussurro">Pewter não vende Pokébola barata e Lavender não vende repelente, porque ninguém de Lavender vai pro mato. Pedra evolutiva só em quem tem: Celadon tem quase tudo, Cerulean tem a da Água, Cinnabar tem a do Fogo. O que a Pokédex Nacional destrava também aparece na prateleira depois.</p>

      <h3>Cortar, atravessar, voar, forçar, iluminar</h3>
      <div class="linha"><span class="k">Não existe HM</span><span class="v">nenhum Pokémon aprende "Corte" nem "Surf" neste jogo</span></div>
      <div class="linha"><span class="k">Cortar</span><span class="v">machado na mochila · 900 ₽ na ferragem de Pewter e no posto do Safári</span></div>
      <div class="linha"><span class="k">Quebrar pedra</span><span class="v">picareta na mochila · 1.100 ₽ na ferragem de Pewter</span></div>
      <div class="linha"><span class="k">Atravessar água</span><span class="v">Pokémon do tipo Água de porte médio ou grande</span></div>
      <div class="linha"><span class="k">Voar</span><span class="v">Pokémon do tipo Voador de grande porte, e que voe de verdade</span></div>
      <div class="linha"><span class="k">Forçar o que é pesado</span><span class="v">qualquer Pokémon de grande porte</span></div>
      <div class="linha"><span class="k">Enxergar no escuro</span><span class="v">lanterna, que gasta pilha · ou um Pokémon que emita luz, que não gasta</span></div>
      <div class="linha"><span class="k">Onde conferir</span><span class="v">a passagem fechada no mapa diz o que falta (machado, picareta, porte, luz) e quem do time já serve</span></div>
      <p class="sussurro">Metade disso é objeto e metade é o corpo do Pokémon. Machado e picareta são ferramenta de gente: qualquer um compra, ninguém precisa ensinar nada a ninguém. Atravessar, voar e forçar dependem do tamanho de quem está com você — um Pidgey não te levanta por mais nível que tenha, e um Lapras te atravessa no primeiro dia. Luz é a única que tem os dois caminhos: a lanterna resolve e acaba; Lanturn e Ampharos resolvem e não acabam.</p>
      <p class="sussurro">Tem seis lugares no mapa que só abrem assim — um bambuzal plantado na Floresta de Viridian, uma parede de alvenaria dentro do Monte da Lua, o subsolo da Torre de Lavender, a ilhota no meio do rio de Cerulean, um contêiner virado pro muro no pátio de Vermilion e a ilha do sudoeste vista de cima. Nenhum é obrigatório pra terminar a jornada. Todos aparecem na tela mesmo quando você não pode entrar, dizendo o que falta, porque ver a porta fechada é o que faz querer a chave.</p>

      <h3>Perguntar o nome</h3>
      <div class="linha"><span class="k">Quando aparece</span><span class="v">sempre que fala com você alguém que o jogo chama pela função</span></div>
      <div class="linha"><span class="k">Como</span><span class="v">o botão no fim da cena, ou escrevendo "qual é o seu nome?"</span></div>
      <div class="linha"><span class="k">O que muda</span><span class="v">o balão passa a usar o nome — nessa cena e em todas depois</span></div>
      <div class="linha"><span class="k">Custa</span><span class="v">nada: não gasta dia, não muda reputação, não fecha escolha</span></div>
      <div class="linha"><span class="k">Nem todo mundo diz</span><span class="v">alguns recusam, e a recusa é sobre quem eles são</span></div>
      <div class="linha"><span class="k">Quem se apresenta</span><span class="v">crachá, placa, nome pintado na porta: o balão passa a usar o nome sem você perguntar</span></div>
      <p class="sussurro">Este jogo chama quase todo mundo de "a enfermeira", "o barqueiro", "a dona do armazém" — que é como a gente enxerga desconhecido de verdade. Perguntar o nome é a única ação do jogo que não serve pra nada mecanicamente e existe só pra desfazer isso. Uma mesma jornada sempre dá o mesmo nome pra mesma pessoa; jornadas diferentes dão nomes diferentes — menos pra quem a própria cena apresenta, que é sempre quem é.</p>

      <h3>Insígnias que a estrada cobra</h3>
      <div class="linha"><span class="k">Capítulo 6, Cerulean</span><span class="v">1 insígnia</span></div>
      <div class="linha"><span class="k">Capítulo 8, Vermilion</span><span class="v">2</span></div>
      <div class="linha"><span class="k">Capítulo 10, a Usina</span><span class="v">3</span></div>
      <div class="linha"><span class="k">Capítulo 11, a Silph</span><span class="v">3 · antes disso a Rocket não chegou a Saffron</span></div>
      <div class="linha"><span class="k">Capítulo 12, Fuchsia</span><span class="v">4</span></div>
      <div class="linha"><span class="k">Capítulo 14, Cinnabar</span><span class="v">5</span></div>
      <div class="linha"><span class="k">Capítulo 17, Rota 23</span><span class="v">6</span></div>
      <div class="linha"><span class="k">Capítulo 22, Planalto Indigo</span><span class="v">8</span></div>
      <div class="linha"><span class="k">Rota 23 → Caminho da Vitória</span><span class="v">8 · as guaritas não deixam subir com menos</span></div>
      <div class="linha"><span class="k">Enquanto falta</span><span class="v">o capítulo aparece no lugar, fechado, dizendo quantas faltam · ele não começa até você ter as que faltam</span></div>
      <div class="linha"><span class="k">Nível do líder</span><span class="v">pela faixa de insígnias que você tem (base 10 com 0–1, 18 com 2–3, 28 com 4–5, 40 com 6 ou mais, + a dificuldade do ginásio, + 3 por insígnia dentro da faixa) · nunca abaixo da área do capítulo em que você está − 8 · cada Pokémon da fila um nível acima, o ás +2</span></div>
      <div class="linha"><span class="k">Ginásio que não te aceita</span><span class="v">se nenhum ginásio que falta está aberto pra você (recusou, trancado), a porta abre com o que você tem</span></div>
      <p class="sussurro">Os capítulos condicionais (29 a 32) não cobram insígnia. Ginásio se desafia na porta dele, na cidade, na ordem que você quiser.</p>

      <h3>Caminho que a escolha fecha</h3>
      <div class="linha"><span class="k">Boca do Túnel de Pedra</span><span class="v">fechada pra quem virou inimigo dos caçadores da floresta · abre vencendo o caçador que espera ali (a luta aparece na lista da Rota 9 e do túnel) · o outro caminho é por Saffron e pela Rota 8</span></div>
      <div class="linha"><span class="k">Entrada da Ciclovia</span><span class="v">fechada pra quem foi expulso do cassino · abre vencendo o chefe da segurança (em Celadon e na Rota 16) · o outro caminho é por Lavender e pelas Rotas 12 e 13</span></div>
      <div class="linha"><span class="k">Guarita norte de Saffron</span><span class="v">fechada com reputação Ruim 4 ou pior · abre quando a reputação sai daí · as outras três guaritas continuam abertas</span></div>
      <p class="sussurro">Toda barreira tem outro caminho, mais comprido. A porta aparece fechada no mapa e diz quem está nela.</p>

      <h3>Capítulos que podem não acontecer</h3>
      <div class="linha"><span class="k">Quantos</span><span class="v">4 dos 32 são condicionais</span></div>
      <div class="linha"><span class="k">O que abre</span><span class="v">uma coisa que você descobriu antes, não uma insígnia nem um nível</span></div>
      <div class="linha"><span class="k">Se não abrir</span><span class="v">a jornada segue reto e você nunca fica sabendo que existia</span></div>
      <div class="linha"><span class="k">Onde conferir</span><span class="v">"Ver a rota que você percorreu", na tela final, lista "o que não aconteceu nesta jornada"</span></div>
      <p class="sussurro">Quatro capítulos só existem pra quem passou por onde precisava passar: uma casa de portão verde em Cerulean, onze linhas num livro de guarita em Lavender, um fax que chega toda segunda em Celadon e um galpão sem placa na zona industrial de Saffron. Cada um deles nasce de uma cena de abertura específica dos capítulos 6, 7, 9 e 11 — e as aberturas são sorteadas de acordo com o seu estado. Duas jornadas seguidas podem ver capítulos diferentes.</p>

      <h3>Finais e epílogos</h3>
      <div class="linha"><span class="k">Final</span><span class="v">o que aconteceu com Kanto — sai das suas escolhas no fim</span></div>
      <div class="linha"><span class="k">Epílogo</span><span class="v">o que aconteceu com você — sai do crachá, da via e da reputação</span></div>
      <div class="linha"><span class="k">Quem desempata</span><span class="v">crachá fala mais alto que via · via fala mais alto que reputação</span></div>
      <div class="linha"><span class="k">Rodapé</span><span class="v">quem ficou pelo caminho, promessa cumprida, Pokédex, credenciais, lendário no cinto</span></div>
      <div class="linha"><span class="k">Onde a história fecha</span><span class="v">a caverna do norte é um dos nove lugares, não o único</span></div>
      <p class="sussurro">São 49 finais e 20 epílogos, e os dois se combinam: a mesma cena termina diferente pra quem é Líder de Ginásio, pra quem carrega o envelope sem timbre e pra quem não virou nada. O códice guarda os dois em listas separadas.</p>
      <p class="sussurro">Trinta e seis finais estão na caverna do norte e treze estão antes dela, espalhados por oito capítulos. Esses treze não são derrota nem desistência: são escolhas escritas, que só aparecem quando o seu caminho pagou por elas, e que encerram a campanha ali com epílogo e tudo. Assinar um contrato, sentar numa cadeira vazia, assumir um ginásio, voltar pra casa e não sair mais — cada um desses é um fim de verdade, e o jogo não avisa antes qual escolha é qual.</p>

      <h3>O que o crachá muda na história</h3>
      <div class="linha"><span class="k">Opção que só existe com posto</span><span class="v">cais de Vermilion · recepção da Silph · cerca de Fuchsia</span></div>
      <div class="linha"><span class="k">Como o lugar te recebe</span><span class="v">uma linha no alto da tela, que muda com reputação e crachá</span></div>
      <p class="sussurro">Com credencial na mão dá pra entrar pela porta da frente onde antes só dava pra pular a cerca — e o que você acha entrando pela frente não é o mesmo que você acha pulando.</p>

      <h3>Onde o dinheiro vira outra coisa</h3>
      <div class="linha"><span class="k">Doação</span><span class="v">aparece na cidade quando existe uma causa que você conhece</span></div>
      <div class="linha"><span class="k">O que rende</span><span class="v">reputação notória — nada material, nunca</span></div>
      <div class="linha"><span class="k">Uma vez cada</span><span class="v">causa paga não volta a pedir</span></div>
      <p class="sussurro">As causas são pontas soltas que a história deixou e que você só vê depois de ter passado por elas. Quem nunca entrou no museu de Pewter não sabe que tem uma lona no telhado desde 2015.</p>

      <h3>Cargos</h3>
      <div class="linha"><span class="k">O que dá</span><span class="v">renda por capítulo · desconto de loja · Centro sem custo · passagem · status</span></div>
      <div class="linha"><span class="k">Salário</span><span class="v">o maior entre os seus postos, não a soma</span></div>
      <div class="linha"><span class="k">Onde se assume</span><span class="v">no lugar de cada um: licença de treinador no balcão do Centro · Auxiliar, Pesquisador e Professor no laboratório de Pallet · Guarda de rota no posto da Patrulha, em Viridian · Criador na Associação, em Cerulean · Repórter na redação, em Fuchsia · Policial na delegacia, Investigador na Auditoria e Perito na Comissão, em Saffron · Conselheiro na prefeitura de Celadon · Instrutor, Líder e Elite no Planalto · o envelope sem timbre, nos armários do porto de Vermilion</span></div>
      <div class="linha"><span class="k">O que cada um pede</span><span class="v">a lista aparece no lugar, com ✓ no que você já tem e ✗ no que falta</span></div>
      <div class="linha"><span class="k">Idade</span><span class="v">Guarda de rota e Repórter pedem 16 · Policial, Investigador, Perito da Comissão, Instrutor, Líder, Elite, Professor e Conselheiro pedem 18</span></div>
      <div class="linha"><span class="k">Policial de Kanto</span><span class="v">18 anos · 3 insígnias · reputação boa Reconhecido ou mais · ter sido Guarda de rota · 800 ₽ por capítulo, Centro sem custo, passagem e Força +1</span></div>
      <p class="sussurro">Quinze postos, de licença de treinador a conselheiro regional. Cada um pede uma coisa diferente — espécies catalogadas, insígnias, reputação, o time que você leva — e alguns só existem depois de muita estrada. Quem carrega o envelope sem timbre não recebe crachá da Liga, e vice-versa; e esse envelope piora a sua reputação sozinho, todo capítulo.</p>

      <h3>Estrada e tempo</h3>
      <div class="linha"><span class="k">Viagem entre capítulos</span><span class="v">um dia por trecho do caminho real</span></div>
      <div class="linha"><span class="k">O que passa</span><span class="v">quatro horas por trecho · cada lugar do trajeto fica visitado</span></div>
      <div class="linha"><span class="k">Centro Pokémon</span><span class="v">de graça com licença · sem licença, 300 ₽ + 250 por ferido</span></div>
      <div class="linha"><span class="k">Mapa</span><span class="v">com o Mapa de Kanto, na aba Mapa da mochila, ou na parede de qualquer Centro Pokémon · Kanto inteira, toda cidade e toda rota com nome · lugar que não está em mapa nenhum só aparece depois que você descobre</span></div>
      <div class="linha"><span class="k">Tocar num lugar</span><span class="v">mostra o que ele é, com o que liga, se tem Centro e se você já foi · loja e ginásio só aparecem depois que você acha andando · vizinho: botão de ir · cidade longe onde você já pisou: botão de voar, se der</span></div>
      <div class="linha"><span class="k">Voar pelo mapa</span><span class="v">com um Voador de grande porte que voe de verdade · até qualquer cidade onde você já pisou · um período do dia</span></div>
      <p class="sussurro">Entre um capítulo e outro não existe teleporte: você atravessa cada rota e cada cidade entre onde estava e onde vai, e o relógio corre por isso. Voar pelo mapa só vale andando pelo mundo, entre cidades que você já conhece. Cidades e rotas têm situações acontecendo por conta própria, independentes do capítulo — quem passa sem olhar não vê.</p>

      <h3>Trocas</h3>
      <div class="linha"><span class="k">Onde</span><span class="v">algumas cidades e algumas rotas · nunca em todas</span></div>
      <div class="linha"><span class="k">O que vale</span><span class="v">o que o outro pede · troca feita não desfaz</span></div>
      <div class="linha"><span class="k">Evolução por troca</span><span class="v">chega já evoluído na sua mão</span></div>
      <p class="sussurro">Quem só evolui trocando evolui no ato da troca: o Haunter que sai da mão do outro chega como Gengar na sua. O que chega entra na Pokédex na hora.</p>

      <h3>Item segurado</h3>
      <div class="linha"><span class="k">Quantos</span><span class="v">1 por Pokémon</span></div>
      <div class="linha"><span class="k">Onde</span><span class="v">aba Time → equipar · ou Mochila → equipar</span></div>
      <p class="sussurro">Trocar devolve o anterior à mochila. O efeito de cada um está escrito na ficha técnica do item, em letra de máquina.</p>

      <h3>Dados</h3>
      <p class="sussurro">Toda rolagem do combate aparece na tela como dado de verdade, com o motivo embaixo. Dá pra clicar em qualquer um pra ver ele girar de novo — o resultado não muda, já está registrado. A bandeja embaixo é só pra girar por girar: não afeta nada.</p>`);
  }
};
