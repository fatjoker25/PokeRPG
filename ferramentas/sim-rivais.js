/* ============================================================
   SIMULADOR DE FORÇA DOS RIVAIS EXTRAS
   Luta cada rival extra (Lior, Nolan, Rory, Otto, Diana) em cada
   passagem dele, com o motor de batalha do jogo, contra times do
   tamanho e do nível que o jogador teria ali: na área do capítulo
   (+0) e quatro acima (+4). O nível do rival acompanha a média do
   seu time (nivelRivalExtra), então o +4 mexe pouco: o que pesa é o
   time dele e a forma em que ele chega — e o nível mínimo de forma
   evoluída (o Rhydon da Diana nunca abaixo do 42).

   Uso:  node ferramentas/sim-rivais.js [lutas por caso] [ids]
         node ferramentas/sim-rivais.js 200 diana
         MODO=conta node ferramentas/sim-rivais.js 200
         ARCOS=1 node ferramentas/sim-rivais.js 300 fuchsia,vasco

   Sem ARCOS, cada rival luta no arco que as flags vazias dão (o
   Ressentido do Rory, o Cansado do Otto, o Orgulhoso do Nolan); com
   ARCOS=1, uma linha por arco, com o arco forçado.

   O jogador simulado é ingênuo, como nos outros simuladores: sem item
   nem troca, o golpe de dano que mais machuca pelo poder. MODO=conta
   escolhe pela conta de dano da IA (Batalha.danoEsperado), como o
   bot-jogador. O time é o inicial e o resto sorteado, cada um de um
   lugar de mato que a jornada já passou (nível do lugar até o da
   área). Antes ele saía todo do primeiro lugar com o nível da área: no
   16 e no 22 era o Planalto, de Pedra, Lutador e Terrestre, e o Nolan,
   de Água, parecia imbatível enquanto o Rory, de Veneno e Fogo,
   parecia de graça.
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
    const s = ef === 0 ? -1 : CONTA ? B.danoEsperado(p, alvo, B.estAliado, B.estInimigo, g.nome)
      : ((PR.p || 1) + (p.tipos.includes(G.t) ? 1 : 0)) * ef * ((G.a || 100) / 100);
    if (s > melhor){ melhor = s; idx = i; }
  });
  if (melhor < (CONTA ? 1e-9 : 0)) return B.iaEscolher(p, alvo, B.estAliado, B.estInimigo);
  return idx;
}
const CONTA = process.env.MODO === 'conta';

const N = +process.argv[2] || 60;
const quais = process.argv[3] ? process.argv[3].split(',') : RIVAIS_EXTRA.map(R => R.id);
Estado.novo({nome:'Sim', genero:'Mulher', cidade:'Pallet', idade:15, casaNome:'Delia', casaQuem:'mãe'});
/* DIFICULDADE=facil|dificil mede outra dificuldade da jornada (dificuldade.js); sem ela, Normal */
if (process.env.DIFICULDADE) Estado.dados.config.dificuldade = process.env.DIFICULDADE;
const d = Estado.dados;
const INS = ['Insígnia Pedra','Insígnia Cascata','Insígnia Trovão','Insígnia Arco-Íris','Insígnia Alma','Insígnia Pântano','Insígnia Vulcão','Insígnia Terra'];
/* quantas insígnias o jogador costuma ter chegando no capítulo */
const insDoCap = c => c >= 22 ? 8 : c >= 18 ? 7 : c >= 15 ? 6 : c >= 12 ? 5 : c >= 10 ? 4 : c >= 7 ? 3 : 2;

/* o time da jornada: o inicial e cada um dos outros de um lugar de mato
   que ela já passou (nível do lugar até o da área) */
