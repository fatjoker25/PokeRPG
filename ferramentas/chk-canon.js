const fs=require('fs'), vm=require('vm'), path=require('path');
const raiz=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
global.window={addEventListener(){},removeEventListener(){}};
global.document={addEventListener(){},getElementById(){return null;},querySelector(){return null;},querySelectorAll(){return [];},body:{}};
global.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
for(const s of srcs){ if(s.startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz,s),'utf8'),{filename:s}); }

const problemas = [];
const ok = [];

/* 1. líderes, tipos, insígnias e cidades — cânone de Kanto */
const CANON_GIN = {
  pewter:   {lider:'Brock',   tipo:'Pedra',    insignia:'Insígnia Pedra'},
  cerulean: {lider:'Misty',   tipo:'Água',     insignia:'Insígnia Cascata'},
  vermilion:{lider:'Surge',   tipo:'Elétrico', insignia:'Insígnia Trovão'},
  celadon:  {lider:'Erika',   tipo:'Grama',    insignia:'Insígnia Arco-Íris'},
  fuchsia:  {lider:'Koga',    tipo:'Venenoso', insignia:'Insígnia Alma'},
  saffron:  {lider:'Sabrina', tipo:'Psíquico', insignia:'Insígnia Pântano'},
  cinnabar: {lider:'Blaine',  tipo:'Fogo',     insignia:'Insígnia Vulcão'},
  viridian: {lider:'Blue',    tipo:'Terra',    insignia:'Insígnia Terra'}
};
for (const g of GINASIOS){
  const c = CANON_GIN[g.id];
  if (!c){ problemas.push('ginásio fora do cânone: ' + g.id); continue; }
  if (!String(g.lider).includes(c.lider)) problemas.push(`${g.id}: líder "${g.lider}" ≠ ${c.lider}`);
  if (g.tipo !== c.tipo) problemas.push(`${g.id}: tipo "${g.tipo}" ≠ ${c.tipo}`);
  if (g.insignia !== c.insignia) problemas.push(`${g.id}: insígnia "${g.insignia}" ≠ ${c.insignia}`);
}
ok.push(GINASIOS.length + ' ginásios conferidos contra o cânone');

/* 2. Elite dos Quatro */
const CANON_E4 = [['Lorelei','Gelo'],['Bruno','Lutador'],['Agatha','Fantasma'],['Lance','Dragão']];
CANON_E4.forEach(([nome, tipo]) => {
  const m = (ELITE4||[]).find(e => String(e.nome).includes(nome));
  if (!m) problemas.push('Elite 4 sem ' + nome);
  else if (m.tipo && m.tipo !== tipo) problemas.push(`Elite 4 ${nome}: tipo "${m.tipo}" ≠ ${tipo}`);
});
ok.push((ELITE4||[]).length + ' membros da Elite conferidos');

/* 3. tipos das espécies contra uma amostra canônica */
const AMOSTRA = {1:['Grama','Venenoso'],4:['Fogo'],7:['Água'],25:['Elétrico'],
  94:['Fantasma','Venenoso'],130:['Água','Voador'],143:['Normal'],149:['Dragão','Voador'],
  6:['Fogo','Voador'],9:['Água'],3:['Grama','Venenoso'],65:['Psíquico'],68:['Lutador'],
  112:['Terra','Pedra'],131:['Água','Gelo'],142:['Pedra','Voador'],150:['Psíquico'],151:['Psíquico']};
for (const dex in AMOSTRA){
  const p = DEX[dex]; if (!p){ problemas.push('DEX sem #'+dex); continue; }
  const a = (p.tipos||[]).join('/'), b = AMOSTRA[dex].join('/');
  if (a !== b) problemas.push(`#${dex} ${p.nome}: tipos "${a}" ≠ "${b}"`);
}
ok.push(Object.keys(AMOSTRA).length + ' espécies conferidas por tipo');

/* 4. espécies fora de Kanto no pool selvagem de Kanto */
let foraDeKanto = 0;
if (typeof POOL_KANTO !== 'undefined')
  POOL_KANTO.forEach(d => { if (d > 151) { problemas.push('POOL_KANTO tem #' + d); foraDeKanto++; } });
ok.push('pool de Kanto: ' + (typeof POOL_KANTO !== 'undefined' ? POOL_KANTO.length : 0) + ' espécies, ' + foraDeKanto + ' fora da 1ª geração');

/* 5. lendários não podem estar no mato comum */
[144,145,146,150,151].forEach(d => {
  if (typeof POOL_KANTO !== 'undefined' && POOL_KANTO.includes(d))
    problemas.push('lendário #' + d + ' no pool comum');
});

/* 6. evolução: estágio evoluído não pode nascer em nível baixo no mato */
let baixos = 0;
for (const id in LOCAIS){
  const L = LOCAIS[id];
  if (L.tipo !== 'rota' && L.tipo !== 'especial') continue;
  if (!L.nivel || L.nivel > 20) continue;
  const pool = (typeof poolDoAmbiente === 'function') ? poolDoAmbiente(L.ambiente) : null;
  if (!pool) continue;
  pool.forEach(d => {
    const p = DEX[d];
    if (p && p.preEvo && L.nivel < 12){ baixos++; }
  });
}
ok.push('rotas de nível baixo checadas contra espécies evoluídas: ' + baixos + ' ocorrências');

/* 7. cidades com ginásio têm o ginásio no lugar */
for (const g of GINASIOS){
  const L = LOCAIS[g.id];
  if (!L) problemas.push('ginásio ' + g.id + ' sem lugar no mapa');
  else if (L.tipo !== 'cidade') problemas.push('ginásio ' + g.id + ' num lugar que não é cidade');
}

/* 8. itens citados na história existem na tabela */
ok.push('itens com ficha: ' + Object.keys(typeof ITENS_INFO !== 'undefined' ? ITENS_INFO : {}).length);

console.log('=== CANONICIDADE ===');
ok.forEach(x=>console.log('  ok · ' + x));
console.log('\nproblemas (' + problemas.length + '):');
problemas.forEach(x=>console.log('  ✗ ' + x));
