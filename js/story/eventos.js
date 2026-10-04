/* ============================================================
   EVENTOS DE CIDADE — as coisas que acontecem enquanto você passa
   Andar sem destino por uma cidade não devolve só descoberta de
   lugar: devolve gente no meio de uma situação. Cada evento tem
   escolha, consequência e memória — e alguns cobram depois.
   ============================================================ */

/* Quem já te conhece te reconhece: pela entrega, pelo número ou pela memória. */
function conheceOCelio(d){
  return !!(d.flags.numero_do_goro || d.flags.recebeu_do_goro || (typeof Estado !== 'undefined' && Estado.temNumero && Estado.temNumero('goro'))
            || (d.npcs && d.npcs['Célio']));
}

const EVENTOS_CIDADE = {

/* ─────────────── PALLET ─────────────── */
pallet:[
{
  id:'pal_cachorro_do_quatorze', umaVez:true, peso:3,
  titulo:'O Growlithe do quatorze',
  texto:[
    'Tem um Growlithe velho deitado no meio da rua, na parte quente do asfalto, e ele não sai de lá por nada.',
    'Uma mulher tenta empurrar com o pé, sem força nenhuma, do jeito de quem faz isso todo dia e já perdeu.',
    fala('a mulher do quatorze', 'Ele tem quinze anos. Quinze! Ele não escuta, não vê direito, e escolheu justo o meio da rua.'),
    fala('a mulher do quatorze', 'Passa caminhão de leite às onze. Todo dia às onze.')
  ],
  escolhas:[
    {texto:'Pegar ele no colo e levar pra calçada.',
     ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Tirou um Pokémon velho do meio da rua'},
         flag:'tirou_o_growlithe_da_rua', registrar:'Tirou o Growlithe de quinze anos do meio da rua.'},
     resultado:[
       'Ele pesa muito mais do que parece e cheira a sol.',
       'Ele não reage, não se assusta, não faz nada — só fica de queixo apoiado no seu braço o caminho inteiro, que são quatro metros.',
       fala('a mulher do quatorze', 'Ele vai voltar pro meio da rua em dez minutos.'),
       fala('a mulher do quatorze', 'Mas obrigada. Todo dia alguém tem que fazer isso, e faz três dias que é só eu.')
     ]},
    {texto:'Perguntar por que ele insiste naquele lugar.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Perguntou antes de resolver'},
         flag:'sabe_do_growlithe', registrar:'O Growlithe do quatorze deita onde o dono dele costumava estacionar.'},
     resultado:[
       fala('a mulher do quatorze', 'Ali era onde o carro do meu marido ficava.'),
       fala('a mulher do quatorze', 'Faz dois anos que não tem carro nenhum ali e faz dois anos que ele deita naquele exato lugar.', 'baixo'),
       'Vocês dois olham o pedaço de asfalto por um tempo.',
       fala('a mulher do quatorze', 'Me ajuda a tirar ele antes das onze?')
     ]},
    {texto:'Comprar um saco de areia no armazém e fazer uma sombra na calçada pra ele.',
     ef:{dinheiro:-300, moral:3, flag:'fez_sombra_pro_growlithe',
         rep:{eixo:'bom',delta:2,motivo:'Resolveu o problema em vez de empurrar o problema'},
         registrar:'Fez uma sombra na calçada pro Growlithe do quatorze, com lona e areia.'},
     resultado:[
       'Você compra lona, areia e barbante, e leva quarenta minutos armando uma sombra torta na calçada, na altura certa.',
       'Ele não vem. Ele fica no asfalto olhando você trabalhar.',
       'Você desiste e vai embora.',
       'Três horas depois, voltando, ele está deitado embaixo da lona.',
       fala('a mulher do quatorze', 'ELE FOI SOZINHO!', 'grita', 'Ela grita isso da janela, pra rua inteira, sem se importar com ninguém.')
     ]},
    {texto:'Não é problema seu. Seguir andando.',
     ef:{},
     resultado:['Você desvia e segue.','Às onze e dez você ouve um caminhão frear muito forte, quatro ruas atrás, e não volta pra ver.']}
  ]
},
{
  id:'pal_menino_do_muro', peso:2,
  cond:d=>numInsignias() >= 1,
  titulo:'O muro do laboratório',
  texto:[
    'Tem um menino de uns nove anos chutando bola contra o muro do laboratório, sozinho, com uma concentração absurda.',
    'Ele erra. Ele erra de novo. Ele erra sete vezes seguidas e não muda nada no que está fazendo.',
    fala('o menino do muro', 'Esse muro devolve reto. Quem erra sou eu.')
  ],
  escolhas:[
    {texto:'Ensinar a ele o que ele está errando.',
     ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Ensinou uma coisa pequena a quem não pediu'},
         registrar:'Ensinou um menino de nove anos a chutar contra o muro do laboratório.'},
     resultado:[
       'Você aponta o pé de apoio dele, que está longe demais da bola, e ele muda sem discutir.',
       'Ele acerta na primeira. E na segunda. E aí ele acerta doze seguidas e fica sem graça.',
       fala('o menino do muro', 'Você é {treinador|treinadora}?'),
       fala('o menino do muro', 'Eu vou ser. Eu já sei qual eu vou escolher e tudo.')
     ]},
    {texto:'Jogar com ele.',
     ef:{moral:3, hp:-1, flag:'jogou_bola_no_muro',
         rep:{eixo:'bom',delta:1,motivo:'Parou uma tarde pra jogar bola contra um muro'},
         registrar:'Jogou bola contra o muro do laboratório com um menino de nove anos.'},
     resultado:[
       'Vocês jogam por quarenta minutos, que é tempo demais, e você perde de doze a nove porque ele conhece aquele muro melhor do que você.',
       'Você sai de lá com o joelho ralado e uma sensação estranha de que isso foi importante.',
       fala('o menino do muro', 'Amanhã de novo?'),
       'Você não vai estar aqui amanhã, e ele sabe disso, e perguntou assim mesmo.'
     ]},
    {texto:'Perguntar qual ele vai escolher.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Perguntou a um menino o que ninguém pergunta'},
         registrar:'O menino do muro já escolheu o inicial dele. Faltam seis anos.'},
     resultado:[
       fala('o menino do muro', 'Eu não vou falar. Se eu falar dá azar.'),
       'Pausa de dois segundos.',
       fala('o menino do muro', 'Mas é o do meio.', 'baixo'),
       'Ele tem nove anos. Faltam seis. Ele já decidiu.'
     ]},
    {texto:'Seguir andando.', ef:{}, resultado:['Você segue. A bola bate no muro atrás de você mais quatro vezes, e na quarta ele acerta.']}
  ]
}
],

/* ─────────────── VIRIDIAN ─────────────── */
viridian:[
{
  id:'vir_fila_da_licenca', umaVez:true, peso:3,
  titulo:'A fila da licença',
  texto:[
    'A fila do balcão do Centro tem nove pessoas e todas têm menos de dezesseis anos, e uma delas está chorando de um jeito discreto e muito constrangido.',
    'É uma menina de uns quinze com um formulário na mão e um carimbo vermelho em cima dele.',
    fala('a menina do formulário', 'Falta assinatura de responsável e eu não tenho responsável.', 'baixo'),
    fala('a menina do formulário', 'Eu vim de Pewter de ônibus. Eu gastei tudo no ônibus.')
  ],
  escolhas:[
    {texto:'Contar a ela do formulário alternativo. Tem sempre um formulário.',
     ef:{moral:3, rep:{eixo:'bom',delta:2,motivo:'Passou adiante uma informação que salvou a licença de alguém'},
         flag:'ajudou_a_menina_da_licenca',
         npc:{nome:'Maren de Pewter', opiniao:4, memoria:'Você contou pra ela do formulário alternativo quando ela ia desistir da licença.'},
         registrar:'Contou à menina do formulário que existe formulário para quem não tem responsável.'},
     resultado:[
       'Você conta. Ela não acredita. Você insiste. Ela volta pro balcão.',
       'A enfermeira puxa a gaveta, tira o formulário, e a menina chora de novo — de um jeito completamente diferente do de antes.',
       fala('a menina do formulário', 'Eu ia voltar pra Pewter hoje. Eu ia voltar hoje e não tentar de novo.'),
       fala('a menina do formulário', 'Maren. Eu me chamo Maren. Eu vou lembrar da sua cara.')
     ]},
    {texto:'Pagar a passagem de volta dela, pelo menos.',
     ef:{dinheiro:-800, moral:2, rep:{eixo:'bom',delta:1,motivo:'Pagou a passagem de quem não conseguiu'},
         registrar:'Pagou a passagem de volta da menina que não conseguiu a licença.'},
     resultado:[
       'Ela aceita o dinheiro e agradece quatro vezes e não olha na sua cara em nenhuma das quatro.',
       'Você resolveu o problema errado, e você percebe isso exatamente no segundo em que ela vira as costas.'
     ]},
    {texto:'Oferecer assinar como responsável. Você tem licença.',
     cond:d=>!!d.flags.tem_licenca,
     ef:{rep:{eixo:'ruim',delta:1,motivo:'Assinou como responsável de uma pessoa que você não conhece'},
         flag:'assinou_por_bruna',
         npc:{nome:'Maren de Pewter', opiniao:5, memoria:'Você assinou como responsável dela, o que não podia.'},
         registrar:'Assinou como responsável de uma desconhecida no balcão de Viridian.'},
     resultado:[
       'A enfermeira olha a sua licença. Olha a sua idade. Olha a idade dela.',
       fala('a enfermeira', 'Isso não vale, e eu vou carimbar assim mesmo, e se aparecer alguém perguntando eu não sei de nada.', 'frio'),
       fala('a menina do formulário', 'Por que você fez isso?'),
       'Você não tem uma resposta boa e responde qualquer coisa.'
     ]},
    {texto:'Não é da sua conta.', ef:{}, resultado:['Você entra na fila atrás dela e olha o chão pelos quatro minutos seguintes.']}
  ]
},
{
  id:'vir_o_carro_do_posto', peso:2,
  titulo:'Atrás do posto',
  texto:[
    'Atrás do posto de gasolina tem quatro homens em volta de um carro com o capô aberto e ninguém mexendo em nada.',
    'Tem um Magnemite pairando sobre o motor, parado, com as duas hastes viradas pra bateria.',
    fala('o dono do carro', 'Ele acha o problema. Ele SEMPRE acha o problema. O que ele não faz é explicar.'),
    fala('Nilo, o do posto', 'Ele tá parado em cima da bateria faz vinte minutos, Dino. Ele já explicou.')
  ],
  escolhas:[
    {texto:'Escanear o Magnemite com a Pokédex pra ver o que ele está medindo.',
     cond:d=>!!d.flags.tem_pokedex,
     ef:{rep:{eixo:'bom',delta:1,motivo:'Usou a Pokédex pra resolver problema de gente'},
         flag:'resolveu_o_carro_do_posto',
         registrar:'Usou a Pokédex pra descobrir o que o Magnemite estava medindo. Era a bateria.'},
     resultado:[
       'A leitura mostra campo magnético concentrado num ponto só, e o ponto é o terminal negativo.',
       'Terminal solto. Um parafuso.',
       fala('Nilo, o do posto', 'EU FALEI!', 'grita'),
       fala('o dono do carro', 'Você falou "ele já explicou", Nilo, isso não é falar.'),
       'Eles brigam sobre isso por mais quinze minutos. O carro liga na primeira.'
     ]},
    {texto:'Perguntar de onde veio o Magnemite.',
     ef:{flag:'sabe_do_magnemite_do_posto',
         registrar:'O Magnemite do posto veio da usina abandonada e apareceu sozinho.'},
     resultado:[
       fala('Nilo, o do posto', 'Ele apareceu. Há uns seis anos.'),
       fala('Nilo, o do posto', 'Veio andando pela estrada da usina, de dia, no meio do sol, parou em cima da bomba dois e ficou.'),
       fala('Nilo, o do posto', 'Nunca mais saiu. E não deixa ninguém encostar em bomba com defeito.', 'baixo'),
       'A usina abandonada fica a quatro cidades daqui.'
     ]},
    {texto:'Pôr a mão no motor e achar você mesm{o|a}.',
     ef:{hp:-2, rep:{eixo:'bom',delta:1,motivo:'Pôs a mão no motor de um estranho'},
         registrar:'Queimou a mão no motor do carro atrás do posto de Viridian.'},
     resultado:[
       'Você põe a mão num lugar que está a noventa graus e tira muito rápido.',
       'Os quatro homens acham isso a coisa mais engraçada que aconteceu na semana deles.',
       fala('o dono do carro', 'Era o terminal, {moço|moça}. Era o terminal desde o começo.', 'riso')
     ]},
    {texto:'Deixar os quatro resolverem.', ef:{}, resultado:['Você segue. A discussão continua audível por dois quarteirões.']}
  ]
}
],

/* ─────────────── PEWTER ─────────────── */
pewter:[
{
  id:'pew_sirene', umaVez:true, peso:3,
  titulo:'A sirene das seis e meia',
  texto:[
    'A sirene da pedreira toca e a cidade inteira muda de ritmo em quinze segundos.',
    'Duzentas pessoas saem de um portão ao mesmo tempo, todas cinzas de pó, todas andando na mesma direção e na mesma velocidade.',
    'No meio delas tem um Machoke carregando três vigas sozinho, no mesmo passo, sem capacete.',
    fala('o rapaz da pedreira', 'Ele trabalha desde os quatro anos. Não é maldade, é que ele gosta.'),
    fala('o rapaz da pedreira', 'O problema é que ele não sabe parar, e aqui ninguém manda ele parar porque ninguém quer ser o cara que mandou.')
  ],
  escolhas:[
    {texto:'Mandar ele parar.',
     ef:{moral:2, rep:{eixo:'bom',delta:2,motivo:'Foi o único a mandar parar quem não sabe parar'},
         flag:'mandou_o_machoke_parar',
         registrar:'Mandou o Machoke da pedreira parar. Ninguém ali queria ser essa pessoa.'},
     resultado:[
       'Você chega na frente dele e fala, alto, na frente de duzentas pessoas.',
       'Ele para. Ele baixa as três vigas com um cuidado absurdo, uma por uma.',
       'E aí ele senta no chão e não levanta mais, e alguém traz água, e alguém traz mais água.',
       fala('o rapaz da pedreira', 'Doze anos.', 'baixo'),
       fala('o rapaz da pedreira', 'Doze anos que a gente vê isso e ninguém falou nada.')
     ]},
    {texto:'Perguntar quem é o dono dele.',
     ef:{flag:'o_machoke_nao_tem_dono',
         rep:{eixo:'bom',delta:1,motivo:'Perguntou de quem era a responsabilidade'},
         registrar:'O Machoke da pedreira não tem dono. Está na folha de pagamento como equipamento.'},
     resultado:[
       fala('o rapaz da pedreira', 'Não tem.'),
       fala('o rapaz da pedreira', 'Ele tá na folha da empresa. Não como funcionário — como equipamento. Linha de baixo, junto com a retroescavadeira.'),
       'Equipamento não tem hora de parar. Equipamento tem manutenção.',
       fala('o rapaz da pedreira', 'Eu nunca tinha falado isso em voz alta. Soa pior em voz alta.')
     ]},
    {texto:'Anotar o nome da empresa e o número da folha.',
     ef:{itens:{'Nome da empresa e o número da folha':1},
         flag:'anotou_a_pedreira',
         rep:{eixo:'bom',delta:2,motivo:'Anotou o que estava escrito na folha de pagamento'},
         registrar:'Anotou o nome da empresa da pedreira e a linha da folha onde o Machoke aparece.'},
     resultado:[
       'O rapaz da pedreira consegue uma cópia da folha do mês passado em quatro minutos, o que quer dizer que ele já tinha pensado nisso.',
       'Linha 41: MACHOKE — EQUIPAMENTO — MANUTENÇÃO TRIMESTRAL.',
       'Você vai ver essa palavra, manejo ou manutenção, mais umas quarenta vezes nos próximos meses, sempre no mesmo tipo de papel.'
     ]},
    {texto:'Seguir andando com as duzentas pessoas.', ef:{},
     resultado:['Você anda junto com a massa cinza por dois quarteirões e depois vira numa rua lateral, e o barulho todo some de uma vez.']}
  ]
},
{
  id:'pew_museu_sem_telhado', peso:2,
  titulo:'A sala fechada do museu',
  texto:[
    'A porta da ala de fósseis tem um aviso à mão numa folha amarelada: FÓSSEIS — REFORMA.',
    'Pela fresta dá pra ver lona azul no chão e uma pilha de balde.',
    fala('o senhor do museu', 'Reforma é força de expressão. A gente tem o dinheiro do telhado e não tem o do andaime.'),
    fala('o senhor do museu', 'Então quando chove a gente põe balde, e quando para a gente tira balde, e é isso há três anos.')
  ],
  escolhas:[
    {texto:'Doar pro telhado.',
     cond:d=>d.jogador.dinheiro >= 3000,
     ef:{dinheiro:-3000, flag:'doou_pro_museu',
         rep:{eixo:'bom',delta:2,motivo:'Doou pro telhado de um museu que ninguém visita', rep:{notorio:true}},
         npc:{nome:'Museu de Pewter', opiniao:4, memoria:'Doou três mil pro telhado da ala de fósseis.'},
         registrar:'Doou três mil pro telhado da ala de fósseis do museu de Pewter.'},
     resultado:[
       'Ele conta o dinheiro duas vezes, em silêncio, e na segunda as mãos tremem um pouco.',
       fala('o senhor do museu', 'Isso paga o andaime.'),
       fala('o senhor do museu', 'Isso paga o andaime e sobra pro pedreiro de meio período. {Moço|Moça}.', 'baixo'),
       'Seis meses depois, numa cidade completamente diferente, você vai ver uma foto de jornal da ala reaberta, e vai ter uma placa pequena com o seu nome escrito errado.'
     ]},
    {texto:'Perguntar se dá pra ver mesmo com a reforma.',
     ef:{flag:'viu_os_fosseis',
         rep:{eixo:'bom',delta:1,motivo:'Pediu pra ver o que estava fechado'},
         registrar:'Viu a ala de fósseis de Pewter com lona no chão e balde no canto.'},
     resultado:[
       'Ele abre a porta com uma chave que ele tira do bolso, o que quer dizer que ele leva a chave no bolso todo dia.',
       'A sala tem onze vitrines e uma delas está vazia, com uma etiqueta e nenhum fóssil.',
       fala('o senhor do museu', 'Esse foi pra Cinnabar em 1994, pra pesquisa.'),
       fala('o senhor do museu', 'A gente nunca recebeu de volta e nunca recebeu explicação, e a etiqueta eu deixei porque a etiqueta é nossa.', 'frio')
     ]},
    {texto:'Oferecer trabalho braçal: subir na escada e trocar o que dá.',
     ef:{hp:-4, moral:2, flag:'trabalhou_no_museu',
         rep:{eixo:'bom',delta:2,motivo:'Subiu num telhado de museu em vez de doar dinheiro'},
         registrar:'Passou uma tarde trocando telha no museu de Pewter.'},
     resultado:[
       'Você passa a tarde inteira numa escada de madeira, trocando as telhas que o senhor do museu aponta lá de baixo.',
       'Vocês trocam dezenove e faltam umas trezentas, e ele insiste em te pagar com um catálogo de 1987 que ninguém nunca comprou.',
       'Você aceita o catálogo.'
     ]},
    {texto:'Seguir andando.', ef:{}, resultado:['Você segue. A folha amarelada do aviso já estava amarelada quando foi escrita.']}
  ]
}
],

