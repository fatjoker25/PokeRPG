const fs=require('fs'), vm=require('vm'), path=require('path');
const raiz=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
global.window={addEventListener(){},removeEventListener(){}};
global.document={addEventListener(){},getElementById(){return null;},querySelector(){return null;},querySelectorAll(){return [];},body:{}};
global.localStorage={getItem(){return null;},setItem(){},removeItem(){}};
for(const s of srcs){ if(s.startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz,s),'utf8'),{filename:s}); }

const REGRAS = [
  ['espaço duplo',            /[^\n] {2,}[^\n]/],
  ['espaço antes de vírgula', / ,/],
  ['espaço antes de ponto',   / \.(?![.\w])/],
  ['palavra repetida',        /(^|[^A-Za-zÀ-ÿ])([A-Za-zÀ-ÿ]{2,}) \2(?![A-Za-zÀ-ÿ])/],
  ['"voce" sem acento',       /\bvoce\b/],
  ['"nao" sem acento',        /\bnao\b/],
  ['"tambem" sem acento',     /\btambem\b/],
  ['"ja" sem acento',         /\bja\b/],
  ['"ate" sem acento',        /\bate\b(?! )/],
  ['"esta" verbo sem acento', /\besta (?:com|em|na|no|aqui|ali|lá|sendo|indo|fazendo|falando)\b/],
  ['"tres" sem acento',       /\btres\b/],
  ['"e" no lugar de "é"',     /(?:^|[.!?] )(?:Ele|Ela|Isso|Aquilo|Você|Aqui|Ali) e\b/],
  ['reticências erradas',     /\.{4,}/],
  ['ponto duplicado',         /[^.]\.\.(?!\.)/],
  ['interrogação dupla',      /\?{2,}(?!\?)/],
  ['aspas desbalanceadas',    null]
];

let total=0; const achados={};
const ver = (texto, onde) => {
  if (typeof texto !== 'string') return;
  for (const [nome, re] of REGRAS){
    if (!re) continue;
    if (re.test(texto)){
      const mm = texto.match(re);
      const i = mm ? mm.index : 0;
      (achados[nome] = achados[nome] || []).push(onde + ' :: ...' + texto.slice(Math.max(0,i-45), i+45) + '...');
      total++;
    }
  }
  const aspas = (texto.match(/"/g) || []).length;
  if (aspas % 2 === 1){ (achados['aspas desbalanceadas'] = achados['aspas desbalanceadas'] || []).push(onde + ' :: ' + texto.slice(0,110)); total++; }
};

const anda = (v, onde) => {
  if (typeof v === 'string') return ver(v, onde);
  if (Array.isArray(v)) return v.forEach((x,i)=>anda(x, onde));
  if (v && typeof v === 'object'){
    for (const k of ['texto','diz','resultado','sub','titulo','linha','resumo','ar','nome','motivo','memoria','dica','onde'])
      if (v[k] !== undefined) anda(v[k], onde);
    if (v.escolhas) v.escolhas.forEach(e=>anda(e, onde));
    if (v.bom) anda(v.bom, onde); if (v.ruim) anda(v.ruim, onde);
  }
};

for (const cap of CAPITULOS)
  for (const id in cap.cenas) anda(cap.cenas[id], 'cap'+cap.num+'/'+id);
for (const lista of [EVENTOS_GERAIS, ...Object.values(EVENTOS_CIDADE), ...Object.values(EVENTOS_ROTA)])
  (lista||[]).forEach(ev => anda(ev, 'evento/'+ev.id));
(CONTATOS||[]).forEach(c => anda(c, 'nav/'+c.id));
(CARGOS||[]).forEach(c => anda(c, 'cargo/'+c.id));

console.log('possíveis problemas de escrita:', total);
for (const k in achados){
  console.log('\n' + k + ' (' + achados[k].length + ')');
  achados[k].slice(0,4).forEach(x=>console.log('   ' + x.replace(/\n/g,' ')));
}
