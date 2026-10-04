/* ============================================================
   SIMULADOR DE FORÇA DOS VETERANOS
   Luta cada veterano (e o convite dele, e as rodadas da Conferência) com o
   motor de batalha do jogo, contra times do tamanho e do nível que o
   jogador teria ali: no nível do lugar +2 (de passagem), +6 (treinado)
   e +10 (preparado de propósito). Veterano tem que ser desafio de
   verdade de passagem e vencível com preparo.

   Uso:  node ferramentas/sim-veteranos.js [lutas por caso]
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
    if (g.pp <= 0) return;
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

const N = +process.argv[2] || 40;
Estado.novo({nome:'Sim', genero:'Mulher', cidade:'Pallet', idade:15, casaNome:'Delia', casaQuem:'mãe'});
const d = Estado.dados;
const INS = ['Insígnia Pedra','Insígnia Cascata','Insígnia Trovão','Insígnia Arco-Íris','Insígnia Alma','Insígnia Pântano','Insígnia Vulcão','Insígnia Terra'];

/* Quem venceu o Red não carrega bicho sorteado da área: pro fim do
   jogo o time é o inicial e cinco formas finais fortes, sem lendário. */
const FORTES = Object.keys(DEX).map(Number).filter(x => DEX[x].total >= 480 && !DEX[x].evo && !DEX[x].lendario && x <= 251);
function timeJogador(nivel, localId, tam){
  const L = LOCAIS[localId];
  if (d.flags.campeao_de_kanto){
    const t = [criarPokemon(formaAteONivel([3,6,9][Dados.entre(0,2)], nivel), nivel, {moral:90})];
    const usados = new Set();
    while (t.length < tam){
      const x = FORTES[Dados.entre(0, FORTES.length - 1)];
      if (usados.has(x)) continue; usados.add(x);
      t.push(criarPokemon(x, nivel - 1, {moral:85}));
    }
    return t;
  }
  const ini = formaAteONivel([3,6,9][Dados.entre(0,2)], nivel);
  const t = [criarPokemon(ini, nivel, {moral:80})];
  for (let i = 0; i < tam - 1; i++){
    const w = sortearSelvagem(L.ambiente, Math.max(3, nivel - 2), localId);
    t.push(criarPokemon(formaAteONivel(finalDaLinha(w.dex), nivel - 1), nivel - 1, {moral:70}));
  }
  return t;
}
function lutar(meuTime, fazInimigos, tipo){
  d.time = meuTime;
  const inimigos = fazInimigos();
  Batalha.iniciar(meuTime[0], inimigos[0], {tipo, fuga:false, treinador:'Sim', timeInimigo:inimigos.slice(1), erroIA:ERRO_IA_VETERANO, vontadeIA:true});
  let turnos = 0, r;
  while (Batalha.ativo && turnos < 120){
    turnos++;
    /* o jogador simulado também tem Vontade e gasta com o mesmo critério
       da IA: esquiva na metade do HP. Sem isso, a medição só via um lado
       gastando. */
    { const a = Batalha.aliado; if (a && a.hp * 2 <= a.hpMax && vontadeDe(a) >= 2 && Dados.chance(45) && Batalha.podeGastarVontade('esquiva')) Batalha.gastarVontade('esquiva'); }
    r = Batalha.acao({tipo:'golpe', indice:escolhaJogador()});
    if (r && r.precisaTrocar) Batalha.acao({tipo:'trocar', uid:r.reservas[0]});
    if (Batalha.fase === 'ameaca') break;
  }
  const vivos = meuTime.filter(p => p.hp > 0).length;
  return {venceu: !!(Batalha.fim && Batalha.fim.resultado === 'vitoria'), caidos: meuTime.length - vivos, nvIni: inimigos.map(p => p.nivel)};
}
function medir(nivel, localId, tam, fazInimigos, tipo){
  let v = 0, cai = 0, amostra = null;
  for (let k = 0; k < N; k++){
    const meu = timeJogador(nivel, localId, tam);
    d.time = meu;
    const r = lutar(meu, fazInimigos, tipo || 'treinador');
    if (!amostra) amostra = r.nvIni;
    v += r.venceu ? 1 : 0; cai += r.caidos;
  }
  return {vit: Math.round(100 * v / N), cai: (cai / N).toFixed(1), amostra};
}

console.log('veterano  lugar(nv) ins  | +2 de passagem · +6 treinado · +10 preparado   (vitória, caídos)  níveis do veterano no +2');
for (const v of VETERANOS){
  const L = LOCAIS[v.local];
  const n = Math.max(v.insignias, 0);
  d.insignias = INS.slice(0, n);
  d.flags.campeao_de_kanto = !!v.campeao;
  const tam = d.flags.campeao_de_kanto ? 6 : Math.min(6, 3 + Math.floor(n / 2));
  const res = [2, 6, 10].map(dn => medir(Math.max(5, L.nivel + dn), v.local, tam, () => Veteranos.time(v)));
  console.log(`${v.id.padEnd(9)} ${v.local.padEnd(16)}${String(L.nivel).padStart(3)} ${n}  | ` +
    res.map(r => `${String(r.vit).padStart(3)}% ${r.cai}`).join(' · ') + `   ${res[0].amostra.join('/')}`);
}

console.log('\n--- convites (luta), com o jogador no nível do lugar do convite +6 ---');
for (const v of VETERANOS){
  const c = v.convite;
  if (!c || !c.luta) continue;
  const L = LOCAIS[c.local];
  d.insignias = INS.slice(0, Math.min(8, v.insignias + 1));
  d.flags.campeao_de_kanto = !!v.campeao;
  const tam = d.flags.campeao_de_kanto ? 6 : Math.min(6, 3 + Math.floor(d.insignias.length / 2));
  const faz = () => {
    const Lt = c.luta;
    if (Lt.veterano) return Veteranos.time(veterano(Lt.veterano), Lt.acima, 6);
    const nv = Math.min(85, Math.max(L.nivel + 2, nivelDeReferencia() + (Lt.acima || 0)));
    return timeDeLinhas(Lt.times, nv, Math.min(Lt.times.length, Veteranos.tamanho(v) + 1), v.golpes, 70);
  };
  const r = medir(Math.max(L.nivel + 6, v.campeao ? 70 : 0), c.local, tam, faz);
  console.log(`${v.id.padEnd(9)} ${c.local.padEnd(16)} vitória ${r.vit}% · caídos ${r.cai} · níveis ${r.amostra.join('/')}`);
}

console.log('\n--- Conferência do Planalto Indigo, time de 6 ---');
d.insignias = INS.slice(0, 8); d.flags.campeao_de_kanto = true;
for (const nv of [60, 66, 72]){
  const linha = [0, 1, 2].map(rod => {
    const ids = rod === 2 ? ['greer'] : VETERANOS.filter(v => v.conferencia && !v.final).map(v => v.id);
    const r = medir(nv, 'planalto', 6, () => {
      const v = veterano(ids[Dados.entre(0, ids.length - 1)]);
      return timeDeLinhas(v.times, Math.max(PISO_CONFERENCIA[rod], nivelDeReferencia() + ACIMA_CONFERENCIA + rod), 6, v.golpes, 95);
    });
    return `${PREMIO_CONFERENCIA[rod].rodada} ${r.vit}% (${r.cai})`;
  });
  console.log(`jogador nv ${nv}: ${linha.join(' · ')}`);
}
