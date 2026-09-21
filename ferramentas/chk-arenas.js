/* chk-arenas — todo ambiente escrito (capítulo ou ponto do mapa) tem
   que cair numa das cinco arenas. Ambiente sem arena vira fundo padrão
   sem ninguém perceber, e é isso que este script não deixa passar. */
const fs = require('fs'), path = require('path');
const raiz = path.join(__dirname, '..');

function carrega(rel){ return fs.readFileSync(path.join(raiz, rel), 'utf8'); }

const arenas = carrega('js/data/arenas.js');
const mapa = {};
const bloco = arenas.match(/const ARENA_POR_AMBIENTE = \{([\s\S]*?)\};/)[1];
bloco.replace(/(\w+)\s*:\s*'([^']+)'/g, (_, a, b) => { mapa[a] = b; return ''; });
const nomes = new Set();
arenas.match(/const NOME_DA_ARENA = \{([\s\S]*?)\};/)[1]
  .replace(/(\w+)\s*:/g, (_, k) => { nomes.add(k); return ''; });

/* ambientes escritos no jogo */
const usados = new Map();   // ambiente -> onde apareceu
function varre(rel){
  const src = carrega(rel);
  let m, re = /ambiente\s*:\s*'([^']+)'/g;
  while ((m = re.exec(src))) {
    if (!usados.has(m[1])) usados.set(m[1], rel);
  }
}
varre('js/engine/mundo.js');
fs.readdirSync(path.join(raiz, 'js/story'))
  .filter(f => f.endsWith('.js'))
  .forEach(f => varre('js/story/' + f));

const falhas = [];
for (const [amb, onde] of usados){
  if (!mapa[amb]) falhas.push(`ambiente '${amb}' (${onde}) não tem arena`);
  else if (!nomes.has(mapa[amb])) falhas.push(`ambiente '${amb}' aponta para arena '${mapa[amb]}', que não existe`);
}
for (const [amb, ar] of Object.entries(mapa)){
  if (!usados.has(amb)) falhas.push(`arena mapeada para '${amb}', que ninguém usa`);
}
/* o CSS precisa desenhar cada arena e cada ambiente com tom próprio */
const css = carrega('css/estilo.css');
for (const a of nomes){
  if (!css.includes('.arena-' + a)) falhas.push(`arena '${a}' sem desenho no CSS (.arena-${a})`);
}

if (falhas.length){
  console.log('FALHAS:'); falhas.forEach(f => console.log(' - ' + f));
  process.exit(1);
}
const porArena = {};
for (const [amb, ar] of Object.entries(mapa)) (porArena[ar] = porArena[ar] || []).push(amb);
console.log(`ok — ${usados.size} ambientes em ${nomes.size} arenas`);
for (const a of nomes) console.log(`  ${a}: ${(porArena[a] || ['(só por cima: ginásio, Elite, torneio)']).join(', ')}`);
