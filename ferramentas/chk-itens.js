/* chk-itens — item que uma cena entrega e que não existe de verdade.
   A mochila aceita qualquer nome: documento de enredo entra sem ficha
   e é assim mesmo. O problema é o item MECÂNICO escrito errado, que
   entra na mochila como papel — não cura, não serve em combate, não
   tem ficha. Já aconteceu: três cenas davam 'Poção' e o item de cura
   se chama 'Potion', e em duas delas o jogador PAGAVA por isso.

   Só dois sinais reprovam, porque são os que separam item mecânico de
   documento de enredo:
     1. o jogador paga (dinheiro negativo na mesma cena);
     2. o mesmo nome aparece em capítulos diferentes.
   Documento de enredo é achado, não comprado, e é de um capítulo só. */
const fs = require('fs'), path = require('path');
const raiz = path.join(__dirname, '..');
const ler = r => fs.readFileSync(path.join(raiz, r), 'utf8');

const est = ler('js/engine/estado.js');
const ITENS = new Set();
est.match(/const ITENS_INFO = \{([\s\S]*?)\n\};/)[1]
  .replace(/^\s*'([^']+)'\s*:/gm, (_, n) => { ITENS.add(n); return ''; });
/* mochilas e bolsas têm sistema próprio: cor pelo nome, sem ficha */
const ehBolsa = n => /^(Mochila|Bolsa)\s/.test(n);

/* Coisa de enredo que se compra dentro da ficção mesmo — pipoca, um
   recibo, uma medalha de vitrine. Pagar por elas é a cena, não erro.
   A lista é curta de propósito: se crescer muito, o sinal "o jogador
   pagou" deixa de valer alguma coisa. */
const COMPRA_DE_ENREDO = new Set([
  'Recibo de consignação',
  'Saco de pipoca',
  'Medalha de natação da filha do Vernon'
]);

const arqs = [];
for (const d of ['js/story', 'js/story/caminhos', 'js/data'])
  for (const f of fs.readdirSync(path.join(raiz, d)))
    if (f.endsWith('.js')) arqs.push(d + '/' + f);

/* Regex não fecha bloco aninhado: `ef:{ itens:{...}, ... }` tem chave
   dentro de chave e qualquer `\{...\}` para cedo ou tarde demais. Aqui a
   varredura conta as chaves na mão, do `ef:{` até fechar. */
function blocoEf(texto, i){
  let nivel = 0;
  for (let j = i; j < texto.length; j++){
    const c = texto[j];
    if (c === '{') nivel++;
    else if (c === '}'){ nivel--; if (nivel === 0) return texto.slice(i, j + 1); }
  }
  return null;
}

const onde = {};     // nome -> Set de arquivos
const pagos = [];    // {nome, arq, linha}
for (const a of arqs){
  const t = ler(a);
  let m, re = /\bef\s*:\s*\{/g;
  while ((m = re.exec(t))){
    const inicio = t.indexOf('{', m.index);
    const corpo = blocoEf(t, inicio);
    if (!corpo) continue;
    const bloco = corpo.match(/\bitens\s*:\s*\{([^{}]*)\}/);
    if (!bloco) continue;
    const nomes = (bloco[1].match(/'([^']+)'/g) || []).map(s => s.slice(1, -1));
    const paga = /\bdinheiro\s*:\s*-\s*\d/.test(corpo);
    const linha = t.slice(0, m.index).split('\n').length;
    for (const n of nomes){
      if (ITENS.has(n) || ehBolsa(n) || COMPRA_DE_ENREDO.has(n)) continue;
      (onde[n] = onde[n] || new Set()).add(a);
      if (paga) pagos.push({n, a, linha});
    }
  }
}

const falhas = [];
for (const {n, a, linha} of pagos)
  falhas.push(`${a}:${linha}  o jogador PAGA por '${n}', que não existe em ITENS_INFO`);
for (const n of Object.keys(onde))
  if (onde[n].size > 1)
    falhas.push(`'${n}' aparece em ${onde[n].size} capítulos e não existe em ITENS_INFO — ${[...onde[n]].join(', ')}`);

const soltos = Object.keys(onde).length;
if (falhas.length){
  console.log('FALHAS:');
  [...new Set(falhas)].forEach(f => console.log(' - ' + f));
  process.exit(1);
}
console.log(`ok — ${ITENS.size} itens com ficha; ${soltos} nomes de enredo sem ficha, ` +
            `nenhum pago e nenhum repetido entre capítulos`);
