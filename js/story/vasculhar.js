/* ============================================================
   VASCULHAR E ACAMPAR — o que o lugar devolve quando você para
   Cada ambiente tem a sua lista, e os lugares que têm cara própria
   (Rota 1, Floresta de Viridian, Monte da Lua, Seafoam…) têm achados
   que só acontecem neles. Nada de cercado de Miltank no meio da
   floresta: o que aparece é do lugar.

   Regras da lista:
   - `so:'dia'` / `so:'noite'` — só acontece nessa hora;
   - `rastro` — números da dex; o achado só vale se pelo menos um
     deles vive aqui (ENCONTROS do lugar), e a Pokédex acende o que
     for daqui;
   - `raro` — só com Sorte crítica;
   - o lugar lembra o que você já achou e prefere o que você ainda
     não viu (d.vasculhados).
   ============================================================ */

const ACHADOS_VASCULHAR = {
  campo:[
    {t:'Debaixo de uma moita, uma Poké Ball fechada e vazia, com o lacre ainda inteiro. Alguém deixou cair correndo.', item:['Poké Ball', 1]},
    {t:'Na beira da trilha, um frasco de Potion pela metade, tampado. Serve.', item:['Potion', 1]},
    {t:'Penas espalhadas num círculo e um tufo de pelo marrom. Teve briga aqui de manhã cedo.', rastro:[16, 19, 21]},
    {t:'Pegadas pequenas e fundas, em linha reta, cortando o capim. Quem passou estava com pressa.', rastro:[19, 29, 32]},
    {t:'Uma pilha de pilhas usadas e uma que ainda funciona, no pé de um poste.', item:['Pilha', 1]},
    {t:'O capim está deitado num redondo perfeito, morno ainda. Alguma coisa dormiu aqui e acabou de sair.'},
    {t:'Um buraco na terra do tamanho de um punho, e outro, e outro, em fila até o barranco. Alguém cava aqui toda noite.', rastro:[27, 50, 19]},
    {t:'Um Pidgey pousa na cerca a dois metros de você, te olha de lado e decide que você não é problema.', rastro:[16, 17], so:'dia'},
    {t:'No meio do capim alto, um saquinho de Ração aberto pela metade, com marca de dente na ponta.', item:['Ração', 1]},
    {t:'Uma placa de madeira caída, com a seta apontando pro chão. Você endireita. Ninguém vai saber que foi você.'},
    {t:'Barulho de capim sendo mastigado, de noite, perto demais. Quando você acende a lanterna, só tem o capim.', rastro:[19, 20, 29, 32], so:'noite'},
    {t:'Uma fileira de formigueiros mexidos, todos do mesmo lado. Alguém cava aqui toda manhã, e cava direito.', rastro:[27, 28]},
    {t:'Um frasco de Água Fresca esquecido no muro de pedra, ainda gelado da sombra.', item:['Água Fresca', 1]},
    {t:'Um Rattata atravessa a trilha carregando uma casca de pão maior que ele, e não para pra você.', rastro:[19], so:'dia'},
    {t:'Olhos acesos no capim, baixos, uns dez pares. Quando você dá um passo, apagam todos ao mesmo tempo.', rastro:[19, 20], so:'noite'}
  ],
  floresta:[
    {t:'Um casulo vazio grudado na casca, rachado no meio. Quem saiu daí já está voando.', rastro:[11, 14, 12, 15]},
    {t:'Teia grossa entre dois troncos, com orvalho preso em cada fio. Melhor dar a volta.', rastro:[167, 13]},
    {t:'No oco de uma árvore, alguém escondeu uma Antidote embrulhada num pano. Esqueceram de voltar.', item:['Antidote', 1]},
    {t:'Sementes mastigadas pela metade e um caminho de broto nascendo atrás delas.', rastro:[43, 69]},
    {t:'Uma faísca no meio do mato e cheiro de ar queimado. Algum elétrico mora perto.', rastro:[25]},
    {t:'Uma caixinha de pescador e uma Isca dentro de um saquinho, debaixo de uma raiz.', item:['Isca', 1]},
    {t:'Folhas roídas em meia-lua, centenas, todas do mesmo galho. O galho está quase pelado.', rastro:[10, 13]},
    {t:'Um zumbido grosso no alto das copas. Você para de andar até ele ir embora, e ele demora.', rastro:[15, 14]},
    {t:'Um tronco caído virou ponte sobre um córrego. Do outro lado, uma Potion presa num galho, como se alguém tivesse jogado e errado.', item:['Potion', 1]},
    {t:'A luz que passa pelas folhas faz manchas que se mexem no chão, e uma delas se mexe errado. Era um Caterpie.', rastro:[10], so:'dia'},
    {t:'Estalinhos de luz entre os troncos, rente ao chão, e um cheiro de ar queimado que fica depois que eles somem.', rastro:[25], so:'noite'},
    {t:'O cogumelo grande no pé da árvore tem um Paras debaixo, e o Paras te olha como quem pede pra você não pisar.', rastro:[46]},
    {t:'Um Oddish enterrado até as folhas, dormindo de dia, com cara de quem não quer ser acordado.', rastro:[43], so:'dia'},
    {t:'Um Oddish andando sozinho no meio da trilha, de noite, sem pressa nenhuma, pra lugar nenhum.', rastro:[43], so:'noite'},
    {t:'Uma folha larga e lisa, verde demais, presa entre duas pedras. Quando você pega, ela está quente.', item:['Pedra da Folha', 1], raro:true}
  ],
  montanha:[
    {t:'Pedra rolada recente, ainda com a terra úmida embaixo. Alguém grande passou rolando.', rastro:[74, 75, 95]},
    {t:'Uma corda velha amarrada num grampo de escalada, firme ainda. Você leva.', item:['Corda', 1]},
    {t:'Penas grandes presas num arbusto de espinho, lá em cima. Aqui voa coisa grande.', rastro:[21, 22, 17]},
    {t:'Uma lanterna com a lente rachada, que acende quando você bate nela.', item:['Lanterna', 1]},
    {t:'Marcas de garra na parede de pedra, na altura do seu joelho. Muitas.', rastro:[27, 28, 56]},
    {t:'Um Geodude parado no meio da trilha, que você toma por pedra até ele piscar.', rastro:[74]},
    {t:'Um ninho de Spearow num buraco do paredão, vazio, com três penas e um botão de camisa.', rastro:[21]},
    {t:'O vento aqui em cima traz um grito curto de longe, de bicada em cima de bicada. Spearow brigando.', rastro:[21, 22], so:'dia'},
    {t:'Uma garrafa de Água Fresca no pé de uma placa de altitude. Quem deixou sabia que alguém ia precisar.', item:['Água Fresca', 1]},
    {t:'Pedrinhas soltas caindo do alto, uma por vez, ritmadas. Alguma coisa está descendo devagar.', rastro:[74, 66]},
    {t:'Um Mankey sentado numa pedra alta te olha com raiva de nada, e depois com raiva de você.', rastro:[56], so:'dia'},
    {t:'Pegadas fundas na terra batida, de três dedos. Grandes. Indo pro alto.', rastro:[111, 95, 66]},
    {t:'Um Zubat sai de uma fenda no paredão bem quando escurece, e mais quarenta atrás dele.', rastro:[41], so:'noite'},
    {t:'Uma Bandagem nova, ainda no papel, presa num prego da placa de trilha.', item:['Bandagem', 1]}
  ],
  caverna:[
    {t:'Uma pedra pendurada no teto — não, um Zubat dormindo de cabeça pra baixo — e mais trinta em volta. Você sai devagar.', rastro:[41, 42]},
    {t:'Uma pedra lisa e redonda que brilha pouquinho quando você cobre com a mão. Fica com você.', item:['Moon Stone', 1], raro:true},
    {t:'Restos de fogueira e uma Pokébola rachada. Alguém acampou aqui e saiu sem ela.', item:['Poké Ball', 1]},
    {t:'Uma trilha de cogumelos na parede úmida, comidos pela metade.', rastro:[46, 47]},
    {t:'Pilha nova dentro de uma lanterna esquecida no chão.', item:['Pilha', 2]},
    {t:'Pingo, pingo, pingo, e um eco que não volta igual. Tem outra galeria do lado de lá da parede.'},
    {t:'Um Geodude encaixado num buraco da parede, tão bem encaixado que você só vê porque ele tosse poeira.', rastro:[74]},
    {t:'Marcas de raspado na pedra, em círculo, como se alguém tivesse girado no lugar muitas vezes.', rastro:[95, 66]},
    {t:'Um Paras subindo a parede devagar, levando um cogumelo nas costas que é maior que ele.', rastro:[46]},
    {t:'Uma Repelente pela metade, encostada numa pedra, com a tampa amarrada com barbante.', item:['Repelente', 1]},
    {t:'O ar aqui dentro esfria de repente, num ponto só, e esquenta de novo dois passos depois. Ninguém sabe explicar isso.'},
    {t:'Um Onix passa do outro lado da galeria. Você só ouve: pedra arrastando em pedra por um minuto inteiro.', rastro:[95]}
  ],
  agua:[
    {t:'A maré deixou uma garrafa na areia com um Potion dentro, inteiro. Quem jogou no mar queria que alguém achasse.', item:['Potion', 1]},
    {t:'Bolhas subindo num ponto só, sempre no mesmo lugar. Tem coisa respirando ali embaixo.', rastro:[129, 60, 118, 72]},
    {t:'Conchas abertas em fileira, comidas por alguém de garra.', rastro:[98, 90]},
    {t:'Uma isca de pesca enroscada nas pedras, ainda boa.', item:['Isca', 1]},
    {t:'Uma pena azul enorme boiando, e mais nada. Nem sinal de quem largou.', raro:true},
    {t:'Um Psyduck sentado na beira, com a mão na cabeça, olhando a água como quem tenta lembrar de alguma coisa.', rastro:[54]},
    {t:'Um cardume de Magikarp se debatendo no raso, todos virados pro mesmo lado, sem motivo nenhum.', rastro:[129]},
    {t:'Um Tentacool encalhado na areia, ressecando. Você empurra de volta com um galho, de longe.', rastro:[72], so:'dia'},
    {t:'Um brilho verde-azulado na água, de noite, que acende onde a onda bate. Não é reflexo de nada.', rastro:[170, 72], so:'noite'},
    {t:'Pegadas na areia molhada que entram no mar e não saem.', rastro:[60, 79, 86]},
    {t:'Um Krabby enterrado até os olhos, esperando alguma coisa passar. Você não é o que ele espera.', rastro:[98]},
    {t:'Uma pedra azul lisa, molhada mesmo depois de você secar com a camisa.', item:['Pedra da Água', 1], raro:true},
    {t:'Um Slowpoke com a cauda na água há tanto tempo que tem alga crescendo nela.', rastro:[79]},
    {t:'Um barco de pesca virado na areia, e embaixo dele uma Super Potion num balde.', item:['Super Potion', 1]}
  ],
  cidade:[
    {t:'Atrás do mercado, uma caixa de Ração rasgada e três Rattata dividindo sem brigar, o que é raro.', rastro:[19]},
    {t:'Uma Poké Ball perdida no bueiro, presa na grade. Dá pra puxar com dois dedos.', item:['Poké Ball', 1]},
    {t:'Um Meowth em cima do muro, lambendo a pata, te ignorando de propósito.', rastro:[52]},
    {t:'Na escadaria da praça, alguém esqueceu um frasco de Potion e um lenço dobrado.', item:['Potion', 1]},
    {t:'Pombos — não, Pidgey — esperando o homem do banco jogar migalha. Ele joga. Eles brigam.', rastro:[16], so:'dia'},
    {t:'Um Grimer saindo devagar de um bueiro, de noite, cheirando mal, e voltando quando te vê.', rastro:[88], so:'noite'},
    {t:'Uma criança vende pilha usada na calçada, duas por uma moeda, e uma delas ainda funciona.', item:['Pilha', 1], so:'dia'},
    {t:'Um Pokémon de alguém dormindo na porta de uma loja fechada, com coleira e nome bordado. Não é seu problema e você deixa ele dormir.'},
    {t:'No vão entre dois prédios, um Koffing flutuando baixinho e tossindo. Você prende a respiração e passa.', rastro:[109]},
    {t:'Uma Antidote dentro de um saco de papel, em cima do banco do ponto. Ninguém volta pra buscar.', item:['Antidote', 1]}
  ],
  ruina:[
    {t:'Cabo elétrico pelado saindo da parede, e o chão em volta todo chamuscado. Alguém mora nos fios.', rastro:[100, 81, 125]},
    {t:'Uma Pilha ainda lacrada numa caixa de manutenção enferrujada.', item:['Pilha', 2]},
    {t:'Um Magnemite grudado numa porta de metal, zumbindo, como quem tenta abrir com a força do pensamento.', rastro:[81]},
    {t:'Uma esfera de metal rolando sozinha pelo corredor — não: um Voltorb, que para quando você para.', rastro:[100]},
    {t:'Na sala de controle, um painel ainda acende uma luz verde, uma só, sem motivo.'},
    {t:'Uma pedra amarela que dá choque de leve quando você encosta.', item:['Pedra do Trovão', 1], raro:true},
    {t:'Pegadas de bota no pó, de muito tempo atrás, e por cima delas pegadas de três dedos, de ontem.', rastro:[100, 101, 125]},
    {t:'Uma Super Potion no armário de primeiros socorros da usina, a única coisa que ninguém levou.', item:['Super Potion', 1]},
    {t:'O zumbido aqui dentro muda de tom quando você chega perto da parede norte. Tem alguma coisa grande dormindo do outro lado.'}
  ],
  cemiterio:[
    {t:'Uma vela apagada na frente de uma lápide pequena, com um Poké Ball de brinquedo do lado.'},
    {t:'Um frio que passa por você na escada, de baixo pra cima, e some.', rastro:[92, 93]},
    {t:'Risada baixinha atrás de uma lápide. Quando você olha, só a lápide.', rastro:[92], so:'noite'},
    {t:'Flor nova em cima de cada lápide do corredor, todas iguais. Alguém vem aqui todo dia.'},
    {t:'Um Cubone sentado num degrau, segurando o osso no colo como quem segura alguma coisa que não é osso.', rastro:[104]},
    {t:'Uma Água Fresca deixada como oferenda, que você não pega. Do lado, uma outra, aberta, com bilhete: "pra quem precisar".', item:['Água Fresca', 1]},
    {t:'Um Gastly passa através da parede bem na sua frente e volta, como quem esqueceu alguma coisa.', rastro:[92], so:'noite'},
    {t:'Incenso queimando sozinho num canto que não tem ninguém.'}
  ],
  vulcao:[
    {t:'Pedra preta brilhante, quente na palma da mão. Debaixo dela, a terra está morna.', rastro:[58, 77, 126]},
    {t:'Pegadas de casco na cinza fresca, uma atrás da outra, galopando.', rastro:[77, 78]},
    {t:'Uma pedra vermelha com um fogo pequeno preso dentro, que não queima a sua mão.', item:['Pedra do Fogo', 1], raro:true},
    {t:'Um Slugma — não, uma poça de rocha derretida que se mexe. É um Slugma.', rastro:[218]},
    {t:'Um frasco de Água Fresca dentro de uma caixa térmica de pesquisador. A etiqueta diz "NÃO ABRIR". Você abre.', item:['Água Fresca', 1]},
    {t:'Uma rachadura no chão solta vapor em intervalos certos, de quarenta em quarenta segundos. Você conta três vezes.'},
    {t:'Um Growlithe sentado no alto de uma pedra, vigiando, que late uma vez quando te vê e não late mais.', rastro:[58]}
  ]
};