function timeJogador(nivel, area, tam){
  const lugares = Object.keys(LOCAIS).filter(k => LOCAIS[k].tipo !== 'cidade' && LOCAIS[k].nivel && LOCAIS[k].nivel <= Math.max(10, area));
  const t = [criarPokemon(formaAteONivel([3,6,9][Dados.entre(0,2)], nivel), nivel, {moral:80})];
  for (let i = 0; i < tam - 1; i++){
    const loc = Dados.escolher(lugares);
    const w = sortearSelvagem(LOCAIS[loc].ambiente, Math.max(3, nivel - 2), loc);
    t.push(criarPokemon(formaAteONivel(finalDaLinha(w.dex), nivel - 1), nivel - 1, {moral:70}));
  }
  return t;
}
function lutar(meuTime, R){
  d.time = meuTime;
  const inimigos = timeRivalExtra(R);
  Batalha.iniciar(meuTime[0], inimigos[0], {tipo:'treinador', fuga:false, treinador:R.nome, timeInimigo:inimigos.slice(1), vontadeIA:true});
  let turnos = 0, r;
  while (Batalha.ativo && turnos < 150){
    turnos++;
    /* o jogador também gasta Vontade, com o critério da IA */
    { const a = Batalha.aliado; if (a && a.hp * 2 <= a.hpMax && vontadeDe(a) >= 2 && Dados.chance(45) && Batalha.podeGastarVontade('esquiva')) Batalha.gastarVontade('esquiva'); }
    r = Batalha.acao({tipo:'golpe', indice:escolhaJogador()});
    if (r && r.precisaTrocar) Batalha.acao({tipo:'trocar', uid:r.reservas[0]});
    if (Batalha.fase === 'ameaca') break;
  }
  const vivos = meuTime.filter(p => p.hp > 0).length;
  return {venceu: !!(Batalha.fim && Batalha.fim.resultado === 'vitoria'), caidos: meuTime.length - vivos,
          time: inimigos.map(p => `${p.nome} ${p.nivel}`)};
}

console.log('rival   cap área ins time | +0 (vitória, caídos) · +4 | o time no +0');
const casos = [];
for (const id of quais){
  const R = defRival(id);
  if (!R){ console.log('não existe:', id); continue; }
  if (process.env.ARCOS && R.arcos) for (const arco of Object.keys(R.arcos)) casos.push({id, R:Object.assign({}, R, {arco}), rotulo:`${R.nome}/${arco}`});
  else casos.push({id, R, rotulo:R.nome});
}
for (const {id, R, rotulo} of casos){
  /* um encontro já feito, sem placar: o arco é o do começo */
  d.rivais = {[id]: {id, nome:R.nome, vitorias:0, derrotas:0, encontros:1, ultimoCap:0}};
  for (const [k, cap] of R.caps.entries()){
    /* quem cresce a cada luta (tamPorLuta, a Noa): a luta k é a k-ésima */
    if (R.tamPorLuta) d.rivais[id].encontros = k;
    const c = Historia.capitulo(cap);
    const area = (c && c.nivelArea) || 20 + cap * 2;
    const ins = insDoCap(cap);
    d.insignias = INS.slice(0, ins);
    const tam = Math.min(6, 3 + Math.floor(ins / 2));
    const res = [0, 4].map(dn => {
      let v = 0, cai = 0, time = null;
      for (let k = 0; k < N; k++){
        const r = lutar(timeJogador(Math.max(5, area + dn), area, tam), R);
        v += r.venceu ? 1 : 0; cai += r.caidos; time = time || r.time;
      }
      return {vit: Math.round(100 * v / N), cai: (cai / N).toFixed(1), time};
    });
    console.log(`${rotulo.padEnd(process.env.ARCOS ? 17 : 6)} ${String(cap).padStart(4)} ${String(area).padStart(4)} ${ins}   ${tam}   | ` +
      `${String(res[0].vit).padStart(3)}% ${res[0].cai} · ${String(res[1].vit).padStart(3)}% ${res[1].cai} | ${res[0].time.join(', ')}`);
  }
}
