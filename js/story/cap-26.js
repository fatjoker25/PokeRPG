/* ------------------------------------------------------------
   ABERTURAS — a subida ao Planalto pra reunião das catorze.
   ------------------------------------------------------------ */
const C26_ABERTURAS = ['c21_chegada', 'c26_ab_a_van_do_pao', 'c26_ab_a_carona', 'c26_ab_a_parede'];
function c26_cabe(id, d){ return true; }
function c26_abertura(d){ return Dados.escolher(C26_ABERTURAS.filter(id => c26_cabe(id, d))); }

/* ============================================================
   CAPÍTULO 26 — O QUE TE OFERECEM
   Planalto Indigo. Três folhas em cima de uma mesa comprida.
   ============================================================ */
CAPITULOS.push(
{
num:26, titulo:'O Que Te Oferecem', local:'Planalto Indigo', ambiente:'montanha', nivelArea:56,
tom:'muito sombrio', entradas:C26_ABERTURAS,
inicio: d => c26_abertura(d),
cenas:{

c26_ab_a_van_do_pao:{
  texto:[
    'A van de entrega de pão sobe a estrada do Planalto às onze da manhã de terça, quinta e sábado, e hoje é terça.',
    'Você está a pé na curva dos últimos duzentos metros quando ela para do seu lado sozinha.',
    fala('o entregador de pão', 'Vai pro Planalto?'),
    d=>{ Nomes.apresentar('o entregador de pão'); return 'Na porta da van, em letra de adesivo descascando: PADARIA DO PLANALTO — RUFO.'; },
    d=>fala(d.jogador.nome, 'Vou.'),
    fala('o entregador de pão', 'Sobe. É meio quilômetro e é tudo subida.'),
    'Você sobe no banco do carona, entre uma caixa de pão de forma e uma caixa de pão francês, e o cheiro é a coisa mais fora de lugar do mês.',
    fala('o entregador de pão', 'Eu faço essa entrega há oito anos.'),
    fala('o entregador de pão', 'Sabe o que mudou?'),
    d=>fala(d.jogador.nome, 'O quê?'),
    fala('o entregador de pão', 'A quantidade de pão.'),
    'Ele engata a segunda pra vencer a subida.',
    fala('o entregador de pão', 'Eu entregava oitenta pães. Hoje eu entrego duzentos e quarenta.'),
    fala('o entregador de pão', 'O Planalto não contratou ninguém. Eu perguntei na cozinha.', 'baixo')
  ],
  ef:{flag:'o_pao_triplicou',
      npc:{nome:'o entregador', opiniao:1, viuVoce:'Te deu carona nos últimos duzentos metros da subida.'},
      registrar:'A entrega de pão do Planalto triplicou em oito anos sem contratação de pessoal.',
      presagio:'Três vezes mais pão e o mesmo quadro de funcionários. Tem gente morando lá que não está na folha.'},
  escolhas:[
    {texto:'Perguntar quantos ele acha que tem lá dentro.', vai:'c26_ab_quantos'},
    {texto:'Descer e subir direto pra porta da sala.', vai:'c21_esperou_na_porta'},
    {texto:'Descer e andar pelo saguão antes.', vai:'c21_saguao'},
    {texto:'Descer e procurar o refeitório.', vai:'c21_refeitorio'}
  ]
},

c26_ab_quantos:{
  texto:[
    fala('o entregador de pão', 'Duzentos e quarenta pães dá pra umas cento e vinte pessoas no café e no jantar.'),
    'Ele entra no estacionamento e manobra de ré na doca de carga sem olhar pra trás, com a mão no encosto do banco.',
    fala('o entregador de pão', 'O Planalto tem quarenta e um funcionários. Tá na plaquinha do saguão, "nossa equipe".'),
    d=>fala(d.jogador.nome, 'Mais os desafiantes.'),
    fala('o entregador de pão', 'Em temporada, umas dez, quinze pessoas. Fora de temporada, nenhuma.'),
    'Ele puxa o freio de mão.',
    fala('o entregador de pão', 'Em janeiro não tem desafiante nenhum. Janeiro é fechado.'),
    fala('o entregador de pão', 'Em janeiro eu entrego os mesmos duzentos e quarenta.')
  ],
  ef:{flag:'cento_e_vinte_no_planalto',
      registrar:'O Planalto tem 41 funcionários e consome pão para 120 pessoas, inclusive em janeiro, quando fecha.'},
  escolhas:[
    {texto:'Subir direto pra porta da sala.', vai:'c21_esperou_na_porta'},
    {texto:'Andar pelo saguão antes.', vai:'c21_saguao'},
    {texto:'Procurar o refeitório.', vai:'c21_refeitorio'}
  ]
},

c26_ab_a_carona:{
  texto:[
    'Você sobe a estrada do Planalto num carro oficial, o que não estava no seu plano e não foi sua escolha.',
    'Ele parou do seu lado a quatro quilômetros da curva final, com uma placa de Liga no para-brisa, e a mulher do volante abriu a janela e falou o seu nome.',
    'Você entra porque recusar teria sido pior e porque faltavam quatro quilômetros de subida.',
    'Ela dirige sem falar nada por dois quilômetros. Aí:',
    fala('a mulher do volante', 'Eu não vou te perguntar nada e você não vai me contar nada.'),
    fala('a mulher do volante', 'Eu sou motorista do Planalto há dezessete anos e eu levo as pessoas de um lado pro outro.'),
    'Ela troca de marcha.',
    fala('a mulher do volante', 'Só uma coisa, porque eu ia me sentir mal se não falasse.'),
    fala('a mulher do volante', 'Na reunião de hoje, olha pra quem não fala.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('a mulher do volante', 'Porque eu já levei quase todo mundo dessa reunião de carro, em algum momento.'),
    fala('a mulher do volante', 'E os que falam muito na reunião são os que ficam calados no carro.', 'baixo')
  ],
  ef:{flag:'o_aviso_da_motorista',
      npc:{nome:'a mulher do volante', opiniao:2, viuVoce:'Te deu carona até o Planalto e te disse pra olhar pra quem não fala.'},
      registrar:'A motorista do Planalto te disse para observar, na reunião, quem não fala.',
      presagio:'Quem fala muito na mesa e nada no carro está atuando numa das duas.'},
  escolhas:[
    {texto:'Subir direto e esperar na porta da sala.', vai:'c21_esperou_na_porta'},
    {texto:'Andar pelo saguão antes.', vai:'c21_saguao'},
    {texto:'Procurar o refeitório. Você não come desde as seis.', vai:'c21_refeitorio'}
  ]
},

c26_ab_a_parede:{
  texto:[
    'Você entra pelo saguão e não olha pra recepção, não olha pra escada, não olha pro elevador.',
    'Você vai direto pra parede do fundo, que é onde ficam as fotografias dos campeões em fileira, com nome e ano, e que é a única coisa desse prédio que você queria ver desde criança.',
    'São vinte e oito molduras, e a última está vazia.',
    'As vinte e seis primeiras são retratos de campeão: terno e preto e branco no começo, o poço da arena e o time do lado no fim.',
    'A vigésima sétima é diferente. É uma foto de documento, mal enquadrada, de um menino de uns onze anos que está olhando pra câmera como quem não entendeu por que estão tirando a foto.',
    'A moldura dele tem nome e ano como todas as outras.',
    'E, diferente de todas as outras, tem o vidro limpo.',
    'As vinte e seis têm poeira na quina de baixo. A vigésima sétima não.',
    'Alguém limpa aquele vidro.'
  ],
  ef:{flag:'a_moldura_limpa',
      registrar:'A 27ª moldura da parede dos campeões é a única com o vidro limpo.',
      presagio:'Vinte e seis com poeira e uma sem. Alguém desse prédio passa um pano nela.'},
  escolhas:[
    {texto:'Perguntar na recepção quem limpa aquela moldura.', vai:'c26_ab_quem_limpa'},
    {texto:'Andar pelo saguão e ver o resto.', vai:'c21_saguao'},
    {texto:'Subir e esperar na porta da sala.', vai:'c21_esperou_na_porta'}
  ]
},

c26_ab_quem_limpa:{
  texto:[
    'A moça da recepção, a mais nova das duas atrás do balcão, olha pra parede sem virar o corpo, porque ela sabe qual moldura é sem precisar conferir.',
    fala('a moça da recepção', 'Esse a gente não comenta muito.'),
    d=>fala(d.jogador.nome, 'Eu não perguntei dele. Eu perguntei quem limpa o vidro.'),
    'Ela para.',
    'E leva uns quatro segundos pra responder, o que é muito tempo pra uma pergunta de limpeza.',
    fala('a moça da recepção', 'A equipe de limpeza limpa tudo.'),
    d=>fala(d.jogador.nome, 'As outras vinte e seis têm poeira.'),
    'Ela olha a parede de verdade dessa vez. Vira o corpo e tudo.',
    'E fica olhando por um tempo, e você vê o momento exato em que ela repara.',
    fala('a moça da recepção', 'Eu trabalho aqui há seis anos.'),
    fala('a moça da recepção', 'Eu nunca tinha reparado nisso.', 'baixo')
  ],
  ef:{flag:['a_moldura_limpa','sabe_do_campeao_sumido'],
      npc:{nome:'a moça da recepção', opiniao:1, viuVoce:'Você a fez reparar, depois de seis anos, que uma moldura é limpa e as outras não.'},
      registrar:'Nem a recepcionista de seis anos de casa sabe quem limpa aquela moldura.'},
  escolhas:[
    {texto:'Andar pelo saguão.', vai:'c21_saguao'},
    {texto:'Subir e esperar na porta da sala.', vai:'c21_esperou_na_porta'},
    {texto:'Procurar o refeitório.', vai:'c21_refeitorio'}
  ]
},


c21_chegada:{
  texto:[
    'O Planalto Indigo é um complexo de pedra e vidro no alto de uma montanha e foi construído para intimidar.',
    'Funciona. Funciona nos últimos duzentos metros da subida, quando a estrada faz a curva e o prédio aparece inteiro de uma vez, encaixado na rocha como se tivesse crescido dali.',
    'Funciona menos quando você chega perto e vê que uma das janelas do segundo andar está com o vidro trincado e remendado com fita, e que o estacionamento tem uma van de entrega de pão.',
    d=>{
      const r = Estado.nomeRep();
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=7) return `Tem gente esperando na entrada. Não seguranças — gente. Um grupo de treinadores jovens que ficou sabendo que você vinha hoje. Um deles pede autógrafo no caderno e você não sabe o que fazer com as mãos. "${r}", alguém diz. E é sobre você.`;
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=5) return 'A recepcionista diz o seu nome antes de você falar. Isso é novo e não é confortável.';
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=6) return 'Tem dois oficiais na entrada que não estavam ali dez minutos atrás. Eles não te abordam. Eles te acompanham a dez metros pelo saguão inteiro, e no elevador um deles segura a porta para você.';
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=4) return 'A recepcionista digita seu nome, lê alguma coisa na tela, e o sorriso dela muda de categoria.';
      return 'Ninguém te reconhece. Você é só mais {um|uma} com envelope na mão.';
    },
    'A reunião é às catorze. São treze e dez.'
  ],
  ef:{registrar:'Chegou ao Planalto Indigo.'},
  escolhas:[
    {texto:'Subir direto e esperar na porta da sala.', vai:'c21_esperou_na_porta'},
    {texto:'Andar pelo saguão antes.', vai:'c21_saguao'},
    {texto:'Procurar o refeitório. Você não come desde as seis.', vai:'c21_refeitorio'},
    {texto:'Perguntar na recepção se dá para ver a arena.', vai:'c21_pediu_a_arena'}
  ]
},

