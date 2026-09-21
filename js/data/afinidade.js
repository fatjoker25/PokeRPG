/* ============================================================
   AFINIDADE — o seu jeito contra o jeito dele

   Quem você é está escrito na ficha, em palavras suas. Cada
   palavra puxa os mesmos cinco eixos que a natureza de um
   Pokémon puxa (discrição, paciência, coragem, simpatia,
   cuidado). Quando os dois puxam pro mesmo lado, vocês se
   entendem sem falar. Quando puxam pra lados opostos, cada
   ordem custa mais.

   Nada disso é explicado ao jogador em texto de regra. Ele lê
   o que acontece e tira as conclusões dele.
   ============================================================ */

/* Radicais em português. Bate por prefixo, então "teimoso",
   "teimosa" e "teimosia" caem todos no mesmo lugar. */
const TRACOS_JOGADOR = {
  teimos:      {paciencia:-1, coragem: 2, cuidado:-1},
  cabeça:      {paciencia:-1, coragem: 2},
  leal:        {simpatia: 2, cuidado: 1},
  fiel:        {simpatia: 2, cuidado: 1},
  impulsiv:    {discricao:-2, paciencia:-2, coragem: 2},
  explosiv:    {discricao:-2, paciencia:-2, coragem: 1},
  calm:        {discricao: 1, paciencia: 2, cuidado: 1},
  pacient:     {paciencia: 2, cuidado: 1},
  reservad:    {discricao: 2, paciencia: 1, simpatia:-1},
  discret:     {discricao: 2, cuidado: 1},
  quiet:       {discricao: 2, paciencia: 1},
  calad:       {discricao: 2, simpatia:-1},
  silencios:   {discricao: 2},
  introvertid: {discricao: 2, simpatia:-1},
  solitári:    {discricao: 1, simpatia:-2},
  solitari:    {discricao: 1, simpatia:-2},
  tímid:       {discricao: 2, coragem:-2, simpatia:-1},
  timid:       {discricao: 2, coragem:-2, simpatia:-1},
  acanhad:     {discricao: 2, coragem:-1, simpatia:-1},
  medros:      {coragem:-2, cuidado: 1},
  covarde:     {coragem:-2, cuidado: 1},
  corajos:     {coragem: 2},
  valent:      {coragem: 2},
  destemid:    {coragem: 2, cuidado:-1},
  ousad:       {coragem: 2, cuidado:-1},
  determinad:  {coragem: 2, paciencia: 1},
  persistent:  {paciencia: 2, coragem: 1},
  esforçad:    {paciencia: 2, coragem: 1},
  esforcad:    {paciencia: 2, coragem: 1},
  trabalhador: {paciencia: 2, cuidado: 1},
  disciplinad: {paciencia: 2, cuidado: 2},
  metódic:     {paciencia: 2, cuidado: 2},
  metodic:     {paciencia: 2, cuidado: 2},
  organizad:   {cuidado: 2, paciencia: 1},
  cuidados:    {cuidado: 2},
  atent:       {cuidado: 2, discricao: 1},
  observador:  {cuidado: 2, paciencia: 2, discricao: 1},
  cautelos:    {cuidado: 2, discricao: 1, coragem:-1},
  prudent:     {cuidado: 2, paciencia: 1},
  desconfiad:  {cuidado: 2, discricao: 1, simpatia:-1},
  protetor:    {cuidado: 2, coragem: 1, simpatia: 1},
  imprudent:   {cuidado:-2, coragem: 2},
  descuidad:   {cuidado:-2},
  desleix:     {cuidado:-2, paciencia: 1},
  distraíd:    {cuidado:-2, discricao:-1},
  distraid:    {cuidado:-2, discricao:-1},
  esquecid:    {cuidado:-2},
  atrapalhad:  {cuidado:-2, discricao:-1},
  bagunceir:   {cuidado:-2, discricao:-1},
  ingênu:      {cuidado:-2, simpatia: 1},
  ingenu:      {cuidado:-2, simpatia: 1},
  sonhador:    {cuidado:-1, coragem: 1, paciencia:-1},
  curios:      {cuidado:-1, paciencia:-1, coragem: 1},
  ansios:      {paciencia:-2, cuidado:-1},
  nervos:      {paciencia:-2, cuidado:-1},
  apress:      {paciencia:-2, discricao:-1},
  agitad:      {paciencia:-2, discricao:-2},
  inquiet:     {paciencia:-2, discricao:-1},
  barulhent:   {discricao:-2, simpatia: 1},
  falante:     {discricao:-2, simpatia: 1},
  extrovertid: {discricao:-2, simpatia: 2},
  sociáv:      {discricao:-1, simpatia: 2},
  sociav:      {discricao:-1, simpatia: 2},
  chamativ:    {discricao:-2},
  dramátic:    {discricao:-2, simpatia:-1},
  dramatic:    {discricao:-2, simpatia:-1},
  brincalhã:   {discricao:-2, paciencia:-1, simpatia: 2},
  brincalha:   {discricao:-2, paciencia:-1, simpatia: 2},
  alegre:      {discricao:-1, simpatia: 2},
  otimista:    {simpatia: 1, coragem: 1},
  pessimista:  {coragem:-1, cuidado: 1},
  gentil:      {simpatia: 2},
  generos:     {simpatia: 2},
  bondos:      {simpatia: 2},
  carinhos:    {simpatia: 2},
  amig:        {simpatia: 2},
  educad:      {simpatia: 1, cuidado: 1},
  honest:      {simpatia: 1, discricao:-1},
  sincer:      {simpatia: 1, discricao:-1},
  humilde:     {simpatia: 1, cuidado: 1},
  just:        {simpatia: 1, cuidado: 1},
  sensív:      {simpatia: 2, coragem:-1},
  sensiv:      {simpatia: 2, coragem:-1},
  pacífic:     {simpatia: 1, paciencia: 2, coragem:-1},
  pacific:     {simpatia: 1, paciencia: 2, coragem:-1},
  orgulhos:    {simpatia:-1, coragem: 1},
  arrogante:   {simpatia:-2, coragem: 1},
  vaidos:      {simpatia:-1, discricao:-1},
  ríspid:      {simpatia:-2},
  rispid:      {simpatia:-2},
  grosseir:    {simpatia:-2},
  rancoros:    {simpatia:-2, paciencia:-1},
  gananc:      {simpatia:-2, cuidado:-1},
  fri:         {simpatia:-2, discricao: 1},
  duron:       {simpatia:-1, coragem: 2},
  durão:       {simpatia:-1, coragem: 2},
  durao:       {simpatia:-1, coragem: 2},
  sério:       {simpatia:-1, paciencia: 1, cuidado: 1},
  serio:       {simpatia:-1, paciencia: 1, cuidado: 1},
  mentiros:    {discricao: 2, simpatia:-2},
  astut:       {discricao: 2, cuidado: 1},
  espert:      {discricao: 1, cuidado: 1},
  rebelde:     {paciencia:-1, coragem: 2, cuidado:-1},
  obedient:    {paciencia: 1, cuidado: 1, coragem:-1},
  competitiv:  {coragem: 2, paciencia:-1, simpatia:-1},
  brigã:       {coragem: 2, paciencia:-2, simpatia:-1},
  briga:       {coragem: 2, paciencia:-2, simpatia:-1},
  briguent:    {coragem: 2, paciencia:-2, simpatia:-1},
  preguiçoso:  {paciencia: 2, cuidado:-1},
  preguic:     {paciencia: 2, cuidado:-1},
  lent:        {paciencia: 2, discricao: 1},
  prátic:      {cuidado: 1, paciencia:-1},
  pratic:      {cuidado: 1, paciencia:-1},
  inteligente: {cuidado: 1, paciencia: 1},
  melancól:    {paciencia: 1, simpatia:-1},
  melancol:    {paciencia: 1, simpatia:-1}
};

