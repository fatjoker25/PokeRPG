/* ============================================================
   MERCADO E TROCAS — cada cidade vende o que cada cidade é
   ============================================================ */

/* Preço de referência. A cidade mexe nisso pra cima ou pra baixo. */
const PRECO_BASE = {
  'Poké Ball':200, 'Great Ball':600, 'Ultra Ball':1200,
  'Potion':300, 'Super Potion':700, 'Hyper Potion':1500,
  'Revive':1500, 'Antidote':250, 'Full Heal':600,
  'Bandagem':400, 'Ração':200, 'Água Fresca':250, 'Cantil':500,
  'Éter':900, 'Elixir':2000, 'Boneco':700, 'Repelente':400,
  'Corda':450, 'Lanterna':600, 'Pilha':180, 'Isca':150, 'Machado':900, 'Picareta':1100,
  'Máscara de pó':300, 'Bota de borracha':900, 'Cobertor térmico':1100,
  'Câmera descartável':800, 'Caderno de campo':350, 'Mapa de Kanto':600, 'Relógio':1500,
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
  viridian: {
    nome:'Loja de Viridian',
    ar:'Fachada sem graça, prateleira organizada, e a atendente sabe exatamente o que um treinador de três dias esqueceu de comprar.',
    mult:1.0,
    itens:['Poké Ball','Potion','Antidote','Corda','Bandagem','Isca','Ração','Pilha','Cantil','Mapa de Kanto','Relógio','Mochila Verde','Bolsa Cinza']
  },
  pewter: {
    nome:'Casa de Ferragens Hawthorn',
    ar:'Vende mais equipamento de escalada que item de treinador. A dona explica que é questão de demanda: aqui todo mundo trabalha em pedra.',
    mult:1.15,
    itens:['Ração','Poké Ball','Potion','Antidote','Corda','Lanterna','Pilha','Machado','Picareta','Máscara de pó','Bandagem','Caderno de campo','Punho de Ferro','Colete de Lona','Mochila Marrom']
  },
  cerulean: {
    nome:'Balcão da Ponte Sul',
    ar:'Atende pela janela, sem ninguém entrar. Tem geladeira de bebida e uma vitrine pequena com uma pedra azul que fica ali há anos.',
    mult:1.05,
    itens:['Ração','Poké Ball','Potion','Antidote','Repelente','Água Fresca','Isca','Pedra da Água','Botina Leve','Sino Calmante']
  },
  vermilion: {
    nome:'Armazém do Cais',
    ar:'Abre às cinco da manhã e vende comida, corda e Pokébola no mesmo balcão. Metade do estoque é importado e entra sem imposto por um caminho que ninguém comenta.',
    mult:0.9,
    itens:['Ração','Poké Ball','Potion','Super Potion','Antidote','Repelente','Bota de borracha','Cobertor térmico','Câmera descartável','Relógio','Corda','Cantil','Faixa Firme','Resto de Ração','Mochila Laranja','Bolsa Prateada']
  },
  lavender: {
    nome:'Casa Boa Memória',
    ar:'Vende incenso, vela e Potion no mesmo balcão, o que faz um sentido triste. Ninguém aqui vende repelente: ninguém daqui vai pro mato.',
    mult:1.1,
    itens:['Great Ball','Potion','Super Potion','Revive','Antidote','Corda','Bandagem','Caderno de campo','Ração','Sino Calmante']
  },
  celadon: {
    nome:'Grande Loja de Celadon',
    ar:'Sete andares, escada rolante nos dois sentidos e uma voz gravada que anuncia o andar em duas línguas. É o lugar mais barato de Kanto e o que menos te olha na cara.',
    mult:0.85,
    andares:[
      {n:1, nome:'Térreo · Atendimento',
       ar:'Balcão de informações, guarda-volumes e um mapa dos andares em acrílico com uma seta que diz VOCÊ ESTÁ AQUI e está no andar errado.',
       itens:['Mapa de Kanto','Relógio','Caderno de campo','Pilha','Câmera descartável']},
      {n:2, nome:'2º · Artigos de treinador',
       ar:'Prateleira de Pokébola do chão ao teto, organizada por preço e não por tipo, o que irrita quem entende e ajuda quem não entende. No fundo, um expositor giratório de discos de TM com um cadeado que ninguém lembra a senha.',
       itens:['Poké Ball','Great Ball','Repelente','Boneco','Corda','Isca',
              'TM01 Mega Punch','TM05 Mega Kick','TM07 Horn Drill','TM09 Take Down','TM17 Submission','TM18 Counter','TM32 Double Team','TM33 Reflect','TM11 Sunny Day','TM18 Rain Dance','TM37 Sandstorm']},
      {n:3, nome:'3º · Cuidados',
       ar:'Cheiro de farmácia. Tem uma funcionária de jaleco que explica a diferença entre Potion e Super Potion umas quarenta vezes por dia e não perdeu a paciência ainda.',
       itens:['Potion','Super Potion','Antidote','Revive','Bandagem','Éter','Elixir','PP Up']},
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
    itens:['Poké Ball','Great Ball','Potion','Super Potion','Revive','Antidote','Éter','Elixir','Boneco','Repelente','Ração','Mapa de Kanto','Relógio',
           'TM01 Mega Punch','TM05 Mega Kick','TM07 Horn Drill','TM09 Take Down','TM17 Submission','TM18 Counter','TM32 Double Team','TM33 Reflect','TM11 Sunny Day','TM18 Rain Dance','TM37 Sandstorm',
           'Pedra do Fogo','Pedra da Água','Pedra do Trovão','Pedra da Folha',
           'Resto de Ração','Faixa Firme','Punho de Ferro','Óculos Grossos','Colete de Lona','Botina Leve','Sino Calmante','Amuleto de Moeda','Mochila Preta','Mochila Vermelha','Mochila Azul','Mochila Amarela','Bolsa Roxa','Bolsa Branca','Bolsa Rosa','Bolsa Dourada','PP Up','Exp. Share']
  },
  fuchsia: {
    nome:'Posto da Zona Safári',
    ar:'Vende mais repelente que Poké Ball, e tem um cartaz explicando por quê. A fila é de gente de bermuda com chapéu novo.',
    mult:1.0,
    itens:['Ração','Poké Ball','Great Ball','Ultra Ball','Super Potion','Revive','Full Heal','Repelente','Isca','Máscara de pó','Corda','Machado','Água Fresca','Mapa de Kanto','Antidote','Resto de Ração']
  },
  saffron: {
    nome:'Conveniência Silph — térreo',
    ar:'Fica no térreo de um prédio comercial e tem fila de gente de crachá na hora do almoço. Tudo é caro e tudo tem nota fiscal.',
    mult:1.3,
    itens:['Ração','Great Ball','Super Potion','Hyper Potion','Full Heal','Revive','Repelente','Corda','Elixir','Éter','Caderno de campo','Câmera descartável','Relógio','Óculos Grossos','Amuleto de Moeda','Mochila Preta','Bolsa Cinza']
  },
  cinnabar: {
    nome:'Vitrine da Sra. Juna',
    ar:'É uma casa com uma vitrine. A dona atende de chinelo e leva tudo o que chega de barco, o que quer dizer que às vezes falta tudo.',
    mult:1.25,
    itens:['Ração','Great Ball','Ultra Ball','Hyper Potion','Revive','Full Heal','Repelente','Corda','Cobertor térmico','Bandagem','Pedra do Fogo','Punho de Ferro']
  }
};

/* Balcões que não são de cidade: abrem num dia marcado (js/story/agenda.js). */
LOJAS.bazar_celadon = {
  nome:'Bazar de domingo',
  ar:'Doze barracas de lona no terraço da Grande Loja, com coisa que chegou de barco, coisa de herança e coisa que ninguém sabe de onde veio. Ninguém dá nota.',
  mult:1.1,
  itens:['Ração','Moon Stone','PP Up','Elixir','Ultra Ball','Hyper Potion','Amuleto de Moeda','Exp. Share','Relógio','Cobertor térmico']
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
    memoria:'Trocou o Meowth dele por um Rattata seu, por causa do sogro.',
    alt:[
      {da:{dex:46, nivel:[14,18], apelido:'Chapéu', natureza:'Jolly'},
       fala:'"Eu preciso de um Rattata. Sério. Meu sogro tem alergia a Paras e eu tenho um Paras."',
       memoria:'Trocou o Paras dele por um Rattata seu, por causa do sogro.'},
      {da:{dex:23, nivel:[14,18], apelido:'Cinto', natureza:'Jolly'},
       fala:'"Eu preciso de um Rattata. Sério. Meu sogro tem pavor de Ekans e eu tenho um Ekans."',
       memoria:'Trocou o Ekans dele por um Rattata seu, por causa do sogro.'}
    ]
  }],
  cerulean: [{
    id:'cerulean_1',
    quem:'Beatrix, da escola de natação',
    onde:'na borda rasa, depois da aula das crianças',
    pede:61, da:{dex:86, nivel:[24,28], apelido:'Bolha', natureza:'Calm'},
    fala:'"Meu Seel não gosta de água parada. Ele nasceu aqui e ele odeia piscina, dá pra acreditar?"',
    depois:'Ela leva o Poliwhirl pra piscina rasa e as crianças gritam de alegria, e é o som mais alto que essa cidade produziu o mês inteiro.',
    memoria:'Trocou o Seel dela pelo seu Poliwhirl, na escola de natação.',
    alt:[
      {da:{dex:54, nivel:[22,26], apelido:'Toca', natureza:'Calm'},
       fala:'"Meu Psyduck tem dor de cabeça na piscina. É o cloro, eu acho. Ele nasceu aqui e não aguenta piscina, dá pra acreditar?"',
       memoria:'Trocou o Psyduck dela pelo seu Poliwhirl, na escola de natação.'},
      {da:{dex:116, nivel:[22,26], apelido:'Rabisco', natureza:'Calm'},
       fala:'"Meu Horsea não gosta de água parada. Ele nasceu no mar e ele odeia piscina, dá pra acreditar?"',
       memoria:'Trocou o Horsea dela pelo seu Poliwhirl, na escola de natação.'}
    ]
  }],
  lavender: [{
    id:'lavender_1', unica:true,
    quem:'o zelador da torre',
    onde:'no primeiro andar, entre as velas',
    pede:104, da:{dex:42, nivel:[24,28], apelido:'Sete', natureza:'Quiet'},
    fala:'"Tem um Golbat que mora no sétimo andar e que quer ir embora daqui. Eu não sei explicar como eu sei. Eu sei."\n"E ele quer o quê?"\n"Ele quer um Cubone. Não me pergunta por quê."',
    depois:'O zelador leva o Cubone pra dentro do terceiro andar e volta sem ele, e não explica, e você decide não perguntar.',
    memoria:'Trocou um Cubone pelo Golbat do sétimo andar da Torre.'
  }, {
    id:'lavender_2', requer:d=>numInsignias() >= 5, unica:true,
    quem:'a senhora de luto do primeiro andar',
    onde:'no banco de pedra da entrada da Torre, sempre no mesmo horário',
    pede:35, da:{dex:105, nivel:[30,34], apelido:'Dezenove', natureza:'Sassy'},
    fala:'"Esse Marowak acompanha gente até o terceiro andar e volta sozinho. Todo dia. Há dezenove meses."\n"E a senhora quer um Clefairy."\n"Eu quero uma coisa que suba comigo e que desça comigo, e não uma que fique."',
    depois:'Ela sobe com o Clefairy no colo e desce com o Clefairy no colo, e no dia seguinte sobe de novo, e é a primeira vez em dezenove meses que ela sobe com companhia.',
    memoria:'Trocou o Marowak da Torre pelo seu Clefairy. Ela queria uma companhia que descesse junto.'
  }],
  saffron:  [{
    id:'saffron_1', unica:true,
    quem:'uma mulher de crachá azul',
    onde:'na praça de alimentação, na hora do almoço, sozinha',
    pede:122, da:{dex:97, nivel:[30,34], apelido:'Sete e meia', natureza:'Modest'},
    fala:'"Eu tenho um Hypno e eu não consigo mais dormir do lado dele."\n"Por quê?"\n"Porque ele sabe o que eu sonho e eu trabalho onde eu trabalho."',
    depois:'Ela pega o Mr. Mime e vai embora sem terminar o almoço, e você repara que a bandeja dela estava intacta desde o começo.',
    memoria:'Trocou o Hypno dela pelo seu Mr. Mime, na praça de alimentação. Ela não queria mais alguém lendo o que ela sonha.'
  }],

