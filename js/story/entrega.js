/* ============================================================
   A ENTREGA — quem não nasceu em Pallet não recebe da mão do
   Professor. Recebe da mão de quem dirige a perua dele.

   Célio Sampaio faz a volta de Kanto uma vez por mês. Onze
   paradas, vinte e dois dias de estrada, uma caixa térmica com
   três bolas lacradas e um caderno de capa dura com os nomes de
   quem pediu. Ele faz isso há dezenove anos.
   ============================================================ */

const ABERTURAS_ENTREGA = ['c1e_de_madrugada', 'c1e_quase_perdeu', 'c1e_chuva_na_praca'];

/* nome bonito da espécie reservada, sem entregar a bola antes da hora */
function especieReservada(d){
  const dex = (d.entrega && d.entrega.dex) || 1;
  return (DEX[dex] || {}).nome || 'o seu';
}

/* a bola sai da caixa e vira bicho */
function entregarInicial(d){
  const dex = (d.entrega && d.entrega.dex) || 1;
  const p = criarPokemon(dex, 5, {
    moral: 80, naturezaVista: true,
    historia: `Saiu da caixa térmica do Célio, em ${d.jogador.cidade}, numa manhã de ${['março','abril','maio','junho'][Dados.entre(0,3)]}.`
  });
  Estado.adicionar(p);
  Estado.j.inicialDex = p.dex;
  if (typeof iniciarRival === 'function') iniciarRival();
  d.flags.espera_o_assistente = false;
  Estado.marcar('recebeu_do_goro');
  Estado.registrar(`${Estado.j.nome} recebeu ${p.nome} das mãos de Célio Sampaio, em ${d.jogador.cidade}.`);
  return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv 5, ${p.natureza}) saiu da bola.`}];
}

/* Em Pallet a bola sai da mão do Professor, na rua, na manhã da saída */
function entregarDoProfessor(d){
  const dex = (d.entrega && d.entrega.dex) || 1;
  const p = criarPokemon(dex, 5, {
    moral: 80, naturezaVista: true,
    historia: 'Entregue pelo Professor, na rua de Pallet, na manhã em que você saiu de casa.'
  });
  Estado.adicionar(p);
  Estado.j.inicialDex = p.dex;
  if (typeof iniciarRival === 'function') iniciarRival();
  d.flags.espera_o_professor = false;
  Estado.marcar('recebeu_do_professor');
  Estado.registrar(`${Estado.j.nome} recebeu ${p.nome} das mãos do Professor, em Pallet.`);
  return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv 5, ${p.natureza}) saiu da bola.`}];
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
    'O Professor está parado no meio da rua, na frente do portão do laboratório, de jaleco por cima de uma camisa de dormir, com uma bola vermelha e branca numa mão e um caderno debaixo do braço.',
    fala('o Professor', 'Eu disse oito horas.', null, 'Ele olha o relógio de pulso sem pressa nenhuma.'),
    fala('o Professor', 'São oito e quatro. Tudo bem. Eu também me atrasei no meu.'),
    d=>`A etiqueta colada na bola tem o seu nome escrito à mão, e embaixo, menor, com a mesma caneta: ${especieReservada(d)}.`,
    d=>fala('o Professor', `${especieReservada(d)}. Você pediu em fevereiro e não mudou de ideia até hoje. Eu reparo nessas coisas.`),
    'Ele te dá a bola. Não tem discurso, não tem fita, não tem foto. Só a bola passando de uma mão pra outra, no meio da rua, com um Pidgey olhando do fio.',
    d=>{ const p = (d.time || []).slice(-1)[0];   // o último que entrou: quem ficou com o bicho da vizinha já tem um
         return p ? `A bola abre na sua mão antes de você decidir abrir. ${nomeExib(p)} sai, olha primeiro pra ele, depois pra você, e fica olhando pra você.`
                  : 'A bola pesa menos do que parecia.'; },
    fala('o Professor', 'Ele vai atrás de você porque você é quem está na frente dele agora. O resto é com vocês dois.', 'baixo'),
    'Ele anota alguma coisa no caderno, fecha, e volta pro laboratório sem se despedir, do jeito de quem vai estar lá quando você voltar.'
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
    d=>`A perua chega em ${d.jogador.cidade} hoje. Chega uma vez por mês, fica até o meio-dia e vai embora, e se ela for embora com a sua bola dentro você espera mais trinta dias.`,
    'Você se veste no escuro pra não acordar ninguém e falha na terceira gaveta.',
    d=>fala(nomeCasa(), 'Ainda não amanheceu.', 'baixo', 'A voz vem do corredor, e não estava dormindo.'),
    d=>fala(d.jogador.nome, 'Eu quero ser o primeiro.'),
    d=>fala(nomeCasa(), 'Você vai ser {o primeiro|a primeira}. Ninguém mais nessa rua pediu.'),
    'Silêncio dos dois lados da porta.',
    d=>fala(nomeCasa(), 'Come alguma coisa antes. Eu não vou deixar você sair daqui em jejum pra pegar bicho.', 'baixo')
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
    d=>fala(d.jogador.nome, 'A senhora pediu uma? Quando tinha a minha idade.'),
    'A porta do corredor abre o suficiente pra passar um rosto.',
    d=>fala(nomeCasa(), 'Pedi.'),
    d=>fala(nomeCasa(), 'Em setembro. Eu tinha dezesseis e o Célio era magro e tinha cabelo.', 'riso'),
    d=>fala(d.jogador.nome, 'E aí?'),
    d=>fala(nomeCasa(), 'E aí minha mãe adoeceu em outubro e eu cancelei em novembro, e em dezembro eu já estava trabalhando.'),
    '{casa:Ela|Ele} fala isso do jeito de quem conta uma coisa que já pensou até o fim, muitas vezes, e já parou de doer.',
    d=>fala(nomeCasa(), 'Não é história triste. É história comum. A cidade inteira tem uma dessas.', 'baixo'),
    d=>fala(nomeCasa(), 'Por isso eu acordei. Vai lá.')
  ],
  ef:{moral:6, flag:'sabe_da_bola_cancelada',
      presagio:'Você vai passar a jornada inteira sem perguntar o nome da espécie que {casa:ela|ele} tinha pedido, e um dia vai perguntar.'},
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
    d=>fala(nomeCasa(), 'Eu tenho poucas ferramentas e essa funciona. Vai pegar a sua bola.')
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
  ef:{registrar:'Foi pegar a bola debaixo de chuva.'},
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
  ef:{npc:{nome:'Célio', opiniao:0, memoria:'Entregou a sua primeira bola, de dentro de uma caixa de pescador.'},
      registrar:'A perua do laboratório está na praça.'},
  escolhas:[
    {texto:d=>`"${d.jogador.nome}."`, vai:'c1e_o_caderno'},
    {texto:'Perguntar se ele é o Professor Carvalho.', vai:'c1e_e_o_professor'},
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
    d=>fala(d.jogador.nome, 'O senhor é o Professor Carvalho?'),
    'Ele ri sem tirar os olhos do caderno. É um riso curto, de piada velha.',
    fala('Célio', 'O Carvalho tem setenta e um anos e não sai de Pallet desde que operou o joelho.'),
    fala('Célio', 'Eu sou o Célio. Eu dirijo.'),
    d=>fala(d.jogador.nome, 'Só dirige?'),
    fala('Célio', 'Eu dirijo, eu carrego, eu anoto, eu ligo pras famílias, eu levo o que não foi retirado de volta e eu explico pro Carvalho por que não foi retirado.', 'riso'),
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
    'Ele para de escrever.',
    fala('Célio', 'Conto.'),
    fala('Célio', 'Não é orgulho, não. É que eu conto quantas eu ainda vou fazer.', 'baixo'),
    fala('Célio', 'Eu tenho cinquenta e três anos e o carro tem vinte e seis. Um de nós dois vai parar primeiro e eu já apostei em qual.'),
    'Ele volta pro caderno como quem volta pra uma coisa que é mais confortável que a conversa.',
    fala('Célio', 'Nome.')
  ],
  ef:{npc:{nome:'Célio', opiniao:4, memoria:'Contou, sem drama nenhum, que conta quantas voltas ainda vai conseguir fazer.'},
      presagio:'Você vai reencontrar essa perua em outra cidade, e vai reparar no barulho do motor de um jeito que hoje você não ia reparar.'},
  escolhas:[{texto:d=>`"${d.jogador.nome}."`, vai:'c1e_o_caderno'}]
},

