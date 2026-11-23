/* ============================================================
   ILHAS SEVII · VI — O TORNEIO DAS ILHAS (capítulo 38, pós-jogo)
   Ilha Sete, a arena de pedra no alto do morro. Quem chega pro torneio
   chega do jeito que os outros capítulos deixaram: com ou sem o que a
   gangue levou, com ou sem o patrocinador, a Noa inscrita ou na grade.
   A Oona entrega ao Magnus a Pokébola velha do Monte Pyre. A chave de
   dezesseis é a da Copa (sevii-torneio.js): a opção `copa` entrega a
   vez pra chave, e a chave devolve pra c38_campeao ou c38_caiu.
   ============================================================ */
/* quem levou o título da tarde da história (CopaSevii.guardarCampeao) */
function _c38Campeao(d){ return (Sevii.reg(d).campeao) || {}; }

CAPITULOS.push(
{
num:38, titulo:'O Torneio das Ilhas', local:'Ilha Sete — a arena de pedra', ambiente:'montanha', nivelArea:66,
tom:'final', posJogo:true,
ancora:{local:'ilha_sete', chamada:'No alto do morro da Ilha Sete, a arquibancada de pedra está enchendo, e na entrada um rapaz de macacão pinta dezesseis risquinhos numa lousa com cal.'},
entradas:['c38_a_chegada'],
inicio: d => 'c38_a_chegada',
cenas:{

c38_a_chegada:{
  texto:[
    'A arena da Ilha Sete é um anel de arquibancada de pedra no alto do morro, aberto pro céu, com o mar dos dois lados e o vento assobiando em três notas que vêm do cânion.',
    'Na entrada, numa mesa de madeira com uma toalha de feltro verde, um velho de terno marrom e chapéu, bigode branco aparado à régua e bengala de castão de latão, anota nomes num livro grosso.',
    fala('Magnus', 'Magnus Holm. Fui eu que escrevi a sua carta.', null, 'Ele não levanta. Estende a mão por cima do livro.'),
    fala('Magnus', 'Dois anos eu escrevi pro Campeão de Kanto e recebi silêncio. Esse ano escrevi com o seu nome, e veio gente.')
  ],
  escolhas:[
    {texto:'"O Blue mandou dizer que leu. Todos."', vai:'c38_o_recado'},
    {texto:'Assinar o livro sem dizer nada.', vai:'c38_o_livro'}
  ]
},

c38_o_recado:{
  texto:[
    'O Magnus para a caneta no meio de uma letra.',
    fala('Magnus', 'O menino dos catorze minutos.', null, 'Ele fala isso baixo, como quem lembra de uma coisa boa.'),
    fala('Magnus', 'Eu escrevia pra ele porque catorze minutos é mais do que eu fui campeão de qualquer coisa fora desta ilha. Eu queria que alguém de lá soubesse que daqui se via.'),
    'Ele termina a letra. Fecha a caneta.',
    fala('Magnus', 'Diz pra ele que na arquibancada tem lugar. De pedra, mas tem.')
  ],
  ef:{flag:'sv_magnus_recado', npc:{nome:'Magnus', opiniao:2, memoria:'Trouxe o recado do Blue: que leu todos os convites.'},
      registrar:'Deu ao Magnus Holm o recado do Blue: ele leu todos os convites.'},
  escolhas:[
    {texto:'Assinar o livro.', vai:'c38_o_livro'}
  ]
},

c38_o_livro:{
  texto:[
    'Você assina na linha de baixo. Na página tem quinze nomes antes do seu, cada um com uma letra, cada um com uma cidade de longe do lado.',
    'Enquanto você escreve, alguém para do seu lado na mesa. Uma moça de cabelo branco comprido, de vestido roxo até o chão, com uma Pokébola gasta nas duas mãos.',
    d => d.flags.sv_oona_ajudou
      ? fala('Oona', 'Você disse Holm. É ele.', null, 'Ela fala pra você, mas olha pro Magnus.')
      : fala('Oona', 'Os nomes do quadro da entrada. Holm, duas vezes, a ouro. Eu li.', null, 'Ela fala sozinha, olhando pro Magnus.'),
    'Ela põe a Pokébola em cima do livro aberto, na frente dele. Na tampa, riscado com ponta de faca: M. H. — SETE.'
  ],
  escolhas:[
    {texto:'Ficar e ver.', vai:'c38_a_pokebola'}
  ]
},
c38_a_pokebola:{
  texto:[
    'O Magnus olha a Pokébola um tempo comprido, sem tocar.',
    fala('Magnus', 'Mira.', null, 'Só o nome. Ele não fala alto.'),
    fala('Oona', 'Alguém deixou isso num túmulo do cume do Monte Pyre, faz dezenove anos. Lá, o que se deixa num túmulo volta pra casa dezenove anos depois. Eu sou quem leva.'),
    fala('Oona', 'Os zeladores dizem que a mão que deixou era de mulher. Mão de quem ainda andava.', 'baixo'),
    'O Magnus pega a Pokébola com as duas mãos. Abre. Está vazia, e ele já sabia que estaria.',
    fala('Magnus', 'Minha filha. Saiu pra Hoenn faz vinte e dois anos, com o Pokémon que eu dei pra ela quando ela tinha nove, e nunca mandou carta.', 'baixo'),
    fala('Magnus', 'Dezenove anos atrás ela estava no Monte Pyre enterrando ele. Viva. Três anos depois de ir embora.'),
    'Ele fecha a Pokébola, põe no bolso do colete, do lado do coração, e abre o livro na página do torneio de novo como se nada.',
    fala('Magnus', 'Eu sempre dizia que pra Hoenn era tarde.', null, 'Ele escreve o nome da Oona na lista com a letra firme de sempre.'),
    fala('Magnus', 'Depois do torneio a gente vê o que é tarde.')
  ],
  ef:{flag:'sv_magnus_mira', npc:{nome:'Oona', opiniao:2, memoria:'Estava do lado dela quando ela entregou a Pokébola M. H. ao Magnus.'},
      registrar:'A Oona entregou ao Magnus a Pokébola M. H. — SETE, deixada num túmulo do Monte Pyre faz dezenove anos. É da filha dele, Mira, que foi pra Hoenn e nunca escreveu.'},
  escolhas:[
    {texto:'Olhar quem mais está na lista.', vai:'c38_a_lista'}
  ]
},

c38_a_lista:{
  texto:[
    'Em volta da mesa, quem veio de longe espera a hora.',
    d => d.flags.sv_rec_milotic
      ? (d.flags.sv_penrose_pagou
          ? 'A Esme está com a fita lilás na cintura de novo, com a Milotic dentro. Quando te vê, ela sorri o sorriso de palco, e depois para de sorrir, porque a ilha inteira já ouviu o que saiu no barco do Penrose.'
          : 'A Esme está com a fita lilás na cintura de novo, com a Milotic dentro, e quando te vê não sorri o sorriso de palco: sorri outro, pequeno, sem foto nenhuma.')
      : 'A Esme está com a fita lilás vazia na cintura, de propósito, pra todo mundo ver.',
    d => d.flags.sv_rec_etta ? 'A Etta montou a toalha com as oitenta e quatro bolas na arquibancada, e vende pra quem passa, e corrige quem diz "comum".' : 'A Etta está sentada sozinha num degrau, sem mochila, com o braço cruzado.',
    d => d.flags.sv_rec_ovos ? 'O Florian está com a caixa térmica no colo, ligada numa extensão que vai até a pousada, e cumprimenta todo mundo com uma porcentagem.' : 'O Florian está sem a caixa térmica. Ele não fala de porcentagem com ninguém.',
    d => d.flags.sv_rec_turma ? 'Na arquibancada, doze capacetes laranja cantam a música de cais, cada um com um Pokémon de trabalho no colo, e o Brody chora antes de começar.' : 'Na arquibancada, doze capacetes laranja estão quietos, sem Pokémon nenhum no colo, e o Brody olha pro mar.',
    d => Sevii.noaInscrita(d)
      ? 'E na lista, na linha antes da sua, escrito com a letra mais torta da página: NOA KELP — ILHA UM.'
      : d.flags.sv_noa_rival ? 'A Noa está do lado de fora da arena, sentada no muro, olhando pra dentro. Ela não está na lista.' : '',
    d => Sevii.noaInscrita(d) ? fala('Noa', 'Eu não devia estar aqui. É por isso que eu vou ganhar.', null, 'Ela fala isso passando por você, sem parar, com o Murkrow no ombro.') : ''
  ],
  escolhas:[
    {texto:'Perguntar ao Magnus do patrocinador.', vai:'c38_o_patrocinio'}
  ]
},

c38_o_patrocinio:{
  texto:[
    d => d.flags.sv_penrose_preso
      ? fala('Magnus', 'O patrocinador está numa cela na Ilha Um. O troféu eu pago. Sempre paguei, na verdade: ele só punha o nome no cartaz.')
      : d.flags.sv_penrose_pagou
      ? fala('Magnus', 'O patrocinador mandou dizer que está tudo certo. Ele sempre manda dizer que está tudo certo.', 'frio')
      : fala('Magnus', 'O patrocinador não veio. Deixou o troféu na pousada, embrulhado em papel de conserva, sem cartão.'),
    d => d.flags.sv_penrose_pagou ? 'Ele olha pra você um segundo a mais do que olhou os outros. Na ilha, notícia anda de barco.' : '',
    fala('Magnus', 'Agora vai. Faltam dez minutos, e eu ainda tenho que subir o morro de bengala.')
  ],
  escolhas:[
    {texto:'Subir pra arena.', vai:'c38_a_arena'}
  ]
},

c38_a_arena:{
  texto:[
    'A arquibancada de pedra está cheia: gente das sete ilhas, de chapéu de palha e de luva de gelo, gente de Johto com bandeira de cidade, e a turma de Slateport cantando.',
    'Na lousa da entrada, o rapaz da cal terminou os dezesseis risquinhos, e o seu nome está em um deles, com a letra dele.',
    d => d.flags.sv_blue_convidado && ((d.npcs['Blue'] || {}).opiniao || 0) >= 4
      ? 'E lá em cima, no último degrau, de boné, sentado em cima da jaqueta dobrada porque pedra é ruim pra sentar o dia inteiro, o Blue. Ele não acena. Mas veio.'
      : d.flags.sv_blue_convidado ? 'Você procura um boné conhecido no último degrau. Não tem. Pedra é ruim pra sentar o dia inteiro.' : '',
  ],
  ef:{executar:d => { if (d.flags.sv_blue_convidado && ((d.npcs['Blue'] || {}).opiniao || 0) >= 4) Estado.marcar('sv_blue_na_arquibancada'); }},
  escolhas:[
    {texto:'Entrar na chave.', copa:{vitoria:'c38_campeao', derrota:'c38_caiu'}, cond:d => !d.flags.sv_copa_da_historia},
    {texto:'Sair da arena.', vai:'c38_campeao', cond:d => !!d.flags.sv_copa_da_historia && !!_c38Campeao(d).voce},
    {texto:'Sair da arena.', vai:'c38_caiu', cond:d => !!d.flags.sv_copa_da_historia && !_c38Campeao(d).voce}
  ]
},

c38_campeao:{
  texto:[
    'O rapaz da cal escreve o seu nome no alto da lousa, devagar, perguntando cada letra, e a arquibancada de pedra soletra junto com ele.',
    'O Magnus desce o morro de bengala até o meio da arena e te entrega o troféu com as duas mãos: uma arena redonda de latão, pequena, com sete pontos em volta, um pra cada ilha.',
    fala('Magnus', 'Duas vezes eu ganhei isso. Hoje eu entreguei pela primeira vez pra alguém que eu escrevi.'),
    d => d.flags.sv_blue_na_arquibancada ? 'Lá do último degrau, o Blue levanta. Não grita, não aplaude. Fica de pé, que é o jeito dele.' : '',
    d => Sevii.noaInscrita(d) ? 'Do lado de fora da linha da arena, a Noa está de braço cruzado, contando alguma coisa nos dedos.' : '',
    d => d.flags.sv_rec_ovos ? 'O Florian desce da arquibancada com um ovo nas duas mãos, segurado como quem segura vidro, e não fala de porcentagem nenhuma.' : ''
  ],
  ef:{rep:{eixo:'bom', delta:2, motivo:'Venceu o Torneio das Ilhas, na arena da Ilha Sete', notorio:true},
      registrar:'Venceu o Torneio das Ilhas na arena de pedra da Ilha Sete. O Magnus Holm entregou o troféu.'},
  escolhas:[
    {texto:'Descer o morro.', vai:'c38_fim'}
  ]
},

c38_caiu:{
  texto:[
    d => {
      const c = _c38Campeao(d);
      return c.nome ? `No fim da tarde, o rapaz da cal escreve no alto da lousa: ${c.nome.toUpperCase()}. A arquibancada de pedra levanta inteira.` : 'No fim da tarde, o rapaz da cal escreve um nome no alto da lousa, e a arquibancada de pedra levanta inteira.';
    },
    d => {
      const c = _c38Campeao(d);
      if (c.id === 'gideon') return 'É o Gideon. Quarenta e três vezes. O velho de chapéu de pano fica parado no meio da arena com o Lapras do lado, sem saber o que fazer com as mãos, e o Magnus desce o morro de bengala pra apertar a mão dele, cinquenta e poucos anos depois.';
      if (c.id === 'noa') return 'É a Noa. Ela fica parada no meio da arena, sem acreditar, e o Murkrow dá uma volta inteira por cima da arquibancada. O prêmio paga a dívida duas vezes.';
      if (c.id === 'esme') return 'É a Esme. Ela levanta o troféu sem sorriso de palco nenhum, e diz alto, pra arquibancada inteira, que vai mandar pra redação de uma revista.';
      if (c.id === 'rhys') return 'É o Rhys. Ele agradece o Magnus com uma reverência curta e olha pra arquibancada procurando você.';
      if (c.id === 'magnus') return 'É o Magnus, aos setenta e quatro anos, pela terceira vez. Ele ri tanto que a bengala cai.';
      return 'O Magnus desce o morro de bengala até o meio da arena e entrega o troféu com as duas mãos.';
    },
    fala('Magnus', 'Domingo que vem tem de novo. Quem veio de longe fica mais um pouco. Quem perdeu, também.', 'riso'),
    d => d.flags.sv_blue_na_arquibancada ? 'Lá do último degrau, o Blue desce até você e senta do seu lado sem dizer nada por um tempo. "Catorze minutos", ele diz no fim. "Você durou mais."' : ''
  ],
  ef:{registrar:'Caiu no Torneio das Ilhas, na arena da Ilha Sete.'},
  escolhas:[
    {texto:'Descer o morro.', vai:'c38_fim'}
  ]
},

c38_fim:{
  texto:[
    'De noite a varanda da pousada da arena enche: Johto numa ponta, Hoenn na outra, e no meio quem ainda não decidiu de que lado senta.',
    d => d.flags.sv_magnus_mira ? 'O Magnus passa a noite perguntando a quem é de Hoenn quanto tempo leva o barco até Slateport. Pergunta pra todo mundo. Anota.' : '',
    d => d.flags.sv_penrose_preso ? 'Na Ilha Um, o Sargento Lund escreve uma carta por família, uma por uma, com letra grande.' : d.flags.sv_penrose_pagou ? 'Em algum lugar no mar aberto, um barco sem luz vai embora com caixote de etiqueta de preço.' : 'Em algum lugar no mar aberto, um senhor de terno branco vai embora num barco sem luz e sem caixote nenhum.',
    'O S.S. Anne vai passar na Ilha Um de volta pra Vermilion daqui a uma semana. A balsa das ilhas, agora, faz a linha inteira todo dia.',
    'E o Torneio das Ilhas, diz o rapaz da cal, volta todo domingo enquanto tiver gente.',
    d => d.flags.sv_pedido_no_bolso ? 'No seu bolso, a folha do armazém, dobrada em quatro. Você não precisa desdobrar pra lembrar da última linha: remessa norte, Ilhas do Redemoinho.' : ''
  ],
  ef:{registrar:'Fim da semana do Torneio das Ilhas. A balsa das ilhas vai e volta, e a arena da Ilha Sete abre todo domingo.',
    /* o dia do fim: quem veio de longe embarca no Anne ESTADIA_DO_ELENCO depois (sevii.js) */
    executar:d => { const r = Sevii.reg(d); if (r.fimDoArco == null) r.fimDoArco = d.relogio.dia; }},
  fim:true, sai:'ilha_sete',
  resumo:'O Torneio das Ilhas: dezesseis risquinhos de cal numa lousa, uma Pokébola vazia com as letras M. H., e a arena de pedra cheia.'
}

}
});
