/* chk-obtencao — todo Pokémon de Kanto tem um jeito de chegar no time,
   e todo Pokémon de Johto que anda solto também, pelas Ilhas Sevii.
   Junta as fontes que o jogo tem de verdade:
     - mato e vara (ENCONTROS; fóssil nunca, ver habitats.js);
     - inicial (os três do Professor e as tabelas da casa, entrega.js);
     - presente e luta capturável escritos nas cenas (ef.pokemon,
       criarPokemon com número, batalha selvagem ou lendária);
     - troca (só conta se o que a pessoa pede também dá pra ter);
   e fecha pelas evoluções: nível, pedra que se compra ou acha, o Link Cable, e troca
   só onde existe quem faça (TROCA_QUE_EVOLUI, abaixo).
   Quem só chega por sorteio de uma vez só (compra do depósito, uma das
   três versões de uma troca) sai como "só na sorte": não é erro, mas
   tem que ter outro caminho pra contar.
   Johto (152 a 251, menos lendário, Unown, e os que ficam pra Johto)
   não anda no mato de Kanto: vem do mato das Ilhas Sevii (o bloco de
   ENCONTROS de sevii-mundo.js), das evoluções e da creche (os bebês,
   pela linha, e o Togepi do ovo guardado). */
const fs = require('fs'), path = require('path'), vm = require('vm');
const raiz = path.join(__dirname, '..');
const ctx = {console};
vm.createContext(ctx);
for (const f of ['js/data/pokedex.js', 'js/data/habitats.js', 'js/story/mercado.js']){
  const src = fs.readFileSync(path.join(raiz, f), 'utf8').replace(/^const /gm, 'var ').replace(/^let /gm, 'var ');
  try { vm.runInContext(src, ctx, {filename:f}); }
  catch(e){ console.log(`não deu pra ler ${f}: ${e.message}`); process.exit(1); }
}
/* PEDRAS e EVO_TROCA (estado.js) e as tabelas da casa (entrega.js)
   moram em arquivos que puxam o jogo inteiro: lê só as tabelas */
let est = '';
for (const [f, nomes] of [['js/engine/estado.js', ['PEDRAS', 'EVO_TROCA', 'PEDRAS_JOHTO']],
                          ['js/story/entrega.js', ['INICIAL_DA_CIDADE', 'INICIAL_DO_JEITO']]]){
  const src = fs.readFileSync(path.join(raiz, f), 'utf8');
  if (f.endsWith('estado.js')) est = src;
  for (const nome of nomes){
    const m = src.match(new RegExp(`const ${nome} = (\\{[\\s\\S]*?\\});`));
    vm.runInContext(`var ${nome} = ${m[1]};`, ctx);
  }
}
/* o mato das Ilhas Sevii: só o bloco de ENCONTROS, sem o resto do arquivo */
{
  const src = fs.readFileSync(path.join(raiz, 'js/story/sevii-mundo.js'), 'utf8');
  const m = src.match(/Object\.assign\(ENCONTROS, (\{[\s\S]*?\n\})\);/);
  if (!m){ console.log('não achei o mato das ilhas em sevii-mundo.js'); process.exit(1); }
  vm.runInContext(`var ENCONTROS_KANTO = JSON.parse(JSON.stringify(ENCONTROS)); Object.assign(ENCONTROS, ${m[1]});`, ctx);
}
/* a creche: o bebê de cada linha e o ovo guardado */
for (const nome of ['BEBE_DA_LINHA', 'OVO_GUARDADO']){
  const src = fs.readFileSync(path.join(raiz, 'js/story/creche.js'), 'utf8');
  const m = src.match(new RegExp(`const ${nome} = ([^;]+);`));
  vm.runInContext(`var ${nome} = ${m[1]};`, ctx);
}
const {DEX, ENCONTROS, FOSSEIS, TROCAS, PEDRAS, EVO_TROCA, INICIAL_DA_CIDADE, INICIAL_DO_JEITO, BEBE_DA_LINHA, OVO_GUARDADO,
       PEDRAS_JOHTO, EVO_JOHTO_AMIZADE, EVO_JOHTO_TROCA, EVO_JOHTO_NIVEL} = ctx;
/* os que ficam pra Johto, de propósito (CLAUDE.md, "Todo Pokémon de Kanto tem caminho") */
const SO_EM_JOHTO = [201, 249, 251];

/* todos os .js de história e o PokéNav */
function arquivos(dir){
  return fs.readdirSync(path.join(raiz, dir), {withFileTypes:true}).flatMap(e =>
    e.isDirectory() ? arquivos(path.join(dir, e.name)) : e.name.endsWith('.js') ? [path.join(dir, e.name)] : []);
}
const fontes = arquivos('js/story').concat(['js/data/pokenav.js', 'js/engine/estado.js'])
  .map(f => [f, fs.readFileSync(path.join(raiz, f), 'utf8')]);
