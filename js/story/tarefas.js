/* ============================================================
   TAREFAS — quem mora ali, ou passa por ali, e precisa de uma mão
   Foi pedido assim: tarefas com gente das cidades — resgatar um
   Pokémon que se perdeu, colher alguma coisa, levar uma encomenda,
   mostrar um Pokémon —, feitas no jeito de jogo de hoje. E depois:
   não só em cidade (tem gente pedindo na rota), mais gente onde mora
   mais gente (uma em Pallet, três em Vermilion) e o primeiro encontro
   no sorteio, "tipo topar com eles": ninguém aparece na tela do lugar
   antes de você topar com a pessoa fazendo alguma coisa ali (andar,
   conversar, esperar, pescar, vasculhar, procurar; CHANCE_DE_TOPAR).
   Depois de topar, quem pede fica na seção Tarefas do lugar, com o
   rosto numa moeda e a marca (! tem um pedido, ✓ está pronto pra
   entregar, … ainda espera);
   o passo de fora da cidade aparece no lugar onde ele se faz, com o
   rosto de quem pediu; e a aba Missões (missoes.js) guarda o que cada
   um pediu, como memória: o que a pessoa disse, nunca a solução.

   Cada tarefa:
     id, cidade (o lugar onde quem pede está: cidade ou rota), quem (o nome; o rosto é
     trainers/<arq>), quadro ([x, y, lado] da cabeça no desenho de
     80 px, que a moeda recorta), f (mulher), tipo ('resgate',
     'coleta', 'entrega', 'mostrar'), titulo (a linha das Missões), desde
     (a posição na jornada em que ela aparece, por capNaJornada) ou
     fase (a das Ilhas Sevii, Sevii.fase); contato {rotulo, falas}, de
     quem tem telefone e deixa o número na volta;
     oferta {titulo, sub}: como a pessoa aparece antes de pedir;
     pedido (as falas), aceitar e recusar (os botões), recusou (o que
     ela diz), entrega (o item que ela põe na sua mão, na entrega);
     lembrete: o que ela pediu, como você lembra (a aba Missões);
     passo: o que se faz fora da cidade — onde, titulo, sub, texto e
       escolhas; na coleta, `item` e `meta`; no resgate, `luta` (quem
       está em volta do Pokémon perdido) depois de achar;
     volta {titulo, requer, falta, falas, premio}: de volta a quem
       pediu, com o que ela pediu (o mostrar só tem a volta);
     mostra (no mostrar): o que a pessoa quer ver no seu cinto — {tipo},
       {fossil}, {evoluido} (um que já foi outro) ou {contente} (moral
       de MORAL_DE_QUEM_GOSTA pra cima); quem serve é Tarefas.quem(id).
   Cada escolha do passo: {texto, cond, teste:{status, dificuldade,
   nome, eixo}, bom, ruim, resultado, achou, ganha (na coleta; o
   crítico ganha um a mais), gasta {item: n}, desgaste, espera (leva o
   relógio até a hora), entrega, luta {dex, intro, venceu, perdeu,
   ganha}, tempo (períodos; 1 se não disser)}.
   O que está escrito aqui está na folha de regras ("Tarefas da cidade").
   ============================================================ */

const OPINIAO_DA_TAREFA = 3;      // quanto quem pediu passa a gostar de você
const MORAL_DO_MOSTRAR = 5;       // o Pokémon que você mostrou sai contente
const MORAL_DE_QUEM_GOSTA = 80;   // o Pokémon que gosta de verdade de quem anda com ele (o filho do Morris)
/* topar com quem pede: a chance (em %) de cada ação do mapa, uma pessoa
   por lugar por dia, nunca de madrugada (Tarefas.talvezTopar) */
const CHANCE_DE_TOPAR = {andar:35, conversar:30, esperar:20, pescar:25, vasculhar:25, procurar:20};