/* ─────────────── CERULEAN ─────────────── */
cerulean:[
{
  id:'cer_ponte_dos_seis', umaVez:true, peso:3,
  titulo:'A fila da ponte',
  texto:[
    'A ponte norte tem seis garotos em fila, um atrás do outro, desafiando quem passa.',
    'O sexto é visivelmente menor que os outros cinco e visivelmente mais novo, e está ali no fim da fila com uma Pokébola só no cinto.',
    fala('o primeiro da ponte', 'Quem passa enfrenta os seis. É tradição.'),
    fala('o sexto da ponte', 'Eu sou o sexto.', 'baixo', 'Ele fala isso como quem se desculpa por existir na fila.')
  ],
  escolhas:[
    {texto:'Enfrentar os seis na ordem.',
     ef:{hp:-3, moral:3, dinheiro:1800, flag:'enfrentou_os_seis',
         rep:{eixo:'bom',delta:2,motivo:'Enfrentou a fila inteira da ponte, na ordem'},
         registrar:'Enfrentou os seis da ponte norte na ordem.'},
     resultado:[
       'Cinco combates rápidos e um comprido, e o comprido é o do menor.',
       'Ele te dá muito mais trabalho do que os cinco anteriores juntos, porque ele estudou os cinco anteriores a manhã inteira.',
       fala('o sexto da ponte', 'Eu quase.'),
       fala('o primeiro da ponte', 'Ele quase. Ele nunca tinha chegado perto.', null, 'O primeiro da fila fala isso sem nenhuma ironia, e é a primeira coisa gentil que sai da boca dele hoje.')
     ]},
    {texto:'Pedir pra enfrentar o sexto primeiro.',
     ef:{moral:4, flag:'enfrentou_o_sexto_primeiro',
         rep:{eixo:'bom',delta:2,motivo:'Inverteu uma fila pra alguém ter chance de ser o primeiro', rep:{notorio:true}},
         npc:{nome:'O sexto da ponte', opiniao:5, memoria:'Você pediu pra enfrentar ele primeiro, quando ele era sempre o último.'},
         registrar:'Pediu pra enfrentar o sexto da ponte primeiro. Ele nunca tinha sido primeiro.'},
     resultado:[
       'Os cinco protestam. A tradição é a tradição.',
       'Você não discute, só fica parad{o|a} na frente do sexto e espera.',
       fala('o primeiro da ponte', '…tá. Uma vez.'),
       'O sexto luta contra você com o time inteiro dele descansado, pela primeira vez na vida dele, e é um combate completamente diferente do que teria sido no fim da fila.',
       fala('o sexto da ponte', 'Assim é muito melhor.', 'baixo')
     ]},
    {texto:'Perguntar quanto eles cobram e se o sexto recebe igual.',
     ef:{flag:'sabe_da_divisao_da_ponte',
         rep:{eixo:'bom',delta:1,motivo:'Perguntou como o dinheiro era dividido'},
         registrar:'Na ponte norte, o sexto recebe um quinto do que os outros recebem.'},
     resultado:[
       'Silêncio de cinco garotos.',
       fala('o sexto da ponte', 'Eu recebo menos porque eu perco mais.'),
       fala('o primeiro da ponte', 'É justo.'),
       d=>fala(d.jogador.nome, 'Ele perde mais porque ele é sempre o último. Vocês chegam nele cansados.'),
       'Mais silêncio. Bem mais longo.'
     ]},
    {texto:'Atravessar sem lutar com ninguém.',
     ef:{rep:{eixo:'ruim',delta:1,motivo:'Atravessou a ponte ignorando seis pessoas'},
         registrar:'Atravessou a ponte norte sem aceitar nenhum desafio.'},
     resultado:['Você passa reto pelos seis. Nenhum deles te impede, porque nenhum deles pode.','O sexto é o único que fala alguma coisa, e o que ele fala é "tchau".']}
  ]
},
{
  id:'cer_o_rio_mudou_de_cor', peso:2,
  cond:d=>numInsignias() >= 2,
  titulo:'O rio mudou de cor de novo',
  texto:[
    'Tem umas vinte pessoas na margem olhando a água, que está de um verde que água de rio não fica.',
    'Um pescador enche um pote de vidro e levanta contra a luz.',
    fala('o pescador da ponte', 'Terceira vez esse mês. Antes era duas por ano.'),
    fala('o pescador da ponte', 'A prefeitura manda um moço que olha, escreve, e vai embora. Depois some por três semanas.')
  ],
  escolhas:[
    {texto:'Encher um pote e guardar. Isso é prova.',
     ef:{itens:{'Pote de vidro com água verde do rio':1}, flag:'guardou_agua_do_rio',
         rep:{eixo:'bom',delta:2,motivo:'Guardou prova do que todo mundo só reclamava'},
         registrar:'Guardou um pote com a água verde do rio de Cerulean.'},
     resultado:[
       'O pescador te empresta um pote e te ensina a fechar com plástico por cima antes da tampa, que é como se guarda amostra.',
       fala('o pescador da ponte', 'Escreve a data na tampa. Sempre a data.'),
       fala('o pescador da ponte', 'Eu tenho onze potes em casa. Nunca ninguém pediu nenhum.', 'baixo')
     ]},
    {texto:'Subir o rio pra ver de onde vem.',
     ef:{hp:-3, flag:'subiu_o_rio',
         rep:{eixo:'bom',delta:2,motivo:'Subiu o rio pra achar a origem em vez de reclamar da margem'},
         registrar:'Subiu o rio de Cerulean. A cor começa depois da curva da Rota 24.'},
     resultado:[
       'Você sobe a margem por quase duas horas, cortando mato, e acha o ponto exato onde a água ainda é normal.',
       'É depois da curva da Rota 24, e a mudança acontece em menos de trinta metros.',
       'Do lado verde tem um cano de concreto de uns quarenta centímetros saindo do barranco, sem placa, sem identificação, com grama alta em volta.',
       'Alguém corta essa grama. Dá pra ver que alguém corta essa grama.'
     ]},
    {texto:'Perguntar o nome do moço da prefeitura.',
     ef:{flag:'o_moco_da_prefeitura',
         registrar:'O técnico que vem olhar o rio de Cerulean é sempre o mesmo, e some por três semanas depois.'},
     resultado:[
       fala('o pescador da ponte', 'É sempre o mesmo. Moço novo, camisa de manga curta, prancheta.'),
       fala('o pescador da ponte', 'Da última vez eu perguntei o nome dele e ele falou que não podia dizer.'),
       fala('o pescador da ponte', 'Técnico de prefeitura que não pode dizer o nome, {moço|moça}. Pensa nisso.', 'frio')
     ]},
    {texto:'Olhar junto com os outros vinte e seguir.', ef:{},
     resultado:['Você olha a água verde por uns minutos, junto com vinte pessoas que fazem isso todo mês, e vai embora junto com elas.']}
  ]
}
],

/* ─────────────── VERMILION ─────────────── */
vermilion:[
{
  id:'ver_caixa_de_gelo', umaVez:true, peso:3,
  titulo:'A caixa de gelo',
  texto:[
    'Duas mulheres carregam uma caixa térmica entre as duas, param a cada dez metros e trocam de mão.',
    'Elas fazem isso todo dia e a cidade inteira sabe, e ninguém oferece ajuda porque elas já recusaram de todo mundo.',
    fala('a mais velha das duas', 'A gente não precisa, {moço|moça}.'),
    fala('a mais nova das duas', 'A gente precisa, mãe.', 'baixo')
  ],
  escolhas:[
    {texto:'Pegar uma ponta sem perguntar.',
     ef:{hp:-2, moral:3, rep:{eixo:'bom',delta:2,motivo:'Pegou a ponta da caixa sem pedir licença'},
         flag:'carregou_a_caixa_de_gelo',
         npc:{nome:'As duas da caixa de gelo', opiniao:4, memoria:'Você pegou a ponta da caixa sem perguntar, que era a única forma de ajudar.'},
         registrar:'Carregou a caixa de gelo do porto com as duas, seiscentos metros.'},
     resultado:[
       'Você pega uma ponta e a mais velha reclama por cento e cinquenta metros e depois para de reclamar.',
       'São seiscentos metros até a peixaria e vocês três fazem em uma parada só.',
       fala('a mais velha das duas', 'Amanhã a gente não precisa.'),
       fala('a mais nova das duas', 'Amanhã é quinta. Quinta é a caixa grande.', null, 'A mais nova fala isso olhando pra você, não pra mãe.')
     ]},
    {texto:'Perguntar o que tem na caixa.',
     ef:{flag:'sabe_da_caixa_de_gelo',
         registrar:'A caixa de gelo do porto leva o que vem na rede e não passa na balança da cooperativa.'},
     resultado:[
       fala('a mais nova das duas', 'O que vem na rede e não passa na balança da cooperativa.'),
       fala('a mais nova das duas', 'Coisa boa, mas fora do tamanho. A cooperativa não compra e manda devolver ao mar.'),
       fala('a mais velha das duas', 'Devolver ao mar coisa morta. É isso que eles mandam.', 'frio'),
       fala('a mais nova das duas', 'A gente carrega na mão pra vender na peixaria pequena. Dá metade do preço e dá pra comer.')
     ]},
    {texto:'Comprar a caixa inteira pelo preço da cooperativa.',
     cond:d=>d.jogador.dinheiro >= 4000,
     ef:{dinheiro:-4000, moral:2, flag:'comprou_a_caixa_de_gelo',
         rep:{eixo:'bom',delta:1,motivo:'Comprou a carga inteira pelo preço cheio'},
         registrar:'Comprou a caixa de gelo inteira pelo preço da cooperativa.'},
     resultado:[
       'Elas olham o dinheiro. Elas olham uma pra outra.',
       fala('a mais velha das duas', 'Isso é esmola.'),
       d=>fala(d.jogador.nome, 'É o preço da cooperativa. Eu paguei o preço.'),
       'A mais velha pega o dinheiro e não agradece, que é exatamente como deve ser numa venda.',
       'Você fica com uma caixa térmica de quarenta quilos e nenhum plano, e acaba doando pro Centro Pokémon.'
     ]},
    {texto:'Respeitar a recusa e seguir.', ef:{},
     resultado:['Você respeita a recusa e segue.','Duzentos metros adiante você olha pra trás e elas estão paradas de novo, trocando de mão.']}
  ]
},
{
  id:'ver_por_do_sol', peso:2,
  titulo:'O melhor pôr do sol de Kanto',
  texto:[
    'O homem da guarita do porto está sentado na cadeira de plástico dele, de costas pra cancela, olhando o oeste.',
    fala('o homem da guarita', 'Seis e quarenta. Todo dia seis e quarenta, essa época do ano.'),
    fala('o homem da guarita', 'Trinta e um anos nessa guarita e é a melhor coisa que esse emprego me deu.')
  ],
  escolhas:[
    {texto:'Sentar no chão e olhar junto.',
     ef:{moral:3, hp:2, flag:'viu_o_por_do_sol_de_vermilion',
         rep:{eixo:'bom',delta:1,motivo:'Parou o dia pra ver um pôr do sol com quem convidou'},
         registrar:'Viu o pôr do sol de Vermilion sentado no chão da guarita, com o guarda.'},
     resultado:[
       'Vocês dois ficam onze minutos em silêncio absoluto.',
       'O sol entra na água num ângulo que faz o porto inteiro ficar laranja por uns quarenta segundos, inclusive os guindastes, inclusive a ferrugem.',
       'E aí acaba, e o porto volta a ser cinza, e é como se alguém tivesse desligado.',
       fala('o homem da guarita', 'Amanhã de novo.'),
       fala('o homem da guarita', 'Todo dia. E todo dia tem umas quatro pessoas na cidade inteira olhando.')
     ]},
    {texto:'Perguntar por que ninguém mais olha.',
     ef:{registrar:'No porto de Vermilion, umas quatro pessoas por dia olham o pôr do sol.'},
     resultado:[
       fala('o homem da guarita', 'Porque às seis e quarenta todo mundo tá indo embora, e quem vai embora anda pro leste.'),
       fala('o homem da guarita', 'Pra ver, tem que virar as costas pra casa. Ninguém vira as costas pra casa às seis e quarenta.', 'baixo')
     ]},
    {texto:'Seguir. Você tem o que fazer.', ef:{},
     resultado:['Você segue andando pro leste, como todo mundo.','Às suas costas o porto fica laranja por quarenta segundos e você não vê.']}
  ]
}
],

