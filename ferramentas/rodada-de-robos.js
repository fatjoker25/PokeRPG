/* ============================================================
   RODADA DE ROBÔS — um robô por posto
   Solta um robô (bot-jogador.js) pra cada posto de CARGOS, cada um com
   o seu jeito e o objetivo de ficha que combina com ele, o inicial
   sorteado (um dos três clássicos ou o que já estava em casa) e o
   resto da ficha sorteado, do capítulo 1 em diante. O robô vai atrás
   do posto dele quando abre (CARGO=) e pode pegar outro de passagem,
   do bem ou do mal, se não fechar a porta do dele.

   A jogada anda em etapas de [minutos] (RETOMAR=, pelo ponto de
   parada), [juntos] robôs por vez, revezando: quem andou menos vai
   primeiro, então todos avançam juntos e um conserto no jogo entre
   uma etapa e outra vale pra todos na etapa seguinte. No final, o
   robô continua pela estrada (DEPOIS=1) por mais uma etapa e para.

   Em <pasta>: <posto>.json (a saída, a última etapa), <posto>.ponto.json
   (o ponto de parada), <posto>.e<k>.log (o console de cada etapa),
   plano.json (quem é quem, o inicial e as etapas) e rodada.log (o que
   o orquestrador fez). PARAR na pasta termina as etapas em andamento
   limpo e não abre outras; PARAR_<posto> para só aquele; JUNTOS (um
   número) muda quantos andam ao mesmo tempo, a partir da próxima vaga.

   Uso:  node ferramentas/rodada-de-robos.js <pasta> [juntos=5] [minutos=45] [etapas=10]
         SO=treinador,rocket node ferramentas/rodada-de-robos.js t 2 5 1   (só esses)
   ============================================================ */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PASTA = path.resolve(process.argv[2] || 'robos');
const JUNTOS = Math.max(1, +(process.argv[3] || 5));
const ETAPA = Math.max(5, +(process.argv[4] || 45));
const MAX_ETAPAS = Math.max(1, +(process.argv[5] || 10));
const ROBO = path.join(__dirname, 'bot-jogador.js');

/* posto → jeito do robô → objetivo da ficha (METAS, em rumo.js) */
const POSTOS = [
  ['treinador',    'campeao',      'campeao'],
  ['auxiliar',     'estudioso',    'pokedex'],
  ['guarda_rota',  'vigilante',    'heroi'],
  ['policial',     'justiceiro',   'heroi'],
  ['criador',      'cuidadoso',    'vinculo'],
  ['reporter',     'andarilho',    'explorar'],
  ['rocket',       'oportunista',  'poder'],
  ['investigador', 'curioso',      'explorar'],
  ['pesquisador',  'pokedex',      'pokedex'],
  ['comissao',     'pragmatico',   'poder'],
  ['instrutor',    'disciplinado', 'campeao'],
  ['lider',        'orgulhoso',    'campeao'],
  ['elite',        'obstinado',    'campeao'],
  ['professor',    'obsessivo',    'pokedex'],
  ['conselheiro',  'diplomatico',  'casa']
];

fs.mkdirSync(PASTA, {recursive:true});
const PLANO_ARQ = path.join(PASTA, 'plano.json');
const LOG_ARQ = path.join(PASTA, 'rodada.log');
const diz = (...a) => { const l = `[${new Date().toISOString().slice(11, 19)}] ` + a.join(' ');
  console.log(l); fs.appendFileSync(LOG_ARQ, l + '\n'); };
/* o que vale olhar na hora, de qualquer robô, num arquivo só (alertas.log):
   erro de JavaScript, tela que não anda, luta longa, cena sem saída e o
   que o robô acha de texto quebrado. A luta longa sai uma vez por marca */
const ALERTA_ARQ = path.join(PASTA, 'alertas.log');
const ALERTA = /^(ERRO JS|EMPACOU|LUTA(30|60|100) |ACHADO )/;
const alerta = (cargo, l) => {
  if (/^ACHADO luta passou de/.test(l)) return;   // a linha LUTA30 já diz
  const t = `[${new Date().toISOString().slice(11, 19)}] ${cargo} ${l.slice(0, 700)}`;
  fs.appendFileSync(ALERTA_ARQ, t + '\n');
};

/* o plano sobrevive a um recomeço do orquestrador: o inicial sorteado
   e as etapas feitas ficam no arquivo */
let plano = fs.existsSync(PLANO_ARQ) ? JSON.parse(fs.readFileSync(PLANO_ARQ, 'utf8')) : null;
if (!plano){
  /* SO=treinador,rocket solta só esses (pra testar o orquestrador) */
  const so = (process.env.SO || '').split(',').filter(Boolean);
  plano = {inicio:new Date().toISOString(), etapa:ETAPA, robos:POSTOS.filter(([c]) => !so.length || so.includes(c)).map(([cargo, jeito, meta]) => ({
    cargo, jeito, meta, inicial:Math.random() < .5 ? 'classico' : 'rand', etapas:0, fim:null, estados:[]}))};
}
const gravar = () => fs.writeFileSync(PLANO_ARQ, JSON.stringify(plano, null, 1));
gravar();