/* o Pokémon de quem pediu, que a cena chama pelo nome (não é seu) */
const TAREFAS = [

/* ─── Pallet: a Lia e o Pipoca ─────────────────────────── */
{
  id:'pidgey_da_lia', cidade:'pallet', quem:'Lia', f:true, arq:'lia', quadro:[24, 36, 24], tipo:'resgate', desde:2,
  titulo:'O Pidgey da Lia',
  oferta:{titulo:'A menina do varal', sub:'Ela está em pé num balde virado, olhando pro varal vazio, com a mão fechada.'},
  pedido:[
    'No quintal da casa do lado, uma menina de uns nove anos está em pé num balde virado, olhando pro alto do varal vazio.',
    fala('Lia', 'Ele voou com a ventania de ontem. O Pipoca. É um Pidgey, tem uma fita vermelha no pé.'),
    fala('Lia', 'A minha mãe disse que Pidgey volta sozinho. Ele não voltou.'),
    fala('Lia', 'Ele foi pro lado da Rota 1. Eu não posso ir sozinha até lá.', 'baixo'),
    'Ela abre a mão: um punhado de semente de girassol, quente de tanto segurar.'
  ],
  aceitar:'"Eu procuro o Pipoca."', recusar:'"Hoje não dá, Lia."',
  recusou:[fala('Lia', 'Tá.', null, 'Ela volta a olhar pro varal.')],
  lembrete:'A Lia disse que o Pipoca, o Pidgey de fita vermelha no pé, voou com a ventania pro lado da Rota 1.',
  passo:{
    onde:'rota1', titulo:'Procurar o Pipoca, o Pidgey da Lia', sub:'Um Pidgey com uma fita vermelha no pé, em algum lugar da rota.',
    texto:['Pidgey é o que não falta na Rota 1. Um com fita vermelha no pé, não.'],
    escolhas:[
      {texto:'Andar pela beira do mato olhando o alto das árvores.', teste:{status:'percepcao', dificuldade:6, nome:'Percepção', eixo:'paciencia'},
       bom:{achou:true, resultado:['Na terceira árvore depois da placa, um ponto vermelho balança num galho alto. É a fita.']},
       ruim:{resultado:['Você conta quarenta Pidgey e nenhuma fita.']}},
      {texto:'Chamar "Pipoca!" alto, como a Lia chamaria.', teste:{status:'carisma', dificuldade:6, nome:'Carisma'},
       bom:{achou:true, resultado:['Do alto de uma árvore vem um pio curto, e depois outro. Ele responde pelo nome.']},
       ruim:{resultado:['Um bando inteiro de Pidgey levanta voo de uma vez. Nenhum tem fita.']}},
      {texto:'Espalhar um pouco de Ração na trilha e esperar quieto.', cond:d => Estado.contaItem('Ração') > 0, gasta:{'Ração':1}, tempo:2,
       achou:true, resultado:['Você espera sentad{o|a} na pedra da beira. Os Pidgey descem um por um, desconfiados, e o último a descer tem uma fita vermelha no pé.']}
    ],
    luta:{dex:21, intro:['Mas ele não desce sozinho: um Spearow pousa no galho de cima e abre as asas na frente dele.'],
      venceu:['O Spearow vai embora gritando. O Pipoca desce do galho direto pro seu ombro, como se você fosse o varal.'],
      perdeu:['O Spearow te enxota do pé da árvore, e o Pipoca some no alto, mais assustado que antes.']}
  },
  volta:{
    titulo:'Levar o Pipoca de volta pra Lia', falta:'A Lia ainda olha pro varal.',
    falas:[
      'A Lia está no mesmo balde. Ela vê o Pipoca no seu ombro antes de você abrir o portão.',
      fala('Lia', 'PIPOCA!', 'grita'),
      'O Pidgey pula do seu ombro pro dela, e ela quase cai do balde.',
      fala('Lia', 'A minha mãe mandou te dar isso. E eu mandei te dar isso aqui.', null, 'Ela põe na sua mão duas Potion e uma pena marrom, comprida, do Pipoca.')
    ],
    premio:{itens:{'Potion':2, 'Pena de Pidgey':1}, rep:'Achou o Pidgey de uma menina de Pallet'}
  }
},

/* ─── Viridian: o verde do Emil ────────────────────────── */
{
  id:'tintas_do_emil', cidade:'viridian', quem:'Emil', arq:'emil', quadro:[33, 3, 22], tipo:'coleta', desde:3,
  titulo:'O verde do Emil',
  oferta:{titulo:'O pintor do banco da praça', sub:'Ele pinta a mesma árvore há três dias, e a tela continua sem verde.'},
  pedido:[
    'No banco da praça, um senhor de boina e avental manchado pinta a árvore da frente só com azul e marrom.',
    fala('Emil', 'Acabou o meu verde. Eu faço a minha tinta, sabe. Não compro.'),
    fala('Emil', 'Tem uma frutinha na Floresta de Viridian que mancha a mão de verde por uma semana. Roxa por fora, verde por dentro. É dela que eu faço.'),
    fala('Emil', 'Três, e eu termino o quadro. Os meus joelhos não entram mais na floresta.', null, 'Ele bate no joelho com o cabo do pincel.')
  ],
  aceitar:'"Eu trago três."', recusar:'"Agora não posso."',
  recusou:[fala('Emil', 'Então a árvore fica azul mais um dia. Ela não se importa.')],
  lembrete:'O Emil, pintor da praça de Viridian, precisa de três frutinhas-tinta da Floresta de Viridian, roxas por fora e verdes por dentro.',
  passo:{
    onde:'floresta', titulo:'Colher frutinha-tinta pro Emil', sub:'Miúda e roxa, baixa, no meio das moitas de folha larga.',
    item:'Frutinha-tinta', meta:3,
    texto:['A frutinha-tinta cresce baixa, no meio das moitas de folha larga. Por fora é roxa como as outras. Por dentro, diz o Emil, é verde.'],
    escolhas:[
      {texto:'Procurar nas moitas da beira da trilha.', teste:{status:'percepcao', dificuldade:6, nome:'Percepção', eixo:'paciencia'},
       bom:{ganha:1, resultado:['Debaixo de uma folha larga, um cacho de três. Você aperta uma: verde por dentro. Essa.']},
       ruim:{resultado:['Você enche a mão de frutinha roxa e aperta uma por uma. Roxas por dentro também. Não são essas.']}},
      {texto:'Ir na moita grande, onde zumbe alguma coisa.',
       luta:{dex:15, ganha:2, intro:['A moita grande é a mais carregada, e é de um Beedrill. Ele sai de dentro antes de você esticar a mão.'],
         venceu:['O Beedrill vai embora, e a moita é sua. Você enche o bolso.'],
         perdeu:['Você recua até a trilha com o Beedrill atrás. A moita fica com ele.']}}
    ]
  },
  volta:{
    titulo:'Levar as frutinhas pro Emil', falta:'O Emil continua pintando sem verde.',
    falas:[
      'O Emil esmaga a primeira frutinha na paleta com o cabo do pincel. Sai um verde escuro, de mato molhado.',
      fala('Emil', 'Isso. Esse é o verde da floresta. O de loja é verde de parede.'),
      'Ele pinta a copa da árvore em seis pinceladas. A árvore da tela fica mais parecida com a da praça do que a da praça.',
      fala('Emil', 'Volta aqui daqui a uns dias. Vou estar pintando outra coisa, mas com o mesmo verde.', null, 'Ele limpa a mão no avental e te passa o que tinha no bolso.')
    ],
    premio:{dinheiro:300, itens:{'Poké Ball':3}, rep:'Ajudou o pintor da praça de Viridian a terminar um quadro'}
  }
},

/* ─── Viridian: a escolinha da Maisie ──────────────────── */
{
  id:'escolinha_da_maisie', cidade:'viridian', quem:'Maisie', f:true, arq:'maisie', quadro:[12, 16, 26], tipo:'mostrar', desde:3,
  mostra:{evoluido:true},
  titulo:'A escolinha da Maisie',
  oferta:{titulo:'A professora da escolinha', sub:'De avental amarelo, ela junta brinquedo da calçada numa cesta vermelha.'},
  pedido:[
    'Na calçada da escolinha, uma moça de avental amarelo e cabelo preso de presilha junta brinquedo do chão numa cesta vermelha. Pela janela, doze crianças te olham ao mesmo tempo.',
    fala('Maisie', 'Hoje a aula foi de evolução. Com figurinha.'),
    fala('Maisie', 'Eles não acreditaram. Disseram que o Caterpie e o Butterfree são dois Pokémon diferentes, e que eu inventei o resto.'),
    fala('Maisie', 'Se você tiver um que já foi outro, traz aqui? Só cinco minutos. Eu seguro as crianças.', 'riso')
  ],
  aceitar:'"Eu trago um."', recusar:'"Agora não vai dar."',
  recusou:[fala('Maisie', 'Tudo bem. Amanhã a aula é de nuvem. Nuvem eles acreditam.')],
  lembrete:'A Maisie, professora da escolinha de Viridian, quer que as crianças vejam de perto um Pokémon que já evoluiu: na figurinha, ninguém acreditou.',
  volta:{
    titulo:d => { const p = Tarefas.quem('escolinha_da_maisie'); return p ? `Levar ${nomeExib(p)} na escolinha da Maisie` : 'Levar um Pokémon que já evoluiu na escolinha'; },
    falta:'A Maisie quer mostrar pras crianças um Pokémon que já foi outro.',
    falas:d => {
      const p = Tarefas.quem('escolinha_da_maisie');
      if (!p) return [];
      const n = nomeExib(p), pr = pron(p), antes = (DEX[(DEX[p.dex] || {}).preEvo] || {}).nome;
      return [
        `A Maisie abre a porta, e as doze crianças param de falar ao mesmo tempo. ${n} entra devagar, olhando uma por uma.`,
        fala('Maisie', antes ? `Esse aqui já foi um ${antes}. Pequenininho.` : 'Esse aqui já foi outro. Pequenininho.', null, 'Ela mostra a figurinha.'),
        `Um menino da primeira fila levanta a mão e pergunta se ${pr.ele} lembra de quando era pequen${pr.o}.`,
        fala('Maisie', 'Essa fica pra próxima aula.', 'riso'),
        `Na saída, as doze fazem fila pra encostar em ${n}. ${pr.Ele} deixa todas.`
      ];
    },
    premio:{dinheiro:300, itens:{'Potion':2, 'Repelente':1}, rep:'Levou um Pokémon pra escolinha de Viridian ver de perto'}
  }
},

/* ─── Pewter: a vitrine do Oskar ───────────────────────── */
{
  id:'cacos_do_oskar', cidade:'pewter', quem:'Oskar', arq:'oskar', quadro:[26, 13, 24], tipo:'coleta', desde:5,
  titulo:'A vitrine do Oskar',
  oferta:{titulo:'O arqueólogo na escada do museu', sub:'Ele separa pedrinhas em três montes, com uma lupa, numa folha de jornal aberta no degrau.'},
  pedido:[
    'Na escada do museu, um homem de chapéu de explorador e mochila maior que ele separa pedrinhas em três montes, com uma lupa.',
    fala('Oskar', 'Calcário, calcário, calcário. Tudo calcário.'),
    fala('Oskar', 'O museu quer uma vitrine de pedra-da-lua. Não a pedra inteira, que essa é rara. Os cacos: as lascas que soltam do teto do Monte da Lua.'),
    fala('Oskar', 'Dois cacos. Eu fui três vezes e voltei com calcário três vezes. Dizem que eles brilham um pouco quando a luz bate.', null, 'Ele dá de ombros.')
  ],
  aceitar:'"Eu procuro os cacos."', recusar:'"Hoje eu não entro em caverna."',
  recusou:[fala('Oskar', 'Ninguém entra. Por isso a vitrine está vazia.')],
  lembrete:'O Oskar, do museu de Pewter, quer dois cacos de pedra-da-lua, as lascas que soltam do teto do Monte da Lua e brilham quando a luz bate.',
  passo:{
    onde:'monte_lua', titulo:'Procurar cacos de pedra-da-lua pro Oskar', sub:'Lascas que soltam do teto e brilham quando a luz bate.',
    item:'Caco de pedra-da-lua', meta:2,
    texto:['No chão da caverna, no meio do cascalho, um caco de pedra-da-lua é igual a qualquer pedra, até a luz bater nele.'],
    escolhas:[
      {texto:d => { const l = Campo.iluminar(); return `Varrer o chão ${l.como || 'com luz'}.`; }, cond:d => Campo.iluminar().pode,
       desgaste:d => Campo.iluminar().semPilha ? null : 'Lanterna',
       teste:{status:'percepcao', dificuldade:4, nome:'Percepção'},
       bom:{ganha:1, resultado:['Na terceira passada da luz, o chão devolve um brilho azul, fraco. Um caco, do tamanho de uma unha.']},
       ruim:{resultado:['A luz acha calcário, mais calcário e um Zubat que não gostou nada dela.']}},
      {texto:'Procurar no escuro, pelo tato e pelo brilho.', teste:{status:'percepcao', dificuldade:8, nome:'Percepção', eixo:'paciencia'},
       bom:{ganha:1, resultado:['Você passa a mão no chão até uma pedra ficar fria de um jeito diferente das outras. É um caco.']},
       ruim:{resultado:['Você volta com as mãos cheias de calcário. O Oskar ia rir.']}},
      {texto:'Esperar os Clefairy em silêncio, num canto da galeria.', teste:{status:'sorte', dificuldade:7, nome:'Sorte'}, tempo:2,
       bom:{ganha:1, resultado:['Dois Clefairy passam por você sem te ver, arrastando alguma coisa que brilha. Na curva, um caco cai e fica pra trás.']},
       ruim:{resultado:['Os Clefairy não aparecem. Um Zubat aparece no lugar deles, e não fica.']}}
    ]
  },
  volta:{
    titulo:'Levar os cacos pro Oskar', falta:'O Oskar continua separando calcário.',
    falas:[
      'O Oskar põe os cacos na palma da mão e fecha a outra mão em concha por cima, pra fazer escuro.',
      fala('Oskar', 'Olha. Olha isso.', 'baixo'),
      'Pela fresta dos dedos dele sai uma luz azul fraca, de lua atrás de nuvem.',
      fala('Oskar', 'Na vitrine vai ter uma plaquinha. Eu vou pôr o seu nome nela, se você deixar.', null, 'Ele já está escrevendo.')
    ],
    premio:{dinheiro:600, itens:{'Super Potion':2}, rep:'Ajudou o museu de Pewter a montar uma vitrine'}
  }
},

/* ─── Pewter: o Seixo do Boyd ──────────────────────────── */
{
  id:'seixo_do_boyd', cidade:'pewter', quem:'Boyd', arq:'boyd', quadro:[21, 0, 33], tipo:'resgate', desde:5,
  titulo:'O Geodude do Boyd',
  oferta:{titulo:'O escalador da beira da ladeira', sub:'De macacão verde-limão e óculos na testa, ele conta as pedras do barranco com o dedo.'},
  pedido:[
    'Na saída de Pewter, um escalador de macacão verde-limão, com os óculos de proteção na testa e uma picareta presa na mochila, conta as pedras do barranco com o dedo.',
    fala('Boyd', 'Dezoito, dezenove… não. Nenhuma é ele.'),
    fala('Boyd', 'O Seixo é um Geodude. Ele dormiu encolhido na beira da estrada, o caminhão da pedreira passou, e ele rolou junto com a carga, ladeira abaixo, até a Rota 3.'),
    fala('Boyd', 'Eu marco ele com um X de giz na cabeça, pra achar no meio das pedras. E quando eu bato duas pedras uma na outra, ele vem. Quase sempre.', 'riso')
  ],
  aceitar:'"Eu procuro o Seixo."', recusar:'"Hoje eu não posso."',
  recusou:[fala('Boyd', 'Tá. Pedra não foge. Pelo menos, não muito.')],
  lembrete:'O Boyd, escalador de Pewter, perdeu o Seixo, um Geodude que rolou com a carga do caminhão da pedreira até a Rota 3. Ele tem um X de giz na cabeça, e vem quando alguém bate duas pedras.',
  passo:{
    onde:'rota3', titulo:'Procurar o Seixo, o Geodude do Boyd', sub:'Uma pedra com um X de giz, no pé da ladeira.',
    texto:['O pé da ladeira da Rota 3 é um campo de pedra solta. Qualquer uma pode ser um Geodude dormindo.'],
    escolhas:[
      {texto:'Procurar uma pedra com X de giz.', teste:{status:'percepcao', dificuldade:6, nome:'Percepção', eixo:'paciencia'},
       bom:{achou:true, resultado:['No meio de vinte pedras iguais, uma tem um X branco meio apagado. Ela abre um olho quando a sua sombra passa.']},
       ruim:{resultado:['Você vira pedra por pedra. Todas são pedra.']}},
      {texto:'Bater duas pedras uma na outra, como o Boyd faz.', teste:{status:'carisma', dificuldade:6, nome:'Carisma'},
       bom:{achou:true, resultado:['Na terceira batida, uma pedra do barranco desenrola dois braços e vem rolando na sua direção.']},
       ruim:{resultado:['O barulho só acorda um Sandshrew, que te olha feio e volta pro buraco.']}},
      {texto:'Empurrar as pedras grandes do barranco.', teste:{status:'forca', dificuldade:7, nome:'Força'},
       bom:{achou:true, resultado:['A quarta pedra que você empurra resmunga e empurra de volta. Tem um X de giz na testa dela.']},
       ruim:{resultado:['Três pedras descem a ladeira, e nenhuma reclama.']}}
    ],
    luta:{dex:21, intro:['Mas o Seixo não está sozinho: um Spearow pousou em cima dele e bica o X de giz como se fosse comida.'],
      venceu:['O Spearow vai embora. O Seixo se desenrola, estica os braços e se agarra na alça da sua mochila.'],
      perdeu:['O Spearow te enxota do pé da ladeira, e o Seixo, de susto, rola pro meio das outras pedras.']}
  },
  volta:{
    titulo:'Levar o Seixo de volta pro Boyd', falta:'O Boyd continua contando pedra na beira da ladeira.',
    falas:[
      'O Boyd reconhece o X antes de reconhecer você.',
      fala('Boyd', 'Seixo!', 'grita'),
      'O Geodude solta da sua mochila, rola até a bota dele e para ali.',
      fala('Boyd', 'Eu ia subir a parede norte amanhã sem ele. Ia ser a primeira vez em seis anos.'),
      fala('Boyd', 'Isso era pra quando eu achasse ele. Achei.', null, 'Ele te passa o que tinha no bolso do macacão.')
    ],
    premio:{dinheiro:500, itens:{'Great Ball':2, 'Potion':2}, rep:'Achou o Geodude de um escalador de Pewter'}
  }
},

/* ─── Rota 3: a sopa do Mack ───────────────────────────── */
{
  id:'sopa_do_mack', cidade:'rota3', quem:'Mack', arq:'mack', quadro:[28, 6, 26], tipo:'coleta', desde:5,
  titulo:'A sopa do Mack',
  oferta:{titulo:'O montanhista da panela grande', sub:'De chapéu verde de aba larga e pena vermelha, ele mexe uma panela que só tem água.'},
  pedido:[
    'Num acampamento de beira de trilha, perto da boca do Monte da Lua, um montanhista grandalhão, de chapéu verde de aba larga com uma pena vermelha e lenço vermelho no pescoço, mexe uma panela que só tem água.',
    fala('Mack', 'Faz vinte anos que eu faço a sopa da turma que sobe o Monte da Lua. Sopa de cogumelo.'),
    fala('Mack', 'O cogumelo bom nasce lá dentro, por onde os Paras passam. O de fora da caverna não tem gosto de nada.'),
    fala('Mack', 'Três dá uma panela. E o meu joelho não desce mais a galeria.', null, 'Ele bate no joelho com a colher de pau.')
  ],
  aceitar:'"Eu trago três."', recusar:'"Hoje eu não entro lá."',
  recusou:[fala('Mack', 'Então hoje é sopa de água. A turma reclama, mas toma.', 'riso')],
  lembrete:'O Mack, que faz a sopa dos montanhistas na beira da Rota 3, quer três cogumelos de dentro do Monte da Lua, dos que nascem por onde os Paras passam.',
  passo:{
    onde:'monte_lua', titulo:'Colher cogumelo pro Mack', sub:'No chão úmido das galerias, por onde os Paras andam.',
    item:'Cogumelo', meta:3,
    texto:['Nas galerias de baixo do Monte da Lua o chão é úmido e escuro. Por onde os Paras passam, nasce cogumelo pequeno, vermelho, de chapéu redondo.'],
    escolhas:[
      {texto:d => { const l = Campo.iluminar(); return `Procurar no chão das galerias ${l.como || 'com luz'}.`; }, cond:d => Campo.iluminar().pode,
       desgaste:d => Campo.iluminar().semPilha ? null : 'Lanterna',
       teste:{status:'percepcao', dificuldade:4, nome:'Percepção'},
       bom:{ganha:1, resultado:['A luz pega um ponto vermelho no pé da parede, e depois outro. O primeiro está inteiro.']},
       ruim:{resultado:['A luz acha pedra molhada, um Zubat de cabeça pra baixo e mais pedra molhada.']}},
      {texto:'Tatear o chão perto de onde a água pinga.', teste:{status:'percepcao', dificuldade:7, nome:'Percepção', eixo:'paciencia'},
       bom:{ganha:1, resultado:['Entre duas poças, a sua mão acha uma coisa macia e fria, de chapéu redondo. É um.']},
       ruim:{resultado:['A sua mão acha lodo, pedra e uma coisa que se mexeu e não era cogumelo.']}},
      {texto:'Seguir o rastro de pó até onde os Paras dormem.',
       luta:{dex:46, ganha:2, intro:['O rastro termina num canto forrado de cogumelo, e no meio dele um Paras acorda e levanta as pinças.'],
         venceu:['O Paras se enfia numa fresta. O canto é seu, e você enche o bolso.'],
         perdeu:['O Paras solta uma nuvem de pó, e você sai do canto tossindo, de mão vazia.']}}
    ]
  },
  volta:{
    titulo:'Levar os cogumelos pro Mack', falta:'O Mack continua mexendo a panela de água.',
    falas:[
      'O Mack cheira o primeiro cogumelo e fecha os olhos.',
      fala('Mack', 'Esse. Esse é o da caverna.'),
      'Em meia hora o acampamento inteiro está em volta da panela, cada um com a sua caneca.',
      fala('Mack', 'A primeira é sua. E leva isso: o seu time também sobe essa trilha.', null, 'Ele embrulha umas porções de Ração num pano de prato.')
    ],
    premio:{itens:{'Ração':2, 'Super Potion':1, 'Éter':1}, rep:'Trouxe cogumelo pra sopa dos montanhistas da Rota 3'}
  }
},

/* ─── Cerulean: o Pim e o Dodó ─────────────────────────── */
{
  id:'psyduck_do_pim', cidade:'cerulean', quem:'Pim', arq:'pim', quadro:[20, 24, 24], tipo:'resgate', desde:7,
  titulo:'O Psyduck do Pim',
  oferta:{titulo:'O menino da boia', sub:'Ele está de boia na cintura, na beira do rio, e não entra na água.'},
  pedido:[
    'Na beira do rio, um menino de uns dez anos com uma boia azul na cintura olha pra água sem entrar.',
    fala('Pim', 'O Dodó desceu o rio boiando. Ele faz isso. Só que dessa vez ele foi longe.'),
    fala('Pim', 'É um Psyduck. Ele não nada direito, ele só boia. Ele parou numa pedra no meio do rio, lá pra cima da Rota 24, e não sai de lá.'),
    fala('Pim', 'Eu tenho boia. Eu não tenho coragem.', 'baixo')
  ],
  aceitar:'"Eu tiro ele de lá."', recusar:'"Agora eu não consigo, Pim."',
  recusou:[fala('Pim', 'Tudo bem. Ele está segurando a cabeça, mas está segurando.')],
  lembrete:'O Pim, de Cerulean, perdeu o Dodó, um Psyduck que boiou rio acima e parou numa pedra no meio do rio, na Rota 24.',
  passo:{
    onde:'rota24', titulo:'Tirar o Dodó da pedra do rio', sub:'Um Psyduck sentado numa pedra no meio da correnteza.',
    texto:['Lá está ele: um Psyduck sentado numa pedra no meio da correnteza, segurando a cabeça com as duas mãos.'],
    escolhas:[
      {texto:d => `Atravessar ${Campo.surfar().como}.`, cond:d => Campo.surfar().pode,
       achou:true, resultado:d => [`A correnteza empurra, mas ${nomeExib(Campo.surfar().quem)} segura firme. O Dodó sobe nas costas de ${nomeExib(Campo.surfar().quem)} sem perguntar nada.`]},
      {texto:'Pegar o cabo de amarrar barco da margem e jogar pra ele.', teste:{status:'forca', dificuldade:7, nome:'Força', eixo:'coragem'},
       bom:{achou:true, resultado:['O cabo cai no colo dele na segunda tentativa. Ele segura com o bico, e você puxa.']},
       ruim:{resultado:['O cabo cai na água três vezes. Na terceira ele tenta pegar e quase cai junto.']}},
      {texto:'Gritar pra ele boiar até a margem.', teste:{status:'carisma', dificuldade:8, nome:'Carisma'},
       bom:{achou:true, resultado:['Ele olha pra você, olha pra água, e se joga. Boia. A correnteza traz ele até a sua mão.']},
       ruim:{resultado:['Ele olha pra você e segura a cabeça com mais força.']}}
    ],
    luta:{dex:118, intro:['Quando o Dodó chega na margem, um Goldeen pula da água atrás dele, de chifre na frente.'],
      venceu:['O Goldeen volta pro fundo. O Dodó não solta mais a sua perna.'],
      perdeu:['O Goldeen leva a melhor, e o Dodó, de susto, volta boiando pra pedra.']}
  },
  volta:{
    titulo:'Levar o Dodó de volta pro Pim', falta:'O Pim continua na beira do rio, de boia.',
    falas:[
      'O Pim corre pela margem com a boia batendo no joelho.',
      fala('Pim', 'Dodó! Você não sabe nadar!', 'grita'),
      'O Psyduck segura a cabeça. Pode ser vergonha. Pode ser dor de cabeça.',
      fala('Pim', 'O meu pai disse que quem trouxesse o Dodó ganhava isso aqui. Ele achou que ninguém ia trazer.', 'riso')
    ],
    premio:{itens:{'Great Ball':2, 'Super Potion':1}, rep:'Tirou o Psyduck de um menino de Cerulean do meio do rio'}
  }
},

/* ─── Cerulean: o colar do Cody ────────────────────────── */
{
  id:'colar_do_cody', cidade:'cerulean', quem:'Cody', arq:'cody', quadro:[20, 1, 32], tipo:'coleta', desde:7,
  titulo:'O colar do Cody',
  oferta:{titulo:'O nadador do cordão laranja', sub:'Ainda pingando, de óculos de natação na testa, ele enfia um cordão num colar sem nenhuma concha.'},
  pedido:[
    'Na beira do rio, um rapaz de calção de natação e óculos na testa, ainda pingando, enfia um cordão laranja num colar que não tem nada pendurado.',
    fala('Cody', 'Quem atravessa o rio a nado pela primeira vez ganha um colar de concha. É coisa da turma da natação.'),
    fala('Cody', 'A minha prima atravessa no sábado. As conchas boas ficam no fundo, debaixo da ponte da Rota 24, onde a correnteza deixa.'),
    fala('Cody', 'Três inteiras. Eu desço lá todo ano, mas machuquei o ombro.', null, 'Ele gira o ombro e faz careta.')
  ],
  aceitar:'"Eu trago as conchas."', recusar:'"Hoje não dá."',
  recusou:[fala('Cody', 'Beleza. O sábado ainda está longe. Mais ou menos.')],
  lembrete:'O Cody, nadador de Cerulean, quer três conchas inteiras do fundo do rio, debaixo da ponte da Rota 24, pro colar da prima que atravessa o rio no sábado.',
  passo:{
    onde:'rota24', titulo:'Juntar concha pro Cody', sub:'Inteiras, no fundo do rio, debaixo da ponte.',
    item:'Concha', meta:3,
    texto:['Debaixo da ponte o rio fica fundo e devagar. Entre as pedras do fundo, uma concha branca aparece e some com a água.'],
    escolhas:[
      {texto:'Catar na parte rasa, perto da margem.', teste:{status:'percepcao', dificuldade:6, nome:'Percepção', eixo:'paciencia'},
       bom:{ganha:1, resultado:['Com a água pelo joelho, você vira uma pedra e acha uma concha inteira grudada embaixo.']},
       ruim:{resultado:['Você acha meia concha, outra meia concha e uma que era pedra.']}},
      {texto:d => `Ir até o fundo do rio ${Campo.surfar().como}.`, cond:d => Campo.surfar().pode,
       ganha:2, resultado:d => [`${nomeExib(Campo.surfar().quem)} desce até o fundo e volta com duas conchas inteiras.`]},
      {texto:'Tirar do monte onde um Poliwag dorme.',
       luta:{dex:60, ganha:2, intro:['No raso, as conchas boas estão empilhadas, e em cima delas dorme um Poliwag. Ele acorda quando você estica a mão.'],
         venceu:['O Poliwag volta pra água. O monte é seu: você escolhe as duas mais inteiras.'],
         perdeu:['O Poliwag te molha da cabeça aos pés e volta a dormir em cima do monte.']}}
    ]
  },
  volta:{
    titulo:'Levar as conchas pro Cody', falta:'O Cody continua com o colar sem concha.',
    falas:[
      'O Cody segura cada concha contra o sol, uma de cada vez, procurando rachadura.',
      fala('Cody', 'Inteiras. Todas.'),
      'Ele fura cada uma com a ponta de um prego, devagar, e passa o cordão.',
      fala('Cody', 'Grava o meu número. No sábado eu te conto se ela atravessou.')
    ],
    premio:{dinheiro:800, itens:{'Super Potion':2}, rep:'Trouxe conchas do fundo do rio pra um nadador de Cerulean'}
  },
  contato:{rotulo:'Perguntar da travessia', falas:[
    'Ela atravessou! Chegou do outro lado chorando e rindo, de colar no pescoço.',
    'A minha prima não tira o colar nem pra dormir. A mãe dela desistiu.',
    'O ombro melhorou. Desci debaixo da ponte ontem e não achei nenhuma concha inteira. Você levou as melhores.'
  ]}
},

/* ─── Rota 9: o Tonel do Gunnar ────────────────────────── */
{
  id:'tonel_do_gunnar', cidade:'rota9', quem:'Gunnar', arq:'gunnar', quadro:[23, 0, 33], tipo:'resgate', desde:7,
  titulo:'O Machop do Gunnar',
  oferta:{titulo:'O montanhista do saco de lona', sub:'De gorro verde, ele está sentado numa pedra com um saco de lona enorme do lado.'},
  pedido:[
    'Na trilha que leva ao Túnel da Rocha, um homem forte de gorro verde e regata está sentado numa pedra, com um saco de lona enorme do lado e uma lanterna apagada na mão.',
    fala('Gunnar', 'O Tonel carregava a outra metade da carga. É um Machop. Ele carrega qualquer coisa.'),
    fala('Gunnar', 'A minha lanterna apagou lá dentro, ontem. Eu saí tateando a parede. Ele ficou do outro lado de onde desabou.'),
    fala('Gunnar', 'Se você chamar o nome dele alto, ele responde. Ele sempre responde.', 'baixo')
  ],
  aceitar:'"Eu busco o Tonel."', recusar:'"Agora eu não posso."',
  recusou:[fala('Gunnar', 'Tudo bem. Ele aguenta. Ele aguenta mais que eu.')],
  lembrete:'O Gunnar, montanhista da Rota 9, perdeu o Tonel, um Machop, dentro do Túnel da Rocha, quando a lanterna apagou e um pedaço da galeria desabou entre os dois. Ele disse que o Tonel responde quando chamam o nome dele.',
  passo:{
    onde:'tunel_rocha', titulo:'Procurar o Tonel, o Machop do Gunnar', sub:'Do outro lado de uma galeria que desabou.',
    texto:['O Túnel da Rocha não tem uma luz acesa. Em algum lugar, do outro lado de pedra caída, um Machop segura uma carga que não é dele.'],
    escolhas:[
      {texto:d => { const l = Campo.iluminar(); return `Iluminar as galerias ${l.como || 'com luz'}.`; }, cond:d => Campo.iluminar().pode,
       desgaste:d => Campo.iluminar().semPilha ? null : 'Lanterna',
       teste:{status:'percepcao', dificuldade:5, nome:'Percepção'},
       bom:{achou:true, resultado:['A luz bate numa pilha de pedra nova, de quina viva. Do outro lado, alguma coisa empurra a carga pro lado pra te ver.']},
       ruim:{resultado:['A luz acha três galerias iguais. Você volta pela que entrou.']}},
      {texto:'Chamar "Tonel!" bem alto.', teste:{status:'carisma', dificuldade:7, nome:'Carisma'},
       bom:{achou:true, resultado:['O eco volta duas vezes. Na terceira, quem responde é um grunhido, e o barulho de uma carga pesada sendo posta no chão.']},
       ruim:{resultado:['O eco volta, e mais nada. Lá do fundo, um Zubat responde no lugar dele.']}},
      {texto:'Tirar as pedras da galeria que desabou.', teste:{status:'forca', dificuldade:8, nome:'Força', eixo:'coragem'},
       bom:{achou:true, resultado:['Você tira pedra por pedra até abrir um buraco do tamanho de um braço. Do outro lado, um braço cinza já está tirando as dele.']},
       ruim:{resultado:['A pilha mexe por cima de você, e você para antes que ela resolva mexer de vez.']}}
    ],
    luta:{dex:74, intro:['O Tonel está ali, com a carga nas costas, e entre vocês dois um Geodude rolou pra boca da passagem e não sai.'],
      venceu:['O Geodude rola pra outra galeria. O Tonel passa pela abertura sem largar a carga.'],
      perdeu:['O Geodude fecha a passagem com o corpo, e o Tonel recua pro escuro de novo.']}
  },
  volta:{
    titulo:'Levar o Tonel de volta pro Gunnar', falta:'O Gunnar continua sentado na pedra, do lado do saco de lona.',
    falas:[
      'O Gunnar levanta antes de você chegar: ele ouviu o passo do Tonel, que é mais pesado que o seu.',
      'O Machop põe a carga do lado do saco de lona, alinhada, e só depois deixa ele abraçar.',
      fala('Gunnar', 'Você nunca larga a carga, né? Nunca.', 'riso'),
      fala('Gunnar', 'Toma. E grava o meu número: eu subo e desço essa serra toda semana.')
    ],
    premio:{dinheiro:800, itens:{'Revive':1, 'Pilha':2}, rep:'Tirou o Machop de um montanhista de dentro do Túnel da Rocha'}
  },
  contato:{rotulo:'Perguntar do Tonel', falas:[
    'O Tonel não entra mais no túnel sem a lanterna acesa na frente. Aprendeu antes de mim.',
    'Ontem ele carregou o meu saco e o de um turista. O turista não pediu.',
    'Comprei duas lanternas. Ele carrega a reserva.'
  ]}
},

/* ─── Vermilion: a caixinha do Abner ───────────────────── */
{
  id:'caixinha_do_abner', cidade:'vermilion', quem:'Abner', arq:'abner', quadro:[27, 8, 26], tipo:'entrega', desde:9,
  titulo:'A caixinha do Abner',
  oferta:{titulo:'O marinheiro aposentado do cais', sub:'Ele tem uma caixinha embrulhada num lenço no colo e olha pro lado de Lavender.'},
  pedido:[
    'No banco do cais, um marinheiro velho e largo, de uniforme branco desbotado, segura uma caixinha embrulhada num lenço como se ela estivesse dormindo.',
    fala('Abner', 'A minha sobrinha mora em Lavender. Faz dois anos que eu não subo até lá.'),
    fala('Abner', 'A perna não deixa. E o correio de Lavender perde encomenda. Já perdeu duas.'),
    fala('Abner', 'É uma caixinha de música. Era da mãe dela. A Elowen vai saber.', null, 'Ele estende a caixinha antes de você dizer que leva.')
  ],
  aceitar:'"Eu levo pra ela."', recusar:'"Não vou pra aqueles lados agora."',
  recusou:[fala('Abner', 'Tudo bem. Ela esperou dois anos, espera mais uns dias.', 'baixo')],
  entrega:'Caixinha de música',
  lembrete:'O Abner, marinheiro aposentado de Vermilion, pediu pra levar uma caixinha de música pra sobrinha dele, a Elowen, em Lavender.',
  passo:{
    onde:'lavender', titulo:'Entregar a caixinha do Abner pra Elowen', sub:'A casa de portão baixo mais perto da Torre.',
    texto:[
      'A Elowen mora na casa de portão baixo mais perto da Torre. Ela abre a porta de roupa branca de médium, e para quando vê o lenço.'
    ],
    escolhas:[
      {texto:'Entregar a caixinha.', entrega:true, tempo:0, resultado:[
        'Ela desembrulha ali mesmo, na porta. A caixinha toca três notas e engasga na quarta.',
        fala('Elowen', 'Era da minha mãe. Ele guardou esse tempo todo.', 'baixo'),
        fala('Elowen', 'Diz pra ele que ainda engasga na quarta. Ele vai entender.')
      ]}
    ]
  },
  volta:{
    titulo:'Contar pro Abner como foi', falta:'O Abner continua no banco do cais, olhando pro lado de Lavender.',
    falas:[
      'O Abner está no mesmo banco. Ele não pergunta: espera você dizer.',
      'Você conta que ela desembrulhou na porta, e que a caixinha ainda engasga na quarta nota.',
      fala('Abner', 'Ainda engasga.', 'riso', 'Ele ri pela primeira vez desde que você chegou.'),
      fala('Abner', 'A mãe dela deixou cair da escada quando a Elowen tinha seis anos. Nunca mais tocou a quarta direito.'),
      fala('Abner', 'Toma. E grava o meu número. Marinheiro aposentado tem tempo demais.')
    ],
    premio:{dinheiro:1000, itens:{'Revive':1}, rep:'Levou uma encomenda de Vermilion até Lavender'}
  },
  contato:{rotulo:'Perguntar da Elowen', falas:[
    'Ela ligou ontem. Pôs a caixinha no telefone pra eu ouvir. Engasgou na quarta.',
    'A Elowen vai descer pra Vermilion no mês que vem. Eu já varri o barco três vezes.',
    'Ela disse que você subiu a escada da casa dela sem pisar no degrau que range. Ninguém faz isso.'
  ]}
},

/* ─── Vermilion: a pergunta do filho do Morris ─────────── */
{
  id:'pergunta_do_morris', cidade:'vermilion', quem:'Morris', arq:'morris', quadro:[32, 22, 22], tipo:'mostrar', desde:9,
  mostra:{contente:true},
  titulo:'A pergunta do filho do Morris',
  oferta:{titulo:'O pai do menino de Pikachu', sub:'Careca, de camiseta de Pikachu, ele levanta no alto um menino vestido de Pikachu.'},
  pedido:[
    'Na porta do fã-clube de Pokémon, um homem careca de camiseta de Pikachu levanta no alto um menino de uns três anos vestido de Pikachu, com orelha e tudo. O menino ri. O pai ri mais.',
    fala('Morris', 'Ele pergunta pra todo treinador que passa se o Pokémon gosta dele. Todo mundo diz que sim.'),
    fala('Morris', 'Agora ele não acredita mais. Diz que todo mundo fala isso.'),
    fala('Morris', 'Ele quer ver um que goste de verdade. Que dê pra ver de longe. E o único Pikachu lá de casa é esse aqui.', 'riso')
  ],
  aceitar:'"Eu volto com um."', recusar:'"Hoje não."',
  recusou:[fala('Morris', 'Tudo bem. Ele pergunta pro próximo.')],
  lembrete:'O Morris, do fã-clube de Vermilion, tem um filho pequeno que pergunta pra todo treinador se o Pokémon gosta dele, e não acredita mais em ninguém. Ele quer ver um que goste de verdade, de um jeito que dê pra ver de longe.',
  volta:{
    titulo:d => { const p = Tarefas.quem('pergunta_do_morris'); return p ? `Mostrar ${nomeExib(p)} pro filho do Morris` : 'Mostrar um Pokémon pro filho do Morris'; },
    falta:'O filho do Morris quer ver um Pokémon que goste de verdade de quem anda com ele.',
    falas:d => {
      const p = Tarefas.quem('pergunta_do_morris');
      if (!p) return [];
      const n = nomeExib(p), pr = pron(p);
      return [
        `O menino desce do colo do pai e fica parado na sua frente, de braço cruzado. ${n} não olha pra ele: olha pra você.`,
        `Você dá dois passos pro lado, e ${n} dá dois passos pro lado. Você senta no degrau, e ${pr.ele} encosta a cabeça no seu joelho sem ninguém mandar.`,
        'O menino descruza o braço.',
        fala('Morris', 'Pronto. Agora ele acredita. Vai ser um problema: ele vai querer um igual.', 'riso'),
        fala('Morris', 'Leva isso. É o sininho que o fã-clube dá pra quem chega com um assim.')
      ];
    },
    premio:{itens:{'Soothe Bell':1}, rep:'Mostrou a um menino de Vermilion um Pokémon que gosta de verdade de quem anda com ele'}
  }
},

/* ─── Vermilion: o caldo da Hilde ──────────────────────── */
{
  id:'caldo_da_hilde', cidade:'vermilion', quem:'Hilde', f:true, arq:'hilde', quadro:[27, 21, 24], tipo:'coleta', desde:10,
  titulo:'O caldo da Hilde',
  oferta:{titulo:'A cozinheira da pensão do porto', sub:'De lenço de flor na cabeça e avental azul, ela prova o caldo e põe a colher de lado.'},
  pedido:[
    'Na pensão do porto, onde os marinheiros almoçam em pé, uma moça de lenço florido na cabeça e avental azul prova o caldo da panela e põe a colher de lado.',
    fala('Hilde', 'Falta o sal. Não o de pacote: o das pedras.'),
    fala('Hilde', 'Na maré baixa, as poças das pedras da Rota 12 secam e deixam uma casca de sal grosso na borda. É ele que dá o gosto do caldo.'),
    fala('Hilde', 'Três punhados. Eu ia buscar, mas se eu sair da cozinha, os marinheiros comem a panela crua.', 'riso')
  ],
  aceitar:'"Eu trago o sal."', recusar:'"Hoje eu não vou pra lá."',
  recusou:[fala('Hilde', 'Então hoje é caldo de pacote. Ninguém vai reparar. Eu vou.')],
  lembrete:'A Hilde, cozinheira da pensão do porto de Vermilion, quer três punhados do sal grosso que seca nas poças das pedras da Rota 12, na maré baixa.',
  passo:{
    onde:'rota12', titulo:'Raspar sal grosso pra Hilde', sub:'A casca de sal que seca na borda das poças das pedras.',
    item:'Sal grosso', meta:3,
    texto:['Na beira da Rota 12 as pedras fazem poça, e a poça que o sol secou fica branca de sal na borda.'],
    escolhas:[
      {texto:'Procurar as poças que o sol já secou.', teste:{status:'percepcao', dificuldade:6, nome:'Percepção', eixo:'paciencia'},
       bom:{ganha:1, resultado:['Numa poça rasa no alto da pedra, a casca de sal está grossa e seca. Você raspa um punhado inteiro.']},
       ruim:{resultado:['As poças que você acha ainda estão molhadas. O sal delas escorre pela mão.']}},
      {texto:d => `Ir até as pedras de fora ${Campo.surfar().como}.`, cond:d => Campo.surfar().pode,
       ganha:2, resultado:d => [`Nas pedras de fora, onde ninguém chega a pé, as poças estão brancas até o fundo. ${nomeExib(Campo.surfar().quem)} espera enquanto você raspa dois punhados.`]},
      {texto:'Raspar a poça grande, onde alguma coisa boia.',
       luta:{dex:72, ganha:2, intro:['A poça grande tem a casca de sal mais grossa de todas, e no meio dela boia um Tentacool que não gosta de mão perto dele.'],
         venceu:['O Tentacool escorrega pro mar por uma fresta da pedra. A poça é sua.'],
         perdeu:['O Tentacool te queima o braço, e o sal cai de volta na poça.']}}
    ]
  },
  volta:{
    titulo:'Levar o sal pra Hilde', falta:'A Hilde continua provando o caldo sem sal.',
    falas:[
      'A Hilde joga uma pitada na panela, mexe três vezes e prova.',
      fala('Hilde', 'Isso. Agora é caldo.'),
      'Os marinheiros da mesa do canto param de falar quando o cheiro chega neles.',
      fala('Hilde', 'Leva duas porções pro seu time. E isso aqui, que um cozinheiro de navio deixou comigo faz um ano e nunca voltou pra buscar.', null, 'Ela embrulha num pano de prato.')
    ],
    premio:{itens:{'Leftovers':1, 'Ração':2}, rep:'Trouxe sal das pedras pra cozinha da pensão do porto de Vermilion'}
  }
},

/* ─── Lavender: as flores da Elowen ────────────────────── */
{
  id:'flores_da_mirela', cidade:'lavender', quem:'Elowen', f:true, arq:'elowen', quadro:[29, 24, 22], tipo:'coleta', desde:8,
  titulo:'As flores da Elowen',
  oferta:{titulo:'A médium do portão baixo', sub:'Ela varre, de roupa branca, uma calçada que já está varrida, e olha pro lado da Rota 8.'},
  pedido:[
    d => d.tarefas && d.tarefas.caixinha_do_abner && d.tarefas.caixinha_do_abner.entregou
      ? 'A Elowen está na calçada de novo, de vassoura. Ela te reconhece pelo jeito de abrir o portão.'
      : 'Na casa de portão baixo mais perto da Torre, uma moça de roupa branca de médium varre uma calçada que já está varrida.',
    fala('Elowen', 'Toda semana eu subo a Torre com flor-de-sino. Esta semana eu não posso sair de perto dela: é a semana da vigília.'),
    fala('Elowen', 'A flor-de-sino cresce no capim da Rota 8. De dia ela fica fechada e some no meio do mato. De noite ela abre, branca, e dá pra ver de longe.'),
    fala('Elowen', 'Três. Não precisa ser bonita. Precisa ser de lá.')
  ],
  aceitar:'"Eu trago três."', recusar:'"Esta semana eu não posso."',
  recusou:[fala('Elowen', 'Ninguém pode, esta semana. Eu entendo.', 'baixo')],
  lembrete:'A Elowen, médium de Lavender, quer três flores-de-sino do capim da Rota 8. Ela disse que de dia elas ficam fechadas, e de noite abrem.',
  passo:{
    onde:'rota8', titulo:'Colher flor-de-sino pra Elowen', sub:'No capim da rota: fechadas de dia, abertas de noite.',
    item:'Flor-de-sino', meta:3,
    texto:d => ehNoite()
      ? ['O capim da Rota 8 está pontilhado de branco: as flores-de-sino abertas, balançando sem vento.']
      : ['De dia o capim da Rota 8 é só capim. Se tem flor-de-sino aqui, está fechada.'],
    escolhas:[
      {texto:'Colher as que estão abertas.', cond:d => ehNoite(), teste:{status:'percepcao', dificuldade:4, nome:'Percepção'},
       bom:{ganha:2, resultado:['Você colhe duas sem pisar no capim. As outras fecham quando a sua sombra passa por cima.']},
       ruim:{ganha:1, resultado:['Você colhe uma. As outras fecham quando a sua sombra passa por cima.']}},
      {texto:'Procurar as fechadas no meio do capim.', cond:d => !ehNoite(), teste:{status:'percepcao', dificuldade:8, nome:'Percepção', eixo:'paciencia'},
       bom:{ganha:1, resultado:['No meio do capim, um botão branco do tamanho de um dedal, fechado. Você corta pelo talo.']},
       ruim:{resultado:['Tudo que você acha é capim, e um Ekans que não gostou de ser achado.']}},
      {texto:'Esperar a noite no barranco.', cond:d => !ehNoite(), espera:19,
       resultado:['Você senta no barranco e espera o sol ir embora. Quando escurece, o capim acende de branco.']}
    ]
  },
  volta:{
    titulo:'Levar as flores-de-sino pra Elowen', falta:'A Elowen continua varrendo a calçada.',
    falas:[
      'A Elowen segura as flores pelo talo, juntas, e elas fecham na mão dela, devagar, uma de cada vez.',
      fala('Elowen', 'Elas fecham quando sentem mão de gente. Lá em cima, abrem de novo.'),
      d => d.tarefas && d.tarefas.caixinha_do_abner && d.tarefas.caixinha_do_abner.entregou
        ? fala('Elowen', 'A caixinha do meu tio está na janela. Ainda engasga na quarta nota.') : '',
      fala('Elowen', 'Obrigada. Como a minha mãe dizia: obrigada por mim e por quem não pode dizer.', 'baixo')
    ],
    premio:{dinheiro:500, itens:{'Repelente':3, 'Full Heal':1}, rep:'Levou flores pra Torre de Lavender na semana da vigília'}
  }
},

/* ─── Rota 6: o envelope da Poppy ──────────────────────── */
{
  id:'envelope_da_poppy', cidade:'rota6', quem:'Poppy', f:true, arq:'poppy', quadro:[29, 12, 24], tipo:'entrega', desde:9,
  titulo:'O envelope da Poppy',
  oferta:{titulo:'A menina do boné verde-água', sub:'De lenço laranja no pescoço, ela está deitada no capim, esperando alguma coisa acordar.'},
  pedido:[
    'Deitada de barriga no capim da beira do lago, uma menina de boné verde-água e lenço laranja no pescoço prende a respiração, de olho num Oddish plantado a três passos dela.',
    fala('Poppy', 'Shh. Ele acorda às cinco. Faz três dias que eu espero ele acordar.', 'baixo'),
    fala('Poppy', 'As fotos dos três dias estão nesse envelope. O concurso do jornal de Celadon fecha amanhã, e se eu sair daqui, eu perco a quarta.'),
    fala('Poppy', 'Você leva pra mim? É só pôr na caixa do concurso, na portaria do jornal.', 'baixo')
  ],
  aceitar:'"Eu levo."', recusar:'"Não vou pra Celadon agora."',
  recusou:[fala('Poppy', 'Tá. Shh.', 'baixo')],
  entrega:'Envelope pardo',
  lembrete:'A Poppy, que fotografa um Oddish na Rota 6, pediu pra levar o envelope com as fotos dela até a caixa do concurso, na portaria do jornal de Celadon.',
  passo:{
    onde:'celadon', titulo:'Pôr o envelope da Poppy na caixa do concurso', sub:'Na portaria do jornal, na avenida.',
    texto:['O jornal de Celadon ocupa um sobrado da avenida. Na portaria, do lado da catraca, tem uma caixa de madeira com uma fenda e uma etiqueta: CONCURSO DE FOTOGRAFIA.'],
    escolhas:[
      {texto:'Pôr o envelope na caixa.', entrega:true, tempo:0, resultado:[
        'O envelope cai em cima de outros e faz barulho de pouca coisa.',
        'O porteiro carimba a data num papelzinho e te entrega sem levantar os olhos do jornal. É o recibo.'
      ]}
    ]
  },
  volta:{
    titulo:'Contar pra Poppy que o envelope chegou', falta:'A Poppy continua deitada no capim, esperando.',
    falas:[
      'A Poppy está no mesmo lugar, de câmera na mão, e o Oddish está acordado na frente dela, olhando a lente.',
      'Você mostra o recibo carimbado. Ela lê a data duas vezes.',
      fala('Poppy', 'Chegou a tempo. E ele acordou. Os dois no mesmo dia.', 'riso'),
      fala('Poppy', 'Toma, é o que sobrou da mesada. E grava o meu número: se eu ganhar, você fica sabendo antes da minha mãe.')
    ],
    premio:{dinheiro:1000, itens:{'Great Ball':3}, rep:'Levou as fotos de uma menina da Rota 6 até o concurso do jornal de Celadon'}
  },
  contato:{rotulo:'Perguntar do concurso', falas:[
    'Fiquei em terceiro! A foto saiu no jornal, do lado da previsão do tempo.',
    'A foto que ganhou é a do Oddish de olho aberto. Eu chamei de "Cinco da Tarde".',
    'Agora eu espero um Bellsprout acordar. Esse é mais difícil: ele finge.'
  ]}
},

/* ─── Rota 12: a bola de cristal da Mavis ──────────────── */
{
  id:'cristal_da_mavis', cidade:'rota12', quem:'Mavis', f:true, arq:'mavis', quadro:[28, 14, 24], tipo:'mostrar', desde:10,
  mostra:{tipo:'Fantasma'},
  titulo:'A bola de cristal da Mavis',
  oferta:{titulo:'A cartomante do píer', sub:'De chapéu roxo pontudo, ela lê a sorte dos pescadores com uma bola de cristal no colo.'},
  pedido:[
    'No começo do píer, uma moça de chapéu roxo pontudo e capa de redemoinho lê a sorte dos pescadores, com uma bola de cristal no colo. Quando o último vai embora, ela suspira.',
    fala('Mavis', 'Desde os doze anos eu leio a sorte nesse píer. Eu falo dos espíritos da Torre todo dia.'),
    fala('Mavis', 'Nunca vi um Pokémon fantasma. De perto, nenhum. Na Torre eu não entro.', 'baixo'),
    fala('Mavis', 'Eu tenho medo. Não conta pra ninguém.', 'baixo'),
    fala('Mavis', 'Se você tiver um, traz aqui? Com você do lado, eu acho que eu aguento.')
  ],
  aceitar:'"Eu trago."', recusar:'"Isso não é comigo."',
  recusou:[fala('Mavis', 'Eu sabia que você ia dizer isso. Eu leio a sorte, lembra?', 'riso')],
  lembrete:'A Mavis, cartomante do píer da Rota 12, fala dos espíritos da Torre todo dia e nunca viu um Pokémon do tipo Fantasma de perto. Ela tem medo, e pediu pra você levar um até ela.',
  volta:{
    titulo:d => { const p = Tarefas.quem('cristal_da_mavis'); return p ? `Mostrar ${nomeExib(p)} pra Mavis` : 'Mostrar um Pokémon fantasma pra Mavis'; },
    falta:'A Mavis quer ver de perto um Pokémon do tipo Fantasma.',
    falas:d => {
      const p = Tarefas.quem('cristal_da_mavis');
      if (!p) return [];
      const n = nomeExib(p), pr = pron(p);
      return [
        `A Mavis aperta a bola de cristal com as duas mãos quando ${n} aparece do seu lado.`,
        `${n} chega perto da bola, olha o próprio reflexo e faz uma careta pra ele.`,
        'A Mavis ri antes de conseguir ter medo.',
        fala('Mavis', `${pr.Ele} é engraçad${pr.o}. Ninguém me disse que eles eram engraçados.`, 'riso'),
        fala('Mavis', 'Leva isso. Eu ia ler a sua sorte, mas você já sabe ela.')
      ];
    },
    premio:{dinheiro:1000, itens:{'Elixir':1, 'Full Heal':1}, rep:'Mostrou um Pokémon fantasma a uma cartomante do píer da Rota 12'}
  }
},

/* ─── Celadon: o perfume da Sylvie ──────────────────────── */
{
  id:'perfume_da_lotte', cidade:'celadon', quem:'Sylvie', f:true, arq:'sylvie', quadro:[26, 7, 26], tipo:'coleta', desde:10,
  titulo:'O perfume da Sylvie',
  oferta:{titulo:'A perfumista da vitrine', sub:'Na vitrine da loja de perfume tem um frasco vazio com uma etiqueta escrita à mão: "Rota 7".'},
  pedido:[
    'A loja de perfume da avenida tem cheiro de dez lojas de perfume. A dona, uma moça loira de vestido rosa, cheira o próprio pulso e faz careta.',
    fala('Sylvie', 'Celadon inteira usa perfume de flor. Eu quero fazer um que tenha cheiro de mato de verdade.'),
    fala('Sylvie', 'O Oddish da Rota 7 solta a folha velha quando se planta pra dormir. Aquela folha tem o cheiro que eu quero.'),
    fala('Sylvie', 'Três folhas inteiras, sem rasgar. E não arranca do Oddish, por favor. Ele chora.')
  ],
  aceitar:'"Eu trago as folhas."', recusar:'"Agora não."',
  recusou:[fala('Sylvie', 'O frasco espera. Frasco é bom nisso.')],
  lembrete:'A Sylvie, perfumista de Celadon, quer três folhas de Oddish da Rota 7, das que o Oddish solta quando se planta pra dormir.',
  passo:{
    onde:'rota7', titulo:'Juntar folha de Oddish pra Sylvie', sub:'As folhas velhas que o Oddish solta quando se planta pra dormir.',
    item:'Folha de Oddish', meta:3,
    texto:d => ehNoite()
      ? ['No capim da Rota 7, os Oddish estão plantados em fila, de olhos fechados, e o chão em volta deles está forrado de folha.']
      : ['Os Oddish da Rota 7 andam pelo capim, acordados. Folha no chão, só a que o vento derrubou.'],
    escolhas:[
      {texto:'Juntar as folhas do chão, devagar, sem acordar ninguém.', cond:d => ehNoite(), teste:{status:'percepcao', dificuldade:5, nome:'Percepção', eixo:'cuidado'},
       bom:{ganha:2, resultado:['Você junta duas folhas inteiras, compridas, ainda mornas. Nenhum Oddish abre o olho.']},
       ruim:{resultado:['Um Oddish acorda, olha pra você e vai se replantar mais longe, levando as folhas dele.']}},
      {texto:'Pedir com jeito pra um Oddish acordado.', cond:d => !ehNoite(), teste:{status:'carisma', dificuldade:7, nome:'Carisma', eixo:'simpatia'},
       bom:{ganha:1, resultado:['O Oddish te olha, balança as folhas da cabeça e deixa cair uma, inteira.']},
       ruim:{resultado:['O Oddish solta um pó amarelo na sua direção e vai embora. A folha fica com ele.']}},
      {texto:'Esperar a noite, quando eles se plantam.', cond:d => !ehNoite(), espera:19,
       resultado:['Você espera na beira da rota. Quando escurece, os Oddish param de andar, um por um, e se plantam em fila.']}
    ]
  },
  volta:{
    titulo:'Levar as folhas pra Sylvie', falta:'A Sylvie continua cheirando o próprio pulso.',
    falas:[
      'A Sylvie encosta o nariz na primeira folha e fecha os olhos por tempo demais.',
      fala('Sylvie', 'Isso. Mato molhado, terra e alguma coisa doce que eu não sei o nome.'),
      fala('Sylvie', 'O primeiro frasco é seu. Não tem nome ainda. Se tiver, vai ser Rota 7.', 'riso')
    ],
    premio:{dinheiro:1200, itens:{'Frasco de perfume':1, 'Super Potion':2}, rep:'Ajudou a perfumista de Celadon a fazer um perfume novo'}
  }
},

/* ─── Celadon: o Barão do Percy ────────────────────────── */
{
  id:'barao_do_percy', cidade:'celadon', quem:'Percy', arq:'percy', quadro:[26, 11, 24], tipo:'resgate', desde:10,
  titulo:'O Meowth do Percy',
  oferta:{titulo:'O menino de terno azul', sub:'Loiro, de terno, ele segura uma coleira dourada vazia na porta de um prédio de mármore.'},
  pedido:[
    'Na porta de um prédio de mármore da avenida, um menino loiro de terno azul, de uns onze anos, segura uma coleira dourada vazia e tenta não chorar na frente do porteiro.',
    fala('Percy', 'O Barão saiu atrás de uma moeda que rolou na calçada. A moeda rolou até a Rota 16. Ele também.'),
    fala('Percy', 'É um Meowth. Ele tem uma coleira igual a essa. Eu tenho duas porque ele perde.'),
    fala('Percy', 'Meu pai disse que manda alguém. Ninguém foi. Você vai?', 'baixo')
  ],
  aceitar:'"Eu vou buscar o Barão."', recusar:'"Agora não dá."',
  recusou:[fala('Percy', 'Tudo bem. Eu espero aqui. Eu sou bom de esperar.', 'frio')],
  lembrete:'O Percy, menino de Celadon, perdeu o Barão, um Meowth de coleira dourada que correu atrás de uma moeda até a Rota 16.',
  passo:{
    onde:'rota16', titulo:'Achar o Barão, o Meowth do Percy', sub:'Um Meowth de coleira dourada, no capim alto.',
    texto:['A Rota 16 é capim alto, com a ciclovia passando por cima. No meio do capim, alguma coisa dourada brilha e some.'],
    escolhas:[
      {texto:'Seguir o brilho no capim.', teste:{status:'percepcao', dificuldade:7, nome:'Percepção', eixo:'paciencia'},
       bom:{achou:true, resultado:['O brilho para, e você chega nele: uma coleira dourada, e um Meowth dentro dela, sentado em cima de uma moeda.']},
       ruim:{resultado:['O brilho era uma lata vazia. O segundo também.']}},
      {texto:'Balançar umas moedas no bolso.', teste:{status:'sorte', dificuldade:6, nome:'Sorte'},
       bom:{achou:true, resultado:['No terceiro tilintar, duas orelhas aparecem no meio do capim, viradas pro seu bolso.']},
       ruim:{resultado:['O tilintar só chama um Rattata, que não está interessado em moeda nenhuma.']}},
      {texto:'Espalhar um pouco de Ração e esperar quieto.', cond:d => Estado.contaItem('Ração') > 0, gasta:{'Ração':1}, tempo:2,
       achou:true, resultado:['Você espera sentad{o|a} na beira da ciclovia. Ele chega pela Ração e fica pela companhia, com a coleira brilhando.']}
    ],
    luta:{dex:84, intro:['Mas ele está em cima de um mourão da cerca, de pelo em pé, e embaixo um Doduo bica a coleira dele com as duas cabeças.'],
      venceu:['O Doduo sai correndo pela trilha. O Barão desce do mourão e sobe no seu ombro como se o ombro fosse dele.'],
      perdeu:['O Doduo te faz recuar, e o Barão pula do mourão pro meio do capim e some de novo.']}
  },
  volta:{
    titulo:'Levar o Barão de volta pro Percy', falta:'O Percy continua na porta do prédio, segurando a coleira vazia.',
    falas:[
      'O Percy esquece que está de terno e se ajoelha na calçada.',
      fala('Percy', 'Barão! Você não pode correr atrás de toda moeda!', 'grita'),
      'O Meowth deixa cair na mão dele a moeda que trazia na boca, como quem paga a conta.',
      fala('Percy', 'Meu pai mandou te dar isso. Na verdade eu mandei, mas ele concordou.', null, 'Ele te passa um envelope e uma moeda antiga de ouro, das de colecionador.')
    ],
    premio:{dinheiro:1000, itens:{'Amulet Coin':1}, rep:'Achou o Meowth de um menino de Celadon na Rota 16'}
  }
},

/* ─── Celadon: a sacola da Kenzie ──────────────────────── */
{
  id:'sacola_da_kenzie', cidade:'celadon', quem:'Kenzie', f:true, arq:'kenzie', quadro:[27, 9, 29], tipo:'entrega', desde:10,
  titulo:'A sacola da Kenzie',
  oferta:{titulo:'A ciclista do boné branco', sub:'De cabelo rosa e boné branco, ela gira no dedo uma sacola de peça de bicicleta.'},
  pedido:[
    'Na entrada da ciclovia, uma moça de cabelo rosa e boné branco gira no dedo uma sacola de lona cheia de peça de bicicleta, e cada volta faz barulho de metal.',
    fala('Kenzie', 'O dono da oficina de Cerulean me emprestou isso quando a minha bicicleta quebrou. Eu disse que devolvia em um mês.'),
    fala('Kenzie', 'Faz três.'),
    fala('Kenzie', 'Eu não tenho coragem de olhar na cara dele. Você leva? É a oficina da roda pendurada na porta, na rua de trás do Centro.')
  ],
  aceitar:'"Eu levo a sacola."', recusar:'"Isso é você que tem que fazer."',
  recusou:[fala('Kenzie', 'Eu sei. Por isso faz três meses.', 'frio')],
  entrega:'Sacola de peças',
  lembrete:'A Kenzie, ciclista de Celadon, pediu pra devolver uma sacola de peças de bicicleta na oficina de Cerulean, a da roda pendurada na porta, na rua de trás do Centro. Ela devia isso fazia três meses.',
  passo:{
    onde:'cerulean', titulo:'Devolver a sacola da Kenzie na oficina', sub:'A da roda pendurada na porta, atrás do Centro.',
    texto:['Na rua de trás do Centro, uma roda de bicicleta pendurada na porta gira com o vento. Lá dentro, um senhor de macacão aperta um raio com os dedos sujos de graxa.'],
    escolhas:[
      {texto:'Devolver a sacola.', entrega:true, tempo:0, resultado:[
        'Ele abre a sacola, conta as peças com o dedo e para na última.',
        'Diz que tinha esquecido. Diz que a bicicleta dela está com o pneu de trás murcho desde que ela passou aqui, e que é pra ela vir encher, que ele não cobra.'
      ]}
    ]
  },
  volta:{
    titulo:'Contar pra Kenzie como foi', falta:'A Kenzie continua na entrada da ciclovia, sem a sacola.',
    falas:[
      'Você conta que ele tinha esquecido. A Kenzie fica um tempo olhando a ciclovia.',
      fala('Kenzie', 'Três meses com vergonha de uma coisa que ele esqueceu.'),
      'Você conta do pneu murcho. Ela ri pela primeira vez.',
      fala('Kenzie', 'Toma. Eu achei isso no chão da ciclovia, depois de uma corrida. Quem perdeu era mais rápido do que eu.', null, 'Ela põe na sua mão uma garra pequena e lisa, presa num cordão.')
    ],
    premio:{dinheiro:500, itens:{'Quick Claw':1}, rep:'Devolveu as peças de uma ciclista de Celadon na oficina de Cerulean'}
  }
},

/* ─── Saffron: a janela da Bea ─────────────────────────── */
{
  id:'janela_da_bea', cidade:'saffron', quem:'Bea', f:true, arq:'bea', quadro:[27, 25, 24], tipo:'mostrar', desde:12,
  mostra:{tipo:'Gelo'},
  titulo:'A janela da Bea',
  oferta:{titulo:'A menina da janela do segundo andar', sub:'Ela está de pijama de Eevee, com a testa encostada no vidro, acenando pra quem passa.'},
  pedido:[
    'Numa janela de segundo andar, uma menina de pijama de Eevee, com o capuz das orelhas na cabeça, acena pra todo treinador que passa.',
    'A mãe dela desce pra abrir o portão antes de você bater.',
    fala('Bea', 'Eu tô de cama. Febre. Não pega, a minha mãe já disse pra todo mundo.'),
    fala('Bea', 'Eu nunca vi um Pokémon de gelo de verdade. Só na televisão. Diz que eles são frios de encostar.', null, 'Ela encosta a mão no vidro, que não está frio.'),
    fala('Bea', 'Se você tiver um, você traz aqui? Só pra eu encostar.')
  ],
  aceitar:'"Quando eu tiver um, eu trago."', recusar:'"Eu não tenho como, Bea."',
  recusou:[fala('Bea', 'Tá bom. Eu fico olhando a janela, então.')],
  lembrete:'A Bea, menina de Saffron que está de cama, nunca viu um Pokémon do tipo Gelo de perto, e queria encostar num.',
  volta:{
    titulo:d => { const p = Tarefas.quem('janela_da_bea'); return p ? `Mostrar ${nomeExib(p)} pra Bea` : 'Mostrar um Pokémon de gelo pra Bea'; },
    falta:'A Bea quer encostar num Pokémon do tipo Gelo.',
    falas:d => {
      const p = Tarefas.quem('janela_da_bea');
      if (!p) return [];
      const n = nomeExib(p), pr = pron(p);
      return [
        `Você sobe a escada com ${n} atrás. A Bea senta na cama de uma vez.`,
        fala('Bea', 'Pode encostar? Posso?', 'grita'),
        `${n} chega perto da cama e abaixa a cabeça, e ela põe a mão aberta em cima ${pr.dele}.`,
        fala('Bea', 'É frio! Mãe, é frio de verdade!', 'grita'),
        'A febre não passa por causa disso. Mas ela dorme antes de você ir embora, com a mão ainda fechada, guardando o frio.'
      ];
    },
    premio:{dinheiro:500, itens:{'Full Heal':2, 'Revive':1}, rep:'Mostrou um Pokémon de gelo a uma menina doente de Saffron'}
  }
},

/* ─── Saffron: o chute da Bryn ─────────────────────────── */
{
  id:'chute_da_bryn', cidade:'saffron', quem:'Bryn', f:true, arq:'bryn', quadro:[36, 8, 29], tipo:'mostrar', desde:12,
  mostra:{tipo:'Lutador'},
  titulo:'O chute da Bryn',
  oferta:{titulo:'A aluna da porta do dojô', sub:'De rabo de cavalo loiro e roupa laranja de treino, ela chuta o ar na porta do dojô.'},
  pedido:[
    'Na porta do dojô de luta, uma moça de rabo de cavalo loiro e roupa laranja de treino chuta o ar, sempre na mesma altura, contando baixinho.',
    fala('Bryn', 'Quatrocentos e um. Quatrocentos e dois.'),
    fala('Bryn', 'O mestre diz que eu chuto como um Hitmonlee. Eu nunca vi um Hitmonlee. Eu nunca vi nenhum Pokémon do tipo Lutador treinar de perto.'),
    fala('Bryn', 'O mestre parou de lutar antes de eu entrar. O dojô ficou só com a gente.'),
    fala('Bryn', 'Se você tiver um, traz aqui? Eu quero ver como é de verdade.')
  ],
  aceitar:'"Eu trago um."', recusar:'"Não tenho como."',
  recusou:[fala('Bryn', 'Quatrocentos e três.', null, 'Ela volta a chutar o ar.')],
  lembrete:'A Bryn, aluna do dojô de Saffron, nunca viu um Pokémon do tipo Lutador treinar de perto, e queria ver como é de verdade.',
  volta:{
    titulo:d => { const p = Tarefas.quem('chute_da_bryn'); return p ? `Levar ${nomeExib(p)} no dojô da Bryn` : 'Levar um Pokémon lutador no dojô'; },
    falta:'A Bryn quer ver de perto um Pokémon do tipo Lutador.',
    falas:d => {
      const p = Tarefas.quem('chute_da_bryn');
      if (!p) return [];
      const n = nomeExib(p);
      return [
        `A Bryn para de chutar quando ${n} entra no dojô. Os dois se olham como se olha antes de uma luta.`,
        `${n} firma os pés. A Bryn firma os dela. Por um minuto inteiro, ninguém respira.`,
        `Ela chuta. ${n} desvia por um dedo e devolve o golpe parado no ar, a um palmo do nariz dela.`,
        fala('Bryn', 'De novo. Por favor, de novo.', 'grita'),
        fala('Bryn', 'Toma. É a faixa que o mestre me deu no primeiro dia. Ela serve mais pra quem bate de verdade.', null, 'Ela tira a faixa do pulso e põe na sua mão.')
      ];
    },
    premio:{dinheiro:500, itens:{'Muscle Band':1}, rep:'Levou um Pokémon lutador pra treinar com uma aluna do dojô de Saffron'}
  }
},

/* ─── Saffron: o Soneca da Nyla ────────────────────────── */
{
  id:'soneca_da_nyla', cidade:'saffron', quem:'Nyla', f:true, arq:'nyla', quadro:[28, 11, 24], tipo:'resgate', desde:12,
  titulo:'O Abra da Nyla',
  oferta:{titulo:'A menina das mãos acesas', sub:'Descalça, de olho fechado, ela segura o ar com as mãos acesas de rosa.'},
  pedido:[
    'Na escada de um prédio, uma menina de cabelo roxo, descalça, está de olho fechado, com as duas mãos abertas no ar. As mãos dela brilham rosa, fraco.',
    fala('Nyla', 'O Soneca teleportou dormindo. Ele faz isso quando sonha que está com medo.'),
    fala('Nyla', 'Eu sinto ele. Está na Rota 5, num canto quieto, ainda dormindo. Tem alguma coisa do lado dele que não é quieta.', 'baixo'),
    fala('Nyla', 'A minha mãe não deixa eu sair de Saffron sozinha. Você vai lá por mim?')
  ],
  aceitar:'"Eu vou buscar o Soneca."', recusar:'"Agora eu não posso."',
  recusou:[fala('Nyla', 'Tá. Eu continuo sentindo ele daqui. Ele continua dormindo.')],
  lembrete:'A Nyla, de Saffron, sente o Soneca, o Abra dela, dormindo num canto quieto da Rota 5: ele teleportou sonhando que estava com medo. Ela disse que tem alguma coisa do lado dele que não é quieta.',
  passo:{
    onde:'rota5', titulo:'Achar o Soneca, o Abra da Nyla', sub:'Um Abra dormindo num canto quieto da rota.',
    texto:['A Rota 5 tem gente demais passando pra um Abra dormir em paz. Se ele está aqui, achou o canto mais quieto.'],
    escolhas:[
      {texto:'Pensar onde é o canto mais quieto da rota.', teste:{status:'intelecto', dificuldade:6, nome:'Intelecto', eixo:'discricao'},
       bom:{achou:true, resultado:['Longe da trilha, atrás da cerca da creche, o capim nem mexe. Lá no meio, um Abra dorme sentado.']},
       ruim:{resultado:['Você acha três cantos quietos. Os três ficam barulhentos quando você chega.']}},
      {texto:'Andar devagar pelo capim, sem fazer barulho.', teste:{status:'percepcao', dificuldade:7, nome:'Percepção', eixo:'discricao'},
       bom:{achou:true, resultado:['No meio do capim, um Abra dorme encolhido, e a cauda dele se mexe como quem sonha.']},
       ruim:{resultado:['Você pisa num graveto. Tudo que estava quieto vai embora.']}},
      {texto:'Deixar um pouco de Ração no chão e esperar quieto.', cond:d => Estado.contaItem('Ração') > 0, gasta:{'Ração':1}, tempo:2,
       achou:true, resultado:['Você espera sentad{o|a} na sombra. Um Abra aparece do lado da Ração sem ninguém ver ele chegar, ainda dormindo.']}
    ],
    luta:{dex:56, intro:['Ele dorme encostado numa pedra, e um Mankey está sentado do lado, cutucando ele com um graveto.'],
      venceu:['O Mankey vai embora gritando. O Soneca, sem acordar, segura a manga da sua camisa.'],
      perdeu:['O Mankey te enxota, e o Soneca, assustado, some de onde estava. Teleportou de novo.']}
  },
  volta:{
    titulo:'Levar o Soneca de volta pra Nyla', falta:'A Nyla continua na escada, sentindo o Soneca de longe.',
    falas:[
      'A Nyla abre os olhos antes de você chegar na escada.',
      'O Soneca some da sua mão e aparece no colo dela, dormindo. Ela não se assusta: ela sabia.',
      fala('Nyla', 'Ele sonhou com você. Agora ele dorme melhor.'),
      fala('Nyla', 'Isso era do meu pai. Ele usava pra ler. Ele disse que é pra quem ajuda a gente.', null, 'Ela te passa um par de óculos de aro redondo.')
    ],
    premio:{dinheiro:500, itens:{'Wise Glasses':1}, rep:'Achou o Abra de uma menina de Saffron na Rota 5'}
  }
},

/* ─── Rota 16: o doce do Hank ──────────────────────────── */
{
  id:'doce_do_hank', cidade:'rota16', quem:'Hank', arq:'hank', quadro:[31, 6, 26], tipo:'entrega', desde:12,
  titulo:'O doce do Hank',
  oferta:{titulo:'O motoqueiro do pote de vidro', sub:'Enorme e careca, de colete de gola felpuda, ele segura um pote de vidro com as duas mãos.'},
  pedido:[
    'Encostado numa moto no acostamento da ciclovia, um homem enorme e careca, de colete de gola felpuda, segura um pote de vidro com as duas mãos, como se ele fosse quebrar.',
    fala('Hank', 'Doce de abóbora. Eu que fiz. Do jeito da minha avó.'),
    fala('Hank', 'Ela mora em Fuchsia, na casa de janela azul perto da Zona Safári. A gente brigou quando eu comprei a moto. Faz dois anos.'),
    fala('Hank', 'Todo mês eu faço o doce e paro aqui. Eu não chego em Fuchsia.', 'baixo'),
    fala('Hank', 'Você leva? Não precisa dizer que é meu. Ela vai saber pelo açúcar.')
  ],
  aceitar:'"Eu levo o doce."', recusar:'"Leva você, Hank."',
  recusou:[fala('Hank', 'Mês que vem eu levo. É o que eu digo todo mês.', 'frio')],
  entrega:'Pote de doce',
  lembrete:'O Hank, motoqueiro da Rota 16, fez doce de abóbora do jeito da avó e não tem coragem de levar até ela: os dois brigaram faz dois anos. Ela mora na casa de janela azul perto da Zona Safári, em Fuchsia.',
  passo:{
    onde:'fuchsia', titulo:'Entregar o doce do Hank pra avó dele', sub:'A casa de janela azul perto da Zona Safári.',
    texto:['A casa de janela azul fica na rua da cerca da Zona Safári. Uma senhora pequena, de avental, rega uma planta na janela.'],
    escolhas:[
      {texto:'Entregar o pote de doce.', entrega:true, tempo:0, resultado:[
        'Ela abre o pote ali mesmo, prova com a ponta do dedo e fecha de novo.',
        'Diz que ele pôs açúcar demais, como o avô. Pergunta se ele ainda anda naquela moto. Antes de você responder, diz que a casa tem campainha, e que é pra ele lembrar disso.'
      ]}
    ]
  },
  volta:{
    titulo:'Contar pro Hank como foi', falta:'O Hank continua encostado na moto, no acostamento.',
    falas:[
      'O Hank não pergunta nada. Ele espera você dizer.',
      'Você conta do açúcar, do avô e da campainha.',
      fala('Hank', 'A campainha.', null, 'Ele repete baixo, como quem guarda um endereço.'),
      fala('Hank', 'Toma. E grava o meu número. Se ela perguntar de você, eu quero saber o que dizer.')
    ],
    premio:{dinheiro:1500, itens:{'Hyper Potion':2}, rep:'Levou um doce da Rota 16 até uma avó de Fuchsia'}
  },
  contato:{rotulo:'Perguntar da avó', falas:[
    'Eu toquei a campainha. Ela abriu. Ela disse que eu engordei.',
    'Domingo é almoço na casa dela. Eu vou de ônibus. A moto fica na esquina, escondida.',
    'Ela me ensinou a fazer com menos açúcar. Ficou pior. Eu não contei.'
  ]}
},

/* ─── Fuchsia: o Slowpoke do Gustav ────────────────────── */
{
  id:'slowpoke_do_gustav', cidade:'fuchsia', quem:'Gustav', arq:'gustav', quadro:[33, 8, 22], tipo:'resgate', desde:13,
  titulo:'O Slowpoke do Gustav',
  oferta:{titulo:'O velho guia da cerca', sub:'Um senhor de mochila enorme e cajado olha um mapa da Rota 13 de cabeça pra baixo.'},
  pedido:[
    'Encostado na cerca da Zona Safári, um senhor de mochila maior que as costas dele e cajado de madeira olha um mapa da Rota 13 de cabeça pra baixo.',
    fala('Gustav', 'Trinta anos de guia na Zona. Eu nunca perdi um turista. Perdi o meu Slowpoke.'),
    fala('Gustav', 'Ele sai pra pescar com o rabo no mar e dorme no meio. Dessa vez ele dormiu no labirinto de cerca da Rota 13, e a maré subiu em volta.'),
    fala('Gustav', 'Eu sei onde ele está. O meu fôlego é que não chega lá.', null, 'Ele bate no peito com o punho fechado.')
  ],
  aceitar:'"Eu busco o Slowpoke."', recusar:'"Hoje não dá."',
  recusou:[fala('Gustav', 'Ele não tem pressa. Ele nunca teve.', 'riso')],
  lembrete:'O Gustav, velho guia da Zona Safári, perdeu o Slowpoke dele no labirinto de cerca da Rota 13, com a maré subindo.',
  passo:{
    onde:'rota13', titulo:'Achar o Slowpoke do Gustav', sub:'Uma cauda rosa boiando, no meio do labirinto de cerca.',
    texto:['O labirinto de cerca da Rota 13 tem água pela canela, e mais em cada volta. Lá no meio, uma cauda rosa boia parada.'],
    escolhas:[
      {texto:'Ir pela cerca, de volta em volta, até ele.', teste:{status:'resistencia', dificuldade:7, nome:'Resistência'},
       bom:{achou:true, resultado:['Na sexta volta a água chega na cintura. Na sétima, você chega nele. Ele está dormindo.']},
       ruim:{resultado:['A água sobe rápido demais. Você volta pela mesma cerca antes que ela suba mais.']}},
      {texto:'Pular a cerca e cortar caminho.', teste:{status:'forca', dificuldade:8, nome:'Força', eixo:'coragem'},
       bom:{achou:true, resultado:['Três cercas e um tombo depois, você cai sentad{o|a} na água do lado dele. Ele não acorda.']},
       ruim:{resultado:['A cerca é mais alta do que parecia, e do outro lado tem mais cerca.']}},
      {texto:d => `Ir pela água ${Campo.surfar().como}.`, cond:d => Campo.surfar().pode,
       achou:true, resultado:d => [`${nomeExib(Campo.surfar().quem)} passa por cima da cerca baixa e para do lado da cauda rosa.`]}
    ],
    luta:{dex:70, intro:['Ele não está só dormindo: um Weepinbell enrolou o cipó na cauda dele e puxa pro lado do mato.'],
      venceu:['O Weepinbell solta. O Slowpoke acorda, boceja e te segue pela água sem a menor pressa.'],
      perdeu:['O Weepinbell arrasta o Slowpoke mais pro fundo do mato. Ele nem acordou.']}
  },
  volta:{
    titulo:'Levar o Slowpoke pro Gustav', falta:'O Gustav continua com o mapa de cabeça pra baixo.',
    falas:[
      'O Gustav vê a cauda rosa primeiro, por cima da cerca.',
      fala('Gustav', 'Trinta anos de guia, e quem eu precisei guiar foi esse aí.', 'riso'),
      'O Slowpoke encosta a cabeça na mochila dele e dorme de novo, em pé.',
      fala('Gustav', 'Leva isso, e grava o meu número. Se um dia você quiser um atalho da Zona, eu sei todos.')
    ],
    premio:{dinheiro:1500, itens:{'Ultra Ball':2}, rep:'Achou o Slowpoke de um velho guia de Fuchsia'}
  },
  contato:{rotulo:'Perguntar do Slowpoke', falas:[
    'Ele dormiu na cerca de novo. Dessa vez do lado de dentro. Eu chamo isso de progresso.',
    'Ele pescou um Magikarp ontem. Soltou. Acho que ele só gosta de pescar.',
    'Ele senta na porta de casa toda tarde, olhando pro lado da Rota 13. Acho que é saudade. Ou sono.'
  ]}
},

/* ─── Fuchsia: o Capitão do Lyle ───────────────────────── */
{
  id:'capitao_do_lyle', cidade:'fuchsia', quem:'Lyle', arq:'lyle', quadro:[35, 6, 25], tipo:'resgate', desde:13,
  titulo:"O Farfetch'd do Lyle",
  oferta:{titulo:'O rapaz da gaiola aberta', sub:'De cabelo cinza espetado e colete vermelho, ele segura uma gaiola de porta aberta, com um ninho de palha dentro.'},
  pedido:[
    'Na saída de Fuchsia pro leste, um rapaz de cabelo cinza espetado e colete vermelho segura uma gaiola de porta aberta. Dentro, só um ninho de palha.',
    fala('Lyle', 'O Capitão dorme aí. De porta aberta. Ele nunca quis sair.'),
    fala('Lyle', "Ontem um Farfetch'd selvagem passou cantando, e ele foi atrás. Pro lado da Rota 14."),
    fala('Lyle', 'O talo dele tem a ponta mordida. Foi ele mesmo que mordeu, quando era filhote. É assim que eu sei qual é ele.')
  ],
  aceitar:'"Eu trago o Capitão."', recusar:'"Hoje não dá."',
  recusou:[fala('Lyle', 'Tá. A porta continua aberta, caso ele volte sozinho.')],
  lembrete:"O Lyle, de Fuchsia, perdeu o Capitão, um Farfetch'd que foi atrás de outro pro lado da Rota 14. O talo dele tem a ponta mordida.",
  passo:{
    onde:'rota13', titulo:"Achar o Capitão, o Farfetch'd do Lyle", sub:'Um Farfetch\'d com o talo mordido na ponta.',
    texto:["No capim da Rota 14 tem mais de um Farfetch'd, cada um com o seu talo. Só um tem a ponta mordida."],
    escolhas:[
      {texto:'Olhar a ponta do talo de cada um.', teste:{status:'percepcao', dificuldade:7, nome:'Percepção', eixo:'paciencia'},
       bom:{achou:true, resultado:["O quarto Farfetch'd que passa tem o talo mordido na ponta, e anda meio de lado, como quem não é daqui."]},
       ruim:{resultado:["Todos os talos que você vê estão inteiros, e todos os Farfetch'd te olham como quem quer saber por quê."]}},
      {texto:'Assobiar do jeito que o Lyle assobia pra gaiola.', teste:{status:'carisma', dificuldade:6, nome:'Carisma'},
       bom:{achou:true, resultado:["Do capim alto, um Farfetch'd levanta a cabeça e vem andando na sua direção, com o talo mordido em pé, como uma bandeira."]},
       ruim:{resultado:["O assobio só faz os Farfetch'd da rota irem pra mais longe."]}},
      {texto:'Deixar um pouco de Ração no chão e esperar quieto.', cond:d => Estado.contaItem('Ração') > 0, gasta:{'Ração':1}, tempo:2,
       achou:true, resultado:['Você espera sentad{o|a} na beira da estrada. O último a chegar perto da Ração tem o talo mordido na ponta.']}
    ],
    luta:{dex:48, intro:['Mas um Venonat está agarrado no talo dele, puxando pro outro lado, e o Capitão não larga.'],
      venceu:['O Venonat solta e some no capim. O Capitão ajeita o talo debaixo da asa e te segue.'],
      perdeu:['O Venonat arranca o talo da asa dele, e o Capitão sai correndo atrás, pro meio do capim.']}
  },
  volta:{
    titulo:'Levar o Capitão de volta pro Lyle', falta:'O Lyle continua na saída da cidade, com a gaiola aberta.',
    falas:[
      'O Capitão entra na gaiola antes de você chegar perto e se ajeita no ninho de palha como se nunca tivesse saído.',
      fala('Lyle', 'A porta continua aberta. Ele continua escolhendo ficar.'),
      fala('Lyle', 'Leva isso. Eu comprei pra quando ele fugisse de vez. Ele não vai fugir de vez.', null, 'Ele te passa duas Ultra Ball e um maço de dinheiro dobrado.')
    ],
    premio:{dinheiro:1500, itens:{'Ultra Ball':2}, rep:"Achou o Farfetch'd de um rapaz de Fuchsia na Rota 14"}
  }
},

/* ─── Cinnabar: o livro do Linus ───────────────────────── */
{
  id:'livro_do_linus', cidade:'cinnabar', quem:'Linus', arq:'linus', quadro:[28, 19, 25], tipo:'mostrar', desde:15,
  mostra:{fossil:true},
  titulo:'O livro do Linus',
  oferta:{titulo:'O menino do livro grosso', sub:'Ele lê um livro de fósseis na escada do laboratório, com o dedo em cima de um desenho.'},
  pedido:[
    'Na escada do laboratório, um menino de óculos e cabelo verde lê um livro de capa dura do tamanho do colo dele.',
    fala('Linus', 'Omanyte. Kabuto. Aerodactyl.', null, 'Ele aponta cada desenho sem tirar o olho do livro.'),
    fala('Linus', 'O laboratório traz eles de volta do fóssil. Eu moro aqui do lado e nunca vi um. Só o desenho.'),
    fala('Linus', 'Se você tiver um, você mostra pra mim? Eu quero ver se o desenho está certo.')
  ],
  aceitar:'"Se eu tiver um, eu mostro."', recusar:'"Isso não é comigo."',
  recusou:[fala('Linus', 'Tudo bem. O desenho espera. Desenho é bom nisso.')],
  lembrete:'O Linus, menino de Cinnabar, quer ver de perto um Pokémon que voltou de um fóssil, pra conferir o desenho do livro dele.',
  volta:{
    titulo:d => { const p = Tarefas.quem('livro_do_linus'); return p ? `Mostrar ${nomeExib(p)} pro Linus` : 'Mostrar um Pokémon de fóssil pro Linus'; },
    falta:'O Linus quer ver de perto um Pokémon que voltou de um fóssil.',
    falas:d => {
      const p = Tarefas.quem('livro_do_linus');
      if (!p) return [];
      return [
        `O Linus fecha o livro com o dedo dentro, pra não perder a página, e anda em volta de ${nomeExib(p)} três vezes.`,
        fala('Linus', 'O desenho está errado.', null, 'Ele parece contente com isso.'),
        fala('Linus', 'É maior. E a cor está errada. E ninguém desenhou o jeito que ele olha.'),
        fala('Linus', 'Eu vou escrever pra editora. Você assina como testemunha?')
      ];
    },
    premio:{itens:{'PP Up':1}, rep:'Mostrou um Pokémon de fóssil a um menino de Cinnabar'}
  }
},

/* ─── Ilha Dois: as compotas da Hattie ─────────────────── */
{
  id:'compotas_da_hattie', cidade:'ilha_dois', quem:'Hattie', f:true, arq:'hattie', quadro:[24, 10, 24], tipo:'coleta', fase:3,
  titulo:'As compotas da Hattie',
  oferta:{titulo:'A senhora das compotas', sub:'Na porta da casa amarela, ela arruma potes vazios numa prateleira, com dois Marill dormindo no colo.'},
  pedido:[
    'Na porta da casa amarela da vila, uma senhora de vestido vermelho arruma potes vazios numa prateleira. Dois Marill dormem no colo dela.',
    fala('Hattie', 'A feira do cabo é no sábado, e eu não tenho fruta pra compota.'),
    fala('Hattie', 'A fruta-do-mato dá na Floresta das Frutas, na Ilha Três. O barqueiro não me leva mais: diz que eu trago fruta demais e afundo o barco.', 'riso'),
    fala('Hattie', 'Três cachos. Os vermelhos, não os roxos. Os roxos são dos Heracross.')
  ],
  aceitar:'"Eu trago três cachos."', recusar:'"Não vou pra Ilha Três agora."',
  recusou:[fala('Hattie', 'Então o sábado vai ser de compota de nada. Vende pouco.', 'riso')],
  lembrete:'A Hattie, das compotas da Ilha Dois, quer três cachos de fruta-do-mato vermelha da Floresta das Frutas, na Ilha Três. Os roxos, ela disse, são dos Heracross.',
  passo:{
    onde:'floresta_frutas', titulo:'Colher fruta-do-mato pra Hattie', sub:'Os cachos vermelhos. Os roxos são dos Heracross.',
    item:'Fruta-do-mato', meta:3,
    texto:['A Floresta das Frutas tem fruta em toda altura, e Pokémon comendo em quase todas.'],
    escolhas:[
      {texto:'Procurar os cachos vermelhos nos galhos baixos.', teste:{status:'percepcao', dificuldade:6, nome:'Percepção', eixo:'paciencia'},
       bom:{ganha:1, resultado:['Num galho baixo, escondido atrás de dois cachos roxos, um vermelho. Você colhe sem balançar o galho.']},
       ruim:{resultado:['Você só acha cacho roxo, e cada um tem alguém comendo.']}},
      {texto:'Subir na árvore grande, a mais carregada.', teste:{status:'forca', dificuldade:7, nome:'Força'},
       bom:{ganha:2, resultado:['Lá em cima tem dois cachos vermelhos inteiros, e ninguém comendo. Você desce com um em cada mão.']},
       ruim:{resultado:['O galho estala. Você desce antes dele.']}},
      {texto:'Mexer nos cachos roxos mesmo.',
       luta:{dex:214, ganha:1, intro:['Você nem toca no primeiro cacho: um Heracross desce do tronco de chifre baixo.'],
         venceu:['O Heracross se afasta. Atrás do cacho roxo dele, escondido, tinha um vermelho.'],
         perdeu:['O Heracross te tira da árvore com o chifre, sem pressa e sem raiva. O cacho é dele.']}}
    ]
  },
  volta:{
    titulo:'Levar as frutas pra Hattie', falta:'A Hattie continua arrumando potes vazios.',
    falas:[
      'A Hattie pesa os cachos na mão, um por um, como quem pesa ouro.',
      fala('Hattie', 'Vermelho, vermelho, vermelho. Você escuta.', 'riso'),
      'Antes de você ir embora, a casa inteira já cheira a fruta quente, e os Marill acordam.',
      fala('Hattie', 'O primeiro pote é seu. E grava o meu número: quando sair a próxima fornada, eu te aviso.')
    ],
    premio:{dinheiro:3000, itens:{'Pote de compota':1, 'Hyper Potion':3}, rep:'Colheu fruta pras compotas da Ilha Dois'}
  },
  contato:{rotulo:'Perguntar das compotas', falas:[
    'Vendi tudo no sábado. Tudo! Até o pote rachado.',
    'Os Marill comeram metade da fornada nova. Eu deixei. Eles trabalharam: ficaram olhando.',
    'Guardei um pote com o seu nome na tampa. Não precisa vir buscar. Ele espera.'
  ]}
},

/* ─── Ilha Quatro: o Swinub do Sven ────────────────────── */
{
  id:'swinub_do_sven', cidade:'ilha_quatro', quem:'Sven', arq:'sven', quadro:[27, 18, 25], tipo:'resgate', fase:4,
  titulo:'O Swinub do Sven',
  oferta:{titulo:'O pescador do gelo da beira do cais', sub:'Ele tem um buraco no gelo, uma vara e nenhuma vontade de pescar.'},
  pedido:[
    'Na beira do cais, um pescador de macacão azul acolchoado e óculos de neve está sentado do lado de um buraco no gelo, com a vara no chão.',
    fala('Sven', 'O meu Swinub fareja Magikarp debaixo do gelo. É o melhor pescador da ilha, e não sou eu.'),
    fala('Sven', 'Ontem ele farejou alguma coisa dentro da Gruta Gelada e entrou correndo. Não saiu.'),
    fala('Sven', 'Lá dentro tem Sneasel. Sneasel não gosta de Swinub. Ninguém sabe por quê.', 'baixo')
  ],
  aceitar:'"Eu vou buscar."', recusar:'"Agora não posso."',
  recusou:[fala('Sven', 'Tá. Eu fico aqui. Alguém tem que olhar o buraco.')],
  lembrete:'O Sven, pescador do gelo da Ilha Quatro, perdeu o Swinub dele dentro da Gruta Gelada, onde tem Sneasel.',
  passo:{
    onde:'gruta_gelada', titulo:'Procurar o Swinub do Sven', sub:'Em algum lugar da gruta, alguma coisa funga.',
    texto:['A Gruta Gelada é azul por dentro, e cada som volta três vezes. Em algum lugar, alguma coisa funga.'],
    escolhas:[
      {texto:'Seguir o fungado.', teste:{status:'percepcao', dificuldade:7, nome:'Percepção', eixo:'paciencia'},
       bom:{achou:true, resultado:['O fungado para quando você para e volta quando você anda. Na quarta curva, ele está lá.']},
       ruim:{resultado:['O eco te leva pra três lugares diferentes. Em nenhum tem Swinub.']}},
      {texto:d => `Iluminar o fundo da gruta ${Campo.iluminar().como || 'com luz'}.`, cond:d => Campo.iluminar().pode,
       desgaste:d => Campo.iluminar().semPilha ? null : 'Lanterna',
       teste:{status:'percepcao', dificuldade:5, nome:'Percepção'},
       bom:{achou:true, resultado:['A luz bate no gelo e volta azul pra todo lado. Num canto, dois olhinhos piscam.']},
       ruim:{resultado:['O gelo devolve a luz pra todo lado, e você não acha o fundo de nada.']}},
      {texto:'Deixar um pouco de Ração no chão e esperar quieto.', cond:d => Estado.contaItem('Ração') > 0, gasta:{'Ração':1}, tempo:2,
       achou:true, resultado:['Você espera encostad{o|a} na parede fria. O fungado chega primeiro, e o Swinub chega atrás dele.']}
    ],
    luta:{dex:215, intro:['O Swinub está encolhido num canto, e um Sneasel está entre vocês dois, de garra de fora.'],
      venceu:['O Sneasel some pelo teto. O Swinub sai do canto e encosta o focinho na sua bota.'],
      perdeu:['O Sneasel te obriga a recuar até a boca da gruta. O Swinub continua lá dentro.']}
  },
  volta:{
    titulo:'Levar o Swinub pro Sven', falta:'O Sven continua olhando o buraco no gelo.',
    falas:[
      'O Sven levanta tão rápido que derruba a vara no buraco do gelo.',
      fala('Sven', 'Ah, seu… vem cá.', null, 'O Swinub já está no colo dele antes de ele terminar a frase.'),
      fala('Sven', 'Pega a minha vara. Mentira, a vara foi pro fundo.', 'riso'),
      fala('Sven', 'Toma isso, e grava o meu número. Quando o gelo abrir de novo, eu te ligo.')
    ],
    premio:{dinheiro:4000, itens:{'Max Potion':2}, rep:'Tirou o Swinub de um pescador da Gruta Gelada'}
  },
  contato:{rotulo:'Perguntar do Swinub', falas:[
    'Ele farejou um cardume de Magikarp ontem, debaixo do gelo grosso. A ilha jantou por causa dele.',
    'Ele não chega mais perto da gruta. Eu também não. Nós dois combinamos.',
    'Ele dorme em cima do meu pé de noite. Esquenta o pé. Esfria o resto.'
  ]}
}
];