const texto = fontes.map(([, s]) => s).join('\n');

const certo = new Map(), sorte = new Map();
const poe = (m, dex, de) => { if (!m.has(dex)) m.set(dex, []); m.get(dex).push(de); };

for (const lista of Object.values(ENCONTROS)) for (const [d] of lista) if (!FOSSEIS.includes(d)) poe(certo, d, 'mato');
for (const d of [129, 60, 118, 54, 72]) poe(certo, d, 'vara');
for (const d of [1, 4, 7]) poe(certo, d, 'inicial');
for (const l of Object.values(INICIAL_DA_CIDADE).concat(Object.values(INICIAL_DO_JEITO)))
  for (const d of l) if (DEX[d] && (DEX[d].evo || Object.values(PEDRAS).some(t => t[d])) && ![132, 138, 140, 142].includes(d)) poe(sorte, d, 'inicial da casa');

for (const [f, s] of fontes){
  const onde = path.basename(f, '.js');
  for (const m of s.matchAll(/pokemon:\s*\{\s*dex:\s*(\d+)/g)) poe(certo, +m[1], `presente ${onde}`);
  for (const m of s.matchAll(/criarPokemon\(\s*(\d+)/g)) poe(certo, +m[1], `presente ${onde}`);
  for (const m of s.matchAll(/criarPokemon\(\s*Dados\.escolher\(\[([\d,\s]+)\]/g))
    for (const d of m[1].split(',')) poe(sorte, +d, `sorteio ${onde}`);
  for (const m of s.matchAll(/batalha:\{([^}]*)\}/g)){
    if (!/tipo:'(selvagem|lendario)'/.test(m[1])) continue;
    const d = m[1].match(/dex:(\d+)/);
    if (d) poe(certo, +d[1], `luta ${onde}`);
  }
}

/* fóssil: o item tem que dar pra achar (item:['Nome', n] em algum lugar)
   e o laboratório de Cinnabar tem que existir pra reviver */
const fosseis = [...est.matchAll(/'([^']+)':\s*\{tipo:'fossil'[^}]*?dex:(\d+)/g)];
const temLab = /lab_fossil/.test(texto);
for (const [, item, dex] of fosseis)
  if (temLab && texto.includes(`item:['${item}'`)) poe(certo, +dex, `fóssil (${item})`);

/* pedra só conta se der pra pôr a mão nela */
const semPrecos = texto.replace(/^\s*'[^']+':\s*\d+,.*$/gm, '');
const PEDRA_EXISTE = {};
for (const nome of Object.keys(PEDRAS).concat(Object.keys(PEDRAS_JOHTO))) PEDRA_EXISTE[nome] = semPrecos.includes(`'${nome}'`);
const pedraExiste = nome => PEDRA_EXISTE[nome];
/* troca que evolui: só quem faz por você. A figura de capuz completa,
   de novo na neblina de Lavender, o Pokémon que ela mesma deu (Kadabra,
   Haunter: lav_capuz_completa, em intuicao.js); o resto vem pronto. */
const TROCA_QUE_EVOLUI = new Set(
  (texto.match(/TROCA_QUE_EVOLUI_SERVICO\s*=\s*\[([\d,\s]*)\]/) || [, ''])[1].split(',').filter(Boolean).map(Number));
[64, 93].forEach(d => TROCA_QUE_EVOLUI.add(d));
/* o Link Cable (evolucaoPeloCabo, em estado.js) faz a troca que evolui
   sem ninguém do outro lado: conta se alguma loja vende o cabo */
const CABO_NA_LOJA = /itens:\[[^\]]*'Link Cable'/.test(texto) && /function evolucaoPeloCabo/.test(est);

const trocas = Object.values(TROCAS).flatMap(g => [].concat(g));
const fechar = () => {
  let mudou = true;
  while (mudou){
    mudou = false;
    const tem = d => certo.has(d) || sorte.has(d);
    for (const t of trocas){
      const ops = [t].concat(t.alt || []).map(o => Object.assign({}, t, o));
      for (const o of ops){
        if (!certo.has(o.pede) && !sorte.has(o.pede)) continue;
        let d = o.da.dex;
        if (t.trocaEvolui && EVO_TROCA[d]) d = EVO_TROCA[d];
        const fixo = ops.length === 1 && certo.has(o.pede);
        const m = fixo ? certo : sorte;
        if (m === sorte && certo.has(d)) continue;
        if (!(m.get(d) || []).includes(`troca ${t.id}`)){ poe(m, d, `troca ${t.id}`); mudou = true; }
      }
    }
    for (const [mapa] of [[certo], [sorte]]){
      for (const [d] of [...mapa]){
        const e = DEX[d]; if (!e) continue;
        const alvos = [];
        if (e.evo && e.nivelEvo) alvos.push([e.evo, `evolui de ${e.nome}`]);
        for (const [pedra, pares] of Object.entries(PEDRAS))
          if (pares[d] && pedraExiste(pedra)) alvos.push([pares[d], `${pedra} em ${e.nome}`]);
        if (EVO_TROCA[d] && TROCA_QUE_EVOLUI.has(d)) alvos.push([EVO_TROCA[d], `troca de ${e.nome}`]);
        else if (EVO_TROCA[d] && CABO_NA_LOJA) alvos.push([EVO_TROCA[d], `Link Cable em ${e.nome}`]);
        /* as de Johto, com a Pokédex Nacional: amizade (moral 90), a
           Pedra do Sol, o Link Cable com o item da troca e o nível dos bebês */
        if (EVO_JOHTO_AMIZADE[d]) alvos.push([EVO_JOHTO_AMIZADE[d], `amizade de ${e.nome}`]);
        if (d === 133) alvos.push([197, 'amizade de Eevee, de noite']);
        for (const [pedra, pares] of Object.entries(PEDRAS_JOHTO))
          if (pares[d] && pedraExiste(pedra)) alvos.push([pares[d], `${pedra} em ${e.nome}`]);
        if (EVO_JOHTO_TROCA[d] && CABO_NA_LOJA) alvos.push([EVO_JOHTO_TROCA[d], `Link Cable em ${e.nome}`]);
        if (EVO_JOHTO_NIVEL[d]) alvos.push([EVO_JOHTO_NIVEL[d], `evolui de ${e.nome}`]);
        for (const [a, de] of alvos){
          if (mapa === sorte && certo.has(a)) continue;
          if (!mapa.has(a)){ poe(mapa, a, de); mudou = true; }
        }
      }
    }
    /* a creche: o bebê sai da linha de quem já dá pra ter (com a Nacional) */
    for (const [linha, bebe] of Object.entries(BEBE_DA_LINHA)){
      const familia = Object.values(DEX).filter(e => e.dex <= 251 && (e.dex === +linha || e.evo === +linha || DEX[+linha].evo === e.dex)).map(e => e.dex);
      if (familia.some(d => certo.has(d)) && !certo.has(bebe)){ poe(certo, bebe, `creche (linha de ${DEX[+linha].nome})`); mudou = true; }
    }
    if (!certo.has(OVO_GUARDADO)){ poe(certo, OVO_GUARDADO, 'creche (ovo guardado)'); mudou = true; }
    for (const d of certo.keys()) sorte.delete(d);
  }
};
fechar();

const falta = [], fraco = [];
const conta = d => d <= 151 || (DEX[d] && !DEX[d].lendario && !SO_EM_JOHTO.includes(d));
for (let d = 1; d <= 251; d++){
  if (!conta(d) || certo.has(d)) continue;
  (sorte.has(d) ? fraco : falta).push(d);
}
/* e Johto não mora no mato de Kanto: só as ilhas têm espécie de lá */
const johtoEmKanto = [];
{
  const src = fs.readFileSync(path.join(raiz, 'js/data/habitats.js'), 'utf8');
  for (const [id, lista] of Object.entries(ctx.ENCONTROS_KANTO || {}))
    for (const [d] of lista) if (d > 151) johtoEmKanto.push(`${id}: ${d}`);
}
const nome = d => `${d} ${DEX[d] ? DEX[d].nome : '?'}`;
if (process.argv.includes('-v'))
  for (let d = 1; d <= 151; d++) console.log(nome(d).padEnd(18), (certo.get(d) || sorte.get(d) || ['—']).slice(0, 3).join(' · '));
for (const d of fraco) console.log(`só na sorte: ${nome(d)} (${sorte.get(d).slice(0, 3).join(' · ')})`);
for (const d of falta) console.log(`sem jeito de ter: ${nome(d)}`);
for (const x of johtoEmKanto) console.log(`Johto no mato de Kanto: ${x}`);
const total = Array.from({length:251}, (_, i) => i + 1).filter(conta).length;
console.log(falta.length || fraco.length || johtoEmKanto.length
  ? `${falta.length} sem jeito, ${fraco.length} só na sorte, de ${total}.`
  : `obtenção: os 151 de Kanto e os ${total - 151} de Johto que andam soltos têm jeito de chegar no time (Johto pelas Ilhas Sevii).`);
process.exit(falta.length || fraco.length || johtoEmKanto.length ? 1 : 0);
