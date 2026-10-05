/* chk-trocas — as três opções de cada troca comum.
   Cada pessoa troca uma vez só, e quem tem `alt` sorteia no primeiro
   contato qual dos três Pokémon vai oferecer (Trocas.versao). As três
   opções têm que ser:
     1. forma base (sem preEvo no DEX) e comum no mato (ENCONTROS, peso 5+);
     2. abaixo do nível em que evoluiriam (nivelEvo), senão chegam já
        querendo virar outra coisa;
     3. diferentes entre si, e nunca da linha do Haunter ou do Kadabra
        (esses só vêm do Sr. Juniper).
   Troca de história em volta de um Pokémon só (unica, trocaEvolui) fica
   fixa e fora da conta. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const raiz = path.join(__dirname, '..');
const ctx = {console};
vm.createContext(ctx);
for (const f of ['js/data/pokedex.js', 'js/data/habitats.js', 'js/story/mercado.js']){
  /* const de topo vira var: assim o contexto enxerga as tabelas */
  const src = fs.readFileSync(path.join(raiz, f), 'utf8').replace(/^const /gm, 'var ');
  try { vm.runInContext(src, ctx, {filename:f}); }
  catch(e){ console.log(`não deu pra ler ${f}: ${e.message}`); process.exit(1); }
}
const {DEX, ENCONTROS, TROCAS} = ctx;
const comum = new Set();
for (const lista of Object.values(ENCONTROS)) for (const [x, peso] of lista) if (peso >= 5) comum.add(x);
const SO_DO_JUNIPER = [63, 64, 65, 92, 93, 94];

let erros = 0, total = 0;
for (const grupo of Object.values(TROCAS)){
  for (const t of [].concat(grupo)){
    if (t.unica || t.trocaEvolui) continue;
    total++;
    const ops = [t].concat(t.alt || []).map(o => Object.assign({}, t, o));
    const problema = m => { erros++; console.log(`${t.id}: ${m}`); };
    if (ops.length !== 3) problema(`tem ${ops.length} opções; troca comum tem três`);
    const vistos = new Set();
    for (const o of ops){
      const e = DEX[o.da.dex];
      if (!e){ problema(`dex ${o.da.dex} não existe`); continue; }
      if (vistos.has(o.da.dex)) problema(`${e.nome} repetido`);
      vistos.add(o.da.dex);
      const temPre = Object.values(DEX).some(x => x.evo === o.da.dex);
      if (temPre) problema(`${e.nome} não é forma base`);
      if (!comum.has(o.da.dex)) problema(`${e.nome} não é comum no mato`);
      if (e.nivelEvo && o.da.nivel[1] >= e.nivelEvo) problema(`${e.nome} vem no ${o.da.nivel[1]} e evolui no ${e.nivelEvo}`);
      if (SO_DO_JUNIPER.includes(o.da.dex)) problema(`${e.nome} é da linha que só o Sr. Juniper dá`);
      if (!o.fala || !o.memoria) problema(`${e.nome} sem fala ou sem memória`);
      if (o.fala && !o.fala.includes(e.nome) && t.alt && t.alt.some(a => a.fala)) {
        /* fala que nomeia o Pokémon tem que nomear o certo */
        const outro = ops.map(x => DEX[x.da.dex].nome).find(n => n !== e.nome && o.fala.includes(n));
        if (outro) problema(`a fala do ${e.nome} fala de ${outro}`);
      }
      /* o texto escreve Nidoran♂, o DEX guarda Nidoran-M */
      const nomes = [e.nome, e.nome.replace(/-M$/, '♂').replace(/-F$/, '♀')];
      if (o.memoria && !nomes.some(n => o.memoria.includes(n))) problema(`a memória do ${e.nome} não diz ${e.nome}`);
    }
  }
}
console.log(erros ? `${erros} problema(s) em ${total} trocas comuns.` : `trocas: ${total} comuns, três opções base e comuns em cada.`);
process.exit(erros ? 1 : 0);
