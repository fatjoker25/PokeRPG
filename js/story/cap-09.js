/* ------------------------------------------------------------
   ABERTURAS — Celadon vende. Quem chega com dinheiro, quem
   chega sem, quem chega com nome e quem chega com crachá são
   quatro clientes diferentes, e a cidade sabe disso antes de
   você saber.
   ------------------------------------------------------------ */
const C9_ABERTURAS = ['c9_chegada', 'c9_ab_de_onibus', 'c9_ab_sem_nada', 'c9_ab_seguido', 'c9_ab_de_cracha'];
function c9_cabe(id, d){
  if (id === 'c9_ab_sem_nada')  return d.jogador.dinheiro < 1500;
  if (id === 'c9_ab_seguido')   return Estado.rep.eixo === 'ruim' && Estado.rep.ruim >= 3;
  if (id === 'c9_ab_de_cracha') return typeof Cargos !== 'undefined' && Cargos.lista().length >= 1;
  return true;
}
function c9_abertura(d){
  const cand = C9_ABERTURAS.filter(id => c9_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 9 — A CIDADE QUE COMPRA  (Celadon)
   PONTO DE VIRADA: aqui a sua rota é definida.
   ============================================================ */
CAPITULOS.push(
{
num:9, titulo:'A Cidade que Compra', local:'Celadon', ambiente:'cidade', nivelArea:32,
tom:'muito sombrio', entradas:C9_ABERTURAS,
inicio: d => c9_abertura(d),
cenas:{

c9_ab_de_onibus:{
  texto:[
    'Existe ônibus entre as cidades de Kanto e ninguém te contou isso antes porque ninguém acha que você é o tipo de pessoa que pega ônibus.',
    'Custa duzentos e quarenta, leva uma hora e quarenta, e tem quarenta e dois assentos dos quais trinta e nove estão ocupados por gente indo trabalhar.',
    'Você é a única pessoa do ônibus com um Pokémon no colo, e as pessoas olham do jeito que se olha alguém carregando uma prancha de surfe no metrô.',
    'O ônibus entra em Celadon pela avenida oito e a cidade começa de uma vez: não tem subúrbio, não tem transição. Roça, roça, roça, prédio de doze andares.',
    'Na rodoviária, um painel eletrônico anuncia as saídas e o painel tem um problema: metade das letras não acende, então todos os destinos estão escritos pela metade.',
    'Você fica um minuto e meio olhando o painel tentando ler "VERMILION" a partir de "V RM L O ", e é a coisa mais Celadon que existe: informação completa que chega incompleta.'
  ],
  ef:{dinheiro:-240, flag:'veio_de_onibus', registrar:'Chegou a Celadon de ônibus intermunicipal, por 240 ₽.'},
  escolhas:[
    {texto:'Sair da rodoviária e andar pela cidade.', vai:'c9_cidade'},
    {texto:'Ir direto ao shopping. Sete andares.', vai:'c9_shopping'},
    {texto:'Perguntar no guichê sobre os caminhões de Vermilion.', vai:'c9_ab_o_guiche'}
  ]
},

c9_ab_o_guiche:{
  texto:[
    'O guichê de informações da rodoviária tem uma mulher de uns trinta anos que responde três perguntas por minuto há nove horas.',
    d=>fala(d.jogador.nome, 'Carga de Vermilion descarrega aonde nessa cidade?'),
    'Ela nem pensa. É pergunta de rotina.',
    fala('a mulher do guichê', 'Terminal de carga da avenida dois. Todo mundo descarrega lá.'),
    d=>fala(d.jogador.nome, 'Todo mundo?'),
    fala('a mulher do guichê', 'Todo mundo que tem nota.'),
    'Ela diz isso sem baixar a voz, sem olhar pros lados, sem nada — é uma informação pública e cansada.',
    fala('a mulher do guichê', 'Quem não tem nota descarrega nos fundos do cassino. Isso todo mundo sabe também.'),
    fala('a mulher do guichê', 'Próximo.')
  ],
  ef:{flag:'sabe_do_deposito',
      registrar:'Carga sem nota descarrega nos fundos do cassino de Celadon. É de conhecimento público.',
      presagio:'Quando o crime é de conhecimento público e continua, alguém decidiu que continua.'},
  escolhas:[
    {texto:'Ir procurar onde os caminhões descarregaram.', vai:'c9_procurar'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Andar pela cidade primeiro.', vai:'c9_cidade'}
  ]
},

c9_ab_sem_nada:{
  texto:[
    'Celadon é a pior cidade de Kanto pra se estar sem dinheiro, e ela te informa disso na primeira quadra.',
    'Vitrine, vitrine, vitrine, praça com chafariz, vitrine.',
    d=>`Você tem ${d.jogador.dinheiro} ₽ e tudo que você precisa custa mais do que isso.`,
    'O shopping de sete andares tem ar-condicionado e banheiro limpo e o ar-condicionado e o banheiro limpo são de graça, e você entra pelos dois, e não é a primeira pessoa a fazer isso hoje.',
    'No terceiro andar, na praça de alimentação, tem uma mesa com sete pessoas na sua faixa de idade que claramente também não vieram comprar nada.',
    'Eles abrem espaço sem você pedir.',
    fala('o rapaz de boné', 'Senta. A segurança não incomoda se você for menos de dez.'),
    d=>fala(d.jogador.nome, 'E se for mais de dez?'),
    fala('o rapaz de boné', 'Aí vira ajuntamento. Aí incomoda.')
  ],
  ef:{flag:'a_mesa_do_terceiro_andar',
      registrar:'Sete treinadores sem dinheiro ocupam a praça de alimentação do shopping de Celadon.'},
  escolhas:[
    {texto:'Sentar e ouvir do que eles falam.', vai:'c9_ab_a_mesa'},
    {texto:'Agradecer e subir os sete andares mesmo assim.', vai:'c9_shopping'},
    {texto:'Sair e andar pela cidade.', vai:'c9_cidade'}
  ]
},

c9_ab_a_mesa:{
  texto:[
    'Você senta. Ninguém pergunta o seu nome, o que é a regra da mesa, e leva uns dez minutos pra você entender que a mesa tem regras.',
    'Eles falam sobre: o preço da Poção nessa cidade contra o preço em Saffron. Um ginásio que ninguém consegue marcar. E dinheiro.',
    'Principalmente dinheiro, e principalmente o cassino.',
    fala('a menina de jaqueta', 'Eu entrei três vezes. Nas três eu saí com mais do que entrei.'),
    fala('o rapaz de boné', 'E por que você não tá rica?'),
    fala('a menina de jaqueta', 'Porque na quarta eu saí com menos do que tinha nas três.'),
    'Risada geral, do tipo que só funciona porque é verdade pra todo mundo na mesa.',
    fala('o rapaz de boné', 'Tem uma coisa no cassino, ó.', 'baixo'),
    'A mesa fica quieta, o que quer dizer que essa parte já foi falada antes e é a parte séria.',
    fala('o rapaz de boné', 'Eles trocam ficha por Pokémon. Não é rumor, tem tabela na parede do fundo.'),
    fala('o rapaz de boné', 'E ninguém aqui nunca viu de onde vem os bichos.')
  ],
  ef:{flag:['a_tabela_do_cassino','sabe_do_deposito'],
      registrar:'O cassino de Celadon troca ficha por Pokémon, com tabela na parede do fundo.',
      presagio:'Tabela de preço fixa precisa de fornecimento constante.'},
  escolhas:[
    {texto:'Ir ao cassino agora.', vai:'c9_cassino'},
    {texto:'Ir procurar onde os caminhões descarregaram.', vai:'c9_procurar'},
    {texto:'Subir o shopping primeiro.', vai:'c9_shopping'}
  ]
},

c9_ab_seguido:{
  texto:[
    'Você entra em Celadon às dez e quarenta e às dez e quarenta e três tem alguém atrás de você.',
    'Não é discreto. Não foi feito pra ser discreto: é um homem de camisa polo azul com um rádio na cintura, a quinze metros, replicando cada curva sua.',
    'Você entra numa farmácia. Ele espera na calçada. Você sai, ele anda.',
    'Você atravessa a rua sem motivo. Ele atravessa a rua sem motivo.',
    d=>{
      const r = Estado.nomeRep();
      return `Na quarta quadra ele encosta o rádio na boca e você ouve, de quinze metros, uma palavra: "${r}".`;
    },
    'Não é a polícia. Polícia não usa polo.',
    'É segurança privada, e segurança privada em Celadon trabalha pra loja, o que quer dizer que alguma loja dessa cidade sabe o seu nome e pagou por isso.'
  ],
  ef:{flag:'seguranca_privada_te_seguiu',
      registrar:'Segurança privada te seguiu por quatro quadras em Celadon. Alguma loja pagou por isso.',
      presagio:'Segurança privada não te prende. Ela te acompanha até você sair do quarteirão de quem paga.'},
  escolhas:[
    {texto:'Parar e perguntar pra ele quem paga.', vai:'c9_ab_quem_paga'},
    {texto:'Perder ele no movimento e seguir.', vai:'c9_ab_perdeu'},
    {texto:'Ir direto ao shopping e deixar ele te seguir.', vai:'c9_shopping'}
  ]
},

c9_ab_quem_paga:{
  texto:[
    'Você para no meio da calçada e vira de frente. Ele para também, a quinze metros, e não se aproxima nem recua.',
    'Vocês ficam assim por uns oito segundos, que é muito tempo pra duas pessoas se olharem numa calçada de Celadon.',
    'Aí ele anda até você, sem pressa.',
    fala('o homem de polo azul', 'Boa tarde.'),
    d=>fala(d.jogador.nome, 'Quem te paga?'),
    fala('o homem de polo azul', 'Associação Comercial da Avenida Cinco.'),
    'Ele responde na hora, com orgulho até, porque não tem nada de ilegal nisso e ele sabe.',
    fala('o homem de polo azul', 'Vinte e duas lojas. A gente acompanha quem tá na lista.'),
    d=>fala(d.jogador.nome, 'Que lista?'),
    fala('o homem de polo azul', 'A lista da associação. Chega por fax toda segunda.'),
    fala('o homem de polo azul', 'Não é lista de bandido, moço. É lista de quem a gente acompanha.'),
    'Ele diz isso como se as duas coisas fossem diferentes, e para ele são.'
  ],
  ef:{flag:'a_lista_da_associacao',
      registrar:'A Associação Comercial da Avenida Cinco recebe por fax, toda segunda, uma lista de quem acompanhar.',
      presagio:'Alguém monta essa lista e manda o fax. O fax vem de algum lugar.'},
  escolhas:[
    {texto:'Perguntar de onde vem o fax.', vai:'c9_ab_o_fax'},
    {texto:'Deixar ele pra lá e andar pela cidade.', vai:'c9_cidade'},
    {texto:'Ir ao shopping com ele atrás.', vai:'c9_shopping'}
  ]
},

c9_ab_o_fax:{
  texto:[
    'Ele coça o queixo, e é um gesto sincero de quem nunca pensou nisso.',
    fala('o homem de polo azul', 'Sei lá. Chega na sede.'),
    d=>fala(d.jogador.nome, 'Tem cabeçalho? Tem número no alto?'),
    fala('o homem de polo azul', 'Tem. Tem um número. Eu não sei de quem é.'),
    'Ele olha pro rádio na cintura. Depois pra você. Depois pro rádio de novo.',
    fala('o homem de polo azul', 'Você sabe que eu trabalho aqui há sete anos e ninguém nunca me perguntou isso?'),
    d=>fala(d.jogador.nome, 'Sete anos.'),
    fala('o homem de polo azul', 'Sete anos.'),
    'Ele fica parado na calçada quando você sai andando. Não te segue mais.'
  ],
  ef:{flag:'o_fax_tem_cabecalho', moral:1,
      npc:{nome:'o homem de polo azul', opiniao:1, viuVoce:'Você perguntou de onde vinha o fax. Ele parou de te seguir.'},
      registrar:'O fax da lista tem cabeçalho com número. Ninguém nunca perguntou de quem é.'},
  escolhas:[
    {texto:'Andar pela cidade e entender onde você está.', vai:'c9_cidade'},
    {texto:'Ir procurar onde os caminhões descarregaram.', vai:'c9_procurar'}
  ]
},

c9_ab_perdeu:{
  texto:[
    'Você entra na porta giratória do shopping, dá a volta inteira na giratória e sai de novo pela calçada, no sentido contrário.',
    'É o truque mais velho do mundo e funciona por três segundos, que são os três segundos que ele leva pra olhar pra dentro do shopping e não te achar.',
    'Três segundos é o suficiente pra você entrar na travessa e a travessa dá na feira coberta e a feira coberta dá na avenida sete.',
    'Você sai na avenida sete com o coração acelerado e a certeza inútil de que venceu alguma coisa.',
    'Venceu um homem de polo azul. O fax continua chegando toda segunda.'
  ],
  ef:{flag:'despistou_a_seguranca', registrar:'Despistou a segurança privada na porta giratória do shopping.'},
  escolhas:[
    {texto:'Ir procurar onde os caminhões descarregaram.', vai:'c9_procurar'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Andar pela cidade.', vai:'c9_cidade'}
  ]
},

c9_ab_de_cracha:{
  texto:[
    d=>{
      const c = Cargos.principal();
      return `A Prefeitura de Celadon tem um balcão de protocolo na entrada da cidade, e o rapaz do balcão vê o seu crachá de ${c ? c.nome : 'serviço'} e faz uma coisa que ninguém nunca fez com você: ele levanta.`;
    },
    fala('o rapaz do protocolo', 'Serviço? O senhor quer dar entrada em alguma coisa?'),
    'Ele te chama de senhor. Você tem quinze anos.',
    d=>fala(d.jogador.nome, 'Eu não sei. O que dá pra dar entrada aqui?'),
    fala('o rapaz do protocolo', 'Tudo. Licença, denúncia, pedido de vista, requerimento de informação.'),
    'Ele empurra uma pasta de formulários pela bancada, e a pasta tem quatro centímetros de espessura.',
    fala('o rapaz do protocolo', 'Requerimento de informação é o de cima. Qualquer cidadão pode fazer.'),
    fala('o rapaz do protocolo', 'Mas com crachá eles respondem em quinze dias. Sem crachá eles respondem em noventa.', 'baixo'),
    'Ele diz isso e volta a sentar, e volta a ser um rapaz num balcão.'
  ],
  ef:{flag:'sabe_do_requerimento',
      registrar:'Com crachá, a Prefeitura de Celadon responde requerimento de informação em 15 dias; sem, em 90.'},
  escolhas:[
    {texto:'Requerer as notas de descarga do terminal de carga.', vai:'c9_ab_requereu_carga'},
    {texto:'Requerer a lista de alvarás do cassino.', vai:'c9_ab_requereu_cassino'},
    {texto:'Não dar entrada em nada. Andar pela cidade.', vai:'c9_cidade'}
  ]
},

c9_ab_requereu_carga:{
  texto:[
    'Você preenche o formulário na bancada, com a caneta amarrada por barbante, e é a coisa mais adulta que você já fez.',
    'Campo "objeto do requerimento": você escreve "relação de notas de descarga do terminal de carga da avenida dois, últimos sessenta dias".',
    'O rapaz lê enquanto carimba e o carimbo para no meio do caminho.',
    fala('o rapaz do protocolo', 'Últimos sessenta dias.'),
    d=>fala(d.jogador.nome, 'É.'),
    'Ele carimba. Destaca o canhoto. Entrega.',
    fala('o rapaz do protocolo', 'Protocolo 4.417. Guarda esse papelzinho.'),
    fala('o rapaz do protocolo', 'E, ó — se em quinze dias não responderem, volta aqui e pede o número do processo. Sem o número do processo eles enrolam pra sempre.', 'baixo')
  ],
  ef:{flag:'protocolo_das_notas',
      registrar:'Protocolo 4.417: requerimento das notas de descarga do terminal de carga de Celadon, últimos 60 dias.'},
  escolhas:[
    {texto:'Ir procurar onde os caminhões descarregaram, sem esperar quinze dias.', vai:'c9_procurar'},
    {texto:'Andar pela cidade.', vai:'c9_cidade'}
  ]
},

c9_ab_requereu_cassino:{
  texto:[
    'Campo "objeto do requerimento": "relação de alvarás e atividades licenciadas do estabelecimento da avenida cinco, número 300".',
    'O rapaz lê. Não carimba.',
    fala('o rapaz do protocolo', 'Isso aqui é o cassino.'),
    d=>fala(d.jogador.nome, 'É.'),
    'Ele olha pra porta da sala do chefe dele, que está fechada, e volta a olhar pro formulário.',
    fala('o rapaz do protocolo', 'Eu vou carimbar. É meu dever carimbar.'),
    'Ele carimba. Destaca o canhoto. Entrega. E não solta o papel na hora.',
    fala('o rapaz do protocolo', 'Protocolo 4.418. Em três anos aqui, esse é o segundo pedido que eu recebo sobre esse endereço.', 'baixo'),
    d=>fala(d.jogador.nome, 'E o primeiro?'),
    fala('o rapaz do protocolo', 'Uma repórter. Ano passado.'),
    fala('o rapaz do protocolo', 'Nunca respondeu.')
  ],
  ef:{flag:['protocolo_do_cassino','sabe_do_deposito'],
      registrar:'Protocolo 4.418: alvarás do cassino de Celadon. É o segundo pedido em três anos; o primeiro nunca foi respondido.',
      presagio:'Um requerimento que nunca é respondido também é uma resposta.'},
  escolhas:[
    {texto:'Ir ao cassino ver com os próprios olhos.', vai:'c9_cassino'},
    {texto:'Ir procurar onde os caminhões descarregaram.', vai:'c9_procurar'},
    {texto:'Andar pela cidade.', vai:'c9_cidade'}
  ]
},


c9_chegada:{
  texto:[
    'Celadon é a maior cidade de Kanto e a única que não finge ser outra coisa.',
    'Ela é grande de um jeito diferente de Saffron: Saffron é alta, Celadon é larga. Nove avenidas paralelas, quarteirões de duzentos metros, e em cada esquina alguma coisa aberta.',
    'O shopping tem sete andares e ocupa um quarteirão inteiro. O cassino tem três e ocupa metade de outro. A diferença entre os dois é menos clara do que deveria.',
    'E tem verde. Muito verde — é a cidade mais arborizada que você viu, com canteiro central, praça a cada seis quadras e jardineira em janela de prédio comercial.',
    'Alguém decidiu, faz uns quarenta anos, que essa cidade ia ser bonita. E ela ficou bonita, e continuou vendendo tudo.',
    d=>{
      const r = Estado.nomeRep();
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=5) return `Numa banca de jornal, o seu nome aparece num canto de página três. "${r}", diz alguém no ponto de ônibus, apontando com o queixo. Não é elogio nem ofensa. É constatação.`;
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) return 'Um guarda de shopping fala no rádio quando você entra pela porta giratória. Ele te acompanha a quinze metros pelo térreo inteiro e nunca chega mais perto que isso.';
      return 'Cidade grande tem essa gentileza: ninguém tem tempo de saber quem você é.';
    },
    d=>d.flags.destinacao_saffron || d.flags.sabe_do_deposito
      ? 'Três caminhões de Vermilion descarregaram aqui hoje de manhã. Você sabe que descarregaram. Não sabe onde.'
      : 'Na estrada, na entrada da cidade, passou por você um comboio de três caminhões brancos sem identificação.'
  ],
  ef:{registrar:'Chegou a Celadon.'},
  escolhas:[
    {texto:'Andar pela cidade e entender onde você está.', vai:'c9_cidade'},
    {texto:'Ir ao shopping. Sete andares.', vai:'c9_shopping'},
    {texto:'Procurar onde os caminhões descarregaram.', vai:'c9_procurar'},
    {texto:'Ir ao cassino. Tudo em Celadon passa pelo cassino.', vai:'c9_cassino'}
  ]
},

c9_cidade:{
  texto:[
    'Você anda quatro horas e a cidade não acaba.',
    'Aprende três coisas.',
    'A primeira: Celadon tem dinheiro. Dá pra ver na calçada — é cimento nivelado, com rampa de acessibilidade, e a rampa está inteira.',
    'A segunda: Celadon tem gente sem nada. Eles ficam nos mesmos quarteirões todo dia e ninguém os expulsa, o que é gentileza, e ninguém faz mais nada, o que não é.',
    'A terceira: tem uma quantidade absurda de lugar que compra. Compra ouro, compra Pokégear, compra bicicleta, compra carta, compra garrafa.',
    'E, em duas vitrines diferentes, na mesma avenida, com plaquinha impressa e tudo: COMPRA-SE POKÉMON — AVALIAÇÃO GRÁTIS.'
  ],
  ef:{flag:'viu_as_vitrines',
      executar:d=>{ Mundo.descobrir('loja_celadon'); Mundo.descobrir('achou_loja_celadon'); return []; },
      presagio:'Duas vitrines na mesma avenida, com plaquinha impressa. Ninguém imprime plaquinha para uma coisa que faz escondido.'},
  escolhas:[
    {texto:'Entrar numa das que compram Pokémon.', vai:'c9_compra_se'},
    {texto:'Ir ao shopping.', vai:'c9_shopping'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Procurar onde os caminhões descarregaram.', vai:'c9_procurar'}
  ]
},

c9_compra_se:{
  texto:[
    'É uma loja pequena e limpa, com balcão de vidro, iluminação boa e um homem de camisa polo que te cumprimenta pelo nome do horário.',
    '"Boa tarde. Vender ou avaliar?"',
    'Atrás dele, na parede, um quadro de avisos com a tabela: espécie, faixa de nível, valor. É datilografado, atualizado a caneta na margem, e é a coisa mais fria que você já viu na vida.',
    'Tem uma coluna extra à direita, sem título, com números menores.',
    'Você pergunta o que é a coluna sem título.',
    '"Ah, essa é o valor de lote." Ele não hesita nem meio segundo. "Quando o cliente traz mais de quatro."'
  ],
  ef:{flag:'viu_a_tabela', registrar:'Em Celadon existe tabela de preço por espécie, com coluna de valor de lote.',
      presagio:'Valor de lote. Alguém traz mais de quatro com frequência suficiente pra ter uma coluna.'},
  escolhas:[
    {texto:'"Quem traz mais de quatro?"', vai:'c9_quem_traz'},
    {texto:'"Vocês compram de onde?"', vai:'c9_compram_de_onde'},
    {texto:'Pedir avaliação de um do seu time.', vai:'c9_avaliacao'},
    {texto:'Sair sem dizer nada.', vai:'c9_cidade2'}
  ]
},

c9_quem_traz:{
  texto:[
    '"Quem traz mais de quatro?"',
    'Ele sorri de um jeito profissional e absolutamente vazio.',
    '"Isso é dado de cliente."',
    'Ele arruma alguma coisa que já estava arrumada no balcão de vidro.',
    '"Mas eu vou te dizer o que não é dado de cliente, porque está na porta: a gente só compra com documentação. Registro, procedência, nota."',
    '"E quem traz mais de quatro tem documentação de todos?"',
    '"Tem." Ele olha você nos olhos. "Sempre tem. É por isso que a gente compra."'
  ],
  ef:{flag:'sempre_tem_documentacao',
      presagio:'Sempre tem documentação. Isso não é desculpa dele — é a descrição exata de como a coisa funciona.'},
  escolhas:[
    {texto:'"Vocês compram de onde?"', vai:'c9_compram_de_onde'},
    {texto:'"Quem emite essa documentação?"', vai:'c9_quem_emite'},
    {texto:'Sair.', vai:'c9_cidade2'},
    {texto:'Pedir avaliação de um do seu time.', vai:'c9_avaliacao'}
  ]
},

c9_quem_emite:{
  texto:[
    '"Quem emite essa documentação?"',
    'Aí ele para de arrumar o balcão.',
    '"Depende." Ele pensa em como responder. "Transferência entre particulares, é a Liga. Recolhimento, é a Comissão."',
    '"Recolhimento?"',
    '"Quando um bicho é retirado de um guardião inidôneo." Ele fala isso com a naturalidade de quem repete termo técnico. "Aí ele passa pra custódia e a custódia pode destinar."',
    'Ele encolhe os ombros.',
    '"E destinar às vezes é leilão. Leilão gera nota. Nota é documentação."',
    'Ele volta a arrumar o balcão.',
    '"É tudo muito certinho, moço. É esse o ponto."'
  ],
  ef:{flag:['leilao_de_custodia','sabe_da_comissao'],
      registrar:'Pokémon recolhidos pela Comissão são destinados a leilão, e o leilão gera a nota que legaliza a venda.',
      presagio:'Recolher, destinar, leiloar, emitir nota. O ciclo inteiro é legal e fecha sozinho.'},
  escolhas:[
    {texto:'"Onde é o leilão?"', vai:'c9_onde_e_o_leilao'},
    {texto:'"Vocês compram de onde?"', vai:'c9_compram_de_onde'},
    {texto:'Sair e procurar os caminhões.', vai:'c9_procurar'},
    {texto:'Sair.', vai:'c9_cidade2'}
  ]
},

c9_onde_e_o_leilao:{
  texto:[
    '"Onde é o leilão?"',
    '"Não é aberto."',
    'Ele diz isso sem nenhum constrangimento.',
    '"É por credenciamento. Você precisa de CNPJ, inscrição e habilitação prévia." Ele aponta uma placa na parede que você não tinha visto: um certificado emplacado, com brasão. "A gente tem."',
    'Você chega mais perto do certificado.',
    'É um documento bonito, com papel bom, moldura e vidro.',
    'E no alto, impresso em relevo, um brasão com uma balança.'
  ],
  ef:{flag:['papel_com_brasao','credenciamento_de_leilao'],
      registrar:'A loja de Celadon tem certificado de habilitação para leilão, com brasão de balança, emoldurado na parede.',
      presagio:'Eles emolduram. Emoldurar é o oposto de esconder, e é muito pior.'},
  escolhas:[
    {texto:'"Quando é o próximo?"', vai:'c9_proximo_leilao'},
    {texto:'Fotografar o certificado.', vai:'c9_fotografou_certificado', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Anotar tudo no caderno.', vai:'c9_anotou_certificado', cond:d=>Estado.contaItem('Caderno de campo')>0},
    {texto:'Sair e procurar os caminhões.', vai:'c9_procurar'}
  ]
},

c9_proximo_leilao:{
  texto:[
    '"Quando é o próximo?"',
    'Ele consulta uma agenda de papel, o que é uma coisa que você não esperava.',
    '"Quinta que vem. Mas você não entra."',
    '"E onde é?"',
    '"Isso eu não digo." Ele fecha a agenda. "Não por sigilo. Porque endereço de leilão muda toda vez e chega no terminal do Centro dois dias antes."',
    'Ele apoia as duas mãos no balcão de vidro.',
    '"Olha, eu vou ser honesto com você porque você tem quinze anos e eu tenho um filho dessa idade."',
    '"Se você acha que tem alguma coisa errada nisso, o lugar de reclamar não é aqui. Eu sou lojista. Eu compro com nota."'
  ],
  ef:{flag:['leilao_quinta','sabe_do_leilao'],
      npc:{nome:'Lojista de Celadon', opiniao:2, memoria:'Te explicou o ciclo do leilão e disse que o lugar de reclamar não era a loja dele.'},
      registrar:'Existe leilão de custódia. Quinta que vem. O endereço sai no terminal dois dias antes.',
      presagio:'"O lugar de reclamar não é aqui." Nenhum lugar é aqui. Essa é a engenharia.'},
  escolhas:[
    {texto:'"E qual é o lugar de reclamar?"', vai:'c9_qual_e_o_lugar'},
    {texto:'Fotografar o certificado.', vai:'c9_fotografou_certificado', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Agradecer e sair.', vai:'c9_cidade2'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'}
  ]
},

c9_qual_e_o_lugar:{
  texto:[
    '"E qual é o lugar de reclamar?"',
    'Ele leva um tempo respondendo, e a demora é a parte honesta.',
    '"A Comissão tem reunião aberta."',
    '"Aberta?"',
    '"Art. 27." Ele fala o número de cabeça, o que diz tudo sobre quantas vezes ele já leu aquilo. "Qualquer interessado pode assistir e pedir a palavra."',
    'Ele guarda a agenda.',
    '"Segunda-feira, dez da manhã, Saffron. Eu nunca fui."',
    '"Por quê?"',
    '"Porque eu trabalho segunda de manhã."'
  ],
  ef:{flag:['sabe_da_sala704','art_27'],
      registrar:'A Comissão tem reunião aberta: segunda, 10h, Saffron. Art. 27 — qualquer interessado pode pedir a palavra.',
      presagio:'Qualquer interessado. Segunda, dez da manhã. E todo mundo trabalha segunda de manhã.'},
  escolhas:[
    {texto:'Anotar isso.', vai:'c9_anotou_certificado'},
    {texto:'Fotografar o certificado.', vai:'c9_fotografou_certificado', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Agradecer e sair.', vai:'c9_cidade2'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'}
  ]
},

c9_fotografou_certificado:{
  texto:[
    'Você tira a câmera da mochila e fotografa o certificado emoldurado na parede, de frente, com flash.',
    'O flash estoura na loja inteira.',
    'O lojista olha. Não impede. Não chama ninguém.',
    '"Isso aí é público", ele diz. "Está na parede porque é pra estar na parede."',
    'E ele está certo, e é por isso que funciona: você acabou de fotografar uma coisa que ninguém escondeu, e que ninguém nunca olhou.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Câmera descartável'); return []; },
      flag:['fotografou_o_certificado','papel_com_brasao'],
      rep:{eixo:'bom',delta:2,motivo:'Fotografou o que estava exposto e ninguém via'},
      registrar:'Fotografou o certificado de habilitação de leilão com brasão de balança.',
      presagio:'"Está na parede porque é pra estar na parede." Guarda essa frase. Ela explica toda a Comissão.'},
  escolhas:[
    {texto:'"Quando é o próximo leilão?"', vai:'c9_proximo_leilao'},
    {texto:'Sair e procurar os caminhões.', vai:'c9_procurar'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Ir ao shopping.', vai:'c9_shopping'}
  ]
},

c9_anotou_certificado:{
  texto:[
    'Você tira o caderno e copia o certificado inteiro, palavra por palavra, em pé na loja, apoiado no balcão de vidro.',
    'Leva dezoito minutos. O lojista atende dois clientes nesse tempo e nenhum dos dois repara em você.',
    'No fim você tem: o número do credenciamento, a data de emissão, a validade, o órgão emissor por extenso e o nome de quem assinou.',
    'O nome de quem assinou é H. Ando.'
  ],
  ef:{flag:['papel_com_brasao','sabe_de_renno','copiou_o_certificado'],
      rep:{eixo:'bom',delta:2,motivo:'Copiou um documento inteiro em pé, apoiado num balcão'},
      registrar:'O credenciamento de leilão é assinado por H. Ando.',
      presagio:'H. Ando. Uma inicial e um sobrenome, escritos à caneta no seu caderno.'},
  escolhas:[
    {texto:'"Quem é H. Ando?"', vai:'c9_quem_e_renno'},
    {texto:'"Quando é o próximo leilão?"', vai:'c9_proximo_leilao'},
    {texto:'Sair e procurar os caminhões.', vai:'c9_procurar'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'}
  ]
},

c9_quem_e_renno:{
  texto:[
    '"Quem é H. Ando?"',
    'O lojista olha o certificado como se nunca tivesse lido o nome.',
    '"Presidência."',
    '"Presidência de quê?"',
    '"Da Comissão."',
    'Ele volta pro balcão.',
    '"Eu nunca vi. Eu vi foto uma vez, num informativo."',
    '"E como ela é?"',
    'Ele pensa.',
    '"Parece professora."'
  ],
  ef:{flag:'sabe_de_renno',
      registrar:'H. Ando preside a Comissão. Numa foto de informativo, parece professora.',
      presagio:'Parece professora. Você vai sentar na frente dela.'},
  escolhas:[
    {texto:'Sair e procurar os caminhões.', vai:'c9_procurar'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Ir ao shopping.', vai:'c9_shopping'}
  ]
},

c9_compram_de_onde:{
  texto:[
    '"Vocês compram de onde?"',
    '"De quem traz."',
    'Ele responde com a paciência de quem responde isso oito vezes por dia.',
    '"Treinador que desistiu. Espólio. Transferência de criador que fechou." Ele conta nos dedos. "E leilão."',
    'Ele para no quarto dedo.',
    '"Leilão é a maior parte, na real. Uns setenta por cento."'
  ],
  ef:{flag:'setenta_por_cento',
      registrar:'Setenta por cento do que a loja compra vem de leilão.',
      presagio:'Setenta por cento. Não é mercado paralelo. É o mercado.'},
  escolhas:[
    {texto:'"Quem emite a documentação?"', vai:'c9_quem_emite'},
    {texto:'"Quem traz mais de quatro?"', vai:'c9_quem_traz'},
    {texto:'Pedir avaliação de um do seu time.', vai:'c9_avaliacao'},
    {texto:'Sair.', vai:'c9_cidade2'}
  ]
},

c9_avaliacao:{
  texto:[
    'Você põe uma bola no balcão de vidro sem saber direito por quê.',
    'Ele não pega. Pede licença primeiro, o que é mais educação do que o homem da ponte de Cerulean teve.',
    'Depois avalia: nível, natureza — ele identifica a natureza em quarenta segundos só de olhar o bicho andar no balcão, e você ainda não tinha conseguido —, golpes, condição física.',
    'E diz um número.',
    d=>d.flags.avaliou_o_time ? 'É maior que o da banca de Cerulean. Muito maior. E é pior ouvir.' : 'É mais dinheiro do que você viu junto até hoje, tirando o do navio.',
    '"Não é proposta", ele esclarece. "É avaliação. Você pediu."'
  ],
  ef:{flag:'avaliou_em_celadon',
      executar:d=>{
        const p = d.time[0];
        if (p && !p.naturezaVista){ Estado.revelarNatureza(p, 'o avaliador de Celadon leu em quarenta segundos'); }
        return [];
      },
      presagio:'Ele leu a natureza do seu em quarenta segundos. Você levou semanas.'},
  escolhas:[
    {texto:'"Como você viu a natureza tão rápido?"', vai:'c9_como_viu'},
    {texto:'"Não vou vender."', vai:'c9_nao_vou_vender'},
    {texto:'Vender.', vai:'c9_vendeu_em_celadon', vendaTime:true},
    {texto:'Pegar a bola de volta e sair.', vai:'c9_cidade2'}
  ]
},

c9_como_viu:{
  texto:[
    '"Como você viu a natureza tão rápido?"',
    'Aí ele fica animado de verdade pela primeira vez.',
    '"Ah, isso é ofício. Onze anos."',
    'Ele se debruça no balcão.',
    '"Você olha como ele apoia o peso quando para. Olha se ele vira a cabeça antes ou depois do corpo. Olha quanto tempo ele leva pra desviar o olho de você."',
    'Ele faz um gesto com a mão.',
    '"Não tem mágica. É que ninguém olha."',
    'E aí ele diz a coisa que fica:',
    '"Treinador passa cinco anos com um bicho e não sabe a natureza dele. Eu preciso saber em quarenta segundo porque eu preciso pôr preço."'
  ],
  ef:{flag:'a_licao_do_avaliador',
      rep:{eixo:'bom',delta:1,motivo:'Aprendeu a olhar com quem olha por dinheiro'},
      npc:{nome:'Lojista de Celadon', opiniao:3, memoria:'Te ensinou a ler natureza pela postura. Onze anos de ofício.'},
      executar:d=>{
        const av = [];
        (d.time || []).forEach(p => { if (!p.naturezaVista && Dados.chance(55)) { Estado.revelarNatureza(p, 'a lição do avaliador de Celadon'); av.push({tipo:'natureza', texto:`Você olha o seu ${p.nome} parar e apoiar o peso, e entende: ${p.natureza}.`}); } });
        return av;
      },
      presagio:'Quem precisa pôr preço olha melhor que quem ama. Isso é a coisa mais desconfortável que Celadon vai te ensinar.'},
  escolhas:[
    {texto:'"Não vou vender."', vai:'c9_nao_vou_vender'},
    {texto:'"Obrigado." E sair.', vai:'c9_cidade2'},
    {texto:'"Quem emite a documentação?"', vai:'c9_quem_emite'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'}
  ]
},

c9_nao_vou_vender:{
  texto:[
    '"Não vou vender."',
    '"Claro."',
    'Ele empurra a bola de volta pelo vidro, com dois dedos, sem nenhum ressentimento.',
    '"Noventa por cento de quem pede avaliação não vende. As pessoas querem saber."',
    'Ele limpa a marca dos seus dedos no balcão com uma flanela.',
    '"E aí elas voltam pra casa e olham pro bicho sabendo quanto ele vale, e é isso que estraga."',
    'Ele guarda a flanela.',
    '"Eu não devia ter falado isso. Boa sorte."'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Pediu avaliação e não vendeu'},
      flag:'nao_vendeu_em_celadon',
      presagio:'Agora você sabe quanto ele vale. Isso não desliga.'},
  escolhas:[
    {texto:'Sair.', vai:'c9_cidade2'},
    {texto:'"Como você viu a natureza tão rápido?"', vai:'c9_como_viu'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'}
  ]
},

c9_vendeu_em_celadon:{
  texto:[
    'Ele preenche três campos, carimba, destaca a via, e conta o dinheiro em cima do balcão de vidro.',
    'Leva quatro minutos e é a transação mais limpa e mais educada da sua vida, e é por isso que você vai lembrar dela.',
    'Ele põe a bola numa gaveta forrada de espuma, junto com outras quatro.',
    'Você fica olhando a gaveta fechar.',
    '"Quer o comprovante?" ele pergunta.',
    'Você quer. Ele entrega. Está tudo certinho: espécie, nível, valor, data, assinatura.',
    'É o papel mais bem-feito que você já teve nas mãos.'
  ],
  ef:{moral:-20, flag:'vendeu_em_celadon',
      rep:{eixo:'ruim',delta:1,motivo:'Vendeu um do time numa loja de Celadon'},
      presagio:'Tudo foi educado, documentado e correto. É justamente por isso que vai demorar pra doer.'},
  escolhas:[
    {texto:'Voltar e comprar de volta.', vai:'c9_comprar_de_volta_celadon'},
    {texto:'Sair.', vai:'c9_cidade2'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'}
  ]
},

c9_comprar_de_volta_celadon:{
  texto:[
    'Você volta em dez minutos.',
    'Ele te vê entrar e o rosto dele fica com uma expressão que você não sabe ler.',
    '"Já foi."',
    '"Como já foi?"',
    '"Lote de quinta." Ele abre a gaveta forrada de espuma e ela está vazia. "Passou o carro há seis minutos. Eles passam no fim da tarde."',
    'Ele fecha a gaveta.',
    '"Eu posso te dar o número do lote. Não adianta nada, mas eu posso."',
    'Você anota o número do lote.'
  ],
  ef:{flag:'numero_do_lote',
      registrar:'Vendeu em Celadon e não conseguiu comprar de volta. Tem o número do lote.',
      presagio:'Seis minutos. Você anotou o número de um lote que leva alguém que era seu.'},
  escolhas:[
    {texto:'Perguntar pra onde vai o lote.', vai:'c9_pra_onde_vai_o_lote'},
    {texto:'Sair.', vai:'c9_cidade2'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'}
  ]
},

c9_pra_onde_vai_o_lote:{
  texto:[
    '"Pra onde vai o lote?"',
    '"Depósito de consolidação."',
    'Ele fala isso e depois se corrige, mais baixo:',
    '"Atrás do cassino. Rua de serviço, portão azul."',
    'Ele olha pra porta da loja.',
    '"Eu não te falei isso e eu vou negar."'
  ],
  ef:{flag:'sabe_do_deposito',
      registrar:'O depósito de consolidação fica atrás do cassino: rua de serviço, portão azul.',
      npc:{nome:'Lojista de Celadon', opiniao:3, memoria:'Te deu o endereço do depósito e disse que ia negar.'},
      presagio:'Ele te deu o endereço e disse que ia negar. As duas coisas são verdade e ele vai cumprir as duas.'},
  escolhas:[
    {texto:'Ir ao depósito agora.', vai:'c9_deposito'},
    {texto:'Ir ao cassino primeiro.', vai:'c9_cassino'},
    {texto:'Ir ao shopping.', vai:'c9_shopping'},
    {texto:'Voltar pra rua.', vai:'c9_cidade2'}
  ]
},

c9_cidade2:{
  texto:[
    'A avenida continua sendo a avenida: verde, larga, com gente comprando.',
    'Daqui dá pra ver o shopping de sete andares de um lado e o letreiro do cassino do outro, e os dois estão acesos às quatro da tarde.'
  ],
  escolhas:[
    {texto:'Shopping.', vai:'c9_shopping'},
    {texto:'Cassino.', vai:'c9_cassino'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'},
    {texto:'Resolver uma coisa pendente nessa cidade.', vai:'c9_pendencias'}
  ]
},

/* ─────────────── PENDÊNCIAS: o que você trouxe de trás ─────────────── */

c9_pendencias:{
  texto:[
    'Celadon é a cidade onde as coisas que você carrega encontram onde ser resolvidas.',
    'Você senta num banco de praça e abre a mochila e o caderno, e faz uma coisa que nunca fez: uma lista.'
  ],
  escolhas:[
    {texto:'Revelar o filme da câmera.', vai:'c9_revelar', cond:d=>!!d.flags.fotografou_o_porao || !!d.flags.fotografou_o_certificado},
    {texto:'Procurar a filha da Haruko.', vai:'c9_filha_marta', cond:d=>!!d.flags.a_filha_da_marta},
    {texto:'Ir ao hospital ver o Hideo.', vai:'c9_hospital', cond:d=>!!d.flags.conhece_o_hideo || !!d.flags.salvou_treinador_torre},
    {texto:'Tirar certidão do CNPJ na junta comercial.', vai:'c9_junta', cond:d=>!!d.flags.cnpj_de_saffron || !!d.flags.sabe_do_cartorio}
  ]
},

c9_revelar:{
  texto:[
    'O laboratório fotográfico fica no segundo andar de uma galeria, entre uma chaveiro e uma loja de bijuteria.',
    'O atendente tem uns sessenta anos e uma lupa pendurada no pescoço.',
    '"Vinte e quatro poses. Fica pronto quinta."',
    '"Não tem mais rápido?"',
    '"Tem. Custa o dobro e fica pronto em duas horas." Ele olha a câmera. "E eu revelo na hora, na minha frente, e você fica aqui esperando."',
    'Ele diz isso de um jeito específico.',
    '"Porque tem foto que eu não gosto de deixar dormindo na gaveta."'
  ],
  ef:{flag:'achou_o_laboratorio'},
  escolhas:[
    {texto:'Pagar o dobro e esperar duas horas. (1.200 ₽)', vai:'c9_revelou_rapido', cond:d=>d.jogador.dinheiro>=1200,
     ef:{dinheiro:-1200}},
    {texto:'Deixar pra quinta.', vai:'c9_revelou_quinta'},
    {texto:'"Por que tem foto que o senhor não gosta de deixar dormindo?"', vai:'c9_porque_dormindo'},
    {texto:'Desistir e levar o filme.', vai:'c9_cidade2'}
  ]
},

c9_porque_dormindo:{
  texto:[
    '"Por que tem foto que o senhor não gosta de deixar dormindo?"',
    'Ele levanta a lupa e deixa cair de novo no peito.',
    '"Eu revelo filme há trinta e um anos."',
    'Ele apoia os cotovelos no balcão.',
    '"Eu já revelei acidente, briga, traição e coisa que eu não vou descrever. Isso passa pela minha mão antes de passar pela do dono."',
    'Ele olha a porta da galeria.',
    '"E duas vezes na vida apareceu alguém aqui perguntando por um envelope que ainda não tinha sido retirado."',
    '"E o senhor deu?"',
    '"Uma vez eu dei." Ele mexe na lupa. "Da segunda eu falei que tinha estragado no banho."'
  ],
  ef:{flag:'o_revelador',
      npc:{nome:'Revelador de Celadon', opiniao:3, memoria:'Já disse a alguém que um filme tinha estragado no banho para não entregar.'},
      presagio:'Ele mentiu uma vez por alguém que não conhecia. Isso não aparece em jornal nenhum.'},
  escolhas:[
    {texto:'Pagar o dobro e esperar. (1.200 ₽)', vai:'c9_revelou_rapido', cond:d=>d.jogador.dinheiro>=1200,
     ef:{dinheiro:-1200}},
    {texto:'Deixar pra quinta.', vai:'c9_revelou_quinta'},
    {texto:'Desistir.', vai:'c9_cidade2'}
  ]
},

c9_revelou_rapido:{
  texto:[
    'Duas horas sentado num banquinho de galeria, com cheiro de químico saindo por baixo de uma porta.',
    'Quando ele sai, está com as fotos na mão e não está com a cara de quem revelou foto de festa.',
    'Ele espalha na bancada. Vinte e quatro.',
    d=>d.flags.fotografou_o_porao
      ? 'Três delas prestam de verdade: a etiqueta em close, com o número da guia legível; o furo de ventilação em fileira, com escala; e o corredor inteiro com as caixas ao fundo, o que dá contexto.'
      : 'Duas prestam de verdade: o certificado emoldurado, de frente, com o brasão nítido; e a placa do órgão emissor.',
    '"Isso aqui é prova", ele diz. Não é pergunta.',
    'Ele separa as três e põe num envelope pardo separado.',
    '"Eu vou fazer uma cópia e guardar comigo. Sem cobrar."',
    '"Por quê?"',
    '"Porque prova em um lugar só não é prova. É sorte."'
  ],
  ef:{flag:['tem_as_fotos','papel_com_brasao','copia_com_o_revelador'],
      rep:{eixo:'bom',delta:3,motivo:'Revelou a prova e deixou cópia em outro lugar'},
      npc:{nome:'Revelador de Celadon', opiniao:6, memoria:'Guardou uma cópia das suas fotos sem cobrar. "Prova em um lugar só não é prova."'},
      registrar:'As fotos foram reveladas. Existe uma cópia guardada no laboratório de Celadon.',
      presagio:'Prova em um lugar só é sorte. Tem uma cópia numa gaveta de galeria agora.'},
  escolhas:[
    {texto:'"O senhor guarda por quanto tempo?"', vai:'c9_por_quanto_tempo'},
    {texto:'Agradecer e sair.', vai:'c9_cidade2'},
    {texto:'Ir ao cassino com as fotos.', vai:'c9_cassino'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'}
  ]
},

c9_por_quanto_tempo:{
  texto:[
    '"O senhor guarda por quanto tempo?"',
    '"Até você vir buscar."',
    'Ele fecha o envelope pardo com barbante, daquele jeito de cruzar em oito.',
    '"E se você não vier, fica aí. Eu tenho envelope de mil novecentos e noventa e quatro."',
    'Ele escreve alguma coisa no envelope com lápis.',
    '"Qual o seu nome?"',
    'Você fala. Ele escreve.',
    'É a segunda vez em Kanto que alguém escreve o seu nome num papel e guarda.'
  ],
  ef:{flag:'nome_no_envelope',
      presagio:'A segunda vez. Repara nessas.'},
  escolhas:[
    {texto:'Sair.', vai:'c9_cidade2'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'}
  ]
},

c9_revelou_quinta:{
  texto:[
    'Você deixa o filme e pega o comprovante e volta na quinta.',
    'Na quinta, o envelope está lá, e as fotos estão lá, e está tudo certo.',
    'Mas o atendente te entrega e diz, sem que você pergunte:',
    '"Apareceu um moço perguntando de envelope de garoto de mochila. Ontem."',
    'Ele empurra o envelope pelo balcão.',
    '"Eu falei que não tinha nenhum."'
  ],
  ef:{flag:['tem_as_fotos','papel_com_brasao','quase_perdeu_as_fotos'],
      rep:{eixo:'bom',delta:1,motivo:'Teve sorte e alguém decente do outro lado do balcão'},
      npc:{nome:'Revelador de Celadon', opiniao:5, memoria:'Negou a existência do seu envelope para um homem que veio perguntar.'},
      registrar:'Alguém procurou o seu envelope no laboratório fotográfico. O atendente negou.',
      presagio:'Alguém sabia do filme. Você não contou pra ninguém.'},
  escolhas:[
    {texto:'"Como era o moço?"', vai:'c9_como_era_o_moco'},
    {texto:'Agradecer e sair rápido.', vai:'c9_cidade2'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'}
  ]
},

c9_como_era_o_moco:{
  texto:[
    '"Como era o moço?"',
    '"Educado."',
    'O atendente pensa mais um pouco.',
    '"Terno. Sem gravata. Uns quarenta e poucos."',
    'Ele mexe na lupa.',
    '"E sapato limpo. Isso eu reparei porque tava chovendo."',
    d=>d.flags.sapato_limpo ? 'É a quarta vez que alguém em Kanto te descreve esse sapato.' : 'Você não sabe por que isso te gela.'
  ],
  ef:{flag:'sapato_limpo',
      registrar:'Um homem de terno e sapato limpo procurou o seu envelope em Celadon, num dia de chuva.',
      presagio:'Sapato limpo em dia de chuva. Ele não andou até lá.'},
  escolhas:[
    {texto:'Sair rápido.', vai:'c9_cidade2'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'}
  ]
},

c9_filha_marta:{
  texto:[
    'Você não tem endereço. Tem um primeiro nome, uma idade aproximada e a informação de que ela trabalha em Celadon.',
    'Isso, numa cidade de quatrocentos mil habitantes, é nada.',
    'Você tenta mesmo assim, e leva dois dias, e é a coisa mais idiota e mais teimosa que você faz nessa cidade.',
    'Você acha por acaso: num café do quarto andar do shopping, uma moça de uns vinte e um anos com crachá de funcionária e o mesmo jeito de segurar a caneca que a Haruko tem.',
    'Você fica olhando de longe por quase dez minutos antes de conseguir chegar perto.'
  ],
  ef:{flag:'achou_a_filha'},
  escolhas:[
    {texto:'Chegar e dizer que conhece a mãe dela.', vai:'c9_falou_com_a_filha'},
    {texto:'Não chegar. Isso não é seu.', vai:'c9_nao_chegou'},
    {texto:'Chegar e não falar da mãe. Só olhar se ela está bem.', vai:'c9_so_olhou_a_filha'},
    {texto:'Deixar um bilhete no crachá dela e sair.', vai:'c9_bilhete_filha'}
  ]
},

c9_falou_com_a_filha:{
  texto:[
    '"Eu conheço a sua mãe."',
    'A cara dela fecha antes de você terminar a frase.',
    '"Ela te mandou?"',
    '"Não."',
    '"Ela te mandou."',
    '"Ela não sabe que eu tô aqui. Ela nem sabe que eu ia procurar você."',
    'Ela olha o relógio do café, que é um gesto de quem quer ter pra onde ir.',
    '"Então o que você quer?"',
    'E você percebe, ali, com a pergunta na cara, que você não tem absolutamente nada pra querer. Você só foi.'
  ],
  ef:{npc:{nome:'Filha da Haruko', opiniao:-1, memoria:'Você a procurou em Celadon sem nada pra dizer.'}},
  escolhas:[
    {texto:'"Nada. Desculpa." E sair.', vai:'c9_saiu_do_cafe'},
    {texto:'"O Duque morreu."', vai:'c9_o_duque_morreu', cond:d=>!!d.flags.vaporeon_morreu},
    {texto:'"Ela tá bem. Era só isso."', vai:'c9_ela_ta_bem'},
    {texto:'"A casa dela fica muito grande."', vai:'c9_a_casa_fica_grande'}
  ]
},

c9_o_duque_morreu:{
  texto:[
    '"O Duque morreu."',
    'Ela para.',
    'O rosto dela faz uma coisa complicada e demorada, e ela põe a caneca na mesa com muito cuidado.',
    '"Quando?"',
    'Você fala. Ela faz a conta de quantas semanas atrás foi.',
    '"E ela tá—"',
    'Ela não termina.',
    'Vocês dois ficam ali, com uma mesa de café entre vocês, e é o silêncio mais cheio de coisa que você já participou.',
    'Depois de um tempo ela pergunta, muito baixo: "Ele sofreu?"',
    'E você tem que decidir o que responder, e existe uma resposta verdadeira e existe uma resposta que ajuda.'
  ],
  ef:{flag:'contou_do_duque'},
  escolhas:[
    {texto:'"Não." (não é verdade)', vai:'c9_mentiu_pra_filha',
     ef:{flag:'mentiu_do_duque'}},
    {texto:'"Sofreu. Mas ela ficou com ele o tempo todo."', vai:'c9_verdade_pra_filha',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Disse a verdade da forma menos cruel possível'}}},
    {texto:'"Eu não sei." (é verdade)', vai:'c9_nao_sei_pra_filha'},
    {texto:'Não responder.', vai:'c9_nao_respondeu_filha'}
  ]
},

c9_mentiu_pra_filha:{
  texto:[
    '"Não."',
    'Ela faz que sim várias vezes, rápido, e bebe o café frio.',
    '"Que bom."',
    'Ela repete duas vezes. "Que bom, que bom."',
    'E vai embora oito minutos depois, agradecendo bastante, e volta pro turno dela.',
    'Você fica na mesa do café do quarto andar do shopping de Celadon sabendo uma coisa que ela não sabe, e a coisa é pequena, e é sua agora.'
  ],
  ef:{flag:'a_mentira_pequena', moral:-5,
      presagio:'Você guardou uma coisa pequena e feia por gentileza. Repara em quantas dessas você vai juntar.'},
  escolhas:[
    {texto:'Ir atrás dela e corrigir.', vai:'c9_verdade_pra_filha'},
    {texto:'Deixar como está.', vai:'c9_saiu_do_cafe'},
    {texto:'Ir pro cassino.', vai:'c9_cassino'}
  ]
},

c9_verdade_pra_filha:{
  texto:[
    '"Sofreu. Mas ela ficou com ele o tempo todo."',
    'Ela fecha os olhos.',
    '"O tempo todo?"',
    '"O tempo todo. Ela falava com ele. Falava de coisa boba, tipo que tinha comprado o de peixe e não o de carne."',
    'E aí ela chora num café de shopping às três da tarde, de crachá, e duas pessoas olham e desviam.',
    'Depois ela limpa a cara com guardanapo de papel e diz:',
    '"Ela sempre compra o de sardinha."',
    'E ri. Chorando.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Contou a verdade inteira, com o detalhe que a tornava suportável'},
      flag:'contou_a_verdade_a_filha',
      npc:{nome:'Filha da Haruko', opiniao:6, memoria:'Você contou como o Duque morreu, com o detalhe da sardinha.'},
      presagio:'O detalhe da sardinha foi o que salvou a conversa. Guarda esse método.'},
  escolhas:[
    {texto:'"Liga pra ela."', vai:'c9_liga_pra_ela'},
    {texto:'Ficar em silêncio com ela.', vai:'c9_silencio_no_cafe'},
    {texto:'Se despedir e sair.', vai:'c9_saiu_do_cafe'},
    {texto:'"A casa dela fica muito grande."', vai:'c9_a_casa_fica_grande'}
  ]
},

c9_nao_sei_pra_filha:{
  texto:[
    '"Eu não sei."',
    'Ela te olha.',
    '"Como você não sabe?"',
    '"Porque eu não sei o que um bicho sente." Você fala isso e é a coisa mais honesta que você diz nessa cidade. "Ele parou de respirar devagar e ela tava com a mão nos olhos dele."',
    'Ela absorve isso.',
    '"Tá." Ela faz que sim. "Tá. Isso é melhor do que não. Obrigada por não falar não."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Disse que não sabia em vez de inventar conforto'},
      npc:{nome:'Filha da Haruko', opiniao:5, memoria:'Você disse que não sabia se o Duque sofreu, e ela agradeceu por isso.'}},
  escolhas:[
    {texto:'"Liga pra ela."', vai:'c9_liga_pra_ela'},
    {texto:'Ficar em silêncio.', vai:'c9_silencio_no_cafe'},
    {texto:'Se despedir.', vai:'c9_saiu_do_cafe'}
  ]
},

c9_nao_respondeu_filha:{
  texto:[
    'Você não responde.',
    'E o não responder é uma resposta, e ela entende na hora, e é isso que você queria evitar e não evitou.',
    'Ela faz que sim devagar.',
    '"Tá."',
    'Ela levanta e pega a bandeja e diz obrigada e vai embora, e você fica na mesa.'
  ],
  ef:{npc:{nome:'Filha da Haruko', opiniao:2, memoria:'Você não respondeu se o Duque sofreu, e ela entendeu.'}},
  escolhas:[
    {texto:'Ir atrás e falar.', vai:'c9_verdade_pra_filha'},
    {texto:'Deixar.', vai:'c9_saiu_do_cafe'}
  ]
},

c9_liga_pra_ela:{
  texto:[
    '"Liga pra ela."',
    '"Eu ligo no Natal."',
    '"Liga hoje."',
    'Ela olha a caneca.',
    '"Você tem quinze anos."',
    '"Tenho."',
    '"Então você não sabe como é sair de casa e não conseguir voltar."',
    'E você não diz nada, porque essa é a única frase dessa conversa em que ela está completamente errada e você não vai provar isso discutindo.',
    'Ela pega o Pokégear. Não liga.',
    'Mas guarda no bolso da frente, e não no de trás.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Empurrou uma ligação sem forçar'},
      flag:'a_filha_pensou_em_ligar',
      npc:{nome:'Filha da Haruko', opiniao:4, memoria:'Você mandou ela ligar pra mãe. Ela guardou o Pokégear no bolso da frente.'},
      presagio:'Bolso da frente, não o de trás. É pouco e é um movimento.'},
  escolhas:[
    {texto:'Se despedir.', vai:'c9_saiu_do_cafe'},
    {texto:'Ficar em silêncio com ela.', vai:'c9_silencio_no_cafe'},
    {texto:'"A casa dela fica muito grande."', vai:'c9_a_casa_fica_grande'}
  ]
},

c9_a_casa_fica_grande:{
  texto:[
    '"Ela falou que a casa fica muito grande."',
    'Ela não responde por uns bons quinze segundos.',
    '"Eu sei."',
    'Ela gira a caneca no pires.',
    '"Eu sei porque eu morei nela." Ela olha pra você. "E porque eu saí de lá pra ela não ficar pequena demais pra mim."',
    'Ela levanta.',
    '"As duas coisas são verdade ao mesmo tempo. Ninguém nunca entende isso."',
    'Ela pega a bandeja.',
    '"Fala pra ela que eu tô bem. Não fala que você me viu chorar."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Levou uma frase de uma casa até a outra'},
      flag:'recado_da_filha',
      npc:{nome:'Filha da Haruko', opiniao:5, memoria:'Te pediu pra falar que ela está bem e não contar do choro.'},
      registrar:'A filha da Haruko pediu um recado: que ela está bem.',
      presagio:'Você virou correio entre duas pessoas que se amam e não se falam. Isso vai acontecer de novo.'},
  escolhas:[
    {texto:'"Combinado."', vai:'c9_saiu_do_cafe'},
    {texto:'"Fala você."', vai:'c9_liga_pra_ela'},
    {texto:'Ficar em silêncio.', vai:'c9_silencio_no_cafe'}
  ]
},

c9_silencio_no_cafe:{
  texto:[
    'Vocês dois ficam na mesa do café sem falar nada por uns doze minutos.',
    'O shopping continua em volta: música baixa, gente com sacola, um alarme de loja que dispara e ninguém olha.',
    'Em algum momento ela empurra o prato de pão de queijo pro meio da mesa, e você pega um, e ela pega outro.',
    'É a coisa mais parecida com uma família que essa cidade te ofereceu.'
  ],
  ef:{hp:3, moral:5,
      npc:{nome:'Filha da Haruko', opiniao:4, memoria:'Vocês dividiram um prato de pão de queijo em silêncio no café do shopping.'}},
  escolhas:[
    {texto:'Se despedir.', vai:'c9_saiu_do_cafe'},
    {texto:'"Liga pra ela."', vai:'c9_liga_pra_ela'},
    {texto:'"A casa dela fica muito grande."', vai:'c9_a_casa_fica_grande'}
  ]
},

c9_saiu_do_cafe:{
  texto:[
    'Você sai do café do quarto andar e desce pela escada rolante, quatro andares, olhando o shopping inteiro se abrir embaixo de você.',
    'Sete andares de gente comprando coisa.',
    'E em algum lugar dessa cidade tem um depósito com portão azul.'
  ],
  escolhas:[
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'},
    {texto:'Ir ao quarto andar do shopping.', vai:'c9_shopping'},
    {texto:'Resolver outra pendência.', vai:'c9_pendencias'}
  ]
},

c9_nao_chegou:{
  texto:[
    'Você não chega.',
    'Fica dez minutos olhando uma moça de vinte e um anos tomar café num shopping e depois vai embora.',
    'Não é covardia exatamente. É a percepção, que chega tarde, de que você ia até lá pra resolver uma coisa que não é sua e que talvez não precise ser resolvida.',
    'A Haruko não pediu nada. Ela só mostrou uma foto e não perguntou.',
    'Você desce a escada rolante com uma sensação estranha de ter feito a coisa certa por acidente.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Reconheceu que uma dor não era sua para resolver'},
      flag:'nao_procurou_a_filha',
      presagio:'A Haruko não pediu nada. Repara em quantas vezes você vai resolver o que ninguém pediu.'},
  escolhas:[
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'},
    {texto:'Voltar e chegar nela.', vai:'c9_falou_com_a_filha'},
    {texto:'Resolver outra pendência.', vai:'c9_pendencias'}
  ]
},

c9_so_olhou_a_filha:{
  texto:[
    'Você chega, pede um café que você não vai beber, e senta na mesa do lado.',
    'Fica quarenta minutos.',
    'Ela ri duas vezes com uma colega. Come um pão de queijo inteiro. Atende uma ligação e a ligação é de trabalho e ela resolve com competência e paciência.',
    'Ela está bem.',
    'Você paga o café que não bebeu e vai embora sem falar com ela, e escreve no seu caderno uma frase de quatro palavras pra levar pra Rota 25:',
    '"Ela está bem. Sério."'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Foi conferir sem invadir'},
      flag:'recado_da_filha',
      registrar:'Viu a filha da Haruko de longe. Ela está bem.',
      presagio:'Quatro palavras num caderno. É o tipo de coisa que muda um mês de alguém.'},
  escolhas:[
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'},
    {texto:'Voltar e falar com ela mesmo assim.', vai:'c9_falou_com_a_filha'},
    {texto:'Resolver outra pendência.', vai:'c9_pendencias'}
  ]
},

c9_bilhete_filha:{
  texto:[
    'Você escreve num guardanapo e deixa em cima da mesa dela quando ela vai ao balcão.',
    '"Sua mãe está bem. Não é urgência. Só isso."',
    'E vai embora sem assinar.',
    'Do outro lado do vidro da praça de alimentação, você vê ela voltar, ler, olhar em volta, ler de novo, e ficar segurando o guardanapo por muito mais tempo do que um guardanapo merece.',
    'Depois ela guarda no bolso do uniforme.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Entregou uma notícia sem cobrar nada por ela'},
      flag:'bilhete_pra_filha',
      presagio:'Ela guardou no bolso do uniforme. Vai achar de novo no fim do turno.'},
  escolhas:[
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Procurar os caminhões.', vai:'c9_procurar'},
    {texto:'Voltar e falar com ela.', vai:'c9_falou_com_a_filha'},
    {texto:'Resolver outra pendência.', vai:'c9_pendencias'}
  ]
},

c9_hospital:{
  texto:[
    'O hospital de Celadon atende metade de Kanto e parece.',
    'Corredor cheio, cadeira de plástico ocupada, gente dormindo em pé.',
    d=>d.flags.conhece_o_hideo
      ? 'Hideo está na ala D, leito 12, e já está sentado, o que é notícia boa.'
      : 'O rapaz que você tirou da Torre de Lavender está na ala D, leito 12. Ele se chama Hideo e você só descobriu o nome pela pulseira.',
    'Ele te vê chegando e demora dois segundos pra te reconhecer, e nos dois segundos você vê ele decidir alguma coisa.',
    '"Cara."'
  ],
  ef:{npc:{nome:'Hideo', opiniao:3, memoria:'Você foi visitar ele no hospital de Celadon.'}},
  escolhas:[
    {texto:'"Como você tá?"', vai:'c9_como_voce_ta'},
    {texto:'Perguntar do Marowak.', vai:'c9_o_marowak_depois'},
    {texto:'Ficar sentado sem falar muito.', vai:'c9_sentou_no_hospital'},
    {texto:'"Eu não sabia o seu nome até agora."', vai:'c9_o_nome_do_hideo'}
  ]
},

c9_como_voce_ta:{
  texto:[
    '"Como você tá?"',
    '"Tô vivo."',
    'Ele diz isso e depois faz uma careta de quem se ouviu falando.',
    '"Desculpa. Isso é resposta de quem tá mal."',
    'Ele endireita na cama.',
    '"Eu tô bem. Sério. Alta na sexta. Aí eu vou ter que arrumar o que fazer, porque eu não vou mais subir torre nenhuma."',
    'Ele olha a janela.',
    '"E eu vou ter que contar pra minha mãe da epilepsia, que eu escondi por três anos."'
  ],
  ef:{flag:'hideo_vai_contar'},
  escolhas:[
    {texto:'"Conta."', vai:'c9_conta_hideo'},
    {texto:'"Por que você escondeu?"', vai:'c9_porque_escondeu'},
    {texto:'Perguntar do Marowak.', vai:'c9_o_marowak_depois'},
    {texto:'Ficar em silêncio.', vai:'c9_sentou_no_hospital'}
  ]
},

c9_porque_escondeu:{
  texto:[
    '"Por que você escondeu?"',
    '"Por causa do laudo."',
    'Ele puxa o lençol.',
    '"Licença de treinador pede declaração de aptidão. E eu tinha dezessete anos e um diagnóstico novo e um médico que falou que eu ia ter que evitar esforço, altitude e privação de sono."',
    'Ele ri sem graça nenhuma.',
    '"Que é a descrição exata de ser treinador."',
    'Ele olha o soro.',
    '"Eu marquei não na pergunta. Levou quatro segundos."'
  ],
  ef:{flag:'o_laudo_do_hideo',
      registrar:'Hideo escondeu a epilepsia no formulário da licença. Levou quatro segundos.',
      presagio:'Quatro segundos numa pergunta de sim ou não, e quatro dias num sexto andar. A distância entre as duas coisas é a história inteira de Kanto.'},
  escolhas:[
    {texto:'"E se a pergunta não existisse?"', vai:'c9_se_a_pergunta'},
    {texto:'"Conta pra sua mãe."', vai:'c9_conta_hideo'},
    {texto:'Perguntar do Marowak.', vai:'c9_o_marowak_depois'},
    {texto:'Ficar em silêncio.', vai:'c9_sentou_no_hospital'}
  ]
},

c9_se_a_pergunta:{
  texto:[
    '"E se a pergunta não existisse?"',
    'Ele pensa nisso de verdade, por uns bons vinte segundos.',
    '"Aí eu ia ter contado pro meu Marowak treinador que eu tinha isso."',
    'Ele corrige:',
    '"Digo, pro pessoal. Pro Centro Pokémon. Pra quem for."',
    'Ele passa a mão na cara.',
    '"E aí alguém ia saber, e ia perguntar onde eu tava quando eu sumisse, e não ia levar quatro dia."',
    'Ele olha pra você.',
    '"A pergunta não me protegeu de nada, cara. Ela só me fez mentir."'
  ],
  ef:{flag:'a_pergunta_nao_protegeu',
      rep:{eixo:'bom',delta:2,motivo:'Fez alguém entender o próprio caso'},
      npc:{nome:'Hideo', opiniao:6, memoria:'Você o fez perceber que a pergunta do formulário não protegia ninguém, só fazia mentir.'},
      registrar:'"A pergunta não me protegeu de nada. Ela só me fez mentir."',
      presagio:'Uma regra escrita pra proteger que só produz mentira. Você vai reencontrar exatamente isso, com apostas muito maiores.'},
  escolhas:[
    {texto:'"Escreve isso."', vai:'c9_escreve_isso'},
    {texto:'"Conta pra sua mãe."', vai:'c9_conta_hideo'},
    {texto:'Perguntar do Marowak.', vai:'c9_o_marowak_depois'},
    {texto:'Ficar em silêncio.', vai:'c9_sentou_no_hospital'}
  ]
},

c9_escreve_isso:{
  texto:[
    '"Escreve isso."',
    '"Escrever pra quem?"',
    '"Pra Liga. Pra Comissão. Pra alguém."',
    'Ele ri.',
    '"Eu escrevo e cai numa gaveta."',
    '"Cai. E aí tem uma gaveta com isso escrito dentro." Você fala mais alto do que pretendia e a enfermeira olha. "E daqui a dois anos alguém abre a gaveta e tem uma folha assinada por um cara de vinte e dois anos que quase morreu num sexto andar."',
    'Silêncio.',
    '"Traz papel", ele diz.',
    'Você traz papel. Ele escreve por quarenta minutos e a letra dele é horrível e ele não para uma vez.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Fez alguém escrever o próprio caso em vez de engolir'},
      flag:['hideo_escreveu','papel_com_brasao'],
      npc:{nome:'Hideo', opiniao:9, memoria:'Escreveu quarenta minutos de relato por sua causa, num leito de hospital.'},
      registrar:'Hideo escreveu um relato sobre a pergunta da licença e a Torre de Lavender.',
      presagio:'Uma folha assinada por quem quase morreu. Isso é o começo de um processo, e você ainda não sabe disso.'},
  escolhas:[
    {texto:'Pedir uma cópia.', vai:'c9_copia_do_hideo'},
    {texto:'Perguntar do Marowak.', vai:'c9_o_marowak_depois'},
    {texto:'Ficar em silêncio com ele.', vai:'c9_sentou_no_hospital'},
    {texto:'Se despedir e ir ao cassino.', vai:'c9_cassino'}
  ]
},

c9_copia_do_hideo:{
  texto:[
    '"Me dá uma cópia."',
    'Ele olha as folhas.',
    '"Cara, é manuscrito."',
    '"Tem copiadora no térreo. Eu vi."',
    'E você desce, e copia as folhas numa máquina de hospital que custa dois pokedólares a página, e sobe de volta, e ele assina as duas vias e põe a data.',
    'Você sai do hospital de Celadon com um relato assinado de cinco páginas na mochila.',
    'É a primeira prova dessa história que não foi tirada de ninguém. Foi dada.'
  ],
  ef:{flag:['copia_do_hideo','papel_com_brasao'],
      dinheiro:-100,
      rep:{eixo:'bom',delta:2,motivo:'Guardou cópia de um relato voluntário'},
      registrar:'Tem cópia assinada do relato do Hideo, cinco páginas.',
      presagio:'Não foi tirada de ninguém. Foi dada. Essa diferença vai valer tudo.'},
  escolhas:[
    {texto:'Perguntar do Marowak.', vai:'c9_o_marowak_depois'},
    {texto:'Se despedir.', vai:'c9_cidade2'},
    {texto:'Ficar em silêncio com ele.', vai:'c9_sentou_no_hospital'}
  ]
},

c9_conta_hideo:{
  texto:[
    '"Conta pra sua mãe."',
    '"Eu vou."',
    'Ele diz rápido demais.',
    'E depois, mais devagar: "Eu não vou."',
    'Ele passa a mão na cara.',
    '"Ela tem sessenta e um anos e mora sozinha em Saffron e ela ia largar tudo e vir."',
    '"E isso é ruim?"',
    'Ele para.',
    'Fica olhando o soro por um tempo comprido.',
    '"Não sei. Eu passei três anos decidindo que era ruim e eu nunca perguntei pra ela."'
  ],
  ef:{flag:'hideo_nunca_perguntou',
      presagio:'Ele decidiu sozinho, por ela, por três anos. Todo mundo faz isso com alguém.'},
  escolhas:[
    {texto:'"Pergunta."', vai:'c9_pergunta_pra_ela'},
    {texto:'"Por que você escondeu?"', vai:'c9_porque_escondeu'},
    {texto:'Perguntar do Marowak.', vai:'c9_o_marowak_depois'},
    {texto:'Ficar em silêncio.', vai:'c9_sentou_no_hospital'}
  ]
},

c9_pergunta_pra_ela:{
  texto:[
    '"Pergunta."',
    '"Perguntar o quê?"',
    '"Se ela ia querer saber."',
    'Ele abre a boca pra responder e fecha.',
    'Depois de um tempo ele pega o Pokégear da mesinha e fica olhando a tela apagada.',
    '"Se eu perguntar, eu já contei."',
    '"Já."',
    '"É." Ele gira o Pokégear na mão. "É, esse é o truque, né."',
    'Ele não liga na sua frente. Mas quando você sai da ala D e olha pra trás pela janelinha da porta, ele está com o Pokégear no ouvido.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Desmontou uma desculpa de três anos com uma pergunta'},
      flag:'hideo_ligou',
      npc:{nome:'Hideo', opiniao:8, memoria:'Ligou pra mãe por sua causa, três anos depois do diagnóstico.'},
      registrar:'Hideo ligou para a mãe.',
      presagio:'Ele ligou. Você não vai saber como foi.'},
  escolhas:[
    {texto:'"Escreve o que aconteceu com você."', vai:'c9_escreve_isso'},
    {texto:'Perguntar do Marowak.', vai:'c9_o_marowak_depois'},
    {texto:'Ir embora.', vai:'c9_cidade2'},
    {texto:'Ficar em silêncio com ele.', vai:'c9_sentou_no_hospital'}
  ]
},

c9_o_marowak_depois:{
  texto:[
    '"E o Marowak?"',
    d=>{
      if (d.flags.bateu_no_marowak) return 'O rosto dele fica neutro de um jeito treinado.\n"Ele tá se recuperando em Lavender. O zelador cuidou."';
      if (d.flags.acalmou_marowak || d.flags.marowak_desceu) return 'Ele sorri de um jeito que muda a cara inteira dele.\n"Ele tá aqui."';
      return '"Ele tá em Lavender. Eu não vou conseguir buscar ele tão cedo."';
    },
    d=>d.flags.acalmou_marowak || d.flags.marowak_desceu
      ? 'Ele aponta debaixo da cama.\nTem um Marowak deitado embaixo de uma cama de hospital, no chão frio, com o osso atravessado nas patas.\n"A enfermeira deixou. Ela falou que era irregular e deixou."'
      : 'Vocês dois ficam um tempo sem falar nada sobre isso.',
    d=>d.flags.salvou_cubone ? 'Você mostra o Cubone. Ele fica olhando por muito tempo e não diz nada, e depois diz: "Cuida bem dele. Ele já esperou demais."' : ''
  ],
  ef:{flag:'falou_do_marowak'},
  escolhas:[
    {texto:'"Como você tá?"', vai:'c9_como_voce_ta'},
    {texto:'Ficar em silêncio com ele.', vai:'c9_sentou_no_hospital'},
    {texto:'"Escreve o que aconteceu com você."', vai:'c9_escreve_isso'},
    {texto:'Se despedir.', vai:'c9_cidade2'}
  ]
},

c9_o_nome_do_hideo:{
  texto:[
    '"Eu não sabia o seu nome até agora."',
    'Ele ri.',
    '"Eu não sei o seu."',
    'Vocês trocam. Leva quatro segundos e é absurdo que tenha levado tanto tempo.',
    '"Cara", ele diz. "Você me carregou seis andar e a gente não tinha se apresentado."'
  ],
  ef:{npc:{nome:'Hideo', opiniao:4, memoria:'Vocês se apresentaram formalmente num hospital, depois de tudo.'}},
  escolhas:[
    {texto:'"Como você tá?"', vai:'c9_como_voce_ta'},
    {texto:'Perguntar do Marowak.', vai:'c9_o_marowak_depois'},
    {texto:'Ficar em silêncio.', vai:'c9_sentou_no_hospital'},
    {texto:'Se despedir.', vai:'c9_cidade2'}
  ]
},

c9_sentou_no_hospital:{
  texto:[
    'Você senta na cadeira de plástico ao lado do leito 12 e fica.',
    'Duas horas.',
    'Vocês falam muito pouco. Ele cochila duas vezes. Uma enfermeira troca o soro e não pergunta quem você é, porque em hospital ninguém pergunta quem é o que está sentado na cadeira.',
    'Em algum momento ele acorda e diz, sem contexto nenhum: "Quatro dias."',
    'E você diz "é".',
    'E ele dorme de novo.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Passou duas horas numa cadeira de plástico'},
      hp:-1, causa:'Duas horas numa cadeira de hospital',
      npc:{nome:'Hideo', opiniao:7, memoria:'Você passou duas horas sentado na cadeira do leito dele sem precisar.'},
      flag:'ficou_no_hospital',
      presagio:'Em hospital ninguém pergunta quem é o que está sentado na cadeira. Tem gente que passa a vida inteira sem nunca ter ninguém na cadeira.'},
  escolhas:[
    {texto:'"Escreve o que aconteceu com você."', vai:'c9_escreve_isso'},
    {texto:'Ir embora quando ele dormir.', vai:'c9_cidade2'},
    {texto:'Perguntar do Marowak quando ele acordar.', vai:'c9_o_marowak_depois'},
    {texto:'"Conta pra sua mãe."', vai:'c9_conta_hideo'}
  ]
},

c9_junta:{
  texto:[
    'A junta comercial de Celadon fica no terceiro andar de um prédio público com elevador quebrado.',
    'Você sobe a pé, pega senha, e espera uma hora e quarenta.',
    'O balcão é uma moça de uns trinta anos com uma pilha de processo do lado.',
    '"Pois não?"',
    '"Eu queria certidão simplificada de um CNPJ."',
    'Ela olha pra você. Você tem quinze anos e uma mochila de rota.',
    '"Oito pokedólares a página. Você tem o número?"'
  ],
  ef:{flag:'achou_a_junta'},
  escolhas:[
    {texto:'Dar o número e pedir a certidão. (80 ₽)', vai:'c9_certidao', cond:d=>d.jogador.dinheiro>=80,
     ef:{dinheiro:-80}},
    {texto:'"Isso é público mesmo?"', vai:'c9_e_publico'},
    {texto:'Perguntar se dá pra buscar por nome de sócio.', vai:'c9_por_nome'},
    {texto:'Desistir. É burocracia demais.', vai:'c9_cidade2'}
  ]
},

c9_e_publico:{
  texto:[
    '"Isso é público mesmo?"',
    '"É."',
    'Ela responde sem levantar a cabeça.',
    '"Contrato social, alteração, sócio, capital, endereço. Tudo público, tudo com taxa."',
    'Ela carimba alguma coisa.',
    '"A única coisa que a gente não fornece é dado pessoal de pessoa física fora do quadro societário."',
    'Ela levanta a cabeça pela primeira vez.',
    '"E olha, moço: ninguém vem aqui. Eu atendo umas quatro pessoa por dia, e três são contador."'
  ],
  ef:{flag:'ninguem_vem_aqui',
      presagio:'Quatro pessoas por dia, três contadores. O segredo mais bem guardado de Kanto é uma coisa que está aberta das nove às cinco.'},
  escolhas:[
    {texto:'Dar o número e pedir a certidão. (80 ₽)', vai:'c9_certidao', cond:d=>d.jogador.dinheiro>=80,
     ef:{dinheiro:-80}},
    {texto:'Perguntar se dá pra buscar por nome de sócio.', vai:'c9_por_nome'},
    {texto:'Agradecer e sair.', vai:'c9_cidade2'}
  ]
},

c9_por_nome:{
  texto:[
    '"Dá pra buscar por nome de sócio?"',
    'Ela para de carimbar.',
    '"Dá."',
    'Ela gira a tela do computador meio grau, o que é permissão sem ser permissão.',
    '"Você digita o nome e sai todas as empresas em que a pessoa figura."',
    'Ela olha a fila atrás de você, que não existe.',
    '"Qual o nome?"'
  ],
  ef:{flag:'busca_por_nome'},
  escolhas:[
    {texto:'"H. Ando."', vai:'c9_busca_renno', cond:d=>!!d.flags.sabe_de_renno},
    {texto:'"Amano. Doutor alguma coisa Amano."', vai:'c9_busca_sena', cond:d=>!!d.flags.sabe_de_sena},
    {texto:'"Ren."', vai:'c9_busca_adnan', cond:d=>!!d.flags.sabe_do_adnan},
    {texto:'"Eu não tenho nome. Só o número."', vai:'c9_certidao',
     cond:d=>d.jogador.dinheiro>=80, ef:{dinheiro:-80}}
  ]
},

c9_busca_renno:{
  texto:[
    'Ela digita. A busca demora onze segundos numa máquina lenta.',
    'Depois ela vira a tela inteira pra você, o que ela claramente não deveria fazer.',
    'Quatro resultados.',
    'Uma associação sem fins lucrativos, constituída há nove anos.',
    'Uma empresa de consultoria em gestão ambiental, há sete.',
    'Uma holding de participações, há quatro.',
    'E uma empresa de logística e armazenagem, há dois anos e meio — com endereço de depósito em Celadon, rua de serviço, sem número.',
    'A mesma pessoa em todas as quatro.'
  ],
  ef:{flag:['as_quatro_empresas','sabe_do_deposito','papel_com_brasao'],
      rep:{eixo:'bom',delta:3,motivo:'Puxou o fio inteiro numa repartição pública por oitenta pokedólares'},
      registrar:'H. Ando figura em quatro empresas, incluindo uma de logística com depósito em Celadon.',
      presagio:'Associação, consultoria, holding, logística. Nove anos montando isso, uma camada por vez.'},
  escolhas:[
    {texto:'Pedir certidão das quatro. (320 ₽)', vai:'c9_certidao_quatro', cond:d=>d.jogador.dinheiro>=320,
     ef:{dinheiro:-320}},
    {texto:'Pedir só a da logística. (80 ₽)', vai:'c9_certidao', cond:d=>d.jogador.dinheiro>=80,
     ef:{dinheiro:-80}},
    {texto:'Anotar tudo e não pedir nada.', vai:'c9_anotou_junta'},
    {texto:'"Busca o Amano também."', vai:'c9_busca_sena', cond:d=>!!d.flags.sabe_de_sena}
  ]
},

c9_busca_sena:{
  texto:[
    'Ela digita. Onze segundos.',
    'Dois resultados.',
    'Um laboratório de análises clínicas em Cinnabar, com situação cadastral BAIXADA em 1989.',
    'E uma empresa de pesquisa e desenvolvimento em biotecnologia, em Saffron, ATIVA, constituída em 1990.',
    'Ela aponta a tela com a caneta.',
    '"Olha a data."',
    'Baixada em 89. Constituída em 90.',
    '"Isso é comum", ela diz. "É o que a gente chama de sucessão de fato. Fecha aqui e abre ali com outro CNPJ e o mesmo quadro."'
  ],
  ef:{flag:['a_sucessao_de_fato','sabe_de_sena'],
      rep:{eixo:'bom',delta:3,motivo:'Descobriu que o laboratório de Cinnabar nunca fechou de verdade'},
      registrar:'O laboratório de Cinnabar foi baixado em 1989 e reaberto em Saffron em 1990, com o mesmo quadro.',
      presagio:'Não fechou. Mudou de CNPJ. Tem trinta e seis anos de continuidade escondidos numa troca de número.'},
  escolhas:[
    {texto:'Pedir a certidão da de Saffron. (80 ₽)', vai:'c9_certidao', cond:d=>d.jogador.dinheiro>=80,
     ef:{dinheiro:-80}},
    {texto:'"Busca a Ando também."', vai:'c9_busca_renno', cond:d=>!!d.flags.sabe_de_renno},
    {texto:'Anotar tudo.', vai:'c9_anotou_junta'},
    {texto:'"Os dois aparecem na mesma empresa?"', vai:'c9_os_dois_juntos'}
  ]
},

c9_busca_adnan:{
  texto:[
    'Ela digita. Onze segundos.',
    'Um resultado.',
    'Uma associação sem fins lucrativos, constituída há nove anos, em que ele figura como membro do conselho curador.',
    'Ela rola a tela.',
    '"Conselho de onze."',
    'Ela vira a tela um pouco mais.',
    'Os onze nomes estão ali, listados em ordem alfabética, num registro público de acesso livre, com taxa de oito pokedólares a página.',
    'Onze nomes completos, com CPF parcialmente mascarado.'
  ],
  ef:{flag:['os_onze_nomes_da_comissao','papel_com_brasao','sabe_da_comissao'],
      rep:{eixo:'bom',delta:4,motivo:'Encontrou os onze nomes num registro público'},
      registrar:'Os onze nomes do conselho da Comissão estão num registro público, por oito pokedólares a página.',
      presagio:'Os onze nomes. Numa tela de computador velho, num terceiro andar com elevador quebrado.'},
  escolhas:[
    {texto:'Pedir cópia da lista. (80 ₽)', vai:'c9_certidao', cond:d=>d.jogador.dinheiro>=80,
     ef:{dinheiro:-80, flag:'tem_os_onze_nomes'}},
    {texto:'Copiar os onze nomes à mão.', vai:'c9_copiou_os_onze_da_junta'},
    {texto:'"Busca a Ando."', vai:'c9_busca_renno', cond:d=>!!d.flags.sabe_de_renno},
    {texto:'Fechar a tela e ir embora. Isso é grande demais.', vai:'c9_recuou_na_junta'}
  ]
},

c9_os_dois_juntos:{
  texto:[
    '"Os dois aparecem na mesma empresa?"',
    'Ela cruza as buscas, o que leva mais tempo e ela faz mesmo assim.',
    '"Aparecem."',
    'Ela gira a tela.',
    'A associação sem fins lucrativos de nove anos tem os dois no quadro: uma na presidência, o outro no conselho técnico.',
    '"Isso aqui é a mesma gente", ela diz, sem nenhuma emoção, do jeito de quem lê dado o dia inteiro.',
    'E aí ela olha pra você, e a expressão dela muda um pouco.',
    '"Você tem quinze anos."',
    '"Tenho."',
    'Ela imprime sem você pedir. Quatro páginas. Não cobra.'
  ],
  ef:{flag:['papel_com_brasao','tem_os_onze_nomes','a_mesma_gente'],
      rep:{eixo:'bom',delta:4,motivo:'Cruzou os nomes e alguém decidiu ajudar'},
      npc:{nome:'Moça da junta', opiniao:6, memoria:'Cruzou as buscas pra você e imprimiu quatro páginas sem cobrar.'},
      registrar:'A mesma associação tem Ando na presidência e Amano no conselho técnico. Quatro páginas impressas.',
      presagio:'Ela imprimiu sem cobrar. Guarda o rosto dela; você não vai poder protegê-la.'},
  escolhas:[
    {texto:'"Obrigado." E sair.', vai:'c9_saiu_da_junta'},
    {texto:'"A senhora pode ter problema por isso?"', vai:'c9_problema_pra_ela'},
    {texto:'Pedir mais.', vai:'c9_certidao_quatro', cond:d=>d.jogador.dinheiro>=320, ef:{dinheiro:-320}},
    {texto:'"Busca o Ren também."', vai:'c9_busca_adnan', cond:d=>!!d.flags.sabe_do_adnan}
  ]
},

c9_problema_pra_ela:{
  texto:[
    '"A senhora pode ter problema por isso?"',
    'Ela para com as folhas na mão.',
    '"Por imprimir dado público?"',
    'Ela pensa.',
    '"Não."',
    'E aí, mais baixo, guardando o carimbo:',
    '"Mas eu trabalho aqui há seis anos e você é a segunda pessoa que pergunta isso."',
    '"Quem foi a primeira?"',
    '"Uma moça de jaleco." Ela dá de ombros. "Ano retrasado. Ela levou trinta e duas páginas e não voltou mais."',
    d=>d.flags.cartao_ivone ? 'Você sabe exatamente quem é a moça de jaleco.' : 'Você não faz ideia de quem seja.'
  ],
  ef:{flag:'ivone_esteve_na_junta',
      rep:{eixo:'bom',delta:1,motivo:'Se preocupou com quem te ajudou'},
      registrar:'Uma mulher de jaleco levou trinta e duas páginas dessa mesma junta ano retrasado.',
      presagio:'Trinta e duas páginas, e ela não voltou mais. Pergunta pra ela por quê.'},
  escolhas:[
    {texto:'"Obrigado." E sair.', vai:'c9_saiu_da_junta'},
    {texto:'Pedir as mesmas trinta e duas páginas. (320 ₽)', vai:'c9_certidao_quatro',
     cond:d=>d.jogador.dinheiro>=320, ef:{dinheiro:-320}},
    {texto:'"Busca o Ren também."', vai:'c9_busca_adnan', cond:d=>!!d.flags.sabe_do_adnan}
  ]
},

c9_certidao:{
  texto:[
    'Ela imprime. A impressora é matricial e faz um barulho absurdo e leva quase dois minutos.',
    'A certidão sai com picote nas laterais.',
    'Você lê ali mesmo, em pé no balcão.',
    'Razão social. Nome fantasia. Data de constituição. Endereço. Capital social. Atividade econômica principal: armazenagem e depósito de mercadorias.',
    'E o quadro societário, com dois nomes.',
    'O endereço é uma rua de serviço em Celadon, sem número, atrás do quarteirão do cassino.'
  ],
  ef:{flag:['tem_a_certidao','sabe_do_deposito','papel_com_brasao'],
      rep:{eixo:'bom',delta:2,motivo:'Pagou oitenta pokedólares e saiu com um endereço'},
      registrar:'A certidão dá o endereço do depósito: rua de serviço atrás do cassino, sem número.',
      presagio:'Oitenta pokedólares. O endereço que ninguém te daria custou oitenta pokedólares numa repartição com elevador quebrado.'},
  escolhas:[
    {texto:'Ir ao depósito.', vai:'c9_deposito'},
    {texto:'Pedir mais certidões.', vai:'c9_certidao_quatro', cond:d=>d.jogador.dinheiro>=320, ef:{dinheiro:-320}},
    {texto:'Ir ao cassino primeiro.', vai:'c9_cassino'},
    {texto:'Sair e pensar.', vai:'c9_saiu_da_junta'}
  ]
},

c9_certidao_quatro:{
  texto:[
    'A impressora matricial trabalha por onze minutos.',
    'Você sai da junta comercial de Celadon com trinta e duas páginas de picote nas laterais, numa pasta de plástico que a moça te deu de graça porque você não tinha onde pôr.',
    'Lá dentro: quatro razões sociais, quatro endereços, quatro quadros societários e uma sequência de datas que, lida na ordem, conta uma história inteira.',
    'Nove anos atrás: uma associação.',
    'Sete: uma consultoria que presta serviço pra associação.',
    'Quatro: uma holding que passa a controlar as duas.',
    'Dois e meio: uma empresa de logística, com depósito.',
    'Ninguém escondeu nada. Está tudo registrado, com taxa paga e recibo emitido.'
  ],
  ef:{flag:['tem_as_certidoes','sabe_do_deposito','papel_com_brasao','a_mesma_gente'],
      rep:{eixo:'bom',delta:4,motivo:'Montou o organograma inteiro com dinheiro próprio numa repartição'},
      registrar:'Trinta e duas páginas de certidão: a linha do tempo inteira da Comissão, em registro público.',
      presagio:'Ninguém escondeu nada. Ler é o único trabalho que faltava, e ninguém fez.'},
  escolhas:[
    {texto:'Ir ao depósito.', vai:'c9_deposito'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Tirar cópia disso tudo e guardar em outro lugar.', vai:'c9_copia_das_certidoes'},
    {texto:'Sair e sentar pra ler tudo.', vai:'c9_leu_as_certidoes'}
  ]
},

c9_copia_das_certidoes:{
  texto:[
    'Você desce, atravessa a rua, e tira cópia das trinta e duas páginas numa papelaria por dois pokedólares a página.',
    'Sessenta e quatro pokedólares.',
    'Depois volta no laboratório fotográfico da galeria e entrega o maço pro senhor da lupa.',
    '"O senhor guarda isso também?"',
    'Ele olha as trinta e duas páginas de picote.',
    '"O que é?"',
    '"Papel público."',
    'Ele pega. Põe num envelope pardo. Amarra com barbante cruzado em oito.',
    '"Pior pra eles", ele diz, e guarda na gaveta de baixo.'
  ],
  ef:{dinheiro:-64, flag:'copia_com_o_revelador',
      rep:{eixo:'bom',delta:3,motivo:'Guardou cópia em outro lugar antes de precisar'},
      npc:{nome:'Revelador de Celadon', opiniao:5, memoria:'Guardou também as trinta e duas páginas de certidão na gaveta de baixo.'},
      registrar:'Uma cópia das certidões está guardada no laboratório fotográfico de Celadon.',
      presagio:'"Pior pra eles." Um homem de sessenta anos com uma lupa no peito acabou de escolher um lado.'},
  escolhas:[
    {texto:'Ir ao depósito.', vai:'c9_deposito'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Sentar e ler tudo.', vai:'c9_leu_as_certidoes'}
  ]
},

c9_leu_as_certidoes:{
  texto:[
    'Você senta num banco de praça de Celadon e lê trinta e duas páginas de certidão comercial.',
    'Leva três horas e quarenta minutos e é a coisa mais chata que você já fez na vida.',
    'E no meio da página vinte e sete tem uma linha que muda tudo.',
    'É uma alteração contratual de dois anos e meio atrás, e o objeto dela é a inclusão de uma nova atividade econômica secundária na empresa de logística:',
    '"Guarda e conservação de espécimes biológicos vivos, para fins de custódia administrativa."',
    'Você lê três vezes.',
    'Alguém foi num cartório, pagou uma taxa, e registrou oficialmente que a empresa passa a guardar bicho vivo apreendido.',
    'E aí publicou no diário oficial, como manda a lei.'
  ],
  ef:{flag:['a_linha_da_pagina_27','papel_com_brasao'],
      hp:-2, causa:'Três horas e quarenta lendo certidão num banco de praça',
      rep:{eixo:'bom',delta:3,motivo:'Leu trinta e duas páginas até achar a linha'},
      registrar:'Página 27: a empresa registrou oficialmente a guarda de espécimes vivos em custódia administrativa.',
      presagio:'Está publicado no diário oficial. Qualquer um podia ter lido. Você foi o primeiro.'},
  escolhas:[
    {texto:'Ir ao depósito.', vai:'c9_deposito'},
    {texto:'Ir ao cassino com isso na mão.', vai:'c9_cassino'},
    {texto:'Tirar cópia e guardar em outro lugar.', vai:'c9_copia_das_certidoes'},
    {texto:'Ligar pra Dra. Sayo.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c9_anotou_junta:{
  texto:[
    'Você copia tudo no caderno de campo, em pé no balcão, com a moça esperando.',
    'Nomes, datas, CNPJs, endereços.',
    'Leva vinte e dois minutos e ela não reclama uma vez.',
    'No fim ela diz: "Certidão é melhor. Anotação não vale nada num processo."',
    '"Eu não tenho processo."',
    '"Ainda não", ela diz, e volta pra pilha dela.'
  ],
  ef:{flag:['sabe_do_deposito','anotou_a_junta'],
      rep:{eixo:'bom',delta:1,motivo:'Copiou o que não podia pagar'},
      presagio:'"Ainda não." Ela falou isso sem levantar a cabeça e mudou o rumo de tudo.'},
  escolhas:[
    {texto:'Voltar e pagar a certidão. (80 ₽)', vai:'c9_certidao', cond:d=>d.jogador.dinheiro>=80, ef:{dinheiro:-80}},
    {texto:'Ir ao depósito.', vai:'c9_deposito'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Sair.', vai:'c9_saiu_da_junta'}
  ]
},

c9_copiou_os_onze_da_junta:{
  texto:[
    'Você copia os onze nomes à mão, no caderno de campo, olhando uma tela de computador girada meio grau.',
    'Leva doze minutos porque dois deles são compridos.',
    'Onze nomes completos. Pessoas. Com sobrenome, com CPF mascarado, com data de ingresso no conselho.',
    'Sete técnicos. Dois juristas. Um representante de federação esportiva. Uma presidência.',
    'Quando você fecha o caderno, a moça da junta gira a tela de volta e não comenta nada.'
  ],
  ef:{flag:['tem_os_onze_nomes','sabe_da_comissao'],
      rep:{eixo:'bom',delta:3,motivo:'Copiou onze nomes de uma tela num balcão público'},
      registrar:'Copiou os onze nomes do conselho da Comissão.',
      presagio:'Agora eles são pessoas com nome. Isso é muito mais difícil de combater e muito mais fácil de enfrentar.'},
  escolhas:[
    {texto:'"Busca a Ando."', vai:'c9_busca_renno', cond:d=>!!d.flags.sabe_de_renno},
    {texto:'Pedir certidão da associação. (80 ₽)', vai:'c9_certidao', cond:d=>d.jogador.dinheiro>=80, ef:{dinheiro:-80}},
    {texto:'Sair.', vai:'c9_saiu_da_junta'},
    {texto:'Ir ao depósito.', vai:'c9_deposito'}
  ]
},

c9_recuou_na_junta:{
  texto:[
    '"Deixa. Obrigado."',
    'Ela fecha a tela sem comentar.',
    'Você desce três andares a pé, num prédio público com elevador quebrado, e sai na rua, e fica na calçada por um tempo.',
    'Você tinha onze nomes na tela e fechou a tela.',
    'Não foi medo exatamente. Foi a sensação muito clara e muito nova de estar segurando uma coisa que não cabe em você.',
    'E ela não vai ficar menor.'
  ],
  ef:{flag:'recuou_na_junta',
      presagio:'Ela não vai ficar menor. Você vai voltar naquele terceiro andar.'},
  escolhas:[
    {texto:'Voltar lá em cima.', vai:'c9_busca_adnan'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Ir ao depósito.', vai:'c9_procurar'},
    {texto:'Andar pela cidade.', vai:'c9_cidade2'}
  ]
},

c9_saiu_da_junta:{
  texto:[
    'Você desce três andares a pé e sai na rua com papel na mochila.',
    'É estranho. Você atravessou Kanto, entrou em caverna, subiu em torre, embarcou em navio — e a coisa mais perigosa que você carrega hoje saiu de uma impressora matricial num prédio público.'
  ],
  escolhas:[
    {texto:'Ir ao depósito.', vai:'c9_deposito'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Ligar pra Dra. Sayo.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Andar mais pela cidade.', vai:'c9_cidade2'}
  ]
},

c9_shopping:{
  texto:[
    'O shopping de Celadon tem sete andares e um vão central que vai do térreo até a claraboia.',
    'Da mureta do sexto andar dá pra ver todo mundo lá embaixo, pequeno, andando devagar em volta de um chafariz.',
    'O quarto andar inteiro é item de treinador. Você fica quinze minutos parado só olhando prateleira, e não é vergonha nenhuma: é a maior concentração de coisa útil que existe em Kanto.',
    'No sétimo tem estufa de vidro, e da estufa sai verde por cima do teto.',
    'E no elevador de serviço tem um botão sem número, abaixo do subsolo.'
  ],
  ef:{executar:d=>{ Mundo.descobrir('loja_celadon'); Mundo.descobrir('achou_loja_celadon');
                    Mundo.descobrir('ginasio_celadon'); Mundo.descobrir('achou_ginasio_celadon'); return []; },
      flag:'viu_o_botao_sem_numero',
      presagio:'Um botão sem número abaixo do subsolo. Alguém instalou isso e alguém aprovou a planta.'},
  escolhas:[
    {texto:'Comprar no quarto andar.', vai:'c9_quarto_andar'},
    {texto:'Subir até a estufa do sétimo.', vai:'c9_estufa'},
    {texto:'Apertar o botão sem número.', vai:'c9_botao'},
    {texto:'Descer e ir ao cassino.', vai:'c9_cassino'}
  ]
},

c9_quarto_andar:{
  texto:[
    'O quarto andar é uma loja só, do tamanho de um ginásio, dividida em corredores por categoria.',
    'Tem tudo. Tem coisa que você não sabia que existia. Tem uma parede inteira só de bola, com etiqueta de preço em letra grande e promoção de leve três pague dois.',
    'E tem um corredor no fundo, com vitrine fechada e chave, onde ficam as pedras.',
    'Um vendedor te vê olhando a vitrine das pedras.',
    '"Essa é a parte cara", ele diz, sem nenhuma malícia. "Quer ver de perto?"'
  ],
  ef:{executar:d=>{ Mundo.descobrir('loja_celadon'); Mundo.descobrir('achou_loja_celadon'); return []; }},
  escolhas:[
    {texto:'Comprar.', vai:'c9_comprou_no_shopping'},
    {texto:'"Quer ver de perto." As pedras.', vai:'c9_as_pedras'},
    {texto:'Subir pra estufa.', vai:'c9_estufa'},
    {texto:'Descer e ir ao cassino.', vai:'c9_cassino'}
  ]
},

c9_comprou_no_shopping:{
  texto:[
    'Você compra. É a primeira vez em Kanto que você compra sem fazer conta duas vezes, porque aqui é barato de verdade.',
    'O vendedor ensaca tudo e te dá um folheto de fidelidade que você não vai usar.'
  ],
  ef:{executar:d=>{ Cidade.loja(); return []; }},
  escolhas:[
    {texto:'Ver as pedras.', vai:'c9_as_pedras'},
    {texto:'Subir pra estufa.', vai:'c9_estufa'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Apertar o botão sem número.', vai:'c9_botao'}
  ]
},

c9_as_pedras:{
  texto:[
    'Ele abre a vitrine com uma chave que fica pendurada no crachá dele.',
    'Quatro pedras em suporte de veludo, com etiqueta de preço que custa mais do que tudo que você já teve junto.',
    'Ele pega uma e põe na sua mão sem você pedir.',
    'É morna. Ela é morna e você não estava preparado pra isso.',
    '"Todo mundo faz essa cara", ele diz. "A primeira vez todo mundo faz essa cara."',
    'Ele guarda de volta no veludo.',
    '"E antes que você pergunte: não, ninguém sabe por que elas são mornas. Tem gente pesquisando isso há quarenta anos."'
  ],
  ef:{flag:'segurou_uma_pedra',
      presagio:'Quarenta anos de pesquisa e ninguém sabe por que a pedra é morna. Tem mais coisa em Kanto que ninguém sabe do que coisa que alguém sabe.'},
  escolhas:[
    {texto:'Comprar.', vai:'c9_comprou_no_shopping'},
    {texto:'Subir pra estufa.', vai:'c9_estufa'},
    {texto:'Apertar o botão sem número.', vai:'c9_botao'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'}
  ]
},

c9_estufa:{
  texto:[
    'O sétimo andar é uma estufa de vidro em cima de um shopping, com temperatura controlada e um cheiro de terra molhada que não combina com nada em volta.',
    'Tem fileira de vaso, tem regador, tem mangueira enrolada no gancho certo.',
    'E tem uma mulher de uns trinta anos podando uma planta com tesoura, de costas pra porta, descalça no chão de cimento queimado.',
    'Ela não vira quando você entra.',
    '"Se você veio desafiar, é de terça a sábado, das nove às dezesseis." Ela corta um galho. "Se você veio ver planta, fica à vontade."'
  ],
  ef:{executar:d=>{ Mundo.descobrir('ginasio_celadon'); Mundo.descobrir('achou_ginasio_celadon'); return []; },
      npc:{nome:'Líder Erika', opiniao:0, memoria:'Você a encontrou podando na estufa do sétimo andar.'},
      flag:'achou_a_erika'},
  escolhas:[
    {texto:'"Vim ver planta."', vai:'c9_ver_planta'},
    {texto:'"O que tem no botão sem número do elevador de serviço?"', vai:'c9_perguntou_do_botao'},
    {texto:'"Vim desafiar."', vai:'c9_vim_desafiar'},
    {texto:'Ficar em silêncio e olhar.', vai:'c9_ver_planta'}
  ]
},

c9_ver_planta:{
  texto:[
    'Você fica. Ela continua podando.',
    'Depois de uns dez minutos ela fala sem virar:',
    '"Essa aqui é de Pallet."',
    'Ela mostra um vaso com uma coisa de folha larga que você já viu mil vezes e nunca reparou.',
    '"Nasce em muro, em terreno baldio, em rachadura de calçada. Não vale nada e não tem nome bonito."',
    'Ela corta um galho.',
    '"Eu tenho quatro dessa. É a única que eu não consigo matar."'
  ],
  ef:{flag:'a_planta_de_pallet',
      npc:{nome:'Líder Erika', opiniao:2, memoria:'Te mostrou a planta de terreno baldio que ela não consegue matar.'}},
  escolhas:[
    {texto:'"O que tem no botão sem número?"', vai:'c9_perguntou_do_botao'},
    {texto:'"Vim desafiar."', vai:'c9_vim_desafiar'},
    {texto:'"Por que a senhora tem um ginásio em cima de um shopping?"', vai:'c9_porque_aqui'},
    {texto:'Descer.', vai:'c9_shopping'}
  ]
},

c9_porque_aqui:{
  texto:[
    '"Por que a senhora tem um ginásio em cima de um shopping?"',
    'Ela para de podar pela primeira vez.',
    '"Porque o terreno é do shopping."',
    'Ela põe a tesoura no bolso do avental.',
    '"O ginásio de Celadon existia num terreno na avenida. Aí o terreno virou shopping. Aí o shopping ofereceu o sétimo andar."',
    'Ela olha o vidro em volta.',
    '"E eu aceitei, porque a alternativa era não ter ginásio."',
    'Ela pega o regador.',
    '"E há oito anos eu pago aluguel simbólico e sou grata, e ser grata é a coisa mais cara que tem."'
  ],
  ef:{flag:'a_gratidao_da_erika',
      npc:{nome:'Líder Erika', opiniao:3, memoria:'Te contou que paga aluguel simbólico ao shopping e que ser grata é caro.'},
      presagio:'Ser grata é a coisa mais cara que tem. Você vai receber uma oferta boa demais e vai lembrar dessa frase.'},
  escolhas:[
    {texto:'"E se eles pedirem alguma coisa?"', vai:'c9_se_pedirem'},
    {texto:'"O que tem no botão sem número?"', vai:'c9_perguntou_do_botao'},
    {texto:'"Vim desafiar."', vai:'c9_vim_desafiar'},
    {texto:'Descer.', vai:'c9_shopping'}
  ]
},

c9_se_pedirem:{
  texto:[
    '"E se eles pedirem alguma coisa?"',
    'Ela rega um vaso inteiro antes de responder.',
    '"Já pediram."',
    'Ela passa pro próximo vaso.',
    '"Ano passado. Uma fundação queria usar o espaço do sétimo andar pra um evento de credenciamento. Um sábado."',
    '"E a senhora?"',
    '"Eu disse que sábado tem desafio."',
    'Ela rega.',
    '"E o shopping me ligou na segunda perguntando se eu tinha certeza."',
    'Ela desliga a mangueira.',
    '"Eu tinha. E eu continuo tendo. E eu acordo às vezes de madrugada com medo de um dia não ter."'
  ],
  ef:{flag:'a_erika_recusou',
      rep:{eixo:'bom',delta:1,motivo:'Ouviu alguém contar um medo real'},
      npc:{nome:'Líder Erika', opiniao:5, memoria:'Recusou ceder o ginásio pra um evento de credenciamento da fundação, e tem medo de um dia não conseguir recusar.'},
      registrar:'Erika recusou ceder o ginásio para um evento de credenciamento da Comissão.',
      presagio:'Ela acorda de madrugada com medo de um dia não ter certeza. Isso é o que a Comissão faz sem nunca ameaçar ninguém.'},
  escolhas:[
    {texto:'"Eu tenho papel sobre essa fundação."', vai:'c9_mostrou_a_erika',
     cond:d=>!!d.flags.papel_com_brasao},
    {texto:'"O que tem no botão sem número?"', vai:'c9_perguntou_do_botao'},
    {texto:'"Vim desafiar."', vai:'c9_vim_desafiar'},
    {texto:'Descer.', vai:'c9_shopping'}
  ]
},

c9_mostrou_a_erika:{
  texto:[
    '"Eu tenho papel sobre essa fundação."',
    'Ela seca as mãos no avental e pega.',
    'E lê. Em pé, numa estufa, descalça, com a tesoura no bolso, por quase vinte minutos, sem falar nada.',
    'Quando devolve, ela devolve com as duas mãos.',
    '"Eu recebi ofício deles."',
    'Ela vai até um armário de ferramenta, abre uma gaveta de baixo, e tira uma pasta.',
    '"Três. Em dezoito meses."',
    'Ela põe na sua mão.',
    '"Leva. Eu guardei porque eu guardo tudo e eu não sabia pra quê."'
  ],
  ef:{flag:['tem_os_oficios_da_erika','papel_com_brasao'],
      rep:{eixo:'bom',delta:4,motivo:'Recebeu de uma líder de ginásio os ofícios que ela guardava sem saber pra quê'},
      npc:{nome:'Líder Erika', opiniao:8, memoria:'Te entregou três ofícios da Comissão que ela guardava há dezoito meses.'},
      registrar:'Erika entregou três ofícios da Comissão, recebidos em dezoito meses.',
      presagio:'Ela guardou sem saber pra quê. Meio Kanto está guardando papel sem saber pra quê.'},
  escolhas:[
    {texto:'"O que tem no botão sem número?"', vai:'c9_perguntou_do_botao'},
    {texto:'"Vim desafiar."', vai:'c9_vim_desafiar'},
    {texto:'Descer e ir ao depósito.', vai:'c9_deposito'},
    {texto:'"A senhora conhece outras que receberam?"', vai:'c9_outras_que_receberam'}
  ]
},

c9_outras_que_receberam:{
  texto:[
    '"A senhora conhece outras que receberam?"',
    'Ela ri, e é uma risada seca.',
    '"Todas."',
    'Ela pega a tesoura de novo.',
    '"A Misty processou e ganhou e depois comprou briga errada. O Surge rasgou na frente do portador. A Sabrina fechou o ginásio dela e ninguém sabe por quê — eu sei por quê."',
    'Ela corta um galho.',
    '"A gente tem grupo de mensagem. Oito pessoas. A gente fala de escala de desafio e de conserto de piso."',
    'Ela olha pra você.',
    '"E uma vez por mês alguém manda um ofício fotografado e ninguém responde nada."'
  ],
  ef:{flag:['o_grupo_dos_oito','sabe_da_sabrina'],
      registrar:'Os oito líderes de ginásio têm um grupo de mensagens. Uma vez por mês alguém manda um ofício fotografado e ninguém responde.',
      presagio:'Oito pessoas com a mesma coisa acontecendo, num grupo de mensagem, sem responder. Falta alguém dizer em voz alta.'},
  escolhas:[
    {texto:'"Responde."', vai:'c9_responde_erika'},
    {texto:'"O que aconteceu com a Sabrina?"', vai:'c9_a_sabrina'},
    {texto:'"Vim desafiar."', vai:'c9_vim_desafiar'},
    {texto:'Descer e ir ao depósito.', vai:'c9_deposito'}
  ]
},

c9_responde_erika:{
  texto:[
    '"Responde."',
    '"Responder o quê?"',
    '"Qualquer coisa. Que você também recebeu. Que você guardou. Que são três."',
    'Ela fica com a tesoura parada no ar.',
    '"E aí?"',
    '"E aí alguém responde de volta."',
    'Ela abaixa a tesoura.',
    'E pega o Pokégear do bolso do avental, e digita por uns dois minutos, e manda.',
    'O Pokégear apita em quarenta segundos. E de novo. E de novo.',
    'Ela olha a tela com uma cara que você não sabe ler.',
    '"Quatro", ela diz. "Quatro responderam em um minuto."'
  ],
  ef:{rep:{eixo:'bom',delta:5,motivo:'Fez oito pessoas isoladas descobrirem que eram oito'},
      flag:['o_grupo_respondeu','plano_das_insignias'],
      npc:{nome:'Líder Erika', opiniao:10, memoria:'Você a fez escrever no grupo dos líderes. Quatro responderam em um minuto.'},
      registrar:'Quatro líderes de ginásio responderam ao primeiro que falou em voz alta.',
      presagio:'Quatro em um minuto. Eles estavam todos esperando alguém começar.'},
  escolhas:[
    {texto:'"Vim desafiar."', vai:'c9_vim_desafiar'},
    {texto:'"O que aconteceu com a Sabrina?"', vai:'c9_a_sabrina'},
    {texto:'Descer e ir ao depósito.', vai:'c9_deposito'},
    {texto:'Descer e ir ao cassino.', vai:'c9_cassino'}
  ]
},

c9_a_sabrina:{
  texto:[
    '"O que aconteceu com a Sabrina?"',
    'Erika para de podar e fica um tempo sem responder.',
    '"Ela lê gente."',
    'Ela põe a tesoura no bolso.',
    '"E há três semanas ela leu alguém que entrou no ginásio dela pra entregar um ofício."',
    'Ela olha pro vidro.',
    '"E depois disso ela fechou o ginásio e não abriu mais e não explicou pra ninguém, nem pra gente."',
    'Uma pausa.',
    '"A luz de lá dentro fica acesa a noite inteira. Eu já fui ver."'
  ],
  ef:{flag:['sabe_da_sabrina','a_luz_acesa'],
      registrar:'Sabrina fechou o ginásio depois de ler a cabeça de quem entregou um ofício. A luz fica acesa a noite inteira.',
      presagio:'Ela leu alguém e fechou. O que quer que ela tenha visto, viu inteiro.'},
  escolhas:[
    {texto:'"Vim desafiar."', vai:'c9_vim_desafiar'},
    {texto:'Descer e ir ao depósito.', vai:'c9_deposito'},
    {texto:'"Responde o grupo."', vai:'c9_responde_erika'},
    {texto:'Descer e ir ao cassino.', vai:'c9_cassino'}
  ]
},

c9_vim_desafiar:{
  texto:[
    '"Vim desafiar."',
    'Ela olha o relógio de parede da estufa.',
    d=>`"São ${['seis','sete','oito','nove','dez','onze','doze','uma','duas','três','quatro','cinco'][(d.relogio.dia*3)%12]} e pouco."`,
    'Ela guarda a tesoura.',
    '"Desafio é de terça a sábado, das nove às dezesseis, e você vem pela porta da frente do shopping, pega o elevador social e sobe até o sete."',
    'Ela pega o regador.',
    '"Não pelo elevador de serviço. Nunca pelo de serviço."',
    'E não explica por quê.'
  ],
  ef:{executar:d=>{ Mundo.descobrir('ginasio_celadon'); Mundo.descobrir('achou_ginasio_celadon'); return []; },
      flag:'nunca_pelo_de_servico',
      presagio:'"Nunca pelo de serviço." Ela falou isso com o regador na mão e não explicou.'},
  escolhas:[
    {texto:'"Por que nunca pelo de serviço?"', vai:'c9_perguntou_do_botao'},
    {texto:'Descer e voltar no horário.', vai:'c9_shopping'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'Ir ao depósito.', vai:'c9_deposito'}
  ]
},

c9_perguntou_do_botao:{
  texto:[
    '"O que tem no botão sem número do elevador de serviço?"',
    'Ela para.',
    'Dessa vez ela vira e olha pra você de frente pela primeira vez.',
    '"Doca."',
    '"Doca do shopping?"',
    '"Doca do shopping, do cassino e do prédio do lado." Ela põe a mangueira no gancho. "Os três quarteirões dividem um subsolo de carga. Foi projetado assim em setenta e nove."',
    'Ela seca as mãos.',
    '"E ninguém nunca refez a planta depois que o cassino mudou de dono."',
    'Ela pega o regador de novo.',
    '"Então, tecnicamente, o meu ginásio e um depósito de rua de serviço estão no mesmo lote."'
  ],
  ef:{flag:['sabe_do_subsolo','sabe_do_deposito'],
      rep:{eixo:'bom',delta:2,motivo:'Perguntou do botão que todo mundo vê e ninguém aperta'},
      npc:{nome:'Líder Erika', opiniao:4, memoria:'Te contou que o subsolo de carga liga o shopping, o cassino e o depósito.'},
      registrar:'O subsolo de carga liga shopping, cassino e depósito. Mesmo lote, planta de 1979.',
      presagio:'Mesmo lote. Um ginásio de Liga e um depósito de custódia, no mesmo lote, por um erro de planta de quarenta e sete anos.'},
  escolhas:[
    {texto:'Descer pelo botão sem número.', vai:'c9_botao'},
    {texto:'Ir ao depósito pela rua.', vai:'c9_deposito'},
    {texto:'Ir ao cassino.', vai:'c9_cassino'},
    {texto:'"Vim desafiar."', vai:'c9_vim_desafiar'}
  ]
},

c9_botao:{
  texto:[
    'O elevador de serviço fica atrás de uma porta de aço com "FUNCIONÁRIOS" pintado à mão.',
    'Lá dentro, o painel tem: T, 1 a 7, SS.',
    'E abaixo do SS, um botão sem número, com o aro de plástico amarelado de tanto ser apertado.',
    'Você aperta.',
    'O elevador desce por muito mais tempo do que um andar, e as portas abrem num corredor de concreto com pé-direito de quatro metros, luz de vapor de sódio e marca de pneu no chão.',
    'É uma doca. Uma doca inteira, embaixo de três quarteirões, com três saídas rotuladas a spray:',
    'SHOPPING · CASSINO · ARMAZÉM.'
  ],
  ef:{flag:['achou_o_subsolo','sabe_do_deposito'],
      registrar:'Desceu ao subsolo de carga. Três saídas: shopping, cassino e armazém.',
      presagio:'Você entrou por baixo. Ninguém tranca a porta de baixo porque ninguém imagina que alguém desça.'},
  escolhas:[
    {texto:'Seguir a placa ARMAZÉM.', vai:'c9_dentro_limpo'},
    {texto:'Seguir a placa CASSINO.', vai:'c9_cassino_por_baixo'},
    {texto:'Ficar olhando quem passa.', vai:'c9_esperou_na_doca'},
    {texto:'Voltar pro elevador. Isso é fundo demais.', vai:'c9_shopping'}
  ]
},

c9_esperou_na_doca:{
  texto:[
    'Você se enfia atrás de uma pilha de pallets de plástico e espera.',
    'Uma hora e dez.',
    'Passa um carrinho elétrico com caixa de bebida indo pro cassino. Passa um carro de rouparia indo pro shopping.',
    'E às dezoito e quarenta passa uma empilhadeira com quatro caixas plásticas azuis empilhadas, indo do ARMAZÉM pro CASSINO.',
    'Pro cassino.',
    'Você fica atrás dos pallets tentando entender por que uma carga de armazém entraria num cassino, e não consegue, e é justamente por não conseguir que você vai ter que ir ver.'
  ],
  ef:{flag:['carga_pro_cassino','sabe_do_deposito'],
      registrar:'Uma empilhadeira levou quatro caixas azuis do armazém para dentro do cassino às 18h40.',
      presagio:'Do armazém pro cassino. Não pro caminhão. Pro cassino.'},
  escolhas:[
    {texto:'Seguir a empilhadeira até o cassino.', vai:'c9_cassino_por_baixo'},
    {texto:'Ir pro armazém, que ficou vazio.', vai:'c9_dentro_limpo'},
    {texto:'Voltar e entrar no cassino pela frente.', vai:'c9_cassino'},
    {texto:'Subir e sair.', vai:'c9_shopping'}
  ]
},

c9_cassino_por_baixo:{
  texto:[
    'A porta rotulada CASSINO é de aço, com barra antipânico do lado de dentro — o que quer dizer que ela abre de dentro pra fora e não o contrário.',
    'Só que alguém calçou ela com um pedaço de madeira, do jeito que se calça porta quando se vai ficar entrando e saindo.',
    'Você entra.',
    'Do outro lado é um corredor de serviço com azulejo até a metade da parede e cheiro de cozinha industrial.',
    'E, no fim dele, uma porta dupla com janelinha redonda.',
    'Pela janelinha dá pra ver uma sala grande com mesa de feltro, cadeira, e trinta e poucas pessoas de pé em volta.',
    'Não é mesa de jogo.',
    'É pregão.'
  ],
  ef:{flag:'achou_o_leilao',
      registrar:'O leilão acontece numa sala do cassino, acessada pelo subsolo de carga.',
      presagio:'O leilão é no cassino. Por isso o endereço muda toda vez e por isso ninguém acha.'},
  escolhas:[
    {texto:'Entrar.', vai:'c9_entrou_no_leilao'},
    {texto:'Olhar pela janelinha e não entrar.', vai:'c9_olhou_o_leilao'},
    {texto:'Fotografar pela janelinha.', vai:'c9_fotografou_leilao', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Voltar e ir pro armazém.', vai:'c9_dentro_limpo'}
  ]
},

c9_olhou_o_leilao:{
  texto:[
    'Você fica na janelinha redonda por quarenta minutos.',
    'É chato. É absurdamente chato — é um leiloeiro com microfone lendo número de lote, e trinta pessoas levantando plaquinha, e uma mulher com prancheta anotando.',
    'Os lotes não são mostrados. Só o número e a descrição, projetada numa parede.',
    '"Lote 41. Espécime canino, macho, nível estimado 28, condição regular, procedência: recolhimento administrativo, processo 44.207."',
    d=>d.flags.numero_da_gaveta ? 'Processo 44.207. É o número que a Dra. Sayo te deu num canto de página no museu de Pewter.' : 'Você anota o número do processo sem saber por quê.',
    'Alguém arremata em quatro segundos.',
    'Aplauso educado. Próximo lote.'
  ],
  ef:{flag:['viu_o_pregao','numero_da_gaveta'],
      rep:{eixo:'bom',delta:2,motivo:'Assistiu quarenta minutos de uma coisa que ninguém nunca viu'},
      registrar:'No pregão, os lotes são descritos por número de processo. Um deles é o 44.207.',
      presagio:'Aplauso educado. Foi isso que você viu: trinta pessoas aplaudindo educadamente.'},
  escolhas:[
    {texto:'Entrar.', vai:'c9_entrou_no_leilao'},
    {texto:'Fotografar pela janelinha.', vai:'c9_fotografou_leilao', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Ir embora e ir pro armazém.', vai:'c9_dentro_limpo'},
    {texto:'Voltar pro subsolo e subir.', vai:'c9_shopping'}
  ]
},

c9_fotografou_leilao:{
  texto:[
    'Você fotografa pela janelinha redonda.',
    'O flash não dispara porque você lembrou de desligar — a câmera descartável tem uma chavinha e você passou os últimos minutos procurando ela no escuro.',
    'Sete fotos.',
    'A parede projetada com o número do lote e o número do processo. O leiloeiro. As plaquinhas levantadas. A mulher da prancheta.',
    'As fotos vão sair escuras e tremidas e absolutamente reconhecíveis.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Câmera descartável'); return []; },
      flag:['fotografou_o_pregao','papel_com_brasao'],
      rep:{eixo:'bom',delta:4,motivo:'Fotografou um pregão que não existe oficialmente'},
      registrar:'Fotografou o pregão pela janelinha da porta de serviço.',
      presagio:'Escuras, tremidas e reconhecíveis. É assim que prova de verdade se parece.'},
  escolhas:[
    {texto:'Entrar.', vai:'c9_entrou_no_leilao'},
    {texto:'Sair rápido e revelar o filme.', vai:'c9_revelar'},
    {texto:'Ir pro armazém.', vai:'c9_dentro_limpo'},
    {texto:'Subir e sair do prédio.', vai:'c9_shopping'}
  ]
},

c9_entrou_no_leilao:{
  texto:[
    'Você empurra a porta dupla e entra numa sala de pregão com trinta e duas pessoas adultas de pé.',
    'Ninguém grita. Ninguém corre. Ninguém te agarra.',
    'Quatro pessoas olham pra você e voltam pro leiloeiro.',
    'Uma mulher com prancheta atravessa a sala na sua direção com um sorriso profissional e te intercepta antes que você dê cinco passos.',
    '"Boa noite. Credenciamento?"',
    'E é isso: você entrou num leilão clandestino e a primeira coisa que te perguntam é se você tem credencial.'
  ],
  ef:{flag:'entrou_no_pregao',
      npc:{nome:'Auditora Nishino', opiniao:0, memoria:'Te interceptou na porta do pregão de Celadon perguntando pelo credenciamento.'},
      presagio:'Ela perguntou do credenciamento. Não da sua idade, não de quem você é. Do credenciamento.'},
  escolhas:[
    {texto:'"Não tenho."', vai:'c9_nao_tenho_credencial'},
    {texto:'"O que é o lote 41?"', vai:'c9_o_lote_41'},
    {texto:'Blefar. "Tenho. Está com meu tutor."', vai:'c9_blefe'},
    {texto:'Gritar pra sala inteira.', vai:'c9_gritou_no_pregao'}
  ]
},

/* ─────────────── OS CAMINHÕES ─────────────── */

c9_procurar:{
  texto:[
    'Três caminhões brancos, sem identificação, entraram na cidade de manhã. É tudo o que você tem.',
    'Você começa do jeito idiota: perguntando. Ninguém sabe de nada, e a maioria nem finge — em Celadon entram trezentos caminhões por dia.',
    'Então você para de perguntar e começa a andar olhando o chão.',
    'Caminhão pesado deixa rastro: marca de pneu larga em guia rebaixada, óleo pingado em vaga de carga, cone de plástico amassado no meio-fio.',
    'Você segue esse rastro por duas avenidas até a zona de serviço atrás dos quarteirões comerciais, onde as fachadas acabam e começam as paredes cegas.'
  ],
  ef:{flag:'procurou_os_caminhoes',
      presagio:'Fachada é o que a cidade mostra. Parede cega é o que ela faz.'},
  teste:{status:'percepcao', dificuldade:7, nomeStatus:'Percepção',
         critico:'c9_achou_deposito', sucesso:'c9_achou_deposito', parcial:'c9_achou_meio', falha:'c9_perdido'}
},

c9_achou_deposito:{
  texto:[
    'Você acha.',
    'Não é escondido. Essa é a primeira coisa que te desmonta: não é escondido.',
    'É um galpão de alvenaria pintado de cinza, com portão de enrolar azul, câmera nova no canto e uma placa de esmalte parafusada na parede ao lado da porta social:',
    '**ARMAZÉM GERAL 7 — CUSTÓDIA E DEPÓSITO — ALVARÁ MUNICIPAL 3.318**',
    'Tem alvará. Tem número. Tem placa de esmalte, dessas que custam caro e duram vinte anos.',
    'Você fica parado na calçada de frente pra ele durante um tempo difícil de medir, e a coisa que você pensa não é "achei". É: então é assim.',
    'Dá pra ouvir de fora o gerador. E, por baixo do gerador, um som contínuo que não é máquina.'
  ],
  ef:{flag:['sabe_do_deposito','viu_o_alvara'],
      rep:{eixo:'bom',delta:2,motivo:'Rastreou a carga até o armazém por conta própria'},
      registrar:'Achou o Armazém Geral 7 em Celadon. Tem alvará municipal na parede.',
      presagio:'Alvará 3.318. O que acontece ali dentro tem número de registro na prefeitura.'},
  escolhas:[
    {texto:'Ficar até escurecer e entrar.', vai:'c9_deposito'},
    {texto:'Anotar o alvará e ir pesquisar quem é o titular.', vai:'c9_junta',
     ef:{flag:'sabe_do_cartorio', registrar:'Anotou o alvará 3.318 para buscar o titular na junta comercial.'}},
    {texto:'Ir ao cassino perguntar de quem é o galpão.', vai:'c9_cassino'},
    {texto:'Voltar pro centro. Você precisa pensar.', vai:'c9_cidade2'}
  ]
},

c9_achou_meio:{
  texto:[
    'Você chega perto.',
    'Acha a zona de serviço, acha a guia rebaixada, acha o óleo — e aí o rastro morre numa esquina onde três ruas de carga se encontram e qualquer uma delas serve.',
    'Você fica ali até escurecer testando as três, e nas três tem galpão, e nos três galpões tem portão fechado.',
    'Um deles tem câmera nova. Só isso: um deles tem câmera nova, e as câmeras dos outros dois são velhas.',
    'É uma pista tão fina que você tem vergonha de estar usando ela.'
  ],
  ef:{flag:['quase_achou','camera_nova'],
      registrar:'Chegou perto do armazém: três galpões possíveis, um com câmera nova.',
      presagio:'Câmera nova num galpão velho. Alguém investiu em ver quem chega.'},
  escolhas:[
    {texto:'Apostar no da câmera nova e esperar escurecer.', vai:'c9_deposito'},
    {texto:'Ir ao cassino. Alguém lá sabe.', vai:'c9_cassino'},
    {texto:'Voltar amanhã de manhã e ver qual descarrega.', vai:'c9_desistiu'},
    {texto:'Ir ao shopping e tentar por dentro.', vai:'c9_shopping'}
  ]
},

c9_perdido:{
  texto:[
    'Você perde o rastro na terceira avenida.',
    'E aí acontece a coisa que faz Celadon ser Celadon: você percebe que está andando em círculo há quarenta minutos porque todos os quarteirões daqui são iguais de propósito.',
    'Paredão cinza, portão de enrolar, caçamba, hidrante, repete. Não tem número na maioria das portas.',
    'Às nove da noite você senta num meio-fio, com os pés doendo, numa cidade que tem quatrocentos mil pessoas e nenhuma que te deva uma resposta.',
    'Três caminhões brancos entraram nessa cidade hoje de manhã e sumiram dentro dela como moeda em bolso.'
  ],
  ef:{flag:'perdeu_os_caminhoes', hp:-2, causa:'Um dia inteiro andando em Celadon',
      presagio:'Quarteirões iguais de propósito. Isso não é preguiça de urbanista.'},
  escolhas:[
    {texto:'Ir ao cassino. Tudo em Celadon passa pelo cassino.', vai:'c9_cassino'},
    {texto:'Ir ao shopping tentar outro caminho.', vai:'c9_shopping'},
    {texto:'Tentar de novo amanhã.', vai:'c9_desistiu'},
    {texto:'Resolver uma pendência que você trouxe de trás.', vai:'c9_pendencias'}
  ]
},

c9_desistiu:{
  texto:[
    'Você volta de manhã. Chega às seis e meia, com café de padaria, e espera na esquina.',
    'Às sete e vinte, o portão azul abre.',
    'Dois caminhões saem. Carregados. Você vê as caixas plásticas azuis empilhadas por cima da carroceria nos dois.',
    'Você chegou cinquenta minutos tarde.',
    'Isso vai te acompanhar por um tempo: não a derrota, que seria limpa. Cinquenta minutos.'
  ],
  ef:{flag:['perdeu_a_carga','sabe_do_deposito'], instabilidade:1,
      rep:{eixo:'ruim',delta:1,motivo:'Tinha o lugar e chegou tarde'},
      registrar:'Chegou ao armazém cinquenta minutos depois da carga sair.',
      presagio:'Cinquenta minutos. Guarde esse número, ele volta.'},
  escolhas:[
    {texto:'Entrar no galpão vazio assim mesmo.', vai:'c9_deposito'},
    {texto:'Ir ao cassino atrás de quem despachou.', vai:'c9_cassino'},
    {texto:'Ir à junta comercial ver de quem é o alvará.', vai:'c9_junta', ef:{flag:'sabe_do_cartorio'}},
    {texto:'Seguir viagem. Celadon te venceu.', vai:'c9_fim', ef:{flag:'recuou_celadon',
      rep:{eixo:'ruim',delta:1,motivo:'Saiu de Celadon sem abrir nenhuma porta'}}}
  ]
},

/* ─────────────── O CASSINO E A TERCEIRA ─────────────── */

c9_cassino:{
  texto:[
    'O Rocket Game Corner mudou de nome duas vezes desde que a Rocket caiu. Agora se chama Celadon Palace, tem letreiro novo, alvará novo, CNPJ novo — e o mesmo carpete.',
    'É um carpete vermelho com desenho geométrico dourado, gasto em faixa no meio de cada corredor, do jeito que carpete gasta quando dez mil pessoas andam exatamente no mesmo lugar por dez anos.',
    'Você entra às oito da noite. Tem umas cento e vinte pessoas no salão, a maioria com mais de sessenta anos, a maioria sozinha.',
    'Slot, roleta, e um canto de mesa de carta onde ninguém conversa.',
    'Todo mundo aqui sabe de tudo e não fala nada de graça.',
    'A gerente do salão é uma mulher de uns quarenta anos, terno cinza, sem joia nenhuma, que anda pelo cassino como se fosse a sala de casa dela. Porque é.',
    'Ela para na sua frente antes de você decidir se quer falar com ela.',
    d=>{
      if (d.flags.trabalhou_rocket) return '"Você é o que carregou caixa no Monte da Lua." Ela acende um cigarro dentro de um lugar onde não se pode fumar. "Eu lembro de folha de pagamento."';
      if (d.flags.destruiu_operacao || d.flags.expos_operacao) return '"Você é o que estragou o Monte da Lua." Ela acende um cigarro dentro de um lugar onde não se pode fumar. "Custou noventa mil e quatro meses."';
      return '"Você é o de Pewter." Ela acende um cigarro dentro de um lugar onde não se pode fumar. "Ou o do Monte da Lua. As histórias se misturam."';
    }
  ],
  ef:{npc:{nome:'A Terceira', opiniao:0, memoria:'Te abordou no cassino de Celadon antes de você abordá-la.'},
      flag:'conheceu_terceira', registrar:'Conheceu a mulher que comanda o esquema de Celadon.',
      presagio:'Ela te abordou. Você não a encontrou — ela decidiu quando a conversa começava.'},
  escolhas:[
    {texto:'"Você é a Terceira."', vai:'c9_terceira_sim', cond:d=>!!d.flags.sabe_da_terceira},
    {texto:'"Quem é você?"', vai:'c9_quem_terceira'},
    {texto:'"Tem um pregão acontecendo embaixo do seu carpete."', vai:'c9_o_que_e_o_pregao', cond:d=>!!d.flags.achou_o_leilao || !!d.flags.viu_o_pregao},
    {texto:'Atacar. Sem conversa.', vai:'c9_ataque_cedo'}
  ]
},

c9_quem_terceira:{
  texto:[
    '"Quem é você?"',
    '"Terceira." Ela solta a fumaça pro lado, longe do seu rosto, que é uma delicadeza estranha vinda de quem acabou de acender um cigarro num salão fechado.',
    '"Não é apelido de origem interessante. Giovanni era o primeiro. O segundo durou nove meses e eu não vou dizer o nome dele porque a viúva mora aqui."',
    '"Eu sou a terceira. E, diferente dos dois, eu não quero Kanto."',
    '"Kanto dá muito trabalho. Kanto tem eleição, tem imprensa, tem Liga, tem oito ginásios cheios de gente convencida."',
    'Ela olha o salão inteiro de uma vez, do jeito que dono olha.',
    '"Eu quero logística."'
  ],
  ef:{flag:'sabe_da_terceira'},
  escolhas:[
    {texto:'"O que é logística, no seu caso?"', vai:'c9_proposta_terceira'},
    {texto:'"Isso que vocês fazem é legal?"', vai:'c9_e_legal'},
    {texto:'"E o armazém atrás daqui?"', vai:'c9_proposta_terceira', cond:d=>!!d.flags.sabe_do_deposito},
    {texto:'Atacar.', vai:'c9_ataque_cedo'}
  ]
},

c9_terceira_sim:{
  texto:[
    '"Você é a Terceira."',
    'Ela não nega, não confirma, não muda de expressão. A brasa do cigarro sobe um centímetro.',
    '"Você andou lendo caderno dos outros." Ela aponta uma mesa vazia no canto do bar com o queixo. "Isso é educação ruim e instinto bom."',
    'Vocês sentam. O garçom traz água pra você sem ninguém pedir, o que quer dizer que ele já viu essa cena antes.',
    '"Eu explico o negócio inteiro pra você em quatro minutos, porque gente informada toma decisão melhor, e eu prefiro gente que decidiu a gente que obedeceu."',
    '"Gente que obedeceu volta atrás."'
  ],
  ef:{flag:'sentou_com_a_terceira'},
  escolhas:[
    {texto:'"Explica."', vai:'c9_proposta_terceira'},
    {texto:'"Isso que vocês fazem é legal?"', vai:'c9_e_legal'},
    {texto:'"Primeiro me diz o que é o lote 41."', vai:'c9_o_lote_41', cond:d=>!!d.flags.viu_o_pregao},
    {texto:'Levantar antes dela começar.', vai:'c9_neutro'}
  ]
},

c9_e_legal:{
  texto:[
    '"Isso que vocês fazem é legal?"',
    'É a primeira vez na conversa que ela parece contente.',
    '"Essa é a pergunta boa. Quase ninguém faz."',
    'Ela puxa um guardanapo e escreve três palavras, em letra de forma, com uma caneta de hotel.',
    '**RECOLHIMENTO · CUSTÓDIA · ALIENAÇÃO**',
    '"Recolhimento é quando a Comissão tira um bicho de alguém. Motivo: maus-tratos, irregularidade, abandono, o que estiver no formulário."',
    '"Custódia é onde ele fica enquanto o processo corre. Processo demora. Bicho não pode ficar em sala de repartição, então a Comissão contrata depósito particular credenciado."',
    '"Alienação é o que a lei manda fazer quando o processo acaba e ninguém reclamou: leiloar, e o dinheiro vai pro erário."',
    'Ela encosta a caneta no guardanapo.',
    '"Eu não roubo bicho de ninguém. Eu tenho o depósito credenciado, eu opero o leilão, e eu tenho comprador. Três contratos. Três CNPJs. Tudo com nota."',
    '"O crime, se você quiser achar um, é muito mais chato do que você queria."'
  ],
  ef:{flag:['entendeu_o_esquema','sabe_da_alienacao'],
      rep:{eixo:'bom',delta:1,motivo:'Perguntou como funciona antes de decidir o que fazer'},
      registrar:'O esquema de Celadon é legal no papel: recolhimento, custódia credenciada e alienação em leilão.',
      presagio:'Três contratos, três CNPJs, tudo com nota. É por isso que ninguém prendeu ninguém.'},
  escolhas:[
    {texto:'"Então quem decide o recolhimento?"', vai:'c9_proposta_terceira'},
    {texto:'"Quem é o Ando?"', vai:'c9_proposta_terceira', cond:d=>!!d.flags.sabe_do_renno},
    {texto:'Guardar o guardanapo.', vai:'c9_proposta_terceira', ef:{flag:'guardanapo_terceira', itens:{'Guardanapo do Palace':1}}},
    {texto:'Levantar e ir embora com isso na cabeça.', vai:'c9_neutro'}
  ]
},

c9_proposta_terceira:{
  texto:[
    '"A Rocket caiu porque queria governar. Governo é caro e dá processo."',
    '"O que sobrou é isso aqui: uma rede de distribuição. Pokémon sai de custódia e chega em coleção particular. Fóssil sai de caverna e chega em leilão. Ninguém morre, ninguém apanha, ninguém faz discurso."',
    '"Isso é crime? Tecnicamente, quase nunca. Isso é pior que o que a Liga faz quando recolhe um bicho e deixa ele três anos num depósito legalizado esperando um despacho? Não."',
    '"A diferença entre mim e a Comissão é que eu sou mais rápida e eu admito que é negócio."',
    'Ela apaga o cigarro numa xícara de café que já estava ali antes de vocês sentarem.',
    d=>{
      if (d.flags.trabalhou_rocket) return '"E você já carregou caixa pra mim uma vez, no Monte da Lua. Você só não sabia que era pra mim. Não fica com essa cara — todo mundo carregou caixa pra alguém."';
      if (d.flags.destruiu_operacao || d.flags.expos_operacao) return '"E você já me custou uma operação inteira no Monte da Lua. Eu sei exatamente quem você é. Estou falando com você mesmo assim — isso devia te dizer alguma coisa sobre o tamanho disso aqui."';
      if (d.flags.carregou_os_seis || d.flags.esvaziou_deposito) return '"E você tem histórico de carregar bicho no colo. Isso é caráter, e caráter é caro, e eu pago caro."';
      return '"E você chegou até aqui sozinho, com quinze anos, com uma mochila e um bloco de anotação. Isso é currículo."';
    },
    '"Eu tenho três coisas pra te oferecer. Escolhe uma, ou escolhe nenhuma e a gente se despede sem drama. Eu não ameaço criança. Dá muito trabalho e não resolve."'
  ],
  ef:{flag:'ouviu_a_proposta',
      presagio:'Ela ofereceu três. Reparou que a lista que ela leu tem quatro?'},
  escolhas:[
    {texto:'"Trabalhar pra você." — dinheiro, rotas, proteção.', vai:'c9_via_mercenario'},
    {texto:'"Nada. Eu vim acabar com isso." — e sair para atacar o armazém.', vai:'c9_via_heroi'},
    {texto:'"Me dá tudo. Eu quero o lugar." — a rede inteira.', vai:'c9_via_foragido'},
    {texto:'"Só quero entender." — perguntar, anotar, não escolher lado.', vai:'c9_via_pesquisador'},
    {texto:'Levantar e ir embora sem responder.', vai:'c9_neutro'}
  ]
},

/* ---------------- AS QUATRO ROTAS ---------------- */

c9_via_mercenario:{
  texto:[
    '"Trabalhar pra você."',
    'Ela não comemora. Empurra um envelope pardo pela mesa, com dois dedos, como quem paga uma conta de luz.',
    '"Regra única: você não pergunta o que tem na caixa, e eu não pergunto o que você faz com o dinheiro."',
    '"Você vai carregar em rota, porque treinador em rota é invisível — ninguém para um moleque de mochila entre duas cidades. Você vai ter proteção nas cidades: se um guarda te encostar em Celadon, Fuchsia ou Saffron, você diz o nome do Palace e ele desencosta."',
    '"E se a Liga te parar de verdade, você me liga antes de abrir a boca. Antes. Não depois de explicar metade."',
    'O envelope é grosso. O primeiro sempre é.',
    'Você pega. E a coisa que te assusta não é pegar. É como é fácil.'
  ],
  ef:{dinheiro:12000, itens:{'Ultra Ball':3,'Hyper Potion':3,'Full Heal':2},
      rep:{eixo:'ruim',delta:3,motivo:'Entrou para a rede de Celadon'},
      flag:['via_definida','trabalha_para_terceira'], moral:-20,
      npc:{nome:'A Terceira', opiniao:5, memoria:'Você trabalha para ela desde Celadon.'},
      executar:d=>{ Historia.definirVia('mercenario','entrou para a rede da Terceira'); return [{tipo:'mundo', texto:'ROTA: Mercenário. Cidades vão te tratar como alguém que se resolve com dinheiro.'}]; },
      registrar:'Entrou para a rede da Terceira como transportador.',
      presagio:'Como é fácil. Guarde isso: a parte assustadora foi a facilidade.'},
  escolhas:[
    {texto:'Guardar o envelope e sair.', vai:'c9_fim'},
    {texto:'"Me mostra o armazém, já que eu trabalho aqui."', vai:'c9_dentro_limpo',
     ef:{flag:'entrou_como_funcionario'}},
    {texto:'"Qual é a primeira carga?"', vai:'c9_deposito'},
    {texto:'Perguntar do lote 41 antes de sair.', vai:'c9_o_lote_41', cond:d=>!!d.flags.viu_o_pregao}
  ]
},

c9_via_heroi:{
  texto:[
    '"Nada. Eu vim acabar com isso."',
    'Ela ouve a frase inteira sem interromper, o que é pior do que interromper.',
    'Depois faz uma coisa que você não esperava: ela diz onde é.',
    '"Zona de serviço, três quarteirões daqui, portão de enrolar azul. Armazém Geral 7. Vai hoje, porque amanhã de manhã descarrega e eu não vou poder te prometer nada."',
    '"Eu não vou te ajudar. Mas eu não vou te esconder o endereço, porque se você morrer num beco procurando, isso dá mais problema pra mim do que o armazém inteiro."',
    'Ela acende outro cigarro.',
    '"Uma coisa, de graça, porque você vai descobrir de qualquer jeito e é melhor descobrir antes: o que tem lá dentro está lá legalmente. Cada gaiola tem número de processo."',
    '"Boa sorte. Sério."'
  ],
  ef:{flag:['via_definida','sabe_do_deposito','terceira_te_respeita'],
      rep:{eixo:'bom',delta:2,motivo:'Recusou a rede de Celadon na cara da chefe'},
      npc:{nome:'A Terceira', opiniao:1, memoria:'Você recusou o emprego e ela te deu o endereço mesmo assim.'},
      registrar:'Recusou a proposta da Terceira. Ela deu o endereço do armazém.',
      executar:d=>{ Historia.definirVia('heroi','recusou a rede e foi atrás do armazém'); return [{tipo:'mundo', texto:'ROTA: Herói. As pessoas vão passar a esperar que você apareça quando tudo der errado.'}]; },
      presagio:'Cada gaiola tem número de processo. Ela te avisou porque sabe que isso é o que mais dói.'},
  escolhas:[
    {texto:'Ir ao armazém agora.', vai:'c9_deposito'},
    {texto:'Ligar pra Liga primeiro e ir junto.', vai:'c9_liga_deposito'},
    {texto:'Ligar pra Dra. Sayo antes.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir à junta comercial pegar os papéis antes.', vai:'c9_junta', ef:{flag:'sabe_do_cartorio'}}
  ]
},

c9_via_foragido:{
  texto:[
    '"Me dá tudo. Eu quero o lugar."',
    'O cassino continua barulhento em volta de vocês dois — máquina, ficha, alguém ganhando pouco e comemorando muito.',
    'Ela não pisca.',
    '"Você tem quinze anos."',
    '"E você tem uma rede que sobreviveu à queda da Rocket porque é pequena. Pequena demais pra uma pessoa só defender."',
    'Silêncio de uns oito segundos, que num cassino é muito tempo. Ela apaga o cigarro.',
    '"Certo." Ela se levanta e arruma o paletó. "Aqui é como funciona: eu não entrego nada. Você toma."',
    '"Se você tomar, é seu — e todo mundo que trabalha pra mim vai trabalhar pra você amanhã de manhã, porque ninguém aqui é leal, todo mundo aqui é pago, e folha de pagamento não tem sentimento."',
    '"O armazém é três quarteirões daqui. Portão azul. Vai lá tomar."',
    'Na porta, sem se virar: "E quando você tomar, vai descobrir que a parte difícil nunca foi tomar."'
  ],
  ef:{flag:['via_definida','sabe_do_deposito','quer_a_rede'],
      rep:{eixo:'ruim',delta:2,motivo:'Anunciou que vai tomar uma rede criminosa para si'},
      npc:{nome:'A Terceira', opiniao:-2, memoria:'Você disse, na cara dela, que queria o lugar dela.'},
      registrar:'Anunciou à Terceira que ia tomar a rede dela.',
      executar:d=>{ Historia.definirVia('foragido','anunciou que quer a rede'); return [{tipo:'mundo', texto:'ROTA: Foragido. Você não vai ser tratado como treinador de novo.'}]; },
      presagio:'A parte difícil nunca foi tomar. Ela não disse isso pra te assustar.'},
  escolhas:[
    {texto:'Ir ao armazém agora.', vai:'c9_deposito'},
    {texto:'Descer pelo subsolo, sem avisar ninguém.', vai:'c9_botao'},
    {texto:'Ir ao leilão primeiro. Quem manda lá é quem paga.', vai:'c9_cassino_por_baixo'},
    {texto:'Dormir. Amanhã cedo, com cabeça fria.', vai:'c9_deposito'}
  ]
},

c9_via_pesquisador:{
  texto:[
    '"Só quero entender."',
    'Ela ri — de verdade, curto, surpresa. "Essa é nova."',
    '"Então entende: nada disso funcionaria se não tivesse comprador. Você acha que eu sou o problema? Eu sou o meio de campo. Meio de campo não é problema de ninguém, é problema de todo mundo."',
    '"O problema é um senhor de Saffron que quer um Kabutops na sala porque o vizinho tem. O problema é uma empresa que precisa de material biológico vivo e não quer assinar formulário de origem."',
    '"E o problema é um fiscal que ganha um salário e assina cento e oitenta recolhimentos por ano."',
    'Ela escreve dois endereços num guardanapo. Um é o armazém. O outro é um prédio em Saffron.',
    '"Vai nos dois. Depois volta aqui e me diz qual dos dois te assustou mais. Eu tenho uma aposta comigo mesma e faz três anos que eu não perco."'
  ],
  ef:{flag:['via_definida','sabe_do_deposito','sabe_da_silph','guardanapo_terceira'],
      rep:{eixo:'bom',delta:1,motivo:'Escolheu entender antes de julgar'},
      npc:{nome:'A Terceira', opiniao:3, memoria:'Você disse que só queria entender. Ela achou isso interessante demais para mentir.'},
      executar:d=>{ Historia.definirVia('pesquisador','escolheu entender a rede inteira'); return [{tipo:'mundo', texto:'ROTA: Pesquisador. Você vai enxergar coisas que os outros caminhos não mostram — e vai demorar mais para agir.'}]; },
      registrar:'Escolheu investigar em vez de escolher lado. Dois endereços num guardanapo.',
      presagio:'Cento e oitenta recolhimentos por ano, assinados por uma pessoa. Some isso com o que você viu na junta.'},
  escolhas:[
    {texto:'Ir ao armazém primeiro.', vai:'c9_deposito'},
    {texto:'Ir à junta comercial ver de quem são os CNPJs.', vai:'c9_junta', ef:{flag:'sabe_do_cartorio'}},
    {texto:'Ir ao leilão. Comprador é o que ela disse que importa.', vai:'c9_cassino_por_baixo'},
    {texto:'Ir direto pra Saffron com o guardanapo.', vai:'c9_fim', ef:{flag:'pulou_deposito'}}
  ]
},

c9_neutro:{
  texto:[
    'Você levanta e vai embora no meio da frase dela.',
    'Ela não te impede. Não manda ninguém atrás. Não fala mais alto.',
    'Só volta a andar pelo cassino, parando em mesa, arrumando cadeira torta, cumprimentando velhinha pelo nome, como se a conversa nunca tivesse acontecido.',
    'Isso te incomoda mais do que ameaça incomodaria.',
    'Porque ameaça é reconhecimento. E o que ela te deu foi indiferença.'
  ],
  ef:{flag:'recusou_terceira', npc:{nome:'A Terceira', opiniao:0, memoria:'Você saiu no meio da conversa dela. Ela achou isso pouco interessante.'},
      presagio:'Indiferença. Você não representou risco suficiente pra merecer uma ameaça.'},
  escolhas:[
    {texto:'Procurar o armazém por conta própria.', vai:'c9_procurar'},
    {texto:'Descer pelo botão sem número.', vai:'c9_botao', cond:d=>!!d.flags.achou_o_subsolo || !!d.flags.sabe_do_lote_unico},
    {texto:'Resolver as pendências e sair da cidade.', vai:'c9_pendencias'},
    {texto:'Sair de Celadon.', vai:'c9_fim'}
  ]
},

c9_ataque_cedo:{
  texto:[
    'Você saca uma bola no meio do salão.',
    'Três seguranças estão em cima de você antes da bola abrir. Eles são educados de um jeito treinado: um segura seu pulso, outro se põe entre você e as mesas, o terceiro já está pedindo licença pros clientes.',
    'A mulher nem se mexe.',
    '"Aqui não", ela diz, sem irritação nenhuma. "Tem câmera, tem cliente, tem seguro. Lá fora eu não me importo."',
    'Eles te levam pela porta de serviço e te deixam no beco, com a mochila, sem tirar nada.',
    'Sem violência — o que é assustador de um jeito próprio.'
  ],
  ef:{hp:-3, causa:'Expulso do cassino de Celadon', flag:'atacou_no_cassino',
      npc:{nome:'A Terceira', opiniao:-3, memoria:'Você sacou uma bola no salão dela. Ela te achou desorganizado.'},
      presagio:'Sem tirar nada da sua mochila. Nem a câmera. Ninguém ali tem medo do que você tem.'},
  escolhas:[
    {texto:'Procurar o armazém.', vai:'c9_procurar'},
    {texto:'Voltar e conversar direito.', vai:'c9_cassino'},
    {texto:'Procurar a porta de serviço por onde eles te tiraram.', vai:'c9_cassino_por_baixo'},
    {texto:'Ir embora de Celadon.', vai:'c9_fim', ef:{flag:'recuou_celadon'}}
  ]
},

c9_o_que_e_o_pregao:{
  texto:[
    '"Tem um pregão acontecendo embaixo do seu carpete."',
    'Ela olha pra você por um tempo longo o bastante pra ficar desconfortável.',
    '"Tem", ela diz. "Quinzenal, terça, dezenove horas. Edital publicado em diário oficial com sete dias de antecedência, que ninguém lê porque diário oficial ninguém lê."',
    '"Você achou um leilão público, meu bem. Ele é secreto do mesmo jeito que a tabela de juros do banco é secreta: está escrito, em algum lugar, em letra que ninguém aguenta."',
    'Ela puxa uma cadeira pra você.',
    '"Senta. Você chegou na parte de dentro sem passar pela de fora, então eu vou ter que te explicar ao contrário."'
  ],
  ef:{flag:['sabe_que_e_publico','viu_o_pregao'],
      rep:{eixo:'bom',delta:2,motivo:'Chegou ao leilão antes de chegar a quem o opera'},
      npc:{nome:'A Terceira', opiniao:2, memoria:'Você achou o pregão sozinho antes de falar com ela.'},
      registrar:'O pregão é quinzenal, terça, 19h, com edital em diário oficial.',
      presagio:'Publicado em letra que ninguém aguenta. É assim que uma coisa fica escondida à vista.'},
  escolhas:[
    {texto:'Sentar e ouvir o negócio inteiro.', vai:'c9_proposta_terceira'},
    {texto:'"Isso que vocês fazem é legal?"', vai:'c9_e_legal'},
    {texto:'"O que é o lote 41?"', vai:'c9_o_lote_41'},
    {texto:'Não sentar. Sair e ir pro armazém.', vai:'c9_deposito'}
  ]
},

/* ─────────────── DENTRO DO PREGÃO ─────────────── */

c9_nao_tenho_credencial:{
  texto:[
    '"Não tenho."',
    'A mulher da prancheta — o crachá diz **AUDITORA M. PRADO · COMISSÃO DE BEM-ESTAR** — não se altera nem meio grau.',
    '"Então o senhor não pode dar lance." Ela olha a sua idade. "E o senhor também não poderia, de qualquer forma."',
    'Mas ela não te tira. Ela dá um passo de lado e abre espaço na parede dos fundos.',
    '"Assistir é público. Sessão pública é pública."',
    'E é isso: você fica encostado na parede dos fundos de um leilão que você levou um capítulo inteiro pra achar, e ele é aberto, e a servidora que preside faz questão de te informar do seu direito de assistir.',
    'O leiloeiro anuncia o lote 38. Uma senhora de tailleur levanta a plaquinha. Batido.',
    'Lote 39. Batido. Lote 40. Retirado por decisão judicial.',
    'Lote 41.'
  ],
  ef:{flag:['assistiu_o_pregao','conheceu_prado'],
      npc:{nome:'Auditora Nishino', opiniao:2, memoria:'Te deixou assistir ao pregão encostado na parede dos fundos.'},
      rep:{eixo:'bom',delta:1,motivo:'Assistiu a coisa inteira em vez de reagir'},
      registrar:'Auditora M. Nishino, da Comissão, preside o pregão de alienação.',
      presagio:'A Comissão preside. Não é a rede que leiloa: é o Estado que leiloa e a rede que compra.'},
  escolhas:[
    {texto:'"O que é o lote 41?"', vai:'c9_o_lote_41'},
    {texto:'Gritar pra sala inteira.', vai:'c9_gritou_no_pregao'},
    {texto:'Blefar. "Tenho credencial. Está com meu tutor."', vai:'c9_blefe'},
    {texto:'Sair no meio e ir pro armazém.', vai:'c9_dentro_limpo'}
  ]
},

c9_o_lote_41:{
  texto:[
    '"O que é o lote 41?"',
    'A Auditora Nishino consulta a prancheta sem pressa, e responde como se você fosse um adulto.',
    '"Lote 41. Espécime canino, macho, nível estimado vinte e oito. Procedência: recolhimento administrativo, processo quarenta e quatro mil duzentos e sete."',
    '"Recolhido em Lavender, dezembro. Tutor notificado por edital em janeiro. Prazo de manifestação: sessenta dias. Não houve manifestação."',
    '"Portanto: alienação."',
    'Ela vira a folha e você vê, de relance, que atrás tem mais quarenta linhas iguais.',
    '"O senhor tem alguma informação sobre o processo quarenta e quatro mil duzentos e sete?"',
    'E a pergunta é honesta. Ela está realmente perguntando.'
  ],
  ef:{flag:['sabe_do_lote_41','numero_da_gaveta'],
      registrar:'Lote 41: processo 44.207, recolhido em Lavender, tutor notificado só por edital.',
      presagio:'Notificado por edital. Quer dizer: publicaram num jornal que ele não lê e chamaram isso de avisar.'},
  escolhas:[
    {texto:'"O tutor está internado. Ele não viu edital nenhum."', vai:'c9_prado_conversa', cond:d=>!!d.flags.conhece_o_hideo || !!d.flags.copia_do_hideo},
    {texto:'"Eu quero dar lance no 41."', vai:'c9_arrematou_o_41'},
    {texto:'"Quem assinou esse recolhimento?"', vai:'c9_prado_conversa'},
    {texto:'Gritar pra sala inteira.', vai:'c9_gritou_no_pregao'}
  ]
},

c9_prado_conversa:{
  texto:[
    'Ela te leva pro corredor de azulejo, fora da sala, e fecha a porta dupla atrás de vocês.',
    'Longe do pregão ela envelhece uns cinco anos de uma vez.',
    '"Eu presido vinte e seis sessões por ano. Cada sessão tem entre trinta e cinquenta lotes."',
    '"Faz a conta: mil e duzentos animais por ano passam por essa prancheta, e eu leio o processo inteiro de uns quarenta."',
    '"Não é desculpa. É a descrição do serviço."',
    'Ela olha a porta.',
    '"E quem assina o recolhimento não é a Comissão inteira. É o fiscal da área. Em Kanto central, de oitenta e nove pra cá, quase tudo tem a mesma assinatura."',
    d=>d.flags.sabe_do_renno ? '"Você já sabe o nome." Ela não diz. Você já sabe o nome.' :
       'Ela não diz o nome. Escreve num canto de papel, dobra, e te entrega.',
    '"Se o tutor do 41 está vivo e internado, isso muda tudo. Mas eu não posso suspender uma alienação porque um menino de quinze anos me contou uma história no corredor."',
    '"Eu posso suspender se ele escrever. Com a letra dele, e com o número do processo, e com a data."'
  ],
  ef:{flag:['prado_te_ouviu','sabe_do_renno','prado_quer_documento'],
      npc:{nome:'Auditora Nishino', opiniao:5, memoria:'Te ouviu no corredor e te disse exatamente o que ela precisa para suspender uma alienação.'},
      rep:{eixo:'bom',delta:3,motivo:'Conseguiu que uma servidora da Comissão te ouvisse'},
      registrar:'A Auditora Nishino suspende a alienação se houver declaração escrita do tutor, com processo e data.',
      presagio:'Ela te disse o que precisa. Isso é raro e é a coisa mais útil que aconteceu nessa cidade.'},
  escolhas:[
    {texto:'Entregar a declaração do Hideo agora.', vai:'c9_prado_te_da_o_processo', cond:d=>!!d.flags.copia_do_hideo || !!d.flags.hideo_escreveu},
    {texto:'"Eu volto com isso escrito." E ir ao hospital.', vai:'c9_hospital'},
    {texto:'"E os outros mil e duzentos?"', vai:'c9_prado_te_da_o_processo'},
    {texto:'"E se eu simplesmente arrematar o 41?"', vai:'c9_arrematou_o_41'}
  ]
},

c9_prado_te_da_o_processo:{
  texto:[
    d=>d.flags.copia_do_hideo || d.flags.hideo_escreveu
      ? 'Você entrega a folha. Ela lê duas vezes, a segunda com o dedo acompanhando a linha, do jeito de quem confere número.'
      : '"E os outros mil e duzentos?" Ela fica calada tempo demais pra ser uma pausa.',
    d=>d.flags.copia_do_hideo || d.flags.hideo_escreveu
      ? '"Letra de pessoa com a mão ruim, escrita devagar, com o número certo do processo e a data de hoje." Ela dobra a folha. "Isso é documento."'
      : '"Os outros mil e duzentos estão dentro da lei", ela diz. "E é exatamente por isso que eu durmo mal."',
    'Ela abre a bolsa de couro gasta e tira um bloco de formulários carbonados.',
    'Preenche um na sua frente, apoiada na parede de azulejo, em letra de servidora — pequena, reta, sem enfeite.',
    d=>d.flags.copia_do_hideo || d.flags.hideo_escreveu
      ? '**SUSPENSÃO DE ALIENAÇÃO — LOTE 41 — PROC. 44.207 — MOTIVO: MANIFESTAÇÃO SUPERVENIENTE DO TUTOR**'
      : '**REQUISIÇÃO DE CÓPIA INTEGRAL — PROC. 44.207 — SOLICITANTE: A AUDITORIA**',
    'Ela destaca a via amarela e te entrega.',
    '"Guarda. Papel carbonado desbota, então não deixa no sol."',
    'E volta pra sala do pregão, e a porta se fecha, e do outro lado dá pra ouvir o leiloeiro chamando o lote 42.'
  ],
  ef:{flag:'papel_da_prado',
      itens:{'Via amarela da Auditoria':1},
      executar:d=>{
        if (d.flags.copia_do_hideo || d.flags.hideo_escreveu){
          Estado.marcar('lote_41_suspenso');
          return [{tipo:'mundo', texto:'A alienação do lote 41 está suspensa. Ele não vai a leilão.'}];
        }
        return [{tipo:'mundo', texto:'A Auditoria requisitou cópia integral do processo 44.207.'}];
      },
      rep:{eixo:'bom',delta:3,motivo:'Fez o sistema emitir um papel a seu favor'},
      registrar:'Saiu do pregão com uma via amarela da Auditoria.',
      presagio:'Papel carbonado desbota. Ela te avisou disso e isso vai importar.'},
  escolhas:[
    {texto:'Ir ao armazém buscar o lote 41 em pessoa.', vai:'c9_dentro_limpo'},
    {texto:'Ir ao hospital contar pro Hideo.', vai:'c9_hospital', cond:d=>!!d.flags.conhece_o_hideo},
    {texto:'Levar tudo à Dra. Sayo.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir à junta comercial com o nome que ela te deu.', vai:'c9_junta', ef:{flag:'sabe_do_cartorio'}}
  ]
},

c9_arrematou_o_41:{
  texto:[
    '"Eu quero dar lance no 41."',
    'A Auditora Nishino explica, sem ironia nenhuma, que menor não arremata. Mas que qualquer credenciado pode arrematar em nome de terceiro, e que credenciamento custa taxa e leva dez minutos, e que ela não vai credenciar você porque você tem quinze anos.',
    'E aí ela diz a coisa que resolve: "Mas o senhor pode consignar o valor em depósito judicial e o lote fica indisponível até decisão."',
    '"Quanto?"',
    '"Avaliação do 41: doze mil."',
    'Doze mil por um Growlithe que alguém perdeu porque não leu um jornal que ninguém lê.'
  ],
  ef:{presagio:'Doze mil. Reparou que ela te disse como fazer? Ela queria que alguém fizesse.'},
  escolhas:[
    {texto:'Consignar os doze mil. (12.000 ₽)', vai:'c9_consignou', cond:d=>d.jogador.dinheiro>=12000},
    {texto:'"Não tenho. Tem outro jeito?"', vai:'c9_prado_conversa'},
    {texto:'Gritar pra sala inteira.', vai:'c9_gritou_no_pregao'},
    {texto:'Ir ao armazém e tirar ele de lá sem pagar nada.', vai:'c9_dentro_limpo'}
  ]
},

c9_consignou:{
  texto:[
    'Você paga doze mil na boca do caixa de um leilão administrativo, numa sala de cassino, com recibo carbonado e tudo.',
    'A Auditora carimba. O leiloeiro anuncia, sem emoção: "Lote 41 — indisponível por consignação."',
    'A senhora de tailleur na terceira fileira abaixa a plaquinha e olha pra trás pra ver quem foi.',
    'Você segura o recibo com as duas mãos porque suas mãos estão tremendo e você não quer que ninguém veja.',
    'Comprou um. De quarenta e um.'
  ],
  ef:{dinheiro:-12000, flag:['consignou_o_41','salvou_o_41'],
      itens:{'Recibo de consignação':1},
      rep:{eixo:'bom',delta:3,motivo:'Usou o sistema contra ele mesmo e pagou do próprio bolso'},
      umaVez:'c09_p1', pokemon:{dex:58, nivel:28, opcoes:{moral:30, historia:'Lote 41. Você pagou doze mil numa sala de cassino para ele não ser vendido.'}},
      npc:{nome:'Auditora Nishino', opiniao:4, memoria:'Você consignou doze mil do próprio bolso pelo lote 41.'},
      registrar:'Consignou 12.000 ₽ e tirou o lote 41 do leilão.',
      presagio:'Um de quarenta e um. Essa fração vai te perseguir.'},
  escolhas:[
    {texto:'Ir ao armazém buscar os outros quarenta.', vai:'c9_dentro_limpo'},
    {texto:'Perguntar à Auditora quem assina os recolhimentos.', vai:'c9_prado_conversa'},
    {texto:'Ir ao hospital contar pro Hideo.', vai:'c9_hospital', cond:d=>!!d.flags.conhece_o_hideo},
    {texto:'Sair dali. Você precisa de ar.', vai:'c9_cidade2'}
  ]
},

c9_blefe:{
  texto:[
    '"Tenho. Está com meu tutor, ele foi ao carro."',
    'Você diz isso de uniforme de rota, com mochila de acampamento e barro seco na bota, numa sala onde todo mundo está de terno.'
  ],
  teste:{status:'carisma', dificuldade:8, nomeStatus:'Carisma',
         critico:'c9_blefe_credencial_ok', sucesso:'c9_blefe_credencial_ok',
         parcial:'c9_blefe_credencial_meio', falha:'c9_expulso_do_pregao'}
},

c9_blefe_credencial_ok:{
  texto:[
    'Funciona, e funciona pelo pior motivo possível: ela acredita que existe um adulto.',
    '"Ah. Então o senhor aguarda aqui na lateral que eu confiro quando ele subir."',
    'Ela volta pra frente da sala e te deixa em pé na lateral, com vista pro leiloeiro, pra plateia e pra parede projetada.',
    'Você fica quarenta minutos vendo trinta e duas pessoas adultas comprarem seres vivos por número de processo, com plaquinha numerada, em ordem crescente.',
    'Lote 38, 39, 40, 41, 42.',
    'E a coisa pior não é a compra. É o café. Tem uma mesa com garrafa térmica e biscoito de polvilho no fundo da sala, e nos intervalos as pessoas vão lá, se servem, conversam sobre trânsito.'
  ],
  ef:{flag:['assistiu_o_pregao','blefou_no_pregao'],
      rep:{eixo:'bom',delta:2,motivo:'Entrou no pregão na cara dura e ficou até o fim'},
      registrar:'Assistiu ao pregão inteiro de dentro da sala.',
      presagio:'Biscoito de polvilho. Guarde o biscoito de polvilho, é ele que você vai lembrar daqui a dez anos.'},
  escolhas:[
    {texto:'Procurar a Auditora e perguntar do lote 41.', vai:'c9_o_lote_41'},
    {texto:'Gritar pra sala inteira.', vai:'c9_gritou_no_pregao'},
    {texto:'Fotografar de dentro.', vai:'c9_fotografou_leilao', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Sair no fim e ir pro armazém.', vai:'c9_dentro_limpo'}
  ]
},

c9_blefe_credencial_meio:{
  texto:[
    '"Hum." Ela anota alguma coisa na prancheta. "Qual o nome do credenciado?"',
    'Você diz um nome. Qualquer nome. Um nome de pessoa que não existe, inventado com a boca seca em três quartos de segundo.',
    'Ela procura na lista, não acha, e faz a cara de quem já entendeu tudo e está decidindo o que fazer com isso.',
    'Decide o seguinte: te leva pelo cotovelo até a parede dos fundos e te encosta lá.',
    '"O senhor assiste. Sessão pública é pública." Voz baixa. "E depois o senhor e eu vamos conversar no corredor."',
    'Ela volta pra frente da sala.',
    'Você passa os quarenta minutos seguintes sabendo que tem uma conversa marcada.'
  ],
  ef:{flag:['assistiu_o_pregao','prado_te_pegou','conheceu_prado'],
      npc:{nome:'Auditora Nishino', opiniao:1, memoria:'Te pegou mentindo sobre credencial e te deixou assistir mesmo assim.'},
      registrar:'Foi pego mentindo no pregão. A Auditora te encostou na parede dos fundos e marcou uma conversa.'},
  escolhas:[
    {texto:'Esperar e ter a conversa no corredor.', vai:'c9_prado_conversa'},
    {texto:'"O que é o lote 41?" antes que acabe.', vai:'c9_o_lote_41'},
    {texto:'Gritar pra sala inteira.', vai:'c9_gritou_no_pregao'},
    {texto:'Escapar antes da conversa.', vai:'c9_expulso_do_pregao'}
  ]
},

c9_expulso_do_pregao:{
  texto:[
    'Não cola.',
    'Ela nem discute — chama a segurança com dois dedos, sem levantar a voz, e a segurança é a mesma do cassino, educada e treinada.',
    'Eles te levam pelo corredor de azulejo, pela doca, e te colocam na rua por uma porta de aço que fecha com um estalo de barra antipânico.',
    'Do lado de fora é uma rua de serviço, dez e meia da noite, sem ninguém.',
    'Você tem tudo na mochila ainda. Ninguém revistou. Ninguém pediu seu nome.',
    'Foi uma expulsão de gente que trata expulsão como tarefa administrativa.'
  ],
  ef:{flag:'expulso_do_pregao', hp:-2, causa:'Retirado do pregão',
      npc:{nome:'Auditora Nishino', opiniao:-1, memoria:'Te mandou retirar do pregão por credencial falsa.'},
      presagio:'Ninguém pediu seu nome. Você não é um risco. Ainda.'},
  escolhas:[
    {texto:'Dar a volta e ir pro armazém.', vai:'c9_deposito'},
    {texto:'Voltar pelo subsolo.', vai:'c9_botao'},
    {texto:'Entrar no cassino pela frente e falar com a chefe.', vai:'c9_cassino'},
    {texto:'Ir embora. Amanhã você pensa.', vai:'c9_cidade2'}
  ]
},

c9_gritou_no_pregao:{
  texto:[
    'Você grita.',
    'Grita que são seres vivos, que tem um número de processo colado numa gaiola, que o tutor do 41 está num hospital em Lavender e não leu edital nenhum, que todo mundo ali sabe.',
    'A sala inteira se vira.',
    'E aí acontece a pior coisa que podia acontecer: ninguém se envergonha.',
    'Trinta e duas pessoas olham pra você com uma paciência educada de quem já ouviu isso, e depois voltam pro leiloeiro, porque o pregão continua e o lote 42 está sendo anunciado.',
    'Duas pessoas te dão razão em voz baixa. Uma delas dá o lance no 42.',
    'A segurança te tira pelo corredor de azulejo, e no caminho a Auditora Nishino te acompanha até a porta e diz, sem olhar pra você:',
    '"Eu presido vinte e seis sessões por ano. O senhor é o quarto a fazer isso." Pausa. "E o primeiro que sabia o número do processo."'
  ],
  ef:{flag:['gritou_no_pregao','conheceu_prado','sabe_do_lote_41'],
      rep:{eixo:'bom',delta:2,motivo:'Gritou numa sala onde todo mundo achava normal'},
      hp:-2, causa:'Retirado do pregão à força', instabilidade:1, moral:-10,
      npc:{nome:'Auditora Nishino', opiniao:3, memoria:'Você gritou no pregão dela. Foi o quarto em treze anos e o único que sabia o número do processo.'},
      registrar:'Gritou no pregão de Celadon. Ninguém se envergonhou.',
      presagio:'O quarto a fazer isso. Quer dizer que já teve três, e que o pregão continua.'},
  escolhas:[
    {texto:'"Então me diz como eu paro isso." — falar com ela no corredor.', vai:'c9_prado_conversa'},
    {texto:'Ir pro armazém agora, com raiva.', vai:'c9_deposito'},
    {texto:'Ir pro armazém por baixo, pela doca.', vai:'c9_dentro_limpo'},
    {texto:'Ir pro cassino falar com quem manda.', vai:'c9_cassino'}
  ]
},

/* ─────────────── O ARMAZÉM ─────────────── */

c9_deposito:{
  texto:[
    'Zona de serviço, vinte e três e quarenta. Portão de enrolar azul, sem placa de nome, com câmera nova e placa de alvará.',
    'A rua inteira aqui é assim: sem vitrine, sem calçada decente, com caçamba e poste de luz alta que faz sombra dura.',
    'Dá pra ouvir de fora o gerador. E, por baixo do gerador, um som contínuo que não é máquina — é um som de muitas coisas pequenas se mexendo em espaços pequenos, e ele não para nunca, ele só muda de volume.',
    d=>Historia.via()==='foragido' ? 'Você não veio fechar isso. Você veio pegar isso. É uma diferença que muda tudo o que você vai fazer nos próximos vinte minutos, inclusive quem você vai ser depois deles.' :
       Historia.via()==='pesquisador' ? 'Você veio ver. Se você só ver, vai ter que viver com isso. Se você agir, vai perder o que ainda não entendeu.' :
       Historia.via()==='mercenario' ? 'Você tem a chave, agora. Isso devia deixar a coisa mais fácil e está deixando pior.' :
       'São quatro pessoas lá dentro, no mínimo, contando pelas vozes. Você é um.'
  ],
  ef:{flag:'chegou_no_armazem',
      presagio:'Ele não para nunca. Ele só muda de volume.'},
  escolhas:[
    {texto:'Entrar pela frente. Sem plano.', vai:'c9_frente'},
    {texto:'Procurar outra entrada.', vai:'c9_lateral'},
    {texto:'Esperar o caminhão chegar e entrar junto com a carga.', vai:'c9_caminhao'},
    {texto:'Chamar a Liga agora e esperar na esquina.', vai:'c9_liga_deposito'},
    {texto:'Ir embora.', vai:'c9_fim', ef:{flag:'desistiu_deposito', rep:{eixo:'ruim',delta:1,motivo:'Chegou até a porta e voltou'}}}
  ]
},

c9_lateral:{
  texto:[
    'Você dá a volta no quarteirão inteiro procurando um jeito que não seja o portão azul.',
    'Tem: uma escada de incêndio parafusada na lateral, com o primeiro lance levantado a dois metros e meio do chão; uma janela basculante de banheiro no alto; e uma porta de serviço que dá pro pátio dos fundos, com trinco de correr por dentro.',
    'A porta de serviço é a melhor. E a melhor coisa dela é a fresta embaixo, de uns dois centímetros, por onde sai luz e sai o som.'
  ],
  teste:{status:'percepcao', dificuldade:7, nomeStatus:'Percepção',
         critico:'c9_dentro_limpo', sucesso:'c9_dentro_limpo', parcial:'c9_dentro_visto', falha:'c9_frente'}
},

c9_caminhao:{
  texto:[
    'O caminhão chega às vinte e três e cinquenta e oito, dois minutos antes do horário — o que é raro e diz que o motorista faz essa rota há anos.',
    'O portão de enrolar abre com motor, devagar, e leva onze segundos pra subir inteiro.',
    'Você tem quatro segundos entre o portão abrir o suficiente e o farol varrer a rua.'
  ],
  teste:{status:'sorte', dificuldade:7, nomeStatus:'Sorte',
         critico:'c9_dentro_limpo', sucesso:'c9_dentro_limpo', parcial:'c9_dentro_visto', falha:'c9_dentro_visto'}
},

c9_dentro_limpo:{
  texto:[
    'Você entra sem ninguém ver.',
    'O armazém é maior por dentro, como todo armazém. Pé-direito de sete metros, prateleira industrial nos dois lados, empilhadeira com o carregador ligado, e um escritório de compensado com janela de vidro no canto.',
    'E no fundo — a parte que importa — três fileiras de gaiola em estrutura de aço galvanizado, do chão ao teto, em quatro níveis.',
    'Quarenta e uma gaiolas ocupadas. Você conta duas vezes porque não acredita na primeira.',
    'Cada uma tem uma plaqueta de plástico presa com abraçadeira. Na plaqueta: espécie, data de entrada, e um número de processo.',
    'Não tem sangue. Não tem sujeira. Tem bebedouro automático, tem ficha de limpeza assinada com data e hora de hoje, tem termômetro na parede marcando vinte e dois graus.',
    'É limpo. É o que ninguém te contou: é limpo, e é organizado, e é exatamente por isso que dura.',
    'Numa mesa perto da porta: pranchetas, uma caixa de Poké Balls vazias lacrada, e um livro de registro de destino. Metade dos destinos é fora de Kanto.'
  ],
  ef:{flag:['dentro_do_deposito','contou_gaiolas'],
      registrar:'Entrou no Armazém Geral 7. Quarenta e uma gaiolas, todas com número de processo.',
      presagio:'Ficha de limpeza assinada hoje. Alguém cuida bem deles até o dia em que são vendidos.'},
  escolhas:[
    {texto:'Abrir todas as gaiolas de uma vez.', vai:'c9_abriu_tudo'},
    {texto:'Fotografar tudo e sair sem tocar em nada.', vai:'c9_documentou'},
    {texto:'Pegar o livro de destinos e sair.', vai:'c9_livro'},
    {texto:'Cortar a energia do prédio primeiro.', vai:'c9_energia'},
    {texto:'Procurar a gaiola do processo 44.207.', vai:'c9_gaiola_41', cond:d=>!!d.flags.numero_da_gaveta || !!d.flags.sabe_do_lote_41},
    {texto:'Assumir o lugar: chamar os funcionários e dar uma ordem.', vai:'c9_tomou', cond:d=>!!d.flags.quer_a_rede}
  ]
},

c9_gaiola_41:{
  texto:[
    'Você anda a fileira inteira lendo plaqueta.',
    'Fileira A: dezesseis. Fileira B: quatorze. Fileira C, terceiro nível, quinta gaiola:',
    '**PROC. 44.207 · ENTRADA 12/12 · CUSTÓDIA**',
    'É um Growlithe. Ele está deitado de lado, acordado, olhando a parede.',
    'Quando você chega perto ele levanta a cabeça, olha pra você, e faz uma coisa que arrebenta você por dentro: ele balança o rabo duas vezes e para.',
    'Duas vezes. Como quem já fez isso muitas vezes por muita gente que passou e não era quem ele esperava.',
    d=>d.flags.lote_41_suspenso ? 'Na plaqueta, colado por cima, tem um adesivo amarelo novo: SUSPENSO — AUDITORIA.' :
       d.flags.conhece_o_hideo ? 'O tutor dele se chama Hideo. Está num hospital em Lavender com a mão ruim, e você sabe disso, e ele não sabe que você sabe.' :
       'A data de entrada é doze de dezembro. Faz nove meses.'
  ],
  ef:{flag:['achou_o_growlithe','viu_o_44207'],
      moral:-5,
      registrar:'Achou a gaiola do processo 44.207: um Growlithe, fileira C, nível 3.',
      presagio:'Duas vezes e parou. Ele aprendeu a não esperar muito.'},
  escolhas:[
    {texto:'Abrir a gaiola dele e só a dele.', vai:'c9_so_o_41'},
    {texto:'Abrir todas.', vai:'c9_abriu_tudo'},
    {texto:'Fotografar a plaqueta e sair.', vai:'c9_documentou'},
    {texto:'Não abrir. Voltar com a via amarela da Auditoria.', vai:'c9_documentou',
     ef:{flag:'nao_abriu_o_41', rep:{eixo:'bom',delta:1,motivo:'Não abriu a gaiola porque queria fazer do jeito que fica de pé'}}}
  ]
},

c9_so_o_41:{
  texto:[
    'Você abre a trava, que é uma trava de ferrolho comum, dessas de portão de casa.',
    'Ele não sai correndo. Ele sai andando, devagar, e senta no corredor de concreto entre as fileiras, e olha as outras gaiolas.',
    'Você tem que carregar ele nos últimos vinte metros porque ele não quer andar mais.',
    'Lá fora, na rua de serviço, às onze e quarenta da noite, você senta no meio-fio com um Growlithe de nove meses de gaiola no colo e quarenta gaiolas ainda cheias atrás daquela parede.',
    'Você salvou um. Isso é verdade e é tudo o que é.'
  ],
  ef:{flag:['tirou_o_41','salvou_o_41'],
      rep:{eixo:'bom',delta:2,motivo:'Tirou um do armazém com as próprias mãos'},
      umaVez:'c09_p1', pokemon:{dex:58, nivel:28, opcoes:{moral:25, historia:'Processo 44.207. Você abriu a gaiola dele às onze e quarenta da noite e carregou ele os últimos vinte metros.'}},
      moral:-5, instabilidade:1,
      registrar:'Tirou o Growlithe do processo 44.207 do armazém. Os outros quarenta ficaram.',
      presagio:'Quarenta ficaram. Essa é a conta que você vai refazer a vida inteira.'},
  escolhas:[
    {texto:'Voltar e abrir todas.', vai:'c9_abriu_tudo'},
    {texto:'Ir embora com ele.', vai:'c9_saiu_cedo'},
    {texto:'Ir à Auditora Nishino com ele no colo.', vai:'c9_prado_conversa'},
    {texto:'Ir à Dra. Sayo.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c9_dentro_visto:{
  texto:[
    'Você entra, e na terceira fileira de gaiolas alguém acende a luz do corredor.',
    'Não tem grito. Tem uma voz calma de quem trabalha aqui e está resolvendo mais uma coisa do turno.',
    '"Ô." Pausa. "Você não é da equipe."',
    'Três homens. De uniforme com logo bordado, botina de segurança, crachá. Um deles já tem a bola na mão e os outros dois não — o que é pior, porque quer dizer que um resolve.'
  ],
  ef:{flag:'dentro_do_deposito'},
  escolhas:[
    {texto:'Lutar.', vai:'c9_luta_deposito'},
    {texto:'"A Terceira me mandou." Blefar.', vai:'c9_blefe_rede'},
    {texto:'Correr para as gaiolas e abrir o máximo que der.', vai:'c9_corrida_gaiolas'},
    {texto:'"Eu vim pelo processo 44.207." Dizer a verdade.', vai:'c9_verdade_no_armazem'}
  ]
},

c9_verdade_no_armazem:{
  texto:[
    '"Eu vim pelo processo quarenta e quatro mil duzentos e sete."',
    'Os três param.',
    'O mais velho — o que não estava com a bola na mão — coça a nuca e faz uma pergunta que você não esperava:',
    '"Você é da família?"',
    'E a pergunta é honesta. Ele acha normal que apareça alguém procurando um número, porque já aconteceu antes.',
    '"Olha, garoto." Ele baixa a mão do outro, a que tem a bola. "Aqui é custódia. A gente guarda, alimenta e entrega. Se tem gente da família, tem que ir na Comissão, não aqui."',
    '"Se você entrar e tirar, eu perco o emprego e o bicho volta, porque ele tem número."',
    'Ele diz isso sem raiva. É a coisa mais difícil de ouvir da noite inteira.'
  ],
  ef:{flag:['falou_com_os_funcionarios','sabe_que_volta'],
      rep:{eixo:'bom',delta:2,motivo:'Disse a verdade num lugar onde ninguém diz'},
      npc:{nome:'Encarregado do Armazém 7', opiniao:2, memoria:'Você disse a verdade em vez de blefar. Ele não chamou ninguém.'},
      registrar:'Os funcionários do armazém são contratados de custódia. Tirar um de lá faz ele voltar.',
      presagio:'Ele volta porque ele tem número. Enquanto o número existir, ele volta.'},
  escolhas:[
    {texto:'"Então me mostra ele. Só isso."', vai:'c9_gaiola_41'},
    {texto:'"Me deixa fotografar tudo."', vai:'c9_documentou'},
    {texto:'"Me dá o livro de destinos."', vai:'c9_livro'},
    {texto:'Abrir tudo mesmo assim.', vai:'c9_abriu_tudo'}
  ]
},

c9_frente:{
  texto:[
    'Você bate no portão azul.',
    'Silêncio de cinco segundos — tempo de alguém largar o que estava fazendo. Depois a porta social abre e tem quatro pessoas do outro lado que claramente não esperavam ninguém bater.',
    '"Boa noite", diz o mais velho.',
    'Ele não parece bravo. Parece contrariado, como quem vai ter que refazer uma planilha.'
  ],
  escolhas:[
    {texto:'Lutar.', vai:'c9_luta_deposito'},
    {texto:'"A Terceira me mandou." Blefar.', vai:'c9_blefe_rede'},
    {texto:'"Eu vim comprar." Blefar para o outro lado.', vai:'c9_blefe_comprador'},
    {texto:'"Eu vim pelo processo 44.207." A verdade.', vai:'c9_verdade_no_armazem'}
  ]
},

c9_blefe_rede:{
  texto:[
    '"A Terceira me mandou."',
    'Você fala isso com uma segurança que não tem e um sotaque de quem não é dali.'
  ],
  teste:{status:'carisma', dificuldade:8, nomeStatus:'Carisma',
         critico:'c9_blefe_ok', sucesso:'c9_blefe_ok', parcial:'c9_blefe_meio', falha:'c9_luta_deposito'}
},

c9_blefe_ok:{
  texto:[
    'Funciona. Funciona porque ninguém ali quer ser a pessoa que barrou alguém que a chefe mandou.',
    '"Ela podia avisar." O mais velho já está voltando pro que estava fazendo, que é conferir uma prancheta contra uma prateleira. "Fica longe da fileira C, tá com bicho novo e eles mordem."',
    '"E não abre gaiola. Se abrir gaiola eu tenho que preencher ocorrência e a ocorrência vai pro meu nome."',
    'Ele volta a conferir a prancheta.',
    'Você tem, talvez, dez minutos antes de alguém pensar melhor e pegar o telefone.'
  ],
  ef:{flag:['dentro_do_deposito','blefou_bem']},
  escolhas:[
    {texto:'Abrir todas as gaiolas de uma vez.', vai:'c9_abriu_tudo'},
    {texto:'Fotografar tudo e sair.', vai:'c9_documentou'},
    {texto:'Pegar o livro de destinos.', vai:'c9_livro'},
    {texto:'Cortar a energia.', vai:'c9_energia'},
    {texto:'Ir direto na fileira C achar o 44.207.', vai:'c9_gaiola_41', cond:d=>!!d.flags.numero_da_gaveta || !!d.flags.sabe_do_lote_41}
  ]
},

c9_blefe_meio:{
  texto:[
    'Eles quase acreditam. "Quase", aqui, significa que um deles sai da sala pra ligar.',
    'Você vê pela janela do escritório de compensado: ele pega o telefone fixo, disca um número curto — número interno — e espera.',
    'Você tem o tempo de uma ligação. Se atenderem, três minutos. Se não atenderem, talvez oito.'
  ],
  ef:{flag:['dentro_do_deposito','tempo_curto']},
  escolhas:[
    {texto:'Abrir as gaiolas agora, rápido.', vai:'c9_corrida_gaiolas'},
    {texto:'Cortar a energia.', vai:'c9_energia'},
    {texto:'Pegar o livro de destinos e correr.', vai:'c9_livro'},
    {texto:'Sair enquanto dá.', vai:'c9_saiu_cedo'}
  ]
},

c9_blefe_comprador:{
  texto:[
    '"Eu vim comprar."',
    'O mais velho te mede da cabeça ao pé — roupa de rota, mochila surrada, bota de barro, quinze anos.',
    '"Comprar."',
    'Ele não ri, o que é pior.',
    '"Com quê?"'
  ],
  escolhas:[
    {texto:'Mostrar o dinheiro. (precisa de 10.000 ₽)', vai:'c9_comprador_ok', cond:d=>d.jogador.dinheiro>=10000},
    {texto:'Mostrar a via amarela da Auditoria.', vai:'c9_verdade_no_armazem', cond:d=>!!d.flags.papel_da_prado},
    {texto:'Blefar de novo, com o nome da chefe.', vai:'c9_blefe_rede'},
    {texto:'Desistir do blefe e lutar.', vai:'c9_luta_deposito'}
  ]
},

c9_comprador_ok:{
  texto:[
    'Você mostra o maço.',
    'O clima muda instantaneamente. Dinheiro é a única identidade que esse lugar reconhece, e você acabou de apresentar documento.',
    '"Então tá." Ele pega uma prancheta e te entrega. "Anota o que interessar que eu vejo se pode."',
    'Eles te deixam andar entre as gaiolas escolhendo, com uma prancheta na mão, como quem escolhe fruta.',
    'Quarenta e uma gaiolas. Você anda por todas, porque tem que andar, porque você pediu isso.',
    'Isso vai ficar com você.'
  ],
  ef:{flag:['dentro_do_deposito','andou_entre_as_gaiolas'], moral:-10,
      presagio:'Você pediu pra andar entre as gaiolas com uma prancheta. Foi ideia sua.'},
  escolhas:[
    {texto:'Comprar um. Tirar pelo menos um dali. (10.000 ₽)', vai:'c9_comprou_um'},
    {texto:'Fingir que desistiu, sair, e voltar pela lateral.', vai:'c9_lateral'},
    {texto:'Largar o dinheiro no chão e abrir todas as gaiolas.', vai:'c9_abriu_tudo',
     ef:{dinheiro:-10000, rep:{eixo:'bom',delta:2,motivo:'Trocou todo o dinheiro por um instante de caos'}}},
    {texto:'Procurar a plaqueta 44.207 na prancheta.', vai:'c9_gaiola_41', cond:d=>!!d.flags.numero_da_gaveta || !!d.flags.sabe_do_lote_41}
  ]
},

c9_comprou_um:{
  texto:[
    'Você paga e eles te entregam uma bola com um adesivo numerado e uma via de recibo.',
    'O recibo tem CNPJ, tem descrição do bem, tem imposto destacado.',
    'Você sai andando entre as outras quarenta gaiolas com a sua na mão e o recibo no bolso.',
    'Salvar um é melhor que salvar nenhum. Essa frase é verdadeira e não ajuda absolutamente nada agora.'
  ],
  ef:{dinheiro:-10000, flag:'comprou_do_deposito',
      umaVez:'c09_p2',
      executar:d=>{
        const p = criarPokemon(Dados.escolher([123,127,113,115,131,143,137,142]), Dados.entre(26,34),
          {moral:20, historia:'Comprado numa gaiola de armazém em Celadon, com nota fiscal. Tinha um número colado na bola.'});
        const onde = Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${p.nome} (Nv ${p.nivel}) saiu do armazém. Os outros quarenta não.${notaDestino(onde)}`}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Comprou um Pokémon de custódia — mesmo para salvá-lo'},
      registrar:'Comprou um do armazém, com nota fiscal.',
      presagio:'Imposto destacado. Você pagou imposto nisso.'},
  escolhas:[
    {texto:'Sair.', vai:'c9_fim'},
    {texto:'Voltar pela lateral e abrir as outras.', vai:'c9_lateral'},
    {texto:'Levar o recibo à Dra. Sayo.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar o recibo à Liga.', vai:'c9_liga_celadon'}
  ]
},

c9_energia:{
  texto:[
    'O quadro de força fica no corredor lateral, num armário de chapa com adesivo de risco elétrico meio descascado.',
    'Você desliga a chave geral.',
    'O armazém inteiro apaga. O gerador leva onze segundos pra ligar — você conta os onze.',
    'Onze segundos de escuro total com quarenta e uma gaiolas cheias.',
    'Na escuridão o som muda. Para de ser abafado e vira outra coisa: quarenta e um ao mesmo tempo, sem uma luz pra se orientar, num galpão de sete metros de pé-direito que devolve tudo em eco.',
    'São os piores onze segundos da sua vida até aqui e você vai ouvir eles de novo quando tentar dormir.',
    'Quando o gerador pega, as travas magnéticas das gaiolas estão todas abertas. Elas abrem por falta de energia — é norma de segurança contra incêndio.',
    'A lei que fez isso ser assim foi escrita pra proteger eles. E acabou de virar a sua ferramenta.'
  ],
  ef:{flag:'cortou_energia', moral:-10,
      presagio:'A norma de segurança abriu as travas. O sistema tem uma parte que funciona.'},
  escolhas:[
    {texto:'Abrir o portão de carga antes que alguém reaja.', vai:'c9_abriu_tudo'},
    {texto:'Pegar o livro de destinos no escuro.', vai:'c9_livro'},
    {texto:'Ir direto na fileira C.', vai:'c9_gaiola_41', cond:d=>!!d.flags.numero_da_gaveta || !!d.flags.sabe_do_lote_41},
    {texto:'Sair antes do gerador pegar.', vai:'c9_saiu_cedo'}
  ]
},

c9_abriu_tudo:{
  texto:[
    'Você abre o portão de carga e sai da frente.',
    'O que acontece nos dois minutos seguintes não é resgate. É evacuação.',
    'Quarenta e um Pokémon de espécies que nunca dividiram um espaço saem ao mesmo tempo por uma porta de três metros. Tem atropelamento. Tem briga na saída. Tem dois que voltam pra dentro porque a rua é grande demais.',
    'Dois funcionários tentam conter e desistem rápido — ninguém é pago o suficiente pra isso, e os dois têm família, e os dois sabem que a empresa tem seguro.',
    'Vinte e nove chegam na rua. Seis ficam no armazém, escondidos atrás da empilhadeira, porque não sabem o que fazer com espaço aberto.',
    'Os outros seis não conseguem andar.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Esvaziou o armazém de Celadon'},
      flag:'esvaziou_deposito', instabilidade:1,
      npc:{nome:'A Terceira', opiniao:-4, memoria:'Você esvaziou o armazém dela em Celadon. Prejuízo real, com seguro, o que é pior — deu trabalho.'},
      registrar:'Esvaziou o armazém de Celadon: 29 escaparam, 6 ficaram, 6 não conseguiram andar.',
      presagio:'Dois voltaram pra dentro sozinhos. Pensa no que isso quer dizer.'},
  escolhas:[
    {texto:'Ficar e carregar os seis que não andam.', vai:'c9_carregou_seis'},
    {texto:'Sair agora. A polícia vem, a imprensa vem, e você não pode estar aqui.', vai:'c9_saiu_cedo'},
    {texto:'Pegar o livro de destinos antes de sair.', vai:'c9_livro'},
    {texto:'Incendiar o armazém vazio.', vai:'c9_incendio'}
  ]
},

c9_carregou_seis:{
  texto:[
    'Você fica.',
    'Faz seis viagens até a esquina, uma por vez, com uma manta de mudança encontrada no chão do armazém.',
    'Na primeira viagem você ainda tem pressa. Na terceira você já entendeu que pressa não ajuda em nada e começa a fazer direito: apoiar a cabeça, não dobrar a pata, ir devagar.',
    'Na quarta viagem os funcionários já foram embora e você está sozinho num armazém aberto às duas da manhã com o gerador ligado e o portão levantado.',
    'Na sexta, chega a polícia.',
    'Eles te encontram sentado no meio-fio com um Lickitung desidratado no colo, molhando o pescoço dele com água de garrafa, do jeito errado, porque ninguém nunca te ensinou o jeito certo.',
    'O oficial mais novo pergunta o que aconteceu.',
    'O mais velho olha o interior do armazém, olha as plaquetas com número de processo, olha a ficha de limpeza assinada, e responde por você:',
    '"Aconteceu isso aí."'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Ficou até o fim, carregando quem não podia andar'},
      hp:-5, causa:'Exaustão em Celadon',
      flag:'carregou_os_seis',
      umaVez:'c08-09_p4', pokemon:{dex:108, nivel:28, opcoes:{moral:55, historia:'Você o carregou numa manta de mudança, sozinho, às duas da manhã em Celadon.'}},
      registrar:'Carregou os seis que não andavam. A polícia te encontrou no meio-fio.',
      presagio:'"Aconteceu isso aí." Ele viu as plaquetas e não fez nenhuma pergunta sobre elas.'},
  escolhas:[
    {texto:'Ir embora quando deixarem.', vai:'c9_fim'},
    {texto:'Dar depoimento e dar o nome do que você viu no pregão.', vai:'c9_liga_celadon', cond:d=>!!d.flags.viu_o_pregao},
    {texto:'Ligar pra Dra. Sayo antes de qualquer depoimento.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Não dar depoimento. Sair andando.', vai:'c9_saiu_cedo'}
  ]
},

c9_saiu_cedo:{
  texto:[
    'Você sai antes de qualquer coisa chegar. É a decisão certa e não parece.',
    'De três quarteirões de distância dá pra ouvir a sirene. De seis, não dá mais.',
    'Você anda até uma praça e senta num banco e fica lá até clarear, sem dormir, olhando um canteiro de planta que alguém da prefeitura poda de quinze em quinze dias há quarenta anos.',
    'De manhã, o jornal de Celadon fala em "ocorrência em armazém da zona de serviço" na página cinco, com quatro parágrafos, e não cita ninguém.',
    'Você é uma ausência na notícia.'
  ],
  ef:{flag:'saiu_antes',
      presagio:'Página cinco, quatro parágrafos. É esse o tamanho que a coisa tem pra quem não estava lá.'},
  escolhas:[
    {texto:'Seguir viagem.', vai:'c9_fim'},
    {texto:'Resolver as pendências antes de sair da cidade.', vai:'c9_pendencias'},
    {texto:'Voltar ao cassino e olhar na cara dela.', vai:'c9_cassino'},
    {texto:'Ir à Dra. Sayo.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c9_incendio:{
  texto:[
    'Você incendeia.',
    'O armazém é de alvenaria e o fogo não se espalha pro quarteirão — você verifica isso antes, com atenção, olhando a distância pro prédio vizinho e o sentido do vento.',
    'Verificar antes diz uma coisa esquisita sobre você.',
    'Os seis que não conseguiam andar estavam lá dentro.',
    'Você lembra disso depois. Não durante.'
  ],
  ef:{rep:{eixo:'ruim',delta:4,motivo:'Incendiou um armazém com Pokémon feridos dentro'},
      flag:['incendiou_deposito','tem_sangue_nas_maos'], instabilidade:2, moral:-25,
      executar:d=>{ Estado.dados.liga.avisos++; return [{tipo:'liga', texto:'A Liga Pokémon abriu inquérito sobre o incêndio de Celadon.'}]; },
      registrar:'Incendiou o armazém de Celadon com seis Pokémon feridos dentro.',
      presagio:'Você lembra depois. Não durante. Anota isso sobre você mesmo.'},
  escolhas:[
    {texto:'Ir embora.', vai:'c9_fim'},
    {texto:'Ficar e assistir.', vai:'c9_fim', ef:{flag:'assistiu_o_incendio', moral:-10}},
    {texto:'Ligar pros bombeiros de um orelhão.', vai:'c9_saiu_cedo', ef:{rep:{eixo:'bom',delta:1,motivo:'Chamou os bombeiros para o fogo que ele mesmo pôs'}}},
    {texto:'Voltar e tentar tirar os seis.', vai:'c9_carregou_seis', ef:{hp:-8, causa:'Voltou para dentro do incêndio'}}
  ]
},

c9_documentou:{
  texto:[
    'Você fotografa tudo.',
    'As quarenta e uma gaiolas, uma por uma, com a plaqueta legível. As pranchetas. O livro de destino aberto em três páginas diferentes. A caixa de Poké Balls lacrada. A ficha de limpeza assinada com data de hoje. O termômetro marcando vinte e dois.',
    'O alvará na parede de fora. A placa de esmalte com o número.',
    'Depois sai sem tocar em nada. Sem soltar ninguém.',
    'Essa é a decisão mais fria que você já tomou, e você sabe exatamente por que tomou: uma noite de caos fecha um armazém e eles abrem outro em trinta dias.',
    'Trinta e uma páginas de destino, com CNPJ e número de processo, fecham uma rede.',
    'Você fica com isso na consciência do jeito que se fica com uma escolha certa que parece errada.'
  ],
  ef:{flag:['provas_deposito','escolha_fria'],
      rep:{eixo:'bom',delta:2,motivo:'Documentou a rede inteira em vez de agir na hora'},
      registrar:'Documentou o armazém de Celadon sem soltar ninguém.',
      presagio:'Trinta dias. É esse o tempo que leva pra abrir outro galpão.'},
  escolhas:[
    {texto:'Levar à Dra. Sayo.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Liga.', vai:'c9_liga_celadon'},
    {texto:'Levar à Auditora Nishino.', vai:'c9_prado_conversa', cond:d=>!!d.flags.conheceu_prado},
    {texto:'Guardar. Você ainda não sabe em quem confiar.', vai:'c9_fim', ef:{flag:'guardou_provas'}}
  ]
},

c9_livro:{
  texto:[
    'O livro de destinos tem trinta e uma páginas, é encadernado em espiral e tem etiqueta de papelaria na capa, escrita a caneta: **DESTINOS · ANO CORRENTE**.',
    'Doze páginas são coleções particulares em Kanto, com nome, endereço e telefone.',
    'Nove são fora de Kanto, com despachante e número de guia de trânsito.',
    'Sete são a mesma sigla repetida: **SPH-11**. Sem nome, sem endereço, sem telefone. Só a sigla e a quantidade.',
    'As últimas três páginas não têm destino. Têm a palavra "descarte" e uma data ao lado de cada linha.',
    'Você conta as linhas de descarte duas vezes. São dezenove.'
  ],
  ef:{flag:['livro_de_destinos','sabe_do_andar_11'],
      rep:{eixo:'bom',delta:1,motivo:'Tomou o livro-caixa da rede de Celadon'},
      registrar:'Livro de destinos: sete cargas para "SPH-11" e dezenove linhas de descarte.',
      presagio:'Dezenove linhas com a palavra descarte e uma data. Não tem nome nessas linhas.'},
  escolhas:[
    {texto:'Abrir as gaiolas também.', vai:'c9_abriu_tudo'},
    {texto:'Sair só com o livro.', vai:'c9_saiu_cedo'},
    {texto:'Fotografar o resto antes de sair.', vai:'c9_documentou'},
    {texto:'Levar direto pra Dra. Sayo.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c9_corrida_gaiolas:{
  texto:[
    'Você corre pras gaiolas com três homens atrás de você.',
    'Abre sete antes de te alcançarem. Sete em quarenta e uma.',
    'Os sete saem correndo por baixo das pernas dos funcionários, o que gera exatamente a confusão que você precisava e exatamente o tipo de raiva que você não queria.',
    'Um deles — o mais velho, o que estava conferindo prancheta — grita uma coisa que você vai repetir mentalmente por semanas:',
    '"Eles vão morrer na rua, porra!"',
    'E ele pode estar errado. E ele pode estar certo. E você não vai saber nunca.'
  ],
  ef:{flag:'abriu_sete', rep:{eixo:'bom',delta:1,motivo:'Libertou sete antes de ser contido'}, moral:-8,
      presagio:'Você não vai saber nunca. É esse o preço da pressa.'},
  escolhas:[{texto:'Lutar.', vai:'c9_luta_deposito'}]
},

c9_luta_deposito:{
  texto:[
    'Não tem mais conversa.',
    'O encarregado solta a bola com a mão esquerda enquanto com a direita aperta um botão vermelho na coluna, que provavelmente é alarme e provavelmente já era pra ter sido apertado.'
  ],
  batalha:{dex:110, nivel:36, tipo:'treinador', treinador:'Encarregado do Armazém 7', fuga:true,
           timeExtra:[{dex:89, nivel:38},{dex:24, nivel:34}],
           vitoria:'c9_venceu_deposito', derrota:'c9_perdeu_deposito', fuga2:'c9_saiu_cedo', gameover:'gameover'}
},

c9_venceu_deposito:{
  texto:[
    'Três times inteiros e você continua de pé.',
    'O encarregado senta numa caixa plástica virada e não tenta mais nada.',
    '"Faz o que você veio fazer. Eu ganho por hora."',
    'Ele tira as chaves das gaiolas do cinto e te entrega sem você pedir, e diz mais uma coisa, olhando o chão:',
    '"E depois você some, porque se você ficar até a polícia chegar eles vão te achar aqui e vão achar que foi você que trouxe os bicho pra cá."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Derrotou a segurança do armazém de Celadon'}, flag:'venceu_deposito'},
  escolhas:[
    {texto:'Abrir todas as gaiolas.', vai:'c9_abriu_tudo'},
    {texto:'Pegar o livro de destinos primeiro.', vai:'c9_livro'},
    {texto:'Fotografar tudo antes de tocar em nada.', vai:'c9_documentou'},
    {texto:'Assumir o armazém. Mandar ele voltar ao trabalho — pra você.', vai:'c9_tomou', cond:d=>!!d.flags.quer_a_rede}
  ]
},

c9_perdeu_deposito:{
  texto:[
    'Você perde.',
    'Eles não te machucam muito — machucar dá processo, e o mais velho repete isso em voz alta duas vezes pros outros dois, como quem lembra de procedimento.',
    'Te colocam na rua, com a sua mochila inteira, e fecham o portão azul.',
    'Às três da manhã, o caminhão sai carregado. Você vê da esquina, sentado numa caçamba, com a perna doendo.',
    'Quarenta e uma gaiolas passam por você a quarenta quilômetros por hora.'
  ],
  ef:{hp:-7, causa:'Derrota no armazém de Celadon', flag:'falhou_deposito', instabilidade:1, moral:-12,
      registrar:'Perdeu no armazém de Celadon. A carga saiu.',
      presagio:'Machucar dá processo. Eles têm mais medo de papel do que de você.'},
  escolhas:[
    {texto:'Seguir o caminhão a pé enquanto der.', vai:'c9_seguiu_caminhao'},
    {texto:'Sentar no meio-fio.', vai:'c9_fim'},
    {texto:'Voltar amanhã com a Liga.', vai:'c9_liga_celadon'},
    {texto:'Voltar amanhã com a Dra. Sayo.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c9_seguiu_caminhao:{
  texto:[
    'Você segue o caminhão por onze quarteirões até perder de vista na avenida, quando ele pega a marginal e você não tem mais fôlego.',
    'Mas você anota a placa. E o horário. E o sentido, que é norte — Saffron.',
    'Anota num caderno, encostado num poste, com a mão tremendo de cansaço e a letra saindo torta.',
    'É pouco.',
    'É mais do que você tinha há onze quarteirões.'
  ],
  ef:{flag:['placa_do_caminhao','destinacao_saffron'],
      rep:{eixo:'bom',delta:1,motivo:'Não desistiu quando já tinha perdido'},
      registrar:'Anotou placa, horário e sentido do caminhão: norte, Saffron.'},
  escolhas:[
    {texto:'Seguir viagem.', vai:'c9_fim'},
    {texto:'Levar a placa à Dra. Sayo.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar a placa à Liga.', vai:'c9_liga_celadon'},
    {texto:'Resolver as pendências antes de sair.', vai:'c9_pendencias'}
  ]
},

c9_tomou:{
  texto:[
    'Você não abre as gaiolas.',
    'Você chama os dois funcionários que ainda estão ali e diz — com uma calma que assusta você mesmo — que a partir de hoje eles se reportam a você, que o pagamento continua igual, que ninguém perde emprego, e que a carga de amanhã sai no horário.',
    'Eles olham um pro outro.',
    'Um deles pergunta da Terceira.',
    '"A Terceira sabe", você diz. E tecnicamente é verdade.',
    'O outro pergunta se o vale-transporte continua.',
    'Você diz que sim. Você não sabe o que é vale-transporte. Você diz que sim mesmo assim, e é essa a frase que decide a coisa: eles voltam a trabalhar.',
    'Não com um discurso. Com um turno de trabalho.'
  ],
  ef:{rep:{eixo:'ruim',delta:4,motivo:'Tomou para si uma rede de custódia e venda de Pokémon'},
      flag:['assumiu_a_rede','tem_sangue_nas_maos'], dinheiro:15000, moral:-25,
      npc:{nome:'A Terceira', opiniao:-5, memoria:'Você tomou o armazém dela. Ela previu e não gostou de ter previsto.'},
      executar:d=>{
        Historia.definirVia('foragido','assumiu a rede de Celadon');
        Estado.dados.liga.avisos++;
        return [{tipo:'liga', texto:'Um relatório da Liga sobre Celadon passou a ter o seu nome no topo.'}];
      },
      registrar:'Assumiu o controle do armazém e da rede de Celadon.',
      presagio:'Vale-transporte. A coisa se rendeu a você por causa do vale-transporte.'},
  escolhas:[
    {texto:'Ir dormir. Você tem uma operação pra tocar amanhã.', vai:'c9_fim'},
    {texto:'Antes de dormir: soltar os seis que não andam.', vai:'c9_carregou_seis',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Mesmo tomando a rede, tirou os seis que não andavam'}}},
    {texto:'Pegar o livro de destinos. Agora é seu.', vai:'c9_livro'},
    {texto:'Ir ao cassino avisar ela pessoalmente.', vai:'c9_cassino'}
  ]
},

/* ─────────────── QUEM RECEBE O QUE VOCÊ TROUXE ─────────────── */

c9_ivone:{
  texto:[
    'A Dra. Sayo chega em Celadon em cinco horas, de ônibus noturno, com duas pessoas e uma câmera, do mesmo jeito do Monte da Lua.',
    'Vocês sentam numa lanchonete de rodoviária às cinco da manhã porque é o único lugar aberto.',
    'Ela olha o que você trouxe em silêncio. Vira as páginas devagar, com as duas mãos, do jeito de quem já estragou documento uma vez e aprendeu.',
    'Quando chega na sigla SPH-11, ela para.',
    'Fica parada tempo demais. O café esfria.',
    '"Isso não é contrabando de bicho." Ela fecha o caderno. "Isso é fornecimento."',
    '"Contrabando é eventual. Fornecimento é contínuo, tem previsão de volume, e tem contrato."',
    '"E fornecimento tem cliente. E cliente com sigla e número de andar tem CNPJ."'
  ],
  ef:{flag:['ivone_sabe','sabe_da_silph'],
      rep:{eixo:'bom',delta:2,motivo:'Entregou a rede de Celadon a quem faz alguma coisa com isso'},
      npc:{nome:'Dra. Sayo', opiniao:8, memoria:'Você entregou a ela o material de Celadon. Foi o maior que ela já teve.'},
      registrar:'Dra. Sayo recebeu as provas e identificou a Silph como cliente.',
      presagio:'Previsão de volume. Alguém encomendou uma quantidade por mês.'},
  escolhas:[
    {texto:'"Então a gente vai pra Saffron."', vai:'c9_fim',
     ef:{flag:'vai_para_saffron', executar:d=>{ if(Historia.via()==='neutro') Historia.definirVia('pesquisador','seguiu a trilha até a Silph'); return []; }}},
    {texto:'"Me fala da Auditora Nishino."', vai:'c9_prado_conversa', cond:d=>!!d.flags.conheceu_prado},
    {texto:'"E o processo 44.207?"', vai:'c9_ivone_44207', cond:d=>!!d.flags.numero_da_gaveta || !!d.flags.sabe_do_lote_41},
    {texto:'"Eu já fiz a minha parte."', vai:'c9_fim'}
  ]
},

c9_ivone_44207:{
  texto:[
    '"E o processo quarenta e quatro mil duzentos e sete?"',
    'Ela abre a pasta dela e procura, e acha, porque ela tem esse número anotado desde Pewter.',
    '"Quarenta e quatro mil duzentos e sete é um dos onze que eu peguei por amostragem, três anos atrás, e é o que fez eu parar de achar que era incompetência."',
    '"Recolhimento por maus-tratos, num endereço de Lavender. Laudo de duas linhas. Assinatura do fiscal. Notificação por edital num jornal que circula em Celadon, não em Lavender."',
    '"Você entende? A notificação foi publicada numa cidade onde o tutor não mora."',
    '"Isso não é erro. Isso é escolha de veículo de publicação."',
    'Ela fecha a pasta com cuidado.',
    '"Se você conseguir uma declaração do tutor, com a mão dele, com data, isso derruba a alienação. E se derrubar uma, abre precedente pras outras dez."'
  ],
  ef:{flag:['sabe_da_notificacao_torta','ivone_quer_declaracao'],
      rep:{eixo:'bom',delta:2,motivo:'Puxou o fio do processo até achar onde ele foi torcido'},
      registrar:'A notificação do processo 44.207 foi publicada num jornal de Celadon; o tutor mora em Lavender.',
      presagio:'Escolha de veículo de publicação. Alguém escolheu onde publicar para não ser lido.'},
  escolhas:[
    {texto:'"Eu vou buscar essa declaração." — hospital.', vai:'c9_hospital'},
    {texto:'"Eu já tenho." — entregar a do Hideo.', vai:'c9_prado_te_da_o_processo', cond:d=>!!d.flags.copia_do_hideo || !!d.flags.hideo_escreveu},
    {texto:'"Quem é o fiscal que assinou?"', vai:'c9_junta', ef:{flag:'sabe_do_cartorio'}},
    {texto:'"Então a gente vai pra Saffron."', vai:'c9_fim', ef:{flag:'vai_para_saffron'}}
  ]
},

c9_liga_celadon:{
  texto:[
    'O posto da Liga em Celadon fica no terceiro andar de um prédio comercial, entre um consultório de fisioterapia e uma escola de informática, e fecha às dezoito horas.',
    'Tem quatro cadeiras de plástico na recepção e um cartaz desbotado de campanha de adoção de 1993.',
    'O oficial que te atende é competente e honesto, e é exatamente por isso que a conversa é tão frustrante.',
    '"Isso aqui é bom material." Ele folheia devagar, anotando. "Sério. É melhor do que noventa por cento do que chega aqui."',
    '"Mas eu preciso de mandado pra entrar em armazém credenciado, e mandado pra empresa privada com alvará em ordem leva de quatro a nove meses."',
    '"Quatro a nove meses."',
    '"Eu sei." Ele te olha nos olhos e não desvia, o que é a coisa mais decente que ele podia fazer. "Eu sei."'
  ],
  ef:{flag:'liga_tem_provas',
      rep:{eixo:'bom',delta:1,motivo:'Levou provas às autoridades'},
      executar:d=>{ d.liga.avisos = Math.max(0, d.liga.avisos); return [{tipo:'liga', texto:'A Liga registrou você como informante — o que é bom e ruim.'}]; },
      registrar:'Entregou as provas à Liga. Prazo estimado: quatro a nove meses.',
      presagio:'Ele não desviou o olhar. Guarde isso: nem todo mundo dentro é a mesma coisa.'},
  escolhas:[
    {texto:'"Então eu vou eu mesmo."', vai:'c9_fim',
     ef:{flag:'vai_sozinho_saffron', executar:d=>{ if(Historia.via()==='neutro') Historia.definirVia('heroi','decidiu ir sozinho quando o sistema disse nove meses'); return []; }}},
    {texto:'"E se eu levar isso pra Auditoria da Comissão?"', vai:'c9_prado_conversa'},
    {texto:'"E se eu levar isso pra imprensa?"', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Aceitar. Quatro a nove meses.', vai:'c9_fim', ef:{flag:'aceitou_prazo'}}
  ]
},

c9_liga_deposito:{
  texto:[
    'Você liga de um orelhão da esquina e espera.',
    'A viatura chega em quarenta minutos. Dois oficiais, sem mandado, sem autorização pra entrar.',
    'Eles batem no portão azul. O portão abre.',
    'Um homem muito educado mostra a documentação do armazém, que está em ordem, porque armazém de custódia credenciado é uma coisa legal e a documentação dele é a razão de ele existir.',
    'Os oficiais conferem, pedem desculpa pelo incômodo, anotam o número do alvará e vão embora às zero e cinquenta e um.',
    'O caminhão sai à uma e vinte.',
    'Você viu as duas coisas da mesma esquina, com vinte e nove minutos de intervalo.'
  ],
  ef:{flag:'liga_falhou_celadon', instabilidade:1, moral:-10,
      rep:{eixo:'bom',delta:1,motivo:'Tentou fazer pelo caminho certo'},
      registrar:'A Liga foi ao armazém, não pôde entrar, e o caminhão saiu vinte e nove minutos depois.',
      presagio:'Vinte e nove minutos. Eles esperaram a viatura virar a esquina.'},
  escolhas:[
    {texto:'Entrar sozinho agora, com raiva.', vai:'c9_frente',
     ef:{executar:d=>{ if(Historia.via()==='neutro') Historia.definirVia('heroi','perdeu a fé no caminho oficial'); return []; }}},
    {texto:'Seguir o caminhão.', vai:'c9_seguiu_caminhao'},
    {texto:'Ir ao cassino e olhar na cara dela.', vai:'c9_cassino'},
    {texto:'Ir embora.', vai:'c9_fim'}
  ]
},

c9_ela_ta_bem:{
  texto:[
    '"Ela tá bem. Era só isso."',
    'Ela olha pra você com uma cara difícil de ler.',
    '"Ela tá bem", ela repete, sem ponto de interrogação.',
    '"Tá."',
    '"A minha mãe mora sozinha numa casa de dois quartos em Lavender, do lado de um cemitério, e cuida de bicho dos outros de graça porque não sabe fazer outra coisa com as mãos."',
    'Ela mexe a colher no café que já está frio.',
    '"Mas tá bem. Você foi lá, olhou, e ela tá bem."',
    'Silêncio.',
    '"Obrigada por vir. Sério. Você é a primeira pessoa em quatro anos que fez alguma coisa em vez de me mandar recado."'
  ],
  ef:{flag:'falou_com_a_filha_da_marta',
      npc:{nome:'Filha da Haruko', opiniao:2, memoria:'Você foi até Celadon só para dizer que a mãe dela está bem. Ela sabe o que isso custou em dias de caminhada.'},
      rep:{eixo:'bom',delta:1,motivo:'Atravessou uma cidade inteira por um recado que ninguém pediu'},
      registrar:'Falou com a filha da Haruko. Ela agradeceu e não prometeu nada.',
      presagio:'Ela agradeceu e não disse que ia ligar. Repare no que ela não disse.'},
  escolhas:[
    {texto:'"Ela queria muito falar com você."', vai:'c9_liga_pra_ela'},
    {texto:'"A casa dela fica muito grande."', vai:'c9_a_casa_fica_grande'},
    {texto:'Não dizer mais nada e deixar ela decidir.', vai:'c9_silencio_no_cafe'},
    {texto:'Sair do café.', vai:'c9_saiu_do_cafe'}
  ]
},

/* ─────────────── FIM ─────────────── */

c9_fim:{
  texto:[
    d=>{
      const via = Historia.via();
      if (via==='mercenario') return 'Você sai de Celadon com dinheiro, contato e um trabalho. É mais do que você tinha na entrada da cidade, e é a primeira vez na jornada que "mais" parece uma palavra ruim.';
      if (via==='foragido') return 'Você sai de Celadon com uma operação nas costas. Não com uma gangue, não com poder — com responsabilidade sobre uma coisa que não devia existir e que continua existindo porque você não acabou com ela.';
      if (via==='pesquisador') return 'Você sai de Celadon com mais perguntas do que entrou, e com endereços em vez de respostas. É o pior tipo de progresso: o que funciona.';
      if (via==='heroi') return 'Você sai de Celadon com o nome numa delegacia como testemunha, numa redação como fonte, e num escritório como prejuízo. Três listas diferentes, e em nenhuma delas você é uma pessoa.';
      return 'Você sai de Celadon do jeito que entrou. Poucas pessoas conseguem isso e não é um elogio.';
    },
    d=>{
      if (d.flags.lote_41_suspenso || d.flags.tirou_o_41 || d.flags.consignou_o_41) return 'Uma linha de uma planilha administrativa de Kanto está diferente por sua causa. Uma.';
      if (d.flags.esvaziou_deposito) return 'Vinte e nove chegaram na rua. Você não vai saber o que aconteceu com nenhum deles, e vai pensar nisso em cidades que ainda nem conhece.';
      if (d.flags.provas_deposito || d.flags.livro_de_destinos) return 'Você está carregando papel em vez de resultado, e papel demora, e você tem quinze anos e nenhuma paciência. Vai ter que aprender.';
      return 'Nenhuma linha de nenhuma planilha de Kanto está diferente por você ter passado por Celadon. Ainda.';
    },
    d=>d.flags.sabe_do_andar_11 || d.flags.sabe_da_silph
       ? 'De qualquer forma, existe um prédio em Saffron com dez andares, e uma sigla que fala em onze.'
       : 'Saffron fica a um dia daqui. É a única cidade de Kanto maior que Celadon, e é a única que é maior por dentro do que por fora.',
    'A estrada entre Celadon e Saffron é reta, plana, com acostamento largo e placa a cada quilômetro.',
    'Você anda ela inteira pensando na mesma coisa.'
  ],
  fim:true, resumo:'Capítulo 9 concluído — Celadon te mostrou o tamanho do problema, e que ele tem alvará.'
}

}}

);
