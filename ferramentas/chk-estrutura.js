const fs=require('fs'), vm=require('vm'), path=require('path');
const raiz=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
global.window={addEventListener(){},removeEventListener(){}};
global.document={addEventListener(){},getElementById(){return null;},querySelector(){return null;},querySelectorAll(){return [];},body:{}};
global.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
for(const s of srcs){ if(s.startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz,s),'utf8'),{filename:s}); }

console.log('cap  cenas  entradas  finais  inicio          requer');
let semVariacao = 0;
for (const cap of CAPITULOS){
  const ents = (cap.entradas || []).length;
  const fins = Object.values(cap.cenas).filter(x=>x.final).length;
  const tipoInicio = typeof cap.inicio === 'function' ? 'função' : 'fixo';
  if (ents <= 1 && tipoInicio === 'fixo') semVariacao++;
  console.log(String(cap.num).padStart(3) + '  ' + String(Object.keys(cap.cenas).length).padStart(5) +
    '  ' + String(ents).padStart(8) + '  ' + String(fins).padStart(6) +
    '  ' + tipoInicio.padEnd(14) + '  ' + (cap.requer ? 'sim' : '—'));
}
console.log('\ncapítulos que sempre abrem na mesma cena:', semVariacao, 'de', CAPITULOS.length);
console.log('capítulos com final:', CAPITULOS.filter(c=>Object.values(c.cenas).some(x=>x.final)).map(c=>c.num).join(', '));