c1e_nao_retirado:{
  texto:[
    d=>fala(d.jogador.nome, 'E o que não é retirado? Acontece muito?'),
    'Ele demora um pouco pra responder, e a demora é a resposta.',
    fala('Célio', 'Três por volta. Às vezes quatro.'),
    fala('Célio', 'A pessoa pede em janeiro, muda de ideia em fevereiro e não avisa, porque avisar é constrangedor e não aparecer não é.'),
    fala('Célio', 'Aí eu fico aqui até meio-dia com o nome escrito e a bola lacrada, e depois eu escrevo NR do lado do nome e vou embora.'),
    d=>fala(d.jogador.nome, 'NR?'),
    fala('Célio', 'Não retirado.'),
    fala('Célio', 'É a sigla mais triste que eu escrevo e eu escrevo umas quarenta por ano.', 'baixo'),
    'Ele bate a caneta duas vezes no caderno, mudando de assunto sozinho.',
    fala('Célio', 'Você tá aqui. Isso já resolve o seu. Nome.')
  ],
  ef:{flag:'sabe_do_nr', npc:{nome:'Célio', opiniao:3, memoria:'Te contou o que significa NR no caderno dele.'},
      presagio:'Quarenta por ano, dezenove anos. Em algum lugar de Kanto tem setecentas e poucas pessoas que quase saíram de casa.'},
  escolhas:[
    {texto:d=>`"${d.jogador.nome}."`, vai:'c1e_o_caderno'},
    {texto:'"E as bolas que voltam, vão pra onde?"', vai:'c1e_as_que_voltam'}
  ]
},

