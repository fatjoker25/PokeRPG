/* ============================================================
   LENDÁRIOS QUE RONDAM
   Depois que a história te põe na frente de um lendário pela
   primeira vez (encontro de cena ou luta de cena), ele passa a
   andar por uns poucos lugares do mapa. Todo encontro selvagem
   num desses lugares tem CHANCE_ERRANTE % de ser ele em vez do
   que a tabela daria — uma rolagem só por encontro, e se mais de
   um ronda o lugar, sorteia entre eles.

   Não ronda quem está com você, morreu, foi vendido ou está preso.
   Vencer ou fugir não muda nada: ele continua por aí. Capturar
   tem o peso de sempre (captura.js).

   Lugar é só rota e área especial: cidade não tem mato.
   Está na folha de regras; mudou número, muda lá.
   ============================================================ */
const CHANCE_ERRANTE = 1;

const LENDARIOS_ERRANTES = {
  144:{lugares:['seafoam', 'rota19', 'rota21'], nivel:56,
       sinal:'O ar esfria de uma vez, e a sua respiração sai branca no meio do dia.'},
  145:{lugares:['usina', 'rota9', 'norte'], nivel:56,
       sinal:'Os pelos do seu braço levantam. Um estalo seco, e o cheiro de chuva sem chuva nenhuma.'},
  146:{lugares:['caminho_vitoria', 'rota23'], nivel:54,
       sinal:'O mato em volta seca em segundos, e o calor vem de cima, não do chão.'},
  150:{lugares:['norte'], nivel:72,
       sinal:'Tudo fica em silêncio, inclusive dentro da sua cabeça. Depois, não fica mais.'},
  151:{lugares:['ilha_sem_nome', 'floresta', 'rota24'], nivel:55,
       sinal:'Uma risada pequena, do lado de lá de uma moita. Quando você olha, a moita está flutuando um palmo acima do chão.'},
  243:{lugares:['rota9', 'usina', 'rota12'], nivel:55,
       sinal:'Um trovão sem nuvem, perto demais. O chão ainda está vibrando quando ele aparece.'},
  244:{lugares:['rota22', 'rota23', 'rota16'], nivel:55,
       sinal:'A terra esquenta debaixo do seu sapato, e uma fumaça fina sobe de onde não tinha fogo.'},
  245:{lugares:['rota24', 'rota19', 'rota12'], nivel:55,
       sinal:'A água da beira fica parada e limpa, limpa demais, e um vento frio passa por cima dela.'},
  250:{lugares:['planalto', 'norte'], nivel:60,
       sinal:'Uma luz de várias cores corta as nuvens, e uma pena cai devagar bem na sua frente.'}
};

const Errantes = {
  /* a história já te pôs na frente dele, e ele está solto */
  ronda(dex){
    const L = Estado.dados.lendarios && Estado.dados.lendarios[dex];
    if (!L || !(L.visto || L.encontros > 0)) return false;
    return !['capturado', 'morto', 'vendido'].includes(L.estado) && L.disposicao !== 'prisioneiro';
  },

  /* quem ronda este lugar agora */
  aqui(localId){
    return Object.keys(LENDARIOS_ERRANTES).map(Number)
      .filter(dex => LENDARIOS_ERRANTES[dex].lugares.includes(localId) && this.ronda(dex));
  },

  /* a rolagem do encontro: devolve o Pokémon e a entrada, ou null */
  talvez(localId){
    const lista = this.aqui(localId);
    if (!lista.length || !Dados.chance(CHANCE_ERRANTE)) return null;
    const dex = Dados.escolher(lista);
    const E = LENDARIOS_ERRANTES[dex], L = Estado.lend(dex);
    L.errante = (L.errante || 0) + 1;
    const p = criarPokemon(dex, E.nivel, {selvagem:true});
    const jeito = L.caçandoVoce || L.disposicao === 'hostil' ? 'Não é acaso. Ele veio atrás de você.'
      : L.disposicao === 'desconfiado' ? 'Ele te reconhece, e não gosta do que lembra.'
      : (L.aliado || L.disposicao === 'passivo' || L.disposicao === 'amistoso') ? 'Ele te reconhece. E fica.'
      : 'Ele não estava te esperando. Você também não.';
    Estado.registrar(`Cruzou com ${DEX[dex].nome} ${emLocal(localId)}, longe de qualquer história.`);
    return {p, intro:[E.sinal, jeito]};
  }
};
