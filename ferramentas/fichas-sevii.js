/* fichas-sevii — gera docs/SEVII.md a partir do elenco do jogo.

   O elenco do Torneio das Ilhas mora em js/story/sevii-elenco.js
   (ELENCO_SEVII): cada pessoa com a ficha no molde da inscrição de quem
   joga, o time e o rosto em sprites_nds/npcs/trainers/sevii_<id>.png.
   Este script lê o arquivo sem rodar o jogo e escreve a ficha de cada
   um num documento só, pra quem for levar essa gente pra outra região:
   o arquivo é a fonte, o documento é a cópia de ler.

   Uso: node ferramentas/fichas-sevii.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const raiz = path.join(__dirname, '..');
const ctx = {console, Set, Map};
vm.createContext(ctx);
/* o que o elenco toca na carga: a lista de nomes e o mapa de rostos */
vm.runInContext('var NOMES_DA_HISTORIA = new Set(); var RETRATO_POR_NOME = {};', ctx);
for (const f of ['js/data/hoenn.js', 'js/data/pokedex.js', 'js/story/sevii-elenco.js']){
  const src = fs.readFileSync(path.join(raiz, f), 'utf8').replace(/^const /gm, 'var ').replace(/^let /gm, 'var ');
  vm.runInContext(src, ctx, {filename:f});
}
const rumo = fs.readFileSync(path.join(raiz, 'js/story/rumo.js'), 'utf8');
const METAS = {};
for (const m of rumo.matchAll(/\{id:'(\w+)',\s*nome:'([^']+)'/g)) METAS[m[1]] = m[2];
const STATUS = {forca:'Força', percepcao:'Percepção', intelecto:'Intelecto', carisma:'Carisma', sorte:'Sorte', resistencia:'Resistência'};
const LUGAR = {campo:'campo', floresta:'floresta', agua:'água', caverna:'caverna', montanha:'montanha', vulcao:'vulcão',
  cidade:'cidade', ruina:'ruína', cemiterio:'cemitério'};
const {ELENCO_SEVII, LUTAS_DE_SEVII, DEX} = ctx;

/* a marca de gênero vai pelo lado de quem lê: as duas formas */
const limpa = t => String(typeof t === 'function' ? t({}) : t || '').replace(/\{([^|}]*)\|([^}]*)\}/g, '$1/$2');
const especie = d => (DEX[d] && DEX[d].nome) || `#${d}`;
const tipos = d => (DEX[d] && DEX[d].tipos || []).join('/');
const geracao = d => d <= 151 ? 'Kanto' : d <= 251 ? 'Johto' : 'Hoenn';
const data = ([dia, mes]) => `${dia} de ${['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'][mes - 1]}`;

const L = [];
L.push('# O elenco das Ilhas Sevii');
L.push('');
L.push('As fichas de quem vem pro Torneio das Ilhas, no pós-jogo (capítulos 33 a 38). Gerado por');
L.push('`node ferramentas/fichas-sevii.js` a partir de `js/story/sevii-elenco.js` — mudou lá, roda de novo.');
L.push('Cada pessoa tem a ficha no molde da inscrição de quem joga (traços, objetivo, o status forte, gostos,');
L.push('aparência) e um rosto só dela, em `sprites_nds/npcs/trainers/`. O time vai do mais fraco ao ás, com');
L.push('golpes, natureza e o item que o ás segura. O que fica pra depois (o gancho) é o fio de cada um pra outra região.');
L.push('');
L.push('| | Nome | De onde | Classe | Especialidade |');
L.push('|---|---|---|---|---|');
for (const f of ELENCO_SEVII)
  L.push(`| <img src="../sprites_nds/npcs/trainers/${f.arq}.png" width="48"> | ${f.nome} ${f.sobrenome} | ${f.de}, ${f.regiao} | ${f.classe} | ${f.tipo || 'time variado'} |`);
L.push('');