c1e_as_que_voltam:{
  texto:[
    d=>fala(d.jogador.nome, 'E as que voltam? Vão pra onde?'),
    fala('Célio', 'Voltam pro laboratório e esperam.'),
    fala('Célio', 'Tem uma prateleira lá que o Carvalho chama de estoque e que todo mundo que trabalha lá chama de outra coisa.'),
    d=>fala(d.jogador.nome, 'De quê?'),
    'Ele olha pra você medindo se vale a pena dizer.',
    fala('Célio', 'De "os que ninguém quis".', 'baixo'),
    fala('Célio', 'E não é verdade, porque alguém quis. Alguém quis por escrito e desistiu depois. Mas o nome pegou e ninguém corrige mais.')
  ],
  ef:{flag:'sabe_da_prateleira', npc:{nome:'Célio', opiniao:4, memoria:'Te contou o apelido da prateleira dos que ninguém foi buscar.'},
      registrar:'No laboratório de Pallet tem uma prateleira que chamam de "os que ninguém quis".',
      presagio:'Você vai ouvir esse nome de novo, e da segunda vez vai ser sobre um bicho específico.'},
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
    fala('Célio', 'Três bolas. Uma é sua, se você for quem eu acho que você é.'),
    fala('Célio', 'As outras duas são de gente dessa cidade que pediu antes de você. Uma vem buscar hoje. A outra eu não sei.'),
    fala('Célio', 'Nome.')
  ],
  ef:{npc:{nome:'Célio', opiniao:1, memoria:'Deixou você olhar a caixa antes de falar qualquer coisa.'}},
  escolhas:[
    {texto:d=>`"${d.jogador.nome}."`, vai:'c1e_o_caderno'},
    {texto:'"Como assim não sabe?"', vai:'c1e_nao_retirado'}
  ]
},

c1e_o_caderno:{
  texto:[
    d=>`Ele passa o dedo pela coluna da página até achar, e acha rápido, porque a lista de ${d.jogador.cidade} deste mês tem três linhas.`,
    d=>fala('Célio', `${d.jogador.nome}. Pedido em formulário de fevereiro, assinado por ${casaCompleto()}, porque você era menor de idade quando assinou e agora não é mais.`),
    'Ele vira o caderno pra você e aponta uma linha com a caneta ainda amarrada no barbante.',
    d=>{
      const esp = especieReservada(d);
      return `A linha tem o seu nome, a data, e uma palavra escrita em letra de forma: ${esp.toUpperCase()}.`;
    },
    fala('Célio', 'Confere?'),
    'É estranho ver uma escolha que você fez há meses virar uma linha numa lista de outra pessoa.'
  ],
  ef:{flag:'conferiu_o_caderno'},
  escolhas:[
    {texto:'"Confere."', vai:'c1e_abre_a_caixa', ef:{flag:'confirmou_na_hora'}},
    {texto:'"Dá pra trocar?"', vai:'c1e_da_pra_trocar'},
    {texto:'"Quem assinou junto comigo?" Olhar a assinatura de perto.',
     vai:'c1e_a_assinatura'},
    {texto:'Assinar embaixo sem falar nada.', vai:'c1e_assinou_calado',
     ef:{flag:'assinou_calado'}}
  ]
},

