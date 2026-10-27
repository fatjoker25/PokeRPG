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
/* o rosto escrito à mão em treinadores.js, antes de a estrada, os
   veteranos e a rede registrarem os de luta por cima */
let escritoAMao = {};
for (const s of srcs){
  if (s.startsWith('http')) continue;
  vm.runInThisContext(fs.readFileSync(path.join(raiz, s), 'utf8'), {filename:s});
  if (/treinadores\.js$/.test(s)) escritoAMao = Object.assign({}, RETRATO_POR_NOME);
}
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

/* ---------- rosto exclusivo ----------
   Quem ficou em casa e a Sra. Perla têm rosto só deles: nenhum outro NPC
   no mapa, nenhuma regra de rosto genérico (a senhora sem nome, o "Sra."
   de nome sorteado, o cargo). O da Perla era o de toda senhora sem nome,
   e parecia que ela estava em todo balão. E nenhum rosto de NPC é a foto
   que o jogador escolhe pra si (comparado byte a byte, porque o mesmo
   desenho entra com outro nome de arquivo). */
const arqGenerico = new Set([
  ...ROSTO_POR_PALAVRA.map(([, a]) => a).filter(Boolean)
    .flatMap(a => a === 'office' ? ['trainers/office_worker', 'trainers/office_worker_f'] : [a]),
  ...RETRATO_POR_CARGO.map(([, a]) => a), ...Object.values(ROSTO_POR_NOME_SOLTO)]);
const exclusivos = Object.entries(RETRATO_DA_CASA).map(([q, a]) => [`a casa (${q})`, a])
  .concat([['Sra. Perla', RETRATO_POR_NOME['Sra. Perla']]]);
const divide = [];
for (const [quem, arq] of exclusivos){
  if (arqGenerico.has(arq)) divide.push([quem, arq, 'rosto genérico']);
  for (const [n, a] of Object.entries(RETRATO_POR_NOME)) if (a === arq && n !== quem) divide.push([quem, arq, n]);
  if (!quem.startsWith('a casa') && Object.values(RETRATO_DA_CASA).includes(arq)) divide.push([quem, arq, 'a casa']);
}
/* E ninguém com nome fala pelo rosto da regra genérica: a Sra. Cybil com o
   rosto de toda escrevente, o Sargento Holt com o de todo guarda. Gente com
   nome é quem tem um nome da história (NOMES_DA_HISTORIA) ou nome fixo; o
   treinador de classe (estrada, veterano, quem luta na rede) fica de fora,
   porque ele é a classe dos jogos — o Pescador Andrew é pescador. */
const deClasse = new Set();
const classe = (c, n) => { if (!n) return; deClasse.add(n); if (c) deClasse.add(`${c} ${n}`); };
for (const t of (typeof TREINADORES_ESTRADA !== 'undefined' ? TREINADORES_ESTRADA : [])) classe(t.classe, t.nome);
for (const v of (typeof VETERANOS !== 'undefined' ? VETERANOS : [])){
  classe(null, v.nome); if (typeof nomeDeLuta === 'function') classe(null, nomeDeLuta(v));
  if (v.convite && v.convite.luta) classe(v.convite.luta.classe, v.convite.luta.nome);
}
if (typeof PROVAS_DA_REDE !== 'undefined'){
  const lutas = Object.values(PROVAS_DA_REDE).slice();
  SERVICOS_DA_REDE.forEach(s => s.escolhas.forEach(e => {
    if (e.luta) lutas.push(e.luta);
    ['bom', 'ruim'].forEach(k => { if (e[k] && e[k].luta) lutas.push(e[k].luta); });
  }));
  lutas.forEach(L => classe(L.classe, L.nome));
  ['Guarda Teague', 'Guarda-parque Ines', 'Oficial Rourke', 'Cientista Odran'].forEach(n => deClasse.add(n));
}
const fixos = new Set([...Object.keys(NOMES_FIXOS), ...Object.values(NOMES_FIXOS)]);
const temNomeDaHistoria = k => fixos.has(k) || String(k).split(/[\s,()]+/).some(p => NOMES_DA_HISTORIA.has(p));
/* a regra genérica de verdade: palavra, cargo e o rótulo solto que é de
   qualquer um ("os pescadores", "outro dos seis", "quem te atendeu") —
   "o Professor" e a Maeve moram no solto e são uma pessoa só */
const arqDaRegra = new Set([
  ...ROSTO_POR_PALAVRA.map(([, a]) => a).filter(Boolean)
    .flatMap(a => a === 'office' ? ['trainers/office_worker', 'trainers/office_worker_f'] : [a]),
  ...RETRATO_POR_CARGO.map(([, a]) => a),
  ...Object.entries(ROSTO_POR_NOME_SOLTO).filter(([k]) => /^(os|as|outr[oa]s?|quem)\s/i.test(k)).map(([, a]) => a)]);
