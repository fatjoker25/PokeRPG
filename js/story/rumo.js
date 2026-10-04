/* ============================================================
   RUMO — o que você quer, do que você gosta e como Kanto te vê
   A ficha pede um objetivo, o que você gosta e o que não gosta. O
   jogo lê isso do mesmo jeito que lê a cor da mochila na vestimenta:
   procurando palavra. O que ele achar fica guardado na ficha
   (j.meta, j.gostos, j.desgostos) e pesa na história:
   - cada capítulo abre com uma linha que sai da sua via e do seu
     objetivo (e muda quando a via muda no meio do caminho);
   - lugar de que você gosta dá +1 nos testes de d10 lá dentro; lugar
     de que você não gosta, −1;
   - Pokémon de tipo ou espécie de que você gosta chega com +10 de
     moral; o de que você não gosta, −10.
   ============================================================ */

const METAS = [
  {id:'campeao',  nome:'ser {campeão|campeã}',          palavras:['campe', 'liga', 'insignia', 'mais forte', 'vencer', 'ganhar', 'elite', 'melhor treinador', 'mestre', 'maior']},
  {id:'pokedex',  nome:'completar a Pokédex',           palavras:['pokedex', 'catalog', 'todos os pokemon', 'pesquis', 'professor', 'estudar', 'ciencia', 'descobrir especie']},
  {id:'heroi',    nome:'proteger quem precisa',         palavras:['ajudar', 'proteger', 'salvar', 'justica', 'policia', 'defender', 'cuidar das pessoas', 'equipe rocket', 'acabar com']},
  {id:'poder',    nome:'ter poder e dinheiro',          palavras:['dinheiro', 'rico', 'poder', 'mandar', 'dominar', 'fama', 'famos']},
  {id:'vinculo',  nome:'crescer junto com o seu time',  palavras:['amigo', 'parceir', 'juntos', 'vinculo', 'criador', 'cuidar dos pokemon', 'companh', 'familia pokemon']},
  {id:'explorar', nome:'conhecer Kanto inteira',        palavras:['conhecer', 'viajar', 'explorar', 'mundo', 'aventura', 'lugares', 'kanto inteira']},
  {id:'casa',     nome:'voltar pra casa com orgulho',   palavras:['casa', 'mae', 'pai', 'avo', 'familia', 'orgulho', 'voltar']}
];

/* palavra → etiqueta de gosto. Lugar (ambiente do capítulo/mapa),
   coisa (aparece no texto) e tipo de Pokémon. */
const GOSTOS_LUGAR = {
  agua:['mar', 'praia', 'pescar', 'pesca', 'nadar', 'agua', 'barco', 'lago', 'rio', 'chuva'],
  caverna:['caverna', 'escuro', 'subterr', 'mina', 'pedra', 'rocha'],
  montanha:['montanha', 'altura', 'escalar', 'alto', 'trilha'],
  floresta:['floresta', 'mato', 'arvore', 'natureza', 'acampar', 'bosque', 'verde'],
  cidade:['cidade', 'multidao', 'gente', 'loja', 'comprar', 'movimento', 'barulho'],
  cemiterio:['fantasma', 'cemiterio', 'torre', 'assombr', 'misterio'],
  vulcao:['calor', 'vulcao', 'sol', 'quente'],
  campo:['campo', 'grama', 'correr', 'ar livre', 'vento', 'bicicleta']
};
const TIPOS_GOSTO = {
  'Água':['agua'], 'Fogo':['fogo'], 'Planta':['planta', 'grama', 'flor'], 'Inseto':['inseto'],
  'Fantasma':['fantasma'], 'Pedra':['pedra', 'rocha'], 'Voador':['voador', 'passaro', 'voar'],
  'Elétrico':['eletric', 'raio', 'trovao'], 'Psíquico':['psiquic', 'mente'], 'Dragão':['dragao'],
  'Gelo':['gelo', 'neve', 'frio'], 'Lutador':['luta', 'lutador', 'briga'], 'Venenoso':['veneno'],
  'Terrestre':['terra', 'areia', 'terrestre'], 'Normal':['normal']
};

