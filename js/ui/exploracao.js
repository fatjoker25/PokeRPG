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
    // algo acontece no caminho, de vez em quando — quem sabe ler a
    // estrada escolhe melhor a hora de passar e topa com menos coisa
    if (novo.tipo !== 'cidade'){
      const t = Dados.teste(Estado.j.status.intelecto, 5, 'Rota');
      const risco = {critico:10, sucesso:18, parcial:28, falha:40}[t.grau];
      if (Dados.chance(risco)){
        const enc = sortearSelvagem(novo.ambiente, novo.nivel);
        return this.encontro(enc, ['No meio do caminho, alguma coisa sai do mato e não desvia.']);
      }
    }
    this.tela(primeiraVez ? [{tipo:'info', texto:'Você nunca esteve aqui.'}] : null);
  },

  /* ---------- ações ---------- */
  repelenteAtivo(){
    const d = Estado.dados;
    if (!d.repelenteAte) return false;
    const agora = d.relogio.dia * 4;
    if (agora >= d.repelenteAte){ d.repelenteAte = 0; return false; }
    return true;
  },

  fazer(acao){
    const L = Mundo.atual();
    const d = Estado.dados;

    if (acao === 'troca'){ return Trocas.tela(); }

    if (acao === 'procurar'){
      Mundo.passar(1);
      if (Exploracao.repelenteAtivo()){
        return this.tela([
          {tipo:'info', texto:'Você procura por um período inteiro e não acha nada. O cheiro do repelente anda com você e o mato se afasta antes de você chegar.'},
          {tipo:'eco', texto:'Funciona. É esse o problema de funcionar.'}
        ]);
      }
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
    if (acao === 'pc')         return UI.modalPC();
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
      /* Percepção acha o lugar certo; Sorte decide se tinha algo nele. */
      const sorte = Dados.teste(Estado.j.status.sorte, 5, 'Sorte');
      const achado = (sorte.grau === 'falha') ? null : Descobertas.sortear(Mundo.id(), L);
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
    /* Treinar é dar ordem o dia inteiro. Quem sabe mandar rende mais,
       e o time inteiro sai do dia gostando mais ou menos de você. */
    const t = Dados.teste(Estado.j.status.carisma, 6, 'Carisma');
    const fator = {critico:1.6, sucesso:1.25, parcial:1, falha:0.6}[t.grau];
    const ganho = Math.round((40 + L.nivel * 9) * fator);
    const eventos = [];
    vivos.forEach(p => ganharExp(p, ganho).forEach(e => { if (e.tipo!=='exp') eventos.push(e); }));
    const dMoral = {critico:4, sucesso:2, parcial:0, falha:-2}[t.grau];
    if (dMoral) vivos.forEach(p => { p.moral = Math.max(0, Math.min(100, p.moral + dMoral)); });
    const abertura = {
      critico:'Sai tudo certo hoje. Você fala pouco e eles entendem na primeira, e num certo momento você percebe que está rindo sozinho no meio de um campo.',
      sucesso:'Vocês passam o resto do dia repetindo a mesma coisa até sair certo. É assim que fica bom, e é chato, e ninguém conta isso.',
      parcial:'Metade do dia rende e a outra metade é você explicando a mesma coisa de quatro jeitos diferentes.',
      falha:'Não engata. Você manda, eles fazem quase, você manda de novo, e no fim do dia todo mundo está de mau humor por motivo nenhum.'
    }[t.grau];
    const avisos = [{tipo:'info', texto:abertura}];
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
    /* Pescar é sorte com vara na mão. A Sorte decide se fisga e o
       quanto vale o que veio. */
    const t = Dados.teste(Estado.j.status.sorte, 5, 'Sorte');
    const chance = {critico:85, sucesso:70, parcial:50, falha:25}[t.grau];
    if (Dados.chance(chance)){
      const aquaticos = poolSelvagem().filter(d => DEX[d].tipos.includes('Água'));
      const bonus = {critico:6, sucesso:2, parcial:0, falha:-2}[t.grau];
      const p = criarPokemon(Dados.escolher(aquaticos), Math.max(3, L.nivel + bonus + Dados.entre(-4,3)), {selvagem:true});
      return this.encontro(p, [t.grau === 'critico'
        ? 'A linha estica de uma vez só e a vara verga de um jeito que você não esperava hoje.'
        : 'A linha fica parada por muito tempo. Depois não fica.']);
    }
    Estado.salvar('auto');
    this.tela([{tipo:'info', texto:'Você pesca um período inteiro e não fisga nada. Pescador de verdade diz que isso também é pescar.'}]);
  },

  acampar(){
    Mundo.passar(1);
    /* Dormir no chão é um teste de corpo. Resistência decide quanto
       do dia seguinte você recupera de verdade. */
    const t = Dados.teste(Estado.j.status.resistencia, 5, 'Resistência');
    const prop = {critico:0.55, sucesso:0.42, parcial:0.30, falha:0.18}[t.grau];
    const meu  = {critico:8, sucesso:6, parcial:4, falha:2}[t.grau];
    Estado.dados.time.forEach(p => { if (!p.morto) p.hp = Math.min(p.hpMax, p.hp + Math.ceil(p.hpMax * prop)); });
    Estado.curarJogador(meu);
    Estado.salvar('auto');
    const texto = {
      critico:'Vocês param, e por algum motivo essa noite funciona: o fogo pega de primeira, o chão não incomoda, e você acorda antes do sol sem estar cansado.',
      sucesso:'Vocês param. Fogo pequeno, comida ruim, chão duro. Ninguém dorme direito e todo mundo melhora um pouco.',
      parcial:'Vocês param. Você acorda três vezes e uma delas é por nada.',
      falha:'Vocês param, e a noite é ruim. Frio pelas costas, raiz nas costelas, e de manhã você está pior do que deitou.'
    }[t.grau];
    this.tela([{tipo:'cura', texto}]);
  },

  andar(){
    Mundo.passar(1);
    const id = Mundo.id();
    /* Cidade não é cenário: tem gente no meio de alguma coisa. Antes de
       procurar lugar, vê se tem situação acontecendo. */
    if (typeof Eventos !== 'undefined' && Dados.chance(55)){
      const ev = Eventos.sortear(id);
      if (ev){ Estado.salvar('auto'); return UI.telaEvento(ev); }
    }
    /* Andar por uma cidade sem destino só rende para quem lê o
       lugar: placa, horário de porta, que rua tem movimento. */
    const t = Dados.teste(Estado.j.status.intelecto, 5, 'Intelecto');
    const achado = (t.grau === 'falha') ? null : Descobertas.sortear(id, Mundo.atual(), true);
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
    /* Um brilhante muda a entrada da cena antes de mudar a batalha. */
    const linhas = (intro || []).slice();
    if (selvagem.shiny) linhas.push('E aí você para, porque tem alguma coisa errada com a cor.');
    Batalha.iniciar(meu, selvagem, {tipo:'selvagem', fuga:true});
    UI.telaBatalha(linhas);
  }
};
