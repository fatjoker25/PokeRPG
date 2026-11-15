const fs=require('fs'), vm=require('vm'), path=require('path');
const raiz=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
global.window={addEventListener(){},removeEventListener(){}}; global.document={addEventListener(){}, getElementById(){return null;}, querySelector(){return null;}, querySelectorAll(){return [];}, body:{}};
global.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
/* função global declarada em dois arquivos: o <script> de baixo apaga o
   de cima calado. O caminhoEntre da janela de hora dos caminhos apagou
   assim o trajeto no mapa do mundo.js */
const declarada={}, duplicadas=[];
for(const s of srcs){
  if(s.startsWith('http')) continue;
  fs.readFileSync(path.join(raiz,s),'utf8').split('\n').forEach((l,i)=>{
    const m=l.match(/^(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/);
    if(!m) return;
    if(declarada[m[1]]) duplicadas.push(`função ${m[1]} em ${declarada[m[1]]} e ${s}:${i+1}`);
    else declarada[m[1]]=`${s}:${i+1}`;
  });
}
for(const s of srcs){
  if(s.startsWith('http')) continue;
  const code=fs.readFileSync(path.join(raiz,s),'utf8');
  try{ vm.runInThisContext(code,{filename:s}); }catch(e){ console.log('ERRO AO CARREGAR',s,e.message); process.exit(1); }
}
let cenas=0, escolhas=0, erros=[...duplicadas];
/* ato que vira notícia escreve notorio dentro do rep da cena; um rep
   dentro do outro o mudarRep não lê (CLAUDE.md, "Tudo pesa na reputação") */
const repAninhado=(ef,onde)=>{ if(ef && typeof ef==='object' && ef.rep && ef.rep.rep) erros.push(`${onde}: rep dentro de rep`); };
for(const cap of CAPITULOS){
  const ids=new Set(Object.keys(cap.cenas));
  let c=0,e=0;
  const entradas = cap.entradas || [typeof cap.inicio==='function' ? cap.inicio({}) : cap.inicio];
  entradas.forEach(e=>{ if(!ids.has(e)) erros.push(`cap${cap.num} entrada -> ${e}`); });
  for(const [id,cena] of Object.entries(cap.cenas)){
    c++;
    const alvos=[];
    (cena.escolhas||[]).forEach(o=>{ e++; if(o.vai) alvos.push(o.vai); repAninhado(o.ef, `cap${cap.num} ${id} (escolha)`); });
    repAninhado(cena.ef, `cap${cap.num} ${id}`);
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
/* os eventos de cidade, de rota e os gerais */
const listasDeEvento=[].concat(...Object.values(typeof EVENTOS_CIDADE!=='undefined'?EVENTOS_CIDADE:{}),
  ...Object.values(typeof EVENTOS_ROTA!=='undefined'?EVENTOS_ROTA:{}), typeof EVENTOS_GERAIS!=='undefined'?EVENTOS_GERAIS:[]);
listasDeEvento.forEach(ev=>{ if(!ev) return; repAninhado(ev.ef, `evento ${ev.id}`); (ev.escolhas||[]).forEach(o=>repAninhado(o.ef, `evento ${ev.id} (escolha)`)); });
/* conta de capítulo com número cru, fora dos capítulos: o condicional
   (29 a 32) roda no meio da jornada, e a conta passa por capNaJornada
   (condicionais.js). Só "< 2", ">= 2" e "> 1" ficam crus: valem igual */
{
  const fsx=require('fs'), px=require('path'), raiz=px.join(__dirname,'..','js');
  const andar=dir=>fsx.readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?andar(px.join(dir,f.name)):[px.join(dir,f.name)]);
  andar(raiz).filter(f=>/\.js$/.test(f) && !/[\\/]story[\\/](cap-\d+|caminhos[\\/])/.test(f)).forEach(f=>{
    fsx.readFileSync(f,'utf8').split('\n').forEach((l,i)=>{
      const re=/\bcapitulo\)?\s*(>=|<=|<|>)\s*([\w.(]+)/g; let m;
      while((m=re.exec(l))){
        if(/capNaJornada\(/.test(l.slice(Math.max(0,m.index-40),m.index))) continue;
        if((m[1]==='<'||m[1]==='>=') && m[2]==='2' || m[1]==='>' && m[2]==='1') continue;
        erros.push(`${px.relative(px.join(__dirname,'..'),f)}:${i+1}: capítulo comparado sem capNaJornada (${m[0]})`);
      }
    });
  });
}
console.log(`Total: ${CAPITULOS.length} capítulos | ${cenas} cenas | ${escolhas} escolhas`);
console.log(erros.length? 'ERROS: '+erros.join(' ; ') : 'ERROS: nenhum');
