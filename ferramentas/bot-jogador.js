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
   como quem joga e escolhe isso. INICIAL=classico é um dos três
   clássicos, escolhido no capítulo 1. Sem a variável, fica o padrão da
   ficha.

   O CARGO. CARGO=<id> (um dos CARGOS, em js/data/cargos.js) é o posto
   que o robô quer: quando ele abre (Cargos.estado), o robô anda até o
   lugar dele e assume (Jogo.assumirCargo). O policial pede ter sido
   guarda de rota antes, e ele vai nos dois, na ordem. Outro posto que
   abrir na cidade em que ele está entra na chance do jeito (extras),
   do bem ou do mal, desde que não feche a porta do posto dele.

   O JEITO. JEITO=<chave de JEITOS> escolhe o jeito por fora do objetivo
   da ficha. Além dos números de sempre, o jeito pode puxar a reputação
   nas cenas (rep: a opção que mexe pro lado dele pesa mais, a do outro
   lado pesa menos), a via (via: a opção que define uma delas), dar
   Ração na mão abaixo de uma moral (racaoMoral), andar pela cidade
   (andar) e tentar a Elite mais vezes (eliteVezes). Todo jeito aponta a
   Pokédex pra espécie que ainda não catalogou (escaneia), que não gasta
   o turno, como quem joga faz.

   DEPOIS=1: no final ele aperta "Continuar pela estrada" e segue a
   etapa depois do fim (estado 'depois'), e a etapa retomada de quem já
   passou do fim continua lá.

   A LUTA LONGA. Luta que passa de 30 turnos sai no console (LUTA30, com
   o retrato dos dois lados e os últimos eventos) e no diário (luta30),
   pra quem vigia a jogada olhar se está tudo bem.

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
const DEPOIS = process.env.DEPOIS === '1';
const CAPITULO = +(process.env.CAPITULO || 0);
const SAVE = process.env.SAVE || '';
const RETOMAR = process.env.RETOMAR || '';
const CARGO = process.env.CARGO || '';
/* o que abre a porta do posto, quando a porta é uma cena: o envelope da
   rede só fica no armário pra quem a rede conhece (aRedeConhece, em
   cargos.js), e o jeito de ela conhecer cedo é carregar carga no Monte
   da Lua (c5_aceitou, a flag); a Comissão pede ser conhecido como herói
   ou pesquisador, e a via só se define no capítulo 9; a cadeira da Elite
   sai da oferta da Conselheira no 26 (c21_cargo, Cargos.conceder) */
const PORTA_DO_POSTO = {rocket:{flag:'trabalhou_rocket'}, comissao:{via:['heroi', 'pesquisador']}, elite:{conceder:'elite'}};
const JEITO = process.env.JEITO || '';
const RAIZ = 'file://' + path.resolve(__dirname, '..', 'index.html');

/* O jeito de cada objetivo da ficha (METAS, em rumo.js). Os números:
   cura   — abaixo dessa fração do HP do time, ele volta pra curar;
   abaixo — quantos níveis abaixo da área do próximo capítulo ele aceita seguir;
   moer   — quantas procuras e treinos por capítulo, no máximo, pra chegar lá;
   foge   — selvagem quantos níveis acima do Pokémon dele faz ele fugir;
   captura— 'time' (só até ter seis), 'forte' (o que melhora o time),
            'nova' (toda espécie que a Pokédex ainda não tem);
   lendario — quer o lendário: a Master Ball na hora; sem ela, paralisa
            ou adormece, desce o HP até 1 com o golpe que não derruba e
            joga Ultra Ball (e leva dez na mochila);
   troca  — põe no cinto o melhor que tem no PC;
   pedra  — compra e usa pedra de evolução (o fiel ao time também: ele não
            troca ninguém, mas evolui quem tem; na terceira rodada o
            criador terminou com um Growlithe 39 e um Kadabra 67);
   ginasio— vai atrás de ginásio mesmo sem o capítulo pedir;
   liga   — tenta a Elite quando passa pelo Planalto com as oito;
   desvio — chance de vasculhar ou andar pra um vizinho antes de seguir;
   bolas  — quantas Pokébolas ele quer na mochila;
   gosta  — o que pesa três vezes nas escolhas de cena. */
