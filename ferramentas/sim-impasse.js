/* ============================================================
   sim-impasse — as lutas que não acabavam, repetidas
   O robô achou lutas de 60 a 150 turnos: evasão empilhada (Minimize,
   Double Team) que zerava a precisão, IA usando golpe que não afeta
   (Stomp no Gengar, Poison Gas em Veneno) e quem joga escolhendo o
   golpe pelo poder, sem olhar a defesa do outro. Cada caso aqui é uma
   dessas lutas, um contra um, com os golpes que estavam em campo.
   Mede a média de turnos, quantas passam de 30 e de 60, quantas batem
   no teto de 150 e a vitória de quem joga.

   Uso:  node ferramentas/sim-impasse.js [lutas por caso] [conta|ingenuo]
         ROOT=/outra/pasta node ferramentas/sim-impasse.js 300
   "conta" (o padrão) escolhe o golpe pelo Batalha.danoEsperado, como o
   bot-jogador; "ingenuo" pelo poder do golpe, como os outros sim-*.
   ROOT roda contra outra cópia do jogo (a de antes de uma mudança).
   ============================================================ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = process.env.ROOT || path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; }, querySelectorAll(){ return []; }, body:{}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const m of html.matchAll(/<script src="([^"]+)"/g)){ if (m[1].startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz, m[1]), 'utf8'), {filename:m[1]}); }

const N = +process.argv[2] || 300;
const MODO = process.argv[3] || 'conta';
Estado.novo({nome:'Sim', genero:'Mulher', cidade:'Pallet', casaNome:'Delia', casaQuem:'mãe', nascimento:{dia:1, mes:1}});
const d = Estado.dados;
d.capitulo = 21;
d.insignias = ['Insígnia Pedra','Insígnia Cascata','Insígnia Trovão','Insígnia Arco-Íris','Insígnia Alma','Insígnia Pântano'];

/* o golpe de quem joga: pela conta da IA, ou pelo poder (o jogador
   ingênuo dos outros simuladores); sem golpe de dano que afete, a IA */
function escolha(){
  const B = Batalha, p = B.aliado, alvo = B.inimigo;
  let melhor = -1, idx = 0;
  p.golpes.forEach((g, i) => {
    const G = GOLPES[g.nome] || {};
    if (G.c === 'status') return;
    const ef = eficacia(G.t, alvo.tipos);
    let s;
    if (MODO === 'conta' && B.danoEsperado) s = ef === 0 ? -1 : B.danoEsperado(p, alvo, B.estAliado, B.estInimigo, g.nome);
    else { const PR = PR_GOLPE[g.nome] || {}; s = ef === 0 ? -1 : ((PR.p || 1) + (p.tipos.includes(G.t) ? 1 : 0)) * ef * ((G.a || 100) / 100); }
    if (s > melhor){ melhor = s; idx = i; }
  });
  if (melhor <= 0) return B.iaEscolher(p, alvo, B.estAliado, B.estInimigo);
  return idx;
}
const com = (dex, nv, golpes) => {
  const p = criarPokemon(dex, nv, {moral:80});
  p.golpes = golpes.map(n => ({nome:n, pp:30, ppMax:30}));
  return p;
};
/* [nome, quem joga, quem está do outro lado, gasta Vontade como treinador] */
const CASOS = [
  ['Gengar 28 x Muk 38 (Koga)', () => com(94, 28, ['Lick','Confuse Ray','Night Shade','Curse']), () => com(89, 38, ['Disable','Poison Gas','Minimize','Sludge']), true],
  ['Gengar 42 x Blissey 44 (Veronica)', () => com(94, 42, ['Lick','Psywave','Night Shade','Dream Eater']), () => com(242, 44, ['Minimize','Softboiled','Light Screen','Double-Edge']), true],
  ['Victreebel 47 x Blissey 44', () => com(71, 47, ['Acid','Wrap','Poison Powder','Sleep Powder']), () => com(242, 44, ['Minimize','Softboiled','Light Screen','Double-Edge']), true],
  ['Gengar 39 x Staryu 39 (mato)', () => com(94, 39, ['Lick','Psywave','Night Shade','Dream Eater']), () => com(120, 39, ['Harden','Recover','Swift','Minimize']), false],
  ['Gengar 47 x Rhydon 49 (Blue)', () => com(94, 47, ['Lick','Psywave','Night Shade','Dream Eater']), () => com(112, 49, ['Stomp','Tail Whip','Fury Attack','Horn Drill']), true],
  ['Venusaur 60 x Corsola 28 (mato)', () => com(3, 60, ['Tackle','Razor Leaf','Leech Seed','Vine Whip']), () => com(222, 28, ['Harden','Bubble','Recover','Bubble Beam']), false]
];
console.log(`jogador: ${MODO} · ${N} lutas por caso${process.env.ROOT ? ' · ' + raiz : ''}`);
console.log('caso                                 turnos  >30   >60  teto  vitória');
for (const [nome, eu, ele, ia] of CASOS){
  let soma = 0, t30 = 0, t60 = 0, teto = 0, vit = 0;
  for (let k = 0; k < N; k++){
    const a = eu(), b = ele();
    d.time = [a];
    Batalha.iniciar(a, b, {tipo:'treinador', fuga:false, treinador:'Sim', timeInimigo:[], vontadeIA:ia});
    let t = 0;
    while (Batalha.ativo && t < 150){
      t++;
      const x = Batalha.aliado;
      if (x && x.hp * 2 <= x.hpMax && vontadeDe(x) >= 2 && Dados.chance(45) && Batalha.podeGastarVontade('esquiva')) Batalha.gastarVontade('esquiva');
      const r = Batalha.acao({tipo:'golpe', indice:escolha()});
      if ((r && r.precisaTrocar) || Batalha.fase === 'ameaca') break;
    }
    soma += t; if (t > 30) t30++; if (t > 60) t60++; if (t >= 150) teto++;
    if ((Batalha.fim && Batalha.fim.resultado === 'vitoria') || (!Batalha.ativo && Batalha.inimigo && Batalha.inimigo.hp <= 0)) vit++;
    Batalha.ativo = false;
  }
  const pc = x => String(Math.round(100 * x / N)).padStart(3) + '%';
  console.log(`${nome.padEnd(36)} ${(soma / N).toFixed(1).padStart(6)} ${pc(t30)} ${pc(t60)} ${pc(teto)}  ${pc(vit)}`);
}
