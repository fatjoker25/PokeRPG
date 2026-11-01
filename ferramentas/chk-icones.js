/* chk-icones — todo item que o jogador pode ter tem o ícone da coisa.

   O ícone sai de três lugares (caminhoItem, em js/data/sprites.js):
     1. ITEM_SPRITE — a arte dos jogos, só pra equivalente exato;
     2. arquivoTM — o disco da TM, pela cor do tipo;
     3. o desenho em pixel de js/data/icones.js: ITEM_PIXEL pelo nome, a
        mochila e a bolsa pela cor, e o que a história te dá pelo que a
        coisa é (arquivoDoDesenho: papel, crachá, rádio, pena…).
   O desenho "pacote" é o que sobra quando nenhum outro casa. Já foram
   61 itens ali — apito, binóculo, rádio, a Poké Ball velha, a pena do
   Ho-Oh — todos com cara de caixa de papelão. Item que cai no pacote
   reprova: ou ganha desenho (ferramentas/desenhar-itens.py), ou a
   regra do nome em arquivoDoDesenho passa a pegar ele.

   Junta o nome de três lados: ITENS_INFO, todo itens:{'…':n} das cenas
   e dos dados, e o estoque das lojas. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; }, querySelectorAll(){ return []; }, body:{}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const s of [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]))
  if (!s.startsWith('http')) vm.runInThisContext(fs.readFileSync(path.join(raiz, s), 'utf8'), {filename:s});

const nomes = new Map();   // nome -> onde apareceu
const anota = (n, onde) => { if (!nomes.has(n)) nomes.set(n, onde); };
for (const n of Object.keys(ITENS_INFO)) anota(n, 'ITENS_INFO');
for (const d of ['js/story', 'js/story/caminhos', 'js/data', 'js/engine', 'js/ui'])
  for (const f of fs.readdirSync(path.join(raiz, d))){
    if (!f.endsWith('.js')) continue;
    const t = fs.readFileSync(path.join(raiz, d, f), 'utf8');
    for (const m of t.matchAll(/\bitens\s*:\s*\{([^{}]*)\}/g))
      for (const q of (m[1].match(/'([^']+)'\s*:/g) || [])) anota(q.replace(/'\s*:$/, '').slice(1), d + '/' + f);
  }

const conta = {jogo:0, tm:0, desenho:0, bolsa:0};
const noPacote = [], semArquivo = [];
const existe = rel => fs.existsSync(path.join(raiz, SPRITES_BASE + rel));
for (const [n, onde] of [...nomes].sort((a, b) => a[0].localeCompare(b[0]))){
  if (ITEM_SPRITE[n]){ conta.jogo++; if (!existe(ITENS_PASTA + ITEM_SPRITE[n] + '.png')) semArquivo.push(`${n} → ${ITEM_SPRITE[n]}.png`); continue; }
  if (arquivoTM(n)){ conta.tm++; continue; }
  const arq = arquivoDoDesenho(n);
  if (/^(mochila|bolsa)_/.test(arq)) conta.bolsa++; else conta.desenho++;
  if (!existe(ITENS_PASTA + 'nossos/' + arq + '.png')) semArquivo.push(`${n} → nossos/${arq}.png`);
  if (arq === 'pacote') noPacote.push(`${n}   [${onde}]`);
}

console.log(`${nomes.size} itens: ${conta.jogo} com a arte dos jogos, ${conta.tm} discos de TM, ${conta.desenho} com desenho nosso, ${conta.bolsa} mochilas e bolsas`);
const falhas = [];
if (noPacote.length) falhas.push(`caem no desenho genérico de pacote (${noPacote.length}):\n   ` + noPacote.join('\n   '));
if (semArquivo.length) falhas.push(`apontam pra arquivo que não existe (${semArquivo.length}):\n   ` + semArquivo.join('\n   '));
if (falhas.length){ console.log('\nFALHAS:\n' + falhas.join('\n\n')); process.exit(1); }
console.log('ok — nenhum item cai no pacote, e todo arquivo apontado existe');
