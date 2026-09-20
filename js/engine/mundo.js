/* ============================================================
   O MUNDO
   Kanto como lugar, não como corredor. Você decide para onde
   vai, quando vai, e o que faz enquanto está lá.
   ============================================================ */

const PERIODOS = ['madrugada','manhã','tarde','noite'];

const LOCAIS = {

/* ─── SUDOESTE ──────────────────────────────────────────── */
pallet:{
  nome:'Pallet', tipo:'cidade', ambiente:'campo', nivel:3, porte:'vilarejo',
  conexoes:['rota1','rota21'],
  desc:[
    'Pallet tem três ruas, um mercado que abre tarde e um cheiro de mar que vem de longe, do outro lado do morro.',
    'Todo mundo aqui conhece o seu rosto desde antes de você ter memória.'
  ],
  lugares:['centro','loja','casa']
},
rota1:{
  nome:'Rota 1', tipo:'rota', ambiente:'campo', nivel:4,
  conexoes:['pallet','viridian'],
  desc:[
    'A Rota 1 é larga e honesta: capim baixo dos dois lados, uma cerca velha e uma vista que alcança longe.',
    'Dá pra ser visto de longe aqui. Isso é bom e ruim ao mesmo tempo.'
  ]
},
viridian:{
  nome:'Viridian', tipo:'cidade', ambiente:'cidade', nivel:6, porte:'cidade pequena',
  conexoes:['rota1','rota2','rota22'],
  desc:[
    'Viridian tem prédio de dois andares e semáforo. Para quem vem de Pallet, isso é uma metrópole.',
    'Tem um mural de recados na entrada do Centro Pokémon, cheio de bilhete de gente procurando gente.'
  ],
  lugares:['centro','loja']
},
rota22:{
  nome:'Rota 22', tipo:'rota', ambiente:'montanha', nivel:8,
  conexoes:['viridian','rota23'],
  desc:[
    'A Rota 22 sobe em direção ao oeste, para um portão de pedra que ninguém atravessa sem oito insígnias.',
    'É um lugar onde treinadores vêm treinar e olhar o portão de longe.'
  ]
},
rota2:{
  nome:'Rota 2', tipo:'rota', ambiente:'floresta', nivel:7,
  conexoes:['viridian','floresta'],
  desc:[
    'A Rota 2 é um corredor estreito entre dois paredões de árvore. O céu fica em faixa.',
    'No fim dela, a Floresta de Viridian começa sem aviso nenhum.'
  ]
},
floresta:{
  nome:'Floresta de Viridian', tipo:'rota', ambiente:'floresta', nivel:9, perigosa:true,
  conexoes:['rota2','pewter'],
  desc:[
    'A floresta não é escura. É pior: é verde demais, e a luz que atravessa as copas deixa tudo com a mesma cor.',
    'Depois de vinte minutos, o barulho vira normal e o silêncio é que assusta.'
  ]
},
pewter:{
  nome:'Pewter', tipo:'cidade', ambiente:'montanha', nivel:11, porte:'cidade',
  conexoes:['floresta','rota3'],
  desc:[
    'Pewter é uma cidade de pedra que decidiu ser sobre pedra: museu de pedra, prédio de pedra, gente com cara de pedra.',
    'A serra atrás dela é cinza mesmo em dia de sol.'
  ],
  lugares:['centro','loja','museu']
},

/* ─── NORTE ─────────────────────────────────────────────── */
rota3:{
  nome:'Rota 3', tipo:'rota', ambiente:'montanha', nivel:13,
  conexoes:['pewter','monte_lua'],
  desc:[
    'A Rota 3 sobe em curvas por uma encosta seca, com treinadores acampados em quase toda curva.',
    'Lá em cima dá pra ver a boca preta do Monte da Lua.'
  ]
},
monte_lua:{
  nome:'Monte da Lua', tipo:'rota', ambiente:'caverna', nivel:15, perigosa:true,
  conexoes:['rota3','rota4'],
  desc:[
    'A caverna engole o som. Três passos lá dentro e a sua respiração vira a coisa mais alta do mundo.',
    'Tem cabo elétrico no chão, grosso, preso na parede com abraçadeira nova.'
  ]
},
rota4:{
  nome:'Rota 4', tipo:'rota', ambiente:'campo', nivel:16,
  conexoes:['monte_lua','cerulean'],
  desc:['A Rota 4 desce do monte para o vale de Cerulean, e o barulho de água aparece antes da cidade.']
},
cerulean:{
  nome:'Cerulean', tipo:'cidade', ambiente:'agua', nivel:18, porte:'cidade',
  conexoes:['rota4','rota24','rota5','rota9'],
  desc:[
    'Cerulean é cortada em dois por um rio, e as pontes ficam cheias mesmo à noite.',
    'A cidade cresceu em volta da água do jeito que cidade cresce: sem plano nenhum e dando certo.'
  ],
  lugares:['centro','loja']
},
rota24:{
  nome:'Rota 24 / 25', tipo:'rota', ambiente:'agua', nivel:20,
  conexoes:['cerulean'],
  desc:[
    'A Rota 24 sai de Cerulean pela ponte norte e vira Rota 25 sem avisar, acompanhando o rio até o mar.',
    'Tem cabana de pescador, trilha de terra e gente pescando em silêncio há horas.'
  ]
},
rota9:{
  nome:'Rota 9 / 10', tipo:'rota', ambiente:'montanha', nivel:24,
  conexoes:['cerulean','usina','tunel_rocha'],
  desc:[
    'A Rota 9 corre para o leste por pedra solta e mato baixo, e vira Rota 10 no alto.',
    'O ar aqui tem cheiro de tomada queimada e ninguém sabe explicar por quê.'
  ]
},
usina:{
  nome:'Usina Abandonada', tipo:'especial', ambiente:'ruina', nivel:30, perigosa:true,
  conexoes:['rota9'],
  desc:[
    'A usina foi desativada há onze anos. A companhia nunca desmontou — só trancou o portão e foi embora.',
    'E ela está zumbindo.'
  ]
},
tunel_rocha:{
  nome:'Túnel da Rocha', tipo:'rota', ambiente:'caverna', nivel:26, perigosa:true,
  conexoes:['rota9','lavender'],
  desc:[
    'O Túnel da Rocha não tem iluminação. Nenhuma. É pedra, escuro e o som da própria bota.',
    'Quem entra sem lanterna sai pelo mesmo lado por onde entrou, se sair.'
  ]
},
lavender:{
  nome:'Lavender', tipo:'cidade', ambiente:'cemiterio', nivel:28, porte:'vila',
  conexoes:['tunel_rocha','rota8','rota12'],
  desc:[
    'Lavender não tem música. Você só percebe isso depois de meia hora — nenhum rádio, nenhuma loja com alto-falante.',
    'É uma decisão coletiva que ninguém tomou.'
  ],
  lugares:['centro','loja']
},

/* ─── CENTRO E LESTE ────────────────────────────────────── */
rota5:{
  nome:'Rota 5', tipo:'rota', ambiente:'campo', nivel:19,
  conexoes:['cerulean','saffron'],
  desc:['A Rota 5 é a única de Kanto com asfalto do começo ao fim. Saffron aparece antes do que você espera — e aparece por cima.']
},
saffron:{
  nome:'Saffron', tipo:'cidade', ambiente:'cidade', nivel:26, porte:'metrópole',
  conexoes:['rota5','rota6','rota7','rota8'],
  desc:[
    'Saffron não tem rota, não tem mato, não tem rio. É concreto até onde a vista alcança.',
    'Os prédios são visíveis de dezenove quilômetros de distância.'
  ],
  lugares:['centro','loja','silph']
},
rota6:{
  nome:'Rota 6', tipo:'rota', ambiente:'campo', nivel:21,
  conexoes:['saffron','vermilion'],
  desc:['A Rota 6 desce de Saffron para o mar por um vale com ponte de madeira e riacho que corta o caminho três vezes.']
},
rota7:{
  nome:'Rota 7', tipo:'rota', ambiente:'campo', nivel:22,
  conexoes:['saffron','celadon'],
  desc:['A Rota 7 liga Saffron a Celadon por um trecho curto e muito movimentado. É mais fila do que rota.']
},
rota8:{
  nome:'Rota 8', tipo:'rota', ambiente:'campo', nivel:23,
  conexoes:['saffron','lavender'],
  desc:['A Rota 8 é reta, comprida e sem graça, e serve pra pensar. Muita gente detesta ela por isso.']
},
vermilion:{
  nome:'Vermilion', tipo:'cidade', ambiente:'agua', nivel:22, porte:'cidade portuária',
  conexoes:['rota6','rota11'],
  desc:[
    'Vermilion cheira a sal, óleo diesel e fritura. O porto trabalha vinte e quatro horas e o barulho não para nunca.',
    'É a cidade onde Kanto encosta no resto do mundo.'
  ],
  lugares:['centro','loja','porto']
},
rota11:{
  nome:'Rota 11', tipo:'rota', ambiente:'campo', nivel:25,
  conexoes:['vermilion','rota12'],
  desc:['A Rota 11 corre para o leste pela beira do mar, com mato alto de um lado e penhasco do outro.']
},
rota12:{
  nome:'Rota 12', tipo:'rota', ambiente:'agua', nivel:27,
  conexoes:['rota11','lavender','rota13'],
  desc:['A Rota 12 é uma ponte de madeira de quatro quilômetros sobre água parada. Pescador em cada trinta metros.']
},
rota13:{
  nome:'Rota 13 / 14 / 15', tipo:'rota', ambiente:'campo', nivel:30,
  conexoes:['rota12','fuchsia'],
  desc:['As rotas do sudeste se emendam numa só coisa comprida, de cerca baixa e vento constante, indo para Fuchsia.']
},
celadon:{
  nome:'Celadon', tipo:'cidade', ambiente:'cidade', nivel:28, porte:'metrópole',
  conexoes:['rota7','rota16'],
  desc:[
    'Celadon é a maior cidade de Kanto e a única que não finge ser outra coisa.',
    'O shopping tem sete andares. O cassino tem três. A diferença entre os dois é menos clara do que deveria.'
  ],
  lugares:['centro','loja','cassino','shopping']
},
rota16:{
  nome:'Rota 16 / 17 / 18', tipo:'rota', ambiente:'campo', nivel:32,
  conexoes:['celadon','fuchsia'],
  desc:[
    'A ciclovia desce de Celadon até Fuchsia numa linha reta de dezenove quilômetros, com vento contra o dia inteiro.',
    'Motoqueiro usa isso como pista. Pedestre usa isso como problema.'
  ]
},
fuchsia:{
  nome:'Fuchsia', tipo:'cidade', ambiente:'campo', nivel:33, porte:'cidade',
  conexoes:['rota16','rota13','rota19'],
  desc:[
    'Fuchsia é uma cidade pequena que existe por causa de uma coisa grande: a Zona Safári tem nove mil hectares e trinta e um quilômetros de cerca.',
    'A cerca existe pra manter gente fora. Foi isso que te disseram.'
  ],
  lugares:['centro','loja','zona']
},

/* ─── SUL E MAR ─────────────────────────────────────────── */
rota19:{
  nome:'Rota 19 / 20', tipo:'rota', ambiente:'agua', nivel:36,
  conexoes:['fuchsia','seafoam','cinnabar'],
  desc:['O mar ao sul de Fuchsia é raso e cheio de gente boiando com Pokémon de Água. Depois fica fundo, rápido.']
},
seafoam:{
  nome:'Ilhas Seafoam', tipo:'especial', ambiente:'agua', nivel:40, perigosa:true,
  conexoes:['rota19'],
  desc:[
    'Duas formações de rocha branca furadas por dentro. A água entra por baixo e sai pelo outro lado.',
    'Nenhum pescador de Fuchsia vem aqui desde o inverno passado.'
  ]
},
cinnabar:{
  nome:'Ilha Cinnabar', tipo:'cidade', ambiente:'vulcao', nivel:38, porte:'ilha',
  conexoes:['rota19','rota21'],
  desc:[
    'Cinnabar é uma ilha com um vulcão no meio e um laboratório na beira. Os dois estão inativos.',
    'Os dois estão mentindo.'
  ],
  lugares:['centro','loja','laboratorio']
},
rota21:{
  nome:'Rota 21', tipo:'rota', ambiente:'agua', nivel:40,
  conexoes:['cinnabar','pallet'], oculto:true,   // travessia marítima: precisa descobrir que dá
  desc:[
    'A Rota 21 é litorânea, ventosa e quase vazia. Tem uma curva grande e, depois dela, uma cerca nova de três metros.',
    'Do lado de fora da cerca o mato é normal. Do lado de dentro, o mato é igual — exatamente igual, todos os arbustos à mesma distância.'
  ]
},

/* ─── OESTE E FIM ───────────────────────────────────────── */
rota23:{
  nome:'Rota 23', tipo:'rota', ambiente:'montanha', nivel:44, perigosa:true,
  conexoes:['rota22','caminho_vitoria'],
  desc:[
    'A Rota 23 é a última antes do Caminho da Vitória, e é patrulhada — ou era.',
    'Os postos de controle estão vazios há semanas.'
  ]
},
caminho_vitoria:{
  nome:'Caminho da Vitória', tipo:'rota', ambiente:'caverna', nivel:48, perigosa:true,
  conexoes:['rota23','planalto'],
  desc:['Quatro quilômetros de rocha subindo. Não tem trilha marcada, não tem placa e não tem ninguém.']
},
planalto:{
  nome:'Planalto Indigo', tipo:'especial', ambiente:'montanha', nivel:52,
  conexoes:['caminho_vitoria'],
  desc:[
    'Um complexo de pedra e vidro no alto de uma montanha, construído para intimidar.',
    'Funciona.'
  ],
  lugares:['centro']
},
norte:{
  nome:'Norte da Rota 10', tipo:'especial', ambiente:'montanha', nivel:55, perigosa:true,
  conexoes:['rota9'],
  oculto:true,
  desc:['Uma região que os mapas resolvem com a palavra "acidentado". Acima dela não tem mais nada desenhado.']
},
ilha_sem_nome:{
  nome:'A ilha sem nome', tipo:'especial', ambiente:'montanha', nivel:50, perigosa:true,
  conexoes:['fuchsia'],
  oculto:true,
  desc:['Pedra e mato. Nem água doce. Não entra em mapa nenhum porque não tem nada nela.']
}
};

