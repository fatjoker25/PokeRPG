/* ============================================================
   SIMULADOR DA DEFESA DO POSTO (defesa.js)
   Luta cada inscrito do Torneio Aberto como desafiante do seu ginásio
   e da sua porta, montado pelo próprio Defesa.desafiante, em cada
   degrau da fama da quadra (FAMA_DA_QUADRA), com o erro e o tamanho de
   time que a luta do jogo usa. Do lado de cá, dois jogadores:
   - ingênuo: o do sim-torneio no fim do jogo (oito insígnias, time de
     seis do Caminho da Vitória no 55, golpe pelo poder);
   - forte: o mesmo time cinco níveis acima, escolhendo o golpe pela
     conta de dano da IA (Batalha.danoEsperado), como o robô — os robôs
     da primeira rodada da defesa ganharam perto de 90% no degrau zero.

   A pergunta é se a fama morde: o degrau zero é a defesa de sempre
   (70% e 57% pro ingênuo, medidos no sim-torneio), e o teto tem que
   fazer o forte perder às vezes, senão a sequência nunca acaba.

   Uso:  node ferramentas/sim-defesa.js [lutas por inscrito e caso]
         FAMA=0/0,0/1,0/2,1/2 troca a escada só na medição (tam e itens
         de cada degrau, separados por barra), pra calibrar antes de
         mudar; ITEM=Muscle Band troca o item da fama (jeito é o do
         Dificuldade.itemDoAs); TIPO=lider|elite e JOGADOR=ingenuo|forte
         medem um caso só (dá pra rodar os quatro em paralelo).
   ============================================================ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; }, querySelectorAll(){ return []; }, body:{}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const m of html.matchAll(/<script src="([^"]+)"/g)){ if (m[1].startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz, m[1]), 'utf8'), {filename:m[1]}); }

/* o ingênuo escolhe pelo poder do golpe (o do sim-torneio) */
function golpeIngenuo(){
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
  return melhor < 0 ? B.iaEscolher(p, alvo, B.estAliado, B.estInimigo) : idx;
}
/* o forte escolhe pela conta de dano, como o robô */
function golpeForte(){
  const B = Batalha, p = B.aliado, alvo = B.inimigo;
  let melhor = -1, idx = -1;
  p.golpes.forEach((g, i) => {
    const G = GOLPES[g.nome] || {};
    if (G.c === 'status' || eficacia(G.t, alvo.tipos) === 0) return;
    const s = B.danoEsperado(p, alvo, B.estAliado, B.estInimigo, g.nome);
    if (s > melhor){ melhor = s; idx = i; }
  });
  return idx >= 0 ? idx : B.iaEscolher(p, alvo, B.estAliado, B.estInimigo);
}

const N = +process.argv[2] || 6;
if (process.env.FAMA){
  const graus = process.env.FAMA.split(',').map(g => g.split('/').map(Number));
  FAMA_DA_QUADRA.length = 0;
  graus.forEach(([tam, itens]) => FAMA_DA_QUADRA.push({tam, itens}));
}
/* o item é uma constante: a troca é por cima do desafiante, só na medição */
if (process.env.ITEM){
  const orig = Defesa.desafiante.bind(Defesa);
  Defesa.desafiante = (ins, tipo, fama) => {
    const out = orig(ins, tipo, fama);
    out.time.forEach(p => { if (p.segurando === ITEM_DA_FAMA) p.segurando = process.env.ITEM === 'jeito' ? Dificuldade.itemDoAs(p) : process.env.ITEM; });
    return out;
  };
}
Estado.novo({nome:'Sim', genero:'Mulher', cidade:'Pallet', casaNome:'Delia', casaQuem:'mãe', nascimento:{dia:3, mes:9}});
const d = Estado.dados;
d.insignias = ['Insígnia Pedra','Insígnia Cascata','Insígnia Trovão','Insígnia Arco-Íris','Insígnia Alma','Insígnia Pântano','Insígnia Vulcão','Insígnia Terra'];
d.flags.oito_insignias = true;

function timeJogador(nivel){
  const L = LOCAIS.caminho_vitoria;
  const t = [criarPokemon(formaAteONivel([3, 6, 9][Dados.entre(0, 2)], nivel), nivel, {moral:80})];
  for (let i = 0; i < 5; i++){
    const w = sortearSelvagem(L.ambiente, Math.max(3, nivel - 2), 'caminho_vitoria');
    t.push(criarPokemon(formaAteONivel(finalDaLinha(w.dex), nivel - 1), nivel - 1, {moral:70}));
  }
  return t;
}
function lutar(meu, adv, erroIA, golpe){
  d.time = meu;
  Batalha.iniciar(meu[0], adv[0], {tipo:'treinador', fuga:false, treinador:'Sim', arena:'ginasio', timeInimigo:adv.slice(1), erroIA, vontadeIA:true});
  let turnos = 0, r;
  while (Batalha.ativo && turnos < 150){
    turnos++;
    { const a = Batalha.aliado; if (a && a.hp * 2 <= a.hpMax && vontadeDe(a) >= 2 && Dados.chance(45) && Batalha.podeGastarVontade('esquiva')) Batalha.gastarVontade('esquiva'); }
    r = Batalha.acao({tipo:'golpe', indice:golpe()});
    if (r && r.precisaTrocar) Batalha.acao({tipo:'trocar', uid:r.reservas[0]});
    if (Batalha.fase === 'ameaca') break;
  }
  return {venceu:!!(Batalha.fim && Batalha.fim.resultado === 'vitoria'), turnos, caidos:meu.filter(p => p.hp <= 0).length};
}

const inscritos = RIVAIS_TORNEIO.filter(r => r.linhas && !r.cond);
const JOGADORES = [['ingênuo', 55, golpeIngenuo], ['forte', 60, golpeForte]]
  .filter(j => !process.env.JOGADOR || j[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '') === process.env.JOGADOR);
console.log(`${inscritos.length} inscritos, ${N} lutas por inscrito em cada caso`);
for (const tipo of ['lider', 'elite'].filter(t => !process.env.TIPO || t === process.env.TIPO)){
  console.log(`\n${tipo === 'lider' ? 'o seu ginásio' : 'a sua porta'} — degrau: ${JOGADORES.map(j => j[0]).join(' · ')}   (vitória, caídos de seis, turnos)   o desafiante`);
  for (let fama = 0; fama <= Defesa.famaTeto(); fama++){
    const F = Defesa.forca(tipo, fama);
    const cols = JOGADORES.map(([nome, nv, golpe]) => {
      let v = 0, c = 0, t = 0, n = 0;
      for (const ins of inscritos) for (let k = 0; k < N; k++){
        const meu = timeJogador(nv); d.time = meu;
        const adv = Defesa.desafiante(ins, tipo, fama);
        const x = lutar(meu, adv.time, F.erroIA, golpe);
        v += x.venceu ? 1 : 0; c += x.caidos; t += x.turnos; n++;
      }
      return `${String(Math.round(100 * v / n)).padStart(3)}% ${(c / n).toFixed(1)} ${Math.round(t / n)}t`;
    });
    d.time = timeJogador(55);
    const am = Defesa.desafiante(inscritos[0], tipo, fama).time;
    console.log(`  ${fama}`.padEnd(6) + cols.join('  ·  ') + `   ${am.length} Pokémon (${am.filter(p => p.segurando === ITEM_DA_FAMA).length} com ${ITEM_DA_FAMA}), ás ${Math.max(...am.map(p => p.nivel))} contra a referência ${nivelDeReferencia()}, erro ${F.erroIA}%`);
  }
}
