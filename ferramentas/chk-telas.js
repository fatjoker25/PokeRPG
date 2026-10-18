/* chk-telas — abre cada tela e cada janela do jogo num navegador de verdade
   e acusa erro de JavaScript e texto quebrado.

   Monta um save cheio (time de seis com shiny, PC, cemitério, mochila com
   tudo, TMs, ferramenta quebrada, insígnias, aparelhos, todo lugar
   visitado) e passa por:
     - todo lugar do mapa: a tela do lugar e cada afazer da lista dele
       (Centro, loja, casa, ginásio, veteranos, vasculhar, treinar…),
       cada um a partir do mesmo save;
     - as janelas: os cinco bolsos da mochila, time, sumário de cada
       Pokémon, Pokédex e as 251 fichas, PokéNav e cada contato, cartão,
       ficha (as cinco abas), diário, rota, códice de finais, credenciais, PC, ajustes,
       as abas do tutorial, a folha de regras, o mapa e a ficha de cada
       lugar nele;
     - toda loja, comprando e vendendo;
     - a rede: cada degrau em cada ponto, cada serviço e cada escolha
       dele, e a chegada de cada prova.

   Texto quebrado é o mesmo que o bot-jogador procura: marca de gênero
   sem resolver, "undefined", "NaN", "[object", HTML vazando. E todo
   balão de fala que aparecer tem que ter nome em cima e rosto com
   arquivo no disco, como o chk-baloes confere nas cenas.
   Precisa de Playwright (como o chk-baloes). */
const { chromium } = require('playwright');
const path = require('path');
const RAIZ = 'file://' + path.resolve(__dirname, '..', 'index.html');

const SUSPEITO = [
  [/\{[^{}]*\|[^{}]*\}/, 'marca sem resolver'],
  [/\{(o|a|ele|dele|um|do|pro|ao|casa|pk|pico|idade[^}]*)\}/, 'marca sem resolver'],
  [/\bundefined\b/, 'undefined'],
  [/\bNaN\b/, 'NaN'],
  [/\[object /, '[object]'],
  [/<\/?(p|div|span|b|button)\b/, 'HTML vazando'],
  [/\bnull\b/, 'null']
];