function _norm(s){ return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

function lerObjetivo(texto){
  const t = _norm(texto);
  let melhor = null, pontos = 0;
  for (const m of METAS){
    const n = m.palavras.filter(p => t.includes(p)).length;
    if (n > pontos){ melhor = m.id; pontos = n; }
  }
  return melhor || 'explorar';
}

function lerGostos(texto){
  const t = _norm(texto);
  const out = {lugares:[], tipos:[], dex:[], texto:String(texto || '').trim()};
  if (!t) return out;
  for (const [lugar, ps] of Object.entries(GOSTOS_LUGAR)) if (ps.some(p => t.includes(p))) out.lugares.push(lugar);
  for (const [tipo, ps] of Object.entries(TIPOS_GOSTO)) if (ps.some(p => t.includes(p))) out.tipos.push(tipo);
  if (typeof DEX !== 'undefined')
    for (const k in DEX){ const n = _norm(DEX[k].nome); if (n.length > 3 && new RegExp('\\b' + n + '\\b').test(t)) out.dex.push(+k); }
  return out;
}

/* o que a ficha disse, lido uma vez e guardado */
function rumoDe(d){
  d = d || Estado.dados;
  const j = d && d.jogador;
  if (!j) return {meta:'explorar', gostos:lerGostos(''), desgostos:lerGostos('')};
  if (!j.meta) j.meta = lerObjetivo(j.objetivo);
  if (!j.gostos) j.gostos = lerGostos(j.gosta || '');
  if (!j.desgostos) j.desgostos = lerGostos(j.naoGosta || '');
  return {meta:j.meta, gostos:j.gostos, desgostos:j.desgostos};
}

/* ±1 no d10 quando o lugar é de gosto ou de desgosto */
function bonusDeGosto(){
  try {
    const d = Estado.dados; if (!d || !d.jogador) return 0;
    const r = rumoDe(d);
    const amb = (d.modo === 'cena' && typeof Historia !== 'undefined' && Historia.capAtual) ? Historia.capAtual.ambiente
              : (typeof Mundo !== 'undefined' ? Mundo.atual().ambiente : null);
    const grupo = {ruina:'cidade', agua:'agua'}[amb] || amb;
    if (r.gostos.lugares.includes(grupo)) return 1;
    if (r.desgostos.lugares.includes(grupo)) return -1;
  } catch(e){}
  return 0;
}

/* moral de quem chega: +10 se é do que você gosta, −10 se é do que não gosta */
function moralDeGosto(p){
  const r = rumoDe();
  const casa = l => l.dex.includes(p.dex) || (p.tipos || []).some(t => l.tipos.includes(t));
  if (casa(r.gostos)) return 10;
  if (casa(r.desgostos)) return -10;
  return 0;
}

/* A linha que abre cada capítulo: a sua via e o seu objetivo, no lugar
   em que você está. Muda quando a via muda. */
const LINHAS_DA_VIA = {
  heroi:[
    'Na entrada, alguém aponta você pra outra pessoa e as duas acenam. É o tipo de reconhecimento que não se compra.',
    'Uma criança pergunta se você é {aquele|aquela} que ajudou. Você diz que foi um pouco de sorte. Ela não acredita.',
    'Tem gente que confia em você antes de você abrir a boca. Isso abre porta e pesa no ombro.'
  ],
  mercenario:[
    'Dois sujeitos encostados no muro medem o seu cinto antes de medir a sua cara. Notícia de quem resolve com dinheiro anda rápido.',
    'Alguém já sabe o seu preço antes de você dizer. Você não lembra de ter dito.',
    'Te oferecem um serviço antes do bom-dia. É o que a sua fama compra.'
  ],
  foragido:[
    'Tem uma descrição parecida com a sua num papel colado no poste. Parecida o bastante.',
    'Você escolhe a rua de trás sem pensar. Já virou hábito.',
    'Quem te reconhece abaixa os olhos. Quem não te reconhece ainda vai.'
  ],
  pesquisador:[
    'Você anota a hora e o lugar antes de qualquer outra coisa. O caderno já tem mais página escrita do que em branco.',
    'Alguém da cidade pergunta se você é "{o|a} da Pokédex". Você é.',
    'Primeiro você olha o que vive aqui. Depois o resto.'
  ],
  /* as linhas de posto (js/story/linhas.js) */
  lei:[
    'Você repara primeiro na guarita, depois em quem está de pé na esquina sem motivo. O colete ensina a olhar nessa ordem.',
    'Um guarda da cidade te cumprimenta com dois dedos na aba do boné. Entre gente de patrulha é assim.',
    'Alguém pergunta onde fica a delegacia. Você sabe, e sabe também qual porta fica aberta de noite.'
  ],
  rocket:[
    'O aparelho do envelope está no bolso de dentro. Pesa mais do que o tamanho dele.',
    'Você conta as pessoas no Centro sem querer. Virou costume, e o costume tem dono.',
    'Na parede da estação tem uma letra R pichada pequena, perto do chão. Você não tinha reparado nessas antes.'
  ],
  ciencia:[
    'Você anota a hora e o lugar antes de qualquer outra coisa. O caderno já tem mais página escrita do que em branco.',
    'Alguém da cidade pergunta se você é "{o|a} da Pokédex". Você é.',
    'Primeiro você olha o que vive aqui. Depois o resto.'
  ],
  imprensa:[
    'Você lê a placa da entrada inteira, inclusive a parte pequena. Jornal ensina isso.',
    'Tem uma banca de jornal na praça, e o Jornal de Fuchsia está pendurado de cabeça pra baixo. Você endireita.',
    'Alguém conta uma história na fila do Centro e você já está pensando no título.'
  ],
  criacao:[
    'Você olha primeiro o pelo, a pata e o olho de cada Pokémon da rua. Depois a cara do dono.',
    'Tem um cercado na saída da cidade, e você já sabe, de longe, que a água está velha.',
    'Uma criança te mostra o Pokémon dela, e você se agacha antes de olhar. É assim que se olha.'
  ],
  liga:[
    'Duas crianças te reconhecem do agasalho da Liga e param de brincar pra ver você passar.',
    'Você confere sem querer o que cada treinador da rua leva na pata do Pokémon.',
    'A Liga tem cartaz em toda cidade. Você conhece quem fez a foto.'
  ],
  neutro:[
    'Mais uma cidade, mais uma estrada. Ninguém sabe ainda o que esperar de você.',
    'Você ainda é só mais {um treinador|uma treinadora} de passagem. Isso tem as suas vantagens.'
  ]
};
const LINHAS_DA_META = {
  campeao:d => `${d.insignias.filter(i => i !== 'Título de Campeão').length} insígnias no cinto. A Liga não sai da sua cabeça.`,
  pokedex:d => `${Estado.contagemDex().catalogados} espécies catalogadas. Cada lugar novo é uma página em branco.`,
  heroi:d => 'Você repara em quem está precisando antes de reparar no caminho.',
  poder:d => `${fmtDin(d.jogador.dinheiro)} ₽ no bolso. Não é o bastante ainda.`,
  vinculo:d => { const p = (d.time || [])[0]; return p ? `${nomeExib(p)} vai do seu lado, e é por isso que você está aqui.` : 'O time é o motivo.'; },
  explorar:d => `${Object.keys(d.visitados || {}).length} lugares pisados. Falta muito, e é isso que é bom.`,
  casa:d => `${nomeCasa()} está esperando notícia. Você já sabe o que vai contar.`
};
function avisosDeRumo(){
  const d = Estado.dados;
  if (!d || d.capitulo < 2) return [];
  const r = rumoDe(d);
  const via = d.via || 'neutro';
  /* a linha manda (posto de maior peso, ou a via); sem linha, a via */
  const lin = (typeof linhaAtual === 'function' && linhaAtual(d)) || null;
  const chave = lin && LINHAS_DA_VIA[lin] ? lin : (via === 'pesquisador' ? 'pesquisador' : via);
  const out = [];
  if (d.viaAnterior && d.viaAnterior !== via && !d.flags['viu_virada_' + via]){
    d.flags['viu_virada_' + via] = true;
    out.push({tipo:'info', texto:`O jeito que te olham mudou. Antes você era ${NOME_VIA[d.viaAnterior] || 'outra coisa'}; agora é ${NOME_VIA[via] || via}.`});
  } else out.push({tipo:'info', texto:Dados.escolher(LINHAS_DA_VIA[chave] || LINHAS_DA_VIA.neutro)});
  const m = LINHAS_DA_META[r.meta];
  if (m) out.push({tipo:'eco', texto:m(d)});
  const g = bonusDeGosto();
  if (g > 0) out.push({tipo:'info', texto:'Lugar do jeito que você gosta. Você anda mais solt{o|a} aqui.'});
  if (g < 0) out.push({tipo:'info', texto:'Lugar do jeito que você não gosta. O corpo sabe antes de você.'});
  return out;
}

/* a casa sabe do que você gosta */
function linhaDaCasaSobreGosto(d){
  const r = rumoDe(d);
  if (!r.gostos.texto) return '';
  return `Do lado do prato tem um bilhete com a letra de ${nomeCasa()}: "Pra quem gosta de ${r.gostos.texto.split(/[,;]/)[0].trim()}." Ninguém comenta.`;
}

/* ============================================================
   VASCULHAR — o que se acha olhando com atenção, por ambiente
   Achado de verdade (item pequeno), rastro de quem vive ali (a
   espécie entra como vista na Pokédex) ou só o lugar contando
   alguma coisa. Muda com o lugar e com a hora.
   ============================================================ */
const ACHADOS_VASCULHAR = {
  campo:[
    {t:'Debaixo de uma moita, uma Poké Ball fechada e vazia, com o lacre ainda inteiro. Alguém deixou cair correndo.', item:['Poké Ball', 1]},
    {t:'Na beira da trilha, um frasco de Potion pela metade, tampado. Serve.', item:['Potion', 1]},
    {t:'Penas espalhadas num círculo e um tufo de pelo marrom. Teve briga aqui de manhã cedo.', rastro:[16, 19, 21]},
    {t:'Pegadas pequenas e fundas, em linha reta, cortando o capim. Quem passou estava com pressa.', rastro:[19, 29, 32]},
    {t:'Uma pilha de pilhas usadas e uma que ainda funciona, no pé de um poste.', item:['Pilha', 1]},
    {t:'O capim está deitado num redondo perfeito, morno ainda. Alguma coisa dormiu aqui e acabou de sair.'}
  ],
  floresta:[
    {t:'Um casulo vazio grudado na casca, rachado no meio. Quem saiu daí já está voando.', rastro:[11, 14, 12, 15]},
    {t:'Teia grossa entre dois troncos, com orvalho preso em cada fio. Melhor dar a volta.', rastro:[167, 13]},
    {t:'No oco de uma árvore, alguém escondeu uma Antidote embrulhada num pano. Esqueceram de voltar.', item:['Antidote', 1]},
    {t:'Fezes de Pokémon cheias de semente, e um caminho de broto nascendo atrás delas.', rastro:[43, 69]},
    {t:'Uma faísca no meio do mato e cheiro de ar queimado. Algum elétrico mora perto.', rastro:[25]},
    {t:'Um isqueiro de pescador e uma Isca dentro de um saquinho, debaixo de uma raiz.', item:['Isca', 1]}
  ],
  montanha:[
    {t:'Pedra rolada recente, ainda com a terra úmida embaixo. Alguém grande passou rolando.', rastro:[74, 75, 95]},
    {t:'Uma corda velha amarrada num grampo de escalada, firme ainda. Você leva.', item:['Corda', 1]},
    {t:'Penas grandes presas num arbusto de espinho, lá em cima. Aqui voa coisa grande.', rastro:[21, 22, 17]},
    {t:'Uma lanterna com a lente rachada, que acende quando você bate nela.', item:['Lanterna', 1]},
    {t:'Marcas de garra na parede de pedra, na altura do seu joelho. Muitas.', rastro:[27, 28, 56]}
  ],
  caverna:[
    {t:'Uma pedra pendurada no teto — não, um Zubat dormindo de cabeça pra baixo — e mais trinta em volta. Você sai devagar.', rastro:[41, 42]},
    {t:'Uma pedra lisa e redonda que brilha pouquinho quando você cobre com a mão. Fica com você.', item:['Moon Stone', 1], raro:true},
    {t:'Restos de fogueira e uma Pokébola rachada. Alguém acampou aqui e saiu sem ela.', item:['Poké Ball', 1]},
    {t:'Uma trilha de cogumelos na parede úmida, comidos pela metade.', rastro:[46, 47]},
    {t:'Pilha nova dentro de uma lanterna esquecida no chão.', item:['Pilha', 2]}
  ],
  agua:[
    {t:'A maré deixou uma garrafa na areia com um Potion dentro, inteiro. Quem jogou no mar queria que alguém achasse.', item:['Potion', 1]},
    {t:'Bolhas subindo num ponto só, sempre no mesmo lugar. Tem coisa respirando ali embaixo.', rastro:[129, 60, 118, 72]},
    {t:'Conchas abertas em fileira, comidas por alguém de garra.', rastro:[98, 90]},
    {t:'Uma isca de pesca enroscada nas pedras, ainda boa.', item:['Isca', 1]},
    {t:'Uma pena azul enorme boiando, e mais nada. Nem sinal de quem largou.', raro:true}
  ]
};
ACHADOS_VASCULHAR.cidade = ACHADOS_VASCULHAR.campo;
ACHADOS_VASCULHAR.ruina = ACHADOS_VASCULHAR.campo;
ACHADOS_VASCULHAR.cemiterio = ACHADOS_VASCULHAR.caverna;
ACHADOS_VASCULHAR.vulcao = ACHADOS_VASCULHAR.montanha;

/* devolve os avisos do achado (e já aplica item e Pokédex) */
function achadoDeVasculhar(ambiente, sortudo, soRastro){
  const lista = (ACHADOS_VASCULHAR[ambiente] || ACHADOS_VASCULHAR.campo)
    .filter(a => (!a.raro || sortudo) && (!soRastro || !a.item));
  const a = Dados.escolher(lista);
  const av = [{tipo:'info', texto:a.t}];
  if (a.item){ Estado.darItem(a.item[0], a.item[1]); av.push({tipo:'item', texto:`Achou ${a.item[1]}× ${a.item[0]}.`}); }
  if (a.rastro){
    const daqui = (ENCONTROS[Mundo.id()] || []).map(x => x[0]);
    const quem = a.rastro.find(x => daqui.includes(x)) || a.rastro[0];
    const pd = Estado.pdex();
    if (DEX[quem] && !pd.vistos[quem] && Estado.dados.flags.tem_pokedex){
      pd.vistos[quem] = true;
      av.push({tipo:'pokedex', texto:`Pelo rastro, a Pokédex acende um número novo: ${String(quem).padStart(3, '0')}.`});
    }
  }
  if (ehNoite()) av.push({tipo:'eco', texto:'Com lanterna, de noite, tudo parece mais perto do que está.'});
  return av;
}