const comNomeNoGenerico = [];
for (const [k, a] of Object.entries(RETRATO_POR_NOME).concat(Object.entries(ROSTO_POR_NOME_SOLTO))){
  if (deClasse.has(k) || !temNomeDaHistoria(k) || !arqDaRegra.has(a)) continue;
  comNomeNoGenerico.push([k, a]);
}
/* E o rosto de quem tem nome é só dele: nem o treinador de classe (a
   Giselle tinha a cara de toda Treinadora Ás da estrada), nem quem não
   tem nome, nem outra pessoa com nome (o Sr. Bram da banca de Saffron e
   o marceneiro de Lavender). Dois rótulos no mesmo rosto só quando são
   a mesma pessoa: o nome fixo (NOMES_FIXOS), o apelido (MESMA_PESSOA)
   ou um nome da história em comum ("Nadia" e "Nadia Arden"). Lido
   depois de tudo carregar: o registro da estrada escreve por cima do
   RETRATO_POR_NOME, e foi assim que o Caçador Roque da história falava
   com o rosto do Arruaceiro. */
const apelidos = typeof MESMA_PESSOA !== 'undefined' ? MESMA_PESSOA : {};
const quemE = k => NOMES_FIXOS[k] || apelidos[k] || k;
const nomesDe = k => new Set(String(quemE(k)).split(/[\s,()]+/).filter(p => NOMES_DA_HISTORIA.has(p)));
const mesmaPessoa = (a, b) => quemE(a) === quemE(b) || [...nomesDe(b)].some(p => nomesDe(a).has(p));
const porArquivo = new Map();
for (const [k, a] of Object.entries(RETRATO_POR_NOME).concat(Object.entries(ROSTO_POR_NOME_SOLTO)))
  (porArquivo.get(a) || porArquivo.set(a, []).get(a)).push(k);
const rostoDividido = [];
for (const [a, ks] of porArquivo){
  for (const k of ks.filter(x => !deClasse.has(x) && temNomeDaHistoria(x))){
    const outros = ks.filter(o => o !== k && !mesmaPessoa(k, o));
    if (outros.length) rostoDividido.push([k, a, outros]);
  }
}
const apelidoSobrando = Object.keys(apelidos).filter(k => !RETRATO_POR_NOME[k] && !ROSTO_POR_NOME_SOLTO[k]);
/* quem a história desenhou não pode perder o rosto pro registro de luta:
   o Roque da barreira tinha arq:'roughneck', e o registro da estrada
   trocava o rosto do Caçador Roque de todos os capítulos */
const trocadoNaCarga = Object.entries(escritoAMao).filter(([k, a]) => RETRATO_POR_NOME[k] !== a);
const bytes = arq => { try { return fs.readFileSync(path.join(raiz, caminhoNPC(arq))); } catch (e) { return null; } };
const fotos = [].concat(...Object.values(RETRATOS_DA_FICHA)).map(f => [f, bytes(PASTA_DOS_RETRATOS + f)]).filter(([, b]) => b);
const comFoto = [];
for (const arq of new Set([...Object.values(RETRATO_POR_NOME), ...Object.values(RETRATO_DA_CASA), ...arqGenerico])){
  const b = bytes(arq);
  const igual = b && fotos.find(([, f]) => f.equals(b));
  if (igual) comFoto.push([arq, igual[0]]);
}
/* nome sorteado da casa não é nome de ninguém da história: o irmão Otto
   e o rival Otto viravam o mesmo contato */
const daHistoria = new Set([...NOMES_DA_HISTORIA, ...Object.keys(RETRATO_POR_NOME)]);
const casaComNome = NOMES_DE_CASA.filter(n => daHistoria.has(n));

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
lista('Rosto que devia ser só de uma pessoa e é de outra também', divide, ([q, a, n]) => `${q}: ${a} também é de ${n}`);
lista('Gente com nome que fala pelo rosto da regra genérica', comNomeNoGenerico, ([k, a]) => `${k} → ${a}`);
lista('Gente com nome que divide o rosto com outra pessoa', rostoDividido,
  ([k, a, outros]) => `${k} → ${a}, que também é de ${outros.slice(0, 6).join(', ')}${outros.length > 6 ? '…' : ''}`);
lista('Apelido em MESMA_PESSOA que não tem rosto', apelidoSobrando, k => `${k} → ${apelidos[k]}`);
lista('Rosto escrito em treinadores.js que outro arquivo trocou na carga', trocadoNaCarga,
  ([k, a]) => `${k}: ${a} virou ${RETRATO_POR_NOME[k]}`);
lista('Rosto de NPC que é foto do jogador', comFoto, ([a, f]) => `${a} = ${PASTA_DOS_RETRATOS}${f}`);
lista('Nome sorteado da casa que já é de alguém da história', casaComNome, n => n);

const total = [...gente.keys()].filter(r => !naoEGente(r)).length;
console.log(problemas
  ? `\n${problemas} ponto(s) em ${total} pessoas que falam.`
  : `rostos e nomes: ${total} pessoas que falam, todas com rosto, e quem carrega cena tem nome.`);
process.exit(problemas ? 1 : 0);