/* as espécies que voltam de fóssil no laboratório de Cinnabar */
const DEX_DE_FOSSIL = [138, 139, 140, 141, 142];

/* rosto e nome: cada um com o desenho dele, e o nome na lista da
   história (o sorteio não dá "Lia" pra uma desconhecida) */
TAREFAS.forEach(t => {
  if (typeof NOMES_DA_HISTORIA !== 'undefined') NOMES_DA_HISTORIA.add(t.quem);
  if (typeof RETRATO_POR_NOME !== 'undefined' && !RETRATO_POR_NOME[t.quem]) RETRATO_POR_NOME[t.quem] = 'trainers/' + t.arq;
});

const Tarefas = {
  porId(id){ return TAREFAS.find(t => t.id === id) || null; },
  reg(d){ d = d || Estado.dados; return (d.tarefas = d.tarefas || {}); },
  de(id, d){ return this.reg(d)[id] || null; },
  feita(id, d){ const r = this.de(id, d); return !!(r && r.estado === 'feita'); },
  aberta(id, d){ const r = this.de(id, d); return !!(r && r.estado === 'aberta'); },

  /* aparece pra quem chegou nela: a posição na jornada (ou a fase das
     ilhas) e a cidade pisada; quem recusou ouve de novo outro dia */
  disponivel(t, d){
    d = d || Estado.dados;
    if (!d || !t) return false;
    const r = this.de(t.id, d);
    if (r && r.estado) return false;
    if (r && r.recusou === d.relogio.dia) return false;
    if (t.fase != null){
      if (typeof Sevii === 'undefined' || !Sevii.aberto(d) || Sevii.fase(d) < t.fase) return false;
    } else if (typeof capNaJornada === 'function' && capNaJornada(d) < t.desde && !d.depoisDoFim) return false;
    if (typeof Mundo !== 'undefined' && Mundo.visitado && !Mundo.visitado(t.cidade)) return false;
    try { return !t.cond || t.cond(d); } catch(e){ return false; }
  },

  /* já topou com a pessoa: dali em diante ela fica na tela do lugar
     (recusar vale só pra hoje, e ela continua conhecida) */
  conheceu(t, d){
    const r = this.de(t.id, d || Estado.dados);
    return !!(r && (r.conheceu != null || r.estado || r.recusou != null));
  },

  /* topar com quem pede, no meio de uma ação do mapa (exploracao.js):
     na chance da ação, alguém daqui que você ainda não conhece, se a
     jornada já chegou nele. Uma pessoa por lugar por dia, e de
     madrugada ninguém está na rua. Devolve true se a conversa abriu,
     e a ação para ali */
  talvezTopar(acao){
    const d = Estado.dados, ch = CHANCE_DE_TOPAR[acao];
    if (!ch || !d || !d.relogio || d.modo === 'cena') return false;
    if (typeof sincronizarHora === 'function') sincronizarHora(d.relogio);
    if (d.relogio.hora < 6) return false;
    const aqui = Mundo.id();
    const topou = d.tarefasTopou || (d.tarefasTopou = {});
    if (topou[aqui] === d.relogio.dia) return false;
    const quem = TAREFAS.filter(t => t.cidade === aqui && !this.conheceu(t, d) && this.disponivel(t, d));
    if (!quem.length || !Dados.chance(ch)) return false;
    const t = Dados.escolher(quem);
    topou[aqui] = d.relogio.dia;
    this.reg(d)[t.id] = Object.assign(this.de(t.id, d) || {}, {conheceu:d.relogio.dia});
    Estado.salvar('auto');
    this.oferecer(t.id);
    return true;
  },

  /* ---------- o andamento ---------- */
  passoFeito(t, d){
    d = d || Estado.dados;
    const r = this.de(t.id, d) || {};
    if (!t.passo) return true;
    if (t.tipo === 'coleta') return Estado.contaItem(t.passo.item) >= t.passo.meta;
    if (t.tipo === 'entrega') return !!r.entregou;
    return !!r.resgatou;
  },
  pronta(t, d){
    d = d || Estado.dados;
    if (!this.aberta(t.id, d) || !this.passoFeito(t, d)) return false;
    if (t.mostra && !this.quem(t.id)) return false;
    try { return !t.volta.requer || t.volta.requer(d); } catch(e){ return false; }
  },
  /* quanto falta, pras Missões e pra tela do passo ("2 de 3") */
  progresso(t, d){
    if (t.tipo !== 'coleta' || !t.passo) return null;
    return {tem:Math.min(t.passo.meta, Estado.contaItem(t.passo.item)), meta:t.passo.meta, item:t.passo.item};
  },
  /* o Pokémon do seu cinto, de pé, que a pessoa do mostrar quer ver */
  quem(id){
    const t = this.porId(id), m = t && t.mostra;
    if (!m || !Estado.dados) return null;
    return (Estado.dados.time || []).find(p => p && !p.morto && p.hp > 0 && this.serve(p, m)) || null;
  },
  serve(p, m){
    const e = DEX[p.dex] || {};
    if (m.tipo) return (e.tipos || []).includes(m.tipo);
    if (m.fossil) return DEX_DE_FOSSIL.includes(Number(p.dex));
    if (m.evoluido) return (e.preEvo || 0) > 0;
    /* o Mewtwo que ainda decide não mostra a moral (mewtwo.js), e o menino não vê o que não aparece */
    if (m.contente) return (p.moral || 0) >= MORAL_DE_QUEM_GOSTA && !(typeof Mewtwo !== 'undefined' && Mewtwo.escondeMoral(p));
    return false;
  },

  /* ---------- na tela do lugar ----------
     Cada uma vira uma linha da seção Tarefas: quem pede (marca !), o
     passo onde ele se faz, quem espera (apagada, com o que falta) e a
     volta (marca ✓). O rosto é o de quem pediu, inclusive no passo. */
  afazeres(localId){
    const d = Estado.dados, out = [];
    if (!d) return out;
    for (const t of TAREFAS){
      const rosto = typeof retratoDe === 'function' ? retratoDe(t.quem) : null;
      if (t.cidade === localId){
        /* quem você ainda não topou não está na tela: só aparece no sorteio */
        if (this.disponivel(t, d)){ if (this.conheceu(t, d)) out.push({id:'tf_' + t.id, titulo:t.oferta.titulo, sub:t.oferta.sub, tarefa:'nova', rosto, quadro:t.quadro}); }
        else if (this.pronta(t, d)) out.push({id:'tf_' + t.id + '__volta', titulo:txt(t.volta.titulo), tarefa:'pronta', rosto, quadro:t.quadro});
        /* quem espera fica na tela, apagado, com o que ainda falta */
        else if (this.aberta(t.id, d)) out.push({id:'tf_' + t.id + '__volta', titulo:t.titulo, tarefa:'espera', rosto, quadro:t.quadro, fechada:t.volta.falta});
      }
      if (t.passo && t.passo.onde === localId && this.aberta(t.id, d) && !this.passoFeito(t, d)){
        const p = this.progresso(t, d);
        out.push({id:'tf_' + t.id + '__passo', titulo:t.passo.titulo, sub:p ? `${t.passo.sub} · ${p.tem} de ${p.meta}` : t.passo.sub,
          tarefa:'passo', rosto, quadro:t.quadro, fechada: t.tipo === 'entrega' && !Estado.contaItem(t.entrega) ? `Sem ${t.entrega.toLowerCase()} na mochila.` : null});
      }
    }
    return out;
  },
  fazer(x){
    const [id, qual] = String(x).split('__');
    const t = this.porId(id);
    if (!t) return Exploracao.tela();
    if (qual === 'passo') return this.passo(id);
    if (qual === 'volta') return this.entregar(id);
    return this.oferecer(id);
  },

  /* ---------- o pedido ---------- */
  oferecer(id){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !this.disponivel(t, d)) return Exploracao.tela();
    const L = LOCAIS[t.cidade] || {};
    UI.telaConversa({num:L.nome || '', titulo:t.oferta.titulo, loc:'Tarefa · ' + t.titulo,
      falas:t.pedido, quem:t.quem,
      botoes:[{texto:t.aceitar, classe:'diz', acao:`Tarefas.aceitar('${t.id}')`},
              {texto:t.recusar, classe:'fim', acao:`Tarefas.recusar('${t.id}')`}]});
  },
  aceitar(id){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !this.disponivel(t, d)) return Exploracao.tela();
    this.reg(d)[id] = {estado:'aberta', desde:d.relogio.dia};
    const avisos = [{tipo:'tarefa', texto:`Nova tarefa: ${t.titulo}.`}];
    if (t.entrega){ Estado.darItem(t.entrega, 1); avisos.push({tipo:'item', texto:`Recebeu 1× ${t.entrega}.`}); }
    Estado.registrar(`Aceitou um pedido de ${t.quem}, ${emLocal(t.cidade)}. ${t.lembrete}`);
    Estado.salvar('auto');
    Exploracao.tela(avisos);
  },
  recusar(id){
    const t = this.porId(id), d = Estado.dados;
    if (!t) return Exploracao.tela();
    this.reg(d)[id] = {recusou:d.relogio.dia, conheceu:(this.de(id, d) || {}).conheceu != null ? this.de(id, d).conheceu : d.relogio.dia};
    Estado.salvar('auto');
    const L = LOCAIS[t.cidade] || {};
    UI.telaConversa({num:L.nome || '', titulo:t.oferta.titulo, loc:'Tarefa · ' + t.titulo, falas:t.recusou || [], quem:t.quem,
      botoes:[{texto:'Seguir.', classe:'fim', acao:'Exploracao.tela()'}]});
  },

  /* ---------- o passo, fora da cidade ---------- */
  escolhasDe(t){
    const d = Estado.dados;
    return (t.passo.escolhas || []).map((e, i) => ({e, i})).filter(({e}) => { try { return !e.cond || e.cond(d); } catch(err){ return false; } });
  },
  passo(id, avisos){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !t.passo || !this.aberta(id, d) || this.passoFeito(t, d) || Mundo.id() !== t.passo.onde) return Exploracao.tela(avisos);
    const r = this.de(id, d), L = LOCAIS[t.passo.onde] || {};
    /* achou o Pokémon perdido e alguém está em volta dele: a luta é o que falta */
    if (t.tipo === 'resgate' && r.achou && t.passo.luta)
      return UI.telaConversa({num:L.nome || '', titulo:t.passo.titulo, loc:'Tarefa de ' + t.quem, falas:t.passo.luta.intro, avisos,
        botoes:[{texto:'Encarar.', classe:'luta', icone:'lutar', acao:`Tarefas.lutar('${id}')`},
                {texto:'Deixar pra depois.', classe:'fim', acao:'Exploracao.tela()'}]});
    const p = this.progresso(t, d);
    const botoes = this.escolhasDe(t).map(({e, i}) => ({texto:txt(e.texto), classe:e.luta ? 'luta' : e.teste ? 'teste' : '',
      icone:e.luta ? 'lutar' : e.teste ? 'dado' : null, acao:`Tarefas.escolher('${id}',${i})`}));
    botoes.push({texto:'Deixar pra depois.', classe:'fim', acao:'Exploracao.tela()'});
    UI.telaConversa({num:L.nome || '', titulo:t.passo.titulo, loc:'Tarefa de ' + t.quem,
      falas:txt(t.passo.texto) || [], extra:p ? this.htmlProgresso(t, p) : '', avisos, botoes});
  },
  htmlProgresso(t, p){
    const icone = typeof imgItem === 'function' ? imgItem(p.item) : '';
    return `<div class="tf-progresso" style="--tf-feito:${Math.round(p.tem / p.meta * 100)}%">${icone}<span class="tf-prog-nome">${UI.esc(p.item)}</span>
      <span class="tf-prog-barra" aria-hidden="true"><i></i></span><span class="tf-prog-n">${p.tem} de ${p.meta}</span></div>`;
  },
  escolher(id, i){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !t.passo || !this.aberta(id, d) || this.passoFeito(t, d)) return Exploracao.tela();
    const e = (t.passo.escolhas || [])[i];
    if (!e) return this.passo(id);
    try { if (e.cond && !e.cond(d)) return this.passo(id); } catch(err){ return this.passo(id); }
    const r = this.de(id, d), L = LOCAIS[t.passo.onde] || {};
    /* esperar: o relógio vai até a hora, e o lugar muda com ela */
    if (e.espera != null){
      Relogio.ate(e.espera);
      Estado.salvar('auto');
      return UI.telaConversa({num:L.nome || '', titulo:t.passo.titulo, loc:'Tarefa de ' + t.quem, falas:txt(e.resultado) || [],
        botoes:[{texto:'Voltar à procura.', acao:`Tarefas.passo('${id}')`}]});
    }
    /* luta antes de qualquer coisa: a moita do Beedrill, o cacho do Heracross */
    if (e.luta) return this.lutar(id, i);
    const avisos = [];
    if (e.tempo !== 0) Mundo.passar(e.tempo || 1);
    for (const [nome, q] of Object.entries(e.gasta || {})){
      for (let k = 0; k < q; k++) Estado.usarItem(nome);
      avisos.push({tipo:'item', texto:`Usou ${q}× ${nome}.`});
    }
    if (e.desgaste) avisos.push(...(Historia.aplicar({desgaste:e.desgaste}) || []));
    let rol = null, ramo = e, critico = false;
    if (e.teste){
      const valor = Estado.j.status[e.teste.status] || 0;
      rol = e.teste.eixo ? Dados.testeComTime(valor, e.teste.dificuldade, e.teste.nome || e.teste.status, e.teste.eixo)
                         : Dados.teste(valor, e.teste.dificuldade, e.teste.nome || e.teste.status);
      const passou = rol.grau === 'sucesso' || rol.grau === 'critico';
      critico = rol.grau === 'critico';
      ramo = (passou ? e.bom : e.ruim) || {};
      if (rol.afinidade && rol.afinidade.linha) avisos.push({tipo:'natureza', texto:rol.afinidade.linha});
      if (rol.linhaTime) avisos.push({tipo:'natureza', texto:rol.linhaTime});
    }
    if (ramo.achou) r.achou = true;
    if (ramo.ganha){
      const n = ramo.ganha + (critico ? 1 : 0);
      Estado.darItem(t.passo.item, n);
      avisos.push({tipo:'item', texto:`Recebeu ${n}× ${t.passo.item}.`});
    }
    if (e.entrega){
      Estado.usarItem(t.entrega);
      r.entregou = true;
      avisos.push({tipo:'item', texto:`Entregou 1× ${t.entrega}.`});
      Estado.registrar(`Entregou ${t.entrega.toLowerCase()} de ${t.quem} em ${L.nome}.`);
    }
    /* achou e ninguém em volta: resgatado; com alguém em volta, a luta */
    if (t.tipo === 'resgate' && r.achou && !t.passo.luta) r.resgatou = true;
    Estado.salvar('auto');
    if (typeof Exploracao !== 'undefined' && Exploracao.toque) Exploracao.toque();
    const feito = this.passoFeito(t, d);
    const linhaRol = rol ? `<div class="teste-linha"><span class="k">${UI.esc(rol.nomeStatus || e.teste.nome || 'teste')}</span>
      <span class="v mono">${UI.esc(Dados.contaDoTeste(rol))}</span><span class="grau ${UI.esc(rol.grau)}">${UI.esc(rol.texto)}</span></div>` : '';
    const p = this.progresso(t, d);
    const botoes = [];
    if (t.tipo === 'resgate' && r.achou && t.passo.luta && !r.resgatou) botoes.push({texto:'Ir até ele.', classe:'luta', icone:'lutar', acao:`Tarefas.passo('${id}')`});
    else if (!feito) botoes.push({texto:'Continuar procurando.', acao:`Tarefas.passo('${id}')`});
    botoes.push({texto:feito ? `Voltar pra ${t.quem}.` : 'Deixar pra depois.', classe:'fim', acao:'Exploracao.tela()'});
    if (feito) avisos.push({tipo:'tarefa', texto:`Pronto: ${t.volta.falta ? 'é só voltar pra ' + t.quem : t.titulo}.`});
    UI.telaConversa({num:L.nome || '', titulo:t.passo.titulo, loc:'Tarefa de ' + t.quem,
      falas:txt(ramo.resultado || e.resultado) || [], extra:linhaRol + (p ? this.htmlProgresso(t, p) : ''), avisos, botoes});
  },

  /* ---------- a luta do passo ----------
     Selvagem, no nível do lugar, que entra pela porta de sempre
     (Exploracao.encontro) e volta pra cá pelo Jogo.depoisDaEstrada.
     Recarregar no meio da luta perde a volta, e só isso: o passo
     continua na lista do lugar. */
  lutar(id, i){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !t.passo) return Exploracao.tela();
    const e = i != null ? t.passo.escolhas[i] : null;
    const def = e ? e.luta : t.passo.luta;
    if (!def) return this.passo(id);
    if (!Estado.primeiroApto()) return this.passo(id, [{tipo:'dano', texto:'Ninguém do time está em pé pra encarar.'}]);
    const L = LOCAIS[t.passo.onde] || {};
    const nivel = Math.max(3, (L.nivel || 5) + 1);
    const selvagem = criarPokemon(def.dex, nivel);
    const r = this.de(id, d);
    r.luta = {uid:selvagem.uid, escolha:i != null ? i : null};
    Estado.salvar('auto');
    Jogo.depoisDaEstrada = avisos => Tarefas.depoisDaLuta(id, avisos);
    Exploracao.encontro(selvagem, def.intro, {fixo:true});
  },
  depoisDaLuta(id, avisos){
    const t = this.porId(id), d = Estado.dados;
    const r = t && this.de(id, d);
    if (!t || !r || !r.luta) return Exploracao.tela(avisos);
    const lut = r.luta;
    delete r.luta;
    const def = lut.escolha != null ? t.passo.escolhas[lut.escolha].luta : t.passo.luta;
    const fim = Batalha.fim || {};
    const foiEssa = Batalha.inimigo && Batalha.inimigo.uid === lut.uid;
    const venceu = foiEssa && ['vitoria', 'captura', 'encarou'].includes(fim.resultado);
    const out = (avisos || []).slice();
    if (venceu){
      if (def.ganha){ Estado.darItem(t.passo.item, def.ganha); out.push({tipo:'item', texto:`Recebeu ${def.ganha}× ${t.passo.item}.`}); }
      if (t.tipo === 'resgate') r.resgatou = true;
    } else if (t.tipo === 'resgate') r.achou = false;
    Estado.salvar('auto');
    const L = LOCAIS[t.passo.onde] || {};
    const feito = this.passoFeito(t, d);
    if (feito) out.push({tipo:'tarefa', texto:`Pronto: é só voltar pra ${t.quem}.`});
    const p = this.progresso(t, d);
    UI.telaConversa({num:L.nome || '', titulo:t.passo.titulo, loc:'Tarefa de ' + t.quem,
      falas:venceu ? def.venceu : (def.perdeu || []).concat(['Dá pra tentar de novo.']), extra:p ? this.htmlProgresso(t, p) : '', avisos:out,
      botoes:[!feito ? {texto:'Continuar procurando.', acao:`Tarefas.passo('${id}')`} : null,
              {texto:feito ? `Voltar pra ${t.quem}.` : 'Deixar pra depois.', classe:'fim', acao:'Exploracao.tela()'}].filter(Boolean)});
  },

  /* ---------- a volta: o que ela pediu, na mão dela ---------- */
  entregar(id){
    const t = this.porId(id), d = Estado.dados;
    if (!t || !this.pronta(t, d)) return Exploracao.tela();
    const falas = (txt(t.volta.falas) || []).filter(Boolean);
    const pr = t.volta.premio || {}, avisos = [];
    /* a pessoa fica com tudo o que você colheu: a de noite dá duas de uma
       vez, e a que sobrava ficava nos Itens-chave sem servir pra nada */
    if (t.tipo === 'coleta'){
      const n = Estado.contaItem(t.passo.item);
      for (let k = 0; k < n; k++) Estado.usarItem(t.passo.item);
      avisos.push({tipo:'item', texto:`Entregou ${n}× ${t.passo.item}.`});
    }
    /* o Pokémon que você mostrou sai contente */
    if (t.mostra){
      const p = this.quem(t.id);
      if (p){ p.moral = Math.min(100, (p.moral || 50) + MORAL_DO_MOSTRAR); avisos.push({tipo:'info', texto:`${nomeExib(p)} gostou da visita.`}); }
    }
    if (pr.dinheiro){ Estado.j.dinheiro += pr.dinheiro; avisos.push({tipo:'item', texto:`+${pr.dinheiro.toLocaleString('pt-BR')} ₽`}); }
    for (const [nome, q] of Object.entries(pr.itens || {})){ Estado.darItem(nome, q); avisos.push({tipo:'item', texto:`Recebeu ${q}× ${nome}.`}); }
    const atual = (d.npcs[t.quem] || {}).opiniao || 0;
    Estado.lembrarNPC(t.quem, {opiniao:atual + OPINIAO_DA_TAREFA, memoria:`Você cumpriu o que ${t.f ? 'ela' : 'ele'} pediu: ${t.titulo.toLowerCase()}.`});
    if (pr.rep){
      const m = Estado.mudarRep('bom', 1, pr.rep, {});
      if (m && m.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${m.de} → ${m.para}`});
    }
    const r = this.de(id, d);
    r.estado = 'feita'; r.dia = d.relogio.dia;
    Estado.marcar('tarefa_feita_' + id);
    /* quem tem telefone deixa o número */
    if (t.contato && Estado.temPokenav() && Estado.registrarNumero('tarefa_' + id))
      avisos.push({tipo:'nav', texto:`Gravou o número de ${t.quem} no PokéNav.`});
    Estado.registrar(`Cumpriu a tarefa de ${t.quem}: ${t.titulo.toLowerCase()}.`);
    Estado.salvar('auto');
    if (typeof Som !== 'undefined' && Som.efeito) Som.efeito('item');
    const L = LOCAIS[t.cidade] || {};
    UI.telaConversa({num:L.nome || '', titulo:t.titulo, loc:'Tarefa cumprida', falas, quem:t.quem, avisos,
      extra:this.htmlSelo(t), botoes:[{texto:'Seguir.', classe:'fim', acao:'Exploracao.tela()'}]});
  },
  /* a moeda com o rosto de quem pediu, e a marca no canto (! ✓ …) */
  moeda(rosto, marca, classe, quadro){
    const sinal = {nova:'!', pronta:'✓', espera:'…'}[marca] || '';
    /* o quadro da cabeça no desenho de 80 px: [x, y, lado] (o resto fica fora da janela) */
    const q = quadro ? ` style="--q-x:${quadro[0]};--q-y:${quadro[1]};--q-l:${quadro[2]}"` : '';
    return `<span class="tf-moeda${classe ? ' ' + classe : ''}"><span class="tf-janela"${q}>${rosto ? `<img src="${rosto}" alt="">` : ''}</span>${
      sinal ? `<span class="tf-marca" data-marca="${marca}" aria-hidden="true">${sinal}</span>` : ''}</span>`;
  },
  /* o selo de tarefa cumprida: o rosto de quem pediu, carimbado */
  htmlSelo(t){
    const r = typeof retratoDe === 'function' ? retratoDe(t.quem) : null;
    return `<div class="tf-selo">${this.moeda(r, null, null, t.quadro)}
      <span class="tf-selo-t"><small>Tarefa cumprida</small><b>${UI.esc(t.titulo)}</b></span><span class="tf-selo-ok" aria-hidden="true">✓</span></div>`;
  },

  /* tudo o que se fala aqui, pra conferência (chk-baloes) */
  amostras(){
    const out = [];
    for (const t of TAREFAS){
      out.push({onde:`tarefa/${t.id}/pedido`, dono:t.quem, linhas:t.pedido});
      if (t.recusou) out.push({onde:`tarefa/${t.id}/recusou`, dono:t.quem, linhas:t.recusou});
      if (t.passo){
        out.push({onde:`tarefa/${t.id}/passo`, dono:null, linhas:txt(t.passo.texto) || []});
        (t.passo.escolhas || []).forEach((e, i) => {
          for (const [k, ramo] of [['', e], ['bom', e.bom], ['ruim', e.ruim]])
            if (ramo && ramo.resultado) out.push({onde:`tarefa/${t.id}/passo>${i}${k}`, dono:t.passo.onde === 'lavender' ? 'Elowen' : null, linhas:txt(ramo.resultado) || []});
          if (e.luta) for (const k of ['intro', 'venceu', 'perdeu']) out.push({onde:`tarefa/${t.id}/luta${i}/${k}`, dono:null, linhas:e.luta[k] || []});
        });
        if (t.passo.luta) for (const k of ['intro', 'venceu', 'perdeu']) out.push({onde:`tarefa/${t.id}/luta/${k}`, dono:null, linhas:t.passo.luta[k] || []});
      }
      out.push({onde:`tarefa/${t.id}/volta`, dono:t.quem, linhas:(txt(t.volta.falas) || []).filter(Boolean)});
      if (t.contato) out.push({onde:`tarefa/${t.id}/telefone`, dono:t.quem, linhas:t.contato.falas.map(l => fala(t.quem, l))});
    }
    return out;
  }
};

/* ── PokéNav: quem tem telefone deixa o número na volta ──
   Liga como todo mundo da agenda (recados.js: a ligação à toa, o
   recado com presente, o pedido de favor), e você liga pra saber do
   que foi resolvido. */
function contatosDasTarefas(){
  return TAREFAS.filter(t => t.contato).map(t => ({
    id:'tarefa_' + t.id, tipo:'figura', nome:t.quem, papel:'', cidade:(LOCAIS[t.cidade] || {}).nome || '',
    requer:d => Tarefas.feita(t.id, d),
    oferece:['prova'],
    prova:{
      rotulo:t.contato.rotulo, esperaCap:1, limite:99,
      texto:d => [fala(t.quem, Dados.escolher(t.contato.falas))],
      rep:{eixo:'bom', delta:1, motivo:`Ligou pra ${t.quem} pra saber como estão as coisas`}
    }
  }));
}
