/* ============================================================
   O JOGO PUBLICADO, NA TELA DO CELULAR
   Abre o artefato.html como a publicação serve ele, em três celulares
   (320, 390 e 360 px), passa pela abertura, pela inscrição inteira com a
   Customização, pelo capítulo 1, e num save do meio do jogo abre o
   lugar, o mapa, a mochila, o time, o PokéNav, a Ficha, a Pokédex, o
   PC, o Salvar, as regras, os ajustes, a Liga, a loja, o Centro, uma
   tarefa da cidade (o pedido, o passo, a volta e o selo), as Missões, uma luta (o
   tutorial dela passo a passo, golpes, mochila e um turno) e a
   evolução. Acusa a página que
   rola de lado, o que fica pra fora da tela sem estar numa caixa que
   rola, erro de JavaScript e texto quebrado.

   O artefato.html é só o miolo: quem põe o <meta name="viewport"> e o
   reset (img com max-width, [hidden], body de 14 px) é a publicação.
   Aberto solto, o celular desenha a página com 980 px e encolhe, e
   tudo parece caber — o primeiro teste deu 105 telas limpas assim. Por
   isso ele é aberto aqui dentro do mesmo esqueleto.

   Rode depois do build. As fotos (em px de CSS) ficam na pasta de saída.

   Uso:  python3 build.py && node ferramentas/chk-celular.js [pasta-das-fotos]
   ============================================================ */
const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ARTEFATO = path.resolve(__dirname, '..', 'artefato.html');
const SAIDA = process.argv[2] || path.join(os.tmpdir(), 'pokerpg-celular');
fs.mkdirSync(SAIDA, {recursive:true});

/* o esqueleto da publicação, em volta do miolo */
const ESQUELETO_ANTES = '<!doctype html><html><head><meta charset="utf-8">'
  + '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  + '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
  + 'body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:14px;background:#f7f7f5}'
  + 'img{max-width:100%}[hidden]{display:none!important}</style></head><body>';
const PAGINA = path.join(SAIDA, 'publicado.html');
fs.writeFileSync(PAGINA, ESQUELETO_ANTES + fs.readFileSync(ARTEFATO, 'utf8') + '</body></html>');

const APARELHOS = [
  ['iphone-se', devices['iPhone SE']],
  ['iphone-13', devices['iPhone 13']],
  ['android-360', {viewport:{width:360, height:780}, deviceScaleFactor:1, isMobile:true, hasTouch:true,
    userAgent:devices['Pixel 5'].userAgent}]
];

