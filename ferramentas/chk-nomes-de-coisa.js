/* chk-nomes-de-coisa — nome de tipo, de golpe e de item comparado
   contra quem os define. Errar um nome desses não quebra nada: a
   condição simplesmente nunca casa, o golpe nunca entra, o item nunca
   aparece. Já aconteceu — uma missão do PokéNav pedia tipo 'Terra',
   que não existe aqui (o tipo é 'Terrestre'), e ficou meia missão
   morta sem ninguém ver. É por ser silencioso que precisa de script. */
const fs = require('fs'), path = require('path');
const raiz = path.join(__dirname, '..');
const ler = r => fs.readFileSync(path.join(raiz, r), 'utf8');
const arquivos = [];
for (const d of ['js/data', 'js/engine', 'js/story', 'js/story/caminhos', 'js/ui', 'js']){
  const dir = path.join(raiz, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.js')) arquivos.push(d + '/' + f);
}

/* ---- o que existe ---- */
const src = arquivos.map(f => [f, ler(f)]);
const junto = src.map(x => x[1]).join('\n');

const TIPOS = new Set((junto.match(/const TIPOS_KANTO = \[([^\]]*)\]/)[1] + ',' +
                       junto.match(/const TIPOS_JOHTO = \[([^\]]*)\]/)[1])
  .match(/'([^']+)'/g).map(s => s.slice(1, -1)));

const GOLPES = new Set();
{
  const bloco = junto.match(/const GOLPES = \{([\s\S]*?)\n\};/);
  if (bloco) bloco[1].replace(/^\s*'([^']+)':\s*\{/gm, (_, n) => { GOLPES.add(n); return ''; });
}

const falhas = [];

/* ---- 1. comparação com literal de tipo ---- */
for (const [arq, texto] of src){
  const re = /(?:tipos?|t)\s*===?\s*'([^']+)'|===?\s*'([^']+)'\s*(?:\|\||\)|&&)/g;
  let m;
  while ((m = re.exec(texto))){
    const v = m[1] || m[2];
    if (!v) continue;
    /* só interessa o que parece nome de tipo: começa maiúsculo e é uma palavra */
    if (!/^[A-ZÁ-Ú][a-zá-úç]+$/.test(v)) continue;
    if (TIPOS.has(v)) continue;
    /* palavras que são outra coisa (nome próprio, rótulo) não contam */
    const perto = texto.slice(Math.max(0, m.index - 90), m.index + 40);
    if (!/tipos?\b/i.test(perto)) continue;
    const linha = texto.slice(0, m.index).split('\n').length;
    falhas.push(`${arq}:${linha}  tipo '${v}' não existe (tipos: ${[...TIPOS].slice(0,4).join(', ')}…)`);
  }
}

/* ---- 2. golpe citado em time de NPC ---- */
for (const [arq, texto] of src){
  if (!/golpes\s*:\s*\[/.test(texto)) continue;
  let m, re = /golpes\s*:\s*\[([^\]]*)\]/g;
  while ((m = re.exec(texto))){
    const nomes = (m[1].match(/'([^']+)'/g) || []).map(s => s.slice(1, -1));
    for (const n of nomes){
      if (GOLPES.has(n)) continue;
      const linha = texto.slice(0, m.index).split('\n').length;
      falhas.push(`${arq}:${linha}  golpe '${n}' não está em GOLPES`);
    }
  }
}

if (falhas.length){
  console.log('FALHAS:'); falhas.forEach(f => console.log(' - ' + f));
  process.exit(1);
}
console.log(`ok — ${TIPOS.size} tipos e ${GOLPES.size} golpes conferidos em ${arquivos.length} arquivos`);