/* ─────────────── LAVENDER ─────────────── */
lavender:[
{
  id:'lav_o_caderno_da_porta', umaVez:true, peso:3,
  titulo:'O caderno na porta do abrigo',
  texto:[
    'O abrigo do Sr. Fuji tem um caderno pendurado na porta por um barbante, com uma caneta amarrada junto.',
    'As pessoas escrevem o nome de quem deixaram ali. Só o nome. É essa a única regra e ela não está escrita em lugar nenhum.',
    'O caderno está na página oitenta e três.',
    'A última linha é de hoje de manhã e a letra é de criança.'
  ],
  escolhas:[
    {texto:'Ler o caderno inteiro, do começo.',
     ef:{hp:-2, flag:'leu_o_caderno_do_abrigo',
         rep:{eixo:'bom',delta:2,motivo:'Leu oitenta e três páginas de nomes que ninguém lê'},
         registrar:'Leu as oitenta e três páginas do caderno da porta do abrigo de Lavender.'},
     resultado:[
       'Leva uma hora e quarenta.',
       'São mil e duzentos nomes, mais ou menos, em onze anos. Alguns aparecem duas vezes — o mesmo nome, anos diferentes, letras diferentes.',
       'Na página sessenta e um tem um nome riscado e reescrito logo abaixo, mais firme.',
       'Na setenta e quatro tem um nome e, do lado, fora da regra, quatro palavras: "ele gostava de sombra".',
       'Você fecha o caderno e fica um tempo sem saber o que fazer com as mãos.'
     ]},
    {texto:'Perguntar ao Sr. Fuji o que acontece com os nomes.',
     ef:{flag:'sabe_do_caderno',
         npc:{nome:'Sr. Fuji', opiniao:3, memoria:'Te explicou por que o caderno da porta só tem nome.'},
         rep:{eixo:'bom',delta:1,motivo:'Perguntou o que significava o caderno'},
         registrar:'O caderno do abrigo só tem nome porque nome é o que some primeiro.'},
     resultado:[
       fala('Sr. Fuji', 'Nada. Não acontece nada com eles.'),
       fala('Sr. Fuji', 'Eu não procuro ninguém com esses nomes e não mando carta pra ninguém.'),
       d=>fala(d.jogador.nome, 'Então pra que serve?'),
       fala('Sr. Fuji', 'Pra existir.', 'baixo'),
       fala('Sr. Fuji', 'Quando alguém deixa um Pokémon aqui, a primeira coisa que some é o nome dele. Em duas semanas ninguém lembra. Esse caderno é onde o nome não some.')
     ]},
    {texto:'Escrever um nome. Você tem um pra escrever.',
     cond:d=>d.cemiterio.length > 0,
     ef:{moral:4, flag:'escreveu_no_caderno',
         rep:{eixo:'bom',delta:2,motivo:'Escreveu no caderno da porta do abrigo', rep:{notorio:true}},
         registrar:'Escreveu um nome no caderno da porta do abrigo de Lavender.'},
     resultado:[
       d=>{
         const m = d.cemiterio[d.cemiterio.length-1];
         return `Você escreve ${nomeExib(m)} na página oitenta e três, embaixo da letra de criança.`;
       },
       'Só o nome. Você quase escreve mais e não escreve.',
       'A regra é essa e a regra é boa.',
       'O Sr. Fuji vê você escrever da janela e não sai de dentro de casa, e é a coisa mais gentil que ele podia fazer.'
     ]},
    {texto:'Não abrir. Não é seu.', ef:{},
     resultado:['Você não abre.','O caderno balança um pouco no barbante quando você passa, e continua na página oitenta e três.']}
  ]
},
{
  /* Aqui nasce a escolha que decide Haunter ou Kadabra, meses depois.
     O curador não fala em Pokémon uma vez sequer, nem aqui nem na
     entrega — se ele falasse, o jogador escolheria o prêmio e não a
     resposta, e a coisa inteira perderia a graça. */
  id:'lav_a_pergunta_do_curador', umaVez:true, peso:4,
  titulo:'A pergunta',
  texto:[
    'Tem um homem sentado num banco de pedra na entrada do abrigo, com um caderno de capa dura aberto no colo e uma caneta atravessada na página.',
    'Ele não está escrevendo. Ele está esperando.',
    fala('Fabre', 'Desculpa. Posso te fazer uma pergunta? Uma só, e não é sobre nada.'),
    fala('Fabre', 'Eu faço essa pergunta pra quem passa aqui desde 1978. Tenho oitenta e três cadernos.'),
    fala('Fabre', 'A pergunta é: quando uma coisa chega na sua mão e não é sua — você guarda, ou você passa adiante?'),
    'Ele não explica que coisa. Ele não explica por quê. Ele espera, com a caneta atravessada na página, do jeito de quem já esperou muito.'
  ],
  escolhas:[
    {texto:'"Eu guardo."',
     ef:{flag:['a_pergunta_do_curador','respondeu_guardar'],
         npc:{nome:'Curador Fabre', opiniao:2, memoria:'Você respondeu "guardar" à pergunta dele, no caderno setenta e um, página quatro.'},
         rep:{eixo:'bom',delta:1,motivo:'Respondeu a uma pergunta que não tinha resposta certa'},
         registrar:'Respondeu "guardar" à pergunta do curador de Lavender.'},
     resultado:[
       'Ele escreve a palavra e a data e o seu nome, nessa ordem, em letra pequena.',
       fala('Fabre', 'Caderno setenta e um, página quatro.'),
       d=>fala(d.jogador.nome, 'Isso serve pra quê?'),
       fala('Fabre', 'Pra nada. Eu anoto.'),
       'Ele fecha o caderno e prende a caneta na espiral, e você entende que a conversa acabou.',
       fala('Fabre', 'Quando você tiver quatro insígnias, aparece aqui. É só isso.', 'baixo'),
       'Ele te dá o número antes de você perguntar se ele tem número.'
     ]},
    {texto:'"Eu passo adiante."',
     ef:{flag:'a_pergunta_do_curador', limpaFlag:'respondeu_guardar',
         npc:{nome:'Curador Fabre', opiniao:2, memoria:'Você respondeu "passar adiante" à pergunta dele, no caderno setenta e um, página quatro.'},
         rep:{eixo:'bom',delta:1,motivo:'Respondeu a uma pergunta que não tinha resposta certa'},
         registrar:'Respondeu "passar adiante" à pergunta do curador de Lavender.'},
     resultado:[
       'Ele escreve a palavra e a data e o seu nome, nessa ordem, em letra pequena.',
       fala('Fabre', 'Caderno setenta e um, página quatro.'),
       d=>fala(d.jogador.nome, 'Isso serve pra quê?'),
       fala('Fabre', 'Pra nada. Eu anoto.'),
       'Ele fecha o caderno e prende a caneta na espiral, e você entende que a conversa acabou.',
       fala('Fabre', 'Quando você tiver quatro insígnias, aparece aqui. É só isso.', 'baixo'),
       'Ele te dá o número antes de você perguntar se ele tem número.'
     ]},
    {texto:'Perguntar o que as outras pessoas responderam antes de responder.',
     ef:{flag:'perguntou_as_respostas_antes',
         rep:{eixo:'bom',delta:1,motivo:'Quis saber o que os outros responderam antes de responder'},
         registrar:'Perguntou ao curador o que as outras pessoas tinham respondido.'},
     resultado:[
       fala('Fabre', 'Em dezenove anos: mil e setecentas pessoas.'),
       fala('Fabre', 'Novecentas e quarenta e uma disseram guardar. Setecentas e cinquenta e nove disseram passar adiante.'),
       d=>fala(d.jogador.nome, 'E qual é a certa?'),
       fala('Fabre', 'Não tem certa. Tem a sua.', null, 'Ele abre o caderno de novo e atravessa a caneta na página.'),
       fala('Fabre', 'Agora responde.')
     ],
     continua:true},
    {texto:'Não responder e ir embora.',
     ef:{registrar:'Não respondeu à pergunta do curador de Lavender.'},
     resultado:[
       'Você não responde. Ele não insiste — ele claramente não insiste desde 1978.',
       fala('Fabre', 'Tudo bem. Eu anoto isso também.'),
       'Ele escreve alguma coisa curta e fecha o caderno.',
       'Você vai lembrar dessa pergunta em lugares onde ela não tem nada a ver, pelos próximos meses.'
     ]}
  ]
},
{
  id:'lav_a_cidade_sem_musica', peso:2,
  titulo:'A cidade sem música',
  texto:[
    'Você percebe depois de meia hora e depois não consegue mais desperceber.',
    'Lavender não tem música em lugar nenhum. Nenhum rádio ligado, nenhuma loja com som, nenhuma buzina com melodia.',
    'É uma cidade de umas oitocentas pessoas em silêncio de dia inteiro.'
  ],
  escolhas:[
    {texto:'Perguntar na primeira porta por que não tem música.',
     ef:{flag:'sabe_por_que_lavender_nao_tem_musica',
         rep:{eixo:'bom',delta:1,motivo:'Perguntou o que ninguém de fora pergunta'},
         registrar:'Lavender não tem música por um acordo que ninguém assinou, desde o incêndio de 1982.'},
     resultado:[
       fala('a dona da marcenaria', 'Ninguém combinou nada.'),
       fala('a dona da marcenaria', 'Em 1982 teve um incêndio na Torre e morreu gente, e naquela semana ninguém ligou rádio.'),
       fala('a dona da marcenaria', 'Aí passou a semana e ninguém ligou de novo. E depois virou uma coisa que a gente é.', 'baixo'),
       fala('a dona da marcenaria', 'Tem gente aqui que nasceu depois de 82 e que acha que cidade é assim em todo lugar.')
     ]},
    {texto:'Cantar. Baixinho, andando, só pra ver o que acontece.',
     ef:{moral:2, flag:'cantou_em_lavender',
         rep:{eixo:'bom',delta:1,motivo:'Cantou baixinho numa cidade que parou de cantar em 1982'},
         registrar:'Cantou baixinho andando por Lavender.'},
     resultado:[
       'Você canta baixinho, andando, uma coisa qualquer.',
       'Três pessoas olham. Nenhuma reclama. Uma senhora na janela para de varrer e fica ouvindo até você virar a esquina.',
       'Na esquina, uma criança de uns sete anos te pergunta o que é aquilo que você estava fazendo com a boca.',
       'Você não tem uma boa resposta pra isso.'
     ]},
    {texto:'Respeitar o silêncio.', ef:{},
     resultado:['Você respeita o silêncio e anda em silêncio, como todo mundo aqui.','Foi a coisa certa a fazer e mesmo assim não parece.']}
  ]
}
],

/* ─────────────── CELADON ─────────────── */
celadon:[
{
  id:'cel_sem_lugar_pra_sentar', umaVez:true, peso:3,
  titulo:'Sete andares e nenhum banco',
  texto:[
    'Tem um senhor de uns setenta anos sentado no chão do corredor do quarto andar do shopping, encostado numa coluna, com duas sacolas do lado.',
    fala('o senhor do corredor', 'Sete andares de loja e nenhum lugar pra sentar de graça.'),
    fala('o senhor do corredor', 'Tem cadeira na praça de alimentação. Cadeira de quem compra. Eu já comprei o que eu vim comprar.'),
    'Um segurança olha de longe, decide alguma coisa, e não vem.'
  ],
  escolhas:[
    {texto:'Sentar no chão do lado dele.',
     ef:{moral:3, flag:'sentou_no_chao_do_shopping',
         rep:{eixo:'bom',delta:2,motivo:'Sentou no chão do shopping ao lado de quem estava sentado no chão'},
         registrar:'Sentou no chão do quarto andar do shopping de Celadon, ao lado de um senhor de setenta anos.'},
     resultado:[
       'Você senta. O segurança olha de novo e decide de novo não vir, e dessa vez a decisão parece ter custado mais.',
       'Vocês dois ficam ali uns vinte minutos falando de nada.',
       'Em vinte minutos, mais quatro pessoas sentam no chão do corredor. Nenhuma delas se conhece.',
       fala('o senhor do corredor', 'Olha isso.', 'riso'),
       fala('o senhor do corredor', 'Eu sento aqui toda semana há dois anos e nunca aconteceu isso.')
     ]},
    {texto:'Comprar um café na praça de alimentação e dar o recibo a ele.',
     cond:d=>d.jogador.dinheiro >= 500,
     ef:{dinheiro:-500, moral:2, flag:'comprou_o_direito_de_sentar',
         rep:{eixo:'bom',delta:1,motivo:'Comprou o direito de alguém sentar numa cadeira'},
         registrar:'Comprou um café pra um senhor ter direito à cadeira da praça de alimentação.'},
     resultado:[
       'Você compra o café mais barato e entrega o copo e o recibo.',
       'Ele entende na hora o que você fez e não gosta muito, e vai pra praça de alimentação assim mesmo.',
       fala('o senhor do corredor', 'Obrigado. E eu continuo achando um absurdo.'),
       d=>fala(d.jogador.nome, 'É um absurdo.'),
       fala('o senhor do corredor', 'Ótimo. Então a gente concorda e eu vou sentar.', 'riso')
     ]},
    {texto:'Reclamar na administração do shopping.',
     ef:{flag:'reclamou_do_banco',
         rep:{eixo:'bom',delta:1,motivo:'Levou a reclamação a quem podia resolver'},
         registrar:'Reclamou na administração do shopping de Celadon sobre a falta de banco.'},
     resultado:[
       'A moça da administração anota numa ficha de duas vias e te dá a segunda via, o que já é mais do que você esperava.',
       fala('a moça da administração', 'É a quarta este ano.'),
       fala('a moça da administração', 'Banco ocupa espaço de vitrine. Você entende que eu entendo você, né? Eu passo oito horas em pé aqui.', 'baixo'),
       'Ela guarda a primeira via numa pasta que já tem três fichas iguais.'
     ]},
    {texto:'Seguir andando.', ef:{},
     resultado:['Você segue. O senhor continua no chão e o segurança continua decidindo não vir.']}
  ]
},
{
  id:'cel_a_vitrine_de_usados', peso:2,
  cond:d=>numInsignias() >= 3,
  titulo:'A vitrine de usados',
  texto:[
    'O quarto andar do shopping tem uma vitrine de usados no fim do corredor, dessas que ninguém para pra olhar.',
    'Relógio sem pulseira. Três câmeras. Uma caixa de medalha escolar, dessas de estante de sala, com sete medalhas dentro e nenhuma etiqueta.',
    fala('o vendedor do quarto andar', 'Isso aí vem de desocupação de casa. Chega de caminhão, a gente separa o que vende.'),
    fala('o vendedor do quarto andar', 'Medalha não vende. Medalha fica aí porque é bonito e porque eu não tenho coragem de jogar fora.')
  ],
  escolhas:[
    {texto:'Pedir pra ver as sete, uma por uma.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Olhou uma por uma o que ninguém para pra olhar'},
         flag:'viu_as_sete_medalhas',
         registrar:'Olhou as sete medalhas da vitrine de usados de Celadon. Uma é de natação, estadual, 1994.'},
     resultado:[
       'Ele abre a caixa e põe as sete no balcão, e você lê as sete.',
       'Quatro são de escola, de participação, sem nome.',
       'Duas são de ginástica, do mesmo clube, do mesmo ano, e claramente da mesma pessoa.',
       'A sétima é de natação. Estadual. 1994.',
       'E tem um nome gravado atrás, em letra pequena, e o sobrenome é Vernon.'
     ]},
    {texto:'Comprar a de natação.',
     cond:d=>!!d.flags.viu_as_sete_medalhas && d.jogador.dinheiro >= 1200,
     ef:{dinheiro:-1200, itens:{'Medalha de natação da filha do Vernon':1},
         flag:'comprou_a_medalha',
         rep:{eixo:'bom',delta:2,motivo:'Comprou de volta uma medalha que tinha sido vendida junto com uma casa'},
         registrar:'Comprou na vitrine de usados de Celadon a medalha de natação da filha do Vernon.'},
     resultado:[
       fala('o vendedor do quarto andar', 'Mil e duzentos. E eu tô cobrando caro de propósito.'),
       d=>fala(d.jogador.nome, 'Por quê?'),
       fala('o vendedor do quarto andar', 'Porque em quatro anos você é a primeira pessoa que pediu pra ver uma medalha dessa caixa.'),
       fala('o vendedor do quarto andar', 'Se é caro você desiste e eu fico com ela. Se você paga, é porque você sabe pra onde ela vai.', 'baixo'),
       'Você paga. Ele embrulha em papel de seda, que ele claramente não usa pra mais nada nessa loja.'
     ]},
    {texto:'Perguntar de onde veio a caixa.',
     ef:{flag:'a_caixa_veio_de_pallet',
         registrar:'A caixa de medalhas da vitrine de Celadon veio de uma desocupação em Pallet, em 1995.'},
     resultado:[
       'Ele puxa um caderno de trás do balcão, corre o dedo e acha em quinze segundos, o que quer dizer que esse caderno é bem feito.',
       fala('o vendedor do quarto andar', 'Lote 331. Desocupação residencial, 1995.'),
       fala('o vendedor do quarto andar', 'Cidade de origem: Pallet.'),
       'Pallet.'
     ]},
    {texto:'Seguir pro que você veio fazer.', ef:{},
     resultado:['Você segue. A caixa de sete medalhas continua na vitrine, onde está há quatro anos.']}
  ]
},
{
  id:'cel_maquina_do_canto', peso:2,
  cond:d=>numInsignias() >= 4,
  titulo:'A máquina do canto',
  texto:[
    'O saguão do cassino tem quarenta máquinas e uma delas fica no canto, atrás de uma coluna, sem cadeira na frente.',
    'Tem uma fila de três pessoas esperando pra usar justamente aquela.',
    fala('o primeiro da fila da máquina', 'Essa aqui paga. As outras não pagam, essa paga.'),
    fala('o primeiro da fila da máquina', 'Todo mundo sabe. Por isso tem fila.')
  ],
  escolhas:[
    {texto:'Ficar olhando a máquina por vinte minutos antes de qualquer coisa.',
     ef:{flag:'observou_a_maquina_do_canto',
         rep:{eixo:'bom',delta:1,motivo:'Olhou antes de jogar'},
         registrar:'A máquina do canto do cassino não paga mais que as outras. Paga em porções menores e mais seguidas.'},
     resultado:[
       'Você conta. Em vinte minutos, quatro pessoas jogam.',
       'A máquina paga sete vezes. Sete! Em vinte minutos!',
       'Você soma o que ela pagou e soma o que ela comeu, e a conta dá menos do que as outras máquinas do saguão.',
       'Ela paga muito mais vezes e muito menos. É por isso que tem fila.',
       'Você olha pra aquilo com uma admiração horrível.'
     ]},
    {texto:'Contar pra fila o que você viu.',
     cond:d=>!!d.flags.observou_a_maquina_do_canto,
     ef:{rep:{eixo:'bom',delta:2,motivo:'Contou pra fila o que a máquina do canto realmente fazia'},
         flag:'contou_da_maquina', registrar:'Contou pra fila do cassino o que a máquina do canto realmente faz.'},
     resultado:[
       'Você explica a conta. Duas pessoas ouvem e uma sai da fila.',
       fala('o primeiro da fila da máquina', 'Eu sei disso.', 'baixo'),
       fala('o primeiro da fila da máquina', 'Eu sei disso há uns dois anos, {moço|moça}. Eu continuo na fila.'),
       'Ele não fala mais nada e você não tem o que responder.'
     ]},
    {texto:'Jogar.',
     cond:d=>d.jogador.dinheiro >= 1000,
     ef:{executar:d=>{
        const ganho = Dados.chance(62) ? Dados.entre(100, 400) : -Dados.entre(400, 900);
        Estado.j.dinheiro = Math.max(0, Estado.j.dinheiro + ganho);
        return [{tipo: ganho > 0 ? 'item' : 'dano', texto:(ganho>0?'+':'')+ganho+' ₽'}];
      },
      flag:'jogou_na_maquina_do_canto',
      registrar:'Jogou na máquina do canto do cassino de Celadon.'},
     resultado:[
       'Você entra na fila, espera onze minutos, e joga.',
       'Ela paga. Ela paga de novo. Ela paga uma terceira vez e você começa a entender por que tem fila.',
       'E aí você olha o saldo.'
     ]},
    {texto:'Sair do cassino.', ef:{},
     resultado:['Você sai. Na porta tem um cartaz da própria casa avisando que jogo é entretenimento e não investimento, e o cartaz está torto.']}
  ]
}
],

