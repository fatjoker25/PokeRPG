/* ============================================================
   MERCADO E TROCAS — cada cidade vende o que cada cidade é
   ============================================================ */

/* Preço de referência. A cidade mexe nisso pra cima ou pra baixo. */
const PRECO_BASE = {
  'Poké Ball':200, 'Great Ball':600, 'Ultra Ball':1200,
  'Potion':300, 'Super Potion':700, 'Hyper Potion':1500,
  'Revive':1500, 'Antidote':250, 'Full Heal':600,
  'Bandagem':400, 'Ração':350, 'Água Fresca':250, 'Cantil':500,
  'Éter':900, 'Elixir':2000, 'Boneco':700, 'Repelente':400,
  'Corda':450, 'Lanterna':600, 'Pilha':180, 'Isca':150, 'Machado':900, 'Picareta':1100,
  'Máscara de pó':300, 'Bota de borracha':900, 'Cobertor térmico':1100,
  'Câmera descartável':800, 'Caderno de campo':350, 'Mapa de Kanto':600,
  'Pedra do Fogo':4000, 'Pedra da Água':4000, 'Pedra do Trovão':4000,
  'Pedra da Folha':4000, 'Moon Stone':6000, 'Pedra do Sol':6000,
  /* segurados */
  'Resto de Ração':2800, 'Faixa Firme':3200, 'Punho de Ferro':2600,
  'Óculos Grossos':2600, 'Colete de Lona':2400, 'Botina Leve':2200,
  'Sino Calmante':1800, 'Amuleto de Moeda':3600, 'Exp. Share':3000, 'PP Up':9800,
  /* bolsas */
  'Mochila Preta':1400, 'Mochila Vermelha':1300, 'Mochila Azul':1200, 'Mochila Verde':1200,
  'Mochila Amarela':1300, 'Mochila Marrom':1800, 'Mochila Laranja':1500,
  'Bolsa Roxa':1400, 'Bolsa Branca':1100, 'Bolsa Cinza':1200, 'Bolsa Rosa':900,
  'Bolsa Prateada':2200, 'Bolsa Dourada':3200
};

/* O que a loja de cada cidade tem, e por quanto (multiplicador local).
   A ideia: ninguém em Pewter vende bola barata, e ninguém em Lavender
   vende repelente, porque ninguém em Lavender vai pro mato. */
