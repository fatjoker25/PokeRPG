/* ------------------------------------------------------------
   ABERTURAS — dezenove quilômetros de ciclovia vazia. Dá pra
   chegar nela de bicicleta alugada, pela cabine de pedágio do sul,
   atrás de quem esvaziou, ou com crachá na mão.
   ------------------------------------------------------------ */
const C15_ABERTURAS = ['c15_rotas', 'c15_ab_a_bicicleta', 'c15_ab_a_cabine', 'c15_ab_a_caminhonete', 'c15_ab_de_cracha'];
const C15_BICICLETA = 500;   /* quatrocentos o dia e cem o capacete */
function c15_cabe(id, d){
  if (id === 'c15_ab_a_bicicleta') return d.jogador.dinheiro >= C15_BICICLETA;
  if (id === 'c15_ab_de_cracha')   return typeof Cargos !== 'undefined' && !!Cargos.doCracha();
  return true;
}
/* cada abertura começa num ponto da ciclovia e numa hora, e o relógio
   vai até ela: a estrada de manhã, a administração de Fuchsia no
   horário dela, num dia útil */
const C15_ONDE_DA_ABERTURA = {c15_rotas:'norte', c15_ab_a_bicicleta:'norte', c15_ab_a_cabine:'sul',
                              c15_ab_a_caminhonete:'norte', c15_ab_de_cracha:'fuchsia'};
const C15_HORA_DA_ABERTURA = {c15_rotas:7, c15_ab_a_bicicleta:8, c15_ab_a_cabine:9, c15_ab_a_caminhonete:9};
function c15_abertura(d){
  const cand = C15_ABERTURAS.filter(id => c15_cabe(id, d));
  const id = Dados.escolher(cand);
  if (d && d.relogio && d.flags && d.flags.c15_chegada == null){
    if (id === 'c15_ab_de_cracha') c15_esperarAbrir('c15_espera_lina', 9, 17, true);
    else c15_ate(C15_HORA_DA_ABERTURA[id]);
    d.flags.c15_onde = C15_ONDE_DA_ABERTURA[id];
    c15_chegou(d);
  }
  return id;
}

/* ------------------------------------------------------------
   ONDE VOCÊ ESTÁ. A ciclovia desce de Celadon a Fuchsia em
   dezenove quilômetros, pelas Rotas 16, 17 e 18 (cada rota é um
   "trecho"): a cabine de pedágio do norte e a locadora no
   quilômetro zero, o vilarejo da Rota 17 no nove, a Ylva contando
   no doze, o mirante, a praia de pedra e a cabine do sul no
   dezenove, a administração em Fuchsia no vinte e um. Ir de um
   ponto a outro passa o relógio: quatro quilômetros por hora a pé,
   quinze de bicicleta.
   ------------------------------------------------------------ */
const C15_KM = {norte:0, vilarejo:9, nair:12, sul:19, fuchsia:21};
function c15_onde(d){ return d.flags.c15_onde || 'norte'; }
function c15_ir(d, lugar){
  const km = Math.abs((C15_KM[lugar] || 0) - (C15_KM[c15_onde(d)] || 0));
  const h = Math.round(km / (d.flags.alugou_bicicleta ? 15 : 4));
  if (h > 0) Relogio.avancar(h);
  Estado.marcar('c15_onde', lugar);
  return h;
}
/* andar a ciclovia inteira termina na outra ponta */
function c15_outraPonta(d){ return (C15_KM[c15_onde(d)] || 0) >= 9 ? 'norte' : 'sul'; }
/* opção que diz "no mirante" leva você até ele */
const C15_AO_MIRANTE = {executar:d=>{ c15_ir(d, 'sul'); return []; }};
/* "Vamos hoje à noite. Juntos.": a Ylva e o Xavi esperam com você */
const C15_COM_ELES = {flag:'c15_espera_com_eles'};

/* ------------------------------------------------------------
   O TEMPO DA CICLOVIA. A frente anda de sul pra norte, um trecho
   por mês: o 18 zerou dois meses antes do mês em que você chega, o
   17 no mês passado, e o 16, o da ponta de Celadon, está zerando
   agora. Meses e datas saem do calendário do jogo, contados do dia
   em que você chega.
   ------------------------------------------------------------ */
function c15_hora(d){ sincronizarHora(d.relogio); return d.relogio.hora; }
/* a próxima vez que der h horas, vivendo o tempo */
function c15_ate(h){
  const r = Estado.dados.relogio; sincronizarHora(r);
  const falta = (h - r.hora + 24) % 24;
  if (falta) Relogio.viver(falta);
}
function c15_deDia(d){ const h = c15_hora(d); return h >= 6 && h < 18; }
function c15_chegou(d){
  if (d.flags.c15_chegada == null) d.flags.c15_chegada = d.relogio.dia;
  return d.flags.c15_chegada;
}
/* quantos dias se passaram desde que você chegou */
function c15_passados(d){ return Math.max(0, (d.relogio.dia || 1) - c15_chegou(d)); }
/* a data de `atras` dias antes do dia em que você chegou */
function c15_data(d, atras){
  const C = Calendario;
  let abs = c15_chegou(d) - 1 + C.inicio() - 1 - (atras || 0), m = 0;
  while (abs < 0){ m = (m + 11) % 12; abs += C.DIAS[m]; }
  while (abs >= C.DIAS[m]){ abs -= C.DIAS[m]; m = (m + 1) % 12; }
  return {dia: abs + 1, mes: C.MESES[m], num: (m + 2) % 12 + 1};
}
function c15_dia(x){ return x.dia === 1 ? 'primeiro' : porExtenso(x.dia); }
function c15_ext(x){ return `${c15_dia(x)} de ${x.mes}`; }
function c15_Ext(x){ const s = c15_ext(x); return s.charAt(0).toUpperCase() + s.slice(1); }
function c15_num(x){ return `${String(x.dia).padStart(2, '0')}/${String(x.num).padStart(2, '0')}`; }
/* o mês de `n` meses antes do mês em que você chegou (0 é o de agora) */
function c15_mes(d, n){
  const c = Calendario.de(c15_chegou(d));
  return Calendario.MESES[(((c.mes - (n || 0)) % 12) + 12) % 12];
}
/* uma coisa que aconteceu `atras` dias antes de você chegar, contada de hoje */
function c15_faz(d, atras){
  const n = atras + c15_passados(d);
  if (n === 0) return 'hoje';
  if (n === 1) return 'ontem';
  if (n === 2) return 'anteontem';
  if (n === 7) return 'faz uma semana';
  if (n === 14) return 'faz duas semanas';
  return `faz ${porExtenso(n)} dias`;
}
function c15_Faz(d, atras){ const s = c15_faz(d, atras); return s.charAt(0).toUpperCase() + s.slice(1); }
/* número no feminino ("duas horas") */
function c15_fem(n){ return porExtenso(n).replace(/\bum$/, 'uma').replace(/\bdois$/, 'duas'); }
/* a hora que o Xavi anota quando você chega: "Sete e dezoito", "Meio-dia e cinco" */
function c15_horaFalada(d){
  const t = d.flags.c15_xavi_hora || 7 * 60, h = Math.floor(t / 60), m = t % 60;
  const nome = h === 0 ? 'Meia-noite' : h === 12 ? 'Meio-dia'
    : (s => s.charAt(0).toUpperCase() + s.slice(1))(c15_fem(h % 12 || 12));
  return m ? `${nome} e ${porExtenso(m)}` : `${nome} em ponto`;
}
function c15_naDia(nome){ return (nome === 'sábado' || nome === 'domingo' ? 'no ' : 'na ') + nome; }

/* O que a Ylva, o Xavi e os outros contam, em dias antes da sua
   chegada: a primeira vez que a Ylva viu os três; as três vezes que o
   curral do vilarejo abriu (a última nesta madrugada), cada uma com os
   três passando na madrugada seguinte; a última vinda do Red, e os três
   na madrugada seguinte, que foi a noite da lanterna da Ylva; a moça de
   bicicleta e o homem de terno no livro do Xavi; o dia em que o
   superintendente assinou as onze ocorrências. */
const C15_PRIMEIRA = 66, C15_CURRAL = [52, 31, 0], C15_RED = 7, C15_LANTERNA = 6;
const C15_MOCA = 14, C15_TERNO = 9, C15_ASSINOU = 4;

/* Lugar com hora (o Xavi na cabine das sete às seis, a Ylva contando
   das sete ao meio-dia, a administração em dia útil das nove às
   cinco): fora dela, espera. A flag guarda o que aconteceu: ''
   (estava lá), 'cedo' (mais tarde, hoje) ou 'outro' (outro dia). */
function c15_esperarAbrir(flag, abre, fecha, util){
  const d = Estado.dados, h = c15_hora(d), hoje = Calendario.hoje().semanaIdx;
  const fechadoHoje = util && hoje >= 5;
  let r = '', quando = '';
  if (!fechadoHoje && h >= abre && h < fecha) r = '';
  else if (!fechadoHoje && h < abre){ c15_ate(abre); r = 'cedo'; }
  else {
    let k = 1;
    while (util && ((hoje + k) % 7) >= 5) k++;
    Relogio.viver(k * 24 - h + abre);
    r = 'outro';
    quando = k === 1 ? 'no dia seguinte' : c15_naDia(Calendario.SEMANA[(hoje + k) % 7]);
  }
  Estado.marcar(flag, r);
  Estado.marcar(flag + '_quando', quando);
  return r;
}
/* esperou alguma coisa ('cedo' ou 'outro') antes de achar quem procurava */
function c15_esperouAlgo(d, flag){ return !!d.flags[flag]; }
function c15_esperou(d, flag, cedo, outro){
  const r = d.flags[flag];
  return r === 'cedo' ? cedo : r === 'outro' ? outro.replace('{quando}', d.flags[flag + '_quando'] || 'no dia seguinte') : '';
}

/* ------------------------------------------------------------
   QUEM SABE O QUÊ
   ------------------------------------------------------------ */
function c15_eu(t){ return d => fala(d.jogador.nome, t); }
function c15_opiniao(nome){ const n = Estado.npc(nome); return n && typeof n.opiniao === 'number' ? n.opiniao : 0; }
/* a opinião só sobe com o que é bom: cena boa depois de cena melhor não derruba o que ficou */
function c15_npc(nome, op, memoria){ return () => ({nome, opiniao: Math.max(c15_opiniao(nome), op), memoria}); }
function c15_nova(id){ return () => !Historia.jaAconteceu(id); }
function c15_lista(l){ return l.length < 2 ? (l[0] || '') : l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1]; }
/* ir contar o que viu: só pra quem conhece o Xavi, que mora naquela cabine */
function c15_contar(){
  return {texto:d=>d.flags.conheceu_nair ? 'Ir contar pro Xavi e pra Ylva.' : 'Ir contar pro Xavi.',
          vai:'c15_avisou_os_dois', cond:d=>!!d.flags.conheceu_otavio};
}
/* você sabe que existe uma caminhonete branca nessa ciclovia */
function c15_sabeDaCaminhonete(d){ const f = d.flags; return !!(f.a_caminhonete_da_madrugada || f.a_caminhonete_te_viu || f.o_barracao_da_trilha || f.a_folha_da_contagem); }
/* a Ylva e o Xavi esperam a madrugada com você (só na primeira) */
function c15_comEles(d){ const f = d.flags; return !!(f.c15_espera_com_eles && f.conheceu_otavio && f.conheceu_nair && f.c15_primeira_espera); }
/* o trio que está numa Pokébola sua */
function c15_presos(){ return Estado.lendariosCapturados().filter(l => GRUPO_CAES.includes(l.dex)); }
/* quem fica pra luta: o primeiro dos três que ainda está solto */
function c15_alvoDaLuta(){ const presos = c15_presos().map(l => l.dex); return [244, 243, 245].find(x => !presos.includes(x)) || 244; }
/* o tanque de Cinnabar ficou vazio em novembro de 1996 */
function c15_tempoDoTanque(){
  const c = Calendario.hoje();
  const meses = (c.ano - 1996) * 12 + ((c.mes + 2) % 12 + 1) - 11;
  return meses >= 48 ? 'Faz quatro anos' : 'Faz quase quatro anos';
}
/* o Pokémon que dá luz, ou a lanterna */
function c15_comoLuz(){ const l = Campo.iluminar(); return l.semPilha && l.quem ? `a luz de ${nomeExib(l.quem)}` : 'a lanterna'; }

/* ============================================================
   CAPÍTULO 15 — OS TRÊS QUE CORREM  (Rotas 16–18, a ciclovia)
   ============================================================ */
