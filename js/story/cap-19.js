/* ------------------------------------------------------------
   ABERTURAS — a Estação 4 parece um lugar de trabalho, e é isso
   que assusta. Dá pra chegar nela pela estrada, pelo ônibus dos
   funcionários, pela vizinhança ou pela portaria, de crachá.
   ------------------------------------------------------------ */
const C19_ABERTURAS = ['c19_cerca', 'c19_ab_o_onibus', 'c19_ab_a_vizinhanca', 'c19_ab_o_anuncio'];
function c19_cabe(id, d){ return true; }
function c19_abertura(d){
  const cand = C19_ABERTURAS.filter(id => c19_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 19 — O VIVEIRO
   Oito hectares, cerca nova e uma placa de dias sem acidentes.
   ============================================================ */
CAPITULOS.push(
{
num:19, titulo:'O Viveiro', local:'Estação 4 — Rota 21', ambiente:'campo', nivelArea:56,
tom:'muito sombrio', entradas:C19_ABERTURAS,
inicio: d => c19_abertura(d),
cenas:{

c19_ab_o_onibus:{
  texto:[
    'Existe um ônibus fretado que sai da rodoviária de Fuchsia às seis e dez e não tem destino no letreiro: tem um papelão escrito ESTAÇÃO na frente, preso com fita no para-brisa.',
    'Trinta e um lugares, vinte e nove ocupados, e você é o trigésimo.',
    'Ninguém pergunta quem você é. Às seis e dez da manhã ninguém pergunta nada.',
    'As pessoas do ônibus são: gente de macacão, gente de jaleco, duas mulheres com crachá plastificado e uma senhora com uma marmita no colo.',
    'Na quarta parada entra um rapaz que claramente é novo, porque ele cumprimenta todo mundo, e ninguém responde, e ele senta na frente.',
    'A conversa do banco de trás é sobre um colega que se demitiu.',
    fala('a mulher do banco de trás', 'Ele aguentou onze meses.'),
    fala('o homem do banco de trás', 'É mais que a média.'),
    'E aí os dois ficam quietos, e o "mais que a média" fica pairando pelos vinte minutos seguintes de estrada.'
  ],
  ef:{flag:'pegou_o_onibus_da_estacao',
      registrar:'Um ônibus fretado sai de Fuchsia às 6h10 para a Estação 4, com um papelão no para-brisa.',
      presagio:'"Onze meses é mais que a média." Média de quê.'},
  escolhas:[
    {texto:'Perguntar aos dois do banco de trás.', vai:'c19_ab_os_dois_do_fundo'},
    {texto:'Falar com o rapaz novo da frente.', vai:'c19_ab_o_rapaz_novo'},
    {texto:'Ficar quiet{o|a} e descer com todo mundo na portaria.', vai:'c19_dentro'},
    {texto:'Descer antes, na curva, e dar a volta no perímetro.', vai:'c19_perimetro'}
  ]
},

c19_ab_os_dois_do_fundo:{
  texto:[
    'Eles te olham do jeito que se olha alguém que ouviu.',
    d=>fala(d.jogador.nome, 'Média de quanto tempo?'),
    'A mulher responde e o homem deixa ela responder.',
    fala('a mulher do banco de trás', 'Sete, oito meses.'),
    d=>fala(d.jogador.nome, 'Todo mundo sai em sete, oito meses?'),
    fala('a mulher do banco de trás', 'Do setor de baixo, sai.'),
    'O ônibus pega um buraco e todo mundo balança junto.',
    fala('a mulher do banco de trás', 'Eu sou do administrativo. Eu tô lá há quatro anos.'),
    fala('o homem do banco de trás', 'Eu sou da manutenção. Seis.'),
    d=>fala(d.jogador.nome, 'E quem é do setor de baixo?'),
    'Eles se olham, e é o homem que responde dessa vez.',
    fala('o homem do banco de trás', 'Gente que a gente conhece três meses e depois não conhece mais.', 'baixo')
  ],
  ef:{flag:'o_setor_de_baixo',
      registrar:'Quem trabalha no "setor de baixo" da Estação 4 dura sete ou oito meses.',
      presagio:'Rotatividade não é acaso: é o tempo que uma pessoa aguenta ver aquilo.'},
  escolhas:[
    {texto:'Perguntar o que tem no setor de baixo.', vai:'c19_ab_o_que_tem_embaixo'},
    {texto:'Descer com todos na portaria.', vai:'c19_dentro'},
    {texto:'Descer antes e dar a volta no perímetro.', vai:'c19_perimetro'}
  ]
},

c19_ab_o_que_tem_embaixo:{
  texto:[
    'A mulher do administrativo olha pra frente do ônibus antes de responder, pra conferir quem pode ouvir.',
    fala('a mulher do banco de trás', 'Eu nunca desci.'),
    d=>fala(d.jogador.nome, 'Em quatro anos?'),
    fala('a mulher do banco de trás', 'Em quatro anos. Meu crachá não abre e eu nunca pedi que abrisse.'),
    'O homem da manutenção mexe na alça da bolsa de ferramenta.',
    fala('o homem do banco de trás', 'Eu desci duas vezes. Conserto de bomba.'),
    'Ele para. O ônibus entra numa estrada de terra e o barulho muda.',
    fala('o homem do banco de trás', 'É limpo. É muito limpo. Piso epóxi, luz boa, temperatura certa.'),
    fala('o homem do banco de trás', 'Não tem nada de sujo lá embaixo. É isso que eu não consigo explicar pra minha mulher.'),
    fala('o homem do banco de trás', 'Não tem nada errado e eu sonho com aquilo.', 'baixo')
  ],
  ef:{flag:'o_setor_de_baixo_e_limpo',
      registrar:'O setor de baixo da Estação 4 é limpo, climatizado e de piso epóxi. Quem desceu duas vezes sonha com aquilo.',
      presagio:'O que assusta não é a sujeira. É o cuidado.'},
  escolhas:[
    {texto:'Descer com todos na portaria.', vai:'c19_dentro'},
    {texto:'Descer antes e dar a volta no perímetro.', vai:'c19_perimetro'},
    {texto:'Falar com o rapaz novo da frente.', vai:'c19_ab_o_rapaz_novo'}
  ]
},

c19_ab_o_rapaz_novo:{
  texto:[
    'Ele tem uns vinte e dois anos e está com a camisa passada, o que ninguém mais no ônibus está.',
    fala('o rapaz novo', 'Primeiro dia. Dá pra ver, né?'),
    d=>fala(d.jogador.nome, 'Dá.'),
    fala('o rapaz novo', 'Eu passei em três entrevistas. Três! Pra auxiliar de campo.'),
    'Ele mostra o contrato dobrado no bolso da camisa, que ele claramente leu muitas vezes.',
    fala('o rapaz novo', 'Salário é o dobro do mercado. O dobro.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    'Ele hesita pela primeira vez.',
    fala('o rapaz novo', 'Eles falaram que é por causa da cláusula.'),
    d=>fala(d.jogador.nome, 'Que cláusula?'),
    'Ele desdobra o contrato e procura, e acha, e lê em voz alta, e vai ficando mais devagar conforme lê:',
    '**"O contratado se obriga a não divulgar, por prazo indeterminado, inclusive após o término do vínculo, qualquer informação sobre espécimes, procedimentos, instalações ou pessoas..."**',
    'Ele para de ler. Dobra o contrato. Guarda.',
    fala('o rapaz novo', 'É normal, né? Empresa grande tem isso.')
  ],
  ef:{flag:'a_clausula_do_contrato',
      npc:{nome:'o rapaz novo', opiniao:1, viuVoce:'Leu a cláusula de sigilo em voz alta pra você, no primeiro dia dele.'},
      registrar:'O contrato de auxiliar de campo da Estação 4 paga o dobro do mercado e tem sigilo por prazo indeterminado.',
      presagio:'Ele perguntou "é normal, né?" e não esperou resposta.'},
  escolhas:[
    {texto:'Dizer que não é normal.', vai:'c19_ab_nao_e_normal'},
    {texto:'Não dizer nada. Deixar ele descer.', vai:'c19_dentro'},
    {texto:'Descer antes, na curva.', vai:'c19_perimetro'}
  ]
},

c19_ab_nao_e_normal:{
  texto:[
    d=>fala(d.jogador.nome, 'Não é normal.'),
    'Ele ri. Depois vê que você não está rindo.',
    fala('o rapaz novo', 'Como assim?'),
    d=>fala(d.jogador.nome, 'Sigilo de processo é normal. Sigilo sobre pessoas, por prazo indeterminado, depois que você sai, não é.'),
    'Ele desdobra o contrato de novo e lê a cláusula mais uma vez, e dessa vez lê como quem procura, não como quem confere.',
    'O ônibus entra no estacionamento de terra batida e para. Todo mundo levanta ao mesmo tempo.',
    'Ele continua sentado.',
    fala('o rapaz novo', 'Eu pedi demissão do outro emprego semana passada.'),
    'E levanta, porque a fila está andando, e porque não tem mais o que fazer hoje além de descer.'
  ],
  ef:{flag:'avisou_o_rapaz_novo', moral:1,
      npc:{nome:'o rapaz novo', opiniao:2, viuVoce:'Você leu a cláusula com ele e disse que não era normal.'},
      registrar:'O rapaz novo entendeu a cláusula tarde demais e desceu do ônibus mesmo assim.'},
  escolhas:[
    {texto:'Descer junto com ele e entrar pela portaria.', vai:'c19_dentro'},
    {texto:'Ficar no ônibus e descer na curva.', vai:'c19_perimetro'}
  ]
},

c19_ab_a_vizinhanca:{
  texto:[
    'A Estação 4 tem vizinho, o que você não esperava. A dois quilômetros da cerca tem quatro casas de sítio numa estrada de terra, com Doduo solto no quintal e Growlithe de portão.',
    'Você bate na primeira porque é a primeira.',
    'Atende uma mulher de uns sessenta anos com uma bacia de feijão no colo, e ela senta na varanda e continua catando o feijão a conversa inteira, e você senta no degrau.',
    'Ela se apresenta como Sra. Hazel antes de você perguntar qualquer coisa, porque é o que se faz quando um desconhecido bate na sua porta no meio do mato.',
    fala('Sra. Hazel', 'A estação? Chegou em noventa e quatro.'),
    d=>fala(d.jogador.nome, 'E antes?'),
    fala('Sra. Hazel', 'Antes era pasto. Do Sr. Aoki, que vendeu e foi embora pra Celadon e morreu lá.'),
    'Feijão bom pra direita, feijão ruim pra esquerda.',
    fala('Sra. Hazel', 'No começo foi bom. Deu emprego, asfaltaram três quilômetros, puseram poste.'),
    d=>fala(d.jogador.nome, 'E depois?'),
    'Ela para de catar.',
    fala('Sra. Hazel', 'Depois o meu Growlithe parou de dormir.')
  ],
  ef:{flag:'a_vizinhanca_da_estacao',
      npc:{nome:'Sra. Hazel', opiniao:1, viuVoce:'Te recebeu na varanda e falou da Estação 4.'},
      registrar:'A Estação 4 foi instalada em 1994 num pasto comprado do Sr. Aoki.'},
  escolhas:[
    {texto:'Perguntar do Growlithe.', vai:'c19_ab_o_cachorro'},
    {texto:'Perguntar o que se ouve da estação à noite.', vai:'c19_ab_o_que_se_ouve'},
    {texto:'Agradecer e ir dar a volta no perímetro.', vai:'c19_perimetro'}
  ]
},

c19_ab_o_cachorro:{
  texto:[
    fala('Sra. Hazel', 'Um Growlithe. Ele tem onze anos e sempre dormiu na varanda.'),
    'Ela aponta com o queixo. O Growlithe está deitado no canto, de olhos abertos, e você não tinha reparado nele até agora.',
    fala('Sra. Hazel', 'Faz uns dois anos que ele fica assim. De olho aberto, virado pro mesmo lado.'),
    d=>fala(d.jogador.nome, 'Virado pra estação.'),
    fala('Sra. Hazel', 'Virado pra estação.'),
    'O Growlithe não pisca. Não é que ele não pisque nunca: é que ele pisca do jeito de quem não quer perder nada de vista.',
    fala('Sra. Hazel', 'Levei no veterinário duas vezes. Os dois falaram que ele tá ótimo.'),
    fala('Sra. Hazel', 'Ele tá ótimo. Ele só não dorme.', 'baixo'),
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} senta no chão da varanda ao lado do Growlithe, virado pro mesmo lado, e também não deita.`
               : 'Você fica olhando pro mesmo lado que ele por um tempo e não vê nada além de mato e, muito longe, uma linha de cerca.';
    }
  ],
  ef:{flag:'o_growlithe_que_nao_dorme',
      registrar:'Um Growlithe de onze anos parou de dormir há dois anos, virado para a Estação 4.',
      presagio:'Dois anos. O que mudou lá dentro há dois anos.'},
  escolhas:[
    {texto:'Perguntar o que se ouve da estação à noite.', vai:'c19_ab_o_que_se_ouve'},
    {texto:'Ir dar a volta no perímetro.', vai:'c19_perimetro'},
    {texto:'Ir pular a cerca pelo lado do mar.', vai:'c19_cerca_mar'}
  ]
},

c19_ab_o_que_se_ouve:{
  texto:[
    fala('Sra. Hazel', 'De dia, nada. Caminhão, às vezes.'),
    'Ela recomeça a catar o feijão, e catar feijão é a coisa que ela faz com as mãos quando fala do que não gosta.',
    fala('Sra. Hazel', 'De noite, umas três da manhã, tem uma coisa.'),
    d=>fala(d.jogador.nome, 'Que coisa?'),
    fala('Sra. Hazel', 'Um som de porta.'),
    d=>fala(d.jogador.nome, 'Porta?'),
    fala('Sra. Hazel', 'Porta pesada. De metal. Abre e fecha.'),
    'Ela separa um feijão ruim e joga pra esquerda com mais força do que precisava.',
    fala('Sra. Hazel', 'Duas quilômetros de distância, {menino|menina}. Pra eu ouvir daqui, aquela porta é grande.'),
    fala('Sra. Hazel', 'E ela abre e fecha umas nove, dez vezes, sempre entre três e quatro.')
  ],
  ef:{flag:'a_porta_das_tres_da_manha',
      registrar:'De madrugada, entre três e quatro, uma porta de metal grande abre e fecha nove ou dez vezes na Estação 4.',
      presagio:'Entre três e quatro da manhã. Você já ouviu esse horário em outro lugar deste mapa.'},
  escolhas:[
    {texto:'Perguntar do Growlithe que não dorme.', vai:'c19_ab_o_cachorro'},
    {texto:'Ir dar a volta no perímetro.', vai:'c19_perimetro'},
    {texto:'Voltar às três da manhã.', vai:'c19_cerca_mar'}
  ]
},

c19_ab_o_anuncio:{
  texto:[
    'O anúncio está colado num poste na saída de Fuchsia, impresso em papel colorido, com franjinha de telefone pra destacar.',
    '**AUXILIAR DE CAMPO — SEM EXPERIÊNCIA — SALÁRIO ACIMA DO MERCADO — TRANSPORTE FRETADO — ESTAÇÃO 4, ROTA 21**',
    'Das doze franjinhas, dez já foram destacadas.',
    'Você destaca a décima primeira.',
    'Do outro lado da rua tem uma padaria com telefone público na porta, e você liga de lá, e atende uma mulher na primeira chamada, o que quer dizer que tem alguém sentado esperando o telefone tocar.',
    fala('a voz do telefone', 'Estação 4, bom dia.'),
    d=>fala(d.jogador.nome, 'É sobre o anúncio.'),
    fala('a voz do telefone', 'Idade?'),
    d=>fala(d.jogador.nome, 'Quinze.'),
    'Pausa de um segundo. Você espera o não.',
    fala('a voz do telefone', 'Você pode vir amanhã às seis e dez? Tem ônibus da rodoviária.')
  ],
  ef:{flag:'respondeu_o_anuncio',
      registrar:'A Estação 4 contrata auxiliar de campo sem experiência, aos quinze anos, sem hesitar.',
      presagio:'Ela não pestanejou com quinze anos. Um emprego que aceita qualquer idade não é um emprego difícil de preencher — é um emprego difícil de manter preenchido.'},
  escolhas:[
    {texto:'Ir amanhã, no ônibus das seis e dez.', vai:'c19_ab_o_onibus'},
    {texto:'Perguntar o que faz um auxiliar de campo.', vai:'c19_ab_o_que_faz'},
    {texto:'Não ir. Dar a volta no perímetro por fora.', vai:'c19_perimetro'}
  ]
},

c19_ab_o_que_faz:{
  texto:[
    d=>fala(d.jogador.nome, 'O que faz um auxiliar de campo?'),
    fala('a voz do telefone', 'Apoio geral. Limpeza de baia, transporte interno, conferência de lote.'),
    'Ela lê isso. Dá pra ouvir que ela lê.',
    d=>fala(d.jogador.nome, 'Conferência de lote de quê?'),
    'Pausa.',
    fala('a voz do telefone', 'De espécime.'),
    d=>fala(d.jogador.nome, 'Vocês conferem Pokémon por lote?'),
    'Pausa maior.',
    fala('a voz do telefone', 'Você pode vir amanhã às seis e dez?'),
    'Ela repete a frase exatamente igual à primeira vez, com a mesma entonação, o que é o que se faz quando se decide não responder.'
  ],
  ef:{flag:['conferencia_de_lote','sabe_do_lote_unico'],
      registrar:'Na Estação 4, Pokémon são conferidos por lote.',
      presagio:'Lote é unidade de mercadoria. A palavra escapou e ela repetiu a frase pra cobrir.'},
  escolhas:[
    {texto:'Ir amanhã, no ônibus das seis e dez.', vai:'c19_ab_o_onibus'},
    {texto:'Não ir. Dar a volta no perímetro por fora.', vai:'c19_perimetro'},
    {texto:'Ir pular a cerca pelo lado do mar.', vai:'c19_cerca_mar'}
  ]
},


c19_cerca:{
  texto:[
    'A Estação 4 tem oito hectares e não parece um lugar de crime. Parece um lugar de trabalho.',
    'Estacionamento de terra batida com sete carros, todos velhos, um deles com cadeirinha de criança no banco de trás.',
    'Um bicicletário com quatro bicicletas.',
    'Na parede da guarita, uma placa pintada à mão: 24 DIAS SEM ACIDENTES. O número está num quadrinho de giz, para poder mudar.',
    'Às nove e quarenta da manhã, quatro pessoas de macacão tomam café em pé na porta do primeiro galpão, e uma delas está contando alguma coisa engraçada.',
    d=>{
      if (d.flags.trabalha_para_comissao) return 'Você entra pela portaria, mostra a matrícula e é recebido por alguém do setor de pessoal que te explica onde fica o banheiro e onde se pendura a chave do armário.';
      if (d.flags.cracha_adnan) return 'O crachá da Elda abre a catraca no primeiro toque. O sistema registra o número dela e o horário. O relógio das quarenta e oito horas começa agora.';
      return 'Você vai ter que entrar de outro jeito.';
    }
  ],
  ef:{registrar:'Chegou à Estação 4, na Rota 21.'},
  escolhas:[
    {texto:'Entrar pela portaria.', vai:'c19_dentro',
     cond:d=>!!(d.flags.trabalha_para_comissao||d.flags.cracha_adnan)},
    {texto:'Dar a volta no perímetro antes de qualquer coisa.', vai:'c19_perimetro'},
    {texto:'Pular a cerca pelo lado do mar.', vai:'c19_cerca_mar'},
    {texto:'Entrar junto com o caminhão de insumos.', vai:'c19_caminhao'},
    {texto:'Bater na portaria e pedir para ver.', vai:'c19_pedir'}
  ]
},

/* ── O perímetro ────────────────────────────────────────── */
c19_perimetro:{
  texto:[
    'Você anda o perímetro inteiro, o que leva uma hora e quarenta, porque oito hectares andados rente à cerca são mais que oito hectares.',
    'A cerca é nova, de tela galvanizada, com mourão de concreto a cada três metros e arame liso no alto. Não tem arame farpado, o que te chama a atenção.',
    'Não tem farpado porque farpado machuca bicho, e bicho machucado é prejuízo.',
    'Tem quatro câmeras, todas apontadas para dentro.',
    'Você leva um tempo para entender o que isso quer dizer, e quando entende, é pior: eles não têm medo de quem entra.'
  ],
  ef:{flag:'andou_o_perimetro', instabilidade:1,
      registrar:'Todas as quatro câmeras da Estação 4 apontam para dentro.'},
  escolhas:[
    {texto:'Ler a placa do portão com atenção.', vai:'c19_placa'},
    {texto:'Olhar o lixo. Lixo conta tudo.', vai:'c19_lixo'},
    {texto:'Achar o trecho baixo, do lado do mar.', vai:'c19_barranco'},
    {texto:'Voltar ao portão e decidir.', vai:'c19_cerca'}
  ]
},

c19_placa:{
  texto:[
    'A placa é de chapa esmaltada e custou dinheiro.',
    'ÁREA DE PESQUISA — ACESSO RESTRITO. Comissão de Gestão de Risco Biológico de Kanto — CGRB. Licença ambiental 2.117. Registro 11.402.',
    'Embaixo, em corpo menor: Visitas monitoradas às quintas-feiras, das 14h às 16h, mediante agendamento prévio. Telefone.',
    'E, no rodapé, uma linha que você lê três vezes.',
    'Em caso de encontro com animal fora do perímetro, ligue para este número. Não tente capturar.'
  ],
  ef:{flag:['sabe_da_visita','sabe_do_telefone_da_estacao'],
      registrar:'A Estação 4 faz visita monitorada às quintas, das 14h às 16h.'},
  escolhas:[
    {texto:'Olhar o lixo.', vai:'c19_lixo'},
    {texto:'Achar o trecho baixo da cerca.', vai:'c19_barranco'},
    {texto:'Voltar ao portão.', vai:'c19_cerca'}
  ]
},

c19_lixo:{
  texto:[
    'As caçambas ficam num canto do estacionamento, fora da cerca, porque o caminhão do lixo não entra em área restrita.',
    'São três, e três já diz alguma coisa: uma de comum, uma de reciclável e uma terceira, laranja, fechada com cadeado, com o símbolo internacional de resíduo biológico.',
    'A comum tem embalagem de ração, copo descartável, um chinelo, uma revista.',
    'A de reciclável tem papelão e latas.',
    'A laranja está cheia. Você sabe que está cheia porque a tampa não fecha por dois dedos.'
  ],
  ef:{flag:'viu_as_cacambas', instabilidade:1,
      registrar:'A caçamba de resíduo biológico da Estação 4 está cheia e cadeada.'},
  escolhas:[
    {texto:'Forçar a tampa da laranja.', vai:'c19_abriu_a_laranja'},
    {texto:'Olhar a comum com calma.', vai:'c19_lixo_comum'},
    {texto:'Anotar o nome da empresa que recolhe.', vai:'c19_empresa_do_lixo'},
    {texto:'Voltar ao portão.', vai:'c19_cerca'}
  ]
},

c19_abriu_a_laranja:{
  texto:[
    'O cadeado é bom, mas a tampa não fecha, e você consegue enfiar a mão e levantar dois dedos de folga.',
    'Dentro tem saco branco, de plástico grosso, amarrado com lacre numerado.',
    'Cada saco tem uma etiqueta impressa: DATA / LOTE / QUANTIDADE / RESPONSÁVEL.',
    'O saco de cima diz anteontem, lote 41-C, quantidade 14, e uma assinatura que você não consegue ler de cabeça para baixo.',
    'Você solta a tampa e dá dois passos para trás e fica um tempo respirando pelo nariz.'
  ],
  ef:{flag:['viu_os_sacos','sabe_do_lote_41c'], instabilidade:2, moral:-3,
      registrar:'Saco de resíduo biológico: anteontem, lote 41-C, quantidade 14.'},
  escolhas:[
    {texto:'Levar um lacre numerado.', vai:'c19_pegou_lacre'},
    {texto:'Fotografar a etiqueta.', vai:'c19_fotografou_etiqueta', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Fechar e ir para o portão.', vai:'c19_cerca'},
    {texto:'Anotar a empresa que recolhe.', vai:'c19_empresa_do_lixo'}
  ]
},

c19_pegou_lacre:{
  texto:[
    'Você corta um lacre e guarda no bolso de dentro.',
    'É um pedaço de plástico numerado com quatro centímetros de comprimento e não pesa nada.',
    'Ele prova que existe um saco, que o saco teve um número e que alguém assinou.',
    'Não prova o que tinha dentro. Nenhuma prova nunca prova o que tinha dentro.'
  ],
  ef:{flag:'tem_lacre', itens:{'Lacre numerado da Estação 4':1},
      registrar:'Guardou um lacre numerado da caçamba de resíduo.'},
  escolhas:[
    {texto:'Ir para o portão.', vai:'c19_cerca'},
    {texto:'Achar o trecho baixo da cerca.', vai:'c19_barranco'}
  ]
},

c19_fotografou_etiqueta:{
  texto:[
    'Você usa quatro poses da descartável na mesma etiqueta, com foco diferente, porque não dá para conferir depois.',
    'A quinta você usa na caçamba inteira, com a placa da estação ao fundo, para que a foto diga onde foi.',
    'Isso você aprendeu com alguém, em algum lugar, e agora faz sem pensar.'
  ],
  ef:{flag:['provas_do_viveiro','fotografou_o_lixo'], perdeItens:{'Câmera descartável':1},
      rep:{eixo:'bom',delta:1,motivo:'Fotografou a etiqueta com a placa da estação no fundo'},
      registrar:'Fotografou a etiqueta do saco com a placa da estação ao fundo.'},
  escolhas:[
    {texto:'Ir para o portão.', vai:'c19_cerca'},
    {texto:'Achar o trecho baixo da cerca.', vai:'c19_barranco'}
  ]
},

c19_lixo_comum:{
  texto:[
    'A caçamba comum é a mais honesta de todas.',
    'Embalagem de ração de alto teor, doze sacos. Copo descartável aos montes. Um chinelo de dedo solteiro. Uma revista de palavras cruzadas quase toda preenchida, com a caligrafia caprichada de alguém que gosta.',
    'Um cartão de aniversário assinado por dezenove pessoas, para uma tal de Elda.',
    'Você lê os dezenove nomes e as dezenove frases curtas.',
    'A décima quarta diz: fica bem, a gente segura aqui.'
  ],
  ef:{flag:'leu_o_cartao', instabilidade:1,
      registrar:'Um cartão de aniversário assinado por dezenove colegas, jogado fora.'},
  escolhas:[
    {texto:'Guardar o cartão.', vai:'c19_guardou_cartao'},
    {texto:'Forçar a caçamba laranja.', vai:'c19_abriu_a_laranja'},
    {texto:'Voltar ao portão.', vai:'c19_cerca'}
  ]
},

c19_guardou_cartao:{
  texto:[
    'Você guarda o cartão sem saber direito por quê.',
    'Dezenove pessoas assinaram. Dezenove pessoas se cotizaram, compraram um cartão, escreveram cada uma a sua frase, e depois o cartão foi para o lixo, porque cartão sempre vai.',
    d=>d.flags.cracha_adnan
      ? 'Você está usando o crachá dessa mulher no pescoço.'
      : 'A Elda está de licença. Alguém escreveu que a equipe segura enquanto ela não volta.'
  ],
  ef:{itens:{'Cartão de aniversário da Elda':1}, moral:-1,
      registrar:'Guardou o cartão de aniversário que dezenove colegas assinaram.'},
  escolhas:[
    {texto:'Voltar ao portão.', vai:'c19_cerca'},
    {texto:'Achar o trecho baixo da cerca.', vai:'c19_barranco'}
  ]
},

c19_empresa_do_lixo:{
  texto:[
    'A caçamba laranja tem um adesivo com o nome da empresa coletora, o número do contrato e a frequência.',
    'Sanear Ambiental. Contrato 118/CGRB. Coleta: segundas e quintas.',
    'Você anota. Uma empresa que recolhe resíduo biológico é obrigada a manifestar o que recolheu, para onde levou e quanto pesou.',
    'Existe, em algum arquivo de alguma empresa de Saffron, uma pilha de manifestos com o peso exato de cada semana da Estação 4.',
    'Peso. É a única medida que ninguém consegue maquiar, porque a balança é do aterro.'
  ],
  ef:{flag:['sabe_da_sanear','ideia_do_manifesto'],
      rep:{eixo:'bom',delta:1,motivo:'Entendeu que o peso é a prova que ninguém controla'},
      registrar:'Sanear Ambiental, contrato 118/CGRB, coleta às segundas e quintas. Eles pesam.'},
  escolhas:[
    {texto:'Voltar ao portão.', vai:'c19_cerca'},
    {texto:'Forçar a caçamba laranja.', vai:'c19_abriu_a_laranja'},
    {texto:'Achar o trecho baixo da cerca.', vai:'c19_barranco'}
  ]
},

c19_barranco:{
  texto:[
    'O trecho leste é como estava no croqui: o barranco faz o trabalho e a cerca ali tem um metro e vinte.',
    'Embaixo, sete metros de queda até a pedra, e a pedra está molhada porque a maré bateu há pouco.',
    'Não é intransponível. É só honesto: dá para subir, e se você errar, você cai sete metros.',
    'Tem uma trilha fina de bicho passando rente à cerca, do lado de fora, que ninguém fez de propósito.'
  ],
  ef:{flag:'achou_o_barranco',
      registrar:'Trecho leste: cerca de 1,20 m sobre um barranco de sete metros.'},
  escolhas:[
    {texto:'Subir por aqui.', vai:'c19_cerca_mar'},
    {texto:'Seguir a trilha de bicho.', vai:'c19_trilha_de_bicho'},
    {texto:'Voltar ao portão.', vai:'c19_cerca'}
  ]
},

c19_trilha_de_bicho:{
  texto:[
    'A trilha acompanha a cerca por uns oitenta metros e termina num ponto onde a tela foi levantada por baixo, na marra, por alguma coisa com força.',
    'O buraco tem meio metro e foi remendado com arame, e o remendo foi arrebentado de novo, e remendado de novo, três camadas.',
    'Eles não conseguem impedir. Alguma coisa entra e sai daqui toda semana.',
    'E, do lado de dentro, o mato está pisado num círculo, do jeito que fica quando um bicho deita sempre no mesmo lugar.'
  ],
  ef:{flag:['achou_o_buraco','tem_bicho_entrando'], instabilidade:1,
      registrar:'Um buraco na cerca, remendado três vezes, com mato pisado do lado de dentro.'},
  escolhas:[
    {texto:'Entrar pelo buraco.', vai:'c19_entrou_pelo_buraco'},
    {texto:'Esperar para ver o que usa esse buraco.', vai:'c19_esperou_o_bicho'},
    {texto:'Voltar ao portão.', vai:'c19_cerca'}
  ]
},

c19_esperou_o_bicho:{
  texto:[
    'Você espera uma hora e quarenta encostad{o|a} num tronco, e às onze e dez ele aparece.',
    'É um Persian silvestre, grande, com uma orelha rasgada de briga velha.',
    'Ele passa pelo buraco com a intimidade de quem faz isso todo dia, anda uns quinze metros para dentro do terreno e senta no círculo de mato pisado, olhando o galpão 3.',
    'Fica ali quarenta minutos, olhando trinta e poucos bichos atrás de um vidro que nunca viram um bicho de verdade.',
    'Depois levanta, volta pelo buraco, e some no mato.'
  ],
  ef:{flag:['viu_o_persian'], instabilidade:1,
      registrar:'Um Persian silvestre entra todo dia pelo buraco só para olhar o galpão 3.'},
  escolhas:[
    {texto:'Entrar pelo buraco.', vai:'c19_entrou_pelo_buraco'},
    {texto:'Seguir o Persian.', vai:'c19_seguiu_o_persian'},
    {texto:'Voltar ao portão.', vai:'c19_cerca'}
  ]
},

c19_seguiu_o_persian:{
  texto:[
    'Você segue o Persian por uns duzentos metros mato adentro, com o cuidado de quem já aprendeu a seguir bicho e ainda assim sendo percebido o tempo inteiro.',
    'Ele para numa clareira e se vira para você, e não é ameaça: é o olhar de quem está esperando que você entenda.',
    'Na clareira tem três covas rasas, cobertas de galho.',
    'São bichos. São da mesma espécie, do mesmo tamanho, e nenhum deles tem marca de briga.',
    'Alguém enterrou três unidades fora da cerca, mal, com pressa.'
  ],
  ef:{flag:['achou_as_covas'], instabilidade:2, moral:-3,
      registrar:'Três covas rasas fora da cerca, três unidades enterradas com pressa.'},
  escolhas:[
    {texto:'Abrir uma cova.', vai:'c19_abriu_a_cova'},
    {texto:'Cobrir direito e marcar o lugar.', vai:'c19_cobriu_direito'},
    {texto:'Voltar para a cerca.', vai:'c19_barranco'}
  ]
},

c19_abriu_a_cova:{
  texto:[
    'Você abre a primeira com as mãos e um galho, e para no primeiro palmo.',
    'Não é o que você esperava. É um Rattata, e ele está inteiro, e não tem ferimento nenhum.',
    'No pescoço tem uma anilha plástica com um número.',
    '41-C-07.',
    'A mesma sequência que estava no saco da caçamba, e um número de ordem.'
  ],
  ef:{flag:['viu_a_anilha','sabe_do_lote_41c'], instabilidade:2, moral:-4,
      itens:{'Anilha 41-C-07':1},
      registrar:'Anilha 41-C-07 no pescoço de um Rattata enterrado fora da cerca.'},
  escolhas:[
    {texto:'Levar a anilha e cobrir de novo.', vai:'c19_cobriu_direito'},
    {texto:'Abrir as outras duas.', vai:'c19_abriu_as_outras'},
    {texto:'Voltar para a cerca.', vai:'c19_barranco'}
  ]
},

c19_abriu_as_outras:{
  texto:[
    'As outras duas são iguais. Mesma espécie, mesmo tamanho, mesma anilha, números 08 e 09.',
    'Sete, oito e nove.',
    'O que quer dizer que existem, em algum lugar, um, dois, três, quatro, cinco e seis, e provavelmente dez até catorze.',
    'Você senta no chão da clareira com as mãos sujas e fica assim um tempo.',
    'O Persian está a uns dez metros, sentado, esperando você terminar.'
  ],
  ef:{instabilidade:2, moral:-4,
      registrar:'As três covas têm as anilhas 07, 08 e 09 do mesmo lote.'},
  escolhas:[
    {texto:'Cobrir tudo direito.', vai:'c19_cobriu_direito'},
    {texto:'Voltar para a cerca agora.', vai:'c19_barranco'}
  ]
},

c19_cobriu_direito:{
  texto:[
    'Você cobre as três direito, com terra de verdade, e põe uma pedra em cima de cada.',
    'Leva quarenta minutos e é a única coisa que você vai fazer hoje que não serve para prova nenhuma.',
    'Quando termina, o Persian já foi embora.',
    'Você marca o lugar no caderno com referência de árvore e distância da cerca, porque um dia alguém pode precisar achar.'
  ],
  ef:{flag:['marcou_as_covas'], moral:4,
      rep:{eixo:'bom',delta:2,motivo:'Enterrou direito três bichos que ninguém ia enterrar'},
      registrar:'Cobriu as três covas direito e marcou o lugar no caderno.'},
  escolhas:[
    {texto:'Entrar pelo buraco.', vai:'c19_entrou_pelo_buraco'},
    {texto:'Voltar ao portão.', vai:'c19_cerca'}
  ]
},

c19_entrou_pelo_buraco:{
  texto:[
    'Você levanta a tela e entra de lado, e do lado de dentro o mato é o mato estranho: todos os arbustos na mesma distância, na mesma altura.',
    'Você atravessa cento e vinte metros sem que nada aconteça, o que é estranho, porque cento e vinte metros de mato deveriam ter alguma coisa.',
    'Não tem bicho. É isso. Não tem inseto, não tem Pidgey, não tem barulho nenhum a não ser o vento e o mar.',
    'Eles plantaram o mato e esqueceram de plantar o resto.'
  ],
  ef:{flag:['entrou_pelo_buraco'], instabilidade:1,
      registrar:'Entrou pelo buraco da cerca. O mato de dentro não tem inseto nenhum.'},
  escolhas:[{texto:'Seguir para os galpões.', vai:'c19_dentro'}]
},

/* ── Entrar pela cerca do mar ───────────────────────────── */
c19_cerca_mar:{
  texto:[
    'Pelo lado do mar a cerca chega até a pedra e a pedra é escorregadia.',
    'São sete metros de barranco, um metro e vinte de tela, e a maré subindo.',
    'Dá. Dá se você não errar.'
  ],
  teste:{status:'forca', dificuldade:7, nomeStatus:'Força',
         critico:'c19_subiu_limpo', sucesso:'c19_dentro', parcial:'c19_dentro_visto', falha:'c19_caiu'}
},

c19_subiu_limpo:{
  texto:[
    'Você sobe sem barulho nenhum e cai do outro lado agachad{o|a}, e leva quatro segundos para entender que está dentro.',
    'De dentro, o lugar é ainda mais tranquilo do que de fora.',
    'A quinze metros, uma mulher de macacão está sentada num caixote virado, de costas para você, almoçando marmita às dez e meia da manhã, porque o turno dela começou às quatro.',
    'Ela não te vê. Você tem escolha.'
  ],
  ef:{flag:'entrou_limpo',
      registrar:'Subiu a cerca do mar sem ser visto.'},
  escolhas:[
    {texto:'Passar sem que ela perceba.', vai:'c19_dentro'},
    {texto:'Falar com ela.', vai:'c19_mulher_da_marmita'}
  ]
},

c19_mulher_da_marmita:{
  falante:'a mulher da marmita',
  vozes:['N','N','N'],
  texto:[
    'Você diz bom dia e ela leva um susto que derruba metade do arroz.',
    'Depois olha você de cima a baixo, olha a cerca, olha você de novo, e a conclusão dela é imediata e errada.',
    '"Você é da Sanear?"',
    'Você não responde nem sim nem não.',
    '"Eles sempre entram por aí mesmo, porque o caminhão não manobra lá atrás." Ela volta para a marmita. "A caçamba está cheia, viu? Está cheia desde segunda. Reclama com o escritório, não comigo."'
  ],
  ef:{flag:['passou_por_da_sanear','sabe_da_sanear'],
      registrar:'Passou por funcionário da Sanear. A caçamba está cheia desde segunda.'},
  escolhas:[
    {texto:'"Por que está cheia desde segunda?"', vai:'c19_porque_cheia'},
    {texto:'Seguir para os galpões.', vai:'c19_dentro'}
  ]
},

c19_porque_cheia:{
  falante:'a mulher da marmita',
  vozes:['N','N','P','N'],
  texto:[
    '"Porque teve lote grande." Ela fala de boca cheia, sem nenhum peso. "Quarenta e um C. Veio tudo errado."',
    '"Errado como?"',
    'Ela para de mastigar e olha para você com a primeira desconfiança do dia.',
    '"Você é da Sanear ou você é do quê?"',
    'E aí vocês dois ficam se olhando por uns três segundos que duram muito mais que três segundos.'
  ],
  ef:{flag:'sabe_do_lote_41c'},
  escolhas:[
    {texto:'"Eu sou de fora. Me conta."', vai:'c19_ela_conta'},
    {texto:'"Da Sanear." E mentir até o fim.', vai:'c19_mentiu_sanear'},
    {texto:'Sair andando.', vai:'c19_dentro'}
  ]
},

c19_ela_conta:{
  texto:[
    'Ela tampa a marmita e olha para os lados sem nenhum disfarce, do jeito que gente que nunca precisou disfarçar olha para os lados.',
    '"O quarenta e um C foi um lote de duzentos. Deu problema de bico, de pata, deu de tudo."',
    '"E aí?"',
    '"E aí não passou. Catorze na segunda, catorze na quarta, catorze ontem." Ela conta nos dedos e a conta a incomoda. "Eles gostam de catorze porque é o que cabe na caçamba sem passar do peso."',
    'Ela pega a marmita e levanta.',
    '"Olha, eu preciso do meu emprego. Eu tenho dois filhos. Eu não vi você."'
  ],
  ef:{flag:['sabe_do_lote_41c','sabe_do_catorze'], instabilidade:2, moral:-3,
      npc:{nome:'a operária do turno da madrugada', opiniao:1, memoria:'Te contou do lote 41-C e disse que não te viu.'},
      registrar:'O lote 41-C deu problema. Catorze por dia, porque catorze é o que cabe no peso da caçamba.'},
  escolhas:[
    {texto:'"Qual o seu nome?"', vai:'c19_nome_dela'},
    {texto:'Deixá-la ir e seguir para os galpões.', vai:'c19_dentro'}
  ]
},

c19_nome_dela:{
  texto:[
    'Ela para.',
    '"Pra quê?"',
    '"Pra eu saber a quem agradecer."',
    'Ela pensa um tempo comprido demais para uma pergunta tão simples.',
    '"Thea." Ela põe a marmita debaixo do braço. "Thea Larkin, do turno da madrugada. E se aparecer o meu nome em algum lugar, eu vou dizer que é mentira, e eu quero que {o senhor|a senhora} entenda por quê."',
    '"Eu entendo."',
    '"Então tá." Ela vai embora. "Galpão do fundo. A porta não tranca."'
  ],
  ef:{flag:['conhece_a_rute','sabe_do_galpao_do_fundo'],
      npc:{nome:'Thea Larkin', opiniao:2, memoria:'Te deu o nome dela sabendo que ia negar depois.'},
      registrar:'Thea Larkin, turno da madrugada. A porta do galpão do fundo não tranca.'},
  escolhas:[{texto:'Seguir para os galpões.', vai:'c19_dentro'}]
},

c19_mentiu_sanear:{
  texto:[
    '"Da Sanear."',
    'Ela aceita na hora, porque não tinha motivo nenhum para não aceitar, e volta para a marmita.',
    'Você segue para os galpões com a informação que queria e com uma sensação nova e desagradável.',
    'A sensação é a de ter usado uma mulher que almoça às dez e meia da manhã porque o turno dela começou às quatro.'
  ],
  ef:{flag:'mentiu_pra_rute', moral:-2,
      registrar:'Mentiu para a operária do turno da madrugada.'},
  escolhas:[{texto:'Seguir para os galpões.', vai:'c19_dentro'}]
},

c19_caiu:{
  texto:[
    'Você escorrega na pedra molhada e cai três metros dentro do terreno, do lado bom do barranco, o que é sorte.',
    'O barulho é grande. Duas pessoas de macacão aparecem em quarenta segundos.',
    'Eles não te agridem. Um deles pergunta se você quebrou alguma coisa. O outro já está falando no rádio pedindo a maca.',
    'Você é atendid{o|a} numa enfermaria com maca de verdade e material em dia, enfaixad{o|a} por um rapaz de vinte e poucos anos que pede desculpa pela cerca ser perigosa ali.',
    '"A gente já pediu tela mais alta três vezes", ele diz. "Não sai do orçamento."'
  ],
  ef:{hp:-6, causa:'Queda na cerca da Estação 4', flag:'caiu_na_estacao'},
  escolhas:[
    {texto:'Deixar que te levem até a portaria.', vai:'c19_escoltado'},
    {texto:'"Já que estou dentro, eu posso ver?"', vai:'c19_pediu_dentro'},
    {texto:'Perguntar o nome do rapaz da enfermaria.', vai:'c19_ivo'}
  ]
},

c19_ivo:{
  texto:[
    '"Janus." Ele termina a atadura e prende com esparadrapo. "Eu sou auxiliar. Faço enfermaria de gente e enfermaria de bicho, o que dá quase o mesmo trabalho."',
    '"Vocês machucam muita gente aqui?"',
    '"Vinte e quatro dias sem acidente." Ele aponta o quadro da parede, que tem o mesmo giz da guarita. "E agora eu vou ter que zerar por sua causa, e o pessoal vai me odiar."',
    'Ele diz isso rindo. É uma piada de gente que trabalha junto.',
    'Você ri também, sem querer, e depois passa o resto do dia com essa risada entalada.'
  ],
  ef:{flag:'conheceu_ivo',
      npc:{nome:'Janus', opiniao:1, memoria:'Auxiliar de enfermaria da Estação 4. Te enfaixou e fez piada.'},
      registrar:'Janus, auxiliar de enfermaria. Cuida de gente e de bicho.'},
  escolhas:[
    {texto:'"Você faz enfermaria de bicho. Me conta do galpão do fundo."', vai:'c19_ivo_galpao'},
    {texto:'"Já que estou dentro, eu posso ver?"', vai:'c19_pediu_dentro'},
    {texto:'Deixar que te levem à portaria.', vai:'c19_escoltado'}
  ]
},

c19_ivo_galpao:{
  texto:[
    'O rosto dele muda tão rápido que dá para ver o momento.',
    '"Eu não entro lá."',
    '"Por quê?"',
    '"Porque eu sou da enfermaria." Ele arruma o material na bandeja, sem precisar arrumar. "Enfermaria é onde a gente conserta. Lá não é enfermaria."',
    'Ele fecha a bandeja.',
    '"Eu já pedi transferência de setor duas vezes e as duas vezes por escrito, e as duas vezes deferiram, e é por isso que eu não entro lá. Eles deixam a gente não entrar."',
    'Ele olha para você pela primeira vez desde que começou a falar.',
    '"E é isso que me deixa doido. Se eles obrigassem, eu saía."'
  ],
  ef:{flag:['sabe_do_galpao_do_fundo','entende_o_ivo'], instabilidade:2,
      npc:{nome:'Janus', opiniao:2, memoria:'Te contou que eles deixam você não entrar, e que é isso que o prende.'},
      registrar:'Janus pediu duas transferências e as duas foram deferidas. Ninguém é obrigado a entrar no galpão do fundo.'},
  escolhas:[
    {texto:'"Me leva até lá mesmo assim."', vai:'c19_ivo_leva'},
    {texto:'"Já que estou dentro, eu posso ver o resto?"', vai:'c19_pediu_dentro'},
    {texto:'Ir sozinh{o|a}.', vai:'c19_dentro'}
  ]
},

c19_ivo_leva:{
  texto:[
    'Ele te leva até o corredor coberto e para a dez metros da porta de aço, e não dá mais um passo.',
    '"Daqui eu não passo."',
    'Ele enfia as mãos nos bolsos.',
    '"Se alguém te perguntar, eu estava levando {o senhor|a senhora} para a portaria e {o senhor|a senhora} fugiu. Fala assim mesmo: fugiu. Eu não vou ser demitido por isso."',
    'Ele espera você entender que já acabou.',
    '"Boa sorte. E se {o senhor|a senhora} vomitar, tem uma torneira do lado de fora."'
  ],
  ef:{flag:'ivo_te_levou',
      npc:{nome:'Janus', opiniao:3, memoria:'Te levou até dez metros da porta e ensinou o que dizer para protegê-lo.'},
      registrar:'Janus te levou até dez metros da porta do galpão do fundo.'},
  escolhas:[
    {texto:'Entrar no galpão do fundo.', vai:'c19_galpao'},
    {texto:'Ver o resto da estação antes.', vai:'c19_dentro'}
  ]
},

c19_escoltado:{
  texto:[
    'Eles te escoltam até a portaria com uma educação que não deixa brecha nenhuma.',
    'Na guarita, o porteiro te oferece água, anota seu nome num livro de ocorrência e pede que você assine.',
    'Você lê o que ele escreveu antes de assinar: pessoa não identificada acessou o perímetro pelo trecho leste, sofreu queda, foi atendida na enfermaria, foi conduzida à saída sem incidentes. Sem dano ao patrimônio.',
    'É um relato honesto. Não tem uma palavra de mentira nele.',
    'Você assina.'
  ],
  ef:{flag:'consta_no_livro',
      registrar:'Seu nome consta no livro de ocorrência da Estação 4.'},
  escolhas:[
    {texto:'Pedir a visita monitorada, já que estão sendo tão gentis.', vai:'c19_pedir'},
    {texto:'Tentar de novo pelo caminhão.', vai:'c19_caminhao'},
    {texto:'Tentar de novo pela cerca.', vai:'c19_cerca_mar'}
  ]
},

c19_pediu_dentro:{
  texto:[
    '"Já que eu estou dentro, eu posso ver?"',
    'O rapaz da enfermaria olha para o colega. O colega dá de ombros.',
    '"Tem que ser com acompanhante", diz o colega. "Regra é regra. Mas acompanhante sou eu, então tá."',
    'Ele se chama Pascal, é técnico do galpão 2, tem uma caneta no bolso e três canetas na prancheta.',
    '"Só não me faz perder o horário da pesagem das onze."'
  ],
  ef:{flag:'tem_acompanhante',
      npc:{nome:'Pascal', opiniao:1, memoria:'Te acompanhou pela estação porque regra é regra.'},
      registrar:'Pascal, técnico do galpão 2, virou seu acompanhante.'},
  escolhas:[{texto:'Ir com ele.', vai:'c19_dentro'}]
},

c19_dentro_visto:{
  texto:[
    'Você entra, e um técnico te vê de longe e acena.',
    'Acena. Porque você está dentro de uma área restrita e portanto deve ser autorizad{o|a}, porque pessoas não autorizadas não estão dentro de áreas restritas.',
    'Você acena de volta.',
    'Essa é a falha de segurança mais eficaz que existe e não custou nada a ninguém.'
  ],
  ef:{flag:'entrou_acenando'},
  escolhas:[{texto:'Ir adiante.', vai:'c19_dentro'}]
},

/* ── Caminhão ───────────────────────────────────────────── */
c19_caminhao:{
  texto:[
    'O caminhão de insumos chega às onze em ponto. Ração, meio de cultura, embalagem, dois engradados de material de limpeza.',
    'O motorista desce, entrega o canhoto na guarita, acende um cigarro e espera, porque a descarga é feita pelo pessoal de dentro e ele não ajuda, porque não é a função dele.',
    'Você tem entre três e quatro minutos.'
  ],
  escolhas:[
    {texto:'Entrar a pé, encostad{o|a} na lateral do caminhão.', vai:'c19_entrou_pelo_caminhao'},
    {texto:'Subir na carroceria e sair lá dentro.', vai:'c19_carroceria'},
    {texto:'Puxar assunto com o motorista.', vai:'c19_motorista'},
    {texto:'Desistir e ir pela cerca.', vai:'c19_cerca_mar'}
  ]
},

c19_motorista:{
  texto:[
    'O motorista se chama Sr. Yves, tem uns sessenta anos, e faz essa rota há catorze meses.',
    '"Toda terça e sexta." Ele bate a cinza. "É o melhor cliente que eu tenho. Descarrega rápido, assina na hora, e tem café."',
    '"O senhor já entrou lá dentro?"',
    '"Até o pátio. Do pátio pra dentro eu não entro e não quero."',
    '"Por quê?"',
    'Ele dá uma tragada comprida.',
    '"Porque uma vez eu ouvi." Ele não explica o quê. "E a minha função é entregar."'
  ],
  ef:{flag:'conheceu_olegario',
      npc:{nome:'Sr. Yves', opiniao:1, memoria:'Faz a rota de insumos da Estação 4 e não entra do pátio para dentro.'},
      registrar:'O Sr. Yves entrega na Estação 4 toda terça e sexta e não passa do pátio.'},
  escolhas:[
    {texto:'"O que o senhor ouviu?"', vai:'c19_o_que_ele_ouviu'},
    {texto:'"Me deixa entrar com o senhor."', vai:'c19_pediu_carona'},
    {texto:'Entrar sozinh{o|a}, a pé, encostad{o|a} na lateral.', vai:'c19_entrou_pelo_caminhao'}
  ]
},

c19_o_que_ele_ouviu:{
  texto:[
    'Ele demora, e quando fala, fala olhando o para-choque.',
    '"Eu estava esperando o canhoto e veio do fundo. Não é grito. É pior. É um barulho de muita coisa pequena junta, que não vai a lugar nenhum."',
    'Ele apaga o cigarro na sola da bota e guarda a guimba no bolso, porque é de uma geração que guarda.',
    '"Eu perguntei pro rapaz da guarita o que era e ele disse: é o galpão três, os bichos são assim mesmo."',
    '"E o senhor acreditou?"',
    '"Eu acreditei." Ele abre a porta da cabine. "Eu acreditei porque eu tenho catorze meses de contrato e um neto."'
  ],
  ef:{instabilidade:1, moral:-2,
      registrar:'O Sr. Yves ouviu o barulho do galpão e acreditou na explicação porque precisava acreditar.'},
  escolhas:[
    {texto:'"Me deixa entrar com o senhor."', vai:'c19_pediu_carona'},
    {texto:'Entrar sozinh{o|a}.', vai:'c19_entrou_pelo_caminhao'}
  ]
},

c19_pediu_carona:{
  texto:[
    '"Me deixa entrar com o senhor."',
    'Ele olha para você por uns bons cinco segundos.',
    '"Não."',
    'E antes que você diga qualquer coisa, ele continua, sem raiva:',
    '"Se {o senhor|a senhora} entrar comigo e der problema, o problema é da transportadora e a transportadora sou eu com um caminhão financiado."',
    'Ele sobe na cabine e fecha a porta. Depois abaixa o vidro.',
    '"Eu vou levar sete minutos pra manobrar ali atrás, e eu vou olhar pro outro lado o tempo inteiro, porque manobra exige."'
  ],
  ef:{flag:'olegario_olhou_pro_outro_lado',
      npc:{nome:'Sr. Yves', opiniao:2, memoria:'Recusou te levar e depois te deu sete minutos.'},
      registrar:'O Sr. Yves recusou a carona e te deu sete minutos de manobra.'},
  escolhas:[{texto:'Usar os sete minutos.', vai:'c19_entrou_pelo_caminhao'}]
},

c19_entrou_pelo_caminhao:{
  texto:[
    'Você entra a pé, encostad{o|a} na lateral do caminhão, andando no ritmo dele, e ninguém olha.',
    'Ninguém olha porque ninguém aqui está esperando invasão.',
    'É uma estação de pesquisa numa rota litorânea. O sistema de segurança foi desenhado contra vandalismo de adolescente e contra bicho saindo, e não contra uma pessoa adulta andando devagar com cara de quem trabalha ali.'
  ],
  ef:{flag:'entrou_com_caminhao'},
  escolhas:[{texto:'Seguir para dentro.', vai:'c19_dentro'}]
},

c19_carroceria:{
  texto:[
    'Você sobe na carroceria e se enfia entre dois engradados de material de limpeza.',
    'O caminhão anda oitenta metros, para, e a descarga começa.',
    'Duas pessoas tiram os engradados um por um, conversando sobre um jogo, e quando chegam nos seus, você está agachad{o|a} atrás.',
    'O rapaz que pega o engradado da frente olha direto para você.',
    'Ele pisca. Depois grita para o colega: "esse aqui vai pro almoxarifado, deixa que eu levo."',
    'E leva o engradado embora, sem olhar para trás.'
  ],
  ef:{flag:['entrou_na_carroceria','alguem_te_viu_e_deixou'], instabilidade:1,
      registrar:'Um funcionário te viu na carroceria, piscou e cobriu você.'},
  escolhas:[
    {texto:'Sair de trás dos engradados.', vai:'c19_dentro'},
    {texto:'Esperar ele voltar.', vai:'c19_esperou_o_rapaz'}
  ]
},

c19_esperou_o_rapaz:{
  texto:[
    'Ele volta em seis minutos, sozinho, com uma garrafa de água.',
    '"Toma." Ele entrega. "Você é jornalista?"',
    '"Não."',
    '"Que pena." Ele se apoia na carroceria. "Eu esperava jornalista faz um ano."',
    '"Por quê?"',
    '"Porque jornalista eu podia falar sem assinar nada." Ele olha o relógio. "Com {o senhor|a senhora} eu não sei o que eu faço."',
    'Ele pensa um pouco.',
    '"Galpão quatro. Porta de aço, no fundo. Não tranca e nunca trancou, e todo mundo aqui sabe, e é isso que estraga a gente."'
  ],
  ef:{flag:['sabe_do_galpao_do_fundo','rapaz_esperava_jornalista'], instabilidade:1,
      npc:{nome:'o rapaz da descarga', opiniao:2, memoria:'Esperava um jornalista havia um ano.'},
      registrar:'Um funcionário esperava um jornalista havia um ano.'},
  escolhas:[{texto:'Seguir para dentro.', vai:'c19_dentro'}]
},

/* ── A visita monitorada ────────────────────────────────── */
c19_pedir:{
  texto:[
    'Você bate na portaria e pede para ver.',
    'O porteiro se chama Sr. Delmar, tem uma televisão pequena ligada sem som e um livro de ocorrência aberto.',
    'Ele liga para alguém. Alguém liga para outro alguém. Em onze minutos, uma técnica de jaleco vem até o portão a pé, sorrindo de um jeito que é profissional e verdadeiro ao mesmo tempo.',
    '"A gente faz visita monitorada às quintas, das duas às quatro." Ela estende a mão. "Kira. Posso agendar?"',
    '"Hoje é quinta."',
    'O sorriso não cai, mas atrasa meio segundo.',
    '"Então venha. Sério. A gente tem orgulho do que faz aqui."'
  ],
  ef:{flag:'visita_monitorada',
      npc:{nome:'Kira', opiniao:1, memoria:'Te convidou para a visita monitorada e tem orgulho do lugar.'},
      registrar:'Kira, técnica, te levou para a visita monitorada.'},
  escolhas:[
    {texto:'Aceitar a visita.', vai:'c19_visita'},
    {texto:'"Antes: o senhor porteiro me deixa ver o livro de ocorrência?"', vai:'c19_livro_damiao'},
    {texto:'"Eu prefiro entrar sozinh{o|a}." E ir pela cerca.', vai:'c19_cerca_mar'}
  ]
},

c19_livro_damiao:{
  texto:[
    'O Sr. Delmar olha para a Kira. A Kira dá de ombros: "é público para quem consta."',
    'Ele vira o livro.',
    'Três meses de ocorrências. Queda de energia. Portão emperrado. Um Persian entrando pelo trecho leste, seis vezes, sempre por volta das onze.',
    'E, catorze linhas atrás: veículo da Sanear recusou coleta por excesso de peso. Orientado a Administração.',
    'Recusou coleta por excesso de peso.'
  ],
  ef:{flag:['viu_o_livro_do_damiao','sabe_da_sanear'], instabilidade:1,
      npc:{nome:'Sr. Delmar', opiniao:1, memoria:'Te deixou ler o livro de ocorrência.'},
      registrar:'A Sanear já recusou coleta na Estação 4 por excesso de peso.'},
  escolhas:[
    {texto:'Aceitar a visita.', vai:'c19_visita'},
    {texto:'"O Persian entra sempre pelo mesmo lugar?"', vai:'c19_damiao_persian'}
  ]
},

c19_damiao_persian:{
  texto:[
    '"Todo dia." O Sr. Delmar fala do Persian com um carinho que não esconde. "A gente já remendou três vezes e ele arrebenta de novo."',
    '"E ninguém faz nada?"',
    '"Fazer o quê?" Ele ri. "É um Persian velho que vem sentar e olhar. Não come, não briga, não estraga."',
    'Ele baixa a voz sem precisar.',
    '"Eu acho que ele vem ver os outros. Tem gente aqui que acha que é bobagem minha."'
  ],
  ef:{flag:'viu_o_persian',
      registrar:'O Persian entra todo dia pelo mesmo buraco só para sentar e olhar.'},
  escolhas:[{texto:'Ir para a visita.', vai:'c19_visita'}]
},

c19_visita:{
  texto:[
    'A visita monitorada começa pelas incubadoras, e as incubadoras são bonitas.',
    'É a palavra: bonitas. Fileiras de câmaras de vidro com controle de umidade, cada uma com um ovo ou um filhote recém-saído, com a temperatura registrada a cada quinze minutos numa ficha presa na porta.',
    'A Kira explica o processo com um cuidado indistinguível de amor, e para no meio de uma frase para ajeitar uma ficha que estava torta.',
    '"A taxa de sobrevivência aqui é noventa e seis por cento." Ela fala com orgulho legítimo. "No mesmo nicho, lá fora, é trinta e um."',
    'Ela não está mentindo. Nada do que ela vai dizer nesta meia hora é mentira.'
  ],
  ef:{flag:'viu_as_incubadoras',
      registrar:'96% de sobrevivência dentro. 31% no mesmo nicho lá fora.'},
  escolhas:[
    {texto:'"De onde vêm os ovos?"', vai:'c19_de_onde_vem_os_ovos'},
    {texto:'"O que acontece com os quatro por cento?"', vai:'c19_os_quatro_por_cento'},
    {texto:'"E aquele galpão do fundo?"', vai:'c19_pergunta_galpao'},
    {texto:'Seguir a visita em silêncio.', vai:'c19_visita_bercario'}
  ]
},

c19_de_onde_vem_os_ovos:{
  texto:[
    'Ela responde sem hesitar, porque a resposta é verdadeira: "De matriz própria e de coleta autorizada."',
    '"Coleta autorizada onde?"',
    '"Zona de amortecimento de Fuchsia, principalmente. A gente tem convênio."',
    'Ela mostra uma prancheta com a origem de cada bandeja.',
    'ZS-7. ZS-7. ZS-7. ZS-7.',
    d=>d.flags.provas_zona
      ? 'Você conhece essa sigla. Você viu ela escrita à mão num caderno de Fuchsia, ao lado de um número que não fechava.'
      : 'Você não conhece a sigla e ela vai te acompanhar pelo resto do dia.',
    d=>{
      /* ninguém explicou nada pra ele; o corredor explica */
      const p = d.time[0];
      if (!p) return '';
      const n = nomeExib(p), g = pron(p), sx = generoDe(p);
      if (!sx) return `${n} passa reto pelas câmaras enquanto você lê. Não tem nada neste galpão que se pareça com ${g.ele}.`;
      return sx === 'f'
        ? `Quando você levanta o olho da prancheta, ${n} está parada na frente de uma porta de vidro no fundo do corredor, onde tem uma fêmea deitada de lado numa baia com um número pintado na porta. As duas se olham por muito tempo.`
        : `Quando você levanta o olho da prancheta, ${n} está parado na frente de uma porta de vidro no fundo do corredor, onde tem um macho sozinho numa baia com uma plaqueta: REPRODUTOR. Os dois se olham por muito tempo.`;
    }
  ],
  ef:{flag:'viu_zs7',
      registrar:'Os ovos vêm da Zona Safári, sigla ZS-7, por convênio.'},
  escolhas:[
    {texto:'"E os que não vêm de lá?"', vai:'c19_os_outros_ovos'},
    {texto:'"O que acontece com os quatro por cento?"', vai:'c19_os_quatro_por_cento'},
    {texto:'Seguir a visita.', vai:'c19_visita_bercario'}
  ]
},

c19_os_outros_ovos:{
  texto:[
    'Ela vira duas fichas antes de responder, o que é a primeira hesitação dela.',
    '"Tem uma linha de material conservado, de acervo doado." Ela escolhe cada palavra. "Essa não é a minha área. Essa é do Dr. Hollis."',
    '"Acervo doado de onde?"',
    '"Isso {o senhor|a senhora} pergunta pra ele." Ela fecha a prancheta, e o sorriso volta inteiro. "Eu cuido de umidade e de temperatura. É o que eu sei fazer bem."',
    'E é verdade. Ela cuida de umidade e de temperatura muito bem.'
  ],
  ef:{flag:'sabe_do_sena',
      registrar:'Existe uma linha de material conservado, de acervo doado, que é área do Dr. Hollis.'},
  escolhas:[
    {texto:'"O que acontece com os quatro por cento?"', vai:'c19_os_quatro_por_cento'},
    {texto:'"E aquele galpão do fundo?"', vai:'c19_pergunta_galpao'},
    {texto:'Seguir a visita.', vai:'c19_visita_bercario'}
  ]
},

c19_os_quatro_por_cento:{
  texto:[
    'A pergunta não a pega de surpresa. Nada aqui pega ninguém de surpresa, porque todo mundo já pensou em tudo isso.',
    '"Quatro por cento não vinga." Ela fala baixo, sem drama. "Ovo que não fecha, filhote que não respira. Isso acontece em qualquer lugar do mundo e aqui acontece menos."',
    '"E depois?"',
    '"Descarte de material biológico, com procedimento." Ela ajeita outra ficha. "Igual a hospital, igual a laboratório, igual a qualquer lugar que trabalha com vida."',
    'Ela olha para você.',
    '"{O senhor|A senhora} está pensando no galpão do fundo, né? Vamos até ele na hora certa. Está no roteiro."'
  ],
  ef:{flag:'ouviu_dos_quatro_por_cento', instabilidade:1,
      registrar:'Kira diz que o galpão do fundo está no roteiro da visita.'},
  escolhas:[
    {texto:'"Está no roteiro mesmo?"', vai:'c19_esta_no_roteiro'},
    {texto:'Seguir a visita.', vai:'c19_visita_bercario'}
  ]
},

c19_esta_no_roteiro:{
  texto:[
    'Ela tira uma folha dobrada do bolso do jaleco e mostra.',
    'ROTEIRO DE VISITA MONITORADA. Sete pontos, numerados, com tempo estimado de cada um.',
    'O ponto sete diz: Unidade de processamento de material não viável — apresentação da prática, sem entrada.',
    'Sem entrada.',
    '"A gente mostra a porta e explica", ela diz. "Ninguém entra, nem a gente, sem necessidade."'
  ],
  ef:{flag:['viu_o_roteiro','sabe_do_galpao_do_fundo'], instabilidade:1,
      registrar:'O roteiro de visita tem sete pontos. O sétimo é o galpão do fundo, sem entrada.'},
  escolhas:[
    {texto:'Seguir o roteiro até o ponto sete.', vai:'c19_visita_bercario'},
    {texto:'Sair do roteiro agora e ir ao galpão.', vai:'c19_saiu_do_roteiro'}
  ]
},

c19_visita_bercario:{
  texto:[
    'Ponto dois: o berçário.',
    'É uma sala grande com luz baixa e temperatura controlada, cheia de caixas acolchoadas. Em cada caixa, dois ou três filhotes.',
    'Tem três pessoas trabalhando em silêncio, e uma delas está com um Nidoran de duas semanas no colo, dando leite com seringa, do jeito que só funciona se a pessoa realmente quiser.',
    'Ela olha para você e sorri e volta para a seringa.',
    'Você fica na porta e não consegue sentir a coisa que veio sentir.'
  ],
  ef:{flag:'viu_o_bercario', instabilidade:1, moral:-1,
      registrar:'No berçário, três pessoas cuidando de filhotes em silêncio.'},
  escolhas:[
    {texto:'"Vocês dão nome?"', vai:'c19_dao_nome'},
    {texto:'Perguntar quanto tempo eles ficam aqui.', vai:'c19_quanto_tempo'},
    {texto:'Seguir para o ponto três.', vai:'c19_visita_g3'}
  ]
},

c19_dao_nome:{
  texto:[
    'As três param.',
    'A que está com a seringa responde sem levantar os olhos.',
    '"Oficialmente, não. Oficialmente é matrícula e lote."',
    'Uma pausa.',
    '"Este aqui eu chamo de Feijão." Ela ajusta o bico da seringa. "E eu sei que não devia, e eu vou continuar."',
    'A Kira não repreende. A Kira olha para o lado, para a parede, e espera.'
  ],
  ef:{flag:'feijao', instabilidade:1, moral:2,
      registrar:'Uma funcionária do berçário dá nome escondido. Este se chama Feijão.'},
  escolhas:[
    {texto:'"E o que acontece com o Feijão daqui a três meses?"', vai:'c19_o_que_acontece_com_feijao'},
    {texto:'Seguir para o ponto três.', vai:'c19_visita_g3'}
  ]
},

c19_o_que_acontece_com_feijao:{
  texto:[
    'Ela levanta os olhos pela primeira vez.',
    '"Adaptação, avaliação e liberação." Ela repete decorado. "Se ele atingir os parâmetros."',
    '"E se não atingir?"',
    'A Kira dá um passo à frente para responder por ela e a moça levanta a mão, sem drama nenhum, e a Kira para.',
    '"Se não atingir, ele não sai daqui." Ela olha o filhote. "E eu vou saber, porque eu preencho a coluna."',
    'Ela volta para a seringa.',
    '"{O senhor|A senhora} quer saber por que eu dou nome? É pra ter alguém pra quem pedir desculpa."'
  ],
  ef:{instabilidade:2, moral:-3,
      npc:{nome:'a moça do berçário', opiniao:2, memoria:'Dá nome aos filhotes para ter a quem pedir desculpa.'},
      registrar:'Ela dá nome para ter a quem pedir desculpa.'},
  escolhas:[{texto:'Seguir para o ponto três.', vai:'c19_visita_g3'}]
},

c19_quanto_tempo:{
  texto:[
    '"Quatro semanas no berçário, oito na adaptação, e aí avaliação." A Kira responde por todas. "Doze semanas do ovo à liberação, se tudo correr bem."',
    '"E se não correr?"',
    '"Aí é mais tempo, ou é menos." Ela não desvia. "Menos é o que {o senhor|a senhora} está pensando."',
    'Ela caminha para a porta.',
    '"Eu vou te falar uma coisa que eu não deveria: eu prefiro quando o visitante pergunta. O que me dá medo é o que vem e acha tudo lindo e vai embora."'
  ],
  ef:{npc:{nome:'Kira', opiniao:2, memoria:'Prefere o visitante que pergunta ao que acha tudo lindo.'},
      registrar:'Doze semanas do ovo à liberação, quando tudo corre bem.'},
  escolhas:[{texto:'Seguir para o ponto três.', vai:'c19_visita_g3'}]
},

c19_visita_g3:{
  texto:[
    'Ponto três: o galpão de adaptação.',
    'É um viveiro coberto de meio hectare, com mato plantado em grade, iluminação que imita o dia e um sistema de chuva programado para as dezesseis horas.',
    'Lá dentro tem trinta e poucos, de quatro espécies, e eles se comportam quase certo.',
    'Quase.',
    'Um Rattata corre em linha reta até a parede, para, e volta. Depois faz de novo. Depois de novo.'
  ],
  ef:{flag:'viu_o_galpao_3', instabilidade:1,
      registrar:'No galpão de adaptação, um Rattata corre até a parede e volta, sem parar.'},
  escolhas:[
    {texto:'"Por que ele faz isso?"', vai:'c19_porque_o_rattata'},
    {texto:'Contar quantos estão fazendo a mesma coisa.', vai:'c19_contou_os_repetidos'},
    {texto:'"E aquele galpão do fundo?"', vai:'c19_pergunta_galpao'},
    {texto:'Ir para o ponto sete de uma vez.', vai:'c19_saiu_do_roteiro'}
  ]
},

c19_porque_o_rattata:{
  texto:[
    'A Kira olha por um tempo antes de responder, e quando responde é técnica e é honesta.',
    '"Estereotipia." Ela fala a palavra e depois traduz sozinha. "É movimento repetitivo sem função, de bicho em espaço fechado. Dá em zoológico, dá em criadouro, dá aqui."',
    '"E tem solução?"',
    '"Enriquecimento ambiental. Espaço. Tempo." Ela conta nos dedos. "A gente faz os três e mesmo assim dá em doze por cento."',
    'Ela olha o Rattata bater na parede de novo.',
    '"E estereotipia entra na avaliação de viabilidade como comportamento fora de faixa."',
    'Ela não precisa dizer o resto.'
  ],
  ef:{flag:['sabe_da_estereotipia'], instabilidade:2, moral:-2,
      registrar:'Estereotipia dá em 12% e conta como comportamento fora de faixa na avaliação.'},
  escolhas:[
    {texto:'Contar quantos estão assim.', vai:'c19_contou_os_repetidos'},
    {texto:'"E aquele galpão do fundo?"', vai:'c19_pergunta_galpao'},
    {texto:'Ir ao ponto sete.', vai:'c19_saiu_do_roteiro'}
  ]
},

c19_contou_os_repetidos:{
  texto:[
    'Você conta.',
    'Trinta e quatro lá dentro. Quatro repetindo movimento sem função: o Rattata da parede, dois Nidoran andando em oito no mesmo canto e um Spearow que abre e fecha a asa a cada sete segundos.',
    'Quatro de trinta e quatro é quase doze por cento, exatamente como ela disse.',
    'A Kira te vê contando e não interrompe.',
    'Quando você termina, ela diz uma coisa baixinho, para você e para mais ninguém:',
    '"Eu conto todo dia. Nunca deu menos."'
  ],
  ef:{flag:'contou_os_quatro', instabilidade:2,
      npc:{nome:'Kira', opiniao:3, memoria:'Conta os mesmos quatro todo dia e nunca deu menos.'},
      rep:{eixo:'bom',delta:1,motivo:'Parou e contou, um por um'},
      registrar:'Quatro de trinta e quatro, no galpão de adaptação. Kira conta todo dia.'},
  escolhas:[
    {texto:'"E aquele galpão do fundo?"', vai:'c19_pergunta_galpao'},
    {texto:'Ir ao ponto sete.', vai:'c19_saiu_do_roteiro'},
    {texto:'Sair do roteiro e procurar o Dr. Hollis.', vai:'c19_sena'}
  ]
},

c19_pergunta_galpao:{
  texto:[
    '"E aquele galpão?"',
    'A Kira olha para onde você aponta e a resposta é boa demais para ser improvisada.',
    '"Unidade de processamento de material não viável."',
    'Ela continua sorrindo, e é a mesma pessoa que passou meia hora falando de umidade com amor.',
    '"Material não viável."',
    '"Sim." Ela consulta o relógio. "É o ponto sete. A gente chega lá."'
  ],
  ef:{flag:'ouviu_material_nao_viavel'},
  escolhas:[
    {texto:'"Eu quero entrar."', vai:'c19_quero_entrar'},
    {texto:'Ir até lá pelo roteiro.', vai:'c19_ponto_sete'},
    {texto:'Sair do roteiro e ir sozinh{o|a}.', vai:'c19_saiu_do_roteiro'}
  ]
},

c19_quero_entrar:{
  texto:[
    '"Eu quero entrar."',
    'Ela não diz não. Ela faz uma coisa pior: pensa.',
    '"{O senhor|A senhora} pode." Ela fala devagar. "A porta não tem tranca e eu não posso te impedir, porque eu não sou segurança."',
    '"Então por que a senhora está com essa cara?"',
    '"Porque eu entrei uma vez." Ela endireita o jaleco. "No terceiro mês, porque eu achei que devia. E eu não recomendo, e eu não vou te impedir, e eu vou esperar do lado de fora."',
    'Ela vira e começa a andar para lá, e você vai atrás.'
  ],
  ef:{flag:['marlene_te_leva','sabe_do_galpao_do_fundo'],
      npc:{nome:'Kira', opiniao:2, memoria:'Não te impediu e foi esperar do lado de fora.'},
      registrar:'Kira entrou uma vez, no terceiro mês. Não recomenda e não impede.'},
  escolhas:[
    {texto:'Entrar.', vai:'c19_galpao'},
    {texto:'Antes disso, ver o resto da estação.', vai:'c19_dentro'}
  ]
},

c19_ponto_sete:{
  texto:[
    'O roteiro leva vinte e dois minutos até o ponto sete, passando pelo refeitório, pela oficina e pela área de pesagem.',
    'No ponto sete, a Kira para a três metros da porta de aço, de costas para ela, e faz a apresentação da prática de frente para você.',
    'Ela fala dois minutos e meio sobre parâmetros de viabilidade, parecer veterinário, dupla assinatura e arquivo de dez anos.',
    'Ela fala tudo certo. Ela não olha para trás uma vez sequer.',
    'Quando termina, diz: "encerramos no refeitório, tem café", e espera.'
  ],
  ef:{flag:'ouviu_a_apresentacao', instabilidade:1,
      registrar:'A apresentação do ponto sete dura dois minutos e meio, de costas para a porta.'},
  escolhas:[
    {texto:'Entrar no galpão.', vai:'c19_galpao'},
    {texto:'"A senhora não olhou para trás nenhuma vez."', vai:'c19_nao_olhou'},
    {texto:'Aceitar o café e ir embora.', vai:'c19_foi_embora'}
  ]
},

c19_nao_olhou:{
  texto:[
    '"A senhora não olhou para trás nenhuma vez."',
    'Ela fica parada por uns quatro segundos.',
    '"Eu faço essa apresentação há um ano e dois meses." Ela olha as próprias mãos. "Eu fiz vinte e sete vezes. Sempre assim."',
    '"Por quê?"',
    '"Porque se eu olhar eu perco a fala." Ela endireita os ombros. "E se eu perder a fala, alguém vai ter que fazer no meu lugar, e aí vai ser alguém que não perde a fala."',
    'Ela vira e olha para a porta pela primeira vez em vinte e sete visitas.',
    'Fica assim uns segundos. Depois volta a olhar para você.',
    '"Vai lá."'
  ],
  ef:{flag:['marlene_te_leva'], instabilidade:2, moral:2,
      npc:{nome:'Kira', opiniao:4, memoria:'Olhou para a porta pela primeira vez em vinte e sete visitas.'},
      rep:{eixo:'bom',delta:1,motivo:'Fez alguém olhar para a porta'},
      registrar:'Kira fez a apresentação 27 vezes sem olhar para trás.'},
  escolhas:[
    {texto:'Entrar.', vai:'c19_galpao'},
    {texto:'Ver o resto da estação antes.', vai:'c19_dentro'}
  ]
},

c19_saiu_do_roteiro:{
  texto:[
    'Você sai do roteiro no meio de uma frase e anda em direção ao galpão do fundo.',
    'A Kira não corre atrás. Ela fica parada onde estava e diz, alto o bastante para você ouvir e baixo o bastante para não ser um grito:',
    '"Eu não vou chamar ninguém."',
    'Você para e olha para trás.',
    '"Eu não vou chamar ninguém", ela repete, "porque eu não sou obrigada a chamar e porque eu já pensei nisso antes de hoje."'
  ],
  ef:{flag:['marlene_te_deixou'],
      npc:{nome:'Kira', opiniao:3, memoria:'Deixou você sair do roteiro e disse em voz alta que não ia chamar ninguém.'},
      registrar:'Saiu do roteiro. Kira deixou.'},
  escolhas:[
    {texto:'Ir direto ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Ver o resto da estação antes.', vai:'c19_dentro'},
    {texto:'Procurar o Dr. Hollis.', vai:'c19_sena'}
  ]
},

c19_foi_embora:{
  texto:[
    'Você toma o café no refeitório, com a Kira e mais quatro pessoas que estão no intervalo, e a conversa é sobre um time de futebol e sobre o preço do ovo.',
    'Na saída, ela te dá um folheto impresso em papel bom.',
    'Tem um gráfico de sobrevivência, uma foto de um filhote no colo de alguém e a frase conservação de segunda geração.',
    'Você lê esse folheto umas quinze vezes nos dias seguintes, sempre parando na mesma linha, que é a legenda da foto: cada um deles é contado, um por um.'
  ],
  ef:{flag:'so_a_visita', itens:{'Folheto da Estação 4':1},
      registrar:'Saiu da Estação 4 com um folheto e sem entrar no galpão do fundo.'},
  escolhas:[
    {texto:'Voltar amanhã e entrar de outro jeito.', vai:'c19_cerca'},
    {texto:'Ir embora de verdade.', vai:'c19_fim'}
  ]
},

/* ── Dentro ─────────────────────────────────────────────── */
c19_dentro:{
  texto:[
    'Por dentro, a Estação 4 é um complexo de quatro galpões ligados por corredores cobertos de telha translúcida, com piso de cimento queimado e ralo a cada dez metros.',
    'Galpão 1: incubadoras. Galpão 2: berçário e laboratório. Galpão 3: adaptação, o viveiro coberto de meio hectare.',
    'Entre eles, coisas de lugar onde gente trabalha: um bebedouro, um quadro de avisos, uma vassoura encostada, um par de botas secando de cabeça para baixo.',
    d=>d.flags.sabe_do_galpao_do_fundo
      ? 'E, no fundo, o galpão 4: sem janela, com porta de aço e um sistema de ventilação grande demais para o tamanho do prédio.'
      : 'E, no fundo, um quarto galpão sem janela, que ninguém mencionou.'
  ],
  ef:{flag:'entrou_na_estacao', instabilidade:1,
      registrar:'Está dentro da Estação 4.'},
  escolhas:[
    {texto:'Ir ao galpão do fundo agora.', vai:'c19_galpao'},
    {texto:'Ver o galpão 3, o de adaptação.', vai:'c19_g3'},
    {texto:'Procurar o laboratório e o arquivo.', vai:'c19_arquivo'},
    {texto:'Ler o quadro de avisos.', vai:'c19_quadro_de_avisos'},
    {texto:'Procurar o Dr. Hollis.', vai:'c19_sena'},
    {texto:'Ir ao refeitório e ouvir.', vai:'c19_refeitorio'}
  ]
},

c19_quadro_de_avisos:{
  texto:[
    'O quadro de avisos é de cortiça e está cheio, que é como quadro de aviso fica quando tem gente que se importa.',
    'Escala de folga do mês, com nome e caneta de duas cores.',
    'Aniversariantes: seis nomes, um deles circulado com coração.',
    'Um aviso da CIPA sobre uso de luva. Um aviso de que a máquina de café quebrou e o conserto foi pedido.',
    'Uma folha datilografada, no canto, que destoa de tudo: COMUNICADO 14 — ORIENTAÇÃO SOBRE ABORDAGEM DE TERCEIROS.'
  ],
  ef:{flag:'viu_o_quadro',
      registrar:'O quadro de avisos da Estação 4: escala, aniversariantes, e um comunicado sobre abordagem de terceiros.'},
  escolhas:[
    {texto:'Ler o comunicado 14.', vai:'c19_comunicado_14'},
    {texto:'Ler a escala de folga.', vai:'c19_escala'},
    {texto:'Seguir.', vai:'c19_dentro'}
  ]
},

c19_comunicado_14:{
  texto:[
    'O comunicado tem quatro itens e é assinado pela Auditoria de Campo.',
    'Um: nenhum colaborador é obrigado a responder a perguntas de terceiros.',
    'Dois: nenhum colaborador está proibido de responder a perguntas de terceiros.',
    'Três: recomenda-se a indicação do setor competente.',
    'Quatro: qualquer contato de terceiro deve ser comunicado à Auditoria, sem juízo de valor sobre o conteúdo da conversa.',
    'Sem juízo de valor sobre o conteúdo da conversa.',
    'Eles não mandam mentir. Eles só querem saber que você esteve aqui.'
  ],
  ef:{flag:['leu_o_comunicado_14'], instabilidade:1,
      registrar:'O comunicado 14 não proíbe ninguém de falar. Só manda comunicar que alguém perguntou.'},
  escolhas:[
    {texto:'Ler a escala de folga.', vai:'c19_escala'},
    {texto:'Seguir.', vai:'c19_dentro'}
  ]
},

c19_escala:{
  texto:[
    'A escala é feita a caneta, com dois nomes por dia e as trocas remendadas com corretivo.',
    'No rodapé, num canto, escrito à mão em letra diferente: escala do 4 — voluntários.',
    'Embaixo, sete nomes.',
    'Voluntários.',
    'Ninguém é escalado para o galpão do fundo. As pessoas se oferecem.'
  ],
  ef:{flag:['sabe_dos_voluntarios'], instabilidade:2, moral:-2,
      registrar:'A escala do galpão 4 é de voluntários. Sete nomes.'},
  escolhas:[
    {texto:'Copiar os sete nomes.', vai:'c19_copiou_os_sete'},
    {texto:'Ler o comunicado 14.', vai:'c19_comunicado_14'},
    {texto:'Seguir.', vai:'c19_dentro'}
  ]
},

c19_copiou_os_sete:{
  texto:[
    'Você copia os sete nomes.',
    'Depois olha a escala geral e confere: seis dos sete também estão na escala do berçário.',
    'As mesmas pessoas que dão a mamadeira se oferecem para o galpão do fundo.',
    'Você fica um tempo com o caderno aberto sem escrever mais nada, porque a explicação óbvia é horrível e a explicação menos óbvia é pior.',
    'A menos óbvia é: elas se oferecem porque não querem que seja outro.'
  ],
  ef:{flag:'entendeu_os_voluntarios', instabilidade:2, moral:-2,
      registrar:'Seis dos sete voluntários do galpão 4 também estão na escala do berçário.'},
  escolhas:[{texto:'Seguir.', vai:'c19_dentro'}]
},

c19_refeitorio:{
  texto:[
    'O refeitório tem seis mesas de fórmica, um bebedouro, uma televisão pequena e um mural com a lista do almoço da semana.',
    'Às onze e quarenta, tem nove pessoas comendo.',
    'A conversa é sobre um time de futebol, sobre uma reforma de banheiro e sobre uma moça chamada Elda, que teve nenê e mandou foto.',
    'A foto está passando de mão em mão. Quando chega na sua, alguém te entrega naturalmente, porque você está sentad{o|a} ali.',
    'É uma criança de dois meses de olho fechado.'
  ],
  ef:{flag:'sentou_no_refeitorio', instabilidade:1,
      registrar:'Sentou no refeitório da Estação 4 e segurou a foto do filho da Elda.'},
  escolhas:[
    {texto:'Puxar assunto sobre o galpão do fundo.', vai:'c19_assunto_no_almoco'},
    {texto:'Perguntar há quanto tempo eles trabalham aqui.', vai:'c19_ha_quanto_tempo'},
    {texto:'Só ouvir.', vai:'c19_so_ouviu'},
    {texto:'Devolver a foto e sair.', vai:'c19_dentro'}
  ]
},

c19_assunto_no_almoco:{
  texto:[
    'Você diz a palavra galpão quatro e a mesa não fica em silêncio, que é o que você esperava.',
    'A mesa muda de assunto. É diferente. É mais rápido e mais suave.',
    'Alguém fala do banheiro de novo. Alguém pergunta quem vai à padaria depois.',
    'Só uma pessoa não acompanha: um homem de uns quarenta anos, na ponta, que continua olhando para o prato.',
    'Quando os outros levantam, ele fica. E quando fica só você e ele, ele fala sem levantar a cabeça.',
    '"Eu estou na escala dos voluntários e eu não vou te dizer o meu nome."'
  ],
  ef:{flag:'o_voluntario_falou',
      registrar:'Um dos voluntários do galpão 4 quis falar, sem dizer o nome.'},
  escolhas:[
    {texto:'"Por que o senhor se oferece?"', vai:'c19_porque_se_oferece'},
    {texto:'"O que acontece lá dentro?"', vai:'c19_o_que_acontece_la'},
    {texto:'Não perguntar nada e esperar.', vai:'c19_esperou_ele_falar'}
  ]
},

c19_porque_se_oferece:{
  texto:[
    '"Porque eu faço rápido."',
    'Ele empurra o prato dois centímetros.',
    '"Tem gente que demora. Tem gente que fica falando com o bicho antes, que acha que está sendo bom." Ele balança a cabeça. "Falar antes é pior. Eu faço rápido e eu faço certo e depois eu lavo tudo."',
    '"E depois?"',
    '"Depois eu vou pra casa e eu tomo banho duas vezes." Ele finalmente olha para você. "E eu jogo baralho com a minha filha e eu durmo. Eu durmo bem, e é isso que eu queria te dizer, porque {o senhor|a senhora} veio aqui querendo que eu não durma."'
  ],
  ef:{instabilidade:2, moral:-4,
      registrar:'Um voluntário do galpão 4 dorme bem e faz questão de te dizer isso.'},
  escolhas:[
    {texto:'"E por que o senhor está me contando?"', vai:'c19_porque_me_conta'},
    {texto:'"O que acontece lá dentro?"', vai:'c19_o_que_acontece_la'},
    {texto:'Levantar e ir ao galpão.', vai:'c19_galpao'}
  ]
},

c19_porque_me_conta:{
  texto:[
    'Ele demora tanto que você acha que ele não vai responder.',
    '"Porque eu durmo bem e isso não está certo."',
    'Ele junta o guardanapo em bola.',
    '"Eu durmo bem porque eu me acostumei, e eu me acostumei porque eu faço toda semana, e eu faço toda semana porque eu me ofereci." Ele solta o guardanapo. "Eu não sei onde essa conta começou e eu já não consigo desandar ela sozinho."',
    'Ele levanta a bandeja.',
    '"Se sair alguma coisa em jornal, eu vou negar tudo e eu vou continuar dormindo bem. Mas alguma coisa tem que sair."'
  ],
  ef:{flag:['voluntario_quer_que_saia'], instabilidade:1, moral:2,
      npc:{nome:'o voluntário sem nome', opiniao:2, memoria:'Quer que alguma coisa saia em jornal e vai negar tudo.'},
      registrar:'Um voluntário quer que saia em jornal e diz que vai negar tudo.'},
  escolhas:[
    {texto:'"O que acontece lá dentro?"', vai:'c19_o_que_acontece_la'},
    {texto:'Ir ao galpão.', vai:'c19_galpao'}
  ]
},

c19_o_que_acontece_la:{
  texto:[
    'Ele descreve o procedimento em quatro frases, técnico, na ordem, sem adjetivo nenhum.',
    'Conferência da anilha contra a ficha. Parecer assinado. Aplicação. Formulário.',
    '"É isso. Não tem mais nada. Não tem crueldade, não tem gente rindo, não tem música alta."',
    'Ele para.',
    '"O que tem é que são catorze por vez, e catorze por vez é muita anilha pra conferir, e no meio da conferência a gente para de ler o número e passa a ler a quantidade."',
    'Ele bate na mesa uma vez, de leve.',
    '"É aí que acaba. Não é na aplicação. É na conferência."'
  ],
  ef:{flag:['sabe_do_procedimento','sabe_do_catorze'], instabilidade:2, moral:-3,
      registrar:'O procedimento tem quatro passos. O que corrói é a conferência de catorze anilhas por vez.'},
  escolhas:[
    {texto:'"Por que o senhor está me contando?"', vai:'c19_porque_me_conta'},
    {texto:'Ir ao galpão.', vai:'c19_galpao'}
  ]
},

c19_esperou_ele_falar:{
  falante:'o voluntário sem nome',
  vozes:['N','N','N','N'],
  texto:[
    'Você não pergunta nada. Você fica sentad{o|a}.',
    'Passam dois minutos inteiros, o que num refeitório vazio é muito tempo.',
    '"Catorze anteontem." Ele diz do nada. "Catorze na segunda. Catorze na sexta passada."',
    'Ele empilha o talher no prato.',
    '"E na semana que vem vai ter de novo, porque o lote quarenta e um C não vingou e a Fase II tem data."',
    'Ele levanta.',
    '"{O senhor|A senhora} não me perguntou nada. Lembra disso se te perguntarem."'
  ],
  ef:{flag:['sabe_do_catorze','sabe_do_lote_41c'], instabilidade:2,
      rep:{eixo:'bom',delta:1,motivo:'Ficou calado até que alguém quisesse falar'},
      registrar:'Catorze anteontem, catorze na segunda, catorze na sexta passada.'},
  escolhas:[
    {texto:'"O que acontece lá dentro?"', vai:'c19_o_que_acontece_la'},
    {texto:'Ir ao galpão.', vai:'c19_galpao'}
  ]
},

c19_ha_quanto_tempo:{
  texto:[
    'A pergunta é fácil e todo mundo responde.',
    'Um ano e dois. Um ano e sete. Onze meses. Dois anos, desde a abertura. Quatro meses.',
    'O de dois anos é o mais velho da mesa e fala com orgulho de quem viu de longe.',
    '"Aqui era pasto. Pasto degradado, sem nada." Ele aponta com o garfo. "Eu plantei aquele mato ali com a minha mão."',
    '"E antes o senhor fazia o quê?"',
    '"Eu era do zoológico de Celadon." Ele volta ao prato. "Metade daqui é do zoológico."'
  ],
  ef:{flag:['metade_e_do_zoologico'],
      registrar:'Metade dos funcionários da Estação 4 veio do zoológico de Celadon, que fechou.'},
  escolhas:[
    {texto:'"O zoológico fechou por quê?"', vai:'c19_zoologico_fechou'},
    {texto:'Puxar o assunto do galpão.', vai:'c19_assunto_no_almoco'},
    {texto:'Só ouvir.', vai:'c19_so_ouviu'}
  ]
},

c19_zoologico_fechou:{
  falante:'o voluntário sem nome',
  vozes:['N','N','P','N','N','N','N'],
  texto:[
    '"Porque acabou o dinheiro." Ele dá de ombros, e o dar de ombros é mais pesado que qualquer discurso. "Município cortou, a bilheteria não pagava a ração, e no fim a gente estava comprando ração com vaquinha entre funcionário."',
    '"E os bichos?"',
    '"Distribuíram." Ele mastiga. "Alguns pra sítio particular, alguns pra outro zoológico, alguns pra lugar nenhum."',
    'Ele bebe água.',
    '"Aqui o dinheiro não falta. É a primeira vez em dezoito anos que eu não preciso fazer vaquinha pra comprar ração."',
    'Ele volta a comer.',
    '"{O senhor|A senhora} entende o que isso faz com uma pessoa?"'
  ],
  ef:{instabilidade:1, moral:-2,
      registrar:'O zoológico de Celadon fechou por falta de dinheiro. Aqui o dinheiro não falta.'},
  escolhas:[
    {texto:'"E o galpão do fundo?"', vai:'c19_assunto_no_almoco'},
    {texto:'Levantar e ir ver o resto.', vai:'c19_dentro'}
  ]
},

c19_so_ouviu:{
  texto:[
    'Você fica quarenta minutos ouvindo nove pessoas almoçarem.',
    'Ninguém fala do trabalho. É isso que você leva do refeitório: em quarenta minutos, ninguém falou uma palavra sobre o que faz aqui.',
    'Falaram de futebol, de reforma, de nenê, de um Growlithe que sumiu na vila e apareceu, de preço de ração.',
    'Em qualquer outro lugar, isso seria normal. Em qualquer outro lugar, gente não fala de trabalho no almoço.',
    'Mas você fica com a sensação de ter assistido a um acordo silencioso que ninguém precisou combinar.'
  ],
  ef:{instabilidade:1,
      registrar:'Quarenta minutos de almoço e ninguém falou uma palavra sobre o trabalho.'},
  escolhas:[
    {texto:'Puxar o assunto.', vai:'c19_assunto_no_almoco'},
    {texto:'Levantar e ir ver o resto.', vai:'c19_dentro'}
  ]
},

/* ── Galpão 3 ───────────────────────────────────────────── */
c19_g3:{
  texto:[
    'De perto, o galpão 3 é maior do que parece de fora: meio hectare coberto, com mato plantado em grade regular e um sistema de irrigação no teto.',
    'Trinta e quatro lá dentro. Quatro espécies. Nenhum deles olha para você quando você encosta no vidro.',
    'Nenhum deles olha para você porque nenhum deles aprendeu que uma sombra grande do outro lado do vidro é uma coisa com que se preocupar.',
    'Um Rattata corre em linha reta até a parede, para, e volta.'
  ],
  ef:{flag:'viu_o_galpao_3', instabilidade:1,
      registrar:'Trinta e quatro unidades no galpão de adaptação. Nenhuma reage à sua presença.'},
  escolhas:[
    {texto:'Abrir o portão e soltar todos.', vai:'c19_soltar_g3'},
    {texto:'Ficar olhando por meia hora.', vai:'c19_meia_hora'},
    {texto:'Bater no vidro.', vai:'c19_bateu_no_vidro'},
    {texto:'Procurar a ficha do galpão.', vai:'c19_ficha_do_g3'},
    {texto:'Deixar como está.', vai:'c19_dentro'}
  ]
},

c19_bateu_no_vidro:{
  texto:[
    'Você bate no vidro, duas vezes, de leve.',
    'Trinta e quatro cabeças se viram ao mesmo tempo, no mesmo instante, para o mesmo ponto.',
    'E ficam assim.',
    'Não fogem, não se escondem, não atacam. Olham, todos juntos, com a mesma expressão, esperando.',
    'Você entende, com um frio na nuca, o que eles aprenderam: que o som do vidro quer dizer comida.'
  ],
  ef:{flag:'bateu_no_vidro', instabilidade:2, moral:-3,
      registrar:'Bateu no vidro. Trinta e quatro cabeças se viraram juntas, esperando comida.'},
  escolhas:[
    {texto:'Abrir o portão.', vai:'c19_soltar_g3'},
    {texto:'Sair da frente do vidro.', vai:'c19_g3'},
    {texto:'Ficar e olhar meia hora.', vai:'c19_meia_hora'}
  ]
},

c19_meia_hora:{
  texto:[
    'Você fica meia hora.',
    'Nos primeiros dez minutos parece um viveiro comum. Nos dez seguintes você começa a ver.',
    'Ninguém disputa nada. Ninguém marca território. Ninguém esconde comida.',
    'Dois Nidoran passam a meio metro um do outro sem nenhum sinal, sem nenhum rosnado, sem nenhuma daquelas mil negociações pequenas que dois bichos da mesma espécie fazem quando se cruzam.',
    'Às dezesseis horas a chuva programada liga e todos os trinta e quatro correm para o mesmo canto, ao mesmo tempo, como se fossem uma coisa só.',
    'Foi isso que eles quiseram dizer com comportamento previsível.'
  ],
  ef:{flag:['entendeu_o_previsivel'], instabilidade:2,
      rep:{eixo:'bom',delta:1,motivo:'Ficou meia hora olhando até entender'},
      registrar:'Meia hora no vidro: não há disputa, território ou negociação. Todos correm juntos da chuva.'},
  escolhas:[
    {texto:'Abrir o portão.', vai:'c19_soltar_g3'},
    {texto:'Procurar a ficha do galpão.', vai:'c19_ficha_do_g3'},
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'}
  ]
},

c19_ficha_do_g3:{
  texto:[
    'A ficha do galpão está presa num porta-documento ao lado da porta, plastificada, com um pano pendurado para limpar.',
    'GALPÃO 3 — ADAPTAÇÃO. Lote 41-C. Entrada: 200. Presentes: 34.',
    'Duzentos na entrada. Trinta e quatro presentes.',
    'Embaixo, três colunas de destino: LIBERADOS — 109. TRANSFERIDOS — 15. BAIXA — 42.',
    'Cento e nove mais quinze mais quarenta e dois mais trinta e quatro dá duzentos.',
    'A conta fecha. É a coisa mais horrível de uma planilha: a conta sempre fecha.'
  ],
  ef:{flag:['viu_a_ficha_do_g3','sabe_do_lote_41c'], instabilidade:2,
      registrar:'Lote 41-C: 200 na entrada, 109 liberados, 15 transferidos, 42 baixas, 34 presentes.'},
  escolhas:[
    {texto:'Copiar a ficha inteira.', vai:'c19_copiou_a_ficha'},
    {texto:'Levar a ficha.', vai:'c19_levou_a_ficha'},
    {texto:'Deixar e ir ao galpão do fundo.', vai:'c19_galpao'}
  ]
},

c19_copiou_a_ficha:{
  texto:[
    'Você copia a ficha inteira, com as colunas, e depois copia também o cabeçalho e o rodapé, que trazem o número do lote, a data de entrada e a assinatura de quem confere.',
    'A assinatura é a mesma dos formulários.',
    'Copiar é pior que levar, porque copiar demora, e no tempo em que você demora você lê tudo duas vezes.'
  ],
  ef:{flag:['provas_do_viveiro'],
      rep:{eixo:'bom',delta:1,motivo:'Copiou a ficha inteira à mão em vez de arrancar'},
      registrar:'Copiou a ficha do lote 41-C inteira.'},
  escolhas:[
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Abrir o portão do galpão 3.', vai:'c19_soltar_g3'},
    {texto:'Procurar o arquivo.', vai:'c19_arquivo'}
  ]
},

c19_levou_a_ficha:{
  texto:[
    'Você tira a ficha do porta-documento e dobra no bolso.',
    'Em dez minutos alguém vai reparar, porque a ficha é conferida a cada turno, e aí eles vão saber que tem alguém aqui e vão saber exatamente o que essa pessoa olhou.',
    'Você ganhou uma prova e perdeu a tarde inteira.'
  ],
  ef:{flag:['provas_do_viveiro','sabem_que_voce_esta_aqui'], itens:{'Ficha do lote 41-C':1},
      registrar:'Levou a ficha do lote 41-C. Vão notar na conferência do turno.'},
  escolhas:[
    {texto:'Correr para o galpão do fundo antes que notem.', vai:'c19_galpao'},
    {texto:'Correr para o arquivo antes que notem.', vai:'c19_arquivo'}
  ]
},

c19_soltar_g3:{
  texto:[
    'Você abre o portão do galpão 3.',
    'Nada acontece por quase um minuto.',
    'Depois um Nidoran sai — e para, a dois metros da porta, no meio do corredor coberto, e não anda mais.',
    'Nenhum dos outros sai.',
    'Eles não sabem o que é fora. Nasceram numa bandeja, cresceram numa grade, e a grade é o mundo inteiro que conhecem.',
    'Você fica ali segurando um portão aberto por onze minutos. Saem três no total, e as três ficam paradas no corredor, esperando alguém dizer o que fazer.'
  ],
  ef:{flag:'tentou_soltar_g3', instabilidade:1,
      rep:{eixo:'bom',delta:1,motivo:'Tentou libertar unidades que não sabem o que é liberdade'},
      registrar:'Abriu o galpão 3. Três saíram e ficaram paradas no corredor.'},
  escolhas:[
    {texto:'Carregar as três para fora da estação.', vai:'c19_carregou_tres'},
    {texto:'Fechar o portão. Isso não é soltar, é abandonar.', vai:'c19_fechou_g3'},
    {texto:'Ir até elas e tentar mostrar o caminho.', vai:'c19_mostrou_o_caminho'},
    {texto:'Deixar o portão aberto e ir embora dali.', vai:'c19_deixou_aberto'}
  ]
},

c19_mostrou_o_caminho:{
  texto:[
    'Você agacha na frente das três e faz o que faria com qualquer bicho: mostra a direção com o corpo, anda dois passos, para, espera.',
    'Elas acompanham.',
    'Você anda mais dois, para, espera. Elas acompanham.',
    'Leva quarenta minutos para atravessar cento e vinte metros assim, e no meio do caminho um técnico passa, olha, entende o que está acontecendo e não faz absolutamente nada.',
    'Na cerca, você abre a tela pelo buraco do Persian e passa as três.',
    'Elas param do lado de fora e olham para trás, para você, esperando o próximo passo.'
  ],
  ef:{flag:['levou_tres_ate_a_cerca'], moral:3,
      rep:{eixo:'bom',delta:2,motivo:'Andou quarenta minutos para ensinar o caminho a três bichos'},
      registrar:'Levou três unidades até o buraco da cerca, passo a passo.'},
  escolhas:[
    {texto:'Levar as três com você.', vai:'c19_carregou_tres'},
    {texto:'Deixar as três ali e voltar.', vai:'c19_deixou_as_tres'}
  ]
},

c19_deixou_as_tres:{
  texto:[
    'Você volta para dentro e elas continuam olhando.',
    'Quando você olha para trás pela última vez, elas estão no mesmo lugar, na mesma posição, do lado de fora da cerca.',
    'Você não vai saber o que aconteceu com elas. Essa é a parte que você vai carregar.'
  ],
  ef:{moral:-2, instabilidade:1,
      registrar:'Deixou as três do lado de fora da cerca sem saber o que ia acontecer.'},
  escolhas:[
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Procurar o arquivo.', vai:'c19_arquivo'}
  ]
},

c19_deixou_aberto:{
  texto:[
    'Você deixa o portão aberto e vai embora dali.',
    'Duas horas depois, quando você passa de volta, o portão está fechado.',
    'Não tem ninguém por perto. Não tem alarme tocando. Não tem nenhuma correria.',
    'Alguém simplesmente passou, viu o portão aberto, fechou e seguiu o turno, como quem fecha uma torneira pingando.'
  ],
  ef:{instabilidade:1, moral:-2,
      registrar:'Alguém fechou o portão do galpão 3 sem alarde nenhum.'},
  escolhas:[
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Procurar o arquivo.', vai:'c19_arquivo'}
  ]
},

c19_carregou_tres:{
  texto:[
    'Você carrega as três até a cerca e as coloca do lado de fora, no mato de verdade.',
    'Duas ficam paradas. A terceira anda uns dez metros, encontra um Pidgey silvestre, e é imediatamente atacada — porque território existe, e ela não sabe disso.',
    'Ela não revida. Não sabe revidar.',
    'Você tem que intervir. Você intervém.',
    'E fica ali, na beira da Rota 21, com três coisas que não sabem viver no lugar onde você acabou de colocá-las.'
  ],
  ef:{flag:'levou_tres_unidades',
      executar:d=>{
        const p = unidadeComissao(29, 24, '41-C-22');
        p.moral = 5;
        const onde = Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${nomeExib(p)} ficou com você. As outras duas você levou ao Centro Pokémon de Fuchsia, que não soube o que registrar na ficha.${notaDestino(onde)}`}];
      },
      rep:{eixo:'bom',delta:2,motivo:'Assumiu a responsabilidade por três unidades que não sabem viver soltas'},
      registrar:'Tirou três unidades da Estação 4 e descobriu que elas não sobrevivem sozinhas.'},
  escolhas:[
    {texto:'Voltar para dentro.', vai:'c19_dentro'},
    {texto:'Ir direto ao galpão do fundo.', vai:'c19_galpao'}
  ]
},

c19_fechou_g3:{
  texto:[
    'Você fecha o portão.',
    'É a decisão mais difícil do dia e ela parece covardia e não é.',
    'Soltar uma coisa que não sabe viver solta não é liberdade. É o mesmo abandono com uma palavra melhor.',
    'As três voltam sozinhas para dentro quando você abre a folha menor, porque dentro é onde elas sabem estar.'
  ],
  ef:{moral:1, rep:{eixo:'bom',delta:1,motivo:'Entendeu que abrir a porta não era soltar'},
      registrar:'Fechou o portão do galpão 3.'},
  escolhas:[
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Procurar o arquivo.', vai:'c19_arquivo'},
    {texto:'Procurar o Dr. Hollis.', vai:'c19_sena'}
  ]
},

/* ── O arquivo ──────────────────────────────────────────── */
c19_arquivo:{
  texto:[
    'O laboratório fica no galpão 2, depois do berçário, atrás de uma porta com visor e uma placa de acesso restrito que não tem fechadura.',
    'A sala do arquivo é refrigerada e zumbe. Não tem guarda: tem controle de temperatura e um alarme de temperatura, que é o único alarme que interessa a alguém aqui.',
    'São gavetas. Centenas de gavetas de aço com etiqueta impressa: espécie, lote, origem, data.',
    'Muitas dizem ZS-7. Algumas dizem SPH-11. Sete dizem IL-SN, e a etiqueta dessas é mais nova que todas as outras.',
    d=>d.flags.chegou_na_ilha
      ? 'IL-SN. A ilha sem nome. Eles conseguiram material lá numa das expedições anteriores à sua.'
      : 'IL-SN. Você não sabe o que é e sabe que é ruim.',
    'E, numa gaveta sozinha, refrigerada em separado, com dois cadeados: MATRIZ 01.'
  ],
  ef:{flag:['achou_o_arquivo','sabe_da_matriz01'], instabilidade:1,
      registrar:'Encontrou o arquivo genético. Uma gaveta com dois cadeados: MATRIZ 01.'},
  escolhas:[
    {texto:'Ler as etiquetas com calma, todas.', vai:'c19_leu_as_etiquetas'},
    {texto:'Destruir o arquivo inteiro.', vai:'c19_destruiu_arquivo'},
    {texto:'Abrir a gaveta da MATRIZ 01.', vai:'c19_levou_matriz'},
    {texto:'Fotografar tudo e deixar como está.', vai:'c19_fotografou_arquivo'},
    {texto:'Sair sem tocar em nada.', vai:'c19_dentro'}
  ]
},

c19_leu_as_etiquetas:{
  texto:[
    'Você lê as etiquetas por quarenta minutos, gaveta por gaveta, como quem lê uma lista telefônica atrás de um sobrenome.',
    'A origem ZS-7 é de longe a maior: dezenove anos de coleta, com data mais antiga de dezenove anos atrás e a mais nova de três meses.',
    'SPH-11 tem data de corte: tudo para no mesmo mês, e o mês é aquele mês.',
    'IL-SN tem sete gavetas e data de dois anos atrás, o que é anterior à sua expedição e anterior à Comissão.',
    'E tem uma origem que aparece só três vezes, com etiqueta velha e escrita à máquina, não impressa: CIN-88.',
    'Oitenta e oito. Cinnabar, oitenta e oito.'
  ],
  ef:{flag:['leu_as_etiquetas','liga_cinnabar_comissao'], instabilidade:1,
      registrar:'Origens do arquivo: ZS-7 (19 anos), SPH-11 (com data de corte), IL-SN (2 anos), CIN-88 (três gavetas, etiqueta datilografada).'},
  escolhas:[
    {texto:'Abrir uma gaveta CIN-88.', vai:'c19_gaveta_cin88'},
    {texto:'Fotografar tudo.', vai:'c19_fotografou_arquivo'},
    {texto:'Abrir a MATRIZ 01.', vai:'c19_levou_matriz'},
    {texto:'Destruir tudo.', vai:'c19_destruiu_arquivo'}
  ]
},

c19_gaveta_cin88:{
  texto:[
    'A gaveta CIN-88 não tem cadeado, porque ninguém achou que fosse preciso.',
    'Dentro, oito frascos em suporte de espuma e um caderno de capa dura, encolhido de frio, com a letra pequena e inclinada de alguém que escrevia depressa.',
    'A primeira página tem um cabeçalho datilografado e um nome: FUJI, K.',
    'As páginas de dentro são anotações de campo comuns: peso, medida, temperatura, alimentação.',
    'Na página vinte e dois, no meio de uma coluna de números, tem uma frase escrita em letra normal, como quem para no meio do trabalho.',
    'Ele olhou para mim hoje e eu tive vontade de pedir desculpa. Não anotei isso na ficha oficial.'
  ],
  ef:{flag:['achou_caderno_fuji'], instabilidade:2, itens:{'Caderno de campo de K. Fuji':1},
      rep:{eixo:'bom',delta:1,motivo:'Achou o caderno que ninguém achou que valia trancar'},
      registrar:'Caderno de campo de K. Fuji, na gaveta CIN-88, com uma frase fora da ficha oficial.'},
  escolhas:[
    {texto:'Levar o caderno.', vai:'c19_levou_o_caderno'},
    {texto:'Abrir a MATRIZ 01.', vai:'c19_levou_matriz'},
    {texto:'Fotografar tudo.', vai:'c19_fotografou_arquivo'}
  ]
},

c19_levou_o_caderno:{
  texto:[
    'Você põe o caderno dentro da camisa, contra as costelas, porque bolso nenhum dá conta.',
    'Ele é frio e vai demorar a esquentar.',
    'Não é prova de crime. Não serve para promotor nenhum.',
    'É a única coisa neste galpão inteiro escrita por alguém que pediu desculpa.'
  ],
  ef:{flag:['carrega_o_caderno_fuji'], moral:2,
      registrar:'Levou o caderno de K. Fuji.'},
  escolhas:[
    {texto:'Abrir a MATRIZ 01.', vai:'c19_levou_matriz'},
    {texto:'Fotografar tudo e sair.', vai:'c19_fotografou_arquivo'},
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'}
  ]
},

c19_destruiu_arquivo:{
  texto:[
    'Você desliga a refrigeração e abre todas as gavetas.',
    'Leva quatro minutos. Depois disso a temperatura sobe sozinha e em duas horas não existe mais nada de aproveitável ali.',
    'O alarme de temperatura dispara em noventa segundos, e é um bipe fino e educado, e ninguém vem correndo, porque alarme de temperatura dispara toda semana por queda de energia.',
    'Você destruiu dezenove anos de coleta do setor 7, o material do andar 11 e sete gavetas de uma ilha que não está em mapa nenhum.',
    'Você também destruiu as únicas amostras que existiam de duas linhagens que a Zona Safári perdeu há quatro anos, e que não existem mais em lugar nenhum do mundo.',
    'As duas coisas são verdade. Você vai ter que decidir com qual delas dorme.'
  ],
  ef:{flag:['destruiu_o_arquivo','atrasou_a_comissao'], instabilidade:-1, moral:-2,
      rep:{eixo:'bom',delta:2,motivo:'Destruiu o arquivo genético da Comissão'},
      registrar:'Destruiu o arquivo genético inteiro da Estação 4, com o que havia de bom nele.'},
  escolhas:[
    {texto:'Pegar a MATRIZ 01 antes de sair.', vai:'c19_levou_matriz'},
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Sair da estação agora.', vai:'c19_saida'}
  ]
},

c19_levou_matriz:{
  texto:[
    'Os dois cadeados são bons. A gaveta não é.',
    'Dentro, uma caixa de transporte com bateria própria e visor de temperatura, e dentro dela um tubo de vinte centímetros.',
    'A etiqueta diz MATRIZ 01 e, embaixo, em letra menor: origem CIN-88 / FUJI, K.',
    'Você está segurando a coisa de que Mewtwo foi feito.',
    'E, pelas atas, a coisa de que a Fase III vai ser feita.'
  ],
  ef:{flag:['carrega_a_matriz','atrasou_a_comissao','sabe_da_fase3'],
      rep:{eixo:'bom',delta:1,motivo:'Tirou a MATRIZ 01 das mãos da Comissão'},
      registrar:'Está carregando a MATRIZ 01 — o material de origem de Mewtwo.'},
  escolhas:[
    {texto:'Destruir o tubo agora, aqui mesmo.', vai:'c19_destruiu_a_matriz'},
    {texto:'Guardar e ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Guardar e sair da estação.', vai:'c19_saida'}
  ]
},

c19_destruiu_a_matriz:{
  texto:[
    'Você abre a caixa, tira o tubo e quebra no canto da bancada de aço.',
    'O conteúdo evapora na temperatura da sala em menos de vinte segundos, e é decepcionante: some rápido, sem drama, como qualquer líquido.',
    'A Fase III não vai acontecer, ou vai acontecer com outra coisa, e você não vai saber qual das duas.',
    'E uma pessoa que morreu num incêndio em Cinnabar acaba de deixar de existir pela segunda vez.'
  ],
  ef:{flag:['destruiu_a_matriz','atrasou_a_comissao'], limpaFlag:'carrega_a_matriz',
      instabilidade:-1, moral:-2,
      rep:{eixo:'bom',delta:2,motivo:'Destruiu a matriz original'},
      registrar:'Destruiu a MATRIZ 01 no canto de uma bancada.'},
  escolhas:[
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Sair da estação.', vai:'c19_saida'}
  ]
},

c19_fotografou_arquivo:{
  texto:[
    'Você fotografa as etiquetas, as gavetas, a sala inteira e a MATRIZ 01 com os dois cadeados fechados, para que ninguém possa dizer que você mexeu.',
    'Trinta e uma fotos.',
    'É prova de que a origem do material é o setor 7, é Celadon, é a Silph e é uma ilha sem nome. É a cadeia inteira num arquivo só.',
    'E você deixa tudo exatamente onde estava, porque prova mexida é prova contestada.'
  ],
  ef:{flag:['provas_do_viveiro','escolha_fria'],
      rep:{eixo:'bom',delta:2,motivo:'Documentou a cadeia inteira do material genético'},
      registrar:'Fotografou o arquivo: 31 fotos ligando ZS-7, Celadon, SPH-11 e a ilha.'},
  escolhas:[
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Procurar o Dr. Hollis.', vai:'c19_sena'},
    {texto:'Sair da estação.', vai:'c19_saida'}
  ]
},

/* ── Dr. Hollis ───────────────────────────────────────────── */
c19_sena:{
  texto:[
    'O Dr. Hollis está no galpão 2, de jaleco, anotando numa prancheta, e reconhece você antes de você se apresentar.',
    '"Ah." Ele não corre, não chama ninguém, não parece nem um pouco surpreso. "{O|A} do andar 11."',
    '"O senhor estava lá."',
    '"Eu era o terceiro na cadeia. Eu assinava o que o segundo aprovava." Ele continua anotando. "Quando lacraram, eu vim para cá com o projeto. Como quem muda de sala."',
    'Ele finalmente levanta a cabeça.',
    '"{O senhor|A senhora} quer saber o que eu acho de verdade? Eu acho que a gente estava errado no andar 11 e certo aqui."',
    '"Lá a gente tentou fazer uma mente. Aqui a gente faz população. Mente pergunta coisa. População não."'
  ],
  ef:{npc:{nome:'Dr. Hollis', opiniao:0, memoria:'Migrou do andar 11 para a Estação 4 como quem muda de sala.'},
      flag:'conheceu_sena'},
  escolhas:[
    {texto:'"E o galpão do fundo?"', vai:'c19_sena_galpao'},
    {texto:'"O senhor tem filho?"', vai:'c19_sena_filho'},
    {texto:'"Quem assina no seu lugar quando o senhor não está?"', vai:'c19_sena_substituto'},
    {texto:'"O senhor já viu um selvagem de perto?"', vai:'c19_sena_selvagem'},
    {texto:'Atacar.', vai:'c19_luta_sena'}
  ]
},

c19_sena_galpao:{
  texto:[
    '"E o galpão do fundo?"',
    'Ele para de anotar.',
    '"Art. 19." Ele diz o número do artigo como quem diz o nome de uma doença. "Unidade que não atinge parâmetro de viabilidade é descartada."',
    '"Quantas não atingem?"',
    '"Trinta e um por cento."',
    'Você faz a conta da Fase II na cabeça: quatrocentas unidades liberadas, e trinta e um por cento a mais produzidas e não liberadas.',
    '"Cento e oitenta."',
    '"Cento e oitenta", ele confirma, e volta a anotar, porque a prancheta dele tem uma coluna para isso.'
  ],
  ef:{flag:['sabe_do_descarte','entendeu_o_galpao4'], instabilidade:2,
      registrar:'31% não atingem viabilidade. Para soltar 400, descartam 180.'},
  escolhas:[
    {texto:'"Trinta e um é o número da natureza também."', vai:'c19_sena_trinta_e_um'},
    {texto:'"O senhor entra lá?"', vai:'c19_sena_entra'},
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Atacar.', vai:'c19_luta_sena'}
  ]
},

c19_sena_trinta_e_um:{
  texto:[
    '"Trinta e um por cento é a taxa de sobrevivência lá fora. A senhora da visita disse."',
    'Ele para a caneta.',
    '"É coincidência."',
    '"É?"',
    'Ele olha a prancheta, depois olha você, e pela primeira vez parece incomodado com alguma coisa.',
    '"É coincidência", ele repete, com menos força. "Lá fora morrem sessenta e nove por cento e ninguém escreve o nome de nenhum. Aqui morrem trinta e um e cada um tem formulário."',
    '"E isso é melhor?"',
    '"Isso é contável." Ele volta à prancheta. "Eu já não sei se é melhor. Eu sei que é contável, e eu escolhi trabalhar com o que é contável."'
  ],
  ef:{instabilidade:2,
      npc:{nome:'Dr. Hollis', opiniao:1, memoria:'Admitiu que já não sabe se é melhor, só se é contável.'},
      registrar:'Hollis: lá fora morrem 69% sem nome, aqui 31% com formulário.'},
  escolhas:[
    {texto:'"O senhor entra lá?"', vai:'c19_sena_entra'},
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Atacar.', vai:'c19_luta_sena'}
  ]
},

c19_sena_entra:{
  texto:[
    '"Eu não."',
    'Ele responde rápido demais e percebe que respondeu rápido demais.',
    '"Eu assino. Eu não aplico." Ele endireita o jaleco. "Divisão de trabalho. É como funciona em qualquer lugar que trabalha com vida."',
    '"Quem aplica?"',
    '"Voluntário." Ele diz a palavra e não gosta do som dela na própria boca. "A gente nunca escalou ninguém à força. Isso foi decisão minha, na terceira reunião, e é a única coisa aqui que eu defendo sem nenhuma reserva."',
    'Ele volta à prancheta.',
    '"E é também a coisa mais covarde que eu já fiz, porque eu passei a responsabilidade para quem tem menos escolha que eu."'
  ],
  ef:{flag:['sabe_dos_voluntarios'], instabilidade:2,
      npc:{nome:'Dr. Hollis', opiniao:2, memoria:'Chamou a própria decisão de mais covarde da vida dele.'},
      registrar:'Hollis assina e não aplica. Ele mesmo chama isso de covardia.'},
  escolhas:[
    {texto:'"Então vem comigo lá dentro."', vai:'c19_sena_vem_comigo'},
    {texto:'Ir ao galpão sozinh{o|a}.', vai:'c19_galpao'},
    {texto:'Atacar.', vai:'c19_luta_sena'}
  ]
},

c19_sena_vem_comigo:{
  texto:[
    '"Vem comigo lá dentro."',
    'Ele põe a prancheta na bancada com cuidado, do jeito que põe as coisas.',
    'E fica em silêncio tempo demais.',
    '"Não."',
    '"Por quê?"',
    '"Porque se eu entrar uma vez eu vou ter que entrar sempre, e se eu entrar sempre eu vou parar de assinar, e se eu parar de assinar alguém assina no meu lugar."',
    'Ele pega a prancheta de volta.',
    '"E essa pessoa não vai discutir com o conselho sobre fratura exposta em reunião de duas horas. Eu já perdi trinta e nove dessas discussões e eu ganhei sete."'
  ],
  ef:{flag:'sena_ganhou_sete', instabilidade:1,
      npc:{nome:'Dr. Hollis', opiniao:2, memoria:'Perdeu 39 discussões no conselho e ganhou 7.'},
      registrar:'Hollis ganhou sete discussões de quarenta e seis no conselho.'},
  escolhas:[
    {texto:'"Quais foram as sete?"', vai:'c19_as_sete'},
    {texto:'Ir ao galpão sozinh{o|a}.', vai:'c19_galpao'},
    {texto:'Atacar.', vai:'c19_luta_sena'}
  ]
},

c19_as_sete:{
  texto:[
    'Ele lista as sete sem consultar nada, com data.',
    'Fratura exposta com prognóstico de recuperação. Subpeso em filhote de menos de trinta dias. Comportamento agressivo em fêmea gestante. Cegueira unilateral. Estereotipia leve com melhora em quatro semanas. Sopro cardíaco assintomático. Perda parcial de audição.',
    'Sete parâmetros que deixaram de ser motivo de descarte por causa de sete discussões dele.',
    'Você faz a conta sem querer: quantos por ano, quantos em dois anos.',
    'Ele vê você fazendo a conta.',
    '"Cento e quatro", ele diz. "Cento e quatro estão vivas por causa dessas sete brigas. Eu conto essas também."'
  ],
  ef:{flag:['sena_conta_as_vivas'], instabilidade:1, moral:-2,
      npc:{nome:'Dr. Hollis', opiniao:3, memoria:'Conta as 104 que estão vivas por causa das brigas que ganhou.'},
      registrar:'104 unidades estão vivas por causa de sete discussões que o Dr. Hollis ganhou.'},
  escolhas:[
    {texto:'"E as que o senhor perdeu?"', vai:'c19_as_que_perdeu'},
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Atacar.', vai:'c19_luta_sena'}
  ]
},

c19_as_que_perdeu:{
  texto:[
    '"E as que o senhor perdeu?"',
    'Ele não responde.',
    'Ele vira a prancheta e mostra a última folha, que não é planilha: é uma lista escrita à mão, com números de anilha, três colunas, quase cheia.',
    'No alto da folha, em letra pequena: as que eu não consegui.',
    '"Eu não sei por que eu faço isso", ele diz. "Não serve para nada e eu levo essa folha para casa todo fim de semana."',
    'Ele vira a prancheta de volta.',
    '"Agora vai lá ver o galpão. É pra isso que {o senhor|a senhora} veio."'
  ],
  ef:{flag:['viu_a_lista_do_sena'], instabilidade:2, moral:-2,
      npc:{nome:'Dr. Hollis', opiniao:3, memoria:'Te mostrou a lista das que ele não conseguiu salvar.'},
      registrar:'O Dr. Hollis mantém à mão uma lista chamada as que eu não consegui.'},
  escolhas:[
    {texto:'"Me dá essa folha."', vai:'c19_pediu_a_folha'},
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'}
  ]
},

c19_pediu_a_folha:{
  texto:[
    '"Me dá essa folha."',
    'Ele segura a prancheta contra o peito, um gesto de criança, e percebe o gesto e se envergonha dele.',
    '"Essa folha não prova nada. É letra minha numa folha de caderno."',
    '"Eu sei."',
    'Ele destaca a folha devagar, com cuidado para não rasgar na espiral, e entrega.',
    '"Se isso sair em algum lugar, eu perco o registro e eu não trabalho mais." Ele solta a folha. "E eu estou te dando assim mesmo, e eu quero que {o senhor|a senhora} saiba que eu pensei nisso antes."'
  ],
  ef:{flag:['tem_a_lista_do_sena','provas_do_viveiro'], itens:{'A lista das que ele não conseguiu':1},
      npc:{nome:'Dr. Hollis', opiniao:4, memoria:'Te deu a folha sabendo o que ela custa a ele.'},
      rep:{eixo:'bom',delta:2,motivo:'Recebeu de um técnico a única folha que ele levava para casa'},
      registrar:'O Dr. Hollis te deu a lista das que ele não conseguiu.'},
  escolhas:[{texto:'Ir ao galpão do fundo.', vai:'c19_galpao'}]
},

c19_sena_filho:{
  texto:[
    '"O senhor tem filho?"',
    'Ele para e olha para você com uma desconfiança nova.',
    '"Por que {o senhor|a senhora} pergunta isso?"',
    '"Porque todo mundo aqui tem uma frase pronta e eu quero ouvir a que não é pronta."',
    'Ele pousa a caneta.',
    '"Eu tenho duas filhas e elas não sabem o que eu faço." Ele diz isso olhando a bancada. "Elas sabem que eu trabalho com bicho. A mais nova acha que eu sou veterinário e eu deixo."',
    'Ele pega a caneta de novo.',
    '"É a resposta que {o senhor|a senhora} queria?"'
  ],
  ef:{instabilidade:1,
      npc:{nome:'Dr. Hollis', opiniao:1, memoria:'Deixa a filha mais nova acreditar que ele é veterinário.'},
      registrar:'As filhas do Dr. Hollis não sabem o que ele faz.'},
  escolhas:[
    {texto:'"E o galpão do fundo?"', vai:'c19_sena_galpao'},
    {texto:'"O senhor já viu um selvagem de perto?"', vai:'c19_sena_selvagem'},
    {texto:'Ir ao galpão sozinh{o|a}.', vai:'c19_galpao'}
  ]
},

c19_sena_substituto:{
  texto:[
    '"Quem assina no seu lugar quando o senhor não está?"',
    'Ele responde sem pensar. "Ninguém. Fica acumulado até eu voltar."',
    'Depois ouve o que disse.',
    '"{O senhor|A senhora} está perguntando se eu tirei férias."',
    '"Estou."',
    'Ele confere a data no alto da prancheta, como se precisasse.',
    '"Não desde que isso abriu." Ele diz devagar. "Vinte e dois meses."',
    'Ele volta a anotar, e a caneta falha, e ele sacode a caneta.'
  ],
  ef:{instabilidade:1,
      npc:{nome:'Dr. Hollis', opiniao:1, memoria:'Não tira férias há vinte e dois meses porque o serviço fica acumulado.'},
      registrar:'O Dr. Hollis não tira férias há 22 meses porque ninguém assina no lugar dele.'},
  escolhas:[
    {texto:'"E o galpão do fundo?"', vai:'c19_sena_galpao'},
    {texto:'"O senhor tem filho?"', vai:'c19_sena_filho'},
    {texto:'Ir ao galpão.', vai:'c19_galpao'}
  ]
},

c19_sena_selvagem:{
  texto:[
    '"O senhor já viu um selvagem de perto?"',
    '"Eu vi muitos em foto e em ficha."',
    '"Não foi isso que eu perguntei."',
    'Ele fica em silêncio bastante tempo.',
    '"Uma vez." Ele olha a janela do galpão, que dá para o mato de dentro, que é mato plantado. "Num acampamento, quando eu era estudante. Um Ursaring atravessou a trilha a vinte metros de mim e nem virou a cabeça."',
    '"E?"',
    '"E eu fiquei com medo e depois eu fiquei uma semana pensando nele." Ele pega a prancheta. "E aí eu fiz mestrado e nunca mais."',
    'Ele começa a andar para o outro lado do galpão.',
    '"Vai ver o galpão, {moço|moça}. Eu tenho pesagem às onze."'
  ],
  ef:{instabilidade:1, moral:-1,
      npc:{nome:'Dr. Hollis', opiniao:2, memoria:'Viu um selvagem uma vez na vida, quando era estudante.'},
      registrar:'O Dr. Hollis viu um Pokémon selvagem de perto uma vez, quando era estudante.'},
  escolhas:[
    {texto:'"E o galpão do fundo?"', vai:'c19_sena_galpao'},
    {texto:'Ir ao galpão.', vai:'c19_galpao'},
    {texto:'Procurar o arquivo.', vai:'c19_arquivo'}
  ]
},

c19_luta_sena:{
  texto:['"Eu esperava isso." O Dr. Hollis põe a prancheta na bancada com cuidado. "Eu sempre espero isso."'],
  batalha:{comissao:'tecnico', nivel:54, tipo:'treinador', treinador:'Dr. Hollis', fuga:true,
           vitoria:'c19_venceu_sena', derrota:'c19_perdeu_sena', fuga2:'c19_galpao', gameover:'gameover'}
},

c19_venceu_sena:{
  texto:[
    'As unidades dele caem e ficam onde caíram, esperando.',
    'O Dr. Hollis recolhe uma por uma com o mesmo cuidado com que pousou a prancheta.',
    '"{O senhor|A senhora} sabe o que me incomoda?" Ele não parece abalado. "Que {o senhor|a senhora} acha que isso foi uma vitória moral."',
    '"{O senhor|A senhora} derrotou quatro unidades de lote. A gente produz quatro unidades de lote em dezoito dias."',
    'Ele guarda a última bola.',
    '"O galpão 4 fica no fim do corredor. A porta não está trancada. Nunca esteve."'
  ],
  ef:{flag:'venceu_sena',
      rep:{eixo:'bom',delta:1,motivo:'Derrotou o técnico-chefe do viveiro'},
      npc:{nome:'Dr. Hollis', opiniao:-1, memoria:'Perdeu para você e te disse que o galpão 4 nunca esteve trancado.'}},
  escolhas:[{texto:'Ir ao galpão do fundo.', vai:'c19_galpao'}]
},

c19_perdeu_sena:{
  texto:[
    'Você perde, e ele não comemora, e chama a enfermaria para o seu time.',
    'Enquanto os seus Pokémon são atendidos por uma equipe competente e educada, o Dr. Hollis volta a anotar na prancheta.',
    '"A porta do galpão 4 nunca esteve trancada", ele diz, sem levantar a cabeça. "Vai lá. Sério. Eu prefiro que as pessoas vejam."'
  ],
  ef:{hp:-4, causa:'Derrota no viveiro', curaTime:true},
  escolhas:[{texto:'Ir ao galpão do fundo.', vai:'c19_galpao'}]
},

/* ── O galpão do fundo ──────────────────────────────────── */
c19_galpao:{
  texto:[
    'A porta do galpão 4 é de aço, pesada, com um puxador comum.',
    'Não está trancada. Não tem fechadura. Nunca teve.',
    'Por dentro não tem incubadora, não tem grade e não tem gaiola.',
    'Tem uma esteira curta, uma bancada de aço com dreno, um forno industrial, uma mangueira enrolada num gancho e uma prancheta pendurada num prego.',
    'O piso é de cimento com caimento para o meio. O ralo é grande.',
    'Cheira a desinfetante industrial do tipo que se usa depois, não antes.'
  ],
  ef:{flag:['viu_o_galpao4','tem_sangue_nas_maos_deles'], instabilidade:2, moral:-3,
      registrar:'Entrou no galpão 4: esteira, bancada com dreno, forno, mangueira e uma prancheta.'},
  escolhas:[
    {texto:'Ler a prancheta.', vai:'c19_a_prancheta'},
    {texto:'Olhar o quadro da parede.', vai:'c19_o_quadro'},
    {texto:'Olhar o que está no canto, coberto.', vai:'c19_o_canto'},
    {texto:'Sair. Você não aguenta ficar aqui.', vai:'c19_saiu_galpao'}
  ]
},

c19_a_prancheta:{
  texto:[
    'A prancheta tem trinta e nove páginas presas por um clipe grande, e cada página é uma planilha.',
    'DATA / LOTE / ANILHA / MOTIVO / RESPONSÁVEL / ASSINATURA.',
    'A última linha é de anteontem. Lote 41-C. Catorze anilhas listadas uma a uma, do 01 ao 14, sem pular nenhuma.',
    'O motivo de todas é o mesmo: N/VIÁV.',
    'A assinatura do responsável é a mesma em todas as trinta e nove páginas, e você reconhece a letra de quem assina muito.'
  ],
  ef:{flag:['leu_a_prancheta','sabe_do_catorze'], instabilidade:2, moral:-3,
      registrar:'A prancheta do galpão 4: 39 páginas, anilhas listadas uma a uma, sempre a mesma assinatura.'},
  escolhas:[
    {texto:'Somar as trinta e nove páginas.', vai:'c19_somou'},
    {texto:'Fotografar tudo.', vai:'c19_fotografou_galpao'},
    {texto:'Pegar a prancheta.', vai:'c19_pegou_prancheta'},
    {texto:'Pendurar de volta e sair.', vai:'c19_saiu_galpao'}
  ]
},

c19_somou:{
  texto:[
    'Você soma com o lápis, na margem, página por página, e refaz a conta duas vezes porque a primeira você não acredita.',
    'A planilha tem dois anos.',
    'O número é de quatro dígitos.',
    'Você fica olhando os quatro dígitos e uma coisa esquisita acontece: eles param de significar.',
    'Quatro dígitos é grande demais para caber numa cabeça. Catorze cabe. Catorze é anteontem, é uma caixa, é uma pessoa conferindo anilha por anilha.',
    'É por isso que eles anotam por dia e somam por ano.'
  ],
  ef:{flag:['somou_a_planilha'], instabilidade:2, moral:-4,
      registrar:'A planilha do galpão 4 tem dois anos e o total é de quatro dígitos.'},
  escolhas:[
    {texto:'Fotografar tudo.', vai:'c19_fotografou_galpao'},
    {texto:'Pegar a prancheta.', vai:'c19_pegou_prancheta'},
    {texto:'Destruir o galpão.', vai:'c19_destruiu_galpao'},
    {texto:'Sair.', vai:'c19_saiu_galpao'}
  ]
},

c19_o_quadro:{
  texto:[
    'Na parede do fundo tem um quadro branco com três colunas: LOTE / MOTIVO / DATA.',
    'Está preenchido até embaixo, com caneta de quadro, em letra caprichada.',
    'No alto, num canto, escrito e apagado e escrito de novo tantas vezes que o branco ficou cinza, tem uma frase que não é da planilha.',
    'CONFERIR ANILHA UMA POR UMA. SEMPRE.',
    'Alguém escreveu isso para si mesmo, em letra maiúscula, na parede do próprio trabalho.',
    'E alguém, outro alguém, escreveu embaixo, em letra menor e diferente: EU CONFIRO.'
  ],
  ef:{flag:['viu_o_quadro_do_g4'], instabilidade:2, moral:-3,
      registrar:'No quadro do galpão 4: conferir anilha uma por uma, sempre. E embaixo: eu confiro.'},
  escolhas:[
    {texto:'Ler a prancheta.', vai:'c19_a_prancheta'},
    {texto:'Olhar o canto coberto.', vai:'c19_o_canto'},
    {texto:'Fotografar tudo.', vai:'c19_fotografou_galpao'},
    {texto:'Sair.', vai:'c19_saiu_galpao'}
  ]
},

c19_o_canto:{
  texto:[
    'No canto, perto do forno, tem uma coisa coberta com um pano de algodão cru, do tamanho de uma caixa de feira.',
    'Você levanta o pano.',
    'É uma caixa de transporte plástica, dessas de vinte litros, com furos laterais. Está vazia e está limpa.',
    'Dentro, no fundo, tem um pedaço de cobertor velho dobrado em quatro, do tipo que se põe para o bicho não deslizar no plástico.',
    'O cobertor está limpo. Alguém lavou.',
    'Você fica com o pano na mão, parad{o|a}, por um tempo que não consegue medir.'
  ],
  ef:{instabilidade:2, moral:-4,
      registrar:'No canto do galpão 4, uma caixa de transporte vazia e um cobertor lavado e dobrado.'},
  escolhas:[
    {texto:'Ler a prancheta.', vai:'c19_a_prancheta'},
    {texto:'Olhar o quadro.', vai:'c19_o_quadro'},
    {texto:'Levar o cobertor.', vai:'c19_levou_o_cobertor'},
    {texto:'Cobrir de novo e sair.', vai:'c19_saiu_galpao'}
  ]
},

c19_levou_o_cobertor:{
  texto:[
    'Você dobra o cobertor e leva, e não sabe explicar por quê, e não vai saber explicar depois, e vai ser perguntado.',
    'Não é prova. Não tem número, não tem data, não tem assinatura.',
    'É um pedaço de cobertor que alguém lavou e dobrou em quatro para o próximo não deslizar no plástico.'
  ],
  ef:{itens:{'Um pedaço de cobertor dobrado em quatro':1}, moral:2,
      registrar:'Levou o cobertor do galpão 4.'},
  escolhas:[
    {texto:'Fotografar o resto.', vai:'c19_fotografou_galpao'},
    {texto:'Pegar a prancheta.', vai:'c19_pegou_prancheta'},
    {texto:'Sair.', vai:'c19_saiu_galpao'}
  ]
},

c19_fotografou_galpao:{
  texto:[
    'Você fotografa a esteira, o dreno, o forno, o quadro e as trinta e nove páginas da planilha, uma por uma, com a mão tremendo nas primeiras seis.',
    'A partir da sétima a mão firma, e isso te assusta mais do que o tremor.',
    'Quarenta e seis fotos. Você acaba o filme e continua apertando o botão por três disparos vazios antes de perceber.',
    'Na última foto que sai, sem querer, entra o canto da caixa com o cobertor.'
  ],
  ef:{flag:['provas_do_galpao4','provas_do_viveiro'],
      rep:{eixo:'bom',delta:3,motivo:'Documentou o galpão do fundo inteiro'},
      registrar:'Fotografou o galpão 4 inteiro e as 39 páginas da planilha.'},
  escolhas:[
    {texto:'Pegar a prancheta também.', vai:'c19_pegou_prancheta'},
    {texto:'Sair.', vai:'c19_saida'}
  ]
},

c19_pegou_prancheta:{
  texto:[
    'Você tira a prancheta do prego e leva.',
    'É o objeto mais pesado que você já carregou e ele pesa trezentos gramas.',
    'No prego fica a marca de dois anos de prancheta pendurada: um círculo mais claro na tinta da parede.',
    'Quem entrar amanhã vai ver o círculo antes de ver qualquer outra coisa.'
  ],
  ef:{flag:['provas_do_galpao4','provas_do_viveiro'], itens:{'A prancheta do galpão 4':1},
      rep:{eixo:'bom',delta:2,motivo:'Levou a planilha de descarte do galpão do fundo'},
      registrar:'Levou a prancheta do galpão 4.'},
  escolhas:[
    {texto:'Sair.', vai:'c19_saida'},
    {texto:'Destruir o galpão antes de sair.', vai:'c19_destruiu_galpao'}
  ]
},

c19_destruiu_galpao:{
  texto:[
    'Você destrói o galpão 4.',
    'A esteira, a bancada, o forno, o dreno, o quadro da parede. Leva vinte minutos, faz muito barulho, e ninguém vem.',
    'Ninguém vem porque todo mundo aqui sabe o que é esse galpão e ninguém quer estar dentro dele hoje.',
    'Quando acaba, você está de pé no meio de uma sala destruída, ofegante, com a mão cortada.',
    'O número da planilha continua sendo de quatro dígitos. O forno vai ser substituído em duas semanas pelo seguro. A esteira é peça de catálogo.',
    'E na terça que vem alguém vai precisar fazer o serviço de qualquer jeito, e vai fazer em outro lugar, sem dreno, sem ralo e sem a frase escrita na parede.'
  ],
  ef:{flag:['destruiu_o_galpao4'],
      rep:{eixo:'bom',delta:1,motivo:'Destruiu o galpão de descarte'},
      hp:-3, causa:'Vinte minutos destruindo um galpão',
      instabilidade:1, moral:-1,
      registrar:'Destruiu o galpão 4. Será substituído em duas semanas.'},
  escolhas:[
    {texto:'Pegar a prancheta antes de sair.', vai:'c19_pegou_prancheta'},
    {texto:'Sair.', vai:'c19_saida'}
  ]
},

c19_saiu_galpao:{
  texto:[
    'Você sai do galpão 4 depois de quarenta segundos lá dentro e senta no chão do corredor coberto, de costas para a parede.',
    'Passa um técnico. Ele te vê sentado ali, entende exatamente de onde você saiu, e não diz nada.',
    'Ele volta dois minutos depois com um copo de água, põe no chão do seu lado, e continua o turno dele.',
    'Você fica com o copo na mão por muito tempo sem beber.'
  ],
  ef:{hp:-2, causa:'O galpão do fundo', moral:-2},
  escolhas:[
    {texto:'Levantar e voltar lá dentro.', vai:'c19_voltou_pro_galpao'},
    {texto:'Levantar e ir embora.', vai:'c19_saida'}
  ]
},

c19_voltou_pro_galpao:{
  texto:[
    'Você bebe a água, levanta, e entra de novo.',
    'Na segunda vez é diferente. Na segunda vez você já sabe o que tem e você não gasta os quarenta segundos com o susto.',
    'Você usa os quarenta segundos para olhar.'
  ],
  ef:{flag:'voltou_pro_galpao', moral:2,
      rep:{eixo:'bom',delta:1,motivo:'Voltou para dentro depois de sair'},
      registrar:'Voltou ao galpão 4 uma segunda vez.'},
  escolhas:[
    {texto:'Ler a prancheta.', vai:'c19_a_prancheta'},
    {texto:'Olhar o quadro da parede.', vai:'c19_o_quadro'},
    {texto:'Olhar o canto coberto.', vai:'c19_o_canto'}
  ]
},

/* ── A saída ────────────────────────────────────────────── */
c19_saida:{
  texto:[
    'Na saída da Estação 4 tem alguém encostada num carro no estacionamento, ao lado das bicicletas.',
    'Auditora Brill. Ela não faz nenhum movimento de te impedir.',
    '"{O senhor|A senhora} viu o galpão."',
    '"Vi."',
    'Ela assente devagar.',
    d=>d.flags.cracha_adnan
      ? '"O crachá que {o senhor|a senhora} usou é da Elda, que está de licença, e quem tirou da gaveta foi o Fabre." Ela olha o chão. "O sistema me avisou às nove e quarenta e um. Eu tinha quarenta e oito horas para reportar e eu reportei às nove e quarenta e quatro, porque se eu não reportasse eles descobririam de qualquer jeito e aí seríamos dois."'
      : '"Eu não vou te deter. Não tem crime. Isso é o mais difícil de explicar para quem chega até aqui: não tem crime."'
  ],
  ef:{npc:{nome:'Auditora Brill', memoria:'Te esperou no estacionamento depois que você viu o galpão do fundo.'}},
  escolhas:[
    {texto:'"Como a senhora dorme?"', vai:'c19_pergunta_prado'},
    {texto:'"A senhora já entrou lá?"', vai:'c19_prado_entrou'},
    {texto:'Mostrar a prancheta e perguntar quanto dá.', vai:'c19_mostrou_a_prancheta', cond:d=>!!d.flags.provas_do_galpao4},
    {texto:'"Me leva até a Presidente."', vai:'c19_leva_presidente'},
    {texto:'Passar por ela sem falar nada.', vai:'c19_passou_direto'}
  ]
},

c19_prado_entrou:{
  texto:[
    '"Todo mês." Ela responde sem pausa. "Auditoria de conformidade. Eu confiro a planilha contra o resíduo e contra o manifesto de peso da coletora."',
    '"A senhora confere o peso."',
    '"Eu confiro o peso." Ela cruza os braços. "É o único número que ninguém dentro daqui controla, porque a balança é do aterro."',
    'Ela olha o galpão por cima do seu ombro.',
    '"E em vinte e dois meses, o peso bateu com a planilha vinte e duas vezes. Eles não mentem no número."',
    '"Isso é bom ou é ruim?"',
    '"É o que me faz continuar e é o que me faz não dormir." Ela abre a porta do carro. "As duas coisas, ao mesmo tempo, todo mês."'
  ],
  ef:{flag:['prado_confere_o_peso'], instabilidade:1,
      npc:{nome:'Auditora Brill', opiniao:2, memoria:'Confere o peso do resíduo contra a planilha todo mês.'},
      registrar:'Em 22 meses, o peso do resíduo bateu com a planilha 22 vezes. Eles não mentem no número.'},
  escolhas:[
    {texto:'"Como a senhora dorme?"', vai:'c19_pergunta_prado'},
    {texto:'"Me leva até a Presidente."', vai:'c19_leva_presidente'},
    {texto:'Ir embora.', vai:'c19_fim'}
  ]
},

c19_mostrou_a_prancheta:{
  texto:[
    'Você mostra o que trouxe e pergunta quanto dá.',
    'Ela olha sem tocar.',
    '"Quatro mil cento e nove", ela diz. "Até anteontem."',
    'Você não tinha perguntado o total. Você tinha perguntado quanto dá.',
    '"A senhora sabe de cabeça."',
    '"Eu sei de cabeça." Ela não desvia o olhar. "Eu fecho esse número todo mês e eu não escrevo em lugar nenhum além do relatório, porque eu tenho medo de escrever e alguém ver e se acostumar."',
    'Ela enfim olha para a prancheta na sua mão.',
    '"Agora está na sua mão e {o senhor|a senhora} vai ter que decidir se publica ou se vai se acostumar."'
  ],
  ef:{flag:['sabe_o_total','provas_do_galpao4'], instabilidade:2,
      npc:{nome:'Auditora Brill', opiniao:3, memoria:'Te disse o número de cabeça: quatro mil cento e nove.'},
      registrar:'Quatro mil cento e nove, até anteontem.'},
  escolhas:[
    {texto:'"Como a senhora dorme?"', vai:'c19_pergunta_prado'},
    {texto:'"Me leva até a Presidente."', vai:'c19_leva_presidente'},
    {texto:'Ir embora com o número.', vai:'c19_fim'}
  ]
},

c19_pergunta_prado:{
  texto:[
    '"Como a senhora dorme?"',
    'Ela demora muito para responder, e a demora é a resposta.',
    '"Eu tenho uma filha de seis anos." Ela abre a porta do carro e não entra. "Há quatro anos um Rhyhorn entrou num quintal em Fuchsia e matou um menino de nove."',
    '"Eu fui na ocorrência. Eu era da Liga na época."',
    '"E aí a senhora entrou nisso."',
    '"E aí eu entrei nisso." Ela entra no carro. "Eu não estou te dizendo que estou certa. Eu estou te dizendo por quê, que é diferente, e eu sei a diferença."',
    'É a terceira vez nesta jornada que alguém te diz exatamente essa frase.'
  ],
  ef:{flag:'prado_explicou',
      npc:{nome:'Auditora Brill', opiniao:4, memoria:'Te contou do menino de nove anos em Fuchsia.'},
      rep:{eixo:'bom',delta:1,motivo:'Ouviu o motivo de alguém em vez de só o argumento'}},
  escolhas:[
    {texto:'"E o menino teria sido salvo por um viveiro?"', vai:'c19_teria_salvo'},
    {texto:'"Me leva até a Presidente."', vai:'c19_leva_presidente'},
    {texto:'Deixá-la ir.', vai:'c19_fim'}
  ]
},

c19_teria_salvo:{
  texto:[
    '"O menino teria sido salvo por um viveiro?"',
    'Ela fica com a mão na chave sem virar.',
    '"Não."',
    'A resposta é tão rápida e tão sem defesa que você não sabe o que fazer com ela.',
    '"Não, porque o Rhyhorn não veio de viveiro nenhum e nenhum programa de substituição chegaria naquele quintal em quatro anos." Ela finalmente vira a chave. "Eu sei disso desde o primeiro mês."',
    '"Então por quê?"',
    '"Porque eu precisava ir para algum lugar depois daquela ocorrência e este foi o único lugar que tinha uma resposta escrita." Ela põe o carro em ponto morto. "Essa é a coisa mais honesta que eu já disse para alguém e eu vou negar."'
  ],
  ef:{flag:['prado_admitiu'], instabilidade:1, moral:2,
      npc:{nome:'Auditora Brill', opiniao:5, memoria:'Admitiu que o viveiro não teria salvado o menino.'},
      rep:{eixo:'bom',delta:2,motivo:'Fez a pergunta que ninguém tinha feito a ela'},
      registrar:'A Auditora Brill admitiu que o viveiro não teria salvado o menino de nove anos.'},
  escolhas:[
    {texto:'"Me leva até a Presidente."', vai:'c19_leva_presidente'},
    {texto:'Deixá-la ir.', vai:'c19_fim'}
  ]
},

c19_passou_direto:{
  texto:[
    'Você passa por ela sem falar nada e ela não te segura.',
    'Vinte metros adiante, ela diz, alto o bastante para você ouvir e sem levantar a voz:',
    '"Segunda-feira, dez horas, sala setecentos e quatro. Reunião ordinária do conselho. É aberta, e está no estatuto, Art. 27."',
    'Você não para de andar.',
    '"Em um ano e oito meses", ela continua, atrás de você, "nenhum interessado apareceu."'
  ],
  ef:{flag:['convite_conselho','endereco_presidente'],
      npc:{nome:'Auditora Brill', opiniao:2, memoria:'Te deu o endereço da reunião enquanto você ia embora sem falar.'},
      registrar:'Reunião ordinária do conselho: segunda, 10h, sala 704. É aberta ao público.'},
  escolhas:[{texto:'Continuar andando.', vai:'c19_fim'}]
},

c19_leva_presidente:{
  texto:[
    '"Me leva até a Presidente."',
    'A Auditora Brill olha o galpão 4 por cima do seu ombro.',
    '"Segunda-feira, dez horas, sala setecentos e quatro." Ela liga o carro. "Reunião ordinária do conselho. É aberta. Consta no estatuto."',
    '"Aberta?"',
    '"Art. 27. Qualquer interessado pode assistir e pedir a palavra." Ela fecha a porta e abaixa o vidro. "Em um ano e oito meses, nenhum interessado apareceu."',
    'Ela engata a marcha.',
    '"Leve o que {o senhor|a senhora} trouxe daí de dentro. Eles vão querer ver, e não é armadilha: eles vão querer ver de verdade, e é isso que {o senhor|a senhora} vai achar mais difícil."'
  ],
  ef:{flag:['convite_conselho','endereco_presidente'],
      npc:{nome:'Auditora Brill', opiniao:5, memoria:'Te disse a data, a hora e o número da sala da reunião do conselho.'},
      registrar:'Reunião ordinária do conselho: segunda, 10h, sala 704. Aberta a qualquer interessado.'},
  escolhas:[{texto:'Ir para Saffron.', vai:'c19_fim'}]
},

c19_fim:{
  texto:[
    'Você sai da Rota 21 a pé, com o vento sempre do mesmo lado, e o mato do lado de fora da cerca continua desorganizado, cheio de buraco, com Pokémon brigando por território, morrendo de doença e vivendo trinta e um por cento.',
    'É feio. É muito mais feio que os oito hectares que você acabou de deixar.',
    d=>{
      if (d.flags.somou_a_planilha) return 'E o número continua sendo de quatro dígitos, e continua sem caber na sua cabeça, e continua tendo sido feito catorze por vez.';
      if (d.flags.provas_do_galpao4) return 'E você está carregando trezentos gramas de papel que pesam mais que a mochila inteira.';
      if (d.flags.so_a_visita) return 'E você está carregando um folheto em papel bom com um gráfico e uma legenda que diz que cada um deles é contado, um por um.';
      return 'E você está carregando o cheiro de desinfetante industrial na roupa, que vai sair na primeira lavagem e vai demorar mais que isso.';
    },
    'Na curva grande, você para e olha para trás pela última vez.',
    'Daqui, a Estação 4 é um telhado claro e uma cerca, e parece um lugar de trabalho, porque é.',
    d=>d.flags.convite_conselho
      ? 'Segunda-feira, dez horas, sala setecentos e quatro, Saffron. Aberta a qualquer interessado. Em um ano e oito meses, nenhum apareceu.'
      : 'Em algum lugar de Saffron tem uma sala onde onze pessoas votam de quinze em quinze dias, e uma delas quase sempre perde.'
  ],
  fim:true, resumo:'Capítulo 19 concluído — o número da planilha tem quatro dígitos e foi feito catorze por vez.'
}
}}

);
