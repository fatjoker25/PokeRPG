/* ============================================================
   A ENTREGA — quem não nasceu em Pallet não recebe da mão do
   Professor. Recebe da mão de quem dirige a perua dele.

   Célio Sampaio faz a volta de Kanto uma vez por mês. Onze
   paradas, vinte e dois dias de estrada, uma caixa térmica com
   três bolas lacradas e um caderno de capa dura com os nomes de
   quem pediu. Ele faz isso há dezenove anos.
   ============================================================ */

const ABERTURAS_ENTREGA = ['c1e_de_madrugada', 'c1e_quase_perdeu', 'c1e_chuva_na_praca'];

/* Os três de sempre. Ninguém escolhe no papel: a escolha é na frente
   da caixa (ou da bandeja do Professor), na manhã da saída. */
const INICIAIS_CLASSICOS = [1, 4, 7];

function reservarInicial(d, dex){
  d.entrega = Object.assign(d.entrega || {}, {dex});
}
/* quem nunca chegou a escolher (a bola veio pelo balcão) leva a que o
   laboratório separou */
function dexReservado(d){
  if (!d.entrega) d.entrega = {};
  if (!d.entrega.dex) d.entrega.dex = Dados.escolher(INICIAIS_CLASSICOS);
  return d.entrega.dex;
}
function especieReservada(d){
  return (DEX[dexReservado(d)] || {}).nome || 'o seu';
}
/* as três opções de escolha, uma por bola */
function escolhasDeInicial(rotulo, vai, extra){
  return INICIAIS_CLASSICOS.map(dex => Object.assign({
    texto: rotulo(DEX[dex].nome), vai,
    ef:{executar: d => { reservarInicial(d, dex); }}
  }, extra || {}));
}

/* a bola sai da caixa e vira bicho */
function entregarInicial(d){
  const dex = dexReservado(d);
  const p = criarPokemon(dex, 5, {
    moral: 50,
    historia: `Saiu da caixa térmica do Célio, em ${d.jogador.cidade}, numa manhã de ${typeof Calendario !== 'undefined' ? Calendario.hoje().mesNome : 'março'}.`
  });
  Estado.adicionar(p);
  Estado.j.inicialDex = p.dex;
  Estado.j.inicialUid = p.uid;
  if (typeof iniciarRival === 'function') iniciarRival();
  d.flags.espera_o_assistente = false;
  Estado.marcar('recebeu_do_goro');
  Estado.registrar(`${Estado.j.nome} recebeu ${p.nome} das mãos de Célio Sampaio, em ${d.jogador.cidade}.`);
  return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv 5) saiu da Pokébola.`}];
}

/* Em Pallet a bola sai da mão do Professor, na rua, na manhã da saída */
function entregarDoProfessor(d){
  const dex = dexReservado(d);
  const p = criarPokemon(dex, 5, {
    moral: 50,
    historia: 'Entregue pelo Professor, na rua de Pallet, na manhã em que você saiu de casa.'
  });
  Estado.adicionar(p);
  Estado.j.inicialDex = p.dex;
  Estado.j.inicialUid = p.uid;
  if (typeof iniciarRival === 'function') iniciarRival();
  d.flags.espera_o_professor = false;
  Estado.marcar('recebeu_do_professor');
  Estado.registrar(`${Estado.j.nome} recebeu ${p.nome} das mãos do Professor, em Pallet.`);
  return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv 5) saiu da Pokébola.`}];
}

