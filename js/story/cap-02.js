/* ------------------------------------------------------------
   ABERTURAS — o capítulo não começa sempre no mesmo lugar.
   Quem chega molhado, quem chega sem dinheiro e quem chega com
   nome já correndo não entram em Viridian do mesmo jeito.
   ------------------------------------------------------------ */
const C2_ABERTURAS = ['c2_mural', 'c2_ab_encharcado', 'c2_ab_sem_troco', 'c2_ab_ja_falam', 'c2_ab_de_lado'];
function c2_cabe(id, d){
  const r = Estado.rep;
  if (id === 'c2_ab_sem_troco') return d.jogador.dinheiro < 1200;
  if (id === 'c2_ab_ja_falam')  return r.eixo === 'bom' && r.bom >= 2;
  if (id === 'c2_ab_de_lado')   return r.eixo === 'ruim' && r.ruim >= 2;
  return true;
}
function c2_abertura(d){
  const cand = C2_ABERTURAS.filter(id => c2_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 2 — GENTE BOA E GENTE COMUM
   ============================================================ */
CAPITULOS.push(

{
num:2, titulo:'Gente Boa e Gente Comum', local:'Viridian', ambiente:'cidade', nivelArea:7,
tom:'leve', entradas:C2_ABERTURAS,
inicio: d => c2_abertura(d),
cenas:{

c2_ab_encharcado:{
  texto:[
    'Choveu nos últimos onze quilômetros e não foi chuva de passar: foi chuva de molhar até o forro da mochila.',
    'Você entra em Viridian pingando, com a bainha da calça pesada, e a primeira coisa que Viridian faz é não reparar em você — o que é a coisa mais urbana que existe.',
    'O Centro Pokémon tem um capacho enorme na porta e uma placa pedindo pra bater o pé, e tem gente que bate e gente que não bate.',
    'Você bate.',
    'Lá dentro é morno, cheira a café de máquina e tem um ventilador de teto girando devagar em cima de dezesseis pessoas que também chegaram de algum lugar.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} sacode a água em cima de uma poltrona e um senhor levanta o jornal sem falar nada, do jeito de quem já viu isso duzentas vezes.`
               : 'Alguém levanta o jornal sem falar nada quando você passa pingando.';
    }
  ],
  ef:{hp:-2, flag:'chegou_molhado_em_viridian', registrar:'Chegou a Viridian debaixo de chuva.'},
  escolhas:[
    {texto:'Ir direto pro mural de recados, molhad{o|a} mesmo.', vai:'c2_mural'},
    {texto:'Sentar e esperar secar antes de fazer qualquer coisa.', vai:'c2_ab_secando'},
    {texto:'Perguntar à atendente onde dá pra secar roupa.', vai:'c2_ab_secando'}
  ]
},

c2_ab_secando:{
  texto:[
    'Você senta numa das cadeiras de plástico perto do ventilador, que é o assento mais disputado do Centro e estava vago porque ninguém mais tinha chegado tão molhado.',
    'Passa meia hora. A roupa não seca, mas para de escorrer, que é uma vitória menor e é a única disponível.',
    'Do lado, uma mulher de uns quarenta anos está com a mesma cara de quem chegou de longe hoje, e ela fala primeiro:',
    fala('a mulher do ventilador', 'Primeira vez?'),
    d=>fala(d.jogador.nome, 'Primeira semana.'),
    fala('a mulher do ventilador', 'Ah.'),
    'Ela diz "ah" do jeito que se diz quando a resposta explica uma coisa que não era sobre a pergunta.',
    fala('a mulher do ventilador', 'Olha o mural antes de sair. Não porque tem coisa útil. Porque tem.'),
    'E ela não explica o que quis dizer com isso.'
  ],
  ef:{hp:2, npc:{nome:'Mulher do ventilador', opiniao:1, memoria:'Dividiu o ventilador do Centro de Viridian com você numa tarde de chuva.'}},
  escolhas:[{texto:'Ir ver o mural.', vai:'c2_mural'}]
},

c2_ab_sem_troco:{
  texto:[
    d=>`Você conta o dinheiro antes de entrar em Viridian, sentad{o|a} na guia, porque contar dinheiro na frente dos outros é uma coisa que a estrada ensina a não fazer. Dá ${fmtDin(d.jogador.dinheiro)} ₽.`,
    'Não é pouco de passar fome. É pouco de fazer conta: se comprar isso, não compra aquilo.',
    'Viridian é a primeira cidade de verdade que você vê, e cidade de verdade tem uma coisa que a sua não tinha — vitrine.',
    'Você passa por três delas no caminho do Centro e não entra em nenhuma, e isso custa um esforço que você não esperava que custasse.',
    'No Centro tem café de máquina de graça. Você toma dois.'
  ],
  ef:{flag:'chegou_contando_moeda', registrar:'Chegou a Viridian contando moeda na guia.'},
  escolhas:[
    {texto:'Ir ao mural de recados — recompensa é dinheiro.', vai:'c2_mural'},
    {texto:'Perguntar na recepção se tem trabalho de um dia.', vai:'c2_ab_trabalho'},
    {texto:'Tomar o terceiro café e encarar isso amanhã.', vai:'c2_mural', ef:{hp:1}}
  ]
},

c2_ab_trabalho:{
  texto:[
    d=>fala(d.jogador.nome, 'Tem trabalho de um dia por aqui? Qualquer coisa.'),
    'A atendente não ri e não faz cara de pena, e as duas coisas são gentileza.',
    fala('a atendente', 'Tem sempre. A pergunta é se você quer o que tem.'),
    fala('a atendente', 'O mercado precisa de gente pra descarregar às cinco da manhã. Paga oitocentos, em dinheiro, e acaba às oito.'),
    d=>fala(d.jogador.nome, 'Cinco da manhã.'),
    fala('a atendente', 'Você é {treinador|treinadora}. Achei que acordar cedo fosse parte.'),
    'Ela anota um endereço num pedaço de papel de receituário e empurra pelo balcão.',
    fala('a atendente', 'Se for, fala que eu mandei. Se não for, tudo bem, e o papel não vale nada mesmo.')
  ],
  ef:{flag:'tem_bico_no_mercado', itens:{'Ração':1},
      npc:{nome:'Atendente de Viridian', opiniao:2, memoria:'Te arrumou um bico de descarga no mercado sem fazer cara de pena.'},
      registrar:'Tem um bico de descarga no mercado de Viridian, às cinco da manhã, por 800 ₽.'},
  escolhas:[
    {texto:'Ir ao mural agora e decidir de manhã.', vai:'c2_mural'}
  ]
},

c2_ab_ja_falam:{
  texto:[
    'Você entra em Viridian e a terceira pessoa que cruza com você olha duas vezes.',
    'Não é reconhecimento — ainda não. É aquele olhar de quem acha que já viu a sua cara em algum lugar e não vai conseguir lembrar onde, e vai passar o resto do dia com isso na cabeça.',
    'Notícia anda mais rápido do que gente, e você andou.',
    'No Centro Pokémon, a atendente te atende normalmente até ler o seu nome na licença, e aí ela levanta os olhos meio centímetro.',
    fala('a atendente', 'É você mesm{o|a}.'),
    d=>fala(d.jogador.nome, 'Depende do que contaram.'),
    fala('a atendente', 'Contaram bem.', 'riso'),
    'Ela devolve a licença e não cobra o atendimento, o que ela já não ia cobrar, mas desta vez ela faz questão de dizer que não vai cobrar.'
  ],
  ef:{moral:3, flag:'reconhecido_em_viridian',
      npc:{nome:'Atendente de Viridian', opiniao:2, memoria:'Reconheceu o seu nome na licença antes de você falar qualquer coisa.'},
      registrar:'Em Viridian já sabem quem você é.'},
  escolhas:[
    {texto:'"Contaram o quê, exatamente?"', vai:'c2_ab_contaram'},
    {texto:'Agradecer e ir ver o mural.', vai:'c2_mural'}
  ]
},

c2_ab_contaram:{
  texto:[
    d=>fala(d.jogador.nome, 'Contaram o quê, exatamente?'),
    'Ela pensa em como resumir, e o resumo sai curto demais e por isso certeiro:',
    fala('a atendente', 'Que você para.'),
    d=>fala(d.jogador.nome, 'Paro?'),
    fala('a atendente', 'Pra ajudar. Pra olhar. Sei lá. Alguém que passou por aqui falou de você e a frase foi essa: "aquele para".'),
    'Ela dá de ombros como quem entrega uma encomenda que não é dela.',
    fala('a atendente', 'É pouca coisa pra virar fama. Mas virou, e agora é sua.', 'baixo'),
    'Você vai passar uns dias tentando decidir se isso é elogio ou aviso, e a resposta é que é os dois.'
  ],
  ef:{moral:4, flag:'sabe_o_que_falam_de_voce',
      presagio:'"Aquele para." Você vai lembrar dessa frase numa hora em que parar vai custar caro.'},
  escolhas:[{texto:'Ir ver o mural.', vai:'c2_mural'}]
},

c2_ab_de_lado:{
  texto:[
    'Viridian não te expulsa. Viridian faz uma coisa pior, que é te tratar com um cuidado que ninguém tem com estranho comum.',
    'O lojista do mercado acompanha você com os olhos entre uma prateleira e outra, e quando você olha de volta ele sorri, e continua acompanhando.',
    'No Centro Pokémon a atendente lê a sua licença por dois segundos a mais do que leu a da pessoa da frente.',
    fala('a atendente', 'Tudo certo.'),
    'E está mesmo tudo certo. Ela não fez nada. É isso que é ruim: não tem nada pra reclamar, só tem um clima.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} percebe antes de você e fica mais perto da sua perna do que costuma ficar.`
               : 'Você repara no clima antes de entender de onde ele veio.';
    }
  ],
  ef:{moral:-2, flag:'clima_ruim_em_viridian',
      registrar:'Em Viridian te tratam com um cuidado que não é gentileza.'},
  escolhas:[
    {texto:'Ignorar e ir ao mural.', vai:'c2_mural'},
    {texto:'Perguntar de frente o que ela ouviu falar.', vai:'c2_ab_perguntou_de_frente'}
  ]
},

c2_ab_perguntou_de_frente:{
  texto:[
    d=>fala(d.jogador.nome, 'A senhora ouviu alguma coisa sobre mim?'),
    'Ela não esperava a pergunta e por isso responde a verdade.',
    fala('a atendente', 'Ouvi.'),
    d=>fala(d.jogador.nome, 'E é verdade?'),
    fala('a atendente', 'Eu não estava lá. Eu só repito o que chegou aqui, e o que chegou aqui foi curto.'),
    'Ela alinha a papelada do balcão, que já estava alinhada.',
    fala('a atendente', 'Olha, eu vou te dizer uma coisa que você não vai gostar: não adianta explicar pra mim.'),
    fala('a atendente', 'Adianta fazer uma coisa nova, numa cidade onde tenha gente olhando, e esperar isso andar. Anda mais devagar que o outro tipo de notícia, mas anda.', 'baixo')
  ],
  ef:{flag:'sabe_como_consertar_fama',
      npc:{nome:'Atendente de Viridian', opiniao:1, memoria:'Te disse na cara o que ouviu, e te disse como se conserta.'},
      registrar:'Notícia boa anda mais devagar que a ruim, mas anda.',
      presagio:'Ela te deu a receita. Falta a cidade com gente olhando.'},
  escolhas:[{texto:'Ir ver o mural.', vai:'c2_mural'}]
},


c2_mural:{
  texto:[
    'O Centro Pokémon de Viridian é três vezes maior que o posto da sua cidade e tem uma máquina de café que funciona.',
    'Na parede da entrada, o mural de recados: uma placa de cortiça de dois metros por um, coberta de papel em três camadas.',
    'Você fica ali mais tempo do que pretendia.',
    '"Procuro meu Growlithe. Sumiu dia 4 perto da Rota 22. Recompensa." — com uma foto colada, tirada de longe, meio tremida.',
    '"Meu filho saiu pra jornada em março. Se alguém vir, diz que a mãe dele não tá brava." — sem foto e sem nome.',
    '"COMPRO POKÉMON. QUALQUER UM. QUALQUER ESTADO." — letra de imprensa, sem telefone, só um horário e um lugar.',
    'E, escrito à mão com pressa e sublinhado três vezes, num pedaço de papel pardo:',
    '"NÃO ENTRE NA FLORESTA DE VIRIDIAN À NOITE."'
  ],
  ef:{flag:'leu_aviso_floresta', registrar:'Leu o mural de recados de Viridian.'},
  escolhas:[
    {texto:'Anotar o contato do Growlithe perdido. Pode ser que você o encontre.', vai:'c2_growlithe',
     ef:{flag:'anotou_growlithe'}},
    {texto:'Arrancar o cartaz de quem compra Pokémon.', vai:'c2_arrancou'},
    {texto:'Perguntar à atendente sobre o aviso da floresta.', vai:'c2_pergunta_floresta'},
    {texto:'Ler tudo e não mexer em nada.', vai:'c2_leu_tudo'},
    {texto:'Pregar um recado seu no mural, no espaço que sobrou.', vai:'c2_pregou_recado'},
    {texto:'Ligar pra casa antes de qualquer coisa. Aquele recado de mãe mexeu com você.',
     vai:'c2_ligou_por_causa_do_cartaz', cond:d=>Estado.temPokenav()},
    {texto:'Procurar no mural algum recado da sua cidade.', vai:'c2_recado_da_sua_cidade',
     cond:d=>!!d.flags.a_casa_estava_cheia || !!d.flags.viu_o_cartaz}
  ]
},

c2_pregou_recado:{
  texto:[
    'Você pede um percevejo na recepção, arranca meia folha do caderno de alguém que deixou em cima da mesa, e escreve.',
    'Você escreve três versões na cabeça e a quarta no papel, que é a mais curta — o que já virou um hábito seu e você nem percebeu.',
    d=>`No papel, escrito à mão: "${d.jogador.nome}, de ${d.jogador.cidade}. Saí dia desses. Se alguém daqui for pra lá, avisa que tá tudo bem."`,
    'Você prega no único espaço que sobrou, embaixo à direita, meio torto, por cima do canto de um cartaz de 1994.',
    'Daqui a três meses vai ter mais duas camadas de papel por cima do seu. Ele vai continuar lá embaixo, do mesmo jeito.'
  ],
  ef:{flag:'pregou_recado_no_mural', moral:3,
      rep:{eixo:'bom',delta:1,motivo:'Pregou o próprio recado num mural cheio de recado de outros'},
      registrar:'Pregou um recado no mural de Viridian, embaixo à direita, meio torto.'},
  escolhas:[
    {texto:'Perguntar à atendente sobre o aviso da floresta.', vai:'c2_pergunta_floresta'},
    {texto:'Ir ver o garoto na escada.', vai:'c2_teo'},
    {texto:'Sair do Centro.', vai:'c2_saida_centro'}
  ]
},

c2_ligou_por_causa_do_cartaz:{
  texto:[
    'Você lê o cartaz sem foto e sem nome três vezes e aí sai da fila do mural e vai pro orelhão do saguão.',
    'Dois toques.',
    d=>fala(nomeCasa(), 'Alô?', null, 'A voz está normal. É só isso — está normal, e é isso que te desmonta um pouco.'),
    d=>fala(d.jogador.nome, 'Oi. É que eu vi um cartaz aqui e eu... nada. Oi.'),
    'Silêncio do outro lado por dois segundos.',
    d=>fala(nomeCasa(), 'Você tá em Viridian já? Criatura, você mal saiu.', 'riso'),
    d=>fala(nomeCasa(), 'Tá comendo?'),
    '{casa:Ela|Ele} vai perguntar isso todas as vezes, pelos próximos nove meses, em qualquer circunstância, inclusive nas piores.'
  ],
  ef:{flag:'ligou_por_causa_do_cartaz', moral:5,
      rep:{eixo:'bom',delta:1,motivo:'Ligou pra casa por causa de um cartaz de outra pessoa'},
      registrar:'Ligou pra casa depois de ler o cartaz de uma mãe no mural.'},
  escolhas:[
    {texto:'Pregar um recado seu no mural também.', vai:'c2_pregou_recado'},
    {texto:'Ir ver o garoto na escada.', vai:'c2_teo'},
    {texto:'Sair do Centro.', vai:'c2_saida_centro'}
  ]
},

c2_recado_da_sua_cidade:{
  texto:[
    'Você procura papel da sua cidade no mural e leva quatro minutos pra achar, porque está na terceira camada.',
    d=>`É um cartaz de ${d.jogador.cidade}, impresso em papel comum, com a foto ruim de uma licença.`,
    'É o seu.',
    'Embaixo da foto, escrito à mão com a letra redonda de quem anotou pelo telefone: "PARABÉNS." E, menor: "recado da Sra. Perla, vizinha".',
    'Ela ligou pro Centro de Viridian. Ditou o recado pra recepção, mandou a foto por fax e ainda pediu pra pregarem na altura dos olhos.',
    'Você mal começou a estrada e já tem cartaz numa cidade que não é a sua.'
  ],
  ef:{flag:'achou_o_proprio_cartaz_em_viridian', moral:6,
      npc:{nome:'Sra. Perla', opiniao:3, memoria:'Mandou pregar o seu cartaz no mural do Centro de Viridian, por telefone e fax.'},
      rep:{eixo:'bom',delta:2,motivo:'Alguém mandou pregar o seu nome numa cidade que não é a sua', rep:{notorio:true}},
      registrar:'Achou o próprio cartaz na terceira camada do mural de Viridian.'},
  escolhas:[
    {texto:'Deixar onde está.', vai:'c2_pergunta_floresta'},
    {texto:'Trazer pra primeira camada, por cima de tudo.', vai:'c2_botou_na_frente'},
    {texto:'Tirar. Você não aguenta olhar pra isso.', vai:'c2_tirou_o_proprio_cartaz'}
  ]
},

c2_botou_na_frente:{
  texto:[
    'Você desprega o próprio cartaz da terceira camada e prega de volta por cima de tudo, no meio do mural, no lugar que todo mundo olha primeiro.',
    'Leva quatro segundos e é a coisa mais sem-vergonha que você já fez na vida.',
    'Uma senhora na fila do balcão vê você fazer isso e não fala nada, e o silêncio dela é ensurdecedor.',
    'Você deixa lá mesmo assim.'
  ],
  ef:{flag:'botou_o_proprio_cartaz_na_frente', moral:2,
      rep:{eixo:'ruim',delta:1,motivo:'Pôs o próprio cartaz por cima dos recados de todo mundo'},
      registrar:'Pôs o próprio cartaz por cima de tudo no mural de Viridian.'},
  escolhas:[
    {texto:'Deixar assim.', vai:'c2_pergunta_floresta'},
    {texto:'Devolver pra terceira camada, onde estava.', vai:'c2_devolveu_o_cartaz'}
  ]
},

c2_devolveu_o_cartaz:{
  texto:[
    'Você tira o seu cartaz do meio do mural e prega de volta lá embaixo, na terceira camada, embaixo do cartaz do Growlithe e da mãe sem nome.',
    'A senhora da fila do balcão vê isso também.',
    fala('a senhora da fila', 'Bom menino.', 'baixo', 'É tudo que ela diz, e ela nem olha pra você quando diz.')
  ],
  ef:{moral:4, limpaFlag:'botou_o_proprio_cartaz_na_frente',
      rep:{eixo:'bom',delta:1,motivo:'Devolveu o próprio cartaz pra terceira camada'},
      registrar:'Devolveu o próprio cartaz pra terceira camada do mural.'},
  escolhas:[{texto:'Perguntar à atendente sobre o aviso da floresta.', vai:'c2_pergunta_floresta'}]
},

c2_tirou_o_proprio_cartaz:{
  texto:[
    'Você tira o seu cartaz do mural, dobra em quatro e põe no bolso, e o buraquinho do percevejo fica.',
    'É a segunda vez em dois dias que você tira um cartaz seu de algum lugar.',
    'Você vai carregar esse papel dobrado até ele amassar nas dobras, e não vai jogar fora, e não vai olhar de novo.'
  ],
  ef:{flag:'tirou_o_cartaz_de_viridian', moral:-2,
      itens:{'Cartaz dobrado em quatro, com a sua cara':1},
      registrar:'Tirou o próprio cartaz do mural de Viridian e guardou no bolso.'},
  escolhas:[{texto:'Perguntar à atendente sobre o aviso da floresta.', vai:'c2_pergunta_floresta'}]
},

c2_growlithe:{
  texto:[
    'Você anota o telefone no verso da sua licença, que é o único papel que você tem.',
    'A foto é de um Growlithe deitado no tapete de uma sala, com uma pata em cima do controle da televisão.',
    'Alguém tirou essa foto rindo. Dá pra ver pelo ângulo torto.',
    'A data no cartaz é de dezenove dias atrás.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Anotou o contato de quem perdeu um Pokémon'}},
  escolhas:[
    {texto:'Perguntar à atendente sobre o aviso da floresta.', vai:'c2_pergunta_floresta'},
    {texto:'Arrancar o cartaz de quem compra Pokémon.', vai:'c2_arrancou'},
    {texto:'Ir ver quem é o garoto que está sentado na escada.', vai:'c2_teo'},
    {texto:'Sair do Centro.', vai:'c2_saida_centro'}
  ]
},

c2_arrancou:{
  texto:[
    'Você tira o cartaz do mural. Ele sai inteiro, com a tachinha.',
    'A atendente vê. Não fala nada. Volta pro computador dela.',
    'Dez minutos depois, quando você olha de novo, tem um cartaz igual no mesmo lugar.',
    'A atendente continua sem falar nada, e agora o silêncio dela diz uma coisa completamente diferente.'
  ],
  ef:{flag:'arrancou_o_cartaz',
      rep:{eixo:'bom',delta:1,motivo:'Arrancou o cartaz de quem compra Pokémon'}},
  escolhas:[
    {texto:'"Quem cola isso aqui?"', vai:'c2_quem_cola'},
    {texto:'Arrancar de novo.', vai:'c2_arrancou_dnv'},
    {texto:'Deixar pra lá e ir ver o garoto na escada.', vai:'c2_teo'},
    {texto:'Sair do Centro.', vai:'c2_saida_centro'}
  ]
},

c2_quem_cola:{
  texto:[
    '"Quem cola isso aqui?"',
    'A atendente demora pra responder e escolhe as palavras.',
    '"O mural é público. Qualquer um cola qualquer coisa."',
    '"E se for crime?"',
    '"Aí eu ligo pra Liga e a Liga manda um oficial em dois dias e o oficial tira o cartaz." Ela finalmente olha pra você. "E no terceiro dia tem outro cartaz."',
    '"Eu já liguei quatro vezes. Eu paro de ligar quando?"',
    'Ela pergunta isso de verdade, como quem quer mesmo a resposta.'
  ],
  ef:{flag:'sabe_do_cartaz',
      npc:{nome:'Atendente de Viridian', opiniao:2, memoria:'Te perguntou quando é que ela deve parar de ligar para a Liga.'}},
  escolhas:[
    {texto:'"Nunca."', vai:'c2_nunca', ef:{rep:{eixo:'bom',delta:1,motivo:'Disse a alguém cansado para não parar'}}},
    {texto:'"Eu não sei."', vai:'c2_nao_sei_cartaz'},
    {texto:'"Quando cansar. Todo mundo cansa."', vai:'c2_nao_sei_cartaz'},
    {texto:'Não responder e ir embora.', vai:'c2_saida_centro'}
  ]
},

c2_nunca:{
  falante:'a atendente',
  texto:[
    '"Nunca."',
    'Ela ri — cansada, mas ri.',
    '"É fácil falar com quinze anos."',
    '"É."',
    '"Mas é bom ouvir." Ela volta pro computador. "Boa jornada. E olha: guarda esse telefone do Growlithe. A mulher liga aqui toda terça."'
  ],
  ef:{flag:'anotou_growlithe'},
  escolhas:[{texto:'Ir ver o garoto na escada.', vai:'c2_teo'}]
},

c2_nao_sei_cartaz:{
  falante:'a atendente',
  texto:[
    'Ela assente devagar, como quem recebeu a resposta que esperava.',
    '"É." Volta pro computador. "Também acho."',
    'Você fica com a sensação exata de ter falhado num teste que ninguém disse que era um teste.'
  ],
  escolhas:[{texto:'Ir ver o garoto na escada.', vai:'c2_teo'}]
},

c2_arrancou_dnv:{
  texto:[
    'Você arranca de novo. E de novo, quando aparece o terceiro.',
    'No quarto, a atendente vem com uma fita adesiva e cola no lugar um papel seu, escrito à mão, que diz: "ESTE MURAL É FISCALIZADO."',
    'Não é verdade. Ela escreveu na hora.',
    '"Vai funcionar por umas duas semanas", ela diz, voltando pro balcão. "Depois eles voltam."',
    '"E aí?"',
    '"E aí eu escrevo outro."'
  ],
  ef:{flag:'aliou_a_atendente',
      rep:{eixo:'bom',delta:2,motivo:'Insistiu numa coisa pequena até virar coisa de duas pessoas'},
      npc:{nome:'Atendente de Viridian', opiniao:5, memoria:'Vocês dois enfrentaram um cartaz de cortiça por meia hora. Ela não esqueceu.'}},
  escolhas:[{texto:'Ir ver o garoto na escada.', vai:'c2_teo'}]
},

c2_pergunta_floresta:{
  texto:[
    d=>fala(d.jogador.nome, 'O que tem na Floresta de Viridian à noite?'),
    'A atendente para o que está fazendo, o que já responde metade.',
    fala('a atendente', 'Nada que a gente possa dizer oficialmente.'),
    d=>fala(d.jogador.nome, 'E não oficialmente?'),
    'Ela olha os lados, o que é engraçado num salão vazio.',
    fala('a atendente', 'Quatro pessoas registraram ocorrência esse ano. Duas falaram de gente. Duas falaram de bicho.'),
    fala('a atendente', 'As duas que falaram de gente descreveram a mesma pessoa.', 'baixo', 'Ela baixa a voz.')
  ],
  ef:{flag:['leu_aviso_floresta','sabe_das_ocorrencias'],
      registrar:'Quatro ocorrências na Floresta de Viridian este ano. Duas descreveram a mesma pessoa.'},
  escolhas:[
    {texto:'"Descreveram como?"', vai:'c2_descricao'},
    {texto:'"Então eu vou de dia."', vai:'c2_vou_de_dia'},
    {texto:'Agradecer e ir ver o garoto na escada.', vai:'c2_teo'},
    {texto:'"E ninguém faz nada?"', vai:'c2_quem_cola'}
  ]
},

c2_descricao:{
  texto:[
    '"Homem, quarenta e poucos, roupa boa demais pra mato." Ela recita de memória. "Carregando rolo de fio de aço no ombro, sem disfarçar."',
    '"Fio de aço."',
    '"Fio de aço." Ela volta ao computador. "Eu anotei a ocorrência duas vezes com essa mesma frase e mandei as duas pra Liga."',
    'Você vai lembrar dessa conversa daqui a uns dois dias, dentro de uma clareira, olhando um fio de aço amarrado numa estaca.'
  ],
  ef:{flag:'sabe_do_fio_de_aco',
      rep:{eixo:'bom',delta:1,motivo:'Perguntou o suficiente para receber a resposta inteira'}},
  escolhas:[{texto:'Ir ver o garoto na escada.', vai:'c2_teo'}]
},

c2_vou_de_dia:{
  texto:[
    '"Então eu vou de dia."',
    '"É o que todo mundo fala." Ela dá de ombros sem maldade. "E a floresta tem quatro horas de travessia, e ninguém sai de manhã cedo, e todo mundo entra depois do almoço."',
    'Ela olha o relógio da parede de propósito.',
    'São duas e quarenta.'
  ],
  escolhas:[{texto:'Ir ver o garoto na escada.', vai:'c2_teo'}]
},

c2_leu_tudo:{
  texto:[
    'Você lê o mural inteiro, camada por camada, levantando os papéis de cima para ver os de baixo.',
    'Tem coisa de três anos atrás ali embaixo. Tem um pedido de emprego. Tem um desenho de criança.',
    'Tem um bilhete que diz só "obrigado" e nada mais, e você fica um tempo tentando entender de quem para quem.',
    'Quando você se afasta, percebe que alguém está sentado na escada do outro lado do saguão, olhando você ler o mural há um tempo.'
  ],
  escolhas:[
    {texto:'Ir falar com ele.', vai:'c2_teo'},
    {texto:'Perguntar à atendente sobre o aviso da floresta.', vai:'c2_pergunta_floresta'},
    {texto:'Fingir que não viu e sair.', vai:'c2_saida_centro'},
    {texto:'Ficar lendo o mural mais um pouco, de propósito.', vai:'c2_provocou'}
  ]
},

c2_provocou:{
  texto:[
    'Você continua lendo. Sabendo que ele está olhando.',
    'Dura quase dois minutos. Depois ele desiste, levanta da escada, e vem até você.',
    '"Você lê rápido."',
    '"Você olha muito."',
    '"É." Ele não fica constrangido. "É que eu tô aqui desde as seis da manhã e você é a primeira pessoa com quem eu falo hoje."'
  ],
  escolhas:[{texto:'Ouvir.', vai:'c2_teo'}]
},

c2_teo:{
  texto:[
    'Ele tem mais ou menos a sua idade e a roupa dele é nova demais, do jeito de quem comprou tudo de uma vez pra viagem.',
    '"Ezra." Ele estende a mão antes de você oferecer. "Eu tava numa pedra na Rota 1 desde as seis da manhã esperando alguém passar."',
    '"E ninguém passou?"',
    '"Passaram três. Duas eram adultas e uma me ignorou." Ele diz isso sem nenhuma autopiedade, o que é impressionante. "Aí eu vim pra cá, porque no Centro pelo menos tem gente."',
    'Ele já está com a mão no cinto. Não é ameaça — é ansiedade.',
    '"Você é {treinador|treinadora}, né? Tipo, de verdade, com licença e tudo?"'
  ],
  ef:{npc:{nome:'Ezra', opiniao:1, memoria:'Esperou numa pedra na Rota 1 desde as seis da manhã. Você foi a primeira pessoa que falou com ele.'},
      registrar:'Conheceu Ezra no Centro Pokémon de Viridian.'},
  escolhas:[
    {texto:'"Sou. Quer lutar?"', vai:'c2_batalha_teo'},
    {texto:'Sentar na escada com ele antes.', vai:'c2_conversa'},
    {texto:'"Tô com pressa." E sair.', vai:'c2_recusa',
     ef:{npc:{nome:'Ezra', opiniao:-1, memoria:'Você recusou a primeira batalha dele.'}}},
    {texto:'"Por que você tava esperando numa pedra?"', vai:'c2_pergunta_pedra'}
  ]
},

c2_pergunta_pedra:{
  texto:[
    '"Por que você tava esperando numa pedra?"',
    'Ele demora pra responder e a resposta é mais honesta do que a pergunta merecia.',
    '"Porque eu não sei ir sozinho." Ele olha o próprio tênis. "Tipo — eu sei andar. Eu não sei... ir."',
    fala('Ezra', 'Meu pai falou que eu não duro uma semana. Não de maldade, sabe? Ele falou tipo estatística.'),
    fala('Ezra', 'E aí eu sentei na pedra e fiquei esperando aparecer alguém que fosse na mesma direção.'),
    'Ele finalmente te olha. "Achei que ia ser mais fácil."'
  ],
  ef:{flag:'teo_abriu_o_jogo',
      npc:{nome:'Ezra', opiniao:3, memoria:'Te contou, logo que se conheceram, que não sabia ir sozinho.'}},
  escolhas:[
    {texto:'"Ninguém sabe. A gente só vai."', vai:'c2_conversa',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Disse a coisa certa para alguém com medo'},
         npc:{nome:'Ezra', opiniao:2, memoria:'Você disse que ninguém sabe ir sozinho.'}}},
    {texto:'"Então volta pra casa."', vai:'c2_mandou_voltar',
     ef:{rep:{eixo:'ruim',delta:1,motivo:'Mandou alguém desistir antes de começar'},
         npc:{nome:'Ezra', opiniao:-3, memoria:'Você mandou ele voltar pra casa antes de ele começar.'}}},
    {texto:'"Seu pai é um idiota."', vai:'c2_conversa',
     ef:{npc:{nome:'Ezra', opiniao:2, memoria:'Você chamou o pai dele de idiota. Ele riu por quase um minuto.'}}},
    {texto:'Não dizer nada e esperar ele continuar.', vai:'c2_conversa',
     ef:{npc:{nome:'Ezra', opiniao:1, memoria:'Você ficou calad{o|a} e deixou ele falar. Foi o suficiente.'}}}
  ]
},

c2_mandou_voltar:{
  texto:[
    '"Então volta pra casa."',
    'Silêncio.',
    '"É." Ele assente muito devagar. "É, talvez."',
    'Ele não vai voltar pra casa. Ele vai continuar, e vai continuar sozinho, e vai lembrar dessa frase todas as vezes em que der errado.',
    '"Boa sorte aí." Ele estende a mão de novo, o que é pior do que se ele não estendesse.'
  ],
  escolhas:[
    {texto:'Apertar a mão e ir embora.', vai:'c2_saida_centro'},
    {texto:'"Espera. Desculpa. Eu falei merda."', vai:'c2_desculpa'}
  ]
},

c2_desculpa:{
  texto:[
    '"Espera. Desculpa. Eu falei merda."',
    'Ele para no meio do movimento de guardar o cinto.',
    '"Falou." Ele não facilita. "Mas todo mundo fala. Você foi só {o primeiro|a primeira} hoje."',
    'Ele senta na escada de novo e bate no degrau do lado.'
  ],
  ef:{npc:{nome:'Ezra', opiniao:2, memoria:'Você falou merda e pediu desculpa em menos de dez segundos. Ele reparou nos dez segundos.'},
      rep:{eixo:'bom',delta:1,motivo:'Voltou atrás depressa'}},
  escolhas:[{texto:'Sentar.', vai:'c2_conversa'}]
},

c2_conversa:{
  texto:[
    'Vocês sentam na escada do Centro Pokémon de Viridian e conversam por quarenta minutos.',
    'Ele te conta que trouxe comida pra dois "por precaução" e não sabe explicar precaução de quê. Que decorou o mapa inteiro e já se perdeu duas vezes. Que o Pidgey dele se chama Pidgey porque ele não conseguiu decidir um nome e agora é tarde.',
    'Você conta alguma coisa também. Não tudo. Mas alguma coisa.',
    'Em algum momento a atendente traz dois copos de água sem ninguém pedir.',
    fala('Ezra', 'Agora a gente luta?', null, 'Ele pergunta, e é impossível dizer não.')
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Sentou e ouviu um estranho por quarenta minutos'},
      npc:{nome:'Ezra', opiniao:4, memoria:'Vocês sentaram na escada do Centro de Viridian e conversaram quarenta minutos no dia em que se conheceram.'},
      flag:'teo_amigo', moral:5},
  escolhas:[{texto:'Lutar.', vai:'c2_batalha_teo'}]
},

c2_recusa:{
  texto:[
    '"Ah." Ele senta de novo na escada. "Tá."',
    'Você anda até a porta e ainda consegue sentir ele olhando.',
    'Na rua, você percebe que levou quatro segundos pra dizer que estava com pressa e que você não está com pressa nenhuma.'
  ],
  escolhas:[
    {texto:'Voltar.', vai:'c2_teo'},
    {texto:'Seguir em frente.', vai:'c2_saida_centro'}
  ]
},

c2_batalha_teo:{
  texto:[
    'Vocês saem pro pátio dos fundos do Centro, que existe exatamente pra isso e tem o chão marcado com tinta descascada.',
    'Ezra joga a bola com mais força do que precisa. "VAI!"',
    'O Pidgey sai e pousa no chão em vez de voar, o que é errado, e Ezra corrige ele em voz alta, e o Pidgey ignora.',
    'Nenhum dos dois faz ideia do que está fazendo. É a coisa mais honesta dessa cidade.'
  ],
  /* o Pidgey dele saiu de casa na mesma semana que o seu: um nível na
     frente do seu melhor, nunca mais que nove */
  batalha:{dex:16, nivel:d => Math.min(9, Math.max(6, Math.max(5, ...(d.time || []).map(p => p.nivel)) + 1)), tipo:'treinador', treinador:'Ezra', fuga:false,
           vitoria:'c2_pos_batalha', derrota:'c2_pos_derrota', gameover:'gameover'}
},

c2_pos_derrota:{
  texto:[
    'O seu último Pokémon senta no chão de tinta descascada e não levanta.',
    'Ezra demora a entender que ganhou. Quando entende, não comemora — olha em volta primeiro, pra ver se teve gente vendo, e não teve.',
    '"Ô." Ele se aproxima com a carteira já na mão, o que é exatamente o contrário do que se faz. "Regra é regra, mas eu não vou pegar dinheiro de quem acabou de sair de casa."',
    'Ele guarda a carteira de novo. Fica evidente que ele ensaiou essa frase durante o combate inteiro e que ela saiu errada.',
    'A atendente aparece na porta dos fundos com dois frascos e não pergunta nada. Já viu isso mil vezes.'
  ],
  ef:{npc:{nome:'Ezra', opiniao:1, memoria:'Ganhou de você no pátio do Centro de Viridian e se recusou a cobrar a aposta.'}},
  escolhas:[
    {texto:'"Pega o dinheiro. Você ganhou."', vai:'c2_derrota_insistiu',
     ef:{dinheiro:-200, rep:{eixo:'bom',delta:1,motivo:'Pagou uma aposta que o vencedor recusou'},
         npc:{nome:'Ezra', opiniao:3, memoria:'Você insistiu pra ele aceitar o dinheiro que ele não quis cobrar.'}}},
    {texto:'Aceitar a piedade em silêncio e cuidar do seu time.', vai:'c2_derrota_silencio'},
    {texto:'"Foi sorte. Revanche."', vai:'c2_derrota_revanche',
     ef:{npc:{nome:'Ezra', opiniao:-1, memoria:'Você chamou a vitória dele de sorte.'}}},
    {texto:'Perguntar o que ele fez que você não fez.', vai:'c2_derrota_aprendeu'}
  ]
},

c2_derrota_insistiu:{
  texto:[
    'Você põe as notas na mão dele. Ele olha o dinheiro como se fosse uma prova de alguma coisa.',
    '"Cara, eu não—"',
    '"Se você não pegar, não valeu. E eu não quero que não tenha valido."',
    'Ele guarda. Depois fica quieto de um jeito que você já vai aprender a reconhecer nele: é assim que ele fica quando alguém faz uma coisa decente com ele.',
    '"Então a revanche é de graça", ele decide. "Em Pewter."'
  ],
  escolhas:[
    {texto:'"Combinado."', vai:'c2_encontro_pewter'},
    {texto:'"Talvez." Não prometer nada.', vai:'c2_saida_centro'},
    {texto:'Perguntar o que ele fez que você não fez.', vai:'c2_derrota_aprendeu'}
  ]
},

c2_derrota_silencio:{
  texto:[
    'Você não diz nada. Pega seu time, agradece a atendente com a cabeça e senta no banco de concreto do pátio.',
    'Ezra fica de pé perto, mudando o peso de um pé pro outro, esperando uma deixa que você não dá.',
    '"Todo mundo perde a primeira", ele fala, pro muro.',
    'É mentira. Ele não sabe se é mentira. Ele acabou de inventar isso e vai acreditar nisso pelo resto da vida, porque é o tipo de mentira que serve.'
  ],
  ef:{flag:'perdeu_a_primeira'},
  escolhas:[
    {texto:'"Não foi a primeira dele." Falar do Pidgey.', vai:'c2_critica'},
    {texto:'Perguntar o que ele fez que você não fez.', vai:'c2_derrota_aprendeu'},
    {texto:'Levantar e ir embora.', vai:'c2_saida_centro'},
    {texto:'"Te encontro em Pewter."', vai:'c2_encontro_pewter'}
  ]
},

c2_derrota_revanche:{
  texto:[
    '"Foi sorte. Revanche."',
    'A cara dele muda. Não fecha — desaba um pouco, que é pior.',
    '"Foi sorte", ele repete, sem tom nenhum. "Tá."',
    'Ele devolve o Pidgey pra bola com cuidado demais, que é como gente magoada guarda as coisas.',
    '"Em Pewter, então. Aí você vê se é sorte."'
  ],
  ef:{flag:'chamou_de_sorte'},
  escolhas:[
    {texto:'Voltar atrás. "Não foi sorte. Desculpa."', vai:'c2_derrota_desculpa',
     ef:{npc:{nome:'Ezra', opiniao:2, memoria:'Você voltou atrás depois de chamar a vitória dele de sorte.'}}},
    {texto:'Deixar como está.', vai:'c2_encontro_pewter'},
    {texto:'Ir embora sem combinar nada.', vai:'c2_saida_centro'}
  ]
},

c2_derrota_desculpa:{
  texto:[
    '"Não foi sorte. Desculpa."',
    'Ezra levanta a cabeça devagar.',
    '"Você me enrolou com o troço de campo aberto e eu fui atrás", você diz. "Isso não é sorte, isso é você ter pensado antes."',
    '"Eu pensei nisso ontem à noite", ele admite, e o orgulho volta ao rosto dele inteiro de uma vez só. "Eu pensei em oito coisas ontem à noite. Sete eram ruins."'
  ],
  escolhas:[
    {texto:'"Me conta as sete."', vai:'c2_derrota_aprendeu'},
    {texto:'"Te encontro em Pewter."', vai:'c2_encontro_pewter'}
  ]
},

c2_derrota_aprendeu:{
  texto:[
    '"O que você fez que eu não fiz?"',
    'A pergunta pega ele desprevenido. Ninguém nunca perguntou nada pra ele.',
    '"Eu... esperei." Ele pensa enquanto fala. "Você atacou toda vez que deu. Eu deixei passar uma pra ver o que você ia fazer."',
    'Ele encolhe os ombros, com vergonha de estar dando aula.',
    '"Meu pai joga carta. É a mesma coisa, ele fala. Quem tem pressa mostra a mão."',
    'Você vai lembrar disso numa floresta, num ginásio e num lugar bem pior, e nas três vezes vai ser útil.'
  ],
  ef:{flag:'licao_da_espera', presagio:'Alguma coisa que ele disse vai voltar quando você menos quiser ouvir.'},
  escolhas:[
    {texto:'"Te encontro em Pewter."', vai:'c2_encontro_pewter'},
    {texto:'"Seu Pidgey não sabe voar direito."', vai:'c2_critica'},
    {texto:'Agradecer e sair.', vai:'c2_saida_centro'}
  ]
},

c2_pos_batalha:{
  texto:[
    'Ezra pega o Pidgey no colo antes mesmo de devolver pra bola. "Foi mal, foi mal, você foi bem."',
    'Ele fala isso pro Pidgey, não pra você. Leva uns bons quinze segundos até lembrar que você existe.',
    'Depois tira dinheiro do bolso e te entrega sem você pedir. É pouco. É quase tudo o que ele tem — dá pra ver porque a carteira fica visivelmente diferente.'
  ],
  ef:{dinheiro:400, npc:{nome:'Ezra', opiniao:2, memoria:'Perdeu para você em Viridian e pagou com quase tudo que tinha.'}},
  escolhas:[
    {texto:'Devolver o dinheiro.', vai:'c2_devolveu',
     ef:{dinheiro:-400, rep:{eixo:'bom',delta:2,motivo:'Devolveu o prêmio a quem não tinha'},
         npc:{nome:'Ezra', opiniao:4, memoria:'Você devolveu o dinheiro da aposta. Ele nunca contou isso pra ninguém e nunca esqueceu.'}}},
    {texto:'"Te encontro em Pewter, hein?"', vai:'c2_encontro_pewter',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Rivalidade sadia com Ezra'},
         npc:{nome:'Ezra', opiniao:2, memoria:'Vocês combinaram de se encontrar em Pewter.'}}},
    {texto:'Pegar o dinheiro e ir embora sem responder.', vai:'c2_saida_centro',
     ef:{npc:{nome:'Ezra', opiniao:-2, memoria:'Você pegou o dinheiro dele e não disse nada.'}}},
    {texto:'"Seu Pidgey não sabe voar direito."', vai:'c2_critica'}
  ]
},

