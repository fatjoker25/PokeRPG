const fs=require('fs'), vm=require('vm'), path=require('path');
const raiz=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
global.window={addEventListener(){},removeEventListener(){}}; global.document={addEventListener(){}, getElementById(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];}, body:{}};
global.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
for(const s of srcs){ if(s.startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz,s),'utf8'),{filename:s}); }
const alvo=Number(process.argv[2]||0);
for(const cap of CAPITULOS){
  if(alvo && cap.num!==alvo) continue;
  const ids=Object.keys(cap.cenas);
  const alcancado=new Set(cap.entradas || [typeof cap.inicio==='function' ? cap.inicio({}) : cap.inicio]);
  let mudou=true;
  while(mudou){ mudou=false;
    for(const id of ids){ if(!alcancado.has(id)) continue; const c=cap.cenas[id]; const alvos=[];
      (c.escolhas||[]).forEach(o=>{ if(o.vai) alvos.push(o.vai); });
      if(c.batalha) ['vitoria','derrota','fuga2','captura','gameover'].forEach(k=>{ if(typeof c.batalha[k]==='string') alvos.push(c.batalha[k]); });
      if(c.teste) ['critico','sucesso','parcial','falha'].forEach(k=>{ if(typeof c.teste[k]==='string') alvos.push(c.teste[k]); });
      if(c.sacrificio) ['aceitou','recusou','vai'].forEach(k=>{ if(typeof c.sacrificio[k]==='string') alvos.push(c.sacrificio[k]); });
      for(const a of alvos){ if(cap.cenas[a] && !alcancado.has(a)){ alcancado.add(a); mudou=true; } }
    }
  }
  const orfas=ids.filter(i=>!alcancado.has(i));
  if(orfas.length) console.log(`cap${cap.num} ÓRFÃS: ${orfas.join(', ')}`);
}
console.log('fim');
