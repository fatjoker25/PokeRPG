/* ============================================================
   MISSÕES — o que está em aberto
   Foi pedido assim: uma aba de missões em aberto, com a do capítulo
   principal e as secundárias. Abre pelo botão do alto da tela
   (UI.modalMissoes), e o desenho mora em css/missoes.css.

   A da história é o capítulo:
     andamento — você está dentro dele (cena de capítulo que não
                 fechou): o número, o título, onde, e o fio dos
                 capítulos grandes (fio.js), a pergunta e as pontas
                 que você já puxou;
     espera    — o próximo, no lugar dele (Historia.proximoDestino):
                 o número, a chamada da âncora (ANCORAS) e o lugar, e a
                 porta fechada se faltar insígnia (travaDoCapitulo). O
                 título do capítulo que espera não aparece: ele aparece
                 como uma coisa no lugar;
     fim       — a história fechou e não tem capítulo pela frente.

   As secundárias são o que alguém te pediu ou marcou, cada uma com o
   que a pessoa disse e onde, nunca a solução:
     tarefa   — as tarefas da cidade (tarefas.js);
     favor    — o pedido de quem liga (pedidos.js);
     missao   — o pedido de um contato do PokéNav (faseDaMissao);
     recado   — quem separou alguma coisa e está numa cidade (recados.js);
     convite  — o convite de um veterano (veteranos.js);
     defesa   — o desafio marcado no seu ginásio ou na sua porta (defesa.js);
     rede     — a briga que um serviço da rede comprou (rede.js);
     intuicao — o que a intuição pede, depois que ela avisou (intuicao.js).
   Pronta (✓) é a que só falta entregar ou contar, e o botão do alto
   conta as prontas. Nada aqui cria registro no save: lê o que existe.
   ============================================================ */

const ORDEM_DAS_MISSOES = ['defesa', 'rede', 'favor', 'tarefa', 'missao', 'convite', 'recado', 'intuicao'];

/* a etiqueta e o desenho de cada jeito de missão (o desenho sai de icones.js) */
const TIPO_DE_MISSAO = {
  tarefa:  {nome:'Tarefa da cidade', icone:'exclama'},
  favor:   {nome:'Favor · PokéNav', icone:'telefone'},
  missao:  {nome:'Pedido · PokéNav', icone:'telefone'},
  recado:  {nome:'Recado', icone:'convite'},
  convite: {nome:'Convite', icone:'convite'},
  defesa:  {nome:'Desafio marcado', icone:'ginasio'},
  rede:    {nome:'A rede', icone:'rede'},
  intuicao:{nome:'Intuição', icone:'lua'}
};

