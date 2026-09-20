/* ============================================================
   CAPÍTULO 21 — O QUE TE OFERECEM
   Planalto Indigo. Três folhas em cima de uma mesa comprida.
   ============================================================ */
CAPITULOS.push(
{
num:21, titulo:'O Que Te Oferecem', local:'Planalto Indigo', ambiente:'montanha', nivelArea:56,
tom:'muito sombrio', inicio:'c21_chegada',
cenas:{

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
      return 'Ninguém te reconhece. Você é só mais um com envelope na mão.';
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
    'Vinte e nove fotografias, em ordem de ano.',
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
    '"Esse a gente não comenta muito."',
    '"Por quê?"',
    '"Porque ele não veio à cerimônia, não assinou o quadro e ninguém sabe onde ele está." Ela mexe em alguma coisa na tela. "A Liga mandou carta durante quatro anos para o endereço da mãe dele. Parou de mandar."',
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
    d=>d.insignias.length
      ? `As que você tem no bolso são iguais às da última fileira. Você confere, uma por uma. São iguais mesmo.`
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
    'A recepcionista se chama Sra. Duarte e trabalha aqui há vinte e seis anos, e responde sem consultar nada.',
    '"Agentes de campo mortos em serviço."',
    'Ela diz isso do mesmo jeito que diria o horário de funcionamento.',
    '"Quarenta e um?"',
    '"Quarenta e um desde 1961." Ela ajeita uma pilha de formulários. "Onze foram em 1994, num incidente só, no norte. A placa nova ia sair no ano passado e não saiu porque não aprovaram a verba."',
    '"A placa nova?"',
    '"Tem mais quatro nomes para pôr", ela diz, e volta aos formulários.'
  ],
  ef:{flag:['sabe_dos_41','sabe_do_incidente_94'], instabilidade:1,
      npc:{nome:'Sra. Duarte', opiniao:1, memoria:'Recepcionista do Planalto há vinte e seis anos. Sabe tudo de cor.'},
      registrar:'41 agentes mortos em serviço desde 1961. Onze em 1994, num incidente no norte. Faltam quatro nomes na placa.'},
  escolhas:[
    {texto:'"Quatro de quando?"', vai:'c21_os_quatro_novos'},
    {texto:'Copiar os onze de 1994.', vai:'c21_copiou_os_onze'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_os_quatro_novos:{
  texto:[
    'A Sra. Duarte para de mexer nos formulários.',
    '"Dos últimos dois anos."',
    'Ela não diz onde. Ela olha para a escada, para cima, na direção da sala em que você tem reunião às catorze.',
    '"O senhor vai perguntar lá em cima e eles vão te contar, porque eles contam." Ela volta aos formulários. "Eu só não quero ser eu a contar."',
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
    'Você senta numa ponta de mesa com uma bandeja de arroz, feijão, um bife fino e beterraba.',
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
    'O mais velho se chama Sr. Nicácio e é eletricista do Planalto há dezenove anos.',
    '"Você é o de hoje das duas?" Ele aponta o teto com o garfo. "A sala quatro é a que a gente chama de sala das três cadeiras."',
    '"Por quê?"',
    '"Porque quando é uma cadeira é bronca, quando é duas é acordo, e quando é três é oferta." Ele come. "Três cadeiras é bom, moço. Três cadeiras eles querem alguma coisa de você."'
  ],
  ef:{flag:'sabe_das_tres_cadeiras',
      npc:{nome:'Sr. Nicácio', opiniao:1, memoria:'Eletricista do Planalto. Te explicou o que significam três cadeiras.'},
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
    '"Quatro cadeiras é quando eles não sabem o que fazer com a pessoa."',
    'Ele limpa a boca.',
    '"Eu vi quatro cadeiras uma vez em dezenove anos, e foi por causa de uma menina que apareceu aqui com um Snorlax e uma ordem judicial."',
    '"E no que deu?"',
    '"Deu que hoje ela trabalha no terceiro andar e o Snorlax dorme no pátio dos fundos, e ninguém nunca explicou direito." Ele volta a comer. "Aqui é assim. Metade das coisas nunca é explicada direito e funciona igual."'
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
    '"Eu vi todo mundo sair de lá, moço, porque a sala quatro tem uma tomada que dá defeito e eu subo lá toda semana."',
    'Ele põe o garfo na bandeja.',
    '"Tem os que saem assinando e os que saem sem assinar, e eu vou te dizer uma coisa que eu reparei em dezenove anos: dá para saber qual é pelo jeito de descer a escada."',
    '"E qual é o jeito?"',
    '"Quem assinou desce olhando o papel." Ele levanta a bandeja. "Quem não assinou desce olhando a parede dos campeões."'
  ],
  ef:{flag:'ouviu_o_nicacio', instabilidade:1,
      npc:{nome:'Sr. Nicácio', opiniao:2, memoria:'Te contou como dá para saber quem assinou pelo jeito de descer a escada.'},
      registrar:'Quem assina desce olhando o papel. Quem não assina desce olhando a parede.'},
  escolhas:[{texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}]
},

c21_o_que_acontece_em_cima:{
  texto:[
    'Você pergunta a uma moça do setor de licenças, que está comendo sozinha com um livro aberto ao lado da bandeja.',
    'Ela marca a página com o dedo antes de responder.',
    '"Em cima? Reunião, principalmente." Ela pensa. "Quarta é comitê de calendário. Quinta de manhã é homologação de ginásio. Sexta ninguém sobe."',
    '"E a Elite 4?"',
    '"A Elite 4 treina de manhã, das seis às nove, e depois vai embora." Ela volta ao livro. "Eles não moram aqui. Isso é a primeira coisa que decepciona todo mundo que chega."',
    'Ela vira uma página.',
    '"O senhor Quintino mora. Mas ele tem setenta e três anos e não tem mais para onde ir."'
  ],
  ef:{flag:'sabe_do_quintino',
      registrar:'A Elite 4 treina das seis às nove e vai embora. Só o Sr. Quintino mora no Planalto.'},
  escolhas:[
    {texto:'"Quem é o senhor Quintino?"', vai:'c21_quem_e_quintino'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'},
    {texto:'Puxar assunto com a mesa da manutenção.', vai:'c21_mesa_da_manutencao'}
  ]
},

c21_quem_e_quintino:{
  texto:[
    '"Foi campeão em setenta e nove." Ela fecha o livro no dedo. "Depois foi Elite 4 por vinte e dois anos e depois virou uma coisa que não tem cargo."',
    '"Que coisa?"',
    '"Ele senta na borda do poço e olha." Ela dá de ombros, sem deboche nenhum. "Todo desafio, todo treino, toda homologação. Há doze anos."',
    '"E ninguém acha isso estranho?"',
    '"Todo mundo acha." Ela abre o livro de novo. "E todo mundo prefere que ele esteja lá. Inclusive eu, e eu nem subo."'
  ],
  ef:{flag:'sabe_do_quintino',
      registrar:'O Sr. Quintino, campeão de 79, senta na borda do poço da arena há doze anos.'},
  escolhas:[
    {texto:'Pedir para ver a arena antes da reunião.', vai:'c21_pediu_a_arena'},
    {texto:'Subir para a reunião.', vai:'c21_esperou_na_porta'}
  ]
},

c21_pediu_a_arena:{
  texto:[
    'A Sra. Duarte olha o relógio da parede.',
    '"Treze e vinte e cinco. Dá."',
    'Ela te dá um crachá de visitante com barbante e aponta a escada de serviço.',
    'A arena da Elite 4 fica dois andares abaixo do saguão e é um poço de pedra com iluminação vinda de cima.',
    'Não tem plateia. Nunca teve. É outra coisa que os jogos não contam.',
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
    '"O senhor é o das duas horas."',
    '"Sou."',
    '"Então o senhor tem trinta minutos e uma escada." Ele continua olhando o poço. "Pergunta o que quiser. Eu tenho doze anos de tempo livre."'
  ],
  ef:{flag:'conheceu_quintino',
      npc:{nome:'Sr. Quintino', opiniao:1, memoria:'Campeão de 79. Senta na borda do poço há doze anos.'},
      registrar:'Conheceu o Sr. Quintino na borda da arena.'},
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
    '"Porque quando eu subi aqui em setenta e nove não tinha ninguém sentado na borda."',
    'Ele balança os pés dentro do poço.',
    '"Eu ganhei, desceram para me cumprimentar, tiraram a foto, e aí todo mundo foi embora e eu fiquei sozinho no poço com o meu time e eu não sabia o que fazer com as mãos."',
    '"E aí o senhor decidiu sentar aqui."',
    '"Doze anos depois de me aposentar, sim." Ele ri baixinho. "Eu demorei trinta anos para entender o que tinha faltado. Faltou alguém sentado na borda."'
  ],
  ef:{instabilidade:0, moral:2,
      npc:{nome:'Sr. Quintino', opiniao:2, memoria:'Senta na borda porque em 79 não tinha ninguém sentado na borda para ele.'},
      registrar:'O Sr. Quintino senta na borda porque ninguém sentou na borda por ele.'},
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
    '"Eu não podia saber e eu não fui." Ele encolhe os ombros devagar. "As duas coisas são verdade e uma não desmancha a outra. O senhor vai aprender isso hoje, se ainda não aprendeu."'
  ],
  ef:{instabilidade:1, moral:-2,
      npc:{nome:'Sr. Quintino', opiniao:3, memoria:'Recusou a terceira oferta em 1981 e nunca se perdoou.'},
      registrar:'O Sr. Quintino recusou a terceira oferta em 1981. Era sobre Cinnabar.'},
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
    '"Elite 4 por vinte e dois anos, que é o mesmo trabalho todo dia." Ele coça o joelho. "O senhor está me perguntando a coisa errada. Me pergunta o que valeu."',
    'Você pergunta o que valeu.',
    '"O caminho até aqui." Ele aponta o poço vazio com o queixo. "Isso aqui é a parte que acaba. O caminho é a parte que fica."'
  ],
  ef:{moral:3,
      npc:{nome:'Sr. Quintino', opiniao:3, memoria:'Te disse que o título vale quatro meses e o caminho fica.'},
      rep:{eixo:'bom',delta:1,motivo:'Sentou na borda do poço e ouviu um velho'},
      registrar:'O Sr. Quintino: ser campeão valeu quatro meses. O caminho é que fica.'},
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
    '"E se o senhor está perguntando isso hoje, às treze e quarenta, quer dizer que eles vão te contar da quarta equipe lá em cima."'
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
    '"Em noventa e quatro foram onze e não voltou ninguém. Depois disso a Liga não mandou mais ninguém para lá por vinte e dois anos."',
    '"E agora?"',
    '"Agora mandaram três equipes em dois anos, e por isso é que faltam quatro nomes na placa lá de cima."',
    'Ele bate na pedra do lado dele, duas vezes, com a palma.',
    '"E agora vão te oferecer a quarta, e o senhor vai ser uma pessoa só, e isso na cabeça deles é melhor, porque uma pessoa que some é uma pessoa e não uma equipe."'
  ],
  ef:{flag:['sabe_das_tres_equipes','sabe_dos_quatro_novos'], instabilidade:1, moral:-2,
      npc:{nome:'Sr. Quintino', opiniao:3, memoria:'Te avisou do que iam te oferecer antes de subirem.'},
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
    'Você fica no meio, sozinho, com o Sr. Quintino sentado na borda, e ninguém mais no prédio inteiro sabe que você está aqui.',
    'E, por quatro ou cinco segundos, você é uma criança de novo, saindo de casa, achando que isto aqui era o ponto de chegada.'
  ],
  ef:{flag:'pisou_na_arena', moral:3,
      rep:{eixo:'bom',delta:1,motivo:'Desceu ao poço sozinho, sem ninguém para ver'},
      registrar:'Pisou no chão da arena da Elite 4 sozinho, antes da reunião.'},
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
    '"Como o senhor preferir."',
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
    '"Justo." Ela fecha a pasta antes de começar.',
    '"Conselheira Nélida Vasques, diretoria de operações. Eu tomo a decisão de hoje."',
    'O homem mais velho, da direita: "Aguiar. Fiscalização. Eu assino o que ela decide e eu discordo por escrito quando discordo."',
    'A terceira é uma mulher de uns trinta anos, com um caderno em vez de pasta, que demora um segundo a mais.',
    '"Bruna Teles. Eu sou do setor de campo." Ela não explica mais que isso. "Eu estava na segunda equipe."',
    'Ninguém comenta essa última frase. Ela fica na mesa, no meio de todo mundo, por um tempo.'
  ],
  ef:{flag:['conheceu_os_tres','conheceu_a_bruna'],
      npc:{nome:'Conselheira Nélida Vasques', opiniao:0, memoria:'Diretoria de operações. Toma a decisão.'},
      registrar:'A mesa: Conselheira Vasques (operações), Sr. Aguiar (fiscalização) e Bruna Teles, que voltou da segunda equipe.'},
  escolhas:[
    {texto:'"A senhora voltou do norte."', vai:'c21_bruna_voltou'},
    {texto:'Sentar e deixar ela começar.', vai:'c21_pasta'},
    {texto:'"E por que fiscalização está aqui?"', vai:'c21_porque_fiscalizacao'}
  ]
},

