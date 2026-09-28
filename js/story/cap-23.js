/* ------------------------------------------------------------
   ABERTURAS — o segundo andar do ginásio de Viridian. Quem abre,
   e em que estado, muda o que se encontra lá em cima.
   ------------------------------------------------------------ */
const C23_ABERTURAS = ['c23_a_escada', 'c23_ab_o_biombo', 'c23_ab_chegou_antes', 'c23_ab_de_cracha'];
function c23_cabe(id, d){
  if (id === 'c23_ab_de_cracha') return typeof Cargos !== 'undefined' && Cargos.lista().length >= 1;
  return true;
}
function c23_abertura(d){ return Dados.escolher(C23_ABERTURAS.filter(id => c23_cabe(id, d))); }

/* ============================================================
   CAPÍTULO 23 — O SEGUNDO ANDAR
   Viridian. O ginásio tem um andar que ninguém abre desde que
   o dono anterior foi embora sem desocupar a sala.
   ============================================================ */
CAPITULOS.push(

{
num:23, titulo:'O Segundo Andar', local:'Viridian — ginásio', ambiente:'cidade', nivelArea:55,
tom:'muito sombrio', entradas:C23_ABERTURAS,
inicio: d => c23_abertura(d),
cenas:{

c23_ab_o_biombo:{
  texto:[
    'O ginásio de Viridian está vazio e a porta da frente está destrancada, o que não é normal nem num dia normal.',
    'A linha pintada do chão, o piso de borracha, as duas arquibancadas de três degraus. Tudo no lugar.',
    'E no fundo à direita, o biombo que sempre esteve encostado na parede escondendo uma escada está deitado no chão.',
    'Deitado. Não encostado, não afastado: tombado, como quem derruba uma coisa e não volta pra levantar.',
    'A fita de isolamento da escada está arrancada e enrolada num canto do degrau, e a ponta da fita ainda tem cola.',
    'Foi hoje.',
    'Lá de cima não vem barulho nenhum, e "nenhum" é diferente de "vazio": tem uma luz acesa no alto da escada.',
    fala('Blue', 'Sobe ou vai embora.', 'frio', 'A voz vem de cima e não vem alta.')
  ],
  ef:{flag:'blue_abriu_o_segundo_andar',
      npc:{nome:'Blue', opiniao:0, memoria:'Você chegou depois de ele já ter subido.'},
      registrar:'O biombo do ginásio de Viridian estava tombado e a escada, aberta.'},
  escolhas:[
    {texto:'Subir.', vai:'c23_subiu_com_blue'},
    {texto:'Perguntar daqui de baixo o que tem lá em cima.', vai:'c23_perguntou_antes'},
    {texto:'Ir embora. Isso não é da sua conta.', vai:'c23_recusou_subir'}
  ]
},

c23_ab_chegou_antes:{
  texto:[
    'Você chega no ginásio de Viridian às sete e dez da manhã e o ginásio abre às nove, e por isso você senta na calçada do outro lado da rua pra esperar.',
    'Às sete e quarenta chega Blue.',
    'Ele não te vê. Ele destranca a porta, entra, e acende as luzes uma fileira por vez, o que leva um tempo.',
    'Às oito e cinco ele sai de novo, atravessa a rua, e senta na calçada do seu lado sem falar nada.',
    'Vocês ficam os dois sentados olhando o próprio ginásio dele.',
    fala('Blue', 'Tem uma escada lá dentro que eu nunca subi.'),
    d=>fala(d.jogador.nome, 'Em dois anos?'),
    fala('Blue', 'Em dois anos.'),
    'Ele mexe numa pedrinha da calçada com o pé.',
    fala('Blue', 'A Liga me entregou esse lugar com o segundo andar lacrado e um papel dizendo "arquivo do titular anterior, não mexer".'),
    fala('Blue', 'E eu obedeci. Eu.', 'baixo'),
    fala('Blue', 'Isso me incomoda mais do que o que tem lá em cima.')
  ],
  ef:{flag:'blue_confessou_na_calcada',
      npc:{nome:'Blue', opiniao:3, memoria:'Sentou na calçada com você e admitiu que obedeceu por dois anos.'},
      registrar:'Blue admitiu que nunca subiu a escada do próprio ginásio.'},
  escolhas:[
    {texto:'"Então vamos subir agora."', vai:'c23_subiu_com_blue'},
    {texto:'Perguntar por que hoje.', vai:'c23_por_que_esperou'},
    {texto:'Perguntar o que ele acha que tem lá.', vai:'c23_perguntou_antes'}
  ]
},

c23_ab_de_cracha:{
  texto:[
    d=>{
      const c = Cargos.principal();
      return `Você chega no ginásio de Viridian com o crachá de ${c ? c.nome : 'serviço'} e Blue vê o crachá antes de ver você.`;
    },
    'Ele olha o crachá por uns três segundos. Aí ri, uma vez, sem alegria.',
    fala('Blue', 'Ótimo. Então você pode assinar.'),
    d=>fala(d.jogador.nome, 'Assinar o quê?'),
    'Ele vai até o balcão do canto e volta com uma folha e uma caneta.',
    fala('Blue', 'Termo de abertura de arquivo lacrado. A Liga exige duas assinaturas: o titular do ginásio e um agente público.'),
    fala('Blue', 'Eu sou o titular. Faltava o segundo.'),
    d=>fala(d.jogador.nome, 'Há quanto tempo falta?'),
    fala('Blue', 'Dois anos.'),
    'Ele põe a folha e a caneta na sua mão.',
    fala('Blue', 'Eu pedi quatro vezes. Mandaram quatro respostas diferentes e nenhuma mandou ninguém.', 'frio')
  ],
  ef:{flag:['blue_abriu_o_segundo_andar','o_termo_de_abertura'],
      npc:{nome:'Blue', opiniao:2, memoria:'Precisou da sua assinatura de agente público para abrir o arquivo lacrado.'},
      registrar:'Blue pediu quatro vezes um agente público para abrir o arquivo do segundo andar. Nunca mandaram ninguém.',
      presagio:'Quatro respostas e nenhum agente. Não é lentidão: é uma porta que alguém não quer que abra.'},
  escolhas:[
    {texto:'Assinar e subir com ele.', vai:'c23_subiu_com_blue'},
    {texto:'Perguntar o que tem lá em cima antes de assinar.', vai:'c23_perguntou_antes'},
    {texto:'Não assinar.', vai:'c23_recusou_subir'}
  ]
},


c23_a_escada:{
  texto:[
    'O ginásio de Viridian tem uma escada no fundo à direita, atrás de um biombo, e ninguém que você conhece já viu alguém subir por ela.',
    'Hoje o biombo está encostado na parede e a escada está à vista, com a fita de isolamento arrancada e enrolada num canto do degrau.',
    fala('Blue', 'Eu abri hoje de manhã.', null, 'Ele está sentado na linha pintada do chão, de costas pra escada, que é uma posição muito específica de quem não quer olhar pra uma coisa.'),
    fala('Blue', 'A Liga me deu esse ginásio com o segundo andar lacrado e um papel dizendo "arquivo do titular anterior, não mexer".'),
    fala('Blue', 'Eu não mexi por dois anos. Aí chegou uma convocação pra você, e uma pra mim, e as duas com o mesmo número de protocolo.'),
    fala('Blue', 'Então eu mexi.', 'frio')
  ],
  ef:{flag:'blue_abriu_o_segundo_andar',
      npc:{nome:'Blue', opiniao:1, memoria:'Abriu o segundo andar do ginásio depois de dois anos, no dia da convocação.'},
      registrar:'Blue abriu o segundo andar do ginásio de Viridian.'},
  escolhas:[
    {texto:'Subir junto com ele.', vai:'c23_subiu_com_blue'},
    {texto:'Perguntar o que tem lá em cima antes de subir.', vai:'c23_perguntou_antes'},
    {texto:'Perguntar por que ele esperou você.', vai:'c23_por_que_esperou'},
    {texto:'Recusar. Isso não é da sua conta.', vai:'c23_recusou_subir'}
  ]
},

c23_perguntou_antes:{
  texto:[
    d=>fala(d.jogador.nome, 'O que tem lá em cima?'),
    fala('Blue', 'Uma sala de dez por seis com arquivo de aço do chão ao teto.'),
    fala('Blue', 'Quatro corredores de pasta. Tudo etiquetado, tudo em ordem, tudo com a mesma letra.'),
    fala('Blue', 'E uma mesa no meio com uma cadeira só, virada pra parede.'),
    'Ele fala isso sem levantar a cabeça, na cadência de quem já subiu e desceu hoje.',
    fala('Blue', 'Eu li três pastas e desci. Depois eu subi de novo e li mais duas. Depois eu sentei aqui e fiquei esperando alguém que aguentasse ler junto.')
  ],
  ef:{flag:'sabe_o_que_tem_em_cima',
      rep:{eixo:'bom',delta:1,motivo:'Perguntou antes de subir'},
      registrar:'Blue leu cinco pastas e desceu para esperar alguém.'},
  escolhas:[
    {texto:'Subir com ele.', vai:'c23_subiu_com_blue'},
    {texto:'Perguntar por que ele esperou você.', vai:'c23_por_que_esperou'},
    {texto:'Recusar mesmo assim.', vai:'c23_recusou_subir'}
  ]
},

c23_por_que_esperou:{
  texto:[
    d=>fala(d.jogador.nome, 'Por que você esperou eu chegar?'),
    'Ele demora. Ele demora tanto que você acha que não vai responder.',
    fala('Blue', 'Porque tem duas pessoas vivas que podiam ler isso comigo.', 'baixo'),
    fala('Blue', 'Uma sumiu faz dois anos e ninguém sabe pra onde.'),
    fala('Blue', 'A outra é você.'),
    'E aí ele levanta, sacode a calça, e vai pra escada sem olhar se você vem atrás.'
  ],
  ef:{flag:'blue_falou_do_red', moral:3,
      npc:{nome:'Blue', opiniao:4, memoria:'Disse que só duas pessoas vivas podiam ler aquelas pastas com ele.'},
      rep:{eixo:'bom',delta:2,motivo:'Fez a pergunta que abriu o Blue'},
      registrar:'Blue disse que só duas pessoas podiam ler aquilo com ele, e uma sumiu.'},
  escolhas:[
    {texto:'Ir atrás.', vai:'c23_subiu_com_blue'},
    {texto:'Ficar. Deixar ele subir sozinho.', vai:'c23_deixou_subir_sozinho'}
  ]
},

c23_recusou_subir:{
  texto:[
    d=>fala(d.jogador.nome, 'Isso não é da minha conta.'),
    'Ele assente devagar, sem discutir, o que não é do feitio dele.',
    fala('Blue', 'Tá certo. É o seguinte: o número de protocolo é o mesmo.'),
    fala('Blue', 'Se é a mesma pasta que te convocou e me convocou, então é da sua conta desde antes de você saber que existia.'),
    fala('Blue', 'Mas você não precisa subir hoje. A escada vai continuar aberta.', 'frio')
  ],
  ef:{flag:'recusou_o_segundo_andar',
      registrar:'Recusou subir ao segundo andar do ginásio.'},
  escolhas:[
    {texto:'Mudar de ideia e subir.', vai:'c23_subiu_com_blue'},
    {texto:'Ir embora de Viridian.', vai:'c23_foi_embora_sem_ler'}
  ]
},

c23_deixou_subir_sozinho:{
  texto:[
    'Você fica no ginásio vazio ouvindo os passos dele no assoalho de cima, indo e voltando, parando, indo de novo.',
    'Quarenta minutos.',
    'Quando ele desce, ele está com três pastas debaixo do braço e a cara de quem não vai falar sobre isso hoje.',
    fala('Blue', 'Toma.', null, 'Ele te entrega a de cima, só a de cima, e leva as outras duas pra trás do balcão.'),
    fala('Blue', 'Essa é a sua. Literalmente. Tem o seu nome na etiqueta.', 'frio')
  ],
  ef:{flag:'recebeu_a_pasta_com_seu_nome',
      itens:{'Pasta com o seu nome na etiqueta':1},
      registrar:'Blue desceu com três pastas e te entregou uma com o seu nome.'},
  escolhas:[
    {texto:'Abrir a pasta agora, na frente dele.', vai:'c23_abriu_a_pasta'},
    {texto:'Não abrir. Subir e ver o resto você mesm{o|a}.', vai:'c23_a_sala'},
    {texto:'Guardar e ir embora.', vai:'c23_foi_embora_sem_ler'}
  ]
},

c23_subiu_com_blue:{
  texto:[
    'A escada tem dezenove degraus e range em sete deles.',
    d=>`A sala é ${d.flags.sabe_o_que_tem_em_cima ? 'do tamanho que ele disse' : 'uma sala de arquivo'}: dez por seis, arquivo de aço do chão ao teto, quatro corredores de pasta.`,
    'A luz é de lâmpada fluorescente e demora quatro segundos pra estabilizar, e nesses quatro segundos a sala pisca e fica igual a si mesma três vezes.',
    'A mesa do meio tem uma cadeira só, virada pra parede.',
    fala('Blue', 'Corredor A é ginásio. Corredor B é Liga. Corredor C é pessoal dele.'),
    fala('Blue', 'Corredor D...', null, 'Ele não termina. Ele aponta com o queixo.'),
    'O corredor D tem pastas com nome de pessoa nas etiquetas. Centenas.'
  ],
  ef:{flag:'subiu_no_segundo_andar',
      registrar:'Subiu ao segundo andar. O corredor D tem centenas de pastas com nome de pessoa.'},
  escolhas:[
    {texto:'Procurar o seu nome no corredor D.', vai:'c23_procurou_o_proprio_nome'},
    {texto:'Ler o corredor C — o pessoal dele.', vai:'c23_corredor_c'},
    {texto:'Ler o corredor B — a Liga.', vai:'c23_corredor_b'},
    {texto:'Sentar na cadeira virada pra parede.', vai:'c23_a_cadeira'}
  ]
},

c23_a_sala:{
  texto:[
    d=>d.flags.sabe_o_que_tem_em_cima
      ? 'Você sobe sozinh{o|a} os dezenove degraus e a sala é exatamente como ele descreveu, o que de alguma forma é pior.'
      : 'Você sobe sozinh{o|a} os dezenove degraus, e a luz fluorescente demora quatro segundos pra decidir acender.',
    'Quatro corredores de aço. Uma mesa. Uma cadeira virada pra parede.'
  ],
  ef:{flag:'subiu_no_segundo_andar'},
  escolhas:[
    {texto:'Procurar o seu nome no corredor D.', vai:'c23_procurou_o_proprio_nome'},
    {texto:'Ler o corredor C.', vai:'c23_corredor_c'},
    {texto:'Ler o corredor B.', vai:'c23_corredor_b'},
    {texto:'Sentar na cadeira virada pra parede.', vai:'c23_a_cadeira'}
  ]
},

c23_a_cadeira:{
  texto:[
    'Você senta na cadeira. Ela está virada pra parede e a parede não tem nada.',
    'Não tem janela, não tem quadro, não tem prego. É uma parede pintada de bege, a quarenta centímetros do seu rosto.',
    'Alguém sentava aqui. Todo dia, provavelmente por anos, de frente pra uma parede vazia, com quatro corredores de arquivo nas costas.',
    'Você fica ali por um tempo que você não consegue medir depois.',
    fala('Blue', 'Levanta.', 'baixo', 'A voz vem da escada. Ele não subiu o último degrau.'),
    fala('Blue', 'Levanta dessa cadeira. Por favor.')
  ],
  ef:{flag:'sentou_na_cadeira_dele', hp:-3,
      rep:{eixo:'bom',delta:1,motivo:'Sentou onde ninguém quis sentar'},
      registrar:'Sentou na cadeira virada pra parede.'},
  escolhas:[
    {texto:'Levantar.', vai:'c23_procurou_o_proprio_nome'},
    {texto:'Ficar mais um pouco.', vai:'c23_ficou_na_cadeira'}
  ]
},

c23_ficou_na_cadeira:{
  texto:[
    'Você fica mais dez minutos na cadeira, de frente pra parede bege, com o Blue parado no último degrau atrás de você.',
    'Ele não sobe e não desce.',
    'Em algum momento você entende uma coisa sobre a pessoa que sentava aqui, e não é uma coisa que dá pra explicar em voz alta, e não é perdão.',
    'É só entender. Entender não é nada. Entender só torna tudo um pouco mais pesado e não muda nada.',
    'Aí você levanta.'
  ],
  ef:{flag:'entendeu_a_cadeira', moral:-2, hp:-4,
      rep:{eixo:'bom',delta:1,motivo:'Ficou tempo demais num lugar que ninguém queria ocupar'},
      registrar:'Ficou dez minutos na cadeira virada pra parede.'},
  escolhas:[{texto:'Ir pro corredor D.', vai:'c23_procurou_o_proprio_nome'}]
},

c23_corredor_b:{
  texto:[
    'Corredor B: Liga. Três prateleiras de convênio, ata e correspondência oficial, arquivado por ano.',
    'Tem onze anos de correspondência entre o ginásio de Viridian e a Liga Pokémon, e a correspondência é absolutamente normal até 1994.',
    'Em 1994 ela muda de tom. Vira mais curta. Vira só confirmação de recebimento, sem assunto.',
    'Em 1995 tem uma pasta fina com quatro folhas e um título escrito à máquina: CONVÊNIO DE MANEJO — GRUPO DE RESGATE BIOLÓGICO.',
    'Assinatura ilegível no canto, carimbo por cima. Convênio assim costuma sair publicado com uma página só, a das assinaturas.',
    'Esta cópia tem a segunda.'
  ],
  ef:{flag:'achou_a_segunda_pagina',
      itens:{'Segunda página do convênio':1},
      rep:{eixo:'bom',delta:2,motivo:'Achou a página que faltava no convênio'},
      registrar:'Achou a segunda página do convênio Liga–CGRB no arquivo do ginásio.'},
  escolhas:[
    {texto:'Ler a segunda página em voz alta pro Blue.', vai:'c23_leu_em_voz_alta'},
    {texto:'Guardar e ir pro corredor D.', vai:'c23_procurou_o_proprio_nome'},
    {texto:'Ler o corredor C antes.', vai:'c23_corredor_c'}
  ]
},

c23_leu_em_voz_alta:{
  texto:[
    'Você lê a segunda página em voz alta, os quatro parágrafos, numa sala de arquivo com uma lâmpada fluorescente que zumbe.',
    'O quarto parágrafo lista os signatários por cargo e não por nome, o que é normal.',
    'Mas embaixo, no espaço da testemunha, tem um nome escrito à mão, e o nome é o do titular anterior deste ginásio.',
    'Ele testemunhou. Ele estava na sala quando assinaram.',
    fala('Blue', 'Continua.', 'frio'),
    d=>fala(d.jogador.nome, 'Acabou. É só isso.'),
    fala('Blue', 'Não. Vira a folha.'),
    'Você vira. Atrás, a lápis, na mesma letra de todas as etiquetas: eu assinei porque eu achei que ia conseguir controlar. Não consegui.'
  ],
  ef:{flag:'leu_o_verso_da_segunda_pagina', moral:-3,
      npc:{nome:'Blue', opiniao:3, memoria:'Ouviu você ler em voz alta o que o avô dele escreveu a lápis no verso.'},
      rep:{eixo:'bom',delta:2,motivo:'Leu em voz alta uma coisa que era mais fácil ler calado', rep:{notorio:true}},
      registrar:'No verso da segunda página: "eu assinei porque eu achei que ia conseguir controlar".'},
  escolhas:[{texto:'Ir pro corredor D.', vai:'c23_procurou_o_proprio_nome'}]
},

c23_corredor_c:{
  texto:[
    'Corredor C: pessoal. É o corredor mais curto e o mais arrumado.',
    'Tem recibo de médico. Tem seis cadernetas de anotação de treino, uma por ano, com o nome de cada Pokémon e uma coluna de peso.',
    'Tem quarenta e uma fotos numa caixa, sem álbum, sem ordem.',
    'Trinta e nove delas são de Pokémon. Duas são de gente.',
    'Numa delas tem um menino de uns seis anos segurando uma Poké Ball vazia e rindo com falha nos dentes da frente.',
    d=>fala('Blue', 'Sou eu.', 'baixo', 'Ele fala isso por cima do seu ombro, e você não ouviu ele chegar.')
  ],
  ef:{flag:'viu_a_foto_do_blue',
      npc:{nome:'Blue', opiniao:2, memoria:'Te mostrou a foto dele aos seis anos, no arquivo do avô.'},
      registrar:'No corredor C tem uma foto do Blue aos seis anos, segurando uma bola vazia.'},
  escolhas:[
    {texto:'Perguntar quem é a outra foto de gente.', vai:'c23_a_outra_foto'},
    {texto:'Devolver a caixa e ir pro corredor D.', vai:'c23_procurou_o_proprio_nome'}
  ]
},

c23_a_outra_foto:{
  texto:[
    d=>fala(d.jogador.nome, 'E a outra?'),
    'Ele pega a caixa da sua mão e acha em quatro segundos, o que quer dizer que ele já achou antes hoje.',
    'É uma foto de laboratório, de uns vinte anos atrás, com quatro pessoas de jaleco em frente a uma bancada.',
    'Embaixo de cada rosto tem um nome escrito a caneta. Três deles não te dizem nada.',
    'O quarto diz Fuji. Ele está com a mão no ombro do homem ao lado, e o homem ao lado não tem nome escrito embaixo.',
    fala('Blue', 'Esse é o titular anterior deste ginásio.', 'baixo', 'Ele põe o dedo no homem sem nome.'),
    fala('Blue', 'Eu não sabia que eles se conheciam.', 'frio'),
    fala('Blue', 'Eu acho que ninguém sabia. Acho que era pra ninguém saber.')
  ],
  ef:{flag:'fuji_e_giovanni_se_conheciam',
      itens:{'Foto de quatro pessoas de jaleco':1},
      rep:{eixo:'bom',delta:2,motivo:'Puxou o fio que ligava as duas pontas'},
      registrar:'Uma foto de vinte anos atrás: o Dr. Fuji e o titular anterior do ginásio, no mesmo laboratório.'},
  escolhas:[{texto:'Ir pro corredor D.', vai:'c23_procurou_o_proprio_nome'}]
},

/* ── o corredor D ──────────────────────────────────────────── */
c23_procurou_o_proprio_nome:{
  texto:[
    'Corredor D. As etiquetas são nomes de pessoas, em ordem alfabética, e a letra é sempre a mesma.',
    'Você acha o seu em menos de um minuto, porque você sabia que ia achar.',
    d=>`A etiqueta tem o seu nome completo, a sua cidade, e a data: a data é de três semanas depois de você sair de casa.`,
    'A pasta tem dezenove folhas.',
    'Folha 1: cópia da sua ficha de licença, com a foto ruim.',
    'Depois, um relatório por ginásio que você desafiou, com data, resultado e uma linha de observação escrita à mão.',
    'O resto você não leu ainda.'
  ],
  ef:{flag:'achou_a_propria_pasta',
      registrar:'Achou a própria pasta no corredor D. Dezenove folhas, aberta três semanas depois de você sair de casa.'},
  escolhas:[
    {texto:'Ler o resto da pasta.', vai:'c23_folha_dez'},
    {texto:'Ler a linha de observação de cada ginásio.', vai:'c23_as_observacoes', cond:d=>c21_ins(d) >= 1},
    {texto:'Procurar outros nomes que você conhece.', vai:'c23_outros_nomes'},
    {texto:'Fechar a pasta e queimar o corredor inteiro.', vai:'c23_queimar'}
  ]
},

c23_as_observacoes:{
  texto:[
    d=>{ const n = c21_ins(d);
         return n > 1 ? `${c21_ext(n).replace(/^./, c => c.toUpperCase())} ginásios, ${c21_ext(n)} linhas, cada uma escrita à mão por quem te recebeu, e todas mandadas pro mesmo arquivo.`
                      : 'Um ginásio, uma linha, escrita à mão por quem te recebeu e mandada pra este arquivo.'; },
    d=>d.insignias.includes('Insígnia Pedra')   ? '**Pewter — Não desiste. Devia desistir, e não desiste. Anotado como resistência, não como talento.**' : '',
    d=>d.insignias.includes('Insígnia Cascata') ? '**Cerulean — Lê o adversário. Erra a leitura e insiste no erro. Vai aprender ou vai morrer.**' : '',
    d=>d.insignias.includes('Insígnia Trovão')  ? '**Vermilion — Trata o time como gente. Isso é uma vantagem tática que ninguém sabe medir.**' : '',
    d=>d.insignias.includes('Insígnia Terra')   ? '**Viridian — Recomendo observação continuada. — B.**' : '',
    d=>d.insignias.includes('Insígnia Terra')
      ? 'A última é do Blue. Ele escreveu isso sobre você e mandou pra este arquivo, e ele está em pé ao seu lado neste momento.'
      : 'Nenhuma linha é elogio e nenhuma é crítica. É tudo medida.'
  ],
  ef:{flag:'leu_as_observacoes',
      registrar:d=>d.insignias.includes('Insígnia Terra')
        ? 'Leu as observações dos líderes sobre você. A de Viridian é do Blue.'
        : 'Leu as observações dos líderes sobre você.'},
  escolhas:[
    {texto:'"Você escreveu isso."', vai:'c23_cobrou_o_blue', cond:d=>d.insignias.includes('Insígnia Terra')},
    {texto:'Não falar nada e ler o resto da pasta.', vai:'c23_folha_dez'}
  ]
},

c23_cobrou_o_blue:{
  texto:[
    d=>fala(d.jogador.nome, 'Você escreveu isso.'),
    'Ele não nega e não se desculpa.',
    fala('Blue', 'Escrevi. Todo líder escreve. É uma linha por desafiante e vai pro arquivo da Liga.'),
    fala('Blue', 'O que eu não sabia é que o arquivo da Liga tinha um arquivo em cima do meu ginásio, com uma pasta por pessoa e uma sala com uma cadeira virada pra parede.'),
    fala('Blue', 'Eu escrevi "recomendo observação continuada" achando que ia pra uma gaveta.'),
    fala('Blue', 'Eu não sei pra onde foi. Eu acho que foi pra sala 704.', 'baixo')
  ],
  ef:{flag:'blue_nao_sabia_do_arquivo', moral:2,
      npc:{nome:'Blue', opiniao:3, memoria:'Admitiu que escreveu sobre você sem saber pra onde ia.'},
      rep:{eixo:'bom',delta:1,motivo:'Cobrou na cara em vez de guardar'},
      registrar:'Blue escreveu "recomendo observação continuada" sem saber para onde ia.'},
  escolhas:[{texto:'Ler o resto da pasta.', vai:'c23_folha_dez'}]
},

c23_folha_dez:{
  texto:[
    'O resto não é sobre ginásio.',
    d=>{
      const L = [];
      if (d.flags.dentro_da_silph) L.push('a data em que você entrou na Silph');
      if (['entrou_na_estacao','entrou_pelo_buraco','entrou_limpo','entrou_acenando','entrou_com_caminhao','entrou_na_carroceria']
            .some(f => d.flags[f])) L.push('a data em que você entrou na Estação 4');
      L.push('a sala 704, com o horário de entrada e de saída');
      return (L.length > 1 ? 'Uma folha por lugar: ' : 'Uma folha só pra isso: ') + (L.length > 1 ? L.slice(0, -1).join('; ') + '; e ' + L[L.length - 1] : L[0]) + '.';
    },
    'Depois, seis folhas de nomes de pessoas com quem você falou, em ordem cronológica, com cidade e uma marca ao lado de alguns.',
    d=>{
      const n = Object.keys(d.npcs||{}).length;
      return n ? `Você conta as marcas. São ${Math.min(n, 9)} pessoas marcadas, e você conhece todas elas pelo primeiro nome.`
               : 'As marcas estão nos nomes de quem falou com você mais de uma vez.';
    },
    'A folha 19 é a última e tem uma frase só, datilografada, sem assinatura:',
    '**RECOMENDAÇÃO: CONVOCAR. {ELE|ELA} JÁ SABE DEMAIS PARA SER IGNORAD{O|A} E AINDA POUCO PARA SER PERIGOS{O|A}.**'
  ],
  ef:{flag:'leu_a_folha_dezenove', moral:-4,
      itens:{'Folha 19 — recomendação de convocação':1},
      rep:{eixo:'bom',delta:2,motivo:'Leu a pasta que fizeram sobre você até a última folha', rep:{notorio:true}},
      registrar:'Folha 19: "convocar. Já sabe demais para ser ignorado e ainda pouco para ser perigoso."'},
  escolhas:[
    {texto:'Levar a pasta inteira.', vai:'c23_levou_a_pasta'},
    {texto:'Levar só a folha 19.', vai:'c23_levou_a_folha'},
    {texto:'Deixar tudo onde estava.', vai:'c23_deixou_tudo'},
    {texto:'Procurar outros nomes que você conhece.', vai:'c23_outros_nomes'}
  ]
},

c23_outros_nomes:{
  texto:[
    'Você percorre o corredor D procurando nome conhecido e acha mais rápido do que gostaria.',
    d=>d.npcs && d.npcs['Nadia Arden'] ? 'Tem pasta da Nadia Arden, de Lavender, com duas folhas: a licença de 1979 e a de agora.' : '',
    'Tem pasta do Dr. Fuji, com noventa e uma folhas, a mais grossa do corredor.',
    d=>d.flags.a_enfermeira_voltou_pra_estrada ? 'Tem pasta da enfermeira do Centro da sua cidade, com três folhas, a última datada de poucas semanas atrás: o pedido de exoneração dela.' : '',
    'Tem pasta com o nome do Blue, e ele tira do seu alcance antes de você tocar.',
    fala('Blue', 'Essa não.', 'frio'),
    'E, no fim do corredor, uma pasta com uma etiqueta de três letras e nada mais escrito nela.'
  ],
  ef:{flag:'viu_o_corredor_d_inteiro',
      registrar:'O corredor D tem pasta de quase todo mundo que você conhece.'},
  escolhas:[
    {texto:'Abrir a pasta de três letras.', vai:'c23_a_pasta_de_tres_letras'},
    {texto:'Não abrir. Sair daqui.', vai:'c23_deixou_tudo'}
  ]
},

c23_a_pasta_de_tres_letras:{
  texto:[
    'A etiqueta diz RED.',
    'A pasta tem uma folha.',
    'A folha é um formulário de encerramento de acompanhamento, datado de dois anos atrás, e tem três campos preenchidos:',
    '**MOTIVO DO ENCERRAMENTO: paradeiro desconhecido.**',
    '**ÚLTIMA LOCALIZAÇÃO CONFIRMADA: acima da Rota 10. Altitude estimada 2.400 m.**',
    '**OBSERVAÇÃO: não recomendamos continuar a busca. Ele não está perdido.**',
    'Blue lê por cima do seu ombro e não fala nada por um tempo muito longo.',
    fala('Blue', 'Acima da Rota 10.', 'baixo'),
    fala('Blue', 'Eu subi lá duas vezes. Eu subi lá DUAS VEZES e não tinha nada.', 'grita')
  ],
  ef:{flag:'sabe_onde_o_red_esta', moral:-2,
      npc:{nome:'Blue', opiniao:4, memoria:'Descobriu com você que o Red está acima da Rota 10. Ele já tinha subido duas vezes.'},
      rep:{eixo:'bom',delta:2,motivo:'Abriu a pasta que ninguém abriu', rep:{notorio:true}},
      registrar:'A pasta RED: última localização acima da Rota 10. "Ele não está perdido."'},
  escolhas:[
    {texto:'"Então a gente sobe uma terceira vez."', vai:'c23_terceira_vez'},
    {texto:'Guardar a folha e não dizer nada.', vai:'c23_levou_a_folha_do_red'},
    {texto:'Deixar no lugar. Não é a sua busca.', vai:'c23_deixou_tudo'}
  ]
},

c23_terceira_vez:{
  texto:[
    d=>fala(d.jogador.nome, 'Então a gente sobe uma terceira vez.'),
    'Ele olha pra você com uma cara que você nunca viu na cara dele.',
    fala('Blue', 'Você nem conhece ele.'),
    d=>fala(d.jogador.nome, 'Não. Mas eu conheço você, e você subiu duas.'),
    'Silêncio de sala de arquivo, com a fluorescente zumbindo.',
    fala('Blue', 'Depois da convocação.', 'baixo'),
    fala('Blue', 'A gente vai. Depois da sala com a mesa comprida, a gente vai.')
  ],
  ef:{flag:'combinou_de_subir_com_blue', moral:6,
      npc:{nome:'Blue', opiniao:6, memoria:'Combinou de subir a montanha com você depois da convocação.'},
      rep:{eixo:'bom',delta:3,motivo:'Se ofereceu para subir uma montanha por uma busca que não era sua', rep:{notorio:true}},
      registrar:'Combinou com Blue de subir acima da Rota 10 depois da convocação.'},
  escolhas:[{texto:'Descer a escada.', vai:'c23_desceu'}]
},

c23_levou_a_folha_do_red:{
  texto:[
    'Você dobra a folha em quatro e põe no bolso de dentro, e o Blue vê você fazer isso e não impede.',
    'Vocês dois entendem, ao mesmo tempo, que isso não é roubo e é um pouco roubo.',
    fala('Blue', 'Se você achar ele, me avisa.', 'frio'),
    fala('Blue', 'Não precisa me levar junto. Só me avisa.')
  ],
  ef:{itens:{'Folha única da pasta RED':1}, flag:'levou_a_folha_do_red',
      npc:{nome:'Blue', opiniao:2, memoria:'Deixou você levar a folha do Red e pediu só pra ser avisado.'},
      registrar:'Levou a folha única da pasta RED.'},
  escolhas:[{texto:'Descer a escada.', vai:'c23_desceu'}]
},

c23_levou_a_pasta:{
  texto:[
    'Você tira as dezenove folhas do arquivo e põe na mochila, e o espaço no aço fica vazio e óbvio, com a etiqueta ainda lá.',
    fala('Blue', 'Eles vão ver.'),
    d=>fala(d.jogador.nome, 'Eu sei.'),
    fala('Blue', 'Você tá levando uma pasta que eles fizeram de você. Isso não é crime em lugar nenhum e eles vão tratar como crime.'),
    fala('Blue', '...leva.', 'baixo')
  ],
  ef:{itens:{'Dezenove folhas com o seu nome':1}, flag:'levou_a_propria_pasta',
      rep:{eixo:'bom',delta:1,motivo:'Levou embora a pasta que fizeram sobre você'},
      registrar:'Levou a própria pasta do corredor D.'},
  escolhas:[
    {texto:'Procurar outros nomes antes de descer.', vai:'c23_outros_nomes'},
    {texto:'Descer.', vai:'c23_desceu'}
  ]
},

c23_levou_a_folha:{
  texto:[
    'Você tira só a folha 19 e devolve as outras dezoito pro lugar, na ordem, com a etiqueta virada certa.',
    'Se alguém abrir a pasta sem contar as folhas, não vai notar nada.',
    fala('Blue', 'Isso é mais esperto do que levar tudo.'),
    fala('Blue', 'Eu odeio que seja mais esperto do que levar tudo.', 'riso')
  ],
  ef:{itens:{'Folha 19 — recomendação de convocação':1}, flag:'levou_so_a_folha_19',
      rep:{eixo:'bom',delta:1,motivo:'Levou só a folha que provava alguma coisa'},
      registrar:'Levou só a folha 19 e recolocou as outras dezoito.'},
  escolhas:[
    {texto:'Procurar outros nomes antes de descer.', vai:'c23_outros_nomes'},
    {texto:'Descer.', vai:'c23_desceu'}
  ]
},

c23_deixou_tudo:{
  texto:[
    'Você fecha a pasta, alinha a lombada com as outras, e deixa o corredor D exatamente como estava.',
    'Ninguém vai saber que você esteve aqui, o que é uma vantagem e é também a coisa mais triste desta sala.',
    fala('Blue', 'Você não levou nada.'),
    d=>fala(d.jogador.nome, 'Eu li. Ler é levar.'),
    'Ele pensa nisso por uns segundos e não discorda.'
  ],
  ef:{flag:'nao_levou_nada_do_arquivo',
      rep:{eixo:'bom',delta:1,motivo:'Leu tudo e não levou nada'},
      registrar:'Leu o corredor D inteiro e não levou nada.'},
  escolhas:[{texto:'Descer.', vai:'c23_desceu'}]
},

c23_queimar:{
  texto:[
    'Você olha quatro corredores de aço com centenas de pastas e pensa em fogo por uns quinze segundos completos.',
    'Você pensa em quanta gente está arquivada aqui sem nunca ter assinado nada. Você pensa na folha 19. Você pensa na cadeira virada pra parede.',
    fala('Blue', 'Não.', 'frio', 'Ele fala isso antes de você dizer qualquer coisa, porque deu pra ver na sua cara.'),
    fala('Blue', 'Aqui dentro tem a única prova de metade do que você viu nesses meses.'),
    fala('Blue', 'Você queima isso e eles ficam limpos. Eles ficam LIMPOS.', 'grita'),
    'Ele tem razão, e você odeia que ele tenha razão, e você desce a mão.'
  ],
  ef:{flag:'pensou_em_queimar_o_arquivo',
      rep:{eixo:'ruim',delta:1,motivo:'Quis queimar a única prova que existia'},
      registrar:'Pensou em queimar o arquivo. Blue impediu.'},
  escolhas:[
    {texto:'Ler o resto da pasta.', vai:'c23_folha_dez'},
    {texto:'Procurar outros nomes.', vai:'c23_outros_nomes'},
    {texto:'Descer sem ler mais nada.', vai:'c23_desceu'}
  ]
},

c23_abriu_a_pasta:{
  texto:[
    'Você abre a pasta em cima do balcão do ginásio, na frente dele, e lê as dezenove folhas em pé.',
    'Leva vinte minutos. Ele não sai do lado.',
    'A última folha tem uma frase datilografada, sem assinatura:',
    '**RECOMENDAÇÃO: CONVOCAR. {ELE|ELA} JÁ SABE DEMAIS PARA SER IGNORAD{O|A} E AINDA POUCO PARA SER PERIGOS{O|A}.**',
    fala('Blue', 'A minha tem a mesma frase.', 'baixo'),
    fala('Blue', 'Palavra por palavra. Eu conferi três vezes.')
  ],
  ef:{flag:'leu_a_folha_dezenove', moral:-3,
      itens:{'Folha 19 — recomendação de convocação':1},
      npc:{nome:'Blue', opiniao:3, memoria:'A pasta dele tem a mesma frase que a sua, palavra por palavra.'},
      rep:{eixo:'bom',delta:2,motivo:'Leu a pasta inteira em pé, na frente de quem entregou'},
      registrar:'A pasta do Blue tem a mesma frase que a sua, palavra por palavra.'},
  escolhas:[
    {texto:'Subir e ver o resto da sala.', vai:'c23_a_sala'},
    {texto:'Ir embora com a pasta.', vai:'c23_desceu'}
  ]
},

c23_desceu:{
  texto:[
    'Vocês descem os dezenove degraus e o sétimo range, e o décimo primeiro, e o décimo quarto.',
    'No ginásio vazio, Blue apaga a luz da escada e recoloca o biombo na frente dela, o que é um gesto completamente inútil e que ele faz mesmo assim.',
    fala('Blue', 'A convocação é na segunda.'),
    fala('Blue', 'Sala com mesa comprida, quatro cadeiras. Uma é minha, uma é sua.'),
    d=>fala(d.jogador.nome, 'E as outras duas?'),
    fala('Blue', 'Pois é.', 'frio'),
    'Na Rota 23, as sete guaritas velhas de pedra voltaram a ter gente dentro, e cada uma delas quer ver o seu cartão.'
  ],
  ef:{flag:'sabe_da_convocacao', registrar:'A convocação é na segunda. Mesa comprida, quatro cadeiras.'},
  fim:true
},

c23_foi_embora_sem_ler:{
  texto:[
    'Você sai do ginásio de Viridian sem subir a escada e anda quatro quarteirões antes de parar.',
    'Você não vai voltar hoje. Você sabe disso com a mesma clareza com que sabe que devia.',
    'O que tem naquela sala vai continuar naquela sala, e um dia alguém vai ler, e provavelmente não vai ser você.',
    'A convocação é na segunda de qualquer jeito.'
  ],
  ef:{flag:'nao_leu_o_arquivo', moral:-3,
      registrar:'Foi embora de Viridian sem subir a escada.'},
  fim:true
}

}
}

);
