/* Lista os finais do jogo, onde eles moram e o que leva até eles.
   Um final que nenhuma escolha alcança é um final que ninguém vê. */
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
let total=0; const ids=new Set(); const porCap=[];
for(const cap of CAPITULOS){
  const meus=[];
  // quem aponta pra cada cena
  const apontam={};
  for(const [id,cena] of Object.entries(cap.cenas))
    (cena.escolhas||[]).forEach(e=>{ if(e.vai) (apontam[e.vai]=apontam[e.vai]||[]).push(id); });
  (cap.entradas||[]).forEach(e=>(apontam[e]=apontam[e]||[]).push('ENTRADA'));
  for(const [id,cena] of Object.entries(cap.cenas)){
    if(!cena.final) continue;
    total++;
    const fid = cena.final.id || '(sem id)';
    if(ids.has(fid)) console.log(`  !! id de final repetido: ${fid} (cap ${cap.num}, cena ${id})`);
    ids.add(fid);
    const quem = apontam[id] || [];
    meus.push(`    ${fid.padEnd(24)} ${cena.final.titulo}${quem.length?'':'   <<< INALCANÇÁVEL'}`);
  }
  if(meus.length) porCap.push(`cap ${String(cap.num).padStart(2)} — ${meus.length} final(is)\n${meus.join('\n')}`);
}
console.log(porCap.join('\n\n'));
console.log(`\nTotal: ${total} finais em ${porCap.length} capítulos.`);
