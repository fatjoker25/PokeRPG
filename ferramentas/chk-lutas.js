/* chk-lutas — toda luta com gente do outro lado, de ponta a ponta.

   Abre o jogo no navegador e, pra cada luta que existe, nas duas fichas
   (Homem e Mulher):
     ginásios, Elite e Campeão, torneio, o Ezra e os rivais extras, os
     treinadores de estrada nos quatro escalões, os veteranos, a
     Conferência, as barreiras, as revanches do PokéNav e toda luta
     marcada nas cenas dos capítulos;
   começa a luta pela função de verdade e confere:
     - a luta começou, o adversário tem rosto (arquivo no disco) e o
       time existe (espécie no DEX, golpes que existem em GOLPES);
     - dois turnos rodam sem erro;
     - vencendo e perdendo: a fala do resumo, a tela seguinte, e a cena
       pra onde a luta manda existe (o motor avisa "Cena inexistente");
     - nenhum texto quebrado na tela: undefined, NaN, [object, ${,
       marca de gênero sem resolver ({o|a}, {casa:…}).
   Gating (insígnia, ordem dos ginásios) é desligado de propósito: aqui
   se testa a fala e o time, não a porta.
   Precisa do playwright: NODE_PATH=<onde ele está> node ferramentas/chk-lutas.js */
const {chromium} = require('playwright');
const fs = require('fs'), path = require('path');
const raiz = path.resolve(__dirname, '..');

