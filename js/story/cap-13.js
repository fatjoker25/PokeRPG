/* ------------------------------------------------------------
   ABERTURAS — o gelo chegou pra cidade inteira, mas a notícia
   chega de jeitos diferentes: pelo cais, pelo rádio do bar,
   pela mão que dói de frio, ou por um chamado oficial.
   ------------------------------------------------------------ */
const C13_ABERTURAS = ['c13_cais', 'c13_ab_o_radio', 'c13_ab_o_frio', 'c13_ab_convocado', 'c13_ab_o_leilao'];
function c13_cabe(id, d){
  if (id === 'c13_ab_convocado') return typeof Cargos !== 'undefined' && !!Cargos.doCracha();
  if (id === 'c13_ab_o_leilao')  return d.jogador.dinheiro >= 4000;
  return true;
}
/* cada abertura acontece numa hora, e o relógio vai até ela (o cais
   cuida da própria hora: quem chega de noite fica até clarear) */
const C13_HORA_DA_ABERTURA = {c13_ab_o_radio:23, c13_ab_o_frio:7, c13_ab_convocado:5, c13_ab_o_leilao:6};
function c13_abertura(d){
  const cand = C13_ABERTURAS.filter(id => c13_cabe(id, d));
  const id = Dados.escolher(cand);
  if (d && d.relogio && C13_HORA_DA_ABERTURA[id] != null) c13_ate(C13_HORA_DA_ABERTURA[id]);
  if (d && d.flags && d.relogio) c13_chegou(d);
  return id;
}

/* ------------------------------------------------------------
   O TEMPO DO GELO. A água baixou de uma vez dezenove semanas antes
   do dia em que você chega a Fuchsia, e o texto conta daí: a data da
   queda, os meses do meio (a fábrica fechou no mês seguinte, o Tobin
   tentou devolver dois meses seguidos) e o mês de agora saem do
   calendário do jogo, não de um outubro escrito à mão. A queda pode
   ter sido antes de 1º de março: a conta volta pelo calendário.
   ------------------------------------------------------------ */
const C13_SEMANAS = 19;
function c13_chegou(d){
  if (d.flags.c13_chegada == null) d.flags.c13_chegada = d.relogio.dia;
  return d.flags.c13_chegada;
}
/* a data de `atras` dias antes do dia `dia` da jornada */
function c13_data(dia, atras){
  const C = Calendario;
  let abs = (dia || 1) - 1 + C.inicio() - 1 - (atras || 0), m = 0;
  while (abs < 0){ m = (m + 11) % 12; abs += C.DIAS[m]; }
  while (abs >= C.DIAS[m]){ abs -= C.DIAS[m]; m = (m + 1) % 12; }
  return {dia: abs + 1, mes: C.MESES[m], num: (m + 2) % 12 + 1};
}
/* o dia em que a água baixou três graus, e a véspera, em que o Estrela do Sul saiu */
function c13_queda(d){ return c13_data(c13_chegou(d), C13_SEMANAS * 7); }
function c13_vespera(d){ return c13_data(c13_chegou(d), C13_SEMANAS * 7 + 1); }
function c13_dia(x){ return x.dia === 1 ? 'primeiro' : porExtenso(x.dia); }
function c13_ext(x){ return `${c13_dia(x)} de ${x.mes}`; }
function c13_Ext(x){ const s = c13_ext(x); return s.charAt(0).toUpperCase() + s.slice(1); }
function c13_num(x){ return `${String(x.dia).padStart(2, '0')}/${String(x.num).padStart(2, '0')}`; }
/* o mês de `n` meses antes do mês em que você chegou (0 é o de agora) */
function c13_mes(d, n){
  const c = Calendario.de(c13_chegou(d));
  return Calendario.MESES[(((c.mes - (n || 0)) % 12) + 12) % 12];
}
/* o filho do Sr. Dane não voltou numa quarta, 12 de novembro de 1997,
   840 dias antes de 1º de março do ano do jogo: as quartas e os anos
   que ele conta saem daí */
function c13_diasDoFilho(d){ return 840 + (d.relogio.dia || 1) - 1 + Calendario.inicio() - 1; }
function c13_quartas(d){ return Math.floor(c13_diasDoFilho(d) / 7); }
function c13_anosDoFilho(d){
  const a = c13_diasDoFilho(d) / 365.25;
  return a >= 2.9 ? 'três anos' : a >= 2.5 ? 'quase três anos' : 'dois anos e pouco';
}

function c13_hora(d){ sincronizarHora(d.relogio); return d.relogio.hora; }
/* a próxima vez que der h horas, vivendo o tempo: na cidade o time come */
function c13_ate(h){
  const r = Estado.dados.relogio; sincronizarHora(r);
  const falta = (h - r.hora + 24) % 24;
  if (falta) Relogio.viver(falta);
}
function c13_umDia(){ const s = Calendario.hoje().semana; return s === 'sábado' || s === 'domingo' ? `um ${s}` : `uma ${s}-feira`; }
/* número no feminino: "duas horas", "cinquenta e duas quartas" */
function c13_fem(n){
  if (n === 100) return 'cem';
  if (n > 100 && n < 200) return 'cento e ' + c13_fem(n - 100);
  return porExtenso(n).replace(/\bum$/, 'uma').replace(/\bdois$/, 'duas');
}
function c13_horas(n){ return n === 1 ? 'uma hora' : `${c13_fem(n)} horas`; }
function c13_Horas(n){ const s = c13_horas(n); return s.charAt(0).toUpperCase() + s.slice(1); }
/* "às onze da manhã", "à uma da tarde", "ao meio-dia" */
function c13_aHora(h){
  if (h === 0) return 'à meia-noite';
  if (h === 12) return 'ao meio-dia';
  const p = h < 6 ? 'da madrugada' : h < 12 ? 'da manhã' : h < 18 ? 'da tarde' : 'da noite';
  const n = h % 12;
  return n === 1 ? `à uma ${p}` : `às ${c13_fem(n)} ${p}`;
}

/* O Staryu sai às cinco e chega às oito: o Sr. Dane não fica nas ilhas
   depois das quinze, porque o vento vira. A volta são outras três horas. */
function c13_atravessar(horas){ c13_ate(5); Relogio.avancar(horas || 3); }
const C13_VOLTA = {executar:()=>{ Relogio.avancar(3); return []; }};

/* A colônia abre das oito às seis. Fora disso você espera na calçada. */
function c13_esperaColonia(d){
  const h = c13_hora(d), fechada = h < 8 || h >= 18;
  Estado.marcar('c13_esperou_a_colonia', fechada);
  if (fechada) c13_ate(8);
}
function c13_linhaDaColonia(d){
  return d.flags.c13_esperou_a_colonia ? 'A colônia abre às oito. Você espera na calçada até a secretária chegar com a chave.' : '';
}
/* De noite o cais é de quem não tem pra onde ir: quem chega de noite
   fica até clarear, e o relógio vai até as cinco */
function c13_noite(d){
  const h = c13_hora(d), noite = h >= 20 || h < 5;
  Estado.marcar('c13_de_noite', noite);
  if (noite) c13_ate(5);
}

/* A câmara fria come segunda, quarta e sexta (a folha na porta), e
   quem leva chega às quatro e vinte da tarde. Quem espera ali espera
   a próxima entrega; quem acabou de ver uma espera a outra. */
const C13_DIAS_DE_BALDE = [0, 2, 4];
function c13_proximoBalde(d, depoisDeHoje){
  const hoje = Calendario.hoje().semanaIdx, h = c13_hora(d);
  for (let k = depoisDeHoje ? 1 : 0; k < 9; k++){
    const s = (hoje + k) % 7;
    if (C13_DIAS_DE_BALDE.includes(s) && (k > 0 || h < 16)) return {k, s, nome: Calendario.SEMANA[s]};
  }
  return {k: 0, s: hoje, nome: Calendario.SEMANA[hoje]};
}
function c13_esperarBalde(d, depoisDeHoje){
  const b = c13_proximoBalde(d, depoisDeHoje), h = c13_hora(d);
  Estado.marcar('c13_espera_k', b.k);
  Estado.marcar('c13_espera_dia', b.nome);
  Estado.marcar('c13_espera_horas', b.k === 0 ? Math.max(1, 16 - h) : 0);
  if (b.k === 0) c13_ate(16); else Relogio.ateODia(b.s, 16, true);
}
function c13_voltaNoDia(d){
  const k = d.flags.c13_espera_k, dia = d.flags.c13_espera_dia;
  return k == null || k === 1 || !dia ? 'no dia seguinte' : `na ${dia}`;
}
function c13_diaDaEspera(d){ return d.flags.c13_espera_dia || Calendario.hoje().semana; }
function c13_proximaEntrega(d){ const b = c13_proximoBalde(d, false); return b.k === 0 ? 'hoje' : b.k === 1 ? 'amanhã' : `na ${b.nome}`; }

/* ------------------------------------------------------------
   QUEM SABE O QUÊ. O capítulo tem três portas pro mesmo segredo — o
   livro da colônia, a fábrica de gelo e o barco do Amos — e cada fala
   conta só o que você já ouviu, e cada opção leva só aonde você já
   sabe ir.
   ------------------------------------------------------------ */
function c13_sabeDoTobin(d){ return !!d.flags.sabe_do_goro; }
function c13_sabeDoDane(d){ return !!(d.flags.sabe_do_ryuzo || d.flags.conheceu_ryuzo); }
/* o pequeno: que ele existe (você viu, ou ouviu), que está vivo, e onde */
function c13_sabeDoPequeno(d){ const f = d.flags; return !!(f.achou_o_filhote || f.sabe_do_segundo || f.sabe_do_barco || f.goro_contou || f.goro_sabe || f.entendeu_o_goro || f.goro_tentou); }
function c13_sabeQueVive(d){ const f = d.flags; return !!(f.achou_o_filhote || f.goro_contou || f.goro_sabe || f.entendeu_o_goro || f.goro_tentou); }
function c13_sabeOnde(d){ const f = d.flags; return !!(f.achou_o_filhote || f.goro_sabe || f.entendeu_o_goro); }
/* ele está com você, num caixote de gelo */
function c13_comVoce(d){ const f = d.flags; return !!f.levou_o_filhote && !f.devolveu_o_filhote && !f.c13_com_a_medica; }
/* dá pra chegar até ele: com você, num lugar que você sabe, com a médica, ou com o Tobin indo junto */
function c13_podePegar(d){ return c13_comVoce(d) || c13_sabeOnde(d) || !!d.flags.goro_vai || !!d.flags.c13_com_a_medica; }
/* a conversa com o Tobin acontece na sala dele ou na câmara fria */
function c13_naCamara(d){ return !!d.flags.c13_na_camara; }
/* quem entra na caverna com o caixote */
function c13_comQuem(d){ const f = d.flags; return f.c13_com_tobin_na_caverna ? 'tobin' : f.c13_com_dois_na_caverna ? 'dois' : 'sozinho'; }
/* o Tobin ainda sem nome, pra quem nunca ouviu falar dele */
function c13_tobinRotulo(d){ return d.flags.c13_sabia_do_tobin ? 'Tobin' : 'o homem da caixa térmica'; }
/* a palavra que faz o Tobin abrir a porta */
function c13_senha(d){
  const f = d.flags;
  if (f.sabe_do_estrela_do_sul || f.achou_a_linha) return 'Estrela do Sul';
  if (f.achou_o_filhote) return 'câmara fria';
  if (f.entrou_na_fabrica || f.viu_a_fabrica || f.sabe_da_fabrica) return 'fábrica de gelo';
  return c13_ext(c13_queda(d));
}
/* o que você tem pra contar, na ordem em que aconteceu */
function c13_fatos(d){
  const f = d.flags, p = [];
  if (f.sabe_da_data || f.achou_a_linha) p.push(`o ${c13_ext(c13_queda(d))}`);
  if (f.sabe_do_estrela_do_sul || f.achou_a_linha) p.push('o Estrela do Sul');
  if (f.goro_contou || f.sabe_do_barco) p.push('a rede cortada');
  if (f.goro_contou) p.push('o bote');
  if (f.achou_o_filhote || f.goro_sabe || f.entendeu_o_goro) p.push('a câmara fria da fábrica de gelo');
  if (f.achou_o_filhote || f.entendeu_o_goro) p.push('as dezenove semanas de ração marinha');
  if (f.achou_o_filhote || f.goro_contou) p.push('a asa que não abre');
  if (f.sabe_do_segundo) p.push('o grande esperando no fundo da caverna');
  if (!f.achou_o_filhote && !f.goro_sabe && !f.entendeu_o_goro){
    if (f.sabe_da_fabrica) p.push('a fábrica de gelo fechada gastando luz em dobro');
    if (f.viu_a_entrega_na_fabrica) p.push('a sacola de comida que entra cheia na fábrica e sai vazia');
    if (f.achou_o_goro) p.push('o Tobin indo pra fábrica com uma caixa térmica');
  }
  return p;
}
function c13_oQueVoceSabe(d){ const p = c13_fatos(d); return p.length ? p : ['o pouco que você juntou na cidade']; }
function c13_temOQueContar(d){ return c13_fatos(d).length > 0; }
function c13_lista(p){ return p.length < 2 ? (p[0] || '') : p.slice(0, -1).join(', ') + ' e ' + p[p.length - 1]; }
/* quem já viu o cais por dentro não ouve de novo o que é o cais */
function c13_jaConheceOCais(){
  return ['c13_cais', 'c13_ab_o_leilao', 'c13_quando_comecou', 'c13_domino', 'c13_procurar_barco'].some(id => Historia.jaAconteceu(id));
}
/* dá pra dizer pro grande onde o pequeno está */
function c13_podeDizerOnde(d){
  return (c13_sabeQueVive(d) || c13_sabeDoTobin(d) || c13_comVoce(d) || !!d.flags.c13_com_a_medica) && !Historia.jaAconteceu('c13_eu_sei_onde');
}
/* o vazio da parede: você já tinha visto antes da Pokébola */
function c13_jaViuOVazio(d){ const f = d.flags; return !!(f.viu_o_vazio || f.viu_a_cama || f.articuno_te_avaliou); }
/* o Tobin estava lá quando o pequeno voltou, e conta no cais */
function c13_tobinNoCais(d){ const f = d.flags; return !!(f.goro_devolveu || f.foram_os_tres || (f.foi_de_comboio && f.goro_vai)); }
/* Articuno conta como visto uma vez só, por onde quer que você chegue até ele */
function c13_viuArticuno(d){
  if (d.flags.achou_articuno) return;
  Estado.lend(144).encontros++;
  Estado.marcar('achou_articuno');
}
/* na rocha: quem sobe com você */
function c13_vocesNaRocha(d){
  const f = d.flags;
  if (f.c13_ficou_sozinho || f.capturou_articuno || f.saiu_com_articuno) return false;
  return c13_comQuem(d) !== 'sozinho' || (!!f.mobilizou_gente && !!f.devolveu_o_filhote && !f.c13_sozinho_na_caverna);
}
/* os dois barcos que a Defesa Civil procurava (a abertura do chamado)
   voltam na primeira cena em terra, e o texto conta uma vez, ali */
function c13_barcosVoltaram(d){
  if (d.flags.dois_barcos_sumidos && !d.flags.c13_barcos_voltaram) Estado.marcar('c13_barcos_voltaram', d.cena);
}
function c13_linhaDosBarcos(d){
  if (d.flags.c13_barcos_voltaram !== d.cena) return '';
  return d.cena === 'c13_colonia'
    ? 'Na calçada da colônia alguém te conta, sem você perguntar: os dois barcos que a Defesa Civil procurava voltaram rebocados, com o casco rachado de gelo e as sete pessoas vivas.'
    : 'Enquanto você olha, os dois barcos que a Defesa Civil procurava entram no cais rebocados, com o casco rachado de gelo e as sete pessoas vivas. Ninguém comemora. Todo mundo olha o casco.';
}

/* o velho do Staryu é o Amos pro cais e o Dane pro livro: antes de você
   conhecer, é o Amos; quem nunca ouviu falar dele pergunta no cais */
