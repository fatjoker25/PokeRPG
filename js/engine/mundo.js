/* ============================================================
   O MUNDO
   Kanto como lugar, não como corredor. Você decide para onde
   vai, quando vai, e o que faz enquanto está lá.
   ============================================================ */

/* Está numa luta agora? O modo da tela não diz (a luta abre por cima
   do mapa ou da cena); quem diz é a própria batalha. */
function emLuta(){ return typeof Batalha !== 'undefined' && !!Batalha.ativo; }

const PERIODOS = ['madrugada','manhã','tarde','noite'];
const INICIO_PERIODO = {madrugada:0, 'manhã':6, tarde:12, noite:18};
function periodoDaHora(h){ return PERIODOS[Math.floor(((h % 24) + 24) % 24 / 6)]; }
/* save antigo (ou cena que mexeu no período à mão): a hora acompanha */
function sincronizarHora(r){
  if (!r) return;
  if (r.hora == null || periodoDaHora(r.hora) !== r.periodo)
    r.hora = (INICIO_PERIODO[r.periodo || 'manhã'] || 6) + 2;
}
function ehNoite(){
  const r = Estado.dados && Estado.dados.relogio;
  if (!r) return false;
  sincronizarHora(r);
  return r.hora >= 18 || r.hora < 6;
}
const Relogio = {
  MS_POR_HORA: 60000,
  avancar(h){
    const r = Estado.dados.relogio;
    sincronizarHora(r);
    r.hora += h;
    while (r.hora >= 24){ r.hora -= 24; r.dia++; }
    r.periodo = periodoDaHora(r.hora);
    if (typeof Fome !== 'undefined') Fome.passar();
    /* hora que pula (acampar, viajar) zera os minutos e a luz acompanha */
    if (h !== 1 || !this._t) this._marca = Date.now();
    if (typeof Luz !== 'undefined') Luz.aplicar();
  },
  /* um minuto aberto é uma hora; fora de foco e no meio da luta, para.
     Entre uma hora e outra o relógio conta os minutos de verdade (um
     segundo real, um minuto de Kanto), e a luz anda junto com ele. */
  _marca: 0, _parado: 0,
  iniciar(){
    if (this._t) return;
    this._marca = Date.now();
    const PASSO = 5000;
    this._t = setInterval(() => {
      const d = Estado.dados;
      const parado = (typeof document !== 'undefined' && document.hidden) || !d || !d.relogio || emLuta();
      /* parado, o relógio não anda: a marca empurra junto */
      if (parado){ this._marca += PASSO; return; }
      if (Date.now() - this._marca >= this.MS_POR_HORA){
        this._marca += this.MS_POR_HORA;
        this.avancar(1);
      }
      if (typeof UI !== 'undefined' && UI.pintarRelogio) UI.pintarRelogio();
      Luz.aplicar();
    }, PASSO);
  },
  /* minutos passados da hora cheia, pelo relógio de verdade */
  minutos(){
    if (!this._t || !this._marca) return 0;
    return Math.max(0, Math.min(59, Math.floor((Date.now() - this._marca) / this.MS_POR_HORA * 60)));
  },
  /* Sem Relógio na mochila você sabe o que o céu diz: manhã, tarde,
     noite, madrugada. Hora e data só pra quem comprou um. */
  tem(){ return typeof Estado !== 'undefined' && Estado.contaItem && Estado.contaItem('Relógio') > 0; },
  texto(){
    const r = Estado.dados.relogio; sincronizarHora(r);
    if (!this.tem()) return r.periodo;
    const c = Calendario.de(r.dia);
    return `${c.semanaCurta}, ${c.diaMes} de ${c.mesNome} · ${String(r.hora).padStart(2, '0')}:${String(this.minutos()).padStart(2, '0')}`;
  },
  /* o cabeçalho do lugar: o mesmo, por extenso */
  cabecalho(){
    const r = Estado.dados.relogio; sincronizarHora(r);
    if (!this.tem()) return r.periodo;
    const c = Calendario.de(r.dia);
    return `${c.semana}, ${c.diaMes} de ${c.mesNome} · ${String(r.hora).padStart(2, '0')}:${String(this.minutos()).padStart(2, '0')}`;
  }
};

