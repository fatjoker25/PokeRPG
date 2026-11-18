/* ============================================================
   SIMULADOR DA ALA DA ELITE
   A ala é a do jogo (Jogo.batalhaElite): as quatro portas seguidas,
   com quem senta nelas hoje (Titulares.membro, os substitutos e o
   Lance quando ninguém voltou) e o Red no fim, cada uma com o time de
   timeDaElite. Entre uma porta e outra não tem Centro: só o que está na
   mochila, usado como o robô usa (Revive em quem caiu, Hyper Potion em
   quem está abaixo de 60%, Full Heal na condição).

   Mede até onde um time chega pelo nível dele contra a base da
   primeira porta e pelo que ele leva na mochila. A pergunta é a dos
   robôs da quarta rodada: oitenta entradas na ala, ninguém passou da
   quarta porta, e o posto da Elite pede ter vencido a ala.

   Uso:  node ferramentas/sim-elite.js [alas por caso]
         NIVEIS=-5,0,5 MOCHILA=preparado node ferramentas/sim-elite.js 80
         TITULARES=1 node ferramentas/sim-elite.js     (os três de volta)
         SOZINHA=1 node ferramentas/sim-elite.js 200   (cada porta por si)
         DIFICULDADE=facil node ferramentas/sim-elite.js
         ENTRE=metade node ferramentas/sim-elite.js     (o que a ala dá
           entre as portas: nada, folego, metade ou tudo)
   ============================================================ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; }, querySelectorAll(){ return []; }, body:{}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const m of html.matchAll(/<script src="([^"]+)"/g)){ if (m[1].startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz, m[1]), 'utf8'), {filename:m[1]}); }

/* o jogador simulado escolhe pela conta de dano da IA, como o robô
   (Batalha.danoEsperado), e esquiva com Vontade na metade do HP */
function escolhaJogador(){
  const B = Batalha, p = B.aliado, alvo = B.inimigo;
  let melhor = -1, idx = -1;
  p.golpes.forEach((g, i) => {
    const G = GOLPES[g.nome] || {};
    if (G.c === 'status') return;
    if (eficacia(G.t, alvo.tipos) === 0) return;
    const s = B.danoEsperado(p, alvo, B.estAliado, B.estInimigo, g.nome);
    if (s > melhor){ melhor = s; idx = i; }
  });
  return idx >= 0 ? idx : B.iaEscolher(p, alvo, B.estAliado, B.estInimigo);
}

const N = +process.argv[2] || 60;
Estado.novo({nome:'Sim', genero:'Mulher', cidade:'Pallet', casaNome:'Delia', casaQuem:'mãe', nascimento:{dia:1, mes:1}});
if (process.env.DIFICULDADE) Estado.dados.config.dificuldade = process.env.DIFICULDADE;
const d = Estado.dados;
d.insignias = ['Insígnia Pedra','Insígnia Cascata','Insígnia Trovão','Insígnia Arco-Íris','Insígnia Alma','Insígnia Pântano','Insígnia Vulcão','Insígnia Terra'];
d.flags.oito_insignias = true;
/* TITULARES=1: Lorelei, Bruno e Agatha de volta às portas deles */
if (process.env.TITULARES) ['lorelei', 'bruno', 'agatha'].forEach(id => { d.flags['titular_' + id] = 'voltou'; });

/* o time: o inicial pela linha e o resto sorteado de toda a jornada, na
   forma que o nível permite (o mesmo jeito do sim-ginasios, com o fim
   do mapa incluído) */
const LUGARES_DO_TIME = ['rota9', 'rota12', 'rota16', 'rota19', 'rota23', 'monte_lua', 'tunel_rocha', 'caminho_vitoria', 'seafoam'].filter(id => LOCAIS[id]);
function timeJogador(nivel){
  const ini = formaAteONivel([3,6,9][Dados.entre(0,2)], nivel);
  const t = [criarPokemon(ini, nivel, {moral:80})];
  const linhas = new Set([raizDaLinha(ini)]);
  while (t.length < 6){
    const loc = Dados.escolher(LUGARES_DO_TIME), L = LOCAIS[loc];
    const w = sortearSelvagem(L.ambiente, Math.max(3, nivel - 2), loc);
    const dex = formaAteONivel(finalDaLinha(w.dex), nivel - 1);
    /* sem repetir linha, como o robô de hoje */
    if (linhas.has(raizDaLinha(dex))) continue;
    linhas.add(raizDaLinha(dex));
    t.push(criarPokemon(dex, nivel - 1, {moral:70}));
  }
  return t;
}
const MOCHILAS = {
  nada:{Revive:0, 'Hyper Potion':0, 'Full Heal':0},
  robo:{Revive:2, 'Hyper Potion':4, 'Full Heal':2},       // o que o robô leva hoje
  preparado:{Revive:6, 'Hyper Potion':12, 'Full Heal':4},  // quem se preparou pra ala
  /* o conselheiro da quarta rodada, o único que passou as quatro portas,
     chegou à ala com mais de cem Revives (presente, achado e missão
     juntados em três etapas parado no capítulo 21) */
  farta:{Revive:30, 'Hyper Potion':12, 'Full Heal':6}
};
/* ENTRE= o que a ala dá entre uma porta e outra, pra medir a regra:
   nada (só a mochila, a ala de hoje), folego (a Vontade volta),
   metade (a Vontade volta, a condição sai e o HP sobe metade do que
   falta, sem levantar quem caiu) e tudo (como um Centro) */
