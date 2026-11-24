/* ============================================================
   SIMULADOR DE FORÇA DO TORNEIO DAS ILHAS
   Luta cada um do elenco das Ilhas Sevii (sevii-elenco.js) em cada
   rodada da chave (sevii-torneio.js), com o motor de batalha do jogo,
   contra o time que o jogador teria no pós-jogo: o inicial e o resto
   do mato das ilhas, seis Pokémon, no nível dado. O inscrito acompanha
   os seus três mais fortes (nivelDaCopa), então a conta que importa é
   a curva: cada rodada mais dura que a anterior, e todo mundo do
   elenco pesando parecido. A última coluna é o título (as quatro
   rodadas seguidas, curando entre uma e outra).

   Uso:  node ferramentas/sim-sevii.js [lutas por caso] [--cada]
         --cada mostra cada um do elenco em cada rodada, pra achar quem
         destoa (o acerto é o `ajuste` da ficha).
         NIVEIS=60,66,72 troca os níveis do jogador medidos;
         PISO=62,64,66,68 e SUBIDA=-2,-1,0,1 trocam os da chave só na
         medição, pra calibrar antes de mudar. QUEM=etta,rhys mede só
         essas fichas no --cada, e SO=cada pula a curva de todo mundo.
         --historia mede as lutas de cena das ilhas (gangue, Jory,
         Kaspar, Dekker, a Noa do cais, o Blue); SO=historia só elas, e
         CENA=c37_o_dekker,c36_o_kaspar só essas cenas.
         TAM=3,4,4,4 e VIAJANTE=1,1,1,2 trocam o time de cada rodada (o
         da ficha e o a mais de quem atravessa de Kanto); LONGAS=1
         escreve quem estava na arena quando uma luta passa dos 150
         turnos.
   ============================================================ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; }, querySelectorAll(){ return []; }, body:{}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const m of html.matchAll(/<script src="([^"]+)"/g)){ if (m[1].startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz, m[1]), 'utf8'), {filename:m[1]}); }

/* o jogador simulado: o golpe de dano que mais machuca (igual ao do sim-torneio) */
function escolhaJogador(){
  const B = Batalha, p = B.aliado, alvo = B.inimigo;
  let melhor = -1, idx = 0;
  p.golpes.forEach((g, i) => {
    const G = GOLPES[g.nome] || {};
    if (G.c === 'status') return;
    /* o Dream Eater só funciona em quem dorme: o Gengar e o Misdreavus
       do mato davam ele pra sempre no Normal acordado, e a luta passava
       dos 150 turnos (o jogo já sabe: danoEsperado) */
    if (G.ef && G.ef.soDormindo && alvo.status !== 'sono') return;
    const ef = eficacia(G.t, alvo.tipos);
    const PR = PR_GOLPE[g.nome] || {};
    const s = ef === 0 ? -1 : ((PR.p || 1) + (p.tipos.includes(G.t) ? 1 : 0)) * ef * ((G.a || 100) / 100);
    if (s > melhor){ melhor = s; idx = i; }
  });
  if (melhor < 0) return B.iaEscolher(p, alvo, B.estAliado, B.estInimigo);
  return idx;
}

const N = +process.argv[2] || 20;
const CADA = process.argv.includes('--cada');
const lista = v => v.split(',').map(Number);
if (process.env.PISO) lista(process.env.PISO).forEach((x, i) => { PISO_COPA[i] = x; });
if (process.env.SUBIDA) lista(process.env.SUBIDA).forEach((x, i) => { SUBIDA_COPA[i] = x; });
if (process.env.TAM) lista(process.env.TAM).forEach((x, i) => { TAM_COPA[i] = x; });
/* VIAJANTE=1,1,1,2 troca o Pokémon a mais de quem atravessa de Kanto (TAM_VIAJANTE) */
if (process.env.VIAJANTE) lista(process.env.VIAJANTE).forEach((x, i) => { TAM_VIAJANTE[i] = x; });
if (process.env.ERRO) lista(process.env.ERRO).forEach((x, i) => { ERRO_IA_COPA[i] = x; });
if (process.env.TAM_VIAJANTE) lista(process.env.TAM_VIAJANTE).forEach((x, i) => { TAM_VIAJANTE[i] = x; });
const NIVEIS = process.env.NIVEIS ? lista(process.env.NIVEIS) : [60, 66, 72];
/* AJ=jett:4,morwen:-6 troca o acerto de nível de quem atravessa de
   Kanto só na medição; AJ_TODOS=4 soma em todos eles */
