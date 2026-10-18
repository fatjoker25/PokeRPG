/* ------------------------------------------------------------
   ABERTURAS — a sala 704 é uma sala de reunião comum num prédio
   comum, e é por isso que o capítulo é o que é. Dá pra chegar
   nela pela banca de jornal, pelo elevador, pela farmácia do
   térreo ou pela porta, direto.
   ------------------------------------------------------------ */
const C20_ABERTURAS = ['c20_predio', 'c20_ab_a_banca', 'c20_ab_o_elevador', 'c20_ab_a_farmacia'];
function c20_cabe(id, d){ return true; }
function c20_abertura(d){
  const cand = C20_ABERTURAS.filter(id => c20_cabe(id, d));
  const id = Dados.escolher(cand);
  if (d && d.relogio && d.flags && d.flags.c20_chegada == null){
    /* a banca, o elevador e a farmácia são de antes da reunião; a
       porta da sala, da hora dela */
    c20_naSegunda(id === 'c20_predio' ? 10 : 9);
    d.flags.c20_chegada = d.relogio.dia;
    c20_quemJaTeViu(d);
  }
  return id;
}

/* ------------------------------------------------------------
   O TEMPO DA SALA 704. O conselho se reúne segunda sim, segunda
   não, das dez às onze e quarenta. Quem chega numa segunda depois
   das dez espera a próxima. Quem sai no meio da sessão (pra
   Celadon, pro galpão, pra uma mesa sem presidente) volta na
   sessão seguinte, duas semanas depois.
   ------------------------------------------------------------ */
/* a segunda da reunião, às h: hoje, se ainda é segunda antes das dez */
function c20_naSegunda(h){
  const r = Estado.dados.relogio; sincronizarHora(r);
  if (Calendario.hoje().semanaIdx === 0 && r.hora < 10){
    if (r.hora < h) Relogio.avancar(h - r.hora);
    return;
  }
  Relogio.ateODia(0, h, true);
}
/* mais tarde no mesmo dia: o relógio só anda pra frente */
function c20_ateAs(h){
  const r = Estado.dados.relogio; sincronizarHora(r);
  if (r.hora < h) Relogio.avancar(h - r.hora);
}
/* a sessão seguinte: duas segundas depois, às dez */
function c20_proximaSessao(){
  Relogio.ateODia(0, 10, true);
  Relogio.ateODia(0, 10, true);
}

/* ------------------------------------------------------------
   O QUE VOCÊ JÁ SABIA. A sala 704 junta fio do 9, do 18 e do 19;
   o texto só usa o que o jogador viu ou ouviu.
   ------------------------------------------------------------ */