const SUSPEITO = [
  [/\{[^{}]*\|[^{}]*\}/, 'marca sem resolver'], [/\bundefined\b/, 'undefined'], [/\bNaN\b/, 'NaN'],
  [/\[object /, '[object]'], [/<\/?(p|div|span|b)\b/, 'HTML vazando']
];

(async () => {
  const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
  const problemas = [];
  let telas = 0;
  for (const [nomeAp, ap] of APARELHOS){
    const ctx = await browser.newContext(Object.assign({}, ap, {acceptDownloads:true}));
    const page = await ctx.newPage();
    const erros = [];
    page.on('pageerror', e => erros.push(e.message));
    page.on('dialog', d => d.accept());
    page.on('download', d => d.cancel().catch(() => {}));
    await page.goto('file://' + PAGINA);
    await page.waitForTimeout(1200);

    const medir = async (rotulo) => {
      /* a janela entra crescendo (modalEntra): medir no meio da entrada dá largura de mentira */
      await page.waitForTimeout(450);
      const m = await page.evaluate(() => {
        const W = innerWidth, fora = [];
        const docW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
        const dentroDeCaixa = el => {
          for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement)
            if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(a).overflowX)) return true;
          return false;
        };
        for (const el of document.querySelectorAll('body *')){
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) continue;
          if ((r.right > W + 1 || r.left < -1) && !dentroDeCaixa(el)){
            const cl = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
            fora.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cl ? '.' + cl : ''} [${Math.round(r.left)}..${Math.round(r.right)}]`);
          }
        }
        const txt = (document.querySelector('#app') || document.body).innerText + '\n' + ((document.querySelector('#modal') || {}).innerText || '');
        return {W, docW, fora, txt};
      });
      telas++;
      const ruins = [];
      for (const [re, n] of SUSPEITO){
        const x = m.txt.match(re);
        if (x){ const i = m.txt.indexOf(x[0]); ruins.push(n + ': ' + m.txt.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, ' ')); }
      }
      const achou = [];
      if (m.docW > m.W + 1) achou.push(`a página rola de lado (${m.docW} px numa tela de ${m.W})`);
      if (m.fora.length) achou.push(`pra fora da tela: ${m.fora.slice(0, 4).join(' ; ')}${m.fora.length > 4 ? ` (+${m.fora.length - 4})` : ''}`);
      achou.push(...ruins, ...erros.splice(0).map(e => 'ERRO JS: ' + e));
      if (achou.length) problemas.push(`${nomeAp} · ${rotulo}: ${achou.join(' | ')}`);
      await page.screenshot({path:path.join(SAIDA, `${nomeAp}-${rotulo}.png`), scale:'css'});
    };
    const tentar = async (rotulo, fn, arg) => {
      try { await page.evaluate(fn, arg); } catch (e){ erros.push(rotulo + ': ' + e.message.split('\n')[0]); }
      await medir(rotulo);
    };

    await medir('abertura');
    /* a inscrição: o primeiro passo, o sorteio e cada passo, com a Customização */
    await page.locator('button.tt-principal:has-text("Começar")').first().click();
    await medir('inscricao-1');
    await page.fill('#f-nome', 'Íris');
    await page.locator('#f-genero button[data-v="Mulher"]').click();
    await page.locator('#cr-sortear').click();
    for (let i = 0; i < 6; i++){
      const b = page.locator(`#cr-passos button[data-v="${i}"]`);
      if (await b.count() && await b.isEnabled()){ await b.click(); await medir('inscricao-passo' + (i + 1)); }
    }
    await page.locator('#cr-passos button[data-v="3"]').click();
    const aba = page.locator('.cr-provador [role="tab"]').nth(3);
    if (await aba.count()){ await aba.click(); await medir('customizacao-aba'); }
    await page.locator('#cr-passos button[data-v="5"]').click();
    await page.locator('#cr-proximo').click();
    await page.waitForTimeout(600);
    await medir('capitulo-1');

    /* o meio do jogo: time de seis, PC, mochila cheia, tudo visitado */
    await page.evaluate(() => {
      const d = Estado.dados;
      Object.assign(d.flags, {tem_pokedex:true, tem_cartao:true, tem_licenca:true});
      Estado.ganharPokenav();
      d.capitulo = 12; d.capitulosFechados = [1,2,3,4,5,6,7,8,9,10,11,12]; d.cena = null; d.modo = 'mundo';
      d.jogador.dinheiro = 90000;
      d.insignias = ['Insígnia Pedra', 'Insígnia Cascata', 'Insígnia Trovão', 'Insígnia Arco-Íris'];
      const sh = criarPokemon(6, 36); sh.shiny = true;
      d.time = [criarPokemon(25, 30), sh, criarPokemon(130, 32), criarPokemon(94, 31), criarPokemon(143, 33), criarPokemon(65, 34)];
      d.pc = [criarPokemon(19, 10), criarPokemon(129, 20), criarPokemon(1, 15)];
      for (const [n, q] of [['Poké Ball', 10], ['Great Ball', 5], ['Ultra Ball', 3], ['Potion', 5], ['Super Potion', 2], ['Revive', 2],
        ['Ração', 6], ['Repelente', 2], ['Moon Stone', 1], ['Machado', 1], ['Lanterna', 1], ['Pilha', 3], ['Mapa de Kanto', 1], ['Relógio', 1],
        ['Mochila escolar', 1], ['TM24 Thunderbolt', 1], ['Leftovers', 1]]) Estado.darItem(n, q);
      for (const id of Object.keys(LOCAIS)){ Mundo.marcarVisitado(id); Mundo.descobrir('local_' + id); }
      const pd = Estado.pdex();
      for (let i = 1; i <= 151; i++){ pd.vistos[i] = true; if (i % 2) pd.catalogados[i] = true; }
      d.local = 'celadon';
      Historia.capAtual = Historia.capitulo(12);
      Estado.salvar('auto');
    });
    await tentar('lugar', () => Exploracao.tela());
    await tentar('mapa', () => Exploracao.mapa());
    await tentar('mochila', () => { UI.fecharModal(true); UI.modalItens(); });
    await page.locator('#modal [data-item]').first().click().catch(() => {});
    await medir('mochila-item');
    await tentar('time', () => UI.modalTime());
    await tentar('pokenav', () => UI.modalNav());
    await page.locator('#modal .nav-contato').first().click().catch(() => {});
    await medir('pokenav-contato');
    for (const [r, f] of [['ficha', 'modalFicha'], ['pokedex', 'modalPokedex'], ['pc', 'modalPC'], ['salvar', 'modalSalvar'],
      ['regras', 'modalRegras'], ['ajustes', 'modalAjustes']])
      await tentar(r, x => UI[x](), f);
    await tentar('liga', () => { UI.fecharModal(true); Jogo.abrirLiga(); });
    await tentar('loja', () => { UI.fecharModal(true); Exploracao.tela(); Cidade.loja(); });
    await tentar('centro', () => { UI.fecharModal(true); Cidade.atenderAqui(); });
    /* as tarefas (tarefas.js): a Sylvie de Celadon pede, o passo
       na Rota 7 com a barra do que falta, a volta pronta na cidade e o selo */
    await tentar('tarefa-pedido', () => { UI.fecharModal(true); Exploracao.tela(); Tarefas.fazer('perfume_da_lotte'); });
    await tentar('tarefa-passo', () => {
      const d = Estado.dados;
      Tarefas.aceitar('perfume_da_lotte');
      Estado.darItem('Folha de Oddish', 1);
      d.local = 'rota7';
      Tarefas.passo('perfume_da_lotte');
    });
    await tentar('tarefa-volta', () => { Estado.darItem('Folha de Oddish', 2); Estado.dados.local = 'celadon'; Exploracao.tela(); });
    await tentar('tarefa-selo', () => Tarefas.entregar('perfume_da_lotte'));
    /* as Missões (missoes.js): o capítulo que espera, uma tarefa aberta,
       um favor do PokéNav com prazo e a tarefa cumprida no pé */
    await tentar('missoes', () => {
      UI.fecharModal(true);
      const d = Estado.dados, dia = d.relogio.dia;
      Tarefas.reg(d).pidgey_da_lia = {estado:'aberta', desde:dia};
      Recados.reg().pedido = {tipo:'perdido', quem:'casa', esp:'Rattata', dex:19, onde:'rota3', centro:'pewter', dia, ate:dia + 4};
      Exploracao.tela(); UI.modalMissoes();
    });
    /* o seu ginásio (defesa.js): a ficha do tipo do ginásio, a quadra com o
       regulamento e a escolha do time */
    await tentar('ginasio-ficha', () => {
      UI.fecharModal(true);
      const d = Estado.dados;
      for (let nv = 8; nv <= 56; nv += 4) d.pc.push(criarPokemon(nv < 20 ? 19 : 20, nv));
      Cargos.conceder('lider');
      Exploracao.tela();
    });
    await tentar('ginasio-quadra', () => {
      const d = Estado.dados, r = Defesa.reg().lider;
      Defesa.escolherTipo('Normal'); r.abre = d.relogio.dia;
      const t = Defesa.sortearDaEstrada(r, 5);
      r.desafio = {quem:t.id, estrada:true, nome:nomeDeLuta(t), curto:t.nome, f:t.artigo === 'uma', de:'', ins:5,
        fala:'Vim pela insígnia.', fama:0, dia:d.relogio.dia, ate:d.relogio.dia + 3, cap:capNaJornada(d)};
      d.local = r.ginasio; Defesa.tela('lider');
    });
    await tentar('ginasio-time', () => Defesa.montar());
    await tentar('ginasio-volta', () => { const d = Estado.dados; Defesa.reg().lider.desafio = null; d.local = 'celadon'; Exploracao.tela(); });
    /* o quadro da sua luta no torneio: o nome, e embaixo a classe, de
       onde vem e a faixa de nível (o nome não leva a classe) */
    await tentar('torneio-vez', () => {
      const d = Estado.dados;
      d.local = 'planalto';
      Jogo.torneioAtual = chaveAteARodada(novaChave('torneio'), 1);
      UI.telaTorneio();
    });
    await tentar('torneio-volta', () => { Jogo.torneioAtual = null; Estado.dados.local = 'celadon'; Exploracao.tela(); });
    /* a Patrulha na estrada (patrulha.js): a parada com a ordem de
       detenção, com o Zapdos visto na Pokébola, e a custódia */
    await tentar('patrulha', () => {
      UI.fecharModal(true);
      const d = Estado.dados;
      d.pc.push(criarPokemon(145, 50));
      const L = Estado.lend(145); L.estado = 'capturado'; L.disposicao = 'prisioneiro';
      Estado.marcar('captura_vista_145');
      Object.assign(d.liga, {avisos:3, ordemDevolucao:true, detencao:true, paradaDia:-1});
      const ch = Dados.chance; Dados.chance = () => true;
      try { Patrulha.talvez('rota7'); } finally { Dados.chance = ch; }
    });
    await tentar('patrulha-custodia', () => Patrulha.custodia('entregou'));
    /* a luta, assentada, com os golpes, a mochila e um turno */
    await tentar('luta', () => {
      UI.fecharModal(true); Estado.dados.local = 'rota7';
      Exploracao.encontro(sortearSelvagem('campo', 30, 'rota7'), ['Um Pokémon sai do mato.']);
    });
    await page.waitForTimeout(2500);
    await medir('luta-assentada');
    /* o tutorial da luta, passo a passo: o balão dentro da tela, sem
       tapar o botão da vez, e fechado no fim */
    const nTut = await page.evaluate(() => TutorialLuta.comecar() ? TutorialLuta._passos.length : 0);
    if (!nTut) problemas.push(`${nomeAp} · tutorial: não começou`);
    for (let k = 0; k < nTut; k++){
      /* a rolagem do passo é suave: mede depois que ela para */
      await page.waitForTimeout(700);
      const r = await page.evaluate(() => {
        const raiz = document.getElementById('tutorial-luta');
        if (!raiz) return null;
        const p = TutorialLuta._passos[TutorialLuta.i];
        const g = raiz.querySelector('.tl-guia').getBoundingClientRect();
        const b = raiz.querySelector('.tl-balao').getBoundingClientRect();
        const c = p.alvo ? TutorialLuta.caixa() : null;
        const falhas = [];
        if (g.top < -1 || g.bottom > innerHeight + 1) falhas.push('o balão sai da tela em cima ou embaixo');
        if (p.alvo && !c) falhas.push('o alvo não está na tela');
        if (c && (c.top < TutorialLuta.medidas().topo - 1 || c.bottom > innerHeight + 1)) falhas.push('o alvo ficou fora da tela ou embaixo do topo grudado');
        if (c && !(b.bottom <= c.top + 1 || b.top >= c.bottom - 1)) falhas.push('o balão tapa o alvo');
        return {id:p.id, falhas};
      });
      if (!r){ problemas.push(`${nomeAp} · tutorial: fechou no passo ${k + 1}`); break; }
      await medir(`luta-tutorial-${String(k + 1).padStart(2, '0')}-${r.id}`);
      r.falhas.forEach(f => problemas.push(`${nomeAp} · tutorial, passo ${r.id}: ${f}`));
      await page.evaluate(() => TutorialLuta.proximo());
    }
    if (await page.evaluate(() => TutorialLuta.ativo || !!document.getElementById('tutorial-luta')))
      problemas.push(`${nomeAp} · tutorial: não fechou no fim`);
    const lutar = page.locator('#acoes button:has-text("Lutar")');
    if (await lutar.count()){ await lutar.first().click(); await medir('luta-golpes'); }
    const voltar = page.locator('#acoes button:has-text("Voltar")');
    if (await voltar.count()) await voltar.first().click();
    const mochila = page.locator('#acoes button:has-text("Mochila")');
    if (await mochila.count()){ await mochila.first().click(); await medir('luta-mochila'); await page.evaluate(() => UI.fecharModal(true)); }
    if (await lutar.count()){
      await lutar.first().click();
      await page.locator('#acoes .golpe-btn:not([disabled])').first().click().catch(() => {});
      await page.waitForTimeout(3500);
      await medir('luta-turno');
    }
    await tentar('evolucao', () => { Batalha.ativo = false; UI.fecharModal(true); UI.telaEvolucao(Estado.dados.time[0], 26, () => Exploracao.tela()); });
    await page.waitForTimeout(1500);
    await medir('evolucao-meio');
    await tentar('abertura-com-jornada', () => { Estado.salvar('auto'); UI.telaInicial(); });
    await ctx.close();
  }
  await browser.close();
  console.log(`celular: ${telas} telas em ${APARELHOS.length} aparelhos (fotos em ${SAIDA})`);
  if (problemas.length){
    problemas.forEach(p => console.log('  ' + p));
    console.log(`${problemas.length} com problema`);
    process.exit(1);
  }
  console.log('ok — nenhuma página rolando de lado, nada pra fora da tela, sem erro e sem texto quebrado');
})();