const LOJAS = {
  pallet: {
    nome:'Mercado do Sr. Fenwick',
    ar:'Um mercado de bairro que vende Poké Ball atrás do balcão, junto com pilha e anzol. Ele te conhece desde pequeno e cobra o mesmo de todo mundo.',
    mult:1.0,
    itens:['Poké Ball','Potion','Antidote','Isca','Ração','Pilha','Cantil']
  },
  viridian: {
    nome:'Loja de Viridian',
    ar:'Fachada sem graça, prateleira organizada, e a atendente sabe exatamente o que um treinador de três dias esqueceu de comprar.',
    mult:1.0,
    itens:['Poké Ball','Great Ball','Potion','Super Potion','Antidote','Full Heal','Repelente','Corda','Bandagem','Mapa de Kanto','Sino Calmante','Mochila Verde','Bolsa Cinza']
  },
  pewter: {
    nome:'Casa de Ferragens Hawthorn',
    ar:'Vende mais equipamento de escalada que item de treinador. A dona explica que é questão de demanda: aqui todo mundo trabalha em pedra.',
    mult:1.15,
    itens:['Poké Ball','Potion','Corda','Lanterna','Pilha','Machado','Picareta','Máscara de pó','Bandagem','Caderno de campo','Punho de Ferro','Colete de Lona','Mochila Marrom']
  },
  cerulean: {
    nome:'Balcão da Ponte Sul',
    ar:'Atende pela janela, sem ninguém entrar. Tem geladeira de bebida e uma vitrine pequena com uma pedra azul que fica ali há anos.',
    mult:1.05,
    itens:['Poké Ball','Great Ball','Potion','Super Potion','Água Fresca','Full Heal','Revive','Isca','Pedra da Água','Botina Leve']
  },
  vermilion: {
    nome:'Armazém do Cais',
    ar:'Abre às cinco da manhã e vende comida, corda e Poké Ball no mesmo balcão. Metade do estoque é importado e entra sem imposto por um caminho que ninguém comenta.',
    mult:0.9,
    itens:['Poké Ball','Great Ball','Ultra Ball','Potion','Super Potion','Éter','Bota de borracha','Cobertor térmico','Câmera descartável','Corda','Cantil','Faixa Firme','Resto de Ração','Mochila Laranja','Bolsa Prateada']
  },
  lavender: {
    nome:'Casa Boa Memória',
    ar:'Vende incenso, vela e Potion no mesmo balcão, o que faz um sentido triste. Ninguém aqui vende repelente: ninguém daqui vai pro mato.',
    mult:1.1,
    itens:['Potion','Super Potion','Hyper Potion','Full Heal','Revive','Bandagem','Caderno de campo','Ração','Sino Calmante']
  },
  celadon: {
    nome:'Grande Loja de Celadon',
    ar:'Sete andares, escada rolante nos dois sentidos e uma voz gravada que anuncia o andar em duas línguas. É o lugar mais barato de Kanto e o que menos te olha na cara.',
    mult:0.85,
    andares:[
      {n:1, nome:'Térreo · Atendimento',
       ar:'Balcão de informações, guarda-volumes e um mapa dos andares em acrílico com uma seta que diz VOCÊ ESTÁ AQUI e está no andar errado.',
       itens:['Mapa de Kanto','Caderno de campo','Pilha','Câmera descartável']},
      {n:2, nome:'2º · Artigos de treinador',
       ar:'Prateleira de bola do chão ao teto, organizada por preço e não por tipo, o que irrita quem entende e ajuda quem não entende. No fundo, um expositor giratório de discos de TM com um cadeado que ninguém lembra a senha.',
       itens:['Poké Ball','Great Ball','Ultra Ball','Repelente','Boneco','Corda','Isca',
              'TM01 Mega Punch','TM05 Mega Kick','TM07 Horn Drill','TM09 Take Down','TM17 Submission','TM18 Counter','TM32 Double Team','TM33 Reflect','TM11 Sunny Day','TM18 Rain Dance','TM37 Sandstorm']},
      {n:3, nome:'3º · Cuidados',
       ar:'Cheiro de farmácia. Tem uma funcionária de jaleco que explica a diferença entre Potion e Super Potion umas quarenta vezes por dia e não perdeu a paciência ainda.',
       itens:['Potion','Super Potion','Hyper Potion','Antidote','Full Heal','Revive','Bandagem','Éter','Elixir','PP Up']},
      {n:4, nome:'4º · Pedras e evolução',
       ar:'Vitrine trancada, luz de cima, e um cartaz explicando que a loja não se responsabiliza por evolução feita por impulso.',
       /* a Pedra do Sol só entra no catálogo com a Pokédex Nacional
          (ESTOQUE_NACIONAL); sem estar num andar, ela nunca aparecia */
       itens:['Pedra do Fogo','Pedra da Água','Pedra do Trovão','Pedra da Folha','Pedra do Sol']},
      {n:5, nome:'5º · Equipamento',
       ar:'Item segurado, um por Pokémon, cada um numa caixinha com a ficha técnica impressa em letra de máquina.',
       itens:['Resto de Ração','Faixa Firme','Punho de Ferro','Óculos Grossos','Colete de Lona','Botina Leve','Sino Calmante','Amuleto de Moeda','Exp. Share']},
      {n:6, nome:'6º · Lanchonete',
       ar:'Mesa de fórmica, máquina de refrigerante e a melhor vista de Celadon, que não é grande coisa mas é de graça.',
       itens:['Água Fresca','Ração','Cantil','Cobertor térmico']},
      {n:7, nome:'7º · Terraço',
       ar:'Duas máquinas automáticas, um bebedouro quebrado e três pessoas dando comida para um bando de Pidgey que claramente mora aqui.',
       itens:['Mochila Preta','Mochila Vermelha','Mochila Azul','Mochila Amarela','Bolsa Roxa','Bolsa Branca','Bolsa Rosa','Bolsa Dourada']}
    ],
    itens:['Poké Ball','Great Ball','Ultra Ball','Potion','Super Potion','Hyper Potion','Revive','Antidote','Full Heal','Éter','Elixir','Boneco','Repelente','Ração','Mapa de Kanto',
           'TM01 Mega Punch','TM05 Mega Kick','TM07 Horn Drill','TM09 Take Down','TM17 Submission','TM18 Counter','TM32 Double Team','TM33 Reflect','TM11 Sunny Day','TM18 Rain Dance','TM37 Sandstorm',
           'Pedra do Fogo','Pedra da Água','Pedra do Trovão','Pedra da Folha',
           'Resto de Ração','Faixa Firme','Punho de Ferro','Óculos Grossos','Colete de Lona','Botina Leve','Sino Calmante','Amuleto de Moeda','Mochila Preta','Mochila Vermelha','Mochila Azul','Mochila Amarela','Bolsa Roxa','Bolsa Branca','Bolsa Rosa','Bolsa Dourada','PP Up','Exp. Share']
  },
  fuchsia: {
    nome:'Posto da Zona Safári',
    ar:'Vende mais repelente que Poké Ball, e tem um cartaz explicando por quê. A fila é de gente de bermuda com chapéu novo.',
    mult:1.0,
    itens:['Poké Ball','Great Ball','Repelente','Isca','Máscara de pó','Corda','Machado','Água Fresca','Mapa de Kanto','Antidote','Full Heal','Resto de Ração']
  },
  saffron: {
    nome:'Conveniência Silph — térreo',
    ar:'Fica no térreo de um prédio comercial e tem fila de gente de crachá na hora do almoço. Tudo é caro e tudo tem nota fiscal.',
    mult:1.3,
    itens:['Poké Ball','Great Ball','Ultra Ball','Super Potion','Hyper Potion','Full Heal','Revive','Elixir','Éter','Caderno de campo','Câmera descartável','Óculos Grossos','Amuleto de Moeda','Mochila Preta','Bolsa Cinza']
  },
  cinnabar: {
    nome:'Vitrine da Sra. Juna',
    ar:'É uma casa com uma vitrine. A dona atende de chinelo e leva tudo o que chega de barco, o que quer dizer que às vezes falta tudo.',
    mult:1.25,
    itens:['Poké Ball','Potion','Hyper Potion','Revive','Full Heal','Cobertor térmico','Bandagem','Pedra do Fogo','Punho de Ferro']
  }
};

