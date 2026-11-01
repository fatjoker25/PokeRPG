/* ============================================================
   RUMO — o que você quer, do que você gosta e como Kanto te vê
   A ficha de inscrição (inscricao.js) pede um objetivo, do que você
   gosta e do que não gosta, e grava a escolha pronta (j.meta,
   j.gostos, j.desgostos). Save de antes dela tinha texto livre, e o
   jogo lê o texto procurando palavra, uma vez, e guarda do mesmo
   jeito. Tudo isso pesa na história:
   - o começo de cada capítulo é acaso, não lista de chamada: a linha
     da sua via sai pela fama, e a lembrança do objetivo pelo status
     que ele puxa — quando acontece, deixa alguma coisa (o começo do
     capítulo, mais embaixo);
   - lugar de que você gosta dá um dado a mais nos testes lá dentro; lugar
     de que você não gosta, −1, e o capítulo diz como o lugar te pega;
   - Pokémon de tipo ou espécie de que você gosta é alegria, e o de que
     não gosta é medo: chega no time com ±10 de moral, mexe 1 na Vontade
     do treinador quando aparece na luta e 1 dado no selo da Pokébola
     (só espécie que a Pokédex já catalogou: senão a reação entregava o
     que ele é).
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
/* as chaves são os nomes dos tipos no jogo (TIPOS): "Planta" aqui nunca
   casava com Pokémon nenhum, porque o tipo se chama Grama */
const TIPOS_GOSTO = {
  'Água':['agua'], 'Fogo':['fogo'], 'Grama':['planta', 'grama', 'flor'], 'Inseto':['inseto'],
  'Sombrio':['sombrio', 'sombra'], 'Metálico':['metalic', 'metal', 'aco'],
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
  /* save antigo leu "Planta", que não é o nome de tipo nenhum */
  const TIPO_ANTIGO = {Planta:'Grama'};
  for (const g of [j.gostos, j.desgostos])
    if (g && g.tipos && g.tipos.some(t => TIPO_ANTIGO[t])) g.tipos = g.tipos.map(t => TIPO_ANTIGO[t] || t);
  return {meta:j.meta, gostos:j.gostos, desgostos:j.desgostos};
}

/* ±1 dado no teste quando o lugar é de gosto ou de desgosto */
function bonusDeGosto(){
  try {
    const d = Estado.dados; if (!d || !d.jogador) return 0;
    const r = rumoDe(d);
    /* o ambiente do capítulo passa pelo Arenas.doCapitulo: capítulo que
       anda por mais de um lugar escreve o ambiente como função */
    const grupo = grupoDoLugar();
    if (r.gostos.lugares.includes(grupo)) return 1;
    if (r.desgostos.lugares.includes(grupo)) return -1;
  } catch(e){}
  return 0;
}

/* Alegria (+1), medo (−1) ou nada (0) por um Pokémon: a espécie
   manda antes do tipo — quem gosta de Fogo e não gosta de Charmander
   tem medo do Charmander. */
function gostoDe(p){
  if (!p || !p.dex) return 0;
  const r = rumoDe();
  const esp = l => !!l && (l.dex || []).includes(p.dex);
  const tipo = l => !!l && (p.tipos || (DEX[p.dex] || {}).tipos || []).some(t => (l.tipos || []).includes(t));
  if (esp(r.gostos)) return 1;
  if (esp(r.desgostos)) return -1;
  if (tipo(r.gostos)) return 1;
  if (tipo(r.desgostos)) return -1;
  return 0;
}
/* moral de quem chega: +10 se é do que você gosta, −10 se é do que não gosta */
function moralDeGosto(p){ return gostoDe(p) * 10; }
/* na luta e na captura só vale o que a Pokédex já catalogou: a reação
   a um vulto entregaria o que ele é */
function gostoSabido(p){
  return (p && typeof Estado !== 'undefined' && Estado.conheceu && Estado.conheceu(p.dex)) ? gostoDe(p) : 0;
}
/* +1 dado no selo da Pokébola pro que você gosta, −1 pro que não gosta */
function gostoNaCaptura(p){ return gostoSabido(p); }

/* O que se sente quando ele aparece do outro lado. A espécie tem frase
   própria; o tipo, outra. "Ele" concorda com o substantivo Pokémon. */
