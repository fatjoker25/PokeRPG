/* chk-rostos — todo mundo que fala tem rosto, e quem carrega cena tem nome.

   Carrega o jogo inteiro (como o render.js) e junta cada pessoa que fala:
     - fala('rótulo', …) em qualquer arquivo de js/;
     - falante:, vozes: e npc:{nome:} das cenas;
     - falaComo: e nome dos contatos do PokéNav;
     - quem das trocas, rivais, líderes, Elite, veteranos e treinadores
       de estrada (que têm rosto pela classe, arq).

   ROSTO: sai pela mesma regra do balão (UI.retratoFala): o retrato do
   rótulo, o do nome fixo, ou o genérico pela palavra. Conta só se o
   arquivo existe em sprites_nds/ — caminho que não existe some calado
   na tela, e é por isso que precisa de script.

   NOME (CLAUDE.md, "Nome de personagem"):
     - quem tem 12+ falas e rótulo de função precisa de nome fixo, de
       recusa escrita ou de estar em CARGO_DE_PROPOSITO;
     - quem diz o próprio nome na fala precisa que o balão saiba
       (NOMES_FIXOS com o mesmo nome);
     - nome fixo tem que ser apresentado numa cena (Nomes.apresentar),
       senão só se descobre perguntando;
     - entrada de NOMES_FIXOS ou RECUSAM_O_NOME que ninguém usa é sobra.
   Gente de cargo com poucas falas não precisa de nome: perguntar sorteia
   um, e é assim que o projeto quer. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; },
  querySelectorAll(){ return []; }, body:{}, documentElement:{style:{setProperty(){}}}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const s of srcs){ if (!s.startsWith('http')) vm.runInThisContext(fs.readFileSync(path.join(raiz, s), 'utf8'), {filename:s}); }
Estado.novo({nome:'Teste', genero:'Mulher', cidade:'Pallet', casaNome:'Delia', casaQuem:'mãe', nascimento:{dia:3, mes:9}});

/* ---------- todos os arquivos de js/ ---------- */
function arquivos(dir){
  return fs.readdirSync(path.join(raiz, dir), {withFileTypes:true}).flatMap(e =>
    e.isDirectory() ? arquivos(path.join(dir, e.name)) : e.name.endsWith('.js') ? [path.join(dir, e.name)] : []);
}
const fontes = arquivos('js').map(f => [f, fs.readFileSync(path.join(raiz, f), 'utf8')]);
const tudo = fontes.map(([, s]) => s).join('\n');