/* achados que só existem em lugares com cara própria */
const ACHADOS_DO_LUGAR = {
  rota1:[
    {t:'Do alto da colina da Rota 1 dá pra ver o telhado do laboratório de Pallet e a fumaça de duas chaminés.', so:'dia'},
    {t:'Uma placa nova, pintada à mão: "CUIDADO — RATTATA MORDE CADARÇO". Embaixo, alguém completou: "e meia".', rastro:[19]},
    {t:'Uma Potion que um treinador iniciante largou ali pra outro treinador iniciante, com bilhete: "boa sorte, eu também tava com medo".', item:['Potion', 1]}
  ],
  floresta:[
    {t:'Um Pikachu sentado num toco, com as bochechas soltando faísca baixinha, comendo uma fruta com as duas mãos.', rastro:[25], so:'dia'},
    {t:'Um caminho de casulos de Kakuna pendurados no mesmo galho, sete, imóveis. Um deles se mexe quando você passa.', rastro:[14]},
    {t:'Um caderno de treinador molhado, aberto numa página que diz: "Dia 4. Ainda perdid{o|a}. O Caterpie evoluiu."'}
  ],
  monte_lua:[
    {t:'Pegadas pequenas, redondas, em fila, indo pro fundo da caverna. E uma melodia baixinha vindo de lá.', rastro:[35], so:'noite'},
    {t:'Pedaços de rocha clara com cheiro de chuva, quebrados com cuidado, como se alguém procurasse alguma coisa dentro.', rastro:[35, 46]},
    {t:'Uma pedra pequena, lisa, que parece ter uma lua desenhada por dentro.', item:['Moon Stone', 1], raro:true},
    {t:'Um capacete de mineração abandonado, com a lanterna ainda funcionando.', item:['Lanterna', 1]},
    {t:'No pé de uma parede raspada às pressas, uma lasca que caiu e ninguém juntou. Dentro dela, uma espiral perfeita.', item:['Fóssil de Hélice', 1], raro:true},
    {t:'Atrás de uma pedra que alguém já tinha rolado e desistido, uma casca abaulada e lisa, solta da rocha pela metade.', item:['Fóssil de Domo', 1], raro:true}
  ],
  rota24:[
    {t:'Na ponte, sete degraus pintados de cores diferentes, e em cada um alguém escreveu o nome de quem perdeu ali.'},
    {t:'Um Oddish e um Bellsprout dividindo a mesma sombra na beira do rio, sem olhar um pro outro.', rastro:[43, 69]}
  ],
  tunel_rocha:[
    {t:'No escuro total, um barulho de asa bem perto da orelha. Depois mais nada.', rastro:[41, 42]},
    {t:'Marcas de giz numa parede: setas, e uma delas riscada com raiva.'},
    {t:'Numa fresta da parede, na altura do joelho, uma pedra cor de mel, morna, com uma sombra pequena presa dentro.', item:['Âmbar Antigo', 1], raro:true}
  ],
  usina:[
    {t:'Um quadro de luz aberto com um bilhete colado: "NÃO MEXA. ELE GOSTA DAQUI." Ninguém assinou.', rastro:[125, 100]}
  ],
  rota12:[
    {t:'Pescador dormindo na ponte com a vara presa no joelho. A linha está esticada, e ele não acorda.', rastro:[129, 118], so:'dia'},
    {t:'Uma Isca nova no chão da ponte, ao lado de um pote de ração marinha vazio.', item:['Isca', 1]}
  ],
  rota16:[
    {t:'Marca de pneu de bicicleta na descida, e uma luva sem dedo esquecida na grade.'},
    {t:'Um Doduo correndo do lado da estrada, ganhando de quem vai de bicicleta, sem esforço.', rastro:[84], so:'dia'}
  ],
  seafoam:[
    {t:'Gelo fino sobre a água escura, e embaixo dele alguma coisa grande passando devagar.', rastro:[86, 87, 131]},
    {t:'Penas brancas presas no gelo, quase transparentes, frias demais pra ser de qualquer Pokémon que você conheça.', raro:true},
    {t:'Um Seel dormindo numa placa de gelo que gira devagar com a corrente.', rastro:[86]}
  ],
  caminho_vitoria:[
    {t:'Na parede, nomes riscados com ponta de pedra. Centenas. Alguns com uma data. Alguns com um "ainda".'},
    {t:'Uma Revive esquecida numa saliência, com a etiqueta de um Centro de Johto.', item:['Revive', 1], raro:true},
    {t:'Pegadas de muita gente indo em frente. Muito menos voltando.'}
  ],
  rota22:[
    {t:'Um Mankey roubou o boné de alguém e está usando, sentado numa pedra, satisfeito.', rastro:[56], so:'dia'}
  ]
};