const FRASES_DE_GOSTO = {
  esp:{
    1:[n => `${n}! Você queria ver um de perto desde sempre, e ele está bem ali.`,
       n => `${n}. Você sorri sem querer, e o time repara.`,
       n => `${n}. O peito dispara do jeito que disparava quando você só via nos livros.`],
    '-1':[n => `${n}. De todos, justo esse. A sua mão vai sozinha pro cinto.`,
          n => `${n}. Você dá meio passo pra trás antes de decidir ficar.`,
          n => `${n}. Você nunca soube explicar, e o corpo não espera explicação.`]
  },
  tipo:{
    1:[t => `Pokémon de ${t}. Você gosta deles desde antes de sair de casa, e a mão fica firme.`,
       t => `${t}, do jeito que você gosta. Dá vontade de ver o que ele sabe fazer.`],
    '-1':[t => `Pokémon de ${t}. O pé atrás vem sozinho.`,
          t => `${t}. Você nunca gostou, e o corpo lembra antes de você.`]
  }
};
function fraseDeGosto(p, g){
  const r = rumoDe();
  const lista = g > 0 ? r.gostos : r.desgostos;
  const porEsp = !!lista && (lista.dex || []).includes(p.dex);
  const tipo = porEsp ? null : (p.tipos || (DEX[p.dex] || {}).tipos || []).find(t => (lista.tipos || []).includes(t));
  const pool = FRASES_DE_GOSTO[porEsp ? 'esp' : 'tipo'][String(g)];
  const f = pool[(p.uid ? String(p.uid).length + p.dex : p.dex) % pool.length];
  return f(porEsp ? (DEX[p.dex] || {}).nome : tipo);
}

/* A linha que abre cada capítulo: a sua via e o seu objetivo, no lugar
   em que você está. Muda quando a via muda. Linha com {t, cidade:true}
   só sai na cidade: capítulo que abre em rota ou caverna não tem praça,
   rua de trás nem fila de Centro. */
