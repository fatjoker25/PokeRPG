/* Acusa personagem que carrega cena e continua sem nome.
   Em cinco falas, "a atendente do Centro" é um cargo e está certo.
   Em vinte e cinco, é uma pessoa que o jogo não apresentou. */
const fs=require('fs'), path=require('path');
const dir=path.resolve(__dirname,'..','js','story');
const LIMITE = 12;                       // a partir daqui é personagem, não função
const conta = {};
for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.js'))){
  const t = fs.readFileSync(path.join(dir,f),'utf8');
  for (const m of t.matchAll(/fala\(\s*'([^']+)'/g)){
    const quem = m[1];
    (conta[quem] = conta[quem] || {n:0, onde:new Set()});
    conta[quem].n++; conta[quem].onde.add(f);
  }
}
/* nome próprio começa com maiúscula e não é artigo nem cargo solto */
const temNome = q => /^(Sr\.|Sra\.|Dr\.|Dra\.|Líder|Tenente|Auditora|Curador|Conselheir|Contramestre|Capitão|Guia|Caçador|Guarda|Prof)/.test(q)
                  || (/^[A-ZÀ-Ý]/.test(q) && !/^(A |O |Os |As |Um |Uma )/.test(q));

const sem = Object.entries(conta)
  .filter(([q,d]) => d.n >= LIMITE && !temNome(q))
  .sort((a,b)=>b[1].n-a[1].n);

if (sem.length){
  console.log(`Carregam cena e não têm nome (${LIMITE}+ falas):\n`);
  sem.forEach(([q,d]) => console.log(`  ${String(d.n).padStart(3)} falas  ${q}   [${[...d.onde].join(', ')}]`));
  console.log('\nNão é erro automático: pode ser recusa escrita de propósito.');
  console.log('Mas se ninguém escreveu a recusa, é personagem que o jogo esqueceu de apresentar.');
} else {
  console.log(`ninguém com ${LIMITE}+ falas ficou sem nome.`);
}