/* ---------- quem fala ---------- */
const gente = new Map();   // rótulo -> {falas, onde:Set, tipo}
const poe = (rotulo, onde, tipo, n = 1) => {
  rotulo = String(rotulo || '').trim();
  if (!rotulo || rotulo.includes('${')) return;
  const g = gente.get(rotulo) || {falas:0, onde:new Set(), tipo:new Set()};
  g.falas += n; g.onde.add(onde); g.tipo.add(tipo);
  gente.set(rotulo, g);
};
const autoApresenta = [];   // [rótulo, nome dito, onde]
for (const [f, s] of fontes){
  const onde = path.basename(f, '.js');
  for (const m of s.matchAll(/\bfala\(\s*'([^']+)'\s*,\s*(['"`])((?:\\.|(?!\2).)*)\2/g)){
    poe(m[1], onde, 'fala');
    const dito = m[3].match(/\b(?:[Mm]eu nome é|[Mm]e chamo|[Pp]ode me chamar de)\s+((?:Sr\.|Sra\.|Dr\.|Dra\.)?\s*[A-ZÀ-Ý][a-zà-ú]+)/);
    if (dito) autoApresenta.push([m[1], dito[1].trim(), onde]);
  }
  /* fala com texto montado (variável, função): só conta, sem ler o texto */
  for (const m of s.matchAll(/\bfala\(\s*'([^']+)'\s*,\s*(?=[^\s'"`])/g)) poe(m[1], onde, 'fala');
  for (const m of s.matchAll(/\bfalante\s*:\s*'([^']+)'/g)) poe(m[1], onde, 'falante');
  for (const m of s.matchAll(/\bfalaComo\s*:\s*'([^']+)'/g)) poe(m[1], onde, 'nav');
  for (const m of s.matchAll(/\bnpc\s*:\s*\{\s*nome\s*:\s*'([^']+)'/g)) poe(m[1], onde, 'npc', 0);
  for (const m of s.matchAll(/\bvozes\s*:\s*\[([^\]]*)\]/g))
    /* P é você, N é o falante e E é papel escrito; o resto é uma terceira pessoa */
    for (const v of m[1].matchAll(/'([^']+)'/g)) if (!['P', 'N', 'E'].includes(v[1])) poe(v[1], onde, 'vozes');
}
/* o que mora em tabela */
for (const g of Object.values(TROCAS)) for (const t of [].concat(g)) poe(t.quem, 'mercado', 'troca', 3);
if (typeof CONTATOS !== 'undefined') for (const c of CONTATOS){
  const nm = typeof c.nome === 'string' ? c.nome : null;
  if (nm && !c.falaComo) poe(nm, 'pokenav', 'nav');
}
if (typeof RIVAIS_EXTRA !== 'undefined') for (const r of RIVAIS_EXTRA) poe(r.nome, 'rival', 'rival', 5);
poe('Ezra', 'rival', 'rival', 5);
if (typeof GINASIOS !== 'undefined') for (const g of Object.values(GINASIOS)) if (g && g.lider) poe(g.lider, 'ginasios', 'lider', 4);
if (typeof ELITE !== 'undefined') for (const e of [].concat(ELITE)) if (e && e.nome) poe(e.nome, 'elite', 'elite', 4);
if (typeof VETERANOS !== 'undefined') for (const v of [].concat(Object.values(VETERANOS))) if (v && v.nome) poe(v.nome, 'veteranos', 'veterano', 3);

/* ---------- rosto ---------- */
const existe = src => {
  if (!src) return false;
  if (src.startsWith('data:')) return true;
  return fs.existsSync(path.join(raiz, decodeURI(src)));
};
const rostoDo = rotulo => {
  const fixo = NOMES_FIXOS[rotulo];
  return retratoDe(rotulo) || (fixo ? retratoDe(fixo) : null) || rostoGenerico(rotulo);
};
/* quem não é gente (placa, bilhete) e o próprio jogador não precisam */
const naoEGente = r => NAO_E_GENTE.test(r) || /^(você|voce)$/i.test(r) || /^\.+$/.test(r);

const semRosto = [], rostoQuebrado = [];
for (const [r, g] of gente){
  if (naoEGente(r)) continue;
  const src = rostoDo(r);
  if (!src) semRosto.push([r, g]);
  else if (!existe(src)) rostoQuebrado.push([r, g, src]);
}

/* treinador de estrada e veterano entram no mapa de rostos pela classe
   (estrada-dados.js e veteranos.js escrevem RETRATO_POR_NOME), então
   conferir o mapa inteiro já confere os dois */
/* o mapa de rostos inteiro: entrada que aponta pra arquivo que não existe */
for (const [n, arq] of Object.entries(RETRATO_POR_NOME))
  if (!existe(caminhoNPC(arq))) rostoQuebrado.push([`[mapa] ${n}`, {falas:0, onde:new Set(['treinadores'])}, caminhoNPC(arq)]);

/* ---------- nome ---------- */
const temNomeProprio = r => !Nomes.ehAnonimo(r);
const resolvido = r => NOMES_FIXOS[r] || RECUSAM_O_NOME[r] || CARGO_DE_PROPOSITO.includes(r);
const semNome = [...gente].filter(([r, g]) => !naoEGente(r) && g.falas >= 12 && !temNomeProprio(r) && !resolvido(r));

const diz = autoApresenta.filter(([r, nome]) =>
  Nomes.ehAnonimo(r) && NOMES_FIXOS[r] !== nome && !RECUSAM_O_NOME[r]
  && !String(NOMES_FIXOS[r] || '').includes(nome));

const apresentados = new Set([...tudo.matchAll(/Nomes\.apresentar\(\s*'([^']+)'/g)].map(m => m[1]));
const usados = new Set(gente.keys());
const naoApresentado = Object.keys(NOMES_FIXOS).filter(r => usados.has(r) && !apresentados.has(r));
const sobraFixo = Object.keys(NOMES_FIXOS).filter(r => !usados.has(r) && !tudo.includes(`'${r}'`));
const sobraRecusa = Object.keys(RECUSAM_O_NOME).filter(r => !usados.has(r) && !tudo.includes(`'${r}'`));

/* ---------- relatório ---------- */
let problemas = 0;
const lista = (titulo, itens, linha) => {
  if (!itens.length) return;
  problemas += itens.length;
  console.log(`\n${titulo} (${itens.length}):`);
  itens.forEach(x => console.log('  ' + linha(x)));
};
const ondeDe = g => [...g.onde].slice(0, 5).join(', ');
lista('Fala e não tem rosto', semRosto.sort((a, b) => b[1].falas - a[1].falas),
  ([r, g]) => `${String(g.falas).padStart(3)}  ${r}   [${ondeDe(g)}]`);
lista('Rosto aponta pra arquivo que não existe', rostoQuebrado,
  ([r, g, src]) => `${r} → ${String(src).slice(0, 70)}   [${ondeDe(g)}]`);
lista('Carrega cena (12+ falas) e não tem nome, recusa nem cargo', semNome.sort((a, b) => b[1].falas - a[1].falas),
  ([r, g]) => `${String(g.falas).padStart(3)}  ${r}   [${ondeDe(g)}]`);
lista('Diz o próprio nome e o balão não sabe', diz, ([r, n, onde]) => `${r} diz "${n}"   [${onde}]`);
lista('Nome fixo que nenhuma cena apresenta', naoApresentado, r => `${r} → ${NOMES_FIXOS[r]}`);
lista('Nome fixo que ninguém usa', sobraFixo, r => `${r} → ${NOMES_FIXOS[r]}`);
lista('Recusa de nome que ninguém usa', sobraRecusa, r => r);

const total = [...gente.keys()].filter(r => !naoEGente(r)).length;
console.log(problemas
  ? `\n${problemas} ponto(s) em ${total} pessoas que falam.`
  : `rostos e nomes: ${total} pessoas que falam, todas com rosto, e quem carrega cena tem nome.`);
process.exit(problemas ? 1 : 0);