c2_devolveu:{
  texto:[
    'Você devolve o dinheiro.',
    'Ele não aceita. Você insiste. Ele não aceita de novo. Você põe na mão dele e fecha os dedos dele em volta, que é o único jeito que funciona com gente assim.',
    '"Regra é regra", ele reclama.',
    '"A regra é entre profissional. A gente é dois moleques num pátio."',
    'Ele guarda. Fica quieto um tempo.',
    '"Valeu." Muito baixo. E depois, alto demais, pra compensar: "MAS EU VOU GANHAR A PRÓXIMA!"'
  ],
  escolhas:[
    {texto:'"Te encontro em Pewter."', vai:'c2_encontro_pewter'},
    {texto:'Ir embora antes que fique sentimental.', vai:'c2_saida_centro'}
  ]
},

c2_critica:{
  texto:[
    '"Seu Pidgey não sabe voar direito."',
    'Ezra olha pro Pidgey. O Pidgey olha pro Ezra.',
    '"Eu sei." Ele coça a cabeça. "Ele nasceu numa gaiola. A gente comprou ele numa loja quando eu tinha nove anos."',
    '"Ele nunca voou?"',
    '"Ele voa tipo... um metro." Ezra mostra com a mão. "Aí ele desce e anda."',
    'Vocês dois ficam olhando o Pidgey. O Pidgey anda até a cerca e volta.'
  ],
  ef:{flag:'sabe_do_pidgey', npc:{nome:'Ezra', opiniao:1, memoria:'Te contou que o Pidgey dele nasceu numa gaiola e nunca aprendeu a voar direito.'}},
  escolhas:[
    {texto:'"Dá pra ensinar."', vai:'c2_ensinar',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Ofereceu esperança em vez de diagnóstico'}}},
    {texto:'"Então ele não serve pra rota."', vai:'c2_nao_serve',
     ef:{npc:{nome:'Ezra', opiniao:-2, memoria:'Você disse que o Pidgey dele não servia.'}}},
    {texto:'"Te encontro em Pewter."', vai:'c2_encontro_pewter'}
  ]
},

c2_ensinar:{
  texto:[
    '"Dá pra ensinar."',
    '"Você acha?"',
    '"Sei lá. Acho." Você não faz a menor ideia. "Deve dar."',
    'Ezra passa o resto da tarde no pátio jogando comida em cima de um muro baixo pro Pidgey ter que subir.',
    'Na quinta tentativa o Pidgey sobe voando em vez de pular.',
    'Ezra grita tão alto que a atendente sai pra ver se aconteceu alguma coisa.'
  ],
  ef:{flag:'ensinou_o_pidgey',
      npc:{nome:'Ezra', opiniao:5, memoria:'Você ficou uma tarde inteira ajudando o Pidgey dele a voar. Ele conta essa história até hoje.'},
      rep:{eixo:'bom',delta:2,motivo:'Passou uma tarde ensinando um Pidgey alheio a voar'}},
  escolhas:[{texto:'Ir embora quando escurecer.', vai:'c2_encontro_pewter'}]
},

c2_nao_serve:{
  texto:[
    '"Então ele não serve pra rota."',
    'Ezra não responde na hora. Guarda o Pidgey.',
    '"Ele é o que eu tenho", ele diz, e é a frase mais adulta que sai da boca dele nesse dia.'
  ],
  escolhas:[{texto:'Ir embora.', vai:'c2_saida_centro'}]
},

c2_encontro_pewter:{
  texto:[
    '"Te encontro em Pewter."',
    '"Combinado." Ele bate na sua mão com uma solenidade ridícula. "Não chega antes de mim."',
    '"Você vai sair amanhã cedo?"',
    '"Vou sair AGORA." Ele já está pegando a mochila. "Cara, eu tô nessa escada desde as seis da manhã."',
    d=>d.flags.ensinou_o_pidgey
      ? 'E ele vai. Sai pela porta do Centro com o céu já escurecendo, em direção a uma floresta que leva quatro horas pra atravessar.'
      : 'E ele vai. Sai pela porta do Centro às três e meia da tarde, em direção a uma floresta que leva quatro horas pra atravessar.',
    'Você fica olhando a porta por um tempo.'
  ],
  ef:{flag:'teo_foi_pra_floresta'},
  escolhas:[
    {texto:'Ir atrás dele.', vai:'c2_atras_do_teo',
     ef:{flag:'foi_atras_do_teo', rep:{eixo:'bom',delta:1,motivo:'Foi atrás de alguém que entrou na floresta tarde demais'}}},
    {texto:'Deixar. Ele é adulto o suficiente pra decidir.', vai:'c2_saida_centro'},
    {texto:'Gritar pra ele que a floresta leva quatro horas.', vai:'c2_gritou'}
  ]
},

c2_gritou:{
  texto:[
    'Você grita da porta. Ele já está a uns trinta metros.',
    '"QUATRO HORAS! A FLORESTA LEVA QUATRO HORAS!"',
    'Ele para. Olha o relógio. Olha você. Faz a conta na cabeça, e dá pra ver ele fazendo a conta na cabeça.',
    'Depois levanta o braço num aceno que quer dizer "eu sei" e continua andando.',
    'Ele não sabia. Ele sabe agora e vai mesmo assim, porque voltar pro Centro depois de sair seria pior.'
  ],
  ef:{flag:'avisou_o_teo',
      npc:{nome:'Ezra', opiniao:1, memoria:'Você gritou da porta do Centro pra avisar do horário. Ele foi mesmo assim.'}},
  escolhas:[
    {texto:'Ir atrás dele.', vai:'c2_atras_do_teo', ef:{flag:'foi_atras_do_teo'}},
    {texto:'Deixar.', vai:'c2_saida_centro'}
  ]
},

c2_atras_do_teo:{
  texto:[
    'Você pega a mochila e sai atrás dele.',
    'Alcança na saída norte da cidade, onde a Rota 2 começa a estreitar.',
    '"Você tá me seguindo?"',
    '"Tô."',
    '"Por quê?"',
    'Você não tem uma resposta boa. Diz alguma coisa sobre ser o mesmo caminho.',
    'Ezra aceita a resposta ruim sem discutir, que é uma coisa que amigo faz.',
    'Vocês entram na Rota 2 juntos às quatro e dez da tarde.'
  ],
  ef:{flag:'entrou_com_teo',
      npc:{nome:'Ezra', opiniao:3, memoria:'Você saiu atrás dele e entrou na Rota 2 junto.'}},
  escolhas:[{texto:'Seguir.', vai:'c2_fim'}]
},

c2_saida_centro:{
  texto:[
    'Você sai do Centro Pokémon de Viridian.',
    'A cidade tem semáforo, prédio de dois andares e uma loja com fachada tão sem graça que você passou por ela duas vezes antes de entender que era uma loja.',
    'No fim da tarde, a luz bate de lado nas casas e Viridian fica quase bonita.'
  ],
  escolhas:[
    {texto:'Seguir.', vai:'c2_fim'},
    {texto:'Voltar ao Centro. Tem uma coisa que você não terminou.', vai:'c2_mural'}
  ]
},

c2_fim:{
  texto:[
    d=>d.flags.entrou_com_teo
      ? 'Vocês dois andam pela Rota 2 conversando sobre nada, e a Rota 2 vai estreitando até virar um corredor entre dois paredões de árvore.'
      : 'A Rota 2 vai estreitando até virar um corredor entre dois paredões de árvore, e o céu vira uma faixa.',
    'No fim dela, a Floresta de Viridian começa sem aviso nenhum: num passo você está numa trilha e no outro você está dentro.',
    d=>d.flags.leu_aviso_floresta
      ? 'Você pensa no papel pardo sublinhado três vezes. Olha o relógio. Faz a conta.'
      : 'Ninguém te avisou de nada. Talvez não tenha nada pra avisar.',
    'Depois daqui, o caminho é seu. Você decide quando entra, por onde, e se entra.'
  ],
  fim:true, resumo:d => d.flags.entrou_com_teo
    ? 'Viridian ficou pra trás, e vocês dois chegaram juntos na beira da floresta.'
    : 'Viridian ficou pra trás, e alguém entrou na floresta antes de você.'
}
}}

);