/* ============================================================
   ESTADO DE MUNDO
   ============================================================ */
const Mundo = {
  atual(){ return LOCAIS[Estado.dados.local] || LOCAIS.pallet; },
  id(){ return Estado.dados.local; },

  iniciar(cidadeNatal){
    const mapa = {'Pallet':'pallet','Viridian':'viridian','Pewter':'pewter','Cerulean':'cerulean',
      'Vermilion':'vermilion','Lavender':'lavender','Celadon':'celadon','Fuchsia':'fuchsia',
      'Saffron':'saffron','Cinnabar':'cinnabar','Indigo':'viridian'};
    Estado.dados.local = mapa[cidadeNatal] || 'pallet';
    Estado.dados.visitados = {[Estado.dados.local]:true};
    Estado.dados.descobertas = {};
    Estado.dados.relogio.periodo = 'manhã';
  },

  visitado(id){ return !!(Estado.dados.visitados||{})[id]; },
  marcarVisitado(id){ (Estado.dados.visitados = Estado.dados.visitados || {})[id] = true; },

  /* ---------- tempo ---------- */
  passar(periodos=1){
    const d = Estado.dados.relogio;
    let i = PERIODOS.indexOf(d.periodo || 'manhã');
    for (let k=0;k<periodos;k++){
      i++;
      if (i >= PERIODOS.length){ i = 0; d.dia++; }
    }
    d.periodo = PERIODOS[i];
    return d;
  },

  /* ---------- descobertas ---------- */
  descobriu(chave){ return !!(Estado.dados.descobertas||{})[chave]; },
  descobrir(chave){ (Estado.dados.descobertas = Estado.dados.descobertas || {})[chave] = true; },

  /* ---------- vizinhos ---------- */
  vizinhos(){
    const L = this.atual();
    return (L.conexoes||[]).filter(id => {
      const v = LOCAIS[id];
      if (!v) return false;
      if (v.oculto && !this.descobriu('local_'+id)) return false;
      return true;
    });
  },

  viajar(id){
    if (!LOCAIS[id]) return null;
    Estado.dados.local = id;
    this.marcarVisitado(id);
    this.passar(1);
    Estado.registrar(`Viajou para ${LOCAIS[id].nome}.`);
    return LOCAIS[id];
  }
};

