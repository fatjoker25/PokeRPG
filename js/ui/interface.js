/* ============================================================
   INTERFACE
   ============================================================ */
const UI = {
  app:null, dadosRecentes:[],

  init(){ this.app = document.getElementById('app'); },

  /* ---------- helpers ---------- */
  esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); },
  el(html){ const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; },
  /* Marca de brilhante. Fica do lado do nome, nunca dentro dele. */
  shi(p){ return (p && p.shiny) ? '<span class="shiny-marca" title="Brilhante">✦</span>' : ''; },
  limpar(){ this.app.innerHTML = ''; },
  add(html){ const e = this.el(html); if (e) this.app.appendChild(e); return e; },
  tom(t){ document.body.setAttribute('data-tom', t || 'leve'); },
  rolarTopo(){ window.scrollTo({top:0, behavior:'smooth'}); },

  mostrarDado(reg){
    this.dadosRecentes.push(reg);
    if (this.dadosRecentes.length > 8) this.dadosRecentes.shift();
  },
  limparDados(){ this.dadosRecentes = []; },
  /* ---------- DADOS: eles giram na tela e você pode girar de novo ---------- */
  htmlDados(){
    if (!this.dadosRecentes.length) return this.htmlBandeja();
    const dados = this.dadosRecentes.map((d,k) => {
      const cls = d.valor === d.faces ? ' max' : (d.valor === 1 ? ' min' : '');
      return `<button class="dado d${d.faces}${cls}" data-v="${d.valor}" data-faces="${d.faces}"
        title="${this.esc(d.motivo||d.dado)} — clique para girar de novo"
        onclick="UI.girarDado(this)" style="animation-delay:${k*70}ms">
        <span class="face">${d.valor}</span>
        <span class="rot">d${d.faces}</span>
      </button>`;
    }).join('');
    const motivos = this.dadosRecentes.map(d =>
      `<span class="dado-legenda"><b>d${d.faces}</b> ${this.esc(d.motivo||'')} <b class="v">${d.valor}</b></span>`).join('');
    return `<div class="dados-area">
      <div class="dados-linha">${dados}</div>
      <div class="dados-legendas">${motivos}</div>
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

  barraHP(p){
    const pct = Math.max(0, (p.hp / p.hpMax) * 100);
    const cls = pct > 50 ? '' : (pct > 22 ? 'medio' : 'baixo');
    return `<div class="barra ${cls}"><i style="width:${pct}%"></i></div>
            <div class="hp-num">${p.hp} / ${p.hpMax} HP</div>`;
  },

  /* ---------- barra superior ---------- */
  topo(){
    const d = Estado.dados;
    if (!d) return '';
    const rep = Estado.nomeRep();
    const cap = Historia.capitulo(d.capitulo);
    return `<div class="topo">
      <div>
        <h1>${this.esc(d.jogador.nome)} — ${this.esc(rep)}</h1>
        <div class="sub">${d.local && LOCAIS[d.local] ? this.esc(LOCAIS[d.local].nome) : 'Kanto'} ·
          ${this.esc(d.relogio.periodo || 'manhã')} do dia ${d.relogio.dia} ·
          HP ${d.jogador.hp}/${Estado.hpMaxJogador()} · ${d.jogador.dinheiro} ₽</div>
      </div>
      <div class="topo-acoes">
        <button class="btn mini" onclick="UI.modalTime()">Time</button>
        <button class="btn mini" onclick="UI.modalItens()">Mochila</button>
        ${(d.flags.tem_cartao && d.flags.tem_pokedex) ? '<button class="btn mini" onclick="UI.modalCartao()">Cartão</button>' : ''}
        <button class="btn mini" onclick="UI.modalFicha()">Ficha</button>
        ${d.flags.tem_pokedex ? '<button class="btn mini" onclick="UI.modalPokedex()">Pokédex</button>' : ''}
        <button class="btn mini" onclick="UI.modalDiario()">Diário</button>
        <button class="btn mini" onclick="UI.modalRegras()">Regras</button>
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

      <h3>Pokémon inicial</h3>
      <div class="opcoes-radio" id="f-inicial" style="margin-bottom:10px">
        <button data-v="1" class="sel">Bulbasaur</button>
        <button data-v="4">Charmander</button>
        <button data-v="7">Squirtle</button>
        <button data-v="rand">Aleatório (cresceu com você)</button>
      </div>
      <div class="sussurro" id="f-inicial-desc">Tradição: o Professor te entrega a bola na saída da cidade.</div>

      <h3>Ritmo do combate</h3>
      <div class="opcoes-radio" id="f-ritmo" style="margin-bottom:10px">
        <button data-v="fiel" class="sel">Regra do dado (fiel)</button>
        <button data-v="longo">Combate prolongado</button>
      </div>
      <div class="sussurro" id="f-ritmo-desc">
        Fiel: dano = 1d10 × (poder ÷ 10), como nas suas regras. Rápido e letal.
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
        ? 'Aleatório: um Pokémon de 1ª Geração, estágio 1. Ele é seu desde pequeno — cresceu com você. Vínculo máximo.'
        : 'Tradição: o Professor te entrega a bola na saída da cidade.';
    });
    grupo('f-ritmo', v => {
      document.getElementById('f-ritmo-desc').textContent = v === 'fiel'
        ? 'Fiel: dano = 1d10 × (poder ÷ 10), como nas suas regras. Rápido e letal.'
        : 'Prolongado: mesmo dado, dano reduzido a 60%. Combates duram mais turnos.';
    });
  },

  lerCriacao(){
    const sel = id => { const b = document.querySelector('#'+id+' button.sel'); return b ? b.dataset.v : null; };
    const v = id => (document.getElementById(id).value || '').trim();
    return {
      nome:v('f-nome'), genero:sel('f-genero'), aparencia:v('f-aparencia'),
      personalidade:v('f-personalidade'), vestimenta:v('f-vestimenta'),
      cidade:document.getElementById('f-cidade').value, objetivo:v('f-objetivo'),
      inicial:sel('f-inicial'), ritmo:sel('f-ritmo')
    };
  },

  /* ========================================================
     CENA NARRATIVA
     ======================================================== */
  telaCena(cena, avisos){
    Estado.dados.modo = 'cena';
    const cap = Historia.capAtual;
    this.tom(cap.tom); this.limpar(); this.limparDados();
    this.add(this.topo());

    const paras = (cena.texto||[]).map(t => txt(t)).filter(Boolean)
      .map(t => `<p>${this.esc(t)}</p>`).join('');

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
      if (a.tipo === 'eco'){
        c.appendChild(this.el(`<div class="eco">— "${this.esc(a.texto)}"</div>`));
        return;
      }
      c.appendChild(this.el(`<div class="aviso ${this.esc(a.tipo||'info')}">${this.esc(a.texto)}</div>`));
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
        c.appendChild(this.el(`<button class="escolha" onclick="Jogo.irPara('${cena.sacrificio.vai}')">Você não tem ninguém. Vai sozinho.</button>`));
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

    const visiveis = [];
    (cena.escolhas||[]).forEach((e, i) => {
      if (!Historia.disponivel(e)) return;
      visiveis.push(i);
      c.appendChild(this.el(`<button class="escolha" onclick="Jogo.escolher(${i})">${this.esc(txt(e.texto))}</button>`));
    });

    // cena curta ganha uma quarta via que sempre cabe: parar e olhar
    if (visiveis.length && visiveis.length < 4){
      c.appendChild(this.el(`<button class="escolha" onclick="Jogo.observarCena()">
        Parar e olhar mais um pouco antes de decidir.</button>`));
    }

    if (visiveis.length) c.appendChild(this.campoLivre());
  },

  /* O campo onde o jogador escreve o que faz */
  campoLivre(){
    const caixa = this.el(`<div class="acao-livre">
      <label for="acao-livre">Ou faça outra coisa — escreva:</label>
      <div class="linha-acao">
        <input id="acao-livre" type="text" maxlength="160" autocomplete="off"
               placeholder="ex.: chego devagar e estendo a mão">
        <button class="btn destaque" onclick="Jogo.acaoLivre()">Fazer</button>
      </div>
      <div class="sussurro">O jogo lê o que você escreveu. Se encaixar numa saída que já existe, ele segue por ela. Se não, ele improvisa — e isso conta igual.</div>
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
    if (introLinhas && introLinhas.length){
      this.add(`<div class="painel"><div class="narrativa">${
        introLinhas.map(t=>`<p>${this.esc(txt(t))}</p>`).join('')}</div></div>`);
    }
    this.add(`<div class="painel">
      <div class="arena" id="arena"></div>
      <div class="log-combate" id="log"></div>
      <div id="dados"></div>
      <div class="acoes-combate" id="acoes"></div>
    </div>`);
    this.atualizarArena();
    this.escreverLog(Batalha.eventos);
    this.acoesCombate();
    this.rolarTopo();
  },

  atualizarArena(){
    const a = Batalha.aliado, i = Batalha.inimigo;
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
        ? `<span class="mono">ATK ${p.stats.atk} · DEF ${p.stats.def} · SPA ${p.stats.spa} · SPD ${p.stats.spd} · VEL ${p.stats.spe}</span>`
        : (leuTipo ? '<span class="mono">tipo lido de olho · ficha não catalogada</span>'
                   : '<span class="mono">ficha não catalogada</span>');
      const seg = p.segurando ? `<div class="segurado-tag" title="${this.esc(fichaItem(p.segurando))}">segura ${this.esc(p.segurando)}</div>` : '';
      /* O seu aparece de costas, como em qualquer combate; o do outro
         lado, de frente. Espécie não catalogada sai em silhueta. */
      const arte = imgSprite(p, meu ? 'costas' : 'frente', {oculto: !catalogado});
      return `<div class="lutador ${cls}">
        <div class="arte">${arte}</div>
        <div class="nome"><span>${this.esc(nomeVisivel(p))}${this.shi(p)}</span><span class="nv">Nv ${p.nivel}</span></div>
        <div style="margin-top:5px">${tipos}${p.status?`<span class="status-tag">${this.esc(p.status)}</span>`:''}</div>
        ${this.barraHP(p)}
        <div class="meta">${nat}</div>
        <div class="meta">${ficha}</div>
        ${seg}
      </div>`;
    };
    document.getElementById('arena').innerHTML = card(a,'aliado',true) + card(i,'inimigo',false);
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
    const bolas = Object.keys(d.itens).filter(n => (ITENS_INFO[n]||{}).tipo === 'bola').length;
    const itens = Object.keys(d.itens).length;

    const bt = (cls, rot, nota, acao, off) =>
      `<button class="mb-btn ${cls}" ${off ? 'disabled' : ''} ${off ? '' : 'onclick="' + acao + '"'}>
        <span class="rot">${rot}</span><span class="nota">${nota}</span></button>`;

    const dex = d.flags.tem_pokedex
      ? `<div class="mb-linha centro">${bt('dex', 'Pokédex',
          Batalha.pdexUsada ? 'já usada nesta luta' : 'lê o adversário · não gasta o turno',
          "Jogo.acaoBatalha({tipo:'pokedex'})", Batalha.pdexUsada)}</div>`
      : '';

    c.appendChild(this.el(`<div class="menu-batalha">
      <div class="mb-linha">
        ${bt('lutar', 'Lutar', `golpes de ${this.esc(nomeExib(a))}`, 'UI.abrirGolpes()')}
        ${bt('bag', 'Bag', itens ? `${bolas ? bolas + ' tipo(s) de bola · ' : ''}${itens} item(ns)` : 'vazia', 'UI.menuBag()', !itens)}
      </div>
      <div class="mb-linha">
        ${bt('time', 'Time', vivos ? `${vivos} em pé no banco` : 'ninguém mais em pé', 'UI.menuTroca()', !vivos)}
        ${bt('fugir', 'Fugir', Batalha.fuga ? '1d20 contra a velocidade dele' : 'daqui não se foge',
             "Jogo.acaoBatalha({tipo:'fugir'})", !Batalha.fuga)}
      </div>
      ${dex}
    </div>`));
  },

  painelGolpes(c){
    const a = Batalha.aliado;
    const conhecido = Estado.conheceu(Batalha.inimigo.dex) || !!Batalha.leituraIntelecto;
    const grade = this.el('<div class="grade-golpes"></div>');
    a.golpes.forEach((g, i) => {
      const G = GOLPES[g.nome];
      // a dica de eficácia só existe se você souber contra o que está lutando
      const ef = conhecido ? eficacia(G.t, Batalha.inimigo.tipos) : 1;
      const marca = !conhecido ? '' : ef === 0 ? ' (imune)' : ef >= 2 ? ' ✦' : ef <= 0.5 ? ' ·' : '';
      grade.appendChild(this.el(`<button class="golpe-btn" ${g.pp<=0?'disabled':''} onclick="UI.modoBatalha='menu';Jogo.acaoBatalha({tipo:'golpe',indice:${i}})">
        <span>${this.esc(g.nome)}${marca}<br><span class="pd">${G.t} · ${G.c==='status'?'status':(G.p||'—')} · ${G.a>=999?'∞':G.a+'%'}</span></span>
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
    const bolas = nomes.filter(n => (ITENS_INFO[n]||{}).tipo === 'bola');
    const resto = nomes.filter(n => (ITENS_INFO[n]||{}).tipo !== 'bola');
    const linhasBolas = bolas.map(n =>
      `<button class="escolha" onclick="UI.fecharModal();UI.modoBatalha='menu';Jogo.acaoBatalha({tipo:'bola',nome:'${n}'})">
        ${this.esc(n)} <span class="pd">×${Estado.contaItem(n)} — ${this.esc(descricaoItem(n))}</span></button>`).join('');
    const linhasItens = resto.map(n => {
      const info = ITENS_INFO[n] || {};
      if (info.tipo === 'curaJogador')
        return `<button class="escolha" onclick="UI.fecharModal();UI.modoBatalha='menu';Jogo.acaoBatalha({tipo:'item',nome:'${n}'})">${this.esc(n)} ×${Estado.contaItem(n)} — em você</button>`;
      return d.time.filter(p=>!p.morto).map(p =>
        `<button class="escolha" onclick="UI.fecharModal();UI.modoBatalha='menu';Jogo.acaoBatalha({tipo:'item',nome:'${n}',alvoUid:'${p.uid}'})">
          ${this.esc(n)} ×${Estado.contaItem(n)} → ${this.esc(nomeExib(p))}${this.shi(p)} (${p.hp}/${p.hpMax})</button>`).join('');
    }).join('');
    this.modal('Mochila',
      (linhasBolas ? '<h3>Bolas</h3>' + linhasBolas : '') +
      (linhasItens ? '<h3>Itens</h3>' + linhasItens : '') ||
      '<p class="nada">Nada que sirva agora.</p>');
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
    const b = esp.base;
    const num = String(p.dex).padStart(3, '0');
    const nat = NATUREZAS[p.natureza] || {};
    const maxBase = {hp:255, atk:190, def:230, spa:194, spd:230, spe:150};
    const par = (rot, chave, vInd) => `<div class="base-linha dupla">
      <span class="k">${rot}</span>
      <span class="barrinha"><i style="width:${Math.min(100, Math.round(b[chave]/maxBase[chave]*100))}%"></i></span>
      <span class="v mono">${b[chave]}</span>
      <span class="ind mono">${vInd}</span></div>`;

    this.modal('', `<div class="pokedex-topo">
        <span class="pokedex-lente"></span>
        <span class="pokedex-luzes"><i></i><i></i><i></i></span>
      </div>
      <div class="dex-ficha">
        <div class="cab"><span class="num">#${num}</span>
          <span class="nomeg">${this.esc(esp.nome)}${this.shi(p)}</span>
          <span style="margin-left:auto">${esp.tipos.map(t=>this.tipoTag(t)).join('')}</span></div>
        <div class="dex-arte">${imgSprite(p, 'frente')}</div>
        <div class="nota">Nível ${p.nivel} · ${this.esc(p.natureza)}${nat.traco ? ' — ' + this.esc(nat.traco) : ''}</div>
        ${p.shiny ? '<div class="nota brilho-v">✦ Anomalia cromática. A ficha é a mesma; a cor não.</div>' : ''}
        ${nat.agressiva ? '<div class="nota alerta">Temperamento agressivo: se o seu time cair, ele não recua.</div>' : ''}

        <h3 class="cat-item">Base da espécie <span class="fraco">· este exemplar</span></h3>
        ${par('HP', 'hp', p.stats.hp)}
        ${par('Ataque', 'atk', p.stats.atk)}
        ${par('Defesa', 'def', p.stats.def)}
        ${par('Sp. Atk', 'spa', p.stats.spa)}
        ${par('Sp. Def', 'spd', p.stats.spd)}
        ${par('Velocidade', 'spe', p.stats.spe)}
        <div class="nota mono">Soma de base: ${esp.total}</div>

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

  menuBolas(){
    const bolas = Object.keys(Estado.dados.itens).filter(n => (ITENS_INFO[n]||{}).tipo === 'bola');
    if (!bolas.length) return this.modal('Mochila', '<p class="nada">Você não tem nenhuma bola.</p>');
    this.modal('Qual bola?', bolas.map(n =>
      `<button class="escolha" onclick="UI.fecharModal();Jogo.acaoBatalha({tipo:'bola',nome:'${n}'})">
        ${this.esc(n)} <span class="pd">×${Estado.contaItem(n)} — ${this.esc(descricaoItem(n))}</span></button>`).join(''));
  },

  menuItens(){
    const itens = Object.keys(Estado.dados.itens).filter(n => (ITENS_INFO[n]||{}).tipo !== 'bola');
    if (!itens.length) return this.modal('Mochila', '<p class="nada">Mochila vazia.</p>');
    this.modal('Usar em quem?', itens.map(n => {
      const info = ITENS_INFO[n];
      if (info.tipo === 'curaJogador')
        return `<button class="escolha" onclick="UI.fecharModal();Jogo.acaoBatalha({tipo:'item',nome:'${n}'})">${this.esc(n)} ×${Estado.contaItem(n)} — em você</button>`;
      return Estado.dados.time.filter(p=>!p.morto).map(p =>
        `<button class="escolha" onclick="UI.fecharModal();Jogo.acaoBatalha({tipo:'item',nome:'${n}',alvoUid:'${p.uid}'})">
          ${this.esc(n)} ×${Estado.contaItem(n)} → ${this.esc(nomeExib(p))} (${p.hp}/${p.hpMax})</button>`).join('');
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
        <div class="loc">${this.esc(cap.cenas[Estado.dados.cena].resumo || '')}</div>
      </div>
      <div id="avisos" class="avisos"></div>
      <h3>Pontos de progressão</h3>
      <p class="sussurro">Você tem <b id="pts">${j.pontos}</b> ponto(s). Máximo de +1 por status neste capítulo.</p>
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
    const cap = Historia.capitulo(Estado.dados.capitulo) || Historia.capitulo(1);
    this.add(`<div class="painel">
      <h2>Parada</h2>
      <p class="sussurro">Antes de seguir, você pode resolver algumas coisas. Cada atividade gasta tempo — e o tempo também conta.</p>
      <div id="escolhas" class="escolhas">
        <button class="escolha" onclick="Jogo.hubCentro()">Centro Pokémon — curar o time inteiro</button>
        <button class="escolha" onclick="Jogo.hubLoja()">Loja — comprar itens</button>
        <button class="escolha" onclick="Jogo.abrirGinasios('hub')">Ginásios — desafiar líderes de Kanto</button>
        <button class="escolha" onclick="Jogo.abrirLiga('hub')">Liga Pokémon — Elite 4 e Torneio Aberto</button>
        <button class="escolha" onclick="Jogo.hubTreinar()">Treinar na rota — encontro selvagem aleatório</button>
        <button class="escolha" onclick="Jogo.hubSoltar()">Soltar um Pokémon</button>
        <button class="escolha" onclick="Jogo.avancarCapitulo()">Seguir para o próximo capítulo</button>
      </div>
      <div id="avisos" class="avisos"></div>
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

    const cartao = g => {
      const st = statusGinasio(g);
      const cor = {conquistado:'var(--bom)', disponivel:'var(--destaque)',
                   recusado:'var(--ruim)', trancado:'var(--texto-fraco)', distante:'var(--texto-fraco)'}[st.estado];
      const time = timeGinasio(g).map(x=>`${DEX[x.dex].nome} Nv${x.nivel}`).join(' · ');
      const rotulo = st.estado === 'conquistado' ? '✓ conquistada' : st.texto;
      return `<div class="carta ginasio" style="border-color:${st.estado==='conquistado'?'var(--bom)':'var(--borda)'}">
        <div class="t"><span>${this.esc(g.lider)} <span class="cidade">· ${this.esc(g.cidade)}</span></span>
          ${g.tipo === 'variado' ? '<span class="tipo-tag" style="background:#8a8f98">Variado</span>' : this.tipoTag(g.tipo)}</div>
        <div class="fraco" style="margin-bottom:6px">${this.esc(g.insignia)} · níveis ${faixaGinasio(g)}</div>
        <div class="fraco" style="margin-bottom:8px;line-height:1.5">${this.esc(time)}</div>
        ${st.fala ? `<div class="aviso dano" style="margin-bottom:8px">${this.esc(st.fala)}</div>` : ''}
        ${st.estado!=='disponivel' && st.estado!=='conquistado' && g.comoDestravar
          ? `<div class="sussurro" style="margin:0 0 8px">${this.esc(g.comoDestravar)}</div>` : ''}
        ${st.estado==='conquistado' && g.efeito ? `<div class="fraco" style="color:var(--bom)">${this.esc(g.efeito)}</div>` : ''}
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
    const falas = (venceu ? g.vitoria : g.derrota)(Estado.dados).filter(Boolean);
    this.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">Ginásio de ${this.esc(g.cidade)}</div>
        <div class="tit">${venceu ? this.esc(g.insignia) : 'Derrota'}</div>
        <div class="loc">Líder ${this.esc(g.lider)} · tipo ${this.esc(g.tipo)}</div>
      </div>
      <div class="narrativa">${falas.map(t=>`<p>${this.esc(txt(t))}</p>`).join('')}</div>
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
      <div class="narrativa">${falaRival().map(t=>`<p>${this.esc(txt(t))}</p>`).join('')}</div>
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
      <div class="narrativa">${falaRivalExtra(R).filter(Boolean).map(t=>`<p>${this.esc(txt(t))}</p>`).join('')}</div>
      <div class="linha" style="margin-top:14px"><span class="k">Placar entre vocês</span>
        <span class="v">você ${reg.derrotas} × ${reg.vitorias} ${R.nome === 'Tunico' ? 'ele' : 'ele'}</span></div>
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

  telaResultadoRival(venceu, avisos, idExtra){
    this.limpar();
    this.add(this.topo());
    const extra = idExtra ? defRival(idExtra) : null;
    const reg = extra ? (registroRival(idExtra) || {vitorias:0, derrotas:0}) : rival();
    const nome = extra ? extra.nome : rival().nome;
    const falas = extra
      ? (venceu ? falaVitoriaRivalExtra(extra) : falaDerrotaRivalExtra(extra))
      : (venceu ? falaVitoriaRival() : falaDerrotaRival());
    this.add(`<div class="painel">
      <div class="cap-cabecalho"${extra ? ` style="border-left-color:${extra.cor || 'var(--destaque)'}"` : ''}>
        <div class="num">${venceu ? 'Você venceu' : 'Ele venceu'}</div>
        <div class="tit">${this.esc(nome)}</div>
        <div class="loc">Placar: você ${reg.derrotas} × ${reg.vitorias} ele</div>
      </div>
      <div class="narrativa">${falas.filter(Boolean).map(t=>`<p>${this.esc(txt(t))}</p>`).join('')}</div>
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
    const membros = ELITE4.map(m => {
      const substituto = m.titular && m.titular !== m.nome;
      return `<div class="linha"><span class="k">${m.ordem}. ${this.esc(m.nome)}
        <span class="fraco">· ${this.esc(m.tipo)}${substituto ? ' · na cadeira de ' + this.esc(m.titular) : ''}</span></span>
       <span class="v">Nv ${m.nivelBase}–${m.nivelBase + m.especies.length + 1}</span></div>`;
    }).join('');

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
          <div class="linha"><span class="k">Quartas</span><span class="v">${PREMIO_TORNEIO[0].dinheiro} ₽</span></div>
          <div class="linha"><span class="k">Semifinal</span><span class="v">${PREMIO_TORNEIO[1].dinheiro} ₽</span></div>
          <div class="linha"><span class="k">Final</span><span class="v">${PREMIO_TORNEIO[2].dinheiro} ₽</span></div>
          <div class="linha"><span class="k">Nível dos adversários</span><span class="v">~${nivelDoJogador()}</span></div>
          <div class="rodape">
            <span class="fraco">${this.esc(tor.texto)}</span>
            ${tor.estado==='disponivel' ? `<button class="btn destaque mini" onclick="Jogo.iniciarTorneio()">Inscrever-se</button>` : ''}
          </div>
        </div>
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
    this.add(`<div class="painel final">
      <div class="tit">${this.esc(final.titulo)}</div>
      ${final.texto.map(t=>`<p>${this.esc(txt(t))}</p>`).join('')}
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
        <button class="btn destaque" onclick="Jogo.novo()">Nova jornada</button>
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
      <div>${p.tipos.map(t=>this.tipoTag(t)).join('')}${p.status?`<span class="status-tag">${this.esc(p.status)}</span>`:''}</div>
      ${p.morto ? '<div class="sussurro" style="margin-top:8px">MORTO — '+this.esc(p.causaMorte)+'</div>' : this.barraHP(p)}
      <div class="sussurro" style="margin-top:7px">${p.naturezaVista
        ? this.esc(p.natureza) + ' — ' + this.esc((NATUREZAS[p.natureza]||{}).traco||'')
        : 'Natureza <b>???</b> — você ainda não entendeu o jeito dele. Convivência e Percepção resolvem isso.'}</div>
      <div class="sussurro">Moral ${p.moral}/100 ${p.moral<30?'· ele pode desobedecer':''}</div>
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
        ATK ${p.stats.atk} · DEF ${p.stats.def} · SPA ${p.stats.spa} · SPD ${p.stats.spd} · VEL ${p.stats.spe}</div>
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

    const ORDEM = ['Captura','Recuperação','Segurado','Evolução','Campo','Treinador','Vínculo','Ferramenta','Vestuário','Outro'];
    const grupos = {};
    itens.forEach(([n,q]) => {
      const c = categoriaItem(n);
      (grupos[c] = grupos[c] || []).push([n,q]);
    });

    const corpo = ORDEM.filter(c => grupos[c]).map(c => {
      const linhas = grupos[c].map(([n,q]) => {
        const info = ITENS_INFO[n] || {};
        const usavel = ['pedra','curaJogador','cura','revive','status','moral','repelente','pp','ppTodos'].includes(info.tipo)
                       && Estado.dados.modo !== 'batalha';
        const equipavel = info.tipo === 'equipar' && Estado.dados.modo !== 'batalha';
        const ebolsa = info.tipo === 'bolsa';
        const emUso = ebolsa && bolsa.nome === n;
        return `<div class="item-linha">
          <span class="qtd">×${q}</span>
          <span class="corpo">
            <span class="nome">${this.esc(n)}</span>
            <span class="ficha">${this.esc(fichaItem(n))}</span>
            ${info.desc ? `<span class="desc">${this.esc(descricaoItem(n))}</span>` : ''}
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

    if (info.tipo === 'curaJogador'){
      Estado.usarItem(nome); Estado.curarJogador(info.valor); Estado.salvar('auto');
      this.modal('', `<p>Você se cuida sozinho, sentado em algum lugar que não é confortável.</p>
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
      if (p.hp <= 0) msg = `${nomeExib(p)} está desmaiado. Potion não resolve isso.`;
      else { Estado.usarItem(nome); const a = p.hp; p.hp = Math.min(p.hpMax, p.hp + info.valor);
             msg = `${nomeExib(p)} recuperou ${p.hp - a} de HP.`; }
    } else if (info.tipo === 'revive'){
      if (p.hp > 0) msg = `${nomeExib(p)} não está desmaiado.`;
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
      <div class="linha"><span class="k">HP</span><span class="v">${j.hp} / ${Estado.hpMaxJogador()}</span></div>
      <div class="linha"><span class="k">Insígnias</span><span class="v">${d.insignias.filter(i=>i!=='Título de Campeão').length}/8</span></div>
      ${d.insignias.length ? d.insignias.map(i=>`<div class="linha"><span class="k" style="padding-left:12px">${this.esc(i)}</span><span class="v">✓</span></div>`).join('') : ''}
      <h3>Reputação — ${this.esc(nivel.nome)} (${eixo}, nível ${val}/8)</h3>
      <div class="rep-barra ${eixo}"><i style="width:${(val/8)*100}%"></i></div>
      <p class="sussurro">${this.esc(nivel.ef)}</p>
      <h3>Status</h3>${st}
      ${d.rival && d.npcs['Téo'] ? `<h3>Rival — ${this.esc(ARCOS_RIVAL[arcoRival()].nome)}</h3>
        <p class="sussurro">${this.esc(ARCOS_RIVAL[arcoRival()].resumo)}</p>
        <div class="linha"><span class="k">${this.esc(d.rival.nome)}</span><span class="v">você ${d.rival.derrotas} × ${d.rival.vitorias} ele</span></div>
        <div class="linha"><span class="k">Inicial dele</span><span class="v">${this.esc(DEX[d.rival.inicialDex].nome)}</span></div>` : ''}
      ${(typeof rivaisConquistados === 'function' && rivaisConquistados().length)
        ? '<h3>Rivais que você arrumou</h3>' + rivaisConquistados().map(({def, reg}) =>
            `<div class="linha"><span class="k">${this.esc(def.nome)} <span class="sussurro">${this.esc(def.desde)} · ${this.esc(def.origem)}</span></span>
             <span class="v">você ${reg.derrotas} × ${reg.vitorias} ele</span></div>`).join('')
        : ''}
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
        <span class="forma ins-${g.id}" style="--ins-cor:${sabe ? cor : 'transparent'}"></span>
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
          <div class="cartao-titulo">${this.esc(j.cargo || (campeao ? 'Campeão de Kanto' : 'Treinador registrado'))}</div>
          <div class="cartao-sinais">${this.esc(Estado.descricaoFisica())}</div>
          <div class="cartao-linha"><span class="k">Cidade natal</span><span class="v">${this.esc(j.cidade)}</span></div>
          <div class="cartao-linha"><span class="k">Na estrada há</span><span class="v">${d.relogio.dia} ${d.relogio.dia === 1 ? 'dia' : 'dias'}</span></div>
          <div class="cartao-linha grana"><span class="k">Dinheiro</span><span class="v mono">${j.dinheiro} ₽</span></div>
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
    const b = esp.base;
    const linha = (k, v, max) => `<div class="base-linha">
      <span class="k">${k}</span>
      <span class="barrinha"><i style="width:${Math.min(100, Math.round(v/max*100))}%"></i></span>
      <span class="v mono">${v}</span></div>`;
    this.modal('', `<div class="pokedex-topo">
        <span class="pokedex-lente"></span>
        <span class="pokedex-luzes"><i></i><i></i><i></i></span>
      </div>
      <div class="dex-ficha">
        <div class="cab"><span class="num">#${num}</span><span class="nomeg">${this.esc(esp.nome)}</span>
          <span style="margin-left:auto">${esp.tipos.map(t=>this.tipoTag(t)).join('')}</span></div>
        <div class="dex-arte">${imgSprite({dex, nome:esp.nome, shiny: Estado.brilhanteDe(dex) === 'capturado'}, 'frente')}</div>

        <h3 class="cat-item">Base</h3>
        ${linha('HP', b.hp, 255)}
        ${linha('Ataque', b.atk, 190)}
        ${linha('Defesa', b.def, 230)}
        ${linha('Sp. Atk', b.spa, 194)}
        ${linha('Sp. Def', b.spd, 230)}
        ${linha('Velocidade', b.spe, 150)}
        <div class="nota mono">Soma de base: ${esp.total}</div>

        <h3 class="cat-item">Ficha</h3>
        <div class="linha"><span class="k">Tipos</span><span class="v">${this.esc(esp.tipos.join(' / '))}</span></div>
        <div class="linha"><span class="k">Taxa de captura</span><span class="v">${esp.captura} <span class="fraco">(quanto maior, mais fácil)</span></span></div>
        <div class="linha"><span class="k">Evolução</span><span class="v">${esp.evo
          ? this.esc(DEX[esp.evo].nome) + (esp.nivelEvo ? ' — nível ' + esp.nivelEvo : ' — por pedra ou troca')
          : 'forma final'}</span></div>
        <div class="linha"><span class="k">Classificação</span><span class="v">${esp.lendario ? 'lendário' : 'comum'}</span></div>
        ${Estado.brilhanteDe(dex) ? `<div class="linha"><span class="k">Anomalia cromática</span><span class="v brilho-v">✦ ${Estado.brilhanteDe(dex) === 'capturado' ? 'exemplar brilhante no seu registro' : 'um exemplar brilhante avistado'}</span></div>` : ''}
        <div class="linha"><span class="k">Fraco contra</span><span class="v">${this.esc(this.fraquezas(esp.tipos).join(', ') || '—')}</span></div>
        <div class="linha"><span class="k">Resiste a</span><span class="v">${this.esc(this.resistencias(esp.tipos).join(', ') || '—')}</span></div>
      </div>
      <div style="margin-top:12px"><button class="btn" onclick="UI.modalPokedex()">Voltar à lista</button></div>`,
      true, 'pokedex');
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
    const total = CAPITULOS.reduce((n,c)=>n+Object.values(c.cenas).filter(x=>x.final).length,0);
    this.modal('Códice de finais', codice.length
      ? `<p class="sussurro">${codice.length} de ${total} descobertos.</p>` +
        codice.map(f=>`<div class="linha"><span class="k">${this.esc(f.titulo)}</span><span class="v">✓</span></div>`).join('')
      : `<p class="nada">Nenhum final descoberto ainda. A campanha tem ${total}.</p>`);
  },

  modalRegras(){
    this.modal('Regras do sistema', `
      <h3>Combate</h3>
      <div class="linha"><span class="k">Dano</span><span class="v">1d10 × (poder ÷ 10)</span></div>
      <div class="linha"><span class="k">Crítico</span><span class="v">1d20 = 20 → ×1,5</span></div>
      <div class="linha"><span class="k">Precisão</span><span class="v">1d20 > (100 − precisão) ÷ 5</span></div>
      <div class="linha"><span class="k">STAB</span><span class="v">×1,5</span></div>
      <div class="linha"><span class="k">Eficácia de tipo</span><span class="v">0× / 0,5× / 2×</span></div>
      <div class="linha"><span class="k">Fuga</span><span class="v">1d20 ≥ (Vel. selvagem − sua + 10)</span></div>
      <p class="sussurro">Extensão do sistema: o dano também é multiplicado pela razão entre o Ataque do atacante e a Defesa do alvo (limitada entre 0,45× e 2,2×), senão os stats dos jogos não teriam efeito nenhum. Ordem dos turnos é por Velocidade, com prioridade para golpes como Quick Attack.</p>
      <h3>Quando o seu Pokémon cai contra um selvagem</h3>
      <p class="sussurro">Se o selvagem tem natureza agressiva (Naughty, Brave, Adamant, Hasty, Impish, Jolly, Naive, Lonely, Rash), rola-se 1d20: com 10+ ele ataca VOCÊ. Dano = (Ataque dele ÷ 10) × 1d10. Naturezas passivas não atacam o treinador.</p>
      <h3>Morte</h3>
      <p class="sussurro">Em combate normal é desmaio — ele volta. Morte permanente só acontece por escolha narrativa: escudo, abandono, sacrifício, treino forçado, não intervir. Treinador com 0 HP = fim de jogo permanente.</p>
      ${Object.values(Estado.dados.lendarios||{}).some(l=>l.encontros) ? `
      <h3>Captura de lendários</h3>
      <p class="sussurro">${Estado.dados.flags.bola_fraca_em_lendario ? 'Poké Ball e Great Ball não funcionam — você viu.' : 'Bola comum parece não bastar, mas você ainda não testou.'}
      ${Estado.dados.flags.ultra_prende_lendario ? 'Ultra Ball: 1d20, só 1–2 prendem.' : ''}
      ${Estado.dados.flags.master_quase_sempre ? 'Master Ball normalmente captura.' : ''}
      ${Object.values(Estado.dados.lendarios||{}).some(l=>l.quebrouBola) ? 'E existem coisas que simplesmente quebram a bola no ar.' : ''}</p>` : ''}
      <h3>Perícias</h3>
      <p class="sussurro">1d10 + status contra a dificuldade. 1–3 fracasso · 4–6 parcial · 7–9 sucesso · 10+ crítico. Toda rolagem aparece na bandeja de dados, inclusive as que o jogo faz sozinho.</p>
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
      <div class="linha"><span class="k">Ginásio, Liga, conselho</span><span class="v">vale muito mais</span></div>
      <p class="sussurro">Consertar a calha da vizinha é uma coisa boa e não é notícia. Reputação é o que Kanto conta sobre você, então só muda de degrau o que foi grande o bastante para ser contado — ou o que aconteceu na frente de quem conta. Os dois eixos se pagam: enquanto você deve de um lado, o que você faz do outro serve primeiro para quitar.</p>

      <h3>O que você sabe</h3>
      <div class="linha"><span class="k">Espécie não catalogada</span><span class="v">aparece como ???</span></div>
      <div class="linha"><span class="k">Pokémon de treinador com apelido</span><span class="v">só o apelido</span></div>
      <div class="linha"><span class="k">Depois de apontar a Pokédex</span><span class="v">Apelido (Espécie)</span></div>
      <div class="linha"><span class="k">Ler a Pokédex em combate</span><span class="v">1× por batalha · não gasta o turno</span></div>
      <p class="sussurro">A natureza é do indivíduo, não da espécie. Nos seus, ela aparece sozinha depois de alguns combates juntos, por um teste de Percepção — quanto mais tempo com você, mais fácil. Nos dos outros, só pela Pokédex ou se o treinador falar. Líder de ginásio sempre fala.</p>

      <h3>Brilhantes</h3>
      <div class="linha"><span class="k">Frequência</span><span class="v">cerca de 1 em 1000</span></div>
      <div class="linha"><span class="k">Sorte</span><span class="v">cada ponto aperta a conta — no máximo, 1 em 300</span></div>
      <div class="linha"><span class="k">Status</span><span class="v">idênticos aos da espécie</span></div>
      <p class="sussurro">A cor é a única diferença, e é a diferença inteira. Um brilhante avistado fica marcado na Pokédex mesmo que escape; capturado, a marca muda. Evoluir não tira a cor.</p>

      <h3>Item segurado</h3>
      <div class="linha"><span class="k">Quantos</span><span class="v">1 por Pokémon</span></div>
      <div class="linha"><span class="k">Onde</span><span class="v">aba Time → equipar · ou Mochila → equipar</span></div>
      <p class="sussurro">Trocar devolve o anterior à mochila. O efeito de cada um está escrito na ficha técnica do item, em letra de máquina.</p>

      <h3>Dados</h3>
      <p class="sussurro">Toda rolagem do combate aparece na tela como dado de verdade, com o motivo embaixo. Dá pra clicar em qualquer um pra ver ele girar de novo — o resultado não muda, já está registrado. A bandeja embaixo é só pra girar por girar: não afeta nada.</p>`);
  }
};
