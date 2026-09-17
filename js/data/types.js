/* ============================================================
   TIPOS — Tabela de eficácia (1ª Geração, 15 tipos)
   ============================================================ */
const TIPOS = ['Normal','Fogo','Água','Elétrico','Grama','Gelo','Lutador','Venenoso','Terrestre','Voador','Psíquico','Inseto','Pedra','Fantasma','Dragão'];

const COR_TIPO = {
  'Normal':'#9aa0a6','Fogo':'#e8603c','Água':'#4a90d9','Elétrico':'#e8c23c',
  'Grama':'#5fb85f','Gelo':'#7fd4e0','Lutador':'#c0392b','Venenoso':'#9b59b6',
  'Terrestre':'#c9a227','Voador':'#8fa8dd','Psíquico':'#e0568a','Inseto':'#8fb020',
  'Pedra':'#a89060','Fantasma':'#6a5acd','Dragão':'#5a4fcf'
};

/* Multiplicadores: TABELA[atacante][defensor] — ausente = 1x */
const TABELA_TIPOS = {
  'Normal':    { 'Pedra':0.5, 'Fantasma':0 },
  'Fogo':      { 'Fogo':0.5, 'Água':0.5, 'Grama':2, 'Gelo':2, 'Inseto':2, 'Pedra':0.5, 'Dragão':0.5 },
  'Água':      { 'Fogo':2, 'Água':0.5, 'Grama':0.5, 'Terrestre':2, 'Pedra':2, 'Dragão':0.5 },
  'Elétrico':  { 'Água':2, 'Elétrico':0.5, 'Grama':0.5, 'Terrestre':0, 'Voador':2, 'Dragão':0.5 },
  'Grama':     { 'Fogo':0.5, 'Água':2, 'Grama':0.5, 'Venenoso':0.5, 'Terrestre':2, 'Voador':0.5, 'Inseto':0.5, 'Pedra':2, 'Dragão':0.5 },
  'Gelo':      { 'Água':0.5, 'Grama':2, 'Gelo':0.5, 'Terrestre':2, 'Voador':2, 'Dragão':2 },
  'Lutador':   { 'Normal':2, 'Gelo':2, 'Venenoso':0.5, 'Voador':0.5, 'Psíquico':0.5, 'Inseto':0.5, 'Pedra':2, 'Fantasma':0 },
  'Venenoso':  { 'Grama':2, 'Venenoso':0.5, 'Terrestre':0.5, 'Inseto':2, 'Pedra':0.5, 'Fantasma':0.5 },
  'Terrestre': { 'Fogo':2, 'Elétrico':2, 'Grama':0.5, 'Venenoso':2, 'Voador':0, 'Inseto':0.5, 'Pedra':2 },
  'Voador':    { 'Elétrico':0.5, 'Grama':2, 'Lutador':2, 'Inseto':2, 'Pedra':0.5 },
  'Psíquico':  { 'Lutador':2, 'Venenoso':2, 'Psíquico':0.5 },
  'Inseto':    { 'Fogo':0.5, 'Grama':2, 'Lutador':0.5, 'Venenoso':2, 'Voador':0.5, 'Psíquico':2, 'Fantasma':0.5 },
  'Pedra':     { 'Fogo':2, 'Gelo':2, 'Lutador':0.5, 'Terrestre':0.5, 'Voador':2, 'Inseto':2 },
  'Fantasma':  { 'Normal':0, 'Psíquico':2, 'Fantasma':2 },
  'Dragão':    { 'Dragão':2 }
};

function eficacia(tipoGolpe, tiposAlvo){
  let m = 1;
  const linha = TABELA_TIPOS[tipoGolpe] || {};
  for (const t of tiposAlvo){ if (linha[t] !== undefined) m *= linha[t]; }
  return m;
}

function textoEficacia(m){
  if (m === 0) return 'Não afeta o alvo...';
  if (m >= 4) return 'Devastador! (4x)';
  if (m >= 2) return 'É super efetivo! (2x)';
  if (m <= 0.25) return 'Quase não arranha... (0.25x)';
  if (m <= 0.5) return 'Não é muito efetivo... (0.5x)';
  return '';
}