/* ============================================================
   AFAZERES — o que dá pra fazer onde você está
   Alguns aparecem só depois que você descobre que existem.
   ============================================================ */
function afazeresDoLocal(){
  const L = Mundo.atual();
  const id = Mundo.id();
  const d = Estado.dados;
  const lista = [];
  const tem = ch => Mundo.descobriu(ch);

  if (L.tipo === 'rota' || L.tipo === 'especial'){
    lista.push({id:'procurar', titulo:'Procurar Pokémon no mato',
      sub:'Andar devagar, prestar atenção no barulho, esperar alguma coisa se mexer.'});
    lista.push({id:'vasculhar', titulo:'Vasculhar a área',
      sub:'Olhar debaixo de coisa, seguir trilha que não é trilha, ver o que ninguém viu.'});
    lista.push({id:'treinar', titulo:'Treinar o time',
      sub:'Ficar aqui um período inteiro, repetindo. É assim que se fica bom.'});
    if (L.ambiente === 'agua') lista.push({id:'pescar', titulo:'Pescar',
      sub:'Sentar na beira e esperar. Demora, e às vezes vem coisa grande.'});
    lista.push({id:'acampar', titulo:'Acampar',
      sub:'Parar por um período. O time recupera um pouco e você também.'});
  }

  if (L.tipo === 'cidade'){
    lista.push({id:'andar', titulo:'Andar pela cidade',
      sub:'Sem destino. É andando sem destino que se encontra o que não está no mapa.'});
    lista.push({id:'conversar', titulo:'Conversar com os moradores',
      sub:'Gente de cidade pequena fala demais. Gente de cidade grande fala pouco e diz mais.'});
    if ((L.lugares||[]).includes('centro')){
      lista.push({id:'centro', titulo:'Centro Pokémon',
        sub:'Curar o time, dormir, usar o terminal.'});
      lista.push({id:'pc', titulo:'PC do Centro',
        sub: d.pc.length
          ? `Guardar e tirar Pokémon. Você tem ${d.pc.length} guardado${d.pc.length===1?'':'s'}.`
          : 'Guardar e tirar Pokémon. O cinto leva seis.'});
    }
    if ((L.lugares||[]).includes('loja') && tem('loja_'+id)) lista.push({id:'loja', titulo:'Loja',
      sub:'Comprar o que der pra pagar.'});
    if (tem('ginasio_'+id)) lista.push({id:'ginasio', titulo:'Ginásio',
      sub:'Você sabe onde fica. Não sabe o que tem dentro.'});
    if (tem('troca_'+id) && typeof TROCAS !== 'undefined' && TROCAS[id])
      lista.push({id:'troca', titulo:'Quem estava querendo trocar',
        sub: Trocas.jaFez(id) ? 'Já está feito. Dá pra passar e cumprimentar.' : TROCAS[id].onde});
  }

  if (id === 'planalto'){
    lista.push({id:'liga', titulo:'A ala dos quatro',
      sub:'Um corredor com quatro portas seguidas. Ninguém explica o que tem atrás delas.'});
    lista.push({id:'torneio', titulo:'Arena aberta',
      sub:'Tem chaveamento afixado na parede e inscrição no balcão. Qualquer um entra.'});
  }

  return lista;
}