/* quando você procura no lugar errado: muda com o lugar e com a hora */
const FALHAS_VASCULHAR = {
  campo:[
    d => ehNoite() ? 'Você procura no escuro, tropeça em dois cupinzeiros e volta com a calça cheia de carrapicho.' : 'Você procura um período inteiro no capim errado. O sol muda de lado e você nem viu.',
    'Você acha uma moeda de muito tempo atrás que não vale mais nada, e guarda assim mesmo.',
    'O vento deita o capim todo pro mesmo lado e esconde qualquer coisa que tivesse ali.'
  ],
  floresta:[
    'As árvores aqui são todas iguais, e em dez minutos você está procurando no mesmo lugar pela terceira vez.',
    d => ehNoite() ? 'De noite a floresta fecha. Você procura com a mão na frente do rosto e não acha nem a trilha direito.' : 'Você passa a manhã olhando pra cima, pras copas, e o que tinha pra achar estava no chão.',
    'Um galho cai do seu lado, perto o bastante pra você desistir de procurar debaixo daquela árvore.'
  ],
  montanha:[
    'Você sobe até o primeiro mirante, olha, desce. A montanha não estava a fim de mostrar nada hoje.',
    'O vento leva o seu chapéu, e o resto do período você passa procurando o chapéu.',
    d => ehNoite() ? 'Na montanha, de noite, o melhor que dá pra achar é o caminho de volta. Você acha.' : 'Pedra, pedra, pedra. Uma era bonita. Você deixa onde estava.'
  ],
  caverna:[
    'A lanterna pisca e você passa mais tempo batendo nela do que olhando em volta.',
    'Você entra numa galeria que acaba em parede, e outra, e outra. A caverna está de mau humor.',
    'O eco dos seus passos vem de três lados. Você não acha nada e não fica nem um pouco mais calm{o|a}.'
  ],
  agua:[
    'Você vira pedras na beira por um período inteiro e só acha mais pedras debaixo delas.',
    d => ehNoite() ? 'A maré sobe enquanto você procura, e você volta com a água pela canela e as mãos vazias.' : 'O sol na água cega você a cada onda. O que tinha pra achar, a água achou primeiro.',
    'Você acha uma garrafa com um bilhete dentro. O bilhete está em branco.'
  ],
  cidade:[
    'Você olha atrás de muro, debaixo de banco e dentro de vaso de planta, e uma senhora pergunta se você perdeu alguma coisa.',
    d => ehNoite() ? 'A cidade de noite esconde tudo atrás de porta fechada. Você só acha porta fechada.' : 'Muita gente na rua, muito barulho, e nada que não fosse de ninguém.',
    'Um vendedor te oferece um mapa da cidade. A cidade não precisa de mapa: são três ruas.'
  ],
  ruina:[
    'Poeira, fio, ferrugem. Você espirra tanto que o que estivesse aqui fugiu.',
    'Uma porta trancada, outra trancada, e uma aberta que dá pra uma sala vazia.',
    'O zumbido das paredes não para nem quando você para. Você não acha nada e sai com a nuca arrepiada.'
  ],
  cemiterio:[
    'Você procura com respeito demais pra mexer em qualquer coisa. Não acha nada, e acha certo.',
    'Uma névoa baixa cobre o chão inteiro até a altura do tornozelo. O que tiver aqui, está debaixo dela.',
    'Alguém está conversando baixinho com uma lápide. Você vai embora pra deixar a conversa em paz.'
  ],
  vulcao:[
    'O calor sobe do chão e você passa mais tempo procurando sombra do que procurando o resto.',
    'A cinza cobre tudo igual. Pedra, galho, achado: tudo cinza.',
    'O cheiro de enxofre te faz desistir antes de terminar a volta.'
  ]
};