/* ─────────────── FUCHSIA ─────────────── */
fuchsia:[
{
  id:'fuc_a_placa_corrigida', umaVez:true, peso:3,
  titulo:'O horário de domingo',
  texto:[
    'A placa de horários na entrada da reserva é de metal esmaltado e deve ter uns quinze anos.',
    'O horário de domingo foi corrigido a caneta, por cima do esmalte, e a correção já está gasta.',
    'Embaixo da correção a caneta, tem outra correção a caneta, mais antiga ainda.',
    fala('o porteiro da reserva', 'Essa placa já foi corrigida quatro vezes. A quinta a gente escreve em papel e cola com fita.')
  ],
  escolhas:[
    {texto:'Perguntar por que não trocam a placa.',
     ef:{flag:'sabe_da_placa_da_reserva',
         registrar:'A placa da reserva não é trocada porque trocar exige assinatura de um cargo que está vago há três anos.'},
     resultado:[
       fala('o porteiro da reserva', 'Porque placa é patrimônio.'),
       fala('o porteiro da reserva', 'Pra trocar precisa de baixa de patrimônio, e baixa de patrimônio precisa de assinatura do diretor de área.'),
       fala('o porteiro da reserva', 'O cargo de diretor de área tá vago desde 1994.', 'frio'),
       'Três anos de cargo vago. Uma placa de horário. Quatro correções a caneta.'
     ]},
    {texto:'Perguntar o que MAIS depende dessa assinatura.',
     cond:d=>!!d.flags.sabe_da_placa_da_reserva,
     ef:{itens:{'Lista do que depende do diretor de área':1},
         flag:'lista_do_diretor_de_area',
         rep:{eixo:'bom',delta:3,motivo:'Puxou o fio de uma placa de horário até uma lista inteira', rep:{notorio:true}},
         registrar:'O cargo vago de diretor de área trava onze coisas na reserva, incluindo laudo de óbito de Pokémon.'},
     resultado:[
       'Ele para. Ele olha pra você de um jeito diferente.',
       fala('o porteiro da reserva', 'Espera aqui.'),
       'Ele volta em quatro minutos com uma folha datilografada que claramente alguém já tinha preparado antes, e que estava esperando alguém perguntar.',
       'Onze itens. Placa de horário é o número nove.',
       'O número um é: LAUDO DE ÓBITO DE POKÉMON EM CATIVEIRO — AGUARDANDO ASSINATURA.',
       fala('o porteiro da reserva', 'Tem coisa esperando desde 95 nessa lista, {moço|moça}.', 'baixo')
     ]},
    {texto:'Corrigir a placa você mesm{o|a}, com caneta, pela quinta vez.',
     ef:{moral:1, rep:{eixo:'bom',delta:1,motivo:'Corrigiu a placa pela quinta vez'},
         registrar:'Corrigiu a placa de horário da reserva de Fuchsia pela quinta vez, a caneta.'},
     resultado:[
       'Você pede a caneta e escreve o horário certo por cima do horário errado por cima do horário errado.',
       fala('o porteiro da reserva', 'Agora tem cinco.', 'riso'),
       fala('o porteiro da reserva', 'Daqui a dez anos isso aqui vai ser uma placa de caneta com um pouco de esmalte embaixo.')
     ]},
    {texto:'Entrar na reserva e esquecer a placa.', ef:{},
     resultado:['Você entra. A placa continua com quatro correções e o cargo continua vago.']}
  ]
},
{
  id:'fuc_o_onibus_das_quatro', peso:2,
  titulo:'O ônibus das quatro',
  texto:[
    'Às quatro da tarde o ônibus da Zona Safári descarrega quarenta pessoas de chapéu novo, e a cidade aumenta de volume por vinte minutos.',
    'Todos os quarenta compraram o chapéu na entrada. Todos os quarenta estão falando ao mesmo tempo sobre o que viram.',
    'Um deles está calado, no fim da fila, segurando uma Pokébola vazia.'
  ],
  escolhas:[
    {texto:'Falar com o que está calado.',
     ef:{moral:2, rep:{eixo:'bom',delta:2,motivo:'Falou com o único calado numa multidão barulhenta'},
         flag:'o_homem_da_bola_vazia',
         registrar:'Na Zona Safári, um homem gastou trinta Pokébolas e não pegou nada. Era a trigésima primeira visita dele.'},
     resultado:[
       fala('o homem da Pokébola vazia', 'Trinta Pokébolas. Trinta.'),
       fala('o homem da Pokébola vazia', 'Eu venho aqui desde 1994. Essa foi a trigésima primeira vez.'),
       d=>fala(d.jogador.nome, 'E nunca pegou nada?'),
       fala('o homem da Pokébola vazia', 'Peguei doze. Todos os doze eu soltei no portão, na saída.', 'baixo'),
       fala('o homem da Pokébola vazia', 'Eu não venho aqui pra levar. Eu venho aqui porque lá dentro eu consigo dormir de olho aberto, se é que você me entende.'),
       'Você não entende. Você vai entender daqui a uns meses.'
     ]},
    {texto:'Perguntar aos quarenta o que eles viram.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Ouviu quarenta pessoas falando ao mesmo tempo'},
         registrar:'Quarenta pessoas do ônibus da Zona viram quarenta coisas diferentes, e três juram ter visto a mesma.'},
     resultado:[
       'Você pergunta e eles respondem TODOS AO MESMO TEMPO, e é impossível e é ótimo.',
       'Quarenta pessoas viram quarenta coisas diferentes na mesma reserva no mesmo dia.',
       'Três delas juram ter visto a mesma coisa num lugar onde essa coisa não devia estar, e as três discordam sobre o tamanho.',
       'Uma delas tem foto. A foto está tremida e não dá pra ver nada e ela vai mostrar essa foto pro resto da vida.'
     ]},
    {texto:'Deixar os quarenta passarem.', ef:{},
     resultado:['Você espera os quarenta passarem, o que leva quatro minutos, e a rua fica silenciosa de novo de uma vez só.']}
  ]
}
],

/* ─────────────── SAFFRON ─────────────── */
saffron:[
{
  id:'saf_estagiarios_da_escada', umaVez:true, peso:3,
  titulo:'A escada do prédio comercial',
  texto:[
    'Seis estagiários almoçam sentados na escada do prédio comercial, todos com o mesmo crachá branco, almoçando a mesma comida do mesmo lugar.',
    'Eles têm quarenta minutos e usam trinta e dois, porque leva quatro pra descer e quatro pra subir.',
    fala('o estagiário do fim da escada', 'A gente cronometrou. Na primeira semana a gente cronometrou tudo.')
  ],
  escolhas:[
    {texto:'Sentar na escada e almoçar junto.',
     ef:{moral:3, hp:2, flag:'almocou_com_os_estagiarios',
         rep:{eixo:'bom',delta:1,motivo:'Almoçou na escada com seis estagiários de crachá branco'},
         registrar:'Almoçou na escada do prédio comercial de Saffron com seis estagiários.'},
     resultado:[
       'Eles abrem espaço sem perguntar quem você é, o que é a coisa mais Saffron que já aconteceu com você.',
       'Em trinta e dois minutos você fica sabendo: qual andar tem o bebedouro que gela, qual elevador não para no sexto, e qual gerente some às quintas.',
       fala('o estagiário do fim da escada', 'Anota isso aí, que isso vale mais que o salário.'),
       'Você anota. Você vai usar duas dessas três informações antes do fim do ano.'
     ]},
    {texto:'Perguntar o que eles fazem lá dentro.',
     ef:{flag:'sabe_o_que_os_estagiarios_fazem',
         registrar:'Os estagiários de crachá branco passam o dia conferindo número de protocolo contra número de protocolo.'},
     resultado:[
       fala('a estagiária do meio', 'A gente confere número.'),
       d=>fala(d.jogador.nome, 'Número de quê?'),
       fala('a estagiária do meio', 'De protocolo. A gente pega uma pilha de protocolo e confere contra outra pilha de protocolo.'),
       fala('a estagiária do meio', 'Se bate, carimba. Se não bate, separa.'),
       d=>fala(d.jogador.nome, 'E o que acontece com os que não batem?'),
       'Silêncio de seis estagiários.',
       fala('o estagiário do fim da escada', 'A gente separa. Isso é o que a gente faz.', 'baixo')
     ]},
    {texto:'Perguntar onde fica a pilha dos que não batem.',
     cond:d=>!!d.flags.sabe_o_que_os_estagiarios_fazem,
     ef:{flag:'a_pilha_dos_que_nao_batem',
         rep:{eixo:'bom',delta:3,motivo:'Perguntou onde ficava a pilha que ninguém queria mencionar', rep:{notorio:true}},
         registrar:'A pilha dos protocolos que não batem sobe pro nono andar toda sexta, em caixa lacrada.'},
     resultado:[
       'A estagiária do meio olha pros lados de um jeito que você já viu antes nesta cidade.',
       fala('a estagiária do meio', 'Sobe.'),
       d=>fala(d.jogador.nome, 'Sobe pra onde?'),
       fala('a estagiária do meio', 'Nono. Toda sexta, em caixa lacrada, e a caixa não volta.', 'baixo'),
       fala('a estagiária do meio', 'Eu tô aqui há sete meses e eu já mandei umas quarenta caixas pro nono andar.'),
       fala('o estagiário do fim da escada', 'Cala a boca, Cida.', 'frio')
     ]},
    {texto:'Deixar os seis almoçarem em paz.', ef:{},
     resultado:['Você deixa. Eles têm trinta e dois minutos e você já gastou dois.']}
  ]
},
{
  id:'saf_a_mulher_do_nao', peso:2,
  titulo:'Catorze vezes não',
  texto:[
    'Tem uma mulher de terno parada na calçada falando no Pokégear, e em quatro minutos ela diz "não" catorze vezes.',
    'Cada "não" tem uma entonação diferente. Nenhum deles é igual ao anterior.',
    'No décimo quinto ela desliga sem se despedir e fica parada olhando o aparelho.'
  ],
  escolhas:[
    {texto:'Perguntar se ela está bem.',
     ef:{moral:2, rep:{eixo:'bom',delta:2,motivo:'Perguntou se uma desconhecida na calçada estava bem'},
         flag:'perguntou_pra_mulher_do_nao',
         registrar:'Perguntou a uma desconhecida em Saffron se ela estava bem. Ela não sabia responder.'},
     resultado:[
       'Ela demora quatro segundos pra entender que a pergunta é pra ela.',
       fala('a mulher de terno', 'O quê?'),
       d=>fala(d.jogador.nome, 'Se a senhora está bem.'),
       'Ela olha pra você. Olha o crachá dela. Olha o Pokégear.',
       fala('a mulher de terno', 'Ninguém me pergunta isso nessa cidade há uns quatro anos.', 'baixo'),
       fala('a mulher de terno', 'Eu não tô. Obrigada.'),
       'E ela vai embora andando rápido, e você acha que fez uma coisa boa e não tem certeza.'
     ]},
    {texto:'Contar os "não" em voz alta quando ela desligar.',
     ef:{moral:1, rep:{eixo:'bom',delta:1,motivo:'Fez uma desconhecida rir na calçada'},
         registrar:'Contou pra uma mulher de terno que ela tinha dito "não" catorze vezes. Ela riu.'},
     resultado:[
       d=>fala(d.jogador.nome, 'Catorze.'),
       fala('a mulher de terno', 'Catorze o quê?'),
       d=>fala(d.jogador.nome, 'Catorze "não". Eu contei.'),
       'Ela fica em silêncio dois segundos e aí ri alto, no meio da calçada, de um jeito que claramente não estava no roteiro do dia dela.',
       fala('a mulher de terno', 'Catorze. Caramba.', 'riso'),
       fala('a mulher de terno', 'E eu vou ter que dizer mais uns quarenta hoje.')
     ]},
    {texto:'Seguir andando.', ef:{},
     resultado:['Você segue. Ela ainda está parada olhando o aparelho quando você vira a esquina.']}
  ]
}
],

/* ─────────────── CINNABAR ─────────────── */
cinnabar:[
{
  id:'cin_a_janela_acesa', umaVez:true, peso:3,
  titulo:'A janela do laboratório',
  texto:[
    'O laboratório tem uma janela no térreo onde dá pra ver uma bancada com a luz acesa.',
    'A luz está acesa a qualquer hora que você passe — de manhã, à tarde, às duas da madrugada.',
    'Ninguém nunca está sentado nela.',
    fala('a moça da vitrine', 'Aquela luz tá acesa desde antes de eu nascer aqui.')
  ],
  escolhas:[
    {texto:'Bater na janela.',
     ef:{flag:'bateu_na_janela_do_lab',
         rep:{eixo:'bom',delta:1,motivo:'Bateu numa janela que todo mundo só olhava'},
         registrar:'Bateu na janela acesa do laboratório de Cinnabar. Alguém apareceu.'},
     resultado:[
       'Você bate no vidro com dois nós do dedo, duas vezes.',
       'Nada acontece por uns quinze segundos.',
       'E aí uma pessoa aparece de um canto que você não conseguia ver — de jaleco, de uns sessenta anos, com um caderno na mão.',
       'Ela olha pra você através do vidro, sem abrir, sem falar.',
       'E aí ela levanta o caderno e mostra uma página escrita, virada pra você.',
       fala('a página do caderno', 'NÃO FUNCIONA. TENTE A PORTA.', 'frio'),
       'A porta do laboratório está trancada há três anos.'
     ]},
    {texto:'Perguntar na vitrine quem trabalha ali.',
     ef:{flag:'sabe_de_quem_e_a_bancada',
         registrar:'A bancada acesa do laboratório de Cinnabar era do Dr. Fuji. A luz nunca foi apagada.'},
     resultado:[
       fala('a moça da vitrine', 'Aquela bancada era do Fuji.'),
       fala('a moça da vitrine', 'Ele saiu daqui em 1996 e foi pra Lavender e nunca mais voltou.'),
       d=>fala(d.jogador.nome, 'E por que a luz continua acesa?'),
       fala('a moça da vitrine', 'Porque ninguém desligou.', 'baixo'),
       fala('a moça da vitrine', 'Não tem mistério nenhum, {moço|moça}. Ninguém desligou e agora ninguém tem coragem de ser o primeiro.')
     ]},
    {texto:'Ficar olhando a bancada por dez minutos, anotando o que tem em cima.',
     ef:{itens:{'Lista do que tem na bancada acesa':1},
         flag:'anotou_a_bancada',
         rep:{eixo:'bom',delta:2,motivo:'Anotou o que estava à vista numa janela de rua'},
         registrar:'Anotou o que tem na bancada acesa do laboratório: caderno aberto na página 61, xícara, e um formulário.'},
     resultado:[
       'Um caderno aberto, virado pra baixo, na página sessenta e um.',
       'Uma xícara com alguma coisa seca no fundo.',
       'Três frascos vazios e um quarto não.',
       'E um formulário em branco, preso a uma prancheta, com o cabeçalho virado pra janela.',
       'Você consegue ler o cabeçalho do formulário e é: FORMULÁRIO DE RETIRADA — CADERNO 7.'
     ]},
    {texto:'Seguir andando.', ef:{},
     resultado:['Você segue. A luz continua acesa atrás de você e vai continuar por bastante tempo.']}
  ]
},
{
  id:'cin_o_barqueiro_e_o_mar', peso:2,
  cond:d=>numInsignias() >= 5,
  titulo:'O mar está diferente',
  texto:[
    'O barqueiro está sentado no píer com os pés pra fora, sem barco atracado, olhando a água.',
    fala('o barqueiro', 'O mar tá diferente.'),
    'Ele não olha pra você quando fala. Ele fala pro mar.',
    fala('o barqueiro', 'Não é maré. Eu sei o que é maré. Eu tenho cinquenta e um anos e quarenta deles nessa água.')
  ],
  escolhas:[
    {texto:'Sentar no píer e perguntar o que mudou exatamente.',
     ef:{flag:'o_que_o_barqueiro_notou',
         rep:{eixo:'bom',delta:2,motivo:'Sentou no píer e ouviu quem trabalha na água há quarenta anos'},
         registrar:'O barqueiro de Cinnabar: a água esquentou meio grau e os cardumes de Magikarp desceram.'},
     resultado:[
       fala('o barqueiro', 'A temperatura. Meio grau, talvez menos.'),
       fala('o barqueiro', 'Meio grau não é nada pra ninguém. Pra Magikarp é tudo.'),
       fala('o barqueiro', 'Os Magikarp desceram. Tudo que caçava Magikarp na superfície sumiu. E o que comia esses sumiu atrás.'),
       fala('o barqueiro', 'Em três meses. Três meses, {moço|moça}.', 'baixo'),
       'Ele olha pro vulcão. Você olha pro vulcão. Nenhum dos dois fala o que os dois estão pensando.'
     ]},
    {texto:'Perguntar se ele contou isso pra alguém.',
     ef:{flag:'ninguem_ouviu_o_barqueiro',
         rep:{eixo:'bom',delta:1,motivo:'Perguntou se alguém tinha ouvido'},
         registrar:'O barqueiro avisou quatro órgãos sobre a água. Nenhum respondeu.'},
     resultado:[
       fala('o barqueiro', 'Quatro lugares. Eu escrevi pra quatro lugares.'),
       fala('o barqueiro', 'Prefeitura, capitania, o instituto de Cinnabar e a Liga.'),
       d=>fala(d.jogador.nome, 'E?'),
       fala('o barqueiro', 'A Liga respondeu.', null, 'Ele tira um papel dobrado do bolso da camisa, onde ele claramente carrega há um tempo.'),
       fala('a resposta da Liga', 'PREZADO SENHOR, SUA MANIFESTAÇÃO FOI REGISTRADA SOB O PROTOCOLO ABAIXO E ENCAMINHADA AO ÓRGÃO COMPETENTE.', 'frio'),
       fala('o barqueiro', 'Isso aqui foi em maio.')
     ]},
    {texto:'Pedir a cópia do protocolo.',
     cond:d=>!!d.flags.ninguem_ouviu_o_barqueiro,
     ef:{itens:{'Protocolo da manifestação do barqueiro':1},
         flag:'tem_o_protocolo_do_barqueiro',
         rep:{eixo:'bom',delta:2,motivo:'Pediu o papel que ninguém tinha pedido', rep:{notorio:true}},
         npc:{nome:'Barqueiro de Cinnabar', opiniao:4, memoria:'Você foi a primeira pessoa a pedir o protocolo dele.'},
         registrar:'Pegou o protocolo da manifestação do barqueiro de Cinnabar sobre a temperatura da água.'},
     resultado:[
       'Ele desdobra o papel, alisa na perna da calça, e te entrega sem hesitar meio segundo.',
       fala('o barqueiro', 'Leva. Eu sei o número de cor.'),
       fala('o barqueiro', 'Eu leio esse papel todo dia de manhã há quatro meses. Eu sei o número de cor.', 'baixo'),
       'O número do protocolo começa com os mesmos quatro dígitos de outro protocolo que você já viu.'
     ]},
    {texto:'Ficar olhando a água junto, sem falar nada.',
     ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Ficou olhando a água junto com quem precisava de companhia'},
         registrar:'Ficou sentado no píer de Cinnabar olhando a água com o barqueiro.'},
     resultado:[
       'Vocês dois ficam ali uns vinte minutos e não falam mais nada.',
       'A água está exatamente igual a qualquer outra água pra você.',
       'Pra ele, não.'
     ]}
  ]
}

]

};