c21_bruna_voltou:{
  texto:[
    '"A senhora voltou do norte."',
    '"Voltei."',
    'A Conselheira Vasques abre a boca e o Sr. Aguiar levanta a mão dois centímetros da mesa, e ela não fala.',
    '"Eu voltei com cinco pessoas de seis", diz a Bruna Teles. "E eu vou te contar o que aconteceu na hora certa, que é depois, porque se eu contar agora o senhor vai decidir com o estômago."',
    'Ela abre o caderno dela numa página em branco.',
    '"Eu decidi com o estômago em março e eu perdi uma pessoa."'
  ],
  ef:{flag:'bruna_vai_contar', instabilidade:1,
      npc:{nome:'Bruna Teles', opiniao:1, memoria:'Voltou do norte com cinco de seis e vai te contar na hora certa.'},
      registrar:'Bruna Teles voltou do norte com cinco de seis pessoas.'},
  escolhas:[
    {texto:'Sentar.', vai:'c21_pasta'},
    {texto:'"E por que fiscalização está aqui?"', vai:'c21_porque_fiscalizacao'}
  ]
},

c21_porque_fiscalizacao:{
  texto:[
    'O Sr. Aguiar responde sem esperar a Conselheira.',
    '"Porque tudo o que for oferecido ao senhor hoje tem efeito jurídico e alguém tem que responder por isso depois."',
    'Ele abre a pasta sanfonada e mostra, sem entregar, uma folha datilografada com seis linhas riscadas a caneta.',
    '"Isto é a minha discordância por escrito sobre a terceira oferta. Eu protocolei na sexta-feira."',
    '"E mesmo assim vão me oferecer."',
    '"E mesmo assim vão te oferecer." Ele fecha a pasta. "Porque eu discordo e não mando, e é assim que tem que ser, e é assim que é ruim."'
  ],
  ef:{flag:['aguiar_discorda'], instabilidade:1,
      npc:{nome:'Sr. Aguiar', opiniao:2, memoria:'Protocolou discordância por escrito contra a terceira oferta.'},
      registrar:'O Sr. Aguiar, da fiscalização, protocolou discordância contra a terceira oferta.'},
  escolhas:[
    {texto:'Sentar.', vai:'c21_pasta'},
    {texto:'"O que está escrito na sua discordância?"', vai:'c21_leu_a_discordancia'}
  ]
},

