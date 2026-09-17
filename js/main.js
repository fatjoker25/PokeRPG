/* ============================================================
   JOGO — controle de fluxo
   ============================================================ */
const Jogo = {
  subidosNoCap: [],
  cenaBatalha: null,

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
    Historia.capAtual = Historia.capitulo(Estado.dados.capitulo);
    if (!Historia.capAtual) return UI.telaInicial();
    const cena = Historia.ir(Estado.dados.cena);
    UI.telaCena(cena, [{tipo:'info', texto:'Jornada retomada.'}]);
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

    let inicial;
    if (f.inicial === 'rand'){
      // 1ª Geração, estágio 1 (não é evolução de ninguém)
      const evoluidos = new Set(Object.values(DEX).map(p => p.evo).filter(Boolean));
      const base = POOL_SELVAGEM.filter(d => !evoluidos.has(d));
      inicial = criarPokemon(Dados.escolher(base), 5, {
        moral:100,
        historia:'Cresceu com você desde pequeno. Vínculo máximo.'
      });
    } else {
      inicial = criarPokemon(parseInt(f.inicial,10), 5, {
        moral:80,
        historia:'Entregue a você no dia em que a jornada começou.'
      });
    }
    Estado.adicionar(inicial);
    Estado.registrar(`${Estado.j.nome} saiu de ${Estado.j.cidade} com ${inicial.nome}.`);
    Estado.salvar('auto');

    const cena = Historia.iniciarCapitulo(1);
    UI.telaCena(cena, [{tipo:'pokemon', texto:`${inicial.nome} (Nv 5, ${inicial.natureza}) — ${(NATUREZAS[inicial.natureza]||{}).traco||''}`}]);
  },

  /* ---------- navegação ---------- */
  irPara(id, avisos){
    const cena = Historia.ir(id);
    Estado.salvar('auto');
    if (Estado.j.hp <= 0) return UI.telaGameOver('Você não aguentou os ferimentos.');
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

    let inimigo;
    if (b.aleatorio) inimigo = sortearSelvagem(b.ambiente || Historia.capAtual.ambiente, b.nivelBase || Historia.capAtual.nivelArea);
    else inimigo = criarPokemon(b.dex, b.nivel, {selvagem: b.tipo === 'selvagem' || b.tipo === 'lendario'});

    const timeInimigo = (b.timeExtra||[]).map(x => criarPokemon(x.dex, x.nivel, {}));
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
    const r = Batalha.acao(acao);
    UI.escreverLog(r.eventos);
    UI.atualizarArena();

    if (r.precisaTrocar){ UI.trocaObrigatoria(r.reservas); return; }
    if (r.fim) return this.finalizarBatalha(r.fim);
    UI.acoesCombate();
    Estado.salvar('auto');
  },

  finalizarBatalha(fim){
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

    // batalha avulsa do hub
    if (!destino){
      const avisos = [aviso].filter(Boolean);
      UI.telaHub();
      UI.avisos(avisos);
      Estado.salvar('auto');
      return;
    }
    this.irPara(destino, [aviso].filter(Boolean));
  },

  /* ---------- fim de capítulo ---------- */
  fecharCapitulo(){
    this.subidosNoCap = [];
    const avisos = Historia.fecharCapitulo();
    UI.telaFimCapitulo(avisos);
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

  avancarCapitulo(){
    if (Estado.j.pontos > 0 && !confirm('Você ainda tem pontos para distribuir. Seguir mesmo assim? (Eles ficam guardados.)')) return;
    const prox = Historia.proximoCapitulo();
    if (!prox){
      return UI.telaFinal({titulo:'A JORNADA CONTINUA', texto:[
        'Você chegou ao fim do que está escrito. O resto é estrada.',
        'Kanto continua exatamente do jeito que você deixou — e essa é a parte que importa.'
      ]});
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

  hubLoja(){
    const catalogo = [
      ['Poké Ball',200],['Great Ball',600],['Ultra Ball',1200],
      ['Potion',300],['Super Potion',700],['Hyper Potion',1500],
      ['Revive',1500],['Antidote',250],['Full Heal',600],
      ['Bandagem',400],['Ração',350]
    ];
    UI.modal('Loja — ' + Estado.j.dinheiro + ' ₽', catalogo.map(([n,p]) =>
      `<button class="escolha" ${Estado.j.dinheiro < p ? 'disabled style="opacity:.4"':''}
        onclick="Jogo.comprar('${n}',${p})">${n} — ${p} ₽
        <span class="pd">${(ITENS_INFO[n]||{}).desc||''}</span></button>`).join(''));
  },

  comprar(nome, preco){
    if (Estado.j.dinheiro < preco) return;
    Estado.j.dinheiro -= preco;
    Estado.darItem(nome, 1);
    Estado.salvar('auto');
    this.hubLoja();
  },

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
    const dex = Dados.escolher(POOL_SELVAGEM);
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
