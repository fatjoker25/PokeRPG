/* ============================================================
   A POKÉDEX NACIONAL — o Professor atualiza quem anda
   O registro nacional (os 251, Johto no mato das Ilhas Sevii, as evoluções da 2ª
   geração, os bebês da creche e o que a loja guarda pra quem tem a
   Nacional) só vinha com o título de Campeão (coroarCampeao, em
   liga.js). Quem não passava da Elite ficava sem Johto pra sempre, e a
   segunda rodada de robôs terminou a história assim, quatro de cinco.

   Agora tem um segundo caminho, o do laboratório: o Professor, em
   Pallet, atualiza a Pokédex de quem traz CATALOGADAS_PRA_NACIONAL
   espécies de Kanto catalogadas, depois que a jornada chega ao
   Planalto (as oito insígnias, ou o capítulo 22, que abre mesmo pra
   quem os ginásios recusaram). Antes disso o afazer nem aparece; com a
   história lá e a Pokédex curta, ele fica na tela, fechado, com o que o
   Professor pede. Catalogar é capturar ou apontar a Pokédex na luta.
   O registro é o mesmo do Campeão, e quem já tem não recebe de novo.
   Está na folha de regras; mudou número, muda lá.
   ============================================================ */
const CATALOGADAS_PRA_NACIONAL = 60;
const CAPITULO_DA_NACIONAL = 22;

const DexNacional = {
  tem(d){ d = d || Estado.dados; return !!(d && d.flags.dex_nacional); },
  /* a jornada chegou ao Planalto: as oito, ou o capítulo que abre pra
     quem ficou sem (faltaInsignias deixa entrar no 22 com o que tem) */
  chegou(d){
    d = d || Estado.dados;
    return !!(d.flags.oito_insignias || capNaJornada(d) >= CAPITULO_DA_NACIONAL || d.depoisDoFim);
  },
  /* só Kanto conta: Mew e os lendários de Johto que cruzam a história
     não entram na conta do Professor */
  deKanto(){
    const pd = Estado.pdex();
    return Object.keys(pd.catalogados || {}).map(Number).filter(x => x >= 1 && x <= 150).length;
  },
  pode(d){ return this.chegou(d) && this.deKanto() >= CATALOGADAS_PRA_NACIONAL; },

  /* o registro, venha de onde vier (o Professor ou o título de Campeão) */
  liberar(como){
    if (this.tem()) return false;
    Estado.marcar('dex_nacional');
    Estado.marcar('johto_liberado');
    Estado.registrar(`Pokédex Nacional liberada${como ? ' ' + como : ''}: 251 registros. Johto aberto.`);
    return true;
  },

  afazeres(id){
    const d = Estado.dados;
    if (id !== 'pallet' || !d.flags.tem_pokedex || this.tem() || !this.chegou()) return [];
    const n = this.deKanto();
    return [{id:'dexnac', titulo:'Mostrar a Pokédex ao Professor', sub:'No laboratório, no alto da subida.',
      fechada: n >= CATALOGADAS_PRA_NACIONAL ? null
        : `O Professor quer ${porExtensoF(CATALOGADAS_PRA_NACIONAL)} espécies de Kanto catalogadas antes de mexer na Pokédex. A sua tem ${n === 1 ? 'uma' : porExtensoF(n)}.`}];
  },

  fazer(){
    if (this.tem() || !this.pode()) return Exploracao.tela();
    const n = this.deKanto(), Q = 'Professor Oak';
    this.liberar('no laboratório de Pallet');
    Estado.salvar('auto');
    UI.telaConversa({num:'Pallet', titulo:'A Pokédex Nacional', loc:'Laboratório do Professor', quem:Q, falas:[
      'O Professor pega a Pokédex com as duas mãos e liga no computador do fundo do laboratório.',
      fala(Q, `${cap1(porExtensoF(n))}.`, null, 'Ele confere a lista com o dedo, linha por linha.'),
      fala(Q, 'Essa lista parava no cento e cinquenta porque Kanto parava ali. Kanto não para mais ali.'),
      'A Pokédex trava por quatro segundos e reinicia sozinha. Quando volta, a lista não termina mais em Kanto.',
      fala(Q, 'Os barcos de Johto deixam Pokémon de lá nas ilhas do sul faz um tempo. Agora você tem onde anotar.'),
      fala(Q, 'Cem registros novos, todos vazios. Vazio é a parte boa.', 'riso')
    ], avisos:[
      {tipo:'pokedex', texto:'Pokédex Nacional: a lista vai até o 251.'},
      {tipo:'mundo', texto:'Os Pokémon de Johto que andam soltos ficam nas Ilhas Sevii, ao sul de Kanto, no meio dos daqui.'}
    ], botoes:[{texto:'Seguir', acao:'Exploracao.tela()'}]});
  }
};