c21_leu_a_discordancia:{
  texto:[
    'Ele olha a Conselheira Vasques. Ela assente.',
    'Ele entrega a folha.',
    'Considerando que três missões foram enviadas à área e que quatro agentes não retornaram; considerando que não há protocolo de extração aplicável; considerando que o objetivo da missão não é definido em termos operacionais mensuráveis;',
    'manifesto-me contrariamente ao envio de pessoal, remunerado ou voluntário, servidor ou terceiro, à área, até que se estabeleça o que se pretende que a pessoa enviada faça ao chegar.',
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
    'A Conselheira Vasques abre a pasta e não lê — ela já leu.',
    d=>{
      const d2=Estado.dados;
      const linhas=[];
      if (d2.insignias.length) linhas.push(`${d2.insignias.length} insígnia(s)`);
      if (d2.cemiterio.length) linhas.push(`${d2.cemiterio.length} morte(s) registrada(s) sob sua responsabilidade`);
      const presos = Estado.lendariosCapturados();
      if (presos.length) linhas.push(`${presos.length} lendário(s) em sua posse`);
      if (d2.liga.avisos) linhas.push(`${d2.liga.avisos} ocorrência(s) no nosso sistema`);
      return linhas.length ? `"Vamos ao que consta: ${linhas.join(', ')}."` : '"Consta muito pouco aqui. Isso é raro em alguém que andou tanto."';
    },
    d=>{
      const via = Historia.via();
      if (via==='foragido') return '"E consta que existe uma operação de distribuição em Celadon que mudou de dono recentemente." Ela fecha a pasta. "Nós não temos prova. Nós temos certeza. As duas coisas são diferentes e só uma delas serve para processo."';
      if (via==='mercenario') return '"E consta que o seu nome aparece em três manifestos de carga que não deviam existir." Ela fecha a pasta. "Nós não vamos usar isso hoje."';
      if (via==='pesquisador') return '"E consta que metade do material que a Dra. Sarmento protocolou nos últimos meses passou pelas suas mãos primeiro." Ela fecha a pasta. "Isso é útil. Útil é uma palavra perigosa aqui."';
      if (via==='heroi') return '"E consta uma lista de lugares em que o senhor apareceu logo antes de alguma coisa parar de funcionar." Ela fecha a pasta. "Sempre coisas que a gente queria que parassem de funcionar, e sempre sem mandado."';
      return '"E consta que o senhor foi a muito lugar e não pediu nada a ninguém." Ela fecha a pasta.';
    },
    '"Eu vou fazer três perguntas. Não são pegadinha."'
  ],
  escolhas:[
    {texto:'"Pode perguntar."', vai:'c21_pergunta1'},
    {texto:'"Antes: eu quero ler a minha pasta."', vai:'c21_leu_a_propria_pasta'},
    {texto:'"Quem escreveu essa pasta?"', vai:'c21_quem_escreveu'}
  ]
},

c21_leu_a_propria_pasta:{
  texto:[
    '"Eu quero ler a minha pasta."',
    'O Sr. Aguiar responde antes da Conselheira, e responde com a rapidez de quem esperava a pergunta.',
    '"Pode." Ele empurra a pasta pela mesa. "O senhor é o titular do dado. Está na norma interna 14 e ninguém nunca pediu."',
    'São vinte e duas páginas.',
    'Relatórios de agentes de campo, recortes de jornal, um formulário de ocorrência de Pewter com a sua letra de quando você tinha quinze anos, e uma folha com uma linha do tempo dos seus últimos dois anos, com lacunas marcadas a lápis.',
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
    '"O que são as lacunas?"',
    '"São os períodos em que a gente perdeu o senhor." A Conselheira Vasques responde sem constrangimento. "Quatro lacunas. A maior tem dezenove dias."',
    'Dezenove dias é exatamente o tempo que você levou entre uma coisa e outra que você preferiria que não estivesse escrita em lugar nenhum.',
    '"E vocês tentaram preencher?"',
    '"Tentamos e não conseguimos, e o Sr. Aguiar determinou que ficasse a lápis e em branco em vez de ficar suposição a caneta." Ela olha para ele. "Isso, aqui dentro, é uma briga de dois anos que ele ganhou."'
  ],
  ef:{npc:{nome:'Sr. Aguiar', opiniao:2, memoria:'Brigou dois anos para que suposição não virasse registro.'},
      registrar:'A Liga tem quatro lacunas sobre você, marcadas a lápis, porque o Sr. Aguiar não deixou virar caneta.'},
  escolhas:[
    {texto:'"Quem escreveu isso?"', vai:'c21_quem_escreveu'},
    {texto:'Devolver a pasta.', vai:'c21_pergunta1'}
  ]
},

c21_quem_escreveu:{
  texto:[
    '"Quem escreveu essa pasta?"',
    '"Onze pessoas diferentes." A Conselheira folheia o rodapé das páginas, onde tem matrícula e data. "Agente de campo, agente de campo, delegacia de Pewter, delegacia de Cerulean, uma professora de Pallet."',
    '"Uma professora de Pallet?"',
    'Ela vira a página e lê: "manifestação espontânea de terceiro. Ela escreveu para a Liga por conta própria, há dois anos, dizendo que o senhor tinha saído de casa e pedindo que se alguém do serviço te encontrasse, avisasse a ela que estava tudo bem."',
    'A Conselheira Vasques levanta os olhos.',
    '"A carta está anexada e nunca foi respondida. Isso é falha nossa e eu vou responder esta semana."'
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
    'Prezados senhores. Não sei se é aqui que se escreve isto. Um aluno meu saiu de casa e não é fugido, ele avisou, e a mãe sabe.',
    'Eu só queria pedir que se alguém do serviço dos senhores encontrar ele por aí, diga para ele que não precisa voltar com nada. Ele acha que precisa voltar com alguma coisa.',
    'Atenciosamente.',
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
    'O Sr. Aguiar faz a cópia ele mesmo, numa máquina do corredor, e volta com a folha ainda quente e uma segunda folha.',
    '"A segunda é o protocolo de recebimento, com data e carimbo." Ele entrega as duas. "Se um dia o senhor quiser provar que ela escreveu, a que vale é essa."',
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
    '"Eu respondo. Me dá o endereço."',
    'A Conselheira Vasques escreve o endereço num papel timbrado e entrega.',
    'É o endereço da escola, que você sabe de cor, e o número da sala, que você também sabe de cor.',
    '"O senhor vai responder o quê?", pergunta a Bruna Teles, do outro lado da mesa, e é a primeira coisa que ela diz desde que sentou.',
    'Você fica um tempo sem responder.',
    '"Eu ainda não sei."',
    '"Boa resposta", ela diz, e escreve alguma coisa no caderno dela.'
  ],
  ef:{flag:['vai_responder_a_professora'], moral:3,
      rep:{eixo:'bom',delta:1,motivo:'Decidiu responder a carta'},
      registrar:'Pegou o endereço da escola para responder a carta.'},
  escolhas:[{texto:'Ouvir as perguntas.', vai:'c21_pergunta1'}]
},

c21_pergunta1:{
  texto:[
    '"Primeira: por que o senhor saiu de casa?"',
    'A pergunta é feita sem nenhuma ironia e sem nenhum interesse aparente, do jeito que se pergunta a profissão de alguém num formulário.',
    'E é por isso que ela pega.'
  ],
  escolhas:[
    {texto:d=>`"${d.jogador.objetivo}"`, vai:'c21_p1_objetivo', ef:{flag:'respondeu_objetivo'}},
    {texto:'"Eu já não lembro mais."', vai:'c21_p1_esqueceu',
     ef:{flag:'esqueceu_objetivo', rep:{eixo:'bom',delta:1,motivo:'Foi honesto sobre ter perdido o rumo'}}},
    {texto:'"Não é da sua conta."', vai:'c21_p1_recusou', ef:{flag:'recusou_pergunta1'}},
    {texto:'"Pelo mesmo motivo que todo mundo: porque ficar era pior."', vai:'c21_p1_ficar_era_pior'}
  ]
},

c21_p1_objetivo:{
  texto:[
    'Você responde com a frase que você diz desde os quinze anos, do jeito que você diz.',
    'A Conselheira Vasques anota duas palavras. Duas.',
    'A Bruna Teles anota bem mais que duas.',
    '"E o senhor conseguiu?", pergunta a Bruna.',
    d=>{
      if (d.insignias.length >= 6) return 'Você olha as insígnias no bolso e a resposta não vem, porque a pergunta não é sobre insígnia e vocês dois sabem disso.';
      if (d.cemiterio.length) return 'Você pensa em quem não voltou e a resposta não vem.';
      return 'Você abre a boca e a resposta não vem.';
    },
    '"Anotado", ela diz, e não insiste.'
  ],
  escolhas:[{texto:'Segunda pergunta.', vai:'c21_pergunta2'}]
},

c21_p1_esqueceu:{
  texto:[
    '"Eu já não lembro mais."',
    'A Conselheira Vasques levanta os olhos.',
    '"O senhor lembra e não quer dizer, ou o senhor esqueceu mesmo?"',
    '"Eu esqueci mesmo."',
    'Ela anota, e o Sr. Aguiar anota também, e é a primeira vez que ele anota alguma coisa.',
    '"Isso acontece com todo mundo que faz mais de dezoito meses de campo", diz ele, sem levantar a cabeça. "Está na literatura e ninguém aqui lê a literatura."'
  ],
  ef:{instabilidade:1, moral:-2,
      registrar:'Você já não lembra por que saiu de casa.'},
  escolhas:[{texto:'Segunda pergunta.', vai:'c21_pergunta2'}]
},

