/* Acusa personagem que carrega cena e continua sem nome.
   Em cinco falas, "a atendente do Centro" é um cargo e está certo.
   Em vinte e cinco, é uma pessoa que o jogo não apresentou. */
const fs=require('fs'), path=require('path');
const dir=path.resolve(__dirname,'..','js','story');
const LIMITE = 12;                       // a partir daqui é personagem, não função
const conta = {};
const arquivosDaHistoria = fs.readdirSync(dir).filter(x=>x.endsWith('.js'))
  .concat(fs.readdirSync(path.join(dir,'caminhos')).filter(x=>x.endsWith('.js')).map(x=>'caminhos/'+x));
for (const f of arquivosDaHistoria){
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

/* Quem já tem resposta escrita à mão em js/data/nomes.js não está
   esquecido: tem nome fixo (NOMES_FIXOS), recusa (RECUSAM_O_NOME) ou é
   cargo de propósito (CARGO_DE_PROPOSITO). */
const nomesJs = fs.readFileSync(path.resolve(__dirname,'..','js','data','nomes.js'),'utf8');
const bloco = nome => { const m = nomesJs.match(new RegExp('const ' + nome + ' = [\\[{]([\\s\\S]*?)\\n[\\]}];')); return m ? m[1] : ''; };
const resolvidos = new Set();
for (const n of ['NOMES_FIXOS','RECUSAM_O_NOME'])
  for (const m of bloco(n).matchAll(/^\s*'([^']+)'\s*:/gm)) resolvidos.add(m[1]);
for (const m of (nomesJs.match(/const CARGO_DE_PROPOSITO = \[([^\]]*)\]/) || ['',''])[1].matchAll(/'([^']+)'/g)) resolvidos.add(m[1]);

const sem = Object.entries(conta)
  .filter(([q,d]) => d.n >= LIMITE && !temNome(q) && !resolvidos.has(q))
  .sort((a,b)=>b[1].n-a[1].n);

if (sem.length){
  console.log(`Carregam cena e não têm nome (${LIMITE}+ falas):\n`);
  sem.forEach(([q,d]) => console.log(`  ${String(d.n).padStart(3)} falas  ${q}   [${[...d.onde].join(', ')}]`));
  console.log('\nNão é erro automático: pode ser recusa escrita de propósito.');
  console.log('Mas se ninguém escreveu a recusa, é personagem que o jogo esqueceu de apresentar.');
} else {
  console.log(`ninguém com ${LIMITE}+ falas ficou sem nome (${resolvidos.size} com resposta escrita em nomes.js).`);
}