/* segunda metade: coisas que só existem depois que você descobre */
function afazeresExtras(){ return []; }

/* ============================================================
   ONDE CADA CAPÍTULO ACONTECE
   O capítulo tem um lugar. Se você está em outro quando ele
   começa, a estrada entre os dois existe e tem que ser contada —
   senão o jogo te teleporta de Vermilion para Viridian e o
   cabeçalho muda de cidade sem ninguém sair do lugar.
   ============================================================ */
const LOCAL_DO_CAPITULO = {
  1:null,              /* onde você mora */
  2:'viridian',   3:'floresta',  4:'pewter',    5:'monte_lua',
  6:'cerulean',   7:'lavender',  8:'vermilion', 9:'celadon',
  10:'usina',    11:'saffron',  12:'fuchsia',  13:'cinnabar',
  14:'rota21',   15:'rota16',   16:'seafoam',  17:'celadon',
  18:'saffron',  19:'fuchsia',  20:'saffron',  21:'planalto',
  22:'norte',    23:'pallet'
};

function localDoCapitulo(n){
  const id = LOCAL_DO_CAPITULO[n];
  if (id === null || id === undefined){
    const mapa = {'Pallet':'pallet','Viridian':'viridian','Pewter':'pewter','Cerulean':'cerulean',
      'Vermilion':'vermilion','Lavender':'lavender','Celadon':'celadon','Fuchsia':'fuchsia',
      'Saffron':'saffron','Cinnabar':'cinnabar','Indigo':'planalto'};
    return mapa[Estado.dados.jogador.cidade] || 'pallet';
  }
  return id;
}

/* Caminho mais curto pelo mapa de verdade, em número de trechos.
   Serve para saber quantos dias a viagem come. */
function distanciaEntre(de, para){
  if (de === para) return 0;
  const visto = new Set([de]);
  let borda = [de], passos = 0;
  while (borda.length && passos < 30){
    passos++;
    const prox = [];
    for (const id of borda)
      for (const v of ((LOCAIS[id] || {}).conexoes || [])){
        if (v === para) return passos;
        if (!visto.has(v)){ visto.add(v); prox.push(v); }
      }
    borda = prox;
  }
  return 4;   /* lugares sem estrada ligando: o trajeto é longo e é isso */
}
