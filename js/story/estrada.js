/* ============================================================
   TREINADORES DE ESTRADA
   Gente que treina nas rotas e desafia quem passa. Como os
   líderes, cada um tem quatro times — um por escalão de
   insígnias (0–1, 2–3, 4–5, 6–8) — e sorteia parte dele a cada
   luta. Quem você vence num escalão só volta a te parar no
   seguinte, com o time do escalão novo.

   O nível sai do escalão e do lugar, o que for maior: numa rota
   braba ninguém treina com bicho de nível 5, e com oito insígnias
   ninguém te desafia com bicho de rota de começo.

   Os dados (quem, onde, o que diz) moram em estrada-dados.js.
   ============================================================ */

/* nível de partida de cada escalão, antes do ajuste pelo lugar */
const ESCALOES_ESTRADA = [
  {min:0, base:5},
  {min:2, base:14},
  {min:4, base:24},
  {min:6, base:34}
];

/* chance, em %, de um treinador da rota te parar em cada situação */
const CHANCE_TREINADOR = {chegar:30, procurar:20, vasculhar:22, treinar:25, viagem:35};
/* chance de um selvagem surgir sem você procurar */
const CHANCE_SELVAGEM_SURGE = {vasculhar:15, treinar:12, acampar:18, pescar:0};

function escalaoEstradaDe(n){
  let i = 0;
  ESCALOES_ESTRADA.forEach((e, k) => { if (n >= e.min) i = k; });
  return i;
}

function treinadorEstrada(id){ return (typeof TREINADORES_ESTRADA !== 'undefined' ? TREINADORES_ESTRADA : []).find(t => t.id === id) || null; }
function nomeDeLuta(t){ return `${t.classe} ${t.nome}`; }

/* O time do escalão, com parte dos lugares trocada pelo que o
   treinador tem de reserva — como os líderes. `extra` sobe o nível
   (a revanche marcada pelo PokéNav vem com +2). */
function timeEstrada(t, nForcado, extra){
  const n = (nForcado !== undefined) ? nForcado : numInsignias();
  const k = escalaoEstradaDe(n);
  const esc = ESCALOES_ESTRADA[k];
  const L = LOCAIS[t.local] || {nivel:5};
  const base = Math.max(esc.base + (n - esc.min) * 2, L.nivel - 3) + (t.dif || 0) + (extra || 0);

  const especies = (t.times[k] || t.times[t.times.length - 1]).slice();
  const pool = (t.reserva || []).filter(x => !especies.includes(x));
  for (let i = 0; i < especies.length - 1 && pool.length; i++){
    if (Dados.chance(40)) especies[i] = pool.splice(Dados.entre(0, pool.length - 1), 1)[0];
  }
  const usados = new Set();
  const time = [];
  especies.forEach((dex, i) => {
    const ultimo = i === especies.length - 1;
    const nv = Math.max(3, Math.min(70, base + i + (ultimo ? 1 : 0) + Dados.entre(-1, 0)));
    /* a lista pede a linha, o nível escolhe a forma: Pidgey no escalão
       de baixo, Pidgeot no de cima, pela mesma entrada */
    let forma = formaAteONivel(finalDaLinha(dex), nv);
    /* duas formas da mesma linha que colapsaram no mesmo estágio viram uma só */
    if (usados.has(forma) && !ultimo) return;
    usados.add(forma);
    time.push(criarPokemon(forma, nv, {moral: t.moral || 70}));
  });
  return time;
}

/* a última forma da linha, andando pelo campo evo */
function finalDaLinha(dex){
  let d = dex, guarda = 0;
  while (DEX[d] && DEX[d].evo && DEX[DEX[d].evo] && guarda++ < 5) d = DEX[d].evo;
  return d;
}

