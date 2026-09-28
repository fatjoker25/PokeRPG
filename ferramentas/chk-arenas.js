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

/* o fundo de verdade: um arquivo por ambiente, e ele tem que existir */
const fundos = {};
arenas.match(/const FUNDO_POR_AMBIENTE = \{([\s\S]*?)\};/)[1]
  .replace(/(\w+)\s*:\s*'([^']+)'/g, (_, a, f) => { fundos[a] = f; return ''; });
const base = arenas.match(/const ARENAS_BASE = '([^']+)'/)[1];
for (const amb of usados.keys()){
  const f = fundos[amb];
  if (!f){ falhas.push(`ambiente '${amb}' sem imagem de fundo`); continue; }
  if (!fs.existsSync(path.join(raiz, base, f)))
    falhas.push(`fundo de '${amb}' aponta pra ${base}${f}, que não está na pasta`);
}
for (const amb of Object.keys(fundos)){
  if (!usados.has(amb)) falhas.push(`fundo mapeado para '${amb}', que ninguém usa`);
  /* cada imagem precisa do seu foco, senão o enquadramento sai no chute */
  if (!css.includes(`[data-ambiente="${amb}"]`))
    falhas.push(`ambiente '${amb}' sem foco de enquadramento no CSS`);
}

/* o fundo da página: todo lugar do mapa tem cenário, e o arquivo existe */
const cenario = {};
arenas.match(/const CENARIO_POR_LOCAL = \{([\s\S]*?)\};/)[1]
  .replace(/(\w+)\s*:\s*'([^']+)'/g, (_, l, f) => { cenario[l] = f; return ''; });
const locais = [];
{ const mundo = carrega('js/engine/mundo.js');
  const blocoL = mundo.match(/const LOCAIS = \{([\s\S]*?)\n\};/)[1];
  let m, re = /^(\w+)\s*:\s*\{/gm;
  while ((m = re.exec(blocoL))) locais.push(m[1]); }
for (const l of locais){
  if (!cenario[l]) falhas.push(`lugar '${l}' sem cenário de fundo (CENARIO_POR_LOCAL)`);
  else if (!fs.existsSync(path.join(raiz, base, cenario[l])))
    falhas.push(`cenário de '${l}' aponta pra ${base}${cenario[l]}, que não está na pasta`);
}
for (const l of Object.keys(cenario)) if (!locais.includes(l)) falhas.push(`cenário para '${l}', que não é lugar do mapa`);

if (falhas.length){
  console.log('FALHAS:'); falhas.forEach(f => console.log(' - ' + f));
  process.exit(1);
}
const porArena = {};
for (const [amb, ar] of Object.entries(mapa)) (porArena[ar] = porArena[ar] || []).push(amb);
console.log(`ok — ${usados.size} ambientes em ${nomes.size} arenas, ` +
            `${Object.keys(fundos).length} fundos na pasta, ${locais.length} lugares com cenário`);
for (const a of nomes) console.log(`  ${a}: ${(porArena[a] || ['(só por cima: ginásio, Elite, torneio, Conferência)']).join(', ')}`);