const EIXOS = ['discricao', 'paciencia', 'coragem', 'simpatia', 'cuidado'];

function _textoDaFicha(){
  const j = (Estado.dados && Estado.j) ? Estado.j : null;
  if (!j) return '';
  return [j.personalidade, j.objetivo].filter(Boolean).join(' ');
}

let _perfilCache = {chave:null, perfil:null};

/* O seu jeito como vetor. Sai do que você escreveu na criação. */
function perfilDoJogador(texto){
  const bruto = (texto !== undefined ? texto : _textoDaFicha()) || '';
  if (texto === undefined && _perfilCache.chave === bruto) return _perfilCache.perfil;

  const limpo = bruto.toLowerCase();
  const perfil = {discricao:0, paciencia:0, coragem:0, simpatia:0, cuidado:0};
  let achou = 0;
  for (const raiz in TRACOS_JOGADOR){
    if (limpo.indexOf(raiz) === -1) continue;
    achou++;
    const t = TRACOS_JOGADOR[raiz];
    for (const e in t) perfil[e] += t[e];
  }
  for (const e of EIXOS) perfil[e] = Math.max(-2, Math.min(2, perfil[e]));
  perfil.palavras = achou;

  if (texto === undefined) _perfilCache = {chave:bruto, perfil};
  return perfil;
}