/* ============================================================
   LUZ — o céu do cenário segue o relógio
   A cor que multiplica o cenário (da página e da arena) e o quanto
   ele escurece saem da hora com os minutos, interpolados entre os
   pontos abaixo. Caverna e ginásio não têm céu e não mudam.
   ============================================================ */
const LUZ_DO_DIA = [
  /* hora, cor que multiplica (r,g,b), brilho */
  [0,  [ 92, 112, 190], .62],
  [4,  [ 98, 116, 192], .64],
  [5.5,[210, 160, 170], .80],
  [7,  [255, 214, 186], .94],
  [9,  [255, 255, 255], 1],
  [16, [255, 255, 255], 1],
  [17.5,[255, 196, 140], .95],
  [19, [196, 128, 150], .80],
  [20.5,[ 98, 116, 192], .66],
  [24, [ 92, 112, 190], .62]
];
const Luz = {
  agora(){
    const r = Estado.dados && Estado.dados.relogio;
    if (!r) return null;
    sincronizarHora(r);
    return r.hora + Relogio.minutos() / 60;
  },
  /* cor e brilho na hora h (0–24) */
  em(h){
    let i = 0;
    while (i < LUZ_DO_DIA.length - 2 && LUZ_DO_DIA[i + 1][0] <= h) i++;
    const [h0, c0, b0] = LUZ_DO_DIA[i], [h1, c1, b1] = LUZ_DO_DIA[i + 1];
    const k = h1 > h0 ? Math.max(0, Math.min(1, (h - h0) / (h1 - h0))) : 0;
    const cor = c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
    return {cor, brilho: +(b0 + (b1 - b0) * k).toFixed(3)};
  },
  aplicar(){
    if (typeof document === 'undefined' || !document.documentElement) return;
    const h = this.agora();
    if (h == null) return;
    const l = this.em(h);
    const raiz = document.documentElement.style;
    raiz.setProperty('--luz-cor', `rgb(${l.cor.join(',')})`);
    raiz.setProperty('--luz-brilho', l.brilho);
  }
};

/* ============================================================
   CALENDÁRIO — o dia 1 da jornada é uma segunda, 1º de março.
   Mês com o tamanho de verdade; a semana anda junto. Quem marca
   coisa no mural marca por dia do mês ou por dia da semana.
   ============================================================ */
const Calendario = {
  /* A jornada começa no dia em que a perua do laboratório passa pela
     sua cidade (DIA_DA_PERUA, em agenda.js): é o dia da entrega no
     capítulo 1. Pallet, dia 1. Fica guardado no relógio. */
  inicio(){
    const d = typeof Estado !== 'undefined' && Estado.dados;
    if (!d || !d.relogio) return 1;
    if (d.relogio.inicio == null){
      const nome = d.jogador && d.jogador.cidade;
      const id = Object.keys(LOCAIS).find(k => LOCAIS[k].nome === nome);
      d.relogio.inicio = (typeof DIA_DA_PERUA !== 'undefined' && DIA_DA_PERUA[id]) || 1;
    }
    return d.relogio.inicio;
  },
  MESES: ['março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro','janeiro','fevereiro'],
  DIAS:  [31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31, 28],
  SEMANA: ['segunda','terça','quarta','quinta','sexta','sábado','domingo'],
  SEMANA_CURTA: ['seg','ter','qua','qui','sex','sáb','dom'],
  /* `dia` é o dia da jornada; a data conta a partir de 1º de março,
     uma segunda, somando o dia em que a jornada começou */
  de(dia){
    const abs = Math.max(1, dia || 1) - 1 + this.inicio() - 1;
    let resto = abs, m = 0;
    while (resto >= this.DIAS[m % 12]){ resto -= this.DIAS[m % 12]; m++; }
    const s = abs % 7;
    /* m conta meses desde março de 2010: janeiro vira o ano */
    const ano = (typeof ANO_DO_JOGO !== 'undefined' ? ANO_DO_JOGO : 2010) + Math.floor((m + 2) / 12);
    return {diaMes: resto + 1, mes: m % 12, mesNome: this.MESES[m % 12], ano,
            semanaIdx: s, semana: this.SEMANA[s], semanaCurta: this.SEMANA_CURTA[s]};
  },
  hoje(){ return this.de(Estado.dados.relogio.dia); },
  diaDoMes(){ return this.hoje().diaMes; },
  diaDaSemana(){ return this.hoje().semana; }
};

