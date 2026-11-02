/* chk-telas — abre cada tela e cada janela do jogo num navegador de verdade
   e acusa erro de JavaScript e texto quebrado.

   Monta um save cheio (time de seis com shiny, PC, cemitério, mochila com
   tudo, TMs, ferramenta quebrada, insígnias, aparelhos, todo lugar
   visitado) e passa por:
     - a inscrição (a criação de personagem): cada passo e cada opção,
       nos dois gêneros, até sair de casa;
     - todo lugar do mapa: a tela do lugar e cada afazer da lista dele
       (Centro, loja, casa, ginásio, veteranos, vasculhar, treinar…),
       cada um a partir do mesmo save;
     - as janelas: os cinco bolsos da mochila, time, sumário de cada
       Pokémon, Pokédex e as 251 fichas, PokéNav e cada contato, cartão,
       ficha (as cinco abas), diário, rota, códice de finais, credenciais,
       PC (com cada Pokémon selecionado e a ficha aberta de lá), ajustes
       (com as três velocidades da luta),
       as abas do tutorial, a folha de regras, o mapa e a ficha de cada
       lugar nele, e o mapa da parede do Centro;
     - salvar e carregar: o recibo do Salvar (do alto e dos Ajustes), a
       abertura com o Carregar jogo, o arquivo bom (com a etiqueta e o
       save cru), o ruim, e a volta pro jogo pelo arquivo;
     - toda loja, comprando e vendendo;
     - a rede: cada degrau em cada ponto, cada serviço e cada escolha
       dele, e a chegada de cada prova;
     - a tela de cada posto assumido e cada causa de doação paga (a do
       caderno do Célio é ligação, no PokéNav);
     - o rival que te para na saída do capítulo, numa cidade com Centro
       e numa rota sem, e a volta do balcão pra ele.

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
    d.time[3].segurando = 'Leftovers';
    d.pc = [criarPokemon(19, 10), criarPokemon(129, 20), criarPokemon(1, 15)];
    const m = criarPokemon(16, 12); m.morto = true; m.causaMorte = 'Rota 2, contra um Spearow'; d.cemiterio = [m];
    for (const [n, q] of [['Poké Ball', 10], ['Great Ball', 5], ['Ultra Ball', 3], ['Potion', 5], ['Super Potion', 2], ['Revive', 2],
      ['Antidote', 2], ['Full Heal', 1], ['Éter', 1], ['PP Up', 1], ['Bandagem', 2], ['Ração', 6], ['Repelente', 2], ['Moon Stone', 1],
      ['Pedra do Fogo', 1], ['Fóssil de Hélice', 1], ['Exp. Share', 1], ['Machado', 2], ['Picareta', 1], ['Lanterna', 1], ['Pilha', 3],
      ['Corda', 1], ['Mapa de Kanto', 1], ['Relógio', 1], ['Mochila escolar', 1], ['TM24 Thunderbolt', 1], ['TM11 Sunny Day', 1], ['Isca', 2]])
      Estado.darItem(n, q);
    d.itens['Bilhete do Célio'] = 1;
    if (typeof Desgaste !== 'undefined'){ for (let i = 0; i < 15; i++) Desgaste.usar('Machado'); }
    for (const id of Object.keys(LOCAIS)){ Mundo.marcarVisitado(id); Mundo.descobrir('local_' + id); }
    const pd = Estado.pdex();
    for (let i = 1; i <= 251; i++){ pd.vistos[i] = true; if (i % 2) pd.catalogados[i] = true; }
    d.local = 'celadon';
    /* respondeu a figura de capuz: com quatro insígnias, a intuição chama
       de volta a Lavender (o aviso no mapa e a ação no lugar) */
    d.flags.a_pergunta_do_curador = true;
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
      /* na inscrição ainda não tem jogo: Estado.dados é null */
      const meu = Estado.dados && Estado.dados.jogador ? Estado.dados.jogador.nome : null, out = [];
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

  /* ---------- a inscrição: cada passo e cada opção, nos dois gêneros, até sair de casa ---------- */
  for (const g of ['Homem', 'Mulher']){
    await tentar(`inscrição/${g}`, x => { UI.fecharModal && UI.fecharModal(true); Estado.dados = null; UI.telaCriacao(); UI.crAcao('genero', {v:x}); }, g);
    for (let i = 1; i < 6; i++)
      await tentar(`inscrição/${g}/passo ${i + 1}`, x => { UI._cr.alcancado = 5; UI.crAcao('passo', {v:String(x)}); }, i);
    await tentar(`inscrição/${g}/sorteada`, () => { UI.crAcao('passo', {v:'0'}); UI.crAcao('sortear', {}); });
    await tentar(`inscrição/${g}/cada opção`, () => {
      const c = UI._cr;
      for (const cid of CIDADES) UI.crAcao('cidade', {v:cid});
      for (const k of Object.keys(OBJETIVOS_DA_FICHA)) UI.crAcao('meta', {v:k});
      for (const grupo of TRACOS_DA_FICHA) for (const par of grupo.tracos){ UI.crAcao('traco', {v:par[0]}); UI.crAcao('traco', {v:par[0]}); }
      for (const t of TIPOS_KANTO) UI.crAcao('gosto', {lista:'desgostos', cat:'tipos', v:t});
      for (const [k] of LUGARES_DA_FICHA) UI.crAcao('gosto', {lista:'gostos', cat:'lugares', v:k});
      for (const k of MOCHILAS_DA_FICHA) UI.crAcao('mochila', {v:k});
      for (const r of RETRATOS_DA_FICHA[c.genero]) UI.crAcao('retrato', {v:r});
      /* os outros rostos do mesmo gênero, a um toque: abre, escolhe um de lá e fecha */
      UI.crAcao('maisRostos', {});
      UI.crAcao('retrato', {v:RETRATOS_DA_FICHA[c.genero][RETRATOS_A_VISTA]});
      UI.crAcao('maisRostos', {});
      for (const k of Object.keys(CORES_CARTAO)) UI.crAcao('cartao', {v:k});
      for (const q of PARENTESCOS) UI.crAcao('casaQuem', {v:q});
      for (const k of STATUS_DO_TREINADOR.map(s => s[0])) UI.crAcao('forte', {v:k});
      UI.crAcao('inicial', {v:'rand'}); UI.crAcao('ritmo', {v:'longo'});
      for (const f of ['nome', 'aparencia', 'vestimenta', 'casaNome', 'tracos']) UI.crAcao('dado', {v:f});
      if (!c.forte) UI.crAcao('forte', {v:'sorte'});
      UI.crAcao('passo', {v:'5'});
    });
    /* o "Mais rostos" só abre fotos do gênero da ficha, e o que está marcado
       numa lista de gosto fica trancado na outra */
    const regras = await page.evaluate(() => {
      const c = UI._cr, falhas = [];
      UI.crAcao('passo', {v:'3'}); UI.crAcao('maisRostos', {});
      const outro = RETRATOS_DA_FICHA[c.genero === 'Homem' ? 'Mulher' : 'Homem'];
      const vistas = [...document.querySelectorAll('.cr-retrato[data-v]')].map(b => b.dataset.v).filter(Boolean);
      if (vistas.some(v => outro.includes(v))) falhas.push('o "Mais rostos" mostra foto do outro gênero');
      if (vistas.length !== RETRATOS_DA_FICHA[c.genero].length) falhas.push(`o "Mais rostos" aberto mostra ${vistas.length} fotos, e o gênero tem ${RETRATOS_DA_FICHA[c.genero].length}`);
      UI.crAcao('maisRostos', {});
      UI.crAcao('passo', {v:'2'});
      const t = c.desgostos.tipos[0] || TIPOS_KANTO[0];
      if (!c.desgostos.tipos.includes(t)) UI.crAcao('gosto', {lista:'desgostos', cat:'tipos', v:t});
      UI.crAcao('gosto', {lista:'gostos', cat:'tipos', v:t});
      if (c.gostos.tipos.includes(t)) falhas.push(`o tipo ${t} entrou no gosto estando no desgosto`);
      const chip = document.querySelector(`.cr-gosto-gostos .cr-chip[data-cat="tipos"][data-v="${t}"]`);
      if (!chip || !chip.disabled) falhas.push(`o tipo ${t} do desgosto não fica trancado no gosto`);
      for (const cat of ['lugares', 'tipos', 'dex'])
        for (const v of c.gostos[cat]) if (c.desgostos[cat].includes(v)) falhas.push(`${v} está nas duas listas`);
      return falhas;
    });
    for (const f of regras){ onde = `inscrição/${g}`; anota('inscrição', f); }
    await tentar(`inscrição/${g}/saiu de casa`, () => { UI.crAcao('passo', {v:'5'}); UI.crAcao('proximo', {}); });
    await tentar(`inscrição/${g}/cartão`, () => { Object.assign(Estado.dados.flags, {tem_pokedex:true, tem_cartao:true}); UI.modalCartao(); });
    await tentar(`inscrição/${g}/ficha`, () => UI.modalFicha('perfil'));
    const ok = await page.evaluate(() => !!(Estado.dados && Estado.j && Estado.j.meta && Estado.j.forte && Estado.j.status[Estado.j.forte] === 2));
    if (!ok){ onde = `inscrição/${g}`; anota('inscrição', 'a ficha não chegou inteira no Estado (meta, forte ou status)'); }
    /* a foto sai da pasta do jogador, nunca de rosto de NPC */
    const foto = await page.evaluate(() => Estado.j && Estado.j.retrato);
    if (foto && !/^jogador\//.test(foto)){ onde = `inscrição/${g}`; anota('inscrição', `a foto da ficha saiu de ${foto}, fora de npcs/jogador/`); }
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
  /* o PC com cada um selecionado (do cinto e da caixa), e a ficha
     aberta de lá, que volta pro PC */
  for (const u of uids) await tentar('pc/' + u, x => UI.modalPC(x), u);
  for (const u of uids.slice(0, 2).concat(uids.slice(-1)))
    await tentar('pc/ver ficha', x => { UI.pcVerFicha(x); UI.sumario(x, 'golpes'); }, u);
  /* a velocidade da luta nos Ajustes: as três, e volta pra 1× */
  for (const v of [2, 3, 1]) await tentar('ajustes/velocidade ' + v, x => { UI.modalAjustes(); Velocidade.definir(x); }, v);
  for (const aba of ['perfil', 'status', 'jornada', 'pessoas', 'mundo'])
    await tentar('ficha/' + aba, x => UI.modalFicha(x), aba);
  for (const t of ['passos', 'comeco', 'ficha', 'combate', 'natureza', 'vinculo', 'mundo', 'pokenav', 'risco'])
    await tentar('tutorial/' + t, x => UI.modalTutorial(x), t);
  await tentar('mapa', () => Exploracao.mapa('mochila'));
  for (const id of await page.evaluate(() => Object.keys(LOCAIS)))
    await tentar('mapa/' + id, x => Exploracao.mapaInfo(x), id);
  /* o da parede: pelo balcão do Centro (com a volta) e pela tela do lugar */
  for (const o of ['centro', 'parede']) await tentar('mapa da parede/' + o, x => Exploracao.mapa(x), o);

  /* ---------- salvar e carregar ---------- */
  await restaurar();
  await page.evaluate(() => Exploracao.tela());
  await tentar('salvar', () => UI.modalSalvar());
  await tentar('ajustes/salvar', () => { UI.modalAjustes(); UI.modalSalvar(); });
  const arquivo = await page.evaluate(() => ArquivoSave.texto());
  /* a abertura com a jornada salva (o cartão diz de quem é) e sem ela */
  await tentar('abertura', () => { UI.fecharModal(true); Estado.salvar('auto'); UI.telaInicial(); });
  if (!(await page.evaluate(() => [...document.querySelectorAll('.tela-titulo button')].some(b => /Carregar jogo/.test(b.textContent))))){
    onde = 'abertura'; anota('carregar', 'a abertura não tem o Carregar jogo');
  }
  if (!(await page.evaluate(() => /Lia/.test((document.querySelector('.tt-jornada') || {}).textContent || '')))){
    onde = 'abertura'; anota('abertura', 'o cartão da jornada salva não diz de quem ela é');
  }
  await tentar('abertura/sem jornada', () => { try { localStorage.removeItem('pokerpg_save_auto'); } catch (e) {} UI.telaInicial(); });
  if (!(await page.evaluate(() => [...document.querySelectorAll('.tela-titulo button')].some(b => /Começar/.test(b.textContent))))){
    onde = 'abertura/sem jornada'; anota('abertura', 'sem jornada salva, a abertura não tem o Começar');
  }
  /* quem acabou de abrir o jogo: nada carregado ainda (Estado.dados nulo),
     e cada janela do menu da abertura tem que abrir assim */
  for (const f of ['modalRegras', 'modalTutorial', 'modalFinais', 'modalAjustes'])
    await tentar('abertura/sem jogo/' + f, x => { UI.fecharModal && UI.fecharModal(true); Estado.dados = null; UI.telaInicial(); UI[x](); }, f);
  await tentar('carregar', () => UI.modalCarregar(false));
  for (const [r, t] of [['quebrado', '{"jogo":"PokéRPG","save":{'], ['outro json', '{"a":1}'], ['save cru', snap], ['arquivo', arquivo]])
    await tentar('carregar/' + r, x => UI.lerTextoDeSave(x), t);
  await tentar('carregar/usar', () => UI.usarSaveLido());
  if (!(await page.evaluate(() => !!(Estado.dados && Estado.dados.jogador.nome === 'Lia' && document.querySelector('.topo'))))){
    onde = 'carregar/usar'; anota('carregar', 'o arquivo carregado não voltou pro jogo');
  }
  /* as três jornadas: a aba vazia tem o Começar, e o arquivo carregado
     noutro lugar não apaga a que já estava */
  await tentar('abertura/jornada 2', () => { UI.fecharModal && UI.fecharModal(true); UI.telaInicial(); UI.escolherJornada(2); });
  if (!(await page.evaluate(() => Estado.jornada === 2 && [...document.querySelectorAll('.tela-titulo button')].some(b => /Começar/.test(b.textContent))
      && /Lia/.test((document.querySelector('.tt-slot[data-n="1"]') || {}).textContent || '')))){
    onde = 'abertura/jornada 2'; anota('jornadas', 'a aba da jornada vazia não tem o Começar, ou a aba da 1 não diz de quem ela é');
  }
  await tentar('carregar/noutro lugar', a => { UI.modalCarregar(false); UI.lerTextoDeSave(a); UI.alvoDoCarregar(3); UI.usarSaveLido(); }, arquivo);
  if (!(await page.evaluate(() => Estado.jornada === 3 && Estado.existeSave(1) && Estado.existeSave(3) && !Estado.existeSave(2)))){
    onde = 'carregar/noutro lugar'; anota('jornadas', 'carregar na Jornada 3 não ficou na 3, ou apagou a 1');
  }
  await tentar('abertura/três abas', () => { Estado.apagarSave(3); Estado.usarJornada(1); UI.telaInicial(); });
  /* a letra maior na história, no PokéNav e nos Ajustes, e de volta ao normal */
  await restaurar();
  await tentar('letra/maior', () => { Letra.definir('maior'); Exploracao.tela([{tipo:'info', texto:fala('a enfermeira', 'Pronto.')}]); UI.modalAjustes(); });
  await tentar('letra/maior/pokénav', () => UI.modalNav());
  await page.evaluate(() => { UI.fecharModal && UI.fecharModal(true); Letra.definir('normal'); });

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

  /* ---------- postos e doações ---------- */
  for (const id of await page.evaluate(() => CARGOS.map(c => c.id))){
    await restaurar();
    await tentar('posto/' + id, x => UI.telaCargo(Cargos.porId(x), []), id);
  }
  for (const [causa, local] of [['museu', 'pewter'], ['abrigo', 'lavender'], ['bolsa', 'celadon']]){
    await restaurar();
    await tentar('doação/' + causa, ([c, l]) => {
      const d = Estado.dados;
      d.local = l; d.flags.sabe_da_lona_do_museu = true;
      Mundo.descobrir('andou_' + l); Estado.registrarNumero('goro');
      Exploracao.tela(); Exploracao.fazer('doar'); Cidade.doarPara(c);
    }, [causa, local]);
  }

  /* ---------- o rival na saída do capítulo ---------- */
  for (const local of ['celadon', 'rota12']){
    await restaurar();
    await tentar('rival/' + local, x => {
      Estado.dados.local = x; Estado.dados.npcs['Ezra'] = {nome:'Ezra', opiniao:2, memorias:[]};
      Jogo.encontroRival = {tipo:'teo', nome:'Ezra'}; UI.telaRival();
    }, local);
  }
  await tentar('rival/celadon/centro', () => { Estado.dados.local = 'celadon'; Jogo.hubCentro('rival'); });

  /* os rivais extras em cada arco: a estreia na cidade, a volta depois
     de passar reto (na água, onde a Diana chega de Lapras) e o placar
     na rota, com o resultado da luta pros dois lados e a Ficha */
  const extras = await page.evaluate(() => RIVAIS_EXTRA.map(R => [R.id, Object.keys(R.arcos || {padrao:1})]));
  for (const [id, arcos] of extras) for (const arco of arcos)
    for (const [local, enc, evitou] of [['celadon', 0, 0], ['seafoam', 0, 1], ['rota8', 3, 0]]){
      await restaurar();
      await tentar(`rival/${id}/${arco}/${local}${evitou ? '/passou' : ''}`, ([id, arco, local, enc, evitou]) => {
        const R = defRival(id);
        Estado.dados.local = local;
        registroRivais()[id] = {id, nome:R.nome, vitorias:enc ? 2 : 0, derrotas:enc ? 1 : 0, encontros:enc,
                                ultimoCap:0, desdeCap:9, evitou, apresentado:!!(enc || evitou)};
        const orig = arcoRivalExtra;
        arcoRivalExtra = () => arco;
        try {
          /* as três telas uma depois da outra: o que cada uma desenhou
             volta pro fim do #app, pra ser olhado junto com a Ficha */
          const app = () => document.getElementById('app').innerHTML;
          Jogo.encontroRival = {tipo:'extra', id, nome:R.nome}; UI.telaRival();
          const telas = [app()];
          UI.telaResultadoRival(true, [], id); telas.push(app());
          UI.telaResultadoRival(false, [], id); telas.push(app());
          UI.modalFicha('jornada');
          telas.forEach(t => document.getElementById('app').insertAdjacentHTML('beforeend', t));
        } finally { arcoRivalExtra = orig; }
      }, [id, arco, local, enc, evitou]);
    }

  /* ---------- o chaveamento do torneio e da Conferência, e o menu de Pokébola ---------- */
  for (const rodada of [0, 1, 2]){
    await restaurar();
    await tentar('torneio/' + rodada, r => {
      Estado.dados.local = 'planalto'; Estado.dados.npcs['Ezra'] = {nome:'Ezra', opiniao:2, memorias:[]};
      Jogo.torneioAtual = {rodada:r, adversarios:montarChaveamento()}; UI.telaTorneio();
    }, rodada);
    await restaurar();
    await tentar('conferência/' + rodada, r => {
      Estado.dados.local = 'planalto'; Jogo.conferenciaAtual = {rodada:r, adversarios:montarConferencia()}; UI.telaConferencia();
    }, rodada);
  }
  await page.evaluate(() => { Jogo.torneioAtual = null; Jogo.conferenciaAtual = null; });

  /* ---------- a festa da vitória (vitoria.js), adiantada até o fim ---------- */
  const FESTAS = [
    ...['pewter', 'cerulean', 'vermilion', 'celadon', 'fuchsia', 'saffron', 'cinnabar', 'viridian'].map(id =>
      ['ginásio/' + id, `Jogo.ginasioAtual = GINASIOS.find(g => g.id === '${id}'); Jogo.resultadoGinasio({resultado:'vitoria'})`]),
    ...[0, 1, 2, 3].map(i => ['elite/' + i, `Estado.dados.local = 'planalto'; Jogo.eliteAtual = {indice:${i}, campeao:false}; Jogo.resultadoElite({resultado:'vitoria'})`]),
    ['campeão', `Estado.dados.local = 'planalto'; Jogo.eliteAtual = {indice:4, campeao:true}; Jogo.resultadoElite({resultado:'vitoria'})`],
    ...[0, 1, 2].map(r => ['torneio/' + r, `Estado.dados.local = 'planalto'; Jogo.torneioAtual = {rodada:${r}, adversarios:montarChaveamento()}; Jogo.resultadoTorneio({resultado:'vitoria'})`]),
    ...[0, 1, 2].map(r => ['conferência/' + r, `Estado.dados.local = 'planalto'; Jogo.conferenciaAtual = {rodada:${r}, adversarios:montarConferencia()}; Jogo.veteranoAtual = {tipo:'conferencia'}; Conferencia.resultado({resultado:'vitoria'})`])
  ];
  for (const [rot, codigo] of FESTAS){
    await restaurar();
    await tentar('festa/' + rot, c => {
      Estado.dados.insignias = ['Insígnia Pedra', 'Insígnia Cascata'];
      (0, eval)(c);
      const b = document.querySelector('#modal .vt-seguir');
      if (!b) throw new Error('a festa não abriu');
      b.click();   /* o primeiro toque adianta tudo: a tela é a do fim */
    }, codigo);
    await page.evaluate(() => { const b = document.querySelector('#modal .vt-seguir'); if (b) b.click(); });
  }
  /* as finais de torneio da história: a festa vem do batalha da cena */
  for (const cap of [8, 22]){
    await restaurar();
    await tentar(`festa/final do capítulo ${cap}`, n => {
      const C = CAPITULOS.find(c => c.num === n);
      const b = Object.values(C.cenas).map(x => x.batalha).find(x => x && x.festa);
      if (!b) throw new Error('capítulo ' + n + ' sem final com festa');
      Vitoria.mostrar(Vitoria.daCena(b.festa, b));
      document.querySelector('#modal .vt-seguir').click();
    }, cap);
    await page.evaluate(() => { const b = document.querySelector('#modal .vt-seguir'); if (b) b.click(); });
  }
  await page.evaluate(() => { Jogo.torneioAtual = null; Jogo.conferenciaAtual = null; Jogo.eliteAtual = null; Jogo.veteranoAtual = null; });
  await restaurar();
  await tentar('pokébolas', () => { Estado.darItem('Master Ball', 1); Exploracao.tela(); UI.menuBolas(); });

  /* ---------- os titulares da Elite: a pista, cada jeito e cada escolha da visita ---------- */
  const JEITOS = {
    lorelei:{volta:{devolveu_o_filhote:true}, fecha:{capturou_articuno:true}, fecha_traiu:{traiu_articuno:true},
             talvez:{achou_o_filhote:true, prometeu_a_articuno:true}, talvez_sem_saber:{}},
    bruno:{volta:{sugeriu_a_sirene:true, protegeu_o_rapaz:true}, volta_moleque:{pagou_o_rapaz:true}, fecha:{entregou_o_rapaz:true}, talvez:{}},
    agatha:{volta:{acalmou_marowak:true}, volta_olhou:{entendeu_a_cena:true}, raiva:{usou_escudo:true}, raiva_bateu:{bateu_no_marowak:true},
            talvez:{bateu_no_marowak:true, contou_a_verdade_ao_hideo:true}}
  };
  const naPorta = async (id, flags) => { await restaurar(); await page.evaluate(([id, flags]) => {
    const d = Estado.dados, t = TITULARES[id];
    d.capitulo = 20; d.capitulosFechados = (d.capitulosFechados || []).concat([17]);
    Object.assign(d.flags, flags); d.flags[t.pista] = true; d.local = t.local;
    Exploracao.tela();
  }, [id, flags]); };
  for (const [id, jeitos] of Object.entries(JEITOS)){
    /* a pista: o que a cidade mostra andando e o que ela conta conversando */
    await restaurar();
    await tentar(`titular/${id}/pista`, x => {
      const d = Estado.dados, t = TITULARES[x];
      d.capitulo = 20; d.local = t.local;
      const desc = DESCOBERTAS[t.local].find(a => a.ef && a.ef.flag === t.pista);
      const conv = CONVERSAS[t.local].find(c => c.ef && c.ef.flag === t.pista);
      if (!desc || !conv) throw new Error('sem pista de ' + x + ' na cidade');
      if (!desc.cond(d) || !conv.cond(d)) throw new Error('pista de ' + x + ' fechada depois do 17');
      Exploracao.tela(desc.texto.concat(conv.texto).map(l => ({tipo:'info', texto:l})));
    }, id);
    for (const [j, flags] of Object.entries(jeitos)){
      await naPorta(id, flags);
      await tentar(`titular/${id}/${j}`, x => Exploracao.fazer('tit_' + x), id);
      const escolhas = await page.evaluate(x => (Eventos.porId('tit_' + x).escolhas || [])
        .map((o, i) => { try { return !o.cond || o.cond(Estado.dados) ? [i, !!o.teste] : null; } catch(e){ return null; } })
        .filter(Boolean), id);
      for (const [i, teste] of escolhas) for (const passa of (teste ? [true, false] : [true])){
        await naPorta(id, flags);
        await tentar(`titular/${id}/${j}/${i}${passa ? '' : '/ruim'}`, ([x, i, passa]) => {
          const orig = Eventos.rolar;
          Eventos.rolar = function(esc){ const r = orig.call(this, esc); if (r) r.passou = passa; return r; };
          try { Exploracao.fazer('tit_' + x); Jogo.resolverEvento('tit_' + x, i); } finally { Eventos.rolar = orig; }
        }, [id, i, passa]);
      }
    }
  }
  /* a Liga com os três de volta, com dois, e a Conselheira contando quem falta */
  for (const quem of [['lorelei', 'bruno', 'agatha'], ['bruno']]){
    await restaurar();
    await tentar('liga/titulares/' + quem.join('+'), q => {
      const d = Estado.dados;
      d.insignias = GINASIOS.map(g => g.insignia || g.id); d.flags.sabe_da_elite = true; d.local = 'planalto';
      q.forEach(id => { d.flags['titular_' + id] = 'voltou'; });
      UI.telaLiga();
    }, quem);
  }

  /* ---------- a creche da Rota 5: deixar, o ovo, buscar e o ovo chocando ---------- */
  for (const [rot, nacional, dexA, dexB] of [['par', false, 25, 26], ['ditto', false, 132, 81], ['bebê de Johto', true, 25, 25]]){
    await restaurar();
    await tentar(`creche/${rot}/deixar`, ([nac, x, y]) => {
      const d = Estado.dados; d.local = LUGAR_DA_CRECHE; d.flags.dex_nacional = nac;
      const a = criarPokemon(x, 20), b = criarPokemon(y, 20);
      a.genero = x === 132 ? null : 'm'; b.genero = y === 81 ? null : 'f';
      d.time = d.time.slice(0, 4).concat([a, b]);
      Exploracao.tela(); Creche.tela(); Creche.deixar(a.uid); Creche.tela(); Creche.deixar(b.uid); Creche.tela();
      if (!Creche.par(d.creche.pk[0], d.creche.pk[1])) throw new Error('a creche não viu o par');
      /* com a Pokédex Nacional, a primeira visita entrega o ovo sem dono (o Togepi) */
      if (nac !== d.ovos.some(o => o.dex === OVO_GUARDADO)) throw new Error('o ovo sem dono ' + (nac ? 'não veio' : 'veio sem a Pokédex Nacional'));
    }, [nacional, dexA, dexB]);
    /* o ovo sem esperar o dado: a senhora entrega, e a mochila mostra quanto falta */
    await tentar(`creche/${rot}/o ovo`, () => {
      const d = Estado.dados, c = d.creche, antes = Estado.contaItem(NOME_DO_OVO);
      c.ovo = {dex:Creche.especieDoOvo(c.pk[0], c.pk[1])};
      Creche.tela();
      if (Estado.contaItem(NOME_DO_OVO) !== antes + 1) throw new Error('o ovo não foi pra mochila');
    });
    await tentar(`creche/${rot}/ficha do ovo`, () => { UI._mochSel = {n:NOME_DO_OVO, quebrado:false}; UI.modalItens(null, 'chave'); });
    await tentar(`creche/${rot}/buscar`, () => {
      UI.fecharModal && UI.fecharModal(true);
      Estado.j.dinheiro = 50;                       /* sem o bastante: eles ficam com o que tem */
      Creche.tela(); Creche.buscar(0); Creche.tela(); Creche.buscar(0); Creche.tela();
    });
    await tentar(`creche/${rot}/nasceu`, () => {
      const d = Estado.dados, antes = d.time.length + d.pc.length, ovos = d.ovos.length;
      UI.fecharModal && UI.fecharModal(true);
      Relogio.avancar(HORAS_DO_OVO + 1); Exploracao.tela();
      if (d.time.length + d.pc.length !== antes + ovos || Estado.contaItem(NOME_DO_OVO)) throw new Error('o ovo não chocou');
    });
  }

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
