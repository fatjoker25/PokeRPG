/* ============================================================
   ROBÔ JOGADOR
   Joga o jogo pela própria tela, como gente: lê a luta e escolhe o
   golpe que mais machuca, troca quem está em desvantagem ou com
   pouco HP (recua), usa Potion, foge de selvagem muito acima, captura
   pra completar o time, cura no Centro ou em casa, compra Potion e
   Pokébola quando tem dinheiro, treina quando o time está abaixo do
   capítulo seguinte e segue a história. Nada de mexer no estado por
   fora: tudo passa pelas funções que os botões chamam.

   Em cada tela ele lê o texto e anota o que parece quebrado:
   marca de gênero sem resolver, "undefined", "NaN", HTML vazando,
   "bicho"/"bola" fora do lugar, balão sem nome.

   Uso:  node ferramentas/bot-jogador.js [minutos] [saida.json]
         CIDADE=Cerulean GENERO=Mulher node ferramentas/bot-jogador.js 20
         CAPITULO=17 NOME=Bento node ferramentas/bot-jogador.js 25
         SAVE=jornada.json node ferramentas/bot-jogador.js 25

   Em 25 minutos o robô chega ao capítulo 4 ou 5, então o meio e o fim
   do jogo ficavam sem ninguém jogar. CAPITULO=N faz a inscrição de
   sempre e pula pra antes do capítulo N, como quem jogou até ali:
   o inicial entregue pela função do jogo e subido pro nível da área,
   mais cinco no time, os capítulos de antes fechados, as insígnias que
   o capítulo pede, pontos de status, dinheiro, mochila e PokéNav, no
   lugar onde o capítulo anterior acaba. As escolhas desses capítulos
   não aconteceram: as flags ficam vazias, como as de quem disse não a
   tudo. O capítulo de caminho de cada desvio que ficou pra trás conta
   como jogado: antes do 26 é depois do 25.06. SAVE= começa de um
   arquivo do Salvar, carregado pelo mesmo caminho do "Carregar jogo".

   No arquivo de saída vai o diário de bordo (reg.passos: capítulo,
   escolha de cena, luta com o contexto, viagem, compra, evolução, morte,
   cena de linha, rival e o final) e a ficha de quem jogou (ficha).
   ============================================================ */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const MIN = +(process.argv[2] || 15);
const OUT = process.argv[3] || path.join(__dirname, '..', 'bot-jogador.json');
const CIDADE = process.env.CIDADE || 'Pallet';
const GENERO = process.env.GENERO || 'Mulher';
const NOME = process.env.NOME || 'Íris';
const CAPITULO = +(process.env.CAPITULO || 0);
const SAVE = process.env.SAVE || '';
const RAIZ = 'file://' + path.resolve(__dirname, '..', 'index.html');

