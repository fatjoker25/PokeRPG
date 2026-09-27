const fs=require('fs'), vm=require('vm'), path=require('path');
const raiz=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
global.window={addEventListener(){},removeEventListener(){}}; global.document={addEventListener(){}, getElementById(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];}, body:{}};
global.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
for(const s of srcs){
  if(s.startsWith('http')) continue;
  const code=fs.readFileSync(path.join(raiz,s),'utf8');
  try{ vm.runInThisContext(code,{filename:s}); }catch(e){ console.log('ERRO AO CARREGAR',s,e.message); process.exit(1); }
}
let cenas=0, escolhas=0, erros=[];
for(const cap of CAPITULOS){
  const ids=new Set(Object.keys(cap.cenas));
  let c=0,e=0;
  const entradas = cap.entradas || [typeof cap.inicio==='function' ? cap.inicio({}) : cap.inicio];
  entradas.forEach(e=>{ if(!ids.has(e)) erros.push(`cap${cap.num} entrada -> ${e}`); });
  for(const [id,cena] of Object.entries(cap.cenas)){
    c++;
    const alvos=[];
    (cena.escolhas||[]).forEach(o=>{ e++; if(o.vai) alvos.push(o.vai); });
    if(cap.desvios && cap.desvios[id]) alvos.push(cap.desvios[id].vai);
    if(cena.batalha){ ['vitoria','derrota','fuga','captura','gameover'].forEach(k=>{ if(typeof cena.batalha[k]==='string') alvos.push(cena.batalha[k]); }); }
    if(cena.teste){ ['critico','sucesso','parcial','falha'].forEach(k=>{ if(typeof cena.teste[k]==='string') alvos.push(cena.teste[k]); }); }
    if(cena.sacrificio){ ['aceitou','recusou','vai'].forEach(k=>{ if(typeof cena.sacrificio[k]==='string') alvos.push(cena.sacrificio[k]); }); }
    for(const a of alvos){ if(a==='gameover'||a==='fim') continue; if(!ids.has(a)) erros.push(`cap${cap.num} ${id} -> ${a}`); }
    if(!cena.fim && !cena.final && !cena.batalha && !cena.teste && !cena.sacrificio && !(cena.escolhas&&cena.escolhas.length)) erros.push(`cap${cap.num} ${id} SEM SAIDA`);
  }
  cenas+=c; escolhas+=e;
  if(process.argv[2]==='-v') console.log(`Cap ${cap.num}: ${c} cenas | ${e} escolhas`);
}
console.log(`Total: ${CAPITULOS.length} capítulos | ${cenas} cenas | ${escolhas} escolhas`);
console.log(erros.length? 'ERROS: '+erros.join(' ; ') : 'ERROS: nenhum');
