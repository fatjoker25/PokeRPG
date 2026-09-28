/* ------------------------------------------------------------
   ABERTURAS — Fuchsia vive de uma cerca. Quem chega pagando,
   quem chega sem os quinhentos, quem chega de excursão e quem
   chega com crachá veem lados diferentes dela.
   ------------------------------------------------------------ */
const C12_ABERTURAS = ['c12_fuchsia', 'c12_ab_ciclovia', 'c12_ab_excursao', 'c12_ab_sem_os_quinhentos', 'c12_ab_de_cracha'];
function c12_cabe(id, d){
  if (id === 'c12_ab_sem_os_quinhentos') return d.jogador.dinheiro < 500;
  if (id === 'c12_ab_de_cracha') return typeof Cargos !== 'undefined' && Cargos.lista().length >= 1;
  return true;
}
function c12_abertura(d){
  const cand = C12_ABERTURAS.filter(id => c12_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 12 — NOVE MIL HECTARES  (Fuchsia / Zona Safári)
   ============================================================ */
CAPITULOS.push(
{
num:12, titulo:'Nove Mil Hectares', local:'Fuchsia / Zona Safári', ambiente:'campo', nivelArea:38,
tom:'muito sombrio', entradas:C12_ABERTURAS,
inicio: d => c12_abertura(d),
cenas:{

c12_ab_ciclovia:{
  texto:[
    'A ciclovia da Rota 17 é a obra pública mais bonita de Kanto e a mais inútil: dezenove quilômetros de asfalto liso descendo um morro, com guarda-corpo dos dois lados, e nenhuma cidade no fim que precise dela.',
    'Você desce a pé porque não tem bicicleta, e descer dezenove quilômetros a pé num asfalto feito pra bicicleta é uma humilhação lenta.',
    'Passam por você catorze ciclistas. Onze são turistas de capacete colorido. Três não são.',
    'Os três não usam capacete, vão em fila, e o terceiro leva uma caixa térmica amarrada no bagageiro com aranha elástica.',
    'Caixa térmica branca, sem identificação, do tamanho de uma caixa de feira.',
    'Eles não desaceleram pra te ultrapassar. Um dos três olha pra você de cima a baixo sem virar a cabeça.',
    'No fim da descida, Fuchsia aparece de uma vez, e a cerca da Zona Safári aparece junto: alambrado de três metros que sai da cidade e some na curva do horizonte.'
  ],
  ef:{flag:'os_tres_da_caixa_termica',
      registrar:'Três ciclistas sem capacete desceram a Rota 17 com uma caixa térmica branca no bagageiro.',
      presagio:'Caixa térmica na descida da 17 vai pra algum lugar em Fuchsia que aceita caixa térmica.'},
  escolhas:[
    {texto:'Tentar ver onde os três pararam.', vai:'c12_ab_onde_pararam'},
    {texto:'Ir direto à recepção da Zona Safári.', vai:'c12_fuchsia'},
    {texto:'Andar pela cidade primeiro.', vai:'c12_cidade'},
    {texto:'Ir ao bar. É onde se sabe das coisas.', vai:'c12_bar'}
  ]
},

c12_ab_onde_pararam:{
  texto:[
    'Você apressa o passo nos últimos dois quilômetros, o que não adianta nada contra bicicleta, e chega na cidade quinze minutos depois deles.',
    'As três bicicletas estão encostadas numa parede na lateral de um prédio baixo da avenida principal.',
    'O prédio é uma padaria. Tem cheiro de pão saindo e tem uma placa de "ABERTO" virada pro certo.',
    'Três homens de bicicleta com uma caixa térmica entraram numa padaria e as bicicletas estão do lado de fora e a caixa térmica não está.',
    'Você fica olhando a padaria por uns quatro minutos e uma senhora sai de lá com um pão francês e um cumprimento pro balconista, e é a coisa mais normal que existe.'
  ],
  ef:{flag:'a_padaria_da_avenida',
      registrar:'Os três da caixa térmica entraram numa padaria da avenida principal de Fuchsia. Saíram sem a caixa.'},
  escolhas:[
    {texto:'Entrar na padaria.', vai:'c12_manejo_padaria'},
    {texto:'Não entrar ainda. Ir à recepção da Zona Safári.', vai:'c12_fuchsia'},
    {texto:'Ir ao bar perguntar sobre a padaria.', vai:'c12_bar'}
  ]
},

c12_ab_excursao:{
  texto:[
    'Você chega na recepção da Zona Safári exatamente junto com um ônibus escolar, o que é a pior sorte possível e a melhor cobertura possível.',
    'Quarenta e dois alunos de uns onze anos, quatro professores e um guia com colete verde e um megafone que ele não precisa usar e usa.',
    fala('o guia do colete verde', 'Turma! Turma! Regra número um da Zona Safári!'),
    'Quarenta e duas vozes, sem entusiasmo nenhum, decoradas de alguma aula anterior:',
    fala('a turma', 'Não passar da faixa amarela.'),
    fala('o guia do colete verde', 'Regra número dois!'),
    fala('a turma', 'Não alimentar.'),
    fala('o guia do colete verde', 'Regra número três!'),
    'Silêncio. Ninguém sabe a três.',
    fala('o guia do colete verde', 'Não fotografar os setores fechados.'),
    'Ele fala a três no tom exato das outras duas, o que é como se esconde uma regra no meio de duas normais.',
    'Um aluno do fundo pergunta o que é setor fechado e o guia já está falando de outra coisa.'
  ],
  ef:{flag:'a_terceira_regra',
      registrar:'A terceira regra da Zona Safári é não fotografar os setores fechados.',
      presagio:'Uma reserva que proíbe foto de parte de si mesma tem parte de si mesma que não é reserva.'},
  escolhas:[
    {texto:'Entrar junto com a excursão.', vai:'c12_ab_com_a_turma'},
    {texto:'Perguntar ao guia o que é setor fechado.', vai:'c12_ab_perguntou_o_setor'},
    {texto:'Deixar a turma entrar e fazer do seu jeito.', vai:'c12_fuchsia'}
  ]
},

c12_ab_perguntou_o_setor:{
  texto:[
    'Você espera a turma passar pela catraca e pergunta pro guia quando ele está sozinho, enrolando o fio do megafone.',
    d=>fala(d.jogador.nome, 'O que é setor fechado?'),
    'Ele responde sem hesitar, porque a resposta é oficial e ele a decorou:',
    fala('o guia do colete verde', 'Áreas em recuperação ambiental. Reflorestamento, ninhal, coisas assim. Fecha por temporada.'),
    d=>fala(d.jogador.nome, 'E por que não pode fotografar área em recuperação?'),
    'Aí ele hesita, e a hesitação dura um segundo e meio.',
    fala('o guia do colete verde', 'Porque flash estressa.'),
    d=>fala(d.jogador.nome, 'Eu não falei em flash.'),
    'Ele enrola o resto do fio do megafone e olha pra catraca, onde a turma dele está indo embora sem ele.',
    fala('o guia do colete verde', 'Olha, eu trabalho aqui há dois anos e essa regra veio num comunicado.', 'baixo'),
    fala('o guia do colete verde', 'Eu não escrevi ela. Eu só falo ela.')
  ],
  ef:{flag:'a_regra_veio_num_comunicado',
      npc:{nome:'o guia do colete verde', opiniao:0, viuVoce:'Você pegou ele numa resposta decorada.'},
      registrar:'A proibição de fotografar setores fechados chegou por comunicado. O guia não sabe de quem.'},
  escolhas:[
    {texto:'Entrar junto com a excursão.', vai:'c12_ab_com_a_turma'},
    {texto:'Procurar o diretor da reserva.', vai:'c12_diretor'},
    {texto:'Ir andar pela cerca por fora.', vai:'c12_cerca'}
  ]
},

c12_ab_com_a_turma:{
  texto:[
    'Você paga a entrada e entra colad{o|a} na excursão, e ninguém pergunta nada, porque uma pessoa a mais em quarenta e sete é invisível.',
    'O passeio guiado dura meia hora e é honestamente bom. Tem um Nidoran fêmea a doze metros da trilha que não liga pra quarenta e sete pessoas, e quarenta e sete pessoas ficam em silêncio ao mesmo tempo, o que é bonito.',
    'Na volta, a trilha passa por uma bifurcação com uma corrente de ferro atravessada e uma placa de madeira: SETOR 7 — ACESSO TÉCNICO.',
    'A trilha do setor 7 é de terra batida e tem marca de pneu. Pneu largo, de veículo pesado, fresco.',
    'Uma reserva em recuperação ambiental não recebe caminhão.',
    'Você olha pro guia. O guia está olhando pro lado oposto com muita atenção pra uma árvore que não tem nada de especial.'
  ],
  ef:{dinheiro:-500, flag:['viu_o_setor_sete','sabe_do_lote_unico'],
      registrar:'A trilha do Setor 7 da Zona Safári tem marca fresca de pneu de veículo pesado.',
      presagio:'O guia olhou pro outro lado na hora exata. Ele sabe onde não olhar.'},
  escolhas:[
    {texto:'Perguntar ao guia na frente da turma.', vai:'c12_ab_na_frente_da_turma'},
    {texto:'Não falar nada e voltar sozinh{o|a} depois.', vai:'c12_cerca'},
    {texto:'Procurar o diretor da reserva.', vai:'c12_diretor'}
  ]
},

c12_ab_na_frente_da_turma:{
  texto:[
    d=>fala(d.jogador.nome, 'Por que tem marca de caminhão numa área em recuperação?'),
    'Você fala alto. Quarenta e dois alunos de onze anos viram ao mesmo tempo, o que é o som de quarenta e duas mochilas.',
    'O guia sorri com a boca.',
    fala('o guia do colete verde', 'Manutenção, {meu amigo|minha amiga}. Tem que levar muda, tem que levar cerca.'),
    'Uma menina do meio da turma, sem levantar a mão:',
    fala('a aluna', 'Mas a marca tá pra dentro e não tem marca voltando.'),
    'Silêncio geral.',
    'Ela tem onze anos e acabou de ver uma coisa que o guia passou dois anos sem ver, ou vendo.',
    fala('o guia do colete verde', 'Vamos, turma. Ônibus às quatro.', 'frio')
  ],
  ef:{flag:'a_menina_da_excursao', moral:1,
      registrar:'Uma aluna de onze anos reparou que a marca de pneu entra no Setor 7 e não volta.',
      presagio:'A marca entra e não sai. Ou o caminhão está lá dentro, ou tem outra saída.'},
  escolhas:[
    {texto:'Procurar o diretor da reserva.', vai:'c12_diretor'},
    {texto:'Andar a cerca por fora e achar a outra saída.', vai:'c12_cerca'},
    {texto:'Ir ao bar da cidade.', vai:'c12_bar'}
  ]
},

c12_ab_sem_os_quinhentos:{
  texto:[
    'A recepção da Zona Safári tem uma catraca, uma bilheteria e um painel de preço em letra grande, e o preço é quinhentos.',
    d=>`Você tem ${Number(d.jogador.dinheiro).toLocaleString('pt-BR')} ₽.`,
    'Você fica na frente do painel o tempo suficiente pra a moça da bilheteria entender, e ela entende, e faz uma coisa gentil: olha pro lado e finge conferir uma papelada.',
    'Do lado de fora tem um banco de concreto de frente pra cerca, e nesse banco tem um homem de uns quarenta anos com um binóculo velho pendurado no pescoço.',
    'O binóculo tem uma fita de couro com o nome gravado a fogo, do jeito que se marcava ferramenta de trabalho: IVO.',
    fala('Ivo', 'Também não vai pagar?'),
    d=>fala(d.jogador.nome, 'Também não vou pagar.'),
    fala('Ivo', 'Senta. Daqui dá pra ver quase a mesma coisa.'),
    'Ele empresta o binóculo sem você pedir, o que é o gesto mais direto que alguém fez com você hoje.'
  ],
  ef:{flag:'o_banco_da_cerca',
      npc:{nome:'Ivo', opiniao:1, viuVoce:'Te emprestou o binóculo no banco em frente à cerca.'},
      registrar:'Não pagou a entrada da Zona Safári. Ficou no banco de fora, com um binóculo emprestado.'},
  escolhas:[
    {texto:'Olhar a reserva pelo binóculo.', vai:'c12_ab_pelo_binoculo'},
    {texto:'Perguntar há quanto tempo ele senta aqui.', vai:'c12_ab_quanto_tempo_ele_senta'},
    {texto:'Agradecer e ir andar a cerca por fora.', vai:'c12_cerca'}
  ]
},

c12_ab_pelo_binoculo:{
  texto:[
    'O binóculo é russo, pesado, com a pintura descascada, e a lente é absurdamente boa.',
    'Você vê, a uns oitocentos metros: capim alto, três Nidorino parados, uma árvore caída que virou passagem.',
    'E, mais à direita, uma estrutura que não é natureza: um galpão comprido de telha metálica com quatro veículos estacionados do lado.',
    'Quatro veículos num dia de semana, numa área em recuperação ambiental.',
    fala('Ivo', 'Achou o galpão.'),
    'Ele não pergunta. Constata.',
    fala('Ivo', 'Todo mundo que pega esse binóculo acha o galpão em menos de dois minutos.'),
    fala('Ivo', 'Eu sento aqui há quatro anos. Sabe quanta gente perguntou pra recepção o que é aquilo?'),
    d=>fala(d.jogador.nome, 'Quanta?'),
    fala('Ivo', 'Eu.')
  ],
  ef:{flag:['o_galpao_do_setor_sete','sabe_do_lote_unico'],
      registrar:'Do banco de fora dá pra ver um galpão de telha metálica com quatro veículos dentro da reserva.'},
  escolhas:[
    {texto:'Perguntar o que a recepção respondeu pra ele.', vai:'c12_ab_o_que_responderam'},
    {texto:'Ir andar a cerca por fora até chegar perto do galpão.', vai:'c12_cerca'},
    {texto:'Ir procurar o diretor da reserva.', vai:'c12_diretor'}
  ]
},

c12_ab_o_que_responderam:{
  texto:[
    fala('Ivo', 'Que era depósito de ração.'),
    'Ele pega o binóculo de volta, ajusta e olha ele mesmo, sem pressa.',
    fala('Ivo', 'Nove mil hectares de reserva com bicho selvagem que come sozinho, e um depósito de ração de sessenta metros de comprimento.'),
    fala('Ivo', 'Eu perguntei isso também. Aí eles pararam de responder.'),
    d=>fala(d.jogador.nome, 'Por que você não desiste?'),
    'Ele abaixa o binóculo.',
    fala('Ivo', 'Eu trabalhei lá dentro. Onze anos, manejo.'),
    fala('Ivo', 'Me mandaram embora no dia em que o galpão ficou pronto.', 'baixo')
  ],
  ef:{flag:'o_homem_do_binoculo_trabalhou_la',
      npc:{nome:'Ivo', opiniao:2, viuVoce:'Te contou que foi demitido no dia em que o galpão ficou pronto.'},
      registrar:'Ivo trabalhou onze anos no manejo da reserva. Foi demitido quando o galpão ficou pronto.'},
  escolhas:[
    {texto:'Ir andar a cerca por fora.', vai:'c12_cerca'},
    {texto:'Ir procurar o diretor da reserva.', vai:'c12_diretor'},
    {texto:'Ir ao bar da cidade com esse nome na cabeça.', vai:'c12_bar'}
  ]
},

c12_ab_quanto_tempo_ele_senta:{
  texto:[
    fala('Ivo', 'Quatro anos. Quase todo dia.'),
    d=>fala(d.jogador.nome, 'Fazendo o quê?'),
    fala('Ivo', 'Contando.'),
    'Ele tira do bolso de trás uma caderneta de capa dura, dessas de armazém, gasta nas quinas.',
    'Cada página tem uma data e uma coluna de traços.',
    fala('Ivo', 'Caminhão que entra pelo portão técnico. Eu conto desde noventa e seis.'),
    fala('Ivo', 'Noventa e seis: dezenove no ano. Noventa e sete: vinte e quatro.'),
    'Ele vira pra última página preenchida.',
    fala('Ivo', 'Esse ano, até agora: cento e quarenta e um.')
  ],
  ef:{flag:['a_caderneta_do_binoculo','sabe_do_lote_unico'],
      registrar:'Uma caderneta conta os caminhões que entram no portão técnico da reserva: 19 em 1996, 141 este ano.',
      presagio:'Dezenove pra cento e quarenta e um em quatro anos. Isso não cresceu: isso virou outra coisa.'},
  escolhas:[
    {texto:'Pedir a caderneta emprestada.', vai:'c12_ab_a_caderneta'},
    {texto:'Olhar a reserva pelo binóculo.', vai:'c12_ab_pelo_binoculo'},
    {texto:'Ir procurar o diretor da reserva.', vai:'c12_diretor'}
  ]
},

c12_ab_a_caderneta:{
  texto:[
    d=>fala(d.jogador.nome, 'Me empresta isso.'),
    'Ele segura a caderneta com as duas mãos e não entrega na hora.',
    fala('Ivo', 'Isso aqui é quatro anos da minha vida.'),
    d=>fala(d.jogador.nome, 'Eu sei. Por isso eu quero.'),
    'Ele entrega.',
    fala('Ivo', 'Se você perder, eu não tenho cópia.'),
    fala('Ivo', 'E se você mostrar pra pessoa errada, eu também não tenho cópia.'),
    'Você guarda a caderneta na parte de dentro da mochila, que é onde vai o que não pode molhar.'
  ],
  ef:{flag:'tem_a_caderneta_do_binoculo',
      npc:{nome:'Ivo', opiniao:3, viuVoce:'Te entregou quatro anos de contagem sem ter cópia.'},
      registrar:'Está com a caderneta de contagem de caminhões. Não existe cópia.',
      presagio:'Ele não tem cópia. O que você fizer com esse caderno é definitivo.'},
  escolhas:[
    {texto:'Procurar o diretor da reserva.', vai:'c12_diretor'},
    {texto:'Andar a cerca por fora.', vai:'c12_cerca'},
    {texto:'Ir ao bar da cidade.', vai:'c12_bar'}
  ]
},

c12_ab_de_cracha:{
  texto:[
    d=>{
      const c = Cargos.principal();
      return `A recepção da Zona Safári tem uma catraca pra visitante e uma porta lateral com interfone pra quem não é visitante, e o seu crachá de ${c ? c.nome : 'serviço'} te põe na porta lateral.`;
    },
    'Do lado de dentro não é a reserva. É um escritório: quatro mesas, dois computadores, um mapa mural de nove mil hectares com alfinete colorido.',
    d=>d.flags.conheceu_prado
      ? 'A mulher que levanta de uma das mesas é a da prancheta do pregão de Celadon, e ela te reconhece antes de você reconhecer ela.'
      : 'Uma mulher de uns cinquenta anos levanta de uma das mesas e vem te receber com a mão estendida e o nome já pronto.',
    d=>fala('Auditora Brill', d.flags.conheceu_prado ? 'Brill. Hoje é auditoria de manejo.' : 'Brill. Auditoria de manejo.'),
    d=>fala(d.jogador.nome, 'Auditoria?'),
    fala('Auditora Brill', 'Eu chego antes de vocês e saio depois. É o serviço.'),
    'Ela olha o seu crachá, depois a sua cara, e faz a conta da sua idade em silêncio.',
    fala('Auditora Brill', 'Você é {novo|nova}. Quanto tempo de casa?'),
    'A resposta honesta é constrangedora e você dá ela mesmo assim.'
  ],
  ef:{flag:'conheceu_a_nishino',
      npc:{nome:'Auditora Brill', opiniao:1, viuVoce:'Te recebeu pela porta lateral da Zona Safári.'},
      registrar:'Conheceu a Auditora Brill, da auditoria de manejo, no escritório da Zona Safári.'},
  escolhas:[
    {texto:'Perguntar o que ela está auditando.', vai:'c12_ab_o_que_ela_audita'},
    {texto:'Perguntar pelo Setor 7 direto.', vai:'c12_ab_perguntou_o_sete'},
    {texto:'Pedir pra falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_ab_o_que_ela_audita:{
  texto:[
    'Ela volta pra mesa dela e vira uma pasta na sua direção sem entregar.',
    fala('Auditora Brill', 'Balanço de espécimes. Entrou, nasceu, morreu, saiu.'),
    fala('Auditora Brill', 'É a conta mais simples que existe. E é a única conta que essa reserva não fecha.'),
    d=>fala(d.jogador.nome, 'Não fecha por quanto?'),
    fala('Auditora Brill', 'Por quatrocentos e doze.'),
    'Ela diz o número devagar, como quem já disse esse número pra muita gente que não reagiu.',
    fala('Auditora Brill', 'Quatrocentos e doze animais que entraram na conta e não saíram por nenhuma das três portas: nem morte, nem transferência, nem soltura.'),
    fala('Auditora Brill', 'Eu escrevi isso em três relatórios. Os três foram arquivados como "divergência metodológica".')
  ],
  ef:{flag:['quatrocentos_e_doze','sabe_do_lote_unico'],
      registrar:'A auditoria aponta 412 espécimes que entraram na Zona Safári e não saíram por nenhuma das três portas.',
      presagio:'Quatrocentos e doze. Guarde esse número: ele vai reaparecer com outro nome.'},
  escolhas:[
    {texto:'Perguntar pelo Setor 7.', vai:'c12_ab_perguntou_o_sete'},
    {texto:'Pedir cópia de um dos relatórios.', vai:'c12_ab_a_copia_do_relatorio'},
    {texto:'Pedir pra falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_ab_perguntou_o_sete:{
  texto:[
    d=>fala(d.jogador.nome, 'O que é o Setor 7?'),
    'Ela não se assusta. Ela fica satisfeita, que é pior.',
    fala('Auditora Brill', 'Em que documento você viu isso escrito?'),
    d=>fala(d.jogador.nome, 'Numa placa de madeira numa bifurcação.'),
    fala('Auditora Brill', 'Então você viu num lugar onde eu não posso citar.'),
    'Ela puxa o mapa mural com o dedo, sem virar o corpo, e aponta uma área a nordeste.',
    fala('Auditora Brill', 'No mapa oficial o Setor 7 não existe. Tem setor 1 a 6 e setor 8.'),
    d=>fala(d.jogador.nome, 'E o oito fica onde?'),
    fala('Auditora Brill', 'Do outro lado do sete.')
  ],
  ef:{flag:['o_setor_sete_nao_existe_no_mapa','sabotou_o_setor7'],
      registrar:'O mapa oficial da Zona Safári vai do setor 1 ao 6 e pula direto pro 8.',
      presagio:'Numerar de 1 a 8 e pular o 7 é mais trabalho do que não numerar. Alguém quis que o 7 sumisse depois.'},
  escolhas:[
    {texto:'Pedir cópia de um relatório da auditoria.', vai:'c12_ab_a_copia_do_relatorio'},
    {texto:'Pedir pra falar com o diretor.', vai:'c12_diretor'},
    {texto:'Sair e andar a cerca por fora, a nordeste.', vai:'c12_cerca'}
  ]
},

c12_ab_a_copia_do_relatorio:{
  texto:[
    fala('Auditora Brill', 'Você sabe o que acontece se eu te der cópia?'),
    d=>fala(d.jogador.nome, 'Não.'),
    fala('Auditora Brill', 'Nada. Absolutamente nada.'),
    'Ela abre a gaveta e tira três pastas já separadas, com elástico, prontas.',
    fala('Auditora Brill', 'Relatório de auditoria é documento público. Qualquer pessoa pode pedir.'),
    fala('Auditora Brill', 'Em quatro anos, você é a segunda pessoa a pedir.'),
    d=>fala(d.jogador.nome, 'E a primeira?'),
    fala('Auditora Brill', 'Uma repórter de Saffron. Ano passado.'),
    'Ela empurra as três pastas.',
    fala('Auditora Brill', 'Ela pediu, eu dei, e não saiu nada. Eu não sei por quê e parei de perguntar.')
  ],
  ef:{flag:['tem_os_relatorios_da_nishino','reika_precisa_de_papel'],
      npc:{nome:'Auditora Brill', opiniao:3, viuVoce:'Te entregou três relatórios de auditoria arquivados.'},
      registrar:'Está com três relatórios de auditoria da Zona Safári, arquivados como "divergência metodológica".',
      presagio:'Documento público que ninguém pede é o esconderijo mais seguro que existe.'},
  escolhas:[
    {texto:'Pedir pra falar com o diretor.', vai:'c12_diretor'},
    {texto:'Sair e andar a cerca por fora.', vai:'c12_cerca'},
    {texto:'Sair e ir ao bar da cidade.', vai:'c12_bar'}
  ]
},


c12_fuchsia:{
  texto:[
    'Fuchsia é uma cidade pequena que existe por causa de uma coisa grande.',
    'Quatro mil habitantes, uma avenida principal de setecentos metros, duas pousadas, uma escola, um posto de saúde que fecha às dezoito, e do outro lado da rua: uma cerca de alambrado de três metros que continua por trinta e um quilômetros.',
    'A Zona Safári tem nove mil hectares. É a maior área protegida de Kanto e a única que gera receita própria.',
    'A entrada custa quinhentos, dá trinta bolas especiais, meia hora de caminhada guiada e um folheto plastificado com o nome das espécies.',
    'É turismo. É bom turismo, inclusive: a reserva é linda, o folheto é bem-feito, o dinheiro fica na cidade.',
    'Na fachada da recepção tem um painel com uma frase em letra garrafal, dessas de placa de rodovia:',
    '**A CERCA EXISTE PARA MANTER VOCÊ FORA, NÃO ELES DENTRO.**',
    'É uma frase bonita. Você vai passar o capítulo inteiro descobrindo o que ela quer dizer.',
    d=>{
      const via = Historia.via();
      if (via==='mercenario'||via==='foragido') return 'E a sua entrega desta semana tem origem escrita na etiqueta, em caneta, no canto de baixo: **ZS-SETOR 7**. Você veio buscar na fonte, o que é uma frase que você não gostaria de estar pensando.';
      if (via==='pesquisador') return 'E no livro de destinos que você tirou de Celadon, quatro linhas tinham origem "ZS-7". Você veio ver o que é o setor 7.';
      if (via==='heroi') return 'E três Pokémon que você soltou em Celadon tinham brinco numerado na orelha. Brinco amarelo de plástico, de identificação de reserva. Desta reserva.';
      return 'E na parede da recepção tem um cartaz desbotado, de uns dez anos atrás: "AJUDE-NOS — Pokémon avistados FORA da cerca devem ser reportados." Fora. Não dentro.';
    }
  ],
  ef:{registrar:'Chegou a Fuchsia e à Zona Safári.',
      presagio:'"A cerca existe para manter você fora, não eles dentro." Lê de novo daqui a três horas.'},
  escolhas:[
    {texto:'Pagar a entrada e fazer o passeio guiado.', vai:'c12_passeio', cond:d=>d.jogador.dinheiro>=500,
     ef:{dinheiro:-500}},
    {texto:'Andar pela cidade e entender de que ela vive.', vai:'c12_cidade'},
    {texto:'Seguir a cerca por fora até achar por onde sai caminhão.', vai:'c12_cerca'},
    {texto:'Falar com o diretor da reserva.', vai:'c12_diretor'}
  ]
},

c12_cidade:{
  falante:'a dona da padaria',
  vozes:['N'],
  texto:[
    'Você anda Fuchsia inteira em uma hora e quarenta, porque Fuchsia inteira dá uma hora e quarenta.',
    'A cidade vive da reserva de um jeito que não é sutil.',
    'A pousada se chama Pousada do Safári. A padaria vende pão de queijo em saquinho com a silhueta de um Kangaskhan. O posto de gasolina tem um outdoor da reserva. A escola municipal se chama Escola Municipal Reserva Fuchsia.',
    'E tem um detalhe que você leva quarenta minutos pra notar e depois não consegue desnotar:',
    'não tem nenhum Pokémon selvagem na cidade.',
    'Nenhum. Nem Pidgey, nem Rattata, nem inseto. Em Pewter tinha. Em Cerulean tinha. Em Lavender tinha muito.',
    'Aqui, do lado de nove mil hectares de reserva, dentro de uma cidade de quatro mil pessoas, não tem um.',
    'Você pergunta pra dona da padaria e ela responde com orgulho genuíno:',
    '"Ah, aqui é limpo. A gente tem manejo."'
  ],
  ef:{flag:['viu_fuchsia','ouviu_manejo'],
      rep:{eixo:'bom',delta:1,motivo:'Reparou no que não estava lá'},
      registrar:'Não há um único Pokémon selvagem em Fuchsia. A cidade chama isso de "manejo".',
      presagio:'"A gente tem manejo." Ela disse com orgulho. Guarde a palavra.'},
  escolhas:[
    {texto:'"O que é manejo?" — perguntar na padaria mesmo.', vai:'c12_manejo_padaria'},
    {texto:'Procurar o ginásio da cidade.', vai:'c12_ginasio'},
    {texto:'Seguir a cerca por fora.', vai:'c12_cerca'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'}
  ]
},

c12_manejo_padaria:{
  texto:[
    '"O que é manejo?"',
    'Ela para de embalar o pão de queijo com a silhueta do Kangaskhan.',
    '"Manejo é... é o controle, né? Pra não ter bicho demais."',
    '"E quando tem bicho demais?"',
    '"Aí eles tiram."',
    '"Tiram pra onde?"',
    'E aí acontece a coisa que você vai ver acontecer com sete pessoas diferentes nessa cidade nas próximas quarenta e oito horas:',
    'ela abre a boca pra responder, e não tem a resposta, e percebe que não tem a resposta, e a cara dela muda.',
    '"Sabe que eu nunca perguntei?"',
    'Ela mexe no saquinho.',
    '"Meu marido trabalhou lá dezesseis anos. Eu nunca perguntei."'
  ],
  ef:{flag:'ninguem_pergunta',
      rep:{eixo:'bom',delta:2,motivo:'Fez uma pergunta que a cidade inteira não fazia'},
      npc:{nome:'Dona da padaria', opiniao:2, memoria:'Percebeu, falando com você, que nunca perguntou para onde levam o excedente.'},
      registrar:'Ninguém em Fuchsia sabe para onde vai o "excedente" da reserva.',
      presagio:'Ela nunca perguntou em dezesseis anos de casamento. Não é burrice — é conveniência.'},
  escolhas:[
    {texto:'"Seu marido pode me contar?"', vai:'c12_marido'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Fazer o passeio guiado.', vai:'c12_passeio', cond:d=>d.jogador.dinheiro>=500, ef:{dinheiro:-500}}
  ]
},

c12_marido:{
  texto:[
    'O marido dela se chama Vandir Zane — Sr. Zane, como a cidade inteira o trata — e está na sala dos fundos da padaria assistindo televisão às três da tarde, porque se aposentou da reserva faz quatro anos e não sabe o que fazer com o dia.',
    'Ele desliga a televisão sozinho quando você pergunta, o que já é resposta.',
    '"Dezesseis anos. Eu era da equipe de captura."',
    '"Captura de quê?"',
    '"De excedente." Ele fala a palavra do jeito que se fala palavra que a gente usou tanto que não significa mais nada. "A gente saía com rede, com bola, com carrinho, e trazia."',
    '"E a conta era feita como?"',
    'E aí ele te dá a informação mais útil do capítulo, e dá porque ninguém nunca perguntou:',
    '"Censo. Todo mês de março tem censo. Sobrevoo com helicóptero, contagem por setor, e uma planilha."',
    '"E a planilha diz quanto é demais."',
    '"A planilha diz quanto o setor suporta. Se tá acima, tira."',
    'Ele coça o joelho.',
    '"Só que a planilha é de mil novecentos e setenta e um."'
  ],
  ef:{flag:['sabe_do_censo','sabe_da_planilha_71'],
      npc:{nome:'Sr. Zane', opiniao:3, memoria:'Dezesseis anos na equipe de captura da Zona. Desligou a televisão sozinho quando você perguntou.'},
      rep:{eixo:'bom',delta:3,motivo:'Achou quem fazia a captura e perguntou como a conta era feita'},
      registrar:'A capacidade de suporte da Zona Safári é calculada por uma planilha de 1971.',
      presagio:'Uma planilha de mil novecentos e setenta e um. Ninguém refez a conta em trinta anos.'},
  escolhas:[
    {texto:'"E se a planilha estiver errada?"', vai:'c12_planilha_errada'},
    {texto:'"Pra onde vai o excedente?"', vai:'c12_pra_onde_vai'},
    {texto:'"Me fala do setor 7."', vai:'c12_vandir_setor7'},
    {texto:'Agradecer e ir falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_planilha_errada:{
  falante:'Sr. Zane',
  vozes:['P','N','P','N','N','N','P','P','N','P','N'],
  texto:[
    '"E se a planilha estiver errada?"',
    'Ele ri primeiro. Depois para de rir.',
    '"Como assim errada?"',
    '"Setenta e um. A reserva tinha o mesmo tamanho em setenta e um?"',
    '"Tinha menos. Em setenta e um ia só até o córrego. A fazenda da beira do rio entrou na reserva em oitenta e cinco, quando o dono morreu sem herdeiro."',
    'Silêncio.',
    '"Então a área aumentou e a conta não mudou."',
    'Ele olha a televisão desligada.',
    '"E isso quer dizer o quê?"',
    '"Quer dizer que a conta acha que cabe menos do que cabe." Você fala devagar, porque você mesm{o|a} está entendendo enquanto fala. "O censo conta os bichos de nove mil hectares e a planilha divide pela área de setenta e um, que é menor. A densidade dá mais alta do que é. Aí todo ano a planilha acusa excedente."',
    '"Todo ano."',
    '"Todo ano."',
    'Sr. Zane fica muito quieto.',
    '"Dezesseis anos, {moço|moça}."'
  ],
  ef:{flag:['entendeu_a_conta','sabe_da_planilha_71'],
      rep:{eixo:'bom',delta:5,motivo:'Desmontou trinta anos de política pública num fundo de padaria'},
      moral:-10, instabilidade:1,
      npc:{nome:'Sr. Zane', opiniao:5, memoria:'Descobriu com você que a planilha que justificou dezesseis anos de captura estava errada desde 1985.'},
      registrar:'A reserva cresceu em 1985 e a planilha de 1971 nunca foi refeita: o "excedente" é um erro de cálculo.',
      presagio:'Todo ano acusa excedente. Todo ano. Não tem vilão nessa conta.'},
  escolhas:[
    {texto:'"Pra onde vai o excedente?"', vai:'c12_pra_onde_vai'},
    {texto:'"Me fala do setor 7."', vai:'c12_vandir_setor7'},
    {texto:'Levar isso pro diretor.', vai:'c12_diretor'},
    {texto:'Ir ao setor 7 à noite e ver com os olhos.', vai:'c12_noite_zona'}
  ]
},

c12_pra_onde_vai:{
  falante:'Sr. Zane',
  vozes:['P','N','P','P','N','N'],
  texto:[
    '"Pra onde vai o excedente?"',
    'Ele demora.',
    '"Nos meus primeiros anos ia pra soltura. A gente levava de caminhão pro norte, pra Rota 14, e soltava, e voltava."',
    '"E depois?"',
    fala('Sr. Zane', 'Depois a Rota 14 encheu, aí a gente levava mais longe. Aí a gente levava até Cerulean. Aí um ano o supervisor disse que não ia ter mais caminhão pra soltura porque era caro, e que a partir dali a retirada ia ser “entregue a receptor credenciado”.'),
    '"E o que é receptor credenciado?"',
    '"Eu perguntei uma vez."',
    'Ele olha pra você.',
    '"Ele disse que era gente que tem depósito com alvará."'
  ],
  ef:{flag:['sabe_do_receptor','sabe_do_deposito'],
      rep:{eixo:'bom',delta:3,motivo:'Puxou o fio até ele chegar em Celadon'},
      moral:-8,
      registrar:'O "excedente" da Zona Safári vai para "receptor credenciado" — depósito com alvará.',
      presagio:'Depósito com alvará. Você já esteve em um. Tinha quarenta e uma gaiolas.'},
  escolhas:[
    {texto:'"Me fala do setor 7."', vai:'c12_vandir_setor7'},
    {texto:'"Você levaria a soltura de volta?"', vai:'c12_vandir_soltura'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_vandir_setor7:{
  falante:'Sr. Zane',
  vozes:['P','N','N','P','N','N','N','N'],
  texto:[
    '"Me fala do setor 7."',
    '"Setor 7 era pasto." Ele não hesita. "Pasto degradado de uma fazenda que virou reserva em sessenta e nove. A gente usava como área de manobra."',
    '"E hoje?"',
    '"Hoje eu não sei, porque fecharam dois anos atrás pra “recuperação ambiental” e eu já tinha me aposentado."',
    'Ele pensa.',
    '"Mas eu vou te dizer uma coisa de quem trabalhou lá dezesseis anos: recuperação ambiental de pasto é plantio. Plantio precisa de muda, de trator, de irrigação e de gente."',
    '"E eu moro nessa cidade de quatro mil pessoas e não conheço ninguém que tenha sido contratado pra plantar nada."',
    '"E eu conheço todo mundo."'
  ],
  ef:{flag:['sabe_do_setor7','sabe_que_nao_tem_plantio'],
      rep:{eixo:'bom',delta:2,motivo:'Perguntou a quem conhece a cidade inteira'},
      registrar:'O setor 7 está fechado há dois anos para "recuperação ambiental" e ninguém foi contratado para plantar nada.',
      presagio:'Ele conhece todo mundo numa cidade de quatro mil. Isso é um banco de dados.'},
  escolhas:[
    {texto:'"Quem entra e sai do setor 7, então?"', vai:'c12_quem_entra'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Fazer o passeio guiado primeiro.', vai:'c12_passeio', cond:d=>d.jogador.dinheiro>=500, ef:{dinheiro:-500}}
  ]
},

c12_quem_entra:{
  falante:'Sr. Zane',
  vozes:['P','N','P','N','P','N','P','N','N','N'],
  texto:[
    '"Quem entra e sai do setor 7, então?"',
    'Ele coça o joelho de novo, que é o gesto que ele faz quando está prestes a dizer uma coisa que não queria.',
    '"Caminhão. Duas ou três vezes por mês, de madrugada."',
    '"Você viu?"',
    '"Eu ouço. Eu moro na saída sul e o portão de serviço é a oitocentos metros da minha casa, e caminhão de madrugada acorda velho."',
    '"E o que mais?"',
    '"Tem uma van branca que entra toda terça de manhã e sai toda terça de tarde."',
    '"Van de quê?"',
    '"Da veterinária." Ele fala isso como se fosse óbvio. "A doutora Pia. Ela atende a reserva há uns oito anos, mora em Fuchsia mesmo, casa da rua da escola."',
    'Ele olha pra você com uma cara nova.',
    '"Ela entra no setor 7 toda terça, {moço|moça}. Toda terça, há dois anos, num setor que tá fechado pra recuperação ambiental."'
  ],
  ef:{flag:['sabe_da_yara','endereco_yara'],
      rep:{eixo:'bom',delta:3,motivo:'Achou a pessoa que entra no setor fechado toda semana'},
      registrar:'A Dra. Pia, veterinária da reserva, entra no setor 7 toda terça-feira há dois anos.',
      presagio:'Toda terça. Uma veterinária. Num lugar onde supostamente só se planta grama.'},
  escolhas:[
    {texto:'Ir procurar a Dra. Pia.', vai:'c12_yara'},
    {texto:'Ir falar com o diretor primeiro.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_vandir_soltura:{
  falante:'Sr. Zane',
  vozes:['P','N','P','N','P','N','N','N'],
  texto:[
    '"Você levaria a soltura de volta?"',
    'A pergunta pega ele num lugar que nenhuma outra pegou.',
    '"Eu tenho sessenta e sete anos e uma hérnia."',
    '"Não perguntei se você aguenta. Perguntei se você levaria."',
    'Ele fica quieto uns dez segundos.',
    '"Eu tenho carteira de motorista categoria C e eu dirigi caminhão de soltura por nove anos."',
    '"Isso é sim."',
    '"Isso é sim."',
    'Ele liga a televisão de novo e desliga na mesma hora, que é uma coisa que gente faz quando está mexida.',
    '"Se você conseguir que aquilo abra, {moço|moça}, eu dirijo. Eu conheço os pontos de soltura todos, eu tenho o mapa na cabeça, e eu sei qual espécie vai pra qual lugar sem precisar de livro."',
    '"E eu tô com a hérnia, e eu dirijo."'
  ],
  ef:{flag:['vandir_dirige','tem_quem_leve'],
      npc:{nome:'Sr. Zane', opiniao:8, memoria:'Se ofereceu para dirigir o caminhão de soltura, com hérnia e sessenta e sete anos.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou a coisa certa ao homem certo'},
      moral:15,
      registrar:'Sr. Zane dirige o caminhão de soltura se você conseguir abrir o setor 7.',
      presagio:'Ele tem o mapa na cabeça. Guarde — isso muda o final desse capítulo.'},
  escolhas:[
    {texto:'"Então me ajuda a abrir."', vai:'c12_vandir_setor7'},
    {texto:'Ir procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_ginasio:{
  texto:[
    'O ginásio de Fuchsia fica na ponta leste da avenida e é a única construção da cidade que não menciona a reserva no nome.',
    'É uma casa baixa de madeira com telhado curvo, jardim de pedra, e um portão de correr que faz barulho de portão de correr.',
    'Na placa: **KOGA — VENENO**. E embaixo, menor: "Atendimento: quarta e sexta, 14h às 18h."',
    'Hoje é terça.',
    'Tem uma menina de uns treze anos varrendo o jardim de pedra com um ancinho de bambu, fazendo as linhas paralelas, do jeito certo.',
    'Ela te olha, olha as insígnias que você tem, e volta a varrer.',
    '"Quarta e sexta."',
    '"Eu sei. Eu tô só olhando."',
    '"Todo mundo tá só olhando." Ela não para de varrer. "Meu pai diz que veneno é o tipo mais honesto porque ele avisa o que vai fazer e faz devagar."'
  ],
  ef:{flag:'achou_ginasio_fuchsia',
      executar:d=>{ Mundo.descobrir('ginasio_fuchsia'); return []; },
      npc:{nome:'Filha do Koga', opiniao:1, memoria:'Varria o jardim de pedra do ginásio de Fuchsia numa terça.'},
      registrar:'O ginásio de Fuchsia abre quarta e sexta, das 14h às 18h.',
      presagio:'"Veneno avisa o que vai fazer e faz devagar." Vale pra mais coisa que o tipo.'},
  escolhas:[
    {texto:'"Seu pai trabalha com a reserva?"', vai:'c12_koga_reserva'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Fazer o passeio guiado.', vai:'c12_passeio', cond:d=>d.jogador.dinheiro>=500, ef:{dinheiro:-500}}
  ]
},

c12_koga_reserva:{
  texto:[
    '"Seu pai trabalha com a reserva?"',
    'Ela para de varrer pela primeira vez.',
    '"Meu pai é conselheiro da reserva. Tem um conselho com sete pessoas e ele é uma."',
    '"E o que o conselho faz?"',
    '"Aprova o relatório de manejo todo ano." Ela apoia o ancinho. "Meu pai lê o relatório inteiro todo ano e ele é o único que lê, porque os outros seis assinam na reunião sem abrir."',
    '"Como você sabe?"',
    '"Porque ele reclama disso na mesa de jantar todo mês de abril desde que eu nasci."',
    'Ela volta a varrer.',
    '"E esse ano ele não reclamou. Esse ano ele leu o relatório, ficou três dias sem falar com ninguém, e não assinou."',
    '"Ele não assinou?"',
    '"Ele não assinou. E a reunião aprovou do mesmo jeito, porque seis é mais que um."'
  ],
  ef:{flag:['sabe_do_conselho','koga_nao_assinou'],
      rep:{eixo:'bom',delta:3,motivo:'Descobriu que alguém já tinha tentado, por dentro'},
      npc:{nome:'Filha do Koga', opiniao:4, memoria:'Te contou que o pai dela leu o relatório de manejo e se recusou a assinar.'},
      registrar:'Koga, líder de Fuchsia, é conselheiro da reserva e se recusou a assinar o último relatório de manejo.',
      presagio:'Seis é mais que um. E mesmo assim ele não assinou.'},
  escolhas:[
    {texto:'"Eu preciso falar com ele."', vai:'c12_koga'},
    {texto:'"Ele tem cópia do relatório?"', vai:'c12_koga'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara}
  ]
},

c12_koga:{
  falante:'Koga',
  vozes:['N','P','N','N','P','N','N'],
  texto:[
    'Koga te recebe na varanda dos fundos, sentado no chão de tábua, com chá e sem cerimônia nenhuma.',
    'Ele é mais velho do que as fotos sugerem e muito mais quieto.',
    'Ele não pergunta o que você quer. Ele espera.',
    'Quando você termina de falar, ele bebe o chá inteiro antes de responder.',
    '"O relatório deste ano pede a retirada de duzentos e quarenta."',
    '"Duzentos e quarenta?"',
    '"Duzentos e quarenta. O do ano passado pediu cento e noventa. O de dois anos atrás, cento e trinta."',
    'Ele põe a xícara no chão.',
    '"Uma população que está sendo retirada todo ano deveria diminuir a pressão sobre a área. A retirada deveria cair."',
    '"E ela sobe."',
    '"Ela sobe, todo ano, há seis anos."',
    'Ele olha o jardim.',
    '"Ou a planilha está errada, ou alguém está enchendo a reserva para poder esvaziar."'
  ],
  ef:{flag:['conheceu_koga','sabe_dos_240'],
      npc:{nome:'Koga', opiniao:3, memoria:'Te disse na varanda que a retirada da reserva sobe todo ano há seis anos.'},
      rep:{eixo:'bom',delta:3,motivo:'Chegou ao único conselheiro que lia o relatório'},
      instabilidade:1,
      registrar:'A retirada anual da Zona Safári subiu de 130 para 240 em seis anos.',
      presagio:'"Alguém está enchendo a reserva para poder esvaziar." Guarde as duas hipóteses.'},
  escolhas:[
    {texto:'"A planilha é de 1971 e a reserva cresceu em 85."', vai:'c12_koga_planilha', cond:d=>!!d.flags.entendeu_a_conta},
    {texto:'"Me dá o relatório."', vai:'c12_koga_relatorio'},
    {texto:'"Como assim enchendo a reserva?"', vai:'c12_enchendo'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c12_desafio_koga'}
  ]
},

c12_koga_planilha:{
  falante:'Koga',
  vozes:['P','N','P','N'],
  texto:[
    '"A planilha é de setenta e um. E a reserva ganhou a fazenda do rio em oitenta e cinco."',
    'Koga não se move por uns cinco segundos.',
    'Depois ele levanta, entra na casa, e volta com uma pasta de papel pardo amarrada com barbante — não um arquivo, uma pasta de verdade, dessas que gente que lê guarda.',
    'Ele abre no chão da varanda e procura, e acha, e vira pra você.',
    'É o anexo técnico do relatório. E na primeira página do anexo, no campo "área de referência", está escrito:',
    '**8.160 ha (ref. levantamento 1971)**',
    'E a reserva hoje tem nove mil.',
    'Oitocentos e quarenta hectares de diferença, usados numa conta de densidade populacional, todo ano, por quinze anos.',
    'Koga fecha a pasta com cuidado.',
    '"Eu li esse relatório vinte e três vezes e eu nunca conferi a área."',
    '"Ninguém confere a área."',
    '"Eu deveria."'
  ],
  ef:{flag:['provou_o_erro','provas_zona'],
      itens:{'Anexo técnico do relatório':1},
      npc:{nome:'Koga', opiniao:7, memoria:'Você mostrou a ele o erro de área que ele não conferiu em vinte e três leituras.'},
      rep:{eixo:'bom',delta:6,motivo:'Provou documentalmente que o excedente é um erro de planilha'},
      instabilidade:1,
      registrar:'O relatório usa área de referência de 8.160 ha; a reserva tem 9.000. O excedente é erro de cálculo.',
      presagio:'Oitocentos e quarenta hectares de diferença. Quinze anos. Ninguém confere a área.'},
  escolhas:[
    {texto:'"Então a gente derruba o relatório."', vai:'c12_derrubar_relatorio'},
    {texto:'"Mas tem gente lucrando com o erro."', vai:'c12_enchendo'},
    {texto:'"Me dá o relatório inteiro. Eu levo."', vai:'c12_koga_relatorio'},
    {texto:'"Eu vou ao setor 7 hoje à noite."', vai:'c12_noite_zona'}
  ]
},

c12_derrubar_relatorio:{
  texto:[
    '"Então a gente derruba o relatório."',
    'Ele balança a cabeça devagar.',
    '"Derrubar o relatório suspende a retirada do ano que vem."',
    '"Isso é bom."',
    '"Isso é bom e não resolve o que já está no setor 7 esta noite."',
    'Ele serve mais chá, pra você e pra ele.',
    '"Eu convoco reunião extraordinária do conselho. Leva onze dias entre convocação e realização, por regimento."',
    '"Onze dias."',
    '"Onze dias." Ele te olha. "Eu faço a parte que leva onze dias. Alguém tem que fazer a parte de hoje à noite."',
    'E ele diz isso sem nenhum peso, sem nenhuma insinuação heroica, do jeito que se distribui tarefa.',
    '"Eu tenho sessenta e dois anos e um assento em conselho. Você tem quinze anos e nada a perder num regimento."',
    '"A gente é bem complementar."'
  ],
  ef:{flag:['koga_convoca','koga_aliado'],
      npc:{nome:'Koga', opiniao:9, memoria:'Convocou reunião extraordinária do conselho e dividiu as tarefas com você.'},
      rep:{eixo:'bom',delta:5,motivo:'Conseguiu que o caminho lento e o caminho rápido andassem juntos'},
      moral:12,
      registrar:'Koga convocou reunião extraordinária do conselho: onze dias.',
      presagio:'"A gente é bem complementar." Anota — é a primeira vez na viagem que alguém divide tarefa com você de igual pra igual.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia antes.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor antes.', vai:'c12_diretor'},
    {texto:'Desafiar o ginásio antes.', vai:'c12_desafio_koga'}
  ]
},

c12_enchendo:{
  falante:'Koga',
  vozes:['P','N','N','P','N','N','P','N','P','N','N'],
  texto:[
    '"Como assim enchendo a reserva?"',
    '"Solturas."',
    'Ele espera você entender sozinh{o|a} e você não entende, e ele explica sem impaciência.',
    '"A reserva recebe solturas. Apreensão de Liga, resgate de maus-tratos, entrega voluntária. São umas duzentas por ano e elas entram na população."',
    '"E isso é bom."',
    '"Isso é ótimo. É o que uma reserva deve fazer."',
    'Ele vira a xícara vazia de boca pra baixo.',
    '"A não ser que a mesma pessoa aprove as solturas e as retiradas, e ganhe por unidade nas duas pontas."',
    'Silêncio na varanda.',
    '"Isso existe?"',
    '"Eu não sei. Eu sou conselheiro, não sou auditor."',
    '"Mas você desconfia."',
    '"Eu não assinei o relatório." Ele levanta e recolhe as xícaras. "Isso é o que um homem da minha idade faz quando desconfia."'
  ],
  ef:{flag:['sabe_das_solturas','desconfia_do_ciclo'],
      rep:{eixo:'bom',delta:2,motivo:'Entendeu que a entrada e a saída podem ser o mesmo negócio'},
      registrar:'A reserva recebe ~200 solturas por ano; as mesmas pessoas aprovam entrada e saída.',
      presagio:'Ganhar por unidade nas duas pontas. Repare que ninguém precisa ser cruel pra isso funcionar.'},
  escolhas:[
    {texto:'"Quem assina as duas coisas?"', vai:'c12_quem_assina'},
    {texto:'"Me dá o relatório."', vai:'c12_koga_relatorio'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_quem_assina:{
  texto:[
    '"Quem assina as duas coisas?"',
    'Koga para com as xícaras na mão.',
    '"A entrada, o diretor. A saída, o diretor."',
    '"E ele ganha por unidade?"',
    '"Não." Ele fala isso com firmeza. "O Quince ganha salário de servidor há trinta e um anos e mora numa casa de dois quartos a quatro quadras daqui, e eu conheço a casa porque eu já entreguei remédio lá quando a mulher dele estava doente."',
    'Ele leva as xícaras pra dentro e volta.',
    '"Quem ganha por unidade é o receptor credenciado."',
    '"E quem credencia o receptor?"',
    'Koga senta de novo.',
    '"O conselho."',
    'Pausa.',
    '"Nós. Sete pessoas. Eu, inclusive."',
    '"Você assinou o credenciamento?"',
    '"Eu assinei o credenciamento em noventa e sete, junto com os outros seis, numa reunião de quarenta minutos, com um parecer técnico de duas páginas que eu li."',
    '"E o nome da empresa?"',
    'Ele fecha os olhos.',
    '"Eu não lembro. E eu lembro de tudo."'
  ],
  ef:{flag:['koga_assinou_o_credenciamento','sabe_do_credenciamento'],
      npc:{nome:'Koga', opiniao:6, memoria:'Admitiu que assinou em 1997 o credenciamento do receptor e não lembra o nome da empresa.'},
      rep:{eixo:'bom',delta:3,motivo:'Chegou até a assinatura que começou tudo'},
      moral:-8,
      registrar:'O conselho credenciou o receptor em 1997. Koga assinou e não lembra o nome da empresa.',
      presagio:'Ele lembra de tudo e não lembra desse. Isso é o que o esquecimento útil faz.'},
  escolhas:[
    {texto:'"Procura o nome. Eu espero."', vai:'c12_procurou_o_nome'},
    {texto:'"Me dá o relatório inteiro."', vai:'c12_koga_relatorio'},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_procurou_o_nome:{
  texto:[
    'Ele procura por duas horas e vinte.',
    'Você fica sentad{o|a} na varanda, e a filha dele traz chá duas vezes e não pergunta nada, e a segunda vez ela senta do seu lado e fica.',
    'Às nove e quarenta da noite ele volta com uma folha xerocada e a mão um pouco trêmula, e é a única vez no capítulo em que Koga parece velho.',
    '**ATA DA 41ª REUNIÃO ORDINÁRIA — 14/08/1997 — ITEM 4: CREDENCIAMENTO DE RECEPTOR DE FAUNA EXCEDENTE**',
    '**DELIBERAÇÃO: APROVADO POR UNANIMIDADE**',
    '**RECEPTOR: ARMAZÉM GERAL 7 LTDA — CELADON — ALVARÁ MUNICIPAL 3.318**',
    'Você lê o número do alvará três vezes.',
    'Três mil trezentos e dezoito.',
    'É o número da placa de esmalte parafusada na parede de um galpão cinza com portão de enrolar azul, numa zona de serviço de Celadon, onde você contou quarenta e uma gaiolas.',
    d=>d.flags.sabe_do_deposito ? 'Você esteve lá. Você viu as plaquetas com número de processo. E o número de alvará que autoriza tudo aquilo foi assinado por sete pessoas numa reunião de quarenta minutos em Fuchsia, em noventa e sete.' :
       'Você não esteve lá ainda. Mas você vai.',
    'Koga olha a sua cara e entende antes de você falar.',
    '"Você conhece."',
    '"Eu conheço."'
  ],
  ef:{flag:['ligou_fuchsia_celadon','provas_zona'],
      itens:{'Ata da 41ª reunião':1},
      npc:{nome:'Koga', opiniao:10, memoria:'Achou a ata de 1997 e descobriu, com você, que credenciou o Armazém Geral 7 de Celadon.'},
      rep:{eixo:'bom',delta:6,motivo:'Ligou a reserva de Fuchsia ao armazém de Celadon com um número de alvará'},
      instabilidade:2, moral:-10,
      registrar:'O receptor credenciado da Zona Safári é o Armazém Geral 7 de Celadon, alvará 3.318.',
      presagio:'Alvará 3.318. A mesma placa de esmalte. O círculo fechou e ele tem três anos de idade.'},
  escolhas:[
    {texto:'"Então a gente descredencia."', vai:'c12_descredenciar'},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar a ata pra Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir falar com o diretor com a ata na mão.', vai:'c12_diretor'}
  ]
},

c12_descredenciar:{
  texto:[
    '"Então a gente descredencia."',
    '"Sim."',
    'Ele guarda a folha xerocada na pasta com barbante.',
    '"Descredenciamento é item de pauta de reunião extraordinária, que leva onze dias, e exige maioria simples: quatro dos sete."',
    '"E você tem quatro?"',
    '"Eu tenho um."',
    'Ele amarra o barbante.',
    '"Mas eu tenho onze dias e o telefone de seis pessoas que assinaram uma coisa sem ler, e nenhuma delas quer estar na ata que credenciou o galpão de Celadon quando isso virar assunto."',
    'Ele te olha.',
    '"Vergonha é o instrumento político mais subestimado de Kanto."'
  ],
  ef:{flag:['koga_descredencia','koga_aliado'],
      npc:{nome:'Koga', opiniao:10, memoria:'Vai pautar o descredenciamento do Armazém Geral 7 em reunião extraordinária.'},
      rep:{eixo:'bom',delta:5,motivo:'O caminho lento virou um plano com data'},
      moral:12,
      registrar:'Koga vai pautar o descredenciamento do Armazém Geral 7. Prazo: onze dias.',
      presagio:'"Vergonha é o instrumento político mais subestimado de Kanto." Ele está certo.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Desafiar o ginásio.', vai:'c12_desafio_koga'}
  ]
},

c12_koga_relatorio:{
  texto:[
    'Ele te dá o relatório inteiro: setenta e duas páginas, com anexo técnico, mapa por setor e a tabela de censo dos últimos seis anos.',
    '"Isso é cópia minha. Eu tenho direito a uma e eu peço todo ano."',
    'Ele amarra a pasta com barbante antes de entregar, e o barbante é a coisa que te desmonta: ele amarra porque é assim que ele guarda, e agora essa coisa é sua.',
    '"Uma advertência." Ele segura a pasta mais um segundo. "Isso não prova crime nenhum."',
    '"Prova o quê, então?"',
    '"Prova que a conta está errada. Crime é uma pessoa fazer de propósito. Conta errada é uma instituição fazendo de bom grado."',
    'Ele solta a pasta.',
    '"A segunda mata mais e ninguém vai preso. Boa noite."'
  ],
  ef:{flag:['tem_o_relatorio','provas_zona'],
      itens:{'Relatório de manejo (cópia do Koga)':1},
      npc:{nome:'Koga', opiniao:6, memoria:'Te entregou a cópia pessoal dele do relatório de manejo, amarrada com barbante.'},
      rep:{eixo:'bom',delta:4,motivo:'Saiu com setenta e duas páginas que provam o erro'},
      registrar:'Recebeu de Koga a cópia do relatório de manejo com anexo técnico e censos.',
      presagio:'"Conta errada é uma instituição fazendo de bom grado." Essa é a tese do capítulo.'},
  escolhas:[
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_desafio_koga:{
  texto:[
    '"Me deixa desafiar o ginásio."',
    'Ele olha o relógio de parede, que marca dez da noite de uma terça.',
    '"Quarta e sexta, das duas às dezoito."',
    '"Eu posso não estar aqui na quarta."',
    '"Então você não desafia."',
    'Ele diz isso sem nenhuma dureza, e depois faz uma coisa inesperada: sorri.',
    '"Horário existe pra que as pessoas possam contar com ele. Um ginásio que abre quando dá é um ginásio que ninguém pode planejar visitar, e aí só desafia quem mora perto."',
    '"Isso é sobre a reserva também?"',
    '"Tudo aqui é sobre a reserva." Ele se levanta. "Quarta, duas da tarde. Se você estiver viv{o|a} e na cidade, eu luto com você e eu não vou pegar leve."'
  ],
  ef:{flag:'koga_marcou',
      npc:{nome:'Koga', opiniao:4, memoria:'Recusou lutar fora do horário e te marcou para quarta às 14h.'},
      registrar:'Koga luta quarta, 14h. Sem exceção.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'}
  ]
},

/* ─────────────── O PASSEIO, A VETERINÁRIA E O DIRETOR ─────────────── */

c12_passeio:{
  texto:[
    'O guia tem vinte e dois anos, uniforme cáqui com o nome bordado — ORIN — e um texto decorado que ele recita há quatro meses e que ainda não ficou automático, porque ele ainda olha pra ver se as pessoas estão gostando.',
    'O grupo tem onze pessoas: um casal de idosos, uma família com duas crianças, três adolescentes e você.',
    'O passeio é honesto e bonito, e essa é a parte que complica tudo.',
    'Você vê Nidorino em bando, na borda de um capinzal, a uns quarenta metros. Vê um Kangaskhan com filhote, e o Orin faz todo mundo parar e falar baixo, e a criança de seis anos chora de emoção e o pai fica com vergonha e o Orin diz "pode chorar, eu chorei na primeira vez".',
    'Vê Scyther a distância segura, dois, num tronco caído.',
    'E o folheto plastificado é bom: tem nome científico, tem o que a espécie come, tem em que setor costuma estar.',
    'Alguém fez isso com cuidado.',
    'Na volta, o grupo passa por uma trilha lateral que o Orin contorna sem comentar — ele nem desacelera, ele só faz a curva um pouco mais aberta.',
    'Na trilha lateral, no chão, tem trilho.',
    'Trilho de carrinho de carga, de bitola estreita, novo, com a superfície polida de uso, indo na direção oposta à saída.'
  ],
  ef:{flag:['viu_o_trilho','fez_o_passeio'],
      registrar:'No passeio guiado há uma trilha lateral com trilho de carga novo, que o guia contorna.',
      presagio:'Trilho polido de uso. Não é obra: é rotina.'},
  escolhas:[
    {texto:'Perguntar ao guia sobre o trilho, na frente do grupo.', vai:'c12_guia_perguntado'},
    {texto:'Perguntar em particular, no fim do passeio.', vai:'c12_nico'},
    {texto:'Ficar para trás e seguir o trilho agora.', vai:'c12_ficou_pra_tras'},
    {texto:'Não perguntar nada e voltar à noite.', vai:'c12_noite_zona'}
  ]
},

c12_ficou_pra_tras:{
  falante:'Guia Orin',
  vozes:['N','N'],
  texto:[
    'Você fica pra trás na curva e deixa o grupo seguir, e ninguém conta cabeça num passeio de onze pessoas até o fim.',
    'Você anda o trilho por setecentos metros.',
    'E aí o trilho passa por baixo de um portão de tela com placa de **ÁREA TÉCNICA — ACESSO RESTRITO**, e do outro lado do portão tem uma clareira, e na clareira tem estrutura de tubo galvanizado.',
    'Você não chega a ver o que tem dentro da estrutura porque uma mão fecha no seu ombro por trás.',
    'É o Orin.',
    'Ele está branco e está ofegante de ter corrido setecentos metros, e a primeira coisa que ele faz não é te repreender.',
    'É te puxar pra trás de uma moita.',
    '"Fica quiet{o|a}", ele sussurra. "Tem plantão."'
  ],
  ef:{flag:['quase_viu_o_setor7','nico_te_salvou'],
      npc:{nome:'Guia Orin', opiniao:3, memoria:'Correu setecentos metros para te puxar de trás de uma moita antes do plantão te ver.'},
      registrar:'O guia Orin te impediu de ser visto pelo plantão do setor 7.',
      presagio:'Ele correu. Ele não gritou, não chamou ninguém, não te entregou. Ele correu.'},
  escolhas:[
    {texto:'"O que tem ali?"', vai:'c12_nico'},
    {texto:'Ir embora com ele e conversar fora.', vai:'c12_nico'},
    {texto:'Ignorar e continuar.', vai:'c12_setor7'},
    {texto:'Voltar e vir à noite.', vai:'c12_noite_zona'}
  ]
},

c12_guia_perguntado:{
  falante:'Guia Orin',
  vozes:['P','N','N','N','N'],
  texto:[
    '"Pra onde vai esse trilho?"',
    'Ele congela por um segundo e meio. Os outros dez turistas não percebem porque estão tirando foto de um Doduo.',
    '"Manutenção", ele diz, e o texto volta a ser recitado. "Área técnica."',
    'E ele emenda direto na próxima parte do roteiro, e aponta pro Doduo, e fala do hábito alimentar do Doduo com muito mais entusiasmo do que ele tinha falado dos outros.',
    'No fim do passeio, quando o grupo já está indo pra van, ele te segura pelo braço.',
    'Ele continua sorrindo, porque tem turista olhando, e fala olhando pra frente:',
    '"Não volta aqui de noite."',
    '"Sério. Eu sou de Fuchsia, meu pai trabalhou aqui trinta anos, meu avô trabalhou aqui."',
    '"Não volta."',
    'Ele solta o seu braço e vai embora quase correndo, e acena pro casal de idosos, e o casal acena de volta.'
  ],
  ef:{npc:{nome:'Guia Orin', opiniao:1, memoria:'Te avisou, apavorado e sorrindo, para não voltar à Zona à noite.'},
      flag:'aviso_do_guia',
      presagio:'Ele sorriu o tempo inteiro. Todo mundo aqui sorri o tempo inteiro.'},
  escolhas:[
    {texto:'Procurar o Orin depois do expediente.', vai:'c12_nico'},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Voltar à noite.', vai:'c12_noite_zona'}
  ]
},

c12_nico:{
  falante:'Guia Orin',
  vozes:['N','N','N','P','N','N','N'],
  texto:[
    'Você espera o Orin na saída dos funcionários, às dezoito e quarenta.',
    'Ele te vê e quase volta pra dentro, e não volta porque a porta já fechou atrás dele e reabrir daria mais na vista.',
    'Vocês conversam encostados num muro, no escuro, do lado de um contêiner de lixo, e ele fala muito rápido e muito baixo.',
    '"Setor 7 é fechado há dois anos por “recuperação ambiental”. Ninguém recupera nada lá."',
    '"Entra carrinho vazio e sai carrinho cheio. Eu levo turista trezentos metros dali quatro vezes por dia."',
    '"Eu contei pro diretor. Em março. Eu marquei hora, eu fui de camisa, eu ensaiei."',
    '"E?"',
    '"E ele me ouviu inteiro, anotou, agradeceu, e disse que ia apurar."',
    'Ele passa a mão no rosto.',
    '"Isso foi em março, cara. Isso foi em março e eu ainda tô levando turista trezentos metros dali."',
    '"Eu tenho esse emprego e mais nada. Eu tenho isso e mais nada, e meu pai tá com problema de coluna, e a gente mora nos fundos da casa da minha tia."'
  ],
  ef:{flag:['sabe_do_setor7','nico_falou'],
      npc:{nome:'Guia Orin', opiniao:4, memoria:'Te contou tudo sobre o setor 7 encostado num muro, no escuro, ao lado de um contêiner de lixo.'},
      moral:-5,
      registrar:'Orin denunciou o setor 7 ao diretor em março e nada aconteceu.',
      presagio:'Ele marcou hora, foi de camisa e ensaiou. Guarde os três detalhes.'},
  escolhas:[
    {texto:'"Eu não vou falar seu nome pra ninguém."', vai:'c12_protegeu_nico'},
    {texto:'"Você vai comigo hoje à noite."', vai:'c12_nico_vai'},
    {texto:'"Então você é cúmplice."', vai:'c12_nico_acusado'},
    {texto:'"Me desenha o mapa e fica em casa."', vai:'c12_mapa_do_nico'}
  ]
},

c12_protegeu_nico:{
  falante:'Guia Orin',
  vozes:['P','N','P','N','N','N','N','N'],
  texto:[
    '"Eu não vou falar seu nome pra ninguém."',
    'Ele para de falar rápido pela primeira vez.',
    '"Por quê?"',
    '"Porque você tem esse emprego e mais nada."',
    'Ele olha o contêiner de lixo por um tempo.',
    '"Todo mundo que aparece aqui quer que eu seja testemunha." Ele fala mais devagar agora. "Ninguém nunca falou isso."',
    'Ele tira uma chave do bolso — uma chave só, numa argolinha, sem chaveiro — e põe na sua mão.',
    '"Portão de serviço da trilha três. Não é o do asfalto, é o de pedestre, que fica na curva depois do bebedouro."',
    '"Devolve amanhã na recepção, no balcão, dentro de um envelope, sem falar comigo."',
    'Ele já está andando.',
    '"E se te pegarem com ela, essa chave você achou no chão."'
  ],
  ef:{flag:['protegeu_nico','tem_a_chave_do_nico'],
      itens:{'Chave do portão de pedestre':1},
      npc:{nome:'Guia Orin', opiniao:7, memoria:'Te deu a chave do portão de pedestre depois que você prometeu não usar o nome dele.'},
      rep:{eixo:'bom',delta:3,motivo:'Protegeu a fonte antes de usar a fonte'},
      registrar:'Orin te deu a chave do portão de pedestre da trilha três.',
      presagio:'"Essa chave você achou no chão." Ele pensou nisso antes de oferecer.'},
  escolhas:[
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia antes.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor antes.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'}
  ]
},

c12_mapa_do_nico:{
  texto:[
    '"Me desenha o mapa e fica em casa."',
    'Ele pisca.',
    '"Como assim fica em casa?"',
    '"Você não precisa ir. Você precisa que alguém vá."',
    'Ele encosta na parede e respira fundo e faz uma coisa que você não esperava: ele senta no chão, no meio-fio, do lado do contêiner.',
    '"Eu ensaiei quatro meses pra falar com o diretor."',
    '"Eu sei."',
    '"E eu tô ensaiando desde março pra ir lá sozinho, e eu sei que eu não vou, e eu sei que eu não vou porque eu já sei que eu não vou."',
    'Ele pega o folheto plastificado do bolso, vira do lado branco, e desenha.',
    'Desenha bem: ele conhece cada curva, cada bebedouro, cada mourão de cerca, e marca os três pontos de plantão com X e a hora da ronda ao lado de cada um.',
    'Quando termina, ele entrega e não solta na hora.',
    '"Se der errado, eu vou dizer que não te conheço."',
    '"Diz mesmo."'
  ],
  ef:{flag:['tem_o_mapa_do_nico','protegeu_nico'],
      itens:{'Mapa do Orin (no verso do folheto)':1},
      npc:{nome:'Guia Orin', opiniao:6, memoria:'Desenhou o mapa do setor 7 no verso de um folheto e ficou em casa, com a sua permissão.'},
      rep:{eixo:'bom',delta:3,motivo:'Deixou alguém ajudar sem se destruir'},
      moral:8,
      registrar:'Orin desenhou o mapa do setor 7 com os três pontos de plantão e os horários de ronda.',
      presagio:'"Eu já sei que eu não vou." É a frase mais honesta que alguém te disse em Fuchsia.'},
  escolhas:[
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'}
  ]
},

c12_nico_vai:{
  texto:[
    '"Você vai comigo hoje à noite."',
    'Ele diz não quatro vezes.',
    'Na primeira, alto. Na segunda, explicando o emprego. Na terceira, explicando o pai e a coluna. Na quarta, já baixinho, olhando pro chão.',
    'E vai.',
    'É isso que acontece quando alguém quer muito que alguém insista, e passou quatro meses esperando que alguém insistisse.',
    'Ele passa em casa, troca o uniforme cáqui por uma camisa escura, e volta em onze minutos com uma lanterna e duas garrafas de água, porque ele é guia e guia sempre leva água.'
  ],
  ef:{flag:['nico_junto'],
      itens:{'Garrafa de água':1},
      npc:{nome:'Guia Orin', opiniao:6, memoria:'Foi com você ao setor 7, de noite, depois de dizer não quatro vezes.'},
      rep:{eixo:'bom',delta:1,motivo:'Convenceu alguém a fazer o que ele queria fazer'},
      presagio:'Ele levou água pra dois. Guia sempre leva água.'},
  escolhas:[{texto:'Ir à noite.', vai:'c12_noite_zona'}]
},

c12_nico_acusado:{
  texto:[
    '"Então você é cúmplice."',
    'Ele recebe a frase como um soco, no lugar exato onde ela foi mirada.',
    '"Sou."',
    'Ele nem se defende.',
    '"Sou mesmo. Eu levo onze pessoas por vez a trezentos metros daquilo e eu falo do hábito alimentar do Doduo."',
    'Ele vai embora sem dizer mais nada, sem correr, sem olhar pra trás.',
    'Você nunca mais fala com ele nesta história.',
    'Três meses depois, você lê num jornal de Fuchsia — quatro parágrafos, página seis — que um guia da Zona Safári prestou depoimento numa audiência pública sobre o manejo da reserva.',
    'Não diz o nome.',
    'E você nunca vai saber se foi por causa do que você disse ou apesar dele.'
  ],
  ef:{npc:{nome:'Guia Orin', opiniao:-2, memoria:'Você o chamou de cúmplice. Ele concordou e sumiu. Depois depôs numa audiência.'},
      flag:'afastou_nico', moral:-8,
      registrar:'Chamou o Orin de cúmplice. Ele concordou.',
      presagio:'Você nunca vai saber se foi por causa ou apesar. Quase nunca se sabe.'},
  escolhas:[
    {texto:'Ir sozinh{o|a} à noite.', vai:'c12_noite_zona'},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Ir atrás dele e pedir desculpa.', vai:'c12_pediu_desculpa_nico'}
  ]
},

c12_pediu_desculpa_nico:{
  texto:[
    'Você anda Fuchsia inteira à noite procurando e acha ele nos fundos da casa da tia, sentado num degrau, sem lanterna, no escuro.',
    '"Desculpa."',
    'Ele não olha pra cima.',
    '"Você tava cert{o|a}."',
    '"Eu tava cert{o|a} e eu não devia ter falado."',
    'Ele ri sem nenhum humor.',
    '"Essas duas coisas juntas são a coisa mais adulta que alguém me falou esse ano, e você tem quinze anos, e isso me deixa muito mal."',
    'Ele dá um espaço no degrau com o quadril e você senta.',
    'Ficam ali um tempo.',
    'Depois ele entra em casa e volta com o folheto plastificado e uma caneta, e desenha o mapa, e não fala mais nada enquanto desenha.'
  ],
  ef:{flag:['tem_o_mapa_do_nico'], limpaFlag:'afastou_nico',
      itens:{'Mapa do Orin (no verso do folheto)':1},
      npc:{nome:'Guia Orin', opiniao:5, memoria:'Você voltou para pedir desculpa. Ele te deu o mapa em silêncio, sentado num degrau.'},
      rep:{eixo:'bom',delta:3,motivo:'Voltou para pedir desculpa'},
      moral:10,
      registrar:'Pediu desculpa ao Orin e recebeu o mapa.',
      presagio:'"Essas duas coisas juntas." Ele reparou que você não usou o certo como desculpa.'},
  escolhas:[
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar.', vai:'c12_bar'}
  ]
},

c12_yara:{
  texto:[
    'A casa da rua da escola tem um portão baixo, um Growlithe velho dormindo no sol e uma van branca com o adesivo **MED. VET. — ATEND. FAUNA** na porta.',
    'A Dra. Pia tem uns quarenta e cinco anos e atende no quintal, porque o consultório dela é o quintal.',
    'Ela está fazendo curativo num Pidgey de asa quebrada quando você chega, e não para de fazer pra conversar.',
    '"Eu atendo a reserva por contrato. Doze horas por semana, terça inteira e quinta de manhã."',
    '"O que você faz nas terças?"',
    'E ela responde na hora, sem hesitar, porque pra ela não é segredo:',
    '"Marcação e triagem."',
    '"Marcação?"',
    '"Brinco. Brinco auricular numerado, de plástico, amarelo." Ela mostra um, no bolso do avental, porque ela anda com eles. "Todo animal que entra no setor de triagem recebe um número antes de sair."',
    'Ela termina o curativo.',
    '"Eu marco entre cinquenta e oitenta por terça."'
  ],
  ef:{flag:['conheceu_yara','sabe_do_brinco'],
      npc:{nome:'Dra. Pia', opiniao:1, memoria:'Veterinária contratada da reserva; marca de 50 a 80 animais por terça-feira.'},
      registrar:'A Dra. Pia faz marcação e triagem no setor 7 todas as terças: 50 a 80 por dia.',
      presagio:'Ela anda com brinco no bolso do avental. Isso é rotina, não crime.'},
  escolhas:[
    {texto:'"Oitenta por terça dá quatro mil por ano."', vai:'c12_a_conta_da_yara'},
    {texto:'"O que é triagem?"', vai:'c12_triagem'},
    {texto:'"Você sabe pra onde eles vão?"', vai:'c12_yara_pra_onde'},
    {texto:'"Me deixa ir com você na terça."', vai:'c12_yara_leva'}
  ]
},

c12_a_conta_da_yara:{
  texto:[
    '"Oitenta por terça dá quatro mil por ano."',
    'Ela para com o Pidgey na mão.',
    '"Não dá não."',
    '"Cinquenta e duas terças. Oitenta. Quatro mil cento e sessenta."',
    'Ela olha pro lado.',
    '"O relatório fala em duzentos e quarenta."',
    'Você não diz nada, porque não precisa.',
    'Ela põe o Pidgey na caixa de transporte com muito cuidado e fecha a portinha e fica com a mão na portinha.',
    '"Duzentos e quarenta é o número de retirada aprovada."',
    '"E os outros três mil e novecentos?"',
    '"Os outros três mil e novecentos são “manejo sanitário”, que é outra rubrica, que não vai a conselho, que é decisão técnica, e a decisão técnica é minha."',
    'Ela tira a mão da portinha.',
    '"Eu assino um formulário por lote. Eu assino uns oito por terça."',
    '"E o formulário diz o quê?"',
    '"Diz “apto para transporte”."'
  ],
  ef:{flag:['sabe_dos_quatro_mil','sabe_do_apto'],
      npc:{nome:'Dra. Pia', opiniao:3, memoria:'Fez com você a conta de quatro mil por ano e percebeu o que ela assina.'},
      rep:{eixo:'bom',delta:5,motivo:'Fez uma conta de multiplicação que desmontou um sistema inteiro'},
      instabilidade:2, moral:-12,
      registrar:'A retirada real da Zona Safári é ~4.160/ano; só 240 passam pelo conselho. O resto é "manejo sanitário".',
      presagio:'Duzentos e quarenta é o que se discute. Quatro mil é o que acontece.'},
  escolhas:[
    {texto:'"Para de assinar."', vai:'c12_yara_para'},
    {texto:'"Me dá os formulários."', vai:'c12_formularios'},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva'},
    {texto:'"Você sabe pra onde eles vão?"', vai:'c12_yara_pra_onde'}
  ]
},

c12_triagem:{
  falante:'Dra. Pia',
  vozes:['P','N','N','P','N','P','N','P','P','N','P','N','P','N'],
  texto:[
    '"O que é triagem?"',
    '"Separar por destino."',
    'Ela lava as mãos numa torneira de quintal enquanto explica, e a naturalidade é a parte difícil.',
    '"Categoria A: saudável, idade reprodutiva, espécie com demanda. Categoria B: saudável, fora do perfil. Categoria C: com problema clínico."',
    d=>{
      const p = d.time[0];
      if (!p) return '';
      const n = nomeExib(p), g = pron(p);
      if (!generoDe(p)) return `Você olha ${g.pro} ${n} sem querer. Sem sexo, sem idade reprodutiva: pela ficha que ela recebeu, categoria B. É a primeira vez que uma coisa dessas te alivia.`;
      return `Você olha ${g.pro} ${n} sem querer, e faz a conta sem querer: saudável, ${g.f ? 'fêmea' : 'macho'}, na idade. Pela ficha que ela recebeu, categoria A.`;
    },
    '"E cada categoria vai pra onde?"',
    '"A, para receptor credenciado. B, para soltura em área externa. C, para tratamento."',
    '"E quantos por cento são A?"',
    'Ela fecha a torneira.',
    '"Uns noventa."',
    '"Noventa por cento dos animais de uma reserva são saudáveis, em idade reprodutiva e de espécie com demanda?"',
    'Ela seca as mãos no avental por muito mais tempo do que uma mão leva pra secar.',
    '"A triagem é feita por quem?", você pergunta.',
    '"Por mim."',
    '"Com que critério?"',
    '"Com o critério que está na ficha técnica que eu recebi quando entrei."',
    'Pausa.',
    '"E a ficha técnica veio de quem?"',
    'Ela para de secar as mãos.',
    '"Do receptor."'
  ],
  ef:{flag:['sabe_da_triagem','ficha_do_receptor'],
      npc:{nome:'Dra. Pia', opiniao:4, memoria:'Percebeu, respondendo a você, que o critério de triagem dela foi escrito pelo próprio comprador.'},
      rep:{eixo:'bom',delta:5,motivo:'Perguntou de onde vinha o critério'},
      moral:-15, instabilidade:1,
      registrar:'O critério de triagem da reserva foi escrito pelo próprio receptor credenciado. 90% caem na categoria A.',
      presagio:'O comprador escreveu a régua. Ninguém precisou subornar ninguém.'},
  escolhas:[
    {texto:'"Me dá essa ficha técnica."', vai:'c12_ficha_tecnica'},
    {texto:'"Para de assinar."', vai:'c12_yara_para'},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva'},
    {texto:'"Oitenta por terça dá quatro mil por ano."', vai:'c12_a_conta_da_yara'}
  ]
},

c12_ficha_tecnica:{
  texto:[
    'Ela entra em casa e volta com uma pasta plástica de quatro furos.',
    'A ficha técnica tem seis páginas, é datilografada, tem timbre, e o timbre é de uma empresa.',
    'Você vira pra última página e lá está o rodapé, em corpo oito:',
    '**Elaborado por: Departamento Técnico — Armazém Geral 7 Ltda. — Celadon**',
    d=>d.flags.ligou_fuchsia_celadon ? 'O mesmo alvará. A mesma empresa que sete conselheiros credenciaram em quarenta minutos em noventa e sete.' :
       d.flags.sabe_do_deposito ? 'Você conhece esse nome. Você esteve naquele galpão. Você contou quarenta e uma gaiolas lá dentro.' :
       'Um armazém em Celadon escreveu o manual médico de uma reserva federal em Fuchsia.',
    'A Dra. Pia olha o rodapé com você, e ela já leu essa página, e ela nunca leu essa página.',
    '"Oito anos", ela diz. "Eu uso essa ficha há oito anos."'
  ],
  ef:{flag:['tem_a_ficha_tecnica','provas_zona','sabe_do_deposito'],
      itens:{'Ficha técnica de triagem':1},
      npc:{nome:'Dra. Pia', opiniao:6, memoria:'Te entregou a ficha técnica e viu, com você, de quem era o timbre.'},
      rep:{eixo:'bom',delta:5,motivo:'Achou o documento que liga o comprador ao critério'},
      moral:-10,
      registrar:'A ficha técnica de triagem da reserva foi elaborada pelo Armazém Geral 7 Ltda., de Celadon.',
      presagio:'Oito anos usando uma régua que o comprador fez. E ela é boa no que faz.'},
  escolhas:[
    {texto:'"Para de assinar."', vai:'c12_yara_para'},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva'},
    {texto:'Levar isso pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'}
  ]
},

c12_yara_pra_onde:{
  texto:[
    '"Você sabe pra onde eles vão?"',
    '"Receptor credenciado."',
    '"Isso é um endereço?"',
    'Ela abre a boca e fecha.',
    '"Isso é um campo de formulário."',
    'E aí ela faz a coisa que faz dela uma boa veterinária e uma pessoa que dormiu mal por oito anos:',
    'ela vai buscar os formulários.',
    'Volta com uma caixa de papelão e senta no chão do quintal com você e abre.',
    'Centenas de vias amarelas, em ordem, presas com clipe por mês.',
    'Todas com o campo DESTINO preenchido com a mesma frase carimbada: **RECEPTOR CREDENCIADO — CONF. ATA 41/1997**.',
    'Nenhuma com endereço. Nenhuma com nome. Nenhuma com CNPJ.',
    'Oito anos de via amarela apontando pra uma ata que ela nunca leu.'
  ],
  ef:{flag:['viu_as_vias','sabe_da_ata_41'],
      npc:{nome:'Dra. Pia', opiniao:5, memoria:'Sentou no chão do quintal com você e abriu oito anos de vias amarelas.'},
      rep:{eixo:'bom',delta:4,motivo:'Fez a pergunta "isso é um endereço?"'},
      instabilidade:1,
      registrar:'Oito anos de formulários de destino apontam apenas para "conf. ata 41/1997".',
      presagio:'Tudo aponta pra uma ata. Alguém precisa ler a ata.'},
  escolhas:[
    {texto:'"Me dá um maço dessas vias."', vai:'c12_formularios'},
    {texto:'"Vamos ler a ata 41."', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'"Para de assinar."', vai:'c12_yara_para'},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva'}
  ]
},

c12_formularios:{
  texto:[
    'Ela te dá um maço de cento e doze vias amarelas, presas com clipe, de janeiro até hoje.',
    'E te dá de um jeito que você não esquece: ela conta uma por uma antes de entregar, em voz alta, e no meio da contagem a voz falha e ela continua contando.',
    'Cento e doze.',
    '"Isso é cópia minha. Eu tenho direito."',
    'Ela põe o elástico.',
    '"E se alguém te perguntar quem te deu, você fala que fui eu."',
    '"Não precisa."',
    '"Precisa." Ela entrega. "Porque se eu não falar isso agora, eu vou passar os próximos meses torcendo pra ninguém perguntar, e eu já passei oito anos torcendo pra ninguém perguntar."'
  ],
  ef:{flag:['tem_as_vias','provas_zona','yara_aliada'],
      itens:{'112 vias amarelas de triagem':1},
      npc:{nome:'Dra. Pia', opiniao:9, memoria:'Te deu cento e doze vias amarelas e autorizou você a dar o nome dela.'},
      rep:{eixo:'bom',delta:5,motivo:'Recebeu uma prova com o nome de quem deu, autorizado'},
      moral:12,
      registrar:'Recebeu 112 vias amarelas de triagem da Dra. Pia, com autorização de citar o nome dela.',
      presagio:'Ela contou uma por uma em voz alta. Cada uma é um bicho.'},
  escolhas:[
    {texto:'Levar pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva'}
  ]
},

c12_yara_para:{
  texto:[
    '"Para de assinar."',
    '"Se eu parar de assinar, eles contratam outro veterinário."',
    '"Provavelmente."',
    '"E o outro não vai fazer curativo em Pidgey de graça no quintal."',
    '"Provavelmente não."',
    'Ela sorri sem nenhuma alegria.',
    '"Você não tá me convencendo muito bem."',
    '"Eu não tô tentando te convencer. Você perguntou o que acontece e eu respondi."',
    'Ela olha a caixa de transporte com o Pidgey.',
    '"Eu vou assinar terça."',
    'Pausa.',
    '"E eu vou escrever no campo de observação de cada um, com a minha letra, que o critério de triagem aplicado é de elaboração do receptor."',
    '"Isso muda alguma coisa?"',
    '"Isso não muda nada e fica registrado em cento e poucos documentos que passam por três setores."',
    'Ela olha pra você.',
    '"Você tem quinze anos e eu tenho quarenta e cinco, e a gente acabou de descobrir junto que a minha arma é o campo de observação."'
  ],
  ef:{flag:['yara_vai_registrar','yara_aliada'],
      npc:{nome:'Dra. Pia', opiniao:8, memoria:'Vai escrever no campo de observação de cada formulário que o critério é do receptor.'},
      rep:{eixo:'bom',delta:5,motivo:'Não pediu heroísmo — deixou alguém achar a própria arma'},
      moral:12,
      registrar:'A Dra. Pia vai registrar no campo de observação a origem do critério de triagem.',
      presagio:'O campo de observação. Não é pouco: passa por três setores.'},
  escolhas:[
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva'},
    {texto:'"Me dá um maço das vias."', vai:'c12_formularios'},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia}
  ]
},

c12_yara_leva:{
  texto:[
    '"Me leva lá na terça."',
    'Ela pensa.',
    '"Eu levo auxiliar. Eu tenho direito a um auxiliar e eu nunca uso porque ninguém aguenta."',
    '"Eu aguento."',
    '"Você não sabe o que é."',
    '"Eu aguento."',
    'Ela te olha de cima a baixo.',
    '"Terça, seis e meia da manhã, aqui na porta. Camisa de manga comprida, bota fechada, e não come nada antes."',
    '"Por quê?"',
    '"Você vai entender às nove da manhã."'
  ],
  ef:{flag:['vai_com_a_yara','sabe_do_setor7'],
      npc:{nome:'Dra. Pia', opiniao:6, memoria:'Te credenciou como auxiliar dela para a terça no setor 7.'},
      rep:{eixo:'bom',delta:3,motivo:'Vai entrar pela porta da frente, de dia, com crachá'},
      registrar:'Vai entrar no setor 7 como auxiliar da veterinária, terça às 6h30.',
      presagio:'"Você vai entender às nove da manhã." Ela não estava sendo dramática.'},
  escolhas:[
    {texto:'Ir na terça, como auxiliar.', vai:'c12_terca'},
    {texto:'Ir hoje à noite, antes da terça.', vai:'c12_noite_zona'},
    {texto:'Falar com o diretor antes.', vai:'c12_diretor'},
    {texto:'Falar com o Koga antes.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia}
  ]
},

c12_terca:{
  texto:[
    'Terça, seis e meia. Você entra pela portaria, de van, com crachá de AUXILIAR TÉCNICO preso na camisa, e o porteiro levanta a cancela sem olhar duas vezes.',
    'É assim que se entra num lugar: com crachá, de manhã, de van.',
    'O setor 7 de dia é pior do que de noite, e você vai levar anos pra explicar por quê.',
    'De noite seria clandestino. De dia é um expediente.',
    'Tem café numa garrafa térmica em cima de uma caixa. Tem rádio tocando baixinho numa estação de Fuchsia. Tem dois rapazes de luva conversando sobre o final de semana enquanto passam animal do corredor de contenção pra baia de triagem.',
    'Tem uma balança. Tem uma prancheta. Tem uma caixa de brincos amarelos numerados.',
    'E tem fila.',
    'A Dra. Pia calça a luva, liga a lanterna de cabeça, e olha pra você.',
    '"Você segura, eu marco. Se você quiser sair a qualquer momento, você sai e ninguém comenta."',
    'São seis e quarenta e dois da manhã.'
  ],
  ef:{flag:['entrou_no_setor7_de_dia','viu_o_curral'],
      registrar:'Entrou no setor 7 de dia, como auxiliar da veterinária, com crachá.',
      presagio:'De dia é um expediente. Guarde a frase, é a tese do capítulo inteiro.'},
  escolhas:[
    {texto:'Segurar. Ficar o dia inteiro.', vai:'c12_o_dia_inteiro'},
    {texto:'Ficar até as nove e ver o que ela disse.', vai:'c12_nove_da_manha'},
    {texto:'Sair agora, antes de começar.', vai:'c12_saiu_da_terca'},
    {texto:'Fotografar tudo escondid{o|a}.', vai:'c12_fotografou_zona', cond:d=>Estado.contaItem('Câmera descartável')>0}
  ]
},

c12_nove_da_manha:{
  texto:[
    'Às nove da manhã você entende.',
    'Não tem crueldade. Isso é o que ninguém te prepara pra ver.',
    'Os dois rapazes de luva são cuidadosos. Um deles conversa com os bichos — não baixinho, normal, do jeito que se conversa com bicho de estimação. A Dra. Pia é rápida e boa e o brinco leva menos de um segundo e o animal reage mais ao susto do que à dor.',
    'Ninguém grita com ninguém. Ninguém chuta nada.',
    'E às nove da manhã chega o lote da baia 3, e a baia 3 é a baia dos filhotes, e a triagem de filhote é por peso, porque filhote abaixo de um peso não é “apto para transporte”.',
    'E aí você vê o que acontece com os que não são aptos.',
    'Eles voltam pra reserva. Eles são soltos.',
    'Sozinhos.',
    'Porque a mãe foi triada como categoria A às sete e quarenta.',
    'Você pergunta e a Dra. Pia responde sem parar de trabalhar, porque se ela parar ela não recomeça:',
    '"A ficha técnica não tem campo de vínculo."'
  ],
  ef:{flag:['viu_a_baia_tres','entendeu_o_horror'],
      moral:-25, instabilidade:2, hp:-3, causa:'Uma manhã na baia 3',
      rep:{eixo:'bom',delta:3,motivo:'Ficou até as nove da manhã'},
      registrar:'Filhotes fora do peso voltam sozinhos para a reserva. A ficha técnica não tem campo de vínculo.',
      presagio:'Não tem campo de vínculo. Um formulário decidiu isso, e ninguém decidiu o formulário.'},
  escolhas:[
    {texto:'Ficar o dia inteiro.', vai:'c12_o_dia_inteiro'},
    {texto:'Parar tudo agora, na frente de todo mundo.', vai:'c12_parou_a_triagem'},
    {texto:'Sair e voltar à noite para abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Fotografar a baia 3.', vai:'c12_fotografou_zona', cond:d=>Estado.contaItem('Câmera descartável')>0}
  ]
},

c12_o_dia_inteiro:{
  texto:[
    'Você fica o dia inteiro.',
    'Doze horas. Setenta e um animais marcados. Oito formulários assinados.',
    'Na metade da tarde você já está fazendo direito: você aprendeu a segurar sem apertar, a virar a orelha sem torcer, a falar baixo do jeito que ajuda.',
    'Você fica bom nisso.',
    'Essa é a parte que vai te acordar de noite nos próximos capítulos: você ficou bom nisso em seis horas.',
    'Às dezoito e quarenta a Dra. Pia tira a luva, senta no chão encostada na balança, e não fala nada por cinco minutos.',
    'Depois ela fala uma coisa só:',
    '"Todo mundo que entra aqui aguenta. Esse é o problema. Eu esperei oito anos por alguém que não aguentasse."',
    d=>d.flags.tem_as_vias ? 'E ela escreveu, nos setenta e um formulários do dia, com a letra dela, que o critério aplicado é de elaboração do receptor.' : ''
  ],
  ef:{flag:['ficou_o_dia_inteiro','ficou_bom_nisso'],
      moral:-20, hp:-5, causa:'Doze horas no setor 7',
      rep:{eixo:'bom',delta:4,motivo:'Ficou as doze horas e não desviou o olho'},
      npc:{nome:'Dra. Pia', opiniao:8, memoria:'Passou doze horas com você no setor 7 e te disse que todo mundo aguenta.'},
      registrar:'Ficou as doze horas do turno de triagem. Setenta e um marcados.',
      presagio:'Você ficou bom nisso em seis horas. Anota isso sobre pessoas, não sobre você.'},
  escolhas:[
    {texto:'Voltar à noite e abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir falar com o diretor agora, com o dia inteiro na cabeça.', vai:'c12_diretor'},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c12_parou_a_triagem:{
  falante:'Peão do setor 7',
  vozes:['P','N','N','N'],
  texto:[
    'Você para.',
    'Larga o animal com cuidado na baia — você tem esse cuidado, mesmo agora — e fica de pé no meio do setor 7 e fala alto o suficiente pros cinco ouvirem.',
    '"A mãe desse aqui saiu às sete e quarenta."',
    'Silêncio.',
    'O rádio continua tocando.',
    'Um dos rapazes de luva olha pro outro. A Dra. Pia não levanta a cabeça.',
    'E o mais velho dos dois — o que conversa com os bichos — responde, sem agressividade nenhuma, e a resposta dele é a coisa mais devastadora do capítulo:',
    '"Eu sei."',
    '"Eu sei qual é a mãe de qual há quatro anos, {moço|moça}. Eu sei todas."',
    'Ele ajeita a luva.',
    '"Eu só não tenho onde anotar."'
  ],
  ef:{flag:['parou_a_triagem','sabe_que_eles_sabem'],
      moral:-15, instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Falou alto no meio de um expediente'},
      npc:{nome:'Peão do setor 7', opiniao:3, memoria:'Sabe de cabeça, há quatro anos, qual filhote é de qual mãe. Não tem onde anotar.'},
      registrar:'Os peões do setor 7 sabem os vínculos de cabeça. Não existe campo no formulário.',
      presagio:'"Eu só não tenho onde anotar." Um campo de formulário. Era só isso.'},
  escolhas:[
    {texto:'"Então anota. Eu arrumo onde."', vai:'c12_arrumou_onde'},
    {texto:'Voltar à noite e abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Ficar o dia inteiro mesmo assim.', vai:'c12_o_dia_inteiro'},
    {texto:'Sair.', vai:'c12_saiu_da_terca'}
  ]
},

c12_arrumou_onde:{
  falante:'Peão do setor 7',
  vozes:['P','N','P','E','E','N','P'],
  texto:[
    '"Então anota. Eu arrumo onde."',
    'Você tira o seu caderno da mochila — o caderno em que você anota tudo desde que saiu de casa, o que já viu coisa demais.',
    'E arranca as folhas do meio, em branco, e dá pra ele.',
    'Ele olha as folhas.',
    '"Eu não escrevo bem."',
    '"Não precisa escrever bem."',
    'Ele senta na caixa da garrafa térmica com as folhas no joelho e começa.',
    'Leva quarenta minutos e ele não usa nenhum nome científico e nenhum número de brinco.',
    'Ele escreve assim: "o de orelha rasgada é filho da que manca da pata de trás". "Os dois pequenos listrados são irmãos, do mesmo ninho, vieram juntos em abril."',
    'Quatro anos de memória de um homem que não escreve bem, em doze folhas de caderno.',
    'Quando acaba, ele entrega e não solta na hora.',
    '"Isso vale alguma coisa?"',
    '"Isso vale mais do que tudo que eu tenho na mochila."'
  ],
  ef:{flag:['tem_os_vinculos','provas_zona'],
      itens:{'Doze folhas de vínculos':1},
      npc:{nome:'Peão do setor 7', opiniao:8, memoria:'Escreveu quatro anos de vínculos familiares em doze folhas do seu caderno.'},
      rep:{eixo:'bom',delta:6,motivo:'Deu papel a quem tinha os dados e nenhum lugar para pôr'},
      moral:20,
      registrar:'Um peão do setor 7 escreveu quatro anos de vínculos familiares em doze folhas do seu caderno.',
      presagio:'"O de orelha rasgada é filho da que manca." Nenhum sistema de Kanto tem esse campo.'},
  escolhas:[
    {texto:'Voltar à noite e abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar tudo pro diretor.', vai:'c12_diretor'},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c12_saiu_da_terca:{
  texto:[
    'Você sai.',
    'Anda até a van, senta no banco do carona com a porta aberta e os pés pra fora, e fica ali.',
    'Ninguém comenta, exatamente como ela disse.',
    'Às dezoito e quarenta ela termina o turno, tira a luva, e senta no banco do motorista sem ligar o carro.',
    '"Eu avisei."',
    '"Avisou."',
    '"Você durou quanto?"',
    '"Duas horas e dez."',
    'Ela liga o carro.',
    '"É o recorde."'
  ],
  ef:{flag:'saiu_do_setor7', moral:-10,
      npc:{nome:'Dra. Pia', opiniao:5, memoria:'Você durou duas horas e dez no setor 7. É o recorde de auxiliar dela.'},
      registrar:'Saiu do turno de triagem depois de duas horas e dez minutos.',
      presagio:'É o recorde. Pensa em quantos auxiliares ela já levou.'},
  escolhas:[
    {texto:'Voltar à noite e abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Pedir os formulários a ela.', vai:'c12_formularios'}
  ]

},

/* ─────────────── O DIRETOR ─────────────── */

c12_diretor:{
  texto:[
    'O diretor da Zona Safári tem sessenta e poucos anos e uma sala com fotos dele ao lado de gente importante ao longo de trinta e um anos.',
    'As fotos são dispostas em ordem cronológica e você consegue ver o cabelo mudando de cor da esquerda pra direita.',
    'A sala é pequena, o ar-condicionado é de janela, e a cadeira dele tem um remendo de fita adesiva no braço.',
    'Ele te recebe com uma cordialidade desarmante — levanta, aperta a sua mão, oferece café, pergunta se você quer açúcar — e ouve a sua pergunta sobre o setor 7 inteira, sem interromper, com as duas mãos apoiadas na mesa.',
    '"Recuperação ambiental."',
    'Ele nem hesita.',
    '"Pastagem degradada, herança da fazenda que virou reserva em sessenta e nove. Estamos replantando."',
    'Atrás dele, na parede, entre as fotos, tem uma planta baixa da reserva emoldurada, dessas que se manda emoldurar quando se tem orgulho.',
    'O setor 7 está marcado nela.',
    'E na marcação, escrito à mão, numa caligrafia antiga de caneta-tinteiro:',
    '**área de manejo**'
  ],
  ef:{npc:{nome:'Diretor Quince', opiniao:0, memoria:'Te disse que o setor 7 é recuperação ambiental.'},
      flag:'falou_com_diretor',
      presagio:'Caligrafia antiga, caneta-tinteiro, numa planta emoldurada. Ele mandou emoldurar sabendo.'},
  escolhas:[
    {texto:'"O que é área de manejo?"', vai:'c12_manejo'},
    {texto:'"O Orin te procurou em março."', vai:'c12_o_nico_te_procurou', cond:d=>!!d.flags.nico_falou},
    {texto:'"A planilha é de 1971 e a reserva cresceu em 85."', vai:'c12_planilha_pro_diretor', cond:d=>!!d.flags.entendeu_a_conta},
    {texto:'"Eu sei o que tem lá." Blefar.', vai:'c12_blefe_diretor'}
  ]
},

c12_manejo:{
  falante:'Diretor Quince',
  vozes:['N','N','N','P','N','N'],
  texto:[
    'A cordialidade dele não some. Ela fica exatamente igual, e é isso que muda tudo.',
    '"Manejo é o controle populacional de uma reserva fechada."',
    'Ele fala devagar, como professor que já deu essa aula muitas vezes e ainda gosta de dar.',
    '"Nove mil hectares suportam um número. Acima desse número, a população colapsa sozinha — por fome, por doença, por briga territorial, por parasitose. Não é ameaça: é curva. Toda população fechada faz a mesma curva."',
    '"Nós retiramos o excedente antes da curva virar."',
    '"Retiram pra onde?"',
    'Ele abre as mãos.',
    '"Para onde tem quem receba."',
    'E aí ele diz a frase que faz esse homem ser o vilão mais difícil que você vai encontrar:',
    '"Se você conhece um lugar melhor, eu escrevo o ofício hoje. Eu escrevo mesmo. Eu tenho o modelo salvo."'
  ],
  ef:{flag:['sabe_do_manejo','sabe_do_setor7'],
      registrar:'O diretor admitiu: o setor 7 é retirada de "excedente populacional".',
      presagio:'"Eu tenho o modelo salvo." Ele já escreveu esse ofício antes, muitas vezes.'},
  escolhas:[
    {texto:'"Isso tem outro nome."', vai:'c12_confronto_diretor'},
    {texto:'"E se a reserva fosse maior?"', vai:'c12_pergunta_dificil'},
    {texto:'"O receptor escreveu o critério de triagem."', vai:'c12_critico_do_receptor', cond:d=>!!d.flags.ficha_do_receptor},
    {texto:'"O Orin te procurou em março."', vai:'c12_o_nico_te_procurou', cond:d=>!!d.flags.nico_falou}
  ]
},

c12_o_nico_te_procurou:{
  falante:'Diretor Quince',
  vozes:['P','N','P','N','P','E','E','N','N','N'],
  texto:[
    '"Um guia te procurou em março."',
    'Ele não pergunta qual guia.',
    '"Procurou."',
    '"E você disse que ia apurar."',
    '"Eu disse."',
    '"E apurou?"',
    'Ele abre a segunda gaveta da mesa e tira uma pasta fina, e abre na sua frente, e vira pra você.',
    'É um ofício. Datado de doze de março. Endereçado ao Conselho Gestor da Reserva.',
    '**"Solicito instauração de apuração preliminar sobre as atividades do Setor 7, em razão de relato de servidor."**',
    'Assinado por ele.',
    'E grampeada atrás, a resposta, de vinte e oito de março, meia página:',
    '**"Indeferido. Matéria já apreciada na 41ª Reunião Ordinária."**',
    '"Eu apurei", ele diz. "Eu apuro desde noventa e sete, toda vez que alguém me procura. Eu tenho catorze desses."',
    'Ele fecha a pasta.',
    '"Eu só não conto pro rapaz, porque contar pro rapaz que eu tentei e não deu é pior do que ele achar que eu não liguei."'
  ],
  ef:{flag:['viu_os_oficios','diretor_humanizado'],
      npc:{nome:'Diretor Quince', opiniao:5, memoria:'Te mostrou o ofício de março e a negativa do conselho. Tem catorze iguais.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou a coisa que fez o homem abrir a gaveta'},
      moral:-8,
      registrar:'O diretor tem catorze ofícios de apuração indeferidos pelo conselho desde 1997.',
      presagio:'Ele deixou o Orin achar que ele não ligava. Por gentileza. Pense nisso.'},
  escolhas:[
    {texto:'"Me dá os catorze."', vai:'c12_papelada'},
    {texto:'"Conta pro Orin."', vai:'c12_conta_pro_nico'},
    {texto:'"E se a reserva fosse maior?"', vai:'c12_pergunta_dificil'},
    {texto:'"A planilha é de 1971."', vai:'c12_planilha_pro_diretor', cond:d=>!!d.flags.entendeu_a_conta}
  ]
},

c12_conta_pro_nico:{
  falante:'Diretor Quince',
  vozes:['P','N','P','N','P'],
  texto:[
    '"Conta pro Orin."',
    '"Pra quê?"',
    '"Porque ele ensaiou quatro meses pra falar com você, e ele acha que você não ligou, e ele vai continuar achando isso pelo resto da vida."',
    'O diretor olha a pasta fechada.',
    '"E se eu contar, ele descobre que o lugar onde ele trabalha é pior do que ele pensava. Ele pensava que era um homem. É uma estrutura."',
    '"Ele já sabe que é uma estrutura. Ele só acha que você faz parte dela de má vontade."',
    'Silêncio.',
    'Ele levanta, abre a porta da sala, e chama a secretária pelo nome, e pede pra chamar o guia Orin.',
    'Você sai antes do Orin chegar, porque essa conversa não é sua.',
    'Da janela do corredor você vê os dois na sala por dezenove minutos, e o diretor mostrando a pasta, e o Orin sentado com as duas mãos no rosto.'
  ],
  ef:{flag:['diretor_contou_pro_nico'],
      npc:{nome:'Guia Orin', opiniao:5, memoria:'Descobriu que o diretor tentou catorze vezes. Chorou na sala dele.'},
      rep:{eixo:'bom',delta:4,motivo:'Fez duas pessoas que estavam do mesmo lado descobrirem isso'},
      moral:15,
      registrar:'O diretor contou ao Orin sobre os catorze ofícios indeferidos.',
      presagio:'Dezenove minutos. Duas pessoas do mesmo lado descobrindo isso com quatro meses de atraso.'},
  escolhas:[
    {texto:'Pedir os catorze ofícios.', vai:'c12_papelada'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir falar com a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara}
  ]
},

c12_planilha_pro_diretor:{
  falante:'Diretor Quince',
  vozes:['P','N'],
  texto:[
    '"A planilha é de setenta e um. E a reserva ganhou a fazenda do rio em oitenta e cinco."',
    'A cordialidade some.',
    'Não vira raiva. Vira outra coisa: ele fica muito quieto e olha a planta baixa emoldurada atrás dele, sem virar o corpo, só os olhos.',
    'Depois ele levanta, tira a planta da parede — com cuidado, com as duas mãos, do jeito que se tira uma coisa que a gente mandou emoldurar — e põe em cima da mesa.',
    'No canto inferior direito da planta, em letra pequena de desenhista técnico:',
    '**LEVANTAMENTO AEROFOTOGRAMÉTRICO — 1971 — 8.160 ha**',
    'Está escrito ali. Na parede da sala dele. Há trinta e um anos. Do lado da cabeça dele, todo dia, em todas as fotos.',
    'Ele senta.',
    'E fica uns dois minutos sem falar nada, e você deixa.',
    '"Eu olhei pra essa planta todo dia útil da minha vida adulta."'
  ],
  ef:{flag:['diretor_viu_o_erro','provou_o_erro'],
      npc:{nome:'Diretor Quince', opiniao:6, memoria:'Tirou a planta da parede e leu, com você, a área que ele nunca conferiu em 31 anos.'},
      rep:{eixo:'bom',delta:6,motivo:'Mostrou a um homem o erro que estava emoldurado na parede dele'},
      moral:-10, instabilidade:1,
      registrar:'O diretor confrontou a área de 1971 emoldurada na própria sala.',
      presagio:'Estava na parede. Em letra pequena. Do lado da cabeça dele.'},
  escolhas:[
    {texto:'"Então suspende a retirada."', vai:'c12_suspende'},
    {texto:'"Me dá os catorze ofícios."', vai:'c12_papelada'},
    {texto:'"E o que tem no setor 7 hoje à noite?"', vai:'c12_confronto_diretor'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_suspende:{
  texto:[
    '"Então suspende a retirada."',
    '"Eu não posso."',
    '"Você é o diretor."',
    '"Eu sou o diretor executivo. A retirada é deliberação de conselho e eu executo deliberação de conselho."',
    'Ele passa a mão na planta em cima da mesa.',
    '"Mas eu posso uma coisa."',
    '"O quê?"',
    '"Eu posso instaurar revisão técnica da capacidade de suporte, porque isso é matéria técnica e matéria técnica é minha."',
    '"E o que a revisão faz?"',
    '"A revisão suspende a aplicação do índice até a conclusão."',
    'Ele já está puxando papel da gaveta.',
    '"Quer dizer: se eu assinar isso agora, hoje, a retirada de duzentos e quarenta deste ano não tem base legal a partir de amanhã de manhã."',
    'Ele para com a caneta no ar.',
    '"E o que já está no setor 7 continua onde está, porque o que já foi triado já foi triado, e eu não tenho competência pra desfazer triagem."',
    '"Quantos estão lá hoje?"',
    'Ele olha a agenda.',
    '"Oitenta e sete. Embarque quinta."'
  ],
  ef:{flag:['diretor_suspende','sabe_dos_oitenta_e_sete'],
      npc:{nome:'Diretor Quince', opiniao:8, memoria:'Assinou a revisão técnica que derruba a base legal da retirada do ano.'},
      rep:{eixo:'bom',delta:6,motivo:'Conseguiu a suspensão administrativa da retirada anual'},
      instabilidade:1,
      registrar:'O diretor instaurou revisão técnica: a retirada anual perde base legal. Restam 87 no setor 7, embarque quinta.',
      presagio:'Oitenta e sete. Embarque quinta. O papel resolve o ano que vem; a quinta é sua.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'"E se eu abrir o curral hoje?"', vai:'c12_se_eu_abrir'},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir falar com o Sr. Zane sobre a soltura.', vai:'c12_marido', cond:d=>!!d.flags.ninguem_pergunta}
  ]
},

c12_se_eu_abrir:{
  falante:'Diretor Quince',
  vozes:['P','N','P','N','N','N','N'],
  texto:[
    '"E se eu abrir o curral hoje?"',
    'Ele põe a caneta na mesa.',
    'Olha pra você por um tempo desconfortável.',
    '"Se você abrir o curral hoje, eu tenho que registrar ocorrência, acionar a segurança patrimonial e comunicar o receptor."',
    '"E você faria?"',
    '"Eu faria. Eu sou servidor há trinta e um anos."',
    'Pausa.',
    '"E eu comunico o receptor por ofício postado, que leva de três a cinco dias úteis, porque comunicação a terceiro credenciado é por ofício postado, conforme o regulamento interno que eu mesmo escrevi em noventa e quatro."',
    'Ele olha a janela.',
    '"E a segurança patrimonial é uma empresa contratada que atende das dezoito às seis, e hoje é terça, e na terça a escala é de um vigia só, e o vigia da terça é o Sr. Ulric que tem setenta e um anos e uma catarata."',
    'Ele volta a olhar pra você.',
    '"Eu não te disse nada disso."'
  ],
  ef:{flag:['diretor_te_deu_a_janela','sabe_do_seu_jorge'],
      npc:{nome:'Diretor Quince', opiniao:9, memoria:'Te explicou, em forma de regulamento, exatamente como abrir o curral sem ser pego.'},
      rep:{eixo:'bom',delta:5,motivo:'Fez um burocrata de trinta e um anos usar o regulamento a favor'},
      moral:12,
      registrar:'O diretor explicou os prazos e a escala de vigia. Terça é o dia.',
      presagio:'"Eu não te disse nada disso." Ele passou trinta e um anos aprendendo esses prazos.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Chamar o Sr. Zane para dirigir.', vai:'c12_marido', cond:d=>!!d.flags.ninguem_pergunta},
    {texto:'Chamar o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Chamar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara}
  ]
},

c12_pergunta_dificil:{
  falante:'Diretor Quince',
  vozes:['P','N','N','N','N','N','N','N'],
  texto:[
    '"E se a reserva fosse maior?"',
    'Ele para. É a primeira vez que ele para.',
    '"Se a reserva fosse maior, o problema mudava de lugar e ficava maior também, porque população cresce pra ocupar a área."',
    'Ele olha a planta baixa na parede.',
    '"Mas mudaria a ordem de grandeza do que a gente chama de excedente. E a ordem de grandeza é tudo."',
    '"Eu peço ampliação há dezenove anos."',
    '"Dezenove anos, três governos, quatro diretores de Liga e dois ministros. Nenhum disse não."',
    '"Todos disseram depois."',
    'Ele volta pra você.',
    '"Eu não estou pedindo sua compreensão. Compreensão é barata e eu já recebi muita."',
    '"Eu estou te explicando por que um homem honesto vira isso aqui em dezenove anos, porque você tem quinze e vai encontrar muitos de mim pela frente e vai ser útil saber como a gente é feito."'
  ],
  ef:{flag:'diretor_humanizado',
      npc:{nome:'Diretor Quince', opiniao:3, memoria:'Te contou dos dezenove anos pedindo ampliação da reserva.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou a pergunta que fez o homem parar'},
      registrar:'O diretor pede ampliação da reserva há dezenove anos.',
      presagio:'"Vai ser útil saber como a gente é feito." Ele está te ensinando a reconhecê-lo em outras pessoas.'},
  escolhas:[
    {texto:'"Me dá os dezenove anos de papel."', vai:'c12_papelada'},
    {texto:'"Por que não ampliaram? Quem é o dono da terra ao lado?"', vai:'c12_dono_da_terra'},
    {texto:'"Ainda assim eu vou lá hoje à noite."', vai:'c12_noite_zona'},
    {texto:'"Então não tem o que fazer." E ir embora de Fuchsia.', vai:'c12_desistiu_zona'}
  ]
},

c12_dono_da_terra:{
  texto:[
    '"Quem é o dono da terra ao lado?"',
    'Ele levanta uma sobrancelha, e é a primeira vez que ele parece surpreso com uma pergunta sua.',
    '"Boa."',
    'Ele abre a terceira gaveta e tira um mapa fundiário dobrado, desses de cartório, amarelado nos vincos.',
    'A reserva é o polígono grande no meio. Em volta, quinze propriedades.',
    'Onze são pequenas: sítio, chácara, fazendinha de leite.',
    'Quatro são grandes e fazem fronteira com o setor 7. E as quatro têm o mesmo nome no campo de proprietário.',
    '**AGROPECUÁRIA LINHA VERDE S/A**',
    '"Eu pedi ampliação pra esse lado dezenove vezes porque é o lado que faz sentido — é contínuo, é o mesmo bioma, tem nascente."',
    '"E essas quatro foram compradas quando?"',
    'Ele passa o dedo nas datas de registro.',
    'Noventa e cinco. Noventa e seis. Noventa e seis. Noventa e sete.',
    '"Ah", ele diz.',
    'Só isso. "Ah."'
  ],
  ef:{flag:['sabe_da_linha_verde','provas_zona'],
      itens:{'Mapa fundiário':1},
      npc:{nome:'Diretor Quince', opiniao:7, memoria:'Descobriu com você que a terra da ampliação foi comprada por uma só empresa entre 95 e 97.'},
      rep:{eixo:'bom',delta:6,motivo:'Perguntou quem era o dono da terra ao lado'},
      instabilidade:2,
      registrar:'As quatro propriedades vizinhas ao setor 7 foram compradas pela Agropecuária Linha Verde entre 1995 e 1997.',
      presagio:'Compraram a ampliação antes de a ampliação ser negada. Guarde as datas.'},
  escolhas:[
    {texto:'"Quem é a Linha Verde?"', vai:'c12_quem_e_linha_verde'},
    {texto:'"Me dá os dezenove anos de papel."', vai:'c12_papelada'},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar isso pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia}
  ]
},

c12_quem_e_linha_verde:{
  texto:[
    '"Quem é a Linha Verde?"',
    '"Não faço ideia. Nunca precisei saber."',
    'Ele olha o mapa.',
    '"Mas a junta comercial de Celadon é pública e fica a quatro horas daqui de ônibus, e eu tenho férias acumuladas desde noventa e nove."',
    'Ele dobra o mapa e te entrega.',
    '"Leva. Eu tenho o original digitalizado."',
    d=>d.flags.ligou_fuchsia_celadon ? 'E você já sabe o que ele vai achar, e ele ainda não sabe, e você decide não estragar a viagem dele.' :
       d.flags.sabe_do_cartorio ? 'Junta comercial de Celadon. Você já esteve lá. Você sabe onde fica o balcão e sabe que a fila da manhã é menor.' :
       'Junta comercial de Celadon. Anota.',
    '"Eu vou tirar quinze dias", ele diz, e é a primeira vez que ele sorri de verdade no capítulo inteiro. "Trinta e um anos e eu nunca tirei quinze dias seguidos."'
  ],
  ef:{flag:['diretor_vai_a_junta','sabe_do_cartorio'],
      npc:{nome:'Diretor Quince', opiniao:8, memoria:'Vai tirar quinze dias de férias acumuladas para ir à junta comercial de Celadon.'},
      rep:{eixo:'bom',delta:4,motivo:'Colocou um servidor de trinta e um anos na estrada atrás da resposta'},
      moral:10,
      registrar:'O diretor vai à junta comercial de Celadon investigar a Agropecuária Linha Verde.',
      presagio:'Trinta e um anos e nunca tirou quinze dias. Ele vai usar as férias nisso.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Pedir os catorze ofícios antes.', vai:'c12_papelada'},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir falar com a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara}
  ]
},

c12_papelada:{
  falante:'Diretor Quince',
  vozes:['E','N'],
  texto:[
    'Ele te dá.',
    'Uma pasta de dezenove anos de ofícios, protocolos, respostas padrão e catorze pedidos de apuração indeferidos.',
    'Ele não entrega rápido. Ele tira folha por folha do arquivo, confere, junta, e leva vinte minutos, e você fica ali os vinte minutos.',
    'A última folha é de fevereiro deste ano: "Solicitação em análise."',
    '"Isso não me inocenta", ele diz, entregando a pasta com as duas mãos.',
    '"Isso só explica. Eu sei a diferença."',
    d=>d.flags.tem_as_comunicacoes ? 'Um capitão de navio te disse quase isso, com outras palavras, numa ponte de comando.' : '',
    'Você começa a achar que é uma frase que as pessoas aprendem quando chegam numa certa idade dentro de uma certa estrutura.'
  ],
  ef:{flag:['pasta_do_diretor','provas_zona'],
      itens:{'Pasta de dezenove anos de ofícios':1},
      rep:{eixo:'bom',delta:4,motivo:'Conseguiu dezenove anos de documentação da reserva'},
      npc:{nome:'Diretor Quince', opiniao:6, memoria:'Te entregou dezenove anos de papelada sabendo o que você ia fazer com ela.'},
      registrar:'Recebeu dezenove anos de ofícios sobre a Zona Safári.',
      presagio:'"Isso só explica. Eu sei a diferença." Guarde: mais gente vai te dizer isso.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar tudo à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'"Quem é o dono da terra ao lado?"', vai:'c12_dono_da_terra'}
  ]
},

c12_critico_do_receptor:{
  falante:'Diretor Quince',
  vozes:['P','N','N','P','N','N','P'],
  texto:[
    '"O receptor escreveu o critério de triagem."',
    'Ele para de mexer no papel.',
    '"Como?"',
    'Você põe a ficha técnica na mesa dele, aberta na última página, no rodapé em corpo oito.',
    'Ele lê. Tira o óculos, limpa no paletó, põe de volta, lê de novo.',
    '"Eu aprovei essa ficha."',
    '"Eu sei."',
    '"Eu aprovei essa ficha em noventa e quatro porque ela veio com parecer favorável de um médico veterinário credenciado e porque eu não sou médico veterinário."',
    'Ele empurra a ficha de volta, devagar.',
    '"E a pergunta que eu não fiz em noventa e quatro é: por que o receptor tem departamento técnico?"',
    '"Um armazém não tem departamento técnico."'
  ],
  ef:{flag:['diretor_viu_a_ficha'],
      npc:{nome:'Diretor Quince', opiniao:6, memoria:'Descobriu com você que aprovou uma ficha técnica escrita pelo próprio comprador.'},
      rep:{eixo:'bom',delta:4,motivo:'Mostrou ao diretor de quem era o timbre'},
      moral:-8,
      registrar:'O diretor aprovou em 1994 a ficha técnica escrita pelo departamento técnico do receptor.',
      presagio:'Um armazém não tem departamento técnico. Guarde a frase.'},
  escolhas:[
    {texto:'"Então suspende."', vai:'c12_suspende'},
    {texto:'"Quem é o dono da terra ao lado?"', vai:'c12_dono_da_terra'},
    {texto:'"Me dá os dezenove anos de papel."', vai:'c12_papelada'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_confronto_diretor:{
  falante:'Diretor Quince',
  vozes:['P','N','N','P','N','N','N','N','N'],
  texto:[
    '"Isso tem outro nome."',
    '"Tem", ele concorda na hora. "Tem outro nome e o outro nome é mais honesto."',
    'Ele se levanta e vai até a janela, que dá pro estacionamento de funcionários e nada mais.',
    '"Quer saber o que eu acho, de verdade, depois de trinta e um anos?"',
    '"Quero."',
    '"Eu acho que eu sou a pior pessoa desta cidade e a única que impede isso de ser muito pior."',
    '"As duas coisas ao mesmo tempo. É possível. Eu sou a prova viva."',
    'Ele olha o estacionamento.',
    '"Se eu sair amanhã, entra alguém que não escreve ofício, que não guarda catorze indeferimentos numa gaveta, e que não faz questão de que o bicho chegue vivo no caminhão."',
    '"E eu fico. E ficar é o que me torna a pior pessoa desta cidade."',
    'Ele volta pra mesa.',
    '"Não tem saída dessa frase. Eu procuro há dezenove anos."'
  ],
  ef:{flag:'diretor_confrontado',
      npc:{nome:'Diretor Quince', opiniao:4, memoria:'Te disse que é a pior pessoa da cidade e a única que impede que seja pior.'},
      moral:-8,
      registrar:'"Eu sou a pior pessoa desta cidade e a única que impede isso de ser muito pior."',
      presagio:'Não tem saída dessa frase. Você vai encontrar essa pessoa de novo, com outro rosto.'},
  escolhas:[
    {texto:'"Tem saída. Suspende."', vai:'c12_suspende'},
    {texto:'"Me dá os dezenove anos de papel."', vai:'c12_papelada'},
    {texto:'"Quem é o dono da terra ao lado?"', vai:'c12_dono_da_terra'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_blefe_diretor:{
  texto:['"Eu sei o que tem lá."'],
  teste:{status:'carisma', dificuldade:9, nomeStatus:'Carisma',
         critico:'c12_manejo', sucesso:'c12_manejo', parcial:'c12_diretor_frio', falha:'c12_diretor_frio'}
},

c12_diretor_frio:{
  texto:[
    'A cordialidade some de uma vez, e o que sobra é um servidor de trinta e um anos que já viu muita gente sentar naquela cadeira.',
    '"Não, você não sabe."',
    'Ele se senta.',
    '"Se soubesse, não estaria sentado na minha sala me contando. Quem sabe, vai lá."',
    'Ele toca um botão do telefone.',
    '"Por favor, acompanhe {nosso visitante|nossa visitante} até a saída."',
    'Você é acompanhad{o|a} até a saída. Educadamente, com um "obrigado pela visita" na porta.',
    'Até a saída da cidade.'
  ],
  ef:{flag:'diretor_alerta',
      npc:{nome:'Diretor Quince', opiniao:-3, memoria:'Você blefou mal na sala dele. Ele mandou te acompanharem até fora da cidade.'},
      presagio:'"Quem sabe, vai lá." Ele te deu conselho enquanto te expulsava.'},
  escolhas:[
    {texto:'Voltar à noite mesmo assim.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Desistir da Zona.', vai:'c12_desistiu_zona'}
  ]
},

/* ─────────────── O BAR, A CERCA E A NOITE ─────────────── */

c12_bar:{
  falante:'o guarda mais velho',
  vozes:['P','N','o guarda mais novo','N','N','P','N'],
  texto:[
    'O bar de Fuchsia tem seis mesas, um freezer de sorvete que não tem sorvete, e é onde os guardas-parque bebem depois do turno.',
    'Você paga uma rodada. Isso compra vinte minutos de conversa e nada mais, e os vinte minutos começam na hora em que a garrafa chega.',
    '"Setor 7?"',
    'O mais velho ri sem alegria nenhuma.',
    '"Setor 7 é onde a gente aprende que não existe emprego limpo."',
    'Outro, mais novo, bate na mesa com a mão espalmada. "Fala menos."',
    '"Fala menos por quê? {O moleque|A menina} já sabe. Todo mundo sabe."',
    'Ele vira o copo.',
    '"Fuchsia inteira sabe e Fuchsia inteira come do que sai de lá. A padaria, a escola, o posto. Cinquenta e dois por cento do orçamento desta cidade vem de repasse da reserva e a reserva só tem superávit por causa do setor 7."',
    '"Cinquenta e dois?"',
    '"Cinquenta e dois. Tá no mural da prefeitura, {moço|moça}. Tá no mural, em cartaz, com gráfico de pizza."'
  ],
  ef:{flag:['sabe_do_setor7','sabe_dos_cinquenta_e_dois'], dinheiro:-400,
      registrar:'52% do orçamento de Fuchsia vem de repasse da reserva, e o superávit vem do setor 7.',
      presagio:'Tem gráfico de pizza no mural da prefeitura. Isso não está escondido de ninguém.'},
  escolhas:[
    {texto:'"Algum de vocês me leva lá?"', vai:'c12_guarda_leva'},
    {texto:'"Quantos ficam no caminho?"', vai:'c12_quantos_ficam'},
    {texto:'"E ninguém nunca abriu aquele curral?"', vai:'c12_ja_abriram'},
    {texto:'Ir sozinh{o|a} à noite.', vai:'c12_noite_zona'}
  ]
},

c12_quantos_ficam:{
  falante:'o guarda mais velho',
  vozes:['P','N','P','N','N','P','N','N','P','N','N'],
  texto:[
    '"Quantos ficam no caminho?"',
    'A mesa fica quieta.',
    'O mais velho olha o copo.',
    '"Depende do caminhão."',
    '"Depende do caminhão como?"',
    '"Caminhão baú fechado, sem ventilação forçada, em dia de sol, com quatro horas até Celadon." Ele fala devagar. "A gente chama de perda de transporte."',
    '"E é quanto?"',
    '"Entre oito e catorze por cento."',
    'Ele finalmente olha pra você.',
    '"E a perda de transporte não sai da conta de ninguém, porque a retirada já foi baixada da população da reserva no momento do embarque, e o recebimento no destino é por cabeça entregue."',
    '"Então quem perde?"',
    '"Ninguém perde, {moço|moça}. Esse é o desenho."',
    'Ele empurra o copo.',
    '"Eles somem entre uma planilha e outra e as duas planilhas fecham."'
  ],
  ef:{flag:['sabe_da_perda_de_transporte','provas_zona'],
      rep:{eixo:'bom',delta:4,motivo:'Perguntou quantos ficam no caminho'},
      moral:-15, instabilidade:1,
      registrar:'A "perda de transporte" é de 8% a 14% e não aparece em nenhuma planilha.',
      presagio:'Somem entre uma planilha e outra e as duas fecham. É o crime perfeito e ninguém o planejou.'},
  escolhas:[
    {texto:'"Algum de vocês me leva lá?"', vai:'c12_guarda_leva'},
    {texto:'"E ninguém nunca abriu aquele curral?"', vai:'c12_ja_abriram'},
    {texto:'Ir sozinh{o|a} à noite.', vai:'c12_noite_zona'},
    {texto:'Levar isso pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia}
  ]
},

c12_ja_abriram:{
  falante:'o guarda mais novo',
  vozes:['P','N','P','N','N','P','N','P','N','o guarda mais velho','P','o guarda mais velho'],
  texto:[
    '"E ninguém nunca abriu aquele curral?"',
    'O mais novo responde antes do velho, o que é a primeira vez na conversa.',
    '"Abriram."',
    '"Quando?"',
    '"Noventa e nove. Um guarda. O Beto."',
    'O mais velho fecha os olhos.',
    '"Ele abriu o corredor de contenção às três da manhã e soltou uns sessenta."',
    '"E?"',
    '"E sessenta bichos saíram correndo pro mato, e trinta e poucos voltaram pro curral sozinhos em três dias, porque estavam com fome e o curral é onde tem comida."',
    'Silêncio.',
    '"E os outros?"',
    '"Uns morreram. Uns foram recapturados na semana seguinte com a operação de rotina. Uns devem ter conseguido, sei lá."',
    'O velho abre os olhos.',
    '"E o Beto foi demitido por justa causa e mora em Cinnabar desde então, e ele não fez nada errado, e ele fez tudo errado, e as duas coisas são verdade."',
    '"Errado por quê?"',
    '"Porque ele abriu a porta e não tinha pra onde levar."'
  ],
  ef:{flag:['sabe_do_beto','sabe_que_voltam'],
      rep:{eixo:'bom',delta:3,motivo:'Perguntou se alguém já tinha tentado'},
      moral:-10,
      npc:{nome:'Guarda Kell', opiniao:2, memoria:'Te contou do Beto, que abriu o curral em 1999 e não tinha para onde levar.'},
      registrar:'Em 1999 um guarda abriu o curral. Metade voltou sozinha em três dias, por fome.',
      presagio:'Ele abriu a porta e não tinha pra onde levar. Não repita isso.'},
  escolhas:[
    {texto:'"Então eu preciso de caminhão."', vai:'c12_precisa_de_caminhao'},
    {texto:'"Algum de vocês me leva lá?"', vai:'c12_guarda_leva'},
    {texto:'Ir sozinh{o|a} à noite.', vai:'c12_noite_zona'},
    {texto:'Ir procurar o Sr. Zane.', vai:'c12_marido', cond:d=>!!d.flags.ninguem_pergunta}
  ]
},

c12_precisa_de_caminhao:{
  falante:'o guarda mais velho',
  vozes:['P','P','P','N','P','N','o guarda mais novo','o guarda mais novo'],
  texto:[
    '"Então eu preciso de caminhão."',
    'Os quatro olham pra você ao mesmo tempo.',
    '"Caminhão de soltura", você continua. "Com quem conheça os pontos. Pra levar longe o suficiente pra não voltar."',
    'O mais velho põe o copo na mesa com cuidado.',
    '"A reserva tem dois caminhões de soltura parados no galpão de máquinas desde noventa e oito, quando cortaram a rubrica."',
    '"Funcionam?"',
    '"Funcionavam em noventa e oito. Bateria descarregada, pneu vazio, e eu sei onde está a chave porque eu sou o guarda que confere o galpão de máquinas."',
    'Ele olha os outros três.',
    'O mais novo já está balançando a cabeça, mas balançando de um jeito que não é não — é o balanço de quem está fazendo conta.',
    '"Bateria a gente arruma", diz o mais novo. "Meu cunhado tem oficina."'
  ],
  ef:{flag:['sabe_dos_caminhoes','plano_de_soltura'],
      rep:{eixo:'bom',delta:4,motivo:'Transformou uma invasão num plano de logística'},
      npc:{nome:'Guarda Kell', opiniao:5, memoria:'Sabe onde está a chave do galpão de máquinas com os dois caminhões de soltura.'},
      moral:10,
      registrar:'A reserva tem dois caminhões de soltura parados desde 2000, no galpão de máquinas.',
      presagio:'"Meu cunhado tem oficina." É assim que as coisas acontecem de verdade.'},
  escolhas:[
    {texto:'Chamar o Sr. Zane para dirigir.', vai:'c12_marido', cond:d=>!!d.flags.ninguem_pergunta},
    {texto:'Ir ao setor 7 hoje à noite com eles.', vai:'c12_guarda_leva'},
    {texto:'Falar com o diretor sobre os caminhões.', vai:'c12_diretor'},
    {texto:'Ir sozinh{o|a} à noite.', vai:'c12_noite_zona'}
  ]
},

c12_guarda_leva:{
  falante:'o guarda mais velho',
  vozes:['P','N','o guarda mais novo','N','N','o guarda mais novo','N','o guarda mais novo','o guarda mais novo'],
  texto:[
    '"Algum de vocês me leva lá?"',
    'Silêncio na mesa. Longo. O suficiente pro dono do bar olhar.',
    'Depois o mais velho empurra o copo pra longe — não bebe o resto, empurra pra longe, que é diferente.',
    '"Eu levo."',
    '"Você tá bêbado."',
    '"Eu tô bêbado há quatro anos." Ele levanta e pega o chapéu do encosto da cadeira. "Vamo."',
    'Os outros três não dizem nada.',
    'Na porta, o mais novo fala, sem levantar da mesa:',
    '"Kell."',
    '"Que é?"',
    '"Nada não." Pausa. "Boa sorte."'
  ],
  ef:{flag:'guarda_junto',
      npc:{nome:'Guarda Kell', opiniao:5, memoria:'Te levou ao setor 7 depois de quatro anos calado, e empurrou o copo pra longe antes.'},
      rep:{eixo:'bom',delta:2,motivo:'Alguém decidiu parar de esperar'},
      presagio:'Ele empurrou o copo pra longe. Não terminou. Isso é uma decisão inteira num gesto.'},
  escolhas:[{texto:'Ir.', vai:'c12_setor7'}]
},

c12_cerca:{
  texto:[
    'A cerca tem trinta e um quilômetros e você não vai andar trinta e um quilômetros.',
    'Você anda quatro, seguindo a linha do alambrado por fora, no capim alto, com o sol descendo.',
    'E acha uma coisa que não faz sentido: um portão de serviço com asfalto do lado de fora.',
    'Asfalto. No meio do mato. Numa reserva.',
    'Uns oitenta metros de asfalto que saem do portão e vão dar numa estrada vicinal de terra.',
    'Asfalto no meio do mato só existe onde caminhão passa muito e onde caminhão atolando custaria caro.',
    'Alguém pavimentou oitenta metros pra não perder carga no barro.'
  ],
  ef:{flag:'achou_o_portao',
      rep:{eixo:'bom',delta:2,motivo:'Andou quatro quilômetros de cerca e leu o chão'},
      registrar:'Há um portão de serviço com 80 metros de asfalto do lado de fora da cerca.',
      presagio:'Ninguém pavimenta oitenta metros por acaso. É orçamento aprovado.'},
  escolhas:[
    {texto:'Pular a cerca aqui.', vai:'c12_setor7'},
    {texto:'Esperar um caminhão passar.', vai:'c12_esperou_caminhao'},
    {texto:'Voltar à noite pela trilha.', vai:'c12_noite_zona'},
    {texto:'Pedir por escrito o empenho desses oitenta metros.',
     vai:'c12_empenho', cond:d=>typeof Cargos !== 'undefined'
       && (Cargos.tem('comissao') || Cargos.tem('investigador') || Cargos.tem('reporter'))},
    {texto:'Voltar e procurar quem aprovou esse asfalto.', vai:'c12_diretor'}
  ]
},

c12_empenho:{
  texto:[
    'Você não pula a cerca. Você anda de volta os quatro quilômetros, entra na administração da reserva pela porta da frente e pede uma coisa que ninguém nunca pediu ali:',
    d=>fala(d.jogador.nome, 'O empenho do serviço de pavimentação do acesso de serviço. Ano, número e valor.'),
    'A funcionária do balcão pede pra você repetir. Você repete.',
    'Ela some por onze minutos e volta com uma pasta fina e uma expressão que não estava no rosto dela antes.',
    fala('a funcionária da reserva', 'Não tem empenho.'),
    d=>fala(d.jogador.nome, 'Como não tem?'),
    fala('a funcionária da reserva', 'Tem uma nota de doação. O asfalto foi doado.'),
    'Ela vira a pasta pra você. É uma folha só, com um logotipo pequeno no canto superior e um campo de "doador" preenchido a máquina.',
    'O campo diz: SOLICITANTE PREFERE NÃO SE IDENTIFICAR.',
    'Oitenta metros de asfalto de grau industrial, doados por alguém que preferiu não se identificar, dentro de uma reserva federal.'
  ],
  ef:{flag:['sabe_da_doacao_do_asfalto','achou_o_portao'],
      rep:{eixo:'bom', delta:3, motivo:'Pediu o empenho no balcão em vez de pular a cerca', notorio:true},
      npc:{nome:'Funcionária da reserva', opiniao:2, memoria:'Procurou um empenho que não existia e te mostrou a nota de doação.'},
      registrar:'O asfalto do acesso de serviço foi doado por quem "prefere não se identificar".',
      presagio:'Doação anônima a órgão público tem um nome técnico e o nome técnico não é doação.'},
  escolhas:[
    {texto:'"Tem cópia dessa folha?"', vai:'c12_copia_da_folha'},
    {texto:'"Quem recebeu a doação assinou?"', vai:'c12_quem_recebeu'},
    {texto:'Agradecer e voltar pra cerca de noite.', vai:'c12_noite_zona'},
    {texto:'Ir falar com o diretor com isso na mão.', vai:'c12_diretor'}
  ]
},

c12_copia_da_folha:{
  texto:[
    d=>fala(d.jogador.nome, 'Tem cópia dessa folha?'),
    'Ela olha pra pasta, pra você, pra porta da sala do diretor, que está fechada.',
    fala('a funcionária da reserva', 'A copiadora tá quebrada faz três semanas.'),
    'Uma pausa exatamente longa demais.',
    fala('a funcionária da reserva', 'Mas o seu aparelho tem câmera.'),
    'Ela empurra a pasta dois centímetros na sua direção e vai olhar uma coisa muito interessante no outro lado do balcão.',
    'Você fotografa em quatro segundos e devolve a pasta fechada.',
    fala('a funcionária da reserva', 'Eu não vi nada.'),
    d=>fala(d.jogador.nome, 'Não viu mesmo.')
  ],
  ef:{flag:['tem_foto_da_doacao'],
      itens:{'Câmera descartável':0},
      rep:{eixo:'bom', delta:2, motivo:'Saiu da reserva com prova em vez de indignação'},
      npc:{nome:'Funcionária da reserva', opiniao:4, memoria:'Empurrou a pasta dois centímetros e olhou pro outro lado.'},
      registrar:'Você tem foto da nota de doação do asfalto.',
      presagio:'Ela arriscou o emprego por dois centímetros de pasta. Lembre disso quando precisar decidir o que publicar.'},
  escolhas:[
    {texto:'Ir falar com o diretor com a foto na mão.', vai:'c12_diretor'},
    {texto:'Guardar e ir ver o setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_quem_recebeu:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem recebeu a doação assinou?'),
    'Ela vira a folha. No rodapé tem um campo de recebimento com uma rubrica e um carimbo.',
    'A rubrica é de três letras. O carimbo é da direção da reserva.',
    fala('a funcionária da reserva', 'É o diretor.'),
    d=>fala(d.jogador.nome, 'Ele recebeu asfalto de alguém que não quis dizer o nome e assinou.'),
    fala('a funcionária da reserva', 'Ele recebeu, assinou e mandou arquivar em doações diversas, que é a pasta onde vai camiseta de evento e cesta de Natal.'),
    'Ela fecha a pasta.',
    fala('a funcionária da reserva', 'Eu trabalho aqui há nove anos e essa é a única folha dessa pasta que eu já reli.', 'baixo')
  ],
  ef:{flag:['diretor_assinou_a_doacao'],
      rep:{eixo:'bom', delta:2, motivo:'Foi atrás de quem assinou embaixo, não de quem doou em cima'},
      npc:{nome:'Funcionária da reserva', opiniao:3, memoria:'Te disse que releu aquela folha uma vez em nove anos.'},
      registrar:'O diretor da reserva assinou o recebimento do asfalto e mandou arquivar em "doações diversas".'},
  escolhas:[
    {texto:'"Tem cópia dessa folha?"', vai:'c12_copia_da_folha'},
    {texto:'Ir falar com o diretor agora.', vai:'c12_diretor'},
    {texto:'Ir ver o setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_esperou_caminhao:{
  texto:[
    'Você espera cinco horas e quarenta na beira do asfalto, deitad{o|a} no capim, com formiga.',
    'Às três e vinte da manhã, um caminhão baú sai do portão.',
    'Sem placa iluminada, sem logotipo, com a lona amarrada por cima da carroceria porque é baú com sobrecarga.',
    'E o som.',
    'O som que sai daquele baú a três da manhã numa estrada vicinal é a coisa que você vai lembrar deste capítulo daqui a dez anos, e não é grito.',
    'É um som contínuo e baixo de muitas coisas se ajeitando num espaço pequeno.',
    'Você tem três segundos pra decidir.'
  ],
  ef:{flag:'viu_o_caminhao', moral:-10,
      presagio:'Não é grito. Guarde que não é grito.'},
  escolhas:[
    {texto:'Entrar pelo portão aberto.', vai:'c12_setor7'},
    {texto:'Seguir o caminhão.', vai:'c12_seguiu_caminhao_zona'},
    {texto:'Anotar placa, horário e sentido.', vai:'c12_anotou_o_caminhao'},
    {texto:'Ficar. Você não consegue se mexer.', vai:'c12_ficou_parado'}
  ]
},

c12_ficou_parado:{
  texto:[
    'Você não se mexe.',
    'O caminhão passa a vinte metros de você e você fica deitad{o|a} no capim, com formiga no braço, sem fazer absolutamente nada.',
    'Dois minutos depois ele já é uma luz vermelha na curva. Quatro minutos depois não é nada.',
    'Você levanta às quatro e dez da manhã, com o corpo dormente de um lado, e anda de volta pra cidade.',
    'Você não fez nada errado. Não tinha nada que você pudesse fazer com um caminhão em movimento numa estrada vicinal.',
    'E ainda assim você vai carregar esses três segundos por muito tempo, porque "não tinha o que fazer" e "eu não fiz nada" ocupam o mesmo lugar na memória.'
  ],
  ef:{flag:'ficou_parado_no_capim', moral:-15, instabilidade:1,
      registrar:'Viu o caminhão passar e não fez nada.',
      presagio:'"Não tinha o que fazer" e "eu não fiz nada" ocupam o mesmo lugar. Vão ocupar de novo.'},
  escolhas:[
    {texto:'Voltar e entrar pelo portão.', vai:'c12_setor7'},
    {texto:'Ir falar com o diretor de manhã.', vai:'c12_diretor'},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir embora de Fuchsia.', vai:'c12_desistiu_zona'}
  ]
},

c12_anotou_o_caminhao:{
  texto:[
    'Você anota tudo: placa, horário, sentido, modelo, cor da lona e a marca do pneu.',
    'Três e vinte e dois. Sentido norte. Baú branco, lona verde, pneu recauchutado na esquerda traseira, com uma cicatriz de reparo que dá pra reconhecer de longe.',
    'É pouco.',
    'E um dia vai ser exatamente o que faltava pra ligar uma coisa em outra, porque caminhão com pneu recauchutado reparado é caminhão que alguém consertou, e conserto tem nota, e nota tem CNPJ.'
  ],
  ef:{flag:['placa_do_caminhao_zona','provas_zona'],
      rep:{eixo:'bom',delta:3,motivo:'Anotou quando não dava pra fazer mais nada'},
      registrar:'Anotou placa, horário e a marca do pneu recauchutado do caminhão do setor 7.',
      presagio:'Conserto tem nota. Nota tem CNPJ. Guarde o pneu.'},
  escolhas:[
    {texto:'Entrar pelo portão.', vai:'c12_setor7'},
    {texto:'Seguir o caminhão a pé enquanto der.', vai:'c12_seguiu_caminhao_zona'},
    {texto:'Voltar pra cidade e falar com o diretor.', vai:'c12_diretor'},
    {texto:'Voltar pra cidade e falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia}
  ]
},

c12_seguiu_caminhao_zona:{
  texto:[
    'Você segue o caminhão por seis quilômetros de estrada vicinal, correndo nos trechos retos e andando nos de curva, até ele parar num posto de combustível fechado às três e quarenta.',
    'Lá, a carga é transferida.',
    'Do baú sem placa pra outro caminhão, e esse segundo tem placa, tem logotipo de transportadora, tem adesivo de rastreamento via satélite, e o motorista assina uma nota fiscal em duas vias apoiada no capô.',
    'É aqui que a coisa deixa de ser crime e vira logística.',
    'A transferência leva quarenta minutos e os dois motoristas conversam sobre futebol e um deles come um sanduíche em pé.',
    'Você fotografa tudo: os dois caminhões, as duas placas, a nota no capô, o rosto de quem assina, o adesivo de rastreamento.',
    'Nove fotos.'
  ],
  ef:{flag:['provas_zona','viu_a_transferencia'],
      rep:{eixo:'bom',delta:4,motivo:'Documentou o ponto exato em que o crime vira logística'},
      moral:-8,
      registrar:'Fotografou a transferência de carga da Zona Safári para transporte legalizado, num posto fechado.',
      presagio:'Quarenta minutos e um sanduíche. É esse o tamanho moral da operação pra quem trabalha nela.'},
  escolhas:[
    {texto:'Voltar e entrar no setor 7.', vai:'c12_setor7'},
    {texto:'Levar as fotos pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Sair de Fuchsia com as fotos.', vai:'c12_fim'}
  ]
},

c12_noite_zona:{
  texto:[
    'A Zona Safári à noite é outra coisa.',
    'Sem guia, sem trilha marcada, sem trinta bolas especiais, sem folheto plastificado.',
    'Nove mil hectares no escuro, com bicho que não te conhece e que aqui, diferente de todo o resto de Kanto, não foi ensinado a ter medo de gente — o que é bonito de dia e é um problema sério de noite.',
    'Faz frio e tem orvalho e o capim molha a calça até o joelho em quarenta metros.',
    d=>d.flags.tem_a_chave_do_nico ? 'A chave do Orin abre o portão de pedestre da trilha três na primeira tentativa, e o portão não range, porque o Orin passa óleo nele.' :
       d.flags.tem_o_mapa_do_nico ? 'O mapa do Orin está no seu bolso, no verso de um folheto plastificado, e ele marcou os três plantões com X e a hora da ronda ao lado.' :
       d.flags.nico_junto ? 'Orin anda na sua frente e conhece cada curva, cada bebedouro e cada mourão. Ele não fala nada o caminho inteiro.' :
       d.flags.guarda_junto ? 'O guarda Kell anda na sua frente, bêbado e absolutamente seguro do caminho, e para duas vezes pra mijar e uma vez pra cuspir.' :
       'Você anda sozinh{o|a}, guiad{o|a} pelo trilho de carrinho, que brilha de leve no escuro porque metal polido brilha de leve no escuro.'
  ],
  ef:{flag:'entrou_de_noite',
      presagio:'Aqui os bichos não foram ensinados a ter medo de gente. Repare no que isso implica.'},
  escolhas:[{texto:'Seguir o trilho até o setor 7.', vai:'c12_setor7'}]
},

c12_setor7:{
  texto:[
    'O setor 7 não é mato.',
    'É uma clareira de três hectares, cercada por dentro com tela de dois metros e meio, com iluminação de obra em quatro postes de refletor e um gerador que você ouve a cem metros.',
    'No centro: um curral.',
    'Não é gaiola. É curral — estrutura de tubo galvanizado, com brete, corredor de contenção, balança de passagem e rampa de embarque.',
    'Exatamente como se faz com gado, porque foi feito por quem faz com gado, porque a firma que instalou é a mesma que instala em fazenda e o catálogo é o mesmo.',
    'Está cheio.',
    'Você tenta contar e desiste na casa dos oitenta.',
    'E o som — o som é a coisa.',
    'Não é pânico. Pânico você reconheceria.',
    'É o som de animal que já se cansou de ter pânico, que é um som mais baixo, mais regular, e infinitamente pior.'
  ],
  ef:{flag:'viu_o_curral', instabilidade:1, moral:-15,
      registrar:'Encontrou o curral do setor 7 da Zona Safári. Mais de oitenta.',
      presagio:'Instalado pela mesma firma que instala em fazenda. Do catálogo. Com nota fiscal.'},
  escolhas:[
    {texto:'Procurar quem está de plantão.', vai:'c12_plantao'},
    {texto:'Fotografar tudo e sair.', vai:'c12_fotografou_zona'},
    {texto:'Destruir o corredor de contenção — sem ele não dá pra embarcar ninguém.', vai:'c12_sabotou'},
    {texto:'Abrir o curral agora.', vai:'c12_abriu_curral'}
  ]
},

c12_plantao:{
  falante:'Sr. Ulric',
  vozes:['N','N','N'],
  texto:[
    'O plantão é um homem só, de setenta e um anos, numa cadeira de plástico encostada no contêiner de ferramentas, com um rádio ligado numa estação de Fuchsia e um copo de café.',
    'Sr. Ulric.',
    'Ele tem catarata num olho e uma lanterna que ele não usa porque ele conhece o terreno melhor com o pé do que com a luz.',
    'Ele te vê a uns quinze metros — porque ele te ouve antes de ver — e não levanta.',
    '"Boa noite."',
    'Você fica parad{o|a}.',
    '"Pode chegar, {moço|moça}. Eu tenho setenta e um anos e uma perna ruim. Se você quiser fazer alguma coisa aqui, você vai fazer."',
    'Ele mexe no rádio pra pegar melhor.',
    '"Senta aí que a cadeira tem duas."'
  ],
  ef:{flag:'conheceu_seu_jorge',
      npc:{nome:'Sr. Ulric', opiniao:1, memoria:'Vigia do setor 7, setenta e um anos, catarata, te convidou para sentar.'},
      presagio:'"A cadeira tem duas." Ele deixou a segunda cadeira ali de propósito.'},
  escolhas:[
    {texto:'Sentar.', vai:'c12_conversa_plantao'},
    {texto:'"Por que tem duas cadeiras?"', vai:'c12_duas_cadeiras'},
    {texto:'Amarrar ele e abrir o curral.', vai:'c12_amarrou'},
    {texto:'Ignorar e abrir o curral.', vai:'c12_abriu_curral'}
  ]
},

c12_duas_cadeiras:{
  texto:[
    '"Por que tem duas cadeiras?"',
    'Ele ri, e a risada dele é boa e velha e vem de longe.',
    '"Porque de vez em quando aparece um."',
    '"Um o quê?"',
    '"Um que nem você." Ele bebe o café. "Uns três por ano, mais ou menos. Uns choram, uns gritam comigo, uns tiram foto, uns querem me bater e desistem porque eu tenho setenta e um anos."',
    '"E você faz o quê?"',
    '"Eu ofereço café."',
    'Ele serve num copo plástico de uma garrafa térmica e estende.',
    '"Eu tô aqui há onze anos, {moço|moça}. Onze anos nessa cadeira, três turnos por semana, das dezoito às seis."',
    '"E nenhum deles conseguiu nada?"',
    '"Um conseguiu."',
    'Ele olha o curral.',
    '"Em noventa e nove. Chamava Beto, trabalhava aqui. Abriu tudo."',
    '"E?"',
    '"E metade voltou porque tava com fome." Ele bebe. "Mas metade não voltou, {moço|moça}."',
    '"Metade não voltou."'
  ],
  ef:{flag:['sabe_do_beto','jorge_conversou'],
      npc:{nome:'Sr. Ulric', opiniao:5, memoria:'Te ofereceu café e contou que metade dos que o Beto soltou em 1999 não voltou.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou em vez de agir'},
      moral:8,
      registrar:'Sr. Ulric: em 1999 metade dos soltos não voltou. Metade conseguiu.',
      presagio:'Metade não voltou. Ele guardou essa metade por onze anos numa cadeira de plástico.'},
  escolhas:[
    {texto:'"Me ajuda a abrir."', vai:'c12_jorge_ajuda'},
    {texto:'"Você me deixaria abrir?"', vai:'c12_conversa_plantao'},
    {texto:'Abrir o curral.', vai:'c12_abriu_curral'},
    {texto:'Fotografar e sair.', vai:'c12_fotografou_zona'}
  ]
},

c12_conversa_plantao:{
  texto:[
    'Você senta na segunda cadeira e ele te dá café sem perguntar se você quer.',
    'É café com muito açúcar, do jeito que se faz café pra passar a noite.',
    'Vocês ficam uns quarenta minutos ali, com o rádio tocando, e ele fala de coisa nenhuma — do time, do preço do gás, da neta que passou em concurso.',
    'Depois, sem mudar o tom, ele fala:',
    '"Você quer abrir."',
    '"Quero."',
    '"E eu não posso deixar, porque eu assino uma folha."',
    'Ele bebe.',
    '"Mas eu vou te falar uma coisa que eu falo pra todo mundo que senta nessa cadeira e que ninguém escuta, porque quando a pessoa senta nessa cadeira ela já decidiu."',
    '"Fala."',
    '"Abrir sem ter pra onde levar é o mesmo que não abrir, e custa mais caro pra eles."',
    '"Eles quem?"',
    '"Eles." Ele aponta o curral com o queixo. "Sair e voltar em três dias com fome é uma coisa que quebra bicho por dentro, {moço|moça}. Eu já vi. O bicho que saiu e voltou não é o mesmo."'
  ],
  ef:{flag:['jorge_conversou','sabe_que_precisa_levar'],
      npc:{nome:'Sr. Ulric', opiniao:4, memoria:'Passou quarenta minutos conversando com você sobre time e preço de gás antes de falar do curral.'},
      rep:{eixo:'bom',delta:3,motivo:'Sentou e ouviu antes de agir'},
      moral:5,
      registrar:'Sr. Ulric: abrir sem ter para onde levar quebra os bichos por dentro.',
      presagio:'"O bicho que saiu e voltou não é o mesmo." Ele viu isso em noventa e nove.'},
  escolhas:[
    {texto:'"Então me ajuda a arrumar pra onde levar."', vai:'c12_jorge_ajuda'},
    {texto:'"Eu tenho caminhão." (se tiver)', vai:'c12_soltura_organizada', cond:d=>!!d.flags.vandir_dirige || !!d.flags.sabe_dos_caminhoes},
    {texto:'Abrir mesmo assim.', vai:'c12_abriu_curral'},
    {texto:'Fotografar e sair.', vai:'c12_fotografou_zona'}
  ]
},

c12_jorge_ajuda:{
  falante:'Sr. Ulric',
  vozes:['P','N','P','N','P','N','N','N','N'],
  texto:[
    '"Então me ajuda a arrumar pra onde levar."',
    'Ele demora muito tempo pra responder, e no meio do tempo ele desliga o rádio, o que é a coisa mais séria que ele faz a noite inteira.',
    '"Os caminhão de soltura tão no galpão de máquinas."',
    '"Eu sei."',
    '"Bateria descarregada."',
    '"Eu sei."',
    '"E a chave do galpão de máquinas tá na chaveira do posto de vigilância, que é aqui, nessa parede atrás de mim, e quem assina a retirada de chave sou eu."',
    'Ele olha a parede.',
    '"Eu assino a retirada de chave há onze anos e ninguém nunca conferiu o livro."',
    'Ele se levanta pela primeira vez, com dificuldade, apoiando na cadeira.',
    '"Eu vou assinar a retirada pro meu nome. E eu vou anotar no livro que eu retirei pra conferência de rotina, que é uma coisa que eu tenho competência pra fazer."',
    '"E o que acontecer depois eu não vi, porque eu tenho catarata."'
  ],
  ef:{flag:['jorge_ajuda','tem_a_chave_dos_caminhoes'],
      itens:{'Chave do galpão de máquinas':1},
      npc:{nome:'Sr. Ulric', opiniao:9, memoria:'Assinou a retirada da chave do galpão de máquinas para você, em nome dele.'},
      rep:{eixo:'bom',delta:6,motivo:'Um vigia de setenta e um anos assinou o próprio nome por você'},
      moral:15,
      registrar:'Sr. Ulric retirou, em nome dele, a chave do galpão dos caminhões de soltura.',
      presagio:'Ele assinou o próprio nome. Onze anos naquela cadeira e ele assinou o próprio nome.'},
  escolhas:[
    {texto:'Buscar os caminhões e organizar a soltura.', vai:'c12_soltura_organizada'},
    {texto:'Chamar o Sr. Zane para dirigir.', vai:'c12_marido', cond:d=>!!d.flags.ninguem_pergunta},
    {texto:'Chamar os guardas do bar.', vai:'c12_bar'},
    {texto:'Abrir agora e resolver o transporte depois.', vai:'c12_abriu_curral'}
  ]
},

c12_amarrou:{
  texto:[
    'Você amarra o Sr. Ulric na cadeira de plástico com a corda do contêiner de ferramentas.',
    'Ele não resiste. Ele tem setenta e um anos e uma perna ruim e ele te avisou disso quinze metros atrás.',
    'Enquanto você amarra, ele fala, com a voz normal:',
    '"Aperta mais o pulso, {moço|moça}."',
    '"O quê?"',
    '"Aperta mais o pulso. Se ficar frouxo demais, eles vão dizer que eu deixei."',
    'Você aperta mais o pulso de um homem de setenta e um anos porque ele pediu, pra ele não perder o emprego.',
    'E ele agradece.',
    'E essa é a coisa mais difícil que aconteceu com você em Fuchsia.'
  ],
  ef:{flag:'amarrou_o_jorge',
      npc:{nome:'Sr. Ulric', opiniao:3, memoria:'Pediu para você apertar mais a corda, para não perderem o emprego dele.'},
      rep:{eixo:'ruim',delta:1,motivo:'Amarrou um velho numa cadeira'},
      moral:-10,
      registrar:'Amarrou o vigia — que pediu para apertar mais, para não ser demitido.',
      presagio:'Ele agradeceu. Pensa nisso com calma depois.'},
  escolhas:[
    {texto:'Abrir o curral.', vai:'c12_abriu_curral'},
    {texto:'Destruir o corredor de contenção.', vai:'c12_sabotou'},
    {texto:'Desamarrar e conversar.', vai:'c12_conversa_plantao'},
    {texto:'Fotografar tudo e sair.', vai:'c12_fotografou_zona'}
  ]
},

/* ─────────────── O QUE FAZER COM OITENTA E SETE ─────────────── */

c12_soltura_organizada:{
  texto:[
    'Leva quatro horas.',
    'Não é uma cena de ação. É uma operação logística feita por gente cansada de madrugada, e é a coisa mais bonita desse capítulo exatamente por isso.',
    'O galpão de máquinas abre com a chave que o Sr. Ulric assinou. Os dois caminhões de soltura estão lá, com pneu vazio e bateria morta e poeira de dois anos.',
    d=>d.flags.plano_de_soltura ? 'O cunhado do guarda mais novo chega às duas e vinte da manhã com uma caminhonete, duas baterias e um compressor, e não pergunta nada, e a única coisa que ele diz a noite inteira é "cabe mais dois de cada lado se você virar o de cima".' :
       'Você e quem estiver com você trocam a bateria de um deles com a bateria do gerador da obra, que é a única bateria de doze volts num raio de dez quilômetros.',
    d=>d.flags.vandir_dirige ? 'O Sr. Zane chega às três com uma camisa social e um mapa na cabeça, e ele dirige o primeiro caminhão, com hérnia e sessenta e sete anos, e ele não erra uma curva.' :
       'Você dirige devagar e mal, e a estrada de serviço ajuda.',
    d=>d.flags.tem_os_vinculos ? 'E você tem doze folhas de caderno escritas por um peão que não escreve bem, e por causa dessas doze folhas o embarque é feito por grupo familiar, e o de orelha rasgada vai no mesmo caminhão que a que manca da pata de trás.' :
       'E o embarque é feito por espécie, porque é o único critério que vocês têm.',
    'Às seis e quarenta da manhã, o curral do setor 7 está vazio e os dois caminhões estão a quarenta e dois quilômetros dali, na borda norte, num ponto de soltura que só existe num mapa de mil novecentos e oitenta e nove.',
    'Oitenta e sete.',
    'Nenhum vai voltar por fome, porque a quarenta e dois quilômetros não dá pra voltar por fome.'
  ],
  ef:{flag:['soltou_organizado','esvaziou_o_setor7'],
      rep:{eixo:'bom',delta:8,motivo:'Esvaziou o setor 7 com caminhão, mapa e grupo familiar'},
      moral:30, hp:-6, causa:'Quatro horas de operação de madrugada',
      instabilidade:1,
      umaVez:'c12_p1', pokemon:{dex:115, nivel:32, opcoes:{moral:50, historia:'Estava no curral do setor 7. Depois da soltura, seguiu o caminhão a pé por seis quilômetros e não quis descer.'}},
      registrar:'Esvaziou o setor 7: 87 soltos a 42 km, por grupo familiar, em caminhão de soltura da própria reserva.',
      presagio:'Ninguém volta por fome a quarenta e dois quilômetros. Foi isso que faltou em noventa e nove.'},
  escolhas:[
    {texto:'Voltar e devolver as chaves ao Sr. Ulric.', vai:'c12_devolveu_a_chave'},
    {texto:'Ir direto ao diretor, de manhã, sem dormir.', vai:'c12_diretor'},
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Sair de Fuchsia antes de amanhecer de vez.', vai:'c12_fim'}
  ]
},

c12_devolveu_a_chave:{
  texto:[
    'Você volta ao posto de vigilância às sete e dez da manhã, quando o turno do Sr. Ulric já acabou, e ele ainda está lá porque ele não foi embora.',
    'Você devolve a chave.',
    'Ele assina a devolução no livro, com data e hora, em letra de quem assina livro há onze anos.',
    'Depois ele fecha o livro e olha o curral vazio por um tempo longo.',
    '"Oitenta e sete?"',
    '"Oitenta e sete."',
    'Ele assente devagar.',
    '"Eu vou ser demitido."',
    '"Você vai."',
    '"Eu tenho setenta e um anos e aposentadoria integral desde os sessenta e cinco, {moço|moça}. Eu trabalho aqui porque eu não sabia o que fazer com o dia."',
    'Ele guarda a caneta no bolso da camisa.',
    '"Agora eu sei."'
  ],
  ef:{flag:'jorge_demitido',
      npc:{nome:'Sr. Ulric', opiniao:10, memoria:'Assinou a devolução da chave às 7h10 e disse que agora sabe o que fazer com o dia.'},
      rep:{eixo:'bom',delta:4,motivo:'Voltou para devolver a chave e encarar quem pagou a conta'},
      moral:20,
      registrar:'Sr. Ulric devolveu a chave no livro e sabe que vai ser demitido.',
      presagio:'"Agora eu sei." Ele esperou onze anos numa cadeira de plástico por essa frase.'},
  escolhas:[
    {texto:'Ir ao diretor.', vai:'c12_diretor'},
    {texto:'Ir ao Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar tudo à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Sair de Fuchsia.', vai:'c12_fim'}
  ]
},

c12_abriu_curral:{
  texto:[
    'Você abre o brete e o corredor de contenção e o portão de manejo, os três, e sai da frente.',
    'Não acontece na hora.',
    'Leva quase dois minutos até o primeiro sair, e o primeiro é um Nidorino, e ele sai andando e não correndo, e para na saída pra cheirar o chão.',
    'Depois é tudo ao mesmo tempo.',
    'Oitenta e sete atravessam três hectares de clareira iluminada por refletor de obra e somem no mato em menos de quatro minutos.',
    'E o silêncio depois é absurdo.',
    d=>d.flags.sabe_que_voltam || d.flags.jorge_conversou
      ? 'E você fica parad{o|a} no meio do curral vazio sabendo o que o Sr. Ulric te disse: que em três dias metade volta, porque é aqui que tem comida, e que o bicho que sai e volta não é o mesmo.'
      : 'Você fica parad{o|a} no meio do curral vazio com a sensação de ter feito a coisa mais certa da sua vida.',
    d=>d.flags.sabe_do_beto ? 'Em noventa e nove um guarda chamado Beto fez exatamente isso, sozinho, às três da manhã. Metade voltou.' : ''
  ],
  ef:{flag:['abriu_o_curral','esvaziou_o_setor7'],
      rep:{eixo:'bom',delta:4,motivo:'Abriu o curral do setor 7'},
      moral:10, instabilidade:2,
      registrar:'Abriu o curral do setor 7. Oitenta e sete saíram.',
      presagio:'Sem transporte, metade volta em três dias. Você ainda tem três dias.'},
  escolhas:[
    {texto:'Arrumar caminhão em três dias antes deles voltarem.', vai:'c12_tres_dias'},
    {texto:'Destruir o corredor de contenção pra não dar pra reembarcar.', vai:'c12_sabotou'},
    {texto:'Fotografar o curral vazio e sair.', vai:'c12_fotografou_zona'},
    {texto:'Ir embora. Você fez o que dava.', vai:'c12_saiu_zona'}
  ]
},

c12_tres_dias:{
  texto:[
    'Você tem três dias e usa os três.',
    'Dia um: você acorda a cidade. Literalmente — você bate na porta do Sr. Zane às seis da manhã, na da Dra. Pia às sete, na do bar dos guardas ao meio-dia quando abre.',
    'Dia dois: os dois caminhões de soltura saem do galpão de máquinas com bateria nova e pneu calibrado, e o cunhado do guarda mais novo cobra o conserto e depois não aceita o dinheiro.',
    'Dia três: vocês voltam ao setor 7 e o curral tem trinta e um dentro.',
    'Trinta e um voltaram por fome, em três dias, exatamente como o Sr. Ulric disse.',
    'E vocês embarcam os trinta e um e levam a quarenta e dois quilômetros, e não é uma vitória, é uma correção.',
    'Os outros cinquenta e seis ninguém sabe.',
    d=>d.flags.tem_os_vinculos ? 'E nas doze folhas de caderno do peão você confere: dos trinta e um que voltaram, dezenove eram filhotes.' : ''
  ],
  ef:{flag:['corrigiu_a_soltura','soltou_organizado'],
      rep:{eixo:'bom',delta:6,motivo:'Voltou e consertou a própria pressa'},
      moral:20, hp:-5, causa:'Três dias sem parar',
      umaVez:'c12_p1', pokemon:{dex:115, nivel:32, opcoes:{moral:45, historia:'Voltou ao curral do setor 7 por fome, em três dias, e da segunda vez foi levad{o} a quarenta e dois quilômetros.'}},
      registrar:'Trinta e um voltaram por fome em três dias e foram levados a 42 km na segunda tentativa.',
      presagio:'Não é vitória, é correção. A maior parte do que se faz de bom é correção.'},
  escolhas:[
    {texto:'Ir ao diretor.', vai:'c12_diretor'},
    {texto:'Ir ao Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar tudo à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Sair de Fuchsia.', vai:'c12_fim'}
  ]
},

c12_sabotou:{
  texto:[
    'Você destrói o corredor de contenção.',
    'É trabalho braçal e leva uma hora e quarenta: você tira os pinos de travamento das seções de tubo com uma marreta encontrada no contêiner, e sem os pinos a estrutura não fica de pé, e sem a estrutura não existe corredor, e sem corredor ninguém embarca oitenta e sete animais em caminhão.',
    'Você também quebra a célula de carga da balança de passagem, que é uma peça pequena e cara, e a marreta resolve.',
    'Isso não solta ninguém.',
    'Isso compra tempo: seis a nove semanas, entre orçamento, licitação e instalação, porque a firma é de fora e a reserva compra por licitação.',
    'Seis a nove semanas é exatamente o tempo de uma reunião extraordinária de conselho, de uma revisão técnica de capacidade de suporte e de quinze dias de férias de um diretor na junta comercial de Celadon.',
    'Você não salvou ninguém hoje.',
    'Você fez caber tudo o que ia acontecer devagar.'
  ],
  ef:{flag:['sabotou_o_curral','comprou_tempo'],
      rep:{eixo:'bom',delta:5,motivo:'Comprou seis a nove semanas com uma marreta'},
      instabilidade:1,
      registrar:'Destruiu o corredor de contenção e a balança: 6 a 9 semanas até nova licitação.',
      presagio:'Você fez caber tudo o que ia acontecer devagar. É a jogada mais madura do capítulo.'},
  escolhas:[
    {texto:'Abrir o curral também.', vai:'c12_abriu_curral'},
    {texto:'Fotografar tudo e sair.', vai:'c12_fotografou_zona'},
    {texto:'Ir ao Koga contar que comprou tempo.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir ao diretor.', vai:'c12_diretor'}
  ]
},

c12_fotografou_zona:{
  texto:[
    'Você fotografa tudo.',
    'O curral cheio com o refletor de obra por cima, em três ângulos. O brete. A balança de passagem com a etiqueta de aferição do Inmetro, válida, em dia. A rampa de embarque. A caixa de brincos numerados. A prancheta pendurada no mourão com a escala da semana.',
    'E o detalhe que vai fazer diferença: a placa de identificação da estrutura, parafusada no tubo do brete, com o nome da firma que instalou e o número da nota de empenho da compra.',
    'Nota de empenho é dinheiro público com número.',
    'Vinte e uma fotos.',
    'Depois você sai sem abrir nada, porque abrir sem ter pra onde levar é o mesmo que não abrir e custa mais caro pra eles — e você ainda vai passar semanas decidindo se essa frase é sabedoria ou covardia.'
  ],
  ef:{flag:['provas_zona','escolha_fria'],
      rep:{eixo:'bom',delta:3,motivo:'Documentou o setor 7 inteiro com número de nota de empenho'},
      moral:-10,
      registrar:'Fotografou o setor 7: 21 fotos, incluindo a placa com a nota de empenho da estrutura.',
      presagio:'Nota de empenho é dinheiro público com número. Guarde o número.'},
  escolhas:[
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Liga.', vai:'c12_liga_zona'},
    {texto:'Vender a rota à Terceira.', vai:'c12_vendeu_zona', cond:d=>['mercenario','foragido'].includes(Historia.via())},
    {texto:'Voltar e abrir o curral mesmo assim.', vai:'c12_abriu_curral'}
  ]
},

c12_saiu_zona:{
  texto:[
    'Você sai do setor 7 no escuro e anda os três quilômetros de volta sem lanterna, porque a lanterna atrai.',
    'Na cidade, às cinco da manhã, a padaria já está com a luz acesa e o cheiro já está na rua, e a dona está sovando massa na bancada da frente e te vê passar pelo vidro.',
    'Ela levanta a mão.',
    'Você levanta a mão de volta.',
    'Cinquenta e dois por cento do orçamento desta cidade vem daquela cerca, e a mulher está sovando massa às cinco da manhã, e ela nunca perguntou pra onde levam, e as duas coisas são verdade ao mesmo tempo e nenhuma delas é culpa dela.'
  ],
  ef:{flag:'saiu_do_setor7', moral:-5,
      presagio:'Ela levantou a mão. Guarde o gesto pra quando você for julgar Fuchsia.'},
  escolhas:[
    {texto:'Ir ao Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir ao diretor.', vai:'c12_diretor'},
    {texto:'Ir à Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Sair de Fuchsia.', vai:'c12_fim'}
  ]
},

c12_entregar:{
  texto:[
    'Você reúne tudo que tem numa mesa de pousada em Fuchsia e olha a pilha.',
    d=>{
      const t=[];
      if (d.flags.tem_as_vias) t.push('cento e doze vias amarelas');
      if (d.flags.tem_a_ficha_tecnica) t.push('a ficha técnica com o timbre do receptor');
      if (d.flags.provou_o_erro) t.push('o anexo com a área de 1971');
      if (d.flags.pasta_do_diretor) t.push('dezenove anos de ofícios');
      if (d.flags.tem_os_vinculos) t.push('doze folhas de vínculos escritas à mão');
      if (d.flags.sabe_da_linha_verde) t.push('o mapa fundiário');
      if (d.flags.ligou_fuchsia_celadon) t.push('a ata da 41ª reunião');
      if (!t.length) return 'Você tem o que viu e mais nada, e o que você viu não é documento.';
      return 'Você tem: ' + t.join(', ') + '.\nÉ mais material do que a Liga juntou sobre a Zona Safári em vinte anos, e você juntou em três dias porque você perguntou às pessoas que estavam ali o tempo todo.';
    }
  ],
  escolhas:[
    {texto:'Levar à Dra. Cordell.', vai:'c12_ivone_zona', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Liga.', vai:'c12_liga_zona'},
    {texto:'Levar à imprensa de Fuchsia.', vai:'c12_imprensa_zona'},
    {texto:'Entregar ao Koga, para a reunião do conselho.', vai:'c12_entregou_koga', cond:d=>!!d.flags.conheceu_koga}
  ]
},

c12_entregou_koga:{
  texto:[
    'Koga recebe a pilha no chão da varanda, senta de pernas cruzadas, e organiza por tipo antes de ler: documento oficial de um lado, documento interno de outro, foto de outro, e as doze folhas de caderno escritas à mão num lugar só delas.',
    'Ele leva duas horas.',
    'Na hora e quarenta ele para nas doze folhas e lê elas três vezes.',
    '"Quem escreveu isso?"',
    '"Um peão do setor 7. Ele não quis dizer o nome."',
    'Koga põe a mão em cima das folhas.',
    '"Isso aqui é a única coisa nessa pilha que o conselho não vai conseguir responder com regimento."',
    '"Por quê?"',
    '"Porque tudo o resto é sobre procedimento e isso aqui é sobre parentesco."',
    'Ele junta tudo e amarra com barbante.',
    '"Reunião extraordinária em onze dias. Eu vou ler as doze folhas em voz alta, inteiras, na frente dos seis, e eu vou levar quarenta minutos, e ninguém vai poder me interromper porque leitura de documento é direito de conselheiro."',
    '"E depois?"',
    '"E depois eu peço o descredenciamento e a votação é nominal."'
  ],
  ef:{flag:['koga_tem_tudo','koga_aliado'],
      npc:{nome:'Koga', opiniao:10, memoria:'Recebeu todo o material e vai ler as doze folhas de vínculos em voz alta na reunião.'},
      rep:{eixo:'bom',delta:6,motivo:'Entregou tudo a quem sabia usar o regimento'},
      moral:15,
      registrar:'Koga vai ler as doze folhas de vínculos em voz alta na reunião extraordinária e pedir votação nominal.',
      presagio:'Votação nominal. Cada um dos seis vai ter que dizer o próprio nome e o próprio voto.'},
  escolhas:[
    {texto:'Ficar em Fuchsia até a reunião.', vai:'c12_ficou_pra_reuniao'},
    {texto:'Ir ao setor 7 hoje à noite mesmo assim.', vai:'c12_noite_zona'},
    {texto:'Levar cópia à Dra. Cordell também.', vai:'c12_ivone_zona', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Seguir viagem.', vai:'c12_fim'}
  ]
},

c12_ficou_pra_reuniao:{
  texto:[
    'Você fica onze dias em Fuchsia.',
    'São onze dias chatos e você faz coisa de gente: ajuda a Dra. Pia no quintal, come na padaria, dorme na pousada, e na quarta-feira às duas da tarde você aparece no ginásio porque horário existe pra que as pessoas possam contar com ele.',
    'No décimo primeiro dia tem a reunião.',
    'É numa sala de escola, com cadeira de plástico e ventilador de teto, porque o conselho não tem sede.',
    'Koga lê as doze folhas em voz alta. Leva quarenta e três minutos e ninguém interrompe.',
    'Na parte do "os dois pequenos listrados são irmãos, do mesmo ninho, vieram juntos em abril", uma conselheira sai da sala e volta depois de cinco minutos com o olho vermelho.',
    'A votação é nominal.',
    'Quatro a três pelo descredenciamento.',
    'A que saiu da sala vota a favor.'
  ],
  ef:{flag:['descredenciou','venceu_fuchsia'],
      rep:{eixo:'bom',delta:8,motivo:'Ficou onze dias e viu a votação nominal'},
      moral:30, instabilidade:-2,
      executar:d=>{ return [{tipo:'mundo', texto:'O Armazém Geral 7 de Celadon perdeu o credenciamento como receptor de fauna excedente.'}]; },
      registrar:'O conselho descredenciou o Armazém Geral 7 por quatro votos a três, em votação nominal.',
      presagio:'Quatro a três. Uma pessoa saiu da sala e voltou, e essa pessoa decidiu.'},
  escolhas:[
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Ir agradecer ao Sr. Ulric.', vai:'c12_devolveu_a_chave'},
    {texto:'Ir agradecer à Dra. Pia.', vai:'c12_yara'},
    {texto:'Desafiar o ginásio antes de ir.', vai:'c12_desafio_koga'}
  ]
},

c12_ivone_zona:{
  texto:[
    'A Dra. Cordell chega em Fuchsia de ônibus, como sempre, e como sempre não traz nada além de um caderno e uma câmera.',
    'Ela lê tudo em quatro horas, na mesa da pousada, e a dona da pousada traz café três vezes sem cobrar.',
    'No fim, ela separa a pilha em dois montes.',
    '"Esse monte aqui é matéria."',
    'É o monte pequeno.',
    '"E esse monte grande é o que eu chamo de “insuportável, mas legal”. Não dá reportagem. Dá tristeza."',
    'Ela bate no monte pequeno.',
    '"Esse aqui dá capa."',
    '"O que tem nesse?"',
    d=>d.flags.sabe_da_linha_verde ? '"O mapa fundiário. Quatro fazendas compradas por uma empresa entre noventa e cinco e noventa e sete, exatamente do lado da área que o diretor pede pra ampliar desde oitenta e três."' :
       d.flags.provou_o_erro ? '"A área de referência. Nove mil oitocentos e quarenta hectares num documento que rege uma reserva de nove mil. Isso é erro material em ato administrativo e derruba quinze anos de decisão."' :
       '"O que você trouxe de documento oficial. É pouco e é bom."',
    'Ela fecha o caderno.',
    '"O resto eu publico junto, porque tristeza também informa. Mas a capa é o número."'
  ],
  ef:{flag:['ivone_tem_zona','provas_zona'],
      npc:{nome:'Dra. Cordell', opiniao:8, memoria:'Recebeu o material de Fuchsia e separou o que dá capa do que dá tristeza.'},
      rep:{eixo:'bom',delta:5,motivo:'Entregou a Fuchsia inteira a quem publica'},
      instabilidade:-1,
      registrar:'A Dra. Cordell recebeu o material da Zona Safári.',
      presagio:'"Tristeza também informa. Mas a capa é o número." Anote como se faz.'},
  escolhas:[
    {texto:'Ficar até a reunião do conselho.', vai:'c12_ficou_pra_reuniao', cond:d=>!!d.flags.koga_convoca || !!d.flags.koga_descredencia},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Levar cópia à Liga também.', vai:'c12_liga_zona'}
  ]
},

c12_liga_zona:{
  falante:'a oficial da Liga',
  vozes:['N','P','N','N','N','P','N'],
  texto:[
    'O posto da Liga mais próximo fica em Fuchsia mesmo, numa sala do prédio da prefeitura, e é uma mesa e um armário.',
    'O oficial é uma mulher de uns trinta e cinco anos que atende a região inteira sozinha.',
    'Ela lê tudo com atenção real, faz anotação, pede para você repetir duas coisas, e no fim ela fala a verdade, que é o melhor e o pior que ela podia fazer:',
    '"Zona Safári é área federal com gestão por conselho autônomo. A Liga não tem competência aqui."',
    '"Nenhuma?"',
    '"Nenhuma sobre manejo. Eu tenho competência sobre captura ilegal por particular, sobre maus-tratos em flagrante, e sobre trânsito de espécime sem guia."',
    'Ela bate na pilha.',
    '"E nada disso aqui é ilegal, e essa é a parte que eu odeio no meu trabalho."',
    'Depois ela olha pros lados numa sala em que não tem mais ninguém.',
    '"Mas trânsito sem guia eu posso fiscalizar. E eu posso montar barreira na vicinal, e eu não preciso de autorização de ninguém pra isso, e a barreira é aleatória por definição."',
    '"Você faria isso?"',
    '"Na quinta de manhã eu não tenho nada marcado."'
  ],
  ef:{flag:['liga_vai_fiscalizar','liga_tem_provas'],
      npc:{nome:'Oficial da Liga (Fuchsia)', opiniao:6, memoria:'Não tem competência sobre manejo, mas vai montar barreira aleatória na vicinal na quinta de manhã.'},
      rep:{eixo:'bom',delta:4,motivo:'Achou a única competência que a Liga tinha e usou ela'},
      registrar:'A Liga vai montar barreira de fiscalização de trânsito na vicinal, quinta de manhã.',
      presagio:'A barreira é aleatória por definição. Quinta de manhã é quando embarca.'},
  escolhas:[
    {texto:'Ficar para ver a barreira na quinta.', vai:'c12_barreira'},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar cópia à Dra. Cordell.', vai:'c12_ivone_zona', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Seguir viagem.', vai:'c12_fim'}
  ]
},

c12_barreira:{
  texto:[
    'Quinta, sete e dez da manhã, quilômetro quatro da estrada vicinal.',
    'Dois cones, uma viatura atravessada e uma oficial da Liga com prancheta.',
    'O caminhão baú encosta às sete e vinte e dois.',
    'Ela pede a guia de trânsito de fauna.',
    'O motorista entrega a nota fiscal.',
    'Ela devolve a nota fiscal e pede a guia de trânsito de fauna.',
    'O motorista entrega a autorização de manejo.',
    'Ela devolve a autorização de manejo e pede a guia de trânsito de fauna, e explica, com paciência de professora, que guia de trânsito de fauna é documento individual por espécime, emitido pelo órgão ambiental, e que ele está transportando oitenta e sete espécimes vivos.',
    'O motorista liga pra alguém.',
    'Às oito e cinquenta chega um advogado de Celadon de carro.',
    'Às onze e quarenta a carga é desembarcada ali mesmo, na beira da estrada, em recinto provisório, por decisão de fiscalização.',
    'E às catorze horas, oitenta e sete animais que iam pra Celadon estão numa área de pastagem cercada no quilômetro quatro, com água, sob custódia da Liga, porque ninguém tem guia pra nenhum deles.',
    'Ninguém nunca teve guia pra nenhum deles.',
    'Quinze anos.'
  ],
  ef:{flag:['barreira_funcionou','esvaziou_o_setor7'],
      rep:{eixo:'bom',delta:8,motivo:'Parou um embarque inteiro com um documento que ninguém nunca pediu'},
      moral:30, instabilidade:-1,
      executar:d=>{ return [{tipo:'liga', texto:'Oitenta e sete espécimes estão sob custódia da Liga por ausência de guia de trânsito.'}]; },
      registrar:'A barreira da Liga parou o embarque: ninguém nunca emitiu guia de trânsito em quinze anos.',
      presagio:'Ninguém nunca pediu o documento. Quinze anos. Foi só pedir.'},
  escolhas:[
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Ficar para a reunião do conselho.', vai:'c12_ficou_pra_reuniao', cond:d=>!!d.flags.koga_convoca || !!d.flags.koga_descredencia},
    {texto:'Contar pro Orin.', vai:'c12_nico', cond:d=>!!d.flags.nico_falou},
    {texto:'Contar pro Sr. Ulric.', vai:'c12_devolveu_a_chave', cond:d=>!!d.flags.conheceu_seu_jorge}
  ]
},

c12_imprensa_zona:{
  falante:'a editora do jornal',
  vozes:['N','P','N','P','N','P','N','N','N'],
  texto:[
    'O jornal de Fuchsia tem três funcionários e sai duas vezes por semana, e fica numa sala com uma impressora do tamanho de um armário.',
    'A editora tem sessenta anos e é dona do jornal e escreve tudo.',
    'Ela lê o material inteiro e depois olha pra você por um tempo.',
    '"Você sabe que cinquenta e dois por cento do orçamento desta cidade vem de lá."',
    '"Sei."',
    '"E que a minha banca vende quatrocentos exemplares e que trezentos deles são comprados por gente que trabalha na reserva ou é casada com quem trabalha."',
    '"Sei."',
    'Ela põe o material na mesa.',
    '"Eu publico."',
    '"Você publica?"',
    '"Eu tenho sessenta anos e esse jornal desde os vinte e sete, e eu já publiquei coisa que fechou porta de comércio nessa cidade."',
    'Ela pega a caneta.',
    '"Mas eu não publico foto de curral. Eu publico o mapa fundiário e a área de setenta e um, porque foto de curral vira briga sobre sentimento, e número vira briga sobre conta."',
    '"E briga sobre conta é a única que a gente ganha em cidade pequena."'
  ],
  ef:{flag:['imprensa_zona','provas_zona'],
      npc:{nome:'Editora do jornal de Fuchsia', opiniao:6, memoria:'Vai publicar o mapa fundiário e a área de 1971, e não a foto do curral.'},
      rep:{eixo:'bom',delta:5,motivo:'Levou a Fuchsia inteira pro jornal da própria Fuchsia'},
      instabilidade:1,
      registrar:'O jornal de Fuchsia vai publicar o mapa fundiário e o erro de área.',
      presagio:'"Briga sobre conta é a única que a gente ganha em cidade pequena." Ela tem trinta e três anos de prática.'},
  escolhas:[
    {texto:'Ficar até sair a edição.', vai:'c12_saiu_a_edicao'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Levar cópia à Dra. Cordell.', vai:'c12_ivone_zona', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Seguir viagem.', vai:'c12_fim'}
  ]
},

c12_saiu_a_edicao:{
  texto:[
    'Sai na quinta.',
    'Manchete de primeira página, corpo setenta e dois, com o mapa fundiário reproduzido em meia página e um quadro comparativo de duas colunas: ÁREA DE REFERÊNCIA — 8.160 ha / ÁREA REAL — 9.000 ha.',
    'O título é: **A CONTA ESTÁ ERRADA DESDE 1985**.',
    'Quatrocentos exemplares.',
    'Na sexta de manhã a padaria está cheia e o assunto é um só, e é um assunto de conta, e as pessoas estão discutindo hectare no balcão da padaria com pão de queijo na mão.',
    'Duas mulheres brigam feio na fila.',
    'Um homem de uns cinquenta anos fica lendo o quadro comparativo por muito tempo e depois dobra o jornal e leva pra casa em vez de deixar no balcão.',
    'Não muda nada nesta semana.',
    'E é a primeira vez em quinze anos que Fuchsia está discutindo o número em voz alta, no balcão de uma padaria, com pão de queijo.'
  ],
  ef:{flag:['fuchsia_discutiu','provas_zona'],
      rep:{eixo:'bom',delta:6,motivo:'Fez uma cidade discutir a própria conta em voz alta'},
      moral:20, instabilidade:1,
      registrar:'O jornal de Fuchsia publicou o erro de área. A cidade discutiu.',
      presagio:'Ele dobrou o jornal e levou pra casa. Guarde esse homem.'},
  escolhas:[
    {texto:'Ficar para a reunião do conselho.', vai:'c12_ficou_pra_reuniao', cond:d=>!!d.flags.koga_convoca || !!d.flags.koga_descredencia},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Ir ao ginásio.', vai:'c12_desafio_koga', cond:d=>!!d.flags.conheceu_koga}
  ]
},

c12_vendeu_zona:{
  texto:[
    'Você vende.',
    'A informação sobre o setor 7 vale porque é operacional: escala de plantão, horário de embarque, rota da vicinal, e o nome do receptor credenciado.',
    'A Terceira paga bem e paga na hora e não faz nenhuma pergunta sobre a sua consciência, o que é uma cortesia profissional.',
    'Três semanas depois, o embarque da Zona Safári passa a sair às quatro e dez em vez de três e vinte, e por outra vicinal, e com escolta.',
    'E o preço por cabeça no destino sobe onze por cento, porque a concorrência descobriu a origem.',
    'Você ganhou dinheiro numa transação em que o outro lado também ganhou.',
    'É assim que funciona quando você vende informação: ninguém perde, menos quem já estava perdendo.'
  ],
  ef:{dinheiro:18000, flag:['vendeu_a_zona','trabalha_para_terceira'],
      rep:{eixo:'ruim',delta:4,motivo:'Vendeu a rota da Zona Safári'},
      moral:-30, instabilidade:1,
      npc:{nome:'A Terceira', opiniao:5, memoria:'Comprou de você a escala, a rota e o horário do setor 7.'},
      registrar:'Vendeu à Terceira a operação inteira do setor 7.',
      presagio:'Ninguém perde, menos quem já estava perdendo. É a definição de mercado.'},
  escolhas:[
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Voltar e abrir o curral mesmo assim.', vai:'c12_noite_zona'},
    {texto:'Devolver o dinheiro.', vai:'c12_devolveu_o_dinheiro'},
    {texto:'Levar cópia à Dra. Cordell assim mesmo.', vai:'c12_ivone_zona', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c12_devolveu_o_dinheiro:{
  falante:'o contato da Terceira',
  vozes:['N','P','N','N','P','N'],
  texto:[
    'Você volta ao contato e devolve os dezoito mil.',
    'Ele conta. Duas vezes. E depois liga pra alguém e fala baixo e desliga.',
    '"Ela disse pra você ficar com o dinheiro."',
    '"Eu não quero."',
    '"Ela disse que sabia que você ia dizer isso e que você fica com o dinheiro do mesmo jeito, porque informação entregue não volta e pagamento recusado não desfaz entrega."',
    'Ele põe o maço na sua mão.',
    '"E ela mandou dizer mais uma coisa."',
    '"O quê?"',
    '"Que agora você sabe exatamente quanto custa, e que isso é mais útil pra você do que pra ela."'
  ],
  ef:{flag:'tentou_devolver',
      rep:{eixo:'bom',delta:1,motivo:'Tentou desfazer o que não desfaz'},
      moral:5,
      npc:{nome:'A Terceira', opiniao:4, memoria:'Recusou receber de volta o pagamento pela rota do setor 7.'},
      registrar:'Tentou devolver o pagamento da Terceira. Ela recusou.',
      presagio:'"Informação entregue não volta." Anota — vale pra tudo daqui pra frente.'},
  escolhas:[
    {texto:'Voltar e abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Levar tudo à Dra. Cordell.', vai:'c12_ivone_zona', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar tudo ao Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Seguir viagem.', vai:'c12_fim'}
  ]
},

c12_desistiu_zona:{
  texto:[
    'Você vai embora de Fuchsia.',
    'Pega o ônibus das seis e vinte e senta na janela do lado esquerdo, que é o lado da cerca.',
    'Trinta e um quilômetros de alambrado passando devagar, com o sol nascendo por cima.',
    'É lindo. Essa é a parte que não deveria ser verdade e é.',
    'Aos vinte minutos de estrada você vê, do outro lado do vidro, uma clareira com refletor de obra apagado e uma estrutura de tubo galvanizado que daqui parece coisa de fazenda.',
    'Aos vinte e dois minutos não dá mais pra ver.'
  ],
  ef:{flag:'desistiu_de_fuchsia', moral:-15,
      rep:{eixo:'ruim',delta:2,motivo:'Foi embora de Fuchsia sem fazer nada'},
      registrar:'Saiu de Fuchsia sem agir.',
      presagio:'Aos vinte e dois minutos não dá mais pra ver. É essa a tecnologia da cerca.'},
  escolhas:[
    {texto:'Descer na próxima parada e voltar.', vai:'c12_fuchsia'},
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Descer e voltar só para falar com o Koga.', vai:'c12_koga'},
    {texto:'Descer e voltar só para falar com a Dra. Pia.', vai:'c12_yara'}
  ]
},

c12_fim:{
  texto:[
    d=>{
      if (d.flags.barreira_funcionou) return 'Oitenta e sete estão numa pastagem cercada no quilômetro quatro, sob custódia, porque uma oficial da Liga pediu um papel que ninguém tinha pedido em quinze anos.';
      if (d.flags.soltou_organizado) return 'Oitenta e sete estão a quarenta e dois quilômetros dali, num ponto de soltura que só existe num mapa de mil novecentos e oitenta e nove, e nenhum vai voltar por fome.';
      if (d.flags.sabotou_o_curral) return 'O corredor de contenção do setor 7 está no chão em seções de tubo, e a licitação de reposição leva seis a nove semanas, e você comprou essas semanas com uma marreta.';
      if (d.flags.abriu_o_curral) return 'O curral do setor 7 está aberto e vazio, e você não sabe quantos vão voltar em três dias, e você vai passar muito tempo sem saber.';
      if (d.flags.provas_zona) return 'Você tem uma pilha de papel que prova que a conta está errada desde oitenta e cinco, e papel demora, e você já aprendeu isso em duas cidades.';
      return 'A cerca continua com trinta e um quilômetros e o curral continua com oitenta e sete dentro.';
    },
    d=>d.flags.descredenciou ? 'E o Armazém Geral 7 de Celadon não é mais receptor credenciado de fauna excedente da Zona Safári, por quatro votos a três, em votação nominal, numa sala de escola com ventilador de teto.' :
       d.flags.koga_convoca || d.flags.koga_descredencia ? 'E em onze dias tem reunião extraordinária de conselho numa sala de escola, e Koga tem um voto e seis telefones.' :
       d.flags.diretor_suspende ? 'E a retirada anual de duzentos e quarenta perdeu base legal às nove da manhã de hoje, por uma revisão técnica que um servidor de trinta e um anos assinou com uma caneta emprestada.' :
       'E o relatório de manejo do ano que vem vai pedir duzentos e noventa, porque a curva sobe.',
    'Você sai de Fuchsia pela estrada do sul, que corta a reserva por cinco quilômetros antes de sair dela.',
    'Nos cinco quilômetros, de dentro do ônibus, você vê mais Pokémon do que viu em todo o resto de Kanto somado.',
    'Um bando de Nidorino na borda do capinzal. Um Kangaskhan com filhote, a uns quarenta metros da pista, que levanta a cabeça quando o ônibus passa e não sai do lugar.',
    'É lindo.',
    'Isso é o que ninguém te prepara pra sentir: é lindo, é bem cuidado, é a maior área protegida de Kanto, e nada disso é mentira.',
    'A próxima coisa no seu mapa é o mar.',
    'Ao sul de Fuchsia tem um arquipélago de quatro ilhas de rocha vulcânica que os pescadores chamam de Ilhas Seafoam, e onde, segundo eles, a água de dentro da caverna está três graus mais fria do que deveria — e está ficando mais fria todo ano.'
  ],
  fim:true, resumo:'Capítulo 12 concluído — a Zona Safári te ensinou que a conta errada mata mais que o crime.'

}

}}

);