const LINHAS_DA_VIA = {
  heroi:[
    'No caminho, alguém aponta você pra outra pessoa e as duas acenam. É o tipo de reconhecimento que não se compra.',
    'Uma criança pergunta se você é {aquele|aquela} que ajudou. Você diz que foi um pouco de sorte. Ela não acredita.',
    'Tem gente que confia em você antes de você abrir a boca. Isso abre porta e pesa no ombro.',
    'O dono da banca te dá o troco certo e um bom-dia a mais do que o normal. Notícia de quem ajuda chega antes de você.',
    {cidade:true, t:'Na praça, alguém conta pra outro alguém uma coisa que você fez. Contam maior do que foi.'}
  ],
  mercenario:[
    {cidade:true, t:'Dois sujeitos encostados no muro medem o seu cinto antes de medir a sua cara. Notícia de quem resolve com dinheiro anda rápido.'},
    'Alguém já sabe o seu preço antes de você dizer. Você não lembra de ter dito.',
    'Te oferecem um serviço antes do bom-dia. É o que a sua fama compra.',
    'Um sujeito te para pra perguntar quanto você cobra. Não pergunta pelo quê.',
    {cidade:true, t:'No balcão do Centro, a atendente segura a sua licença um segundo a mais antes de devolver. Conferindo.'}
  ],
  foragido:[
    {cidade:true, t:'Tem uma descrição parecida com a sua num papel colado no poste. Parecida o bastante.'},
    {cidade:true, t:'Você escolhe a rua de trás sem pensar. Já virou hábito.'},
    'Você olha pra trás uma vez a cada cem passos, sem contar. Já virou hábito.',
    'Quem te reconhece abaixa os olhos. Quem não te reconhece ainda vai.',
    'Você entra pelo lado que não é o da entrada. Ninguém nota, e é essa a ideia.'
  ],
  pesquisador:[
    'Você anota a hora e o lugar antes de qualquer outra coisa. O caderno já tem mais página escrita do que em branco.',
    {cidade:true, t:'Alguém da cidade pergunta se você é "{o|a} da Pokédex". Você é.'},
    'Primeiro você olha o que vive aqui. Depois o resto.',
    'Você reconhece de longe o canto de um Pokémon que ainda não viu. Anota o som antes de anotar o nome do lugar.',
    'Tem uma pena no chão da entrada que não é de nenhum Pokémon que você conhece. Você guarda no caderno.'
  ],
  /* as linhas de posto (js/story/linhas.js) */
  lei:[
    'Você repara primeiro na guarita, depois em quem está de pé na esquina sem motivo. O posto ensina a olhar nessa ordem.',
    {cidade:true, t:'Um guarda da cidade te cumprimenta com dois dedos na aba do boné. Entre gente de patrulha é assim.'},
    {cidade:true, t:'Alguém pergunta onde fica a delegacia. Você sabe, e sabe também qual porta fica aberta de noite.'},
    'Você confere as placas do caminho como quem confere documento. O posto ensina a desconfiar de placa nova.',
    {cidade:true, t:'Um comerciante te conta, sem você perguntar, quem anda aparecendo de noite. Gente conta coisa pra quem tem posto.'}
  ],
  rocket:[
    'O aparelho do envelope está no bolso de dentro. Pesa mais do que o tamanho dele.',
    'Você conta as pessoas em volta sem querer. Virou costume, e o costume tem dono.',
    {cidade:true, t:'Num muro da cidade tem uma letra R pichada pequena, perto do chão. Você não tinha reparado nessas antes.'},
    'Você decora dois rostos na entrada sem saber pra quê. Já virou reflexo.',
    {cidade:true, t:'Um menino de recado passa por você e não te olha. Olhar seria o erro.'}
  ],
  ciencia:[
    'Você anota a hora e o lugar antes de qualquer outra coisa. O caderno já tem mais página escrita do que em branco.',
    {cidade:true, t:'Alguém da cidade pergunta se você é "{o|a} da Pokédex". Você é.'},
    'Primeiro você olha o que vive aqui. Depois o resto.',
    'Você mede a temperatura da água do primeiro córrego com a mão, por hábito. O laboratório pede número, e a mão já sabe chutar.',
    'Tem uma pena no chão da entrada que não é de nenhum Pokémon que você conhece. Você guarda no caderno.'
  ],
  imprensa:[
    'Você lê a placa da entrada inteira, inclusive a parte pequena. Jornal ensina isso.',
    {cidade:true, t:'Tem uma banca de jornal na praça, e o Jornal de Fuchsia está pendurado de cabeça pra baixo. Você endireita.'},
    {cidade:true, t:'Alguém conta uma história na fila do Centro e você já está pensando no título.'},
    'Você ouve três versões da mesma história antes de chegar no centro. Nenhuma bate com a outra.',
    {cidade:true, t:'Tem um mural de recados no Centro, e você lê todos, inclusive os rasgados.'}
  ],
  criacao:[
    {cidade:true, t:'Você olha primeiro o pelo, a pata e o olho de cada Pokémon da rua. Depois a cara do dono.'},
    {cidade:true, t:'Tem um cercado na saída da cidade, e você já sabe, de longe, que a água está velha.'},
    'Uma criança te mostra o Pokémon dela, e você se agacha antes de olhar. É assim que se olha.',
    'Você repara no Tauros de carga de uma carroça antes de reparar na carroça. O casco está rachado, e o dono não viu.',
    {cidade:true, t:'Num quintal, uma Miltank muge pra você. Você responde, e a dona do quintal ri.'}
  ],
  liga:[
    'Duas crianças te reconhecem do agasalho da Liga e param de brincar pra ver você passar.',
    'Você confere sem querer o cinto de cada treinador que passa: quantas Pokébolas, de que cor.',
    'A Liga tem cartaz em toda cidade. Você conhece quem fez a foto.',
    'Um garoto te pede pra ver a sua licença. Você mostra, e ele lê o seu nome em voz alta, devagar.',
    {cidade:true, t:'No Centro, a televisão passa lutas da Liga do ano passado. Você conta os erros de quem ganhou.'}
  ],
  neutro:[
    'Mais uma parada, mais uma estrada. Ninguém sabe ainda o que esperar de você.',
    'Você ainda é só mais {um treinador|uma treinadora} de passagem. Isso tem as suas vantagens.',
    'Ninguém repara em você na chegada. Dá pra olhar tudo com calma.',
    {cidade:true, t:'Você é mais {um|uma} na fila do Centro, e a fila anda do mesmo jeito pra todo mundo.'},
    'Uma mulher te pergunta o caminho como se você fosse daqui. Você aponta, e acerta.',
    'Um vendedor de beira de estrada te oferece um mapa desenhado à mão. Você agradece e não compra. Ele não insiste.'
  ]
};
/* ============================================================
   O COMEÇO DE CADA CAPÍTULO — acaso, não lista de chamada
   Antes, todo capítulo abria com as mesmas três linhas: a da via, a do
   objetivo ("três insígnias no cinto…") e a do gosto, e o personagem
   passava a jornada se lembrando do que já tinha feito. Agora:
   - a linha da via sai pela fama (CHANCE_DA_VIA, mais 10% por degrau
     de reputação acima do primeiro): quem é conhecido é reparado;
   - a lembrança do objetivo é um momento que acontece ou não, pelo
     status que o objetivo puxa (STATUS_DA_META, chanceDoMomento), e
     quando acontece deixa alguma coisa pequena: Vontade, moral, um
     achado, dinheiro, fôlego;
   - o gosto do lugar sai sempre que vale (o dado a mais, ou a menos,
     vale sempre), com a frase do lugar;
   - a mudança de via, quando acontece, sai sempre.
   Uma vez por capítulo (d.rumoCap), e nenhuma linha repete as últimas
   (d.rumoVisto).
   ============================================================ */
