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

   Quem te CAÇA é outra coisa (caçandoVoce: você prendeu um do grupo
   dele, captura.js): não espera a história, não fica nos lugares dele
   e vem no nível do seu time. Todo encontro selvagem, em qualquer rota
   ou área especial, tem CHANCE_CACANDO % de ser ele — CHANCE_CACANDO_
   ULTIMO pro último solto de um grupo que já perdeu dois, que "vai
   abrir caminho até você". Soltar o que você prendeu (ou a Patrulha
   apreender) acalma o grupo.

   E o clima que o lendário preso quebrou entra na briga: com Kanto
   instável, CHANCE_CLIMA_NA_LUTA % das lutas com selvagem começam com
   chuva, sol forte ou tempestade de areia (sol só de dia; caverna e
   vulcão não têm céu), pelas regras de clima de sempre.
   Está na folha de regras; mudou número, muda lá.
   ============================================================ */
const CHANCE_ERRANTE = 1;
const CHANCE_CACANDO = 5;
const CHANCE_CACANDO_ULTIMO = 10;
const CHANCE_CLIMA_NA_LUTA = {instavel:20, caotico:40, 'permanentemente instável':40};
const SEM_CEU_NA_LUTA = ['caverna', 'vulcao'];
const LINHA_DO_CLIMA = {
  chuva:'O céu fecha de uma vez, sem nuvem chegando de lado nenhum, e a chuva desaba.',
  sol:'O sol aperta fora de hora, quente demais pra estação.',
  areia:'Um vento seco levanta a terra do chão e não assenta mais.'
};
/* o nome do clima de Kanto na tela (o campo guarda sem acento) */
const NOME_DO_CLIMA = {normal:'normal', instavel:'instável', caotico:'caótico',
  'permanentemente instável':'permanentemente instável'};

const LENDARIOS_ERRANTES = {
  144:{lugares:['seafoam', 'rota19', 'rota21'], nivel:56,
       sinal:'O ar esfria de uma vez, e a sua respiração sai branca como se fosse inverno.'},
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
  solto(L){ return !['capturado', 'morto', 'vendido'].includes(L.estado) && L.disposicao !== 'prisioneiro'; },
  /* a história já te pôs na frente dele, e ele está solto */
  ronda(dex){
    const L = Estado.dados.lendarios && Estado.dados.lendarios[dex];
    if (!L || !(L.visto || L.encontros > 0)) return false;
    return this.solto(L);
  },
  /* quem te caça agora: solto, e com um do grupo dele na sua Pokébola */
  cacando(){
    const lend = Estado.dados.lendarios || {};
    return Object.keys(LENDARIOS_ERRANTES).map(Number).filter(dex => lend[dex] && lend[dex].caçandoVoce && this.solto(lend[dex]));
  },
  /* o último solto de um grupo que já perdeu dois */
  ultimoDoGrupo(dex){
    const g = [GRUPO_AVES, GRUPO_CAES].find(x => x.includes(dex));
    /* sem Estado.lend: ele cria a ficha de quem você nunca viu, e a Ficha
       mostraria o lendário que a história ainda não te mostrou */
    const lend = Estado.dados.lendarios || {};
    return !!g && g.filter(x => lend[x] && lend[x].estado === 'capturado').length >= 2;
  },

  /* quem ronda este lugar agora */
  aqui(localId){
    return Object.keys(LENDARIOS_ERRANTES).map(Number)
      .filter(dex => LENDARIOS_ERRANTES[dex].lugares.includes(localId) && this.ronda(dex));
  },

  /* a rolagem do encontro: devolve o Pokémon e a entrada, ou null.
     Primeiro quem te caça (em qualquer lugar), depois quem ronda ali */
  talvez(localId){
    const local = LOCAIS[localId];
    const cacam = local && local.tipo !== 'cidade' ? this.cacando() : [];
    if (cacam.length){
      /* uma rolagem só: sorteia quem, e rola a chance dele */
      const dex = Dados.escolher(cacam);
      if (Dados.chance(this.ultimoDoGrupo(dex) ? CHANCE_CACANDO_ULTIMO : CHANCE_CACANDO)) return this.cacador(dex, localId);
    }
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
  },

  /* quem te caça vem no nível do seu time (três acima, seis o último
     do grupo), nunca abaixo do lugar nem acima do nível dele */
  nivelDoCacador(dex, localId){
    const E = LENDARIOS_ERRANTES[dex], ultimo = this.ultimoDoGrupo(dex);
    const teto = E.nivel + (ultimo ? 4 : 0);
    const lugar = (LOCAIS[localId] || {}).nivel || 5;
    return Math.max(5, Math.min(teto, Math.max(lugar, nivelDeReferencia() + (ultimo ? 6 : 3))));
  },
  cacador(dex, localId){
    const E = LENDARIOS_ERRANTES[dex], L = Estado.lend(dex);
    L.errante = (L.errante || 0) + 1;
    L.visto = true;
    const p = criarPokemon(dex, this.nivelDoCacador(dex, localId), {selvagem:true});
    const intro = [E.sinal, 'Não é acaso. Ele veio atrás de você.'];
    if (this.ultimoDoGrupo(dex)) intro.push('Ele não para na beira do mato. Vem reto, pelo meio do que estiver na frente.');
    Estado.registrar(`O ${DEX[dex].nome} veio atrás de você ${emLocal(localId)}.`);
    return {p, intro};
  },

  /* o clima quebrado entra na luta com selvagem: null, ou o tipo e a
     linha da entrada */
  climaDaLuta(localId){
    const d = Estado.dados, ch = CHANCE_CLIMA_NA_LUTA[d && d.mundo && d.mundo.clima];
    const L = LOCAIS[localId];
    if (!ch || !L || SEM_CEU_NA_LUTA.includes(L.ambiente) || !Dados.chance(ch)) return null;
    const h = d.relogio ? d.relogio.hora : 12;
    const tipos = h >= 6 && h < 18 ? ['chuva', 'sol', 'areia'] : ['chuva', 'areia'];
    const tipo = Dados.escolher(tipos);
    return {tipo, linha:LINHA_DO_CLIMA[tipo]};
  }
};
