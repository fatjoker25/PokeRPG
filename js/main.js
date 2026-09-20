/* ============================================================
   JOGO — controle de fluxo
   ============================================================ */
const Jogo = {
  subidosNoCap: [],
  cenaBatalha: null,
  ginasioAtual: null,
  voltarDeGinasio: 'hub',
  eliteAtual: null,
  torneioAtual: null,
  rivalAtual: null,
  encontroRival: null,
  proxCapPendente: null,

  /* ---------- início ---------- */
  iniciar(){
    UI.init();
    UI.telaInicial();
  },

  novo(){
    if (Estado.existeSave('auto') && !confirm('Isso apaga a jornada atual. Continuar?')) return;
    Estado.apagarSave('auto');
    Estado.dados = null;
    UI.telaCriacao();
  },

  continuar(){
    if (!Estado.carregar('auto')) return UI.telaInicial();
    if (Estado.dados.modo === 'mundo' || !Estado.dados.cena){
      return Exploracao.tela([{tipo:'info', texto:'Você retoma o caminho de onde parou.'}]);
    }
    Historia.capAtual = Historia.capitulo(Estado.dados.capitulo);
    if (!Historia.capAtual) return Exploracao.tela();
    const cena = Historia.ir(Estado.dados.cena, false);
    UI.telaCena(cena, [{tipo:'info', texto:'Você retoma o caminho de onde parou.'}]);
  },

  criar(){
    const f = UI.lerCriacao();
    const erro = document.getElementById('f-erro');
    if (!f.nome){ erro.textContent = 'Seu personagem precisa de um nome.'; return; }
    if (!f.objetivo){ erro.textContent = 'Defina um objetivo — ele aparece na narrativa.'; return; }
    if (!f.personalidade) f.personalidade = 'reservado';
    if (!f.aparencia) f.aparencia = 'nada que chame atenção';
    if (!f.vestimenta) f.vestimenta = 'roupa comum e um casaco';

    Estado.novo(f);
    Estado.dados.config.danoMult = f.ritmo === 'longo' ? 0.6 : 1;
    Estado.dados.config.ritmo = f.ritmo;

    Mundo.iniciar(f.cidade);
    Estado.dados.itens = {};                     // a mochila começa vazia

    let inicial;
    if (f.inicial === 'rand'){
      /* Quem cresceu com você é filhote de alguma coisa que ainda vai
         virar outra: primeiro estágio de uma linha que tem evolução
         pela frente. Bicho de estágio único em Kanto — Electabuzz,
         Magmar, Tauros, Lapras, Onix — não nasce no quintal de
         ninguém em Pallet. Fóssil está extinto e só existe revivido
         em laboratório. Lendário e Ditto ficam de fora por motivo
         óbvio. */
      const FOSSEIS = [138,139,140,141,142];
      /* O Eevee guarda três destinos e por isso o campo evo dele está
         vazio: quem evolui por pedra entra pela tabela das pedras. */
      const porPedra = new Set();
      Object.values(PEDRAS).forEach(t => Object.keys(t).forEach(k => porPedra.add(+k)));
      const temFuturo = p => !!p.evo || porPedra.has(p.dex);
      const base = POOL_KANTO.filter(d => {
        const p = DEX[d];
        return temFuturo(p) && !p.preEvo && !FOSSEIS.includes(d) && ![132,151,150].includes(d);
      });
      inicial = criarPokemon(Dados.escolher(base), 5, {
        moral:100, naturezaVista:true,
        historia:'Cresceu com você desde pequeno. Vínculo máximo.'
      });
    } else {
      inicial = criarPokemon(parseInt(f.inicial,10), 5, {
        moral:80, naturezaVista:true,
        historia:'Entregue a você no dia em que a jornada começou.'
      });
    }
    Estado.adicionar(inicial);
    Estado.j.inicialDex = inicial.dex;          // Blue escolhe o contra do seu inicial
    iniciarRival();                             // e o rival escolhe o contra do seu também
    Estado.registrar(`${Estado.j.nome} saiu de ${Estado.j.cidade} com ${inicial.nome}.`);
    Estado.salvar('auto');

    const cena = Historia.iniciarCapitulo(1);
    UI.telaCena(cena, [{tipo:'pokemon', texto:`${inicial.nome} (Nv 5, ${inicial.natureza}) — ${(NATUREZAS[inicial.natureza]||{}).traco||''}`}]);
  },

  /* ---------- navegação ---------- */
  irPara(id, avisos){
    const cena = Historia.ir(id, true);
    avisos = (avisos||[]).concat(Historia.avisosCena||[]);
    Estado.salvar('auto');
    if (Estado.j.hp <= 0) return UI.telaGameOver('Você não aguentou os ferimentos.');
    if (this.ecoLivre){
      avisos = [{tipo:'eco', texto:this.ecoLivre}].concat(avisos||[]);
      this.ecoLivre = null;
    }
    UI.telaCena(cena, avisos);
  },

  escolher(i){
    const cena = Historia.cenaAtual;
    const e = (cena.escolhas||[])[i];
    if (!e) return;

    if (e.trocaNPC) return this.trocaComNPC(e);
    if (e.vendaTime) return this.venderDoTime(e);

    const avisos = Historia.aplicar(e.ef);
    if (Estado.j.hp <= 0) return UI.telaGameOver('Você não aguentou os ferimentos.');
    this.irPara(e.vai, avisos);
  },

  /* ---------- AÇÃO LIVRE: o jogador escreve o que faz ---------- */
  acaoLivre(){
    const campo = document.getElementById('acao-livre');
    if (!campo) return;
    const texto = campo.value.trim();
    if (!texto) return;
    campo.value = '';

    const cena = Historia.cenaAtual;
    const disponiveis = (cena.escolhas||[])
      .map((e,i)=>({e,i}))
      .filter(x => Historia.disponivel(x.e));

    const r = Entrada.interpretar(texto, disponiveis.map(x => x.e));
    if (!r) return;

    if (r.tipo === 'trilha'){
      const alvo = disponiveis[r.indice];
      this.ecoLivre = texto;
      return this.escolher(alvo.i);
    }

    // o jogo improvisa
    const imp = Entrada.improviso(r.intencao, cena);
    const avisos = [{tipo:'eco', texto:texto}];
    imp.texto.forEach(t => avisos.push({tipo:'info', texto:t}));
    if (imp.rep) Historia.aplicar({rep:imp.rep}).forEach(a => avisos.push(a));
    Estado.registrar(`Ação livre: "${texto}"`);
    Estado.salvar('auto');
    if (Estado.j.hp <= 0) return UI.telaGameOver('Você não aguentou.');
    UI.telaCena(Historia.ir(Estado.dados.cena, false), avisos);
  },

  observarCena(){
    const t = Dados.teste(Estado.j.status.percepcao, 5, 'Percepção');
    const cap = Historia.capAtual;
    const bons = [
      'Você para. Repara numa coisa que estava ali desde o começo e que você não tinha visto — e ela muda um pouco o peso do resto.',
      'Um detalhe que não muda o que dá pra fazer, mas muda o que significa fazer.',
      'Você olha as mãos das pessoas em vez do rosto. Mão mente menos.'
    ];
    const meios = [
      'Você olha mais um pouco e o que aparece é só o tempo passando.',
      'Nada novo. Mas você deixa de ter pressa, e isso vale alguma coisa.'
    ];
    const ruins = [
      'Você fica parado tempo demais e perde o fio.',
      'Olhar sem saber o que procurar é só demorar.'
    ];
    const linha = (t.grau==='critico'||t.grau==='sucesso') ? Dados.escolher(bons)
                : t.grau==='parcial' ? Dados.escolher(meios) : Dados.escolher(ruins);
    UI.telaCena(Historia.ir(Estado.dados.cena, false), [{tipo:'info', texto:linha}]);
  },

  /* ---------- teste de perícia ---------- */
  rolarTeste(){
    const t = Historia.cenaAtual.teste;
    UI.limparDados();
    const r = Dados.teste(Estado.j.status[t.status], t.dificuldade, t.nomeStatus);
    const destino = t[r.grau] || t.falha || t.parcial;
    const aviso = [{tipo: (r.grau==='falha'?'dano':r.grau==='critico'?'rep':'info'),
      texto:`1d10(${r.dado}) + ${t.nomeStatus||t.status}(${r.bonus}) = ${r.total} contra ${t.dificuldade} — ${r.texto}.`}];
    this.irPara(destino, aviso);
  },

  /* ---------- sacrifício ---------- */
  sacrificar(uid){
    const cena = Historia.cenaAtual;
    const avisos = Historia.aplicar({mataEscolhido: cena.sacrificio.causa, uidAlvo: uid});
    this.irPara(cena.sacrificio.vai, avisos);
  },

  /* ---------- batalha ---------- */
  iniciarBatalhaDaCena(){
    const cena = Historia.cenaAtual;
    const b = cena.batalha;
    this.cenaBatalha = b;

    const meu = Estado.primeiroApto();
    if (!meu){
      return this.irPara(b.derrota || b.vitoria,
        [{tipo:'dano', texto:'Você não tem nenhum Pokémon em pé. Não dá para lutar.'}]);
    }

    let inimigo, timeInimigo;
    if (b.comissao){
      // time de unidades fabricadas da Comissão
      const unidades = timeComissao(b.comissao, b.nivel || Historia.capAtual.nivelArea);
      inimigo = unidades[0];
      timeInimigo = unidades.slice(1);
    } else {
      if (b.aleatorio) inimigo = sortearSelvagem(b.ambiente || Historia.capAtual.ambiente, b.nivelBase || Historia.capAtual.nivelArea);
      else inimigo = criarPokemon(b.dex, b.nivel, {selvagem: b.tipo === 'selvagem' || b.tipo === 'lendario'});
      timeInimigo = (b.timeExtra||[]).map(x => criarPokemon(x.dex, x.nivel, {}));
    }
    const permiteFuga = (typeof b.fuga === 'boolean') ? b.fuga : true;

    UI.limparDados();
    Batalha.iniciar(meu, inimigo, {
      tipo: b.tipo || 'selvagem',
      fuga: permiteFuga,
      treinador: b.treinador,
      timeInimigo,
      introducao: b.intro
    });
    UI.telaBatalha();
  },

  acaoBatalha(acao){
    /* A leitura da Pokédex tem tela própria: varredura animada e ficha. */
    if (acao.tipo === 'pokedex') return UI.escaneamento();
    const r = Batalha.acao(acao);
    UI.escreverLog(r.eventos);
    UI.atualizarArena();

    if (r.precisaTrocar){ UI.trocaObrigatoria(r.reservas); return; }
    if (r.fim) return this.finalizarBatalha(r.fim);
    UI.acoesCombate();
    Estado.salvar('auto');
  },

  finalizarBatalha(fim){
    if (this.ginasioAtual)  return this.resultadoGinasio(fim);
    if (this.eliteAtual)    return this.resultadoElite(fim);
    if (this.torneioAtual)  return this.resultadoTorneio(fim);
    if (this.rivalAtual)    return this.resultadoRival(fim);
    const b = this.cenaBatalha || {};
    const rotaFuga = b.fuga2 || (typeof b.fuga === 'string' ? b.fuga : null);
    let destino, aviso;

    switch (fim.resultado){
      case 'gameover':
        return UI.telaGameOver('Um Pokémon selvagem te matou. Não tinha mais ninguém entre você e ele.');
      case 'vitoria':
        destino = b.vitoria; aviso = {tipo:'info', texto:'Você venceu.'}; break;
      case 'captura':
        destino = b.captura || b.vitoria; aviso = {tipo:'pokemon', texto:'Captura concluída.'}; break;
      case 'derrota':
        destino = b.derrota || b.vitoria; aviso = {tipo:'dano', texto:'Você perdeu essa.'}; break;
      case 'fuga': case 'escapou': case 'encarou':
        destino = rotaFuga || b.derrota || b.vitoria;
        aviso = {tipo:'info', texto: fim.resultado === 'encarou' ? 'Você encarou e ele recuou.' : 'Você escapou.'}; break;
      default:
        destino = b.vitoria || b.derrota;
    }

    // batalha que não pertence a nenhuma cena: veio da exploração
    if (!destino){
      const avisos = [aviso].filter(Boolean);
      Estado.salvar('auto');
      this.batalhaLivre = false;
      Exploracao.tela(avisos);
      return;
    }
    this.irPara(destino, [aviso].filter(Boolean));
  },

  /* ---------- fim de capítulo ---------- */
  fecharCapitulo(){
    this.subidosNoCap = [];
    const avisos = Historia.fecharCapitulo();
    /* o que você fez neste capítulo pode ter rendido um rival */
    const novos = (typeof conquistarRivais === 'function') ? conquistarRivais() : [];
    UI.telaFimCapitulo(avisos.concat(novos.map(a => a.texto)));
  },

  gastarPonto(chave){
    const j = Estado.j;
    if (j.pontos <= 0 || this.subidosNoCap.includes(chave)) return;
    if (!Estado.subirStatus(chave)) return;
    j.pontos--;
    this.subidosNoCap.push(chave);
    Estado.salvar('auto');
    UI.telaFimCapitulo();
    // repinta mantendo o estado de travas
  },

  voltarAoMundo(){
    if (Estado.j.pontos > 0 && !confirm('Você ainda tem pontos para distribuir. Seguir mesmo assim? (Eles ficam guardados.)')) return;
    const prox = Estado.dados.capitulo + 1;
    const enc = rivalDeveAparecer(prox);
    if (enc){
      this.encontroRival = enc;
      this.proxCapPendente = null;
      return UI.telaRival();
    }
    Estado.salvar('auto');
    Exploracao.tela();
  },

  avancarCapitulo(){
    if (Estado.j.pontos > 0 && !confirm('Você ainda tem pontos para distribuir. Seguir mesmo assim? (Eles ficam guardados.)')) return;
    const prox = Historia.proximoCapitulo();
    if (!prox){
      return UI.telaFinal({titulo:'A JORNADA CONTINUA', texto:[
        'Você chegou ao fim do que está escrito. O resto é estrada.',
        'Kanto continua exatamente do jeito que você deixou — e essa é a parte que importa.'
      ]});
    }
    // um rival aparece na estrada entre um capítulo e outro
    const enc = rivalDeveAparecer(prox);
    if (enc){
      this.encontroRival = enc;
      this.proxCapPendente = prox;
      return UI.telaRival();
    }
    const cena = Historia.iniciarCapitulo(prox);
    Estado.salvar('auto');
    UI.telaCena(cena, Historia.resumo().map(t => ({tipo:'info', texto:t})));
  },

  mostrarFinal(){
    const cena = Historia.cenaAtual;
    Estado.registrar('FIM: ' + cena.final.titulo);
    Estado.salvar('auto');
    UI.telaFinal(cena.final);
  },

  /* ---------- HUB ---------- */
  hubCentro(){
    Estado.dados.time.forEach(curarTotal);
    Estado.curarJogador(8);
    Estado.dados.relogio.dia++;
    Estado.salvar('auto');
    UI.telaHub();
    UI.avisos([{tipo:'cura', texto:'Time curado. Você dormiu em cama de verdade e recuperou 8 de HP.'}]);
  },

  hubLoja(){ return Cidade.loja(); },
  comprar(nome, preco){ return Cidade.comprar(nome, preco); },

  hubTreinar(){
    const meu = Estado.primeiroApto();
    if (!meu){ UI.modal('Treinar', '<p class="nada">Nenhum Pokémon em pé. Cure o time antes.</p>'); return; }
    const cap = Historia.capitulo(Estado.dados.capitulo) || Historia.capitulo(1);
    const wild = sortearSelvagem(cap.ambiente, cap.nivelArea);
    this.cenaBatalha = null;
    Estado.dados.relogio.dia++;
    UI.limparDados();
    Batalha.iniciar(meu, wild, {tipo:'selvagem', fuga:true});
    UI.telaBatalha();
  },

  hubSoltar(){
    const time = Estado.dados.time;
    if (!time.length) return UI.modal('Soltar', '<p class="nada">Você não tem ninguém.</p>');
    UI.modal('Soltar quem?', time.map(p =>
      `<button class="escolha" onclick="Jogo.confirmarSoltar('${p.uid}')">
        ${UI.esc(nomeExib(p))} — Nv ${p.nivel}, moral ${p.moral}${p.lendario?' · LENDÁRIO':''}</button>`).join('') +
      '<p class="sussurro" style="margin-top:12px">Soltar é permanente. Soltar um lendário muda o mundo.</p>');
  },

  confirmarSoltar(uid){
    const p = Estado.dados.time.find(x => x.uid === uid);
    if (!p) return;
    if (!confirm('Soltar ' + nomeExib(p) + '? Isso é permanente.')) return;
    const eventos = Captura.soltar(p);
    UI.fecharModal();
    Estado.salvar('auto');
    UI.telaHub();
    UI.avisos(eventos.map(e => ({tipo:e.tipo, texto:e.texto})));
  },

  /* ---------- GINÁSIOS ---------- */
  abrirGinasios(de){
    this.voltarDeGinasio = de || 'hub';
    UI.telaGinasios();
  },

  voltarDosGinasios(){
    if (this.voltarDeGinasio === 'exploracao') return Exploracao.tela();
    if (this.voltarDeGinasio === 'cena' && Historia.cenaAtual){
      UI.telaCena(Historia.ir(Estado.dados.cena));
    } else if (this.voltarDeGinasio === 'fimCapitulo'){
      UI.telaFimCapitulo();
    } else {
      UI.telaHub();
    }
  },

  desafiarGinasio(id){
    const g = ginasioPorId(id);
    if (!g) return;
    const st = statusGinasio(g);
    if (st.estado !== 'disponivel') return UI.telaGinasios();

    const meu = Estado.primeiroApto();
    if (!meu) return UI.modal('Ginásio', '<p class="nada">Nenhum Pokémon em pé. Cure o time antes de desafiar um líder.</p>');

    const time = timeGinasio(g).map(x => criarPokemon(x.dex, x.nivel, {}));
    this.ginasioAtual = g;
    this.cenaBatalha = null;
    Estado.registrar(`Desafiou ${g.lider} no Ginásio de ${g.cidade}.`);
    UI.limparDados();
    Batalha.iniciar(meu, time[0], {
      tipo:'treinador', fuga:false, treinador:`Líder ${g.lider}`,
      timeInimigo: time.slice(1),
      revelarNatureza: true,   // líder e nome grande falam do próprio time
      introducao: `${g.lider} enviou ${nomeVisivel(time[0])} (Nv ${time[0].nivel})!`
    });
    UI.telaBatalha(g.intro ? g.intro(Estado.dados).filter(Boolean) : null);
  },

  resultadoGinasio(fim){
    const g = this.ginasioAtual;
    this.ginasioAtual = null;
    if (fim.resultado === 'gameover'){
      return UI.telaGameOver('Você caiu num ginásio. Não devia ser possível, e foi.');
    }
    const venceu = fim.resultado === 'vitoria';
    const avisos = [];

    if (venceu){
      Estado.dados.insignias.push(g.insignia);
      avisos.push({tipo:'insignia', texto:`Insígnia conquistada: ${g.insignia} (${Estado.dados.insignias.length}/8)`});
      const p = g.premio || {};
      if (p.dinheiro){
        const mult = (fim && fim.bonusDinheiro) || 1;
        const val = Math.round(p.dinheiro * mult);
        Estado.j.dinheiro += val;
        avisos.push({tipo:'item', texto:`+${val} ₽${mult > 1 ? ' (Amuleto de Moeda)' : ''}`});
      }
      if (p.itens) for (const [n,q] of Object.entries(p.itens)){ Estado.darItem(n,q); avisos.push({tipo:'item', texto:`Recebeu ${q}× ${n}.`}); }
      if (p.rep){
        const r = Estado.mudarRep('bom', p.rep, `Venceu o Ginásio de ${g.cidade}`, {rep:{notorio:true, peso:10}});
        if (r && r.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
      }
      if (p.status && Estado.subirStatus(p.status)){
        avisos.push({tipo:'rep', texto:`${p.status.toUpperCase()} +1 — ${g.efeito}`});
      } else if (g.efeito){
        avisos.push({tipo:'info', texto:g.efeito});
      }
      Estado.registrar(`Venceu ${g.lider} e conquistou a ${g.insignia}.`);
      if (Estado.dados.insignias.length === 8){
        avisos.push({tipo:'rep', texto:'Oito insígnias. Kanto inteira está aberta para você.'});
        Estado.marcar('oito_insignias');
        const r = Estado.mudarRep('bom', 2, 'Conquistou as oito insígnias de Kanto', {rep:{notorio:true, peso:4}});
        if (r && r.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
      }
    } else {
      Estado.registrar(`Perdeu para ${g.lider} no Ginásio de ${g.cidade}.`);
    }
    Estado.salvar('auto');
    UI.telaResultadoGinasio(g, venceu, avisos);
  },

  /* ---------- O RIVAL ---------- */
  lutarRival(){
    const enc = this.encontroRival || {tipo:'teo'};
    const R = enc.tipo === 'extra' ? defRival(enc.id) : null;
    const nome = R ? R.nome : 'Téo';
    const meu = Estado.primeiroApto();
    if (!meu) return UI.modal(nome, '<p class="nada">Nenhum Pokémon em pé. Ele espera — mas cure o time antes.</p>');
    const time = R ? timeRivalExtra(R) : timeRival();
    this.rivalAtual = R ? {extra:R.id} : {arco: arcoRival()};
    this.cenaBatalha = null; this.ginasioAtual = null; this.eliteAtual = null; this.torneioAtual = null;
    UI.limparDados();
    Batalha.iniciar(meu, time[0], {
      tipo:'treinador', fuga:false, treinador:nome,
      timeInimigo: time.slice(1),
      introducao: `${nome} enviou ${nomeVisivel(time[0])} (Nv ${time[0].nivel})!`
    });
    UI.telaBatalha(R ? falaRivalExtra(R) : falaRival());
  },

  resultadoRival(fim){
    /* rival conquistado tem caminho próprio */
    if (this.rivalAtual && this.rivalAtual.extra) return this.resultadoRivalExtra(fim, this.rivalAtual.extra);
    const arco = this.rivalAtual ? this.rivalAtual.arco : arcoRival();
    this.rivalAtual = null;
    if (fim.resultado === 'gameover') return UI.telaGameOver('Você caiu numa batalha contra alguém que te conhece desde a Rota 1.');

    const venceu = fim.resultado === 'vitoria';
    registrarResultadoRival(venceu);
    const avisos = [];
    const npc = Estado.dados.npcs['Téo'];

    if (venceu){
      if (arco === 'parceiro'){ Estado.j.dinheiro += 3000; avisos.push({tipo:'item', texto:'+3.000 ₽ — ele dividiu o que tinha no bolso.'}); }
      if (arco === 'perseguidor'){
        Estado.lembrarNPC('Téo', {opiniao:(npc?npc.opiniao:0)-1, memoria:'Tentou te parar e perdeu. Ajoelhou no chão e pediu para você parar.'});
        avisos.push({tipo:'dano', texto:'Ele pediu para você parar. Você venceu a batalha.'});
      } else {
        Estado.lembrarNPC('Téo', {memoria:`Perdeu para você de novo. Placar ${rival().derrotas}×${rival().vitorias}.`});
      }
      const evs = ganharExp(Estado.primeiroApto() || Estado.dados.time[0], 400);
    } else {
      if (arco === 'perseguidor'){
        Estado.lembrarNPC('Téo', {opiniao:(npc?npc.opiniao:0)+1, memoria:'Te venceu e mandou você voltar para casa.'});
        avisos.push({tipo:'info', texto:'Ele ficou entre você e o caminho.'});
      }
      Estado.j.dinheiro = Math.max(0, Estado.j.dinheiro - 800);
      avisos.push({tipo:'item', texto:'−800 ₽'});
    }
    Estado.salvar('auto');
    UI.telaResultadoRival(venceu, avisos);
  },

  resultadoRivalExtra(fim, id){
    this.rivalAtual = null;
    const R = defRival(id);
    if (fim.resultado === 'gameover')
      return UI.telaGameOver(`Você caiu numa batalha contra ${R.nome}, que virou seu rival por causa de uma escolha sua.`);

    const venceu = fim.resultado === 'vitoria';
    registrarResultadoRivalExtra(id, venceu);
    const avisos = [];
    const npc = Estado.dados.npcs[R.npc];
    const op = npc ? npc.opiniao : 0;

    if (venceu){
      Estado.lembrarNPC(R.npc, {memoria:`Perdeu para você de novo. ${R.nome} continua vindo.`});
      ganharExp(Estado.primeiroApto() || Estado.dados.time[0], 380);
      if (id === 'vasco'){
        Estado.lembrarNPC(R.npc, {opiniao: op - 1, memoria:'Perdeu de novo e não pareceu se importar com isso.'});
        avisos.push({tipo:'dano', texto:'Ele vai voltar. Ele disse isso de um jeito que não é ameaça e é pior.'});
      }
    } else {
      Estado.lembrarNPC(R.npc, {opiniao: op + 1, memoria:`Te venceu. Placar ${registroRival(id).derrotas}×${registroRival(id).vitorias}.`});
      const perda = id === 'vasco' ? 1200 : 700;
      Estado.j.dinheiro = Math.max(0, Estado.j.dinheiro - perda);
      avisos.push({tipo:'item', texto:`−${perda} ₽`});
    }
    Estado.salvar('auto');
    UI.telaResultadoRival(venceu, avisos, id);
  },

  seguirDepoisDoRival(){
    this.encontroRival = null;
    const prox = this.proxCapPendente;
    this.proxCapPendente = null;
    if (!prox) return Exploracao.tela();
    const cena = Historia.iniciarCapitulo(prox);
    Estado.salvar('auto');
    UI.telaCena(cena, Historia.resumo().map(t => ({tipo:'info', texto:t})));
  },

  evitarRival(){
    const enc = this.encontroRival || {tipo:'teo'};
    const cap = this.proxCapPendente || Estado.dados.capitulo;
    if (enc.tipo === 'extra'){
      const R = defRival(enc.id);
      const reg = registroRival(enc.id);
      if (reg) reg.ultimoCap = cap;
      const npc = Estado.dados.npcs[R.npc];
      Estado.lembrarNPC(R.npc, {opiniao:(npc?npc.opiniao:0)-1, memoria:'Você passou por ele sem parar.'});
      Estado.registrar(`Evitou o encontro com ${R.nome}.`);
    } else {
      const r = rival();
      r.ultimoCap = cap;
      const npc = Estado.dados.npcs['Téo'];
      Estado.lembrarNPC('Téo', {opiniao:(npc?npc.opiniao:0)-1, memoria:'Você passou por ele sem parar.'});
      Estado.registrar('Evitou o encontro com Téo.');
    }
    Estado.salvar('auto');
    this.seguirDepoisDoRival();
  },

  /* ---------- LIGA: ELITE 4, CAMPEÃO E TORNEIO ---------- */
  abrirLiga(de){
    this.voltarDeGinasio = de || 'hub';
    UI.telaLiga();
  },

  /* ── Elite 4 ── */
  iniciarElite4(){
    if (statusElite4().estado !== 'disponivel') return UI.telaLiga();
    const meu = Estado.primeiroApto();
    if (!meu) return UI.modal('Elite 4', '<p class="nada">Nenhum Pokémon em pé. A ala não tem Centro Pokémon — cure antes de entrar.</p>');
    this.eliteAtual = {indice:0, campeao:false};
    Estado.registrar('Entrou na ala da Elite 4.');
    this.batalhaElite();
  },

  batalhaElite(){
    const e = this.eliteAtual;
    const meu = Estado.primeiroApto();
    if (!meu) return this.resultadoElite({resultado:'derrota'});

    const alvo = e.campeao ? CAMPEAO : ELITE4[e.indice];
    const nivel = alvo.nivelBase;
    const time = alvo.especies.map((dex,i) =>
      criarPokemon(dex, nivel + i, {apelido: (alvo.apelidos||{})[dex] || null}));
    if (time.length) time[time.length-1].nivel += 2;

    this.cenaBatalha = null; this.ginasioAtual = null; this.torneioAtual = null;
    UI.limparDados();
    Batalha.iniciar(meu, time[0], {
      tipo:'treinador', fuga:false,
      treinador: e.campeao ? 'Red' : alvo.nome,
      timeInimigo: time.slice(1),
      revelarNatureza: true,   // líder e nome grande falam do próprio time
      introducao: `${alvo.nome} enviou ${nomeVisivel(time[0])} (Nv ${time[0].nivel})!`
    });
    UI.telaBatalha(alvo.intro(Estado.dados).filter(Boolean));
  },

  resultadoElite(fim){
    const e = this.eliteAtual;
    if (fim.resultado === 'gameover'){ this.eliteAtual = null; return UI.telaGameOver('Você caiu dentro do Planalto Indigo.'); }

    const venceu = fim.resultado === 'vitoria';
    const alvo = e.campeao ? CAMPEAO : ELITE4[e.indice];

    if (!venceu){
      this.eliteAtual = null;
      Estado.registrar(`Perdeu para ${alvo.nome} na Elite 4.`);
      Estado.salvar('auto');
      return UI.telaResultadoLiga({
        titulo: e.campeao ? 'O Campeão' : `${alvo.nome} venceu`,
        sub: e.campeao ? 'Salão do Campeão' : `Elite 4 · ${alvo.ordem} de 4`,
        falas: e.campeao ? CAMPEAO.derrota(Estado.dados) : [
          `Você perde para ${alvo.nome}.`,
          'A ala da Elite 4 tem uma regra só e a regra é essa: perdeu, sai. Do começo.',
          'Alguém do staff te acompanha até o corredor principal com uma educação que dói mais que deboche.'
        ],
        avisos: [], venceu:false
      });
    }

    const avisos = [];
    if (e.campeao){
      // CAMPEÃO DE KANTO
      this.eliteAtual = null;
      Estado.marcar('campeao_de_kanto');
      Estado.j.cargo = 'Campeão de Kanto';
      Estado.dados.insignias.push('Título de Campeão');
      Estado.j.dinheiro += 80000;
      Estado.darItem('Master Ball', 1);
      Estado.darItem('Hyper Potion', 5);
      Estado.darItem('Full Heal', 5);
      const r = Estado.mudarRep('bom', 3, 'Venceu Red e assumiu a cadeira de Campeão de Kanto', {rep:{notorio:true, peso:8}});
      avisos.push({tipo:'insignia', texto:'Você é o Campeão de Kanto. A cadeira estava vaga há dois anos.'});
      avisos.push({tipo:'item', texto:'+80.000 ₽ · Master Ball · 5× Hyper Potion · 5× Full Heal'});
      /* A carta de atualização. Ela é a última coisa que a Liga faz
         por você como desafiante e a primeira que faz como Campeão. */
      Estado.marcar('dex_nacional');
      Estado.marcar('johto_liberado');
      avisos.push({tipo:'pokedex', texto:'A Pokédex trava por quatro segundos e reinicia sozinha. Quando volta, a lista não termina mais no 151.'});
      avisos.push({tipo:'mundo', texto:'Cem registros novos, todos vazios. E a fronteira do norte, que ninguém cruzava sem autorização da Liga, agora é sua para autorizar.'});
      Estado.registrar('Pokédex Nacional liberada: 251 registros. Johto aberto.');
      if (r && r.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
      Estado.registrar('Venceu Red. Tornou-se Campeão de Kanto.');
      Estado.salvar('auto');
      return UI.telaResultadoLiga({
        titulo:'CAMPEÃO DE KANTO', sub:'Salão do Campeão',
        falas: CAMPEAO.vitoria(Estado.dados), avisos, venceu:true, campeao:true
      });
    }

    // próximo membro da Elite 4
    e.indice++;
    Estado.registrar(`Venceu ${alvo.nome} na Elite 4.`);
    const acabou = e.indice >= ELITE4.length;
    if (acabou) e.campeao = true;
    Estado.salvar('auto');
    UI.telaResultadoLiga({
      titulo: `${alvo.nome} derrotado`,
      sub: acabou ? 'A porta do fundo está aberta' : `Elite 4 · ${alvo.ordem} de 4`,
      falas: alvo.vitoria(Estado.dados),
      avisos: [{tipo:'info', texto:'Seu time NÃO é curado entre as salas. Use itens se precisar.'}],
      venceu:true, continuar:true
    });
  },

  continuarElite(){
    if (!this.eliteAtual) return UI.telaLiga();
    this.batalhaElite();
  },

  sairDaElite(){
    this.eliteAtual = null;
    UI.telaLiga();
  },

  /* ── Torneio ── */
  iniciarTorneio(){
    const st = statusTorneio();
    if (st.estado !== 'disponivel') return UI.telaLiga();
    const meu = Estado.primeiroApto();
    if (!meu) return UI.modal('Torneio', '<p class="nada">Nenhum Pokémon em pé. Cure o time antes de se inscrever.</p>');
    Estado.j.dinheiro -= INSCRICAO_TORNEIO;
    this.torneioAtual = {rodada:0, adversarios: montarChaveamento()};
    Estado.registrar('Inscreveu-se no Torneio Aberto da Liga.');
    UI.telaTorneio();
  },

  lutarRodadaTorneio(){
    const t = this.torneioAtual;
    if (!t) return UI.telaLiga();
    const meu = Estado.primeiroApto();
    if (!meu) return this.resultadoTorneio({resultado:'derrota'});
    const adv = t.adversarios[t.rodada];
    this.cenaBatalha = null; this.ginasioAtual = null; this.eliteAtual = null;
    UI.limparDados();
    Batalha.iniciar(meu, adv.time[0], {
      tipo:'treinador', fuga:false, treinador: adv.nome,
      timeInimigo: adv.time.slice(1),
      revelarNatureza: true,   // líder e nome grande falam do próprio time
      introducao: `${adv.nome} enviou ${nomeVisivel(adv.time[0])} (Nv ${adv.time[0].nivel})!`
    });
    UI.telaBatalha([`${PREMIO_TORNEIO[t.rodada].rodada} — ${adv.nome}`, adv.fala]);
  },

  resultadoTorneio(fim){
    const t = this.torneioAtual;
    if (fim.resultado === 'gameover'){ this.torneioAtual = null; return UI.telaGameOver('Você caiu numa arena de torneio, na frente de todo mundo.'); }

    const adv = t.adversarios[t.rodada];
    const premio = PREMIO_TORNEIO[t.rodada];
    const venceu = fim.resultado === 'vitoria';
    const avisos = [];

    if (!venceu){
      this.torneioAtual = null;
      const consolo = Math.round(premio.dinheiro * 0.3);
      Estado.j.dinheiro += consolo;
      avisos.push({tipo:'item', texto:`Premiação por participação: +${consolo} ₽`});
      Estado.registrar(`Eliminado do torneio por ${adv.nome} nas ${premio.rodada}.`);
      Estado.salvar('auto');
      return UI.telaResultadoLiga({
        titulo:'Eliminado', sub:`${premio.rodada} · ${adv.nome}`,
        falas:[
          `${adv.nome} vence e a arena bate palma pelo nome dele, não pelo seu.`,
          'Torneio é assim: o chaveamento não tem memória. Amanhã tem outro.',
          'Você recebe a premiação por participação num envelope com o logotipo da Liga e o seu nome escrito errado.'
        ],
        avisos, venceu:false
      });
    }

    Estado.j.dinheiro += premio.dinheiro;
    avisos.push({tipo:'item', texto:`+${premio.dinheiro} ₽`});
    for (const [n,q] of Object.entries(premio.itens||{})){ Estado.darItem(n,q); avisos.push({tipo:'item', texto:`Recebeu ${q}× ${n}.`}); }
    if (premio.rep){
      const r = Estado.mudarRep('bom', premio.rep, `Avançou na ${premio.rodada} do Torneio da Liga`, {rep:{notorio:true, peso:3}});
      if (r && r.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
    }

    t.rodada++;
    const campeao = t.rodada >= t.adversarios.length;
    if (campeao){
      this.torneioAtual = null;
      Estado.dados.torneiosVencidos = (Estado.dados.torneiosVencidos||0) + 1;
      Estado.marcar('venceu_torneio');
      Estado.registrar(`Venceu o Torneio Aberto da Liga (${Estado.dados.torneiosVencidos}ª vez).`);
      Estado.salvar('auto');
      return UI.telaResultadoLiga({
        titulo:'CAMPEÃO DO TORNEIO', sub:`${Estado.dados.torneiosVencidos}º título`,
        falas:[
          `${adv.nome} aperta a sua mão antes do juiz anunciar, o que é o maior elogio possível.`,
          'A arena do Planalto tem quatrocentos lugares e hoje tinha umas oitenta pessoas. Torneio aberto é assim.',
          'Mesmo assim, quando anunciam o seu nome, oitenta pessoas fazem barulho de quatrocentas.',
          Estado.rep.eixo==='bom' && Estado.rep.bom>=5
            ? 'Três delas te esperam na saída pra pedir foto. Você não sabe o que fazer com as mãos.'
            : 'Você sai pela porta lateral antes da premiação terminar.'
        ],
        avisos, venceu:true
      });
    }

    Estado.salvar('auto');
    UI.telaResultadoLiga({
      titulo:`${adv.nome} derrotado`, sub:`${premio.rodada} vencida`,
      falas:[
        `${adv.nome} sai da arena sem drama. Torneio tem essa elegância que rota não tem.`,
        `Próxima: ${PREMIO_TORNEIO[t.rodada].rodada}, contra ${t.adversarios[t.rodada].nome}.`,
        'Você tem vinte minutos entre as lutas. Dá pra curar o time.'
      ],
      avisos, venceu:true, torneio:true
    });
  },

  curarNoTorneio(){
    Estado.dados.time.forEach(curarTotal);
    Estado.salvar('auto');
    UI.telaTorneio();
  },

  desistirTorneio(){
    this.torneioAtual = null;
    UI.telaLiga();
  },

  /* ---------- trocas e vendas com NPC ---------- */
  trocaComNPC(escolha){
    const time = Estado.dados.time;
    if (!time.length) return this.irPara(escolha.vai, [{tipo:'info', texto:'Você não tem nada para trocar.'}]);
    UI.modal('Quem você entrega?', time.map(p =>
      `<button class="escolha" onclick="Jogo.efetuarTroca('${p.uid}','${escolha.vai}')">
        ${UI.esc(nomeExib(p))} — Nv ${p.nivel}, ${UI.esc(p.natureza)}, moral ${p.moral}</button>`).join('') +
      '<p class="sussurro" style="margin-top:12px">Você não sabe o que vai receber.</p>');
  },

  efetuarTroca(uid, destino){
    const saiu = Estado.removerDoTime(uid);
    const dex = Dados.escolher(poolSelvagem());
    const nivel = Math.max(3, (saiu ? saiu.nivel : 8) + Dados.entre(-4, 7));
    const recebido = criarPokemon(dex, nivel, {
      moral:35,
      historia:'Recebido numa troca. Teve outro treinador antes de você.'
    });
    Estado.adicionar(recebido);
    Estado.registrar(`Trocou ${saiu ? nomeExib(saiu) : '?'} por ${recebido.nome} Nv${recebido.nivel}.`);
    UI.fecharModal();
    this.irPara(destino, [
      {tipo:'item', texto:`Você entregou ${saiu ? nomeExib(saiu) : '?'}.`},
      {tipo:'pokemon', texto:`Recebeu ${recebido.nome} (Nv ${recebido.nivel}, ${recebido.natureza}) — moral 35. Ele não te conhece.`}
    ]);
  },

  venderDoTime(escolha){
    const time = Estado.dados.time;
    if (!time.length) return this.irPara(escolha.vai, [{tipo:'info', texto:'Você não tem nada para vender.'}]);
    UI.modal('Vender quem?', time.map(p => {
      const preco = Math.round((DEX[p.dex].total * p.nivel) / 6);
      return `<button class="escolha" onclick="Jogo.efetuarVenda('${p.uid}',${preco},'${escolha.vai}')">
        ${UI.esc(nomeExib(p))} — Nv ${p.nivel} · <b>${preco} ₽</b></button>`;
    }).join('') + '<p class="sussurro" style="margin-top:12px">Ele vai para a caixa de veludo. Isso é permanente.</p>');
  },

  efetuarVenda(uid, preco, destino){
    const p = Estado.dados.time.find(x => x.uid === uid);
    if (!p) return;
    const lendario = p.lendario;
    Estado.removerDoTime(uid);
    Estado.j.dinheiro += preco;
    Estado.registrar(`Vendeu ${nomeExib(p)} por ${preco} ₽.`);
    const avisos = Historia.aplicar({
      rep:{eixo:'ruim', delta: lendario ? 4 : 2, motivo:`Vendeu ${nomeExib(p)} numa banca de rua`},
      moral:-15
    });
    avisos.unshift({tipo:'item', texto:`+${preco} ₽`});
    UI.fecharModal();
    this.irPara(destino, avisos);
  }
};

window.addEventListener('DOMContentLoaded', () => Jogo.iniciar());