/* Quanto o jeito de um Pokémon combina com o seu: −10 a +10. */
function afinidadeCom(p){
  const vazio = {valor:0, grau:'neutro', conhecido:false, pokemon:p};
  if (!p || !p.natureza) return vazio;
  const t = (typeof tempDe === 'function') ? tempDe(p) : null;
  if (!t) return vazio;
  const perfil = perfilDoJogador();
  if (!perfil.palavras) return vazio;

  let soma = 0;
  for (const e of EIXOS) soma += (perfil[e] || 0) * (t[e] || 0);
  /* convivência amacia: com o tempo vocês se acertam um pouco */
  const conv = Math.max(0, Math.min(100, p.convivencia || 0));
  const amaciado = soma < 0 ? soma + (conv / 100) * 3 : soma + (conv / 100) * 1.5;
  const valor = Math.max(-10, Math.min(10, Math.round(amaciado / 2)));

  let grau = 'neutro';
  if (valor >= 5)       grau = 'sintonia';
  else if (valor >= 2)  grau = 'entrosado';
  else if (valor <= -5) grau = 'atrito';
  else if (valor <= -2) grau = 'desencontro';

  return {valor, grau, conhecido: !!p.naturezaVista, pokemon:p};
}

/* O que a afinidade faz nas contas. Sem tabela na tela. */
function efeitosDeAfinidade(p){
  const a = afinidadeCom(p);
  const E = {
    sintonia:   {obediencia:-10, crit: 1, teste: 1},
    entrosado:  {obediencia: -5, crit: 0, teste: 0},
    neutro:     {obediencia:  0, crit: 0, teste: 0},
    desencontro:{obediencia:  6, crit: 0, teste:-1},
    atrito:     {obediencia: 12, crit: 0, teste:-1}
  };
  const e = E[a.grau] || E.neutro;
  const nome = (typeof nomeExib === 'function' && p) ? nomeExib(p) : '';
  let linha = null;
  if (e.teste > 0) linha = `${nome} entra na frente e não precisa de ordem.`;
  if (e.teste < 0) linha = `${nome} vai na frente sem entender direito o que você quer.`;
  return {grau:a.grau, valor:a.valor, obediencia:e.obediencia, crit:e.crit, teste:e.teste,
          nome, linha};
}

/* Ele é seu? A afinidade só vale pro seu lado do campo. */
function _meuPokemon(p){
  if (!p || !Estado.dados) return false;
  const meu = (Estado.dados.time || []).concat(Estado.dados.pc || []);
  return meu.some(x => x === p || (x.uid && p.uid && x.uid === p.uid));
}

/* O que aparece na ficha. Nunca diz "eixo", nunca diz "+1 no dado". */
const FRASE_AFINIDADE = {
  sintonia:   'Entende o que você quer antes de você falar.',
  entrosado:  'Trabalha bem com você.',
  neutro:     'Faz o que você manda e nada além disso.',
  desencontro:'Sempre demora um instante a mais pra entender você.',
  atrito:     'Vocês dois não se entendem.'
};

function linhaDeAfinidade(p){
  const a = afinidadeCom(p);
  if (!a.conhecido || a.grau === 'neutro') return null;
  return FRASE_AFINIDADE[a.grau];
}