/* ─── na estrada: quem troca por estar de passagem ─── */
  rota1: [{
    id:'rota1_1', requer:d=>numInsignias() >= 2,
    quem:'a mulher do varal',
    onde:'sentada na mureta da Rota 1, com a sacola de compras no colo, esperando a carona das quatro',
    pede:16, da:{dex:19, nivel:[14,18], apelido:'Senhor', natureza:'Jolly'},
    fala:'"O Senhor mora embaixo da minha casa há seis anos e nunca foi de ninguém."\n"E a senhora quer um Pidgey?"\n"Eu quero uma coisa que voe. A vizinha tem um. Eu quero um também. Eu tenho sessenta e dois anos e eu posso querer o que eu quiser."',
    depois:'Ela chama o Pidgey de Senhor também, no mesmo dia, sem transição nenhuma, e ninguém na rua acha isso estranho.',
    memoria:'Trocou o Rattata que morava embaixo da casa dela por um Pidgey seu. Ela chama os dois de Senhor.',
    alt:[
      {da:{dex:27, nivel:[16,20], apelido:'Senhor', natureza:'Jolly'},
       memoria:'Trocou o Sandshrew que morava embaixo da casa dela por um Pidgey seu. Ela chama os dois de Senhor.'},
      {da:{dex:52, nivel:[16,20], apelido:'Senhor', natureza:'Jolly'},
       memoria:'Trocou o Meowth que morava embaixo da casa dela por um Pidgey seu. Ela chama os dois de Senhor.'}
    ]
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
  /* o contrário do Arlo: quem tem Graveler e quer Machoke. A troca
     completa o Graveler na sua mão, e é o único jeito de ter Golem */
  rota9: [{
    id:'rota9_1', requer:d=>numInsignias() >= 4,
    quem:'Dara da pedreira',
    onde:'na descida da Rota 10, sentada num caixote de ferramenta, com um Graveler parado do lado feito pedra de enfeite',
    pede:67, da:{dex:75, nivel:[30,34], apelido:'Pedregulho', natureza:'Relaxed'},
    trocaEvolui:true,
    fala:'"Esse Graveler rola ladeira abaixo toda vez que eu viro as costas. Eu preciso de braço, não de pedra."\nEla olha o seu cinto antes de olhar a sua cara.\n"Você tem Machoke?"',
    depois:'Ela põe o Machoke pra carregar o primeiro caixote antes de você guardar a Pokébola. Ele carrega dois, e ela ri pela primeira vez na conversa.',
    memoria:'Trocou um Graveler pelo seu Machoke na descida da Rota 10.'
  }],
  monte_lua: [{
    id:'monte_1', unica:true, requer:d=>numInsignias() >= 4,
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
    depois:'Ele guarda o Krabby na caixa térmica com o pano molhado por cima, do jeito certo, e você entende que ele nunca ia vender aquele.',
    memoria:'Trocou um Shellder pelo seu Krabby, na pedra do quebra-mar.',
    alt:[
      {da:{dex:72, nivel:[22,26], apelido:'Tampa', natureza:'Impish'},
       fala:'"Eu acho Tentacool demais e Krabby quase nunca. Você troca? É troca de igual, eu não tô querendo levar vantagem."',
       memoria:'Trocou um Tentacool pelo seu Krabby, na pedra do quebra-mar.'},
      {da:{dex:116, nivel:[22,26], apelido:'Tampa', natureza:'Impish'},
       fala:'"Eu acho Horsea demais e Krabby quase nunca. Você troca? É troca de igual, eu não tô querendo levar vantagem."',
       memoria:'Trocou um Horsea pelo seu Krabby, na pedra do quebra-mar.'}
    ]
  }],
  rota12: [{
    id:'rota12_1', requer:d=>numInsignias() >= 4,
    quem:'o contramestre do Anne',
    onde:'de folga, pescando na Rota 12, de camisa para fora da calça',
    pede:72, da:{dex:129, nivel:[15,19], apelido:'Sobra', natureza:'Rash'},
    fala:'"Eu peguei esse Magikarp no cais e criei ele num balde na cabine. Um dia ele vira Gyarados, e Gyarados não cabe no navio."\n"E o senhor quer um Tentacool."\n"Eu quero uma coisa que caiba na cabine pra sempre. Só isso. Eu tô velho."',
    depois:'O Magikarp sai da Pokébola no cais uma última vez e pula duas vezes no lugar, e o contramestre não olha pra ele nem uma vez.',
    memoria:'Trocou o Magikarp do contramestre do Anne por um Tentacool seu.',
    alt:[
      {da:{dex:118, nivel:[28,32], apelido:'Sobra', natureza:'Rash'},
       fala:'"Eu pesquei esse Goldeen e criei ele no aquário da cabine, e ele bate o chifre no vidro a noite inteira."\n"E o senhor quer um Tentacool."\n"Eu quero uma coisa que durma. Só isso. Eu tô velho."',
       depois:'O Goldeen sai da Pokébola no cais uma última vez e bate o rabo na água uma vez só, e o contramestre não olha pra ele nem uma vez.',
       memoria:'Trocou o Goldeen do contramestre do Anne por um Tentacool seu.'},
      {da:{dex:98, nivel:[22,27], apelido:'Sobra', natureza:'Rash'},
       fala:'"Esse Krabby subiu a bordo em Vermilion e não desceu mais. Ele corta as amarras de noite."\n"E o senhor quer um Tentacool."\n"Eu quero uma coisa que não corte nada. Só isso. Eu tô velho."',
       depois:'O Krabby sai da Pokébola no cais uma última vez e belisca, por despedida, a última amarra do píer, e o contramestre não olha pra ele nem uma vez.',
       memoria:'Trocou o Krabby do contramestre do Anne por um Tentacool seu.'}
    ]
  }],
  rota7: [{
    id:'rota7_1',
    quem:'a florista do térreo',
    onde:'na Rota 7, colhendo alguma coisa na beira da estrada com um balde',
    pede:29, da:{dex:32, nivel:[12,15], apelido:'Espeto', natureza:'Naughty'},
    fala:'"Eu tenho macho, você tem fêmea. Eu não vou explicar melhor que isso, {moço|moça}, eu tenho quarenta e três anos e eu trabalho com planta."',
    depois:'Ela põe o Nidoran♀ numa caixa de papelão com furo e um pratinho de água e sai carregando pelo corredor de serviço, falando com ela o caminho inteiro.',
    memoria:'Trocou o Nidoran♂ dela pelo seu Nidoran♀, na banca de flor.',
    alt:[
      {da:{dex:43, nivel:[16,20], apelido:'Espeto', natureza:'Naughty'},
       fala:'"Eu tenho um Oddish que acha que é muda e fica plantado no meio da banca. Você tem uma Nidoran fêmea. Eu não vou explicar melhor que isso, {moço|moça}, eu trabalho com planta."',
       memoria:'Trocou o Oddish que se plantava na banca dela pelo seu Nidoran♀.'},
      {da:{dex:69, nivel:[16,20], apelido:'Espeto', natureza:'Naughty'},
       fala:'"Eu tenho um Bellsprout que come as minhas mudas antes de eu vender. Você tem uma Nidoran fêmea. Eu não vou explicar melhor que isso, {moço|moça}, eu trabalho com planta."',
       memoria:'Trocou o Bellsprout que comia as mudas dela pelo seu Nidoran♀, na banca de flor.'}
    ]
  }],
  rota16: [{
    id:'rota16_1',
    quem:'um guarda-parque de folga',
    onde:'na cerca leste da Rota 16, do lado de fora, de roupa comum',
    pede:102, da:{dex:84, nivel:[24,28], apelido:'Seu Doduo', natureza:'Gentle'},
    fala:'"Você acha que eu tô bêbado e eu tô, mas escuta: eu troco esse Doduo por um Exeggcute e eu não tô te enganando. Ele é bom demais pra mim. Eu durmo em alojamento."',
    depois:'No dia seguinte, sóbrio, ele te procura no Centro Pokémon. Você acha que ele vai voltar atrás. Ele só quer saber se o Doduo comeu.',
    memoria:'Trocou o Doduo dele pelo seu Exeggcute. No dia seguinte ele foi perguntar se ele tinha comido.',
    alt:[
      {da:{dex:128, nivel:[26,30], apelido:'Seu Tauros', natureza:'Gentle'},
       fala:'"Você acha que eu tô bêbado e eu tô, mas escuta: eu troco esse Tauros por um Exeggcute e eu não tô te enganando. Ele é bom demais pra mim. Eu durmo em alojamento."',
       depois:'No dia seguinte, sóbrio, ele te procura no Centro Pokémon. Você acha que ele vai voltar atrás. Ele só quer saber se o Tauros comeu.',
       memoria:'Trocou o Tauros dele pelo seu Exeggcute. No dia seguinte ele foi perguntar se ele tinha comido.'},
      {da:{dex:111, nivel:[26,30], apelido:'Seu Rhyhorn', natureza:'Gentle'},
       fala:'"Você acha que eu tô bêbado e eu tô, mas escuta: eu troco esse Rhyhorn por um Exeggcute e eu não tô te enganando. Ele é bom demais pra mim. Eu durmo em alojamento."',
       depois:'No dia seguinte, sóbrio, ele te procura no Centro Pokémon. Você acha que ele vai voltar atrás. Ele só quer saber se o Rhyhorn comeu.',
       memoria:'Trocou o Rhyhorn dele pelo seu Exeggcute. No dia seguinte ele foi perguntar se ele tinha comido.'}
    ]
  }],
  rota21: [{
    id:'rota21_1',
    quem:'o dono da pousada',
    onde:'na Rota 21, esperando a balsa, com uma mala e uma Pokébola',
    pede:77, da:{dex:109, nivel:[28,32], apelido:'Brasa', natureza:'Brave'},
    fala:'"Esse Koffing apareceu na cratera há dois anos e não foi mais embora. Ele dorme na minha lavanderia e a roupa dos hóspedes sai com cheiro de vulcão."',
    depois:'Ele solta o Ponyta na encosta e o Ponyta fica parado olhando o mar por muito tempo, do jeito de quem nunca viu tanta água junta.',
    memoria:'Trocou o Koffing da lavanderia dele pelo seu Ponyta.',
    alt:[
      {da:{dex:58, nivel:[30,34], apelido:'Brasa', natureza:'Brave'},
       fala:'"Esse Growlithe apareceu na cratera há dois anos e não foi mais embora. Ele dorme na minha lavanderia. Eu não posso mais pagar a conta de luz do ventilador."',
       memoria:'Trocou o Growlithe da lavanderia dele pelo seu Ponyta.'},
      {da:{dex:37, nivel:[30,34], apelido:'Brasa', natureza:'Brave'},
       fala:'"Esse Vulpix apareceu na cratera há dois anos e não foi mais embora. Ele dorme na minha lavanderia. Eu não posso mais pagar a conta de luz do ventilador."',
       memoria:'Trocou o Vulpix da lavanderia dele pelo seu Ponyta.'}
    ]
  }],
  rota24: [{
    id:'rota24_1', requer:d=>numInsignias() >= 5,
    quem:'o rapaz da Rota 25',
    onde:'na varanda da casa dele, na ponta da Rota 25, em cima de quatro cadernos empilhados',
    pede:25, da:{dex:120, nivel:[22,26], apelido:'Vírgula', natureza:'Timid'},
    fala:'"Eu estudo Staryu há seis anos e eu nunca vi um evoluir na minha frente. Nunca."\n"E o Pikachu?"\n"Pikachu eu já vi evoluir. Eu quero uma coisa que eu já entenda, pra poder pensar em outra."',
    depois:'Ele anota a hora exata em que o Pikachu entra na Pokébola, em quatro cadernos diferentes, porque ele é assim e ninguém nunca conseguiu mudar isso.',
    memoria:'Trocou o Staryu do pesquisador da Rota 25 pelo seu Pikachu.',
    alt:[
      {da:{dex:35, nivel:[22,26], apelido:'Vírgula', natureza:'Timid'},
       fala:'"Eu estudo Clefairy há seis anos e eu nunca vi um evoluir na minha frente. Nunca."\n"E o Pikachu?"\n"Pikachu eu já vi evoluir. Eu quero uma coisa que eu já entenda, pra poder pensar em outra."',
       memoria:'Trocou a Clefairy do pesquisador da Rota 25 pelo seu Pikachu.'},
      {da:{dex:37, nivel:[22,26], apelido:'Vírgula', natureza:'Timid'},
       fala:'"Eu estudo Vulpix há seis anos e eu nunca vi um evoluir na minha frente. Nunca."\n"E o Pikachu?"\n"Pikachu eu já vi evoluir. Eu quero uma coisa que eu já entenda, pra poder pensar em outra."',
       memoria:'Trocou o Vulpix do pesquisador da Rota 25 pelo seu Pikachu.'}
    ]
  }],
  rota19: [{
    id:'rota19_1', requer:d=>numInsignias() >= 6,
    quem:'a médica de Pokémon da reserva',
    onde:'na beira da Rota 19, lavando material numa bacia, com a camionete aberta',
    pede:115, da:{dex:127, nivel:[32,36], apelido:'Alicate', natureza:'Adamant'},
    fala:'"Esse Pinsir entra em qualquer briga que acontecer num raio de cinquenta metros. Qualquer uma. Inclusive as minhas."\n"E a Kangaskhan?"\n"Kangaskhan separa briga. Você não imagina o que isso vale aqui dentro."',
    depois:'A Kangaskhan atravessa o pátio do setor 3 e três brigas param sozinhas antes de ela chegar perto, e a médica fica olhando aquilo com uma cara de quem acabou de ganhar na loteria.',
    memoria:'Trocou o Pinsir da reserva pela sua Kangaskhan. Kangaskhan separa briga.',
    alt:[
      {da:{dex:111, nivel:[32,36], apelido:'Alicate', natureza:'Adamant'},
       fala:'"Esse Rhyhorn entra em qualquer briga que acontecer num raio de cinquenta metros. Qualquer uma. Inclusive as minhas."\n"E a Kangaskhan?"\n"Kangaskhan separa briga. Você não imagina o que isso vale aqui dentro."',
       memoria:'Trocou o Rhyhorn da reserva pela sua Kangaskhan. Kangaskhan separa briga.'},
      {da:{dex:128, nivel:[32,36], apelido:'Alicate', natureza:'Adamant'},
       fala:'"Esse Tauros entra em qualquer briga que acontecer num raio de cinquenta metros. Qualquer uma. Inclusive as minhas."\n"E a Kangaskhan?"\n"Kangaskhan separa briga. Você não imagina o que isso vale aqui dentro."',
       memoria:'Trocou o Tauros da reserva pela sua Kangaskhan. Kangaskhan separa briga.'}
    ]
  }],
  caminho_vitoria: [{
    id:'vitoria_1', requer:d=>numInsignias() >= 7,
    quem:'o mestre do dojo',
    onde:'sentado numa pedra do Caminho da Vitória, sem pressa nenhuma de chegar',
    pede:68, da:{dex:107, nivel:[34,38], apelido:'Terceiro', natureza:'Careful'},
    fala:'"Meu Hitmonchan perdeu três vezes seguidas pro mesmo garoto e decidiu que o problema é ele."\n"E não é?"\n"O problema sou eu. Mas ele não acredita, e eu não consigo mais ensinar quem não acredita em mim."',
    depois:'O Machamp fica de pé no meio do tatame e o dojo inteiro para pra olhar, e o mestre se curva pra ele, e é a primeira coisa que ele faz naquele tatame em seis anos que não é ensinar.',
    memoria:'Trocou o Hitmonchan do dojo de Saffron pelo seu Machamp.',
    alt:[
      {da:{dex:106, nivel:[34,38], apelido:'Terceiro', natureza:'Careful'},
       fala:'"Meu Hitmonlee perdeu três vezes seguidas pro mesmo garoto e decidiu que o problema é ele."\n"E não é?"\n"O problema sou eu. Mas ele não acredita, e eu não consigo mais ensinar quem não acredita em mim."',
       memoria:'Trocou o Hitmonlee do dojo de Saffron pelo seu Machamp.'},
      {da:{dex:66, nivel:[24,27], apelido:'Terceiro', natureza:'Careful'},
       fala:'"Meu Machop perdeu três vezes seguidas pro mesmo garoto e decidiu que o problema é ele."\n"E não é?"\n"O problema sou eu. Mas ele não acredita, e eu não consigo mais ensinar quem não acredita em mim."',
       memoria:'Trocou o Machop do dojo de Saffron pelo seu Machamp.'}
    ]
  }],
  rota23: [{
    id:'rota23_1', requer:d=>numInsignias() >= 3,
    quem:'a guarda florestal do posto 2',
    onde:'na terceira guarita da Rota 23, no fim do turno dela',
    pede:12, da:{dex:123, nivel:[26,30], apelido:'Foice', natureza:'Adamant'},
    fala:'"Esse Scyther apareceu ferido na trilha em março e a gente tratou, e agora ele não vai embora e não pode ficar."\n"Por que não pode?"\n"Porque isso aqui é posto de guarda, não é casa de ninguém. Inclusive minha."',
    depois:'Ela solta o Butterfree no meio da clareira e ele sobe em espiral e fica lá em cima um tempo, e ela olha pra cima até doer o pescoço.',
    memoria:'Trocou o Scyther do posto de guarda pelo seu Butterfree.',
    alt:[
      {da:{dex:127, nivel:[26,30], apelido:'Foice', natureza:'Adamant'},
       fala:'"Esse Pinsir apareceu ferido na trilha em março e a gente tratou, e agora ele não vai embora e não pode ficar."\n"Por que não pode?"\n"Porque isso aqui é posto de guarda, não é casa de ninguém. Inclusive minha."',
       memoria:'Trocou o Pinsir do posto de guarda pelo seu Butterfree.'},
      {da:{dex:83, nivel:[26,30], apelido:'Foice', natureza:'Adamant'},
       fala:'"Esse Farfetch\'d apareceu ferido na trilha em março e a gente tratou, e agora ele não vai embora e não pode ficar."\n"Por que não pode?"\n"Porque isso aqui é posto de guarda, não é casa de ninguém. Inclusive minha."',
       memoria:'Trocou o Farfetch\'d do posto de guarda pelo seu Butterfree.'}
    ]
  }],
  rota13: [{
    id:'rota13_1', requer:d=>numInsignias() >= 6,
    quem:'o vendedor do quarto andar',
    onde:'acampado na Rota 13, de férias, com um rádio e um guarda-sol',
    pede:137, da:{dex:132, nivel:[24,28], apelido:'Cópia', natureza:'Hardy'},
    fala:'"Eu tenho um Ditto e um Ditto é a coisa mais inútil que existe pra quem trabalha com etiqueta."\n"Por quê?"\n"Porque ele copia a etiqueta. Você não faz ideia do prejuízo que isso deu."',
    depois:'Ele liga o Porygon no terminal da loja e o Porygon organiza o estoque inteiro em quarenta minutos, e ele chora um pouquinho e fala que é do ar-condicionado.',
    memoria:'Trocou o Ditto do vendedor de Celadon pelo seu Porygon.',
    alt:[
      {da:{dex:81, nivel:[24,28], apelido:'Ímã', natureza:'Hardy'},
       fala:'"Eu tenho um Magnemite e um Magnemite é a coisa mais inútil que existe pra quem trabalha com etiqueta."\n"Por quê?"\n"Porque ele apaga a tarja magnética de tudo que passa perto. Você não faz ideia do prejuízo que isso deu."',
       memoria:'Trocou o Magnemite do vendedor de Celadon pelo seu Porygon.'},
      {da:{dex:100, nivel:[24,28], apelido:'Bola', natureza:'Hardy'},
       fala:'"Eu tenho um Voltorb e um Voltorb é a coisa mais inútil que existe pra quem trabalha com loja de Pokébola."\n"Por quê?"\n"Porque o cliente pega ele pra comprar. Você não faz ideia do prejuízo que isso deu."',
       memoria:'Trocou o Voltorb do vendedor de Celadon pelo seu Porygon.'}
    ]
  }],
  rota3: [{
    id:'rota3_1', unica:true, requer:d=>numInsignias() >= 7,
    quem:'a moça da vitrine',
    onde:'na Rota 3, voltando de Pewter a pé, com uma caixa térmica debaixo do braço',
    pede:139, da:{dex:141, nivel:[34,38], apelido:'Tesoura', natureza:'Brave'},
    fala:'"Chegou um Kabutops de fóssil no lote do mês passado e ninguém veio buscar."\n"E ninguém vai?"\n"O endereço do formulário é de uma casa que queimou. Eu não vou deixar ele numa gaveta por causa disso."',
    depois:'Ela põe o Omastar no aquário da vitrine, que é o melhor ponto da ilha, e o Omastar passa o resto do dia olhando gente passar na calçada.',
    memoria:'Trocou um Kabutops que ninguém foi buscar por um Omastar seu.'
  }]
};

/* quem já trocou com você e quer trocar de novo */
const FALAS_DE_TROCA_NOVA = [
  'Você de novo! Eu tava torcendo pra você passar.',
  'Tenho outra. Juro que essa é boa.',
  'Eu fiquei pensando na última troca a semana inteira. Vamos fazer mais uma?',
  'Olha quem voltou. Senta aí, que eu tenho proposta.',
  'Troca boa é igual conversa boa: a segunda é melhor que a primeira.'
];

/* Quem troca com você passa o número: dá pra ligar e perguntar como
   está o Pokémon que foi com ela. */
function contatosDasTrocas(){
  if (typeof TROCAS === 'undefined') return [];
  const lista = [];
  for (const grupo of Object.values(TROCAS)){
    for (const t of (Array.isArray(grupo) ? grupo : [grupo])){
      const nome = t.quem.split(',')[0].trim();
      lista.push({
        id:'tr_' + t.id, tipo:'figura', nome:nome.charAt(0).toUpperCase() + nome.slice(1), papel:'',
        cidade:d => { const f = (d.trocasFeitas || {})[t.id]; return f && LOCAIS[f.cidade] ? LOCAIS[f.cidade].nome : ''; },
        requer:d => Trocas.jaFez(t.id),
        oferece:['prova'],
        prova:{
          rotulo:'Perguntar como ele está',
          esperaCap:0, limite:99,
          texto:d => {
            const f = (d.trocasFeitas || {})[t.id] || {};
            const dex = f.ultimoDeu || f.deu;
            const esp = DEX[dex] ? DEX[dex].nome : 'Pokémon';
            /* e sabe o que foi com você: o que ela deu */
            const rec = DEX[f.recebeu || Trocas.efetiva(t).da.dex];
            return Dados.escolher(COMO_ESTA_O_TROCADO).map(l => fala(nome, l.replace(/\{p\}/g, esp)))
              .concat(rec ? [fala(nome, Dados.escolher(E_O_QUE_FOI_COM_VOCE).replace(/\{r\}/g, rec.nome))] : []);
          },
          rep:{eixo:'bom', delta:1, motivo:`Ligou pra saber do Pokémon que trocou com ${nome}`}
        }
      });
    }
  }
  return lista;
}
const COMO_ESTA_O_TROCADO = [
  ['O {p}? Tá ótimo. Dorme em cima da geladeira e ninguém tem coragem de tirar.', 'Obrigad{o|a} por ligar. Sério.'],
  ['Ele comeu o almoço do meu irmão hoje. O {p}, não o meu irmão.', 'Tá feliz. Dá pra ver.'],
  ['O {p} aprendeu a abrir a porta do quintal. Eu ainda não sei como.', 'Tá bem demais.'],
  ['Levei o {p} no Centro pra um check-up. A enfermeira disse que tá forte.', 'Você cuidou bem dele antes. Ela percebeu.'],
  ['Ele sente falta de você um pouquinho. Fica olhando a estrada de tarde.', 'Mas brinca o dia inteiro. Fica tranquil{o|a}.'],
  ['O {p} tá treinando com as crianças da rua. Já ganhou duas lutinhas.', 'Eu fico na torcida, igual criança.']
];

const E_O_QUE_FOI_COM_VOCE = [
  'E o {r}? Cuida dele, que ele foi meu antes de ser seu.',
  'E o {r}, tá comendo direito? Ele era chato pra comer.',
  'Você ainda tem o {r}? Não precisa responder. Eu só pensei nele hoje.',
  'Manda um oi pro {r}. Ele não vai entender, mas manda.',
  'O {r} ainda faz aquilo de dormir de olho aberto? Fazia aqui.'
];

const TROCAS_POR_DIA = 3;
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
  disponiveis(id){ return this.lista(id).filter(t => !this.jaFez(t.id) || this.oferta(t)); },
  /* Troca de história com um Pokémon que só existe uma vez (o Golbat da
     Torre, o Hypno da praça, o Machoke da pedreira, o Marowak da
     senhora, os fósseis) acontece uma vez só: depois dela a pessoa não
     vira gente que troca. O resto troca de novo todo dia. */
  repete(t){ return false; },
  /* A troca de cada pessoa é uma só. Quem tem versões (alt) decide no
     primeiro contato qual Pokémon vai oferecer, e fica com essa: o
     jogador não escolhe, e a tela não conta que havia outras. */
  versao(t){
    if (!t || !t.alt || !t.alt.length) return 0;
    const d = Estado.dados;
    d.trocaVersao = d.trocaVersao || {};
    if (d.trocaVersao[t.id] == null) d.trocaVersao[t.id] = Dados.entre(0, t.alt.length);
    return d.trocaVersao[t.id];
  },
  efetiva(t){
    const i = this.versao(t);
    return i ? Object.assign({}, t, t.alt[i - 1]) : t;
  },

  /* A primeira troca de cada pessoa é a da história, fixa. Depois dela
     a pessoa vira gente comum que troca: uma proposta por dia, que ela
     escolhe entre três sorteadas dos Pokémon comuns — o que ela quer é
     comum por aqui, o que ela oferece é comum noutro canto de Kanto. O
     jogador não escolhe qual, e a tela não conta que houve sorteio. */
  oferta(t){
    if (!this.jaFez(t.id) || !this.repete(t)) return null;
    const d = Estado.dados;
    d.trocasExtra = d.trocasExtra || {};
    let o = d.trocasExtra[t.id];
    /* save de quando o jogador escolhia entre três: fica uma, a dela */
    if (o && o.pronta && o.opcoes && o.opcoes.length > 1){
      const e = Dados.escolher(o.opcoes); o.opcoes = [e]; o.pede = e.pede; o.da = e.da;
    }
    if (o && o.pronta) return o;
    const ultimo = o ? o.dia : (d.trocasFeitas[t.id] || {}).dia;
    if (ultimo != null && d.relogio.dia <= ultimo) return null;
    const cidade = (d.trocasFeitas[t.id] || {}).cidade || Mundo.id();
    const comuns = id => (ENCONTROS[id] || []).filter(([x, peso]) => peso >= 10 && DEX[x] && !DEX[x].lendario
      && !FOSSEIS.includes(x) && !DEX[x].preEvo).map(([x]) => x);
    const aqui = comuns(cidade);
    /* Haunter e Kadabra só vêm do Sr. Juniper: troca nenhuma dá alguém da linha deles */
    const SO_DO_JUNIPER = [63, 64, 65, 92, 93, 94];
    const outros = Object.keys(ENCONTROS).filter(k => k !== cidade).flatMap(comuns)
      .filter(x => !aqui.includes(x) && !SO_DO_JUNIPER.includes(x));
    if (!aqui.length || !outros.length) return null;
    const nv = (LOCAIS[cidade] || {nivel:10}).nivel;
    const opcoes = [], usados = new Set();
    for (let k = 0; k < 12 && opcoes.length < TROCAS_POR_DIA; k++){
      const pede = Dados.escolher(aqui);
      const da = Dados.escolher(outros.filter(x => x !== pede));
      if (!da || usados.has(pede + '>' + da) || opcoes.some(x => x.pede === pede)) continue;
      usados.add(pede + '>' + da);
      opcoes.push({pede, da:{dex:da, nivel:[Math.max(3, nv - 3), nv + 3]}});
    }
    if (!opcoes.length) return null;
    /* das propostas que ela tinha, quem decide qual vai ser é ela */
    const escolhida = Dados.escolher(opcoes);
    o = Object.assign({pronta:true, n:(o ? o.n : 0) + 1, dia:d.relogio.dia, opcoes:[escolhida]}, escolhida);
    d.trocasExtra[t.id] = o;
    return o;
  },
  /* save de antes das três: a oferta única vira lista de uma */
  opcoesDe(o){ return o ? (o.opcoes && o.opcoes.length ? o.opcoes : [{pede:o.pede, da:o.da}]) : []; },
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
    const feitas = this.lista(id).filter(t => this.jaFez(t.id) && !abertas.includes(t));
    /* já trocou: lembra o que deu, pelo nome da espécie que chegou na sua mão */
    const semTroca = t => {
      const f = (Estado.dados.trocasFeitas || {})[t.id] || {};
      const rec = DEX[f.recebeu || this.efetiva(t).da.dex];
      return `${t.quem} te vê de longe e levanta a mão. "E o ${rec ? rec.nome : 'meu'}? Cuida bem dele." O que tinha pra trocar já foi com você.`;
    };

    if (!abertas.length){
      if (feitas.length)
        return Exploracao.tela(feitas.map(t => ({tipo:'info', texto:semTroca(t)})));
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
            const ex = this.jaFez(x.id) ? this.oferta(x) : null, xe = this.efetiva(x);
            const resumo = ex ? `${this.opcoesDe(ex).length} troca${this.opcoesDe(ex).length > 1 ? 's' : ''} pra hoje`
                              : `quer um ${UI.esc(DEX[xe.pede].nome)}, oferece um ${UI.esc(DEX[xe.da.dex].nome)}`;
            return `<button class="escolha" onclick="Trocas.tela('${x.id}')">
              ${UI.esc(x.quem)} — ${resumo}</button>`;
          }).join('')}
          ${feitas.map(x => `<button class="escolha" disabled>
            ${UI.esc(x.quem)} — já trocado<br><span class="pd">${UI.esc(this.efetiva(x).memoria)}</span></button>`).join('')}
          <button class="escolha" onclick="Exploracao.tela()">Deixar pra depois.</button>
        </div>
      </div>`);
      return;
    }

    const extra = this.jaFez(t.id) ? this.oferta(t) : null;
    if (this.jaFez(t.id) && !extra)
      return Exploracao.tela([{tipo:'info', texto:semTroca(t)}]);

    const te = this.efetiva(t);
    const of = extra || te;
    const esp = DEX[of.da.dex], pedido = DEX[of.pede];
    const botoes = (op, i) => {
      const meus = Estado.dados.time.filter(p => p.dex === op.pede && !p.morto);
      return meus.length
        ? meus.map(p => `<button class="escolha" onclick="Trocas.fazer('${p.uid}','${t.id}',${i})">
            Trocar ${UI.esc(nomeExib(p))} (Nv ${p.nivel}) por um ${UI.esc(DEX[op.da.dex].nome)}
            <br><span class="pd">Isso não tem desfazer.</span></button>`).join('')
        : `<button class="escolha" disabled>Quer um ${UI.esc(DEX[op.pede].nome)}, dá um ${UI.esc(DEX[op.da.dex].nome)}
            <br><span class="pd">Você não tem nenhum ${UI.esc(DEX[op.pede].nome)} no time.</span></button>`;
    };
    const lista = extra
      ? this.opcoesDe(extra).map(botoes).join('')
      : botoes(te, 0);

    UI.limpar();
    UI.add(UI.topo());
    UI.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">troca</div>
        <div class="tit">${UI.esc(t.quem)}</div>
        <div class="loc">${UI.esc(t.onde)}</div>
      </div>
      <div class="narrativa">
        ${extra
          ? UI.narrarMonologo([`"${Dados.escolher(FALAS_DE_TROCA_NOVA)}"`,
              this.opcoesDe(extra).length > 1
                ? `"Hoje eu tenho ${this.opcoesDe(extra).length === 2 ? 'duas' : 'três'} coisas. Escolhe uma, que as outras eu levo pra casa."`
                : `"Eu tô atrás de um ${pedido.nome}. Em troca, eu tenho um ${esp.nome}."`], t.quem)
          : UI.narrar(te.fala.split('\n').map((l, i) =>
            i % 2 === 0 ? {quem:t.quem, diz:l.replace(/^"|"$/g,'')}
                        : {quem:Estado.j.nome, diz:l.replace(/^"|"$/g,'')}))}
        ${extra ? '' : `<p class="sussurro">Quer um ${UI.esc(pedido.nome)}. Oferece um ${UI.esc(esp.nome)}${te.da.apelido?` chamado ${UI.esc(te.da.apelido)}`:''}.</p>`}
      </div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas">
        ${lista}
        ${abertas.length > 1 ? `<button class="escolha" onclick="Trocas.tela()">Ver quem mais está querendo trocar.</button>` : ''}
        <button class="escolha" onclick="Exploracao.tela()">Deixar pra depois.</button>
      </div>
    </div>`);
  },

  fazer(uid, tid, qual){
    const id = Mundo.id();
    const t = tid ? this.porId(tid) : this.daCidade(id);
    const d = Estado.dados;
    const meu = d.time.find(p => p.uid === uid);
    if (!t || !meu) return;
    const extra = this.jaFez(t.id) ? this.oferta(t) : null;
    if (this.jaFez(t.id) && !extra) return;
    const of = extra ? (this.opcoesDe(extra)[qual || 0] || this.opcoesDe(extra)[0]) : this.efetiva(t);
    if (meu.dex !== of.pede) return;

    /* sai o seu */
    d.time = d.time.filter(p => p.uid !== uid);
    d.trocasFeitas = d.trocasFeitas || {};
    if (extra){
      extra.pronta = false; extra.dia = d.relogio.dia; extra.deu = meu.dex;
      d.trocasFeitas[t.id].ultimoDeu = meu.dex;
    } else d.trocasFeitas[t.id] = {cidade:id, deu:meu.dex, recebeu:of.da.dex, dia:d.relogio.dia};

    /* entra o dele */
    const nivel = Dados.entre(of.da.nivel[0], of.da.nivel[1]);
    let dexNovo = of.da.dex;
    let virou = null;
    if (!extra && t.trocaEvolui && evoluiPorTroca(dexNovo)){ virou = DEX[dexNovo].nome; dexNovo = evoluiPorTroca(dexNovo); }
    const novo = criarPokemon(dexNovo, nivel, {
      natureza: extra ? undefined : of.da.natureza,
      apelido: extra ? null : of.da.apelido,
      moral: 45,
      historia: `Veio de uma troca em ${LOCAIS[id].nome}, com ${t.quem}.`
    });
    novo.trocado = true;
    Estado.adicionar(novo);
    Estado.lembrarNPC(t.quem, {nome:t.quem, opiniao:3, memoria:of.memoria});
    d.trocasFeitas[t.id].recebeu = dexNovo;
    Estado.registrar(`Trocou ${meu.nome} por ${novo.nome} em ${LOCAIS[id].nome}.`);
    Estado.marcar('ja_trocou');
    Estado.salvar('auto');

    const avisos = [
      {tipo:'pokemon', texto:`${nomeExib(novo)} (Nv ${novo.nivel}) entrou para o seu time.`},
      {tipo:'eco', texto:extra ? `${t.quem} recebe o ${meu.nome} com as duas mãos e fala o nome dele baixinho, como quem decora.` : of.depois}
    ];
    if (typeof Jogo !== 'undefined' && Jogo.avisarNumeros) Jogo.avisarNumeros(avisos);
    if (virou) avisos.push({tipo:'evolucao', texto:`No segundo em que a Pokébola encostou na sua mão, ${virou} mudou de forma. Ninguém sabe explicar por que a troca faz isso. Todo mundo já viu acontecer.`});
    avisos.push({tipo:'info', texto:`${nomeExib(novo)} obedece pior do que os seus. ${pron(novo).Ele} não te escolheu e ainda não sabe o seu nome.`});
    Exploracao.tela(avisos);
  }
};
