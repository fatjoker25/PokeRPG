/* Varre todos os ef:{...} das cenas e acusa chave que o motor não lê. */
const fs=require('fs'), path=require('path');
const src=fs.readFileSync(''+path.resolve(__dirname,'..')+'/js/story/motor.js','utf8');
const validas=new Set();
for (const m of src.matchAll(/ef\.([A-Za-zÀ-ÿ_][A-Za-z0-9_]*)/g)) validas.add(m[1]);
// chaves lidas fora do bloco aplicar()
['causa','uidAlvo','npc','rep'].forEach(k=>validas.add(k));
const dir=''+path.resolve(__dirname,'..')+'/js/story';
let achou=0;
const todos = fs.readdirSync(dir).filter(x=>x.endsWith('.js'))
  .concat(fs.readdirSync(path.join(dir,'caminhos')).filter(x=>x.endsWith('.js')).map(x=>'caminhos/'+x));
for (const f of todos){
  const t=fs.readFileSync(path.join(dir,f),'utf8');
  const linhas=t.split('\n');
  linhas.forEach((l,i)=>{
    const m=l.match(/\bef:\{(.*)$/);
    if(!m) return;
    // junta até fechar o objeto, de forma rasa
    let buf=m[1], j=i, prof=1;
    while(j<linhas.length && prof>0){
      for(const c of (j===i?m[1]:linhas[j])){ if(c==='{')prof++; else if(c==='}')prof--; }
      if(prof>0){ j++; buf+='\n'+(linhas[j]||''); }
    }
    /* Pega só as chaves de primeiro nível — e PULA o conteúdo das
       strings. Sem isso, um `registrar:'Anotou o horário e sentido do
       caminhão: ...'` faz o varredor ler a prosa de dentro das aspas
       como se fosse chave, e o validador passa a acusar sete chaves
       inventadas que não existem. Validador que mente sempre é
       validador que ninguém lê. */
    let nivel=0, chave='', esperando=true, aspa=null;
    for(let k=0;k<buf.length;k++){
      const c=buf[k];
      if(aspa){                              // dentro de string
        if(c==='\\'){ k++; continue; }        // escape: pula o próximo
        if(c===aspa) aspa=null;
        continue;
      }
      if(c==="'"||c==='"'||c==='`'){ aspa=c; chave=''; esperando=false; continue; }
      if(c==='{'||c==='['||c==='(') nivel++;
      else if(c==='}'||c===']'||c===')') nivel--;
      else if(nivel===0){
        if(esperando && /[A-Za-zÀ-ÿ_]/.test(c)) chave+=c;
        else if(esperando && /[0-9]/.test(c) && chave) chave+=c;
        else if(c===':' && chave){
          if(!validas.has(chave)){ console.log(`${f}:${i+1}  ef.${chave} não existe no motor`); achou++; }
          chave=''; esperando=false;
        }
        else if(c===','){ chave=''; esperando=true; }
        else if(!/\s/.test(c)) { chave=''; esperando=false; }
      }
    }
  });
}
console.log(achou? `\n${achou} chave(s) inventada(s).` : 'ef: nenhuma chave inventada.');