const CHANCE_DA_VIA = .35;
const STATUS_DA_META = {campeao:'forca', pokedex:'intelecto', heroi:'carisma', poder:'sorte',
                        vinculo:'carisma', explorar:'percepcao', casa:'resistencia'};
const NOME_DO_STATUS = {forca:'Força', percepcao:'Percepção', intelecto:'Intelecto', carisma:'Carisma', sorte:'Sorte', resistencia:'Resistência'};
/* 25% com o status em 1, +15% por ponto, até 85% */
function chanceDoMomento(n){ return Math.min(.85, .25 + .15 * (Math.max(1, n || 1) - 1)); }
function chanceDaVia(d){
  const r = Estado.rep || {};
  const degrau = Math.max(1, r.eixo === 'ruim' ? (r.ruim || 1) : (r.bom || 1));
  return Math.min(.85, CHANCE_DA_VIA + .10 * (degrau - 1));
}

/* Os momentos de cada objetivo: o texto (t), quando vale (cond) e o que
   deixa (deixa: vontade, moral do time, moralFrente, item, dinheiro,
   hp) — "deixa", e não "ef": não é o ef das cenas e o motor não lê. Texto que fala do Pokémon da frente concorda com ele. */
const _insig = d => (d.insignias || []).filter(i => i !== 'Título de Campeão' && i !== 'Campeão de Kanto').length;
const _frente = d => (d.time || []).find(p => !p.morto && p.hp > 0) || null;
const MOMENTOS_DA_META = {
  campeao:[
    {cond:d => _insig(d) === 0, deixa:{vontade:1},
     t:'Nenhuma insígnia no cinto ainda. Você passa o dedo no lugar onde a primeira vai ficar, e a vontade de ganhar acorda antes de você.'},
    {cond:d => _insig(d) > 0 && _insig(d) < 7, deixa:{vontade:1},
     t:'Você confere as insígnias pelo tato, no fundo do bolso, sem tirar nenhuma. A próxima já tem lugar.'},
    {deixa:{vontade:1}, t:'Você faz flexão contra uma mureta do caminho, sem ninguém pedir. Bobagem, e funciona: o corpo chega pronto.'},
    {cond:d => _insig(d) >= 7, deixa:{vontade:1}, t:'Falta pouco pro Planalto, e você sente isso nas pernas antes de sentir na cabeça.'}
  ],
  pokedex:[
    {deixa:{item:'Poké Ball'}, t:'Uma estudante de Pokémon te pergunta o que você já catalogou. Você responde de cabeça, e ela te passa uma Poké Ball de amostra do laboratório dela.'},
    {deixa:{vontade:1}, t:'Você anota o que vive aqui antes de qualquer outra coisa. Página nova, e a letra sai firme.'},
    {cond:d => Estado.contagemDex().catalogados >= 10, deixa:{item:'Poké Ball'},
     t:d => `Você relê o caderno da Pokédex no caminho: ${Estado.contagemDex().catalogados} espécies, e uma ideia de onde achar a próxima. Na beira da trilha, uma Poké Ball que alguém perdeu.`}
  ],
  heroi:[
    {deixa:{moral:3}, t:'Uma senhora te reconhece de outra cidade e enfia um saquinho de ração boa na sua mão, pro time. Eles comem antes de você dizer obrigad{o|a}.'},
    {deixa:{moral:3}, t:'Uma criança pergunta se você é {aquele|aquela} que ajudou. Você diz que foi sorte. Ela não acredita, e o time estufa o peito do seu lado.'},
    {deixa:{vontade:1}, t:'Alguém para e pergunta se você precisa de alguma coisa. Você não precisa, e a pergunta fica com você o dia inteiro.'}
  ],
  poder:[
    {deixa:{dinheiro:true}, t:d => `Uma nota dobrada no chão do caminho, ${fmtDin(dinheiroDoMomento(d))} ₽, e ninguém em volta procurando.`},
    {deixa:{dinheiro:true}, t:d => `Três copos e uma pedrinha numa mesa de beira de estrada. Você ganha a primeira rodada e para aí, que é o segredo: ${fmtDin(dinheiroDoMomento(d))} ₽.`},
    {deixa:{dinheiro:true}, t:d => `Um sujeito paga ${fmtDin(dinheiroDoMomento(d))} ₽ pra saber por onde você veio. Você conta a verdade, que é a coisa mais barata que você tem.`}
  ],
  vinculo:[
    {cond:d => !!_frente(d), deixa:{moralFrente:5}, t:d => { const p = _frente(d); return `${nomeExib(p)} encosta em você no meio do caminho, do nada, e fica. Você diminui o passo.`; }},
    {deixa:{moral:3}, t:'Vocês param pra descansar e ninguém precisa dizer nada. O time inteiro cochila dez minutos encostado em você.'},
    {cond:d => !!_frente(d), deixa:{moralFrente:5},
     t:d => { const p = _frente(d); return `Você ajeita ${nomeExib(p)} com as mãos antes de entrar. ${pron(p).Ele} finge que não gosta e não sai de perto.`; }}
  ],
  explorar:[
    {deixa:{item:'Potion'}, t:'Você pega o caminho de trás, o que ninguém pega, e acha uma Potion caída no mato, ainda lacrada.'},
    {deixa:{vontade:1}, t:'Do alto da última subida dá pra ver o lugar inteiro. Você decora as saídas sem querer.'},
    {deixa:{hp:5}, t:'Um rastro na lama te leva a um atalho de verdade. Você chega com fôlego sobrando.'}
  ],
  casa:[
    {deixa:{vontade:1}, t:d => `Você pensa no que vai contar pra ${nomeCasa()} quando voltar, e a história ainda não está pronta. Isso é bom.`},
    {deixa:{vontade:1}, t:'No fundo do bolso tem um bilhete de casa que você não lembrava de ter guardado. Você lê duas vezes e guarda de novo.'},
    {deixa:{hp:3, vontade:1}, t:d => `O cheiro de alguma cozinha no caminho é o mesmo da de ${nomeCasa()}. Você para um segundo e segue mais firme.`}
  ]
};
/* o achado em dinheiro cresce com a jornada: 100 ₽ no começo, uns 400 no fim */
function dinheiroDoMomento(d){ return 50 * (2 + Math.floor((d.capitulo || 1) / 3)); }

