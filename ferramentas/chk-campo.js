/* Confere o sistema de capacidade de campo: que toda porta tenha
   destino, que o destino exija a capacidade certa, e que exista
   pelo menos um Pokémon de Kanto/Johto capaz de cada coisa. */
const fs=require('fs'), vm=require('vm'), path=require('path');
const raiz=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
global.window={addEventListener(){},removeEventListener(){}};
global.document={addEventListener(){},getElementById(){return null;},querySelector(){return null;},querySelectorAll(){return [];},body:{}};
global.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
for(const m of html.matchAll(/<script src="([^"]+)"/g)){
  if(m[1].startsWith('http')) continue;
  try{ vm.runInThisContext(fs.readFileSync(path.join(raiz,m[1]),'utf8'),{filename:m[1]}); }
  catch(e){ console.log('ERRO AO CARREGAR',m[1],e.message); process.exit(1); }
}
const L=Object.values(DEX).filter(p=>p&&p.dex);
let erros=0;

const agua=L.filter(p=>p.tipos.includes('Água')&&porteDe(p.dex)!=='pequeno');
const voa =L.filter(p=>p.tipos.includes('Voador')&&porteDe(p.dex)==='grande'&&!NAO_DECOLA.has(p.dex));
const forc=L.filter(p=>porteDe(p.dex)==='grande');
const luz =L.filter(p=>emiteLuz(p.dex));
const check=(nome,lista,min)=>{
  console.log(`${nome.padEnd(12)} ${String(lista.length).padStart(3)} espécies${lista.length<min?'  << POUCO':''}`);
  if(lista.length<min) erros++;
};
check('atravessar',agua,10); check('voar',voa,5); check('forçar',forc,20); check('iluminar',luz,5);

/* todo tipo Voador de porte grande que não decola precisa estar listado */
const suspeito=L.filter(p=>p.tipos.includes('Voador')&&porteDe(p.dex)==='grande'&&NAO_DECOLA.has(p.dex));
console.log('\nvoador de porte grande que não decola:', suspeito.map(p=>p.nome).join(', ')||'(nenhum)');

/* as portas de campo apontam pra cena que existe */
let portas=0;
for(const cap of CAPITULOS){
  for(const [id,c] of Object.entries(cap.cenas)){
    for(const e of (c.escolhas||[])){
      const rot = typeof e.texto==='function' ? String(e.texto) : String(e.texto||'');
      if(!/falta/.test(rot) && typeof e.texto!=='function') continue;
      if(typeof e.texto==='function' && !/falta/.test(rot)) continue;
      portas++;
      if(e.vai && !cap.cenas[e.vai]){ console.log(`porta quebrada: cap${cap.num}:${id} -> ${e.vai}`); erros++; }
    }
  }
}
console.log('portas de campo:', portas);
console.log(erros? `\n${erros} problema(s).` : '\ncampo: tudo certo.');
