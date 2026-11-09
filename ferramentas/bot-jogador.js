/* ============================================================
   ROBÔ JOGADOR
   Joga o jogo pela própria tela, como gente: lê a luta e escolhe o
   golpe que mais machuca, troca quem está em desvantagem ou com
   pouco HP (recua), usa Potion, foge de selvagem muito acima, captura
   o que quer, cura no Centro ou em casa, compra o que falta, treina
   quando o time está abaixo do capítulo seguinte, vai atrás de
   ginásio quando a história pede insígnia e segue a história. Nada de
   mexer no estado por fora: tudo passa pelas funções que os botões
   chamam.

   Em cada tela ele lê o texto e anota o que parece quebrado:
   marca de gênero sem resolver, "undefined", "NaN", HTML vazando,
   "bicho"/"bola" fora do lugar, balão sem nome.

   Uso:  node ferramentas/bot-jogador.js [minutos] [saida.json]
         CIDADE=Cerulean GENERO=Mulher node ferramentas/bot-jogador.js 20
         CAPITULO=17 NOME=Bento node ferramentas/bot-jogador.js 25
         SAVE=jornada.json node ferramentas/bot-jogador.js 25
         NOME='?' GENERO='?' CIDADE='?' META=pokedex INICIAL=rand TURBO=20 \
           node ferramentas/bot-jogador.js 110 r1.json
         RETOMAR=r1.ponto.json node ferramentas/bot-jogador.js 110 r1.json

   O JEITO. Cada robô joga do jeito que o objetivo da ficha pede
   (META=, ou o que a inscrição sortear): o competitivo caça ginásio e
   tenta a Elite, o colecionador captura toda espécie que falta, o fiel
   ao time não troca ninguém, o prudente cura cedo e foge antes, o
   andarilho vasculha e desvia. Os números estão em JEITOS, logo
   abaixo. O que ele escolhe nas cenas continua no dado, só que a
   opção que combina com o jeito pesa três vezes mais.

   O INICIAL. INICIAL=rand marca "O que já estava em casa" na inscrição:
   o jogo sorteia o inicial pela tabela da casa (cidade natal ou jeito),
   como quem joga e escolhe isso. Sem a variável, fica o padrão da ficha.

   A JOGADA INTEIRA. Uma etapa dura [minutos]. A cada PONTO_MIN minutos,
   no mapa, e no fim da etapa, ele grava o ponto de parada em
   <saida>.ponto.json: o save do jogo (o mesmo do Salvar, com a luta se
   tiver uma), o diário de bordo e o que ele lembra. RETOMAR= começa a
   etapa seguinte dali, com o diário continuando. A saída diz como a
   etapa acabou (estado): final, morte, pausa (o tempo), erros ou
   travou. TURBO=N encena a luta N vezes mais rápido que 1× (o botão do
   jogo vai até 3×): só a encenação muda, dado e turno são os mesmos.

   Em 25 minutos e 3× o robô chega ao capítulo 4 ou 5. CAPITULO=N faz a
   inscrição de sempre e pula pra antes do capítulo N, como quem jogou
   até ali: o inicial entregue pela função do jogo e subido pro nível
   da área, mais cinco no time, os capítulos de antes fechados, as
   insígnias que o capítulo pede, pontos de status, dinheiro, mochila e
   PokéNav, no lugar onde o capítulo anterior acaba. As escolhas desses
   capítulos não aconteceram: as flags ficam vazias, como as de quem
   disse não a tudo. O capítulo de caminho de cada desvio que ficou pra
   trás conta como jogado: antes do 26 é depois do 25.06. SAVE= começa
   de um arquivo do Salvar, carregado pelo mesmo caminho do "Carregar
   jogo".

   No arquivo de saída vai o diário de bordo (reg.passos: capítulo,
   escolha de cena, luta com o contexto e a captura, viagem, compra,
   PC, pedra, evolução, morte, cena de linha, rival e o final) e a
   ficha de quem jogou (ficha).
   ============================================================ */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const MIN = +(process.argv[2] || 15);
const OUT = process.argv[3] || path.join(__dirname, '..', 'bot-jogador.json');
const PONTO = OUT.replace(/\.json$/, '') + '.ponto.json';
/* '?' deixa o jogo (ou o dado) escolher */
const CIDADE = process.env.CIDADE || 'Pallet';
const GENERO = process.env.GENERO || 'Mulher';
const NOME = process.env.NOME || 'Íris';
const META = process.env.META || '';
const INICIAL = process.env.INICIAL || '';
const TURBO = Math.max(1, +(process.env.TURBO || 3));
const PONTO_MIN = +(process.env.PONTO_MIN || 5);
const CAPITULO = +(process.env.CAPITULO || 0);
const SAVE = process.env.SAVE || '';
const RETOMAR = process.env.RETOMAR || '';
const RAIZ = 'file://' + path.resolve(__dirname, '..', 'index.html');

/* O jeito de cada objetivo da ficha (METAS, em rumo.js). Os números:
   cura   — abaixo dessa fração do HP do time, ele volta pra curar;
   abaixo — quantos níveis abaixo da área do próximo capítulo ele aceita seguir;
   moer   — quantas procuras e treinos por capítulo, no máximo, pra chegar lá;
   foge   — selvagem quantos níveis acima do Pokémon dele faz ele fugir;
   captura— 'time' (só até ter seis), 'forte' (o que melhora o time),
            'nova' (toda espécie que a Pokédex ainda não tem);
   lendario — tenta Pokébola em lendário ferido;
   troca  — põe no cinto o melhor que tem no PC;
   pedra  — compra e usa pedra de evolução;
   ginasio— vai atrás de ginásio mesmo sem o capítulo pedir;
   liga   — tenta a Elite quando passa pelo Planalto com as oito;
   desvio — chance de vasculhar ou andar pra um vizinho antes de seguir;
   bolas  — quantas Pokébolas ele quer na mochila;
   gosta  — o que pesa três vezes nas escolhas de cena. */