/* ============================================================
   EVENTOS QUE ACONTECEM EM QUALQUER CIDADE
   A vida que qualquer lugar tem, com peso menor.
   ============================================================ */
const EVENTOS_GERAIS = [
{
  /* Uma vez por mês a perua do laboratório passa. Não é evento de
     uma vez só: ele volta, porque a volta dele é mensal mesmo. */
  id:'ger_a_perua', peso:3,
  /* A volta dele é fixa e ele não atrasa: cada cidade tem o seu dia
     do mês, e a perua só está aqui se hoje for o dia daqui. */
  cond:d=>{
    const DIA_DA_CIDADE = {pallet:1, viridian:2, pewter:4, cerulean:6, vermilion:8,
                           lavender:10, celadon:12, saffron:14, fuchsia:15, cinnabar:16};
    const quando = DIA_DA_CIDADE[Mundo.id()];
    if (!quando) return false;
    const hoje = (((d.relogio && d.relogio.dia) || 1) - 1) % 30 + 1;
    return Math.abs(hoje - quando) <= 1;
  },
  titulo:'A perua na praça',
  texto:[
    'Tem uma perua velha estacionada de lado na praça, ocupando duas vagas, com o portamalas aberto e uma lona esticada por cima.',
    'Na lataria, em letra que já foi verde: LABORATÓRIO DE PESQUISA — PALLET.',
    d=>conheceOCelio(d)
      ? 'Célio está sentado no banquinho dobrável de sempre, com o caderno de capa dura no colo. Ele te vê antes de você chegar perto e levanta a caneta uns dois centímetros, que é o cumprimento dele.'
      : 'Um homem de uns cinquenta anos está sentado num banquinho dobrável ao lado do portamalas, com um caderno de capa dura no colo e uma caneta amarrada no caderno com barbante.',
    d=>{
      if (!conheceOCelio(d)) return '';
      const p = (d.time || []).find(x => x.dex === (d.jogador.inicialDex || 0)) || (d.time || [])[0];
      return fala('Célio', p
        ? `${d.jogador.nome}! E ${p.apelido ? 'o ' + p.apelido : 'o ' + p.nome}, olha só. Tá ${p.nivel >= 16 ? 'enorme' : 'crescendo'}. Eu falei que ia dar certo.`
        : `${d.jogador.nome}! Eu lembro de você. Lembro de todo mundo.`, 'riso');
    },
    'Tem duas pessoas esperando. Uma delas tem uns quinze anos e não consegue ficar parada.'
  ],
  escolhas:[
    {texto:'Ficar olhando a entrega de longe.',
     ef:{moral:2, registrar:'Ficou olhando a perua do laboratório entregar a Pokébola de outra pessoa.'},
     resultado:[
       'O menino assina, pega a Pokébola com as duas mãos e abre ali mesmo, sem sair de perto do carro.',
       'O que sai da Pokébola olha a praça inteira antes de olhar ele.',
       'Você reconhece a cena, e sorri sem perceber.',
       fala('Célio', 'Essa parte é sempre a melhor.', 'baixo', 'Ele fala sem olhar pra você, anotando.')
     ]},
    {texto:'Perguntar se ele precisa de ajuda pra carregar.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Ajudou a carregar a perua do laboratório'},
         executar:d=>{ Estado.darItem('Potion',1); Estado.lembrarNPC('Célio',{opiniao:2,memoria:'Ajudou a carregar a perua sem pedir nada.'});
                       return [{tipo:'item', texto:'Recebeu 1× Potion da caixa de sobras.'}]; }},
     resultado:[
       fala('Célio', 'Precisar eu não preciso. Aceitar eu aceito.', 'riso'),
       'São quatro caixas e uma delas é pesada de um jeito desproporcional ao tamanho.',
       fala('Célio', 'Livro. É sempre livro que pesa.'),
       fala('Célio', 'Pega uma Potion ali da caixa de sobra. Não é pagamento, é que eu odeio levar de volta.')
     ]},
    {texto:'Perguntar qual foi a entrega mais engraçada do mês.',
     cond:d=>!!d.flags.sabe_do_nr,
     ef:{registrar:'Ouviu do Célio a entrega mais engraçada do mês.'},
     resultado:[
       fala('Célio', 'Semana passada, em Pewter.', 'riso'),
       'Ele nem precisa pensar.',
       fala('Célio', 'Um Charmander espirrou fagulha na sobrancelha do menino na hora da foto. O menino achou o máximo. A mãe dele, menos.'),
       fala('Célio', 'Foto saiu ótima, por sinal.', 'riso')
     ]},
    {texto:'Anotar o número dele antes de seguir.',
     cond:d=>!d.flags.numero_do_goro && !Estado.temNumero('goro'),
     ef:{flag:'numero_do_goro',
         npc:{nome:'Célio', opiniao:1, memoria:'Te deu o número na praça, do jeito que dá pra todo mundo.'},
         registrar:'Anotou o número de Célio, da perua do laboratório.'},
     resultado:[
       fala('Célio', 'Anota, vai. Todo mundo que eu entrego tem.'),
       'Ele dita sete dígitos de cor, devagar, do jeito de quem já ditou esse número mil vezes.',
       fala('Célio', 'Liga contando como vocês estão. Eu gosto de saber.', 'riso')
     ]},
    {texto:'Seguir. Não é com você.', ef:{},
     resultado:['Você passa. Atrás de você alguém abre uma Pokébola e a praça inteira faz aquele barulho pequeno de quando vê.']}
  ]
},
{
  id:'ger_bicho_na_calcada', peso:2,
  titulo:'Um Pokémon na calçada',
  texto:[
    d=>{
      const esp = DEX[Dados.escolher(poolSelvagem())];
      d._evEsp = esp.nome;
      return `Tem um ${esp.nome} parado no meio da calçada, em plena cidade, olhando as pessoas passarem.`;
    },
    'Ninguém para. Todo mundo desvia. Duas pessoas desviam sem olhar, o que quer dizer que ele está ali há tempo suficiente pra virar mobília.'
  ],
  escolhas:[
    {texto:'Agachar e ficar na altura dele.',
     ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Agachou na calçada pra ficar na altura de um Pokémon'},
         registrar:'Agachou na calçada pra ficar na altura de um Pokémon que ninguém estava olhando.'},
     resultado:[
       'Você agacha. Ele não foge.',
       'Vocês dois ficam na altura um do outro por uns quarenta segundos, no meio de uma calçada, enquanto a cidade inteira passa em volta.',
       'Uma senhora te pergunta se você está passando mal.',
       'Você diz que não e continua agachad{o|a}.'
     ]},
    {texto:'Perguntar na loja mais próxima se ele é de alguém.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Perguntou se o Pokémon da calçada tinha dono'},
         registrar:'Perguntou na loja se o Pokémon da calçada era de alguém. Era, e não era.'},
     resultado:[
       fala('a moça da loja', 'É da rua.'),
       fala('a moça da loja', 'Não é de ninguém e é de todo mundo. A gente dá comida, o médico de Pokémon olha de vez em quando, e ele dorme onde quer.'),
       fala('a moça da loja', 'Se você levar ele eu não vou impedir. Mas ele não vai querer ir.')
     ]},
    {texto:'Dar comida.',
     cond:d=>Estado.contaItem('Ração') > 0,
     ef:{itens:{'Ração':-1}, moral:2,
         rep:{eixo:'bom',delta:1,motivo:'Dividiu comida com um Pokémon de rua'},
         registrar:'Dividiu Ração com um Pokémon de rua.'},
     resultado:[
       'Ele come sem pressa, do jeito de quem não está com fome mas não recusa por educação.',
       'Quando acaba, ele encosta a cabeça na sua perna por exatamente um segundo e sai andando.',
       'Um segundo. Você ficou olhando ele ir embora por bem mais tempo que isso.'
     ]},
    {texto:'Desviar, como todo mundo.', ef:{},
     resultado:['Você desvia. Você olha, o que já é mais do que os outros fizeram, e desvia.']}
  ]
},
{
  id:'ger_treinador_perdido', peso:2,
  cond:d=>numInsignias() >= 1,
  titulo:'Alguém com um mapa',
  texto:[
    'Tem uma pessoa de uns trinta anos parada numa esquina com um mapa de Kanto aberto, girando o mapa em vez de girar o corpo.',
    fala('a pessoa do mapa', 'Desculpa. Desculpa, você é daqui?'),
    fala('a pessoa do mapa', 'Eu preciso chegar no Centro Pokémon e eu já passei nessa esquina três vezes.')
  ],
  escolhas:[
    {texto:'Levar até lá.',
     ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Levou alguém perdido até o destino em vez de apontar'},
         registrar:'Levou até o Centro Pokémon alguém que estava girando o mapa numa esquina.'},
     resultado:[
       'São quatro quarteirões e vocês conversam o caminho inteiro.',
       'Ela começou a jornada aos trinta e um anos porque o filho dela começou aos onze e ela ficou com inveja, e ela fala isso rindo e não é inteiramente piada.',
       fala('a pessoa do mapa', 'Todo mundo aqui tem a idade do meu filho. TODO MUNDO.', 'riso'),
       fala('a pessoa do mapa', 'Mas eu tô me divertindo mais do que ele, e eu ligo pra ele todo domingo só pra dizer isso.')
     ]},
    {texto:'Ensinar a ler o mapa de uma vez.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Ensinou a ler o mapa em vez de levar pela mão'},
         registrar:'Ensinou alguém a orientar o mapa pelo sol numa esquina qualquer.'},
     resultado:[
       'Você mostra como orientar pelo sol, que às três da tarde em Kanto é o mais fácil que tem.',
       'Ela vira o mapa uma vez e aponta a direção certa de primeira.',
       fala('a pessoa do mapa', 'Isso é tão simples que eu tô com raiva.'),
       fala('a pessoa do mapa', 'Onze anos de escola e ninguém nunca me falou do sol.')
     ]},
    {texto:'Apontar e seguir.', ef:{},
     resultado:['Você aponta. Ela agradece. Você tem quase certeza de que ela vai errar de novo na próxima esquina.']}
  ]
},
{
  id:'ger_cartaz_novo', peso:1,
  cond:d=>numInsignias() >= 3,
  titulo:'Um cartaz no poste',
  texto:[
    'Tem um cartaz novo no poste, impresso em papel comum, ainda sem chuva em cima.',
    'PROCURA-SE. E uma foto ruim de licença, de um garoto de uns quinze anos.',
    'Embaixo: "Saiu de casa em março. A família não está brava. Qualquer informação."',
    'Março foi há bastante tempo.'
  ],
  escolhas:[
    {texto:'Anotar o contato.',
     ef:{itens:{'Contato do cartaz de procura-se':1},
         rep:{eixo:'bom',delta:1,motivo:'Anotou o contato de uma família que está procurando alguém'},
         registrar:'Anotou o contato de um cartaz de procura-se. O garoto saiu de casa em março.'},
     resultado:[
       'Você anota o telefone no verso de outra coisa, que é onde você anota tudo.',
       'Você olha a foto por mais tempo do que precisava e não reconhece a cara, e mesmo assim guarda.',
       'A partir de hoje você vai olhar a cara das pessoas de quinze anos nas cidades por onde passar. Vai ser automático. Você não vai conseguir evitar.'
     ]},
    {texto:'Ligar do orelhão agora mesmo, só pra dizer que viu o cartaz.',
     cond:d=>Estado.temPokenav(),
     ef:{moral:2, rep:{eixo:'bom',delta:2,motivo:'Ligou pra uma família só pra dizer que o cartaz foi lido'},
         registrar:'Ligou pra família do cartaz só pra avisar que alguém tinha lido.'},
     resultado:[
       'Atende no primeiro toque, o que diz muita coisa sobre quem está do lado de lá.',
       fala('a voz do outro lado', 'Alô? ALÔ?', 'grita'),
       d=>fala(d.jogador.nome, 'Eu não vi ele. Desculpa. Eu só vi o cartaz e eu queria avisar que alguém leu.'),
       'Silêncio de uns quatro segundos.',
       fala('a voz do outro lado', 'Obrigada.', 'baixo'),
       fala('a voz do outro lado', 'Ninguém nunca liga pra dizer isso.')
     ]},
    {texto:'Endireitar o cartaz, que está torto, e seguir.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Endireitou o cartaz de procura-se de outra pessoa'},
         registrar:'Endireitou um cartaz de procura-se num poste.'},
     resultado:['Você tira o percevejo, alinha o papel e prega de volta reto.','É a menor coisa que se pode fazer e você faz.']},
    {texto:'Seguir andando.', ef:{}, resultado:['Você segue. O cartaz continua torto no poste.']}
  ]
}
];

/* ============================================================
   EVENTOS DE ROTA — por ambiente, não por rota
   Estrada tem menos gente e mais bicho, e é onde o temperamento
   do seu time decide as coisas: quem você leva no cinto muda o
   dado, e a tela sempre diz por quê.
   ============================================================ */