function precoNaCidade(nome, idCidade){
  const L = LOJAS[idCidade];
  const base = PRECO_BASE[nome] || 500;
  const m = L ? L.mult : 1;
  /* crachá tem convênio: quem tem posto paga menos */
  const c = (typeof Cargos !== 'undefined') ? Cargos.desconto() : 1;
  return Math.round(base * m * c / 10) * 10;
}

/* O que a Pokédex Nacional destrava também aparece na prateleira.
   Antes dela, a Pedra do Sol é uma pedra bonita sem uso conhecido
   e ninguém importa pedra bonita sem uso conhecido. */
const ESTOQUE_NACIONAL = {
  celadon: ['Pedra do Sol'],
  cinnabar: ['Pedra do Sol']
};

function catalogoDaCidade(idCidade){
  const L = LOJAS[idCidade];
  if (!L) return [];
  let itens = L.itens;
  if (typeof dexNacional === 'function' && dexNacional() && ESTOQUE_NACIONAL[idCidade])
    itens = itens.concat(ESTOQUE_NACIONAL[idCidade].filter(n => !itens.includes(n)));
  return itens.map(n => [n, precoNaCidade(n, idCidade)]);
}

/* ============================================================
   TROCAS — uma por cidade, e cada uma tem gente dentro
   ============================================================ */
/* ============================================================
   TROCAS — pouca gente troca, e quase ninguém troca em cidade
   Quatro cidades têm alguém no balcão. O resto é gente de
   estrada: guarita, túnel, píer, beira de rio.
   ============================================================ */