c1e_da_pra_trocar:{
  texto:[
    d=>fala(d.jogador.nome, 'Dá pra trocar?'),
    'Ele não parece surpreso. Parece um homem que ouve essa pergunta em toda cidade.',
    fala('Célio', 'Dá pra cancelar. Trocar não dá.'),
    fala('Célio', 'As três bolas dessa caixa têm nome. Se eu te der a do outro, o outro chega aqui às onze e eu tenho que explicar uma coisa que não tem explicação.'),
    fala('Célio', 'Se você cancelar, eu escrevo NR, levo de volta e você entra na lista de novo no mês que vem. Aí você escolhe outra.'),
    'Uma pausa.',
    fala('Célio', 'Mês que vem é dia quatro, e é chato, e eu não recomendo.', 'riso'),
    d=>fala('Célio', `A que tá aqui escrita é ${especieReservada(d)}. Confere?`)
  ],
  ef:{npc:{nome:'Célio', opiniao:1, memoria:'Explicou com paciência por que não dá pra trocar a bola de alguém pela de outro.'}},
  escolhas:[
    {texto:'"Confere."', vai:'c1e_abre_a_caixa'},
    {texto:'"Então eu levo essa. Foi eu que escolhi em fevereiro."',
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
      npc:{nome:'Célio', opiniao:2, memoria:'Ficou quieto do lado enquanto você olhava a assinatura de casa no formulário.'},
      presagio:'Em algum capítulo dessa jornada você vai assinar alguma coisa sozinh{o|a} e vai lembrar de fevereiro.'},
  escolhas:[
    {texto:'"Confere." E assinar embaixo.', vai:'c1e_abre_a_caixa'},
    {texto:'"Os que têm quem assine. E os outros?"', vai:'c1e_os_outros'}
  ]
},

c1e_os_outros:{
  texto:[
    d=>fala(d.jogador.nome, 'E os outros? Os que não têm quem assine.'),
    'Ele mexe no barbante da caneta.',
    fala('Célio', 'Assina um tutor. Assina um diretor de escola. Assina o padre, já vi.'),
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
    'Ele corta a fita do fecho com a unha do polegar, de um jeito treinado que não estraga a fita inteira, porque a fita vai fechar a caixa de novo daqui a pouco.',
    'Dentro tem espuma cinza recortada em três buracos redondos. Dois buracos estão cheios.',
    'Ele tira a bola do buraco do meio com as duas mãos, não porque seja pesada, mas porque é assim que se pega uma coisa que é de outra pessoa.',
    d=>`Tem uma etiqueta de papel presa no fecho com barbante. Na etiqueta está escrito o seu nome, a data de fevereiro, e ${especieReservada(d)}.`,
    fala('Célio', 'Olha só uma coisa antes.'),
    fala('Célio', 'Isso aqui não é um prêmio e não é um presente. É um pedido que foi aprovado.'),
    fala('Célio', 'Se em dois meses você decidir que não era isso, você devolve num Centro Pokémon e ninguém vai te chamar de nada. Eu levo de volta e escrevo o que tiver que escrever.'),
    fala('Célio', 'Mas se você for ficar, fica de verdade.', 'baixo')
  ],
  ef:{flag:'aviso_do_goro'},
  escolhas:[
    {texto:'"Eu vou ficar." Estender a mão.', vai:'c1e_recebeu',
     ef:{flag:'prometeu_ficar', moral:8}},
    {texto:'"E se eu não souber ainda?"', vai:'c1e_nao_sei_ainda'},
    {texto:'Pegar a bola sem responder.', vai:'c1e_recebeu'},
    {texto:'"O senhor já devolveu alguma?"', vai:'c1e_ja_devolveu'}
  ]
},

c1e_nao_sei_ainda:{
  texto:[
    d=>fala(d.jogador.nome, 'E se eu não souber ainda?'),
    'Ele ri de um jeito que enruga o olho inteiro.',
    fala('Célio', 'Aí você é igual aos outros duzentos e vinte e sete que eu entreguei esse mês e nos meses de antes.'),
    fala('Célio', 'Ninguém sabe. Quem chega aqui dizendo que sabe é o que eu mais me preocupo.', 'baixo'),
    fala('Célio', 'Não saber e ir mesmo assim é o normal. Pega.')
  ],
  ef:{moral:6, npc:{nome:'Célio', opiniao:3, memoria:'Te disse que ninguém sabe, e que ir sem saber é o normal.'}},
  escolhas:[{texto:'Pegar a bola.', vai:'c1e_recebeu'}]
},

c1e_ja_devolveu:{
  texto:[
    d=>fala(d.jogador.nome, 'O senhor já levou alguma de volta? Depois de entregar, quero dizer.'),
    'Ele fecha o caderno inteiro dessa vez.',
    fala('Célio', 'Onze vezes.'),
    fala('Célio', 'Em dezenove anos. Onze pessoas me procuraram depois pra devolver, e eu levei as onze sem discutir.'),
    d=>fala(d.jogador.nome, 'E os bichos?'),
    fala('Célio', 'Ficam no laboratório. Comem bem, correm no pátio, e não são de ninguém.'),
    'Ele olha pra caixa térmica aberta.',
    fala('Célio', 'Dos onze, sete foram adotados depois por gente que chegou lá procurando exatamente isso: bicho que já conhece o mundo e não tem dono.', 'baixo'),
    fala('Célio', 'Os outros quatro eu não sei, e não pergunto.')
  ],
  ef:{flag:'sabe_dos_onze', npc:{nome:'Célio', opiniao:4, memoria:'Contou das onze devoluções em dezenove anos, e que sete acharam alguém depois.'},
      registrar:'Onze pessoas devolveram o inicial em dezenove anos. Sete daqueles bichos acharam outra pessoa.'},
  escolhas:[{texto:'Pegar a bola.', vai:'c1e_recebeu'}]
},

c1e_recebeu:{
  texto:[
    'A bola é mais leve do que você imaginava a vida inteira, e essa é a primeira coisa que você aprende hoje.',
    'Ele fecha a caixa, passa a fita por cima do corte, e escreve uma coisa curta no caderno do lado do seu nome. Você não consegue ler de cabeça pra baixo e não pergunta.',
    d=>fala('Célio', `Abre aqui, vai. Eu gosto de ver, e depois eu tenho que anotar se tá bem.`),
    'Você aperta o botão.'
  ],
  ef:{executar:d => entregarInicial(d)},
  escolhas:[
    {texto:'Olhar o bicho antes de falar qualquer coisa.', vai:'c1e_primeiro_olhar'},
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
               : 'A luz sai da bola e vira bicho em cima da lona.';
    },
    'Depois ele olha pra você. E continua olhando, do jeito que bicho olha quando está decidindo uma coisa.',
    'Você não sabe o que ele decidiu. Ninguém sabe nunca.',
    fala('Célio', 'Tá bem.', null, 'Anotando.'),
    d=>fala(d.jogador.nome, 'Como o senhor sabe?'),
    fala('Célio', 'Olhou a praça antes de olhar você. Bicho que não tá bem olha o chão.', 'baixo')
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
    'Atrás de você alguém da fila faz um barulho com a boca, do tipo que gente faz quando vê uma coisa fofa e se arrepende de ter feito barulho.',
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
      return p ? fala(d.jogador.nome, `${(p.nome||'').toUpperCase()}!`, 'grita', 'Alto demais pra uma praça às sete da manhã.')
               : fala(d.jogador.nome, 'EI!', 'grita');
    },
    'A praça inteira olha. As pessoas da fila olham. Uma senhora na janela do segundo andar olha.',
    'E o bicho, que é o único que tinha motivo pra se assustar, não se assusta: levanta a cabeça na sua direção como quem responde.',
    fala('Célio', 'Ó.'),
    fala('Célio', 'Atendeu de primeira. Isso não é sempre.', 'riso'),
    'Você fica vermelh{o|a} e não consegue parar de sorrir ao mesmo tempo, que é uma combinação que não deveria ser possível.'
  ],
  ef:{moral:10, flag:'gritou_na_praca',
      presagio:'Você vai gritar esse nome de novo em situações muito piores que essa.'},
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
    fala('Célio', 'Primeira: licença. Sem licença você não é treinador, você é uma pessoa andando com um bicho. Centro Pokémon, balcão, formulário, fila. Faz isso hoje.'),
    fala('Célio', 'Segunda: ele come de três em três horas nas primeiras semanas e depois estabiliza sozinho. Não force.'),
    'Uma pausa mais longa que as outras.',
    fala('Célio', 'Terceira: ele não sabe que você é novo nisso. Pra ele você já é a pessoa dele desde agorinha, com currículo e tudo.', 'baixo'),
    fala('Célio', 'Isso é bom e é um peso, e é melhor você saber do peso hoje do que descobrir em Pewter.')
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
    fala('Célio', 'Mas eu entreguei bola pra um menino em Cerulean em noventa e um e não falei nada, porque tinha fila e eu tava atrasado.'),
    fala('Célio', 'Três semanas depois a mãe dele me ligou perguntando o que fazer, e eu não soube responder pelo telefone.'),
    'Ele dá de ombros de um jeito que não é leve.',
    fala('Célio', 'Desde noventa e um eu falo. Custa dois minutos por pessoa e eu tenho dois minutos.', 'baixo')
  ],
  ef:{moral:6, flag:'historia_de_noventa_e_um',
      npc:{nome:'Célio', opiniao:6, memoria:'Te contou por que ele fala com todo mundo desde 1991.'},
      presagio:'Você vai conhecer esse menino de Cerulean. Ele tem quarenta e poucos anos agora.'},
  escolhas:[
    {texto:'"{Obrigado|Obrigada}."', vai:'c1e_despedida_goro',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Agradeceu os dois minutos de quem não devia nada'}}}
  ]
},

