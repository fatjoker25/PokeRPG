/* Acusa flag que alguém lê e ninguém escreve, e flag que alguém
   escreve e ninguém lê. A primeira é gancho morto: a cena
   condicional nunca aparece. A segunda é decisão sem consequência. */
const fs=require('fs'), path=require('path');
const raiz=path.resolve(__dirname,'..');
const dirs=['js/story','js/story/caminhos','js/engine','js/ui','js/data'];
const escritas=new Map(), lidas=new Map();
function poe(m,f,onde){ if(!m.has(f)) m.set(f,new Set()); m.get(f).add(onde); }
for(const d of dirs){
  const p=path.join(raiz,d);
  if(!fs.existsSync(p)) continue;
  for(const f of fs.readdirSync(p).filter(x=>x.endsWith('.js'))){
    const t=fs.readFileSync(path.join(p,f),'utf8');
    // escritas: flag:'x' / flag:['x','y'] / marcar('x') / marca:'x'
    for(const m of t.matchAll(/\bflag\s*:\s*'([a-zà-ÿ0-9_]+)'/g)) poe(escritas,m[1],f);
    for(const m of t.matchAll(/\bflag\s*:\s*\[([^\]]+)\]/g))
      for(const q of m[1].matchAll(/'([a-zà-ÿ0-9_]+)'/g)) poe(escritas,q[1],f);
    for(const m of t.matchAll(/\bmarcar\s*\(\s*'([a-zà-ÿ0-9_]+)'/g)) poe(escritas,m[1],f);
    // missão e ligação do PokéNav: marca:'x' vira Estado.marcar('x') na entrega
    for(const m of t.matchAll(/\bmarca\s*:\s*'([a-zà-ÿ0-9_]+)'/g)) poe(escritas,m[1],f);
    for(const m of t.matchAll(/\bflags\.([a-zà-ÿ0-9_]+)\s*=/g)) poe(escritas,m[1],f);
    for(const m of t.matchAll(/\blimpaFlag\s*:\s*'([a-zà-ÿ0-9_]+)'/g)) poe(escritas,m[1],f);
    // leituras: d.flags.x / flags['x'] / Estado.tem('x')
    for(const m of t.matchAll(/\bflags\.([a-zà-ÿ0-9_]+)/g)) poe(lidas,m[1],f);
    for(const m of t.matchAll(/\bflags\[\s*'([a-zà-ÿ0-9_]+)'/g)) poe(lidas,m[1],f);
    for(const m of t.matchAll(/\btem\s*\(\s*'([a-zà-ÿ0-9_]+)'\s*\)/g)) poe(lidas,m[1],f);
  }
}
// uma leitura que também é atribuição (flags.x = ...) não conta como leitura
/* Nem todo nome lido em flags[...] é flag de história: os ids de cargo
   moram em Estado.dados.cargos e são consultados pelo mesmo caminho, e
   alguns nomes são montados em tempo de execução. */
const cargosSrc=fs.readFileSync(path.join(raiz,'js/data/cargos.js'),'utf8');
const idsDeCargo=new Set([...cargosSrc.matchAll(/\bid\s*:\s*'([a-zà-ÿ0-9_]+)'/g)].map(m=>m[1]));
const montadas=new Set(['enfrentou_','campeao_de_kanto','oito_insignias','dex_nacional','johto_liberado']);
const ignorar=f=>idsDeCargo.has(f)||montadas.has(f);
const mortas=[...lidas.keys()].filter(f=>!escritas.has(f)&&!ignorar(f)).sort();
const mudas =[...escritas.keys()].filter(f=>!lidas.has(f)).sort();
console.log(`flags escritas: ${escritas.size} | lidas: ${lidas.size}`);
if(mortas.length){
  console.log(`\nGANCHO MORTO — lida e nunca escrita (${mortas.length}):`);
  mortas.forEach(f=>console.log(`  ${f}  <- lida em ${[...lidas.get(f)].join(', ')}`));
} else console.log('\nnenhum gancho morto.');
console.log(`\nsem leitor (${mudas.length}) — escritas e nunca consultadas, o que é normal pra marcação de registro.`);
