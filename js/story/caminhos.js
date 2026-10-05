/* ============================================================
   CAMINHOS — a história que se divide
   (desenho completo em docs/CAMINHOS.md)

   A espinha dos 28 capítulos é a mesma pra todo mundo. Em três pontos
   dela, depois do 12, do 19 e do 25, a jornada desvia por um capítulo
   que só existe no caminho do jogador naquela hora: o lado dele
   (linhaAtual, em linhas.js) ou, sem lado nenhum, o Andarilho.

   Cada caminho tem três capítulos, um por ponto. O terceiro pode
   acabar a jornada ali, com finais que só existem nele; quem não acaba
   volta pro capítulo 26.

   O número do capítulo de caminho é a POSIÇÃO dele na jornada: 12.01
   fica entre o 12 e o 13 em toda comparação (contato que só aparece
   "depois do capítulo 13" continua não aparecendo). Quem desenha o
   número na tela é numeroDoCapitulo(), não o num cru.
   ============================================================ */

const PONTOS_DE_DESVIO = [
  {de:12, volta:13},   // A: a Zona Safári, antes de Seafoam
  {de:19, volta:20},   // B: o Viveiro, antes da sala 704
  {de:25, volta:26}    // C: a audiência, antes do Planalto
];

/* a ordem decide o decimal: lei é .01, rocket .02… andarilho .10 */
const CAMINHOS = [
  {id:'lei',        nome:'Lei'},
  {id:'rocket',     nome:'Rocket'},
  {id:'ciencia',    nome:'Ciência'},
  {id:'imprensa',   nome:'Imprensa'},
  {id:'criacao',    nome:'Criação'},
  {id:'liga',       nome:'Liga'},
  {id:'heroi',      nome:'Herói'},
  {id:'mercenario', nome:'Mercenário'},
  {id:'foragido',   nome:'Foragido'},
  {id:'andarilho',  nome:'Andarilho'}
];
CAMINHOS.forEach((cm, i) => {
  cm.caps = PONTOS_DE_DESVIO.map(p => +(p.de + (i + 1) / 100).toFixed(2));
});

/* Sem lado nenhum, quem vive de ginásio (4 insígnias ou mais) anda
   no caminho da Liga, e quem não tem nem isso é o Andarilho. Os postos
   da Liga só abrem no capítulo 20; sem essa regra, a Liga só teria o
   terceiro capítulo. */
const INSIGNIAS_PRA_LIGA = 4;
function caminhoAtual(d){
  d = d || Estado.dados;
  const l = (typeof linhaAtual === 'function') ? linhaAtual(d) : null;
  if (CAMINHOS.some(c => c.id === l)) return l;
  const ins = (d.insignias || []).filter(i => i !== 'Título de Campeão').length;
  return ins >= INSIGNIAS_PRA_LIGA ? 'liga' : 'andarilho';
}
function defCaminho(id){ return CAMINHOS.find(c => c.id === id) || null; }

/* "Capítulo 12" ou, no desvio, o nome do caminho e a parte dele */
function numeroDoCapitulo(cap){
  if (!cap) return '';
  if (!cap.caminho) return `Capítulo ${cap.num}`;
  const cm = defCaminho(cap.caminho);
  const parte = cm ? cm.caps.indexOf(cap.num) : -1;
  return `${cm ? cm.nome : 'Caminho'} · ${['I', 'II', 'III'][parte] || ''}`.trim();
}

/* o nível de luta de um capítulo de caminho: o do lugar, ou o do seu
   time se você já passou dele (luta de capítulo não fica de graça) */
function nivelDoCaminho(d, extra){
  const vivos = (d.time || []).filter(p => !p.morto);
  const topo = vivos.length ? Math.max(...vivos.map(p => p.nivel)) : 10;
  const area = (Historia.capAtual && Historia.capAtual.nivelArea) || 30;
  return Math.max(area, topo) + (extra || 0);
}

/* ---------- a ligação: cada capítulo de caminho no seu ponto ---------- */
(function(){
  CAMINHOS.forEach(cm => cm.caps.forEach((n, k) => {
    const c = CAPITULOS.find(x => x.num === n);
    if (!c) return;
    c.caminho = cm.id;
    c.requer = d => caminhoAtual(d) === cm.id;
    const volta = PONTOS_DE_DESVIO[k].volta;
    if (typeof c.proximo !== 'function') c.proximo = d => volta;
    /* onde o capítulo espera no mapa */
    if (c.ancora && typeof ANCORAS !== 'undefined') ANCORAS[n] = c.ancora;
  }));

  PONTOS_DE_DESVIO.forEach(({de, volta}, k) => {
    const anfitriao = CAPITULOS.find(c => c.num === de);
    if (!anfitriao) return;
    const antes = anfitriao.proximo;
    anfitriao.proximo = d => {
      if (typeof antes === 'function'){
        const forcado = antes(d);
        if (forcado && forcado !== volta) return forcado;
      }
      const cm = defCaminho(caminhoAtual(d));
      const n = cm && cm.caps[k];
      const cap = n && CAPITULOS.find(c => c.num === n);
      const feito = (d.capitulosFechados || []).some(x => PONTOS_DE_DESVIO[k].de < x && x < volta);
      if (cap && !feito) return n;
      return volta;
    };
  });
})();
