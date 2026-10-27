/* ============================================================
   SIMULADOR DE FORÇA DO TORNEIO ABERTO
   Luta cada inscrito do Torneio Aberto (os de sempre e os que vêm da
   sua história) em cada rodada, com o motor de batalha do jogo,
   contra times do tamanho e do nível que o jogador teria em cada fase
   da jornada. O inscrito acompanha os seus três mais fortes, então a
   conta que importa é a curva: cada rodada mais dura que a anterior, e
   a mesma dureza no começo e no fim do jogo.

   Uso:  node ferramentas/sim-torneio.js [lutas por caso] [--cada]
         --cada mostra cada inscrito na final, pra achar quem destoa.
         NIVEL=0,1,3 EXTRA=0,0,1 ERRO=12,10,8 SEM_ITEM=1 trocam os
         números da rodada só na medição, pra calibrar antes de mudar.
   ============================================================ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; }, querySelectorAll(){ return []; }, body:{}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const m of html.matchAll(/<script src="([^"]+)"/g)){ if (m[1].startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz, m[1]), 'utf8'), {filename:m[1]}); }

/* o jogador simulado: o golpe de dano que mais machuca (igual ao da estrada) */
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

const N = +process.argv[2] || 30;
const CADA = process.argv.includes('--cada');
/* pra calibrar sem mexer no jogo: NIVEL=0,1,3 EXTRA=0,0,1 ERRO=12,10,8 SEM_ITEM=1 */
const lista = v => v.split(',').map(Number);
if (process.env.NIVEL) lista(process.env.NIVEL).forEach((x, i) => { NIVEL_TORNEIO[i] = x; });
if (process.env.EXTRA) lista(process.env.EXTRA).forEach((x, i) => { TAM_EXTRA_TORNEIO[i] = x; });
if (process.env.ERRO) lista(process.env.ERRO).forEach((x, i) => { ERRO_IA_TORNEIO[i] = x; });
if (process.env.SEM_ITEM) RIVAIS_TORNEIO.forEach(r => { delete r.segura; });
Estado.novo({nome:'Sim', genero:'Mulher', cidade:'Pallet', casaNome:'Delia', casaQuem:'mãe', nascimento:{dia:3, mes:9}});
const d = Estado.dados;
const INS = ['Insígnia Pedra','Insígnia Cascata','Insígnia Trovão','Insígnia Arco-Íris','Insígnia Alma','Insígnia Pântano','Insígnia Vulcão','Insígnia Terra'];

/* o time do jogador ingênuo: o inicial e o que a área dá, um nível abaixo */
function timeJogador(nivel, localId, tam){
  const L = LOCAIS[localId];
  const t = [criarPokemon(formaAteONivel([3, 6, 9][Dados.entre(0, 2)], nivel), nivel, {moral:80})];
  for (let i = 0; i < tam - 1; i++){
    const w = sortearSelvagem(L.ambiente, Math.max(3, nivel - 2), localId);
    t.push(criarPokemon(formaAteONivel(finalDaLinha(w.dex), nivel - 1), nivel - 1, {moral:70}));
  }
  return t;
}
function lutar(meu, inimigos, rodada){
  d.time = meu;
  Batalha.iniciar(meu[0], inimigos[0], {tipo:'treinador', fuga:false, treinador:'Sim', timeInimigo:inimigos.slice(1),
    erroIA:ERRO_IA_TORNEIO[rodada], vontadeIA:true});
  let turnos = 0, r;
  while (Batalha.ativo && turnos < 150){
    turnos++;
    /* o jogador simulado também gasta Vontade: esquiva na metade do HP */
    { const a = Batalha.aliado; if (a && a.hp * 2 <= a.hpMax && vontadeDe(a) >= 2 && Dados.chance(45) && Batalha.podeGastarVontade('esquiva')) Batalha.gastarVontade('esquiva'); }
    r = Batalha.acao({tipo:'golpe', indice:escolhaJogador()});
    if (r && r.precisaTrocar) Batalha.acao({tipo:'trocar', uid:r.reservas[0]});
    if (Batalha.fase === 'ameaca') break;
  }
  return {venceu: !!(Batalha.fim && Batalha.fim.resultado === 'vitoria'), caidos: meu.filter(p => p.hp <= 0).length};
}

/* fases da jornada: insígnias, nível do seu time, tamanho, de onde ele vem */
const FASES = [[1, 16, 3, 'rota3'], [3, 28, 4, 'rota9'], [5, 38, 5, 'rota16'], [6, 44, 6, 'rota23'], [8, 55, 6, 'caminho_vitoria']];
const inscritos = RIVAIS_TORNEIO.filter(r => r.linhas);   // o Ezra luta com o time de rival, medido no sim-rivais
console.log(`${inscritos.length} inscritos com time montado, ${N} lutas por inscrito e rodada`);
console.log('fase (ins/nv/tam) | quartas · semifinal · final   (vitória, caídos)   tamanho e nível do inscrito');
for (const [ins, nv, tam, loc] of FASES){
  d.insignias = INS.slice(0, ins);
  const linha = [0, 1, 2].map(rodada => {
    let v = 0, c = 0, n = 0, amostra = '';
    for (const r of inscritos) for (let k = 0; k < N; k++){
      const meu = timeJogador(nv, loc, tam); d.time = meu;
      const adv = adversarioTorneio(r, rodada);
      if (!amostra) amostra = `${adv.time.length}×${Math.min(...adv.time.map(p => p.nivel))}–${Math.max(...adv.time.map(p => p.nivel))}`;
      const x = lutar(meu, adv.time, rodada);
      v += x.venceu ? 1 : 0; c += x.caidos; n++;
    }
    return {txt:`${String(Math.round(100 * v / n)).padStart(3)}% ${(c / n).toFixed(1)}`, amostra};
  });
  console.log(`${ins}/${nv}/${tam}`.padEnd(18) + '| ' + linha.map(l => l.txt).join(' · ') + '   ' + linha.map(l => l.amostra).join(' · '));
}

if (CADA){
  /* cada inscrito em cada rodada, somando as cinco fases: quem destoa
     destoa em qualquer lugar, não só contra o time de uma área */
  console.log('\n--- cada inscrito, somando as fases: quartas · semifinal · final ---');
  for (const r of inscritos){
    const res = [0, 1, 2].map(rodada => {
      let v = 0, n = 0;
      for (const [ins, nv, tam, loc] of FASES){
        d.insignias = INS.slice(0, ins);
        for (let k = 0; k < Math.max(4, Math.round(N / 2)); k++){
          const meu = timeJogador(nv, loc, tam); d.time = meu;
          v += lutar(meu, adversarioTorneio(r, rodada).time, rodada).venceu ? 1 : 0; n++;
        }
      }
      return String(Math.round(100 * v / n)).padStart(3) + '%';
    });
    console.log(`${r.nome.padEnd(28)} ${res.join(' · ')}`);
  }
}
