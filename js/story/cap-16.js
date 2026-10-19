/* ------------------------------------------------------------
   ABERTURAS — a ilha sem nome chega até você por quatro bocas
   diferentes, todas em Fuchsia e de dia: o Sr. Tanner na mesa de
   dominó, uma carta náutica numa loja de material de pesca, um
   pescador que não quer falar, e uma pena que alguém achou na praia.
   ------------------------------------------------------------ */
const C16_ABERTURAS = ['c16_velho', 'c16_ab_a_carta_nautica', 'c16_ab_a_pena', 'c16_ab_quem_nao_fala'];
const C16_CARTA = 900;
function c16_cabe(id, d){
  if (id === 'c16_ab_a_carta_nautica') return d.jogador.dinheiro >= C16_CARTA;
  return true;
}
function c16_abertura(d){
  const cand = C16_ABERTURAS.filter(id => c16_cabe(id, d));
  const id = Dados.escolher(cand);
  if (d && d.relogio && d.flags && d.flags.c16_chegada == null){
    /* o cais, a loja e o calçadão são de dia */
    const h = c16_hora(d);
    if (h < 7 || h >= 18) c16_ate(8, true);
    c16_chegou(d);
  }
  return id;
}

/* ------------------------------------------------------------
   O TEMPO DA ILHA. O Sr. Tanner sai às sete da noite e chega com o
   dia, porque ilha sem cais não se encosta no escuro: a travessia
   leva onze horas. Voando são quatro. A luz vem às onze e dez da
   noite e fica quarenta minutos, duas ou três noites seguidas nos
   anos de janela — e este é um deles. Datas que a Nina conta saem do
   calendário, contadas do dia em que você chegou a Fuchsia.
   ------------------------------------------------------------ */
const C16_SAIDA = 19, C16_TRAVESSIA = 11, C16_VOO = 4, C16_LUZ = 23;
/* o irmão da Nina achou a pena C16_ACHOU dias antes de você chegar, e foi enterrado quatro dias depois */
const C16_ACHOU = 38, C16_ENTERRO = 34;
function c16_hora(d){ sincronizarHora(d.relogio); return d.relogio.hora; }
/* a próxima vez que der h horas; em terra o time come (viver), no mar e na ilha não */
function c16_ate(h, emTerra){
  const r = Estado.dados.relogio; sincronizarHora(r);
  const falta = (h - r.hora + 24) % 24;
  if (falta){ if (emTerra) Relogio.viver(falta); else Relogio.avancar(falta); }
  return falta;
}
function c16_deDia(d){ const h = c16_hora(d); return h >= 6 && h < 18; }
function c16_chegou(d){
  if (d.flags.c16_chegada == null) d.flags.c16_chegada = d.relogio.dia;
  return d.flags.c16_chegada;
}
/* a data de `atras` dias antes do dia em que você chegou */
function c16_data(d, atras){
  const C = Calendario;
  let abs = c16_chegou(d) - 1 + C.inicio() - 1 - (atras || 0), m = 0;
  while (abs < 0){ m = (m + 11) % 12; abs += C.DIAS[m]; }
  while (abs >= C.DIAS[m]){ abs -= C.DIAS[m]; m = (m + 1) % 12; }
  return {dia: abs + 1, mes: C.MESES[m], num: (m + 2) % 12 + 1};
}
function c16_dia(x){ return x.dia === 1 ? 'primeiro' : porExtenso(x.dia); }
function c16_ext(x){ return `${c16_dia(x)} de ${x.mes}`; }
function c16_num(x){ return `${String(x.dia).padStart(2, '0')}/${String(x.num).padStart(2, '0')}`; }
/* o que ilumina de noite: "com a luz de X", "com a lanterna", ou nada */
function c16_luz(){ const l = Campo.iluminar(); return l.pode ? l.como : ''; }
/* riscos de pedra só fazem sombra com luz de lado */
function c16_luzDeLado(d){
  const h = c16_hora(d);
  if (h >= 6 && h < 10)  return 'com o sol ainda baixo batendo de lado, que é a luz que faz sombra em risco de pedra';
  if (h >= 15 && h < 18) return 'com o sol da tarde batendo de lado, que é a luz que faz sombra em risco de pedra';
  if (h >= 10 && h < 15) return 'passando o dedo em cada lateral, porque com o sol a pino risco de pedra não faz sombra';
  const l = c16_luz();
  return l ? `${l} de lado, pra pegar sombra na lateral` : 'passando o dedo em cada lateral, no escuro';
}
/* quanto tempo você esperou no círculo, contado no executar da cena */
function c16_espera(d){
  const f = d.flags.c16_espera_circulo || 0;
  if (f === 0) return 'Não demora.';
  if (f <= 3)  return 'Escurece de vez. Uma hora, depois outra.';
  if (f <= 6)  return 'O sol desce no mar a oeste, do lado da face cortada a pique, e leva a cor junto. Depois, horas de escuro.';
  if (f <= 11) return 'A tarde inteira. O sol desce no mar a oeste, do lado da face cortada a pique, e leva a cor junto. Depois, horas de escuro.';
  if (f <= 17) return 'O dia inteiro. O sol atravessa o céu por cima do alicerce e desce no mar a oeste, e depois vem o escuro, e você continua.';
  return 'O resto da madrugada, e o dia inteiro, e o pôr do sol, e o escuro de novo.';
}

/* ------------------------------------------------------------
   QUEM SABE O QUÊ
   ------------------------------------------------------------ */
function c16_eu(t){ return d => fala(d.jogador.nome, t); }
function c16_opiniao(nome){ const n = Estado.npc(nome); return n && typeof n.opiniao === 'number' ? n.opiniao : 0; }
/* a opinião só sobe com o que é bom: cena boa depois de cena melhor não derruba o que ficou */
function c16_npc(nome, op, memoria){ return () => ({nome, opiniao: Math.max(c16_opiniao(nome), op), memoria}); }
function c16_voou(d){ return !!d.flags.chegou_voando_na_ilha; }
/* por onde se desce da ilha até o barco */
function c16_descida(d){ return d.flags.achou_a_escada ? 'os cento e quatro degraus' : 'a rampa de pedregulho da face leste'; }
/* a Silph tem o seu rosto: você entrou lá, viu o andar onze ou disparou o alarme */
function c16_conhecidoNaSilph(d){ const f = d.flags; return !!(f.dentro_da_silph || f.viu_os_doze || f.alarme_silph || f.desfez_o_alarme); }
/* a expedição ainda está na ilha */
function c16_equipeNaIlha(d){ return !!d.flags.achou_equipe_na_ilha && !d.flags.expulsou_a_equipe; }
/* quantos papéis tem a caixa: só a Dra. Cordell contou */
function c16_papeis(d){ return d.flags.ivone_tem_a_ilha ? 'quarenta e três' : 'uns quarenta'; }
/* quem tem a caixa de charuto agora */
function c16_comACaixa(d){ return !!d.flags.tem_a_caixa_de_charuto && !d.flags.devolveu_a_caixa; }
/* Ho-Oh sobe pela luz e vai embora: a cena guarda se foi ali que ele foi */
function c16_hoohSobe(d){ d.flags.c16_hooh_saiu_aqui = !d.flags.c16_hooh_foi; d.flags.c16_hooh_foi = true; }
/* quem esperou com você no círculo */
function c16_comAEquipe(d){
  const f = d.flags;
  if (!c16_equipeNaIlha(d)) return '';
  if (f.destruiu_a_expedicao) return 'Do platô sul ninguém sobe. Sem a câmera que você quebrou, eles não têm o que apontar.';
  if (f.equipe_aliada || f.equipe_hesita || f.pediu_pra_equipe || f.equipe_ficou)
    return 'No canto da laje, a chefe da expedição e os outros três sentam no chão, longe de você, com a câmera térmica no colo.';
  return '';
}
/* opção que leva a esperar a noite lá embaixo: só antes de a luz vir */
function C16_NOITE(texto){ return {texto, vai:'c16_esperou_noite', cond:d => !d.flags.viu_o_arco_iris && !d.flags.viu_hooh}; }

/* ============================================================
   CAPÍTULO 16 — A ILHA SEM NOME
   ============================================================ */
CAPITULOS.push(
{
num:16, titulo:'A Ilha Sem Nome', local:'Mar a sudoeste de Kanto', ambiente:'montanha', nivelArea:52,
tom:'muito sombrio', entradas:C16_ABERTURAS,
inicio: d => c16_abertura(d),
/* Voltar a um lugar onde já se esteve é outra cena: a mesa de dominó,
   o alicerce, o acampamento, o círculo depois que ele já veio. */
desvios:{
  c16_velho:              {se:d => Historia.jaAconteceu('c16_velho') && d.cena !== 'c16_velho', vai:'c16_velho_de_novo'},
  c16_alicerce:           {se:d => Historia.jaAconteceu('c16_alicerce') && d.cena !== 'c16_alicerce', vai:'c16_alicerce_de_novo'},
  c16_botas:              {se:d => !!d.flags.achou_equipe_na_ilha && d.cena !== 'c16_botas', vai:'c16_acampamento'},
  c16_esperou_no_circulo: {se:d => !!d.flags.viu_hooh && d.cena !== 'c16_esperou_no_circulo', vai:'c16_circulo_vazio'}
},
cenas:{

c16_ab_a_carta_nautica:{
  texto:[
    'A loja de material de pesca de Fuchsia vende anzol, linha, boia, isca e, numa gaveta de madeira no fundo, cartas náuticas.',
    'Elas custam novecentos cada e ninguém compra, porque quem precisa de carta náutica já tem a carta náutica.',
    'Você pede a do setor sudoeste. O dono levanta as sobrancelhas e não pergunta nada, que é o serviço dele.',
    'A carta é linda: azul-clara nos baixios, azul-escura nos fundões, com a profundidade escrita em número miúdo e uma malha de linhas finas.',
    'E a sudoeste, a noventa e poucas milhas, um ponto preto com uma legenda de três palavras:',
    '**RECIFE ALTO S/ NOME**',
    'Recife alto quer dizer rocha que sai da água. Ilha, portanto.',
    'Uma ilha que está na carta náutica e não está em nenhum mapa de Kanto, porque mapa de Kanto é feito pra quem anda em terra, e ninguém anda em terra até lá.'
  ],
  ef:{dinheiro:-C16_CARTA, flag:['sabe_da_ilha','tem_a_carta_nautica'],
      registrar:'Comprou a carta náutica do setor sudoeste. A ilha consta como "recife alto s/ nome".',
      presagio:'A informação nunca esteve escondida. Estava no papel que ninguém compra.'},
  escolhas:[
    {texto:'Perguntar ao dono se alguém já foi lá.', vai:'c16_ab_o_dono_da_loja'},
    {texto:'Levar a carta pro cais e procurar quem leve você.', vai:'c16_travessia'},
    {texto:'Procurar o velho do dominó, o que conta da ilha.', vai:'c16_velho'}
  ]
},

c16_ab_o_dono_da_loja:{
  texto:[
    'Ele olha o ponto na carta onde o seu dedo está e demora a responder.',
    fala('o dono da loja', 'Essa carta aí eu vendi três vezes em dezoito anos.'),
    c16_eu('Pra quem?'),
    fala('o dono da loja', 'Uma pra um pesquisador, em oitenta e nove. Uma pra uns caras de terno, em noventa e três.'),
    'Ele bate no balcão com o nó do dedo.',
    fala('o dono da loja', 'E uma pra você.'),
    c16_eu('Cara de terno compra carta náutica?'),
    fala('o dono da loja', 'Compraram quatro. Sudoeste, sul, sudeste e a geral. E dois aparelhos de navegação por satélite, que naquela época custavam o preço de um carro.'),
    'Ele dobra a carta pra você no vinco certo, que é um cuidado de quem respeita papel.',
    fala('o dono da loja', 'Homem que paga isso pra ir num recife sem nome não tá indo pescar.', 'baixo'),
    fala('o dono da loja', 'Saíram daqui com o Orso, que é quem leva gente pra fora sem perguntar. Se ele deixar você perguntar, pergunta pra ele.')
  ],
  ef:{flag:'os_de_terno_compraram_carta',
      npc:{nome:'o dono da loja', opiniao:1, viuVoce:'Te vendeu a carta náutica do setor sudoeste.'},
      registrar:'Em 1993, homens de terno compraram quatro cartas náuticas e dois aparelhos de navegação na loja de pesca de Fuchsia, e saíram com o Orso.',
      presagio:'Quatro cartas e dois aparelhos de navegação, pra um recife sem nome.'},
  escolhas:[
    {texto:'Ir pro cais procurar quem leve você.', vai:'c16_travessia'},
    {texto:'Procurar o velho do dominó.', vai:'c16_velho'},
    {texto:'Procurar o Orso.', vai:'c16_ab_quem_nao_fala'}
  ]
},

c16_ab_a_pena:{
  texto:[
    'Tem uma menina de uns nove anos vendendo concha numa toalha estendida no calçadão de Fuchsia, e o negócio dela vai mal, porque concha é de graça na praia. Ela sabe disso e monta a toalha todo dia mesmo assim.',
    'Tem um papelão na frente da toalha com o preço e o nome do negócio em letra de criança: CONCHAS DA NINA.',
    'No canto da toalha, entre as conchas, tem uma coisa que não é concha.',
    'É uma pena. Uns vinte e dois centímetros, curvada, com a haste clara e a barba em três faixas: vermelha na ponta, depois branca, depois uma faixa que não é bem dourada e não é bem verde, e que muda quando você move a cabeça.',
    'Você já viu pena de Pidgeot, de Fearow, de Spearow. Nenhuma faz isso.',
    c16_eu('Quanto é essa?'),
    fala('Nina', 'Essa não é de vender.'),
    c16_eu('Por quê?'),
    fala('Nina', 'Porque meu irmão achou na praia do sul, e ele falou que é de sorte.'),
    'Ela endireita a pena na toalha com um dedo.',
    fala('Nina', 'Mas ele morreu. Então eu não sei mais se é.')
  ],
  ef:{flag:'viu_a_pena',
      npc:{nome:'Nina', opiniao:1, viuVoce:'Você reparou na pena entre as conchas dela.'},
      registrar:'Nina, de Fuchsia, tem uma pena de três faixas que o irmão achou na praia do sul.',
      presagio:'Vermelha, branca e uma cor que muda com o ângulo. Isso não é de nenhum Pokémon que você conhece.'},
  escolhas:[
    {texto:'Perguntar onde exatamente o irmão achou.', vai:'c16_ab_onde_achou'},
    {texto:'Oferecer para comprar mesmo assim.', vai:'c16_ab_ofereceu_pela_pena'},
    {texto:'Não insistir. Procurar o velho que conta da ilha.', vai:'c16_velho'}
  ]
},

c16_ab_onde_achou:{
  texto:[
    fala('Nina', 'Na ponta sul, depois da pedra grande.'),
    'Ela aponta. A ponta sul fica visível daqui, a uns dois quilômetros, e a pedra grande também.',
    fala('Nina', 'Ele ia lá todo dia de manhã. Ele catava vidro.'),
    c16_eu('Vidro?'),
    fala('Nina', 'Vidro de garrafa que o mar lixa. Fica fosco e fica bonito.'),
    'Ela tira um potinho de plástico da bolsa e mostra: uns quarenta cacos de vidro verde e âmbar, lixados pelo mar, bonitos mesmo.',
    fala('Nina', 'A pena tava junto do vidro. Em cima da linha da maré.'),
    'E aí ela fala a frase que muda a conversa:',
    d=>{ const a = c16_data(d, C16_ACHOU), b = c16_data(d, C16_ENTERRO);
         return fala('Nina', `Ele achou em ${c16_ext(a)}, e a gente enterrou ele ${a.mes === b.mes ? 'no dia ' + c16_dia(b) : 'em ' + c16_ext(b)}.`); },
    fala('Nina', 'Meu pai falou que a pena deu azar. Eu acho que ela só tava lá.', 'baixo')
  ],
  ef:{flag:'a_pena_da_ponta_sul',
      registrar:d=>`A pena foi achada na linha da maré da ponta sul de Fuchsia, em ${c16_num(c16_data(d, C16_ACHOU))}.`,
      presagio:'Coisa que boia vem de onde o mar vem. O mar de Fuchsia vem do sudoeste.'},
  escolhas:[
    {texto:'Oferecer para comprar a pena.', vai:'c16_ab_ofereceu_pela_pena'},
    {texto:'Ir até a ponta sul procurar mais.', vai:'c16_ab_a_ponta_sul'},
    {texto:'Procurar o velho que conta da ilha do sudoeste.', vai:'c16_velho'}
  ]
},

c16_ab_ofereceu_pela_pena:{
  texto:[
    c16_eu('Eu não quero comprar pra guardar. Eu quero saber de onde ela veio.'),
    'A menina te olha do jeito que criança olha gente grande que falou uma coisa que criança entende e gente grande não costuma dizer.',
    fala('Nina', 'De onde ela veio, ou de quem ela é?'),
    c16_eu('De quem ela é.'),
    'Ela pega a pena, olha contra o sol, e a faixa do meio muda de cor na mão dela.',
    fala('Nina', 'Então leva.'),
    c16_eu('Eu pago.'),
    fala('Nina', 'Não. Se você pagar, vira concha.'),
    'Ela põe a pena na sua mão com as duas mãos dela, que é como se entrega coisa importante.',
    fala('Nina', 'Você volta e me conta de quem é.'),
    'Não é pedido. É condição.'
  ],
  ef:{flag:['carrega_a_pena','a_promessa_da_menina'], moral:1,
      npc:{nome:'Nina', opiniao:3, viuVoce:'Te deu a pena de graça, com a condição de você voltar e contar de quem é.'},
      registrar:'Está carregando a pena de três faixas. Prometeu à Nina voltar e dizer de quem ela é.'},
  escolhas:[
    {texto:'Ir até a ponta sul procurar mais.', vai:'c16_ab_a_ponta_sul'},
    {texto:'Procurar o velho que conta da ilha do sudoeste.', vai:'c16_velho'},
    {texto:'Ir pro cais procurar quem leve você.', vai:'c16_travessia'}
  ]
},

c16_ab_a_ponta_sul:{
  texto:[
    'A ponta sul de Fuchsia é uma praia de pedra com dois quilômetros de nada e uma pedra grande que dá nome ao lugar.',
    'Você anda a linha da maré por uma hora e quarenta, de cabeça baixa, catando com os olhos.',
    'Acha vidro fosco (muito), uma sandália, meio quilômetro de linha de pesca enrolada em alga e um isqueiro.',
    'Pena, nenhuma.',
    'Mas na volta, em cima da pedra grande, tem uma coisa que você não viu na ida, porque estava olhando pro chão.',
    'Uma marca. Uma queimadura circular na rocha, de uns setenta centímetros, com a borda vitrificada.',
    'Pedra vitrifica a mil e poucos graus. Isso não é fogueira de pescador.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} não sobe na pedra. Fica embaixo, olhando pra cima, e não sobe nem quando você chama.`
               : 'Você põe a mão na marca, e a rocha está fria, o que de algum jeito é pior.';
    }
  ],
  ef:{flag:['a_marca_na_pedra','viu_a_marca_da_ponta_sul'],
      executar:()=>{ Relogio.avancar(2); return []; },
      registrar:'Na pedra grande da ponta sul há uma queimadura circular de 70 cm com a borda vitrificada.',
      presagio:'Mil e poucos graus, na beira do mar, e ninguém na cidade comentou.'},
  escolhas:[
    {texto:'Procurar o velho que conta da ilha do sudoeste.', vai:'c16_velho'},
    {texto:'Ir pro cais procurar quem leve você.', vai:'c16_travessia'}
  ]
},

c16_ab_quem_nao_fala:{
  texto:[
    'Tem um homem no cais de Fuchsia que todo mundo aponta e ninguém apresenta.',
    'Cinquenta e poucos anos, barco médio, trabalha sozinho. Chama-se Orso — está pintado na popa, como em todo barco de dono — e a frase que dizem dele é sempre a mesma: "aquele ali foi em noventa e três".',
    'Ninguém completa a frase. Você tem que perguntar pra ele.',
    'Ele está remendando rede na proa e não levanta a cabeça quando você chega.',
    fala('Orso', 'Não.'),
    c16_eu('Eu não perguntei nada.'),
    fala('Orso', 'Você ia perguntar de noventa e três.'),
    'Ele passa a agulha de rede duas vezes antes de falar de novo.',
    fala('Orso', 'Eu levo carga, levo gente, levo o que pagarem. Pra sudoeste eu não vou.'),
    c16_eu('Por quanto?'),
    'Aí ele levanta a cabeça.',
    fala('Orso', '{Menino|Menina}, eu acabei de te dizer que tem um preço que eu não aceito. Você perguntou o preço.')
  ],
  ef:{flag:'sabe_da_ilha',
      npc:{nome:'Orso', opiniao:-1, viuVoce:'Você perguntou o preço depois de ele dizer que não tinha preço.'},
      registrar:'Um pescador de Fuchsia, o Orso, foi à ilha em 1993 e não volta lá por dinheiro nenhum.'},
  escolhas:[
    {texto:'Pedir desculpa e perguntar o que aconteceu.', vai:'c16_ab_pediu_desculpa'},
    {texto:'Insistir no dinheiro.', vai:'c16_ab_insistiu_no_dinheiro'},
    {texto:'Deixar ele em paz e procurar o velho do dominó.', vai:'c16_velho'}
  ]
},

c16_ab_pediu_desculpa:{
  texto:[
    c16_eu('Desculpa. Foi besteira.'),
    'Ele volta pra rede. Passa a agulha umas seis vezes. Você fica parad{o|a}, porque sair agora seria pior.',
    fala('Orso', 'Eu levei quatro homens em noventa e três. Três dias, ida e volta, muito bem pago.'),
    fala('Orso', 'Eles desceram na ilha com equipamento, e eu fiquei no barco, fundeado, que foi o combinado.'),
    'Ele para de costurar.',
    fala('Orso', 'Na segunda noite apareceu a luz.'),
    d=>fala(d.jogador.nome, Historia.jaAconteceu('c16_velho') ? 'A luz colorida.' : 'Que luz?'),
    fala('Orso', 'Colorida. Igual arco-íris, mas de noite, e arco-íris de noite não existe.'),
    fala('Orso', 'Durou uns trinta minutos.'),
    'Ele olha pro mar.',
    fala('Orso', 'E no outro dia eu trouxe três homens de volta.', 'baixo')
  ],
  ef:{flag:['sabe_da_ilha','tres_voltaram_de_quatro'],
      npc:{nome:'Orso', opiniao:2, viuVoce:'Te contou de 1993 porque você pediu desculpa.'},
      registrar:'Em 1993 o Orso levou quatro homens à ilha e trouxe três de volta. Na segunda noite houve luz colorida.',
      presagio:d=>d.flags.quatro_entraram_tres_sairam
        ? 'Quatro na ida, três na volta. Você já viu essa conta num livro de capitania, em Cinnabar.'
        : 'Quatro na ida, três na volta.'},
  escolhas:[
    {texto:'Perguntar quem era o quarto.', vai:'c16_ab_quem_era_o_quarto'},
    {texto:'Perguntar se ele levaria você.', vai:'c16_travessia'},
    {texto:'Procurar o velho do dominó com isso na cabeça.', vai:'c16_velho'}
  ]
},

c16_ab_quem_era_o_quarto:{
  texto:[
    fala('Orso', 'Eu não sei o nome de nenhum dos quatro.'),
    fala('Orso', 'Eles não falaram nome e eu não perguntei, porque quem paga o triplo não gosta de pergunta.'),
    'Ele enrola o fio da agulha de rede no dedo.',
    fala('Orso', 'Mas eu sei que o quarto era o mais velho e era o que mandava.'),
    fala('Orso', 'E eu sei que os três que voltaram não falaram uma palavra no caminho inteiro.'),
    c16_eu('Você não perguntou do quarto?'),
    fala('Orso', 'Perguntei. Uma vez.'),
    'Ele volta pra rede.',
    fala('Orso', 'Um deles falou "que quarto".'),
    fala('Orso', 'E aí eu não perguntei mais, e recebi, e nunca mais fui pro sudoeste.', 'baixo')
  ],
  ef:{flag:'que_quarto',
      registrar:'Os três que voltaram da ilha em 1993 negaram que houvesse um quarto homem.',
      presagio:'"Que quarto." E os outros dois não corrigiram.'},
  escolhas:[
    {texto:'Perguntar se ele levaria você.', vai:'c16_travessia'},
    {texto:'Procurar o velho do dominó.', vai:'c16_velho'}
  ]
},

c16_ab_insistiu_no_dinheiro:{
  texto:[
    c16_eu('Todo mundo tem preço.'),
    'Ele corta a linha da rede com o dente, devagar, e enrola a sobra no dedo.',
    fala('Orso', 'Todo mundo tem. Eu tinha.'),
    fala('Orso', 'Em noventa e três o meu preço foi o triplo da diária, e eu aceitei, e eu levei quatro homens pra lá.'),
    'Ele levanta e amarra a rede na amurada, de costas pra você.',
    fala('Orso', 'Sai do meu barco.'),
    'Você desce. Do cais dá pra ver ele ainda de costas, parado, sem fazer nada com as mãos.'
  ],
  ef:{flag:['sabe_da_ilha','quatro_homens_em_noventa_e_tres'],
      npc:{nome:'Orso', opiniao:-3, viuVoce:'Você insistiu no dinheiro depois do "não".'},
      registrar:'Em 1993 o Orso levou quatro homens à ilha pelo triplo da diária. Não fala mais com você.'},
  escolhas:[
    {texto:'Procurar outro barco no cais.', vai:'c16_travessia'},
    {texto:'Procurar o velho do dominó.', vai:'c16_velho'}
  ]
},

/* ─────────────── A MESA DE DOMINÓ ─────────────── */

c16_velho:{
  texto:[
    d=>{ Nomes.apresentar('o velho pescador');
         return 'O velho do cais que conta do arco-íris se chama Otis Tanner. Está pintado na popa do barco dele, TANNER, em letra de quem pintou com a mão firme muitos anos atrás.'; },
    'Ele tem oitenta e um anos e conta a mesma história há quarenta, na mesa de dominó, pra quem pedir e pra quem não pedir. Todo mundo já ouviu, e todo mundo muda de assunto educadamente.',
    'Hoje ele conta pra você.',
    fala('Sr. Tanner', 'Tem uma ilha a sudoeste que não entra em mapa nenhum, porque não tem nada nela. Pedra e mato. Nem água doce.'),
    d=>d.flags.tem_a_carta_nautica
      ? 'Você abre a carta náutica na mesa, por cima das pedras do dominó, e ele põe o dedo no ponto preto sem precisar procurar.'
      : fala(d.jogador.nome, 'E por que ela não entra no mapa, se ela existe?'),
    fala('Sr. Tanner', 'Ela entra na carta náutica. Carta náutica é outra coisa, {meu filho|minha filha}: tem que ter tudo que é pedra, porque pedra afunda barco.'),
    fala('Sr. Tanner', 'Tá lá como recife alto sem nome, e é por isso que ninguém sabe dela. Quem lê carta náutica é pescador, e pescador não conta pra ninguém o que não enche rede.'),
    'Ele bebe.',
    fala('Sr. Tanner', 'Meu avô chamava de ilha da torre.'),
    c16_eu('Tem torre?'),
    fala('Sr. Tanner', 'Não tem torre.'),
    'Ele olha o mar.',
    fala('Sr. Tanner', 'Ele dizia que tinha tido.'),
    'E depois, sem mudar o tom:',
    fala('Sr. Tanner', 'E de vez em quando, umas duas vezes por década, aparece luz em cima dela. De noite. Com cor.'),
    'Ele te olha.',
    fala('Sr. Tanner', 'Você acredita em mim.'),
    'Não é pergunta. É constatação, e ele parece cansado de a resposta ser sempre não.'
  ],
  ef:{flag:['sabe_da_ilha','conheceu_tanner'],
      npc:c16_npc('Sr. Tanner', 2, 'Te contou da ilha sem nome e da luz com cor, e reparou que você acreditou.'),
      registrar:'Ouviu falar da ilha sem nome a sudoeste. Entra na carta náutica como "recife alto sem nome".',
      presagio:d=>d.flags.tem_a_carta_nautica ? 'O ponto preto da sua carta tem nome, pra ele: a ilha da torre.'
                                               : 'Entra na carta náutica. Só estava no papel que ninguém lê.'},
  escolhas:[
    {texto:'"Duas vezes por década desde quando?"', vai:'c16_desde_quando'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'Não ir. Você já tem problema demais.', vai:'c16_nao_foi'}
  ]
},

c16_velho_de_novo:{
  texto:[
    'O Sr. Tanner continua na mesa de dominó, com o mesmo copo, e levanta os olhos quando você chega.',
    d=>fala('Sr. Tanner', d.flags.nao_foi_a_ilha ? 'Voltou. Mudou de ideia, ou veio jogar?' : 'Voltou.')
  ],
  escolhas:[
    {texto:'"Duas vezes por década desde quando?"', vai:'c16_desde_quando'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'"Posso levar a caixa?"', vai:'c16_levou_a_caixa', cond:d=>!!d.flags.viu_a_caixa_de_charuto},
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'Ir embora. Você já tem problema demais.', vai:'c16_nao_foi', cond:d=>!d.flags.nao_foi_a_ilha}
  ]
},

c16_desde_quando:{
  texto:[
    c16_eu('Duas vezes por década desde quando?'),
    'Ele para de mexer no copo.',
    fala('Sr. Tanner', 'Boa pergunta.'),
    'Ele se levanta, o que leva um tempo, vai até o barco e volta com uma caixa de charuto amarrada com elástico.',
    'Dentro tem papel. Muito papel: folha de caderno, verso de recibo, guardanapo, e uns quarenta bilhetes em papel de pão, cada um com uma data e uma linha.',
    '**"12/3/39 — luz sobre a ilha da torre, 23h mais ou menos, uns 30 min. — H. Tanner"**',
    '**"4/9/65 — luz, cor, 22h40 até 23h20. Pai tava no mar. — O. Tanner"**',
    '**"19/11/72 — luz. Sozinho. Ninguém acreditou. — O. Tanner"**',
    c16_eu('Quarenta anos disso?'),
    fala('Sr. Tanner', 'Sessenta e um, {meu filho|minha filha}. Meu pai começou em trinta e nove, e eu peguei junto em cinquenta e nove.'),
    'Ele bate na caixa.',
    fala('Sr. Tanner', 'Vinte e três noites anotadas em sessenta e um anos.')
  ],
  ef:{flag:['viu_a_caixa_de_charuto','tem_o_registro_da_ilha'],
      npc:c16_npc('Sr. Tanner', 5, 'Guarda numa caixa de charuto 61 anos de bilhetes com as noites da luz sobre a ilha.'),
      rep:{eixo:'bom',delta:3,motivo:'Perguntou desde quando, e a resposta era uma caixa de charuto'},
      registrar:'A luz sobre a ilha foi anotada em 23 noites ao longo de 61 anos, por pai e filho.',
      presagio:'Vinte e três noites em sessenta e um anos. Isso é um dado. Ninguém nunca chamou de dado.'},
  escolhas:[
    {texto:'Pôr as datas em ordem e procurar padrão.', vai:'c16_o_padrao'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'"Posso levar a caixa?"', vai:'c16_levou_a_caixa'}
  ]
},

c16_o_padrao:{
  texto:[
    'Você espalha os papéis na mesa de dominó e põe em ordem de data, e o Sr. Tanner assiste sem ajudar, porque ele nunca pôs.',
    'Ele guardou sessenta e um anos e nunca pôs em ordem.',
    'Leva vinte minutos. E aí aparece.',
    'As noites não se espalham pelos anos. Vinte e duas delas caem sempre nos mesmos anos, duas ou três noites seguidas: trinta e nove, quarenta e seis, cinquenta e três, cinquenta e nove, sessenta e cinco, setenta e dois, setenta e nove, oitenta e seis, noventa e três.',
    'Não é exatamente regular — o intervalo varia de seis a sete anos —, mas é um intervalo.',
    'E sobra uma noite fora da conta: noventa e seis. Três anos depois da última, cedo demais pra série.',
    'Você faz a conta na margem de um papel de pão. Noventa e três mais seis. Noventa e três mais sete.',
    fala('Sr. Tanner', 'Noventa e nove não teve. Eu olhei o ano inteiro.'),
    'Então, se a série vale, a próxima é este ano.',
    'O Sr. Tanner olha a tabela que você montou na mesa de dominó com quarenta papéis de pão e não fala nada por um tempo.',
    fala('Sr. Tanner', 'Sessenta e um anos. Eu nunca botei em ordem.')
  ],
  ef:{flag:['achou_o_padrao','sabe_que_e_esse_ano'],
      npc:c16_npc('Sr. Tanner', 8, 'Guardou 61 anos de bilhetes e nunca os pôs em ordem, até você fazer isso numa mesa de dominó.'),
      rep:{eixo:'bom',delta:5,motivo:'Pôs em ordem sessenta e um anos de papel de pão'},
      instabilidade:1,
      registrar:'A luz aparece a cada 6 ou 7 anos, duas ou três noites seguidas; a última da série foi em 1993, e em 1996 houve uma noite fora da conta. Pela série, a próxima é este ano.'},
  escolhas:[
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'"O que aconteceu em noventa e seis?"', vai:'c16_noventa_e_seis'},
    {texto:'"Posso levar a caixa?"', vai:'c16_levou_a_caixa'}
  ]
},

