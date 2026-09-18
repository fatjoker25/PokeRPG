/* ============================================================
   EXPLORAÇÃO — a tela onde você decide o que fazer e pra onde ir
   ============================================================ */
const Exploracao = {

  tela(avisos){
    Estado.dados.modo = 'mundo';
    UI.limpar();
    UI.add(UI.topo());
    const L = Mundo.atual();
    const d = Estado.dados;
    const arco = Historia.arcoAqui();

    const afazeres = afazeresDoLocal().map(a =>
      `<button class="escolha" onclick="Exploracao.fazer('${a.id}')">
        ${UI.esc(a.titulo)}<br><span class="pd">${UI.esc(a.sub)}</span></button>`).join('');

    const vizinhos = Mundo.vizinhos().map(id => {
      const v = LOCAIS[id];
      const conhecido = Mundo.visitado(id);
      return `<button class="escolha" onclick="Exploracao.viajar('${id}')">
        ${conhecido ? 'Ir para ' + UI.esc(v.nome) : 'Seguir o caminho — ' + UI.esc(v.nome)}
        <br><span class="pd">${conhecido ? UI.esc(v.tipo === 'cidade' ? v.porte || 'cidade' : 'rota') : 'você nunca foi lá'}${v.perigosa ? ' · dizem que é perigoso' : ''}</span></button>`;
    }).join('');

    UI.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">${UI.esc(d.relogio.periodo)} · dia ${d.relogio.dia}</div>
        <div class="tit">${UI.esc(L.nome)}</div>
        <div class="loc">${UI.esc(L.tipo === 'cidade' ? (L.porte||'cidade') : (L.tipo==='rota'?'rota':'lugar'))}</div>
      </div>
      <div class="narrativa">${(L.desc||[]).map(t=>`<p>${UI.esc(t)}</p>`).join('')}</div>
      <div id="avisos" class="avisos"></div>

      ${arco ? `<h3>Aqui</h3>
        <div id="escolhas" class="escolhas">
          <button class="escolha" style="border-color:var(--destaque)" onclick="Exploracao.entrarNoArco()">
            ${UI.esc(arco.chamada)}<br><span class="pd">Isso vai tomar o seu tempo e provavelmente mudar alguma coisa.</span></button>
        </div>` : ''}

      <h3>O que fazer</h3>
      <div class="escolhas">${afazeres}</div>

      <h3>Para onde ir</h3>
      <div class="escolhas">${vizinhos}</div>
    </div>`);

    if (avisos && avisos.length) UI.avisos(avisos);
    UI.rolarTopo();
  },

  /* ---------- entrar no arco que espera neste lugar ---------- */
  entrarNoArco(){
    const arco = Historia.arcoAqui();
    if (!arco) return this.tela();
    Estado.dados.modo = 'cena';
    const cena = Historia.iniciarCapitulo(arco.num);
    Estado.salvar('auto');
    UI.telaCena(cena);
  },

  /* ---------- viagem ---------- */
  viajar(id){
    const novo = Mundo.viajar(id);
    Estado.salvar('auto');
    const primeiraVez = !Estado.dados.visitados['__v_'+id];
    Estado.dados.visitados['__v_'+id] = true;
    const avisos = [];
    // algo acontece no caminho, de vez em quando
    if (Dados.chance(28) && novo.tipo !== 'cidade'){
      const enc = sortearSelvagem(novo.ambiente, novo.nivel);
      return this.encontro(enc, ['No meio do caminho, alguma coisa sai do mato e não desvia.']);
    }
    this.tela(primeiraVez ? [{tipo:'info', texto:'Você nunca esteve aqui.'}] : null);
  },

  /* ---------- ações ---------- */
  fazer(acao){
    const L = Mundo.atual();
    const d = Estado.dados;

    if (acao === 'procurar'){
      Mundo.passar(1);
      if (Dados.chance(78)){
        const p = sortearSelvagem(L.ambiente, L.nivel);
        return this.encontro(p, [
          'Você anda devagar pelo mato alto, parando a cada poucos passos.',
          'Leva um tempo. Sempre leva mais tempo do que parece que vai levar.'
        ]);
      }
      Estado.salvar('auto');
      return this.tela([{tipo:'info', texto:'Você procura por um período inteiro e não encontra nada. Acontece.'}]);
    }

    if (acao === 'vasculhar')  return this.vasculhar();
    if (acao === 'treinar')    return this.treinar();
    if (acao === 'pescar')     return this.pescar();
    if (acao === 'acampar')    return this.acampar();
    if (acao === 'andar')      return this.andar();
    if (acao === 'conversar')  return this.conversar();
    if (acao === 'centro')     return Cidade.centro();
    if (acao === 'loja')       return Cidade.loja();
    if (acao === 'ginasio')    return Cidade.ginasio();
    if (acao === 'liga'){ Jogo.voltarDeGinasio = 'exploracao'; return Jogo.abrirLiga('exploracao'); }
    if (acao === 'torneio'){ Jogo.voltarDeGinasio = 'exploracao'; return Jogo.abrirLiga('exploracao'); }
    this.tela();
  },

  vasculhar(){
    const L = Mundo.atual();
    Mundo.passar(1);
    const t = Dados.teste(Estado.j.status.percepcao, 5, 'Percepção');
    const avisos = [];
    let texto;

    if (t.grau === 'critico' || t.grau === 'sucesso'){
      const achado = Descobertas.sortear(Mundo.id(), L);
      if (achado){
        texto = achado.texto;
        if (achado.ef) Historia.aplicar(achado.ef);
        if (achado.descobre) Mundo.descobrir(achado.descobre);
      } else {
        texto = ['Você vasculha a área inteira com método e acha o que sobra quando alguém já passou antes: nada de valor e muita informação sobre quem passou.'];
      }
    } else if (t.grau === 'parcial'){
      texto = ['Você acha rastro, pegada e lixo, e nada disso vira coisa nenhuma hoje.',
               'Mas agora você conhece esse pedaço de chão melhor do que conhecia.'];
    } else {
      texto = ['Você passa um período procurando no lugar errado.',
               'Quando percebe, já escureceu um pouco e você está com fome.'];
    }
    Estado.salvar('auto');
    this.tela(texto.map(x => ({tipo:'info', texto:x})));
  },

  treinar(){
    const L = Mundo.atual();
    Mundo.passar(2);
    const vivos = Estado.timeVivo();
    if (!vivos.length) return this.tela([{tipo:'dano', texto:'Não tem ninguém em pé pra treinar.'}]);
    const ganho = 40 + L.nivel * 9;
    const eventos = [];
    vivos.forEach(p => ganharExp(p, ganho).forEach(e => { if (e.tipo!=='exp') eventos.push(e); }));
    const avisos = [{tipo:'info', texto:'Vocês passam o resto do dia repetindo a mesma coisa até sair certo. É assim que fica bom, e é chato, e ninguém conta isso.'}];
    eventos.forEach(e => {
      if (e.tipo === 'nivel') avisos.push({tipo:'info', texto:'Alguma coisa no time endureceu hoje.'});
      if (e.tipo === 'evolucao') avisos.push({tipo:'pokemon', texto:`${e.de} virou ${e.para}.`});
      if (e.tipo === 'golpe') avisos.push({tipo:'info', texto:`Um deles acertou um movimento novo: ${e.golpe}.`});
    });
    Estado.salvar('auto');
    this.tela(avisos.slice(0,5));
  },

  pescar(){
    Mundo.passar(1);
    const L = Mundo.atual();
    if (Dados.chance(55)){
      const aquaticos = POOL_SELVAGEM.filter(d => DEX[d].tipos.includes('Água'));
      const p = criarPokemon(Dados.escolher(aquaticos), Math.max(3, L.nivel + Dados.entre(-4,3)), {selvagem:true});
      return this.encontro(p, ['A linha fica parada por muito tempo. Depois não fica.']);
    }
    Estado.salvar('auto');
    this.tela([{tipo:'info', texto:'Você pesca um período inteiro e não fisga nada. Pescador de verdade diz que isso também é pescar.'}]);
  },

  acampar(){
    Mundo.passar(1);
    Estado.dados.time.forEach(p => { if (!p.morto) p.hp = Math.min(p.hpMax, p.hp + Math.ceil(p.hpMax*0.35)); });
    Estado.curarJogador(4);
    Estado.salvar('auto');
    this.tela([{tipo:'cura', texto:'Vocês param. Fogo pequeno, comida ruim, chão duro. Ninguém dorme direito e todo mundo melhora um pouco.'}]);
  },

  andar(){
    Mundo.passar(1);
    const id = Mundo.id();
    const achado = Descobertas.sortear(id, Mundo.atual(), true);
    Estado.salvar('auto');
    if (achado){
      if (achado.ef) Historia.aplicar(achado.ef);
      if (achado.descobre) Mundo.descobrir(achado.descobre);
      return this.tela(achado.texto.map(x => ({tipo:'info', texto:x})));
    }
    this.tela([{tipo:'info', texto:'Você anda pela cidade sem destino por um período. Não acontece nada, e não acontecer nada também é uma informação sobre um lugar.'}]);
  },

  conversar(){
    Mundo.passar(1);
    const falas = Conversas.sortear(Mundo.id());
    Estado.salvar('auto');
    this.tela(falas.map(x => ({tipo:'info', texto:x})));
  },

  /* ---------- encontro selvagem ---------- */
  encontro(selvagem, intro){
    const meu = Estado.primeiroApto();
    if (!meu){
      return this.tela([{tipo:'dano', texto:'Alguma coisa se mexe no mato e você não tem ninguém em pé. Você recua devagar até o barulho ficar para trás.'}]);
    }
    Jogo.cenaBatalha = null; Jogo.ginasioAtual = null; Jogo.eliteAtual = null;
    Jogo.torneioAtual = null; Jogo.rivalAtual = null;
    Jogo.batalhaLivre = true;
    UI.limparDados();
    Batalha.iniciar(meu, selvagem, {tipo:'selvagem', fuga:true});
    UI.telaBatalha(intro);
  }
};