(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage();
  const errosPagina = [], cenaInexistente = [];
  p.on('pageerror', e => errosPagina.push(e.message));
  p.on('console', m => { if (/Cena inexistente/.test(m.text())) cenaInexistente.push(m.text()); });
  await p.goto('file://' + path.join(raiz, 'index.html'));
  await p.waitForTimeout(800);

  const r = await p.evaluate(() => {
    const out = {casos:0, problemas:[], rostos:{}, falas:0};
    const prob = (caso, m) => out.problemas.push(`${caso}: ${m}`);
    /* sem animação: o teste não espera a encenação */
    if (typeof Efeitos !== 'undefined'){ Efeitos.encenar = async () => {}; Efeitos.abertura = async () => {}; Efeitos.entrada = async () => {}; }
    UI.rolarTopo = () => {};
    /* gating fora */
    statusGinasio = () => ({estado:'disponivel'});
    if (typeof statusElite4 === 'function') statusElite4 = () => ({estado:'disponivel'});
    if (typeof statusTorneio === 'function') statusTorneio = () => ({estado:'disponivel'});
    if (typeof statusConferencia === 'function') statusConferencia = () => ({estado:'disponivel'});

    const QUEBRADO = /undefined|NaN|\[object|\$\{|\{[a-zà-úA-Z ]*\|[^}]*\}|\{casa:|\{pk:|\{pico\}|\{idade|\{saida\}/;
    const textoDaTela = () => [document.getElementById('app'), document.querySelector('.modal'), document.querySelector('.nav-tela')]
      .filter(Boolean).map(e => e.innerText).join('\n');

    const preparar = (gen, ins, cap) => {
      Estado.novo({nome: gen === 'Homem' ? 'Davi' : 'Ana', genero:gen, cidade:'Pallet', casaNome:'Delia', casaQuem:'mãe', nascimento:{dia:3, mes:9}});
      const d = Estado.dados;
      d.modo = 'mundo'; d.flags.tem_pokedex = true; d.flags.tem_licenca = true;
      d.capitulo = cap; d.insignias = GINASIOS.slice(0, ins).map(g => g.insignia || g.id);
      d.time = [6, 9, 3, 65, 94, 149].map(x => criarPokemon(x, 70));
      d.relogio.hora = 12;
      Mundo.viajar('viridian');
      Jogo.cenaBatalha = Jogo.ginasioAtual = Jogo.eliteAtual = Jogo.torneioAtual = Jogo.rivalAtual = null;
      Jogo.revancheAtual = Jogo.veteranoAtual = Jogo.estradaAtual = null; Jogo.batalhaLivre = false;
      return d;
    };

    const checarTime = (caso) => {
      const time = [Batalha.inimigo, ...(Batalha.timeInimigo || [])];
      for (const x of time){
        if (!x || !DEX[x.dex]) { prob(caso, `Pokémon inexistente no time (${x && x.dex})`); continue; }
        if (!x.golpes || !x.golpes.length) prob(caso, `${DEX[x.dex].nome} sem golpe`);
        for (const g of (x.golpes || [])) if (!GOLPES[g.nome]) prob(caso, `${DEX[x.dex].nome} com golpe inexistente: ${g.nome}`);
        if (!(x.nivel >= 1 && x.nivel <= 100)) prob(caso, `${DEX[x.dex].nome} com nível ${x.nivel}`);
      }
    };

    const umaLuta = (caso, gen, ins, cap, iniciar, resultado) => {
      const d = preparar(gen, ins, cap);
      out.casos++;
      try { iniciar(d); } catch (e) { prob(caso, `ao começar: ${e.message}`); return; }
      if (!Batalha.ativo) { prob(caso, 'a luta não começou'); return; }
      const tela0 = textoDaTela();
      const nome = Batalha.treinador;
      if (nome){
        const src = retratoDe(nome) || rostoGenerico(nome);
        if (!src) prob(caso, `sem rosto: ${nome}`); else out.rostos[src] = 1;
      }
      checarTime(caso);
      try { for (let i = 0; i < 2 && Batalha.ativo; i++) Batalha.acao({tipo:'golpe', indice:0}); }
      catch (e) { prob(caso, `no turno: ${e.message}`); }
      let fim;
      try { fim = Batalha.ativo ? Batalha.encerrar(resultado).fim : (Batalha.fim || {resultado}); }
      catch (e) { prob(caso, `ao encerrar: ${e.message}`); return; }
      if (fim.resultado !== resultado) fim = Object.assign({}, fim, {resultado});
      let linhas = [];
      try { linhas = Jogo.resumoFimDeBatalha(fim).linhas; } catch (e) { prob(caso, `no resumo: ${e.message}`); }
      try { Jogo.finalizarBatalha(fim); } catch (e) { prob(caso, `depois da luta: ${e.message}`); }
      const tela1 = textoDaTela();
      out.falas += linhas.length;
      for (const [onde, t] of [['entrada', tela0], ['resumo', linhas.map(l => concordaJogador(String(l.texto))).join('\n')], ['depois', tela1]]){
        const m = t.match(QUEBRADO);
        if (m) prob(caso, `texto quebrado na ${onde}: "${t.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\n/g, ' ')}"`);
      }
      if (resultado === 'vitoria' && nome && !linhas.some(l => /venceu/i.test(l.texto))) prob(caso, 'resumo da vitória sem a linha de vitória');
    };

    const casos = [];
    const add = (nome, ins, cap, iniciar) => casos.push({nome, ins, cap, iniciar});

    /* ginásios */
    GINASIOS.forEach((g, i) => add(`ginásio ${g.lider}`, i, 6 + i * 2, () => Jogo.desafiarGinasio(g.id)));
    /* Elite e Campeão */
    ELITE4.forEach((e, i) => add(`Elite ${e.nome}`, 8, 22, () => { Jogo.eliteAtual = {indice:i, campeao:false}; Jogo.batalhaElite(); }));
    add('Campeão', 8, 22, () => { Jogo.eliteAtual = {indice:4, campeao:true}; Jogo.batalhaElite(); });
    /* torneio: as três rodadas */
    [0, 1, 2].forEach(rd => add(`torneio rodada ${rd + 1}`, 8, 22, () => {
      Jogo.torneioAtual = {rodada:rd, adversarios: montarChaveamento()}; Jogo.lutarRodadaTorneio(); }));
    /* o Ezra em cada arco, e os rivais extras */
    /* o Ezra em cada um dos cinco arcos, cedo e tarde */
    const arcoOriginal = arcoRival, arcoExtraOriginal = arcoRivalExtra;
    Object.keys(ARCOS_RIVAL).forEach(arco => [1, 6].forEach(ins => add(`Ezra ${arco} (${ins} insígnias)`, ins, 4 + ins * 2, () => {
      arcoRival = () => arco;
      try { Jogo.encontroRival = {tipo:'teo'}; Jogo.lutarRival(); } finally { arcoRival = arcoOriginal; }
      /* o resultado lê o arco de novo: deixa ele valendo até a luta acabar */
      arcoRival = () => arco; setTimeout(() => { arcoRival = arcoOriginal; }, 0);
    })));
    /* cada rival extra em cada arco dele */
    RIVAIS_EXTRA.forEach(R => Object.keys(R.arcos || {padrao:1}).forEach(arco => add(`rival ${R.nome} ${arco}`, 4, 14, () => {
      arcoRivalExtra = () => arco;
      registroRivais()[R.id] = registroRivais()[R.id] || {id:R.id, nome:R.nome, vitorias:0, derrotas:0, encontros:0, arco:'novo', ultimoCap:0};
      Jogo.encontroRival = {tipo:'extra', id:R.id}; Jogo.lutarRival(); })));
    RIVAIS_EXTRA.forEach(R => [2, 6].forEach(ins => add(`rival ${R.nome} (${ins})`, ins, 6 + ins * 2, () => {
      arcoRivalExtra = arcoExtraOriginal;
      /* no jogo, a luta só vem depois de ele virar seu rival */
      registroRivais()[R.id] = registroRivais()[R.id] || {id:R.id, nome:R.nome, vitorias:0, derrotas:0, encontros:0, arco:'novo', ultimoCap:0};
      Jogo.encontroRival = {tipo:'extra', id:R.id}; Jogo.lutarRival(); })));
    /* treinadores de estrada, nos quatro escalões */
    TREINADORES_ESTRADA.forEach(t => [0, 2, 4, 7].forEach(ins => add(`estrada ${t.id} (${ins})`, ins, 4 + ins * 2, () => {
      if (t.locais && t.locais[0]) Mundo.viajar(t.locais[0]);
      Estrada.desafiar(t.id, 'procurar'); })));
    /* veteranos e Conferência */
    VETERANOS.forEach(v => add(`veterano ${v.nome}`, 8, 20, () => Veteranos.lutar(v.id)));
    if (typeof Conferencia !== 'undefined') add('Conferência', 8, 24, () => { Conferencia.iniciar(); if (!Batalha.ativo) Conferencia.lutar(); });
    /* barreiras */
    (typeof BARREIRAS_DE_ESCOLHA !== 'undefined' ? BARREIRAS_DE_ESCOLHA : []).filter(x => x.luta)
      .forEach(x => add(`barreira ${x.id}`, 4, 14, () => Barreiras.fazer(x.id)));
    /* revanches */
    CONTATOS.filter(c => c.ginasio || c.rivalExtra || c.revanche).forEach(c => add(`revanche ${c.id}`, 6, 16, d => {
      d.revanches = {[c.id]: {local: Mundo.id()}}; Jogo.lutarRevanche(c.id); }));
    /* lutas de cena */
    for (const cap of CAPITULOS) for (const [id, cena] of Object.entries(cap.cenas)){
      if (!cena.batalha) continue;
      add(`cap ${cap.num} ${id}`, Math.min(8, Math.floor(cap.num / 3)), Math.floor(cap.num), d => {
        Historia.capAtual = cap; d.capitulo = Math.floor(cap.num); d.cena = id;
        Historia.cenaAtual = Object.assign({id}, cena);
        Jogo.iniciarBatalhaDaCena();
      });
    }

    out.total = casos.length;
    for (const c of casos) for (const gen of ['Homem', 'Mulher']) for (const res of ['vitoria', 'derrota'])
      umaLuta(`${c.nome} [${gen[0]}/${res}]`, gen, c.ins, c.cap, c.iniciar, res);
    return out;
  });

  const quebrados = Object.keys(r.rostos).filter(s => !s.startsWith('data:') && !fs.existsSync(path.join(raiz, decodeURI(s))));
  /* o mesmo problema nas duas fichas e nos dois resultados aparece uma vez */
  const unicos = [...new Set(r.problemas.map(x => x.replace(/ \[[HM]\/(vitoria|derrota)\]/, '')))];
  console.log(`lutas: ${r.total} · rodadas: ${r.casos} (Homem e Mulher, vencendo e perdendo) · falas de resumo: ${r.falas}`);
  if (unicos.length){ console.log(`\nPROBLEMAS (${unicos.length}):`); unicos.slice(0, 120).forEach(x => console.log('  ' + x)); }
  if (quebrados.length){ console.log('\nROSTO QUE NÃO EXISTE:'); quebrados.forEach(x => console.log('  ' + x)); }
  const cenas = [...new Set(cenaInexistente)];
  if (cenas.length){ console.log('\nCENA INEXISTENTE:'); cenas.forEach(x => console.log('  ' + x)); }
  if (errosPagina.length){ console.log('\nERROS DE PÁGINA:'); [...new Set(errosPagina)].slice(0, 20).forEach(x => console.log('  ' + x)); }
  const ok = !unicos.length && !quebrados.length && !cenas.length && !errosPagina.length;
  if (ok) console.log('todas as lutas começam, rodam e terminam com fala, rosto e time certos.');
  await b.close();
  process.exit(ok ? 0 : 1);
})();