(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
  const page = await b.newPage({ viewport:{width:1100, height:1000} });
  const achados = new Map();
  let onde = 'carga';
  const anota = (tipo, txt) => {
    const k = `${tipo} :: ${txt}`;
    const a = achados.get(k) || {n:0, onde:new Set()};
    a.n++; if (a.onde.size < 4) a.onde.add(onde);
    achados.set(k, a);
  };
  page.on('pageerror', e => anota('ERRO JS', e.message + ' @ ' + ((e.stack || '').split('\n')[1] || '').trim()));
  page.on('dialog', d => d.dismiss());
  await page.goto(RAIZ);
  await page.waitForTimeout(500);

  /* o save cheio */
  const snap = await page.evaluate(() => {
    Estado.novo({nome:'Lia', genero:'Mulher', cidade:'Pallet', casaNome:'Delia', casaQuem:'mãe', nascimento:{dia:3, mes:9}});
    const d = Estado.dados;
    Object.assign(d.flags, {tem_pokedex:true, tem_cartao:true, tem_licenca:true});
    Estado.ganharPokenav();
    d.capitulo = 12;
    d.jogador.dinheiro = 90000;
    d.insignias = ['Insígnia Pedra', 'Insígnia Cascata', 'Insígnia Trovão', 'Insígnia Arco-Íris'];
    const sh = criarPokemon(6, 36); sh.shiny = true;
    d.time = [criarPokemon(25, 30), sh, criarPokemon(130, 32), criarPokemon(94, 31), criarPokemon(143, 33), criarPokemon(65, 34)];
    d.time[3].segurando = 'Resto de Ração';
    d.pc = [criarPokemon(19, 10), criarPokemon(129, 20), criarPokemon(1, 15)];
    const m = criarPokemon(16, 12); m.morto = true; m.causaMorte = 'Rota 2, contra um Spearow'; d.cemiterio = [m];
    for (const [n, q] of [['Poké Ball', 10], ['Great Ball', 5], ['Ultra Ball', 3], ['Potion', 5], ['Super Potion', 2], ['Revive', 2],
      ['Antidote', 2], ['Full Heal', 1], ['Éter', 1], ['PP Up', 1], ['Bandagem', 2], ['Ração', 6], ['Repelente', 2], ['Moon Stone', 1],
      ['Pedra do Fogo', 1], ['Fóssil de Hélice', 1], ['Exp. Share', 1], ['Machado', 2], ['Picareta', 1], ['Lanterna', 1], ['Pilha', 3],
      ['Corda', 1], ['Mapa de Kanto', 1], ['Relógio', 1], ['Mochila Azul', 1], ['TM24 Thunderbolt', 1], ['TM11 Sunny Day', 1], ['Isca', 2]])
      Estado.darItem(n, q);
    d.itens['Bilhete do Célio'] = 1;
    if (typeof Desgaste !== 'undefined'){ for (let i = 0; i < 15; i++) Desgaste.usar('Machado'); }
    for (const id of Object.keys(LOCAIS)){ Mundo.marcarVisitado(id); Mundo.descobrir('local_' + id); }
    const pd = Estado.pdex();
    for (let i = 1; i <= 251; i++){ pd.vistos[i] = true; if (i % 2) pd.catalogados[i] = true; }
    d.local = 'celadon';
    return JSON.stringify(Estado.dados);
  });

  const restaurar = async () => page.evaluate(s => {
    if (typeof Batalha !== 'undefined') Batalha.ativo = false;
    if (typeof Jogo !== 'undefined'){ Jogo.encenando = false; Jogo.animandoBola = false; Jogo.fimPendente = null; }
    UI.fecharModal && UI.fecharModal(true);
    Estado.dados = JSON.parse(s);
  }, snap);

  /* balão de fala: nome em cima e rosto, como o chk-baloes confere nas cenas */
  const rostos = new Set();
  const olhar = async (rotulo) => {
    onde = rotulo;
    await page.waitForTimeout(120);
    const baloes = await page.evaluate(() => {
      const meu = Estado.j ? Estado.j.nome : null, out = [];
      document.querySelectorAll('#app .fala, #modal .fala').forEach(e => {
        if (e.classList.contains('voce') || e.classList.contains('minha') || e.classList.contains('jogador')) return;
        /* a mesma pessoa de novo, logo em seguida: o rosto fica guardado (.fala-retrato.vazio) de propósito */
        if (e.classList.contains('segue')) return;
        const q = e.querySelector('.fala-quem');
        if (!q){ out.push({sem:'dono', t:e.innerText.slice(0, 60)}); return; }
        const n = q.innerText.trim();
        if (!n || n === meu || /^você$/i.test(n)) return;
        if (/^\?+$/.test(n)){ out.push({sem:'dono', t:e.innerText.slice(0, 60)}); return; }
        const img = e.querySelector('img.fala-retrato');
        out.push(img ? {src:img.getAttribute('src')} : {sem:'rosto', t:n});
      });
      return out;
    });
    for (const x of baloes){
      if (x.src){ rostos.add(x.src); continue; }
      anota(x.sem === 'dono' ? 'balão sem dono' : 'balão sem rosto', x.t);
    }
    const txt = await page.evaluate(() =>
      ((document.querySelector('#app') || {}).innerText || '') + '\n' + ((document.querySelector('#modal') || {}).innerText || ''));
    for (const [re, nome] of SUSPEITO){
      const m = re.exec(txt);
      if (m){ const i = txt.indexOf(m[0]); anota(nome, txt.slice(Math.max(0, i - 50), i + 50).replace(/\s+/g, ' ')); }
    }
  };
  const tentar = async (rotulo, fn, arg) => {
    onde = rotulo;
    try { await page.evaluate(fn, arg); } catch (e){ anota('ERRO JS', e.message.split('\n')[0]); }
    await olhar(rotulo);
  };

  /* o save do começo: um Pokémon, mochila quase vazia, nada visto —
     é onde aparece janela que não sabe lidar com lista vazia */
  const vazio = await page.evaluate(() => {
    Estado.novo({nome:'Téo', genero:'Homem', cidade:'Viridian', nascimento:{dia:1, mes:1}});
    Estado.dados.time = [criarPokemon(4, 5)];
    Estado.dados.local = 'viridian';
    return JSON.stringify(Estado.dados);
  });
  onde = 'começo';
  await page.evaluate(s => { Estado.dados = JSON.parse(s); Exploracao.tela(); }, vazio);
  await olhar('começo');
  for (const bolso of ['itens', 'remedios', 'pokebolas', 'tms', 'chave'])
    await tentar('começo/mochila/' + bolso, x => UI.modalItens(null, x), bolso);
  for (const [r, f] of [['time', 'modalTime'], ['pokédex', 'modalPokedex'], ['pokénav', 'modalNav'], ['cartão', 'modalCartao'],
    ['ficha', 'modalFicha'], ['diário', 'modalDiario'], ['rota', 'modalRota'], ['finais', 'modalFinais'],
    ['credenciais', 'modalCredenciais'], ['pc', 'modalPC']])
    await tentar('começo/' + r, x => UI[x](), f);
  for (const aba of ['perfil', 'status', 'jornada', 'pessoas', 'mundo'])
    await tentar('começo/ficha/' + aba, x => UI.modalFicha(x), aba);
  for (const a of await page.evaluate(() => afazeresDoLocal().map(a => a.id).filter(Boolean))){
    await page.evaluate(s => { Batalha.ativo = false; UI.fecharModal && UI.fecharModal(true); Estado.dados = JSON.parse(s); Exploracao.tela(); }, vazio);
    await tentar('começo/viridian/' + a, x => Exploracao.fazer(x), a);
  }

  /* ---------- janelas ---------- */
  await restaurar();
  await page.evaluate(() => Exploracao.tela());
  for (const bolso of ['itens', 'remedios', 'pokebolas', 'tms', 'chave'])
    await tentar('mochila/' + bolso, x => UI.modalItens(null, x), bolso);
  await tentar('time', () => UI.modalTime());
  const uids = await page.evaluate(() => Estado.dados.time.concat(Estado.dados.pc).map(p => p.uid));
  for (const u of uids) await tentar('sumário', x => UI.sumario(x), u);
  await tentar('pokédex', () => UI.modalPokedex());
  for (let i = 1; i <= 251; i++) await tentar('pokédex/' + i, x => UI.dexEntrada(x), i);
  await tentar('pokénav', () => UI.modalNav());
  const contatos = await page.evaluate(() => Estado.contatosNaAgenda().map(c => c.id));
  for (const c of contatos) await tentar('pokénav/' + c, x => UI.modalNav(x), c);
  for (const [r, f] of [['cartão', 'modalCartao'], ['ficha', 'modalFicha'], ['diário', 'modalDiario'], ['rota', 'modalRota'],
    ['finais', 'modalFinais'], ['credenciais', 'modalCredenciais'], ['pc', 'modalPC'], ['ajustes', 'modalAjustes'], ['regras', 'modalRegras']])
    await tentar(r, x => UI[x](), f);
  for (const aba of ['perfil', 'status', 'jornada', 'pessoas', 'mundo'])
    await tentar('ficha/' + aba, x => UI.modalFicha(x), aba);
  for (const t of ['passos', 'comeco', 'ficha', 'combate', 'natureza', 'vinculo', 'mundo', 'pokenav', 'risco'])
    await tentar('tutorial/' + t, x => UI.modalTutorial(x), t);
  await tentar('mapa', () => Exploracao.mapa('mochila'));
  for (const id of await page.evaluate(() => Object.keys(LOCAIS)))
    await tentar('mapa/' + id, x => Exploracao.mapaInfo(x), id);

  /* ---------- lojas ---------- */
  for (const id of await page.evaluate(() => Object.keys(LOJAS))){
    await restaurar();
    await tentar('loja/' + id, x => { Estado.dados.local = x; Cidade.loja(undefined, undefined, undefined); }, id);
    await tentar('loja/' + id + '/vender', x => Cidade.loja(0, undefined, 'vender'), id);
  }

  /* ---------- a rede: cada degrau, cada ponto, cada serviço e escolha ---------- */
  const naRede = async (n, local) => page.evaluate(([n, local, s]) => {
    if (typeof Batalha !== 'undefined') Batalha.ativo = false;
    UI.fecharModal && UI.fecharModal(true);
    Estado.dados = JSON.parse(s);
    const d = Estado.dados;
    d.reputacao.eixo = 'ruim'; d.reputacao.ruim = 4; d.capitulo = 24;
    d.cargos = ['rocket'];
    d.rede = {escalao:n, pontos:30, servicos:{}, provas:{brant:{venceu:true}}, ultimoServico:null, fora:false};
    d.local = local;
  }, [n, local, snap]);
  const pontos = await page.evaluate(() => Object.entries(PONTOS_DA_REDE).map(([k, v]) => [k, v.desde]));
  for (let n = 1; n <= 5; n++) for (const [local, desde] of pontos){
    if (n < desde) continue;
    await naRede(n, local);
    await tentar(`rede/${n}/${local}`, () => { Exploracao.tela(); Exploracao.fazer('rede'); });
    const servs = await page.evaluate(() => Rede.servicosAqui(Mundo.id()).map(s => [s.id, s.escolhas.length]));
    for (const [sid, k] of servs){
      await naRede(n, local);
      await tentar(`rede/${n}/${local}/${sid}`, x => Rede.servico(x), sid);
      for (let i = 0; i < k; i++){
        await naRede(n, local);
        await tentar(`rede/${n}/${local}/${sid}/${i}`, ([x, j]) => { Rede.servico(x); Rede.escolher(x, j); }, [sid, i]);
      }
    }
  }
  for (const id of await page.evaluate(() => Object.keys(PROVAS_DA_REDE))){
    const [n, local] = await page.evaluate(x => [PROVAS_DA_REDE[x].escalao - 1, PROVAS_DA_REDE[x].local], id);
    await naRede(n, local);
    await tentar(`rede/prova/${id}`, x => { Rede.tela(); Rede.abordarProva(x); }, id);
  }
  /* o cartão e a folha de regras com o nome do degrau */
  await naRede(3, 'celadon');
  await tentar('rede/cartão', () => UI.modalCartao());

  /* ---------- lugares e afazeres ---------- */
  for (const id of await page.evaluate(() => Object.keys(LOCAIS))){
    await restaurar();
    await tentar('lugar/' + id, x => { Estado.dados.local = x; Exploracao.tela(); }, id);
    const afs = await page.evaluate(() => afazeresDoLocal().map(a => a.id).filter(Boolean));
    for (const a of afs){
      await restaurar();
      await tentar(`lugar/${id}/${a}`, ([x, y]) => { Estado.dados.local = x; Exploracao.tela(); Exploracao.fazer(y); }, [id, a]);
      await page.waitForTimeout(250);
      await olhar(`lugar/${id}/${a}`);
    }
  }

  await b.close();
  const fs = require('fs');
  for (const src of rostos){
    if (src.startsWith('data:')) continue;
    if (!fs.existsSync(path.resolve(__dirname, '..', decodeURI(src)))){ onde = 'rostos'; anota('rosto que não existe no disco', src); }
  }
  const lista = [...achados].sort((x, y) => y[1].n - x[1].n);
  if (!lista.length){ console.log('telas: nenhuma janela nem lugar com erro ou texto quebrado.'); process.exit(0); }
  console.log(`ACHADOS (${lista.length}):`);
  for (const [k, a] of lista) console.log(`  ${String(a.n).padStart(3)}  ${k}\n        em: ${[...a.onde].join(', ')}`);
  process.exit(1);
})();