const rodando = new Map();
/* JUNTOS na pasta muda quantos andam ao mesmo tempo, com a rodada andando */
const juntos = () => { try { return Math.max(1, +fs.readFileSync(path.join(PASTA, 'JUNTOS'), 'utf8') || JUNTOS); } catch (e) { return JUNTOS; } };
const parar = () => fs.existsSync(path.join(PASTA, 'PARAR'));

function proximo(){
  return plano.robos
    .filter(r => !r.fim && !rodando.has(r.cargo) && r.etapas < MAX_ETAPAS && !fs.existsSync(path.join(PASTA, 'PARAR_' + r.cargo)))
    .sort((a, b) => a.etapas - b.etapas)[0] || null;
}

function lancar(r){
  const k = r.etapas + 1;
  const out = path.join(PASTA, r.cargo + '.json');
  const ponto = path.join(PASTA, r.cargo + '.ponto.json');
  const env = Object.assign({}, process.env, {
    NOME:'?', GENERO:'?', CIDADE:'?', META:r.meta, JEITO:r.jeito, CARGO:r.cargo, INICIAL:r.inicial,
    TURBO:'20', LEVE:'1', DEPOIS:'1', PONTO_MIN:'4'
  });
  /* tem ponto de parada: retoma dali, mesmo na primeira etapa (o
     contêiner já caiu no meio de uma, e o robô recomeçava do zero) */
  if (fs.existsSync(ponto)) env.RETOMAR = ponto;
  /* depois do fim é uma etapa só, e mais curta */
  const min = r.depois ? Math.min(ETAPA, 30) : ETAPA;
  const log = fs.openSync(path.join(PASTA, `${r.cargo}.e${k}.log`), 'w');
  const p = spawn('node', [ROBO, String(min), out], {env, stdio:['ignore', 'pipe', 'pipe']});
  let resto = '';
  const ler = buf => {
    fs.writeSync(log, buf);
    const partes = (resto + buf.toString('utf8')).split('\n');
    resto = partes.pop();
    partes.forEach(l => { if (ALERTA.test(l)) alerta(r.cargo, l); });
  };
  p.stdout.on('data', ler); p.stderr.on('data', ler);
  rodando.set(r.cargo, {p, k, t0:Date.now()});
  diz('etapa', k, r.cargo, `(${r.jeito}, ${r.inicial}${env.RETOMAR ? ', retomada' : ''}, ${min} min)`);
  p.on('close', code => {
    fs.closeSync(log);
    rodando.delete(r.cargo);
    r.etapas = k;
    let estado = 'sem saída', resumo = '';
    try {
      const s = JSON.parse(fs.readFileSync(out, 'utf8'));
      estado = s.estado;
      const f = s.ficha || {};
      resumo = `cap ${f.capitulo} · ${(f.insignias || []).length} ins · ${f.cargo || 'sem posto'} · dex ${f.pokedex ? f.pokedex.catalogados : '?'}`
        + `${f.pokedex && f.pokedex.nacional ? ' (Nacional)' : ''} · erros ${(s.erros || []).length} · achados ${Object.keys(s.achados || {}).length}`;
      /* guarda a saída da etapa (a próxima escreve por cima) */
      fs.copyFileSync(out, path.join(PASTA, `${r.cargo}.e${k}.json`));
      if (f.depoisDoFim && !r.depois) r.depois = k;
    } catch (e) { resumo = 'saída ilegível: ' + e.message; }
    r.estados.push(estado);
    if (estado === 'morte') r.fim = 'morte';
    else if (estado === 'final') r.fim = 'final';
    /* passou do fim: uma etapa a mais depois dele e acabou */
    else if (r.depois && k > r.depois) r.fim = 'depois';
    /* travou duas etapas seguidas no mesmo estado ruim: para e avisa */
    else if (['erros', 'travou', 'sem saída'].includes(estado) && r.estados.slice(-2).every(x => x === estado)) r.fim = 'travado: ' + estado;
    diz('fim etapa', k, r.cargo, '→', estado, `(saída ${code})`, resumo, r.fim ? `· FIM ${r.fim}` : '');
    gravar();
    encher();
  });
}

function encher(){
  if (parar()){ if (!rodando.size) { diz('PARAR: nenhuma etapa em andamento.'); acabou(); } return; }
  while (rodando.size < juntos()){
    const r = proximo();
    if (!r) break;
    lancar(r);
  }
  if (!rodando.size) acabou();
}

function acabou(){
  diz('rodada encerrada:', plano.robos.map(r => `${r.cargo}=${r.fim || r.estados.slice(-1)[0] || '-'}`).join(' '));
  plano.fimDaRodada = new Date().toISOString();
  gravar();
  process.exit(0);
}

process.on('SIGTERM', () => { diz('SIGTERM: termino as etapas em andamento'); fs.writeFileSync(path.join(PASTA, 'PARAR'), ''); });
diz(`rodada: ${plano.robos.length} robôs, ${JUNTOS} juntos, etapas de ${ETAPA} min, até ${MAX_ETAPAS} etapas`);
encher();