for (const f of ELENCO_SEVII){
  L.push(`## ${f.nome} ${f.sobrenome}`);
  L.push('');
  L.push(`<img src="../sprites_nds/npcs/trainers/${f.arq}.png" alt="${f.nome}" width="120">`);
  L.push('');
  L.push(`- **${f.classe}** · ${f.idade} anos · ${f.f ? 'mulher' : 'homem'} · nasceu em ${data(f.nasceu)}`);
  L.push(`- **De:** ${f.de}, ${f.regiao}`);
  L.push(`- **Especialidade:** ${f.tipo ? 'tipo ' + f.tipo : 'time variado'}`);
  L.push(`- **Traços:** ${f.tracos.join(', ')}`);
  L.push(`- **Objetivo:** ${limpa(METAS[f.meta] || f.meta)}`);
  L.push(`- **Status forte:** ${STATUS[f.forte] || f.forte}`);
  L.push(`- **Gosta de:** ${LUGAR[f.gosta.lugar] || f.gosta.lugar}, tipo ${f.gosta.tipo}, ${f.gosta.especie}`);
  L.push(`- **Não gosta de:** ${LUGAR[f.desgosta.lugar] || f.desgosta.lugar}, tipo ${f.desgosta.tipo}, ${f.desgosta.especie}`);
  L.push(`- **Aparência:** ${limpa(f.aparencia)}`);
  L.push(`- **Jeito de falar:** ${limpa(f.voz)}`);
  L.push('');
  L.push('**A jornada.** ' + f.jornada.map(limpa).join(' '));
  L.push('');
  L.push('**Por que veio.** ' + limpa(f.porque));
  L.push('');
  L.push('**O que fica pra depois.** ' + limpa(f.gancho));
  L.push('');
  L.push('**Time** (do mais fraco ao ás):');
  L.push('');
  L.push('| Pokémon | Tipo | Região | Golpes | Natureza | Item |');
  L.push('|---|---|---|---|---|---|');
  for (const [dex, golpes, nat, item] of f.time)
    L.push(`| ${(f.apelidos && f.apelidos[dex]) ? `${f.apelidos[dex]} (${especie(dex)})` : especie(dex)} | ${tipos(dex)} | ${geracao(dex)} | ${golpes.join(', ')} | ${nat} | ${item || '—'} |`);
  L.push('');
  L.push(`**No torneio:** ${limpa(f.torneio)} · **quando ganha:** ${limpa(f.vence)} · **quando perde:** ${limpa(f.perde)}`);
  L.push('');
  /* quem veio de longe: o que diz no cais do Anne, e o que liga pra contar de casa */
  if (f.despedida){
    const desp = typeof f.despedida === 'function' ? f.despedida({flags:{}, cemiterio:[]}) : f.despedida;
    L.push(`**No cais do Anne:** ${limpa(desp)}`);
    L.push('');
  }
  if ((f.deLonge || []).length){
    L.push('**De longe, no PokéNav:** ' + f.deLonge.map(t => '"' + limpa(t) + '"').join(' · '));
    L.push('');
  }
}

L.push('## Quem mais luta nas ilhas');
L.push('');
L.push('Fora do torneio, nos capítulos. O time é de linhas de Kanto e Johto (ninguém daqui tem Pokémon de Hoenn,');
L.push('menos a Noa, que tem o Sharpedo que veio grudado num casco) e acompanha o nível do seu time.');
L.push('');
L.push('| | Quem | Linhas do time |');
L.push('|---|---|---|');
for (const l of Object.values(LUTAS_DE_SEVII))
  L.push(`| <img src="../sprites_nds/npcs/trainers/${l.arq}.png" width="48"> | ${l.nome} | ${l.times.map(especie).join(', ')} |`);
L.push('');
L.push('E quem não luta: o **Sargento Lund**, a Guarda das Ilhas inteira (`sevii_lund.png`), e o **Sr. Conrad Penrose**,');
L.push('dono da fábrica de conserva fechada e patrocinador do torneio (`sevii_penrose.png`). Quem compra dele é a Casa Aster,');
L.push('uma casa de leilão pequena de Goldenrod (a dona, a filha e um homem que bate à máquina), que vende pra quem tem coleção');
L.push('com a procedência escrita à máquina. Nada da história de Kanto: o pós-jogo vale pra qualquer final. O pedido tem uma');
L.push('remessa norte: as Ilhas do Redemoinho, em Johto.');
L.push('');

fs.writeFileSync(path.join(raiz, 'docs/SEVII.md'), L.join('\n'));
console.log(`docs/SEVII.md: ${ELENCO_SEVII.length} fichas e ${Object.keys(LUTAS_DE_SEVII).length} lutas das ilhas.`);