const TROCAS = {

/* ─── nas cidades (quatro, e só) ─── */
  viridian: [{
    id:'viridian_1',
    quem:'Nilo, o do posto',
    onde:'atrás do posto de gasolina, com um rádio ligado no jogo',
    pede:19, da:{dex:52, nivel:[14,18], apelido:'Bigode', natureza:'Jolly'},
    fala:'"Eu preciso de um Rattata. Sério. Meu sogro tem alergia a Meowth e eu tenho um Meowth."',
    depois:'Ele solta o Rattata no quintal e o Rattata some no muro em quatro segundos. Ele não parece incomodado. "Era só pra ele sair de casa mesmo."',
    memoria:'Trocou o Meowth dele por um Rattata seu, por causa do sogro.'
  }],
  cerulean: [{
    id:'cerulean_1',
    quem:'Beatrix, da escola de natação',
    onde:'na borda rasa, depois da aula das crianças',
    pede:61, da:{dex:86, nivel:[24,28], apelido:'Bolha', natureza:'Calm'},
    fala:'"Meu Seel não gosta de água parada. Ele nasceu aqui e ele odeia piscina, dá pra acreditar?"',
    depois:'Ela leva o Poliwhirl pra piscina rasa e as crianças gritam de alegria, e é o som mais alto que essa cidade produziu o mês inteiro.',
    memoria:'Trocou o Seel dela pelo seu Poliwhirl, na escola de natação.'
  }],
  lavender: [{
    id:'lavender_1',
    quem:'o zelador da torre',
    onde:'no primeiro andar, entre as velas',
    pede:104, da:{dex:93, nivel:[30,34], apelido:'Sete', natureza:'Quiet'},
    trocaEvolui:true,
    fala:'"Tem um Haunter que mora no sétimo andar e que quer ir embora daqui. Eu não sei explicar como eu sei. Eu sei."\n"E ele quer o quê?"\n"Ele quer um Cubone. Não me pergunta por quê."',
    depois:'O zelador leva o Cubone pra dentro do terceiro andar e volta sem ele, e não explica, e você decide não perguntar.',
    memoria:'Trocou um Cubone pelo Haunter do sétimo andar da Torre.'
  }, {
    id:'lavender_2', requer:d=>numInsignias() >= 5,
    quem:'a senhora de luto do primeiro andar',
    onde:'no banco de pedra da entrada da Torre, sempre no mesmo horário',
    pede:35, da:{dex:105, nivel:[30,34], apelido:'Dezenove', natureza:'Sassy'},
    fala:'"Esse Marowak acompanha gente até o terceiro andar e volta sozinho. Todo dia. Há dezenove meses."\n"E a senhora quer um Clefairy."\n"Eu quero uma coisa que suba comigo e que desça comigo, e não uma que fique."',
    depois:'Ela sobe com o Clefairy no colo e desce com o Clefairy no colo, e no dia seguinte sobe de novo, e é a primeira vez em dezenove meses que ela sobe com companhia.',
    memoria:'Trocou o Marowak da Torre pelo seu Clefairy. Ela queria uma companhia que descesse junto.'
  }],
  saffron:  [{
    id:'saffron_1',
    quem:'uma mulher de crachá azul',
    onde:'na praça de alimentação, na hora do almoço, sozinha',
    pede:122, da:{dex:64, nivel:[30,34], apelido:'Sete e meia', natureza:'Modest'},
    trocaEvolui:true,
    fala:'"Eu tenho um Kadabra e eu não consigo mais ficar com ele."\n"Por quê?"\n"Porque ele sabe o que eu penso e eu trabalho onde eu trabalho."',
    depois:'Ela pega o Mr. Mime e vai embora sem terminar o almoço, e você repara que a bandeja dela estava intacta desde o começo.',
    memoria:'Trocou o Kadabra dela pelo seu Mr. Mime, na praça de alimentação. Ela não queria mais alguém lendo o que ela pensa.'
  }],

/* ─── na estrada: quem troca por estar de passagem ─── */
  rota1: [{
    id:'rota1_1', requer:d=>numInsignias() >= 2,
    quem:'a mulher do varal',
    onde:'sentada na mureta da Rota 1, com a sacola de compras no colo, esperando a carona das quatro',
    pede:16, da:{dex:20, nivel:[16,20], apelido:'Senhor', natureza:'Jolly'},
    fala:'"O Senhor mora embaixo da minha casa há seis anos e nunca foi de ninguém."\n"E a senhora quer um Pidgey?"\n"Eu quero uma coisa que voe. A vizinha tem um. Eu quero um também. Eu tenho sessenta e dois anos e eu posso querer o que eu quiser."',
    depois:'Ela chama o Pidgey de Senhor também, no mesmo dia, sem transição nenhuma, e ninguém na rua acha isso estranho.',
    memoria:'Trocou o Raticate que morava embaixo da casa dela por um Pidgey seu. Ela chama os dois de Senhor.'
  }],
  tunel_rocha: [{
    id:'tunel_1',
    quem:'Arlo da pedreira',
    onde:'no meio do Túnel da Rocha, de capacete com lanterna, mapeando o teto',
    pede:75, da:{dex:67, nivel:[26,30], apelido:'Bloco', natureza:'Adamant'},
    trocaEvolui:true,
    fala:'"Eu tenho um Machoke e nenhuma pedra pra ele quebrar. Você tem Graveler? Aqui ele ia ser feliz."',
    depois:'Duas semanas depois chega um bilhete pelo Centro Pokémon: "O seu virou Golem no dia seguinte. Eu chorei um pouco. Arlo."',
    memoria:'Trocou um Machoke pelo seu Graveler no portão da pedreira.'
  }],
  monte_lua: [{
    id:'monte_1', requer:d=>numInsignias() >= 4,
    quem:'a restauradora do museu',
    onde:'numa dobra do Monte da Lua, de luva de algodão, raspando uma parede com pincel',
    pede:140, da:{dex:142, nivel:[34,38], apelido:'Quinze', natureza:'Jolly'},
    fala:'"Nós temos dois Aerodactyl ressuscitados e espaço para um. O segundo passa o dia batendo no vidro."\n"E o Kabuto?"\n"O Kabuto cabe num aquário. Eu preciso do que cabe num aquário."',
    depois:'Ela leva o Kabuto pra bancada, põe numa cuba de vidro com água salgada, e fica quinze minutos olhando sem escrever nada, o que ela não faz desde a faculdade.',
    memoria:'Trocou um Aerodactyl do museu de Pewter por um Kabuto seu.'
  }],
  rota11: [{
    id:'rota11_1',
    quem:'Nolan ou outro menino do cais',
    onde:'sentado no barranco da Rota 11, com um balde e uma vara curta',
    pede:98, da:{dex:90, nivel:[22,26], apelido:'Tampa', natureza:'Impish'},
    fala:'"Eu acho Shellder demais e Krabby quase nunca. Você troca? É troca de igual, eu não tô querendo levar vantagem."',
    depois:'Ele guarda o Krabby na caixa de isopor com o pano molhado por cima, do jeito certo, e você entende que ele nunca ia vender aquele.',
    memoria:'Trocou um Shellder pelo seu Krabby, na pedra do quebra-mar.'
  }],
  rota12: [{
    id:'rota12_1', requer:d=>numInsignias() >= 4,
    quem:'o contramestre do Anne',
    onde:'de folga, pescando na Rota 12, de camisa para fora da calça',
    pede:72, da:{dex:130, nivel:[36,40], apelido:'Sobra', natureza:'Rash'},
    fala:'"Eu peguei esse Gyarados de Magikarp, criei ele no navio, e ele é grande demais pro navio."\n"E o senhor quer um Tentacool."\n"Eu quero uma coisa que caiba na cabine. Só isso. Eu tô velho."',
    depois:'O Gyarados sai da bola no cais uma última vez, e o porto inteiro para de trabalhar por onze segundos, e o contramestre não olha pra ele nem uma vez.',
    memoria:'Trocou o Gyarados do contramestre do Anne por um Tentacool seu.'
  }],
  rota7: [{
    id:'rota7_1',
    quem:'a florista do térreo',
    onde:'na Rota 7, colhendo alguma coisa na beira da estrada com um balde',
    pede:29, da:{dex:32, nivel:[20,24], apelido:'Espeto', natureza:'Naughty'},
    fala:'"Eu tenho macho, você tem fêmea. Eu não vou explicar melhor que isso, {moço|moça}, eu tenho quarenta e três anos e eu trabalho com planta."',
    depois:'Ela põe o Nidoran♀ numa caixa de papelão com furo e um pratinho de água e sai carregando pelo corredor de serviço, falando com ela o caminho inteiro.',
    memoria:'Trocou o Nidoran♂ dela pelo seu Nidoran♀, na banca de flor.'
  }],
  rota16: [{
    id:'rota16_1',
    quem:'um guarda-parque de folga',
    onde:'na cerca leste da Rota 16, do lado de fora, de roupa comum',
    pede:102, da:{dex:113, nivel:[26,30], apelido:'Dona Chansey', natureza:'Gentle'},
    fala:'"Você acha que eu tô bêbado e eu tô, mas escuta: eu troco essa Chansey por um Exeggcute e eu não tô te enganando. Ela é boa demais pra mim. Eu durmo em alojamento."',
    depois:'No dia seguinte, sóbrio, ele te procura no Centro Pokémon. Você acha que ele vai voltar atrás. Ele só quer saber se ela comeu.',
    memoria:'Trocou a Chansey dele pelo seu Exeggcute. No dia seguinte ele foi perguntar se ela tinha comido.'
  }],
  rota21: [{
    id:'rota21_1',
    quem:'o dono da pousada',
    onde:'na Rota 21, esperando a balsa, com uma mala e uma bola',
    pede:77, da:{dex:126, nivel:[30,34], apelido:'Brasa', natureza:'Brave'},
    fala:'"Esse Magmar apareceu na cratera há dois anos e não foi mais embora. Ele dorme na minha lavanderia. Eu não posso mais pagar a conta de luz do ventilador."',
    depois:'Ele solta o Ponyta na encosta e o Ponyta fica parado olhando o mar por muito tempo, do jeito de quem nunca viu tanta água junta.',
    memoria:'Trocou o Magmar da lavanderia dele pelo seu Ponyta.'
  }],
  rota24: [{
    id:'rota24_1', requer:d=>numInsignias() >= 5,
    quem:'o rapaz da Rota 25',
    onde:'na varanda da casa dele, na ponta da Rota 25, em cima de quatro cadernos empilhados',
    pede:25, da:{dex:133, nivel:[22,26], apelido:'Vírgula', natureza:'Timid'},
    fala:'"Eu estudo Eevee há seis anos e eu nunca vi um evoluir na minha frente. Nunca."\n"E o Pikachu?"\n"Pikachu eu já vi evoluir. Eu quero uma coisa que eu já entenda, pra poder pensar em outra."',
    depois:'Ele anota a hora exata em que o Pikachu entra na bola, em quatro cadernos diferentes, porque ele é assim e ninguém nunca conseguiu mudar isso.',
    memoria:'Trocou o Eevee do pesquisador da Rota 25 pelo seu Pikachu.'
  }],
  rota19: [{
    id:'rota19_1', requer:d=>numInsignias() >= 6,
    quem:'a médica de Pokémon da reserva',
    onde:'na beira da Rota 19, lavando material numa bacia, com a camionete aberta',
    pede:115, da:{dex:127, nivel:[32,36], apelido:'Alicate', natureza:'Adamant'},
    fala:'"Esse Pinsir entra em qualquer briga que acontecer num raio de cinquenta metros. Qualquer uma. Inclusive as minhas."\n"E a Kangaskhan?"\n"Kangaskhan separa briga. Você não imagina o que isso vale aqui dentro."',
    depois:'A Kangaskhan atravessa o pátio do setor 3 e três brigas param sozinhas antes de ela chegar perto, e a médica fica olhando aquilo com uma cara de quem acabou de ganhar na loteria.',
    memoria:'Trocou o Pinsir da reserva pela sua Kangaskhan. Kangaskhan separa briga.'
  }],
  caminho_vitoria: [{
    id:'vitoria_1', requer:d=>numInsignias() >= 7,
    quem:'o mestre do dojo',
    onde:'sentado numa pedra do Caminho da Vitória, sem pressa nenhuma de chegar',
    pede:68, da:{dex:107, nivel:[34,38], apelido:'Terceiro', natureza:'Careful'},
    fala:'"Meu Hitmonchan perdeu três vezes seguidas pro mesmo garoto e decidiu que o problema é ele."\n"E não é?"\n"O problema sou eu. Mas ele não acredita, e eu não consigo mais ensinar quem não acredita em mim."',
    depois:'O Machamp fica de pé no meio do tatame e o dojo inteiro para pra olhar, e o mestre se curva pra ele, e é a primeira coisa que ele faz naquele tatame em seis anos que não é ensinar.',
    memoria:'Trocou o Hitmonchan do dojo de Saffron pelo seu Machamp.'
  }],
  rota23: [{
    id:'rota23_1', requer:d=>numInsignias() >= 3,
    quem:'a guarda florestal do posto 2',
    onde:'na terceira guarita da Rota 23, no fim do turno dela',
    pede:12, da:{dex:123, nivel:[26,30], apelido:'Foice', natureza:'Adamant'},
    fala:'"Esse Scyther apareceu ferido na trilha em março e a gente tratou, e agora ele não vai embora e não pode ficar."\n"Por que não pode?"\n"Porque isso aqui é posto de guarda, não é casa de ninguém. Inclusive minha."',
    depois:'Ela solta o Butterfree no meio da clareira e ele sobe em espiral e fica lá em cima um tempo, e ela olha pra cima até doer o pescoço.',
    memoria:'Trocou o Scyther do posto de guarda pelo seu Butterfree.'
  }],
  rota13: [{
    id:'rota13_1', requer:d=>numInsignias() >= 6,
    quem:'o vendedor do quarto andar',
    onde:'acampado na Rota 13, de férias, com um rádio e um guarda-sol',
    pede:137, da:{dex:132, nivel:[24,28], apelido:'Cópia', natureza:'Hardy'},
    fala:'"Eu tenho um Ditto e um Ditto é a coisa mais inútil que existe pra quem trabalha com etiqueta."\n"Por quê?"\n"Porque ele copia a etiqueta. Você não faz ideia do prejuízo que isso deu."',
    depois:'Ele liga o Porygon no terminal da loja e o Porygon organiza o estoque inteiro em quarenta minutos, e ele chora um pouquinho e fala que é do ar-condicionado.',
    memoria:'Trocou o Ditto do vendedor de Celadon pelo seu Porygon.'
  }],
  rota3: [{
    id:'rota3_1', requer:d=>numInsignias() >= 7,
    quem:'a moça da vitrine',
    onde:'na Rota 3, voltando de Pewter a pé, com uma caixa de isopor debaixo do braço',
    pede:139, da:{dex:141, nivel:[34,38], apelido:'Tesoura', natureza:'Brave'},
    fala:'"Chegou um Kabutops de fóssil no lote do mês passado e ninguém veio buscar."\n"E ninguém vai?"\n"O endereço do formulário é de uma casa que queimou. Eu não vou deixar ele numa gaveta por causa disso."',
    depois:'Ela põe o Omastar no aquário da vitrine, que é o melhor ponto da ilha, e o Omastar passa o resto do dia olhando gente passar na calçada.',
    memoria:'Trocou um Kabutops que ninguém foi buscar por um Omastar seu.'
  }]
};