const JEITOS = {
  /* os da terceira rodada, um por cargo: rep puxa a reputação nas cenas,
     via a via, racaoMoral a Ração na mão, andar o passeio pela cidade,
     extras a chance de assumir outro posto que abrir, eliteVezes as
     idas à ala */
  estudioso: {nome:'Estudioso', cura:.65, abaixo:2, moer:50, foge:8, captura:'nova', lendario:false, troca:true, pedra:true,
    ginasio:false, liga:false, desvio:.1, bolas:10, extras:.1, gosta:/(olhar|pergunt|anot|examin|ler|estud|pokédex|caderno)/i},
  vigilante: {nome:'Vigilante', cura:.65, abaixo:1, moer:60, foge:8, captura:'forte', lendario:false, troca:true, pedra:true,
    ginasio:true, liga:false, desvio:0, bolas:5, rep:'bom', extras:.15, gosta:/(ajud|proteg|vigi|patrulh|avis|denunc|chamar|segur)/i},
  justiceiro: {nome:'Justiceiro', cura:.6, abaixo:1, moer:60, foge:9, captura:'forte', lendario:false, troca:true, pedra:true,
    ginasio:true, liga:false, desvio:0, bolas:5, rep:'bom', via:['heroi'], extras:0, gosta:/(proteg|defend|prend|denunc|enfrent|parar|impedir|salv)/i},
  cuidadoso: {nome:'Cuidadoso', cura:.75, abaixo:1, moer:70, foge:6, captura:'time', lendario:false, troca:false, pedra:true,
    ginasio:false, liga:false, desvio:.05, bolas:5, racaoMoral:72, racao:10, extras:.1, gosta:/(cuid|comida|água|carinho|acalm|time|junt|descans)/i},
  andarilho: {nome:'Andarilho', cura:.55, abaixo:4, moer:30, foge:8, captura:'nova', lendario:false, troca:true, pedra:true,
    ginasio:false, liga:false, desvio:.25, andar:.4, bolas:8, extras:.2, gosta:/(olhar|andar|sub|desc|entrar|segu|explor|atravess|caminh)/i},
  oportunista: {nome:'Oportunista', cura:.5, abaixo:3, moer:40, foge:9, captura:'forte', lendario:true, troca:true, pedra:true,
    ginasio:true, liga:false, desvio:0, bolas:6, rep:'ruim', via:['mercenario', 'foragido'], extras:.6,
    gosta:/(aceit|dinheiro|cobr|vend|pegar|roub|mentir|escond|ameaç|guardar pra|ficar com|descer e conversar|apertar a mão|precisam de gente|carreg)/i},
  curioso: {nome:'Curioso', cura:.6, abaixo:2, moer:50, foge:8, captura:'forte', lendario:false, troca:true, pedra:true,
    ginasio:true, liga:false, desvio:.1, bolas:6, rep:'bom', via:['pesquisador', 'heroi'], extras:.1, gosta:/(pergunt|investig|olhar|entrar|segu|descobr|ler|abrir|conferir)/i},
  pragmatico: {nome:'Pragmático', cura:.6, abaixo:2, moer:50, foge:8, captura:'forte', lendario:false, troca:true, pedra:true,
    ginasio:true, liga:false, desvio:0, bolas:6, rep:'bom', via:['heroi', 'pesquisador'], extras:.3, gosta:/(aceit|assin|acord|negoci|contrato|proposta|conversar|ouvir)/i},
  disciplinado: {nome:'Disciplinado', cura:.65, abaixo:0, moer:110, foge:8, captura:'forte', lendario:false, troca:true, pedra:true,
    ginasio:true, liga:false, desvio:0, bolas:5, extras:.1, gosta:/(trein|ensin|mostr|explic|aula|repet|insist)/i},
  orgulhoso: {nome:'Orgulhoso', cura:.55, abaixo:0, moer:90, foge:10, captura:'forte', lendario:true, troca:true, pedra:true,
    ginasio:true, liga:true, desvio:0, bolas:5, rep:'bom', extras:.1, eliteVezes:8, gosta:/(desafi|enfrent|ganhar|vencer|aceit|mostrar)/i},
  obstinado: {nome:'Obstinado', cura:.6, abaixo:-2, moer:140, foge:10, captura:'forte', lendario:true, troca:true, pedra:true,
    ginasio:true, liga:true, desvio:0, bolas:6, rep:'bom', extras:0, eliteVezes:20, gosta:/(lutar|luta|encar|desafi|trein|vencer|enfrent|ganhar)/i},
  obsessivo: {nome:'Obsessivo', cura:.6, abaixo:2, moer:70, foge:7, captura:'nova', lendario:true, troca:true, pedra:true,
    ginasio:false, liga:false, desvio:.15, bolas:15, extras:.1, gosta:/(pokémon|captur|olhar|anot|pokédex|examin|registr|catalog)/i},
  diplomatico: {nome:'Diplomático', cura:.65, abaixo:1, moer:60, foge:8, captura:'forte', lendario:false, troca:true, pedra:true,
    ginasio:true, liga:false, desvio:.05, bolas:5, rep:'bom', extras:.1, gosta:/(conversa|explic|acalm|negoci|ouvir|convencer|propor|pedir|agradec)/i},
  campeao: {nome:'Competitivo', cura:.6, abaixo:0, moer:80, foge:10, captura:'forte', lendario:true, troca:true, pedra:true,
    ginasio:true, liga:true, desvio:0, bolas:5, gosta:/(lutar|luta|encar|desafi|trein|vencer|enfrent|ganhar)/i},
  pokedex: {nome:'Colecionador', cura:.6, abaixo:2, moer:60, foge:8, captura:'nova', lendario:true, troca:true, pedra:true,
    ginasio:false, liga:false, desvio:.1, bolas:12, gosta:/(pokémon|captur|olhar|pergunt|anot|pokédex|examin)/i},
  heroi: {nome:'Protetor', cura:.7, abaixo:2, moer:60, foge:8, captura:'forte', lendario:false, troca:true, pedra:true,
    ginasio:false, liga:false, desvio:.05, bolas:6, gosta:/(ajud|proteg|defend|salv|levar|socorr|cuid|devolv|tirar eles)/i},
  poder: {nome:'Ambicioso', cura:.5, abaixo:3, moer:40, foge:9, captura:'forte', lendario:true, troca:true, pedra:true,
    ginasio:true, liga:true, desvio:0, bolas:6, gosta:/(aceit|dinheiro|cobr|contrato|negóci|oferta|assin|preço)/i},
  vinculo: {nome:'Fiel ao time', cura:.75, abaixo:1, moer:80, foge:7, captura:'time', lendario:false, troca:false, pedra:true,
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
  /* bola de brinquedo pode (o muro da escola, o menino chutando contra
     o laboratório): a frase com muro, chute ou brinquedo não conta */
  [/(?<![A-Za-zÀ-ÿ-])bolas?(?![A-Za-zÀ-ÿ-])/i, '"bola" sozinha', /muro|chut|brinquedo|borracha|jog(a|o|ar|ando|ou) bola/i]
];

(async () => {
  /* LEVE=1: o navegador pede "menos movimento" (a regra do jogo pra
     prefers-reduced-motion corta toda animação de CSS em loop) e pinta sem
     a GPU emulada. Cinco robôs juntos, sem isso, punham a máquina com
     carga 15 em quatro núcleos só desenhando o que ninguém olha. A
     partida é a mesma: muda a pintura, não a conta */
  const LEVE = process.env.LEVE === '1';
  /* o headless shell é o navegador sem a casca de janela: no LEVE, com
     quinze robôs na fila, metade da máquina ia pros processos de GPU
     recompondo tela que ninguém vê */
  const SHELL = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
  const browser = await chromium.launch({ executablePath:LEVE && fs.existsSync(SHELL) ? SHELL : '/opt/pw-browsers/chromium',
    args:['--no-sandbox'].concat(LEVE ? ['--disable-gpu'] : []) });
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
  /* cena sem saída o jogo não deixa quebrar: avisa no console */
  page.on('console', m => { if (m.type() === 'error' && /Cena sem saída|Continuar retomado/.test(m.text())) console.log('ACHADO', m.text());
    /* luta de ginásio e da Elite saem na hora, pra quem vigia a jogada */
    else if (m.type() === 'info' && /^LUTA /.test(m.text())) console.log(m.text()); });
  page.on('pageerror', e => { const m = e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | ');
    erros.push(m); console.log('ERRO JS', m.slice(0, 300)); });
  page.on('dialog', d => /Soltar|permanente|Vender|Largar/.test(d.message()) ? d.dismiss() : d.accept());
  /* espera sem prazo é robô preso: o page.evaluate não tem tempo limite,
     e uma função do jogo que devolve promessa que nunca se cumpre (uma
     janela esperando o clique que o robô, esperando, nunca dá) prende a
     jogada com a página parada. O comissao da quinta rodada travou assim
     no Planalto, numa luta, e o vigia pausou uma página que não rodava
     nada ("sem pilha"). Passou de 60 s, o robô pergunta se a página
     responde: respondendo, a espera desiste, anota qual função era e o
     laço segue; sem resposta, é laço de verdade, e quem cuida é o vigia */
  {
    const ev = page.evaluate.bind(page);
    page.evaluate = (fn, arg) => {
      let t;
      const limite = new Promise((_, rej) => { t = setTimeout(async () => {
        const viva = await Promise.race([ev(() => 1).then(() => true, () => false), new Promise(r => setTimeout(() => r(false), 5000))]);
        if (!viva) return;
        const qual = String(fn).replace(/\s+/g, ' ').slice(0, 160);
        anota('espera longa', qual);
        rej(new Error('evaluate passou de 60 s: ' + qual));
      }, 60000); });
      return Promise.race([ev(fn, arg), limite]).finally(() => clearTimeout(t));
    };
  }
  await page.goto(RAIZ);
  /* o depurador fica ligado desde o começo: com a página presa num laço
     sem fim, o Debugger.enable não é atendido (espera a vez da página),
     e o Debugger.pause, com ele ligado, interrompe o laço. Custa uns
     0,15 ms por evaluate (medido: 20 mil em 10 s sem, 13 s com) e o
     teto do cache de scripts segura a memória */
  const cdpVigia = await page.context().newCDPSession(page).catch(() => null);
  if (cdpVigia) await cdpVigia.send('Debugger.enable', {maxScriptsCacheSize:1e6}).catch(() => {});
  /* TESTE_TRAVA=s prende a página num laço sem fim depois de s segundos:
     é como se confere o vigia */
  if (+process.env.TESTE_TRAVA) await page.evaluate(s => { setTimeout(function lacoDeTeste(){ for (;;){} }, s * 1000); }, +process.env.TESTE_TRAVA).catch(() => {});
  /* no LEVE a arte é a parada, como no artefato: a GIF animada da luta
     repinta a arena o tempo todo, e com seis robôs a máquina parava. O
     jogo cai sozinho na arte parada quando não tem GIF (imgSprite) */
  if (LEVE) await page.evaluate(() => { window.caminhoSpriteAni = () => null; }).catch(() => {});
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

  /* o jeito sai do objetivo que ficou na ficha, ou de JEITO= */
  const meta = await page.evaluate(() => Estado.j.meta || null).catch(() => null);
  const J = JEITOS[JEITO] || JEITOS[meta] || NEUTRO;
  console.log('JEITO', meta, JEITO || '-', J.nome, CARGO ? 'cargo ' + CARGO : '');

  /* o que aconteceu, pra conferir depois (na etapa seguinte, continua) */
  await page.evaluate(({antes, jeito}) => {
    window.__reg = (antes && antes.reg) || {lutas:[], caps:[], gastos:{}, passos:[]};
    window.__treinos = (antes && antes.treinos) || {};
    window.__extra = (antes && antes.extra) || {};
    window.__jeito = jeito;
    /* a linha de evolução de um Pokémon (a forma de baixo dela): dois da
       mesma linha no cinto são dois iguais, ou vão ser — o Oddish e o
       Gloom viram dois Vileplume. Os dois Nidoran são linhas diferentes
       aqui (o Nidoking não é o Nidoqueen), ao contrário do raizDaLinha do
       jogo, que junta os dois pra formar par. Na terceira rodada um robô
       terminou com dois Victreebel e dois Gengar, e outros três com um
       Raticate, um Beedrill ou um Vileplume repetido */
    window.__linha = dex => {
      let x = (typeof BEBE_DE !== 'undefined' && BEBE_DE[dex]) || dex, g = 0;
      while (DEX[x] && DEX[x].preEvo && g++ < 5) x = DEX[x].preEvo;
      return x;
    };
    /* quem do cinto (vivo, menos `fora`) já é da linha desse dex */
    window.__daLinha = (dex, fora) => Estado.dados.time.find(x => !x.morto && x.uid !== fora && __linha(x.dex) === __linha(dex)) || null;
    /* o ginásio do posto (defesa.js): o tipo do ginásio que o robô escolhe
       (o que mais enche os escalões com o que ele já tem, e o que mais
       anda no mato) e, depois, o escalão que ainda falta gente */
    window.__tipoDoGinasio = () => {
      const livres = Defesa.tiposLivres(), g = Defesa.meuGinasio(), meus = Defesa.meusPokemon();
      /* quantas espécies do tipo andam no mato, e quantas num lugar de
         nível baixo: é dali que sai o time dos escalões de baixo */
      const baixo = {}, todo = {};
      for (const k in ENCONTROS){
        const nv = (LOCAIS[k] || {}).nivel || 5;
        for (const [dex] of ENCONTROS[k]) ((DEX[dex] || {}).tipos || []).forEach(t => {
          (todo[t] = todo[t] || new Set()).add(dex);
          if (nv <= 16) (baixo[t] = baixo[t] || new Set()).add(dex);
        });
      }
      const nota = t => {
        let n = 0;
        for (let k = 0; k <= 7; k++){ const R = Defesa.regra(g, k); n += Math.min(R.tam, meus.filter(p => (p.tipos || []).includes(t) && p.nivel <= R.nivel).length); }
        return n * 2 + (baixo[t] ? baixo[t].size : 0) * 4 + Math.min(10, todo[t] ? todo[t].size : 0);
      };
      return livres.slice().sort((a, b) => nota(b) - nota(a))[0];
    };
    /* o que falta na casa: por escalão, quantos bons ainda faltam. Bom é
       quem serve e está a até oito níveis do teto: o Rattata 9 serve
       contra quem tem seis insígnias, mas desce pra perder (a Líder,
       com o ginásio de Normal, ganhou 6 de 39 assim) */
    window.__faltaBoa = () => {
      const g = Defesa.meuGinasio();
      if (!Defesa.tipoDoGinasio() || !g) return [];
      const out = [];
      for (let k = 0; k <= 7; k++){
        const R = Defesa.regra(g, k), bons = Defesa.aptos(k).filter(p => p.nivel >= R.nivel - 8).length;
        if (bons < R.tam) out.push({n:k, cap:R.nivel, faltam:R.tam - bons});
      }
      return out;
    };
    /* onde caçar: o escalão de teto mais baixo que ainda falta gente vem
       primeiro (Pokémon só sobe de nível), num lugar com o tipo e com o
       mato perto do teto; vale o primeiro escalão que tem lugar assim */
    window.__ondeCacar = () => {
      const T = Defesa.tipoDoGinasio();
      if (!T) return [];
      for (const f of __faltaBoa()){
        const l = Object.keys(ENCONTROS).filter(x => {
          const nv = (LOCAIS[x] || {}).nivel || 5;
          return LOCAIS[x] && nv <= f.cap - 1 && nv >= f.cap - 10 && ENCONTROS[x].some(([dex]) => ((DEX[dex] || {}).tipos || []).includes(T));
        });
        if (l.length) return l;
      }
      return [];
    };
    /* a caixa-preta da janela: quem abriu e quem fechou as últimas, com
       de onde veio o fechar, e o erro que a cadeia do fim da luta jogou
       (o robô chama muita coisa por dentro de um evaluate que engole o
       erro). Dois robôs pararam com o Continuar morto na tela e a
       janela da evolução fechada sem ninguém ver por quê */
    if (!UI.__caixaPreta){
      UI.__caixaPreta = true;
      const nota = t => { window.__modais = (window.__modais || []).slice(-7); window.__modais.push(t); };
      const abre = UI.modal, fecha = UI.fecharModal;
      UI.modal = function(t, h, s, c){ nota('abre ' + (c || '-') + ' ' + String(t || '').slice(0, 24)); return abre.apply(this, arguments); };
      UI.fecharModal = function(){ const m = document.getElementById('modal');
        if (m) nota('fecha ' + ((m.querySelector('.modal') || {}).className || '?') + ' ← ' + String(new Error().stack || '').split('\n').slice(2, 5).map(s => s.trim().replace(/^at /, '').replace(/\(file:.*\/js\//, '(')).join(' < '));
        return fecha.apply(this, arguments); };
      for (const [o, n] of [[Jogo, 'seguirDoFim'], [Jogo, 'resolverEvolucoes'], [Jogo, 'resolverApelidos'], [Jogo, 'resolverGolpes'], [Jogo, 'finalizarBatalha'], [Jogo, 'darApelido'], [UI, 'responderGolpe']]){
        const f = o[n]; if (typeof f !== 'function') continue;
        o[n] = function(){ try { return f.apply(this, arguments); } catch(e){
          (window.__errosJogo = (window.__errosJogo || []).slice(-4)).push(n + ': ' + e.message + ' @ ' + String(e.stack || '').split('\n').slice(1, 3).map(s => s.trim()).join(' | '));
          throw e; } };
      }
    }
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
      /* o posto que se defende (defesa.js): quem desafiou, onde e o degrau
         da fama da quadra em que ele marcou (pro relatório medir a escada) */
      if (J.defesaAtual){ const x = ((typeof Defesa !== 'undefined' && Defesa.estado(J.defesaAtual.tipo)) || {}).desafio || {};
        return {de:'defesa', nome:J.defesaAtual.tipo === 'elite' ? 'a sua porta da ala' : 'o seu ginásio, ' + J.defesaAtual.ginasio, quem:J.defesaAtual.quem,
          tipo:J.defesaAtual.tipo, fama:x.fama != null ? x.fama : null, ins:x.ins != null ? x.ins : null,
          tipoGinasio:J.defesaAtual.tipo === 'lider' ? Defesa.tipoDoGinasio() : null, batalharam:J.defesaAtual.tipo === 'lider' ? Estado.dados.time.length : null}; }
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
    /* o telefone: cada rolagem do PokéNav soma na conta (rolou), e cada
       toque vira um passo, com o tipo (ligacao, recado, pedido, prazo ou
       a chamada escrita) e se o aparelho estava no silencioso. O toque
       que esperou a luta passa duas vezes pelo tocarOuGuardar e conta
       uma. Quem mede a frequência lê daqui (tel e os passos 'toque') */
    __reg.tel = __reg.tel || {rolou:0, tocou:0};
    const tv = Jogo.talvezToque.bind(Jogo);
    Jogo.talvezToque = function(){
      const pode = Estado.temPokenav() && !Jogo.chamadaAdiada && (Chamadas.disponiveis().length > 0
        || (typeof Recados !== 'undefined' && Recados.candidatos(Estado.dados.relogio.periodo === 'madrugada').length > 0));
      if (pode) __reg.tel.rolou++;
      return tv();
    };
    const vistos = new WeakSet();
    const tg = Jogo.tocarOuGuardar.bind(Jogo);
    Jogo.tocarOuGuardar = function(toque){
      if (toque && typeof toque === 'object' && !vistos.has(toque)){
        vistos.add(toque); __reg.tel.tocou++;
        passo('toque', {tipo:toque.recados || 'escrita', quem:toque.de || toque.contato || toque.id || null,
          silencio:typeof Recados !== 'undefined' && Recados.silencioso(), periodo:Estado.dados.relogio.periodo});
      }
      return tg(toque);
    };
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
        if (cx.de === 'ginásio' || cx.de === 'Liga')
          console.info(`LUTA ${cx.de} · ${cx.lider || cx.nome} · ${fim.resultado} · cap ${d.capitulo} · dia ${d.relogio.dia} · ${vivos.map(p => p.nivel).join('/')}`);
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
  /* o posto que ele quer, e a conta das lutas (pra o aviso da luta longa) */
  await page.evaluate(c => {
    window.__cargo = c || null;
    /* a conta segue de uma etapa pra outra, porque as marcas da luta
       longa guardadas no __extra usam ela, e a marca de "já contando"
       mora na janela. No Batalha ela ia junto na foto da luta salva:
       a etapa que começava no meio de uma luta achava a marca, não
       armava o contador, e todas as lutas dela tinham o mesmo número,
       então a luta longa avisava uma vez por etapa (255 de 484 sem
       aviso na terceira rodada) */
    window.__lutaN = window.__lutaN || (window.__extra || {}).lutaN || 0;
    if (!window.__contandoLutas){
      const bi = Batalha.iniciar.bind(Batalha);
      Batalha.iniciar = function(){ (window.__extra || (window.__extra = {})).lutaN = ++window.__lutaN; return bi.apply(Batalha, arguments); };
      window.__contandoLutas = true;
    }
    /* de onde a luta veio, pro retrato da luta longa */
    window.__contextoDaLuta = () => {
      const J = Jogo, d = Estado.dados;
      if (J.ginasioAtual) return 'ginásio ' + J.ginasioAtual.id;
      if (J.defesaAtual) return 'defesa ' + (J.defesaAtual.tipo === 'elite' ? 'da porta' : 'do ginásio ' + J.defesaAtual.ginasio) + ' · ' + J.defesaAtual.quem;
      if (J.patrulhaAtual) return 'patrulha';
      if (J.redeAtual) return 'rede ' + J.redeAtual.tipo + ' ' + J.redeAtual.id;
      if (J.veteranoAtual) return 'veterano ' + (J.veteranoAtual.tipo || '') + ' ' + (J.veteranoAtual.id || '');
      if (J.torneioAtual) return 'torneio';
      if (J.conferenciaAtual) return 'conferência';
      if (J.eliteAtual) return J.eliteAtual.campeao ? 'campeão' : 'elite ' + J.eliteAtual.indice;
      if (d.modo === 'cena') return 'cena ' + d.capitulo + ':' + d.cena;
      return 'mapa ' + d.local;
    };
    /* o posto que ele assumiu (por ele ou por cena) vai pro diário */
    const ca = Cargos.assumir.bind(Cargos);
    Cargos.assumir = function(id){ const r = ca(id);
      if (r && r.ok) window.__passo && __passo('posto', {cargo:id, nome:(Cargos.porId(id) || {}).nome, alvo:id === window.__cargo});
      return r; };
    const cl = Cargos.largar.bind(Cargos);
    Cargos.largar = function(id){ const r = cl(id); if (r) window.__passo && __passo('largou', {cargo:id}); return r; };
    /* a Pokédex Nacional, por onde vier */
    if (typeof DexNacional !== 'undefined'){
      const dl = DexNacional.liberar.bind(DexNacional);
      DexNacional.liberar = function(como){ const r = dl(como); if (r) window.__passo && __passo('nacional', {como:como || null}); return r; };
    }
  }, CARGO).catch(e => console.log('ERRO no cargo', e.message));

  const lerTela = async () => {
    const t = await page.evaluate(() => {
      const partes = [...document.querySelectorAll('#app .narrativa, #app .avisos, #modal, #app .cap-cabecalho, #log')]
        .map(e => e.innerText);
      const anon = [...document.querySelectorAll('.fala.anonima')].length;
      return {txt:partes.join('\n'), anon};
    }).catch(() => ({txt:'', anon:0}));
    for (const [re, nome, menos] of SUSPEITO){
      const txt = menos ? t.txt.split(/(?<=[.!?])\s+/).filter(f => !menos.test(f)).join(' ') : t.txt;
      const m = txt.match(re);
      if (m){ const i = txt.indexOf(m[0]); anota(nome, txt.slice(Math.max(0, i - 60), i + 60).replace(/\s+/g, ' ')); }
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
  /* PARAR_<nome da saída> para só este robô */
  const PARAR_ESTE = path.join(path.dirname(OUT), 'PARAR_' + path.basename(OUT, '.json'));
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
  let passos = 0, parado = 0, ultima = '', empacou = 0, ultimoRetrato = '', estado = 'pausa', depoisFeito = false, falhasContinuar = 0;
  /* quem já está depois do fim (etapa retomada) segue nele */
  if (await page.evaluate(() => !!(Estado.dados && Estado.dados.depoisDoFim)).catch(() => false)){ depoisFeito = true; estado = 'depois'; }
  let ultimoMinuto = Date.now(), ultimoMinutoK = '', mesmoMinuto = 0, ultimaAcao = '';
  const prazo = MIN * 60000;
  /* o vigia da página: volta do laço que não termina em 150 s é a página
     presa num laço sem fim (o comissao da quarta rodada ficou uma hora
     assim, sem um retrato, e a rodada esperando). Pausa o depurador,
     guarda a pilha e o que o jogo tinha na mão, mata o laço
     (terminateExecution) e a etapa acaba sem gravar o ponto: a próxima
     segue do último bom */
  let ultimoPasso = Date.now(), travouPagina = 0, vigiando = false;
  const vigia = setInterval(async () => {
    if (vigiando || travouPagina || Date.now() - ultimoPasso < 150000) return;
    vigiando = true;
    const tempo = (pr, ms) => Promise.race([pr.catch(() => null), new Promise(r => setTimeout(() => r(null), ms))]);
    let pilha = 'sem pilha', jogo = null;
    try {
      const cdp = cdpVigia;
      if (!cdp) throw new Error('sem sessão do depurador');
      const pausou = new Promise(r => cdp.once('Debugger.paused', r));
      await tempo(cdp.send('Debugger.pause'), 15000);
      const ev = await tempo(pausou, 20000);
      if (ev && ev.callFrames && ev.callFrames.length){
        pilha = ev.callFrames.slice(0, 16).map(f => `${f.functionName || '(anônima)'} ${(f.url || '').split('/').pop()}:${f.location.lineNumber + 1}:${f.location.columnNumber + 1}`).join(' ← ');
        const r = await tempo(cdp.send('Debugger.evaluateOnCallFrame', {callFrameId:ev.callFrames[0].callFrameId, returnByValue:true,
          expression:'JSON.stringify({c:Estado.dados.capitulo, l:Estado.dados.local, cena:Estado.dados.cena, modo:Estado.dados.modo, luta:!!Batalha.ativo, turno:Batalha.turno, tipo:Batalha.tipo, '
            + 'aliado:Batalha.aliado && (Batalha.aliado.nome + " " + Batalha.aliado.hp + "/" + Batalha.aliado.hpMax), inimigo:Batalha.inimigo && (Batalha.inimigo.nome + " " + Batalha.inimigo.hp + "/" + Batalha.inimigo.hpMax), '
            + 'ultimos:(Batalha.log || []).slice(-10).map(e => typeof e === "string" ? e : (e.tipo + ": " + (e.texto || e.msg || "")))})'}), 15000);
        jogo = r && r.result ? r.result.value : null;
        await tempo(cdp.send('Runtime.terminateExecution'), 10000);
        await tempo(cdp.send('Debugger.resume'), 10000);
      } else await tempo(cdp.send('Runtime.terminateExecution'), 10000);
    } catch (e) { pilha += ' (vigia: ' + e.message + ')'; }
    travouPagina++;
    const m = 'página travou num laço sem fim: ' + pilha + (jogo ? ' :: ' + jogo : '');
    erros.push(m); console.log('ERRO JS', m.slice(0, 1500));
    anota('página travou', pilha.slice(0, 300));
    ultimoPasso = Date.now(); vigiando = false;
  }, 20000);
  while (passos++ < 2000000){
    ultimoPasso = Date.now();
    if (travouPagina){ estado = 'travou'; break; }
    try {
    const passou = Date.now() - t0;
    if (passou >= prazo){
      /* o tempo acabou: a luta que está andando termina antes (até 3 minutos) */
      const emLuta = await page.evaluate(() => !!Batalha.ativo).catch(() => false);
      if (!emLuta || passou >= prazo + 180000) break;
    }
    if (erros.length > 8){ estado = 'erros'; break; }
    if (fs.existsSync(PARAR) || fs.existsSync(PARAR_ESTE)){ console.log('PARAR pedido'); break; }
    await page.waitForTimeout(30);
    /* um retrato por minuto, aconteça o que acontecer: se ele parar no
       meio de uma encenação, é aqui que aparece (o de 200 em 200 passos
       fica depois da espera e não sai) */
    if (Date.now() - ultimoMinuto > 60000){
      ultimoMinuto = Date.now();
      /* o turno entra no retrato: luta longa andando não é tela parada
         (a Comissão 2 deu "parado 3 minutos" no turno 29 de uma luta que
         seguia, e o retrato só tinha o alto da tela) */
      const m = await page.evaluate(() => ({c:Estado.dados.capitulo, l:Estado.dados.local, modo:Estado.dados.modo, cena:Estado.dados.cena,
        luta:!!Batalha.ativo, turno:Batalha.ativo ? Batalha.turno : null, enc:!!Jogo.encenando, bola:!!Jogo.animandoBola, modal:!!document.querySelector('#modal'),
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
        aoContinuar:!!UI._aoContinuar, adiada:!!Jogo.chamadaAdiada, apelidar:(Estado.dados.apelidar || []).length,
        evoPendente:(Estado.dados.time || []).filter(p => p.evoPendente).map(p => p.nome + '→' + p.evoPendente),
        modais:window.__modais || [], errosJogo:window.__errosJogo || [],
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
      /* empacou: o mesmo retrato três vezes seguidas é tela que não anda.
         A cena entra no retrato: na cena de capítulo o relógio para, e o
         alto da tela (que é o começo do texto) fica igual enquanto as
         cenas andam; o conselheiro da quinta rodada "empacou" assim no 15,
         andando pelo mirante, pelo capinzal e pelo encontro com o trio */
      const cenaAgora = await page.evaluate(() => Estado.dados.modo === 'cena' ? Estado.dados.cena : null).catch(() => null);
      const retrato = JSON.stringify([s.c, s.l, s.t, s.$, s.luta, cenaAgora, s.tela.replace(/\d+h · \S+ do dia \d+/, '')]);
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
      /* DEPOIS=1: o final tem "Continuar pela estrada", e ele continua,
         como quem quer ver o que o fim deixou (a casa fechada, a licença
         suspensa, a Patrulha). A etapa segue no mapa, e a saída diz
         'depois' */
      if (DEPOIS && !depoisFeito && await page.evaluate(() => !!document.querySelector('.final [onclick*="continuarPelaEstrada"]')).catch(() => false)){
        depoisFeito = true; estado = 'depois';
        await page.evaluate(() => Jogo.continuarPelaEstrada()).catch(e => erros.push('continuar pela estrada: ' + e.message));
        await page.evaluate(() => { const s = typeof Depois !== 'undefined' && Depois.situacaoAgora ? Depois.situacaoAgora() : null;
          window.__passo && __passo('depois', {situacao:s, dados:Estado.dados.depoisDoFim || null}); }).catch(() => {});
        await page.waitForTimeout(200);
        continue;
      }
      estado = 'final';
      break;
    }

    /* o PokéNav tocando: atende e guarda o aparelho antes de qualquer
       outra coisa. Com a chamada aberta por cima do mapa o robô decidia o
       mapa por baixo e nunca chegava na janela: na segunda rodada três
       ficaram dez minutos com o aparelho tocando. O clique é pela página,
       sem a espera do Playwright, e só nas respostas da ligação
       (.nav-respostas não existe fora dela) */
    const ligacao = await page.evaluate(() => {
      const r = document.querySelector('#modal .nav-respostas');
      if (!r) return null;
      const fim = r.querySelector('.nav-fim');
      if (fim){ fim.click(); return {fim:true}; }
      const ops = [...r.querySelectorAll('.nav-acao')];
      if (!ops.length) return null;
      const atende = ops.filter(b => !b.classList.contains('recusar'));
      /* quem joga também deixa tocar: a ligação à toa (id rec_), uma vez
         em seis; a da história ele atende sempre */
      const recusa = ops.find(b => b.classList.contains('recusar'));
      const aToa = !!r.querySelector('[onclick*="rec_"]');
      const pool = (aToa && recusa && Math.random() < 1 / 6) ? [recusa] : (atende.length ? atende : ops);
      const b = pool[Math.floor(Math.random() * pool.length)];
      const t = b.innerText.replace(/\s+/g, ' ').trim();
      b.click();
      return {resposta:t};
    }).catch(() => null);
    if (ligacao){
      if (ligacao.resposta) await page.evaluate(x => window.__passo && __passo('chamada', {resposta:x.slice(0, 120)}), ligacao.resposta).catch(() => {});
      await page.waitForTimeout(80);
      continue;
    }

    /* entre uma porta da Elite e outra não tem Centro: quem joga abre a
       mochila (Revive em quem caiu, a Potion mais forte em quem está
       abaixo de 60%, Full Heal ou Antidote na condição) e só então abre a
       porta seguinte. Sem isso o robô entrava na segunda porta com o time
       que sobrou da primeira, e caía sempre nela */
    const entrePortas = await page.evaluate(() => {
      const b = document.querySelector('#app [onclick="Jogo.continuarElite()"]');
      if (!b || document.querySelector('#modal')) return null;
      const usados = [], tem = n => Estado.contaItem(n) > 0;
      const usa = (n, p) => { UI.aplicarItemFora(n, p.uid); UI.fecharModal(true); usados.push(n); };
      for (const p of Estado.dados.time){
        if (p.morto) continue;
        /* o Max Revive levanta inteiro: é aqui, entre as portas, que ele vale */
        if (p.hp <= 0){ const r = ['Max Revive', 'Revive'].find(tem); if (r) usa(r, p); }
        if (p.hp > 0 && p.status){
          const s = tem('Full Heal') ? 'Full Heal' : (p.status === 'veneno' && tem('Antidote')) ? 'Antidote' : tem('Full Restore') ? 'Full Restore' : null;
          if (s) usa(s, p);
        }
        for (let v = 0; v < 6 && p.hp > 0 && p.hp < p.hpMax * 0.6; v++){
          const pot = ['Hyper Potion', 'Max Potion', 'Full Restore', 'Super Potion', 'Potion'].find(tem);
          if (!pot) break;
          usa(pot, p);
        }
      }
      b.click();
      return usados;
    }).catch(() => null);
    if (entrePortas){
      if (entrePortas.length) await page.evaluate(x => window.__passo && __passo('mochila', {entre_portas:x.join(', ')}), entrePortas).catch(() => {});
      await page.waitForTimeout(120);
      continue;
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
    /* golpe novo com quatro na cabeça: esquece o mais fraco (força vezes
       precisão; golpe de status vale pouco), ou não aprende se o novo for
       o pior de todos. Antes ele esquecia sempre o primeiro da lista */
    /* só a pergunta que ainda espera resposta: respondida, os botões
       ficam na barra da luta até ela ser redesenhada, e com a troca
       obrigatória aberta por cima (o Pidgey do Guarda de rota caiu no
       mesmo turno em que o Dugtrio quis o Earthquake) o robô respondia
       a pergunta morta pra sempre e nunca chegava na troca */
    if (await page.locator('.aprender-op').count() && await page.evaluate(() => !!UI._respostaGolpe).catch(() => false)){
      await page.evaluate(() => {
        const valor = n => { const x = GOLPES[n] || {}; return x.c === 'status' ? 10 : (x.p || 40) * ((x.a > 100 ? 100 : (x.a || 100)) / 100); };
        const nome = el => ((el.querySelector('.gc-nome') || {}).innerText || '').trim();
        const novo = nome(document.querySelector('.aprender-novo') || document.body);
        const ops = [...document.querySelectorAll('.aprender-op')].map(nome);
        let pior = 0; ops.forEach((n, i) => { if (valor(n) < valor(ops[pior])) pior = i; });
        UI.responderGolpe(novo && valor(novo) <= valor(ops[pior]) ? -1 : pior);
      }).catch(() => {});
      continue;
    }
    if (await page.locator('#modal .time-linha:not([disabled])').count() && await page.evaluate(() => Batalha.ativo).catch(() => false)){
      await page.locator('#modal .time-linha:not([disabled])').first().click({timeout:3000}).catch(() => {}); continue;
    }
    /* o Continuar do fim da luta fica na barra de ações, e a evolução e o
       golpe novo abrem por cima dele: com janela aberta, quem responde é
       ela. Antes o robô clicava no Continuar coberto, esperava 3 s e
       tentava de novo pra sempre (20 minutos na evolução do Caterpie) */
    /* o clique que não pega: três robôs da quarta rodada ficaram meia
       hora com o Continuar na tela e o clique esbarrando em alguma coisa
       (o callback ainda armado, nenhuma janela aberta). Na segunda falha
       seguida ele anota o motivo do Playwright, o que está por cima do
       botão e a foto da tela, e aperta pelo jogo (UI.continuarBatalha) */
    if (!(await page.locator('#modal').count()) && await page.locator('.continuar-batalha').count()){
      /* o mouse parado na última linha de pixels de um botão que sobe 1 px
         no hover faz o botão tremer pra sempre (sobe, sai de baixo do
         mouse, desce, volta), e o Playwright não clica em botão que treme
         ("element is not stable"). O mouse sai pro canto antes */
      await page.mouse.move(1, 1).catch(() => {});
      const r = await page.locator('.continuar-batalha').first().click({timeout:3000}).then(() => true)
        .catch(e => String(e.message || e).split('\n').filter(l => /intercepts|visible|viewport|stable|enabled|Timeout/.test(l)).slice(0, 3).join(' | '));
      if (r === true) falhasContinuar = 0;
      else if (++falhasContinuar >= 2){
        falhasContinuar = 0;
        const diag = await page.evaluate(() => {
          const b = document.querySelector('.continuar-batalha'), a = document.getElementById('acoes');
          if (!b) return {sumiu:true};
          const q = b.getBoundingClientRect(), cs = getComputedStyle(b), em = document.elementFromPoint(q.x + q.width / 2, q.y + q.height / 2);
          const quem = el => el ? (el.tagName + (el.id ? '#' + el.id : '') + '.' + String(el.className || '').trim().replace(/\s+/g, '.')).slice(0, 80) : null;
          return {acoes:a ? a.className : null, pe:cs.pointerEvents, vis:cs.visibility, op:cs.opacity, rect:[q.x, q.y, q.width, q.height].map(Math.round),
            tela:[innerWidth, innerHeight, Math.round(scrollY)], emCima:quem(em), paiDeCima:quem(em && em.parentElement), ao:!!UI._aoContinuar,
            fim:!!Jogo.fimPendente, enc:!!Jogo.encenando, bola:!!Jogo.animandoBola};
        }).catch(e => ({erro:e.message}));
        anota('continuar sem clique', JSON.stringify(Object.assign({motivo:r}, diag)));
        console.log('CONTINUAR SEM CLIQUE', r, JSON.stringify(diag));
        await page.screenshot({path:OUT.replace(/\.json$/, '') + '.continuar.png'}).catch(() => {});
        await page.evaluate(() => UI.continuarBatalha()).catch(() => {});
      }
      await page.waitForTimeout(80); continue;
    }
    if (await page.locator('#modal .evo').count()){
      if (await page.locator('#evo-seguir:visible').count()) await page.locator('#evo-seguir').click({timeout:3000}).catch(() => {}); else await page.waitForTimeout(300);
      continue;
    }

    /* a leitura da Pokédex tem tela própria, que se anima e depois mostra
       a ficha com o "Fechar a Pokédex": espera a ficha */
    if (await page.locator('#modal #dex-scan').count()){ await page.waitForTimeout(150); continue; }
    /* luta que passa de 30, 60 e 100 turnos: o retrato sai no console e no
       diário, uma vez por marca, pra quem vigia olhar se está tudo bem */
    const longa = await page.evaluate(() => {
      const B = Batalha, X = window.__extra || (window.__extra = {});
      if (!B.ativo) return null;
      const marca = B.turno >= 100 ? 100 : B.turno >= 60 ? 60 : B.turno >= 30 ? 30 : 0;
      const k = window.__lutaN + ':' + marca;
      if (!marca || (X.longas || []).includes(k)) return null;
      X.longas = (X.longas || []).slice(-20).concat(k);
      const f = p => p ? {nome:p.nome, nv:p.nivel, hp:p.hp + '/' + p.hpMax, st:p.status || null, vontade:typeof vontadeDe === 'function' ? vontadeDe(p) : null,
        golpes:(p.golpes || []).map(g => g.nome)} : null;
      const r = {marca, turno:B.turno, tipo:B.tipo, ctx:window.__contextoDaLuta ? window.__contextoDaLuta() : null, treinador:B.treinador || null,
        aliado:f(B.aliado), inimigo:f(B.inimigo), restamDeLa:(B.timeInimigo || []).filter(x => x.hp > 0).length,
        restamDeCa:Estado.dados.time.filter(x => !x.morto && x.hp > 0).length, clima:B.clima ? B.clima.tipo : null,
        ultimos:(B.eventos || []).slice(-8).map(e => e.tipo + ': ' + String(e.texto || '').slice(0, 110))};
      window.__passo && __passo('luta30', r);
      return r;
    }).catch(() => null);
    if (longa){
      console.log('LUTA' + longa.marca, JSON.stringify(longa));
      anota('luta passou de ' + longa.marca + ' turnos', `${longa.tipo} ${longa.treinador || ''} · ${longa.aliado && longa.aliado.nome} x ${longa.inimigo && longa.inimigo.nome}`);
    }

    /* luta: lê a situação e decide (com janela aberta, quem responde é ela) */
    if (await page.evaluate(() => Batalha.ativo && !!document.querySelector('.acoes-combate, #acoes') && !document.querySelector('#modal')).catch(() => false)){
      const a = await page.evaluate(() => {
        const B = Batalha, p = B.aliado, alvo = B.inimigo, d = Estado.dados;
        const J = window.__jeito || {}, X = window.__extra || (window.__extra = {});
        if (!p || !alvo) return null;
        /* luta nova: zera a conta de Pokébolas jogadas e de trocas */
        /* se a espécie era nova vale pela entrada dela, antes da Pokédex
           apontada catalogar: lida depois, ela nunca era nova, e o robô
           não jogava Pokébola em espécie nova nem em lendário */
        if (X.lutaUid !== alvo.uid){ X.lutaUid = alvo.uid; X.bolasNaLuta = 0; X.trocasNaLuta = 0; X.turnoDesde = B.turno; X.condLenda = 0; X.bolasFracas = 0;
          X.novoNaLuta = !((Estado.pdex().catalogados || {})[alvo.dex]); }
        if (B.fase === 'ameaca') return {tipo:'fugirAmeaca'};
        /* a Pokédex na espécie que ainda não catalogou: não gasta o turno,
           e é assim que a Pokédex enche sem capturar tudo */
        if (J.escaneia !== false && d.flags.tem_pokedex && !B.pdexUsada && !Estado.conheceu(alvo.dex)) return {tipo:'pokedex'};
        /* selvagem que não acaba (os dois lados só com golpe de status): vai embora */
        if (B.tipo === 'selvagem' && B.turno > 60 && B.fuga !== false) return {tipo:'fugir'};
        /* luta que não acaba: depois de 150 turnos contra treinador, desiste
           (como gente faria); depois de 60, varia o golpe pra sair do laço */
        if (B.tipo === 'treinador' && B.turno > 150) return {tipo:'desistir'};
        /* ninguém fere ninguém (golpe Normal contra Fantasma dos dois
           lados: o Meowth de um robô e um Gastly ficaram oitenta turnos sem
           tirar um ponto de HP). Doze turnos com os dois HP parados e os
           mesmos dois em campo, quem joga desiste da luta de treinador e
           foge da selvagem; a troca pra quem acerta, se tiver, vem antes,
           pela regra do banco lá embaixo */
        /* a Pokébola jogada e a condição tentada contam como andamento:
           com o lendário a 1 de HP, o HP fica parado enquanto as Ultra
           Balls voam, e doze turnos assim faziam o robô fugir */
        const marca = [p.uid, p.hp, alvo.uid, alvo.hp, X.bolasNaLuta || 0, X.condLenda || 0].join('/');
        if (X.marcaLuta !== marca){ X.marcaLuta = marca; X.marcaTurno = B.turno; }
        else if (B.turno - (X.marcaTurno || B.turno) >= 12){
          X.marcaTurno = B.turno;
          if (B.tipo === 'treinador'){
            /* desistir custa 5 de moral ao time inteiro e conta derrota, e
               quem te parou na estrada para de novo: o r2 desistiu sete
               vezes da Veronica (o Ditto dele virava Blissey e os dois se
               curavam) e o time foi a moral 7. Antes, troca por quem ainda
               não tentou contra esse adversário; só sem ninguém, desiste */
            const tentou = X.tentouContra = (X.tentouContra && X.tentouContra.uid === alvo.uid) ? X.tentouContra : {uid:alvo.uid, quem:[]};
            if (!tentou.quem.includes(p.uid)) tentou.quem.push(p.uid);
            const outro = d.time.find(x => estaVivo(x) && x.uid !== p.uid && !tentou.quem.includes(x.uid));
            if (outro){ X.trocasNaLuta = (X.trocasNaLuta || 0) + 1; X.turnoDesde = B.turno; return {tipo:'trocar', uid:outro.uid}; }
            return {tipo:'desistir'};
          }
          if (B.fuga !== false) return {tipo:'fugir'};
        }
        const golpeBom = (quem) => {
          let melhor = -1, idx = 0;
          const validos = [];
          quem.golpes.forEach((g, i) => {
            if (g.pp <= 0) return; const G = GOLPES[g.nome] || {}; if (G.c === 'status') return;
            /* golpe desabilitado (Disable) a tela trava; o robô chama o
               motor direto e perdia a vez: o Gengar do robô Líder tentou
               o Lick travado dezenas de vezes contra o Muk do Koga */
            if (quem === p && B.estAliado && B.estAliado.desabilitado && B.estAliado.desabilitado.nome === g.nome) return;
            /* golpe que não funciona agora: o Dream Eater do Haunter da Vera
               contra um Dragonair acordado, 280 turnos seguidos */
            const E = G.ef || {};
            if (E.soDormindo && alvo.status !== 'sono') return;
            if (E.soSeDormindo && quem.status !== 'sono') return;
            if (eficacia(G.t, alvo.tipos) > 0) validos.push(i);
            /* o dano que ele deve tirar, pela conta da IA (Batalha.danoEsperado):
               com a Vitalidade do outro e o dano fixo. Pelo poder do golpe, o
               Gengar do robô dava Lick (1 de dano) no Rhydon do Blue em vez de
               Night Shade, e a luta passava de trinta turnos */
            const ef = eficacia(G.t, alvo.tipos);
            const s = ef === 0 ? -1 : B.danoEsperado(quem, alvo, quem === p ? B.estAliado : null, B.estInimigo, g.nome);
            if (s > melhor){ melhor = s; idx = i; }
          });
          if (B.turno > 60 && validos.length > 1 && quem === p) idx = validos[B.turno % validos.length];
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
          const novo = X.lutaUid === alvo.uid && X.novoNaLuta !== undefined ? X.novoNaLuta : !(pd.catalogados || {})[alvo.dex];
          const g = typeof gostoSabido === 'function' ? gostoSabido(alvo) : 0;
          const vivos = d.time.filter(x => !x.morto);
          const valor = x => x.nivel + (((DEX[x.dex] || {}).total) || 300) / 40;
          const pior = vivos.length ? Math.min(...vivos.map(valor)) : 0;
          let quer = false;
          /* lendário é um só: tenta enquanto não for seu, e não só no
             primeiro encontro (na terceira rodada, 137 lutas com lendário
             e nenhuma Pokébola) */
          /* a mesma linha já no cinto: só vale pegar se for espécie que a
             Pokédex não tem (o colecionador quer o registro, e o repetido
             desce pro PC no próximo Centro) ou se for muito melhor que o
             da linha que está lá, que aí sai. Antes pegava tudo enquanto o
             time não tinha seis, e quatro dos quinze robôs terminaram a
             terceira rodada com dois iguais no cinto */
          const igual = window.__daLinha ? __daLinha(alvo.dex) : null;
          if (B.tipo === 'lendario') quer = !!J.lendario && !((d.lendarios || {})[alvo.dex] || {}).capturado;
          else if (g < 0) quer = false;
          else if (igual) quer = (J.captura === 'nova' && novo) || (!!J.troca && valor(alvo) > valor(igual) + 6);
          else if (vivos.length < 6) quer = true;
          else if (J.captura === 'nova') quer = novo;
          else if (J.captura === 'forte') quer = valor(alvo) > pior + 3 || (g > 0 && novo);
          /* o tipo do ginásio (defesa.js): o que serve num escalão do seu
             ginásio que ainda falta gente vai pro PC */
          if (!quer && B.tipo === 'selvagem' && g >= 0 && typeof Defesa !== 'undefined' && Defesa.tipoDoGinasio()
              && (alvo.tipos || []).includes(Defesa.tipoDoGinasio())){
            quer = __faltaBoa().some(f => alvo.nivel <= f.cap && alvo.nivel >= f.cap - 8);
          }
          /* lendário (captura.js): só Ultra e Master, e ele conta no
             mínimo como Ás, que pede 10 sucessos. A Master fecha sem
             rolar, então vai na hora. A Ultra tem 8 dados: com metade do
             HP e mais nada ela não pega nunca; com 1 de HP e uma
             condição, pega 1 vez em 28, e com a confusão junto, 1 em 7.
             Então: condição que não tira HP (paralisia, sono), o HP
             descendo com o golpe que não derruba nem no pior caso, e a
             Ultra quando a conta passa de 3%. Antes ele esperava os 25%
             até com a Master na mão, batia forte e passava direto pro
             nocaute: na quarta rodada, 85 das 152 lutas com lendário
             acabaram assim, e sete robôs terminaram com a Master guardada */
          if (B.tipo === 'lendario' && quer){
            if (Estado.contaItem('Master Ball') > 0){ X.bolasNaLuta = (X.bolasNaLuta || 0) + 1; return {tipo:'bola', nome:'Master Ball'}; }
            if (Estado.contaItem('Ultra Ball') > 0 && (X.bolasNaLuta || 0) < 15){
              const estI = B.estInimigo || {};
              const salva = ((B.lados || {}).inimigo || {}).salva > 0;
              const usavel = (quem, i) => { const g = quem.golpes[i];
                return g && !(g.pp <= 0) && !(quem === p && B.estAliado && B.estAliado.desabilitado && B.estAliado.desabilitado.nome === g.nome); };
              /* o máximo que o golpe tira agora, no pior caso: a conta do
                 calcularDano com o crítico, o clima e a fraqueza a favor */
              const maximo = (quem, nome) => {
                const G = GOLPES[nome] || {}, PR = PR_GOLPE[nome] || {}, E = G.ef || {};
                if (G.c === 'status') return 0;
                if (E.soDormindo && alvo.status !== 'sono') return 0;
                if (E.soSeDormindo && quem.status !== 'sono') return 0;
                const ef = eficacia(G.t, (alvo.tipos && alvo.tipos.length) ? alvo.tipos : ['Normal']);
                if (ef === 0) return 0;
                if (PR.ohko || E.fixo >= 200) return Infinity;
                if (PR.fixo || E.fixo) return PR.fixo || 1;
                if (PR.metade) return Math.min(10, Math.max(1, Math.floor(alvo.hp / 2)));
                if (PR.posto || E.nivel) return DADOS_POR_POSTO[postoDoNivel(quem.nivel)];
                const fis = G.c === 'fis', eq = quem === p ? B.estAliado : null;
                const a = B.valorAtrib(quem, eq, B.melhorAtrib(quem, eq, PR.d, fis ? 'for' : 'esp'));
                let pw = PR.p || Math.max(1, Math.round((G.p || 40) / 25));
                if (E.amizade) pw = 5;
                if (E.corte) pw += 4;
                const seg = typeof efeitoSegurado === 'function' ? efeitoSegurado(quem) : null;
                const item = seg ? ((fis && seg.fis) || (!fis && seg.esp) || 0) + (seg.golpeTipo === G.t ? (seg.dadosTipo || 0) : 0) : 0;
                const dv = PR.ign ? 0 : B.attr(alvo, estI, fis ? 'vit' : 'ins');
                const n = Math.max(0, a + pw + 1 + ((quem.tipos || []).includes(G.t) ? 1 : 0) + 2 + item - dv);
                const um = Math.max(1, n + Math.max(0, Math.round(Math.log2(ef))));
                return um * (PR.dupla ? 2 : PR.tripla ? 3 : PR.suc ? 5 : (!PR_GOLPE[nome] && E.golpes) ? E.golpes : 1);
              };
              /* o golpe que fere sem poder derrubar, o que mais tira entre
                 eles. O que prende (Wrap, Clamp, Fire Spin) fica fora: o
                 dano do fim da rodada vem depois e derruba */
              const seguro = quem => { let i0 = -1, s0 = -1;
                quem.golpes.forEach((g, i) => { if (!usavel(quem, i) || ((GOLPES[g.nome] || {}).ef || {}).preso) return;
                  const m = maximo(quem, g.nome); if (!(m > 0) || m > alvo.hp - 1) return;
                  const s = B.danoEsperado(quem, alvo, quem === p ? B.estAliado : null, estI, g.nome);
                  if (s > s0){ s0 = s; i0 = i; } });
                return i0; };
              const condicao = (quem, tipos) => quem.golpes.findIndex((g, i) => { const G = GOLPES[g.nome] || {}, E = G.ef || {};
                return usavel(quem, i) && G.c === 'status' && tipos.includes(E.tipo)
                  && (E.tipo === 'confusao' ? !(estI.confuso > 0) : B.statusPega(alvo, E.tipo)); });
              const banco = d.time.filter(x => x.uid !== p.uid && estaVivo(x) && x.hp > x.hpMax * .3);
              const podeTrocar = (X.trocasNaLuta || 0) < 4 && !(B.estAliado && B.estAliado.presoTurnos);
              const trocaPor = x => { X.trocasNaLuta = (X.trocasNaLuta || 0) + 1; X.turnoDesde = B.turno; return {tipo:'trocar', uid:x.uid}; };
              /* 1) a condição que não tira HP; sem ela no campo, quem tem */
              if (!alvo.status && !salva && X.condLenda < 6){
                const c = condicao(p, ['paralisia', 'sono']);
                if (c >= 0){ X.condLenda++; return {tipo:'golpe', indice:c}; }
                const quem = banco.find(x => condicao(x, ['paralisia', 'sono']) >= 0);
                if (quem && podeTrocar) return trocaPor(quem);
              }
              /* 2) desce até 1 de HP sem derrubar, ou põe quem desce */
              if (alvo.hp > 1){
                const i = seguro(p);
                if (i >= 0) return {tipo:'golpe', indice:i};
                const quem = banco.find(x => seguro(x) >= 0);
                if (quem && podeTrocar) return trocaPor(quem);
              }
              /* 3) dormindo, a confusão não faz ele tropeçar no próprio golpe */
              if (alvo.status === 'sono' && !salva && X.condLenda < 8){
                const c = condicao(p, ['confusao']);
                if (c >= 0){ X.condLenda++; return {tipo:'golpe', indice:c}; }
              }
              /* 4) a conta: 8 dados (o gosto soma ou tira um) mais o bônus
                 da condição, contra o que o posto pede */
              const gostoL = typeof gostoNaCaptura === 'function' ? gostoNaCaptura(alvo) : 0;
              const nd = Math.max(1, SELO_DA_BOLA['Ultra Ball'] + gostoL);
              const falta = SUCESSOS_DO_POSTO[Math.max(POSTO_MINIMO_LENDARIO, postoDoNivel(alvo.nivel))] - Captura.bonusDaCondicao(alvo, B).n;
              let chance = 0;
              for (let k = Math.max(0, falta); k <= nd; k++){ let c = 1; for (let j = 0; j < k; j++) c = c * (nd - j) / (j + 1); chance += c / Math.pow(2, nd); }
              if (chance >= .03){ X.bolasNaLuta = (X.bolasNaLuta || 0) + 1; return {tipo:'bola', nome:'Ultra Ball'}; }
              /* 5) nada desce sem risco: o golpe que menos tira, pra ele
                 sobrar com pouco HP em vez de cair (cair não tira ele do
                 mapa, mas gasta o encontro) */
              if (alvo.hp > 1){
                let i0 = -1, s0 = Infinity;
                p.golpes.forEach((g, i) => { if (!usavel(p, i) || !(maximo(p, g.nome) > 0) || ((GOLPES[g.nome] || {}).ef || {}).preso) return;
                  const s = B.danoEsperado(p, alvo, B.estAliado, estI, g.nome); if (s > 0 && s < s0){ s0 = s; i0 = i; } });
                if (i0 >= 0) return {tipo:'golpe', indice:i0};
              }
              /* 6) a chance pequena (1 de HP sem condição é 1 em 256) vale
                 duas Pokébolas, não a mochila inteira */
              if (chance > 0 && (X.bolasFracas || 0) < 2){
                X.bolasFracas = (X.bolasFracas || 0) + 1; X.bolasNaLuta = (X.bolasNaLuta || 0) + 1;
                return {tipo:'bola', nome:'Ultra Ball'};
              }
            }
            /* sem Pokébola que sirva, ou sem jeito de chegar lá: luta como sempre */
          }
          if (quer && B.tipo !== 'lendario' && (X.bolasNaLuta || 0) < 6){
            const tem = ['Poké Ball', 'Great Ball', 'Ultra Ball'].filter(n => Estado.contaItem(n) > 0);
            const ferido = alvo.hp <= alvo.hpMax * .5;
            /* time pequeno, ou o selvagem cai no primeiro golpe: joga logo,
               com ele inteiro (uma Poké Ball pega o de nível baixo uma vez
               em três). O Vito, com um Geodude 21, derrubava tudo antes da
               metade do HP e não jogou uma Pokébola sequer */
            const jaDe = (X.bolasNaLuta || 0) < 3 && (vivos.length < 3 || p.nivel >= alvo.nivel + 8);
            if (tem.length && (ferido || jaDe)){
              /* a mais barata que dá conta do posto dele, senão a melhor que tem */
              const pede = (SUCESSOS_DO_POSTO[postoDoNivel(alvo.nivel)] || 4) - (alvo.hp <= 1 ? 2 : 1) - (alvo.status ? 1 : 0);
              const nome = tem.find(n => (SELO_DA_BOLA[n] || 0) / 2 >= pede) || tem[tem.length - 1];
              X.bolasNaLuta = (X.bolasNaLuta || 0) + 1;
              return {tipo:'bola', nome};
            }
          }
        }
        /* cura quem está quase caindo */
        /* com condição, o Full Restore resolve as duas coisas de uma vez */
        const pot = (p.status && Estado.contaItem('Full Restore') > 0) ? 'Full Restore'
          : ['Hyper Potion', 'Max Potion', 'Full Restore', 'Super Potion', 'Potion'].find(n => Estado.contaItem(n) > 0);
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
        /* quem não fere ninguém não fica em campo: o Kakuna do repórter,
           só com Harden, ficou sessenta turnos contra um Rattata, as duas
           trocas da luta já gastas. Troca por quem fere (até quatro vezes)
           e, sem ninguém, vai embora da selvagem */
        if (meu.melhor < 0 && !(B.estAliado && B.estAliado.presoTurnos)){
          const quemFere = d.time.filter(x => x.uid !== p.uid && estaVivo(x) && x.hp > 0)
            .map(x => ({x, s:golpeBom(x).melhor})).filter(o => o.s > 0).sort((u, v) => v.s - u.s)[0];
          if (quemFere && (X.trocasNaLuta || 0) < 4){ X.trocasNaLuta = (X.trocasNaLuta || 0) + 1; X.turnoDesde = B.turno; return {tipo:'trocar', uid:quemFere.x.uid}; }
          if (B.tipo === 'selvagem' && B.fuga !== false) return {tipo:'fugir'};
          /* treinador, e ninguém de pé fere o de lá (o Pikachu sozinho
             contra o Onix, o Kakuna sozinho contra o Rattata): desiste */
          if (!quemFere && B.tipo === 'treinador' && B.turno >= 6) return {tipo:'desistir'};
        }
        /* (a evasão de lá não sobe mais: Minimize e Double Team dão
           esquiva, como no livro, e ela tira de um terço a dois terços
           dos golpes que acertam; o resto passa, e a luta acaba) */
        /* luta de treinador perdida de vez: trinta turnos, o de lá com
           mais da metade do HP e todo mundo de pé seis níveis ou mais
           abaixo dele. O Pidgey 2 e o Caterpie 3 contra o Onix 11 do Brock
           levavam trinta turnos de Potion. Quem joga desiste e volta
           treinado */
        if (B.tipo === 'treinador' && B.turno >= 30 && alvo.hp > alvo.hpMax * .5
            && d.time.filter(x => estaVivo(x) && x.hp > 0).every(x => x.nivel <= alvo.nivel - 6)) return {tipo:'desistir'};
        /* precisão no chão (Smokescreen, Sand Attack): quem joga troca pra
           zerar os estágios, como nos jogos */
        if (melhorBanco && ((B.estAliado || {}).precisao || 0) <= -3 && (X.trocasNaLuta || 0) < 3 && !(B.estAliado && B.estAliado.presoTurnos)){
          X.trocasNaLuta = (X.trocasNaLuta || 0) + 1;
          return {tipo:'trocar', uid:melhorBanco.x.uid};
        }
        /* luta empacada: 25 turnos contra o mesmo e ele ainda com 60% do
           HP, quem joga põe o mais forte do banco. O Butterfree da Alba
           tirava 1 de um Blissey que se curava, e foram cem turnos */
        if (B.tipo === 'treinador' && B.turno - (X.turnoDesde || 0) >= 25 && alvo.hp >= alvo.hpMax * 0.6
            && (X.trocasNaLuta || 0) < 3 && !(B.estAliado && B.estAliado.presoTurnos)){
          const forte = banco.slice().sort((u, v) => v.nivel - u.nivel)[0];
          if (forte && forte.nivel > p.nivel){ X.trocasNaLuta = (X.trocasNaLuta || 0) + 1; X.turnoDesde = B.turno; return {tipo:'trocar', uid:forte.uid}; }
        }
        if (melhorBanco && (X.trocasNaLuta || 0) < 2 && (meu.melhor < 1 || p.hp <= p.hpMax * 0.2)
            && melhorBanco.s > Math.max(1, meu.melhor * 1.5) && !(B.estAliado && B.estAliado.presoTurnos)){
          X.trocasNaLuta = (X.trocasNaLuta || 0) + 1;
          return {tipo:'trocar', uid:melhorBanco.x.uid};
        }
        /* selvagem empacado: quinze turnos contra o mesmo, ele ainda com 60%
           do HP e ninguém melhor pra trocar, quem joga vai embora. O
           Venusaur 34 do Bento só tinha golpe de Planta contra um Oddish
           (0,25×, 1 de dano), o Oddish bebia de volta com Absorb o que
           levava, e a luta passou de trinta turnos com o Venusaur
           paralisado e cinco do time de pé no banco */
        if (B.tipo === 'selvagem' && B.fuga !== false && B.turno - (X.turnoDesde || 0) >= 15
            && alvo.hp >= alvo.hpMax * 0.6 && !(B.estAliado && B.estAliado.presoTurnos)) return {tipo:'fugir'};
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

    /* a ficha do ginásio (defesa.js): o ginásio é seu e o tipo está em
       branco. A tela tem botões de cena, e o sorteio da cena escolhia o
       tipo ao acaso: a Líder assinou Fantasma, que tem dois Pokémon no
       mato, e perdeu o posto cinco vezes por falta */
    const fichaDoGinasio = await page.evaluate(() => typeof Defesa !== 'undefined' && !Batalha.ativo && Defesa.precisaTipo()
      && !!document.querySelector('.ficha-tipo')).catch(() => false);
    if (fichaDoGinasio){
      await page.evaluate(() => { const t = __tipoDoGinasio();
        window.__passo && __passo('especialidade', {tipo:t, ginasio:Defesa.meuGinasio()});
        Defesa.escolherTipo(t); }).catch(e => erros.push('especialidade: ' + e.message));
      await page.waitForTimeout(150); continue;
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
        /* porta fechada fica na tela, apagada, com o motivo (fechada no
           afazer): não é coisa pra fazer. Depois do fim que guarda o
           cartão na caixa de sapato a Liga fecha (Depois.ligaFechada), e o
           policial da quarta rodada tentou o ginásio de Viridian de 42 a
           112 vezes por dia, nove dias seguidos */
        const afz = afazeresDoLocal().filter(a => !a.fechada).map(a => a.id);
        /* o ginásio é seu e a ficha do ginásio está em branco (defesa.js): a
           tela do mapa só sai escolhendo o tipo */
        if (typeof Defesa !== 'undefined' && Defesa.precisaTipo()) return {f:'especialidade', tipo:__tipoDoGinasio()};
        const semLiga = typeof Depois !== 'undefined' && Depois.ligaFechada && !!Depois.ligaFechada();
        const ref = nivelDeReferencia();
        /* pedra e cabo: o Link Cable é a pedra de quem evolui trocando
           (evolucaoPeloCabo). Serve = a espécie evolui com ele; se a troca
           pede item segurado, o item vem antes (ver o uso, mais abaixo) */
        const PEDRAS_ROBO = () => (typeof nomesDePedra === 'function' ? nomesDePedra() : [])
          .concat(typeof evolucaoPeloCabo === 'function' ? ['Link Cable'] : []);
        const serve = (nome, x) => !!x && !x.morto && (nome === 'Link Cable' ? !!evolucaoPeloCabo(x) : !!(pedrasDe(nome) || {})[x.dex]);
        /* pedra que nenhuma loja de cidade vende (o bazar de domingo não é
           loja de cidade): a Moon Stone, e a Pedra do Sol antes da Nacional */
        const pedraRara = n => !Object.keys(LOJAS).some(c => c !== 'bazar_celadon' && catalogoDaCidade(c).some(([x]) => x === n));
        /* o mais forte de pé vai na frente: o Vito entrava no ginásio do
           Blaine com o Graveler 25 (o inicial) na frente do Golbat 65 e
           perdeu dez semanas seguidas */
        const naFrente = (gap) => {
          const forte = vivos.filter(p => p.hp > 0).sort((a, b) => b.nivel - a.nivel)[0], prim = d.time[0];
          return forte && prim && forte.uid !== prim.uid && forte.nivel >= (prim.nivel || 0) + gap ? {f:'ordem', uid:forte.uid} : null;
        };
        const centro = Exploracao.temCentro(L);
        /* sem licença o Centro cobra e posto nenhum abre: o cadastro se faz
           no balcão de qualquer Centro, a qualquer hora (Cidade.cadastro) */
        if (centro && !d.flags.tem_licenca) return {f:'cadastro'};
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
          /* o melhor guardado de uma linha que o cinto ainda não tem (sem
             contar quem `sai`): do PC não sobe repetido */
          const melhorNovo = sai => guardados.find(x => !__daLinha(x.dex, sai)) || null;
          const morto = d.time.find(x => x.morto);
          if (morto){ const t = melhorNovo(morto.uid); return {f:'pc', guardar:morto.uid, tirar:t ? t.uid : null}; }
          /* quem vai evoluir sai do PC: pedra na mochila que só serve pra
             alguém guardado (o Gloom, o Weepinbell e o Pikachu da Vera
             ficaram no PC a jornada inteira), e o Haunter ou o Kadabra
             que a figura de capuz deu, quando é hora dela completar */
          /* o inicial pelo jogo (inicialDoJogador): o uid, ou a linha em save velho */
          const inicial0 = ((typeof inicialDoJogador === 'function' && inicialDoJogador(d)) || {}).uid || d.jogador.inicialUid;
          /* o que a figura de capuz deu e ainda vai completar não volta pro
             PC: guardado, a intuição não chama, e ele ia e vinha do cinto */
          const fj = d.flags, dj0 = J.troca && typeof pokemonDoJuniper === 'function' ? pokemonDoJuniper(d) : null;
          const capuzEspera = !!(dj0 && fj.o_curador_entregou && !fj.capuz_completou && !fj.capuz_recusou && evoluiPorTroca(dj0.dex));
          const fica = x => x.uid === inicial0 || (capuzEspera && x.uid === dj0.uid);
          const vaga = () => d.time.length < 6 ? null : (d.time.filter(x => !fica(x) && !x.morto).sort((a, b) => valor(a) - valor(b))[0] || {}).uid;
          if (J.pedra)
            for (const nome of PEDRAS_ROBO()){
              if (!Estado.contaItem(nome)) continue;
              if (d.time.some(x => serve(nome, x))) continue;
              const quem = guardados.find(x => serve(nome, x));
              const sai = vaga();
              if (quem && (d.time.length < 6 || sai) && !__daLinha(quem.dex, sai)) return {f:'pc', guardar:sai, tirar:quem.uid};
            }
          if (capuzEspera && (d.pc || []).includes(dj0) && d.capitulo >= (fj.capuz_cap_entrega || 0) + 2 && (d.time.length < 6 || vaga()))
            return {f:'pc', guardar:vaga(), tirar:dj0.uid};
          /* dois da mesma linha no cinto: o mais fraco desce pro PC (o
             inicial e o que a figura de capuz vai completar ficam), e sobe
             o melhor guardado de outra linha, se não for muito pior. Sem
             ninguém pra subir, desce assim mesmo com quatro ou mais de pé:
             a vaga fica pra próxima espécie que aparecer no mato */
          const repetido = d.time.filter(x => !x.morto && !fica(x) && __daLinha(x.dex, x.uid))
            .sort((a, b) => valor(a) - valor(b))[0];
          if (repetido){
            const sobe = melhorNovo(repetido.uid);
            if (sobe && valor(sobe) >= valor(repetido) - 8) return {f:'pc', guardar:repetido.uid, tirar:sobe.uid};
            if (d.time.filter(x => !x.morto).length >= 4) return {f:'pc', guardar:repetido.uid, tirar:null};
          }
          const falta = melhorNovo(null);
          if (d.time.length < 6 && falta) return {f:'pc', guardar:null, tirar:falta.uid};
          if (J.troca && guardados.length && d.time.length >= 6){
            const pior = d.time.filter(x => !fica(x)).sort((a, b) => valor(a) - valor(b))[0];
            const sobe = pior && melhorNovo(pior.uid);
            if (sobe && valor(sobe) > valor(pior) + 3) return {f:'pc', guardar:pior.uid, tirar:sobe.uid};
          }
        }
        /* o posto que se defende (defesa.js): desafio marcado no ginásio
           ou na porta da ala tem prazo, então vem logo depois de curar e
           do PC, antes de compra, troca, presente e recado. Lá embaixo
           dos recados ele nunca chegava: depois do fim recado novo chega
           o tempo todo, e o investigador da primeira rodada da defesa
           passou noventa e nove dias atravessando Kanto atrás de presente,
           com Viridian a uma rota, até a Liga tirar o ginásio dele */
        /* a jornada não espera pra sempre: com o capítulo seguinte aberto e
           DIAS_ATE_SEGUIR dias passados desde o último que fechou, o que é
           de lado (presente noutra cidade, o passo do favor noutra cidade,
           procurar espécie nova, a Pokédex Nacional em Pallet) fica pra
           depois, e a defesa do posto só leva ele de volta quando mais uma
           falta tira o posto (no lugar dele, defende sempre). A auxiliar
           da quinta rodada, Líder e Elite ao mesmo tempo, fechou o 27 e
           passou 120 dias sem chegar ao 28: a cada desafio dava meia-volta
           pra Viridian ou pro Planalto, e entre um e outro buscava
           presente e favor do outro lado de Kanto, que não paravam de
           chegar. "Uma vez por capítulo" não zerava: o capítulo parado no
           27 era o mesmo */
        const DIAS_ATE_SEGUIR = 6;
        const prox = !d.depoisDoFim && Historia.proximoDestino ? Historia.proximoDestino() : null;
        const fecho = (window.__reg && __reg.caps && __reg.caps.length) ? __reg.caps[__reg.caps.length - 1].dia : null;
        const jornadaEspera = !!(prox && prox.local && prox.local !== '*' && !travaDoCapitulo(prox.num)
          && fecho != null && dia - fecho >= DIAS_ATE_SEGUIR && (prox.local === id || trajeto(id, prox.local)));
        if (typeof Defesa !== 'undefined'){
          let df = Defesa.pendente();
          /* no ginásio, sem ninguém do tipo que sirva contra as insígnias
             de quem marcou, ir até lá é desistir: vai procurar (abaixo) */
          if (df && df.tipo === 'lider'){ const x = (Defesa.estado('lider') || {}).desafio;
            if (x && x.estrada && !Defesa.aptos(x.ins || 0).length) df = null; }
          if (df && hp >= .5){
            if (id === df.lugar) return {f:'defender', tipo:df.tipo};
            const risco = ((Defesa.estado(df.tipo) || {}).adv || 0) >= ADVERTENCIAS_PRA_PERDER - 1;
            if (!jornadaEspera || risco){ const v = ir(df.lugar); if (v) return v; }
          }
          /* o tipo do ginásio: escalão do seu ginásio sem gente, vai procurar
             onde o tipo anda no mato, num nível que serve (seis procuras
             por dia, no máximo; a jornada que espera vem antes) */
          if (Defesa.tipoDoGinasio() && !jornadaEspera && hp >= .5){
            if (X.cacaDia !== dia){ X.cacaDia = dia; X.cacaN = 0; }
            const lugares = X.cacaN < 6 ? __ondeCacar() : [];
            if (lugares.length){
              const perto = k => k === id ? 0 : ((trajeto(id, k) || {length:99}).length);
              const alvo = lugares.filter(k => k === id || trajeto(id, k)).sort((a, b) => perto(a) - perto(b))[0];
              if (alvo === id && afz.includes('procurar')){ X.cacaN++; return {f:'procurar'}; }
              if (alvo && alvo !== id){ const v = ir(alvo); if (v) return v; }
            }
          }
        }
        /* moral no chão e Ração sobrando: dá na mão (+10 de moral), um por
           dia cada, guardando duas pro time comer sozinho. O Vito andou o
           capítulo 16 inteiro com o time em moral 0, faminto, ignorando
           uma ordem em três, e perdeu cinco vezes pro Blaine */
        if (Estado.contaItem('Ração') >= 3){
          X.naMao = X.naMao || {};
          const triste = vivos.filter(p => (p.moral || 0) < (J.racaoMoral || 30) && X.naMao[p.uid] !== dia).sort((u, v) => (u.moral || 0) - (v.moral || 0))[0];
          if (triste){ X.naMao[triste.uid] = dia; return {f:'racao', uid:triste.uid}; }
        }
        /* troca no mapa: quem troca (o jeito diz) aceita quando o que vem é
           melhor do que o que vai, e nunca entrega o inicial. É assim que
           sai o Machamp do Arlo e o Golem da Dara: o Pokémon deles chega
           evoluído (trocaEvolui) */
        if (J.troca && afz.includes('troca') && typeof Trocas !== 'undefined' && X.trocaDia !== dia + id){
          X.trocaDia = dia + id;
          /* o valor é o nível mais a força da forma final que cada um
             alcança sozinho: o Graveler, o Machoke, o Kadabra e o Haunter
             param ali (só a troca evolui), e o que vem evoluído pela
             troca já chega no fim da linha */
          const totalDe = x => ((DEX[x] || {}).total) || 300;
          const finalSozinho = x => {
            let e = x;
            for (let k = 0; k < 3; k++){
              const D = DEX[e] || {};
              if (!D.evo || typeof D.evo !== 'number' || !(D.nivelEvo > 0)) break;
              e = D.evo;
            }
            return e;
          };
          const valorT = (dex, nv) => nv + totalDe(finalSozinho(dex)) / 20;
          for (const t of Trocas.disponiveis(id)){
            if (Trocas.jaFez(t.id)) continue;
            const te = Trocas.efetiva(t);
            let vem = te.da.dex;
            if (t.trocaEvolui && evoluiPorTroca(vem)) vem = evoluiPorTroca(vem);
            const nv = Math.round((te.da.nivel[0] + te.da.nivel[1]) / 2);
            const ini = ((typeof inicialDoJogador === 'function' && inicialDoJogador(d)) || {}).uid || d.jogador.inicialUid;
            const vai = Trocas.candidatos(te).filter(x => x.uid !== ini).sort((a, b) => a.nivel - b.nivel)[0];
            if (!vai) continue;
            /* quem só evolui por troca e recebe um que já chegou no fim
               aceita até dez níveis abaixo: o que fica aqui não cresce mais */
            const parado = !!evoluiPorTroca(vai.dex) && totalDe(vem) > totalDe(vai.dex) && nv >= vai.nivel - 10;
            /* o que vem não pode ser da linha de outro que fica no cinto */
            if (__daLinha(vem, vai.uid)) continue;
            if (parado || valorT(vem, nv) > valorT(vai.dex, vai.nivel) + 2) return {f:'trocar', uid:vai.uid, tid:t.id};
          }
        }
        /* a intuição chama de volta a Lavender: quem troca vai, e lá segue
           a intuição até a porta do abrigo (a entrega, e dois capítulos
           depois o Haunter ou o Kadabra que ela deu, completo) */
        if (J.troca && typeof Intuicao !== 'undefined'){
          const pend = Intuicao.pendente(d);
          if (pend && afz.includes('intu_' + pend)) return {f:'intu_' + pend};
          const dst = Historia.proximoDestino && Historia.proximoDestino();
          const preso = !!(dst && travaDoCapitulo(dst.num));
          if (pend && id !== 'lavender' && !preso && hp >= .5){ const c = ir('lavender'); if (c) return c; }
        }
        /* a Moon Stone não está em loja nenhuma: sai do bazar de domingo,
           no terraço da Grande Loja de Celadon (AGENDA, das 8h às 17h).
           Quem tem alguém que evolui com ela e o dinheiro (com mil
           sobrando) vai até Celadon no sábado ou no domingo cedo e espera
           o bazar abrir; duas semanas por capítulo, no máximo, e só se
           Celadon fica a seis trechos ou menos. Na terceira rodada seis
           robôs terminaram com um Nidorina, um Nidorino ou um Jigglypuff
           acima do nível 50, e nenhum viu uma Moon Stone */
        if (J.pedra && LOJAS.bazar_celadon && hp >= .5){
          const doBazar = catalogoDaCidade('bazar_celadon').filter(([n, preco]) => (ITENS_INFO[n] || {}).tipo === 'pedra'
            && !Estado.contaItem(n) && [...d.time, ...(d.pc || [])].some(x => serve(n, x)) && d.jogador.dinheiro >= preco + 1000);
          if (doBazar.length){
            if (afz.includes('ag_bazar')) return {f:'bazar', itens:Object.fromEntries(doBazar.map(([n]) => [n, 1]))};
            const hoje = Calendario.hoje(), semana = dia - hoje.semanaIdx;
            const fimDeSemana = hoje.semanaIdx === 5 || (hoje.semanaIdx === 6 && d.relogio.hora < 17);
            const B0 = X.bazar && X.bazar.cap === d.capitulo ? X.bazar : (X.bazar = {cap:d.capitulo, semanas:[]});
            const caminho = Mundo.visitado('celadon') ? trajeto(id, 'celadon') : null;
            if (fimDeSemana && caminho && caminho.length <= 7 && (B0.semanas.includes(semana) || B0.semanas.length < 2)){
              if (!B0.semanas.includes(semana)) B0.semanas.push(semana);
              if (id === 'celadon') return {f:'esperar'};
              if (caminho[1] && !travaDaPassagem(id, caminho[1])) return {f:'viajar', id:caminho[1]};
            }
          }
        }
        /* pedra que a loja daqui não vende: com o dinheiro dela e mil
           sobrando, vai até a cidade já visitada que vende (a Grande Loja
           de Celadon tem quase todas; Cinnabar, a do Fogo). Uma ida por
           capítulo pra cada pedra: chegando lá, a compra é a da loja */
        if (J.pedra && typeof nomesDePedra === 'function' && hp >= .5){
          X.pedraIr = X.pedraIr || {};
          const usa = nome => [...d.time, ...(d.pc || [])].some(x => serve(nome, x));
          /* a ida em andamento: segue até a loja, e desiste se a pedra já
             veio, se ninguém mais usa ou se o dinheiro não dá mais */
          const P0 = X.pedraRumo;
          if (P0 && (P0.cap !== d.capitulo || id === P0.para || Estado.contaItem(P0.nome) || !usa(P0.nome) || d.jogador.dinheiro < P0.preco + 1000)) X.pedraRumo = null;
          else if (P0){ const c = ir(P0.para); if (c) return c; X.pedraRumo = null; }
          for (const nome of PEDRAS_ROBO()){
            if (X.pedraRumo || Estado.contaItem(nome) || !usa(nome) || X.pedraIr[nome] === d.capitulo) continue;
            if (catalogoDaCidade(id).some(([x]) => x === nome)) continue;
            const onde = Object.keys(LOJAS).filter(c => c !== id && Mundo.visitado(c))
              .map(c => [c, (catalogoDaCidade(c).find(([x]) => x === nome) || [])[1]])
              .filter(([c, preco]) => preco && d.jogador.dinheiro >= preco + 1000)
              .map(([c, preco]) => ({c, preco, t:trajeto(id, c)})).filter(o => o.t && o.t[1] && !travaDaPassagem(id, o.t[1]))
              .sort((a, b) => a.t.length - b.t.length)[0];
            if (onde){
              X.pedraIr[nome] = d.capitulo;
              X.pedraRumo = {nome, para:onde.c, preco:onde.preco, cap:d.capitulo};
              return {f:'viajar', id:onde.t[1]};
            }
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
            /* o item que a troca pede pra quem vai pelo cabo fica */
            const pedeNaTroca = typeof evolucaoPeloCabo === 'function' && [...d.time, ...(d.pc || [])].some(x => { const c = evolucaoPeloCabo(x); return c && c.item === n; });
            if (i.tipo === 'equipar' && !pedeNaTroca) vende.push([n, q]);
            else if (i.tipo === 'tm' && !d.time.some(p => !p.morto && aprendeTM(p, n))) vende.push([n, q]);
            /* a pedra que loja nenhuma vende (a Moon Stone só sai do bazar
               de domingo, do Monte da Lua e de presente) não se vende: o
               Nidoran de amanhã precisa dela */
            else if ((i.tipo === 'pedra' || i.tipo === 'cabo') && !pedraRara(n) && !(J.pedra && [...d.time, ...(d.pc || [])].some(p => serve(n, p)))) vende.push([n, q]);
          }
          /* e a sobra do que o mato dá, guardando um tanto de cada: o Vito
             andava com 9 lanternas, 11 cordas e 11 Águas Frescas, 0 ₽ e o
             time faminto. Ração, Pokébola e o que cura HP não saem */
          const FICA = {'Lanterna':1, 'Machado':1, 'Picareta':1, 'Corda':2, 'Máscara de pó':1, 'Pilha':3};
          const NUNCA = /Ração|Ball|Potion|Revive|Restore|Éter|Elixir|Ether|PP Up|Rare Candy|Repel|^Ovo$/;
          if (typeof Cidade !== 'undefined' && Cidade.vendaveis)
            for (const v of Cidade.vendaveis()){
              const i = ITENS_INFO[v.nome] || {};
              if (vende.some(x => x[0] === v.nome) || NUNCA.test(v.nome) || ['equipar', 'tm', 'pedra', 'cabo', 'bolsa', 'bola', 'fossil', 'cura', 'revive', 'vontade', 'repelente', 'ovo', 'moral', 'mapa', 'fuga'].includes(i.tipo)) continue;
              const sobra = v.qtd - (FICA[v.nome] != null ? FICA[v.nome] : 3);
              if (sobra > 0) vende.push([v.nome, sobra]);
            }
          if (vende.length){ X.vendaDia = dia + id; return {f:'vender', itens:vende}; }
        }
        /* TM de dano na mochila e alguém que aprende e ganha com ela: ensina
           (uma tentativa por Pokémon e TM). A Alba carregava Thunderbolt e
           Bubble Beam sem usar */
        {
          const valor = n => { const x = GOLPES[n] || {}; return x.c === 'status' ? 10 : (x.p || 40) * ((x.a > 100 ? 100 : (x.a || 100)) / 100); };
          X.tm = X.tm || {};
          for (const n of Object.keys(d.itens || {})){
            const info = ITENS_INFO[n] || {};
            if (info.tipo !== 'tm' || !Estado.contaItem(n) || !GOLPES[info.golpe] || GOLPES[info.golpe].c === 'status') continue;
            const quem = d.time.find(p => !p.morto && aprendeTM(p, n) && !p.golpes.some(g => g.nome === info.golpe) && !X.tm[p.uid + n]
              && (p.golpes.length < 4 || valor(info.golpe) > Math.min(...p.golpes.map(g => valor(g.nome))) * 1.2));
            if (quem){ X.tm[quem.uid + n] = true; return {f:'tm', uid:quem.uid, nome:n, golpe:info.golpe}; }
          }
        }
        /* pedra de evolução na mochila e alguém que evolui com ela */
        if (J.pedra){
          for (const nome of PEDRAS_ROBO()){
            if (!Estado.contaItem(nome)) continue;
            if (nome === 'Link Cable'){
              /* com o cabo: quem já segura o item da troca (ou não precisa)
                 evolui; quem precisa e o item está na mochila, segura antes */
              const pelo = d.time.map(x => ({x, c:evolucaoPeloCabo(x)})).filter(o => o.c);
              const pronto = pelo.find(o => o.c.pronto);
              if (pronto) return {f:'pedra', nome, uid:pronto.x.uid};
              const falta = pelo.find(o => Estado.contaItem(o.c.item));
              if (falta) return {f:'segurar', uid:falta.x.uid, nome:falta.c.item};
              continue;
            }
            const alvo = d.time.find(x => serve(nome, x));
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
          /* a pedra vem antes de tudo: comprada por último, com mil
             guardados pra estrada, ela nunca cabia (nenhum robô evoluiu
             ninguém por pedra) */
          if (J.pedra){
            for (const nome of PEDRAS_ROBO())
              if (vende(nome) && !Estado.contaItem(nome) && [...d.time, ...(d.pc || [])].some(x => serve(nome, x))) quero[nome] = 1;
            /* e o item que a troca pede, pra quem vai evoluir pelo cabo */
            if (typeof evolucaoPeloCabo === 'function')
              for (const x of [...d.time, ...(d.pc || [])]){
                const c = evolucaoPeloCabo(x);
                if (c && c.item && !c.pronto && vende(c.item) && !Estado.contaItem(c.item)) quero[c.item] = 1;
              }
          }
          if (vende('Ração')) quero['Ração'] = J.racao || 3;
          const melhor = lista => lista.find(vende);
          const pot = melhor(['Hyper Potion', 'Max Potion', 'Super Potion', 'Potion']);
          if (pot) quero[pot] = J.cura >= .7 ? 6 : 4;
          const bola = melhor(['Ultra Ball', 'Great Ball', 'Poké Ball']);
          const caca = typeof Defesa !== 'undefined' && Defesa.tipoDoGinasio() && __ondeCacar().length;
          if (bola && (J.captura !== 'time' || d.time.length < 6 || caca)) quero[bola] = J.bolas || 5;
          /* quem quer lendário leva Ultra Ball de sobra: com 1 de HP e uma
             condição, cada uma pega 1 vez em 28 */
          if (J.lendario && vende('Ultra Ball')) quero['Ultra Ball'] = Math.max(quero['Ultra Ball'] || 0, 10);
          /* Revive custa caro: só com dinheiro sobrando */
          if (vende('Revive') && J.cura >= .6 && d.jogador.dinheiro > 8000) quero['Revive'] = 2;
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

        /* a Elite: quem tem o jeito vai desde as oito; do 26 em diante,
           todo mundo, porque a jornada fecha no Campeão e o 28 acaba a
           história. Uma tentativa por dia, com o time curado, até
           ELITE_VEZES; antes de abrir o 28 o robô sobe o Planalto pra
           tentar, e depois de cada derrota a história segue. Nível pesa
           pouco no Pokérole (um ponto a cada 7), então a porta abre com o
           time até 6 abaixo da primeira cadeira, não 1: na primeira rodada
           nenhum dos cinco chegou à ala */
        /* o posto do robô (CARGO=): quando abre, vai até o lugar dele e
           assume. O policial pede ter sido guarda de rota: vai nos dois, na
           ordem. Outro posto que abrir na cidade em que ele está entra na
           chance do jeito (extras), do bem ou do mal, desde que não feche
           a porta do posto dele (veta, nos dois sentidos) */
        /* a Pokédex Nacional: com a conta do Professor feita, quem cuida
           da Pokédex vai a Pallet buscar; os outros, num capítulo sim e
           noutro não, na chance */
        /* número que te deram: grava, como quem aperta "Gravar os N". Até a
           terceira rodada nenhum robô gravou ninguém, e a agenda terminava
           só com a casa */
        if (Estado.temPokenav() && Estado.numerosDisponiveis().length){
          const novos = Estado.numerosDisponiveis();
          novos.forEach(c => Estado.registrarNumero(c.id));
          window.__passo && __passo('numeros', {n:novos.length, quem:novos.map(c => c.id).join(',')});
        }
        /* quem mandou recado de que separou alguma coisa (recados.js): aqui,
           vai encontrar; noutra cidade, vai até lá uma vez por capítulo */
        if (typeof Recados !== 'undefined'){
          const rec = afz.find(a => /^recado_/.test(a));
          if (rec) return {f:rec};
          X.recadoIr = X.recadoIr || {};
          const pend = Object.entries(Recados.reg().presentes).find(([cid, pr]) => pr.onde !== id && X.recadoIr[cid] !== d.capitulo);
          if (pend && hp >= .5 && !jornadaEspera){
            const v = ir(pend[1].onde);
            if (v) return v;
            X.recadoIr[pend[0]] = d.capitulo;
          }
        }
        /* o PokéNav (recados.js): a mensagem por ler ele lê, a chamada
           perdida ele retorna duas vezes em três, e num capítulo em oito
           anda com o aparelho no silencioso */
        if (typeof Recados !== 'undefined' && Estado.temPokenav()){
          X.silCap = X.silCap || {};
          if (X.silCap[d.capitulo] === undefined){
            X.silCap[d.capitulo] = Math.random() < 1 / 8;
            if (X.silCap[d.capitulo] !== Recados.silencioso()){
              Recados.alternarSilencio();
              window.__passo && __passo('pokenav', {silencioso:Recados.silencioso()});
            }
          }
          const rg = Recados.reg();
          const msg = Object.keys(rg.naoLidas).find(cid => contatoPorId(cid));
          if (msg) return {f:'ler_recado', id:msg};
          X.retorno = X.retorno || {};
          const pe = Object.keys(rg.perdidas).find(cid => Recados.temPerdida(cid) && X.retorno[cid + ':' + rg.perdidas[cid].dia] === undefined);
          if (pe){
            const k = pe + ':' + rg.perdidas[pe].dia;
            X.retorno[k] = Math.random() < 2 / 3;
            if (X.retorno[k]) return {f:'retornar', id:pe};
          }
          /* e uma vez em três capítulos ele liga só pra conversar, pra
             quem está mais longe do teto da afinidade */
          X.conversaCap = X.conversaCap || {};
          if (X.conversaCap[d.capitulo] === undefined){
            X.conversaCap[d.capitulo] = Math.random() < 1 / 3;
            if (X.conversaCap[d.capitulo]){
              const alvo = Estado.contatosNaAgenda().filter(c => Recados.podeConversar(c).ok && Recados.afinidade(c) < AFINIDADE_TETO_LIGACAO)
                .sort((a, b) => Recados.afinidade(a) - Recados.afinidade(b))[0];
              if (alvo) return {f:'conversar', id:alvo.id};
            }
          }
        }
        /* o pedido aceito (pedidos.js): o passo que é aqui, ele faz; o
           lugar do passo, ele vai uma vez por capítulo; pronto, ele liga
           pra contar */
        if (typeof Pedidos !== 'undefined'){
          const ped = afz.find(a => /^pedido_/.test(a));
          if (ped) return {f:ped};
          const pd = Pedidos.atual();
          if (pd && Pedidos.pronto(pd)) return {f:'contar_pedido', id:pd.quem};
          X.pedidoIr = X.pedidoIr || {};
          const lugar = Pedidos.proximoLugar(), chave = pd && (pd.quem + ':' + pd.dia);
          if (lugar && lugar !== id && X.pedidoIr[chave] !== d.capitulo && hp >= .5 && !jornadaEspera){
            const v = ir(lugar);
            if (v) return v;
            X.pedidoIr[chave] = d.capitulo;
          }
        }
        /* as tarefas da cidade (tarefas.js): a pronta ele entrega; o passo
           que é aqui ele faz, seis vezes no máximo por tarefa (a coleta de
           noite e a luta perdida voltam); a oferta ele aceita uma vez em duas */
        if (typeof Tarefas !== 'undefined'){
          const ac = afazeresDoLocal().filter(a => a.tarefa && !a.fechada);
          const doId = a => a.id.slice(3).split('__')[0];
          const volta = ac.find(a => a.tarefa === 'pronta');
          if (volta) return {f:'tarefa', id:doId(volta), como:'volta'};
          X.tfPassos = X.tfPassos || {};
          const passo = ac.find(a => a.tarefa === 'passo' && (X.tfPassos[a.id] || 0) < 6);
          if (passo && hp >= .5 && !jornadaEspera){ X.tfPassos[passo.id] = (X.tfPassos[passo.id] || 0) + 1; return {f:'tarefa', id:doId(passo), como:'passo'}; }
          X.tfVisto = X.tfVisto || {};
          const nova = ac.find(a => a.tarefa === 'nova' && !X.tfVisto[a.id]);
          if (nova && !jornadaEspera){ X.tfVisto[nova.id] = true; if (Math.random() < .5) return {f:'tarefa', id:doId(nova), como:'aceitar'}; }
        }
        if (typeof DexNacional !== 'undefined' && !DexNacional.tem() && DexNacional.pode()){
          if (afz.includes('dexnac')) return {f:'dexnac'};
          X.nacCap = X.nacCap || {};
          if (X.nacCap[d.capitulo] === undefined) X.nacCap[d.capitulo] = J.captura === 'nova' || Math.random() < .35;
          if (X.nacCap[d.capitulo] && hp >= .4 && !jornadaEspera){ const v = ir('pallet'); if (v) return v; }
        }
        const ALVO = window.__cargo;
        if (ALVO && typeof Cargos !== 'undefined'){
          const fila = ALVO === 'policial' && !d.flags.cargo_guarda_rota ? ['guarda_rota', 'policial'] : [ALVO];
          for (const cid of fila){
            const c = Cargos.porId(cid);
            if (!c || Cargos.tem(cid) || !Cargos.estado(cid).ok) continue;
            /* a licença (treinador) se guarda no balcão de qualquer Centro */
            if (c.onde === 'centro'){ if (Exploracao.temCentro(L)) return {f:'assumir', cargo:cid}; continue; }
            if (id === c.onde) return {f:'assumir', cargo:cid};
            if (hp >= .4){ const v = ir(c.onde); if (v) return v; }
          }
          const alvoC = Cargos.porId(ALVO) || {};
          X.extraDia = X.extraDia || {};
          if (J.extras && X.extraDia[id] !== dia){
            X.extraDia[id] = dia;
            const outro = CARGOS.find(c => c.id !== ALVO && (c.onde === id || c.onde === 'centro' && Exploracao.temCentro(L)) && !Cargos.tem(c.id) && Cargos.estado(c.id).ok
              && !(c.veta || []).includes(ALVO) && !(alvoC.veta || []).includes(c.id));
            if (outro && Math.random() < J.extras) return {f:'assumir', cargo:outro.id};
          }
        }
        /* a rede: quem carrega o envelope passa no ponto dela uma vez por dia
           (o armário 14 em Vermilion, o subsolo em Celadon, o galpão em
           Fuchsia): o serviço da vez e a prova pra subir de degrau. Sem
           isso o robô que pegou o envelope nunca fazia nada pela rede */
        if (afz.includes('rede') && X.redeDia !== dia + id && hp >= .5){ X.redeDia = dia + id; return {f:'rede'}; }
        /* quem busca o envelope vai até o ponto: o primeiro (o armário de
           Vermilion) pra conhecer a rede, depois onde tiver serviço ou
           prova esperando. Três idas por capítulo, no máximo. A rede 3
           chegou ao 14 Informante sem nunca ter passado no armário */
        if (window.__cargo === 'rocket' && typeof Rede !== 'undefined' && Rede.dentro(d) && hp >= .5){
          X.redeCap = X.redeCap || {};
          if ((X.redeCap[d.capitulo] || 0) < 3){
            let alvos = [];
            if (!d.rede) alvos = ['vermilion'];
            else alvos = Object.keys(PONTOS_DA_REDE).filter(k => Rede.escalao(d) >= PONTOS_DA_REDE[k].desde
              && ((Rede.servicosAqui(k).length && Rede.esperaServico() === 0) || Rede.provaAqui(k)));
            if (alvos.includes(id)){ X.redeCap[d.capitulo] = (X.redeCap[d.capitulo] || 0) + 1; X.redeDia = dia + id; return {f:'rede'}; }
            const cams = alvos.map(k => trajeto(id, k)).filter(c => c && c[1]).sort((u, v) => u.length - v.length);
            if (cams.length) return {f:'viajar', id:cams[0][1]};
          }
        }
        /* quem precisa de descoberta (o repórter anda) passeia pela cidade */
        if (J.andar && L.tipo === 'cidade' && afz.includes('andar') && Math.random() < J.andar) return {f:'andar'};

        const ELITE_VEZES = J.eliteVezes || 6;
        const querElite = !semLiga && (J.liga || d.capitulo >= 26) && typeof statusElite4 === 'function'
          && statusElite4().estado === 'disponivel' && (X.eliteVezes || 0) < ELITE_VEZES && X.eliteDia !== dia;
        if (querElite){
          const m = (typeof Titulares !== 'undefined' && Titulares.membro(0)) || (typeof ELITE4 !== 'undefined' && ELITE4[0]) || {};
          if (ref >= (m.nivelBase || 50) - 6){
            if (id === 'planalto'){
              if (hp < .95){ const c = curar(); if (c) return c; }
              X.eliteDia = dia; X.eliteVezes = (X.eliteVezes || 0) + 1; return {f:'liga'};
            }
            const prox = Historia.proximoDestino && Historia.proximoDestino();
            if (prox && Math.floor(prox.num) === 28){ const v = ir('planalto'); if (v) return v; }
          }
        }

        /* um lugar pra treinar: perto, e com o mato até o nível do time.
           Até ref + 3 o Dino treinava pra Sabrina (45) na ilha sem nome
           (50), perdia o time inteiro pra Dodrio e Scyther de 52 e voltava
           pro Centro de Fuchsia de seis em seis horas. O mato vai até 3
           acima do lugar quase sempre (e 9 de vez em quando), então o
           lugar fica 3 abaixo do time: até ref, o Dino (51) ainda treinava
           na ilha (50) e voltava pro Centro com 4 caídos */
        const lugarDeTreino = () => {
          const c = Object.keys(LOCAIS).filter(k => LOCAIS[k].tipo !== 'cidade' && Mundo.conhecido(k)
              && (LOCAIS[k].nivel || 0) >= ref - 12 && (LOCAIS[k].nivel || 0) <= ref - 3)
            .map(k => trajeto(id, k)).filter(Boolean).sort((a, b) => a.length - b.length);
          return c[0] || null;
        };
        const podeTreinar = d.treinoDia !== d.relogio.dia && Estado.contaItem('Ração') >= TREINO_RACAO
          && (d.treinoReal || 0) + TREINO_ESPERA_MIN * 60000 <= Date.now();
        /* treinador de rota esperando luta paga e ensina mais que o mato:
           quem joga sem dinheiro vai atrás dele. O Vito, sem licença e sem
           um tostão, só procurava no mato, que não paga nada */
        const temTreinador = afz.includes('desafiar') && hp >= .6;
        const treinarAqui = () => temTreinador && (d.jogador.dinheiro < 1500 || Math.random() < .5) ? {f:'desafiar'}
          : (podeTreinar && vivos.some(p => p.nivel < (L.nivel || 5) + 5)) ? {f:'treinar'} : {f:'procurar'};

        /* o ginásio: o da cidade, se der; e ir atrás de um quando a história
           pede insígnia (ou quando o jeito é de quem caça ginásio) */
        const destino = Historia.proximoDestino && Historia.proximoDestino();
        const cap = destino ? Historia.capitulo(destino.num) : null;
        const travado = !!(destino && (travaDoCapitulo(destino.num)
          || (destino.local && destino.local !== '*' && destino.local !== id && !trajeto(id, destino.local))));
        const perdeu = gid => ((X.gin || {})[gid] || 0);
        /* cada derrota pede um nível a mais, até 3. Já foram 2 por derrota,
           até 8, mas nível pesa pouco no Pokérole (um ponto de atributo a
           cada 7): no 21 os robôs ficavam semanas treinando pro Blue atrás
           de oito níveis que não mudavam a luta. O teto segura o Vito, que
           tinha 1.452 derrotas pro Brock (do laço antigo) */
        const prontoPra = g => ref >= nivelGinasio(g) - (J.ginasio ? 1 : 0) + Math.min(3, perdeu(g.id));
        const daqui = !semLiga && afz.includes('ginasio') ? GINASIOS.find(x => x.id === id && statusGinasio(x).estado === 'disponivel') : null;
        if (daqui && prontoPra(daqui)){
          /* porta com hora marcada (Cinnabar): curar agora gasta a janela,
             então entra como está */
          if (hp < .9 && !daqui.horario){ const c = curar(); if (c) return c; }
          return naFrente(3) || {f:'ginasio'};
        }
        if (!semLiga && (travado || J.ginasio)){
          /* porta de ginásio que se achou fechada hoje (o ginásio que é
             seu depois do fim, por exemplo) sai da lista até amanhã */
          X.ginFechado = X.ginFechado || {};
          /* porta que ainda não se achou não é porta fechada: a do ginásio
             só entra na lista pra quem anda pela cidade (DESCOBERTAS), e a
             de Viridian (a das sete insígnias) muita gente nunca viu. O
             conselheiro da quarta rodada achou que ela estava fechada e
             passou três etapas entre Viridian e a Rota 1, lutando com
             Pidgey de nível 2 */
          const gDaqui = GINASIOS.find(g => g.id === id);
          if (gDaqui && !Mundo.descobriu('ginasio_' + id) && ['disponivel', 'fechado'].includes(statusGinasio(gDaqui).estado) && afz.includes('andar')){
            X.andouAtras = X.andouAtras || {};
            const k = id + ':' + dia;
            if ((X.andouAtras[k] = (X.andouAtras[k] || 0) + 1) <= 12) return {f:'andar'};
          }
          if (gDaqui && !afz.includes('ginasio')) X.ginFechado[id] = dia;
          const abertos = GINASIOS.filter(g => ['disponivel', 'fechado'].includes(statusGinasio(g).estado) && X.ginFechado[g.id] !== dia)
            .map(g => ({g, cam:trajeto(id, g.id)})).filter(x => x.cam)
            .sort((a, b) => nivelGinasio(a.g) - nivelGinasio(b.g) || a.cam.length - b.cam.length);
          const alvo = abertos[0];
          const MOER_GIN = 150;
          if (alvo){
            const g = alvo.g;
            X.moerGin = X.moerGin || {};
            /* quem caça ginásio vai quando está pronto; não pronto, segue a
               história, que também dá nível. Treinar pro ginásio, até 150
               vezes, é só pra quando a história pede a insígnia: a Vera
               ficou 20 minutos no capítulo 7 treinando pro Blaine */
            if (prontoPra(g) || (travado && (X.moerGin[g.id] || 0) >= MOER_GIN)){
              if (id === g.id){
                if (statusGinasio(g).estado === 'fechado'){
                  /* fechado: cura antes, fora do dia dele, e espera a porta */
                  const diaDele = g.horario && Calendario.hoje().semanaIdx === g.horario.dia;
                  if (hp < .9 && !diaDele){ const c = curar(); if (c) return c; }
                  return {f:'esperar'};
                }
                return (hp < .9 && !g.horario) ? (curar() || naFrente(3) || {f:'ginasio'}) : (naFrente(3) || {f:'ginasio'});
              }
              if (travado || J.ginasio) return {f:'viajar', id:alvo.cam[1]};
            } else if (travado){
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
          if (falta && !jornadaEspera && (X[k] || 0) < 6 && Estado.contaItem('Poké Ball') + Estado.contaItem('Great Ball') + Estado.contaItem('Ultra Ball') > 0){
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
      if (!['viajar', 'erro', 'pc', 'pedra', 'loja', 'bazar', 'segurar', 'vender', 'tm', 'trocar', 'ordem', 'racao'].includes(dec.f))
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
      } else if (dec.f === 'bazar'){
        /* o bazar de domingo é outro balcão (Cidade.loja(0, 'bazar_celadon')),
           aberto pelo afazer da agenda, com o preço dele */
        await page.evaluate(() => Exploracao.fazer('ag_bazar')); await page.waitForTimeout(150);
        await page.evaluate(itens => {
          const comprou = [], Q = 'bazar_celadon';
          for (const [n, q] of Object.entries(itens)){
            if (!catalogoDaCidade(Q).some(([x]) => x === n)) continue;
            try {
              const p = precoNaCidade(n, Q);
              const cabe = Math.floor((Estado.j.dinheiro - 1000) / Math.max(1, p));
              if (cabe < 1) continue;
              Cidade.comprar(n, p);
              if (Cidade._compra) Cidade._compra.qtd = Math.min(q, cabe, Cidade._compra.max || 0);
              if (Cidade._compra && Cidade._compra.qtd){ const k = Cidade._compra.qtd; Cidade.confirmarCompra(n, p); comprou.push(k + '× ' + n); }
            } catch(e){}
          }
          Cidade._qual = null;
          UI.fecharModal(true); Exploracao.tela();
          window.__passo && __passo('compra', {itens:comprou, dinheiro:Estado.j.dinheiro, onde:'bazar'});
        }, dec.itens || {}).catch(e => erros.push('bazar: ' + e.message));
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
      } else if (dec.f === 'tm'){
        /* pelo botão da mochila (Ensinar), e a pergunta de qual esquecer
           responde a volta seguinte do laço */
        await page.evaluate(x => {
          const p = Estado.dados.time.find(y => y.uid === x.uid);
          window.__passo && __passo('tm', {nome:x.nome, golpe:x.golpe, quem:p ? nomeExib(p) + ' (' + p.nome + ' ' + p.nivel + ')' : null});
          UI.ensinarTMa(x.uid, x.nome);
          if (!document.querySelector('.aprender-op')){ UI.fecharModal(true); Exploracao.tela(); }
        }, dec).catch(e => erros.push('tm: ' + e.message));
      } else if (dec.f === 'trocar'){
        await page.evaluate(x => {
          const d = Estado.dados, p = d.time.find(y => y.uid === x.uid);
          const antes = new Set(d.time.map(y => y.uid));
          const fmt = y => (y.apelido ? y.apelido + ', ' : '') + y.nome + ' ' + y.nivel;
          const deu = p ? fmt(p) : null;
          Trocas.fazer(x.uid, x.tid, 0);
          const veio = d.time.concat(d.pc || []).find(y => !antes.has(y.uid) && y.trocado);
          window.__passo && __passo('troca', {deu, veio:veio ? fmt(veio) : null, com:(Trocas.porId(x.tid) || {}).quem});
          UI.fecharModal(true); if (!document.querySelector('#escolhas .escolha')) Exploracao.tela();
        }, dec).catch(e => erros.push('trocar: ' + e.message));
      } else if (dec.f === 'ordem'){
        await page.evaluate(x => {
          const d = Estado.dados, p = d.time.find(y => y.uid === x.uid), antes = d.time[0];
          UI.trocarNoTime(x.uid, antes.uid);
          UI.fecharModal(true); Exploracao.tela();
          window.__passo && __passo('ordem', {quem:p ? nomeExib(p) + ' (' + p.nome + ' ' + p.nivel + ')' : null, saiu:antes ? nomeExib(antes) : null});
        }, dec).catch(e => erros.push('ordem: ' + e.message));
      } else if (dec.f === 'racao'){
        await page.evaluate(x => {
          const p = Estado.dados.time.find(y => y.uid === x.uid);
          const antes = p ? p.moral : null;
          UI.aplicarItemFora('Ração', x.uid);
          UI.fecharModal(true); Exploracao.tela();
          window.__passo && __passo('racao', {quem:p ? nomeExib(p) + ' (' + p.nome + ' ' + p.nivel + ')' : null, moral:[antes, p ? p.moral : null]});
        }, dec).catch(e => erros.push('racao: ' + e.message));
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
          if (x.nome === 'Link Cable') UI.aplicarCabo(x.uid); else UI.aplicarPedra(x.nome, x.uid);
          UI.fecharModal(true); Exploracao.tela();
          window.__passo && __passo('pedra', {nome:x.nome, de, para:p ? p.nome : null});
        }, dec).catch(e => erros.push('pedra: ' + e.message));
      } else if (dec.f === 'conversar'){
        await page.evaluate(i => { UI.fecharModal && UI.fecharModal(true);
          const ok = Recados.conversar(i);
          window.__passo && __passo('pokenav', {acao:'conversou', quem:i, ok:!!ok}); }, dec.id)
          .catch(e => erros.push('conversar: ' + e.message));
      } else if (dec.f === 'retornar' || dec.f === 'ler_recado'){
        await page.evaluate(x => { UI.fecharModal && UI.fecharModal(true);
          const ok = x.f === 'ler_recado' ? Recados.ler(x.id) : Recados.retornar(x.id);
          window.__passo && __passo('pokenav', {acao:x.f === 'ler_recado' ? 'leu' : 'retornou', quem:x.id, ok:!!ok}); }, dec)
          .catch(e => erros.push(dec.f + ': ' + e.message));
      } else if (dec.f === 'especialidade'){
        await page.evaluate(t => { UI.fecharModal && UI.fecharModal(true);
          window.__passo && __passo('especialidade', {tipo:t, ginasio:Defesa.meuGinasio()});
          Defesa.escolherTipo(t); }, dec.tipo).catch(e => erros.push('especialidade: ' + e.message));
      } else if (dec.f === 'defender'){
        await page.evaluate(t => { UI.fecharModal && UI.fecharModal(true);
          const x = (Defesa.estado(t) || {}).desafio;
          window.__passo && __passo('defesa', {tipo:t, quem:x ? x.nome : null, ins:x ? x.ins : null});
          /* no ginásio, o time que a quadra sugere: os mais fortes que servem */
          if (t === 'lider' && x && x.estrada) Defesa.lutar(t, Defesa.preSelecao(x.ins || 0));
          else Defesa.lutar(t); }, dec.tipo).catch(e => erros.push('defender: ' + e.message));
      } else if (dec.f === 'tarefa'){
        /* a tarefa da cidade: aceitar, o passo (a escolha sorteada; achou
           e tem alguém em volta, a luta, que o laço de luta joga) e a volta */
        await page.evaluate(([i, como]) => {
          UI.fecharModal && UI.fecharModal(true);
          const t = Tarefas.porId(i);
          if (como === 'aceitar'){ Exploracao.fazer('tf_' + i); Tarefas.aceitar(i); }
          else if (como === 'volta') Exploracao.fazer('tf_' + i + '__volta');
          else {
            Exploracao.fazer('tf_' + i + '__passo');
            const r = Tarefas.de(i) || {};
            if (t.tipo === 'resgate' && r.achou && t.passo.luta) Tarefas.lutar(i);
            else { const ops = Tarefas.escolhasDe(t); const op = ops[Math.floor(Math.random() * ops.length)]; if (op) Tarefas.escolher(i, op.i); }
          }
          window.__passo && __passo('tarefa', {id:i, como, estado:(Tarefas.de(i) || {}).estado || null});
        }, [dec.id, dec.como]).catch(e => erros.push('tarefa: ' + e.message));
      } else if (dec.f === 'contar_pedido'){
        await page.evaluate(i => { UI.fecharModal && UI.fecharModal(true); Pedidos.ligar(i, 'contar');
          window.__passo && __passo('pedido', {fim:'contou', quem:i}); }, dec.id).catch(e => erros.push('pedido: ' + e.message));
      } else if (dec.f === 'assumir'){
        await page.evaluate(c => { UI.fecharModal && UI.fecharModal(true); Jogo.assumirCargo(c); }, dec.cargo).catch(e => erros.push('assumir: ' + e.message));
      } else if (dec.f === 'liga') await page.evaluate(() => { Exploracao.fazer('liga'); Jogo.iniciarElite4(); });
      else if (dec.f === 'viajar') await page.evaluate(i => Exploracao.viajar(i), dec.id);
      else if (dec.f === 'arco') await page.evaluate(() => Exploracao.entrarNoArco());
      else if (dec.f === 'centro'){ await page.evaluate(() => Cidade.atenderAqui()); }
      else if (dec.f === 'cadastro'){
        await page.evaluate(() => {
          Cidade.cadastro(); Cidade.receberLicenca();
          window.__passo && __passo('cadastro', {local:Mundo.id()});
        }).catch(e => erros.push('cadastro: ' + e.message));
        /* o balcão abre de novo por cima (receberLicenca): fecha e segue */
        await page.waitForTimeout(120);
        await page.evaluate(() => { UI.fecharModal(true); Exploracao.tela(); }).catch(() => {});
      }
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
      /* a porta que só leva a um final, antes do 28: na primeira rodada os
         cinco pararam no 25 ou no terceiro capítulo do caminho, num
         desfecho antecipado, e ninguém chegou à Elite. A opção que, seguida
         cena a cena (escolha, teste, luta, desvio), só chega em cena com
         final e nunca no "Encerrar o capítulo" pesa quase nada quando a
         cena tem outra. null é o botão que não é da história (Centro,
         olhar) */
      const soFinal = await esc.evaluateAll(els => {
        const d = Estado.dados, cap = Historia.capAtual, cena = Historia.cenaAtual || {};
        if (!cap || !cap.cenas || Math.floor(d.capitulo) === 28) return els.map(() => null);
        const seguintes = (cid, c) => {
          const s = [];
          (c.escolhas || []).forEach(e => { if (typeof e.vai === 'string') s.push(e.vai); });
          if (c.teste) ['critico', 'sucesso', 'parcial', 'falha'].forEach(k => { if (typeof c.teste[k] === 'string') s.push(c.teste[k]); });
          if (c.batalha) ['vitoria', 'derrota', 'captura', 'fuga', 'fuga2'].forEach(k => { if (typeof c.batalha[k] === 'string') s.push(c.batalha[k]); });
          if (c.sacrificio && typeof c.sacrificio.vai === 'string') s.push(c.sacrificio.vai);
          const dv = cap.desvios && cap.desvios[cid];
          if (dv && typeof dv.vai === 'string') s.push(dv.vai);
          return s;
        };
        const leva = ini => {
          const visto = new Set([ini]), fila = [ini];
          let final = false, fim = false;
          while (fila.length){
            const cid = fila.shift(), c = cap.cenas[cid];
            if (!c) continue;
            if (c.final) { final = true; continue; }
            if (c.fim) { fim = true; continue; }
            for (const y of seguintes(cid, c)) if (!visto.has(y)){ visto.add(y); fila.push(y); }
          }
          return final && !fim;
        };
        return els.map(el => {
          const m = /Jogo\.escolher\((\d+)\)/.exec(el.getAttribute('onclick') || '');
          if (!m) return null;
          const e = (cena.escolhas || [])[+m[1]];
          return !!(e && typeof e.vai === 'string' && leva(e.vai));
        });
      }).catch(() => []);
      const temOutra = soFinal.some(x => x === false);
      /* o lado do jeito: a escolha que mexe na reputação pro eixo que o
         jeito quer pesa mais (quanto mais mexe, mais pesa), a do eixo
         contrário pesa um quarto; a que define a via (capítulo 9) pesa
         seis vezes se for a do jeito, um quinto se for outra. É assim que
         o vigilante chega com reputação pra guarda de rota e o oportunista
         chega aos armários de Vermilion */
      /* a reputação e a via quase nunca moram na escolha: moram na cena
         pra onde ela leva (2.798 escolhas levam a cena com rep, 310 têm a
         rep nelas). Lia só a escolha, e o robô da rede chegou ao 26
         Admirado, com 795 pontos do lado bom e nenhum do ruim */
      const lado = (J.rep || J.via) ? await esc.evaluateAll((els, q) => {
        const cena = Historia.cenaAtual || {}, cs = (Historia.capAtual && Historia.capAtual.cenas) || {};
        return els.map(el => {
          /* a escolha de capítulo (Jogo.escolher) ou a de cena de linha
             (Linhas.escolher, que mora em Linhas.atual e não leva a cena) */
          const on = el.getAttribute('onclick') || '';
          const m = /Jogo\.escolher\((\d+)\)/.exec(on), ml = /Linhas\.escolher\((\d+)\)/.exec(on);
          const e = m ? (cena.escolhas || [])[+m[1]]
            : ml && typeof Linhas !== 'undefined' && Linhas.atual ? (Linhas.atual.escolhas || [])[+ml[1]] : null;
          if (!e) return 1;
          const efs = [e.ef || {}];
          if (m && typeof e.vai === 'string' && cs[e.vai] && cs[e.vai].ef) efs.push(cs[e.vai].ef);
          let w = 1;
          for (const ef of efs){
            const r = ef.rep;
            if (q.rep && r && r.eixo){
              const dl = Math.abs(+r.delta || 1);
              w *= r.eixo === q.rep ? 1 + 2 * dl : (r.eixo === 'bom' || r.eixo === 'ruim') ? .15 : 1;
            }
            const vm = /definirVia\(\s*['"](\w+)['"]/.exec(String(ef.executar || ''));
            if (q.via && vm) w *= q.via.includes(vm[1]) ? 6 : .2;
          }
          return w;
        });
      }, {rep:J.rep || null, via:J.via || null}).catch(() => []) : [];
      /* a porta do posto (PORTA_DO_POSTO): enquanto falta a marca (ou a
         via), a escolha que leva mais perto da cena que dá a marca, em
         passos de cena pelo grafo do capítulo, pesa mais, e a que não
         leva a ela pesa um quinto. O robô da rede da quinta rodada subiu
         pela cratera, voltou "sem encostar em nada" e saiu do 5 sem ver
         a operação: chegou ao 25 com a reputação boa e sem o envelope. O
         da comissão atravessou o 9 por quatro cenas, sem nenhuma que
         define a via, e chegou ao 23 neutro, com o posto fechado. O da
         Elite ouviu a oferta da cadeira no 26 e aceitou o contrato de
         campo */
      const porta = PORTA_DO_POSTO[CARGO] ? await esc.evaluateAll((els, P) => {
        const d = Estado.dados;
        if (P.flag && d.flags[P.flag]) return [];
        if (P.via && P.via.includes(d.via || 'neutro')) return [];
        if (P.conceder && Cargos.tem(P.conceder)) return [];
        const cena = Historia.cenaAtual || {}, cs = (Historia.capAtual && Historia.capAtual.cenas) || {};
        const da = ef => {
          if (!ef) return false;
          const f = ef.flag;
          if (P.flag && f && (Array.isArray(f) ? f.includes(P.flag) : f === P.flag)) return true;
          const src = String(ef.executar || '');
          const vm = P.via && /definirVia\(\s*['"](\w+)['"]/.exec(src);
          if (vm && P.via.includes(vm[1])) return true;
          /* a cena que dá o posto; se ela depende da oferta do 26, só
             quando a oferta é a dele */
          return !!(P.conceder && new RegExp("Cargos\\.conceder\\(\\s*['\"]" + P.conceder + "['\"]").test(src)
            && (!/c26_oferta/.test(src) || typeof c26_oferta !== 'function' || c26_oferta(d) === P.conceder));
        };
        const dist = ini => {
          const vis = new Set([ini]);
          let fila = [ini];
          for (let k = 0; fila.length && k <= 12; k++){
            const prox = [];
            for (const id of fila){
              const c = cs[id];
              if (!c) continue;
              if (da(c.ef)) return k;
              for (const e of (c.escolhas || [])){
                if (da(e.ef)) return k + 1;
                if (typeof e.vai === 'string' && !vis.has(e.vai)){ vis.add(e.vai); prox.push(e.vai); }
              }
            }
            fila = prox;
          }
          return Infinity;
        };
        const ds = els.map(el => {
          const m = /Jogo\.escolher\((\d+)\)/.exec(el.getAttribute('onclick') || '');
          const e = m && (cena.escolhas || [])[+m[1]];
          if (!e) return Infinity;
          if (da(e.ef)) return 0;
          return typeof e.vai === 'string' ? dist(e.vai) : Infinity;
        });
        if (!ds.some(x => x < Infinity)) return [];
        return ds.map(x => x < Infinity ? 1 + 40 * Math.pow(.5, x) : .2);
      }, PORTA_DO_POSTO[CARGO] || {}).catch(() => []) : [];
      /* o posto que ele quer não se larga numa escolha: a opção que tira o
         posto dele (Cargos.largar, na escolha ou na cena pra onde ela
         leva, em capítulo ou em cena de linha) pesa um vigésimo. O robô
         da rede da quinta rodada, Chefe de turno, disse à mula da rede que
         tinha entregado tudo à polícia, numa cena de linha do 27, e
         terminou fora dela */
      const fica = CARGO ? await esc.evaluateAll((els, cargo) => {
        const cena = Historia.cenaAtual || {}, cs = (Historia.capAtual && Historia.capAtual.cenas) || {};
        const larga = ef => !!ef && new RegExp("Cargos\\.largar\\(\\s*['\"]" + cargo + "['\"]").test(String(ef.executar || ''));
        return els.map(el => {
          const on = el.getAttribute('onclick') || '';
          const m = /Jogo\.escolher\((\d+)\)/.exec(on), ml = /Linhas\.escolher\((\d+)\)/.exec(on);
          const e = m ? (cena.escolhas || [])[+m[1]]
            : ml && typeof Linhas !== 'undefined' && Linhas.atual ? (Linhas.atual.escolhas || [])[+ml[1]] : null;
          if (!e) return 1;
          const efs = [e.ef];
          if (m && typeof e.vai === 'string' && cs[e.vai]) efs.push(cs[e.vai].ef);
          return efs.some(larga) ? .05 : 1;
        });
      }, CARGO).catch(() => []) : [];
      /* quem usa pedra pega a que a cena dá (a da cratera do Monte da Lua)
         e não devolve à toa: a escolha que dá pedra de evolução pesa três
         vezes, a que tira pesa um terço. A reputação pesa por cima, e o
         protetor devolve do mesmo jeito */
      const pedraNaCena = J.pedra ? await esc.evaluateAll(els => {
        const cena = Historia.cenaAtual || {}, cs = (Historia.capAtual && Historia.capAtual.cenas) || {};
        const ehPedra = n => ['pedra', 'cabo'].includes((ITENS_INFO[n] || {}).tipo);
        return els.map(el => {
          const m = /Jogo\.escolher\((\d+)\)/.exec(el.getAttribute('onclick') || '');
          const e = m && (cena.escolhas || [])[+m[1]];
          if (!e) return 1;
          const efs = [e.ef || {}];
          if (typeof e.vai === 'string' && cs[e.vai] && cs[e.vai].ef) efs.push(cs[e.vai].ef);
          let w = 1;
          for (const ef of efs){
            if (Object.keys(ef.itens || {}).some(ehPedra)) w *= 3;
            if (Object.keys(ef.perdeItens || {}).some(ehPedra)) w /= 3;
          }
          return w;
        });
      }).catch(() => []) : [];
      /* perdeu duas vezes no mesmo ginásio: não tenta de novo na hora,
         vai treinar antes. O Vito, com um Geodude só, perdeu do Onix do
         Brock mais de dez vezes seguidas pelo "tentar de novo" */
      const perdeuAqui = await page.evaluate(() => { const g = Jogo.ginasioAtual || GINASIOS.find(x => x.id === Mundo.id());
        return g ? (((window.__extra || {}).gin || {})[g.id] || 0) : 0; }).catch(() => 0);
      /* o atalho pro Centro no meio da cena só quando o time precisa: o
         Dino passava pelo balcão de Viridian treze vezes num capítulo,
         com o time inteiro, e o passo a passo enchia de cura à toa */
      const precisaCurar = await page.evaluate(() => { const v = Estado.dados.time.filter(p => !p.morto);
        return v.reduce((s, p) => s + Math.max(0, p.hp), 0) / Math.max(1, v.reduce((s, p) => s + p.hpMax, 0)) < .7; }).catch(() => false);
      const pesos = textos.map((t, i) => (J.gosta && J.gosta.test(t) ? 3 : 1) * (/^Parar e olhar mais um pouco/.test(t) ? .5 : 1)
        * (soFinal[i] && temOutra ? .03 : 1) * (lado[i] || 1) * (pedraNaCena[i] || 1) * (porta[i] || 1) * (fica[i] || 1)
        * (perdeuAqui >= 2 && /tentar de novo/i.test(t) ? 0 : 1)
        * (/^Ir ao balcão do Centro/.test(t) ? (precisaCurar ? 3 : 0) : 1)
        /* a figura de capuz pede a Pokébola pra completar o que ela deu:
           quem troca entrega, quem é fiel ao time fecha a mão */
        * (/^"Toma\."/.test(t) ? (J.troca ? 6 : 1) : 1) * (/^Fechar a mão em volta da Pokébola/.test(t) ? (J.troca ? .2 : 3) : 1));
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
      await page.mouse.move(1, 1).catch(() => {});
      const rc = await esc.nth(k).click({timeout:3000}).then(() => true)
        .catch(e => String(e.message || e).split('\n').filter(l => /intercepts|visible|viewport|stable|enabled|Timeout|detached/.test(l)).slice(0, 3).join(' | '));
      /* a opção que não pega: o policial da quarta rodada escolheu "Ir
         até a mesa da parede" treze vezes seguidas no subsolo de
         Cinnabar e a cena não andou. Com janela por cima (o PokéNav que
         toca na virada) a volta seguinte atende a janela; sem ela, anota
         o motivo e o que está por cima, e aperta pela página */
      if (rc !== true){
        const diag = await esc.nth(k).evaluate(el => {
          const q = el.getBoundingClientRect(), em = document.elementFromPoint(q.x + q.width / 2, q.y + q.height / 2);
          const quem = x => x ? (x.tagName + (x.id ? '#' + x.id : '') + '.' + String(x.className || '').trim().replace(/\s+/g, '.')).slice(0, 80) : null;
          return {rect:[q.x, q.y, q.width, q.height].map(Math.round), tela:[innerWidth, innerHeight, Math.round(scrollY)], emCima:quem(em),
            modal:!!document.querySelector('#modal'), pe:getComputedStyle(el).pointerEvents};
        }).catch(e => ({erro:e.message}));
        if (!diag.modal && !diag.erro){
          /* o texto e o que está por cima vêm antes do motivo: a anotação
             corta em 140 caracteres, e o motivo do Playwright, com os
             códigos de cor do terminal, comia tudo */
          anota('opção sem clique', JSON.stringify(Object.assign({texto:t.slice(0, 40), emCima:diag.emCima, rect:diag.rect, tela:diag.tela},
            {motivo:String(rc).replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').slice(0, 160)})));
          await esc.nth(k).evaluate(el => el.click()).catch(() => {});
        }
      }
      await page.waitForTimeout(70); continue;
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
    } catch (e) {
      /* o laço morto pelo vigia derruba o evaluate que estava esperando */
      if (travouPagina){ estado = 'travou'; break; }
      throw e;
    }
  }
  clearInterval(vigia);
  if (passos >= 2000000) estado = 'travou';

  /* fim da etapa: o ponto de parada, pra seguir dali (se a jornada não
     acabou). Página que travou não grava: o estado pode ter ficado pela
     metade, e a próxima etapa segue do último ponto bom */
  if (!travouPagina && (estado === 'pausa' || estado === 'erros' || estado === 'travou')){
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
      pc:(d.pc || []).map(p => ({dex:p.dex, especie:p.nome, apelido:p.apelido || null, nivel:p.nivel, genero:p.genero || null, shiny:!!p.shiny, morto:!!p.morto})),
      cemiterio:(d.cemiterio || []).map(p => ({especie:p.nome, nome:nomeExib(p), causa:p.causaMorte})),
      insignias:d.insignias.slice(), dinheiro:j.dinheiro, reputacao:rep ? (typeof concordaJogador === "function" ? concordaJogador(rep.nome) : rep.nome) : null, eixo:d.reputacao && d.reputacao.eixo,
      via:d.via || null, linha:typeof linhaAtual === 'function' ? linhaAtual(d) : null, cargos:(d.cargos || []).slice(),
      capitulo:d.capitulo, fechados:(d.capitulosFechados || []).slice(), dia:d.relogio.dia, campeao:!!d.flags.campeao_de_kanto,
      pokedex:{vistos:Object.keys(pd.vistos || {}).length, catalogados:Object.keys(pd.catalogados || {}).length,
        deKanto:Object.keys(pd.catalogados || {}).map(Number).filter(x => x >= 1 && x <= 150).length,
        nacional:!!d.flags.dex_nacional, johto:!!d.flags.johto_liberado},
      alvo:window.__cargo || null, cargo:j.cargo ? (typeof concordaJogador === "function" ? concordaJogador(j.cargo) : j.cargo) : null, postos:Object.keys(d.flags).filter(k => /^cargo_/.test(k)).map(k => k.slice(6)),
      largou:Object.keys(d.flags).filter(k => /^largou_/.test(k)).map(k => k.slice(7)),
      rede:d.rede ? {escalao:d.rede.escalao, pontos:d.rede.pontos, provas:d.rede.provas || null, fora:!!d.rede.fora, servicos:d.rede.feitos || d.rede.servicos || null} : null,
      lei:d.liga ? {avisos:d.liga.avisos || 0, ordem:!!d.liga.ordemDevolucao, detencao:!!d.liga.detencao} : null,
      lendarios:Object.entries(d.lendarios || {}).filter(([, l]) => l && (l.capturado || l.encontros || l.visto))
        .map(([k, l]) => ({dex:+k, nome:DEX[k] ? DEX[k].nome : k, capturado:!!l.capturado, encontros:l.encontros || 0, cacando:!!l.caçandoVoce})),
      descobertas:Object.keys(d.descobertas || {}).length, depoisDoFim:d.depoisDoFim || null,
      lutas:window.__lutaN || 0, dificuldade:d.config && d.config.dificuldade || 'normal',
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
