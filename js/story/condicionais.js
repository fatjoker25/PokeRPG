/* ============================================================
   CAPÍTULOS CONDICIONAIS — desvios de rota

   Um capítulo condicional não entra na contagem normal: ele é um
   desvio que só existe se a sua jornada passou por onde precisava
   passar. Quem não passou segue reto e nunca fica sabendo que o
   desvio existia.

   O motor já sabia fazer isso (`requer` e `proximo` em motor.js) e
   ninguém usava. Aqui é onde os desvios são ligados: cada capítulo
   anfitrião ganha um `proximo` que manda pro desvio quando o
   requisito bate, e o desvio devolve a rota pro lugar certo.

   O `requer` de cada capítulo condicional mora no arquivo dele.
   Aqui só fica a ligação, pra caber tudo numa tela.
   ============================================================ */
/* de qual capítulo sai o desvio, e pra qual ele devolve */
const DESVIOS_CONDICIONAIS = [
  {de: 6,  desvio: 29, volta: 7},   // Cerulean → o portão verde
  {de: 7,  desvio: 30, volta: 8},   // Lavender → as onze linhas do livro
  {de: 9,  desvio: 31, volta: 10},  // Celadon  → quem assina o fax
  {de: 11, desvio: 32, volta: 12}   // Saffron  → o galpão da zona norte
];

/* Onde a jornada está. O número do capítulo condicional não diz isso:
   o 29 roda entre o 6 e o 7, e com ele valendo 29 toda conta que
   compara capítulo com número achava que a jornada estava no fim — o
   posto de Elite e o de Professor entravam na conta, os contatos do
   PokéNav do fim do jogo ligavam, a Rota 23 ganhava a guarita nova e a
   Pokédex Nacional abria no meio da jornada. Aqui o 29 vale 6,5, entre
   o anfitrião e a volta; os capítulos de caminho (12.01…) já são a
   posição deles. Conta que compara capítulo com número (porta, evento,
   texto que muda com a história, memória de capítulo) passa por aqui;
   capítulo de caminho comparado pelo número dele mesmo, não. Serve
   também pra número guardado: capNaJornada({capitulo:m.cap}). */
function capNaJornada(d){
  d = d || (typeof Estado !== 'undefined' ? Estado.dados : null);
  const n = (d && d.capitulo) || 0;
  const x = DESVIOS_CONDICIONAIS.find(v => v.desvio === n);
  return x ? x.de + .5 : n;
}

(function(){

  DESVIOS_CONDICIONAIS.forEach(({de, desvio, volta}) => {
    const anfitriao = CAPITULOS.find(c => c.num === de);
    const cond      = CAPITULOS.find(c => c.num === desvio);
    if (!anfitriao || !cond) return;

    /* o anfitrião manda pro desvio só quando o requisito do desvio bate */
    const antes = anfitriao.proximo;
    anfitriao.proximo = d => {
      if (typeof antes === 'function'){
        const forcado = antes(d);
        if (forcado && forcado !== volta) return forcado;   // desvio explícito manda mais
      }
      try { if (cond.requer && cond.requer(d)) return desvio; } catch(e){}
      return volta;
    };

    /* e o desvio devolve a rota, sempre */
    cond.proximo = d => volta;
  });

})();
