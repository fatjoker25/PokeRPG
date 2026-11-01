/* chk-musica — a trilha calma de cada lugar fecha a volta.

   Cada tema de Som.CALMAS é dado: andamento, compasso, um acorde por
   compasso e a melodia em [nota, tempos]. Se a melodia não somar
   exatamente acordes × compasso, a volta desencontra: a melodia
   recomeça no meio de um compasso e o acorde de baixo já é outro.

   Confere também que toda cidade do mapa tem o tema dela (menos a que
   toca outra coisa pelo ambiente: Lavender é a Torre), e que timbre e
   ritmo são dos que o tocador sabe fazer. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; }, querySelectorAll(){ return []; }, body:{}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const s of [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]))
  if (!s.startsWith('http')) vm.runInThisContext(fs.readFileSync(path.join(raiz, s), 'utf8'), {filename:s});

const TIMBRES = ['flauta', 'clarinete', 'trompa', 'metais', 'sino', 'sanfona', 'marimba', 'aco'];
const RITMOS = ['arpejo', 'valsa', 'marcha', 'tropical', 'pulso', 'bossa'];
const falhas = [];
for (const [id, P] of Object.entries(Som.CALMAS)){
  const soma = P.melodia.reduce((a, [, d]) => a + d, 0);
  const pede = P.acordes.length * P.compasso;
  if (Math.abs(soma - pede) > 1e-9) falhas.push(`${id}: a melodia soma ${soma} tempos, e ${P.acordes.length} compassos de ${P.compasso} pedem ${pede}`);
  if (P.timbre && !TIMBRES.includes(P.timbre)) falhas.push(`${id}: timbre "${P.timbre}" o tocador não conhece`);
  if (P.ritmo && !RITMOS.includes(P.ritmo)) falhas.push(`${id}: ritmo "${P.ritmo}" o tocador não conhece`);
  /* a melodia anda por compasso: nota que atravessa a barra do compasso
     é permitida, mas compasso que termina no meio de uma nota longa
     demais costuma ser erro de digitação — avisa só */
}
const PELO_AMBIENTE = {cemiterio:'torre', caverna:'caverna'};
for (const [id, L] of Object.entries(LOCAIS)){
  if (L.tipo !== 'cidade' || PELO_AMBIENTE[L.ambiente]) continue;
  if (!Som.CALMAS[id]) falhas.push(`a cidade ${id} não tem tema próprio em Som.CALMAS`);
}
const cidades = Object.entries(LOCAIS).filter(([id, L]) => L.tipo === 'cidade').map(([id]) => id);
console.log(`${Object.keys(Som.CALMAS).length} temas calmos; ${cidades.length} cidades no mapa`);
if (falhas.length){ console.log('\nFALHAS:\n   ' + falhas.join('\n   ')); process.exit(1); }
console.log('ok — toda melodia fecha a volta e toda cidade tem o tema dela');