const Trocas = {
  /* Uma cidade pode ter mais de uma troca, e uma troca pode estar
     trancada por progresso. daCidade devolve só as que existem hoje. */
  lista(id){
    const t = TROCAS[id];
    if (!t) return [];
    return (Array.isArray(t) ? t : [t]).filter(x => {
      try { return !x.requer || x.requer(Estado.dados); } catch(e){ return false; }
    });
  },
  disponiveis(id){ return this.lista(id).filter(t => !this.jaFez(t.id)); },
  daCidade(id){ return this.disponiveis(id)[0] || this.lista(id)[0] || null; },
  porId(tid){
    for (const lista of Object.values(TROCAS))
      for (const t of (Array.isArray(lista) ? lista : [lista]))
        if (t.id === tid) return t;
    return null;
  },
  jaFez(tid){
    const f = Estado.dados.trocasFeitas || {};
    /* save antigo guardava por cidade; o novo guarda por troca */
    return !!f[tid];
  },
  candidatos(t){
    if (!t) return [];
    return Estado.dados.time.filter(p => p.dex === t.pede && !p.morto);
  },

  /* tela: se a cidade tem mais de uma troca em aberto, escolhe qual */
  tela(tid){
    const id = Mundo.id();
    const abertas = this.disponiveis(id);
    const feitas = this.lista(id).filter(t => this.jaFez(t.id));

    if (!abertas.length){
      if (feitas.length)
        return Exploracao.tela(feitas.map(t => ({tipo:'info',
          texto:`${t.quem} te vê de longe e levanta a mão. A troca já foi feita, e ela foi boa para os dois.`})));
      return Exploracao.tela([{tipo:'info', texto:'Ninguém aqui está querendo trocar nada hoje.'}]);
    }

    const t = tid ? this.porId(tid) : (abertas.length === 1 ? abertas[0] : null);

    if (!t){
      /* mais de uma: a cidade mostra quem está querendo trocar */
      UI.limpar(); UI.add(UI.topo());
      UI.add(`<div class="painel">
        <div class="cap-cabecalho">
          <div class="num">trocas</div>
          <div class="tit">${UI.esc(LOCAIS[id].nome)}</div>
          <div class="loc">${abertas.length} pessoas querendo trocar</div>
        </div>
        <div id="avisos" class="avisos"></div>
        <div id="escolhas" class="escolhas">
          ${abertas.map(x => {
            const tenho = this.candidatos(x).length;
            return `<button class="escolha" onclick="Trocas.tela('${x.id}')">
              ${UI.esc(x.quem)} — quer um ${UI.esc(DEX[x.pede].nome)}, oferece um ${UI.esc(DEX[x.da.dex].nome)}
              <br><span class="pd">${UI.esc(x.onde)}${tenho ? ' · você tem o que ele quer' : ''}</span></button>`;
          }).join('')}
          ${feitas.map(x => `<button class="escolha" disabled>
            ${UI.esc(x.quem)} — já trocado<br><span class="pd">${UI.esc(x.memoria)}</span></button>`).join('')}
          <button class="escolha" onclick="Exploracao.tela()">Deixar pra depois.</button>
        </div>
      </div>`);
      return;
    }

    if (this.jaFez(t.id))
      return Exploracao.tela([{tipo:'info', texto:`${t.quem} te vê de longe e levanta a mão. A troca já foi feita, e ela foi boa para os dois.`}]);

    const esp = DEX[t.da.dex], pedido = DEX[t.pede];
    const meus = this.candidatos(t);
    const lista = meus.length
      ? meus.map(p => `<button class="escolha" onclick="Trocas.fazer('${p.uid}','${t.id}')">
          Trocar ${UI.esc(nomeExib(p))} (Nv ${p.nivel}, ${UI.esc(p.natureza)})
          <br><span class="pd">Isso não tem desfazer.</span></button>`).join('')
      : `<p class="nada">Você não tem nenhum ${UI.esc(pedido.nome)}. ${UI.esc(t.quem)} diz que espera.</p>`;

    UI.limpar();
    UI.add(UI.topo());
    UI.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">troca</div>
        <div class="tit">${UI.esc(t.quem)}</div>
        <div class="loc">${UI.esc(t.onde)}</div>
      </div>
      <div class="narrativa">
        ${UI.narrar(t.fala.split('\n').map((l, i) =>
          i % 2 === 0 ? {quem:t.quem, diz:l.replace(/^"|"$/g,'')}
                      : {quem:Estado.j.nome, diz:l.replace(/^"|"$/g,'')}))}
        <p class="sussurro">Ele quer um ${UI.esc(pedido.nome)}. Ele oferece um ${UI.esc(esp.nome)}${t.da.apelido?` chamado ${UI.esc(t.da.apelido)}`:''}.</p>
      </div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas">
        ${lista}
        ${abertas.length > 1 ? `<button class="escolha" onclick="Trocas.tela()">Ver quem mais está querendo trocar.</button>` : ''}
        <button class="escolha" onclick="Exploracao.tela()">Deixar pra depois.</button>
      </div>
    </div>`);
  },

  fazer(uid, tid){
    const id = Mundo.id();
    const t = tid ? this.porId(tid) : this.daCidade(id);
    const d = Estado.dados;
    const meu = d.time.find(p => p.uid === uid);
    if (!t || !meu) return;
    if (this.jaFez(t.id)) return;

    /* sai o seu */
    d.time = d.time.filter(p => p.uid !== uid);
    d.trocasFeitas = d.trocasFeitas || {};
    d.trocasFeitas[t.id] = {cidade:id, deu:meu.dex, recebeu:t.da.dex, dia:d.relogio.dia};

    /* entra o dele */
    const nivel = Dados.entre(t.da.nivel[0], t.da.nivel[1]);
    let dexNovo = t.da.dex;
    let virou = null;
    if (t.trocaEvolui && evoluiPorTroca(dexNovo)){ virou = DEX[dexNovo].nome; dexNovo = evoluiPorTroca(dexNovo); }
    const novo = criarPokemon(dexNovo, nivel, {
      natureza: t.da.natureza,
      apelido: t.da.apelido,
      moral: 45,
      historia: `Veio de uma troca em ${LOCAIS[id].nome}, com ${t.quem}.`
    });
    novo.trocado = true;
    Estado.adicionar(novo);
    Estado.lembrarNPC(t.quem, {nome:t.quem, opiniao:3, memoria:t.memoria});
    Estado.registrar(`Trocou ${meu.nome} por ${novo.nome} em ${LOCAIS[id].nome}.`);
    Estado.marcar('ja_trocou');
    Estado.salvar('auto');

    const avisos = [
      {tipo:'pokemon', texto:`${nomeExib(novo)} (Nv ${novo.nivel}, ${novo.natureza}) entrou para o seu time.`},
      {tipo:'eco', texto:t.depois}
    ];
    if (virou) avisos.push({tipo:'evolucao', texto:`No segundo em que a bola encostou na sua mão, ${virou} mudou de forma. Ninguém sabe explicar por que a troca faz isso. Todo mundo já viu acontecer.`});
    avisos.push({tipo:'info', texto:`${nomeExib(novo)} obedece pior do que os seus. ${pron(novo).Ele} não te escolheu e ainda não sabe o seu nome.`});
    Exploracao.tela(avisos);
  }
};