const Estrada = {
  reg(){
    const d = Estado.dados;
    if (!d.estrada) d.estrada = {};
    return d.estrada;
  },
  registro(id){
    const r = this.reg();
    if (!r[id]) r[id] = {vencidos:[], vitorias:0, derrotas:0, encontros:0, numero:false};
    return r[id];
  },

  daqui(localId){
    return (typeof TREINADORES_ESTRADA !== 'undefined' ? TREINADORES_ESTRADA : [])
      .filter(t => t.local === (localId || Mundo.id()));
  },
  /* quem ainda te para neste escalão: você não venceu ele desde que
     chegou nas insígnias de agora */
  pendentes(localId){
    const k = escalaoEstradaDe(numInsignias());
    return this.daqui(localId).filter(t => !this.registro(t.id).vencidos.includes(k));
  },
  deuNumero(id){ return !!(Estado.dados.estrada && Estado.dados.estrada[id] && Estado.dados.estrada[id].numero); },

  /* Tenta uma luta. Devolve true se começou, e aí a tela é da batalha. */
  talvez(situacao, localId){
    const chance = CHANCE_TREINADOR[situacao] || 0;
    if (!chance || !Dados.chance(chance)) return false;
    const pend = this.pendentes(localId);
    if (!pend.length || !Estado.primeiroApto()) return false;
    this.desafiar(Dados.escolher(pend).id, situacao);
    return true;
  },

  desafiar(id, situacao){
    const t = treinadorEstrada(id);
    const meu = Estado.primeiroApto();
    if (!t || !meu) return Exploracao.tela();
    const r = this.registro(id);
    const time = timeEstrada(t);
    if (!time.length) return Exploracao.tela();
    r.encontros++;
    Jogo.cenaBatalha = null; Jogo.ginasioAtual = null; Jogo.eliteAtual = null;
    Jogo.torneioAtual = null; Jogo.rivalAtual = null; Jogo.revancheAtual = null;
    Jogo.estradaAtual = {id, escalao: escalaoEstradaDe(numInsignias())};
    Jogo.batalhaLivre = true;
    UI.limparDados();
    const nome = nomeDeLuta(t);
    Batalha.iniciar(meu, time[0], {
      tipo:'treinador', fuga:false, treinador:nome,
      timeInimigo: time.slice(1),
      introducao:`${nome} enviou ${nomeVisivel(time[0])} (Nv ${time[0].nivel})!`
    });
    const jaViu = r.vencidos.length > 0 || r.encontros > 1;
    const olha = situacao === 'viagem'
      ? `No meio da viagem, ${emLocal(t.local)}, ${t.artigo || 'um'} ${t.classe.toLowerCase()} te vê de longe e já vem com a bola na mão.`
      : situacao === 'chegar'
      ? `No meio do caminho, ${t.artigo || 'um'} ${t.classe.toLowerCase()} te vê de longe e já vem com a bola na mão.`
      : `${t.artigo === 'uma' ? 'Uma' : 'Um'} ${t.classe.toLowerCase()} se levanta de onde estava e vem na sua direção. Na estrada, quem cruza o olhar luta.`;
    const fala = (jaViu && t.volta) ? t.volta : t.abre;
    UI.telaBatalha([olha, `${t.nome}: ${txt(fala)}`, `${nome} quer lutar!`]);
  },

  /* o que o log de fim de batalha cita e paga — pela mesma conta */
  premio(id){
    const qual = id || (Jogo.estradaAtual && Jogo.estradaAtual.id);
    const t = qual ? treinadorEstrada(qual) : null;
    const nivel = (Batalha.inimigo && Batalha.inimigo.nivel) || 1;
    return Math.round(pagaPorNivel(t ? nomeDeLuta(t) : '') * nivel * (Batalha.bonusDinheiro || 1));
  },
  perda(id){
    /* quem perde paga o mesmo que ganharia: é a regra da estrada */
    return Math.min(Estado.j.dinheiro, this.premio(id));
  },
  citacao(venceu){
    const t = Jogo.estradaAtual ? treinadorEstrada(Jogo.estradaAtual.id) : null;
    if (!t) return null;
    return `${t.nome}: ${txt(venceu ? t.perde : t.vence)}`;
  },

  resultado(fim){
    const atual = Jogo.estradaAtual;
    Jogo.estradaAtual = null;
    Jogo.batalhaLivre = false;
    if (fim.resultado === 'gameover') return UI.telaGameOver('Você caiu na estrada, numa luta que era pra ser só uma luta.');
    const t = atual ? treinadorEstrada(atual.id) : null;
    const avisos = [];
    if (t){
      const r = this.registro(t.id);
      const venceu = fim.resultado === 'vitoria';
      if (venceu){
        const v = this.premio(t.id);
        Estado.j.dinheiro += v;
        avisos.push({tipo:'item', texto:`Você venceu ${nomeDeLuta(t)}. +${v.toLocaleString('pt-BR')} ₽`});
        if (!r.vencidos.includes(atual.escalao)) r.vencidos.push(atual.escalao);
        r.vitorias++;
        Estado.registrar(`Venceu ${nomeDeLuta(t)} em ${(LOCAIS[t.local] || {}).nome || t.local}.`);
        /* quem tem número passa na primeira vez que perde pra você */
        if (t.numero && !r.numero && Estado.temPokenav()){
          r.numero = true;
          avisos.push({tipo:'eco', texto: t.numero.passa || `${t.nome} anota o número num pedaço de papel e te entrega. "Pra quando você quiser de novo."`});
        }
      } else {
        const p = this.perda(t.id);
        Estado.j.dinheiro -= p;
        r.derrotas++;
        avisos.push({tipo:'dano', texto: p ? `${nomeDeLuta(t)} venceu. −${p.toLocaleString('pt-BR')} ₽` : `${nomeDeLuta(t)} venceu.`});
        Estado.registrar(`Perdeu para ${nomeDeLuta(t)}.`);
      }
    }
    Estado.salvar('auto');
    Jogo.resolverPendencias(() => Jogo.seguirDaEstrada(avisos));
  }
};
