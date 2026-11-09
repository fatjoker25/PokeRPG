/* ============================================================
   SIMULADOR DOS GINÁSIOS NO CAPÍTULO EM QUE SÃO LUTADOS
   O sim-estrada mede o líder com o jogador no nível do ás; este mede
   cada ginásio no capítulo em que ele costuma cair (com o piso da área,
   pisoDoGinasio, valendo) e com o time do jogador abaixo da área, no
   nível dela e acima — que é o que diz se o capítulo vira parede.

   Uso:  node ferramentas/sim-ginasios.js [lutas por caso]
         GIN=saffron,viridian CAP=21 node ferramentas/sim-ginasios.js 120
   ============================================================ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; }, querySelectorAll(){ return []; }, body:{}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const m of html.matchAll(/<script src="([^"]+)"/g)){ if (m[1].startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz, m[1]), 'utf8'), {filename:m[1]}); }

/* o jogador simulado usa o golpe de dano que mais machuca (o mesmo do sim-estrada) */
function escolhaJogador(){
  const B = Batalha, p = B.aliado, alvo = B.inimigo;
  let melhor = -1, idx = 0;
  p.golpes.forEach((g, i) => {
    const G = GOLPES[g.nome] || {};
    if (G.c === 'status') return;
    const ef = eficacia(G.t, alvo.tipos);
    const PR = PR_GOLPE[g.nome] || {};
    const s = ef === 0 ? -1 : ((PR.p || 1) + (p.tipos.includes(G.t) ? 1 : 0)) * ef * ((G.a || 100) / 100);
    if (s > melhor){ melhor = s; idx = i; }
  });
  if (melhor < 0) return B.iaEscolher(p, alvo, B.estAliado, B.estInimigo);
  return idx;
}

const N = +process.argv[2] || 80;
Estado.novo({nome:'Sim', genero:'Mulher', cidade:'Pallet', casaNome:'Delia', casaQuem:'mãe', nascimento:{dia:1, mes:1}});
const d = Estado.dados;
const INS = ['Insígnia Pedra','Insígnia Cascata','Insígnia Trovão','Insígnia Arco-Íris','Insígnia Alma','Insígnia Pântano','Insígnia Vulcão','Insígnia Terra'];

/* time do jogador: o inicial pela linha e o resto sorteado dos lugares
   que a jornada já passou, na forma que o nível permite */
const LUGARES_DO_TIME = ['rota9', 'rota12', 'rota16', 'rota19', 'rota23', 'monte_lua', 'tunel_rocha'].filter(id => LOCAIS[id]);
function timeJogador(nivel, tam){
  const ini = formaAteONivel([3,6,9][Dados.entre(0,2)], nivel);
  const t = [criarPokemon(ini, nivel, {moral:80})];
  for (let i = 1; i < tam; i++){
    const loc = Dados.escolher(LUGARES_DO_TIME), L = LOCAIS[loc];
    const w = sortearSelvagem(L.ambiente, Math.max(3, nivel - 2), loc);
    t.push(criarPokemon(formaAteONivel(finalDaLinha(w.dex), nivel - 1), nivel - 1, {moral:70}));
  }
  return t;
}
function lutar(meuTime, inimigos){
  d.time = meuTime;
  Batalha.iniciar(meuTime[0], inimigos[0], {tipo:'treinador', fuga:false, treinador:'Sim', timeInimigo:inimigos.slice(1), vontadeIA:true});
  let turnos = 0, r;
  while (Batalha.ativo && turnos < 120){
    turnos++;
    { const a = Batalha.aliado; if (a && a.hp * 2 <= a.hpMax && vontadeDe(a) >= 2 && Dados.chance(45) && Batalha.podeGastarVontade('esquiva')) Batalha.gastarVontade('esquiva'); }
    r = Batalha.acao({tipo:'golpe', indice:escolhaJogador()});
    if (r && r.precisaTrocar) Batalha.acao({tipo:'trocar', uid:r.reservas[0]});
    if (Batalha.fase === 'ameaca') break;
  }
  const vivos = meuTime.filter(p => p.hp > 0).length;
  return {venceu: (Batalha.fim && Batalha.fim.resultado === 'vitoria') || (!Batalha.ativo && vivos > 0 && Batalha.inimigo.hp <= 0), caidos: meuTime.length - vivos};
}

/* o capítulo em que cada ginásio costuma cair e quantas insígnias a
   pessoa tem quando chega nele (a primeira rodada dos cinco robôs) */
const QUANDO = {pewter:[2, 0], cerulean:[3, 1], vermilion:[5, 2], celadon:[8, 3], fuchsia:[13, 4], cinnabar:[16, 5], saffron:[21, 6], viridian:[21, 7]};
const SO = process.env.GIN ? process.env.GIN.split(',') : null;
/* DIF=viridian:4,saffron:2 troca a dificuldade de um ginásio só na medição */
for (const par of (process.env.DIF || '').split(',').filter(Boolean)){ const [id, v] = par.split(':'); const g = GINASIOS.find(x => x.id === id); if (g) g.dificuldade = +v; }
const CAP = process.env.CAP ? +process.env.CAP : null;
console.log('ginásio      cap área ins  time do líder                              | jogador: área−6 / área−3 / área / área+2 (caídos na área)');
for (const g of GINASIOS){
  if (SO && !SO.includes(g.id)) continue;
  const [cap, n] = QUANDO[g.id] || [21, 6];
  d.capitulo = CAP || cap;
  d.insignias = INS.slice(0, n);
  const area = (Historia.capitulo(d.capitulo) || {}).nivelArea || 10;
  const amostra = timeGinasio(g, n);
  const tam = Math.min(6, 3 + Math.floor(n / 2) + 1);
  const res = [-6, -3, 0, 2].map(dn => {
    let v = 0, c = 0;
    for (let k = 0; k < N; k++){ const r = lutar(timeJogador(area + dn, tam), timeGinasio(g, n).map(x => criarPokemon(x.dex, x.nivel, {}))); v += r.venceu ? 1 : 0; c += r.caidos; }
    return {vit: Math.round(100 * v / N), cai: (c / N).toFixed(1)};
  });
  console.log(`${g.lider.padEnd(10)} ${String(d.capitulo).padStart(5)} ${String(area).padStart(4)} ${n}   ${amostra.map(x => DEX[x.dex].nome + ' ' + x.nivel).join(', ').padEnd(42).slice(0, 42)} | ${res.map(r => String(r.vit).padStart(3) + '%').join(' / ')}  (${res[2].cai})`);
}