c21_p1_recusou:{
  texto:[
    '"Não é da sua conta."',
    '"Certo." Ela escreve recusou a responder e fecha a caneta. "Não é mesmo."',
    'E segue, sem nenhum ressentimento, o que de alguma maneira é pior.',
    'A Bruna Teles, do outro lado, escreve muito mais do que quatro palavras.'
  ],
  escolhas:[{texto:'Segunda pergunta.', vai:'c21_pergunta2'}]
},

c21_p1_ficar_era_pior:{
  texto:[
    '"Pelo mesmo motivo que todo mundo: porque ficar era pior."',
    'A Bruna Teles para de escrever.',
    '"Essa é a minha resposta também", ela diz, para a mesa e não para você. "Eu saí de Fuchsia com dezoito anos com essa frase na boca."',
    'A Conselheira Vasques anota sem comentar.',
    'O Sr. Aguiar diz, do lado, para ninguém em particular: "e a minha, e eu tenho sessenta e dois."'
  ],
  ef:{flag:'ficar_era_pior', moral:1,
      npc:{nome:'Bruna Teles', opiniao:2, memoria:'Deu a mesma resposta que você à primeira pergunta.'},
      registrar:'Os três da mesa saíram de casa pelo mesmo motivo que você.'},
  escolhas:[{texto:'Segunda pergunta.', vai:'c21_pergunta2'}]
},

c21_pergunta2:{
  texto:[
    '"Segunda: de tudo que o senhor fez, o que refaria diferente?"',
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
    'Leva quatro minutos e em nenhum momento alguém interrompe, e o pior é que você ouve a própria voz dizendo em voz alta coisas que você só tinha dito para si mesmo em barraca, no escuro.',
    'Quando termina, a sala fica quieta.',
    'O Sr. Aguiar é quem fala.',
    '"Isso que o senhor acabou de contar não está na pasta." Ele bate na pasta sanfonada com dois dedos. "E eu não vou pôr."',
    '"Por quê?"',
    '"Porque o senhor contou por vontade e a gente não achou. E se a gente passar a registrar o que as pessoas contam por vontade, elas param de contar."'
  ],
  ef:{instabilidade:1, moral:4,
      npc:{nome:'Sr. Aguiar', opiniao:3, memoria:'Decidiu não registrar o que você contou por vontade própria.'},
      registrar:'Contou à Liga o que refaria. O Sr. Aguiar decidiu não registrar.'},
  escolhas:[{texto:'Terceira pergunta.', vai:'c21_pergunta3'}]
},

c21_p2_nada:{
  texto:[
    '"Nada."',
    'A Conselheira Vasques anota.',
    'A Bruna Teles levanta os olhos e olha para você por uns três segundos, e depois volta ao caderno.',
    '"Eu vou te dizer uma coisa que não é da entrevista", ela diz. "Eu também respondi nada em março, e eu perdi uma pessoa em abril."',
    'Ela vira a página.',
    '"Não tem relação de causa. Eu só não gosto de ouvir essa resposta."'
  ],
  ef:{instabilidade:1, moral:-2,
      npc:{nome:'Bruna Teles', opiniao:0, memoria:'Não gosta de ouvir nada como resposta.'},
      registrar:'Disse à Liga que não refaria nada.'},
  escolhas:[{texto:'Terceira pergunta.', vai:'c21_pergunta3'}]
},

c21_p2_mais_cedo:{
  texto:[
    '"Eu teria feito mais cedo."',
    '"Feito o quê mais cedo?", pergunta a Conselheira, e é a primeira vez que ela faz uma pergunta de acompanhamento.',
    'Você explica.',
    'Ela anota, e depois faz uma coisa que ninguém faz numa entrevista: ela lê em voz alta o que anotou, para conferir.',
    '"Está certo?"',
    '"Está."',
    '"Bom." Ela vira a página. "Eu leio em voz alta porque metade dos erros deste prédio é anotação mal feita."'
  ],
  escolhas:[{texto:'Terceira pergunta.', vai:'c21_pergunta3'}]
},

c21_p2_perguntado:{
  texto:[
    '"Eu teria perguntado mais e feito menos."',
    'O Sr. Aguiar solta um som curto pelo nariz que, num homem daquele tamanho, é o equivalente a uma gargalhada.',
    '"Escreve isso inteiro", ele diz para a Conselheira. "Palavra por palavra."',
    'Ela escreve.',
    '"O senhor acabou de resumir o relatório que eu protocolei na sexta em uma linha, e eu levei seis páginas."'
  ],
  ef:{flag:'perguntar_mais_fazer_menos', 
      npc:{nome:'Sr. Aguiar', opiniao:3, memoria:'Mandou anotar a sua resposta palavra por palavra.'},
      rep:{eixo:'bom',delta:2,motivo:'Disse em uma linha o que a fiscalização levou seis páginas para dizer'},
      registrar:'Perguntar mais e fazer menos.'},
  escolhas:[{texto:'Terceira pergunta.', vai:'c21_pergunta3'}]
},

c21_pergunta3:{
  texto:[
    '"Terceira." Ela junta as mãos. "Existe alguma coisa em Kanto que só o senhor pode resolver?"',
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
    '"Tem uma coisa no norte."',
    'Os três param ao mesmo tempo, e é a primeira reação sincronizada da reunião inteira.',
    '"Como o senhor sabe do norte?", pergunta a Conselheira Vasques.',
    d=>{
      if (d.flags.sabe_do_94 || d.flags.sabe_das_tres_equipes) return 'Você conta do Sr. Quintino e da borda do poço. A Conselheira fecha os olhos por um segundo. O Sr. Aguiar sorri com metade da boca.';
      if (d.flags.viu_a_placa) return 'Você conta da placa de bronze atrás da escada, dos quarenta e um nomes e dos onze de dezoito de agosto. Ninguém responde nada por uns bons quatro segundos.';
      return 'Você não sabe explicar direito como sabe. Você só sabe.';
    },
    '"Certo." A Conselheira Vasques fecha a pasta. "Então a gente pula a parte de te convencer."'
  ],
  ef:{flag:'sabe_do_norte_antes'},
  escolhas:[{texto:'Ouvir as ofertas.', vai:'c21_ofertas'}]
},

c21_p3_modestia:{
  texto:[
    '"Não. Ninguém é insubstituível."',
    '"Correto." Ela anota. "E é por isso que a gente mandou três equipes."',
    'Ela fecha a caneta.',
    '"E das três equipes, uma não voltou inteira e duas não conseguem descrever o que viram."',
    'Ela olha para você.',
    '"O senhor tem razão em tese e está errado em prática, e a diferença entre as duas coisas custou quatro nomes que ainda não estão na placa."'
  ],
  escolhas:[{texto:'Ouvir as ofertas.', vai:'c21_ofertas'}]
},

c21_p3_arrogancia:{
  texto:[
    '"Tem. Eu."',
    'O Sr. Aguiar escreve uma linha na pasta dele e a linha é curta.',
    'A Conselheira Vasques não reage.',
    'A Bruna Teles, essa sim, fecha o caderno.',
    '"O cara que eu perdi em abril disse essa frase na sexta anterior", ela diz. "Não estou dizendo que tem relação. Estou dizendo que eu ouvi."',
    'E aí ela abre o caderno de novo e volta a escrever, e ninguém comenta.'
  ],
  ef:{instabilidade:1, moral:-2,
      npc:{nome:'Bruna Teles', opiniao:-1, memoria:'Já ouviu essa frase de alguém que não voltou.'},
      registrar:'Disse à Liga que só você pode resolver.'},
  escolhas:[{texto:'Ouvir as ofertas.', vai:'c21_ofertas'}]
},