c16_noventa_e_seis:{
  texto:[
    c16_eu('O que aconteceu em noventa e seis?'),
    'Ele procura o papel de noventa e seis na pilha e acha de primeira, porque agora está em ordem.',
    'É um pedaço de saco de pão com a letra dele.',
    '**"14/11/96 — luz. Muito mais forte. A noite toda. E de manhã tinha Pokémon na água."**',
    c16_eu('Pokémon na água?'),
    fala('Sr. Tanner', 'Pokémon na água. Eu tava saindo pra pescar às quatro da manhã, e passou perto do meu barco, nadando, indo pra terra.'),
    c16_eu('Que Pokémon?'),
    fala('Sr. Tanner', 'Três.'),
    'Ele bate no papel.',
    fala('Sr. Tanner', 'Três Pokémon grandes, nadando da ilha sem nome pra costa de Kanto, em fila, na manhã depois da luz mais forte que eu vi na vida.'),
    'Ele olha pra você.',
    fala('Sr. Tanner', 'E eu falei isso pra sete pessoas, e as sete riram.'),
    d=>d.flags.viu_os_tres || d.flags.sabe_dos_tres ? 'Você não ri.' : '',
    d=>d.flags.viu_os_tres ? 'Você conta o que viu numa ciclovia, de madrugada, e o Sr. Tanner segura a beirada da mesa de dominó com as duas mãos.'
      : d.flags.sabe_dos_tres ? 'Você conta o que te contaram numa ciclovia, de três Pokémon grandes correndo de madrugada, e o Sr. Tanner segura a beirada da mesa de dominó com as duas mãos.' : ''
  ],
  ef:{flag:['sabe_dos_tres_nadando','ligou_os_tres_a_ilha'],
      npc:c16_npc('Sr. Tanner', 9, 'Viu os três nadando da ilha para a costa em 1996, e sete pessoas riram dele.'),
      rep:{eixo:'bom',delta:6,motivo:'Ligou os três da ciclovia à ilha sem nome'},
      instabilidade:1,
      registrar:'Na manhã de 15/11/1996, depois da noite da luz mais forte, três Pokémon grandes atravessaram nadando da ilha sem nome até a costa de Kanto.',
      presagio:d=>d.flags.sabe_que_subiram || d.flags.fuji_saiu
        ? 'Catorze de novembro de noventa e seis. Na madrugada do dia treze, o Dr. Fuji tinha saído de um subsolo em Cinnabar.'
        : 'Catorze de novembro de noventa e seis.'},
  escolhas:[
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'"Posso levar a caixa?"', vai:'c16_levou_a_caixa'},
    {texto:'Contar pra ele o que aconteceu em Cinnabar.', vai:'c16_contou_pro_ze', cond:d=>!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu}
  ]
},

c16_contou_pro_ze:{
  texto:[
    'Você conta.',
    d=>d.flags.fuji_saiu
      ? 'Na noite de doze de novembro de noventa e seis, o Dr. Fuji desceu ao subsolo do laboratório de Cinnabar às nove e quarenta, e só saiu às quatro e dez da manhã do dia treze.'
      : 'Numa madrugada de novembro de noventa e seis, o Dr. Fuji saiu do laboratório de Cinnabar às quatro e dez da manhã.',
    d=>d.flags.sabe_que_subiram
      ? 'Com uma coisa andando do lado dele, no mesmo passo. Os dois subiram a estrada do vulcão, e ninguém viu nenhum dos dois descer.'
      : 'E ninguém viu ele descer pra cidade.',
    'Na noite do dia catorze apareceu sobre a ilha do sudoeste a luz mais forte que o Sr. Tanner já viu.',
    'E na manhã do quinze, três Pokémon grandes atravessaram nadando.',
    'O Sr. Tanner ouve tudo com as duas mãos na mesa, e no fim não fala nada por quase um minuto.',
    'Depois:',
    fala('Sr. Tanner', 'Então a luz não é uma coisa chegando.'),
    c16_eu('Como?'),
    fala('Sr. Tanner', 'Eu passei sessenta e um anos achando que a luz era uma coisa chegando na ilha.'),
    'Ele olha os papéis em ordem.',
    fala('Sr. Tanner', 'A luz é alguém fazendo uma coisa.')
  ],
  ef:{flag:['ze_entendeu','ligou_tudo'],
      npc:c16_npc('Sr. Tanner', 10, 'Entendeu, com você, que a luz não é uma chegada: é alguém fazendo alguma coisa.'),
      rep:{eixo:'bom',delta:6,motivo:'Juntou Cinnabar, a ciclovia e a ilha numa mesa de dominó'},
      instabilidade:1, moral:15,
      registrar:'A luz sobre a ilha não é uma chegada: é alguém fazendo alguma coisa.',
      presagio:'Vinte e três noites em sessenta e um anos, alguém fez alguma coisa naquela ilha.'},
  escolhas:[
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'"Posso levar a caixa?"', vai:'c16_levou_a_caixa'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'}
  ]
},

c16_levou_a_caixa:{
  texto:[
    c16_eu('Posso levar a caixa?'),
    'Ele olha a caixa de charuto amarrada com elástico.',
    fala('Sr. Tanner', 'Pra quê?'),
    c16_eu('Pra dar pra alguém que publique.'),
    'Ele demora.',
    fala('Sr. Tanner', 'Isso aqui é do meu pai.'),
    c16_eu('Eu sei.'),
    fala('Sr. Tanner', 'Isso aqui é a única coisa que sobrou do meu pai, {meu filho|minha filha}, porque ele morreu no mar e a gente não achou, e o enterro foi de caixão vazio.'),
    'Silêncio na mesa de dominó.',
    'E aí ele empurra a caixa na sua direção com dois dedos.',
    fala('Sr. Tanner', 'Leva.'),
    c16_eu('Não precisa.'),
    fala('Sr. Tanner', 'Leva. Sessenta e um anos guardado numa caixa de charuto embaixo do banco de um barco é a mesma coisa que não ter guardado.'),
    'Ele ajeita o elástico.',
    fala('Sr. Tanner', 'Meu pai não anotou pra ficar numa caixa.')
  ],
  ef:{flag:['tem_a_caixa_de_charuto','provas_da_ilha'],
      itens:{'Caixa de charuto com 61 anos de bilhetes':1},
      npc:c16_npc('Sr. Tanner', 10, 'Te entregou a caixa de charuto do pai, que morreu no mar e teve enterro de caixão vazio.'),
      rep:{eixo:'bom',delta:6,motivo:'Recebeu sessenta e um anos de registro de quem tinha só isso'},
      moral:20,
      registrar:'Recebeu a caixa de charuto com 61 anos de bilhetes sobre a luz da ilha.',
      presagio:'Sessenta e um anos embaixo do banco de um barco.'},
  escolhas:[
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'Levar a caixa à Dra. Cordell antes.', vai:'c16_ivone_caixa', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar a caixa à Colônia de Pescadores.', vai:'c16_colonia_caixa'}
  ]
},

