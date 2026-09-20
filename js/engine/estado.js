/* ============================================================
   ESTADO — o mundo lembra de tudo
   ============================================================ */
const NIVEIS_BOM = [
  {n:1, nome:'Desconhecido', ef:'Ninguém te conhece.'},
  {n:2, nome:'Familiar',     ef:'Sua cidade te reconhece. Pequenas cortesias.'},
  {n:3, nome:'Reconhecido',  ef:'Descontos, informação de graça, selvagens menos agressivos por perto.'},
  {n:4, nome:'Respeitado',   ef:'NPCs te ouvem antes de agir. Lojas te priorizam.'},
  {n:5, nome:'Famoso',       ef:'Seu nome corre em várias cidades. Convites e rivais.'},
  {n:6, nome:'Admirado',     ef:'Favores sem cobrança. A Liga te consulta. Selvagens fracos fogem de você.'},
  {n:7, nome:'Ídolo Regional', ef:'Cidades te recebem com festa. Cargos oferecidos sem pedir.'},
  {n:8, nome:'Lendário',     ef:'Kanto inteira sabe seu nome. A Liga te trata como autoridade.'}
];
const NIVEIS_RUIM = [
  {n:1, nome:'Desconhecido', ef:'Ninguém te conhece.'},
  {n:2, nome:'Suspeito',     ef:'Olhares desconfiados. Lojistas te observam.'},
  {n:3, nome:'Indesejado',   ef:'NPCs evitam te abordar. Atendimento a contragosto.'},
  {n:4, nome:'Temido',       ef:'Vozes baixam quando você entra. Selvagens atacam primeiro.'},
  {n:5, nome:'Notório',      ef:'NPCs fogem. A Liga manda oficiais "conversar".'},
  {n:6, nome:'Proscrito',    ef:'Banido de cidades. Recompensa por informações sobre você.'},
  {n:7, nome:'Caçado',       ef:'Ordem de detenção ativa. Treinadores da Liga autorizados a te capturar.'},
  {n:8, nome:'Monstro Lendário', ef:'Seu nome é terror. A Elite 4 é mobilizada contra você.'}
];

/* ============================================================
   REPUTAÇÃO — pontos, não degraus
   Consertar a calha da vizinha é uma coisa boa e não é notícia.
   Um nível só muda quando o que você fez foi grande o bastante
   para ser contado, ou aconteceu na frente de quem conta.
   ============================================================ */
const LIMIARES_REP = [0, 18, 55, 115, 210, 350, 560, 860];

/* Gente que, quando está na cena, faz a história correr sozinha.
   Fazer alguma coisa na frente de um deles vale o dobro. */
const TITULOS_INFLUENTES = [
  'líder','lider','conselheir','auditor','diretor','dr.','dra.','professor','professora',
  'curador','chefe','presidente','delegad','capitão','capitao','comissári','comissari',
  'secretári','secretari','juiz','juíza','juiza','prefeit','vereador','coronel','inspetor',
  'repórter','reporter','jornalista'
];
const NOMES_INFLUENTES = [
  'Brock','Misty','Tenente Surge','Erika','Koga','Sabrina','Blaine','Blue','Giovanni',
  'Lance','Giselle','A.J.','Mandi','Red','Hélia Rennó','Bruna Teles','Dra. Ivone',
  'Curador Adnan','Auditora Prado','Diretor Aloísio','Conselheira Vasques'
];
function ehInfluente(nome){
  if (!nome) return false;
  if (NOMES_INFLUENTES.includes(nome)) return true;
  const n = String(nome).toLowerCase();
  return TITULOS_INFLUENTES.some(t => n.startsWith(t) || n.includes(' ' + t));
}

const CIDADES = ['Pallet','Viridian','Pewter','Cerulean','Vermilion','Lavender','Celadon','Fuchsia','Saffron','Cinnabar','Indigo'];

