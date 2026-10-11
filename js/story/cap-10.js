/* ------------------------------------------------------------
   ABERTURAS — a usina zumbe pra todo mundo, mas nem todo mundo
   chega na Rota 10 pelo mesmo motivo nem no mesmo estado.
   ------------------------------------------------------------ */
const C10_ABERTURAS = ['c10_rota', 'c10_ab_apagao', 'c10_ab_o_operador', 'c10_ab_o_aparelho', 'c10_ab_de_cracha'];
function c10_cabe(id, d){
  if (id === 'c10_ab_o_aparelho') return !!(d.pokenav && d.pokenav.tem);
  if (id === 'c10_ab_de_cracha')  return typeof Cargos !== 'undefined' && !!Cargos.doCracha();
  return true;
}
function c10_abertura(d){
  const cand = C10_ABERTURAS.filter(id => c10_cabe(id, d));
  return Dados.escolher(cand);
}

/* Quem conhece a usina por dentro é o homem do boné, no açude. O nome
   ele diz quando senta com você, quando você volta a ele ou quando ele
   espera no portão (NOMES_FIXOS); antes disso o balão chama pelo boné. */
const C10_EDRIC = 'o homem do boné';
function c10_proEdric(){ return Nomes.sabe(C10_EDRIC) ? 'pro Sr. Edric' : 'pro homem do boné'; }
/* já pisou do lado de dentro da cerca */
function c10_jaEntrou(d){
  const f = d.flags;
  return !!(f.entrou_na_usina || f.entrou_pelo_buraco || f.viu_a_subestacao || f.entrou_no_galpao);
}
/* Onde você está lá dentro: galpão, subestação, pátio ou portão. A cena
   que serve a mais de um lugar (sair, a luta, a captura) lê daqui. */
function c10_estar(onde){ return d => { d.flags.c10_onde = onde; return []; }; }
function c10_naSubestacao(d){ return d.flags.c10_onde === 'subestacao'; }
/* quem espera no portão quando você sai */
function c10_quemEspera(d){
  if (d.flags.eloi_no_portao) return 'edric';
  const via = Historia.via();
  if (via === 'mercenario' || via === 'foragido') return 'van';
  if (via === 'pesquisador') return 'cordell';
  if (via === 'heroi') return 'cerulean';
  return 'edric';
}
/* pula o relógio até a próxima vez que der essa hora */
function c10_ate(h){ Relogio.ate(h); }
/* a lanterna de cabeça que o acampamento do túnel dá */
function c10_lanterna(){ return Estado.contaItem('Lanterna de cabeça') > 0; }
/* O caminho de volta pro homem do boné: quem já viu ele vai direto; quem
   não viu procura alguém que conheça a usina. */
function c10_voltarAoEdric(texto){
  return [
    {texto:() => `${texto} ${c10_proEdric()}.`, vai:'c10_de_volta_ao_acude', cond:d => !!d.flags.conheceu_eloi},
    {texto:'Procurar alguém na rota que conheça a usina.', vai:'c10_quem_sabe', cond:d => !d.flags.conheceu_eloi}
  ];
}

/* ============================================================
   CAPÍTULO 10 — O ZUMBIDO  (Usina Abandonada / Rota 10)
   ============================================================ */
