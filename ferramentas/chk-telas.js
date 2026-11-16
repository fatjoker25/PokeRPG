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
    /* a Unidade 01, que ainda não aceitou ninguém: a moral não aparece */
    if (typeof unidadeComissao === 'function'){ const u = unidadeComissao(150, 63, '01'); u.moral = 37; u.desdeCap = 12; d.pc.push(u); }
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

  /* quem saiu de casa sem cadastro (o save do começo não tem licença) faz
     no balcão de qualquer Centro, de dia e de noite: o botão no Centro e
     no balcão de credenciais, a conversa, o que vem com a licença — uma
     vez só, mesmo apertando duas — e o Centro de graça depois */
  const temCadastro = () => page.evaluate(() => {
    const ha = () => [...document.querySelectorAll('#modal .escolha, #modal .btn')].some(b => /cadastro/i.test(b.textContent));
    Cidade.centro(); const noCentro = ha(); UI.fecharModal(true);
    UI.modalCredenciais(); const noBalcao = ha(); UI.fecharModal(true);
    return {noCentro, noBalcao, bolas:Estado.contaItem('Poké Ball'), potion:Estado.contaItem('Potion')};
  });
  for (const hora of [10, 23]){
    await page.evaluate(([s, h]) => { Batalha.ativo = false; UI.fecharModal && UI.fecharModal(true); Estado.dados = JSON.parse(s);
      /* quem recusou o cadastro já está no capítulo 1 (o save do começo é o de antes dele) */
      const r = Estado.dados.relogio; r.hora = h; r.periodo = periodoDaHora(h);
      Estado.dados.capitulo = Math.max(1, Estado.dados.capitulo); Exploracao.tela(); }, [vazio, hora]);
    const antes = await temCadastro();
    if (!antes.noCentro) anota('CADASTRO', 'sem licença, o Centro não mostra o cadastro');
    if (!antes.noBalcao) anota('CADASTRO', 'sem licença, o balcão de credenciais não mostra o cadastro');
    await tentar(`começo/cadastro às ${hora}h`, () => Cidade.cadastro());
    if (await page.evaluate(n => ehNoite() !== (n >= 18 || n < 6) || !/a atendente da noite/.test(document.querySelector('#app').innerText) === ehNoite(), hora))
      anota('CADASTRO', `às ${hora}h o balcão não fala da hora certa`);
    await tentar(`começo/cadastro às ${hora}h/guardou`, () => Cidade.receberLicenca());
    await page.evaluate(() => Cidade.receberLicenca());
    await page.waitForTimeout(120);
    const depois = await temCadastro();
    const f = await page.evaluate(() => {
      const fl = Estado.dados.flags;
      return {lic:!!fl.tem_licenca, dex:!!fl.tem_pokedex, cartao:!!fl.tem_cartao,
        cobra:(Cidade.atender().find(a => a.tipo === 'dano') || {}).texto || ''};
    });
    if (!f.lic || !f.dex || !f.cartao) anota('CADASTRO', 'faltou: ' + JSON.stringify(f));
    if (depois.bolas - antes.bolas !== 5 || depois.potion - antes.potion !== 2)
      anota('CADASTRO', `o kit deu ${depois.bolas - antes.bolas} Poké Balls e ${depois.potion - antes.potion} Potions`);
    if (depois.noCentro || depois.noBalcao) anota('CADASTRO', 'com licença, ainda aparece o cadastro');
    if (f.cobra) anota('CADASTRO', 'com licença, o Centro ainda cobra: ' + f.cobra);
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
      /* cada foto, e nela cada aba, cada cor de cada parte e a volta pra Padrão */
      for (const r of RETRATOS_DA_FICHA[c.genero]){
        UI.crAcao('retrato', {v:r});
        for (const [parte] of PARTES_DA_FOTO){
          UI.crAcao('aba', {v:parte});
          for (const k of coresDaParte(parte)) UI.crAcao('cor', {parte, v:k.id});
          UI.crAcao('cor', {parte, v:''});
        }
      }
      /* os outros rostos do mesmo gênero, a um toque: abre, escolhe um de lá e fecha */
      UI.crAcao('maisRostos', {});
      UI.crAcao('retrato', {v:RETRATOS_DA_FICHA[c.genero][RETRATOS_A_VISTA]});
      UI.crAcao('maisRostos', {});
      for (const k of Object.keys(CORES_CARTAO)) UI.crAcao('cartao', {v:k});
      for (const q of PARENTESCOS) UI.crAcao('casaQuem', {v:q});
      for (const k of STATUS_DO_TREINADOR.map(s => s[0])) UI.crAcao('forte', {v:k});
      UI.crAcao('inicial', {v:'rand'}); UI.crAcao('ritmo', {v:'longo'});
      for (const k of ORDEM_DAS_DIFICULDADES) UI.crAcao('dificuldade', {v:k});
      UI.crAcao('dificuldade', {v:'normal'});
      for (const f of ['nome', 'cores', 'casaNome', 'tracos']) UI.crAcao('dado', {v:f});
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
    /* a customização: uma aba por parte, a Padrão primeiro; parte que a
       foto não tem diz por quê e não oferece cor; a grade de fotos fica
       como o desenho tem; cada parte, sozinha, muda só pixel da cor dela,
       e todas juntas dão o mesmo que cada uma separada; a descrição sai
       das cores, peça por peça */
    const pintura = await page.evaluate(async () => {
      const c = UI._cr, falhas = [];
      UI.crAcao('passo', {v:'3'});
      const doGenero = RETRATOS_DA_FICHA[c.genero];
      const incompleta = doGenero.find(a => PARTES_DA_FOTO.some(([p]) => !FOTOS_DO_JOGADOR[a][p]));
      const inteira = doGenero.find(a => PARTES_DA_FOTO.every(([p]) => FOTOS_DO_JOGADOR[a][p]));
      if (!inteira) return ['nenhuma foto do gênero tem as sete partes'];
      if (incompleta){
        const falta = PARTES_DA_FOTO.map(([p]) => p).find(p => !FOTOS_DO_JOGADOR[incompleta][p]);
        UI.crAcao('retrato', {v:incompleta}); UI.crAcao('aba', {v:falta});
        if (document.querySelector(`.cr-tinta[data-parte="${falta}"]`)) falhas.push(`a foto ${incompleta} oferece cor de ${falta}, que ela não mostra`);
        const nota = document.querySelector('.cr-painel .cr-parte-sem');
        if (!nota || nota.textContent !== SEM_PARTE_DO_RETRATO[incompleta][falta]) falhas.push(`a aba ${falta} da foto ${incompleta} não diz por que não tem cor`);
        if (!document.querySelector(`#cr-aba-${falta}.sem`)) falhas.push(`a aba ${falta} da foto ${incompleta} não aparece como parte que falta`);
      }
      UI.crAcao('retrato', {v:inteira});
      const titulo = document.querySelector('.cr-provador .cr-rot');
      if (!titulo || !/^Customização/.test(titulo.textContent.trim())) falhas.push('a customização não se chama "Customização"');
      const abas = [...document.querySelectorAll('.cr-provador .cr-aba')].map(b => b.dataset.v);
      if (abas.join() !== PARTES_DA_FOTO.map(([p]) => p).join()) falhas.push(`as abas da customização são ${abas.join(', ')}`);
      for (const [parte] of PARTES_DA_FOTO){
        UI.crAcao('aba', {v:parte});
        const pad = document.querySelector('.cr-painel .cr-tinta.padrao');
        if (!pad || pad.textContent.trim() !== 'Padrão' || pad.dataset.parte !== parte) falhas.push(`a aba ${parte} não começa pela cor Padrão`);
        if (document.querySelectorAll(`.cr-painel .cr-tinta[data-parte="${parte}"]`).length !== coresDaParte(parte).length + 1)
          falhas.push(`a aba ${parte} não mostra as ${coresDaParte(parte).length} cores e a Padrão`);
      }
      const alvo = {cabelo:'rosa', olhos:'verde', pele:'escura', camisa:'verde', calca:'vermelho', sapatos:'azul', detalhes:'amarelo'};
      for (const [parte, v] of Object.entries(alvo)) UI.crAcao('cor', {parte, v});
      /* a seção inteira redesenhada (escolher a mesma foto de novo): a
         grade tem que continuar como o desenho tem */
      UI.crAcao('retrato', {v:inteira});
      const img = document.querySelector('.cr-prov-sprite');
      const mini = document.querySelector(`.cr-retrato[data-v="${inteira}"] img`);
      if (!img || !/^data:image\/png/.test(img.src)) return falhas.concat('a foto grande não saiu nas cores escolhidas');
      if (!mini || /^data:/.test(mini.src)) falhas.push('a foto da grade mudou de cor junto com a grande');
      const abrir = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
      const ler = i => { const cv = document.createElement('canvas'); cv.width = cv.height = 80; const x = cv.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, 80, 80).data; };
      const antes = ler(await abrir('data:image/png;base64,' + FOTOS_DO_JOGADOR[inteira].png));
      const tudo = await abrir(img.src);
      if (!tudo || tudo.naturalWidth !== 80) return falhas.concat('a foto recolorida não abre no navegador');
      const junto = ler(tudo);
      const matiz = (r, g, bl) => { const mx = Math.max(r, g, bl), mn = Math.min(r, g, bl); if (mx - mn < 8) return null;
        const d = mx - mn; const h = mx === r ? ((g - bl) / d) % 6 : mx === g ? (bl - r) / d + 2 : (r - g) / d + 4; return (h * 60 + 360) % 360; };
      const separado = new Uint8ClampedArray(antes);
      for (const [parte, v] of Object.entries(alvo)){
        const so = ler(await abrir(FotoJogador.url(inteira, {[parte]: v})));
        const h0 = corDaFoto(parte, v).h;
        let mudou = 0, fora = 0;
        for (let i = 0; i < so.length; i += 4){
          if (so[i + 3] !== antes[i + 3]){ fora++; continue; }
          if (so[i] === antes[i] && so[i + 1] === antes[i + 1] && so[i + 2] === antes[i + 2]) continue;
          mudou++;
          separado[i] = so[i]; separado[i + 1] = so[i + 1]; separado[i + 2] = so[i + 2];
          const h = matiz(so[i], so[i + 1], so[i + 2]);
          if (h != null && Math.min(Math.abs(h - h0), 360 - Math.abs(h - h0)) > 22) fora++;
        }
        if (!mudou) falhas.push(`a foto ${inteira} não muda quando ${parte} vira ${v}`);
        if (fora) falhas.push(`a foto ${inteira}, com ${parte} ${v}, tem ${fora} pixels que saíram de outra cor`);
      }
      /* a mochila nas costas não tem aba: vem da cor da mochila da inscrição,
         que a foto grande já usa */
      if (FOTOS_DO_JOGADOR[inteira].mochila && c.mochila){
        const so = ler(await abrir(FotoJogador.url(inteira, {mochila:c.mochila})));
        for (let i = 0; i < so.length; i += 4)
          if (so[i] !== antes[i] || so[i + 1] !== antes[i + 1] || so[i + 2] !== antes[i + 2]){
            separado[i] = so[i]; separado[i + 1] = so[i + 1]; separado[i + 2] = so[i + 2];
          }
      }
      let diferente = 0;
      for (let i = 0; i < junto.length; i++) if (junto[i] !== separado[i]) diferente++;
      if (diferente) falhas.push(`a foto ${inteira} com tudo trocado não é a soma das partes trocadas uma por uma (${diferente} canais)`);
      /* a mochila que a foto carrega sai na cor da mochila da inscrição, e só ela muda */
      const comMochila = doGenero.find(a => FOTOS_DO_JOGADOR[a].mochila);
      if (!comMochila) falhas.push('nenhuma foto do gênero carrega mochila');
      else {
        const base = ler(await abrir('data:image/png;base64,' + FOTOS_DO_JOGADOR[comMochila].png));
        const verde = ler(await abrir(FotoJogador.url(comMochila, {mochila:'verde'})));
        const hm = FotoJogador.escalaDeHex(CORES_MOCHILA.verde).h;
        let mudou = 0, fora = 0;
        for (let i = 0; i < verde.length; i += 4){
          if (verde[i] === base[i] && verde[i + 1] === base[i + 1] && verde[i + 2] === base[i + 2]) continue;
          mudou++;
          const h = matiz(verde[i], verde[i + 1], verde[i + 2]);
          if (h == null || Math.min(Math.abs(h - hm), 360 - Math.abs(h - hm)) > 22) fora++;
        }
        if (!mudou) falhas.push(`a mochila da foto ${comMochila} não muda com a cor da mochila da inscrição`);
        if (fora) falhas.push(`a foto ${comMochila}, com a mochila verde, tem ${fora} pixels que saíram de outra cor`);
        UI.crAcao('retrato', {v:comMochila});
        if (c.mochila !== 'verde') UI.crAcao('mochila', {v:'verde'});
        const grande = document.querySelector('.cr-prov-sprite');
        if (!grande || grande.src !== FotoJogador.url(comMochila, Object.assign({}, c.cores, {mochila:'verde'})))
          falhas.push(`a foto grande da ${comMochila} não sai com a mochila na cor escolhida`);
        const diz = document.querySelector('.cr-provador .cr-nota b');
        if (!diz || !diz.textContent.endsWith('de mochila verde')) falhas.push(`quem te descreve não diz a mochila: "${diz && diz.textContent}"`);
        UI.crAcao('retrato', {v:inteira});
      }
      /* as setas andam pelas abas, como abas */
      UI.crAcao('aba', {v:'cabelo'});
      document.getElementById('cr-aba-cabelo').focus();
      for (const [tecla, esperado] of [['ArrowRight', 'olhos'], ['End', 'detalhes'], ['ArrowRight', 'cabelo'], ['ArrowLeft', 'detalhes'], ['Home', 'cabelo']]){
        document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {key:tecla, bubbles:true}));
        const foco = document.activeElement && document.activeElement.id;
        if (c.aba !== esperado || foco !== 'cr-aba-' + esperado)
          falhas.push(`a tecla ${tecla} levou pra aba ${c.aba} (foco em ${foco}), e devia ir pra ${esperado}`);
      }
      const pecas = PECAS_DO_RETRATO[inteira];
      const d = descricaoDaFoto(inteira, alvo);
      if (d.aparencia !== 'cabelo rosa e olhos verdes') falhas.push(`a aparência saiu "${d.aparencia}"`);
      for (const p of ['camisa', 'calca', 'sapatos', 'detalhes']){
        const esperado = pecaComCor(pecas[p][0], nomeDaCorDaFoto(p, alvo[p], pecas[p][1]));
        if (!d.vestimenta.includes(esperado)) falhas.push(`a roupa saiu "${d.vestimenta}", sem "${esperado}"`);
      }
      const nota = document.querySelector('.cr-provador .cr-nota b');
      if (!nota || !nota.textContent.includes('cabelo rosa') || !nota.textContent.includes('olhos verdes'))
        falhas.push('o "quem precisar te descrever" não diz o cabelo e os olhos escolhidos');
      return falhas;
    });
    for (const f of pintura){ onde = `inscrição/${g}/cores`; anota('inscrição', f); }
    await tentar(`inscrição/${g}/saiu de casa`, () => { UI.crAcao('passo', {v:'5'}); UI.crAcao('proximo', {}); });
    const pintado = await page.evaluate(() => {
      const j = Estado.j, falhas = [];
      const alvo = {cabelo:'rosa', olhos:'verde', pele:'escura', camisa:'verde', calca:'vermelho', sapatos:'azul', detalhes:'amarelo'};
      if (!j.retratoCores || Object.entries(alvo).some(([p, v]) => j.retratoCores[p] !== v))
        falhas.push(`as cores da foto não chegaram no Estado: ${JSON.stringify(j.retratoCores)}`);
      if (j.aparencia !== 'cabelo rosa e olhos verdes') falhas.push(`a aparência saiu "${j.aparencia}"`);
      if (!/vermelh/.test(j.vestimenta || '')) falhas.push(`a roupa saiu "${j.vestimenta}"`);
      if (!Estado.descricaoFisica().includes('olhos verdes')) falhas.push(`quem te descreve diz "${Estado.descricaoFisica()}"`);
      if (!/^data:image\/png/.test(retratoDoJogador() || '')) falhas.push('o rosto do jogador não sai nas cores escolhidas');
      const topo = document.querySelector('.topo-rosto img');
      if (topo && !/^data:image\/png/.test(topo.src)) falhas.push('o rosto do alto da tela não está nas cores escolhidas');
      return falhas;
    });
    for (const f of pintado){ onde = `inscrição/${g}/saiu de casa`; anota('inscrição', f); }
    /* save de antes das sete partes, aberto no navegador: a cor da roupa vai
       pra peça que ela pintava, a descrição que a foto escreveu é refeita, e
       a escrita à mão fica */
    const conversao = await page.evaluate(() => {
      const falhas = [], atual = JSON.stringify(Estado.dados);
      const velho = JSON.parse(atual), j = velho.jogador;
      j.retrato = PASTA_DOS_RETRATOS + 'viajante';
      j.retratoCores = {cabelo:'ruivo', pele:'escura', roupa:'verde'};
      j.aparencia = 'cabelo ruivo'; j.vestimenta = 'calça verde'; delete j.fotoPartes;
      const aMao = JSON.parse(JSON.stringify(velho));
      aMao.jogador.aparencia = 'alto, de cicatriz na mão'; aMao.jogador.vestimenta = 'casaco velho';
      Estado.abrir(JSON.stringify(velho));
      const n = Estado.j;
      if (JSON.stringify(n.retratoCores) !== JSON.stringify({cabelo:'ruivo', pele:'escura', calca:'verde'}))
        falhas.push(`a cor da roupa de antes foi pra ${JSON.stringify(n.retratoCores)}`);
      if (n.aparencia !== descricaoDaFoto('viajante', n.retratoCores).aparencia || !n.vestimenta.includes('calça jeans verde'))
        falhas.push(`a descrição de antes virou "${n.aparencia}" / "${n.vestimenta}"`);
      if (!n.fotoPartes) falhas.push('o save convertido não ficou marcado');
      if (!/^data:image\/png/.test(retratoDoJogador() || '')) falhas.push('a foto do save convertido não sai nas cores dele');
      Estado.abrir(JSON.stringify(aMao));
      if (Estado.j.aparencia !== 'alto, de cicatriz na mão' || Estado.j.vestimenta !== 'casaco velho')
        falhas.push(`a descrição escrita à mão virou "${Estado.j.aparencia}" / "${Estado.j.vestimenta}"`);
      Estado.abrir(atual);
      return falhas;
    });
    for (const f of conversao){ onde = `inscrição/${g}/save de antes`; anota('inscrição', f); }
    /* a bolsa que você carrega: a da inscrição até comprar outra, e daí a
       comprada (no balcão, que repinta o alto da tela) ou a escolhida na
       mochila — na descrição, na linha da Ficha e na mochila da foto (a do
       alto da tela e a do cartão da abertura, que lê o save cru) */
    const bolsa = await page.evaluate(() => {
      const falhas = [], d = Estado.dados, j = Estado.j;
      const guardado = JSON.stringify({itens:d.itens, bolsa:j.bolsa, dinheiro:j.dinheiro});
      const arq = j.retrato.slice(PASTA_DOS_RETRATOS.length);
      const comMochila = !!(FOTOS_DO_JOGADOR[arq] && FOTOS_DO_JOGADOR[arq].mochila);
      const fotoNa = cor => FotoJogador.url(arq, Object.assign({}, j.retratoCores, {mochila:cor}));
      const topo = () => document.querySelector('.topo-rosto img');
      const grana = () => (document.querySelector('.topo-chip.grana') || {}).textContent || '';
      const inscricao = bolsaPorExtenso('Mochila', j.corMochila);
      if (inscricao && !Estado.descricaoFisica().endsWith('de ' + inscricao))
        falhas.push(`sem bolsa comprada, a descrição não termina na mochila da inscrição: "${Estado.descricaoFisica()}"`);
      /* comprada no balcão: passa a ser a que você carrega */
      j.dinheiro += 5000; UI.atualizarTopo();
      Cidade._compra = {nome:'Bolsa de festa', preco:100, max:1, qtd:1};
      Cidade.confirmarCompra('Bolsa de festa', 100);
      UI.fecharModal(true);
      if (!grana().includes(fmtDin(j.dinheiro))) falhas.push(`depois da compra, o alto da tela diz "${grana()}" e o dinheiro é ${j.dinheiro}`);
      if (!Estado.descricaoFisica().endsWith('de bolsa dourada de festa'))
        falhas.push(`com a Bolsa de festa comprada, quem te descreve diz "${Estado.descricaoFisica()}"`);
      if (comMochila){
        if (retratoDoJogador() !== fotoNa('dourada')) falhas.push(`a mochila da foto ${arq} não segue a bolsa comprada`);
        if (topo() && topo().src !== fotoNa('dourada')) falhas.push('a foto do alto da tela não muda com a bolsa comprada');
      }
      /* escolhida na mochila */
      d.itens['Mochila escolar'] = 1;
      UI.modalItens(); UI.usarBolsa('Mochila escolar'); UI.fecharModal(true);
      if (!Estado.descricaoFisica().endsWith('de mochila escolar azul'))
        falhas.push(`com a Mochila escolar em uso, quem te descreve diz "${Estado.descricaoFisica()}"`);
      if (comMochila){
        if (topo() && topo().src !== fotoNa('azul')) falhas.push('a foto do alto da tela não muda quando se troca de bolsa');
        const cru = JSON.parse(JSON.stringify(d));
        if (FotoJogador.doSave(cru.jogador, cru) !== fotoNa('azul')) falhas.push('o cartão da abertura não mostra a bolsa em uso na foto');
      }
      UI.modalFicha('perfil');
      const dt = [...document.querySelectorAll('.modal dt')].find(x => x.textContent.trim() === 'Bolsa');
      const diz = dt && dt.nextElementSibling ? dt.nextElementSibling.textContent.trim() : null;
      if (diz !== 'Mochila escolar azul') falhas.push(`a Ficha diz a bolsa "${diz}"`);
      UI.fecharModal(true);
      const g = JSON.parse(guardado);
      d.itens = g.itens; j.dinheiro = g.dinheiro;
      if (g.bolsa === undefined) delete j.bolsa; else j.bolsa = g.bolsa;
      UI.atualizarTopo();
      return falhas;
    });
    for (const f of bolsa){ onde = `inscrição/${g}/bolsa em uso`; anota('inscrição', f); }
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
  /* o Mewtwo que ainda não te aceitou: a moral não aparece no Sumário
     nem no PC; aceitou, aparece (js/story/mewtwo.js) */
  {
    const r = await page.evaluate(() => {
      const u = Estado.dados.pc.find(p => p.dex === 150);
      if (!u) return null;
      const ler = () => ((document.querySelector('#modal') || {}).innerText || '');
      const olha = () => { UI.sumario(u.uid, 'vinculo'); const sm = ler(); UI.fecharModal(true); UI.modalPC(u.uid); const pc = ler(); UI.fecharModal(true); return {sm, pc}; };
      const antes = olha();
      u.aceitou = true;
      const depois = olha();
      delete u.aceitou;
      /* o rótulo vem em caixa alta na tela (o innerText lê o text-transform) */
      return {antesSm:/\?\/100/.test(antes.sm) && !/\b37\/100/.test(antes.sm), antesPc:/moral\s*\?/i.test(antes.pc),
              depoisSm:/\b37\/100/.test(depois.sm), depoisPc:/moral\s*37/i.test(depois.pc)};
    });
    onde = 'mewtwo/moral';
    if (!r) anota('mewtwo', 'a Unidade 01 não entrou no save de teste');
    else {
      if (!r.antesSm) anota('mewtwo', 'o Sumário mostra a moral do Mewtwo que ainda não aceitou');
      if (!r.antesPc) anota('mewtwo', 'o PC mostra a moral do Mewtwo que ainda não aceitou');
      if (!r.depoisSm || !r.depoisPc) anota('mewtwo', 'o Mewtwo aceitou e a moral continua escondida');
    }
  }
  /* a velocidade da luta nos Ajustes: as três, e volta pra 1× */
  for (const v of [2, 3, 1]) await tentar('ajustes/velocidade ' + v, x => { UI.modalAjustes(); Velocidade.definir(x); }, v);
  /* o fio dos capítulos grandes no Diário: cada cena da lista existe e
     escreveu no diário, e o Diário abre com nenhuma ponta e com todas */
  {
    const r = await page.evaluate(() => {
      const falhas = [], d = Estado.dados, antes = {cap:d.capitulo, cenas:d.cenasAplicadas};
      for (const [n, F] of Object.entries(FIO_DOS_CAPITULOS)){
        const cap = Historia.capitulo(+n);
        if (!cap){ falhas.push('o fio fala do capítulo ' + n + ', que não existe'); continue; }
        for (const p of F.pontas) for (const id of p.cenas){
          if (!cap.cenas[id]) falhas.push(`fio do ${n}: a ponta "${p.nome}" cita a cena ${id}, que não existe`);
          else if (!(cap.cenas[id].ef || {}).registrar) falhas.push(`fio do ${n}: a cena ${id} não escreve no diário`);
        }
        d.capitulo = +n; d.cenasAplicadas = {};
        UI.modalDiario();
        if (!document.querySelector('.diario-fio')) falhas.push('o Diário do capítulo ' + n + ' não mostra o fio');
        UI.fecharModal(true);
        F.pontas.forEach(p => p.cenas.forEach(id => { d.cenasAplicadas[n + ':' + id] = 1; }));
        UI.modalDiario();
        const linhas = document.querySelectorAll('.diario-fio .da-linha').length;
        if (linhas !== F.pontas.length) falhas.push(`o Diário do capítulo ${n} mostra ${linhas} pontas de ${F.pontas.length}`);
        UI.fecharModal(true);
      }
      d.capitulo = antes.cap; d.cenasAplicadas = antes.cenas;
      return falhas;
    });
    r.forEach(f => anota('fio', f));
  }
  /* depois do fim (depois.js): cada final mostra o bloco e o botão,
     continua pela estrada sem capítulo pela frente, e a casa fecha pra
     quem saiu procurado ou jurado */
  {
    const r = await page.evaluate(() => {
      const falhas = [], guardado = JSON.stringify(Estado.dados);
      const QUEBRA = /undefined|NaN|\[object|\{[a-zà-úA-Z ]*\|[^}]*\}|\{IDADE|\{idade/;
      for (const c of CAPITULOS) for (const [id, ce] of Object.entries(c.cenas || {})){
        if (!ce.final) continue;
        Estado.dados = JSON.parse(guardado);
        const d = Estado.dados;
        delete d.depoisDoFim; d.capitulo = c.num; d.modo = 'cena';
        Historia.capAtual = c;
        try {
          Historia.ir(id, false); Jogo.mostrarFinal();
          const t = document.getElementById('app').innerText;
          if (!/Depois do fim/.test(t) || !/Continuar pela estrada/.test(t)) falhas.push(`o final ${ce.final.id} não mostra o depois do fim`);
          const m = t.match(QUEBRA); if (m) falhas.push(`o final ${ce.final.id}: texto quebrado "${m[0]}"`);
          Jogo.continuarPelaEstrada();
          if (!d.depoisDoFim || d.modo !== 'mundo') falhas.push(`o final ${ce.final.id} não continua pela estrada`);
          if (Historia.proximoCapitulo(false) !== null) falhas.push(`depois do final ${ce.final.id} ainda tem capítulo`);
          Mundo.viajar(Mundo.idDaCidade(d.jogador.cidade)); Exploracao.tela();
          const porta = [...document.querySelectorAll('#app .porta')].find(p => /Sua casa/.test(p.textContent));
          if (!porta) falhas.push(`depois do final ${ce.final.id}, a cidade natal não tem a porta de casa`);
          else if (!!d.depoisDoFim.semCasa !== porta.disabled) falhas.push(`depois do final ${ce.final.id}, a casa está ${porta.disabled ? 'fechada' : 'aberta'}`);
          const m2 = document.getElementById('app').innerText.match(QUEBRA);
          if (m2) falhas.push(`depois do final ${ce.final.id}: texto quebrado "${m2[0]}" no mapa`);
        } catch (e){ falhas.push(`o final ${ce.final.id}: ${e.message}`); }
      }
      Estado.dados = JSON.parse(guardado);
      return falhas;
    });
    r.forEach(f => anota('depois do fim', f));
  }
  /* o lendário preso cobra (patrulha.js, lendarios-errantes.js): a
     Patrulha para na estrada em cada degrau, devolve, recusa, se
     entrega, briga, vence e perde; a casa fecha com a detenção e abre
     com a custódia; depois do fim a custódia é a do fim e o lendário
     preso pesa por dias; quem te caça vem, o clima entra na luta, e a
     folha de regras e a Ficha dizem tudo isso */
  {
    const antes = await page.evaluate(() => JSON.stringify(Estado.dados));
    const comZapdos = await page.evaluate(s => {
      Estado.dados = JSON.parse(s);
      const d = Estado.dados;
      d.time[5] = criarPokemon(145, 50);
      const L = Estado.lend(145); L.estado = 'capturado'; L.disposicao = 'prisioneiro'; L.visto = true;
      Object.values(d.lendarios).forEach(x => { x.caçandoVoce = false; });
      Estado.marcar('captura_vista_145');
      Object.assign(d.liga, {avisos:1, detencao:false, ordemDevolucao:false});
      delete d.depoisDoFim;
      d.mundo.clima = 'normal'; d.modo = 'mundo'; d.local = 'rota6'; d.jogador.dinheiro = 9000; d.relogio.hora = 12;
      return JSON.stringify(d);
    }, snap);
    const comDetencao = await page.evaluate(s => {
      const d = JSON.parse(s); Object.assign(d.liga, {avisos:3, ordemDevolucao:true, detencao:true}); return JSON.stringify(d);
    }, comZapdos);
    const falhas = [];
    const volta = x => page.evaluate(s => {
      Batalha.ativo = false; Jogo.patrulhaAtual = null; Jogo.fimPendente = null;
      UI.fecharModal && UI.fecharModal(true); Estado.dados = JSON.parse(s);
    }, x);
    const passo = async (rotulo, fn, arg, teste) => {
      await tentar('patrulha/' + rotulo, fn, arg);
      const r = teste ? await page.evaluate(teste, arg) : null;
      if (r) falhas.push(`${rotulo}: ${r}`);
    };
    const parar = t => {
      const d = Estado.dados;
      d.liga.ordemDevolucao = t !== 'conversa'; d.liga.detencao = t === 'detencao'; d.liga.paradaDia = -1;
      const ch = Dados.chance; Dados.chance = () => true;
      try { if (!Patrulha.talvez('rota6')) throw new Error('a Patrulha não parou'); } finally { Dados.chance = ch; }
    };
    const portaDeCasa = () => {
      Mundo.viajar(Mundo.idDaCidade(Estado.j.cidade)); Exploracao.tela();
      const p = [...document.querySelectorAll('#app .porta')].find(x => /Sua casa/.test(x.textContent));
      return p ? (p.disabled ? 'fechada' : 'aberta') : 'sem porta';
    };
    for (const t of ['conversa', 'devolucao', 'detencao']){
      await volta(comZapdos);
      await passo('parada/' + t, parar, t, x => {
        const app = document.getElementById('app').innerText;
        const quer = x === 'detencao' ? [/Se entregar/, /Lutar pra passar/, /Devolver o Zapdos e se entregar/] : [/Devolver o Zapdos/, /Não devolver/];
        const falta = quer.filter(re => !re.test(app));
        return falta.length ? `a tela não tem ${falta.join(', ')}` : null;
      });
    }
    await volta(comZapdos);
    await passo('devolver', () => { Patrulha.tela('conversa'); Patrulha.devolver('conversa'); }, null, () =>
      Estado.dados.time.some(p => p.dex === 145) || Estado.dados.lendarios[145].estado !== 'solto' ? 'o Zapdos não foi devolvido'
      : Patrulha.tipo() ? 'a Patrulha continua cobrando depois de devolver' : null);
    await volta(comZapdos);
    await passo('recusar a conversa', () => { Patrulha.tela('conversa'); Patrulha.recusar(); }, null, () =>
      !Estado.dados.liga.ordemDevolucao || Estado.dados.liga.detencao ? 'recusar a conversa não deu (só) a ordem de devolução' : null);
    await passo('recusar a ordem', () => { Patrulha.tela('devolucao'); Patrulha.recusar(); }, null, () =>
      !Estado.dados.liga.detencao ? 'recusar a ordem de devolução não deu detenção' : null);
    await passo('casa com detenção', portaDeCasa, null, () => {
      const p = [...document.querySelectorAll('#app .porta')].find(x => /Sua casa/.test(x.textContent));
      return !p ? 'a cidade natal não tem a porta de casa' : !p.disabled ? 'a casa abre com ordem de detenção' : null; });
    await passo('atalho de casa', () => Exploracao.fazer('casa'), null, () =>
      /vigia a sua rua/.test(document.getElementById('app').innerText) ? null : 'o atalho abriu a casa com ordem de detenção');
    for (const [como, dias, multa] of [['devolveu', 1, 1000], ['entregou', 3, 2000]]){
      await volta(comDetencao);
      await passo('custódia ' + como, c => { window.__antes = {dia:Estado.dados.relogio.dia, din:Estado.dados.jogador.dinheiro}; Patrulha.custodia(c); }, como, c => {
        const d = Estado.dados, a = window.__antes, quer = c === 'devolveu' ? [1, 1000] : [3, 2000];
        if (d.liga.detencao || d.liga.ordemDevolucao) return 'a custódia não fechou a ordem';
        if (d.relogio.dia - a.dia !== quer[0]) return `a custódia durou ${d.relogio.dia - a.dia} dias, não ${quer[0]}`;
        if (a.din - d.jogador.dinheiro !== quer[1]) return `a multa foi ${a.din - d.jogador.dinheiro}, não ${quer[1]}`;
        if (d.time.some(p => p.dex === 145) || d.lendarios[145].estado !== 'solto') return 'o Zapdos continua no cinto';
        return null; });
      await passo('casa depois da custódia ' + como, portaDeCasa, null, () => {
        const p = [...document.querySelectorAll('#app .porta')].find(x => /Sua casa/.test(x.textContent));
        return p && p.disabled ? 'a casa continua fechada depois da custódia' : null; });
    }
    for (const res of ['vitoria', 'derrota']){
      await volta(comDetencao);
      await passo('briga', () => Patrulha.lutar(), null, () =>
        !Batalha.ativo ? 'a briga não começou' : Batalha.treinador !== 'Oficial da Patrulha' ? 'outro treinador: ' + Batalha.treinador
        : Batalha.totalInimigo !== 3 ? `o oficial veio com ${Batalha.totalInimigo}` : !Jogo.patrulhaAtual ? 'a briga começou sem o contexto' : null);
      await passo('briga/' + res, r => { window.__dia = Estado.dados.relogio.dia; Batalha.ativo = false; Jogo.finalizarBatalha({resultado:r}); }, res, r => {
        const d = Estado.dados;
        if (Jogo.patrulhaAtual) return 'o contexto da briga ficou depois dela';
        if (r === 'vitoria') return d.liga.detencao ? null : 'vencer a Patrulha fechou a ordem';
        return d.liga.detencao ? 'perder pra Patrulha não levou à custódia' : d.relogio.dia - window.__dia !== 3 ? 'a custódia de quem perde não durou três dias' : null; });
    }
    /* depois do fim: a custódia de quem saiu procurado */
    await volta(comDetencao);
    await passo('custódia do fim', () => {
      const d = Estado.dados;
      d.depoisDoFim = {final:'posse', titulo:'Posse', s:'procurado', fecha:{}, desde:d.relogio.dia, tickDia:d.relogio.dia};
      window.__dia = d.relogio.dia; Patrulha.custodia('entregou');
    }, null, () => {
      const d = Estado.dados;
      if (d.relogio.dia - window.__dia !== DIAS_DE_CUSTODIA_DO_FIM) return `a custódia do fim durou ${d.relogio.dia - window.__dia} dias`;
      if (Depois.situacaoAgora() !== 'cumpriu') return 'a situação não virou "cumpriu a custódia"';
      if (Depois.casaFechada()) return 'a casa continua fechada depois da custódia do fim';
      return null; });
    await tentar('patrulha/ficha depois da custódia', () => UI.modalFicha('mundo'));
    /* o lendário preso pesa por dias depois do fim */
    await volta(comZapdos);
    await passo('tick depois do fim', () => {
      const d = Estado.dados;
      d.depoisDoFim = {final:'posse', titulo:'Posse', s:'livre', fecha:{}, desde:d.relogio.dia - 20, tickDia:d.relogio.dia - 16};
      Exploracao.tela();
    }, null, () => (Estado.dados.lendarios[145].turnosPreso || 0) === 1 ? null : 'depois do fim o lendário preso não pesou com os dias');
    /* quem te caça vem, em qualquer rota, no nível do seu time */
    await volta(comZapdos);
    await passo('caçador', () => {
      const d = Estado.dados;
      [144, 146].forEach(x => { const L = Estado.lend(x); L.caçandoVoce = true; L.disposicao = 'hostil'; });
      const ch = Dados.chance; Dados.chance = () => true;
      try { Exploracao.encontro(sortearSelvagem('campo', 20), ['Um Pokémon sai do mato.']); } finally { Dados.chance = ch; }
    }, null, () => !Batalha.ativo || ![144, 146].includes(Batalha.inimigo.dex) ? 'quem te caça não veio'
      : Batalha.tipo !== 'lendario' ? 'quem te caça veio sem ser luta de lendário'
      : Batalha.inimigo.nivel > LENDARIOS_ERRANTES[Batalha.inimigo.dex].nivel ? 'quem te caça veio acima do nível dele' : null);
    /* o clima quebrado entra na luta */
    await volta(comZapdos);
    await passo('clima na luta', () => {
      Estado.dados.mundo.clima = 'instavel';
      const ch = Dados.chance; Dados.chance = () => true;
      try { Exploracao.encontro(sortearSelvagem('campo', 20), ['Um Pokémon sai do mato.']); } finally { Dados.chance = ch; }
    }, null, () => !Batalha.clima ? 'a luta não começou com o clima' : !document.querySelector('.arena > .clima-camada') ? 'a arena não desenhou o clima' : null);
    await volta(comZapdos);
    await passo('regras', () => UI.modalRegras(), null, () => {
      const t = (document.querySelector('#modal') || {}).innerText || '';
      const falta = ['A Patrulha na estrada', 'Detenção', 'Quem te caça', 'Clima de Kanto', 'A custódia do fim'].filter(x => !t.includes(x));
      return falta.length ? 'a folha de regras não tem ' + falta.join(', ') : null; });
    await passo('ficha/clima', () => { Estado.dados.mundo.clima = 'instavel'; UI.modalFicha('mundo'); }, null, () =>
      /Instável/.test((document.querySelector('#modal') || {}).innerText || '') ? null : 'a Ficha não diz o clima com acento');
    falhas.forEach(f => anota('patrulha', f));
    await page.evaluate(s => { Batalha.ativo = false; Jogo.patrulhaAtual = null; UI.fecharModal && UI.fecharModal(true); Estado.dados = JSON.parse(s); }, antes);
  }
  /* a Pokédex Nacional pelo Professor (dex-nacional.js): antes do
     Planalto não tem afazer; com a história lá e 59 catalogadas ele fica
     fechado com o que o Professor pede; com 60 abre, a tela fala e o
     registro vem; e quem vira Campeão depois não recebe de novo */
  {
    const antes = await page.evaluate(() => JSON.stringify(Estado.dados));
    const falhas = [];
    const base = await page.evaluate(s => {
      Estado.dados = JSON.parse(s);
      const d = Estado.dados;
      ['dex_nacional', 'johto_liberado', 'campeao_de_kanto', 'oito_insignias'].forEach(f => { delete d.flags[f]; });
      delete d.depoisDoFim;
      d.capitulo = 12; d.modo = 'mundo'; d.local = 'pallet'; d.flags.tem_pokedex = true;
      const pd = Estado.pdex(); pd.catalogados = {};
      for (let i = 1; i <= 59; i++) pd.catalogados[i] = true;
      pd.catalogados[151] = true; pd.catalogados[243] = true;   /* Mew e o Raikou não contam */
      return JSON.stringify(d);
    }, snap);
    const botao = () => { const b = [...document.querySelectorAll('#app .escolha')].find(x => /Mostrar a Pokédex ao Professor/.test(x.textContent));
      return b ? (b.disabled ? 'fechado' : 'aberto') : 'sem'; };
    const passo = async (rotulo, fn, teste) => {
      await tentar('nacional/' + rotulo, fn);
      const r = await page.evaluate(teste);
      if (r) falhas.push(`${rotulo}: ${r}`);
    };
    await page.evaluate(s => { UI.fecharModal && UI.fecharModal(true); Estado.dados = JSON.parse(s); }, base);
    await passo('antes do Planalto', () => Exploracao.tela(), new Function('return (' + botao.toString() + ')() === "sem" ? null : "o Professor oferece a Nacional antes do Planalto"'));
    await passo('pouca Pokédex', () => { Estado.dados.capitulo = 22; Exploracao.tela(); },
      new Function('return (' + botao.toString() + ')() === "fechado" ? (/sessenta espécies de Kanto/.test(document.getElementById("app").innerText) ? null : "a porta fechada não diz o que o Professor pede") : "com 59 de Kanto o Professor não fica fechado"'));
    await passo('sessenta', () => { Estado.pdex().catalogados[60] = true; Exploracao.tela(); },
      new Function('return (' + botao.toString() + ')() === "aberto" ? null : "com 60 de Kanto o Professor não abre"'));
    await passo('o laboratório', () => Exploracao.fazer('dexnac'), () => {
      const d = Estado.dados;
      if (!d.flags.dex_nacional || !d.flags.johto_liberado) return 'o Professor não liberou a Nacional';
      return /A Pokédex Nacional/.test(document.getElementById('app').innerText) ? null : 'a tela do laboratório não abriu';
    });
    await passo('depois', () => Exploracao.tela(), new Function('return (' + botao.toString() + ')() === "sem" ? null : "o Professor continua oferecendo a Nacional"'));
    await passo('Campeão depois', () => { window.__av = coroarCampeao('teste'); }, () =>
      (window.__av || []).some(a => /reinicia sozinha/.test(a.texto)) ? 'a coroação liberou a Nacional de novo' : null);
    falhas.forEach(f => anota('pokédex nacional', f));
    await page.evaluate(s => { UI.fecharModal && UI.fecharModal(true); Estado.dados = JSON.parse(s); }, antes);
  }
  /* a dificuldade nos Ajustes: as três, a folha de regras com cada uma, e volta pro Normal */
  for (const k of ['facil', 'dificil', 'normal']){
    await tentar('ajustes/dificuldade ' + k, x => { UI.modalAjustes(); Dificuldade.definir(x); }, k);
    await tentar('regras/dificuldade ' + k, () => UI.modalRegras());
  }
  {
    const r = await page.evaluate(() => {
      const falhas = [];
      UI.modalAjustes();
      for (const k of ORDEM_DAS_DIFICULDADES){
        const b = document.querySelector(`#modal [data-dif="${k}"]`);
        if (!b){ falhas.push('os Ajustes não têm o botão ' + k); continue; }
        b.click();
        if (Estado.dados.config.dificuldade !== k) falhas.push('o botão ' + k + ' dos Ajustes não troca a dificuldade');
        const sel = [...document.querySelectorAll('#modal [data-dif].sel')].map(x => x.dataset.dif);
        if (sel.length !== 1 || sel[0] !== k) falhas.push('os Ajustes marcam ' + sel.join(',') + ' com ' + k + ' escolhida');
      }
      Dificuldade.definir('normal');
      UI.fecharModal(true);
      return falhas;
    });
    r.forEach(f => anota('dificuldade', f));
  }
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
  /* na página publicada quem entrega o arquivo é a publicação (o
     downloads, por window.claude.use), que pergunta antes: aceitar salva
     o save inteiro com o nome dele, recusar diz que não salvou */
  const naPagina = await page.evaluate(async () => {
    const falhas = [], tinha = 'claude' in window, antes = window.claude;
    for (const [caso, save, espera] of [
      ['aceitando', async r => { window.__entregue = r; return {status:'saved'}; }, /^Salvo: pokerpg-.*\.json\.$/],
      ['recusando', async () => { throw {code:'declined', message:'não'}; }, /não foi salvo/]]){
      window.__entregue = null;
      window.claude = {use: async n => n === 'downloads' ? Object.freeze({save}) : null};
      ArquivoSave._entrega = null;
      UI.modalSalvar();
      await new Promise(ok => setTimeout(ok, 80));
      const diz = ((document.getElementById('save-status') || {}).textContent || '').trim();
      if (!espera.test(diz)) falhas.push(`na página publicada, ${caso}, o Salvar diz "${diz}"`);
      const r = window.__entregue;
      if (caso === 'aceitando'){
        let ok = false;
        try { ok = !!r && /\.json$/.test(r.filename) && JSON.parse(r.data).jogo === 'PokéRPG'; } catch(e){}
        if (!ok) falhas.push('na página publicada, o arquivo entregue não é o save com o nome dele');
      }
      UI.fecharModal(true);
    }
    if (tinha) window.claude = antes; else delete window.claude;
    ArquivoSave._entrega = null;
    return falhas;
  });
  for (const f of naPagina){ onde = 'salvar/página publicada'; anota('salvar', f); }
  const arquivo = await page.evaluate(() => ArquivoSave.texto());
  /* a abertura com a jornada salva (o cartão diz de quem é) e sem ela */
  await tentar('abertura', () => { UI.fecharModal(true); Estado.salvar('auto'); UI.telaInicial(); });
  /* a foto da jornada sai nas cores dela, com a mochila na cor da bolsa
     que aquele save carrega, e cor ou bolsa que não existe (save de
     arquivo de outra pessoa) não passa */
  if (!(await page.evaluate(() => {
    const d = Estado.dados, j = Estado.j, antes = j.retratoCores, bolsa = j.bolsa, falsa = '"><img src=x onerror=alert(1)>';
    j.retrato = 'jogador/viajante'; j.retratoCores = {cabelo:'rosa', roupa:falsa, pele:'escura'};
    j.bolsa = falsa; d.itens[falsa] = 1;
    Estado.salvar('auto'); UI.telaInicial();
    const img = document.querySelector('.tt-j-rosto img');
    const carrega = mochilaAtual(d).corNome;
    const ok = !!carrega && img && /^data:image\/png/.test(img.src)
      && img.src === FotoJogador.url('viajante', {cabelo:'rosa', pele:'escura', mochila:carrega});
    delete d.itens[falsa]; if (bolsa === undefined) delete j.bolsa; else j.bolsa = bolsa;
    j.retratoCores = antes; Estado.salvar('auto'); UI.telaInicial();
    return ok;
  }))){ onde = 'abertura'; anota('abertura', 'o cartão da jornada não mostra a foto nas cores dela e na bolsa em uso, ou deixou passar cor ou bolsa que não existe'); }
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

  /* ---------- quem tem o seu número procura você (recados.js) ----------
     um contato de cada tipo (casa, líder, gente da história, estrada,
     veterano, troca, rival) com cada tópico de ligação, cada resposta e
     o não atender; o recado em cada degrau de afinidade, o "Encontrar"
     na cidade, o encontro e o ficar conversando; o telefone tocando pela
     rolagem de cada ação do mapa; e o presente de quem mora na cidade em
     cada degrau de Carisma, comum e crítico */
  const comAgenda = async () => page.evaluate(s => {
    if (typeof Batalha !== 'undefined') Batalha.ativo = false;
    UI.fecharModal && UI.fecharModal(true);
    Estado.dados = JSON.parse(s);
    const ids = ['brock', 'zelador'];
    for (const re of [/^rt_/, /^vt_/, /^tr_/, /^rival_/]){ const c = todosContatos().find(x => re.test(x.id)); if (c) ids.push(c.id); }
    ids.forEach(id => { Estado.nav().contatos[id] = {id, desdeCap:Estado.dados.capitulo, usos:{}}; });
    Estado.lembrarNPC('Zelador da Torre', {opiniao:5});
    return ['casa'].concat(ids);
  }, snap);
  for (const id of await comAgenda()){
    const tops = await page.evaluate(x => Recados.topicosDe(contatoPorId(x)).map(t => t.id), id);
    for (const t of tops) for (const i of [0, 1, 2, -1]){
      await comAgenda();
      await tentar(`recado/${id}/${t}`, ([x, y]) => UI.telaChamada(Recados.montarLigacao(contatoPorId(x), y)), [id, t]);
      await tentar(`recado/${id}/${t}/${i < 0 ? 'não atendeu' : i}`, i0 => {
        const ch = Recados.atual;
        if (!ch) throw new Error('a ligação à toa sumiu antes da resposta');
        if (i0 < 0) Jogo.recusarChamada(ch.id); else Jogo.responderChamada(ch.id, i0);
      }, i);
    }
    for (const af of [1, 3, 5, 8]){
      await comAgenda();
      await tentar(`recado/${id}/recado ${af}`, ([x, a]) => {
        const c = contatoPorId(x), r = Recados.rotuloNPC(c);
        if (r) Estado.lembrarNPC(r, {opiniao:a});
        else Recados.doContato(x).laco = a - (x === 'casa' ? AFINIDADE_DE_CASA : AFINIDADE_DA_ESTRADA);
        if (Recados.afinidade(c) !== a) throw new Error(`afinidade ${Recados.afinidade(c)} em vez de ${a}`);
        if (!Recados.separarPresente(c)) throw new Error('não separou presente');
        UI.telaRecado(c);
      }, [id, af]);
      await tentar(`recado/${id}/encontro ${af}`, x => {
        UI.fecharModal(true);
        const p = Recados.reg().presentes[x];
        Estado.dados.local = p.onde;
        Exploracao.tela();
        if (!afazeresDoLocal().some(a => a.id === 'recado_' + x)) throw new Error('sem "Encontrar" em ' + p.onde);
        const antes = Estado.contaItem(p.item);
        Exploracao.fazer('recado_' + x);
        if (Estado.contaItem(p.item) !== antes + p.qtd) throw new Error('o presente não chegou na mochila');
        if (afazeresDoLocal().some(a => a.id === 'recado_' + x)) throw new Error('o "Encontrar" ficou depois do encontro');
      }, id);
      await tentar(`recado/${id}/ficar ${af}`, x => Recados.ficar(x), id);
    }
  }
  /* o telefone pela rolagem de verdade: cada ação do mapa rola o dado do
     PokéNav uma vez (aqui forçado no 6), e o aparelho abre por cima da
     tela, ou espera a luta (ou a janela) que a ação abriu e toca depois.
     Sem chamada escrita esperando, liga quem tem o seu número; com uma,
     toca a escrita. E toda chamada deixa não atender. */
  const ACOES_QUE_TOCAM = [['andar', 'celadon'], ['conversar', 'celadon'], ['esperar', 'celadon'], ['viajar', 'celadon'],
    ['vasculhar', 'rota7'], ['procurar', 'rota7'], ['pescar', 'rota7'], ['acampar', 'rota7'], ['treinar', 'rota7']];
  const aparelho = () => page.evaluate(() => {
    const r = document.querySelector('#modal .nav-respostas');
    return {nav:!!r, aToa:!!(r && r.querySelector('[onclick*="rec_"]')), recado:!!(r && /Mensage/.test((document.querySelector('#modal .nav-marca') || {}).textContent || '')),
      adiada:!!Jogo.chamadaAdiada, luta:emLuta()};
  });
  let tocouEscrita = 0;
  for (const [acao, local] of ACOES_QUE_TOCAM) for (const escrita of [false, true]){
    await comAgenda();
    const rot = `telefone/${acao}${escrita ? '/chamada escrita' : ''}`;
    onde = rot;
    const r0 = await page.evaluate(([a, l, esc]) => {
      const d = Estado.dados;
      d.local = l; Jogo.chamadaAdiada = null;
      if (!esc) CHAMADAS.forEach(c => { Chamadas.atendidas()[c.id] = {cap:d.capitulo, escolha:0}; });
      else if (!Chamadas.disponiveis().length) return {semEscrita:true};
      if (a === 'acampar') Relogio.ate(20);
      if (a === 'treinar'){ d.treinoDia = null; d.treinoReal = 0; d.time.forEach(p => { p.nivel = Math.min(p.nivel, 12); }); }
      Exploracao.tela();
      const orig = Dados.chanceDados; let rolou = 0;
      Dados.chanceDados = function(n, m){ if (m === 'PokéNav'){ rolou++; return true; } return orig.call(this, n, m); };
      try {
        if (a === 'viajar') Exploracao.viajar(LOCAIS[l].conexoes.find(x => !travaDaPassagem(l, x)));
        else Exploracao.fazer(a);
      } finally { Dados.chanceDados = orig; }
      return {rolou};
    }, [acao, local, escrita]);
    if (r0.semEscrita) continue;
    if (r0.rolou !== 1) anota('telefone', `${acao}: rolou o PokéNav ${r0.rolou} vez(es) numa ação só`);
    await page.waitForTimeout(250);
    let r = await aparelho();
    /* a ação começou uma luta ou abriu janela: o toque esperou. Acaba a
       luta, fecha a janela e volta pro mapa, que é quando ele toca */
    if (!r.nav && r.adiada){
      await page.evaluate(() => { Batalha.ativo = false; UI.fecharModal(true); Exploracao.tela(); });
      await page.waitForTimeout(300);
      r = await aparelho();
    }
    if (!r.nav){ anota('telefone', `${acao}: o PokéNav não tocou`); continue; }
    if (!escrita && !r.aToa && !r.recado) anota('telefone', `${acao}: sem chamada escrita esperando, tocou uma escrita`);
    if (escrita && (r.aToa || r.recado)) anota('telefone', `${acao}: com chamada escrita esperando, tocou a ligação à toa`);
    if (escrita) tocouEscrita++;
    await olhar(rot);
    await tentar(rot + (r.recado ? '/guardar o aparelho' : '/não atender'), rec => {
      const b = document.querySelector(rec ? '#modal .nav-respostas .nav-fim' : '#modal .nav-respostas .recusar');
      if (!b) throw new Error(rec ? 'sem "Guardar o aparelho" no recado' : 'sem "Não atender"');
      b.click();
    }, r.recado);
  }
  if (!tocouEscrita) anota('telefone', 'nenhuma chamada escrita esperando no save cheio: a escrita não foi tocada pela rolagem');
  /* com uma janela aberta, o toque espera: abrir por cima fechava ela */
  await comAgenda();
  await tentar('telefone/com a mochila aberta', () => {
    Jogo.chamadaAdiada = null;
    Exploracao.tela(); UI.modalItens();
    Jogo.tocarOuGuardar({recados:'ligacao', de:'casa'});
    if (!Jogo.chamadaAdiada) throw new Error('o toque não esperou a mochila');
    if (document.querySelector('#modal .nav-respostas')) throw new Error('o PokéNav abriu por cima da mochila');
  });
  await tentar('telefone/depois da mochila', () => { UI.fecharModal(true); Exploracao.tela(); });
  await page.waitForTimeout(300);
  if (!(await aparelho()).nav) anota('telefone', 'o toque que esperou a mochila não tocou depois');
  /* o recado que chega no meio da luta espera ela acabar */
  await comAgenda();
  await tentar('telefone/recado na luta', () => {
    Jogo.chamadaAdiada = null; Exploracao.tela();
    Batalha.ativo = true;
    const c = contatoPorId('brock');
    if (!Recados.separarPresente(c)) throw new Error('não separou presente');
    UI.telaRecado(c);
    if (!Jogo.chamadaAdiada || Jogo.chamadaAdiada.recados !== 'recado') throw new Error('o recado da luta não esperou');
    Batalha.ativo = false; Exploracao.tela();
  });
  await page.waitForTimeout(300);
  if (!(await aparelho()).recado) anota('telefone', 'o recado que esperou a luta não chegou depois');
  await olhar('telefone/recado depois da luta');

  /* ---------- o pedido de favor (pedidos.js) ----------
     cada jeito com cada tipo de contato: a ligação, aceitar, cada passo
     no lugar dele (o afazer tem que estar lá), a ficha com a bolinha e
     o contar; a procura nos quatro graus; e com um contato só, não
     aceitar, não atender, largar, o prazo que vence (a mensagem chega)
     e o que trava com a encomenda na mochila */
  const comPedidos = async () => { const ids = await comAgenda(); await page.evaluate(lista => {
    const d = Estado.dados;
    d.estrada = d.estrada || {}; d.veteranos = d.veteranos || {}; d.trocasFeitas = d.trocasFeitas || {};
    for (const id of lista){
      const c = contatoPorId(id);
      if (c.estrada) d.estrada[c.estrada] = Object.assign({vencidos:[]}, d.estrada[c.estrada] || {}, {numero:true});
      if (c.rivalExtra) d.rivaisExtra = (d.rivaisExtra || []).concat(c.rivalExtra);
      if (c.veterano) d.veteranos[c.veterano] = Object.assign(d.veteranos[c.veterano] || {}, {vitorias:1});
      if (/^tr_/.test(id)) d.trocasFeitas[id.slice(3)] = {cidade:'viridian', deu:16, recebeu:19};
    }
    /* o save cheio viu as 251: sem espécie nunca vista, o avistar não
       tem o que pedir (e não pede). Um terço volta a não ser visto */
    const pd = Estado.pdex();
    for (let i = 3; i <= 151; i += 3){ delete pd.vistos[i]; delete pd.catalogados[i]; }
    Jogo.chamadaAdiada = null; d.local = 'celadon';
  }, ids); return ids; };
  const quemPede = await comPedidos();
  const semRequer = await page.evaluate(lista => lista.filter(id => { const c = contatoPorId(id); try { return c.requer && !c.requer(Estado.dados); } catch(e){ return true; } }), quemPede);
  if (semRequer.length) anota('pedido', 'contato do teste sem requer: ' + semRequer.join(', '));
  for (const id of quemPede) for (const tipo of ['perdido', 'entrega', 'avistar']){
    await comPedidos();
    const rot = `pedido/${id}/${tipo}`;
    await tentar(rot, ([x, t]) => { const ch = Pedidos.montar(contatoPorId(x), t); if (!ch) throw new Error('sem plano'); UI.telaChamada(ch); }, [id, tipo]);
    await tentar(rot + '/aceitar', () => {
      if (!Recados.atual || !Recados.atual.pedido) throw new Error('a ligação do pedido sumiu');
      Jogo.responderChamada(Recados.atual.id, 0);
      if (!Pedidos.atual()) throw new Error('aceitar não abriu o pedido');
    });
    for (let k = 0; k < 3; k++){
      const passo = await page.evaluate(() => { UI.fecharModal(true); return Pedidos.passoNoMapa(Pedidos.atual()); });
      if (!passo) break;
      await tentar(`${rot}/${passo.id}`, ps => {
        Estado.dados.local = ps.lugar; Exploracao.tela();
        if (!afazeresDoLocal().some(a => a.id === 'pedido_' + ps.id)) throw new Error(`sem o afazer ${ps.id} em ${ps.lugar}`);
        Pedidos.fazer(ps.id, 'sucesso');
      }, passo);
    }
    await tentar(rot + '/ficha', t => {
      UI.fecharModal(true);
      const p = Pedidos.atual();
      if (t === 'avistar') Estado.pdex().vistos[p.dex] = true;
      if (!Pedidos.pronto(p)) throw new Error('os passos não deixaram o pedido pronto');
      UI.modalNav(p.quem);
      if (!document.querySelector('#modal .nav-ponto')) throw new Error('sem a bolinha na agenda');
      if (![...document.querySelectorAll('#modal .nav-acao')].some(b => /^Contar/.test(b.innerText.trim()) && !b.disabled)) throw new Error('sem a linha de contar ligada');
    }, tipo);
    await tentar(rot + '/contar', x => {
      const c = contatoPorId(x), af = Recados.afinidade(c), itens = Object.values(Estado.dados.itens).reduce((a, b) => a + b, 0);
      UI.navLigarPedido(x, 'contar');
      if (Pedidos.atual()) throw new Error('o pedido continuou aberto depois de contar');
      if (Recados.afinidade(c) <= af && af < AFINIDADE_TETO_PEDIDO) throw new Error('a afinidade não subiu');
      if (Object.values(Estado.dados.itens).reduce((a, b) => a + b, 0) <= itens) throw new Error('o presente não chegou');
      if (Pedidos.podePedir(c)) throw new Error('a mesma pessoa pode pedir de novo no mesmo dia');
    }, id);
  }
  /* a procura em cada grau, e uma de verdade (o dado e a estrada) */
  for (const g of ['critico', 'parcial', 'falha', null]){
    await comPedidos();
    await tentar('pedido/procurar/' + (g || 'dado'), gr => {
      Recados.atual = null;
      const ch = Pedidos.montar(contatoPorId('zelador'), 'perdido');
      Jogo.responderChamada(ch.id, 0); UI.fecharModal(true);
      const p = Pedidos.atual();
      Estado.dados.local = p.onde; Exploracao.tela();
      if (gr) Pedidos.fazer('procurar', gr); else Exploracao.fazer('pedido_procurar');
      if (gr === 'parcial' && !p.rastro) throw new Error('o rastro não ficou');
      if (gr === 'falha' && (p.achou || p.rastro)) throw new Error('a falha achou alguma coisa');
      if (gr === 'critico' && !p.achou) throw new Error('o crítico não achou');
    }, g);
    await page.evaluate(() => { if (typeof Batalha !== 'undefined') Batalha.ativo = false; });
  }
  /* não aceitar, não atender e largar: com o zelador */
  await comPedidos();
  await tentar('pedido/não aceitar', () => {
    const c = contatoPorId('zelador'), ch = Pedidos.montar(c, 'entrega'), af = Recados.afinidade(c);
    UI.telaChamada(ch); Jogo.responderChamada(ch.id, 1);
    if (Pedidos.atual()) throw new Error('não aceitar abriu o pedido');
    if (Recados.afinidade(c) !== af) throw new Error('não aceitar mexeu na afinidade');
    if (Pedidos.podePedir(c)) throw new Error('quem ouviu não pode pedir de novo no mesmo dia');
  });
  await comPedidos();
  await tentar('pedido/não atender', () => {
    const c = contatoPorId('zelador'), ch = Pedidos.montar(c, 'perdido'), af = Recados.afinidade(c);
    UI.telaChamada(ch); Jogo.recusarChamada(ch.id);
    if (Pedidos.atual()) throw new Error('não atender abriu o pedido');
    if (Recados.afinidade(c) !== af - 1) throw new Error('não atender não custou 1');
  });
  await comPedidos();
  await tentar('pedido/largar', () => {
    const c = contatoPorId('zelador'), ch = Pedidos.montar(c, 'avistar');
    Jogo.responderChamada(ch.id, 0); UI.fecharModal(true);
    const af = Recados.afinidade(c);
    UI.modalNav('zelador');
    if (![...document.querySelectorAll('#modal .nav-acao')].some(b => /não vai dar/.test(b.innerText))) throw new Error('sem a linha de largar');
    UI.navLigarPedido('zelador', 'desistir');
    if (Pedidos.atual()) throw new Error('largar não fechou');
    if (Recados.afinidade(c) !== af - 1) throw new Error('largar não custou 1');
  });
  /* o prazo: vence, fecha com −1 e a pessoa manda mensagem */
  await comPedidos();
  await tentar('pedido/prazo', () => {
    const c = contatoPorId('zelador'), ch = Pedidos.montar(c, 'perdido');
    Jogo.responderChamada(ch.id, 0); UI.fecharModal(true);
    window.__afPrazo = Recados.afinidade(c);
    Estado.dados.relogio.dia += PRAZO_DO_PEDIDO.perdido + 1;
    Exploracao.tela();
    if (Pedidos.atual()) throw new Error('o prazo não fechou o pedido');
  });
  await page.waitForTimeout(300);
  if (!(await aparelho()).recado) anota('pedido', 'o prazo vencido não mandou mensagem');
  await olhar('pedido/prazo/mensagem');
  await tentar('pedido/prazo/afinidade', () => { if (Recados.afinidade(contatoPorId('zelador')) !== window.__afPrazo - 1) throw new Error('o prazo não custou 1'); });
  /* com a encomenda na mochila: não vence e não se larga */
  await comPedidos();
  await tentar('pedido/com a encomenda', () => {
    const c = contatoPorId('zelador'), ch = Pedidos.montar(c, 'entrega');
    Jogo.responderChamada(ch.id, 0); UI.fecharModal(true);
    const p = Pedidos.atual();
    Estado.dados.local = p.pega; Exploracao.tela(); Pedidos.fazer('pegar');
    if (Estado.contaItem(p.item) < 1) throw new Error('a encomenda não entrou na mochila');
    Estado.dados.relogio.dia += PRAZO_DO_PEDIDO.entrega + 5;
    UI.fecharModal(true); Exploracao.tela();
    if (!Pedidos.atual()) throw new Error('o pedido venceu com a encomenda na mochila');
    UI.modalNav('zelador');
    if ([...document.querySelectorAll('#modal .nav-acao')].some(b => /não vai dar/.test(b.innerText))) throw new Error('deu pra largar com a encomenda na mochila');
    UI.modalItens(null, 'chave');
  });
  /* o pedido pelo toque: o aparelho abre a ligação que pede */
  await comPedidos();
  await tentar('pedido/pelo toque', () => {
    Recados.atual = null;
    Exploracao.tela();
    Recados.mostrar('brock', 'pedido');
    if (!Recados.atual || !Recados.atual.pedido) throw new Error('o toque do pedido não montou o pedido');
  });

  /* ---------- a chamada perdida, a madrugada, o silencioso e a notícia (recados.js) ----------
     não atender deixa a chamada perdida (a marca na agenda, a linha na
     ficha e a linha no mapa); retornar no mesmo dia devolve o −1 e abre
     já em linha, sem "Não atender"; virou o dia, ela some e o −1 fica.
     A escrita recusada e o pedido também voltam. De madrugada só liga a
     casa com notícia; no silencioso nada toca (a ligação fica perdida sem
     custo, o recado fica por ler, a escrita não se gasta). E cada notícia
     com cada tipo de contato. */
  await comAgenda();
  await tentar('perdida/não atender', () => {
    const c = contatoPorId('zelador'); window.__af = Recados.afinidade(c);
    const ch = Recados.montarLigacao(c); UI.telaChamada(ch); Jogo.recusarChamada(ch.id);
    if (!Recados.temPerdida('zelador')) throw new Error('não atender não deixou chamada perdida');
    if (Recados.afinidade(c) !== window.__af - 1) throw new Error('não atender não custou 1');
    UI.fecharModal(true); Exploracao.tela();
    if (!document.querySelector('#nav-aviso.nav-aviso-mapa')) throw new Error('sem a linha do PokéNav no mapa');
    UI.modalNav('zelador');
    if (!document.querySelector('#modal .nav-marca-linha.perdida')) throw new Error('sem a marca da chamada perdida na agenda');
    if (![...document.querySelectorAll('#modal .nav-acao')].some(b => /Retornar a ligação/.test(b.innerText) && !b.disabled)) throw new Error('sem "Retornar a ligação" na ficha');
  });
  await tentar('perdida/mapa', () => { UI.fecharModal(true); Exploracao.tela(); });
  await tentar('perdida/retornar', () => {
    UI.modalNav('zelador');
    UI.navRecado('zelador', 'retornar');
    const c = contatoPorId('zelador');
    if (Recados.afinidade(c) !== window.__af) throw new Error('retornar não devolveu o −1');
    if (Recados.temPerdida('zelador')) throw new Error('a chamada perdida ficou depois de retornar');
    if (!document.querySelector('#modal .nav-respostas .nav-acao')) throw new Error('o retorno não abriu a ligação');
    if (document.querySelector('#modal .nav-respostas .recusar')) throw new Error('o retorno tem "Não atender"');
    if (document.querySelector('#modal .modal.nav.chamando')) throw new Error('o retorno ficou tocando');
  });
  await tentar('perdida/retornar/responder', () => {
    Jogo.responderChamada(Recados.atual.id, 0);
    if (!document.querySelector('#modal .nav-resposta')) throw new Error('a resposta do retorno não entrou na conversa');
  });
  await comAgenda();
  await tentar('perdida/outro dia', () => {
    const c = contatoPorId('zelador'), af = Recados.afinidade(c);
    const ch = Recados.montarLigacao(c); UI.telaChamada(ch); Jogo.recusarChamada(ch.id);
    UI.fecharModal(true);
    Estado.dados.relogio.dia += 1; Exploracao.tela();
    if (Recados.temPerdida('zelador') || Recados.reg().perdidas.zelador) throw new Error('a chamada perdida passou da meia-noite');
    if (document.querySelector('#nav-aviso.nav-aviso-mapa')) throw new Error('a linha do mapa ficou depois da meia-noite');
    if (Recados.afinidade(c) !== af - 1) throw new Error('o −1 não ficou');
  });
  /* a chamada escrita recusada: a recusa se desfaz no retorno */
  await comAgenda();
  await tentar('perdida/chamada escrita', () => {
    const d = Estado.dados;
    const ch = CHAMADAS.find(c => { if (Chamadas.jaAtendeu(c.id) || !contatoPorId(c.de)) return false; try { return !c.cond || c.cond(d); } catch(e){ return false; } });
    if (!ch) throw new Error('nenhuma chamada escrita esperando no save cheio');
    if (!Estado.nav().contatos[ch.de]) Estado.nav().contatos[ch.de] = {id:ch.de, desdeCap:d.capitulo, usos:{}};
    window.__esc = ch.id;
    UI.telaChamada(ch); Jogo.recusarChamada(ch.id);
    if (!Recados.temPerdida(ch.de)) throw new Error('a escrita recusada não deixou chamada perdida');
    UI.fecharModal(true);
    if (!Recados.retornar(ch.de)) throw new Error('o retorno da escrita não abriu');
    if (Chamadas.jaAtendeu(ch.id)) throw new Error('o retorno não desfez a recusa');
    if (document.querySelector('#modal .nav-respostas .recusar')) throw new Error('o retorno da escrita tem "Não atender"');
  });
  await tentar('perdida/chamada escrita/responder', () => {
    const b = document.querySelector('#modal .nav-respostas .nav-acao');
    if (!b) throw new Error('o retorno da escrita não tem resposta');
    b.click();
    if (!Chamadas.jaAtendeu(window.__esc)) throw new Error('responder no retorno não gastou a escrita');
  });
  /* o pedido: o retorno pede a mesma coisa */
  await comPedidos();
  await tentar('perdida/pedido', () => {
    const c = contatoPorId('zelador'), ch = Pedidos.montar(c, 'entrega');
    UI.telaChamada(ch); Jogo.recusarChamada(ch.id); UI.fecharModal(true);
    if (!Recados.retornar('zelador')) throw new Error('o retorno do pedido não abriu');
    const novo = Recados.atual;
    if (!novo || !novo.pedido) throw new Error('o retorno do pedido não pediu de novo');
    if (novo.pedido.pega !== ch.pedido.pega || novo.pedido.leva !== ch.pedido.leva || novo.pedido.item !== ch.pedido.item) throw new Error('o retorno pediu outra coisa');
    Jogo.responderChamada(novo.id, 0);
    if (!Pedidos.atual()) throw new Error('aceitar no retorno não abriu o pedido');
  });

  /* de madrugada ninguém liga à toa; a casa liga com a morte, e só uma vez no dia */
  await comAgenda();
  await tentar('madrugada/ninguém liga à toa', () => {
    const d = Estado.dados;
    Relogio.ate(2);
    if (d.relogio.periodo !== 'madrugada') throw new Error('o relógio não chegou na madrugada: ' + d.relogio.periodo);
    CHAMADAS.forEach(c => { Chamadas.atendidas()[c.id] = {cap:d.capitulo, escolha:0}; });
    /* o save cheio mata o Pidgey depois de gravar a casa: com a agenda em dia, ninguém tem notícia */
    Estado.contatosNaAgenda().forEach(c => Recados.emDia(c));
    if (Recados.candidatos(true).length) throw new Error('de madrugada tem quem ligue à toa: ' + Recados.candidatos(true).map(c => c.id).join(', '));
    Jogo.chamadaAdiada = null;
    const orig = Dados.chanceDados;
    Dados.chanceDados = function(n, m){ return m === 'PokéNav' ? true : orig.call(this, n, m); };
    try { if (Jogo.talvezToque()) throw new Error('de madrugada o PokéNav tocou'); } finally { Dados.chanceDados = orig; }
  });
  await tentar('madrugada/a casa com a morte', () => {
    const d = Estado.dados, casa = contatoPorId('casa');
    Recados.sabeDe(casa);
    Recados.doContato('casa').ultimoDia = d.relogio.dia - 1;
    Estado.matar(d.time[d.time.length - 1], 'teste da madrugada');
    const cs = Recados.candidatos(true);
    if (cs.length !== 1 || cs[0].id !== 'casa') throw new Error('de madrugada, quem pode ligar: ' + cs.map(c => c.id).join(', '));
    const t = Recados.escolherToque(true);
    if (!t || t.de !== 'casa' || t.recados !== 'ligacao') throw new Error('o toque da madrugada não foi a ligação da casa');
    Recados.mostrar('casa', 'ligacao', t);
    if (!Recados.atual || Recados.atual.topico !== 'noticia_morte') throw new Error('a casa não falou da morte: ' + (Recados.atual && Recados.atual.topico));
  });
  await tentar('madrugada/a casa com a morte/atender', () => {
    Jogo.responderChamada(Recados.atual.id, 0);
    if (Recados.eventoPara(contatoPorId('casa'))) throw new Error('atender não deixou a casa em dia');
    if (Recados.candidatos(true).length) throw new Error('a casa ligou de novo de madrugada');
  });

  /* o silencioso: o sino da agenda, o toque que não toca, a mensagem por ler */
  await comAgenda();
  await tentar('silencioso/ligar', () => {
    UI.modalNav();
    const b = document.querySelector('#modal .nav-silencio');
    if (!b) throw new Error('sem o sino na agenda');
    b.click();
    if (!Recados.silencioso()) throw new Error('o sino não ligou o silencioso');
    if (!document.querySelector('#modal .nav-silencio.on')) throw new Error('o sino não acendeu');
  });
  await tentar('silencioso/a ligação', () => {
    UI.fecharModal(true); Exploracao.tela();
    const c = contatoPorId('zelador'); window.__af = Recados.afinidade(c);
    Jogo.tocarOuGuardar({recados:'ligacao', de:'zelador'});
    if (document.querySelector('#modal .nav-respostas')) throw new Error('o silencioso tocou');
    const pe = Recados.reg().perdidas.zelador;
    if (!pe) throw new Error('a ligação do silencioso não ficou como chamada perdida');
    if (pe.custou) throw new Error('a chamada perdida do silencioso custou');
    if (Recados.afinidade(c) !== window.__af) throw new Error('o silencioso mexeu na afinidade');
    if (!document.querySelector('#nav-aviso.nav-aviso-mapa')) throw new Error('a linha do mapa não apareceu no lugar');
  });
  await tentar('silencioso/o recado', () => {
    const c = contatoPorId('brock');
    if (!Recados.separarPresente(c)) throw new Error('não separou presente');
    Jogo.tocarOuGuardar({recados:'recado', de:'brock'});
    if (document.querySelector('#modal .nav-respostas')) throw new Error('o recado abriu no silencioso');
    if (!Recados.temMensagem('brock')) throw new Error('o recado não ficou por ler');
    if (!/mensage/i.test((document.querySelector('#nav-aviso') || {}).textContent || '')) throw new Error('a linha do mapa não fala da mensagem');
    UI.modalNav('brock');
    if (!document.querySelector('#modal .nav-marca-linha.msg')) throw new Error('sem a marca da mensagem na agenda');
    if (![...document.querySelectorAll('#modal .nav-acao')].some(b => /Ler a mensagem/.test(b.innerText) && !b.disabled)) throw new Error('sem "Ler a mensagem" na ficha');
  });
  await tentar('silencioso/ler', () => {
    UI.navRecado('brock', 'ler');
    if (Recados.temMensagem('brock')) throw new Error('a mensagem continuou por ler');
    if (!/Mensage/.test((document.querySelector('#modal .nav-marca') || {}).textContent || '')) throw new Error('ler não abriu a mensagem');
  });
  await tentar('silencioso/a escrita não se gasta', () => {
    UI.fecharModal(true);
    const d = Estado.dados;
    const ch = CHAMADAS.find(c => { if (Chamadas.jaAtendeu(c.id) || !contatoPorId(c.de)) return false; try { return !c.cond || c.cond(d); } catch(e){ return false; } });
    if (!ch) throw new Error('nenhuma chamada escrita esperando no save cheio');
    if (!Estado.nav().contatos[ch.de]) Estado.nav().contatos[ch.de] = {id:ch.de, desdeCap:d.capitulo, usos:{}};
    Jogo.tocarOuGuardar(ch);
    if (document.querySelector('#modal .nav-respostas')) throw new Error('a escrita tocou no silencioso');
    if (Chamadas.jaAtendeu(ch.id)) throw new Error('a escrita se gastou no silencioso');
    if (!Recados.temPerdida(ch.de)) throw new Error('a escrita do silencioso não ficou como chamada perdida');
  });
  await tentar('silencioso/pela rolagem', () => {
    const d = Estado.dados; Relogio.ate(9);
    CHAMADAS.forEach(c => { Chamadas.atendidas()[c.id] = {cap:d.capitulo, escolha:0}; });
    Recados.reg().perdidas = {}; Recados.reg().naoLidas = {};
    Object.values(Recados.reg().contatos).forEach(x => { x.ultimoDia = null; });
    Jogo.chamadaAdiada = null; Exploracao.tela();
    const orig = Dados.chanceDados;
    Dados.chanceDados = function(n, m){ return m === 'PokéNav' ? true : orig.call(this, n, m); };
    try { if (!Jogo.talvezToque()) throw new Error('a rolagem não tocou'); } finally { Dados.chanceDados = orig; }
  });
  await page.waitForTimeout(300);
  await tentar('silencioso/pela rolagem/depois', () => {
    if (document.querySelector('#modal .nav-respostas')) throw new Error('o silencioso tocou pela rolagem');
    if (!Recados.notificacao()) throw new Error('o toque do silencioso não deixou nada');
    if (!document.querySelector('#nav-aviso.nav-aviso-mapa')) throw new Error('a linha do mapa não apareceu');
  });
  await tentar('silencioso/desligar', () => {
    UI.modalNav();
    document.querySelector('#modal .nav-silencio').click();
    if (Recados.silencioso()) throw new Error('o sino não desligou o silencioso');
  });

  /* cada notícia com cada tipo de contato: quem fala dela, e a notícia não volta depois de atender */
  for (const id of await comAgenda()) for (const ev of ['morte', 'custodia', 'insignia']){
    await comAgenda();
    await tentar(`notícia/${id}/${ev}`, ([x, e]) => {
      const d = Estado.dados, c = contatoPorId(x);
      const r = Recados.rotuloNPC(c);
      if (r) Estado.lembrarNPC(r, {opiniao:AFINIDADE_DA_NOTICIA + 1});
      else Recados.doContato(x).laco = AFINIDADE_DA_NOTICIA + 1 - (x === 'casa' ? AFINIDADE_DE_CASA : AFINIDADE_DA_ESTRADA);
      const lista = Recados.insigniasDe(d), ult = lista[lista.length - 1];
      if (e === 'insignia') d.insignias = d.insignias.filter(i => i !== ult);
      Recados.emDia(c);
      if (e === 'morte') Estado.matar(d.time[d.time.length - 1], 'teste da notícia');
      if (e === 'custodia'){ d.liga = d.liga || {}; d.liga.custodias = (d.liga.custodias || 0) + 1; }
      if (e === 'insignia') d.insignias.push(ult);
      const g = c.ginasio ? GINASIOS.find(z => z.id === c.ginasio) : null;
      const espera = e === 'morte' ? true : e === 'custodia' ? (x === 'casa' || c.tipo !== 'treinador') : !(g && g.insignia === ult);
      const ch = Recados.montarLigacao(c);
      if (!ch) throw new Error('sem ligação');
      if (espera && ch.topico !== 'noticia_' + e) throw new Error(`não falou da notícia (${ch.topico})`);
      if (!espera && /^noticia_/.test(ch.topico)) throw new Error(`falou de notícia que não é dela (${ch.topico})`);
      UI.telaChamada(ch);
      window.__espera = espera;
    }, [id, ev]);
    await tentar(`notícia/${id}/${ev}/atender`, x => {
      Jogo.responderChamada(Recados.atual.id, 0);
      const ch = Recados.montarLigacao(contatoPorId(x));
      if (ch && /^noticia_/.test(ch.topico)) throw new Error('a notícia voltou depois de atender');
      Recados.atual = null;
    }, id);
  }
  /* o líder não liga pra dar a notícia da insígnia que ele mesmo deu */
  await comAgenda();
  await tentar('notícia/brock/a insígnia dele', () => {
    const d = Estado.dados, c = contatoPorId('brock'), g = GINASIOS.find(z => z.id === c.ginasio);
    if (!g) throw new Error('o Brock sem ginásio na agenda');
    d.insignias = d.insignias.filter(i => i !== g.insignia);
    Recados.emDia(c);
    d.insignias.push(g.insignia);
    if (Recados.eventoPara(c)) throw new Error('o líder tem notícia da insígnia dele');
  });
  for (const car of [1, 2, 3, 4, 5]) for (const g of ['sucesso', 'critico']){
    await restaurar();
    await tentar(`presente da cidade/${car}/${g}`, ([c, gr]) => {
      Estado.j.status.carisma = c; Estado.dados.local = 'celadon';
      const conversa = CONVERSAS.celadon.map(x => Array.isArray(x) ? x : x.texto)
        .find(l => l.some(y => y && typeof y === 'object' && y.quem && y.diz));
      const av = Recados.presenteDaConversa('celadon', conversa, gr);
      if (!av.length) throw new Error('sem presente');
      Exploracao.tela(conversa.map(x => ({tipo:'info', texto:x})).concat(av));
    }, [car, g]);
  }
  await restaurar();
  await tentar('presente da cidade/conversar', () => { Estado.dados.local = 'celadon'; Exploracao.conversar(); });

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

  /* ---------- o chaveamento do torneio e da Conferência, e o menu de Pokébola ----------
     o torneio é a chave de dezesseis: cada rodada (a chave andada pelas
     funções do jogo), a tela de quem caiu nela e a do título, com a
     chave inteira jogada até o fim */
  for (const qual of ['torneio', 'conferencia']) for (const rodada of [0, 1, 2, 3]){
    await restaurar();
    await tentar(`${qual}/${rodada}`, ([q, r]) => {
      const d = Estado.dados;
      d.local = 'planalto'; d.npcs['Ezra'] = {nome:'Ezra', opiniao:2, memorias:[]}; d.flags.campeao_de_kanto = true;
      const t = chaveAteARodada(novaChave(q), r);
      if (q === 'torneio'){ Jogo.torneioAtual = t; UI.telaTorneio(); } else { Jogo.conferenciaAtual = t; UI.telaConferencia(); }
      const app = document.getElementById('app');
      const oitavas = app.querySelectorAll('.c16-col[data-rodada="0"] .c16-quem').length;
      if (oitavas !== VAGAS_TORNEIO) throw new Error(`a chave tem ${oitavas} nomes nas oitavas, e são ${VAGAS_TORNEIO}`);
      const eu = app.querySelectorAll('.c16-quem.voce').length;
      if (eu !== r + 1) throw new Error(`na rodada ${r + 1} a sua vaga aparece ${eu} vezes na chave, e eram ${r + 1}`);
      if (app.querySelectorAll('.c16-jogo.agora').length !== 1) throw new Error('a chave não acende o seu confronto de agora');
    }, [qual, rodada]);
    await restaurar();
    await tentar(`${qual}/eliminado na rodada ${rodada}`, ([q, r]) => {
      const d = Estado.dados;
      d.local = 'planalto'; d.flags.campeao_de_kanto = true;
      const t = chaveAteARodada(novaChave(q), r);
      if (q === 'torneio'){ Jogo.torneioAtual = t; Jogo.resultadoTorneio({resultado:'derrota'}); }
      else { Jogo.conferenciaAtual = t; Jogo.veteranoAtual = {id:t.adv.id, tipo:'conferencia', conferencia:true}; Conferencia.resultado({resultado:'derrota'}); }
      const app = document.getElementById('app');
      if (!app.querySelector('.chave16 .c16-titulo.tem')) throw new Error('quem caiu não vê a chave jogada até o título');
      if (!/o título fica com|o título do (dia|sábado) (é|fica com)/i.test(app.innerText)) throw new Error('quem caiu não fica sabendo quem levou o título');
      if (/undefined|contra\s*\./.test(app.innerText)) throw new Error('o texto de quem caiu ficou sem o nome de alguém');
      if (Jogo.torneioAtual || Jogo.conferenciaAtual) throw new Error('a chave continua aberta depois da derrota');
    }, [qual, rodada]);
  }
  await page.evaluate(() => { Jogo.torneioAtual = null; Jogo.conferenciaAtual = null; });

  /* o sorteio: dezesseis vagas, ninguém repetido, você numa só, e a
     final do outro lado sai das outras lutas, não de quem está marcado
     (o Ezra caía sempre na final) */
  await restaurar();
  const sorteio = await page.evaluate(() => {
    const d = Estado.dados, falhas = [];
    d.local = 'planalto'; d.npcs['Ezra'] = {nome:'Ezra', opiniao:2, memorias:[]};
    if (!d.rival) iniciarRival();
    const finalistas = new Set(), vagasDoEzra = new Set();
    for (let i = 0; i < 80; i++){
      const t = sortearChaveamento();
      if (t.inscritos.length !== VAGAS_TORNEIO) falhas.push(`o chaveamento saiu com ${t.inscritos.length} vagas`);
      if (t.inscritos.filter(x => x.voce).length !== 1) falhas.push('você não está numa vaga só');
      const ids = t.inscritos.filter(x => !x.voce).map(x => x.id);
      if (new Set(ids).size !== ids.length) falhas.push('alguém se inscreveu duas vezes no mesmo chaveamento: ' + ids.join(', '));
      const ez = t.inscritos.findIndex(x => x.id === 'ezra');
      if (ez >= 0) vagasDoEzra.add(ez);
      for (let k = 0; k < PREMIO_TORNEIO.length - 1; k++) fecharRodada(t, k, true);
      t.rodada = PREMIO_TORNEIO.length - 1;
      finalistas.add(t.inscritos[vagaDoAdversario(t)].id);
    }
    if (finalistas.size < 4) falhas.push(`em 80 chaveamentos a final teve só ${finalistas.size} adversários diferentes: ${[...finalistas].join(', ')}`);
    if (vagasDoEzra.size && vagasDoEzra.size < 4) falhas.push('o Ezra cai sempre nas mesmas vagas: ' + [...vagasDoEzra].join(', '));
    /* a Conferência: a Greer sempre na chave, e nunca marcada pra final */
    d.flags.campeao_de_kanto = true;
    const finaisConf = new Set();
    let greerNaFinal = 0;
    for (let i = 0; i < 80; i++){
      const c = novaChave('conferencia');
      if (c.inscritos.length !== VAGAS_TORNEIO) falhas.push(`a Conferência saiu com ${c.inscritos.length} vagas`);
      const ids = c.inscritos.filter(x => !x.voce).map(x => x.id);
      if (new Set(ids).size !== ids.length) falhas.push('alguém entrou duas vezes na mesma Conferência: ' + ids.join(', '));
      if (!ids.includes('greer')) falhas.push('a Greer ficou fora da Conferência');
      chaveAteARodada(c, PREMIO_CONFERENCIA.length - 1);
      const f = c.inscritos[vagaDoAdversario(c)].id;
      finaisConf.add(f); if (f === 'greer') greerNaFinal++;
    }
    if (finaisConf.size < 4) falhas.push(`em 80 Conferências a final teve só ${finaisConf.size} adversários diferentes`);
    if (greerNaFinal === 80) falhas.push('a Greer continua marcada pra final da Conferência');
    return falhas;
  });
  for (const f of sorteio){ onde = 'torneio/sorteio'; anota('torneio', f); }

  /* recarregar entre duas rodadas volta pra chave, não pro mapa */
  await restaurar();
  await tentar('torneio/recarregar entre rodadas', () => {
    const d = Estado.dados;
    d.local = 'planalto'; d.capitulo = 22; d.jogador.dinheiro = 90000; d.relogio.hora = 14; d.relogio.periodo = 'tarde'; d.arena = {};
    Jogo.iniciarTorneio();
    if (!Jogo.torneioAtual) throw new Error('a inscrição não abriu o torneio');
    Estado.salvar('auto');
    Jogo.continuar();
    if (!document.querySelector('#app .chave16')) throw new Error('recarregou entre rodadas e a chave sumiu');
    Jogo.desistirTorneio();
    if (Jogo.torneioAtual || Estado.dados.torneioAberto) throw new Error('desistiu e o torneio ficou no save');
  });
  await restaurar();
  await tentar('conferência/recarregar entre rodadas', () => {
    const d = Estado.dados;
    d.local = 'planalto'; d.capitulo = 26; d.jogador.dinheiro = 90000; d.flags.campeao_de_kanto = true; d.arena = {};
    Relogio.ateODia(DIA_DA_CONFERENCIA, 10, true);
    Conferencia.iniciar();
    if (!Jogo.conferenciaAtual) throw new Error('a inscrição não abriu a Conferência');
    Estado.salvar('auto');
    Jogo.continuar();
    if (!document.querySelector('#app .chave16.conf')) throw new Error('recarregou entre rodadas e a chave da Conferência sumiu');
    Conferencia.desistir();
    if (Jogo.conferenciaAtual || Estado.dados.conferenciaAberta) throw new Error('desistiu e a Conferência ficou no save');
  });

  /* ---------- viajar com o time inteiro desmaiado ----------
     o selvagem que sai no caminho faz você recuar, e a viagem termina:
     nada fica pendurado pra próxima luta te levar pro destino velho */
  await restaurar();
  const desmaiado = await page.evaluate(() => {
    const d = Estado.dados, falhas = [], chance = Dados.chance;
    d.time.forEach(p => { p.hp = 0; }); d.local = 'rota1'; Jogo.depoisDaEstrada = null;
    Dados.chance = () => true;
    try { Exploracao.viajar('viridian'); } finally { Dados.chance = chance; }
    if (d.local !== 'viridian') falhas.push(`com o time desmaiado, a viagem da Rota 1 pra Viridian parou em ${d.local}`);
    if (Jogo.depoisDaEstrada) falhas.push('a viagem ficou pendurada esperando a próxima luta');
    return falhas;
  });
  for (const f of desmaiado){ onde = 'viagem/time desmaiado'; anota('viagem', f); }

  /* ---------- a tarde da arena: um torneio por dia, a Conferência no sábado ----------
     a inscrição de manhã leva o relógio à uma, o fim leva às seis, o
     mesmo dia fecha a porta com o porquê, e o segundo título não dá
     reputação de novo */
  await restaurar();
  const arena = await page.evaluate(() => {
    const d = Estado.dados, falhas = [];
    d.local = 'planalto'; d.capitulo = 22; d.jogador.dinheiro = 90000; d.flags.campeao_de_kanto = true;
    d.relogio.hora = 9; d.relogio.periodo = 'manhã'; d.arena = {};
    if (statusTorneio().estado !== 'disponivel') falhas.push('de manhã, a inscrição do torneio não abre: ' + statusTorneio().texto);
    Jogo.iniciarTorneio();
    if (d.relogio.hora !== ARENA_COMECA) falhas.push(`inscrito de manhã, o relógio foi pra ${d.relogio.hora}h, e o chaveamento sai à ${ARENA_COMECA}`);
    if (statusTorneio().estado === 'disponivel') falhas.push('dá pra se inscrever duas vezes no mesmo dia');
    { const t = Jogo.torneioAtual, R = PREMIO_TORNEIO.length - 1;
      for (let k = 0; k < R; k++) fecharRodada(t, k, true);
      t.rodada = R; t.adv = adversarioDaVez(t); }
    const rep = () => d.reputacao.pontosBom;
    d.flags['rep_torneio_' + (PREMIO_TORNEIO.length - 1)] = true; const antes = rep();
    Jogo.resultadoTorneio({resultado:'vitoria'});
    if (rep() !== antes) falhas.push('a final vencida de novo deu reputação de novo');
    if (d.relogio.hora !== ARENA_FECHA) falhas.push(`o torneio acabou e o relógio ficou em ${d.relogio.hora}h, não nas ${ARENA_FECHA}`);
    UI.telaLiga();
    if (!/hoje já foi/.test(document.querySelector('.painel.liga') ? document.querySelector('.painel.liga').innerText : ''))
      falhas.push('a Liga não diz que o chaveamento de hoje já foi');
    Relogio.ateODia((DIA_DA_CONFERENCIA + 1) % 7, 10, true);
    if (statusConferencia().estado !== 'fechado' || !/sábado/.test(statusConferencia().texto)) falhas.push('a Conferência abre fora do sábado');
    Relogio.ateODia(DIA_DA_CONFERENCIA, 10, true);
    if (statusConferencia().estado !== 'disponivel') falhas.push('no sábado de manhã a Conferência não abre: ' + statusConferencia().texto);
    UI.telaLiga();
    return falhas;
  });
  for (const f of arena){ onde = 'liga/arena'; anota('arena', f); }
  await tentar('liga/arena fechada à noite', () => {
    const d = Estado.dados; d.relogio.hora = 21; d.relogio.periodo = 'noite'; d.arena = {}; UI.telaLiga();
  });
  await page.evaluate(() => { Jogo.torneioAtual = null; Jogo.conferenciaAtual = null; });

  /* ---------- a festa da vitória (vitoria.js), adiantada até o fim ---------- */
  const FESTAS = [
    ...['pewter', 'cerulean', 'vermilion', 'celadon', 'fuchsia', 'saffron', 'cinnabar', 'viridian'].map(id =>
      ['ginásio/' + id, `Jogo.ginasioAtual = GINASIOS.find(g => g.id === '${id}'); Jogo.resultadoGinasio({resultado:'vitoria'})`]),
    ...[0, 1, 2, 3].map(i => ['elite/' + i, `Estado.dados.local = 'planalto'; Jogo.eliteAtual = {indice:${i}, campeao:false}; Jogo.resultadoElite({resultado:'vitoria'})`]),
    ['campeão', `Estado.dados.local = 'planalto'; Jogo.eliteAtual = {indice:4, campeao:true}; Jogo.resultadoElite({resultado:'vitoria'})`],
    ...[0, 1, 2, 3].map(r => ['torneio/' + r, `Estado.dados.local = 'planalto'; Jogo.torneioAtual = chaveAteARodada(novaChave('torneio'), ${r}); Jogo.resultadoTorneio({resultado:'vitoria'})`]),
    ...[0, 1, 2, 3].map(r => ['conferência/' + r, `Estado.dados.local = 'planalto'; Estado.dados.flags.campeao_de_kanto = true; Jogo.conferenciaAtual = chaveAteARodada(novaChave('conferencia'), ${r}); Jogo.veteranoAtual = {tipo:'conferencia'}; Conferencia.resultado({resultado:'vitoria'})`])
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
