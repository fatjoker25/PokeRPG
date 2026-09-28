/* ============================================================
   GERA js/data/golpes-showdown.js
   A animação de cada golpe, tirada do cliente do Pokémon Showdown
   (play.pokemonshowdown.com/src/battle-animations-moves.ts, CC0; o
   motor battle-animations.ts é MIT). Só entram os golpes que existem
   em GOLPES e o que eles chamam por dentro.

   Uso:
     node ferramentas/gerar-golpes-showdown.js <pasta com os .ts>
   A pasta precisa de battle-animations.ts e battle-animations-moves.ts
   (github.com/smogon/pokemon-showdown-client). O TypeScript é
   convertido com esbuild (npx esbuild), e as imagens de efeito são
   baixadas pra sprites_nds/animations/showdown/.
   ============================================================ */
const fs = require('fs'), path = require('path'), cp = require('child_process'), Module = require('module');
const raiz = path.resolve(__dirname, '..');
const fonte = path.resolve(process.argv[2] || '.');
const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'sdanim-'));

for (const f of ['battle-animations', 'battle-animations-moves'])
  cp.execSync(`npx --yes esbuild "${path.join(fonte, f + '.ts')}" --format=cjs --target=es2019 --outfile="${path.join(tmp, f + '.js')}" --log-level=error`);

/* o motor importa jQuery, som, Dex… nada disso roda aqui: tudo vira um
   objeto oco que aceita qualquer chamada */
const oco = () => new Proxy(function(){}, {get:(t, k) => k === '__esModule' ? false : k === Symbol.toPrimitive ? () => '' : oco(),
                                           apply:() => oco(), construct:() => oco()});