const EVENTOS_ROTA = {

campo:[
{
  id:'rot_cerca_caida', peso:2, ambientes:['campo'],
  titulo:'A cerca caída',
  texto:[
    'Uns quinze metros de cerca estão no chão, derrubados por peso e não por vento: os mourões saíram inteiros, com terra na ponta.',
    'Do outro lado tem pasto, e no pasto tem seis Miltank que claramente já entenderam a oportunidade e estão indo devagar na direção da estrada.',
    'Não tem casa à vista. Tem uma caixa de correio a uns duzentos metros, torta, com um nome apagado.'
  ],
  escolhas:[
    {texto:'Levantar os mourões e escorar com pedra, do jeito que der.',
     teste:{status:'forca', dificuldade:6, nomeStatus:'Força', eixo:'coragem'},
     bom:{ef:{hp:-2, rep:{eixo:'bom',delta:2,motivo:'Levantou a cerca de um estranho sem esperar ninguém'},
              flag:'levantou_a_cerca', registrar:'Levantou sozinho quinze metros de cerca caída numa estrada.'},
          resultado:[
            'Leva quase uma hora e você acaba com as duas mãos em carne viva de segurar arame.',
            'Não fica bonito. Fica de pé, que é o que a cerca precisa ser.',
            'As seis Miltank param de andar na direção da estrada e voltam a fazer a única coisa que Miltank faz.'
          ]},
     ruim:{ef:{hp:-4, registrar:'Tentou levantar a cerca caída e não deu conta sozinho.'},
           resultado:[
             'Você levanta dois mourões e o terceiro te ensina que quinze metros de cerca é coisa de duas pessoas.',
             'Você fica sentad{o|a} no chão olhando a cerca meio de pé, que é pior do que cerca caída porque agora parece que alguém tentou.'
           ]}},
    {texto:'Ir até a caixa de correio e avisar quem mora ali.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Andou duzentos metros pra avisar de uma cerca que não era sua'},
         flag:'avisou_da_cerca'},
     resultado:[
       'A casa fica mais longe do que parecia e quem atende tem uns setenta anos e leva um tempo pra entender o que você está falando.',
       fala('o senhor da casa', 'Caiu de novo?'),
       fala('o senhor da casa', 'Cai todo ano nessa época. É a terra que encharca.'),
       'Ele agradece, pega o chapéu e vai andando pra lá com uma marreta, no ritmo de quem tem setenta anos e vinte anos de cerca caindo.',
       fala('o senhor da casa', 'Obrigado por vir falar. A maioria passa.', 'baixo')
     ]},
    {texto:'Tocar as Miltank de volta pro pasto antes de qualquer coisa.',
     teste:{status:'carisma', dificuldade:6, nomeStatus:'Carisma', eixo:'simpatia'},
     bom:{ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Tocou as Miltank de volta antes que desse acidente na estrada'},
              registrar:'Tocou seis Miltank de volta pro pasto sozinho.'},
          resultado:[
            'Você abre os braços e anda devagar em semicírculo, que é a coisa certa e você não sabe como sabe.',
            'As seis voltam. A quinta olha pra você de um jeito que dá pra ler como ingratidão.',
            'Você ainda vai ter que resolver a cerca, mas pelo menos não vai ter Miltank na pista.'
          ]},
     ruim:{ef:{hp:-3, registrar:'Tentou tocar as Miltank e levou um encontrão.'},
           resultado:[
             'A terceira decide que você é o problema e vem na sua direção com a cabeça baixa.',
             'Você sai de perto mais rápido do que gostaria de admitir e elas continuam exatamente onde queriam estar.'
           ]}},
    {texto:'Não é sua cerca, não é seu rebanho, não é sua estrada.',
     ef:{},
     resultado:['Você passa.','Uns oitocentos metros adiante você ouve uma buzina longa atrás de você e não olha pra trás.']}
  ]
},
{
  id:'rot_bicicleta_quebrada', peso:2, ambientes:['campo','floresta','montanha'],
  titulo:'Alguém empurrando bicicleta',
  texto:[
    'Tem uma pessoa de uns vinte anos empurrando uma bicicleta há tempo suficiente pra ter desistido de ficar brava.',
    'A corrente arrebentou e está enrolada no quadro com uma sacola plástica, do jeito que a gente faz quando não quer perder a peça.',
    fala('a moça da bicicleta', 'Quanto falta pra próxima cidade? Fala rápido, tipo arrancar curativo.')
  ],
  escolhas:[
    {texto:'Olhar a corrente. Talvez dê pra emendar.',
     teste:{status:'intelecto', dificuldade:6, nomeStatus:'Intelecto', eixo:'cuidado'},
     bom:{ef:{rep:{eixo:'bom',delta:1,motivo:'Emendou a corrente da bicicleta de uma desconhecida na estrada'},
              flag:'emendou_a_corrente',
              executar:d=>{ Estado.j.dinheiro += 800; return [{tipo:'item', texto:'+800 ₽ — ela insistiu.'}]; }},
          resultado:[
            'O elo torto sai com uma pedra e um pouco de teimosia, e a corrente volta dois elos mais curta.',
            fala('a moça da bicicleta', 'Ficou curta.'),
            fala('a moça da bicicleta', 'Curta anda. Quebrada não anda.'),
            'Ela te enfia dinheiro na mão, sobe na bicicleta e some numa velocidade que não combina com corrente emendada.'
          ]},
     ruim:{ef:{registrar:'Tentou consertar a corrente de uma bicicleta e não deu.'},
           resultado:[
             'Você mexe dez minutos e chega à conclusão técnica de que a corrente está quebrada.',
             fala('a moça da bicicleta', 'É, eu também tinha chegado nessa.', 'riso')
           ]}},
    {texto:'Empurrar junto até a próxima cidade.',
     ef:{hp:-2, moral:3, rep:{eixo:'bom',delta:2,motivo:'Empurrou bicicleta alheia por quilômetros sem ganhar nada'},
         flag:'empurrou_a_bicicleta'},
     resultado:[
       'Dá quase duas horas, e nas duas horas ela conta a vida inteira dela, incluindo partes que ninguém conta pra estranho.',
       fala('a moça da bicicleta', 'Eu falo demais quando tô com vergonha de aceitar ajuda.'),
       fala('a moça da bicicleta', 'Você reparou e não falou nada. Isso é de boa pessoa.', 'baixo'),
       'Na entrada da cidade ela aperta a sua mão com as duas mãos dela e você não pega o nome dela.'
     ]},
    {texto:'"Falta bastante." E seguir.',
     ef:{},
     resultado:[
       fala('a moça da bicicleta', 'Curativo arrancado. Valeu.', 'riso'),
       'Ela volta a empurrar. Você segue no seu ritmo, que é mais rápido que o dela, e a distância entre vocês aumenta devagar por uns dez minutos.'
     ]}
  ]
},
{
  id:'rot_ninho_no_chao', peso:3, ambientes:['campo','floresta'],
  titulo:'Um ninho no chão da trilha',
  texto:[
    'Tem um ninho no chão, a meio metro da trilha, com três ovos e nenhum adulto por perto.',
    'Não é ninho caído — é ninho de espécie que faz ninho no chão mesmo, e você está em cima dele antes de ver.',
    'A trilha passa exatamente por ali. Quem vier depois de você não vai ver também.'
  ],
  escolhas:[
    {texto:'Marcar a trilha com pedra e galho, pra quem vier desviar.',
     teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção', eixo:'cuidado'},
     bom:{ef:{rep:{eixo:'bom',delta:2,motivo:'Desviou uma trilha inteira por causa de três ovos'},
              flag:'marcou_o_ninho', registrar:'Marcou a trilha com pedra e galho pra desviar de um ninho no chão.'},
          resultado:[
            'Você leva quarenta minutos montando um desvio de pedra e galho que qualquer um entende sem placa.',
            'Fica bom. Fica óbvio. Uma pessoa distraída desvia sem nem perceber que desviou.',
            'Três semanas depois, numa conversa de Centro Pokémon a duas cidades daqui, alguém vai reclamar de um desvio idiota na trilha e você não vai falar nada.'
          ]},
     ruim:{ef:{registrar:'Tentou marcar o desvio do ninho e não ficou claro.'},
           resultado:[
             'Você empilha pedra e atravessa galho e o resultado é uma coisa que parece lixo de acampamento.',
             'Você olha aquilo e entende que a primeira pessoa que passar vai chutar tudo pro lado.',
             'Você tenta de novo. Fica pior.'
           ]}},
    {texto:'Ficar de longe e esperar o adulto voltar, pra ter certeza de que tem adulto.',
     teste:{status:'percepcao', dificuldade:7, nomeStatus:'Percepção', eixo:'paciencia'},
     bom:{ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Esperou uma hora pra ter certeza antes de agir'},
              flag:'esperou_o_adulto_do_ninho', registrar:'Esperou o adulto do ninho voltar antes de fazer qualquer coisa.'},
          resultado:[
            'Cinquenta e cinco minutos.',
            'E aí ela volta — pousa a quatro metros, anda o resto, e senta nos ovos sem olhar uma vez pra onde você está.',
            'Ela sabia que você estava aí o tempo todo. Ela só estava esperando você provar que ia ficar quiet{o|a}.'
          ]},
     ruim:{ef:{registrar:'Não teve paciência de esperar o adulto do ninho.'},
           resultado:[
             'Você aguenta uns dezoito minutos.',
             d=>{
               const pior = piorNoEixo('paciencia');
               return pior.pokemon && pior.valor < 0
                 ? `${nomeExib(pior.pokemon)} não aguenta nada: mexe, sai do lugar, volta, mexe de novo, e no fim é ${pron(pior.pokemon).ele} que espanta o que ia voltar.`
                 : 'Você mexe o pé, estala um galho, e o que quer que estivesse chegando muda de ideia a uns trinta metros.';
             },
             'Você vai embora sem saber se aqueles ovos têm mãe.'
           ]}},
    {texto:'Levar os ovos. Ninguém vai cuidar.',
     ef:{rep:{eixo:'ruim',delta:2,motivo:'Levou três ovos de um ninho que talvez tivesse dono'},
         flag:'levou_os_ovos', registrar:'Levou os três ovos do ninho da trilha.'},
     resultado:[
       'Você põe os três na mochila com pano em volta e anda mais quarenta minutos.',
       'Aos quarenta e um, tem uma coisa voando em círculo baixo atrás de você, e ela não está indo embora.',
       'Ela te acompanha por três quilômetros, no mesmo círculo, na mesma altura, sem atacar uma vez.',
       'Você volta. Você volta os três quilômetros e põe os três ovos de volta e ela pousa antes de você terminar de sair.',
       'Você não vai contar essa história pra ninguém.'
     ]},
    {texto:'Desviar em silêncio e não mexer em nada.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Desviou de um ninho sem mexer em nada'}},
     resultado:['Você dá a volta por fora, a uns seis metros, e não olha pra trás.','Foi a coisa mais certa e a menos interessante, e as duas coisas costumam andar juntas.']}
  ]
},
{
  id:'rot_o_acampamento_vazio', peso:2, ambientes:['campo','floresta','montanha'],
  titulo:'Um acampamento sem ninguém',
  texto:[
    'Tem uma barraca armada a trinta metros da trilha, fechada, com uma panela apoiada em duas pedras e cinza fria embaixo.',
    'A cinza está fria de umas boas horas. A barraca está fechada por dentro ou por fora, não dá pra saber daqui.',
    'Não tem ninguém.'
  ],
  escolhas:[
    {texto:'Chamar de longe, alto, antes de chegar perto.',
     teste:{status:'carisma', dificuldade:6, nomeStatus:'Carisma', eixo:'simpatia'},
     bom:{ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Chamou antes de chegar perto de acampamento alheio'},
              flag:'achou_o_dono_da_barraca', registrar:'Chamou de longe num acampamento vazio e alguém respondeu do mato.'},
          resultado:[
            'Você chama três vezes e na terceira responde uma voz do mato, uns quarenta metros adiante, muito mais calma do que você esperava.',
            fala('a dona da barraca', 'Tô aqui! Tô no riacho! Não mexe na panela que ela tá quente!'),
            'A panela está fria há horas. Ela volta em quatro minutos, com um balde, e explica que a panela nunca está quente e que ela fala isso por hábito desde 1991.'
          ]},
     ruim:{ef:{registrar:'Chamou num acampamento vazio e ninguém respondeu.'},
           resultado:[
             'Você chama três vezes e o mato devolve o seu som e nada mais.',
             'Você chama uma quarta, mais alto, e aí sim alguma coisa se mexe — longe, rápido, indo embora.',
             'Não era gente.'
           ]}},
    {texto:'Abrir a barraca. Pode ter alguém passando mal.',
     teste:{status:'coragem', dificuldade:6, nomeStatus:'Resistência', eixo:'coragem'},
     bom:{ef:{rep:{eixo:'bom',delta:1,motivo:'Abriu a barraca porque podia ter alguém dentro'},
              registrar:'Abriu a barraca do acampamento vazio. Estava vazia e arrumada.'},
          resultado:[
            'Você abre o zíper devagar, falando alto o tempo inteiro, avisando que está abrindo.',
            'Está vazia. Saco de dormir enrolado, mochila fechada, um livro com marcador na página cento e nove.',
            'Ninguém passando mal. Só alguém que saiu e vai voltar.',
            'Você fecha o zíper exatamente como estava e põe uma pedra em cima da aba, pro vento não abrir.'
          ]},
     ruim:{ef:{rep:{eixo:'ruim',delta:1,motivo:'Abriu a barraca de um estranho e foi visto'},
               registrar:'Foi visto abrindo a barraca de outra pessoa.'},
           resultado:[
             'Você abre o zíper e ouve, atrás de você, uma pessoa dizendo o seu nome — não o seu, o dela, alto, do jeito que se diz um nome pra avisar que chegou.',
             fala('a dona da barraca', 'Ô.', 'frio'),
             'Ela não grita. Ela não acusa. Ela só fica ali parada com um balde de água na mão esperando você explicar.',
             'Você explica. Ela aceita a explicação. Ela continua esperando você ir embora.'
           ]}},
    {texto:'Deixar um bilhete avisando que passou por aqui, e seguir.',
     ef:{moral:1, rep:{eixo:'bom',delta:1,motivo:'Deixou bilhete em acampamento alheio em vez de só passar'},
         registrar:'Deixou um bilhete num acampamento vazio na estrada.'},
     resultado:[
       'Você escreve num papel qualquer: a hora, a data, "passei aqui, não mexi em nada", e o seu nome.',
       'Prende embaixo da panela.',
       'É o tipo de coisa que quem mora na estrada faz e quem mora em cidade acha esquisito.'
     ]},
    {texto:'Seguir sem chegar perto.', ef:{},
     resultado:['Você segue. A trinta metros, a barraca continua fechada e a cinza continua fria.']}
  ]
}
],

floresta:[
{
  id:'rot_fita_nas_arvores', peso:2,
  titulo:'Fita amarrada nas árvores',
  texto:[
    'Tem fita plástica amarrada em tronco, na altura do peito, de dez em dez metros, entrando mato adentro.',
    'A fita é nova. O laço é bem feito, com duas voltas, do jeito de quem amarra muita coisa.',
    'Ela vai pra um lado que a trilha não vai.'
  ],
  escolhas:[
    {texto:'Seguir a fita.',
     teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção', eixo:'discricao'},
     bom:{ef:{flag:'seguiu_a_fita', rep:{eixo:'bom',delta:1,motivo:'Foi ver o que a fita marcava em vez de passar batido'},
              registrar:'A fita da floresta marcava uma armadilha de contenção, vazia e mal instalada.'},
          resultado:[
            'Duzentos metros depois a fita termina numa clareira pequena com uma gaiola de contenção montada no chão.',
            'A gaiola está vazia, armada, e com a isca podre — o que quer dizer que está armada há muito tempo e ninguém veio conferir.',
            'Tem uma etiqueta de identificação no canto, plastificada, com um número de licença e nenhum nome.',
            'Você desarma. Leva menos de um minuto e é a coisa mais certa que você faz hoje.'
          ]},
     ruim:{ef:{hp:-2, registrar:'Se perdeu seguindo uma fita na floresta.'},
           resultado:[
             'Você perde a fita na sexta árvore, acha de novo, perde na nona e não acha mais.',
             'Leva quarenta minutos pra voltar pra trilha e você volta arranhad{o|a} e sem nada.'
           ]}},
    {texto:'Cortar a fita toda e levar.',
     ef:{rep:{eixo:'ruim',delta:1,motivo:'Arrancou a marcação de alguém sem saber pra que servia'},
         flag:'cortou_a_fita', registrar:'Arrancou a fita de marcação da floresta.'},
     resultado:[
       'Você tira todas as que alcança e enrola num novelo que cabe no bolso.',
       'Pode ser que você tenha estragado o trabalho de um pesquisador. Pode ser que você tenha estragado o trabalho de um caçador.',
       'A floresta não vai te contar qual dos dois.'
     ]},
    {texto:'Anotar onde fica e seguir a trilha.',
     ef:{flag:'anotou_a_fita', registrar:'Anotou onde começa a fita de marcação da floresta.'},
     resultado:['Você marca no mapa com o dedo sujo e continua andando.','É pouco. Mas é mais do que nada, e um dia alguém pergunta.']}
  ]
},
{
  id:'rot_arvore_no_caminho', peso:2,
  titulo:'A árvore atravessada',
  texto:[
    'Uma árvore caiu de través na trilha e não caiu hoje: já tem cogumelo no tronco e já tem trilha nova contornando por baixo.',
    'Só que a trilha nova passa rente a um barranco e dá pra ver, pela terra solta, que já escorregou gente ali.',
    'Do outro lado tem duas crianças de mochila parando pra decidir por onde passar.'
  ],
  escolhas:[
    {texto:'Passar primeiro e mostrar onde pisar.',
     ef:{moral:3, rep:{eixo:'bom',delta:1,motivo:'Passou na frente no trecho ruim pra mostrar onde pisar'},
         flag:'guiou_as_criancas'},
     resultado:[
       'Você passa devagar, marcando pé por pé, e fala em voz alta onde a terra está firme.',
       'As duas passam atrás de você imitando exatamente, o que é ao mesmo tempo bonito e assustador.',
       fala('a menina da mochila', 'Você é guia?'),
       fala('a menina da mochila', 'Não, ele só é grande.', null, 'A outra responde antes de você.')
     ]},
    {texto:'Abrir passagem por cima do tronco, com machado de mão e paciência.',
     teste:{status:'forca', dificuldade:7, nomeStatus:'Força', eixo:'paciencia'},
     bom:{ef:{hp:-3, rep:{eixo:'bom',delta:2,motivo:'Abriu passagem numa trilha pra quem vier depois'},
              flag:'abriu_a_trilha', registrar:'Abriu um degrau no tronco caído da floresta.'},
          resultado:[
            'Você não derruba a árvore — ninguém derruba árvore com machado de mão. Você cava um degrau.',
            'Leva uma hora e meia e sai um degrau feio, torto e completamente funcional.',
            'A trilha do barranco vai deixar de ser usada em uma semana e ninguém nunca vai saber por quê.'
          ]},
     ruim:{ef:{hp:-4, registrar:'Tentou abrir o tronco caído e só se machucou.'},
           resultado:['A madeira está mais dura do que parecia e o cabo escapa duas vezes.','Na segunda, o cabo acerta o seu joelho e você desiste com a dignidade que sobrou.']}},
    {texto:'Contornar pelo barranco e seguir.',
     teste:{status:'forca', dificuldade:5, nomeStatus:'Força', eixo:'coragem'},
     bom:{ef:{}, resultado:['Você passa rente, com a mão na raiz, e não escorrega.','Atrás de você as duas crianças passam também, agarradas no mesmo lugar em que você agarrou.']},
     ruim:{ef:{hp:-5, registrar:'Escorregou no barranco da trilha da floresta.'},
           resultado:['Você escorrega os últimos dois metros de bunda no barro.','Ninguém se machuca de verdade. A sua calça, sim.']}}
  ]
},
{
  id:'rot_a_coisa_no_mato', peso:3,
  titulo:'Alguma coisa grande no mato fechado',
  texto:[
    'O mato mexe a uns quinze metros da trilha e não é vento.',
    'É grande. Dá pra ouvir pelo galho: é uma coisa que empurra galho em vez de passar por baixo dele.',
    'E está parada agora, porque parou quando você parou.'
  ],
  escolhas:[
    {texto:'Passar devagar, sem olhar diretamente, torcendo pra não ser notado.',
     teste:{status:'percepcao', dificuldade:7, nomeStatus:'Percepção', eixo:'discricao'},
     bom:{ef:{flag:'passou_sem_ser_notado', rep:{eixo:'bom',delta:1,motivo:'Atravessou o mato fechado sem chamar atenção'},
              registrar:'Passou devagar pelo que estava no mato e não foi notado.'},
          resultado:[
            d=>{
              const m = melhorNoEixo('discricao');
              return m.pokemon && m.valor > 0
                ? `${nomeExib(m.pokemon)} entende antes de você e para de andar. Vocês dois param juntos, no mesmo segundo, sem combinar.`
                : 'Você anda no passo mais lento que o seu corpo aguenta sem cair.';
            },
            'Quarenta metros assim. O mato não mexe mais.',
            'Quando você já está longe o bastante pra olhar pra trás, dá pra ver o mato se fechando de novo devagar, no lugar exato onde ela estava.'
          ]},
     ruim:{ef:{hp:-2, flag:'foi_notado_no_mato',
               registrar:'Foi notado pelo que estava no mato fechado.'},
           resultado:[
             d=>{
               const pior = piorNoEixo('discricao');
               return pior.pokemon && pior.valor < 0
                 ? `${nomeExib(pior.pokemon)} não tem um grama de discrição no corpo: pula, esbarra em três galhos e solta um som que dá pra ouvir de Pewter.`
                 : 'Você pisa num galho. Um galho só. É sempre um galho só.';
             },
             'O mato explode pra frente e você tem meio segundo pra decidir o que fazer com a sua vida.',
             'O que sai é grande e passa a um metro de você, correndo pro outro lado, com muito mais medo do que você.',
             'Você senta no chão da trilha por uns bons cinco minutos.'
           ]}},
    {texto:'Parar completamente e deixar ela decidir.',
     teste:{status:'resistencia', dificuldade:6, nomeStatus:'Resistência', eixo:'paciencia'},
     bom:{ef:{moral:3, rep:{eixo:'bom',delta:2,motivo:'Ficou parado até o Pokémon decidir'},
              flag:'deixou_ela_decidir', registrar:'Ficou parado no mato fechado até o Pokémon decidir o que fazer.'},
          resultado:[
            'Você para. Completamente. Você para de um jeito que dói nas pernas depois de três minutos.',
            'Seis minutos.',
            'E aí ela sai — devagar, pela frente, atravessando a trilha a seis metros de você, sem pressa nenhuma.',
            'Ela olha pra você no meio da travessia. Não é ameaça e não é curiosidade. É outra coisa, pra qual não tem palavra.',
            'E some do outro lado.'
          ]},
     ruim:{ef:{hp:-1, registrar:'Não aguentou ficar parado no mato fechado.'},
           resultado:[
             'Você aguenta noventa segundos.',
             'No nonagésimo primeiro você muda o peso de pé, e o mato explode pro lado contrário, e acabou.',
             'Você nunca vai saber o que era.'
           ]}},
    {texto:'Chamar. Alto. Ver o que acontece.',
     ef:{hp:-3, flag:'chamou_no_mato',
         rep:{eixo:'bom',delta:1,motivo:'Chamou alto uma coisa grande no mato, o que é besteira e é coragem'},
         registrar:'Chamou alto a coisa que estava no mato fechado.'},
     resultado:[
       'Você grita.',
       'O que acontece é que sai um Pidgeot de uma árvore que você nem sabia que tinha Pidgeot, a três metros da sua cabeça, e você cai sentad{o|a}.',
       'A coisa grande do mato, seja lá o que fosse, foi embora no mesmo segundo pelo barulho.',
       'Você fica com um galho enfiado na panturrilha e com a certeza de que isso foi a coisa mais idiota da semana.'
     ]},
    {texto:'Voltar e contornar por fora, mesmo que leve o dobro do tempo.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Contornou em vez de testar a sorte'},
         registrar:'Contornou o mato fechado por fora. Levou o dobro do tempo.'},
     resultado:['Leva o dobro do tempo e é chato e você chega com barro até o joelho.','E você chega.']}
  ]
}
],

