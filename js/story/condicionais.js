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
(function(){

  /* de qual capítulo sai o desvio, e pra qual ele devolve */
  const DESVIOS = [
    {de: 6,  desvio: 29, volta: 7},   // Cerulean → o portão verde
    {de: 7,  desvio: 30, volta: 8},   // Lavender → as onze linhas do livro
    {de: 9,  desvio: 31, volta: 10},  // Celadon  → quem assina o fax
    {de: 11, desvio: 32, volta: 12}   // Saffron  → o galpão da zona norte
  ];

  DESVIOS.forEach(({de, desvio, volta}) => {
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