/* o lugar de que você gosta (ou não), na frase do lugar: duas de cada,
   que se revezam */
const GOSTO_DO_LUGAR = {
  agua:     {sim:['O cheiro de água chega antes da água. Você anda mais solt{o|a} perto dela.',
                  'O barulho da água por perto acalma tudo, até a pressa.'],
             nao:['Água por todo lado. Você confere duas vezes onde pisa.',
                  'Você fica longe da beirada sem decidir ficar longe.']},
  caverna:  {sim:['O frio de pedra e o eco dos seus passos: no escuro você se acha.',
                  'Lá dentro o mundo fica do tamanho da lanterna, e você gosta disso.'],
             nao:['O teto baixo aperta o peito. Você conta as saídas antes de contar os passos.',
                  'O escuro daqui tem cheiro. Você respira pela boca e segue.']},
  montanha: {sim:['A subida puxa a perna e abre o peito. Lá de cima tudo fica menor.',
                  'Pedra solta, vento frio e a vista que paga a subida.'],
             nao:['Altura demais. Você olha pro chão, e não pra paisagem.',
                  'Cada pedra que rola lá embaixo demora pra parar de rolar. Você para de ouvir.']},
  floresta: {sim:['Folha, sombra e o barulho de mil coisas vivas. Você respira melhor aqui.',
                  'Debaixo das copas o calor some, e o passo fica leve.'],
             nao:['Mato fechado dos dois lados. Cada galho que estala é alguém.',
                  'A trilha some e volta. Você não gosta de lugar que decide por você.']},
  cidade:   {sim:['Gente, barulho, vitrine. A cidade te pega pelo braço e você deixa.',
                  'Uma cidade inteira acordada em volta, e você no meio dela.'],
             nao:['Gente demais. Você anda mais rápido do que precisa.',
                  'Barulho de todo lado. Você procura a rua mais vazia sem perceber.']},
  cemiterio:{sim:['O silêncio daqui é bom de ouvir. Você não tem pressa.',
                  'Névoa baixa e vela acesa: o lugar fala baixo, e você escuta.'],
             nao:['O silêncio daqui tem peso. Você não olha pra trás, e quer olhar.',
                  'Você anda no meio do caminho, longe das duas beiradas.']},
  vulcao:   {sim:['O calor sobe do chão e você abre o casaco sorrindo.',
                  'O chão quente debaixo da bota parece coisa viva. Você gosta.'],
             nao:['O calor gruda na pele. Você bebe metade do cantil sem perceber.',
                  'O ar treme de calor, e você treme junto.']},
  campo:    {sim:['Campo aberto, vento na cara. As pernas querem correr.',
                  'Céu grande e capim baixo até onde a vista vai. Dá vontade de gritar o próprio nome.'],
             nao:['Campo aberto demais, sem onde se esconder. Você não sabe por que isso incomoda.',
                  'Nada em volta pra segurar o vento. Você aperta o casaco.']}
};
function grupoDoLugar(){
  const d = Estado.dados;
  const amb = (d.modo === 'cena' && typeof Historia !== 'undefined' && Historia.capAtual)
    ? (typeof Arenas !== 'undefined' ? Arenas.doCapitulo(Historia.capAtual, d) : Historia.capAtual.ambiente)
    : (typeof Mundo !== 'undefined' ? Mundo.atual().ambiente : null);
  return {ruina:'cidade'}[amb] || amb;
}