if (process.env.AJ) process.env.AJ.split(',').forEach(x => { const [id, v] = x.split(':'); if (VIAJANTES_DA_COPA[id]) VIAJANTES_DA_COPA[id].ajuste = +v; });
/* MAIS=ewan:0.0.0.0,rafe:2.2.2.1 troca o time a mais de cada rodada */
if (process.env.MAIS) process.env.MAIS.split(',').forEach(x => { const [id, v] = x.split(':'); if (VIAJANTES_DA_COPA[id]) VIAJANTES_DA_COPA[id].mais = v.split('.').map(Number); });
if (process.env.AJ_TODOS) Object.values(VIAJANTES_DA_COPA).forEach(v => { v.ajuste = (v.ajuste || 0) + (+process.env.AJ_TODOS); });
Estado.novo({nome:'Sim', genero:'Mulher', cidade:'Pallet', casaNome:'Delia', casaQuem:'mãe', nascimento:{dia:3, mes:9}});
if (process.env.DIFICULDADE) Estado.dados.config.dificuldade = process.env.DIFICULDADE;
const d = Estado.dados;
d.insignias = ['Insígnia Pedra','Insígnia Cascata','Insígnia Trovão','Insígnia Arco-Íris','Insígnia Alma','Insígnia Pântano','Insígnia Vulcão','Insígnia Terra','Título de Campeão'];
d.flags.campeao_de_kanto = true; d.flags.dex_nacional = true; d.flags.johto_liberado = true;
/* a história inteira de volta pros donos: o time cheio de cada um */
['sv_rec_milotic', 'sv_rec_etta', 'sv_rec_ovos', 'sv_rec_turma'].forEach(f => { d.flags[f] = true; });
const AREAS = ['estrada_brasa', 'cabo', 'floresta_frutas', 'gruta_gelada', 'campina', 'vale_ruinas', 'canion'];

/* o time do jogador ingênuo: o inicial e o mato das ilhas, um nível abaixo */
function timeJogador(nivel){
  const t = [criarPokemon(formaAteONivel([3, 6, 9][Dados.entre(0, 2)], nivel), nivel, {moral:80})];
  while (t.length < 6){
    const loc = AREAS[Dados.entre(0, AREAS.length - 1)], L = LOCAIS[loc];
    d.local = loc;
    const w = sortearSelvagem(L.ambiente, Math.max(3, nivel - 2), loc);
    t.push(criarPokemon(formaAteONivel(finalDaLinha(w.dex), nivel - 1), nivel - 1, {moral:70}));
  }
  return t;
}
function lutar(meu, inimigos, rodada){
  d.time = meu;
  Batalha.iniciar(meu[0], inimigos[0], {tipo:'treinador', fuga:false, treinador:'Sim', timeInimigo:inimigos.slice(1),
    erroIA:ERRO_IA_COPA[rodada], vontadeIA:true});
  let turnos = 0, r;
  while (Batalha.ativo && turnos < 150){
    turnos++;
    { const a = Batalha.aliado; if (a && a.hp * 2 <= a.hpMax && vontadeDe(a) >= 2 && Dados.chance(45) && Batalha.podeGastarVontade('esquiva')) Batalha.gastarVontade('esquiva'); }
    r = Batalha.acao({tipo:'golpe', indice:escolhaJogador()});
    if (r && r.precisaTrocar) Batalha.acao({tipo:'trocar', uid:r.reservas[0]});
    if (Batalha.fase === 'ameaca') break;
  }
  /* LONGAS=1 conta quem estava na arena quando a luta passou dos 150 turnos */
  if (turnos >= 150 && process.env.LONGAS){
    const q = p => `${(DEX[p.dex] || {}).nome || p.dex} ${p.hp}/${p.hpMax} [${p.golpes.map(g => g.nome).join(', ')}]`;
    console.log(`longa: ${q(Batalha.aliado)}  ×  ${q(Batalha.inimigo)}  (vivos: ${meu.filter(p => p.hp > 0).length} × ${[Batalha.inimigo].concat(Batalha.timeInimigo || []).filter(p => p.hp > 0).length})`);
  }
  return {venceu: !!(Batalha.fim && Batalha.fim.resultado === 'vitoria'), caidos: meu.filter(p => p.hp <= 0).length, turnos};
}

/* PARTIU=1 mede a chave de depois do Anne: o Magnus, a Noa e quem
   atravessa de Kanto (VIAJANTES_DA_COPA), no lugar do elenco */
const elenco = process.env.PARTIU
  ? ['magnus', 'noa'].map(fichaSevii).concat(Object.keys(VIAJANTES_DA_COPA).map(quemNaCopa).filter(Boolean))
  : ELENCO_SEVII;