const LOCAIS = {

/* ─── SUDOESTE ──────────────────────────────────────────── */
pallet:{
  nome:'Pallet', tipo:'cidade', ambiente:'campo', nivel:3, porte:'vilarejo',
  conexoes:['rota1','rota21'],
  desc:[
    'Pallet tem três ruas, o laboratório do Professor no alto da subida e um cheiro de mar que vem de longe, do outro lado do morro.',
    'Todo mundo aqui conhece o seu rosto desde antes de você ter memória.'
  ],
  lugares:['casa']
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
    d=>['Pallet','Viridian'].includes(d.jogador.cidade)
      ? 'Viridian tem prédio de dois andares e semáforo. Para quem vem de Pallet, isso é uma metrópole.'
      : `Viridian tem prédio de dois andares e semáforo. Pra quem cresceu em ${d.jogador.cidade}, é uma cidade que ainda não terminou de crescer.`,
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
    Estado.dados.relogio.hora = 7;
  },

  visitado(id){ return !!(Estado.dados.visitados||{})[id]; },
  marcarVisitado(id){ (Estado.dados.visitados = Estado.dados.visitados || {})[id] = true; },

  /* ---------- tempo ----------
     O relógio tem hora (0–23). Um minuto de jogo aberto é uma hora
     (Relogio.iniciar), e fazer coisa leva o dia pro próximo período.
     O período sai da hora: madrugada 0–5, manhã 6–11, tarde 12–17,
     noite 18–23. */
  passar(periodos=1){
    const d = Estado.dados.relogio;
    sincronizarHora(d);
    for (let k = 0; k < periodos; k++){
      const prox = (Math.floor(d.hora / 6) + 1) * 6;   // começo do próximo período
      Relogio.avancar(prox - d.hora);
    }
    return d;
  },
  passarHoras(h){ sincronizarHora(Estado.dados.relogio); Relogio.avancar(h); return Estado.dados.relogio; },

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
/* ============================================================
   COMO O LUGAR TE RECEBE
   A mesma cidade não recebe do mesmo jeito quem chegou ontem e
   quem já resolveu três coisas aqui. Uma linha, no alto da tela,
   que muda com reputação, crachá e quantas vezes você já veio.
   ============================================================ */
/* O jeito que o lugar te recebe aparece uma vez por lugar e por fama:
   na primeira vez que você chega lá sendo quem você é agora. Repetir a
   mesma frase a cada volta ao mapa virava papagaio. */
function comoOlugarTeRecebe(){
  const frase = recepcaoDoLugar();
  if (!frase) return null;
  const d = Estado.dados;
  d.recepcoes = d.recepcoes || {};
  const id = Mundo.id();
  if (d.recepcoes[id] === frase) return null;
  d.recepcoes[id] = frase;
  return frase;
}

function recepcaoDoLugar(){
  const d = Estado.dados;
  const L = Mundo.atual();
  const id = Mundo.id();
  const r = Estado.rep;
  const vezes = (d.visitados[id] && d.visitados[id].vezes) || 0;
  const cidade = L.tipo === 'cidade';
  const cargo = (typeof Cargos !== 'undefined') ? Cargos.principal() : null;

  /* má fama fala mais alto que qualquer crachá */
  if (r.eixo === 'ruim' && r.ruim >= 4)
    return cidade
      ? 'Duas pessoas mudam de calçada quando você passa. Não é medo — é a economia de quem não quer ser visto perto de você.'
      : 'Um grupo que vinha na sua direção sai da trilha e passa pelo capim, e nenhum deles olha pra você.';
  if (r.eixo === 'ruim' && r.ruim >= 2)
    return cidade
      ? 'Ninguém te trata mal. Só te tratam com um cuidado a mais do que o normal, e cuidado a mais é uma informação.'
      : 'Quem cruza com você na trilha cumprimenta rápido demais e segue.';

  /* crachá pesado muda o tratamento antes da reputação */
  if (cargo && cargo.peso >= 5 && cidade)
    return `Alguém te reconhece pelo cargo antes de reconhecer pelo rosto, e a frase que sai é sempre a mesma: "{o senhor|a senhora} é {o|a} de…" e aí a pessoa não sabe como terminar.`;
  if (cargo && cargo.peso >= 3 && cidade && Cargos.temBeneficio('guarita'))
    return 'O guarda da esquina te vê, confere o crachá de longe e volta pro que estava fazendo. Isso é o que passagem faz: te torna sem graça.';

  if (r.eixo === 'bom' && r.bom >= 4)
    return cidade
      ? 'Duas pessoas te cumprimentam pelo nome e você não conhece nenhuma das duas. Kanto é pequena e fala.'
      : 'Um casal com mochila te reconhece na trilha e pede uma foto, o que é constrangedor no melhor sentido possível.';
  if (r.eixo === 'bom' && r.bom >= 2 && cidade)
    return 'Alguém no balcão acha que já te viu em algum lugar e não lembra onde.';

  if (cidade && vezes >= 3)
    return 'Você já sabe onde ficam as coisas aqui, o que muda o jeito de andar: mais devagar, menos olhando pra cima.';
  return null;
}

function afazeresDoLocal(){
  const L = Mundo.atual();
  const id = Mundo.id();
  const d = Estado.dados;
  const lista = [];
  const tem = ch => Mundo.descobriu(ch);

  if (L.tipo === 'rota' || L.tipo === 'especial'){
    lista.push({id:'procurar', titulo:Arenas.terreno(L.ambiente).procurar,
      sub:'Andar devagar, prestar atenção no barulho, esperar um Pokémon se mexer.'});
    /* gente treinando na rota: some quando você vence todos do
       escalão, e volta quando você sobe de escalão */
    if (typeof Estrada !== 'undefined' && Estrada.pendentes(id).length)
      lista.push({id:'desafiar', titulo:'Ir atrás de quem está treinando aqui',
        sub:'Na estrada, quem cruza o olhar luta. Quem perde paga.'});
    lista.push({id:'vasculhar', titulo:'Vasculhar a área',
      sub:'Olhar debaixo de coisa, seguir trilha que não é trilha, ver o que ninguém viu.'});
    lista.push({id:'treinar', titulo:'Treinar o time — 1 Ração',
      sub:'Ficar aqui um período inteiro, repetindo. É assim que se fica bom.'});
    if (L.ambiente === 'agua') lista.push({id:'pescar', titulo:'Pescar',
      sub:'Sentar na beira e esperar. Demora, e às vezes vem coisa grande.'});
    lista.push({id:'acampar', titulo:'Acampar — 1 Ração',
      sub:'Parar por um período. O time recupera um pouco e você também.'});
    /* gente de estrada também troca — quem está de passagem, esperando
       balsa, de folga, no fim do turno. */
    if (tem('troca_'+id) && typeof Trocas !== 'undefined' && Trocas.lista(id).length){
      const abertas = Trocas.disponiveis(id);
      lista.push({id:'troca',
        titulo: abertas.length ? 'Tem alguém aqui querendo trocar' : 'Quem estava querendo trocar',
        sub: abertas.length ? abertas[0].onde : 'Já está feito.'});
    }
  }

  if (L.tipo === 'cidade'){
    lista.push({id:'andar', titulo:'Andar pela cidade',
      sub:'Sem destino. É andando sem destino que se encontra o que não está no mapa.'});
    lista.push({id:'conversar', titulo:'Conversar com os moradores',
      sub:'Gente de cidade pequena fala demais. Gente de cidade grande fala pouco e diz mais.'});
    if ((L.lugares||[]).includes('centro')){
      /* O Centro é uma porta só: lá dentro tem a enfermeira, o PC, o
         balcão de credenciais, o mapa na parede e o mural. */
      lista.push({lugar:true, id:'centro', titulo:'Centro Pokémon',
        sub:'Enfermeira, PC, balcão de credenciais, mapa na parede e mural de recados.'});
    }
    /* a sua casa, na cidade em que você nasceu: cama, comida e
       {casa:quem ficou|quem ficou} esperando */
    if (Estado.j && L.nome === Estado.j.cidade)
      lista.push({lugar:true, id:'casa', titulo:'Sua casa'});
    /* quem nasceu longe de Viridian pode pegar o ônibus da Liga uma vez */
    if (Estado.j && L.nome === Estado.j.cidade && !['Pallet','Viridian'].includes(Estado.j.cidade)
        && !d.flags.onibus_da_liga && d.capitulo <= 3)
      lista.push({lugar:true, id:'onibus', titulo:'Rodoviária — ônibus da Liga pra Viridian'});
    /* credencial se pega no lugar dela, não no Centro */
    if (typeof Cargos !== 'undefined') Cargos.lugaresEm(id).forEach((x, i) =>
      lista.push({lugar:true, id:'posto_' + i, titulo:x.lugar}));
    if ((L.lugares||[]).includes('loja') && tem('loja_'+id)) lista.push({lugar:true, id:'loja', titulo:'Loja',
      sub:'Comprar o que der pra pagar.'});
    /* o Relembrador não tem placa: quem acha é quem anda pela cidade */
    if (RELEMBRADOR[id] && tem('relembrar_'+id)) lista.push({lugar:true, id:'relembrar', titulo:'Relembrador de Golpes',
      sub:RELEMBRADOR[id].sub});
    /* o que precisa de dinheiro na cidade só aparece pra quem já andou por ela */
    if (tem('andou_'+id) && typeof Cidade !== 'undefined' && Cidade.causas && Cidade.causas().length)
      lista.push({lugar:true, id:'doar', titulo:'Tem uma coisa aqui que falta dinheiro',
        sub:'E você tem dinheiro.'});
    if (tem('ginasio_'+id)) lista.push({lugar:true, id:'ginasio', titulo:'Ginásio',
      sub:'Você sabe onde fica. Não sabe o que tem dentro.'});
    /* (a troca de cidade é montada aqui; a de rota, no bloco de rota) */
    if (tem('troca_'+id) && typeof Trocas !== 'undefined' && Trocas.lista(id).length){
      const abertas = Trocas.disponiveis(id);
      lista.push({id:'troca',
        titulo: abertas.length > 1 ? `Quem está querendo trocar (${abertas.length})`
              : abertas.length ? 'Tem alguém aqui querendo trocar' : 'Quem estava querendo trocar',
        sub: abertas.length ? abertas[0].onde : 'Já está feito. Dá pra passar e cumprimentar.'});
    }
  }

  if (id === 'planalto'){
    lista.push({lugar:true, id:'relembrar', titulo:'Relembrador de Golpes', sub:RELEMBRADOR.planalto.sub});
    lista.push({lugar:true, id:'liga', titulo:'A ala dos quatro',
      sub:'Um corredor com quatro portas seguidas. Ninguém explica o que tem atrás delas.'});
    lista.push({lugar:true, id:'torneio', titulo:'Arena aberta',
      sub:'Tem chaveamento afixado na parede e inscrição no balcão. Qualquer um entra.'});
  }

  /* revanche marcada pelo PokéNav: a pessoa está aqui esperando */
  for (const [cid, r] of Object.entries(Estado.dados.revanches || {})){
    if (r.local !== id || typeof contatoPorId !== 'function') continue;
    const c = contatoPorId(cid);
    if (c) lista.push({id:'rev_' + cid, titulo:`Procurar ${nomeDaRevanche(c)}`, sub:'Revanche marcada.'});
  }

  /* veteranos: quem mora aqui e o convite que um deles te fez */
  if (typeof Veteranos !== 'undefined') Veteranos.afazeres(id).forEach(x => lista.push(x));
  /* quem fecha o caminho que a sua escolha fechou */
  if (typeof Barreiras !== 'undefined') Barreiras.afazeres(id).forEach(x => lista.push(x));
  /* porta que a idade abre (ou mostra fechada) */
  if (typeof PortasDaIdade !== 'undefined') PortasDaIdade.afazeres(id).forEach(x => lista.push(x));
  /* o laboratório de Cinnabar e o balcão de prêmios do cassino */
  if (typeof Laboratorio !== 'undefined') Laboratorio.afazeres(id).forEach(x => lista.push(x));
  /* o que tem dia e hora marcados, se for agora */
  if (typeof Agenda !== 'undefined') Agenda.afazeres(id).forEach(x => lista.push(x));
  /* deixar o tempo passar: é assim que se chega na hora marcada */
  lista.push({id:'esperar', titulo:'Esperar a hora passar'});
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
  18:'saffron',  19:'fuchsia',  20:'saffron',
  21:null,       22:'planalto', 23:'viridian', 24:'rota23', 25:'saffron',
  26:'planalto', 27:'norte',    28:'pallet'
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

/* "na Rota 1", "no Monte da Lua", "nas Ilhas Seafoam", "em Celadon": a preposição
   concorda com o nome do lugar, que o texto não sabe de antemão. */
function emLocal(id){
  const L = LOCAIS[id]; if (!L) return 'na estrada';
  const n = L.nome;
  if (/^Ilha /.test(n)) return 'na ' + n;
  if (L.tipo === 'cidade') return 'em ' + n;   // em Celadon, em Pallet
  if (/^(Ilhas)\b/.test(n)) return 'nas ' + n;
  if (/^(Monte|Túnel|Caminho|Planalto|Norte)\b/.test(n)) return 'no ' + n;
  if (/^A /.test(n)) return 'n' + n.charAt(0).toLowerCase() + n.slice(1);
  return 'na ' + n;
}

/* Caminho mais curto pelo mapa de verdade, em número de trechos.
   Serve para saber quantos dias a viagem come. */
/* O caminho inteiro, e não só quantos passos ele tem. Sem isso a
   viagem é um número; com isso o jogador atravessa os lugares. */
function caminhoEntre(de, para){
  if (de === para) return [de];
  const veioDe = {[de]:null};
  let borda = [de];
  while (borda.length){
    const prox = [];
    for (const id of borda)
      for (const v of ((LOCAIS[id] || {}).conexoes || [])){
        if (veioDe[v] !== undefined) continue;
        veioDe[v] = id;
        if (v === para){
          const rota = [v];
          let cur = id;
          while (cur){ rota.unshift(cur); cur = veioDe[cur]; }
          return rota;
        }
        prox.push(v);
      }
    borda = prox;
  }
  return null;   /* lugar sem estrada ligando: quem chega lá chega pela história */
}

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