/* escolhe da lista sem repetir o que saiu por último */
function _semRepetir(d, chave, lista){
  d.rumoVisto = Array.isArray(d.rumoVisto) ? d.rumoVisto : [];
  const novos = lista.map((x, i) => [x, `${chave}:${i}`]).filter(([, k]) => !d.rumoVisto.includes(k));
  const [x, k] = Dados.escolher(novos.length ? novos : lista.map((x, i) => [x, `${chave}:${i}`]));
  d.rumoVisto = d.rumoVisto.concat(k).slice(-12);
  return x;
}

/* o que o momento deixa, já com o aviso do que mudou */
function aplicarMomento(ef, d){
  const out = [];
  if (ef.vontade){
    const antes = Estado.vontadeJogador();
    Estado.recuperarVontadeJogador(ef.vontade);
    const ganhou = Estado.vontadeJogador() - antes;
    if (ganhou) out.push({tipo:'info', texto:`+${ganhou} de Vontade (${Estado.vontadeJogador()} de ${Estado.vontadeMaxJogador()}).`});
  }
  if (ef.hp && Estado.j.hp < Estado.hpMaxJogador()){
    const antes = Estado.j.hp;
    Estado.curarJogador(ef.hp);
    out.push({tipo:'info', texto:`+${Estado.j.hp - antes} de HP (${Estado.j.hp} de ${Estado.hpMaxJogador()}).`});
  }
  if (ef.dinheiro){
    const v = dinheiroDoMomento(d);
    Estado.j.dinheiro += v;
    out.push({tipo:'item', texto:`+${fmtDin(v)} ₽`});
  }
  if (ef.item){
    Estado.darItem(ef.item, 1);
    out.push({tipo:'item', texto:`Recebeu 1× ${ef.item}.`});
  }
  if (ef.moral){
    const vivos = (d.time || []).filter(p => !p.morto);
    vivos.forEach(p => { p.moral = Math.min(100, (p.moral || 0) + ef.moral); });
    if (vivos.length) out.push({tipo:'info', texto:`O time confia mais em você (+${ef.moral} de moral).`});
  }
  if (ef.moralFrente){
    const p = _frente(d);
    if (p){ p.moral = Math.min(100, (p.moral || 0) + ef.moralFrente); out.push({tipo:'info', texto:`${nomeExib(p)} confia mais em você (+${ef.moralFrente} de moral).`}); }
  }
  return out;
}

