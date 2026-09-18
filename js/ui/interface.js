/* ============================================================
   INTERFACE
   ============================================================ */
const UI = {
  app:null, dadosRecentes:[],

  init(){ this.app = document.getElementById('app'); },

  /* ---------- helpers ---------- */
  esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); },
  el(html){ const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; },
  limpar(){ this.app.innerHTML = ''; },
  add(html){ const e = this.el(html); if (e) this.app.appendChild(e); return e; },
  tom(t){ document.body.setAttribute('data-tom', t || 'leve'); },
  rolarTopo(){ window.scrollTo({top:0, behavior:'smooth'}); },

  mostrarDado(reg){
    this.dadosRecentes.push(reg);
    if (this.dadosRecentes.length > 8) this.dadosRecentes.shift();
  },
  limparDados(){ this.dadosRecentes = []; },
  htmlDados(){
    if (!this.dadosRecentes.length) return '';
    return '<div style="margin-top:12px">' + this.dadosRecentes.map(d => {
      const cls = d.valor === d.faces ? ' max' : (d.valor === 1 ? ' min' : '');
      return `<span class="dado-caixa${cls}"><span class="mot">${this.esc(d.motivo||d.dado)}</span>
              <span class="mono">${d.dado}</span><span class="val">${d.valor}</span></span>`;
    }).join('') + '</div>';
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
        <div class="sub">${cap ? 'Cap. '+cap.num+' · '+this.esc(cap.titulo) : 'Kanto'} ·
          HP ${d.jogador.hp}/${Estado.hpMaxJogador()} · ${d.jogador.dinheiro} ₽ ·
          Dia ${d.relogio.dia}</div>
      </div>
      <div class="topo-acoes">
        <button class="btn mini" onclick="UI.modalTime()">Time</button>
        <button class="btn mini" onclick="UI.modalItens()">Mochila</button>
        <button class="btn mini" onclick="UI.modalFicha()">Ficha</button>
        <button class="btn mini" onclick="UI.modalDiario()">Diário</button>
        <button class="btn mini" onclick="UI.modalRota()">Rota</button>
        <button class="btn mini" onclick="Jogo.abrirGinasios('cena')">Ginásios${Estado.dados.insignias.filter(i=>i!=='Título de Campeão').length ? ' '+Estado.dados.insignias.filter(i=>i!=='Título de Campeão').length+'/8' : ''}</button>
        <button class="btn mini" onclick="Jogo.abrirLiga('cena')">Liga</button>
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
        Dois anos depois de Red desmontar a Equipe Rocket. As Aves Lendárias estão soltas.
        Mewtwo nunca foi capturado. Você tem quinze anos e vai sair de casa hoje.
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

    (cena.escolhas||[]).forEach((e, i) => {
      if (!Historia.disponivel(e)) return;
      c.appendChild(this.el(`<button class="escolha" onclick="Jogo.escolher(${i})">${this.esc(txt(e.texto))}</button>`));
    });
  },

  /* ========================================================
     COMBATE
     ======================================================== */
  telaBatalha(introLinhas){
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
    const card = (p, cls) => `<div class="lutador ${cls}">
      <div class="nome"><span>${this.esc(nomeExib(p))}</span><span class="nv">Nv ${p.nivel}</span></div>
      <div style="margin-top:5px">${p.tipos.map(t=>this.tipoTag(t)).join('')}${p.status?`<span class="status-tag">${this.esc(p.status)}</span>`:''}</div>
      ${this.barraHP(p)}
      <div class="meta">${this.esc(p.natureza)} · Vel ${p.stats.spe}${(NATUREZAS[p.natureza]||{}).agressiva?' · agressivo':''}</div>
    </div>`;
    document.getElementById('arena').innerHTML = card(a,'aliado') + card(i,'inimigo');
  },

  escreverLog(eventos){
    const log = document.getElementById('log');
    if (!log) return;
    (eventos||[]).forEach(e => log.appendChild(this.el(`<div class="l ${this.esc(e.tipo)}">${this.esc(e.texto)}</div>`)));
    log.scrollTop = log.scrollHeight;
    const dd = document.getElementById('dados');
    if (dd) dd.innerHTML = this.htmlDados();
  },

  acoesCombate(extra){
    const c = document.getElementById('acoes');
    if (!c) return;
    c.innerHTML = '';
    if (extra){ extra.forEach(h => c.appendChild(this.el(h))); return; }

    if (Batalha.fase === 'ameaca'){
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

    const a = Batalha.aliado;
    a.golpes.forEach((g, i) => {
      const G = GOLPES[g.nome];
      const ef = eficacia(G.t, Batalha.inimigo.tipos);
      const marca = ef === 0 ? ' (imune)' : ef >= 2 ? ' ✦' : ef <= 0.5 ? ' ·' : '';
      c.appendChild(this.el(`<button class="golpe-btn" ${g.pp<=0?'disabled':''} onclick="Jogo.acaoBatalha({tipo:'golpe',indice:${i}})">
        <span>${this.esc(g.nome)}${marca}<br><span class="pd">${G.t} · ${G.c==='status'?'status':(G.p||'—')} · ${G.a>=999?'∞':G.a+'%'}</span></span>
        <span class="pp">${g.pp}/${g.ppMax}</span></button>`));
    });
    c.appendChild(this.el(`<button class="golpe-btn" onclick="UI.menuBolas()"><span>Bola</span><span class="pd">capturar</span></button>`));
    c.appendChild(this.el(`<button class="golpe-btn" onclick="UI.menuItens()"><span>Item</span><span class="pd">mochila</span></button>`));
    c.appendChild(this.el(`<button class="golpe-btn" onclick="UI.menuTroca()"><span>Trocar</span><span class="pd">outro Pokémon</span></button>`));
    if (Batalha.fuga) c.appendChild(this.el(`<button class="golpe-btn" onclick="Jogo.acaoBatalha({tipo:'fugir'})"><span>Fugir</span><span class="pd">1d20</span></button>`));
  },

  menuBolas(){
    const bolas = Object.keys(Estado.dados.itens).filter(n => (ITENS_INFO[n]||{}).tipo === 'bola');
    if (!bolas.length) return this.modal('Mochila', '<p class="nada">Você não tem nenhuma bola.</p>');
    this.modal('Qual bola?', bolas.map(n =>
      `<button class="escolha" onclick="UI.fecharModal();Jogo.acaoBatalha({tipo:'bola',nome:'${n}'})">
        ${this.esc(n)} <span class="pd">×${Estado.contaItem(n)} — ${this.esc(ITENS_INFO[n].desc)}</span></button>`).join(''));
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
        ${this.esc(nomeExib(p))} — Nv ${p.nivel} · ${p.hp}/${p.hpMax} HP</button>`).join(''));
  },

  trocaObrigatoria(uids){
    const ps = uids.map(u => Estado.dados.time.find(p => p.uid === u)).filter(Boolean);
    this.modal('Quem entra agora?', ps.map(p =>
      `<button class="escolha" onclick="UI.fecharModal();Jogo.acaoBatalha({tipo:'trocar',uid:'${p.uid}'})">
        ${this.esc(nomeExib(p))} — Nv ${p.nivel} · ${p.hp}/${p.hpMax} HP</button>`).join(''), true);
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
        <button class="btn destaque" id="btn-seguir" onclick="Jogo.avancarCapitulo()">Continuar a jornada</button>
        <button class="btn" onclick="UI.telaHub()">Parar em uma cidade antes</button>
        <button class="btn" onclick="Jogo.abrirGinasios('fimCapitulo')">Ginásios (${Estado.dados.insignias.length}/8)</button>
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
      <div class="escolhas">
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
      <div class="escolhas" style="margin-top:20px">
        ${!venceu ? `<button class="escolha" onclick="Jogo.hubCentro()">Curar o time e tentar de novo</button>` : ''}
        <button class="escolha" onclick="Jogo.abrirGinasios('${this.esc(Jogo.voltarDeGinasio)}')">Voltar aos ginásios</button>
        <button class="escolha" onclick="Jogo.voltarDosGinasios()">Continuar a jornada</button>
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
    const membros = ELITE4.map(m =>
      `<div class="linha"><span class="k">${m.ordem}. ${this.esc(m.nome)} <span class="fraco">· ${this.esc(m.tipo)}</span></span>
       <span class="v">Nv ${m.nivelBase}–${m.nivelBase + m.especies.length + 1}</span></div>`).join('');

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
      <div class="escolhas" style="margin-top:20px">
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
      <div class="escolhas" style="margin-top:20px">
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
  modal(titulo, html, semFechar){
    this.fecharModal();
    const m = this.el(`<div class="modal-fundo" id="modal">
      <div class="modal">
        <h2>${this.esc(titulo)}</h2>
        <div>${html}</div>
        ${semFechar ? '' : '<div style="margin-top:18px"><button class="btn" onclick="UI.fecharModal()">Fechar</button></div>'}
      </div></div>`);
    document.body.appendChild(m);
    if (!semFechar) m.onclick = e => { if (e.target === m) this.fecharModal(); };
  },
  fecharModal(){ const m = document.getElementById('modal'); if (m) m.remove(); },

  modalTime(){
    const d = Estado.dados;
    const carta = p => `<div class="carta ${p.morto?'morto':''}">
      <div class="t"><span>${this.esc(nomeExib(p))}</span><span class="mono">Nv ${p.nivel}</span></div>
      <div>${p.tipos.map(t=>this.tipoTag(t)).join('')}${p.status?`<span class="status-tag">${this.esc(p.status)}</span>`:''}</div>
      ${p.morto ? '<div class="sussurro" style="margin-top:8px">MORTO — '+this.esc(p.causaMorte)+'</div>' : this.barraHP(p)}
      <div class="sussurro" style="margin-top:7px">${this.esc(p.natureza)} — ${this.esc((NATUREZAS[p.natureza]||{}).traco||'')}</div>
      <div class="sussurro">Moral ${p.moral}/100 ${p.moral<30?'· ele pode desobedecer':''}</div>
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
    const itens = Object.entries(d.itens);
    this.modal('Mochila', itens.length
      ? `<div style="margin-bottom:12px" class="linha"><span class="k">Dinheiro</span><span class="v">${d.jogador.dinheiro} ₽</span></div>` +
        itens.map(([n,q]) => `<div class="linha"><span class="k">${this.esc(n)} <span class="sussurro">${this.esc((ITENS_INFO[n]||{}).desc||'')}</span></span><span class="v">×${q}</span></div>`).join('')
      : '<p class="nada">Mochila vazia.</p>');
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
      <div class="linha"><span class="k">HP</span><span class="v">${j.hp} / ${Estado.hpMaxJogador()}</span></div>
      <div class="linha"><span class="k">Insígnias</span><span class="v">${d.insignias.filter(i=>i!=='Título de Campeão').length}/8</span></div>
      ${d.insignias.length ? d.insignias.map(i=>`<div class="linha"><span class="k" style="padding-left:12px">${this.esc(i)}</span><span class="v">✓</span></div>`).join('') : ''}
      <h3>Reputação — ${this.esc(nivel.nome)} (${eixo}, nível ${val}/8)</h3>
      <div class="rep-barra ${eixo}"><i style="width:${(val/8)*100}%"></i></div>
      <p class="sussurro">${this.esc(nivel.ef)}</p>
      <h3>Status</h3>${st}
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
      <h3>Captura de lendários</h3>
      <p class="sussurro">Poké Ball e Great Ball não funcionam. Ultra Ball: 1d20, só 1–2 capturam. Master Ball normalmente captura.
      <b>Mewtwo e Ho-Oh</b> rolam 1d20 antes: em 1–5 a bola quebra e ele fica furioso, te reconhece e te caça para sempre.</p>
      <h3>Perícias</h3>
      <p class="sussurro">1d10 + status contra a dificuldade. 1–3 fracasso · 4–6 parcial · 7–9 sucesso · 10+ crítico.</p>
      <h3>Reputação</h3>
      <p class="sussurro">Dois eixos de 8 níveis. Ações contrárias lavam o eixo oposto antes de subir o seu, e nada te devolve a "Desconhecido" — o mundo lembra.</p>`);
  }
};