global.window = {}; global.$ = Object.assign(oco(), {easing:{}}); global.jQuery = global.$;
const req = Module.prototype.require;
Module.prototype.require = function(id){
  const alvo = path.join(tmp, id.replace(/^\.\//, '').replace(/\.js$/, '') + '.js');
  if (id.startsWith('./') && fs.existsSync(alvo)) return req.call(this, alvo);
  if (id.startsWith('./')) return new Proxy({}, {get:(t, k) => k === '__esModule' ? false : oco()});
  return req.apply(this, arguments);
};
/* os dois se importam: o de golpes primeiro, senão o outro lê antes da hora */
const M = req.call(module, path.join(tmp, 'battle-animations-moves.js'));
const A = req.call(module, path.join(tmp, 'battle-animations.js'));

/* a tabela de imagens não é exportada: sai do texto */
const tsA = fs.readFileSync(path.join(fonte, 'battle-animations.ts'), 'utf8');
const ini = tsA.indexOf('const BattleEffects');
const corpo = tsA.slice(tsA.indexOf('{', tsA.indexOf('=', ini)), tsA.indexOf('\n};', ini) + 2);
const EFEITOS = eval('(' + corpo + ')');

/* id do Showdown: minúsculo, sem espaço nem hífen */
const idDe = n => n.toLowerCase().replace(/[^a-z0-9]/g, '');
/* golpes que mudaram de nome entre gerações */
const RENOME = {vicegrip:'visegrip', hijumpkick:'highjumpkick', faintattack:'feintattack'};

const golpesSrc = fs.readFileSync(path.join(raiz, 'js/data/golpes.js'), 'utf8');
const nossos = [...golpesSrc.matchAll(/^\s*'([^']+)':\s*\{t:/gm)].map(m => m[1]);

const TAB = {golpe:M.BattleMoveAnims, outra:A.BattleOtherAnims, status:A.BattleStatusAnims};
const NOME_TAB = {golpe:'SD_GOLPES', outra:'SD_OUTRAS', status:'SD_STATUS'};
const pegos = {golpe:{}, outra:{}, status:{}};
const faltam = [], efeitos = new Set(), fundos = new Set();

function fonteDe(fn){
  let s = fn.toString();
  /* método abreviado "anim(scene, …) {" vira função de verdade */
  if (/^[A-Za-z_$][\w$]*\s*\(/.test(s) && !/^function\b/.test(s)) s = 'function ' + s;
  return s
    .replace(/import_battle_animations\d*\.BattleOtherAnims/g, 'SD_OUTRAS')
    .replace(/import_battle_animations_moves\d*\.BattleMoveAnims/g, 'SD_GOLPES')
    .replace(/import_battle_animations\d*\.BattleStatusAnims/g, 'SD_STATUS')
    .replace(/import_client_main\d*\.Config/g, 'SD_CONFIG')
    .replace(/\bBattleOtherAnims\b/g, 'SD_OUTRAS').replace(/\bBattleMoveAnims\b/g, 'SD_GOLPES')
    .replace(/\bBattleStatusAnims\b/g, 'SD_STATUS').replace(/\bBattleEffects\b/g, 'SD_EFEITOS');
}
function pegar(tab, id){
  if (pegos[tab][id] !== undefined) return;
  const d = TAB[tab][id];
  if (!d || !d.anim){ pegos[tab][id] = null; return; }
  const src = fonteDe(d.anim);
  pegos[tab][id] = src;
  for (const m of src.matchAll(/SD_OUTRAS\.(\w+)|SD_OUTRAS\[["'](\w+)["']\]/g)) pegar('outra', m[1] || m[2]);
  for (const m of src.matchAll(/SD_GOLPES\.(\w+)|SD_GOLPES\[["'](\w+)["']\]/g)) pegar('golpe', m[1] || m[2]);
  for (const m of src.matchAll(/SD_STATUS\.(\w+)|SD_STATUS\[["'](\w+)["']\]/g)) pegar('status', m[1] || m[2]);
  for (const m of src.matchAll(/showEffect\(\s*["'](\w+)["']/g)) efeitos.add(m[1]);
  for (const m of src.matchAll(/SD_EFEITOS\.(\w+)/g)) efeitos.add(m[1]);
  for (const m of src.matchAll(/fx\/([\w-]+\.(?:jpg|png))|gen6bgs\/([\w-]+\.(?:jpg|png))/g)) fundos.add(m[1] ? 'fx/' + m[1] : 'sprites/gen6bgs/' + m[2]);
}
for (const n of nossos){
  const id = RENOME[idDe(n)] || idDe(n);
  if (M.BattleMoveAnims[id]) pegar('golpe', id); else faltam.push(n);
}
/* a batida genérica que o motor usa quando um golpe não tem animação */
['hitmark', 'contactattack', 'xattack'].forEach(x => pegar('outra', x));

/* imagens: baixa o que não está no disco */
const pastaFx = path.join(raiz, 'sprites_nds/animations/showdown');
fs.mkdirSync(pastaFx, {recursive:true});
const baixar = (url, dest) => { if (!fs.existsSync(dest)) cp.execSync(`curl -sSf -o "${dest}" "${url}"`); };
const usados = {};
for (const e of [...efeitos].sort()){
  const d = EFEITOS[e];
  if (!d || !d.url) continue;
  try { baixar('https://play.pokemonshowdown.com/fx/' + d.url, path.join(pastaFx, d.url)); }
  catch (err){ console.warn('sem imagem:', e, d.url); continue; }
  usados[e] = {arq:d.url, w:d.w, h:d.h, ...(d.y ? {y:d.y} : {})};
}
const fundosOk = [];
for (const f of [...fundos].sort()){
  const arq = path.basename(f);
  try { baixar('https://play.pokemonshowdown.com/' + f, path.join(pastaFx, arq)); fundosOk.push(arq); }
  catch (err){ console.warn('sem fundo:', f); }
}

const bloco = tab => '{\n' + Object.entries(pegos[tab]).filter(([, s]) => s).sort()
  .map(([id, s]) => `  ${id}: {anim: ${s}}`).join(',\n') + '\n}';
const saida = `/* ============================================================
   GERADO por ferramentas/gerar-golpes-showdown.js — não edite à mão.
   Animação de cada golpe, do cliente do Pokémon Showdown
   (battle-animations-moves.ts, CC0; battle-animations.ts, MIT).
   Quem roda é CenaShowdown, em js/ui/cena-showdown.js.
   ${Object.values(pegos.golpe).filter(Boolean).length} golpes · ${Object.keys(usados).length} imagens · ${fundosOk.length} fundos
   ============================================================ */
const SD_CONFIG = {routes:{client:'play.pokemonshowdown.com'}};
const SD_EFEITOS = ${JSON.stringify(usados, null, 0).replace(/\},"/g, '},\n  "')};
const SD_FUNDOS = ${JSON.stringify(fundosOk)};
const SD_OUTRAS = ${bloco('outra')};
const SD_STATUS = ${bloco('status')};
const SD_GOLPES = ${bloco('golpe')};
/* golpe do jogo -> id do Showdown */
const SD_ID_DO_GOLPE = ${JSON.stringify(Object.fromEntries(nossos.map(n => [n, RENOME[idDe(n)] || idDe(n)]).filter(([, id]) => pegos.golpe[id])))};
`;
fs.writeFileSync(path.join(raiz, 'js/data/golpes-showdown.js'), saida);
console.log(`golpes com animação: ${Object.values(pegos.golpe).filter(Boolean).length} de ${nossos.length}`);
console.log(`auxiliares: ${Object.values(pegos.outra).filter(Boolean).length} · status: ${Object.values(pegos.status).filter(Boolean).length}`);
console.log(`imagens: ${Object.keys(usados).length} · fundos: ${fundosOk.length}`);
if (faltam.length) console.log('sem animação no Showdown:', faltam.join(', '));