const Missoes = {
  /* ---------- a da história ---------- */
  historia(d){
    d = d || (typeof Estado !== 'undefined' ? Estado.dados : null);
    if (!d || typeof Historia === 'undefined') return null;
    const fechados = d.capitulosFechados || [];
    const atual = Historia.capitulo(d.capitulo);
    if (d.modo === 'cena' && d.cena && atual && !fechados.includes(d.capitulo)){
      const fio = typeof Fio !== 'undefined' ? Fio.doCapitulo(d) : null;
      return {estado:'andamento', num:d.capitulo, rotulo:this.numero(atual), titulo:atual.titulo, onde:d.local, fio};
    }
    const dest = Historia.proximoDestino();
    if (!dest) return d.depoisDoFim ? {estado:'fim'} : null;
    const cap = Historia.capitulo(dest.num);
    const a = (typeof ANCORAS !== 'undefined' && ANCORAS[dest.num]) || {};
    const trava = typeof travaDoCapitulo === 'function' ? travaDoCapitulo(dest.num) : null;
    const qualquer = dest.local === '*';
    return {estado:'espera', num:dest.num, rotulo:this.numero(cap) || 'Capítulo ' + dest.num, chamada:a.chamada || '',
      onde:qualquer ? null : dest.local, aqui:qualquer || dest.local === d.local, trava};
  },
  numero(cap){ return cap ? (typeof numeroDoCapitulo === 'function' ? numeroDoCapitulo(cap) : 'Capítulo ' + cap.num) : ''; },

  /* ---------- as secundárias ---------- */
  secundarias(d){
    d = d || (typeof Estado !== 'undefined' ? Estado.dados : null);
    if (!d) return [];
    const out = [];
    const juntar = (fn) => { try { out.push(...(fn.call(this, d) || [])); } catch(e){ console.error('Missões:', e); } };
    juntar(this.deTarefas); juntar(this.doFavor); juntar(this.dosContatos); juntar(this.dosRecados);
    juntar(this.dosConvites); juntar(this.daDefesa); juntar(this.daRede); juntar(this.daIntuicao);
    /* a pronta primeiro, depois a que vence antes, depois pelo jeito */
    const ordem = m => ORDEM_DAS_MISSOES.indexOf(m.tipo);
    return out.sort((a, b) => (b.pronta - a.pronta)
      || ((a.prazo != null ? a.prazo : 999) - (b.prazo != null ? b.prazo : 999))
      || (ordem(a) - ordem(b)));
  },
  /* quantas só falta entregar ou contar: a conta do botão do alto */
  prontas(d){ return this.secundarias(d).filter(m => m.pronta).length; },

  /* as tarefas da cidade: o que a pessoa disse, o passo de agora e onde */
  deTarefas(d){
    if (typeof TAREFAS === 'undefined' || typeof Tarefas === 'undefined') return [];
    return TAREFAS.filter(t => Tarefas.aberta(t.id, d)).map(t => {
      const pronta = Tarefas.pronta(t, d), feito = Tarefas.passoFeito(t, d);
      const passo = t.passo && !feito;
      const L = LOCAIS[t.cidade] || {};
      return {tipo:'tarefa', id:t.id, titulo:t.titulo, quem:t.quem, rosto:this.rostoDe(t.quem), quadro:t.quadro,
        texto:t.lembrete,
        agora: pronta ? `Voltar pra ${t.quem}, ${emLocal(t.cidade)}.` : passo ? txt(t.passo.titulo) + '.' : (t.volta.falta || ''),
        onde: passo ? t.passo.onde : t.cidade, ondeQuem: passo ? null : `${t.quem}, ${L.nome || ''}`,
        progresso: Tarefas.progresso(t, d), pronta};
    });
  },

  /* o pedido de quem liga: o que foi pedido, o passo da vez, o prazo */
  doFavor(d){
    if (typeof Pedidos === 'undefined' || typeof PEDIDOS === 'undefined') return [];
    const p = Pedidos.atual();
    if (!p || !PEDIDOS[p.tipo]) return [];
    const c = typeof contatoPorId === 'function' ? contatoPorId(p.quem) : null;
    if (!c) return [];
    const T = PEDIDOS[p.tipo], x = Recados.contexto(c), nome = Recados.nomeNaNarracao(c);
    const pronta = Pedidos.pronto(p), travado = Pedidos.travado(p);
    const prazo = pronta || travado ? null : Math.max(0, p.ate - d.relogio.dia);
    return [{tipo:'favor', id:p.quem, titulo:cap1(T.resumo(p)) + '.', quem:cap1(textoContato(c, 'nome') || nome), rosto:this.rostoDoContato(c),
      texto:null, agora: pronta ? T.contar(p) + '.' : T.passo(x, p),
      onde: pronta ? null : Pedidos.proximoLugar(), prazo, pronta, nav:p.quem}];
  },

  /* o pedido escrito de um contato da agenda: o que ele quer (a dica),
     e, cumprido, ligar pra contar */
  dosContatos(d){
    if (!Estado.temPokenav() || typeof contatoPorId !== 'function') return [];
    const out = [];
    for (const c of Estado.contatosNaAgenda()){
      if (!c.missao) continue;
      const fase = Estado.faseDaMissao(c.id);
      if (fase !== 'fazendo' && fase !== 'entregar') continue;
      const nome = textoContato(c, 'nome') || '';
      const pronta = fase === 'entregar';
      out.push({tipo:'missao', id:c.id, titulo:`O pedido ${this.deQuem(nome)}`, quem:cap1(nome), rosto:this.rostoDoContato(c),
        texto:txt(c.missao.dica) || '', agora: pronta ? txt(c.missao.rotuloEntrega || 'Ligar e contar') + '.' : null,
        pronta, nav:c.id});
    }
    return out;
  },

  /* quem separou alguma coisa pra você e está numa cidade */
  dosRecados(d){
    const r = d.pokenav && d.pokenav.recados;
    if (!r || !r.presentes || typeof contatoPorId !== 'function') return [];
    return Object.entries(r.presentes).map(([cid, p]) => {
      const c = contatoPorId(cid);
      if (!c || !p || !LOCAIS[p.onde]) return null;
      const nome = Recados.nomeNaNarracao(c);
      return {tipo:'recado', id:cid, titulo: cid === 'casa' ? `Buscar o que ${nome} separou` : `Encontrar ${nome}`,
        quem:cap1(textoContato(c, 'nome') || nome), rosto:this.rostoDoContato(c),
        texto: cid === 'casa' ? 'Em cima da mesa, segundo o recado.' : 'O recado dizia que ia estar pela cidade.',
        onde:p.onde, nav:cid};
    }).filter(Boolean);
  },

  /* o convite que você aceitou e ainda não cumpriu */
  dosConvites(d){
    if (typeof VETERANOS === 'undefined' || typeof Veteranos === 'undefined') return [];
    return VETERANOS.filter(v => v.convite && Veteranos.convidado(v.id)).map(v => ({
      tipo:'convite', id:v.id, titulo:v.convite.titulo, quem:v.nome, rosto:this.rostoDe(v.nome),
      texto:v.convite.sub || '', onde:v.convite.local, quando:this.horaDoConvite(v.convite.hora)}));
  },
  horaDoConvite(h){
    if (!h || h.h == null) return null;
    const hora = `${String(h.h).padStart(2, '0')}h`;
    if (h.dia == null) return `às ${hora}`;
    /* 0 é segunda, como no Relogio.ateODia */
    const dia = typeof Calendario !== 'undefined' && Calendario.SEMANA ? Calendario.SEMANA[h.dia] : null;
    return dia ? `${maiuscula(dia)}, ${hora}` : hora;
  },

  /* o desafio marcado no seu ginásio e na sua porta */
  daDefesa(d){
    if (typeof Defesa === 'undefined') return [];
    const reg = d.defesa || {};
    const out = [];
    for (const tipo of ['lider', 'elite']){
      const r = reg[tipo], x = r && r.desafio;
      if (!x) continue;
      const g = tipo === 'lider';
      out.push({tipo:'defesa', id:tipo, titulo: g ? `Seu ginásio de ${cidadeDoGinasio(r.ginasio)}` : 'Sua porta na ala',
        quem:x.curto || x.nome, rosto:this.rostoDe(x.curto || x.nome) || this.rostoDe(x.nome), icone: g ? 'ginasio' : 'liga',
        texto:`${cap1(Defesa.apresentar(x))} ${g ? 'marcou desafio no ginásio' : 'pediu a sua porta'}${x.ins != null ? ', ' + Defesa.comInsignias(x.ins) : ''}.`,
        onde: g ? r.ginasio : 'planalto', prazo:Math.max(0, x.ate - d.relogio.dia)});
    }
    return out;
  },

  /* a briga que a escolha de um serviço comprou, esperando no ponto */
  daRede(d){
    const a = d.rede && d.rede.pendente;
    const s = a && typeof servicoDaRede === 'function' ? servicoDaRede(a.id) : null;
    if (!s) return [];
    return [{tipo:'rede', id:s.id, titulo:s.titulo, quem:null, icone:'rede',
      texto:'A escolha já foi feita. Falta a briga.', onde:s.local}];
  },

  /* a intuição: só depois que ela avisou, e com as palavras dela */
  daIntuicao(d){
    if (typeof Intuicao === 'undefined') return [];
    const p = Intuicao.pendente(d);
    if (!p || !d.intuicao || d.intuicao[p] == null) return [];
    return [{tipo:'intuicao', id:p, titulo:'A intuição', quem:null, icone:'lua',
      texto: p === 'entrega' ? 'Uma coisa sem nome puxa você de volta a Lavender.' : 'A intuição aponta pra Lavender de novo.',
      onde:'lavender'}];
  },

  /* ---------- rostos ---------- */
  rostoDe(nome){ return nome && typeof retratoDe === 'function' ? retratoDe(nome) : null; },
  /* o mesmo rosto da agenda do PokéNav (UI.navRosto) */
  rostoDoContato(c){
    if (!c) return null;
    if (c.id === 'casa' && typeof retratoDaCasa === 'function') return retratoDaCasa();
    const nome = textoContato(c, 'nome') || '';
    return this.rostoDe(nome) || (typeof c.nome === 'string' ? this.rostoDe(c.nome) : null) || (c.falaComo ? this.rostoDe(c.falaComo) : null);
  },
  /* "do zelador da Torre", "de Misty" */
  deQuem(nome){ return /^o /.test(nome) ? 'do ' + nome.slice(2) : /^a /.test(nome) ? 'da ' + nome.slice(2) : 'de ' + nome; },

  /* ---------- a janela ---------- */
  abrir(){
    const d = Estado.dados;
    if (!d) return;
    const h = this.historia(d), sec = this.secundarias(d);
    const prontas = sec.filter(m => m.pronta).length;
    const feitas = typeof TAREFAS !== 'undefined' && typeof Tarefas !== 'undefined' ? TAREFAS.filter(t => Tarefas.feita(t.id, d)) : [];
    const resumo = `<div class="ms-resumo" role="status">
      <span class="ms-conta"><b>${(h && h.estado !== 'fim' ? 1 : 0) + sec.length}</b> em aberto</span>
      ${prontas ? `<span class="ms-conta pronta"><b>${prontas}</b> ${prontas === 1 ? 'pronta' : 'prontas'} pra entregar</span>` : ''}
    </div>`;
    const html = `${resumo}
      <h3 class="ms-sec">História</h3>
      ${this.htmlHistoria(h)}
      <h3 class="ms-sec">Secundárias${sec.length ? ` <small>${sec.length}</small>` : ''}</h3>
      ${sec.length ? `<ul class="ms-lista">${sec.map(m => this.htmlCartao(m)).join('')}</ul>`
                   : '<p class="ms-nada">Nenhuma em aberto.</p>'}
      ${feitas.length ? `<div class="ms-feitas"><span>Tarefas cumpridas</span>${feitas.map(t =>
        `<span class="ms-feita" title="${UI.esc(t.titulo)}">${Tarefas.moeda(this.rostoDe(t.quem), null, 'pequena', t.quadro)}${UI.esc(t.quem)}</span>`).join('')}</div>` : ''}`;
    UI.modal('Missões', html, false, 'missoes');
  },

  /* o cartão da história: o capítulo que corre ou o que espera */
  htmlHistoria(h){
    if (!h) return '<p class="ms-nada">Nenhum capítulo em aberto.</p>';
    if (h.estado === 'fim') return `<div class="ms-historia fim"><span class="ms-medalha" aria-hidden="true">${svgIcone('liga')}</span>
      <div class="ms-h-corpo"><small class="ms-olho">A história</small><b class="ms-h-tit">A história de Kanto terminou.</b>
      <p class="ms-h-txt">O que vem daqui pra frente é a estrada.</p></div></div>`;
    const d = Estado.dados, L = h.onde ? LOCAIS[h.onde] : null;
    /* na medalha, o número do capítulo; no caminho e nas ilhas, a parte ("II") */
    const parte = /·\s*(\S+)\s*$/.exec(h.rotulo || '');
    const medalha = `<span class="ms-medalha${parte ? ' romano' : ''}" aria-hidden="true"><b>${UI.esc(parte ? parte[1] : String(h.num).split('.')[0])}</b></span>`;
    if (h.estado === 'andamento'){
      const F = h.fio;
      const fio = F ? `<div class="ms-fio">
          <p class="ms-pergunta">${UI.esc(F.pergunta)}</p>
          ${F.pontas.length ? `<ol class="ms-pontas">${F.pontas.map(p =>
            `<li><b>${UI.esc(p.nome)}</b><span>${UI.esc(p.texto)}</span></li>`).join('')}</ol>`
            : '<p class="ms-fio-nada">Nenhuma ponta puxada ainda.</p>'}
        </div>` : '';
      return `<div class="ms-historia andamento">${medalha}
        <div class="ms-h-corpo">
          <small class="ms-olho">${UI.esc(h.rotulo)} · em andamento</small>
          <b class="ms-h-tit">${UI.esc(h.titulo)}</b>
          ${L ? `<span class="ms-onde">${svgIcone('alfinete')}${UI.esc(L.nome)}</span>` : ''}
          ${fio}
        </div></div>`;
    }
    /* espera: a chamada, o lugar, a porta fechada e o que dá pra fazer daqui */
    const emCena = d.modo === 'cena' || emLuta();
    const temMapa = Estado.contaItem('Mapa de Kanto') > 0;
    const botoes = [];
    if (h.aqui && !h.trava && !emCena)
      botoes.push(`<button class="btn destaque ms-bt" onclick="UI.fecharModal(true);Exploracao.entrarNoArco()">${svgIcone('exclama')}Seguir</button>`);
    else if (!h.aqui && h.onde && temMapa && !emCena)
      botoes.push(`<button class="btn ms-bt" onclick="Missoes.verNoMapa('${h.onde}')">${svgIcone('mapa')}Ver no mapa</button>`);
    return `<div class="ms-historia espera${h.trava ? ' fechada' : ''}">${medalha}
      <div class="ms-h-corpo">
        <small class="ms-olho">${UI.esc(h.rotulo)} · ${h.aqui ? 'aqui' : 'espera você'}</small>
        ${h.chamada ? `<p class="ms-chamada">${UI.esc(h.chamada)}</p>` : ''}
        <div class="ms-meta">
          ${L ? `<span class="ms-onde">${svgIcone('alfinete')}${UI.esc(L.nome)}</span>` : ''}
          ${h.trava ? `<span class="ms-trava">${svgIcone('trancado')}${UI.esc(textoTrava(h.trava))}</span>` : ''}
        </div>
        ${botoes.length ? `<div class="ms-acoes">${botoes.join('')}</div>` : ''}
      </div></div>`;
  },

  /* um cartão de secundária: quem pediu, o que disse, o passo de agora, onde e o prazo */
  htmlCartao(m){
    const T = TIPO_DE_MISSAO[m.tipo] || {nome:'', icone:'info'};
    const L = m.onde ? LOCAIS[m.onde] : null;
    const d = Estado.dados, emCena = d.modo === 'cena' || emLuta();
    const moeda = m.rosto
      ? Tarefas.moeda(m.rosto, m.pronta ? 'pronta' : null, null, m.quadro)
      : `<span class="ms-ic" aria-hidden="true">${svgIcone(m.icone || T.icone)}</span>`;
    const prazo = m.prazo == null ? '' : `<span class="ms-prazo${m.prazo <= 1 ? ' urgente' : ''}">${svgIcone('relogio')}${
      m.prazo === 0 ? 'Último dia' : m.prazo === 1 ? 'Falta 1 dia' : `Faltam ${m.prazo} dias`}</span>`;
    const prog = m.progresso ? `<div class="ms-prog" style="--feito:${Math.round(m.progresso.tem / m.progresso.meta * 100)}%">
        ${typeof imgItem === 'function' ? imgItem(m.progresso.item) : ''}<span class="ms-prog-nome">${UI.esc(m.progresso.item)}</span>
        <span class="ms-prog-barra" aria-hidden="true"><i></i></span><span class="ms-prog-n">${m.progresso.tem} de ${m.progresso.meta}</span></div>` : '';
    const acoes = [];
    if (m.nav && Estado.temPokenav() && !emLuta())
      acoes.push(`<button class="ms-mini" onclick="UI.fecharModal(true);UI.modalNav('${UI.esc(m.nav)}')">${svgIcone('telefone')}PokéNav</button>`);
    if (L && !m.pronta && Estado.contaItem('Mapa de Kanto') > 0 && !emCena && m.onde !== d.local)
      acoes.push(`<button class="ms-mini" onclick="Missoes.verNoMapa('${UI.esc(m.onde)}')">${svgIcone('mapa')}Ver no mapa</button>`);
    return `<li class="ms-cartao${m.pronta ? ' pronta' : ''}" data-tipo="${m.tipo}">
      ${moeda}
      <div class="ms-c-corpo">
        <div class="ms-c-topo"><span class="ms-chip">${UI.esc(T.nome)}</span>${m.pronta ? '<span class="ms-ok">✓ Pronta</span>' : prazo}</div>
        <b class="ms-c-tit">${UI.esc(m.titulo)}</b>
        ${m.quem && !String(m.titulo).includes(m.quem) && !String(m.texto || '').includes(m.quem) ? `<span class="ms-quem">${UI.esc(m.quem)}</span>` : ''}
        ${m.texto ? `<p class="ms-c-txt">${UI.esc(m.texto)}</p>` : ''}
        ${m.agora ? `<p class="ms-agora">${UI.esc(m.agora)}</p>` : ''}
        ${prog}
        ${L || m.quando ? `<div class="ms-meta">${L ? `<span class="ms-onde${m.onde === d.local ? ' aqui' : ''}">${svgIcone('alfinete')}${
          UI.esc(m.onde === d.local ? `${L.nome} · você está aqui` : L.nome)}</span>` : ''}${
          m.quando ? `<span class="ms-quando">${svgIcone('relogio')}${UI.esc(m.quando)}</span>` : ''}</div>` : ''}
        ${acoes.length ? `<div class="ms-acoes">${acoes.join('')}</div>` : ''}
      </div></li>`;
  },

  /* o mapa aberto daqui volta pra cá ("‹ Missões"), com o lugar escolhido */
  verNoMapa(id){
    if (!LOCAIS[id] || typeof Exploracao === 'undefined') return;
    Exploracao.mapa('missoes', Exploracao.regiaoNoMapa(id), id);
  },
  /* a barra do mapa aberto pelas missões */
  barraDoMapa(){
    return `<nav class="volta-mochila volta-missoes" aria-label="Missões">
      <button class="aba-volta" onclick="UI.modalMissoes()">${svgIcone('missoes')}<span>Missões</span></button>
      <span class="aparelho-aberto">${typeof imgItem === 'function' ? imgItem('Mapa de Kanto') : svgIcone('mapa')}<span>Mapa de Kanto</span></span>
    </nav>`;
  }
};