montanha:[
{
  id:'rot_pedra_solta', peso:2,
  titulo:'A pedra que vai cair',
  texto:[
    'Tem uma pedra do tamanho de uma geladeira meio fora do barranco, em cima do trecho mais estreito da trilha.',
    'Ela não vai cair hoje. Mas a terra embaixo dela está seca e rachada, e ela vai cair.',
    'Passam umas trinta pessoas por dia aqui, segundo o número que alguém pintou num poste de sinalização em mil novecentos e oitenta e alguma coisa.'
  ],
  escolhas:[
    {texto:'Derrubar agora, com o trecho vazio.',
     teste:{status:'forca', dificuldade:7, nomeStatus:'Força', eixo:'coragem'},
     bom:{ef:{rep:{eixo:'bom',delta:2,motivo:'Derrubou uma pedra solta antes que ela caísse em cima de alguém'},
              flag:'derrubou_a_pedra', registrar:'Derrubou de propósito a pedra solta do barranco, com a trilha vazia.'},
          resultado:[
            'Você grita duas vezes trilha abaixo e espera dois minutos antes de encostar nela.',
            'Sai com um empurrão de ombro e uma alavanca de galho, e o barulho dura mais do que você imaginava.',
            'Sobra um monte de pedra na trilha que dá pra contornar andando. Era isso, ou ela na cabeça de alguém em março.'
          ]},
     ruim:{ef:{hp:-5, registrar:'Tentou derrubar a pedra solta e ela derrubou você primeiro.'},
           resultado:[
             'Ela se mexe uns dez centímetros e trava, e os dez centímetros levam junto o chão em que você estava apoiad{o|a}.',
             'Você segura num galho que resolve segurar você de volta, o que é sorte e não competência.'
           ]}},
    {texto:'Avisar no próximo lugar que tiver gente.',
     ef:{flag:'avisou_da_pedra', rep:{eixo:'bom',delta:1,motivo:'Carregou por horas o aviso de uma pedra solta'},
         registrar:'Avisou da pedra solta do barranco no primeiro lugar com gente.'},
     resultado:[
       'Você anda mais três horas com isso na cabeça e conta pra primeira pessoa de uniforme que você vê.',
       fala('o guarda da guarita', 'Qual trecho?'),
       'Você explica com as mãos porque não sabe o nome do trecho, e ele entende assim mesmo e anota num caderno.',
       fala('o guarda da guarita', 'Terceira vez esse ano que me falam dessa. Um dia eu vou lá.', 'baixo')
     ]},
    {texto:'Passar rápido embaixo e não pensar mais nisso.',
     ef:{registrar:'Passou por baixo da pedra solta e seguiu.'},
     resultado:['Você passa em quatro passos largos e não olha pra cima.','Você vai lembrar dessa pedra em algum momento aleatório daqui a uns dois meses, e vai ser desconfortável.']}
  ]
},
{
  id:'rot_neblina_alta', peso:2,
  titulo:'A neblina que fecha',
  texto:[
    'A neblina sobe o vale em vinte minutos e fecha tudo num branco que come som também: você fala e a sua voz volta errada.',
    'A trilha continua ali, dois metros de cada vez.',
    'Ainda faltam umas três horas de caminho e falta uma hora e meia pra escurecer.'
  ],
  escolhas:[
    {texto:'Parar onde está e esperar abrir.',
     teste:{status:'resistencia', dificuldade:5, nomeStatus:'Resistência', eixo:'paciencia'},
     bom:{ef:{hp:-1, moral:3, flag:'esperou_a_neblina',
              rep:{eixo:'bom',delta:1,motivo:'Parou na neblina em vez de insistir'}},
          resultado:[
            'Você senta encostad{o|a} numa pedra, com o time todo fora da Pokébola, e espera.',
            'Abre em cinquenta minutos, de uma vez, como cortina.',
            'Você perde a luz e ganha a noite mais estrelada que já viu, e dorme ali mesmo sem ter planejado.'
          ]},
     ruim:{ef:{hp:-4, registrar:'Esperou a neblina passar e pegou frio.'},
           resultado:['Não abre. Você fica duas horas sentad{o|a} no frio e escurece do mesmo jeito.','Você desce no escuro, devagar, com lanterna, e chega tremendo.']}},
    {texto:'Seguir devagar, contando passo e marcando pedra.',
     teste:{status:'intelecto', dificuldade:7, nomeStatus:'Intelecto', eixo:'cuidado'},
     bom:{ef:{flag:'atravessou_a_neblina', rep:{eixo:'bom',delta:1,motivo:'Atravessou a neblina contando passo, sem improviso'},
              registrar:'Atravessou a neblina alta contando passo e marcando pedra.'},
          resultado:[
            'Você conta cento e vinte passos entre marca e marca e empilha três pedras em cada uma.',
            'Leva o triplo do tempo e funciona exatamente como devia funcionar.',
            'Quando abre, você está trezentos metros adiante e no lugar certo, o que é mais raro do que parece.'
          ]},
     ruim:{ef:{hp:-4, registrar:'Se perdeu na neblina e voltou ao ponto de partida.'},
           resultado:[
             'Você anda quarenta minutos e reconhece a própria pilha de pedra.',
             'Você andou em círculo, o que todo mundo diz que acontece e ninguém acredita até acontecer.'
           ]}},
    {texto:'Soltar o time e deixar que eles achem o caminho.',
     teste:{status:'carisma', dificuldade:6, nomeStatus:'Carisma', eixo:'simpatia'},
     bom:{ef:{moral:5, flag:'o_time_achou_o_caminho',
              registrar:'Na neblina, foi o time que achou o caminho.'},
          resultado:[
            d=>{
              const m = melhorNoEixo('simpatia');
              return m.pokemon
                ? `${nomeExib(m.pokemon)} vai na frente e para toda vez que você fica pra trás, o que quer dizer que ${pron(m.pokemon).ele} está olhando pra trás o tempo todo.`
                : 'Alguém do seu cinto vai na frente e para toda vez que você fica pra trás.';
            },
            'Vocês descem juntos. Você não manda nada nesse trecho — você segue.',
            'É a primeira vez na jornada que a hierarquia fica invertida por uma hora inteira, e nenhum dos dois lados comenta.'
          ]},
     ruim:{ef:{hp:-3, moral:-2, registrar:'Soltou o time na neblina e ficou pior.'},
           resultado:['Eles se espalham. Você passa quinze minutos chamando e recolhendo.','Ninguém se perde de verdade, mas todo mundo fica pior do que estava.']}}
  ]
},
{
  id:'rot_a_pedra_solta', peso:3,
  titulo:'A pedra que não devia estar ali',
  texto:[
    'Tem uma pedra do tamanho de uma mesa no meio da trilha de montanha, e ela não rolou: ela foi posta.',
    'Dá pra ver pela base — tem calço de pedra menor embaixo, feito à mão, pra ela não sair do lugar.',
    'Alguém bloqueou essa trilha de propósito. Do outro lado, a trilha continua normal.'
  ],
  escolhas:[
    {texto:'Olhar em volta antes de decidir qualquer coisa.',
     teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção', eixo:'cuidado'},
     bom:{ef:{flag:'entendeu_a_pedra', rep:{eixo:'bom',delta:2,motivo:'Entendeu por que a trilha estava bloqueada antes de desbloquear'},
              registrar:'A pedra na trilha de montanha bloqueava o acesso a um trecho que desabou.'},
          resultado:[
            'Você sobe uns quinze metros pelo lado e olha o trecho de cima.',
            'Quarenta metros depois da pedra, a trilha simplesmente não existe mais. Desabou. É um corte limpo de uns oito metros e uma queda que você não quer medir.',
            'A pedra não está bloqueando o caminho. A pedra está salvando a vida de quem vier.',
            'E quem a pôs ali carregou pedra de calço morro acima pra ela não sair do lugar.'
          ]},
     ruim:{ef:{registrar:'Olhou em volta da pedra da trilha e não entendeu nada.'},
           resultado:[
             'Você olha em volta e vê montanha, que é o que tem em volta de tudo aqui.',
             'Não dá pra ver o que tem quarenta metros adiante porque a trilha vira.',
             'Você continua sem saber por que a pedra está ali.'
           ]}},
    {texto:'Empurrar a pedra e seguir.',
     ef:{hp:-4, flag:'empurrou_a_pedra',
         rep:{eixo:'ruim',delta:1,motivo:'Desbloqueou uma trilha que alguém bloqueou de propósito'},
         registrar:'Empurrou a pedra que bloqueava a trilha de montanha.'},
     resultado:[
       'Leva vinte minutos, e a lombar reclama no fim.',
       'Você anda quarenta metros e a trilha acaba. Acaba mesmo — corte limpo, oito metros de vão, queda longa.',
       'Você volta. Você empurra a pedra de volta, que leva outros vinte minutos e dói muito mais.',
       'E você fica um tempo sentad{o|a} ao lado dela pensando na pessoa que carregou calço morro acima pra impedir exatamente o que você acabou de fazer.'
     ]},
    {texto:'Escrever um aviso na pedra com o que você tiver.',
     cond:d=>!!d.flags.entendeu_a_pedra,
     ef:{rep:{eixo:'bom',delta:3,motivo:'Escreveu na pedra o aviso que faltava, pra quem vier depois', notorio:true},
         flag:'escreveu_na_pedra', registrar:'Escreveu na pedra da trilha: TRILHA CAIU 40M ADIANTE.'},
     resultado:[
       'Você acha uma pedra de calcário no acostamento e escreve na cara da pedra grande, em letra de forma, do tamanho que dá:',
       fala('a pedra', 'TRILHA CAIU 40M ADIANTE. NÃO EMPURRE.', 'frio'),
       'Quem carregou o calço morro acima resolveu o problema e não resolveu o aviso.',
       'Agora tem aviso.'
     ]},
    {texto:'Contornar pelo alto e seguir por fora.',
     teste:{status:'forca', dificuldade:7, nomeStatus:'Força', eixo:'coragem'},
     bom:{ef:{hp:-2, rep:{eixo:'bom',delta:1,motivo:'Contornou a pedra por cima'},
              registrar:'Contornou a pedra da trilha subindo por cima.'},
          resultado:['Você sobe, atravessa por cima e desce do outro lado em doze minutos, com a mão ralada.',
                     'Quarenta metros adiante você descobre por que a pedra estava lá e volta pelo mesmo caminho, mais devagar e muito mais humilde.']},
     ruim:{ef:{hp:-6, registrar:'Escorregou tentando contornar a pedra por cima.'},
           resultado:['Você escorrega no terço final e desce três metros de barriga na pedra.',
                      'Nada quebrado. Tudo ralado.','Você contorna por baixo, que era o óbvio, e que você não fez porque parecia menos esperto.']}}
  ]
}
],

caverna:[
{
  id:'rot_marca_de_giz', peso:2,
  titulo:'Marcas de giz na pedra',
  texto:[
    'Tem setas de giz na parede, na altura do joelho, apontando pra frente.',
    'Estão apagadas pela umidade, mas dá pra ver que já foram refeitas por cima várias vezes, em gizes de cores diferentes.',
    'Na terceira seta tem uma coisa escrita do lado, pequena, e você precisa agachar pra ler.'
  ],
  escolhas:[
    {texto:'Agachar e ler.',
     ef:{flag:'leu_o_giz', registrar:'Leu o que estava escrito de giz na parede do túnel.'},
     resultado:[
       'Diz: "SE VOCÊ TÁ LENDO ISSO VOCÊ TÁ NO CAMINHO CERTO. CONTINUA. — M."',
       'A letra é de adulto tentando escrever grande.',
       'Três setas adiante tem outra, em giz mais novo, outra letra: "OBRIGADO M".',
       'E mais adiante uma terceira, mais nova ainda: "OBRIGADO M" de novo, outra letra.',
       'Você conta onze delas até a saída.'
     ]},
    {texto:'Refazer as setas apagadas com o que tiver na mochila.',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Refez a marcação de giz de um túnel pra quem vier depois'},
         flag:'refez_as_setas', moral:2,
         registrar:'Refez com pedra branca as setas de giz apagadas do túnel.'},
     resultado:[
       'Você não tem giz. Você tem uma pedra clara que risca, e ela serve.',
       'Você passa por cima de todas as que estão sumindo, e acrescenta duas onde tem bifurcação e não tinha seta.',
       'Na última você escreve, porque não resiste: "OBRIGADO M".',
       'A sua letra fica horrível e você deixa do jeito que ficou.'
     ]},
    {texto:'Ignorar e ir pelo que você acha que é o caminho.',
     teste:{status:'percepcao', dificuldade:7, nomeStatus:'Percepção', eixo:'cuidado'},
     bom:{ef:{}, resultado:['Você acerta.','Você sai do outro lado e a última seta de giz está apontando exatamente pra onde você saiu, o que é humilhante de um jeito engraçado.']},
     ruim:{ef:{hp:-3, registrar:'Ignorou as setas de giz e andou uma hora a mais no túnel.'},
           resultado:['Você anda uma hora, chega num paredão, volta.','Na volta você segue as setas em silêncio e não fala disso com ninguém.']}}
  ]
},
{
  id:'rot_goteira_na_caverna', peso:2,
  titulo:'O barulho de água',
  texto:[
    'Tem um pingo constante em algum lugar à direita, e ele é o único som do túnel há uns dez minutos.',
    'Pingo em caverna quer dizer água, e água em caverna quer dizer que o chão pode não ser chão.',
    'A lanterna alcança uns seis metros e o resto é decisão.'
  ],
  escolhas:[
    {texto:'Ir ver de onde vem a água.',
     teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção', eixo:'discricao'},
     bom:{ef:{flag:'achou_a_poca', itens:{'Água Fresca':1},
              registrar:'Achou uma poça de água limpa no túnel, filtrada pela pedra.'},
          resultado:[
            'Vinte metros pra dentro tem uma poça rasa de água limpíssima, filtrada por pedra, com areia branca no fundo.',
            'Tem três Zubat pendurados no teto em cima dela, que é o motivo de ninguém usar essa poça.',
            'Você enche o cantil em silêncio e sai andando de costas, o que é ridículo e é o certo.'
          ]},
     ruim:{ef:{hp:-4, registrar:'Foi ver de onde vinha a água e pisou onde não devia.'},
           resultado:[
             'Você pisa num trecho que parecia pedra e é lama por cima de pedra, e o pé afunda até a canela.',
             'Não tem buraco embaixo. Só tem frio, lama e uma bota que vai demorar dois dias pra secar.'
           ]}},
    {texto:'Marcar onde é e continuar.',
     ef:{flag:'marcou_a_agua', registrar:'Marcou onde fica a água dentro do túnel.'},
     resultado:['Você risca uma seta na parede com pedra e segue.','Se você precisar de água na volta, você sabe onde tem. É pouco, e um dia é tudo.']},
    {texto:'Apagar a lanterna um minuto e só escutar.',
     ef:{moral:3, flag:'escutou_no_escuro'},
     resultado:[
       'Escuro de caverna não é escuro de quarto. É um escuro que tem peso.',
       'No primeiro segundo é o pingo. No quinto é a sua própria respiração. No vigésimo é uma coisa arrastando longe, e não é perto o suficiente pra ser problema.',
       d=>{
         const p = (Estado.dados.time || []).find(x => !x.morto);
         return p ? `${nomeExib(p)} encosta na sua perna no meio do minuto e fica lá. ${pron(p).Ele} não gosta disso e ficou mesmo assim.`
                  : 'Você fica sozinh{o|a} no escuro por um minuto inteiro e aguenta.';
       },
       'Você acende de novo e os seis metros de sempre voltam a ser o mundo inteiro.'
     ]}
  ]
},
{
  id:'rot_a_luz_no_fundo', peso:3,
  titulo:'Luz no fundo da galeria',
  texto:[
    'Tem uma luz fraca no fundo de uma galeria lateral, daquelas que a trilha marcada não usa.',
    'É luz de lampião, amarela, parada. Não é reflexo.',
    'Daqui dá pra ouvir alguém falando sozinho, muito baixo, num ritmo que parece contagem.'
  ],
  escolhas:[
    {texto:'Ir até lá sem anunciar, pra ver antes de ser visto.',
     teste:{status:'percepcao', dificuldade:7, nomeStatus:'Percepção', eixo:'discricao'},
     bom:{ef:{flag:'viu_o_do_lampiao', rep:{eixo:'bom',delta:1,motivo:'Chegou perto sem ser notado'},
              registrar:'Na galeria lateral tinha um geólogo contando camadas de parede em voz alta.'},
          resultado:[
            'Você chega a uns oito metros e para atrás de uma dobra.',
            'É uma mulher de uns sessenta anos, de capacete, com um lampião no chão e a mão espalmada na parede.',
            fala('a geóloga', 'Quarenta e um. Quarenta e dois. Quarenta e três.', 'baixo'),
            'Ela está contando camadas. Camada de rocha, uma por uma, com a mão.',
            'Quarenta e três camadas é muito tempo. É mais tempo do que qualquer coisa que você já pensou.'
          ]},
     ruim:{ef:{registrar:'Tentou chegar perto do lampião sem ser notado e foi notado.'},
           resultado:[
             d=>{
               const pior = piorNoEixo('discricao');
               return pior.pokemon && pior.valor < 0
                 ? `${nomeExib(pior.pokemon)} chuta uma pedra do tamanho de um punho num piso de caverna, que é o lugar mais barulhento do mundo pra chutar uma pedra.`
                 : 'Você chuta uma pedra do tamanho de um punho num piso de caverna, que é o lugar mais barulhento do mundo pra chutar uma pedra.';
             },
             'A contagem para.',
             fala('a geóloga', 'Eu tô aqui há onze horas e você é a quarta pessoa que faz isso.', 'frio'),
             fala('a geóloga', 'Vem. Vem logo, já que veio.')
           ]}},
    {texto:'Chamar de longe e esperar ser convidado.',
     ef:{moral:1, flag:'chamou_na_galeria',
         rep:{eixo:'bom',delta:1,motivo:'Anunciou antes de entrar numa galeria com gente dentro'},
         registrar:'Chamou de longe na galeria lateral e foi convidado a entrar.'},
     resultado:[
       'Você chama e a contagem para na hora.',
       fala('a geóloga', 'Vem! Vem e pisa onde eu pisei, que o resto do chão é falso!'),
       'Você olha o chão. O chão parece chão inteiro.',
       'Você pisa exatamente onde ela pisou.'
     ]},
    {texto:'Não é da sua conta. Voltar pra trilha marcada.',
     ef:{registrar:'Deixou a luz da galeria lateral pra trás.'},
     resultado:['Você volta pra trilha marcada.','A contagem continua atrás de você por mais uns cem metros, até o som morrer na pedra.','Quarenta e quatro. Quarenta e cinco.']}
  ]
}
],

