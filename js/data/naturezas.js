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