const SUSPEITO = [
  [/\{[^{}]*\|[^{}]*\}/, 'marca de gênero sem resolver'],
  [/\bundefined\b/, 'undefined'],
  [/\bNaN\b/, 'NaN'],
  [/\[object /, '[object]'],
  [/<\/?(p|div|span|b)\b/, 'HTML vazando'],
  [/\bbichos?\b/i, '"bicho"'],
  [/(?<![A-Za-zÀ-ÿ-])bolas?(?![A-Za-zÀ-ÿ-])/i, '"bola" sozinha']
];

(async () => {
  const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
  const page = await browser.newPage({ viewport:{width:1000, height:1100} });
  const erros = [], achados = {}, log = [];
  const anota = (tipo, txt) => { const k = tipo + ' :: ' + txt.slice(0, 140); achados[k] = (achados[k] || 0) + 1; };
  page.on('pageerror', e => erros.push(e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
  page.on('dialog', d => /Soltar|permanente|Vender|Largar/.test(d.message()) ? d.dismiss() : d.accept());
  await page.goto(RAIZ);
  await page.waitForTimeout(400);
  /* a luta em 3×, como quem joga pode escolher: só a encenação anda mais
     rápido, dado e turno são os mesmos. Em 1× o robô do capítulo 22 fez
     sete lutas em 25 minutos no Caminho da Vitória (de 15 a 23 turnos
     cada) e nunca chegou ao Planalto */
  await page.evaluate(() => { try { Velocidade.definir(3); } catch (e) {} });
  if (SAVE){
    /* o arquivo do Salvar, pelo caminho do "Carregar jogo": ler confere,
       usar grava na jornada 1, e o Continuar retoma (até a luta) */
    const texto = fs.readFileSync(SAVE, 'utf8');
    const r = await page.evaluate(t => {
      const r = ArquivoSave.ler(t);
      if (r.erro) return r.erro;
      ArquivoSave.usar(r.dados, r.finais, 1);
      Jogo.continuar();
      return null;
    }, texto);
    if (r){ console.log('SAVE recusado:', r); await browser.close(); return; }
  } else {
    /* o "Começar" do cartão da jornada vazia; a aba "Vazia · começar aqui"
       só escolhe o lugar, e o has-text casa com ela também */
    await page.locator('button.tt-principal:has-text("Começar"), .tt-op:has-text("Nova jornada")').first().click();
    await page.waitForTimeout(200);
    /* a inscrição: nome, gênero e cidade no primeiro passo; o resto, sorteado */
    await page.fill('#f-nome', NOME);
    await page.locator(`#f-genero button[data-v="${GENERO}"]`).click();
    await page.locator(`#f-cidade button[data-v="${CIDADE}"]`).click().catch(() => {});
    await page.locator('#cr-sortear').click();
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Sair de casa")').click();
    await page.waitForTimeout(400);
  }
  if (CAPITULO > 1 && !SAVE){
    const ff = await page.evaluate(N => {
      const d = Estado.dados, j = Estado.j;
      const cap = Historia.capitulo(N);
      if (!cap || cap.caminho) return {erro:'capítulo ' + N + ' não existe ou é de caminho'};
      /* o inicial, pela entrega do capítulo 1 (Pallet: o Professor) */
      if (!d.time.length) (d.jogador.cidade === 'Pallet' ? entregarDoProfessor : entregarInicial)(d);
      const L = cap.nivelArea || 30;
      const subir = (p, nv) => {
        const forma = formaNoNivel(p.dex, nv);
        if (forma !== p.dex) evoluir(p, forma);
        p.nivel = nv;
        p.stats = calcularStats(p.dex, nv, p.ivs, p.natureza);
        p.hpMax = p.stats.hp; p.hp = p.hpMax;
        p.exp = 0; p.expProx = expNecessaria(nv);
        p.golpes = criarPokemon(p.dex, nv).golpes;
        p.moral = 70;
      };
      subir(d.time[0], L);
      /* cinco de linhas diferentes da do inicial, de tipos que se cobrem */
      const linhaIni = linhaDe(d.time[0].dex);
      const outros = [16, 74, 60, 43, 25, 129, 66, 92].filter(x => !linhaIni.includes(x)).slice(0, 5);
      outros.forEach((x, i) => { const p = criarPokemon(formaNoNivel(x, L - 2 - i % 3), L - 2 - i % 3); p.moral = 70; Estado.adicionar(p); });
      const pd = Estado.pdex();
      d.time.forEach(p => { pd.vistos[p.dex] = true; pd.catalogados[p.dex] = true; });
      /* as insígnias que o capítulo pede, na ordem dos ginásios */
      const pede = Object.entries(INSIGNIAS_DO_CAPITULO).filter(([k]) => +k <= N).reduce((m, [, v]) => Math.max(m, v), 0);
      d.insignias = GINASIOS.slice(0, pede).map(g => g.insignia);
      /* os capítulos de antes, fechados como no fecharCapitulo */
      const antes = CAPITULOS.filter(c => !c.caminho && !c.requer && c.num < N).map(c => c.num);
      d.capitulosFechados = antes.slice();
      /* e o capítulo de caminho de cada desvio que ficou pra trás (o 25.06
         entre o 25 e o 26): "antes do 26" é depois dele também. Sem isso o
         robô do 26 jogava o terceiro da Liga, que pode acabar a jornada ali */
      const cm = typeof caminhoAtual === 'function' ? defCaminho(caminhoAtual(d)) : null;
      if (cm && typeof PONTOS_DE_DESVIO !== 'undefined')
        PONTOS_DE_DESVIO.forEach(({volta}, k) => { const n = cm.caps[k]; if (n && volta <= N && Historia.capitulo(n)) d.capitulosFechados.push(n); });
      d.capitulo = Math.max(...d.capitulosFechados);
      d.cena = null; d.modo = 'mundo';
      Historia.capAtual = Historia.capitulo(d.capitulo);
      Object.assign(d.flags, {tem_pokedex:true, tem_cartao:true, tem_licenca:true});
      Estado.ganharPokenav();
      /* um ponto por capítulo, como no fim de cada um */
      const chaves = Object.keys(j.status);
      for (let i = 0; i < antes.length; i++) Estado.subirStatus(chaves[i % chaves.length]);
      j.dinheiro += 6000 + 900 * N;
      for (const [n, q] of [['Poké Ball', 10], ['Great Ball', 10], ['Ultra Ball', N >= 17 ? 6 : 2], ['Potion', 4], ['Super Potion', 6],
        ['Hyper Potion', N >= 17 ? 4 : 0], ['Revive', 3], ['Full Heal', 2], ['Antidote', 2], ['Ração', 8], ['Repelente', 3], ['Mapa de Kanto', 1]])
        if (q) Estado.darItem(n, q);
      /* o caminho de quem jogou: a âncora de cada capítulo, pisada */
      const ancora = n => { const a = ANCORAS[n]; const l = a && (typeof a.local === 'function' ? a.local(d) : a.local); return l && l !== '*' ? l : null; };
      for (const n of antes){ const l = ancora(n); if (l){ Mundo.marcarVisitado(l); Mundo.descobrir('local_' + l); } }
      d.relogio.dia += 2 * antes.length;
      if (typeof Fome !== 'undefined') Fome.alimentarTime();
      /* termina onde o capítulo anterior espera */
      d.local = ancora(d.capitulo) || ancora(Math.max(...antes)) || d.local;
      Estado.salvar('auto');
      UI.fecharModal && UI.fecharModal(true);
      Exploracao.tela();
      return {cap:d.capitulo, prox:Historia.proximoCapitulo(false), local:d.local, ins:d.insignias.length, insignias:d.insignias.slice(),
        caminho:cm ? cm.id : null, inicial:d.jogador.inicialDex && DEX[d.jogador.inicialDex].nome,
        time:d.time.map(p => p.nome + ' ' + p.nivel), dinheiro:j.dinheiro, destino:Historia.proximoDestino()};
    }, CAPITULO);
    console.log('AVANÇO', JSON.stringify(ff));
    global.__avanco = ff;
    if (ff.erro){ await browser.close(); return; }
  }

  /* o que aconteceu, pra conferir depois */
  await page.evaluate(() => {
    window.__reg = {lutas:[], caps:[], gastos:{}, passos:[]};
    /* o diário de bordo: um passo por coisa que aconteceu, com capítulo,
       dia, hora e lugar. Passo igual ao anterior (o mesmo afazer no mesmo
       lugar) só soma na conta dele */
    const passo = window.__passo = (t, o) => { try {
      const d = Estado.dados, ult = __reg.passos[__reg.passos.length - 1];
      const p = Object.assign({t, cap:d.capitulo, dia:d.relogio.dia, hora:d.relogio.hora, local:d.local}, o || {});
      if (ult && t === 'mapa' && ult.t === 'mapa' && ult.f === p.f && ult.local === p.local && ult.para === p.para){ ult.vezes = (ult.vezes || 1) + 1; return; }
      __reg.passos.push(p);
    } catch(e){} };
    const nomeDe = x => !x ? null : typeof x === 'string' ? x : (x.nome || x.titulo || x.id || x.tipo || null);
    /* de onde é a luta: ginásio, Elite, rival, estrada, veterano, torneio, cena */
    const contexto = () => {
      const J = Jogo, d = Estado.dados;
      if (J.ginasioAtual) return {de:'ginásio', nome:'Ginásio de ' + J.ginasioAtual.cidade, lider:J.ginasioAtual.lider, insignia:J.ginasioAtual.insignia};
      if (J.eliteAtual != null) return {de:'Liga', nome:nomeDe(J.eliteAtual) || String(J.eliteAtual)};
      if (J.revancheAtual) return {de:'revanche', nome:nomeDe(J.revancheAtual)};
      if (J.conferenciaAtual) return {de:'Conferência', nome:'rodada ' + ((J.conferenciaAtual.rodada || 0) + 1)};
      if (J.torneioAtual) return {de:'Torneio Aberto', nome:'rodada ' + ((J.torneioAtual.rodada || 0) + 1)};
      if (J.veteranoAtual) return {de:'veterano', nome:nomeDe(J.veteranoAtual)};
      if (J.redeAtual) return {de:'rede', nome:nomeDe(J.redeAtual)};
      if (J.rivalAtual || J.encontroRival) return {de:'rival', nome:nomeDe(J.rivalAtual || J.encontroRival)};
      if (J.estradaAtual) return {de:'estrada', nome:nomeDe(J.estradaAtual)};
      if (d.modo === 'cena') return {de:'história', nome:d.cena};
      return {de:Batalha.tipo === 'selvagem' ? 'mato' : Batalha.tipo};
    };
    const ic = Historia.iniciarCapitulo.bind(Historia);
    Historia.iniciarCapitulo = function(n){
      const r = ic(n);
      try { const c = Historia.capitulo(n), d = Estado.dados;
        passo('capitulo', {num:n, nome:typeof numeroDoCapitulo === 'function' ? numeroDoCapitulo(c) : 'Capítulo ' + n, titulo:c.titulo,
          onde:typeof c.local === 'function' ? c.local(d) : c.local, nivelArea:c.nivelArea, time:d.time.map(p => p.nivel)}); } catch(e){}
      return r;
    };
    if (typeof Linhas !== 'undefined'){
      const lm = Linhas.mostrar.bind(Linhas);
      Linhas.mostrar = function(c, cena, avisos){ passo('linha', {titulo:c && c.titulo, linha:c && c.linha}); return lm(c, cena, avisos); };
    }
    const ev0 = window.evoluir;
    window.evoluir = function(p, novo){ const de = p && p.nome; const r = ev0(p, novo); passo('evoluiu', {de, para:DEX[novo] && DEX[novo].nome, nivel:p && p.nivel}); return r; };
    const mt = Estado.matar && Estado.matar.bind(Estado);
    if (mt) Estado.matar = function(p, causa){ passo('morte', {quem:p && nomeExib(p), causa}); return mt(p, causa); };
    const vj = Exploracao.viajar.bind(Exploracao);
    Exploracao.viajar = function(id){ const de = Mundo.id(); const r = vj(id); if (Mundo.id() !== de) passo('viagem', {de, para:Mundo.id()}); return r; };
    const tr = UI.telaRival && UI.telaRival.bind(UI);
    if (tr) UI.telaRival = function(){ passo('rival', {quem:nomeDe(Jogo.encontroRival)}); return tr.apply(UI, arguments); };
    __reg.contexto = contexto;
    window.__contextoDaLuta = contexto;
    /* todo dinheiro que sai, somado pela função que tirou: quantas vezes,
       quanto e onde foi a primeira. Os robôs do meio do jogo perdiam
       vinte e cinco mil numa cidade sem derrota nenhuma, de trezentos em
       trezentos: era o próprio robô comprando Ração na loja de Saffron */
    const jog = Estado.dados.jogador;
    let din = jog.dinheiro;
    Object.defineProperty(jog, 'dinheiro', {configurable:true, enumerable:true,
      get(){ return din; },
      set(n){
        const sai = din - n;
        if (sai > 0){
          const pilha = (new Error().stack || '').split('\n').slice(2, 5).map(x => x.trim().replace(/\(?file:\/\/\S*\/js\//, '(')).join(' < ');
          const k = pilha.split(' < ')[0];
          const g = __reg.gastos[k] || (__reg.gastos[k] = {n:0, total:0, ex:{cap:Estado.dados.capitulo, local:Estado.dados.local, cena:Estado.dados.cena, pilha}});
          g.n++; g.total += sai;
        }
        din = n;
      }});
    const fb = Jogo.finalizarBatalha.bind(Jogo);
    Jogo.finalizarBatalha = function(fim){
      try { const d = Estado.dados, B = Batalha, cx = contexto();
        const vivos = d.time.filter(p => !p.morto);
        __reg.lutas.push({cap:d.capitulo, res:fim.resultado, tipo:B.tipo, ini:B.inimigo ? B.inimigo.nome + ' ' + B.inimigo.nivel : '?',
          top:Math.max(0, ...d.time.map(p => p.nivel)), local:d.local, turnos:B.turno, ctx:cx});
        passo('luta', {res:fim.resultado, tipo:B.tipo, ctx:cx, treinador:B.treinador || null, ultimo:B.inimigo ? B.inimigo.nome + ' ' + B.inimigo.nivel : null,
          turnos:B.turno, caidos:vivos.filter(p => p.hp <= 0).length, de:vivos.length,
          capturou:fim.resultado === 'captura' && fim.pokemon ? fim.pokemon.nome + ' ' + fim.pokemon.nivel : null});
      } catch(e){}
      return fb(fim);
    };
    const fc = Historia.fecharCapitulo.bind(Historia);
    Historia.fecharCapitulo = function(){ const r = fc();
      try { const d = Estado.dados; __reg.caps.push({cap:d.capitulo, dia:d.relogio.dia, ins:d.insignias.length,
        time:d.time.map(p => p.nome + ' ' + p.nivel), dinheiro:d.jogador.dinheiro});
        passo('fechou', {num:d.capitulo, time:d.time.map(p => p.nome + ' ' + p.nivel), dinheiro:d.jogador.dinheiro}); } catch(e){}
      return r; };
  });

  const lerTela = async () => {
    const t = await page.evaluate(() => {
      const partes = [...document.querySelectorAll('#app .narrativa, #app .avisos, #modal, #app .cap-cabecalho, #log')]
        .map(e => e.innerText);
      const anon = [...document.querySelectorAll('.fala.anonima')].length;
      return {txt:partes.join('\n'), anon};
    }).catch(() => ({txt:'', anon:0}));
    for (const [re, nome] of SUSPEITO){
      const m = t.txt.match(re);
      if (m){ const i = t.txt.indexOf(m[0]); anota(nome, t.txt.slice(Math.max(0, i - 60), i + 60).replace(/\s+/g, ' ')); }
    }
    if (t.anon) anota('balão sem nome', t.txt.slice(0, 80).replace(/\s+/g, ' '));
  };

  let passos = 0, parado = 0, ultima = '', empacou = 0, ultimoRetrato = '';
  const t0 = Date.now();
  while ((Date.now() - t0) < MIN * 60000 && passos++ < 20000){
    if (erros.length > 8) break;
    await page.waitForTimeout(40);
    if (await page.evaluate(() => !!(Jogo.encenando || Jogo.animandoBola)).catch(() => false)){ await page.waitForTimeout(120); continue; }
    if (passos % 5 === 0) await lerTela();
    if (passos % 100 === 0){
      const s = await page.evaluate(() => ({c:Estado.dados.capitulo, l:Estado.dados.local, h:Relogio.texto(),
        t:Estado.dados.time.map(p => p.nivel).join('/'), $:Estado.j.dinheiro, ins:Estado.dados.insignias.length,
        modo:Estado.dados.modo, luta:!!Batalha.ativo, enc:!!Jogo.encenando, bola:!!Jogo.animandoBola,
        tela:(document.querySelector('#app') || {innerText:''}).innerText.replace(/\s+/g, ' ').slice(0, 90)}));
      console.log(`[${Math.round((Date.now() - t0) / 1000)}s] ${JSON.stringify(s)}`);
      log.push(s);
      /* empacou: o mesmo retrato três vezes seguidas é tela que não anda */
      const retrato = JSON.stringify([s.c, s.l, s.t, s.$, s.luta, s.tela.replace(/\d+h · \S+ do dia \d+/, '')]);
      empacou = retrato === ultimoRetrato ? empacou + 1 : 0; ultimoRetrato = retrato;
      if (empacou === 2){
        const dump = await page.evaluate(() => ({
          app:(document.querySelector('#app') || {innerText:''}).innerText.slice(0, 900),
          modal:(document.querySelector('#modal') || {innerText:''}).innerText.slice(0, 400),
          batalha:Batalha.ativo ? {tipo:Batalha.tipo, fase:Batalha.fase, turno:Batalha.turno, aliado:Batalha.aliado && Batalha.aliado.nome + ' ' + Batalha.aliado.hp,
            inimigo:Batalha.inimigo && Batalha.inimigo.nome + ' ' + Batalha.inimigo.hp, botoes:[...document.querySelectorAll('#app button')].map(b => b.innerText.trim() + (b.disabled ? '(off)' : '')).slice(0, 20)} : null
        })).catch(e => ({erro:e.message}));
        console.log('EMPACOU', JSON.stringify(dump));
        anota('empacou', JSON.stringify(dump).slice(0, 140));
        log.push({empacou:dump});
      }
    }
    if (await page.locator('.gameover').count()){
      const t = await page.locator('.gameover').innerText();
      log.push({gameover:t});
      await page.evaluate(x => window.__passo && __passo('fim', {como:'morte', texto:x.slice(0, 300)}), t).catch(() => {});
      break;
    }
    if (await page.locator('.final').count()){
      /* o final da jornada: o título e o primeiro parágrafo vão pro diário */
      await page.evaluate(() => { const f = document.querySelector('.painel.final');
        window.__passo && __passo('fim', {como:'final', titulo:(f.querySelector('.tit') || {}).innerText || '',
          texto:((f.querySelector('p') || {}).innerText || '').slice(0, 400)}); }).catch(() => {});
      break;
    }

    /* apelido: às vezes dá, às vezes não */
    if (await page.locator('#campo-apelido').count()){
      if (Math.random() < 0.5){ await page.fill('#campo-apelido', 'Faísca'); await page.locator('#modal button:has-text("Dar o apelido")').click({timeout:3000}).catch(() => {}); }
      else await page.locator('#modal button:has-text("Não")').click({timeout:3000}).catch(() => {});
      continue;
    }
    if (await page.locator('.aprender-op').count()){ await page.locator('.aprender-op').first().click({timeout:3000}).catch(() => {}); continue; }
    if (await page.locator('#modal .time-linha:not([disabled])').count() && await page.evaluate(() => Batalha.ativo).catch(() => false)){
      await page.locator('#modal .time-linha:not([disabled])').first().click({timeout:3000}).catch(() => {}); continue;
    }
    /* o Continuar do fim da luta fica na barra de ações, e a evolução e o
       golpe novo abrem por cima dele: com janela aberta, quem responde é
       ela. Antes o robô clicava no Continuar coberto, esperava 3 s e
       tentava de novo pra sempre (20 minutos na evolução do Caterpie) */
    if (!(await page.locator('#modal').count()) && await page.locator('.continuar-batalha').count()){ await page.locator('.continuar-batalha').first().click({timeout:3000}).catch(() => {}); await page.waitForTimeout(120); continue; }
    if (await page.locator('#modal .evo').count()){
      if (await page.locator('#evo-seguir:visible').count()) await page.locator('#evo-seguir').click({timeout:3000}).catch(() => {}); else await page.waitForTimeout(300);
      continue;
    }

    /* luta: lê a situação e decide */
    if (await page.evaluate(() => Batalha.ativo && !!document.querySelector('.acoes-combate, #acoes')).catch(() => false)){
      const a = await page.evaluate(() => {
        const B = Batalha, p = B.aliado, alvo = B.inimigo, d = Estado.dados;
        if (!p || !alvo) return null;
        if (B.fase === 'ameaca') return {tipo:'fugirAmeaca'};
        const golpeBom = (quem) => {
          let melhor = -1, idx = 0;
          quem.golpes.forEach((g, i) => {
            if (g.pp <= 0) return; const G = GOLPES[g.nome] || {}; if (G.c === 'status') return;
            const ef = eficacia(G.t, alvo.tipos); const PR = PR_GOLPE[g.nome] || {};
            const s = ef === 0 ? -1 : ((PR.p || 1) + (quem.tipos.includes(G.t) ? 1 : 0)) * ef * ((G.a || 100) / 100);
            if (s > melhor){ melhor = s; idx = i; }
          });
          return {idx, melhor};
        };
        /* selvagem muito acima: foge */
        if (B.tipo === 'selvagem' && alvo.nivel > p.nivel + 8 && B.fuga !== false) return {tipo:'fugir'};
        /* captura pra completar o time */
        const bola = ['Ultra Ball', 'Great Ball', 'Poké Ball'].find(n => Estado.contaItem(n) > 0);
        if (B.tipo === 'selvagem' && bola && d.time.length < 6 && alvo.hp <= alvo.hpMax * 0.5 && !alvo.lendario) return {tipo:'bola', nome:bola};
        /* cura quem está quase caindo */
        const pot = ['Hyper Potion', 'Super Potion', 'Potion'].find(n => Estado.contaItem(n) > 0);
        if (pot && p.hp <= p.hpMax * 0.25 && p.hp > 0) return {tipo:'item', nome:pot, alvoUid:p.uid};
        /* recua: se o golpe dele é ruim e tem alguém melhor no banco */
        /* Vontade: com pouco HP, esquiva o próximo golpe */
        if (p.hp <= p.hpMax * 0.5 && vontadeDe(p) >= 2 && B.podeGastarVontade('esquiva')) B.gastarVontade('esquiva');
        const meu = golpeBom(p);
        const banco = d.time.filter(x => x.uid !== p.uid && x.hp > x.hpMax * 0.4 && !x.morto);
        const melhorBanco = banco.map(x => ({x, s:golpeBom(x).melhor})).sort((u, v) => v.s - u.s)[0];
        if (melhorBanco && (meu.melhor < 1 || p.hp <= p.hpMax * 0.2) && melhorBanco.s > meu.melhor * 1.5 && !(B.estAliado && B.estAliado.presoTurnos))
          return {tipo:'trocar', uid:melhorBanco.x.uid};
        return {tipo:'golpe', indice:meu.idx};
      }).catch(() => null);
      if (a){ await page.evaluate(x => { UI.modoBatalha = 'menu'; Jogo.acaoBatalha(x); }, a).catch(e => erros.push('acao: ' + e.message)); await page.waitForTimeout(150); continue; }
    }
    /* troca obrigatória depois de desmaio */
    if (await page.locator('#modal .time-linha:not([disabled])').count() && await page.evaluate(() => Batalha.ativo).catch(() => false)){
      await page.locator('#modal .time-linha:not([disabled])').first().click({timeout:3000}).catch(() => {}); continue;
    }

    /* fim de capítulo: distribui pontos e segue */
    if (await page.locator('#btn-seguir').count()){
      const ups = page.locator('button[id^="up-"]:not([disabled])');
      for (let i = 0; i < 4 && await ups.count(); i++){ await ups.first().click({timeout:3000}).catch(() => {}); await page.waitForTimeout(60); }
      await page.locator('#btn-seguir').click({timeout:3000}).catch(() => {}); await page.waitForTimeout(200); continue;
    }

    /* no mapa: cuidar do time, comprar, treinar, seguir a história */
    const noMapa = await page.evaluate(() => Estado.dados.modo === 'mundo' && !Batalha.ativo && !!document.querySelector('.porta, button[onclick^="Exploracao.viajar"]')).catch(() => false);
    if (noMapa){
      if (await page.locator('#modal').count()) await page.evaluate(() => UI.fecharModal(true));
      const dec = await page.evaluate(() => {
        const d = Estado.dados, L = Mundo.atual(), id = Mundo.id();
        /* o trajeto no mapa, de lugar em lugar pelas conexões que o
           jogador conhece e pode atravessar. O robô chamava o caminhoEntre
           achando que era isto, e era a janela de hora dos capítulos de
           caminho (hoje caminhoNaJanela): recebia nada e andava ao acaso,
           sem nunca achar o Centro, a loja ou o próximo capítulo */
        const trajeto = (de, ate) => {
          if (de === ate) return [de];
          const veio = Object.create(null), fila = [de];
          veio[de] = null;
          while (fila.length){
            const x = fila.shift();
            for (const y of (LOCAIS[x] && LOCAIS[x].conexoes) || []){
              if (y in veio || !Mundo.conhecido(y) || travaDaPassagem(x, y)) continue;
              veio[y] = x;
              if (y === ate){ const c = [y]; for (let z = x; z !== null; z = veio[z]) c.unshift(z); return c; }
              fila.push(y);
            }
          }
          return null;
        };
        const vivos = d.time.filter(p => !p.morto);
        const hp = vivos.reduce((s, p) => s + Math.max(0, p.hp), 0) / Math.max(1, vivos.reduce((s, p) => s + p.hpMax, 0));
        const afz = afazeresDoLocal().map(a => a.id);
        if (hp < 0.6 || !Estado.primeiroApto()){
          if (afz.includes('casa')) return {f:'casa'};
          if (afz.includes('centro')) return {f:'centro'};
          /* acampar pede Ração; sem ela, a noite passa esperando */
          if (ehNoite()) return {f: Estado.contaItem('Ração') >= 1 ? 'acampar' : 'esperar'};
          /* sem cura aqui e de dia: anda até o Centro mais perto */
          const centros = Object.keys(LOCAIS).filter(k => Exploracao.temCentro(LOCAIS[k]) && !travaDaPassagem(id, k))
            .map(k => trajeto(id, k)).filter(c => c && c[1] && !travaDaPassagem(id, c[1])).sort((x, y) => x.length - y.length);
          if (centros.length) return {f:'viajar', id:centros[0][1]};
        }
        /* compra o básico: só o que falta e só o que a loja daqui vende.
           Antes ele comprava os três toda vez que entrava, e em Saffron, que
           não vende Potion nem Poké Ball, voltava ao balcão a cada passo
           atrás da Potion e saía com mais três Rações: 129 Rações e vinte
           e cinco mil a menos */
        const MINIMO = {'Potion':3, 'Poké Ball':5, 'Ração':2};
        const vende = n => catalogoDaCidade(id).some(([x]) => x === n);
        const faltam = Object.keys(MINIMO).filter(n => Estado.contaItem(n) < MINIMO[n] && vende(n));
        if (afz.includes('loja') && d.jogador.dinheiro > 1500 && faltam.length) return {f:'loja', itens:faltam};
        /* a loja da cidade só aparece pra quem anda por ela (descobertas):
           sem Ração e com dinheiro, anda até achar */
        if (L.tipo === 'cidade' && (L.lugares || []).includes('loja') && !afz.includes('loja')
            && Estado.contaItem('Ração') < 2 && d.jogador.dinheiro > 1500) return {f:'andar'};
        /* sem Ração, com dinheiro e fora da cidade: vai até a loja mais
           perto. Sem isso o robô ficou 98 dias na Rota 1 com o time
           faminto, procurando briga pra subir de nível e perdendo */
        if (L.tipo !== 'cidade' && Estado.contaItem('Ração') < 1 && d.jogador.dinheiro > 1500){
          const lojas = Object.keys(LOCAIS).filter(k => (LOCAIS[k].lugares || []).includes('loja') && !travaDaPassagem(id, k))
            .map(k => trajeto(id, k)).filter(c => c && c[1] && !travaDaPassagem(id, c[1])).sort((x, y) => x.length - y.length);
          if (lojas.length) return {f:'viajar', id:lojas[0][1]};
        }
        /* quem nasceu longe pega o ônibus da Liga, como a cidade oferece */
        if (afz.includes('onibus')) return {f:'onibus'};
        const destino = Historia.proximoDestino && Historia.proximoDestino();
        const cap = destino ? Historia.capitulo(destino.num) : null;
        /* o alvo é o capítulo que vem, não a rota onde ele está de passagem:
           com o nível da rota, quem nasce em Lavender treinava na Rota 12
           pra sempre */
        const alvo = cap ? (cap.nivelArea || 0) - 2 : (L.nivel || 5);
        /* treino pede Ração e o descanso de verdade entre um e outro
           (TREINO_ESPERA_MIN); sem isso o jogo recusa, e o robô ficava
           pedindo pra sempre */
        const podeTreinar = d.treinoDia !== d.relogio.dia && Estado.contaItem('Ração') >= TREINO_RACAO
          && (d.treinoReal || 0) + TREINO_ESPERA_MIN * 60000 <= Date.now();
        /* treinar só rende onde o mato está perto do nível do time: na Rota
           5 (nível 15) um time de 33 não sobe nunca, e o robô do capítulo
           10 passou quinze minutos ali, procurando selvagem pro 11. Longe
           disso ele segue pro capítulo — a rota de lá é mais forte, e quem
           joga de verdade não fica moendo */
        const rendeAqui = (L.nivel || 5) >= nivelDeReferencia() - 8;
        /* e treina por um tempo, não pra sempre: sessenta procuras ou
           treinos por capítulo e ele segue, mesmo abaixo da área. Os robôs
           do 26 ficaram o resto da jogada no norte atrás de dois níveis pro
           27, indo e voltando do Centro de Cerulean */
        const T = window.__treinos || (window.__treinos = {});
        const treinou = T[d.capitulo] || 0;
        const moer = nivelDeReferencia() < alvo && L.tipo !== 'cidade' && rendeAqui && treinou < 60;
        if (moer) T[d.capitulo] = treinou + 1;
        if (moer && podeTreinar && vivos.some(p => p.nivel < (L.nivel || 5) + 5)) return {f:'treinar'};
        if (moer) return {f:'procurar'};
        if (Historia.arcoAqui() && !travaDoCapitulo(Historia.arcoAqui().num)) return {f:'arco'};
        const g = GINASIOS.find(x => x.id === id && statusGinasio(x).estado === 'disponivel');
        if (g && nivelDeReferencia() >= nivelGinasio(g) - 1 && hp > 0.9) return {f:'ginasio'};
        if (destino && destino.local && destino.local !== '*' && destino.local !== id){
          const cam = trajeto(id, destino.local);
          if (cam && cam[1] && !travaDaPassagem(id, cam[1])) return {f:'viajar', id:cam[1]};
        }
        const viz = Mundo.vizinhos().filter(v => !travaDaPassagem(id, v));
        return {f:'viajar', id:Dados.escolher(viz)};
      }).catch(e => ({f:'erro', e:e.message}));
      /* o que ele decidiu no mapa vai pro diário (andar entra pela viagem) */
      if (dec.f !== 'viajar' && dec.f !== 'erro')
        await page.evaluate(x => window.__passo && __passo('mapa', {f:x.f, itens:x.itens || null}), dec).catch(() => {});
      const assin = JSON.stringify(dec) + await page.evaluate(() => Estado.dados.local + Relogio.texto());
      if (assin === ultima && ++parado > 12){ anota('travou no mapa', assin); parado = 0; await page.evaluate(() => Exploracao.fazer('vasculhar')); continue; }
      if (assin !== ultima) parado = 0; ultima = assin;
      if (dec.f === 'loja'){
        await page.evaluate(() => Exploracao.fazer('loja')); await page.waitForTimeout(150);
        await page.evaluate(itens => {
          /* comprar abre a confirmação com a quantidade (Cidade.comprar), e
             só o "Comprar" dela paga: o robô abria a janela e nunca
             confirmava, e andava sem Potion, sem Pokébola e sem Ração */
          for (const n of itens){
            if (!catalogoDaCidade(Mundo.id()).some(([x]) => x === n)) continue;
            try {
              const p = precoNaCidade(n, Mundo.id());
              Cidade.comprar(n, p);
              if (Cidade._compra) Cidade._compra.qtd = Math.min(3, Cidade._compra.max || 0);
              if (Cidade._compra && Cidade._compra.qtd) Cidade.confirmarCompra(n, p);
            } catch(e){}
          }
          UI.fecharModal(true); Exploracao.tela();
          window.__passo && __passo('compra', {itens, dinheiro:Estado.j.dinheiro});
        }, dec.itens || []);
      } else if (dec.f === 'viajar') await page.evaluate(i => Exploracao.viajar(i), dec.id);
      else if (dec.f === 'arco') await page.evaluate(() => Exploracao.entrarNoArco());
      else if (dec.f === 'centro'){ await page.evaluate(() => Cidade.atenderAqui()); }
      else if (dec.f !== 'erro') await page.evaluate(f => Exploracao.fazer(f), dec.f);
      await page.waitForTimeout(150);
      continue;
    }

    /* modal com escolha / fechar */
    if (await page.locator('#modal .escolha:not([disabled])').count()){
      const b = page.locator('#modal .escolha:not([disabled])').first();
      const t = (await b.innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      const tit = await page.evaluate(() => ((document.querySelector('#modal h2, #modal .modal-titulo') || {}).innerText || '').trim()).catch(() => '');
      await page.evaluate(x => window.__passo && __passo('janela', x), {janela:tit, texto:t.slice(0, 160)}).catch(() => {});
      await b.click({timeout:3000}).catch(() => {}); continue;
    }
    if (await page.locator('#modal').count()){
      const f = page.locator('#modal button:visible:has-text("Fechar"), #modal button:visible:has-text("Voltar"), #modal button:visible:has-text("Desligar"), #modal button:visible:has-text("Continuar")');
      if (await f.count()){ await f.first().click({timeout:3000}).catch(() => {}); continue; }
      await page.evaluate(() => UI.fecharModal(true)); continue;
    }
    /* cena: escolhe uma opção (evita soltar e vender) */
    const esc = page.locator('#escolhas .escolha:not([disabled])').filter({hasNotText:/Soltar|Vender|Não atender/});
    const ne = await esc.count();
    if (ne){
      const k = Math.floor(Math.random() * ne);
      const t = (await esc.nth(k).innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      /* a escolha da cena vai pro diário: qual cena, qual título, o que escolheu */
      await page.evaluate(x => window.__passo && __passo('escolha', {cena:Estado.dados.cena, modo:Estado.dados.modo,
        titulo:((document.querySelector('#app .cap-cabecalho .tit') || {}).innerText || '').trim(), texto:x.slice(0, 200)}), t).catch(() => {});
      /* o PokéNav toca 80 ms depois de o capítulo abrir (o toque da
         virada): com a ligação por cima, o clique esperava 30 s e
         derrubava a jogada. Agora desiste rápido, e a volta seguinte
         atende a janela */
      await esc.nth(k).click({timeout:3000}).catch(() => {}); await page.waitForTimeout(90); continue;
    }
    const outros = page.locator('.painel button.btn:not([disabled]), .painel .escolha:not([disabled])');
    if (await outros.count()){ await outros.first().click({timeout:3000}).catch(() => {}); continue; }
    anota('tela sem ação', await page.evaluate(() => document.querySelector('#app').innerText.slice(0, 120)));
    await page.evaluate(() => Exploracao.tela()).catch(() => {});
  }

  const reg = await page.evaluate(() => { const r = Object.assign({}, window.__reg); delete r.contexto; return r; }).catch(() => null);
  const fim = await page.evaluate(() => ({cap:Estado.dados.capitulo, ins:Estado.dados.insignias.length, local:Estado.dados.local,
    time:Estado.dados.time.map(p => nomeExib(p) + ' ' + p.nivel), dia:Estado.dados.relogio.dia})).catch(() => null);
  /* a ficha de quem jogou: quem é, o inicial, o time, o que carrega e o
     diário do próprio jogo (Estado.registrar) */
  const ficha = await page.evaluate(() => {
    const d = Estado.dados, j = d.jogador;
    const ini = typeof inicialDoJogador === 'function' ? inicialDoJogador(d) : null;
    const rep = Estado.nivelRep ? Estado.nivelRep() : null, pd = Estado.pdex();
    return {nome:j.nome, genero:j.genero, cidade:j.cidade, retrato:j.retrato, casa:j.casa, meta:j.meta || null, objetivo:j.objetivo,
      forte:j.forte, status:j.status, gostos:j.gostos || null, desgostos:j.desgostos || null, personalidade:j.personalidade,
      inicial:{dex:j.inicialDex, especie:j.inicialDex && DEX[j.inicialDex] ? DEX[j.inicialDex].nome : null,
        agora:ini ? {nome:nomeExib(ini), especie:ini.nome, dex:ini.dex, nivel:ini.nivel} : null},
      time:d.time.map(p => ({dex:p.dex, especie:p.nome, apelido:p.apelido || null, nivel:p.nivel, genero:generoDe(p), natureza:p.natureza,
        golpes:p.golpes.map(g => g.nome), hp:p.hp, hpMax:p.hpMax, moral:p.moral, shiny:!!p.shiny, segurando:p.segurando || null})),
      pc:(d.pc || []).map(p => ({dex:p.dex, especie:p.nome, nivel:p.nivel})),
      cemiterio:(d.cemiterio || []).map(p => ({especie:p.nome, nome:nomeExib(p), causa:p.causaMorte})),
      insignias:d.insignias.slice(), dinheiro:j.dinheiro, reputacao:rep ? rep.nome : null, eixo:d.reputacao && d.reputacao.eixo,
      via:d.via || null, linha:typeof linhaAtual === 'function' ? linhaAtual(d) : null, cargos:(d.cargos || []).slice(),
      capitulo:d.capitulo, fechados:(d.capitulosFechados || []).slice(), dia:d.relogio.dia,
      pokedex:{vistos:Object.keys(pd.vistos || {}).length, catalogados:Object.keys(pd.catalogados || {}).length},
      itens:Object.assign({}, d.itens), diario:(d.log || []).slice(-250)};
  }).catch(e => ({erro:e.message}));
  fs.writeFileSync(OUT, JSON.stringify({fim, ficha, erros, achados, reg, log, avanco:global.__avanco || null}, null, 1));
  console.log('FIM', JSON.stringify(fim));
  console.log('ERROS', erros.length ? erros.slice(0, 8).join('\n') : 'nenhum');
  if (reg && reg.gastos && Object.keys(reg.gastos).length){
    console.log('GASTOS (todo dinheiro que saiu, pela função que tirou):');
    Object.entries(reg.gastos).sort((x, y) => y[1].total - x[1].total).slice(0, 8)
      .forEach(([k, v]) => console.log(`  ${v.n}× −${v.total} ₽  ${k}  (a 1ª: cap ${v.ex.cap}, ${v.ex.local}, ${v.ex.cena || 'mapa'})`));
  }
  console.log('ACHADOS', Object.keys(achados).length);
  Object.entries(achados).sort((a, b) => b[1] - a[1]).slice(0, 40).forEach(([k, n]) => console.log(' ', n, k));
  await browser.close();
})();
