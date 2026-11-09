/* ============================================================
   chk-tiques — as muletas de frase do texto, contadas
   O texto do jogo tinha três fórmulas que voltavam o tempo todo, e de
   tanto voltar viraram tique: "é a coisa mais X que você já…" (195
   vezes, dezessete só no capítulo 28), "do jeito de quem…" e "do jeito
   que se…" (150) e o fecho ", e isso é…" no fim da frase. Cada uma
   sozinha é boa; o problema é a conta. Este verificador conta cada
   fórmula por arquivo e no jogo inteiro, e reprova quem passa do teto.

   Refrão de propósito (o Ezra repetindo "a coisa mais importante que
   já aconteceu comigo", o "e isso é tudo" dos finais do 28) entra em
   `permitidos` e não conta. Fórmula nova que vire tique entra em
   TIQUES com o teto dela; o que está em OLHO só aparece na conta.

   Uso: node ferramentas/chk-tiques.js [--todos]   (--todos lista cada
   ocorrência de quem passou do teto)
   ============================================================ */
const fs = require('fs'), path = require('path');
const raiz = path.resolve(__dirname, '..');

const TIQUES = [
  {nome:'a coisa mais', rx:/(?<![a-zà-úA-ZÀ-Ú])a coisa mais/gi, porArquivo:2, total:60,
   permitidos:[/a coisa mais importante que já/i]},
  {nome:', e isso é', rx:/, e isso é/gi, porArquivo:3, total:30,
   permitidos:[/, e isso é tudo/i]},
  {nome:'do jeito de quem / que se', rx:/(?<![a-zà-úA-ZÀ-Ú])do jeito (de quem|que se)/gi, porArquivo:4, total:100,
   permitidos:[]}
];
/* não reprova, só mostra onde está mais denso */
const OLHO = [
  {nome:'como quem', rx:/(?<![a-zà-úA-ZÀ-Ú])como quem/gi},
  {nome:'de um jeito que', rx:/(?<![a-zà-úA-ZÀ-Ú])de um jeito que/gi}
];

function arquivos(dir){
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? arquivos(p) : (e.name.endsWith('.js') ? [p] : []);
  });
}
const lista = arquivos(path.join(raiz, 'js/story')).concat(arquivos(path.join(raiz, 'js/data'))).sort();
const textos = lista.map(f => ({f:path.relative(raiz, f), linhas:fs.readFileSync(f, 'utf8').split('\n')}));

/* cada ocorrência, com a linha e o trecho em volta */
function achar(t, rx, permitidos){
  const out = [];
  t.linhas.forEach((l, i) => {
    for (const m of l.matchAll(rx)){
      const trecho = l.slice(Math.max(0, m.index - 10), m.index + 70);
      if ((permitidos || []).some(p => p.test(l.slice(m.index, m.index + 80)))) continue;
      out.push({linha:i + 1, trecho});
    }
  });
  return out;
}

const todos = process.argv.includes('--todos');
let falhas = 0;
for (const T of TIQUES){
  const por = textos.map(t => ({f:t.f, oc:achar(t, T.rx, T.permitidos)})).filter(x => x.oc.length);
  const total = por.reduce((s, x) => s + x.oc.length, 0);
  const acima = por.filter(x => x.oc.length > T.porArquivo).sort((a, b) => b.oc.length - a.oc.length);
  const ok = total <= T.total && !acima.length;
  console.log(`${ok ? 'ok  ' : 'FALHA'} "${T.nome}": ${total} no jogo (teto ${T.total}), ${por.length} arquivos, teto ${T.porArquivo} por arquivo`);
  if (total > T.total){ falhas++; console.log(`      passou ${total - T.total} do teto do jogo`); }
  for (const x of acima){
    falhas++;
    console.log(`      ${x.f}: ${x.oc.length}`);
    if (todos) x.oc.forEach(o => console.log(`        ${o.linha}: …${o.trecho}…`));
  }
}
for (const O of OLHO){
  const por = textos.map(t => ({f:t.f, n:achar(t, O.rx).length})).filter(x => x.n).sort((a, b) => b.n - a.n);
  const total = por.reduce((s, x) => s + x.n, 0);
  console.log(`olho "${O.nome}": ${total} no jogo · mais denso: ${por.slice(0, 4).map(x => `${path.basename(x.f)} ${x.n}`).join(', ')}`);
}
if (falhas){ console.log(`\n${falhas} problema(s). Reescreva a frase (cortar o fecho costuma bastar) ou, se for refrão de propósito, ponha em permitidos.`); process.exit(1); }
console.log('\nNenhum tique acima do teto.');