(function(){
  const cap = CAPITULOS.find(c => c.num === 1);
  if (!cap) return;

  cap.entradas = (cap.entradas || []).concat(ABERTURAS_ENTREGA);
  /* "Ele sumiu" é a manhã em que o bicho da casa some: só existe pra
     quem já tem um bicho em casa. Quem espera o Professor não tem. */
  cap.inicio = d => {
    if (d && d.flags && d.flags.espera_o_assistente) return Dados.escolher(ABERTURAS_ENTREGA);
    const semBicho = d && ((d.flags && d.flags.espera_o_professor) || !(d.time || []).length);
    return Dados.escolher(semBicho ? ABERTURAS_C1.filter(a => a !== 'c1_ele_sumiu') : ABERTURAS_C1);
  };

  /* Toda rota de casa pra rua passa por c1_rua ou c1_saida_pro_centro,
     e as duas vêm antes do Centro — onde a licença pede o Pokémon na
     bancada. É ali que o Professor te para. */
  const professor = {se: d => !!(d.flags && d.flags.espera_o_professor), vai:'c1_professor'};
  cap.desvios = Object.assign(cap.desvios || {}, {c1_rua:professor, c1_saida_pro_centro:professor});

  Object.assign(cap.cenas, {

/* ─── PALLET: o Professor na rua ───────────────────────────── */
c1_professor:{
  texto:[
    'Você não chega nem na esquina.',
    'O Professor está parado no meio da rua, na frente do portão do laboratório, de jaleco por cima de uma camisa de dormir, com uma bandeja de metal nas mãos e três Pokébolas vermelhas e brancas em cima dela.',
    fala('o Professor', 'Eu disse oito horas.', null, 'Ele olha o relógio de pulso por cima da bandeja, sem pressa nenhuma.'),
    d=>d.flags.dormiu_demais
      ? fala('o Professor', 'São dez pras dez. Eu fiquei aqui mesmo assim, que bandeja não tem pressa.')
      : fala('o Professor', 'São oito e quatro. Tudo bem. Eu também me atrasei no meu.'),
    fala('o Professor', 'Mas Pokébola fechada não diz nada. Olha eles.'),
    'Ele abre as três de uma vez, com o polegar, e três luzes vermelhas descem no asfalto.',
    'O Bulbasaur se espreguiça e vira o bulbo pro sol. O Charmander sacode a cauda e a chama sobe quando te vê. O Squirtle já está olhando a poça da calha, com planos.',
    fala('o Professor', 'Escolhe. Aqui mesmo, na rua, como no meu tempo. Sem pressa.', 'riso')
  ],
  escolhas: escolhasDeInicial(n => `O ${n}.`, 'c1_professor_entrega')
},

c1_professor_entrega:{
  texto:[
    d=>`O ${especieReservada(d)} vem andando até o seu pé antes de você terminar de apontar. O Professor recolhe os outros dois e te entrega a Pokébola dele, e tira um caderno do bolso do jaleco pra escrever uma palavra só.`,
    d=>{ const aposta = INICIAIS_CLASSICOS[String(d.jogador.nome).length % 3];
         return aposta === dexReservado(d)
           ? fala('o Professor', `Eu tinha apostado comigo mesmo que ia ser ${especieReservada(d)}. Eu reparo nessas coisas.`)
           : fala('o Professor', `Eu tinha apostado comigo mesmo que ia ser ${DEX[aposta].nome}. Perdi. Faz quarenta anos que eu perco essa aposta.`, 'riso'); },
    'Não tem discurso, não tem foto. Só um Pokémon novo no meio da rua, com um Pidgey olhando do fio.',
    d=>{ const p = (d.time || []).slice(-1)[0];   // o último que entrou: quem ficou com o Pokémon da vizinha já tem um
         return p ? `${nomeExib(p)} olha primeiro pra ele, depois pra você, e fica olhando pra você.`
                  : 'A Pokébola pesa menos do que parecia.'; },
    d=>{ const p = (d.time || []).slice(-1)[0];
         return fala('o Professor', `${p ? pron(p).Ele : 'Ele'} gostou de você. Dá pra ver. O resto vocês descobrem juntos.`, 'riso'); },
    'Ele volta pro laboratório com a bandeja e as duas que sobraram, sem se despedir, do jeito de quem vai estar lá quando você voltar.'
  ],
  ef:{executar:d => entregarDoProfessor(d)},
  escolhas:[
    {texto:'Seguir pela rua.', vai:'c1_rua', cond:d => d.desvioVolta !== 'c1_saida_pro_centro'},
    {texto:'Seguir pro Centro.', vai:'c1_saida_pro_centro', cond:d => d.desvioVolta === 'c1_saida_pro_centro'}
  ]
},

/* ─── ABERTURA 1: acordou antes de todo mundo ─────────────── */
c1e_de_madrugada:{
  texto:[
    'Você acorda às quatro e quarenta da manhã sem despertador, do jeito que só se acorda quando o corpo passou a noite inteira sabendo a hora.',
    d=>`A perua chega em ${d.jogador.cidade} hoje. Chega uma vez por mês, fica até o meio-dia e vai embora, e se ela for embora com a sua Pokébola dentro você espera mais trinta dias.`,
    'Você se veste no escuro pra não acordar ninguém e falha na terceira gaveta.',
    d=>fala(nomeCasa(), 'Ainda não amanheceu.', 'baixo', 'A voz vem do corredor, e não estava dormindo.'),
    d=>fala(d.jogador.nome, 'Eu quero ser o primeiro.'),
    d=>fala(nomeCasa(), 'Você vai ser {o primeiro|a primeira}. Ninguém mais nessa rua pediu.'),
    'Silêncio dos dois lados da porta.',
    d=>fala(nomeCasa(), 'Come alguma coisa antes. Eu não vou deixar você sair daqui em jejum pra pegar Pokémon.', 'baixo')
  ],
  ef:{registrar:'Acordou antes do sol no dia da entrega.'},
  escolhas:[
    {texto:'Comer rápido e ir.', vai:'c1e_a_praca', ef:{hp:2}},
    {texto:'"Depois eu como." E sair.', vai:'c1e_a_praca',
     ef:{flag:'saiu_em_jejum', moral:-2}},
    {texto:'Sentar e comer direito, mesmo perdendo o primeiro lugar da fila.',
     vai:'c1e_a_praca', ef:{hp:4, flag:'comeu_antes_da_fila', moral:4}},
    {texto:'Perguntar se {casa:ela|ele} lembra do dia em que {casa:ela|ele} pediu a {casa:dela|dele}.',
     vai:'c1e_a_pergunta_da_casa'}
  ]
},

c1e_a_pergunta_da_casa:{
  texto:[
    d=>fala(d.jogador.nome, '{casa:A senhora|O senhor} pediu uma? Quando tinha a minha idade.'),
    'A porta do corredor abre o suficiente pra passar um rosto.',
    d=>fala(nomeCasa(), 'Pedi.'),
    d=>fala(nomeCasa(), 'Em setembro. Eu tinha dezesseis e o Célio era magro e tinha cabelo.', 'riso'),
    d=>fala(d.jogador.nome, 'E aí?'),
    d=>fala(nomeCasa(), 'E aí minha mãe adoeceu em outubro e eu cancelei em novembro, e em dezembro eu já estava trabalhando.'),
    '{casa:Ela|Ele} fala isso do jeito de quem conta uma coisa que já pensou até o fim, muitas vezes, e já parou de doer.',
    d=>fala(nomeCasa(), 'Não é história triste. É história comum. A cidade inteira tem uma dessas.', 'baixo'),
    d=>fala(nomeCasa(), 'Por isso eu acordei. Vai lá.')
  ],
  ef:{moral:6, flag:'sabe_da_bola_cancelada'},
  escolhas:[
    {texto:'"Qual era?"', vai:'c1e_qual_era'},
    {texto:'Abraçar e sair.', vai:'c1e_a_praca', ef:{moral:6, flag:'abracou_antes_da_fila'}},
    {texto:'Ir, sem falar mais nada.', vai:'c1e_a_praca'}
  ]
},

c1e_qual_era:{
  texto:[
    d=>fala(d.jogador.nome, 'Qual era a sua?'),
    '{casa:Ela|Ele} fecha a porta um pouco. Não com raiva — do jeito de quem fecha pra não ter que mostrar a cara enquanto responde.',
    d=>fala(nomeCasa(), 'Isso eu conto quando você voltar.'),
    d=>fala(nomeCasa(), 'É o tipo de coisa que serve pra fazer alguém voltar.', 'riso')
  ],
  ef:{flag:'divida_de_uma_pergunta', moral:4,
      registrar:'{casa:Ela|Ele} não disse qual espécie tinha pedido. Disse que conta quando você voltar.'},
  escolhas:[
    {texto:'"Então eu volto."', vai:'c1e_a_praca',
     ef:{flag:'promessa_voltar', moral:8}},
    {texto:'"Isso é chantagem."', vai:'c1e_chantagem'},
    {texto:'Ir pra praça sem prometer nada.', vai:'c1e_a_praca'}
  ]
},

c1e_chantagem:{
  texto:[
    d=>fala(d.jogador.nome, 'Isso é chantagem.'),
    d=>fala(nomeCasa(), 'É.', null, 'Sem nenhuma vergonha na voz.'),
    d=>fala(nomeCasa(), 'Eu tenho poucas ferramentas e essa funciona. Vai pegar a sua Pokébola.')
  ],
  ef:{moral:4},
  escolhas:[{texto:'Ir.', vai:'c1e_a_praca'}]
},

/* ─── ABERTURA 2: quase perdeu ────────────────────────────── */
c1e_quase_perdeu:{
  texto:[
    'Você acorda com barulho de motor.',
    'Não é o barulho de um carro passando. É o barulho de um motor ligado e parado, que é diferente, e que está ligado e parado há tempo suficiente pra você ter ouvido dormindo.',
    d=>`A perua do laboratório para em ${d.jogador.cidade} uma vez por mês, fica até o meio-dia e vai embora. Você olha o relógio.`,
    'Onze e cinquenta e dois.',
    d=>fala(nomeCasa(), 'EU TE CHAMEI TRÊS VEZES!', 'grita', 'Do andar de baixo, sem paciência nenhuma.'),
    'Você desce a escada calçando um pé de tênis e carregando o outro.'
  ],
  ef:{registrar:'Quase perdeu a entrega por oito minutos.', flag:'quase_perdeu_a_perua'},
  escolhas:[
    {texto:'Correr. Só correr.', vai:'c1e_a_praca', ef:{flag:'correu_pra_praca'}},
    {texto:'Voltar e pegar a mochila, mesmo perdendo tempo.',
     vai:'c1e_voltou_pela_mochila'},
    {texto:'"Por que você não me acordou antes?!"', vai:'c1e_por_que_nao_acordou'}
  ]
},

c1e_voltou_pela_mochila:{
  texto:[
    'Você sobe de novo, dois degraus por vez, pega a mochila que já estava pronta desde ontem e desce.',
    'Custou quarenta segundos. Quarenta segundos é muito quando sobram oito minutos, e é nada quando você ia sair de casa pra sempre sem a mochila.',
    d=>fala(nomeCasa(), 'Corre.', null, 'Já com a porta aberta.')
  ],
  ef:{flag:'levou_a_mochila_correndo', moral:2},
  escolhas:[{texto:'Correr.', vai:'c1e_a_praca'}]
},

c1e_por_que_nao_acordou:{
  texto:[
    d=>fala(d.jogador.nome, 'Por que você não me acordou antes?!'),
    'A resposta vem sem pressa nenhuma, o que é pior.',
    d=>fala(nomeCasa(), 'Eu te chamei às sete. Te chamei às nove. Te chamei às onze.'),
    d=>fala(nomeCasa(), 'Na terceira vez você falou "já vou" com a cara no travesseiro e eu resolvi que essa parte era sua.', 'frio'),
    '{casa:Ela|Ele} estende a mochila com uma mão e abre a porta com a outra.',
    d=>fala(nomeCasa(), 'Corre. E não briga comigo às onze e cinquenta e dois.')
  ],
  ef:{flag:'brigou_na_porta', moral:-2},
  escolhas:[
    {texto:'"Desculpa." E correr.', vai:'c1e_a_praca', ef:{moral:4, flag:'pediu_desculpa'}},
    {texto:'Pegar a mochila e sair sem responder.', vai:'c1e_a_praca'}
  ]
},

/* ─── ABERTURA 3: chuva ───────────────────────────────────── */
c1e_chuva_na_praca:{
  texto:[
    'Chove desde ontem à noite, daquele jeito fino que não molha de uma vez e molha tudo no fim.',
    d=>`A perua chega em ${d.jogador.cidade} hoje e não deixa de chegar por chuva: dezenove anos de volta mensal e ninguém nunca ouviu falar de mês cancelado.`,
    'Você olha pela janela e vê três pessoas já paradas na praça, debaixo da marquise da farmácia, com a cara de quem chegou cedo demais e agora tem que fingir que não chegou.',
    d=>fala(nomeCasa(), 'Leva o guarda-chuva.'),
    d=>fala(d.jogador.nome, 'Não precisa.'),
    d=>fala(nomeCasa(), 'Leva o guarda-chuva.', 'frio')
  ],
  ef:{registrar:'Foi pegar a Pokébola debaixo de chuva.'},
  escolhas:[
    {texto:'Levar o guarda-chuva.', vai:'c1e_a_praca',
     ef:{flag:'levou_guarda_chuva', moral:2}},
    {texto:'Sair sem. Chuva não é motivo.', vai:'c1e_a_praca',
     ef:{flag:'sem_guarda_chuva', hp:-2}},
    {texto:'Levar dois: um pra você e um pra quem estiver na fila sem.',
     vai:'c1e_dois_guarda_chuvas'}
  ]
},

c1e_dois_guarda_chuvas:{
  texto:[
    'Você pega dois. O seu e o de cabo quebrado, que abre mas não trava, e que serve se a pessoa segurar a haste com a mão.',
    d=>fala(nomeCasa(), 'Pra quê dois?'),
    d=>fala(d.jogador.nome, 'Tem gente na praça desde cedo.'),
    '{casa:Ela|Ele} não responde. Só olha um pouco mais do que precisava e volta pra pia.'
  ],
  ef:{flag:'levou_dois_guarda_chuvas', moral:5,
      rep:{eixo:'bom', delta:1, motivo:'Levou um guarda-chuva a mais pra fila da entrega'}},
  escolhas:[{texto:'Ir pra praça.', vai:'c1e_a_praca'}]
},

/* ─── A PRAÇA E A FILA ────────────────────────────────────── */
c1e_a_praca:{
  texto:[
    d=>`A praça de ${d.jogador.cidade} tem uma perua estacionada de lado, ocupando duas vagas e a boca do meio-fio, com o portamalas aberto e uma lona esticada por cima.`,
    'A pintura do lado diz LABORATÓRIO DE PESQUISA — PALLET em letra que já foi verde. Embaixo, menor, um número de telefone com um algarismo raspado.',
    'Dentro do portamalas tem uma caixa térmica branca, dessas de pescador, com fita adesiva no fecho.',
    'E do lado da caixa tem um homem de uns cinquenta anos, sentado num banquinho dobrável, com um caderno de capa dura no colo e uma caneta amarrada no caderno com barbante.',
    d=>{
      const n = (d.flags.correu_pra_praca || d.flags.quase_perdeu_a_perua) ? 'Não tem fila nenhuma. Tinha, e acabou.' :
                (d.flags.comeu_antes_da_fila) ? 'Tem duas pessoas na sua frente, e as duas te olham com aquele cálculo rápido de quem está contando posição.' :
                'Tem uma fila de quatro pessoas, e três delas são adultos.';
      return n;
    },
    'Ele levanta a cabeça do caderno antes de você falar qualquer coisa.',
    fala('Célio', 'Nome.')
  ],
  ef:{npc:{nome:'Célio', opiniao:0, memoria:'Entregou a sua primeira Pokébola, de dentro de uma caixa de pescador.'},
      registrar:'A perua do laboratório está na praça.'},
  escolhas:[
    {texto:d=>`"${d.jogador.nome}."`, vai:'c1e_o_caderno'},
    {texto:'Perguntar se ele é o Professor Oak.', vai:'c1e_e_o_professor'},
    {texto:'Olhar a caixa térmica antes de responder.', vai:'c1e_olhou_a_caixa'},
    {texto:'Perguntar se ainda dá tempo.', vai:'c1e_da_tempo',
     cond:d=>!!d.flags.quase_perdeu_a_perua}
  ]
},

c1e_da_tempo:{
  texto:[
    d=>fala(d.jogador.nome, 'Ainda dá tempo?'),
    'Ele olha o relógio de pulso, depois o caderno, depois você.',
    fala('Célio', 'São onze e cinquenta e seis.'),
    fala('Célio', 'Eu fecho o portamalas ao meio-dia porque eu tenho cento e dez quilômetros pra fazer hoje e porque, se eu abrir exceção uma vez, eu abro exceção todo mês em onze cidades.'),
    'Ele fecha o caderno com o dedo dentro, marcando a página.',
    fala('Célio', 'Mas são onze e cinquenta e seis. Fala o nome.', 'baixo')
  ],
  ef:{moral:4},
  escolhas:[
    {texto:d=>`"${d.jogador.nome}."`, vai:'c1e_o_caderno'},
    {texto:'"{Obrigado|Obrigada} por esperar."', vai:'c1e_o_caderno',
     ef:{flag:'agradeceu_o_goro', rep:{eixo:'bom', delta:1, motivo:'Agradeceu a quem não precisava ter esperado'}}}
  ]
},

c1e_e_o_professor:{
  texto:[
    d=>fala(d.jogador.nome, 'O senhor é o Professor Oak?'),
    'Ele ri sem tirar os olhos do caderno. É um riso curto, de piada velha.',
    fala('Célio', 'O Oak tem setenta e um anos e não sai de Pallet desde que operou o joelho.'),
    fala('Célio', 'Eu sou o Célio. Eu dirijo.'),
    d=>fala(d.jogador.nome, 'Só dirige?'),
    fala('Célio', 'Eu dirijo, eu carrego, eu anoto, eu ligo pras famílias, eu levo o que não foi retirado de volta e eu explico pro Oak por que não foi retirado.', 'riso'),
    fala('Célio', 'Então não. Eu não só dirijo. Mas na placa do carro tá escrito motorista, então eu digo motorista.'),
    'Ele finalmente olha pra cima.',
    fala('Célio', 'Nome.')
  ],
  ef:{npc:{nome:'Célio', opiniao:2, memoria:'Explicou, sem reclamar, que faz muito mais do que dirigir.'}},
  escolhas:[
    {texto:d=>`"${d.jogador.nome}."`, vai:'c1e_o_caderno'},
    {texto:'"Onze cidades? Como funciona isso?"', vai:'c1e_a_volta'},
    {texto:'"E o que não foi retirado, acontece muito?"', vai:'c1e_nao_retirado'}
  ]
},

c1e_a_volta:{
  texto:[
    d=>fala(d.jogador.nome, 'Onze cidades? Como é que funciona isso?'),
    'Ele vira o caderno de lado e mostra, sem entregar na sua mão: uma página dividida em colunas a régua, com nomes de cidade em cima e datas embaixo.',
    fala('Célio', 'Saio de Pallet dia um. Viridian dia dois, Pewter dia quatro, Cerulean dia seis.'),
    fala('Célio', 'Vermilion, Lavender, Celadon, Saffron, Fuchsia. Cinnabar eu faço de barco no dia dezesseis e é o dia que eu mais odeio do mês.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('Célio', 'Porque eu enjoo.', 'riso'),
    fall_curto(),
    fala('Célio', 'Volto pra Pallet dia vinte e dois, descarrego, lavo o carro, durmo uma semana e começo de novo.'),
    fala('Célio', 'Dezenove anos. Duzentas e vinte e oito voltas.', 'baixo')
  ],
  ef:{flag:'sabe_da_volta_do_goro', npc:{nome:'Célio', opiniao:3, memoria:'Te mostrou o caderno com a volta inteira de Kanto anotada a régua.'},
      registrar:'Célio faz a volta de Kanto uma vez por mês: onze cidades, vinte e dois dias.'},
  escolhas:[
    {texto:'"E se alguém não estiver na cidade no dia?"', vai:'c1e_nao_retirado'},
    {texto:'"Duzentas e vinte e oito. O senhor conta?"', vai:'c1e_ele_conta'},
    {texto:d=>`"${d.jogador.nome}." Voltar ao assunto.`, vai:'c1e_o_caderno'}
  ]
},

c1e_ele_conta:{
  texto:[
    d=>fala(d.jogador.nome, 'Duzentas e vinte e oito. O senhor conta?'),
    'Ele para de escrever e sorri pro caderno.',
    fala('Célio', 'Conto. Não as voltas: as manhãs como essa.'),
    fala('Célio', 'Duzentas e vinte e oito vezes eu vi alguém abrir a primeira Pokébola. Tem gente que coleciona selo. Eu coleciono isso.', 'riso'),
    fala('Célio', 'E nenhuma foi igual. Tem Bulbasaur que espirra, tem Charmander que acha a chuva uma ofensa pessoal, tem Squirtle que quer entrar no chafariz.'),
    'Ele volta pro caderno com a caneta já pronta.',
    fala('Célio', 'Bora fazer a sua. Nome.')
  ],
  ef:{npc:{nome:'Célio', opiniao:4, memoria:'Te contou que coleciona as manhãs em que alguém abre a primeira Pokébola.'}},
  escolhas:[{texto:d=>`"${d.jogador.nome}."`, vai:'c1e_o_caderno'}]
},

c1e_nao_retirado:{
  texto:[
    d=>fala(d.jogador.nome, 'E se alguém não estiver na cidade no dia?'),
    fala('Célio', 'Aí eu deixo no balcão do Centro, com o nome na etiqueta, e a pessoa pega quando chegar.'),
    fala('Célio', 'Já entreguei Pokébola pra quem chegou correndo de pijama, pra quem chegou de bicicleta sem freio e pra uma menina que veio no colo do avô porque tinha torcido o pé no dia.', 'riso'),
    fala('Célio', 'Ninguém fica sem. Esse é o combinado com o Professor.'),
    'Ele bate a caneta duas vezes no caderno.',
    fala('Célio', 'Mas você tá aqui, que é o melhor jeito. Nome.')
  ],
  ef:{flag:'sabe_do_nr', npc:{nome:'Célio', opiniao:3, memoria:'Te contou das entregas mais engraçadas da volta.'}},
  escolhas:[
    {texto:d=>`"${d.jogador.nome}."`, vai:'c1e_o_caderno'},
    {texto:'"E o laboratório, como é lá dentro?"', vai:'c1e_as_que_voltam'}
  ]
},

c1e_as_que_voltam:{
  texto:[
    d=>fala(d.jogador.nome, 'E o laboratório? Como é lá dentro?'),
    fala('Célio', 'Barulhento.', 'riso'),
    fala('Célio', 'Tem um pátio nos fundos onde os que vão sair no mês que vem ficam juntos. O Professor diz que é pra eles aprenderem a dividir espaço antes de aprender a dividir comida com treinador.'),
    fala('Célio', 'De manhã os Squirtle tomam conta do bebedouro, de tarde os Bulbasaur tomam sol em fila, e os Charmander dormem em cima da tampa do aquecedor.'),
    d=>fala(d.jogador.nome, 'E eles sabem que vão sair?'),
    fala('Célio', 'Sabem que tem alguém esperando. Eu sempre falo o nome da cidade em voz alta quando carrego a caixa.', 'baixo', 'E ri de si mesmo logo depois.')
  ],
  ef:{flag:'sabe_da_prateleira', npc:{nome:'Célio', opiniao:4, memoria:'Te contou do pátio do laboratório, onde os iniciais esperam a saída.'},
      registrar:'No laboratório de Pallet, os iniciais do mês esperam juntos num pátio nos fundos.'},
  escolhas:[{texto:d=>`"${d.jogador.nome}."`, vai:'c1e_o_caderno'}]
},

c1e_olhou_a_caixa:{
  texto:[
    'Você olha a caixa antes de responder qualquer coisa, e ele deixa.',
    'É uma caixa térmica de pescador, branca, com o fecho lacrado com fita. Na tampa, escrito a caneta permanente e refeito por cima várias vezes: NÃO DEIXAR NO SOL.',
    'Dentro deve ter espuma, porque ela não faz barulho de coisa solta quando o vento bate.',
    'Ele espera você terminar de olhar.',
    fala('Célio', 'Três.'),
    d=>fala(d.jogador.nome, 'Três?'),
    fala('Célio', 'Três espécies. As mesmas três pra Kanto inteira, desde antes de você nascer.'),
    fala('Célio', 'Quem tá na lista escolhe aqui, na frente da caixa. Papel nenhum escolhe Pokémon por ninguém.'),
    fala('Célio', 'Nome.')
  ],
  ef:{npc:{nome:'Célio', opiniao:1, memoria:'Deixou você olhar a caixa antes de falar qualquer coisa.'}},
  escolhas:[
    {texto:d=>`"${d.jogador.nome}."`, vai:'c1e_o_caderno'},
    {texto:'"E quem tá na lista e não aparece?"', vai:'c1e_nao_retirado'}
  ]
},

c1e_o_caderno:{
  texto:[
    d=>`Ele passa o dedo pela coluna da página até achar, e acha rápido, porque a lista de ${d.jogador.cidade} deste mês tem três linhas.`,
    d=>fala('Célio', `${d.jogador.nome}. Inscrição de fevereiro, assinada junto com ${casaCompleto()}, que responde por você.`),
    'Ele vira o caderno pra você e aponta uma linha com a caneta ainda amarrada no barbante.',
    'A linha tem o seu nome, a data, e uma coluna vazia no fim, com ESPÉCIE escrito no alto da página.',
    fala('Célio', 'Essa eu preencho quando você escolher. O resto confere?'),
    'É estranho ver o seu nome numa lista de outra pessoa, esperando uma palavra que ainda não existe.'
  ],
  ef:{flag:'conferiu_o_caderno'},
  escolhas:[
    {texto:'"Confere."', vai:'c1e_abre_a_caixa', ef:{flag:'confirmou_na_hora'}},
    {texto:'"E se eu escolher errado?"', vai:'c1e_da_pra_trocar'},
    {texto:'"Quem assinou junto comigo?" Olhar a assinatura de perto.',
     vai:'c1e_a_assinatura'},
    {texto:'Assinar embaixo sem falar nada.', vai:'c1e_assinou_calado',
     ef:{flag:'assinou_calado'}}
  ]
},

c1e_da_pra_trocar:{
  texto:[
    d=>fala(d.jogador.nome, 'E se eu escolher errado?'),
    'Ele não parece surpreso. Parece um homem que ouve essa pergunta em toda cidade.',
    fala('Célio', 'Não tem errado. Tem o que você escolheu e o que você fez com isso depois.'),
    fala('Célio', 'Já vi gente escolher pelo tipo, pela cor, pela letra da etiqueta. Uma menina em Lavender escolheu pelo barulho que a Pokébola fazia chacoalhando.'),
    fala('Célio', 'Dos três já saiu campeão e já saiu Pokémon de quintal. Depende de quem leva.'),
    'Uma pausa.',
    fala('Célio', 'E pensar demais atrasa a fila, e a fila é de gente que acordou cedo.', 'riso')
  ],
  ef:{npc:{nome:'Célio', opiniao:1, memoria:'Te disse que não tem escolha errada, tem o que você faz com ela depois.'}},
  escolhas:[
    {texto:'"Então abre."', vai:'c1e_abre_a_caixa'},
    {texto:'"Então eu escolho sem pensar muito."',
     vai:'c1e_abre_a_caixa', ef:{flag:'assumiu_a_escolha', moral:4}}
  ]
},

c1e_a_assinatura:{
  texto:[
    'Você chega mais perto do caderno pra ver a assinatura de quem assinou junto.',
    d=>`É a letra de ${casaCompleto()}, e é uma letra que você conhece de bilhete de geladeira e de caderno de escola assinado às pressas na porta da sala.`,
    'Só que aqui ela está diferente. Está devagar. Cada letra separada, com força na caneta, como quem escreve sabendo que aquilo vai ficar guardado.',
    'A data do lado é de fevereiro. Faz três meses.',
    'Três meses que essa assinatura existe e você nunca viu.',
    fala('Célio', 'Muita gente para nessa parte.', 'baixo'),
    d=>fala(d.jogador.nome, 'Todo mundo?'),
    fala('Célio', 'Os que têm quem assine.')
  ],
  ef:{moral:8, flag:'viu_a_assinatura',
      npc:{nome:'Célio', opiniao:2, memoria:'Ficou quieto do lado enquanto você olhava a assinatura de casa no formulário.'}},
  escolhas:[
    {texto:'"Confere." E assinar embaixo.', vai:'c1e_abre_a_caixa'},
    {texto:'"Os que têm quem assine. E os outros?"', vai:'c1e_os_outros'}
  ]
},

c1e_os_outros:{
  texto:[
    d=>fala(d.jogador.nome, 'E os outros? Os que não têm quem assine.'),
    'Ele mexe no barbante da caneta.',
    fala('Célio', 'Assina um tutor. Assina um diretor de escola. Assina o líder de ginásio, já vi.'),
    fala('Célio', 'Uma vez em Saffron assinou uma enfermeira que tinha conhecido o menino naquela semana.'),
    fala('Célio', 'O papel não pergunta se a pessoa te ama. Pergunta se ela é responsável por você.', 'baixo'),
    fala('Célio', 'São coisas diferentes e às vezes é a mesma pessoa e às vezes não é.'),
    'Ele endireita as costas no banquinho.',
    fala('Célio', 'No seu é a mesma. Aproveita.')
  ],
  ef:{moral:5, flag:'sabe_de_quem_assina',
      npc:{nome:'Célio', opiniao:4, memoria:'Te disse que o formulário pergunta quem é responsável, não quem te ama.'},
      rep:{eixo:'bom', delta:1, motivo:'Perguntou pelos que não têm quem assine'}},
  escolhas:[{texto:'Assinar.', vai:'c1e_abre_a_caixa'}]
},

c1e_assinou_calado:{
  texto:[
    'Você pega a caneta amarrada no barbante e assina embaixo, sem falar nada.',
    'A caneta falha na primeira letra e você faz por cima.',
    'Ele olha a assinatura, confere com o caderno, e faz um tracinho na margem.',
    fala('Célio', 'Pronto.'),
    'Nenhum dos dois fala por uns quatro segundos, e não é desconfortável.',
    fala('Célio', 'Tem gente que fala muito nessa hora e tem gente que não fala nada. As duas coisas são normais.', 'baixo')
  ],
  ef:{npc:{nome:'Célio', opiniao:1, memoria:'Assinou sem falar nada, e ele respeitou o silêncio.'}},
  escolhas:[{texto:'Esperar ele abrir a caixa.', vai:'c1e_abre_a_caixa'}]
},

c1e_abre_a_caixa:{
  texto:[
    'Ele corta a fita do fecho com a unha do polegar e abre a tampa devagar, de propósito, como quem gosta dessa parte.',
    'Dentro tem espuma cinza com três fileiras de Pokébolas, e em cima de cada fileira uma etiqueta escrita a caneta: BULBASAUR, CHARMANDER, SQUIRTLE.',
    fala('Célio', 'Ninguém escolhe olhando Pokébola fechada. Espera aí.'),
    'Ele pega uma de cada fileira e joga as três pro alto, uma atrás da outra.',
    'Três luzes vermelhas descem na lona do portamalas e viram três Pokémon.',
    'O Bulbasaur sai já esticando as folhas do bulbo pro sol, como quem acabou de acordar de um cochilo bom.',
    'O Charmander sai sacudindo a cauda, e a chama da ponta fica mais alta quando ele vê você.',
    'O Squirtle sai, olha o chafariz da praça, olha pra você, e olha pro chafariz de novo, com uma intenção muito clara.',
    fala('Célio', 'Pronto. Agora sim. Com calma: qual deles?', 'riso')
  ],
  escolhas: escolhasDeInicial(n => `O ${n}.`, 'c1e_escolheu')
},

c1e_escolheu:{
  texto:[
    d=>`O ${especieReservada(d)} percebe antes de você terminar de apontar. Vem até a beira da lona e fica ali, esperando, como se fosse ele que tivesse escolhido.`,
    'Os outros dois voltam pras Pokébolas num raio vermelho, e o Célio guarda as duas na espuma com cuidado, uma em cada fileira.',
    d=>`Ele escreve ${especieReservada(d).toUpperCase()} na coluna vazia do caderno, em letra de forma, e amarra no fecho da Pokébola uma etiqueta com o seu nome e a data de hoje.`,
    fala('Célio', 'Boa escolha. E eu falo isso pra todo mundo, mas hoje é verdade.', 'riso'),
    fala('Célio', 'Ele vai crescer com você. Cuida dele que ele te leva longe.')
  ],
  ef:{flag:'aviso_do_goro'},
  escolhas:[
    {texto:'"Pode deixar." Estender a mão.', vai:'c1e_recebeu',
     ef:{flag:'prometeu_ficar', moral:8}},
    {texto:'"E se eu não souber o que fazer?"', vai:'c1e_nao_sei_ainda'},
    {texto:'Pegar a Pokébola sem responder, sorrindo.', vai:'c1e_recebeu'},
    {texto:'"O senhor lembra de todos que entregou?"', vai:'c1e_ja_devolveu'}
  ]
},

c1e_nao_sei_ainda:{
  texto:[
    d=>fala(d.jogador.nome, 'E se eu não souber o que fazer?'),
    'Ele ri de um jeito que enruga o olho inteiro.',
    fala('Célio', 'Ninguém sabe no primeiro dia. Nem eu sabia, e eu já tinha quarenta anos.'),
    fala('Célio', 'Você aprende junto com ele. É pra isso que vocês são dois.'),
    fala('Célio', 'Pega.')
  ],
  ef:{moral:6, npc:{nome:'Célio', opiniao:3, memoria:'Te disse que ninguém sabe no primeiro dia, e que vocês aprendem juntos.'}},
  escolhas:[{texto:'Pegar a Pokébola.', vai:'c1e_recebeu'}]
},

c1e_ja_devolveu:{
  texto:[
    d=>fala(d.jogador.nome, 'O senhor lembra de todos que entregou?'),
    fala('Célio', 'Da maioria. Pelo Pokémon, não pelo nome da pessoa.', 'riso'),
    fala('Célio', 'Tem um Charmander de Vermilion de oito anos atrás que hoje é Charizard e passa voando por cima da perua quando eu chego. O dono acena lá de cima.'),
    fala('Célio', 'E um Squirtle de Lavender que eu entreguei pra uma menina tímida. Ela é líder de equipe de resgate hoje.'),
    'Ele olha pra você e pro seu Pokémon, e você entende que acabou de entrar na lista dele.',
    fala('Célio', 'Me dá notícia de vez em quando. Eu gosto de saber no que deu.')
  ],
  ef:{flag:'sabe_dos_onze', npc:{nome:'Célio', opiniao:4, memoria:'Te contou de quem ele entregou e virou gente grande.'},
      registrar:'Célio lembra de cada inicial que entregou, e pede notícia.'},
  escolhas:[{texto:'Pegar a Pokébola.', vai:'c1e_recebeu'}]
},

c1e_recebeu:{
  texto:[
    'A Pokébola é mais leve do que você imaginava a vida inteira, e essa é a primeira coisa que você aprende hoje.',
    'Ele fecha a caixa, passa a fita por cima do corte, e desenha uma estrelinha do lado do seu nome no caderno.',
    fala('Célio', 'Ele já tá fora, então deixa ele te conhecer antes de guardar. Primeira impressão é dos dois lados.', 'riso')
  ],
  ef:{executar:d => entregarInicial(d)},
  escolhas:[
    {texto:'Olhar o Pokémon antes de falar qualquer coisa.', vai:'c1e_primeiro_olhar'},
    {texto:'Agachar na altura dele.', vai:'c1e_agachou'},
    {texto:'Chamar pelo nome da espécie, alto, só pra ouvir como soa.',
     vai:'c1e_chamou_alto'}
  ]
},

c1e_primeiro_olhar:{
  texto:[
    d=>{
      const p = d.time[d.time.length-1] || d.time[0];
      return p ? `${nomeExib(p)} aparece em cima da lona do portamalas e fica parado, olhando a praça inteira antes de olhar pra você. Isso demora uns bons oito segundos.`
               : 'A luz sai da Pokébola e vira Pokémon em cima da lona.';
    },
    'Depois ele olha pra você. E continua olhando, do jeito que Pokémon olha quando está decidindo uma coisa.',
    'E aí ele vem até você e encosta a cabeça na sua mão, e fica.',
    fala('Célio', 'Pronto. Escolheu de volta.', 'riso'),
    d=>fala(d.jogador.nome, 'Como o senhor sabe?'),
    fala('Célio', 'Olhou a praça inteira e voltou pra você. Pokémon curioso e que volta é o melhor tipo que tem.')
  ],
  ef:{moral:4, flag:'olhou_a_praca_primeiro'},
  escolhas:[
    {texto:'Agradecer e ir.', vai:'c1e_despedida_goro',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Agradeceu a quem entregou'}}},
    {texto:'"Tem mais alguma coisa que eu preciso saber?"', vai:'c1e_mais_alguma_coisa'}
  ]
},

c1e_agachou:{
  texto:[
    'Você agacha na altura dele antes de qualquer outra coisa, porque foi o que o seu corpo fez sem consultar você.',
    d=>{
      const p = d.time[d.time.length-1] || d.time[0];
      return p ? `${nomeExib(p)} chega perto do seu joelho, encosta, e sai de novo. Depois volta e encosta mais tempo.`
               : 'Ele chega perto do seu joelho e encosta.';
    },
    d=>d.flags.quase_perdeu_a_perua
      ? 'Do outro lado da praça, uma moça esperando o ônibus faz um barulho com a boca, do tipo que gente faz quando vê uma coisa fofa e se arrepende de ter feito barulho.'
      : 'Atrás de você alguém da fila faz um barulho com a boca, do tipo que gente faz quando vê uma coisa fofa e se arrepende de ter feito barulho.',
    fala('Célio', 'Essa parte é sempre a melhor e eu vejo ela onze vezes por mês e não enjoei ainda.', 'riso')
  ],
  ef:{moral:8, flag:'agachou_na_praca'},
  escolhas:[
    {texto:'Agradecer e ir.', vai:'c1e_despedida_goro',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Agradeceu a quem entregou'}}},
    {texto:'"Tem mais alguma coisa que eu preciso saber?"', vai:'c1e_mais_alguma_coisa'}
  ]
},

c1e_chamou_alto:{
  texto:[
    d=>{
      const p = d.time[d.time.length-1] || d.time[0];
      return p ? fala(d.jogador.nome, `${(p.nome||'').toUpperCase()}!`, 'grita', 'Alto demais pra uma praça no meio do dia.')
               : fala(d.jogador.nome, 'EI!', 'grita');
    },
    'A praça inteira olha. As pessoas da fila olham. Uma senhora na janela do segundo andar olha.',
    'E o Pokémon, que é o único que tinha motivo pra se assustar, não se assusta: levanta a cabeça na sua direção como quem responde.',
    fala('Célio', 'Ó.'),
    fala('Célio', 'Atendeu de primeira. Isso não é sempre.', 'riso'),
    'Você fica vermelh{o|a} e não consegue parar de sorrir ao mesmo tempo, que é uma combinação que não deveria ser possível.'
  ],
  ef:{moral:10, flag:'gritou_na_praca'},
  escolhas:[
    {texto:'Agradecer e ir.', vai:'c1e_despedida_goro',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Agradeceu a quem entregou'}}},
    {texto:'"Tem mais alguma coisa que eu preciso saber?"', vai:'c1e_mais_alguma_coisa'}
  ]
},

c1e_mais_alguma_coisa:{
  texto:[
    d=>fala(d.jogador.nome, 'Tem mais alguma coisa que eu preciso saber?'),
    'Ele pensa de verdade antes de responder, o que não era obrigado.',
    fala('Célio', 'Três coisas, e nenhuma delas é sobre batalha.'),
    fala('Célio', 'Primeira: licença. Sem licença você não é treinador, você é uma pessoa andando com um Pokémon. Centro Pokémon, balcão, formulário, fila. Faz isso hoje.'),
    fala('Célio', 'Segunda: ele come de três em três horas nas primeiras semanas e depois estabiliza sozinho. Não force.'),
    'Uma pausa mais longa que as outras.',
    fala('Célio', 'Terceira: ele não sabe que você é novo nisso. Pra ele você já é a pessoa dele desde agorinha, com currículo e tudo.', 'baixo'),
    fala('Célio', 'Então seja. Você vai aprendendo no caminho, e ele vai junto.')
  ],
  ef:{flag:'conselho_do_goro', moral:5,
      npc:{nome:'Célio', opiniao:5, memoria:'Te deu três conselhos e nenhum deles era sobre batalha.'},
      registrar:'Célio: licença hoje, comida de três em três horas, e ele já acha que você sabe o que está fazendo.'},
  escolhas:[
    {texto:'"{Obrigado|Obrigada}." De verdade.', vai:'c1e_despedida_goro',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Ouviu até o fim quem não precisava ter falado'}, moral:4}},
    {texto:'"Por que o senhor tá me falando isso?"', vai:'c1e_por_que_fala'}
  ]
},

c1e_por_que_fala:{
  texto:[
    d=>fala(d.jogador.nome, 'Por que o senhor tá me falando isso? Não é o seu trabalho.'),
    'Ele arruma o banquinho dobrável, que não precisava ser arrumado.',
    fala('Célio', 'Não é.'),
    fala('Célio', 'Mas quando eu saí de casa, quem me entregou o meu Pokémon me deu dez minutos de conselho na calçada, e eu uso até hoje.'),
    fala('Célio', 'Agora é a minha vez de dar. Custa dois minutos por pessoa e eu tenho dois minutos.', 'riso')
  ],
  ef:{moral:6, flag:'historia_de_noventa_e_um',
      npc:{nome:'Célio', opiniao:6, memoria:'Te contou por que ele fala com todo mundo desde 1991.'}},
  escolhas:[
    {texto:'"{Obrigado|Obrigada}."', vai:'c1e_despedida_goro',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Agradeceu os dois minutos de quem não devia nada'}}}
  ]
},

c1e_despedida_goro:{
  texto:[
    'Ele guarda o caderno numa sacola de pano, dobra o banquinho, fecha o portamalas e bate duas vezes na lataria, que deve ser mania.',
    d=>{
      /* a mesma volta do mural e do PokéNav (agenda.js) */
      const id = Object.keys(LOCAIS).find(k => LOCAIS[k].nome === d.jogador.cidade);
      const q = DIA_DA_PERUA[id] || 4;
      return fala('Célio', `Eu volto dia ${q} do mês que vem. Aqui é sempre dia ${q}. Se você ainda estiver na cidade, aparece. Se não estiver, é porque a estrada tá boa.`, 'riso');
    },
    'Ele abre a porta do motorista e para antes de entrar.',
    d=>fala('Célio', `Ah. Anota o meu número, vai. Todo mundo que eu entrego tem.`),
    'Ele dita um número de sete dígitos de cor, devagar, do jeito de quem já ditou esse número mil vezes.',
    d=>fala('Célio', 'Liga contando quando ele evoluir. Eu quero saber.', 'riso')
  ],
  ef:{executar:d => {
        Estado.marcar('numero_do_goro');
        Estado.lembrarNPC('Célio', {opiniao:2, memoria:'Te deu o número dele no dia da entrega.'});
        return [{tipo:'info', texto:'Número de Célio anotado. Falta um PokéNav pra guardar.'}];
      }},
  escolhas:[
    {texto:'Voltar pra casa com ele na Pokébola.', vai:'c1_mochila'},
    {texto:'Voltar pra casa com ele andando do lado.', vai:'c1e_voltou_a_pe',
     ef:{moral:5, flag:'voltou_a_pe_com_ele'}},
    {texto:'Ficar na praça mais um pouco antes de voltar.', vai:'c1e_ficou_na_praca'}
  ]
},

c1e_voltou_a_pe:{
  texto:[
    'Você não guarda na Pokébola. Você volta andando, e ele vem do lado, e a diferença entre as duas coisas é a jornada inteira.',
    d=>{
      const p = d.time[d.time.length-1] || d.time[0];
      return p ? `${nomeExib(p)} para duas vezes no caminho: uma pra cheirar um portão e uma sem motivo nenhum aparente.`
               : 'Ele para duas vezes no caminho, e uma delas sem motivo nenhum.';
    },
    'Duas pessoas na rua olham. Uma delas você conhece desde sempre e ela não fala nada, só faz que sim com a cabeça.',
    d=>`${d.jogador.cidade} inteira vai saber antes do almoço, e não tem nada que você possa fazer sobre isso.`
  ],
  ef:{registrar:'Voltou da praça a pé, com ele do lado.'},
  escolhas:[{texto:'Entrar em casa.', vai:'c1_mochila'}]
},

c1e_ficou_na_praca:{
  texto:[
    'Você senta no banco da praça e fica olhando a perua sumir na curva.',
    'O motor faz um barulho que não é de carro novo, e o barulho continua audível uns quinze segundos depois de o carro sumir.',
    d=>{
      const p = d.time[d.time.length-1] || d.time[0];
      return p ? `${nomeExib(p)} sobe no banco do seu lado sem pedir licença, o que é a primeira coisa que ${pron(p).ele} faz por conta própria.`
               : 'Ele sobe no banco do seu lado sem pedir licença.';
    },
    'A cidade começa a acordar em volta: a padaria abre, um Growlithe late, alguém arrasta uma cadeira num quintal.',
    'Daqui a uma hora você sai daqui e não volta tão cedo. Agora não. Agora é só um banco de praça com duas coisas sentadas nele.'
  ],
  ef:{moral:6, flag:'ficou_no_banco_da_praca'},
  escolhas:[{texto:'Levantar e ir pra casa.', vai:'c1_mochila'}]
}

  });
})();

/* uma pausa curta que aparece no meio de fala longa */
function fall_curto(){ return 'Ele deixa a piada respirar e depois continua.'; }
