/* chk-sprites — as pastas que js/data/sprites.js aponta têm que existir
   e ter os 251 arquivos. Caminho apontando pra pasta que não está lá
   não quebra nada: cada <img> se apaga sozinha e o jogo fica sem arte
   sem avisar. É exatamente por ser silencioso que precisa de script. */
const fs = require('fs'), path = require('path');
const raiz = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(raiz, 'js/data/sprites.js'), 'utf8');

const base = src.match(/const SPRITES_BASE = '([^']+)'/)[1];
const pastas = {};
src.match(/const SPRITES_PASTA = \{([\s\S]*?)\};/)[1]
  .replace(/(\w+)\s*:\s*'([^']+)'/g, (_, k, v) => { pastas[k] = v; return ''; });

const falhas = [];
const linhas = [];
for (const [vista, pasta] of Object.entries(pastas)){
  const dir = path.join(raiz, base, pasta);
  if (!fs.existsSync(dir)){ falhas.push(`vista '${vista}' aponta pra ${base}${pasta}, que não existe`); continue; }
  const pngs = fs.readdirSync(dir).filter(f => /^\d+\.png$/.test(f));
  const faltam = [];
  for (let i = 1; i <= 251; i++) if (!pngs.includes(i + '.png')) faltam.push(i);
  if (faltam.length) falhas.push(`${base}${pasta}: faltam ${faltam.length} (ex.: ${faltam.slice(0,5).join(', ')})`);
  linhas.push(`  ${vista.padEnd(12)} ${base}${pasta}  ${pngs.length} arquivos`);
}

/* o build não pode embutir pasta que ninguém pede, nem pular pasta usada */
const build = fs.readFileSync(path.join(raiz, 'build.py'), 'utf8');
const fora = (build.match(/SPRITES_FORA = \(([^)]*)\)/) || [,''])[1]
  .match(/'([^']+)'/g) || [];
for (const f of fora.map(x => x.slice(1, -1))){
  for (const pasta of Object.values(pastas)){
    if (f === base + pasta) falhas.push(`build.py pula ${f}, que sprites.js ainda usa`);
  }
}

/* rostos, insígnias, discos de TM e gritos: arquivo que falta não quebra
   nada — o rosto some, o grito não toca — e por isso mesmo é conferido */
const tr = fs.readFileSync(path.join(raiz, 'js/data/treinadores.js'), 'utf8');
const rostos = new Set([...tr.matchAll(/'((?:gym_leaders|elite|trainers|overworld)\/[a-z_]+)'/g)].map(m => m[1]));
for (const r of rostos) if (!fs.existsSync(path.join(raiz, base, 'npcs', r + '.png'))) falhas.push(`rosto ${r}.png não existe em ${base}npcs/`);
const ins = src.match(/const INSIGNIA_ARQ = \{([\s\S]*?)\};/);
const insArq = ins ? [...ins[1].matchAll(/:'([a-z]+)'/g)].map(m => m[1]) : [];
for (const a of insArq) if (!fs.existsSync(path.join(raiz, base, 'badges', a + '_badge.png'))) falhas.push(`insígnia ${a}_badge.png não existe`);
const tms = src.match(/const TM_ARQ_TIPO = \{([\s\S]*?)\};/);
const tmArq = tms ? [...tms[1].matchAll(/:'([a-z]+)'/g)].map(m => m[1]) : [];
for (const a of tmArq) if (!fs.existsSync(path.join(raiz, base, 'items/tms', 'tm_' + a + '.png'))) falhas.push(`disco tm_${a}.png não existe`);
let gritos = 0;
for (let i = 1; i <= 251; i++) if (fs.existsSync(path.join(raiz, 'sons/gritos', i + '.ogg'))) gritos++;
if (gritos < 251) falhas.push(`sons/gritos: ${gritos} de 251`);
/* imagens de efeito de golpe: todo nome citado em efeitos.js tem arquivo */
const fxSrc = fs.readFileSync(path.join(raiz, 'js/ui/efeitos.js'), 'utf8');
const fxArq = [...new Set([...fxSrc.matchAll(/'((?:physical|special|stat|status)_[a-z_0-9]+)'/g)].map(m => m[1]))];
for (const a of fxArq) if (!fs.existsSync(path.join(raiz, base, 'animations/moves', a + '.png'))) falhas.push(`efeito ${a}.png não existe em animations/moves/`);
linhas.push(`  rostos ${rostos.size} · insígnias ${insArq.length} · discos de TM ${tmArq.length} · gritos ${gritos} · efeitos de golpe ${fxArq.length}`);

if (falhas.length){
  console.log('FALHAS:'); falhas.forEach(f => console.log(' - ' + f));
  process.exit(1);
}
console.log('ok — ' + Object.keys(pastas).length + ' vistas, 251 espécies em cada');
linhas.forEach(l => console.log(l));
if (fora.length) console.log('  fora do build: ' + fora.map(x => x.slice(1, -1)).join(', '));