c21_p3_por_isso:{
  texto:[
    '"Não. E é exatamente por isso que vocês vão me mandar."',
    'A sala fica muito quieta.',
    '"Continua", diz a Conselheira Vasques.',
    '"Vocês mandaram três equipes e perderam quatro pessoas. Mandar mais uma equipe é caro e aparece. Mandar uma pessoa de fora, que não é servidor, não custa vaga, não custa pensão e não entra na estatística."',
    'O Sr. Aguiar põe a caneta na mesa e não escreve mais nada.',
    '"Está na minha discordância", ele diz. "Item quatro."',
    'A Conselheira Vasques leva um tempo comprido antes de responder, e quando responde, responde a verdade.',
    '"Está certo. E mesmo assim eu vou te oferecer."'
  ],
  ef:{flag:['entendeu_a_oferta'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Disse em voz alta por que estavam te escolhendo'},
      npc:{nome:'Sr. Aguiar', opiniao:3, memoria:'Você chegou sozinho ao item quatro da discordância dele.'},
      registrar:'Uma pessoa de fora não custa vaga, não custa pensão e não entra na estatística.'},
  escolhas:[{texto:'Ouvir as ofertas.', vai:'c21_ofertas'}]
},

/* ── As ofertas ─────────────────────────────────────────── */
c21_ofertas:{
  texto:[
    'Eles se olham. A conversa entre os três acontece sem palavra nenhuma e dura quatro segundos.',
    '"Certo." A Conselheira Vasques desliza duas folhas pela mesa e deixa a mão apoiada numa terceira, que não desliza. "Todas são reais. Nenhuma expira hoje."',
    d=>{
      const via=Historia.via(); const rep=Estado.rep;
      if (rep.eixo==='bom' && rep.bom>=6) return '"A primeira é uma cadeira na Elite 4. A segunda é a diretoria de fiscalização da Liga, quando o Sr. Aguiar se aposentar em dois anos."';
      if (rep.eixo==='ruim' && rep.ruim>=5) return '"A primeira é um acordo: o senhor para, a gente arquiva. A segunda é trabalhar para nós fazendo o que o senhor já faz, só que com cobertura."';
      if (via==='pesquisador') return '"A primeira é um cargo de pesquisa com verba própria. A segunda é testemunhar no processo que a Dra. Sarmento está montando, com proteção."';
      return '"A primeira é um cargo de instrutor aqui no Planalto. A segunda é um contrato de campo."';
    },
    'Ela tira a mão da terceira folha e a terceira folha continua onde estava, de cabeça para baixo.',
    '"E a terceira é o norte. Essa não se assina."'
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
    'Ninguém reclama. O Sr. Aguiar, inclusive, empurra a garrafa de água para o seu lado da mesa no sexto minuto.',
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
    '"Quanto foi a indenização prevista das quatro pessoas que não voltaram?"',
    'O Sr. Aguiar responde, porque é a área dele, e responde com o número exato e a base de cálculo.',
    'Depois acrescenta, sem que ninguém pergunte:',
    '"Duas famílias receberam em sessenta dias. Uma recebeu em sete meses porque faltou uma certidão. A quarta não recebeu porque a pessoa era prestadora de serviço e não servidora, e prestador não gera pensão."',
    'Ele fecha a pasta sanfonada.',
    '"E é exatamente esse contrato que está na mesa do senhor agora, na folha da direita."'
  ],
  ef:{flag:['sabe_da_indenizacao'], instabilidade:1, moral:-2,
      rep:{eixo:'bom',delta:1,motivo:'Perguntou pelas famílias antes de perguntar pelo salário'},
      npc:{nome:'Sr. Aguiar', opiniao:4, memoria:'Te disse, sem ser perguntado, que a quarta família não recebeu nada.'},
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
    'A Conselheira Vasques olha o Sr. Aguiar. O Sr. Aguiar olha o teto por uns dois segundos, fazendo uma conta.',
    '"Dá." Ele volta a olhar a mesa. "Contratação como servidor temporário, prazo determinado, com regime próprio. Leva dezessete dias e passa por três assinaturas, e uma delas é do presidente da Liga."',
    '"E por que não foi feito nas outras quatro vezes?"',
    '"Porque ninguém pediu." Ele abre a pasta e começa a escrever. "E porque eu não propus, e isso é meu, e eu vou propor agora."'
  ],
  ef:{flag:['mudou_o_contrato'],
      rep:{eixo:'bom',delta:3,motivo:'Fez a Liga mudar o vínculo antes de aceitar qualquer coisa'},
      npc:{nome:'Sr. Aguiar', opiniao:5, memoria:'Vai propor contratação com regime próprio por sua causa.'},
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
    '"Quem teve esse cargo antes de mim?"',
    'A Conselheira Vasques consulta uma folha.',
    '"Instrutor: quatro pessoas em dez anos. Três pediram transferência e uma continua."',
    '"Por que as três pediram transferência?"',
    '"Porque o instrutor treina quem vai para o campo", ela responde sem amaciar. "E quem treina conhece, e quem conhece fica mal quando a pessoa não volta."',
    'Ela vira a folha.',
    '"A que continua é a mais antiga. Ela treinou nove dos onze de 1994."'
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
    'Ela se chama Sra. Iracy Bastos, tem sessenta e sete anos, e recebe você na sala de treino do segundo andar, que é um ginásio comum com colchonete e espelho.',
    'Ela está enrolando uma corda quando você entra e continua enrolando enquanto fala.',
    '"Nove dos onze." Ela diz isso antes de você perguntar. "Eu sei que é essa a pergunta, porque é sempre essa."',
    '"E a senhora continua treinando."',
    '"Eu continuo treinando." Ela pendura a corda. "Porque os dois que eu não treinei também não voltaram, e eu passei quatro anos achando que isso significava alguma coisa, e não significa nada."',
    'Ela se vira para você.',
    '"Agora o senhor vai me perguntar o que eu ensino, e eu vou responder, e é uma coisa só."'
  ],
  ef:{flag:'conheceu_iracy',
      npc:{nome:'Sra. Iracy Bastos', opiniao:1, memoria:'Instrutora do Planalto há mais de vinte anos. Treinou nove dos onze.'},
      registrar:'Sra. Iracy Bastos, instrutora, treinou nove dos onze de 1994.'},
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
    '"Com três coisas, e eu vou te dar de graça porque o senhor não é meu aluno e eu não tenho ninguém para dar." Ela levanta um dedo. "Um: marque a hora de sair. Não o horário, a hora. Escrito. Se passar, volta, mesmo sem ter feito nada."',
    'Dois dedos. "Dois: nunca desça uma coisa que o senhor não sabe subir."',
    'Três. "Três: se der vontade de ficar mais cinco minutos, é a hora de ir embora. Sempre. Sem exceção. Essa é a que mata."'
  ],
  ef:{flag:['aprendeu_a_voltar'], moral:3,
      rep:{eixo:'bom',delta:2,motivo:'Aprendeu as três regras de voltar'},
      npc:{nome:'Sra. Iracy Bastos', opiniao:3, memoria:'Te deu as três regras de graça.'},
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
    '"Eu não estou te dando conselho. Eu estou te dizendo o que eu carrego. O senhor decide o que faz com isso."'
  ],
  ef:{instabilidade:1, moral:-1,
      npc:{nome:'Sra. Iracy Bastos', opiniao:3, memoria:'Treinou 41 anos de gente para ir e nunca foi.'},
      registrar:'A Sra. Bastos treinou quarenta e um anos de gente para ir e nunca foi.'},
  escolhas:[{texto:'Voltar para a sala.', vai:'c21_ofertas'}]
},

c21_cargo:{
  texto:[
    'Você assina.',
    'O cargo vem com sala, salário, crachá e uma frase que a Conselheira Vasques diz na saída, sem maldade nenhuma:',
    '"O senhor vai descobrir em uns seis meses que um cargo aqui dentro resolve menos do que o senhor resolvia sozinho lá fora."',
    '"Por que a senhora está me contratando, então?"',
    '"Porque o que o senhor resolvia sozinho lá fora não escalava, e o que a gente faz aqui dentro escala mal, e ninguém achou nada melhor que isso ainda."'
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
    '"O meu primeiro ato é reabrir o caso de mil novecentos e noventa e quatro."',
    'O Sr. Aguiar levanta a cabeça devagar.',
    '"O senhor tem competência para isso a partir de amanhã, e o processo está no arquivo morto do subsolo, caixa vinte e dois." Ele fala isso decorado. "Eu sei porque eu subi ele quatro vezes em vinte e dois anos e ele desceu quatro vezes."',
    '"Por quê?"',
    '"Porque reabrir custa uma equipe de campo por seis meses, e toda vez que eu pedi, a equipe estava em outro lugar."',
    'Ele olha a Conselheira Vasques, e ela assente uma vez.',
    '"Agora não está", diz ela.'
  ],
  ef:{flag:['reabriu_o_94'], 
      rep:{eixo:'bom',delta:3,motivo:'Usou o primeiro dia de cargo para reabrir um caso de vinte e dois anos'},
      npc:{nome:'Sr. Aguiar', opiniao:5, memoria:'Viu o caso de 94 ser reaberto depois de quatro tentativas dele.'},
      registrar:'O caso de 18 de agosto de 1994 foi reaberto.'},
  escolhas:[{texto:'"E o norte?"', vai:'c21_norte_conversa'}]
},