const JEITOS = {
  campeao: {nome:'Competitivo', cura:.6, abaixo:0, moer:80, foge:10, captura:'forte', lendario:true, troca:true, pedra:true,
    ginasio:true, liga:true, desvio:0, bolas:5, gosta:/(lutar|luta|encar|desafi|trein|vencer|enfrent|ganhar)/i},
  pokedex: {nome:'Colecionador', cura:.6, abaixo:2, moer:60, foge:8, captura:'nova', lendario:true, troca:true, pedra:true,
    ginasio:false, liga:false, desvio:.1, bolas:12, gosta:/(pokémon|captur|olhar|pergunt|anot|pokédex|examin)/i},
  heroi: {nome:'Protetor', cura:.7, abaixo:2, moer:60, foge:8, captura:'forte', lendario:false, troca:true, pedra:true,
    ginasio:false, liga:false, desvio:.05, bolas:6, gosta:/(ajud|proteg|defend|salv|levar|socorr|cuid|devolv|tirar eles)/i},
  poder: {nome:'Ambicioso', cura:.5, abaixo:3, moer:40, foge:9, captura:'forte', lendario:true, troca:true, pedra:true,
    ginasio:true, liga:true, desvio:0, bolas:6, gosta:/(aceit|dinheiro|cobr|contrato|negóci|oferta|assin|preço)/i},
  vinculo: {nome:'Fiel ao time', cura:.75, abaixo:1, moer:80, foge:7, captura:'time', lendario:false, troca:false, pedra:false,
    ginasio:false, liga:false, desvio:.05, bolas:5, gosta:/(time|cuid|comida|água|junt|ficar|carinho|acalm)/i},
  explorar: {nome:'Andarilho', cura:.55, abaixo:4, moer:30, foge:8, captura:'nova', lendario:false, troca:true, pedra:true,
    ginasio:false, liga:false, desvio:.2, bolas:8, gosta:/(olhar|andar|sub|desc|entrar|segu|explor|atravess|caminh)/i},
  casa: {nome:'Prudente', cura:.8, abaixo:0, moer:90, foge:5, captura:'time', lendario:false, troca:true, pedra:true,
    ginasio:false, liga:false, desvio:0, bolas:5, gosta:/(voltar|esperar|não|recus|ficar|devagar|pensar|calma)/i}
};
const NEUTRO = {nome:'Neutro', cura:.6, abaixo:2, moer:60, foge:8, captura:'time', lendario:false, troca:false, pedra:false,
  ginasio:false, liga:false, desvio:0, bolas:5, gosta:null};

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
  /* LEVE=1: o navegador pede "menos movimento" (a regra do jogo pra
     prefers-reduced-motion corta toda animação de CSS em loop) e pinta sem
     a GPU emulada. Cinco robôs juntos, sem isso, punham a máquina com
     carga 15 em quatro núcleos só desenhando o que ninguém olha. A
     partida é a mesma: muda a pintura, não a conta */
  const LEVE = process.env.LEVE === '1';
  const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'].concat(LEVE ? ['--disable-gpu'] : []) });
  /* a janela menor também pesa: o fundo do lugar é repintado a cada
     segundo (a luz anda com o relógio), e o custo é por pixel */
  const page = await browser.newPage(LEVE ? {viewport:{width:800, height:640}, reducedMotion:'reduce'} : {viewport:{width:1000, height:1100}});
  const ponto = RETOMAR ? JSON.parse(fs.readFileSync(RETOMAR, 'utf8')) : null;
  const erros = [], achados = (ponto && ponto.achados) || {}, log = (ponto && ponto.log) || [];
  /* o que ele acha vai pro registro na hora, não só no fim da etapa:
     quem vigia a jogada conserta enquanto ela anda */
  const anota = (tipo, txt) => { const k = tipo + ' :: ' + txt.slice(0, 140);
    if (!achados[k]) console.log('ACHADO', k);
    achados[k] = (achados[k] || 0) + 1; };
  page.on('pageerror', e => { const m = e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | ');
    erros.push(m); console.log('ERRO JS', m.slice(0, 300)); });
  page.on('dialog', d => /Soltar|permanente|Vender|Largar/.test(d.message()) ? d.dismiss() : d.accept());
  await page.goto(RAIZ);
  await page.waitForTimeout(400);
  /* a luta encenada mais rápido: 3× é o que quem joga pode escolher, e
     TURBO acima disso põe o fator direto (o botão só gira entre 1, 2 e 3).
     Só a encenação anda: dado e turno são os mesmos. Em 1× o robô do
     capítulo 22 fez sete lutas em 25 minutos no Caminho da Vitória (de
     15 a 23 turnos cada) e nunca chegou ao Planalto */
  const turbo = () => page.evaluate(t => { try {
    if (t > 3){ Velocidade._f = t; Velocidade.aplicar(); } else Velocidade.definir(t);
  } catch (e) {} }, TURBO);
  await turbo();
  if (ponto){
    /* a etapa seguinte: o save do ponto, pelo caminho do "Carregar jogo" */
    const r = await page.evaluate(t => {
      const r = ArquivoSave.ler(t);
      if (r.erro) return r.erro;
      ArquivoSave.usar(r.dados, r.finais, 1);
      Jogo.continuar();
      return null;
    }, ponto.save);
    if (r){ console.log('PONTO recusado:', r); await browser.close(); return; }
  } else if (SAVE){
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
    /* a inscrição: gênero e cidade no primeiro passo (com '?', no dado),
       o nome escrito ou sorteado pelo jogo, o objetivo e o inicial se
       vierem, e o resto pelo "Sortear o resto" */
    const genero = GENERO === '?' ? (Math.random() < .5 ? 'Homem' : 'Mulher') : GENERO;
    const cidade = CIDADE === '?' ? await page.evaluate(() => Dados.escolher(CIDADES)) : CIDADE;
    await page.locator(`#f-genero button[data-v="${genero}"]`).click();
    if (NOME !== '?') await page.fill('#f-nome', NOME);
    await page.locator(`#f-cidade button[data-v="${cidade}"]`).click().catch(() => {});
    await page.evaluate(({meta, inicial}) => {
      const c = UI._cr; if (!c) return;
      if (meta) c.meta = meta;
      if (inicial) c.inicial = inicial;
    }, {meta:META, inicial:INICIAL});
    await page.locator('#cr-sortear').click();
    await page.waitForTimeout(200);
    await page.locator('button:has-text("Sair de casa")').click();
    await page.waitForTimeout(400);
  }
  if (CAPITULO > 1 && !SAVE && !ponto){
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

  /* o jeito sai do objetivo que ficou na ficha */
  const meta = await page.evaluate(() => Estado.j.meta || null).catch(() => null);
  const J = JEITOS[meta] || NEUTRO;
  console.log('JEITO', meta, J.nome);

  /* o que aconteceu, pra conferir depois (na etapa seguinte, continua) */
  await page.evaluate(({antes, jeito}) => {
    window.__reg = (antes && antes.reg) || {lutas:[], caps:[], gastos:{}, passos:[]};
    window.__treinos = (antes && antes.treinos) || {};
    window.__extra = (antes && antes.extra) || {};
    window.__jeito = jeito;
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
      if (J.ginasioAtual) return {de:'ginásio', nome:'Ginásio de ' + J.ginasioAtual.cidade, lider:J.ginasioAtual.lider, insignia:J.ginasioAtual.insignia, id:J.ginasioAtual.id};
      if (J.eliteAtual != null) return {de:'Liga', nome:J.eliteAtual.campeao ? 'Campeão' : 'Elite, porta ' + ((J.eliteAtual.indice || 0) + 1)};
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
    if (mt) Estado.matar = function(p, causa){ passo('morte', {quem:p && nomeExib(p), especie:p && p.nome, nivel:p && p.nivel, causa}); return mt(p, causa); };
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
          turnos:B.turno, caidos:vivos.filter(p => p.hp <= 0).length, de:vivos.length, bolas:(window.__extra || {}).bolasNaLuta || 0,
          time:vivos.map(p => p.nome + ' ' + p.nivel),
          capturou:fim.resultado === 'captura' && fim.pokemon ? fim.pokemon.nome + ' ' + fim.pokemon.nivel : null});
        /* ginásio perdido: da próxima vez ele chega mais forte */
        /* e treina de novo antes de voltar: a conta de treino do ginásio
           zera. Com ela parada no teto, o Vito desafiou o Brock 1.225
           vezes seguidas com um Geodude só */
        if (cx.de === 'ginásio' && fim.resultado !== 'vitoria' && cx.id){
          const X = window.__extra; X.gin = X.gin || {}; X.gin[cx.id] = (X.gin[cx.id] || 0) + 1;
          X.moerGin = X.moerGin || {}; X.moerGin[cx.id] = 0;
        }
      } catch(e){}
      return fb(fim);
    };
    const fc = Historia.fecharCapitulo.bind(Historia);
    Historia.fecharCapitulo = function(){ const r = fc();
      try { const d = Estado.dados; __reg.caps.push({cap:d.capitulo, dia:d.relogio.dia, ins:d.insignias.length,
        time:d.time.map(p => p.nome + ' ' + p.nivel), dinheiro:d.jogador.dinheiro});
        passo('fechou', {num:d.capitulo, time:d.time.map(p => p.nome + ' ' + p.nivel), dinheiro:d.jogador.dinheiro}); } catch(e){}
      return r; };
  }, {antes:ponto, jeito:Object.assign({}, J, {gosta:null})});

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

  /* o ponto de parada: o save (o do Salvar, com a luta se tiver uma), o
     diário e o que o robô lembra, pra a etapa seguinte continuar dali */
  const t0 = Date.now();
  const jaJogou = (ponto && ponto.minutos) || 0;
  /* o primeiro ponto sai na primeira vez no mapa: quem começa do zero
     e é interrompido logo não recomeça com outro personagem */
  let ultimoPonto = ponto ? Date.now() : 0;
  /* PARAR na pasta da saída: termina a etapa limpo, gravando o ponto */
  const PARAR = path.join(path.dirname(OUT), 'PARAR');
  const gravarPonto = async () => {
    const x = await page.evaluate(() => {
      const r = Object.assign({}, window.__reg); delete r.contexto;
      return {save:ArquivoSave.texto(), reg:r, treinos:window.__treinos || {}, extra:window.__extra || {}};
    }).catch(() => null);
    if (!x) return false;
    fs.writeFileSync(PONTO, JSON.stringify(Object.assign(x, {meta, jeito:J.nome, achados, log:log.slice(-300),
      quando:new Date().toISOString(), minutos:jaJogou + (Date.now() - t0) / 60000})));
    ultimoPonto = Date.now();
    return true;
  };

  /* os apelidos que ele dá: nada de bicho do nosso mundo, nada repetido */
  const APELIDOS = ['Faísca', 'Pipoca', 'Brasa', 'Nuvem', 'Pingo', 'Trovão', 'Fubá', 'Cacau', 'Tufão', 'Chuvisco', 'Pedrinha',
    'Ventania', 'Biscoito', 'Cometa', 'Garoa', 'Sereno', 'Tição', 'Graveto', 'Paçoca', 'Tampinha', 'Neblina', 'Farol'];
  const apelidosDados = new Set(await page.evaluate(() => [...Estado.dados.time, ...(Estado.dados.pc || [])].map(p => p.apelido).filter(Boolean)).catch(() => []));
  let passos = 0, parado = 0, ultima = '', empacou = 0, ultimoRetrato = '', estado = 'pausa';
  let ultimoMinuto = Date.now(), ultimoMinutoK = '', mesmoMinuto = 0, ultimaAcao = '';
  const prazo = MIN * 60000;
  while (passos++ < 2000000){
    const passou = Date.now() - t0;
    if (passou >= prazo){
      /* o tempo acabou: a luta que está andando termina antes (até 3 minutos) */
      const emLuta = await page.evaluate(() => !!Batalha.ativo).catch(() => false);
      if (!emLuta || passou >= prazo + 180000) break;
    }
    if (erros.length > 8){ estado = 'erros'; break; }
    if (fs.existsSync(PARAR)){ console.log('PARAR pedido'); break; }
    await page.waitForTimeout(30);
    /* um retrato por minuto, aconteça o que acontecer: se ele parar no
       meio de uma encenação, é aqui que aparece (o de 200 em 200 passos
       fica depois da espera e não sai) */
    if (Date.now() - ultimoMinuto > 60000){
      ultimoMinuto = Date.now();
      const m = await page.evaluate(() => ({c:Estado.dados.capitulo, l:Estado.dados.local, modo:Estado.dados.modo, cena:Estado.dados.cena,
        luta:!!Batalha.ativo, enc:!!Jogo.encenando, bola:!!Jogo.animandoBola, modal:!!document.querySelector('#modal'),
        tela:(document.querySelector('#modal') || document.querySelector('#app') || {innerText:''}).innerText.replace(/\s+/g, ' ').slice(0, 110)})).catch(e => ({erro:e.message}));
      const k = JSON.stringify(m);
      mesmoMinuto = k === ultimoMinutoK ? mesmoMinuto + 1 : 0; ultimoMinutoK = k;
      console.log(`[min ${Math.round((Date.now() - t0) / 60000)}] ${k}${mesmoMinuto ? ' (igual há ' + mesmoMinuto + ' min)' : ''}`);
      if (mesmoMinuto === 3) anota('parado 3 minutos', k.slice(0, 140));
      /* parado: o que tem na tela pra apertar */
      if (mesmoMinuto === 1) console.log('  BOTÕES', JSON.stringify(await page.evaluate(() => ({
        arena:!!document.querySelector('#arena'), acoes:!!document.querySelector('.acoes-combate, #acoes'),
        fase:Batalha.fase, tipo:Batalha.tipo, aliado:Batalha.aliado && (Batalha.aliado.nome + ' ' + Batalha.aliado.hp),
        inimigo:Batalha.inimigo && (Batalha.inimigo.nome + ' ' + Batalha.inimigo.hp), ativo:Batalha.ativo, fimPendente:!!Jogo.fimPendente,
        botoes:[...document.querySelectorAll('#app button, #modal button')].map(b => (b.className.split(' ')[0] || '') + ':' + b.innerText.replace(/\s+/g, ' ').trim().slice(0, 30) + (b.disabled ? '(off)' : '')).slice(0, 30)
      })).catch(e => ({erro:e.message}))), 'ÚLTIMA AÇÃO', ultimaAcao);
    }
    if (await page.evaluate(() => !!(Jogo.encenando || Jogo.animandoBola)).catch(() => false)){ await page.waitForTimeout(60); continue; }
    if (passos % 5 === 0) await lerTela();
    if (passos % 200 === 0){
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
      /* empacado de vez: fecha o que estiver aberto e redesenha o lugar */
      if (empacou >= 5){ await page.evaluate(() => { try { UI.fecharModal(true); } catch (e) {} if (!Batalha.ativo && Estado.dados.modo === 'mundo') Exploracao.tela(); }).catch(() => {}); empacou = 0; }
    }
    if (await page.locator('.gameover').count()){
      const t = await page.locator('.gameover').innerText();
      log.push({gameover:t});
      await page.evaluate(x => window.__passo && __passo('fim', {como:'morte', texto:x.slice(0, 300)}), t).catch(() => {});
      estado = 'morte';
      break;
    }
    if (await page.locator('.final').count()){
      /* o final da jornada: o título e o primeiro parágrafo vão pro diário */
      await page.evaluate(() => { const f = document.querySelector('.painel.final');
        window.__passo && __passo('fim', {como:'final', titulo:(f.querySelector('.tit') || {}).innerText || '',
          texto:((f.querySelector('p') || {}).innerText || '').slice(0, 400)}); }).catch(() => {});
      estado = 'final';
      break;
    }

    /* apelido: uma vez em quatro, e um nome que o time ainda não tem */
    if (await page.locator('#campo-apelido').count()){
      const nomes = APELIDOS.filter(n => !apelidosDados.has(n));
      if (nomes.length && Math.random() < 0.25){
        const n = nomes[Math.floor(Math.random() * nomes.length)];
        apelidosDados.add(n);
        await page.fill('#campo-apelido', n); await page.locator('#modal button:has-text("Dar o apelido")').click({timeout:3000}).catch(() => {});
      } else await page.locator('#modal button:has-text("Não")').click({timeout:3000}).catch(() => {});
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
    if (!(await page.locator('#modal').count()) && await page.locator('.continuar-batalha').count()){ await page.locator('.continuar-batalha').first().click({timeout:3000}).catch(() => {}); await page.waitForTimeout(80); continue; }
    if (await page.locator('#modal .evo').count()){
      if (await page.locator('#evo-seguir:visible').count()) await page.locator('#evo-seguir').click({timeout:3000}).catch(() => {}); else await page.waitForTimeout(300);
      continue;
    }

    /* luta: lê a situação e decide */
    if (await page.evaluate(() => Batalha.ativo && !!document.querySelector('.acoes-combate, #acoes')).catch(() => false)){
      const a = await page.evaluate(() => {
        const B = Batalha, p = B.aliado, alvo = B.inimigo, d = Estado.dados;
        const J = window.__jeito || {}, X = window.__extra || (window.__extra = {});
        if (!p || !alvo) return null;
        /* luta nova: zera a conta de Pokébolas jogadas e de trocas */
        if (X.lutaUid !== alvo.uid){ X.lutaUid = alvo.uid; X.bolasNaLuta = 0; X.trocasNaLuta = 0; }
        if (B.fase === 'ameaca') return {tipo:'fugirAmeaca'};
        /* selvagem que não acaba (os dois lados só com golpe de status): vai embora */
        if (B.tipo === 'selvagem' && B.turno > 60 && B.fuga !== false) return {tipo:'fugir'};
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
        /* selvagem muito acima: foge (o prudente foge antes) */
        if (B.tipo === 'selvagem' && alvo.nivel > p.nivel + (J.foge || 8) && B.fuga !== false) return {tipo:'fugir'};
        /* captura: o que ele quer, pelo jeito dele. Todo mundo completa o
           time; com seis, o colecionador quer a espécie que falta, o
           competitivo o que é melhor que o pior do cinto, e ninguém joga
           Pokébola no que tem medo */
        if (B.tipo === 'selvagem' || B.tipo === 'lendario'){
          const pd = Estado.pdex();
          const novo = !(pd.catalogados || {})[alvo.dex];
          const g = typeof gostoSabido === 'function' ? gostoSabido(alvo) : 0;
          const vivos = d.time.filter(x => !x.morto);
          const valor = x => x.nivel + (((DEX[x.dex] || {}).total) || 300) / 40;
          const pior = vivos.length ? Math.min(...vivos.map(valor)) : 0;
          let quer = false;
          if (B.tipo === 'lendario') quer = !!J.lendario && novo;
          else if (g < 0) quer = false;
          else if (vivos.length < 6) quer = true;
          else if (J.captura === 'nova') quer = novo;
          else if (J.captura === 'forte') quer = valor(alvo) > pior + 3 || (g > 0 && novo);
          const limite = B.tipo === 'lendario' ? 4 : 6;
          if (quer && (X.bolasNaLuta || 0) < limite){
            const lista = B.tipo === 'lendario' ? ['Master Ball', 'Ultra Ball'] : ['Poké Ball', 'Great Ball', 'Ultra Ball'];
            const tem = lista.filter(n => Estado.contaItem(n) > 0);
            const ferido = B.tipo === 'lendario' ? alvo.hp <= alvo.hpMax * .25 : alvo.hp <= alvo.hpMax * .5;
            /* time pequeno, ou o selvagem cai no primeiro golpe: joga logo,
               com ele inteiro (uma Poké Ball pega o de nível baixo uma vez
               em três). O Vito, com um Geodude 21, derrubava tudo antes da
               metade do HP e não jogou uma Pokébola sequer */
            const jaDe = B.tipo !== 'lendario' && (X.bolasNaLuta || 0) < 3 && (vivos.length < 3 || p.nivel >= alvo.nivel + 8);
            if (tem.length && (ferido || jaDe)){
              /* a mais barata que dá conta do posto dele, senão a melhor que tem */
              const pede = (SUCESSOS_DO_POSTO[postoDoNivel(alvo.nivel)] || 4) - (alvo.hp <= 1 ? 2 : 1) - (alvo.status ? 1 : 0);
              const nome = B.tipo === 'lendario' ? tem[0] : (tem.find(n => (SELO_DA_BOLA[n] || 0) / 2 >= pede) || tem[tem.length - 1]);
              X.bolasNaLuta = (X.bolasNaLuta || 0) + 1;
              return {tipo:'bola', nome};
            }
          }
        }
        /* cura quem está quase caindo */
        const pot = ['Hyper Potion', 'Super Potion', 'Potion'].find(n => Estado.contaItem(n) > 0);
        if (pot && p.hp <= p.hpMax * 0.25 && p.hp > 0) return {tipo:'item', nome:pot, alvoUid:p.uid};
        /* Vontade: com pouco HP, esquiva o próximo golpe */
        if (p.hp <= p.hpMax * 0.5 && vontadeDe(p) >= 2 && B.podeGastarVontade('esquiva')) B.gastarVontade('esquiva');
        /* recua: se o golpe dele é ruim e tem alguém melhor no banco. Duas
           trocas por luta, no máximo: o Metapod (só Harden) e o Oddish
           (fraco contra Spearow) trocaram de lugar 184 turnos seguidos,
           com o Spearow só usando Leer, e a luta nunca acabava */
        const meu = golpeBom(p);
        const banco = d.time.filter(x => x.uid !== p.uid && x.hp > x.hpMax * 0.4 && !x.morto);
        const melhorBanco = banco.map(x => ({x, s:golpeBom(x).melhor})).sort((u, v) => v.s - u.s)[0];
        /* precisão no chão (Smokescreen, Sand Attack): quem joga troca pra
           zerar os estágios, como nos jogos */
        if (melhorBanco && ((B.estAliado || {}).precisao || 0) <= -3 && (X.trocasNaLuta || 0) < 3 && !(B.estAliado && B.estAliado.presoTurnos)){
          X.trocasNaLuta = (X.trocasNaLuta || 0) + 1;
          return {tipo:'trocar', uid:melhorBanco.x.uid};
        }
        if (melhorBanco && (X.trocasNaLuta || 0) < 2 && (meu.melhor < 1 || p.hp <= p.hpMax * 0.2)
            && melhorBanco.s > Math.max(1, meu.melhor * 1.5) && !(B.estAliado && B.estAliado.presoTurnos)){
          X.trocasNaLuta = (X.trocasNaLuta || 0) + 1;
          return {tipo:'trocar', uid:melhorBanco.x.uid};
        }
        return {tipo:'golpe', indice:meu.idx};
      }).catch(() => null);
      if (a){
        const antes = await page.evaluate(() => Batalha.turno + ':' + (Batalha.eventos || []).length).catch(() => '');
        await page.evaluate(x => { UI.modoBatalha = 'menu'; Jogo.acaoBatalha(x); }, a).catch(e => erros.push('acao: ' + e.message));
        await page.waitForTimeout(100);
        ultimaAcao = JSON.stringify(a) + ' ' + antes + ' -> ' + await page.evaluate(() => Batalha.turno + ':' + (Batalha.eventos || []).length + ' ' +
          ((Batalha.eventos || []).slice(-2).map(e => e.tipo + ':' + String(e.texto || '').slice(0, 60)).join(' | '))).catch(() => '');
        continue;
      }
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
      if (Date.now() - ultimoPonto > PONTO_MIN * 60000) await gravarPonto();
      const dec = await page.evaluate(() => {
        const d = Estado.dados, L = Mundo.atual(), id = Mundo.id();
        const J = window.__jeito || {}, X = window.__extra || (window.__extra = {});
        const dia = d.relogio.dia;
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
        const ir = ate => { const c = trajeto(id, ate); return c && c[1] ? {f:'viajar', id:c[1]} : null; };
        const vivos = d.time.filter(p => !p.morto);
        const hp = vivos.reduce((s, p) => s + Math.max(0, p.hp), 0) / Math.max(1, vivos.reduce((s, p) => s + p.hpMax, 0));
        const afz = afazeresDoLocal().map(a => a.id);
        const ref = nivelDeReferencia();
        const centro = Exploracao.temCentro(L);
        /* o Centro atende quem tem licença de graça; sem ela, cobra 300 ₽
           mais 250 por ferido, e sem o dinheiro a enfermeira empurra a ficha
           de volta (Cidade.atender). O robô sem licença pedia de novo no
           mesmo instante, 3.825 vezes em Pewter */
        const centroAtende = () => {
          if (d.flags.tem_licenca || (typeof Cargos !== 'undefined' && Cargos.centroGratis())) return true;
          const feridos = d.time.filter(p => p.hp < p.hpMax || p.status).length;
          const ninguemDePe = !d.time.some(p => estaVivo(p) && p.hp > 0);
          return ninguemDePe || d.jogador.dinheiro >= 300 + 250 * feridos;
        };
        /* curar: em casa, no Centro, acampando, ou andando até um Centro */
        const curar = () => {
          if (afz.includes('casa')) return {f:'casa'};
          if (afz.includes('centro') && centroAtende()) return {f:'centro'};
          /* acampar pede Ração; sem ela, a noite passa esperando */
          if (ehNoite()) return {f: Estado.contaItem('Ração') >= 1 ? 'acampar' : 'esperar'};
          if (!centroAtende()){
            /* sem dinheiro pro Centro: acampa onde der, ou segue como está */
            if (L.tipo !== 'cidade' && Estado.contaItem('Ração') >= 1 && afz.includes('acampar')) return {f:'acampar'};
            return null;
          }
          const centros = Object.keys(LOCAIS).filter(k => Exploracao.temCentro(LOCAIS[k]) && !travaDaPassagem(id, k))
            .map(k => trajeto(id, k)).filter(c => c && c[1] && !travaDaPassagem(id, c[1])).sort((x, y) => x.length - y.length);
          if (centros.length) return {f:'viajar', id:centros[0][1]};
          return null;
        };
        /* sem licença cada cura no Centro é paga: só volta com o time mal */
        const limiarCura = (d.flags.tem_licenca || (typeof Cargos !== 'undefined' && Cargos.centroGratis()) || afz.includes('casa'))
          ? (J.cura || .6) : Math.min(J.cura || .6, .45);
        if (hp < limiarCura || !Estado.primeiroApto()){ const c = curar(); if (c) return c; }

        /* o PC do Centro: tira o morto do cinto, completa o time e (quem
           troca) põe no lugar do pior o melhor que tem guardado. Uma vez
           por dia em cada cidade */
        if (centro && X.pcDia !== dia + id){
          X.pcDia = dia + id;
          const valor = x => x.nivel + (((DEX[x.dex] || {}).total) || 300) / 40 + ((typeof gostoSabido === 'function' && gostoSabido(x) > 0) ? 3 : 0);
          const guardados = (d.pc || []).filter(x => !x.morto).sort((a, b) => valor(b) - valor(a));
          const morto = d.time.find(x => x.morto);
          if (morto) return {f:'pc', guardar:morto.uid, tirar:guardados[0] ? guardados[0].uid : null};
          if (d.time.length < 6 && guardados.length) return {f:'pc', guardar:null, tirar:guardados[0].uid};
          if (J.troca && guardados.length && d.time.length >= 6){
            const inicial = d.jogador.inicialUid;
            const pior = d.time.filter(x => x.uid !== inicial).sort((a, b) => valor(a) - valor(b))[0];
            if (pior && valor(guardados[0]) > valor(pior) + 3) return {f:'pc', guardar:pior.uid, tirar:guardados[0].uid};
          }
        }
        /* mão livre e item de segurar parado na mochila: dá pra segurar,
           o mais útil primeiro (o Eviolite só pra quem ainda evolui). O
           Vito perdia pro Brock com Leftovers e Eviolite na mochila */
        const ORDEM_SEGURAR = ['Leftovers', 'Eviolite', 'Focus Band', 'Muscle Band', 'Wise Glasses', 'Quick Claw', 'Exp. Share', 'Soothe Bell', 'Amulet Coin'];
        for (const n of ORDEM_SEGURAR){
          if (!Estado.contaItem(n)) continue;
          const livre = d.time.find(p => !p.morto && !p.segurando && (n !== 'Eviolite' || aindaEvolui(p.dex)));
          if (livre) return {f:'segurar', uid:livre.uid, nome:n};
        }
        /* sem dinheiro: vende o que sobra — item de segurar que ninguém
           segura e TM que ninguém do time aprende — como quem joga faz */
        if (afz.includes('loja') && d.jogador.dinheiro < 600 && X.vendaDia !== dia + id){
          const vende = [];
          for (const n of Object.keys(d.itens || {})){
            const i = ITENS_INFO[n] || {}, q = Estado.contaItem(n);
            if (!q || !PRECO_BASE[n]) continue;
            if (i.tipo === 'equipar') vende.push([n, q]);
            else if (i.tipo === 'tm' && !d.time.some(p => !p.morto && aprendeTM(p, n))) vende.push([n, q]);
            else if (i.tipo === 'pedra' && !d.time.some(p => !p.morto && (pedrasDe(n) || {})[p.dex])) vende.push([n, q]);
          }
          if (vende.length){ X.vendaDia = dia + id; return {f:'vender', itens:vende}; }
        }
        /* pedra de evolução na mochila e alguém que evolui com ela */
        if (J.pedra && typeof nomesDePedra === 'function'){
          for (const nome of nomesDePedra()){
            if (!Estado.contaItem(nome)) continue;
            const tab = pedrasDe(nome) || {};
            const alvo = d.time.find(x => !x.morto && tab[x.dex]);
            if (alvo) return {f:'pedra', nome, uid:alvo.uid};
          }
        }

        /* compra: só o que falta e só o que a loja daqui vende, uma vez por
           dia em cada cidade. Antes ele comprava os três toda vez que
           entrava, e em Saffron, que não vende Potion nem Poké Ball,
           voltava ao balcão a cada passo atrás da Potion e saía com mais
           três Rações: 129 Rações e vinte e cinco mil a menos */
        const vende = n => catalogoDaCidade(id).some(([x]) => x === n);
        if (afz.includes('loja') && X.lojaDia !== dia + id){
          /* na ordem de quem passa fome primeiro: Ração, cura, Pokébola */
          const quero = {};
          if (vende('Ração')) quero['Ração'] = 3;
          const melhor = lista => lista.find(vende);
          const pot = melhor(['Hyper Potion', 'Super Potion', 'Potion']);
          if (pot) quero[pot] = J.cura >= .7 ? 6 : 4;
          const bola = melhor(['Ultra Ball', 'Great Ball', 'Poké Ball']);
          if (bola && (J.captura !== 'time' || d.time.length < 6)) quero[bola] = J.bolas || 5;
          /* Revive custa caro: só com dinheiro sobrando */
          if (vende('Revive') && J.cura >= .6 && d.jogador.dinheiro > 8000) quero['Revive'] = 2;
          if (J.pedra && typeof nomesDePedra === 'function')
            for (const nome of nomesDePedra()) if (vende(nome) && !Estado.contaItem(nome) && d.time.some(x => !x.morto && (pedrasDe(nome) || {})[x.dex])) quero[nome] = 1;
          /* e só entra se der pra comprar alguma coisa guardando mil pra estrada */
          const faltam = {};
          for (const [n, q] of Object.entries(quero))
            if (Estado.contaItem(n) < q && precoNaCidade(n, id) <= d.jogador.dinheiro - 1000) faltam[n] = q - Estado.contaItem(n);
          if (Object.keys(faltam).length){ X.lojaDia = dia + id; return {f:'loja', itens:faltam}; }
        }
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

        /* a Elite, pra quem quer: no Planalto, com as oito, uma vez por dia */
        if (J.liga && id === 'planalto' && typeof statusElite4 === 'function' && statusElite4().estado === 'disponivel' && X.eliteDia !== dia){
          const m = (typeof Titulares !== 'undefined' && Titulares.membro(0)) || (typeof ELITE4 !== 'undefined' && ELITE4[0]) || {};
          if (ref >= (m.nivelBase || 50) - 1){
            if (hp < .95){ const c = curar(); if (c) return c; }
            X.eliteDia = dia; return {f:'liga'};
          }
        }

        /* um lugar pra treinar: perto, e com o mato perto do nível do time */
        const lugarDeTreino = () => {
          const c = Object.keys(LOCAIS).filter(k => LOCAIS[k].tipo !== 'cidade' && Mundo.conhecido(k)
              && (LOCAIS[k].nivel || 0) >= ref - 7 && (LOCAIS[k].nivel || 0) <= ref + 3)
            .map(k => trajeto(id, k)).filter(Boolean).sort((a, b) => a.length - b.length);
          return c[0] || null;
        };
        const podeTreinar = d.treinoDia !== d.relogio.dia && Estado.contaItem('Ração') >= TREINO_RACAO
          && (d.treinoReal || 0) + TREINO_ESPERA_MIN * 60000 <= Date.now();
        const treinarAqui = () => (podeTreinar && vivos.some(p => p.nivel < (L.nivel || 5) + 5)) ? {f:'treinar'} : {f:'procurar'};

        /* o ginásio: o da cidade, se der; e ir atrás de um quando a história
           pede insígnia (ou quando o jeito é de quem caça ginásio) */
        const destino = Historia.proximoDestino && Historia.proximoDestino();
        const cap = destino ? Historia.capitulo(destino.num) : null;
        const travado = !!(destino && (travaDoCapitulo(destino.num)
          || (destino.local && destino.local !== '*' && destino.local !== id && !trajeto(id, destino.local))));
        const perdeu = gid => ((X.gin || {})[gid] || 0);
        const prontoPra = g => ref >= nivelGinasio(g) - (J.ginasio ? 1 : 0) + 2 * perdeu(g.id);
        const daqui = GINASIOS.find(x => x.id === id && statusGinasio(x).estado === 'disponivel');
        if (daqui && prontoPra(daqui)){
          /* porta com hora marcada (Cinnabar): curar agora gasta a janela,
             então entra como está */
          if (hp < .9 && !daqui.horario){ const c = curar(); if (c) return c; }
          return {f:'ginasio'};
        }
        if (travado || J.ginasio){
          const abertos = GINASIOS.filter(g => ['disponivel', 'fechado'].includes(statusGinasio(g).estado))
            .map(g => ({g, cam:trajeto(id, g.id)})).filter(x => x.cam)
            .sort((a, b) => nivelGinasio(a.g) - nivelGinasio(b.g) || a.cam.length - b.cam.length);
          const alvo = abertos[0];
          const MOER_GIN = 150;
          if (alvo){
            const g = alvo.g;
            X.moerGin = X.moerGin || {};
            if (prontoPra(g) || (X.moerGin[g.id] || 0) >= MOER_GIN){
              if (id === g.id){
                if (statusGinasio(g).estado === 'fechado'){
                  /* fechado: cura antes, fora do dia dele, e espera a porta */
                  const diaDele = g.horario && Calendario.hoje().semanaIdx === g.horario.dia;
                  if (hp < .9 && !diaDele){ const c = curar(); if (c) return c; }
                  return {f:'esperar'};
                }
                return (hp < .9 && !g.horario) ? (curar() || {f:'ginasio'}) : {f:'ginasio'};
              }
              if (travado || J.ginasio) return {f:'viajar', id:alvo.cam[1]};
            } else if (travado || nivelGinasio(g) <= ref + 6){
              /* fraco demais pro ginásio: treina no lugar mais perto que rende */
              X.moerGin[g.id] = (X.moerGin[g.id] || 0) + 1;
              const t = lugarDeTreino();
              if (t && t.length === 1) return treinarAqui();
              if (t) return {f:'viajar', id:t[1]};
              if (L.tipo !== 'cidade') return treinarAqui();
            }
          }
        }

        /* o andarilho desvia, o colecionador procura o que falta aqui */
        if (J.desvio && Math.random() < J.desvio){
          if (afz.includes('vasculhar') && Math.random() < .5) return {f:'vasculhar'};
          const viz = Mundo.vizinhos().filter(v => !travaDaPassagem(id, v));
          if (viz.length) return {f:'viajar', id:Dados.escolher(viz)};
        }
        if (J.captura === 'nova' && L.tipo !== 'cidade' && typeof ENCONTROS !== 'undefined' && ENCONTROS[id]){
          const pd = Estado.pdex();
          const falta = ENCONTROS[id].some(([dex]) => !(pd.catalogados || {})[dex]);
          const k = 'p' + id + d.capitulo;
          if (falta && (X[k] || 0) < 6 && Estado.contaItem('Poké Ball') + Estado.contaItem('Great Ball') + Estado.contaItem('Ultra Ball') > 0){
            X[k] = (X[k] || 0) + 1; return {f:'procurar'};
          }
        }

        /* o alvo é o capítulo que vem, não a rota onde ele está de passagem:
           com o nível da rota, quem nasce em Lavender treinava na Rota 12
           pra sempre */
        const alvoNv = cap ? (cap.nivelArea || 0) - (J.abaixo != null ? J.abaixo : 2) : (L.nivel || 5);
        /* treinar só rende onde o mato está perto do nível do time: na Rota
           5 (nível 15) um time de 33 não sobe nunca, e o robô do capítulo
           10 passou quinze minutos ali, procurando selvagem pro 11. Longe
           disso ele segue pro capítulo — a rota de lá é mais forte, e quem
           joga de verdade não fica moendo */
        const rendeAqui = (L.nivel || 5) >= ref - 8;
        /* e treina por um tempo, não pra sempre: o jeito diz quantas
           procuras ou treinos por capítulo, e ele segue mesmo abaixo da
           área. Os robôs do 26 ficaram o resto da jogada no norte atrás
           de dois níveis pro 27, indo e voltando do Centro de Cerulean */
        const T = window.__treinos || (window.__treinos = {});
        const treinou = T[d.capitulo] || 0;
        const moer = ref < alvoNv && L.tipo !== 'cidade' && rendeAqui && treinou < (J.moer || 60);
        if (moer){ T[d.capitulo] = treinou + 1; return treinarAqui(); }
        if (Historia.arcoAqui() && !travaDoCapitulo(Historia.arcoAqui().num)) return {f:'arco'};
        if (destino && destino.local && destino.local !== '*' && destino.local !== id){
          const v = ir(destino.local);
          if (v) return v;
        }
        const viz = Mundo.vizinhos().filter(v => !travaDaPassagem(id, v));
        return {f:'viajar', id:Dados.escolher(viz)};
      }).catch(e => ({f:'erro', e:e.message}));
      /* o que ele decidiu no mapa vai pro diário (andar entra pela viagem) */
      if (!['viajar', 'erro', 'pc', 'pedra', 'loja', 'segurar', 'vender'].includes(dec.f))
        await page.evaluate(x => window.__passo && __passo('mapa', {f:x.f, itens:x.itens || null}), dec).catch(() => {});
      if (dec.f === 'erro') anota('erro na decisão do mapa', dec.e || '');
      const assin = JSON.stringify(dec) + await page.evaluate(() => Estado.dados.local + Relogio.texto());
      if (assin === ultima && ++parado > 12){ anota('travou no mapa', assin); parado = 0; await page.evaluate(() => Exploracao.fazer('vasculhar')); continue; }
      if (assin !== ultima) parado = 0; ultima = assin;
      if (dec.f === 'loja'){
        await page.evaluate(() => Exploracao.fazer('loja')); await page.waitForTimeout(150);
        await page.evaluate(itens => {
          /* comprar abre a confirmação com a quantidade (Cidade.comprar), e
             só o "Comprar" dela paga: o robô abria a janela e nunca
             confirmava, e andava sem Potion, sem Pokébola e sem Ração */
          const comprou = [];
          for (const [n, q] of Object.entries(itens)){
            if (!catalogoDaCidade(Mundo.id()).some(([x]) => x === n)) continue;
            try {
              const p = precoNaCidade(n, Mundo.id());
              /* guarda mil pra estrada */
              const cabe = Math.floor((Estado.j.dinheiro - 1000) / Math.max(1, p));
              if (cabe < 1) continue;
              Cidade.comprar(n, p);
              if (Cidade._compra) Cidade._compra.qtd = Math.min(q, cabe, Cidade._compra.max || 0);
              if (Cidade._compra && Cidade._compra.qtd){ const k = Cidade._compra.qtd; Cidade.confirmarCompra(n, p); comprou.push(k + '× ' + n); }
            } catch(e){}
          }
          UI.fecharModal(true); Exploracao.tela();
          window.__passo && __passo('compra', {itens:comprou, dinheiro:Estado.j.dinheiro});
        }, dec.itens || {});
      } else if (dec.f === 'pc'){
        /* pelos botões do PC: Guardar na caixa e Levar no cinto */
        await page.evaluate(x => {
          const todos = [...Estado.dados.time, ...(Estado.dados.pc || [])];
          const nome = uid => { const p = todos.find(y => y.uid === uid); return p ? nomeExib(p) + ' (' + p.nome + ' ' + p.nivel + ')' : null; };
          const g = x.guardar ? nome(x.guardar) : null, t = x.tirar ? nome(x.tirar) : null;
          if (x.guardar) UI.pcGuardar(x.guardar);
          if (x.tirar) UI.pcTirar(x.tirar);
          UI.fecharModal(true); Exploracao.tela();
          window.__passo && __passo('pc', {guardou:g, levou:t});
        }, dec).catch(e => erros.push('pc: ' + e.message));
      } else if (dec.f === 'segurar'){
        await page.evaluate(x => {
          const p = Estado.dados.time.find(y => y.uid === x.uid);
          UI.equipar(x.uid, x.nome);
          UI.fecharModal(true); Exploracao.tela();
          window.__passo && __passo('segurar', {nome:x.nome, quem:p ? nomeExib(p) + ' (' + p.nome + ' ' + p.nivel + ')' : null});
        }, dec).catch(e => erros.push('segurar: ' + e.message));
      } else if (dec.f === 'vender'){
        /* pelo balcão da loja: Vender, a quantidade e o Vender da confirmação */
        await page.evaluate(() => Exploracao.fazer('loja')); await page.waitForTimeout(120);
        await page.evaluate(itens => {
          const vendeu = [];
          for (const [n, q] of itens){
            try {
              Cidade.vender(n);
              if (Cidade._compra && Cidade._compra.venda){ Cidade._compra.qtd = q; Cidade.confirmarVenda(n); vendeu.push(q + '× ' + n); }
            } catch(e){}
          }
          UI.fecharModal(true); Exploracao.tela();
          window.__passo && __passo('venda', {itens:vendeu, dinheiro:Estado.j.dinheiro});
        }, dec.itens || []).catch(e => erros.push('vender: ' + e.message));
      } else if (dec.f === 'pedra'){
        await page.evaluate(x => {
          const p = Estado.dados.time.find(y => y.uid === x.uid);
          const de = p ? p.nome : null;
          UI.aplicarPedra(x.nome, x.uid);
          UI.fecharModal(true); Exploracao.tela();
          window.__passo && __passo('pedra', {nome:x.nome, de, para:p ? p.nome : null});
        }, dec).catch(e => erros.push('pedra: ' + e.message));
      } else if (dec.f === 'liga') await page.evaluate(() => { Exploracao.fazer('liga'); Jogo.iniciarElite4(); });
      else if (dec.f === 'viajar') await page.evaluate(i => Exploracao.viajar(i), dec.id);
      else if (dec.f === 'arco') await page.evaluate(() => Exploracao.entrarNoArco());
      else if (dec.f === 'centro'){ await page.evaluate(() => Cidade.atenderAqui()); }
      else if (dec.f !== 'erro') await page.evaluate(f => Exploracao.fazer(f), dec.f);
      await page.waitForTimeout(100);
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
    /* cena: escolhe uma opção (evita soltar e vender). O dado decide, mas
       o que combina com o jeito pesa três vezes, e o "olhar mais um
       pouco", que só adia, pesa menos */
    const esc = page.locator('#escolhas .escolha:not([disabled])').filter({hasNotText:/Soltar|Vender|Não atender/});
    const ne = await esc.count();
    if (ne){
      const textos = await esc.evaluateAll(els => els.map(e => e.innerText.replace(/\s+/g, ' ').trim())).catch(() => []);
      /* perdeu duas vezes no mesmo ginásio: não tenta de novo na hora,
         vai treinar antes. O Vito, com um Geodude só, perdeu do Onix do
         Brock mais de dez vezes seguidas pelo "tentar de novo" */
      const perdeuAqui = await page.evaluate(() => { const g = Jogo.ginasioAtual || GINASIOS.find(x => x.id === Mundo.id());
        return g ? (((window.__extra || {}).gin || {})[g.id] || 0) : 0; }).catch(() => 0);
      const pesos = textos.map(t => (J.gosta && J.gosta.test(t) ? 3 : 1) * (/^Parar e olhar mais um pouco/.test(t) ? .5 : 1)
        * (perdeuAqui >= 2 && /tentar de novo/i.test(t) ? 0 : 1));
      if (!pesos.some(x => x > 0)) pesos.fill(1);
      let r = Math.random() * pesos.reduce((s, x) => s + x, 0), k = 0;
      while (k < pesos.length - 1 && (r -= pesos[k]) > 0) k++;
      if (k >= ne) k = Math.floor(Math.random() * ne);
      const t = textos[k] || '';
      /* a escolha da cena vai pro diário: qual cena, qual título, o que escolheu */
      await page.evaluate(x => window.__passo && __passo('escolha', {cena:Estado.dados.cena, modo:Estado.dados.modo,
        titulo:((document.querySelector('#app .cap-cabecalho .tit') || {}).innerText || '').trim(), texto:x.slice(0, 200)}), t).catch(() => {});
      /* o PokéNav toca 80 ms depois de o capítulo abrir (o toque da
         virada): com a ligação por cima, o clique esperava 30 s e
         derrubava a jogada. Agora desiste rápido, e a volta seguinte
         atende a janela */
      await esc.nth(k).click({timeout:3000}).catch(() => {}); await page.waitForTimeout(70); continue;
    }
    const outros = page.locator('.painel button.btn:not([disabled]), .painel .escolha:not([disabled])');
    if (await outros.count()){ await outros.first().click({timeout:3000}).catch(() => {}); continue; }
    /* luta andando sem botão nenhum: é a abertura entrando, e se espera.
       Desenhar o mapa por cima deixava a luta órfã (o motor esperando o
       golpe, a tela sem golpe pra apertar), e três robôs ficaram parados
       assim no Monte da Lua. Se a arena já sumiu, a luta volta pela tela
       do recarregar */
    if (await page.evaluate(() => !!Batalha.ativo).catch(() => false)){
      const voltou = await page.evaluate(() => {
        if (document.querySelector('#arena')) return false;
        UI.telaBatalha(['A luta continua de onde parou.']); return true;
      }).catch(() => false);
      if (voltou) anota('luta sem arena, recolocada na tela', await page.evaluate(() => Estado.dados.local).catch(() => ''));
      await page.waitForTimeout(150);
      continue;
    }
    anota('tela sem ação', await page.evaluate(() => document.querySelector('#app').innerText.slice(0, 120)));
    await page.evaluate(() => Exploracao.tela()).catch(() => {});
  }
  if (passos >= 2000000) estado = 'travou';

  /* fim da etapa: o ponto de parada, pra seguir dali (se a jornada não acabou) */
  if (estado === 'pausa' || estado === 'erros' || estado === 'travou'){
    for (let i = 0; i < 40 && await page.evaluate(() => !!(Jogo.encenando || Jogo.animandoBola)).catch(() => false); i++) await page.waitForTimeout(250);
    await gravarPonto();
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
      modoInicial:j.inicial || null,
      inicial:{dex:j.inicialDex, especie:j.inicialDex && DEX[j.inicialDex] ? DEX[j.inicialDex].nome : null,
        agora:ini ? {nome:nomeExib(ini), especie:ini.nome, dex:ini.dex, nivel:ini.nivel} : null},
      time:d.time.map(p => ({dex:p.dex, especie:p.nome, apelido:p.apelido || null, nivel:p.nivel, genero:generoDe(p), natureza:p.natureza,
        golpes:p.golpes.map(g => g.nome), hp:p.hp, hpMax:p.hpMax, moral:p.moral, shiny:!!p.shiny, segurando:p.segurando || null, morto:!!p.morto})),
      pc:(d.pc || []).map(p => ({dex:p.dex, especie:p.nome, nivel:p.nivel, morto:!!p.morto})),
      cemiterio:(d.cemiterio || []).map(p => ({especie:p.nome, nome:nomeExib(p), causa:p.causaMorte})),
      insignias:d.insignias.slice(), dinheiro:j.dinheiro, reputacao:rep ? rep.nome : null, eixo:d.reputacao && d.reputacao.eixo,
      via:d.via || null, linha:typeof linhaAtual === 'function' ? linhaAtual(d) : null, cargos:(d.cargos || []).slice(),
      capitulo:d.capitulo, fechados:(d.capitulosFechados || []).slice(), dia:d.relogio.dia,
      pokedex:{vistos:Object.keys(pd.vistos || {}).length, catalogados:Object.keys(pd.catalogados || {}).length},
      itens:Object.assign({}, d.itens), diario:(d.log || []).slice(-400)};
  }).catch(e => ({erro:e.message}));
  const minutos = jaJogou + (Date.now() - t0) / 60000;
  fs.writeFileSync(OUT, JSON.stringify({estado, minutos, meta, jeito:J.nome, fim, ficha, erros, achados, reg, log, avanco:global.__avanco || null}, null, 1));
  console.log('ESTADO', estado, Math.round(minutos) + ' min');
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