function _lugarTemRastro(rastro, localId){
  const daqui = ((typeof ENCONTROS !== 'undefined' && ENCONTROS[localId]) || []).map(x => x[0]);
  if (!daqui.length) return true;            /* lugar sem tabela: não filtra */
  return rastro.some(x => daqui.includes(x));
}

/* devolve os avisos do achado (e já aplica item e Pokédex) */
function achadoDeVasculhar(ambiente, sortudo, soRastro, localId){
  localId = localId || (typeof Mundo !== 'undefined' ? Mundo.id() : null);
  const d = Estado.dados;
  const noite = typeof ehNoite === 'function' && ehNoite();
  const base = (ACHADOS_DO_LUGAR[localId] || []).concat(ACHADOS_VASCULHAR[ambiente] || ACHADOS_VASCULHAR.campo);
  let lista = base.filter(a => (!a.raro || sortudo) && (!soRastro || !a.item)
    && (!a.so || (a.so === 'noite') === noite)
    && (!a.rastro || _lugarTemRastro(a.rastro, localId)));
  if (!lista.length) lista = (ACHADOS_VASCULHAR[ambiente] || ACHADOS_VASCULHAR.campo).filter(a => !a.raro && !a.item);
  /* o lugar lembra o que você já achou: prefere o que você não viu */
  d.vasculhados = d.vasculhados || {};
  const vistos = d.vasculhados[localId] = d.vasculhados[localId] || [];
  const novos = lista.filter(a => !vistos.includes(a.t.slice(0, 40)));
  const a = Dados.escolher(novos.length ? novos : lista);
  vistos.push(a.t.slice(0, 40)); if (vistos.length > 30) vistos.shift();
  const av = [{tipo:'info', texto:a.t}];
  if (a.item){ Estado.darItem(a.item[0], a.item[1]); av.push({tipo:'item', texto:`Achou ${a.item[1]}× ${a.item[0]}.`}); }
  if (a.rastro){
    const daqui = ((typeof ENCONTROS !== 'undefined' && ENCONTROS[localId]) || []).map(x => x[0]);
    const quem = a.rastro.find(x => daqui.includes(x)) || a.rastro[0];
    const pd = Estado.pdex();
    if (DEX[quem] && !pd.vistos[quem] && d.flags.tem_pokedex){
      pd.vistos[quem] = true;
      av.push({tipo:'pokedex', texto:`Pelo rastro, a Pokédex acende um número novo: ${String(quem).padStart(3, '0')}.`});
    }
  }
  return av;
}