agua:[
{
  id:'rot_rede_abandonada', peso:2,
  titulo:'Rede presa na pedra',
  texto:[
    'Tem uma rede de náilon presa entre duas pedras, meio submersa, balançando com a corrente.',
    'Não é rede de pescador em uso: está rasgada de um lado e coberta de limo do outro, o que quer dizer meses.',
    'Tem coisa viva enroscada nela. Duas, na verdade.'
  ],
  escolhas:[
    {texto:'Entrar na água e soltar os dois.',
     teste:{status:'forca', dificuldade:6, nomeStatus:'Força', eixo:'cuidado'},
     bom:{ef:{hp:-2, moral:4, rep:{eixo:'bom',delta:2,motivo:'Entrou na água pra soltar dois Pokémon de uma rede abandonada'},
              flag:'soltou_da_rede', registrar:'Soltou dois Pokémon de uma rede de náilon abandonada.'},
          resultado:[
            'A água bate no peito e é mais fria do que a superfície prometia.',
            'O primeiro sai fácil. O segundo está enroscado no náilon de um jeito que só sai cortando, e você corta com a faca de acampamento com a mão tremendo de frio.',
            'Os dois somem sem olhar pra trás, que é como tem que ser.',
            'Você puxa a rede inteira pra fora e deixa amontoada na pedra, pesando uns quinze quilos de água.'
          ]},
     ruim:{ef:{hp:-5, registrar:'Entrou na água pra soltar Pokémon da rede e se enroscou também.'},
           resultado:[
             'Você enrosca o próprio pé no náilon, e por uns três segundos muito longos você entende exatamente o que os dois estão sentindo.',
             'Você se solta. Um dos dois você consegue tirar. O outro não.'
           ]}},
    {texto:'Puxar a rede pra fora sem entrar na água.',
     teste:{status:'forca', dificuldade:7, nomeStatus:'Força', eixo:'paciencia'},
     bom:{ef:{rep:{eixo:'bom',delta:1,motivo:'Tirou uma rede abandonada da água'}, flag:'tirou_a_rede'},
          resultado:['Você engancha com um galho e puxa aos poucos, e os dois se soltam sozinhos no meio do caminho.','A rede sai. Fica ali na pedra, feia, e é melhor feia na pedra que invisível na água.']},
     ruim:{ef:{hp:-2, registrar:'Tentou puxar a rede de fora e ela rasgou.'},
           resultado:['A rede rasga no meio e metade dela volta pra água, agora em dois pedaços em vez de um.','Você piorou. É possível piorar.']}},
    {texto:'Seguir. A água é funda e você não sabe nadar direito.',
     ef:{},
     resultado:['Você segue.','É uma decisão razoável e você vai pensar nela de novo hoje à noite, o que é o preço das decisões razoáveis.']}
  ]
},
{
  id:'rot_balsa_atrasada', peso:2,
  titulo:'A balsa que não vem',
  texto:[
    'O píer tem nove pessoas esperando e uma placa escrita à mão dizendo que a balsa das duas vai atrasar.',
    'A placa está lá desde as duas. São quatro e vinte.',
    'Tem um homem de colete que trabalha aqui e que aprendeu a não fazer contato visual com ninguém.'
  ],
  escolhas:[
    {texto:'Esperar junto e puxar conversa com quem espera.',
     ef:{moral:2, hp:1, rep:{eixo:'bom',delta:1,motivo:'Passou a espera do píer conversando com quem esperava'},
         flag:'conversou_no_pier'},
     resultado:[
       'Em quarenta minutos você aprende: que a balsa atrasa sempre na virada do mês, que o motor é de mil novecentos e oitenta e nove, e que tem um jeito de atravessar a pé que ninguém recomenda e todo mundo já fez.',
       fala('o pescador da fila', 'Você tá com pressa?'),
       fala('o pescador da fila', 'Se tiver com pressa, atravessa. Se não tiver, senta. Eu sento faz vinte anos.'),
       'Você senta.'
     ]},
    {texto:'Perguntar ao homem de colete o que está acontecendo de verdade.',
     teste:{status:'carisma', dificuldade:6, nomeStatus:'Carisma', eixo:'simpatia'},
     bom:{ef:{flag:'sabe_da_balsa', rep:{eixo:'bom',delta:1,motivo:'Perguntou com jeito a quem passa o dia levando bronca'},
              registrar:'A balsa atrasa porque o motor esquenta e tem que parar de hora em hora. Faz três anos.'},
          resultado:[
            'Ele demora a responder e responde olhando pro lado.',
            fala('o homem de colete', 'Ela vem. Ela sempre vem.'),
            fala('o homem de colete', 'O motor esquenta e tem que parar de hora em hora. Faz três anos assim.'),
            fala('o homem de colete', 'Eu escrevo essa placa todo dia e todo dia alguém me xinga por causa dela.', 'baixo'),
            fala('o homem de colete', 'Você é {o primeiro|a primeira} em umas duas semanas que pergunta em vez de reclamar.')
          ]},
     ruim:{ef:{registrar:'Perguntou da balsa e levou a resposta padrão.'},
           resultado:[fala('o homem de colete', 'Tá na placa.'), 'E acabou.']}},
    {texto:'Ir procurar o jeito de atravessar a pé.',
     teste:{status:'intelecto', dificuldade:7, nomeStatus:'Intelecto', eixo:'coragem'},
     bom:{ef:{flag:'atravessou_a_pe', rep:{eixo:'bom',delta:1,motivo:'Achou sozinho o caminho que a cidade toda finge não usar'},
              registrar:'Atravessou a pé pela pedra, a trezentos metros do píer.'},
          resultado:[
            'Trezentos metros rio acima tem uma sequência de pedra chata que dá pra atravessar com água na canela.',
            'Tem marca de pé no limo. Muita marca de pé no limo.',
            'Você atravessa em seis minutos e vê, do outro lado, as nove pessoas ainda sentadas no píer.'
          ]},
     ruim:{ef:{hp:-4, registrar:'Tentou atravessar a pé e voltou encharcado.'},
           resultado:['A quarta pedra é mais funda do que as três primeiras.','Você volta encharcad{o|a} da cintura pra baixo e senta no píer, e ninguém comenta, o que é pior.']}}
  ]
},
{
  id:'rot_a_boia_com_nome', peso:3,
  titulo:'Uma boia com nome escrito',
  texto:[
    'Tem uma boia de plástico laranja encalhada na pedra, dessas de marcar rede, com uma corda cortada de uns dois metros.',
    'Tem um nome escrito nela com tinta, em letra de forma, meio gasto.',
    'Corda cortada não é corda arrebentada. Alguém cortou.'
  ],
  escolhas:[
    {texto:'Procurar o dono do nome no próximo lugar com gente.',
     teste:{status:'carisma', dificuldade:6, nomeStatus:'Carisma', eixo:'simpatia'},
     bom:{ef:{moral:2, rep:{eixo:'bom',delta:2,motivo:'Devolveu uma boia com nome ao dono do nome'},
              flag:'devolveu_a_boia', registrar:'Devolveu a boia de rede ao dono. A corda tinha sido cortada.'},
          resultado:[
            'Leva duas tardes e quatro perguntas erradas até alguém reconhecer o nome.',
            'É um pescador de uns quarenta anos e ele fica olhando a boia por um tempo desconfortável.',
            fala('o dono da boia', 'Cortaram.'),
            fala('o dono da boia', 'A minha rede tava marcada com quatro dessas. Faz três semanas que eu procuro a rede e não a boia.', 'baixo'),
            fala('o dono da boia', 'Agora eu sei que não foi maré.')
          ]},
     ruim:{ef:{registrar:'Não achou o dono do nome escrito na boia.'},
           resultado:[
             'Você pergunta em quatro lugares e o nome não diz nada pra ninguém.',
             'Uma pessoa acha que já ouviu. Outra tem certeza de que é de outra cidade. As duas estão sendo educadas.',
             'Você fica com a boia.'
           ]}},
    {texto:'Mergulhar pra ver se a rede está aqui embaixo.',
     teste:{status:'resistencia', dificuldade:7, nomeStatus:'Resistência', eixo:'coragem'},
     bom:{ef:{hp:-3, itens:{'Pedaço de rede com a marca cortada':1},
              flag:'achou_a_rede', rep:{eixo:'bom',delta:2,motivo:'Mergulhou pra procurar o que tinha sido cortado'},
              registrar:'Mergulhou e achou a rede cortada, a seis metros, com corte limpo de faca.'},
          resultado:[
            'A água é mais fria do que parece e mais funda do que parece, que é o padrão de toda água.',
            'A seis metros, presa numa pedra, tem um pedaço de rede de uns três metros.',
            'O corte é limpo. Faca, não pedra. E é recente o bastante pra fibra ainda estar clara na ponta.',
            'Você sobe com o pedaço e passa um tempo bom só respirando.'
          ]},
     ruim:{ef:{hp:-5, registrar:'Mergulhou atrás da rede e quase se enrolou nela.'},
           resultado:[
             'Você desce, acha a rede em quinze segundos, e se enrola nela em dois.',
             'Você sai. Você sai porque tem sorte e não porque soube sair, e você sabe a diferença.',
             'Você fica sentad{o|a} na pedra por vinte minutos e não conta isso pra ninguém nunca.'
           ]}},
    {texto:'Deixar a boia na pedra, virada pra cima, pra quem procurar achar.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Deixou a boia à vista em vez de levar'},
         registrar:'Deixou a boia com nome bem à vista na pedra.'},
     resultado:['Você apoia a boia na pedra mais alta, com o nome pra cima e pra fora.','É o que se faz. Quem procura olha pedra alta.']},
    {texto:'Seguir.', ef:{}, resultado:['Você segue. A boia continua encalhada com o nome de alguém virado pra baixo.']}
  ]
}
]

};

/* ============================================================
   O MOTOR DOS EVENTOS
   ============================================================ */
const Eventos = {
  vistos(){
    const d = Estado.dados;
    if (!d.eventosVistos) d.eventosVistos = {};
    return d.eventosVistos;
  },
  jaViu(id){ return !!this.vistos()[id]; },
  marcar(id){ this.vistos()[id] = (this.vistos()[id] || 0) + 1; },

  /* todos os que podem acontecer aqui e agora.
     Cidade puxa o banco da cidade; rota puxa o banco do ambiente. */
  banco(id){
    const L = LOCAIS[id] || {};
    if (L.tipo === 'cidade') return (EVENTOS_CIDADE[id] || []).concat(EVENTOS_GERAIS);
    /* evento de campo só vai pra onde ele faz sentido: cercado de
       Miltank não existe dentro da Floresta de Viridian */
    const amb = L.ambiente || 'campo';
    const deCampo = amb === 'campo' ? [] : (EVENTOS_ROTA.campo || []).filter(ev => (ev.ambientes || ['campo']).includes(amb));
    return (EVENTOS_ROTA[amb] || []).concat(deCampo);
  },

  disponiveis(id){
    const d = Estado.dados;
    const banco = this.banco(id);
    return banco.filter(ev => {
      if (ev.umaVez && this.jaViu(ev.id)) return false;
      /* mesmo os repetíveis não voltam no mesmo capítulo */
      const q = this.vistos()['cap_' + ev.id];
      if (q === d.capitulo) return false;
      try { return !ev.cond || ev.cond(d); } catch(e){ return false; }
    });
  },

  sortear(id){
    const pool = this.disponiveis(id);
    if (!pool.length) return null;
    /* peso: evento de cidade pesa mais que evento geral */
    const sacola = [];
    pool.forEach(ev => { for (let i = 0; i < (ev.peso || 1); i++) sacola.push(ev); });
    return Dados.escolher(sacola);
  },

  porId(eid){
    for (const lista of Object.values(EVENTOS_CIDADE))
      for (const ev of lista) if (ev.id === eid) return ev;
    for (const lista of Object.values(EVENTOS_ROTA))
      for (const ev of lista) if (ev.id === eid) return ev;
    return EVENTOS_GERAIS.find(ev => ev.id === eid) || null;
  },

  /* Uma escolha pode rolar dado, e o dado pode contar com quem está
     no seu cinto: {teste:{status:'percepcao', dificuldade:7, eixo:'discricao'},
     bom:{...}, ruim:{...}}. O resultado muda, os efeitos mudam, e a
     linha que explica o temperamento sempre aparece. */
  rolar(esc){
    const t = esc.teste;
    if (!t) return null;
    const valor = Estado.j.status[t.status] || 0;
    const r = t.eixo
      ? Dados.testeComTime(valor, t.dificuldade, t.nomeStatus || t.status, t.eixo)
      : Dados.teste(valor, t.dificuldade, t.nomeStatus || t.status);
    r.passou = (r.grau === 'sucesso' || r.grau === 'critico');
    return r;
  },

  /* o jogador escolheu: aplica e devolve as linhas do resultado.
     Uma escolha com continua:true não encerra o evento — ela responde
     e devolve o jogador à mesma cena, pra quem quer perguntar antes
     de decidir. */
  resolver(eid, indice){
    const ev = this.porId(eid);
    if (!ev) return null;
    const esc = (ev.escolhas || [])[indice];
    if (!esc) return null;
    if (!esc.continua){
      this.marcar(ev.id);
      this.vistos()['cap_' + ev.id] = Estado.dados.capitulo;
    }
    const rolagem = this.rolar(esc);
    const ramo = rolagem ? (rolagem.passou ? esc.bom : esc.ruim) || {} : null;

    let avisos = [];
    if (rolagem && rolagem.afinidade && rolagem.afinidade.linha)
      avisos.push({tipo:'natureza', texto:rolagem.afinidade.linha});
    if (rolagem && rolagem.linhaTime) avisos.push({tipo:'natureza', texto:rolagem.linhaTime});
    if (esc.ef)        avisos = avisos.concat(Historia.aplicar(esc.ef) || []);
    if (ramo && ramo.ef) avisos = avisos.concat(Historia.aplicar(ramo.ef) || []);
    Estado.salvar('auto');
    return {ev, esc, avisos, rolagem, ramo, continua: !!esc.continua,
            resultado: (ramo && ramo.resultado) || esc.resultado || []};
  }
};
