const fs=require('fs'), vm=require('vm'), path=require('path');
const raiz=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
global.window={addEventListener(){},removeEventListener(){}}; global.document={addEventListener(){}, getElementById(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];}, body:{}};
global.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
for(const s of srcs){ if(s.startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz,s),'utf8'),{filename:s}); }
Estado.novo({nome:'Teste', genero:'nb', inicial:1});
const alvo = Number(process.argv[2]||0);
let erros=0, tot=0;
for(const cap of CAPITULOS){
  if(alvo && cap.num!==alvo) continue;
  for(const [id,cena] of Object.entries(cap.cenas)){
    tot++;
    try{ (cena.texto||[]).forEach(t=>txt(t)); }catch(e){ erros++; console.log('TEXTO',cap.num,id,e.message); }
    for(const o of (cena.escolhas||[])){
      try{ txt(o.texto); if(o.cond) o.cond(Estado.dados); }catch(e){ erros++; console.log('ESCOLHA',cap.num,id,o.texto,e.message); }
    }
  }
}
console.log('cenas testadas:',tot,'erros:',erros);