c21_contrato:{
  texto:[
    'Você assina o contrato de campo.',
    'Ele te dá cobertura jurídica, acesso a informação da Liga e nenhuma autoridade formal.',
    '"É o pior dos dois mundos", ela admite, deslizando a cópia para você. "O senhor continua fazendo tudo sozinho, só que agora com processo interno se fizer errado."',
    '"E por que alguém assinaria isso?"',
    '"Porque assinou." Ela guarda a via dela.',
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
    {texto:'"Eu quero a Bruna Teles comigo."', vai:'c21_pediu_a_bruna'}
  ]
},

c21_pediu_a_bruna:{
  texto:[
    '"Eu quero a Bruna Teles comigo."',
    'Ela fecha o caderno antes de qualquer um responder.',
    '"Não."',
    'É ela quem responde, e é definitivo, e ela olha para você quando diz.',
    '"Eu voltei em março e eu ainda acordo às quatro e vinte todo dia, que é a hora em que eu percebi que a gente era cinco." Ela abre o caderno de novo. "Se eu subir de novo, eu não volto. Eu sei isso do jeito que se sabe o próprio nome."',
    'Uma pausa.',
    '"Mas eu vou te contar tudo. Cada passo. E isso vale mais do que eu ir."'
  ],
  ef:{flag:['bruna_vai_contar'],
      npc:{nome:'Bruna Teles', opiniao:3, memoria:'Recusou subir de novo e prometeu te contar cada passo.'},
      registrar:'Bruna Teles não vai voltar ao norte, mas vai te contar tudo.'},
  escolhas:[{texto:'"Então me conta."', vai:'c21_norte_conversa'}]
},