CAPITULOS.push(
{
num:10, titulo:'O Zumbido', local:'Usina Abandonada — Rota 10', ambiente:'ruina', nivelArea:34,
tom:'sombrio', entradas:C10_ABERTURAS,
inicio: d => c10_abertura(d),
cenas:{

c10_ab_apagao:{
  texto:[
    'Tem um povoado na Rota 10 que não tem nome em mapa nenhum. Onze casas, um armazém e um poste de luz com três lâmpadas.',
    'Você chega às sete da noite e as três lâmpadas estão apagadas, e as onze casas também, e não tem lua.',
    'O armazém está aberto à luz de dois lampiões e tem sete pessoas lá dentro que não estão comprando nada. Estão esperando voltar.',
    fala('a dona do armazém', 'Quarta vez essa semana.'),
    d=>fala(d.jogador.nome, 'Quatro vezes em uma semana?'),
    fala('a dona do armazém', 'Quatro. E olha que a semana não acabou.'),
    'Um homem no fundo, que está bebendo alguma coisa em copo de vidro grosso, fala sem levantar a cabeça:',
    fala('o homem do copo', 'A companhia fala que é a linha velha.'),
    fala('a dona do armazém', 'A companhia fala isso há anos.'),
    'Ela acende o terceiro lampião com um fósforo e a luz sobe na cara dela.',
    fala('a dona do armazém', 'Só que quando apaga aqui, apaga em todo o vale ao mesmo tempo. E quando volta, volta em todo o vale ao mesmo tempo.'),
    fala('a dona do armazém', 'Linha velha não faz isso. Linha velha queima num ponto só.')
  ],
  ef:{flag:'quatro_apagoes_na_semana',
      executar:d=>{ c10_ate(19); return []; },
      registrar:'O vale da Rota 10 teve quatro apagões em uma semana, todos simultâneos no vale inteiro.',
      presagio:'Falha de linha queima num ponto. Isso é o vale inteiro desligando junto.'},
  escolhas:[
    {texto:'Perguntar quando a luz volta.', vai:'c10_ab_quando_volta'},
    {texto:'Perguntar se alguém entra na usina.', vai:'c10_quem_sabe'},
    {texto:'Sair e ir pra usina agora, no escuro.', vai:'c10_rota'},
    {texto:'Dormir aqui e ir pela manhã.', vai:'c10_ab_dormiu'}
  ]
},

c10_ab_quando_volta:{
  texto:[
    fala('a dona do armazém', 'Umas quatro da manhã.'),
    d=>fala(d.jogador.nome, 'Sempre?'),
    'Ela para de mexer no lampião.',
    fala('a dona do armazém', 'Nas quatro vezes foi quatro e pouco.'),
    'O homem do copo levanta a cabeça pela primeira vez.',
    fala('o homem do copo', 'Três e cinquenta e dois, quatro e onze, três e quarenta e sete, quatro e dois.'),
    'A dona do armazém olha pra ele.',
    fala('a dona do armazém', 'Você anotou?'),
    fala('o homem do copo', 'Eu não durmo, dona. Eu só olho o relógio.', 'baixo')
  ],
  ef:{flag:'a_luz_volta_as_quatro',
      npc:{nome:'o homem do copo', opiniao:0, viuVoce:'Te contou os quatro horários de cabeça.'},
      registrar:'A luz volta sempre entre 3h47 e 4h11. O homem do copo anotou os quatro horários.'},
  escolhas:[
    {texto:'Ir pra usina agora, no escuro.', vai:'c10_rota'},
    {texto:'Dormir aqui e ir pela manhã.', vai:'c10_ab_dormiu'},
    {texto:'Perguntar quem conhece a usina por dentro.', vai:'c10_quem_sabe'}
  ]
},

c10_ab_dormiu:{
  texto:[
    'A dona do armazém tem um quarto de depósito com um colchão encostado na parede, e ela desencosta o colchão sem te cobrar nada e sem te perguntar nada.',
    'Você acorda às quatro e onze da manhã porque a lâmpada do corredor acende sozinha na sua cara.',
    'O vale inteiro volta junto. Dá pra ouvir: onze geladeiras religando ao mesmo tempo, um rádio que ficou ligado, o zumbido do poste.',
    'E, atrás de tudo isso, de muito longe, uma coisa grande desacelerando.',
    'É o som de um motor enorme reduzindo. Dura uns quarenta segundos e some.',
    'Você fica deitad{o|a} no escuro com os olhos abertos até clarear.'
  ],
  ef:{flag:'ouviu_o_motor_desacelerar',
      executar:d=>{ c10_ate(6); return []; },
      registrar:'Às 4h11, quando a luz voltou, algo grande desacelerou no fundo do vale por quarenta segundos.'},
  escolhas:[
    {texto:'Ir pra usina de manhã.', vai:'c10_rota'}
  ]
},

c10_ab_o_operador:{
  texto:[
    'Na curva antes do vale tem uma casa de alvenaria sem reboco com um quintal de terra batida e um homem de uns setenta anos sentado numa cadeira de praça — dessas de ferro fundido, que alguém claramente levou de uma praça.',
    'A caixa de correio do portão diz LARCH em letra de adesivo de papelaria.',
    'Ele te vê subir e fala antes de você chegar:',
    fala('Sr. Larch', 'Você vai pra usina.'),
    d=>fala(d.jogador.nome, 'Como é que você sabe?'),
    fala('Sr. Larch', 'Porque essa estrada não vai pra mais lugar nenhum.'),
    'Ele aponta a cadeira vazia do lado, que também é de praça, e que também claramente foi levada de uma praça.',
    'Você senta porque não sentar seria pior.',
    'Da cadeira dá pra ver o fundo do vale: quatro chaminés, um galpão comprido e uma cerca de alambrado com o arame farpado de cima virado pra dentro.',
    fala('Sr. Larch', 'Eu trabalhei lá dentro por vinte e seis anos. Operador de sala de controle.'),
    fala('Sr. Larch', 'Fecharam em oitenta e nove. Pagaram todo mundo direitinho, com carta e tudo.'),
    fala('Sr. Larch', 'Só que ninguém desmontou nada.', 'baixo')
  ],
  ef:{flag:'conheceu_o_operador',
      npc:{nome:'Sr. Larch', opiniao:1, viuVoce:'Trabalhou 26 anos na usina e te chamou pra sentar.'},
      registrar:'Um ex-operador da usina mora na curva antes do vale.'},
  escolhas:[
    {texto:'Perguntar por que não desmontaram.', vai:'c10_ab_por_que_nao'},
    {texto:'Perguntar o que tem na sala de controle.', vai:'c10_ab_a_sala'},
    {texto:'Perguntar do arame inclinado pra dentro.', vai:'c10_ab_o_arame'},
    {texto:'Agradecer e seguir pra usina.', vai:'c10_rota'}
  ]
},

c10_ab_por_que_nao:{
  texto:[
    fala('Sr. Larch', 'Porque desmontar custa mais que deixar.'),
    'Ele diz isso como quem já explicou pra muita gente.',
    fala('Sr. Larch', 'Pra desmontar, você tem que drenar o óleo dos transformadores, tirar o cobre, levar a turbina de caminhão.'),
    fala('Sr. Larch', 'Pra deixar, você tranca o portão.'),
    d=>fala(d.jogador.nome, 'E o zumbido?'),
    'Ele não responde na hora. Mexe na cadeira, que range.',
    fala('Sr. Larch', 'Uma usina desligada não zumbe, {menino|menina}.'),
    fala('Sr. Larch', 'Eu escuto esse zumbido da minha varanda faz sete anos. Não escutava nos quatro primeiros.')
  ],
  ef:{flag:'zumbido_ha_sete_anos',
      registrar:'A usina está desligada há onze anos, mas zumbe há sete.'},
  escolhas:[
    {texto:'Perguntar o que tem na sala de controle.', vai:'c10_ab_a_sala'},
    {texto:'Perguntar do arame inclinado pra dentro.', vai:'c10_ab_o_arame'},
    {texto:'Seguir pra usina.', vai:'c10_rota'}
  ]
},

c10_ab_a_sala:{
  texto:[
    fala('Sr. Larch', 'Painel sinótico do vale inteiro. Uma parede de doze metros com lampadinha pra cada subestação.'),
    'Ele desenha no ar com o dedo, e o desenho é preciso, e ele não pensa antes de desenhar.',
    fala('Sr. Larch', 'Se acender a lampadinha, tem carga. Se apagar, não tem.'),
    fala('Sr. Larch', 'A gente ficava oito horas olhando pra parede. Oito horas, doze metros de lâmpada.'),
    d=>fala(d.jogador.nome, 'E hoje?'),
    'Ele fica quieto uns cinco segundos.',
    fala('Sr. Larch', 'Eu fui lá em noventa e quatro. Pulei a cerca, que naquela época dava pra pular.'),
    fala('Sr. Larch', 'A parede tava acesa.'),
    fala('Sr. Larch', 'Toda acesa. Doze metros. Numa usina sem energia há cinco anos.', 'baixo')
  ],
  ef:{flag:'o_painel_aceso',
      registrar:'Em 1994 o painel sinótico da sala de controle estava todo aceso, numa usina sem energia.',
      presagio:'Painel aceso quer dizer que as subestações do vale estão recebendo carga de algum lugar.'},
  escolhas:[
    {texto:'Perguntar do arame inclinado pra dentro.', vai:'c10_ab_o_arame'},
    {texto:'Seguir pra usina.', vai:'c10_rota'}
  ]
},

c10_ab_o_arame:{
  texto:[
    d=>fala(d.jogador.nome, 'O arame farpado da cerca é inclinado pra dentro.'),
    'Ele para de balançar a cadeira.',
    fala('Sr. Larch', 'Você já foi lá?'),
    d=>fala(d.jogador.nome, 'Ainda não. Dá pra ver daqui.'),
    'Ele olha pra cerca lá embaixo como quem não olhava fazia tempo.',
    fala('Sr. Larch', 'Foi assim desde o começo. Cinquenta e oito, quando construíram.'),
    fala('Sr. Larch', 'A gente perguntou. O engenheiro falou que era "norma de instalação de alta tensão".'),
    fala('Sr. Larch', 'Eu trabalhei em mais duas usinas depois. Em nenhuma das duas o arame era pra dentro.'),
    'Ele volta a balançar a cadeira, e o rangido volta, e o rangido agora incomoda.',
    fala('Sr. Larch', 'Então ou era norma e as outras duas tavam erradas, ou não era norma.')
  ],
  ef:{flag:'o_arame_desde_setenta_e_seis',
      registrar:'O arame inclinado pra dentro está lá desde a construção, em 1958. Não é norma.',
      presagio:'Se a cerca foi feita assim em 1958, o que ela segura já estava previsto em 1958.'},
  escolhas:[
    {texto:'Seguir pra usina.', vai:'c10_rota'},
    {texto:'Perguntar o que tem na sala de controle.', vai:'c10_ab_a_sala'}
  ]
},

c10_ab_o_aparelho:{
  texto:[
    'O PokéNav começa a fazer uma coisa nova a dois quilômetros do vale.',
    'A tela não apaga: ela fica branca e volta, fica branca e volta, num intervalo que você começa a contar sem querer.',
    'Três segundos. Três segundos. Três segundos.',
    'Você para no meio da estrada e conta trinta e um ciclos seguidos sem nenhuma variação, e trinta e um ciclos idênticos não é defeito — defeito é irregular.',
    'A agenda de contatos abre sozinha e fecha sozinha. Uma ligação disca sem número e cai.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} está tens${pron(p).o} desde a curva e não olha pra frente: olha pro lado, pro fundo do vale, e você segue o olhar e não tem nada no fundo do vale além da usina.`
               : 'Os pelos do seu braço estão em pé e não tem vento nenhum.';
    },
    'Trezentos metros depois, o aparelho desliga. Não descarrega: desliga, com a bateria em setenta e um por cento.'
  ],
  ef:{flag:'o_pokenav_desligou',
      registrar:'O PokéNav piscou em ciclos de três segundos por dois quilômetros e desligou com 71% de bateria.',
      presagio:'Três segundos exatos, trinta e uma vezes. Isso é um pulso, e pulso tem fonte.'},
  escolhas:[
    {texto:'Seguir assim mesmo, sem aparelho.', vai:'c10_rota'},
    {texto:'Voltar até onde ele funciona e marcar o ponto.', vai:'c10_ab_marcou_o_ponto'},
    {texto:'Procurar quem more por aqui e saiba disso.', vai:'c10_quem_sabe'}
  ]
},

c10_ab_marcou_o_ponto:{
  texto:[
    'Você anda de volta contando passo e o aparelho religa sozinho no passo quarenta e alguma coisa.',
    'Você marca o ponto com uma pedra em cima de um toco, que é a tecnologia de que você dispõe.',
    'Depois anda pra frente de novo e ele desliga no mesmo lugar. Anda de volta, religa no mesmo lugar.',
    'Três vezes. Sempre o mesmo ponto, com uma margem de uns dez metros.',
    'Isso é um raio. Você está na borda de um círculo e o centro do círculo é a usina, e você acabou de medir o raio dele com o pé.'
  ],
  ef:{flag:'mediu_o_raio',
      registrar:'Mediu a borda: o PokéNav desliga sempre no mesmo ponto, a cerca de 1,8 km da usina.'},
  escolhas:[
    {texto:'Atravessar a borda e ir pra usina.', vai:'c10_rota'}
  ]
},

c10_ab_de_cracha:{
  texto:[
    'Tem um portão de serviço na entrada do vale com uma placa esmaltada que a chuva comeu pela metade:',
    '**COMPANHIA ENERGÉTICA DE KANTO — UNIDADE 4 — ACESSO RESTRITO**',
    'E tem uma caminhonete branca parada do lado de dentro, com dois homens de macacão azul tomando café numa garrafa térmica.',
    'Eles te veem e não fazem nada, porque você está do lado de fora de um portão e isso é problema de ninguém.',
    d=>{
      const c = Cargos.doCracha();
      return `Aí você mostra o crachá de ${c ? c.nome : 'serviço'} pelo alambrado, e os dois se olham, e um deles põe a garrafa térmica no capô.`;
    },
    fala('o homem do macacão', 'Vocês mandaram alguém?'),
    'Ele fala "vocês". Você não sabe quem é "vocês" e essa é a informação.',
    d=>fala(d.jogador.nome, 'Mandaram alguém pra quê?'),
    'O outro homem, o que ficou perto da caminhonete, responde por cima:',
    fala('o segundo homem', 'Pro chamado. A gente abriu chamado três vezes.')
  ],
  ef:{flag:'a_equipe_do_chamado',
      registrar:'Uma equipe da companhia energética está no portão de serviço da usina, esperando resposta de três chamados.'},
  escolhas:[
    {texto:'Fingir que é pelo chamado e perguntar o que foi.', vai:'c10_ab_o_chamado'},
    {texto:'Dizer a verdade: você não é do chamado.', vai:'c10_ab_a_verdade'},
    {texto:'Deixar pra lá e dar a volta pela cerca.', vai:'c10_perimetro'}
  ]
},

c10_ab_o_chamado:{
  texto:[
    d=>fala(d.jogador.nome, 'Me passa de novo o que vocês reportaram.'),
    'O homem do macacão abre a porta da caminhonete e tira uma prancheta, e a prancheta tem três vias de papel carbono.',
    fala('o homem do macacão', 'Consumo. A unidade 4 tá puxando carga.'),
    d=>fala(d.jogador.nome, 'Puxando? Ela não gera?'),
    fala('o homem do macacão', 'Gerava. Desde oitenta e nove ela não gera nada.'),
    'Ele vira a via de cima da prancheta.',
    fala('o homem do macacão', 'Agora ela consome. Quarenta megawatt-hora por mês, faturado pra ninguém, num registro comercial que foi baixado em oitenta e nove.'),
    fala('o homem do macacão', 'A gente abriu chamado três vezes, de dois em dois meses.'),
    d=>fala(d.jogador.nome, 'E?'),
    fala('o segundo homem', 'E todo mês alguém fecha o chamado como "improcedente" e a gente não sabe quem é esse alguém.', 'baixo')
  ],
  ef:{flag:['usina_consome','sabe_do_armazem'],
      registrar:'A usina consome 40 MWh por mês, faturados para um registro comercial baixado em 1989. Três chamados fechados como improcedentes.',
      presagio:'Alguém com acesso ao sistema da companhia fecha esses chamados todo mês.'},
  escolhas:[
    {texto:'Pedir uma via do chamado.', vai:'c10_ab_a_via'},
    {texto:'Pedir pra eles abrirem o portão.', vai:'c10_portao'},
    {texto:'Agradecer e dar a volta pela cerca.', vai:'c10_perimetro'}
  ]
},

c10_ab_a_via:{
  texto:[
    'Ele destaca a terceira via, a rosa, que é a via que fica com o cliente e que nesse caso não tem cliente.',
    'Da caixa de primeiros socorros da caminhonete ele tira uma Potion e põe junto com o papel, sem comentar.',
    fala('o homem do macacão', 'Leva. Se der merda eu falo que perdi.'),
    'Você dobra o papel em quatro e guarda, e a partir daqui você está carregando um documento, o que é diferente de carregar uma suspeita.',
    fala('o segundo homem', 'Ó, {moço|moça}.'),
    'Ele fala pela primeira vez sem ser por cima do ombro do colega.',
    fala('o segundo homem', 'Se você entrar aí, não entra sozinh{o|a}.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('o segundo homem', 'Porque quarenta megawatt-hora é energia de bairro. E não tem bairro lá dentro.')
  ],
  ef:{flag:'tem_a_via_rosa', itens:{'Potion':1},
      registrar:'Tem a via rosa do chamado da companhia energética, com o consumo da unidade 4.'},
  escolhas:[
    {texto:'Pedir pra eles abrirem o portão.', vai:'c10_portao'},
    {texto:'Dar a volta pela cerca sozinh{o|a}.', vai:'c10_perimetro'}
  ]
},

c10_ab_a_verdade:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu não sou do chamado. Eu vim por conta própria.'),
    'Os dois ficam quietos. O da garrafa térmica pega a garrafa de volta do capô, que é uma forma de encerrar assunto.',
    fala('o homem do macacão', 'Então não pode entrar.'),
    d=>fala(d.jogador.nome, 'Eu sei.'),
    'Ele te olha por um tempo. Depois olha pro colega. Depois pro portão.',
    fala('o homem do macacão', 'A gente sai pra comer daqui a pouco. Leva quarenta minutos.'),
    'Ele não diz mais nada. Não precisa.',
    'Ele olha o relógio de pulso, sem pressa nenhuma.'
  ],
  ef:{flag:'quarenta_minutos_de_almoco', moral:1,
      rep:{eixo:'bom', delta:1, motivo:'Disse a verdade pra uma equipe que podia te barrar.'},
      registrar:'A equipe da companhia sai pra comer e leva quarenta minutos. Eles te disseram isso de propósito.'},
  escolhas:[
    {texto:'Esperar eles saírem pra comer.', vai:'c10_portao'},
    {texto:'Não esperar. Dar a volta pela cerca agora.', vai:'c10_perimetro'},
    {texto:'Sentar e observar a usina enquanto espera.', vai:'c10_observar'}
  ]
},


c10_rota:{
  texto:[
    'A Rota 10 desce para o leste por uma encosta de terra batida, e o ar muda antes de você ver qualquer coisa.',
    'Fica seco. Fica com aquele cheiro de tomada queimada — ozônio, que é o cheiro que sobra quando o ar leva corrente.',
    'E os pelos do seu braço ficam em pé, sem vento nenhum.',
    'A usina aparece no fundo do vale depois da terceira curva. Quatro chaminés, um galpão de turbinas do tamanho de um quarteirão, pátio de brita, e uma cerca de alambrado de dois metros e meio com arame farpado inclinado pra dentro.',
    'Inclinado pra dentro. Isso quer dizer que a cerca não foi feita pra impedir ninguém de entrar. Foi feita pra impedir alguma coisa de sair.',
    'A companhia desativou a usina há onze anos e nunca desmontou. Só trancou o portão e foi embora, deixando tudo no lugar: turbina, transformador, painel, cadeira de escritório.',
    'E ela está zumbindo.',
    d=>{
      const via = Historia.via();
      if (via==='mercenario') return 'Você está aqui porque a Terceira mandou: "tem material na usina, ninguém entra há anos, traz o que der". A caixa vazia na sua mochila pesa mais do que caixa cheia.';
      if (via==='foragido') return 'Você está aqui porque agora é você que precisa de material, e a usina é a única fonte em Kanto que ninguém explorou porque ninguém teve coragem.';
      if (via==='pesquisador') return 'Você está aqui porque o livro de destinos tinha uma linha esquisita: "R10 — coleta local — sem custo". Coleta de quê, numa usina desativada há onze anos?';
      if (via==='heroi') return 'Você está aqui porque três pessoas diferentes em Cerulean te falaram da mesma coisa, sem combinar: relâmpago em céu limpo, toda semana, sempre no mesmo lugar.';
      return 'Você está aqui porque estava passando e porque o zumbido é impossível de ignorar depois que você percebe que está ouvindo ele.';
    }
  ],
  ef:{registrar:'Chegou à usina abandonada da Rota 10.'},
  escolhas:[
    {texto:'Entrar pelo portão principal.', vai:'c10_portao'},
    {texto:'Contornar a cerca inteira antes de entrar.', vai:'c10_perimetro'},
    {texto:'Observar de longe até escurecer.', vai:'c10_observar'},
    {texto:'Procurar alguém na rota que saiba o que é isso.', vai:'c10_quem_sabe'}
  ]
},

c10_quem_sabe:{
  falante:'o homem do boné',
  vozes:['N','N'],
  texto:[
    'A Rota 10 tem três coisas: a usina, a entrada do Túnel de Rocha, e um açude onde pescador de Lavender vem nos fins de semana.',
    'No açude tem quatro pessoas. Três não querem conversa.',
    'A quarta é um homem de uns setenta anos, de boné da companhia elétrica — boné antigo, com o logotipo que a empresa não usa mais — sentado numa cadeira de praia com uma vara que claramente não está pescando nada.',
    'Ele está de costas pro açude. De frente pra usina.',
    d=>c10_jaEntrou(d)
      ? '"Você entrou," ele diz, antes de você abrir a boca. "Tá na sua cara. Senta cinco minutos antes de voltar lá."'
      : '"Você vai entrar," ele diz, antes de você abrir a boca. "Todo mundo que para aqui vai entrar. Senta cinco minutos antes."'
  ],
  ef:{npc:{nome:C10_EDRIC, opiniao:1, memoria:'Pescador que não pesca, na Rota 10, sentado de frente para a usina.'},
      flag:'conheceu_eloi',
      presagio:'De costas pro açude. De frente pra usina. Ele não veio pescar.'},
  escolhas:[
    {texto:'Sentar.', vai:'c10_eloi'},
    {texto:'"Você trabalhou lá."', vai:'c10_eloi'},
    {texto:'Não sentar. Ir direto pro portão.', vai:'c10_portao'},
    {texto:'Perguntar do Túnel de Rocha primeiro.', vai:'c10_tunel'}
  ]
},

c10_eloi:{
  falante:'Sr. Edric',
  vozes:['N','N','P','N','P','N','N','N'],
  texto:[
    'Você senta na brita do lado da cadeira de praia dele.',
    d=>d.flags.c10_nome_ja_dito
      ? '"Trabalhei ali dezenove anos, na sala de controle," ele diz. "Saí quando fecharam."'
      : '"Edric." Ele estende a mão sem levantar da cadeira. "Trabalhei ali dezenove anos, na sala de controle. Saí quando fecharam."',
    d=>d.flags.conheceu_o_operador ? 'Você conta que passou pela casa da curva, a das cadeiras de praça. Ele faz que sim com a cabeça, devagar: sabe de quem é. Dividiram a mesma sala de controle por dezenove anos.' : '',
    '"Por que fechou?"',
    'Ele demora pra responder, e quando responde é com uma frase que ele claramente já disse muitas vezes e que continua não resolvendo nada:',
    '"Oficialmente? Inviabilidade econômica."',
    '"E não oficialmente?"',
    '"Não oficialmente é que em oito de março de oitenta e nove, às cinco e quarenta da manhã, os quatro transformadores de saída sobrecarregaram ao mesmo tempo, com a linha de transmissão fechada e a carga normal."',
    '"Ao mesmo tempo é a parte impossível. Transformador queima um, dois no máximo. Quatro ao mesmo tempo quer dizer que a energia não veio da linha."',
    '"Veio de dentro."'
  ],
  ef:{flag:['sabe_do_acidente','sabe_da_data'],
      executar:d=>{ d.flags.c10_nome_ja_dito = Nomes.sabe(C10_EDRIC); Nomes.apresentar('o homem do boné'); return []; },
      registrar:'Em 8 de março de 1989 os quatro transformadores da usina sobrecarregaram ao mesmo tempo, por dentro.',
      presagio:'Veio de dentro. Uma usina que gera energia recebeu energia de dentro.'},
  escolhas:[
    {texto:'"Morreu alguém?"', vai:'c10_morreu_alguem'},
    {texto:'"E por que nunca desmontaram?"', vai:'c10_porque_nao_desmontaram'},
    {texto:'"O que é o zumbido?"', vai:'c10_o_zumbido'},
    {texto:'"Você vem aqui sempre?"', vai:'c10_porque_ele_vem'}
  ]
},

c10_morreu_alguem:{
  falante:'Sr. Edric',
  vozes:['N','N','N','N','N','N','N'],
  texto:[
    '"Morreu."',
    'Ele arruma a vara que não está pescando nada.',
    '"Um. Operador de painel, turno da madrugada. Vinte e seis anos. Chamava Silas."',
    '"Ele estava na sala de controle e não devia ter acontecido nada com ele, porque sala de controle é isolada, é o lugar mais seguro da usina inteira."',
    '"Mas ele saiu da sala. O registro de porta mostra: ele abriu a porta da sala de controle às cinco e trinta e oito e foi pro galpão."',
    '"Dois minutos antes."',
    '"Ninguém sabe por quê. A família perguntou. A perícia perguntou. Eu pergunto até hoje."',
    'Ele finalmente olha pra você.',
    '"Eu acho que ele foi ver. Eu acho que ele ouviu o zumbido começar e foi ver o que era, porque ele era curioso, e porque naquela hora ninguém sabia que tinha que ter medo."'
  ],
  ef:{flag:['sabe_do_nivaldo','sabe_da_sala_de_controle'],
      moral:-5,
      registrar:'Silas, operador de painel, saiu da sala de controle dois minutos antes da sobrecarga e morreu no galpão.',
      presagio:'Saiu dois minutos antes. Ninguém sabe o que ele ouviu pra levantar da cadeira.'},
  escolhas:[
    {texto:'"E o corpo?"', vai:'c10_o_corpo'},
    {texto:'"Por que nunca desmontaram?"', vai:'c10_porque_nao_desmontaram'},
    {texto:'"O que é o zumbido?"', vai:'c10_o_zumbido'},
    {texto:'Levantar e ir pra usina.', vai:'c10_portao'}
  ]
},

c10_o_corpo:{
  falante:'Sr. Edric',
  vozes:['N','N','N','N','N','N'],
  texto:[
    '"Acharam no chão do galpão, embaixo da viga central."',
    '"E aqui é onde eu paro de contar pra maioria das pessoas, porque a maioria das pessoas faz uma cara e eu não gosto da cara."',
    'Ele espera. Você não faz a cara.',
    '"Ele não tinha queimadura de entrada e saída. Choque elétrico tem marca de entrada e marca de saída, sempre, porque a corrente entra e sai."',
    '"O dele tinha só entrada. Doze pontos de entrada, distribuídos pelo tórax e pelos braços, e nenhuma saída em lugar nenhum."',
    '"O laudo escreveu “achado atípico” e assinou parada cardiorrespiratória."',
    '"“Achado atípico.” Dezenove anos naquela sala e foi essa a frase que sobrou do Silas."'
  ],
  ef:{flag:'sabe_do_laudo', moral:-5,
      rep:{eixo:'bom',delta:1,motivo:'Ouviu a história inteira sem fazer a cara'},
      registrar:'O laudo do Silas: doze pontos de entrada, nenhuma saída. "Achado atípico."',
      presagio:'Doze pontos de entrada e nenhuma saída. A corrente entrou e ficou.'},
  escolhas:[
    {texto:'"Por que nunca desmontaram?"', vai:'c10_porque_nao_desmontaram'},
    {texto:'"O que é o zumbido?"', vai:'c10_o_zumbido'},
    {texto:'"Você vem aqui sempre?"', vai:'c10_porque_ele_vem'},
    {texto:'Levantar e ir pra usina.', vai:'c10_portao'}
  ]
},

c10_porque_nao_desmontaram:{
  falante:'Sr. Edric',
  vozes:['N','N','N','N','N','N'],
  texto:[
    '"Porque desmontar dá processo."',
    'Ele ri sem nenhum humor.',
    '"Desmontar usina é obra. Obra tem licença ambiental, tem laudo, tem empreiteira, tem gente andando lá dentro seis meses."',
    '"E aí alguém ia perguntar por que os transformadores de saída, que estão desligados da linha desde oitenta e nove, continuam energizados."',
    '"Um transformador desligado não fica energizado. Não é opinião, é física."',
    '"Então a companhia fez a coisa mais barata do mundo: botou cadeado no portão, botou placa de alta tensão, pagou um vigia por três anos, e depois parou de pagar o vigia."',
    '"E desde então essa usina é um problema de ninguém."'
  ],
  ef:{flag:'sabe_porque_nao_desmontaram',
      registrar:'A usina nunca foi desmontada porque desmontar exigiria explicar por que ela continua energizada.',
      presagio:'Problema de ninguém. Foi assim que Celadon funcionava também.'},
  escolhas:[
    {texto:'"O que é o zumbido?"', vai:'c10_o_zumbido'},
    {texto:'"Você vem aqui sempre?"', vai:'c10_porque_ele_vem'},
    {texto:'"Me dá a planta do lugar."', vai:'c10_planta'},
    {texto:'Levantar e ir pra usina.', vai:'c10_portao'}
  ]
},

c10_o_zumbido:{
  falante:'Sr. Edric',
  vozes:['N','N','N','N','N'],
  texto:[
    '"O zumbido é sessenta hertz."',
    'Ele diz isso com a precisão de quem mediu.',
    '"Sessenta hertz é a frequência da rede elétrica de Kanto. É o som que um transformador faz quando está sob carga."',
    '"Só que não tem carga. A linha está cortada faz onze anos — eu mesmo vi cortarem."',
    '"Então o que tem ali dentro está fazendo sessenta hertz de propósito."',
    'Pausa.',
    '"Ou aprendeu a fazer, que é a ideia que me tira o sono."'
  ],
  ef:{flag:'sabe_dos_sessenta_hertz',
      registrar:'O zumbido é exatamente 60 Hz — a frequência da rede — numa usina sem carga.',
      presagio:'Aprendeu a fazer. Alguma coisa ali imita a rede elétrica.'},
  escolhas:[
    {texto:'"Você vem aqui sempre?"', vai:'c10_porque_ele_vem'},
    {texto:'"Me dá a planta do lugar."', vai:'c10_planta'},
    {texto:'"Você já entrou de novo?"', vai:'c10_ja_entrou'},
    {texto:'Levantar e ir pra usina.', vai:'c10_portao'}
  ]
},

c10_porque_ele_vem:{
  falante:'Sr. Edric',
  vozes:['N','N','N','N','N'],
  texto:[
    '"Uma vez por mês. Primeiro sábado."',
    '"Eu venho, sento aqui, olho, e volto pra casa."',
    '"Minha filha acha que eu pesco. Eu deixo ela achar, porque “eu pesco” é uma frase mais curta que a verdade."',
    'Ele ajeita o boné da companhia.',
    '"A verdade é que se um dia acontecer alguma coisa ali de novo, eu quero ser a pessoa que estava olhando."',
    '"Na primeira vez ninguém estava olhando. Tinha um menino de vinte e seis anos e mais ninguém."'
  ],
  ef:{npc:{nome:'Sr. Edric', opiniao:4, memoria:'Vem uma vez por mês, no primeiro sábado, para ser alguém que está olhando.'},
      flag:'eloi_confia', moral:5,
      rep:{eixo:'bom',delta:1,motivo:'Ouviu um velho dizer por que ele volta ao lugar onde alguém morreu'},
      registrar:'Sr. Edric volta todo primeiro sábado para ser alguém que está olhando.'},
  escolhas:[
    {texto:'"Me dá a planta do lugar."', vai:'c10_planta'},
    {texto:'"Vem comigo."', vai:'c10_convidou_eloi'},
    {texto:'"Você já entrou de novo?"', vai:'c10_ja_entrou'},
    {texto:'Levantar e ir pra usina.', vai:'c10_portao'}
  ]
},

c10_ja_entrou:{
  falante:'Sr. Edric',
  vozes:['N','N','N','N','N','N'],
  texto:[
    '"Uma vez. Quatro anos atrás."',
    '"Cheguei até a porta do galpão. Abri. Olhei."',
    'Ele para de mexer na vara.',
    '"Tinha uns quarenta Voltorb no chão. Parados. Em fileira, mais ou menos, virados todos pro mesmo canto."',
    '"Eles não olharam pra mim. Nenhum. Eu fiquei na porta uns dois minutos e nenhum dos quarenta virou a cabeça."',
    '"E eu tenho sessenta e nove anos e fui embora chorando, e não sei explicar por quê até hoje."',
    'Ele limpa a garganta.',
    '"Acho que é porque eu entendi que eles estavam esperando. E eu sei o que é esperar num lugar desses."'
  ],
  ef:{flag:'sabe_dos_voltorb', moral:-5,
      registrar:'Há quatro anos Sr. Edric viu quarenta Voltorb parados no galpão, todos virados para o mesmo canto.',
      presagio:d=>d.flags.eloi_confia ? 'Esperando. Ele reconheceu porque ele faz a mesma coisa todo primeiro sábado.' : 'Esperando. Ele reconheceu de longe, como quem conhece o jeito.'},
  escolhas:[
    {texto:'"Me dá a planta do lugar."', vai:'c10_planta'},
    {texto:'"Vem comigo."', vai:'c10_convidou_eloi'},
    {texto:'"Esperando o quê?"', vai:'c10_esperando_o_que'},
    {texto:'Levantar e ir pra usina.', vai:'c10_portao'}
  ]
},

c10_esperando_o_que:{
  falante:'Sr. Edric',
  vozes:['P','N','N','N','N','N'],
  texto:[
    '"Esperando o quê?"',
    'Ele pensa muito tempo. É a primeira pergunta que ele não tem resposta pronta.',
    '"Eu trabalhei dezenove anos numa usina, então deixa eu explicar pelo lado que eu sei."',
    '"Usina não gera energia sozinha. Usina converte. Você joga uma coisa dentro — água, carvão, vapor — e ela vira outra coisa, e essa outra coisa vai pro fio."',
    '"O que eu acho, e eu posso estar completamente errado, é que aquilo ali dentro é uma coisa que também converte."',
    '"E os Pokémon no chão não estão esperando ela fazer alguma coisa com eles."',
    '"Eles estão esperando a vez de ser jogados dentro."'
  ],
  ef:{flag:'teoria_do_eloi', moral:-8, instabilidade:1,
      registrar:'Teoria do Sr. Edric: os Voltorb esperam a vez de serem convertidos.'},
  escolhas:[
    {texto:'"Me dá a planta do lugar."', vai:'c10_planta'},
    {texto:'"Vem comigo."', vai:'c10_convidou_eloi'},
    {texto:'"Acho que você tá errado."', vai:'c10_discordou_do_eloi'},
    {texto:'Levantar e ir pra usina.', vai:'c10_portao'}
  ]
},

c10_discordou_do_eloi:{
  falante:'Sr. Edric',
  vozes:['P','N','P','N','N','N'],
  texto:[
    '"Acho que você tá errado."',
    'Ele levanta uma sobrancelha, sem ofensa nenhuma. "Diz."',
    '"Se fosse isso, eles fugiriam. Pokémon foge de coisa que come Pokémon. Eles não estão fugindo — eles estão indo."',
    'Silêncio de uns dez segundos.',
    '"Ah", ele diz. E depois de novo, mais baixo: "Ah."',
    '"Quer dizer que é o contrário. Quer dizer que eles querem."',
    'Ele olha a usina com uma cara diferente da que estava usando há um minuto.',
    '"Isso é pior. Você entendeu que isso é pior?"'
  ],
  ef:{flag:'entendeu_que_eles_querem',
      npc:{nome:'Sr. Edric', opiniao:5, memoria:'Você desmontou a teoria dele em duas frases e ele agradeceu.'},
      rep:{eixo:'bom',delta:2,motivo:'Pensou melhor que o especialista e falou'},
      registrar:'Os Voltorb não estão sendo levados. Eles estão indo por vontade própria.'},
  escolhas:[
    {texto:'"Me dá a planta do lugar."', vai:'c10_planta'},
    {texto:'"Vem comigo."', vai:'c10_convidou_eloi'},
    {texto:'Levantar e ir pra usina.', vai:'c10_portao'},
    {texto:'Observar de longe antes de entrar.', vai:'c10_observar'}
  ]
},

c10_planta:{
  falante:'Sr. Edric',
  vozes:['N','N','N','N'],
  texto:[
    '"Planta eu não tenho. Mas eu tenho isso."',
    'Ele tira do bolso do colete um papel dobrado em quatro, amarelado, com vinco branco de tanto ser dobrado.',
    'É um croqui feito à mão, a lápis, com régua, numa folha de caderno.',
    'Portaria. Pátio de brita. Galpão de turbinas (três turbinas, a do meio riscada). Subestação (quatro transformadores, numerados). Sala de controle. Vestiário. Casa de bombas. Almoxarifado.',
    'E, no galpão, um X pequeno embaixo da viga central, com uma data ao lado: 08/03/89.',
    '"Eu desenhei isso no ano que fechou, porque eu tinha medo de esquecer a planta."',
    '"Eu não esqueci. Mas o papel continua no bolso."',
    'Ele te entrega.',
    '"Devolve quando sair. Se você sair."',
    'Ele não sorri quando diz isso, e por isso não é piada.'
  ],
  ef:{flag:['tem_o_croqui','sabe_da_sala_de_controle'],
      itens:{'Croqui da usina':1},
      npc:{nome:'Sr. Edric', opiniao:5, memoria:'Te emprestou o croqui que ele desenhou à mão em 1989.'},
      rep:{eixo:'bom',delta:1,motivo:'Ganhou a confiança de quem não confia em ninguém sobre aquele lugar'},
      registrar:'Recebeu o croqui da usina desenhado à mão pelo Sr. Edric.',
      presagio:'"Se você sair." Ele não estava sendo dramático. Ele estava sendo exato.'},
  escolhas:[
    {texto:'Ir pro portão principal.', vai:'c10_portao'},
    {texto:'Contornar a cerca primeiro.', vai:'c10_perimetro'},
    {texto:'Observar de longe até escurecer.', vai:'c10_observar'},
    {texto:'"Vem comigo."', vai:'c10_convidou_eloi'}
  ]
},

c10_convidou_eloi:{
  falante:'Sr. Edric',
  vozes:['P','N','N','N','N'],
  texto:[
    '"Vem comigo."',
    'Ele olha pra você um tempo desconfortável.',
    '"Eu tenho sessenta e nove anos, uma ponte de safena e um marca-passo."',
    'Pausa.',
    '"Marca-passo, {garoto|garota}. Num lugar que faz sessenta hertz sem carga."',
    'Ele volta a olhar a usina.',
    '"Eu vou até o portão. Do portão eu fico. E eu vou ficar até você sair, e se você não sair até as seis da manhã eu vou até Lavender chamar quem tiver que chamar."',
    '"É o máximo que um velho com marca-passo consegue oferecer e eu odeio que seja."'
  ],
  ef:{flag:['eloi_no_portao','tem_quem_espera'],
      npc:{nome:'Sr. Edric', opiniao:6, memoria:'Ficou no portão da usina esperando você sair, com hora marcada para chamar socorro.'},
      rep:{eixo:'bom',delta:1,motivo:'Pediu ajuda em vez de fingir que não precisava'},
      moral:8,
      registrar:'Sr. Edric vai esperar no portão até as seis da manhã.',
      presagio:'Alguém está olhando dessa vez. Foi só isso que faltou em oitenta e nove.'},
  escolhas:[
    {texto:'Ir pro portão com ele.', vai:'c10_portao'},
    {texto:'Contornar a cerca primeiro.', vai:'c10_perimetro'},
    {texto:'Observar de longe até escurecer.', vai:'c10_observar'},
    {texto:'Ir ver a entrada do Túnel de Rocha antes.', vai:'c10_tunel'}
  ]
},

/* De volta ao homem do boné, com o que você trouxe lá de dentro. Quem
   chega aqui ainda sem o nome dele ouve o nome agora. */
c10_de_volta_ao_acude:{
  texto:[
    d=>d.flags.eloi_no_portao
      ? 'Ele está no portão, na cadeira de praia, com a garrafa térmica no colo e os olhos no galpão.'
      : 'Ele está na cadeira de praia, de costas pro açude e de frente pra usina, do jeito que você deixou.',
    d=>d.flags.c10_edric_se_apresentou_aqui ? fala(C10_EDRIC, 'Edric. Já que você voltou, é bom saber com quem tá falando.') : '',
    'Ele espera você falar primeiro.'
  ],
  ef:{executar:d=>{ d.flags.c10_edric_se_apresentou_aqui = !Nomes.sabe(C10_EDRIC); Nomes.apresentar('o homem do boné'); return []; }},
  escolhas:[
    {texto:'Mostrar a conta do caderno.', vai:'c10_mostrou_a_conta', cond:d=>!!d.flags.mediu_o_ciclo},
    {texto:'Entregar a agenda da sala de controle.', vai:'c10_agenda_pro_eloi', cond:d=>Estado.contaItem('Agenda da sala de controle')>0},
    {texto:'Mostrar a fita do registro de porta.', vai:'c10_registro_pro_eloi', cond:d=>Estado.contaItem('Fita do registro de porta')>0},
    {texto:'Mostrar a foto do armário.', vai:'c10_foto_pro_eloi', cond:d=>Estado.contaItem('Foto três por quatro')>0},
    {texto:'Mostrar o caderno do Toby.', vai:'c10_caderno_pro_eloi', cond:d=>Estado.contaItem('Caderno do Toby')>0},
    {texto:'Contar dos seis pulsos e do sétimo.', vai:'c10_sequencia_pro_eloi', cond:d=>!!d.flags.t3_responde},
    {texto:'Sentar e perguntar da usina.', vai:'c10_eloi', cond:d=>!d.flags.sabe_do_acidente},
    {texto:'Ficar sentad{o|a} com ele um tempo.', vai:'c10_sentou_com_eloi', cond:d=>!!d.flags.sabe_do_acidente},
    {texto:'Voltar pra usina.', vai:'c10_portao'}
  ]
},

c10_caderno_pro_eloi:{
  falante:'Sr. Edric',
  vozes:['N','N','N','N'],
  texto:[
    'Você dá o caderno de matemática pra ele, aberto na última página escrita.',
    'Ele lê com o braço esticado. Depois vira pra contracapa e lê o nome e o mês.',
    '"Janeiro."',
    'Ele fecha o caderno e fica com ele no colo um tempo, com a mão em cima, do jeito que se segura coisa de criança.',
    '"Eu vi esse menino. Passou aqui com uma barraca nas costas, perguntou se a usina tava aberta, e eu disse que não."',
    '"Ele foi mesmo assim. E saiu, pelo visto. Saiu e escreveu isso."',
    'Ele devolve o caderno com as duas mãos.',
    '"Eles não estão presos. Onze anos, e quem descobriu foi um menino com caderno de matemática."'
  ],
  ef:{flag:'edric_leu_o_caderno', moral:-3,
      npc:{nome:'Sr. Edric', memoria:'Leu com você o caderno do menino que entrou na usina em janeiro.'},
      registrar:'O Sr. Edric viu o Toby passar em janeiro, de barraca nas costas, e disse a ele que a usina estava fechada.'},
  escolhas:[
    {texto:'Mostrar outra coisa.', vai:'c10_de_volta_ao_acude'},
    {texto:'Voltar pra usina.', vai:'c10_portao'}
  ]
},

c10_sequencia_pro_eloi:{
  falante:'Sr. Edric',
  vozes:['N','P','N','N'],
  texto:[
    'Você conta do multímetro: seis pulsos nos quatro transformadores, e um sétimo, maior, só no T3.',
    'Ele não pergunta se você tem certeza. Pergunta outra coisa:',
    '"O sétimo vem depois dos seis? Sempre depois?"',
    '"Sempre."',
    'Ele fica um tempo olhando a usina.',
    '"Na sala de controle, quando a gente queria saber se a outra ponta da linha tava ouvindo, a gente mandava um pulso e esperava o de volta."',
    '"Seis e um é isso. É alguém mandando e alguém respondendo."'
  ],
  ef:{flag:'edric_sabe_da_sequencia',
      npc:{nome:'Sr. Edric', memoria:'Ouviu da sequência de seis e sete e disse que é alguém mandando e alguém respondendo.'},
      registrar:'Pro Sr. Edric, seis pulsos e um sétimo é o que se faz numa linha pra saber se a outra ponta está ouvindo.'},
  escolhas:[
    {texto:'Mostrar outra coisa.', vai:'c10_de_volta_ao_acude'},
    {texto:'Voltar pra usina.', vai:'c10_portao'}
  ]
},

/* ─────────────── O PERÍMETRO ─────────────── */

c10_tunel:{
  falante:'a mulher do fogo',
  vozes:['N','N','P','N','N'],
  texto:[
    'A boca do Túnel de Rocha fica a oitocentos metros da usina, e é um buraco na encosta com uma placa de madeira: TRAVESSIA — LEVE LANTERNA.',
    'Tem seis pessoas acampadas na entrada. Não vão entrar: estão esperando amanhecer, porque o túnel é escuro o suficiente para ser escuro de dia.',
    'Uma delas te reconhece, ou finge.',
    '"Você vai pra usina?" Ela aponta o queixo pro vale. "A gente ouve daqui à noite. Não é o zumbido. É depois do zumbido."',
    '"Depois do zumbido?"',
    '"Tem um estalo. Um por noite, sempre entre seis e meia e sete da noite. E aí o zumbido fica mais baixo por uns vinte minutos e depois volta a subir."',
    'Ela mexe no fogo.',
    '"É que nem geladeira velha, sabe? Liga, enche, desliga. A gente aqui chama de “janela”. Entre o estalo e o zumbido voltar, tem uma janela."'
  ],
  ef:{flag:['sabe_da_janela','sabe_do_estalo'],
      registrar:'Todo dia entre 18h30 e 19h há um estalo na usina, e depois vinte minutos de zumbido baixo — a "janela".'},
  escolhas:[
    {texto:'"Alguém já entrou?"', vai:'c10_alguem_entrou'},
    {texto:'Voltar pra usina e esperar a janela.', vai:'c10_observar'},
    {texto:'Ir pro portão agora.', vai:'c10_portao'},
    {texto:'Contornar a cerca.', vai:'c10_perimetro'}
  ]
},

c10_alguem_entrou:{
  falante:'a mulher do fogo',
  vozes:['N','N','N','N','N','N'],
  texto:[
    '"Já."',
    'Ela conta nos dedos, sem drama, como quem lista compras.',
    '"Ano passado entrou um grupo de quatro. Saíram os quatro, sem nada. Disseram que não tinha nada lá."',
    '"Em janeiro entrou um sozinho. Saiu. Não falou com ninguém, foi embora andando pro sul e deixou a barraca armada aqui. A barraca ficou nove dias e a gente desmontou."',
    '"Mês passado entrou um casal de Vermilion. Saíram correndo em quarenta minutos e um deles estava com o braço queimado numa listra fina, assim." Ela desenha no próprio antebraço uma linha reta. "Reta. Queimadura reta, {garoto|garota}. Fogo não faz linha reta."',
    '"E sempre a mesma coisa quando a gente pergunta o que teve lá: eles ficam um tempão pensando antes de responder. Todos. Como se tivessem que lembrar."'
  ],
  ef:{flag:'sabe_dos_que_entraram',
      registrar:'Quem entra na usina sai tendo que lembrar o que viu.'},
  escolhas:[
    {texto:'Voltar e esperar a janela.', vai:'c10_observar'},
    {texto:'Ir pro portão agora.', vai:'c10_portao'},
    {texto:'Contornar a cerca.', vai:'c10_perimetro'},
    ...c10_voltarAoEdric('Voltar e contar isso')
  ]
},

c10_perimetro:{
  texto:[
    'Você contorna o alambrado inteiro. Leva cinquenta minutos e são mil e duzentos metros de cerca.',
    'Anota quatro coisas.',
    'Uma: o arame farpado está inclinado pra dentro no perímetro inteiro, sem exceção. Isso custa mais caro que inclinar pra fora e alguém pagou de propósito.',
    'Duas: tem três buracos na tela, todos do mesmo tamanho, todos com a borda derretida e não cortada. Ninguém cortou essa tela com alicate. Alguma coisa passou por ela.',
    'Três: a grama em volta dos três buracos é diferente. Mais alta, mais verde, num raio de uns dois metros. Terra com corrente cresce planta melhor — isso é fato agrícola e é a coisa mais tranquila e mais assustadora que você viu hoje.',
    'Quatro: na parte de trás, perto da subestação, o alambrado simplesmente não existe num trecho de oito metros. Os postes estão lá. A tela não.'
  ],
  ef:{flag:['viu_os_buracos','conhece_o_perimetro'],
      rep:{eixo:'bom',delta:1,motivo:'Andou mil e duzentos metros de cerca antes de abrir qualquer porta'},
      registrar:'Três buracos com borda derretida na cerca; oito metros de tela sumidos atrás da subestação.',
      presagio:'A tela não foi cortada. A tela foi levada.'},
  escolhas:[
    {texto:'Entrar pelo trecho sem tela, direto na subestação.', vai:'c10_subestacao'},
    {texto:'Entrar por um dos buracos derretidos.', vai:'c10_buraco'},
    {texto:'Entrar pelo portão principal, como gente.', vai:'c10_portao'},
    {texto:'Esperar escurecer antes de entrar.', vai:'c10_observar'}
  ]
},

c10_buraco:{
  texto:[
    'Você passa por um dos buracos derretidos, agachad{o|a}, e a borda da tela ainda está com aquele acabamento liso de metal que fundiu e voltou a endurecer.',
    'Você encosta o dedo sem pensar.',
    'Está morna.',
    'Uma cerca de alambrado num vale de vento, morna ao toque.',
    'Você tira o dedo e olha ele por um tempo idiota, como se o dedo fosse te explicar alguma coisa.'
  ],
  ef:{flag:'entrou_pelo_buraco', executar:c10_estar('patio')},
  escolhas:[
    {texto:'Ir pro galpão de turbinas.', vai:'c10_galpao'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'},
    {texto:'Ir pra sala de controle.', vai:'c10_sala_controle'},
    {texto:'Ir pro vestiário.', vai:'c10_vestiario'}
  ]
},

c10_observar:{
  texto:[
    'Você sobe a encosta oeste e deita no mato seco com vista pro pátio inteiro.',
    'Espera quatro horas. É chato de um jeito que histórias não costumam contar: você tem cãibra, dormência, e o sol de lado.',
    'Às dezoito e trinta e quatro, o zumbido sobe de tom. Não mais alto — mais agudo.',
    'Às dezoito e quarenta, com o céu ainda claro e limpo em todas as direções, um raio cai dentro do pátio da usina.',
    'Não vem de nuvem. Não tem nuvem. Ele desce reto de um céu azul-acinzentado de fim de tarde e acerta a estrutura do galpão, e o estouro chega em você um segundo e meio depois.',
    'Às dezoito e cinquenta e dois, outro.',
    'Depois do segundo, um estalo seco e diferente — mais curto, mais metálico.',
    'E o zumbido cai pela metade.',
    d=>d.flags.sabe_do_estalo
      ? 'São dezoito e cinquenta e três. Se o pessoal do túnel estiver certo, você tem vinte minutos.'
      : 'São dezoito e cinquenta e três, e o zumbido continua pela metade, como uma porta que ficou encostada.'
  ],
  ef:{flag:['viu_os_raios','sabe_da_janela'],
      executar:d=>{ c10_ate(19); return []; },
      rep:{eixo:'bom',delta:2,motivo:'Esperou quatro horas antes de abrir uma porta'},
      registrar:'Observou dois raios em céu limpo, o estalo, e a janela de vinte minutos.',
      presagio:'Não é tempestade. É alguma coisa recarregando, e você viu o ciclo inteiro.'},
  escolhas:[
    {texto:'Descer agora e usar a janela.', vai:'c10_portao'},
    {texto:'Entrar pela subestação, dentro da janela.', vai:'c10_subestacao'},
    {texto:'Ficar mais uma noite e anotar tudo.', vai:'c10_anotou_ciclo'},
    {texto:'Ir embora. Isso não é assunto seu.', vai:'c10_foi_embora'}
  ]
},

c10_anotou_ciclo:{
  texto:[
    'Você fica mais duas noites na encosta e anota tudo num caderno, com horário.',
    'Dia um: raio às 18h40 e 18h52. Estalo 18h53. Zumbido baixo até 19h13.',
    'Dia dois: raio às 18h37 e 18h49. Estalo 18h50. Zumbido baixo até 19h10.',
    'Dia três — porque você ficou três noites, e isso diz alguma coisa sobre você — raio às 18h35 e 18h46. Estalo 18h47. Zumbido baixo até 19h06.',
    'Está adiantando, dois a três minutos por dia. E a janela entre o estalo e a volta do zumbido está fechando: vinte minutos, vinte, dezenove.',
    'Você faz a conta na margem do caderno, com a letra ficando pior conforme você entende: se a janela perde meio minuto por dia, em quarenta dias ela fecha e o ciclo vira contínuo.',
    'Quarenta dias.',
    'Você olha a conta por um tempo longo e depois risca ela, e depois desrisca, porque riscar não muda a conta.'
  ],
  ef:{flag:['mediu_o_ciclo','sabe_dos_quarenta_dias'],
      executar:d=>{ Relogio.avancar(48); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Mediu três noites e fez a conta que ninguém tinha feito'},
      itens:{'Caderno de medições':1},
      instabilidade:1,
      registrar:'A janela da usina perde meio minuto por dia. Em quarenta dias ela fecha e o ciclo vira contínuo.'},
  escolhas:[
    {texto:'Descer e entrar agora.', vai:'c10_portao'},
    ...c10_voltarAoEdric('Mostrar a conta'),
    {texto:d=>d.flags.sabe_do_estalo ? 'Avisar o pessoal do Túnel de Rocha.' : 'Descer até o fogo aceso na boca do Túnel de Rocha e avisar quem estiver lá.', vai:'c10_avisou_o_tunel'},
    {texto:'Entrar pela subestação.', vai:'c10_subestacao'}
  ]
},

c10_mostrou_a_conta:{
  falante:'Sr. Edric',
  vozes:['N','N','N','N','N'],
  texto:[
    'Você mostra o caderno. Ele lê a página três vezes sem dizer nada.',
    'Depois pega o lápis da sua mão e refaz a conta na margem, do jeito dele, com casas decimais.',
    'Chega no mesmo número.',
    '"Quarenta e um," ele diz. "A sua conta deu quarenta porque você arredondou o dia três."',
    'Ele devolve o caderno.',
    '"Eu vou ligar pra companhia amanhã de manhã. Eles vão dizer que a usina está desativada e que não há registro de anomalia."',
    '"Eu vou ligar mesmo assim, porque quando der quarenta e um dias eu quero que exista uma ligação registrada no protocolo deles com a minha voz falando isso hoje."',
    'Ele guarda o lápis no bolso do colete.',
    '"É a única coisa que um velho consegue fazer: deixar registrado que avisou."'
  ],
  ef:{flag:['eloi_vai_ligar','sabe_dos_quarenta_dias','edric_refez_a_conta'],
      npc:{nome:'Sr. Edric', opiniao:6, memoria:'Refez sua conta, achou 41 dias, e ligou para a companhia para deixar registrado.'},
      rep:{eixo:'bom',delta:2,motivo:'Levou o que descobriu a quem podia registrar'},
      registrar:'Sr. Edric registrou um aviso à companhia elétrica. Prazo: 41 dias.',
      presagio:'Deixar registrado que avisou. Às vezes é só isso que dá pra fazer, e às vezes isso basta.'},
  escolhas:[
    {texto:'Entrar na usina agora.', vai:'c10_portao'},
    {texto:'Entrar pela subestação.', vai:'c10_subestacao'},
    {texto:d=>d.flags.sabe_do_estalo ? 'Avisar o pessoal do Túnel de Rocha também.' : 'Avisar também quem estiver na boca do Túnel de Rocha.', vai:'c10_avisou_o_tunel'},
    {texto:'Ir embora e deixar registrado bastar.', vai:'c10_foi_embora_avisado'}
  ]
},

c10_avisou_o_tunel:{
  falante:'a mulher do fogo',
  vozes:['N','N','uma das acampadas'],
  texto:[
    d=>d.flags.sabe_do_estalo
      ? 'Você volta ao acampamento da boca do túnel com o caderno.'
      : 'Na boca do Túnel de Rocha, a oitocentos metros da usina, tem seis pessoas acampadas em volta de um fogo, esperando amanhecer pra atravessar. Você chega com o caderno aberto.',
    'Eles ouvem. Eles acreditam — essa é a parte que desmonta você: ninguém pede prova, ninguém ri, ninguém diz que você está exagerando.',
    '"A gente já sabia que tava acelerando," diz a mulher do fogo. "A gente só não tinha feito conta."',
    'Em duas horas o acampamento está desmontado. Seis pessoas vão embora pro sul, a pé, no escuro, porque preferem andar no escuro a dormir a oitocentos metros de uma conta de quarenta dias.',
    'Uma delas volta antes de sair e te dá uma lanterna de cabeça.',
    '"Se for entrar, entra com as duas mãos livres."'
  ],
  ef:{flag:'esvaziou_o_acampamento',
      itens:{'Lanterna de cabeça':1},
      rep:{eixo:'bom',delta:2,motivo:'Tirou seis pessoas de perto antes de qualquer coisa acontecer'},
      registrar:'O acampamento do Túnel de Rocha foi desmontado depois do seu aviso.',
      presagio:'Entra com as duas mãos livres. Ela falou isso por experiência.'},
  escolhas:[
    {texto:'Entrar pelo portão.', vai:'c10_portao'},
    {texto:'Entrar pela subestação.', vai:'c10_subestacao'},
    {texto:'Entrar por um buraco da cerca.', vai:'c10_buraco'},
    {texto:'Ir embora com eles.', vai:'c10_foi_embora_avisado'}
  ]
},

c10_foi_embora:{
  texto:[
    'Você desce a encosta no sentido contrário.',
    'É uma decisão defensável. Você não é {técnico|técnica}, não é fiscal, não é {bombeiro|bombeira}, e não tem nenhuma obrigação com uma usina que a companhia abandonou há onze anos.',
    'Na estrada, cruza com um rapaz de bicicleta subindo pro lado do vale, de fone no ouvido.',
    'Ele passa por você sem olhar. Você não para ele.',
    'Você não tem obrigação nenhuma.',
    'Você também sabe o que tem lá embaixo, e ele não.'
  ],
  ef:{flag:'ignorou_usina', instabilidade:1, moral:-10,
      rep:{eixo:'ruim',delta:1,motivo:'Sabia do perigo na Rota 10 e não avisou ninguém'},
      registrar:'Foi embora da usina sem avisar ninguém do que sabia.'},
  escolhas:[
    {texto:'Voltar. Ainda dá tempo.', vai:'c10_portao'},
    {texto:'Seguir para Saffron.', vai:'c10_fim'},
    ...c10_voltarAoEdric('Voltar e contar o que você viu'),
    {texto:'Voltar e avisar o pessoal do túnel.', vai:'c10_avisou_o_tunel', cond:d=>!!d.flags.mediu_o_ciclo && !d.flags.esvaziou_o_acampamento}
  ]
},

/* ir embora depois de ter contado pra alguém: ninguém ficou sem saber */
c10_foi_embora_avisado:{
  texto:[
    'Você pega a estrada no sentido contrário, de volta.',
    'O que você sabe, você não guardou só pra você. Tem gente aqui que sabe também, e essa gente fica.',
    'Lá atrás, o zumbido continua do mesmo jeito. Daqui ele é só um som.'
  ],
  ef:{flag:'foi_embora_avisando', registrar:'Foi embora da usina depois de contar o que sabia.'},
  escolhas:[
    {texto:'Voltar. Ainda dá tempo.', vai:'c10_portao'},
    {texto:'Seguir para Saffron.', vai:'c10_fim'}
  ]
},

/* ─────────────── DENTRO ─────────────── */

c10_portao:{
  vozes:['E'],
  texto:[
    'O portão principal é de tubo e tela, com uma corrente e um cadeado de latão que enferrujou aberto — literalmente aberto, travado na posição destravada, enferrujado assim.',
    'Alguém abriu esse cadeado uma vez e nunca mais fechou, e a ferrugem escolheu esse formato.',
    'Na guarita ao lado, vazia, tem uma cadeira, um ventilador de mesa sem hélice, e um livro de ponto aberto na mesa.',
    d=>d.flags.sabe_da_data
      ? 'A última assinatura do livro de ponto é de doze de março de oitenta e nove, quatro dias depois do acidente.'
      : 'A última assinatura do livro de ponto é de doze de março de oitenta e nove.',
    'Embaixo da assinatura, na linha seguinte, alguém escreveu à mão e sem assinar:',
    '"não deixar ninguém entrar. nem da companhia."'
  ],
  ef:{flag:['entrou_na_usina','viu_o_livro_de_ponto'], executar:c10_estar('patio'),
      registrar:'No livro de ponto da guarita: "não deixar ninguém entrar. nem da companhia."',
      presagio:'Nem da companhia. Quem escreveu isso sabia de quem tinha medo.'},
  escolhas:[
    {texto:'Ir direto pro galpão de turbinas.', vai:'c10_galpao'},
    {texto:'Ir pra subestação — a fonte do zumbido.', vai:'c10_subestacao'},
    {texto:'Ir pra sala de controle.', vai:'c10_sala_controle'},
    {texto:'Ir pro vestiário e pro almoxarifado.', vai:'c10_vestiario'}
  ]
},

c10_sala_controle:{
  texto:[
    'A sala de controle fica num bloco de concreto separado, com porta dupla de aço e janela de vidro laminado com vista pro galpão.',
    'Lá dentro é 1989.',
    'Painel sinótico de parede inteira, com lâmpada incandescente atrás de cada indicador. Cadeira de escritório de rodinha, virada. Um copo plástico com café que virou um disco preto no fundo. Uma agenda de mesa aberta em março.',
    'E o painel está aceso.',
    'Não todo — quatro lâmpadas, num painel de cento e oitenta. Quatro lâmpadas incandescentes acesas há onze anos sem queimar, o que é impossível, porque lâmpada incandescente dura mil horas.',
    'As quatro são as dos transformadores de saída T1, T2, T3 e T4.',
    'E todas as quatro marcam a mesma coisa: **EM CARGA**.'
  ],
  ef:{flag:['viu_o_painel','sabe_dos_quatro_trafos'], executar:c10_estar('patio'),
      registrar:'Na sala de controle, quatro lâmpadas acesas há onze anos marcam os transformadores "EM CARGA".',
      presagio:'Mil horas de vida útil. Onze anos acesas. Alguma coisa alimenta aquelas lâmpadas.'},
  escolhas:[
    {texto:'Ler a agenda de mesa.', vai:'c10_agenda'},
    {texto:'Olhar o registro de porta — a hora em que o Silas saiu.', vai:'c10_registro_porta', cond:d=>!!d.flags.sabe_do_nivaldo},
    {texto:'Olhar o registro de porta.', vai:'c10_registro_porta', cond:d=>!d.flags.sabe_do_nivaldo},
    {texto:'Ir pra subestação ver os quatro transformadores.', vai:'c10_subestacao'},
    {texto:'Ir pro galpão.', vai:'c10_galpao'}
  ]
},

c10_agenda:{
  vozes:['E','E','E','E','E'],
  texto:[
    'A agenda de mesa é de uso coletivo — todo turno anotava o que precisava passar pro próximo.',
    'Fevereiro é normal e chato: "trocar lâmpada do corredor", "vem o pessoal da caldeira quinta", "aniversário do Wilson, vaquinha".',
    'Março começa a mudar.',
    '**02/03** — "zumbido na subestação à noite. avisei manutenção."',
    '**03/03** — "manutenção veio. mediu. disse que tá normal."',
    '**05/03** — "não tá normal."',
    '**06/03** — "os Pokémon do pátio tão tudo parado virado pra T3. mandei o rapaz espantar. voltaram."',
    '**07/03** — "espantei de novo. voltaram em vinte minutos. não vou espantar mais, dá dó."',
    '**08/03** — a linha está começada e não terminada. Tem três palavras e a caneta arrasta pro canto da página:',
    '"o Silas foi"'
  ],
  ef:{flag:['leu_a_agenda','sabe_que_voltavam'], moral:-8,
      rep:{eixo:'bom',delta:1,motivo:'Leu a agenda inteira em vez de só o último dia'},
      registrar:'A agenda da sala de controle: o zumbido começou em 02/03/89 e os Pokémon já se reuniam em 06/03.'},
  escolhas:[
    {texto:'Olhar o registro de porta.', vai:'c10_registro_porta'},
    {texto:'Levar a agenda.', vai:'c10_levou_a_agenda'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'},
    {texto:'Ir pro galpão.', vai:'c10_galpao'}
  ]
},

c10_levou_a_agenda:{
  texto:[
    'Você tira a agenda da mesa e coloca na mochila.',
    'Ela é pesada de um jeito desproporcional — capa dura, papel de gramatura alta, coisa de empresa dos anos oitenta.',
    'E quando você levanta ela da mesa, fica a marca: um retângulo limpo no meio de onze anos de poeira.',
    'Você olha o retângulo limpo por mais tempo do que faz sentido.',
    'É a primeira coisa que muda nessa sala desde março de oitenta e nove, e foi você que mudou.'
  ],
  ef:{flag:'tem_a_agenda',
      itens:{'Agenda da sala de controle':1},
      rep:{eixo:'bom',delta:2,motivo:'Levou o único documento que restou do turno da madrugada'},
      registrar:'Levou a agenda da sala de controle da usina.',
      presagio:'O retângulo limpo. Você deixou uma marca num lugar que ninguém visita.'},
  escolhas:[
    {texto:'Olhar o registro de porta.', vai:'c10_registro_porta'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'},
    {texto:'Ir pro galpão.', vai:'c10_galpao'},
    ...c10_voltarAoEdric('Sair e levar a agenda')
  ]
},

c10_agenda_pro_eloi:{
  falante:'Sr. Edric',
  vozes:['N','N','N','N'],
  texto:[
    'Você entrega a agenda.',
    'Ele reconhece a capa antes de abrir. Segura ela fechada no colo por uns quinze segundos.',
    'Depois abre em março e lê, com o dedo, linha por linha, e nas anotações dos dias cinco, seis e sete ele começa a balançar a cabeça devagar.',
    '"Essa letra é a minha."',
    'Pausa longa.',
    '"Cinco, seis e sete de março sou eu. Eu que escrevi ‘não tá normal’. Eu que escrevi ‘não vou espantar mais, dá dó’."',
    '"Eu passei onze anos achando que eu tinha avisado e que ninguém me ouviu."',
    'Ele fecha a agenda.',
    '"Eu escrevi numa agenda de mesa. Eu não avisei ninguém. Eu escrevi numa agenda."'
  ],
  ef:{flag:['eloi_leu_a_agenda','eloi_e_a_letra'],
      npc:{nome:'Sr. Edric', opiniao:7, memoria:'Descobriu, com você na frente, que a letra dos dias 5, 6 e 7 de março é a dele.'},
      moral:-10,
      rep:{eixo:'bom',delta:2,motivo:'Devolveu a um homem a verdade sobre o que ele fez e não fez'},
      registrar:'A letra da agenda nos dias 5, 6 e 7 de março é do Sr. Edric.',
      presagio:'Ele escreveu numa agenda. Pensa em quantas vezes você fez exatamente isso.'},
  escolhas:[
    {texto:'"Você avisou. Só não teve quem lesse."', vai:'c10_consolou_eloi'},
    {texto:'"É. Você não avisou."', vai:'c10_foi_duro_com_eloi'},
    {texto:'Não dizer nada e voltar pra usina.', vai:'c10_galpao'},
    {texto:'Ficar sentad{o|a} com ele um tempo.', vai:'c10_sentou_com_eloi'}
  ]
},

c10_consolou_eloi:{
  falante:'Sr. Edric',
  vozes:['P','N','N','N','N','N'],
  texto:[
    '"Você avisou. Só não teve quem lesse."',
    'Ele balança a cabeça, e é um não.',
    '"{Garoto|Garota}, essa frase é gentil e eu agradeço, mas eu passei dezenove anos numa sala de controle."',
    '"Numa sala de controle, quando é sério, você não escreve. Você pega o rádio. Você liga pro supervisor em casa, de madrugada, e aguenta ele gritar com você, e no dia seguinte todo mundo reclama que o Edric é exagerado."',
    '"Eu não quis ser o exagerado."',
    'Ele bate duas vezes na capa da agenda com a ponta do dedo.',
    '"Custou vinte e seis anos de vida de outra pessoa eu não querer ser o exagerado."',
    'Silêncio.',
    '"Vai lá dentro e seja o exagerado. É de graça e ninguém morre disso."'
  ],
  ef:{flag:'licao_do_eloi', moral:10,
      npc:{nome:'Sr. Edric', opiniao:8, memoria:'Te disse, com a agenda no colo, para ser o exagerado.'},
      rep:{eixo:'bom',delta:2,motivo:'Ficou para ouvir a parte difícil'},
      registrar:'"Vai lá dentro e seja o exagerado."'},
  escolhas:[
    {texto:'Voltar pra usina.', vai:'c10_galpao'},
    {texto:'Voltar pela subestação.', vai:'c10_subestacao'},
    {texto:'Ficar sentad{o|a} com ele mais um pouco.', vai:'c10_sentou_com_eloi'},
    {texto:'Ir embora de vez.', vai:'c10_foi_embora_avisado'}
  ]
},

c10_foi_duro_com_eloi:{
  falante:'Sr. Edric',
  vozes:['P','N','N','N'],
  texto:[
    '"É. Você não avisou."',
    'Ele não se defende. Não pisca. Não desvia.',
    '"Não avisei."',
    'E fica quieto, com a agenda no colo, olhando a usina, e o silêncio dura tempo suficiente pra você começar a se arrepender e não ter mais como voltar atrás.',
    'Depois de muito tempo ele fala, sem rancor nenhum, o que é pior do que se tivesse:',
    '"Obrigado por não fazer aquela cara."',
    '"Todo mundo faz a cara. A cara é pior que a frase."'
  ],
  ef:{flag:'foi_duro_com_eloi', moral:-5,
      npc:{nome:'Sr. Edric', opiniao:5, memoria:'Você disse na cara dele que ele não avisou. Ele agradeceu por você não ter feito a cara.'},
      rep:{eixo:'bom',delta:1,motivo:'Disse a verdade a um velho em vez de confortar'}},
  escolhas:[
    {texto:'Voltar pra usina.', vai:'c10_galpao'},
    {texto:'Voltar pela subestação.', vai:'c10_subestacao'},
    {texto:'"Desculpa."', vai:'c10_sentou_com_eloi'},
    {texto:'Ir embora de vez.', vai:'c10_foi_embora_avisado'}
  ]
},

c10_sentou_com_eloi:{
  falante:'Sr. Edric',
  vozes:['N','N'],
  texto:[
    'Você senta na brita do lado da cadeira de praia e não fala nada, e ele também não.',
    'Ficam assim uns quarenta minutos, com a usina zumbindo ali na frente.',
    'Em algum momento ele oferece café de uma garrafa térmica de plástico. É café com muito açúcar, do jeito que se faz café quando é pra passar a noite.',
    'Depois de muito tempo ele fala uma coisa só:',
    '"Meu pai também trabalhou nessa usina. Ele ajudou a construir, em cinquenta e oito."',
    '"Três gerações de uma família olhando pro mesmo prédio e nenhuma delas entendeu o que tem dentro."',
    'E depois vocês voltam a não falar nada, e é confortável, e é a coisa mais calma que aconteceu com você em muitas semanas.'
  ],
  ef:{flag:'noite_com_eloi', moral:12, hp:3,
      npc:{nome:'Sr. Edric', opiniao:7, memoria:'Passaram quarenta minutos em silêncio na brita, tomando café com açúcar demais.'},
      rep:{eixo:'bom',delta:1,motivo:'Sentou em silêncio com alguém que precisava de companhia'},
      presagio:'Três gerações olhando pro mesmo prédio. Você é a quarta pessoa a olhar.'},
  escolhas:[
    {texto:'Entrar na usina.', vai:'c10_galpao'},
    {texto:'Entrar pela subestação.', vai:'c10_subestacao'},
    {texto:'Entrar pela sala de controle.', vai:'c10_sala_controle'},
    {texto:'Ir embora com ele quando amanhecer.', vai:'c10_foi_embora_avisado', ef:{executar:d=>{ c10_ate(6); return []; }}}
  ]
},

c10_registro_porta:{
  texto:[
    'O registro de porta é uma fita de papel contínuo numa impressora térmica, dessas de relógio de ponto, e ela imprimiu até acabar o rolo.',
    'Você desenrola até oito de março.',
    '**05:31 — P2 ABERTA (EXTERNA)**',
    '**05:33 — P2 FECHADA**',
    '**05:38 — P1 ABERTA (CONTROLE→GALPÃO)**',
    d=>d.flags.sabe_do_nivaldo
      ? 'E aí a parte que ninguém te contou, porque o Sr. Edric só sabe do 05:38:'
      : 'Antes disso, a última entrada é das vinte e três da véspera: a troca de turno. Um homem só pra madrugada inteira.',
    '**05:31 — P2 ABERTA (EXTERNA)** quer dizer que alguém entrou na usina pela porta externa sete minutos antes.',
    d=>d.flags.sabe_do_nivaldo
      ? 'Alguém que não era o Silas, porque o Silas já estava dentro desde as vinte e três.'
      : 'Alguém que não era o operador do turno, porque ele já estava dentro desde as vinte e três.',
    'Tinha mais alguém na usina naquela madrugada.'
  ],
  ef:{flag:'sabe_da_segunda_pessoa',
      rep:{eixo:'bom',delta:3,motivo:'Achou nos registros a pessoa que ninguém procurou'},
      instabilidade:1,
      registrar:'O registro de porta mostra alguém entrando na usina às 05:31 de 08/03/89 — sete minutos antes.',
      presagio:'Tinha mais alguém. Onze anos e ninguém desenrolou o rolo de papel.'},
  escolhas:[
    {texto:'Arrancar o trecho e guardar.', vai:'c10_guardou_registro'},
    {texto:'Ir pro galpão. Perguntas depois.', vai:'c10_galpao'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'}
  ]
},

c10_guardou_registro:{
  texto:[
    'Você rasga a fita no vinco, com cuidado, uns quarenta centímetros de papel térmico que já está marrom nas bordas.',
    'Papel térmico apaga com o tempo e com o calor, e esse já está quase ilegível nos números de cima.',
    'Você dobra em dois e põe entre duas páginas do seu caderno, que é o lugar mais seguro que você tem.'
  ],
  ef:{flag:'tem_o_registro',
      itens:{'Fita do registro de porta':1},
      registrar:'Guardou a fita do registro de porta de 08/03/89.',
      presagio:'Papel térmico apaga. Você tem um prazo que não sabe qual é.'},
  escolhas:[
    ...c10_voltarAoEdric('Sair e mostrar a fita'),
    {texto:'Ir pro galpão.', vai:'c10_galpao'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'},
    {texto:'Ir pro vestiário.', vai:'c10_vestiario'}
  ]
},

c10_registro_pro_eloi:{
  falante:'Sr. Edric',
  vozes:['N','N','N','N','N','N'],
  texto:[
    'Você mostra a fita. Ele pega com as duas mãos e lê com o braço esticado, porque esqueceu os óculos.',
    '"Cinco e trinta e um."',
    'Ele lê de novo.',
    '"Cinco e trinta e um, porta externa."',
    'Ele abaixa a fita.',
    '"{Garoto|Garota}, eu chegava às sete. O turno da madrugada era um homem só. Não tinha ninguém pra abrir a P2 às cinco e trinta e um."',
    'Longa pausa.',
    '"A não ser que a P2 não tenha sido aberta por uma pessoa."',
    'Vocês dois olham pro galpão ao mesmo tempo, sem combinar.',
    '"Os buracos da cerca," ele diz. "Os buracos da cerca são do tamanho de quê, você reparou?"'
  ],
  ef:{flag:['p2_nao_foi_pessoa','sabe_da_segunda_pessoa'],
      npc:{nome:'Sr. Edric', opiniao:6, memoria:'Leu com você a fita do registro de porta e entendeu o que ela quer dizer.'},
      rep:{eixo:'bom',delta:2,motivo:'Levou a descoberta pra quem podia interpretar'},
      instabilidade:1,
      registrar:'A porta externa foi aberta às 05:31 sem ninguém para abri-la.'},
  escolhas:[
    {texto:'Voltar e ir direto pro galpão.', vai:'c10_galpao'},
    {texto:'Voltar pela subestação.', vai:'c10_subestacao'},
    {texto:'Ir ver a porta P2 de perto.', vai:'c10_porta_p2'},
    {texto:'Ir pro vestiário.', vai:'c10_vestiario'}
  ]
},

c10_porta_p2:{
  texto:[
    'A porta P2 fica na lateral leste do bloco de controle e é uma porta de aço de folha única, com barra antipânico e fechadura elétrica.',
    'Ela está fechada.',
    'A barra antipânico está torta pra dentro, e a chapa da porta tem um amassado raso e largo na altura do peito, com a tinta descascada em anel.',
    'No meio do amassado, a tinta não descascou: derreteu e voltou a endurecer, igualzinho à borda dos buracos da cerca.',
    'Você põe a mão aberta em cima do amassado.',
    'A sua mão é pequena demais. O amassado tem o dobro da sua mão, e é redondo.'
  ],
  ef:{flag:'viu_a_p2', executar:c10_estar('patio'),
      moral:-5,
      registrar:'A porta P2 tem um amassado redondo, com tinta derretida, do dobro do tamanho de uma mão.',
      presagio:'Redondo. Do dobro. E abriu uma porta de aço por fora.'},
  escolhas:[
    {texto:'Ir pro galpão.', vai:'c10_galpao'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'},
    {texto:'Ir pro vestiário.', vai:'c10_vestiario'},
    {texto:'Sair da usina agora, enquanto dá.', vai:'c10_saiu'}
  ]
},

c10_vestiario:{
  texto:[
    'O vestiário tem trinta e dois armários de chapa, dois bancos de madeira e um chuveiro que pinga.',
    'Um chuveiro que pinga numa usina sem água encanada há onze anos.',
    'Vinte e nove armários estão abertos e vazios — a companhia mandou o pessoal esvaziar quando fechou, e o pessoal esvaziou.',
    'Três estão fechados com cadeado.',
    'No 14 tem uma etiqueta de fita adesiva com um nome escrito a caneta, já quase apagado: **SILAS V.**'
  ],
  ef:{flag:'achou_o_armario', executar:c10_estar('patio'),
      registrar:'No vestiário da usina, o armário 14 ainda está trancado com o nome do Silas.',
      presagio:'Ninguém teve coragem de esvaziar aquele armário. Por onze anos.'},
  escolhas:[
    {texto:'Arrombar o armário 14.', vai:'c10_armario_14'},
    {texto:'Não abrir. Não é seu.', vai:'c10_nao_abriu_armario'},
    {texto:'Abrir os outros dois cadeados.', vai:'c10_outros_armarios'},
    {texto:'Ir pro almoxarifado.', vai:'c10_almoxarifado'}
  ]
},

c10_armario_14:{
  texto:[
    'O cadeado é pequeno e a chapa do armário é fina. Não é difícil. É só desagradável.',
    'Dentro: um uniforme azul dobrado no fundo, uma caneca com o escudo de um ginásio, uma bota de segurança número quarenta e dois com o cadarço ainda amarrado do jeito que se deixa pra calçar rápido, e um espelhinho colado na porta.',
    'Colada do lado do espelhinho, uma foto pequena, três por quatro, de uma mulher de uns cinquenta anos.',
    'Atrás da foto, escrito a caneta: **mãe — 71**.',
    'E pendurado no gancho, um rádio comunicador da companhia, daqueles de ombro, com a bateria conectada.',
    'Você aperta o botão por reflexo.',
    'Ele chia.',
    'Um rádio de bateria de níquel, onze anos num armário fechado, chia quando você aperta.'
  ],
  ef:{flag:['abriu_o_armario','tem_o_radio'],
      itens:{'Rádio da companhia':1},
      moral:-10,
      rep:{eixo:'ruim',delta:1,motivo:'Arrombou o armário de um morto'},
      registrar:'Abriu o armário do Silas. O rádio da companhia ainda tem carga.'},
  escolhas:[
    {texto:'Levar o rádio.', vai:'c10_almoxarifado'},
    {texto:'Levar a foto pra devolver à família.', vai:'c10_pegou_a_foto'},
    {texto:'Fechar tudo do jeito que estava.', vai:'c10_nao_abriu_armario'},
    {texto:'Ir pro galpão.', vai:'c10_galpao'}
  ]
},

c10_pegou_a_foto:{
  texto:[
    'Você descola a foto da porta do armário com cuidado, porque a fita adesiva de onze anos rasga o papel se você tiver pressa.',
    'Ela sai inteira.',
    d=>Estado.contaItem('Fita do registro de porta')>0
      ? 'Você põe entre as páginas do caderno, do outro lado da fita do registro de porta.'
      : 'Você põe entre as páginas do caderno, que é o lugar mais seguro que você tem.',
    'Não é seu. Não é pra você. Você não sabe nem o sobrenome dele direito — a etiqueta diz SILAS V.',
    'Mas "mãe — 71" escrito atrás de uma foto quer dizer que em algum lugar existe ou existiu uma mulher que não sabe que o filho dela guardava a foto dela no armário.',
    'E isso é uma coisa que dá pra devolver.'
  ],
  ef:{flag:'tem_a_foto',
      itens:{'Foto três por quatro':1},
      moral:5,
      rep:{eixo:'bom',delta:2,motivo:'Guardou uma coisa para devolver a quem nunca soube dela'},
      registrar:'Pegou a foto da mãe do Silas para devolver.',
      presagio:'Mãe — 71. Ele colou ali, onde ia olhar toda vez que trocasse de roupa.'},
  escolhas:[
    {texto:'Ir pro almoxarifado.', vai:'c10_almoxarifado'},
    {texto:'Ir pro galpão.', vai:'c10_galpao'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'},
    ...c10_voltarAoEdric('Sair e mostrar a foto')
  ]
},

c10_foto_pro_eloi:{
  falante:'Sr. Edric',
  vozes:['N','P','N','N','N'],
  texto:[
    'Você mostra a foto.',
    'Ele olha por três segundos e diz o nome sem hesitar:',
    '"Sra. Vesna. Mora em Lavender, rua de trás do cemitério, casa com portão verde."',
    '"Ela ainda tá viva?"',
    '"Tava no fim do ano. Eu levo bolo de frutas todo fim de ano e ela não abre a porta, mas o bolo some do degrau, então ela tá."',
    'Ele devolve a foto com as duas mãos.',
    '"Leva você. De mim ela não aceita nada há onze anos, porque eu sou da companhia e pra ela a companhia matou o filho dela."',
    'Pausa.',
    '"E ela tem razão."'
  ],
  ef:{flag:['sabe_da_almerinda','endereco_almerinda'],
      npc:{nome:'Sr. Edric', opiniao:6, memoria:'Te deu o endereço da mãe do Silas em Lavender e não quis entregar a foto ele mesmo.'},
      moral:5,
      registrar:'Sra. Vesna, mãe do Silas, mora em Lavender, na rua de trás do cemitério.',
      presagio:'O bolo de frutas some do degrau. Ela está viva e não abre a porta.'},
  escolhas:[
    {texto:'Mostrar outra coisa.', vai:'c10_de_volta_ao_acude'},
    {texto:'Voltar e entrar no galpão.', vai:'c10_galpao'},
    {texto:'Voltar pela subestação.', vai:'c10_subestacao'},
    {texto:'Voltar pra sala de controle.', vai:'c10_sala_controle'}
  ]
},

c10_nao_abriu_armario:{
  texto:[
    'Você não abre.',
    'Fica olhando a etiqueta de fita adesiva com o nome quase apagado por um tempo que não dá pra medir, e depois vira as costas.',
    'Tem uma coisa que você não sabe explicar e que é verdadeira: aquele armário é a única coisa naquela usina inteira que ainda pertence a alguém.',
    'Tudo mais é da companhia, e a companhia foi embora.',
    'Aquilo ali é do Silas.'
  ],
  ef:{flag:'respeitou_o_armario',
      rep:{eixo:'bom',delta:2,motivo:'Não abriu o armário de um morto'},
      moral:5,
      presagio:'A única coisa que ainda pertence a alguém. E você deixou pertencer.'},
  escolhas:[
    {texto:'Ir pro almoxarifado.', vai:'c10_almoxarifado'},
    {texto:'Ir pro galpão.', vai:'c10_galpao'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'},
    {texto:'Ir pra sala de controle.', vai:'c10_sala_controle'}
  ]
},

c10_outros_armarios:{
  texto:[
    'Os outros dois cadeados cedem fácil.',
    'No primeiro: nada. Vazio, limpo, com um cabide. Alguém trancou um armário vazio e foi embora, o que é engraçado de um jeito triste.',
    'No segundo: um par de luvas de eletricista classe 2, de borracha, dentro de um saco plástico com sílica — do jeito certo de guardar, o que quer dizer que o dono sabia o que estava fazendo.',
    'Luva classe 2 aguenta dezessete mil volts.',
    'Você calça. Serve mal, sobra três dedos, e é infinitamente melhor do que não ter.'
  ],
  ef:{flag:'tem_luva',
      itens:{'Luva de eletricista':1},
      rep:{eixo:'bom',delta:1,motivo:'Se equipou antes de mexer com o que não entende'},
      registrar:'Achou um par de luvas de eletricista classe 2 no vestiário.'},
  escolhas:[
    {texto:'Ir pro almoxarifado.', vai:'c10_almoxarifado'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'},
    {texto:'Ir pro galpão.', vai:'c10_galpao'},
    {texto:'Abrir o armário 14.', vai:'c10_armario_14'}
  ]
},

c10_almoxarifado:{
  texto:[
    'O almoxarifado é uma sala comprida com prateleira de metal dos dois lados e uma bancada no fundo.',
    'A maior parte do estoque virou pó: papelão desmanchando, borracha ressecada, parafuso oxidado num pote de vidro.',
    'Mas tem coisa boa, porque almoxarifado de usina é generoso: rolo de fita isolante ainda maleável, um multímetro analógico, três lanternas de mão com pilha estufada, um estojo de primeiros socorros vencido em noventa e um.',
    'E, na bancada do fundo, encostado na parede, um objeto que não é da companhia:',
    'Uma mochila de lona. Pequena. De criança.',
    'Aberta, com as coisas espalhadas na bancada como quem foi interrompido no meio de arrumar: um caderno, dois lápis, um pote de comida vazio e três Pokébolas usadas, abertas, vazias.'
  ],
  ef:{flag:['achou_a_mochila','tem_multimetro'], executar:c10_estar('patio'),
      itens:{'Multímetro':1,'Fita isolante':1},
      registrar:'Achou no almoxarifado uma mochila de criança com três Pokébolas vazias.',
      presagio:'Alguém mais novo que você esteve aqui. E deixou a mochila.'},
  escolhas:[
    {texto:'Ler o caderno.', vai:'c10_caderno_da_mochila'},
    {texto:'Ir pro galpão.', vai:'c10_galpao'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'},
    {texto:'Ir pra sala de controle.', vai:'c10_sala_controle'}
  ]
},

c10_caderno_da_mochila:{
  vozes:['E'],
  texto:[
    'O caderno é de matemática, quadriculado, e não tem conta nenhuma.',
    'Tem lista.',
    'Página 1: "Pichu? não tem em Kanto" / "Voltorb — 40+" / "Magnemite — 12" / "Electabuzz — 1, longe".',
    d=>d.flags.viu_os_raios
      ? 'Página 2: horário. Igual ao seu: raio, raio, estalo, com a hora de cada um. Repetido por catorze dias, com letra ficando pior.'
      : 'Página 2: horário. Raio, raio, estalo, com a hora de cada um. Repetido por catorze dias, com letra ficando pior.',
    'Página 3 é a última escrita e tem uma frase só, grande, no meio da página:',
    '"eles não estão presos. eu perguntei e eles não estão presos."',
    'O resto do caderno é em branco.',
    'Na contracapa, a caneta, um nome e uma data: **Toby — janeiro**.',
    d=>d.flags.sabe_dos_que_entraram
      ? 'Janeiro. O pessoal do túnel falou de alguém que entrou sozinho em janeiro, saiu, não falou com ninguém e foi embora andando pro sul deixando a barraca armada.'
      : 'Janeiro. Quem escreveu isso esteve aqui antes de você sair de casa.'
  ],
  ef:{flag:['leu_o_caderno_do_teco','sabe_que_nao_estao_presos'],
      itens:{'Caderno do Toby':1},
      rep:{eixo:'bom',delta:2,motivo:'Leu o caderno de quem chegou antes'},
      moral:-5,
      registrar:'O caderno do Toby, de janeiro: "eles não estão presos. eu perguntei e eles não estão presos."'},
  escolhas:[
    {texto:'Levar o caderno e a mochila.', vai:'c10_levou_a_mochila'},
    {texto:'Ir pro galpão perguntar a mesma coisa.', vai:'c10_galpao'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'},
    ...c10_voltarAoEdric('Sair e mostrar o caderno')
  ]
},

c10_levou_a_mochila:{
  texto:[
    'Você junta as coisas do Toby na mochila de lona e amarra ela na sua.',
    'Três Pokébolas vazias e abertas. Você fica com elas na mão um tempo antes de guardar.',
    'Pokébola aberta e vazia quer dizer uma de duas coisas: ou o Pokémon saiu, ou nunca entrou.',
    'As três estão sem arranhão de queda e sem marca de solo.',
    'Ele não jogou. Ele abriu.',
    d=>d.flags.sabe_dos_que_entraram
      ? 'Ele abriu as três Pokébolas dele no meio de uma usina e soltou os três, e depois foi embora a pé pro sul sem falar com ninguém.'
      : 'Ele abriu as três Pokébolas dele no meio de uma usina e soltou os três, e depois foi embora sem elas.'
  ],
  ef:{flag:['tem_a_mochila_do_teco','sabe_que_ele_soltou'],
      itens:{'Poké Ball':3},
      moral:-5, instabilidade:1,
      rep:{eixo:'bom',delta:1,motivo:'Entendeu o que as três Pokébolas vazias queriam dizer'},
      registrar:'O Toby abriu as três Pokébolas dele dentro da usina e soltou os três.'},
  escolhas:[
    {texto:'Ir pro galpão.', vai:'c10_galpao'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'},
    {texto:'Ir pra sala de controle.', vai:'c10_sala_controle'},
    ...c10_voltarAoEdric('Sair e mostrar o caderno')
  ]
},

/* ─────────────── A SUBESTAÇÃO ─────────────── */

c10_subestacao:{
  texto:[
    'A subestação fica nos fundos, num pátio cercado à parte, e é onde o zumbido vira som físico.',
    'Você sente no maxilar antes de sentir no ouvido. Os dentes de trás vibram. É desagradável de um jeito que não dói.',
    'Quatro transformadores de saída, T1 a T4, cada um do tamanho de um carro, com aleta de refrigeração e placa de identificação esmaltada.',
    'Estão energizados. Numa usina desligada há onze anos, com a linha de transmissão fisicamente cortada a quatrocentos metros daqui, os quatro estão energizados e quentes.',
    'E o T3 é diferente dos outros três.',
    'O T3 tem a carcaça amassada pra dentro em quatro pontos, com a tinta derretida em anel em volta de cada amassado.',
    'Quatro amassados redondos, do dobro de uma mão, na carcaça de aço de um transformador de onze toneladas.'
  ],
  ef:{flag:['viu_a_subestacao','viu_o_t3'], executar:c10_estar('subestacao'),
      registrar:'Os quatro transformadores estão energizados. O T3 tem quatro amassados redondos com tinta derretida.',
      presagio:'T3. Quatro amassados num só, e nenhum nos outros três.'},
  escolhas:[
    {texto:'Medir com o multímetro.', vai:'c10_mediu', cond:d=>Estado.contaItem('Multímetro')>0},
    {texto:'Seguir as marcas de queimadura no chão.', vai:'c10_marcas'},
    {texto:'Desligar os transformadores.', vai:'c10_desligou'},
    {texto:'Ir pro galpão.', vai:'c10_galpao'}
  ]
},

c10_mediu:{
  texto:[
    'Você encosta as pontas de prova na carcaça aterrada do T1, que é o que se faz quando não se sabe o que se está fazendo mas se leu o manual.',
    'O ponteiro do multímetro analógico sobe e para.',
    'Depois desce. Depois sobe de novo.',
    'Ele não está oscilando aleatoriamente. Ele está fazendo um padrão: sobe, para, sobe, para, para, sobe.',
    'Você fica olhando o ponteiro por quase dois minutos antes de entender por que o padrão te incomoda.',
    'É porque é sempre o mesmo padrão. Repetido. Com intervalo igual.',
    'Um transformador defeituoso oscila sujo, aleatório. Esse aqui está repetindo uma sequência de seis.',
    'Você anota a sequência no caderno sem saber pra quê e a mão treme um pouco na terceira repetição.'
  ],
  ef:{flag:['mediu_a_sequencia','sabe_da_sequencia'],
      rep:{eixo:'bom',delta:3,motivo:'Mediu em vez de supor'},
      instabilidade:1,
      registrar:'O T1 repete uma sequência de seis pulsos com intervalo constante.',
      presagio:'Repetição com intervalo constante não é defeito. É mensagem ou é relógio.'},
  escolhas:[
    {texto:'Medir os outros três.', vai:'c10_mediu_todos'},
    {texto:'Seguir as marcas no chão.', vai:'c10_marcas'},
    {texto:'Ir pro galpão com a sequência anotada.', vai:'c10_galpao'},
    {texto:'Desligar os transformadores.', vai:'c10_desligou'}
  ]
},

c10_mediu_todos:{
  texto:[
    'Você mede os quatro.',
    'T1: sequência de seis. T2: sequência de seis, igual. T4: sequência de seis, igual.',
    'T3: sequência de seis, e depois uma sétima que os outros não têm.',
    'Você refaz. Confere o contato. Limpa a ponta de prova na calça. Mede de novo.',
    'Sete no T3. Seis nos outros.',
    'E o sétimo pulso do T3 é maior que os outros seis somados — o ponteiro bate no fim da escala e o multímetro faz aquele clique de fundo de curso.',
    'Você desliga o aparelho e senta na brita do pátio da subestação, de costas pro T3, e respira.',
    'Três dos quatro transformadores estão repetindo. Um está respondendo.'
  ],
  ef:{flag:['t3_responde','sabe_da_sequencia'], executar:c10_estar('subestacao'),
      rep:{eixo:'bom',delta:3,motivo:'Mediu os quatro e achou a diferença'},
      instabilidade:1, moral:-5,
      registrar:'Três transformadores repetem. O T3 responde, com um sétimo pulso maior que os seis.',
      presagio:'Três repetem, um responde. Você já sabe qual é qual — só não quer escrever.'},
  escolhas:[
    {texto:'Seguir as marcas no chão até o galpão.', vai:'c10_marcas'},
    {texto:'Ir pro galpão.', vai:'c10_galpao'},
    {texto:'Desligar os transformadores.', vai:'c10_desligou'},
    ...c10_voltarAoEdric('Sair e contar isso')
  ]
},

c10_marcas:{
  texto:[
    'O chão de concreto da subestação está cheio de marcas de queimadura.',
    'Não são manchas. São formas.',
    'Pegadas. Grandes, de três dedos pra frente e um pra trás, com uns quarenta centímetros de comprimento, queimadas no concreto a uma profundidade de talvez três milímetros.',
    'Elas saem da base do T3, atravessam o pátio da subestação, passam pelo trecho de cerca que não existe, e entram no galpão de turbinas pela porta de carga.',
    'E aí a parte que muda a sua respiração: as pegadas vão e voltam.',
    'Tem trilha nos dois sentidos, e as de ida estão mais fundas que as de volta.',
    'Mais fundas na ida quer dizer mais pesado na ida.',
    'Alguma coisa vai até o T3 carregada e volta pro galpão mais leve.'
  ],
  ef:{flag:['seguiu_as_marcas','sabe_do_trajeto'],
      rep:{eixo:'bom',delta:2,motivo:'Leu o chão em vez de correr'},
      registrar:'Pegadas queimadas ligam o T3 ao galpão, mais fundas na ida do que na volta.',
      presagio:'Mais pesado na ida. Alguma coisa leva carga até lá e volta sem.'},
  escolhas:[
    {texto:'Seguir as marcas até o galpão.', vai:'c10_galpao'},
    {texto:'Voltar e olhar a base do T3 de perto.', vai:'c10_base_t3'},
    {texto:'Desligar os transformadores.', vai:'c10_desligou'},
    {texto:'Sair da usina. Chega.', vai:'c10_saiu'}
  ]
},

c10_base_t3:{
  texto:[
    'A base do T3 é uma laje de concreto com quatro chumbadores e um poço de contenção de óleo em volta.',
    'O poço deveria ter óleo isolante vazado, que é o que transformador velho faz.',
    'Não tem óleo.',
    'Tem penas.',
    'Penas amarelas, rígidas, de uns vinte centímetros, empilhadas no fundo do poço de contenção numa camada de talvez trinta centímetros de espessura, prensadas pelo próprio peso nas camadas de baixo.',
    'Trinta centímetros de penas leva anos pra acumular.',
    'Você pega uma. Ela é pesada demais pra ser pena — pesa como se fosse de metal, e é morna, e quando você fecha a mão em volta dela a sua palma arrepia.',
    'Isso não é ninho. Ninho fica em cima.',
    'Isso é o chão de um lugar onde alguma coisa dorme faz muito tempo.'
  ],
  ef:{flag:['achou_as_penas','sabe_que_mora_ali'], executar:c10_estar('subestacao'),
      itens:{'Pena elétrica':1},
      rep:{eixo:'bom',delta:1,motivo:'Olhou dentro do poço de contenção'},
      registrar:'No poço de contenção do T3 há trinta centímetros de penas amarelas acumuladas.',
      presagio:'Trinta centímetros. O que dorme aqui dorme desde muito antes de oitenta e nove.'},
  escolhas:[
    {texto:'Seguir as marcas até o galpão.', vai:'c10_galpao'},
    {texto:'Desligar os transformadores.', vai:'c10_desligou'},
    {texto:'Sair da usina.', vai:'c10_saiu'},
    {texto:'Esperar ali, ao lado do poço, até ela voltar.', vai:'c10_esperou_no_poco'}
  ]
},

c10_esperou_no_poco:{
  texto:[
    'Você senta na borda do poço de contenção, em cima de trinta centímetros de pena, e espera.',
    'Uma hora e quarenta.',
    'Às dezoito e trinta e quatro o zumbido sobe de tom e você sente no maxilar.',
    'Às dezoito e quarenta um raio cai no galpão, a duzentos metros, e o clarão te cega por dois segundos.',
    'Às dezoito e quarenta e um o pátio da subestação escurece de uma vez porque alguma coisa passou entre você e o céu.',
    'Ela pousa do outro lado do T3, e o transformador de onze toneladas range.',
    'Você está sentad{o|a} na cama dela.'
  ],
  ef:{flag:'esperou_zapdos',
      executar:d=>{ d.flags.c10_onde = 'subestacao'; c10_ate(18); Estado.lend(145).encontros++; return []; },
      instabilidade:1,
      registrar:'Esperou no poço de contenção até Zapdos voltar.',
      presagio:'Ela pousou do outro lado do T3. Não do seu.'},
  escolhas:[
    {texto:'Ficar absolutamente imóvel.', vai:'c10_imovel'},
    {texto:'Sair de lado, devagar, sem virar as costas.', vai:'c10_saiu_de_lado'},
    {texto:'Falar com ela.', vai:'c10_falou_no_poco'},
    {texto:'Atacar.', vai:'c10_zapdos'}
  ]
},

c10_imovel:{
  texto:[
    'Você não se mexe.',
    'Nem um milímetro, por quatro minutos, com a mão fechada em cima de uma pena morna e o coração fazendo um barulho que você tem certeza de que ela escuta.',
    'Ela anda em volta do T3. Duas voltas completas, devagar, com aquele passo de ave grande que é meio ridículo e meio terrível.',
    'Na segunda volta ela para na sua frente, a três metros.',
    'Olha.',
    'E depois faz a coisa que te desmonta: ela ignora você e entra no poço, e deita na pena, encostada no seu joelho, e fecha os olhos.',
    'Você fica mais uma hora sentad{o|a} na borda de um poço de contenção com uma ave lendária dormindo encostada na sua perna.',
    'Não tem música. Não tem clarão. Não tem nada. Só um Pokémon muito velho e muito cansado dormindo do lado de {um estranho|uma estranha} que não fez movimento brusco.'
  ],
  ef:{flag:['zapdos_dormiu_do_lado','respeitou_zapdos'],
      executar:d=>{ const L=Estado.lend(145); if(L.disposicao!=='hostil') L.disposicao='passivo';
        return [{tipo:'mundo', texto:'Zapdos dormiu encostada em você. Isso não acontece.'}]; },
      rep:{eixo:'bom',delta:4,motivo:'Ficou imóvel e virou parte do lugar'},
      moral:15,
      registrar:'Zapdos dormiu encostada no seu joelho no poço de contenção do T3.',
      presagio:'Muito velha e muito cansada. Não é fúria o que move isso.'},
  escolhas:[
    {texto:'Sair sem acordar ela.', vai:'c10_saiu'},
    {texto:'Ficar até ela acordar.', vai:'c10_falou_no_poco'},
    {texto:'Ir pro galpão enquanto ela dorme.', vai:'c10_galpao', ef:{flag:'c10_ela_dorme_no_poco'}},
    {texto:'Tentar a captura agora, dormindo.', vai:'c10_traicao_zapdos'}
  ]
},

c10_saiu_de_lado:{
  texto:[
    'Você levanta devagar, de lado, sem tirar o olho dela e sem encarar direto, que é o que se faz com Pokémon grande.',
    'Ela acompanha com a cabeça. Não ataca.',
    'Você recua vinte metros de costas e só então vira, e nas costas vem um som que não é grito nem trovão: é um estalo baixo, curto, duas vezes.',
    'Você não sabe dizer se aquilo foi ameaça ou tchau.'
  ],
  ef:{flag:'recuou_do_poco',
      executar:d=>{ const L=Estado.lend(145); if(L.disposicao!=='hostil') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:1,motivo:'Recuou de um lendário sem virar as costas'},
      presagio:d=>d.flags.t3_responde ? 'Duas vezes. O T3 também respondia com um pulso a mais.' : 'Duas vezes, curto. Não foi grito.'},
  escolhas:[
    {texto:'Ir pro galpão.', vai:'c10_galpao'},
    {texto:'Sair da usina.', vai:'c10_saiu'},
    {texto:'Voltar e ficar imóvel.', vai:'c10_imovel'},
    {texto:'Ir pra sala de controle.', vai:'c10_sala_controle'}
  ]
},

/* falar com ela ali mesmo, no poço do T3: ela responde olhando pro galpão */
c10_falou_no_poco:{
  vozes:['P'],
  texto:[
    d=>d.flags.zapdos_dormiu_do_lado
      ? 'Ela acorda de uma vez, sem espreguiçar, e a primeira coisa que faz é olhar pra você.'
      : 'Ela está ali no T3, olhando pra você por cima da carcaça amassada.',
    'Você se sente ridícul{o|a} por quatro segundos inteiros. Depois fala, baixo, porque alto ali seria grito:',
    '"O que é que tem aqui?"',
    'Ela não responde a você. Vira a cabeça pro galpão, do outro lado do pátio, e fica olhando pra lá.',
    'E do galpão, pelas frestas, vem um clarão fraco que acende e apaga. Seis vezes.',
    'Ela levanta voo baixo, passa por cima de você e entra no galpão pelo buraco do teto.'
  ],
  ef:{flag:'falou_com_ela_no_poco',
      executar:d=>{ const L=Estado.lend(145); if(L.disposicao!=='hostil') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:2,motivo:'Falou com uma Ave Lendária em vez de atacar'},
      registrar:'No poço do T3, perguntou o que tinha ali. Ela olhou pro galpão.'},
  escolhas:[
    {texto:'Ir atrás dela, pro galpão.', vai:'c10_galpao'},
    {texto:'Ir pra sala de controle.', vai:'c10_sala_controle'},
    {texto:'Sair da usina.', vai:'c10_saiu'}
  ]
},

c10_desligou:{
  texto:[
    'Você acha a chave seccionadora geral, que é uma alavanca de metro e meio com contrapeso, num suporte pintado de vermelho.',
    d=>Estado.contaItem('Luva de eletricista')>0 ? 'Você calça a luva classe 2 antes, que sobra três dedos e é a melhor decisão da noite.' : 'Você não tem luva. Você pega numa alavanca de seccionadora de alta tensão com as mãos que tem.',
    'Puxa com as duas mãos e o corpo inteiro. Ela cede com um clique de catraca e depois um estouro surdo.',
    'O zumbido para.',
    'O silêncio depois dele é a coisa mais alta que você já ouviu na vida.',
    'Dura dois segundos e meio.',
    'E então, do outro lado do pátio, alguma coisa grita — e o grito é elétrico, literalmente: você sente nos dentes e nos ossos do braço antes de ouvir com o ouvido.',
    'Você acabou de desligar o que alguma coisa ali estava comendo.'
  ],
  ef:{flag:'desligou_a_usina',
      hp:d=>Estado.contaItem('Luva de eletricista')>0 ? 0 : -4,
      causa:'Arco elétrico na seccionadora',
      executar:d=>{ d.flags.c10_onde = 'subestacao'; d.flags.c10_desligada = true;
        const L=Estado.lend(145); L.encontros++; L.disposicao='hostil';
        return [{tipo:'perigo', texto:'O que vive aqui perdeu a fonte de energia. E sabe que foi você.'}]; },
      registrar:'Desligou os transformadores da usina. O que vive ali ficou hostil.',
      presagio:'Dois segundos e meio de silêncio. Foi o único silêncio em onze anos.'},
  escolhas:[
    {texto:'Se virar e encarar.', vai:'c10_zapdos'},
    {texto:'Religar. Agora. Rápido.', vai:'c10_religou'},
    {texto:'Correr pro galpão.', vai:'c10_galpao'},
    {texto:'Correr pro portão.', vai:'c10_correu_do_portao'}
  ]
},

c10_religou:{
  texto:[
    'Você empurra a alavanca de volta antes de pensar.',
    'A seccionadora fecha com o mesmo estouro surdo e o zumbido volta em menos de um segundo — e volta mais alto do que estava.',
    'O grito para no meio.',
    'Você fica parad{o|a} com as duas mãos na alavanca, ofegante, numa subestação escura, e a coisa que você acabou de fazer é pedir desculpa pra uma coisa que come corrente elétrica usando a única língua que vocês dois falam.',
    'Do outro lado do pátio, silêncio.',
    'Depois de uns quarenta segundos, um estalo baixo. Duas vezes.',
    'E o zumbido assenta de volta na frequência de antes.'
  ],
  ef:{flag:['religou','pediu_desculpa_a_zapdos'],
      executar:d=>{ d.flags.c10_desligada = false; const L=Estado.lend(145); L.disposicao='passivo';
        return [{tipo:'mundo', texto:'Aceitou. Isso não devia ter funcionado.'}]; },
      rep:{eixo:'bom',delta:3,motivo:'Desfez o próprio erro na hora, na cara de quem foi prejudicado'},
      moral:10,
      registrar:'Desligou, entendeu o que fez e religou. O que vive ali aceitou.'},
  escolhas:[
    {texto:'Ir pro galpão.', vai:'c10_galpao'},
    {texto:'Ir até o poço do T3.', vai:'c10_base_t3'},
    {texto:'Sair da usina.', vai:'c10_saiu'},
    {texto:'Esperar pra ver o que aparece.', vai:'c10_esperou_no_poco'}
  ]
},

c10_correu_do_portao:{
  falante:'Sr. Edric',
  vozes:['N','N'],
  texto:[
    'Você corre os duzentos metros do pátio até o portão com o cabelo em pé e gosto de metal na boca.',
    'Não vem atrás.',
    d=>d.flags.eloi_no_portao ? 'O Sr. Edric está no portão, de pé, com a mão no peito em cima do marca-passo, branco. "Eu senti," ele diz. "Eu senti no peito, {garoto|garota}. Não faz isso de novo."' :
       'No portão você para, com as mãos no joelho, e olha pra trás. O zumbido continua exatamente igual.',
    d=>(d.flags.entrou_no_galpao || d.flags.esperou_zapdos)
      ? 'Ave lendária não persegue. Ave lendária lembra.'
      : 'O que gritou lá atrás não persegue. Fica onde está, e lembra.'
  ],
  ef:{flag:'correu_da_usina', hp:-2, causa:'Corrida em pânico',
      executar:c10_estar('portao'),
      moral:-8},
  escolhas:[
    {texto:'Voltar pra dentro.', vai:'c10_galpao'},
    {texto:'Voltar e religar.', vai:'c10_religou', cond:d=>!!d.flags.c10_desligada},
    {texto:'Ir embora de vez.', vai:'c10_depois'},
    {texto:'Sentar e se recompor.', vai:'c10_saiu'}
  ]
},

/* ─────────────── O GALPÃO ─────────────── */

c10_galpao:{
  texto:[
    'O galpão de turbinas tem cinquenta metros de pé-direito e trezentos de comprimento, e o som lá dentro chega em você atrasado, porque o espaço é grande o suficiente pra ter eco de verdade.',
    'Três turbinas na linha central, cada uma do tamanho de uma casa. A do meio está aberta — a carcaça foi removida e nunca recolocada, e dá pra ver as pás por dentro.',
    'Tem um buraco no teto, a uns quarenta metros de altura, com a chapa dobrada pra dentro e enferrujada nas bordas.',
    'Pra dentro. Entrou.',
    'E o chão está coberto.',
    'Voltorb e Magnemite. Dezenas. Você conta até trinta e para de contar porque contar está te fazendo mal.',
    'Eles estão parados. Alinhados de um jeito frouxo, em fileiras tortas mas reconhecíveis, todos virados pro mesmo canto do galpão.',
    'Nenhum reage à sua presença. Você anda entre eles. Passa a meio metro de um Magnemite e ele não vira o ímã.',
    d=>d.flags.c10_chegou_depois_dela
      ? 'No canto pra onde todos olham, empoleirada numa viga de sustentação a vinte metros de altura, está Zapdos — acordada, e aqui antes de você, sem você ter ouvido ela passar.'
      : 'No canto pra onde todos olham, empoleirada numa viga de sustentação a vinte metros de altura, está Zapdos.',
    d=>{
      const L = Estado.dados.lendarios[145];
      if (L && L.disposicao==='hostil') return 'E ela já estava olhando pra você, porque ela já sabe quem você é e o que você fez.';
      return 'Ela não está caçando, não está descansando, não está fazendo ninho. Está carregando — e os outros vieram assistir.';
    }
  ],
  ef:{executar:d=>{
        d.flags.c10_onde = 'galpao';
        /* saiu do poço com ela dormindo: ela chega antes, por cima */
        d.flags.c10_chegou_depois_dela = !!d.flags.c10_ela_dorme_no_poco;
        delete d.flags.c10_ela_dorme_no_poco;
        Estado.lend(145).encontros++; return [];
      },
      flag:'entrou_no_galpao',
      registrar:'Encontrou Zapdos no galpão de turbinas da usina.',
      presagio:'Vieram assistir. Ninguém prendeu ninguém aqui.'},
  escolhas:[
    {texto:'Ficar parad{o|a} e observar até ela terminar.', vai:'c10_observar_zapdos'},
    {texto:'Olhar embaixo da viga central. O X do croqui.', vai:'c10_viga_central', cond:d=>!!d.flags.tem_o_croqui},
    {texto:'Olhar embaixo da viga central, onde acharam o Silas.', vai:'c10_viga_central', cond:d=>!d.flags.tem_o_croqui && !!d.flags.sabe_do_laudo},
    {texto:'Falar. Em voz alta. Como o Toby fez.', vai:'c10_falou_com_zapdos', cond:d=>!!d.flags.leu_o_caderno_do_teco},
    {texto:'Falar. Em voz alta.', vai:'c10_falou_com_zapdos', cond:d=>!d.flags.leu_o_caderno_do_teco},
    {texto:'Sair de fininho. Não mexer com isso.', vai:'c10_saiu'},
    {texto:'Oferecer comida.', vai:'c10_comida_zapdos', cond:d=>Estado.contaItem('Ração')>0},
    {texto:'Recolher os Voltorb parados — eles nem reagem.', vai:'c10_coleta',
     cond:d=>['mercenario','foragido'].includes(Historia.via())},
    {texto:'Atacar. Uma ave lendária vale mais que um ano de jornada.', vai:'c10_zapdos'}
  ]
},

c10_viga_central:{
  texto:[
    'Você atravessa o galpão até a viga central, andando entre Pokémon que não te olham.',
    d=>d.flags.tem_o_croqui
      ? 'O croqui tem um X aqui. O X tem uma data ao lado.'
      : 'Foi aqui, pelo que o Sr. Edric contou: no chão do galpão, embaixo da viga central.',
    'No chão de concreto, embaixo da viga, tem uma marca clara — um contorno irregular de uns dois metros por um, onde o concreto é de um cinza diferente do resto.',
    'Não é mancha de sangue. É o contrário: é uma área onde o concreto está mais limpo, porque foi lavado com alguma coisa forte, uma vez, com muita vontade, faz onze anos.',
    'E em volta do contorno, a menos de meio metro dele, tem doze marcas pequenas de queimadura no chão. Pontos. Do tamanho de uma moeda.',
    'Doze.',
    d=>d.flags.sabe_do_nivaldo
      ? 'Você fica de pé exatamente onde ele estava, olhando pra cima, pro buraco de quarenta metros no teto.'
      : 'Você fica de pé em cima do contorno, olhando pra cima, pro buraco de quarenta metros no teto.',
    d=>d.flags.sabe_do_nivaldo
      ? 'É pra cima que ele estava olhando. Só pode ser.'
      : 'Quem quer que tenha ficado aqui, era pra cima que estava olhando. Só pode ser.'
  ],
  ef:{flag:['viu_a_marca_do_nivaldo','entendeu_o_acidente'],
      moral:-12, instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Foi olhar o lugar exato em vez de desviar dele'},
      registrar:'Embaixo da viga central: concreto lavado e doze marcas de queimadura do tamanho de uma moeda.',
      presagio:d=>d.flags.sabe_do_laudo
        ? 'Doze pontos de entrada. Doze marcas no chão. Ele não foi atingido — ele foi tocado.'
        : 'Doze marcas, todas em volta do contorno. Raio não cai doze vezes no mesmo lugar.'},
  escolhas:[
    {texto:'Falar em voz alta.', vai:'c10_falou_com_zapdos'},
    {texto:'Ficar parad{o|a} e observar até ela terminar.', vai:'c10_observar_zapdos'},
    {texto:'Sair. Você já viu demais.', vai:'c10_saiu'},
    {texto:'Atacar.', vai:'c10_zapdos'}
  ]
},

c10_falou_com_zapdos:{
  vozes:['P'],
  texto:[
    'Você se sente ridícul{o|a} por quatro segundos inteiros. Depois fala, em voz alta, num galpão de trezentos metros com quarenta Pokémon parados:',
    '"Vocês estão presos aqui?"',
    'O eco devolve a pergunta duas vezes e some.',
    'Nada acontece por uns vinte segundos.',
    'E aí um Voltorb da terceira fileira rola. Um palmo. Só um palmo, pra frente, na direção do canto.',
    'E depois outro. E depois quatro. E depois a fileira inteira, um palmo, todos ao mesmo tempo, com o barulho de quarenta coisas de borracha rolando um palmo num chão de concreto.',
    'Eles se aproximaram dela.',
    'Você fez uma pergunta e quarenta Pokémon responderam andando na direção contrária da saída.',
    d=>d.flags.leu_o_caderno_do_teco ? 'O Toby escreveu: "eu perguntei e eles não estão presos". Agora você sabe exatamente que gesto ele viu.' :
       'Você fica com essa resposta na mão sem saber o que fazer com ela.'
  ],
  ef:{flag:['perguntou_no_galpao','sabe_que_nao_estao_presos'],
      rep:{eixo:'bom',delta:3,motivo:'Perguntou em vez de decidir sozinho'},
      moral:-5,
      registrar:'Perguntou se estavam presos. Quarenta se aproximaram dela em resposta.',
      presagio:'Eles responderam. A partir daqui, tudo que você fizer aqui você faz sabendo.'},
  escolhas:[
    {texto:'"Por quê?" Perguntar de novo.', vai:'c10_perguntou_porque'},
    {texto:'Ficar parad{o|a} e observar até ela terminar.', vai:'c10_observar_zapdos'},
    {texto:'Sair. Não é seu.', vai:'c10_saiu'},
    {texto:'Atacar mesmo assim.', vai:'c10_zapdos'}
  ]
},

c10_perguntou_porque:{
  vozes:['P'],
  texto:[
    '"Por quê?"',
    'Dessa vez quem responde é ela.',
    'Zapdos abre as asas na viga — não pra voar, só abre — e o galpão inteiro acende de baixo pra cima: os quarenta Voltorb no chão brilham em sequência, um de cada vez, começando do mais longe e terminando no mais perto de você.',
    'É uma onda de luz atravessando um galpão de trezentos metros em quatro segundos.',
    'E depois apaga tudo, na ordem inversa.',
    'E de novo.',
    'E de novo.',
    'Você fica olhando três repetições até entender, e quando entende você senta no chão porque as suas pernas resolvem por você:',
    d=>d.flags.mediu_a_sequencia ? 'É a mesma sequência do multímetro. Seis pulsos.' : 'São seis. Você conta duas vezes pra ter certeza: seis pulsos, sempre seis.',
    'Eles estão repetindo pra ela há onze anos. E ela responde com um sétimo.',
    'Não é alimentação. Não é culto. É conversa.',
    'Uma conversa de seis e sete, repetida todo dia, por onze anos, porque é a única coisa que dá pra fazer quando não se tem palavra.'
  ],
  ef:{flag:['entendeu_a_conversa','sabe_da_sequencia'],
      rep:{eixo:'bom',delta:4,motivo:'Entendeu o que estava acontecendo antes de agir'},
      moral:10, instabilidade:-1,
      registrar:'A sequência de seis e sete é conversa: eles falam com ela há onze anos.',
      presagio:'Onze anos de conversa. E você chegou hoje querendo resolver.'},
  escolhas:[
    {texto:'Responder. Com o que você tiver.', vai:'c10_respondeu'},
    {texto:'Ficar parad{o|a} e observar até ela terminar.', vai:'c10_observar_zapdos'},
    {texto:'Sair sem interromper.', vai:'c10_saiu'},
    {texto:'Atacar.', vai:'c10_zapdos'}
  ]
},

c10_respondeu:{
  texto:[
    d=>c10_lanterna() ? 'Você não tem corrente elétrica. Você tem uma lanterna de cabeça, uma mochila e duas mãos.' : 'Você não tem corrente elétrica. Você tem uma mochila e duas mãos.',
    d=>c10_lanterna() ? 'Você tira a lanterna de cabeça, aponta pro teto e pisca ela seis vezes, no mesmo intervalo, com o dedo no botão.' :
       'Você bate a mão aberta no chão de concreto seis vezes, no mesmo intervalo, com força suficiente pra doer.',
    'Seis.',
    'O galpão fica absolutamente parado.',
    'Nenhum Voltorb brilha. Nenhum ímã gira. Zapdos não se mexe na viga.',
    'Nove segundos de nada, e você já está se sentindo {o|a} maior idiota de Kanto.',
    'E aí vem o sétimo.',
    'Um pulso só, da viga, tão forte que as lâmpadas de emergência mortas do galpão acendem por um instante e queimam de vez com um estalo.',
    'Ela respondeu pra você.',
    'Você é a primeira pessoa em onze anos que respondeu na língua deles, e ela respondeu de volta na primeira tentativa, o que quer dizer que ela estava esperando faz muito tempo.'
  ],
  ef:{flag:['respondeu_a_zapdos','zapdos_te_conhece'],
      executar:d=>{ const L=Estado.lend(145); if(L.disposicao!=='hostil') L.disposicao='passivo';
        return [{tipo:'mundo', texto:'Zapdos respondeu a você diretamente. Isso não está no registro de ninguém.'}]; },
      rep:{eixo:'bom',delta:5,motivo:'Falou a língua de quem não tem palavra'},
      moral:20, hp:d=>c10_lanterna() ? 0 : -2, causa:'A mão doeu',
      registrar:'Respondeu seis pulsos e recebeu o sétimo. Zapdos falou com você.',
      presagio:'Ela estava esperando. Onze anos e ninguém tinha respondido.'},
  escolhas:[
    {texto:'Ficar. Continuar a conversa até de manhã.', vai:'c10_conversa_longa'},
    {texto:'Sair sem interromper.', vai:'c10_saiu'},
    {texto:'Oferecer a Pokébola. Convidar em vez de capturar.', vai:'c10_convite'},
    {texto:'Aproveitar e atacar agora.', vai:'c10_traicao_zapdos'}
  ]
},

c10_conversa_longa:{
  texto:[
    'Você fica até amanhecer.',
    'Não acontece nada épico. Essa é a parte que não dá pra contar direito pra ninguém.',
    d=>c10_lanterna()
      ? 'Você pisca a lanterna. Ela responde. Você pisca diferente. Ela responde diferente. Você erra o intervalo e ela repete mais devagar, duas vezes, como quem repete pra criança.'
      : 'Você bate no chão. Ela responde. Você bate diferente. Ela responde diferente. Você erra o intervalo e ela repete mais devagar, duas vezes, como quem repete pra criança.',
    'Às três da manhã você já sabe distinguir quatro respostas diferentes e não sabe o que nenhuma delas quer dizer.',
    'Às quatro e meia os Voltorb começam a rolar embora, um por um, cada um pro seu canto do galpão, do jeito que gente sai de velório.',
    d=>d.flags.sabe_da_data
      ? 'Às cinco e quarenta — cinco e quarenta, o mesmo horário — ela desce da viga.'
      : 'Às cinco e quarenta ela desce da viga.',
    'Anda pelo chão como uma ave comum, entre os que sobraram, que abrem espaço.',
    'Passa a três metros de você. Vira a cabeça. Olha.',
    'E sai pelo buraco do teto, e o galpão inteiro escurece de uma vez, e é de manhã.',
    'No chão, perto do seu pé, um Magnemite não voltou pro canto dele. Está virado pra você.'
  ],
  ef:{flag:['noite_no_galpao','respeitou_zapdos'],
      executar:d=>{ c10_ate(6); const L=Estado.lend(145); if(L.disposicao!=='hostil') L.disposicao='passivo';
        return [{tipo:'mundo', texto:'Você passou uma noite conversando com uma Ave Lendária e não capturou nada.'}]; },
      rep:{eixo:'bom',delta:4,motivo:'Passou a noite inteira falando com quem ninguém falou'},
      moral:20, hp:-4, causa:'Uma noite inteira sem dormir, no concreto',
      umaVez:'c10_p1', pokemon:{dex:81, nivel:30, opcoes:{moral:45, historia:'Ficou depois que os outros foram embora. Foi {o} únic{o} que não voltou pro canto {dele}.'}},
      registrar:'Passou a noite conversando no galpão. Um Magnemite ficou.',
      presagio:'Um ficou. Ninguém te deu ele — ele ficou.'},
  escolhas:[
    {texto:'Sair da usina.', vai:'c10_saiu'},
    {texto:'Ir devolver o croqui pro Sr. Edric.', vai:'c10_depois', cond:d=>Estado.contaItem('Croqui da usina')>0 && c10_quemEspera(d)==='edric'},
    {texto:'Voltar à subestação medir de novo.', vai:'c10_mediu_todos', cond:d=>Estado.contaItem('Multímetro')>0},
    {texto:'Voltar amanhã à noite.', vai:'c10_galpao', ef:{executar:d=>{ c10_ate(19); return []; }}}
  ]
},

c10_convite:{
  texto:[
    'Você tira uma Pokébola da mochila, abre ela — vazia — e coloca no chão de concreto, aberta, apontando pra viga.',
    'E recua vinte passos.',
    'É o gesto mais idiota que existe e você sabe: Pokébola não convida, Pokébola prende.',
    'Ela desce.',
    'Pousa no chão a uns quatro metros da Pokébola aberta e olha ela por muito tempo. Anda em volta. Olha você. Olha a Pokébola.',
    'Depois encosta o bico na Pokébola aberta, com cuidado, do jeito que se encosta em coisa que se sabe que morde.',
    'A Pokébola dispara o mecanismo de captura e fecha, vazia, porque ela não entrou.',
    'Ela olha a Pokébola fechada no chão, olha você, e volta pra viga.',
    'Não foi recusa. Foi resposta: ela experimentou, entendeu o que é, e devolveu.'
  ],
  ef:{flag:['convidou_zapdos','zapdos_te_conhece'],
      executar:d=>{ const L=Estado.lend(145); if(L.disposicao!=='hostil') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:3,motivo:'Convidou em vez de prender'},
      moral:10,
      registrar:'Ofereceu uma Pokébola aberta a Zapdos. Ela experimentou e recusou.',
      presagio:'Ela entendeu o que é uma Pokébola. Pensa em como ela aprendeu isso.'},
  escolhas:[
    {texto:'Ficar até de manhã.', vai:'c10_conversa_longa'},
    {texto:'Sair.', vai:'c10_saiu'},
    {texto:'Insistir. Jogar de verdade.', vai:'c10_traicao_zapdos'},
    {texto:'Observar até ela terminar.', vai:'c10_observar_zapdos'}
  ]
},

c10_coleta:{
  texto:[
    'Eles não reagem. Você pega um. Depois outro.',
    'É mais fácil do que catar fruta. Nos dois primeiros você nem precisa jogar a Pokébola — pega no colo e encosta, porque eles não resistem, não rolam, não fazem nada.',
    'Quando você abre a terceira Pokébola, um Magnemite do fundo do galpão vira lentamente a cabeça na sua direção.',
    'Depois todos viram. Os outros quarenta e poucos, ao mesmo tempo, com o mesmo som de servomotor arrastado.',
    'Eles não atacam. Só olham.',
    'E lá em cima, na viga, Zapdos para de carregar.'
  ],
  ef:{flag:'coletou_na_usina',
      umaVez:'c10_p2',
      executar:d=>{
        const avisos=[];
        for (let i=0;i<2;i++){
          const p = criarPokemon(Dados.escolher([100,81]), Dados.entre(28,34),
            {moral:10, historia:'Recolhid{o} do chão da usina enquanto olhava para Zapdos.'});
          const onde = Estado.adicionar(p);
          avisos.push({tipo:'pokemon', texto:`${p.nome} (Nv ${p.nivel}) foi recolhid${pron(p).o}. ${pron(p).Ele} não resistiu, o que é pior.${notaDestino(onde)}`});
        }
        const L=Estado.lend(145); L.disposicao='hostil';
        avisos.push({tipo:'perigo', texto:'Zapdos parou de carregar. Ela te viu fazer isso.'});
        return avisos;
      },
      rep:{eixo:'ruim',delta:2,motivo:'Recolheu Pokémon indefesos como quem cata sucata'},
      moral:-15,
      registrar:'Coletou Pokémon indefesos na usina, na frente de Zapdos.',
      presagio:'Eles não resistiram porque não estavam presos. Você tirou gente de uma conversa.'},
  escolhas:[
    {texto:'Encarar o que vem.', vai:'c10_zapdos'},
    {texto:'Soltar os dois. Agora.', vai:'c10_soltou_a_coleta'},
    {texto:'Correr pro portão com os dois.', vai:'c10_correu_do_portao'},
    {texto:'Parar e sair sem mais nada.', vai:'c10_saiu'}
  ]
},

c10_soltou_a_coleta:{
  texto:[
    'Você abre as duas Pokébolas no chão do galpão e recua.',
    'Eles saem, ficam parados um momento, e depois rolam de volta pras fileiras. Sem pressa. Sem alívio visível.',
    'Voltam exatamente pros lugares de onde você tirou, o que quer dizer que os lugares eram lugares.',
    'Lá em cima, Zapdos volta a carregar.',
    'Ninguém te perdoou. Só pararam de te olhar, o que aqui é a mesma coisa.'
  ],
  ef:{flag:'devolveu_a_coleta', limpaFlag:'coletou_na_usina',
      executar:d=>{ const L=Estado.lend(145); if(L.disposicao==='hostil') L.disposicao='passivo';
        const remover=[...d.time].filter(x=>[100,81].includes(x.dex) && /usina/.test(x.historia||''));
        remover.slice(0,2).forEach(p=>{ try{ Captura.soltar(p); }catch(e){} });
        return [{tipo:'mundo', texto:'Os dois voltaram para as fileiras. Zapdos voltou a carregar.'}]; },
      rep:{eixo:'bom',delta:2,motivo:'Devolveu o que tinha pegado de quem não podia recusar'},
      moral:10,
      registrar:'Devolveu os dois que tinha recolhido na usina.',
      presagio:'Voltaram pros mesmos lugares. Os lugares eram lugares.'},
  escolhas:[
    {texto:'Perguntar em voz alta.', vai:'c10_falou_com_zapdos'},
    {texto:'Observar até ela terminar.', vai:'c10_observar_zapdos'},
    {texto:'Sair.', vai:'c10_saiu'},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'}
  ]
},

c10_observar_zapdos:{
  texto:[
    'Você senta no chão do galpão, entre os Voltorb, e espera.',
    'Leva quarenta minutos e são quarenta minutos de verdade — você tem cãibra no pé esquerdo aos doze e não se mexe.',
    'Zapdos puxa energia do prédio inteiro em ciclos. As lâmpadas de emergência, que não deviam ter carga nenhuma, apagam e acendem no ritmo dela.',
    'Nos ciclos mais fortes, você sente o pelo do braço subir e a língua ficar com gosto de moeda.',
    'Quando termina, ela desce da viga.',
    'Anda pelo chão como uma ave comum, entre os Voltorb, que abrem espaço sem pressa — não por medo, do jeito que se abre espaço pra alguém conhecido.',
    'Ela passa a três metros de você. Vira a cabeça. Olha.',
    'Depois sai pelo buraco do teto, e o galpão inteiro escurece de uma vez.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(145); if(L.disposicao!=='hostil') L.disposicao='passivo';
        return [{tipo:'mundo', texto:'Zapdos te considera parte da paisagem. É o mais perto de aprovação que uma ave lendária chega.'}]; },
      rep:{eixo:'bom',delta:2,motivo:'Encontrou uma Ave Lendária e escolheu só olhar'},
      moral:8,
      flag:'respeitou_zapdos', registrar:'Observou Zapdos carregar e não interferiu.'},
  escolhas:[
    {texto:'Sair da usina.', vai:'c10_saiu'},
    {texto:'Ficar e falar com os que sobraram.', vai:'c10_falou_com_zapdos'},
    {texto:'Ir olhar a viga central.', vai:'c10_viga_central', cond:d=>!!d.flags.tem_o_croqui || !!d.flags.sabe_do_nivaldo},
    {texto:'Ir pra subestação.', vai:'c10_subestacao'}
  ]
},

c10_comida_zapdos:{
  texto:[
    'Você coloca a ração no chão de concreto e recua.',
    'Zapdos olha a comida do alto da viga por um tempo humilhante — uns quarenta segundos, que num galpão silencioso são muito.',
    'Depois desce.',
    'Não pela comida. Ela pousa do lado da ração, ignora completamente, e olha pra você.',
    'Ela não come ração. Ela come corrente elétrica. O gesto não significou absolutamente nada pra ela.',
    'E ainda assim ela desceu.',
    'Ela desceu porque alguém tentou, e faz onze anos que ninguém tenta nada aqui que não seja medir, espantar ou fugir.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Ração'); const L=Estado.lend(145); if(L.disposicao!=='hostil') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:1,motivo:'Tentou um gesto inútil e sincero com um lendário'},
      moral:5,
      flag:'zapdos_desceu'},
  escolhas:[
    {texto:'Ficar parad{o|a}.', vai:'c10_observar_zapdos'},
    {texto:'Falar com ela.', vai:'c10_falou_com_zapdos'},
    {texto:'Oferecer a Pokébola aberta.', vai:'c10_convite'},
    {texto:'Aproveitar que ela desceu e jogar a Pokébola.', vai:'c10_traicao_zapdos'}
  ]
},

c10_traicao_zapdos:{
  texto:[
    'Você joga a Pokébola no segundo em que ela baixa a guarda.',
    'Não importa se prende.',
    'O gesto já aconteceu, e ela já entendeu exatamente o que foi, porque ela é velha o bastante pra ter visto isso antes.',
    d=>d.flags.respondeu_a_zapdos ? 'E você é a pessoa que mandou os seis agora há pouco, e ela respondeu. E aí você fez isso.' :
       c10_naSubestacao(d) ? 'E do galpão, do outro lado do pátio, vem um silêncio que não estava ali antes: o zumbido parou de uma vez.' :
       'E o galpão inteiro, quarenta Pokémon, vira a cabeça ao mesmo tempo.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(145); L.disposicao='hostil'; L.ataquesSofridos+=2; return []; },
      rep:{eixo:'ruim',delta:2,motivo:'Traiu a confiança de um lendário'},
      moral:-20,
      flag:'traiu_zapdos',
      registrar:'Jogou a Pokébola em Zapdos no momento em que ela baixou a guarda.',
      presagio:'Ela já tinha visto isso antes. Pergunta-se de quem.'},
  escolhas:[{texto:'Encarar o que vem.', vai:'c10_zapdos'}]
},

c10_zapdos:{
  texto:[
    d=>c10_naSubestacao(d)
      ? 'O pátio da subestação se acende de uma vez. Os quatro transformadores sobem pra mesma nota, alto, e o ar fica com gosto de moeda.'
      : 'O galpão inteiro se ilumina de baixo pra cima.',
    d=>c10_naSubestacao(d)
      ? 'Ela vem por cima do T3, de asas abertas, e dessa vez não é pra pousar.'
      : 'Os Voltorb no chão começam a brilhar em sequência, como pista de pouso, e todos apontam pra você — e dessa vez a sequência não é de seis.',
    d=>c10_naSubestacao(d) ? '' : 'É contínua.'
  ],
  batalha:{dex:145, nivel:50, tipo:'lendario', fuga:true, ambiente:'ruina',
           vitoria:'c10_pos_zapdos', derrota:'c10_pos_zapdos', fuga2:'c10_fugiu_zapdos',
           captura:'c10_capturou_zapdos', gameover:'gameover'}
},

c10_pos_zapdos:{
  texto:[
    d=>c10_naSubestacao(d) ? 'Ela sacode as penas e pousa de novo em cima do T3.' : 'Ela sacode as penas e volta pra viga.',
    'Não foi embora, não te perseguiu: só voltou a fazer o que estava fazendo antes de você chegar.',
    'Pra uma coisa como Zapdos, você foi uma interrupção. Não uma ameaça.',
    'Isso devia ser humilhante e, por algum motivo, é um alívio.',
    d=>c10_naSubestacao(d) ? 'Os quatro transformadores voltam a zumbir na nota de sempre.' : 'No chão, os Voltorb param de brilhar um por um e voltam a ficar virados pro canto.',
    d=>c10_naSubestacao(d) ? 'Do galpão, do outro lado do pátio, vem um clarão fraco pelas frestas. Seis vezes.' : 'A sequência recomeça. Seis.'
  ],
  ef:{executar:d=>{
        const L=Estado.lend(145); L.ataquesSofridos++;
        if (L.ataquesSofridos>=2){ L.disposicao='hostil'; return [{tipo:'perigo', texto:'Zapdos passou a te caçar. Céu limpo não é mais seguro pra você.'}]; }
        return [];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou uma Ave Lendária'}},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c10_zapdos'},
    {texto:'Parar. Sentar. Perguntar.', vai:'c10_falou_com_zapdos', cond:d=>!c10_naSubestacao(d)},
    {texto:'Parar e falar com ela.', vai:'c10_falou_no_poco', cond:d=>c10_naSubestacao(d)},
    {texto:'Parar e sair.', vai:'c10_saiu'},
    {texto:'Parar e observar até ela terminar.', vai:'c10_observar_zapdos', cond:d=>!c10_naSubestacao(d)},
    {texto:'Ir pro galpão.', vai:'c10_galpao', cond:d=>c10_naSubestacao(d)}
  ]
},

c10_fugiu_zapdos:{
  texto:[
    d=>c10_naSubestacao(d)
      ? 'Você corre pelo pátio da subestação com o cabelo em pé e gosto de metal na boca, sem olhar pra trás.'
      : 'Você corre pelo galpão com o cabelo em pé e gosto de metal na boca, passando por cima de Pokémon que não saem do caminho porque não estão te vendo.',
    'Ela não persegue.',
    'Aves lendárias não perseguem — elas lembram.'
  ],
  ef:{flag:'fugiu_de_zapdos', hp:-3, causa:'Fuga dentro da usina'},
  escolhas:[
    {texto:'Sair da usina.', vai:'c10_saiu'},
    {texto:'Voltar e tentar conversar.', vai:'c10_falou_com_zapdos', cond:d=>!c10_naSubestacao(d)},
    {texto:'Voltar e tentar conversar.', vai:'c10_falou_no_poco', cond:d=>c10_naSubestacao(d)},
    {texto:'Ir pra subestação.', vai:'c10_subestacao', cond:d=>!c10_naSubestacao(d)},
    {texto:'Ir pro galpão.', vai:'c10_galpao', cond:d=>c10_naSubestacao(d)},
    {texto:'Ir embora de vez.', vai:'c10_depois'}
  ]
},

c10_capturou_zapdos:{
  texto:[
    'A Pokébola fecha.',
    d=>c10_naSubestacao(d) ? 'E o zumbido para. Não diminui: para, de uma vez, nos quatro transformadores.' : 'E os quarenta e poucos Voltorb do chão apagam ao mesmo tempo.',
    d=>c10_naSubestacao(d) ? 'Do outro lado do pátio, o galpão, que tinha um brilho fraco nas frestas, fica escuro.' : 'Não em sequência. Ao mesmo tempo, como interruptor.',
    d=>c10_naSubestacao(d)
      ? 'A usina fica escura, silenciosa e — pela primeira vez em onze anos — desligada de verdade.'
      : 'O galpão fica escuro, silencioso e — pela primeira vez em onze anos — desligado de verdade.',
    d=>c10_naSubestacao(d)
      ? 'Você fica parad{o|a} no escuro com uma Pokébola na mão, e o único som que sobra é a sua respiração.'
      : 'Você fica parad{o|a} no escuro com uma Pokébola na mão e quarenta Pokémon em volta que pararam no meio de uma frase.',
    d=>c10_naSubestacao(d)
      ? 'No céu limpo, bem em cima de você, uma nuvem começa a se formar.'
      : 'Lá fora, no céu limpo, uma nuvem começa a se formar exatamente sobre a usina.',
    'E outra no norte. E outra no sul.'
  ],
  ef:{instabilidade:2, moral:-10, flag:'capturou_zapdos',
      registrar:'Capturou Zapdos na usina. A usina inteira apagou.'},
  escolhas:[
    {texto:'Soltar. Agora, antes de sair daqui.', vai:'c10_soltou_zapdos'},
    {texto:'Sair com ela.', vai:'c10_depois', ef:{flag:'levou_zapdos', rep:{eixo:'ruim',delta:2,motivo:'Levou embora uma conversa de onze anos'}}},
    {texto:'Soltar e ficar até eles recomeçarem.', vai:'c10_soltou_zapdos'},
    {texto:'Sentar no escuro e pensar melhor.', vai:'c10_soltou_zapdos'}
  ]
},

c10_soltou_zapdos:{
  texto:[
    d=>c10_naSubestacao(d) ? 'Você abre a Pokébola apontando pro céu.' : 'Você abre a Pokébola apontando pro buraco do teto.',
    d=>c10_naSubestacao(d)
      ? 'Ela sai e não vai embora. Pousa em cima do T3, e o zumbido volta, primeiro fraco, depois inteiro.'
      : 'Ela sai e não vai embora. Sobe até a viga, pousa, e fica.',
    d=>c10_naSubestacao(d)
      ? 'No galpão, do outro lado do pátio, as frestas voltam a acender, uma depois da outra.'
      : 'Um por um, os Voltorb do chão voltam a brilhar. Leva quase um minuto até os quarenta estarem acesos de novo, e o primeiro a acender é o mais longe.',
    'Seis.',
    'Eles recomeçaram do começo.'
  ],
  ef:{flag:'soltou_zapdos',
      executar:d=>{
        const p=[...d.time,...d.pc].find(x=>x.dex===145);
        return p ? Captura.soltar(p).map(e=>({tipo:e.tipo,texto:e.texto})) : [];
      },
      rep:{eixo:'bom',delta:3,motivo:'Soltou um lendário capturado antes de sair do lugar'},
      moral:15, instabilidade:-1,
      registrar:'Soltou Zapdos de volta na usina. A sequência recomeçou.'},
  escolhas:[
    {texto:'Sair.', vai:'c10_saiu'},
    {texto:'Ficar até de manhã.', vai:'c10_conversa_longa', cond:d=>!c10_naSubestacao(d)},
    {texto:'Responder a sequência.', vai:'c10_respondeu', cond:d=>!c10_naSubestacao(d)},
    {texto:'Ir pro galpão.', vai:'c10_galpao', cond:d=>c10_naSubestacao(d)},
    {texto:'Ir devolver o croqui.', vai:'c10_depois', cond:d=>Estado.contaItem('Croqui da usina')>0 && c10_quemEspera(d)==='edric'}
  ]
},

c10_saiu:{
  texto:[
    d=>{ const o = d.flags.c10_onde;
      if (o === 'portao') return 'Você senta no chão do lado de fora do portão até a respiração voltar ao normal.';
      if (o === 'subestacao' || o === 'patio') return 'Você atravessa o pátio de volta, devagar, sem correr.';
      return 'Você sai de costas, devagar, sem tirar o olho da viga.'; },
    d=>{ const o = d.flags.c10_onde;
      if (o === 'portao' || o === 'subestacao' || o === 'patio') return 'Do galpão vem o zumbido de sempre, e nada vem atrás de você.';
      return 'Nenhum dos Voltorb reage à sua saída. Eles nem sabiam direito que você estava lá — ou sabiam e isso nunca foi o ponto.'; },
    'No portão, você olha pra trás uma última vez e entende uma coisa:',
    'Aquilo não estava escondido. Estava só num lugar onde ninguém vai.',
    'Onze anos, oitocentos metros de uma trilha usada por gente todo fim de semana, e a coisa mais estranha de Kanto estava ali com o cadeado enferrujado aberto.'
  ],
  ef:{flag:'saiu_da_usina', rep:{eixo:'bom',delta:1,motivo:'Saiu da usina sem mexer no que vive lá'}},
  escolhas:[{texto:'Seguir.', vai:'c10_depois'}]
},

/* ─────────────── O PORTÃO, NA SAÍDA ─────────────── */

c10_depois:{
  texto:[
    'No portão da usina tem alguém esperando.',
    d=>{
      const q = c10_quemEspera(d);
      if (d.flags.eloi_no_portao) return 'O Sr. Edric está exatamente onde disse que ficaria, na cadeira de praia, com a garrafa térmica vazia e o boné da companhia no colo. Ele levanta quando te vê e a primeira coisa que ele faz é olhar as suas mãos, pra ver se estão inteiras.';
      if (q === 'van') return 'Dois homens com uma van, de motor ligado. Eles olham a sua mochila com muita atenção. Eles sabem contar Pokébolas.';
      if (q === 'cordell') return 'A Dra. Cordell, encostada num carro emprestado, com uma garrafa térmica.';
      if (q === 'cerulean') return 'Três pessoas de Cerulean, que vieram a pé, porque alguém falou que tinha um treinador na usina. Elas não sabem o que perguntar. Só queriam saber se era verdade.';
      if (d.flags.conheceu_eloi) return 'É o homem do boné da companhia, o do açude. Ele trouxe a cadeira de praia até o portão e está sentado de frente pra usina, como quem esperou sem ter combinado nada. Ele levanta quando te vê.';
      return 'Um homem de uns setenta anos, de boné antigo da companhia elétrica, sentado numa cadeira de praia de frente pro portão, como quem tem o costume. Ele levanta quando te vê sair.';
    },
    d=>d.flags.c10_edric_se_apresentou_no_portao ? fala(C10_EDRIC, 'Edric. Trabalhei aí dentro dezenove anos.') : '',
    d=>{
      const q = c10_quemEspera(d);
      if (q === 'van') return fala('o homem da van', 'A Terceira mandou perguntar se deu certo.');
      if (q === 'cordell') return fala('Dra. Cordell', 'Eu vi o relâmpago da estrada. Sobe aí, você tá com cara de quem precisa sentar.');
      if (q === 'edric') return fala(C10_EDRIC, 'Você viu?');
      return '';
    },
    d=>c10_quemEspera(d) === 'edric' ? 'Ele não precisa dizer o quê.' : ''
  ],
  ef:{executar:d=>{
        const edric = c10_quemEspera(d) === 'edric';
        d.flags.c10_edric_se_apresentou_no_portao = edric && !Nomes.sabe(C10_EDRIC);
        if (edric) Nomes.apresentar('o homem do boné');
        return [];
      }},
  escolhas:[
    {texto:'Contar tudo.', vai:'c10_contou'},
    {texto:'Contar só o que dá pra provar.', vai:'c10_contou_pouco'},
    {texto:'Mentir.', vai:'c10_mentiu'},
    {texto:'Não dizer nada e seguir andando.', vai:'c10_fim'}
  ]
},

c10_contou:{
  texto:[
    'Você conta. Sem enfeitar, sem arredondar, inclusive as partes em que você fica mal na fita.',
    d=>{
      const q = c10_quemEspera(d);
      if (q === 'van') return 'Os dois ouvem sem interromper, e um deles anota alguma coisa num papel dobrado.';
      if (q === 'cordell') return 'A Dra. Cordell ouve com a garrafa térmica parada no meio do caminho, e não duvida de nada. Nem por um segundo.';
      if (q === 'cerulean') return 'Quem está ouvindo reage de um jeito que você não esperava: ninguém duvida. Nem por um segundo.';
      return 'O Sr. Edric ouve tudo de pé, sem sentar de novo, e não duvida de nada. Nem por um segundo.';
    },
    d=>{
      const q = c10_quemEspera(d);
      if (q === 'van') return fala('o homem da van', 'Ela vai querer saber do galpão. Do resto, não.');
      if (q === 'cordell') return fala('Dra. Cordell', 'Eu sabia que tinha alguma coisa. Só não tinha quem tivesse entrado.');
      if (q === 'cerulean') return fala('um deles', 'A gente sabia. A gente só não tinha quem falasse.');
      return fala(C10_EDRIC, 'Então não foi castigo. Onze anos e eu achando que aquilo lá era castigo.');
    },
    d=>c10_quemEspera(d) === 'van'
      ? 'Eles entram na van e vão embora sem agradecer.'
      : 'E é isso: a informação não vale nada até alguém dizer em voz alta na frente de outra pessoa.',
    d=>d.flags.c10_devolveu_o_croqui_agora ? 'Você devolve o croqui dobrado em quatro. Ele guarda no bolso do colete, no mesmo lugar, e bate duas vezes em cima com a mão.' : ''
  ],
  ef:{flag:'contou_da_usina',
      executar:d=>{
        d.flags.c10_devolveu_o_croqui_agora = c10_quemEspera(d) === 'edric' && Estado.contaItem('Croqui da usina') > 0;
        if (d.flags.c10_devolveu_o_croqui_agora) Estado.usarItem('Croqui da usina');
        return [];
      },
      rep:{eixo:'bom',delta:2,motivo:'Contou a verdade sobre o que viu na usina'},
      moral:10,
      registrar:'Contou o que viu na usina.'},
  escolhas:[
    {texto:'Seguir para Saffron.', vai:'c10_fim'},
    {texto:'Ficar mais um dia e ajudar a interditar a rota.', vai:'c10_interditou', cond:d=>c10_quemEspera(d) === 'edric'},
    {texto:'Ir a Lavender devolver a foto antes.', vai:'c10_lavender', cond:d=>!!d.flags.tem_a_foto && !!d.flags.endereco_almerinda},
    {texto:'Voltar pra usina mais uma noite.', vai:'c10_galpao'}
  ]
},

c10_contou_pouco:{
  texto:[
    'Você conta o que dá pra provar e cala o resto.',
    'O zumbido, que qualquer um ouve da estrada. O que você mediu, o que você viu de perto, com hora e lugar: isso alguém pode ir lá e conferir.',
    d=>(d.flags.entendeu_a_conversa || d.flags.respondeu_a_zapdos)
      ? 'A conversa de seis e sete você não conta, porque seis e sete sai da sua boca como delírio e você já entendeu que delírio desqualifica o resto.'
      : 'O que você sentiu lá dentro você não conta, porque sai da sua boca como delírio e você já entendeu que delírio desqualifica o resto.',
    'É a decisão certa e te deixa com uma sensação ruim, porque a parte que você calou é a única que importa.'
  ],
  ef:{flag:['contou_da_usina','calou_a_parte_boa'],
      rep:{eixo:'bom',delta:1,motivo:'Contou o que dava pra provar'},
      registrar:'Contou só a parte mensurável do que viu na usina.'},
  escolhas:[
    {texto:'Seguir para Saffron.', vai:'c10_fim'},
    {texto:'Mudar de ideia e contar tudo.', vai:'c10_contou'},
    {texto:'Ficar e ajudar a interditar a rota.', vai:'c10_interditou', cond:d=>c10_quemEspera(d) === 'edric'},
    {texto:'Ir a Lavender devolver a foto.', vai:'c10_lavender', cond:d=>!!d.flags.tem_a_foto && !!d.flags.endereco_almerinda}
  ]
},

c10_mentiu:{
  vozes:['P'],
  texto:[
    '"Não tinha nada lá."',
    d=>{
      const q = c10_quemEspera(d);
      if (q === 'edric') return 'O Sr. Edric olha pra você por três segundos a mais do que o normal, e depois assente e senta de novo na cadeira de praia, de frente pra usina.';
      if (q === 'cordell') return 'A Dra. Cordell aceita. Ou finge aceitar, o que num contexto desses dá exatamente no mesmo. Ela olha a usina por cima do seu ombro enquanto você fala, e não interrompe.';
      return 'Eles aceitam. Ou fingem aceitar, o que num contexto desses dá exatamente no mesmo. Um deles olha a usina por cima do seu ombro enquanto você fala, e não interrompe.';
    },
    'Você segue estrada com a sensação estranha de ter roubado uma coisa que não era sua:',
    d=>{ const q = c10_quemEspera(d); return q === 'edric' ? 'a certeza dele.' : q === 'cordell' ? 'a certeza dela.' : 'a certeza deles.'; }
  ],
  ef:{flag:'mentiu_sobre_usina',
      rep:{eixo:'ruim',delta:2,motivo:'Mentiu sobre o que viu na usina'},
      moral:-10,
      registrar:'Mentiu sobre a usina.',
      presagio:'A certeza. Era a única coisa que tinham vindo buscar.'},
  escolhas:[
    {texto:'Seguir para Saffron.', vai:'c10_fim'},
    {texto:'Voltar e contar a verdade.', vai:'c10_contou'},
    {texto:'Ir a Lavender devolver a foto.', vai:'c10_lavender', cond:d=>!!d.flags.tem_a_foto && !!d.flags.endereco_almerinda},
    {texto:'Voltar pra usina.', vai:'c10_galpao'}
  ]
},

c10_interditou:{
  falante:'Sr. Edric',
  vozes:['P','N','N'],
  texto:[
    'Você fica mais um dia.',
    'Não acontece nada heroico: você ajuda a carregar quatro cavaletes de madeira e um rolo de fita listrada da casa do Sr. Edric até a curva da Rota 10, e vocês fecham os dois acessos ao vale.',
    'Depois ele prega uma placa de compensado, escrita a tinta, com a letra de um homem que passou dezenove anos preenchendo formulário:',
    '**ÁREA COM RISCO ELÉTRICO — NÃO ENTRE — AVISO REGISTRADO NA COMPANHIA, PROTOCOLO 88.412**',
    'O protocolo existe. Ele ligou de manhã e deixou registrado.',
    '"Isso não vai impedir ninguém," você diz.',
    '"Não vai," ele concorda. "Mas agora quem entrar entra sabendo. E isso é diferente."'
  ],
  ef:{flag:['interditou_a_rota','eloi_vai_ligar'],
      executar:d=>{ Relogio.avancar(24); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Ficou mais um dia para fechar a estrada'},
      moral:10,
      npc:{nome:'Sr. Edric', opiniao:7, memoria:'Interditou a Rota 10 com você, com protocolo registrado.'},
      registrar:'A Rota 10 foi interditada por vocês dois, com protocolo 88.412.',
      presagio:'Agora quem entrar entra sabendo. É o máximo que dá pra fazer e não é pouco.'},
  escolhas:[
    {texto:'Seguir para Saffron.', vai:'c10_fim'},
    {texto:'Ir a Lavender devolver a foto.', vai:'c10_lavender', cond:d=>!!d.flags.tem_a_foto && !!d.flags.endereco_almerinda},
    {texto:'Voltar pra usina mais uma noite.', vai:'c10_galpao'},
    {texto:'Ficar mais um dia com ele.', vai:'c10_sentou_com_eloi'}
  ]
},

c10_lavender:{
  falante:'Sra. Vesna',
  vozes:['N','P','N','N'],
  texto:[
    'Você volta a Lavender só pra isso. São seis horas de estrada pra entregar uma foto três por quatro.',
    'A casa da rua de trás do cemitério tem portão verde e uma campainha que não funciona, então você bate palma no portão, do jeito antigo.',
    'Ela não abre a porta. Abre a janela.',
    'Uma mulher muito velha, de perto de oitenta anos, olhando por uma fresta de trinta centímetros.',
    '"Não quero comprar nada."',
    '"Eu não tô vendendo. Eu tenho uma coisa que era do seu filho."',
    'A janela não fecha. Ela também não abre mais.',
    'Você põe a foto no degrau, embaixo de uma pedra pra não voar, e recua até a calçada.',
    'Ela desce. Pega. Olha.',
    'E aí ela faz uma coisa que você não estava preparad{o|a} pra ver: ela vira a foto e lê o que está escrito atrás, "mãe — 71", e fica ali no degrau lendo duas palavras e um número por um tempo muito longo.',
    '"Ele tinha vinte e seis," ela diz, pra você ou pra ninguém. "Vinte e seis e guardava foto da mãe no armário."',
    'E entra e fecha a porta, e você vai embora, e nenhum dos dois disse obrigado nem de nada.'
  ],
  ef:{flag:['devolveu_a_foto','conheceu_almerinda'],
      executar:d=>{ Relogio.avancar(6); return []; },
      perdeItens:{'Foto três por quatro':1},
      rep:{eixo:'bom',delta:4,motivo:'Andou seis horas para devolver uma foto três por quatro'},
      moral:20,
      npc:{nome:'Sra. Vesna', opiniao:5, memoria:'Você deixou no degrau dela a foto que o filho guardava no armário da usina.'},
      registrar:'Devolveu à Sra. Vesna a foto que o Silas guardava no armário.',
      presagio:'Nenhum dos dois disse obrigado. Algumas coisas não precisam.'},
  escolhas:[
    {texto:'Seguir para Saffron.', vai:'c10_fim'},
    {texto:'Ir contar pro Sr. Edric que ela pegou.', vai:'c10_contou_pro_eloi_da_foto'},
    {texto:'Voltar pra usina.', vai:'c10_galpao'},
    {texto:'Sentar na calçada um tempo antes de ir.', vai:'c10_fim'}
  ]
},

c10_contou_pro_eloi_da_foto:{
  falante:'Sr. Edric',
  vozes:['N','P','N','P','N','N'],
  texto:[
    'Você volta à Rota 10 só pra contar que ela pegou a foto.',
    'Ele ouve de pé, com o boné na mão.',
    '"Ela desceu no degrau?"',
    '"Desceu."',
    '"E leu o que tinha atrás?"',
    '"Leu."',
    'Ele põe o boné.',
    '"Onze anos eu deixo bolo de frutas naquele degrau e nunca vi ela descer."',
    'Ele senta na cadeira de praia, de frente pra usina.',
    '"Vai pra Saffron, {garoto|garota}. Você tá indo bem e eu não sou de dizer isso."'
  ],
  ef:{flag:'eloi_se_despediu',
      executar:d=>{ Relogio.avancar(6); return []; },
      npc:{nome:'Sr. Edric', opiniao:8, memoria:'Soube que a Sra. Vesna desceu no degrau. Foi o melhor dia dele em onze anos.'},
      moral:15,
      rep:{eixo:'bom',delta:2,motivo:'Voltou seis horas de estrada só para contar uma coisa boa'},
      registrar:'Contou ao Sr. Edric que a Sra. Vesna desceu no degrau.'},
  escolhas:[{texto:'Seguir para Saffron.', vai:'c10_fim'}]
},

c10_fim:{
  texto:[
    'A estrada pra Saffron atravessa a Rota 5 e é a única de Kanto com asfalto o caminho inteiro.',
    'Isso te dá uma sensação esquisita depois de dias pisando em brita e concreto queimado: os seus pés param de doer e a sua cabeça não para junto.',
    d=>{
      if (d.flags.capturou_zapdos && d.flags.levou_zapdos) return 'Na sua mochila tem uma Pokébola que pesa igual às outras e que você checa três vezes por hora sem perceber que está checando.';
      if (d.flags.respondeu_a_zapdos) return 'Você bate o dedo na alça da mochila em intervalos regulares o caminho inteiro. Seis. Sem perceber.';
      if (d.flags.coletou_na_usina) return 'Na sua mochila tem duas Pokébolas que não resistiram, e elas continuam não resistindo, e isso continua sendo pior do que se resistissem.';
      if (d.flags.traiu_zapdos) return 'Céu limpo deixou de ser uma coisa neutra pra você. Você olha pra cima a cada dois minutos e sabe exatamente por quê.';
      return 'Você fica a estrada inteira montando a frase com a qual vai contar isso pra alguém, e nenhuma versão funciona.';
    },
    d=>d.flags.mediu_o_ciclo ? `E tem uma conta no seu caderno com um número circulado: ${d.flags.edric_refez_a_conta ? 'quarenta e um' : 'quarenta'} dias, contados da primeira noite na encosta.` :
       'E tem uma coisa naquela usina que continua zumbindo sem carga nenhuma enquanto você vira a esquina.',
    'Saffron aparece antes do que você espera — e aparece por cima: os prédios são visíveis de dezenove quilômetros de distância.',
    'O mais alto deles é azul e tem o logotipo da Silph no topo.',
    d=>d.flags.sabe_do_andar_11 ? 'Você conta os andares da estrada, andando, porque não tem nada melhor pra fazer com a cabeça. Conta dez. Conta de novo. Dez.' :
       'Você conta os andares da estrada, sem motivo nenhum. Dez.'
  ],
  fim:true, resumo:'Capítulo 10 concluído — a usina te mostrou que os lendários não estão escondidos, estão só onde ninguém vai.'

}

}}

);