const ENTRE = process.env.ENTRE || 'nada';
function descanso(time){
  if (ENTRE === 'nada') return;
  for (const p of time){
    if (ENTRE === 'tudo'){ curarTotal(p); continue; }
    if (p.hp <= 0) continue;
    p.vontade = vontadeMaxDe(p);
    if (ENTRE === 'metade'){ p.status = null; p.hp = Math.min(p.hpMax, p.hp + Math.ceil((p.hpMax - p.hp) / 2)); }
  }
}
/* entre as portas: o que o robô faz (bot-jogador, entrePortas) */
function entrePortas(time, m){
  descanso(time);
  for (const p of time){
    if (p.hp <= 0 && m.Revive > 0){ m.Revive--; p.hp = Math.floor(p.hpMax / 2); }
    if (p.hp > 0 && p.status && m['Full Heal'] > 0){ m['Full Heal']--; p.status = null; }
    if (p.hp > 0 && p.hp < p.hpMax * .6 && m['Hyper Potion'] > 0){ m['Hyper Potion']--; p.hp = Math.min(p.hpMax, p.hp + 14); }
  }
}
function lutar(meuTime, alvo){
  d.time = meuTime;
  const time = timeDaElite(alvo);
  const meu = meuTime.find(p => p.hp > 0);
  if (!meu) return false;
  Batalha.iniciar(meu, time[0], {tipo:'treinador', fuga:false, treinador:alvo.nome, timeInimigo:time.slice(1), vontadeIA:true});
  let turnos = 0, r;
  while (Batalha.ativo && turnos < 150){
    turnos++;
    { const a = Batalha.aliado; if (a && a.hp * 2 <= a.hpMax && vontadeDe(a) >= 2 && Dados.chance(45) && Batalha.podeGastarVontade('esquiva')) Batalha.gastarVontade('esquiva'); }
    r = Batalha.acao({tipo:'golpe', indice:escolhaJogador()});
    if (r && r.precisaTrocar) Batalha.acao({tipo:'trocar', uid:r.reservas[0]});
  }
  return !!(Batalha.fim && Batalha.fim.resultado === 'vitoria');
}
/* uma ala inteira: devolve quantas portas passou (5 = Campeão) */
function ala(nivel, mochila){
  const time = timeJogador(nivel), m = Object.assign({}, MOCHILAS[mochila]);
  for (let i = 0; i < 5; i++){
    const alvo = i < 4 ? Titulares.membro(i) : CAMPEAO;
    if (!lutar(time, alvo)) return i;
    entrePortas(time, m);
  }
  return 5;
}

/* SOZINHA=1: cada porta (e o Red) com o time inteiro e curado, sem as
   outras antes: quanto cada uma pesa por si */
if (process.env.SOZINHA){
  const NV = (process.env.NIVEIS || '-5,0,5,10').split(',').map(Number), b = Titulares.membro(0).nivelBase;
  const alvos = [0, 1, 2, 3].map(i => Titulares.membro(i)).concat([CAMPEAO]);
  console.log('porta sozinha (time inteiro e curado) | ' + NV.map(o => 'nv ' + (b + o)).join(' | '));
  for (const alvo of alvos){
    const linha = NV.map(o => { let v = 0; for (let k = 0; k < N; k++) if (lutar(timeJogador(b + o), alvo)) v++; return (100 * v / N).toFixed(0).padStart(4) + '%'; });
    const t = timeDaElite(alvo).map(p => p.nome + ' ' + p.nivel).join(', ');
    console.log(`${alvo.nome.padEnd(8)} ${String(alvo.nivelBase).padEnd(3)} | ${linha.join(' | ')} | ${t}`);
  }
  process.exit(0);
}
const base = Titulares.membro(0).nivelBase;
const NIVEIS = (process.env.NIVEIS || '-10,-5,0,5,10').split(',').map(Number);
const CASOS = (process.env.MOCHILA || 'nada,robo,preparado').split(',');
console.log(`entre as portas: ${ENTRE}`);
console.log(`ala: ${[0,1,2,3].map(i => Titulares.membro(i).nome + ' ' + Titulares.membro(i).nivelBase).join(' · ')} · ${CAMPEAO.nome} ${CAMPEAO.nivelBase} (base da 1ª porta: ${base})`);
console.log('time      mochila     | passou da 1ª | da 2ª | da 3ª | da 4ª (venceu a ala) | Campeão');
for (const off of NIVEIS){
  for (const caso of CASOS){
    const conta = [0, 0, 0, 0, 0, 0];
    for (let k = 0; k < N; k++) conta[ala(base + off, caso)]++;
    const pelo = i => conta.slice(i).reduce((s, x) => s + x, 0);
    const pct = i => (100 * pelo(i) / N).toFixed(0).padStart(4) + '%';
    console.log(`${('nv ' + (base + off)).padEnd(9)} ${caso.padEnd(11)} | ${pct(1)}        | ${pct(2)} | ${pct(3)} | ${pct(4)}              | ${pct(5)}`);
  }
}
