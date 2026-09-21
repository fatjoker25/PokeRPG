/* Mede o caminho mais curto da entrada até o fim de cada capítulo.
   Capítulo em que dá pra chegar no fim em três cliques é capítulo que
   quase ninguém vai ver inteiro. */
const fs=require('fs'), vm=require('vm'), path=require('path');
const raiz=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
global.window={addEventListener(){},removeEventListener(){}};
global.document={addEventListener(){}, getElementById(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];}, body:{}};
global.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
for(const s of srcs){
  if(s.startsWith('http')) continue;
  try{ vm.runInThisContext(fs.readFileSync(path.join(raiz,s),'utf8'),{filename:s}); }
  catch(e){ console.log('ERRO AO CARREGAR',s,e.message); process.exit(1); }
}

const linhas=[];
for (const cap of CAPITULOS){
  const fins = new Set(Object.entries(cap.cenas)
    .filter(([,c]) => c.fim || c.final).map(([id]) => id));
  if (!fins.size){ linhas.push([cap.num, cap.titulo, Object.keys(cap.cenas).length, '—', '—', '—']); continue; }

  const entradas = cap.entradas || [typeof cap.inicio==='function' ? cap.inicio({flags:{},jogador:{},time:[],insignias:[],relogio:{},liga:{},npcs:{},cemiterio:[],pokenav:{}}) : cap.inicio];
  // largura primeiro a partir de cada entrada
  const curtos=[], longos=[];
  for (const ent of entradas){
    if (!cap.cenas[ent]) continue;
    const dist={[ent]:1}; const fila=[ent]; let menor=null;
    while (fila.length){
      const id=fila.shift();
      if (fins.has(id)){ menor = menor===null ? dist[id] : Math.min(menor, dist[id]); continue; }
      /* cena leva adiante por escolha e também por saída de batalha:
         o capítulo 1 só termina depois de uma luta, e ignorar isso fazia
         parecer que ele não tinha fim. */
      const cena=cap.cenas[id];
      const saidas=(cena.escolhas||[]).map(e=>e.vai);
      if (cena.batalha) saidas.push(cena.batalha.vitoria, cena.batalha.derrota,
                                    cena.batalha.fuga, cena.batalha.captura);
      if (cena.teste)   saidas.push(cena.teste.sucesso, cena.teste.falha);
      for (const v of saidas){
        if (!v || !cap.cenas[v] || dist[v]!==undefined) continue;
        dist[v]=dist[id]+1; fila.push(v);
      }
    }
    if (menor!==null) curtos.push(menor);
    longos.push(Object.keys(dist).length);
  }
  const min = curtos.length ? Math.min(...curtos) : '—';
  const alcance = longos.length ? Math.max(...longos) : 0;
  linhas.push([cap.num, cap.titulo, Object.keys(cap.cenas).length, min, alcance,
               Math.round(100*alcance/Object.keys(cap.cenas).length)+'%']);
}

console.log('cap  cenas  menor caminho  alcançáveis de uma entrada  título');
linhas.sort((a,b)=>(a[3]==='—'?99:a[3])-(b[3]==='—'?99:b[3]));
for (const l of linhas)
  console.log(`${String(l[0]).padStart(3)}  ${String(l[2]).padStart(5)}  ${String(l[3]).padStart(13)}  ${String(l[4]+' ('+l[5]+')').padStart(26)}  ${l[1]}`);
const nums = linhas.map(l=>l[3]).filter(x=>x!=='—');
console.log(`\nmenor caminho: mediana ${nums.sort((a,b)=>a-b)[Math.floor(nums.length/2)]}, mínimo ${Math.min(...nums)}, máximo ${Math.max(...nums)}`);
