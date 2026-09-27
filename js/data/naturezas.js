/* ============================================================
   NATUREZAS — +10% / -10% e comportamento narrativo em combate
   agressiva: pode atacar o TREINADOR após derrubar o Pokémon dele
   ============================================================ */
const NATUREZAS = {
  'Hardy':   {mais:null,  menos:null, agressiva:false, traco:'Equilibrado. Faz o que mandam, sem drama.'},
  'Lonely':  {mais:'atk', menos:'def', agressiva:true,  traco:'Solitário. Ataca antes de confiar em você.'},
  'Brave':   {mais:'atk', menos:'spe', agressiva:true,  traco:'Corajoso. Recusa golpes especiais — quer sentir o impacto.'},
  'Adamant': {mais:'atk', menos:'spa', agressiva:true,  traco:'Determinado. Ignora ordens que considere covardia.'},
  'Naughty': {mais:'atk', menos:'spd', agressiva:true,  traco:'Travesso. Ataca alvos errados de propósito.'},
  'Bold':    {mais:'def', menos:'atk', agressiva:false, traco:'Ousado na defesa. Protege antes de atacar.'},
  'Docile':  {mais:null,  menos:null, agressiva:false, traco:'Dócil. Obedece sem questionar.'},
  'Relaxed': {mais:'def', menos:'spe', agressiva:false, traco:'Relaxado. Demora a reagir, mas aguenta.'},
  'Impish':  {mais:'def', menos:'spa', agressiva:true,  traco:'Malicioso. Provoca o adversário antes de bater.'},
  'Lax':     {mais:'def', menos:'spd', agressiva:false, traco:'Desleixado. Às vezes baixa a guarda.'},
  'Timid':   {mais:'spe', menos:'atk', agressiva:false, traco:'Tímido. Hesita em golpes físicos — prefere distância.'},
  'Hasty':   {mais:'spe', menos:'def', agressiva:true,  traco:'Apressado. Ataca sem esperar comando.'},
  'Serious': {mais:null,  menos:null, agressiva:false, traco:'Sério. Executa a ordem exata, nada além.'},
  'Jolly':   {mais:'spe', menos:'spa', agressiva:true,  traco:'Alegre e elétrico. Briga rindo.'},
  'Naive':   {mais:'spe', menos:'spd', agressiva:true,  traco:'Ingênuo. Se joga em perigo sem medir.'},
  'Modest':  {mais:'spa', menos:'atk', agressiva:false, traco:'Modesto. Evita contato físico.'},
  'Mild':    {mais:'spa', menos:'def', agressiva:false, traco:'Ameno. Recua quando pressionado.'},
  'Quiet':   {mais:'spa', menos:'spe', agressiva:false, traco:'Quieto. Age por último, com precisão.'},
  'Bashful': {mais:null,  menos:null, agressiva:false, traco:'Envergonhado. Só age quando olham para ele.'},
  'Rash':    {mais:'spa', menos:'spd', agressiva:true,  traco:'Impulsivo. Descarrega tudo sem se proteger.'},
  'Calm':    {mais:'spd', menos:'atk', agressiva:false, traco:'Calmo. Nunca começa uma briga.'},
  'Gentle':  {mais:'spd', menos:'def', agressiva:false, traco:'Gentil. Hesita em machucar de verdade.'},
  'Sassy':   {mais:'spd', menos:'spe', agressiva:false, traco:'Atrevido. Responde, mas não ataca primeiro.'},
  'Careful': {mais:'spd', menos:'spa', agressiva:false, traco:'Cuidadoso. Estuda antes de agir.'},
  'Quirky':  {mais:null,  menos:null, agressiva:false, traco:'Peculiar. Imprevisível, mas inofensivo.'}
};

const NOMES_NATUREZAS = Object.keys(NATUREZAS);

/* ============================================================
   TEMPERAMENTO — o que a natureza serve FORA do combate
   Uma tarefa que pede silêncio não é a mesma coisa com um
   Jolly no cinto e com um Quiet. Cada natureza tem peso em
   cinco eixos, de -2 a +2:

     discricao  — passar sem ser notado
     paciencia  — esperar sem estragar a espera
     coragem    — entrar onde não se quer entrar
     simpatia   — fazer estranho baixar a guarda
     cuidado    — mexer em coisa frágil sem quebrar
   ============================================================ */
