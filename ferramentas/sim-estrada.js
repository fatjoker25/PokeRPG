/* ============================================================
   SIMULADOR DE FORÇA DA ESTRADA
   Luta cada treinador de estrada contra times do tamanho e do nível
   que o jogador teria naquela fase (3 Pokémon no começo, até 6 no
   fim; nível da rota −3, +2 e +5), com o motor de batalha do jogo, e
   compara com os selvagens da área e com os líderes de ginásio.

   Uso:  node ferramentas/sim-estrada.js [lutas por caso] [--detalhe]
         LOCS=rota16,rota19 node ferramentas/sim-estrada.js 60 --detalhe

   O jogador simulado usa o golpe de dano que mais machuca; a IA do
   inimigo nos dois lados deixava o seu Pokémon dando Growl a luta toda.
   ============================================================ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; }, querySelectorAll(){ return []; }, body:{}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const m of html.matchAll(/<script src="([^"]+)"/g)){ if (m[1].startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz, m[1]), 'utf8'), {filename:m[1]}); }
if (!process.argv.includes('--detalhe')) process.env.RESUMO = '1';
/* política do jogador simulado: o golpe de dano que a IA do jogo pontua
   mais alto; status só quando não há golpe de dano que funcione */
global.escolhaJogador = function(){
  const B = Batalha, p = B.aliado, alvo = B.inimigo;
  let melhor = -1, idx = 0;
  p.golpes.forEach((g, i) => {
    if (g.pp <= 0) return;
    const G = GOLPES[g.nome] || {};
    if (G.c === 'status') return;
    const salvo = p.golpes; p.golpes = [g];
    /* reaproveita a conta de dano esperado da IA, golpe a golpe */
    const antes = Dados.chance; Dados.chance = () => false;
    const k = B.iaEscolher(p, alvo, B.estAliado, B.estInimigo);
    Dados.chance = antes; p.golpes = salvo;
    const ef = eficacia(G.t, alvo.tipos);
    const PR = PR_GOLPE[g.nome] || {};
    const s = ef === 0 ? -1 : ((PR.p || 1) + (p.tipos.includes(G.t) ? 1 : 0)) * ef * ((G.a || 100) / 100);
    if (s > melhor){ melhor = s; idx = i; }
  });
  if (melhor < 0) return B.iaEscolher(p, alvo, B.estAliado, B.estInimigo);
  return idx;
};

