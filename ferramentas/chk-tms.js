/* chk-tms — toda TM tem de onde sair, e todo disco tem a cor certa.

   Fontes: loja (os andares de LOJAS, inclusive o que tms.js empurra pro
   2º andar de Celadon), prêmio de líder (GINASIOS), prêmio de veterano
   (VETERANOS) e o chão (TM_NO_CAMPO, em vasculhar.js). TM sem fonte é TM
   que ninguém nunca vai ter. Também confere que toda TM tem preço de
   tabela (o balcão compra) e que o ícone do disco é o do tipo do golpe. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; },
  querySelectorAll(){ return []; }, body:{}, documentElement:{style:{setProperty(){}}}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const s of [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]))
  if (!s.startsWith('http')) vm.runInThisContext(fs.readFileSync(path.join(raiz, s), 'utf8'), {filename:s});

const tms = Object.entries(ITENS_INFO).filter(([, i]) => i.tipo === 'tm').map(([n]) => n);
const fontes = {};
const add = (n, f) => { if (tms.includes(n)) (fontes[n] = fontes[n] || new Set()).add(f); };
for (const [id, L] of Object.entries(LOJAS))
  for (const n of new Set([...(L.itens || []), ...((L.andares || []).flatMap(a => a.itens))])) add(n, 'loja ' + id);
for (const g of Object.values(GINASIOS)) for (const n of Object.keys((g.premio || {}).itens || {})) add(n, 'líder ' + g.lider);
for (const v of [].concat(Object.values(VETERANOS))) for (const n of Object.keys(v.premio || {})) add(n, 'veterano ' + v.nome);
for (const [id, l] of Object.entries(TM_NO_CAMPO)) for (const x of l) add(x.tm, 'chão ' + id);

const falhas = [];
for (const n of tms) if (!fontes[n]) falhas.push(`${n}: ninguém dá, ninguém vende, ninguém acha`);
for (const n of tms) if (!PRECO_BASE[n]) falhas.push(`${n}: sem preço de tabela, o balcão não compra`);
for (const [id, l] of Object.entries(TM_NO_CAMPO)){
  if (!LOCAIS[id]) falhas.push(`TM_NO_CAMPO.${id}: lugar que não existe`);
  else if (!['rota', 'especial'].includes(LOCAIS[id].tipo)) falhas.push(`TM_NO_CAMPO.${id}: ${LOCAIS[id].tipo} não tem vasculhar`);
  for (const x of l) if (!ITENS_INFO[x.tm]) falhas.push(`TM_NO_CAMPO.${id}: ${x.tm} não é item`);
}
/* o disco: o arquivo é o do tipo do golpe, e existe */
for (const n of tms){
  const g = GOLPES[ITENS_INFO[n].golpe];
  const arq = arquivoTM(n);
  if (!g || !arq) { falhas.push(`${n}: sem disco`); continue; }
  if (arq !== 'tms/tm_' + TM_ARQ_TIPO[g.t]) falhas.push(`${n}: disco ${arq}, golpe é ${g.t}`);
  if (!fs.existsSync(path.join(raiz, 'sprites_nds/items', arq + '.png'))) falhas.push(`${n}: ${arq}.png não existe`);
}
if (falhas.length){ console.log('FALHAS:'); falhas.forEach(f => console.log(' - ' + f)); process.exit(1); }
const por = {}; for (const n of tms) for (const f of fontes[n]) { const k = f.split(' ')[0]; por[k] = (por[k] || 0) + 1; }
console.log(`ok — ${tms.length} TMs, todas com fonte (${Object.entries(por).map(([k, v]) => k + ' ' + v).join(' · ')}), preço e disco do tipo certo`);