function c20_eu(t){ return d => fala(d.jogador.nome, t); }
function c20_cena(d, cap, id){ return !!(d.cenasAplicadas && d.cenasAplicadas[cap + ':' + id]); }
function c20_maiuscula(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
/* o Art. 27: o lojista de Celadon (9), a Auditora Brill (19) ou o estatuto */
function c20_sabeDoArt27(d){ const f = d.flags; return !!(f.art_27 || f.convite_conselho || f.tem_o_estatuto); }
function c20_leuAsAtas(d){ const f = d.flags; return !!(f.tem_as_atas || f.leu_as_atas); }
/* a Fase II: as atas, o Dr. Hollis, o voluntário do refeitório ou a porta da sala */
function c20_sabeDaFase2(d){
  const f = d.flags;
  return !!(f.sabe_da_fase2 || f.ouviu_do_corredor || c20_cena(d, 19, 'c19_esperou_ele_falar'));
}
function c20_fase2(d){ return c20_sabeDaFase2(d) ? 'a Fase II' : 'a próxima liberação'; }
function c20_galpao(d){ return d.flags.viu_o_galpao4 ? 'galpão 4' : 'galpão do fundo'; }
/* a planilha do galpão 4: na mão, em foto, ou só o galpão em foto */
function c20_temAPlanilha(d){ return c19_temPrancheta() || !!(d.flags.provas_do_galpao4 && d.flags.leu_a_prancheta); }
/* quem você já tinha visto em pessoa antes de subir. Guardado na
   chegada, porque o próprio capítulo vai registrando essas pessoas. */
function c20_quemJaTeViu(d){
  const f = d.flags;
  d.flags.c20_conhecia_a_presidente = !!((d.npcs && d.npcs['Hester Colman']) || f.entrou_na_704_cedo);
  d.flags.c20_conhecia_o_fabre = !!(f.conheceu_adnan || c18_viuFabreNoAnne(d) || c18_perito());
  /* quem já te conhece não te cumprimenta de novo no meio de uma
     reunião: o reconhecimento deles está escrito à mão nas cenas */
  d.reencontros = d.reencontros || {};
  if (f.c20_conhecia_a_presidente) d.reencontros['Hester Colman'] = {cap:d.capitulo, cena:'c20'};
  if (f.c20_conhecia_o_fabre) d.reencontros['Curador Fabre'] = {cap:d.capitulo, cena:'c20'};
}

/* ------------------------------------------------------------
   A MESA. Treze cadeiras: a Presidente, nove conselheiros, a
   observadora da Liga, a cadeira vazia da Dra. Yarrow e a de
   representação externa (a do desfecho, em desfechos.js). O Dr.
   Hollis fica na parede, sem voto, e a secretária numa mesinha
   do lado da cabeceira. Cada um tem uma plaquinha de papel com
   nome e função (c20_mesa); antes de ler as plaquinhas, a pessoa
   é o que se vê dela.
   ------------------------------------------------------------ */
const C20_DA_MESA = {
  'o médico do conselho':    ['o médico', 'o homem magro de manga curta'],
  'a advogada do conselho':  ['a advogada', 'a mulher de óculos da ponta da mesa'],
  'o contador do conselho':  ['o contador', 'o homem da calculadora'],
  'o professor do conselho': ['o Sr. Dahl', 'o senhor da bengala'],
  'a conselheira da Liga':   ['a conselheira da Liga', 'a mulher do broche da Liga'],
  'a secretária da mesa':    ['a Sra. Hedda', 'a secretária']
};
function c20_quem(rot, maiuscula){
  const par = C20_DA_MESA[rot];
  const s = Nomes.sabe(rot) ? par[0] : par[1];
  return maiuscula ? c20_maiuscula(s) : s;
}
function c20_hedda(maiuscula){ return c20_quem('a secretária da mesa', maiuscula); }
/* "à Sra. Hedda", "do médico", "pelo homem de barba" */
function c20_contrai(prep, s){
  const m = /^(o|a) /.exec(s);
  if (!m) return prep + ' ' + s;
  const T = {a:{o:'ao', a:'à'}, de:{o:'do', a:'da'}, em:{o:'no', a:'na'}, por:{o:'pelo', a:'pela'}};
  return (T[prep] ? T[prep][m[1]] : prep + ' ' + m[1]) + ' ' + s.slice(2);
}
/* o Curador Fabre: o nome, se você sabe; o navio, se foi lá que você o viu */
function c20_fabre(d, maiuscula){
  const s = c18_sabeNomeFabre(d) ? 'o Curador Fabre' : c18_viuFabreNoAnne(d) ? 'o homem de sapato limpo' : 'o homem de barba';
  return maiuscula ? c20_maiuscula(s) : s;
}
/* daqui em diante você sabe o nome dele: os rótulos de antes (o navio, a
   barba da 704) também passam a mostrar o nome no balão */
function c20_sabeOFabre(){
  Estado.marcar('conhece_o_nome_adnan');
  Nomes.apresentar('o homem de barba');
  Nomes.apresentar('o homem de sapato limpo');
}
function c20_hollis(d, maiuscula){
  const s = (d.flags.conheceu_sena || d.flags.c20_hollis_apresentado) ? 'o Dr. Hollis' : 'o homem de jaleco';
  return maiuscula ? c20_maiuscula(s) : s;
}
/* a cadeira da Dra. Yarrow só volta a ter gente na sessão seguinte */
function c20_yarrowNaMesa(d){ return !!(d.flags.alcina_volta && Historia.jaAconteceu('c20_a_proxima_sessao')); }

/* ------------------------------------------------------------
   A VOTAÇÃO. Votam os nove conselheiros (dez com a Dra. Yarrow de
   volta, onze se você aceitou a cadeira) e a Presidente, por
   último. Empate é dela: o voto de qualidade. O que pesa está em
   c20_contarVotos; a matéria muda pouco (a visita não custa nada a
   ninguém, o edital custa o conselho).
   ------------------------------------------------------------ */
function c20_contarVotos(d){
  const f = d.flags, razoes = [];
  const mat = f.c20_materia || 'art19';
  let conselheiros = 9, favor = 1, presidente = 0;
  razoes.push(c18_sabeNomeFabre(d) && !f.c20_fabre_anonimo
    ? 'O Curador Fabre vota a favor. Primeiro, alto, sem esperar a vez.'
    : `${c20_fabre(d, true)} vota a favor primeiro, alto, sem esperar a vez, e é assim que você ouve o nome dele: Curador Fabre.`);
  if (f.provas_do_galpao4){ favor += 2; razoes.push('Duas conselheiras que viram o material do galpão 4 votam a favor, e uma delas não consegue terminar a frase.'); }
  if (f.provas_do_viveiro || f.provas_do_11){ favor += 1; razoes.push('Uma conselheira que passou a sessão inteira olhando o que você trouxe vota a favor.'); }
  if (f.desarmou_presidente || f.defendeu_reforma){ favor += 1; razoes.push('Uma conselheira diz, antes de votar, que a sua proposta é a primeira que não é um discurso.'); }
  /* cada fala da tribuna convence alguém na mesa */
  if (f.falou_do_rattata){ favor += 1; razoes.push(`${f.viu_a_mesa_inteira ? 'A bióloga' : 'A conselheira'} que anotou durante a sua fala sobre o Rattata vota a favor.`); }
  if (f.falou_das_pessoas){ favor += 1; razoes.push('Uma conselheira vota a favor e pede que conste em ata o que você disse sobre a equipe.'); }
  if (f.leu_o_art19_no_conselho && mat === 'art19' && !f.quatro_foram){ favor += 1; razoes.push(`${c20_quem('a advogada do conselho', true)}, que redigiu o Art. 19, vota pela revogação dele e pede que conste.`); }
  if (f.publicou){ favor += 1; razoes.push('Um conselheiro que passou semanas sendo perguntado sobre isso em jantar de família vota a favor.'); }
  if (f.veterinario_vai_propor){ favor += 1; razoes.push('O médico vota a favor e pede que conste que ele mesmo vai propor a revisão dos critérios na próxima sessão.'); }
  if (f.quatro_foram){
    favor += 2; presidente = 1;
    razoes.push(`Os que foram ao galpão votam juntos, e ${c20_quem('o professor do conselho')} vota levantando a bengala em vez da mão, porque o ombro dele não sobe.`);
    razoes.push('E a Presidente, que vota por último, vota com os que foram.');
  }
  if (c20_yarrowNaMesa(d)){ conselheiros += 1; favor += 1; razoes.push('A Dra. Yarrow, de volta à cadeira que ficou vazia, vota a favor sem dizer uma palavra.'); }
  if (f.virou_conselheiro_contra){ conselheiros += 1; favor += 1; razoes.push(`Você vota a favor da sua própria matéria, de pé, e ${c20_hedda()} escreve o seu nome na lista de votos pela primeira vez.`); }
  if (f.fez_a_pergunta_das_maos){ favor += 1; razoes.push('Uma conselheira que não levantou a mão quando você perguntou vota a favor, e diz que é por isso.'); }
  if (Estado.rep.eixo === 'bom' && Estado.rep.bom >= 6){ favor += 1; razoes.push('Um conselheiro vota a favor e diz o seu nome como justificativa, o que é constrangedor para todo mundo na sala, inclusive para você.'); }
  if (mat === 'visita'){ favor += 1; razoes.push('Um conselheiro vota a favor e diz, sem nenhuma ironia, que é a primeira matéria em um ano e oito meses que não custa nada a ninguém.'); }
  if (mat === 'edital'){ favor -= 1; razoes.push(`${c20_quem('o contador do conselho', true)} vota contra e explica, com números, quanto custa uma assembleia de trezentas pessoas.`); }
  if (f.conselheira_confrontada) razoes.push(`${c20_quem('a conselheira da Liga', true)} não vota: assento de observadora, sem direito a voto. Ela fecha os olhos quando a contagem chega nela.`);
  if (f.observadora_pode_falar) razoes.push(`${c20_quem('a conselheira da Liga', true)} pede a palavra pela primeira vez em dois anos e fala noventa segundos. Não muda voto nenhum, e muda a sala.`);
  if (Historia.via() === 'mercenario' || Historia.via() === 'foragido'){ favor -= 2; razoes.push('Um conselheiro lembra, em voz alta e com documento, de onde vem o seu dinheiro. Dois votos mudam de lado.'); }
  if (f.atacou_o_conselho){ favor -= 3; razoes.push('Alguém lembra que você sacou uma Pokébola dentro desta sala. Isso pesa mais que tudo o que você disse.'); }
  favor = Math.max(0, Math.min(conselheiros, favor));
  const sim = favor + presidente, nao = (conselheiros - favor) + (1 - presidente);
  return {sim, nao, razoes, resultado: sim > nao ? 'aprovada' : sim === nao ? 'empate' : 'rejeitada'};
}

/* ============================================================
   CAPÍTULO 20 — A PRESIDENTE
   Sala comercial, sétimo andar, farmácia no térreo.
   ============================================================ */
CAPITULOS.push(
{
num:20, titulo:'A Presidente', local:'Saffron — sala 704', ambiente:'cidade', nivelArea:60,
tom:'muito sombrio', entradas:C20_ABERTURAS,
inicio: d => c20_abertura(d),
cenas:{

c20_ab_a_banca:{
  texto:[
    'Rua do Comércio, 118. Antes de entrar no prédio você para na banca de jornal da porta, porque você está adiando e porque banca de jornal é o melhor lugar do mundo pra adiar.',
    'O jornaleiro tem uns sessenta anos, um banquinho e um rádio pequeno tocando baixo. A banca tem o nome dele pintado na lateral, desbotado: BANCA DO BRAM.',
    c20_eu('O senhor tá aqui há muito tempo?'),
    fala('Sr. Bram', 'Vinte e seis anos nessa esquina.'),
    c20_eu('O senhor conhece o pessoal do sétimo andar?'),
    'Ele não pergunta por que você quer saber, o que é a gentileza dos jornaleiros.',
    fala('Sr. Bram', 'Da sala 704? Conheço uns doze de vista.'),
    fala('Sr. Bram', 'Eles vêm segunda sim, segunda não, sempre de manhã.'),
    'Ele dobra um jornal pra um cliente sem parar de falar.',
    fala('Sr. Bram', 'Compram revista, compram bala, um deles compra charuto e depois joga fora sem fumar. Eu vi ele jogar fora duas vezes.'),
    fala('Sr. Bram', 'São gente normal, {moço|moça}. É isso que eu ia te falar antes de você perguntar.')
  ],
  ef:{flag:'o_jornaleiro_da_118',
      npc:{nome:'Sr. Bram', opiniao:1, viuVoce:'Te contou do pessoal da 704 antes de você subir.'},
      registrar:'O conselho da sala 704 se reúne segunda sim, segunda não, de manhã.',
      presagio:'"São gente normal." Ele disse isso antes de você perguntar como eles são.'},
  escolhas:[
    {texto:'Perguntar se ele sabe o que eles fazem.', vai:'c20_ab_o_que_eles_fazem'},
    {texto:d => c19_sabeDaPresidente(d) ? 'Perguntar da presidente.' : 'Perguntar quem manda lá em cima.', vai:'c20_ab_a_mulher_da_cabeceira'},
    {texto:'Subir.', vai:'c20_predio'}
  ]
},

c20_ab_o_que_eles_fazem:{
  texto:[
    fala('Sr. Bram', 'Sei lá. É uma sigla.'),
    'Ele coça a nuca.',
    fala('Sr. Bram', 'Já perguntei uma vez, faz um ano e pouco, pra uma delas. Ela falou que é gestão de recurso.'),
    c20_eu('Recurso de quê?'),
    fala('Sr. Bram', 'Foi exatamente o que eu perguntei.'),
    'Ele ri, e é um riso curto de quem lembra de uma coisa engraçada.',
    fala('Sr. Bram', 'Ela falou que era recurso natural, sorriu e comprou uma revista de palavra cruzada.'),
    'Ele volta a arrumar os jornais.',
    fala('Sr. Bram', 'E eu achei ótimo, porque recurso natural é árvore, é água. É coisa boa.', 'baixo'),
    fala('Sr. Bram', 'Eu achei isso até você parar aqui.')
  ],
  ef:{flag:'recurso_natural',
      registrar:'Uma conselheira da 704 descreveu o trabalho como "gestão de recurso natural".',
      presagio:'Recurso natural é uma categoria contábil. Cabe árvore, cabe água, e cabe outra coisa.'},
  escolhas:[
    {texto:d => c19_sabeDaPresidente(d) ? 'Perguntar da presidente.' : 'Perguntar quem manda lá em cima.', vai:'c20_ab_a_mulher_da_cabeceira'},
    {texto:'Subir.', vai:'c20_predio'}
  ]
},

c20_ab_a_mulher_da_cabeceira:{
  texto:[
    d => c19_sabeDaPresidente(d) ? c20_eu('E a presidente? O senhor conhece?')(d) : c20_eu('E quem manda lá em cima?')(d),
    'Ele sabe de quem você está falando antes de você terminar.',
    d => c19_sabeDaPresidente(d)
      ? fala('Sr. Bram', 'Conheço. Ela vem a pé.')
      : fala('Sr. Bram', 'A presidente. Cinquenta e poucos anos, tailleur cinza, nunca de outra cor. Ela vem a pé.'),
    c20_eu('A pé?'),
    fala('Sr. Bram', 'A pé, de sacola de pano, toda reunião. Ela mora a seis quadras.'),
    'Ele aponta com o queixo numa direção qualquer.',
    fala('Sr. Bram', 'Ela compra o mesmo jornal há não sei quantos anos, sempre paga contado e nunca pede troco arredondado.'),
    fala('Sr. Bram', 'Uma vez o marido dela ficou internado e ela me contou. Eu perguntei dele na semana seguinte.'),
    'Ele para de arrumar a pilha de revista.',
    fala('Sr. Bram', 'Ela demorou pra responder. Aí agradeceu por eu ter lembrado, pagou o jornal e foi embora. Nunca mais falou dele, e eu nunca mais perguntei.'),
    d => d.flags.sabe_como_helio_morreu
      ? 'Você sabe o que aconteceu com ele: uma nota de três linhas e, na coluna do lado, um bando de Mankey num parque de Saffron. O Sr. Bram não sabe, e você não conta.'
      : d.flags.sabe_do_helio
        ? 'Harold Colman, cinquenta e nove anos. Você leu a nota de falecimento, e o Sr. Bram não sabe que ela existe.'
        : '',
    fala('Sr. Bram', 'Eu tô te falando isso porque você tá com cara de quem vai subir e brigar com alguém.'),
    fala('Sr. Bram', 'Sobe. Mas sobe sabendo que ela é assim.')
  ],
  ef:{flag:'a_presidente_vem_a_pe',
      registrar:'A presidente do conselho vem a pé, de sacola de pano, e mora a seis quadras.'},
  escolhas:[
    {texto:'Subir.', vai:'c20_predio'},
    {texto:'Sentar na banca mais um pouco antes.', vai:'c20_ab_sentou_na_banca'}
  ]
},

c20_ab_sentou_na_banca:{
  texto:[
    'Ele te empresta o banquinho dele e fica em pé, o que você tenta recusar e não consegue.',
    'Você fica sentad{o|a} na esquina da Rua do Comércio por uns vinte minutos, olhando a porta do 118.',
    'Nesses vinte minutos entram no prédio: dois entregadores, uma mulher com uma criança de colo, um homem de terno com pasta, três adolescentes de uniforme escolar e um senhor com um saco de pão.',
    'Nenhum deles parece nada.',
    'Você entende, sentad{o|a} num banquinho emprestado, a coisa mais difícil do dia: você veio preparad{o|a} pra um esconderijo e vai entrar numa reunião.',
    'E não existe treino pra isso.'
  ],
  ef:{flag:'sentou_na_banca', hp:2,
      registrar:'Sentou vinte minutos na banca antes de subir.'},
  escolhas:[
    {texto:'Subir.', vai:'c20_predio'}
  ]
},

c20_ab_o_elevador:{
  texto:[
    'O elevador do 118 é de 1971 e demora, e a demora dele é parte da arquitetura do prédio: todo mundo que vai ao sétimo andar passa um minuto e quarenta parado no saguão.',
    'Você passa esse minuto e quarenta com outras três pessoas.',
    'Uma mulher com uma pasta de vinil. Um homem com um saquinho de padaria. Uma moça com uma pilha de papel e uma caneta atrás da orelha.',
    'O elevador chega. Vocês quatro entram. A mulher da pasta aperta o sete sem perguntar a ninguém, e quando ela aperta o sete, o homem do saquinho de padaria não aperta nada.',
    'Nem a moça do papel.',
    'Três dos quatro vão pro sétimo andar. Só você não apertou nada.',
    'A moça do papel olha pro painel, depois pra você.',
    fala('a moça do papel', 'Sétimo também?'),
    'É a pergunta mais simples do mundo e você leva dois segundos pra responder.'
  ],
  ef:{flag:'subiu_no_elevador_com_eles',
      registrar:'Subiu no elevador do 118 com três pessoas que iam pro sétimo andar.'},
  escolhas:[
    {texto:'"Sétimo."', vai:'c20_ab_disse_setimo'},
    {texto:'"Eu não sei ainda."', vai:'c20_ab_nao_sei_ainda'},
    {texto:'Não responder.', vai:'c20_predio'}
  ]
},

c20_ab_disse_setimo:{
  texto:[
    c20_eu('Sétimo.'),
    'Ela aperta o sete de novo, sem precisar, que é o gesto automático de quem ouviu.',
    fala('a moça do papel', 'Você é do conselho ou é visita?'),
    c20_eu('Visita.'),
    fala('a moça do papel', 'Ah, ótimo. A gente quase nunca tem visita.'),
    'Ela diz isso com alegria genuína, e isso é a coisa mais desorientadora que te aconteceu em semanas.',
    fala('a moça do papel', 'A pauta de hoje é chata, aviso desde já. Cronograma de liberação e aprovação de ata.'),
    'O elevador passa pelo quarto andar.',
    fala('a moça do papel', 'Mas tem café na porta. O café é bom. É a única coisa que a gente faz bem por unanimidade.'),
    'A mulher da pasta de vinil dá um riso curto pelo nariz.',
    'O elevador chega no sétimo e a porta abre e é um corredor com carpete gasto.'
  ],
  ef:{flag:'foi_recebido_como_visita',
      npc:{nome:'a moça do papel', opiniao:1, viuVoce:'Te recebeu no elevador como visita da reunião.'},
      registrar:'A pauta da reunião de hoje é cronograma de liberação e aprovação de ata.'},
  escolhas:[
    {texto:'Entrar na sala com eles.', vai:'c20_predio'},
    {texto:'Ficar no corredor e tomar o café primeiro.', vai:'c20_cafe'}
  ]
},

c20_ab_nao_sei_ainda:{
  texto:[
    c20_eu('Eu não sei ainda.'),
    'Os três olham pra você ao mesmo tempo, e é o homem do saquinho de padaria que fala, com a boca cheia de uma coisa que ele acabou de comer.',
    fala('o homem do saquinho', 'Melhor resposta que eu já ouvi nesse elevador.'),
    'A mulher da pasta de vinil não acha graça. Ela te olha do jeito que se olha um problema de agenda.',
    fala('a mulher da pasta de vinil', 'Você é jornalista?'),
    c20_eu('Não.'),
    fala('a mulher da pasta de vinil', 'Estagiári{o|a} de algum escritório?'),
    c20_eu('Não.'),
    'O elevador passa pelo quinto andar. Ninguém fala nada por dois andares, o que num elevador é uma eternidade.',
    fala('a mulher da pasta de vinil', 'Então você é a terceira coisa.'),
    'Ela não diz qual é a terceira coisa. A porta abre no sétimo.'
  ],
  ef:{flag:'a_terceira_coisa',
      npc:{nome:'a mulher da pasta de vinil', opiniao:-1, viuVoce:'Te classificou no elevador e não disse como.'},
      registrar:'A mulher da pasta de vinil te classificou como "a terceira coisa".',
      presagio:'Ela tem uma lista de três tipos de gente que sobe nesse elevador. Duas ela sabe lidar.'},
  escolhas:[
    {texto:'Entrar na sala atrás deles.', vai:'c20_predio'},
    {texto:'Ficar no corredor e tomar o café primeiro.', vai:'c20_cafe'}
  ]
},

c20_ab_a_farmacia:{
  texto:[
    'Tem uma farmácia no térreo do 118 e você entra nela porque está com dor de cabeça de verdade e porque a farmácia atrasa a subida em mais dez minutos.',
    d => { Nomes.apresentar('a balconista da farmácia'); return 'A balconista tem uns trinta anos, um crachá que diz GINA e uma caneta presa no bolso do jaleco.'; },
    'Você compra o analgésico mais barato e toma ali mesmo, com água do bebedouro.',
    c20_eu('Você conhece o pessoal da 704?'),
    fala('a balconista da farmácia', 'Da reunião?'),
    'Ela nem levanta os olhos do caixa.',
    fala('a balconista da farmácia', 'Eles descem aqui de vez em quando. Uma delas compra remédio de pressão.'),
    c20_eu('Você sabe o que eles fazem?'),
    fala('a balconista da farmácia', 'Reunião, ué.'),
    'E aí ela levanta os olhos, porque a pergunta foi estranha.',
    fala('a balconista da farmácia', 'Por quê? Eles devem alguma coisa pra você?'),
    'É a pergunta certa, feita pela pessoa errada, e ela é a primeira pessoa a fazer essa pergunta em voz alta.'
  ],
  ef:{dinheiro:-40, hp:2, flag:'a_farmacia_do_terreo',
      registrar:'Uma das conselheiras da 704 compra remédio de pressão na farmácia do térreo.'},
  escolhas:[
    {texto:'"Devem."', vai:'c20_ab_devem'},
    {texto:'"Ainda não sei."', vai:'c20_predio'},
    {texto:'Perguntar qual delas compra o remédio.', vai:'c20_ab_qual_delas'}
  ]
},

c20_ab_devem:{
  texto:[
    c20_eu('Devem.'),
    'Ela fecha a gaveta do caixa devagar.',
    fala('a balconista da farmácia', 'Então sobe e cobra.'),
    c20_eu('É o que eu vim fazer.'),
    fala('a balconista da farmácia', 'Então por que você tá comprando analgésico?'),
    'Você não tem resposta pra isso.',
    'Ela pega o troco e conta na sua mão, moeda por moeda, sem pressa.',
    fala('a balconista da farmácia', 'Meu pai trabalhou vinte e dois anos numa firma que devia pra ele. Ele nunca subiu pra cobrar.'),
    fala('a balconista da farmácia', 'Ele reclamava todo domingo no almoço, por vinte e dois anos.'),
    'Ela fecha a sua mão em volta do troco com as duas mãos dela.',
    fala('a balconista da farmácia', 'Sobe.', 'baixo')
  ],
  ef:{flag:'a_balconista_mandou_subir', moral:1,
      npc:{nome:'a balconista da farmácia', opiniao:2, viuVoce:'Fechou a sua mão em volta do troco e mandou você subir.'},
      registrar:'A balconista da farmácia do térreo mandou você subir e cobrar.'},
  escolhas:[
    {texto:'Subir.', vai:'c20_predio'}
  ]
},

c20_ab_qual_delas:{
  texto:[
    c20_eu('Qual delas compra o remédio?'),
    fala('a balconista da farmácia', 'A da cabeceira. A que manda.'),
    c20_eu('Como você sabe que ela é a que manda?'),
    fala('a balconista da farmácia', 'Porque ela é a única que desce sozinha.'),
    'Ela arruma umas caixas no balcão.',
    fala('a balconista da farmácia', 'Os outros descem em dupla, em trio, conversando. Ela desce sozinha, compra e sobe.'),
    fala('a balconista da farmácia', 'E uma vez ela esqueceu a receita aqui e eu subi pra devolver.'),
    c20_eu('E?'),
    fala('a balconista da farmácia', 'E a porta tava aberta e eles tavam discutindo, e pararam quando eu bati.'),
    'Ela dá de ombros.',
    fala('a balconista da farmácia', 'Eles discutem. Eu achei isso interessante. Eu achava que gente assim não discutia.')
  ],
  ef:{flag:'eles_discutem',
      registrar:'O conselho da 704 discute entre si. A presidente é a única que desce sozinha.',
      presagio:'Se eles discutem, não são um bloco. Se não são um bloco, tem alguém na mesa que perde as votações.'},
  escolhas:[
    {texto:'Subir.', vai:'c20_predio'},
    {texto:'"Devem."', vai:'c20_ab_devem'}
  ]
},

c20_predio:{
  texto:[
    d => d.flags.entrou_na_704_cedo
      ? 'Rua do Comércio, 118. O mesmo prédio comercial de dezesseis andares, a mesma farmácia no térreo, a mesma banca de jornal na porta e o mesmo elevador que demora.'
      : 'Rua do Comércio, 118. Prédio comercial de dezesseis andares, com uma farmácia no térreo, uma banca de jornal na porta e um elevador que demora.',
    d => d.flags.entrou_na_704_cedo
      ? 'No sétimo andar, o carpete gasto, as três portas e o extintor com a validade em dia. A placa de acrílico da 704 continua dizendo CGRB em letra comum.'
      : 'No sétimo andar, o corredor tem carpete gasto, três portas e um extintor com a validade em dia. A sala 704 tem uma placa de acrílico com a sigla CGRB em letra comum.',
    'A porta está aberta. Do lado de fora, numa mesinha dobrável, tem uma garrafa térmica de café, copos descartáveis, um saquinho de açúcar e uma colher amarrada com barbante para não sumir.',
    d => d.flags.entrou_na_704_cedo
      ? 'Da outra vez eram seis em volta da mesa oval. Hoje são onze, com pasta e caneta, e a mesa ganhou cadeiras que não combinam com as dela. Alguém está falando sobre cronograma de liberação, e a pauta está no quadro branco, em letra grande.'
      : 'Lá dentro, onze pessoas sentadas em volta de uma mesa oval, com pasta e caneta. Uma delas está falando sobre cronograma de liberação. A pauta está escrita num quadro branco, em letra grande.',
    'Eles param quando você entra. Não com susto: com a pausa educada de quem foi interrompido numa reunião.',
    d => { if (d.flags.sabe_o_nome_da_presidente) Nomes.apresentar('a Presidente'); return ''; },
    d => d.flags.c20_conhecia_a_presidente
      ? 'Na cabeceira, atrás de uma plaquinha de papel dobrada que diz PRESIDÊNCIA, está a mulher de tailleur cinza da outra vez. Ela te reconhece antes de você chegar na mesa.'
      : 'Na cabeceira, atrás de uma plaquinha de papel dobrada que diz PRESIDÊNCIA, uma mulher de cinquenta e poucos anos, de tailleur cinza sem nada de caro.',
    fala('a Presidente', 'Bom dia.'),
    d => d.flags.c20_conhecia_a_presidente
      ? fala('a Presidente', '{O senhor|A senhora} voltou.')
      : fala('a Presidente', '{O senhor|A senhora} é…?')
  ],
  ef:{registrar:'Entrou na reunião ordinária do conselho da CGRB.',
      executar:() => { c20_ateAs(10); }},
  escolhas:[
    {texto:'Dizer o seu nome.', vai:'c20_nome'},
    {texto:d => c20_sabeDoArt27(d) ? 'Pedir a palavra, pelo Art. 27.' : 'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'Não dizer nada e olhar quem está na mesa.', vai:'c20_mesa'},
    {texto:'Sair para o corredor e tomar o café primeiro.', vai:'c20_cafe'},
    {texto:'Perguntar quem paga esse café.', vai:'c20_quem_paga_o_cafe'}
  ]
},

c20_cafe:{
  texto:[
    'Você sai, serve um copo e fica no corredor com a porta aberta atrás de você.',
    d => d.flags.foi_recebido_como_visita
      ? 'A moça do elevador disse que o café era bom. Não é: é ruim de um jeito específico, de garrafa térmica que ficou pronta às sete da manhã.'
      : 'O café é ruim de um jeito específico: é café de garrafa térmica que ficou pronto às sete da manhã.',
    'Pela porta dá para ouvir tudo, porque ninguém abaixa a voz.',
    'Item 3: readequação do orçamento da Estação 4 por causa do aumento do preço da ração.',
    'Item 4: cronograma de liberação da Fase II.',
    'Alguém pergunta se dá para adiantar uma semana. Outra pessoa responde que não, porque a chuva atrasa a adaptação, e a resposta é técnica e todo mundo aceita.'
  ],
  ef:{flag:'ouviu_do_corredor', instabilidade:1,
      registrar:'Ouviu a reunião do corredor. Item 4: cronograma de liberação da Fase II.',
      executar:() => { c20_ateAs(10); }},
  escolhas:[
    {texto:'Continuar ouvindo até o fim do item 4.', vai:'c20_item_quatro'},
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Perguntar quem faz esse café.', vai:'c20_quem_paga_o_cafe'},
    {texto:'Entrar e olhar a mesa.', vai:'c20_mesa'}
  ]
},

c20_item_quatro:{
  texto:[
    'O item 4 leva dezoito minutos.',
    'Discutem logística: quantos veículos, quantos dias, em que ordem por espécie, e se liberam de manhã ou no fim da tarde.',
    'Uma voz de homem defende o fim da tarde, porque de manhã tem movimento na estrada e unidade nova não sabe atravessar.',
    'Ninguém ri disso. Todo mundo anota.',
    'E é aí que você entende uma coisa que não estava preparad{o|a} para entender: eles estão tentando fazer direito.',
    'Não bem. Direito. São coisas diferentes e ninguém nessa sala confunde as duas.'
  ],
  ef:{instabilidade:1, moral:-2,
      registrar:'Discutiram por dezoito minutos o melhor horário para soltar, para as unidades não morrerem na estrada.'},
  escolhas:[
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Entrar e olhar a mesa antes.', vai:'c20_mesa'},
    {texto:'Ir embora antes de entrar.', vai:'c20_foi_embora_do_predio'}
  ]
},

c20_quem_paga_o_cafe:{
  texto:[
    'A pergunta não é pra ninguém, e quem responde é uma mulher de uns sessenta anos que sai da sala com a garrafa térmica vazia, pra trocar pela cheia da mesinha.',
    d => c20_cena(d, 18, 'c18_contou_mais')
      ? 'É a mulher da garrafa do café da esquina, a que avisou que era pra reunião de amanhã sem ninguém ter perguntado.'
      : '',
    fala('a secretária da mesa', 'Eu.'),
    'Ela alinha a colher no barbante.',
    fala('a secretária da mesa', 'Eu compro e eu faço, e recebo de volta no mês seguinte, por reembolso, com nota.'),
    c20_eu('A senhora é da Comissão?'),
    fala('a secretária da mesa', 'Eu sou a secretária da mesa.'),
    'Ela estende a mão.',
    d => { Nomes.apresentar('a secretária da mesa'); return fala('a secretária da mesa', 'Hedda. Eu redijo as atas.'); },
    d => d.flags.leu_as_atas
      ? 'Você aperta a mão de quem escreveu, palavra por palavra, tudo o que você leu numa noite inteira num quarto de Centro Pokémon.'
      : 'Você aperta a mão dela. É seca e firme, de quem escreve muito.',
    'Pela porta, a reunião continua sem ela. Ela escuta com metade da cabeça, do jeito de quem vai escrever aquilo mais tarde e já está escrevendo.'
  ],
  ef:{flag:'conheceu_bonfim',
      npc:{nome:'a secretária da mesa', opiniao:1, memoria:'Secretária da mesa. Redige todas as atas e faz o café.'},
      registrar:'Sra. Hedda, secretária da mesa, redige as atas da CGRB.'},
  escolhas:[
    {texto:d => c20_leuAsAtas(d) ? '"A senhora escreveu as trinta e quatro atas?"' : '"A senhora escreve tudo o que se fala aí dentro?"', vai:'c20_bonfim_atas'},
    {texto:'"E o livro do Art. 33? A senhora escreve esse também?"', vai:'c20_bonfim_livro', cond:d => !!d.flags.sabe_do_livro_fechado},
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Entrar e olhar a mesa.', vai:'c20_mesa'}
  ]
},

c20_bonfim_atas:{
  texto:[
    d => c20_leuAsAtas(d) ? c20_eu('A senhora escreveu as trinta e quatro atas?')(d) : c20_eu('A senhora escreve tudo o que se fala aí dentro?')(d),
    d => fala('a secretária da mesa', c20_leuAsAtas(d) ? 'Escrevi.' : 'Escrevo.'),
    'Ela não tem orgulho nem vergonha nisso.',
    fala('a secretária da mesa', 'Trinta e quatro atas em um ano e oito meses, mais as alterações de estatuto.'),
    c20_eu('A senhora lê o que escreve?'),
    'Ela para de arrumar os copos.',
    fala('a secretária da mesa', '{Moço|Moça}, eu não leio o que eu escrevo. Eu escrevo e depois eu confiro, que é diferente e é pior.'),
    'Ela alinha um copo.',
    fala('a secretária da mesa', 'Conferir é ler duas vezes procurando erro, e a gente não erra, e por isso eu sei tudo de cor.'),
    c20_eu('E a senhora concorda?'),
    fala('a secretária da mesa', 'Eu redijo.'),
    'Ela pega a garrafa.',
    fala('a secretária da mesa', 'Se eu começar a concordar ou discordar, a ata deixa de ser confiável, e a ata é a única coisa aqui que é confiável.')
  ],
  ef:{instabilidade:1,
      npc:{nome:'a secretária da mesa', opiniao:2, memoria:'Sabe todas as atas de cor de tanto conferir.'},
      registrar:'A Sra. Hedda sabe as trinta e quatro atas de cor porque confere, não porque lê.'},
  escolhas:[
    {texto:'"E o livro do Art. 33? A senhora escreve esse também?"', vai:'c20_bonfim_livro', cond:d => !!d.flags.sabe_do_livro_fechado},
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Entrar e olhar a mesa.', vai:'c20_mesa'}
  ]
},

c20_bonfim_livro:{
  texto:[
    c20_eu('E o livro do Art. 33? A senhora escreve esse também?'),
    'Ela para com a garrafa térmica na mão.',
    fala('a secretária da mesa', '{O senhor|A senhora} leu o estatuto inteiro.'),
    c20_eu('Li.'),
    fala('a secretária da mesa', 'Pouca gente lê o Art. 33.'),
    'Ela põe a garrafa na mesinha.',
    fala('a secretária da mesa', 'Eu escrevo esse também. É um livro de capa dura, numerado, que fica no armário e não sai da sala.'),
    c20_eu('Quantas reuniões fechadas já teve?'),
    'Ela olha para a porta aberta, depois para você, e responde como quem confere.',
    fala('a secretária da mesa', 'Nove.'),
    'Ela pega a garrafa de novo.',
    fala('a secretária da mesa', 'E as nove estão na mesma prateleira das outras, no mesmo armário, que é fechado com a mesma chave que abre a porta da frente.')
  ],
  ef:{flag:['sabe_do_livro_fechado','sabe_onde_fica_o_livro'], instabilidade:2,
      npc:{nome:'a secretária da mesa', opiniao:2, memoria:'Te disse quantas reuniões fechadas houve e onde fica o livro.'},
      rep:{eixo:'bom',delta:1,motivo:'Leu o estatuto inteiro, inclusive o artigo que ninguém lê'},
      registrar:'Nove reuniões fechadas. O livro fica no armário da sala 704, na mesma chave da porta.'},
  escolhas:[
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Entrar e olhar a mesa.', vai:'c20_mesa'},
    {texto:'"Me deixa ver o livro."', vai:'c20_pediu_o_livro'}
  ]
},

c20_pediu_o_livro:{
  texto:[
    c20_eu('Me deixa ver o livro.'),
    fala('a secretária da mesa', 'Não.'),
    'Sem hesitação nenhuma, e sem hostilidade nenhuma.',
    fala('a secretária da mesa', 'Eu sou secretária de uma associação, e o estatuto diz acesso restrito ao Conselho. Se eu te der, eu não sirvo mais pra nada, nem {pro senhor|pra senhora}.'),
    'Ela ajeita o barbante da colher.',
    fala('a secretária da mesa', 'Mas {o senhor|a senhora} pode pedir na mesa. Interessado pode propor matéria, e matéria pode ser exibição de documento. Art. 27, §3º.'),
    'Ela olha para você por cima dos óculos.',
    fala('a secretária da mesa', 'Eu não posso te dar. O conselho pode votar te dar.')
  ],
  ef:{flag:['pode_pedir_o_livro'],
      npc:{nome:'a secretária da mesa', opiniao:3, memoria:'Te ensinou como pedir o livro fechado pelo caminho certo.'},
      registrar:'O conselho pode votar a exibição do livro de reuniões fechadas, pelo Art. 27, §3º.'},
  escolhas:[
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Entrar e olhar a mesa antes.', vai:'c20_mesa'}
  ]
},

c20_foi_embora_do_predio:{
  texto:[
    'Você desce sem entrar.',
    'No térreo tem uma farmácia, uma banca de jornal e gente comprando coisa, e trânsito, e um rapaz distribuindo panfleto de curso de informática.',
    'Você fica parad{o|a} na calçada com o panfleto na mão por bastante tempo.',
    'Lá em cima, no sétimo andar, a reunião continua e vai terminar às onze e quarenta, como todas as reuniões.'
  ],
  ef:{flag:'nao_entrou_na_reuniao', moral:-4,
      registrar:'Desceu sem entrar na sala 704.'},
  escolhas:[
    {texto:'Subir de novo.', vai:'c20_predio'},
    {texto:'Ir embora de verdade.', vai:'c20_fim'}
  ]
},

/* ── A mesa ─────────────────────────────────────────────── */
c20_mesa:{
  texto:[
    'Você olha a mesa antes de falar, e eles deixam.',
    d => d.flags.entrou_na_704_cedo
      ? 'Treze cadeiras em volta da mesa oval de oito. Cinco vieram de outra sala e não combinam com as outras. Onze ocupadas e duas vazias: uma com uma pasta na frente dela mesmo assim, e a outra na ponta oposta à cabeceira, puxada pra trás uns vinte centímetros.'
      : 'Treze cadeiras em volta de uma mesa oval feita para oito. Onze ocupadas e duas vazias: uma com uma pasta na frente dela mesmo assim, e a outra na ponta oposta à cabeceira, puxada pra trás uns vinte centímetros.',
    'Nenhuma pessoa de uniforme. Um homem magro, de camisa de manga curta. Uma mulher de óculos na ponta, com o estatuto aberto. Um homem com uma calculadora de mesa do lado da pasta. Um senhor muito velho, de olhos fechados, com uma bengala encostada na cadeira.',
    d => !d.flags.c20_conhecia_o_fabre
      ? 'Um homem de barba e terno, com crachá no bolso, que não levanta os olhos nenhuma vez.'
      : d.flags.c20_fabre_sem_nome
        ? 'Um homem de barba e terno, com crachá no bolso: o homem de sapato limpo do S.S. Anne, de barba agora, que sabe que você está aí e não levanta os olhos nenhuma vez.'
        : 'Um homem de barba e terno, com crachá no bolso: o Curador Fabre, que sabe que você está aí e não levanta os olhos nenhuma vez.',
    d => d.flags.conheceu_sena
      ? 'Fora da mesa, numa cadeira de plástico encostada na parede, o Dr. Hollis, de jaleco. Ele te reconhece e volta para a pasta.'
      : 'Fora da mesa, numa cadeira de plástico encostada na parede, um homem de jaleco, que levanta os olhos e volta para a pasta.',
    'Numa mesinha ao lado da cabeceira, a secretária escreve a ata à mão, sem levantar a cabeça.',
    'E, na terceira cadeira da direita, uma mulher com o broche da Liga Pokémon na lapela, sentada à mesa de uma associação privada como quem senta à própria.',
    d => d.flags.sabe_da_terceira ? 'Não tem ninguém de Celadon aqui. A Terceira vende para eles e não senta com eles, e agora isso faz muito sentido.' : '',
    'Na frente de cada cadeira tem uma plaquinha de papel dobrada, com nome e função em letra de forma, a mesma letra da pauta. A da cabeceira, que da porta só dizia PRESIDÊNCIA, tem o nome embaixo, menor: Hester Colman.',
    'O homem magro é o Dr. Senna, médico de Pokémon. A mulher de óculos é a Dra. Sedge, advogada. O da calculadora é o Sr. Mallow, contador e vice-presidente. O homem de barba é o Curador Fabre. A plaquinha do senhor da bengala tem só o nome, sem função nenhuma: Sr. Tobias Dahl.',
    'A da mulher do broche diz OBSERVADORA — LIGA POKÉMON, e embaixo, à mão: Margot Heath. A da mesinha diz só SRA. HEDDA. As duas cadeiras vazias são as únicas sem plaquinha.',
    d => d.flags.c20_conhecia_a_presidente
      ? 'A Presidente espera você terminar de ler. Ela sabe que você já esteve aqui e não diz nada sobre isso.'
      : 'A Presidente espera você terminar de ler. Ela deixa você olhar, e isso é escolha dela.'
  ],
  ef:{executar:d => {
        d.flags.c20_fabre_sem_nome = !c18_sabeNomeFabre(d);
        Nomes.apresentar('a Presidente');
        Nomes.apresentar('o médico do conselho');
        Nomes.apresentar('a advogada do conselho');
        Nomes.apresentar('o contador do conselho');
        Nomes.apresentar('o professor do conselho');
        Nomes.apresentar('a conselheira da Liga');
        Nomes.apresentar('a secretária da mesa');
        c20_sabeOFabre();
        Estado.marcar('sabe_o_nome_da_presidente');
        Estado.marcar('viu_a_liga_na_mesa');
        return [{tipo:'liga', texto:'A Liga tem uma cadeira na mesa do conselho da Comissão, com plaquinha e tudo.'}];
      },
      registrar:'Olhou a mesa da sala 704: treze cadeiras, duas vazias, e uma observadora da Liga.'},
  escolhas:[
    {texto:'"Quem é cada um aqui?"', vai:'c20_quem_e_quem'},
    {texto:'"De quem é a cadeira com a pasta?"', vai:'c20_cadeira_vazia'},
    {texto:'"Você." — apontando para a mulher do broche da Liga.', vai:'c20_conselheira'},
    {texto:d => c20_sabeDoArt27(d) ? 'Pedir a palavra, pelo Art. 27.' : 'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'Dizer o seu nome.', vai:'c20_nome'}
  ]
},

c20_quem_e_quem:{
  texto:[
    c20_eu('Quem é cada um aqui?'),
    'A Presidente apresenta a mesa inteira, um por um, com cargo e formação, e leva dois minutos e meio. As plaquinhas diziam os nomes; ela diz o resto.',
    'Uma bióloga, com doutorado. O Dr. Senna, médico de Pokémon, vinte e dois anos de clínica de Pokémon grande. Um engenheiro agrônomo. A Dra. Sedge, advogada. O Sr. Mallow, contador e vice. O Sr. Tobias Dahl, professor titular aposentado, que dorme por três segundos no meio da própria apresentação.',
    'Uma servidora pública licenciada. Uma ex-diretora de escola técnica. O Curador Fabre.',
    'A observadora da Liga, Margot Heath, da diretoria, sem voto. Na parede, o Dr. Hollis, técnico-chefe da Estação 4, também sem voto. E a Sra. Hedda, que faz a ata e o café.',
    'E ela: Hester Colman, ex-diretora de fiscalização da Liga por nove anos.',
    'Ninguém desvia o olhar quando o próprio nome é dito. Todo mundo aqui está com o nome no cartório desde o primeiro dia.'
  ],
  ef:{flag:['viu_a_mesa_inteira','sabe_o_nome_da_presidente','c20_hollis_apresentado'],
      registrar:'O conselho inteiro, com nome e formação, todo mundo com o nome no cartório desde o primeiro dia.'},
  escolhas:[
    {texto:'"E o professor que dormiu?"', vai:'c20_o_professor'},
    {texto:'"De quem é a cadeira com a pasta?"', vai:'c20_cadeira_vazia'},
    {texto:'Perguntar ao médico como ele assina isso.', vai:'c20_o_veterinario'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'}
  ]
},

c20_o_professor:{
  texto:[
    c20_eu('E o professor que dormiu?'),
    d => { Nomes.apresentar('o professor do conselho'); return 'O professor titular aposentado se chama Sr. Tobias Dahl e tem oitenta e um anos.'; },
    'Ele acorda com a palavra e responde antes de qualquer outra pessoa.',
    fala('o professor do conselho', 'Eu escrevi o primeiro levantamento de população de fauna de Kanto, em 1971.'),
    'A voz é fraca e a frase é firme.',
    fala('o professor do conselho', 'Cento e oitenta páginas. Eu andei a região inteira a pé, com um caderno.'),
    c20_eu('E o senhor está aqui por quê?'),
    fala('o professor do conselho', 'Porque eu entreguei aquele levantamento pra três diretorias da Liga, e nenhuma abriu.'),
    'Ele arruma os óculos.',
    fala('o professor do conselho', 'Estes aqui abriram. Leram as cento e oitenta páginas e me chamaram.'),
    'Ele volta a se encostar na cadeira.',
    fala('o professor do conselho', 'Eu tenho oitenta e um anos, {moço|moça}. Alguém finalmente me leu.')
  ],
  ef:{flag:'entendeu_o_professor', instabilidade:1, moral:-2,
      npc:{nome:'o professor do conselho', opiniao:1, memoria:'Entrou na Comissão porque foram os primeiros a ler o levantamento de 1971.'},
      registrar:'O levantamento de fauna de 1971 do Sr. Dahl foi lido pela Comissão e por mais ninguém.'},
  escolhas:[
    {texto:d => d.flags.sabe_do_art19 ? '"E o que o senhor acha do Art. 19?"' : '"E o descarte? O senhor votou a favor?"', vai:'c20_professor_art19',
     cond:d => !!(d.flags.sabe_do_art19 || d.flags.sabe_do_descarte)},
    {texto:'"De quem é a cadeira com a pasta?"', vai:'c20_cadeira_vazia'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'}
  ]
},

c20_professor_art19:{
  texto:[
    d => d.flags.sabe_do_art19 ? c20_eu('E o que o senhor acha do Art. 19?')(d) : c20_eu('E o descarte? O senhor votou a favor?')(d),
    'Ele leva um tempo, e quando fala, fala para a mesa e não para você.',
    fala('o professor do conselho', 'Eu votei a favor.'),
    'Ele põe as duas mãos na bengala.',
    fala('o professor do conselho', 'Em 1971 eu contei quatro mil e oitenta indivíduos numa faixa que hoje tem oitocentos. Eu vi a conta descer a vida inteira, e todo ano alguém me dizia que era cedo para agir.'),
    c20_eu('E agora é tarde?'),
    fala('o professor do conselho', 'Agora é tarde.'),
    'Ele fecha os olhos.',
    fala('o professor do conselho', 'E quando é tarde, {moço|moça}, a gente aceita coisa que não aceitaria. Eu sou a prova disso, sentado aqui.')
  ],
  ef:{instabilidade:1, moral:-2,
      registrar:'O Sr. Dahl votou a favor do descarte porque achou que já era tarde.'},
  escolhas:[
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'Perguntar ao médico como ele assina isso.', vai:'c20_o_veterinario'},
    {texto:'"De quem é a cadeira com a pasta?"', vai:'c20_cadeira_vazia'}
  ]
},

c20_o_veterinario:{
  texto:[
    c20_eu('E o senhor? Como um médico de Pokémon assina isso?'),
    'Ele é magro, de camisa de manga curta, e responde com a calma de quem já respondeu.',
    fala('o médico do conselho', 'Eu assino porque, se eu não assinar, assina outro, e o outro assina sem exame.'),
    'Ele abre a pasta.',
    fala('o médico do conselho', 'Eu exijo exame. Eu exijo laudo. Eu reprovei quarenta e um pedidos de descarte em dois anos.'),
    c20_eu('E aprovou quantos?'),
    'Ele não hesita e não amacia.',
    fala('o médico do conselho', 'Todos os outros.'),
    'Ele fecha a pasta.',
    fala('o médico do conselho', '{O senhor|A senhora} queria que eu dissesse um número menor. Eu não vou dizer um número menor.')
  ],
  ef:{flag:'ouviu_o_veterinario', instabilidade:1,
      npc:{nome:'o médico do conselho', opiniao:1, memoria:'Reprovou 41 pedidos de descarte e aprovou todos os outros.'},
      registrar:'O médico de Pokémon do conselho reprovou 41 descartes em dois anos e aprovou todos os outros.'},
  escolhas:[
    {texto:'"E dá pra aumentar os quarenta e um?"', vai:'c20_aumentar_os_41'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'"De quem é a cadeira com a pasta?"', vai:'c20_cadeira_vazia', cond:d => !!d.flags.viu_a_liga_na_mesa}
  ]
},

c20_aumentar_os_41:{
  texto:[
    c20_eu('E dá pra aumentar os quarenta e um?'),
    'Ele para com a mão na pasta.',
    'É a primeira vez na manhã inteira que alguém nessa sala faz uma cara de surpresa de verdade.',
    fala('o médico do conselho', 'Dá.'),
    'Ele fala devagar, pensando enquanto fala.',
    fala('o médico do conselho', 'Se os critérios do Art. 19 forem revistos, dá. Se a faixa de agressividade for alargada, dá. Se estereotipia leve sair da lista, dá.'),
    d => `Ele aponta com o queixo a ponta da mesa, onde ${c20_fabre(d)} não levanta os olhos.`,
    fala('o médico do conselho', 'Isso o curador já pediu três vezes. Está em ata.'),
    c20_eu('E por que não passou?'),
    fala('o médico do conselho', 'Porque quem pedia era ele, e ele perde tudo o que pede. A mesa vota contra antes de ouvir.'),
    'Ele fecha a pasta.',
    fala('o médico do conselho', 'Eu tenho voto e nunca propus nada. Isso é meu, e é agora.')
  ],
  ef:{flag:['veterinario_vai_propor'], instabilidade:1,
      npc:{nome:'o médico do conselho', opiniao:3, memoria:'Percebeu, na sua frente, que nunca usou o voto que tem.'},
      rep:{eixo:'bom',delta:2,motivo:'Fez um conselheiro perceber que nunca usou o próprio voto'},
      registrar:'O médico de Pokémon do conselho vai propor a revisão dos critérios do Art. 19.'},
  escolhas:[
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'"De quem é a cadeira com a pasta?"', vai:'c20_cadeira_vazia', cond:d => !!d.flags.viu_a_liga_na_mesa}
  ]
},

c20_cadeira_vazia:{
  texto:[
    c20_eu('De quem é a cadeira com a pasta?'),
    'A Presidente olha para a cadeira antes de responder, o que já é uma resposta.',
    fala('a Presidente', 'Era da Dra. Isolde Yarrow, bióloga. Ela renunciou há pouco mais de um mês.'),
    c20_eu('Por quê?'),
    fala('a Presidente', 'Consta em ata: motivo pessoal.'),
    'Ela junta as mãos.',
    fala('a Presidente', 'Fora da ata, ela me disse que não conseguia mais ler o relatório mensal do galpão 4 e que preferia sair antes de se acostumar.'),
    'Ninguém na mesa desvia o olhar.',
    fala('a Presidente', 'A gente deixa a pasta dela ali porque eu determinei que a cadeira ficasse vaga até alguém ser eleito. Ninguém foi eleito, e eu não abri edital.'),
    'Ela olha para a cadeira de novo.',
    fala('a Presidente', 'Isso é uma coisa que eu faço e que eu não sei explicar.')
  ],
  ef:{flag:['sabe_da_alcina'], instabilidade:1,
      registrar:'A Dra. Isolde Yarrow renunciou ao conselho para não se acostumar. A cadeira dela segue vaga, com a pasta em cima.'},
  escolhas:[
    {texto:'"Onde ela está agora?"', vai:'c20_onde_esta_alcina'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'Dizer o seu nome.', vai:'c20_nome'},
    {texto:'"Quem é cada um aqui?"', vai:'c20_quem_e_quem'}
  ]
},

c20_onde_esta_alcina:{
  texto:[
    c20_eu('Onde ela está agora?'),
    fala('a Presidente', 'Dando aula.'),
    'A Presidente responde na hora.',
    fala('a Presidente', 'Escola técnica de Celadon, primeiro ano.'),
    c20_eu('A senhora sabe de cor.'),
    fala('a Presidente', 'Eu sei de cor onde estão as três pessoas que saíram daqui, e ligo pras três no fim do ano. Duas atendem.'),
    'A sala está muito quieta.',
    fala('a Presidente', 'Se {o senhor|a senhora} quiser falar com ela, o nome é público e a escola tem telefone.'),
    'Ela abre a pasta.',
    fala('a Presidente', 'E eu vou dizer o que eu digo sempre: ela não vai te dizer nada que eu não esteja dizendo agora. Ela só vai dizer com a voz melhor.')
  ],
  ef:{flag:['contato_alcina'],
      registrar:'A Dra. Isolde Yarrow dá aula na escola técnica de Celadon, primeiro ano.'},
  escolhas:[
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'Dizer o seu nome.', vai:'c20_nome'},
    {texto:'Sair e ir falar com ela antes.', vai:'c20_foi_falar_com_alcina'}
  ]
},

c20_foi_falar_com_alcina:{
  texto:[
    'Você desce, atravessa a cidade, pega o ônibus pra Celadon e chega na escola técnica quando a última aula da manhã está acabando.',
    'A reunião da sala 704 acaba no meio do caminho, sem você.',
    'A Dra. Isolde Yarrow tem uns quarenta anos, giz na manga e uma pilha de provas para corrigir.',
    'Ela ouve, e o rosto dela não muda nada até o fim.',
    fala('Dra. Isolde Yarrow', 'Eu vou te dizer a única coisa que eu sei que você não ouviu lá.'),
    'Ela empilha as provas.',
    fala('Dra. Isolde Yarrow', 'Eu não saí porque eu discordo. Eu concordo com quase tudo, ainda hoje.'),
    'Ela põe a pilha na bolsa.',
    fala('Dra. Isolde Yarrow', 'Eu saí porque um dia eu li o relatório do galpão 4 inteiro enquanto almoçava, e não parei de mastigar.')
  ],
  ef:{flag:['falou_com_alcina'], instabilidade:1,
      npc:{nome:'Dra. Isolde Yarrow', opiniao:2, memoria:'Saiu do conselho por ter lido o relatório do galpão 4 sem parar de mastigar.'},
      rep:{eixo:'bom',delta:1,motivo:'Foi até Celadon ouvir quem tinha saído'},
      registrar:'A Dra. Yarrow saiu do conselho por ter se acostumado, não por discordar.',
      executar:() => { c20_ateAs(12); }},
  escolhas:[
    {texto:'"Volta comigo pra reunião."', vai:'c20_alcina_volta'},
    {texto:'"Me dá alguma coisa que eu possa usar."', vai:'c20_alcina_da'},
    {texto:'Voltar sozinh{o|a} pra Saffron e esperar a próxima reunião.', vai:'c20_a_proxima_sessao'}
  ]
},

c20_alcina_volta:{
  texto:[
    c20_eu('Volta comigo pra reunião.'),
    'Ela ri, e é uma risada curta e sem alegria.',
    fala('Dra. Isolde Yarrow', 'Eu renunciei por escrito. Eu não tenho cadeira.'),
    c20_eu('A cadeira está vazia até hoje.'),
    'Ela para de arrumar a bolsa.',
    'Fica assim uns dez segundos.',
    fala('Dra. Isolde Yarrow', 'Ela está vazia?'),
    c20_eu('Com a sua pasta em cima.'),
    'Ela olha pela janela da sala de aula, para o pátio que esvazia, e depois pega a bolsa.',
    fala('Dra. Isolde Yarrow', 'A próxima reunião é daqui a duas semanas.'),
    fala('Dra. Isolde Yarrow', 'Eu vou.')
  ],
  ef:{flag:['alcina_volta'],
      npc:{nome:'Dra. Isolde Yarrow', opiniao:4, memoria:'Voltou ao conselho porque a cadeira dela nunca foi ocupada.'},
      rep:{eixo:'bom',delta:2,motivo:'Trouxe de volta quem tinha desistido'},
      registrar:'A Dra. Yarrow vai voltar ao conselho na próxima reunião.'},
  escolhas:[{texto:'Voltar pra Saffron e esperar a próxima reunião.', vai:'c20_a_proxima_sessao'}]
},

c20_alcina_da:{
  texto:[
    c20_eu('Me dá alguma coisa que eu possa usar.'),
    'Ela pensa, e depois abre a bolsa e tira um caderno de espiral com capa de plástico.',
    fala('Dra. Isolde Yarrow', 'Isso é a minha cópia dos relatórios mensais do galpão 4, dos últimos oito meses em que eu fui conselheira.'),
    'Ela segura o caderno por um instante.',
    fala('Dra. Isolde Yarrow', 'Eu não devia ter levado, e eu levei.'),
    c20_eu('E por que a senhora guardou?'),
    fala('Dra. Isolde Yarrow', 'Porque eu queria ter certeza de que eu não tinha exagerado na memória.'),
    'Ela entrega.',
    fala('Dra. Isolde Yarrow', 'Eu não exagerei. É pior do que eu lembro.')
  ],
  ef:{flag:['tem_relatorios_alcina','provas_do_viveiro'], itens:{'Oito relatórios mensais do galpão 4':1},
      npc:{nome:'Dra. Isolde Yarrow', opiniao:3, memoria:'Te deu os relatórios mensais que levou quando saiu.'},
      rep:{eixo:'bom',delta:2,motivo:'Saiu de Celadon com oito meses de relatório na mão'},
      registrar:'Oito relatórios mensais do galpão 4, guardados por quem renunciou.'},
  escolhas:[
    {texto:'"Volta comigo pra reunião."', vai:'c20_alcina_volta'},
    {texto:'Voltar pra Saffron e esperar a próxima reunião.', vai:'c20_a_proxima_sessao'}
  ]
},

/* a sessão seguinte, duas semanas depois: de volta de Celadon, de volta
   do galpão, ou de volta de uma mesa que ficou sem presidente */
c20_a_proxima_sessao:{
  texto:[
    'Duas semanas depois, segunda, dez horas, Rua do Comércio, 118.',
    'A mesinha dobrável, a garrafa térmica, a colher amarrada no barbante. O elevador ainda demora um minuto e quarenta.',
    d => d.flags.alcina_volta
      ? 'A Dra. Yarrow chegou antes de você. Ela tirou a pasta de cima da cadeira vazia e ficou em pé atrás dela, sem sentar.'
      : '',
    d => d.flags.alcina_volta
      ? `A Presidente olha a cadeira, olha a Dra. Yarrow, e pede ${c20_contrai('a', c20_hedda())} que registre o pedido de reintegração antes da ata da sessão anterior. Ninguém vota contra. A Dra. Yarrow senta.`
      : '',
    d => d.flags.quatro_foram
      ? `Os quatro que foram ao galpão sentam onde sentavam. ${c20_quem('o professor do conselho', true)} chega por último, de bengala, e ninguém começa sem ele.`
      : '',
    d => d.flags.c20_sem_mesa ? 'Na pauta do quadro branco, item 2: matéria de interessado, pedida na sessão anterior.' : '',
    'A Presidente te vê na porta e não se surpreende.',
    fala('a Presidente', 'Bom dia.'),
    d => fala('a Presidente', `Registra a presença de interessado, por favor. Como da outra vez.`)
  ],
  ef:{flag:'c20_voltou_na_outra_sessao',
      registrar:d => d.flags.alcina_volta
        ? 'Voltou à sala 704 na sessão seguinte. A Dra. Yarrow foi reintegrada à cadeira dela.'
        : 'Voltou à sala 704 na sessão seguinte, duas semanas depois.',
      executar:() => { c20_proximaSessao(); }},
  escolhas:[
    {texto:d => c20_sabeDoArt27(d) ? 'Pedir a palavra, pelo Art. 27.' : 'Pedir a palavra.', vai:'c20_palavra', cond:() => !Historia.jaAconteceu('c20_palavra')},
    {texto:'Pedir votação.', vai:'c20_votacao', cond:() => Historia.jaAconteceu('c20_palavra')},
    {texto:'Ir embora.', vai:'c20_saiu_sala'}
  ]
},

c20_conselheira:{
  texto:[
    c20_eu('Você.'),
    'A mulher do broche da Liga não desvia o olhar e não parece constrangida.',
    fala('a conselheira da Liga', 'Eu tenho assento de observadora. Sem direito a voto. Consta na ata, e a ata é pública.'),
    'Ela fala com a calma de quem já ensaiou a frase.',
    c20_eu('Você é da Liga.'),
    fala('a conselheira da Liga', 'Diretoria. Há dezesseis anos.'),
    c20_eu('E o que a Liga faz sentada aqui?'),
    'Pela primeira vez, ela hesita.',
    fala('a conselheira da Liga', 'Olha.'),
    'Ela olha a Presidente, do outro lado da mesa.',
    fala('a conselheira da Liga', 'Eu queria que alguém de fora olhasse também. E eu não podia ser eu.')
  ],
  ef:{flag:'conselheira_confrontada', instabilidade:1,
      npc:{nome:'a conselheira da Liga', opiniao:1, memoria:'Admitiu, na frente do conselho, que queria alguém de fora olhando.'},
      registrar:'Uma diretora da Liga senta no conselho da Comissão como observadora, e queria que alguém de fora olhasse.'},
  escolhas:[
    {texto:'"A Liga sabe que você senta aqui?"', vai:'c20_liga_sabe'},
    {texto:'"Então vote comigo."', vai:'c20_pediu_voto_dela'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'}
  ]
},

c20_liga_sabe:{
  texto:[
    c20_eu('A Liga sabe que você senta aqui?'),
    fala('a conselheira da Liga', 'A Liga assinou o convênio que criou este assento.'),
    'Ela abre a pasta e tira uma folha.',
    fala('a conselheira da Liga', 'Cláusula nona. Publicada. Com a minha assinatura e a de mais três diretores.'),
    'Ela desliza a folha pela mesa até você.',
    d => d.flags.presidente_saiu_brigada
      ? 'Entre as quatro assinaturas da folha está a de Hester Colman, ainda como diretora de fiscalização.'
      : '',
    fala('a conselheira da Liga', 'O que a Liga não sabe é o que eu faço na cadeira, porque ninguém nunca me perguntou, em dois anos.'),
    c20_eu('E o que você faz?'),
    fala('a conselheira da Liga', 'Eu anoto.'),
    'Ela guarda a folha de volta.',
    fala('a conselheira da Liga', 'Eu tenho dois anos de anotação de reunião de conselho de uma entidade privada, feita por uma diretora da Liga, e ninguém nunca pediu pra ver.')
  ],
  ef:{flag:['sabe_do_assento_da_liga','liga_infiltrada'], instabilidade:1,
      registrar:'O assento de observadora da Liga foi criado pela cláusula nona do convênio.'},
  escolhas:[
    {texto:'"Me dá as anotações."', vai:'c20_pediu_as_anotacoes'},
    {texto:'"Então vote comigo."', vai:'c20_pediu_voto_dela'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'}
  ]
},

c20_pediu_as_anotacoes:{
  texto:[
    c20_eu('Me dá as anotações.'),
    'Ela olha a mesa inteira, devagar, e depois olha a Presidente, que não faz nenhum sinal em nenhuma direção.',
    fala('a conselheira da Liga', 'São quatro cadernos.'),
    c20_eu('Eu carrego.'),
    'Ela abre a pasta e tira um. Só um.',
    fala('a conselheira da Liga', 'Este é o mais recente, que é o que interessa, e é o que eu posso justificar se me perguntarem.'),
    'Ela empurra o caderno pela mesa.',
    fala('a conselheira da Liga', 'Os outros três eu entrego quando alguém me perguntar oficialmente, e eu vou querer que perguntem por escrito.')
  ],
  ef:{flag:['tem_caderno_da_liga','provas_do_11'], itens:{'Caderno de anotações da conselheira':1},
      npc:{nome:'a conselheira da Liga', opiniao:3, memoria:'Te entregou um dos quatro cadernos, na frente da mesa inteira.'},
      rep:{eixo:'bom',delta:2,motivo:'Arrancou um caderno de anotações da Liga na frente do conselho'},
      registrar:'O caderno mais recente da observadora da Liga nas reuniões do conselho.'},
  escolhas:[
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'"Então vote comigo."', vai:'c20_pediu_voto_dela'}
  ]
},

c20_pediu_voto_dela:{
  texto:[
    c20_eu('Então vote comigo.'),
    fala('a conselheira da Liga', 'Eu não tenho voto.'),
    c20_eu('Então fale.'),
    'Ela fica quieta.',
    'A Presidente, da cabeceira, diz uma coisa que muda o dia inteiro:',
    fala('a Presidente', 'Observador pode falar. Art. 27, §2º. Só não pode votar.'),
    'As duas se olham por cima da mesa oval por um tempo longo demais.',
    fala('a conselheira da Liga', 'Eu sei.'),
    fala('a conselheira da Liga', 'Eu sei há dois anos.')
  ],
  ef:{flag:['observadora_pode_falar'], instabilidade:1,
      npc:{nome:'a conselheira da Liga', opiniao:2, memoria:'Foi lembrada, na sua frente, de que pode falar há dois anos.'},
      registrar:'A observadora da Liga pode falar nas reuniões. Nunca falou em dois anos.'},
  escolhas:[{texto:'Pedir a palavra.', vai:'c20_palavra'}]
},

c20_nome:{
  texto:[
    'Você diz o seu nome.',
    'Metade da mesa reage. A Presidente, não.',
    d => {
      if (d.flags.c20_conhecia_a_presidente)
        return c20_cena(d, 18, 'c18_704_porque_deixam')
          ? fala('a Presidente', 'Eu sei. Eu pedi que {o senhor|a senhora} voltasse depois de ler.')
          : fala('a Presidente', 'Eu sei. Nós já nos vimos nesta sala.');
      if (Estado.rep.eixo === 'bom' && Estado.rep.bom >= 6) return fala('a Presidente', 'Ah. {O senhor|A senhora} é bem mais nov{o|a} do que o relatório sugere.');
      if (Estado.rep.eixo === 'ruim' && Estado.rep.ruim >= 5) return fala('a Presidente', 'Ah. Nós temos uma pasta sua. É mais grossa que a de qualquer conselheiro aqui.');
      return fala('a Presidente', 'Ah. Nós esperávamos {o senhor|a senhora} em algum momento. Não hoje, mas em algum momento.');
    },
    'Ela fecha a pasta.',
    fala('a Presidente', 'Senta, por favor. Tem café lá fora.')
  ],
  escolhas:[
    {texto:'Sentar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'"Eu não vou sentar."', vai:'c20_nao_senta'},
    {texto:'Olhar a mesa antes.', vai:'c20_mesa'}
  ]
},

c20_nao_senta:{
  texto:[
    c20_eu('Eu não vou sentar.'),
    fala('a Presidente', 'Tudo bem.'),
    'Ela não insiste.',
    fala('a Presidente', '{O senhor|A senhora} pode falar em pé. Alguns preferem.'),
    'Alguns.',
    'Você fica com essa palavra atravessada por uns segundos, tentando imaginar quem foram os outros, e a Presidente vê você tentar.',
    fala('a Presidente', 'Três manifestações. Em um ano e oito meses. Duas por escrito e uma por telefone.'),
    c20_eu('E nenhuma apareceu aqui.'),
    fala('a Presidente', 'Nenhuma apareceu aqui.'),
    'Ela abre o estatuto na página do Art. 27.',
    fala('a Presidente', '{O senhor|A senhora} é {o primeiro|a primeira}. Eu peço que {o senhor|a senhora} leve isso a sério, porque eu estou levando.')
  ],
  ef:{flag:'ficou_em_pe', instabilidade:1,
      registrar:'Três manifestações em um ano e oito meses. Nenhuma presencial. Você é {o primeiro|a primeira}.'},
  escolhas:[{texto:'Pedir a palavra.', vai:'c20_palavra'}]
},

/* ── A palavra ──────────────────────────────────────────── */
c20_palavra:{
  texto:[
    d => c20_sabeDoArt27(d) ? c20_eu('Art. 27. Eu quero a palavra.')(d) : c20_eu('Eu quero falar.')(d),
    d => c20_sabeDoArt27(d) ? '' : fala('a Presidente', 'Art. 27: qualquer interessado pode pedir a palavra. {O senhor|A senhora} está pedindo.'),
    d => `A Presidente olha para ${c20_hedda()}, que confere o estatuto, assente e anota na ata.`,
    fala('a Presidente', 'Concedida. Cinco minutos, prorrogáveis.'),
    'E é isso que quebra você: eles te dão a palavra. Formalmente. Em ata. Com hora de início anotada na margem.',
    'A sala fica em silêncio e todo mundo olha para você, e você percebe que passou meses ensaiando o que faria se eles te impedissem e nada do que faria se eles te ouvissem.'
  ],
  ef:{flag:'falou_no_conselho',
      rep:{eixo:'bom',delta:2,motivo:'Falou no conselho da Comissão e foi ouvido em ata'}},
  escolhas:[
    {texto:d => c19_temPrancheta() ? 'Pôr a prancheta do galpão 4 na mesa.'
              : c20_temAPlanilha(d) ? 'Mostrar as fotos da planilha do galpão 4.' : 'Mostrar as fotos do galpão 4.',
     vai:'c20_falou_da_planilha', cond:d => !!d.flags.provas_do_galpao4},
    {texto:'Falar do Rattata que corre até a parede e volta.', vai:'c20_falou_do_rattata', cond:d => !!d.flags.viu_o_galpao_3},
    {texto:'Falar das pessoas que trabalham lá.', vai:'c20_falou_das_pessoas'},
    {texto:'Não fazer discurso. Fazer uma pergunta só.', vai:'c20_uma_pergunta_so'},
    {texto:'Ler em voz alta o Art. 19 deles.', vai:'c20_leu_o_art19', cond:d => !!d.flags.sabe_do_art19}
  ]
},

c20_falou_da_planilha:{
  texto:[
    d => c19_temPrancheta()
      ? 'Você põe a prancheta na mesa, trinta e nove páginas presas num clipe grande, e não faz discurso nenhum.'
      : c20_temAPlanilha(d)
        ? 'Você espalha na mesa as fotos da planilha, duas páginas por foto, e não faz discurso nenhum.'
        : 'Você espalha as fotos do galpão 4 na mesa, uma do lado da outra, e não faz discurso nenhum.',
    d => c20_temAPlanilha(d)
      ? 'Você lê em voz alta, linha por linha, a última leva: catorze anilhas, uma a uma, com o número inteiro e o mesmo motivo em todas. N/VIÁV.'
      : d.flags.destruiu_o_galpao4
        ? 'A esteira torta. A bancada no chão. A autoclave aberta. O ralo grande. O quadro branco riscado.'
        : 'A esteira. A bancada com dreno. A autoclave. O ralo grande. O quadro branco preenchido até embaixo, em letra caprichada.',
    d => c20_temAPlanilha(d)
      ? 'Leva quatro minutos ler catorze linhas em voz alta, porque você lê devagar.'
      : 'As fotos vão passando de mão em mão sem que ninguém peça, do jeito que se passa um prato, e ninguém devolve nenhuma.',
    d => c20_temAPlanilha(d)
      ? 'Na oitava linha, uma conselheira pede licença e sai da sala. Ninguém a impede e ninguém comenta.'
      : 'Na oitava foto, uma conselheira pede licença e sai da sala. Ninguém a impede e ninguém comenta.',
    d => d.flags.sabe_o_total
      ? 'Depois você diz o total: quatro mil cento e nove.'
      : (d.flags.somou_a_planilha && c20_temAPlanilha(d))
        ? 'Depois você diz que somou as trinta e nove páginas, e que o total tem quatro dígitos.'
        : '',
    d => `${c20_temAPlanilha(d) ? 'Na décima segunda linha' : 'Na décima segunda foto'}, ${c20_fabre(d)} levanta a cabeça pela primeira vez na manhã inteira.`,
    'Quando você termina, a Presidente espera cinco segundos inteiros antes de responder.'
  ],
  ef:{flag:['leu_a_planilha_no_conselho','c20_fabre_olhou'], instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Pôs o galpão 4 na mesa do conselho, sem discurso'},
      registrar:d => c20_temAPlanilha(d)
        ? 'Leu a planilha do galpão 4 em voz alta no conselho. Uma conselheira saiu da sala.'
        : 'Mostrou as fotos do galpão 4 ao conselho. Uma conselheira saiu da sala.'},
  escolhas:[{texto:'Ouvir a resposta.', vai:'c20_resposta'}]
},

c20_falou_do_rattata:{
  texto:[
    'Você fala do galpão de adaptação.',
    d => d.flags.entendeu_o_previsivel
      ? 'Do mato plantado em grade regular, da chuva programada pra ligar a cada meia hora, dos dois Nidoran que se cruzam a meio metro um do outro sem nenhum sinal.'
      : 'Do mato plantado em grade regular e da chuva programada pra ligar a cada meia hora.',
    'E do Rattata que corre em linha reta até a parede, para, e volta, e faz de novo, e de novo.',
    'Você fala quatro minutos sobre um Rattata só, numa sala onde tudo se vota por lote.',
    d => `${d.flags.viu_a_mesa_inteira ? 'A bióloga' : 'Uma conselheira'} anota alguma coisa. ${c20_hollis(d, true)}, na parede, fecha os olhos.`,
    'Quando você termina, a Presidente espera cinco segundos inteiros antes de responder.'
  ],
  ef:{flag:['falou_do_rattata'], instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Falou de um Pokémon só numa sala que só fala em lote'},
      registrar:'Falou do Rattata que corre até a parede, no conselho.'},
  escolhas:[{texto:'Ouvir a resposta.', vai:'c20_resposta'}]
},

c20_falou_das_pessoas:{
  texto:[
    'Você fala das pessoas.',
    d => {
      const L = [];
      if (c20_cena(d, 19, 'c19_o_que_acontece_com_feijao')) L.push('Da moça do berçário que dá nome escondido, pra ter alguém a quem pedir desculpa.');
      else if (d.flags.feijao) L.push('Da moça do berçário que chama um filhote de Feijão, escondido, sabendo que não devia.');
      if (d.flags.entende_o_ivo) L.push('Do rapaz da enfermaria que pediu transferência duas vezes e foi atendido as duas.');
      if (c20_cena(d, 19, 'c19_nao_olhou')) L.push('Da mulher que faz a apresentação de costas pra porta há vinte e sete visitas.');
      if (c20_cena(d, 19, 'c19_porque_se_oferece')) L.push('Do voluntário que dorme bem e fez questão de te dizer isso.');
      if (!L.length) L.push('Da gente de macacão e de jaleco que você viu na Estação 4: gente que bate ponto, almoça às onze e volta pra casa.');
      return L.join(' ');
    },
    'Você não acusa ninguém. Você só conta o que viu.',
    'E é assim que a sala muda: todo mundo aqui veio preparado pra ouvir sobre os Pokémon, e ninguém tinha pensado no que o trabalho faz com a própria equipe.',
    'A Presidente não responde por cinco segundos. Depois por mais cinco.'
  ],
  ef:{flag:['falou_das_pessoas'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Contou o que o trabalho faz com quem trabalha'},
      registrar:'Falou no conselho sobre o que o galpão 4 faz com as pessoas que trabalham nele.'},
  escolhas:[{texto:'Ouvir a resposta.', vai:'c20_resposta'}]
},

c20_uma_pergunta_so:{
  texto:[
    c20_eu('Eu não vou usar os cinco minutos.'),
    d => `${c20_hedda(true)} levanta os olhos da ata.`,
    c20_eu('Eu vou fazer uma pergunta e sentar.'),
    'Silêncio.',
    d => fala(d.jogador.nome, `Quantos dos senhores já entraram no ${c20_galpao(d)}?`),
    'Ninguém responde por sete segundos inteiros, que numa sala com onze pessoas é um tempo enorme.',
    d => `Depois ${c20_fabre(d)} levanta a mão. Depois a Presidente levanta a mão.`,
    d => (d.flags.conheceu_sena || d.flags.c20_hollis_apresentado)
      ? `Na parede, ${c20_hollis(d)} não levanta: ele entra lá toda semana, e a pergunta não era pra ele.`
      : 'Na parede, o homem de jaleco não levanta a mão, e não parece achar que a pergunta era pra ele.',
    'Duas mãos de onze.'
  ],
  ef:{flag:['fez_a_pergunta_das_maos','c20_fabre_olhou'], instabilidade:2,
      rep:{eixo:'bom',delta:3,motivo:'Fez uma pergunta em vez de um discurso'},
      registrar:'Duas das onze pessoas da mesa já entraram no galpão 4.'},
  escolhas:[{texto:'Ouvir a resposta.', vai:'c20_resposta'}]
},

c20_leu_o_art19:{
  texto:[
    d => d.flags.tem_o_estatuto
      ? 'Você abre o estatuto na página nove e lê o Art. 19 em voz alta, sem comentar, do jeito que está escrito.'
      : `Você pede um estatuto emprestado. ${c20_hedda(true)} empurra um exemplar pela mesa sem perguntar pra quê. Você abre na página nove e lê o Art. 19 em voz alta, sem comentar, do jeito que está escrito.`,
    '**' + COMISSAO.estatuto[4] + '**',
    'Depois fecha o estatuto e não fala mais nada.',
    'Quarenta segundos de silêncio. Quarenta segundos numa reunião de conselho é uma eternidade, e todo mundo aguenta, porque eles são educados.',
    d => `${c20_quem('a advogada do conselho', true)} é a primeira a falar, e fala baixo, para a mesa.`,
    fala('a advogada do conselho', 'Fui eu que redigi esse artigo.'),
    'Ela olha para a própria pasta.',
    fala('a advogada do conselho', 'Eu redigi assim pra ser estreito. Eu escrevi na forma do regulamento interno justamente pra amarrar. E hoje eu sei que amarrar e autorizar é a mesma frase.')
  ],
  ef:{flag:['leu_o_art19_no_conselho','sabe_do_art19'], instabilidade:2,
      npc:{nome:'a advogada do conselho', opiniao:2, memoria:'Admitiu, em voz alta, que redigiu o Art. 19 tentando amarrar.'},
      rep:{eixo:'bom',delta:2,motivo:'Leu o artigo deles para eles, sem comentar'},
      registrar:'A advogada do conselho redigiu o Art. 19 para restringir e entendeu que autorizou.'},
  escolhas:[{texto:'Ouvir a resposta da Presidente.', vai:'c20_resposta'}]
},

c20_resposta:{
  texto:[
    fala('a Presidente', 'Obrigada.'),
    'Ela diz isso sem ironia nenhuma.',
    fala('a Presidente', 'É a primeira manifestação presencial de interessado em um ano e oito meses. Vai constar na ata com o seu nome.'),
    fala('a Presidente', 'Agora eu vou responder, e eu peço que {o senhor|a senhora} me ouça com a mesma atenção, porque eu ouvi.'),
    /* quem ouviu a doutrina do Fabre no 18 não ouve de novo, palavra por palavra */
    d => fala('a Presidente', d.flags.ouviu_a_doutrina
      ? 'O curador me contou que já te recitou a nossa razão. Kanto quase acabou duas vezes, e quem salvou foi uma criança, por acaso.'
      : COMISSAO.doutrina[0].replace(/^"|"$/g, '')),
    d => fala('a Presidente', d.flags.ouviu_a_doutrina
      ? 'Ele diz isso melhor do que eu. E acredita menos, que é o motivo de ele dizer melhor.'
      : COMISSAO.doutrina[1].replace(/^"|"$/g, '')),
    d => fala('a Presidente', d.flags.ouviu_a_doutrina
      ? 'Eu vou dizer a parte que ele não diz.'
      : COMISSAO.doutrina[2].replace(/^"|"$/g, '')),
    fala('a Presidente', 'Eu fui diretora de fiscalização da Liga por nove anos. Eu assinei setenta e um relatórios sobre risco populacional. Nenhum virou política pública. Nenhum.'),
    fala('a Presidente', 'No septuagésimo segundo, eu pedi demissão e vim presidir isto aqui.'),
    'Ela junta as mãos.',
    fala('a Presidente', 'O galpão 4 é indefensável. Eu sei. Eu votei a favor do Art. 19, eu durmo mal por causa dele, e eu votaria de novo, porque a alternativa era não produzir, e não produzir é aceitar o número que a gente tinha antes.'),
    fala('a Presidente', 'Eu não vou te pedir que concorde. Eu vou fazer uma pergunta, e ela é honesta.'),
    d => fala('a Presidente', `${d.jogador.nome}, o que {o senhor|a senhora} faria no meu lugar?`)
  ],
  ef:{flag:'presidente_perguntou'},
  escolhas:[
    {texto:'"Eu fecharia. Hoje. E aceitaria o número."', vai:'c20_fechar'},
    {texto:'"Eu manteria os viveiros e acabaria com o Art. 19."', vai:'c20_reforma'},
    {texto:'"Eu não sei. Mas isso não autoriza a senhora."', vai:'c20_nao_autoriza'},
    {texto:'"Eu perguntaria quem elegeu a senhora."', vai:'c20_quem_elegeu'},
    {texto:'"Eu entraria no galpão uma vez por semana."', vai:'c20_entraria_no_galpao'},
    {texto:'"Eu faria exatamente o que a senhora faz."', vai:'c20_concordar'},
    {texto:'Não responder. Derrubar tudo agora.', vai:'c20_luta_presidente'}
  ]
},

c20_fechar:{
  texto:[
    c20_eu('Eu fecharia. Hoje. E aceitaria o número.'),
    fala('a Presidente', 'O número são pessoas.'),
    'A voz dela não muda.',
    fala('a Presidente', 'Trinta e uma ocorrências graves por ano. Onze crianças em quatro anos.'),
    c20_eu('Eu sei.'),
    fala('a Presidente', '{O senhor|A senhora} aceitaria isso.'),
    d => {
      if (d.flags.sabe_o_total) return c20_eu('Eu aceitaria isso, porque o outro lado do número é quatro mil cento e nove, numa planilha pendurada num prego, e ninguém nunca votou nele.')(d);
      if (d.flags.somou_a_planilha) return c20_eu('Eu aceitaria isso, porque o outro lado do número está numa planilha pendurada num prego, tem quatro dígitos, e ninguém nunca votou nele.')(d);
      if (c20_temAPlanilha(d)) return c20_eu('Eu aceitaria isso, porque o outro lado do número está numa planilha pendurada num prego, catorze por vez, e ninguém nunca votou nele.')(d);
      return c20_eu('Eu aceitaria isso, porque o outro lado do número não tem voto nenhum nesta sala.')(d);
    },
    'Silêncio na sala oval.',
    d => d.flags.c20_fabre_olhou
      ? `Uma conselheira anota. Outra olha para a Presidente. ${c20_fabre(d, true)} não tira mais os olhos de você.`
      : `Uma conselheira anota. Outra olha para a Presidente. ${c20_fabre(d, true)}, pela primeira vez, levanta a cabeça.`
  ],
  ef:{flag:'defendeu_fechar', rep:{eixo:'bom',delta:2,motivo:'Defendeu o fim do programa diante do conselho inteiro'}},
  escolhas:[
    {texto:'Pedir votação. Pelo estatuto.', vai:'c20_votacao'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'},
    {texto:'"E se eu estiver errad{o|a}?"', vai:'c20_e_se_eu_estiver_errado'}
  ]
},

c20_e_se_eu_estiver_errado:{
  texto:[
    c20_eu('E se eu estiver errad{o|a}?'),
    'Você diz isso na frente de onze pessoas que passaram quase dois anos tendo certeza.',
    'A Presidente demora a responder, e quando responde, responde mais devagar do que falou a manhã inteira.',
    fala('a Presidente', 'Aí {o senhor|a senhora} vai ter defendido uma coisa que custou vida de gente.'),
    'Ela apoia as mãos na mesa.',
    fala('a Presidente', 'E vai viver com isso, como eu vivo com o meu lado.'),
    'Ela olha para a mesa inteira.',
    fala('a Presidente', 'É isso que ninguém entende sobre esta sala. Aqui dentro não tem ninguém confortável. Tem gente que escolheu de que lado ia ficar mal.')
  ],
  ef:{flag:'perguntou_se_estava_errado', instabilidade:1, moral:3,
      npc:{nome:'a Presidente', opiniao:3, memoria:'Você perguntou, na frente da mesa, e se estivesse errad{o|a}.'},
      rep:{eixo:'bom',delta:2,motivo:'Admitiu dúvida numa sala cheia de certezas'},
      registrar:'Perguntou em voz alta se estava errad{o|a}, na frente do conselho.'},
  escolhas:[
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'}
  ]
},

c20_reforma:{
  texto:[
    c20_eu('Eu manteria os viveiros e acabaria com o Art. 19.'),
    'A Presidente inclina a cabeça um grau.',
    fala('a Presidente', 'Trinta e um por cento das unidades não atingem viabilidade. Sem descarte, elas vivem: com dor, sem autonomia, consumindo recurso de viveiro.'),
    c20_eu('Então parem de produzir trinta e um por cento a mais.'),
    fala('a Presidente', 'Isso reduz a liberação em um terço e aumenta o custo por unidade em quarenta e quatro por cento.'),
    d => c20_leuAsAtas(d) ? c20_eu('Eu sei. Eu li a ata.')(d) : c20_eu('Então custa mais.')(d),
    d => `E quem responde não é a Presidente. É ${c20_fabre(d)}.`,
    d => fala(c18_rotuloFabre(d), 'Custo por unidade não é argumento moral.'),
    'Ele diz isso olhando a mesa, e não ela.',
    d => fala(c18_rotuloFabre(d), 'Isso está na minha declaração de voto de onze meses atrás. Página quatro.')
  ],
  ef:{flag:'defendeu_reforma',
      rep:{eixo:'bom',delta:2,motivo:'Propôs uma reforma viável no conselho, em vez de um discurso'},
      npc:d => ({nome:c18_sabeNomeFabre(d) ? 'Curador Fabre' : c18_rotuloFabre(d), opiniao:3, memoria:'Falou na mesa, contra a Presidente, depois da sua proposta.'})},
  escolhas:[
    {texto:'Pedir votação. Pelo estatuto.', vai:'c20_votacao'},
    {texto:'Perguntar ao médico como ele assina isso.', vai:'c20_o_veterinario', cond:() => Nomes.sabe('o médico do conselho')},
    {texto:'Sair. Você plantou o que dava.', vai:'c20_saiu_sala'}
  ]
},

c20_nao_autoriza:{
  texto:[
    c20_eu('Eu não sei. Mas isso não autoriza a senhora.'),
    'A Presidente fica em silêncio por muito tempo.',
    fala('a Presidente', 'Não.'),
    'Ela concorda.',
    fala('a Presidente', 'Não autoriza. Eu não tenho autorização de ninguém. Eu tenho um estatuto que eu mesma escrevi e dez pessoas que concordaram comigo.'),
    fala('a Presidente', 'Isso não é legitimidade. Isso é organização.'),
    'Ela olha para a janela.',
    fala('a Presidente', 'Eu penso nisso todo domingo à noite, e segunda sim, segunda não, às dez da manhã, eu abro esta reunião assim mesmo, porque a alternativa é ninguém fazer nada, e eu já vi como é ninguém fazer nada. Foram nove anos.')
  ],
  ef:{flag:'desarmou_presidente',
      rep:{eixo:'bom',delta:2,motivo:'Encontrou a frase para a qual a Presidente não tem resposta'}},
  escolhas:[
    {texto:'"Então legitima. Abre pra eleição."', vai:'c20_abrir_eleicao'},
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar.', vai:'c20_publicar_tudo'},
    {texto:'"Então eu paro a senhora."', vai:'c20_luta_presidente'}
  ]
},

c20_abrir_eleicao:{
  texto:[
    c20_eu('Então legitima. Abre pra eleição.'),
    fala('a Presidente', 'Eleição entre quem?'),
    d => d.flags.tem_o_estatuto
      ? c20_eu('Entre quem quiser se associar. Vocês são uma associação civil. Qualquer pessoa pode se associar: está no estatuto de vocês, Art. 6º.')(d)
      : c20_eu('Entre quem quiser se associar. Vocês são uma associação civil. Associação aceita associado.')(d),
    d => d.flags.tem_o_estatuto
      ? `${c20_quem('a advogada do conselho', true)} vira as páginas depressa e confirma com a cabeça.`
      : `${c20_quem('a advogada do conselho', true)} vira as páginas depressa e diz o número em voz alta, sem querer: Art. 6º.`,
    'A Presidente não olha o estatuto, porque ela sabe.',
    fala('a Presidente', 'Está.'),
    'Ela fala devagar.',
    fala('a Presidente', 'E em um ano e oito meses, além dos onze fundadores, nós temos três associados, e os três são parentes de conselheiro.'),
    c20_eu('Porque ninguém sabe que dá.'),
    fala('a Presidente', 'Porque ninguém sabe que dá.'),
    'Ela repete, e alguma coisa no rosto dela muda de lugar.'
  ],
  ef:{flag:['propos_eleicao','sabe_do_art6'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Achou, no estatuto deles, a porta que ninguém abriu'},
      registrar:'Art. 6º: qualquer pessoa pode se associar à CGRB. Em um ano e oito meses, três se associaram.'},
  escolhas:[
    {texto:'"Eu quero me associar. Agora."', vai:'c20_se_associou'},
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar que dá pra se associar.', vai:'c20_publicar_tudo'}
  ]
},

c20_se_associou:{
  texto:[
    c20_eu('Eu quero me associar. Agora.'),
    d => `A sala inteira olha para ${c20_quem('a advogada do conselho')}, que confere, e depois para ${c20_hedda()}, que já está tirando uma folha de papel da pasta.`,
    fala('a secretária da mesa', 'Ficha de proposta de associado.'),
    d => `${c20_hedda(true)} diz isso sem nenhuma emoção.`,
    fala('a secretária da mesa', 'Nome, qualificação, endereço e duas assinaturas de associados proponentes.'),
    'Duas assinaturas.',
    'A sala fica muito quieta.',
    d => `${c20_fabre(d, true)} assina primeiro.`,
    d => c20_yarrowNaMesa(d)
      ? 'A Dra. Yarrow, de volta à cadeira dela, assina em segundo, e a caneta dela falha na primeira letra.'
      : `A segunda assinatura demora quatro minutos e vem ${c20_contrai('de', c20_quem('o médico do conselho'))}, que assina sem olhar para ninguém.`
  ],
  ef:{flag:['virou_associado'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Entrou na associação pela porta da frente, para votar dentro dela'},
      npc:d => ({nome:c18_sabeNomeFabre(d) ? 'Curador Fabre' : c18_rotuloFabre(d), opiniao:3, memoria:'Foi o primeiro a assinar a sua proposta de associado.'}),
      registrar:'Virou associad{o|a} da CGRB, com direito de voto em assembleia.'},
  escolhas:[
    {texto:'Pedir votação agora.', vai:'c20_votacao'},
    {texto:'"E quando é a próxima assembleia?"', vai:'c20_proxima_assembleia'}
  ]
},

c20_proxima_assembleia:{
  texto:[
    c20_eu('E quando é a próxima assembleia?'),
    fala('a secretária da mesa', 'A ordinária é uma vez por ano, no começo do ano. Extraordinária pode ser convocada por um quinto dos associados.'),
    d => `${c20_hedda(true)} responde sem consultar nada.`,
    'Um quinto de quinze, contando você, é três.',
    'Você faz essa conta em voz alta, sem querer, e a sala inteira faz junto.',
    'A Presidente fecha a pasta.',
    fala('a Presidente', '{O senhor|A senhora} entendeu rápido.'),
    'Ela não parece nem contrariada nem impressionada.',
    fala('a Presidente', 'Eu escrevi esse estatuto para ser à prova de mim mesma, e {o senhor|a senhora} acabou de achar a porta em vinte minutos.'),
    c20_eu('E a senhora vai fechar a porta?'),
    fala('a Presidente', 'Se eu fechar, eu deixo de ser o que eu escrevi que eu era.'),
    d => `Ela olha para ${c20_hedda()}.`,
    fala('a Presidente', 'Registra a proposta.')
  ],
  ef:{flag:['sabe_da_assembleia'],
      npc:{nome:'a Presidente', opiniao:2, memoria:'Registrou a sua proposta de associado sabendo o que isso abre.'},
      registrar:'Assembleia extraordinária pode ser convocada por três associados.'},
  escolhas:[
    {texto:'Pedir votação agora mesmo.', vai:'c20_votacao'},
    {texto:'Sair. A assembleia fica pra depois.', vai:'c20_saiu_sala'}
  ]
},

c20_quem_elegeu:{
  texto:[
    c20_eu('Eu perguntaria quem elegeu a senhora.'),
    fala('a Presidente', 'A assembleia de associados.'),
    'Ela responde no mesmo segundo, porque a resposta existe.',
    c20_eu('E quem são os associados?'),
    'Ela abre a boca e não fala.',
    d => `${c20_quem('a advogada do conselho', true)} vira uma página. ${c20_quem('o contador do conselho', true)} olha para o teto. ${c20_quem('o professor do conselho', true)} abre os olhos.`,
    fala('a Presidente', 'Catorze pessoas. Onze fundadores e três parentes.'),
    c20_eu('Então a senhora elegeu a senhora.'),
    fala('a Presidente', 'Sim.'),
    'Ela não tenta amaciar.',
    fala('a Presidente', 'Foi exatamente isso que aconteceu, e está tudo registrado, e {o senhor|a senhora} acabou de ser a primeira pessoa a dizer isso em voz alta nesta sala.')
  ],
  ef:{flag:['desarmou_presidente','sabe_do_art6'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Fez a pergunta de uma linha que o conselho não sabia responder'},
      registrar:'Catorze associados elegem o conselho: onze fundadores e três parentes.'},
  escolhas:[
    {texto:'"Então abre pra eleição."', vai:'c20_abrir_eleicao'},
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar isso.', vai:'c20_publicar_tudo'}
  ]
},

c20_entraria_no_galpao:{
  texto:[
    c20_eu('Eu entraria no galpão uma vez por semana.'),
    'A Presidente não entende no primeiro segundo.',
    fala('a Presidente', 'Como medida de quê?'),
    c20_eu('De nada. Não é medida. É só entrar.'),
    'Você olha a mesa inteira antes de continuar.',
    d => d.flags.fez_a_pergunta_das_maos
      ? c20_eu('Duas mãos levantaram aqui hoje. O resto da mesa vota descarte toda quinzena e nunca viu pra onde ele leva.')(d)
      : c20_eu('Eu aposto que pouca gente nesta mesa já entrou lá. E todo mundo aqui vota descarte toda quinzena.')(d),
    fala('a Presidente', 'E isso mudaria alguma coisa?'),
    c20_eu('Eu não sei. Mas, se não mudar nada, aí a senhora tem razão sobre tudo, e eu vou embora sem ter mais argumento.')
  ],
  ef:{flag:['propos_a_visita_obrigatoria'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Propôs a única coisa que ninguém nessa mesa tinha proposto'},
      registrar:'Propôs ao conselho que todos entrassem no galpão 4 uma vez por semana.'},
  escolhas:[
    {texto:'Pedir votação sobre isso.', vai:'c20_votacao'},
    {texto:'"Comecem hoje. Agora."', vai:'c20_comecem_hoje'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'}
  ]
},

c20_comecem_hoje:{
  texto:[
    c20_eu('Comecem hoje. Agora. A Rota 21 é a duas horas de carro, e ainda é de manhã.'),
    'Ninguém responde.',
    'A Presidente olha o relógio de pulso, e o gesto é involuntário e todo mundo vê.',
    fala('o contador do conselho', 'Eu tenho compromisso às quinze.'),
    'A frase fica pendurada no ar de um jeito insuportável.',
    d => `${c20_hedda(true)}, na mesinha da ata, para de escrever e não escreve mais nada por um tempo.`,
    'Depois a Presidente fecha a pasta.',
    fala('a Presidente', 'Eu vou.'),
    'Ela diz isso sem olhar para ninguém.',
    fala('a Presidente', 'Quem quiser vai comigo. Quem não quiser não precisa justificar nada, e isso vai constar em ata assim mesmo.')
  ],
  ef:{flag:['conselho_vai_ao_galpao'], instabilidade:1,
      rep:{eixo:'bom',delta:4,motivo:'Fez um conselho inteiro sair da sala e ir ver'},
      npc:{nome:'a Presidente', opiniao:3, memoria:'Levantou da mesa e foi ao galpão no meio de uma reunião.'},
      registrar:'A Presidente levantou da reunião para ir à Estação 4. Quem quisesse ia junto.'},
  escolhas:[
    {texto:'Ver quantos levantam.', vai:'c20_quantos_levantam'}
  ]
},

c20_quantos_levantam:{
  texto:[
    'Levantam quatro.',
    d => `A Presidente. ${c20_fabre(d, true)}. ${c20_quem('a advogada do conselho', true)}${d.flags.leu_o_art19_no_conselho ? ', que redigiu o Art. 19' : ''}. E ${c20_quem('o professor do conselho')}, ${Historia.jaAconteceu('c20_o_professor') ? 'de oitenta e um anos, ' : ''}que leva quarenta segundos pra levantar e não aceita ajuda de ninguém.`,
    d => `${c20_quem('o médico do conselho', true)} fica sentado e diz por quê, em voz alta, para a ata:`,
    fala('o médico do conselho', 'Eu vou na quinta. Hoje eu tenho cirurgia às duas, e é de um Pokémon de verdade, e eu não vou desmarcar por simbolismo.'),
    'Sete ficam. Quatro vão.',
    d => `${c20_hedda(true)} escreve tudo, os nomes dos quatro e os nomes dos sete, porque ata é ata.`
  ],
  ef:{flag:['quatro_foram'], instabilidade:1,
      registrar:'Quatro conselheiros foram ao galpão 4. Sete ficaram, e o nome de todos consta em ata.'},
  escolhas:[
    {texto:'Ir com eles.', vai:'c20_foi_com_eles'},
    {texto:'Ficar e pedir votação a quem ficou.', vai:'c20_sem_a_mesa'}
  ]
},

/* sem a Presidente na sala, o vice preside o resto da pauta e não
   submete matéria nova: o pedido fica pra sessão seguinte, em ata */
c20_sem_a_mesa:{
  texto:[
    c20_eu('Eu quero votação.'),
    d => `Quem preside agora é ${c20_quem('o contador do conselho')}, que é o vice. Ele puxa a pauta pra perto sem sentar na cabeceira.`,
    fala('o contador do conselho', 'Matéria de interessado é a critério da mesa.'),
    fala('o contador do conselho', 'E a mesa acabou de sair por aquela porta.'),
    'Ele não diz isso com ironia. Diz como quem lê um parágrafo.',
    fala('o contador do conselho', 'Eu presido o resto da pauta. Matéria nova, sem a Presidente, eu não submeto. Fica pra próxima sessão, e consta em ata que {o senhor|a senhora} pediu.'),
    d => `${c20_hedda(true)} anota.`
  ],
  ef:{flag:'c20_sem_mesa',
      registrar:'Sem a Presidente na sala, o vice não submeteu matéria nova. O pedido ficou em ata pra próxima sessão.'},
  escolhas:[
    {texto:'Esperar a próxima sessão.', vai:'c20_a_proxima_sessao'},
    {texto:'Sair da sala.', vai:'c20_saiu_sala'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'}
  ]
},

c20_foi_com_eles:{
  texto:[
    d => `Duas horas de carro em silêncio quase completo. Na rodovia, ${c20_quem('o professor do conselho')} adormece com a cabeça no vidro.`,
    d => `Na Estação 4, ${d.npcs && d.npcs['Sr. Delmar'] ? 'o Sr. Delmar' : 'o porteiro'} abre o portão e não entende por que a Presidente veio numa segunda.`,
    d => d.flags.destruiu_o_galpao4
      ? 'Eles entram no galpão 4 pela porta que nunca teve fechadura. Lá dentro ainda está como você deixou: a esteira torta, a bancada no chão, a autoclave com a porta arrancada.'
      : 'Eles entram no galpão 4 pela porta que nunca teve fechadura.',
    d => `A Presidente fica quatro minutos. ${c20_quem('a advogada do conselho', true)} fica dois e sai. ${c20_fabre(d, true)} fica até o fim, encostado na parede, olhando o quadro branco${d.flags.viu_o_quadro_do_g4 ? ', o do CONFERIR ANILHA UMA POR UMA' : ''}.`,
    d => `${c20_quem('o professor do conselho', true)} fica onze minutos e não fala nada, e depois pede pra sentar, e sentam ele numa cadeira de plástico no corredor coberto.`,
    'Na volta, no carro, ele diz a única frase do dia inteiro.',
    fala('o professor do conselho', 'Em 1971 eu contei quatro mil e oitenta, e eu achava que estava sendo o pessimista.')
  ],
  ef:{flag:['levou_o_conselho_ao_galpao'], instabilidade:2, moral:3,
      rep:{eixo:'bom',delta:3,motivo:'Levou quatro conselheiros para dentro do galpão'},
      registrar:'Quatro conselheiros entraram no galpão 4. O mais velho deles ficou onze minutos.',
      executar:() => { c20_ateAs(16); }},
  escolhas:[
    {texto:'Voltar a Saffron e pedir votação na próxima sessão.', vai:'c20_a_proxima_sessao'},
    {texto:'Publicar que o conselho foi.', vai:'c20_publicar_tudo'}
  ]
},

c20_concordar:{
  texto:[
    c20_eu('Eu faria exatamente o que a senhora faz.'),
    'A sala fica quieta.',
    fala('a Presidente', 'Isso é uma coisa muito séria de se dizer numa reunião que está sendo registrada em ata.'),
    c20_eu('Eu sei.'),
    d => `Ela olha para ${c20_hedda()}.`,
    fala('a Presidente', 'Registra.'),
    'Depois olha para você.',
    d => c20_yarrowNaMesa(d)
      ? fala('a Presidente', 'A cadeira da pasta voltou pra dona hoje. O estatuto deixa criar mais uma, de conselheiro titular, com direito a voto, e eu crio.')
      : fala('a Presidente', 'Tem uma cadeira vaga nesta mesa, a que está com uma pasta em cima. É de conselheiro titular, com direito a voto.'),
    fala('a Presidente', 'A sua idade é um problema jurídico que eu resolvo em três semanas.')
  ],
  ef:{flag:'disse_que_faria_igual',
      rep:{eixo:'ruim',delta:1,motivo:'Disse em ata que faria o mesmo que a Presidente'},
      registrar:'Disse em ata que faria o mesmo que a Presidente. Ela ofereceu uma cadeira no conselho.'},
  escolhas:[
    {texto:'Aceitar a cadeira.', vai:'c20_virou_conselheiro'},
    {texto:'"Não. Eu menti pra ver o que a senhora ia oferecer."', vai:'c20_mentiu_conselho'},
    {texto:'"Eu aceito, e o meu primeiro voto é pela revogação do Art. 19."', vai:'c20_aceitou_e_virou'}
  ]
},

c20_aceitou_e_virou:{
  texto:[
    c20_eu('Eu aceito, e o meu primeiro voto é pela revogação do Art. 19.'),
    'A Presidente não muda de expressão.',
    fala('a Presidente', 'Então a senhora me recrutou para perder.'),
    'Ela diz isso baixo, e você demora um segundo pra entender que ela está falando consigo mesma.',
    'Ela olha a mesa.',
    fala('a Presidente', 'É legítimo.'),
    d => `Ela assente para ${c20_hedda()}.`,
    fala('a Presidente', 'Registra a posse e registra a matéria.'),
    'E aí, com uma calma que te assusta mais que qualquer ameaça:',
    fala('a Presidente', 'Eu prefiro perder pra dentro do que continuar ganhando sozinha.')
  ],
  ef:{flag:['virou_conselheiro_contra'],
      rep:{eixo:'bom',delta:3,motivo:'Entrou no conselho para votar contra ele'},
      registrar:'Aceitou a cadeira e propôs, como primeiro voto, a revogação do Art. 19.'},
  escolhas:[{texto:'Pedir votação.', vai:'c20_votacao'}]
},

c20_mentiu_conselho:{
  texto:[
    c20_eu('Não. Eu menti pra ver o que a senhora ia oferecer.'),
    'A Presidente não se irrita. Ela parece, de todas as coisas possíveis, aliviada.',
    fala('a Presidente', 'Bom.'),
    'Ela anota alguma coisa na pasta.',
    fala('a Presidente', 'Eu ia ter que conviver com isso.'),
    c20_eu('Com o quê?'),
    fala('a Presidente', 'Com ter recrutado a única pessoa que apareceu aqui por conta própria em um ano e oito meses.'),
    'Ela fecha a caneta.',
    fala('a Presidente', 'Isso teria sido a coisa mais feia que eu já fiz, e eu aprovei o Art. 19.')
  ],
  ef:{flag:'recusou_a_cadeira',
      rep:{eixo:'bom',delta:2,motivo:'Recusou uma cadeira no conselho depois de arrancar a oferta'}},
  escolhas:[
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'}
  ]
},

c20_virou_conselheiro:{
  texto:[
    'Você assina a ata como interessad{o|a} e, três semanas depois, como conselheir{o|a} titular, com direito a voto.',
    'A cadeira paga jeton por sessão, e o primeiro depósito tem mais zeros do que você já viu numa conta sua.',
    'A primeira reunião de que você participa vota a Fase II-B: ampliação para a Rota 14.',
    'Você levanta a mão junto com os outros.',
    'O Curador Fabre vota contra. Sozinho. Como sempre.',
    'Na saída, ele te espera no corredor e não diz nada. Só olha.',
    'E na reunião seguinte você levanta a mão de novo.'
  ],
  ef:{flag:['aceitou_cadeira_conselho','conselheiro_da_comissao','tem_sangue_nas_maos','conhece_o_nome_adnan'],
      dinheiro:60000, moral:-25, instabilidade:2,
      rep:{eixo:'ruim',delta:5,motivo:'Aceitou a cadeira no conselho e votou a expansão dos viveiros'},
      npc:{nome:'Curador Fabre', opiniao:-6, memoria:'Te viu levantar a mão a favor da Fase II-B.'},
      registrar:'Tornou-se conselheir{o|a} titular da CGRB e votou a favor da expansão.',
      executar:() => {
        c20_sabeOFabre();
        Historia.definirVia('foragido', 'assumiu uma cadeira no conselho da Comissão');
        /* a posse sai em três semanas: a primeira sessão depois dela é a da
           quarta segunda, e a seguinte, duas segundas depois */
        for (let i = 0; i < 6; i++) Relogio.ateODia(0, 10, true);
        c20_ateAs(12);
        return [];
      }},
  escolhas:[{texto:'Seguir.', vai:'c20_fim'}]
},

/* ── A votação ──────────────────────────────────────────── */
c20_votacao:{
  texto:[
    d => d.flags.votou_uma_vez ? c20_eu('Eu tenho outra matéria.')(d) : c20_eu('Eu quero votação.')(d),
    d => d.flags.votou_uma_vez
      ? 'A Presidente não suspira, e dá pra ver que ela decidiu não suspirar.'
      : `A Presidente olha para ${c20_hedda()}, que confere o estatuto.`,
    d => d.flags.votou_uma_vez ? '' : fala('a secretária da mesa', 'Art. 27, §3º: interessado pode propor matéria, que será submetida a voto na mesma sessão, a critério da mesa.'),
    d => d.flags.votou_uma_vez ? '' : fala('a Presidente', 'A critério da mesa.'),
    d => d.flags.votou_uma_vez ? '' : 'Ela repete devagar e olha a sala inteira, uma pessoa por vez, e leva quase meio minuto pra fazer isso.',
    d => d.flags.votou_uma_vez
      ? fala('a Presidente', 'Mesmo parágrafo, mesma sessão. Qual é a matéria?')
      : fala('a Presidente', 'Submeto. Qual é a matéria?')
  ],
  ef:{flag:'votacao_aberta'},
  escolhas:[
    {texto:d => c20_sabeDaFase2(d) ? 'Revogação do Art. 19 e suspensão da Fase II.' : 'Revogação do Art. 19 e suspensão da próxima liberação.', vai:'c20_materia_art19'},
    {texto:'Exibição do livro de reuniões fechadas, do Art. 33.', vai:'c20_materia_livro', cond:d => !!d.flags.sabe_do_livro_fechado},
    {texto:'Visita obrigatória de todo conselheiro ao galpão 4.', vai:'c20_materia_visita'},
    {texto:'Abertura de edital de associados, pelo Art. 6º.', vai:'c20_materia_edital', cond:d => !!d.flags.sabe_do_art6}
  ]
},

c20_materia_art19:{
  texto:[
    d => c20_eu(c20_sabeDaFase2(d)
      ? 'Revogação do Art. 19 e suspensão da Fase II até revisão do protocolo de descarte.'
      : 'Revogação do Art. 19 e suspensão da próxima liberação até revisão do protocolo de descarte.')(d),
    d => `${c20_hedda(true)} escreve a matéria e lê em voz alta, palavra por palavra, para conferência, como manda o procedimento.`,
    'A Presidente confirma a redação.',
    d => `Votam os ${porExtenso(9 + (c20_yarrowNaMesa(d) ? 1 : 0) + (d.flags.virou_conselheiro_contra ? 1 : 0))} conselheiros, um por um, e a Presidente por último. Empate é dela.`,
    'E, do lado de fora, no corredor, a garrafa térmica esfriando numa mesinha dobrável.'
  ],
  ef:{flag:'materia_art19', executar:d => { d.flags.c20_materia = 'art19'; }},
  escolhas:[{texto:'Ouvir a votação.', vai:'c20_contagem'}]
},

c20_materia_livro:{
  texto:[
    c20_eu('Exibição do livro de reuniões fechadas ao interessado, pelo Art. 27, §3º.'),
    'A sala muda de temperatura.',
    d => `${c20_quem('a advogada do conselho', true)} é a primeira a falar.`,
    fala('a advogada do conselho', 'O Art. 33 diz acesso restrito ao Conselho.'),
    fala('a secretária da mesa', 'E o Art. 27, §3º, diz que o Conselho pode deliberar sobre matéria proposta por interessado.'),
    d => `${c20_hedda(true)} diz isso sem levantar os olhos da ata.`,
    fala('a secretária da mesa', 'Os dois são do mesmo estatuto e não se contradizem: o Conselho pode dar acesso ao que é restrito ao Conselho.'),
    d => `A Presidente olha para ${c20_hedda()} por um tempo comprido.`,
    fala('a Presidente', 'Submeto.')
  ],
  ef:{flag:'materia_livro', instabilidade:1,
      npc:{nome:'a secretária da mesa', opiniao:3, memoria:'Resolveu, em voz alta, a contradição entre o Art. 33 e o Art. 27.'},
      registrar:'Matéria em votação: exibição do livro de reuniões fechadas.',
      executar:d => { d.flags.c20_materia = 'livro'; }},
  escolhas:[{texto:'Ouvir a votação.', vai:'c20_contagem'}]
},

c20_materia_visita:{
  texto:[
    c20_eu('Visita obrigatória de todo conselheiro ao galpão 4, uma vez por mês, com registro de presença em ata.'),
    'É a matéria mais estranha que já foi submetida nessa mesa, e todo mundo percebe isso ao mesmo tempo.',
    'Não muda protocolo. Não muda orçamento. Não salva nenhuma unidade.',
    'Só obriga a mesa inteira a olhar.',
    fala('a advogada do conselho', 'Isso não tem efeito jurídico nenhum.'),
    d => `${c20_quem('a advogada do conselho', true)} diz isso baixinho, e a Presidente responde mais baixinho ainda:`,
    fala('a Presidente', 'Eu sei.'),
    fala('a Presidente', 'Submeto.')
  ],
  ef:{flag:'materia_visita',
      registrar:'Matéria em votação: visita mensal obrigatória de todo conselheiro ao galpão 4.',
      executar:d => { d.flags.c20_materia = 'visita'; }},
  escolhas:[{texto:'Ouvir a votação.', vai:'c20_contagem'}]
},

c20_materia_edital:{
  texto:[
    c20_eu('Abertura de edital público de admissão de associados, pelo Art. 6º, com divulgação em jornal de circulação regional.'),
    d => `${c20_quem('a advogada do conselho', true)} fecha os olhos.`,
    d => `${c20_quem('o contador do conselho', true)} faz uma conta no canto do papel e não diz o resultado.`,
    'Todo mundo nessa sala entende, em menos de dois segundos, o que essa matéria significa: se passar, a assembleia que elege este conselho pode ter trezentas pessoas dentro.',
    'A Presidente demora mais pra responder do que demorou em qualquer momento da manhã.',
    fala('a Presidente', 'Submeto.'),
    'Ela põe as duas mãos na mesa.',
    fala('a Presidente', 'E eu quero que conste em ata que fui eu que submeti.')
  ],
  ef:{flag:'materia_edital', instabilidade:1,
      npc:{nome:'a Presidente', opiniao:3, memoria:'Submeteu à votação a matéria que pode tirar o conselho dela.'},
      registrar:'Matéria em votação: edital público de admissão de associados.',
      executar:d => { d.flags.c20_materia = 'edital'; }},
  escolhas:[{texto:'Ouvir a votação.', vai:'c20_contagem'}]
},

/* a contagem e o resultado repetem numa segunda matéria: o voto é
   contado de novo e o resultado vale pra matéria da vez */
c20_contagem:{
  repetivel:true,
  texto:[
    d => d.flags.provas_do_galpao4 && !d.flags.leu_a_planilha_no_conselho
      ? `Antes de abrir a votação, ${c20_hedda()} pede o que fundamenta a matéria, pra constar em ata. Você põe na mesa o que trouxe da Estação 4.`
      : '',
    'A votação leva quatro minutos e é a coisa mais tensa que já te aconteceu sem nenhuma Pokébola envolvida.',
    d => ((d.c20Votacao && d.c20Votacao.razoes) || []).join(' '),
    d => {
      const v = d.c20Votacao || {sim:0, nao:0};
      return `Contagem final: ${porExtenso(v.sim)} a favor, ${porExtenso(v.nao)} contra.`;
    }
  ],
  ef:{executar:d => {
        /* o nome do Fabre: quem ainda não sabia, ouve na hora do voto dele */
        d.flags.c20_fabre_anonimo = !c18_sabeNomeFabre(d);
        d.c20Votacao = c20_contarVotos(d);
        c20_sabeOFabre();
        return [];
      }},
  escolhas:[{texto:'Ver o resultado.', vai:'c20_resultado_votacao', repetivel:true}]
},

c20_resultado_votacao:{
  repetivel:true,
  texto:[
    d => {
      const v = d.c20Votacao || {};
      if (v.resultado === 'aprovada') return 'Aprovada.';
      if (v.resultado === 'empate') return `Empate: ${porExtenso(v.sim)} a ${porExtenso(v.nao)}. O desempate é da Presidência.`;
      return 'Rejeitada.';
    },
    d => {
      const v = d.c20Votacao || {};
      if (v.resultado === 'aprovada') return `A Presidente ouve a contagem, assente uma vez e diz "aprovada" com a mesma voz com que abriu a reunião. ${c20_hedda(true)} anota. Acabou assim, numa sala comercial, num prédio com farmácia no térreo.`;
      if (v.resultado === 'empate') return 'A sala inteira olha para ela. Ela fica quieta por onze segundos.';
      return 'A Presidente ouve a contagem e não comemora. Ela agradece a sua manifestação, registra em ata e retoma a pauta de onde parou.';
    },
    d => (d.c20Votacao || {}).resultado === 'empate' ? fala('a Presidente', 'Desempato a favor.') : '',
    d => (d.c20Votacao || {}).resultado === 'empate' ? 'E depois, antes que alguém respire:' : '',
    d => (d.c20Votacao || {}).resultado === 'empate'
      ? fala('a Presidente', 'E eu quero que conste que eu levei um ano e oito meses e uma pessoa de fora pra fazer isso.')
      : '',
    d => (d.c20Votacao || {}).resultado === 'rejeitada'
      ? 'Você fica sentad{o|a}. A reunião continua até a hora de sempre, e você fica até o fim, porque sair agora seria dizer que veio fazer discurso.'
      : 'Do lado de fora, no corredor, a garrafa térmica de café está fria e ninguém foi recolher.'
  ],
  ef:{executar:d => {
        const v = d.c20Votacao || {resultado:'rejeitada'};
        const mat = d.flags.c20_materia || 'art19';
        if (d.flags['c20_votou_' + mat]) return [];
        d.flags['c20_votou_' + mat] = true;
        const avisos = [];
        if (d.flags.votou_uma_vez) Estado.marcar('segunda_materia'); else Estado.marcar('votou_uma_vez');
        if (v.resultado !== 'rejeitada'){
          /* o empate desempatado a favor é meia vitória: o Art. 19 cai, a Fase II fica */
          const cheia = v.resultado === 'aprovada';
          if (mat === 'art19'){
            Estado.marcar('art19_revogado');
            if (cheia) Estado.marcar('fase2_suspensa');
            d.mundo.instabilidade = Math.max(0, d.mundo.instabilidade - (cheia ? 2 : 1));
            Estado.mudarRep('bom', cheia ? 4 : 2, 'Revogou o Art. 19 pelo voto, dentro da sala', {rep:{notorio:true, peso:3}});
            avisos.push({tipo:'rep', texto: cheia
              ? `O Art. 19 foi revogado e ${c20_fase2(d)}, suspensa. Você fez isso com uma votação.`
              : `O Art. 19 caiu. ${c20_maiuscula(c20_fase2(d))} continua no cronograma.`});
          } else if (mat === 'livro'){
            Estado.marcar('viu_o_livro_fechado'); Estado.marcar('provas_do_11');
            Estado.mudarRep('bom', 3, 'Fez o conselho abrir o próprio livro fechado', {rep:{notorio:true, peso:3}});
            avisos.push({tipo:'rep', texto:'O conselho votou a exibição do livro de reuniões fechadas.'});
          } else if (mat === 'visita'){
            Estado.marcar('visita_obrigatoria_aprovada');
            Estado.mudarRep('bom', 3, 'Obrigou o conselho inteiro a olhar uma vez por mês', {rep:{notorio:true, peso:3}});
            avisos.push({tipo:'rep', texto:'Todo conselheiro passa a entrar no galpão 4 uma vez por mês, com presença em ata.'});
          } else {
            Estado.marcar('edital_aprovado');
            Estado.mudarRep('bom', 4, 'Abriu a associação para qualquer pessoa de Kanto', {rep:{notorio:true, peso:3}});
            avisos.push({tipo:'rep', texto:'O edital de associados foi aprovado. A assembleia que elege o conselho fica aberta a qualquer pessoa de Kanto.'});
          }
        } else {
          Estado.marcar('votacao_perdida');
          Estado.marcar('c20_ficou_ate_o_fim');
          Estado.mudarRep('bom', 1, 'Perdeu a votação e ficou até o fim da sessão', {rep:{notorio:true, peso:3}});
          avisos.push({tipo:'info', texto:'Você perdeu. E ficou sentad{o|a} até o fim da sessão.'});
          c20_ateAs(11);
        }
        return avisos;
      }},
  escolhas:[
    {texto:'Ver o livro que acabou de ser aberto.', vai:'c20_abriram_o_livro', cond:d => !!d.flags.viu_o_livro_fechado},
    {texto:'Propor outra matéria na mesma sessão.', vai:'c20_votacao', cond:d => !d.flags.segunda_materia && !d.flags.c20_ficou_ate_o_fim},
    {texto:'Sair da sala.', vai:'c20_saiu_sala'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'},
    {texto:'"Então eu resolvo do meu jeito."', vai:'c20_luta_presidente', cond:d => !d.flags.art19_revogado && !d.flags.c20_ficou_ate_o_fim}
  ]
},

c20_abriram_o_livro:{
  texto:[
    d => d.flags.sabe_onde_fica_o_livro
      ? `${c20_hedda(true)} abre o armário com a mesma chave que abre a porta da frente e põe o livro na mesa.`
      : `${c20_hedda(true)} abre o armário com uma chave do chaveiro da porta e põe o livro na mesa.`,
    'Capa dura preta, páginas numeradas, nove atas.',
    'As oito primeiras são sobre contratação de vigilância, sobre um processo trabalhista e sobre a compra de um terreno que não se concretizou.',
    'A nona tem três linhas.',
    '**Reunião fechada. Deliberação única: aprovada, por maioria, a continuidade do Projeto Matriz, com aporte do centro de custo 11, condicionada à localização do Risco 01.**',
    'Condicionada à localização do Risco 01.',
    d => d.flags.carrega_a_matriz
      ? 'Matriz. A última alíquota está na sua mochila, numa caixa com bateria própria e dois cadeados arrombados.'
      : d.flags.destruiu_a_matriz
        ? 'Matriz. A última alíquota escorreu no canto de uma bancada da Estação 4. Agora eles só têm o Risco 01.'
        : d.flags.sabe_da_matriz01
          ? 'Matriz. A gaveta com dois cadeados da Estação 4.'
          : '',
    d => d.flags.sabe_da_fase3
      ? 'O Projeto Matriz, o centro de custo 11 e a Fase III inteira dependem de eles acharem uma coisa que ninguém acha.'
      : 'O Projeto Matriz e o centro de custo 11 inteiro dependem de eles acharem uma coisa que ninguém acha.'
  ],
  ef:{flag:['leu_o_livro_fechado','sabe_do_risco01','provas_do_11'], instabilidade:2,
      rep:{eixo:'bom',delta:3,motivo:'Leu o livro que o estatuto dizia ser restrito'},
      registrar:'A nona ata fechada: o Projeto Matriz continua, condicionado à localização do Risco 01.'},
  escolhas:[
    {texto:'"E se eu achar ele primeiro?"', vai:'c20_se_eu_achar_primeiro'},
    {texto:'Propor outra matéria.', vai:'c20_votacao', cond:d => !d.flags.segunda_materia},
    {texto:'Sair e publicar isso.', vai:'c20_publicar_tudo'},
    {texto:'Sair da sala.', vai:'c20_saiu_sala'}
  ]
},

c20_se_eu_achar_primeiro:{
  texto:[
    c20_eu('E se eu achar ele primeiro?'),
    'A Presidente fecha o livro devagar.',
    fala('a Presidente', 'Aí {o senhor|a senhora} vai ter na mão uma coisa que esta mesa procura desde o primeiro dia, e vai ter que decidir sozinh{o|a} o que fazer com ela.'),
    d => `Ela empurra o livro de volta para ${c20_hedda()}.`,
    fala('a Presidente', 'Que é exatamente a situação que esta associação foi criada para não existir.'),
    'Ela olha para você por um tempo comprido.',
    fala('a Presidente', 'E {o senhor|a senhora} vai fazer melhor do que nós, provavelmente, porque vai ter olhado pra ele na cara.'),
    'Ela abre a pasta e volta para a pauta.',
    fala('a Presidente', 'Próximo item.')
  ],
  ef:{flag:['sabe_do_risco01'], instabilidade:1,
      npc:{nome:'a Presidente', opiniao:2, memoria:'Admitiu que você faria melhor por ter olhado na cara.'},
      registrar:'A Presidente sabe que você pode achar o Risco 01 antes deles.'},
  escolhas:[
    {texto:'Sair da sala.', vai:'c20_saiu_sala'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'}
  ]
},

/* ── Publicar ───────────────────────────────────────────── */
c20_publicar_tudo:{
  texto:[
    d => Historia.jaAconteceu('c20_foi_com_eles') && !Historia.jaAconteceu('c20_a_proxima_sessao')
      ? 'Você desce do carro em Saffron e leva tudo o que tem pra quem publica.'
      : 'Você sai da sala 704 e leva tudo o que tem pra quem publica.',
    d => {
      const ja = d.flags.publicou ? 'Dessa vez é diferente, porque dessa vez você tem prova. ' : '';
      if (c19_temPrancheta()) return ja + 'Você tem a prancheta: trinta e nove páginas, quase dois anos, com assinatura de responsável em cada linha.';
      if (c20_temAPlanilha(d)) return ja + 'Você tem as fotos da planilha: trinta e nove páginas, duas por foto, com assinatura de responsável em cada linha.';
      if (d.flags.provas_do_galpao4) return ja + 'Você tem as fotos do galpão 4: a esteira, o dreno, a autoclave e o quadro.';
      if (d.flags.tem_relatorios_alcina) return ja + 'Você tem os oito relatórios mensais da Dra. Yarrow, escritos por eles mesmos.';
      return c20_leuAsAtas(d)
        ? 'Você tem as atas, que são públicas, e a sua palavra, que não é prova.'
        : 'Você tem a sua palavra, que não é prova, e o que viu na Estação 4.';
    },
    'A pergunta agora não é se você publica. É onde, e com quem, e como.'
  ],
  ef:{flag:'vai_publicar'},
  escolhas:[
    {texto:'Livia Gale, jornal de Celadon.', vai:'c20_pub_isaura', cond:d => !!d.flags.contato_isaura},
    {texto:'Maeve Bracken, rádio comunitária de Fuchsia.', vai:'c20_pub_nadia', cond:d => !!d.flags.contato_nadia},
    {texto:'A Dra. Cordell, pelo caminho da Promotoria.', vai:'c20_pub_ivone', cond:d => !!d.flags.cartao_ivone},
    {texto:'Qualquer redação que aceite.', vai:'c20_pub_qualquer'}
  ]
},

c20_pub_isaura:{
  texto:[
    'Livia Gale lê tudo em silêncio por uma hora e vinte, com um lápis, marcando as páginas com tirinhas de papel.',
    'Quando termina, ela faz três perguntas.',
    fala('Livia Gale', 'Você tem a ata da reunião?'),
    'Ainda não: a ata sai em cinco dias.',
    fala('Livia Gale', 'Você consegue?'),
    'Consegue, porque é pública.',
    fala('Livia Gale', 'Você aceita esperar cinco dias?'),
    'Você aceita.',
    d => `Ela publica no sexto dia, com a ata da sessão reproduzida inteira ao lado ${c20_temAPlanilha(d) ? 'da planilha' : 'do que você trouxe'}, e com a hora em que você pediu a palavra impressa na legenda.`
  ],
  ef:{flag:['publicou','publicou_as_atas'],
      rep:{eixo:'bom',delta:3,motivo:'Esperou cinco dias para publicar com a ata junto'},
      registrar:'A matéria saiu com a ata da sessão ao lado do que você trouxe.',
      /* o sexto dia, de manhã */
      executar:() => { Relogio.amanhaAs(8); Relogio.viver(5 * 24); }},
  escolhas:[{texto:'Ver o que acontece.', vai:'c20_resultado_publicacao'}]
},

c20_pub_nadia:{
  texto:[
    'Maeve Bracken tem um programa das seis da manhã numa rádio comunitária de Fuchsia e uma audiência de gente que está acordada às seis da manhã: pescador, motorista, guarda-parque, gente de plantão.',
    'Ela não pede prova, porque ela já sabe. Ela pede outra coisa.',
    fala('Maeve Bracken', 'Você fala ao vivo?'),
    'Você fala ao vivo na manhã seguinte, das seis e dez às sete, sem corte, respondendo telefonema.',
    'O quarto telefonema é de uma mulher que trabalha na Estação 4, que não diz o nome, confirma tudo em vinte segundos e desliga.',
    'Não vira manchete em lugar nenhum. No fim do dia, é assunto em Fuchsia inteira.'
  ],
  ef:{flag:['publicou','falou_na_radio'],
      rep:{eixo:'bom',delta:3,motivo:'Falou ao vivo, sem corte, e atendeu telefonema'},
      npc:{nome:'Maeve Bracken', opiniao:3, memoria:'Te pôs no ar ao vivo por cinquenta minutos.'},
      registrar:'Falou cinquenta minutos ao vivo na rádio de Fuchsia. Uma funcionária ligou e confirmou.',
      executar:() => { Relogio.amanhaAs(6); c20_ateAs(18); }},
  escolhas:[{texto:'Ver o que acontece.', vai:'c20_resultado_publicacao'}]
},

c20_pub_ivone:{
  texto:[
    'A Dra. Cordell lê o material em duas horas, sem falar, e depois faz uma coisa que você não esperava: ela chora de raiva por uns quinze segundos e continua trabalhando como se nada tivesse acontecido.',
    fala('Dra. Cordell', 'Agora dá.'),
    'Ela puxa três folhas em branco.',
    fala('Dra. Cordell', 'Agora tem tipo penal.'),
    c20_eu('Qual?'),
    fala('Dra. Cordell', 'Nenhum dos que eu procurei.'),
    'Ela começa a escrever.',
    fala('Dra. Cordell', 'Falsidade ideológica em documento particular, no manifesto de resíduo. É pequeno, é feio, é o que pega.'),
    'Ela escreve por quarenta minutos sem levantar a cabeça.',
    fala('Dra. Cordell', 'Tem muito figurão que caiu por nota fiscal.'),
    'Ela não para de escrever.',
    fala('Dra. Cordell', 'Eu não tenho vergonha nenhuma.')
  ],
  ef:{flag:['publicou','representacao_no_mp'],
      rep:{eixo:'bom',delta:3,motivo:'Levou o material a quem sabia o que fazer com ele'},
      npc:{nome:'Dra. Cordell', opiniao:4, memoria:'Achou o tipo penal que procurava havia seis meses.'},
      registrar:'A Dra. Cordell protocolou representação na Promotoria de Kanto.',
      executar:() => { Relogio.avancar(3); }},
  escolhas:[{texto:'Ver o que acontece.', vai:'c20_resultado_publicacao'}]
},

c20_pub_qualquer:{
  texto:[
    'Você bate em quatro redações em três dias.',
    'A primeira pergunta se tem foto. A segunda diz que precisa de posicionamento oficial e que vai pedir, e nunca pede. A terceira agenda e desmarca.',
    'A quarta é um jornal de bairro de Saffron, com tiragem de mil e duzentos exemplares e um editor que também é o diagramador.',
    'Ele lê tudo em quarenta minutos e fecha a pasta.',
    fala('o editor do jornal de bairro', 'Eu vou publicar, e ninguém vai ler.'),
    'Ele já está mexendo na página.',
    fala('o editor do jornal de bairro', 'Mas vai existir. Daqui a dez anos, quando alguém for procurar, vai estar aqui, com data.')
  ],
  ef:{flag:['publicou','publicou_no_bairro'],
      rep:{eixo:'bom',delta:2,motivo:'Publicou num jornal de bairro porque era o que tinha'},
      registrar:'Saiu num jornal de bairro de Saffron, tiragem de 1.200.',
      executar:() => { Relogio.viver(3 * 24); }},
  escolhas:[{texto:'Ver o que acontece.', vai:'c20_resultado_publicacao'}]
},

c20_resultado_publicacao:{
  texto:[
    d => {
      if (d.flags.provas_do_galpao4 && d.flags.provas_do_viveiro)
        return 'A Comissão emite uma nota. A nota não funciona dessa vez. Nove dias depois, a Promotoria de Kanto abre inquérito, e a Estação 4 recebe ordem de parar tudo, descarte e liberação, até segunda ordem.';
      if (d.flags.provas_do_galpao4)
        return 'A planilha sustenta a manchete a semana inteira. No sétimo dia, a Estação 4 suspende o descarte "para revisão de protocolo", numa nota de cinco linhas.';
      if (d.flags.leu_o_livro_fechado)
        return 'O livro fechado é o que pega. Uma entidade que publica tudo e guarda nove atas num armário é uma manchete melhor que qualquer planilha, porque cabe numa linha.';
      if (d.flags.tem_caderno_da_liga)
        return 'O caderno da observadora é o que pega: uma diretora da Liga anotando, há dois anos, as reuniões de uma entidade privada, e ninguém nunca pediu pra ver.';
      if (d.flags.provas_do_11)
        return 'O que pega é o que você trouxe do andar 11 da Silph, publicado ao lado do estatuto de uma associação registrada em cartório.';
      return 'Sem prova material, a Comissão responde citando o próprio estatuto e o endereço do cartório, e o assunto começa a morrer na mesma semana.';
    },
    d => d.flags.representacao_no_mp
      ? 'A representação da Dra. Cordell entra no meio disso e muda o ritmo de tudo: com inquérito aberto, nota de esclarecimento deixa de ser resposta suficiente.'
      : 'A Comissão continua atendendo chamado de ataque em área urbana durante toda a repercussão, e continua sendo mais rápida que a Liga, e isso não sai em jornal nenhum.',
    'E a Presidente concede entrevista. Ela concede todas as entrevistas que pedem, sempre, sem exceção, e responde tudo, e é por isso que é difícil.'
  ],
  ef:{executar:d => {
        const avisos = [];
        if (d.flags.provas_do_galpao4 && d.flags.provas_do_viveiro){
          Relogio.viver(9 * 24);
          Estado.marcar('comissao_derrubada'); Estado.marcar('fase2_suspensa');
          d.mundo.instabilidade = Math.max(0, d.mundo.instabilidade - 3);
          Estado.mudarRep('bom', 4, 'Fez a Promotoria abrir inquérito sobre a Estação 4', {rep:{notorio:true, peso:3}});
          avisos.push({tipo:'rep', texto:'A Promotoria de Kanto abriu inquérito. A Estação 4 parou tudo até segunda ordem.'});
        } else if (d.flags.provas_do_galpao4){
          Relogio.viver(7 * 24);
          Estado.marcar('descarte_suspenso');
          Estado.mudarRep('bom', 3, 'Suspendeu o descarte com a planilha', {rep:{notorio:true, peso:3}});
          avisos.push({tipo:'rep', texto:'O descarte foi suspenso para revisão de protocolo.'});
        } else if (d.flags.leu_o_livro_fechado || d.flags.tem_caderno_da_liga || d.flags.provas_do_11){
          Estado.marcar('descarte_suspenso');
          Estado.mudarRep('bom', 3, d.flags.leu_o_livro_fechado ? 'Publicou a existência do livro fechado' : 'Publicou o que tinha, e o que tinha pegou', {rep:{notorio:true, peso:3}});
          avisos.push({tipo:'rep', texto:d.flags.leu_o_livro_fechado ? 'A existência do livro de reuniões fechadas virou o assunto.' : 'O que você publicou virou o assunto.'});
        } else {
          Estado.mudarRep('bom', 1, 'Publicou o que tinha, que não era o bastante', {rep:{notorio:true, peso:3}});
          avisos.push({tipo:'info', texto:'Sem prova material, o assunto não pegou.'});
        }
        return avisos;
      },
      flag:'publicou_o_viveiro',
      registrar:'Publicou o material sobre a Estação 4 e a Comissão.'},
  escolhas:[
    {texto:'Ler a entrevista da Presidente.', vai:'c20_entrevista'},
    {texto:'Seguir.', vai:'c20_fim'}
  ]
},

c20_entrevista:{
  texto:[
    'A entrevista tem duas páginas, e ela não erra uma vez.',
    'Ela confirma o número. Ela confirma o artigo. Ela confirma a existência do galpão e diz o nome da rua.',
    'E quando perguntam se ela se arrepende, ela dá a resposta mais eficaz que uma pessoa na posição dela pode dar:',
    '**"Eu me arrependo de ter feito sozinha."**',
    'A última pergunta é sobre você. Ela responde com o seu nome inteiro, correto, e diz que você pediu a palavra pelo Art. 27 e que foi a primeira pessoa a fazer isso.',
    'Depois acrescenta uma frase que o jornal põe em destaque, num quadradinho, em corpo maior:',
    '**"Eu gostaria que tivesse sido em oitenta e nove, e não gostaria que tivesse sido uma criança."**'
  ],
  ef:{flag:'leu_a_entrevista', instabilidade:1, moral:-2,
      registrar:'A Presidente deu entrevista, confirmou tudo e disse que se arrepende de ter feito sozinha.'},
  escolhas:[{texto:'Seguir.', vai:'c20_fim'}]
},

/* ── A luta ─────────────────────────────────────────────── */
c20_luta_presidente:{
  texto:[
    'Você saca uma Pokébola dentro de uma reunião de conselho.',
    'A mesa inteira sai da sala em ordem, sem correr, porque existe um procedimento pra isso e eles treinaram.',
    d => `${c20_hedda(true)} sai por último, levando a ata, porque a ata não pode ficar.`,
    'A Presidente não sai. Ela tira o paletó e o dobra sobre o encosto da cadeira.',
    fala('a Presidente', 'Eu fui treinadora antes de ser diretora.'),
    'Ela solta a primeira Pokébola.',
    fala('a Presidente', 'Todo mundo foi. É esse o problema de Kanto.'),
    'As unidades dela não têm nome. Têm código de lote: 1-A, 1-B, 1-C, 1-D.',
    'E a última tem só dois dígitos.'
  ],
  ef:{flag:'atacou_o_conselho',
      rep:{eixo:'ruim',delta:2,motivo:'Atacou uma reunião de conselho'}},
  batalha:{comissao:'presidente', nivel:58, tipo:'treinador', treinador:'a Presidente', fuga:false,
           vitoria:'c20_venceu_presidente', derrota:'c20_perdeu_presidente', gameover:'gameover'}
},

c20_venceu_presidente:{
  texto:[
    'A Unidade 01 cai por último.',
    'Você olha ela caída no carpete de uma sala comercial e entende, com um atraso de quatro segundos, o que ela é.',
    d => d.flags.viu_os_doze
      ? 'É o décimo segundo tanque do andar 11, o que estava vazio. Eles encheram.'
      : 'Ninguém nasceu assim. Isso foi feito, num lugar com jaleco e prancheta, e deu certo.',
    d => d.flags.viu_os_doze
      ? 'É a cara dos onze tanques, inteira dessa vez: nível sessenta e três, código de lote e nenhuma pergunta na cabeça.'
      : 'Nível sessenta e três, código de lote e nenhuma pergunta na cabeça.',
    'A Presidente recolhe a Pokébola com cuidado profissional.',
    fala('a Presidente', 'Ela não fala.'),
    'Ela responde à pergunta que você não fez.',
    fala('a Presidente', 'Nenhuma das quatro tentativas falou. Nós acertamos o corpo e nunca acertamos a outra parte.'),
    c20_eu('E vocês continuam.'),
    fala('a Presidente', 'E nós continuamos.'),
    'Ela dobra o paletó de novo.',
    fala('a Presidente', 'Porque a Fase III não precisa que ela fale. Precisa que ela obedeça.')
  ],
  ef:{flag:['viu_a_unidade01','sabe_da_fase3'], instabilidade:2,
      rep:{eixo:'bom',delta:1,motivo:'Derrotou a Presidente da Comissão na sala dela'},
      registrar:'A Unidade 01 existe: a última da Presidente, feita em laboratório, que não fala. A Fase III só precisa que ela obedeça.'},
  escolhas:[
    {texto:'Levar a Unidade 01 embora.', vai:'c20_levou_unidade01'},
    {texto:'Destruir a Unidade 01.', vai:'c20_destruiu_unidade01'},
    {texto:'"Solta ela aqui. Agora. Na minha frente."', vai:'c20_solta_aqui'},
    {texto:'Sair. Você já sabe o que precisava.', vai:'c20_saiu_sala'}
  ]
},

c20_solta_aqui:{
  texto:[
    c20_eu('Solta ela aqui. Agora. Na minha frente.'),
    'A Presidente olha para a Pokébola na mão e depois para você.',
    fala('a Presidente', 'Pra quê?'),
    c20_eu('Pra senhora ver ela sem estar lutando.'),
    'Ela solta.',
    'A Unidade 01 fica em pé no carpete de uma sala comercial, no meio de uma mesa oval com as pastas abertas de quem saiu, e não faz nada.',
    'Não ataca, não foge, não olha para a janela. Fica em pé, exatamente onde foi solta, esperando.',
    'Passam quarenta segundos. Ela não muda de posição uma vez.',
    'A Presidente olha por todo esse tempo e, no fim, senta na cadeira dela e apoia a testa nas duas mãos.'
  ],
  ef:{flag:['mostrou_a_unidade01'], instabilidade:2, moral:2,
      npc:{nome:'a Presidente', opiniao:2, memoria:'Ficou quarenta segundos olhando a Unidade 01 parada, esperando.'},
      rep:{eixo:'bom',delta:2,motivo:'Fez alguém olhar para o que fez sem estar lutando'},
      registrar:'A Unidade 01 ficou quarenta segundos parada no carpete, esperando ordem.'},
  escolhas:[
    {texto:'Levar a Unidade 01 embora.', vai:'c20_levou_unidade01'},
    {texto:'Destruir a Unidade 01.', vai:'c20_destruiu_unidade01'},
    {texto:'Sair sem ela.', vai:'c20_saiu_sala'}
  ]
},

c20_levou_unidade01:{
  texto:[
    'Você tira a Pokébola da mão dela. Ela não impede, e não impedir, aqui, é uma decisão dela.',
    fala('a Presidente', 'Ela vai te obedecer.'),
    fala('a Presidente', 'É pra isso que ela existe. {O senhor|A senhora} vai descobrir que essa é a pior parte.')
  ],
  ef:{flag:'tem_a_unidade01',
      executar:d => {
        const p = unidadeComissao(150, 63, '01');
        p.moral = 0;
        p.historia = 'Quarta tentativa da Comissão, a primeira que ficou de pé. Não fala, não pergunta, obedece.';
        const onde = Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv 63) entrou no seu time. Moral 0. Ela vai obedecer a tudo.${notaDestino(onde)}`}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Saiu da sala 704 com a Unidade 01 na mão'},
      registrar:'Levou a Unidade 01.'},
  escolhas:[{texto:'Sair.', vai:'c20_fim'}]
},

c20_destruiu_unidade01:{
  texto:[
    'Você destrói a Unidade 01 na sala 704, no carpete, com a Presidente olhando.',
    'Ela não tenta impedir. Anota alguma coisa na pasta quando acaba.',
    fala('a Presidente', 'Quarta tentativa perdida.'),
    fala('a Presidente', 'Dezoito meses de trabalho.'),
    'E aí, pela única vez na manhã inteira, a voz dela falha:',
    fala('a Presidente', 'Eu vou ter que aprovar a quinta. {O senhor|A senhora} entende isso? {O senhor|A senhora} acabou de me obrigar a aprovar a quinta.')
  ],
  ef:{flag:['destruiu_a_unidade01','tem_sangue_nas_maos'], instabilidade:1,
      rep:{eixo:'ruim',delta:2,motivo:'Destruiu uma criatura que não escolheu existir'},
      registrar:'Destruiu a Unidade 01. A quinta tentativa vai ser aprovada por causa disso.'},
  escolhas:[{texto:'Sair.', vai:'c20_fim'}]
},

c20_perdeu_presidente:{
  texto:[
    'Você perde numa sala comercial para uma mulher de tailleur cinza.',
    'Ela chama a enfermaria do prédio, que existe, no quarto andar, e é de um plano de saúde, e espera com você até chegarem.',
    fala('a Presidente', 'Isso vai constar na ata como incidente.'),
    'Ela diz isso vestindo o paletó de novo.',
    fala('a Presidente', 'Com o seu nome. Eu sinto muito, mas ata é ata.'),
    'Ela retoma a reunião de onde parou assim que te levam.'
  ],
  ef:{hp:-8, causa:'Derrota na sala 704',
      executar:d => { d.liga.avisos++; return [{tipo:'liga', texto:'O incidente foi registrado em ata, com o seu nome.'}]; },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou um conselho e perdeu'}},
  escolhas:[
    {texto:'Sair do prédio.', vai:'c20_fim'},
    {texto:'Voltar à sala quando conseguir andar.', vai:'c20_voltou_depois'}
  ]
},

c20_voltou_depois:{
  texto:[
    'Você sobe de novo perto das onze, com o braço na tipoia que o enfermeiro do quarto andar fez.',
    'A reunião ainda está acontecendo.',
    'Você fica na porta e não entra.',
    'A Presidente te vê, para a frase no meio e diz para a mesa:',
    fala('a Presidente', 'Suspendo por dois minutos.'),
    'Depois olha para você.',
    fala('a Presidente', '{O senhor|A senhora} ainda pode pedir a palavra. O incidente não tira o seu direito, porque o estatuto não prevê isso, e eu não vou inventar.')
  ],
  ef:{flag:'voltou_com_tipoia', moral:2,
      npc:{nome:'a Presidente', opiniao:2, memoria:'Suspendeu a sessão por dois minutos quando você voltou.'},
      rep:{eixo:'bom',delta:1,motivo:'Voltou depois de perder'},
      registrar:'Voltou à sala 704 depois de perder e ainda tinha direito à palavra.',
      executar:() => { c20_ateAs(11); }},
  escolhas:[
    {texto:'Pedir a palavra de novo.', vai:'c20_palavra'},
    {texto:'Pedir votação.', vai:'c20_votacao', cond:d => !d.flags.segunda_materia},
    {texto:'Ir embora de vez.', vai:'c20_fim'}
  ]
},

c20_saiu_sala:{
  texto:[
    d => d.flags.viu_a_unidade01
      ? 'Você sai da sala 704 e deixa a Presidente sozinha com a mesa vazia e as pastas abertas de quem saiu.'
      : d.flags.c20_ficou_ate_o_fim
        ? 'A reunião acaba na hora de sempre, e você desce no meio deles.'
        : 'Você sai da sala 704 e a reunião continua atrás de você.',
    d => d.flags.viu_a_unidade01
      ? `No corredor, a mesa inteira espera encostada na parede, em silêncio, e ${c20_hedda()} segura a ata contra o peito.`
      : d.flags.c20_ficou_ate_o_fim
        ? 'Ninguém fala com você e ninguém foge de você.'
        : `Dá para ouvir, do corredor, ${c20_hedda()} lendo o item seguinte da pauta em voz normal.`,
    'No elevador, um conselheiro te cumprimenta com a cabeça e não diz nada durante os sete andares, e no térreo segura a porta pra você passar primeiro.',
    'Na calçada tem uma farmácia, uma banca de jornal, gente comprando coisa e trânsito.',
    d => (d.flags.viu_a_unidade01 || d.flags.c20_ficou_ate_o_fim) ? '' : 'Lá em cima a reunião vai acabar às onze e quarenta, como todas.'
  ],
  escolhas:[
    {texto:'Sair do prédio.', vai:'c20_fim'},
    {texto:'Voltar e publicar tudo.', vai:'c20_publicar_tudo'},
    {texto:'Esperar a reunião acabar na calçada.', vai:'c20_esperou_na_calcada',
     cond:d => !d.flags.viu_a_unidade01 && !d.flags.c20_ficou_ate_o_fim}
  ]
},

c20_esperou_na_calcada:{
  texto:[
    'A reunião acaba na hora de sempre. Eles descem em três levas, porque o elevador é pequeno.',
    d => `Ninguém corre de você. Dois cumprimentam. ${c20_quem('o contador do conselho', true)} para na banca e compra um jornal.`,
    d => `${c20_fabre(d, true)} sai por último e vem direto até você, com a pasta debaixo do braço.`,
    d => fala(c18_rotuloFabre(d), '{O senhor|A senhora} vai voltar na próxima?'),
    c20_eu('Vou.'),
    'Ele assente, e alguma coisa nos ombros dele desce dois centímetros.',
    d => fala(c18_rotuloFabre(d), 'Então eu tenho dois votos na próxima. Um meu e o {do senhor|da senhora}, que não conta, mas que muda a sala, e a sala é onde eu perco.')
  ],
  ef:{flag:['adnan_espera_voce'], moral:3,
      npc:d => ({nome:c18_sabeNomeFabre(d) ? 'Curador Fabre' : c18_rotuloFabre(d), opiniao:4, memoria:'Perguntou se você vai voltar na próxima reunião.'}),
      rep:{eixo:'bom',delta:2,motivo:'Prometeu voltar na próxima reunião'},
      registrar:'Prometeu ao homem de barba da 704 voltar à próxima reunião.',
      executar:() => { c20_ateAs(11); }},
  escolhas:[{texto:'Seguir.', vai:'c20_fim'}]
},

c20_fim:{
  texto:[
    d => {
      if (d.flags.comissao_derrubada) return 'A Estação 4 está com o portão fechado e um aviso da Promotoria de Kanto colado na guarita. A Presidente foi a primeira a ser ouvida, e foi de tailleur cinza.';
      if (d.flags.edital_aprovado) return `${c20_hedda(true)} guarda a sua ficha de proposta de associado numa pasta nova, com uma etiqueta nova: EDITAL. Na prateleira, ela deixa do lado da pasta um espaço do tamanho de uma pilha.`;
      if (d.flags.art19_revogado && d.flags.fase2_suspensa) return 'O Art. 19 foi revogado numa segunda-feira de manhã, por votação, numa sala comercial. Nenhum jornal noticiou. É assim que as coisas mudam de verdade, e é por isso que ninguém acredita.';
      if (d.flags.art19_revogado) return `O Art. 19 caiu. ${c20_maiuscula(c20_fase2(d))} continua. Você conseguiu metade, e ainda não sabe se metade conta.`;
      if (d.flags.visita_obrigatoria_aprovada) return `O conselho inteiro passa a entrar no galpão 4 uma vez por mês, com presença em ata. Não muda nenhum protocolo. A primeira visita já tem dia e hora na ata, e ${c20_hedda()} já reservou a van.`;
      if (d.flags.conselheiro_da_comissao) return 'Você agora tem cadeira, voto e uma pasta com o seu nome numa mesa oval em Saffron. A reunião é segunda sim, segunda não, às dez.';
      if (d.flags.ignorou_a_comissao) return `${c20_maiuscula(c20_fase2(d))} segue no cronograma, como está na ata.`;
      if (d.flags.nao_entrou_na_reuniao && !d.flags.falou_no_conselho) return 'A reunião terminou às onze e quarenta, como todas as reuniões, sem você lá dentro.';
      return 'A reunião terminou às onze e quarenta, como todas as reuniões. O item 4 foi aprovado.';
    },
    d => {
      if (d.flags.leu_o_livro_fechado) return 'E na nona ata do livro que ninguém lia está escrito, em três linhas, que o Projeto Matriz depende de eles acharem uma coisa que ninguém acha.';
      if (d.flags.sabe_do_risco01 || d.flags.sabe_da_fase3) return 'E em algum lugar de uma ata, numa linha só, existe um item que não foi resolvido hoje: Risco 01, não localizado.';
      return '';
    },
    'A Liga te mandou uma carta enquanto você estava em Saffron. Papel bom, timbre em relevo.'
  ],
  /* a rádio de Fuchsia e o jornal de Celadon te deixam lá */
  sai:d => d.flags.falou_na_radio ? 'fuchsia' : d.flags.publicou_as_atas ? 'celadon' : null,
  fim:true, resumo:'Capítulo 20 concluído — o mal agora tem ata, pauta e café na entrada.'
}
}}

);