c16_colonia_caixa:{
  texto:[
    d=>{
      if (d.flags.achou_a_colonia)
        return 'Você leva a caixa à Colônia de Pescadores, no sobrado da rua do cais. A Edith te vê entrar de novo e abre o elástico com um cuidado que você não esperava.';
      Nomes.apresentar('a secretária da colônia');
      return 'Você leva a caixa à Colônia de Pescadores, um sobrado de dois andares na rua do cais. A secretária tem sessenta e dois anos e EDITH escrito à mão no crachá, e abre o elástico com um cuidado que você não esperava.';
    },
    'Ela lê três bilhetes e para.',
    fala('a secretária da colônia', 'O. Tanner. H. Tanner.'),
    d=>fala(d.jogador.nome, d.flags.achou_a_colonia ? 'Dá pra achar ele nos livros de saída?' : 'A senhora conhece?'),
    d=>fala('a secretária da colônia', d.flags.achou_a_colonia
      ? 'Meu bem, o de trinta e nove eu acho de olho fechado.'
      : 'Meu bem, eu tenho o livro de saída de embarcação de mil novecentos e trinta e nove.'),
    'Ela vai ao armário e volta com o livro mais velho da pilha, com a capa descolando, e abre em março.',
    'E ali está: **TANNER, H. — saída 12/03 — área declarada: recife alto SW**.',
    'A mesma data do primeiro bilhete.',
    fala('a secretária da colônia', 'Ele declarou o recife como área de pesca em trinta e nove.'),
    'Ela pega mais livros e vira mais páginas.',
    fala('a secretária da colônia', 'E em quarenta e seis. E em cinquenta e três.'),
    'Ela levanta a cabeça.',
    fala('a secretária da colônia', 'Meu bem, esse homem declarou saída pra ilha em todas as noites da caixa até setenta e nove. Dezenove saídas.'),
    c16_eu('E isso quer dizer o quê?'),
    fala('a secretária da colônia', 'Que ele não via da costa.'),
    'Ela fecha o livro.',
    fala('a secretária da colônia', 'Ele ia.'),
    'Antes de você sair, ela tira fotocópia das páginas, de trinta e nove a setenta e nove, sem você pedir.'
  ],
  ef:{flag:['descobriu_que_ele_ia','provas_da_ilha'],
      npc:c16_npc('a secretária da colônia', 8, 'Cruzou a caixa de charuto com o livro de 1939 e descobriu que o velho Tanner ia à ilha.'),
      rep:{eixo:'bom',delta:6,motivo:'Cruzou a caixa com o livro de 1939'},
      instabilidade:1,
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'H. Tanner, o pai, declarou saída para a ilha em todas as noites da caixa de 1939 a 1979: dezenove saídas.',
      presagio:'Ele ia. Sessenta e um anos, e o filho achava que era da costa.'},
  escolhas:[
    {texto:'Contar isso pro Sr. Tanner.', vai:'c16_contou_que_ele_ia'},
    {texto:'Levar tudo à Dra. Cordell.', vai:'c16_ivone_caixa', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir pro cais. Você quer ir pra ilha.', vai:'c16_travessia'}
  ]
},

c16_contou_que_ele_ia:{
  texto:[
    'Você volta ao cais com a caixa e com a fotocópia das páginas dos livros de saída, de trinta e nove a setenta e nove.',
    'O Sr. Tanner lê a linha com o nome do pai dele.',
    'E lê de novo.',
    'E depois faz uma coisa que ninguém no cais esperava, e tem umas doze pessoas assistindo:',
    'ele ri.',
    'Ri alto, sozinho, no meio do cais, com uma folha fotocopiada na mão.',
    fala('Sr. Tanner', 'O velho sacana.'),
    'Ele bate na mesa de dominó.',
    fala('Sr. Tanner', 'Ele ia! Ele ia e chegava em casa e falava que tinha visto da linha do horizonte, pra minha mãe não brigar!'),
    'Ele ri mais, e depois para de rir de uma vez, do jeito que velho para.',
    fala('Sr. Tanner', 'Ele morreu numa saída pra lá.'),
    'Ele olha a folha.',
    fala('Sr. Tanner', 'Treze de outubro de setenta e nove. Tá aqui a saída, e não tem retorno.'),
    'Ele dobra a folha e guarda no bolso da camisa.',
    fala('Sr. Tanner', 'Quarenta anos eu conto essa história e nunca soube por que ela é minha.')
  ],
  ef:{flag:['ze_sabe_do_pai','ze_vai_junto'],
      npc:c16_npc('Sr. Tanner', 10, 'Descobriu que o pai ia à ilha, e que morreu numa saída para lá em 13/10/1979.'),
      rep:{eixo:'bom',delta:7,motivo:'Devolveu a um velho o motivo da própria história'},
      moral:25,
      registrar:'O pai do Sr. Tanner morreu numa saída para a ilha sem nome, em 13/10/1979.'},
  escolhas:[
    {texto:'"Então vamos os dois."', vai:'c16_travessia'},
    {texto:'"O senhor não precisa ir."', vai:'c16_nao_precisa_ir'},
    {texto:'Levar tudo à Dra. Cordell antes.', vai:'c16_ivone_caixa', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c16_nao_precisa_ir:{
  texto:[
    c16_eu('O senhor não precisa ir.'),
    'Ele bate duas vezes no bolso da camisa onde guardou a folha.',
    fala('Sr. Tanner', 'Eu tenho oitenta e um anos, um barco de sete metros e uma próstata que não deixa eu dormir.'),
    c16_eu('Eu sei.'),
    fala('Sr. Tanner', 'E eu tenho onze horas de travessia numa direção e onze na outra. Eu já fiz essa travessia duas vezes na vida, e nas duas eu voltei sem ver nada.'),
    'Ele olha o mar.',
    fala('Sr. Tanner', 'E agora eu sei que meu pai fez dezenove.'),
    fala('Sr. Tanner', 'Sete da noite, {meu filho|minha filha}. Traz água.')
  ],
  ef:{flag:'ze_vai_junto',
      npc:c16_npc('Sr. Tanner', 10, 'Recusou ficar. Vai fazer a travessia que o pai fez dezenove vezes.'),
      rep:{eixo:'bom',delta:3,motivo:'Ofereceu e aceitou o não'},
      moral:15,
      presagio:'Ele já fez duas e voltou sem ver nada. Essa é a terceira.'},
  escolhas:[{texto:'Estar no cais às sete da noite.', vai:'c16_travessia'}]
},

c16_ivone_caixa:{
  texto:[
    'Você liga pra Dra. Cordell pelo PokéNav. Ela pega o primeiro ônibus pra Fuchsia e marca com você na lanchonete da rodoviária, porque em rodoviária ninguém olha pra ninguém.',
    d=>fala('Dra. Cordell', `${d.jogador.nome}. Senta, que eu já pedi café.`),
    'Ela abre o elástico, tira os papéis, e a primeira coisa que faz é contar quantos são.',
    'Quarenta e três.',
    'A segunda coisa é pedir uma caneta emprestada ao balconista e numerar cada um no canto, a lápis, de um a quarenta e três.',
    c16_eu('O que a senhora tá fazendo?'),
    fala('Dra. Cordell', 'Cadeia de custódia.'),
    'Ela numera o vigésimo.',
    fala('Dra. Cordell', 'Isso aqui é a coisa mais valiosa que alguém já me deu, e é um saco de pão com letra de pescador. Se eu publicar isso sem numerar e sem fotografar, alguém vai dizer que fui eu que escrevi.'),
    'Ela termina de numerar e tira uma foto de cada um.',
    'Quarenta e três fotos.',
    c16_eu('E agora?'),
    fala('Dra. Cordell', 'E agora eu devolvo.'),
    'Ela amarra o elástico de volta e empurra a caixa pra você.',
    fala('Dra. Cordell', 'Isso é do homem. Eu fico com a foto.')
  ],
  ef:{flag:['ivone_tem_a_ilha','provas_da_ilha'],
      npc:c16_npc('Dra. Cordell', 9, 'Numerou e fotografou os 43 bilhetes da caixa de charuto e devolveu a caixa.'),
      rep:{eixo:'bom',delta:5,motivo:'Levou a caixa a quem soube o que fazer com ela'},
      moral:12,
      executar:()=>{ c16_ate(17, true); return []; },
      registrar:'A Dra. Cordell fotografou e numerou os 43 bilhetes e devolveu a caixa.'},
  escolhas:[
    {texto:'Devolver a caixa ao Sr. Tanner e ir pra ilha com ele.', vai:'c16_travessia',
     ef:{flag:'devolveu_a_caixa', perdeItens:{'Caixa de charuto com 61 anos de bilhetes':1}}},
    {texto:'Ir pro cais com a caixa. O Sr. Tanner sai às sete.', vai:'c16_travessia'},
    {texto:'"A senhora vem junto?"', vai:'c16_ivone_vem'}
  ]
},

c16_ivone_vem:{
  texto:[
    c16_eu('A senhora vem junto?'),
    'Ela ri e diz não antes de você terminar a pergunta.',
    fala('Dra. Cordell', 'Eu tenho cinquenta e oito anos, enjoo em barco parado e um relatório pra fechar.'),
    'Ela guarda a câmera.',
    fala('Dra. Cordell', 'E eu vou te dizer uma coisa que levei trinta anos pra aprender, porque você é nov{o|a} e ainda dá tempo.'),
    c16_eu('O quê?'),
    fala('Dra. Cordell', 'Eu não preciso ver.'),
    'Ela bebe o café.',
    fala('Dra. Cordell', 'Metade dos pesquisadores que eu conheci se perderam porque queriam estar lá. Querer estar lá é vaidade, meu bem, e vaidade é ruim de checar.'),
    fala('Dra. Cordell', 'Eu preciso que alguém tenha estado lá e me conte, e que a conta bata com o papel.'),
    'Ela paga o café dos dois.',
    fala('Dra. Cordell', 'Vai você. Eu confiro.')
  ],
  ef:{flag:'ivone_confere',
      npc:c16_npc('Dra. Cordell', 9, 'Explicou por que não vai: querer estar lá é vaidade, e vaidade é ruim de checar.'),
      rep:{eixo:'bom',delta:2,motivo:'Convidou e recebeu uma aula'}},
  escolhas:[
    {texto:'Ir pro cais. O Sr. Tanner sai às sete.', vai:'c16_travessia'},
    {texto:'Voltar ao cais e contar pro Sr. Tanner o que a colônia achou.', vai:'c16_contou_que_ele_ia', cond:d=>!!d.flags.descobriu_que_ele_ia}
  ]
},

c16_quem_sabe:{
  texto:[
    c16_eu('Quem mais sabe disso?'),
    fala('Sr. Tanner', 'Todo pescador velho de Fuchsia sabe. Nenhum pescador novo acredita.'),
    'Ele cospe no chão do cais, que é uma coisa que ele faz quando vai dizer uma coisa que incomoda.',
    fala('Sr. Tanner', 'E teve gente de fora perguntando, faz uns três meses.'),
    c16_eu('Gente de fora?'),
    fala('Sr. Tanner', 'Gente de terno, num carro bom, perguntando de ilha sem mapa. Dois. Um moço e uma moça, os dois de trinta e poucos, educados demais.'),
    c16_eu('E o senhor falou?'),
    fala('Sr. Tanner', 'Eu falei que não sabia de nada.'),
    'Ele olha pra você.',
    fala('Sr. Tanner', 'Com você eu falei. Você não tem carro.'),
    'E depois, mais baixo:',
    fala('Sr. Tanner', 'E porque a moça perguntou uma coisa errada.'),
    c16_eu('O quê?'),
    fala('Sr. Tanner', 'Ela perguntou se a ilha tinha “janela de ocorrência regular”.'),
    'Ele bate na mesa.',
    fala('Sr. Tanner', 'Isso não é jeito de perguntar de uma luz no céu, {meu filho|minha filha}. Isso é jeito de perguntar de horário de ônibus.')
  ],
  ef:{flag:['outros_procuram_a_ilha','sabe_da_janela_da_ilha'],
      npc:c16_npc('Sr. Tanner', 6, 'Não contou nada aos dois de terno porque a moça perguntou de "janela de ocorrência regular".'),
      rep:{eixo:'bom',delta:3,motivo:'Perguntou quem mais sabia'},
      registrar:'Duas pessoas de terno procuraram a ilha faz três meses, perguntando por "janela de ocorrência regular".',
      presagio:'Janela de ocorrência regular. Alguém pôs as datas em ordem antes de você.'},
  escolhas:[
    {texto:'"Então a gente tem que ir antes deles."', vai:'c16_travessia'},
    {texto:'"Duas vezes por década desde quando?"', vai:'c16_desde_quando'},
    {texto:'"Como era o carro?"', vai:'c16_o_carro'},
    {texto:'Deixar pra lá.', vai:'c16_nao_foi'}
  ]
},

c16_o_carro:{
  texto:[
    c16_eu('Como era o carro?'),
    'Ele descreve com uma precisão que você já aprendeu a esperar de gente de cais: modelo, cor, ano aproximado, e o detalhe.',
    fala('Sr. Tanner', 'Utilitário, prata, uns três anos de uso, com o para-choque de trás amassado do lado direito.'),
    d=>d.flags.anotou_as_placas ? 'Você para de escrever.' : 'Você anota. Utilitário prata, com o para-choque de trás amassado do lado direito. É pouco e é específico, que é a melhor combinação que existe.',
    d=>d.flags.anotou_as_placas ? 'Você já viu esse carro: nível 3 da garagem da Silph, vaga 11-D, com uma caixa de papelão aberta no porta-malas e uma pasta marcada PROJ. 11 — SÉRIE 3 — ENCERRAMENTO.' : '',
    'E ele acrescenta, sem você perguntar:',
    fala('Sr. Tanner', 'E tinha um adesivo no vidro de trás. Redondinho, azul, com número.'),
    c16_eu('Que número?'),
    fala('Sr. Tanner', 'Onze.')
  ],
  ef:{flag:['reconheceu_o_carro','outros_procuram_a_ilha'],
      npc:c16_npc('Sr. Tanner', 7, 'Descreveu o carro dos dois de terno, com o adesivo azul número 11 no vidro de trás.'),
      rep:{eixo:'bom',delta:5,motivo:'Perguntou como era o carro'},
      instabilidade:1,
      registrar:'O carro dos dois de terno tem um adesivo azul com o número 11 no vidro de trás.',
      presagio:d=>d.flags.anotou_as_placas ? 'Adesivo de vaga de garagem. Eles nem tiraram.' : 'Um adesivo azul, redondo, com o número onze.'},
  escolhas:[
    {texto:'"Me leva lá. Hoje."', vai:'c16_travessia'},
    {texto:'"Duas vezes por década desde quando?"', vai:'c16_desde_quando'},
    {texto:'Levar a caixa à Dra. Cordell antes.', vai:'c16_ivone_caixa', cond:d=>!!d.flags.cartao_ivone && c16_comACaixa(d)}
  ]
},

c16_nao_foi:{
  texto:[
    'Você não vai.',
    'É defensável: onze horas de travessia num barco de sete metros com um homem de oitenta e um anos, até uma ilha sem água doce, atrás de uma luz que aparece duas vezes por década.',
    'O Sr. Tanner não insiste. Ele volta pro dominó e embaralha as pedras, e a mesa muda de assunto, educadamente.',
    'E você muda junto.'
  ],
  ef:{flag:'nao_foi_a_ilha', instabilidade:1, moral:-15,
      npc:{nome:'Sr. Tanner', opiniao:-1, memoria:'Você acreditou nele e não foi, o que é pior do que não ter acreditado.'},
      registrar:'Não foi à ilha sem nome.'},
  escolhas:[
    {texto:'Mudar de ideia e ir.', vai:'c16_travessia'},
    {texto:'Voltar à mesa de dominó.', vai:'c16_velho'},
    {texto:'Levar a caixa dele a quem publique.', vai:'c16_levou_a_caixa', cond:d=>!!d.flags.viu_a_caixa_de_charuto},
    {texto:'Seguir.', vai:'c16_fim'}
  ]
},

/* ─────────────── A TRAVESSIA E A ILHA ─────────────── */

c16_travessia:{
  texto:[
    d=>{
      if (!d.flags.c16_tanner_novo) return '';
      return Historia.jaAconteceu('c16_ab_quem_nao_fala')
        ? 'O Orso diz que não sem levantar a cabeça da rede, e aponta com o queixo a mesa de dominó no fim do cais.'
        : 'No cais, quem você pergunta diz que não. Pra sudoeste ninguém vai. Até que um pescador aponta com o queixo a mesa de dominó no fim do cais.';
    },
    d=>{
      if (!d.flags.c16_tanner_novo) return '';
      Nomes.apresentar('o velho pescador');
      return 'O velho da mesa de dominó tem oitenta e um anos e um barco de sete metros com TANNER pintado na popa. Ele ouve o seu pedido inteiro sem interromper e não pergunta pra quê.';
    },
    fala('Sr. Tanner', 'Sete da noite. A gente sai com o escuro e chega com o dia, porque ilha sem cais não se encosta no escuro. E traz água, que lá não tem.'),
    'Vocês saem às sete.',
    'A travessia leva onze horas num barco de pesca de sete metros, com motor forte e um toldo de lona.',
    'Onze horas é muito tempo.',
    'Nas três primeiras vocês conversam. Nas três seguintes o Sr. Tanner dorme sentado com a mão no leme e acorda a cada vinte minutos pra corrigir o rumo, e depois dorme de novo, e isso é a coisa mais tranquilizadora que já te aconteceu num barco.',
    'Nas cinco últimas ninguém fala nada, e no fim delas o céu clareia atrás de vocês.',
    'A ilha aparece com o dia nascendo: pedra e mato. Sem praia, sem cais, sem enseada.',
    'Um bloco de rocha de uns oitocentos metros de comprimento e uns sessenta de altura, com a face oeste cortada a pique e a leste em rampa de pedregulho.',
    'E no topo, no ponto mais alto, uma coisa que não é pedra natural:',
    'uma base de alvenaria antiga, de uns doze metros de um lado a outro, com as linhas retas demais pra ser geologia.',
    'Alicerce de torre. Só o alicerce.',
    'O resto não existe há séculos.'
  ],
  ef:{flag:['chegou_na_ilha','sabe_da_ilha'], limpaFlag:'nao_foi_a_ilha',
      npc:c16_npc('Sr. Tanner', 1, 'Te levou à ilha sem nome no barco dele, saindo às sete da noite.'),
      executar:d=>{
        d.flags.c16_tanner_novo = !d.flags.conheceu_tanner;
        Estado.marcar('conheceu_tanner');
        c16_ate(C16_SAIDA, true);
        Relogio.avancar(C16_TRAVESSIA);
        Mundo.descobrir('local_ilha_sem_nome');
        return [];
      },
      registrar:'Chegou à ilha sem nome com o dia nascendo. No topo há o alicerce de uma torre, de uns doze metros.',
      presagio:'Doze metros de alvenaria. Alguém carregou essa pedra até aqui num barco.'},
  escolhas:[
    {texto:'Subir até o alicerce agora.', vai:'c16_alicerce'},
    {texto:'Dar a volta na ilha de barco antes.', vai:'c16_volta_de_barco'},
    {texto:'Procurar água doce.', vai:'c16_procurou_agua'},
    C16_NOITE('Acampar embaixo e esperar a noite.')
  ]
},

c16_volta_de_barco:{
  texto:[
    'Vocês dão a volta na ilha antes de desembarcar, o que leva quarenta minutos e é ideia do Sr. Tanner, porque pescador nunca desembarca sem dar a volta.',
    'E a volta rende três coisas.',
    'Primeira: na face norte, a uns dez metros acima da linha d’água, tem um degrau.',
    'Um degrau cortado na rocha, de uns oitenta centímetros, com o corte reto e muito gasto — e acima dele mais um, e mais um, subindo a face norte em zigue-zague até sumir na vegetação.',
    'Uma escada de rocha cortada à mão, na única face que não dá pra ver da costa.',
    'Segunda: no pé da escada, no nível da água, tem argolas.',
    'Quatro argolas de ferro forjado chumbadas na rocha, enferrujadas até a metade da espessura, na altura certa pra amarrar barco.',
    'Terceira: numa das argolas tem corda.',
    'Corda de náilon azul. Náilon.',
    'Náilon não existia quando forjaram essas argolas, e essa corda não tem um ano de sol.',
    'Alguém amarrou um barco aqui há pouco tempo.'
  ],
  ef:{flag:['achou_a_escada','outros_estiveram_la'],
      rep:{eixo:'bom',delta:4,motivo:'Deu a volta na ilha antes de desembarcar'},
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'Há uma escada cortada na rocha na face norte, com quatro argolas de amarração antigas — e corda de náilon numa delas.',
      presagio:'Corda de náilon numa argola forjada à mão. Séculos de diferença na mesma argola.'},
  escolhas:[
    {texto:'Desembarcar pela escada.', vai:'c16_subiu_a_escada'},
    {texto:'Desembarcar pela rampa leste, longe da corda.', vai:'c16_alicerce'},
    {texto:'Procurar o barco da corda.', vai:'c16_procurou_o_barco'},
    C16_NOITE('Esperar a noite antes de subir.')
  ]
},

c16_procurou_o_barco:{
  texto:[
    'Vocês procuram o barco da corda por mais quarenta minutos e não acham, porque não tem barco.',
    'A corda está amarrada na argola com nó de pescador, cortada na ponta, com uns quatro metros de sobra na água.',
    'O Sr. Tanner puxa a corda com o gancho e olha a ponta cortada.',
    fala('Sr. Tanner', 'Cortaram do lado de lá.'),
    c16_eu('Como o senhor sabe?'),
    fala('Sr. Tanner', 'Porque o corte é limpo e a ponta tá desfiando pra fora. Corda cortada com faca desfia pro lado de quem cortou.'),
    'Ele solta a corda na água.',
    fala('Sr. Tanner', 'Quem tava amarrado aqui saiu com pressa e cortou, em vez de desamarrar.'),
    'Ele olha a escada na rocha.',
    fala('Sr. Tanner', 'E quem corta corda em vez de desamarrar, ou tá com muita pressa, ou deixou alguém em cima.')
  ],
  ef:{flag:['sabe_da_corda_cortada','outros_estiveram_la'],
      npc:c16_npc('Sr. Tanner', 7, 'Leu o desfiado da corda e concluiu que quem estava amarrado ali saiu com pressa.'),
      rep:{eixo:'bom',delta:3,motivo:'Puxou a corda e olhou a ponta'},
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'A corda de náilon foi cortada com faca, do lado de fora. Alguém saiu com pressa.',
      presagio:'Ou muita pressa, ou alguém que ficou em cima.'},
  escolhas:[
    {texto:'Subir pela escada.', vai:'c16_subiu_a_escada'},
    {texto:'Desembarcar pela rampa leste.', vai:'c16_alicerce'},
    C16_NOITE('Esperar a noite.')
  ]
},

c16_subiu_a_escada:{
  texto:[
    'A escada tem cento e quatro degraus.',
    'Você conta porque contar é o que você aprendeu a fazer quando não dá pra fazer mais nada.',
    'Cento e quatro degraus cortados à mão na rocha viva de uma ilha a onze horas da costa, e gastos no meio.',
    'Gasto no meio quer dizer uso. Muito uso, por muito tempo, por muita gente — porque um pé só não gasta pedra; uma geração gasta.',
    'Na poeira de alguns degraus tem marca de bota, recente, subindo.',
    'Na metade da subida você para pra respirar e repara numa coisa.',
    'Alguns degraus têm um risco na lateral: uma linha vertical de uns três centímetros.',
    'Você começa a contar os riscos.',
    'Vinte e três.',
    d=>d.flags.viu_a_caixa_de_charuto ? 'Vinte e três: o mesmo número de noites da caixa de charuto do Sr. Tanner.' : '',
    'E os riscos estão limpos demais pra uma pedra que gastou no meio. Alguém riscou isso neste século, numa escada que já era velha.'
  ],
  ef:{flag:['contou_os_degraus','viu_os_entalhes','achou_a_escada'],
      rep:{eixo:'bom',delta:5,motivo:'Contou os degraus e reparou nos riscos'},
      instabilidade:1,
      registrar:'A escada da face norte tem 104 degraus gastos no meio e 23 riscos recentes na lateral.',
      presagio:d=>d.flags.viu_a_caixa_de_charuto ? 'Vinte e três riscos, vinte e três noites.' : 'Vinte e três riscos numa escada sem dono.'},
  escolhas:[
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    {texto:'Procurar mais riscos nos degraus de baixo.', vai:'c16_mais_entalhes'},
    {texto:'Chamar o Sr. Tanner pra ver.', vai:'c16_ze_viu_os_entalhes'},
    {texto:'Seguir as marcas de bota.', vai:'c16_botas'},
    C16_NOITE('Esperar a noite antes de subir.')
  ]
},

c16_mais_entalhes:{
  texto:[
    d=>`Você desce de novo e procura direito, degrau por degrau, ${c16_luzDeLado(d)}.`,
    'Leva uma hora, e você acha o que não queria achar.',
    'Não são vinte e três. São vinte e três **novos**.',
    'Embaixo deles, na mesma lateral, tem mais riscos — mais rasos, quase apagados pela erosão, mas em grupos de cinco, riscados juntos, do jeito que se conta de cinco em cinco.',
    'Você conta os grupos. Conta duas vezes, porque na primeira errou.',
    'Sessenta e um grupos de cinco. Trezentos e cinco.',
    'Trezentas e cinco noites riscadas na lateral de uma escada de pedra, por gente que morreu antes de Kanto ter esse nome.',
    d=>d.flags.viu_a_caixa_de_charuto
      ? 'E os vinte e três de cima, se a conta fecha, são as noites da caixa de charuto.'
      : 'E os vinte e três de cima continuam a mesma conta, com outra ferramenta.',
    'Alguém continuou a contagem de alguém.'
  ],
  ef:{flag:['contou_os_riscos','sabe_dos_trezentos_e_cinco'],
      rep:{eixo:'bom',delta:6,motivo:'Desceu e contou de novo'},
      instabilidade:2, moral:-8,
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'Há 305 riscos antigos na escada, em grupos de cinco, embaixo dos 23 recentes.',
      presagio:'Alguém continuou a contagem de alguém, sem saber que estava continuando.'},
  escolhas:[
    {texto:'Chamar o Sr. Tanner pra ver.', vai:'c16_ze_viu_os_entalhes'},
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    {texto:'Riscar o trezentos e vinte e nove.', vai:'c16_riscou'},
    C16_NOITE('Esperar a noite.')
  ]
},

c16_ze_viu_os_entalhes:{
  texto:[
    'Ele sobe. Leva quarenta minutos pra subir cinquenta degraus e não aceita ajuda em nenhum.',
    'Você mostra os vinte e três riscos, e ele passa o dedo em cada um, em ordem, subindo.',
    'No décimo nono ele para.',
    'O décimo nono é diferente dos outros: mais fundo, feito com mais força, e tem uma coisa do lado.',
    'Uma letra.',
    '**O**',
    fala('Sr. Tanner', 'Setenta e nove.'),
    'Ele não tira o dedo da pedra.',
    c16_eu('O quê?'),
    fala('Sr. Tanner', 'O décimo nono é setenta e nove. Treze de outubro.'),
    'Ele senta no degrau.',
    fala('Sr. Tanner', 'Meu pai riscou esse aí e pôs a inicial do meu nome.'),
    'Ele passa o dedo na letra.',
    fala('Sr. Tanner', 'E não voltou.'),
    'Ele olha os quatro riscos de cima, mais rasos, de outra mão.',
    fala('Sr. Tanner', 'Esses não são dele. Alguém continuou depois.', 'baixo'),
    'Ele fica um tempo sentado no degrau cinquenta, a onze horas da costa, aos oitenta e um anos.',
    fala('Sr. Tanner', 'Ele riscou o meu nome antes.')
  ],
  ef:{flag:['achou_a_marca_do_pai','ze_vai_junto'],
      npc:c16_npc('Sr. Tanner', 10, 'Achou na escada o risco que o pai fez em 1979, com a inicial dele ao lado, antes de não voltar.'),
      rep:{eixo:'bom',delta:7,motivo:'Levou um velho até o risco que o pai dele deixou'},
      moral:25, instabilidade:1,
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'Na escada, o risco de 13/10/1979 tem um O riscado ao lado.',
      presagio:'A inicial do filho, riscada antes de subir.'},
  escolhas:[
    {texto:'Riscar o próximo junto com ele.', vai:'c16_riscou'},
    {texto:'Deixar ele sozinho um tempo e subir até o alicerce.', vai:'c16_alicerce'},
    C16_NOITE('Esperar a noite ali, na escada.')
  ]
},

c16_riscou:{
  texto:[
    'Você tira a faca e começa um traço na lateral do próximo degrau.',
    d=>d.flags.achou_a_marca_do_pai ? 'O Sr. Tanner segura a sua mão antes de você terminar.'
      : 'Fica torto e raso e leva uns quatro minutos, porque riscar rocha com faca é muito mais difícil do que parece — e é exatamente por isso que os riscos que já estão ali importam.',
    d=>d.flags.achou_a_marca_do_pai ? fala('Sr. Tanner', 'Deixa eu.') : '',
    d=>d.flags.achou_a_marca_do_pai ? 'E ele risca. Devagar, com a mão ruim, levando uns quatro minutos pra fazer três centímetros. Do lado, ele risca uma letra. Não é O. É H.' : '',
    d=>d.flags.achou_a_marca_do_pai ? fala('Sr. Tanner', 'Hollis.') : '',
    d=>d.flags.achou_a_marca_do_pai ? 'Ele sopra o pó da pedra.' : '',
    d=>d.flags.achou_a_marca_do_pai ? fala('Sr. Tanner', 'Agora ele também tá escrito.') : '',
    'Você senta no degrau depois.',
    'Se alguém subir essa escada daqui a cem anos e contar os riscos, esse está lá, no meio, e entra na conta.'
  ],
  ef:{flag:'riscou_o_degrau',
      rep:{eixo:'bom',delta:4,motivo:'Entrou numa contagem de séculos'},
      moral:20,
      registrar:d=>d.flags.achou_a_marca_do_pai ? 'O Sr. Tanner riscou o próximo degrau da escada da ilha, com um H do lado.' : 'Riscou o próximo degrau da escada da ilha.'},
  escolhas:[
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    {texto:'Seguir as marcas de bota.', vai:'c16_botas'},
    C16_NOITE('Esperar a noite na escada.')
  ]
},

c16_procurou_agua:{
  texto:[
    'Você procura água doce por três horas, porque o Sr. Tanner diz que não tem e você quer conferir. Conferir o que os velhos dizem é uma coisa que você aprendeu a fazer, e que dá certo metade das vezes.',
    'Não tem.',
    'Não tem nascente, não tem poça, não tem depressão úmida, e o mato da ilha é todo de espécie que vive de neblina.',
    'Mas você acha outra coisa.',
    'Na face leste, na rampa de pedregulho, encaixada entre duas pedras e invisível de qualquer ângulo que não seja de cima: uma cisterna.',
    'Uma cisterna de alvenaria, redonda, de uns dois metros de diâmetro e de fundo que não dá pra saber, com a boca coberta por uma laje de pedra rachada ao meio.',
    'Cisterna de captação de chuva.',
    'Quem morava aqui — e alguém morou aqui, porque ninguém constrói cisterna pra visita — bebia chuva.'
  ],
  ef:{flag:['achou_a_cisterna','alguem_morou_aqui'],
      rep:{eixo:'bom',delta:4,motivo:'Conferiu o que o velho disse e achou outra coisa'},
      executar:()=>{ Relogio.avancar(3); return []; },
      registrar:'Há uma cisterna de captação de chuva na face leste da ilha. Alguém morou aqui.',
      presagio:'Ninguém constrói cisterna pra visita.'},
  escolhas:[
    {texto:'Olhar dentro da cisterna.', vai:'c16_dentro_da_cisterna'},
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    C16_NOITE('Esperar a noite.')
  ]
},

c16_dentro_da_cisterna:{
  texto:[
    'Você empurra a metade rachada da laje, o que leva vinte minutos e toda a sua força, e olha pra dentro.',
    'A cisterna tem uns quatro metros de fundo e está seca há muito tempo.',
    'No fundo tem folha, terra, e coisa.',
    'Você desce com a corda do barco.',
    'No fundo de uma cisterna seca, numa ilha a onze horas da costa, tem: cacos de cerâmica vidrada, dois cabos de ferramenta de madeira apodrecida, uma placa de metal do tamanho de uma mão, e espinha de Magikarp.',
    'Muita espinha de Magikarp.',
    'A placa é de bronze, oxidada de verde, e tem coisa gravada de um lado.',
    'Você limpa com a manga.',
    'Não é escrita que você conheça. São sete linhas de traços verticais de alturas diferentes, agrupados, com espaço regular entre os grupos.',
    'Sete linhas.',
    'E embaixo delas, gravado depois — com ferramenta diferente, mais tosca, em letra de alfabeto —, quatro palavras:',
    '**"eles voltaram. nós ficamos."**'
  ],
  ef:{flag:['achou_a_placa','provas_da_ilha'],
      itens:{'Placa de bronze':1},
      rep:{eixo:'bom',delta:7,motivo:'Desceu quatro metros numa cisterna seca'},
      instabilidade:2, moral:-10,
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'No fundo da cisterna havia uma placa de bronze com sete linhas de traços e a frase "eles voltaram. nós ficamos."',
      presagio:'"Eles voltaram. Nós ficamos." Duas frases e um ponto entre elas.'},
  escolhas:[
    {texto:'Levar a placa até o Sr. Tanner, no barco.', vai:'c16_mostrou_a_placa'},
    {texto:'Subir até o alicerce com a placa.', vai:'c16_alicerce'},
    {texto:'Procurar mais coisa no fundo.', vai:'c16_mais_no_fundo'}
  ]
},

c16_mais_no_fundo:{
  texto:[
    'Você cava o fundo da cisterna com as mãos por mais uma hora, num espaço de dois metros de diâmetro a quatro de fundo, com a luz da boca chegando cinzenta lá embaixo.',
    'Debaixo de trinta centímetros de folha e terra, encostado na parede, tem uma coisa que você demora a reconhecer, porque ela não devia estar ali.',
    'Um degrau.',
    'Um degrau de pedra, do mesmo corte dos cento e quatro da face norte, embutido na parede da cisterna e indo pra baixo.',
    'A cisterna não é uma cisterna.',
    'A cisterna é a boca de uma escada, e alguém encheu ela de folha e terra em algum século, ou o tempo encheu.',
    'Você cava mais três degraus e para, porque cavar quatro metros de terra com as mãos é impossível e porque o ar lá embaixo já está ficando ruim.',
    'Você sobe.',
    'E lá em cima, na luz, você fica sentad{o|a} na borda da cisterna por um tempo bem longo, pensando na diferença entre "não tem água doce nessa ilha" e "não tem mais".'
  ],
  ef:{flag:['achou_a_escada_de_baixo','alguem_morou_aqui'],
      rep:{eixo:'bom',delta:6,motivo:'Cavou uma hora no fundo de uma cisterna'},
      instabilidade:1, hp:-4, causa:'Uma hora cavando num poço de quatro metros',
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'A cisterna é a boca de uma escada que desce, soterrada.'},
  escolhas:[
    {texto:'Levar a placa até o Sr. Tanner, no barco.', vai:'c16_mostrou_a_placa'},
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    C16_NOITE('Esperar a noite.')
  ]
},

c16_mostrou_a_placa:{
  texto:[
    'Você leva a placa até o barco.',
    'O Sr. Tanner segura a placa de bronze com as duas mãos e olha as sete linhas de traços por muito tempo.',
    fala('Sr. Tanner', 'Isso é escrita?'),
    c16_eu('Acho que é.'),
    fala('Sr. Tanner', 'De quem?'),
    c16_eu('De quem morava aqui.'),
    'Ele vira a placa e lê as quatro palavras em letra de alfabeto.',
    fala('Sr. Tanner', 'Eles voltaram. Nós ficamos.', 'baixo'),
    'Ele lê em voz alta três vezes.',
    fala('Sr. Tanner', 'Eles quem?'),
    d=>d.flags.sabe_dos_tres_nadando
      ? 'E você não responde, porque você acha que sabe, e falar em voz alta ia ser pior. Mas ele chega sozinho: olha o mar na direção de Kanto, depois a placa, depois o mar.'
      : fala(d.jogador.nome, 'Eu não sei.'),
    d=>d.flags.sabe_dos_tres_nadando ? fala('Sr. Tanner', 'Ah.', 'baixo') : '',
    'Ele devolve a placa.',
    d=>fala('Sr. Tanner', !d.flags.viu_a_caixa_de_charuto ? 'Guarda você.'
      : c16_comACaixa(d) ? 'Guarda você. A caixa já tá com você, fica com as duas coisas.' : 'Guarda você. Eu já tenho a caixa.')
  ],
  ef:{flag:'ze_viu_a_placa',
      npc:c16_npc('Sr. Tanner', 9, 'Leu a placa de bronze três vezes em voz alta.'),
      rep:{eixo:'bom',delta:3,motivo:'Mostrou a placa a quem tinha direito de ver primeiro'},
      moral:10,
      presagio:'"Eles voltaram. Nós ficamos." Isso não sai da cabeça tão cedo.'},
  escolhas:[
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    {texto:'Voltar à cisterna e cavar mais.', vai:'c16_mais_no_fundo'},
    C16_NOITE('Esperar a noite.')
  ]
},

c16_esperou_noite:{
  texto:[
    'Você acampa embaixo, no pé da subida, e espera.',
    'O Sr. Tanner volta pro barco antes de escurecer e fica fundeado a duzentos metros, com a luz de posição acesa, porque ele não dorme em terra desde mil novecentos e sessenta e oito e não vai começar hoje.',
    'Às onze e dez da noite, começa.',
    'Não é arco-íris. Arco-íris precisa de sol e de chuva, e não tem nem um nem outro, e arco-íris é um arco, e isso não é.',
    'É uma faixa de luz colorida no céu, imóvel, ancorada exatamente sobre o alicerce, subindo reta uns duzentos metros e abrindo em leque no alto.',
    'Ela não pisca, não oscila e não faz barulho nenhum.',
    'Fica quarenta minutos. E some de uma vez, sem esmaecer.',
    'Daqui de baixo não dá pra ver o que tem lá em cima.',
    'No barco, a duzentos metros, um homem de oitenta e um anos está de pé olhando pra cima.',
    'Quarenta anos contando essa história, e é a primeira vez que ele vê com alguém junto.'
  ],
  ef:{flag:'viu_o_arco_iris',
      npc:c16_npc('Sr. Tanner', 9, 'Viu a luz sobre a ilha junto com você, depois de quarenta anos vendo sozinho.'),
      rep:{eixo:'bom',delta:3,motivo:'Deu razão a um velho em quem ninguém acreditava'},
      moral:15,
      executar:()=>{ c16_ate(C16_LUZ); Relogio.avancar(1); return []; },
      registrar:'Viu a luz sobre o alicerce, de baixo, das 23h10 às 23h50.',
      presagio:'Não pisca, não oscila, não faz barulho. Não parece coisa do tempo.'},
  escolhas:[
    {texto:'Subir agora, no escuro.', vai:'c16_alicerce'},
    {texto:'Dormir e subir de manhã.', vai:'c16_alicerce', ef:{executar:()=>{ c16_ate(6); return []; }}},
    {texto:'Ir pro barco e ficar com ele.', vai:'c16_ficou_com_o_ze'},
    {texto:'Riscar um traço no degrau antes de subir.', vai:'c16_riscou', cond:d=>!!d.flags.achou_a_escada}
  ]
},

c16_ficou_com_o_ze:{
  texto:[
    'Você rema até o barco e fica.',
    'Ele não fala nada por uns dez minutos, e depois fala sem parar por uma hora, que é a coisa mais normal do mundo com alguém que passou quarenta anos sem que acreditassem nele.',
    'Ele conta do pai. Da mãe, que não deixava ele sair de noite. Do irmão que foi pra Vermilion em cinquenta e nove e nunca mais voltou. De um Growlithe chamado Tampa.',
    'Às duas da manhã ele para de falar no meio de uma frase e olha a ilha.',
    fala('Sr. Tanner', 'Eu vou morrer em uns três anos.'),
    c16_eu('O senhor não sabe disso.'),
    fala('Sr. Tanner', 'Eu sei. E tá tudo bem, {meu filho|minha filha}, porque eu vi.'),
    'Ele ajeita o boné e bate na borda do barco.',
    fala('Sr. Tanner', 'Eu vi, e teve testemunha.'),
    'E é essa a coisa que ele precisou a vida inteira: não ver. Ter testemunha.'
  ],
  ef:{flag:'noite_com_o_ze',
      npc:c16_npc('Sr. Tanner', 10, 'Falou uma hora sem parar e disse que está tudo bem, porque agora teve testemunha.'),
      rep:{eixo:'bom',delta:4,motivo:'Ficou no barco e ouviu uma hora'},
      moral:20, hp:2,
      executar:()=>{ c16_ate(2); return []; },
      registrar:'"Eu vi, e teve testemunha."',
      presagio:'Ele não precisava ver. Precisava de testemunha.'},
  escolhas:[
    {texto:'Dormir no barco e subir de manhã.', vai:'c16_alicerce', ef:{executar:()=>{ c16_ate(6); return []; }}},
    {texto:'Subir agora, no escuro.', vai:'c16_alicerce'},
    {texto:'Riscar um traço no degrau.', vai:'c16_riscou', cond:d=>!!d.flags.achou_a_escada}
  ]
},

c16_alicerce:{
  texto:[
    d=>d.flags.c16_pousou_no_desenho ? 'Você pousa em cima do desenho, e de perto o alicerce é mais impressionante.' : 'O alicerce está no topo, e de perto é mais impressionante.',
    d=>{ if (c16_deDia(d)) return ''; const l = c16_luz(); return l ? `No escuro, ${l}, ele aparece aos pedaços.` : 'No escuro, sem luz nenhuma, ele aparece aos pedaços, recortado contra as estrelas.'; },
    'Blocos de pedra encaixados sem argamassa, cada um do tamanho de uma geladeira, com o encaixe tão justo que a lâmina da sua faca não entra em junta nenhuma.',
    'Isso não é técnica de Kanto. Nenhuma construção de Kanto faz isso.',
    d=>c16_voou(d) ? '' : 'A base tem oito faces iguais. Do mar, parecia um bloco só.',
    'No centro, o chão é de pedra lisa — uma laje só, de doze metros, que alguém trouxe inteira de algum lugar —, com um desgaste circular no meio, de uns três metros de diâmetro.',
    'Desgaste. Como se alguma coisa grande pousasse ali repetidamente, por muito tempo.',
    'Não tem nada escrito. Nenhum símbolo, nenhum entalhe. Quem construiu isso não achava que precisava explicar.',
    'E em volta do desgaste, a uns quatro metros dele, tem três depressões rasas na laje.',
    'Três. Do tamanho de um corpo grande deitado, lado a lado, com uns quatro metros entre elas.',
    'Na poeira do canto sul da laje tem marca de bota. Recente: a borda ainda não esfarelou.'
  ],
  ef:{flag:['viu_o_alicerce','viu_as_tres_depressoes'],
      instabilidade:1,
      registrar:'O alicerce tem oito faces e uma laje de doze metros, com um desgaste circular no centro e três depressões rasas em volta, a quatro metros uma da outra.',
      presagio:d=>d.flags.viu_os_tres || d.flags.achou_a_praia ? 'Quatro metros entre elas. Você já viu essa distância numa ciclovia.' : 'Quatro metros entre elas.'},
  escolhas:[
    {texto:'Esperar no centro do círculo.', vai:'c16_esperou_no_circulo'},
    {texto:'Deitar numa das três depressões.', vai:'c16_deitou_na_depressao'},
    {texto:d=>d.flags.achou_equipe_na_ilha ? 'Ir até o acampamento da expedição.' : 'Seguir as marcas de bota.', vai:'c16_botas'},
    {texto:'Descer. Isso é um lugar de pousar, não de estar.', vai:'c16_desceu_ilha'}
  ]
},

c16_alicerce_de_novo:{
  texto:[
    'Você volta ao alicerce: a laje de doze metros, o desgaste redondo no meio, as três depressões em volta.',
    d=>c16_deDia(d) ? '' : 'No escuro, a pedra está fria e não devolve nada.',
    d=>d.flags.viu_hooh ? 'Sem a luz, é só pedra.' : ''
  ],
  escolhas:[
    {texto:'Esperar no centro do círculo.', vai:'c16_esperou_no_circulo'},
    {texto:'Deitar numa das três depressões.', vai:'c16_deitou_na_depressao'},
    {texto:d=>d.flags.achou_equipe_na_ilha ? 'Ir até o acampamento da expedição.' : 'Seguir as marcas de bota.', vai:'c16_botas'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'}
  ]
},

c16_deitou_na_depressao:{
  texto:[
    'Você deita numa das três depressões da laje.',
    'É rasa — uns seis centímetros —, é maior que você em todas as direções, e a pedra está fria.',
    'E dali, deitad{o|a}, você vê o que quem deitava ali via:',
    'o céu, e mais nada. A parede do alicerce corta o horizonte inteiro.',
    'Deitad{o|a} numa dessas, você não vê o mar, não vê Kanto, não vê o alicerce.',
    'Vê o céu.',
    'Três coisas grandes deitavam aqui, lado a lado, olhando o céu, esperando uma coisa que vem do céu.',
    d=>d.flags.achou_a_praia
      ? 'E numa praia de pedra no fim de uma ciclovia, em Kanto, tem três lugares gastos, lado a lado, com quatro metros entre eles, virados pro mar. Você fica deitad{o|a} ali um tempo e pensa: elas mudaram o que estavam olhando.'
      : (d.flags.viu_os_tres || d.flags.sabe_dos_tres)
        ? 'E numa ciclovia de Kanto, de madrugada, três Pokémon grandes correm em fila, com quatro metros entre eles. Você fica deitad{o|a} ali um tempo, olhando o que elas olhavam.'
        : 'Você fica deitad{o|a} ali um tempo, olhando o que elas olhavam, e pensa em onde elas estão agora.'
  ],
  ef:{flag:['deitou_na_depressao','entendeu_as_depressoes'],
      rep:{eixo:'bom',delta:5,motivo:'Deitou na depressão pra ver o que dava pra ver'},
      moral:10, instabilidade:1,
      registrar:'Das depressões do alicerce só se vê o céu.',
      presagio:d=>d.flags.achou_a_praia ? 'Elas mudaram o que estavam olhando.' : 'Três coisas grandes esperavam aqui.'},
  escolhas:[
    {texto:'Esperar no centro do círculo.', vai:'c16_esperou_no_circulo'},
    {texto:'Ficar deitad{o|a} até acontecer alguma coisa.', vai:'c16_esperou_no_circulo'},
    {texto:d=>d.flags.achou_equipe_na_ilha ? 'Ir até o acampamento da expedição.' : 'Seguir as marcas de bota.', vai:'c16_botas'},
    {texto:'Descer.', vai:'c16_desceu_ilha'}
  ]
},

/* ─────────────── A EXPEDIÇÃO ─────────────── */

c16_botas:{
  texto:[
    'As marcas de bota levam pro outro lado do topo e descem uns trinta metros pela face sul, até um platô que não dá pra ver do alicerce.',
    'E no platô tem um acampamento.',
    'Três barracas técnicas de lona branca, um gerador silencioso de bancada, quatro caixas plásticas empilhadas, uma antena de uns dois metros e uma lona esticada por cima de tudo, na cor da rocha.',
    'Nas caixas, alguém raspou o logotipo da Silph com estilete, e dá pra ler do mesmo jeito.',
    'Quatro pessoas.',
    'Uma delas é uma mulher de uns sessenta anos, sentada numa caixa com um caderno e uma câmera térmica apoiada no joelho, apontada pro alicerce, falando com quem está do lado:',
    d=>fala('Chefe da expedição', d.flags.viu_hooh
      ? '…quarenta minutos saindo da laje, e a câmera não marcou um grau de diferença. Nem um grau…'
      : '…o intervalo é de seis a sete anos, a gente perdeu duas janelas esperando o conselho aprovar a verba, e se perder essa a próxima é em dois mil e seis, sete…'),
    'Ela para de falar quando te vê.',
    'Um silêncio muito longo, em que ninguém corre, ninguém grita e ninguém pega nada.',
    d=>fala('o mais velho da equipe', c16_conhecidoNaSilph(d) ? 'Você é {o|a} de Saffron.' : 'Treinador. Numa ilha sem cais.'),
    d=>c16_conhecidoNaSilph(d)
      ? 'Quem diz é o mais velho, um homem de barba que não levantou da caixa. E não é pergunta.'
      : 'Quem diz é o mais velho, um homem de barba que não levantou da caixa.'
  ],
  ef:{flag:'achou_equipe_na_ilha',
      registrar:'Uma expedição com equipamento da Silph está acampada na face sul da ilha, esperando a luz.',
      presagio:d=>c16_conhecidoNaSilph(d) ? 'Eles sabem quem você é antes de você falar. Isso vem de algum relatório.' : 'Quatro pessoas e uma câmera térmica apontada pro alicerce.'},
  escolhas:[
    {texto:'"O que vocês vieram buscar aqui?"', vai:'c16_pergunta_equipe'},
    {texto:'"Quantas janelas vocês já perderam?"', vai:'c16_quantas_janelas', cond:d=>!!d.flags.achou_o_padrao},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'},
    {texto:'Atacar o acampamento.', vai:'c16_ataque_equipe'}
  ]
},

c16_acampamento:{
  texto:[
    d=>{
      const f = d.flags;
      if (f.expulsou_a_equipe) return 'O platô sul está vazio. Ficou a marca das três barracas no capim amassado e um parafuso de antena esquecido entre duas pedras.';
      if (f.destruiu_a_expedicao) return 'O acampamento é um monte de caixas fechadas e caco varrido pra um canto. A chefe da expedição escreve no caderno e não levanta a cabeça.';
      return 'No platô sul, a chefe da expedição levanta a cabeça do caderno quando você aparece, e espera.';
    },
    d=>!c16_equipeNaIlha(d) || d.flags.destruiu_a_expedicao || !d.flags.equipe_aliada ? '' : fala('Chefe da expedição', 'Senta, se quiser. Aqui venta menos.')
  ],
  escolhas:[
    {texto:'"O que vocês vieram buscar aqui?"', vai:'c16_pergunta_equipe', cond:d=>c16_equipeNaIlha(d)},
    {texto:'"Quantas janelas vocês já perderam?"', vai:'c16_quantas_janelas', cond:d=>c16_equipeNaIlha(d) && !!d.flags.achou_o_padrao},
    {texto:'"Então vocês não levam pena nenhuma."', vai:'c16_sem_pena', cond:d=>c16_equipeNaIlha(d) && !!d.flags.entendeu_o_proximo_projeto},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe', cond:d=>c16_equipeNaIlha(d)},
    {texto:'Atacar o acampamento.', vai:'c16_ataque_equipe', cond:d=>c16_equipeNaIlha(d) && !d.flags.destruiu_a_expedicao},
    {texto:'Voltar pro alicerce.', vai:'c16_alicerce'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'}
  ]
},

c16_quantas_janelas:{
  texto:[
    c16_eu('Quantas janelas vocês já perderam?'),
    'A mulher do caderno pisca duas vezes, porque não era a pergunta que ela esperava.',
    fala('Chefe da expedição', 'Duas.'),
    c16_eu('Noventa e três e noventa e seis.'),
    'Ela abre o caderno.',
    fala('Chefe da expedição', 'Como você sabe as datas?'),
    d=>fala(d.jogador.nome, `${c16_comACaixa(d) ? 'Eu tenho' : c16_voou(d) ? 'Um pescador de Fuchsia tem' : 'O pescador que me trouxe tem'} ${c16_papeis(d)} bilhetes em papel de pão, numa caixa de charuto.`),
    'Ela olha pra você por um tempo comprido.',
    'E aí faz uma coisa que muda a conversa inteira: levanta da caixa, chega perto e te olha com interesse profissional de verdade.',
    fala('Chefe da expedição', 'Anotados na hora?'),
    c16_eu('Na hora. Vinte e três noites. Tem mais papel que noite porque pai e filho anotavam a mesma.'),
    fala('Chefe da expedição', 'De que ano a que ano?'),
    c16_eu('De trinta e nove a noventa e seis.'),
    'Ela fecha os olhos por um segundo.',
    fala('Chefe da expedição', 'Cinquenta e sete anos de série temporal.'),
    'E aí ela diz a coisa mais honesta e mais assustadora da conversa:',
    fala('Chefe da expedição', 'Eu daria o meu salário de um ano por essa caixa, e eu ganho muito bem. E eu não vou te oferecer dinheiro, porque já entendi que você não vende.')
  ],
  ef:{flag:['sabe_das_janelas_perdidas','equipe_te_respeita'],
      npc:c16_npc('Chefe da expedição', 2, 'Descobriu que você sabe de 57 anos de série temporal numa caixa de charuto, e não tentou comprar.'),
      rep:{eixo:'bom',delta:4,motivo:'Perguntou quantas janelas em vez de ameaçar'},
      registrar:'A expedição perdeu as janelas de 1993 e 1996 esperando verba.'},
  escolhas:[
    {texto:'"O que vocês vieram buscar aqui?"', vai:'c16_pergunta_equipe'},
    {texto:'"Vocês são do andar onze."', vai:'c16_pergunta_equipe', cond:d=>!!d.flags.sabe_do_andar_11 || !!d.flags.viu_os_doze,
     ef:{flag:'c16_disse_andar_onze'}},
    {texto:'"O que você me oferece, então?"', vai:'c16_o_que_oferece'},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'}
  ]
},

c16_o_que_oferece:{
  texto:[
    c16_eu('O que você me oferece, então?'),
    'Ela senta de novo na caixa.',
    fala('Chefe da expedição', 'Coautoria.'),
    c16_eu('O quê?'),
    fala('Chefe da expedição', 'Se a série for real e verificável, ela é o dado mais importante dessa linha de pesquisa inteira. E ela não é minha, e eu não publico dado dos outros com o meu nome sozinho.'),
    'Ela abre o caderno numa página em branco.',
    fala('Chefe da expedição', 'Eu preciso do nome de quem anotou.'),
    c16_eu('Tanner. H. Tanner e O. Tanner. Pai e filho, pescadores de Fuchsia.'),
    'Ela escreve devagar, conferindo a grafia com você duas vezes.',
    fala('Chefe da expedição', 'E o filho tá vivo?'),
    d=>fala(d.jogador.nome, c16_voou(d) ? 'Tá em Fuchsia, na mesa de dominó.' : 'Tá no barco, lá embaixo.'),
    'Ela fecha o caderno e olha o mar.',
    fala('Chefe da expedição', 'Quarenta e um anos de carreira, e eu nunca pus um pescador como coautor.'),
    'Pausa.',
    fala('Chefe da expedição', 'Isso diz mais sobre a minha carreira do que sobre pescador.')
  ],
  ef:{flag:['coautoria','equipe_aliada'],
      npc:c16_npc('Chefe da expedição', 6, 'Anotou H. Tanner e O. Tanner como coautores da série temporal.'),
      rep:{eixo:'bom',delta:6,motivo:'Transformou uma caixa de charuto em coautoria'},
      moral:20,
      registrar:'A chefe da expedição vai pôr os Tanner como coautores da série temporal.',
      presagio:'"Isso diz mais sobre a minha carreira do que sobre pescador." Ela sabe.'},
  escolhas:[
    {texto:'"E o que vocês vieram buscar aqui?"', vai:'c16_pergunta_equipe'},
    {texto:'"Então vocês não levam pena nenhuma."', vai:'c16_sem_pena', cond:d=>!!d.flags.entendeu_o_proximo_projeto},
    {texto:'Buscar o Sr. Tanner pra ele ouvir isso.', vai:'c16_buscou_o_ze', cond:d=>!c16_voou(d)},
    {texto:'Ir pro círculo esperar.', vai:'c16_esperou_no_circulo'}
  ]
},

c16_buscou_o_ze:{
  texto:[
    d=>`Você desce ${c16_descida(d)}, rema até o barco e traz o Sr. Tanner.`,
    'Ele leva uma hora e dez pra subir e xinga durante quarenta minutos dela.',
    'No platô, a chefe da expedição levanta da caixa e faz uma coisa que nenhum dos outros três faz: estende a mão.',
    fala('Chefe da expedição', 'Senhor Tanner?'),
    fala('Sr. Tanner', 'Otis.'),
    d=>{ Nomes.apresentar('Chefe da expedição'); return fala('Chefe da expedição', 'Agnes Sallow. Doutora, do Instituto de Biologia Comparada de Celadon.'); },
    'Ela pega o caderno.',
    fala('Chefe da expedição', 'O senhor tem uma série de observação de cinquenta e sete anos, e eu vou te fazer umas quarenta perguntas chatas sobre como ela foi feita. Algumas vão parecer que eu tô desconfiando do senhor, e eu não tô. É assim que se faz.'),
    'Ele olha pra você. Depois olha pra ela.',
    fala('Sr. Tanner', 'Pode perguntar.'),
    'Eles ficam três horas no platô, ela perguntando e ele respondendo, e no meio disso ela volta a chamar ele de senhor Tanner, e ele deixa.'
  ],
  ef:{flag:['ze_virou_coautor','equipe_aliada'],
      npc:c16_npc('Sr. Tanner', 10, 'Passou três horas respondendo perguntas para uma doutora que o chamou de senhor Tanner.'),
      rep:{eixo:'bom',delta:7,motivo:'Levou um pescador de oitenta e um anos até a mesa onde se decide o que é dado'},
      moral:30,
      executar:()=>{ Relogio.avancar(4); return []; },
      registrar:'O Sr. Tanner passou três horas sendo entrevistado como coautor da série temporal.'},
  escolhas:[
    {texto:'"E o que vocês vieram buscar aqui?"', vai:'c16_pergunta_equipe'},
    {texto:'"Então vocês não levam pena nenhuma."', vai:'c16_sem_pena', cond:d=>!!d.flags.entendeu_o_proximo_projeto},
    {texto:'Ir pro círculo esperar.', vai:'c16_esperou_no_circulo'}
  ]
},

c16_sem_pena:{
  texto:[
    c16_eu('Então vocês não levam pena nenhuma.'),
    'Ela para de escrever.',
    fala('Chefe da expedição', 'Isso é uma exigência ou uma proposta?'),
    c16_eu('É uma pergunta.'),
    'Ela pensa por um tempo honesto.',
    fala('Chefe da expedição', 'Eu vim buscar material genético porque foi assim que o projeto foi aprovado, e foi assim que a verba veio.'),
    d=>fala('Chefe da expedição', d.flags.sabe_das_janelas_perdidas
      ? 'Se eu voltar sem material, eu volto com uma série temporal de cinquenta e sete anos e com a observação direta de uma coisa que ninguém nunca registrou com instrumento.'
      : 'Se eu voltar sem material, eu volto com a observação direta de uma coisa que ninguém nunca registrou com instrumento.'),
    'Ela olha o caderno.',
    fala('Chefe da expedição', 'E isso, pra ciência, é melhor.'),
    c16_eu('E pra quem pagou?'),
    fala('Chefe da expedição', 'Pra quem pagou é pior.'),
    'Ela fecha o caderno.',
    fala('Chefe da expedição', 'E eu tenho quarenta e um anos de carreira, dois filhos na faculdade e um contrato de dois anos.'),
    'Ela olha pra você.',
    fala('Chefe da expedição', 'Me dá um motivo que eu possa escrever num relatório.')
  ],
  ef:{flag:'equipe_hesita',
      npc:c16_npc('Chefe da expedição', 5, 'Pediu um motivo que ela pudesse escrever num relatório.'),
      rep:{eixo:'bom',delta:3,motivo:'Perguntou em vez de exigir'},
      presagio:'"Me dá um motivo que eu possa escrever num relatório."'},
  escolhas:[
    {texto:'"Contaminação da amostra por evento não controlado."', vai:'c16_motivo_tecnico'},
    {texto:'"Porque ele vai ver vocês fazendo."', vai:'c16_motivo_moral'},
    {texto:'"Não tenho motivo nenhum. Só um pedido."', vai:'c16_so_um_pedido'},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'}
  ]
},

c16_motivo_tecnico:{
  texto:[
    c16_eu('Contaminação da amostra por evento não controlado.'),
    'Ela levanta a cabeça devagar.',
    fala('Chefe da expedição', 'Explica.'),
    c16_eu('Vocês vão pegar a pena depois da luz, certo?'),
    fala('Chefe da expedição', 'Certo.'),
    c16_eu('E a luz dura quarenta minutos, e vocês não sabem o que ela é, nem quanta energia tem nela, e não têm medida de antes.'),
    'Você aponta a câmera térmica.',
    c16_eu('Qualquer amostra que sair dessa laje depois da luz passou quarenta minutos dentro de uma coisa que vocês não sabem descrever. Isso não é amostra: é amostra exposta.'),
    'Silêncio.',
    'E aí ela faz uma coisa horrível e maravilhosa: ri, e começa a escrever rápido.',
    fala('Chefe da expedição', 'Isso é bom.'),
    c16_eu('É verdade?'),
    fala('Chefe da expedição', 'É completamente verdade, e é exatamente o motivo pelo qual eu ia coletar mesmo assim, porque a alternativa era voltar de mão vazia.'),
    'Ela continua escrevendo.',
    d=>fala('Chefe da expedição', d.flags.sabe_das_janelas_perdidas
      ? 'Mas escrito desse jeito, num relatório, com a série anexada, isso vira justificativa de prorrogação, e não de fracasso.'
      : 'Mas escrito desse jeito, num relatório, isso vira justificativa de prorrogação, e não de fracasso.'),
    'Ela levanta.',
    fala('Chefe da expedição', 'Você acabou de me dar dois anos.')
  ],
  ef:{flag:['equipe_nao_coleta','equipe_aliada','c16_motivo_escrito'],
      npc:c16_npc('Chefe da expedição', 8, 'Recebeu de você a justificativa técnica que transformou fracasso em prorrogação.'),
      rep:{eixo:'bom',delta:7,motivo:'Deu a uma cientista a frase que ela precisava escrever'},
      moral:20, instabilidade:-1,
      registrar:'A expedição não vai coletar: a amostra seria contaminada por evento não controlado.'},
  escolhas:[
    {texto:'Ir pro círculo esperar a luz.', vai:'c16_esperou_no_circulo'},
    {texto:'Buscar o Sr. Tanner.', vai:'c16_buscou_o_ze', cond:d=>!c16_voou(d) && !!d.flags.coautoria}
  ]
},

c16_motivo_moral:{
  texto:[
    c16_eu('Porque ele vai ver vocês fazendo.'),
    'Ela não responde na hora.',
    fala('Chefe da expedição', 'Isso não vai num relatório.'),
    c16_eu('Eu sei.'),
    fala('Chefe da expedição', 'Isso não vai em relatório nenhum do mundo.'),
    c16_eu('Eu sei. Você pediu um motivo que pudesse escrever, e eu não tenho. Eu tenho esse.'),
    'Ela olha o alicerce lá em cima.',
    'E fica olhando por um tempo bem mais longo do que a resposta pede.',
    fala('Chefe da expedição', 'Eu trabalhei onze anos numa linha de pesquisa em que a gente não perguntava nada pra ninguém.'),
    'Ela mexe na câmera térmica sem ligar.',
    fala('Chefe da expedição', 'E o resultado foi que vinte e nove coisas nasceram, em três séries, e nenhuma delas foi perguntada sobre nada. E eu assinei os relatórios de todas.'),
    'Ela põe a câmera na caixa.',
    fala('Chefe da expedição', 'Eu não vou coletar.'),
    c16_eu('E o relatório?'),
    fala('Chefe da expedição', 'Eu vou escrever que a janela não ocorreu.'),
    'Ela fecha a caixa.',
    fala('Chefe da expedição', 'É mentira, é a primeira da minha vida profissional, e eu vou dormir muito bem.')
  ],
  ef:{flag:['equipe_nao_coleta','equipe_mentiu_por_voce','equipe_aliada'],
      npc:c16_npc('Chefe da expedição', 9, 'Decidiu escrever no relatório que a janela não ocorreu. A primeira mentira da carreira dela.'),
      rep:{eixo:'bom',delta:6,motivo:'Deu o motivo que não cabe em relatório'},
      moral:20, instabilidade:-1,
      registrar:'A chefe da expedição vai escrever no relatório que a janela não ocorreu.',
      presagio:'A primeira mentira da vida profissional dela, com quarenta e um anos de carreira.'},
  escolhas:[
    {texto:'Ir pro círculo esperar a luz.', vai:'c16_esperou_no_circulo'},
    {texto:'"Não mente. Escreve a verdade técnica."', vai:'c16_motivo_tecnico'},
    {texto:'Buscar o Sr. Tanner.', vai:'c16_buscou_o_ze', cond:d=>!c16_voou(d) && !!d.flags.coautoria}
  ]
},

c16_so_um_pedido:{
  texto:[
    c16_eu('Não tenho motivo nenhum. Só um pedido.'),
    'Ela espera.',
    c16_eu('Não leva nada hoje.'),
    'Ela olha o acampamento inteiro: três barracas, gerador, antena, quatro caixas, quatro pessoas, e uma verba que levou oito anos pra ser aprovada.',
    fala('Chefe da expedição', 'É só isso?'),
    c16_eu('É.'),
    'Ela ri, sem alegria nenhuma.',
    fala('Chefe da expedição', 'Você sabe quanto custou pôr quatro pessoas nessa ilha?'),
    c16_eu('Não.'),
    fala('Chefe da expedição', 'Nem eu, exatamente. Uns cento e sessenta mil.'),
    'Ela senta na caixa.',
    fala('Chefe da expedição', 'E você chega aqui com {idade} anos, sem crachá, sem autorização e sem argumento, e pede.'),
    'Silêncio comprido.',
    fala('Chefe da expedição', 'E o pior é que pedir é a única coisa que ninguém tinha tentado.')
  ],
  ef:{flag:'pediu_pra_equipe',
      npc:c16_npc('Chefe da expedição', 4, 'Ouviu um pedido sem argumento nenhum, e reparou que pedir era o que ninguém tinha tentado.'),
      rep:{eixo:'bom',delta:4,motivo:'Pediu, sem argumento, o que ninguém pede'},
      presagio:'Pedir é a única coisa que ninguém tinha tentado.'},
  escolhas:[
    {texto:'"Contaminação da amostra por evento não controlado."', vai:'c16_motivo_tecnico'},
    {texto:'"Porque ele vai ver vocês fazendo."', vai:'c16_motivo_moral'},
    {texto:'Ir pro círculo esperar a luz.', vai:'c16_esperou_no_circulo'},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'}
  ]
},

c16_pergunta_equipe:{
  texto:[
    d=>fala(d.jogador.nome, d.flags.c16_disse_andar_onze ? 'Vocês são do andar onze.' : 'O que vocês vieram buscar aqui?'),
    d=>d.flags.c16_disse_andar_onze ? 'Ninguém nega. A mulher do caderno só tampa a caneta.' : 'A mulher do caderno responde, e responde com uma honestidade que te desarma:',
    fala('Chefe da expedição', 'Material genético de Ho-Oh. Uma pena basta. A gente nem precisa capturar, nem chegar perto, nem mexer com ele.'),
    c16_eu('Pra quê?'),
    fala('Chefe da expedição', 'Pra uma linha de pesquisa que já custou onze anos e quatro rodadas de investimento.'),
    'Ela fecha o caderno.',
    fala('Chefe da expedição', 'E que falhou em três séries seguidas, porque a gente estava usando a matriz errada.'),
    c16_eu('Matriz errada como?'),
    fala('Chefe da expedição', 'A matriz que a gente usa vem de um espécime potente e instável. O que a gente precisa é de uma linhagem estável e antiga.'),
    'Ela olha o alicerce.',
    fala('Chefe da expedição', 'E não tem nada mais antigo que isso em Kanto.'),
    c16_eu('Quem paga?'),
    fala('Chefe da expedição', 'Uma comissão.'),
    'Ela guarda a câmera térmica.',
    fala('Chefe da expedição', 'É o nome que eles usam. Comissão. Eu nunca perguntei de quê.'),
    d=>d.flags.viu_os_doze
      ? 'E você entende, com um frio que não é da altitude, pra quem é o décimo segundo tanque do andar onze, o da plaqueta MATRIZ — VAGO.'
      : d.flags.sabe_do_andar_11
        ? 'E você entende, com um frio que não é da altitude, que o andar onze não acabou.'
        : 'E você entende, com um frio que não é da altitude, que "matriz", aqui, quer dizer molde.'
  ],
  ef:{flag:['entendeu_o_proximo_projeto','sabe_da_proxima_matriz'], instabilidade:2, moral:-12,
      registrar:'A expedição quer material genético de Ho-Oh para a próxima matriz. A linha de pesquisa já falhou em três séries.',
      presagio:'Uma comissão. Ela nunca perguntou de quê.'},
  escolhas:[
    {texto:'"Eu vi os tanques."', vai:'c16_eu_vi_as_doze', cond:d=>!!d.flags.viu_os_doze},
    {texto:'"Então vocês não levam pena nenhuma."', vai:'c16_sem_pena'},
    {texto:'"Quantas janelas vocês já perderam?"', vai:'c16_quantas_janelas', cond:d=>!!d.flags.achou_o_padrao},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'},
    {texto:'Atacar o acampamento.', vai:'c16_ataque_equipe'}
  ]
},

c16_eu_vi_as_doze:{
  texto:[
    c16_eu('Eu vi os tanques.'),
    'Ela para.',
    fala('Chefe da expedição', 'Como assim, você viu?'),
    c16_eu('Andar onze. Doze tanques, onze ocupados, o décimo segundo vazio, com uma plaqueta que diz MATRIZ — VAGO.'),
    d=>d.flags.leu_o_quadro ? 'Você continua, e não consegue parar, e nem quer:' : '',
    d=>d.flags.leu_o_quadro ? fala(d.jogador.nome, 'E um quadro branco com a linha do tempo de três séries, e no canto uma frase escrita e apagada três vezes pela mesma pessoa: “eles não falam porque ninguém pergunta”.') : '',
    'Os quatro do acampamento estão olhando pra você.',
    'A chefe da expedição senta na caixa devagar.',
    fala('Chefe da expedição', 'Eu sabia das séries. Eu não sabia que eles ficavam lá.'),
    c16_eu('Como assim?'),
    fala('Chefe da expedição', 'Eu recebo relatório de rendimento. Percentual de viabilidade, taxa de cognição, tempo de estabilização.'),
    'Ela olha as próprias mãos.',
    fala('Chefe da expedição', 'Eu recebo tabela, meu bem. Eu nunca desci.'),
    'Ela levanta a cabeça.',
    fala('Chefe da expedição', 'Eles falam?'),
    'E aí você tem que dizer em voz alta, num platô de rocha no meio do mar, pra quatro cientistas:',
    d=>fala(d.jogador.nome, d.flags.seis_e_cinco ? 'Seis querem sair. Cinco querem parar.'
      : d.flags.falou_com_os_doze ? 'Eles respondem. Quando alguém pergunta.'
      : 'Eu não sei. Ninguém nunca perguntou pra eles.')
  ],
  ef:{flag:['contou_pra_equipe','equipe_quebrada'],
      npc:c16_npc('Chefe da expedição', 7, 'Descobriu com você que os onze do andar 11 continuam lá, nos tanques.'),
      rep:{eixo:'bom',delta:8,motivo:'Contou a quem recebe tabela o que existe embaixo da tabela'},
      moral:15, instabilidade:1,
      registrar:'A chefe da expedição sabia das séries pelas tabelas, mas não sabia que os onze do andar 11 continuam lá.',
      presagio:'"Eu recebo tabela. Eu nunca desci."'},
  escolhas:[
    {texto:'"Então não coleta nada hoje."', vai:'c16_sem_pena'},
    {texto:'"Vai lá descer, então."', vai:'c16_va_descer'},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'},
    {texto:'Ir pro círculo esperar a luz.', vai:'c16_esperou_no_circulo'}
  ]
},

c16_va_descer:{
  texto:[
    c16_eu('Vai lá descer, então.'),
    fala('Chefe da expedição', 'Como?'),
    c16_eu('Você tem crachá. Tem autorização de pesquisa. É chefe de expedição de uma linha de pesquisa de onze anos.'),
    fala('Chefe da expedição', 'E daí?'),
    c16_eu('E daí que eu desci sem crachá, sem autorização e sem nada.'),
    'Ela fica olhando pra você por um tempo bem desconfortável.',
    'Depois abre o caderno numa página em branco, escreve uma linha e vira o caderno pra você ler:',
    '**"Solicitar vistoria técnica presencial ao módulo 11 antes da próxima rodada de coleta. Justificativa: verificação de premissa de projeto."**',
    c16_eu('Isso é um pedido de vistoria?'),
    fala('Chefe da expedição', 'Isso é um pedido de vistoria.'),
    'Ela fecha o caderno.',
    fala('Chefe da expedição', 'E o jurídico deles vai indeferir, e eu vou recorrer, e eles vão indeferir de novo, e isso leva uns oito meses.'),
    'Ela guarda a caneta.',
    fala('Chefe da expedição', 'E aí eu vou ter oito meses de indeferimento por escrito, que vale muito mais do que a vistoria.')
  ],
  ef:{flag:['equipe_vai_pedir_vistoria','equipe_aliada'],
      npc:c16_npc('Chefe da expedição', 9, 'Vai pedir vistoria presencial ao andar 11 para juntar os indeferimentos por escrito.'),
      rep:{eixo:'bom',delta:7,motivo:'Mandou uma chefe de expedição descer'},
      moral:20, instabilidade:-1,
      registrar:'A chefe da expedição vai pedir vistoria presencial ao andar 11 — para juntar indeferimentos por escrito.',
      presagio:'Oito meses de indeferimento por escrito valem mais que a vistoria.'},
  escolhas:[
    {texto:'"E hoje vocês não coletam."', vai:'c16_sem_pena'},
    {texto:'Ir pro círculo esperar a luz.', vai:'c16_esperou_no_circulo'},
    {texto:'Buscar o Sr. Tanner.', vai:'c16_buscou_o_ze', cond:d=>!c16_voou(d) && !!d.flags.coautoria}
  ]
},

c16_expulsou_equipe:{
  texto:[c16_eu('Saiam da ilha.')],
  teste:{status:'carisma', dificuldade:9, nomeStatus:'Carisma',
         critico:'c16_equipe_saiu', sucesso:'c16_equipe_saiu', parcial:'c16_equipe_ficou', falha:'c16_equipe_ficou'}
},

c16_equipe_saiu:{
  texto:[
    'Você diz isso com uma autoridade que você não tem e que eles, por algum motivo, aceitam.',
    d=>Estado.rep.eixo==='bom' && Estado.rep.bom>=5 ? 'Talvez seja a sua reputação. Metade de Kanto sabe o seu nome e a outra metade sabe a sua história, e as duas metades chegaram aqui antes de você.' :
       Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5 ? 'Talvez seja a sua reputação — mas de um jeito bem diferente. Um deles já estava guardando o equipamento antes de você terminar a frase.' :
       'Talvez seja porque ninguém ali quer explicar pra um chefe por que houve confronto numa ilha sem jurisdição definida, a onze horas da costa.',
    'Eles chamam o barco deles pelo rádio e desmontam o acampamento em três horas, e o barco chega quando eles terminam.',
    'A chefe da expedição é a última a embarcar.',
    'Ela para na argola de ferro com a corda na mão e olha pra você.',
    fala('Chefe da expedição', 'A gente volta na próxima janela.'),
    c16_eu('Quando?'),
    fala('Chefe da expedição', 'Se o intervalo for seis, dois mil e seis. Se for sete, dois mil e sete.'),
    'Ela amarra a corda no barco — e na hora de ir, desamarra, direito, sem pressa. Não corta.',
    c16_eu('Eu também volto.'),
    'Ela assente.',
    fala('Chefe da expedição', 'Eu sei.')
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Expulsou uma expedição científica de uma ilha sem jurisdição'},
      flag:'expulsou_a_equipe', instabilidade:-1,
      npc:{nome:'Chefe da expedição', opiniao:1, memoria:'Saiu da ilha quando você mandou, e desamarrou a corda direito em vez de cortar.'},
      executar:()=>{ Relogio.avancar(3); return []; },
      registrar:'Expulsou a expedição da ilha sem nome. A chefe disse que volta em 2006 ou 2007.'},
  escolhas:[
    {texto:'Ir pro círculo esperar a luz.', vai:'c16_esperou_no_circulo'},
    {texto:'Deitar numa das depressões.', vai:'c16_deitou_na_depressao'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'}
  ]
},

c16_equipe_ficou:{
  texto:[
    'O mais velho responde sem largar a chave de fenda:',
    fala('o mais velho da equipe', 'Com todo o respeito: essa ilha não é de ninguém, a gente tem autorização de pesquisa protocolada, e você tem {idade} anos.'),
    'Ele volta ao trabalho.',
    'Ele não está errado em nenhum dos três pontos.',
    'E é exatamente isso que dá raiva: você passou a jornada inteira aprendendo que estar certo no papel é o que decide, e agora o papel está do outro lado.'
  ],
  ef:{flag:'equipe_ficou', moral:-8},
  escolhas:[
    {texto:'"Quantas janelas vocês já perderam?"', vai:'c16_quantas_janelas', cond:d=>!!d.flags.achou_o_padrao},
    {texto:'"O que vocês vieram buscar aqui?"', vai:'c16_pergunta_equipe'},
    {texto:'Ir pro círculo e esperar a luz na frente deles.', vai:'c16_esperou_no_circulo'},
    {texto:'Atacar o acampamento.', vai:'c16_ataque_equipe'}
  ]
},

c16_ataque_equipe:{
  texto:[
    'Você ataca um acampamento científico numa ilha deserta.',
    'Eles têm Pokémon de segurança, porque expedição sempre tem, e o segurança é um profissional contratado que não tem nada a ver com a discussão e que vai fazer o trabalho dele.'
  ],
  ef:{moral:-10},
  batalha:{dex:103, nivel:52, tipo:'treinador', treinador:'Segurança da expedição', fuga:true,
           timeExtra:[{dex:76, nivel:53}],
           vitoria:'c16_venceu_equipe', derrota:'c16_perdeu_equipe', fuga2:'c16_alicerce', gameover:'gameover'}
},

c16_venceu_equipe:{
  texto:[
    'Você derruba os Pokémon do segurança e destrói o gerador, a câmera térmica e a antena.',
    'Eles não revidam.',
    'Cientista não revida — cientista anota.',
    'A chefe da expedição escreve alguma coisa enquanto você quebra o equipamento dela, e isso te assusta mais do que se ela gritasse.',
    c16_eu('O que você está escrevendo?'),
    fala('Chefe da expedição', 'A data.'),
    'Ela não levanta a cabeça.',
    fala('Chefe da expedição', 'A gente vai precisar dela no relatório do seguro. E na queixa na polícia.'),
    'Ela vira a página.',
    fala('Chefe da expedição', 'E na justificativa de prorrogação da verba, que agora eu tenho.'),
    'E aí ela levanta a cabeça.',
    fala('Chefe da expedição', 'Obrigada, sinceramente. Eu ia voltar com nada, e agora eu volto com um incidente. E incidente prorroga projeto.')
  ],
  ef:{rep:{eixo:'ruim',delta:3,motivo:'Destruiu o equipamento de uma expedição autorizada'},
      flag:'destruiu_a_expedicao', instabilidade:1, moral:-15,
      executar:d=>{ d.liga.avisos++; return [{tipo:'liga', texto:'Mais uma ocorrência com o seu nome no sistema da Liga.'}]; },
      registrar:'Destruiu o equipamento da expedição. O incidente prorroga o projeto.',
      presagio:'Incidente prorroga projeto. Você acabou de comprar dois anos pra eles.'},
  escolhas:[
    {texto:'"Desculpa." E ajudar a recolher.', vai:'c16_ajudou_a_recolher'},
    {texto:'Ir pro círculo esperar a luz.', vai:'c16_esperou_no_circulo'},
    {texto:'Deitar numa das depressões.', vai:'c16_deitou_na_depressao'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'}
  ]
},

c16_ajudou_a_recolher:{
  texto:[
    c16_eu('Desculpa.'),
    d=>`Você passa as quatro horas seguintes ajudando quatro cientistas a recolher os cacos do equipamento que você quebrou, num platô de rocha, ${c16_deDia(d) ? 'debaixo do sol' : 'no escuro, com uma lanterna de cabeça emprestada'}.`,
    'Ninguém fala com você.',
    'Na terceira hora, o mais novo da equipe — um rapaz de uns vinte e cinco — te passa uma caixa e diz "essa vai fechada", e é a primeira frase que alguém te dirige.',
    'Na quarta, a chefe senta na caixa que sobrou e pergunta, sem olhar:',
    fala('Chefe da expedição', 'Por que você quebrou?'),
    'E você tem que responder, e a resposta honesta é ruim:',
    c16_eu('Porque eu não sabia mais o que fazer, e quebrar era a única coisa que eu sabia fazer.'),
    'Ela assente.',
    fala('Chefe da expedição', 'Eu vou pôr isso no relatório também.'),
    c16_eu('Sério?'),
    fala('Chefe da expedição', 'Não.'),
    'Ela levanta.',
    fala('Chefe da expedição', 'Mas eu ia querer poder.')
  ],
  ef:{flag:'ajudou_a_recolher',
      npc:c16_npc('Chefe da expedição', 3, 'Você ajudou a recolher por quatro horas o que tinha quebrado, e disse por quê.'),
      rep:{eixo:'bom',delta:4,motivo:'Ficou quatro horas recolhendo o que quebrou'},
      moral:15, hp:-3, causa:'Quatro horas recolhendo caco',
      executar:()=>{ Relogio.avancar(4); return []; },
      registrar:'Ajudou a expedição a recolher o equipamento destruído.',
      presagio:'"Quebrar era a única coisa que eu sabia fazer."'},
  escolhas:[
    {texto:'"Quantas janelas vocês já perderam?"', vai:'c16_quantas_janelas', cond:d=>!!d.flags.achou_o_padrao},
    {texto:'"O que vocês vieram buscar aqui?"', vai:'c16_pergunta_equipe'},
    {texto:'Ir pro círculo esperar a luz.', vai:'c16_esperou_no_circulo'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'}
  ]
},

c16_perdeu_equipe:{
  texto:[
    'Você perde pro segurança de uma expedição científica.',
    'Eles te tratam bem depois: dão água, olham os seus machucados com um estojo de primeiros socorros de verdade, oferecem carona no barco deles e perguntam se você precisa ligar pra alguém.',
    'É humilhante de um jeito muito completo, porque não tem nada de errado com nada disso.',
    'A chefe da expedição senta na caixa do lado da sua e não diz nada por um tempo.',
    'Depois:',
    fala('Chefe da expedição', 'Você tem {idade} anos.'),
    c16_eu('Tenho.'),
    d=>fala('Chefe da expedição', c16_voou(d)
      ? 'E veio voando, quatro horas de mar aberto, pra ficar entre quatro adultos e uma coisa que você acha que a gente vai machucar.'
      : 'E veio onze horas de barco pra ficar entre quatro adultos e uma coisa que você acha que a gente vai machucar.'),
    'Ela olha o alicerce.',
    fala('Chefe da expedição', 'Eu tinha vinte e dois quando fiz uma coisa parecida. Era uma barragem.'),
    c16_eu('E funcionou?'),
    fala('Chefe da expedição', 'Não.'),
    'Ela levanta.',
    fala('Chefe da expedição', 'Mas eu não me arrependo, e eu sou muito chata em reunião desde então, e isso serve pra alguma coisa.')
  ],
  ef:{hp:-8, causa:'Derrota para o segurança da expedição', flag:'perdeu_pra_equipe',
      npc:c16_npc('Chefe da expedição', 4, 'Cuidou dos seus machucados e contou de quando ela tinha 22 anos e uma barragem.'),
      moral:-5,
      registrar:'Perdeu para o segurança da expedição.',
      presagio:'"Eu sou muito chata em reunião desde então." É uma carreira inteira nessa frase.'},
  escolhas:[
    {texto:'"Quantas janelas vocês já perderam?"', vai:'c16_quantas_janelas', cond:d=>!!d.flags.achou_o_padrao},
    {texto:'"O que vocês vieram buscar aqui?"', vai:'c16_pergunta_equipe'},
    {texto:'Ir pro círculo esperar a luz.', vai:'c16_esperou_no_circulo'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'}
  ]
},

/* ─────────────── O CÍRCULO ─────────────── */

c16_esperou_no_circulo:{
  texto:[
    'Você senta no centro do desgaste circular, no meio da laje de doze metros, no topo de uma ilha sem nome a onze horas da costa.',
    'E espera.',
    d=>c16_espera(d),
    d=>c16_comAEquipe(d),
    'Faz frio, venta, a pedra é dura, e você não tem nada pra fazer. É a coisa mais parecida com fazer um pedido que você já fez na vida sem pedir nada.',
    'Às onze e dez, começa.',
    'A luz não vem do céu.',
    d=>d.flags.viu_o_arco_iris
      ? 'Ontem, lá de baixo, parecia que vinha. Daqui não tem como parecer.'
      : 'Essa é a coisa que ninguém nunca contou direito, e você entende por quê: quem viu da costa não tinha como ver.',
    'A luz sai da laje.',
    'Sai do desgaste circular embaixo de você, sobe reta uns duzentos metros e abre em leque no alto, e você está dentro dela, sentad{o|a}, e ela não queima, não cega e não esquenta.',
    'Tem cor. Todas.',
    'E dentro da luz, descendo por ela como quem desce por um corrimão, vem uma coisa de sete metros de envergadura.'
  ],
  ef:{flag:'viu_hooh',
      instabilidade:1,
      executar:d=>{
        d.flags.c16_espera_circulo = (C16_LUZ - c16_hora(d) + 24) % 24;
        c16_ate(C16_LUZ);
        const L = Estado.lend(250); if (L) L.encontros++;
        return [];
      },
      registrar:'A luz sai da laje, não do céu. Ho-Oh desceu por ela.',
      presagio:'A luz sai de baixo. Da costa, ninguém tinha como saber.'},
  escolhas:[
    {texto:'Ficar parad{o|a}. Absolutamente parad{o|a}.', vai:'c16_ficou_parado'},
    {texto:'Ajoelhar.', vai:'c16_ajoelhou'},
    {texto:'Falar com ele.', vai:'c16_falou_hooh'},
    {texto:'Jogar a Pokébola.', vai:'c16_captura_hooh'}
  ]
},

c16_circulo_vazio:{
  texto:[
    'Você senta de novo no centro do desgaste circular e espera.',
    'A luz não volta.',
    d=>d.flags.achou_o_padrao
      ? 'Pela caixa de charuto, ela pode vir mais uma noite, ou duas, ou só daqui a seis anos. Esta noite, não vem.'
      : 'Ninguém sabe quando ela volta. Esta noite, não volta.',
    'Quando o céu clareia sobre o mar, você ainda está sentad{o|a} no mesmo lugar, com as pernas dormentes.'
  ],
  ef:{executar:()=>{ c16_ate(6); return []; }},
  escolhas:[{texto:'Descer da ilha.', vai:'c16_desceu_ilha'}]
},

c16_ficou_parado:{
  texto:[
    'Você fica absolutamente parad{o|a}.',
    'Ele pousa no círculo, a dois metros de você, e o círculo é do tamanho exato dele, o que responde de uma vez a pergunta de quem gastou a pedra.',
    'Nos primeiros minutos ele não te olha.',
    'Ele faz outra coisa: anda pelo alicerce inteiro, devagar, para nas três depressões, uma por uma, e encosta o bico em cada uma delas.',
    'Uma. Duas. Três.',
    'Em cada uma ele fica uns quarenta segundos.',
    'E você entende, sentad{o|a} numa laje com uma coisa de sete metros de envergadura a dois metros de distância:',
    d=>d.flags.sabe_dos_trezentos_e_cinco
      ? 'ele vem aqui há trezentas e vinte e oito noites contadas na escada, pra encostar o bico nesses três lugares.'
      : d.flags.achou_o_padrao
        ? 'ele vem aqui de seis em seis anos, há mais tempo do que alguém contou, pra encostar o bico nesses três lugares.'
        : 'ele vem aqui há mais tempo do que alguém contou, pra encostar o bico nesses três lugares.',
    'E esta noite os três estão vazios.',
    'Depois ele te olha.'
  ],
  ef:{flag:['ficou_parado_hooh','entendeu_o_ritual'],
      rep:{eixo:'bom',delta:5,motivo:'Ficou parad{o|a} e viu o ritual inteiro'},
      moral:15, instabilidade:1,
      registrar:'Ho-Oh encosta o bico nas três depressões, uma por uma, quarenta segundos em cada.',
      presagio:d=>d.flags.achou_a_praia ? 'Três lugares vazios aqui. Três lugares gastos numa praia de pedra, em Kanto.'
        : (d.flags.viu_os_tres || d.flags.sabe_dos_tres) ? 'Três lugares vazios. E três Pokémon grandes correndo de madrugada numa ciclovia.'
        : 'Três lugares vazios.'},
  escolhas:[
    {texto:'"Eles estão vivos."', vai:'c16_eles_estao_vivos', cond:d=>!!d.flags.viu_os_tres || !!d.flags.sabe_dos_tres},
    {texto:'Falar com ele.', vai:'c16_falou_hooh'},
    {texto:'Ajoelhar.', vai:'c16_ajoelhou'},
    {texto:'Não fazer nada.', vai:'c16_deixou_pena'}
  ]
},

c16_eles_estao_vivos:{
  texto:[
    c16_eu('Eles estão vivos.'),
    'Você fala isso em voz alta, sentad{o|a} numa laje de pedra, dentro de uma coluna de luz, pra uma coisa de sete metros de envergadura.',
    'Ele não se move.',
    d=>fala(d.jogador.nome, d.flags.achou_a_praia
      ? 'Os três. Numa praia de pedra no fim de uma ciclovia, em Kanto, deitados lado a lado, com quatro metros entre eles, olhando o mar.'
      : 'Os três. Correndo de madrugada numa ciclovia, em Kanto, na beira do mar.'),
    d=>fala(d.jogador.nome, d.flags.contou_pros_caes ? 'Eu falei com eles. Um deles encostou a testa no meu ombro.'
      : d.flags.sabe_do_circuito ? 'Eles correm um circuito de trinta e quatro quilômetros, nas madrugadas em que vêm.'
      : d.flags.viu_os_tres ? 'Eu vi os três.'
      : 'Quem me contou viu os três.'),
    'E aí acontece uma coisa que você não consegue descrever direito.',
    'A luz muda de cor.',
    'Não em ondas, não em pulso: ela muda inteira, de uma vez, em todas as direções, e fica dourada por uns quatro segundos.',
    'E depois volta.',
    'Ele abaixa a cabeça até a altura da sua, que é uma distância enorme pra ele descer, e fica assim.',
    'E você entende que, em séculos de visita, ninguém nunca tinha subido até aqui pra contar alguma coisa pra ele.'
  ],
  ef:{flag:['contou_pra_hooh','hooh_aliado'],
      executar:d=>{ const L = Estado.lend(250); if (L){ L.disposicao = 'passivo'; L.aliado = true; }
        Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade - 3);
        return [{tipo:'mundo', texto:'Ho-Oh soube que os três estão vivos. A luz ficou dourada por quatro segundos.'}]; },
      rep:{eixo:'bom',delta:8,motivo:'Contou a coisa que séculos de visita não tinham contado'},
      moral:30, instabilidade:-2,
      registrar:'Contou a Ho-Oh que os três estão vivos em Kanto. A luz ficou dourada.',
      presagio:'Séculos de visita. E ninguém tinha vindo contar nada.'},
  escolhas:[
    {texto:'"Eles estão esperando uma coisa sair de Cinnabar."', vai:'c16_falou_hooh'},
    {texto:'Ficar em silêncio e deixar ele decidir.', vai:'c16_deixou_pena'},
    {texto:'Ajoelhar.', vai:'c16_ajoelhou'},
    {texto:'Pegar uma pena que cai.', vai:'c16_pegou_pena'}
  ]
},

c16_falou_hooh:{
  texto:[
    'Você fala.',
    'Não tem nada de solene: você fala rápido, atropelado, com a voz tremendo, sentad{o|a} numa pedra fria com as mãos dormentes, pra uma coisa que não pisca.',
    'Você fala de onde veio e de tudo que viu no caminho.',
    d=>d.flags.sabe_do_deposito ? 'Do armazém de Celadon e das gaiolas com número de processo.' : '',
    d=>d.flags.sabe_da_planilha_71 ? 'Da reserva de Fuchsia e da planilha de mil novecentos e setenta e um.' : '',
    d=>d.flags.viu_os_doze ? 'Do andar onze, dos doze tanques e da plaqueta que diz MATRIZ — VAGO.' : '',
    d=>d.flags.sabe_que_subiram ? 'Do laboratório de Cinnabar e do homem que subiu um vulcão com alguém do lado, no mesmo passo.'
      : d.flags.fuji_saiu ? 'Do laboratório de Cinnabar e do homem que saiu de lá às quatro e dez da manhã.' : '',
    d=>d.flags.viu_a_caixa_de_charuto ? 'Da caixa de charuto com os bilhetes em papel de pão.' : '',
    d=>!c16_equipeNaIlha(d) ? ''
      : `E no fim, sem planejar, você fala de quem está nesta ilha agora, a trinta metros, ${d.flags.destruiu_a_expedicao ? 'juntando os cacos do equipamento que você quebrou' : 'com uma câmera térmica apontada pra cá'}:`,
    d=>!c16_equipeNaIlha(d) ? ''
      : fala(d.jogador.nome, d.flags.entendeu_o_proximo_projeto ? 'E tem gente ali atrás querendo uma pena sua.' : 'E tem gente ali atrás esperando você.'),
    d=>c16_equipeNaIlha(d) ? 'Ele vira a cabeça na direção do platô sul, fica olhando naquela direção por um tempo muito longo, e depois volta pra você.' : 'Ele escuta tudo sem piscar.',
    'E abaixa a cabeça de um jeito que não é ameaça e não é submissão, e que você não sabe ler.'
  ],
  ef:{flag:'falou_com_hooh',
      executar:d=>{ const L = Estado.lend(250); if (L && L.disposicao !== 'hostil') L.disposicao = 'passivo'; return []; },
      rep:{eixo:'bom',delta:6,motivo:'Contou tudo em voz alta pra quem não tinha como responder'},
      moral:20,
      registrar:'Contou tudo a Ho-Oh, em voz alta.',
      presagio:d=>c16_equipeNaIlha(d) ? 'Ele olhou pro platô sul. Você acabou de apontar quatro pessoas.' : 'Ele ouviu até o fim.'},
  escolhas:[
    {texto:'"Não faz nada com eles."', vai:'c16_nao_faz_nada', cond:d=>c16_equipeNaIlha(d)},
    {texto:'"Eles estão vivos." — falar dos três.', vai:'c16_eles_estao_vivos', cond:d=>!!d.flags.viu_os_tres || !!d.flags.sabe_dos_tres},
    {texto:'Ficar em silêncio.', vai:'c16_deixou_pena'},
    {texto:'Ajoelhar.', vai:'c16_ajoelhou'}
  ]
},

c16_nao_faz_nada:{
  texto:[
    c16_eu('Não faz nada com eles.'),
    'Você fala isso antes de pensar, e só depois percebe o tamanho da frase:',
    d=>d.flags.entendeu_o_proximo_projeto
      ? 'você acabou de pedir clemência a um Pokémon lendário em nome de quatro cientistas que vieram buscar uma pena dele.'
      : 'você acabou de pedir clemência a um Pokémon lendário em nome de quatro pessoas que você mal conhece.',
    'Ele olha pra você.',
    'E aí faz uma coisa pequena e absurda: encolhe um pouco o pescoço e mexe a cabeça de lado.',
    d=>d.flags.falou_com_os_caes ? 'É um gesto que você já viu num Raikou, numa ciclovia, de madrugada.' : 'É o gesto de Pokémon que não entendeu a frase, mas entendeu que teve frase.',
    'Ele não entendeu as palavras.',
    'Entendeu que você pediu, que pediu apontando pra eles, e que pedir apontando pra alguém é uma coisa que ele conhece.',
    'Ele não vai fazer nada com eles.',
    'Não porque você pediu.',
    'Porque ele nunca ia fazer nada com eles, e quem precisava pedir era você.'
  ],
  ef:{flag:'pediu_clemencia',
      rep:{eixo:'bom',delta:4,motivo:'Pediu clemência por quem veio buscar uma pena'},
      moral:15,
      registrar:'Pediu a Ho-Oh que não fizesse nada com a expedição.',
      presagio:'Ele nunca ia fazer nada. Quem precisava pedir era você.'},
  escolhas:[
    {texto:'"Eles estão vivos." — falar dos três.', vai:'c16_eles_estao_vivos', cond:d=>!!d.flags.viu_os_tres || !!d.flags.sabe_dos_tres},
    {texto:'Ficar em silêncio.', vai:'c16_deixou_pena'},
    {texto:'Ajoelhar.', vai:'c16_ajoelhou'},
    {texto:'Pegar uma pena que cai.', vai:'c16_pegou_pena'}
  ]
},

c16_ajoelhou:{
  texto:[
    'Você ajoelha.',
    'Não é decisão: o seu joelho vai ao chão sem você decidir nada, e depois você fica ajoelhad{o|a} porque levantar seria pior.',
    'Ele olha.',
    'E aí faz a coisa que te desmonta: recua um passo.',
    'Uma coisa de sete metros de envergadura, num círculo que ela mesma gastou na pedra ao longo de séculos, recua um passo porque uma pessoa ajoelhou.',
    'Depois abaixa a cabeça até o chão — até a pedra, encostando o bico na laje — e fica assim uns quatro segundos.',
    'Depois levanta, olha pra você e espera.',
    'Você entende, ajoelhad{o|a}, com as mãos na pedra fria: ele devolveu o gesto.',
    'Ele não quer isso.',
    'Ele não sabe o que fazer com isso e devolveu, que é a coisa mais educada que dava pra fazer.',
    'Você levanta.',
    'Ele também.'
  ],
  ef:{flag:'ajoelhou_hooh',
      executar:d=>{ const L = Estado.lend(250); if (L && L.disposicao !== 'hostil') L.disposicao = 'passivo'; return []; },
      rep:{eixo:'bom',delta:3,motivo:'Ajoelhou e foi corrigid{o|a}'},
      moral:10,
      registrar:'Ajoelhou diante de Ho-Oh, e ele devolveu o gesto.'},
  escolhas:[
    {texto:'Falar com ele.', vai:'c16_falou_hooh'},
    {texto:'"Eles estão vivos."', vai:'c16_eles_estao_vivos', cond:d=>!!d.flags.viu_os_tres || !!d.flags.sabe_dos_tres},
    {texto:'Ficar parad{o|a}.', vai:'c16_deixou_pena'},
    {texto:'Pegar uma pena que cai.', vai:'c16_pegou_pena'}
  ]
},

/* ─────────────── A PENA ─────────────── */

c16_pegou_pena:{
  texto:[
    'Uma pena cai.',
    'Não é ele largando: é pena caindo, do jeito que pena cai de qualquer Pokémon de pena, porque Pokémon de pena troca pena, e isso é a coisa mais banal do mundo.',
    'Ela desce planando por uns oito segundos e para na laje a um metro de você.',
    'Tem uns quarenta centímetros, é vermelha na base e dourada na ponta, e não brilha, porque é uma pena.',
    'Você pega.',
    'Ela é morna. E leve de um jeito que não faz sentido pro tamanho.',
    'Ele olha você pegar.',
    'E não faz nada — nem impede, nem aprova —, e a falta das duas coisas é o que te dá um nó no estômago, porque quer dizer que a decisão é inteiramente sua.'
  ],
  ef:{flag:'tem_a_pena',
      itens:{'Pena Arco-Íris':1},
      registrar:'Pegou uma pena de Ho-Oh caída na laje.'},
  escolhas:[
    {texto:'Guardar. Ela é sua agora.', vai:'c16_guardou_a_pena'},
    {texto:'Devolver: pôr de volta no chão do círculo.', vai:'c16_deixou_pena'},
    {texto:'Levar a pena pra expedição.', vai:'c16_deu_a_pena', cond:d=>c16_equipeNaIlha(d)},
    {texto:'Queimar a pena.', vai:'c16_queimou_a_pena'}
  ]
},

c16_guardou_a_pena:{
  texto:[
    'Você guarda a pena na mochila, enrolada no cobertor, com cuidado.',
    d=>d.flags.c16_hooh_saiu_aqui
      ? 'E ele vai embora. Não ofendido, não com pressa: sobe pela luz do mesmo jeito que desceu, a luz apaga quando ele acaba de subir, e o alicerce fica escuro, frio e vazio de uma vez.'
      : 'Lá em cima, o alicerce está escuro.',
    d=>d.flags.c16_hooh_saiu_aqui ? 'Você fica sozinh{o|a} numa laje de doze metros com uma pena de quarenta centímetros na mochila.' : '',
    'E a coisa que te incomoda é essa:',
    d=>d.flags.pena_dada ? 'você não tirou nada de ninguém. Ele empurrou a pena até você pegar.' : 'você não tirou nada de ninguém. A pena caiu. Ele viu você pegar.',
    'E mesmo assim.',
    d=>c16_equipeNaIlha(d) && d.flags.entendeu_o_proximo_projeto && !d.flags.equipe_recusou_a_pena
      ? 'E a trinta metros, no platô sul, tem quatro pessoas que vieram buscar exatamente isso e não conseguiram, e agora a pena está com você e não com elas, e você tem que decidir o que isso significa.' : ''
  ],
  ef:{flag:'guardou_a_pena',
      rep:{eixo:'ruim',delta:1,motivo:'Ficou com a pena'},
      moral:-8,
      executar:d=>{ c16_hoohSobe(d); return []; },
      registrar:'Guardou a Pena Arco-Íris.',
      presagio:'"E mesmo assim." Fica com essas três palavras.'},
  escolhas:[
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Voltar e pôr a pena de volta no círculo.', vai:'c16_devolveu_no_escuro'},
    {texto:'Levar a pena pra expedição.', vai:'c16_deu_a_pena', cond:d=>c16_equipeNaIlha(d) && !d.flags.equipe_recusou_a_pena},
    {texto:'Levar a pena pro Sr. Tanner.', vai:'c16_deu_pro_ze', cond:d=>!c16_voou(d)}
  ]
},

c16_devolveu_no_escuro:{
  texto:[
    d=>d.flags.c16_vinha_do_barco
      ? `Você sobe ${c16_descida(d)} de novo, no escuro, com a pena enrolada no cobertor.`
      : 'Você volta ao alicerce no escuro, com a pena enrolada no cobertor.',
    'Põe a pena no centro do círculo, no desgaste que o corpo dele fez na pedra, e recua.',
    'Ninguém olha. A luz não volta. É uma pena no chão de uma laje, de noite, no meio do mar.',
    'Você fica olhando um tempo, e vai embora sem ela.'
  ],
  ef:{flag:'pena_devolvida', perdeItens:{'Pena Arco-Íris':1},
      rep:{eixo:'bom',delta:4,motivo:'Devolveu a pena ao círculo sem ninguém ver'},
      moral:10,
      executar:d=>{ d.flags.c16_vinha_do_barco = !!d.flags.c16_ja_no_barco; d.flags.c16_ja_no_barco = false; return []; },
      registrar:'Devolveu a Pena Arco-Íris ao centro do círculo.'},
  escolhas:[{texto:'Descer da ilha.', vai:'c16_desceu_ilha'}]
},

c16_deu_pro_ze:{
  texto:[
    d=>`Você desce ${c16_descida(d)} com a pena enrolada no cobertor e rema até o barco.`,
    'E entrega.',
    'O Sr. Tanner desenrola o cobertor na luz de posição do barco e olha quarenta centímetros de pena vermelha e dourada.',
    'E não pega.',
    'Ele olha por um tempo bem longo, com as mãos no colo.',
    fala('Sr. Tanner', 'Não.'),
    c16_eu('Como não?'),
    d=>fala('Sr. Tanner', d.flags.ze_sabe_do_pai ? 'Meu pai veio aqui dezenove vezes e não trouxe nada.'
      : d.flags.achou_a_marca_do_pai ? 'Meu pai veio aqui, e não trouxe nada.'
      : 'Meu pai passou a vida olhando pra essa ilha e nunca trouxe nada dela.'),
    'Ele enrola o cobertor de volta, com cuidado, sem encostar na pena.',
    fala('Sr. Tanner', 'E eu sempre achei que era porque ele não conseguia.'),
    'Ele empurra o cobertor pra você.',
    fala('Sr. Tanner', 'Agora eu acho que era porque ele não quis.')
  ],
  ef:{flag:['ze_recusou_a_pena','c16_ja_no_barco'],
      npc:c16_npc('Sr. Tanner', 9, 'Não quis pegar a pena. Entendeu que o pai nunca trouxe nada porque não quis.'),
      rep:{eixo:'bom',delta:3,motivo:'Ofereceu a pena a quem tinha mais direito que você'},
      moral:10,
      registrar:'O Sr. Tanner não quis a pena. O pai dele nunca trouxe nada da ilha.',
      presagio:'Não conseguia, ou não quis.'},
  escolhas:[
    {texto:'Subir e devolver a pena ao círculo.', vai:'c16_devolveu_no_escuro'},
    {texto:'Levar a pena pra expedição.', vai:'c16_deu_a_pena', cond:d=>c16_equipeNaIlha(d) && !d.flags.equipe_recusou_a_pena},
    {texto:'Ficar com ela e voltar pra Fuchsia.', vai:'c16_desceu_ilha'}
  ]
},

c16_deu_a_pena:{
  texto:[
    d=>d.flags.c16_vinha_do_barco
      ? `Você sobe ${c16_descida(d)} de novo e atravessa o topo até o platô sul, com a pena na mão.`
      : 'Você desce até o platô sul com a pena na mão.',
    d=>d.flags.c16_hooh_saiu_aqui ? 'Atrás de você, a luz apaga. Ele foi.' : '',
    'A chefe da expedição levanta da caixa quando vê o que você traz. Você estende a pena pra ela.',
    'Ela não pega.',
    'Ela olha a pena, olha você, olha a pena, e põe as mãos nos bolsos do casaco — um gesto deliberado, de quem está segurando a própria mão.',
    fala('Chefe da expedição', 'Como você conseguiu?'),
    d=>fala(d.jogador.nome, d.flags.pena_dada ? 'Ele me deu.' : 'Caiu.'),
    fala('Chefe da expedição', 'Caiu, ou você tirou?'),
    d=>fala(d.jogador.nome, d.flags.pena_dada ? 'Ele empurrou com o bico até eu pegar. Cinco vezes.' : 'Caiu. Ele viu eu pegar e não fez nada.'),
    'Ela fica com as mãos no bolso por muito tempo.',
    d=>fala('Chefe da expedição', d.flags.equipe_quebrada || d.flags.contou_pra_equipe
      ? 'Se eu levar isso, daqui a três anos tem mais um tanque. E eu vou receber a tabela.'
      : 'Se eu levar isso, a verba renova por seis anos e eu mantenho quatro empregos. E daqui a três anos tem mais um tanque.'),
    'Ela olha a pena mais uma vez.',
    fala('Chefe da expedição', 'Leva de volta pra cima.'),
    c16_eu('Você tem certeza?'),
    fala('Chefe da expedição', 'Não.'),
    'Ela vira de costas.',
    fala('Chefe da expedição', 'Leva antes que eu tenha.')
  ],
  ef:{flag:['equipe_recusou_a_pena','equipe_aliada'],
      npc:c16_npc('Chefe da expedição', 8, 'Pôs as mãos nos bolsos para não pegar a pena, e mandou você levar de volta antes que ela mudasse de ideia.'),
      rep:{eixo:'bom',delta:6,motivo:'Ofereceu a pena a quem veio buscá-la e ouviu um não'},
      moral:20, instabilidade:-1,
      executar:d=>{ d.flags.c16_vinha_do_barco = !!d.flags.c16_ja_no_barco; d.flags.c16_ja_no_barco = false; c16_hoohSobe(d); return []; },
      registrar:'A chefe da expedição não aceitou a pena e mandou devolvê-la.',
      presagio:'"Leva antes que eu tenha."'},
  escolhas:[
    {texto:'Levar de volta ao círculo.', vai:'c16_devolveu_no_escuro'},
    {texto:'Ficar com ela mesmo assim.', vai:'c16_guardou_a_pena'},
    {texto:'Insistir pra ela ficar.', vai:'c16_insistiu'},
    {texto:'Descer da ilha com ela.', vai:'c16_desceu_ilha'}
  ]
},

c16_insistiu:{
  texto:[
    c16_eu('Fica com ela.'),
    'Ela vira de volta, e a cara dela mudou.',
    fala('Chefe da expedição', 'Por quê?'),
    c16_eu('Porque se você não ficar, alguém vem na próxima janela e tira à força, e você é a melhor pessoa que vai pisar nessa ilha.'),
    'Ela ouve isso inteiro.',
    'E responde uma coisa que você não esperava:',
    fala('Chefe da expedição', 'Essa é a frase que me trouxe até aqui.'),
    c16_eu('Como?'),
    fala('Chefe da expedição', '“Se eu não fizer, alguém pior faz.” Eu me disse isso em oitenta e nove pra aceitar o primeiro contrato, em noventa e dois pra assinar o segundo, e em noventa e seis pra não perguntar o que era a comissão.'),
    'Ela pega a pena da sua mão — e no segundo em que ela pega, você entende que errou.',
    'Ela olha a pena.',
    'Depois anda até a beira do platô, e você acha que ela vai jogar no mar, e ela não joga.',
    'Ela sobe.',
    'Sobe os trinta metros até o alicerce com a pena na mão, põe de volta no centro do círculo, desce, e não fala com você o resto da noite.'
  ],
  ef:{flag:['equipe_devolveu_a_pena','pena_devolvida'],
      perdeItens:{'Pena Arco-Íris':1},
      npc:c16_npc('Chefe da expedição', 6, 'Pegou a pena da sua mão, subiu trinta metros e devolveu a pena ao círculo.'),
      rep:{eixo:'bom',delta:4,motivo:'Errou e foi corrigid{o|a} por quem você tentou convencer'},
      moral:10, instabilidade:-1,
      registrar:'A chefe da expedição devolveu a pena ao círculo com as próprias mãos.',
      presagio:'"Se eu não fizer, alguém pior faz." Você acabou de dizer a frase que constrói tudo isso.'},
  escolhas:[
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Ficar no platô até amanhecer.', vai:'c16_desceu_ilha', ef:{flag:'c16_ficou_ate_amanhecer'}},
    {texto:'Pedir desculpa pelo equipamento e ajudar a recolher.', vai:'c16_ajudou_a_recolher', cond:d=>!!d.flags.destruiu_a_expedicao}
  ]
},

c16_queimou_a_pena:{
  texto:[
    'Você queima a pena.',
    'Ela não queima como pena.',
    'Pega fogo devagar, da ponta pra base, e o fogo é branco, e não tem cheiro de pena queimada, nem de nada.',
    'Leva quase dois minutos.',
    'Quando acaba não sobra cinza: sobra um risco preto na pedra da laje, de uns quarenta centímetros, exatamente do tamanho dela.',
    'E na luz que ainda sai da laje você repara numa coisa:',
    'tem outros riscos na pedra.',
    'Muitos. Apagados pelo tempo, quase invisíveis, espalhados pelo desgaste circular inteiro.',
    'Dezenas.',
    'Outras pessoas já queimaram penas aqui, e cada uma achou que era a primeira a ter essa ideia.',
    'Ele olha o risco novo, depois você, e sobe pela luz. A luz apaga quando ele acaba de subir.'
  ],
  ef:{flag:['queimou_a_pena','pena_destruida'],
      perdeItens:{'Pena Arco-Íris':1},
      rep:{eixo:'bom',delta:2,motivo:'Destruiu a coisa que vinham buscar'},
      moral:-5, instabilidade:-1,
      executar:d=>{ c16_hoohSobe(d); return []; },
      registrar:'Queimou a Pena Arco-Íris. A laje está cheia de riscos iguais.',
      presagio:'Dezenas de riscos. Cada um foi a primeira pessoa a ter essa ideia.'},
  escolhas:[
    {texto:'Contar os riscos.', vai:'c16_contou_as_marcas'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Ficar no círculo até amanhecer.', vai:'c16_desceu_ilha', ef:{flag:'c16_ficou_ate_amanhecer'}},
    {texto:d=>d.flags.achou_equipe_na_ilha ? 'Ir contar pra expedição.' : 'Seguir as marcas de bota.', vai:'c16_botas'}
  ]
},

c16_contou_as_marcas:{
  texto:[
    d=>{ const l = c16_luz(); return `Você conta os riscos de queimado na laje, deitad{o|a} de bruços, ${l ? l + ' de lado' : 'passando a mão na pedra'}, por uma hora e quarenta.`; },
    'Trinta e um.',
    'Trinta e uma pessoas, ao longo de quem sabe quantos séculos, subiram essa ilha, ficaram com uma pena e queimaram ela na mesma laje.',
    d=>d.flags.sabe_dos_trezentos_e_cinco
      ? 'Se a escada estiver certa, são trezentas e vinte e oito noites. Uma queimada a cada dez, mais ou menos.'
      : '',
    'Sempre teve alguém que achou que era o primeiro.',
    'Você deita de costas na laje, do lado do seu risco novo, e olha o céu, que é a única coisa que dá pra ver daqui de baixo.',
    'Trinta e uma pessoas antes de você acharam que estavam resolvendo.',
    'E ele continua vindo.'
  ],
  ef:{flag:'contou_as_marcas_de_queimado',
      rep:{eixo:'bom',delta:4,motivo:'Contou os trinta e um riscos'},
      moral:-10, instabilidade:1,
      executar:()=>{ Relogio.avancar(2); return []; },
      registrar:'Há 31 riscos de pena queimada na laje do alicerce.',
      presagio:'Trinta e uma pessoas acharam que estavam resolvendo.'},
  escolhas:[
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Ficar até amanhecer.', vai:'c16_desceu_ilha', ef:{flag:'c16_ficou_ate_amanhecer'}},
    {texto:d=>d.flags.achou_equipe_na_ilha ? 'Ir contar pra expedição.' : 'Seguir as marcas de bota.', vai:'c16_botas'}
  ]
},

c16_deixou_pena:{
  texto:[
    d=>d.flags.c16_tinha_a_pena
      ? 'Você põe a pena de volta no chão do círculo e recua até a borda da laje.'
      : 'Você não faz nada. Uma pena cai — pena cai de Pokémon de pena, é a coisa mais banal do mundo — e para na laje entre vocês dois. Você não pega, e recua até a borda da laje.',
    'Ele olha a pena no chão.',
    'Depois olha você.',
    'E aí faz uma coisa muito pequena: empurra a pena com o bico, dois centímetros, na sua direção.',
    'E depois recua ele mesmo um passo.',
    'Você não pega.',
    'Ele empurra de novo.',
    'E vocês ficam nisso — ele empurrando e você não pegando — umas quatro vezes, numa laje de doze metros, dentro de uma coluna de luz, às onze e meia da noite, e é a coisa mais absurda e mais engraçada que já te aconteceu.',
    'Na quinta vez, você pega.',
    'E ele bate as asas uma vez, e sobe. A luz apaga quando ele acaba de subir.'
  ],
  ef:{flag:'pena_dada',
      rep:{eixo:'bom',delta:7,motivo:'Não pegou até ser dado quatro vezes'},
      moral:25, instabilidade:-2,
      executar:d=>{
        d.flags.c16_tinha_a_pena = Estado.contaItem('Pena Arco-Íris') > 0;
        if (!d.flags.c16_tinha_a_pena) Estado.darItem('Pena Arco-Íris', 1);
        Estado.marcar('tem_a_pena');
        c16_hoohSobe(d);
        const L = Estado.lend(250); if (L){ L.disposicao = 'passivo'; L.aliado = true; }
        return [];
      },
      registrar:'Ho-Oh empurrou a pena na sua direção cinco vezes até você pegar.',
      presagio:'Cinco vezes. A diferença entre tirar e receber custa cinco vezes.'},
  escolhas:[
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Ficar no círculo até amanhecer.', vai:'c16_desceu_ilha', ef:{flag:'c16_ficou_ate_amanhecer'}},
    {texto:'Ir contar pra expedição.', vai:'c16_deu_a_pena', cond:d=>c16_equipeNaIlha(d)}
  ]
},

/* ─────────────── A POKÉBOLA ─────────────── */

c16_captura_hooh:{
  texto:[
    'Você joga a Pokébola dentro de uma coluna de luz que sai de uma laje de pedra, no topo de uma ilha sem nome.',
    'Ele não desvia.',
    'Ele olha a Pokébola vindo, a trajetória inteira, e não desvia.'
  ],
  ef:{moral:-15,
      executar:d=>{ const L = Estado.lend(250); if (L) L.ataquesSofridos++; return []; }},
  batalha:{dex:250, nivel:60, tipo:'lendario', fuga:true, ambiente:'montanha',
           vitoria:'c16_pos_hooh', derrota:'c16_pos_hooh', fuga2:'c16_desceu_ilha',
           captura:'c16_capturou_hooh', gameover:'gameover'}
},

c16_pos_hooh:{
  texto:[
    'Ele sobe pela luz.',
    'A luz apaga quando ele acaba de subir, o alicerce fica escuro e frio de uma vez, e é o silêncio mais completo que você já ouviu, porque não tem mato, não tem Pokémon, não tem estrada.',
    'Só vento, e o mar sessenta metros abaixo.',
    'Você fica de pé no meio de uma laje, no escuro, sozinh{o|a}.',
    'Ele não lutou de verdade.',
    'Você entende isso pelo que não aconteceu: a laje está inteira, o alicerce está inteiro, você está inteir{o|a}.',
    'Uma coisa de sete metros de envergadura passou vinte minutos com você e não quebrou nada.'
  ],
  ef:{executar:d=>{ c16_hoohSobe(d);
        const L = Estado.lend(250);
        if (L && L.ataquesSofridos >= 2){ L.disposicao = 'hostil'; return [{tipo:'perigo', texto:'Ho-Oh não vai voltar enquanto você estiver em Kanto.'}]; }
        return []; },
      rep:{eixo:'ruim',delta:2,motivo:'Atacou Ho-Oh no alicerce'}, moral:-15, instabilidade:1},
  escolhas:[
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Deitar numa das três depressões.', vai:'c16_deitou_na_depressao'},
    {texto:'Ficar na laje até amanhecer.', vai:'c16_desceu_ilha', ef:{flag:'c16_ficou_ate_amanhecer'}}
  ]
},

c16_capturou_hooh:{
  texto:[
    'A Pokébola fecha.',
    'E a luz não apaga.',
    'É isso que te quebra: a coluna de luz continua saindo da laje, subindo duzentos metros e abrindo em leque no alto, sem nada dentro.',
    'Ela fica assim os quarenta minutos de sempre, e depois some, sozinha, no horário.',
    'A luz nunca foi ele.',
    'A luz é o lugar chamando.',
    d=>d.flags.achou_o_padrao ? 'E pela caixa de charuto, ela chama de seis em seis anos, com o círculo vazio ou não.' : 'E ela chama com o círculo vazio ou não.',
    d=>d.flags.viu_as_tres_depressoes ? 'E as três depressões da laje continuam vazias, e agora tem uma quarta coisa que não vem.' : ''
  ],
  ef:{instabilidade:3, flag:'capturou_hooh', moral:-25,
      executar:d=>{ d.flags.c16_hooh_foi = true; return []; },
      registrar:'Capturou Ho-Oh. A luz continuou saindo da laje, vazia, pelos quarenta minutos de sempre.'},
  escolhas:[
    {texto:'Soltar. Agora, aqui.', vai:'c16_soltou_hooh'},
    {texto:'Ir embora com ele.', vai:'c16_desceu_com_hooh'},
    {texto:'Esperar a luz apagar, deitad{o|a} numa das depressões, com a Pokébola na mão.', vai:'c16_deitou_com_a_bola'}
  ]
},

c16_deitou_com_a_bola:{
  texto:[
    'Você deita numa das três depressões da laje com a Pokébola na mão.',
    'Dali só se vê o céu, e o céu tem a coluna de luz atravessando, e a coluna está vazia.',
    'Você fica deitad{o|a} os quarenta minutos inteiros.',
    d=>d.flags.sabe_dos_tres_nadando
      ? 'E na metade deles você percebe que está deitad{o|a} num lugar gasto por um corpo grande, ao longo de séculos, com quem vinha visitar esse corpo fechado numa esfera de dez centímetros na sua mão.'
      : 'E na metade deles você percebe que está deitad{o|a} num lugar gasto por um corpo grande, ao longo de séculos, com quem vinha visitar esse lugar fechado numa esfera de dez centímetros na sua mão.',
    d=>d.flags.achou_a_praia
      ? 'E que do outro lado do mar tem uma praia de pedra com três lugares gastos, ocupados agora, de frente pra água.'
      : 'E que as três depressões do lado continuam vazias.',
    'A luz some no horário.',
    'E você continua deitad{o|a}.'
  ],
  ef:{flag:'deitou_com_a_bola',
      moral:-15, instabilidade:1,
      registrar:'Ficou deitad{o|a} numa das depressões com Ho-Oh na Pokébola até a luz sumir.',
      presagio:'Três lugares gastos.'},
  escolhas:[
    {texto:'Soltar.', vai:'c16_soltou_hooh'},
    {texto:'Ir embora com ele.', vai:'c16_desceu_com_hooh'},
    {texto:'Ficar até amanhecer, e soltar.', vai:'c16_soltou_hooh', ef:{executar:()=>{ c16_ate(6); return []; }}}
  ]
},

c16_soltou_hooh:{
  texto:[
    d=>d.flags.c16_solta_no_mar ? 'Você abre a Pokébola na popa do barco, no meio do mar escuro.'
      : !d.flags.c16_voltou_pra_soltar ? 'Você abre a Pokébola no centro do círculo.'
      : c16_voou(d) ? 'Você volta pelo ar até a ilha, sobe até o alicerce e abre a Pokébola no centro do círculo.'
      : Historia.jaAconteceu('c16_explicou_pro_ze') ? `O Sr. Tanner vira o barco sem dizer nada. Você sobe ${c16_descida(d)} de novo e abre a Pokébola no centro do círculo.`
      : `Você sobe ${c16_descida(d)} de novo e abre a Pokébola no centro do círculo.`,
    'Ele sai.',
    d=>d.flags.c16_solta_no_mar
      ? 'Ele abre as asas em cima da água e não vai embora na hora: dá uma volta inteira em torno do barco, baixo, devagar, e depois toma o rumo da ilha.'
      : 'E não vai embora na hora: fica na laje, no lugar dele, no desgaste que o corpo dele fez ao longo de séculos, e olha você.',
    d=>d.flags.c16_solta_no_mar
      ? 'Você fica olhando até ele virar um ponto, e o ponto sumir na direção da ilha.'
      : 'Depois faz a coisa que veio fazer: anda pelo alicerce, para nas três depressões, uma por uma, e encosta o bico em cada uma.',
    d=>d.flags.c16_solta_no_mar ? '' : 'Uma. Duas. Três. Quarenta segundos em cada.',
    d=>d.flags.c16_solta_no_mar ? '' : 'Ele termina o que veio fazer. E só depois de terminar é que ele sobe.'
  ],
  ef:{flag:'soltou_hooh', limpaFlag:'capturou_hooh',
      executar:d=>{
        const p = [...d.time, ...d.pc].find(x => x.dex === 250);
        const av = p ? Captura.soltar(p).map(e => ({tipo:e.tipo, texto:e.texto})) : [];
        const L = Estado.lend(250); if (L) L.disposicao = 'passivo';
        d.flags.c16_hooh_foi = true;
        return av;
      },
      rep:{eixo:'bom',delta:5,motivo:'Soltou Ho-Oh antes de ir embora com ele'},
      moral:20, instabilidade:-2,
      registrar:d=>d.flags.c16_solta_no_mar ? 'Soltou Ho-Oh no meio do mar. Ele voltou pra ilha.' : 'Soltou Ho-Oh no círculo. Ele terminou o que veio fazer antes de subir.'},
  escolhas:[
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha', cond:d=>!Historia.jaAconteceu('c16_desceu_com_hooh')},
    {texto:d=>c16_voou(d) ? 'Voltar pra Fuchsia.' : d.flags.c16_solta_no_mar ? 'Seguir pra Fuchsia.' : 'Voltar pro barco.',
     vai:'c16_volta_depois_de_soltar', cond:d=>Historia.jaAconteceu('c16_desceu_com_hooh')}
  ]
},

c16_volta_depois_de_soltar:{
  texto:[
    d=>c16_voou(d) ? 'Você volta pelo ar. Quatro horas de mar escuro, e o cinto não pesa mais nada.'
      : 'O Sr. Tanner põe a proa em Fuchsia sem perguntar nada.',
    d=>c16_voou(d)
      ? 'Em Fuchsia, na mesa de dominó, o Sr. Tanner olha o seu cinto, depois olha você, e empurra uma cadeira com o pé.'
      : 'Ele não fala a travessia inteira. Mas quando chega em Fuchsia, amarra o barco e espera você descer antes de ir pra mesa de dominó, o que ele não precisava fazer.'
  ],
  ef:{npc:c16_npc('Sr. Tanner', 3, 'Viu você soltar o que tinha levado da ilha.'),
      executar:d=>{
        Relogio.avancar(c16_voou(d) ? C16_VOO : d.flags.c16_solta_no_mar ? C16_TRAVESSIA - 5 : C16_TRAVESSIA);
        d.flags.c16_voltou = true;
        Mundo.marcarVisitado('ilha_sem_nome');
        return [];
      }},
  escolhas:[{texto:'Seguir.', vai:'c16_fim'}]
},

c16_desceu_com_hooh:{
  texto:[
    d=>c16_voou(d) ? 'Você volta pelo ar com uma Pokébola no cinto.' : `Você desce ${c16_descida(d)} com uma Pokébola no cinto.`,
    d=>c16_voou(d) ? 'Quatro horas de mar escuro. A Pokébola não pesa nada, e você sente o peso dela o caminho inteiro.'
      : 'O Sr. Tanner está no barco, com a luz de posição acesa, e a primeira coisa que ele pergunta quando te vê chegar é:',
    d=>c16_voou(d) ? 'Em Fuchsia, na mesa de dominó, o Sr. Tanner te vê atravessar o cais. Olha o seu rosto, e depois o seu cinto.'
      : fala('Sr. Tanner', 'Viu?'),
    d=>c16_voou(d) ? '' : fala(d.jogador.nome, 'Vi.'),
    d=>c16_voou(d) ? '' : 'E ele ri, e fica rindo uns vinte segundos, e depois para, porque reparou na sua cara.',
    d=>c16_voou(d) ? '' : fala('Sr. Tanner', 'Que foi?'),
    d=>c16_voou(d) ? '' : 'Você não responde. Ele olha o seu cinto, depois o seu rosto, depois o seu cinto de novo.',
    'E ele não pergunta mais nada.',
    d=>c16_voou(d)
      ? 'Um velho de oitenta e um anos que passou quarenta esperando ver, e que agora não olha pra você.'
      : 'Um velho de oitenta e um anos que passou quarenta esperando ver, e que viu, e que agora não olha pra você.'
  ],
  ef:{flag:'desceu_com_hooh',
      rep:{eixo:'ruim',delta:3,motivo:'Foi embora da ilha com Ho-Oh no cinto'},
      npc:{nome:'Sr. Tanner', opiniao:-4, memoria:'Reparou na Pokébola no seu cinto e não perguntou mais nada.'},
      moral:-25, instabilidade:2,
      executar:d=>{ if (c16_voou(d)){ Relogio.avancar(C16_VOO); d.flags.c16_voltou = true; } return []; },
      registrar:'Foi embora da ilha com Ho-Oh capturado.',
      presagio:'Ele não olha pra você.'},
  escolhas:[
    {texto:'Soltar no meio da travessia.', vai:'c16_soltou_hooh', cond:d=>!c16_voou(d),
     ef:{flag:'c16_solta_no_mar', executar:()=>{ Relogio.avancar(5); return []; }}},
    {texto:d=>c16_voou(d) ? 'Voltar pra ilha e soltar no círculo.' : 'Subir de volta e soltar no círculo.', vai:'c16_soltou_hooh',
     ef:{flag:'c16_voltou_pra_soltar', executar:d=>{ if (c16_voou(d)){ Relogio.avancar(C16_VOO); d.flags.c16_voltou = false; } return []; }}},
    {texto:'Explicar pro Sr. Tanner.', vai:'c16_explicou_pro_ze'},
    {texto:'Não dizer nada.', vai:'c16_fim'}
  ]
},

c16_explicou_pro_ze:{
  texto:[
    'Você tenta explicar.',
    'Você fala de instabilidade, de gente que vem na próxima janela, de que é melhor estar com você do que com eles, de que você vai soltar depois, de que é temporário.',
    'Ele ouve tudo.',
    'E no fim fala uma coisa só, sem raiva nenhuma, que é o que torna tudo pior:',
    d=>fala('Sr. Tanner', d.flags.ze_sabe_do_pai ? 'Meu pai foi dezenove vezes.' : 'Meu pai ia pra lá. Eu nunca soube quantas vezes.'),
    d=>c16_voou(d) ? 'Ele mexe uma pedra do dominó.' : 'Ele corrige o rumo.',
    d=>fala('Sr. Tanner', c16_voou(d) ? 'Eu fui duas.' : 'Eu fui três.'),
    'Ele olha o mar.',
    fala('Sr. Tanner', 'E você foi uma.')
  ],
  ef:{flag:'ze_falou_das_vezes',
      npc:{nome:'Sr. Tanner', opiniao:-3, memoria:'Disse quantas vezes o pai foi, quantas ele foi, e que você foi uma.'},
      moral:-15,
      registrar:'"E você foi uma."',
      presagio:'Ele contou as vezes. É a única coisa que ele podia contar.'},
  escolhas:[
    {texto:'Pedir pra ele virar o barco.', vai:'c16_soltou_hooh', cond:d=>!c16_voou(d), ef:{flag:'c16_voltou_pra_soltar'}},
    {texto:'Soltar do barco mesmo.', vai:'c16_soltou_hooh', cond:d=>!c16_voou(d),
     ef:{flag:'c16_solta_no_mar', executar:()=>{ Relogio.avancar(5); return []; }}},
    {texto:'Voltar pra ilha e soltar no círculo.', vai:'c16_soltou_hooh', cond:d=>c16_voou(d),
     ef:{flag:'c16_voltou_pra_soltar', executar:()=>{ Relogio.avancar(C16_VOO); Estado.dados.flags.c16_voltou = false; return []; }}},
    {texto:'Não dizer mais nada.', vai:'c16_fim'},
    {texto:'"O senhor tem razão." E ficar calad{o|a}.', vai:'c16_fim'}
  ]
},

/* ─────────────── A VOLTA ─────────────── */

c16_desceu_ilha:{
  texto:[
    d=>d.flags.c16_ficou_ate_amanhecer ? 'Você fica até o céu clarear sobre o mar, e só então vai embora.' : '',
    d=>c16_voou(d) ? 'Você volta pro canto do platô onde pousou.' : d.flags.c16_ja_no_barco ? '' : `Você desce ${c16_descida(d)}.`,
    d=>d.flags.riscou_o_degrau && d.flags.achou_a_escada && !c16_voou(d) && !d.flags.c16_ja_no_barco
      ? 'Na metade você passa pelo risco novo, o mais raso e o mais torto de todos, e encosta o dedo nele.' : '',
    d=>c16_voou(d) ? 'A volta é pelo ar, quatro horas de mar escuro, e ninguém em Fuchsia sabe que você saiu.'
      : Historia.jaAconteceu('c16_deu_pro_ze') ? 'O Sr. Tanner já viu o que tinha pra ver. Ele liga o motor sem perguntar nada.'
      : 'O Sr. Tanner está no barco, com a luz de posição acesa e a garrafa térmica vazia.',
    d=>c16_voou(d) || Historia.jaAconteceu('c16_deu_pro_ze') ? '' : fala('Sr. Tanner', 'Viu?'),
    d=>{
      if (c16_voou(d) || Historia.jaAconteceu('c16_deu_pro_ze')) return '';
      const f = d.flags, pena = Estado.contaItem('Pena Arco-Íris') > 0;
      return fala(d.jogador.nome, pena || f.viu_hooh ? 'Vi.' : f.viu_o_arco_iris ? 'A luz eu vi. O resto não deu tempo.' : 'Não.');
    },
    d=>{
      if (c16_voou(d) || Historia.jaAconteceu('c16_deu_pro_ze')) return '';
      const f = d.flags;
      if (Estado.contaItem('Pena Arco-Íris') > 0) return 'Você mostra a pena. Ele olha quarenta centímetros de vermelho e dourado por muito tempo, e não encosta.';
      if (f.viu_hooh) return 'Ele bate na borda do barco duas vezes com a palma da mão.';
      return f.viu_o_arco_iris ? 'Ele assente.' : 'Ele assente devagar.';
    },
    d=>{
      if (c16_voou(d) || Historia.jaAconteceu('c16_deu_pro_ze')) return '';
      const f = d.flags;
      return fala('Sr. Tanner', Estado.contaItem('Pena Arco-Íris') > 0 ? 'Meu pai ia gostar.'
        : f.viu_hooh ? 'Pronto. Agora somos dois.'
        : f.viu_o_arco_iris ? 'A luz já é.' : 'Da próxima.');
    },
    d=>c16_voou(d) ? '' : 'A travessia de volta leva onze horas. Ele dorme sentado com a mão no leme, acordando a cada vinte minutos pra corrigir o rumo, do mesmo jeito da ida.',
    d=>c16_voou(d) ? '' : 'Você fica acordad{o|a} as onze horas inteiras.'
  ],
  ef:{flag:'desceu_da_ilha',
      executar:d=>{
        if (d.flags.c16_ficou_ate_amanhecer) c16_ate(6);
        Relogio.avancar(c16_voou(d) ? C16_VOO : C16_TRAVESSIA);
        d.flags.c16_voltou = true;
        d.flags.c16_ja_no_barco = false;
        Mundo.marcarVisitado('ilha_sem_nome');
        return [];
      }},
  escolhas:[{texto:'Chegar a Fuchsia.', vai:'c16_fim'}]
},

c16_fim:{
  texto:[
    d=>{
      const f = d.flags;
      if (f.contou_pra_hooh) return 'A luz ficou dourada por quatro segundos. Você não sabe o que isso quis dizer, e quem sabe desceu por ela e subiu de novo sem explicar nada a ninguém.';
      if (f.capturou_hooh) return 'Você tem no cinto uma coisa que uma ilha inteira foi construída pra esperar, e a ilha continua esperando, e a luz continua saindo da laje no horário.';
      if (f.pena_dada && Estado.contaItem('Pena Arco-Íris') > 0) return 'Você tem uma pena de quarenta centímetros que foi empurrada cinco vezes na sua direção até você pegar, que pesa quase nada, e que você não faz ideia do que é pra fazer com ela.';
      if (f.queimou_a_pena) return f.contou_as_marcas_de_queimado
        ? 'Tem um risco preto novo numa laje de doze metros a onze horas da costa, e ele é o trigésimo segundo, e nenhum dos trinta e um anteriores resolveu nada.'
        : 'Tem um risco preto novo numa laje de doze metros a onze horas da costa, no meio de dezenas de riscos iguais.';
      if (f.soltou_hooh) return 'Ele terminou o que tinha ido fazer e foi embora do jeito que veio, e a Pokébola vazia pesa mais do que pesava cheia.';
      if (f.nao_foi_a_ilha && !f.chegou_na_ilha) return 'A ilha continua onde estava, e a luz continua aparecendo duas vezes por década, e um velho continua contando no cais.';
      return 'A ilha continua onde estava, sem nome, com um alicerce de doze metros que ninguém explica.';
    },
    d=>{
      const f = d.flags;
      if (f.equipe_recusou_a_pena || f.equipe_devolveu_a_pena) return 'E de uma expedição que custou cento e sessenta mil, uma mulher com quarenta e um anos de carreira volta sem amostra, de propósito, pela primeira vez.';
      if (f.equipe_mentiu_por_voce && !f.c16_motivo_escrito) return 'E a chefe da expedição vai escrever no relatório que a janela não ocorreu, com a letra de quem nunca tinha mentido num relatório.';
      if (f.equipe_nao_coleta) return 'E um relatório está sendo escrito de um jeito que compra dois anos, e dois anos é o que existe entre uma coisa acontecer e não acontecer.';
      if (f.destruiu_a_expedicao) return 'E um incidente prorroga um projeto que ia fechar por falta de resultado, e o incidente é você.';
      if (f.expulsou_a_equipe) return 'E quatro pessoas voltaram sem nada, e a chefe delas disse que volta na próxima janela, e desamarrou a corda em vez de cortar.';
      if (f.achou_equipe_na_ilha) return 'E em algum escritório alguém está preenchendo um formulário de prorrogação de verba.';
      return '';
    },
    d=>d.flags.ze_virou_coautor
      ? 'E no caderno da Dra. Sallow, na página da lista de autores, o segundo nome é O. Tanner, pescador, Fuchsia, e o terceiro, H. Tanner, in memoriam.'
      : d.flags.coautoria ? 'E no caderno da chefe da expedição, na lista de autores, tem dois nomes de pescador conferidos duas vezes.'
      : c16_comACaixa(d) ? 'E você está com uma caixa de charuto amarrada com elástico, com sessenta e um anos dentro, que não é sua, e que te deram pra não ficar numa caixa.' : '',
    d=>d.flags.a_promessa_da_menina && d.flags.viu_hooh
      ? 'No calçadão, a toalha da Nina está estendida no mesmo lugar. Você senta do lado dela e conta de quem é a pena.' : '',
    d=>d.flags.a_promessa_da_menina && d.flags.viu_hooh ? fala('Nina', 'Eu sabia que não era de azar.') : '',
    d=>c16_voou(d) && !Historia.jaAconteceu('c16_desceu_com_hooh')
      ? 'Em Fuchsia, no cais, o Sr. Tanner está na mesa de dominó, contando a história pra quem não pediu. Você senta do lado dele.'
      : (d.flags.nao_foi_a_ilha && !d.flags.chegou_na_ilha) ? 'Em Fuchsia, no cais, o Sr. Tanner continua na mesa de dominó.'
      : c16_voou(d) ? 'Em Fuchsia, no cais, o Sr. Tanner volta a contar a história na mesa de dominó, e não olha pra você.'
      : 'Em Fuchsia, no cais, o Sr. Tanner amarra o barco, sobe os quatro degraus da rampa devagar e vai direto pra mesa de dominó.',
    d=>c16_voou(d) && !Historia.jaAconteceu('c16_desceu_com_hooh')
      ? 'E dessa vez, quando ele chega na parte da luz, alguém na mesa não muda de assunto.'
      : (d.flags.nao_foi_a_ilha && !d.flags.chegou_na_ilha) ? 'E continua contando.'
      : c16_voou(d) ? ''
      : 'Senta. As pessoas da mesa perguntam onde ele esteve, e ele começa a contar.'
  ],
  ef:{executar:d=>{
        if ((d.flags.chegou_na_ilha || c16_voou(d)) && !d.flags.c16_voltou){
          Relogio.avancar(c16_voou(d) ? C16_VOO : C16_TRAVESSIA);
          d.flags.c16_voltou = true;
        }
        if (d.flags.a_promessa_da_menina && d.flags.viu_hooh) Estado.marcar('contou_pra_nina');
        return [];
      }},
  sai:'fuchsia',
  fim:true, resumo:'Capítulo 16 concluído — a ilha sem nome tinha três lugares vazios em cima.'
}

}}

);

/* Opção que leva a lugar (o alicerce, o acampamento, o círculo, a mesa
   de dominó, o barco) não some depois da primeira vez: a volta é outra
   cena (os `desvios`). Cena que só acontece uma vez some de todo menu
   depois que aconteceu, venha de onde vier a opção. */
(function(){
  const cap = CAPITULOS.find(c => c.num === 16);
  if (!cap) return;
  const VOLTA = new Set(['c16_alicerce', 'c16_botas', 'c16_esperou_no_circulo', 'c16_velho', 'c16_desceu_ilha', 'c16_travessia']);
  const SEMPRE = new Set([...VOLTA, 'c16_esperou_noite', 'c16_fim', 'c16_alicerce_de_novo', 'c16_acampamento',
    'c16_circulo_vazio', 'c16_velho_de_novo']);
  for (const cena of Object.values(cap.cenas))
    for (const e of (cena.escolhas || [])){
      if (VOLTA.has(e.vai)) e.repetivel = true;
      if (SEMPRE.has(e.vai)) continue;
      const antes = e.cond, alvo = e.vai;
      e.cond = d => !Historia.jaAconteceu(alvo) && (!antes || antes(d));
    }
})();