function c13_irAoDane(texto){
  return [
    {texto: d => d.flags.conheceu_ryuzo ? (texto || 'Ir até o barco do Sr. Dane.') : 'Ir atrás do Amos.', vai:'c13_ryuzo', cond:c13_sabeDoDane},
    {texto:'Procurar quem te leve às Seafoam.', vai:'c13_procurar_barco', cond:d=>!c13_sabeDoDane(d)}
  ];
}
/* de volta a Fuchsia sem ter resolvido nada: o que dá pra fazer em terra */
function c13_emTerra(){
  return [
    {texto:'Voltar às ilhas amanhã cedo.', vai:'c13_travessia'},
    {texto:'Procurar o Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin},
    {texto:'Contar tudo no cais.', vai:'c13_avisou_a_colonia', cond:d=>c13_temOQueContar(d) && !d.flags.avisou_a_colonia},
    {texto:'Ir à colônia.', vai:'c13_colonia'},
    {texto:'Ficar no cais.', vai:'c13_cais'},
    {texto:'Seguir para Cinnabar.', vai:'c13_fim'}
  ];
}
/* opções que só valem enquanto a cena não aconteceu */
function c13_nova(id){ return () => !Historia.jaAconteceu(id); }

/* ============================================================
   CAPÍTULO 13 — CONGELOU  (Ilhas Seafoam)
   ============================================================ */
CAPITULOS.push(
{
num:13, titulo:'Congelou', local:'Ilhas Seafoam', ambiente:'agua', nivelArea:42,
tom:'muito sombrio', entradas:C13_ABERTURAS,
inicio: d => c13_abertura(d),
/* Voltar a um lugar onde a primeira vez já aconteceu leva pro reencontro,
   não pra primeira vez de novo. */
desvios:{
  c13_cais:          {se:d=>c13_jaConheceOCais() && d.cena !== 'c13_cais', vai:'c13_cais_de_novo'},
  c13_procurar_barco:{se:d=>(Historia.jaAconteceu('c13_procurar_barco') || !!d.flags.conheceu_ryuzo) && d.cena !== 'c13_procurar_barco', vai:'c13_cais_de_novo'},
  c13_colonia:       {se:d=>Historia.jaAconteceu('c13_colonia') && d.cena !== 'c13_colonia', vai:'c13_colonia_de_novo'},
  c13_goro:          {se:d=>(Historia.jaAconteceu('c13_goro') || !!d.flags.conheceu_o_goro) && d.cena !== 'c13_goro', vai:'c13_goro_de_novo'},
  c13_ryuzo:         {se:d=>!!d.flags.conheceu_ryuzo && d.cena !== 'c13_ryuzo', vai:'c13_ryuzo_de_novo'},
  c13_camara_fria:   {se:d=>(Historia.jaAconteceu('c13_camara_fria') || !!d.flags.achou_o_filhote) && d.cena !== 'c13_camara_fria', vai:'c13_camara_de_novo'},
  c13_travessia:     {se:d=>Historia.jaAconteceu('c13_travessia') && d.cena !== 'c13_travessia', vai:'c13_travessia_de_novo'},
  c13_ilha:          {se:d=>Historia.jaAconteceu('c13_ilha') && d.cena !== 'c13_ilha', vai:'c13_ilha_de_novo'},
  c13_fundo:         {se:d=>Historia.jaAconteceu('c13_fundo') && d.cena !== 'c13_fundo', vai:'c13_fundo_de_novo'},
  /* depois que a caverna caiu, a devolução é no mar */
  c13_devolveu:      {se:d=>!!d.flags.c13_caverna_caiu && d.cena !== 'c13_devolveu', vai:'c13_devolveu_no_mar'},
  c13_goro_sozinho:  {se:d=>!!d.flags.c13_caverna_caiu && d.cena !== 'c13_goro_sozinho', vai:'c13_devolveu_no_mar'}
},
cenas:{

c13_ab_o_radio:{
  texto:[
    'Você está num bar de Fuchsia às onze da noite, numa mesa de fórmica, com um prato que já foi comida, quando o dono aumenta o rádio.',
    'Não é um gesto dramático. Ele aumenta o rádio do jeito que se aumenta o rádio: com a mão suja de louça, sem olhar.',
    'A voz do locutor é a voz de quem lê boletim marítimo há vinte anos e nunca leu nada assim.',
    fala('o locutor do rádio', 'Atenção à navegação. Formação de gelo à deriva no setor sul, latitude aproximada…'),
    'O bar inteiro fica quieto. Não é um bar grande: são onze pessoas, e as onze são de pesca.',
    fala('o locutor do rádio', '…recomenda-se suspensão de toda atividade de pesca no setor até novo aviso.'),
    'Um homem na ponta do balcão fala a frase que resume tudo:',
    d=>fala('o homem do balcão', `Gelo. Em ${c13_mes(d, 0)}.`),
    'Ninguém responde. Duas pessoas pagam a conta e saem, e o jeito que elas saem é o jeito de quem vai ligar pra alguém.'
  ],
  ef:{flag:'ouviu_no_radio',
      registrar:'O boletim marítimo anunciou gelo à deriva no setor sul e suspensão de toda a pesca.'},
  escolhas:[
    {texto:'Ir pro cais agora.', vai:'c13_cais'},
    {texto:'Ficar e ouvir o que o bar vai falar.', vai:'c13_ab_o_bar_falou'},
    {texto:'Dormir e ir à colônia de pescadores de manhã.', vai:'c13_colonia'}
  ]
},

c13_ab_o_bar_falou:{
  texto:[
    'Demora quase um minuto pra alguém falar, e é o dono, secando um copo.',
    fala('o dono do bar', 'Vai encalhar cardume.'),
    fala('o homem do balcão', 'Vai encalhar é gente.'),
    'O dono para de secar o copo.',
    'Uma mulher numa mesa do fundo, que tem uns sessenta anos e que estava jogando paciência sozinha com um baralho gasto, fala sem levantar a cabeça das cartas:',
    fala('a mulher do baralho', 'Em sessenta e três teve.'),
    'Todo mundo vira.',
    fala('a mulher do baralho', 'Nove dias. Meu pai ficou nove dias sem sair e no décimo saiu.'),
    d=>fala(d.jogador.nome, 'E aí?'),
    'Ela junta as cartas, bate o baralho na mesa pra alinhar, e começa outra rodada.',
    fala('a mulher do baralho', 'E aí a gente comeu no inverno.')
  ],
  ef:{flag:'ja_teve_em_sessenta_e_tres',
      npc:{nome:'a mulher do baralho', opiniao:0, viuVoce:'Te contou do gelo de 1963 sem levantar a cabeça das cartas.'},
      registrar:'Já houve gelo assim em 1963. Durou nove dias.'},
  escolhas:[
    {texto:'Perguntar o que aconteceu com o pai dela.', vai:'c13_ab_o_pai_dela'},
    {texto:'Ir pro cais.', vai:'c13_cais'},
    {texto:'Dormir e ir à colônia de pescadores de manhã.', vai:'c13_colonia'}
  ]
},

c13_ab_o_pai_dela:{
  texto:[
    'Ela joga uma carta antes de responder.',
    fala('a mulher do baralho', 'Voltou. Com a rede cheia e com três dedos a menos.'),
    fala('a mulher do baralho', 'Congelamento. Cortaram no posto, sem anestesia boa, em sessenta e três.'),
    'Outra carta.',
    fala('a mulher do baralho', 'Ele nunca reclamou dos dedos. Reclamava de outra coisa.'),
    d=>fala(d.jogador.nome, 'De quê?'),
    fala('a mulher do baralho', 'De que ninguém nunca perguntou por que tinha gelo.'),
    'Ela finalmente levanta a cabeça.',
    fala('a mulher do baralho', 'Trinta e sete anos. Você é a primeira pessoa que senta nesse bar e pergunta alguma coisa sobre sessenta e três.', 'baixo')
  ],
  ef:{flag:'ninguem_perguntou_por_que',
      npc:{nome:'a mulher do baralho', opiniao:2, viuVoce:'Você perguntou do pai dela e do gelo de 63.'},
      registrar:'Em 1963 ninguém investigou a causa do gelo. O pai dela perdeu três dedos e reclamava disso.'},
  escolhas:[
    {texto:'Ir pro cais.', vai:'c13_cais'},
    {texto:'Dormir e ir à colônia de pescadores de manhã.', vai:'c13_colonia'}
  ]
},

c13_ab_o_frio:{
  texto:[
    'Você acorda em Fuchsia com frio e leva um tempo pra entender que isso é um problema.',
    d=>`Fuchsia não tem frio. Fuchsia é a cidade mais ao sul de Kanto, o mês é ${c13_mes(d, 0)}, e ontem você dormiu por cima do cobertor.`,
    'Na rua, o termômetro da farmácia marca onze graus e tem uma fila na frente da farmácia, e a fila é de gente comprando as mesmas duas coisas: meia e pomada.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} está encostad${pron(p).o} na sua perna, o que ${pron(p).ele} não faz, e não sai de lá.`
               : 'Você fica com as mãos nos bolsos e não tira, e é a primeira vez em meses que você faz isso.';
    },
    'A padaria está sem pão porque o padeiro não veio. A escola soltou os alunos. Um homem passa com um ventilador debaixo do braço, indo devolver.',
    'E todo mundo, todo mundo mesmo, está andando no mesmo sentido: pro sul, pro cais.'
  ],
  ef:{hp:-2, causa:'Frio sem agasalho', flag:'o_frio_chegou_na_cidade',
      registrar:d=>`Fuchsia amanheceu com onze graus em ${c13_mes(d, 0)}. A cidade inteira foi pro cais.`},
  escolhas:[
    {texto:'Ir junto com todo mundo pro cais.', vai:'c13_cais'},
    {texto:'Comprar meia e pomada antes.', vai:'c13_ab_comprou_agasalho', cond:d=>d.jogador.dinheiro >= 300},
    {texto:'Ir à colônia de pescadores.', vai:'c13_colonia'}
  ]
},

c13_ab_comprou_agasalho:{
  texto:[
    'A farmácia de Fuchsia não vende agasalho porque Fuchsia nunca precisou de agasalho, então o que tem é: meia de algodão grossa, pomada de aquecimento muscular e luva de borracha de lavar louça.',
    'Você compra os três, como quase todo mundo da fila.',
    'A balconista embala sem comentar nada até a hora do troco.',
    fala('a balconista de Fuchsia', 'Isso aqui não é pra frio de verdade, tá?'),
    d=>fala(d.jogador.nome, 'Eu sei.'),
    fala('a balconista de Fuchsia', 'Se for pro gelo, isso aqui não serve.'),
    'Ela fala isso e olha pra fila atrás de você, que tem catorze pessoas comprando exatamente a mesma coisa.',
    fala('a balconista de Fuchsia', 'Eu tô falando isso pra todo mundo desde as sete da manhã.', 'baixo')
  ],
  ef:{dinheiro:-300, itens:{'Potion':1}, flag:'comprou_o_que_tinha',
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'Comprou meia, pomada e luva de borracha. A balconista avisou que não serve pro gelo.'},
  escolhas:[
    {texto:'Ir pro cais.', vai:'c13_cais'},
    {texto:'Ir à colônia de pescadores.', vai:'c13_colonia'}
  ]
},

c13_ab_convocado:{
  texto:[
    d=>{
      const c = Cargos.doCracha();
      return `O telefone do Centro Pokémon de Fuchsia toca às cinco e dez da manhã e a atendente atende, ouve, e vem te acordar pelo nome e pelo cargo de ${c ? c.nome : 'serviço'}.`;
    },
    'Isso nunca aconteceu antes. Você é acordad{o|a} porque é você, não apesar de ser você.',
    'Do outro lado da linha tem um homem com voz de quem já falou com quatorze pessoas hoje.',
    fala('o homem da Defesa Civil', 'Defesa Civil de Fuchsia. Estamos acionando todo mundo com registro na cidade.'),
    d=>fala(d.jogador.nome, 'Acionando pra quê?'),
    fala('o homem da Defesa Civil', 'Apoio ao cais. A frota não saiu e não vai sair.'),
    'Papel sendo virado do outro lado.',
    fala('o homem da Defesa Civil', 'E porque às quatro e quarenta a gente perdeu contato com dois barcos que saíram ontem contra a recomendação.'),
    'Silêncio de três segundos, que é o tempo de ele decidir se fala a próxima frase.',
    fala('o homem da Defesa Civil', 'Um deles é o da colônia. Tem sete pessoas nele.')
  ],
  ef:{flag:['convocado_pela_defesa_civil','dois_barcos_sumidos'],
      registrar:'A Defesa Civil de Fuchsia te acionou: dois barcos sumiram, um deles com sete pessoas a bordo.'},
  escolhas:[
    {texto:'Ir pro cais imediatamente.', vai:'c13_cais'},
    {texto:'Ir direto à colônia de pescadores.', vai:'c13_colonia'},
    {texto:'Perguntar o que exatamente esperam de você.', vai:'c13_ab_o_que_esperam'}
  ]
},

c13_ab_o_que_esperam:{
  texto:[
    d=>fala(d.jogador.nome, 'O que vocês esperam que eu faça?'),
    'A pergunta pega ele de surpresa, o que é revelador.',
    fala('o homem da Defesa Civil', 'Honestamente? Eu não sei.'),
    fala('o homem da Defesa Civil', 'Eu tenho uma lista de gente com registro e estou ligando na ordem da lista.'),
    d=>fala(d.jogador.nome, 'Quantos aceitaram?'),
    fala('o homem da Defesa Civil', 'Você é {o décimo quinto|a décima quinta}. Aceitaram quatro.'),
    'Ele para. Você ouve ele bebendo alguma coisa.',
    fala('o homem da Defesa Civil', 'Olha, eu vou ser claro. A Defesa Civil de Fuchsia é eu, mais duas pessoas e uma caminhonete.'),
    fala('o homem da Defesa Civil', 'A gente não tem barco pra gelo. Ninguém em Kanto tem barco pra gelo.'),
    fala('o homem da Defesa Civil', 'Se você for pro cais, você vai ser a quinta pessoa lá que não sabe o que fazer. Mas cinco é melhor que quatro.', 'baixo')
  ],
  ef:{flag:'a_defesa_civil_sao_tres',
      registrar:'A Defesa Civil de Fuchsia tem três pessoas e uma caminhonete. Você é {o quinto voluntário|a quinta voluntária}.'},
  escolhas:[
    {texto:'Ir pro cais.', vai:'c13_cais'},
    {texto:'Ir à colônia de pescadores.', vai:'c13_colonia'},
    {texto:'Procurar quem tenha barco que aguente.', vai:'c13_procurar_barco'}
  ]
},

c13_ab_o_leilao:{
  texto:[
    'Você chega no cais às seis da manhã e já tem leilão.',
    'Não é leilão oficial. É seis pessoas em volta de um homem de cinquenta e poucos anos que é dono do único barco de casco reforçado do cais, e ele está deixando os seis subirem o preço.',
    fala('o dono do casco reforçado', 'Quatro mil.'),
    fala('um dos seis', 'Quatro e quinhentos.'),
    fala('outro dos seis', 'Cinco.'),
    'Os seis não são pescadores. São três jornalistas, um homem de terno que está muito mal vestido pra um cais, e dois que você não consegue classificar.',
    d=>`Você tem ${Number(d.jogador.dinheiro).toLocaleString('pt-BR')} ₽ e uma decisão que não é sobre dinheiro.`,
    'Do outro lado do cais, sessenta pescadores olham o leilão sem dar um lance nenhum, porque nenhum deles tem cinco mil e porque todos eles sabem o que tem lá fora.',
    'Um deles cospe na água.'
  ],
  ef:{flag:'o_leilao_do_casco_reforcado',
      registrar:'O único barco de casco reforçado de Fuchsia está sendo leiloado a quem pagar mais.'},
  escolhas:[
    {texto:'Dar um lance.', vai:'c13_ab_deu_lance'},
    {texto:'Não dar lance. Falar com os pescadores.', vai:'c13_ab_falou_com_eles'},
    {texto:'Perguntar ao dono por que ele está leiloando.', vai:'c13_ab_por_que_leilao'},
    {texto:'Procurar outro barco.', vai:'c13_procurar_barco'}
  ]
},

c13_ab_deu_lance:{
  texto:[
    d=>{
      const v = Math.min(d.jogador.dinheiro, 5500);
      return fala(d.jogador.nome, `${v.toLocaleString('pt-BR')}.`);
    },
    'Os seis viram. O de terno te olha de cima a baixo e ri uma vez, curto.',
    fala('o homem de terno', 'Seis mil.'),
    'E acaba. Acaba assim, em dois segundos, e você fica no cais com o dinheiro inteiro no bolso e sem barco.',
    'O dono do casco reforçado aperta a mão do homem de terno e os dois sobem.',
    'Um pescador do outro lado do cais, que viu tudo, fala pra você sem ironia nenhuma:',
    fala('o pescador', 'Você tentou. Ninguém aqui tentou.'),
    d=>fala(d.jogador.nome, 'Não adiantou.'),
    fala('o pescador', 'Adiantou que agora eu sei que dá pra tentar.')
  ],
  ef:{flag:'perdeu_o_leilao',
      registrar:'Perdeu o leilão do casco reforçado para um homem de terno.'},
  escolhas:[
    {texto:'Falar com os pescadores.', vai:'c13_ab_falou_com_eles'},
    {texto:'Procurar outro barco.', vai:'c13_procurar_barco'},
    {texto:'Ir à colônia de pescadores.', vai:'c13_colonia'}
  ]
},

c13_ab_por_que_leilao:{
  texto:[
    'Você atravessa a roda dos seis, que é grosseria, e pergunta direto:',
    d=>fala(d.jogador.nome, 'Por que você não leva os pescadores?'),
    'O dono do casco reforçado não fica bravo. Ele fica cansado, que é uma resposta pior.',
    fala('o dono do casco reforçado', 'Porque pescador quer ir buscar barco.'),
    d=>fala(d.jogador.nome, 'E esses aí querem o quê?'),
    fala('o dono do casco reforçado', 'Querem chegar perto, olhar, e voltar.'),
    'Ele aponta o casco do próprio barco com o pé.',
    fala('o dono do casco reforçado', 'Esse casco é reforçado pra gelo de rio. Pra gelo de rio, {moço|moça}.'),
    fala('o dono do casco reforçado', 'Se eu for buscar barco encalhado, eu não volto. Se eu for olhar e voltar, eu volto.'),
    'Ele diz isso alto o bastante pra os sessenta pescadores do outro lado ouvirem, e é pra eles que ele está falando.',
    fala('o dono do casco reforçado', 'Eu não sou covarde. Eu sou o único que ainda tem barco pra amanhã.', 'baixo')
  ],
  ef:{flag:'o_casco_e_de_gelo_de_rio',
      registrar:'O casco reforçado é para gelo de rio. Ele não aguenta resgate.'},
  escolhas:[
    {texto:'Falar com os pescadores.', vai:'c13_ab_falou_com_eles'},
    {texto:'Dar um lance mesmo assim.', vai:'c13_ab_deu_lance'},
    {texto:'Procurar outro barco.', vai:'c13_procurar_barco'}
  ]
},

c13_ab_falou_com_eles:{
  texto:[
    'Você atravessa o cais e senta na mureta do lado dos sessenta, e sentar do lado é diferente de chegar na frente.',
    'Leva uns dez minutos pra alguém falar com você.',
    fala('o pescador de gorro', 'Você é {o menino|a menina} do leilão.'),
    d=>fala(d.jogador.nome, 'Eu não dei lance.'),
    fala('o pescador de gorro', 'Eu sei. Por isso eu tô falando com você.'),
    'Ele aponta com o queixo pros trinta e nove barcos amarrados.',
    fala('o pescador de gorro', 'Esses barcos todos aqui, junto, aguentam o que aquele um não aguenta.'),
    d=>fala(d.jogador.nome, 'Então por que não saem?'),
    fala('o pescador de gorro', 'Porque não tem quem organize.'),
    'Ele diz isso olhando pra você, e você entende a frase um segundo depois do que devia.'
  ],
  ef:{flag:'os_trinta_e_nove_juntos', moral:1,
      npc:{nome:'o pescador de gorro', opiniao:2, viuVoce:'Você sentou do lado deles em vez de dar lance.'},
      registrar:'Os 39 barcos de Fuchsia aguentariam juntos o que o casco reforçado não aguenta sozinho. Falta quem organize.',
      presagio:'Ele disse "não tem quem organize" olhando pra você. Isso não foi uma informação.'},
  escolhas:[
    {texto:'Ir à colônia de pescadores organizar isso.', vai:'c13_colonia'},
    {texto:'Sentar na mesa de dominó e ouvir mais.', vai:'c13_domino'},
    {texto:'Procurar um barco só pra você.', vai:'c13_procurar_barco'}
  ]
},


c13_cais:{
  texto:[
    d=>d.flags.c13_de_noite
      ? 'Você chega no cais de noite e não vai embora. Ninguém vai: tem gente dormindo sentada nos caixotes, e o cais não esvazia. Às cinco começa a clarear.'
      : '',
    'O cais de Fuchsia tem quarenta e dois barcos e trinta e nove deles estão amarrados.',
    d=>{
      const h = c13_hora(d), mes = c13_mes(d, 0), domingo = Calendario.hoje().semana === 'domingo';
      const cedo = h < 7 ? 'de manhã cedo' : 'de manhã';
      if (h < 12) return domingo
        ? `É domingo de ${mes}, ${cedo}, e cais de pesca não guarda domingo: esse é o horário em que ele deveria estar vazio de barco e cheio de gente.`
        : `Não é domingo. É ${c13_umDia()} de ${mes}, ${cedo}, que é o horário em que um cais de pesca deveria estar vazio de barco e cheio de gente.`;
      return `É ${domingo ? 'domingo' : c13_umDia()} de ${mes}, ${h < 18 ? 'de tarde' : 'no fim da tarde'}, e a essa hora a frota deveria estar entrando com a rede cheia, com o cais cheio de gente esperando pra descarregar.`;
    },
    d=>c13_hora(d) < 12 ? 'Está o contrário.' : 'Tem a gente. Não tem frota.',
    d=>c13_linhaDosBarcos(d),
    'Tem umas sessenta pessoas no cais, sentadas, encostadas, jogando dominó numa mesa de plástico, e trinta e nove barcos amarrados atrás delas.',
    'Você pergunta pro primeiro o que aconteceu e ele responde apontando o horizonte com o queixo, sem falar nada.',
    'Lá no sul, na altura das Seafoam, num dia limpo como hoje, dá pra ver uma linha branca em cima do mar.',
    'Gelo.',
    d=>`Gelo no mar, em Kanto, em ${c13_mes(d, 0)}, a três horas de barco da costa e avançando.`
  ],
  ef:{executar:d=>{ c13_noite(d); c13_barcosVoltaram(d); return []; },
      registrar:d=>`A frota de Fuchsia está parada. Há gelo no mar, em ${c13_mes(d, 0)}.`,
      presagio:'Trinta e nove barcos amarrados. Isso é uma economia inteira parada.'},
  escolhas:[
    {texto:'Procurar quem te leve até lá.', vai:'c13_procurar_barco'},
    {texto:'Perguntar quando começou.', vai:'c13_quando_comecou'},
    {texto:'Ir à colônia de pescadores.', vai:'c13_colonia'},
    {texto:'Sentar na mesa de dominó e ouvir.', vai:'c13_domino'}
  ]
},

/* o cais de novo: o mesmo lugar, e tudo o que dá pra fazer a partir dele */
c13_cais_de_novo:{
  repetivel:true,
  texto:[
    d=>c13_linhaDosBarcos(d),
    d=>d.flags.avisou_o_cais
      ? 'O cais está diferente: os trinta e nove barcos estão em terra, em cima de rolo de tronco, e sem eles a água do cais parece maior.'
      : 'O cais continua como estava: gente sentada nos caixotes, barco amarrado, a linha branca lá no sul.',
    d=>d.flags.avisou_a_colonia
      ? 'Desde que você subiu na mesa de dominó, ninguém aqui fala de outra coisa, e todo mundo fala baixo.'
      : 'A mesa de dominó continua no mesmo lugar, e alguém já está esperando o quarto jogador.'
  ],
  ef:{executar:d=>{ c13_barcosVoltaram(d); return []; }},
  escolhas:[
    {texto:'Perguntar quando começou.', vai:'c13_quando_comecou', cond:c13_nova('c13_quando_comecou')},
    {texto:'Sentar na mesa de dominó.', vai:'c13_domino', cond:c13_nova('c13_domino')},
    {texto:'Procurar quem te leve às Seafoam.', vai:'c13_procurar_barco', cond:d=>!Historia.jaAconteceu('c13_procurar_barco') && !c13_sabeDoDane(d)},
    {texto:d=>d.flags.conheceu_ryuzo ? 'Ir até o barco do Sr. Dane.' : 'Ir atrás do Amos.', vai:'c13_ryuzo', cond:c13_sabeDoDane},
    {texto:'Ir à colônia de pescadores.', vai:'c13_colonia'},
    {texto:'Ir até a fábrica de gelo.', vai:'c13_fabrica', cond:d=>(!!d.flags.sabe_da_fabrica || !!d.flags.viu_a_fabrica) && !d.flags.entrou_na_fabrica},
    {texto:'Voltar à câmara fria da fábrica.', vai:'c13_camara_fria', cond:d=>!!d.flags.entrou_na_fabrica && !d.flags.devolveu_o_filhote},
    {texto:'Procurar o Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin},
    {texto:'Contar tudo no cais.', vai:'c13_avisou_a_colonia', cond:d=>c13_temOQueContar(d) && !d.flags.avisou_a_colonia},
    {texto:'Seguir para Cinnabar.', vai:'c13_fim', cond:d=>Historia.jaAconteceu('c13_travessia')}
  ]
},

c13_quando_comecou:{
  falante:'o magro de boné',
  vozes:['P','N','P','N','P','N','N','P','N','N'],
  texto:[
    '"Quando começou?"',
    'A resposta vem de três pessoas ao mesmo tempo e todas dão a mesma data, o que é raro num cais.',
    d=>`"${c13_Ext(c13_queda(d))}."`,
    '"Como vocês sabem o dia?"',
    'Um deles — magro, de boné — ri.',
    d=>`"Porque no dia ${c13_ext(c13_queda(d))} a água baixou três graus de um dia pro outro."`,
    '"Três graus em um dia?"',
    '"Três graus em um dia. Todo barco daqui tem termômetro de fundo, {moço|moça}, porque cardume de Magikarp segue temperatura. A gente anota todo dia desde sempre, é o caderno de bordo."',
    'Ele bate no bolso da camisa.',
    d=>`"${c13_Ext(c13_vespera(d))}: dezenove e meio. ${c13_Ext(c13_queda(d))}: dezesseis e meio."`,
    '"E depois?"',
    '"E depois desce meio grau por semana, sem falhar uma, até hoje."',
    'Ele faz a conta com o dedo no ar.',
    '"Dezenove semanas. Nove graus e meio a menos. E hoje tem gelo."'
  ],
  ef:{flag:['sabe_da_data','sabe_da_curva'],
      rep:{eixo:'bom',delta:2,motivo:'Perguntou quando, e a resposta era um número'},
      registrar:d=>{ const q = c13_queda(d); return `A água baixou 3 graus em ${q.dia} de ${q.mes} e desce meio grau por semana desde então.`; },
      presagio:'Meio grau por semana, sem falhar uma. Isso não é clima. Clima falha.'},
  escolhas:[
    {texto:d=>`"O que aconteceu no dia ${c13_ext(c13_queda(d))}?"`, vai:'c13_quatro_de_junho'},
    {texto:'Ir à colônia ver os registros.', vai:'c13_colonia'},
    ...c13_irAoDane(),
    {texto:'Sentar na mesa de dominó.', vai:'c13_domino', cond:c13_nova('c13_domino')}
  ]
},

c13_quatro_de_junho:{
  falante:'a mulher da beirada do cais',
  vozes:['P','N','P','N','N'],
  texto:[
    d=>`"O que aconteceu no dia ${c13_ext(c13_queda(d))}?"`,
    'E aí o cais inteiro fica quieto.',
    'Não é silêncio dramático. É silêncio de gente que estava conversando e parou porque a conversa mudou de assunto e o assunto novo é ruim.',
    'O magro de boné olha pros outros. Os outros olham pro chão.',
    'Depois de uns dez segundos, uma mulher de uns cinquenta anos, sentada na beirada do cais com os pés pra fora, responde sem virar:',
    d=>`"No dia ${c13_ext(c13_vespera(d))} o Estrela do Sul saiu pra arrasto de fundo na quebra das Seafoam."`,
    '"E?"',
    d=>`"E voltou no dia ${c13_dia(c13_queda(d))} de manhã com a rede rasgada e sem contar pra ninguém o que tinha rasgado."`,
    'Ela cospe na água.',
    '"E o Tobin nunca mais saiu pra pescar."'
  ],
  ef:{flag:['sabe_do_estrela_do_sul','sabe_do_goro'],
      rep:{eixo:'bom',delta:3,motivo:'Fez a pergunta que calou o cais'},
      registrar:d=>{ const v = c13_vespera(d); return `O barco Estrela do Sul pescou na quebra das Seafoam em ${v.dia} de ${v.mes} e voltou com a rede rasgada.`; }},
  escolhas:[
    {texto:'"Onde mora o Tobin?"', vai:'c13_goro'},
    {texto:'Ir à colônia ver os registros.', vai:'c13_colonia'},
    ...c13_irAoDane()
  ]
},

c13_domino:{
  falante:'os pescadores',
  vozes:['N'],
  texto:[
    'Você senta no quarto lugar da mesa de dominó, que está vago, e ninguém reclama porque num cais parado a mesa aceita qualquer um.',
    'Você joga três partidas e perde três e ouve mais em uma hora do que conseguiria em uma semana de perguntas.',
    'Colhe isto:',
    '— A colônia tem seiscentos e quatro associados e trezentos e onze deles não recebem nada há dezenove semanas.',
    '— O auxílio do defeso não cobre isso, porque isso não é defeso: defeso é época de reprodução e tem data no calendário, e o que está acontecendo não tem data no calendário.',
    '— Quatro famílias já foram embora pra Vermilion.',
    '— E a frase que se repete, dita por quatro pessoas diferentes, com as mesmas palavras, o que quer dizer que alguém disse primeiro e a cidade adotou:',
    '"O mar avisa três vezes. Essa foi a segunda."'
  ],
  ef:{flag:['ouviu_o_domino','sabe_do_defeso'],
      executar:()=>{ Relogio.avancar(1); return []; },
      rep:{eixo:'bom',delta:2,motivo:'Sentou na mesa e perdeu três partidas'},
      registrar:'311 pescadores de Fuchsia estão sem renda há 19 semanas. O auxílio do defeso não cobre.',
      presagio:'"O mar avisa três vezes." Quatro pessoas disseram isso com as mesmas palavras.'},
  escolhas:[
    {texto:'"Quem foi o primeiro a dizer isso das três vezes?"', vai:'c13_quem_disse'},
    {texto:'Ir à colônia.', vai:'c13_colonia'},
    ...c13_irAoDane(),
    {texto:'Perguntar quando começou.', vai:'c13_quando_comecou', cond:c13_nova('c13_quando_comecou')}
  ]
},

c13_quem_disse:{
  vozes:['P','um dos da mesa','P','o da direita'],
  texto:[
    '"Quem foi o primeiro a dizer isso das três vezes?"',
    'Os três da mesa apontam, ao mesmo tempo e sem combinar, para o mesmo lugar: a ponta do molhe, onde tem um barco pequeno, azul, amarrado sozinho longe dos outros.',
    'E um homem muito velho sentado num caixote ao lado dele, sem fazer nada.',
    '"O Amos."',
    '"E por que ele fica lá sozinho?"',
    'O da direita joga uma pedra na mesa.',
    '"Porque ele é o único que tá dizendo que vai."'
  ],
  ef:{flag:'sabe_do_ryuzo'},
  escolhas:[
    {texto:'Ir falar com ele.', vai:'c13_ryuzo'},
    {texto:'Ir à colônia primeiro.', vai:'c13_colonia'},
    {texto:'Procurar o Tobin primeiro.', vai:'c13_goro', cond:c13_sabeDoTobin}
  ]
},

c13_colonia:{
  falante:'a secretária da colônia',
  vozes:['N'],
  texto:[
    d=>c13_linhaDaColonia(d),
    d=>c13_linhaDosBarcos(d),
    'A Colônia de Pescadores de Fuchsia fica num sobrado de dois andares na rua do cais, com uma placa de esmalte de 1958 e uma bandeira desbotada.',
    'No térreo tem uma sala com quatro cadeiras, um balcão e uma parede inteira de armário de aço.',
    d=>{ Nomes.apresentar('a secretária da colônia'); return 'A secretária tem sessenta e dois anos, um crachá de plástico com EDITH escrito à mão, é associada desde os dezessete, e faz questão de dizer isso na primeira frase.'; },
    '"Associada desde os dezessete, meu bem. Registro de saída de embarcação é documento público. Qualquer um pode consultar. Ninguém consulta nunca."',
    'Ela abre o armário sem você pedir duas vezes.',
    'É um livro por ano, encadernado, com uma linha por saída: nome do barco, mestre, data e hora de saída, área declarada de pesca, data e hora de retorno.',
    'O mais velho é de 1939. Sessenta e um anos de livros.'
  ],
  ef:{flag:'achou_a_colonia',
      executar:d=>{ c13_esperaColonia(d); c13_barcosVoltaram(d); return []; },
      npc:{nome:'a secretária da colônia', opiniao:2, memoria:'Abriu o armário dos registros de saída de embarcação sem hesitar.'},
      rep:{eixo:'bom',delta:2,motivo:'Foi ao único lugar de Kanto onde o registro é aberto de verdade'},
      registrar:'A colônia de pescadores de Fuchsia tem 61 anos de registros de saída de embarcação, abertos a consulta.',
      presagio:'"Ninguém consulta nunca." Ela disse isso como quem diz o tempo.'},
  escolhas:[
    {texto:'Procurar as saídas para as Seafoam.', vai:'c13_saidas_espuma'},
    {texto:'Procurar o Estrela do Sul.', vai:'c13_estrela_do_sul', cond:d=>!!d.flags.sabe_do_estrela_do_sul},
    {texto:'Procurar quem sai mais.', vai:'c13_quem_sai_mais'},
    {texto:'Procurar o livro de 1997.', vai:'c13_registro_97', cond:d=>!!d.flags.sabe_do_filho_do_ryuzo},
    {texto:'Agradecer e ir pro cais.', vai:'c13_cais'}
  ]
},

/* a colônia de novo: o armário continua aberto pra quem volta */
c13_colonia_de_novo:{
  repetivel:true,
  falante:'a secretária da colônia',
  vozes:['N'],
  texto:[
    d=>c13_linhaDaColonia(d),
    'A Edith levanta os olhos por cima dos óculos quando você entra, e a mão dela já está no armário.',
    '"Voltou, meu bem. O livro não foge."'
  ],
  ef:{executar:d=>{ c13_esperaColonia(d); return []; }},
  escolhas:[
    {texto:'Procurar as saídas para as Seafoam.', vai:'c13_saidas_espuma', cond:c13_nova('c13_saidas_espuma')},
    {texto:'Procurar o Estrela do Sul.', vai:'c13_estrela_do_sul', cond:d=>!!d.flags.sabe_do_estrela_do_sul && !Historia.jaAconteceu('c13_estrela_do_sul')},
    {texto:'Procurar quem sai mais.', vai:'c13_quem_sai_mais', cond:c13_nova('c13_quem_sai_mais')},
    {texto:'Copiar as trinta e sete saídas.', vai:'c13_copiou_as_linhas', cond:d=>Historia.jaAconteceu('c13_saidas_espuma') && !Historia.jaAconteceu('c13_copiou_as_linhas')},
    {texto:'"Abre o outro livro."', vai:'c13_outro_livro', cond:d=>(Historia.jaAconteceu('c13_copiou_as_linhas') || Historia.jaAconteceu('c13_quem_sai_mais')) && !Historia.jaAconteceu('c13_outro_livro')},
    {texto:'"Quem vende gelo com a frota parada?"', vai:'c13_fabrica_de_gelo', cond:d=>Historia.jaAconteceu('c13_outro_livro') && !Historia.jaAconteceu('c13_fabrica_de_gelo')},
    {texto:'Procurar o livro de 1997.', vai:'c13_registro_97', cond:d=>!!d.flags.sabe_do_filho_do_ryuzo && !Historia.jaAconteceu('c13_registro_97')},
    {texto:'Agradecer e ir pro cais.', vai:'c13_cais'}
  ]
},

c13_saidas_espuma:{
  falante:'a secretária da colônia',
  vozes:['N','N'],
  texto:[
    'Você passa três horas no livro deste ano e no do ano passado.',
    '"Quebra das Seafoam" aparece como área declarada trinta e sete vezes em dois anos.',
    'E aí você percebe uma coisa lendo as colunas de horário:',
    'as saídas para a quebra das Seafoam são sempre entre vinte e duas e duas da manhã, e os retornos sempre entre nove e onze.',
    'Todas as outras áreas declaradas têm saída entre três e cinco da manhã, que é o horário normal de pesca.',
    'Você pergunta pra secretária e ela responde de cara, com a naturalidade de quem nunca precisou esconder:',
    '"Ah, arrasto de fundo na quebra é de noite porque o cardume da quebra sobe de noite."',
    'Pausa.',
    '"E porque arrasto de fundo é proibido num raio de seis milhas das ilhas, meu bem, e fiscal não trabalha de madrugada."',
    'Ela diz isso e volta a mexer no arquivo.',
    'Está escrito num livro público, na coluna de horário, há dois anos.'
  ],
  ef:{flag:['sabe_do_arrasto','provas_espuma'],
      executar:()=>{ Relogio.avancar(3); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Leu a coluna de horário e entendeu o que ela contava'},
      registrar:'Arrasto de fundo é proibido a seis milhas das Seafoam. As saídas para lá são sempre de madrugada.',
      presagio:'Fiscal não trabalha de madrugada. A informação estava na coluna de horário.'},
  escolhas:[
    {texto:d=>d.flags.sabe_do_estrela_do_sul ? 'Procurar o Estrela do Sul.' : 'Ler as trinta e sete linhas uma por uma.', vai:'c13_estrela_do_sul', cond:c13_nova('c13_estrela_do_sul')},
    {texto:'Copiar as trinta e sete linhas.', vai:'c13_copiou_as_linhas', cond:c13_nova('c13_copiou_as_linhas')},
    {texto:'Procurar quem sai mais.', vai:'c13_quem_sai_mais', cond:c13_nova('c13_quem_sai_mais')},
    ...c13_irAoDane()
  ]
},

c13_estrela_do_sul:{
  texto:[
    d=>d.flags.c13_ja_sabia_do_barco ? 'Você acha a linha.' : 'Uma das trinta e sete linhas não bate com as outras.',
    d=>`**ESTRELA DO SUL — mestre: Tobin — saída ${c13_num(c13_vespera(d))}, 23h10 — área declarada: quebra das Seafoam — retorno ${c13_num(c13_queda(d))}, 05h40**`,
    'Cinco e quarenta.',
    'Todas as outras saídas pra quebra voltam entre nove e onze.',
    d=>d.flags.sabe_da_data
      ? 'Essa voltou às cinco e quarenta, no escuro, três a cinco horas antes do normal, no dia em que a água baixou três graus.'
      : 'Essa voltou às cinco e quarenta, no escuro, três a cinco horas antes do normal.',
    'E na coluna de observação, que é um campo que quase ninguém preenche, tem uma anotação a caneta com letra de quem escreveu com pressa:',
    '**"ret. antec. — avaria em petrecho"**',
    'Avaria em petrecho é como se escreve "a rede rasgou" num livro oficial.',
    'Você fica olhando a linha por um tempo.',
    d=>d.flags.sabe_da_data
      ? 'A coisa que congelou duzentos quilômetros de mar está escrita numa linha de um livro de capa dura num sobrado de rua de cais, em letra a caneta, e ninguém leu.'
      : 'Uma rede rasgada numa madrugada, numa área proibida, escrita a caneta num livro de capa dura que ninguém leu.'
  ],
  ef:{flag:['achou_a_linha','provas_espuma','sabe_do_goro'],
      executar:d=>{ Estado.marcar('c13_ja_sabia_do_barco', !!d.flags.sabe_do_estrela_do_sul); Estado.marcar('sabe_do_estrela_do_sul'); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Achou a linha exata no livro exato'},
      instabilidade:1,
      registrar:d=>`Estrela do Sul, mestre Tobin: saída ${c13_num(c13_vespera(d))} 23h10, retorno antecipado ${c13_num(c13_queda(d))} 05h40, avaria em petrecho.`,
      presagio:d=>d.flags.sabe_da_data ? '"Avaria em petrecho." Três palavras e dezenove semanas de gelo.' : '"Avaria em petrecho." Três palavras, a caneta, com pressa.'},
  escolhas:[
    {texto:'Copiar a linha.', vai:'c13_copiou_as_linhas', cond:c13_nova('c13_copiou_as_linhas')},
    {texto:'"Onde mora o Tobin?"', vai:'c13_goro'},
    ...c13_irAoDane(),
    {texto:'Ver as outras saídas para as Seafoam.', vai:'c13_saidas_espuma', cond:c13_nova('c13_saidas_espuma')}
  ]
},

c13_copiou_as_linhas:{
  falante:'a secretária da colônia',
  vozes:['N','P','N','N','P','N','P','N'],
  texto:[
    'A secretária te empresta papel e caneta e te deixa copiar à vontade, e às tantas ela senta do outro lado do balcão e começa a ditar pra ir mais rápido, porque ela lê aquela letra melhor do que você.',
    'Trinta e sete linhas.',
    'Vinte e duas embarcações diferentes. Doze delas repetem.',
    'E quando você termina, ela olha a folha de cima a baixo, com os óculos na ponta do nariz, e faz um som com a boca.',
    '"Hm."',
    '"Que foi?"',
    '"Nada não." Ela devolve a folha. "É que dessas doze que repetem, sete são de gente que não tem barco."',
    '"Como assim não tem barco?"',
    '"Barco alugado. Sete deles são mestres contratados, meu bem. Eles não são donos. Eles levam o barco de outro."',
    '"E quem é o dono?"',
    'Ela vira pro armário.',
    '"Isso aí é outro livro."'
  ],
  ef:{flag:['tem_as_linhas','provas_espuma'],
      itens:{'Cópia das trinta e sete saídas':1},
      npc:{nome:'a secretária da colônia', opiniao:5, memoria:'Ditou as trinta e sete linhas para você e apontou os sete mestres contratados.'},
      rep:{eixo:'bom',delta:4,motivo:'Copiou trinta e sete linhas e encontrou uma pergunta melhor'},
      registrar:'Das 22 embarcações que pescam na quebra das Seafoam, sete são operadas por mestres contratados.',
      presagio:'"Isso aí é outro livro." Sempre tem outro livro.'},
  escolhas:[
    {texto:'"Abre o outro livro."', vai:'c13_outro_livro', cond:c13_nova('c13_outro_livro')},
    {texto:'Procurar o Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin},
    ...c13_irAoDane(),
    {texto:d=>d.flags.sabe_do_estrela_do_sul ? 'Procurar o Estrela do Sul no livro.' : 'Ler as trinta e sete linhas de novo, uma por uma.', vai:'c13_estrela_do_sul', cond:c13_nova('c13_estrela_do_sul')}
  ]
},

c13_outro_livro:{
  falante:'a secretária da colônia',
  vozes:['N','P','N','N'],
  texto:[
    'O outro livro é o cadastro de embarcações, e é mais fino e mais chato e tem exatamente a informação que ninguém procura.',
    'Nome da embarcação, número de inscrição, tonelagem, ano, e proprietário.',
    d=>Historia.jaAconteceu('c13_copiou_as_linhas')
      ? 'Você procura as sete. Quatro são de gente de Fuchsia, com nome e endereço na rua do cais. Três são da mesma empresa.'
      : 'Você procura o Terra Boa. Não é de pessoa nenhuma: é de uma empresa, que tem mais dois barcos no mesmo livro, os dois na lista da quebra.',
    '**PESCA E ARMAZENAGEM LINHA VERDE**',
    d=>d.flags.c13_ja_sabia_linha_verde
      ? 'Linha Verde. As quatro fazendas do lado do setor 7 da Zona Safári, compradas entre noventa e cinco e noventa e sete, são da Agropecuária Linha Verde.'
      : 'Você não conhece esse nome. Anota do mesmo jeito.',
    'A secretária lê por cima do seu ombro.',
    '"Essa aí eu conheço. Eles compraram a fábrica de gelo em noventa e oito."',
    '"Fábrica de gelo?"',
    '"A fábrica de gelo do cais, meu bem. Todo barco compra gelo pra conservar o que vem na rede."',
    'Ela ajeita os óculos.',
    '"Eles são donos de três barcos e da fábrica que vende gelo pros outros trinta e nove."'
  ],
  ef:{flag:['sabe_da_linha_verde_pesca','provas_espuma'],
      executar:d=>{ Estado.marcar('c13_ja_sabia_linha_verde', !!d.flags.sabe_da_linha_verde); Estado.marcar('sabe_da_linha_verde'); return []; },
      rep:{eixo:'bom',delta:5,motivo:'Puxou o cadastro de embarcações e achou o nome'},
      instabilidade:1,
      registrar:'A Pesca e Armazenagem Linha Verde é dona de três barcos da quebra das Seafoam e da fábrica de gelo do cais.'},
  escolhas:[
    {texto:'"Quem vende gelo com a frota parada?"', vai:'c13_fabrica_de_gelo'},
    {texto:'Procurar o Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin},
    {texto:'Procurar quem sai mais.', vai:'c13_quem_sai_mais', cond:c13_nova('c13_quem_sai_mais')},
    ...c13_irAoDane()
  ]
},

c13_fabrica_de_gelo:{
  falante:'a secretária da colônia',
  vozes:['P','N','N','P','N','N','P','N','P','N','N'],
  texto:[
    '"Quem vende gelo com a frota parada?"',
    'Ela para de mexer no armário.',
    '"Ninguém."',
    'Pausa.',
    d=>`"Eles fecharam em ${c13_mes(d, 3)}."`,
    '"E os funcionários?"',
    d=>`"Dezoito. Demitidos em ${c13_mes(d, 3)}, todos, com aviso prévio pago, o que é mais do que a maioria faz."`,
    'Ela fecha o armário.',
    '"E aí é a parte esquisita, meu bem, que eu nunca contei pra ninguém porque nunca ninguém perguntou."',
    '"Qual?"',
    d=>`"Eles não venderam o galpão. Eles não venderam a máquina. Eles pagaram o imposto do galpão de ${c13_mes(d, 2)} e ${c13_mes(d, 1)} e a conta de luz continua no nome deles, e eu sei porque a conta de luz do cais vem toda junta e passa por aqui."`,
    '"Uma fábrica de gelo fechada, sem funcionário, consumindo luz."',
    '"Consumindo luz."',
    'Ela olha pra você.',
    d=>`"E eu tenho os valores aqui, meu bem, e o consumo dobrou em ${c13_mes(d, 2)}."`
  ],
  ef:{flag:['sabe_da_fabrica','provas_espuma'],
      itens:{'Contas de luz da fábrica de gelo':1},
      npc:{nome:'a secretária da colônia', opiniao:8, memoria:'Te contou que a fábrica de gelo fechada dobrou o consumo de luz.'},
      rep:{eixo:'bom',delta:5,motivo:'Perguntou quem vende gelo quando ninguém compra'},
      instabilidade:1,
      registrar:d=>`A fábrica de gelo fechou em ${c13_mes(d, 3)}, demitiu 18, e dobrou o consumo de energia em ${c13_mes(d, 2)}.`,
      presagio:'Fábrica fechada com consumo dobrado. Alguém está guardando alguma coisa fria.'},
  escolhas:[
    {texto:'Ir ver a fábrica de gelo.', vai:'c13_fabrica'},
    {texto:'Procurar o Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin},
    ...c13_irAoDane()
  ]
},

c13_quem_sai_mais:{
  falante:'a secretária da colônia',
  vozes:['P','N','P','N','N','N','N','P','N','N'],
  texto:[
    '"Quem sai mais?"',
    'A secretária ri e faz a conta de cabeça, porque ela já fez essa conta sozinha em algum momento da vida por puro tédio.',
    '"O Terra Boa. Duzentas e quarenta saídas em dois anos."',
    '"Isso é muito?"',
    '"Isso é uma saída a cada três dias, meu bem, todo dia do ano, com chuva e com sol e com defeso."',
    'Ela para de rir.',
    '"Com defeso."',
    'Ela vira o livro do ano passado e procura com o dedo e acha, e mostra pra você: as datas de defeso estão carimbadas no topo da página, em vermelho, e embaixo delas tem quatro linhas do Terra Boa.',
    '"Isso aqui é do meu punho", ela diz. "Eu preenchi essas quatro linhas."',
    '"E ninguém nunca olhou."',
    '"Ninguém nunca olhou, meu bem. O livro fica aberto no balcão."',
    'Ela fecha com cuidado.',
    '"Eu trabalho aqui há quarenta e cinco anos e eu preenchi tudo certinho a vida inteira, e eu nunca virei a página pra ver o que eu tinha escrito."',
    d=>Historia.jaAconteceu('c13_outro_livro') ? 'De quem é o Terra Boa, você já sabe: está no cadastro, na página da Linha Verde.' : ''
  ],
  ef:{flag:['sabe_do_terra_boa','provas_espuma'],
      npc:{nome:'a secretária da colônia', opiniao:6, memoria:'Descobriu, com você, que preencheu de próprio punho quatro saídas em período de defeso.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou quem sai mais'},
      registrar:'O barco Terra Boa saiu 240 vezes em dois anos, incluindo quatro saídas em período de defeso.',
      presagio:'"Eu nunca virei a página pra ver o que eu tinha escrito." Quarenta e cinco anos.'},
  escolhas:[
    {texto:'"De quem é o Terra Boa?"', vai:'c13_outro_livro', cond:c13_nova('c13_outro_livro')},
    {texto:'Procurar as saídas para as Seafoam.', vai:'c13_saidas_espuma', cond:c13_nova('c13_saidas_espuma')},
    {texto:'Procurar o Estrela do Sul.', vai:'c13_estrela_do_sul', cond:d=>!!d.flags.sabe_do_estrela_do_sul && !Historia.jaAconteceu('c13_estrela_do_sul')},
    ...c13_irAoDane()
  ]
},

c13_registro_97:{
  falante:'a secretária da colônia',
  vozes:['N','P','N'],
  texto:[
    'A secretária não precisa procurar. Ela sabe o ano e sabe o mês e vai direto.',
    'Ela abre o livro de 1997 em novembro e vira pra você sem falar nada.',
    '**STARYU — mestre: A. Dane — saída 12/11, 04h20 — área declarada: canal sul — retorno: —**',
    'O campo de retorno está em branco.',
    'E abaixo dele, na coluna de observação, com uma letra que não é a de quem preencheu a linha:',
    '**"emb. retornou 13/11 às 22h com o mestre. tripulante 1 não retornou. E. Dane, 26 anos."**',
    'Vinte e seis anos.',
    'A secretária fecha o livro devagar.',
    '"Ele sai toda quarta pro canal sul, meu bem."',
    '"Fazer o quê?"',
    '"Olhar."'
  ],
  ef:{flag:['sabe_do_filho_do_ryuzo','sabe_do_canal_sul','sabe_do_ryuzo'],
      npc:{nome:'a secretária da colônia', opiniao:4, memoria:'Abriu o livro de 1997 sem precisar procurar a data.'},
      rep:{eixo:'bom',delta:2,motivo:'Foi ver o registro em vez de perguntar de novo'},
      moral:-8,
      registrar:'O filho do Amos Dane, 26 anos, não voltou de uma saída em 12/11/1997.',
      presagio:'Ela não precisou procurar a data. Todo mundo nessa cidade sabe essa data.'},
  escolhas:[
    ...c13_irAoDane('Ir até o barco do Sr. Dane.'),
    {texto:'Ver as saídas para as Seafoam.', vai:'c13_saidas_espuma', cond:c13_nova('c13_saidas_espuma')},
    {texto:'Ver o Estrela do Sul.', vai:'c13_estrela_do_sul', cond:d=>!!d.flags.sabe_do_estrela_do_sul && !Historia.jaAconteceu('c13_estrela_do_sul')},
    {texto:'Ir pro cais.', vai:'c13_cais'}
  ]
},

c13_fabrica:{
  texto:[
    'A fábrica de gelo fica na ponta oeste do cais, é um galpão de alvenaria de dois pavimentos com portão de enrolar e uma placa desbotada: **GELO — ATACADO E VAREJO**.',
    'Está fechada. Cadeado. Caixa de correio cheia.',
    'E você ouve o compressor daqui da calçada.',
    d=>`Um compressor industrial de fábrica de gelo fechada há três meses, funcionando ${c13_aHora(c13_hora(d))} de ${c13_umDia()}, num galpão trancado com cadeado e caixa de correio cheia.`,
    'Você dá a volta.',
    'Nos fundos tem a saída do condensador, e o ar que sai dela é o único ar quente do cais inteiro, e tem uma poça embaixo dele que nunca seca, e em volta da poça o chão de concreto está com aquela mancha branca de sal que só se forma onde a água evapora sempre.',
    'Está funcionando há meses.',
    'E o portão dos fundos tem um cadeado novo. Novo de verdade: a chapa ainda tem o brilho de galvanização de fábrica.'
  ],
  ef:{flag:['viu_a_fabrica','cadeado_novo'],
      rep:{eixo:'bom',delta:3,motivo:'Foi ver a fábrica em vez de anotar o consumo'},
      registrar:'A fábrica de gelo está com o compressor funcionando e um cadeado novo nos fundos.',
      presagio:'Cadeado novo numa fábrica fechada. Alguém entra ali.'},
  escolhas:[
    {texto:'Esperar alguém aparecer.', vai:'c13_esperou_na_fabrica', cond:d=>!Historia.jaAconteceu('c13_esperou_na_fabrica') && !d.flags.entrou_na_fabrica},
    {texto:'Arrombar.', vai:'c13_arrombou_a_fabrica', cond:d=>!d.flags.entrou_na_fabrica},
    {texto:'Entrar pelo portão dos fundos, por onde você já entrou.', vai:'c13_camara_fria', cond:d=>!!d.flags.entrou_na_fabrica},
    ...c13_irAoDane('Anotar e ir pras ilhas primeiro.'),
    {texto:'Procurar o Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin}
  ]
},

c13_esperou_na_fabrica:{
  texto:[
    d=>{
      const k = d.flags.c13_espera_k, n = d.flags.c13_espera_horas || 2;
      if (k != null && k !== 0) return `Ninguém aparece até a noite. Você volta ${c13_voltaNoDia(d)} e espera atrás de um contêiner de rede velha desde o almoço.`;
      return n > 9 ? 'Você espera atrás de um contêiner de rede velha a noite inteira e a manhã inteira.'
                   : `Você espera atrás de um contêiner de rede velha por ${c13_horas(n)}.`;
    },
    'Às dezesseis e vinte chega um homem de uns quarenta anos, de camionete, sozinho, com uma sacola de supermercado.',
    'Ele abre o cadeado novo, entra, fica dentro dezenove minutos, sai com a sacola vazia e vai embora.',
    'Ele levou comida.',
    'Uma pessoa levou uma sacola de supermercado para dentro de uma fábrica de gelo fechada e saiu com ela vazia em dezenove minutos.',
    'Tem alguém morando ali dentro.',
    'Ou tem alguma coisa comendo.'
  ],
  ef:{flag:['viu_a_entrega_na_fabrica'],
      executar:d=>{ c13_esperarBalde(d); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Esperou atrás de um contêiner até alguém aparecer'},
      instabilidade:1,
      registrar:'Alguém leva comida à fábrica de gelo fechada, às quatro e vinte da tarde.',
      presagio:'Dezenove minutos e a sacola voltou vazia.'},
  escolhas:[
    {texto:'Arrombar agora.', vai:'c13_arrombou_a_fabrica'},
    {texto:'Esperar a camionete voltar e seguir.', vai:'c13_seguiu_a_camionete'},
    ...c13_irAoDane('Ir pras ilhas primeiro.'),
    {texto:'Procurar o Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin}
  ]
},

c13_seguiu_a_camionete:{
  texto:[
    d=>`Você espera a camionete voltar, ${c13_voltaNoDia(d)}, na saída da rua do cais, e quando ela passa você vai atrás a pé, o que só funciona porque Fuchsia tem quatro mil habitantes e sete semáforos.`,
    'Ela para numa casa da rua de trás do posto de saúde.',
    'O homem desce, entra, e vinte minutos depois sai de novo — com outra pessoa.',
    'A outra pessoa tem uns sessenta anos, anda devagar, e carrega uma caixa térmica.',
    d=>`Um homem de sessenta anos com mão de pescador, carregando uma caixa térmica numa ${c13_diaDaEspera(d)}, numa cidade onde ninguém está pescando.`,
    d=>d.flags.c13_sabia_do_tobin ? 'Você entende sem ninguém apresentar. É o Tobin.' : 'Na caixa de correio da casa, pintado com tinta de barco: TOBIN.'
  ],
  ef:{flag:['achou_o_goro'],
      executar:d=>{ Estado.marcar('c13_sabia_do_tobin', !!d.flags.sabe_do_goro); Estado.marcar('sabe_do_goro'); c13_esperarBalde(d, true); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Seguiu a camionete até a pessoa certa'},
      registrar:'O homem que abastece a fábrica de gelo busca o Tobin antes de ir.',
      presagio:'Ele carrega uma caixa térmica. Pensa no que se carrega numa caixa térmica.'},
  escolhas:[
    {texto:'Abordar o Tobin ali, na calçada.', vai:'c13_goro', ef:{flag:'c13_abordou_na_calcada'}},
    {texto:'Seguir os dois até a fábrica.', vai:'c13_seguiu_ate_a_fabrica'},
    {texto:'Esperar os dois saírem da fábrica e entrar depois.', vai:'c13_arrombou_a_fabrica'},
    ...c13_irAoDane('Ir pras ilhas primeiro.')
  ]
},

c13_seguiu_ate_a_fabrica:{
  texto:[
    'Você segue a camionete de longe até a ponta oeste do cais.',
    'Os dois descem. O de quarenta abre o cadeado novo; o Tobin entra primeiro, com a caixa térmica, sem olhar pra trás.',
    'Você espera o portão encostar e entra atrás.',
    'Dentro é escuro e frio de verdade, e o compressor martela no fundo. A porta da câmara fria está aberta e sai luz amarela dela.',
    'Da porta dá pra ver: um ninho de rede de pesca dobrada no chão, e em cima dele um Articuno pequeno, com a asa esquerda enfaixada, levantando a cabeça pro homem que chega.',
    'Você pisa num pedaço de rede velha e ela faz barulho.',
    'Os dois viram.',
    'Ninguém grita. O Tobin põe a caixa térmica no chão, devagar, e fala com a voz de quem já esperou isso acontecer todo dia por dezenove semanas:',
    fala('Tobin', 'Você é da Liga?'),
    d=>fala(d.jogador.nome, 'Não.'),
    'Ele solta o ar.',
    fala('Tobin', 'Ainda bem.')
  ],
  ef:{flag:['conheceu_o_goro','achou_o_filhote','viu_o_segundo_articuno','entrou_na_fabrica'],
      executar:()=>{ Estado.marcar('c13_na_camara'); return []; },
      npc:{nome:'Tobin', opiniao:1, memoria:'Te viu entrar atrás dele na fábrica de gelo e perguntou se você era da Liga.'},
      rep:{eixo:'bom',delta:2,motivo:'Seguiu quem sabia até a porta certa'},
      moral:-5, instabilidade:1,
      registrar:'Tobin, mestre do Estrela do Sul, cuida do Articuno ferido numa câmara fria da fábrica de gelo.',
      presagio:'"Ainda bem." Ele tem medo da Liga, não de você.'},
  escolhas:[
    {texto:'"Foi você que pegou ele na rede."', vai:'c13_goro_conta', cond:d=>!!d.flags.sabe_do_estrela_do_sul},
    {texto:'"Por que você não devolveu?"', vai:'c13_porque_nao_devolveu'},
    {texto:'"Você sabe o que tá acontecendo no mar?"', vai:'c13_ele_sabe'},
    {texto:'Não dizer nada e deixar ele falar.', vai:'c13_goro_conta'}
  ]
},

c13_arrombou_a_fabrica:{
  texto:[
    'O cadeado é novo mas o portão é velho, e a dobradiça de baixo já estava solta antes de você chegar.',
    'Dentro é escuro, é úmido e é frio de verdade — uns quatro graus, com o compressor martelando no fundo.',
    'A fábrica é uma sala grande com as formas de gelo em blocos, uma ponte rolante e a câmara fria no fundo, com porta de isolamento e trava de alavanca.',
    'A câmara fria está ligada e tem uma luz acesa por baixo da porta.',
    'E na porta da câmara, colada com fita, tem uma folha de caderno com uma lista escrita a lápis:',
    '**seg — 2 baldes / qua — 2 baldes / sex — 2 baldes e o remédio**',
    'E embaixo, na mesma letra, outra linha:',
    '**"ele tá comendo. escreve pro Amos."**'
  ],
  ef:{flag:['entrou_na_fabrica','sabe_que_tem_alguem'],
      instabilidade:1,
      registrar:'Dentro da fábrica de gelo há uma câmara fria ligada, com escala de alimentação três vezes por semana.',
      presagio:'"Escreve pro Amos." Duas pessoas nessa cidade sabem.'},
  escolhas:[
    {texto:'Abrir a câmara fria.', vai:'c13_camara_fria'},
    {texto:d=>c13_sabeDoDane(d) ? 'Sair e ir atrás do Amos antes.' : 'Sair e perguntar no cais quem é o Amos.', vai:'c13_ryuzo'},
    {texto:'Sair e procurar o Tobin antes.', vai:'c13_goro', cond:c13_sabeDoTobin}
  ]
},

c13_camara_fria:{
  texto:[
    'A trava de alavanca faz um estalo que ecoa no galpão inteiro.',
    'A câmara fria é um cubo de três por três com prateleira de aço nas paredes e uma lâmpada amarela no teto.',
    'E no chão, sobre um ninho improvisado de rede de pesca dobrada muitas vezes, tem um Articuno.',
    'Pequeno. Menor do que devia. Com a asa esquerda enfaixada com atadura de Pokémon grande e esparadrapo.',
    'Ele está vivo. Ele levanta a cabeça quando a porta abre.',
    'E tem dois baldes ao lado dele, um com água e outro com ração marinha, e uma cadeira de plástico encostada na parede, virada pra ele.',
    'Uma cadeira de plástico.',
    'Alguém senta aqui.'
  ],
  ef:{flag:['achou_o_filhote','viu_o_segundo_articuno'],
      rep:{eixo:'bom',delta:3,motivo:'Abriu a câmara fria'},
      instabilidade:2, moral:-5,
      registrar:'O segundo Articuno está vivo, numa câmara fria de fábrica de gelo em Fuchsia, com a asa enfaixada.',
      presagio:'Uma cadeira de plástico virada pra ele. Alguém senta ali e fica.'},
  escolhas:[
    {texto:'Sentar na cadeira e esperar quem vem.', vai:'c13_esperou_na_camara'},
    {texto:'Levar ele embora agora.', vai:'c13_levou_o_filhote'},
    {texto:'Fechar a porta e ir procurar o Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin},
    {texto:d=>c13_sabeDoDane(d) ? 'Fechar a porta e ir atrás do Amos.' : 'Fechar a porta e perguntar no cais quem é o Amos.', vai:'c13_ryuzo'}
  ]
},

/* a câmara fria de novo: ele continua ali, ou o ninho ficou vazio */
c13_camara_de_novo:{
  repetivel:true,
  texto:[
    d=>c13_comVoce(d) || d.flags.devolveu_o_filhote
      ? 'A câmara fria está vazia. O ninho de rede de pesca continua dobrado no chão, com o formato dele ainda marcado.'
      : 'A câmara fria está como sempre: a lâmpada amarela, os dois baldes, a cadeira de plástico virada pro ninho de rede.',
    d=>c13_comVoce(d) || d.flags.devolveu_o_filhote ? '' : 'O Articuno pequeno levanta a cabeça quando a porta abre, e baixa de novo quando vê quem é.'
  ],
  escolhas:[
    {texto:'Levar ele embora agora.', vai:'c13_levou_o_filhote', cond:d=>!c13_comVoce(d) && !d.flags.devolveu_o_filhote && !Historia.jaAconteceu('c13_levou_o_filhote')},
    {texto:'Sentar na cadeira e esperar quem vem.', vai:'c13_esperou_na_camara', cond:d=>!d.flags.conheceu_o_goro && !c13_comVoce(d)},
    {texto:'Fechar a porta e ir procurar o Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin},
    {texto:'Fechar a porta e voltar pro cais.', vai:'c13_cais'}
  ]
},

c13_esperou_na_camara:{
  texto:[
    'Você senta na cadeira de plástico e espera.',
    d=>d.flags.c13_espera_k == null || d.flags.c13_espera_k === 0
      ? `${c13_Horas(d.flags.c13_espera_horas || 2)}.`
      : `Ninguém vem nesse dia. Você vai embora de noite e volta ${c13_voltaNoDia(d)}, antes das quatro, e senta na mesma cadeira.`,
    'O Articuno pequeno te olha esse tempo inteiro e não faz nada, e você não faz nada, e a lâmpada amarela zumbe.',
    'Às dezesseis e vinte a porta do galpão abre.',
    'Passos. Dois pares.',
    'A porta da câmara fria abre e tem um homem de sessenta anos com uma caixa térmica e um homem de quarenta com uma sacola, e os dois ficam parados na porta olhando {um moleque|uma menina} sentad{o|a} na cadeira deles.',
    'Ninguém grita.',
    'O de sessenta anos põe a caixa térmica no chão e fala, com a voz de quem já esperou isso acontecer todo dia por dezenove semanas:',
    d=>fala(c13_tobinRotulo(d), 'Você é da Liga?'),
    d=>fala(d.jogador.nome, 'Não.'),
    'Ele solta o ar.',
    d=>fala(c13_tobinRotulo(d), 'Ainda bem.'),
    d=>d.flags.c13_sabia_do_tobin ? '' : fala('Tobin', 'Tobin. Do Estrela do Sul.'),
    d=>d.flags.c13_sabia_do_tobin ? '' : 'Ele aponta o Articuno com o queixo.',
    d=>d.flags.c13_sabia_do_tobin ? '' : fala('Tobin', 'Fui eu que trouxe ele.', 'baixo')
  ],
  ef:{flag:['conheceu_o_goro','achou_o_filhote'],
      executar:d=>{
        Estado.marcar('c13_sabia_do_tobin', !!d.flags.sabe_do_goro);
        Estado.marcar('sabe_do_goro'); Estado.marcar('c13_na_camara');
        c13_esperarBalde(d);
        return [];
      },
      npc:{nome:'Tobin', opiniao:1, memoria:'Te encontrou sentado na cadeira dele, dentro da câmara fria, e perguntou se você era da Liga.'},
      rep:{eixo:'bom',delta:2,motivo:'Esperou sentad{o|a} em vez de levar embora'},
      registrar:'Tobin, mestre do Estrela do Sul, cuida do Articuno ferido há dezenove semanas.',
      presagio:'"Ainda bem." Ele tem medo da Liga, não de você.'},
  escolhas:[
    {texto:'"Foi você que pegou ele na rede."', vai:'c13_goro_conta', cond:d=>!!d.flags.sabe_do_estrela_do_sul},
    {texto:'"Por que você não devolveu?"', vai:'c13_porque_nao_devolveu'},
    {texto:'"Você sabe o que tá acontecendo no mar?"', vai:'c13_ele_sabe'},
    {texto:'Não dizer nada e deixar ele falar.', vai:'c13_goro_conta'}
  ]
},

c13_goro:{
  falante:'Tobin',
  vozes:['N','N','N'],
  texto:[
    d=>d.flags.c13_abordou_na_calcada
      ? 'Você alcança os dois na calçada, antes de eles entrarem na camionete. O de quarenta anos olha pro Tobin; o Tobin olha pra caixa térmica.'
      : 'A casa do Tobin fica na rua de trás do posto de saúde e tem uma âncora enferrujada no jardim.',
    d=>d.flags.c13_abordou_na_calcada
      ? `Quando você diz "${c13_senha(d)}", ele entrega a caixa térmica pro outro, diz "vai na frente", e volta até a porta de casa.`
      : 'Ele atende de camiseta e chinelo e parece dez anos mais velho do que a idade dele.',
    d=>d.flags.c13_abordou_na_calcada ? '' : `Quando você diz "${c13_senha(d)}", ele não fecha a porta.`,
    d=>c13_comVoce(d) ? 'Ele vê a caixa de gelo nos seus braços antes de ver você.' : '',
    d=>d.flags.avisou_a_colonia ? 'Ele já sabe que o cais sabe. A notícia chegou na rua de trás antes de você.' : '',
    'Ele encosta a testa no batente por uns três segundos e depois abre mais e diz:',
    '"Entra."',
    'A sala tem foto de barco na parede. Seis fotos, a mais antiga em preto e branco.',
    d=>`Ele senta na poltrona sem oferecer nada e começa a falar antes de você perguntar, porque ele está esperando alguém perguntar desde ${c13_ext(c13_queda(d))}.`,
    '"Eu tava com dívida de motor."',
    'É essa a primeira frase.',
    '"Eu tava com dívida de motor de quarenta e dois mil e a quebra das Seafoam é o único lugar que dá pra tirar isso numa noite."'
  ],
  ef:{flag:['conheceu_o_goro','sabe_da_divida'],
      executar:()=>{ Estado.marcar('c13_na_camara', false); return []; },
      npc:{nome:'Tobin', opiniao:2, memoria:'Te deixou entrar e a primeira coisa que disse foi a dívida do motor.'},
      rep:{eixo:'bom',delta:2,motivo:'Bateu na porta em vez de falar do lado de fora'},
      registrar:'Tobin pescou na quebra das Seafoam por causa de uma dívida de motor de 42 mil.'},
  escolhas:[
    {texto:'"Conta o que aconteceu."', vai:'c13_goro_conta'},
    {texto:'"Por que você não devolveu?"', vai:'c13_porque_nao_devolveu', cond:c13_sabeDoPequeno},
    {texto:'"Você sabe o que tá acontecendo no mar?"', vai:'c13_ele_sabe'},
    {texto:'"Me leva onde ele está."', vai:'c13_goro_leva', cond:d=>c13_sabeDoPequeno(d) && !c13_comVoce(d)}
  ]
},

/* o Tobin de novo: em casa, com o que você já sabe dele */
c13_goro_de_novo:{
  repetivel:true,
  falante:'Tobin',
  vozes:['N'],
  texto:[
    'O Tobin abre a porta antes de você bater, porque da janela da sala dá pra ver a rua inteira.',
    d=>c13_comVoce(d) ? 'Ele vê a caixa de gelo nos seus braços e não pergunta o que tem dentro. Ele sabe pelo jeito que você segura.' :
       d.flags.achou_articuno ? 'Ele vê o sal seco na sua roupa e sabe de onde você veio.' :
       d.flags.goro_vai ? 'Ele já está de bota, com a chave do cadeado no bolso.' :
       'Ele não diz nada. Abre mais a porta e volta pra poltrona.',
    d=>c13_comVoce(d) ? '"Ele tá bem?"' :
       d.flags.achou_articuno ? '"Você foi lá."' :
       d.flags.goro_vai ? '"Tô pronto. É só dizer a hora."' :
       '"Voltou."'
  ],
  ef:{executar:()=>{ Estado.marcar('c13_na_camara', false); return []; }},
  escolhas:[
    {texto:'"Conta o que aconteceu."', vai:'c13_goro_conta', cond:c13_nova('c13_goro_conta')},
    {texto:'"Por que você não devolveu?"', vai:'c13_porque_nao_devolveu', cond:d=>c13_sabeDoPequeno(d) && !Historia.jaAconteceu('c13_porque_nao_devolveu')},
    {texto:'"Qual a parte que você não sabe resolver?"', vai:'c13_a_parte_dificil', cond:d=>Historia.jaAconteceu('c13_goro_conta') && !Historia.jaAconteceu('c13_a_parte_dificil')},
    {texto:'"Você sabe o que tá acontecendo no mar?"', vai:'c13_ele_sabe', cond:c13_nova('c13_ele_sabe')},
    {texto:'"Me leva onde ele está."', vai:'c13_goro_leva', cond:d=>c13_sabeDoPequeno(d) && !c13_comVoce(d) && !Historia.jaAconteceu('c13_goro_leva')},
    {texto:'"Eu devolvo por você."', vai:'c13_eu_devolvo', cond:d=>c13_sabeDoPequeno(d) && !d.flags.goro_vai && !Historia.jaAconteceu('c13_eu_devolvo')},
    {texto:'"A gente vai junto."', vai:'c13_juntos', cond:d=>c13_sabeDoPequeno(d) && !d.flags.goro_vai},
    {texto:'Buscar o Sr. Dane e ir os três.', vai:'c13_os_tres', cond:d=>!!d.flags.goro_vai && c13_sabeDoDane(d) && !d.flags.devolveu_o_filhote},
    {texto:'Procurar quem tenha barco pra levar vocês.', vai:'c13_procurar_barco', cond:d=>!!d.flags.goro_vai && !c13_sabeDoDane(d)},
    {texto:'Ir pro cais.', vai:'c13_cais'}
  ]
},

c13_goro_conta:{
  falante:'Tobin',
  vozes:['N','N','N','N','N','N','P','N','N'],
  texto:[
    '"A rede subiu pesada demais às quatro e dez da manhã."',
    d=>c13_naCamara(d) ? 'Ele fala olhando o Articuno, não você.' : 'Ele fala olhando a foto do barco na parede.',
    '"A gente achou que era entulho. Quebra tem entulho, tem casco velho, tem de tudo."',
    '"E aí a rede subiu e tinha uma coisa azul dentro dela, do tamanho de um homem, e ela tava se debatendo, e o guincho travou, e o barco adernou vinte graus pra boreste."',
    'Ele passa a mão no joelho.',
    '"Eu cortei a rede. Eu cortei a rede porque o barco ia virar e eu tenho dois tripulantes e um deles tem quinze anos e é filho do meu primo."',
    '"E ela caiu na água com a asa pendurada, e eu vi a asa pendurada, e eu vi que eu tinha feito aquilo."',
    'Silêncio.',
    '"E aí eu pulei."',
    'Você não esperava essa.',
    '"Você pulou?"',
    '"Eu pulei na água a quatro da manhã, com cinquenta e oito anos, e eu botei ela no bote de apoio com a ajuda do menino de quinze, e a gente voltou pra Fuchsia a cinco e quarenta com uma coisa azul no fundo do bote."',
    'Ele finalmente olha pra você.',
    '"E aí veio a parte que eu não sei resolver."'
  ],
  ef:{flag:['goro_contou','sabe_do_corte'],
      npc:{nome:'Tobin', opiniao:5, memoria:'Cortou a rede para o barco não virar e depois pulou na água para tirar o Articuno.'},
      rep:{eixo:'bom',delta:3,motivo:'Ouviu a história inteira antes de julgar'},
      moral:-8,
      registrar:'Tobin cortou a rede, pulou na água às 4h e trouxe o Articuno ferido para Fuchsia.',
      presagio:'Ele fez a coisa errada e a coisa certa na mesma madrugada, com quatro minutos de diferença.'},
  escolhas:[
    {texto:'"Qual parte você não sabe resolver?"', vai:'c13_a_parte_dificil'},
    {texto:'"Por que você não devolveu?"', vai:'c13_porque_nao_devolveu', cond:c13_nova('c13_porque_nao_devolveu')},
    {texto:'"Me leva onde ele está."', vai:'c13_goro_leva', cond:d=>!c13_naCamara(d) && !c13_comVoce(d) && !Historia.jaAconteceu('c13_goro_leva')},
    {texto:'"Você sabe o que tá acontecendo no mar?"', vai:'c13_ele_sabe', cond:c13_nova('c13_ele_sabe')}
  ]
},

c13_a_parte_dificil:{
  falante:'Tobin',
  vozes:['P','N','N','N','N','N','N','N','N'],
  texto:[
    '"Qual parte você não sabe resolver?"',
    '"Devolver."',
    d=>c13_naCamara(d) ? 'Ele vira de costas, de frente pra porta da câmara.' : 'Ele levanta e vai até a janela.',
    '"Ele não pode voar. A asa quebrou em dois lugares, e o médico de Pokémon que o meu cunhado trouxe escondido disse que ossifica mal e que sem voar ele não sobrevive um dia lá."',
    '"E se eu devolver, eu tenho que devolver onde eu peguei, que é a quebra das Seafoam, que é seis milhas de área proibida pra arrasto e que eu declarei que eu tava pescando."',
    d=>`"Eu declarei no livro da colônia, {moço|moça}. Tá escrito. Eu escrevi de próprio punho “quebra das Seafoam” às vinte e três e dez do dia ${c13_ext(c13_vespera(d))}."`,
    '"E se eu chegar lá com ele, eu tô confessando arrasto em área proibida com dano a espécime protegido, que é três a cinco anos e perda da embarcação."',
    d=>c13_naCamara(d) ? 'Ele vira de volta.' : 'Ele volta pra poltrona.',
    '"E eu tenho dívida de motor de quarenta e dois mil, e a embarcação é a garantia."',
    d=>`"Então eu botei ele ${c13_naCamara(d) ? 'aqui, nessa câmara fria' : 'numa câmara fria'} que eu aluguei do meu cunhado por trezentos por mês, e eu levo ração marinha três vezes por semana, e faz dezenove semanas."`,
    '"E o mar tá congelando por minha causa e eu não sei o que fazer."'
  ],
  ef:{flag:['entendeu_o_goro','sabe_do_impasse'],
      npc:{nome:'Tobin', opiniao:6, memoria:'Explicou por que não consegue devolver: confessar o arrasto custa a embarcação que é garantia da dívida.'},
      rep:{eixo:'bom',delta:3,motivo:'Entendeu o nó em vez de cortar'},
      moral:-10,
      registrar:'Tobin não devolve o Articuno porque devolver é confessar arrasto em área proibida.',
      presagio:'Dezenove semanas. Ele levou ração marinha três vezes por semana durante dezenove semanas.'},
  escolhas:[
    {texto:'"Eu devolvo por você."', vai:'c13_eu_devolvo', cond:d=>!d.flags.goro_vai && !Historia.jaAconteceu('c13_eu_devolvo')},
    {texto:'"A gente devolve junto e eu falo com a Liga."', vai:'c13_juntos', cond:d=>!d.flags.goro_vai},
    {texto:'"Me leva onde ele está."', vai:'c13_goro_leva', cond:d=>!c13_naCamara(d) && !c13_comVoce(d) && !Historia.jaAconteceu('c13_goro_leva')},
    {texto:'"Você sabe o que tá acontecendo no mar?"', vai:'c13_ele_sabe', cond:c13_nova('c13_ele_sabe')},
    {texto:'Buscar o Sr. Dane e ir os três.', vai:'c13_os_tres', cond:d=>!!d.flags.goro_vai && c13_sabeDoDane(d)}
  ]
},

c13_porque_nao_devolveu:{
  falante:'Tobin',
  vozes:['P','N','P','N','P','N','N','P','N','N','N'],
  texto:[
    '"Por que você não devolveu?"',
    'Ele não se irrita, e a falta de irritação é a coisa mais triste da conversa.',
    '"Eu tentei duas vezes."',
    '"Duas?"',
    d=>`"Em ${c13_mes(d, 3)} e em ${c13_mes(d, 2)}. Eu botei ele no bote e fui até a metade do caminho nas duas."`,
    '"E?"',
    '"E na primeira eu voltei porque começou a chover e eu não sabia se ele aguentava molhar a atadura."',
    'Ele olha as mãos.',
    '"E essa é mentira. Eu voltei porque eu fiquei com medo."',
    '"E na segunda?"',
    '"Na segunda eu cheguei a ver a ilha."',
    'Longa pausa.',
    d=>`"E tinha gelo, e o gelo tinha subido uns quatro metros de ${c13_mes(d, 3)} pra ${c13_mes(d, 2)}, e eu entendi que quem tá fazendo aquilo tá esperando, e que se eu chegar lá com ele machucado eu não vou explicar nada pra ninguém porque ninguém vai me deixar falar."`,
    '"E eu voltei."'
  ],
  ef:{flag:['goro_tentou','sabe_do_impasse'],
      npc:{nome:'Tobin', opiniao:5, memoria:'Tentou devolver duas vezes e voltou as duas, e admitiu que a primeira foi medo.'},
      rep:{eixo:'bom',delta:2,motivo:'Deixou um homem se corrigir no meio da própria mentira'},
      moral:-8,
      registrar:'Tobin tentou devolver o Articuno duas vezes e voltou das duas.',
      presagio:'Ele se corrigiu sozinho, em voz alta. Isso é raro em qualquer pessoa.'},
  escolhas:[
    {texto:'"Conta o que aconteceu naquela noite."', vai:'c13_goro_conta', cond:c13_nova('c13_goro_conta')},
    {texto:'"Qual a parte que você não sabe resolver?"', vai:'c13_a_parte_dificil', cond:d=>Historia.jaAconteceu('c13_goro_conta') && !Historia.jaAconteceu('c13_a_parte_dificil')},
    {texto:'"Eu devolvo por você."', vai:'c13_eu_devolvo', cond:d=>!d.flags.goro_vai && !Historia.jaAconteceu('c13_eu_devolvo')},
    {texto:'"A gente vai junto."', vai:'c13_juntos', cond:d=>!d.flags.goro_vai},
    {texto:'"Me leva onde ele está."', vai:'c13_goro_leva', cond:d=>!c13_naCamara(d) && !c13_comVoce(d) && !Historia.jaAconteceu('c13_goro_leva')}
  ]
},

c13_ele_sabe:{
  falante:'Tobin',
  vozes:['P','N','N','N','P','N','N','P','N','N'],
  texto:[
    '"Você sabe o que tá acontecendo no mar?"',
    '"Sei."',
    'Sem hesitação nenhuma.',
    d=>`"Todo mundo aqui acha que é fenômeno. A colônia contratou um oceanógrafo de Cerulean em ${c13_mes(d, 2)} e o oceanógrafo disse que é anomalia térmica de origem indeterminada e cobrou oito mil."`,
    'Ele ri sem alegria.',
    '"Oito mil pra escrever “origem indeterminada”."',
    '"E você sabe a origem."',
    d=>c13_naCamara(d)
      ? '"Eu sei a origem, e a origem tá aqui, nesse ninho de rede, comendo ração marinha que eu compro com o dinheiro que eu não tenho."'
      : '"Eu sei a origem, e a origem tá num galpão a seiscentos metros daqui comendo ração marinha que eu compro com o dinheiro que eu não tenho."',
    d=>c13_naCamara(d) ? 'Ele encosta a cabeça na prateleira de aço.' : 'Ele encosta a cabeça na poltrona.',
    '"Trezentas e onze famílias, {moço|moça}. Trezentas e onze. Eu conheço o nome de quase todo mundo."',
    '"E por que você não conta?"',
    '"Porque no dia que eu contar, eles vão saber que foi eu."',
    'Pausa.',
    '"E eu vou ter que aguentar ser eu, na frente deles, no cais, todo dia, pelo resto da vida."'
  ],
  ef:{flag:['goro_sabe','sabe_do_oceanografo'],
      npc:{nome:'Tobin', opiniao:4, memoria:'Sabe exatamente qual é a origem do gelo e não conta porque teria que aguentar ser ele.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou o que ele sabia e ouviu a resposta inteira'},
      moral:-10,
      registrar:'A colônia pagou 8 mil a um oceanógrafo por um laudo de "origem indeterminada".'},
  escolhas:[
    {texto:'"Então a gente resolve sem te entregar."', vai:'c13_eu_devolvo', cond:d=>!d.flags.goro_vai && !Historia.jaAconteceu('c13_eu_devolvo')},
    {texto:'"Você vai ter que aguentar. Vamos juntos."', vai:'c13_juntos', cond:d=>!d.flags.goro_vai},
    {texto:'"Me leva onde ele está."', vai:'c13_goro_leva', cond:d=>!c13_naCamara(d) && !c13_comVoce(d) && !Historia.jaAconteceu('c13_goro_leva')},
    {texto:'"Conta o que aconteceu naquela noite."', vai:'c13_goro_conta', cond:c13_nova('c13_goro_conta')},
    {texto:'"Qual a parte que você não sabe resolver?"', vai:'c13_a_parte_dificil', cond:d=>Historia.jaAconteceu('c13_goro_conta') && !Historia.jaAconteceu('c13_a_parte_dificil')}
  ]
},

c13_goro_leva:{
  falante:'Tobin',
  vozes:['N'],
  texto:[
    'Ele te leva.',
    'Vocês andam os seiscentos metros até a fábrica de gelo em silêncio, e ele cumprimenta quatro pessoas no caminho pelo nome, e as quatro respondem, e nenhuma pergunta pra onde ele vai porque todo mundo acha que ele vai pra lugar nenhum faz dezenove semanas.',
    'Ele abre o cadeado novo.',
    'Dentro é escuro e frio e o compressor martela.',
    'Ele acende a luz da câmara fria e abre a porta de isolamento com a alavanca, e faz isso do jeito de quem faz isso há dezenove semanas: sem pressa, com o corpo já sabendo onde ficar.',
    'E fala, pra dentro da câmara, antes de entrar, em voz normal:',
    '"Ô. Cheguei."',
    'E lá dentro, no ninho de rede de pesca dobrada, o Articuno pequeno levanta a cabeça.'
  ],
  ef:{flag:['achou_o_filhote','viu_o_segundo_articuno','entrou_na_fabrica'],
      executar:()=>{ Estado.marcar('c13_na_camara'); return []; },
      npc:{nome:'Tobin', opiniao:6, memoria:'Te levou à câmara fria e avisou em voz alta antes de entrar, como faz há dezenove semanas.'},
      moral:-5,
      registrar:'Tobin mantém o Articuno numa câmara fria alugada, e avisa em voz alta antes de entrar.',
      presagio:'"Ô. Cheguei." Ele diz isso três vezes por semana há dezenove semanas.'},
  escolhas:[
    {texto:'"Eu devolvo ele por você."', vai:'c13_eu_devolvo', cond:d=>!d.flags.goro_vai && !Historia.jaAconteceu('c13_eu_devolvo')},
    {texto:'"A gente vai junto e eu falo com a Liga."', vai:'c13_juntos', cond:d=>!d.flags.goro_vai},
    {texto:'"Ele aguenta a travessia?"', vai:'c13_aguenta'},
    {texto:'Buscar o Sr. Dane e ir os três.', vai:'c13_os_tres', cond:d=>!!d.flags.goro_vai && c13_sabeDoDane(d)},
    ...c13_irAoDane('Ir falar com o Sr. Dane antes.')
  ]
},

c13_aguenta:{
  falante:'Tobin',
  vozes:['P','N','P','N','N','N','P','N','N'],
  texto:[
    '"Ele aguenta a travessia?"',
    'Ele não sabe, e ele diz que não sabe, o que é raro.',
    '"Eu trouxe ele de lá num bote de apoio, então ele aguentou uma vez."',
    d=>`"Em ${c13_queda(d).mes}."`,
    d=>`"Em ${c13_queda(d).mes}, com a asa sangrando e uma hora e meia de mar. Hoje ele tá melhor de tudo menos da asa."`,
    'Ele olha pro ninho de rede.',
    d=>`"Mas hoje o mar tá dois graus e em ${c13_queda(d).mes} tava dezenove."`,
    'Ele encosta a mão na parede da câmara fria.',
    '"Eu botei ele aqui a quatro graus porque eu achei que ele gostava de frio."',
    '"E ele gosta?"',
    '"Eu não sei, {moço|moça}. Eu sou pescador. Eu não sei nada."',
    'Longo silêncio.',
    '"Ele parou de tremer no segundo dia. Eu achei que era bom sinal. Faz dezenove semanas que eu acho que era bom sinal."'
  ],
  ef:{flag:'duvida_do_goro',
      moral:-8,
      npc:{nome:'Tobin', opiniao:6, memoria:'Admitiu que não sabe se fez certo em nenhuma das dezenove semanas.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou a coisa prática'},
      presagio:'"Faz dezenove semanas que eu acho que era bom sinal." Ninguém nunca conferiu com ele.'},
  escolhas:[
    {texto:'"Então a gente chama alguém que sabe."', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone && !d.flags.ivone_veio},
    {texto:'"A gente vai junto."', vai:'c13_juntos', cond:d=>!d.flags.goro_vai},
    {texto:'"Você fez certo."', vai:'c13_voce_fez_certo'},
    {texto:'"Eu devolvo por você."', vai:'c13_eu_devolvo', cond:d=>!d.flags.goro_vai && !Historia.jaAconteceu('c13_eu_devolvo')}
  ]
},

c13_voce_fez_certo:{
  falante:'Tobin',
  vozes:['P','N','P','P','N','P','N','P','N'],
  texto:[
    '"Você fez certo."',
    'Ele não aceita.',
    '"Você não sabe disso."',
    d=>d.flags.goro_contou
      ? '"Eu sei uma parte. Você cortou a rede pra não virar o barco com um menino de quinze anos a bordo, e depois você pulou na água de madrugada com cinquenta e oito anos pra pegar de volta o que você tinha derrubado."'
      : '"Eu sei uma parte. Você trouxe ele vivo, e não deixou ele morrer."',
    'Você aponta os baldes.',
    '"E depois você levou ração marinha três vezes por semana durante dezenove semanas com dinheiro que você não tem, pra uma coisa que não te agradece, escondido de uma cidade inteira."',
    'Ele não olha pra você.',
    '"Isso não apaga o arrasto."',
    '"Não apaga."',
    '"Então não fui certo."',
    '"Você foi as duas coisas. Igual a todo mundo que eu conheci desde que eu saí de casa."',
    'Ele fica quieto muito tempo.',
    'Depois: "Eu vou junto."'
  ],
  ef:{flag:['goro_vai','vai_junto'],
      npc:{nome:'Tobin', opiniao:9, memoria:'Você disse que ele foi as duas coisas, e ele decidiu ir junto.'},
      rep:{eixo:'bom',delta:4,motivo:'Não absolveu nem condenou'},
      moral:15,
      registrar:'Tobin decidiu ir junto devolver.',
      presagio:'"Você foi as duas coisas." Ele ficou com isso na mão, como quem segura uma ferramenta nova.'},
  escolhas:[
    {texto:'Buscar o Sr. Dane e ir os três.', vai:'c13_os_tres', cond:c13_sabeDoDane},
    {texto:'Procurar quem tenha barco pra levar vocês.', vai:'c13_procurar_barco', cond:d=>!c13_sabeDoDane(d)},
    {texto:'Chamar a Dra. Cordell antes.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone && !d.flags.ivone_veio},
    {texto:'Contar no cais antes.', vai:'c13_avisou_a_colonia', cond:d=>!d.flags.avisou_a_colonia}
  ]
},

c13_eu_devolvo:{
  falante:'Tobin',
  vozes:['P','N','P','N','N','N'],
  texto:[
    '"Eu devolvo por você."',
    'Ele balança a cabeça na hora.',
    '"Não."',
    d=>d.flags.sabe_do_impasse || d.flags.sabe_do_arrasto
      ? '"Por quê? Você não quer confessar o arrasto. Eu não tenho nada a confessar."'
      : '"Por quê? Eu não tenho nada a esconder."',
    '"Não é isso."',
    'Ele olha as mãos, que são mãos de pescador de cinquenta e oito anos, com o dedo mínimo da esquerda torto de um acidente antigo.',
    '"Se você devolver por mim, eu vou ter feito só a parte de pegar."',
    'Ele fecha as mãos.',
    '"Eu preciso ter feito as duas."'
  ],
  ef:{flag:['goro_quer_ir','goro_vai'],
      npc:{nome:'Tobin', opiniao:7, memoria:'Recusou que você devolvesse por ele: precisa ter feito as duas partes.'},
      rep:{eixo:'bom',delta:3,motivo:'Ofereceu e aceitou o não'},
      moral:10,
      registrar:'Tobin quer devolver com as próprias mãos.',
      presagio:'"Eu preciso ter feito as duas." Ele disse isso olhando as próprias mãos.'},
  escolhas:[
    {texto:'"Então a gente vai junto."', vai:'c13_juntos'},
    {texto:'Buscar o Sr. Dane e ir os três.', vai:'c13_os_tres', cond:c13_sabeDoDane},
    {texto:'Procurar quem tenha barco pra levar vocês.', vai:'c13_procurar_barco', cond:d=>!c13_sabeDoDane(d)},
    {texto:'Chamar a Dra. Cordell antes.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone && !d.flags.ivone_veio}
  ]
},

c13_juntos:{
  falante:'Tobin',
  vozes:['P','N','P','N','P','N','P','N','N'],
  texto:[
    '"A gente vai junto."',
    'Ele demora uns dez segundos.',
    '"E a Liga?"',
    '"A Liga vai saber de qualquer jeito, porque duzentos quilômetros de gelo não descongelam sem alguém perguntar por quê."',
    '"E eu vou perder o barco."',
    '"Provavelmente."',
    d=>Historia.jaAconteceu('c13_ele_sabe') ? 'Ele ri, e dessa vez tem alegria no riso.' : 'Ele ri. É a primeira vez que ele ri.',
    '"Você é {péssimo|péssima} em convencer gente, {moço|moça}."',
    '"Eu sei."',
    d=>c13_naCamara(d)
      ? 'Ele se apoia na prateleira de aço pra levantar e bate a mão no bolso, onde está a chave do cadeado.'
      : 'Ele levanta da poltrona com dificuldade e pega a chave do cadeado no prego da parede.',
    '"Eu tenho dívida de motor de quarenta e dois mil e dezenove semanas de ração marinha, que dá mais uns oito."',
    d=>c13_naCamara(d) ? '' : 'Ele põe a chave no bolso.',
    '"Cinquenta mil e o mar parado. Já tá ruim demais pra piorar."'
  ],
  ef:{flag:['goro_vai','vai_junto'],
      npc:{nome:'Tobin', opiniao:9, memoria:'Pegou a chave do cadeado e disse que já estava ruim demais para piorar.'},
      rep:{eixo:'bom',delta:5,motivo:'Convenceu mal e convenceu'},
      moral:15,
      registrar:'Tobin vai devolver o Articuno pessoalmente.',
      presagio:'"Já tá ruim demais pra piorar." É por isso que as pessoas finalmente agem.'},
  escolhas:[
    {texto:'Buscar o Sr. Dane e ir os três.', vai:'c13_os_tres', cond:c13_sabeDoDane},
    {texto:'Procurar quem tenha barco pra levar vocês.', vai:'c13_procurar_barco', cond:d=>!c13_sabeDoDane(d)},
    {texto:'Contar no cais antes.', vai:'c13_avisou_a_colonia', cond:d=>!d.flags.avisou_a_colonia},
    {texto:'Chamar a Dra. Cordell antes.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone && !d.flags.ivone_veio}
  ]
},

/* ─────────────── O AMOS E A TRAVESSIA ─────────────── */

c13_procurar_barco:{
  vozes:['alguém no cais'],
  texto:[
    d=>d.flags.c13_de_noite ? 'De noite o cais é de quem não tem pra onde ir. Você espera clarear e começa a perguntar com o sol.' : '',
    d=>c13_linhaDosBarcos(d),
    'Você pergunta pra doze pessoas e recebe doze nãos.',
    'Não é medo de Pokémon. É medo de gelo: barco de madeira em água com gelo à deriva perde casco, e casco perdido é a vida inteira de uma família de pescador.',
    'O nono não te responde. O décimo primeiro diz "nem por dez mil". O décimo segundo pergunta se você tem dez mil, e quando você diz que não, ele diz "então não adianta a gente conversar" e volta pro dominó, sem grosseria nenhuma.',
    'E aí alguém, de algum lugar do cais, grita:',
    '"Fala com o Amos!"',
    'E o cais inteiro ri.',
    'Não é riso de deboche. É riso daquele tipo específico que as pessoas dão quando alguém sugere a coisa óbvia e terrível.'
  ],
  ef:{flag:['procurou_barco','sabe_do_ryuzo'],
      executar:d=>{ c13_noite(d); c13_barcosVoltaram(d); return []; },
      presagio:'A coisa óbvia e terrível. Esse é o tom com que falam do Amos.'},
  escolhas:[
    {texto:'Ir falar com o Amos.', vai:'c13_ryuzo'},
    {texto:'"Por que vocês riem?"', vai:'c13_porque_riem'},
    {texto:'Ir à colônia antes.', vai:'c13_colonia'},
    {texto:'Perguntar quando começou.', vai:'c13_quando_comecou', cond:c13_nova('c13_quando_comecou')}
  ]
},

c13_porque_riem:{
  falante:'o magro de boné',
  vozes:['P','N','P','N','N','N','N','P','N','N'],
  texto:[
    '"Por que vocês riem?"',
    'O riso morre.',
    'O magro de boné responde, e responde sério.',
    '"Porque o Amos vai."',
    '"E isso é engraçado?"',
    '"Não."',
    'Ele mexe nas pedras do dominó.',
    '"O Amos tem setenta e quatro anos e um barco de doze pés que o pai dele construiu em cinquenta e três."',
    '"Ele parou de pescar em noventa e sete, quando o filho dele morreu no mar."',
    'Silêncio na mesa.',
    '"E desde noventa e sete ele sai com aquele barco toda quarta de manhã, sozinho, sem rede, sem linha, sem nada, e volta de tarde."',
    '"Fazer o quê?"',
    '"Ninguém sabe. Ninguém pergunta."',
    'Ele joga uma pedra.',
    '"E agora tem um gelo aparecendo no sul e o único homem de Fuchsia que quer ir olhar é o que já não tem o que perder."'
  ],
  ef:{flag:['sabe_do_ryuzo','sabe_do_filho_do_ryuzo'],
      rep:{eixo:'bom',delta:2,motivo:'Perguntou por que estavam rindo'},
      moral:-5,
      registrar:'O Amos parou de pescar em 1997, quando o filho morreu no mar, e sai sozinho toda quarta desde então.'},
  escolhas:[
    {texto:'Ir falar com o Amos.', vai:'c13_ryuzo'},
    {texto:'Ir à colônia procurar o registro de 1997.', vai:'c13_colonia'},
    {texto:d=>`Perguntar do dia ${c13_ext(c13_queda(d))}.`, vai:'c13_quatro_de_junho', cond:d=>!!d.flags.sabe_da_data && !Historia.jaAconteceu('c13_quatro_de_junho')}
  ]
},

c13_ryuzo:{
  falante:'Sr. Dane',
  vozes:['N','P','N','N','P','N'],
  texto:[
    d=>d.flags.sabe_do_ryuzo ? '' : 'No cais, todo mundo sabe quem é o Amos: o velho do barco azul, na ponta do molhe.',
    'Ele está sentado num caixote ao lado de um barco azul de doze pés com o nome pintado à mão na proa: **STARYU**.',
    'A tinta do nome foi retocada muitas vezes, e as camadas se veem na borda das letras.',
    'Ele tem setenta e quatro anos, um boné sem logotipo nenhum, e está consertando um cabo de amarração que não precisa de conserto.',
    'No cais o chamam de Amos. Na colônia, no livro de saída de embarcação e na única placa de rua que esta cidade tem com nome de pescador, ele é Dane.',
    'Ele te vê chegando de longe e espera você chegar, e a primeira coisa que ele fala é:',
    '"Eu levo."',
    '"Eu nem falei nada."',
    d=>d.flags.procurou_barco || d.flags.ouviu_o_domino || d.flags.sabe_da_data
      ? '"Tá escrito na sua cara e você andou o cais inteiro perguntando. Fuchsia é pequena, {meu filho|minha filha}."'
      : '"Tá escrito na sua cara. Fuchsia é pequena, {meu filho|minha filha}."',
    'Ele amarra o cabo.',
    '"Três horas de ida. A gente sai às cinco, chega às oito, e eu não fico depois das quinze porque o vento vira."',
    '"Quanto você quer?"',
    'Ele olha pra você como se a pergunta fosse esquisita.',
    '"Eu vou porque eu quero ver antes de morrer."'
  ],
  ef:{npc:{nome:'Sr. Dane', opiniao:3, memoria:'Aceitou te levar às Seafoam antes de você pedir, e não quis dinheiro.'},
      flag:'conheceu_ryuzo',
      registrar:'Sr. Dane aceitou levar você às Ilhas Seafoam no barco do pai dele.',
      presagio:d=>d.flags.sabe_do_filho_do_ryuzo ? '"Antes de morrer." Ele tem setenta e quatro anos e sai toda quarta pro canal sul.' : '"Antes de morrer." Ele disse isso como quem diz a hora.'},
  escolhas:[
    {texto:'"Ver o quê?"', vai:'c13_ver_o_que'},
    {texto:'"Por que você sai toda quarta?"', vai:'c13_toda_quarta', cond:d=>!!d.flags.sabe_do_filho_do_ryuzo},
    {texto:'"Eu acho que eu sei o que é o gelo."', vai:'c13_contou_pro_ryuzo', cond:d=>(!!d.flags.achou_o_filhote || c13_sabeDoTobin(d)) && !Historia.jaAconteceu('c13_contou_pro_ryuzo')},
    {texto:'"O Tobin vai junto, com o que ele pegou."', vai:'c13_os_tres', cond:d=>!!d.flags.goro_vai && !d.flags.devolveu_o_filhote},
    {texto:d=>c13_comVoce(d) ? 'Aceitar e embarcar com o caixote.' : 'Aceitar e embarcar.', vai:'c13_travessia'},
    {texto:'"Antes eu preciso resolver uma coisa em terra."', vai:'c13_cais'}
  ]
},

/* o Sr. Dane de novo: o mesmo caixote, a mesma saída às cinco */
c13_ryuzo_de_novo:{
  repetivel:true,
  falante:'Sr. Dane',
  vozes:['N'],
  texto:[
    d=>d.flags.nao_foi_seafoam && !d.flags.achou_articuno
      ? 'O Sr. Dane está no caixote do lado do Staryu, com o mesmo cabo na mão. Ele não comenta a volta da borda do gelo.'
      : d.flags.achou_articuno
      ? 'O Sr. Dane está no caixote do lado do Staryu, e levanta a cabeça quando te vê, como quem já esperava.'
      : 'O Sr. Dane está no mesmo caixote, do lado do Staryu, consertando a mesma coisa que não precisa de conserto.',
    '"A gente sai às cinco."'
  ],
  escolhas:[
    {texto:'"Ver o quê?"', vai:'c13_ver_o_que', cond:c13_nova('c13_ver_o_que')},
    {texto:'"Por que você sai toda quarta?"', vai:'c13_toda_quarta', cond:d=>!!d.flags.sabe_do_filho_do_ryuzo && !Historia.jaAconteceu('c13_toda_quarta')},
    {texto:'"Eu acho que eu sei o que é o gelo."', vai:'c13_contou_pro_ryuzo', cond:d=>(!!d.flags.achou_o_filhote || c13_sabeDoTobin(d)) && !Historia.jaAconteceu('c13_contou_pro_ryuzo')},
    {texto:'"Vai lá falar com o Tobin."', vai:'c13_ryuzo_vai_falar', cond:d=>Historia.jaAconteceu('c13_contou_pro_ryuzo') && !d.flags.goro_vai},
    {texto:'"O Tobin vai junto, com o que ele pegou."', vai:'c13_os_tres', cond:d=>!!d.flags.goro_vai && !d.flags.devolveu_o_filhote},
    {texto:d=>c13_comVoce(d) ? 'Embarcar com o caixote.' : 'Embarcar.', vai:'c13_travessia'},
    {texto:'Ir resolver outra coisa em terra.', vai:'c13_cais'}
  ]
},

c13_ver_o_que:{
  falante:'Sr. Dane',
  vozes:['P','N','N','N','N','N','N'],
  texto:[
    '"Ver o quê?"',
    'Ele demora pra responder e a resposta não é a que você espera.',
    '"O mar fazendo uma coisa que eu não entendo."',
    'Ele guarda o cabo na caixa de ferramenta.',
    '"Eu tenho setenta e quatro anos e eu vivi desse mar desde os nove. Eu conheço o fundo daqui até a quebra melhor do que eu conheço a minha rua."',
    d=>`"E em ${c13_queda(d).mes} ele começou a fazer uma coisa que eu nunca vi, e que o meu pai nunca viu, e que o pai dele nunca viu, porque a gente conta essas coisas em casa e eu ia lembrar."`,
    'Ele fecha a caixa.',
    '"Eu não quero salvar ninguém, {meu filho|minha filha}. Eu tenho setenta e quatro anos e eu não salvo mais ninguém."',
    '"Eu quero entender uma coisa antes de acabar. Uma. Eu não fui muito longe na escola e eu não entendi quase nada da vida."',
    'Ele aponta o horizonte com o queixo, na direção da linha branca.',
    '"Essa aqui eu tenho chance."'
  ],
  ef:{flag:'ryuzo_falou',
      npc:{nome:'Sr. Dane', opiniao:5, memoria:'Disse que não vai salvar ninguém — quer entender uma coisa antes de acabar.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou ver o quê'},
      moral:8,
      registrar:'Sr. Dane quer entender uma coisa antes de morrer.'},
  escolhas:[
    {texto:'"Por que você sai toda quarta?"', vai:'c13_toda_quarta', cond:d=>!!d.flags.sabe_do_filho_do_ryuzo && !Historia.jaAconteceu('c13_toda_quarta')},
    {texto:'"Eu acho que eu sei o que é."', vai:'c13_contou_pro_ryuzo', cond:d=>(!!d.flags.achou_o_filhote || c13_sabeDoTobin(d)) && !Historia.jaAconteceu('c13_contou_pro_ryuzo')},
    {texto:'"O Tobin vai junto, com o que ele pegou."', vai:'c13_os_tres', cond:d=>!!d.flags.goro_vai && !d.flags.devolveu_o_filhote},
    {texto:d=>c13_comVoce(d) ? 'Embarcar com o caixote.' : 'Embarcar.', vai:'c13_travessia'},
    {texto:'"Antes eu preciso resolver uma coisa em terra."', vai:'c13_cais'}
  ]
},

c13_toda_quarta:{
  falante:'Sr. Dane',
  vozes:['P','N','P','N','P','N','N','N','N'],
  texto:[
    '"Por que você sai toda quarta?"',
    'Ele para.',
    'E aí faz uma coisa que você não esperava: ele não se fecha. Ele responde na hora, como quem já respondeu isso pra si mesmo mil vezes e nunca em voz alta.',
    '"Porque foi numa quarta."',
    '"E você vai até onde?"',
    '"Até o ponto."',
    '"E fica quanto tempo?"',
    '"O tempo que der. Umas quatro horas."',
    'Ele olha o barco.',
    '"Eu não levo flor, não falo nada, não jogo nada na água. Eu paro o motor e fico."',
    d=>`"Faz ${c13_anosDoFilho(d)} que eu faço isso e eu já perdi a conta de quantas quartas."`,
    'Ele bate na borda do barco duas vezes com a palma da mão.',
    d=>{ const s = c13_fem(c13_quartas(d)); return `"${s.charAt(0).toUpperCase() + s.slice(1)}."`; },
    'Ele não perdeu a conta.'
  ],
  ef:{flag:['ryuzo_contou_do_filho'],
      npc:d=>({nome:'Sr. Dane', opiniao:7, memoria:`Contou que sai toda quarta até o ponto onde o filho não voltou. ${c13_quartas(d)} vezes.`}),
      rep:{eixo:'bom',delta:3,motivo:'Perguntou, e ele respondeu pela primeira vez desde noventa e sete'},
      moral:10,
      registrar:d=>`Sr. Dane vai ao ponto onde o filho morreu toda quarta. ${c13_quartas(d)} vezes.`},
  escolhas:[
    {texto:d=>c13_comVoce(d) ? 'Embarcar com o caixote.' : 'Embarcar.', vai:'c13_travessia'},
    {texto:'"Eu acho que eu sei o que é o gelo."', vai:'c13_contou_pro_ryuzo', cond:d=>(!!d.flags.achou_o_filhote || c13_sabeDoTobin(d)) && !Historia.jaAconteceu('c13_contou_pro_ryuzo')},
    {texto:'Ficar em silêncio com ele um pouco.', vai:'c13_silencio_com_ryuzo'},
    {texto:'"Antes eu preciso resolver uma coisa em terra."', vai:'c13_cais'}
  ]
},

c13_silencio_com_ryuzo:{
  falante:'Sr. Dane',
  vozes:['N','P','N'],
  texto:[
    'Você senta no caixote do lado dele e não fala nada.',
    'Ele também não.',
    'Ficam ali umas duas horas, e nesse tempo ele conserta mais duas coisas que não precisavam de conserto, e você ajuda a segurar uma delas.',
    'Em algum momento ele divide uma laranja com você, descascada com a faca, em gomos, do jeito que se descasca laranja num barco.',
    'Perto do fim, sem mudar o tom:',
    '"Tem alguém te esperando em casa?"',
    '"Tem."',
    '"Liga hoje."',
    'E não fala mais nada, e não explica, e não precisa.'
  ],
  ef:{flag:'silencio_com_ryuzo',
      executar:()=>{ Relogio.avancar(2); return []; },
      npc:{nome:'Sr. Dane', opiniao:6, memoria:'Dividiu uma laranja com você em silêncio e mandou você ligar para casa.'},
      moral:12, hp:2,
      rep:{eixo:'bom',delta:1,motivo:'Ficou em silêncio com quem precisava de companhia'}},
  escolhas:[
    {texto:d=>c13_comVoce(d) ? 'Embarcar com o caixote.' : 'Embarcar.', vai:'c13_travessia'},
    {texto:'"Eu acho que eu sei o que é o gelo."', vai:'c13_contou_pro_ryuzo', cond:d=>(!!d.flags.achou_o_filhote || c13_sabeDoTobin(d)) && !Historia.jaAconteceu('c13_contou_pro_ryuzo')},
    {texto:'Ir resolver a coisa em terra primeiro.', vai:'c13_cais'}
  ]
},

c13_contou_pro_ryuzo:{
  falante:'Sr. Dane',
  vozes:['P','N','P','N','N','P','N','N','P','N','N'],
  texto:[
    '"Eu acho que eu sei o que é o gelo."',
    d=>`Você conta o que sabe: ${c13_lista(c13_oQueVoceSabe(d))}.`,
    'Ele ouve inteiro sem interromper uma vez.',
    'No fim, ele fica uns vinte segundos olhando o chão do cais.',
    '"O Tobin."',
    d=>d.flags.c13_ja_sabia_do_tobin ? '"Você conhece?"' : '"Que Tobin?"',
    '"Eu tirei o pai dele da água em setenta e nove."',
    'Ele levanta do caixote com dificuldade.',
    d=>`"Ele foi me ver em ${c13_mes(d, 3)}. Bateu na minha porta às onze da noite e ficou na calçada e não entrou."`,
    '"E falou o quê?"',
    '"Perguntou se eu ia sair na quarta."',
    'Ele pega o boné e ajeita.',
    '"Eu disse que ia. Ele disse “tá bom” e foi embora."',
    '"E era isso?"',
    '"Era isso."',
    'Ele olha o horizonte.',
    '"O homem foi me perguntar se eu ia sair de barco e não conseguiu falar o resto. Quatro meses."'
  ],
  ef:{flag:['ryuzo_sabe','ryuzo_e_goro'],
      executar:d=>{ Estado.marcar('c13_ja_sabia_do_tobin', !!d.flags.sabe_do_goro); Estado.marcar('sabe_do_goro'); return []; },
      npc:{nome:'Sr. Dane', opiniao:8, memoria:'Descobriu que o Tobin foi à porta dele e não conseguiu falar.'},
      rep:{eixo:'bom',delta:4,motivo:'Juntou as duas pessoas que estavam esperando uma pela outra'},
      moral:10,
      registrar:d=>`O Tobin foi à casa do Amos em ${c13_mes(d, 3)} e não conseguiu contar.`,
      presagio:'Quatro meses. Ele foi até a porta e não conseguiu.'},
  escolhas:[
    {texto:'"Vai lá falar com ele."', vai:'c13_ryuzo_vai_falar', cond:d=>!d.flags.goro_vai},
    {texto:'"Ele já vai junto. Com o que ele pegou."', vai:'c13_os_tres', cond:d=>!!d.flags.goro_vai && !d.flags.devolveu_o_filhote},
    {texto:d=>c13_comVoce(d) ? 'Embarcar só nós dois, com o caixote.' : 'Embarcar só nós dois.', vai:'c13_travessia'},
    {texto:'Ir falar com o Tobin primeiro.', vai:'c13_goro'}
  ]
},

c13_ryuzo_vai_falar:{
  vozes:['P','Sr. Dane'],
  texto:[
    '"Vai lá falar com ele."',
    'Ele não responde. Pega a caixa de ferramenta, tranca o barco, e sai andando.',
    'Você não vai junto porque ele não te chama.',
    'Você fica no cais e espera, e demora duas horas e quarenta.',
    'Quando ele volta, ele volta com o Tobin andando três passos atrás, do jeito que anda quem está sendo trazido.',
    'Os dois chegam no barco e nenhum dos dois fala nada por um tempo.',
    'Depois o Sr. Dane abre a caixa de ferramenta, tira um cabo de amarração novo, e entrega pro Tobin.',
    '"Segura a ponta."',
    'E é isso. É essa a conversa inteira.',
    'Os dois passam a hora seguinte amarrando uma coisa que não precisa ser amarrada, e no fim da hora estão indo juntos.'
  ],
  ef:{flag:['ryuzo_e_goro_juntos','goro_vai','conheceu_o_goro'],
      executar:()=>{ Relogio.avancar(4); return []; },
      npc:{nome:'Tobin', opiniao:7, memoria:'Foi trazido pelo Sr. Dane ao cais e a conversa inteira foi "segura a ponta".'},
      rep:{eixo:'bom',delta:5,motivo:'Mandou um velho falar com o outro'},
      moral:15,
      registrar:'Sr. Dane foi buscar o Tobin. Os dois vão às Seafoam juntos.',
      presagio:'"Segura a ponta." Foi a conversa inteira e foi o suficiente.'},
  escolhas:[
    {texto:d=>c13_comVoce(d) ? 'Embarcar os três, com o caixote.' : 'Buscar o Articuno na câmara fria e embarcar.', vai:'c13_os_tres'},
    {texto:'Ir primeiro só pra ver, sem o pequeno.', vai:'c13_travessia', cond:d=>!c13_comVoce(d)},
    {texto:'Chamar a Dra. Cordell antes.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone && !d.flags.ivone_veio},
    {texto:'Avisar a colônia inteira.', vai:'c13_avisou_a_colonia', cond:d=>!d.flags.avisou_a_colonia}
  ]
},

c13_avisou_a_colonia:{
  vozes:['o magro de boné'],
  texto:[
    d=>d.flags.c13_de_noite ? 'De noite o cais é pouca gente. Você espera ele encher de manhã.' : '',
    'Você sobe na mesa de dominó.',
    'Literalmente: você sobe numa mesa de plástico no meio de um cais com sessenta pessoas paradas e fala alto.',
    d=>`Você conta o que sabe: ${c13_lista(c13_oQueVoceSabe(d))}.`,
    d=>d.flags.c13_avisou_sabia_tobin ? 'Você não diz o nome do Tobin.' : 'Você não tem nome nenhum pra dizer.',
    'Não adianta: quatro pessoas dizem "Tobin" antes de você terminar a segunda frase, e uma delas grita.',
    'E aí acontece uma coisa que você não previu, sobre cidade pequena:',
    'ninguém vai atrás dele.',
    'Tem grito, tem raiva, tem uma mulher chorando de raiva mesmo, mas ninguém sai da mesa.',
    'E depois de uns dez minutos de barulho, o magro de boné fala mais alto que todo mundo:',
    '"Tá bom. E agora? Quem tem bote?"',
    'E onze pessoas levantam a mão.'
  ],
  ef:{flag:['avisou_a_colonia','mobilizou_gente'],
      executar:d=>{ c13_noite(d); Estado.marcar('c13_avisou_sabia_tobin', !!d.flags.sabe_do_goro); Estado.marcar('sabe_do_goro'); return []; },
      rep:{eixo:'bom',delta:5,motivo:'Contou para o cais inteiro e o cais respondeu com botes'},
      moral:15, instabilidade:1,
      npc:{nome:'Tobin', opiniao:-1, memoria:'Você contou no cais. Quatro pessoas disseram o nome dele antes de você terminar.'},
      registrar:'Contou tudo no cais de Fuchsia. Onze pessoas ofereceram bote.'},
  escolhas:[
    {texto:'Ir com os onze botes.', vai:'c13_comboio', cond:d=>c13_sabeOnde(d) || !!d.flags.goro_vai || c13_comVoce(d)},
    ...c13_irAoDane('Ir só com o Sr. Dane.'),
    {texto:'Ir atrás do Tobin.', vai:'c13_goro', cond:d=>!d.flags.goro_vai},
    {texto:'Chamar a Dra. Cordell.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone && !d.flags.ivone_veio && c13_podePegar(d)}
  ]
},

c13_chamou_ivone:{
  falante:'a médica de Cerulean',
  vozes:['N','P','N','N','P','N','N'],
  texto:[
    'A Dra. Cordell chega de ônibus em nove horas, com duas pessoas e uma câmera, do jeito de sempre.',
    'Mas dessa vez ela chega com uma terceira coisa: uma médica de Pokémon selvagem, de Cerulean, de quarenta anos, que ela conhece de um caso de oito anos atrás.',
    'A médica olha a asa por vinte minutos, com o Articuno pequeno deitado numa mesa de inox emprestada da banca de alga do cais, e no fim ela fala coisas que ninguém em Fuchsia sabia dizer:',
    '"Fratura cominutiva do úmero, consolidada viciosamente."',
    '"O que quer dizer?"',
    '"Que colou torto porque ninguém imobilizou direito nas primeiras duas semanas."',
    'Ela tira a luva.',
    '"E que dá pra refraturar e refazer, com cirurgia, em centro cirúrgico, com anestesia, e que a taxa de recuperação de voo nesse tipo de caso é de uns quarenta por cento."',
    '"E onde tem centro cirúrgico?"',
    '"Cerulean. Doze horas de estrada."',
    'Ela olha pro Articuno.',
    '"E antes disso alguém tem que explicar pro que congelou duzentos quilômetros de mar que a gente vai levar o filho dele pra doze horas de distância."'
  ],
  ef:{flag:['ivone_veio','sabe_da_cirurgia','achou_o_filhote'],
      executar:()=>{ Relogio.avancar(9); return []; },
      npc:{nome:'Dra. Cordell', opiniao:8, memoria:'Trouxe uma médica de Pokémon selvagem de Cerulean para avaliar a asa.'},
      rep:{eixo:'bom',delta:5,motivo:'Chamou quem sabia, e quem sabia trouxe quem sabia mais'},
      registrar:'A asa consolidou torta. Cirurgia em Cerulean dá 40% de chance de voltar a voar.',
      presagio:'Alguém tem que explicar pra ele. Essa é a parte que nenhuma médica resolve.'},
  escolhas:[
    {texto:'Ir explicar. Levar o pequeno junto, com o Tobin.', vai:'c13_os_tres', cond:d=>!!d.flags.goro_vai && c13_sabeDoDane(d)},
    {texto:'Ir explicar. Levar o pequeno junto, para ele ver.', vai:'c13_travessia', cond:d=>!d.flags.goro_vai && c13_sabeDoDane(d),
     ef:{executar:()=>{ Estado.marcar('levou_o_filhote'); Estado.marcar('c13_com_a_medica', false); return []; }}},
    {texto:'Ir sozinh{o|a} explicar primeiro, sem levar ele.', vai:'c13_travessia', cond:c13_sabeDoDane,
     ef:{executar:()=>{ Estado.marcar('c13_com_a_medica'); return []; }}},
    {texto:'Procurar quem tenha barco pra ir.', vai:'c13_procurar_barco', cond:d=>!c13_sabeDoDane(d)},
    {texto:'Levar direto pra Cerulean sem explicar nada.', vai:'c13_levou_pra_cerulean'},
    {texto:'Ir com o comboio da colônia.', vai:'c13_comboio', cond:d=>!!d.flags.avisou_a_colonia}
  ]
},

c13_levou_o_filhote:{
  texto:[
    'Você tira o Articuno pequeno da câmara fria sem falar com ninguém.',
    'Ele não resiste, porque ele não tem como resistir, e ele é mais leve do que parece e cabe numa caixa de gelo.',
    'E enquanto você carrega ele pelos seiscentos metros até o cais, você passa por sete pessoas e nenhuma pergunta nada, porque na cidade toda o normal é ver alguém carregando caixa de gelo.',
    d=>c13_sabeDoTobin(d) ? 'A parte ruim vem depois: você não avisou o Tobin.' : 'A parte ruim vem depois: alguém cuidava dele, e você não sabe quem.',
    d=>`Você sabe quando é a próxima entrega, porque estava escrito na porta: ${c13_proximaEntrega(d)}${d.flags.viu_a_entrega_na_fabrica || d.flags.conheceu_o_goro ? ', às quatro e vinte' : ''}. Quem abrir aquela porta com dois baldes na mão acha a câmara vazia.`,
    'E uma câmara vazia não diz se ele morreu, se levaram, ou se a Liga veio.'
  ],
  ef:{flag:['levou_o_filhote','nao_avisou_o_goro'],
      rep:{eixo:'bom',delta:1,motivo:'Tirou o Articuno da câmara fria'},
      moral:-10,
      npc:{nome:'Tobin', opiniao:-2, memoria:'Abriu a câmara fria com dois baldes e ela estava vazia.'},
      registrar:d=>c13_sabeDoTobin(d) ? 'Levou o Articuno pequeno sem avisar o Tobin.' : 'Levou o Articuno pequeno da câmara fria sem avisar quem cuidava dele.'},
  escolhas:[
    {texto:'Voltar e avisar o Tobin antes de embarcar.', vai:'c13_goro', cond:c13_sabeDoTobin},
    ...c13_irAoDane('Embarcar com o Sr. Dane.'),
    {texto:'Deixar um bilhete na porta da câmara.', vai:'c13_bilhete'},
    {texto:'Chamar a Dra. Cordell antes.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone && !d.flags.ivone_veio}
  ]
},

c13_bilhete:{
  texto:[
    'Você arranca uma folha do caderno e escreve, e escreve cinco versões e amassa quatro.',
    'A que fica é:',
    d=>d.flags.goro_contou
      ? '**"Eu levei ele pra casa. Ele tava vivo quando eu saí. Você cuidou bem. Não foi culpa sua a asa, foi culpa da rede e a rede você cortou. — {um|uma} que passou por aqui"**'
      : '**"Eu levei ele pra casa. Ele tava vivo quando eu saí. Você cuidou bem. — {um|uma} que passou por aqui"**',
    'Você prende com a fita que já estava na porta.',
    d=>`É pra quem abrir esse portão ${c13_proximaEntrega(d)}, com dois baldes na mão, achar alguma coisa além de um vazio.`
  ],
  ef:{flag:['deixou_o_bilhete'], limpaFlag:'nao_avisou_o_goro',
      npc:{nome:'Tobin', opiniao:5, memoria:'Achou um bilhete na porta da câmara fria em vez de um vazio.'},
      rep:{eixo:'bom',delta:4,motivo:'Escreveu cinco versões e deixou a certa'},
      moral:15,
      registrar:'Deixou um bilhete na porta da câmara fria.',
      presagio:d=>d.flags.goro_contou ? '"Não foi culpa sua a asa." Você não sabia se era verdade e escreveu mesmo assim.' : '"Você cuidou bem." Você não sabe disso. Escreveu mesmo assim.'},
  escolhas:[
    ...c13_irAoDane('Embarcar com o Sr. Dane.'),
    {texto:'Voltar e falar com ele em pessoa mesmo assim.', vai:'c13_goro', cond:c13_sabeDoTobin},
    {texto:'Chamar a Dra. Cordell.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone && !d.flags.ivone_veio},
    {texto:'Contar no cais antes de sair.', vai:'c13_avisou_a_colonia', cond:d=>!d.flags.avisou_a_colonia}
  ]
},

c13_travessia:{
  falante:'Sr. Dane',
  vozes:['N'],
  texto:[
    'Vocês saem às cinco da manhã.',
    'O barco tem doze pés, motor de popa pequeno e um banco de madeira que o pai dele lixou em mil novecentos e cinquenta e três.',
    d=>!c13_comVoce(d) ? '' : d.flags.ryuzo_sabe
      ? 'O caixote com o Articuno pequeno vai no fundo do barco, entre os seus pés, com gelo picado por baixo, e o Sr. Dane olha pra ele de vez em quando, sem falar nada.'
      : 'O caixote com o Articuno pequeno vai no fundo do barco, entre os seus pés, com gelo picado por baixo, e o Sr. Dane não pergunta o que tem dentro.',
    'A primeira hora é normal. Mar de dois pés, vento de través, e o Sr. Dane cantarolando alguma coisa antiga sem letra.',
    'Na segunda hora a temperatura cai.',
    'Não gradualmente. Tem uma linha na água — dá pra ver, é uma faixa mais escura de uns cem metros de largura — e quando o barco cruza essa linha, o ar muda de uma vez.',
    'Você põe a mão na água antes e depois. Antes: fria. Depois: dói.',
    'Na terceira hora aparece o primeiro gelo à deriva, do tamanho de uma mesa, e o Sr. Dane desvia sem comentar.',
    'Depois aparece outro. E outro.',
    'E a duzentos metros das ilhas, o mar acaba.',
    'Não tem transição. Tem água e tem chão branco, e a linha entre os dois é reta.',
    'Sr. Dane desliga o motor e fica olhando por um tempo muito longo.',
    '"Pronto", ele diz baixinho, pra ele mesmo. "Agora eu vi."'
  ],
  ef:{flag:'atravessou',
      executar:()=>{ c13_atravessar(); return []; },
      npc:{nome:'Sr. Dane', opiniao:5, memoria:'Atravessou com você até a borda do gelo e disse "agora eu vi".'},
      registrar:'Atravessou até as Ilhas Seafoam. O mar vira chão a 200 metros da ilha.',
      presagio:'"Agora eu vi." Ele conseguiu o que queria antes de você conseguir o que você quer.'},
  escolhas:[
    {texto:'Desembarcar com o caixote e levar pra dentro.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Desembarcar no gelo.', vai:'c13_ilha'},
    {texto:'"Sr. Dane, volta. Isso não é lugar."', vai:'c13_voltou'},
    {texto:'Perguntar o que ele viu.', vai:'c13_o_que_ele_viu'}
  ]
},

/* a travessia de novo: a mesma linha escura na água, e ele já viu */
c13_travessia_de_novo:{
  repetivel:true,
  texto:[
    'Vocês saem às cinco da manhã de novo.',
    d=>c13_comVoce(d) ? 'Dessa vez tem um caixote de gelo no fundo do barco, entre os seus pés.' : '',
    'A faixa escura na água, o ar que muda de uma vez, o primeiro gelo do tamanho de uma mesa: o Sr. Dane desvia de tudo sem olhar, porque já viu.',
    d=>d.flags.c13_caverna_caiu
      ? 'Às oito, o mar acaba de novo na mesma linha reta. Onde era a boca da caverna, agora é água.'
      : 'Às oito, o mar acaba de novo na mesma linha reta, a duzentos metros das ilhas.'
  ],
  ef:{executar:()=>{ c13_atravessar(); return []; }},
  escolhas:[
    {texto:'Desembarcar com o caixote e levar pra dentro.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Desembarcar no gelo.', vai:'c13_ilha'},
    {texto:'"Sr. Dane, volta."', vai:'c13_voltou', cond:c13_nova('c13_voltou')},
    {texto:'Perguntar o que ele viu.', vai:'c13_o_que_ele_viu', cond:c13_nova('c13_o_que_ele_viu')}
  ]
},

c13_o_que_ele_viu:{
  falante:'Sr. Dane',
  vozes:['P','N','P','N','N','N','N','N','N'],
  texto:[
    '"O que você viu?"',
    'Ele demora.',
    '"Eu vi que o mar não faz isso."',
    '"Isso eu já sabia."',
    '"Você sabia de ouvir. Eu sei de olhar." Ele aponta a linha reta entre a água e o gelo. "Olha o corte."',
    'Você olha.',
    '"Gelo natural não faz linha reta, {meu filho|minha filha}. Gelo natural faz dedo, faz língua, faz borda podre. Ele avança onde é mais fácil e para onde é mais difícil."',
    '"Isso aí tem cento e poucos metros de linha reta."',
    'Ele engata a marcha lenta pra manter o barco.',
    '"Isso aí é alguém segurando na mão."',
    'Ele olha pra você.',
    '"E quem segura na mão, larga."'
  ],
  ef:{flag:['sabe_da_linha_reta','ryuzo_entendeu'],
      npc:{nome:'Sr. Dane', opiniao:6, memoria:'Reparou que a borda do gelo é uma linha reta, e que isso quer dizer que alguém segura.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou a um homem de setenta e quatro anos o que ele viu'},
      registrar:'A borda do gelo é uma linha reta de cem metros — não é gelo natural.',
      presagio:'"E quem segura na mão, larga." Ele disse isso como se fosse boa notícia.'},
  escolhas:[
    {texto:'Desembarcar com o caixote e levar pra dentro.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Desembarcar no gelo.', vai:'c13_ilha'},
    {texto:'"E se soltar de uma vez?"', vai:'c13_se_soltar'},
    {texto:'"Sr. Dane, volta."', vai:'c13_voltou', cond:c13_nova('c13_voltou')}
  ]
},

c13_se_soltar:{
  falante:'Sr. Dane',
  vozes:['P','N','P','N','N','N','N','P','N','N'],
  texto:[
    '"E se soltar de uma vez?"',
    'Ele pensa com o queixo.',
    '"Aí vem tudo de uma vez."',
    '"Tudo o quê?"',
    '"A água." Ele bate na borda do barco. "Tem duzentos quilômetros de mar preso aí, {meu filho|minha filha}. Preso quer dizer: não tá circulando, não tá subindo, não tá descendo."',
    '"E quando soltar, ele vai voltar a fazer tudo isso ao mesmo tempo."',
    'Ele olha a linha reta.',
    '"Vai ter uma onda."',
    '"De que tamanho?"',
    '"Sei lá. Nunca ninguém viu isso pra medir."',
    'Ele engata a ré e afasta o barco uns cinquenta metros da borda, sem você pedir.',
    '"Mas se você for lá dentro fazer ele largar, você me avisa antes, que eu vou querer estar longe e de proa pro mar."'
  ],
  ef:{flag:['sabe_da_onda'],
      rep:{eixo:'bom',delta:3,motivo:'Perguntou o que acontece quando solta'},
      instabilidade:1,
      registrar:'Se o gelo soltar de uma vez, haverá uma onda. Ninguém sabe de que tamanho.',
      presagio:'Ele afastou o barco antes de terminar a frase. Instinto de setenta e quatro anos.'},
  escolhas:[
    {texto:'Desembarcar com o caixote e levar pra dentro.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Desembarcar no gelo.', vai:'c13_ilha'},
    {texto:'"Então volta pra Fuchsia e avisa o cais."', vai:'c13_mandou_avisar'},
    {texto:'"Sr. Dane, volta. Isso não é lugar."', vai:'c13_voltou', cond:c13_nova('c13_voltou')}
  ]
},

c13_mandou_avisar:{
  falante:'Sr. Dane',
  vozes:['P','N','P','N','P','N','N','N','N'],
  texto:[
    '"Então volta pra Fuchsia e avisa o cais."',
    '"E te deixo aqui?"',
    '"Me deixa aqui."',
    'Ele não gosta. Dá pra ver que ele não gosta pela primeira vez na viagem inteira.',
    '"Seis horas, ida e volta. Às três eu tô aqui."',
    '"E se eu não estiver aqui?"',
    '"Aí eu espero."',
    'Ele engata.',
    '"Hoje eu fico até você sair, com vento ou sem vento. Eu tenho setenta e quatro anos e vento não é problema meu."',
    'Ele te deixa na borda do gelo com uma garrafa de água, meia laranja e um cobertor de flanela que estava embaixo do banco, e dá meia-volta.',
    'A cem metros ele para o motor, vira, e grita:',
    '"Se o mar subir, sobe na rocha, não corre pra ilha! Rocha alta, não ilha!"',
    'E vai.',
    'Você não entra. Você senta na borda do gelo, enrolad{o|a} no cobertor, e fica olhando a boca da caverna por seis horas e meia, e a boca da caverna fica olhando de volta.',
    'Às três da tarde o Staryu aparece no horizonte. O Sr. Dane encosta no mesmo lugar, do mesmo jeito, e diz uma coisa só:',
    '"Puxaram tudo pra terra."'
  ],
  ef:{flag:['avisou_o_cais','ryuzo_avisou'],
      itens:{'Cobertor de flanela':1},
      executar:()=>{ Relogio.avancar(7); return []; },
      npc:{nome:'Sr. Dane', opiniao:9, memoria:'Voltou sozinho pra tirar a frota de Fuchsia da água e voltou pra te buscar na borda do gelo.'},
      rep:{eixo:'bom',delta:6,motivo:'Mandou avisar a cidade antes de tentar qualquer coisa'},
      moral:15, instabilidade:-1,
      registrar:'A frota de Fuchsia foi puxada para terra antes de você entrar na caverna.'},
  escolhas:[
    {texto:'Voltar no barco, pegar o caixote e levar pra dentro.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Entrar na ilha.', vai:'c13_ilha'}
  ]
},

c13_voltou:{
  falante:'Sr. Dane',
  vozes:['P','N','N'],
  texto:[
    '"Sr. Dane, volta. Isso não é lugar."',
    'Ele te olha muito tempo.',
    'Depois vira o barco sem discutir, e é isso que dói: ele não discute.',
    'No caminho de volta ele diz uma coisa só, umas duas horas depois, já perto da costa:',
    '"Meu pai dizia que o mar avisa três vezes."',
    'Pausa.',
    '"Essa foi a segunda."',
    'O Staryu encosta no cais de Fuchsia antes do meio-dia, e o cais inteiro vê que ele voltou cedo.'
  ],
  ef:{flag:'nao_foi_seafoam', instabilidade:2, moral:-10,
      executar:()=>{ Relogio.avancar(3); return []; },
      rep:{eixo:'ruim',delta:1,motivo:'Recuou da borda do gelo das Seafoam'},
      npc:{nome:'Sr. Dane', opiniao:2, memoria:'Voltou sem discutir quando você pediu.'},
      registrar:'Não desembarcou nas Seafoam. Voltou da borda do gelo.',
      presagio:'Ele não discutiu. Isso pesa mais do que discussão.'},
  escolhas:[
    {texto:'Voltar ao barco dele outro dia e ir de novo.', vai:'c13_ryuzo'},
    {texto:'Procurar o Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin},
    {texto:'Ir à colônia atrás dos registros.', vai:'c13_colonia'},
    {texto:'Ficar no cais.', vai:'c13_cais'},
    {texto:'Seguir para Cinnabar.', vai:'c13_fim'}
  ]
},

/* ─────────────── AS ILHAS ─────────────── */

c13_ilha:{
  texto:[
    'O Sr. Dane te passa a lanterna do barco antes de você descer, uma de borracha, pesada, que já caiu na água mais de uma vez.',
    'As Ilhas Seafoam são duas formações de rocha branca furadas por dentro: a água entra por baixo e sai pelo outro lado, e o barulho que isso faz deu o nome delas.',
    'Hoje não faz barulho nenhum.',
    'Você desembarca andando, no gelo, por onde barco entrava.',
    'O gelo aguenta o seu peso e faz um som de coisa maciça, não de coisa fina, e isso é mais assustador do que se rachasse.',
    'A boca da caverna tem uns nove metros de altura e a maré está congelada exatamente na metade do ciclo, com a linha de maré alta marcada na rocha e o gelo parado quatro metros abaixo dela.',
    'Dentro, as paredes são de gelo transparente.',
    'E tem coisa dentro.',
    'Magikarp. Muito Magikarp, em cardume, parado na posição exata em que estava nadando, todos virados pro mesmo lado.',
    'Tentacool, uns quinze, a um metro e meio de profundidade no gelo.',
    'E a três metros da parede, de olhos abertos, na horizontal, um Dewgong inteiro.'
  ],
  ef:{flag:'entrou_nas_espuma', instabilidade:1, moral:-8,
      registrar:'Entrou nas cavernas congeladas das Seafoam. A maré parou na metade do ciclo.',
      presagio:'Todos virados pro mesmo lado. O congelamento pegou todo mundo no mesmo segundo.'},
  escolhas:[
    {texto:'Voltar no barco, pegar o caixote e levar pra dentro.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Ir mais fundo.', vai:'c13_fundo'},
    {texto:'Tentar quebrar o gelo e tirar o Dewgong.', vai:'c13_dewgong'},
    {texto:'Contar as camadas do gelo.', vai:'c13_camadas'},
    {texto:'Voltar. Isso é maior do que uma pessoa.', vai:'c13_voltou_da_caverna'}
  ]
},

/* as ilhas de novo: a caverna como você deixou, ou o mar onde ela era */
c13_ilha_de_novo:{
  repetivel:true,
  texto:[
    d=>d.flags.c13_caverna_caiu
      ? 'Onde era a boca da caverna agora é mar, escuro e parado, e não tem por onde entrar.'
      : 'Você desembarca andando no gelo de novo, por onde barco entrava, e a boca da caverna está como você deixou: a maré parada na metade, o cardume de Magikarp virado pro mesmo lado.',
    d=>d.flags.c13_caverna_caiu ? '' : d.flags.salvou_dewgong
      ? 'Na parede, o buraco de onde você tirou o Dewgong já fechou de novo.'
      : 'Na parede, o Dewgong continua de olhos abertos, a três metros do lado de dentro.'
  ],
  escolhas:[
    {texto:'Voltar no barco, pegar o caixote e levar pra dentro.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Ir mais fundo.', vai:'c13_fundo', cond:d=>!d.flags.c13_caverna_caiu},
    {texto:'Tentar quebrar o gelo e tirar o Dewgong.', vai:'c13_dewgong', cond:d=>!d.flags.c13_caverna_caiu && !Historia.jaAconteceu('c13_dewgong')},
    {texto:'Contar as camadas do gelo.', vai:'c13_camadas', cond:d=>!d.flags.c13_caverna_caiu && !Historia.jaAconteceu('c13_camadas')},
    {texto:'Procurar mais Pokémon ao longo da parede lateral.', vai:'c13_o_filhote', cond:d=>!d.flags.c13_caverna_caiu && !Historia.jaAconteceu('c13_o_filhote')},
    {texto:'Voltar pro barco e pra Fuchsia.', vai:'c13_de_volta_ao_cais', ef:C13_VOLTA}
  ]
},

c13_camadas:{
  texto:[
    'Você encosta a lanterna na parede e olha de lado, como se olha vidro.',
    'O gelo tem camadas.',
    'Camadas finas, regulares, paralelas, como anel de tronco de árvore — e cada uma separada da outra por uma linha mais escura de bolha aprisionada.',
    'Você conta.',
    'Dezenove.',
    d=>d.flags.sabe_da_curva
      ? `Dezenove camadas, e a água baixa meio grau por semana desde ${c13_ext(c13_queda(d))}, e hoje faz dezenove semanas.`
      : 'Dezenove camadas, iguais, como quem conta tempo.',
    d=>d.flags.sabe_da_curva ? 'Uma camada por semana.' : '',
    'Isso não é congelamento. Congelamento é um evento.',
    d=>d.flags.sabe_da_curva
      ? 'Isso é manutenção: alguém refaz uma camada por semana, há dezenove semanas, como quem passa pano.'
      : 'Isso é manutenção: alguém refaz uma camada de cada vez, com paciência, como quem passa pano.'
  ],
  ef:{flag:['contou_as_camadas','sabe_da_manutencao'],
      rep:{eixo:'bom',delta:4,motivo:'Contou as camadas e entendeu o que elas contavam'},
      registrar:d=>{ const q = c13_queda(d); return d.flags.sabe_da_curva ? `O gelo das Seafoam tem 19 camadas — uma por semana, desde ${q.dia} de ${q.mes}.` : 'O gelo das Seafoam tem 19 camadas iguais, refeitas uma de cada vez.'; },
      presagio:d=>d.flags.sabe_da_curva ? 'Como quem passa pano. Dezenove semanas. Quem faz isso está cansado.' : 'Como quem passa pano. Quem faz isso está cansado.'},
  escolhas:[
    {texto:'Ir mais fundo.', vai:'c13_fundo'},
    {texto:'Tentar tirar o Dewgong.', vai:'c13_dewgong', cond:c13_nova('c13_dewgong')},
    {texto:'Procurar mais Pokémon ao longo da parede lateral.', vai:'c13_o_filhote', cond:c13_nova('c13_o_filhote')},
    {texto:'Voltar pro barco.', vai:'c13_voltou_da_caverna'}
  ]
},

c13_dewgong:{
  texto:[
    'Você quebra gelo por quarenta minutos com o que tem: uma pedra, o cabo da lanterna e, no fim, as mãos dentro da luva.',
    'Chega até ele.',
    'Ele está vivo.',
    'Em torpor — batimento tão lento que você precisa encostar o ouvido na caixa torácica dele por quase um minuto pra ter certeza, e no minuto inteiro você conta quatro batidas.',
    'Quatro batidas por minuto.',
    'Tirar do gelo é fácil agora. Manter vivo fora do gelo é outra coisa: sem o torpor, ele precisa de água, e a água aqui virou chão, e a água de fora está a dois graus.'
  ],
  ef:{flag:'achou_o_dewgong',
      presagio:'Quatro batidas por minuto. O gelo não está matando ele. O gelo está segurando ele.'},
  escolhas:[
    {texto:'Carregar até o barco. O Sr. Dane tem tanque de vivo.', vai:'c13_salvou_dewgong'},
    {texto:'Colocar de volta no gelo. O torpor era o que estava salvando ele.', vai:'c13_deixou_dewgong'},
    {texto:'Deixar como está e ir mais fundo.', vai:'c13_fundo'},
    {texto:'Fechar o buraco com os pedaços e ir mais fundo.', vai:'c13_deixou_dewgong'}
  ]
},

c13_salvou_dewgong:{
  texto:[
    'Você carrega um Dewgong de cento e vinte quilos por cento e setenta metros de caverna congelada.',
    'Não dá. Fisicamente não dá, e você sabe disso aos vinte metros.',
    'Você faz mesmo assim, arrastando os últimos setenta pelo gelo, com ele deitado na sua jaqueta usada como trenó.',
    'Sr. Dane vê você chegar de longe e não faz uma pergunta. Só abre a tampa do tanque de vivo, que é um tanque de Magikarp de duzentos litros e não de Dewgong, e que não vai caber.',
    'Ele cabe até a metade. A outra metade fica pra fora, coberta com um cobertor de flanela molhado, e o Sr. Dane vira a proa pra Fuchsia com o motor no talo.',
    'E dezenove semanas de gelo continuam exatamente iguais atrás de vocês.',
    'No cais de Fuchsia, a caminhonete do aquário municipal já está esperando, porque alguém viu o Staryu chegar torto e correu avisar.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Arrastou um Dewgong por cento e setenta metros de gelo'},
      hp:-6, causa:'Esforço extremo nas Seafoam',
      flag:'salvou_dewgong',
      executar:()=>{ Relogio.avancar(3); return []; },
      moral:10,
      npc:{nome:'Sr. Dane', opiniao:7, memoria:'Te viu arrastar um Dewgong de 120 kg por 170 metros de gelo e não perguntou nada.'},
      registrar:'Tirou um Dewgong do gelo das Seafoam e chegou com ele vivo ao aquário de Fuchsia.',
      presagio:'Um. De uma caverna inteira.'},
  escolhas:[...c13_emTerra()]
},

c13_deixou_dewgong:{
  texto:[
    'Você recoloca ele na cavidade e empurra os pedaços de gelo de volta, encaixando um por um, como quebra-cabeça.',
    'Em quarenta minutos a cavidade fecha sozinha — a água do buraco congela por cima e sela.',
    'O batimento continua em quatro por minuto.',
    'Você fez a coisa mais difícil que existe, que é entender que a ajuda certa era não ajudar, e ninguém viu você fazer.',
    'E é bom que ninguém tenha visto, porque de fora ia parecer covardia, e a diferença entre as duas coisas só existe dentro da sua cabeça.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Entendeu que salvar não é sempre tirar de onde está'},
      flag:'entendeu_o_torpor',
      registrar:'Deixou o Dewgong no gelo, em torpor. O torpor era o que o mantinha vivo.'},
  escolhas:[
    {texto:'Ir mais fundo.', vai:'c13_fundo'},
    {texto:'Contar as camadas do gelo.', vai:'c13_camadas', cond:c13_nova('c13_camadas')},
    {texto:'Procurar mais Pokémon em torpor.', vai:'c13_o_filhote', cond:c13_nova('c13_o_filhote')},
    {texto:'Voltar pro barco.', vai:'c13_voltou_da_caverna'}
  ]
},

/* ── O filhote e a figura na pedra ──────────────────────── */
c13_o_filhote:{
  texto:[
    'A trinta metros da parede lateral, numa reentrância que a lanterna só pega de raspão, tem uma coisa pequena que se mexe.',
    'É um Seel filhote. Pequeno de verdade: uns quarenta centímetros, com a pelagem ainda clara da primeira muda.',
    'Ele não está em torpor. Ele está acordado, e é isso que está errado.',
    'Todo Pokémon dessa caverna baixou o metabolismo e parou. Ele não conseguiu, porque filhote não sabe, e por isso ele passou dezenove semanas acordado num lugar onde não tem o que comer.',
    'Ele está com metade do peso que devia.',
    'Quando a luz bate nele, ele não foge. Ele não tem energia pra fugir e provavelmente não teria de qualquer jeito.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} chega antes de você e para a um metro, e não encosta, e olha pra você esperando você decidir.`
               : 'Você para a um metro e fica agachad{o|a} olhando, e o filhote olha de volta sem nenhuma expectativa.';
    }
  ],
  ef:{flag:'achou_o_seel',
      registrar:'Um Seel filhote passou dezenove semanas acordado nas Seafoam, sem conseguir entrar em torpor.',
      presagio:'Os adultos dormiram. Ele não soube dormir.'},
  escolhas:[
    {texto:'Levar ele daqui. Agora.', vai:'c13_salvou_o_filhote'},
    {texto:'Deixar. Você não tem como alimentar isso.', vai:'c13_deixou_o_filhote'},
    {texto:'Tentar pôr ele em torpor junto dos adultos.', vai:'c13_torpor_do_filhote'}
  ]
},

c13_salvou_o_filhote:{
  texto:[
    'Você abre a jaqueta, põe ele por dentro contra a sua barriga e fecha o zíper até o queixo dele.',
    'Ele pesa menos do que devia e é gelado de um jeito que atravessa a camisa em quatro segundos.',
    'Os cento e setenta metros de volta você faz com os dois braços cruzados na frente do corpo, segurando por baixo, e sem lanterna, porque a lanterna não cabe nessa geometria.',
    'Você bate em três paredes.',
    'Lá fora, o vento de dois graus parece morno.',
    'O Sr. Dane vê você sair da caverna com a jaqueta cheia e abre o casaco dele sem falar nada, e vocês fazem a travessia com o filhote entre os dois.',
    'Ele começa a tremer na terceira hora, e tremer é a melhor notícia do dia, porque tremer custa energia e ele decidiu que valia a pena gastar.'
  ],
  ef:{flag:'salvou_o_filhote', moral:6,
      executar:()=>{ Relogio.avancar(3); return []; },
      hp:-4, causa:'Três horas de travessia molhado e no frio',
      rep:{eixo:'bom', delta:3, motivo:'Tirou um filhote de Seel das Seafoam dentro da própria jaqueta.'},
      registrar:'Tirou um Seel filhote das Seafoam. Ele chegou vivo a Fuchsia, tremendo.',
      presagio:'Ele viu de onde você tirou ele. E não foi só ele que viu.'},
  escolhas:[...c13_emTerra()]
},

c13_deixou_o_filhote:{
  texto:[
    'Você não tem tanque, não tem ração marinha, não tem como manter um filhote de Seel vivo por três horas de travessia e mais um dia depois disso.',
    'Você sabe disso e é verdade e continua sendo a coisa mais difícil que você fez hoje.',
    d=>d.flags.c13_deixou_o_cobertor
      ? 'Você tira o cobertor de flanela da mochila e deixa com ele na reentrância, que não resolve nada e que você faz mesmo assim.'
      : 'Você tira a blusa que estava por baixo da jaqueta e deixa com ele na reentrância, que não resolve nada e que você faz mesmo assim.',
    'Nos primeiros vinte metros de volta você não olha pra trás. Nos vinte seguintes, olha.',
    'Ele não se mexeu.'
  ],
  ef:{flag:'deixou_o_filhote', moral:-2,
      executar:()=>{ Estado.marcar('c13_deixou_o_cobertor', Estado.usarItem('Cobertor de flanela')); return []; },
      registrar:'Deixou o Seel filhote na caverna, enrolado no que você tinha.'},
  escolhas:[
    {texto:'Ir mais fundo.', vai:'c13_fundo'},
    {texto:'Contar as camadas do gelo.', vai:'c13_camadas', cond:c13_nova('c13_camadas')},
    {texto:'Voltar pro barco.', vai:'c13_voltou_da_caverna'}
  ]
},

c13_torpor_do_filhote:{
  texto:[
    'Você carrega ele os quarenta metros até onde estão os adultos e encosta ele no flanco do maior, que está a quatro batidas por minuto e que não reage a nada.',
    'O filhote se encaixa na curva do corpo do adulto do jeito que ele claramente já fez muitas vezes.',
    'E não dorme.',
    'Você espera quarenta minutos agachad{o|a}, com a lanterna apagada pra não atrapalhar, e ele fica acordado os quarenta minutos inteiros, tremendo.',
    'Torpor não é decisão. É uma coisa que o corpo faz ou não faz, e o corpo dele não aprendeu.',
    'Você fica ali agachad{o|a} no escuro entendendo que existe um problema que não tem solução elegante, e que a escolha que sobra é a deselegante.'
  ],
  ef:{flag:'tentou_o_torpor',
      registrar:'Tentou pôr o filhote em torpor junto dos adultos. Não funcionou.'},
  escolhas:[
    {texto:'Levar ele daqui dentro da jaqueta.', vai:'c13_salvou_o_filhote'},
    {texto:'Deixar ele com os adultos e ir embora.', vai:'c13_deixou_o_filhote'}
  ]
},

c13_a_pedra_do_meio:{
  texto:[
    'Na travessia de volta, com o barco a uns quatro quilômetros da ilha, o Sr. Dane desvia de uma coisa que você não tinha visto.',
    'É um afloramento de rocha que sai do mar uns seis metros, preto, sem nada em cima. Não está na carta como ilha: está como pedra.',
    'Só que hoje tem alguma coisa em cima dela.',
    'Uma pessoa. Sentada. De casaco escuro com capuz, com os joelhos dobrados e os braços em volta dos joelhos, virada pro sul.',
    'A quatro quilômetros da ilha, num afloramento de seis metros, num mar a dois graus, sem barco nenhum amarrado.',
    d=>fala(d.jogador.nome, 'Tem uma pessoa ali.'),
    'Ele olha, desvia mais um pouco, e não muda de expressão.',
    fala('Sr. Dane', 'Tem.'),
    d=>fala(d.jogador.nome, 'Como ela chegou ali?'),
    fala('Sr. Dane', 'Não sei.'),
    'Ele corrige o rumo.',
    d=>fala('Sr. Dane', `Tá ali desde ${c13_queda(d).mes}. Eu passo perto daqui toda quarta.`, 'baixo'),
    'Você olha até a pedra sumir, e em nenhum momento a pessoa se mexe, e em nenhum momento ela olha pro barco.'
  ],
  ef:{flag:'viu_o_red',
      registrar:'Havia alguém sentado num afloramento de rocha a quatro quilômetros da costa das Seafoam. O Sr. Dane diz que está lá desde que o gelo começou.'},
  escolhas:[
    {texto:'Pedir pra encostar na pedra.', vai:'c13_encostar_na_pedra'},
    {texto:'Não pedir. Seguir pra Fuchsia.', vai:'c13_de_volta_ao_cais'}
  ]
},

c13_encostar_na_pedra:{
  texto:[
    d=>fala(d.jogador.nome, 'Encosta.'),
    fala('Sr. Dane', 'Não.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    'Ele não responde na hora. Reduz o motor, o que é mais do que você esperava, e o barco fica derivando a uns oitenta metros da pedra.',
    'Daqui dá pra ver melhor. É um rapaz. Vinte e poucos anos, talvez menos. O casaco é bom, de montanha, do tipo que custa caro e dura vinte anos.',
    'Ele está olhando pro sul, pra direção de onde vocês vieram, pra direção da caverna.',
    'Ele sabe que o barco está ali. Dá pra ver que sabe, pela maneira como ele não olha.',
    d=>fala('Sr. Dane', `Eu tentei encostar em ${c13_mes(d, 3)}.`),
    d=>fala(d.jogador.nome, 'E?'),
    fala('Sr. Dane', 'E eu cheguei a uns vinte metros e resolvi que não.'),
    'Ele acelera de volta.',
    fala('Sr. Dane', 'Eu não sei explicar melhor que isso, {moço|moça}. Eu resolvi que não e eu não sei quem resolveu.', 'baixo')
  ],
  ef:{flag:['viu_o_red','chegou_perto_da_pedra'],
      registrar:'Chegou a oitenta metros da pedra. O rapaz do casaco de montanha olhava para a direção da caverna.',
      presagio:'"Eu resolvi que não e eu não sei quem resolveu."'},
  escolhas:[
    {texto:'Seguir pra Fuchsia.', vai:'c13_de_volta_ao_cais'}
  ]
},

c13_voltou_da_caverna:{
  falante:'Sr. Dane',
  vozes:['N'],
  texto:[
    'Você sai.',
    'Sr. Dane não pergunta nada e a viagem de volta é silenciosa, e o silêncio de três horas num barco de doze pés é uma coisa muito comprida.',
    'A três quilômetros da ilha ele desliga o motor e fica olhando pra trás por um tempo.',
    '"Eu vi", ele diz, finalmente.',
    'Pausa longa.',
    '"Tá bom. Eu vi."',
    'E liga o motor de novo.'
  ],
  ef:{flag:'recuou_espuma', instabilidade:1, moral:-8,
      executar:()=>{ Relogio.avancar(3); return []; },
      registrar:'Saiu da caverna sem ir ao fundo.',
      presagio:'"Tá bom. Eu vi." Ele conseguiu o dele. Você não conseguiu o seu.'},
  escolhas:[
    {texto:'Olhar o mar no caminho.', vai:'c13_a_pedra_do_meio', cond:c13_nova('c13_a_pedra_do_meio')},
    ...c13_emTerra()
  ]
},

/* chegar em Fuchsia sem ter resolvido: o cais, e tudo o que dá pra fazer em terra */
c13_de_volta_ao_cais:{
  repetivel:true,
  texto:[
    'O Staryu encosta no cais de Fuchsia.',
    d=>d.flags.avisou_o_cais
      ? 'Os trinta e nove barcos estão em terra, em cima de rolo de tronco, e o cais parece maior sem eles.'
      : 'Trinta e nove barcos continuam amarrados, e sessenta pessoas continuam olhando pro sul.',
    'O Sr. Dane amarra o cabo, desliga o motor e fica sentado mais um pouco, com a mão na borda do barco.'
  ],
  escolhas:[...c13_emTerra()]
},

c13_fundo:{
  texto:[
    'Quanto mais fundo, mais frio e mais claro.',
    'O gelo do fundo é transparente como vidro de janela e não tem bolha nenhuma, o que quer dizer que congelou devagar, com paciência.',
    'A caverna se abre numa câmara enorme onde a água — a água antiga, de antes de tudo isso — formou colunas do chão ao teto ao longo de séculos.',
    'As colunas estão inteiras. Nenhuma quebrou.',
    'No centro da câmara, num pilar de gelo que subiu do chão como se tivesse crescido, está Articuno.',
    'Ele não está preso. Ele está pousado.',
    d=>d.flags.contou_as_camadas
      ? 'E ao redor dele, num raio de uns dez metros, o gelo é diferente do resto: tem camada, como tronco de árvore, e você já contou as camadas na entrada e sabe quantas são.'
      : 'E ao redor dele, num raio de uns dez metros, o gelo é diferente do resto: tem camada, como tronco de árvore, uma em cima da outra.',
    d=>d.flags.contou_as_camadas && d.flags.sabe_da_curva ? 'Ele está aqui há dezenove semanas.' : 'Ele está aqui desde que isso começou.',
    'Sem sair. Sem caçar. Sem se mexer o suficiente pra deixar marca no chão.'
  ],
  ef:{executar:d=>{ c13_viuArticuno(d); return []; },
      instabilidade:1,
      registrar:'Encontrou Articuno no fundo das Seafoam, parado no mesmo pilar desde que o gelo começou.',
      presagio:'Nenhuma coluna quebrou. Ele teve cuidado com um lugar que ele está destruindo.'},
  escolhas:[
    {texto:'Voltar no barco, pegar o caixote e trazer até ele.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Ficar parad{o|a} e observar.', vai:'c13_observar_articuno'},
    {texto:'Chegar perto devagar.', vai:'c13_perto'},
    {texto:'Falar com ele em voz alta.', vai:'c13_perguntou_articuno'},
    {texto:'Atacar. Ele está enfraquecido.', vai:'c13_luta_articuno'},
    {texto:'Sair. Deixar ele em paz.', vai:'c13_saiu_articuno'}
  ]
},

/* o fundo de novo: ele continua no pilar, olhando pro mesmo lugar */
c13_fundo_de_novo:{
  repetivel:true,
  texto:[
    'Na câmara do fundo, Articuno continua no pilar, e o gelo em volta dele continua em camadas.',
    d=>d.flags.prometeu_a_articuno || d.flags.contou_pra_articuno
      ? 'Ele te vê entrar e olha pras suas mãos, pra ver se você trouxe.'
      : 'Ele não se mexe quando você entra, mas você sabe que ele viu.'
  ],
  escolhas:[
    {texto:'Voltar no barco, pegar o caixote e trazer até ele.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Ficar parad{o|a} e observar.', vai:'c13_observar_articuno', cond:c13_nova('c13_observar_articuno')},
    {texto:'Chegar perto devagar.', vai:'c13_perto', cond:c13_nova('c13_perto')},
    {texto:'Falar com ele em voz alta.', vai:'c13_perguntou_articuno', cond:c13_nova('c13_perguntou_articuno')},
    {texto:'"Eu sei onde ele está."', vai:'c13_eu_sei_onde', cond:c13_podeDizerOnde},
    {texto:'Atacar. Ele está enfraquecido.', vai:'c13_luta_articuno', cond:d=>!d.flags.devolveu_o_filhote},
    {texto:'Sair. Deixar ele em paz.', vai:'c13_saiu_articuno'}
  ]
},

c13_observar_articuno:{
  texto:[
    'Você senta no gelo e espera.',
    'Vinte minutos. Quarenta. Uma hora.',
    'Ele não se move. Nem uma vez. Nem pra respirar de forma visível — e você fica tempo demais tentando ver ele respirar e chega a achar que ele está morto.',
    'Na hora e dez, você percebe.',
    'Ele está olhando pra uma direção específica e não muda.',
    'Você segue a linha do olhar dele.',
    'Do outro lado da câmara, a uns trinta metros, na parede, tem um vazio.',
    'Um vazio do formato exato de um Articuno pequeno, escavado no gelo, com as bordas lisas.',
    'Como um ninho.',
    'Ele está olhando pra um lugar onde tinha alguém e não tem mais.'
  ],
  ef:{flag:['viu_o_vazio','sabe_do_segundo'],
      executar:()=>{ Relogio.avancar(1); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Esperou uma hora e dez até ver'},
      moral:-12,
      registrar:'Há um vazio escavado na parede, do formato de um Articuno pequeno. Ele está olhando para lá.',
      presagio:'Ele escavou um ninho e o ninho está vazio. Ele está esperando devolverem.'},
  escolhas:[
    {texto:'Ir até o vazio.', vai:'c13_o_vazio'},
    {texto:'Falar com ele em voz alta.', vai:'c13_perguntou_articuno', cond:c13_nova('c13_perguntou_articuno')},
    {texto:'Chegar perto devagar.', vai:'c13_perto', cond:c13_nova('c13_perto')},
    {texto:'Sair sem tocar em nada.', vai:'c13_saiu_articuno'}
  ]
},

c13_o_vazio:{
  texto:[
    'Você atravessa os trinta metros e chega no vazio da parede.',
    'De perto é pior.',
    'Não é buraco. É trabalho: as bordas foram alisadas, tem uma reentrância no fundo do formato de uma cabeça, e no chão do nicho tem um forro.',
    'Um forro de algas secas e penas azuis, arrumado.',
    'Alguém fez um ninho de algas dentro de uma parede de gelo e alisou as bordas com o bico, e o forro está intacto, e nunca foi usado.',
    'E na beirada do nicho, no gelo, tem uma marca.',
    'Uma marca comprida, de uns quarenta centímetros, com três sulcos paralelos, repetida dezenas de vezes, sobreposta, gasta.',
    'É garra.',
    'É a mesma garra passando no mesmo lugar dezenas de vezes.',
    'Ele vem aqui. Ele vem aqui todo dia, encosta a garra na beirada, e volta pro pilar.'
  ],
  ef:{flag:['viu_a_cama','sabe_do_segundo'],
      rep:{eixo:'bom',delta:3,motivo:'Foi olhar de perto a coisa que doía olhar de perto'},
      moral:-15, instabilidade:1,
      registrar:'Há um ninho de algas e penas escavado na parede, nunca usado, com marcas de garra na beirada.',
      presagio:'Ele preparou o ninho antes. Ele preparou o ninho pra quando devolverem.'},
  escolhas:[
    {texto:'Falar com ele em voz alta.', vai:'c13_perguntou_articuno', cond:c13_nova('c13_perguntou_articuno')},
    {texto:'Chegar perto devagar.', vai:'c13_perto', cond:c13_nova('c13_perto')},
    {texto:'Ir buscar o caixote no barco.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Sair e ir buscar o pequeno em Fuchsia.', vai:'c13_voltar_buscar', cond:d=>(c13_sabeQueVive(d) || c13_sabeDoTobin(d)) && !c13_comVoce(d)},
    {texto:'Sair sem tocar em nada.', vai:'c13_saiu_articuno'}
  ]
},

c13_perto:{
  texto:[
    'Você anda pelo gelo em camadas, e a cada passo a temperatura cai mais.',
    'A cinco metros, sua respiração congela no ar e cai como pó de vidro, e você ouve o som que ela faz batendo no chão.',
    'A três metros, ele finalmente se move.',
    'Vira a cabeça, devagar, com o som de quem não move o pescoço há muito tempo, e olha.',
    'E você entende, na hora, que ele não está te ameaçando nem te aceitando.',
    'Ele está te avaliando pra uma tarefa.',
    d=>d.flags.viu_o_vazio || d.flags.viu_a_cama
      ? 'Ele olha pra você. Depois olha pro vazio da parede do outro lado da câmara. Depois olha pra você de novo.'
      : 'Ele olha pra você. Depois olha pra um ponto da parede do outro lado da câmara, onde tem um vazio escavado no gelo. Depois olha pra você de novo.',
    'Três vezes, em ordem, devagar, como quem explica pra criança.'
  ],
  ef:{flag:['sabe_do_segundo','articuno_te_avaliou'],
      instabilidade:1,
      registrar:'Articuno te mostrou o vazio na parede, três vezes, em ordem.',
      presagio:'Como quem explica pra criança. Ele está pedindo. Ele não sabe pedir de outro jeito.'},
  escolhas:[
    {texto:'"Eu sei onde ele está."', vai:'c13_eu_sei_onde', cond:c13_podeDizerOnde},
    {texto:'"Eu não sei como."', vai:'c13_perguntou_articuno', cond:c13_nova('c13_perguntou_articuno')},
    {texto:'Ir até o vazio ver o que é.', vai:'c13_o_vazio', cond:c13_nova('c13_o_vazio')},
    {texto:'Jogar a Pokébola nele agora, que está distraído.', vai:'c13_traicao_articuno'},
    {texto:'Recuar devagar e sair.', vai:'c13_saiu_articuno'}
  ]
},

c13_perguntou_articuno:{
  vozes:['P'],
  texto:[
    '"O que aconteceu aqui?"',
    'Você fala em voz alta numa câmara de gelo de quarenta metros e a sua voz não ecoa, porque gelo não ecoa, e isso faz a pergunta parecer menor do que ela é.',
    'Não vem resposta em palavra.',
    'Vem em temperatura.',
    'O gelo embaixo dos seus pés fica levemente morno por dois segundos — dois segundos exatos — e você vê, por dentro dele, como filme preso em âmbar:',
    'um casco de barco de baixo pra cima. Uma rede descendo. Luz de holofote na água. Gente se mexendo no convés.',
    'E depois a rede subindo com peso e uma faca cortando e a queda.',
    'Depois frio de novo, e a imagem some, e o gelo volta a ser gelo.',
    'Alguém pescou o menor.',
    'Alguém cortou a rede.',
    'E o maior congelou tudo — o mar, a caverna, a maré, o tempo — pra que nada piorasse enquanto ele não soubesse o que fazer.',
    'Ele não está atacando Kanto.',
    'Ele está segurando uma coisa no lugar há dezenove semanas porque parar tudo foi a única coisa que ele conseguiu pensar.'
  ],
  ef:{flag:['entendeu_articuno','sabe_do_barco','sabe_do_segundo'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Perguntou a um lendário o que tinha acontecido — e ele respondeu'},
      moral:-10,
      registrar:'Articuno congelou as Seafoam para segurar tudo no lugar enquanto não sabe o que fazer.',
      presagio:'Parar tudo foi a única coisa que ele conseguiu pensar.'},
  escolhas:[
    {texto:'"Eu sei onde ele está."', vai:'c13_eu_sei_onde', cond:c13_podeDizerOnde},
    {texto:'"Eu vou buscar quem sabe fazer isso."', vai:'c13_buscar_ajuda', cond:d=>!c13_comVoce(d)},
    {texto:d=>c13_sabeQueVive(d) ? '"Ele tá vivo."' : '"Ele tá vivo." — mesmo sem saber onde.', vai:'c13_ele_ta_vivo', cond:c13_nova('c13_ele_ta_vivo')},
    {texto:'Sair. Você não tem como ajudar nisso.', vai:'c13_saiu_articuno'}
  ]
},

c13_ele_ta_vivo:{
  vozes:['P'],
  texto:[
    '"Ele tá vivo."',
    d=>c13_sabeQueVive(d)
      ? 'Você fala isso porque viu, ou porque ouviu de quem viu.'
      : 'Você fala isso sem saber se é verdade, e se não for, isso fica com você.',
    'A câmara inteira muda de temperatura.',
    'Não esfria: esquenta. Uns dois graus, de uma vez, em quarenta metros de câmara.',
    'E um pedaço de gelo do teto se solta e cai e estoura no chão a uns quinze metros de você, e depois outro, e depois para.',
    'Ele para de segurar por dois segundos e depois volta a segurar.',
    'Você viu, em dois segundos, o que acontece quando ele solta.',
    'E você tem que tomar uma decisão agora, com um lendário do tamanho de um carro olhando pra você, e a decisão é se você promete ou não promete.'
  ],
  ef:{flag:['disse_que_ta_vivo'],
      instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Disse a coisa que ele precisava ouvir'},
      registrar:'Disse a Articuno que o segundo está vivo. A caverna esquentou dois graus por dois segundos.'},
  escolhas:[
    {texto:'Prometer trazer.', vai:'c13_prometeu'},
    {texto:'"Eu não sei onde. Mas eu vou achar."', vai:'c13_buscar_ajuda', cond:d=>!c13_sabeOnde(d) && !c13_comVoce(d)},
    {texto:'"Eu sei onde ele está."', vai:'c13_eu_sei_onde', cond:c13_podeDizerOnde},
    {texto:'Não prometer nada e sair.', vai:'c13_saiu_articuno'}
  ]
},

c13_prometeu:{
  vozes:['P'],
  texto:[
    '"Eu trago ele de volta."',
    'Você promete uma coisa que você não tem como garantir, numa caverna de gelo, para uma coisa que congelou duzentos quilômetros de mar.',
    'Ele olha pra você por um tempo muito longo.',
    'E aí ele desce do pilar.',
    'Pela primeira vez em dezenove semanas, e você sabe que é a primeira vez porque o gelo em volta da base do pilar não tem marca nenhuma de pouso e agora tem.',
    d=>d.flags.viu_a_cama
      ? 'Ele anda até o vazio da parede, encosta a garra na beirada — a marca que você já viu, sobreposta dezenas de vezes — e volta pro pilar.'
      : 'Ele anda até o vazio da parede, encosta a garra na beirada, num lugar onde o gelo está gasto de tanta garra, e volta pro pilar.',
    'E te olha.',
    'Isso é um prazo.',
    'Você não sabe de quantos dias, e ele também não sabe dizer, e os dois sabem que existe.'
  ],
  ef:{flag:['prometeu_a_articuno','divida_com_articuno'],
      executar:d=>{ const L=Estado.lend(144); if(L.disposicao!=='hostil') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:4,motivo:'Prometeu uma coisa difícil na cara de quem ia cobrar'},
      moral:10,
      registrar:'Prometeu a Articuno trazer o segundo de volta.',
      presagio:'Isso é um prazo. Você não sabe de quantos dias.'},
  escolhas:[
    {texto:'Ir buscar o caixote no barco.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'"Me dá o tempo de ir e voltar."', vai:'c13_voltar_buscar', cond:d=>!c13_comVoce(d)},
    {texto:'Buscar ajuda em Fuchsia.', vai:'c13_buscar_ajuda', cond:d=>!c13_comVoce(d)},
    {texto:'Sair sem prometer mais nada.', vai:'c13_saiu_articuno'}
  ]
},

c13_eu_sei_onde:{
  vozes:['P','P'],
  texto:[
    '"Eu sei onde ele está."',
    'A câmara inteira racha.',
    'Não é ataque. É perda de controle: o gelo sobe dois graus, quatro colunas racham pela metade, um pedaço do teto cai a dez metros de você e a água de dezenove semanas começa a aparecer por baixo do gelo do chão, escorrendo.',
    'Ele desce do pilar e para a dois metros de você e é grande de um jeito que não dá pra explicar por número.',
    'E aí ele para de racionar.',
    'Ele para. Fecha os olhos. E o gelo volta.',
    'Quatro segundos de descontrole em dezenove semanas de controle, e ele mesmo corta.',
    'E depois olha pra você e espera.',
    d=>c13_comVoce(d) ? '"Ele tá lá fora, no barco, numa caixa de gelo. Eu trouxe."'
      : d.flags.c13_com_a_medica ? '"Ele tá em Fuchsia, com uma médica. Vivo. Eu vou buscar."'
      : d.flags.achou_o_filhote ? `"Ele tá numa câmara fria em Fuchsia. Tem um homem que leva ração marinha pra ele três vezes por semana desde ${c13_queda(d).mes}."`
      : '"Tem um homem em Fuchsia que sabe. Eu vou trazer ele de volta."',
    'Silêncio.',
    'E depois — e essa é a parte que não tem como contar direito pra ninguém — ele abaixa a cabeça.',
    'Não em ameaça. Abaixa a cabeça, como quem agradece.'
  ],
  ef:{flag:['contou_pra_articuno','prometeu_a_articuno','divida_com_articuno'],
      executar:d=>{ const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true;
        return [{tipo:'mundo', texto:'Articuno soltou o gelo por quatro segundos e voltou a segurar. Ele está esperando você.'}]; },
      rep:{eixo:'bom',delta:6,motivo:'Contou a verdade para quem tinha congelado um mar por não saber dela'},
      moral:20, instabilidade:1,
      registrar:'Contou a Articuno onde o segundo está. Ele abaixou a cabeça.'},
  escolhas:[
    {texto:'Ir buscar o caixote no barco e trazer.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Sair e ir buscar.', vai:'c13_voltar_buscar', cond:d=>!c13_comVoce(d)},
    {texto:'Buscar ajuda em Fuchsia.', vai:'c13_buscar_ajuda', cond:d=>!c13_comVoce(d)}
  ]
},

c13_voltar_buscar:{
  falante:'Sr. Dane',
  vozes:['N','P'],
  texto:[
    'Você refaz os cento e setenta metros de caverna e os duzentos de gelo e o Sr. Dane está exatamente onde disse que estaria, e ele te vê chegando correndo e já está ligando o motor antes de você gritar qualquer coisa.',
    'Três horas de volta.',
    'Você não dorme.',
    'Ele não pergunta nada por duas horas e quarenta e na última meia hora ele pergunta uma coisa só:',
    '"Tá vivo?"',
    d=>c13_sabeQueVive(d) ? '"Tá."' : '"Eu não sei."',
    d=>c13_sabeQueVive(d) ? 'Ele assente.' : 'Ele assente do mesmo jeito.',
    'E aumenta o motor, que já estava no máximo, e não adianta nada, e ele aumenta mesmo assim.'
  ],
  ef:{flag:'voltou_buscar',
      executar:()=>{ Relogio.avancar(3); return []; },
      npc:{nome:'Sr. Dane', opiniao:6, memoria:'Voltou correndo com você e aumentou o motor que já estava no máximo.'},
      presagio:'Ele aumentou o motor que já estava no máximo. Todo mundo faz isso.'},
  escolhas:[
    {texto:'Ir direto na fábrica de gelo.', vai:'c13_camara_fria', cond:d=>!!d.flags.entrou_na_fabrica || !!d.flags.achou_o_filhote},
    {texto:'Ir ver a fábrica de gelo.', vai:'c13_fabrica', cond:d=>!d.flags.entrou_na_fabrica && !d.flags.achou_o_filhote && (!!d.flags.sabe_da_fabrica || !!d.flags.viu_a_fabrica)},
    {texto:'Buscar ele com a médica e voltar.', vai:'c13_travessia', cond:d=>!!d.flags.c13_com_a_medica,
     ef:{executar:()=>{ Estado.marcar('c13_com_a_medica', false); Estado.marcar('levou_o_filhote'); return []; }}},
    {texto:'Ir direto na casa do Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin},
    {texto:'Ir à colônia procurar por onde começar.', vai:'c13_colonia', cond:d=>!c13_sabeDoTobin(d) && !c13_sabeOnde(d)},
    {texto:'Ir ao cais e contar pra todo mundo.', vai:'c13_avisou_a_colonia', cond:d=>c13_temOQueContar(d) && !d.flags.avisou_a_colonia},
    {texto:'Chamar a Dra. Cordell.', vai:'c13_chamou_ivone', cond:d=>!!d.flags.cartao_ivone && !d.flags.ivone_veio && c13_podePegar(d)}
  ]
},

c13_buscar_ajuda:{
  texto:[
    'Você sai da caverna e volta a Fuchsia na mesma noite.',
    d=>{
      if (d.flags.cartao_ivone) return d.flags.ivone_veio
        ? 'A Dra. Cordell ainda está em Fuchsia, e em dois dias ela junta uma equipe de resgate de fauna marinha e equipamento de corte térmico emprestado de uma usina.'
        : 'A Dra. Cordell chega em dois dias com uma equipe de resgate de fauna marinha e equipamento de corte térmico emprestado de uma usina.';
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=5) return 'Você pede ajuda no cais e a sua reputação faz o trabalho sozinha: onze pessoas aparecem. Onze, num cais onde ninguém te devia nada.';
      return 'Você pede ajuda em Fuchsia e duas pessoas aparecem: o Sr. Dane e um médico de Pokémon aposentado que mora na rua do cais e que foi por curiosidade.';
    },
    'A operação leva um dia e meio.',
    d=>c13_sabeQueVive(d) || c13_sabeDoTobin(d)
       ? 'E a parte mais difícil não é técnica: é convencer um homem de cinquenta e oito anos a abrir a porta de uma câmara fria na frente de sete pessoas de Fuchsia.'
       : 'E a parte mais difícil é técnica: achar, num galpão da cidade, onde alguém escondeu uma coisa que ninguém sabia que existia.',
    'Quando acaba, tem gente chorando no gelo e ninguém se envergonha disso, e o Sr. Dane é o único que não chora e o único que não tira o olho do horizonte.'
  ],
  ef:{rep:{eixo:'bom',delta:5,motivo:'Mobilizou gente em vez de tentar sozinh{o|a}'},
      flag:['devolveu_o_filhote','mobilizou_gente'], instabilidade:-2, moral:20,
      executar:d=>{
        Relogio.viver(84); c13_viuArticuno(d);
        const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true;
        if(Estado.dados.mundo) Estado.dados.mundo.clima='normal';
        return [];
      },
      npc:{nome:'Sr. Dane', opiniao:8, memoria:'Participou do resgate e foi o único que não tirou o olho do horizonte.'},
      registrar:'Uma equipe devolveu o segundo Articuno. As Seafoam começaram a descongelar.',
      presagio:'Ele não tirou o olho do horizonte. Ele sabia o que ia vir.'},
  escolhas:[
    {texto:'Ver o gelo ceder.', vai:'c13_depois_salvou'},
    {texto:'Subir na rocha alta primeiro.', vai:'c13_rocha_alta', cond:d=>!!d.flags.sabe_da_onda},
    {texto:'Ficar e ver de perto.', vai:'c13_ficou_e_viu'}
  ]
},

/* ─────────────── A DEVOLUÇÃO ─────────────── */

c13_os_tres:{
  falante:'Tobin',
  vozes:['N'],
  texto:[
    'Vocês vão os três. Quatro, contando quem está na caixa.',
    d=>`O Articuno pequeno viaja num caixote de gelo forrado com a rede dobrada que era o ninho dele, com gelo picado por baixo, porque o Tobin descobriu em ${c13_mes(d, 3)} que ele fica mais calmo com frio.`,
    'Saem às cinco da manhã.',
    'O barco tem doze pés e agora tem quatro ocupantes e a borda livre é de vinte centímetros, e o Sr. Dane vai a meia força, e a travessia leva quase quatro horas, e nenhum dos dois velhos reclama de nada.',
    'O Tobin não fala nas primeiras três horas.',
    'Na última meia hora, quando a linha reta do gelo aparece no horizonte, ele fala uma frase só, pra ninguém:',
    '"Eu trouxe."',
    'Ele repete isso umas quatro vezes nos vinte minutos seguintes, baixinho, e não é pra você nem pro Sr. Dane.',
    'Ele está ensaiando.'
  ],
  ef:{flag:['foram_os_tres','levou_o_filhote','conheceu_ryuzo','conheceu_o_goro'],
      executar:()=>{ Estado.marcar('c13_com_a_medica', false); c13_atravessar(4); return []; },
      npc:{nome:'Tobin', opiniao:8, memoria:'Foi de barco devolver o Articuno e ensaiou "eu trouxe" a viagem inteira.'},
      rep:{eixo:'bom',delta:5,motivo:'Levou junto quem precisava estar lá'},
      moral:15,
      registrar:'Foram os três às Seafoam com o Articuno pequeno num caixote de gelo.',
      presagio:'Ele está ensaiando. Dezenove semanas ensaiando.'},
  escolhas:[
    {texto:'Entrar na caverna com ele.', vai:'c13_devolveu', ef:{flag:'c13_com_tobin_na_caverna'}},
    {texto:'Deixar o Tobin entrar sozinho.', vai:'c13_goro_sozinho'},
    {texto:'Entrar sozinh{o|a} e deixar os dois no barco.', vai:'c13_devolveu', ef:{flag:'c13_sozinho_na_caverna'}}
  ]
},

c13_comboio:{
  texto:[
    d=>d.flags.c13_pegou_pro_comboio === 'camara'
      ? 'Às quatro da manhã você tira o Articuno pequeno da câmara fria e põe num caixote de gelo picado. Ninguém na rua pergunta nada: a cidade inteira já sabe.'
      : d.flags.c13_pegou_pro_comboio === 'medica'
      ? 'Às quatro da manhã a médica de Cerulean te entrega o Articuno pequeno num caixote de gelo picado, e não deseja sorte, porque médica não deseja sorte.'
      : '',
    'Onze botes e o barco do Sr. Dane saem do cais de Fuchsia às quatro e quarenta da manhã.',
    'Ninguém combinou de sair junto. Todo mundo saiu junto.',
    'A travessia leva quatro horas em vez de três porque comboio anda na velocidade do mais lento, e ninguém reclama disso uma vez.',
    'Na borda do gelo, doze embarcações param em linha, e dá pra ver de longe que isso não é uma operação — é um cais inteiro que resolveu ir junto porque ninguém queria ser o que ficou.',
    d=>d.flags.goro_vai
      ? 'O Tobin vai no bote do meio, com o caixote nos joelhos, e ninguém olha pra ele com raiva, e ninguém olha pra ele com pena, e ele aguenta as duas coisas não acontecerem.'
      : 'Você vai no barco da frente com o caixote nos joelhos.',
    'Quatro homens sobem na rocha alta pra vigiar o mar, porque o Sr. Dane mandou.',
    'Sete ficam nos botes, de proa pro mar, porque o Sr. Dane mandou.',
    'E você desce no gelo da borda com doze embarcações olhando as suas costas.'
  ],
  ef:{flag:['foi_de_comboio','mobilizou_gente','conheceu_ryuzo'],
      executar:d=>{
        const f = d.flags;
        Estado.marcar('c13_pegou_pro_comboio', f.goro_vai || c13_comVoce(d) ? '' : f.c13_com_a_medica ? 'medica' : 'camara');
        Estado.marcar('levou_o_filhote'); Estado.marcar('c13_com_a_medica', false);
        c13_ate(4); Relogio.avancar(4);
        return [];
      },
      rep:{eixo:'bom',delta:6,motivo:'Levou a cidade inteira'},
      moral:20,
      registrar:'Onze botes e o barco do Sr. Dane foram juntos às Seafoam.',
      presagio:'Ninguém queria ser o que ficou. É assim que cidade pequena funciona nos dois sentidos.'},
  escolhas:[
    {texto:'Entrar com o Tobin.', vai:'c13_devolveu', cond:d=>!!d.flags.goro_vai, ef:{flag:'c13_com_tobin_na_caverna'}},
    {texto:'Deixar o Tobin entrar sozinho.', vai:'c13_goro_sozinho', cond:d=>!!d.flags.goro_vai},
    {texto:'Entrar sozinh{o|a} com o caixote.', vai:'c13_devolveu', cond:d=>!d.flags.goro_vai, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Entrar com dois pescadores pra ajudar a carregar.', vai:'c13_devolveu', ef:{flag:'c13_com_dois_na_caverna'}}
  ]
},

c13_goro_sozinho:{
  falante:'Tobin',
  vozes:['P','N','P'],
  texto:[
    '"Vai você."',
    'Ele olha pra você.',
    '"Sozinho?"',
    '"Sozinho."',
    d=>`Ele fica um tempo parado com o caixote nos braços, na borda do gelo, com setenta e quatro anos de Sr. Dane atrás dele no barco${d.flags.foi_de_comboio ? ', onze botes em linha' : ''} e você do lado.`,
    'E vai.',
    'Você vê ele andando os duzentos metros de gelo com um caixote de gelo nos braços, sozinho, sem lanterna, e ele anda devagar porque ele não quer sacudir.',
    'Some na boca da caverna.',
    'Demora quarenta e três minutos.',
    'E aí a ilha inteira range.',
    'Não estala: range. Um som baixo e comprido de coisa grande cedendo, e o gelo debaixo dos seus pés vibra, e o Sr. Dane engata a ré sem falar nada e afasta o barco quarenta metros.',
    'E o Tobin sai andando da boca da caverna com o caixote vazio nos braços, e ele está chorando de um jeito que gente de cinquenta e oito anos não chora em público, e ele não está tentando esconder.'
  ],
  ef:{flag:['goro_devolveu','devolveu_o_filhote'],
      npc:{nome:'Tobin', opiniao:10, memoria:'Atravessou duzentos metros de gelo sozinho com um caixote para devolver o que pegou.'},
      rep:{eixo:'bom',delta:8,motivo:'Deixou o homem devolver com as próprias mãos'},
      moral:30, instabilidade:-2,
      executar:d=>{ const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true; if(Estado.dados.mundo) Estado.dados.mundo.clima='normal';
        return [{tipo:'mundo', texto:'Articuno recebeu o segundo. O gelo começou a ceder.'}]; },
      registrar:'Tobin devolveu o Articuno com as próprias mãos, sozinho.'},
  escolhas:[
    {texto:'Ficar e ver o gelo ceder.', vai:'c13_depois_salvou', ef:{flag:'c13_ficou_fora'}},
    {texto:'Entrar na caverna pra ver.', vai:'c13_depois_salvou'},
    {texto:'Embarcar e ir embora rápido.', vai:'c13_depois_salvou', ef:{flag:'c13_ficou_fora'}},
    {texto:'Não dizer nada e esperar ele falar.', vai:'c13_depois_salvou', ef:{flag:'c13_ficou_fora'}}
  ]
},

c13_devolveu:{
  texto:[
    d=>{ const q = c13_comQuem(d);
      return q === 'tobin' ? 'Você e o Tobin atravessam os cento e setenta metros de caverna com o caixote, ele na frente, sem lanterna, porque ele não quer sacudir.'
           : q === 'dois' ? 'Você e dois pescadores do comboio atravessam os cento e setenta metros de caverna com o caixote, revezando nas alças.'
           : 'Você atravessa os cento e setenta metros de caverna com o caixote nos braços.'; },
    d=>`Na câmara do fundo, ${d.flags.c13_ja_tinha_visto ? 'Articuno está no pilar exatamente onde estava' : 'num pilar de gelo que subiu do chão como se tivesse crescido, está Articuno'}, e ele vê ${c13_comQuem(d) === 'sozinho' ? 'você' : 'vocês'} entrando de longe, e não se mexe.`,
    d=>c13_comQuem(d) === 'sozinho' ? 'Você para no meio da câmara.' : 'Vocês param no meio da câmara.',
    d=>c13_comQuem(d) === 'tobin'
      ? 'O Tobin põe o caixote no chão e abre e recua três passos e diz, alto, com a voz falhando no meio:'
      : 'Você põe o caixote no chão e abre e recua três passos.',
    d=>c13_comQuem(d) === 'tobin' ? fala('Tobin', 'Eu trouxe.') : '',
    'O Articuno pequeno leva um tempo pra sair, porque ele está com a asa enfaixada e não coordena bem.',
    'Ele sai. Anda dois metros pelo chão de gelo. E para.',
    'E chama.',
    'Um som fino, curto, duas vezes. Não é grito. É a coisa que filhote faz quando acha que talvez não reconheçam ele.',
    'E aí a câmara racha.',
    'Todas as colunas, ao mesmo tempo, do chão ao teto, num barulho que não cabe em nenhuma palavra.',
    d=>c13_comQuem(d) === 'sozinho' ? 'E você tem que correr.' : 'E vocês têm que correr.'
  ],
  ef:{flag:['devolveu_o_filhote'],
      rep:{eixo:'bom',delta:8,motivo:'Devolveu o que tinha sido tirado'},
      moral:30, instabilidade:-2,
      executar:d=>{
        Estado.marcar('c13_ja_tinha_visto', !!d.flags.achou_articuno);
        c13_viuArticuno(d);
        if (c13_comQuem(d) === 'tobin') Estado.marcar('goro_devolveu');
        const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true;
        if(Estado.dados.mundo) Estado.dados.mundo.clima='normal';
        return [{tipo:'mundo', texto:'O gelo das Seafoam começou a ceder. Dezenove semanas de mar vão voltar de uma vez.'}];
      },
      registrar:'Devolveu o Articuno pequeno. A caverna começou a ceder.'},
  escolhas:[
    {texto:'Correr para o barco.', vai:'c13_depois_salvou'},
    {texto:'Correr para a rocha alta, não pro barco.', vai:'c13_rocha_alta', cond:d=>!!d.flags.sabe_da_onda},
    {texto:'Ficar e ver.', vai:'c13_ficou_e_viu'},
    {texto:'Puxar os outros e correr.', vai:'c13_depois_salvou', cond:d=>c13_comQuem(d) !== 'sozinho'}
  ]
},

/* depois que a caverna caiu (a captura), a devolução é no mar, da borda do barco */
c13_devolveu_no_mar:{
  texto:[
    'Onde era a boca da caverna agora é mar. Articuno está pairando em cima do ponto, do jeito que ficou, e desce quando vê o barco chegando.',
    d=>d.flags.foram_os_tres || (d.flags.foi_de_comboio && d.flags.goro_vai)
      ? 'O Tobin abre o caixote na borda do barco, com as duas mãos, e não diz nada. Não precisa mais ensaiar.'
      : 'Você abre o caixote na borda do barco.',
    'O Articuno pequeno sai, olha pra cima e chama: um som fino, curto, duas vezes.',
    'O grande desce o resto do caminho e pega o pequeno com as garras, com um cuidado absurdo pro tamanho dele, e sobe.',
    'E o frio que segurava o mar em volta do barco solta. Você sente na mão, na borda, e o barco sobe um palmo sozinho.'
  ],
  ef:{flag:['devolveu_o_filhote','c13_ficou_fora','c13_ja_viu_sair'],
      rep:{eixo:'bom',delta:8,motivo:'Devolveu o que tinha sido tirado, mesmo depois do que fez'},
      moral:25, instabilidade:-2,
      executar:d=>{
        if (d.flags.foram_os_tres || (d.flags.foi_de_comboio && d.flags.goro_vai)) Estado.marcar('goro_devolveu');
        c13_viuArticuno(d);
        const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true;
        if(Estado.dados.mundo) Estado.dados.mundo.clima='normal';
        return [{tipo:'mundo', texto:'Articuno recebeu o segundo de volta, no mar. O gelo começou a ceder.'}];
      },
      registrar:'Devolveu o Articuno pequeno no mar, onde era a caverna.'},
  escolhas:[{texto:'Ficar olhando.', vai:'c13_depois_salvou'}]
},

c13_rocha_alta:{
  vozes:['P'],
  texto:[
    d=>d.flags.ryuzo_avisou ? '"ROCHA ALTA, NÃO ILHA!"' : '"PRA ROCHA! SOBE!"',
    d=>{ const v = c13_vocesNaRocha(d);
      return d.flags.ryuzo_avisou
        ? `Você grita a frase de um velho de setenta e quatro anos numa caverna desabando e ${v ? 'vocês sobem' : 'sobe'}.`
        : `O Sr. Dane falou de onda, e onda não sobe doze metros de pedra. Você grita e ${v ? 'vocês sobem' : 'sobe'}.`; },
    'Não pro barco: pra rocha.',
    d=>`A parede leste da ilha tem uma escarpa de dezenove metros e ${c13_vocesNaRocha(d) ? 'vocês sobem' : 'você sobe'} doze deles em quatro minutos, com as mãos, com gelo caindo do teto da caverna e água — água de verdade, escura, antiga — entrando por baixo.`,
    d=>c13_vocesNaRocha(d) ? 'A doze metros de altura, deitados na rocha, vocês veem.' : 'A doze metros de altura, deitad{o|a} na rocha, você vê.',
    'O gelo de duzentos quilômetros solta de uma vez.',
    'Não tem onda de cinema. Tem uma coisa pior e mais silenciosa: o mar inteiro sobe uns três metros de uma vez, todo ele, ao mesmo tempo, sem quebrar.',
    'Sobe, fica dois segundos, e desce.',
    'E quando desce, a água volta a circular, e o barulho que duzentos quilômetros de mar fazem ao voltar a circular é a coisa mais absurda que você já ouviu.',
    d=>d.flags.foi_de_comboio
      ? 'Os onze botes e o barco do Sr. Dane, que estavam de proa pro mar a quarenta metros, sobem três metros e descem três metros e continuam inteiros, porque ele mandou.'
      : 'O barco do Sr. Dane, que estava a quarenta metros, sobe três metros e desce três metros e continua inteiro, porque ele estava de proa pro mar.',
    'Porque ele sabia.'
  ],
  ef:{flag:['sobreviveu_a_onda'],
      rep:{eixo:'bom',delta:6,motivo:'Lembrou do que o velho falou'},
      moral:20, hp:-4, causa:'Escalada de doze metros em quatro minutos',
      npc:{nome:'Sr. Dane', opiniao:10, memoria:'Ficou de proa para o mar a quarenta metros e o barco do pai dele aguentou.'},
      registrar:'O mar subiu três metros de uma vez e desceu. Todos sobreviveram.',
      presagio:'Porque ele sabia. Setenta e quatro anos de saber.'},
  escolhas:[
    {texto:'Descer da rocha.', vai:'c13_depois_salvou', cond:d=>!d.flags.capturou_articuno},
    {texto:'Descer da rocha e ir pro barco.', vai:'c13_desceu_com_articuno', cond:d=>!!d.flags.capturou_articuno}
  ]
},

c13_ficou_e_viu:{
  texto:[
    'Você fica.',
    'É besteira. É besteira completa e você sabe enquanto faz.',
    'Mas você fica e vê os dois se encontrarem no meio de uma câmara desabando, e o grande desce do pilar e não voa — ele desce andando, e chega devagar, e encosta a cabeça na cabeça do pequeno e fica assim.',
    'Fica assim uns quatro segundos com o teto caindo em volta e sem se importar com o teto caindo em volta.',
    'Depois ele pega o pequeno com as garras, com um cuidado absurdo pro tamanho dele, e sobe pelo furo do teto.',
    'E você fica sozinh{o|a} numa caverna desabando com água até o joelho.',
    'E aí o teto abre de vez.',
    'E o que te salva é uma coisa que você não controla: a coluna de gelo que cai na sua direção bate numa outra e desvia dois metros, e dois metros é tudo.'
  ],
  ef:{flag:['ficou_e_viu','devolveu_o_filhote'],
      executar:()=>{ Estado.marcar('c13_ficou_sozinho'); return []; },
      hp:-14, causa:'Ficou na caverna quando ela caiu',
      rep:{eixo:'bom',delta:3,motivo:'Ficou para ver, o que foi besteira e foi humano'},
      moral:25, instabilidade:-1,
      registrar:'Ficou na câmara e viu os dois se encontrarem. Quase não saiu.',
      presagio:'Dois metros é tudo. Você não controlou nenhum dos dois.'},
  escolhas:[
    {texto:'Sair como der.', vai:'c13_depois_salvou'},
    {texto:'Subir pela rocha.', vai:'c13_rocha_alta', cond:d=>!!d.flags.sabe_da_onda},
    {texto:'Nadar até o barco.', vai:'c13_depois_salvou'},
    {texto:'Gritar pelo Sr. Dane.', vai:'c13_depois_salvou'}
  ]
},

c13_levou_pra_cerulean:{
  texto:[
    'Você leva o Articuno pequeno pra Cerulean.',
    'Doze horas de estrada numa van emprestada, com a caixa térmica no chão entre os bancos e gelo picado renovado em três paradas.',
    'A cirurgia é no dia seguinte. Dura cinco horas e quarenta. Refraturam o úmero em dois pontos e fixam com placa.',
    'Ele fica quatro semanas.',
    'E nas quatro semanas a água em Fuchsia continua baixando meio grau por semana, porque ninguém contou nada pra quem está segurando.',
    'Na quinta semana ele abre a asa.',
    'Não voa direito. Abre.',
    d=>d.flags.c13_dane_era_novo
      ? 'E aí você faz as doze horas de volta, e no cais de Fuchsia o único que topa ir é um velho de setenta e quatro anos com um barco de doze pés, que o cais chama de Amos e o livro da colônia de Dane.'
      : 'E aí você faz as doze horas de volta, e o Sr. Dane já está te esperando no cais, com o tanque cheio.',
    d=>`Três horas de barco, e quando você ${d.flags.c13_caverna_caiu ? 'chega com ele no ponto onde era a caverna' : 'entra na câmara do fundo das Seafoam com ele'}, você entrega uma coisa melhor do que a que saiu de lá — e cinco semanas mais tarde do que dava.`
  ],
  ef:{flag:['operou_o_filhote','devolveu_o_filhote'],
      rep:{eixo:'bom',delta:6,motivo:'Escolheu a asa em vez da pressa'},
      moral:20, instabilidade:1,
      executar:d=>{
        Estado.marcar('c13_dane_era_novo', !d.flags.conheceu_ryuzo); Estado.marcar('conheceu_ryuzo');
        Relogio.viver(35 * 24); c13_atravessar();
        c13_viuArticuno(d);
        const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true; if(Estado.dados.mundo) Estado.dados.mundo.clima='normal';
        return [{tipo:'mundo', texto:'Articuno recebeu o segundo de volta, com a asa operada, cinco semanas depois.'}];
      },
      registrar:'Levou o Articuno pequeno a Cerulean, operou a asa, e devolveu cinco semanas depois.',
      presagio:'Cinco semanas de gelo a mais, e uma asa que abre. Não existe resposta certa.'},
  escolhas:[
    {texto:'Ver o gelo ceder.', vai:'c13_depois_salvou'},
    {texto:'Subir na rocha antes.', vai:'c13_rocha_alta', cond:d=>!!d.flags.sabe_da_onda},
    {texto:'Sair rápido.', vai:'c13_depois_salvou'}
  ]
},

c13_depois_salvou:{
  falante:'Sr. Dane',
  vozes:['N','N'],
  texto:[
    d=>d.flags.c13_caverna_caiu ? 'O gelo em volta do barco vira água, e a água fica escura e começa a andar.'
      : d.flags.c13_ficou_fora ? 'O gelo da borda vira água debaixo dos seus pés. Água, não gelo.'
      : 'Você sai da caverna com água até o joelho — água, não gelo.',
    d=>`Ela está subindo dois centímetros por minuto e está a nove graus, o que depois de ${d.flags.operou_o_filhote ? 'vinte e quatro' : 'dezenove'} semanas de dois é quase morno.`,
    d=>d.flags.c13_ja_viu_sair ? 'Lá no alto, os dois ficam pequenos, e somem.'
      : d.flags.ficou_e_viu ? 'Lá fora eles ainda estão no alto: o grande dando voltas em cima da ilha, com o pequeno nas garras, porque o pequeno ainda não voa.'
      : 'O grande sai primeiro, pelo furo natural no teto da ilha, devagar, e dá duas voltas em cima dela antes de subir.',
    d=>d.flags.c13_ja_viu_sair || d.flags.ficou_e_viu ? '' : 'Uns dez minutos depois ele desce de novo pelo mesmo furo e sobe com o pequeno nas garras, porque o pequeno ainda não voa.',
    d=>!(d.flags.goro_devolveu || d.flags.foram_os_tres) ? ''
      : d.flags.c13_caverna_caiu ? 'O Tobin está sentado no fundo do barco, olhando pra cima, e não se mexe até eles sumirem.'
      : 'O Tobin está sentado no gelo que está virando água, com a bunda molhada, olhando pra cima, e não se mexe até eles sumirem.',
    'Sr. Dane está no barco, de pé, com uma mão na borda, olhando pra cima.',
    'Ele não diz nada por muito tempo.',
    'Depois: "Eu queria ver antes de morrer."',
    'Ele senta.',
    '"Agora eu não sei mais o que fazer com o resto."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Devolveu o inverno ao lugar dele'},
      moral:15,
      flag:'viu_os_dois_saindo',
      executar:d=>{ c13_viuArticuno(d); return []; },
      npc:{nome:'Sr. Dane', opiniao:8, memoria:'Viu os dois Articuno saírem pelo alto. "Agora eu não sei mais o que fazer com o resto."'},
      registrar:'Os dois Articuno saíram pelo alto. As Seafoam descongelaram.',
      presagio:'"Agora eu não sei mais o que fazer com o resto." Ele disse isso pro mar, não pra você.'},
  escolhas:[
    {texto:'"Então a gente arruma outra coisa pro senhor ver."', vai:'c13_outra_coisa'},
    {texto:'Não responder e deixar ele com isso.', vai:'c13_fim'},
    {texto:'Voltar a Fuchsia em silêncio.', vai:'c13_fim'}
  ]
},

c13_outra_coisa:{
  falante:'Sr. Dane',
  vozes:['P','N','P','N','P','N','P','N','N'],
  texto:[
    '"Então a gente arruma outra coisa pro senhor ver."',
    'Ele ri. É uma risada de velho, curta e com tosse no fim.',
    '"Que coisa?"',
    'Você aponta pro oeste. Lá longe, em cima da linha do mar, tem uma ilha, e em cima da ilha sobe uma fumaça fina, e mesmo daqui dá pra ver que ela é vermelha.',
    '"Aquele vulcão em Cinnabar. Ninguém sabe por que a fumaça é dessa cor."',
    'Ele para de rir.',
    '"Você tá me convidando pra ir num vulcão?"',
    '"Eu tô te dizendo que tem um."',
    'Ele fica olhando a fumaça um tempo longo demais pra ser educação.',
    '"Cinco horas de barco daqui."',
    '"É."',
    '"Eu tenho combustível pra três."',
    'Ele engata.',
    '"A gente para em Fuchsia, enche o tanque, e a gente vê."'
  ],
  ef:{flag:['ryuzo_vai_a_cinnabar','tem_barco_pra_cinnabar'],
      npc:{nome:'Sr. Dane', opiniao:10, memoria:'Topou levar você a Cinnabar depois de ver os dois Articuno saírem.'},
      rep:{eixo:'bom',delta:3,motivo:'Deu a um velho uma próxima coisa'},
      moral:20,
      registrar:'Sr. Dane vai te levar a Cinnabar.'},
  escolhas:[{texto:'Voltar a Fuchsia.', vai:'c13_fim'}]
},

/* ─────────────── O OUTRO CAMINHO ─────────────── */

c13_traicao_articuno:{
  texto:[
    'Ele está te mostrando o vazio na parede, pela terceira vez, devagar, como quem explica pra criança.',
    'E você joga a Pokébola.',
    'Não tem como suavizar isso.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(144); L.disposicao='hostil'; L.ataquesSofridos+=2; return []; },
      rep:{eixo:'ruim',delta:4,motivo:'Atacou um lendário no momento em que ele pediu ajuda'},
      moral:-25,
      flag:'traiu_articuno',
      registrar:'Jogou a Pokébola em Articuno enquanto ele pedia ajuda.',
      presagio:'Ele explicou três vezes, devagar. E você jogou a Pokébola.'},
  escolhas:[{texto:'Encarar o que vem.', vai:'c13_luta_articuno'}]
},

c13_luta_articuno:{
  texto:[
    'A câmara inteira baixa dez graus de uma vez e o ar fica com aquela densidade que faz doer respirar.',
    'As colunas de gelo começam a rachar no teto — não as dele, as antigas, as de séculos.',
    'Ele está gastando o que ele estava guardando.'
  ],
  batalha:{dex:144, nivel:52, tipo:'lendario', fuga:true, ambiente:'agua',
           vitoria:'c13_pos_articuno', derrota:'c13_pos_articuno', fuga2:'c13_saiu_articuno',
           captura:'c13_capturou_articuno', gameover:'gameover'}
},

c13_pos_articuno:{
  texto:[
    'Ele volta pro pilar.',
    'Não porque venceu ou perdeu.',
    'Porque o lugar dele é ali, e ele tem uma coisa pra fazer, e você foi uma interrupção de vinte minutos numa vigília de dezenove semanas.',
    'O gelo que rachou durante a luta volta a fechar em quatro minutos, camada por camada, e ele faz isso sem parecer estar fazendo esforço, e é aí que você entende que ele nunca lutou com força total.',
    'Ele não pode.',
    'Ele está usando tudo o que tem pra segurar duzentos quilômetros de mar, e o que sobrou pra você foi o troco.'
  ],
  ef:{executar:d=>{
        const L=Estado.lend(144); L.ataquesSofridos++;
        if (L.ataquesSofridos>=2){ L.disposicao='hostil'; return [{tipo:'perigo', texto:'Articuno te marcou. O frio vai te seguir.'}]; }
        return [];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou Articuno nas Seafoam'}, instabilidade:1,
      presagio:'O que sobrou pra você foi o troco. Pensa no que seria o resto.'},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c13_luta_articuno'},
    {texto:'Parar e olhar em volta.', vai:'c13_observar_articuno', cond:c13_nova('c13_observar_articuno')},
    {texto:'Parar e perguntar.', vai:'c13_perguntou_articuno', cond:c13_nova('c13_perguntou_articuno')},
    {texto:'Sair.', vai:'c13_saiu_articuno'}
  ]
},

c13_capturou_articuno:{
  texto:[
    'A Pokébola fecha.',
    'E o gelo — o gelo que ele estava segurando, camada por camada, há dezenove semanas — começa a ceder no mesmo segundo, porque não tem mais ninguém segurando.',
    'A câmara racha inteira em menos de quatro segundos.',
    'Colunas de séculos caem. A água volta com força de maré represada por dezenove semanas, por baixo, pelos lados, por cima.',
    'E do outro lado da câmara, na parede que está se partindo, tem um vazio escavado, do formato de um Articuno pequeno, com um forro de algas secas e penas azuis arrumado no fundo.',
    d=>c13_jaViuOVazio(d) ? 'Você já tinha visto. Agora você vê a parede cair em cima dele.' : 'Você só vê durante um segundo e meio, quando a parede cede.',
    d=>c13_jaViuOVazio(d) ? 'E o ninho vazio some debaixo da água.' : 'E você não entende o que era.',
    d=>c13_jaViuOVazio(d) ? 'E quem ia dormir nela não está aqui pra ver.' : 'E a única pessoa que podia te explicar está na sua mão.'
  ],
  ef:{instabilidade:3, flag:['capturou_articuno','c13_caverna_caiu'],
      rep:{eixo:'ruim',delta:3,motivo:'Capturou o guardião e a caverna cedeu'},
      moral:-20,
      registrar:'Capturou Articuno. A caverna cedeu e o mar voltou de uma vez.',
      presagio:'O mar voltou de uma vez. Ninguém estava segurando mais nada.'},
  escolhas:[
    {texto:'Soltar. Agora.', vai:'c13_soltou_articuno'},
    {texto:'Correr para a saída.', vai:'c13_correu_da_agua'},
    {texto:'Mergulhar atrás do que você viu na parede.', vai:'c13_mergulhou'},
    {texto:'Subir na rocha alta.', vai:'c13_rocha_alta', cond:d=>!!d.flags.sabe_da_onda}
  ]
},

c13_soltou_articuno:{
  texto:[
    'Você abre a Pokébola numa câmara que está caindo, com água até a canela.',
    'Ele sai e não te ataca.',
    'Ele olha em volta — pra água que já está subindo, pras colunas caídas, pro vazio da parede que está se partindo — e faz uma coisa que você não previu:',
    'ele volta pro pilar e recomeça.',
    'O gelo volta a fechar, camada por camada, e leva quarenta minutos pra voltar ao que era, e ele faz os quarenta minutos com você ali parad{o|a} olhando.',
    'No fim, tudo está exatamente como estava quando você chegou.',
    'Exatamente como estava.',
    'Dezenove camadas. Um vazio na parede. Um pilar. Uma vigília.',
    'Ele te custou quarenta minutos e você custou a ele quarenta minutos, e é essa a conta inteira.'
  ],
  ef:{flag:'soltou_articuno', limpaFlag:['capturou_articuno','c13_caverna_caiu'],
      executar:d=>{
        const p=[...d.time,...d.pc].find(x=>x.dex===144);
        return p ? Captura.soltar(p).map(e=>({tipo:e.tipo,texto:e.texto})) : [];
      },
      rep:{eixo:'bom',delta:3,motivo:'Soltou o guardião antes de sair do lugar'},
      moral:10, instabilidade:-1,
      registrar:'Soltou Articuno. Ele recomeçou o gelo do zero em quarenta minutos.'},
  escolhas:[
    {texto:'Perguntar o que aconteceu.', vai:'c13_perguntou_articuno', cond:c13_nova('c13_perguntou_articuno')},
    {texto:'Ir até o vazio da parede.', vai:'c13_o_vazio', cond:c13_nova('c13_o_vazio')},
    {texto:'Ir buscar o caixote no barco.', vai:'c13_devolveu', cond:c13_comVoce, ef:{flag:'c13_sozinho_na_caverna'}},
    {texto:'Sair e ir buscar o pequeno.', vai:'c13_voltar_buscar', cond:d=>(c13_sabeQueVive(d) || c13_sabeDoTobin(d)) && !c13_comVoce(d)},
    {texto:'Sair.', vai:'c13_saiu_articuno'}
  ]
},

c13_mergulhou:{
  falante:'Sr. Dane',
  vozes:['N','N'],
  texto:[
    'Você mergulha em água de dois graus dentro de uma caverna desabando.',
    'Dois graus tira o seu ar em quatro segundos — não pelo frio, pelo reflexo: o corpo inspira sozinho quando bate água muito fria no peito, e você tem que lutar contra o próprio corpo pra não respirar embaixo d’água.',
    'Você não acha nada.',
    'Você quase não volta.',
    'Sr. Dane te tira da água na entrada da caverna, sozinho, com setenta e quatro anos, puxando pela alça da mochila e xingando.',
    '"Besteira", ele diz, enrolando você num cobertor de flanela. "Besteira bonita, mas besteira."',
    'E depois, mais baixo, com você tremendo no fundo do barco:',
    '"Meu filho também fez uma besteira bonita."'
  ],
  ef:{hp:-14, causa:'Mergulho em água de dois graus nas Seafoam',
      rep:{eixo:'bom',delta:1,motivo:'Arriscou a própria vida tentando consertar o próprio erro'},
      flag:'mergulhou_nas_espuma',
      moral:-10,
      npc:{nome:'Sr. Dane', opiniao:5, memoria:'Te tirou da água gelada sozinho, aos setenta e quatro anos, e falou do filho.'},
      registrar:'Mergulhou na água de dois graus. Sr. Dane te tirou.',
      presagio:'"Meu filho também fez uma besteira bonita." Ele nunca tinha dito isso pra ninguém.'},
  escolhas:[
    {texto:'Soltar ele dali mesmo, do barco.', vai:'c13_soltou_do_barco', cond:d=>!!d.flags.capturou_articuno},
    {texto:'Voltar para Fuchsia.', vai:'c13_fim'},
    {texto:'Voltar amanhã e procurar direito.', vai:'c13_travessia', ef:C13_VOLTA},
    {texto:'Não dizer nada a viagem inteira.', vai:'c13_fim'}
  ]
},

c13_correu_da_agua:{
  texto:[
    'Você corre.',
    'Cento e setenta metros de caverna desabando com uma Pokébola no bolso e água subindo dez centímetros por minuto.',
    'Você chega no barco. Sr. Dane arranca antes de você sentar direito.',
    'De cinquenta metros vocês veem a entrada da caverna sumir — não desabar: sumir, porque o mar sobe e tampa.',
    'E aí o mar sobe.',
    'Três metros, todo ele, ao mesmo tempo, sem quebrar.',
    'O barco de doze pés sobe três metros e desce três metros e continua inteiro porque o Sr. Dane virou a proa sem você mandar.',
    'Ele não pergunta o que tem no seu bolso.',
    'Ele vê o seu rosto e decide não perguntar, e esse é um tipo específico de gentileza que você não merece hoje.'
  ],
  ef:{flag:'saiu_com_articuno',
      hp:-4, causa:'Fuga da caverna desabando',
      npc:{nome:'Sr. Dane', opiniao:2, memoria:'Não perguntou o que você tinha no bolso.'},
      moral:-15,
      registrar:'Saiu das Seafoam com Articuno na Pokébola. O mar subiu três metros.',
      presagio:'Ele decidiu não perguntar. Isso não é o mesmo que não saber.'},
  escolhas:[
    {texto:'Soltar ali mesmo, do barco.', vai:'c13_soltou_do_barco'},
    {texto:'Voltar a Fuchsia com ele.', vai:'c13_fim'},
    {texto:'Contar pro Sr. Dane o que você fez.', vai:'c13_contou_pro_ryuzo_o_que_fez'},
    {texto:'Não dizer nada a viagem inteira.', vai:'c13_fim'}
  ]
},

c13_desceu_com_articuno:{
  texto:[
    'Você desce da rocha quando a água para de subir, com a Pokébola no bolso, e anda até a borda pelo que agora é água até o joelho.',
    'O Sr. Dane encosta o barco e te puxa pra dentro sem falar nada.',
    'Ele não pergunta o que tem no seu bolso.',
    'Ele vê o seu rosto e decide não perguntar, e esse é um tipo específico de gentileza que você não merece hoje.'
  ],
  ef:{flag:'saiu_com_articuno',
      npc:{nome:'Sr. Dane', opiniao:2, memoria:'Não perguntou o que você tinha no bolso.'},
      moral:-15,
      registrar:'Saiu das Seafoam com Articuno na Pokébola. O mar subiu três metros.',
      presagio:'Ele decidiu não perguntar. Isso não é o mesmo que não saber.'},
  escolhas:[
    {texto:'Soltar ali mesmo, do barco.', vai:'c13_soltou_do_barco'},
    {texto:'Voltar a Fuchsia com ele.', vai:'c13_fim'},
    {texto:'Contar pro Sr. Dane o que você fez.', vai:'c13_contou_pro_ryuzo_o_que_fez'},
    {texto:'Não dizer nada a viagem inteira.', vai:'c13_fim'}
  ]
},

c13_soltou_do_barco:{
  falante:'Sr. Dane',
  vozes:['N','P','N'],
  texto:[
    'Você abre a Pokébola apontando pro mar, de dentro de um barco de doze pés, a cinquenta metros de uma caverna que acabou de sumir.',
    'Ele sai e fica na água por uns quatro segundos, em cima da própria imagem, e olha o lugar onde a entrada da caverna estava.',
    'Depois sobe.',
    'Não voa embora: sobe reto, uns quarenta metros, e fica pairando em cima do ponto.',
    'E o mar em volta de vocês começa a esfriar de novo.',
    'Ele vai recomeçar. Sozinho. Do zero. Com o vazio da parede agora debaixo de duzentos metros de rocha e água.',
    'Sr. Dane olha pra cima e depois olha pra você.',
    '"Ele vai fazer tudo de novo?"',
    '"Vai."',
    'O velho liga o motor.',
    '"Então a gente tem trabalho."'
  ],
  ef:{flag:'soltou_articuno', limpaFlag:'capturou_articuno',
      executar:d=>{
        const p=[...d.time,...d.pc].find(x=>x.dex===144);
        return p ? Captura.soltar(p).map(e=>({tipo:e.tipo,texto:e.texto})) : [];
      },
      rep:{eixo:'bom',delta:3,motivo:'Soltou antes de chegar em terra'},
      npc:{nome:'Sr. Dane', opiniao:6, memoria:'Disse "então a gente tem trabalho" depois que você soltou Articuno de volta no mar.'},
      moral:10,
      registrar:'Soltou Articuno do barco. Ele voltou a esfriar o mar.',
      presagio:'"Então a gente tem trabalho." Ele falou no plural.'},
  escolhas:[
    {texto:'Abrir o caixote ali mesmo.', vai:'c13_devolveu', cond:c13_comVoce},
    {texto:'Voltar e procurar o Tobin.', vai:'c13_goro', cond:c13_sabeDoTobin, ef:C13_VOLTA},
    {texto:'Voltar e procurar na fábrica de gelo.', vai:'c13_fabrica', cond:d=>!!d.flags.sabe_da_fabrica || !!d.flags.viu_a_fabrica, ef:C13_VOLTA},
    {texto:'Voltar e contar no cais.', vai:'c13_avisou_a_colonia', cond:d=>c13_temOQueContar(d) && !d.flags.avisou_a_colonia, ef:C13_VOLTA},
    {texto:'Voltar pra Fuchsia e desistir.', vai:'c13_fim'}
  ]
},

c13_contou_pro_ryuzo_o_que_fez:{
  falante:'Sr. Dane',
  vozes:['N','N','N','P','N','N'],
  texto:[
    'Você conta.',
    d=>c13_jaViuOVazio(d)
      ? 'Que tinha um segundo, menor, e um ninho escavado na parede, e que você jogou a Pokébola, e que a caverna caiu por isso.'
      : 'Que tinha um vazio escavado na parede, do tamanho de um Articuno pequeno, e que você jogou a Pokébola, e que a caverna caiu por isso.',
    'Ele ouve inteiro com a mão no cabo do leme e o olho no horizonte.',
    'E no fim ele fala uma coisa que você não estava preparad{o|a} pra ouvir:',
    '"Meu filho tinha vinte e seis anos e morreu porque eu levei ele pro mar numa quarta-feira de novembro com vento de sudeste."',
    'Ele corrige o rumo.',
    d=>`"Eu penso nisso todo dia faz ${c13_anosDoFilho(d)}. Todo dia, {meu filho|minha filha}, sem falta."`,
    d=>`"E o que eu aprendi em ${c13_anosDoFilho(d)} é que não adianta nada."`,
    '"Não adianta nada?"',
    '"Pensar não adianta nada. Devolver adianta."',
    'Ele olha pra você pela primeira vez desde que você começou a falar.',
    '"Eu não tenho o que devolver. Você tem."'
  ],
  ef:{flag:['ryuzo_te_disse'],
      npc:{nome:'Sr. Dane', opiniao:8, memoria:'Te disse que pensar não adianta nada e devolver adianta, e que ele não tem o que devolver.'},
      rep:{eixo:'bom',delta:3,motivo:'Contou o que fez a quem ia responder com a verdade'},
      moral:10,
      registrar:'"Pensar não adianta nada. Devolver adianta. Eu não tenho o que devolver. Você tem."',
      presagio:d=>`Ele levou ${c13_anosDoFilho(d)} pra chegar nessa frase.`},
  escolhas:[
    {texto:'Soltar ali mesmo, do barco.', vai:'c13_soltou_do_barco', cond:d=>!!d.flags.capturou_articuno},
    {texto:'Voltar a Fuchsia e pensar.', vai:'c13_fim'},
    {texto:'Voltar e procurar o Tobin.', vai:'c13_goro', cond:d=>c13_sabeDoTobin(d) && !d.flags.capturou_articuno, ef:C13_VOLTA}
  ]
},

c13_saiu_articuno:{
  texto:[
    'Você sai da câmara e refaz os cento e setenta metros de volta.',
    'Na saída, o ar de fora parece quente, o que é absurdo, porque está fazendo dois graus e ventando.',
    d=>d.flags.viu_a_cama || d.flags.sabe_do_segundo
       ? 'Você sabe o que tem lá dentro. Você sabe exatamente o que tem lá dentro — um ninho de algas nunca usado e uma marca de garra gasta na beirada — e está indo embora.'
       : 'Você não sabe o que viu. Sabe que viu, e que era grande, e que estava esperando alguma coisa.',
    'Sr. Dane não pergunta nada.',
    'Ele te vê chegando, olha a sua cara, e começa a soltar a amarra sem falar.'
  ],
  ef:{flag:'saiu_das_espuma', moral:-10},
  escolhas:[
    {texto:'Voltar pra Fuchsia.', vai:'c13_de_volta_ao_cais', ef:C13_VOLTA},
    {texto:'Mudar de ideia e voltar.', vai:'c13_fundo'},
    {texto:'Voltar e procurar o Tobin em Fuchsia.', vai:'c13_goro', cond:c13_sabeDoTobin, ef:C13_VOLTA},
    {texto:'Voltar e contar no cais.', vai:'c13_avisou_a_colonia', cond:d=>c13_temOQueContar(d) && !d.flags.avisou_a_colonia, ef:C13_VOLTA},
    {texto:'Ir embora de Fuchsia.', vai:'c13_fim'}
  ]
},

c13_fim:{
  texto:[
    d=>{
      if (d.flags.devolveu_o_filhote) return 'O gelo leva onze dias pra sumir inteiro, e some de trás pra frente, e o último pedaço a derreter é o que estava mais perto da costa de Fuchsia.';
      if (d.flags.capturou_articuno) return d.flags.avisou_o_cais
        ? 'O gelo some em quatro dias, de uma vez, porque ninguém está mais segurando, e o mar volta com uma força que ia arrebentar barco amarrado no cais. Não tem barco amarrado: o Sr. Dane mandou puxar tudo pra terra.'
        : 'O gelo some em quatro dias, de uma vez, porque ninguém está mais segurando — e o mar volta com uma força que arrebenta seis barcos amarrados no cais de Fuchsia numa madrugada.';
      if (d.flags.soltou_articuno) return 'O gelo continua. Você viu ele recomeçar do zero e sabe exatamente quantas camadas vão ter daqui a uma semana.';
      return `O gelo continua onde estava, avançando meio grau por semana, e Fuchsia continua com trinta e nove barcos ${d.flags.avisou_o_cais ? 'em terra' : 'amarrados'}.`;
    },
    d=>{
      if (d.flags.devolveu_o_filhote && d.flags.avisou_a_colonia) return `Na primeira madrugada sem gelo, trinta e nove barcos saem do cais de Fuchsia ao mesmo tempo, às quatro da manhã, e o barulho de trinta e nove motores de popa ligando junto é uma coisa que a cidade não ouvia desde ${c13_queda(d).mes}.`;
      if (d.flags.devolveu_o_filhote) return `Na semana seguinte a pesca volta. Ninguém liga uma coisa à outra — ninguém sabe. Só você, o Sr. Dane, ${c13_sabeDoTobin(d) ? 'o Tobin' : 'um homem que levava baldes a uma câmara fria'} e dois Articuno.`;
      if (d.flags.capturou_articuno) return `A colônia contrata ${d.flags.sabe_do_oceanografo ? 'outro oceanógrafo' : 'um oceanógrafo de Cerulean'} pra explicar o descongelamento súbito. Ele cobra doze mil e escreve "origem indeterminada".`;
      return 'Trezentas e onze famílias continuam sem renda, e o auxílio do defeso continua não cobrindo, porque isso não é defeso.';
    },
    d=>c13_tobinNoCais(d)
      ? `E o Tobin volta pro cais e conta, na mesa de dominó, pra sessenta pessoas, o que ele fez em ${c13_ext(c13_vespera(d))}. Leva quatro minutos. Ninguém bate nele, ninguém abraça ele, e no fim o magro de boné fala:`
      : d.flags.devolveu_o_filhote && c13_sabeDoTobin(d) ? 'O Tobin não aparece no cais. Mas a luz da câmara fria, na fábrica de gelo, fica apagada desde aquela manhã.'
      : !d.flags.devolveu_o_filhote && c13_sabeDoTobin(d) ? 'E o Tobin continua levando dois baldes três vezes por semana pra câmara fria, ou não continua. Daqui não dá pra saber.'
      : '',
    d=>c13_tobinNoCais(d) ? fala('o magro de boné', 'Então vamo pescar.') : '',
    d=>c13_tobinNoCais(d) ? 'E é isso.' : '',
    'Do cais de Fuchsia, Cinnabar é visível num dia limpo.',
    'Hoje está limpo.',
    d=>d.flags.ryuzo_vai_a_cinnabar ? 'A fumaça continua lá, vermelha, e no fim do cais o Sr. Dane está enchendo o tanque do Staryu.' : 'O vulcão está soltando fumaça.',
    d=>d.flags.ryuzo_vai_a_cinnabar ? '' : 'Vermelha.'
  ],
  ef:{executar:d=>{
        /* o capítulo fecha quando o gelo decide: onze dias pra sumir com
           o pequeno de volta, quatro se ninguém segura mais nada */
        const dias = d.flags.devolveu_o_filhote ? 11 : d.flags.capturou_articuno ? 4 : 0;
        if (dias) Relogio.viver(dias * 24);
        return [];
      }},
  fim:true, resumo:'Capítulo 13 concluído — o inverno tinha um motivo, e o motivo tinha nome e endereço.'

}

}}

);

/* Ir a um lugar não se gasta: as opções que levam ao cais, à colônia, à
   casa do Tobin, ao barco do Sr. Dane, à fábrica e às ilhas continuam na
   tela depois de usadas — quem chega de novo cai no reencontro (desvios). */
(function(){
  const cap = CAPITULOS.find(c => c.num === 13);
  const LUGARES = ['c13_cais', 'c13_colonia', 'c13_goro', 'c13_ryuzo', 'c13_procurar_barco', 'c13_fabrica',
                   'c13_camara_fria', 'c13_travessia', 'c13_ilha', 'c13_fundo', 'c13_de_volta_ao_cais'];
  for (const cena of Object.values(cap.cenas))
    for (const e of (cena.escolhas || []))
      if (LUGARES.includes(e.vai) && e.repetivel === undefined) e.repetivel = true;
})();