const ITENS_INFO = {
  /* ─────────── bolas ─────────── */
  'Poké Ball':   {tipo:'bola', mult:1, cat:'Captura',
                  ficha:'Modificador de captura ×1,0 · consumida no arremesso',
                  desc:'A bola comum. É o que a Liga entrega e o que todo mundo usa.',
                  sabido:{bola_fraca_em_lendario:'Você já viu uma dessas ricochetear numa coisa grande demais. Não insista.'}},
  'Great Ball':  {tipo:'bola', mult:1.5, cat:'Captura',
                  ficha:'Modificador de captura ×1,5 · consumida no arremesso',
                  desc:'Mais firme que a comum. Custa o triplo e a diferença aparece.',
                  sabido:{bola_fraca_em_lendario:'Firme, mas não o bastante para o que você viu.'}},
  'Ultra Ball':  {tipo:'bola', mult:2, cat:'Captura',
                  ficha:'Modificador de captura ×2,0 · consumida no arremesso',
                  desc:'Cara. Quem vende fala dela em voz baixa, como se fosse favor.',
                  sabido:{ultra_prende_lendario:'É a única comprável que já prendeu uma coisa daquelas — e mesmo assim, quase nunca.'}},
  'Master Ball': {tipo:'bola', mult:255, cat:'Captura',
                  ficha:'Modificador de captura ×255 · consumida no arremesso',
                  desc:'Você não devia ter uma dessas. Quase ninguém devia.',
                  sabido:{master_quase_sempre:'Ela não falha. Você já viu.'}},

  /* ─────────── cura ─────────── */
  'Potion':      {tipo:'cura', valor:20, cat:'Recuperação',
                  ficha:'+20 HP em um Pokémon · em combate gasta o turno · não age em desmaiado',
                  desc:'Fecha corte e tira dor. Não faz milagre.'},
  'Super Potion':{tipo:'cura', valor:50, cat:'Recuperação',
                  ficha:'+50 HP em um Pokémon · em combate gasta o turno · não age em desmaiado',
                  desc:'A mesma coisa, mais forte e mais cara.'},
  'Hyper Potion':{tipo:'cura', valor:120, cat:'Recuperação',
                  ficha:'+120 HP em um Pokémon · em combate gasta o turno · não age em desmaiado',
                  desc:'Do tipo que hospital usa. Ninguém carrega por acaso.'},
  'Água Fresca': {tipo:'cura', valor:35, cat:'Recuperação',
                  ficha:'+35 HP em um Pokémon · em combate gasta o turno',
                  desc:'Garrafa de máquina. Funciona melhor que devia, e ninguém sabe explicar.'},
  'Revive':      {tipo:'revive', cat:'Recuperação',
                  ficha:'Levanta um Pokémon desmaiado com HP máximo ÷ 2 · não age em morto',
                  desc:'Traz de volta quem desmaiou, na metade das forças. Não faz mais que isso.',
                  sabido:{revive_nao_ressuscita:'Quem morreu de verdade não volta com isso. Você aprendeu do jeito ruim.'}},
  'Antidote':    {tipo:'status', cura:'veneno', cat:'Recuperação',
                  ficha:'Remove veneno · 1 alvo',
                  desc:'Frasco pequeno, gosto horrível, funciona.'},
  'Full Heal':   {tipo:'status', cura:'todos', cat:'Recuperação',
                  ficha:'Remove qualquer condição (veneno, queimadura, paralisia, sono, confusão) · 1 alvo',
                  desc:'Resolve o que o Antidote não resolve, e o resto junto.'},
  'Éter':        {tipo:'pp', valor:10, cat:'Recuperação',
                  ficha:'+10 PP no primeiro golpe incompleto do alvo',
                  desc:'Frasco pequeno. Repõe o que um golpe gastou.'},
  'Elixir':      {tipo:'ppTodos', valor:10, cat:'Recuperação',
                  ficha:'+10 PP em todos os golpes do alvo',
                  desc:'Repõe um pouco de tudo. Caro pelo que é.'},
  'Bandagem':    {tipo:'curaJogador', valor:10, cat:'Treinador',
                  ficha:'+10 HP no treinador · o HP do treinador não regenera sozinho',
                  desc:'Pra você, não pra eles. Você também se machuca.'},
  'Cantil':      {tipo:'curaJogador', valor:16, cat:'Treinador',
                  ficha:'+16 HP no treinador · uso único',
                  desc:'Cheio. Você vai esvaziar num lugar em que não tem onde encher.'},
  'Ração':       {tipo:'moral', valor:10, cat:'Vínculo',
                  ficha:'+10 de moral em um Pokémon (escala 0–100) · moral baixa causa desobediência',
                  desc:'Comida boa de verdade. Muda o humor de quem come.'},

  /* ─────────── campo ─────────── */
  'Boneco':      {tipo:'fuga', cat:'Campo',
                  ficha:'Fuga garantida de encontro selvagem · não funciona contra treinador',
                  desc:'Um boneco de pano com cara de Substitute. Serve pra jogar e sair andando.'},
  'Repelente':   {tipo:'repelente', valor:3, cat:'Campo',
                  ficha:'Nenhum encontro ao procurar por 3 períodos',
                  desc:'Cheiro forte, dura uns três períodos. O mato fica mais quieto em volta.'},

  /* ─────────── pedras ─────────── */
  'Moon Stone':      {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Nidorina, Nidorino, Clefairy e Jigglypuff · consumida no uso',
                      desc:'Morna ao toque, pesada demais para o tamanho, com superfície de vidro fosco.',
                      sabido:{viu_o_circulo:'Trinta e dois ficaram em círculo olhando uma dessas por quarenta minutos.',
                              usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra do Fogo':   {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Vulpix, Growlithe e Eevee (→ Flareon) · consumida no uso',
                      desc:'Alaranjada, com um ponto de luz no meio que não vem de lugar nenhum.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra da Água':   {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Poliwhirl, Shellder, Staryu e Eevee (→ Vaporeon) · consumida no uso',
                      desc:'Azul-escura. Fria mesmo depois de horas no bolso.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra do Trovão': {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Pikachu e Eevee (→ Jolteon) · consumida no uso',
                      desc:'Amarela, com estática. Ela levanta o pelo do seu braço de dez centímetros.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra da Folha':  {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Gloom, Weepinbell e Exeggcute · consumida no uso',
                      desc:'Verde e lascada como pedra de rio. Cheira a mato cortado.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},

  /* ─────────── segurados ─────────── */
  'Resto de Ração':  {tipo:'equipar', cat:'Segurado', efeito:{regen:0.07},
                      ficha:'SEGURADO · recupera 7% do HP máximo no fim de cada turno',
                      desc:'Um saquinho amarrado no cinto com o que sobra da ração boa. Some devagar.'},
  'Faixa Firme':     {tipo:'equipar', cat:'Segurado', efeito:{aguenta:true},
                      ficha:'SEGURADO · uma vez por combate, sobrevive a um golpe fatal com 1 HP',
                      desc:'Faixa de algodão grossa amarrada no punho ou na pata. Não protege de nada. Aperta.'},
  'Punho de Ferro':  {tipo:'equipar', cat:'Segurado', efeito:{fis:1.15},
                      ficha:'SEGURADO · +15% de dano em golpes físicos',
                      desc:'Um peso de chumbo costurado numa tira de couro. Pesa e cansa e funciona.'},
  'Óculos Grossos':  {tipo:'equipar', cat:'Segurado', efeito:{esp:1.15},
                      ficha:'SEGURADO · +15% de dano em golpes especiais',
                      desc:'Lente de vidro grosso numa armação torta. Foi de alguém.'},
  'Colete de Couro': {tipo:'equipar', cat:'Segurado', efeito:{defesa:0.88},
                      ficha:'SEGURADO · −12% de dano recebido',
                      desc:'Couro rachado, fivela de metal, remendo nas costas. Já levou pancada por outro.'},
  'Botina Leve':     {tipo:'equipar', cat:'Segurado', efeito:{vel:1.12},
                      ficha:'SEGURADO · +12% de Velocidade para a ordem dos turnos',
                      desc:'Sola fina, quase gasta. Quem usa isso não planeja apanhar.'},
  'Sino Calmante':   {tipo:'equipar', cat:'Segurado', efeito:{moral:3},
                      ficha:'SEGURADO · +3 de moral ao fim de cada combate',
                      desc:'Um sino de latão do tamanho de uma unha. O som é ridículo e acalma.'},
  'Amuleto de Moeda':{tipo:'equipar', cat:'Segurado', efeito:{dinheiro:1.5},
                      ficha:'SEGURADO · +50% de dinheiro em vitórias contra treinador',
                      desc:'Moeda antiga furada e pendurada num barbante. Não vale nada como moeda.'},

  /* ─────────── ferramenta ─────────── */
  'Corda':          {tipo:'ferramenta', cat:'Ferramenta', ficha:'12 m · usada em cenas de escalada, descida e resgate',
                     desc:'Doze metros. Serve pra mais coisa do que parece e pesa mais do que devia.'},
  'Lanterna':       {tipo:'ferramenta', cat:'Ferramenta', ficha:'Pilha média · usada em caverna, porão e área sem luz',
                     desc:'Pilha média. A luz amarela antes de acabar, e esse é o único aviso que você tem.'},
  'Pilha':          {tipo:'ferramenta', cat:'Ferramenta', ficha:'Par · repõe a carga da Lanterna',
                     desc:'Duas, embaladas. Você vai lembrar delas exatamente quando não tiver.'},
  'Máscara de pó':  {tipo:'ferramenta', cat:'Ferramenta', ficha:'Evita dano de poeira em pedreira e caverna seca',
                     desc:'De pedreira. Não é bonita e é a diferença entre tossir uma semana ou não.'},
  'Bota de borracha':{tipo:'ferramenta', cat:'Ferramenta', ficha:'Isola choque em área com cabo energizado',
                     desc:'Cano alto, solado grosso. Quem trabalha com cabo não pisa em chão molhado sem isso.'},
  'Cobertor térmico':{tipo:'ferramenta', cat:'Ferramenta', ficha:'Evita dano de frio em área congelada e acampamento noturno',
                     desc:'Dobra do tamanho de um livro. Prateado dos dois lados, e mais quente do que parece possível.'},
  'Câmera descartável':{tipo:'ferramenta', cat:'Ferramenta', ficha:'24 poses · registra prova em cenas de documentação · consumida no uso',
                     desc:'Vinte e quatro poses. Revelar custa mais que a câmera.'},
  'Caderno de campo':{tipo:'ferramenta', cat:'Ferramenta', ficha:'Permite copiar documento e anotar número de processo em cena',
                     desc:'Capa dura, elástico, papel que aguenta sereno. É o que gente séria usa.'},
  'Isca':           {tipo:'ferramenta', cat:'Ferramenta', ficha:'+20 pontos percentuais de chance ao pescar · consumida no uso',
                     desc:'Massa de farinha e coisa que cheira mal. Quem pesca sério faz a própria.'},
  'Mapa de Kanto':  {tipo:'ferramenta', cat:'Ferramenta', ficha:'Mostra o destino do próximo arco na bússola da tela de mundo',
                     desc:'Dobrado em dezesseis. As estradas estão certas e os tempos estão otimistas.'}
};

/* ─────────── bolsas: o que você carrega, e de que cor ───────────
   A cor lida no nome é a cor que a interface usa quando você abre. */
const BOLSAS_VENDIDAS = {
  'Mochila Preta':    'Lona grossa encerada, alça reforçada, sem marca nenhuma. Quem anda de noite prefere não devolver luz.',
  'Mochila Vermelha': 'Vermelha de sinalização, do tipo que se acha num barranco de longe. Feita pra quem trabalha em altura.',
  'Mochila Azul':     'Azul de uniforme, costura dupla no fundo. Sobra de um lote encomendado por uma escola que fechou.',
  'Mochila Verde':    'Verde de mato, com bolso lateral pra cantil. Cheira a barraca guardada úmida e ninguém consegue tirar.',
  'Mochila Amarela':  'Amarela de estrada, com faixa refletiva na aba. Quem acampa perto de rodovia compra essa e nenhuma outra.',
  'Mochila Marrom':   'Couro curtido, fivela de latão, e pesa vazia. Dura trinta anos e os trinta aparecem nela.',
  'Mochila Laranja':  'Laranja de resgate, costurada pra abrir com uma mão só. Veio de um lote de brigada de incêndio.',
  'Bolsa Roxa':       'Roxa escura, de tecido acetinado que marca o dedo. Vendida como bolsa de cidade e usada como mochila mesmo assim.',
  'Bolsa Branca':     'Branca de algodão cru, que suja no primeiro dia e não desbota nunca mais.',
  'Bolsa Cinza':      'Cinza chumbo, discreta, com forro removível. É a que some mais rápido da prateleira.',
  'Bolsa Rosa':       'Rosa desbotada de sol de vitrine. Está mais barata por isso e a costura é a melhor do balcão.',
  'Bolsa Prateada':   'Tecido metalizado sobre espuma fina. Reflete calor e faz um barulho seco quando você mexe.',
  'Bolsa Dourada':    'Dourada de festa, com ferragem pesada. Ninguém que trabalha usa isso, e ela aguenta mais que parece.'
};
for (const [nome, desc] of Object.entries(BOLSAS_VENDIDAS)){
  ITENS_INFO[nome] = {
    tipo:'bolsa', cat:'Vestuário',
    ficha:'Vestuário · passa a ser a bolsa que você carrega · não ocupa espaço de item',
    desc: desc
  };
}

/* Pedra → pares de evolução (só espécies de nivelEvo 0) */
const PEDRAS = {
  'Pedra do Fogo':   {37:38, 58:59, 133:136},
  'Pedra da Água':   {61:62, 90:91, 120:121, 133:134},
  'Pedra do Trovão': {25:26, 133:135},
  'Pedra da Folha':  {44:45, 70:71, 102:103},
  'Moon Stone':      {30:31, 33:34, 35:36, 39:40}
};

/* Evoluções que só acontecem numa troca */
const EVO_TROCA = {64:65, 67:68, 75:76, 93:94};

/* O que o jogador já aprendeu na prática ou porque alguém contou */
function fichaItem(nome){
  const i = ITENS_INFO[nome];
  return i && i.ficha ? i.ficha : '';
}
function categoriaItem(nome){
  const i = ITENS_INFO[nome];
  return i && i.cat ? i.cat : 'Outro';
}
function efeitoSegurado(p){
  if (!p || !p.segurando) return null;
  const i = ITENS_INFO[p.segurando];
  return (i && i.tipo === 'equipar') ? (i.efeito || {}) : null;
}

function descricaoItem(nome){
  const i = ITENS_INFO[nome];
  if (!i) return '';
  let d = i.desc;
  for (const [flag, extra] of Object.entries(i.sabido || {})){
    if (Estado.dados && Estado.dados.flags && Estado.dados.flags[flag]) d += ' ' + extra;
  }
  return d;
}


/* ============================================================
   COR DA MOCHILA
   A bolsa padrão é bege, igual à de fábrica da Liga. Se o jogador
   estiver carregando uma bolsa com cor no nome — "Mochila Preta",
   "Bolsa Roxa" —, a cor lida ali é a cor que a interface usa.
   ============================================================ */
const COR_MOCHILA_PADRAO = '#c8ab74';
const CORES_MOCHILA = {
  bege:'#c8ab74', creme:'#e0d3b4', caqui:'#9d9268', areia:'#d2bd90',
  preta:'#26262d', preto:'#26262d',
  branca:'#e9e5db', branco:'#e9e5db',
  vermelha:'#bf3a2f', vermelho:'#bf3a2f',
  azul:'#2f6fb5', 'azul marinho':'#22406e', 'azul clara':'#7fb0e0', 'azul claro':'#7fb0e0',
  verde:'#3d8b56', 'verde musgo':'#5d6b3a', 'verde escura':'#255c3a', 'verde escuro':'#255c3a',
  amarela:'#d9b53a', amarelo:'#d9b53a',
  roxa:'#7a4fa3', roxo:'#7a4fa3',
  rosa:'#d1688f',
  laranja:'#d2762b',
  cinza:'#878d96',
  marrom:'#6e4b2f', castanha:'#6e4b2f', castanho:'#6e4b2f',
  dourada:'#c39b28', dourado:'#c39b28',
  prateada:'#b4bac3', prateado:'#b4bac3',
  vinho:'#6d2233',
  turquesa:'#2ea39a',
  bordo:'#5c1f27'
};

function _semAcento(s){
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
/* "Mochila Preta" -> '#26262d'. Nome que não é bolsa -> null. */
function corDaMochila(nome){
  const m = _semAcento(nome).match(/^(?:mochila|bolsa|sacola|mala|bornal|cartucheira)\s+(.+)$/);
  if (!m) return null;
  const resto = m[1].replace(/\s+/g, ' ').trim();
  if (CORES_MOCHILA[resto]) return CORES_MOCHILA[resto];
  const primeira = resto.split(' ')[0];
  return CORES_MOCHILA[primeira] || null;
}
/* A bolsa que o jogador está carregando agora — a última que ele arranjou. */
function mochilaAtual(){
  const d = Estado.dados;
  let cor = COR_MOCHILA_PADRAO, nome = 'Mochila da Liga';
  const saida = () => ({cor, nome, rotulo: nome.split(' ')[0]});
  if (!d || !d.itens) return saida();
  const escolhida = d.jogador && d.jogador.bolsa;
  if (escolhida && d.itens[escolhida] > 0){
    const c = corDaMochila(escolhida);
    if (c){ cor = c; nome = escolhida; return saida(); }
  }
  for (const [n, q] of Object.entries(d.itens)){
    if (q <= 0) continue;
    const c = corDaMochila(n);
    if (c){ cor = c; nome = n; }
  }
  return saida();
}

/* --- mistura de cor, para tirar as sombras e o forro da cor lida --- */
function _rgb(hex){
  const h = hex.replace('#','');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function _hex(r,g,b){
  return '#' + [r,g,b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2,'0')).join('');
}
function misturaCor(hex, alvo, p){
  const a = _rgb(hex), b = _rgb(alvo);
  return _hex(a[0]+(b[0]-a[0])*p, a[1]+(b[1]-a[1])*p, a[2]+(b[2]-a[2])*p);
}
function luminancia(hex){
  const [r,g,b] = _rgb(hex);
  return (0.2126*r + 0.7152*g + 0.0722*b) / 255;
}
/* Todas as variáveis de estilo que uma cor de bolsa gera.
   O forro é sempre mais escuro que o lado de fora — dentro de bolsa
   é sombra —, então o texto de dentro é sempre claro. */
function paletaMochila(cor){
  const clara  = luminancia(cor) > .5;
  const escuro = misturaCor(cor, '#000000', clara ? .58 : .44);
  const forro  = misturaCor(cor, '#191a1e', .64);
  const txt    = '#f4f1ea';
  const realce = clara ? misturaCor(cor, '#000000', .66) : misturaCor(cor, '#ffffff', .58);
  return {
    '--moch':        cor,
    '--moch-esc':    escuro,
    '--moch-claro':  misturaCor(cor, '#ffffff', .24),
    '--moch-forro':  forro,
    '--moch-forro-2':misturaCor(forro, '#ffffff', .08),
    '--moch-linha':  misturaCor(forro, '#ffffff', .24),
    '--moch-txt':    txt,
    '--moch-txt-2':  misturaCor(txt, forro, .34),
    '--moch-txt-3':  misturaCor(txt, forro, .52),
    '--moch-realce': realce,
    '--moch-titulo': luminancia(misturaCor(cor, '#ffffff', .24)) > .52
                       ? misturaCor(cor, '#000000', .74) : '#f6f3ec',
    '--moch-btn-txt':luminancia(escuro) > .5 ? '#1b1c20' : '#f4f1ea'
  };
}

const Estado = {
  dados: null,

  novo(ficha){
    const resistencia = 1;
    this.dados = {
      versao: 1,
      criadoEm: Date.now(),
      jogador: {
        nome: ficha.nome,
        genero: ficha.genero,
        aparencia: ficha.aparencia,
        personalidade: ficha.personalidade,
        vestimenta: ficha.vestimenta,
        cidade: ficha.cidade,
        objetivo: ficha.objetivo,
        idade: 15,
        hp: 30, hpMax: 30,
        status: {forca:1, percepcao:1, intelecto:1, carisma:1, sorte:1, resistencia:1},
        pontos: 0,
        dinheiro: 3000,
        cargo: null,
        ferimentos: []
      },
      reputacao: {eixo:'bom', bom:1, ruim:1, pontosBom:0, pontosRuim:0, historico:[]},
      time: [],
      pc: [],                 // Pokémon depositados
      cemiterio: [],          // mortes permanentes — nunca some
      itens: {},              // a mochila começa vazia: tudo se recebe ou se compra
      insignias: [],
      capitulo: 0,
      cena: null,
      modo: 'cena',
      local: 'pallet',
      visitados: {},
      descobertas: {},
      pokedex: {vistos:{}, catalogados:{}, brilhantes:{}},
      flags: {},
      npcs: {},               // memória: {nome:{conhece:true, opiniao:n, viuVoce:'...'}}
      rivais: {},             // rivais conquistados pelo caminho: {id:{vitorias,derrotas,...}}
      lendarios: {},          // {dex:{estado:'livre|capturado|solto|morto', disposicao:'neutro|hostil|passivo|desconfiado', encontros:n}}
      liga: {avisos:0, ordemDevolucao:false, detencao:false},
      mundo: {clima:'normal', instabilidade:0, eventos:[]},
      config: {danoMult:1, ritmo:'fiel'},   // 'fiel' = 1d10×(poder÷10) puro
      via: 'neutro',          // heroi | mercenario | foragido | pesquisador
      viaAnterior: null,
      finaisVistos: [],
      log: [],
      relogio: {dia:1, periodo:'manhã'}
    };
    return this.dados;
  },

  get j(){ return this.dados.jogador; },
  get rep(){ return this.normalizarRep ? this.normalizarRep() : this.dados.reputacao; },

  /* ---------- REPUTAÇÃO ---------- */
  /* Saves antigos guardavam só o degrau. Converte para pontos. */
  normalizarRep(){
    const r = this.dados.reputacao;          /* direto: o getter passa por aqui */
    if (!r) return r;
    if (r.pontosBom === undefined || r.pontosRuim === undefined){
      r.pontosBom  = LIMIARES_REP[Math.max(0, (r.bom  || 1) - 1)] || 0;
      r.pontosRuim = LIMIARES_REP[Math.max(0, (r.ruim || 1) - 1)] || 0;
      if (r.eixo === 'ruim') r.pontosBom = 0; else r.pontosRuim = 0;
    }
    return r;
  },
  nivelDePontos(p){
    let n = 1;
    for (let i = 0; i < LIMIARES_REP.length; i++) if (p >= LIMIARES_REP[i]) n = i + 1;
    return Math.max(1, Math.min(8, n));
  },
  recalcularRep(){
    const r = this.rep;
    r.bom  = this.nivelDePontos(r.pontosBom);
    r.ruim = this.nivelDePontos(r.pontosRuim);
    r.eixo = r.pontosRuim > r.pontosBom ? 'ruim' : 'bom';
  },
  nivelRep(){
    const r = this.normalizarRep();
    return r.eixo === 'bom' ? NIVEIS_BOM[r.bom-1] : NIVEIS_RUIM[r.ruim-1];
  },
  nomeRep(){ return this.nivelRep().nome; },

  /* Quanto um ato vale de fato. O delta que a cena declara é o
     tamanho do ato; quem estava olhando é o resto da conta. */
  pesoRep(delta, ef){
    const d = Math.max(1, Math.abs(delta));
    let pontos = d * (d + 1) / 2;                    /* 1, 3, 6, 10, 15… ato pequeno quase não move */
    const c = ef || {};
    if (c.rep && c.rep.notorio) pontos *= 1.5;       /* a cena diz que virou notícia */
    if (c.npc && ehInfluente(c.npc.nome)) pontos *= 2;
    if (c.insignia) pontos *= 1.5;                   /* ginásio cheio de gente vendo */
    if (c.rep && c.rep.peso) pontos *= c.rep.peso;   /* ajuste manual da cena */
    return Math.max(1, Math.round(pontos));
  },

  /* Progresso dentro do degrau atual — para a barra do cartão */
  progressoRep(){
    const r = this.normalizarRep();
    const p = r.eixo === 'bom' ? r.pontosBom : r.pontosRuim;
    const n = r.eixo === 'bom' ? r.bom : r.ruim;
    if (n >= 8) return {pontos:p, atual:1, falta:0, prox:null};
    const piso = LIMIARES_REP[n-1], teto = LIMIARES_REP[n];
    return {pontos:p, atual:(p - piso) / Math.max(1, teto - piso), falta:teto - p, prox:n+1};
  },

  mudarRep(eixo, delta, motivo, ef){
    const r = this.normalizarRep();
    if (!delta) return null;
    const antes = this.nomeRep();
    const pontos = this.pesoRep(delta, ef);

    /* O eixo contrário é pago primeiro: você não vira santo enquanto
       ainda deve. Só o que sobra é que começa a subir do outro lado. */
    if (eixo === 'bom'){
      const gasto = Math.min(r.pontosRuim, pontos);
      r.pontosRuim -= gasto;
      r.pontosBom  += (pontos - gasto);
    } else {
      const gasto = Math.min(r.pontosBom, pontos);
      r.pontosBom  -= gasto;
      r.pontosRuim += (pontos - gasto);
    }
    this.recalcularRep();

    const depois = this.nomeRep();
    r.historico.push({motivo, eixo, delta, pontos, de:antes, para:depois, cap:this.dados.capitulo});
    if (antes !== depois) this.registrar(`Reputação: ${antes} → ${depois} (${motivo})`);
    return {de:antes, para:depois, mudou:antes !== depois, pontos};
  },

  /* ---------- MEMÓRIA ---------- */
  registrar(texto){
    this.dados.log.push({cap:this.dados.capitulo, texto, dia:this.dados.relogio.dia});
    if (this.dados.log.length > 400) this.dados.log.shift();
  },
  marcar(flag, valor=true){ this.dados.flags[flag] = valor; },
  tem(flag){ return !!this.dados.flags[flag]; },

  lembrarNPC(nome, dados){
    const n = this.dados.npcs[nome] || {nome, opiniao:0, memorias:[]};
    Object.assign(n, dados);
    if (dados.memoria){ n.memorias.push({cap:this.dados.capitulo, texto:dados.memoria}); delete n.memoria; }
    this.dados.npcs[nome] = n;
    return n;
  },
  npc(nome){ return this.dados.npcs[nome] || null; },

  /* ---------- TIME ---------- */
  adicionar(p){
    if (this.dados.time.length < 6){ this.dados.time.push(p); return 'time'; }
    this.dados.pc.push(p); return 'pc';
  },
  removerDoTime(uid){
    const i = this.dados.time.findIndex(p => p.uid === uid);
    if (i >= 0) return this.dados.time.splice(i,1)[0];
    return null;
  },
  matar(p, causa){
    p.morto = true;
    p.hp = 0;
    p.causaMorte = causa;
    p.morreuNoCap = this.dados.capitulo;
    this.removerDoTime(p.uid);
    this.dados.cemiterio.push(p);
    this.registrar(`${nomeExib(p)} morreu. Causa: ${causa}`);
  },
  timeVivo(){ return this.dados.time.filter(p => estaVivo(p)); },
  primeiroApto(){ return this.dados.time.find(p => estaVivo(p)) || null; },

  /* ---------- ITENS ---------- */
  darItem(nome, qtd=1){
    this.dados.itens[nome] = (this.dados.itens[nome]||0) + qtd;
    /* bolsa nova passa a ser a bolsa usada */
    if (corDaMochila(nome)) this.dados.jogador.bolsa = nome;
  },
  usarItem(nome){
    if (!this.dados.itens[nome]) return false;
    this.dados.itens[nome]--;
    if (this.dados.itens[nome] <= 0) delete this.dados.itens[nome];
    return true;
  },
  contaItem(nome){ return this.dados.itens[nome] || 0; },

  /* ---------- ITEM SEGURADO ---------- */
  equipar(uid, nome){
    const p = this.dados.time.find(x => x.uid === uid);
    if (!p || !this.contaItem(nome)) return null;
    const info = ITENS_INFO[nome];
    if (!info || info.tipo !== 'equipar') return null;
    if (p.segurando) this.darItem(p.segurando, 1);   // devolve o anterior à mochila
    this.usarItem(nome);
    p.segurando = nome;
    p.faixaUsada = false;
    this.registrar(`${nomeExib(p)} passou a segurar ${nome}.`);
    return p;
  },
  desequipar(uid){
    const p = this.dados.time.find(x => x.uid === uid);
    if (!p || !p.segurando) return null;
    const nome = p.segurando;
    this.darItem(nome, 1);
    p.segurando = null;
    p.faixaUsada = false;
    this.registrar(`${nomeExib(p)} devolveu ${nome} à mochila.`);
    return p;
  },

  /* ---------- NATUREZA: só se sabe com convivência ---------- */
  revelarNatureza(p, motivo){
    if (!p || p.naturezaVista) return false;
    p.naturezaVista = true;
    this.registrar(`Você entendeu o jeito de ${nomeExib(p)}: ${p.natureza}.${motivo ? ' ('+motivo+')' : ''}`);
    return true;
  },
  /* chamada no fim de cada combate: convivência + Percepção */
  tickNatureza(){
    const avisos = [];
    (this.dados.time || []).forEach(p => {
      if (p.naturezaVista || p.morto) return;
      p.convivencia = (p.convivencia || 0) + 1;
      if (p.convivencia < 3) return;
      const t = Dados.teste(this.j.status.percepcao + Math.floor(p.convivencia / 3), 7, 'Percepção');
      if (t.grau === 'sucesso' || t.grau === 'critico'){
        p.naturezaVista = true;
        this.registrar(`Natureza de ${nomeExib(p)} percebida: ${p.natureza}.`);
        avisos.push({tipo:'natureza', texto:`Você finalmente entende o jeito de ${nomeExib(p)}. É ${p.natureza}: ${(NATUREZAS[p.natureza]||{}).traco || 'difícil de descrever.'}`});
      }
    });
    return avisos;
  },

  /* ---------- JOGADOR ---------- */
  hpMaxJogador(){ return 30 + (this.j.status.resistencia - 1) * 2; },
  ferir(qtd, causa){
    this.j.hp = Math.max(0, this.j.hp - qtd);
    if (causa) this.j.ferimentos.push({causa, qtd, cap:this.dados.capitulo});
    this.registrar(`Você sofreu ${qtd} de dano (${causa||'?'}). HP: ${this.j.hp}/${this.hpMaxJogador()}`);
    return this.j.hp <= 0;
  },
  curarJogador(qtd){
    this.j.hp = Math.min(this.hpMaxJogador(), this.j.hp + qtd);
  },
  subirStatus(chave){
    const st = this.j.status;
    if (st[chave] >= 10) return false;
    st[chave]++;
    if (chave === 'resistencia') this.j.hp += 2;
    return true;
  },

  /* ---------- POKÉDEX ---------- */
  pdex(){
    const d = this.dados;
    if (!d.pokedex) d.pokedex = {vistos:{}, catalogados:{}, brilhantes:{}};
    if (!d.pokedex.brilhantes) d.pokedex.brilhantes = {};   /* saves antigos */
    return d.pokedex;
  },
  viu(dex){
    if (!this.dados.flags.tem_pokedex) return false;
    const p = this.pdex();
    if (p.vistos[dex]) return false;
    p.vistos[dex] = true;
    return true;
  },
  catalogou(dex){
    if (!this.dados.flags.tem_pokedex) return false;
    const p = this.pdex();
    p.vistos[dex] = true;
    if (p.catalogados[dex]) return false;
    p.catalogados[dex] = true;
    this.registrar(`Pokédex: ${DEX[dex].nome} catalogado.`);
    return true;
  },
  conheceu(dex){ return !!this.pdex().catalogados[dex]; },

  /* Um brilhante visto fica registrado mesmo que escape. */
  viuBrilhante(dex){
    const p = this.pdex();
    if (p.brilhantes[dex] === 'capturado') return false;
    const novo = !p.brilhantes[dex];
    if (novo){ p.brilhantes[dex] = 'visto'; this.registrar(`Pokédex: um ${DEX[dex].nome} brilhante.`); }
    return novo;
  },
  pegouBrilhante(dex){
    const p = this.pdex();
    const novo = p.brilhantes[dex] !== 'capturado';
    p.brilhantes[dex] = 'capturado';
    if (novo) this.registrar(`Pokédex: ${DEX[dex].nome} brilhante registrado no time.`);
    return novo;
  },
  brilhanteDe(dex){ return this.pdex().brilhantes[dex] || null; },

  contagemDex(){
    const p = this.pdex();
    const b = Object.values(p.brilhantes || {});
    return {vistos:Object.keys(p.vistos).length, catalogados:Object.keys(p.catalogados).length,
            brilhantes:b.length, brilhantesPegos:b.filter(v => v === 'capturado').length};
  },

  /* ---------- LENDÁRIOS ---------- */
  lend(dex){
    if (!this.dados.lendarios[dex]){
      this.dados.lendarios[dex] = {dex, estado:'livre', disposicao:'neutro', encontros:0, ataquesSofridos:0};
    }
    return this.dados.lendarios[dex];
  },
  lendariosCapturados(){
    return Object.values(this.dados.lendarios).filter(l => l.estado === 'capturado');
  },

  /* Manter lendário preso pesa com o tempo. Chamado ao fim de cada capítulo. */
  tickLendarios(){
    const avisos = [];
    const presos = this.lendariosCapturados();
    for (const L of presos){
      L.turnosPreso = (L.turnosPreso || 0) + 1;
      // segredo tem prazo de validade
      if (this.tem('lendario_oculto_' + L.dex) && L.turnosPreso >= 2){
        this.marcar('lendario_oculto_' + L.dex, false);
        this.marcar('captura_vista_' + L.dex);
        avisos.push(`Alguém falou. A captura de ${DEX[L.dex].nome} deixou de ser segredo.`);
        this.mudarRep('ruim', 2, `Descobriram ${DEX[L.dex].nome} com você`);
        this.dados.liga.avisos++;
      } else if (L.turnosPreso % 2 === 0){
        avisos.push(`${DEX[L.dex].nome} continua na sua bola. O mundo continua pagando por isso.`);
        this.mudarRep('ruim', 1, `Mantém ${DEX[L.dex].nome} em cativeiro`);
        this.dados.mundo.instabilidade++;
      }
      // o próprio lendário tenta fugir
      const p = [...this.dados.time, ...this.dados.pc].find(x => x.dex === L.dex);
      if (p && p.moral < 30 && Dados.chance(15)){
        avisos.push(`${DEX[L.dex].nome} rompeu a bola durante a noite e sumiu. Não deixou nada.`);
        this.removerDoTime(p.uid);
        const i = this.dados.pc.findIndex(x => x.uid === p.uid);
        if (i >= 0) this.dados.pc.splice(i,1);
        L.estado = 'livre';
        L.disposicao = 'hostil';
      }
    }
    return avisos;
  },

  /* ---------- SAVE / LOAD ---------- */
  salvar(slot='auto'){
    try {
      localStorage.setItem('pokerpg_save_' + slot, JSON.stringify(this.dados));
      return true;
    } catch(e){ return false; }
  },
  carregar(slot='auto'){
    try {
      const raw = localStorage.getItem('pokerpg_save_' + slot);
      if (!raw) return false;
      this.dados = JSON.parse(raw);
      return true;
    } catch(e){ return false; }
  },
  existeSave(slot='auto'){
    try { return !!localStorage.getItem('pokerpg_save_' + slot); } catch(e){ return false; }
  },
  apagarSave(slot='auto'){
    try { localStorage.removeItem('pokerpg_save_' + slot); } catch(e){}
  },

  /* ---------- CÓDICE DE FINAIS (sobrevive entre partidas) ---------- */
  registrarFinal(id, titulo){
    try {
      const raw = localStorage.getItem('pokerpg_finais');
      const lista = raw ? JSON.parse(raw) : [];
      if (!lista.find(f => f.id === id)){
        lista.push({id, titulo, quando: Date.now()});
        localStorage.setItem('pokerpg_finais', JSON.stringify(lista));
      }
      return lista;
    } catch(e){ return []; }
  },
  finaisDescobertos(){
    try { const raw = localStorage.getItem('pokerpg_finais'); return raw ? JSON.parse(raw) : []; }
    catch(e){ return []; }
  }
};