c1e_despedida_goro:{
  texto:[
    'Ele guarda o caderno numa sacola de pano, dobra o banquinho, fecha o portamalas e bate duas vezes na lataria, que deve ser mania.',
    d=>{
      const DIA = {Pallet:1, Viridian:2, Pewter:4, Cerulean:6, Vermilion:8,
                   Lavender:10, Celadon:12, Saffron:14, Fuchsia:15, Cinnabar:16};
      const q = DIA[d.jogador.cidade] || 4;
      return fala('Célio', `Eu volto dia ${q} do mês que vem. Aqui é sempre dia ${q}. Se você ainda estiver na cidade, aparece. Se não estiver, melhor ainda.`, 'riso');
    },
    'Ele abre a porta do motorista e para antes de entrar.',
    d=>fala('Célio', `Ah. Anota o meu número, vai. Todo mundo que eu entrego tem.`),
    'Ele dita um número de sete dígitos de cor, devagar, do jeito de quem já ditou esse número mil vezes.',
    d=>fala('Célio', 'Serve pra pouca coisa. Mas um dia serve.', 'baixo')
  ],
  ef:{executar:d => {
        Estado.marcar('numero_do_goro');
        Estado.lembrarNPC('Célio', {opiniao:2, memoria:'Te deu o número dele no dia da entrega.'});
        return [{tipo:'info', texto:'Número de Célio anotado. Falta um PokéNav pra guardar.'}];
      }},
  escolhas:[
    {texto:'Voltar pra casa com ele na bola.', vai:'c1_mochila'},
    {texto:'Voltar pra casa com ele andando do lado.', vai:'c1e_voltou_a_pe',
     ef:{moral:5, flag:'voltou_a_pe_com_ele'}},
    {texto:'Ficar na praça mais um pouco antes de voltar.', vai:'c1e_ficou_na_praca'}
  ]
},

c1e_voltou_a_pe:{
  texto:[
    'Você não guarda na bola. Você volta andando, e ele vem do lado, e a diferença entre as duas coisas é a jornada inteira.',
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
  ef:{moral:6, flag:'ficou_no_banco_da_praca',
      presagio:'Você vai lembrar desse banco num momento em que estiver muito longe dele.'},
  escolhas:[{texto:'Levantar e ir pra casa.', vai:'c1_mochila'}]
}

  });
})();

/* uma pausa curta que aparece no meio de fala longa */
function fall_curto(){ return 'Ele deixa a piada respirar e depois continua.'; }