c21_saguao:{
  texto:[
    'O saguão do Planalto é de pé-direito alto, com piso de pedra polida e um eco que faz qualquer conversa parecer importante.',
    'Na parede do fundo tem a parede dos campeões: fotografias emolduradas em fileira, com nome e ano.',
    'Do lado esquerdo, uma vitrine com insígnias antigas, algumas de metal, outras de esmalte, e uma que é claramente de plástico.',
    'E, numa parede lateral que ninguém olha porque fica atrás da escada, uma placa de bronze com uma lista de nomes e nenhuma explicação.'
  ],
  escolhas:[
    {texto:'Olhar a parede dos campeões.', vai:'c21_parede_dos_campeoes'},
    {texto:'Olhar a vitrine das insígnias.', vai:'c21_vitrine'},
    {texto:'Olhar a placa de bronze atrás da escada.', vai:'c21_placa_de_bronze'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_parede_dos_campeoes:{
  texto:[
    'Vinte e oito molduras, em ordem de ano.',
    'Os primeiros são retratos formais, de terno, em preto e branco. Os últimos são fotos coloridas tiradas no próprio poço da arena, com a pessoa suada e o time do lado.',
    'A décima nona é de uma mulher de uns vinte anos segurando um Nidoqueen pela pata, e ela está rindo de um jeito que não combina nada com o resto da parede.',
    'A vigésima sétima é de um menino de onze anos. A moldura é a mesma das outras. O nome embaixo é um nome curto.',
    'A última moldura está vazia, com o vidro limpo e o nome em branco, esperando.'
  ],
  ef:{flag:'viu_a_parede', registrar:'Viu a parede dos campeões: 29 fotos e uma moldura vazia.'},
  escolhas:[
    {texto:'Perguntar na recepção quem é o menino de onze anos.', vai:'c21_o_menino_da_foto'},
    {texto:'Olhar a placa de bronze atrás da escada.', vai:'c21_placa_de_bronze'},
    {texto:'Olhar a vitrine.', vai:'c21_vitrine'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_o_menino_da_foto:{
  texto:[
    'A recepcionista olha a foto pelo canto do olho, sem se virar, porque ela sabe qual é sem precisar olhar.',
    fala('a recepcionista do Planalto', 'Esse a gente não comenta muito.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('a recepcionista do Planalto', 'Porque ele não veio à cerimônia, não assinou o quadro e ninguém sabe onde ele está.'),
    'Ela mexe em alguma coisa na tela.',
    fala('a recepcionista do Planalto', 'A Liga mandou carta durante um ano e meio para o endereço da mãe dele. Parou de mandar.'),
    d=>d.flags.viu_o_red
      ? 'Você já viu esse rosto antes, mais velho, sentado numa pedra num lugar muito frio.'
      : 'Você olha a foto de novo. Onze anos. A cara de quem não entendeu por que estão tirando a foto.'
  ],
  ef:{flag:'sabe_do_campeao_sumido',
      registrar:'O 27º campeão nunca foi à cerimônia e ninguém sabe onde está.'},
  escolhas:[
    {texto:'Olhar a placa de bronze.', vai:'c21_placa_de_bronze'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'},
    {texto:'Procurar o refeitório.', vai:'c21_refeitorio'}
  ]
},

c21_vitrine:{
  texto:[
    'A vitrine tem sessenta e poucas insígnias, de todos os ginásios de Kanto, ao longo de oitenta anos.',
    'Elas mudaram de desenho, de material e de tamanho. A de Pewter já foi de bronze, já foi de esmalte e hoje é de metal estampado.',
    'A de plástico é de um ano específico e tem um cartãozinho datilografado embaixo: exercício de 1974 — restrição de material.',
    'Restrição de material quer dizer que faltou metal em Kanto naquele ano, e que mesmo assim entregaram insígnia.',
    d=>d.insignias.length > 1
      ? 'As que você tem no bolso são iguais às da última fileira. Você confere, uma por uma. São iguais mesmo.'
      : d.insignias.length ? 'A que você tem no bolso é igual à da última fileira. Você confere. É igual mesmo.'
      : 'Você não tem nenhuma no bolso para comparar.'
  ],
  ef:{flag:'viu_a_vitrine',
      registrar:'A vitrine de insígnias: oitenta anos, e uma de plástico de 1974.'},
  escolhas:[
    {texto:'Olhar a parede dos campeões.', vai:'c21_parede_dos_campeoes'},
    {texto:'Olhar a placa de bronze.', vai:'c21_placa_de_bronze'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_placa_de_bronze:{
  texto:[
    'A placa fica atrás da escada, na sombra, e ninguém que sobe passa por ela.',
    'É uma lista de nomes em duas colunas, com data ao lado. Quarenta e um nomes.',
    'Não tem título. Não tem explicação. Não tem nem uma linha dizendo o que essas pessoas fizeram.',
    'Só os nomes, as datas, e no rodapé, em letra menor: A LIGA POKÉMON DE KANTO.',
    'Você conta as datas. Onze delas são do mesmo ano.'
  ],
  ef:{flag:'viu_a_placa', instabilidade:1,
      registrar:'Uma placa de bronze atrás da escada, com 41 nomes e nenhuma explicação.'},
  escolhas:[
    {texto:'Perguntar quem são.', vai:'c21_quem_sao_os_41'},
    {texto:'Copiar os onze do mesmo ano.', vai:'c21_copiou_os_onze'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_quem_sao_os_41:{
  texto:[
    d=>{ Nomes.apresentar('a recepcionista do Planalto'); return 'A recepcionista se chama Sra. Ada, trabalha aqui há vinte e seis anos, e responde sem consultar nada.'; },
    fala('Sra. Ada', 'Agentes de campo mortos em serviço.'),
    'Ela diz isso do mesmo jeito que diria o horário de funcionamento.',
    d=>fala(d.jogador.nome, 'Quarenta e um?'),
    fala('Sra. Ada', 'Quarenta e um desde 1961.', null, 'Ela ajeita uma pilha de formulários.'),
    fala('Sra. Ada', 'Onze foram em 1994, num incidente só, no norte. A placa nova ia sair no ano passado e não saiu porque não aprovaram a verba.'),
    d=>fala(d.jogador.nome, 'A placa nova?'),
    fala('Sra. Ada', 'Tem mais quatro nomes para pôr.', null, 'E volta aos formulários.')
  ],
  ef:{flag:['sabe_dos_41','sabe_do_incidente_94'], instabilidade:1,
      npc:{nome:'Sra. Ada', opiniao:1, memoria:'Recepcionista do Planalto há vinte e seis anos. Sabe tudo de cor.'},
      registrar:'41 agentes mortos em serviço desde 1961. Onze em 1994, num incidente no norte. Faltam quatro nomes na placa.'},
  escolhas:[
    {texto:'"Quatro de quando?"', vai:'c21_os_quatro_novos'},
    {texto:'Copiar os onze de 1994.', vai:'c21_copiou_os_onze'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_os_quatro_novos:{
  texto:[
    'A Sra. Ada para de mexer nos formulários.',
    '"Dos últimos dois anos."',
    'Ela não diz onde. Ela olha para a escada, para cima, na direção da sala em que você tem reunião às catorze.',
    '"{O senhor|A senhora} vai perguntar lá em cima e eles vão te contar, porque eles contam." Ela volta aos formulários. "Eu só não quero ser eu a contar."',
    'Você fica com essa frase por todo o resto da tarde.'
  ],
  ef:{flag:'sabe_dos_quatro_novos', instabilidade:1,
      registrar:'Quatro agentes morreram nos últimos dois anos e ainda não estão na placa.'},
  escolhas:[
    {texto:'Copiar os onze de 1994.', vai:'c21_copiou_os_onze'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'},
    {texto:'Procurar o refeitório.', vai:'c21_refeitorio'}
  ]
},

c21_copiou_os_onze:{
  texto:[
    'Você copia os onze nomes de 1994 no caderno, com a data, que é a mesma nos onze: dezoito de agosto.',
    'Onze pessoas no mesmo dia.',
    'Você fica um tempo com o caderno aberto, embaixo de uma escada, num prédio de pedra e vidro, enquanto gente de crachá passa por cima da sua cabeça indo almoçar.'
  ],
  ef:{flag:'tem_os_onze_nomes', itens:{'Onze nomes de 18 de agosto de 1994':1},
      registrar:'Copiou os onze nomes de 18 de agosto de 1994.'},
  escolhas:[
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'},
    {texto:'Procurar o refeitório.', vai:'c21_refeitorio'}
  ]
},

c21_refeitorio:{
  texto:[
    'O refeitório do Planalto fica no subsolo e é igual a refeitório de qualquer lugar grande: bandeja, fila, um cartaz sobre desperdício e uma televisão sem som.',
    'Quem come aqui não é Elite 4. É gente de manutenção, de arquivo, da cozinha, do setor de licenças.',
    'Você senta numa ponta de mesa com uma bandeja de arroz, feijão, uma omelete e beterraba.',
    'Na mesa do lado, três pessoas de macacão discutem se a caldeira do bloco C aguenta mais um inverno.'
  ],
  escolhas:[
    {texto:'Puxar assunto com a mesa do lado.', vai:'c21_mesa_da_manutencao'},
    {texto:'Perguntar a alguém o que acontece nas salas de cima.', vai:'c21_o_que_acontece_em_cima'},
    {texto:'Comer em silêncio e subir.', vai:'c21_esperou_na_porta'}
  ]
},

c21_mesa_da_manutencao:{
  texto:[
    'Eles abrem espaço na mesa sem cerimônia nenhuma.',
    'O mais velho se chama Sr. Quint e é eletricista do Planalto há dezenove anos.',
    fala('Sr. Quint', '{Você é o de hoje das duas?|Você é a de hoje das duas?}', null, 'Ele aponta o teto com o garfo.'),
    fala('Sr. Quint', 'A sala quatro é a que a gente chama de sala das três cadeiras.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('Sr. Quint', 'Porque quando é uma cadeira é bronca, quando é duas é acordo, e quando é três é oferta.', null, 'Ele come.'),
    fala('Sr. Quint', 'Três cadeiras é bom, {moço|moça}. Três cadeiras eles querem alguma coisa de você.')
  ],
  ef:{flag:'sabe_das_tres_cadeiras',
      npc:{nome:'Sr. Quint', opiniao:1, memoria:'Eletricista do Planalto. Te explicou o que significam três cadeiras.'},
      registrar:'Três cadeiras na sala quer dizer oferta.'},
  escolhas:[
    {texto:'"E quando é quatro?"', vai:'c21_quatro_cadeiras'},
    {texto:'"O senhor já viu alguém sair de lá?"', vai:'c21_ja_viu_sair'},
    {texto:'Agradecer e subir.', vai:'c21_esperou_na_porta'}
  ]
},

c21_quatro_cadeiras:{
  texto:[
    'Ele ri e os outros dois riem junto, e é a primeira risada de verdade que você ouve neste prédio.',
    fala('Sr. Quint', 'Quatro cadeiras é quando eles não sabem o que fazer com a pessoa.', null, 'Ele limpa a boca.'),
    fala('Sr. Quint', 'Eu vi quatro cadeiras uma vez em dezenove anos, e foi por causa de uma menina que apareceu aqui com um Snorlax e uma ordem judicial.'),
    d=>fala(d.jogador.nome, 'E no que deu?'),
    fala('Sr. Quint', 'Deu que hoje ela trabalha no terceiro andar e o Snorlax dorme no pátio dos fundos, e ninguém nunca explicou direito.', null, 'Ele volta a comer.'),
    fala('Sr. Quint', 'Aqui é assim. Metade das coisas nunca é explicada direito e funciona igual.')
  ],
  ef:{registrar:'Quatro cadeiras é quando eles não sabem o que fazer com a pessoa.'},
  escolhas:[
    {texto:'"O senhor já viu alguém sair de lá?"', vai:'c21_ja_viu_sair'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_ja_viu_sair:{
  texto:[
    'Ele mastiga devagar antes de responder.',
    '"Eu vi todo mundo sair de lá, {moço|moça}, porque a sala quatro tem uma tomada que dá defeito e eu subo lá toda semana."',
    'Ele põe o garfo na bandeja.',
    '"Tem os que saem assinando e os que saem sem assinar, e eu vou te dizer uma coisa que eu reparei em dezenove anos: dá para saber qual é pelo jeito de descer a escada."',
    '"E qual é o jeito?"',
    '"Quem assinou desce olhando o papel." Ele levanta a bandeja. "Quem não assinou desce olhando a parede dos campeões."'
  ],
  ef:{flag:'ouviu_o_nicacio', instabilidade:1,
      npc:{nome:'Sr. Quint', opiniao:2, memoria:'Te contou como dá para saber quem assinou pelo jeito de descer a escada.'},
      registrar:'Quem assina desce olhando o papel. Quem não assina desce olhando a parede.'},
  escolhas:[{texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}]
},

c21_o_que_acontece_em_cima:{
  texto:[
    'Você pergunta a uma moça do setor de licenças, que está comendo sozinha com um livro aberto ao lado da bandeja.',
    'Ela marca a página com o dedo antes de responder.',
    fala('a moça das licenças', 'Em cima? Reunião, principalmente.', null, 'Ela pensa.'),
    fala('a moça das licenças', 'Quarta é comitê de calendário. Quinta de manhã é homologação de ginásio. Sexta ninguém sobe.'),
    d=>fala(d.jogador.nome, 'E a Elite 4?'),
    fala('a moça das licenças', 'A Elite 4 treina de manhã, das seis às nove, e depois vai embora.', null, 'Ela volta ao livro.'),
    fala('a moça das licenças', 'Eles não moram aqui. Isso é a primeira coisa que decepciona todo mundo que chega.'),
    'Ela vira uma página.',
    fala('a moça das licenças', 'O senhor Mervin mora. Mas ele tem setenta e três anos e não tem mais para onde ir.')
  ],
  ef:{flag:'sabe_do_quintino',
      registrar:'A Elite 4 treina das seis às nove e vai embora. Só o Sr. Mervin mora no Planalto.'},
  escolhas:[
    {texto:'"Quem é o senhor Mervin?"', vai:'c21_quem_e_quintino'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'},
    {texto:'Puxar assunto com a mesa da manutenção.', vai:'c21_mesa_da_manutencao'}
  ]
},

c21_quem_e_quintino:{
  texto:[
    fala('a moça das licenças', 'Foi campeão em quarenta e nove.', null, 'Ela fecha o livro no dedo.'),
    fala('a moça das licenças', 'Depois foi Elite 4 por vinte e dois anos e depois virou uma coisa que não tem cargo.'),
    d=>fala(d.jogador.nome, 'Que coisa?'),
    fala('a moça das licenças', 'Ele senta na borda do poço e olha.', null, 'Ela dá de ombros, sem deboche nenhum.'),
    fala('a moça das licenças', 'Todo desafio, todo treino, toda homologação. Há doze anos.'),
    d=>fala(d.jogador.nome, 'E ninguém acha isso estranho?'),
    fala('a moça das licenças', 'Todo mundo acha.', null, 'Ela abre o livro de novo.'),
    fala('a moça das licenças', 'E todo mundo prefere que ele esteja lá. Inclusive eu, e eu nem subo.')
  ],
  ef:{flag:'sabe_do_quintino',
      registrar:'O Sr. Mervin, campeão de 79, senta na borda do poço da arena há doze anos.'},
  escolhas:[
    {texto:'Pedir para ver a arena antes da reunião.', vai:'c21_pediu_a_arena'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_pediu_a_arena:{
  texto:[
    'A recepcionista olha o relógio da parede.',
    fala('a recepcionista do Planalto', 'Treze e vinte e cinco. Dá.'),
    'Ela te dá um crachá de visitante com barbante e aponta a escada de serviço.',
    'A arena da Elite 4 fica dois andares abaixo do saguão e é um poço de pedra com iluminação vinda de cima.',
    'Não tem plateia. Nunca teve. É outra coisa que quem conta a história da Liga deixa de fora.',
    'E, na borda do poço, com as pernas para dentro, tem um homem de setenta e poucos anos sentado, sozinho, olhando o chão vazio.'
  ],
  ef:{flag:'viu_a_arena',
      registrar:'A arena da Elite 4 é um poço de pedra sem plateia.'},
  escolhas:[
    {texto:'Sentar do lado dele.', vai:'c21_quintino'},
    {texto:'Descer ao poço e pisar no chão da arena.', vai:'c21_pisou_na_arena'},
    {texto:'Olhar e subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_quintino:{
  texto:[
    'Você senta na borda a uns dois metros dele.',
    'Ele não vira a cabeça e não parece incomodado.',
    'Passam uns quarenta segundos assim.',
    '"{O senhor|A senhora} é {o|a} das duas horas."',
    '"Sou."',
    '"Então {o senhor|a senhora} tem trinta minutos e uma escada." Ele continua olhando o poço. "Pergunta o que quiser. Eu tenho doze anos de tempo livre."'
  ],
  ef:{flag:'conheceu_quintino',
      npc:{nome:'Sr. Mervin', opiniao:1, memoria:'Campeão de 79. Senta na borda do poço há doze anos.'},
      registrar:'Conheceu o Sr. Mervin na borda da arena.'},
  escolhas:[
    {texto:'"O senhor senta aqui por quê?"', vai:'c21_quintino_porque'},
    {texto:'"O que eles vão me oferecer?"', vai:'c21_quintino_oferta'},
    {texto:'"O senhor foi campeão. Valeu a pena?"', vai:'c21_quintino_valeu'},
    {texto:'"O senhor conheceu os onze de 1994?"', vai:'c21_quintino_94', cond:d=>!!d.flags.sabe_do_incidente_94}
  ]
},

c21_quintino_porque:{
  texto:[
    'Ele demora, mas não é hesitação: é uma pessoa que fala devagar porque tem tempo.',
    '"Porque quando eu subi aqui em quarenta e nove não tinha ninguém sentado na borda."',
    'Ele balança os pés dentro do poço.',
    '"Eu ganhei, desceram para me cumprimentar, tiraram a foto, e aí todo mundo foi embora e eu fiquei sozinho no poço com o meu time e eu não sabia o que fazer com as mãos."',
    '"E aí o senhor decidiu sentar aqui."',
    '"Doze anos depois de me aposentar, sim." Ele ri baixinho. "Eu demorei quase quarenta anos para entender o que tinha faltado. Faltou alguém sentado na borda."'
  ],
  ef:{instabilidade:0, moral:2,
      npc:{nome:'Sr. Mervin', opiniao:2, memoria:'Senta na borda porque em 79 não tinha ninguém sentado na borda para ele.'},
      registrar:'O Sr. Mervin senta na borda porque ninguém sentou na borda por ele.'},
  escolhas:[
    {texto:'"O que eles vão me oferecer?"', vai:'c21_quintino_oferta'},
    {texto:'"Valeu a pena?"', vai:'c21_quintino_valeu'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_quintino_oferta:{
  texto:[
    '"Três folhas." Ele responde sem pensar. "Sempre três."',
    '"O senhor sabe quais?"',
    '"Eu sei quais eram no meu tempo e eu duvido que tenham inventado uma quarta." Ele conta nos dedos, devagar. "Um cargo aqui dentro. Um contrato lá fora. E a coisa que eles querem de verdade, que vem por último e vem sem folha."',
    '"Por que sem folha?"',
    '"Porque a terceira não se assina." Ele finalmente vira a cabeça e olha para você. "A terceira eles contam, e a pessoa vai ou não vai."'
  ],
  ef:{flag:'sabe_das_tres_folhas',
      registrar:'Sempre três ofertas. A terceira não tem folha para assinar.'},
  escolhas:[
    {texto:'"E o senhor foi?"', vai:'c21_quintino_foi'},
    {texto:'"Valeu a pena?"', vai:'c21_quintino_valeu'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_quintino_foi:{
  texto:[
    'Ele leva muito tempo para responder.',
    '"Não."',
    'Ele olha o poço.',
    '"Em oitenta e um me falaram de uma coisa em Cinnabar e eu disse que ia pensar, e eu pensei, e eu não fui. E aí fizeram o que fizeram lá, e deu no que deu."',
    '"O senhor não podia saber."',
    '"Eu não podia saber e eu não fui." Ele encolhe os ombros devagar. "As duas coisas são verdade e uma não desmancha a outra. {O senhor|A senhora} vai aprender isso hoje, se ainda não aprendeu."'
  ],
  ef:{instabilidade:1, moral:-2,
      npc:{nome:'Sr. Mervin', opiniao:3, memoria:'Recusou a terceira oferta em 1981 e nunca se perdoou.'},
      registrar:'O Sr. Mervin recusou a terceira oferta em 1981. Era sobre Cinnabar.'},
  escolhas:[
    {texto:'"Valeu a pena ser campeão?"', vai:'c21_quintino_valeu'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_quintino_valeu:{
  texto:[
    '"Valeu a pena?"',
    'Ele responde rápido, dessa vez.',
    '"Valeu por quatro meses."',
    'Ele balança os pés.',
    '"Quatro meses de gente parando na rua e de carta chegando e de convite para inaugurar loja. Depois passou, e eu tinha vinte e três anos e nada para fazer no resto da vida."',
    '"E o que o senhor fez?"',
    '"Elite 4 por vinte e dois anos, que é o mesmo trabalho todo dia." Ele coça o joelho. "{O senhor|A senhora} está me perguntando a coisa errada. Me pergunta o que valeu."',
    'Você pergunta o que valeu.',
    '"O caminho até aqui." Ele aponta o poço vazio com o queixo. "Isso aqui é a parte que acaba. O caminho é a parte que fica."'
  ],
  ef:{moral:3,
      npc:{nome:'Sr. Mervin', opiniao:3, memoria:'Te disse que o título vale quatro meses e o caminho fica.'},
      rep:{eixo:'bom',delta:1,motivo:'Sentou na borda do poço e ouviu um velho'},
      registrar:'O Sr. Mervin: ser campeão valeu quatro meses. O caminho é que fica.'},
  escolhas:[
    {texto:'"O senhor conheceu os onze de 1994?"', vai:'c21_quintino_94', cond:d=>!!d.flags.sabe_do_incidente_94},
    {texto:'Descer ao poço e pisar no chão.', vai:'c21_pisou_na_arena'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_quintino_94:{
  texto:[
    '"Eu conheci sete dos onze."',
    'Ele para de balançar os pés.',
    '"Era uma equipe de campo boa. A melhor que a Liga já teve, e eu digo isso sabendo o peso da frase."',
    '"O que aconteceu no norte em dezoito de agosto?"',
    '"Ninguém sabe." Ele fala isso sem nenhum mistério, com cansaço. "Acharam o acampamento montado. Equipamento no lugar. Comida na panela."',
    'Ele olha para você.',
    '"E se {o senhor|a senhora} está perguntando isso hoje, às treze e quarenta, quer dizer que eles vão te contar da quarta equipe lá em cima."'
  ],
  ef:{flag:['sabe_do_94','sabe_do_acampamento'], instabilidade:1,
      registrar:'Em 18 de agosto de 1994, onze agentes sumiram no norte. Acharam o acampamento montado.'},
  escolhas:[
    {texto:'"Quarta equipe?"', vai:'c21_quarta_equipe'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_quarta_equipe:{
  texto:[
    'Ele volta a olhar o poço.',
    '"Em noventa e quatro foram onze e não voltou ninguém. Depois disso a Liga não mandou mais ninguém para lá por quatro anos."',
    '"E agora?"',
    '"Agora mandaram três equipes em dois anos, e por isso é que faltam quatro nomes na placa lá de cima."',
    'Ele bate na pedra do lado dele, duas vezes, com a palma.',
    '"E agora vão te oferecer a quarta, e {o senhor|a senhora} vai ser uma pessoa só, e isso na cabeça deles é melhor, porque uma pessoa que some é uma pessoa e não uma equipe."'
  ],
  ef:{flag:['sabe_das_tres_equipes','sabe_dos_quatro_novos'], instabilidade:1, moral:-2,
      npc:{nome:'Sr. Mervin', opiniao:3, memoria:'Te avisou do que iam te oferecer antes de subirem.'},
      registrar:'Três equipes em dois anos. Quatro mortos. E agora você.'},
  escolhas:[
    {texto:'Descer ao poço e pisar no chão.', vai:'c21_pisou_na_arena'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_pisou_na_arena:{
  texto:[
    'Você desce a escadinha de ferro e pisa no chão da arena.',
    'É pedra lisa, fria, com marcas de queimado que ninguém tirou e com um ralo no centro para escorrer a água quando lavam.',
    'De baixo, o poço é muito maior do que de cima, e a luz vem de um único ponto do teto e cria uma sombra sua que anda junto.',
    'Você fica no meio, sozinh{o|a}, com o Sr. Mervin sentado na borda, e ninguém mais no prédio inteiro sabe que você está aqui.',
    'E, por quatro ou cinco segundos, você é uma criança de novo, saindo de casa, achando que isto aqui era o ponto de chegada.'
  ],
  ef:{flag:'pisou_na_arena', moral:3,
      rep:{eixo:'bom',delta:1,motivo:'Desceu ao poço sozinho, sem ninguém para ver'},
      registrar:'Pisou no chão da arena da Elite 4 sozinh{o|a}, antes da reunião.'},
  escolhas:[
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'},
    {texto:'Voltar à borda e conversar mais.', vai:'c21_quintino'}
  ]
},

c21_esperou_na_porta:{
  texto:[
    'A sala quatro fica no terceiro andar, no fim de um corredor com carpete e três quadros de paisagem.',
    'Tem uma cadeira do lado de fora, e você senta nela, e é catorze menos oito.',
    'Pela porta, você ouve três vozes discutindo uma coisa que não tem nada a ver com você: a data de uma homologação de ginásio que caiu em feriado.',
    'Às catorze em ponto a porta abre e uma mulher de uns quarenta e cinco anos diz o seu nome.',
    'A sala é a mesma de sempre nesses lugares: mesa comprida, quatro cadeiras, três ocupadas.',
    'E, em cima da mesa, uma pasta com o seu nome.'
  ],
  escolhas:[
    {texto:'Sentar.', vai:'c21_pasta'},
    {texto:'Ficar em pé.', vai:'c21_ficou_em_pe'},
    {texto:'"Quem são os senhores?"', vai:'c21_quem_sao_os_tres'}
  ]
},

c21_ficou_em_pe:{
  texto:[
    'Você fica em pé.',
    'A mulher do centro olha a cadeira, olha você, e não insiste.',
    fala('Conselheira Edda Thistle', 'Como {o senhor|a senhora} preferir.'),
    'O homem da direita, que é mais velho e tem uma pasta sanfonada em cima da mesa, olha para ela de um jeito que quer dizer alguma coisa que você não consegue ler.',
    'Ela abre a sua pasta assim mesmo.'
  ],
  ef:{flag:'ficou_em_pe_na_liga'},
  escolhas:[
    {texto:'"Quem são os senhores?"', vai:'c21_quem_sao_os_tres'},
    {texto:'Deixá-la começar.', vai:'c21_pasta'}
  ]
},

c21_quem_sao_os_tres:{
  texto:[
    fala('Conselheira Edda Thistle', 'Justo.', null, 'Ela fecha a pasta antes de começar.'),
    fala('Conselheira Edda Thistle', 'Conselheira Edda Thistle, diretoria de operações. Eu tomo a decisão de hoje.'),
    'O homem mais velho, da direita:',
    fala('Sr. Waldo', 'Waldo. Fiscalização. Eu assino o que ela decide e eu discordo por escrito quando discordo.'),
    'A terceira é uma mulher de uns trinta anos, com um caderno em vez de pasta, que demora um segundo a mais.',
    fala('Maren Kestrel', 'Maren Kestrel. Eu sou do setor de campo.', null, 'Ela não explica mais que isso.'),
    fala('Maren Kestrel', 'Eu estava na segunda equipe.'),
    'Ninguém comenta essa última frase. Ela fica na mesa, no meio de todo mundo, por um tempo.'
  ],
  ef:{flag:['conheceu_os_tres','conheceu_a_bruna'],
      npc:{nome:'Conselheira Edda Thistle', opiniao:0, memoria:'Diretoria de operações. Toma a decisão.'},
      registrar:'A mesa: Conselheira Thistle (operações), Sr. Waldo (fiscalização) e Maren Kestrel, que voltou da segunda equipe.'},
  escolhas:[
    {texto:'"A senhora voltou do norte."', vai:'c21_bruna_voltou'},
    {texto:'Sentar e deixar ela começar.', vai:'c21_pasta'},
    {texto:'"E por que fiscalização está aqui?"', vai:'c21_porque_fiscalizacao'}
  ]
},

c21_bruna_voltou:{
  texto:[
    d=>fala(d.jogador.nome, 'A senhora voltou do norte.'),
    fala('Maren Kestrel', 'Voltei.'),
    'A Conselheira Thistle abre a boca e o Sr. Waldo levanta a mão dois centímetros da mesa, e ela não fala.',
    fala('Maren Kestrel', 'Eu voltei com cinco pessoas de seis.'),
    fala('Maren Kestrel', 'E eu vou te contar o que aconteceu na hora certa, que é depois, porque se eu contar agora {o senhor|a senhora} vai decidir com o estômago.'),
    'Ela abre o caderno dela numa página em branco.',
    fala('Maren Kestrel', 'Eu decidi com o estômago em março e eu perdi uma pessoa.')
  ],
  ef:{flag:'bruna_vai_contar', instabilidade:1,
      npc:{nome:'Maren Kestrel', opiniao:1, memoria:'Voltou do norte com cinco de seis e vai te contar na hora certa.'},
      registrar:'Maren Kestrel voltou do norte com cinco de seis pessoas.'},
  escolhas:[
    {texto:'Sentar.', vai:'c21_pasta'},
    {texto:'"E por que fiscalização está aqui?"', vai:'c21_porque_fiscalizacao'}
  ]
},

c21_porque_fiscalizacao:{
  texto:[
    'O Sr. Waldo responde sem esperar a Conselheira.',
    '"Porque tudo o que for oferecido {ao senhor|à senhora} hoje tem efeito jurídico e alguém tem que responder por isso depois."',
    'Ele abre a pasta sanfonada e mostra, sem entregar, uma folha datilografada com seis linhas riscadas a caneta.',
    '"Isto é a minha discordância por escrito sobre a terceira oferta. Eu protocolei na sexta-feira."',
    '"E mesmo assim vão me oferecer."',
    '"E mesmo assim vão te oferecer." Ele fecha a pasta. "Porque eu discordo e não mando, e é assim que tem que ser, e é assim que é ruim."'
  ],
  ef:{flag:['aguiar_discorda'], instabilidade:1,
      npc:{nome:'Sr. Waldo', opiniao:2, memoria:'Protocolou discordância por escrito contra a terceira oferta.'},
      registrar:'O Sr. Waldo, da fiscalização, protocolou discordância contra a terceira oferta.'},
  escolhas:[
    {texto:'Sentar.', vai:'c21_pasta'},
    {texto:'"O que está escrito na sua discordância?"', vai:'c21_leu_a_discordancia'}
  ]
},

c21_leu_a_discordancia:{
  texto:[
    'Ele olha a Conselheira Thistle. Ela assente.',
    'Ele entrega a folha.',
    '**Considerando que três missões foram enviadas à área e que quatro agentes não retornaram; considerando que não há protocolo de extração aplicável; considerando que o objetivo da missão não é definido em termos operacionais mensuráveis;**',
    '**manifesto-me contrariamente ao envio de pessoal, remunerado ou voluntário, servidor ou terceiro, à área, até que se estabeleça o que se pretende que a pessoa enviada faça ao chegar.**',
    'A última linha é a que pega.',
    'Até que se estabeleça o que se pretende que a pessoa enviada faça ao chegar.'
  ],
  ef:{flag:['leu_a_discordancia'], instabilidade:1,
      rep:{eixo:'bom',delta:1,motivo:'Leu a objeção antes de ouvir a proposta'},
      registrar:'A Liga não sabe dizer o que quer que a pessoa enviada faça ao chegar.'},
  escolhas:[{texto:'Sentar.', vai:'c21_pasta'}]
},

/* ── A pasta e as três perguntas ────────────────────────── */
c21_pasta:{
  texto:[
    'A Conselheira Thistle abre a pasta e não lê — ela já leu.',
    d=>{
      const d2=Estado.dados;
      const linhas=[];
      if (d2.insignias.length) linhas.push(d2.insignias.length === 1 ? 'uma insígnia' : `${d2.insignias.length} insígnias`);
      if (d2.cemiterio.length) linhas.push(d2.cemiterio.length === 1 ? 'uma morte registrada sob sua responsabilidade' : `${d2.cemiterio.length} mortes registradas sob sua responsabilidade`);
      const presos = Estado.lendariosCapturados();
      if (presos.length) linhas.push(presos.length === 1 ? 'um lendário em sua posse' : `${presos.length} lendários em sua posse`);
      if (d2.liga.avisos) linhas.push(d2.liga.avisos === 1 ? 'uma ocorrência no nosso sistema' : `${d2.liga.avisos} ocorrências no nosso sistema`);
      return fala('Conselheira Edda Thistle', linhas.length ? `Vamos ao que consta: ${linhas.join(', ')}.` : 'Consta muito pouco aqui. Isso é raro em alguém que andou tanto.');
    },
    d=>{
      const via = Historia.via();
      if (via==='foragido') return fala('Conselheira Edda Thistle', 'E consta que existe uma operação de distribuição em Celadon que mudou de dono recentemente. Nós não temos prova. Nós temos certeza. As duas coisas são diferentes e só uma delas serve para processo.', null, 'Ela fecha a pasta no meio da frase.');
      if (via==='mercenario') return fala('Conselheira Edda Thistle', 'E consta que o seu nome aparece em três manifestos de carga que não deviam existir. Nós não vamos usar isso hoje.', null, 'Ela fecha a pasta.');
      if (via==='pesquisador') return fala('Conselheira Edda Thistle', 'E consta que metade do material que a Dra. Cordell protocolou nos últimos meses passou pelas suas mãos primeiro. Isso é útil. Útil é uma palavra perigosa aqui.', null, 'Ela fecha a pasta.');
      if (via==='heroi') return fala('Conselheira Edda Thistle', 'E consta uma lista de lugares em que {o senhor|a senhora} apareceu logo antes de alguma coisa parar de funcionar. Sempre coisas que a gente queria que parassem de funcionar, e sempre sem mandado.', null, 'Ela fecha a pasta.');
      return fala('Conselheira Edda Thistle', 'E consta que {o senhor|a senhora} foi a muito lugar e não pediu nada a ninguém.', null, 'Ela fecha a pasta.');
    },
    fala('Conselheira Edda Thistle', 'Eu vou fazer três perguntas. Não são pegadinha.')
  ],
  escolhas:[
    {texto:'"Pode perguntar."', vai:'c21_pergunta1'},
    {texto:'"Antes: eu quero ler a minha pasta."', vai:'c21_leu_a_propria_pasta'},
    {texto:'"Quem escreveu essa pasta?"', vai:'c21_quem_escreveu'}
  ]
},

c21_leu_a_propria_pasta:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu quero ler a minha pasta.'),
    'O Sr. Waldo responde antes da Conselheira, e responde com a rapidez de quem esperava a pergunta.',
    fala('Sr. Waldo', 'Pode.', null, 'Ele empurra a pasta pela mesa.'),
    fala('Sr. Waldo', '{O senhor|A senhora} é {o titular|a titular} do dado. Está na norma interna 14 e ninguém nunca pediu.'),
    'São vinte e duas páginas.',
    'Relatórios de agentes de campo, recortes de jornal, um formulário de ocorrência de Pewter com a sua letra, e uma folha com uma linha do tempo dos seus últimos meses, com lacunas marcadas a lápis.',
    'As lacunas são exatamente os lugares onde você achou que ninguém estava olhando.'
  ],
  ef:{flag:['leu_a_propria_pasta'], instabilidade:1,
      rep:{eixo:'bom',delta:1,motivo:'Pediu para ler a própria pasta, o que ninguém nunca pediu'},
      registrar:'Leu a própria pasta na Liga: 22 páginas, com lacunas marcadas a lápis.'},
  escolhas:[
    {texto:'Perguntar sobre as lacunas.', vai:'c21_as_lacunas'},
    {texto:'"Quem escreveu isso?"', vai:'c21_quem_escreveu'},
    {texto:'Devolver e deixar ela perguntar.', vai:'c21_pergunta1'}
  ]
},

c21_as_lacunas:{
  texto:[
    d=>fala(d.jogador.nome, 'O que são as lacunas?'),
    fala('Conselheira Edda Thistle', 'São os períodos em que a gente perdeu {o senhor|a senhora}.', null, 'Sem constrangimento nenhum.'),
    fala('Conselheira Edda Thistle', 'Quatro lacunas. A maior tem dezenove dias.'),
    'Dezenove dias é exatamente o tempo que você levou entre uma coisa e outra que você preferiria que não estivesse escrita em lugar nenhum.',
    d=>fala(d.jogador.nome, 'E vocês tentaram preencher?'),
    fala('Conselheira Edda Thistle', 'Tentamos e não conseguimos, e o Sr. Waldo determinou que ficasse a lápis e em branco em vez de ficar suposição a caneta.', null, 'Ela olha para ele.'),
    fala('Conselheira Edda Thistle', 'Isso, aqui dentro, é uma briga de dois anos que ele ganhou.')
  ],
  ef:{npc:{nome:'Sr. Waldo', opiniao:2, memoria:'Brigou dois anos para que suposição não virasse registro.'},
      registrar:'A Liga tem quatro lacunas sobre você, marcadas a lápis, porque o Sr. Waldo não deixou virar caneta.'},
  escolhas:[
    {texto:'"Quem escreveu isso?"', vai:'c21_quem_escreveu'},
    {texto:'Devolver a pasta.', vai:'c21_pergunta1'}
  ]
},

c21_quem_escreveu:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem escreveu essa pasta?'),
    fala('Conselheira Edda Thistle', 'Onze pessoas diferentes.', null, 'Ela folheia o rodapé das páginas, onde tem matrícula e data.'),
    d=>{ const [c1, c2] = ['Pewter','Cerulean','Vermilion','Celadon'].filter(c => c !== d.jogador.cidade);
      return fala('Conselheira Edda Thistle', `Agente de campo, agente de campo, delegacia de ${c1}, delegacia de ${c2}, uma professora de ${d.jogador.cidade}.`); },
    d=>fala(d.jogador.nome, `Uma professora de ${d.jogador.cidade}?`),
    'Ela vira a página e lê em voz alta:',
    fala('Conselheira Edda Thistle', 'Manifestação espontânea de terceiro. Ela escreveu para a Liga por conta própria, dias depois de {o senhor|a senhora} sair de casa, pedindo que, se alguém do serviço te encontrasse, avisasse que estava tudo bem.'),
    'A Conselheira Thistle levanta os olhos.',
    fala('Conselheira Edda Thistle', 'A carta está anexada e nunca foi respondida. Isso é falha nossa e eu vou responder esta semana.')
  ],
  ef:{flag:['a_carta_da_professora'], moral:4, instabilidade:1,
      rep:{eixo:'bom',delta:1,motivo:'Descobriu quem escreveu para a Liga por você'},
      registrar:'Uma professora de Pallet escreveu à Liga há dois anos pedindo notícia sua. Nunca responderam.'},
  escolhas:[
    {texto:'"Me deixa ler a carta."', vai:'c21_leu_a_carta'},
    {texto:'"Eu respondo. Me dá o endereço."', vai:'c21_vai_responder'},
    {texto:'Deixar para depois e ouvir as perguntas.', vai:'c21_pergunta1'}
  ]
},

c21_leu_a_carta:{
  texto:[
    'A carta é de meia folha, escrita em letra de professora, com a linha reta sem pauta.',
    '**Prezados senhores. Não sei se é aqui que se escreve isto. {Um aluno meu|Uma aluna minha} saiu de casa e não {é fugido|é fugida}, {ele|ela} avisou, e em casa sabem.**',
    '**Eu só queria pedir que, se alguém do serviço dos senhores {encontrar ele|encontrar ela} por aí, {diga para ele|diga para ela} que não precisa voltar com nada. {Ele|Ela} acha que precisa voltar com alguma coisa.**',
    '**Atenciosamente.**',
    'E embaixo, a assinatura e o nome de uma pessoa que te ensinou a ler.'
  ],
  ef:{flag:['leu_a_carta_da_professora'], moral:6, instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Leu a carta que alguém escreveu por você há dois anos'},
      registrar:'A carta dizia: diga para ele que não precisa voltar com nada.'},
  escolhas:[
    {texto:'Pedir uma cópia.', vai:'c21_copia_da_carta'},
    {texto:'"Eu respondo. Me dá o endereço."', vai:'c21_vai_responder'},
    {texto:'Fechar a pasta e ouvir as perguntas.', vai:'c21_pergunta1'}
  ]
},

c21_copia_da_carta:{
  texto:[
    'O Sr. Waldo faz a cópia ele mesmo, numa máquina do corredor, e volta com a folha ainda quente e uma segunda folha.',
    '"A segunda é o protocolo de recebimento, com data e carimbo." Ele entrega as duas. "Se um dia {o senhor|a senhora} quiser provar que ela escreveu, a que vale é essa."',
    'Você dobra as duas juntas e guarda no bolso de dentro, contra o peito, e não é um gesto que você decidiu fazer.'
  ],
  ef:{itens:{'Cópia da carta da professora':1}, moral:2,
      registrar:'Guardou a cópia da carta e o protocolo de recebimento.'},
  escolhas:[
    {texto:'"Eu respondo. Me dá o endereço."', vai:'c21_vai_responder'},
    {texto:'Ouvir as perguntas.', vai:'c21_pergunta1'}
  ]
},

c21_vai_responder:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu respondo. Me dá o endereço.'),
    'A Conselheira Thistle escreve o endereço num papel timbrado e entrega.',
    'É o endereço da escola, que você sabe de cor, e o número da sala, que você também sabe de cor.',
    fala('Maren Kestrel', '{O senhor|A senhora} vai responder o quê?', null, 'Do outro lado da mesa.'),
    'Você fica um tempo sem responder.',
    d=>fala(d.jogador.nome, 'Eu ainda não sei.'),
    fala('Maren Kestrel', 'Boa resposta.', null, 'E escreve alguma coisa no caderno dela.')
  ],
  ef:{flag:['vai_responder_a_professora'], moral:3,
      rep:{eixo:'bom',delta:1,motivo:'Decidiu responder a carta'},
      registrar:'Pegou o endereço da escola para responder a carta.'},
  escolhas:[{texto:'Ouvir as perguntas.', vai:'c21_pergunta1'}]
},

c21_pergunta1:{
  texto:[
    fala('Conselheira Edda Thistle', 'Primeira: por que {o senhor|a senhora} saiu de casa?'),
    'A pergunta é feita sem nenhuma ironia e sem nenhum interesse aparente, do jeito que se pergunta a profissão de alguém num formulário.',
    'E é por isso que ela pega.'
  ],
  escolhas:[
    {texto:d=>`"${d.jogador.objetivo}"`, vai:'c21_p1_objetivo', ef:{flag:'respondeu_objetivo'}, cond:d=>!!(d.jogador.objetivo || '').trim()},
    {texto:'"Pra ver até onde eu chegava."', vai:'c21_p1_objetivo', ef:{flag:'respondeu_objetivo'}, cond:d=>!(d.jogador.objetivo || '').trim()},
    {texto:'"Eu já não lembro mais."', vai:'c21_p1_esqueceu',
     ef:{flag:'esqueceu_objetivo', rep:{eixo:'bom',delta:1,motivo:'Foi honesto sobre ter perdido o rumo'}}},
    {texto:'"Não é da sua conta."', vai:'c21_p1_recusou', ef:{flag:'recusou_pergunta1'}},
    {texto:'"Pelo mesmo motivo que todo mundo: porque ficar era pior."', vai:'c21_p1_ficar_era_pior'}
  ]
},

c21_p1_objetivo:{
  texto:[
    'Você responde com a frase que você diz desde que saiu de casa, do jeito que você diz.',
    'A Conselheira Thistle anota duas palavras. Duas.',
    'A Maren Kestrel anota bem mais que duas.',
    fala('Maren Kestrel', 'E {o senhor|a senhora} conseguiu?'),
    d=>{
      if (d.insignias.length >= 6) return 'Você olha as insígnias no bolso e a resposta não vem, porque a pergunta não é sobre insígnia e {vocês dois|vocês duas} sabem disso.';
      if (d.cemiterio.length) return 'Você pensa em quem não voltou e a resposta não vem.';
      return 'Você abre a boca e a resposta não vem.';
    },
    fala('Maren Kestrel', 'Anotado.', null, 'E não insiste.')
  ],
  escolhas:[{texto:'Segunda pergunta.', vai:'c21_pergunta2'}]
},

c21_p1_esqueceu:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu já não lembro mais.'),
    'A Conselheira Thistle levanta os olhos.',
    fala('Conselheira Edda Thistle', '{O senhor|A senhora} lembra e não quer dizer, ou {o senhor|a senhora} esqueceu mesmo?'),
    d=>fala(d.jogador.nome, 'Eu esqueci mesmo.'),
    'Ela anota, e o Sr. Waldo anota também, e é a primeira vez que ele anota alguma coisa.',
    fala('Sr. Waldo', 'Isso acontece com todo mundo que faz mais de seis meses de campo.', null, 'Sem levantar a cabeça.'),
    fala('Sr. Waldo', 'Está na literatura e ninguém aqui lê a literatura.')
  ],
  ef:{instabilidade:1, moral:-2,
      registrar:'Você já não lembra por que saiu de casa.'},
  escolhas:[{texto:'Segunda pergunta.', vai:'c21_pergunta2'}]
},

c21_p1_recusou:{
  texto:[
    d=>fala(d.jogador.nome, 'Não é da sua conta.'),
    fala('Conselheira Edda Thistle', 'Certo.', null, 'Ela escreve recusou a responder e fecha a caneta.'),
    fala('Conselheira Edda Thistle', 'Não é mesmo.'),
    'E segue, sem nenhum ressentimento, o que de alguma maneira é pior.',
    'A Maren Kestrel, do outro lado, escreve muito mais do que quatro palavras.'
  ],
  escolhas:[{texto:'Segunda pergunta.', vai:'c21_pergunta2'}]
},

c21_p1_ficar_era_pior:{
  texto:[
    d=>fala(d.jogador.nome, 'Pelo mesmo motivo que todo mundo: porque ficar era pior.'),
    'A Maren Kestrel para de escrever.',
    fala('Maren Kestrel', 'Essa é a minha resposta também.', null, 'Para a mesa, não para você.'),
    fala('Maren Kestrel', 'Eu saí de Fuchsia com dezoito anos com essa frase na boca.'),
    'A Conselheira Thistle anota sem comentar.',
    fala('Sr. Waldo', 'E a minha, e eu tenho sessenta e dois.', 'baixo', 'Do lado, para ninguém em particular.')
  ],
  ef:{flag:'ficar_era_pior', moral:1,
      npc:{nome:'Maren Kestrel', opiniao:2, memoria:'Deu a mesma resposta que você à primeira pergunta.'},
      registrar:'Os três da mesa saíram de casa pelo mesmo motivo que você.'},
  escolhas:[{texto:'Segunda pergunta.', vai:'c21_pergunta2'}]
},

c21_pergunta2:{
  texto:[
    fala('Conselheira Edda Thistle', 'Segunda: de tudo que {o senhor|a senhora} fez, o que refaria diferente?'),
    d=>{
      const d2=Estado.dados;
      if (d2.cemiterio.length) return `Ela não desvia o olhar. Você pensa em ${nomeExib(d2.cemiterio[0])} antes de conseguir pensar em qualquer outra coisa.`;
      if (d2.flags.incendiou_deposito) return 'Você pensa nos seis que não conseguiam andar.';
      if (d2.flags.destruiu_o_11) return 'Você pensa em onze coisas em tanques e no fato de que você não perguntou nada a nenhuma delas.';
      if (d2.flags.ignorou_marta) return 'Você pensa numa mulher sentada na beira de um rio.';
      if (d2.flags.viu_o_galpao4) return 'Você pensa numa caixa de plástico com um cobertor lavado e dobrado em quatro.';
      return 'Você leva mais tempo do que gostaria para achar uma resposta.';
    }
  ],
  escolhas:[
    {texto:'Responder com a verdade, seja qual for.', vai:'c21_p2_verdade',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Assumiu o próprio erro diante da Liga'}, flag:'assumiu_erro'}},
    {texto:'"Nada."', vai:'c21_p2_nada',
     ef:{flag:'nao_refaria_nada', rep:{eixo:'ruim',delta:1,motivo:'Disse à Liga que não refaria nada'}}},
    {texto:'"Eu teria feito mais cedo."', vai:'c21_p2_mais_cedo', ef:{flag:'faria_mais_cedo'}},
    {texto:'"Eu teria perguntado mais e feito menos."', vai:'c21_p2_perguntado'}
  ]
},

c21_p2_verdade:{
  texto:[
    'Você conta.',
    'Leva quatro minutos e em nenhum momento alguém interrompe, e o pior é que você ouve a própria voz dizendo em voz alta coisas que você só tinha dito para si mesm{o|a} em barraca, no escuro.',
    'Quando termina, a sala fica quieta.',
    'O Sr. Waldo é quem fala.',
    '"Isso que {o senhor|a senhora} acabou de contar não está na pasta." Ele bate na pasta sanfonada com dois dedos. "E eu não vou pôr."',
    '"Por quê?"',
    '"Porque {o senhor|a senhora} contou por vontade e a gente não achou. E se a gente passar a registrar o que as pessoas contam por vontade, elas param de contar."'
  ],
  ef:{instabilidade:1, moral:4,
      npc:{nome:'Sr. Waldo', opiniao:3, memoria:'Decidiu não registrar o que você contou por vontade própria.'},
      registrar:'Contou à Liga o que refaria. O Sr. Waldo decidiu não registrar.'},
  escolhas:[{texto:'Terceira pergunta.', vai:'c21_pergunta3'}]
},

c21_p2_nada:{
  texto:[
    d=>fala(d.jogador.nome, 'Nada.'),
    'A Conselheira Thistle anota.',
    'A Maren Kestrel levanta os olhos e olha para você por uns três segundos, e depois volta ao caderno.',
    fala('Maren Kestrel', 'Eu vou te dizer uma coisa que não é da entrevista.'),
    fala('Maren Kestrel', 'Eu também respondi nada em março, e eu perdi uma pessoa em abril.'),
    'Ela vira a página.',
    fala('Maren Kestrel', 'Não tem relação de causa. Eu só não gosto de ouvir essa resposta.')
  ],
  ef:{instabilidade:1, moral:-2,
      npc:{nome:'Maren Kestrel', opiniao:0, memoria:'Não gosta de ouvir nada como resposta.'},
      registrar:'Disse à Liga que não refaria nada.'},
  escolhas:[{texto:'Terceira pergunta.', vai:'c21_pergunta3'}]
},

c21_p2_mais_cedo:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu teria feito mais cedo.'),
    fala('Conselheira Edda Thistle', 'Feito o quê mais cedo?', null, 'É a primeira vez que ela faz uma pergunta de acompanhamento.'),
    'Você explica.',
    'Ela anota, e depois faz uma coisa que ninguém faz numa entrevista: ela lê em voz alta o que anotou, para conferir.',
    fala('Conselheira Edda Thistle', 'Está certo?'),
    d=>fala(d.jogador.nome, 'Está.'),
    fala('Conselheira Edda Thistle', 'Bom.', null, 'Ela vira a página.'),
    fala('Conselheira Edda Thistle', 'Eu leio em voz alta porque metade dos erros deste prédio é anotação mal feita.')
  ],
  escolhas:[{texto:'Terceira pergunta.', vai:'c21_pergunta3'}]
},

c21_p2_perguntado:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu teria perguntado mais e feito menos.'),
    'O Sr. Waldo solta um som curto pelo nariz que, num homem daquele tamanho, é o equivalente a uma gargalhada.',
    fala('Sr. Waldo', 'Escreve isso inteiro. Palavra por palavra.', null, 'Para a Conselheira.'),
    'Ela escreve.',
    fala('Sr. Waldo', '{O senhor|A senhora} acabou de resumir o relatório que eu protocolei na sexta em uma linha, e eu levei seis páginas.')
  ],
  ef:{flag:'perguntar_mais_fazer_menos', 
      npc:{nome:'Sr. Waldo', opiniao:3, memoria:'Mandou anotar a sua resposta palavra por palavra.'},
      rep:{eixo:'bom',delta:2,motivo:'Disse em uma linha o que a fiscalização levou seis páginas para dizer'},
      registrar:'Perguntar mais e fazer menos.'},
  escolhas:[{texto:'Terceira pergunta.', vai:'c21_pergunta3'}]
},

c21_pergunta3:{
  texto:[
    fala('Conselheira Edda Thistle', 'Terceira.', null, 'Ela junta as mãos.'),
    fala('Conselheira Edda Thistle', 'Existe alguma coisa em Kanto que só {o senhor|a senhora} pode resolver?'),
    'A pergunta parece vaidosa até você perceber que não é: eles já sabem a resposta e querem ver se você sabe.'
  ],
  escolhas:[
    {texto:'"Tem uma coisa no norte."', vai:'c21_p3_norte', ef:{flag:'falou_do_norte'}},
    {texto:'"Não. Ninguém é insubstituível."', vai:'c21_p3_modestia', ef:{flag:'modestia'}},
    {texto:'"Tem. Eu."', vai:'c21_p3_arrogancia', ef:{flag:'arrogancia', rep:{eixo:'ruim',delta:1,motivo:'Se declarou insubstituível diante da Liga'}}},
    {texto:'"Não. E é exatamente por isso que vocês vão me mandar."', vai:'c21_p3_por_isso'}
  ]
},

c21_p3_norte:{
  texto:[
    d=>fala(d.jogador.nome, 'Tem uma coisa no norte.'),
    'Os três param ao mesmo tempo, e é a primeira reação sincronizada da reunião inteira.',
    fala('Conselheira Edda Thistle', 'Como {o senhor|a senhora} sabe do norte?'),
    d=>{
      if (d.flags.sabe_do_94 || d.flags.sabe_das_tres_equipes) return 'Você conta do Sr. Mervin e da borda do poço. A Conselheira fecha os olhos por um segundo. O Sr. Waldo sorri com metade da boca.';
      if (d.flags.viu_a_placa) return 'Você conta da placa de bronze atrás da escada, dos quarenta e um nomes e dos onze de dezoito de agosto. Ninguém responde nada por uns bons quatro segundos.';
      return 'Você não sabe explicar direito como sabe. Você só sabe.';
    },
    fala('Conselheira Edda Thistle', 'Certo.', null, 'Ela fecha a pasta.'),
    fala('Conselheira Edda Thistle', 'Então a gente pula a parte de te convencer.')
  ],
  ef:{flag:'sabe_do_norte_antes'},
  escolhas:[{texto:'Ouvir as ofertas.', vai:'c21_ofertas'}]
},

c21_p3_modestia:{
  texto:[
    d=>fala(d.jogador.nome, 'Não. Ninguém é insubstituível.'),
    fala('Conselheira Edda Thistle', 'Correto.', null, 'Ela anota.'),
    fala('Conselheira Edda Thistle', 'E é por isso que a gente mandou três equipes.'),
    'Ela fecha a caneta.',
    fala('Conselheira Edda Thistle', 'E das três equipes, duas não voltaram inteiras e a terceira não consegue descrever o que viu.'),
    'Ela olha para você.',
    fala('Conselheira Edda Thistle', '{O senhor|A senhora} tem razão em tese e está errad{o|a} em prática, e a diferença entre as duas coisas custou quatro nomes que ainda não estão na placa.')
  ],
  escolhas:[{texto:'Ouvir as ofertas.', vai:'c21_ofertas'}]
},

c21_p3_arrogancia:{
  texto:[
    d=>fala(d.jogador.nome, 'Tem. Eu.'),
    'O Sr. Waldo escreve uma linha na pasta dele e a linha é curta.',
    'A Conselheira Thistle não reage.',
    'A Maren Kestrel, essa sim, fecha o caderno.',
    fala('Maren Kestrel', 'O cara que eu perdi em abril disse essa frase na sexta anterior.'),
    fala('Maren Kestrel', 'Não estou dizendo que tem relação. Estou dizendo que eu ouvi.'),
    'E aí ela abre o caderno de novo e volta a escrever, e ninguém comenta.'
  ],
  ef:{instabilidade:1, moral:-2,
      npc:{nome:'Maren Kestrel', opiniao:-1, memoria:'Já ouviu essa frase de alguém que não voltou.'},
      registrar:'Disse à Liga que só você pode resolver.'},
  escolhas:[{texto:'Ouvir as ofertas.', vai:'c21_ofertas'}]
},

c21_p3_por_isso:{
  texto:[
    d=>fala(d.jogador.nome, 'Não. E é exatamente por isso que vocês vão me mandar.'),
    'A sala fica muito quieta.',
    fala('Conselheira Edda Thistle', 'Continua.'),
    d=>fala(d.jogador.nome, 'Vocês mandaram três equipes e perderam quatro pessoas. Mandar mais uma equipe é caro e aparece. Mandar uma pessoa de fora, que não é servidor, não custa vaga, não custa pensão e não entra na estatística.'),
    'O Sr. Waldo põe a caneta na mesa e não escreve mais nada.',
    fala('Sr. Waldo', 'Está na minha discordância. Item quatro.'),
    'A Conselheira Thistle leva um tempo comprido antes de responder, e quando responde, responde a verdade.',
    fala('Conselheira Edda Thistle', 'Está certo. E mesmo assim eu vou te oferecer.')
  ],
  ef:{flag:['entendeu_a_oferta'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Disse em voz alta por que estavam te escolhendo'},
      npc:{nome:'Sr. Waldo', opiniao:3, memoria:'Você chegou sozinh{o|a} ao item quatro da discordância dele.'},
      registrar:'Uma pessoa de fora não custa vaga, não custa pensão e não entra na estatística.'},
  escolhas:[{texto:'Ouvir as ofertas.', vai:'c21_ofertas'}]
},

/* ── As ofertas ─────────────────────────────────────────── */
c21_ofertas:{
  texto:[
    'Eles se olham. A conversa entre os três acontece sem palavra nenhuma e dura quatro segundos.',
    fala('Conselheira Edda Thistle', 'Certo.', null, 'Ela desliza duas folhas pela mesa e deixa a mão apoiada numa terceira, que não desliza.'),
    fala('Conselheira Edda Thistle', 'Todas são reais. Nenhuma expira hoje.'),
    d=>{
      const via=Historia.via(); const rep=Estado.rep;
      if (rep.eixo==='bom' && rep.bom>=6) return fala('Conselheira Edda Thistle', 'A primeira é uma cadeira na Elite 4. A segunda é a diretoria de fiscalização da Liga, quando o Sr. Waldo se aposentar em dois anos.');
      if (rep.eixo==='ruim' && rep.ruim>=5) return fala('Conselheira Edda Thistle', 'A primeira é um acordo: {o senhor|a senhora} para, a gente arquiva. A segunda é trabalhar para nós fazendo o que {o senhor|a senhora} já faz, só que com cobertura.');
      if (via==='pesquisador') return fala('Conselheira Edda Thistle', 'A primeira é um cargo de pesquisa com verba própria. A segunda é testemunhar no processo que a Dra. Cordell está montando, com proteção.');
      return fala('Conselheira Edda Thistle', 'A primeira é um cargo de instrutor aqui no Planalto. A segunda é um contrato de campo.');
    },
    'Ela tira a mão da terceira folha e a terceira folha continua onde estava, de cabeça para baixo.',
    fala('Conselheira Edda Thistle', 'E a terceira é o norte. Essa não se assina.')
  ],
  escolhas:[
    {texto:'Ler as duas folhas antes de qualquer coisa.', vai:'c21_leu_as_folhas'},
    {texto:'Aceitar o cargo formal da Liga.', vai:'c21_cargo'},
    {texto:'Aceitar o contrato de campo.', vai:'c21_contrato'},
    {texto:'"Me fala do norte."', vai:'c21_norte_conversa'},
    {texto:'Recusar as três e enfrentar a Elite 4.', vai:'c21_desafio_elite'}
  ]
},

c21_leu_as_folhas:{
  texto:[
    'Você lê as duas folhas inteiras, na frente deles, e leva onze minutos.',
    'Ninguém reclama. O Sr. Waldo, inclusive, empurra a garrafa de água para o seu lado da mesa no sexto minuto.',
    'A primeira folha é um cargo: salário, jornada, subordinação, e uma cláusula de dedicação exclusiva.',
    'A segunda é um contrato de prestação de serviço: por missão, sem vínculo, com foro em Saffron e uma cláusula de confidencialidade de cinco anos.',
    'Nas duas tem uma linha idêntica, no mesmo lugar, e é a linha que te faz parar.',
    'O contratado declara ciência de que a atividade envolve risco à integridade física, não cabendo indenização além da prevista.'
  ],
  ef:{flag:['leu_as_folhas'],
      rep:{eixo:'bom',delta:1,motivo:'Leu o contrato inteiro na frente de quem ofereceu'},
      registrar:'As duas propostas trazem a mesma cláusula de risco à integridade física.'},
  escolhas:[
    {texto:'"Quanto foi a indenização prevista das quatro pessoas?"', vai:'c21_quanto_foi'},
    {texto:'"Quem teve esse cargo antes de mim?"', vai:'c21_quem_teve_antes'},
    {texto:'Aceitar o cargo formal.', vai:'c21_cargo'},
    {texto:'Aceitar o contrato de campo.', vai:'c21_contrato'},
    {texto:'"Me fala do norte."', vai:'c21_norte_conversa'}
  ]
},

c21_quanto_foi:{
  texto:[
    d=>fala(d.jogador.nome, 'Quanto foi a indenização prevista das quatro pessoas que não voltaram?'),
    'O Sr. Waldo responde, porque é a área dele, e responde com o número exato e a base de cálculo.',
    'Depois acrescenta, sem que ninguém pergunte:',
    fala('Sr. Waldo', 'Duas famílias receberam em sessenta dias. Uma recebeu em sete meses porque faltou uma certidão. A quarta não recebeu porque a pessoa era prestadora de serviço e não servidora, e prestador não gera pensão.'),
    'Ele fecha a pasta sanfonada.',
    fala('Sr. Waldo', 'E é exatamente esse contrato que está na mesa {do senhor|da senhora} agora, na folha da direita.')
  ],
  ef:{flag:['sabe_da_indenizacao'], instabilidade:1, moral:-2,
      rep:{eixo:'bom',delta:1,motivo:'Perguntou pelas famílias antes de perguntar pelo salário'},
      npc:{nome:'Sr. Waldo', opiniao:4, memoria:'Te disse, sem ser perguntado, que a quarta família não recebeu nada.'},
      registrar:'Prestador de serviço não gera pensão. É esse o contrato da folha da direita.'},
  escolhas:[
    {texto:'"Então mudem o contrato."', vai:'c21_mudem_o_contrato'},
    {texto:'"Quem teve esse cargo antes de mim?"', vai:'c21_quem_teve_antes'},
    {texto:'"Me fala do norte."', vai:'c21_norte_conversa'}
  ]
},

c21_mudem_o_contrato:{
  texto:[
    '"Então mudem o contrato."',
    'A Conselheira Thistle olha o Sr. Waldo. O Sr. Waldo olha o teto por uns dois segundos, fazendo uma conta.',
    '"Dá." Ele volta a olhar a mesa. "Contratação como servidor temporário, prazo determinado, com regime próprio. Leva dezessete dias e passa por três assinaturas, e uma delas é do presidente da Liga."',
    '"E por que não foi feito nas outras quatro vezes?"',
    '"Porque ninguém pediu." Ele abre a pasta e começa a escrever. "E porque eu não propus, e isso é meu, e eu vou propor agora."'
  ],
  ef:{flag:['mudou_o_contrato'],
      rep:{eixo:'bom',delta:3,motivo:'Fez a Liga mudar o vínculo antes de aceitar qualquer coisa'},
      npc:{nome:'Sr. Waldo', opiniao:5, memoria:'Vai propor contratação com regime próprio por sua causa.'},
      registrar:'A Liga vai contratar como servidor temporário, com regime próprio. Ninguém tinha pedido.'},
  escolhas:[
    {texto:'"Quem teve esse cargo antes de mim?"', vai:'c21_quem_teve_antes'},
    {texto:'Aceitar o cargo formal.', vai:'c21_cargo'},
    {texto:'Aceitar o contrato, agora que ele mudou.', vai:'c21_contrato'},
    {texto:'"Me fala do norte."', vai:'c21_norte_conversa'}
  ]
},

c21_quem_teve_antes:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem teve esse cargo antes de mim?'),
    'A Conselheira Thistle consulta uma folha.',
    fala('Conselheira Edda Thistle', 'Instrutor: quatro pessoas em dez anos. Três pediram transferência e uma continua.'),
    d=>fala(d.jogador.nome, 'Por que as três pediram transferência?'),
    fala('Conselheira Edda Thistle', 'Porque o instrutor treina quem vai para o campo.', null, 'Sem amaciar.'),
    fala('Conselheira Edda Thistle', 'E quem treina conhece, e quem conhece fica mal quando a pessoa não volta.'),
    'Ela vira a folha.',
    fala('Conselheira Edda Thistle', 'A que continua é a mais antiga. Ela treinou nove dos onze de 1994.')
  ],
  ef:{flag:['sabe_da_instrutora'], instabilidade:1,
      registrar:'A instrutora mais antiga do Planalto treinou nove dos onze de 1994.'},
  escolhas:[
    {texto:'"Eu quero falar com ela."', vai:'c21_instrutora'},
    {texto:'Aceitar o cargo formal.', vai:'c21_cargo'},
    {texto:'"Me fala do norte."', vai:'c21_norte_conversa'}
  ]
},

c21_instrutora:{
  texto:[
    'Ela se chama Sra. Greta Nettle, tem sessenta e sete anos, e recebe você na sala de treino do segundo andar, que é um ginásio comum com colchonete e espelho.',
    'Ela está enrolando uma corda quando você entra e continua enrolando enquanto fala.',
    '"Nove dos onze." Ela diz isso antes de você perguntar. "Eu sei que é essa a pergunta, porque é sempre essa."',
    '"E a senhora continua treinando."',
    '"Eu continuo treinando." Ela pendura a corda. "Porque os dois que eu não treinei também não voltaram, e eu passei quatro anos achando que isso significava alguma coisa, e não significa nada."',
    'Ela se vira para você.',
    '"Agora {o senhor|a senhora} vai me perguntar o que eu ensino, e eu vou responder, e é uma coisa só."'
  ],
  ef:{flag:'conheceu_iracy',
      npc:{nome:'Sra. Greta Nettle', opiniao:1, memoria:'Instrutora do Planalto há mais de vinte anos. Treinou nove dos onze.'},
      registrar:'Sra. Greta Nettle, instrutora, treinou nove dos onze de 1994.'},
  escolhas:[
    {texto:'"O que a senhora ensina?"', vai:'c21_o_que_ela_ensina'},
    {texto:'"O que a senhora faria no meu lugar?"', vai:'c21_iracy_no_seu_lugar'},
    {texto:'Voltar para a sala.', vai:'c21_ofertas'}
  ]
},

c21_o_que_ela_ensina:{
  texto:[
    '"Eu ensino a voltar."',
    'Ela pega um colchonete e endireita no canto.',
    '"Todo mundo que chega aqui já sabe lutar. Ninguém sabe voltar."',
    '"E como se ensina isso?"',
    '"Com três coisas, e eu vou te dar de graça porque {o senhor|a senhora} não é {meu aluno|minha aluna} e eu não tenho ninguém para dar." Ela levanta um dedo. "Um: marque a hora de sair. Não o horário, a hora. Escrito. Se passar, volta, mesmo sem ter feito nada."',
    'Dois dedos. "Dois: nunca desça uma coisa que {o senhor|a senhora} não sabe subir."',
    'Três. "Três: se der vontade de ficar mais cinco minutos, é a hora de ir embora. Sempre. Sem exceção. Essa é a que mata."'
  ],
  ef:{flag:['aprendeu_a_voltar'], moral:3,
      rep:{eixo:'bom',delta:2,motivo:'Aprendeu as três regras de voltar'},
      npc:{nome:'Sra. Greta Nettle', opiniao:3, memoria:'Te deu as três regras de graça.'},
      registrar:'As três regras: marque a hora de sair; não desça o que não sabe subir; mais cinco minutos é a hora de ir.'},
  escolhas:[
    {texto:'"O que a senhora faria no meu lugar?"', vai:'c21_iracy_no_seu_lugar'},
    {texto:'Voltar para a sala.', vai:'c21_ofertas'}
  ]
},

c21_iracy_no_seu_lugar:{
  texto:[
    '"O que a senhora faria no meu lugar?"',
    'Ela para de arrumar as coisas pela primeira vez.',
    '"Eu iria."',
    'Ela senta no banco de madeira encostado no espelho.',
    '"E eu vou te dizer por que, e não é bonito: porque eu tenho sessenta e sete anos e eu treinei quarenta e um anos de gente para ir, e eu nunca fui."',
    'Ela apoia as mãos nos joelhos.',
    '"Eu não estou te dando conselho. Eu estou te dizendo o que eu carrego. {O senhor|A senhora} decide o que faz com isso."'
  ],
  ef:{instabilidade:1, moral:-1,
      npc:{nome:'Sra. Greta Nettle', opiniao:3, memoria:'Treinou 41 anos de gente para ir e nunca foi.'},
      registrar:'A Sra. Nettle treinou quarenta e um anos de gente para ir e nunca foi.'},
  escolhas:[{texto:'Voltar para a sala.', vai:'c21_ofertas'}]
},

c21_cargo:{
  texto:[
    'Você assina.',
    'O cargo vem com sala, salário, crachá e uma frase que a Conselheira Thistle diz na saída, sem maldade nenhuma:',
    fala('Conselheira Edda Thistle', '{O senhor|A senhora} vai descobrir em uns seis meses que um cargo aqui dentro resolve menos do que {o senhor|a senhora} resolvia sozinh{o|a} lá fora.'),
    d=>fala(d.jogador.nome, 'Por que a senhora está me contratando, então?'),
    fala('Conselheira Edda Thistle', 'Porque o que {o senhor|a senhora} resolvia sozinh{o|a} lá fora não escalava, e o que a gente faz aqui dentro escala mal, e ninguém achou nada melhor que isso ainda.')
  ],
  ef:{flag:'aceitou_cargo_liga',
      executar:d=>{ d.jogador.cargo = Estado.rep.eixo==='bom'&&Estado.rep.bom>=6 ? 'Elite 4' : 'Diretoria de Fiscalização da Liga';
        return [{tipo:'insignia', texto:`Cargo assumido: ${d.jogador.cargo}.`}]; },
      rep:{eixo:'bom',delta:2,motivo:'Assumiu um cargo formal na Liga Pokémon'},
      dinheiro:30000,
      registrar:'Aceitou um cargo formal na Liga Pokémon.'},
  escolhas:[
    {texto:'"E o norte?"', vai:'c21_norte_conversa'},
    {texto:'"O meu primeiro ato é reabrir o caso de 1994."', vai:'c21_reabrir_94', cond:d=>!!d.flags.sabe_do_94 || !!d.flags.sabe_do_incidente_94}
  ]
},

c21_reabrir_94:{
  texto:[
    d=>fala(d.jogador.nome, 'O meu primeiro ato é reabrir o caso de mil novecentos e noventa e quatro.'),
    'O Sr. Waldo levanta a cabeça devagar.',
    fala('Sr. Waldo', '{O senhor|A senhora} tem competência para isso a partir de amanhã, e o processo está no arquivo morto do subsolo, caixa vinte e dois.', null, 'Ele fala isso decorado.'),
    fala('Sr. Waldo', 'Eu sei porque eu subi ele quatro vezes em seis anos e ele desceu quatro vezes.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('Sr. Waldo', 'Porque reabrir custa uma equipe de campo por seis meses, e toda vez que eu pedi, a equipe estava em outro lugar.'),
    'Ele olha a Conselheira Thistle, e ela assente uma vez.',
    fala('Conselheira Edda Thistle', 'Agora não está.')
  ],
  ef:{flag:['reabriu_o_94'], 
      rep:{eixo:'bom',delta:3,motivo:'Usou o primeiro dia de cargo para reabrir um caso de seis anos'},
      npc:{nome:'Sr. Waldo', opiniao:5, memoria:'Viu o caso de 94 ser reaberto depois de quatro tentativas dele.'},
      registrar:'O caso de 18 de agosto de 1994 foi reaberto.'},
  escolhas:[{texto:'"E o norte?"', vai:'c21_norte_conversa'}]
},

c21_contrato:{
  texto:[
    'Você assina o contrato de campo.',
    'Ele te dá cobertura jurídica, acesso a informação da Liga e nenhuma autoridade formal.',
    fala('Conselheira Edda Thistle', 'É o pior dos dois mundos.', null, 'Ela admite, deslizando a cópia para você.'),
    fala('Conselheira Edda Thistle', '{O senhor|A senhora} continua fazendo tudo sozinh{o|a}, só que agora com processo interno se fizer errado.'),
    d=>fala(d.jogador.nome, 'E por que alguém assinaria isso?'),
    fala('Conselheira Edda Thistle', 'Porque assinou.', null, 'Ela guarda a via dela.'),
    d=>d.flags.mudou_o_contrato
      ? 'A cláusula de risco está riscada a caneta e rubricada pelos três, com a anotação: aguarda conversão em regime próprio, prazo 17 dias.'
      : 'A cláusula de risco está lá, na mesma linha de sempre, e você assinou em cima dela.'
  ],
  ef:{flag:'contrato_de_campo',
      executar:d=>{ d.jogador.cargo='Agente de campo da Liga'; return []; },
      itens:{'Ultra Ball':4,'Hyper Potion':4,'Full Heal':3}, dinheiro:12000,
      rep:{eixo:'bom',delta:1,motivo:'Assinou contrato de campo com a Liga'},
      registrar:'Assinou contrato de campo com a Liga.'},
  escolhas:[
    {texto:'"Agora o norte."', vai:'c21_norte_conversa'},
    {texto:'"Eu quero a Maren Kestrel comigo."', vai:'c21_pediu_a_bruna'}
  ]
},

c21_pediu_a_bruna:{
  texto:[
    '"Eu quero a Maren Kestrel comigo."',
    'Ela fecha o caderno antes de qualquer um responder.',
    '"Não."',
    'É ela quem responde, e é definitivo, e ela olha para você quando diz.',
    '"Eu voltei em abril e eu ainda acordo às quatro e vinte todo dia, que é a hora em que eu percebi que a gente era cinco." Ela abre o caderno de novo. "Se eu subir de novo, eu não volto. Eu sei isso do jeito que se sabe o próprio nome."',
    'Uma pausa.',
    '"Mas eu vou te contar tudo. Cada passo. E isso vale mais do que eu ir."'
  ],
  ef:{flag:['bruna_vai_contar'],
      npc:{nome:'Maren Kestrel', opiniao:3, memoria:'Recusou subir de novo e prometeu te contar cada passo.'},
      registrar:'Maren Kestrel não vai voltar ao norte, mas vai te contar tudo.'},
  escolhas:[{texto:'"Então me conta."', vai:'c21_norte_conversa'}]
},

/* ── A Elite 4 ──────────────────────────────────────────── */
c21_desafio_elite:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu não vim para ser {contratado|contratada}.'),
    'A Conselheira Thistle ri, e é a primeira reação humana da reunião inteira.',
    fala('Conselheira Edda Thistle', 'Ótimo. Também tem isso.'),
    'A arena da Elite 4 fica dois andares abaixo e é um poço de pedra com iluminação vinda de cima.',
    'Não tem plateia. Nunca teve. É outra coisa que quem conta a história da Liga deixa de fora.',
    d=>d.flags.conheceu_quintino
      ? 'E, na borda, com as pernas para dentro, o Sr. Mervin continua sentado, exatamente onde estava às treze e trinta.'
      : 'Na borda, com as pernas para dentro, tem um homem de setenta e poucos anos sentado sozinho, que ninguém apresenta.'
  ],
  escolhas:[
    {texto:'Descer e lutar.', vai:'c21_luta_elite'},
    {texto:'Perguntar antes quem são os quatro.', vai:'c21_os_quatro_da_elite'},
    {texto:'Pedir cinco minutos com o seu time antes.', vai:'c21_cinco_minutos'}
  ]
},

c21_os_quatro_da_elite:{
  texto:[
    'A Conselheira Thistle lista sem consultar nada.',
    fala('Conselheira Edda Thistle', 'Três das quatro cadeiras estão com substituto desde agosto.', null, 'Sem baixar a voz e sem desculpa nenhuma.'),
    fala('Conselheira Edda Thistle', 'Os titulares estão vivos, estão em casa, e não vêm. A Liga não tirou o nome das portas e eu fui voto vencido nisso também.'),
    'Na cadeira da Agatha senta um homem de cinquenta e um anos que entra na sala com refletor e música de palco, e que foi vice-campeão da Conferência Indigo antes de virar isso.',
    'Na cadeira da Lorelei senta uma moça de vinte e poucos que não treina tipo nenhum e sim a ficha do desafiante — a mais nova a sentar numa cadeira da Elite em quarenta anos, e a cadeira não é dela.',
    'Na cadeira do Bruno senta um homem que ganhou noventa e oito batalhas seguidas antes dos dezesseis anos, largou tudo aos trinta e três, foi da terceira equipe que subiu ao norte, e voltou, e desde então não fala sobre isso com ninguém.',
    'E a quarta é o Lance, que é o dono da própria placa, tem trinta e sete anos e nunca perdeu aqui dentro.',
    fala('Conselheira Edda Thistle', 'E antes que {o senhor|a senhora} pergunte: sim, os quatro sabem que {o senhor|a senhora} vem. E sim, os quatro leram a sua pasta.')
  ],
  ef:{flag:['sabe_da_elite'],
      registrar:'Um da Elite 4 esteve na terceira equipe do norte e voltou.'},
  escolhas:[
    {texto:'"Eu quero falar com o da terceira equipe."', vai:'c21_o_da_terceira_equipe'},
    {texto:'Descer e lutar.', vai:'c21_luta_elite'},
    {texto:'Pedir cinco minutos com o time.', vai:'c21_cinco_minutos'}
  ]
},

c21_o_da_terceira_equipe:{
  texto:[
    'Ele está no vestiário da arena, sentado num banco de madeira, com as Pokébolas alinhadas na frente dele em cima de uma toalha.',
    'Tem uns quarenta anos e mãos grandes, e não se levanta quando você entra.',
    fala('o lutador da Elite 4', 'Eu sei quem é {o senhor|a senhora}.'),
    d=>fala(d.jogador.nome, 'E o senhor esteve lá.'),
    'Ele pega uma das Pokébolas e gira devagar entre os dedos.',
    fala('o lutador da Elite 4', 'Eu estive lá, eu voltei, e eu não falo sobre isso porque toda vez que eu tento, a frase não fecha.'),
    d=>fala(d.jogador.nome, 'Tenta comigo.'),
    'Ele olha para você por um tempo comprido e depois tenta.'
  ],
  ef:{flag:'conheceu_o_da_terceira',
      npc:{nome:'o lutador da Elite 4', opiniao:1, memoria:'Esteve na terceira equipe e vai tentar te contar.'}},
  escolhas:[{texto:'Ouvir.', vai:'c21_a_frase_que_nao_fecha'}]
},

c21_a_frase_que_nao_fecha:{
  texto:[
    '"A gente chegou no vale às onze da manhã de um dia de sol."',
    'Ele fala devagar, escolhendo.',
    '"E aí a gente chegou no vale às onze da manhã de um dia de sol."',
    'Ele para. Repara que repetiu. Fecha os olhos.',
    '"Está vendo? É sempre aqui."',
    'Ele põe a Pokébola de volta na toalha.',
    '"Eu me lembro da chegada. Eu me lembro da volta. Eu me lembro de estar com fome na volta e de ter comido uma barra de cereal de morango, e eu odeio morango."',
    '"E do meio?"',
    '"Do meio eu me lembro de ter sido perguntado alguma coisa." Ele abre os olhos. "E de ter respondido. E eu daria a minha casa para saber o quê."'
  ],
  ef:{flag:['sabe_da_pergunta'], instabilidade:2,
      npc:{nome:'o lutador da Elite 4', opiniao:3, memoria:'Lembra de ter sido perguntado alguma coisa e de ter respondido.'},
      rep:{eixo:'bom',delta:2,motivo:'Ouviu até o fim uma frase que nunca fechava'},
      registrar:'Quem voltou do vale lembra de ter sido perguntado alguma coisa, e de ter respondido.'},
  escolhas:[
    {texto:'"E os outros cinco lembram do quê?"', vai:'c21_os_outros_cinco'},
    {texto:'Descer e lutar.', vai:'c21_luta_elite'},
    {texto:'Voltar para a sala e falar do norte.', vai:'c21_norte_conversa'}
  ]
},

c21_os_outros_cinco:{
  falante:'o lutador da Elite 4',
  vozes:['N','N','P','N','N','P','N','N','N'],
  texto:[
    '"A gente comparou, na volta, no ônibus." Ele alinha a Pokébola na toalha. "Todo mundo lembra de ter sido perguntado alguma coisa."',
    '"E ninguém lembra o quê."',
    '"Ninguém lembra o quê." Ele levanta os olhos. "Mas quatro dos seis mudaram de vida em três meses."',
    '"Como assim?"',
    '"Um pediu demissão e foi ser professor. Uma se separou. Um voltou a falar com o pai depois de nove anos." Ele conta nos dedos e no quarto para. "E eu entrei na Elite 4, que era uma coisa que eu tinha desistido aos trinta e três."',
    'Ele guarda as Pokébolas no cinto.',
    '"Seja lá o que ele perguntou, {moço|moça}, a gente respondeu com sinceridade."'
  ],
  ef:{flag:['sabe_da_pergunta'], instabilidade:2, moral:2,
      registrar:'Quatro dos seis mudaram de vida em três meses depois do vale.'},
  escolhas:[
    {texto:'Descer e lutar.', vai:'c21_luta_elite'},
    {texto:'Voltar e falar do norte.', vai:'c21_norte_conversa'}
  ]
},

c21_cinco_minutos:{
  texto:[
    'Você pede cinco minutos e ninguém acha estranho, porque todo mundo pede.',
    'Você senta no vestiário e solta o time inteiro num lugar que tem espaço para isso.',
    d=>{
      const n = d.time.length;
      if (!n) return 'E você não tem ninguém para soltar, e isso é uma informação que você só recebe de verdade agora, com um vestiário vazio na frente.';
      if (n === 1) return `E é ${nomeExib(d.time[0])}, só. ${generoDe(d.time[0]) === 'f' ? '{Vocês dois|Vocês duas}' : 'Vocês dois'} num vestiário com espaço para dez.`;
      return `São ${['','um','dois','três','quatro','cinco','seis'][n] || n}. Eles ocupam o vestiário inteiro e um deles imediatamente derruba um banco.`;
    },
    d=>{
      if (d.cemiterio.length) return `E você pensa, sem querer, em ${nomeExib(d.cemiterio[0])}, que não está aqui e deveria estar.`;
      return 'Você não diz nada para eles. Não tem discurso. Você só senta no chão do vestiário no meio deles por cinco minutos.'
    },
    'Quando o tempo acaba, alguém bate na porta duas vezes, com educação.'
  ],
  ef:{flag:'cinco_minutos_no_vestiario', moral:3, curaTime:true,
      rep:{eixo:'bom',delta:1,motivo:'Passou os cinco minutos com o time em vez de com a estratégia'},
      registrar:'Passou cinco minutos no vestiário com o time inteiro solto.'},
  escolhas:[
    {texto:'Descer e lutar.', vai:'c21_luta_elite'},
    {texto:'Desistir da Elite e falar do norte.', vai:'c21_norte_conversa'}
  ]
},

c21_luta_elite:{
  texto:[
    'Você desce a escadinha de ferro e o chão de pedra é frio através da sola.',
    'A luz vem de um ponto só, lá de cima, e não tem torcida, e não tem anúncio, e não tem música.',
    'Tem quatro pessoas em fila do outro lado do poço e um velho sentado na borda.'
  ],
  batalha:{dex:65, nivel:58, tipo:'treinador', treinador:'Elite 4', fuga:false,
           timeExtra:[{dex:94, nivel:59},{dex:149, nivel:62}],
           vitoria:'c21_venceu_elite', derrota:'c21_perdeu_elite', gameover:'gameover'}
},

c21_venceu_elite:{
  texto:[
    'Você vence quatro times seguidos num poço de pedra sem plateia nenhuma.',
    'Não tem confete, não tem hino, não tem foto imediata.',
    'Tem um homem de setenta e poucos anos sentado na borda do poço que desce a escadinha devagar e aperta a sua mão com as duas dele.',
    fala('Sr. Mervin', 'Muita gente chega aqui. Quase ninguém chega aqui com o time inteiro de pé e sem ter comprado nenhum deles.'),
    d=>d.cemiterio.length
      ? fala('Sr. Mervin', `{O senhor|A senhora} perdeu ${d.cemiterio.length === 1 ? 'um' : d.cemiterio.length}. Isso conta. Vai contar para {o senhor|a senhora} por muito tempo, e é bom que conte.`, null, 'Ele olha a lista que trouxeram.')
      : fala('Sr. Mervin', 'E {o senhor|a senhora} não perdeu nenhum. Isso é mais raro que vencer.', null, 'Ele olha a lista que trouxeram.'),
    'Depois ele solta a sua mão e volta a subir a escadinha, devagar, e senta de novo na borda.',
    'E fica lá, olhando, enquanto você fica sozinh{o|a} no meio do poço.',
    'Não é solidão. É a diferença inteira entre quarenta e nove e hoje.'
  ],
  ef:{flag:'venceu_a_elite',
      executar:d=>{ d.jogador.cargo='{Campeão|Campeã} de Kanto'; return [{tipo:'insignia', texto:'Você é {Campeão|Campeã} de Kanto.'}]; },
      rep:{eixo:'bom',delta:3,motivo:'Venceu a Elite 4 do Planalto Indigo'},
      insignia:'Campeão de Kanto', dinheiro:50000,
      curaTime:true,
      registrar:'Venceu a Elite 4 e tornou-se Campeão de Kanto.'},
  escolhas:[
    {texto:'"E o norte?"', vai:'c21_norte_conversa'},
    {texto:'Perguntar da moldura vazia na parede.', vai:'c21_a_moldura'},
    {texto:'Subir e sentar na borda com o Sr. Mervin.', vai:'c21_sentou_na_borda'}
  ]
},

c21_a_moldura:{
  texto:[
    'A moldura vazia na parede dos campeões é a vigésima oitava.',
    'A recepcionista já está com o formulário na mão.',
    fala('a recepcionista do Planalto', 'A foto se tira na segunda de manhã. {O senhor|A senhora} escolhe se é aqui em cima ou no poço.'),
    d=>fala(d.jogador.nome, 'Dá para escolher outra coisa?'),
    'Ela levanta os olhos.',
    fala('a recepcionista do Planalto', 'Como assim?'),
    d=>fala(d.jogador.nome, 'Dá para a foto ser do time e não minha?'),
    'Ela pensa. Consulta um manual. Volta.',
    fala('a recepcionista do Planalto', 'Não tem norma proibindo.', null, 'Ela anota.'),
    fala('a recepcionista do Planalto', 'E em vinte e sete campeões, ninguém perguntou.')
  ],
  ef:{flag:['foto_do_time'], moral:3,
      rep:{eixo:'bom',delta:2,motivo:'Pediu que a foto de campeão fosse do time'},
      registrar:'A vigésima oitava foto da parede dos campeões vai ser do time.'},
  escolhas:[
    {texto:'"E o norte?"', vai:'c21_norte_conversa'},
    {texto:'Subir e sentar na borda com o Sr. Mervin.', vai:'c21_sentou_na_borda'}
  ]
},

c21_sentou_na_borda:{
  texto:[
    'Você sobe a escadinha e senta na borda, a dois metros dele, com as pernas para dentro do poço.',
    'Ele não vira a cabeça.',
    'Passam uns quarenta segundos.',
    fala('Sr. Mervin', 'Agora {o senhor|a senhora} entendeu.'),
    d=>fala(d.jogador.nome, 'Entendi.'),
    'E ficam os dois assim, olhando um poço de pedra vazio, num prédio que fecha às dezoito, numa montanha, enquanto lá embaixo uma van entrega pão para o refeitório do dia seguinte.'
  ],
  ef:{flag:'sentou_na_borda', moral:4,
      npc:{nome:'Sr. Mervin', opiniao:4, memoria:'Você sentou na borda com ele depois de ganhar.'},
      rep:{eixo:'bom',delta:2,motivo:'Sentou na borda do poço em vez de comemorar'},
      registrar:'Sentou na borda do poço com o Sr. Mervin depois de vencer.'},
  escolhas:[{texto:'"E o norte?"', vai:'c21_norte_conversa'}]
},

c21_perdeu_elite:{
  texto:[
    'Você perde. Não tem vergonha nisso — perder aqui é o resultado padrão.',
    'Eles curam o seu time, te dão água e te deixam sentar na borda do poço o tempo que você precisar.',
    '"Volta", diz o Sr. Mervin. "Eu perdi quatro vezes antes de sentar desse lado."',
    '"Quatro?"',
    '"Quatro, e a terceira foi feia." Ele coça o joelho. "Na quarta eu mudei uma coisa só e ganhei, e eu vou te contar qual foi se {o senhor|a senhora} quiser ouvir."'
  ],
  ef:{curaTime:true, flag:'perdeu_a_elite', itens:{'Hyper Potion':3}},
  escolhas:[
    {texto:'"Eu quero ouvir."', vai:'c21_o_que_ele_mudou'},
    {texto:'Treinar e tentar de novo.', vai:'c21_treinou'},
    {texto:'"Deixa a Elite para lá. Me fala do norte."', vai:'c21_norte_conversa'}
  ]
},

c21_o_que_ele_mudou:{
  texto:[
    '"Eu parei de guardar o melhor para o fim."',
    'Ele bate na pedra com a palma.',
    '"Nas três primeiras eu segurava o meu melhor para a última luta, porque é o que a gente faz. E aí eu chegava na última com ele descansado e com o resto do time arrebentado."',
    '"E na quarta?"',
    '"Na quarta eu abri com ele." Ele encolhe os ombros. "E o resto do time chegou inteiro no fim, e foi o resto do time que ganhou."',
    'Ele olha para você.',
    '"Isso serve para muito mais coisa que luta, e {o senhor|a senhora} vai levar uns dez anos para descobrir onde."'
  ],
  ef:{flag:'conselho_do_quintino', moral:2,
      npc:{nome:'Sr. Mervin', opiniao:3, memoria:'Te contou o que mudou na quarta tentativa.'},
      registrar:'O Sr. Mervin parou de guardar o melhor para o fim.'},
  escolhas:[
    {texto:'Treinar e tentar de novo.', vai:'c21_treinou'},
    {texto:'"Me fala do norte."', vai:'c21_norte_conversa'}
  ]
},

c21_treinou:{
  texto:[
    'Você fica no Planalto por três semanas.',
    'Treina das seis às nove com a Sra. Nettle, que não te cobra nada e não te elogia nunca, e come no refeitório do subsolo com o pessoal da manutenção.',
    'Na segunda semana, o Sr. Quint te ensina a consertar uma tomada. Na terceira, você conserta a da sala quatro.',
    'E numa quinta de manhã você desce a escadinha de ferro de novo.'
  ],
  ef:{executar:d=>{ d.time.forEach(p=>ganharExp(p, 1800)); return [{tipo:'info', texto:'Três semanas de treino no Planalto. O time sobe.'}]; },
      curaTime:true, flag:'treinou_no_planalto',
      registrar:'Treinou três semanas no Planalto Indigo.'},
  escolhas:[{texto:'Descer e lutar de novo.', vai:'c21_luta_elite'}]
},

/* ── O norte ────────────────────────────────────────────── */
c21_norte_conversa:{
  texto:[
    'A sala fica diferente quando o assunto muda. Todo mundo senta um pouco mais reto.',
    fala('Conselheira Edda Thistle', 'Acima da Rota 10 tem um vale entre duas paredes de pedra. Não tem nome, não tem trilha marcada e não aparece na carta topográfica com relevo, só com hachura.'),
    fala('Conselheira Edda Thistle', 'Nós mandamos três equipes em dois anos.'),
    'Ela vira a terceira folha, que continua sem ser entregue a ninguém.',
    fala('Conselheira Edda Thistle', 'Uma voltou com duas pessoas a menos e um relatório dizendo que não encontrou nada. Uma voltou com uma pessoa a menos.'),
    fala('Conselheira Edda Thistle', 'E uma voltou inteira e não consegue descrever o que viu. Não é trauma: eles tentam descrever e as frases não fecham.'),
    'A Maren Kestrel não levanta os olhos do caderno.'
  ],
  ef:{flag:'sabe_do_norte', registrar:'A Liga revelou o vale do norte.'},
  escolhas:[
    {texto:'"Me conta das três equipes, uma por uma."', vai:'c21_as_tres_equipes'},
    {texto:'"O que vocês querem que eu faça lá?"', vai:'c21_o_que_querem'},
    {texto:'"Quem foi a pessoa que ficou?"', vai:'c21_quem_ficou'},
    {texto:'"Eu vou."', vai:'c21_aceitou_norte'},
    {texto:'"Manda outra equipe."', vai:'c21_recusou_norte'}
  ]
},

c21_as_tres_equipes:{
  texto:[
    'A Conselheira abre a terceira pasta, que é grossa.',
    fala('Conselheira Edda Thistle', 'Primeira equipe, quatro pessoas, dezoito meses atrás. Voltaram duas, em dois dias. Relatório de três páginas dizendo que não encontraram nada.'),
    fala('Conselheira Edda Thistle', 'Segunda equipe, seis pessoas, em março.'),
    'Ela olha a Maren Kestrel, que continua sem levantar a cabeça.',
    fala('Conselheira Edda Thistle', 'Terceira equipe, seis pessoas, há quatro meses. Voltaram seis. Relatório de vinte e duas páginas em que nenhuma frase termina.'),
    d=>fala(d.jogador.nome, 'E o quarto nome da placa?'),
    'Silêncio.',
    fala('Sr. Waldo', 'O quarto nome não é do vale. É de um acidente de carro na estrada de descida, na volta da primeira equipe.'),
    fala('Sr. Waldo', 'E é o único dos quatro que a gente sabe explicar.')
  ],
  ef:{flag:['sabe_das_tres_equipes'], instabilidade:1,
      registrar:'Três equipes. A segunda voltou com cinco de seis. A terceira voltou inteira e não fecha frase.'},
  escolhas:[
    {texto:'"Quem foi a pessoa que ficou?"', vai:'c21_quem_ficou'},
    {texto:'"Me dá o relatório de vinte e duas páginas."', vai:'c21_relatorio_22'},
    {texto:'"O que vocês querem que eu faça lá?"', vai:'c21_o_que_querem'},
    {texto:'"Eu vou."', vai:'c21_aceitou_norte'}
  ]
},

c21_relatorio_22:{
  texto:[
    'Ela entrega.',
    'São vinte e duas páginas datilografadas por seis pessoas diferentes, cada uma com a sua parte, e o Sr. Waldo grampeou tudo junto na ordem de chegada.',
    'Você lê três páginas e entende o que ela quis dizer.',
    'A gente chegou ao ponto marcado às onze e quarenta e havia. E aí a frase para.',
    'O terreno é aberto no fundo do vale e a sensação de estar sendo. E para.',
    'Perguntei ao chefe da equipe se ele também. E para.',
    'Em vinte e duas páginas, quarenta e uma frases inacabadas, e todas param exatamente na palavra antes da informação.'
  ],
  ef:{flag:['leu_o_relatorio_22'], instabilidade:2,
      itens:{'Relatório de 22 páginas da terceira equipe':1},
      rep:{eixo:'bom',delta:1,motivo:'Leu as vinte e duas páginas em que nada fecha'},
      registrar:'41 frases inacabadas no relatório da terceira equipe, todas parando antes da informação.'},
  escolhas:[
    {texto:'"E o que tem depois da última página?"', vai:'c21_ultima_pagina'},
    {texto:'"O que vocês querem que eu faça lá?"', vai:'c21_o_que_querem'},
    {texto:'"Eu vou."', vai:'c21_aceitou_norte'}
  ]
},

c21_ultima_pagina:{
  texto:[
    'A última página é diferente das outras vinte e uma.',
    'É manuscrita, não datilografada, e tem uma frase só, completa, terminada com ponto final.',
    '**Ele não quis nada de nós.**',
    'Embaixo, a assinatura e a matrícula, e a matrícula é do homem de mãos grandes que está no vestiário dois andares abaixo alinhando Pokébolas numa toalha.',
    'A Conselheira Thistle olha a página de cabeça para baixo, do outro lado da mesa.',
    fala('Conselheira Edda Thistle', 'Essa é a única frase completa dos três relatórios.'),
    fala('Conselheira Edda Thistle', 'E foi escrita quatro dias depois, em casa, e ele trouxe e entregou no balcão.')
  ],
  ef:{flag:['leu_a_frase_completa'], instabilidade:2,
      registrar:'A única frase completa de três relatórios: ele não quis nada de nós.'},
  escolhas:[
    {texto:'"O que vocês querem que eu faça lá?"', vai:'c21_o_que_querem'},
    {texto:'"Quem foi a pessoa que ficou?"', vai:'c21_quem_ficou'},
    {texto:'"Eu vou."', vai:'c21_aceitou_norte'}
  ]
},

c21_quem_ficou:{
  texto:[
    'A Maren Kestrel fecha o caderno e responde ela mesma, porque é dela.',
    '"Vernon. Quarenta e dois anos, dezenove de serviço, duas filhas."',
    'Ela põe as duas mãos na mesa.',
    '"A gente desceu ao fundo do vale às onze. A gente subiu de volta às quatro e vinte da tarde. E no meio do caminho eu contei e a gente era cinco."',
    '"E ninguém viu nada?"',
    '"Ninguém viu nada, ninguém ouviu nada e — e essa é a parte pela qual eu vou responder pelo resto da vida — ninguém sentiu falta."',
    'Ela olha para você.',
    '"A gente andou uma hora e quarenta sendo cinco e achando que era cinco."'
  ],
  ef:{flag:['sabe_do_nogueira'], instabilidade:2, moral:-3,
      npc:{nome:'Maren Kestrel', opiniao:3, memoria:'Andou uma hora e quarenta sem sentir falta de quem faltava.'},
      registrar:'Vernon ficou no vale e a equipe andou 1h40 sem sentir falta.'},
  escolhas:[
    {texto:'"E vocês voltaram para procurar?"', vai:'c21_voltaram_procurar'},
    {texto:'"O que vocês querem que eu faça lá?"', vai:'c21_o_que_querem'},
    {texto:'"Eu vou. E eu procuro o Vernon."', vai:'c21_vai_procurar_nogueira'}
  ]
},

c21_voltaram_procurar:{
  falante:'Maren Kestrel',
  vozes:['N','N','P','N','N','N'],
  texto:[
    '"Voltamos no mesmo dia, às seis e dez, com lanterna."',
    'Ela fala rápido, porque é a parte que ela ensaiou.',
    '"A gente achou o ponto exato. Tinha a marca das nossas botas e as dele, e as dele iam até um lugar e paravam."',
    '"Paravam como?"',
    '"Paravam." Ela abre as mãos. "Não viravam, não corriam, não arrastavam. A última pegada é inteira, com o peso nos dois pés, como quem está parado olhando alguma coisa."',
    'Ela pega o caderno de novo e não abre.',
    '"E a gente ficou três dias e não achou mais nada, e no quarto dia o rádio mandou descer."'
  ],
  ef:{instabilidade:2, moral:-2, flag:'sabe_das_pegadas_do_vernon',
      registrar:'As pegadas do Vernon param inteiras, com o peso nos dois pés.'},
  escolhas:[
    {texto:'"Eu vou. E eu procuro ele."', vai:'c21_vai_procurar_nogueira'},
    {texto:'"O que vocês querem que eu faça lá?"', vai:'c21_o_que_querem'},
    {texto:'"Eu vou."', vai:'c21_aceitou_norte'}
  ]
},

c21_vai_procurar_nogueira:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu vou. E eu procuro o Vernon.'),
    'A Maren Kestrel fica olhando para você por um tempo que passa do confortável.',
    'Depois arranca uma folha do caderno e escreve alguma coisa e dobra e empurra pela mesa.',
    fala('Maren Kestrel', 'Isso é o que ele estava vestindo, a marca da bota e o número, e uma coisa que ele carregava no bolso de cima e que ele nunca tirava.'),
    d=>fala(d.jogador.nome, 'O que era?'),
    fala('Maren Kestrel', 'Uma medalha de natação da filha.', null, 'Ela solta a folha.'),
    fala('Maren Kestrel', 'Se {o senhor|a senhora} achar a medalha e não achar ele, eu quero a medalha.'),
    'Ela abre o caderno e volta a escrever.',
    fala('Maren Kestrel', 'E se {o senhor|a senhora} achar ele, {o senhor|a senhora} não precisa me trazer nada. É só descer e dizer o nome dele em voz alta na portaria, que eu ouço do terceiro andar.')
  ],
  ef:{flag:['procura_o_nogueira'], itens:{'Bilhete da Maren sobre o Vernon':1}, moral:2,
      npc:{nome:'Maren Kestrel', opiniao:5, memoria:'Te pediu para achar a medalha de natação da filha do Vernon.'},
      rep:{eixo:'bom',delta:2,motivo:'Prometeu procurar um homem que a Liga já parou de procurar'},
      registrar:'Procurar o Vernon. Medalha de natação no bolso de cima.'},
  escolhas:[
    {texto:'"O que vocês querem que eu faça lá?"', vai:'c21_o_que_querem'},
    {texto:'"Agora eu vou."', vai:'c21_aceitou_norte'}
  ]
},

c21_o_que_querem:{
  texto:[
    '"O que vocês querem que eu faça lá?"',
    'A pergunta cai na mesa e fica.',
    'O Sr. Waldo tira a folha da discordância dele do bolso, desdobra e põe em cima da mesa sem dizer nada, e todo mundo sabe qual é o item.',
    'A Conselheira Thistle leva um tempo comprido.',
    '"Eu não sei."',
    'Ela não tenta melhorar isso.',
    '"Eu quero saber se ele é perigoso e eu não sei como se mede isso. Eu quero saber o que ele quer e eu não sei perguntar. E eu quero que alguém volte inteiro, e essa é a única parte em que eu sou competente, e é a parte em que eu já falhei quatro vezes."'
  ],
  ef:{flag:['a_liga_nao_sabe'], instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Fez a Liga admitir que não sabe o que quer'},
      npc:{nome:'Conselheira Edda Thistle', opiniao:3, memoria:'Admitiu, na sua frente, que não sabe o que quer do vale.'},
      registrar:'A Liga não sabe o que quer que você faça no vale.'},
  escolhas:[
    {texto:'"Então eu vou sem missão. Eu vou só olhar."', vai:'c21_so_olhar'},
    {texto:'"Então escrevam. Agora. Eu espero."', vai:'c21_escrevam_agora'},
    {texto:'"Eu vou."', vai:'c21_aceitou_norte'},
    {texto:'"Então não mandem ninguém."', vai:'c21_recusou_norte'}
  ]
},

c21_so_olhar:{
  texto:[
    '"Então eu vou sem missão. Eu vou só olhar."',
    'O Sr. Waldo fecha os olhos e, pela primeira vez na tarde, sorri de verdade.',
    '"Isso resolve o meu item quatro." Ele já está escrevendo. "Missão de reconhecimento sem objetivo de intervenção. Isso existe na norma, é a classe D, e ninguém usa porque não dá prestígio."',
    '"E o que muda na prática?"',
    '"Muda que se {o senhor|a senhora} chegar lá e não fizer nada e voltar, {o senhor|a senhora} cumpriu a missão." Ele levanta os olhos. "E isso, {moço|moça}, é a diferença entre voltar e não voltar em oitenta por cento dos casos que eu vi em trinta e um anos."'
  ],
  ef:{flag:['missao_classe_d'], 
      rep:{eixo:'bom',delta:3,motivo:'Transformou a missão em reconhecimento sem intervenção'},
      npc:{nome:'Sr. Waldo', opiniao:5, memoria:'Você resolveu o item quatro da discordância dele.'},
      registrar:'Missão de classe D: reconhecimento, sem objetivo de intervenção. Chegar, olhar e voltar já cumpre.'},
  escolhas:[{texto:'"Então está fechado. Eu vou."', vai:'c21_aceitou_norte'}]
},

c21_escrevam_agora:{
  falante:'Conselheira Edda Thistle',
  vozes:['P','N','P'],
  texto:[
    '"Então escrevam. Agora. Eu espero."',
    'A Conselheira Thistle olha o relógio. São quinze e vinte.',
    '"Isso leva uma hora."',
    '"Eu tenho uma hora."',
    'Eles levam uma hora e quarenta.',
    'Você fica sentad{o|a} naquela sala enquanto três pessoas discutem, riscam, reescrevem e brigam sobre o verbo de uma frase por doze minutos inteiros.',
    'Às dezessete horas, o Sr. Waldo lê em voz alta o que escreveram, e é um parágrafo de quatro linhas, e as quatro linhas dizem uma coisa só: ir, observar, não intervir, voltar em cinco dias.',
    'E, no rodapé, uma linha que a Maren Kestrel pediu para incluir e que ninguém discutiu: a não observância do prazo de retorno não constitui falta.'
  ],
  ef:{flag:['missao_classe_d','tem_a_ordem_escrita'],
      itens:{'Ordem de missão de quatro linhas':1},
      rep:{eixo:'bom',delta:3,motivo:'Ficou uma hora e quarenta esperando eles escreverem'},
      registrar:'A ordem de missão: ir, observar, não intervir, voltar em cinco dias. Atrasar não é falta.'},
  escolhas:[{texto:'"Agora eu vou."', vai:'c21_aceitou_norte'}]
},

c21_devolveu:{
  texto:[
    'Você coloca a Pokébola — ou as Pokébolas — na mesa e empurra.',
    'A sala fica em silêncio de um jeito que não estava previsto na pauta.',
    fala('Conselheira Edda Thistle', 'Obrigada.', null, 'Ela parece genuinamente surpresa, o que diz muito sobre quem sentou nessa cadeira antes de você.'),
    'Eles soltam na mesma tarde, na rota mais próxima, com dois biólogos e nenhuma câmera.',
    'O Sr. Waldo acompanha a soltura e volta no fim do dia com o formulário preenchido e uma frase escrita no campo de observações que não precisava estar ali.',
    'Devolvido por vontade do detentor. Sem determinação judicial.'
  ],
  ef:{executar:d=>{
        const avisos=[];
        Estado.lendariosCapturados().forEach(L=>{
          const p=[...d.time,...d.pc].find(x=>x.dex===L.dex);
          if(p) Captura.soltar(p).forEach(e=>avisos.push({tipo:e.tipo,texto:e.texto}));
        });
        d.liga.ordemDevolucao=false; d.liga.detencao=false;
        return avisos;
      },
      rep:{eixo:'bom',delta:3,motivo:'Devolveu voluntariamente os lendários à liberdade'},
      flag:'devolveu_lendarios_liga'},
  escolhas:[{texto:'"Agora o norte."', vai:'c21_aceitou_norte'}]
},

c21_aceitou_norte:{
  texto:[
    'Eles te dão um mapa, coordenadas e uma caixa com quatro Ultra Balls e uma Master Ball.',
    fala('Conselheira Edda Thistle', 'A Master Ball é da Liga. Está registrada.', null, 'Ela deixa isso no ar um segundo.'),
    fala('Conselheira Edda Thistle', 'O que {o senhor|a senhora} fizer com ela vai ser registrado também.'),
    d=>d.flags.missao_classe_d
      ? 'E, em cima do mapa, a ordem de quatro linhas, assinada por três pessoas, dizendo que chegar e não fazer nada já cumpre a missão.'
      : 'E, em cima do mapa, nada. Nenhuma linha dizendo o que você deve fazer ao chegar.',
    'Na porta, ela diz a última coisa, e é a única frase do dia que não parece ensaiada:',
    fala('Conselheira Edda Thistle', 'Se ele falar com {o senhor|a senhora} — e ele fala — não minta. Ele sabe.', 'baixo')
  ],
  ef:{itens:{'Ultra Ball':4,'Master Ball':1,'Hyper Potion':3,'Full Heal':2},
      flag:'liga_aliada', rep:{eixo:'bom',delta:1,motivo:'Aceitou ir ao vale do norte'},
      npc:{nome:'Conselheira da Liga', opiniao:4, memoria:'Te mandou ao norte com uma Master Ball registrada.'},
      curaTime:true,
      registrar:'A Liga te equipou para o norte.'},
  escolhas:[
    {texto:'Devolver os lendários antes de subir.', vai:'c21_devolveu', cond:d=>Estado.lendariosCapturados().length>0},
    {texto:'Passar na arena para se despedir do Sr. Mervin.', vai:'c21_despedida', cond:d=>!!d.flags.conheceu_quintino},
    {texto:'Sair do Planalto.', vai:'c21_fim'}
  ]
},

c21_despedida:{
  texto:[
    'Ele está na borda, onde estava às treze e trinta e onde vai estar amanhã.',
    '"{O senhor|A senhora} vai."',
    '"Vou."',
    'Ele assente devagar, três vezes, e não olha para você nenhuma vez durante a conversa inteira.',
    '"Então eu vou te pedir uma coisa e {o senhor|a senhora} pode dizer não."',
    'Ele tira do bolso um papel dobrado, velho, amarelado nas dobras, e entrega sem olhar.',
    '"É o endereço de uma casa em Cinnabar que não existe mais, porque a rua inteira foi embora junto com o laboratório." Ele encolhe os ombros. "Eu carrego desde oitenta e um. Se {o senhor|a senhora} voltar do norte, joga fora por mim. Eu não consigo."'
  ],
  ef:{flag:['carrega_o_papel_do_quintino'], itens:{'Um papel dobrado desde 1981':1}, moral:3,
      npc:{nome:'Sr. Mervin', opiniao:5, memoria:'Te pediu para jogar fora, na volta, um papel que ele carrega desde 1981.'},
      rep:{eixo:'bom',delta:2,motivo:'Aceitou carregar o arrependimento de outra pessoa'},
      registrar:'O Sr. Mervin te deu um papel de 1981 para jogar fora na volta.'},
  escolhas:[{texto:'Sair do Planalto.', vai:'c21_fim'}]
},

c21_recusou_norte:{
  texto:[
    '"Manda outra equipe."',
    '"Já mandamos três." Ela não se irrita. "A quarta seria enviar gente sabendo que eles não voltam. Eu não faço isso."',
    '"E mandar eu, a senhora faz?"',
    '"Eu não estou te mandando. Eu estou te contando." Ela empurra o mapa pela mesa mesmo assim. "A diferença importa para mim, mesmo que não importe para {o senhor|a senhora}."',
    'O Sr. Waldo olha o mapa em cima da mesa e olha para ela, e não diz nada, e o que ele não diz fica na sala.'
  ],
  ef:{flag:'recusou_norte'},
  escolhas:[
    {texto:'Pegar o mapa.', vai:'c21_aceitou_norte'},
    {texto:'"A senhora acabou de fazer o que disse que não faz."', vai:'c21_acabou_de_fazer'},
    {texto:'Deixar o mapa na mesa e sair.', vai:'c21_fim', ef:{flag:'deixou_o_mapa'}}
  ]
},

c21_acabou_de_fazer:{
  texto:[
    '"A senhora acabou de fazer exatamente o que disse que não faz."',
    'A sala fica muito quieta.',
    'A Conselheira Thistle olha o mapa em cima da mesa, do lado de lá da linha invisível que separa contar de mandar.',
    'Ela puxa o mapa de volta.',
    '"{O senhor|A senhora} tem razão."',
    'E aí ela faz uma coisa que ninguém naquela mesa esperava: ela guarda o mapa na pasta e fecha.',
    '"Está encerrado. Se {o senhor|a senhora} quiser ir depois, {o senhor|a senhora} volta aqui e pede, e eu dou. Mas não vai sair desta sala em cima de uma mesa."'
  ],
  ef:{flag:['nao_saiu_com_o_mapa'], 
      rep:{eixo:'bom',delta:3,motivo:'Não deixou que te empurrassem um mapa pela mesa'},
      npc:{nome:'Conselheira Edda Thistle', opiniao:4, memoria:'Guardou o mapa de volta na pasta quando você apontou o que ela tinha feito.'},
      registrar:'A Conselheira guardou o mapa de volta. Você vai ter que pedir se quiser ir.'},
  escolhas:[
    {texto:'"Então eu estou pedindo."', vai:'c21_aceitou_norte'},
    {texto:'Sair sem pedir.', vai:'c21_fim', ef:{flag:'deixou_o_mapa'}}
  ]
},

c21_fim:{
  texto:[
    'Você desce do Planalto Indigo no fim da tarde.',
    d=>{
      if (d.jogador.cargo) return `Você desce como ${d.jogador.cargo}, o que é uma frase que a sua versão de {saida} anos saindo de casa não teria acreditado.`;
      if (d.flags.deixou_o_mapa) return 'Você desce sem nada nas mãos e sem nada assinado, do jeito que subiu.';
      return 'Você desce com um mapa no bolso e coordenadas de um lugar onde três equipes entraram.';
    },
    d=>d.flags.ouviu_o_nicacio
      ? (d.flags.aceitou_cargo_liga || d.flags.contrato_de_campo
         ? 'Na escada, você percebe que está olhando o papel, e lembra do eletricista, e não consegue olhar para outro lugar.'
         : 'Na escada, você percebe que está olhando a parede dos campeões, e lembra do eletricista, e ri sozinho de um jeito que assusta uma moça que sobe.')
      : 'Na escada, você cruza com gente subindo, e ninguém olha para você duas vezes.',
    d=>{
      const inst=d.mundo.instabilidade;
      if (inst>=6) return 'E o céu, no norte, tem uma cor que céu não tem.';
      if (inst>=3) return 'E o vento vira de direção duas vezes na sua descida, o que não deveria acontecer.';
      return 'E o norte é só o norte, por enquanto.';
    },
    'A Rota 10 fica a dois dias daqui.'
  ],
  fim:true, resumo:'Capítulo 21 concluído — te ofereceram tudo e você escolheu.'
}
}}

);