/* ── A Elite 4 ──────────────────────────────────────────── */
c21_desafio_elite:{
  texto:[
    '"Eu não vim para ser contratado."',
    'A Conselheira Vasques ri — a primeira reação humana da reunião inteira. "Ótimo. Também tem isso."',
    'A arena da Elite 4 fica dois andares abaixo e é um poço de pedra com iluminação vinda de cima.',
    'Não tem plateia. Nunca teve. É outra coisa que os jogos não contam.',
    d=>d.flags.conheceu_quintino
      ? 'E, na borda, com as pernas para dentro, o Sr. Quintino continua sentado, exatamente onde estava às treze e trinta.'
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
    'A Conselheira Vasques lista sem consultar nada.',
    '"Três das quatro cadeiras estão com substituto desde agosto." Ela diz isso sem baixar a voz e sem desculpa nenhuma. "Os titulares estão vivos, estão em casa, e não vêm. A Liga não tirou o nome das portas e eu fui voto vencido nisso também."',
    'Na cadeira da Agatha senta um homem de cinquenta e um anos que entra na sala com refletor e música de palco, e que foi vice-campeão da Conferência Indigo antes de virar isso.',
    'Na cadeira da Lorelei senta uma moça de vinte e poucos que não treina tipo nenhum e sim a ficha do desafiante — a mais nova a sentar numa cadeira da Elite em quarenta anos, e a cadeira não é dela.',
    'Na cadeira do Bruno senta um homem que ganhou noventa e oito batalhas seguidas antes dos dezesseis anos, largou tudo aos trinta e três, foi da terceira equipe que subiu ao norte, e voltou, e desde então não fala sobre isso com ninguém.',
    'E a quarta é o Lance, que é o dono da própria placa, tem trinta e sete anos e nunca perdeu aqui dentro.',
    '"E antes que o senhor pergunte: sim, os quatro sabem que o senhor vem. E sim, os quatro leram a sua pasta."'
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
    'Ele está no vestiário da arena, sentado num banco de madeira, com as bolas alinhadas na frente dele em cima de uma toalha.',
    'Tem uns quarenta anos e mãos grandes, e não se levanta quando você entra.',
    '"Eu sei quem é o senhor."',
    '"E o senhor esteve lá."',
    'Ele pega uma das bolas e gira devagar entre os dedos.',
    '"Eu estive lá, eu voltei, e eu não falo sobre isso porque toda vez que eu tento, a frase não fecha."',
    '"Tenta comigo."',
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
    'Ele põe a bola de volta na toalha.',
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
  texto:[
    '"A gente comparou, na volta, no ônibus." Ele alinha a bola na toalha. "Todo mundo lembra de ter sido perguntado alguma coisa."',
    '"E ninguém lembra o quê."',
    '"Ninguém lembra o quê." Ele levanta os olhos. "Mas quatro dos seis mudaram de vida em três meses."',
    '"Como assim?"',
    '"Um pediu demissão e foi ser professor. Uma se separou. Um voltou a falar com o pai depois de nove anos." Ele conta nos dedos e no quarto para. "E eu entrei na Elite 4, que era uma coisa que eu tinha desistido aos trinta e três."',
    'Ele guarda as bolas no cinto.',
    '"Seja lá o que ele perguntou, moço, a gente respondeu com sinceridade."'
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
      if (n === 1) return `E é ${nomeExib(d.time[0])}, só. Vocês dois num vestiário com espaço para dez.`;
      return `São ${n}. Eles ocupam o vestiário inteiro e um deles imediatamente derruba um banco.`;
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
    '"Muita gente chega aqui", diz o Sr. Quintino. "Quase ninguém chega aqui com o time inteiro de pé e sem ter comprado nenhum deles."',
    d=>d.cemiterio.length
      ? `Ele olha a lista que trouxeram. "O senhor perdeu ${d.cemiterio.length}. Isso conta. Vai contar para o senhor por muito tempo, e é bom que conte."`
      : 'Ele olha a lista que trouxeram. "E o senhor não perdeu nenhum. Isso é mais raro que vencer."',
    'Depois ele solta a sua mão e volta a subir a escadinha, devagar, e senta de novo na borda.',
    'E fica lá, olhando, enquanto você fica sozinho no meio do poço.',
    'Não é solidão. É a diferença inteira entre setenta e nove e hoje.'
  ],
  ef:{flag:'venceu_a_elite',
      executar:d=>{ d.jogador.cargo='Campeão de Kanto'; return [{tipo:'insignia', texto:'Você é Campeão de Kanto.'}]; },
      rep:{eixo:'bom',delta:3,motivo:'Venceu a Elite 4 do Planalto Indigo'},
      insignia:'Campeão de Kanto', dinheiro:50000,
      curaTime:true,
      registrar:'Venceu a Elite 4 e tornou-se Campeão de Kanto.'},
  escolhas:[
    {texto:'"E o norte?"', vai:'c21_norte_conversa'},
    {texto:'Perguntar da moldura vazia na parede.', vai:'c21_a_moldura'},
    {texto:'Subir e sentar na borda com o Sr. Quintino.', vai:'c21_sentou_na_borda'}
  ]
},

c21_a_moldura:{
  texto:[
    'A moldura vazia na parede dos campeões é a trigésima.',
    '"A foto se tira na segunda de manhã", diz a Sra. Duarte, da recepção, já com o formulário na mão. "O senhor escolhe se é aqui em cima ou no poço."',
    '"Dá para escolher outra coisa?"',
    'Ela levanta os olhos.',
    '"Como assim?"',
    '"Dá para a foto ser do time e não minha?"',
    'Ela pensa. Consulta um manual. Volta.',
    '"Não tem norma proibindo." Ela anota. "E em vinte e nove campeões, ninguém perguntou."'
  ],
  ef:{flag:['foto_do_time'], moral:3,
      rep:{eixo:'bom',delta:2,motivo:'Pediu que a foto de campeão fosse do time'},
      registrar:'A trigésima foto da parede dos campeões vai ser do time.'},
  escolhas:[
    {texto:'"E o norte?"', vai:'c21_norte_conversa'},
    {texto:'Subir e sentar na borda com o Sr. Quintino.', vai:'c21_sentou_na_borda'}
  ]
},

c21_sentou_na_borda:{
  texto:[
    'Você sobe a escadinha e senta na borda, a dois metros dele, com as pernas para dentro do poço.',
    'Ele não vira a cabeça.',
    'Passam uns quarenta segundos.',
    '"Agora o senhor entendeu", ele diz.',
    '"Entendi."',
    'E ficam os dois assim, olhando um poço de pedra vazio, num prédio que fecha às dezoito, numa montanha, enquanto lá embaixo uma van entrega pão para o refeitório do dia seguinte.'
  ],
  ef:{flag:'sentou_na_borda', moral:4,
      npc:{nome:'Sr. Quintino', opiniao:4, memoria:'Você sentou na borda com ele depois de ganhar.'},
      rep:{eixo:'bom',delta:2,motivo:'Sentou na borda do poço em vez de comemorar'},
      registrar:'Sentou na borda do poço com o Sr. Quintino depois de vencer.'},
  escolhas:[{texto:'"E o norte?"', vai:'c21_norte_conversa'}]
},

c21_perdeu_elite:{
  texto:[
    'Você perde. Não tem vergonha nisso — perder aqui é o resultado padrão.',
    'Eles curam o seu time, te dão água e te deixam sentar na borda do poço o tempo que você precisar.',
    '"Volta", diz o Sr. Quintino. "Eu perdi quatro vezes antes de sentar desse lado."',
    '"Quatro?"',
    '"Quatro, e a terceira foi feia." Ele coça o joelho. "Na quarta eu mudei uma coisa só e ganhei, e eu vou te contar qual foi se o senhor quiser ouvir."'
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
    '"Isso serve para muito mais coisa que luta, e o senhor vai levar uns dez anos para descobrir onde."'
  ],
  ef:{flag:'conselho_do_quintino', moral:2,
      npc:{nome:'Sr. Quintino', opiniao:3, memoria:'Te contou o que mudou na quarta tentativa.'},
      registrar:'O Sr. Quintino parou de guardar o melhor para o fim.'},
  escolhas:[
    {texto:'Treinar e tentar de novo.', vai:'c21_treinou'},
    {texto:'"Me fala do norte."', vai:'c21_norte_conversa'}
  ]
},

c21_treinou:{
  texto:[
    'Você fica no Planalto por três semanas.',
    'Treina das seis às nove com a Sra. Bastos, que não te cobra nada e não te elogia nunca, e come no refeitório do subsolo com o pessoal da manutenção.',
    'Na segunda semana, o Sr. Nicácio te ensina a consertar uma tomada. Na terceira, você conserta a da sala quatro.',
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
    '"Acima da Rota 10 tem um vale entre duas paredes de pedra. Não tem nome, não tem trilha marcada e não aparece na carta topográfica com relevo, só com hachura."',
    '"Nós mandamos três equipes em dois anos."',
    'A Conselheira Vasques vira a terceira folha, que continua sem ser entregue a ninguém.',
    '"Duas voltaram e não conseguem descrever o que viram. Não é trauma: elas tentam descrever e as frases não fecham."',
    '"A terceira voltou com uma pessoa a menos."',
    'A Bruna Teles não levanta os olhos do caderno.'
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
    '"Primeira equipe, quatro pessoas, dezoito meses atrás. Subiram, chegaram, voltaram em dois dias. Relatório de três páginas dizendo que não encontraram nada."',
    '"Segunda equipe, seis pessoas, em março."',
    'Ela olha a Bruna Teles, que continua sem levantar a cabeça.',
    '"Terceira equipe, seis pessoas, há quatro meses. Voltaram seis. Relatório de vinte e duas páginas em que nenhuma frase termina."',
    '"E o quarto nome da placa?"',
    'Silêncio.',
    '"O quarto nome não é do vale", diz o Sr. Aguiar. "É de um acidente de carro na estrada de descida, na volta da primeira equipe. E é o único dos quatro que a gente sabe explicar."'
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
    'São vinte e duas páginas datilografadas por seis pessoas diferentes, cada uma com a sua parte, e o Sr. Aguiar grampeou tudo junto na ordem de chegada.',
    'Você lê três páginas e entende o que ela quis dizer.',
    'A gente chegou ao ponto marcado às onze e quarenta e havia. E aí a frase para.',
    'O terreno é aberto no fundo do vale e a sensação de estar sendo. E para.',
    'Perguntei ao Nogueira se ele também. E para.',
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
    'Ele não quis nada de nós.',
    'Embaixo, a assinatura e a matrícula, e a matrícula é do homem de mãos grandes que está no vestiário dois andares abaixo alinhando bolas numa toalha.',
    'A Conselheira Vasques olha a página de cabeça para baixo, do outro lado da mesa.',
    '"Essa é a única frase completa dos três relatórios", ela diz. "E foi escrita quatro dias depois, em casa, e ele trouxe e entregou no balcão."'
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
    'A Bruna Teles fecha o caderno e responde ela mesma, porque é dela.',
    '"Nogueira. Quarenta e dois anos, dezenove de serviço, dois filhos."',
    'Ela põe as duas mãos na mesa.',
    '"A gente desceu ao fundo do vale às onze. A gente subiu de volta às quatro e vinte da tarde. E no meio do caminho eu contei e a gente era cinco."',
    '"E ninguém viu nada?"',
    '"Ninguém viu nada, ninguém ouviu nada e — e essa é a parte pela qual eu vou responder pelo resto da vida — ninguém sentiu falta."',
    'Ela olha para você.',
    '"A gente andou uma hora e quarenta sendo cinco e achando que era cinco."'
  ],
  ef:{flag:['sabe_do_nogueira'], instabilidade:2, moral:-3,
      npc:{nome:'Bruna Teles', opiniao:3, memoria:'Andou uma hora e quarenta sem sentir falta de quem faltava.'},
      registrar:'Nogueira ficou no vale e a equipe andou 1h40 sem sentir falta.'},
  escolhas:[
    {texto:'"E vocês voltaram para procurar?"', vai:'c21_voltaram_procurar'},
    {texto:'"O que vocês querem que eu faça lá?"', vai:'c21_o_que_querem'},
    {texto:'"Eu vou. E eu procuro o Nogueira."', vai:'c21_vai_procurar_nogueira'}
  ]
},

c21_voltaram_procurar:{
  texto:[
    '"Voltamos no mesmo dia, às seis e dez, com lanterna."',
    'Ela fala rápido, porque é a parte que ela ensaiou.',
    '"A gente achou o ponto exato. Tinha a marca das nossas botas e as dele, e as dele iam até um lugar e paravam."',
    '"Paravam como?"',
    '"Paravam." Ela abre as mãos. "Não viravam, não corriam, não arrastavam. A última pegada é inteira, com o peso nos dois pés, como quem está parado olhando alguma coisa."',
    'Ela pega o caderno de novo e não abre.',
    '"E a gente ficou três dias e não achou mais nada, e no quarto dia o rádio mandou descer."'
  ],
  ef:{instabilidade:2, moral:-2,
      registrar:'As pegadas do Nogueira param inteiras, com o peso nos dois pés.'},
  escolhas:[
    {texto:'"Eu vou. E eu procuro ele."', vai:'c21_vai_procurar_nogueira'},
    {texto:'"O que vocês querem que eu faça lá?"', vai:'c21_o_que_querem'},
    {texto:'"Eu vou."', vai:'c21_aceitou_norte'}
  ]
},

c21_vai_procurar_nogueira:{
  texto:[
    '"Eu vou. E eu procuro o Nogueira."',
    'A Bruna Teles fica olhando para você por um tempo que passa do confortável.',
    'Depois arranca uma folha do caderno e escreve alguma coisa e dobra e empurra pela mesa.',
    '"Isso é o que ele estava vestindo, a marca da bota e o número, e uma coisa que ele carregava no bolso de cima e que ele nunca tirava."',
    '"O que era?"',
    '"Uma medalha de natação da filha." Ela solta a folha. "Se o senhor achar a medalha e não achar ele, eu quero a medalha."',
    'Ela abre o caderno e volta a escrever.',
    '"E se o senhor achar ele, o senhor não precisa me trazer nada. É só descer e dizer o nome dele em voz alta na portaria, que eu ouço do terceiro andar."'
  ],
  ef:{flag:['procura_o_nogueira'], itens:{'Bilhete da Bruna sobre o Nogueira':1}, moral:2,
      npc:{nome:'Bruna Teles', opiniao:5, memoria:'Te pediu para achar a medalha de natação da filha do Nogueira.'},
      rep:{eixo:'bom',delta:2,motivo:'Prometeu procurar um homem que a Liga já parou de procurar'},
      registrar:'Procurar o Nogueira. Medalha de natação no bolso de cima.'},
  escolhas:[
    {texto:'"O que vocês querem que eu faça lá?"', vai:'c21_o_que_querem'},
    {texto:'"Agora eu vou."', vai:'c21_aceitou_norte'}
  ]
},

c21_o_que_querem:{
  texto:[
    '"O que vocês querem que eu faça lá?"',
    'A pergunta cai na mesa e fica.',
    'O Sr. Aguiar tira a folha da discordância dele do bolso, desdobra e põe em cima da mesa sem dizer nada, e todo mundo sabe qual é o item.',
    'A Conselheira Vasques leva um tempo comprido.',
    '"Eu não sei."',
    'Ela não tenta melhorar isso.',
    '"Eu quero saber se ele é perigoso e eu não sei como se mede isso. Eu quero saber o que ele quer e eu não sei perguntar. E eu quero que alguém volte inteiro, e essa é a única parte em que eu sou competente, e é a parte em que eu já falhei quatro vezes."'
  ],
  ef:{flag:['a_liga_nao_sabe'], instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Fez a Liga admitir que não sabe o que quer'},
      npc:{nome:'Conselheira Nélida Vasques', opiniao:3, memoria:'Admitiu, na sua frente, que não sabe o que quer do vale.'},
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
    'O Sr. Aguiar fecha os olhos e, pela primeira vez na tarde, sorri de verdade.',
    '"Isso resolve o meu item quatro." Ele já está escrevendo. "Missão de reconhecimento sem objetivo de intervenção. Isso existe na norma, é a classe D, e ninguém usa porque não dá prestígio."',
    '"E o que muda na prática?"',
    '"Muda que se o senhor chegar lá e não fizer nada e voltar, o senhor cumpriu a missão." Ele levanta os olhos. "E isso, moço, é a diferença entre voltar e não voltar em oitenta por cento dos casos que eu vi em trinta e um anos."'
  ],
  ef:{flag:['missao_classe_d'], 
      rep:{eixo:'bom',delta:3,motivo:'Transformou a missão em reconhecimento sem intervenção'},
      npc:{nome:'Sr. Aguiar', opiniao:5, memoria:'Você resolveu o item quatro da discordância dele.'},
      registrar:'Missão de classe D: reconhecimento, sem objetivo de intervenção. Chegar, olhar e voltar já cumpre.'},
  escolhas:[{texto:'"Então está fechado. Eu vou."', vai:'c21_aceitou_norte'}]
},

c21_escrevam_agora:{
  texto:[
    '"Então escrevam. Agora. Eu espero."',
    'A Conselheira Vasques olha o relógio. São quinze e vinte.',
    '"Isso leva uma hora."',
    '"Eu tenho uma hora."',
    'Eles levam uma hora e quarenta.',
    'Você fica sentado naquela sala enquanto três pessoas discutem, riscam, reescrevem e brigam sobre o verbo de uma frase por doze minutos inteiros.',
    'Às dezessete horas, o Sr. Aguiar lê em voz alta o que escreveram, e é um parágrafo de quatro linhas, e as quatro linhas dizem uma coisa só: ir, observar, não intervir, voltar em cinco dias.',
    'E, no rodapé, uma linha que a Bruna Teles pediu para incluir e que ninguém discutiu: a não observância do prazo de retorno não constitui falta.'
  ],
  ef:{flag:['missao_classe_d','tem_a_ordem_escrita'],
      itens:{'Ordem de missão de quatro linhas':1},
      rep:{eixo:'bom',delta:3,motivo:'Ficou uma hora e quarenta esperando eles escreverem'},
      registrar:'A ordem de missão: ir, observar, não intervir, voltar em cinco dias. Atrasar não é falta.'},
  escolhas:[{texto:'"Agora eu vou."', vai:'c21_aceitou_norte'}]
},

c21_devolveu:{
  texto:[
    'Você coloca a bola — ou as bolas — na mesa e empurra.',
    'A sala fica em silêncio de um jeito que não estava previsto na pauta.',
    '"Obrigada." A Conselheira Vasques parece genuinamente surpresa, o que diz muito sobre quem sentou nessa cadeira antes de você.',
    'Eles soltam na mesma tarde, na rota mais próxima, com dois biólogos e nenhuma câmera.',
    'O Sr. Aguiar acompanha a soltura e volta no fim do dia com o formulário preenchido e uma frase escrita no campo de observações que não precisava estar ali.',
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
    '"A Master Ball é da Liga. Está registrada." A Conselheira Vasques deixa isso no ar um segundo. "O que o senhor fizer com ela vai ser registrado também."',
    d=>d.flags.missao_classe_d
      ? 'E, em cima do mapa, a ordem de quatro linhas, assinada por três pessoas, dizendo que chegar e não fazer nada já cumpre a missão.'
      : 'E, em cima do mapa, nada. Nenhuma linha dizendo o que você deve fazer ao chegar.',
    'Na porta, ela diz a última coisa, e é a única frase do dia que não parece ensaiada:',
    '"Se ele falar com o senhor — e ele fala — não minta. Ele sabe."'
  ],
  ef:{itens:{'Ultra Ball':4,'Master Ball':1,'Hyper Potion':3,'Full Heal':2},
      flag:'liga_aliada', rep:{eixo:'bom',delta:1,motivo:'Aceitou ir ao vale do norte'},
      npc:{nome:'Conselheira da Liga', opiniao:4, memoria:'Te mandou ao norte com uma Master Ball registrada.'},
      curaTime:true,
      registrar:'A Liga te equipou para o norte.'},
  escolhas:[
    {texto:'Devolver os lendários antes de subir.', vai:'c21_devolveu', cond:d=>Estado.lendariosCapturados().length>0},
    {texto:'Passar na arena para se despedir do Sr. Quintino.', vai:'c21_despedida', cond:d=>!!d.flags.conheceu_quintino},
    {texto:'Sair do Planalto.', vai:'c21_fim'}
  ]
},

c21_despedida:{
  texto:[
    'Ele está na borda, onde estava às treze e trinta e onde vai estar amanhã.',
    '"O senhor vai."',
    '"Vou."',
    'Ele assente devagar, três vezes, e não olha para você nenhuma vez durante a conversa inteira.',
    '"Então eu vou te pedir uma coisa e o senhor pode dizer não."',
    'Ele tira do bolso um papel dobrado, velho, amarelado nas dobras, e entrega sem olhar.',
    '"É o endereço de uma casa em Cinnabar que não existe mais, porque a ilha inteira não existe mais." Ele encolhe os ombros. "Eu carrego desde oitenta e um. Se o senhor voltar do norte, joga fora por mim. Eu não consigo."'
  ],
  ef:{flag:['carrega_o_papel_do_quintino'], itens:{'Um papel dobrado desde 1981':1}, moral:3,
      npc:{nome:'Sr. Quintino', opiniao:5, memoria:'Te pediu para jogar fora, na volta, um papel que ele carrega desde 1981.'},
      rep:{eixo:'bom',delta:2,motivo:'Aceitou carregar o arrependimento de outra pessoa'},
      registrar:'O Sr. Quintino te deu um papel de 1981 para jogar fora na volta.'},
  escolhas:[{texto:'Sair do Planalto.', vai:'c21_fim'}]
},

c21_recusou_norte:{
  texto:[
    '"Manda outra equipe."',
    '"Já mandamos três." Ela não se irrita. "A quarta seria enviar gente sabendo que eles não voltam. Eu não faço isso."',
    '"E mandar eu, a senhora faz?"',
    '"Eu não estou te mandando. Eu estou te contando." Ela empurra o mapa pela mesa mesmo assim. "A diferença importa para mim, mesmo que não importe para o senhor."',
    'O Sr. Aguiar olha o mapa em cima da mesa e olha para ela, e não diz nada, e o que ele não diz fica na sala.'
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
    'A Conselheira Vasques olha o mapa em cima da mesa, do lado de lá da linha invisível que separa contar de mandar.',
    'Ela puxa o mapa de volta.',
    '"O senhor tem razão."',
    'E aí ela faz uma coisa que ninguém naquela mesa esperava: ela guarda o mapa na pasta e fecha.',
    '"Está encerrado. Se o senhor quiser ir depois, o senhor volta aqui e pede, e eu dou. Mas não vai sair desta sala em cima de uma mesa."'
  ],
  ef:{flag:['nao_saiu_com_o_mapa'], 
      rep:{eixo:'bom',delta:3,motivo:'Não deixou que te empurrassem um mapa pela mesa'},
      npc:{nome:'Conselheira Nélida Vasques', opiniao:4, memoria:'Guardou o mapa de volta na pasta quando você apontou o que ela tinha feito.'},
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
      if (d.jogador.cargo) return `Você desce como ${d.jogador.cargo}, o que é uma frase que a sua versão de quinze anos saindo de casa não teria acreditado.`;
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