const TEMPERAMENTO = {
  'Hardy':   {discricao: 0, paciencia: 0, coragem: 0, simpatia: 0, cuidado: 0},
  'Lonely':  {discricao: 1, paciencia:-1, coragem: 1, simpatia:-2, cuidado: 0},
  'Brave':   {discricao:-1, paciencia: 0, coragem: 2, simpatia: 0, cuidado:-1},
  'Adamant': {discricao:-1, paciencia:-1, coragem: 2, simpatia:-1, cuidado:-1},
  'Naughty': {discricao:-2, paciencia:-1, coragem: 1, simpatia: 0, cuidado:-2},
  'Bold':    {discricao: 0, paciencia: 1, coragem: 1, simpatia: 0, cuidado: 1},
  'Docile':  {discricao: 1, paciencia: 1, coragem:-1, simpatia: 1, cuidado: 1},
  'Relaxed': {discricao: 2, paciencia: 2, coragem: 0, simpatia: 1, cuidado: 1},
  'Impish':  {discricao:-2, paciencia:-1, coragem: 1, simpatia:-1, cuidado:-1},
  'Lax':     {discricao: 0, paciencia: 1, coragem: 0, simpatia: 1, cuidado:-1},
  'Timid':   {discricao: 2, paciencia: 1, coragem:-2, simpatia:-1, cuidado: 1},
  'Hasty':   {discricao:-2, paciencia:-2, coragem: 1, simpatia: 0, cuidado:-2},
  'Serious': {discricao: 1, paciencia: 1, coragem: 0, simpatia:-1, cuidado: 2},
  'Jolly':   {discricao:-2, paciencia:-2, coragem: 1, simpatia: 2, cuidado:-1},
  'Naive':   {discricao:-1, paciencia:-2, coragem: 2, simpatia: 1, cuidado:-2},
  'Modest':  {discricao: 1, paciencia: 1, coragem:-1, simpatia: 1, cuidado: 1},
  'Mild':    {discricao: 1, paciencia: 0, coragem:-1, simpatia: 1, cuidado: 1},
  'Quiet':   {discricao: 2, paciencia: 2, coragem: 0, simpatia:-1, cuidado: 2},
  'Bashful': {discricao: 2, paciencia: 0, coragem:-2, simpatia:-1, cuidado: 1},
  'Rash':    {discricao:-2, paciencia:-2, coragem: 1, simpatia: 0, cuidado:-2},
  'Calm':    {discricao: 2, paciencia: 2, coragem:-1, simpatia: 2, cuidado: 1},
  'Gentle':  {discricao: 1, paciencia: 1, coragem:-1, simpatia: 2, cuidado: 2},
  'Sassy':   {discricao:-1, paciencia: 1, coragem: 0, simpatia:-1, cuidado: 1},
  'Careful': {discricao: 1, paciencia: 2, coragem:-1, simpatia: 0, cuidado: 2},
  'Quirky':  {discricao: 0, paciencia: 0, coragem: 0, simpatia: 0, cuidado: 0}
};

/* Qual eixo do cinto pesa em cada perícia do treinador. Um teste de
   Percepção vai melhor com bicho cuidadoso; um de Carisma, com bicho
   que gosta de gente. Serve pros testes de cena, que não declaram eixo. */
const EIXO_DO_STATUS = {
  percepcao:'cuidado', carisma:'simpatia', forca:'coragem',
  intelecto:'paciencia', resistencia:'coragem', sorte:null
};

function tempDe(p){
  if (!p || !p.natureza) return null;
  return TEMPERAMENTO[p.natureza] || null;
}

/* O melhor do time num eixo, e quem é. Time vazio devolve zero. */
function melhorNoEixo(eixo, time){
  const lista = (time || (Estado.dados ? Estado.dados.time : []) || []).filter(p => !p.morto);
  let melhor = null, valor = 0;
  for (const p of lista){
    const t = tempDe(p);
    if (!t) continue;
    const v = t[eixo] || 0;
    if (melhor === null || v > valor){ melhor = p; valor = v; }
  }
  return {pokemon:melhor, valor};
}

/* O pior do time num eixo — quem atrapalha, que é o outro lado da moeda */
function piorNoEixo(eixo, time){
  const lista = (time || (Estado.dados ? Estado.dados.time : []) || []).filter(p => !p.morto);
  let pior = null, valor = 0;
  for (const p of lista){
    const t = tempDe(p);
    if (!t) continue;
    const v = t[eixo] || 0;
    if (pior === null || v < valor){ pior = p; valor = v; }
  }
  return {pokemon:pior, valor};
}

/* ============================================================
   O MODIFICADOR QUE VAI PRO DADO
   Quem você leva conta. O melhor do time puxa pra cima e o pior
   puxa pra baixo, com o melhor pesando mais — você escolhe quem
   solta, mas não escolhe quem está no cinto.
   ============================================================ */
function modificadorDeTemperamento(eixo, time){
  const m = melhorNoEixo(eixo, time);
  const p = piorNoEixo(eixo, time);
  if (!m.pokemon) return {mod:0, melhor:null, pior:null, linha:null};
  const mod = Math.round(m.valor + (p.valor < 0 ? p.valor * 0.5 : 0));
  return {mod, melhor:m, pior:p, linha: linhaDeTemperamento(eixo, m, p, mod)};
}

function linhaDeTemperamento(eixo, m, p, mod){
  if (!m.pokemon) return null;
  /* Só o que dá pra ver acontecendo. Sem nome de eixo, sem regra
     explicada: se o jogador quiser entender por que deu certo,
     ele olha pro cinto. */
  const como = x => x.naturezaVista ? `${nomeExib(x)} (${x.natureza})` : nomeExib(x);
  if (m.valor <= 0 && p.valor < 0)
    return m.pokemon.uid === p.pokemon.uid
      ? `${como(p.pokemon)} atrapalha.`
      : `Ninguém no cinto ajuda, e ${como(p.pokemon)} atrapalha.`;
  const partes = [];
  if (m.valor > 0) partes.push(`${como(m.pokemon)} acompanha bem`);
  if (p.valor < 0 && p.pokemon.uid !== m.pokemon.uid) partes.push(`${como(p.pokemon)} atrapalha`);
  if (!partes.length) return null;
  return partes.join(' · ') + '.';
}