const RODADAS = PREMIO_COPA.map((_, i) => i);
console.log(`${elenco.length} do elenco, ${N} lutas por pessoa e rodada · piso ${PISO_COPA.join('/')} · subida ${SUBIDA_COPA.join('/')} · time ${TAM_COPA.join('/')} · erro ${ERRO_IA_COPA.join('/')}`);
console.log(`nível do jogador | ${PREMIO_COPA.map(r => r.rodada.toLowerCase()).join(' · ')}   (vitória, caídos) | título   nível do ás`);
let longas = 0; const longasDe = {};
if (process.env.SO !== 'cada' && process.env.SO !== 'historia') for (const nv of NIVEIS){
  const linha = RODADAS.map(rodada => {
    let v = 0, c = 0, n = 0, ases = [];
    for (const f of elenco) for (let k = 0; k < N; k++){
      const meu = timeJogador(nv); d.time = meu;
      const adv = adversarioDaCopa(inscritoDaCopa(f), rodada);
      ases.push(adv.time[adv.time.length - 1].nivel);
      const x = lutar(meu, adv.time, rodada);
      if (x.turnos >= 150){ longas++; longasDe[f.id] = (longasDe[f.id] || 0) + 1; }
      v += x.venceu ? 1 : 0; c += x.caidos; n++;
    }
    return {txt:`${String(Math.round(100 * v / n)).padStart(3)}% ${(c / n).toFixed(1)}`, p: v / n, as:`${Math.min(...ases)}–${Math.max(...ases)}`};
  });
  const titulo = linha.reduce((x, l) => x * l.p, 1);
  console.log(`${nv}`.padEnd(17) + '| ' + linha.map(l => l.txt).join(' · ') + ' | ' + `${Math.round(100 * titulo)}%`.padStart(4) + '   ' + linha.map(l => l.as).join(' · '));
}
if (longas) console.log(`(${longas} lutas passaram de 150 turnos: ${Object.entries(longasDe).sort((a, b) => b[1] - a[1]).map(([q, n]) => `${q} ${n}`).join(', ')})`);

/* --historia: as lutas de cena dos capítulos das ilhas (batalha.sevii:
   as gangues, o Jory, o Kaspar, o Dekker, a Noa do cais e o Blue), cada
   uma do jeito que a cena começa (sevii, mais, tam, erroIA, vontadeIA),
   contra o mesmo jogador ingênuo. SO=historia pula a curva da chave */
if (process.argv.includes('--historia')){
  console.log(`\n--- as lutas de cena das ilhas (vitória, caídos) · nível ${NIVEIS.join(' · ')} ---`);
  for (const cap of CAPITULOS.filter(c => c.posJogo)) for (const [id, cena] of Object.entries(cap.cenas)){
    const b = cena.batalha;
    if (!b || !b.sevii || (process.env.CENA && !process.env.CENA.split(',').includes(id))) continue;
    Historia.capAtual = cap;
    const res = NIVEIS.map(nv => {
      let v = 0, c = 0;
      for (let k = 0; k < N; k++){
        const meu = timeJogador(nv); d.time = meu;
        const time = Sevii.timeDaLuta(txt(b.sevii), Sevii.nivel(d, txt(b.mais) || 0), txt(b.tam) || null);
        Batalha.iniciar(meu[0], time[0], {tipo:'treinador', fuga:false, treinador:'Sim', timeInimigo:time.slice(1),
          erroIA:b.erroIA, vontadeIA:!!b.vontadeIA});
        let t = 0, r;
        while (Batalha.ativo && t < 150){
          t++;
          { const a = Batalha.aliado; if (a && a.hp * 2 <= a.hpMax && vontadeDe(a) >= 2 && Dados.chance(45) && Batalha.podeGastarVontade('esquiva')) Batalha.gastarVontade('esquiva'); }
          r = Batalha.acao({tipo:'golpe', indice:escolhaJogador()});
          if (r && r.precisaTrocar) Batalha.acao({tipo:'trocar', uid:r.reservas[0]});
          if (Batalha.fase === 'ameaca') break;
        }
        v += Batalha.fim && Batalha.fim.resultado === 'vitoria' ? 1 : 0; c += meu.filter(p => p.hp <= 0).length;
      }
      return `${String(Math.round(100 * v / N)).padStart(3)}% ${(c / N).toFixed(1)}`;
    });
    const t0 = Sevii.timeDaLuta(txt(b.sevii), Sevii.nivel({time:timeJogador(NIVEIS[0])}, txt(b.mais) || 0), txt(b.tam) || null);
    console.log(`${(numeroDoCapitulo(cap).replace('Ilhas Sevii · ', '') + ' ' + id).padEnd(34)} ${res.join(' · ')}   ${t0.length}× ${t0.map(p => p.nivel).join('/')}`);
  }
}

if (CADA){
  console.log(`\n--- cada um, somando os níveis: ${PREMIO_COPA.map(r => r.rodada.toLowerCase()).join(' · ')} ---`);
  const QUEM = process.env.QUEM ? process.env.QUEM.split(',') : null;
  for (const f of elenco){
    if (QUEM && !QUEM.includes(f.id)) continue;
    const res = RODADAS.map(rodada => {
      let v = 0, n = 0;
      for (const nv of NIVEIS) for (let k = 0; k < Math.max(4, Math.round(N / 2)); k++){
        const meu = timeJogador(nv); d.time = meu;
        v += lutar(meu, adversarioDaCopa(inscritoDaCopa(f), rodada).time, rodada).venceu ? 1 : 0; n++;
      }
      return String(Math.round(100 * v / n)).padStart(3) + '%';
    });
    console.log(`${(f.nome + ' (' + (f.ajuste || 0) + ')').padEnd(22)} ${res.join(' · ')}`);
  }
}