CAPITULOS.push(
{
num:15, titulo:'Os Três que Correm', local:'Rotas 16–18 — a ciclovia', ambiente:'campo', nivelArea:46,
tom:'muito sombrio', entradas:C15_ABERTURAS,
inicio: d => c15_abertura(d),
/* volta a lugar de primeiro encontro vira reencontro */
desvios:{
  c15_cabine:          {se:d => Historia.jaAconteceu('c15_cabine') && d.cena !== 'c15_cabine', vai:'c15_cabine_de_novo'},
  c15_nair:            {se:d => !!d.flags.conheceu_nair && d.cena !== 'c15_nair', vai:'c15_nair_de_novo'},
  c15_vilarejo:        {se:d => Historia.jaAconteceu('c15_vilarejo') && d.cena !== 'c15_vilarejo', vai:'c15_vilarejo_de_novo'},
  c15_mirante:         {se:d => Historia.jaAconteceu('c15_mirante') && d.cena !== 'c15_mirante', vai:'c15_mirante_de_novo'},
  c15_ciclovia:        {se:d => Historia.jaAconteceu('c15_ciclovia') && d.cena !== 'c15_ciclovia', vai:'c15_ciclovia_de_novo'},
  c15_capinzal:        {se:d => Historia.jaAconteceu('c15_capinzal') && d.cena !== 'c15_capinzal', vai:'c15_capinzal_de_novo'},
  c15_ajudou_o_curral: {se:d => Historia.jaAconteceu('c15_ajudou_o_curral') && d.cena !== 'c15_ajudou_o_curral', vai:'c15_ajudou_de_novo'},
  c15_vigiou_junto:    {se:d => Historia.jaAconteceu('c15_vigiou_junto') && d.cena !== 'c15_vigiou_junto', vai:'c15_vigiou_de_novo'},
  c15_avisou_os_dois:  {se:d => Historia.jaAconteceu('c15_avisou_os_dois') && d.cena !== 'c15_avisou_os_dois', vai:'c15_cabine_de_novo'}
},
cenas:{

c15_ab_a_bicicleta:{
  texto:[
    'Tem uma locadora de bicicleta na entrada norte da ciclovia, do lado da cabine de pedágio: um contêiner pintado de azul com dezesseis bicicletas do lado de fora e uma mulher lendo revista numa cadeira de plástico.',
    'Quatrocentos o dia. Ela nem levanta pra alugar.',
    fala('a mulher da locadora', 'Capacete é mais cem e ninguém leva.'),
    c15_eu('Eu levo.'),
    'Ela levanta.',
    fala('a mulher da locadora', 'Ah.'),
    'Ela escolhe a bicicleta pra você, o que é um serviço que ela claramente não presta pra todo mundo, e escolhe a de aro vinte e seis com pneu novo.',
    fala('a mulher da locadora', 'Olha, um aviso.'),
    fala('a mulher da locadora', 'Não vai ter Pokémon. Se você tá indo pra ver Pokémon, é melhor eu te devolver os quatrocentos agora.'),
    c15_eu('Desde quando?'),
    fala('a mulher da locadora', 'Umas seis semanas. Começou lá do fim, perto do mirante, e veio subindo.'),
    'Ela volta pra cadeira de plástico.',
    fala('a mulher da locadora', 'Eu aluguei uma bicicleta em três semanas. Uma. No ano passado eu alugava trinta por dia.')
  ],
  ef:{dinheiro:-C15_BICICLETA, flag:'alugou_bicicleta',
      registrar:'Alugou bicicleta e capacete na entrada norte da ciclovia. A locadora alugou uma bicicleta em três semanas.'},
  escolhas:[
    {texto:'Pedalar a ciclovia inteira.', vai:'c15_ciclovia'},
    {texto:'Perguntar se ela viu alguma coisa nessas semanas.', vai:'c15_ab_o_que_ela_viu'},
    {texto:'Ir primeiro à cabine de pedágio.', vai:'c15_cabine'}
  ]
},

c15_ab_o_que_ela_viu:{
  texto:[
    'Ela fecha a revista e põe no colo, o que é o gesto de quem vai falar sério.',
    fala('a mulher da locadora', 'Caminhonete. Cabine dupla, branca, caçamba com lona.'),
    fala('a mulher da locadora', 'Passa de madrugada, pela ciclovia.'),
    c15_eu('Pela ciclovia? Não é proibido veículo?'),
    fala('a mulher da locadora', 'É proibido. Mas a cancela da cabine tá quebrada há nove anos e ninguém consertou porque ninguém precisava.'),
    'Ela aponta com a revista pra entrada.',
    fala('a mulher da locadora', 'Eu durmo aqui. Meu contêiner é aqui.'),
    fala('a mulher da locadora', 'Nas últimas seis semanas eu ouvi ela passar dezessete vezes. Eu conto porque acorda.')
  ],
  ef:{flag:'a_caminhonete_da_madrugada',
      npc:{nome:'a mulher da locadora', opiniao:1, viuVoce:'Te contou das dezessete passagens da caminhonete.'},
      registrar:'Uma caminhonete branca de caçamba com lona passou dezessete vezes pela ciclovia em seis semanas, de madrugada.'},
  escolhas:[
    {texto:'Pedalar a ciclovia procurando o rastro.', vai:'c15_ciclovia'},
    {texto:'Ir à cabine de pedágio.', vai:'c15_cabine'},
    {texto:'Procurar quem more por aqui.', vai:'c15_vilarejo'}
  ]
},

c15_ab_a_cabine:{
  texto:[
    'A ciclovia tem uma cabine de pedágio em cada ponta, e as duas estão desativadas desde noventa e um.',
    'A do sul, a da descida pra Fuchsia, é a que ninguém olha: vidro inteiro, cancela quebrada na posição levantada, e uma porta que não tranca.',
    'Você abre a porta porque a porta está lá.',
    'Dentro tem uma cadeira giratória sem encosto, um calendário de mil novecentos e noventa e um com uma foto de Cerulean, e poeira em tudo.',
    'Em tudo menos numa coisa.',
    'O peitoril da janela da cabine, o de dentro, na altura de quem senta, está limpo numa faixa de uns quarenta centímetros. Limpo de cotovelo.',
    'Alguém senta aqui. Regularmente. Olhando pra ciclovia.',
    'E no chão, embaixo da cadeira, tem oito bitucas de cigarro, e as oito são da mesma marca, e três delas ainda estão com o filtro branco.'
  ],
  ef:{flag:'alguem_senta_na_cabine',
      registrar:'Alguém senta na cabine de pedágio do sul, desativada, olhando a ciclovia. Oito bitucas, três recentes.',
      presagio:'De dentro da cabine dá pra ver quem entra na ciclovia. É por isso que se senta ali.'},
  escolhas:[
    {texto:'Ficar escondid{o|a} na cabine e esperar quem senta.', vai:'c15_ab_esperou_na_cabine'},
    {texto:'Andar a ciclovia agora, antes que a pessoa chegue.', vai:'c15_ciclovia'},
    {texto:'Procurar quem more por aqui e conheça a cabine.', vai:'c15_vilarejo'}
  ]
},

c15_ab_esperou_na_cabine:{
  texto:[
    'Você senta no chão da cabine, atrás do balcão, onde de fora não se vê, e espera.',
    'Espera quase duas horas. É muito tempo pra ficar em silêncio num lugar que cheira a poeira e cigarro velho.',
    'Às onze e pouco chega um homem de uns trinta e cinco anos, de calça de brim e bota, com uma garrafa térmica.',
    'Ele senta na cadeira giratória sem encosto, apoia o cotovelo no peitoril limpo, acende um cigarro e não faz mais nada.',
    'Fica quarenta minutos olhando a ciclovia vazia.',
    'Em quarenta minutos não passa ninguém, e no fim dos quarenta ele pega um caderninho do bolso de trás e anota assim mesmo: a hora, e um traço.',
    'Anota. Guarda o caderninho. Volta a olhar.'
  ],
  ef:{flag:'o_homem_do_caderninho',
      executar:()=>{ c15_ate(11); return []; },
      registrar:'Um homem senta na cabine do sul e anota num caderninho quem entra na ciclovia, até quando não entra ninguém.'},
  escolhas:[
    {texto:'Aparecer e perguntar o que ele anota.', vai:'c15_ab_perguntou_o_caderninho'},
    {texto:'Esperar ele sair e seguir ele.', vai:'c15_ab_seguiu_o_homem'},
    {texto:'Esperar ele sair e ir pra ciclovia.', vai:'c15_ciclovia'}
  ]
},

c15_ab_perguntou_o_caderninho:{
  texto:[
    'Você levanta de trás do balcão e ele quase cai da cadeira, o que é, por um segundo, engraçado.',
    c15_eu('O que você anota?'),
    'Ele se recompõe rápido demais pra alguém que levou um susto de verdade.',
    fala('o homem da cabine', 'Fluxo. Eu sou da concessionária.'),
    c15_eu('A cabine tá desativada desde noventa e um.'),
    'Silêncio.',
    fala('o homem da cabine', 'Estudo de reativação.'),
    c15_eu('Com caderninho de bolso?'),
    'Ele apaga o cigarro no peitoril, o que estraga a faixa limpa que ele mesmo mantinha.',
    fala('o homem da cabine', 'Olha, {menino|menina}. Você não tá entendendo o que tá acontecendo aqui, e é melhor assim.'),
    'Ele sai. Não corre. Desce a rampa da cabine e entra numa caminhonete branca de cabine dupla que estava estacionada atrás do mato, fora do seu campo de visão, o tempo todo.'
  ],
  ef:{flag:['assustou_o_vigia','a_caminhonete_da_madrugada'],
      registrar:'O vigia da cabine do sul foi embora numa caminhonete branca de cabine dupla escondida atrás do mato.',
      presagio:'Agora eles sabem que tem alguém perguntando.'},
  escolhas:[
    {texto:'Ir pra ciclovia agora, rápido.', vai:'c15_ciclovia'},
    {texto:'Procurar o vilarejo e avisar as pessoas.', vai:'c15_vilarejo'}
  ]
},

c15_ab_seguiu_o_homem:{
  texto:[
    'Você espera. Ele fica mais uma hora e sai perto do meio-dia, sem pressa, com a garrafa térmica vazia.',
    'Você deixa ele sair do seu campo de visão e sai atrás, pelo capinzal do lado, o que é lento e é barulhento e é a única opção.',
    'Ele anda trezentos metros pela beira da ciclovia e entra numa trilha de terra que não está em mapa nenhum, aberta por veículo, com o capim deitado nos dois lados.',
    'A trilha dá num barracão de madeira e telha de fibrocimento, com uma caminhonete branca estacionada na frente e um gerador ligado.',
    'E, encostadas na parede de fora do barracão, sob uma lona: doze gaiolas de transporte vazias e empilhadas.',
    'Vazias. Empilhadas. Limpas.',
    'Doze gaiolas limpas quer dizer que o que estava nelas já foi levado.'
  ],
  ef:{flag:['o_barracao_da_trilha','caderno_do_trafico'],
      executar:()=>{ c15_ate(12); return []; },
      registrar:'Um barracão escondido a trezentos metros da cabine do sul, com doze gaiolas de transporte vazias e limpas.',
      presagio:'Doze gaiolas limpas e empilhadas. Eles terminaram um pedaço.'},
  escolhas:[
    {texto:'Chegar mais perto do barracão.', vai:'c15_ab_o_barracao'},
    {texto:'Voltar e procurar o vilarejo.', vai:'c15_vilarejo'},
    {texto:'Voltar à cabine e ver se ele deixou alguma coisa.', vai:'c15_ab_o_caderninho'}
  ]
},

c15_ab_o_barracao:{
  texto:[
    'Você chega a uns vinte metros pelo capim, devagar, abaixad{o|a}.',
    'O gerador está ligado e não tem ninguém do lado de fora. O homem da cabine entrou, e a porta fechou atrás dele.',
    'A caminhonete está com a caçamba vazia e a lona dobrada em cima, e a caçamba tem palha no canto e um cheiro que você conhece de Centro Pokémon em dia cheio.',
    'A parede do barracão é de tábua, e tábua tem fresta.',
    'Pela fresta dá pra ver uma mesa de cavalete, uma balança de plataforma e uma caixa de papelão cheia de Pokébolas das baratas, de atacado, ainda no plástico.',
    'Na parede do fundo, presa com prego, tem uma folha com uma tabela: dia, hora, número de lote.',
    'E uma última coluna com a mesma palavra em todas as linhas, escrita pela mesma mão:',
    '**CAIS**',
    'Lá dentro alguém liga um rádio. Você sai do jeito que chegou, pelo capim, e não olha pra trás até a ciclovia.'
  ],
  ef:{flag:'o_barracao_por_dentro',
      rep:{eixo:'bom',delta:1,motivo:'Chegou perto do barracão das gaiolas'},
      registrar:'No barracão há uma balança, Pokébolas de atacado e uma tabela de lotes. O destino de todos é o cais.'},
  escolhas:[
    {texto:'Ir pra ciclovia.', vai:'c15_ciclovia'},
    {texto:'Procurar o vilarejo e contar.', vai:'c15_vilarejo'},
    {texto:'Voltar à cabine e ver se ele deixou alguma coisa.', vai:'c15_ab_o_caderninho'}
  ]
},

c15_ab_o_caderninho:{
  texto:[
    'O caderninho não ficou na cabine. Claro que não ficou.',
    'Mas ficou outra coisa, e essa você não esperava: embaixo da cadeira giratória, junto com as oito bitucas, tem uma folha amassada e jogada fora.',
    'É uma folha arrancada do caderninho. Ele arrancou e amassou e jogou porque errou alguma coisa e refez.',
    'Você desamassa.',
    'É uma tabela. Três colunas: data, trecho e um número.',
    d=>`**${c15_num(c15_data(d, 9))} — km 7 ao 5 — 31**`,
    d=>`**${c15_num(c15_data(d, 6))} — km 5 ao 3 — 27**`,
    d=>`**${c15_num(c15_data(d, 3))} — km 3 ao 2 — 22**`,
    'Eles estão contando quantos tiraram de cada pedaço da ciclovia. E o quilômetro zero é a cabine do norte, na outra ponta.',
    d=>`E na quarta linha, a que ele errou e refez, está escrito: ${c15_num(c15_data(d, 0))} — km 2 ao 0 — e o número está em branco.`,
    d=>`Hoje é dia ${c15_dia({dia:Calendario.hoje().diaMes})}.`
  ],
  ef:{flag:['a_folha_da_contagem','caderno_do_trafico'],
      registrar:'Uma folha arrancada do caderninho: 31, 27 e 22 Pokémon tirados de três pedaços da ciclovia, subindo pro norte. O último pedaço, do quilômetro dois à cabine do norte, é hoje.',
      presagio:'A quarta linha está em branco porque o trabalho é hoje. Você não chegou tarde: você chegou junto.'},
  escolhas:[
    {texto:'Ir pro quilômetro dois. Agora.', vai:'c15_ciclovia'},
    {texto:'Procurar o vilarejo e juntar gente primeiro.', vai:'c15_vilarejo'}
  ]
},

c15_ab_a_caminhonete:{
  texto:[
    'Você está na ciclovia no quilômetro três quando ouve motor atrás de você, e motor na ciclovia é uma frase que não devia existir.',
    'Caminhonete branca de cabine dupla, caçamba com lona, vindo do norte, no meio do asfalto onde não cabe caminhonete.',
    'Você pula pro acostamento de brita. Ela passa a uns sessenta, a dois metros de você, e não desacelera nem um pouco.',
    'Dois homens na cabine. O do carona olha pra você pelo retrovisor de porta por uns quatro segundos, e você vê ele te olhando, e ele vê você vendo.',
    'A caminhonete continua e some na curva do quilômetro cinco.',
    'A lona da caçamba estava mal amarrada de um lado e balançava, e no balanço dava pra ver o que tinha embaixo: metal quadriculado.',
    'Grade.'
  ],
  ef:{flag:'a_caminhonete_te_viu', hp:-1, causa:'Pulou pro acostamento de brita',
      registrar:'Uma caminhonete branca com gaiolas na caçamba passou por você na ciclovia, descendo pro sul. O carona te viu.',
      presagio:'Ele te olhou por quatro segundos pelo retrovisor. Quatro segundos é tempo de decorar uma cara.'},
  escolhas:[
    {texto:'Seguir a caminhonete pela ciclovia.', vai:'c15_ciclovia'},
    {texto:'Voltar à cabine de pedágio e ver de onde ela saiu.', vai:'c15_cabine'},
    {texto:'Procurar quem more por aqui e avisar.', vai:'c15_vilarejo'}
  ]
},

c15_ab_de_cracha:{
  texto:[
    'A ciclovia das Rotas 16 a 18 é área de concessão pública, e área de concessão pública tem um livro de ocorrências, e o livro de ocorrências fica numa gaveta da administração em Fuchsia.',
    d=>{
      const c = Cargos.doCracha();
      return `Com o crachá de ${c ? c.nome : 'serviço'}, a moça da administração — crachá de plástico no cordão, Lina, sete anos de casa — te entrega o livro sem pedir ofício, o que provavelmente é irregular e é a coisa mais útil que te aconteceu no mês.`;
    },
    'O livro tem uma ocorrência por página, e as páginas são quase todas de coisas pequenas: guarda-corpo amassado, buraco no asfalto, ciclista com torção de tornozelo.',
    'As últimas seis semanas têm onze ocorrências, e as onze são a mesma frase escrita por seis pessoas diferentes:',
    '**"Usuário relata ausência de fauna no trecho."**',
    'Onze relatos. E, na coluna de providência, onze vezes a mesma palavra: "aguardando".',
    fala('Lina', 'Aguardando o quê, né.'),
    'Ela fala isso sem você perguntar.'
  ],
  ef:{flag:'o_livro_de_ocorrencias',
      registrar:'Onze ocorrências em seis semanas relatam ausência de fauna na ciclovia. Todas com providência "aguardando".'},
  escolhas:[
    {texto:'Perguntar quem escreve "aguardando".', vai:'c15_ab_quem_escreve'},
    {texto:'Pedir cópia das onze e ir pra ciclovia.', vai:'c15_ab_copia_das_onze'},
    {texto:'Ir direto pra ciclovia.', vai:'c15_rotas'}
  ]
},

c15_ab_quem_escreve:{
  texto:[
    fala('Lina', 'A providência quem preenche é a chefia.'),
    c15_eu('E a chefia é quem?'),
    'Ela vira o livro e aponta a rubrica no pé da página. É uma rubrica só, repetida onze vezes, feita com a mesma caneta.',
    fala('Lina', 'Superintendente da concessão. Ele vem aqui duas vezes por mês.'),
    fala('Lina', 'E ele assinou as onze no mesmo dia.'),
    c15_eu('Como você sabe?'),
    d=>fala('Lina', `Porque eu protocolei as onze em datas diferentes, e as onze ficaram sem providência até o dia ${c15_dia(c15_data(d, C15_ASSINOU))}.`),
    'Ela fecha o livro.',
    d=>fala('Lina', `No dia ${c15_dia(c15_data(d, C15_ASSINOU))} ele veio, sentou nessa cadeira, e assinou as onze de uma vez, em três minutos, sem ler nenhuma.`, 'baixo')
  ],
  ef:{flag:'a_rubrica_do_superintendente',
      npc:{nome:'Lina', opiniao:2, viuVoce:'Te mostrou que as onze providências foram assinadas de uma vez.'},
      registrar:d=>`O superintendente da concessão assinou as onze ocorrências de uma vez, sem ler, no dia ${c15_ext(c15_data(d, C15_ASSINOU))}.`},
  escolhas:[
    {texto:'Pedir cópia das onze.', vai:'c15_ab_copia_das_onze'},
    {texto:'Ir pra ciclovia.', vai:'c15_rotas'}
  ]
},

c15_ab_copia_das_onze:{
  texto:[
    'Ela tira as cópias na máquina da sala do lado, que faz um barulho de avião, e as onze folhas saem quentes.',
    'Ela carimba cada uma com o carimbo de "confere com o original" e assina embaixo do carimbo.',
    fala('Lina', 'Não precisava carimbar.'),
    c15_eu('Então por que carimbou?'),
    fala('Lina', 'Porque sem carimbo é fotocópia e com carimbo é documento.'),
    'Ela empilha, bate na mesa pra alinhar, e entrega.',
    fala('Lina', 'Eu trabalho aqui há sete anos e é a primeira vez que alguém vem pedir esse livro.'),
    fala('Lina', 'Eu reli as onze enquanto a máquina esquentava.'),
    fala('Lina', 'Onze pessoas diferentes escreveram a mesma coisa e ninguém foi lá ver.', 'baixo')
  ],
  ef:{flag:['copia_das_onze_ocorrencias','reika_precisa_de_papel'],
      npc:{nome:'Lina', opiniao:3, viuVoce:'Carimbou as onze cópias como conferidas com o original.'},
      registrar:'Tem onze ocorrências carimbadas como documento: ausência de fauna na ciclovia, providência "aguardando".'},
  escolhas:[
    {texto:'Ir pra ciclovia.', vai:'c15_rotas'},
    {texto:'Ir direto ao vilarejo da ciclovia.', vai:'c15_vilarejo'}
  ]
},


c15_rotas:{
  texto:[
    'As Rotas 16, 17 e 18 formam a única sequência de Kanto que a gente atravessa de bicicleta.',
    'É uma ciclovia de asfalto de dezenove quilômetros, descendo de Celadon até Fuchsia, construída em mil novecentos e oitenta e quatro, com guarda-corpo dos dois lados e uma cabine de pedágio em cada ponta, onde ninguém cobra pedágio há nove anos.',
    'De um lado, o mar. Do outro, capinzal alto até onde a vista alcança.',
    'É bonito de um jeito banal e é o trecho mais tranquilo de Kanto.',
    'Foi o trecho mais tranquilo de Kanto.',
    d=>d.flags.c15_rotas_do_sul
      ? 'Você entra pela ponta de Fuchsia, pela cabine do sul, às sete da manhã, e sobe. A primeira coisa que te incomoda leva vinte minutos pra virar pensamento:'
      : 'Você entra pela cabine de pedágio do norte às sete da manhã, e no primeiro quilômetro tem Pokémon demais: Rattata em cima de Rattata no capim da beira, um bando inteiro de Spearow num poste só, todo mundo apertado no mesmo pedaço de chão e ninguém brigando.',
    d=>d.flags.c15_rotas_do_sul ? 'não tem Pokémon.' : 'Depois do segundo quilômetro, não tem mais nenhum.',
    'Nada. Nem Spearow no poste, nem Rattata no capim, nem Doduo correndo paralelo à ciclovia, que é a coisa mais clássica que acontece nessa estrada e que vem em todo folheto turístico de Fuchsia.',
    'Capinzal com fruta madura, quilômetro atrás de quilômetro, e nenhum Pokémon comendo.'
  ],
  ef:{registrar:d=>['fuchsia','sul'].includes(c15_onde(d))
        ? 'A ciclovia das Rotas 16 a 18 está vazia de Pokémon.'
        : 'A ciclovia das Rotas 16 a 18 está vazia de Pokémon, menos no comecinho do norte, onde tem Pokémon demais, apertado.',
      /* de Fuchsia (a administração, a cabine do sul) a ciclovia começa
         pela ponta sul; de manhã, que é quando se entra nela */
      executar:d=>{
        const doSul = ['fuchsia','sul'].includes(c15_onde(d));
        Estado.marcar('c15_rotas_do_sul', doSul);
        c15_ate(7);
        Estado.marcar('c15_onde', doSul ? 'sul' : 'norte');
        return []; },
      presagio:'Capim alto, fruta madura, e nada. Isso não é caça: caça deixa sobra.'},
  escolhas:[
    {texto:'Andar a ciclovia inteira e procurar o motivo.', vai:'c15_ciclovia'},
    {texto:'Procurar alguém que more aqui.', vai:'c15_vilarejo'},
    {texto:d=>d.flags.c15_rotas_do_sul ? 'Ir até a cabine de pedágio do norte, do outro lado.' : 'Voltar à cabine de pedágio e ver se tem alguém nela.', vai:'c15_cabine'},
    {texto:'Sair da ciclovia e entrar no capinzal.', vai:'c15_capinzal'}
  ]
},

/* ─────────────── O XAVI, NA CABINE DO NORTE ─────────────── */

c15_cabine:{
  texto:[
    d=>c15_esperou(d, 'c15_espera_xavi',
      'A cabine de pedágio do norte ainda está fechada. Você espera sentad{o|a} no guarda-corpo até um homem chegar de bicicleta, abrir a porta com chave própria e sentar lá dentro.',
      'A cabine de pedágio do norte está fechada, sem ninguém. Você volta {quando}, às sete, e tem um homem chegando de bicicleta, abrindo a porta com chave própria.'),
    'A cabine de pedágio do norte é um cubo de concreto de dois por dois, com uma janela de vidro quebrada e um banco de madeira que não é da cabine: alguém trouxe.',
    'E tem alguém dentro.',
    'Um homem de uns sessenta anos, de camisa de botão, sentado no banco com um caderno de capa dura no colo e um binóculo pendurado no pescoço.',
    'Na capa do caderno, numa etiqueta de plástico: **LEVANTAMENTO DE FAUNA — ROTAS 16 A 18 — XAVI E YLVA.**',
    'Ele te vê chegando e continua escrevendo até terminar a linha, do jeito que faz quem anota coisa com horário.',
    fala('Xavi', 'Bom dia. Você é o quê?'),
    c15_eu('Como assim?'),
    fala('Xavi', 'Você é ciclista, pesquisador, turista ou treinador? São os quatro que passam aqui.'),
    c15_eu('{Treinador|Treinadora}.'),
    'Ele anota.',
    d=>fala('Xavi', `${c15_horaFalada(d)}. {Treinador|Treinadora}. {Um|Uma}.`),
    'E aí ele fecha o caderno e olha pra você por cima dos óculos.',
    d=>fala('Xavi', `Você é {o terceiro|a terceira} em ${porExtenso(19 + c15_passados(d))} dias. Três semanas atrás passavam quarenta e um por dia.`)
  ],
  ef:{flag:'conheceu_otavio',
      npc:c15_npc('Xavi', 1, 'Anota tudo o que passa pela cabine de pedágio do norte, com horário.'),
      registrar:'Na cabine de pedágio do norte, o Xavi anota quem passa: três pessoas em três semanas, onde passavam quarenta e uma por dia.',
      executar:d=>{
        c15_ir(d, 'norte');
        const esperou = c15_esperarAbrir('c15_espera_xavi', 7, 18);
        Estado.marcar('c15_xavi_hora', c15_hora(d) * 60 + (esperou ? 0 : Relogio.minutos()));
        return []; }},
  escolhas:[
    {texto:'"Por que você anota?"', vai:'c15_porque_anota'},
    {texto:'"O que aconteceu com os Pokémon?"', vai:'c15_o_que_aconteceu'},
    {texto:'"Quem foram os outros dois?"', vai:'c15_o_terceiro'},
    {texto:'"E a caminhonete branca?"', vai:'c15_a_caminhonete', cond:c15_sabeDaCaminhonete},
    {texto:'Agradecer e seguir a ciclovia.', vai:'c15_ciclovia'}
  ]
},

/* a cabine, de novo: o Xavi anota você outra vez, e as perguntas que faltam */
c15_cabine_de_novo:{
  repetivel:true,
  texto:[
    d=>c15_esperou(d, 'c15_espera_xavi_de_novo',
      'A cabine ainda está fechada. Você espera no guarda-corpo até o Xavi chegar de bicicleta, às sete.',
      'A cabine está fechada, sem ninguém. Você volta {quando}, às sete, e o Xavi está chegando de bicicleta.'),
    'O Xavi levanta a mão sem tirar o olho da estrada, termina a linha, e só então olha.',
    fala('Xavi', 'Você de novo. Anotado.', null, 'Ele anota mesmo.'),
    d=>d.flags.conheceu_nair && c15_hora(d) >= 12 ? 'A Ylva está sentada do lado dele, numa cadeirinha de praia, passando a limpo a prancheta do dia.' : ''
  ],
  ef:{executar:d=>{ c15_ir(d, 'norte'); c15_esperarAbrir('c15_espera_xavi_de_novo', 7, 18); return []; }},
  escolhas:[
    {texto:'"Por que você anota?"', vai:'c15_porque_anota', cond:c15_nova('c15_porque_anota')},
    {texto:'"O que aconteceu com os Pokémon?"', vai:'c15_o_que_aconteceu', cond:c15_nova('c15_o_que_aconteceu')},
    {texto:'"Me mostra os últimos meses."', vai:'c15_os_ultimos_meses', cond:d=>!!d.flags.sabe_que_foram_embora && !Historia.jaAconteceu('c15_os_ultimos_meses')},
    {texto:'"E o que veio do sul?"', vai:'c15_o_que_veio_do_sul', cond:d=>!!d.flags.sabe_que_foram_embora && !Historia.jaAconteceu('c15_o_que_veio_do_sul')},
    {texto:'"Qual é o trajeto deles?"', vai:'c15_o_trajeto', cond:d=>!!d.flags.sabe_dos_tres && !Historia.jaAconteceu('c15_o_trajeto')},
    {texto:'"Quem foram os outros dois?"', vai:'c15_o_terceiro', cond:c15_nova('c15_o_terceiro')},
    {texto:'"E a caminhonete branca?"', vai:'c15_a_caminhonete', cond:d=>c15_sabeDaCaminhonete(d) && !Historia.jaAconteceu('c15_a_caminhonete')},
    {texto:'"E a Ylva?"', vai:'c15_a_nair', cond:c15_nova('c15_a_nair')},
    {texto:'Contar o que você viu na estrada.', vai:'c15_avisou_os_dois', cond:d=>!Historia.jaAconteceu('c15_avisou_os_dois') && !!(d.flags.viu_o_vilarejo || d.flags.viu_o_mirante || d.flags.achou_a_trilha || d.flags.viu_os_tres)},
    {texto:'Seguir a ciclovia.', vai:'c15_ciclovia'}
  ]
},

c15_porque_anota:{
  texto:[
    c15_eu('Por que você anota?'),
    fala('Xavi', 'Porque eu e a minha mulher fazemos levantamento de fauna dessas rotas desde mil novecentos e oitenta e sete.'),
    'Ele abre o caderno numa página qualquer e vira pra você.',
    'É uma tabela feita à mão, com régua, com coluna de data, hora, trecho, espécie e quantidade.',
    'Milhares de linhas.',
    c15_eu('Treze anos?'),
    fala('Xavi', 'Treze anos de um levantamento voluntário que a gente manda pra Comissão todo mês de janeiro e que ninguém lê.'),
    c15_eu('Como você sabe que ninguém lê?'),
    'Ele ri.',
    fala('Xavi', 'Porque em noventa e um eu mandei com um erro de propósito. Eu escrevi que tinha uma população de cento e vinte Lapras no trecho dezessete.'),
    c15_eu('Lapras em capinzal?'),
    fala('Xavi', 'Lapras em capinzal, {meu jovem|minha jovem}, no meio do mato, cento e vinte deles.'),
    'Ele fecha o caderno.',
    fala('Xavi', 'Nove anos, e ninguém nunca me ligou.')
  ],
  ef:{flag:['sabe_do_levantamento','otavio_confia'],
      npc:c15_npc('Xavi', 4, 'Faz levantamento de fauna desde 1987 e provou em 1991 que ninguém lê.'),
      rep:{eixo:'bom',delta:2,motivo:'Perguntou por que ele anota'},
      registrar:'O Xavi e a mulher fazem levantamento de fauna das Rotas 16 a 18 desde 1987.',
      presagio:'Treze anos de dado bom que ninguém leu. Você acabou de virar a primeira pessoa a ler.'},
  escolhas:[
    {texto:'"Me mostra os últimos meses."', vai:'c15_os_ultimos_meses', cond:c15_nova('c15_os_ultimos_meses')},
    {texto:'"O que aconteceu com os Pokémon?"', vai:'c15_o_que_aconteceu', cond:c15_nova('c15_o_que_aconteceu')},
    {texto:'"E a Ylva?"', vai:'c15_a_nair', cond:c15_nova('c15_a_nair')},
    {texto:'Seguir a ciclovia.', vai:'c15_ciclovia'}
  ]
},

c15_o_que_aconteceu:{
  texto:[
    c15_eu('O que aconteceu com os Pokémon?'),
    'Ele não hesita.',
    fala('Xavi', 'Foram embora.'),
    c15_eu('Morreram?'),
    fala('Xavi', 'Não. Foram embora. Tem diferença, e a diferença é a única coisa importante desse assunto.'),
    'Ele bate no caderno.',
    fala('Xavi', 'Se morressem, a gente achava. Pokémon morto fica. Tem Murkrow, tem cheiro, tem osso.'),
    fala('Xavi', 'A gente andou os dezenove quilômetros da ciclovia e o mato dos dois lados em oito dias, eu e a Ylva, e achou dois Pokémon mortos, que é o número normal de atropelamento.'),
    c15_eu('Então eles andaram.'),
    fala('Xavi', 'Eles andaram. E andaram todos pro mesmo lado, que é o que me tira o sono.'),
    c15_eu('Pra que lado?'),
    'Ele aponta com o queixo pra cima da ciclovia, pra onde ela sobe.',
    fala('Xavi', 'Norte.')
  ],
  ef:{flag:['sabe_que_foram_embora','sabe_que_foi_norte'],
      rep:{eixo:'bom',delta:3,motivo:'Perguntou e a resposta veio com método'},
      registrar:'A fauna da ciclovia não morreu: foi toda embora pro norte, em poucas semanas.',
      presagio:'Todos pro mesmo lado. Pokémon não combina direção. Pokémon foge da mesma coisa.'},
  escolhas:[
    {texto:'"Me mostra os últimos meses."', vai:'c15_os_ultimos_meses', cond:c15_nova('c15_os_ultimos_meses')},
    {texto:'"E o que veio do sul?"', vai:'c15_o_que_veio_do_sul', cond:c15_nova('c15_o_que_veio_do_sul')},
    {texto:'"E a Ylva?"', vai:'c15_a_nair', cond:c15_nova('c15_a_nair')},
    {texto:'Seguir a ciclovia.', vai:'c15_ciclovia'}
  ]
},

c15_os_ultimos_meses:{
  texto:[
    'Ele te dá o caderno e vai encher a garrafa térmica na bica, porque ele quer que você leia sozinh{o|a}.',
    'Você lê quase uma hora.',
    'E a coisa aparece sozinha, sem você procurar, porque ele fez uma tabela boa:',
    d=>`em ${c15_mes(d, 2)}, o trecho 18 — o mais ao sul, o do mirante, de frente pro mar de Cinnabar — zera.`,
    d=>`Em ${c15_mes(d, 1)}, zera o 17.`,
    d=>`Em ${c15_mes(d, 0)}, o 16 começa a cair, e está quase no zero.`,
    'Não é um esvaziamento: é uma frente.',
    'Uma linha se movendo de sul pra norte a uma velocidade de mais ou menos um trecho por mês, empurrando tudo na frente dela.',
    d=>d.flags.mediu_o_ciclo ? 'Você pega o lápis do caderno e faz a conta na margem, do jeito que você aprendeu a fazer numa encosta olhando uma usina.' : 'Você pega o lápis do caderno e faz a conta na margem.',
    'Um trecho por mês, e o dezesseis é o último.',
    'Depois dele vem a cabine, e depois da cabine vem Celadon.'
  ],
  ef:{flag:'viu_a_frente',
      executar:()=>{ Relogio.avancar(1); return []; },
      rep:{eixo:'bom',delta:5,motivo:'Leu treze anos de tabela e achou a frente'},
      instabilidade:1,
      registrar:'A fauna some de sul pra norte, um trecho por mês. O dezesseis é o último da ciclovia; depois dele vem Celadon.',
      presagio:d=>d.flags.mediu_o_ciclo ? 'Um trecho por mês. Você já fez conta assim, numa encosta, e ela deu quarenta dias.' : 'Um trecho por mês. Conta de frente que avança não erra.'},
  escolhas:[
    {texto:'"E o que veio do sul?"', vai:'c15_o_que_veio_do_sul', cond:c15_nova('c15_o_que_veio_do_sul')},
    {texto:'Mostrar a conta pro Xavi.', vai:'c15_mostrou_a_conta'},
    {texto:'"E a Ylva?"', vai:'c15_a_nair', cond:c15_nova('c15_a_nair')},
    {texto:'Ir pro capinzal ver rastro.', vai:'c15_capinzal'}
  ]
},

c15_mostrou_a_conta:{
  texto:[
    'Ele volta com a garrafa térmica e você mostra a margem.',
    'Ele lê. Põe os óculos. Lê de novo.',
    'E faz uma coisa que velho que anota há treze anos faz: ele confere a sua conta com a régua, trecho por trecho, em silêncio, por quatro minutos.',
    fala('Xavi', 'Tá certo.'),
    'Ele senta no banco de madeira.',
    d=>fala('Xavi', `Eu vi isso em ${c15_mes(d, 1)}.`),
    c15_eu('Você viu e não falou nada?'),
    fala('Xavi', 'Eu falei.', null, 'Ele bebe café.'),
    fala('Xavi', 'Eu peguei o ônibus até Fuchsia, entrei no posto da Liga e falei com a oficial.'),
    c15_eu('E?'),
    fala('Xavi', 'E ela me ouviu por quarenta minutos, anotou tudo, foi ótima, e no fim me disse a verdade: que migração de fauna não é competência da Liga, é da Comissão, e que a Comissão tem um canal de denúncia que é um formulário.'),
    'Ele olha o caderno.',
    fala('Xavi', 'Eu mando formulário pra Comissão desde oitenta e sete, {meu jovem|minha jovem}.')
  ],
  ef:{flag:'otavio_avisou',
      npc:c15_npc('Xavi', 6, 'Já tinha visto a frente um mês antes e já tinha avisado a Liga e a Comissão.'),
      rep:{eixo:'bom',delta:3,motivo:'Mostrou a conta a quem já tinha feito ela'},
      registrar:'O Xavi avisou a Liga um mês antes. Migração de fauna não é competência da Liga.',
      presagio:'Ele já tinha avisado. Todo mundo nessa história já avisou alguém.'},
  escolhas:[
    {texto:'"E o que veio do sul?"', vai:'c15_o_que_veio_do_sul', cond:c15_nova('c15_o_que_veio_do_sul')},
    {texto:'"E a Ylva?"', vai:'c15_a_nair', cond:c15_nova('c15_a_nair')},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Ir ao vilarejo da Rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_o_que_veio_do_sul:{
  texto:[
    c15_eu('E o que veio do sul?'),
    'O Xavi fecha o caderno com as duas mãos.',
    fala('Xavi', 'Essa é a pergunta.'),
    c15_eu('E a resposta?'),
    fala('Xavi', 'Três.'),
    'Ele levanta três dedos.',
    fala('Xavi', 'Três coisas que a gente não consegue identificar, que passam pela estrada de madrugada, sempre em fila, sempre no mesmo trajeto, e que fazem o chão vibrar antes de a gente ouvir.'),
    c15_eu('Você viu?'),
    fala('Xavi', 'Eu vi duas vezes, de longe, com binóculo, e nas duas eu tava com tanto medo que não consegui segurar o binóculo firme.'),
    'Ele passa a mão no rosto.',
    fala('Xavi', 'A Ylva viu quatro vezes. Ela tem a mão mais firme.'),
    c15_eu('E ela identificou?'),
    fala('Xavi', 'Ela desenhou.'),
    'Ele abre o caderno na contracapa.',
    'Tem três desenhos a lápis, feitos por alguém que desenha bem por prática e não por talento.',
    'Você reconhece os três de livro, de uma página sobre Johto que ninguém achava que fosse servir pra nada em Kanto: Raikou, Entei e Suicune.',
    'Ele não sabe o nome de nenhum.'
  ],
  ef:{flag:['sabe_dos_tres','otavio_viu'],
      npc:c15_npc('Xavi', 5, 'Viu os três duas vezes com binóculo e a mão tremendo.'),
      rep:{eixo:'bom',delta:3,motivo:'Perguntou o que veio, em vez do que foi'},
      instabilidade:1,
      registrar:'Três lendários de Johto — Raikou, Entei e Suicune — passam pela ciclovia de madrugada, em fila, no mesmo trajeto.',
      presagio:'Sempre o mesmo trajeto. Isso é ronda, não migração.'},
  escolhas:[
    {texto:'"E a Ylva?"', vai:'c15_a_nair', cond:c15_nova('c15_a_nair')},
    {texto:'"Qual é o trajeto deles?"', vai:'c15_o_trajeto', cond:c15_nova('c15_o_trajeto')},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Ir pro vilarejo da Rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_a_nair:{
  texto:[
    c15_eu('E a Ylva?'),
    'Ele olha o relógio.',
    fala('Xavi', 'A minha mulher. Tá no trecho dezessete, contando.'),
    fala('Xavi', 'Ela conta a estrada de manhã, do vilarejo até o mirante, e eu fico na cabine. No fim da tarde ela passa aqui e a gente vai embora junto.'),
    c15_eu('Ela anda sozinha numa estrada vazia, com três coisas dessas passando?'),
    fala('Xavi', 'Ela anda sozinha nessas rotas há trinta e um anos, {meu jovem|minha jovem}, e ela tem sessenta e três, e eu já tentei convencer ela de tudo na vida e nunca consegui de nada.'),
    'Ele olha a estrada.',
    fala('Xavi', 'E ela diz uma coisa que eu não consigo rebater.'),
    c15_eu('O quê?'),
    fala('Xavi', 'Que se a gente parar de contar agora, ninguém vai ter contado o que aconteceu enquanto aconteceu.'),
    'Ele guarda o caderno na sacola.',
    fala('Xavi', 'Ela diz que o levantamento não é pra ninguém ler hoje. É pra alguém poder ler daqui a cinquenta anos.')
  ],
  ef:{flag:'sabe_da_nair',
      npc:c15_npc('Xavi', 5, 'A mulher dele, a Ylva, conta a estrada sozinha toda manhã.'),
      rep:{eixo:'bom',delta:2,motivo:'Perguntou onde ela estava'},
      moral:8,
      registrar:'A Ylva conta a estrada sozinha toda manhã, do vilarejo até o mirante. Anda nessas rotas há trinta e um anos.'},
  escolhas:[
    {texto:'Ir até o trecho 17 encontrar ela.', vai:'c15_nair'},
    {texto:'"Qual é o trajeto dos três?"', vai:'c15_o_trajeto', cond:d=>!!d.flags.sabe_dos_tres && !Historia.jaAconteceu('c15_o_trajeto')},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Ir pro vilarejo da Rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_o_terceiro:{
  texto:[
    c15_eu('Quem foram os outros dois?'),
    'Ele confere o caderno.',
    d=>fala('Xavi', `Uma moça de bicicleta, ${c15_faz(d, C15_MOCA)}, que voltou em quarenta minutos e disse que tinha esquecido uma coisa.`),
    'Ele vira a página.',
    d=>fala('Xavi', `E um homem de terno, ${c15_faz(d, C15_TERNO)}, de carro, que desceu os dezenove quilômetros, ficou quarenta minutos no mirante do trecho dezoito e voltou.`),
    c15_eu('Homem de terno, de carro, numa ciclovia?'),
    fala('Xavi', 'Carro não pode entrar na ciclovia. Ele entrou pela estrada de manutenção, que tem uma corrente com cadeado, e o cadeado é da Comissão.'),
    'Ele fecha o caderno.',
    fala('Xavi', 'Eu anotei a placa porque eu anoto tudo.')
  ],
  ef:{flag:['sabe_do_homem_de_terno','placa_do_terno'],
      itens:{'Placa anotada num canto de caderno':1},
      npc:c15_npc('Xavi', 4, 'Anotou a placa de um carro da Comissão que ficou quarenta minutos no mirante do trecho 18.'),
      rep:{eixo:'bom',delta:3,motivo:'Perguntou quem mais tinha passado'},
      registrar:d=>`No dia ${c15_ext(c15_data(d, C15_TERNO))}, um carro que entrou pelo cadeado da Comissão ficou quarenta minutos no mirante do trecho 18.`,
      presagio:d=>d.flags.sabe_dos_tres ? 'O mirante do trecho 18 é de onde se vê Cinnabar. Ele foi olhar a mesma coisa que os três.' : 'O mirante do trecho 18 é de onde se vê Cinnabar.'},
  escolhas:[
    {texto:'"Qual é o trajeto deles?"', vai:'c15_o_trajeto', cond:d=>!!d.flags.sabe_dos_tres && !Historia.jaAconteceu('c15_o_trajeto')},
    {texto:'"O que aconteceu com os Pokémon?"', vai:'c15_o_que_aconteceu', cond:c15_nova('c15_o_que_aconteceu')},
    {texto:'"E a Ylva?"', vai:'c15_a_nair', cond:c15_nova('c15_a_nair')},
    {texto:'Ir até o mirante do trecho 18.', vai:'c15_mirante'}
  ]
},

c15_a_caminhonete:{
  texto:[
    c15_eu('E a caminhonete branca?'),
    'Ele não precisa abrir o caderno pra essa.',
    fala('Xavi', 'Cabine dupla, caçamba com lona. Passa de madrugada, e de dia quando acha que ninguém olha.'),
    fala('Xavi', 'Ela não esvaziou nada, {meu jovem|minha jovem}. Ela vem atrás.'),
    c15_eu('Atrás de quê?'),
    fala('Xavi', 'Os Pokémon tão indo embora pro norte, um pedaço da ciclovia por vez. O que sobra corre pra frente e se aperta no pedaço que ainda tem capim com gente dentro.'),
    fala('Xavi', 'E apertado é fácil.'),
    'Ele aponta com a caneta pro primeiro quilômetro, onde o capim da beira está cheio demais.',
    fala('Xavi', 'Eu mandei a placa pra Comissão na primeira semana. Formulário.'),
    'Ele não precisa dizer o resto.'
  ],
  ef:{flag:'sabe_que_vem_atras_da_frente',
      npc:c15_npc('Xavi', 3, 'Te contou que a caminhonete branca vem atrás dos Pokémon que fogem, catando o que sobra.'),
      registrar:'A caminhonete branca não esvazia a ciclovia: vem atrás, e pega o que sobra apertado na ponta norte.'},
  escolhas:[
    {texto:'"O que aconteceu com os Pokémon?"', vai:'c15_o_que_aconteceu', cond:c15_nova('c15_o_que_aconteceu')},
    {texto:'"Por que você anota?"', vai:'c15_porque_anota', cond:c15_nova('c15_porque_anota')},
    {texto:'Esperar a caminhonete no começo da ciclovia, onde ainda tem Pokémon.', vai:'c15_o_quilometro_dois', cond:c15_nova('c15_o_quilometro_dois')},
    {texto:'Seguir a ciclovia.', vai:'c15_ciclovia'}
  ]
},

c15_o_trajeto:{
  texto:[
    c15_eu('Qual é o trajeto deles?'),
    'O Xavi tira do bolso um mapa da ciclovia dobrado em oito — um mapa turístico, desses que a prefeitura de Fuchsia imprime, com desenho de Doduo no canto.',
    'E em cima do mapa turístico, a lápis, tem uma linha traçada à mão.',
    'A linha sai do mirante do trecho dezoito, sobe pelo capinzal paralelo à ciclovia até o meio do dezesseis, atravessa pro lado do mar, desce de volta pelo litoral até o mirante, e fecha.',
    'É um circuito.',
    'Um circuito fechado de uns trinta e quatro quilômetros, sempre no mesmo sentido, nas madrugadas em que eles vêm.',
    c15_eu('Quantas vezes por noite?'),
    fala('Xavi', 'Duas. Às vezes três.'),
    'Você olha o desenho por um tempo e aí entende o que ele desenhou sem saber que estava desenhando.',
    'A linha não é uma rota de caça. É um perímetro.',
    'E no meio do perímetro não tem nada.',
    'Mas na ponta sul dele, do outro lado de trinta quilômetros de mar, tem uma ilha com um vulcão.'
  ],
  ef:{flag:['sabe_do_circuito','caes_olham_cinnabar'],
      itens:{'Mapa da ciclovia com o circuito a lápis':1},
      npc:c15_npc('Xavi', 6, 'Te deu o mapa com o circuito dos três traçado a lápis.'),
      rep:{eixo:'bom',delta:5,motivo:'Olhou o desenho até entender o que era'},
      instabilidade:1,
      registrar:'Os três correm um circuito fechado de uns trinta e quatro quilômetros, duas ou três vezes por noite, nas madrugadas em que vêm, com a ponta no mirante do trecho 18.',
      presagio:'Perímetro. Eles não estão caçando nada aqui.'},
  escolhas:[
    {texto:'Ir até o mirante do trecho 18.', vai:'c15_mirante'},
    {texto:'Ir encontrar a Ylva no trecho 17.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Acampar no mirante e esperar a madrugada.', vai:'c15_esperou_a_madrugada', ef:C15_AO_MIRANTE}
  ]
},

/* ─────────────── A CAMINHONETE, NO QUILÔMETRO DOIS ─────────────── */

c15_o_quilometro_dois:{
  texto:[
    'Você espera no quilômetro dois, sentad{o|a} no guarda-corpo, do lado do capim pisado.',
    'Aqui ainda tem Pokémon, e você entende a folha olhando pra eles: Rattata, Spearow, um Doduo de pescoço baixo, uns Oddish enterrados até a folha, todo mundo espremido no último pedaço de capim antes da cabine.',
    'Eles não fogem de você. Eles não têm pra onde.',
    'A caminhonete chega no fim da tarde, devagar, pelo asfalto, com dois homens na cabine e a caçamba vazia debaixo da lona.'
  ],
  ef:{executar:d=>{ c15_ir(d, 'norte'); c15_ate(17); return []; }},
  escolhas:[
    {texto:'Espantar os Pokémon pro norte antes que eles desçam.', vai:'c15_espantou'},
    {texto:'Ficar de pé no meio da ciclovia.', vai:'c15_ficou_no_meio'},
    {texto:'Ficar escondid{o|a} e anotar a placa.', vai:'c15_anotou_a_placa'}
  ]
},

c15_espantou:{
  texto:[
    'Você levanta e entra no capim batendo palma e gritando, e não é bonito.',
    'O capim inteiro estoura: Rattata pra todo lado, o bando de Spearow subindo de uma vez, o Doduo correndo do jeito que vem no folheto, paralelo à ciclovia, só que pro lado errado.',
    'Pro norte. Pela cancela quebrada, pela beira da estrada de Celadon, pra onde ninguém vem buscar.',
    'Quando os dois homens descem da caminhonete com as redes, o capim está vazio.',
    'Eles andam o quilômetro inteiro por uma hora, devagar, e voltam com as gaiolas do jeito que trouxeram.',
    'O do carona passa por você na volta, olha, e não diz nada. A caminhonete faz a volta no asfalto e desce sem pressa.'
  ],
  ef:{flag:'espantou_antes_da_caminhonete',
      executar:()=>{ Relogio.avancar(1); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Espantou os Pokémon antes da caminhonete chegar'},
      moral:8,
      registrar:'Espantou os últimos Pokémon da ciclovia pro norte antes da caminhonete chegar. Ela voltou vazia.'},
  escolhas:[
    {texto:'Ir à cabine contar pro Xavi.', vai:'c15_cabine', cond:d=>!!d.flags.conheceu_otavio},
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir pro vilarejo da Rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_ficou_no_meio:{
  texto:[
    'Você fica de pé no meio do asfalto, na frente da caminhonete.',
    'Ela para a uns dez metros. O motor continua ligado.',
    d=>d.flags.a_caminhonete_te_viu ? 'O do carona é o mesmo do retrovisor. Ele te reconhece, e você vê ele te reconhecendo.' : 'O do carona abaixa o vidro e te olha de cima a baixo, sem pressa nenhuma.',
    fala('o homem da caminhonete', 'Ciclovia é pra bicicleta, {garoto|garota}.'),
    c15_eu('E caminhonete?'),
    'Ele ri, sobe o vidro, e o motorista engata a ré.',
    'Eles não discutem. Eles fazem a volta no asfalto e descem, devagar, e você entende que eles têm tempo, e que tempo é o que você tem menos.',
    'Mas hoje eles foram embora com a caçamba vazia.'
  ],
  ef:{flag:'parou_a_caminhonete',
      rep:{eixo:'bom',delta:3,motivo:'Ficou de pé na frente da caminhonete'},
      moral:5,
      registrar:'Ficou no meio da ciclovia na frente da caminhonete branca. Ela voltou vazia, nesse dia.'},
  escolhas:[
    {texto:'Ir à cabine contar pro Xavi.', vai:'c15_cabine', cond:d=>!!d.flags.conheceu_otavio},
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir pro vilarejo da Rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_anotou_a_placa:{
  texto:[
    'Você fica atrás do guarda-corpo, deitad{o|a} no capim, e anota a placa no braço, de caneta, quando a caminhonete para.',
    'Os dois descem com redes de cabo comprido e uma caixa de Pokébolas das baratas.',
    'Leva quarenta minutos. Eles trabalham do jeito que se trabalha em coisa que já se fez muitas vezes: um espanta pro lado do outro, o outro joga.',
    'No fim, a lona volta pra cima da caçamba, e por baixo dela tem dezenove gaiolas cheias.',
    'Um deles escreve um número num caderninho, e o outro acende um cigarro.',
    'O capim do quilômetro dois fica do jeito que está o resto da ciclovia.'
  ],
  ef:{flag:'anotou_a_placa_da_caminhonete',
      itens:{'Placa da caminhonete branca':1},
      executar:()=>{ Relogio.avancar(1); return []; },
      moral:-8,
      registrar:'Anotou a placa da caminhonete branca. Ela saiu do quilômetro dois com dezenove gaiolas cheias.'},
  escolhas:[
    {texto:'Ir à cabine contar pro Xavi.', vai:'c15_cabine', cond:d=>!!d.flags.conheceu_otavio},
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir pro vilarejo da Rota 17.', vai:'c15_vilarejo'}
  ]
},

/* ─────────────── A CICLOVIA ─────────────── */

c15_ciclovia:{
  texto:[
    d=>d.flags.alugou_bicicleta
      ? `Você pedala os dezenove quilômetros, ${d.flags.c15_desceu ? 'descendo de Celadon pra Fuchsia' : 'subindo de Fuchsia pra Celadon'}. Leva a manhã inteira, porque você para em todo banco, e você não encontra uma única pessoa.`
      : `Você anda os dezenove quilômetros, ${d.flags.c15_desceu ? 'descendo de Celadon pra Fuchsia' : 'subindo de Fuchsia pra Celadon'}. Leva quase o dia inteiro, e você não encontra uma única pessoa.`,
    'A ciclovia está limpa, o asfalto está bom, o guarda-corpo está inteiro, e a cada dois quilômetros tem um banco de concreto com uma placa de espécies parafusada em cima.',
    'As placas são bonitas. Alguém investiu nelas em oitenta e quatro: silhueta em relevo, nome da espécie e uma frase curta sobre o hábito.',
    '**"DODUO — corre paralelo a veículos. Não se aproxime da fêmea com filhote."**',
    '**"PINSIR — ativo ao amanhecer. Não alimente."**',
    'Nove placas em dezenove quilômetros, descrevendo nove espécies que não estão mais aqui.',
    'Você para na sétima e lê ela inteira duas vezes, sem motivo, e é a coisa mais triste do seu dia.',
    d=>d.flags.conheceu_otavio ? '' : 'Quando você passa pela cabine de pedágio do norte, tem um homem sentado lá dentro, num banco de madeira, com um binóculo no pescoço, anotando alguma coisa num caderno.',
    d=>d.flags.a_folha_da_contagem ? 'E no quilômetro dois, perto da cabine do norte, tem marca de pneu saindo do asfalto pro mato, e o capim da beira está pisado em roda.' : ''
  ],
  ef:{flag:'andou_a_ciclovia',
      rep:{eixo:'bom',delta:1,motivo:'Andou a ciclovia inteira'},
      hp:d=>d.flags.alugou_bicicleta ? 0 : -2, causa:'Um dia inteiro de caminhada',
      registrar:'Andou a ciclovia inteira. Nove placas descrevem espécies que não estão mais lá.',
      executar:d=>{ const para = c15_outraPonta(d); Estado.marcar('c15_desceu', para === 'sul'); c15_ir(d, para);
                    if (!d.flags.alugou_bicicleta) Relogio.avancar(1); return []; },
      presagio:'As placas continuam lá, descrevendo o que não existe mais. Ninguém desparafusa placa.'},
  escolhas:[
    {texto:'Ir até o mirante do trecho 18.', vai:'c15_mirante'},
    {texto:'Parar na cabine de pedágio do norte, onde tem alguém.', vai:'c15_cabine', cond:c15_nova('c15_cabine')},
    {texto:'Esperar no quilômetro dois a caminhonete voltar.', vai:'c15_o_quilometro_dois', cond:d=>!!d.flags.a_folha_da_contagem && !Historia.jaAconteceu('c15_o_quilometro_dois')},
    {texto:'Sair da ciclovia e entrar no capinzal.', vai:'c15_capinzal'},
    {texto:'Procurar o vilarejo da Rota 17.', vai:'c15_vilarejo'},
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'}
  ]
},

/* a ciclovia, de novo: de ponta a ponta, e as placas no mesmo lugar */
c15_ciclovia_de_novo:{
  repetivel:true,
  texto:[
    d=>`Você ${d.flags.alugou_bicicleta ? 'pedala' : 'anda'} a ciclovia de novo, ${d.flags.c15_desceu ? 'descendo pra Fuchsia' : 'subindo pra Celadon'}.`,
    'As nove placas continuam nos bancos, descrevendo o que não está mais aqui, e você não para em nenhuma.'
  ],
  ef:{executar:d=>{ const para = c15_outraPonta(d); Estado.marcar('c15_desceu', para === 'sul'); c15_ir(d, para); return []; }},
  escolhas:[
    {texto:'Ir até o mirante do trecho 18.', vai:'c15_mirante'},
    {texto:'Parar na cabine de pedágio do norte.', vai:'c15_cabine'},
    {texto:'Sair da ciclovia e entrar no capinzal.', vai:'c15_capinzal'},
    {texto:'Ir pro vilarejo da Rota 17.', vai:'c15_vilarejo'},
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'}
  ]
},

c15_mirante:{
  texto:[
    'O mirante do trecho dezoito é uma varanda de concreto de oito metros por três, na ponta sul da ciclovia, em cima de uma falésia de quarenta metros.',
    'Tem um binóculo fixo de moeda, daqueles de mirante, que não funciona desde noventa e cinco.',
    'E tem vista.',
    d=>c15_deDia(d)
      ? 'Vista de trinta quilômetros de mar aberto e, no fim dele, num dia limpo — e hoje está limpo —, uma ilha com um vulcão.'
      : 'Vista de trinta quilômetros de mar escuro e, no fim dele, umas poucas luzes baixas, de ilha, embaixo de uma sombra mais alta que elas.',
    'Cinnabar.',
    'Você senta na mureta e olha por muito tempo.',
    'E depois você olha o chão.',
    'O chão do mirante é de concreto queimado pelo sol, cinza claro, com aquela superfície porosa.',
    'E tem marcas.',
    'Três conjuntos de marcas, de pata, em três pontos diferentes da mureta, todos virados pro sul.',
    'Fundas. Não é sujeira: é desgaste. É concreto gasto por apoio repetido, no mesmo lugar, muitas vezes.',
    d=>d.flags.viu_a_cama ? 'Você já viu marca assim, gasta de tanto passar no mesmo lugar: na beirada de um nicho escavado no gelo.' : '',
    d=>d.flags.achou_as_penas ? 'E já viu o outro jeito de um lugar contar o tempo: trinta centímetros de pena no fundo de um poço de contenção.' : '',
    'Alguém apoia as patas aqui, noite depois de noite, há muito tempo.'
  ],
  ef:{flag:['viu_o_mirante','caes_olham_cinnabar'],
      executar:d=>{ c15_ir(d, 'sul'); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Olhou o chão do mirante'},
      instabilidade:1,
      registrar:'No mirante do trecho 18 há três conjuntos de marcas de pata gastas no concreto, virados pra Cinnabar.',
      presagio:d=>(d.flags.viu_a_cama && d.flags.achou_as_penas) ? 'Terceira vez que um lugar te mostra quanto tempo alguém passou nele.'
        : (d.flags.viu_a_cama || d.flags.achou_as_penas) ? 'Segunda vez que um lugar te mostra quanto tempo alguém passou nele.'
        : 'Gasto por repetição. Alguém volta aqui.'},
  escolhas:[
    {texto:'Acampar no mirante e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Procurar uma quarta marca.', vai:'c15_quarta_marca', cond:c15_nova('c15_quarta_marca')},
    {texto:'Ir encontrar a Ylva no trecho 17.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Descer pro capinzal e procurar rastro.', vai:'c15_capinzal'}
  ]
},

/* o mirante, de novo */
c15_mirante_de_novo:{
  repetivel:true,
  texto:[
    'O mirante continua do jeito que estava: o binóculo de moeda quebrado, a mureta, as três marcas de pata gastas no concreto, viradas pro sul.',
    d=>d.flags.achou_a_marca_de_bota ? 'E a marca de bota embaixo do banco, com musgo na borda.' : '',
    d=>c15_deDia(d) ? 'Lá no fim do mar, a ilha.' : 'Lá no fim do mar escuro, as poucas luzes da ilha.'
  ],
  ef:{executar:d=>{ c15_ir(d, 'sul'); return []; }},
  escolhas:[
    {texto:'Acampar no mirante e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Procurar uma quarta marca.', vai:'c15_quarta_marca', cond:c15_nova('c15_quarta_marca')},
    {texto:'Ir encontrar a Ylva no trecho 17.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Descer pro capinzal e procurar rastro.', vai:'c15_capinzal'},
    {texto:'Ir pro vilarejo da Rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_quarta_marca:{
  texto:[
    'Você procura uma quarta.',
    'Não tem motivo bom pra procurar. Você procura porque três é um número que ultimamente te deixa desconfiad{o|a}.',
    'Leva quarenta minutos, e você acha.',
    'Não na mureta. No chão, a quatro metros dela, no canto do mirante, embaixo do banco de concreto.',
    'É uma marca de bota.',
    'Uma marca de bota gasta no concreto, do jeito que sapato gasta degrau de escola: rasa, larga, com o formato do calcanhar mais fundo que o resto.',
    'Alguém senta no banco desse mirante, com os dois pés no mesmo lugar, olhando pro sul, há tempo suficiente pra gastar concreto.',
    'E a marca não é de hoje: tem musgo na borda dela.'
  ],
  ef:{flag:['achou_a_marca_de_bota','tem_mais_alguem'],
      executar:()=>{ Relogio.avancar(1); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Procurou a quarta quando três já bastava'},
      instabilidade:1,
      registrar:'No mirante há também uma marca de bota gasta no concreto, embaixo do banco, com musgo na borda.',
      presagio:'Uma pessoa senta aqui há anos, olhando pro sul. No mesmo lugar que eles.'},
  escolhas:[
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir perguntar ao Xavi quem senta ali.', vai:'c15_quem_senta', cond:d=>!!d.flags.conheceu_otavio},
    {texto:'Procurar quem cuide dessa estrada.', vai:'c15_cabine', cond:d=>!d.flags.conheceu_otavio},
    {texto:'Ir encontrar a Ylva.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro vilarejo da Rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_quem_senta:{
  texto:[
    d=>c15_esperou(d, 'c15_espera_xavi_red',
      'A cabine ainda está fechada. Você espera no guarda-corpo até o Xavi chegar de bicicleta, às sete.',
      'A cabine está fechada, sem ninguém. Você volta {quando}, às sete, e o Xavi está chegando de bicicleta.'),
    d=>d.flags.c15_pela_bota
      ? 'Você mostra o desenho da sola e pergunta ao Xavi quem usa bota quarenta e um, de cano médio, gasta na borda de fora do calcanhar direito.'
      : 'Você pergunta ao Xavi quem senta no banco do mirante.',
    d=>d.flags.c15_pela_bota ? fala('Xavi', 'Bota eu não sei. Mas só tem uma pessoa que anda nessa estrada a pé, de madrugada, e senta naquele mirante.') : 'Ele não hesita.',
    fala('Xavi', 'O Red.'),
    'Você fica um tempo sem falar nada.',
    c15_eu('O Red.'),
    fala('Xavi', 'É. Ele aparece de vez em quando, desce até o mirante, senta lá e fica. Às vezes uma noite. Às vezes três.'),
    c15_eu('E ele fala com você?'),
    fala('Xavi', 'Ele acena.', null, 'O Xavi dá de ombros.'),
    fala('Xavi', 'Ele nunca falou uma palavra comigo em dois anos, e acena todas as vezes.'),
    c15_eu('Ele vem fazer o quê?'),
    'O Xavi olha a estrada.',
    fala('Xavi', 'Eu acho que ele vem olhar Cinnabar, {meu jovem|minha jovem}.'),
    d=>d.flags.sabe_dos_tres ? fala('Xavi', 'Mesma coisa que os três.') : '',
    'Ele bebe o café.',
    d=>d.flags.sabe_dos_tres ? fala('Xavi', 'E eu acho que os três vêm porque ele vem, ou que ele vem porque os três vêm, e eu não sei qual das duas, e eu já pensei muito.') : ''
  ],
  ef:{flag:['sabe_do_red_no_mirante','tem_mais_alguem'],
      executar:d=>{ c15_ir(d, 'norte'); c15_esperarAbrir('c15_espera_xavi_red', 7, 18); return []; },
      npc:c15_npc('Xavi', 6, 'Te contou que o Red senta no mirante do trecho 18 há dois anos, sem nunca falar uma palavra.'),
      rep:{eixo:'bom',delta:4,motivo:'Perguntou quem sentava no banco'},
      instabilidade:1,
      registrar:'O Red senta no mirante do trecho 18 há dois anos, olhando Cinnabar.'},
  escolhas:[
    {texto:'Voltar ao mirante e acampar lá.', vai:'c15_esperou_a_madrugada', ef:C15_AO_MIRANTE},
    {texto:'"Quando ele vem?"', vai:'c15_quando_ele_vem'},
    {texto:'Ir encontrar a Ylva.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro vilarejo da Rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_quando_ele_vem:{
  texto:[
    c15_eu('Quando ele vem?'),
    'O Xavi abre o caderno e vai direto numa página, porque ele anota.',
    fala('Xavi', 'Doze vezes em dois anos. Sem padrão de mês.'),
    'Ele passa o dedo pelas datas.',
    fala('Xavi', 'Mas tem uma coisa.'),
    c15_eu('O quê?'),
    d=>fala('Xavi', d.flags.sabe_dos_tres
      ? 'Nas doze vezes, os três passaram na madrugada seguinte.'
      : 'Nas doze vezes, na madrugada seguinte, passaram três coisas pela estrada que eu não sei o nome.'),
    'Ele fecha o caderno.',
    fala('Xavi', 'Doze em doze, {meu jovem|minha jovem}. Isso não é coincidência, isso é agenda.'),
    'Ele olha pra você.',
    d=>{ const q = c15_faz(d, C15_RED); return fala('Xavi', q.startsWith('faz') ? `E ele veio pela última vez ${q}.` : `E a última vez que ele veio foi ${q}.`); }
  ],
  ef:{flag:'sabe_quando_o_red_vem',
      npc:c15_npc('Xavi', 6, 'O Red vem ao mirante sem padrão de mês, e em doze de doze vezes os três passaram na madrugada seguinte.'),
      rep:{eixo:'bom',delta:4,motivo:'Perguntou quando, e a resposta tinha data'},
      instabilidade:1,
      registrar:d=>`O Red esteve no mirante pela última vez no dia ${c15_ext(c15_data(d, C15_RED))}. Os três passam sempre na madrugada seguinte.`,
      presagio:d=>`${c15_Faz(d, C15_RED)}. Então a madrugada deles já passou. Ou não.`},
  escolhas:[
    {texto:'Acampar no mirante hoje mesmo.', vai:'c15_esperou_a_madrugada', ef:C15_AO_MIRANTE},
    {texto:'Procurar o Red na ciclovia.', vai:'c15_procurou_o_red'},
    {texto:'Ir encontrar a Ylva.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_procurou_o_red:{
  texto:[
    'Você anda a ciclovia inteira de novo, de ponta a ponta, procurando um homem.',
    'Não acha.',
    d=>Historia.jaAconteceu('c15_mirante')
      ? 'Acha o mirante vazio, o banco vazio, e no banco — no assento, não no chão — uma coisa que não estava lá da outra vez:'
      : 'Acha o mirante vazio, o banco vazio, e no banco — no assento, não no chão — uma coisa:',
    'um saco de papel pardo, dobrado na boca, com o peso pra baixo.',
    'Dentro tem dois pães, uma laranja e uma garrafa de água.',
    'Comida pra uma pessoa, deixada no banco de um mirante numa ciclovia vazia.',
    'Você olha os dezenove quilômetros de estrada pra trás, e não tem ninguém neles.',
    'Ele sabia que você estava aqui.'
  ],
  ef:{flag:['red_deixou_comida','red_sabe_de_voce'],
      itens:{'Pão, laranja e água':1},
      executar:d=>{ c15_ir(d, 'sul'); return []; },
      rep:{eixo:'bom',delta:2,motivo:'Procurou um homem que não queria ser achado'},
      moral:10,
      registrar:'Alguém deixou comida pra você no banco do mirante.',
      presagio:'Ele sabia que você estava aqui. E deixou comida, em vez de aparecer.'},
  escolhas:[
    {texto:'Acampar no mirante e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Deixar um bilhete no lugar do saco.', vai:'c15_bilhete_pro_red'},
    {texto:'Ir encontrar a Ylva.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro capinzal.', vai:'c15_capinzal'}
  ]
},

c15_bilhete_pro_red:{
  texto:[
    'Você arranca uma folha do caderno e escreve.',
    'Você escreve três versões. A primeira é uma pergunta longa sobre Cinnabar. A segunda é uma pergunta longa sobre o que ele faz sentado ali.',
    'A terceira é o que fica, e é uma linha só:',
    d=>d.flags.achou_a_mochila_do_fuji ? '**"Eu subi o vulcão. Tinha três pedras empilhadas."**'
      : d.flags.viu_a_sala_do_tanque ? '**"Eu desci no subsolo do laboratório. O tanque está vazio."**'
      : d.flags.achou_moltres ? '**"Eu subi o vulcão. A ave de fogo continua lá em cima."**'
      : '**"Eu também estou olhando pra ilha."**',
    d=>!d.flags.achou_a_mochila_do_fuji ? ''
      : d.flags.c14_pedras === 5 ? 'E embaixo, você acrescenta: **"Agora tem cinco."**'
      : d.flags.empilhou_a_pedra ? 'E embaixo, você acrescenta: **"Agora tem quatro."**' : '',
    'Você dobra e põe no banco, embaixo de uma pedra.',
    'No dia seguinte, o bilhete não está mais lá.',
    'E no lugar dele, no mesmo banco, embaixo da mesma pedra, tem uma Poké Ball vazia e velha, com a tinta descascada e um arranhão fundo na tampa.',
    'Sem bilhete.',
    'Só a Pokébola.'
  ],
  ef:{flag:['red_respondeu','tem_a_bola_do_red'],
      itens:{'Poké Ball velha e arranhada':1},
      executar:d=>{ Relogio.amanhaAs(7); Estado.marcar('c15_onde', 'sul'); return []; },
      rep:{eixo:'bom',delta:5,motivo:'Escreveu a linha certa na terceira tentativa'},
      moral:15, instabilidade:-1,
      registrar:'Deixou um bilhete no mirante e recebeu, no dia seguinte, uma Poké Ball vazia e arranhada.',
      presagio:'Uma Pokébola vazia. Ele soltou alguma coisa dessa Pokébola e guardou ela mesmo assim.'},
  escolhas:[
    {texto:'Acampar no mirante e esperar.', vai:'c15_esperou_a_madrugada'},
    {texto:'Escrever outro bilhete.', vai:'c15_segundo_bilhete'},
    {texto:'Ir encontrar a Ylva.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro capinzal.', vai:'c15_capinzal'}
  ]
},

c15_segundo_bilhete:{
  texto:[
    'Você escreve de novo. Uma linha só, de novo, porque a primeira funcionou.',
    d=>d.flags.sabe_do_circuito ? '**"Eles correm um perímetro de frente pra ilha. Você sabe o que tem lá?"**' : '**"O que tem naquela ilha?"**',
    'Você põe embaixo da pedra e espera dois dias no mirante.',
    'No terceiro dia, o bilhete continua lá.',
    'Você abre pra conferir se é o mesmo, e é o mesmo, com o mesmo vinco, e a pedra está no mesmo ângulo.',
    'Ele leu e não respondeu.',
    'Ou não voltou.',
    'E você não sabe qual das duas te incomoda mais.'
  ],
  ef:{flag:'red_nao_respondeu',
      executar:()=>{ Relogio.amanhaAs(7); Relogio.amanhaAs(7); return []; },
      moral:-8,
      registrar:'O segundo bilhete ficou no banco do mirante. O Red não respondeu.',
      presagio:'Leu e não respondeu, ou não voltou. As duas são respostas.'},
  escolhas:[
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir encontrar a Ylva.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Ir pro vilarejo da Rota 17.', vai:'c15_vilarejo'}
  ]
},

/* ─────────────── A YLVA, NA ESTRADA ─────────────── */

c15_nair:{
  texto:[
    d=>c15_esperou(d, 'c15_espera_nair',
      'A contagem da Ylva começa às sete. Você espera no acostamento do dezessete até ver um chapéu de aba larga vindo devagar pelo asfalto.',
      'A contagem da Ylva é de manhã, e a manhã já passou. Você volta {quando}, cedo, e espera no acostamento do dezessete até ver um chapéu de aba larga vindo devagar pelo asfalto.'),
    d=>c15_esperouAlgo(d, 'c15_espera_nair') ? 'Ela para no acostamento, a dez metros de você, com uma prancheta.' : 'Você acha a Ylva no trecho dezessete, parada no acostamento com uma prancheta.',
    'Ela tem sessenta e três anos, chapéu de aba larga, calça de caminhada e uma bota que já foi reformada duas vezes.',
    'Ela levanta a mão pra você esperar antes de você abrir a boca, e termina de contar.',
    'Depois anota, e só então olha.',
    c15_eu('Quantos?'),
    fala('Ylva', 'Zero.'),
    'Ela vira a prancheta pra você.',
    'A folha tem catorze linhas, uma a cada setecentos metros, do vilarejo até o mirante, e em todas está escrito **0** com caneta, com a mesma firmeza.',
    c15_eu('E a senhora anota zero catorze vezes?'),
    fala('Ylva', 'Eu anoto zero catorze vezes, todo dia, há dois meses.'),
    'Ela guarda a caneta no bolso da camisa.',
    fala('Ylva', 'Porque zero é dado, {meu filho|minha filha}. Zero é o dado mais importante que existe, e é o único que ninguém tem paciência de coletar.')
  ],
  ef:{flag:'conheceu_nair',
      npc:c15_npc('Ylva', 3, 'Anota zero catorze vezes por dia, há dois meses, porque zero é dado.'),
      rep:{eixo:'bom',delta:3,motivo:'Esperou ela terminar de contar'},
      moral:8,
      executar:d=>{ c15_ir(d, 'nair'); c15_esperarAbrir('c15_espera_nair', 7, 12); return []; },
      registrar:'A Ylva anota zero em catorze pontos da estrada, todo dia, há dois meses.',
      presagio:'Zero é o dado que ninguém tem paciência de coletar.'},
  escolhas:[
    {texto:'Andar o resto da contagem com ela.', vai:'c15_andou_com_a_nair'},
    {texto:d=>d.flags.sabe_dos_tres ? '"A senhora viu os três."' : '"A senhora já viu alguma coisa aqui, de madrugada?"', vai:'c15_nair_viu'},
    {texto:'"A senhora não tem medo?"', vai:'c15_nair_medo'},
    {texto:'Agradecer e ir pro capinzal.', vai:'c15_capinzal'}
  ]
},

/* a Ylva, de novo: ela anota você também */
c15_nair_de_novo:{
  repetivel:true,
  texto:[
    d=>c15_esperou(d, 'c15_espera_nair_de_novo',
      'A contagem da Ylva começa às sete. Você espera no acostamento do dezessete até ela aparecer.',
      'A contagem da Ylva é de manhã, e a manhã já passou. Você volta {quando}, cedo, e espera no acostamento do dezessete até ela aparecer.'),
    'A Ylva levanta a mão pra você esperar, termina de contar, anota zero, e só então olha.',
    fala('Ylva', 'Você de novo.', null, 'Ela anota você também, numa linha de baixo.')
  ],
  ef:{executar:d=>{ c15_ir(d, 'nair'); c15_esperarAbrir('c15_espera_nair_de_novo', 7, 12); return []; }},
  escolhas:[
    {texto:'Andar o resto da contagem com ela.', vai:'c15_andou_com_a_nair', cond:c15_nova('c15_andou_com_a_nair')},
    {texto:d=>d.flags.sabe_dos_tres ? '"A senhora viu os três."' : '"A senhora já viu alguma coisa aqui, de madrugada?"', vai:'c15_nair_viu', cond:c15_nova('c15_nair_viu')},
    {texto:'"Qual deles parou?"', vai:'c15_qual_parou', cond:d=>Historia.jaAconteceu('c15_nair_viu') && !Historia.jaAconteceu('c15_qual_parou')},
    {texto:'"A senhora não tem medo?"', vai:'c15_nair_medo', cond:c15_nova('c15_nair_medo')},
    {texto:'"Vamos hoje à noite. Juntos."', vai:'c15_esperou_a_madrugada', ef:C15_COM_ELES, cond:d=>Historia.jaAconteceu('c15_nair_viu')},
    {texto:'Seguir pela estrada.', vai:'c15_ciclovia'}
  ]
},

c15_andou_com_a_nair:{
  texto:[
    'Você anda o resto da contagem com ela, até o mirante. Seis quilômetros, três horas, nove paradas.',
    'Em cada parada ela fica em silêncio dois minutos cronometrados, olhando e ouvindo, e depois anota.',
    'É o trabalho mais chato que você já viu alguém fazer com prazer.',
    'Na quinta parada, ela para fora do cronômetro e aponta um pé de goiaba na beira do capinzal.',
    fala('Ylva', 'Olha ali.'),
    'O pé está carregado. Goiaba madura, muita, com algumas caídas e apodrecendo no chão.',
    d=>fala('Ylva', `Isso aí, em ${c15_mes(d, 3)}, tinha quarenta Spearow de manhã. Eu contava quarenta e cinco em dois minutos e perdia a conta.`),
    'Ela anota zero.',
    fala('Ylva', 'E a fruta cai e apodrece e ninguém come, e ano que vem esse pé dá menos, porque Pokémon comendo fruta é o que espalha semente.'),
    'Ela guarda a caneta.',
    fala('Ylva', 'Some Pokémon, some pé. Some pé, some Pokémon. A gente tá vendo o começo de uma coisa que leva vinte anos.')
  ],
  ef:{flag:['andou_com_a_nair','entendeu_o_ciclo'],
      npc:c15_npc('Ylva', 7, 'Andou seis quilômetros com você e te mostrou a goiabeira carregada e vazia.'),
      rep:{eixo:'bom',delta:4,motivo:'Andou seis quilômetros só pra ver alguém anotar zero'},
      moral:10, hp:-2, causa:'Seis quilômetros de caminhada, parando',
      executar:d=>{ c15_ir(d, 'sul'); Relogio.avancar(1); return []; },
      registrar:'Sem os Spearow, a goiabeira não espalha semente. É o começo de uma coisa de vinte anos.'},
  escolhas:[
    {texto:d=>d.flags.sabe_dos_tres ? '"A senhora viu os três."' : '"A senhora já viu alguma coisa aqui, de madrugada?"', vai:'c15_nair_viu', cond:c15_nova('c15_nair_viu')},
    {texto:'"A senhora não tem medo?"', vai:'c15_nair_medo', cond:c15_nova('c15_nair_medo')},
    {texto:'"Vamos hoje à noite. Juntos."', vai:'c15_esperou_a_madrugada', ef:C15_COM_ELES, cond:d=>!!d.flags.sabe_dos_tres || Historia.jaAconteceu('c15_nair_viu')},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_nair_viu:{
  texto:[
    d=>fala(d.jogador.nome, d.flags.c15_sabia_dos_tres ? 'A senhora viu os três.' : 'A senhora já viu alguma coisa aqui, de madrugada?'),
    d=>fala('Ylva', d.flags.c15_sabia_dos_tres ? 'Quatro vezes.' : 'Três coisas grandes, em fila, de madrugada. Quatro vezes.'),
    'Ela senta numa pedra e tira o chapéu.',
    d=>fala('Ylva', `A primeira foi no dia ${c15_ext(c15_data(d, C15_PRIMEIRA))}, às quatro e vinte da manhã. Eu tava contando Zubat, que é coisa de madrugada.`),
    c15_eu('E?'),
    fala('Ylva', 'E eles passaram a uns sessenta metros, e eu me agachei atrás de uma pedra e fiquei lá até clarear.'),
    c15_eu('E nas outras três?'),
    fala('Ylva', 'Nas outras três eu não me agachei.'),
    'Ela mexe no chapéu.',
    fala('Ylva', 'Na segunda eu fiquei de pé. Na terceira eu fiquei de pé no acostamento, onde dava pra ver. E na quarta eu acendi a lanterna.'),
    c15_eu('A senhora acendeu a lanterna pra eles?'),
    fala('Ylva', 'Acendi.', null, 'Ela põe o chapéu.'),
    fala('Ylva', 'E o de trás parou.'),
    c15_eu('E?'),
    fala('Ylva', 'E olhou pra lanterna, e depois pra mim, e ficou uns dez segundos, e depois seguiu.'),
    'Ela levanta da pedra.',
    fala('Ylva', 'E eu anotei: quatro e trinta e um, três indivíduos não identificados, sentido norte, um deles fez contato visual por dez segundos.'),
    'Ela bate na prancheta.',
    fala('Ylva', 'Isso é dado, {meu filho|minha filha}.')
  ],
  ef:{flag:['nair_viu','nair_fez_contato'],
      /* a pergunta foi feita com o que você sabia antes: guarda isso antes de marcar */
      executar:d=>{ Estado.marcar('c15_sabia_dos_tres', !!d.flags.sabe_dos_tres); Estado.marcar('sabe_dos_tres'); return []; },
      npc:c15_npc('Ylva', 8, 'Acendeu a lanterna pros três e anotou o contato visual de dez segundos como dado.'),
      rep:{eixo:'bom',delta:4,motivo:'Ouviu a única pessoa em Kanto que fez contato visual e anotou'},
      registrar:'A Ylva viu três coisas grandes passarem de madrugada, quatro vezes. Na quarta, uma delas parou e olhou pra ela.'},
  escolhas:[
    {texto:'"Vamos hoje à noite. Juntos."', vai:'c15_esperou_a_madrugada', ef:C15_COM_ELES},
    {texto:'"A senhora não tem medo?"', vai:'c15_nair_medo', cond:c15_nova('c15_nair_medo')},
    {texto:'"Qual deles parou?"', vai:'c15_qual_parou'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_qual_parou:{
  texto:[
    c15_eu('Qual deles parou?'),
    'Ela vira a prancheta e procura, e acha, porque ela desenha.',
    'O desenho é a lápis, feito no acostamento às quatro e meia da manhã com uma lanterna na boca, e é bom.',
    'Pelagem azul-clara com losangos brancos, uma crista que parece fita de tecido, duas caudas compridas.',
    'Suicune.',
    fala('Ylva', 'Esse.'),
    c15_eu('A senhora sabe o nome dele?'),
    fala('Ylva', 'Não.'),
    'Ela olha o desenho.',
    fala('Ylva', 'Eu passei trinta e um anos aprendendo nome de cento e cinquenta e uma espécies, e essa aí não tá em nenhum livro que eu tenho, e eu tenho quatro.'),
    'Ela fecha a prancheta.',
    fala('Ylva', 'E eu vou te dizer uma coisa que eu não falo nem pro Xavi: eu fiquei feliz.'),
    c15_eu('Feliz?'),
    fala('Ylva', 'Sessenta e três anos, {meu filho|minha filha}. Trinta e um contando as mesmas espécies nas mesmas rotas.'),
    d=>fala('Ylva', `E, ${c15_faz(d, C15_LANTERNA)}, passou uma coisa que não tem no livro, e ela parou e olhou pra mim.`),
    'Ela ajeita a mochila.',
    fala('Ylva', 'Eu voltei pra casa e chorei no banheiro pra ele não ver, e depois eu anotei direito.')
  ],
  ef:{flag:['sabe_que_e_suicune','nair_desenhou'],
      npc:c15_npc('Ylva', 9, 'Desenhou o Suicune no acostamento às quatro e meia e voltou pra casa feliz e chorando.'),
      rep:{eixo:'bom',delta:5,motivo:'Perguntou qual deles, e a resposta era um desenho'},
      moral:15,
      registrar:'Foi o Suicune que parou e olhou pra Ylva.'},
  escolhas:[
    {texto:'"Vamos hoje à noite. Juntos."', vai:'c15_esperou_a_madrugada', ef:C15_COM_ELES},
    {texto:'"A senhora não tem medo?"', vai:'c15_nair_medo', cond:c15_nova('c15_nair_medo')},
    {texto:'Contar pra ela o nome dele.', vai:'c15_contou_o_nome'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

c15_contou_o_nome:{
  texto:[
    c15_eu('Ele se chama Suicune.'),
    'Ela fica parada.',
    fala('Ylva', 'Como?'),
    c15_eu('Suicune. Os três são Raikou, Entei e Suicune. Eles não são de Kanto, são de Johto, e quase ninguém aqui já viu.'),
    'Ela pega a prancheta, tira a caneta do bolso da camisa e escreve o nome ao lado do desenho.',
    'E escreve devagar, letra por letra, conferindo a grafia com você duas vezes.',
    'Depois ela olha a folha por um tempo.',
    fala('Ylva', 'Trinta e um anos.', null, 'Ela não tira o olho da folha.'),
    fala('Ylva', 'Eu nunca tinha escrito um nome que eu não sabia.'),
    'Ela guarda a prancheta.',
    fala('Ylva', 'Obrigada.'),
    'E aí ela faz uma coisa que te desmonta: ela aperta a sua mão. Formalmente, com as duas mãos, como quem agradece num velório.'
  ],
  ef:{flag:['nair_sabe_o_nome','nair_aliada'],
      npc:c15_npc('Ylva', 10, 'Escreveu o nome do Suicune ao lado do desenho e apertou a sua mão com as duas.'),
      rep:{eixo:'bom',delta:5,motivo:'Deu a alguém um nome que ela procurou por meses'},
      moral:20,
      registrar:'A Ylva escreveu o nome do Suicune ao lado do desenho dela.',
      presagio:'Ela agradeceu como quem agradece num velório. Reparou?'},
  escolhas:[
    {texto:'"Vamos hoje à noite. Juntos."', vai:'c15_esperou_a_madrugada', ef:C15_COM_ELES},
    {texto:'"A senhora não tem medo?"', vai:'c15_nair_medo', cond:c15_nova('c15_nair_medo')},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Ir pro vilarejo da Rota 17.', vai:'c15_vilarejo'}
  ]
},

c15_nair_medo:{
  texto:[
    c15_eu('A senhora não tem medo?'),
    fala('Ylva', 'Tenho.'),
    'Sem nenhuma bravata.',
    fala('Ylva', 'Eu tenho sessenta e três anos e eu sei correr zero metros, e se um daqueles três quiser me machucar eu não chego no acostamento.'),
    c15_eu('E por que a senhora continua?'),
    'Ela pensa de verdade antes de responder, o que é raro em quem já tem a resposta pronta.',
    fala('Ylva', 'Porque eu já tive medo de doença, de ficar viúva e de morrer sozinha, e esses três medos eu levo pra casa todo dia.'),
    'Ela ajeita o chapéu.',
    fala('Ylva', 'Esse aqui é o único medo que vem com uma coisa nova do outro lado.'),
    'Ela começa a andar pro próximo ponto de contagem.',
    fala('Ylva', 'Eu prefiro muito esse.')
  ],
  ef:{flag:'nair_falou_do_medo',
      npc:c15_npc('Ylva', 8, 'Explicou que prefere o medo que vem com uma coisa nova do outro lado.'),
      rep:{eixo:'bom',delta:3,motivo:'Perguntou do medo'},
      moral:12},
  escolhas:[
    {texto:'"Vamos hoje à noite. Juntos."', vai:'c15_esperou_a_madrugada', ef:C15_COM_ELES, cond:d=>Historia.jaAconteceu('c15_nair_viu')},
    {texto:d=>d.flags.sabe_dos_tres ? '"A senhora viu os três."' : '"A senhora já viu alguma coisa aqui, de madrugada?"', vai:'c15_nair_viu', cond:c15_nova('c15_nair_viu')},
    {texto:'"Qual deles parou?"', vai:'c15_qual_parou', cond:d=>Historia.jaAconteceu('c15_nair_viu') && !Historia.jaAconteceu('c15_qual_parou')},
    {texto:'Andar o trecho com ela.', vai:'c15_andou_com_a_nair', cond:c15_nova('c15_andou_com_a_nair')},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

/* ─────────────── O VILAREJO DA ROTA 17 ─────────────── */

c15_vilarejo:{
  texto:[
    'O vilarejo da Rota 17 tem dezenove casas, um armazém e um curral comunitário onde as famílias guardam os Tauros de tração.',
    'O curral está destruído.',
    'Não arrombado: destruído. Quatro seções de mourão de eucalipto de vinte centímetros de diâmetro, arrancadas do chão com o concreto da base junto.',
    'E os Tauros estão todos lá, no pasto do lado, pastando.',
    'Nenhum ferido. Nenhum sumido. Onze Tauros que ficaram a noite inteira com o curral aberto e não saíram de perto.',
    'Um homem de uns quarenta anos está recolocando o mourão, sozinho, com uma pá e muita raiva.',
    ()=>{ Nomes.apresentar('o dono do curral'); return 'Um vizinho passa de bicicleta e grita o nome dele, Hale, e pergunta se foi de novo. Ele não responde o vizinho.'; },
    fala('o dono do curral', 'Terceira vez em dois meses.', null, 'Ele diz isso pra você, sem você perguntar.'),
    fala('o dono do curral', 'Terceira.'),
    c15_eu('E levaram alguma coisa?'),
    'Ele para de cavar.',
    fala('o dono do curral', 'Essa é a parte.'),
    fala('o dono do curral', 'Nunca levam nada. Nunca machucam ninguém. Só arrebentam o curral e vão embora.')
  ],
  ef:{flag:['viu_o_vilarejo','curral_destruido'],
      npc:c15_npc('Sr. Hale', 1, 'Recoloca o mourão do curral comunitário da Rota 17 pela terceira vez em dois meses.'),
      executar:d=>{ c15_ir(d, 'vilarejo'); Nomes.apresentar('o dono do curral'); return []; },
      registrar:'O curral comunitário do vilarejo da Rota 17 foi destruído três vezes em dois meses, a última nesta madrugada. Nada foi levado.',
      presagio:'Nunca levam nada. Nunca machucam. Só abrem.'},
  escolhas:[
    {texto:'"Eles não estão roubando. Estão abrindo."', vai:'c15_estao_abrindo'},
    {texto:'"Posso ajudar a recolocar?"', vai:'c15_ajudou_o_curral'},
    {texto:'"O senhor viu o que foi?"', vai:'c15_o_que_foi'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

/* o vilarejo, de novo */
c15_vilarejo_de_novo:{
  repetivel:true,
  texto:[
    d=>Historia.jaAconteceu('c15_ajudou_o_curral')
      ? 'O curral comunitário está de pé, com os quatro mourões novos que vocês puseram, o concreto ainda mais claro que o resto.'
      : 'O Sr. Hale continua no curral, cavando, com a camisa colada nas costas.',
    'Os onze Tauros pastam do lado, perto da cerca, como se ela ainda precisasse deles pra ficar de pé.'
  ],
  ef:{executar:d=>{ c15_ir(d, 'vilarejo'); return []; }},
  escolhas:[
    {texto:'"Eles não estão roubando. Estão abrindo."', vai:'c15_estao_abrindo', cond:c15_nova('c15_estao_abrindo')},
    {texto:'"Posso ajudar a recolocar?"', vai:'c15_ajudou_o_curral', cond:c15_nova('c15_ajudou_o_curral')},
    {texto:'"O senhor viu o que foi?"', vai:'c15_o_que_foi', cond:c15_nova('c15_o_que_foi')},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'},
    {texto:'Voltar pra ciclovia.', vai:'c15_ciclovia'}
  ]
},

c15_ajudou_o_curral:{
  texto:[
    c15_eu('Posso ajudar a recolocar?'),
    'Ele para, olha você, olha a pá.',
    fala('o dono do curral', 'Pode.'),
    'Vocês passam cinco horas recolocando quatro mourões de eucalipto num buraco de sessenta centímetros com concreto novo, e na terceira hora chegam mais duas pessoas do vilarejo sem ninguém chamar.',
    'É trabalho pesado e chato e ninguém fala quase nada, e no fim tem café e pão na varanda da casa dele.',
    'E aí, na varanda, com o café, ele conta a parte que não contou de pé no sol.',
    fala('o dono do curral', 'Meu pai construiu esse curral em setenta e dois.'),
    fala('o dono do curral', 'E ele tá aberto há dois meses, porque eu conserto e eles abrem, e eu conserto e eles abrem.'),
    'Ele olha os onze Tauros no pasto.',
    fala('o dono do curral', 'E os Pokémon não saem. Eu deixei aberto uma semana pra ver, e nenhum saiu.'),
    c15_eu('Eles não querem soltar os seus.'),
    fala('o dono do curral', 'Não.'),
    'Ele bebe o café.',
    fala('o dono do curral', 'Eu acho que eles tão treinando.')
  ],
  ef:{flag:['ajudou_o_curral','sabe_que_treinam'],
      npc:c15_npc('Sr. Hale', 7, 'Passou cinco horas recolocando mourão com você e disse que acha que eles estão treinando.'),
      rep:{eixo:'bom',delta:5,motivo:'Passou cinco horas cavando buraco de mourão'},
      moral:15, hp:-3, causa:'Cinco horas de trabalho pesado',
      executar:d=>{ c15_ir(d, 'vilarejo'); Relogio.avancar(5); return []; },
      registrar:'Eles abrem o curral repetidamente e nada sai. O Sr. Hale acha que estão treinando.'},
  escolhas:[
    {texto:'"Treinando pra quê?"', vai:'c15_estao_abrindo', cond:c15_nova('c15_estao_abrindo')},
    {texto:'Acampar no curral e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'"O senhor viu o que foi?"', vai:'c15_o_que_foi', cond:c15_nova('c15_o_que_foi')},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

/* o curral, de novo no chão: você cava junto, e ninguém toma café na varanda */
c15_ajudou_de_novo:{
  repetivel:true,
  texto:[
    'Você pega a outra pá, a que estava encostada na cerca, e começa a cavar do outro lado do buraco.',
    d=>d.flags.contou_pro_dono
      ? 'O Sr. Hale não diz nada. Ele não te manda embora e não te agradece. Ele cava do lado dele e deixa você cavar do seu.'
      : 'O Sr. Hale olha você, olha a pá, e volta a cavar.',
    'Leva a tarde inteira, e no fim o mourão está de pé, e ninguém toma café na varanda.'
  ],
  ef:{hp:-2, causa:'Uma tarde cavando buraco de mourão',
      executar:()=>{ Relogio.avancar(4); return []; }},
  escolhas:[
    {texto:'Soltar o que você prendeu.', vai:'c15_soltou_caes', cond:d=>c15_presos().length > 0},
    {texto:'Seguir.', vai:'c15_fim'}
  ]
},

c15_estao_abrindo:{
  texto:[
    c15_eu('Eles não estão roubando. Estão abrindo.'),
    'Ele encosta a pá no mourão.',
    fala('o dono do curral', 'Como assim, abrindo?'),
    c15_eu('Três vezes em dois meses, sem levar nada, sem machucar ninguém, num curral onde nada quer sair.'),
    c15_eu('Isso não é ataque. Isso é prática.'),
    'Ele fica quieto.',
    fala('o dono do curral', 'Prática de quê?'),
    'E aí você diz em voz alta, pela primeira vez, a coisa que você vinha montando desde que entrou na ciclovia:',
    c15_eu('De abrir uma coisa que tem alguém preso dentro.'),
    'Ele olha o curral.',
    fala('o dono do curral', 'E onde é que tem uma coisa dessas?'),
    'Você olha pro sul.',
    'Ele acompanha o seu olhar, e do vilarejo da Rota 17, num dia limpo, dá pra ver a linha do mar e, se você souber onde olhar, um ponto que é uma ilha.'
  ],
  ef:{flag:['entendeu_o_treino','caes_olham_cinnabar'],
      npc:c15_npc('Sr. Hale', 3, 'Ouviu você dizer que eles não estão roubando: estão praticando abrir.'),
      rep:{eixo:'bom',delta:5,motivo:'Disse em voz alta a coisa que estava montando'},
      instabilidade:1,
      registrar:'Eles estão praticando abrir. E do vilarejo da Rota 17 se vê, num dia limpo, a ilha de Cinnabar.',
      presagio:d=>d.flags.leu_o_fim_do_sete ? 'Treinando pra abrir. E num caderno de Cinnabar alguém escreveu que ele pediu pra sair.' : 'Treinando pra abrir. Falta saber o quê.'},
  escolhas:[
    {texto:'Acampar e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir até o mirante do trecho 18.', vai:'c15_mirante'},
    {texto:'Ir pro capinzal procurar o rastro.', vai:'c15_capinzal'},
    c15_contar()
  ]
},

c15_o_que_foi:{
  texto:[
    c15_eu('O senhor viu o que foi?'),
    fala('o dono do curral', 'Vi a terceira. Essa noite.'),
    'Ele apoia a pá.',
    fala('o dono do curral', 'Eu dormi no cercado, com um cassetete de guarda-noturno que não machuca nem Pidgey, porque eu tava com raiva.'),
    c15_eu('E?'),
    fala('o dono do curral', 'E às três e quarenta veio um que era azul-claro e grande e não fez barulho nenhum, e ele arrancou o mourão com a boca.'),
    c15_eu('Com a boca?'),
    fala('o dono do curral', 'Com a boca. Mordeu, puxou e soltou, e o mourão saiu com o concreto e tudo, e ele não olhou pra mim uma vez.'),
    'Ele passa a mão na cara.',
    fala('o dono do curral', 'E eu tava com o cassetete na mão, deitado atrás do cocho, e eu não levantei.'),
    c15_eu('O senhor fez certo.'),
    fala('o dono do curral', 'Eu sei que eu fiz certo.', null, 'Ele volta a cavar.'),
    fala('o dono do curral', 'É pior saber.')
  ],
  ef:{flag:['dono_viu','sabe_que_e_suicune'],
      npc:c15_npc('Sr. Hale', 4, 'Dormiu no curral com um cassetete na mão e não levantou.'),
      rep:{eixo:'bom',delta:3,motivo:'Perguntou e deixou o homem admitir o resto'},
      moral:-5,
      registrar:'O que arranca os mourões do curral é grande, azul-claro e silencioso, e arranca com a boca, sem olhar pra quem está lá.'},
  escolhas:[
    {texto:'"Eles não estão roubando. Estão abrindo."', vai:'c15_estao_abrindo', cond:c15_nova('c15_estao_abrindo')},
    {texto:'"Posso ajudar a recolocar?"', vai:'c15_ajudou_o_curral', cond:c15_nova('c15_ajudou_o_curral')},
    {texto:'Acampar no curral hoje.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir pro capinzal procurar rastro.', vai:'c15_capinzal'}
  ]
},

/* ─────────────── A CABINE, NO FIM DA TARDE ─────────────── */

c15_avisou_os_dois:{
  texto:[
    d=>c15_esperou(d, 'c15_espera_os_dois', '',
      'Quando você chega à cabine, já passou da hora, e os dois foram embora. Você volta {quando}, no fim da tarde.'),
    'Você vai até a cabine de pedágio do norte no fim da tarde, quando a Ylva já voltou da contagem e os dois estão fechando o dia.',
    d=>d.flags.c15_ylva_na_cabine ? 'A Ylva é a mulher dele: sessenta e três anos, chapéu de aba larga, uma bota que já foi reformada duas vezes. Ela aperta a sua mão e não pergunta quem você é, porque o Xavi já anotou.' : '',
    d=>{
      const f = d.flags, l = [];
      if (f.viu_a_frente) l.push('a frente de um trecho por mês');
      if (f.sabe_do_circuito) l.push('o circuito de trinta e quatro quilômetros');
      if (f.viu_o_mirante) l.push('o mirante com as três marcas gastas');
      if (f.viu_o_vilarejo) l.push('o curral aberto três vezes sem nada sair');
      if (f.achou_a_trilha) l.push('a trilha de capim deitado, com uma bota no meio');
      if (f.achou_a_praia) l.push('a praia de pedra com os quatro lugares gastos');
      if (f.viu_os_tres) l.push('o que você viu de madrugada');
      return l.length ? `Você conta tudo junto, pros dois: ${c15_lista(l)}.` : 'Você conta pros dois o que você viu na estrada.';
    },
    'Eles ouvem sem interromper, e no fim a Ylva abre a prancheta e o Xavi abre o caderno, e os dois começam a conferir datas em voz alta, um com o outro, como quem faz isso há trinta e um anos.',
    d=>d.flags.viu_o_vilarejo ? '' : fala('Ylva', 'Tem o curral também. O do vilarejo do dezessete. Arrebentaram três vezes, e nada saiu.'),
    d=>fala('Ylva', `${c15_Ext(c15_data(d, C15_CURRAL[0]))}, curral.`),
    d=>fala('Xavi', `${c15_Ext(c15_data(d, C15_CURRAL[0] - 1))}, três indivíduos, sentido norte, quatro e vinte.`),
    d=>fala('Ylva', `${c15_Ext(c15_data(d, C15_CURRAL[1]))}, curral.`),
    d=>fala('Xavi', `${c15_Ext(c15_data(d, C15_CURRAL[1] - 1))}, três indivíduos.`),
    d=>fala('Ylva', c15_passados(d) === 0 ? 'Hoje, de madrugada, curral.' : `${c15_Ext(c15_data(d, C15_CURRAL[2]))}, curral.`),
    'O Xavi fecha o caderno.',
    fala('Xavi', 'Eles abrem o curral, e na madrugada seguinte fazem o circuito inteiro.'),
    'A Ylva escreve na prancheta.',
    fala('Ylva', 'Isso é ensaio e revisão, {meu filho|minha filha}. É o que professor faz.'),
    d=>c15_passados(d) === 0
      ? fala('Xavi', 'Hoje à noite, então.', 'baixo')
      : fala('Xavi', 'E na madrugada seguinte a essa ninguém tava lá pra contar.', 'baixo')
  ],
  ef:{flag:['juntou_os_dados','entendeu_o_treino'],
      npc:c15_npc('Ylva', 9, 'Cruzou as datas do curral com as passagens dos três e concluiu: ensaio e revisão.'),
      rep:{eixo:'bom',delta:6,motivo:'Juntou três fontes e deixou quem sabe cruzar'},
      instabilidade:1,
      registrar:'Eles abrem o curral, e na madrugada seguinte fazem o circuito inteiro. É ensaio e revisão.',
      /* a Ylva pode estar te conhecendo agora, na cabine; guarda isso antes de marcar */
      executar:d=>{
        c15_ir(d, 'norte');
        const h = c15_hora(d);
        if (h >= 17 && h < 18) Estado.marcar('c15_espera_os_dois', '');
        else if (h < 17){ c15_ate(17); Estado.marcar('c15_espera_os_dois', ''); }
        else { Relogio.amanhaAs(17); Estado.marcar('c15_espera_os_dois', 'outro'); Estado.marcar('c15_espera_os_dois_quando', 'no dia seguinte'); }
        Estado.marcar('c15_ylva_na_cabine', !d.flags.conheceu_nair);
        Estado.marcar('conheceu_nair');
        return []; },
      presagio:d=>d.flags.leu_o_dia_252 ? '"É o que professor faz." E num caderno, no alto de um vulcão, alguém perguntou o que é uma escola.' : '"É o que professor faz."'},
  escolhas:[
    {texto:'Ficar com eles e esperar a madrugada juntos.', vai:'c15_esperou_a_madrugada', ef:C15_COM_ELES},
    {texto:'Ir até o mirante sozinh{o|a} agora.', vai:'c15_mirante'},
    {texto:'Ir pro capinzal procurar o rastro.', vai:'c15_capinzal'}
  ]
},

/* ─────────────── O CAPINZAL ─────────────── */

c15_capinzal:{
  texto:[
    'Você sai da ciclovia e entra no capinzal, que tem um metro e meio de altura e que fecha atrás de você depois de quatro passos.',
    'Leva quarenta minutos até você achar a trilha.',
    'E quando você acha, você entende por que ninguém achou antes: ela não é uma trilha de pisoteio, é uma trilha de esmagamento.',
    'Uma faixa de um metro e oitenta de largura onde o capim está deitado, todo no mesmo sentido, e não quebrado.',
    'Deitado e não quebrado quer dizer velocidade muito alta e peso distribuído.',
    'Você segue a faixa por três quilômetros, e ela não desvia de nada: passa por cima de toco, de tronco caído, de vala.',
    'E no fundo da vala, na terra úmida onde o capim não cresce, tem pegada.',
    'Você agacha e conta.',
    'Três conjuntos.',
    'E, no barro mais fundo, no meio dos três: uma quarta.',
    'Bota.'
  ],
  ef:{flag:['achou_a_trilha','tem_mais_alguem'],
      executar:()=>{ Relogio.avancar(2); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Entrou no capinzal e seguiu três quilômetros de capim deitado'},
      instabilidade:1,
      registrar:'Na trilha dos três há também a pegada de uma bota, no meio das outras.',
      presagio:d=>d.flags.sabe_que_subiram ? 'No meio, e não atrás. Em Cinnabar, o Sr. Berto disse quase isso: do lado, no mesmo passo.' : 'No meio, e não atrás. Alguém anda com eles.'},
  escolhas:[
    {texto:'Seguir a trilha até o fim.', vai:'c15_seguiu_a_trilha'},
    {texto:'Medir e desenhar a pegada de bota.', vai:'c15_desenhou_a_bota'},
    {texto:'Acampar ali e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    c15_contar()
  ]
},

/* o capinzal, de novo */
c15_capinzal_de_novo:{
  repetivel:true,
  texto:[
    'Você volta pra faixa de capim deitado. Ela continua no mesmo sentido, por cima de toco e de vala, como se ninguém nunca tivesse andado por ela além deles.',
    'No barro da vala, a pegada de bota continua no meio das outras três.'
  ],
  ef:{executar:()=>{ Relogio.avancar(1); return []; }},
  escolhas:[
    {texto:'Seguir a trilha até o fim.', vai:'c15_seguiu_a_trilha', cond:c15_nova('c15_seguiu_a_trilha')},
    {texto:'Medir e desenhar a pegada de bota.', vai:'c15_desenhou_a_bota', cond:c15_nova('c15_desenhou_a_bota')},
    {texto:'Acampar ali e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Voltar pra ciclovia.', vai:'c15_ciclovia'}
  ]
},

c15_desenhou_a_bota:{
  texto:[
    'Você mede com a régua da mochila e desenha no caderno.',
    'Bota de cano médio, solado de borracha com desenho em espinha, número quarenta e um, desgaste maior na borda de fora do calcanhar direito — que é o que acontece com quem anda muito e pisa de fora pra dentro.',
    'E o desgaste é antigo: essa bota tem muitos quilômetros.',
    'Você desenha a sola inteira, quadrado por quadrado, o que leva vinte e cinco minutos.',
    d=>d.flags.achou_a_marca_de_bota
      ? 'E aí você lembra da marca gasta embaixo do banco do mirante: o mesmo calcanhar mais fundo, a mesma largura.\nÉ a mesma bota.'
      : 'Você não tem com o que comparar.',
    'Você fecha o caderno.',
    d=>d.flags.sabe_dos_tres
      ? 'Alguém anda com eles. A pé. Em capinzal de um metro e meio, de madrugada, no meio de três lendários que fazem noventa por hora.'
      : 'Alguém anda com eles. A pé. Em capinzal de um metro e meio, de madrugada, no meio de três coisas grandes que deitam capim a noventa por hora.',
    'E acompanha.'
  ],
  ef:{flag:['desenhou_a_bota','tem_mais_alguem'],
      itens:{'Desenho da sola':1},
      rep:{eixo:'bom',delta:4,motivo:'Mediu e desenhou, em vez de supor'},
      registrar:d=>d.flags.achou_a_marca_de_bota ? 'A pegada de bota da trilha é a mesma marca gasta no concreto do mirante.' : 'Desenhou a pegada de bota que anda no meio da trilha dos três.',
      presagio:'Ele acompanha a pé três coisas que fazem noventa por hora.'},
  escolhas:[
    {texto:'Seguir a trilha até o fim.', vai:'c15_seguiu_a_trilha', cond:c15_nova('c15_seguiu_a_trilha')},
    {texto:'Acampar ali e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir perguntar ao Xavi quem usa bota quarenta e um.', vai:'c15_quem_senta',
     cond:d=>!!d.flags.conheceu_otavio && !Historia.jaAconteceu('c15_quem_senta'), ef:{flag:'c15_pela_bota'}},
    {texto:'Ir até o mirante comparar.', vai:'c15_mirante'}
  ]
},

c15_seguiu_a_trilha:{
  texto:[
    'Você segue a faixa de capim deitado até o fim.',
    'Ela contorna o vilarejo da Rota 17 a quatrocentos metros — contorna, não atravessa —, cruza a ciclovia em dois pontos onde o guarda-corpo está amassado pra fora, e desce pro lado do mar.',
    'E termina numa praia de pedra no fim do trecho dezoito, embaixo da falésia do mirante.',
    'Na praia de pedra, na faixa de areia grossa entre as pedras, tem três depressões.',
    'Três depressões do tamanho de um corpo grande deitado, lado a lado, viradas pro mar.',
    'E a quatro metros delas, no mesmo alinhamento, uma quarta depressão, menor, do tamanho de uma pessoa sentada com as costas numa pedra.',
    'Os quatro lugares estão gastos. Muito gastos. Com a areia compactada e a pedra polida onde encosta.',
    'Anos.',
    'Eles ficam aqui. Há anos. Deitados na praia, olhando trinta quilômetros de mar aberto.'
  ],
  ef:{flag:['achou_a_praia','caes_olham_cinnabar','tem_mais_alguem'],
      executar:d=>{ c15_ir(d, 'sul'); Relogio.avancar(1); return []; },
      rep:{eixo:'bom',delta:5,motivo:'Seguiu o capim deitado até o fim'},
      instabilidade:1, moral:-5,
      registrar:'Na praia de pedra do fim do trecho 18 há quatro lugares gastos por anos: três grandes e um de pessoa sentada.',
      presagio:'Quatro lugares gastos por anos. Ninguém está fazendo isso sozinho.'},
  escolhas:[
    {texto:'Sentar no quarto lugar.', vai:'c15_sentou_no_quarto', cond:c15_nova('c15_sentou_no_quarto')},
    {texto:'Acampar ali e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    c15_contar(),
    {texto:'Subir ao mirante e olhar de cima.', vai:'c15_mirante'}
  ]
},

c15_sentou_no_quarto:{
  texto:[
    'Você senta no quarto lugar.',
    'A pedra encaixa nas suas costas, e encaixa bem, porque ela foi polida por anos de umas costas encostando.',
    d=>c15_deDia(d)
      ? 'Daqui, sentad{o|a}, a vista é exatamente o mar e a ilha e mais nada: a falésia corta os dois lados, o capinzal corta atrás.'
      : 'Daqui, sentad{o|a}, a vista é exatamente o mar escuro e as luzes da ilha e mais nada: a falésia corta os dois lados, o capinzal corta atrás.',
    'É um lugar que só serve pra uma coisa.',
    'Você fica sentad{o|a} uma hora e quarenta.',
    'Na primeira meia hora você fica pensando em quem senta aqui. Na segunda, você para de pensar em quem senta aqui e começa a só olhar a ilha. E nos últimos quarenta minutos você não está pensando em nada.',
    'E aí você entende por que ele senta aqui.',
    'Não é vigília. É a única coisa que dá pra fazer quando não dá pra fazer nada.'
  ],
  ef:{flag:'sentou_no_quarto_lugar',
      executar:()=>{ Relogio.avancar(2); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Sentou uma hora e quarenta no lugar de outra pessoa'},
      moral:10,
      registrar:'Sentou no quarto lugar da praia por uma hora e quarenta.'},
  escolhas:[
    {texto:'Acampar ali e esperar a madrugada.', vai:'c15_esperou_a_madrugada'},
    {texto:'Ir encontrar a Ylva.', vai:'c15_nair', cond:d=>!!d.flags.sabe_da_nair},
    {texto:'Subir ao mirante.', vai:'c15_mirante'},
    {texto:'Ir embora dessas rotas.', vai:'c15_fim'}
  ]
},

/* ─────────────── A MADRUGADA ─────────────── */

c15_esperou_a_madrugada:{
  repetivel:true,
  texto:[
    d=>d.flags.c15_primeira_espera ? 'Você espera.' : 'Mais uma noite. Você espera de novo.',
    d=>c15_comEles(d)
      ? 'A Ylva e o Xavi esperam com você, sentados em cadeirinhas de praia dobráveis, com garrafa térmica e a prancheta no colo.'
      : 'Sozinh{o|a}, com o cobertor, encostad{o|a} numa pedra, sem fogo, porque fogo se vê de longe.',
    d=>c15_comEles(d) ? fala('Ylva', 'Se passarem, eu conto e você olha. Não adianta os dois olharem e ninguém contar.') : '',
    'Faz frio. Vento de sudeste.',
    d=>c15_onde(d) === 'sul' ? 'O mar bate embaixo da falésia.' : 'O capim chia o tempo inteiro, e nenhum chiado é Pokémon.',
    'Às duas da manhã você já não sente os dedos do pé.',
    'Às três e quarenta, o chão avisa antes do som.',
    'Não é tremor. É ritmo — batida de pata em solo duro, muito rápida, muito longe, vindo.',
    'E depois o som, e o som chega três segundos depois do chão, o que quer dizer que eles estão a mais ou menos um quilômetro e que você tem uns quarenta segundos.',
    'E aí o vento vira e traz cheiro.',
    'Ozônio, fumaça de mato queimado e uma coisa fria que não tem cheiro e que você sente assim mesmo.',
    d=>Campo.iluminar().pode ? '' : 'E você não tem luz nenhuma pra acender.'
  ],
  ef:{flag:'esperou_a_madrugada',
      executar:d=>{
        const primeira = !d.flags.c15_esperou_antes;
        Estado.marcar('c15_primeira_espera', primeira);
        Estado.marcar('c15_esperou_antes');
        c15_ate(3);
        if (primeira) Estado.registrar('Esperou a madrugada na ciclovia. Os três passaram às 3h40.');
        return []; },
      presagio:'Quarenta segundos. Decide agora.'},
  escolhas:[
    {texto:'Ficar parad{o|a} onde está.', vai:'c15_ficou'},
    {texto:'Sair do caminho e se esconder.', vai:'c15_escondeu'},
    {texto:d=>{ const l = Campo.iluminar(); return l.semPilha && l.quem ? `Pedir pra ${nomeExib(l.quem)} clarear o chão.` : 'Acender a lanterna e apontar pro chão.'; },
     vai:'c15_acendeu_a_lanterna', cond:d=>Campo.iluminar().pode,
     ef:{desgaste:d=>{ const l = Campo.iluminar(); return l.pode && !l.semPilha ? 'Lanterna' : null; }}},
    {texto:'Correr.', vai:'c15_correu'}
  ]
},

c15_acendeu_a_lanterna:{
  texto:[
    d=>(d.flags.conheceu_nair && Historia.jaAconteceu('c15_nair_viu'))
      ? `Você aponta ${c15_comoLuz()} pro chão, a três metros da sua frente, que é o que a Ylva fez, porque apontar na cara é ameaça e apontar no chão é aviso.`
      : `Você aponta ${c15_comoLuz()} pro chão, a três metros da sua frente, porque apontar na cara é ameaça e apontar no chão é aviso.`,
    'Quarenta segundos.',
    'Trinta.',
    'A dez segundos, o som muda: de galope pra galope mais curto, que é como Pokémon grande desacelera.',
    'Eles param.',
    'Os três, a uns quinze metros, na borda do cone de luz, em fila.',
    'Raikou na frente, com o pelo em pé por carga constante e o ar em volta dele estalando de leve.',
    'Entei no meio, e o capim seco a dois metros dele começa a enrolar de calor.',
    'Suicune atrás, imóvel, e é o mais assustador dos três exatamente por causa disso.',
    'E o de trás — Suicune — olha a luz. Não você: a luz.',
    'Como quem reconhece uma coisa que já viu antes.',
    d=>d.flags.nair_fez_contato ? `Porque já viu. ${c15_Faz(d, C15_LANTERNA)}, numa madrugada, no acostamento, na mão de uma mulher de sessenta e três anos.` : ''
  ],
  ef:{flag:['acendeu_a_lanterna','encarou_os_caes','viu_os_tres','sabe_dos_tres'],
      executar:d=>{ GRUPO_CAES.forEach(x=>Estado.lend(x).encontros++); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Apontou a luz pro chão e não pra cara'},
      registrar:'Acendeu uma luz pro chão, e os três pararam a quinze metros.',
      presagio:'Ele reconheceu a luz. Não você.'},
  escolhas:[{texto:'Não se mexer.', vai:'c15_encontro'}]
},

c15_correu:{
  texto:[
    'Você corre.',
    'Você corre de uma coisa que faz noventa quilômetros por hora em terreno acidentado, com uma mochila de doze quilos, em capim de um metro e meio, no escuro.',
    'Dura quarenta segundos, e termina com você no chão.',
    'E nos quarenta segundos você não ouve nada atrás, o que é pior, porque quer dizer que eles não estão correndo atrás de você.',
    'Eles estão andando.'
  ],
  ef:{hp:-4, causa:'Queda ao correr no escuro, na ciclovia', moral:-5},
  escolhas:[{texto:'Se virar.', vai:'c15_encontro'}]
},

c15_escondeu:{
  texto:['Você sai do caminho e se joga atrás de um barranco, e a única coisa que existe no mundo nos próximos vinte segundos é a sua própria respiração, que parece absurdamente alta.'],
  teste:{status:'percepcao', dificuldade:8, nomeStatus:'Percepção',
         critico:'c15_viu_sem_ser_visto', sucesso:'c15_viu_sem_ser_visto', parcial:'c15_encontro', falha:'c15_encontro'}
},

c15_viu_sem_ser_visto:{
  texto:[
    'Você se esconde bem o suficiente pra ver sem participar, que é a única forma de ver essa coisa direito.',
    'Eles passam a quarenta metros.',
    'Três vultos, em fila, no mesmo passo, com quatro metros exatos entre um e outro.',
    'Raikou na frente. Entei no meio. Suicune atrás — e Suicune corre de um jeito que não levanta poeira, o que não deveria ser possível num chão que os outros dois estão levantando.',
    'Eles não estão caçando. Não tem Pokémon pra caçar.',
    d=>d.flags.sabe_do_circuito
      ? 'Eles estão fazendo o circuito do mapa do Xavi: mesmo trajeto, mesmo ritmo, com a precisão de coisa que já foi feita muitas vezes.'
      : 'Eles estão fazendo um caminho: mesmo trajeto, mesmo ritmo, com a precisão de coisa que já foi feita muitas vezes.',
    'Duzentos metros depois de você, eles param.',
    'Os três ao mesmo tempo, sem desacelerar antes, com os quatro metros de distância mantidos.',
    'E olham pro sul.',
    'Ficam assim dezenove minutos.',
    'Você cronometra, porque cronometrar é alguma coisa pra fazer.'
  ],
  ef:{flag:['viu_os_tres','sabe_dos_tres','caes_olham_cinnabar'],
      executar:d=>{ GRUPO_CAES.forEach(x=>Estado.lend(x).encontros++); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Ficou escondido e cronometrou'},
      registrar:'Os três param todos no mesmo ponto e olham pro sul por dezenove minutos.',
      presagio:'Dezenove minutos, parados, olhando.'},
  escolhas:[
    {texto:'Sair do esconderijo e chamar a atenção deles.', vai:'c15_encontro'},
    {texto:'Seguir eles.', vai:'c15_seguiu'},
    {texto:'Seguir de longe e vigiar onde eles param.', vai:'c15_vigiou_junto'},
    {texto:'Deixar passar.', vai:'c15_deixou_passar'}
  ]
},

c15_deixou_passar:{
  texto:[
    'Você espera quarenta minutos depois de eles sumirem e só então sai do barranco.',
    'A estrada está vazia.',
    'Você fez a coisa sensata: você é uma pessoa de {idade} anos com uma mochila, e eles são três coisas do tamanho de um carro, e não existe nenhuma leitura em que sair do barranco melhorasse alguma coisa.',
    'Você sabe que fez certo. Saber não ajuda.'
  ],
  ef:{flag:'evitou_os_caes', moral:-8,
      executar:()=>{ Relogio.avancar(1); return []; }},
  escolhas:[
    {texto:'Voltar e esperar outra madrugada.', vai:'c15_esperou_a_madrugada'},
    c15_contar(),
    {texto:'Seguir eles pelo rastro.', vai:'c15_seguiu_a_trilha', cond:c15_nova('c15_seguiu_a_trilha')},
    {texto:'Seguir viagem.', vai:'c15_fim'}
  ]
},

c15_seguiu:{
  texto:[
    'Você segue três lendários a pé.',
    'É uma ideia ruim, e você tem consciência plena disso a cada passo, e você continua, e essa é a definição de tudo o que você fez desde que saiu de casa.',
    'Eles não andam rápido quando não estão correndo — andam em ritmo de patrulha, uns seis quilômetros por hora, e dá pra acompanhar de longe se você não tiver pressa e não fizer barulho.',
    'Você segue por umas duas horas.',
    'Quando clareia, eles descem pra uma praia de pedra no fim do trecho dezoito, embaixo da falésia do mirante, de frente pro mar e pra ilha do outro lado.',
    d=>d.flags.c15_ja_via_a_praia ? 'A mesma praia. Os mesmos lugares gastos.' : '',
    'E fazem uma coisa que você não esperava nunca.',
    'Deitam.',
    'Os três, virados pro sul, com quatro metros entre um e outro, em três lugares onde a areia está compactada há anos.',
    d=>d.flags.c15_ja_via_a_praia ? '' : 'E a quatro metros deles tem um quarto lugar, menor, do tamanho de uma pessoa sentada, vazio.',
    'E ficam.'
  ],
  ef:{flag:['seguiu_os_caes','caes_vigiam_cinnabar'],
      executar:d=>{ Estado.marcar('c15_ja_via_a_praia', !!d.flags.achou_a_praia); Estado.marcar('achou_a_praia');
                    c15_ate(6); Estado.marcar('c15_onde', 'sul'); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Seguiu três lendários a pé e não atacou nenhum'},
      hp:-3, causa:'Duas horas seguindo a pé no escuro',
      registrar:'Os três deitam numa praia de pedra no fim do trecho 18, olhando Cinnabar.'},
  escolhas:[
    {texto:'Acampar e vigiar junto, a distância.', vai:'c15_vigiou_junto'},
    {texto:'Chegar perto.', vai:'c15_encontro'},
    {texto:'Sentar no quarto lugar.', vai:'c15_sentou_no_quarto', cond:c15_nova('c15_sentou_no_quarto')},
    c15_contar()
  ]
},

c15_vigiou_junto:{
  texto:[
    d=>Historia.jaAconteceu('c15_seguiu')
      ? 'Você acampa a cento e cinquenta metros, em cima, no capim, e vigia. Sem fogo, sem barulho, sem luz.'
      : 'Você segue de longe até eles terminarem a volta e descerem pra uma praia de pedra no fim do dezoito, e acampa a cento e cinquenta metros, em cima, no capim. Sem fogo, sem barulho, sem luz.',
    'Passa o dia inteiro.',
    'Eles não se mexem o dia inteiro — só um deles, Entei, levanta duas vezes, anda uns vinte metros e volta pro mesmo lugar, do jeito que Arcanine faz quando o corpo não aguenta mais ficar parado.',
    'De madrugada, Raikou levanta a cabeça e olha exatamente na sua direção.',
    'Não na direção geral. Na sua.',
    'Ele sabia que você estava ali desde o começo. Ele deixou.',
    'Depois volta a deitar.',
    'De manhã, quando você acorda — porque você dormiu, o que é absurdo —, eles não estão mais lá.',
    'E do lado da sua barraca, no chão de terra batida, tem três marcas de pata.',
    'Uma de cada. Em fila. A quarenta centímetros da sua cabeça.',
    'Eles vieram até você enquanto você dormia e escolheram não fazer absolutamente nada.'
  ],
  ef:{flag:['caes_te_toleram','achou_a_praia'],
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); if(L.disposicao==='neutro') L.disposicao='passivo'; });
                    Relogio.amanhaAs(7); Estado.marcar('c15_onde', 'sul'); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Dormiu a cento e cinquenta metros de três lendários'},
      moral:10,
      registrar:'Os três passaram do lado da sua barraca enquanto você dormia e não fizeram nada.',
      presagio:'A quarenta centímetros da sua cabeça. Eles quiseram que você soubesse.'},
  escolhas:[
    {texto:'Ficar e vigiar mais uma noite.', vai:'c15_vigiou_junto'},
    {texto:'Esperar eles voltarem e chegar perto.', vai:'c15_encontro'},
    c15_contar(),
    {texto:'Seguir viagem.', vai:'c15_fim'}
  ]
},

/* mais uma noite de vigia: uma vez já disse o que tinha pra dizer */
c15_vigiou_de_novo:{
  repetivel:true,
  texto:[
    'Você fica mais uma noite, no mesmo lugar, sem fogo.',
    'Eles voltam pra praia antes de clarear, deitam nos mesmos três lugares, e não olham pra você nenhuma vez.',
    'De manhã, as marcas de ontem continuam do lado da barraca, e não tem marca nova.',
    'Uma vez já disse o que tinha pra dizer.'
  ],
  ef:{executar:()=>{ Relogio.amanhaAs(7); return []; }},
  escolhas:[
    {texto:'Esperar eles voltarem e chegar perto.', vai:'c15_encontro'},
    c15_contar(),
    {texto:'Seguir viagem.', vai:'c15_fim'}
  ]
},

c15_ficou:{
  texto:[
    'Você fica no meio do caminho.',
    'Não é coragem exatamente — é a sensação, que você não sabe explicar, de que correr seria a pior decisão possível.',
    'Você fica de pé, com as mãos pra baixo, e conta.',
    'Trinta segundos.',
    'Vinte.',
    'A dez segundos você consegue ver o brilho, porque Raikou brilha.',
    'A cinco você sente o calor do Entei na cara.',
    'Eles param a doze metros.',
    'Os três, ao mesmo tempo, sem desacelerar antes — de noventa por hora pra zero em menos de um segundo, o que não é fisicamente possível e acontece.',
    'Silêncio absoluto por quatro segundos.',
    'E depois um barulho pequeno e ridículo: o capim seco voltando a se levantar atrás deles.'
  ],
  ef:{flag:['encarou_os_caes','viu_os_tres','sabe_dos_tres'],
      rep:{eixo:'bom',delta:2,motivo:'Não correu'},
      presagio:'De noventa pra zero. Eles pararam porque quiseram parar.'},
  escolhas:[{texto:'Continuar parad{o|a}.', vai:'c15_encontro'}]
},

c15_encontro:{
  texto:[
    d=>{ const livres = 3 - c15_presos().length;
         return livres === 3 ? 'Os três estão na sua frente.' : livres === 2 ? 'Dois deles estão na sua frente.' : 'Um deles está na sua frente.'; },
    ()=>c15_presos().some(l=>l.dex===243) ? '' : 'Raikou, com o pelo levantado por carga elétrica constante e um estalo baixo no ar em volta dele, como fio de alta tensão perto de chuva.',
    ()=>c15_presos().some(l=>l.dex===244) ? '' : 'Entei, com o ar tremendo em volta do corpo inteiro e uma linha de capim seco enrolando de calor a dois metros dele.',
    ()=>c15_presos().some(l=>l.dex===245) ? '' : 'Suicune, absolutamente imóvel, sem um fio de crista se mexendo com o vento, e o mais assustador dos três por causa disso.',
    ()=>{
      const n = c15_presos().length;
      if (n === 2) return 'Sozinho. Com os outros dois em Pokébolas suas. E "sozinho", nesse caso, é uma palavra que quer dizer uma coisa muito específica e muito perigosa.';
      if (n === 1) return 'Dois, e não três, porque o terceiro está numa Pokébola sua. E os dois que sobraram vieram exatamente por causa disso, fazendo o circuito inteiro pra chegar até aqui.';
      return 'Eles não avançam. Ficam ali, os três, a doze metros, olhando.';
    },
    d=>{
      if (c15_presos().length) return 'O que está mais perto dá um passo à frente e abaixa a cabeça — não em submissão. Em posição de investida.';
      if (d.flags.tem_sangue_nas_maos) return 'Entei dá um passo à frente. O asfalto embaixo da pata dele racha com o calor, e o som da rachadura é a coisa mais alta da noite.';
      if (d.flags.viu_a_sala_do_tanque || d.flags.leu_o_sete || d.flags.achou_a_mochila_do_fuji)
        return d.flags.c14_moltres_virou
          ? 'E aí Suicune faz uma coisa: vira a cabeça e olha pro sul, e depois volta pra você, e repete. Duas vezes.\nÉ o mesmo gesto que uma ave lendária fez com você na borda de uma cratera.'
          : 'E aí Suicune faz uma coisa: vira a cabeça e olha pro sul, e depois volta pra você, e repete. Duas vezes.';
      return 'Nenhum dos três avança. Eles estão te medindo, e estão fazendo isso com calma, o que é pior.';
    }
  ],
  ef:{flag:['viu_os_tres','sabe_dos_tres'],
      executar:d=>{ GRUPO_CAES.forEach(x=>Estado.lend(x).encontros++); return []; }},
  escolhas:[
    {texto:d=>c15_presos().length > 1 ? 'Soltar os que você tem. Agora.' : 'Soltar o que você tem. Agora.', vai:'c15_soltou_caes',
     cond:d=>c15_presos().length > 0},
    {texto:'Mostrar as mãos vazias e não se mexer.', vai:'c15_maos_vazias'},
    {texto:'Falar com eles. Em voz alta. Como se entendessem.', vai:'c15_falou'},
    {texto:'Oferecer comida.', vai:'c15_comida_caes', cond:d=>Estado.contaItem('Ração')>0},
    {texto:d=>c15_presos().length ? 'Atacar.' : 'Atacar. Os três numa estrada é uma chance única.', vai:'c15_luta_cao'}
  ]
},

c15_soltou_caes:{
  texto:[
    d=>Historia.jaAconteceu('c15_ficou_com_cao') ? 'Você espera a noite na saída do vilarejo, e não precisa esperar muito: os passos chegam antes da meia-noite, e param a doze metros.' : '',
    d=>(d.flags.c15_soltou_quantos || 1) > 1 ? 'Você tira as duas Pokébolas e abre as duas.' : 'Você tira a Pokébola e abre.',
    d=>(d.flags.c15_soltou_quantos || 1) > 1
      ? 'O que sai delas não corre pro outro. Ficam os dois parados, entre vocês, sem saber pra que lado ir — porque passaram tempo demais numa Pokébola, e andar junto não é uma chave que liga na hora.'
      : 'O que sai dela não corre pros outros. Fica parado, entre vocês, sem saber pra que lado ir — porque passou tempo demais numa Pokébola, e andar junto não é uma chave que liga na hora.',
    d=>(d.flags.c15_soltou_quantos || 1) > 1 ? 'O terceiro espera. Não chama, não empurra, não faz nada.' : 'Os outros esperam. Não chamam, não empurram, não fazem nada.',
    'Leva quase dois minutos, e os dois minutos são insuportáveis.',
    d=>(d.flags.c15_soltou_quantos || 1) > 1 ? 'Depois eles andam até ele. Devagar.' : 'Depois ele anda até eles. Devagar.',
    'E os três se acertam ali, na estrada, na frente de uma pessoa, com uma sequência de gestos pequenos e rápidos que você não entende e que claramente quer dizer alguma coisa.',
    'Só depois disso é que Suicune olha pra você de novo — e dessa vez não é investida.'
  ],
  ef:{executar:d=>{
        const avisos = [];
        const soltos = [...d.time, ...d.pc].filter(p => GRUPO_CAES.includes(p.dex));
        Estado.marcar('c15_soltou_quantos', soltos.length);
        if (Historia.jaAconteceu('c15_ficou_com_cao')) c15_ate(23);
        soltos.forEach(p => { Captura.soltar(p).forEach(e => avisos.push({tipo:e.tipo, texto:e.texto})); });
        GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); L.disposicao='desconfiado'; L.caçandoVoce=false; });
        Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade-3);
        return avisos;
      },
      rep:{eixo:'bom',delta:4,motivo:'Devolveu ao trio quem estava preso, na frente dele'},
      moral:15,
      flag:'devolveu_os_caes', registrar:'Soltou os lendários do trio que tinha capturado, na frente dos outros.',
      presagio:'Andar junto não é uma chave que liga na hora. Dois minutos.'},
  escolhas:[
    {texto:'Ficar parad{o|a} até eles irem.', vai:'c15_foram_embora'},
    {texto:'Falar com eles.', vai:'c15_falou'},
    {texto:'Mostrar as mãos vazias.', vai:'c15_maos_vazias'},
    {texto:'Sentar no chão.', vai:'c15_sentou_na_estrada'}
  ]
},

c15_sentou_na_estrada:{
  texto:[
    'Você senta no chão.',
    'É a coisa mais sem sentido que dá pra fazer, e você faz porque em pé você está tremendo, e sentad{o|a} não dá pra ver tremer.',
    'Eles não reagem por uns vinte segundos.',
    'E aí Entei anda até uns quatro metros de você e deita.',
    'Não relaxado: deita com as patas dianteiras estendidas, a cabeça alta, do jeito que Arcanine deita quando decide que vai ficar um tempo.',
    'E depois Raikou faz o mesmo, do outro lado.',
    'E Suicune não deita. Suicune fica de pé e olha pro sul, e não muda de posição nenhuma vez.',
    'Os três te deram companhia, e um deles continuou de guarda.',
    'Você fica sentad{o|a} no meio de uma ciclovia, de madrugada, com dois lendários deitados e um de guarda, e você não sabe o que está acontecendo, e nada de ruim está acontecendo.'
  ],
  ef:{flag:['sentou_com_os_caes','caes_te_toleram'],
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); if(L.disposicao!=='hostil') L.disposicao='passivo'; }); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Sentou no chão na frente de três lendários'},
      moral:20,
      registrar:'Sentou na ciclovia, e dois dos três deitaram perto. O terceiro ficou de guarda.'},
  escolhas:[
    {texto:'Falar com eles.', vai:'c15_falou'},
    {texto:'Ficar em silêncio até amanhecer.', vai:'c15_ate_amanhecer'},
    {texto:'Ver eles irem.', vai:'c15_foram_embora'},
    {texto:'Oferecer comida.', vai:'c15_comida_caes', cond:d=>Estado.contaItem('Ração')>0 && !Historia.jaAconteceu('c15_comida_caes')}
  ]
},

c15_ate_amanhecer:{
  texto:[
    'Você fica em silêncio até amanhecer.',
    'Duas horas e vinte.',
    'Em algum momento você deita de costas no asfalto da ciclovia, porque doía o quadril, e fica olhando o céu clarear.',
    'Entei dorme. Ele dorme de verdade — ronca de leve, e o ar em volta dele para de tremer quando ele dorme, o que quer dizer que aquilo é esforço e não natureza.',
    'Raikou não dorme, mas fecha os olhos.',
    'Suicune fica de pé as duas horas e vinte, virado pro sul, sem mudar de posição.',
    'Às seis e dez o céu clareia o suficiente pra você ver a ilha no horizonte.',
    'E Suicune, que estava de guarda a noite inteira, vira a cabeça e olha pra você pela primeira vez.',
    'E depois olha pra ilha.',
    'E depois pra você.',
    'Três vezes, devagar, como quem explica pra criança.'
  ],
  ef:{flag:['noite_com_os_caes','caes_pediram','caes_olham_cinnabar'],
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); L.disposicao='passivo'; }); c15_ate(6); return []; },
      rep:{eixo:'bom',delta:6,motivo:'Passou a noite inteira no asfalto com os três'},
      moral:25, hp:-3, causa:'Uma noite no asfalto',
      registrar:'Passou a noite com os três. O Suicune te mostrou a ilha três vezes.',
      presagio:'Como quem explica pra criança.'},
  escolhas:[
    {texto:'"Eu vou lá."', vai:'c15_prometeu_caes'},
    {texto:'"O que tem lá?"', vai:'c15_falou'},
    {texto:'Ficar em silêncio e deixar eles irem.', vai:'c15_foram_embora'},
    {texto:'"Eu já fui lá."', vai:'c15_ja_fui_la', cond:d=>!!d.flags.achou_moltres || !!d.flags.viu_a_sala_do_tanque}
  ]
},

c15_ja_fui_la:{
  texto:[
    c15_eu('Eu já fui lá.'),
    'Os três levantam ao mesmo tempo.',
    'Não é ameaça — é o movimento de três coisas que estavam deitadas e que ficaram de pé por causa de uma frase.',
    'Suicune anda até você. Até muito perto. Até a distância em que você sente a temperatura do hálito dele, que é fria, o que não faz sentido nenhum.',
    'E fica ali.',
    'E você entende que está sendo perguntad{o|a}, e que a pergunta não tem palavra, então você responde com o que tem:',
    d=>!d.flags.viu_a_sala_do_tanque ? ''
      : fala(d.jogador.nome, (d.flags.fuji_saiu || d.flags.blaine_sem_enterro) ? `O tanque está vazio. ${c15_tempoDoTanque()}.` : 'O tanque está vazio. Arrancado de dentro pra fora.'),
    d=>!d.flags.sabe_que_subiram ? ''
      : fala(d.jogador.nome, d.flags.achou_a_mochila_do_fuji
          ? 'O homem que saiu de lá com ele subiu o vulcão, de madrugada, com ele do lado. A mochila dele ainda está lá em cima. Ninguém viu nenhum dos dois descer.'
          : 'O homem que saiu de lá com ele subiu o vulcão, de madrugada, com ele do lado. Ninguém viu nenhum dos dois descer.'),
    d=>(d.flags.achou_moltres && !d.flags.viu_a_sala_do_tanque && !d.flags.sabe_que_subiram)
      ? fala(d.jogador.nome, 'Eu subi o vulcão. Tem uma ave de fogo lá em cima, e ela já estava olhando pra mim antes de eu chegar.') : '',
    'Suicune fica na sua frente por uns quinze segundos.',
    'E depois faz uma coisa que você não sabe como contaria pra alguém:',
    'ele encosta a testa no seu ombro.',
    'E deixa ali. Uns três segundos.',
    'E depois vira e vai, e os outros dois vão atrás, e eles não correm — andam.'
  ],
  ef:{flag:['contou_pros_caes','caes_aliados'],
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); L.disposicao='passivo'; L.aliado=true; });
        return [{tipo:'mundo', texto:'Os três souberam. Eles estavam esperando alguém que tivesse ido.'}]; },
      rep:{eixo:'bom',delta:7,motivo:'Contou a três lendários o que viu na ilha que eles olham'},
      moral:30, instabilidade:-2,
      registrar:'Contou aos três o que viu em Cinnabar. O Suicune encostou a testa no seu ombro.'},
  escolhas:[
    {texto:'Ver eles irem.', vai:'c15_foram_embora'},
    {texto:'"Eu vou lá de novo. Se vocês quiserem."', vai:'c15_prometeu_caes'},
    {texto:'Ficar sentad{o|a} no asfalto um tempo.', vai:'c15_foram_embora'},
    c15_contar()
  ]
},

c15_maos_vazias:{
  texto:[
    'Você abre as mãos, devagar, e não se mexe mais.',
    'Cinquenta segundos.',
    'Entei é o primeiro a relaxar — o ar em volta dele para de tremer, e o capim seco a dois metros dele para de enrolar.',
    'Depois Raikou: o estalo baixo some e o pelo baixa.',
    'Suicune leva mais tempo e nunca relaxa completamente.',
    'Eles contornam você pela estrada, os três, passando a menos de dois metros, na fila, mantendo os quatro metros entre eles.',
    'Entei encosta de leve no seu braço ao passar.',
    'Não é carinho. É o jeito de dizer "eu podia".',
    'O pelo dele está a uma temperatura que devia queimar e não queima, e você não consegue parar de pensar nisso.'
  ],
  ef:{executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); if(L.disposicao==='neutro') L.disposicao='passivo'; }); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Ficou de mãos abertas diante de três lendários'},
      moral:8,
      flag:'caes_passaram'},
  escolhas:[
    {texto:'Ver eles irem.', vai:'c15_foram_embora'},
    {texto:'Falar com eles antes de sumirem.', vai:'c15_falou'},
    {texto:'Seguir eles.', vai:'c15_seguiu', cond:c15_nova('c15_seguiu')},
    {texto:'Sentar no chão.', vai:'c15_sentou_na_estrada'}
  ]
},

c15_comida_caes:{
  texto:[
    'Você coloca a ração na estrada e recua três passos.',
    'Raikou cheira de longe e ignora. Entei nem olha.',
    'Suicune anda até a ração, olha, e depois olha você — e você podia jurar que aquele olhar era de pena.',
    'Eles não comem ração.',
    'Eles não comem nada que você tenha, nem nada que exista em loja, e você sabia disso antes de abrir a mochila, e abriu mesmo assim, porque não tinha outra coisa pra oferecer.',
    'Mas Suicune fica.',
    'Os outros dois seguem, e Suicune fica mais dez segundos olhando pra você antes de ir.',
    'E nesses dez segundos ele não olha pra ração nenhuma vez.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Ração'); const L=Estado.lend(245); if(L.disposicao==='neutro') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:2,motivo:'Ofereceu o que tinha, mesmo sendo inútil'},
      flag:'suicune_ficou'},
  escolhas:[
    {texto:'Falar com ele.', vai:'c15_falou'},
    {texto:'Ver eles irem.', vai:'c15_foram_embora'},
    {texto:'Sentar no chão.', vai:'c15_sentou_na_estrada'},
    {texto:'Tentar capturar o Suicune, agora que ele ficou.', vai:'c15_luta_cao',
     ef:{rep:{eixo:'ruim',delta:2,motivo:'Atacou o único lendário que tinha ficado'}, flag:['traiu_suicune','c15_contra_o_suicune'], moral:-20,
         executar:d=>{ GRUPO_CAES.forEach(x=>{Estado.lend(x).disposicao='hostil';}); return []; }}}
  ]
},

c15_falou:{
  texto:[
    c15_eu('Vocês estão olhando pra Cinnabar.'),
    d=>{ const h = c15_hora(d); return `Você diz isso em voz alta, numa estrada vazia, ${h < 5 ? 'de madrugada' : 'com o dia clareando'}, pra três Pokémon lendários.`; },
    'Raikou vira a cabeça de lado.',
    'Um gesto tão de Growlithe de rua, tão comum, tão de Pokémon que não entendeu a frase mas entendeu que teve frase, que quebra alguma coisa na sua cabeça.',
    'Eles não entendem palavra.',
    'Mas entenderam que você falou, e entenderam que você falou olhando pro sul, porque direção do olhar é uma língua que todo Pokémon fala.',
    'Suicune anda até você — até muito perto, até você sentir o hálito frio — e depois vira e olha pro sul também.',
    d=>d.flags.conheceu_otavio
      ? 'Vocês dois ficam ali, lado a lado, olhando a mesma ilha, por um tempo que você não consegue medir e que o Xavi, se estivesse aqui, mediria.'
      : 'Vocês dois ficam ali, lado a lado, olhando a mesma ilha, por um tempo que você não consegue medir.'
  ],
  ef:{flag:['falou_com_os_caes','caes_vigiam_cinnabar'],
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); if(L.disposicao!=='hostil') L.disposicao='passivo'; }); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Falou com três lendários como quem fala com alguém'},
      moral:10,
      registrar:'Falou com os três lendários. O Suicune olhou pra Cinnabar junto com você.',
      presagio:'Direção do olhar é uma língua que todo Pokémon fala. É a única que vocês têm em comum.'},
  escolhas:[
    {texto:'"Eu vou lá."', vai:'c15_prometeu_caes'},
    {texto:'"Eu já fui lá."', vai:'c15_ja_fui_la', cond:d=>!!d.flags.achou_moltres || !!d.flags.viu_a_sala_do_tanque},
    {texto:'"Não tem mais nada lá."', vai:'c15_nao_tem_mais_nada', cond:d=>!!d.flags.viu_a_sala_do_tanque},
    {texto:'Ficar em silêncio.', vai:'c15_foram_embora'}
  ]
},

c15_nao_tem_mais_nada:{
  texto:[
    c15_eu('Não tem mais nada lá.'),
    'Você diz isso, e no segundo em que você termina a frase você percebe que é a coisa mais cruel que dá pra dizer, porque três coisas estão olhando pra lá há anos por causa do que tem lá.',
    'Raikou solta um som.',
    'Não é rugido. É um som baixo, curto, na garganta, e é exatamente o som que Arcanine faz quando alguém mexe na porta de casa.',
    'Suicune não reage.',
    'Entei senta. Senta mesmo, no asfalto, como Growlithe esperando o dono, e olha pro sul.',
    'E você fica com a sensação horrível de ter chegado num velório e dito "ele já morreu, gente" pra quem estava ali havia anos.'
  ],
  ef:{flag:'disse_que_nao_tem_nada',
      moral:-15,
      rep:{eixo:'bom',delta:1,motivo:'Disse a verdade, mesmo sendo a pior versão dela'},
      registrar:'Disse aos três que o tanque está vazio. O Entei sentou no asfalto.',
      presagio:'Chegar num velório e dizer "ele já morreu, gente".'},
  escolhas:[
    {texto:'"Mas alguém saiu vivo dali."', vai:'c15_ja_fui_la', cond:d=>!!d.flags.fuji_saiu || !!d.flags.sabe_que_subiram},
    {texto:'"Desculpa."', vai:'c15_sentou_na_estrada'},
    {texto:'"Eu vou lá de novo."', vai:'c15_prometeu_caes'},
    {texto:'Ficar em silêncio.', vai:'c15_foram_embora'}
  ]
},

c15_prometeu_caes:{
  texto:[
    c15_eu('Eu vou lá.'),
    'Suicune olha pra você mais uma vez e sai andando — não corre. Anda.',
    'Os outros dois seguem.',
    'A trinta metros, os três param e olham pra trás ao mesmo tempo, esperando você começar a andar.',
    'Eles não estão te acompanhando.',
    'Eles estão conferindo se você vai cumprir.',
    'Você dá o primeiro passo, e eles viram e vão, e a última coisa que você vê é o capim se levantando atrás deles.'
  ],
  ef:{flag:['caes_conferindo','prometeu_aos_caes'],
      rep:{eixo:'bom',delta:3,motivo:'Prometeu a três lendários que iria à ilha'},
      moral:10,
      registrar:'Prometeu aos três que iria a Cinnabar.',
      presagio:'Eles estão conferindo. Isso é uma dívida sem prazo e sem número.'},
  escolhas:[
    {texto:'Começar a andar pra Fuchsia.', vai:'c15_fim'},
    c15_contar(),
    {texto:'Voltar ao mirante primeiro.', vai:'c15_mirante'}
  ]
},

c15_luta_cao:{
  texto:[
    d=>{ const n = 3 - c15_presos().length; return n === 3 ? 'Você saca uma Pokébola numa estrada, contra três.' : n === 2 ? 'Você saca uma Pokébola numa estrada, contra dois.' : 'Você saca uma Pokébola numa estrada, contra um.'; },
    d=>{ const n = 3 - c15_presos().length; return n === 3 ? 'Dois deles recuam — não por medo. Por acordo.' : n === 2 ? 'Um deles recua — não por medo. Por acordo.' : ''; },
    d=>3 - c15_presos().length > 1 ? 'Eles decidem, em algum lugar que não é aqui e que você não tem como ver, que é um contra um.' : '',
    d=>d.flags.c15_contra_o_suicune ? 'O que fica é o Suicune, que tinha ficado.' : 'O que fica é o que você escolheu olhar primeiro.'
  ],
  repetivel:true,
  ef:{moral:-10},
  batalha:{aleatorio:false, dex:d=>d.flags.c15_contra_o_suicune && !c15_presos().some(l=>l.dex===245) ? 245 : c15_alvoDaLuta(),
           nivel:55, tipo:'lendario', fuga:true, ambiente:'campo',
           vitoria:'c15_pos_cao', derrota:'c15_pos_cao', fuga2:'c15_fugiu_dos_caes',
           captura:'c15_capturou_cao', gameover:'gameover'}
},

c15_pos_cao:{
  repetivel:true,
  texto:[
    'Ele recua pra junto dos outros.',
    'Os três te olham em silêncio por um tempo desconfortavelmente longo, e depois viram e vão embora juntos — no mesmo passo, sem pressa, com os quatro metros mantidos.',
    'Eles vieram, foram atacados por uma pessoa, e foram embora sem matar essa pessoa.',
    'Isso é a coisa mais próxima de julgamento que você já recebeu na vida.'
  ],
  ef:{executar:d=>{
        GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); L.ataquesSofridos++; if(L.ataquesSofridos>=2) L.disposicao='hostil'; });
        return [{tipo:'mundo', texto:'Os três se afastaram. Eles decidiram alguma coisa sobre você.'}];
      },
      rep:{eixo:'ruim',delta:2,motivo:'Atacou o trio lendário na ciclovia'}, moral:-10},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c15_luta_cao'},
    {texto:'Parar e mostrar as mãos vazias.', vai:'c15_maos_vazias'},
    {texto:'Parar e falar com eles.', vai:'c15_falou'},
    {texto:'Parar.', vai:'c15_foram_embora'}
  ]
},

c15_fugiu_dos_caes:{
  texto:[
    'Você foge de três lendários numa estrada aberta, o que só funciona porque eles deixam.',
    'Você entende isso enquanto corre — no meio da corrida, com o ar acabando — e não é uma sensação boa.',
    'Você para depois de uns quatrocentos metros, porque não dá mais, e olha pra trás, e eles estão exatamente onde estavam.',
    'Nem se mexeram.'
  ],
  ef:{hp:-3, causa:'Fuga na ciclovia', moral:-8},
  escolhas:[
    {texto:'Voltar.', vai:'c15_encontro'},
    {texto:'Continuar fugindo.', vai:'c15_fim'},
    c15_contar(),
    {texto:'Acampar e tentar outra noite.', vai:'c15_esperou_a_madrugada'}
  ]
},

c15_capturou_cao:{
  texto:[
    d=>{ const livres = 3 - c15_presos().length;
         return livres >= 2 ? 'A Pokébola fecha numa estrada aberta, na frente dos outros dois.'
              : livres === 1 ? 'A Pokébola fecha numa estrada aberta, na frente do último.'
              : 'A Pokébola fecha numa estrada aberta, e a estrada fica vazia.'; },
    d=>3 - c15_presos().length > 0 ? 'Eles não atacam.' : 'Não tem mais ninguém pra atacar.',
    d=>3 - c15_presos().length > 0 ? 'Isso é o mais perturbador de tudo: eles não atacam.' : '',
    d=>3 - c15_presos().length > 0 ? 'O que está mais perto dá um passo à frente e cheira a Pokébola no seu cinto, com o focinho a dez centímetros da sua cintura, e você não se mexe porque não dá.' : '',
    d=>3 - c15_presos().length > 0 ? 'Depois recua.' : '',
    d=>3 - c15_presos().length > 1 ? 'E aí os dois saem correndo — não pra longe. Em volta.' : 3 - c15_presos().length === 1 ? 'E aí ele sai correndo — não pra longe. Em volta.' : '',
    d=>3 - c15_presos().length > 0 ? 'Um círculo de duzentos metros de raio, em velocidade máxima, em torno de você, e o chão vibra o círculo inteiro, e a única coisa que existe no mundo por noventa segundos é o som de alguma coisa correndo em volta de você.' : '',
    d=>3 - c15_presos().length > 1 ? 'Três voltas. E vão embora.' : 3 - c15_presos().length === 1 ? 'Três voltas. E vai embora.' : '',
    'Você acabou de ser marcad{o|a} de um jeito que não sai.'
  ],
  ef:{instabilidade:2, flag:'marcado_pelos_caes', moral:-15,
      registrar:'Capturou um dos três lendários na ciclovia. Os que sobraram deram três voltas em torno de você antes de sumir.'},
  escolhas:[
    {texto:'Soltar ali mesmo.', vai:'c15_soltou_caes'},
    {texto:'Ficar com ele.', vai:'c15_ficou_com_cao'}
  ]
},

c15_ficou_com_cao:{
  texto:[
    'Você segue com um dos três numa Pokébola sua.',
    'Nos dias seguintes, três coisas acontecem em ordem.',
    'Primeiro, você começa a ouvir passos à noite, sempre a uma distância que não dá pra confirmar, sempre parando quando você para.',
    'Segundo, os poucos Pokémon que ainda apareciam somem dos lugares por onde você anda. Todos. Como se avisassem uns aos outros com dois dias de antecedência.',
    d=>d.flags.c15_hale_ja_conhecia
      ? 'Terceiro, você volta ao vilarejo da Rota 17 e encontra o curral comunitário no chão de novo, e o cercado da casa do lado também, sem nenhum ferido, e o Sr. Hale recolocando mourão de eucalipto sozinho, com uma pá e muita raiva, pela quarta vez em dois meses.'
      : 'Terceiro, num vilarejo da Rota 17, você chega e encontra o curral comunitário no chão e o cercado da casa do lado também, sem nenhum ferido, e um homem de uns quarenta anos recolocando mourão de eucalipto sozinho, com uma pá e muita raiva.',
    d=>d.flags.c15_hale_ja_conhecia ? '' : 'Um vizinho passa e grita o nome dele, Hale, e pergunta se foi de novo. Foi: é a quarta vez em dois meses.',
    'E ele olha pra você e pergunta se você viu alguma coisa na estrada.',
    'E você diz que não.',
    'Eles não te atacam de frente.',
    'Eles andam na sua frente, abrindo coisa.'
  ],
  ef:{flag:'caes_caçam_voce', instabilidade:2, moral:-20,
      rep:{eixo:'ruim',delta:3,motivo:'Ficou com um dos três, e os outros começaram a destruir o que é dos outros'},
      executar:d=>{
        Estado.marcar('c15_hale_ja_conhecia', Historia.jaAconteceu('c15_vilarejo'));
        Nomes.apresentar('o dono do curral');
        GRUPO_CAES.forEach(x=>{const L=Estado.lend(x); if(L.estado!=='capturado'){L.disposicao='hostil';L.caçandoVoce=true;}});
        Relogio.amanhaAs(14); Relogio.amanhaAs(14);
        Estado.marcar('c15_onde', 'vilarejo');
        return []; },
      registrar:'Os outros dois lendários do trio passaram a abrir currais no seu rastro.'},
  escolhas:[
    {texto:'Soltar ali mesmo, quando anoitecer.', vai:'c15_soltou_caes'},
    {texto:'Ajudar a recolocar o mourão.', vai:'c15_ajudou_o_curral'},
    {texto:'Seguir.', vai:'c15_fim'},
    {texto:'Contar a verdade pro Sr. Hale.', vai:'c15_contou_pro_dono'}
  ]
},

c15_contou_pro_dono:{
  texto:[
    c15_eu('Foi por minha causa.'),
    'Ele para de cavar.',
    'Você conta: a Pokébola, a estrada, as três voltas.',
    'Ele ouve tudo apoiado na pá.',
    'E no fim ele não grita, não te bate, não te manda embora.',
    'Ele diz uma coisa pior:',
    fala('o dono do curral', 'E você vai soltar?'),
    'E fica esperando a resposta com a pá na mão, e você tem que responder na frente de um homem que está consertando um mourão pela quarta vez, e dessa vez por sua causa.'
  ],
  ef:{flag:'contou_pro_dono',
      npc:{nome:'Sr. Hale', opiniao:2, memoria:'Ouviu você admitir que os currais eram por sua causa, e perguntou se você ia soltar.'},
      rep:{eixo:'bom',delta:3,motivo:'Contou a verdade a quem estava pagando a conta'},
      moral:-5,
      presagio:'Ele perguntou e ficou esperando. Com a pá na mão.'},
  escolhas:[
    {texto:'"Vou." E soltar ali mesmo, quando anoitecer.', vai:'c15_soltou_caes'},
    {texto:'"Não." E encarar.', vai:'c15_disse_que_nao'},
    {texto:'Ajudar a recolocar o mourão primeiro.', vai:'c15_ajudou_o_curral'},
    {texto:'Ir embora sem responder.', vai:'c15_fim'}
  ]
},

c15_disse_que_nao:{
  texto:[
    c15_eu('Não.'),
    'Ele assente devagar e volta a cavar.',
    'E é isso: ele não discute, não xinga, não te manda embora.',
    'Ele cava o buraco do mourão, e você fica ali de pé uns dois minutos e depois vai embora, e ele não olha pra cima nenhuma vez.',
    'E na sua última olhada pra trás, saindo do vilarejo, dá pra ver ele ainda cavando, sozinho, no sol das duas da tarde.',
    'É a quarta vez que ele conserta.'
  ],
  ef:{flag:'disse_que_nao_solta',
      npc:{nome:'Sr. Hale', opiniao:-3, memoria:'Perguntou se você ia soltar, ouviu não, e voltou a cavar.'},
      rep:{eixo:'ruim',delta:3,motivo:'Disse que não ia soltar, na frente de quem paga a conta'},
      moral:-20,
      registrar:'Disse ao Sr. Hale que não ia soltar.'},
  escolhas:[
    {texto:'Voltar e soltar, quando anoitecer.', vai:'c15_soltou_caes'},
    {texto:'Voltar e ajudar a cavar, pelo menos.', vai:'c15_ajudou_o_curral'},
    {texto:'Seguir.', vai:'c15_fim'},
    {texto:'Mandar dinheiro pro vilarejo depois.', vai:'c15_fim', cond:d=>d.jogador.dinheiro>=8000, ef:{dinheiro:-8000, rep:{eixo:'bom',delta:1,motivo:'Pagou os mourões que custou'}}}
  ]
},

c15_foram_embora:{
  texto:[
    'Eles vão embora em fila, no mesmo passo, e o som some antes de eles sumirem de vista, o que é ao contrário do que deveria.',
    'Quase uma hora depois, um Rattata sai do capim, olha pra você, e some de novo.',
    'É o primeiro Pokémon que você vê no meio dessa estrada.',
    'E você fica absurdamente feliz de ver um Rattata.'
  ],
  ef:{flag:'caes_foram_embora', moral:5,
      executar:()=>{ Relogio.avancar(1); return []; }},
  escolhas:[
    {texto:'Seguir.', vai:'c15_fim'},
    c15_contar(),
    {texto:'Seguir eles pelo rastro.', vai:'c15_seguiu_a_trilha', cond:c15_nova('c15_seguiu_a_trilha')},
    {texto:'Voltar amanhã à noite.', vai:'c15_esperou_a_madrugada'}
  ]
},

c15_fim:{
  texto:[
    d=>{
      if (d.flags.contou_pros_caes) return 'Você contou a três coisas do tamanho de um carro, numa ciclovia de madrugada, o que você viu em Cinnabar. E uma delas encostou a testa no seu ombro.';
      if (d.flags.caes_caçam_voce) return 'Nos dias seguintes, cada lugar por onde você passa amanhece com alguma coisa aberta. Nunca ninguém ferido. Sempre alguma coisa aberta.';
      if (d.flags.caes_vigiam_cinnabar || d.flags.caes_olham_cinnabar)
        return d.flags.sabe_dos_tres
          ? 'Três lendários olhando pra mesma ilha há anos não é comportamento de caça nem de território. É comportamento de quem espera uma coisa sair de lá.'
          : 'Três coisas grandes olhando pra mesma ilha há anos não é comportamento de caça nem de território. É comportamento de quem espera uma coisa sair de lá.';
      return 'Você não sabe o que esvaziou essa estrada. Ninguém sabe. E quando ninguém sabe, a gente inventa a explicação, e quase sempre a nossa é pior que a verdadeira.';
    },
    d=>{
      if (d.flags.juntou_os_dados || d.flags.viu_a_frente) return 'E no caderno de um homem que anota tudo há treze anos, numa cabine de pedágio que não cobra pedágio há nove, tem uma frente de esvaziamento de um trecho por mês, e o trecho que falta é o último antes de Celadon.';
      if (d.flags.nair_sabe_o_nome) return 'E numa prancheta, ao lado de um desenho a lápis feito às quatro e meia da manhã com uma lanterna na boca, tem um nome escrito com a grafia conferida duas vezes.';
      if (d.flags.espantou_antes_da_caminhonete || d.flags.parou_a_caminhonete) return 'E no quilômetro dois, por um dia, a caminhonete branca voltou com as gaiolas vazias.';
      if (d.flags.o_barracao_da_trilha || d.flags.anotou_a_placa_da_caminhonete) return 'E num barracão a trezentos metros da cabine do sul, debaixo de uma lona, tem gaiola de transporte empilhada, limpa.';
      return 'E em três rotas de Kanto, nove placas de concreto continuam descrevendo espécies que não moram mais ali.';
    },
    'Você desce o resto da ciclovia até Fuchsia.',
    'No cais, um velho pescador está contando uma história em que ninguém acredita.',
    fala('o velho pescador', 'Eu vi um arco-íris de noite.'),
    fala('o velho pescador', 'Sobre a ilha que não tem nome. De noite.'),
    'Todo mundo ri.',
    'Você não.'
  ],
  ef:{executar:d=>{ c15_ir(d, 'fuchsia'); return []; }},
  sai:'fuchsia',
  fim:true, resumo:'Capítulo 15 concluído — os três estão esperando uma coisa sair de Cinnabar.'
}

}}

);

/* Opção que leva a lugar (o mirante, o capinzal, o vilarejo, a cabine,
   a Ylva, a ciclovia, a madrugada) não some depois da primeira vez: a
   volta ao lugar é outra cena (os `desvios`), e quem passa de novo pelo
   mesmo menu precisa poder ir de novo. A luta também se repete. */
(function(){
  const cap = CAPITULOS.find(c => c.num === 15);
  if (!cap) return;
  const VOLTA = new Set(['c15_mirante', 'c15_capinzal', 'c15_vilarejo', 'c15_cabine', 'c15_nair', 'c15_ciclovia',
    'c15_esperou_a_madrugada', 'c15_avisou_os_dois', 'c15_encontro', 'c15_luta_cao', 'c15_foram_embora',
    'c15_ajudou_o_curral', 'c15_soltou_caes', 'c15_vigiou_junto']);
  for (const cena of Object.values(cap.cenas))
    for (const e of (cena.escolhas || [])) if (VOLTA.has(e.vai)) e.repetivel = true;
})();
