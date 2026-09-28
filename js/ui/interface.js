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
  limpar(){ this.app.innerHTML = ''; },
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
  barraHP(p){
    const pct = Math.max(0, (p.hp / p.hpMax) * 100);
    const cls = pct > 50 ? '' : (pct > 22 ? 'medio' : 'baixo');
    return `<div class="barra ${cls}"><i style="width:${pct}%"></i></div>
            <div class="hp-num">${p.hp} / ${p.hpMax} HP</div>`;
  },

  /* ---------- barra superior ---------- */
  /* o lugar onde você está, atrás de tudo */
  pintarCenario(){
    const url = (typeof Arenas !== 'undefined' && Arenas.cenarioDaTela) ? Arenas.cenarioDaTela() : null;
    const b = document.body;
    if (url){ b.style.setProperty('--cenario-lugar', `url("${url}")`); b.classList.add('com-cenario'); }
    else { b.style.removeProperty('--cenario-lugar'); b.classList.remove('com-cenario'); }
  },

  topo(){
    const d = Estado.dados;
    this.pintarCenario();
    if (!d) return '';
    const rep = Estado.nomeRep();
    const cap = Historia.capitulo(d.capitulo);
    return `<div class="topo">
      <div>
        <h1>${this.esc(d.jogador.nome)} — ${this.esc(rep)}</h1>
        <div class="sub">${d.local && LOCAIS[d.local] ? this.esc(LOCAIS[d.local].nome) : 'Kanto'} ·
          ${this.esc(d.relogio.periodo || 'manhã')} do dia ${d.relogio.dia} ·
          HP ${d.jogador.hp}/${Estado.hpMaxJogador()} · ${fmtDin(d.jogador.dinheiro)} ₽</div>
      </div>
      <div class="topo-acoes">
        <button class="btn mini" onclick="UI.modalTime()">Time</button>
        <button class="btn mini" onclick="UI.modalItens()">Mochila</button>
        ${(d.flags.tem_cartao && d.flags.tem_pokedex) ? '<button class="btn mini" onclick="UI.modalCartao()">Cartão</button>' : ''}
        <button class="btn mini" onclick="UI.modalFicha()">Ficha</button>
        ${d.flags.tem_pokedex ? '<button class="btn mini" onclick="UI.modalPokedex()">Pokédex</button>' : ''}
        ${Estado.temPokenav() ? `<button class="btn mini${Estado.numerosDisponiveis().length ? ' pisca' : ''}" onclick="UI.modalNav()">PokéNav${
          Estado.numerosDisponiveis().length ? ' <b>' + Estado.numerosDisponiveis().length + '</b>' : ''}</button>` : ''}
        <button class="btn mini" onclick="UI.modalDiario()">Diário</button>
        <button class="btn mini" onclick="UI.modalTutorial()">Tutorial</button>
        <button class="btn mini" onclick="UI.modalRegras()">Regras</button>
        <button class="btn mini som${somLigado() ? '' : ' mudo'}" onclick="UI.alternarSom(this)"
          aria-pressed="${somLigado() ? 'false' : 'true'}" title="Gritos dos Pokémon">${somLigado() ? 'Som' : 'Mudo'}</button>
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
        Você tem quinze anos e vai sair de casa hoje.
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
      <div class="sussurro" id="f-inicial-desc">Tradição: você não começa com ele. Bulbasaur, Charmander ou Squirtle — a escolha é na hora, com as três bolas na sua frente. Em Pallet, quem traz é o Professor; em outra cidade, a perua do laboratório.</div>

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
    grupo('f-inicial', v => {
      document.getElementById('f-inicial-desc').textContent = v === 'rand'
        ? 'Aleatório: um Pokémon de 1ª Geração, primeiro estágio. Ele já morava na sua casa quando você decidiu sair — não é seu de papel, é seu de convivência. Vínculo máximo.'
        : 'Tradição: você não começa com ele. Bulbasaur, Charmander ou Squirtle — a escolha é na hora, com as três bolas na sua frente. Em Pallet, quem traz é o Professor; em outra cidade, a perua do laboratório.';
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
      inicial:sel('f-inicial'), ritmo:sel('f-ritmo'),
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
        return `<div class="fala${tom}${meu}${repete ? ' segue' : ''}">
          <div class="fala-quem">${repete ? '' : this.retratoFala(f.quem)}${this.esc(f.quem)}</div>
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
        html += `<div class="fala${quem ? '' : ' anonima'}${meu}${repete ? ' segue' : ''}">`
              + (quem ? `<div class="fala-quem">${lado === 'voce' || repete ? '' : this.retratoFala(quem)}${this.esc(quem)}</div>` : '')
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
    const paras = this.narrar(cena.texto);
    this.vozesDaCena = null;      // vale só pro texto da própria cena

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
  },

  avisos(lista){
    const c = document.getElementById('avisos');
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
            ${this.esc(nomeExib(p))} — Nv ${p.nivel}, ${this.esc(p.natureza)}, moral ${p.moral}</button>`));
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

  alternarSom(bt){
    const liga = !somLigado();
    try { localStorage.setItem('jc-som', liga ? '1' : '0'); } catch (e) {}
    if (bt){ bt.textContent = liga ? 'Som' : 'Mudo'; bt.classList.toggle('mudo', !liga); bt.setAttribute('aria-pressed', liga ? 'false' : 'true'); }
  },

  /* rosto de quem fala, quando o jogo tem um (js/data/treinadores.js) */
  retratoFala(quem){
    const r = (typeof retratoDe === 'function') ? retratoDe(quem) : null;
    return r ? `<img class="fala-retrato" src="${r}" alt="" onerror="this.remove()">` : '';
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
      return `<div class="lutador ${cls}${fixo}${entrando}">
        <div class="arte">${fundo}${arte}${Batalha.clima ? `<div class="clima-camada clima-${Batalha.clima.tipo}" aria-hidden="true"></div>` : ''}</div>
        <div class="ficha">
          ${vida}
          <div class="nome"><span>${this.esc(nomeVisivel(p))}${this.shi(p)}</span><span class="nv">Nv ${p.nivel}</span></div>
          <div class="linha-tipos" style="margin-top:5px">${tipos}${p.status ? this.etiquetaStatus(p.status) : ''}</div>
          <div class="marcas-luta">${this.marcasHTML(Batalha.marcas ? Batalha.marcas(meu ? 'aliado' : 'inimigo') : [])}</div>
          ${this.barraHP(p)}
          ${meu ? this.barraExp(p) : ''}
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

       1 ARCO      ball_closed girando numa parábola de Bézier, do
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
    const TAM = 36;
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
    const abrir  = () => tocar(cima, [{transform:'rotate(0deg)'}, {transform:'rotate(-62deg)'}], 140);
    const fechar = () => tocar(cima, [{transform:'rotate(-62deg)'}, {transform:'rotate(0deg)'}], 120);
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
    const esconderAlvo = () => { if (alvo) alvo.style.visibility = 'hidden'; };

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
        await esperar(260);
        await brilhar();
        await esperar(280);
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
          <span>Jogar bola</span><span class="pd">Capturar agora</span></button>`));
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

    const bt = (cls, rot, nota, acao, off) =>
      `<button class="mb-btn ${cls}" ${off ? 'disabled' : ''} ${off ? '' : 'onclick="' + acao + '"'}>
        <span class="rot">${rot}</span><span class="nota">${nota}</span></button>`;

    const dex = d.flags.tem_pokedex
      ? `<div class="mb-linha centro">${bt('dex', 'Pokédex',
          'lê o adversário · não gasta o turno',
          "Jogo.acaoBatalha({tipo:'pokedex'})")}</div>`
      : '';

    c.appendChild(this.el(`<div class="menu-batalha">
      <div class="mb-linha">
        ${bt('lutar', 'Lutar', `golpes de ${this.esc(nomeExib(a))}`, 'UI.abrirGolpes()')}
        ${bt('bag', 'Bag', itens ? `${bolas ? bolas + (bolas === 1 ? ' tipo de bola · ' : ' tipos de bola · ') : ''}${itens} ${itens === 1 ? 'item' : 'itens'}` : 'nada que sirva aqui', 'UI.menuBag()', !itens)}
      </div>
      <div class="mb-linha">
        ${bt('time', 'Time', vivos ? `${vivos} em pé no banco` : 'ninguém mais em pé', 'UI.menuTroca()', !vivos)}
        ${bt('fugir', 'Fugir', Batalha.fuga ? 'Destreza + Atletismo' : 'daqui não se foge',
             "Jogo.acaoBatalha({tipo:'fugir'})", !Batalha.fuga)}
      </div>
      ${dex}
    </div>`));
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
      return d.time.filter(p=>!p.morto).map(p =>
        `<button class="escolha com-item" onclick="UI.fecharModal();UI.modoBatalha='menu';Jogo.acaoBatalha({tipo:'item',nome:'${n}',alvoUid:'${p.uid}'})">
          ${imgItem(n)}${this.esc(n)} ×${Estado.contaItem(n)} → ${this.esc(nomeExib(p))}${this.shi(p)} (${p.hp}/${p.hpMax})</button>`).join('');
    }).join('');
    const corpo =
      (contraTreinador ? '<p class="sussurro" style="margin:0 0 10px">As bolas ficam no fundo da mochila: não se joga bola no Pokémon de outro treinador.</p>' : '') +
      (linhasBolas ? '<h3>Bolas</h3>' + linhasBolas : '') +
      (linhasItens ? '<h3>Itens</h3>' + linhasItens : '') +
      (guardados > 0 ? `<p class="sussurro" style="margin:10px 0 0">${guardados} ${guardados === 1 ? 'objeto fica guardado' : 'objetos ficam guardados'} — papel, crachá e afins não servem de nada aqui.</p>` : '');
    this.modal('Mochila', (linhasBolas || linhasItens) ? corpo
      : corpo + '<p class="nada">Nada que sirva agora.</p>');
  },

  /* ========================================================
     ESCANEAMENTO — a Pokédex leva três segundos e apita
     ======================================================== */
  escaneamento(){
    const alvo = Batalha.inimigo;
    const r = Batalha.acao({tipo:'pokedex'});
    const erro = (r.eventos || []).find(e => e.tipo === 'erro');
    if (erro){ this.escreverLog(r.eventos); this.acoesCombate(); return; }

    const esp = DEX[alvo.dex];
    const num = String(alvo.dex).padStart(3, '0');

    this.modal('', `<div class="pokedex-topo">
        <span class="pokedex-lente lendo"></span>
        <span class="pokedex-luzes lendo"><i></i><i></i><i></i></span>
      </div>
      <div class="dex-scan" id="dex-scan">
        <div class="alvo">
          <span class="silhueta${alvo.shiny ? ' brilho' : ''}">${imgSprite(alvo, 'frente', {oculto:true, classe:'scan-arte'})}</span>
          <span class="varredura"></span>
        </div>
        <div class="linhas mono" id="dex-scan-linhas"></div>
        <div class="dex-barra lendo"><i id="dex-scan-barra" style="width:0%"></i></div>
      </div>`, true, 'pokedex');

    const passos = [
      'travando alvo…',
      `silhueta #${num}`,
      'lendo estrutura de tipo…',
      'amostrando temperamento…',
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
        <div class="nota">Nível ${p.nivel} · ${{m:'macho · ', f:'fêmea · '}[generoDe(p)] || 'sem sexo · '}${this.esc(p.natureza)}</div>
        ${p.shiny ? '<div class="nota brilho-v">✦ Anomalia cromática. A ficha é a mesma; a cor não.</div>' : ''}
        ${nat.agressiva ? `<div class="nota alerta">Temperamento agressivo: se o seu time cair, ${pron(p).ele} não recua.</div>` : ''}

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
      <div class="narrativa">${this.narrar(ev.texto)}</div>
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
        } = ${r.rolagem.total} · dif ${r.rolagem.dificuldade}</span>
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

  /* O telefone tocando: você atende ou não, e não atender custa. */
  telaChamada(c){
    const contato = contatoPorId(c.de);
    const falas = (typeof c.falas === 'function' ? c.falas(Estado.dados) : c.falas) || [];
    const opcoes = (c.escolhas || []).map((o, i) => ({o, i}))
      .filter(({o}) => { try { return !o.cond || o.cond(Estado.dados); } catch(e){ return false; } });
    this.limpar();
    this.add(this.topo());
    this.add(`<div class="painel">
      <div class="cap-cabecalho chamando">
        <div class="num"><span class="nav-antena"></span> POKÉNAV · CHAMADA RECEBIDA</div>
        <div class="tit">${this.esc(contato ? textoContato(contato,'nome') : 'Número desconhecido')}</div>
        <div class="loc">${this.esc(contato ? (textoContato(contato,'papel') || textoContato(contato,'cidade') || '') : '')}</div>
      </div>
      <div class="narrativa">${this.narrar(falas)}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas">
        ${opcoes.map(({o, i}) => `<button class="escolha" onclick="Jogo.responderChamada('${c.id}',${i})">
          ${this.esc(txt(o.texto))}</button>`).join('')}
        <button class="escolha recusar" onclick="Jogo.recusarChamada('${c.id}')">Não atender.</button>
      </div>
    </div>`);
    this.rolarTopo();
  },

  telaResultadoChamada(r){
    const contato = contatoPorId(r.chamada.de);
    this.limpar();
    this.add(this.topo());
    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">POKÉNAV · CHAMADA</div>
        <div class="tit">${this.esc(contato ? textoContato(contato,'nome') : '')}</div>
        <div class="loc">${r.recusou ? 'não atendida' : this.esc(txt(r.esc.texto)).slice(0, 70)}</div>
      </div>
      <div class="narrativa">${r.recusou
        ? this.narrar(['O aparelho toca oito vezes e para.',
            'Você olha o nome na tela o tempo inteiro e não atende, o que é diferente de não ouvir.',
            'Ele não vai ligar de novo hoje.'])
        : this.narrar(r.esc.resultado || [])}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas" style="margin-top:16px">
        <button class="escolha" onclick="Jogo.voltarDaLigacao()">Guardar o aparelho.</button>
      </div>
    </div>`);
    if (r.avisos && r.avisos.length) this.avisos(r.avisos);
    this.rolarTopo();
  },

  /* Tela de uma ligação: a conversa acontece e você volta de onde veio. */
  telaLigacao(c, falas, avisos){
    this.limpar();
    this.add(this.topo());
    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">PokéNav · chamada</div>
        <div class="tit">${this.esc(c ? textoContato(c,'nome') : 'Chamada')}</div>
        <div class="loc">${this.esc(c ? (textoContato(c,'papel') || textoContato(c,'cidade') || '') : '')}</div>
      </div>
      <div class="narrativa">${this.narrar(falas)}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas" style="margin-top:18px">
        <button class="escolha" onclick="Jogo.voltarDaLigacao()">Desligar.</button>
      </div>
    </div>`);
    if (avisos && avisos.length) this.avisos(avisos);
    this.rolarTopo();
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

    this.modal('', `
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
      const r = Estado.podeLigar(c.id, serv);
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
    this.fecharModal();
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
      return this.modal('Bolas', '<p class="nada">Não se joga bola no Pokémon de outro treinador.</p>');
    const bolas = Object.keys(Estado.dados.itens).filter(n => (ITENS_INFO[n]||{}).tipo === 'bola');
    if (!bolas.length) return this.modal('Mochila', '<p class="nada">Você não tem nenhuma bola.</p>');
    this.modal('Qual bola?', bolas.map(n =>
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
     HUB — parada entre capítulos
     ======================================================== */
  telaHub(){
    this.limpar();
    this.add(this.topo());
    const d = Estado.dados;
    const L = (typeof Mundo !== 'undefined') ? Mundo.atual() : null;
    const onde = L ? L.nome : d.jogador.cidade;
    const per = d.relogio.periodo;
    const nInsig = d.insignias.filter(i => i !== 'Título de Campeão').length;
    const feridos = d.time.filter(p => !p.morto && p.hp < p.hpMax).length;
    const caidos  = d.time.filter(p => !p.morto && p.hp <= 0).length;

    /* Onde você está e por que dá pra parar aqui — em vez de um
       aviso de menu sobre o tempo passar. */
    const abertura = {
      'manhã':    `Você chega em ${onde} de manhã, com o dia inteiro pela frente e nenhuma pressa que não seja sua.`,
      'tarde':    `${onde}, meio da tarde. A cidade está no horário em que tudo está aberto e ninguém tem paciência.`,
      'noite':    `${onde} à noite. O Centro Pokémon fica aberto — é a única coisa em Kanto que fica.`,
      'madrugada':`${onde}, madrugada. Quase tudo fechado, e o Centro Pokémon com a luz branca de sempre.`
    }[per] || `Você para em ${onde}.`;

    const estado = caidos
      ? `Tem ${caidos} ${caidos === 1 ? 'desmaiado' : 'desmaiados'} no seu cinto. Isso resolve num balcão.`
      : feridos
        ? `${feridos} do seu time ${feridos === 1 ? 'está machucado' : 'estão machucados'} e ninguém reclama disso em voz alta.`
        : 'O time está inteiro.';

    /* O time do jeito que ele está hoje: quem perdeu o par ainda
       procura; quem tem o par por perto anda junto. A frase muda por
       dia, não por clique. */
    const doTime = (() => {
      const dia = d.relogio.dia || 0;
      const enlutado = d.time.find(p => !p.morto && p.luto && (d.capitulo - (p.luto.cap || 0)) <= 2);
      if (enlutado){
        const g = pron(enlutado);
        return [
          `${nomeExib(enlutado)} para na porta do Centro e olha pra trás, pra rua, procurando ${enlutado.luto.nome}.`,
          `${nomeExib(enlutado)} come pouco e dorme no canto, virad${g.o} pra parede.`,
          `${nomeExib(enlutado)} ainda se vira quando alguém abre uma bola perto ${g.dele}.`
        ][dia % 3];
      }
      const pares = paresDoTime(d.time.filter(p => !p.morto));
      if (!pares.length) return '';
      const [a, b] = pares[dia % pares.length];
      return [
        `${nomeExib(a)} e ${nomeExib(b)} dormem encostados no banco da recepção, e ninguém da fila reclama.`,
        `${nomeExib(a)} não entra no Centro enquanto ${nomeExib(b)} não entra junto.`,
        `${nomeExib(a)} divide a ração com ${nomeExib(b)} sem ninguém mandar.`,
        `Quando ${nomeExib(b)} fica pra trás, ${nomeExib(a)} para e espera.`
      ][dia % 4];
    })();

    /* A Liga só entra na lista quando ela já quer dizer alguma coisa */
    const sabeDaLiga = nInsig > 0 || !!d.flags.sabe_da_elite || !!d.flags.campeao_de_kanto;

    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">Parada</div>
        <div class="tit">${this.esc(onde)}</div>
        <div class="loc">${this.esc(per)} do dia ${d.relogio.dia} · ${nInsig} de 8 insígnias</div>
      </div>
      <div class="narrativa"><p>${this.esc(abertura)}</p><p>${this.esc(estado)}</p>${doTime ? `<p>${this.esc(doTime)}</p>` : ''}</div>

      <div id="escolhas" class="escolhas">
        <button class="escolha" onclick="Jogo.hubCentro()">Centro Pokémon — curar o time inteiro</button>
        <button class="escolha" onclick="UI.modalPC()">PC do Centro — guardar e tirar Pokémon${d.pc.length ? ' (' + d.pc.length + ' guardado' + (d.pc.length===1?'':'s') + ')' : ''}</button>
        <button class="escolha" onclick="Jogo.hubLoja()">Loja — comprar itens</button>
        <button class="escolha" onclick="Jogo.abrirGinasios('hub')">Ginásios — desafiar líderes de Kanto</button>
        ${sabeDaLiga ? '<button class="escolha" onclick="Jogo.abrirLiga(\'hub\')">Liga Pokémon — Elite 4 e Torneio Aberto</button>' : ''}
        <button class="escolha" onclick="Jogo.hubTreinar()">Treinar na rota — encontro selvagem aleatório</button>
        ${d.time.length > 1 ? '<button class="escolha" onclick="Jogo.hubSoltar()">Soltar um Pokémon</button>' : ''}
        <button class="escolha" onclick="Jogo.avancarCapitulo()">Seguir para o próximo capítulo</button>
      </div>
      <div id="avisos" class="avisos"></div>
    </div>`);
    this.rolarTopo();
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
  telaGinasios(){
    this.limpar();
    this.add(this.topo());
    const d = Estado.dados;
    const n = d.insignias.length;

    /* O que a ficha de um ginásio mostra depende do que você já sabe.
       Nome, cidade, tipo e insígnia são conhecimento público em Kanto:
       está no pôster do Centro Pokémon. O time de dentro, não — isso
       você descobre pisando na cidade e entrando lá. */
    const cartao = g => {
      const st = statusGinasio(g);
      const cor = {conquistado:'var(--bom)', disponivel:'var(--destaque)',
                   recusado:'var(--ruim)', trancado:'var(--texto-fraco)', distante:'var(--texto-fraco)'}[st.estado];
      const rotulo = st.estado === 'conquistado' ? '✓ conquistada' : st.texto;

      const conquistado = st.estado === 'conquistado';
      const esteve = conquistado || (typeof Mundo !== 'undefined' && Mundo.visitado(g.id));
      const enfrentou = conquistado || !!d.flags['enfrentou_' + g.id];

      /* faixa de nível: quem esteve na cidade ouve falar; quem lutou sabe */
      const linhaNivel = enfrentou
        ? `${this.esc(g.insignia)} · níveis ${faixaGinasio(g)}`
        : esteve
          ? `${this.esc(g.insignia)} · dizem que o time anda pelo nível ${Math.round(nivelGinasio(g))}`
          : `${this.esc(g.insignia)}`;

      /* o time só depois de ver o time */
      const linhaTime = enfrentou
        ? `<div class="fraco" style="margin-bottom:8px;line-height:1.5">${this.esc(timeGinasio(g).map(x=>`${DEX[x.dex].nome} Nv${x.nivel}`).join(' · '))}</div>`
        : esteve
          ? `<div class="sussurro" style="margin-bottom:8px">Você passou na porta. Não viu quem está lá dentro.</div>`
          : `<div class="sussurro" style="margin-bottom:8px">Você nunca esteve em ${this.esc(g.cidade)}.</div>`;

      return `<div class="carta ginasio" style="border-color:${conquistado?'var(--bom)':'var(--borda)'}">
        <div class="t"><span>${this.esc(g.lider)} <span class="cidade">· ${this.esc(g.cidade)}</span></span>
          ${g.tipo === 'variado' ? '<span class="tipo-tag" style="background:#8a8f98">Variado</span>' : this.tipoTag(g.tipo)}</div>
        <div class="fraco" style="margin-bottom:6px">${linhaNivel}</div>
        ${linhaTime}
        ${st.fala ? `<div class="aviso dano" style="margin-bottom:8px">${this.esc(st.fala)}</div>` : ''}
        ${st.estado==='recusado' && g.comoDestravar
          ? `<div class="sussurro" style="margin:0 0 8px">${this.esc(g.comoDestravar)}</div>` : ''}
        ${conquistado && g.efeito ? `<div class="fraco" style="color:var(--bom)">${this.esc(g.efeito)}</div>` : ''}
        <div class="rodape">
          <span style="color:${cor};font-size:12.5px">${this.esc(rotulo)}</span>
          ${st.estado === 'disponivel'
            ? `<button class="btn destaque mini" onclick="Jogo.desafiarGinasio('${g.id}')">Desafiar</button>` : ''}
        </div>
      </div>`;
    };

    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">Liga Pokémon</div>
        <div class="tit">Os Oito Ginásios</div>
        <div class="loc">${n} de 8 insígnias</div>
      </div>
      <p class="sussurro">Ordem livre: comece por onde quiser. Cada líder adapta o <b>time inteiro</b> ao seu progresso — com poucas insígnias ele traz Pokémon não evoluídos e um time curto; com muitas, a linha completa e o ace. Nenhum ginásio vira passeio nem muro, seja qual for a ordem. Blue só recebe quem tem sete.</p>

      <div class="grade" style="margin-top:14px">${GINASIOS.map(cartao).join('')}</div>
      <div style="margin-top:20px">
        <button class="btn" onclick="Jogo.voltarDosGinasios()">Voltar</button>
        <button class="btn" onclick="Jogo.hubCentro()">Curar o time</button>
      </div>
    </div>`);
    this.rolarTopo();
  },

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
      <div class="narrativa">${this.narrar(falas)}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas" style="margin-top:20px">
        ${!venceu ? `<button class="escolha" onclick="Jogo.hubCentro()">Curar o time e tentar de novo</button>` : ''}
        <button class="escolha" onclick="Jogo.abrirGinasios('${this.esc(Jogo.voltarDeGinasio)}')">Voltar aos ginásios</button>
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
      <div class="narrativa">${this.narrar(falas)}</div>
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
        <button class="btn" onclick="Jogo.abrirGinasios('${this.esc(Jogo.voltarDeGinasio)}')">Ginásios</button>
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
      <div class="narrativa">${this.narrar(o.falas || [])}</div>
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
      <div class="narrativa">${(o.falas||[]).filter(Boolean).map(t=>`<p>${this.esc(txt(t))}</p>`).join('')}</div>
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
    const m = this.el(`<div class="modal-fundo ${classe ? 'fundo-' + classe : ''}" id="modal">
      <div class="modal ${classe || ''}">
        ${titulo ? `<h2>${this.esc(titulo)}</h2>` : ''}
        <div class="modal-corpo">${html}</div>
        ${semFechar ? '' : '<div class="modal-pe"><button class="btn" onclick="UI.fecharModal()">Fechar</button></div>'}
      </div></div>`);
    if (!vars && classe === 'mochila' && typeof paletaMochila === 'function')
      vars = paletaMochila(mochilaAtual().cor);
    if (vars){
      const caixa = m.querySelector('.modal');
      for (const [k, v] of Object.entries(vars)) caixa.style.setProperty(k, v);
    }
    document.body.appendChild(m);
    if (!semFechar){
      m.onclick = e => { if (e.target === m) this.fecharModal(); };
      this._escModal = ev => { if (ev.key === 'Escape') this.fecharModal(); };
      document.addEventListener('keydown', this._escModal);
    }
  },
  fecharModal(imediato){
    const m = document.getElementById('modal');
    if (this._escModal){ document.removeEventListener('keydown', this._escModal); this._escModal = null; }
    if (!m) return;
    m.id = '';
    if (imediato) return m.remove();
    m.classList.add('saindo');
    setTimeout(() => m.remove(), 200);
  },

  modalTime(){
    const d = Estado.dados;
    const carta = p => `<div class="carta ${p.morto?'morto':''}">
      <div class="t"><span class="com-icone">${imgSprite(p, 'icone')}${this.esc(nomeExib(p))}${this.shi(p)}</span><span class="mono">Nv ${p.nivel}</span></div>
      <div>${p.tipos.map(t=>this.tipoTag(t)).join('')}${p.status ? this.etiquetaStatus(p.status) : ''}</div>
      ${p.morto ? '<div class="sussurro" style="margin-top:8px">MORTO — '+this.esc(p.causaMorte)+'</div>' : this.barraHP(p) + this.barraExp(p)}
      <div class="sussurro" style="margin-top:7px">${p.naturezaVista
        ? 'Natureza <b>' + this.esc(p.natureza) + '</b>'
        : 'Natureza <b>???</b> — você ainda não conviveu o bastante.'}</div>
      <div class="sussurro">Moral ${p.moral}/100 ${p.moral<30?'· ele pode desobedecer':''}</div>
      ${(() => { const l = (typeof linhaDeAfinidade === 'function') ? linhaDeAfinidade(p) : null;
          return l ? `<div class="sussurro afinidade">${this.esc(l)}</div>` : ''; })()}
      ${p.morto ? '' : `<div class="segurado-linha">
        ${p.segurando
          ? `<span class="segurado-tag">segura ${this.esc(p.segurando)}</span>
             <span class="fraco">${this.esc(fichaItem(p.segurando))}</span>
             <button class="btn mini" onclick="UI.tirarItem('${p.uid}')">tirar</button>`
          : `<span class="fraco">mão livre</span>
             <button class="btn mini" onclick="UI.menuEquipar('${p.uid}')">equipar</button>`}
      </div>`}
      <div style="margin-top:8px;font-size:12.5px;color:var(--texto-fraco)">
        ${p.golpes.map(g=>`${this.esc(g.nome)} <span class="mono">${g.pp}/${g.ppMax}</span>`).join(' · ')}</div>
      <div class="sussurro" style="margin-top:6px">
        ${nomePosto(p.nivel)} · ${this.linhaAtrib(p)}</div>
      ${p.historia ? `<div class="sussurro" style="margin-top:7px;font-style:italic">${this.esc(p.historia)}</div>` : ''}
    </div>`;
    const pc = d.pc.length ? `<h3>No PC (${d.pc.length})</h3><div class="grade">${d.pc.map(carta).join('')}</div>` : '';
    const cem = d.cemiterio.length ? `<h3>Cemitério — permanente</h3><div class="grade">${d.cemiterio.map(carta).join('')}</div>` : '';
    this.modal('Seu time',
      (d.time.length ? `<div class="grade">${d.time.map(carta).join('')}</div>` : '<p class="nada">Você não tem nenhum Pokémon.</p>') + pc + cem);
  },

  modalItens(){
    const d = Estado.dados;
    const itens = Object.entries(d.itens).filter(([,q]) => q > 0);
    const total = itens.reduce((a,[,q]) => a + q, 0);
    const bolsa = mochilaAtual();
    const topo = `<div class="mochila-topo">
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
                       && Estado.dados.modo !== 'batalha';
        const equipavel = info.tipo === 'equipar' && Estado.dados.modo !== 'batalha';
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
    this.modalTime();
  },

  /* usar item fora de combate: pedra evolutiva, cura, PP, repelente */
  usarDaMochila(nome){
    const info = ITENS_INFO[nome] || {};
    const d = Estado.dados;
    if (!Estado.contaItem(nome)) return;
    if (info.tipo === 'tm') return this.ensinarTM(nome);
    if (info.tipo === 'ppUp') return this.escolherPPUp(nome);
    if (info.tipo === 'mapa') return Exploracao.mapa();

    if (info.tipo === 'curaJogador'){
      Estado.usarItem(nome); Estado.curarJogador(info.valor); Estado.salvar('auto');
      this.modal('', `<p>Você se cuida sozinh{o|a}, sentad{o|a} em algum lugar que não é confortável.</p>
        <p class="sussurro">HP ${Estado.j.hp}/${Estado.hpMaxJogador()}.</p>`, false, 'mochila');
      return;
    }
    if (info.tipo === 'repelente'){
      Estado.usarItem(nome);
      d.repelenteAte = (d.relogio.dia * 4) + info.valor;
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
    /* cura, revive, status, moral, pp: escolher alvo */
    const alvos = d.time.filter(p => !p.morto);
    if (!alvos.length) return this.modal('', '<p class="nada">Não tem em quem usar.</p>', false, 'mochila');
    this.modal('Em quem?', alvos.map(p =>
      `<button class="escolha" onclick="UI.aplicarItemFora('${nome.replace(/'/g,"\\'")}','${p.uid}')">
        ${this.esc(nomeExib(p))} <span class="pd">${p.hp}/${p.hpMax} HP${p.status?` · ${this.esc(p.status)}`:''}</span></button>`).join(''),
      false, 'mochila');
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
    this.modal('', `<p>${this.esc(msg)}</p>`, false, 'mochila');
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
      <div class="linha"><span class="k">Nome</span><span class="v">${this.esc(j.nome)} (${this.esc(j.genero)}, ${j.idade})</span></div>
      <div class="linha"><span class="k">Cidade natal</span><span class="v">${this.esc(j.cidade)}</span></div>
      <div class="linha"><span class="k">Objetivo</span><span class="v">${this.esc(j.objetivo)}</span></div>
      <div class="linha"><span class="k">Personalidade</span><span class="v">${this.esc(j.personalidade)}</span></div>
      <div class="linha"><span class="k">Aparência</span><span class="v">${this.esc(j.aparencia)}</span></div>
      <div class="linha"><span class="k">Vestimenta</span><span class="v">${this.esc(j.vestimenta)}</span></div>
      <p class="sussurro" style="margin:4px 0 12px">${this.esc(Estado.comoTeVeem())}</p>
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
        ${tem && caminhoInsignia(g.id)
          ? `<img class="insignia-img" src="${caminhoInsignia(g.id)}" alt="${this.esc(g.insignia)}" onerror="this.remove()">`
          : `<span class="forma ins-${g.id}" style="--ins-cor:${sabe ? cor : 'transparent'}"></span>`}
        <span class="rot">${tem ? this.esc(nome) : '—'}</span>
        <span class="cid">${sabe ? this.esc(g.cidade) : '???'}</span>
      </div>`;
    }).join('');

    const nInsig = d.insignias.filter(i => i !== 'Título de Campeão' && i !== 'Campeão de Kanto').length;

    this.modal('', `
      <div class="cartao-topo">
        <span class="cartao-sigla">REGISTRO DE TREINADOR</span>
        <span class="cartao-id">Nº ${id}</span>
      </div>

      <div class="cartao-corpo">
        <div class="cartao-retrato" title="${this.esc(Estado.descricaoFisica())}">
          <span class="silhueta" aria-hidden="true"></span>
          <span class="rodape-retrato">${this.esc(j.genero)}, ${j.idade}</span>
        </div>
        <div class="cartao-dados">
          <div class="cartao-nome">${this.esc(j.nome)}</div>
          <div class="cartao-titulo">${this.esc(j.cargo || (campeao ? '{Campeão|Campeã} de Kanto' : '{Treinador registrado|Treinadora registrada}'))}</div>
          <div class="cartao-sinais">${this.esc(Estado.descricaoFisica())}</div>
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
        <button class="btn mini" onclick="UI.modalFicha()">Ficha completa</button>
      </div>
    `, false, 'cartao');
  },

  modalPokedex(){
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
           <span><b>Kanto</b> ${DEX_KANTO_IDS.filter(d => pd.catalogados[d]).length}/${DEX_KANTO_IDS.length}</span>
           <span><b>Johto</b> ${DEX_NACIONAL_IDS.filter(d => d > 151 && pd.catalogados[d]).length}/${DEX_NACIONAL_IDS.filter(d => d > 151).length}</span>
         </div>`
      : '';

    this.modal('', cabeca + faixas +
      `<p class="sussurro" style="margin:0 0 12px">Ver um exemplar acende o número. Apontar a Pokédex nele durante um combate abre a ficha inteira — espécie, tipos, base e temperamento do indivíduo.${
        nacional ? ' A carta de atualização abriu os cem registros de Johto.' : ''}</p>
       <div class="dex-grade">${celas}</div>`, false, 'pokedex');
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
          <div class="nota">Para abrir a ficha: aponte a Pokédex nele durante um combate. Custa nada — não gasta o turno.</div>
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
  modalCredenciais(){
    const quadro = Cargos.quadro();
    const meus = quadro.filter(x => x.tem);
    const abertos = quadro.filter(x => !x.tem && x.ok);
    const fechados = quadro.filter(x => !x.tem && !x.ok);

    const ben = b => {
      const L = [];
      if (b.renda) L.push(`${fmtDin(b.renda)} ₽ por capítulo`);
      if (b.loja) L.push(`${Math.round((1 - b.loja) * 100)}% de desconto nas lojas`);
      if (b.centro) L.push('Centro Pokémon sem custo');
      if (b.status) L.push(b.status.charAt(0).toUpperCase() + b.status.slice(1) + ' +1');
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
      `<h3>Aberto pra você</h3>` +
      (abertos.length ? abertos.map(x => cartao(x,
        `<button class="btn destaque" onclick="Jogo.assumirCargo('${x.cargo.id}')">Assumir</button>`)).join('')
        : '<p class="nada">Nada hoje. Volte quando tiver mais estrada.</p>') +
      `<h3>Fora do seu alcance</h3>` +
      fechados.map(x => cartao(x, `<div class="cargo-motivo">${this.esc(x.cedo ? 'Cedo demais.' : x.motivo)}</div>`)).join('');

    this.modal('Credenciais', corpo, false, 'credencial');
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
    const atual = aba || this._abaTutorial || 'comeco';
    this._abaTutorial = atual;
    const ABAS = [
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
      ${L('Inicial aleatório', 'já morava na sua casa — vínculo máximo desde o primeiro dia')}
      ${L('Ritmo do combate', 'Pokérole (o HP do livro) ou prolongado (HP base em dobro)')}`;

    if (k === 'ficha') return `
      <h3>Os seis status</h3>
      ${L('Força', 'escapar de quem te encurralou · testes de cena')}
      ${L('Percepção', 'vasculhar · ler a natureza do seu time · observar')}
      ${L('Intelecto', 'a hora de pegar a estrada · andar pela cidade · ler o tipo de um desconhecido em combate')}
      ${L('Carisma', 'treinar · encarar um selvagem · ser obedecido com a moral baixa')}
      ${L('Sorte', 'o que o vasculho acha · pescaria · chance de brilhante')}
      ${L('Resistência', 'HP máximo · aguentar o golpe que sobra pra você')}
      <p class="sussurro">Sobem por ponto: 1 no fim de cada capítulo, no máximo +1 por status por capítulo. Alguns cargos e algumas cenas dão um ponto fora disso.</p>
      <h3>Perícia</h3>
      ${L('A rolagem', '1d10 + status + o cinto, contra a dificuldade')}
      ${L('1 a 3', 'fracasso')} ${L('4 a 6', 'parcial')} ${L('7 a 9', 'sucesso')} ${L('10+', 'crítico')}
      <p class="sussurro">Toda rolagem aparece na bandeja de dados, inclusive as que o jogo faz sozinho. O que o cinto soma está na aba Vínculo.</p>
      <h3>Reputação</h3>
      ${L('Como sobe', 'por pontos, não por ato — oito pontos pro primeiro degrau')}
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
      ${L('Bola', 'só em selvagem — não se joga bola no Pokémon de treinador')}
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
        <p class="sussurro">Nos seus, a natureza aparece sozinha depois de alguns combates juntos, por um teste de Percepção. Nos dos outros, só pela Pokédex ou se o treinador falar. Líder de ginásio sempre fala.</p>`;
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
      <div class="linha"><span class="k">Onde conferir</span><span class="v">a Parada lista o que o seu time consegue fazer agora</span></div>
      <p class="sussurro">Metade disso é objeto e metade é o corpo do bicho. Machado e picareta são ferramenta de gente: qualquer um compra, ninguém precisa ensinar nada a ninguém. Atravessar, voar e forçar dependem do tamanho de quem está com você — um Pidgey não te levanta por mais nível que tenha, e um Lapras te atravessa no primeiro dia. Luz é a única que tem os dois caminhos: a lanterna resolve e acaba; Lanturn e Ampharos resolvem e não acabam.</p>
      <p class="sussurro">Tem seis lugares no mapa que só abrem assim — um bambuzal plantado na Floresta de Viridian, uma parede de alvenaria dentro do Monte da Lua, o subsolo da Torre de Lavender, a ilhota no meio do rio de Cerulean, um contêiner virado pro muro no pátio de Vermilion e a ilha do sudoeste vista de cima. Nenhum é obrigatório pra terminar a jornada. Todos aparecem na tela mesmo quando você não pode entrar, dizendo o que falta, porque ver a porta fechada é o que faz querer a chave.</p>

      <h3>Perguntar o nome</h3>
      <div class="linha"><span class="k">Quando aparece</span><span class="v">sempre que fala com você alguém que o jogo chama pela função</span></div>
      <div class="linha"><span class="k">Como</span><span class="v">o botão no fim da cena, ou escrevendo "qual é o seu nome?"</span></div>
      <div class="linha"><span class="k">O que muda</span><span class="v">o balão passa a usar o nome — nessa cena e em todas depois</span></div>
      <div class="linha"><span class="k">Custa</span><span class="v">nada: não gasta dia, não muda reputação, não fecha escolha</span></div>
      <div class="linha"><span class="k">Nem todo mundo diz</span><span class="v">alguns recusam, e a recusa é sobre quem eles são</span></div>
      <div class="linha"><span class="k">Quem se apresenta</span><span class="v">crachá, placa, nome pintado na porta: o balão passa a usar o nome sem você perguntar</span></div>
      <p class="sussurro">Este jogo chama quase todo mundo de "a enfermeira", "o barqueiro", "a dona do armazém" — que é como a gente enxerga desconhecido de verdade. Perguntar o nome é a única ação do jogo que não serve pra nada mecanicamente e existe só pra desfazer isso. Uma mesma jornada sempre dá o mesmo nome pra mesma pessoa; jornadas diferentes dão nomes diferentes — menos pra quem a própria cena apresenta, que é sempre quem é.</p>

      <h3>Capítulos que podem não acontecer</h3>
      <div class="linha"><span class="k">Quantos</span><span class="v">4 dos 32 são condicionais</span></div>
      <div class="linha"><span class="k">O que abre</span><span class="v">uma coisa que você descobriu antes, não uma insígnia nem um nível</span></div>
      <div class="linha"><span class="k">Se não abrir</span><span class="v">a jornada segue reto e você nunca fica sabendo que existia</span></div>
      <div class="linha"><span class="k">Onde conferir</span><span class="v">a Parada lista "o que não aconteceu nesta jornada"</span></div>
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
      <div class="linha"><span class="k">Onde se assume</span><span class="v">balcão de credenciais, no Centro Pokémon</span></div>
      <p class="sussurro">Catorze postos, de licença de treinador a conselheiro regional. Cada um pede uma coisa diferente — espécies catalogadas, insígnias, reputação, o time que você leva — e alguns só existem depois de muita estrada. Quem carrega o envelope sem timbre não recebe crachá da Liga, e vice-versa; e esse envelope piora a sua reputação sozinho, todo capítulo.</p>

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
      ${L('Revanche', 'o mesmo adversário, com o time subido junto com você')}
      ${L('Favor', 'tem limite de vezes e espera de capítulos')}
      ${L('Depois do último capítulo', 'cada capítulo de espera vira 7 dias')}
      ${L('Missão', 'pedir · cumprir no mundo · ligar de volta pra entregar')}
      ${L('Notícia', 'não rende nada material — muda o que a pessoa pensa de você')}
      <p class="sussurro">Missão entregue não se pede de novo e missão aberta não se entrega antes da hora. Algumas pessoas ligam pra você primeiro: atender custa tempo e não atender custa outra coisa.</p>
      <h3>Cargos</h3>
      <p class="sussurro">Kanto tem postos, e posto é papel assinado: muda o que você paga, o que você recebe todo capítulo, onde você entra, como as pessoas te recebem e com que epílogo a sua história termina. O balcão de credenciais fica no Centro Pokémon, e o Cartão de Treinador tem um atalho.</p>
      ${L('Peso 1 · cedo', 'Treinador licenciado · Auxiliar de campo')}
      ${L('Peso 2 · meio', 'Guarda de rota · Criador registrado · Repórter credenciado')}
      ${L('Peso 3 · tarde', 'Informante · Investigador de campo · Pesquisador associado')}
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
      <p class="sussurro">Duas adaptações pro jogo de um golpe por turno. No livro, o Pokémon de posto alto gasta a sobra da precisão em mais ações na mesma rodada; aqui ele age uma vez, então a sobra que vira crítico sobe com o posto. E não existe esquiva nem choque como reação: quem apanha não gasta a vez desviando.</p>

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
      <div class="linha"><span class="k">Return · Frustration</span><span class="v">poder pela moral: 5 com moral 100 · 5 com moral 0 (moral ÷ 20)</span></div>
      <p class="sussurro">Esses estados somem quando o Pokémon sai da luta; Reflect, Light Screen, Mist e Safeguard ficam no lado inteiro até acabar o tempo.</p>

      <h3>Clima</h3>
      <div class="linha"><span class="k">Rain Dance · chuva</span><span class="v">5 turnos · Água +1 de poder · Fogo −1 de dano</span></div>
      <div class="linha"><span class="k">Sunny Day · sol</span><span class="v">5 turnos · Fogo +1 de poder · Água −1 de dano · Solar Beam sem carregar</span></div>
      <div class="linha"><span class="k">Sandstorm · areia</span><span class="v">5 turnos · 1 de dano no fim do turno, menos Pedra, Terrestre e Metálico · Pedra ganha +1 de Instinto</span></div>
      <h3>Captura</h3>
      <div class="linha"><span class="k">Chance</span><span class="v">(3 × HP máx − 2 × HP) ÷ (3 × HP máx) × taxa da espécie × bola × condição ÷ 255</span></div>
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
      <div class="linha"><span class="k">Nível</span><span class="v">o da área, 2 pra mais ou pra menos · 4 em 100 vêm 3 a 5 acima · 1 em 100 vem 8 a 12 acima</span></div>
      <div class="linha"><span class="k">Forma</span><span class="v">só aparece quem pode existir naquele nível</span></div>
      <p class="sussurro">O que nos jogos era presente ou troca aparece raro, no lugar da história da espécie. Depois que Johto abre, um quarto dos encontros pode ser de lá, pelo tipo do lugar.</p>

      <h3>Andar pela rota</h3>
      <div class="linha"><span class="k">Entrar ou sair de uma rota</span><span class="v">30% de um treinador dali te parar · se não, teste de Intelecto (dif. 5) e um selvagem sai do mato: 15% no crítico, 25% no sucesso, 35% no parcial, 45% na falha</span></div>
      <div class="linha"><span class="k">Viagem entre capítulos</span><span class="v">uma parada no máximo, num trecho de estrada do caminho: 35% de treinador, e senão a mesma conta do selvagem · depois da briga a viagem continua</span></div>
      <div class="linha"><span class="k">Procurar Pokémon</span><span class="v">20% de ser um treinador em vez de um selvagem</span></div>
      <div class="linha"><span class="k">Vasculhar</span><span class="v">22% de treinador · 15% de selvagem que estava debaixo do que você mexeu</span></div>
      <div class="linha"><span class="k">Treinar</span><span class="v">25% de treinador · 12% de selvagem atraído pelo barulho · a briga vira o treino do dia</span></div>
      <div class="linha"><span class="k">Acampar</span><span class="v">18% de selvagem mexendo na mochila de noite</span></div>
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
      <p class="sussurro">Quem vai na frente é quem pesa nas perícias. O jogo não diz qual natureza combina com qual traço, e não avisa antes de uma tarefa que tipo de bicho ela pede: isso é pra reparar, não pra consultar.</p>
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
      <p class="sussurro">${Estado.dados.flags.bola_fraca_em_lendario ? 'Poké Ball e Great Ball não funcionam — você viu.' : 'Bola comum parece não bastar, mas você ainda não testou.'}
      ${Estado.dados.flags.ultra_prende_lendario ? 'Ultra Ball: 1d20, só 1–2 prendem.' : ''}
      ${Estado.dados.flags.master_quase_sempre ? 'Master Ball normalmente captura.' : ''}
      ${Object.values(Estado.dados.lendarios||{}).some(l=>l.quebrouBola) ? 'E existem coisas que simplesmente quebram a bola no ar.' : ''}</p>` : ''}
      <h3>Perícias</h3>
      <p class="sussurro">Parar e olhar vale uma vez por cena: a segunda olhada nunca mostrou nada.</p>
      <p class="sussurro">1d10 + status + o cinto, contra a dificuldade. 1–3 fracasso · 4–6 parcial · 7–9 sucesso · 10+ crítico. Toda rolagem aparece na bandeja de dados, inclusive as que o jogo faz sozinho.</p>
      <p class="sussurro">O cinto conta porque cada perícia puxa um eixo — Percepção pede cuidado, Carisma pede simpatia, Força pede coragem, Intelecto pede paciência. O melhor do time naquele eixo soma, o pior desconta metade, e a afinidade de quem vai na frente entra por cima. A linha embaixo do resultado mostra a soma e quem ajudou; por que aquele ajudou é com você.</p>
      <div class="linha"><span class="k">Força</span><span class="v">fugir de um selvagem que te encurralou · testes de cena</span></div>
      <div class="linha"><span class="k">Percepção</span><span class="v">vasculhar · ler a natureza do seu time · observar a cena · testes</span></div>
      <div class="linha"><span class="k">Intelecto</span><span class="v">escolher a hora de pegar a estrada · andar pela cidade · ler o tipo de um desconhecido em combate</span></div>
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
      <p class="sussurro">Consertar a calha da vizinha é uma coisa boa e não é notícia. Reputação é o que Kanto conta sobre você, então só muda de degrau o que foi grande o bastante para ser contado — ou o que aconteceu na frente de quem conta. Cada capítulo tem um teto: fazer tudo o que dá num capítulo rende mais que fazer metade, mas não rende o dobro, porque Kanto só fala de você na medida em que te viu. Ginásio e Liga passam por cima do teto — isso é notícia em qualquer altura. Os dois eixos se pagam: enquanto você deve de um lado, o que você faz do outro serve primeiro para quitar.</p>

      <h3>O que você sabe</h3>
      <div class="linha"><span class="k">Espécie não catalogada</span><span class="v">aparece como ???</span></div>
      <div class="linha"><span class="k">Pokémon de treinador com apelido</span><span class="v">só o apelido</span></div>
      <div class="linha"><span class="k">Depois de apontar a Pokédex</span><span class="v">Apelido (Espécie)</span></div>
      <div class="linha"><span class="k">Ler a Pokédex em combate</span><span class="v">quantas vezes quiser · não gasta o turno</span></div>
      <div class="linha"><span class="k">O que entra pro seu time</span><span class="v">catalogado na hora</span></div>
      <p class="sussurro">A natureza é do indivíduo, não da espécie. Nos seus, ela aparece sozinha depois de alguns combates juntos, por um teste de Percepção — quanto mais tempo com você, mais fácil. Nos dos outros, só pela Pokédex ou se o treinador falar. Líder de ginásio sempre fala.</p>

      <h3>Brilhantes</h3>
      <div class="linha"><span class="k">Frequência</span><span class="v">cerca de 1 em 1000</span></div>
      <div class="linha"><span class="k">Sorte</span><span class="v">cada ponto aperta a conta — no máximo, 1 em 300</span></div>
      <div class="linha"><span class="k">Atributos</span><span class="v">idênticos aos da espécie</span></div>
      <p class="sussurro">A cor é a única diferença, e é a diferença inteira. Um brilhante avistado fica marcado na Pokédex mesmo que escape; capturado, a marca muda. Evoluir não tira a cor.</p>

      <h3>PokéNav</h3>
      <div class="linha"><span class="k">Agenda</span><span class="v">só entra número que te deram · você grava na hora ou depois</span></div>
      <div class="linha"><span class="k">Revanche</span><span class="v">o mesmo adversário, com o time subido junto com você</span></div>
      <div class="linha"><span class="k">Favor</span><span class="v">tem limite de vezes e espera de capítulos</span></div>
      <div class="linha"><span class="k">Depois do último capítulo</span><span class="v">cada capítulo de espera vira 7 dias</span></div>
      <div class="linha"><span class="k">Missão</span><span class="v">pedir · cumprir no mundo · ligar de volta pra entregar</span></div>
      <div class="linha"><span class="k">Notícia</span><span class="v">não rende nada material · muda o que a pessoa pensa de você</span></div>
      <div class="linha"><span class="k">Gente da estrada</span><span class="v">19 dos treinadores de rota passam o número na primeira vez que perdem pra você · a revanche vem com o time de quem tem duas insígnias a mais, e +2 de nível</span></div>
      <div class="linha"><span class="k">Gente da história</span><span class="v">quem gostou de você o bastante passa o número depois do capítulo em que vocês se conheceram</span></div>
      <p class="sussurro">Missão entregue não se pede de novo, e missão aberta não se entrega antes da hora. Algumas pessoas ligam pra você primeiro — atender custa tempo e não atender custa outra coisa. Quem te dá o número não explica quem é: isso está na conversa em que você conheceu a pessoa.</p>

      <h3>De onde vem o seu primeiro</h3>
      <div class="linha"><span class="k">Qual dos três</span><span class="v">você escolhe na hora, com as três bolas na sua frente · nenhuma vem escolhida</span></div>
      <div class="linha"><span class="k">Nasceu em Pallet</span><span class="v">o Professor traz a bandeja pra rua, na manhã em que você sai de casa</span></div>
      <div class="linha"><span class="k">Nasceu em qualquer outra</span><span class="v">a perua do laboratório passa uma vez por mês</span></div>
      <div class="linha"><span class="k">O que já morava na casa</span><span class="v">não passa por ninguém: já é seu</span></div>
      <div class="linha"><span class="k">Nasceu longe de Pallet e Viridian</span><span class="v">a licença vem com a passagem do ônibus da Liga até Viridian, onde a estrada dos ginásios começa · sem licença, você paga a passagem</span></div>
      <p class="sussurro">Bulbasaur, Charmander e Squirtle saem de Pallet numa caixa térmica, uma fileira de cada. Quem assina a inscrição é quem é responsável por você; a espécie ninguém escolhe no papel. Se a manhã acabar sem você na frente da caixa, a bola que o laboratório separou te espera no balcão do Centro. Quem não aparece vira duas letras no caderno. A volta é mensal e a perua não deixa de passar por chuva.</p>

      <h3>Loja</h3>
      <div class="linha"><span class="k">Onde</span><span class="v">dez cidades · cada uma vende o que a cidade é</span></div>
      <div class="linha"><span class="k">Preço</span><span class="v">base × o multiplicador da cidade</span></div>
      <div class="linha"><span class="k">Mais barato</span><span class="v">Celadon (0,85×) e o cais de Vermilion (0,9×)</span></div>
      <div class="linha"><span class="k">Mais caro</span><span class="v">Saffron (1,3×) e Cinnabar (1,25×)</span></div>
      <p class="sussurro">Pewter não vende bola barata e Lavender não vende repelente, porque ninguém de Lavender vai pro mato. Pedra evolutiva só em quem tem: Celadon tem quase tudo, Cerulean tem a da Água, Cinnabar tem a do Fogo. O que a Pokédex Nacional destrava também aparece na prateleira depois.</p>

      <h3>Cortar, atravessar, voar, forçar, iluminar</h3>
      <div class="linha"><span class="k">Não existe HM</span><span class="v">nenhum Pokémon aprende "Corte" nem "Surf" neste jogo</span></div>
      <div class="linha"><span class="k">Cortar</span><span class="v">machado na mochila · 900 ₽ na ferragem de Pewter e no posto do Safári</span></div>
      <div class="linha"><span class="k">Quebrar pedra</span><span class="v">picareta na mochila · 1.100 ₽ na ferragem de Pewter</span></div>
      <div class="linha"><span class="k">Atravessar água</span><span class="v">Pokémon do tipo Água de porte médio ou grande</span></div>
      <div class="linha"><span class="k">Voar</span><span class="v">Pokémon do tipo Voador de grande porte, e que voe de verdade</span></div>
      <div class="linha"><span class="k">Forçar o que é pesado</span><span class="v">qualquer Pokémon de grande porte</span></div>
      <div class="linha"><span class="k">Enxergar no escuro</span><span class="v">lanterna, que gasta pilha · ou um Pokémon que emita luz, que não gasta</span></div>
      <div class="linha"><span class="k">Onde conferir</span><span class="v">a Parada lista o que o seu time consegue fazer agora</span></div>
      <p class="sussurro">Metade disso é objeto e metade é o corpo do bicho. Machado e picareta são ferramenta de gente: qualquer um compra, ninguém precisa ensinar nada a ninguém. Atravessar, voar e forçar dependem do tamanho de quem está com você — um Pidgey não te levanta por mais nível que tenha, e um Lapras te atravessa no primeiro dia. Luz é a única que tem os dois caminhos: a lanterna resolve e acaba; Lanturn e Ampharos resolvem e não acabam.</p>
      <p class="sussurro">Tem seis lugares no mapa que só abrem assim — um bambuzal plantado na Floresta de Viridian, uma parede de alvenaria dentro do Monte da Lua, o subsolo da Torre de Lavender, a ilhota no meio do rio de Cerulean, um contêiner virado pro muro no pátio de Vermilion e a ilha do sudoeste vista de cima. Nenhum é obrigatório pra terminar a jornada. Todos aparecem na tela mesmo quando você não pode entrar, dizendo o que falta, porque ver a porta fechada é o que faz querer a chave.</p>

      <h3>Perguntar o nome</h3>
      <div class="linha"><span class="k">Quando aparece</span><span class="v">sempre que fala com você alguém que o jogo chama pela função</span></div>
      <div class="linha"><span class="k">Como</span><span class="v">o botão no fim da cena, ou escrevendo "qual é o seu nome?"</span></div>
      <div class="linha"><span class="k">O que muda</span><span class="v">o balão passa a usar o nome — nessa cena e em todas depois</span></div>
      <div class="linha"><span class="k">Custa</span><span class="v">nada: não gasta dia, não muda reputação, não fecha escolha</span></div>
      <div class="linha"><span class="k">Nem todo mundo diz</span><span class="v">alguns recusam, e a recusa é sobre quem eles são</span></div>
      <div class="linha"><span class="k">Quem se apresenta</span><span class="v">crachá, placa, nome pintado na porta: o balão passa a usar o nome sem você perguntar</span></div>
      <p class="sussurro">Este jogo chama quase todo mundo de "a enfermeira", "o barqueiro", "a dona do armazém" — que é como a gente enxerga desconhecido de verdade. Perguntar o nome é a única ação do jogo que não serve pra nada mecanicamente e existe só pra desfazer isso. Uma mesma jornada sempre dá o mesmo nome pra mesma pessoa; jornadas diferentes dão nomes diferentes — menos pra quem a própria cena apresenta, que é sempre quem é.</p>

      <h3>Capítulos que podem não acontecer</h3>
      <div class="linha"><span class="k">Quantos</span><span class="v">4 dos 32 são condicionais</span></div>
      <div class="linha"><span class="k">O que abre</span><span class="v">uma coisa que você descobriu antes, não uma insígnia nem um nível</span></div>
      <div class="linha"><span class="k">Se não abrir</span><span class="v">a jornada segue reto e você nunca fica sabendo que existia</span></div>
      <div class="linha"><span class="k">Onde conferir</span><span class="v">a Parada lista "o que não aconteceu nesta jornada"</span></div>
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
      <div class="linha"><span class="k">Onde se assume</span><span class="v">balcão de credenciais, no Centro Pokémon</span></div>
      <p class="sussurro">Catorze postos, de licença de treinador a conselheiro regional. Cada um pede uma coisa diferente — espécies catalogadas, insígnias, reputação, o time que você leva — e alguns só existem depois de muita estrada. Quem carrega o envelope sem timbre não recebe crachá da Liga, e vice-versa; e esse envelope piora a sua reputação sozinho, todo capítulo.</p>

      <h3>Estrada e tempo</h3>
      <div class="linha"><span class="k">Viagem entre capítulos</span><span class="v">um dia por trecho do caminho real</span></div>
      <div class="linha"><span class="k">O que passa</span><span class="v">quatro horas por trecho · cada lugar do trajeto fica visitado</span></div>
      <div class="linha"><span class="k">Centro Pokémon</span><span class="v">de graça com licença · sem licença, 300 ₽ + 250 por ferido</span></div>
      <div class="linha"><span class="k">Mapa</span><span class="v">com o Mapa de Kanto na mochila, ou na parede de qualquer Centro Pokémon · Kanto inteira, toda cidade e toda rota com nome · lugar que não está em mapa nenhum só aparece depois que você descobre</span></div>
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
