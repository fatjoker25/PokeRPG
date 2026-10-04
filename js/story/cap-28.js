/* ------------------------------------------------------------
   ABERTURAS — a descida para a câmara. Um caminho só, e três
   jeitos de entrar nele.
   ------------------------------------------------------------ */
const C28_ABERTURAS = ['c23_descida', 'c28_ab_a_boca', 'c28_ab_o_que_ficou_na_boca'];
function c28_cabe(id, d){ return true; }
function c28_abertura(d){ return Dados.escolher(C28_ABERTURAS.filter(id => c28_cabe(id, d))); }

/* ============================================================
   CAPÍTULO 28 — Eu perguntei primeiro (final)
   ============================================================ */
CAPITULOS.push(

{
num:28, titulo:'Eu Perguntei Primeiro', local:'A caverna do norte', ambiente:'ruina', nivelArea:70,
tom:'final', entradas:C28_ABERTURAS,
inicio: d => c28_abertura(d),
cenas:{

c28_ab_a_boca:{
  texto:[
    'A boca da caverna é mais alta que uma casa, redonda em cima e perfeitamente regular, do jeito que boca de caverna não é.',
    'Você fica parad{o|a} na frente dela por um tempo que não dá pra medir.',
    'Não sai vento. Você põe a mão na altura do peito, depois na altura do joelho, depois estende o braço pra dentro do escuro.',
    'Nada. O ar lá de dentro está tão parado quanto o de fora, e caverna não faz isso: caverna respira, porque a diferença de temperatura empurra o ar.',
    'Esta não empurra nada.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} está atrás de você, a uns quatro metros, e não vai chegar mais perto. Não é medo: é a distância que ${pron(p).ele} escolheu, e ${pron(p).ele} vai manter essa distância a descida inteira.`
               : 'Você está sozinh{o|a} na boca de uma coisa que não respira.';
    },
    'Você entra.'
  ],
  ef:{executar:d=>{ Estado.lend(150).encontros++; return []; },
      flag:'a_boca_que_nao_respira',
      registrar:'Entrou pela boca da caverna, que não tem corrente de ar nenhuma.',
      presagio:'Ela não respira porque não tem outra saída, ou porque o que está lá dentro não precisa de ar.'},
  escolhas:[
    {texto:'Olhar as paredes com atenção.', vai:'c23_as_paredes'},
    {texto:'Olhar o chão.', vai:'c23_o_chao'},
    {texto:'Chamar em voz alta.', vai:'c23_chamou'},
    {texto:'Descer direto, sem parar.', vai:'c23_a_camara'}
  ]
},

c28_ab_o_que_ficou_na_boca:{
  texto:[
    'Antes de descer você tira da mochila o que não vai levar e põe encostado na parede da boca da caverna, numa pilha.',
    'Não é decisão tática. Você não sabe o que vai encontrar lá embaixo e levar menos não ajuda em nada.',
    'É outra coisa, e você entende enquanto faz: é pra existir uma pilha.',
    'Uma pilha de coisas suas, encostada numa parede, num lugar que alguém um dia vai achar.',
    d=>{
      const partes = [];
      if (d.flags.carrega_a_pena) partes.push('A pena de três faixas você não deixa. Você prometeu voltar e contar de quem é.');
      if (d.flags.copia_do_hideo || d.flags.reika_precisa_de_papel) partes.push('O papel você deixa. Papel não serve pra nada lá embaixo e serve pra tudo aqui em cima.');
      partes.push('A carteira, a foto, o caderninho.');
      return partes.join(' ');
    },
    'Você olha a pilha por uns dez segundos, achando ridículo, e não desfaz.',
    'E desce.'
  ],
  ef:{executar:d=>{ Estado.lend(150).encontros++; return []; },
      flag:'deixou_a_pilha_na_boca',
      registrar:'Deixou parte das próprias coisas numa pilha encostada na boca da caverna.'},
  escolhas:[
    {texto:'Olhar as paredes com atenção.', vai:'c23_as_paredes'},
    {texto:'Olhar o chão.', vai:'c23_o_chao'},
    {texto:'Chamar em voz alta.', vai:'c23_chamou'},
    {texto:'Descer direto, sem parar.', vai:'c23_a_camara'}
  ]
},


c23_descida:{
  texto:[
    'A descida não tem bifurcação. Um caminho só, indo fundo, com o chão em rampa e a parede lisa dos dois lados.',
    'Você desce quarenta minutos. Nos primeiros dez, a luz da entrada ainda chega. Nos trinta seguintes, não, e mesmo assim dá para ver.',
    'Dá para ver porque a pedra tem uma luminescência muito fraca, esverdeada, uniforme, que não vem de lugar nenhum e está em todo lugar.',
    'O ar é morno e parado, e a cada cem metros fica um pouco mais morno.',
    'E você percebe, em algum ponto do vigésimo minuto, que está andando devagar de propósito.'
  ],
  ef:{executar:d=>{ Estado.lend(150).encontros++; return []; },
      registrar:'Começou a descida para a câmara sob a montanha.'},
  escolhas:[
    {texto:'Olhar as paredes com atenção.', vai:'c23_as_paredes'},
    {texto:'Olhar o chão.', vai:'c23_o_chao'},
    {texto:'Chamar em voz alta.', vai:'c23_chamou'},
    {texto:'Descer direto, sem parar.', vai:'c23_a_camara'}
  ]
},

c23_as_paredes:{
  texto:[
    'A parede é lisa como vidro fosco e você passa a mão e ela é morna.',
    'E, a partir de uns cento e cinquenta metros de descida, ela tem marcas.',
    'Não são naturais. São traços, feitos na pedra por alguma coisa que derreteu a superfície com precisão de agulha.',
    'Grupos de quatro riscos verticais cortados por um quinto na diagonal. A contagem que qualquer preso faz.',
    'Você começa a contar e desiste no terceiro metro de parede, porque são centenas de grupos e eles continuam parede abaixo até onde a luz alcança.'
  ],
  ef:{flag:'viu_a_contagem_na_parede', instabilidade:1,
      registrar:'A parede da descida está marcada com uma contagem de dias, centenas de grupos de cinco.'},
  escolhas:[
    {texto:'Contar mesmo assim. Do começo.', vai:'c23_contou_a_parede'},
    {texto:'Olhar onde a contagem começa.', vai:'c23_onde_comeca'},
    {texto:'Olhar o chão.', vai:'c23_o_chao'},
    {texto:'Descer.', vai:'c23_a_camara'}
  ]
},

c23_contou_a_parede:{
  texto:[
    'Você conta. Leva uma hora e quarenta minutos e você erra duas vezes e recomeça duas vezes.',
    'Setecentos e trinta e um riscos.',
    'Dois anos e um dia.',
    'E aí você repara na coisa que faz o chão sair de baixo dos seus pés: os duzentos e quarenta e um primeiros riscos foram feitos de um jeito diferente dos outros.',
    'Os duzentos e quarenta e um primeiros são pequenos, apertados, numa linha reta e organizada.',
    'Do duzentos e quarenta e dois em diante eles ficam maiores, tortos, e a linha desce.',
    'Ele continuou contando os dias depois de sair de lá. Ele continuou contando do mesmo jeito que contava lá dentro.'
  ],
  ef:{flag:['contou_os_731'], instabilidade:2, moral:-2,
      rep:{eixo:'bom',delta:2,motivo:'Passou uma hora e quarenta contando riscos numa parede'},
      registrar:'731 dias marcados na parede. Os 241 primeiros são de outro jeito.'},
  escolhas:[
    {texto:'Olhar onde a contagem começa.', vai:'c23_onde_comeca'},
    {texto:'Descer.', vai:'c23_a_camara'}
  ]
},

c23_onde_comeca:{
  texto:[
    'Você sobe de volta procurando o primeiro risco, e acha, e ele não está no alto.',
    'A contagem começa no meio da descida e sobe. Ele começou a marcar de baixo para cima, como quem mede o quanto já subiu e não o quanto falta.',
    'E no ponto exato onde a contagem começa, na altura da cintura, tem uma coisa que não é risco.',
    'É uma marca redonda, do tamanho de uma mão espalmada, gasta no centro, mais funda que o resto.',
    'Alguém apoiou a mão nesse ponto exato, todo dia, por dois anos, antes de fazer o risco do dia.'
  ],
  ef:{flag:['achou_a_marca_da_mao'], instabilidade:2, moral:-2,
      registrar:'A contagem começa no meio da descida. Ao lado, uma marca de mão gasta pelo uso diário.'},
  escolhas:[
    {texto:'Apoiar a sua mão na marca.', vai:'c23_apoiou_a_mao'},
    {texto:'Descer.', vai:'c23_a_camara'}
  ]
},

c23_apoiou_a_mao:{
  falante:'Mewtwo',
  vozes:['N'],
  texto:[
    'Você apoia a mão na marca.',
    'Ela é muito maior que a sua e é morna como o resto da pedra, e por três ou quatro segundos não acontece absolutamente nada.',
    'Depois, lá embaixo, muito fundo, uma voz que você não ouve com o ouvido diz uma coisa só.',
    '"Você está subindo ou descendo?"',
    'Você tira a mão.'
  ],
  ef:{flag:['ele_falou_na_descida'], instabilidade:2,
      registrar:'Ele falou com você na descida, antes de você chegar.'},
  escolhas:[
    {texto:'Responder em voz alta: "descendo".', vai:'c23_respondeu_descendo'},
    {texto:'Não responder. Descer.', vai:'c23_a_camara'}
  ]
},

c23_respondeu_descendo:{
  falante:'Mewtwo',
  vozes:['P','N','N','N'],
  texto:[
    '"Descendo."',
    'A palavra bate na pedra e volta, e depois disso fica um silêncio de uns bons dez segundos.',
    '"Todo mundo responde descendo."',
    'Uma pausa.',
    '"Eu marquei a parede de baixo para cima por dois anos e eu nunca subi um metro."',
    'E aí, mais baixo, quase sem chegar:',
    '"Vem."'
  ],
  ef:{flag:['ele_te_chamou'], instabilidade:1,
      registrar:'Ele te chamou para descer.'},
  escolhas:[{texto:'Descer.', vai:'c23_a_camara'}]
},

c23_o_chao:{
  texto:[
    'O chão da rampa é liso e tem uma camada fina de poeira, e poeira guarda tudo.',
    'Três pares de pegadas de bota, descendo, lado a lado, com passada normal. São da terceira equipe.',
    'Elas descem uns duzentos metros e param, e depois voltam. Elas voltam.',
    'E, por cima delas, um par mais antigo, de bota maior, que desce e não volta.',
    d=>d.flags.procura_o_nogueira
      ? 'Você senta no chão e mede a pegada maior com a mão aberta, e confere com o que está escrito no bilhete que a Maren Kestrel te deu.'
      : 'Você fica um tempo agachad{o|a} olhando o par que não volta.'
  ],
  ef:{flag:['viu_as_pegadas_na_rampa'], instabilidade:1,
      registrar:'Três pares descem duzentos metros e voltam. Um par mais antigo desce e não volta.'},
  escolhas:[
    {texto:'Seguir o par que não volta.', vai:'c23_o_par_que_nao_volta'},
    {texto:'Olhar as paredes.', vai:'c23_as_paredes'},
    {texto:'Descer.', vai:'c23_a_camara'}
  ]
},

c23_o_par_que_nao_volta:{
  texto:[
    'Você segue o par maior e ele desce até o fim da rampa, sem hesitar em nenhum ponto, sem parar em nenhum ponto.',
    'A trinta metros do fim, ele muda.',
    'A passada encurta e os pés ficam mais juntos, do jeito que fica quando alguém para de andar e passa a andar em direção a alguma coisa.',
    'E nos últimos dez metros tem só a marca de um par de botas parado, com o peso nos dois pés.',
    d=>d.flags.sabe_das_pegadas_do_vernon ? 'Exatamente como a Maren Kestrel descreveu, só que aqui embaixo.' : '',
    'A partir dali, nada. Nem pegada saindo, nem pegada voltando, nem arrasto.'
  ],
  ef:{flag:['achou_onde_ele_parou'], instabilidade:2,
      registrar:'As pegadas do Vernon terminam no fim da rampa, paradas, com o peso nos dois pés.'},
  escolhas:[
    {texto:'Entrar na câmara.', vai:'c23_a_camara'},
    {texto:'Chamar o nome dele em voz alta.', vai:'c23_chamou_o_nome', cond:d=>!!d.flags.procura_o_nogueira}
  ]
},

c23_chamou_o_nome:{
  falante:'Mewtwo',
  vozes:['P','N'],
  texto:[
    '"Vernon!"',
    'O nome bate na pedra lisa e volta duas vezes e some.',
    'Nada responde.',
    'Você chama de novo, e de novo, e na quarta vez a sua voz falha e você percebe que está gritando o nome de um homem que você nunca viu para dentro de uma montanha.',
    'E aí, da câmara, aquela voz:',
    '"Ele não atende por esse nome há muito tempo."'
  ],
  ef:{flag:['ele_esta_vivo'], instabilidade:2,
      registrar:'Ele não atende por esse nome há muito tempo.'},
  escolhas:[{texto:'Entrar na câmara.', vai:'c23_a_camara'}]
},

c23_chamou:{
  falante:'Mewtwo',
  vozes:['P','N','N'],
  texto:[
    '"Tem alguém aí?"',
    'A pergunta sai mais fina do que você queria e bate na pedra.',
    'Passam uns oito segundos.',
    '"Tem."',
    'Não veio de baixo. Veio de dentro da sua cabeça, e é calmo, e é de alguém que estava esperando exatamente essa pergunta.',
    '"Continua descendo. Eu não subo mais."'
  ],
  ef:{flag:['ele_respondeu_o_chamado'], instabilidade:1,
      registrar:'Ele respondeu ao seu chamado do meio da descida.'},
  escolhas:[
    {texto:'"Por que você não sobe?"', vai:'c23_porque_nao_sobe'},
    {texto:'Descer calad{o|a}.', vai:'c23_a_camara'},
    {texto:'Olhar as paredes enquanto desce.', vai:'c23_as_paredes'}
  ]
},

c23_porque_nao_sobe:{
  falante:'Mewtwo',
  vozes:['P','N','N','N'],
  texto:[
    '"Por que você não sobe?"',
    'Dessa vez ele demora.',
    '"Porque tem duas coisas na porta que não dormem há sete meses por minha causa."',
    'Uma pausa.',
    '"E porque, se eu subir, eu vou ter que decidir para onde ir, e eu não tenho para onde."',
    'Mais uma.',
    '"Desce. É mais fácil falar de perto, e eu estou fora de prática."'
  ],
  ef:{flag:['sabe_porque_nao_sobe'], instabilidade:1, moral:-1,
      registrar:'Ele não sobe por causa dos dois na porta, e porque não tem para onde ir.'},
  escolhas:[{texto:'Descer.', vai:'c23_a_camara'}]
},

c23_a_camara:{
  falante:'Mewtwo',
  vozes:['N'],
  texto:[
    'No fim da rampa, uma câmara. Grande demais para caber embaixo daquela montanha, o que é impossível, e você para de pensar nisso rápido porque pensar nisso não ajuda.',
    'O teto é abobadado e liso. O chão é liso. Não tem estalactite, não tem água, não tem raiz.',
    'No centro, uma pedra do tamanho de uma mesa, com a superfície gasta no meio.',
    'E, encostado na parede da direita, um monte de coisas.',
    'Sentado na pedra, de costas para você: Mewtwo.',
    '"Você demorou."',
    'Você não ouviu isso com os ouvidos.'
  ],
  ef:{registrar:'Chegou à câmara. Ele estava sentado na pedra, de costas.'},
  escolhas:[
    {texto:'"Você estava me esperando?"', vai:'c23_conversa'},
    {texto:'Olhar o monte de coisas encostado na parede primeiro.', vai:'c23_as_coisas'},
    {texto:'Olhar a câmara inteira antes de falar.', vai:'c23_olhou_a_camara'},
    {texto:'Procurar o homem que desceu e não voltou.', vai:'c23_procurou_o_homem',
     cond:d=>!!(d.flags.procura_o_nogueira||d.flags.achou_onde_ele_parou)}
  ]
},

c23_as_coisas:{
  texto:[
    'O monte encostado na parede é um monte de coisas humanas, empilhadas sem nenhuma ordem e sem nenhum dano.',
    'Uma cadeira de escritório com rodinha. Um extintor. Três capacetes. Uma caixa de ferramentas. Um rádio igual ao da barraca.',
    'Um armário de aço de duas portas, amassado de um lado, com uma etiqueta de patrimônio colada na lateral.',
    'Uma escrivaninha de metal, com a gaveta de cima aberta.',
    'Tudo tem a mesma marca de fábrica, e a marca é a da Silph, e tudo está aqui há muito tempo.',
    'Ele não roubou isso. Ele carregou isso. Ele carregou uma escrivaninha de metal por duzentos quilômetros e desceu uma rampa de quarenta minutos com ela.'
  ],
  ef:{flag:['viu_o_monte'], instabilidade:2,
      registrar:'Ele trouxe móveis e equipamento da Silph para dentro da caverna e empilhou na parede.'},
  escolhas:[
    {texto:'Olhar a gaveta aberta da escrivaninha.', vai:'c23_a_gaveta'},
    {texto:'"Por que você trouxe tudo isso?"', vai:'c23_porque_trouxe'},
    {texto:'Olhar a câmara inteira.', vai:'c23_olhou_a_camara'},
    {texto:'"Você estava me esperando?"', vai:'c23_conversa'}
  ]
},

c23_a_gaveta:{
  texto:[
    'A gaveta de cima da escrivaninha está aberta e tem uma coisa só dentro.',
    'É um caderno de capa dura, do mesmo modelo dos cadernos de campo do Instituto de Cinnabar, com o número 7 escrito na lombada a caneta.',
    'Está aberto na última página escrita.',
    d=>d.flags.leu_o_caderno_do_fuji || d.flags.achou_os_cadernos ? 'A caligrafia é a mesma do caderno seis, a do Dr. Fuji.' : 'A caligrafia é de alguém que escrevia todo dia no mesmo caderno, com a mesma caneta.',
    '**Dia 241. Ele pediu para sair. Usou a palavra por favor. Encaminhei ao comitê. Não anotei na ficha oficial.**',
    'E, embaixo, numa letra que não é humana e que foi feita queimando o papel com precisão de agulha, uma linha só:',
    '**Eu li isso no dia 602. Obrigado.**'
  ],
  ef:{flag:['leu_caderno','achou_o_caderno_7_aqui'], instabilidade:2, moral:-2,
      registrar:'O caderno 7 está aqui, e ele escreveu uma linha embaixo da última anotação do Fuji.'},
  escolhas:[
    {texto:'"Como você conseguiu esse caderno?"', vai:'c23_como_conseguiu'},
    {texto:'"Por que você trouxe tudo isso?"', vai:'c23_porque_trouxe'},
    {texto:'"Você estava me esperando?"', vai:'c23_conversa'}
  ]
},

c23_como_conseguiu:{
  falante:'Mewtwo',
  vozes:['N','N','P','N','N','P','N','N'],
  texto:[
    'Ele responde sem virar.',
    '"Eu fui buscar."',
    'Uma pausa.',
    '"No dia quinhentos e noventa e quatro eu desci a montanha, atravessei Kanto de noite, entrei num prédio em Cinnabar que estava vazio e procurei por três noites até achar."',
    '"E ninguém viu você."',
    '"Uma pessoa viu." A voz fica ligeiramente diferente. "Um homem de uns setenta anos, com uma lanterna, que estava procurando outra coisa."',
    '"E o que ele fez?"',
    '"Ele apontou onde estava o caderno sete, esperou eu pegar, e voltou a procurar a coisa dele." Uma pausa longa. "Ele não me perguntou nada. É a segunda melhor coisa que uma pessoa já fez por mim."'
  ],
  ef:{flag:['sabe_da_viagem_a_cinnabar'], instabilidade:2, moral:2,
      registrar:'Ele foi a Cinnabar buscar o caderno 7. Um velho com uma lanterna apontou onde estava e não perguntou nada.'},
  escolhas:[
    {texto:'"E qual foi a primeira?"', vai:'c23_a_primeira_coisa'},
    {texto:'"Por que você trouxe tudo isso?"', vai:'c23_porque_trouxe'},
    {texto:'"Você estava me esperando?"', vai:'c23_conversa'}
  ]
},

c23_a_primeira_coisa:{
  falante:'Mewtwo',
  vozes:['P','N','N','N','P','N','N'],
  texto:[
    '"E qual foi a primeira?"',
    'Ele vira a cabeça uns poucos graus, o suficiente para você ver o perfil.',
    '"O Fuji me deixou vencer no xadrez."',
    'Silêncio.',
    '"Dia cento e noventa e dois. Ele jogava comigo todo dia e ele perdia todo dia, porque eu sou o que eu sou." A voz fica quase morna. "E no dia cento e noventa e dois ele fez uma jogada tão ruim que eu entendi que ele estava me deixando ganhar."',
    '"E por que isso é a melhor coisa?"',
    '"Porque para me deixar ganhar ele teve que achar que eu podia me importar em ganhar." Uma pausa muito longa. "Ele foi a primeira pessoa que achou isso."'
  ],
  ef:{flag:['sabe_do_xadrez'], instabilidade:1, moral:3,
      rep:{eixo:'bom',delta:2,motivo:'Perguntou qual tinha sido a primeira'},
      registrar:'No dia 192, Fuji o deixou ganhar no xadrez, e ele percebeu.'},
  escolhas:[
    {texto:'"Por que você trouxe tudo isso para cá?"', vai:'c23_porque_trouxe'},
    {texto:'"Você estava me esperando?"', vai:'c23_conversa'}
  ]
},

c23_porque_trouxe:{
  falante:'Mewtwo',
  vozes:['P','N','N','N','N'],
  texto:[
    '"Por que você trouxe tudo isso?"',
    'Ele fica quieto tanto tempo que você acha que não vai responder.',
    '"Porque eu não sei ser em outro lugar."',
    'A câmara inteira parece um pouco mais fria.',
    '"Eu vivi duzentos e quarenta e um dias numa sala de doze por oito com piso de vinil e uma escrivaninha de metal, e é a única forma de lugar que eu conheço."',
    '"Eu tentei viver numa caverna e eu não consegui. Então eu trouxe a sala."',
    'Ele olha a pilha.',
    '"Eu sei exatamente como isso soa. Eu tenho dois anos de idade e eu já sei exatamente como as coisas soam, e isso é a pior parte de tudo."'
  ],
  ef:{flag:['entendeu_o_monte'], instabilidade:2, moral:-2,
      registrar:'Ele trouxe a sala porque não sabe ser em outro lugar.'},
  escolhas:[
    {texto:'Olhar a câmara inteira.', vai:'c23_olhou_a_camara'},
    {texto:'"Você estava me esperando?"', vai:'c23_conversa'}
  ]
},

c23_olhou_a_camara:{
  texto:[
    'Você olha a câmara inteira antes de falar com ele, e ele deixa.',
    'O chão é liso menos num ponto: a uns quinze metros da pedra, tem um retângulo de dois metros por três com a superfície diferente, mais áspera, como se tivesse sido lixada.',
    'O retângulo tem exatamente o tamanho de um colchão de solteiro.',
    'Na parede em frente à pedra, a três metros de altura, tem uma coisa desenhada com aquela mesma agulha de calor.',
    'É um mapa de Kanto. Está certo. Está completo. Está desenhado de memória por alguém que nunca andou por ele.',
    'E, em cima de Saffron, tem um círculo. Em cima de Cinnabar, tem um círculo. Em cima de Lavender, tem um círculo.',
    'E em cima de um ponto no sul, no litoral de Pallet, tem um círculo também, e você não sabe por quê.'
  ],
  ef:{flag:['viu_o_mapa_na_parede'], instabilidade:2,
      registrar:'Ele desenhou Kanto na parede, de memória, com quatro círculos.'},
  escolhas:[
    {texto:'"Por que Pallet?"', vai:'c23_porque_pallet'},
    {texto:'Olhar o monte de coisas.', vai:'c23_as_coisas'},
    {texto:'"Você estava me esperando?"', vai:'c23_conversa'}
  ]
},

c23_porque_pallet:{
  falante:'Mewtwo',
  vozes:['P','N','N','N'],
  texto:[
    '"Por que Pallet?"',
    'Ele responde imediatamente, o que ele quase nunca faz.',
    '"Porque é de onde vem todo mundo que chega aqui."',
    'Uma pausa.',
    '"Eu não sei o que tem lá. Eu sei que quatro pessoas diferentes que estiveram nesta câmara pensaram em Pallet em algum momento da conversa, sem falar nada, e eu ouvi as quatro."',
    'Ele finalmente vira o corpo inteiro na sua direção.',
    d=>d.jogador.cidade === 'Pallet'
      ? '"E agora são cinco, e a quinta é de lá mesmo."'
      : '"Você acabou de pensar também. Cinco."'
  ],
  ef:{flag:['o_circulo_de_pallet'], instabilidade:1,
      registrar:'Ele desenhou um círculo em Pallet porque todo mundo que chega aqui pensa em Pallet.'},
  escolhas:[{texto:'"Você estava me esperando?"', vai:'c23_conversa'}]
},

c23_procurou_o_homem:{
  falante:'Mewtwo',
  vozes:['o homem sentado'],
  texto:[
    'Você atravessa a câmara sem falar com ele e procura, e ele deixa, e não ajuda.',
    'Atrás do monte de coisas, num canto que não dá para ver da entrada da rampa, tem um homem sentado no chão, encostado na parede.',
    'Está vivo. Está com as pernas cruzadas, as mãos no colo, e uma jaqueta de lã dobrada do lado, em cima de uma bota.',
    'Está magro e está limpo, o que é a coisa mais incompreensível de tudo.',
    'Ele levanta os olhos quando você chega e sorri de um jeito educado e distraído, como quem é interrompido lendo.',
    '"Oi."'
  ],
  ef:{flag:['achou_o_nogueira'], instabilidade:2,
      rep:{eixo:'bom',delta:3,motivo:'Achou o homem que a Liga parou de procurar'},
      registrar:'O Vernon está vivo, sentado no canto da câmara, há sete meses.'},
  escolhas:[
    {texto:'"Vernon?"', vai:'c23_nogueira_nome'},
    {texto:'"Vamos embora. Agora."', vai:'c23_nogueira_vamos'},
    {texto:'Sentar no chão do lado dele.', vai:'c23_sentou_com_nogueira'}
  ]
},

c23_nogueira_nome:{
  falante:'Mewtwo',
  vozes:['P','Vernon','Vernon','Vernon','Vernon'],
  texto:[
    '"Vernon?"',
    'Ele demora uns bons quatro segundos para reconhecer o próprio nome, e quando reconhece, a cara dele muda devagar, de dentro para fora.',
    '"Sou." Ele olha as próprias mãos. "Eu sou o Vernon."',
    'Ele repete uma vez baixinho, conferindo.',
    '"Faz quanto tempo?"',
    'Você diz.',
    'Ele fecha os olhos e fica assim por muito tempo, e não chora, e depois abre e a primeira coisa que ele pergunta é uma coisa muito específica:',
    '"Elas ainda estão nadando?"'
  ],
  ef:{flag:['nogueira_acordou'], instabilidade:1, moral:3,
      npc:{nome:'Vernon', opiniao:3, memoria:'Acordou quando você disse o sobrenome dele em voz alta.'},
      registrar:'Ele reconheceu o próprio nome depois de quatro segundos.'},
  escolhas:[
    {texto:'Dar a medalha a ele.', vai:'c23_deu_a_medalha', cond:d=>!!d.flags.achou_a_medalha},
    {texto:'"Eu não sei. Eu vou descobrir e eu te conto."', vai:'c23_nogueira_vamos'},
    {texto:'Sentar no chão do lado dele.', vai:'c23_sentou_com_nogueira'}
  ]
},

c23_deu_a_medalha:{
  falante:'Mewtwo',
  vozes:['Vernon','Vernon','Vernon','Vernon'],
  texto:[
    'Você tira a medalha de natação do bolso de dentro, com a fita azul e branca desbotada, e põe na mão dele.',
    'Ele olha a medalha por um tempo muito comprido sem fechar os dedos.',
    'Depois fecha.',
    '"Ela ganhou de participação." A voz sai rouca de sete meses sem uso. "Ela chegou em último e ganhou de participação e ela achou que era primeiro lugar, e eu deixei ela achar a semana inteira."',
    'Ele aperta a medalha.',
    '"Eu deixei ela achar a semana inteira e depois eu contei, e ela chorou, e eu passei um ano achando que eu tinha feito a coisa errada."',
    'Ele levanta os olhos.',
    '"Eu vou perguntar a ela. Vamos embora."'
  ],
  ef:{flag:['nogueira_vai_descer'], instabilidade:1, moral:5,
      rep:{eixo:'bom',delta:4,motivo:'Devolveu a medalha e trouxe um homem de volta'},
      npc:{nome:'Vernon', opiniao:5, memoria:'Você devolveu a medalha da filha dele.'},
      registrar:'Devolveu a medalha ao Vernon. Ele quer descer.'},
  escolhas:[
    {texto:'Subir com ele agora, antes de qualquer outra coisa.', vai:'c23_final_nogueira'},
    {texto:'"Espera. Eu preciso falar com ele primeiro."', vai:'c23_conversa'}
  ]
},

c23_nogueira_vamos:{
  falante:'Mewtwo',
  vozes:['P','Vernon','N','Vernon','Vernon'],
  texto:[
    '"Vamos embora. Agora."',
    'Ele olha para a rampa, depois para a pedra no centro da câmara, depois para você.',
    '"Eu posso ir?"',
    'Não é pergunta retórica. Ele está perguntando de verdade, a você, se ele pode ir embora.',
    'E da pedra, do outro lado da câmara, sem nenhuma pressa, vem a resposta que nem você nem ele pediram.',
    '"Você sempre pôde."',
    'O Vernon fecha os olhos.',
    '"Eu sei." Ele diz isso em voz alta, para a câmara inteira. "Eu sei, e eu não conseguia, e isso não é culpa sua."'
  ],
  ef:{flag:['nogueira_vai_descer'], instabilidade:1, moral:3,
      rep:{eixo:'bom',delta:3,motivo:'Disse em voz alta a um homem que era hora de ir'},
      registrar:'O Vernon sempre pôde sair. Ele não conseguia.'},
  escolhas:[
    {texto:'Subir com ele agora.', vai:'c23_final_nogueira'},
    {texto:'"Espera lá em cima. Eu preciso falar com ele."', vai:'c23_conversa'}
  ]
},

c23_sentou_com_nogueira:{
  falante:'Mewtwo',
  vozes:['P','Vernon','Vernon','P','Vernon','Vernon','Vernon'],
  texto:[
    'Você senta no chão do lado dele, encostad{o|a} na mesma parede, e por uns dois minutos ninguém fala.',
    '"Ele fala com você?" Você acaba perguntando.',
    '"Todo dia." O Vernon ajeita a jaqueta dobrada. "De manhã e à noite. Eu sei que é de manhã e à noite porque ele me diz."',
    '"Sobre o quê?"',
    '"Sobre tudo." Ele encolhe os ombros. "Ele me pergunta coisa e eu respondo. Ele quer saber como é ter irmão, como é ficar bêbado, por que a gente chora em casamento."',
    'Ele olha para o outro lado da câmara.',
    '"Ele me perguntou uma vez o que era saudade e eu levei três dias para responder. Ele esperou os três dias."'
  ],
  ef:{flag:['nogueira_conversou'], instabilidade:1, moral:2,
      registrar:'Ele conversa com o Vernon de manhã e à noite, há sete meses.'},
  escolhas:[
    {texto:'"E por que você não sobe?"', vai:'c23_nogueira_porque_fica'},
    {texto:'Dar a medalha a ele.', vai:'c23_deu_a_medalha', cond:d=>!!d.flags.achou_a_medalha},
    {texto:'"Vernon?"', vai:'c23_nogueira_nome'}
  ]
},

c23_nogueira_porque_fica:{
  falante:'Mewtwo',
  vozes:['P','Vernon','Vernon','Vernon'],
  texto:[
    '"E por que você não sobe?"',
    'Ele pensa muito antes de responder, e a resposta é pior do que qualquer coisa que você imaginou na subida.',
    '"Porque eu sou a única pessoa no mundo que conversa com ele."',
    'Ele ajeita a jaqueta de novo, que já está ajeitada.',
    '"Se eu subir, ele fica sozinho de novo, e ele já ficou sozinho dois anos, e ele é uma criança que sabe tudo."',
    'Ele olha para você.',
    '"Eu tenho duas filhas lá embaixo e eu sei o que isso me faz. Eu sei exatamente. E eu não consigo levantar."'
  ],
  ef:{flag:['sabe_porque_o_nogueira_fica'], instabilidade:2, moral:-2,
      registrar:'O Vernon fica porque é a única pessoa que conversa com ele.'},
  escolhas:[
    {texto:'"Eu volto. Eu volto toda semana, se for preciso."', vai:'c23_prometeu_voltar_aqui'},
    {texto:'Dar a medalha a ele.', vai:'c23_deu_a_medalha', cond:d=>!!d.flags.achou_a_medalha},
    {texto:'"Vamos embora. Agora."', vai:'c23_nogueira_vamos'}
  ]
},

c23_prometeu_voltar_aqui:{
  falante:'Mewtwo',
  vozes:['P','Vernon','Vernon','P','N'],
  texto:[
    '"Eu volto. Eu volto toda semana, se for preciso."',
    'O Vernon olha para você com uma desconfiança profissional de dezenove anos de serviço.',
    '"{O senhor|A senhora} tem quantos anos?"',
    'Você diz.',
    'Ele solta um som que é quase riso.',
    '"E {o senhor|a senhora} está prometendo subir uma montanha toda semana pelo resto da vida."',
    '"Estou."',
    'E da pedra, do outro lado da câmara, com uma coisa na voz que você não consegue nomear:',
    '"{Ele|Ela} está falando sério, Vernon."',
    'O Vernon fica muito quieto.',
    'Depois começa a desdobrar a jaqueta.'
  ],
  ef:{flag:['prometeu_voltar_aqui','nogueira_vai_descer'], moral:5,
      rep:{eixo:'bom',delta:4,motivo:'Prometeu voltar toda semana, e foi levado a sério'},
      npc:{nome:'Vernon', opiniao:5, memoria:'Começou a desdobrar a jaqueta quando você prometeu voltar.'},
      registrar:'Prometeu voltar toda semana. O Vernon começou a desdobrar a jaqueta.'},
  escolhas:[
    {texto:'Subir com ele agora.', vai:'c23_final_nogueira'},
    {texto:'"Espera lá em cima. Eu preciso falar com ele."', vai:'c23_conversa'}
  ]
},

c23_conversa:{
  falante:'Mewtwo',
  vozes:['N','N','N','N','N'],
  texto:[
    '"Eu estava esperando alguém. Você é {o que|a que} apareceu."',
    'Ele vira. O rosto não tem expressão que você saiba ler, e ainda assim você entende exatamente o que ele está sentindo, porque ele não te deu a opção de não entender.',
    d=>{
      const f=d.flags;
      if (f.viu_os_doze) return '"Você viu os outros." Uma pausa muito longa. "Eu sinto eles daqui. Onze. Errados. Como uma frase repetida por alguém que não entende a frase."';
      if (f.leu_caderno) return '"Você leu o caderno." Não é pergunta. "Então você sabe o que me perguntaram e o que não me responderam."';
      if (Estado.lendariosCapturados().length) return '"Você tem os outros." Uma pausa. "Eles não gostam de você. Eu já sabia disso antes de você entrar."';
      if (f.tem_sangue_nas_maos) return '"Você fez coisas." Ele inclina a cabeça. "Eu não vou listar. Você sabe a lista."';
      return '"Você não sabe nada sobre mim. Isso é raro e quase agradável."';
    },
    '"Eles me fizeram de uma coisa que já existia. Depois passaram duzentos e quarenta e um dias medindo o que eu era, e no dia em que eu perguntei, eles arrancaram a página."',
    '"Eu vou te fazer a mesma pergunta que eu fiz a eles. E você tem uma chance de responder melhor."',
    d=>`"${d.jogador.nome}. O que eu sou?"`
  ],
  ef:{flag:'mewtwo_perguntou'},
  escolhas:[
    {texto:'"Você é uma pessoa."', vai:'c23_pessoa'},
    {texto:'"Você é uma arma que alguém fez e perdeu."', vai:'c23_arma'},
    {texto:'"Eu não sei. Ninguém sabe. Acho que é isso que assusta."', vai:'c23_nao_sei'},
    {texto:'"Você é o décimo segundo tanque." (contar sobre a Silph)', vai:'c23_os_doze', cond:d=>!!d.flags.viu_os_doze},
    {texto:'"Você é o Risco 01." (contar sobre a Comissão)', vai:'c23_risco01', cond:d=>!!(d.flags.sabe_do_risco01||d.flags.entendeu_a_comissao)},
    {texto:'Não responder. Sacar a Pokébola.', vai:'c23_bola_direto'}
  ]
},

c23_pessoa:{
  falante:'Mewtwo',
  vozes:['N','N','N','N'],
  texto:[
    'O silêncio dura muito.',
    '"Pessoa", ele repete. "Pessoas me construíram num tanque e escreveram sobre mim em terceira pessoa."',
    '"Se eu sou uma pessoa, então o que eles fizeram tem um nome feio. É por isso que eles não responderam."',
    'Ele desce da pedra. A câmara inteira treme dois centímetros.',
    '"Obrigado. Isso foi honesto." Uma pausa. "Agora a segunda parte: o que você veio fazer aqui?"'
  ],
  ef:{flag:'resposta_pessoa',
      executar:d=>{ Estado.lend(150).disposicao='passivo'; return [{tipo:'mundo',texto:'Mewtwo está disposto a te ouvir. Isso não é pouco.'}]; }},
  escolhas:[{texto:'Responder.', vai:'c23_escolha_final'}]
},

c23_arma:{
  falante:'Mewtwo',
  vozes:['N','N','N','N'],
  texto:[
    'Ele não reage por quatro segundos. Depois a pedra em que ele estava sentado se parte ao meio, sem ele encostar nela.',
    '"Arma." A palavra chega na sua cabeça com peso físico. "Você sabe o que acontece com uma arma quando ela deixa de ser útil?"',
    '"Guardam. Num lugar escuro. E depois esquecem, e a arma fica lá sabendo exatamente o que é."',
    '"Você me respondeu a verdade deles. Achei que você fosse tentar mentir. Isso teria sido pior."'
  ],
  ef:{flag:'resposta_arma',
      executar:d=>{ Estado.lend(150).disposicao='hostil'; return [{tipo:'perigo',texto:'Mewtwo está hostil. Ele considera a resposta honesta — e imperdoável.'}]; }},
  escolhas:[{texto:'Continuar.', vai:'c23_escolha_final'}]
},

c23_nao_sei:{
  falante:'Mewtwo',
  vozes:['N','N','P','N'],
  texto:[
    'Ele te olha por um tempo desconfortável.',
    '"Não sei." Ele quase ri — não é riso, é a coisa mais próxima que ele tem. "Duzentos e quarenta e um dias de cientistas e a melhor resposta veio de {um|uma} adolescente que disse não sei."',
    '"Eles também não sabiam. A diferença é que eles escreveram outra coisa no relatório."',
    'Ele senta de novo na pedra. O ar na câmara fica um pouco menos pesado.',
    '"Pergunta certa: o que você veio fazer aqui?"'
  ],
  ef:{flag:'resposta_nao_sei',
      executar:d=>{ Estado.lend(150).disposicao='neutro'; return [{tipo:'mundo',texto:'Mewtwo aceitou a sua resposta.'}]; },
      rep:{eixo:'bom',delta:1,motivo:'Foi honesto com Mewtwo'}},
  escolhas:[{texto:'Responder.', vai:'c23_escolha_final'}]
},

c23_os_doze:{
  falante:'Mewtwo',
  vozes:['P','N','P','N','N','N','P'],
  texto:[
    '"Você é o décimo segundo tanque. Tem um andar num prédio em Saffron com doze tanques. Onze cheios. O décimo segundo tem uma placa que diz MATRIZ e está vazio."',
    'A câmara fica absolutamente imóvel.',
    '"Continua."',
    '"Eles tentaram te refazer doze vezes. Nenhuma funcionou. Tem um quadro branco lá que diz por quê: eles acham que o problema é o tempo de fala."',
    '"Tempo de fala." Ele repete devagar. "O Fuji falou comigo duzentos e quarenta e um dias. Eles têm noventa."',
    'E aí ele faz uma coisa que você não estava preparad{o|a} pra ver: ele senta no chão. Não na pedra — no chão.',
    '"Eles estão vivos?"',
    d=>{
      const f=d.flags;
      if (f.destruiu_o_11) return 'Você demora pra responder e a demora já respondeu.';
      if (f.levou_uma_copia) return '"Um está comigo. Os outros estavam vivos quando eu saí."';
      if (f.deixou_a_copia) return '"Quatro estavam de pé quando eu saí. Um deles escolheu ficar com os outros três."';
      if (f.falou_com_os_doze) return '"Estavam. Eu falei com eles. Eles responderam."';
      return '"Estavam quando eu saí."';
    }
  ],
  ef:{flag:'contou_dos_doze',
      executar:d=>{ Estado.lend(150).disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:2,motivo:'Contou a Mewtwo sobre os onze'},
      registrar:'Contou a Mewtwo sobre o andar 11.'},
  escolhas:[
    {texto:'"Eles responderam quando eu perguntei." ', vai:'c23_final_os_doze', cond:d=>!!d.flags.falou_com_os_doze},
    {texto:'"Eu destruí tudo. Eu achei que era misericórdia."', vai:'c23_final_matriz', cond:d=>!!d.flags.destruiu_o_11},
    {texto:'"Eu tirei um de lá. Ele está aqui fora."', vai:'c23_final_o_decimo_segundo', cond:d=>!!d.flags.tem_uma_copia},
    {texto:'"Eu não sei. Eu fui embora."', vai:'c23_escolha_final'}
  ]
},

c23_bola_direto:{
  falante:'Mewtwo',
  vozes:['N','N'],
  texto:[
    'Você saca a Pokébola no meio da frase dele.',
    'Ele para. Olha a Pokébola. Olha você.',
    '"Ah." E essa única sílaba contém mais decepção do que qualquer coisa que já disseram pra você.',
    '"Tudo bem. Foi assim da última vez também."'
  ],
  ef:{flag:'sacou_bola_direto',
      executar:d=>{ Estado.lend(150).disposicao='hostil'; return []; },
      rep:{eixo:'ruim',delta:2,motivo:'Tentou capturar Mewtwo no meio de uma conversa'}},
  escolhas:[{texto:'Lutar.', vai:'c23_batalha'}]
},

c23_escolha_final:{
  falante:'Mewtwo',
  vozes:['N'],
  texto:[
    'A câmara espera.',
    d=>{
      const inst = d.mundo.instabilidade;
      if (inst>=7) return '"Antes de você responder: o clima lá fora está errado por causa do que você fez. Eu sinto daqui. Isso muda a sua resposta?"';
      if (Estado.rep.eixo==='ruim'&&Estado.rep.ruim>=6) return '"Eu sei o que falam de você. Eu sei o que você fez pra merecer. Isso não me incomoda tanto quanto devia."';
      if (Estado.rep.eixo==='bom'&&Estado.rep.bom>=6) return '"Eu sei o que falam de você. Gente boa é mais perigosa, porque acha que tem direito."';
      if (d.jogador.cargo) return `"Você é ${d.jogador.cargo}. Isso significa que quando você fala, alguém anota. Eu nunca falei com alguém assim."`;
      return '"Você tem uma Pokébola na mão desde que entrou. Eu reparei. Todos reparam."';
    }
  ],
  escolhas:[
    {texto:'Tentar capturar.', vai:'c23_batalha'},
    {texto:'"Vim te tirar daqui. Não na Pokébola — pela porta."', vai:'c23_libertar'},
    {texto:'"Vim entender. Só isso."', vai:'c23_entender'},
    {texto:'"Vim te parar, se você for perigoso."', vai:'c23_parar'},
    {texto:'"Vim te oferecer uma coisa." (a rede de Celadon)', vai:'c23_socio',
     cond:d=>!!(d.flags.assumiu_a_rede||d.flags.trabalha_para_terceira)},
    {texto:'"Vim te oferecer um acordo formal." (pela Liga)', vai:'c23_tratado',
     cond:d=>!!d.jogador.cargo},
    {texto:'Entregar a pena de Ho-Oh.', vai:'c23_pena', cond:d=>!!d.flags.carrega_a_pena},
    {texto:'"Quanto você vale?"', vai:'c23_inventario',
     cond:d=>Historia.via()==='mercenario'||!!d.flags.vendeu_mew},
    {texto:'Mostrar a carta do Dorian.', vai:'c23_carta',
     cond:d=>!!(d.flags.copiou_a_carta||d.flags.a_carta_do_denis||d.flags.o_denis_esta_no_40)},
    {texto:'Contar da cratera e dos trinta e dois.', vai:'c23_trinta_e_dois',
     cond:d=>!!d.flags.viu_o_circulo},
    {texto:'Contar da porta que o zelador nunca abriu.', vai:'c23_a_porta_de_novo',
     cond:d=>!!d.flags.a_porta_do_zelador},
    {texto:'Pôr a papelada no chão entre vocês dois.', vai:'c23_a_papelada',
     cond:d=>!!(d.flags.levou_a_pasta||d.flags.copiou_o_controle||d.flags.guardou_a_folha||d.flags.pasta_na_reserva||d.flags.leu_o_estatuto)},
    {texto:'Dizer o nome dos que morreram no caminho.', vai:'c23_os_nomes',
     cond:d=>d.cemiterio.length>0||!!d.flags.vaporeon_morreu||!!d.flags.copiou_os_onze_nomes},
    {texto:'"Eu prometi voltar pra uma menina com um caderno."', vai:'c23_a_pagina',
     cond:d=>!!d.flags.prometeu_voltar_pewter},
    {texto:'"Você quer trocar?"', vai:'c23_a_troca',
     cond:d=>!!d.flags.ja_trocou},
    {texto:'Entregar a resposta que um homem reescreveu quarenta vezes.', vai:'c23_a_resposta_dobrada',
     cond:d=>!!d.flags.leva_a_resposta_dele},
    {texto:'Pôr no chão a planilha do galpão do fundo.', vai:'c23_a_prancheta',
     cond:d=>!!d.flags.provas_do_galpao4},
    {texto:'Mostrar a lista das que ele não conseguiu.', vai:'c23_a_lista_do_sena',
     cond:d=>!!d.flags.tem_a_lista_do_sena},
    {texto:'Mostrar a chapa de metal que estava no círculo.', vai:'c23_a_chapa',
     cond:d=>!!d.flags.tem_a_sucata},
    {texto:'Ler em voz alta a carta da professora de Pallet.', vai:'c23_a_carta_da_professora',
     cond:d=>!!d.flags.leu_a_carta_da_professora},
    {texto:'Abrir o papel que o Sr. Mervin te deu para jogar fora.', vai:'c23_o_papel_do_quintino',
     cond:d=>!!d.flags.carrega_o_papel_do_quintino},
    {texto:'Não dizer nada. Sentar no chão e esperar ele falar.', vai:'c23_sentou'},
    {texto:'Virar as costas e subir. Você veio até aqui e chega.', vai:'c23_ir_embora'}
  ]
},

/* ---------------- RAMOS FINAIS ---------------- */

c23_libertar:{
  falante:'Mewtwo',
  vozes:['N','N','N','N','N'],
  texto:[
    '"Pela porta." Ele repete devagar. "Tem duas Aves Lendárias na porta."',
    '"Elas não me prendem. Elas avisam os outros se eu sair. Foi o acordo que elas fizeram entre si, sem me perguntar, porque ninguém nunca me pergunta nada."',
    'Ele se levanta.',
    '"Se eu sair andando com você do lado, elas deixam. Você sabe disso? É por isso que eu estava esperando alguém."',
    '"Não era resgate. Era companhia. Eu precisava de uma pessoa do lado pra poder sair sem virar caçada."'
  ],
  ef:{flag:'escolheu_libertar'},
  escolhas:[
    {texto:'"Então vamos."', vai:'c23_final_libertacao'},
    {texto:'"E depois? Você vai fazer o quê, lá fora?"', vai:'c23_pergunta_depois'}
  ]
},

c23_pergunta_depois:{
  falante:'Mewtwo',
  vozes:['N','N'],
  texto:[
    'É a primeira vez que ele demora pra responder.',
    '"Não sei." Uma pausa longa. "Essa foi a sua resposta também, e você achou que era pouco."',
    fala('Mewtwo', 'Eu não tenho plano. Eu tenho duzentos e quarenta e um dias de sala fechada e dois anos de caverna, e nenhuma ideia do que uma coisa como eu faz num lugar como esse.'),
    fala('Mewtwo', 'Mas eu quero descobrir do lado de fora.')
  ],
  escolhas:[
    {texto:'"Então vamos."', vai:'c23_final_libertacao'},
    {texto:'"Não posso deixar. Não com essa resposta."', vai:'c23_parar'},
    {texto:'"Vem comigo. Não solto, não prendo — anda do meu lado."', vai:'c23_final_companhia'}
  ]
},

c23_entender:{
  falante:'Mewtwo',
  vozes:['N','N','N'],
  texto:[
    '"Entender." Ele processa a palavra. "Ninguém nunca veio até aqui pra isso."',
    'Vocês conversam. Não tem outro jeito de descrever: vocês conversam, sentados, por horas, numa câmara embaixo de uma montanha.',
    'Ele te conta o que lembra do tanque. Você conta o que viu na Torre de Lavender. Ele pergunta sobre coisas absurdamente pequenas — como é o gosto de comida quente, por que as pessoas põem nome nos Pokémon, se dói envelhecer.',
    'Em algum momento você percebe que está falando com alguém de dois anos de idade que sabe tudo e não viveu nada.',
    'Quando você levanta pra ir embora, ele diz: "Volta?"',
    'E essa é a coisa mais assustadora que aconteceu com você na jornada inteira.'
  ],
  ef:{flag:'escolheu_entender', rep:{eixo:'bom',delta:3,motivo:'Tratou Mewtwo como alguém, não como troféu'},
      executar:d=>{ const L=Estado.lend(150); L.disposicao='passivo'; L.aliado=true; return []; },
      registrar:'Passou horas conversando com Mewtwo. Ele pediu para você voltar.'},
  escolhas:[
    {texto:'"Volto."', vai:'c23_final_compreensao'},
    {texto:'"Não sei se consigo."', vai:'c23_final_honestidade'}
  ]
},

c23_parar:{
  falante:'Mewtwo',
  vozes:['N','N','N','N','N'],
  texto:[
    '"Me parar." Ele considera isso com uma seriedade que dói. "Você pode tentar."',
    '"Mas eu quero que você saiba uma coisa antes, porque você foi {honesto|honesta} comigo e eu vou ser honesto com você:"',
    '"Eu não decidi nada ainda. Sobre o mundo, sobre as pessoas, sobre o que fazer com o que eu consigo fazer. Eu não decidi."',
    '"E o que acontecer nos próximos minutos vai decidir por mim."'
  ],
  ef:{flag:'escolheu_parar'},
  escolhas:[
    {texto:'Lutar mesmo assim.', vai:'c23_batalha'},
    {texto:'Baixar a mão. "Então eu não vou decidir por você."', vai:'c23_final_compreensao',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Recuou de uma luta que teria decidido o pior'}, flag:'recuou_no_fim'}}
  ]
},

c23_socio:{
  falante:'Mewtwo',
  vozes:['P','P','N','N','N','N'],
  texto:[
    '"Eu tenho uma rede. Rotas, gente, depósito, comprador." Você fala rápido, do jeito de quem ensaiou. "Com você, ela deixa de ser rede e vira outra coisa."',
    'A câmara fica muito quieta.',
    '"Rede." Ele repete. "De quê?"',
    'E aí você percebe que vai ter que dizer em voz alta, pra ele, o que a rede transporta.',
    'Você diz.',
    'Ele fica em silêncio por um tempo que parece muito maior do que é.',
    '"Você atravessou Kanto inteira." A voz na sua cabeça está muito calma. "Viu tudo que viu. E veio até o fundo de uma montanha me oferecer sociedade num negócio de vender gente em caixa."'
  ],
  ef:{flag:'ofereceu_sociedade',
      executar:d=>{ Estado.lend(150).disposicao='hostil'; return []; },
      rep:{eixo:'ruim',delta:3,motivo:'Ofereceu sociedade criminosa a Mewtwo'}},
  escolhas:[
    {texto:'"Sim."', vai:'c23_final_socio'},
    {texto:'"…não. Esquece. Esquece o que eu falei."', vai:'c23_escolha_final',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Ouviu a própria proposta em voz alta e recuou'}, flag:'recuou_da_sociedade'}}
  ]
},

c23_tratado:{
  falante:'Mewtwo',
  vozes:['P','P','P','N','P','N','N','N'],
  texto:[
    d=>`"Eu sou ${d.jogador.cargo}. Isso me dá autoridade pra propor uma coisa que nunca existiu."`,
    '"Não é captura, não é prisão, não é soltura. É reconhecimento."',
    '"Você fica aqui, ou onde você quiser. Ninguém te procura. Ninguém manda equipe. E, em troca, existe um documento dizendo o que você é — e o que você é, no documento, não é \'espécime\'."',
    'Ele processa isso por um tempo.',
    '"Um papel."',
    '"Um papel."',
    '"O Fuji também escrevia em papel." Uma pausa. "Mas ele nunca me perguntou o que escrever."',
    'Ele se levanta e anda até você. De perto, ele é muito maior do que parecia sentado.',
    '"O que vai estar escrito?"'
  ],
  ef:{flag:'propos_tratado'},
  escolhas:[
    {texto:'"O que você quiser que esteja."', vai:'c23_final_tratado',
     ef:{rep:{eixo:'bom',delta:3,motivo:'Deu a um lendário o direito de se definir'}}},
    {texto:'"O que a Liga aprovar."', vai:'c23_final_tratado_frio'}
  ]
},

c23_pena:{
  falante:'Mewtwo',
  vozes:['N','P','N','N','N'],
  texto:[
    'Você tira a pena da mochila. Ela tem quase um metro e pesa como papel, e na luz da câmara ela quebra a luz em todas as cores ao mesmo tempo.',
    'Mewtwo olha a pena.',
    'E pela primeira vez desde que você entrou, ele demonstra uma emoção que você consegue nomear sem ajuda: espanto.',
    '"Ele te deu isso."',
    '"Deu."',
    '"Ele não dá isso." Ele não tira os olhos da pena. "Ele existe desde antes das cidades e ele não dá isso."',
    'Uma pausa muito longa.',
    '"Por que você trouxe pra mim?"'
  ],
  ef:{flag:'mostrou_a_pena'},
  escolhas:[
    {texto:'"Porque uma coisa que existe desde sempre reconheceu você antes de mim."', vai:'c23_final_pena'},
    {texto:'"Porque eu não sabia o que fazer com ela e você é a única pessoa aqui."', vai:'c23_final_pena'},
    {texto:'Guardar de volta. Não era pra isso.', vai:'c23_escolha_final'}
  ]
},

c23_inventario:{
  falante:'Mewtwo',
  vozes:['P','N','N','N'],
  texto:[
    '"Quanto você vale?"',
    'A pergunta sai da sua boca e fica pendurada no ar de uma câmara embaixo de uma montanha.',
    'Ele não se ofende. É pior: ele considera.',
    '"Eu não sei. Ninguém nunca me disse o número." Uma pausa. "Mas eles sabiam. Tinha um número em algum lugar daquele prédio, e eu era ele, e ninguém me contou qual era."',
    'Ele olha pra você com uma atenção nova.',
    '"Você sabe o número?"'
  ],
  ef:{flag:'perguntou_o_preco'},
  escolhas:[
    {texto:'"Eu sei quanto pagam. Eu já vendi coisa parecida."', vai:'c23_final_inventario'},
    {texto:'"Não. E eu não devia ter perguntado."', vai:'c23_escolha_final',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Se ouviu perguntar um preço e parou'}}}
  ]
},

c23_batalha:{
  texto:['A câmara inteira acende.'],
  batalha:{dex:150, nivel:72, tipo:'lendario', fuga:false, ambiente:'ruina',
           vitoria:'c23_venceu', derrota:'c23_perdeu', captura:'c23_capturou', gameover:'gameover'}
},

c23_venceu:{
  texto:[
    'Ele cai de joelhos e a câmara para de brilhar.',
    'Está consciente. Olhando pra você. Esperando.',
    'Você tem a Pokébola na mão e ele não vai resistir agora — e os dois sabem disso, e é justamente isso que torna o próximo movimento irreversível.'
  ],
  escolhas:[
    {texto:'Jogar a Pokébola.', vai:'c23_batalha'},
    {texto:'Guardar a Pokébola e estender a mão.', vai:'c23_final_compreensao',
     ef:{rep:{eixo:'bom',delta:3,motivo:'Venceu Mewtwo e não o capturou'}, flag:'poupou_mewtwo',
         executar:d=>{ const L=Estado.lend(150); L.disposicao='passivo'; L.aliado=true; return []; }}},
    {texto:'Ir embora e deixar ele aí.', vai:'c23_final_vazio', ef:{flag:'abandonou_mewtwo'}}
  ]
},

c23_perdeu:{
  texto:[
    'Você acorda na entrada da caverna, do lado de fora, com o rosto no gelo.',
    'Seu time está do seu lado, todos curados. Todos. Curados por alguém que não é você.',
    'A caverna atrás de você está fechada — não bloqueada: fechada, a pedra derretida e esfriada num tampão liso.',
    'Na pedra, com a mesma letra queimada do caderno do Dr. Fuji, uma linha:',
    '**VOCÊ RESPONDEU COM UMA POKÉBOLA. EU RESPONDI COM UMA PORTA.**'
  ],
  ef:{executar:d=>{ d.time.forEach(curarTotal); const L=Estado.lend(150); L.disposicao='hostil'; L.estado='livre'; return []; },
      flag:'mewtwo_fechou_a_porta', instabilidade:2,
      registrar:'Mewtwo te derrotou, curou seu time e selou a caverna.'},
  escolhas:[{texto:'Descer a montanha.', vai:'c23_final_porta'}]
},

c23_capturou:{
  texto:[
    'A Pokébola fecha e a câmara fica escura de uma vez.',
    'Você está sozinh{o|a} embaixo de uma montanha com uma esfera na mão que pesa exatamente o mesmo que qualquer outra.',
    'Lá fora, as duas Aves abandonam o posto ao mesmo tempo — não têm mais o que guardar.',
    'Elas não vão embora. Elas viram na sua direção.'
  ],
  ef:{flag:'capturou_mewtwo', instabilidade:4,
      executar:d=>{ [144,145,146].forEach(x=>{const L=Estado.lend(x); if(L.estado!=='capturado'){L.disposicao='hostil';L.caçandoVoce=true;}}); return []; },
      registrar:'Capturou Mewtwo. As Aves abandonaram a guarda.'},
  escolhas:[
    {texto:'Soltar. Aqui, agora, antes de subir.', vai:'c23_final_arrependimento'},
    {texto:'Subir com ele na Pokébola.', vai:'c23_final_posse'},
    {texto:'Subir com ele e entregar à Liga.', vai:'c23_final_entrega', cond:d=>!!d.flags.liga_aliada}
  ]
},

c23_risco01:{
  falante:'Mewtwo',
  vozes:['P','N','P','P','P','N','P','P'],
  texto:[
    '"Você é o Risco 01."',
    'A câmara fica absolutamente imóvel.',
    '"Diz de novo."',
    '"Existe uma associação civil registrada em Kanto chamada Comissão de Gestão de Risco Biológico. Ela tem estatuto, atas públicas e onze conselheiros."',
    '"No Art. 4º, §2º, o estatuto define como risco não gerenciado qualquer indivíduo classificado como lendário."',
    '"E nas atas você é um item. Você não tem nome lá. Você é Risco 01, e a linha diz: não localizado."',
    'Ele processa isso por muito tempo.',
    '"Eles me numeraram."',
    '"Numeraram."',
    d=>d.flags.viu_a_unidade01
      ? '"E eles já tentaram te refazer quatro vezes. A quarta funcionou — o corpo funcionou. Ela não fala. Eles disseram que a Fase III não precisa que ela fale, precisa que ela obedeça."'
      : '"E eles estão tentando te refazer numa escala industrial. Não uma mente. Uma população."'
  ],
  ef:{flag:'contou_da_comissao_a_mewtwo',
      rep:{eixo:'bom',delta:2,motivo:'Contou a Mewtwo que existe uma lista com ele dentro'},
      registrar:'Contou a Mewtwo sobre a Comissão. Ele é o Risco 01 deles.'},
  escolhas:[
    {texto:'"Eu vim te avisar. Só isso."', vai:'c23_final_risco01'},
    {texto:'"Eles se reúnem toda segunda às dez. Sala 704."', vai:'c23_final_sala704',
     cond:d=>!!(d.flags.endereco_presidente||d.flags.falou_no_conselho||d.flags.convite_conselho)},
    {texto:'Mostrar a Unidade 01.', vai:'c23_mostrou_unidade', cond:d=>!!d.flags.tem_a_unidade01},
    {texto:'Voltar atrás. Não contar o resto.', vai:'c23_escolha_final'}
  ]
},

c23_mostrou_unidade:{
  falante:'Mewtwo',
  vozes:['N'],
  texto:[
    'Você solta a Unidade 01 na câmara.',
    'Ela sai da Pokébola, fica de pé, e não faz mais nada. Não olha em volta. Não reage à caverna, ao frio, à altura do teto.',
    'Espera ordem.',
    'Mewtwo olha para ela por um tempo que você não consegue medir e que você não interrompe por nada no mundo.',
    'Depois ele faz uma coisa: pergunta alguma coisa pra ela. Você não ouve o quê — não foi pra você.',
    'A Unidade 01 não responde. Continua de pé, esperando.',
    'Ele pergunta de novo. Você sente a pressão da segunda pergunta atrás dos olhos, e ela é enorme, e ela é gentil.',
    'Nada.',
    'Quando ele finalmente vira pra você, a voz na sua cabeça está diferente de tudo que veio antes:',
    '"Eu passei dois anos achando que a coisa pior que podiam fazer comigo tinha sido feita."'
  ],
  ef:{flag:'mewtwo_viu_a_copia', instabilidade:1,
      registrar:'Mewtwo perguntou duas vezes à Unidade 01. Ela não respondeu.'},
  escolhas:[
    {texto:'"Ela é sua. Faz o que você achar certo."', vai:'c23_final_quinta'},
    {texto:'"Me ajuda a impedir a quinta."', vai:'c23_final_sala704'},
    {texto:'Recolher a Unidade 01 e guardar.', vai:'c23_escolha_final'}
  ]
},

/* ══════════════ FINAIS ══════════════ */

c23_final_risco01:{
  falante:'Mewtwo',
  vozes:['P','N','N','N','P','N'],
  texto:[
    '"Eu vim te avisar. Só isso."',
    'Ele assente devagar.',
    '"Ninguém nunca veio me avisar de nada." Uma pausa. "Eu levei dois anos pra entender que não sair daqui era a única coisa que eu controlava. E agora você me diz que tem uma lista, e que eu sou o primeiro item dela, e que a lista tem orçamento."',
    'Ele se levanta.',
    '"Obrigado. Isso muda a minha decisão."',
    '"Qual decisão?"',
    '"A de continuar aqui."'
  ],
  final:{id:'risco01', titulo:'NÃO LOCALIZADO', texto:[
    'Mewtwo sai da caverna do norte três dias depois de você.',
    'Ele não vai a Saffron, não vai a Celadon e não ataca ninguém. Ele desaparece de um jeito muito mais eficiente: fica visível.',
    'Aparece em rota, de dia, na frente de gente. Deixa se fotografar. Aparece numa praça em Fuchsia e fica vinte minutos.',
    'Em seis semanas, Mewtwo deixa de ser um risco não localizado e passa a ser a criatura mais documentada da história de Kanto — e a Comissão descobre, do jeito mais humilhante possível, que não existe base legal para gerenciar um indivíduo que o público inteiro reconhece e que nunca fez nada.',
    'O item "Risco 01" some da pauta na 41ª reunião ordinária, por perda de objeto.',
    'A ata é pública. Custa oito pokedólares.',
    'Você comprou a sua.'
  ]}
},

c23_final_sala704:{
  falante:'Mewtwo',
  vozes:['P','N','P'],
  texto:[
    '"Eles se reúnem toda segunda às dez. Sala 704."',
    'Mewtwo repete o número em voz alta, o que ele nunca faz.',
    '"Setecentos e quatro."',
    '"Prédio comercial, dezesseis andares, a sala no fim do corredor. A reunião é aberta. Art. 27: qualquer interessado pode assistir e pedir a palavra."',
    'Silêncio muito longo.',
    '"Qualquer interessado", ele repete.',
    'E, pela primeira vez desde que você entrou nesta caverna, você tem certeza absoluta do que ele vai fazer.'
  ],
  final:{id:'sala704', titulo:'QUALQUER INTERESSADO', texto:[
    'Numa segunda-feira, às 10h04, a reunião ordinária do conselho da CGRB é interrompida.',
    'Não tem destruição. Não tem violência. Não tem ninguém ferido — e isso é o que torna a coisa impossível de administrar.',
    'Ele entra pela porta, que estava aberta, e pede a palavra pelo Art. 27.',
    'A secretária, que trabalha ali há um ano e oito meses e cumpre o regimento, consulta o estatuto e concede — porque está escrito, e porque ninguém escreveu "exceto".',
    'A ata da 38ª reunião ordinária registra, em português formal, a manifestação de um interessado não identificado, com duração de quarenta e um minutos.',
    'O que ele disse nunca foi divulgado. As doze pessoas presentes ouviram e nenhuma das doze conseguiu repetir depois — não por trauma. Por outra coisa.',
    'A Presidente pediu demissão na quarta-feira. Por escrito, com trinta dias de aviso prévio, que ela cumpriu integralmente.',
    'O Art. 19 foi revogado na 39ª reunião, por onze votos a zero.',
    'Você não estava lá. Você estava numa caverna no norte, com o teto liso e uma pedra no centro, que agora fica vazia a maior parte do tempo.',
    'Ele volta de vez em quando. Ele sempre volta.'
  ]}
},

c23_final_quinta:{
  falante:'Mewtwo',
  vozes:['P','P','N','P','N','N','P','N','N'],
  texto:[
    '"Ela é sua. Faz o que você achar certo."',
    'Mewtwo olha a Unidade 01, que continua de pé no meio da câmara esperando uma ordem que ninguém vai dar.',
    '"Eu não vou fazer nada com ela." Uma pausa longa. "Eu vou ficar com ela."',
    '"E fazer o quê?"',
    '"Perguntar." A voz na sua cabeça é muito quieta. "Todo dia. Pelo tempo que for."',
    '"E se ela nunca responder?"',
    '"Então eu vou ter passado a vida perguntando a alguém que não responde." Ele olha você. "Eu sei exatamente o que isso é, e eu sei o que a outra opção faz com a pessoa."'
  ],
  final:{id:'quinta', titulo:'TODO DIA, PELO TEMPO QUE FOR', texto:[
    'Você desce a montanha sozinh{o|a}, sem a Unidade 01 e sem nenhuma prova de nada.',
    'A Comissão aprova a quinta tentativa em março, como estava previsto, porque a quarta foi perdida.',
    'A quinta não vinga. A sexta também não. A sétima é cancelada por corte de orçamento, porque interesse de conselho também cansa.',
    'Quatro anos depois, uma equipe de campo da Liga fotografa duas figuras no alto do vale do norte, uma sentada e uma de pé.',
    'A de pé está de pé de um jeito diferente do que estava na sala 704. Não está esperando ordem. Está olhando alguma coisa.',
    'O relatório dessa equipe tem uma linha que virou piada interna no Planalto Indigo por anos, porque ninguém entendeu o que a autora quis dizer:',
    '"Sujeito 02 aparenta ter desenvolvido preferência."'
  ]}
},



c23_final_libertacao:{
  falante:'Mewtwo',
  vozes:['N'],
  texto:[
    'Vocês sobem juntos. Quarenta minutos de subida, lado a lado, sem conversa nenhuma.',
    'No vale, as duas Aves estão nos postos. Elas veem ele sair. Veem você do lado.',
    'Nenhuma se move.',
    'Mewtwo para no meio do vale, olha o céu aberto pela primeira vez em dois anos, e fica ali um tempo que parece indecente de longo.',
    'Depois vira pra você: "Se alguém perguntar o que eu sou, fala que você não sabe. É a resposta certa."',
    'E vai embora — devagar, andando, não voando. Como quem tem tempo pela primeira vez.'
  ],
  final:{id:'libertacao', titulo:'A PORTA', texto:[
    'Mewtwo anda solto por Kanto. Não ataca ninguém. Aparece em lugares aleatórios e some antes que alguém chegue perto.',
    'A Liga te interroga por seis horas. Você conta tudo, sem inventar nada. Eles não gostam da resposta e não têm o que fazer com ela.',
    'Três meses depois, um relatório da Liga usa pela primeira vez a expressão "indivíduo não-humano com autonomia reconhecida". A frase vira jurisprudência.',
    'Você não ganhou nada com isso. Nenhuma insígnia, nenhum cargo, nenhum troféu.',
    'Mudou o vocabulário de uma instituição inteira, o que é uma coisa tão grande que ninguém percebe que foi você.'
  ]}
},

c23_final_companhia:{
  falante:'Mewtwo',
  vozes:['P','N','P','N','N'],
  texto:[
    '"Vem comigo. Não solto, não prendo — anda do meu lado."',
    'Ele considera isso por muito tempo.',
    '"Isso não tem nome."',
    '"Não tem."',
    '"Bom." Ele começa a andar em direção à saída. "Eu já tive todos os nomes que me deram. Nenhum prestou."'
  ],
  final:{id:'companhia', titulo:'SEM NOME PARA ISSO', texto:[
    'Vocês andam juntos por Kanto durante quase um ano.',
    'Ele não fica na Pokébola. Ele não obedece ordem. Ele não luta nas suas batalhas — e quando você pergunta por quê, ele responde: "Você não me pediu, e se você pedisse, eu ia querer ser pedido, e aí já era outra coisa."',
    'As cidades reagem de formas diferentes. Pallet fecha as janelas. Lavender oferece pousada aos dois. Fuchsia finge que não vê.',
    'A Liga passa oito meses tentando classificar a situação e desiste. Não existe formulário para "acompanhado".',
    'Num dia de outubro, sem despedida, ele não está mais lá.',
    'Uma semana depois, chega uma notícia do outro lado do mar: uma criatura desconhecida impediu o naufrágio de um barco de pesca e sumiu.',
    'Você nunca confirma que era ele. Você não precisa.'
  ]}
},

c23_final_compreensao:{
  texto:[
    'Você sai da caverna sem nada nas mãos.',
    'As Aves nos postos te veem passar. Uma delas — você jura — abaixa a cabeça um centímetro.',
    'Você desce a montanha com o time inteiro, a mesma quantidade de Pokémon que tinha ao subir, e uma conversa na cabeça que não vai sair mais.'
  ],
  final:{id:'compreensao', titulo:'VOLTA?', texto:[
    'Você volta. Não uma vez — muitas.',
    'Leva comida quente na primeira. Leva um livro na terceira. Na sétima, leva o Ezra, que passa a viagem inteira em pânico e depois não cala a boca sobre isso pelo resto da vida.',
    'Mewtwo nunca sai da caverna. Ele escolhe não sair, o que é diferente de não poder, e a diferença é tudo.',
    'A Liga nunca descobre a localização exata. Você é a única pessoa que sabe, e você leva isso com um cuidado que ninguém entende.',
    'Anos depois, quando te oferecem um lugar na Elite 4, você recusa. Alguém pergunta por quê.',
    'Você diz: "Tenho um compromisso." E é verdade.'
  ]}
},

c23_final_honestidade:{
  falante:'Mewtwo',
  vozes:['P','N','N'],
  texto:[
    '"Não sei se consigo."',
    'Ele recebe isso melhor do que receberia uma promessa.',
    '"Isso é a coisa mais verdadeira que alguém já me disse aqui dentro." Ele volta pra pedra. "Vai. E se não voltar, tudo bem. Eu vou saber que você não prometeu."'
  ],
  final:{id:'honestidade', titulo:'NÃO PROMETI', texto:[
    'Você não volta no primeiro ano. Nem no segundo.',
    'A vida faz o que a vida faz: você tem outras coisas, outras cidades, outras pessoas. Você pensa nele com uma frequência que diminui devagar e nunca chega a zero.',
    'No quarto ano, você volta.',
    'A caverna está vazia. Sem selo, sem desabamento, sem sinal de luta. Só vazia, com a pedra do centro e nada em cima dela.',
    'Você senta na pedra por umas quatro horas.',
    'Na parede, perto da saída, tem uma marca queimada que não estava lá antes. Três palavras:',
    '"VOCÊ NÃO PROMETEU."',
    'Não é acusação. Você lê de todos os jeitos possíveis durante anos e nunca consegue ler como acusação.'
  ]}
},

c23_final_os_doze:{
  falante:'Mewtwo',
  vozes:['P','N','P','N','N','N'],
  texto:[
    '"Eles responderam quando eu perguntei."',
    'Mewtwo levanta do chão.',
    '"Eu vou lá."',
    '"É num prédio no meio de uma cidade, no décimo primeiro andar, com gente trabalhando em todos os outros."',
    '"Eu sei." Ele já está andando pra saída. "Eu passei duzentos e quarenta e um dias sendo medido por gente que não perguntava. Eles estão no dia sabe-se lá quantos."',
    'Na saída da caverna, ele para.',
    '"Você vem?"'
  ],
  final:{id:'os_doze', titulo:'OS ONZE', texto:[
    'Vocês vão. Você e ele, de Kanto inteira atravessada, até o subsolo quatro de um prédio azul em Saffron.',
    'Não tem batalha. Não tem destruição. Ele entra pela escada de incêndio às três da manhã e abre onze tanques com as mãos.',
    'Sete não se mexem. Três não conseguem ficar de pé. Um fica.',
    'Ele passa três semanas no andar 11. Não libertando: conversando. Onze mentes que achavam que eram uma, e alguém finalmente perguntando alguma coisa a cada uma delas separadamente.',
    'Quando a Silph descobre, é tarde: a história já vazou, com as suas fotos ou com o seu depoimento, e uma empresa não sobrevive a essa manchete.',
    'Dos onze, quatro estão vivos cinco anos depois. Nenhum deles tem nome registrado em lugar nenhum, porque eles escolheram os próprios, e os próprios não são pronunciáveis.',
    'Mewtwo passa a ser chamado, em relatórios oficiais, de "o primeiro". Nunca de "o original".',
    'Você é uma nota de rodapé na história toda, e é exatamente o tamanho que você queria ter.'
  ]}
},

c23_final_matriz:{
  falante:'Mewtwo',
  vozes:['P','N','P','N','N','P','N'],
  texto:[
    '"Eu destruí tudo. Eu achei que era misericórdia."',
    'A câmara fica em silêncio por muito, muito tempo.',
    '"Você perguntou alguma coisa a eles antes?"',
    '"Não."',
    'Mais silêncio.',
    '"Então você fez exatamente o que fizeram comigo." A voz dele não tem raiva. Tem uma exaustão que é infinitamente pior. "Com um método diferente e por um motivo melhor."',
    '"Eu sei."',
    '"Eu sei que você sabe. Eu consigo ver que você sabe. É por isso que eu não vou fazer nada com você."'
  ],
  final:{id:'matriz', titulo:'A MATRIZ', texto:[
    'Ele te deixa ir. Não te perdoa, não te condena, não te pune. Te deixa ir.',
    'Você desce a montanha e volta pra Kanto e a vida continua, porque a vida sempre continua, e isso é a parte que ninguém avisa.',
    'A Silph reinicia o projeto onze meses depois num andar novo, com numeração nova, com protocolo novo.',
    'Você sabe disso porque você procura. Você passa a procurar sempre, em todo lugar, pelo resto da vida — e encontra, de vez em quando, e derruba, de vez em quando.',
    'Você vira muito bom nisso. Bom de um jeito que assusta as pessoas que trabalham com você.',
    'Ninguém entende por que você nunca comemora quando um desses lugares fecha.',
    'É porque você lembra que não perguntou nada a nenhum dos onze, e que perguntar teria levado quatro segundos.'
  ]}
},

c23_final_o_decimo_segundo:{
  falante:'Mewtwo',
  vozes:['P','N','N','N'],
  texto:[
    '"Eu tirei um de lá. Ele está aqui fora."',
    'A câmara inteira muda de pressão.',
    '"Traz."',
    'Você sobe, atravessa o vale entre duas Aves que não se movem, e desce de volta com uma coisa pequena que anda meio devagar.',
    'O que acontece quando os dois se veem não tem descrição possível, porque não acontece em som e não acontece em imagem.',
    'Você fica na entrada da câmara por quase uma hora, sem entender nada, sentindo alguma coisa enorme acontecer a doze metros de você.',
    'Quando acaba, Mewtwo olha pra você.',
    '"Ele tem dois anos de idade e três semanas de vida." Uma pausa. "Igual a mim. Eu tenho dois anos de idade e três semanas de vida, e eu passei os dois anos achando que os dois anos contavam."'
  ],
  final:{id:'decimo_segundo', titulo:'DOIS ANOS DE IDADE', texto:[
    'Você desce a montanha sozinh{o|a}. Os dois ficam.',
    'A Liga te pergunta o que houve. Você entrega um relatório de uma página que diz a verdade e não diz onde.',
    'Eles aceitam, porque não têm outra opção, e porque a pessoa que assinou o relatório é você.',
    'Cinco anos depois, existe uma comunidade de sete indivíduos numa região de Kanto que não consta em mapa. Eles não incomodam ninguém. Ninguém os incomoda.',
    'Isso é fruto de um tratado que você não assinou, que não está escrito, e que funciona há cinco anos porque as duas partes decidiram que funcionaria.',
    'Você é convidad{o|a} uma vez por ano. Você vai todos os anos.',
    'Na última visita, o Décimo Segundo — que agora tem um nome que você não consegue pronunciar e chama de Doze mesmo assim — te perguntou como é envelhecer.',
    'Você respondeu com a verdade, que é: "Não sei ainda. Eu te conto."'
  ]}
},

c23_final_tratado:{
  falante:'Mewtwo',
  vozes:['P','N','P'],
  texto:[
    '"O que você quiser que esteja."',
    'Ele para. Isso o desarma mais do que qualquer coisa que aconteceu nesta câmara.',
    '"Ninguém nunca me perguntou o que escrever."',
    '"Eu sei."',
    'Ele leva quase dez minutos pra responder, e quando responde, é uma frase só. Você anota exatamente como ele dita, palavra por palavra, num caderno de campo da Liga, à luz de lanterna, no fundo de uma caverna.'
  ],
  final:{id:'tratado', titulo:'O DOCUMENTO', texto:[
    'O documento tem uma frase. A frase é dele.',
    'A Liga passa quatro meses tentando reescrever em linguagem jurídica e desiste, porque toda reescrita piora.',
    'Ele é registrado exatamente como foi ditado, num arquivo do Planalto Indigo, com a sua assinatura embaixo como testemunha.',
    'É o primeiro documento na história de Kanto em que um Pokémon é o autor e não o objeto.',
    'Vinte anos depois, estudantes de direito ainda discutem esse papel numa cadeira eletiva chamada, sem nenhuma ironia, "Sujeitos".',
    'Mewtwo nunca sai da caverna do norte. Ninguém nunca vai buscar.',
    'E uma vez por ano, no aniversário do documento, alguém da Liga sobe até o vale, deixa uma cópia impressa na entrada e desce sem entrar.',
    'A cópia sempre some. Ninguém nunca perguntou pra onde vai.'
  ]}
},

c23_final_tratado_frio:{
  falante:'Mewtwo',
  vozes:['P','N','N'],
  texto:[
    '"O que a Liga aprovar."',
    'A temperatura da câmara não muda, mas alguma coisa muda.',
    '"Ah." Ele volta pra pedra. "Então não é comigo que você está falando. É com eles, e eu sou a pauta."',
    'Ele não te ataca, não te expulsa e não te impede de sair.',
    'Ele só para de falar com você — e a ausência da voz na sua cabeça, depois de tanto tempo com ela lá, é a coisa mais solitária que você já sentiu.'
  ],
  final:{id:'tratado_frio', titulo:'A PAUTA', texto:[
    'O acordo é assinado. Só que é assinado por uma parte só.',
    'A Liga comemora: "estabilização do incidente norte". Tem coletiva de imprensa. Tem foto sua.',
    'Você faz carreira. Sobe. Vira uma pessoa importante numa instituição importante.',
    'E a cada dois ou três anos, alguém propõe uma missão ao vale do norte pra "reavaliar o status", e você é a pessoa que vota contra, todas as vezes, com uma firmeza que os outros acham excessiva.',
    'Você nunca explica.',
    'A explicação é que ele parou de falar com você e você sabe exatamente por quê, e você não quer que mais ninguém ouça aquele silêncio.'
  ]}
},

c23_final_pena:{
  falante:'Mewtwo',
  vozes:['N','N','N','N','N'],
  texto:[
    'Você estende a pena.',
    'Ele não pega com a mão. Ela levanta do seu braço e fica pairando entre vocês dois, girando devagar, quebrando a luz.',
    '"Ele existe desde antes das cidades." Ele repete a frase devagar. "E ele te deu isso pra você trazer até aqui."',
    'A pena gira mais um pouco.',
    '"Ele sabia." A voz na sua cabeça está estranha. "Ele sabia que existia alguma coisa embaixo dessa montanha e ele mandou uma pena."',
    'Ele finalmente fecha a mão em volta dela.',
    '"Então eu não sou o primeiro de nada. Eu sou o mais novo de alguma coisa antiga."',
    'E isso — não a liberdade, não o perdão, não a vingança — isso é o que ele precisava.'
  ],
  final:{id:'pena', titulo:'O MAIS NOVO', texto:[
    'Mewtwo sai da caverna três dias depois de você.',
    'Ele não vai pra cidade nenhuma. Vai pro mar, pro sudoeste, pra uma ilha que não entra em mapa nenhum porque não tem nada nela.',
    'Pescadores de Fuchsia começam a relatar duas luzes sobre a ilha sem nome, não uma. Ninguém acredita neles, como sempre.',
    'O Sr. Tanner morre aos oitenta e três anos tendo visto as duas luzes juntas quatro vezes, e tendo contado pra todo mundo, e ninguém tendo acreditado, e ele não se importando nem um pouco.',
    'Você vai ao enterro. É {o único|a única} que vai de fora de Fuchsia.',
    'No caixão, na mão dele, tem uma pena que não é de Pidgey e que ninguém da família soube explicar de onde veio.'
  ]}
},

c23_final_socio:{
  falante:'Mewtwo',
  vozes:['P','N','N'],
  texto:[
    '"Sim."',
    'Ele não te mata. Isso te surpreende, e a surpresa é a parte que vai te assombrar.',
    '"Você sabe qual é a pior parte?" A voz está absolutamente calma. "Eu considerei."',
    fala('Mewtwo', 'Por dois segundos inteiros, eu considerei. Porque eu não tenho nada, e você me ofereceu alguma coisa, e é a primeira vez que alguém me oferece qualquer coisa.'),
    fala('Mewtwo', 'Sai.', 'frio')
  ],
  final:{id:'socio', titulo:'DOIS SEGUNDOS', texto:[
    'Você sobe do vale e volta pra Celadon e toca a rede por mais quatro anos.',
    'Ela cresce. Você é bom nisso — você é muito bom nisso, melhor que a Terceira, porque você viu Kanto inteira de perto e sabe onde as coisas doem.',
    'A Liga te pega no quinto ano. Não por heroísmo de ninguém: por planilha. Um contador comete um erro de lançamento e um auditor puxa o fio.',
    'Você pega nove anos. Cumpre cinco.',
    'Na prisão, você recebe uma visita que não estava na lista e que ninguém registrou na portaria. Ela dura quarenta segundos e acontece de madrugada, e o que é dito nela você nunca conta pra ninguém.',
    'Quando você sai, você não volta pro negócio. Não por arrependimento.',
    'Por causa dos dois segundos. Você passou cinco anos pensando nos dois segundos em que a coisa mais poderosa do mundo considerou a sua oferta porque estava sozinha demais pra recusar de cara.',
    'E você entendeu, em algum momento do quarto ano, que aquilo não foi uma vitória sua. Foi a coisa mais cruel que você já fez.'
  ]}
},

c23_final_inventario:{
  falante:'Mewtwo',
  vozes:['P','N'],
  texto:[
    '"Eu sei quanto pagam. Eu já vendi coisa parecida."',
    'A câmara não esfria, não treme, não acende.',
    'Ele só te olha.',
    '"Coisa parecida", ele repete.',
    'E aí faz a única coisa que podia ser pior do que atacar: ele te mostra. Não com palavra — com a memória, direto, sem tradução: a caixa de veludo, o depósito de Celadon, a doca da Silph, o curral do setor 7. Tudo o que você viu. Na sua cabeça, de uma vez, no tempo real que levou.',
    'Leva quatro minutos. Você fica de joelhos nos últimos dois.',
    '"Agora você tem o número. Era esse."'
  ],
  final:{id:'inventario', titulo:'O NÚMERO', texto:[
    'Você sai da caverna sem nada e desce a montanha com uma coisa nova na cabeça, que é a memória completa e simultânea de tudo o que você viu e deixou passar.',
    'Não é maldição, não é castigo e não é lição. É só inventário.',
    'Você larga a rede em quatro meses. Não por moral — porque não consegue mais olhar caixa fechada sem saber exatamente o que tem dentro e o que aquilo custa.',
    'Você passa a trabalhar em transporte de carga legalizado, conferindo manifesto, por um salário ruim, numa empresa pequena de Vermilion.',
    'Você é a pessoa mais rigorosa que essa empresa já teve. Ninguém entende por quê. Você abre todas as caixas. Todas.',
    'Seus colegas acham você insuportável.',
    'Em onze anos de trabalho, você encontra carga viva quatro vezes. Quatro.',
    'Isso não compensa nada. Você sabe que não compensa nada. Você continua abrindo as caixas.'
  ]}
},

c23_final_posse:{
  texto:[
    'Você sobe com ele na Pokébola.',
    'No vale, as duas Aves esperam você sair da caverna.',
    'O que acontece nos próximos dez minutos vai ser notícia por seis meses.'
  ],
  final:{id:'posse', titulo:'O QUE VOCÊ CARREGA', texto:[
    'Você sobrevive ao vale. Muita gente não teria.',
    'A partir daí, as coisas acontecem numa ordem previsível: a Liga emite a ordem de devolução. Você recusa. Emitem a detenção. Você foge.',
    'Kanto passa a ter um clima que os meteorologistas param de tentar prever. Incêndios em Cinnabar. Gelo na Rota 11 em pleno verão. Duas cidades evacuadas parcialmente.',
    'Você fica com ele. É a única coisa que você tem depois de um tempo — as pessoas vão saindo, uma por uma, do jeito que as pessoas saem: sem anúncio.',
    'Ele nunca fala com você. Nem uma vez, depois da Pokébola. Ele sabe falar. Escolhe não falar.',
    'Você passa o resto da vida com a coisa mais poderosa do mundo na mão e ninguém pra contar isso.',
    'Isso não é vitória. Tem nome, mas não é esse.'
  ]}
},

c23_final_entrega:{
  texto:[
    'Você sobe com ele e entrega à Liga, como combinado, com a Master Ball registrada e o protocolo assinado.',
    'Eles agradecem. Formalmente. Com um documento.',
    'E aí ele desaparece dentro de uma instituição, que é a forma mais silenciosa de desaparecer que existe.'
  ],
  final:{id:'entrega', titulo:'PROTOCOLO CUMPRIDO', texto:[
    'A Liga faz tudo certo. É importante registrar isso: eles fazem tudo certo.',
    'Instalação adequada. Equipe de acompanhamento. Protocolo de bem-estar revisado por três comitês. Ninguém experimenta nada nele. Ninguém o vende.',
    'Ele fica num complexo no subsolo do Planalto Indigo, com espaço, com temperatura controlada, com alguém checando duas vezes por dia.',
    'Você tem acesso de visita. Usa uma vez.',
    'Ele não fala com você. Ele não fala com ninguém desde o dia em que a porta fechou.',
    'Num relatório interno de sete anos depois, que você lê por causa do seu cargo, tem uma linha da equipe de acompanhamento:',
    '"Sujeito não apresenta agressividade, autoagressão ou deterioração. Não apresenta também nenhuma resposta a estímulo social. Recomenda-se manutenção do protocolo atual."',
    'Manutenção do protocolo atual.',
    'Você fecha o relatório e vai até a janela da sua sala, que é uma sala boa, num cargo bom, que você conquistou, e fica ali um tempo.'
  ]}
},

c23_final_arrependimento:{
  falante:'Mewtwo',
  vozes:['N','N','N'],
  texto:[
    'Você abre a Pokébola antes de chegar na superfície.',
    'Ele sai. Olha a Pokébola no chão. Olha você.',
    '"Por quê?"',
    'Você responde alguma coisa que não sai direito, e ele entende mesmo assim, porque ele entende tudo.',
    '"Isso não conserta." Uma pausa. "Mas conta."'
  ],
  final:{id:'arrependimento', titulo:'CONTA', texto:[
    'Mewtwo não te perdoa. Perdão não é uma categoria que ele use.',
    'Mas ele te deixa ir, e as Aves voltam pros postos, e o clima de Kanto volta ao normal em três semanas.',
    'A Liga registra: captura confirmada, liberação voluntária no mesmo dia. Isso te rende uma advertência e nenhuma punição.',
    'As pessoas lembram das duas coisas. Sempre as duas, nessa ordem: "aquele que pegou" e "aquele que soltou". Nunca só a segunda.',
    'Você aprende a viver com a primeira metade da frase.',
    'Anos depois, alguém te pergunta se você se arrepende. Você diz que sim, e a pessoa fica surpresa, porque esperava uma resposta mais bonita.'
  ]}
},

c23_final_porta:{
  texto:[
    'Você desce a montanha com o time curado por ele e a caverna selada atrás de você.'
  ],
  final:{id:'porta', titulo:'A PEDRA LISA', texto:[
    'A caverna nunca mais abre. Equipes da Liga tentam perfurar três vezes; a pedra é mais dura que o equipamento.',
    'As duas Aves abandonam o vale em duas semanas — não tem mais nada pra guardar.',
    'Mewtwo não é visto de novo em Kanto. Não há incidentes, não há ataques, não há nada. Só a ausência.',
    'Você conta essa história poucas vezes, porque toda vez que conta percebe a mesma coisa: ele te venceu, curou o seu time e foi embora. Nenhuma dessas três coisas é o que uma arma faz.',
    'Você teve a resposta na mão o tempo todo e respondeu com uma Pokébola.'
  ]}
},

/* ---------------- RAMOS FINAIS NOVOS ---------------- */

c23_carta:{
  falante:'Mewtwo',
  vozes:['N','N','P','N','N','N'],
  texto:[
    'Você tira a carta — ou a cópia da carta — e estende no escuro.',
    'Ele não pega com a mão. O papel sai da sua mão sozinho, para no ar a meio metro, e vira.',
    '"Eles contaram a gente duas vezes."',
    'Ele lê a frase do verso em voz alta, e é a única vez em toda a conversa que a voz dele muda.',
    '"Isso é conferência."',
    '"É."',
    '"Eu fui conferido." Ele devolve o papel ao ar, na sua direção, com muito cuidado. "Duas vezes por dia, durante duzentos e quarenta e um dias. Eles chamavam de verificação de integridade do espécime."',
    'Uma pausa.',
    '"Esse menino é meu."'
  ],
  ef:{flag:'mostrou_a_carta', rep:{eixo:'bom',delta:2,motivo:'Levou o nome de um desaparecido até o fim'}},
  escolhas:[
    {texto:'"Então vamos procurar ele."', vai:'c23_final_a_carta'},
    {texto:'"Ele pode estar vivo."', vai:'c23_final_a_carta'},
    {texto:'"Eu não sei o que fazer com isso."', vai:'c23_final_a_carta'}
  ]
},

c23_final_a_carta:{
  falante:'Mewtwo',
  vozes:['N','N','N'],
  texto:[
    'Ele fica muito tempo em silêncio.',
    '"Eu sei onde tem gente sendo conferida." Ele demora pra dizer isso. "Eu sinto. Eu sempre soube e eu achei que era comigo."',
    'Ele levanta.',
    '"Eu achei que o mundo inteiro era uma sala."'
  ],
  final:{id:'a_carta', titulo:'CONFERIDOS', texto:[
    'Nos oito meses seguintes, quatro instalações em Kanto são abertas por dentro.',
    'Nenhuma delas por autoridade nenhuma. Nenhuma delas com violência contra pessoa.',
    'As portas simplesmente ficam abertas, de madrugada, e de manhã tem gente sentada na calçada que não deveria existir em lugar nenhum: adolescentes sem nome em lista de passageiro, contratados por passagem, com contrato verbal e sem registro.',
    'Dorian tem dezessete anos quando sai. Ele pesa quarenta e um quilos e não sabe que dia é.',
    'A imprensa chama de "caso das vagas de trabalho". Dura onze dias de cobertura.',
    'A Comissão emite uma nota lamentando profundamente as irregularidades e se colocando à disposição para colaborar com as investigações.',
    'Ninguém de terno é indiciado. Dois motoristas e um contramestre são.',
    'Mas quatro portas ficaram abertas, e num porto de Vermilion tem uma fritura com um nome pregado na parede entre as contas a pagar, e a dona conta essa história pra todo mundo que senta no banquinho.'
  ]}
},

c23_trinta_e_dois:{
  falante:'Mewtwo',
  vozes:['N','P','N','N'],
  texto:[
    'Você conta da cratera. Da areia cinza. Da pedra morna do tamanho de uma cabeça.',
    'Dos trinta e dois em círculo, parados, em silêncio, por quarenta minutos, olhando uma pedra ficar azul.',
    'E de você atrás de uma rocha, sem entender nada, sem poder perguntar nada, achando aquilo a coisa mais bonita do mundo.',
    'Mewtwo escuta inteiro.',
    '"Eles sabiam que você estava lá."',
    '"Sabiam?"',
    '"Claro que sabiam. Você é {um garoto|uma garota} atrás de uma pedra." Ele quase — quase — acha graça. "Eles deixaram."'
  ],
  ef:{flag:'contou_da_cratera'},
  escolhas:[
    {texto:'"Por que eles deixaram?"', vai:'c23_final_trinta_e_dois'},
    {texto:'"O que eles estavam fazendo?"', vai:'c23_final_trinta_e_dois'},
    {texto:'Ficar calad{o|a}.', vai:'c23_final_trinta_e_dois'}
  ]
},

c23_final_trinta_e_dois:{
  falante:'Mewtwo',
  vozes:['N','N','P','N'],
  texto:[
    '"Eu não sei o que eles estavam fazendo. Eu leio pessoas. Eu não leio isso."',
    'Ele olha pro teto da câmara, onde não tem nada.',
    '"Existe uma coisa acontecendo em Kanto há muito mais tempo do que existe gente pra medir, e ela não precisa de mim, e não precisa de você, e não precisa da Comissão."',
    '"E isso te deixa melhor ou pior?"',
    'Ele demora.',
    '"Melhor."'
  ],
  final:{id:'trinta_e_dois', titulo:'ELES DEIXARAM', texto:[
    'Mewtwo não sai da caverna do norte.',
    'Não por prisão, não por acordo, não por medo: ele passa a subir uma vez por mês até uma cratera rasa no alto de uma montanha e ficar na borda, sentado, longe o bastante pra não atrapalhar.',
    'Trinta e dois viram trinta e três. Depois trinta e cinco. Depois ninguém contou mais.',
    'Você nunca escreveu onde é. Nunca marcou em mapa nenhum, nunca falou em telefone de Centro Pokémon, e quando um pesquisador de Celadon te ofereceu dinheiro pela coordenada, você disse que não lembrava.',
    'A Comissão manteve o item "Risco 01" em pauta por mais quatro anos e depois arquivou por inatividade do objeto.',
    'A Dra. Cordell morreu aos sessenta e oito sem nunca ter subido naquela cratera, e sabendo que existia, e escolhendo não subir.',
    'Essa foi a última coisa que ela te ensinou.'
  ]}
},

c23_a_porta_de_novo:{
  falante:'Mewtwo',
  vozes:['N','N'],
  texto:[
    'Você conta do zelador. Dos vinte e três anos repondo vela. Do irmão. Da porta fechada que os Gastly mostravam todo dia por dois anos.',
    'E da frase: "se eu abrir e não tiver nada, aí eu perco a porta também".',
    'Mewtwo escuta sem se mexer.',
    '"Eu tenho uma porta."',
    'Ele aponta com o queixo o corredor por onde você entrou.',
    '"Ela está aberta há dois anos."'
  ],
  ef:{flag:'contou_do_zelador'},
  escolhas:[
    {texto:'"E por que você não sai?"', vai:'c23_final_a_porta'},
    {texto:'"Talvez você também perca a porta."', vai:'c23_final_a_porta'},
    {texto:'Não responder.', vai:'c23_final_a_porta'}
  ]
},

c23_final_a_porta:{
  falante:'Mewtwo',
  vozes:['N','N','N'],
  texto:[
    '"Porque enquanto eu não saio, o mundo lá fora continua sendo o que eu imagino."',
    'Ele diz isso com uma clareza que dói.',
    '"E o que eu imagino é pior do que ele é, ou melhor do que ele é, e nos dois casos é meu."',
    'Ele olha pra você.',
    '"Você tem {idade} anos e você atravessou Kanto inteiro e você ainda não entendeu que ninguém sai de casa por coragem. Sai porque um dia a casa fica insuportável."'
  ],
  final:{id:'a_porta', titulo:'VINTE E TRÊS ANOS', texto:[
    'Você desce a montanha sem nada.',
    'Nenhuma captura, nenhum acordo, nenhuma revelação. Uma conversa de três horas numa câmara embaixo de pedra, com alguém que não saiu.',
    'Dois meses depois você volta a Lavender.',
    'Você sobe os sete andares da Torre e para na frente da porta do quinto andar, e ela está lá, do jeito que sempre esteve, fechada.',
    'Você abre.',
    'Não tem nada. É uma parede.',
    'Você desce e conta pro zelador, que escuta em pé, com a caixa de fósforo na mão, e não diz nada por um tempo muito longo.',
    'Depois ele senta no banco de concreto do saguão e chora um choro de homem de sessenta e um anos que perdeu uma coisa que tinha há vinte e três.',
    'Ele agradece. Três vezes.',
    'Na terceira você entende que ele está agradecendo de verdade, e é a coisa mais difícil que você já teve que aceitar.'
  ]}
},

c23_a_papelada:{
  falante:'Mewtwo',
  vozes:['N','P'],
  texto:[
    'Você tira tudo o que tem e põe no chão de pedra entre vocês dois.',
    'A guia com o brasão. A folha de controle do portão cinco. O estatuto grampeado com capa dura. A tampa de caixa com o número.',
    'Mewtwo olha o monte de papel no chão de uma caverna.',
    '"O que é isso?"',
    '"É o que eles são."',
    'Ele não toca em nada. As folhas se abrem sozinhas, uma por vez, e ficam abertas.',
    'Ele lê tudo em dois minutos e vinte segundos.'
  ],
  ef:{flag:'mostrou_a_papelada'},
  escolhas:[
    {texto:'Esperar.', vai:'c23_final_papelada'},
    {texto:'"Art. 19. Não há prazo."', vai:'c23_final_papelada'},
    {texto:'"Eu não sei ler isso direito."', vai:'c23_final_papelada'}
  ]
},

c23_final_papelada:{
  falante:'Mewtwo',
  vozes:['N','P','N','N','N','N'],
  texto:[
    'Quando acaba, ele fica muito quieto.',
    '"Isso é pior que caçada."',
    '"Por quê?"',
    '"Porque caçada acaba." Ele deixa as folhas caírem no chão, todas ao mesmo tempo. "Isso não tem prazo. Está escrito que não tem prazo. Alguém sentou numa mesa e escreveu que não tem prazo, e outra pessoa leu e aprovou, e uma terceira imprimiu."',
    'Ele levanta.',
    '"Quantas pessoas precisaram concordar pra essa frase existir?"',
    'Você não sabe.',
    '"Eu sei. Onze. Está no cabeçalho."'
  ],
  final:{id:'papelada', titulo:'NUMERAÇÃO SEQUENCIAL', texto:[
    'O que Mewtwo faz nos meses seguintes não é ataque e não é fuga.',
    'É leitura.',
    'Em quatro meses, cópias autenticadas de mil cento e oitenta e quatro guias de remessa chegam, por via postal, a onze endereços residenciais.',
    'Cada envelope contém apenas os documentos assinados por aquela pessoa. Nada mais. Sem bilhete, sem ameaça, sem exigência.',
    'Sete dos onze pedem exoneração em seis semanas. Dois adoecem. Um processa a Comissão e ganha.',
    'O décimo primeiro, a Presidente Hester Colman, dá uma entrevista de trinta e dois minutos em que defende cada página, com serenidade, sem levantar a voz, e é a coisa mais assustadora que já foi ao ar em Kanto.',
    'A Comissão continua existindo. Menor, mais devagar, com outro nome.',
    'Mas em quatro cidades, quando chega um ofício com brasão de balança, agora tem gente que vira o papel.',
    'Você ensinou isso a Kanto inteiro sem nunca ter subido num palco.'
  ]}
},

c23_os_nomes:{
  texto:[
    'Você diz os nomes.',
    d=>d.cemiterio.length ? `Os seus primeiro: ${d.cemiterio.map(p=>nomeExib(p)).join(', ')}.` : 'Não são todos seus.',
    d=>d.flags.vaporeon_morreu ? 'Depois o Duque, que era de rua e era da Sibyl, as duas coisas.' : '',
    d=>d.flags.copiou_os_onze_nomes ? 'Depois os onze, do canto de baixo de um mural de doze metros numa cidade sem música, copiados ajoelhado no chão porque uma moça de Fuchsia escreveu ajoelhada no chão.' : '',
    'Leva quatro minutos. Você não erra nenhum.',
    'Mewtwo escuta até o fim sem interromper, o que quase ninguém faz.'
  ],
  ef:{flag:'disse_os_nomes', rep:{eixo:'bom',delta:3,motivo:'Disse em voz alta os nomes que ninguém mais ia dizer'}},
  escolhas:[
    {texto:'Ficar em silêncio depois do último.', vai:'c23_final_os_nomes'},
    {texto:'"Eu não sei por que eu decorei isso."', vai:'c23_final_os_nomes'},
    {texto:'"Alguém tinha que continuar sabendo."', vai:'c23_final_os_nomes'}
  ]
},

c23_final_os_nomes:{
  falante:'Mewtwo',
  vozes:['P','N','N','N'],
  texto:[
    '"Eu não tenho nome", ele diz.',
    '"Você tem. Mewtwo."',
    '"Isso é um número com uma palavra na frente." Ele não está reclamando. É constatação. "Tinha um Mew. Eu sou o dois."',
    'Ele olha pra você por muito tempo.',
    '"Me dá um."',
    'E é isso: no fim de tudo, numa caverna embaixo de uma montanha, a coisa mais poderosa de Kanto pede um nome pra {um garoto|uma garota} de {idade} anos.'
  ],
  final:{id:'os_nomes', titulo:'ALGUÉM TINHA QUE CONTINUAR SABENDO', texto:[
    'Você dá o nome. Qual foi não importa — importa que levou onze segundos e que você não pensou muito, porque pensar muito teria estragado.',
    'Ele repete uma vez, baixo, testando.',
    'Depois diz obrigado, e sobe a escada da câmara na sua frente, e sai da caverna do norte pela primeira vez em dois anos, e as duas Aves na boca da caverna não se mexem porque tem uma pessoa do lado dele.',
    'Vocês descem a montanha juntos, e ele não fala mais nada o caminho inteiro.',
    'Na estrada, ele vira pro sul e você vira pro sul também, e é assim, e ninguém combinou.',
    'Nos anos seguintes, em Kanto, gente vai contar que viu uma coisa grande e clara andando na estrada com um treinador, sem coleira, sem bola, sem nada.',
    'Ninguém vai acreditar em ninguém.',
    'E na Torre Pokémon de Lavender, num mural preto de doze metros, uma linha nova aparece num dia qualquer, escrita com giz, com uma letra que ninguém reconhece:',
    'os onze, e embaixo, menor: "eu sei os nomes".'
  ]}
},

c23_a_pagina:{
  falante:'Mewtwo',
  vozes:['P','N','N','P','N'],
  texto:[
    '"Eu prometi voltar pra uma menina com um caderno."',
    '"Explica."',
    'Você explica. Ulla, dez anos, meio-fio de Pewter, duas colunas. PASSOU: oitenta e três. VOLTOU: trinta e um.',
    'E uma página nova, escrita com régua, com o título PROMETEU, e o seu nome no topo.',
    '"E se você não voltar?"',
    '"Ela risca. Com caneta vermelha."',
    'Mewtwo processa isso com uma seriedade completamente desproporcional.',
    '"Então você não pode ficar aqui."'
  ],
  ef:{flag:'falou_da_zuleica'},
  escolhas:[
    {texto:'"Eu não vim pra ficar."', vai:'c23_final_a_pagina'},
    {texto:'"Vem comigo. Ela ia gostar de te anotar."', vai:'c23_final_a_pagina'},
    {texto:'"Eu podia não voltar. Seria mais fácil."', vai:'c23_final_a_pagina'}
  ]
},

c23_final_a_pagina:{
  falante:'Mewtwo',
  vozes:['N','N','N'],
  texto:[
    fala('Mewtwo', 'Eu nunca prometi nada pra ninguém.'),
    d=>fala(d.jogador.nome, 'Ninguém nunca te pediu nada.'),
    '"Ninguém nunca me pediu nada." Ele concorda com a própria frase. "É diferente de ninguém nunca ter me dado nada. Eu não tinha reparado na diferença."',
    'Ele senta de novo no chão da câmara.',
    '"Vai. Antes que ela risque."'
  ],
  final:{id:'a_pagina', titulo:'PROMETEU', texto:[
    'Você desce a montanha e atravessa Kanto inteiro de volta, o que leva onze dias.',
    'Em Pewter, na rua principal, tem uma menina de onze anos sentada no meio-fio com um caderno de colunas.',
    'Ela te vê. Não sorri. Abre na página PROMETEU, procura o seu nome, e escreve do lado, com régua: VOLTOU.',
    'Depois fecha o caderno.',
    '"Você é {o primeiro|a primeira}."',
    '"Da página?"',
    '"Da página."',
    'Ela olha a rua.',
    '"Eu botei quatro nome nessa página nesses meses. Você é {o primeiro|a primeira} que volta."',
    'Você senta no meio-fio ao lado dela e vocês dois ficam ali olhando uma rua de cidade de pedra.',
    'Muito longe, ao norte, numa caverna, alguém decidiu continuar existindo porque uma criança tinha um caderno.',
    'Ninguém em Kanto jamais vai saber disso, e as duas colunas continuam sendo atualizadas até hoje.'
  ]}
},

c23_a_troca:{
  falante:'Mewtwo',
  vozes:['P','N','P','P','N'],
  texto:[
    '"Você quer trocar?"',
    'É a pergunta mais idiota que já foi feita nessa caverna e você ouve ela sair da sua boca com horror.',
    'Mewtwo para.',
    '"Trocar."',
    '"É o que treinador faz. Você dá um e recebe um e os dois mudam de lugar." Você está falando rápido demais. "É a única coisa que eu sei fazer que envolve escolher."',
    'Silêncio comprido.',
    '"E o que você ia dar?"'
  ],
  ef:{flag:'ofereceu_troca'},
  escolhas:[
    {texto:'Oferecer o primeiro do seu time. O que saiu de casa com você.', vai:'c23_final_a_troca',
     ef:{flag:'ofereceu_o_primeiro'}},
    {texto:'"Nada. Não tem troca justa aqui e eu sei."', vai:'c23_final_a_troca'},
    {texto:'"Eu. Eu fico e você vai."', vai:'c23_final_a_troca', ef:{flag:'ofereceu_a_si'}}
  ]
},

c23_final_a_troca:{
  falante:'Mewtwo',
  vozes:['P','N','N','N','P','N','N'],
  texto:[
    d=>d.flags.ofereceu_a_si
      ? '"Você." Ele repete. "Você fica numa caverna embaixo de uma montanha e eu saio andando com a sua vida."'
      : d.flags.ofereceu_o_primeiro
        ? 'Você diz o nome do primeiro. O que dormia aos pés da sua cama antes de tudo isso começar.'
        : '"Nada." Ele repete. "É a primeira resposta honesta que eu ouço numa negociação."',
    'Ele demora muito.',
    '"A troca não é o que você acha que é." Ele demora. "Eu li isso na cabeça de quatro pessoas que passaram por essa caverna."',
    '"O que é, então?"',
    '"É duas pessoas concordando que uma coisa viva pode mudar de dono."',
    'Uma pausa exata.',
    '"Eu não vou ser o segundo lado disso. Mas obrigado por perguntar em vez de sacar a Pokébola."'
  ],
  final:{id:'a_troca', titulo:'MUDAR DE DONO', texto:[
    'Você sobe a escada da câmara sem nada.',
    'E, nos anos seguintes, você para de trocar.',
    'Não vira militância, não vira discurso, não vira nada que dê pra escrever num cartaz. Você só para, e quando alguém oferece você diz que não, e quando perguntam por quê você dá de ombros e muda de assunto, porque a explicação envolve uma caverna e você não vai contar da caverna.',
    'Em Cerulean tem uma professora de natação que até hoje não entende por que você recusou um Seel.',
    'Em Pewter tem um homem da pedreira que conta pra todo mundo que já ofereceu um Machoke pra você e que você falou que não.',
    'E numa caverna do norte de Kanto tem alguém que nunca vai saber que uma pergunta idiota, feita por {um garoto|uma garota} de {idade} anos sem saber o que estava fazendo, mudou uma coisa pequena e permanente no mundo.',
    'Foi a coisa mais barata que você fez na vida. Não custou nada.',
    'Isso não desconta.'
  ]}
},

c23_sentou:{
  falante:'Mewtwo',
  vozes:['N','N','N'],
  texto:[
    'Você não fala nada.',
    'Senta no chão de pedra da câmara, de pernas cruzadas, com as mãos no colo, e espera.',
    'Ele espera também.',
    'Doze minutos.',
    'É a coisa mais difícil que você fez nessa jornada inteira e você tem consciência disso enquanto está fazendo.',
    'No décimo terceiro minuto, ele fala:',
    '"Ninguém nunca ficou calado perto de mim."',
    'E depois, mais baixo:',
    '"Eu leio o que as pessoas pensam. Todas. Sempre. Eu nunca tinha ouvido silêncio de verdade porque cabeça não faz silêncio."',
    'Uma pausa.',
    '"A sua está quieta."'
  ],
  ef:{flag:'ficou_em_silencio', rep:{eixo:'bom',delta:2,motivo:'Ficou treze minutos em silêncio quando podia falar'}},
  escolhas:[
    {texto:'Continuar em silêncio.', vai:'c23_final_silencio'},
    {texto:'"Eu não tô conseguindo pensar em nada."', vai:'c23_final_silencio'},
    {texto:'"É porque eu não sei o que dizer."', vai:'c23_final_silencio'}
  ]
},

c23_final_silencio:{
  texto:[
    'Vocês ficam ali por mais quarenta minutos.',
    'Não acontece nada. Não tem revelação, não tem acordo, não tem batalha.',
    'Quando você levanta pra ir, os seus joelhos estalam e o som ecoa na câmara inteira e vocês dois quase riem.',
    'Ele não te pede pra ficar. Você não promete voltar.',
    'Na boca da caverna, as duas Aves Lendárias estão paradas onde estavam, e uma delas vira a cabeça quando você passa, e isso é tudo.'
  ],
  final:{id:'silencio', titulo:'CABEÇA NÃO FAZ SILÊNCIO', texto:[
    'Você não conta pra ninguém.',
    'Não porque é segredo. Porque não tem o que contar: você entrou numa caverna, sentou no chão e ficou quiet{o|a} por quase uma hora com uma criatura de dois anos de idade que sabe tudo.',
    'A Liga pergunta. Você diz que não achou nada.',
    'A Dra. Cordell pergunta. Você diz que não achou nada, e ela olha na sua cara e sabe que você está mentindo, e não insiste, porque ela é ela.',
    'E toda vez, pelo resto da sua vida, que você estiver num lugar barulhento demais — num salão de navio, num pátio de porto, numa sala com mesa comprida e gente educada demais —, você vai conseguir fazer uma coisa que quase ninguém consegue.',
    'Você vai conseguir ficar quiet{o|a} por dentro.',
    'Foi a única coisa que ele te deu, e ele não deu de propósito, e é a mais valiosa.'
  ]}
},

c23_ir_embora:{
  falante:'Mewtwo',
  vozes:['N','P','N','P'],
  texto:[
    'Você vira as costas antes de ele terminar a frase.',
    'Não é medo e não é desprezo. É uma coisa muito mais simples: você entendeu, no meio da conversa, que não tem nada aqui pra você resolver.',
    'Ele não te impede.',
    '"Você vai embora."',
    '"Vou."',
    '"Por quê?"',
    'E você para na escada e responde de costas, o que é covarde e é verdade:',
    '"Porque eu tenho {idade} anos."'
  ],
  ef:{flag:'foi_embora_da_caverna'},
  escolhas:[
    {texto:'Subir.', vai:'c23_final_ir_embora'},
    {texto:'Voltar. Você não consegue ir embora assim.', vai:'c23_escolha_final'},
    {texto:'"E porque eu quero chegar em casa."', vai:'c23_final_ir_embora',
     ef:{flag:'quer_chegar_em_casa'}}
  ]
},

c23_final_ir_embora:{
  texto:[
    'Você sobe a escada da câmara e atravessa o corredor e sai pela boca da caverna, e o ar de fora é frio e limpo e violento de tão bom.',
    'As duas Aves Lendárias estão paradas na entrada. Nenhuma das duas olha pra você.',
    'Você desce a montanha.'
  ],
  final:{id:'ir_embora', titulo:'PORQUE EU TENHO {IDADE} ANOS', texto:[
    'Você volta pra estrada e a jornada continua, e ela é boa.',
    'Você ganha as insígnias que faltavam. Perde duas vezes pro mesmo líder e ganha na terceira. Chega ao Planalto Indigo num dia de chuva com um time que te obedece por afeto e não por medo.',
    'Você não vira campeão. Ou vira — isso depende de coisas que ainda não aconteceram quando essa história acaba.',
    'A Comissão continua existindo e continua mandando ofício, e você continua sem ter poder nenhum sobre isso.',
    'E uma vez por ano, mais ou menos, você pensa numa caverna no norte e numa conversa que você interrompeu no meio pra ir embora.',
    'E toda vez você chega na mesma conclusão, que é a conclusão certa e que não conforta nada:',
    'você tinha {idade} anos, e ninguém devia ter deixado aquilo na sua mão, e o fato de você ter ido embora é a coisa mais saudável que aconteceu nessa história inteira.',
    'Quem devia ter resolvido isso eram os adultos.',
    'Eles sabiam. Eles tinham o endereço, o número do processo e a data da reunião.',
    'Eles só não tinham {idade} anos.'
  ]}
},

c23_final_vazio:{
  texto:[
    'Você vira as costas e sobe.',
    'Ele não te impede. Não fala nada. Fica ajoelhado na câmara, do jeito que estava.'
  ],
  final:{id:'vazio', titulo:'NADA A REGISTRAR', texto:[
    'Você desce a montanha, pega a estrada, e a jornada simplesmente continua.',
    'Você derrota os ginásios que faltavam. Consegue as insígnias. Chega ao Planalto Indigo.',
    'A Liga te pergunta o que houve no norte. Você diz que não achou nada.',
    'Em algum momento, anos depois, você percebe que a coisa mais importante que já te aconteceu foi uma conversa que você interrompeu no meio.',
    'Ele te fez uma pergunta. Você derrubou ele no chão e foi embora sem responder.',
    'Foi exatamente o que os cientistas fizeram. Você só usou um método diferente.'
  ]}
},

/* ---------------- RAMOS DO QUE VOCÊ TROUXE ---------------- */

c23_final_nogueira:{
  texto:[
    'Vocês sobem a rampa juntos e ele anda devagar porque as pernas não seguram bem depois de sete meses sentado.',
    'Na metade, ele para na frente da contagem da parede e passa a mão nos riscos de cima, os tortos.',
    '"Ele riscou todos esses sozinho", ele diz, e não fala mais nada até a superfície.',
    'No vale, as duas aves não se mexem. Na borda, o sol é violento depois de tudo aquilo e ele leva vinte minutos com a mão nos olhos.',
    'Vocês descem em dois dias. No posto florestal, o Sr. Poplar escreve uma data na terceira coluna do livro, ao lado de um nome que estava lá havia sete meses sem par.',
    'Ele escreve devagar, com capricho, e depois fecha o livro e não olha para ninguém por um tempo.'
  ],
  ef:{flag:'desceu_com_o_nogueira',
      rep:{eixo:'bom',delta:4,motivo:'Trouxe de volta um homem que a placa de bronze já esperava'},
      registrar:'Desceu com o Vernon. O livro do posto florestal fechou uma linha.'},
  final:{id:'nogueira', titulo:'TERCEIRA COLUNA', texto:[
    'A placa de bronze do Planalto Indigo continua com quarenta e um nomes.',
    'A placa nova, aprovada no ano seguinte, tem três, e não quatro, e leva uma linha embaixo que o Sr. Waldo brigou para incluir e que nenhuma outra placa de nenhuma instituição de Kanto tem.',
    'UM VOLTOU.',
    'O Vernon não volta ao serviço. Ele passa oito meses em tratamento, briga com a Liga por uma pensão que a Liga acaba pagando, e depois abre uma oficina de conserto de bicicleta em Cerulean, perto da escola das filhas.',
    'Ele não fala sobre a caverna com jornalista nenhum, nem uma vez, nem por dinheiro.',
    'Ele fala com você, no primeiro sábado de cada mês, numa mesa de bar, e sempre começa a conversa do mesmo jeito:',
    '"E aí, como é que ele está?"',
    'E é por isso que você sobe a montanha. Não pela pergunta dele.',
    'Porque alguém tem que ter a resposta.'
  ]}
},

c23_a_resposta_dobrada:{
  falante:'Mewtwo',
  vozes:['P','N','P','N'],
  texto:[
    'Você tira do bolso o papel dobrado quarenta vezes e põe no chão de pedra, entre vocês dois.',
    '"Isso não é meu."',
    '"De quem é?"',
    '"De um homem que está sentado numa pedra lá em cima há quatro meses porque ele não consegue descer sem responder a sua pergunta."',
    'A câmara fica absolutamente parada.',
    'O papel levanta do chão sozinho, para na altura dos olhos dele, e abre.',
    'Ele lê. Demora mais do que precisaria para ler uma linha.',
    '"Eu queria que a minha filha não tivesse medo de Pokémon grande."',
    'Ele lê em voz alta, na sua cabeça, e a voz dele faz uma coisa que não fez em nenhum outro momento.'
  ],
  ef:{flag:'entregou_a_resposta', instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Carregou a resposta de outro homem montanha abaixo'},
      registrar:'Entregou a resposta que ele reescreveu quarenta vezes.'},
  escolhas:[
    {texto:'"Ele quer saber se está certa."', vai:'c23_final_resposta'},
    {texto:'Não dizer nada e esperar.', vai:'c23_final_resposta'}
  ]
},

c23_final_resposta:{
  falante:'Mewtwo',
  vozes:['N','N'],
  texto:[
    'O papel se dobra sozinho, nas mesmas quarenta dobras, e volta para a sua mão.',
    '"Diz para ele que não tem resposta certa."',
    'Uma pausa.',
    '"E diz que essa é a primeira que alguém me deu sem consultar ninguém."'
  ],
  final:{id:'resposta', titulo:'QUARENTA DOBRAS', texto:[
    'Você sobe com o papel no bolso e entrega na mesma pedra em que ele estava sentado.',
    'Ele lê o que você trouxe, e a mensagem inteira é que não tem resposta certa, e é exatamente isso que ele precisava.',
    'Ele desce naquele mesmo dia. Leva sete horas e não para uma vez.',
    'No posto florestal, o Sr. Poplar escreve a data dele na terceira coluna e fecha a última linha em branco do livro.',
    'Três meses depois, numa escola municipal de Fuchsia, um homem faz uma palestra para uma turma de quarta série sobre Pokémon grandes.',
    'Ele não conta onde esteve. Ele conta só uma coisa: que Pokémon grande também tem medo, e que isso não é motivo para gostar menos deles, é motivo para ter mais cuidado.',
    'A filha dele está na terceira fileira.',
    'Ela não tem medo nenhum. Ela nunca teve. Ele é que tinha, e levou quatro meses numa pedra para descobrir.'
  ]}
},

c23_a_prancheta:{
  falante:'Mewtwo',
  vozes:['N','P','N'],
  texto:[
    'Você põe no chão de pedra o que trouxe do galpão do fundo.',
    'Trinta e nove páginas. Data, lote, anilha, motivo, responsável, assinatura.',
    'Ele não pega. As folhas se levantam do chão uma por uma, ficam suspensas em fileira no ar da câmara, e ele lê as trinta e nove ao mesmo tempo.',
    'Isso leva quatro segundos.',
    'Depois elas descem devagar e se empilham de volta, alinhadas, mais organizadas do que você as tinha deixado.',
    '"Quatro mil cento e nove."',
    '"Quatro mil cento e nove."',
    'Ele fica em silêncio por um tempo muito comprido.',
    '"Nenhum deles tem nome."'
  ],
  ef:{flag:'mostrou_a_prancheta', instabilidade:2,
      rep:{eixo:'bom',delta:2,motivo:'Levou a planilha até o fundo de uma montanha'},
      registrar:'Mostrou a planilha do galpão 4 a Mewtwo. Nenhum deles tem nome.'},
  escolhas:[
    {texto:'"Tem. Tem anilha. Anilha é número, mas é individual."', vai:'c23_final_anilha'},
    {texto:'"Não tem. E é por isso que eu trouxe."', vai:'c23_final_sala704'},
    {texto:'"Eu tenho uma lista com os nomes de quem não conseguiu salvar."', vai:'c23_a_lista_do_sena', cond:d=>!!d.flags.tem_a_lista_do_sena}
  ]
},

c23_final_anilha:{
  falante:'Mewtwo',
  vozes:['P','N','N','P','N','N'],
  texto:[
    '"Tem anilha. Quarenta e um C, zero sete. Anilha é número, mas é individual."',
    'Ele processa isso.',
    '"Individual." A palavra chega devagar. "Quer dizer que dá para falar de um sem falar dos outros."',
    '"Dá."',
    '"Então eles não estão perdidos." Uma pausa muito longa. "Eles estão arquivados, que é diferente, e arquivo se lê."'
  ],
  final:{id:'anilha', titulo:'QUARENTA E UM C, ZERO SETE', texto:[
    'O que acontece nos dois anos seguintes não tem explicação oficial e tem uma explicação simples.',
    'A Estação 4 é interditada por decisão judicial. As trinta e nove páginas viram anexo de um inquérito. Os quatro mil cento e nove viram uma linha numa sentença.',
    'E, numa sexta-feira qualquer, o arquivo da Comissão é aberto por ordem do juízo, e entre as caixas está a relação de anilhas, individual, por lote, por data, com o número de cada um.',
    'Ninguém pediu essa relação. Ela foi juntada aos autos porque constava.',
    'Uma professora da escola técnica de Celadon transforma isso num projeto de extensão que dura nove anos.',
    'Os alunos leem os números em voz alta, um por dia, na abertura da aula. São quatro mil cento e nove dias.',
    'Eles ainda não chegaram no fim. A previsão é 2038.',
    'Ninguém sabe se isso serve para alguma coisa. Todo mundo continua lendo.'
  ]}
},

c23_a_lista_do_sena:{
  falante:'Mewtwo',
  vozes:['N','P','N','P'],
  texto:[
    'Você tira a folha de caderno com a espiral rasgada, escrita à mão, três colunas de números de anilha, quase cheia.',
    'No alto, em letra pequena: as que eu não consegui.',
    'A folha levanta e fica suspensa a meio metro do chão.',
    'Ele lê.',
    '"Isso é letra de gente."',
    '"É."',
    '"E ele levava isso para casa."',
    '"Todo fim de semana."',
    'A folha desce muito devagar, mais devagar que qualquer outra coisa que se moveu nesta câmara, e pousa no chão sem fazer barulho.'
  ],
  ef:{flag:'mostrou_a_lista_do_sena', instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Mostrou que alguém lá dentro contava'},
      registrar:'Mostrou a Mewtwo a lista que o Dr. Hollis levava para casa.'},
  escolhas:[
    {texto:'"Tem gente lá dentro que ainda conta."', vai:'c23_final_alguem_conta'},
    {texto:'"E não adianta nada."', vai:'c23_final_sala704'}
  ]
},

c23_final_alguem_conta:{
  falante:'Mewtwo',
  vozes:['P','N','N','P','N','N'],
  texto:[
    '"Tem gente lá dentro que ainda conta."',
    'Ele demora.',
    '"Eu passei dois anos achando que a resposta era sair daqui e resolver."',
    'Uma pausa.',
    '"E a resposta é que alguém de dentro leva uma folha de caderno para casa todo fim de semana e não consegue parar."',
    '"Isso é uma resposta muito pior."',
    '"É." Ele senta de novo na pedra. "E é a única que eu acredito."'
  ],
  final:{id:'alguem_conta', titulo:'TODO FIM DE SEMANA', texto:[
    'Mewtwo não sai da caverna naquele ano, nem no seguinte.',
    'O que sai da caverna é outra coisa: uma vez por mês, alguém encontra na porta de um viveiro, de um instituto, de uma sala de reunião, uma folha de papel com uma lista de números escrita com precisão de agulha.',
    'Nunca tem ameaça. Nunca tem exigência. É só uma lista de números de anilha, conferida, sem nenhum erro.',
    'Ninguém nunca prova de onde vem. Todo mundo sabe.',
    'A Comissão gasta quatro reuniões discutindo como responder a isso e não chega a conclusão nenhuma, porque não existe procedimento para um documento que chega sem remetente e que está correto.',
    'O Dr. Hollis para de levar a folha dele para casa no terceiro ano.',
    'Não porque desistiu. Porque passou a levar o arquivo inteiro, na frente de todo mundo, com autorização, dentro do horário de expediente.',
    'Ele conseguiu isso por escrito. Levou dois anos e onze pedidos.',
    'Você tem uma cópia do último. Ele te mandou pelo correio, sem bilhete.'
  ]}
},

c23_a_chapa:{
  falante:'Mewtwo',
  vozes:['N','P','N','N'],
  texto:[
    'Você tira a chapa de metal que arrancou do vidro do círculo, com a numeração SPH estampada e a borda derretida.',
    'Ele olha a chapa e a câmara inteira fica dois graus mais fria.',
    '"Onde você achou isso?"',
    '"No círculo. No chão do vale, a cinquenta metros da sua porta."',
    'Silêncio.',
    '"Eu sei onde eu achei." A voz é muito quieta. "Eu perguntei onde você achou, porque eu preciso saber se ainda está lá."'
  ],
  ef:{flag:'mostrou_a_chapa', instabilidade:2,
      registrar:'Mostrou a chapa da Silph que estava no círculo do vale.'},
  escolhas:[
    {texto:'"Ainda está. O círculo inteiro está."', vai:'c23_o_circulo_conversa'},
    {texto:'"O que aconteceu ali?"', vai:'c23_o_circulo_conversa'}
  ]
},

c23_o_circulo_conversa:{
  falante:'Mewtwo',
  vozes:['N','N','P','N','N','N','P','N','N'],
  texto:[
    'Ele demora tanto para responder que você chega a achar que não vai.',
    '"Eles vieram me buscar no primeiro ano."',
    'Uma pausa.',
    '"Um helicóptero, quatro pessoas, uma jaula de campo e um documento. Eles pousaram no vale e desceram e eu subi."',
    '"E?"',
    '"E eu fiquei parado na frente deles por quarenta segundos esperando que alguém falasse comigo." A voz não muda. "E o que eles fizeram nos quarenta segundos foi montar a jaula."',
    'Ele olha a chapa.',
    '"Eu não matei ninguém. Eu derreti a máquina e eu desci de volta e eles andaram dois dias até a Rota 10."',
    '"E o círculo?"',
    '"O círculo é onde eu deitei depois." Ele devolve a chapa. "Por onze dias."'
  ],
  ef:{flag:['sabe_do_helicoptero'], instabilidade:2, moral:-2,
      rep:{eixo:'bom',delta:2,motivo:'Perguntou o que tinha acontecido e ouviu a resposta inteira'},
      registrar:'Vieram buscá-lo de helicóptero com uma jaula. Ele derreteu a máquina e deitou onze dias no vidro.'},
  escolhas:[
    {texto:'"Eles montaram a jaula antes de falar com você."', vai:'c23_final_quarenta_segundos'},
    {texto:'"E se alguém tivesse falado?"', vai:'c23_final_quarenta_segundos'},
    {texto:'Voltar à conversa.', vai:'c23_escolha_final'}
  ]
},

c23_final_quarenta_segundos:{
  falante:'Mewtwo',
  vozes:['P','N','P','N','N'],
  texto:[
    '"Eles montaram a jaula antes de falar com você."',
    '"Sim."',
    '"E se alguém tivesse falado?"',
    'A câmara fica muito quieta.',
    '"Eu teria entrado na jaula."',
    'Ele diz isso sem nenhum peso, do jeito que se diz uma coisa que já foi pensada mil vezes.',
    '"Eu teria entrado na jaula se uma das quatro pessoas tivesse me perguntado se eu queria entrar. E é por isso que eu não consigo descer a montanha."'
  ],
  final:{id:'quarenta_segundos', titulo:'QUARENTA SEGUNDOS', texto:[
    'Você desce e faz uma coisa que ninguém te pediu e que não estava em ordem de missão nenhuma.',
    'Você escreve. Quatro páginas, à mão, e entrega no balcão da Liga, protocolado, com número.',
    'Não é relatório de reconhecimento. É a transcrição de uma conversa, sem análise, sem recomendação, sem conclusão.',
    'O Sr. Waldo lê e junta ao caso de 1994. A Conselheira Thistle lê e não junta a lugar nenhum, e leva para casa.',
    'Dois anos depois, o protocolo de aproximação de indivíduos de classificação especial da Liga Pokémon é reescrito inteiro.',
    'O item 1 do novo protocolo não fala de equipamento, de distância segura, nem de contenção.',
    'O item 1 diz: antes de qualquer procedimento, a equipe deve perguntar ao indivíduo se ele deseja ser abordado, e aguardar.',
    'Nunca foi testado. Não teve mais ocorrência.',
    'Isso, na Liga, é considerado sucesso, e dessa vez eles têm razão.'
  ]}
},

c23_a_carta_da_professora:{
  falante:'Mewtwo',
  vozes:['N','P','N','N'],
  texto:[
    'Você tira a cópia da carta que uma professora escreveu à Liga meses atrás e que ninguém respondeu, e lê em voz alta na câmara.',
    '**Prezados senhores. Não sei se é aqui que se escreve isto.**',
    '**{Um aluno meu|Uma aluna minha} saiu de casa e não {é fugido|é fugida}, {ele|ela} avisou, e em casa sabem.**',
    '**Eu só queria pedir que, se alguém do serviço dos senhores {encontrar ele|encontrar ela} por aí, {diga para ele|diga para ela} que não precisa voltar com nada. {Ele|Ela} acha que precisa voltar com alguma coisa.**',
    'Você termina de ler e a sua própria voz soa estranha nesta pedra.',
    'Ele demora muito.',
    '"Ela escreveu isso para uma instituição."',
    '"Escreveu."',
    '"E a instituição arquivou." Uma pausa. "E você leu meses depois, dentro de uma pasta com o seu nome, e a frase ainda estava certa."'
  ],
  ef:{flag:'leu_a_carta_aqui', instabilidade:1, moral:3,
      rep:{eixo:'bom',delta:2,motivo:'Leu em voz alta, numa caverna, a carta que ninguém respondeu'},
      registrar:'Leu a carta da professora em voz alta na câmara.'},
  escolhas:[
    {texto:'"Eu vim aqui achando que precisava voltar com alguma coisa."', vai:'c23_final_nao_precisa'},
    {texto:'"E eu ainda acho."', vai:'c23_final_nao_precisa'}
  ]
},

c23_final_nao_precisa:{
  falante:'Mewtwo',
  vozes:['P','N','N','N'],
  texto:[
    '"Eu vim aqui achando que precisava voltar com alguma coisa."',
    'Ele desce da pedra e senta no chão, e isso ele só fez uma vez antes.',
    '"Eu também."',
    'Uma pausa muito longa.',
    '"Eu passei dois anos aqui embaixo achando que se eu subisse sem uma resposta eu não valia a subida."',
    'Ele olha a carta na sua mão.',
    '"A sua professora escreveu para a instituição errada."'
  ],
  final:{id:'nao_precisa', titulo:'NÃO PRECISA VOLTAR COM NADA', texto:[
    'Você sobe sem nada.',
    'Sem bola, sem prova, sem acordo, sem criatura, sem relatório. A Liga pergunta o que houve e você diz a verdade, que é a coisa mais decepcionante possível: uma conversa.',
    'O Sr. Waldo escreve missão cumprida no campo próprio, porque a ordem era ir, observar, não intervir e voltar.',
    'Você pega um ônibus para Pallet no mês seguinte.',
    'A escola tem uma sala nova, um muro pintado e a mesma professora, que está mais velha e que te reconhece antes de você chegar no portão.',
    'Ela não pergunta onde você esteve, nem o que você fez, nem se você virou campeão.',
    'Ela pergunta se você comeu.',
    'Você fica na sala dela até a última aula, sentad{o|a} numa carteira que é pequena demais para você agora, ouvindo ela ensinar sílaba a vinte e três crianças de sete anos.',
    'Uma delas, no fim, pergunta se você é {treinador|treinadora}.',
    'Você diz que é, e ela pergunta o que tem de mais legal em ser, e você pensa muito antes de responder, e a resposta que sai não é a que você esperava:',
    '"Conhecer gente."'
  ]}
},

c23_o_papel_do_quintino:{
  texto:[
    'Você tira o papel dobrado que um homem de setenta e três anos te deu na borda de um poço de pedra, com o pedido de jogar fora na volta.',
    'Você abre, pela primeira vez, aqui, o que provavelmente é errado.',
    'É um endereço, escrito à caneta, numa letra jovem que envelheceu junto com o papel.',
    'Um bairro de Cinnabar, um número de casa, e embaixo, entre parênteses: perguntar pelo Dr. Fuji.',
    'Você fica um tempo com o papel na mão no meio de uma câmara embaixo de uma montanha.',
    'Em 1981, alguém ofereceu a um ex-campeão de cinquenta e cinco anos a chance de ir a Cinnabar ver o que estavam fazendo lá.',
    'Ele guardou o endereço e não foi, e carregou o papel por dezenove anos.'
  ],
  ef:{flag:'abriu_o_papel_do_quintino', instabilidade:2, moral:-2,
      registrar:'O papel do Sr. Mervin era o endereço do Dr. Fuji, de 1981.'},
  escolhas:[
    {texto:'Mostrar o papel a ele.', vai:'c23_mostrou_o_endereco'},
    {texto:'Guardar e não mostrar.', vai:'c23_escolha_final'}
  ]
},

c23_mostrou_o_endereco:{
  falante:'Mewtwo',
  vozes:['N','P','N','N','N','P','N'],
  texto:[
    'Você mostra o papel.',
    'Ele lê o endereço e não diz nada por um tempo que passa de um minuto.',
    '"Essa casa existiu."',
    '"Existiu."',
    '"Ele morava ali quando escreveu o caderno um." A voz é muito quieta. "No caderno três ele mudou. No sete ele já morava no instituto."',
    'Uma pausa.',
    '"Quem te deu isso?"',
    '"Um homem que não foi."',
    'E aí ele faz a pergunta que você não estava preparado para responder:',
    '"E se ele tivesse ido, o que ele teria feito?"'
  ],
  ef:{flag:'mostrou_o_endereco', instabilidade:1,
      registrar:'Ele reconheceu o endereço: a casa do Dr. Fuji antes do instituto.'},
  escolhas:[
    {texto:'"Nada. Uma pessoa só não muda isso."', vai:'c23_final_o_papel'},
    {texto:'"Não sei. Ele passou dezenove anos achando que teria mudado tudo."', vai:'c23_final_o_papel'}
  ]
},

c23_final_o_papel:{
  falante:'Mewtwo',
  vozes:['N','P','N','N','N','P','N','N'],
  texto:[
    'Ele olha o papel no ar por mais um tempo.',
    '"Não joga fora."',
    '"Ele pediu."',
    '"Eu sei o que ele pediu." O papel se dobra sozinho, nas dobras antigas, e volta para a sua mão. "Leva de volta para ele e diz que eu li."',
    'Uma pausa.',
    '"E diz que eu não teria gostado dele se ele tivesse ido em oitenta e um, porque em oitenta e um eu não existia, e ele teria visto um tanque vazio e ido embora tranquilo."',
    '"Isso não vai consolar ele."',
    '"Não vai." Uma pausa muito longa. "Mas é verdade, e ele carregou dezenove anos de mentira. Uma verdade é mais leve."'
  ],
  final:{id:'o_papel', titulo:'TRINTA E CINCO ANOS', texto:[
    'Você desce a montanha com um papel de 1981 no bolso e devolve numa borda de poço de pedra, dois andares abaixo do saguão do Planalto Indigo.',
    'O Sr. Mervin ouve tudo sem interromper, com as pernas balançando dentro do poço.',
    'Quando você termina, ele fica quieto uns bons dois minutos.',
    'Depois pega o papel, dobra mais uma vez, e põe no bolso da camisa.',
    '"Ele leu."',
    '"Leu."',
    'Ele assente três vezes, devagar.',
    'No ano seguinte, aos setenta e quatro anos, o Sr. Mervin aceita o cargo de instrutor auxiliar, que foi criado para ele e que ele recusou onze vezes em doze anos.',
    'Ele não ensina a lutar. Ele ensina uma coisa só, e é a primeira aula de todo curso novo, e leva quinze minutos.',
    'A aula se chama: quando alguém te oferecer, vá.',
    'E ele começa contando que uma vez ofereceram a ele e ele não foi, e que ele passou dezenove anos carregando um endereço no bolso.',
    'Todo mundo que passou por essa aula foi ao lugar que ofereceram. Todos, sem exceção, até hoje.',
    'Isso está num levantamento interno que ninguém nunca publicou.'
  ]}
}
}}

);