const N = +process.argv[2] || 40;
Estado.novo({nome:'Sim', genero:'Mulher', cidade:'Pallet', idade:15, casaNome:'Delia', casaQuem:'mãe'});
const d = Estado.dados;
const INS = ['Insígnia Pedra','Insígnia Cascata','Insígnia Trovão','Insígnia Arco-Íris','Insígnia Alma','Insígnia Pântano','Insígnia Vulcão','Insígnia Terra'];
/* insígnias típicas de quem passa por uma rota, pelo nível dela */
const insDoLugar = nv => nv <= 13 ? 1 : nv <= 20 ? 2 : nv <= 24 ? 3 : nv <= 28 ? 4 : nv <= 33 ? 5 : nv <= 38 ? 6 : nv <= 44 ? 7 : 8;
/* time do jogador: inicial pela linha + dois da área */
function timeJogador(nivel, localId){
  const ini = formaAteONivel([3,6,9][Dados.entre(0,2)], nivel);
  const L = LOCAIS[localId];
  const t = [criarPokemon(ini, nivel, {moral:80})];
  const n = d.insignias.length;
  const tam = Math.min(6, 3 + Math.floor(n / 2));
  for (let i = 0; i < tam - 1; i++){
    const w = sortearSelvagem(L.ambiente, Math.max(3, nivel - 2), localId);
    t.push(criarPokemon(formaAteONivel(finalDaLinha(w.dex), nivel - 1), nivel - 1, {moral:70}));
  }
  return t;
}
/* luta inteira, os dois lados pela IA do jogo */
function lutar(meuTime, inimigos, tipo){
  d.time = meuTime;
  Batalha.iniciar(meuTime[0], inimigos[0], {tipo, fuga:false, treinador:'Sim', timeInimigo:inimigos.slice(1)});
  let turnos = 0, r;
  while (Batalha.ativo && turnos < 80){
    turnos++;
    const i = escolhaJogador();
    r = Batalha.acao({tipo:'golpe', indice:i});
    if (r && r.precisaTrocar) Batalha.acao({tipo:'trocar', uid:r.reservas[0]});
    if (Batalha.fase === 'ameaca') break;
  }
  const vivos = meuTime.filter(p => p.hp > 0).length;
  const hp = meuTime.reduce((a,p) => a + Math.max(0,p.hp), 0) / meuTime.reduce((a,p) => a + p.hpMax, 0);
  return {venceu: Batalha.fim && Batalha.fim.resultado === 'vitoria' || (!Batalha.ativo && vivos > 0 && Batalha.inimigo.hp <= 0), caidos: meuTime.length - vivos, hp, turnos};
}
function medir(fazInimigos, nivel, localId, tipo){
  let v = 0, cai = 0, hp = 0, tur = 0;
  for (let k = 0; k < N; k++){
    const r = lutar(timeJogador(nivel, localId), fazInimigos(), tipo);
    v += r.venceu ? 1 : 0; cai += r.caidos; hp += r.hp; tur += r.turnos;
  }
  return {vit: Math.round(100 * v / N), cai: (cai / N).toFixed(1), hp: Math.round(100 * hp / N), tur: Math.round(tur / N)};
}
const linhas = [];
const porLocal = {};
const LOCS = process.env.LOCS ? process.env.LOCS.split(',') : null;
for (const t of TREINADORES_ESTRADA){
  if (LOCS && !LOCS.includes(t.local)) continue;
  const L = LOCAIS[t.local]; const n = insDoLugar(L.nivel);
  d.insignias = INS.slice(0, n);
  const amostra = timeEstrada(t);
  const res = {};
  for (const [rot, dn] of [['abaixo', -3], ['par', 2], ['treinado', 5]])
    res[rot] = medir(() => timeEstrada(t), Math.max(5, L.nivel + dn), t.local, 'treinador');
  linhas.push({id:t.id, local:t.local, nvRota:L.nivel, ins:n, time:amostra.map(p=>p.nome+' '+p.nivel).join(', '), ...res});
  (porLocal[t.local] = porLocal[t.local] || []).push(res.par.vit);
}
if (process.env.RESUMO){
  const grupos = {};
  for (const l of linhas){ const g = grupos[l.local] = grupos[l.local] || {nv:l.nvRota, ins:l.ins, a:[], p:[], t:[], c:[], h:[]};
    g.a.push(l.abaixo.vit); g.p.push(l.par.vit); g.t.push(l.treinado.vit); g.c.push(+l.par.cai); g.h.push(l.par.hp); }
  const m = a => Math.round(a.reduce((x,y)=>x+y,0)/a.length);
  console.log('rota             nv ins  vitória abaixo / par / treinado  · caídos(par) · HP que sobra(par)');
  for (const [loc,g] of Object.entries(grupos)) console.log(`${loc.padEnd(16)}${String(g.nv).padStart(3)}  ${g.ins}   ${String(m(g.a)).padStart(3)}% / ${String(m(g.p)).padStart(3)}% / ${String(m(g.t)).padStart(3)}%   · ${(g.c.reduce((x,y)=>x+y,0)/g.c.length).toFixed(1)} · ${m(g.h)}%`);
} else
console.log('treinador        rota(nv) ins  time do treinador                                         | vitória abaixo/par/treinado · caídos no par · HP que sobra no par');
if (!process.env.RESUMO) for (const l of linhas) console.log(`${l.id.padEnd(10)} ${l.local.padEnd(15)}${String(l.nvRota).padStart(3)}  ${l.ins}  ${l.time.padEnd(58).slice(0,58)} | ${String(l.abaixo.vit).padStart(3)}% ${String(l.par.vit).padStart(3)}% ${String(l.treinado.vit).padStart(3)}%  · ${l.par.cai} · ${l.par.hp}%`);
/* selvagem e líder na mesma fase, pra comparar */
if (process.env.LOCS) process.exit(0);
console.log('\n--- referência: selvagem da área e líder de ginásio, com o jogador no par ---');
for (const loc of ['rota1','floresta','monte_lua','rota24','rota9','rota8','rota12','rota16','rota19','rota23']){
  const L = LOCAIS[loc]; const n = insDoLugar(L.nivel); d.insignias = INS.slice(0, n);
  const s = medir(() => [sortearSelvagem(L.ambiente, L.nivel, loc)], L.nivel + 2, loc, 'selvagem');
  console.log(`selvagem ${loc.padEnd(12)} nv ${L.nivel}: vitória ${s.vit}% · HP que sobra ${s.hp}%`);
}
for (const g of GINASIOS){
  for (const n of [0, 2, 4, 6]){
    d.insignias = INS.slice(0, n);
    const lista = timeGinasio(g, n);
    const nvAce = Math.max(...lista.map(x => x.nivel));
    const s = medir(() => timeGinasio(g, n).map(x => criarPokemon(x.dex, x.nivel, {})), nvAce, 'rota1', 'treinador');
    console.log(`líder ${g.lider.padEnd(10)} ${n} ins, ace nv ${nvAce}, jogador no nível do ace: vitória ${s.vit}% · caídos ${s.cai}`);
  }
}
