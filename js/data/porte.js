/* ============================================================
   PORTE, LUZ E O QUE O TIME CONSEGUE FAZER NO MUNDO

   Este jogo não tem HM. Não existe "ensinar Surf" nem "precisa do
   Corte pra passar". O que existe é o seguinte:

   - Cortar mato fechado se faz com um MACHADO, que é um objeto
     que você compra ou acha, e não uma coisa que um bicho aprende.
   - Quebrar pedra se faz com uma PICARETA, mesma lógica.
   - Atravessar água se faz em cima de um Pokémon de água grande o
     bastante pra aguentar o seu peso.
   - Voar se faz em cima de um Pokémon voador de grande porte.
   - Empurrar o que é pesado demais se faz com um Pokémon grande.
   - Enxergar no escuro se faz com lanterna, que gasta pilha, ou
     com um Pokémon que emite luz, que não gasta nada.

   Ou seja: metade vira ferramenta na mochila e metade vira uma
   propriedade física do bicho. Nenhuma das duas é um golpe.
   ============================================================ */

/* Grande = dá pra montar em cima, ou pesa o bastante pra mover
   coisa pesada. Onix e Steelix entram por comprimento, Snorlax e
   Donphan por massa, Lapras e Gyarados por serem o transporte
   clássico de quem atravessa mar em Kanto. */
const PORTE_GRANDE = new Set([
  3,6,9,18,24,55,59,68,71,73,76,78,80,85,87,91,95,97,103,112,115,128,130,131,
  142,143,144,145,146,148,149,150,
  154,157,160,164,169,199,208,212,217,226,227,230,232,234,241,243,244,245,248,249,250
]);

/* Pequeno = cabe no colo, não carrega ninguém e não empurra nada. */
const PORTE_PEQUENO = new Set([
  1,4,7,10,11,13,14,16,19,21,23,25,27,29,32,35,37,39,41,43,46,48,50,52,54,56,58,60,
  63,66,69,72,74,79,81,83,88,90,92,98,100,102,104,109,116,118,120,129,132,133,137,138,140,151,
  152,155,158,161,163,165,167,170,172,173,174,175,177,179,180,183,187,188,189,190,191,193,
  194,198,200,204,206,207,209,211,213,215,216,218,220,222,223,225,228,231,236,238,239,240,246
]);

/* Tudo que não está em nenhuma das duas listas é de porte médio:
   do tamanho de uma pessoa, mais ou menos. */
function porteDe(dex){
  const n = Number(dex);
  if (PORTE_GRANDE.has(n))  return 'grande';
  if (PORTE_PEQUENO.has(n)) return 'pequeno';
  return 'medio';
}
function porteNome(p){ return p === 'grande' ? 'grande porte' : p === 'medio' ? 'porte médio' : 'pequeno porte'; }

/* Quem emite luz própria e constante: chama na cauda, corpo
   incandescente, órgão luminoso, carga elétrica visível.
   Lanturn é literalmente o Pokémon-Lanterna e Ampharos é o
   Pokémon-Farol — os dois iluminam melhor que a sua lanterna. */
const EMITE_LUZ = new Set([
  4,5,6,        // a chama da cauda
  77,78,        // crina de fogo
  81,82,        // ímã com arco elétrico
  100,101,      // carga visível
  120,121,      // o núcleo
  126,240,      // fogo no corpo
  155,156,157,  // as chamas do dorso
  170,171,      // o Pokémon-Lanterna
  179,180,181,  // o Pokémon-Farol
  197,          // os anéis
  218,219,      // rocha derretida
  250           // as penas
]);
function emiteLuz(dex){ return EMITE_LUZ.has(Number(dex)); }

/* Tipo Voador que não sai do chão. */
const NAO_DECOLA = new Set([84, 85, 130]);   // Doduo e Dodrio correm; Gyarados é serpente de mar

/* ============================================================
   CAMPO — o que o seu time e a sua mochila deixam você fazer
   Toda função devolve {pode, quem, como, falta} pra cena poder
   dizer POR QUE não dá, em vez de só esconder a opção.
   ============================================================ */
const Campo = {
  _time(){
    const d = (typeof Estado !== 'undefined' && Estado.dados) || null;
    return (d && d.time || []).filter(p => p && !p.morto);
  },
  _tem(item){
    const d = (typeof Estado !== 'undefined' && Estado.dados) || null;
    if (!(d && d.itens && d.itens[item] > 0)) return false;
    /* ferramenta quebrada está na mochila e não serve (desgaste.js) */
    return typeof Desgaste === 'undefined' || !Desgaste.dura(item) || Desgaste.inteiros(item) > 0;
  },
  _tipo(p, t){
    const e = DEX[p.dex];
    return !!(e && e.tipos && e.tipos.includes(t));
  },

  /* mato fechado: machado, e ponto */
  cortar(){
    return this._tem('Machado')
      ? {pode:true, como:'com o machado'}
      : {pode:false, falta:'um machado'};
  },

  /* pedra: picareta */
  quebrar(){
    return this._tem('Picareta')
      ? {pode:true, como:'com a picareta'}
      : {pode:false, falta:'uma picareta'};
  },

  /* água funda: bicho de água que aguente o seu peso */
  surfar(){
    const q = this._time().find(p => this._tipo(p,'Água') && porteDe(p.dex) !== 'pequeno');
    return q ? {pode:true, quem:q, como:`em cima de ${nomeExib(q)}`}
             : {pode:false, falta:'um Pokémon de água de porte médio ou grande'};
  },

  /* ar: voador de grande porte, porque os outros não te levantam.
     Ter o tipo Voador não é o mesmo que voar: Doduo e Dodrio correm,
     e nenhum dos dois tira o pé do chão. */
  voar(){
    const q = this._time().find(p => this._tipo(p,'Voador') && porteDe(p.dex) === 'grande'
                                     && !NAO_DECOLA.has(Number(p.dex)));
    return q ? {pode:true, quem:q, como:`em cima de ${nomeExib(q)}`}
             : {pode:false, falta:'um Pokémon voador de grande porte'};
  },

  /* peso morto: só porte grande */
  forcar(){
    const q = this._time().find(p => porteDe(p.dex) === 'grande');
    return q ? {pode:true, quem:q, como:`com a força de ${nomeExib(q)}`}
             : {pode:false, falta:'um Pokémon de grande porte'};
  },

  /* escuro: luz de bicho não acaba; a da lanterna acaba */
  iluminar(){
    const q = this._time().find(p => emiteLuz(p.dex));
    if (q) return {pode:true, quem:q, como:`com a luz de ${nomeExib(q)}`, semPilha:true};
    if (this._tem('Lanterna')){
      if (this._tem('Pilha')) return {pode:true, como:'com a lanterna', semPilha:false};
      return {pode:false, falta:'pilha pra lanterna, ou um Pokémon que dê luz'};
    }
    return {pode:false, falta:'uma lanterna com pilha, ou um Pokémon que dê luz'};
  },

  /* usado pela folha de regras e pela ficha do time */
  resumo(){
    return [
      ['Cortar',   this.cortar()],
      ['Quebrar',  this.quebrar()],
      ['Atravessar', this.surfar()],
      ['Voar',     this.voar()],
      ['Forçar',   this.forcar()],
      ['Iluminar', this.iluminar()]
    ];
  }
};