function avisosDeRumo(){
  const d = Estado.dados;
  if (!d || d.capitulo < 2) return [];
  const out = [];
  /* uma vez por capítulo: voltar à cena (recarregar, entrar pelo mapa) não rola de novo */
  if (d.rumoCap === d.capitulo) return out;
  d.rumoCap = d.capitulo;
  /* o gosto do lugar: o dado vale sempre, e a frase sai quando você
     chega num tipo de lugar diferente do último em que ela saiu */
  const g = bonusDeGosto();
  const grupo = grupoDoLugar();
  const gostoDoLugar = () => {
    if (!g){ d.rumoLugar = null; return; }
    if (d.rumoLugar === grupo + (g > 0 ? '+' : '-')) return;
    d.rumoLugar = grupo + (g > 0 ? '+' : '-');
    const f = GOSTO_DO_LUGAR[grupo];
    out.push({tipo:'info', texto: f ? _semRepetir(d, 'lugar:' + grupo + (g > 0 ? '+' : '-'), f[g > 0 ? 'sim' : 'nao'])
      : (g > 0 ? 'Lugar do jeito que você gosta. Você anda mais solt{o|a} aqui.' : 'Lugar do jeito que você não gosta. O corpo sabe antes de você.')});
  };

  const r = rumoDe(d);
  const via = d.via || 'neutro';
  /* a linha manda (posto de maior peso, ou a via); sem linha, a via */
  const lin = (typeof linhaAtual === 'function' && linhaAtual(d)) || null;
  const chave = lin && LINHAS_DA_VIA[lin] ? lin : (via === 'pesquisador' ? 'pesquisador' : via);
  if (d.viaAnterior && d.viaAnterior !== via && !d.flags['viu_virada_' + via]){
    d.flags['viu_virada_' + via] = true;
    out.push({tipo:'info', texto:`O jeito que te olham mudou. Antes você era ${NOME_VIA[d.viaAnterior] || 'outra coisa'}; agora é ${NOME_VIA[via] || via}.`});
  } else if (Math.random() < chanceDaVia(d)){
    const naCidade = (Mundo.atual() || {}).tipo === 'cidade';
    const cabe = (LINHAS_DA_VIA[chave] || LINHAS_DA_VIA.neutro)
      .filter(x => typeof x === 'string' || !x.cidade || naCidade)
      .map(x => typeof x === 'string' ? x : x.t);
    if (cabe.length) out.push({tipo:'info', texto:_semRepetir(d, 'via:' + chave, cabe)});
  }
  /* o momento do objetivo, pelo status que ele puxa */
  const st = STATUS_DA_META[r.meta];
  const valor = st && Estado.j.status ? Estado.j.status[st] : 1;
  if (st && Math.random() < chanceDoMomento(valor)){
    const cabe = (MOMENTOS_DA_META[r.meta] || []).filter(m => !m.cond || m.cond(d));
    if (cabe.length){
      const m = _semRepetir(d, 'meta:' + r.meta, cabe);
      out.push({tipo:'momento', texto: typeof m.t === 'function' ? m.t(d) : m.t});
      out.push(...aplicarMomento(m.deixa || {}, d));
    }
  }
  gostoDoLugar();
  return out;
}

/* a casa sabe do que você gosta */
function linhaDaCasaSobreGosto(d){
  const r = rumoDe(d);
  if (!r.gostos.texto) return '';
  return `Do lado do prato tem um bilhete com a letra de ${nomeCasa()}: "Pra quem gosta de ${r.gostos.texto.split(/[,;]/)[0].trim()}." Ninguém comenta.`;
}