function falhaDeVasculhar(ambiente){
  const lista = FALHAS_VASCULHAR[ambiente] || FALHAS_VASCULHAR.campo;
  const f = Dados.escolher(lista);
  return typeof f === 'function' ? f(Estado.dados) : f;
}

/* ============================================================
   ACAMPAR — montar, a noite e acordar
   ============================================================ */
const ACAMPAMENTO = {
  monta:{
    campo:['Você estica a lona entre duas estacas no capim baixo, longe da trilha, onde o vento não bate direto.',
           'Você acha um muro de pedra velho e encosta a barraca nele. É o mais perto de parede que a rota oferece.',
           'O fogo pega no segundo fósforo. O capim em volta fica dourado e depois preto e depois noite.'],
    floresta:['Você acampa debaixo de uma árvore grande, que é o que todo mundo diz pra não fazer e todo mundo faz.',
              'O chão aqui é macio de folha. O fogo fica pequeno, porque floresta não perdoa fogo grande.',
              'Você amarra a comida num galho alto, longe da barraca, como o caderno de campo ensina.'],
    montanha:['Você acha uma reentrância no paredão, funda o bastante pra três pessoas e um Pokémon grande.',
              'O vento aqui em cima não dá trégua. A lona estala a noite inteira.',
              'Você empilha pedra em meia-lua em volta do fogo. Aprendeu isso vendo outro treinador fazer.'],
    caverna:['Você acampa logo depois da entrada, onde ainda chega um pouco de luz e de ar.',
             'O fogo na caverna faz a sua sombra ficar enorme na parede, e o seu time não gosta disso.',
             'O chão é pedra. Você dobra o cobertor em quatro e ainda é pedra.'],
    agua:['Você monta a barraca acima da linha da maré, que você descobre olhando onde a areia muda de cor.',
          'O barulho da água vira o barulho de tudo. Em meia hora você nem ouve mais.',
          'O fogo de beira de rio estala com a lenha úmida e solta mais fumaça que calor.'],
    cidade:['Você estende o saco de dormir no gramado da praça, perto do Centro. O guarda passa, olha e finge que não viu.'],
    ruina:['Você dorme dentro de uma sala com porta, porque porta é porta, mesmo quebrada.'],
    cemiterio:['Você acampa na escada de fora da torre, onde ainda é do lado de fora.'],
    vulcao:['Você acha um ponto onde o chão não está quente. Leva uma hora pra achar.']
  },
  noite:[
    d => { const p = (d.time || []).find(x => !x.morto); return p ? `${nomeExib(p)} dorme encostad${pron(p).o} na sua perna, e você não mexe a perna a noite inteira.` : 'Você dorme sozinh{o|a} e acorda duas vezes com barulho de nada.'; },
    d => { const vivos = (d.time || []).filter(x => !x.morto); const p = vivos[vivos.length - 1]; return p ? `${nomeExib(p)} fica acordad${pron(p).o} até tarde olhando pro fogo, e de manhã está com a cara de quem não se arrepende.` : 'O fogo dura mais do que você.'; },
    {sem:['caverna','ruina'], t:'O céu fica tão aberto que dá vontade de contar estrela. Você chega a quarenta e dorme.'},
    'Alguma coisa passa perto do acampamento de madrugada, cheira a lona e vai embora sem pressa.',
    {so:['campo','floresta'], t:'Um Hoothoot canta perto, sempre do mesmo galho, sempre no mesmo intervalo.'},
    {sem:['caverna'], t:'Chove meia hora no meio da noite. A lona aguenta. Você não sabia que ia aguentar.'},
    {so:['caverna'], t:'Um Zubat entra na luz do fogo, dá duas voltas em cima de vocês e volta pro escuro. Ninguém do time dorme por meia hora.'},
    {so:['caverna','montanha'], t:'De madrugada a montanha estala por dentro, um estalo comprido de pedra assentando. O time inteiro acorda e olha pro teto.'},
    {so:['agua'], t:'A maré sobe de madrugada e chega a um palmo da barraca. Você muda tudo de lugar no escuro, descalç{o|a}, xingando baixo.'},
    {so:['floresta'], t:'A floresta não dorme: estala, pinga, arrasta. Lá pelas duas você para de reparar e dorme também.'},
    'Você acorda com frio às quatro da manhã e bota mais um galho no fogo. O time inteiro se aproxima um pouco.',
    d => { const vivos = (d.time || []).filter(x => !x.morto); if (vivos.length < 2) return 'Você conversa com o fogo um pouco, já que ninguém está olhando.'; return `${nomeExib(vivos[0])} e ${nomeExib(vivos[1])} disputam o lugar mais perto do fogo e acabam dividindo.`; },
    {sem:['cidade'], t:'Uma luz de lanterna passa longe, na trilha, e some. Outro treinador, mais teimoso que você, andando de noite.'},
    'O silêncio aqui é tão grande que você ouve o próprio coração. Depois ouve o ronco de um Pokémon seu, e o silêncio acaba.'
  ],
  acorda:{
    critico:['Você acorda antes do sol, descansad{o|a} como não ficava há dias, e o time acorda com você, de bom humor.',
             'É uma daquelas noites que funcionam. De manhã o corpo está inteiro e a cabeça está leve.'],
    sucesso:['Ninguém dorme direito, e todo mundo melhora um pouco. É o que acampar faz.',
             'De manhã você está melhor do que deitou. O time também, dá pra ver pelo jeito que eles esticam.'],
    parcial:['Você acorda três vezes e uma delas é por nada.',
             'Alguma coisa dura nas costas a noite inteira. Você descansa, mas descansa torto.'],
    falha:['A noite é ruim. Frio pelas costas, chão duro, e de manhã você está pior do que deitou.',
           'Você não dorme. O time dorme. Alguém precisava ficar de olho, e foi você, e ninguém pediu.']
  }
};

function textoDoAcampamento(ambiente, grau){
  const d = Estado.dados;
  const monta = ACAMPAMENTO.monta[ambiente] || ACAMPAMENTO.monta.campo;
  /* a noite tem que caber no lugar: céu e chuva não entram na caverna */
  const cabe = ACAMPAMENTO.noite.filter(x => typeof x !== 'object' || ((!x.so || x.so.includes(ambiente)) && (!x.sem || !x.sem.includes(ambiente))));
  let n = Dados.escolher(cabe);
  if (n && typeof n === 'object') n = n.t;
  return [Dados.escolher(monta), typeof n === 'function' ? n(d) : n, Dados.escolher(ACAMPAMENTO.acorda[grau] || ACAMPAMENTO.acorda.parcial)];
}
