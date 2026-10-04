/* ------------------------------------------------------------
   ABERTURAS — alguém te inscreveu no chaveamento sem assinar.
   Você descobre isso no quadro, na mesa, na arquibancada ou na
   boca de outro inscrito.
   ------------------------------------------------------------ */
const C22_ABERTURAS = ['c22_o_quadro', 'c22_ab_a_arquibancada', 'c22_ab_o_outro_inscrito', 'c22_ab_o_recibo'];
function c22_cabe(id, d){ return true; }
function c22_abertura(d){ return Dados.escolher(C22_ABERTURAS.filter(id => c22_cabe(id, d))); }

/* ============================================================
   CAPÍTULO 22 — O CHAVEAMENTO
   Planalto Indigo. Arena aberta. O seu nome está no quadro e
   você não se inscreveu.
   ============================================================ */
CAPITULOS.push(

{
num:22, titulo:'O Chaveamento', local:'Planalto Indigo — arena aberta', ambiente:'montanha', nivelArea:54,
tom:'sombrio', entradas:C22_ABERTURAS,
inicio: d => c22_abertura(d),
cenas:{

c22_ab_a_arquibancada:{
  texto:[
    'A arena aberta do Planalto é uma estrutura de concreto para mil e duzentas pessoas e hoje tem umas noventa nela, espalhadas de um jeito que faz parecer menos.',
    'Você senta na arquibancada antes de procurar qualquer coisa, porque chegou cedo e porque sentar é de graça.',
    'Na fileira de baixo, três pessoas discutem o chaveamento com uma folha mimeografada na mão.',
    fala('o homem da folha', 'Chave quatro é o que eu não entendo.'),
    fala('a mulher do lado', 'Por quê?'),
    fala('o homem da folha', 'Porque a chave quatro tem um nome que não tava na lista de ontem.'),
    'Ele bate na folha com as costas da mão.',
    fala('o homem da folha', 'Eu peguei a lista ontem às seis. Trinta e um nomes. Hoje tem trinta e dois.'),
    d=>`Você inclina a cabeça pra ler a folha de cima e o nome da chave quatro é o seu, com a sua cidade embaixo: ${d.jogador.cidade}.`,
    'Você não preencheu ficha nenhuma. Você não pagou inscrição nenhuma. Você chegou aqui hoje.'
  ],
  ef:{flag:['inscrito_por_terceiro','o_nome_entrou_de_noite'],
      registrar:'Seu nome entrou no chaveamento entre as seis da tarde de ontem e a manhã de hoje.',
      presagio:'Trinta e um viraram trinta e dois de noite, com a mesa fechada.'},
  escolhas:[
    {texto:'Descer e falar com o funcionário da mesa.', vai:'c22_o_quadro'},
    {texto:'Falar com os três da folha mimeografada.', vai:'c22_ab_os_tres_da_folha'},
    {texto:'Ficar sentad{o|a} e ver quem aparece.', vai:'c22_aceitou'}
  ]
},

c22_ab_os_tres_da_folha:{
  texto:[
    'Você desce uma fileira e senta do lado deles, e mostra o cartão de treinador, e o homem da folha olha o cartão e olha a folha e olha o cartão de novo.',
    fala('o homem da folha', 'É você.'),
    d=>fala(d.jogador.nome, 'Eu não me inscrevi.'),
    'Os três se olham. A mulher do lado é a que responde.',
    fala('a mulher do lado', 'Isso já aconteceu duas vezes esse ano.'),
    d=>fala(d.jogador.nome, 'Já aconteceu?'),
    fala('a mulher do lado', 'Em março e em julho. Dois inscritos que apareceram na véspera e que ninguém conhecia.'),
    fala('o homem da folha', 'Os dois ganharam o torneio.'),
    'Silêncio dos quatro.',
    fala('a mulher do lado', 'E os dois sumiram depois. Não é conspiração, é fato: os dois não aparecem em nenhum torneio desde então.'),
    fala('a mulher do lado', 'Eu procurei. Eu acompanho isso.', 'baixo')
  ],
  ef:{flag:['dois_inscritos_antes','inscrito_por_terceiro'],
      npc:{nome:'a mulher do lado', opiniao:2, viuVoce:'Te contou dos dois inscritos de véspera que ganharam e sumiram.'},
      registrar:'Já houve dois inscritos de véspera este ano. Os dois venceram e não competiram mais.'},
  escolhas:[
    {texto:'Descer e exigir o nome de quem pagou.', vai:'c22_exigiu_o_nome'},
    {texto:'Recusar a vaga.', vai:'c22_recusou_a_vaga'},
    {texto:'Aceitar e lutar.', vai:'c22_aceitou'}
  ]
},

c22_ab_o_outro_inscrito:{
  texto:[
    'Tem um rapaz de uns dezenove anos sentado no chão encostado na parede da arena, com o chaveamento impresso no colo e uma caneta, e ele está circulando nomes.',
    'Ele te vê chegar e circula mais um sem olhar pra folha.',
    fala('o rapaz da caneta', 'Chave quatro.'),
    d=>fala(d.jogador.nome, 'Como você sabe?'),
    fala('o rapaz da caneta', 'Porque eu sou chave cinco e a chave cinco luta com a chave quatro na segunda rodada.'),
    'Ele levanta a folha e mostra. Tem sete nomes circulados de trinta e dois.',
    fala('o rapaz da caneta', 'Eu circulo os que eu conheço de vista. Sete, de trinta e dois.'),
    d=>fala(d.jogador.nome, 'E os outros vinte e cinco?'),
    fala('o rapaz da caneta', 'É isso que eu tô tentando entender desde ontem à noite.'),
    'Ele põe a tampa na caneta.',
    fala('o rapaz da caneta', 'Esse é o oitavo torneio aberto que eu faço. Normalmente eu conheço uns vinte.')
  ],
  ef:{flag:['inscrito_por_terceiro','vinte_e_cinco_desconhecidos'],
      npc:{nome:'o rapaz da caneta', opiniao:1, viuVoce:'Te identificou como chave quatro antes de você falar.'},
      registrar:'Num torneio de 32, um veterano de oito torneios reconhece só sete nomes.',
      presagio:'Vinte e cinco desconhecidos num chaveamento não é acaso: é um chaveamento montado.'},
  escolhas:[
    {texto:'Ir até a mesa perguntar quem pagou a sua inscrição.', vai:'c22_o_quadro'},
    {texto:'Perguntar quais sete ele conhece.', vai:'c22_ab_os_sete'},
    {texto:'Aceitar e lutar.', vai:'c22_aceitou'}
  ]
},

c22_ab_os_sete:{
  texto:[
    'Ele lê os sete em voz alta, com a cidade de cada um.',
    'Três de Saffron, dois de Celadon, um de Vermilion, um de Pewter.',
    fala('o rapaz da caneta', 'O de Pewter sou eu.'),
    'Ele dobra a folha no meio.',
    fala('o rapaz da caneta', 'Sabe o que me incomoda? Os vinte e cinco também têm cidade escrita embaixo.'),
    d=>fala(d.jogador.nome, 'E daí?'),
    fala('o rapaz da caneta', 'E daí que eu conheço treinador de Saffron, de Celadon, de Vermilion. Eu viajo.'),
    fala('o rapaz da caneta', 'Dezoito dos vinte e cinco são dessas três cidades, e eu não conheço nenhum.'),
    'Ele guarda a folha no bolso de trás.',
    fala('o rapaz da caneta', 'Dezoito desconhecidos das três cidades maiores, no mesmo chaveamento.', 'baixo')
  ],
  ef:{flag:'o_chaveamento_e_de_tres_cidades',
      registrar:'Dezoito dos 25 inscritos desconhecidos são de Saffron, Celadon ou Vermilion.',
      presagio:d=>d.flags.o_criterio_administrativo
        ? 'É o mesmo recorte da lista de convocação. As mesmas três cidades, de novo.'
        : 'Dezoito estranhos das mesmas três cidades não é sorteio. É lista.'},
  escolhas:[
    {texto:'Ir até a mesa perguntar quem pagou.', vai:'c22_o_quadro'},
    {texto:'Recusar a vaga.', vai:'c22_recusou_a_vaga'},
    {texto:'Aceitar e lutar.', vai:'c22_aceitou'}
  ]
},

c22_ab_o_recibo:{
  texto:[
    'Você chega na mesa de inscrição antes de olhar o quadro, porque em algum momento dos últimos meses você virou o tipo de pessoa que procura o papel antes de procurar o fato.',
    d=>fala(d.jogador.nome, 'Eu queria me inscrever no aberto.'),
    fala('o funcionário da mesa', 'Nome?'),
    'Você diz. Ele corre o dedo pela coluna e para.',
    fala('o funcionário da mesa', 'Você já tá inscrit{o|a}.'),
    d=>fala(d.jogador.nome, 'Não tô.'),
    fala('o funcionário da mesa', 'Tá sim, ó: chave quatro. Inscrição paga e confirmada.'),
    'Ele vira o livro na sua direção pra te mostrar, com a boa vontade de quem acha que está resolvendo um mal-entendido.',
    'Tem um número de recibo na coluna da direita.',
    d=>fala(d.jogador.nome, 'Esse recibo, quem emitiu?'),
    'Ele olha o número. Depois olha de novo.',
    fala('o funcionário da mesa', 'Esse recibo não é do talão daqui.', 'baixo')
  ],
  ef:{flag:['inscrito_por_terceiro','o_recibo_de_outro_talao'],
      registrar:'A sua inscrição foi paga com um recibo de um talão que não é o da mesa do torneio.',
      presagio:'Recibo de outro talão quer dizer que o pagamento entrou por outro caixa, e caixa tem dono.'},
  escolhas:[
    {texto:'Pedir pra ele descobrir de que talão é.', vai:'c22_exigiu_o_nome'},
    {texto:'Olhar o quadro de chaveamento antes.', vai:'c22_o_quadro'},
    {texto:'Recusar a vaga.', vai:'c22_recusou_a_vaga'},
    {texto:'Aceitar e lutar.', vai:'c22_aceitou'}
  ]
},


c22_o_quadro:{
  texto:[
    'O quadro de chaveamento da arena aberta é uma folha de cortiça de dois metros com trinta e dois nomes escritos à mão, presos com percevejo.',
    'Trinta e um deles se inscreveram.',
    d=>`O seu está na chave quatro, escrito com a mesma caneta de todos os outros, com a sua cidade embaixo: ${d.jogador.cidade}.`,
    'Você não preencheu ficha nenhuma. Você não pagou inscrição nenhuma. Você chegou aqui hoje.',
    fala('o funcionário da mesa', 'Inscrição paga e confirmada, {moço|moça}. Tá tudo certo aqui no meu papel.'),
    fala('o funcionário da mesa', 'Paga por terceiro. Isso é normal, acontece direto, patrocínio de loja, de família, de ginásio.'),
    fala('o funcionário da mesa', 'Campo do pagador…', null, 'Ele corre o dedo pela coluna e para.'),
    fala('o funcionário da mesa', 'Em branco.', 'baixo')
  ],
  ef:{flag:'inscrito_por_terceiro',
      registrar:'Alguém pagou a sua inscrição no torneio aberto e não assinou.'},
  escolhas:[
    {texto:'Exigir o nome de quem pagou. Tem que estar em algum lugar.', vai:'c22_exigiu_o_nome'},
    {texto:'Recusar a vaga. Sair do chaveamento.', vai:'c22_recusou_a_vaga'},
    {texto:'Aceitar e lutar. Quem pagou aparece ou não aparece.', vai:'c22_aceitou'},
    {texto:'Ligar pra alguém que possa saber disso.', vai:'c22_ligou_perguntando',
     cond:d=>Estado.temPokenav() && Estado.contatosNaAgenda().length > 1}
  ]
},

c22_exigiu_o_nome:{
  texto:[
    'Você exige, e o funcionário da mesa te leva à supervisora, e a supervisora abre uma pasta e vira a pasta pra você ver.',
    fala('a supervisora', 'Dinheiro vivo, no balcão, três dias atrás. Quem paga em dinheiro não deixa nome.'),
    fala('a supervisora', 'Eu posso te dizer o que o rapaz do balcão lembrou: mulher, de terno, crachá azul pendurado no bolso.'),
    d=>d.flags.sabe_dos_crachas ? 'Crachá azul. Na Silph, é o crachá que sobe até o décimo andar.' : 'Crachá azul. Você guarda o detalhe.',
    fala('a supervisora', 'Isso não é ilegal, {moço|moça}. É esquisito, e eu concordo que é esquisito, mas não é ilegal.')
  ],
  ef:{flag:'pagou_uma_de_cracha_azul',
      rep:{eixo:'bom',delta:1,motivo:'Exigiu saber quem estava pagando por você'},
      registrar:'Quem pagou a inscrição era uma mulher de terno, de crachá azul.'},
  escolhas:[
    {texto:'Aceitar a vaga sabendo de onde veio.', vai:'c22_aceitou'},
    {texto:'Recusar justamente por isso.', vai:'c22_recusou_a_vaga'},
    {texto:'Pagar a inscrição do seu bolso e devolver o dinheiro à mesa.', vai:'c22_pagou_do_bolso',
     cond:d=>d.jogador.dinheiro >= 2000}
  ]
},

c22_ligou_perguntando:{
  texto:[
    'Você sai do galpão da arena, senta no muro de fora e abre o aparelho.',
    'Você liga pra três números antes de conseguir uma resposta que presta, e a terceira é a que presta.',
    fala('quem te atendeu', 'Torneio aberto, chave quatro, inscrição paga por terceiro.'),
    fala('quem te atendeu', 'Escuta o que eu vou falar: isso não é presente. Isso é pra te colocar num lugar onde muita gente olha, num dia marcado.'),
    fala('quem te atendeu', 'Quem quer você visível quer você visível por um motivo. Vai lá e luta, mas vai sabendo.', 'baixo')
  ],
  ef:{flag:'avisado_do_torneio', moral:2,
      rep:{eixo:'bom',delta:1,motivo:'Perguntou antes de entrar'},
      registrar:'Ligou perguntando sobre a inscrição. Te disseram que era pra te deixar visível.'},
  escolhas:[
    {texto:'Ir lutar assim mesmo, agora sabendo.', vai:'c22_aceitou'},
    {texto:'Recusar a vaga.', vai:'c22_recusou_a_vaga'},
    {texto:'Exigir o nome de quem pagou antes de decidir.', vai:'c22_exigiu_o_nome'}
  ]
},

c22_pagou_do_bolso:{
  texto:[
    'Você põe dois mil na mesa e pede pra riscar o pagamento antigo e registrar o novo no seu nome.',
    fala('a supervisora', 'Eu vou ter que refazer três papéis por causa disso.'),
    fala('a supervisora', 'E eu vou refazer, porque em onze anos aqui você é a primeira pessoa que pediu pra pagar o que já estava pago.', 'riso'),
    'Ela risca, escreve, carimba, e devolve o dinheiro do desconhecido pro envelope da mesa.',
    'Sai de lá mais pobre e completamente seu.'
  ],
  ef:{dinheiro:-2000, flag:'pagou_a_propria_inscricao', moral:4,
      rep:{eixo:'bom',delta:2,motivo:'Pagou do bolso o que já estava pago, pra não dever a ninguém', rep:{notorio:true}},
      npc:{nome:'Supervisora da arena', opiniao:3, memoria:'Pagou a própria inscrição num torneio que já estava pago.'},
      registrar:'Pagou a própria inscrição pra não dever nada a quem pagou antes.'},
  escolhas:[{texto:'Entrar na arena.', vai:'c22_aceitou'}]
},

c22_recusou_a_vaga:{
  texto:[
    'Você pede pra tirar o seu nome do quadro e o funcionário da mesa demora a entender o pedido, porque ninguém faz esse pedido.',
    'Ele tira o percevejo e o papel sai, e o buraquinho fica.',
    'Trinta e um nomes. Uma chave com bye.',
    'Você sai do galpão e do lado de fora tem umas quarenta pessoas olhando o quadro, e uma delas — uma menina de uns treze anos — vê o seu nome sendo tirado e não entende, e você não vai ficar pra explicar.'
  ],
  ef:{flag:'recusou_o_torneio',
      rep:{eixo:'bom',delta:1,motivo:'Recusou uma vaga que alguém comprou pra você'},
      registrar:'Tirou o próprio nome do chaveamento.'},
  escolhas:[
    {texto:'Ir embora do Planalto.', vai:'c22_foi_embora'},
    {texto:'Ficar assistindo o torneio da arquibancada.', vai:'c22_da_arquibancada'},
    {texto:'Voltar e pedir a vaga de volta. Você pensou melhor.', vai:'c22_voltou_pro_quadro'}
  ]
},

c22_voltou_pro_quadro:{
  texto:[
    'Você volta ao galpão vinte minutos depois e o funcionário da mesa já está com o percevejo na mão, como quem esperava.',
    fala('o funcionário da mesa', 'Eu não joguei fora.', null, 'Ele tira o seu papel do bolso da camisa, dobrado.'),
    fala('o funcionário da mesa', 'Em onze anos aqui, sete pessoas tiraram o nome do quadro. Cinco voltaram.'),
    fala('o funcionário da mesa', 'Das cinco, três ganharam. Faz o que você quiser com essa informação.', 'riso')
  ],
  ef:{limpaFlag:'recusou_o_torneio', moral:3,
      registrar:'Voltou e pediu a vaga de volta. O funcionário tinha guardado o papel.'},
  escolhas:[{texto:'Entrar na arena.', vai:'c22_aceitou'}]
},

c22_da_arquibancada:{
  texto:[
    'Você assiste o torneio inteiro da arquibancada, com um saco de pipoca de quinhentos pokedólares e uma sensação incômoda no peito que você não quer nomear.',
    'A final é entre um garoto de Saffron e uma mulher de uns quarenta que ninguém conhecia até hoje de manhã.',
    'Ela ganha. Ela chora. O garoto de Saffron aplaude ela antes de qualquer pessoa da arquibancada aplaudir.',
    'É um torneio bonito. Você devia estar nele.'
  ],
  ef:{itens:{'Saco de pipoca':1}, moral:-3, flag:'assistiu_da_arquibancada',
      registrar:'Assistiu da arquibancada o torneio em que o seu nome estava.'},
  escolhas:[{texto:'Ir embora quando esvaziar.', vai:'c22_foi_embora'}]
},

/* ── o torneio ─────────────────────────────────────────────── */
c22_aceitou:{
  texto:[
    'A arena aberta não tem teto. É um círculo de terra batida de vinte metros com arquibancada de concreto dos quatro lados e uma torre de som que chia.',
    'Você luta três vezes em quatro horas.',
    'A primeira é contra um garoto de Fuchsia que decorou o seu time pelo boletim da Liga e montou tudo pra te vencer, e quase consegue, e perde por uma escolha errada no quinto turno.',
    'A segunda é contra uma mulher de Cinnabar que não decorou nada e luta pelo instinto, o que é muito pior de enfrentar.',
    'A terceira você não lembra direito depois, porque foi rápida demais.',
    fala('o locutor da arena', 'CHAVE QUATRO NA FINAL!', 'grita', 'A torre de som chia na palavra FINAL e a arquibancada acha graça.')
  ],
  ef:{flag:'chegou_na_final_do_aberto', moral:5,
      rep:{eixo:'bom',delta:2,motivo:'Chegou à final do torneio aberto do Planalto', rep:{notorio:true}},
      registrar:'Chegou à final do torneio aberto.'},
  escolhas:[
    {texto:'Ir pra final.', vai:'c22_a_final'},
    {texto:'Olhar a arquibancada primeiro, procurando um crachá azul.', vai:'c22_procurou_na_arquibancada'}
  ]
},

c22_procurou_na_arquibancada:{
  texto:[
    'Você para no meio da arena, antes da final, e olha a arquibancada inteira de propósito, setor por setor, com a torre de som chiando o seu nome.',
    'Oitocentas pessoas, talvez novecentas.',
    'Setor leste, fileira de cima, perto da saída: uma mulher de terno, sozinha numa fileira de doze lugares vazios, com um crachá azul pendurado no bolso do paletó.',
    'Ela não está olhando a arena. Ela está olhando você olhar a arquibancada.',
    'E quando você acha ela, ela levanta a mão e acena, devagar, como quem cumprimenta uma pessoa conhecida.'
  ],
  ef:{flag:'viu_a_mulher_do_cracha_azul',
      rep:{eixo:'bom',delta:1,motivo:'Procurou quem estava te olhando'},
      registrar:'Achou a mulher de crachá azul na arquibancada. Ela acenou de volta.'},
  escolhas:[
    {texto:'Acenar de volta.', vai:'c22_acenou_de_volta'},
    {texto:'Não acenar. Virar e lutar.', vai:'c22_a_final'},
    {texto:'Sair da arena e ir falar com ela agora.', vai:'c22_subiu_a_arquibancada'}
  ]
},

c22_acenou_de_volta:{
  texto:[
    'Você acena de volta, no meio da arena, com oitocentas pessoas achando que você está acenando pra elas.',
    'A arquibancada inteira acena de volta pra você, o que é hilário e o que você não vai conseguir explicar depois.',
    'A mulher do crachá azul ri. Dá pra ver daqui que ela ri.',
    'E aí ela senta, cruza as pernas, e fica esperando a final como quem comprou ingresso.'
  ],
  ef:{moral:4, flag:'acenou_pro_cracha_azul',
      rep:{eixo:'bom',delta:1,motivo:'Acenou de volta para quem estava te observando'},
      registrar:'Acenou pra mulher de crachá azul. A arquibancada inteira acenou de volta.'},
  escolhas:[{texto:'Lutar a final.', vai:'c22_a_final'}]
},

c22_subiu_a_arquibancada:{
  texto:[
    'Você sai da arena no meio da chamada da final e sobe cinquenta e dois degraus de concreto com o time no cinto e o locutor chiando o seu nome três vezes.',
    'Ela não levanta quando você chega. Ela tira a bolsa do lugar do lado pra você sentar.',
    fala('a mulher de crachá azul', 'Senta. Você tem quatro minutos antes de perderem a paciência.'),
    fala('a mulher de crachá azul', 'Eu paguei a sua inscrição. Eu não vou pedir desculpa e não vou explicar aqui.'),
    fala('a mulher de crachá azul', 'Vai ter uma sala, uma mesa comprida e quatro cadeiras, e nessa sala eu explico. Eu só precisava que mais gente te visse antes.'),
    fala('a mulher de crachá azul', 'Agora desce e ganha, porque se você perder tudo isso fica muito mais difícil.', 'frio')
  ],
  ef:{flag:'falou_com_o_cracha_azul',
      rep:{eixo:'bom',delta:1,motivo:'Subiu cinquenta e dois degraus pra perguntar na cara'},
      registrar:'Subiu a arquibancada no meio da final pra falar com a mulher de crachá azul.'},
  escolhas:[{texto:'Descer e lutar.', vai:'c22_a_final'}]
},

c22_a_final:{
  texto:[
    'A final é contra a mulher de uns quarenta anos que ninguém conhecia até hoje de manhã.',
    'Ela se chama Nadia. Ela se inscreveu sozinha, pagou a própria inscrição, e veio de ônibus de Lavender na madrugada.',
    'Ela tem um Arcanine que já foi de outra pessoa e que obedece a ela de um jeito que não se ensina em seis meses.',
    fala('Nadia', 'Eu tenho quarenta e um anos e essa é a minha segunda licença.'),
    fala('Nadia', 'A primeira caiu em 1979, porque eu passei seis meses sem registrar batalha, porque eu estava criando gente.'),
    fala('Nadia', 'Não pega leve comigo. Se você pegar leve eu vou saber, e aí não vale.', 'frio')
  ],
  batalha:{
    tipo:'treinador', fuga:false, treinador:'Nadia',
    dex:59, nivel:d=>Math.max(38, 34 + Estado.dados.insignias.length * 2),
    timeExtra:[{dex:26, mais:-2},{dex:94, mais:-1}],
    vitoria:'c22_venceu_a_final', derrota:'c22_perdeu_a_final'
  }
},

c22_venceu_a_final:{
  texto:[
    'Você ganha. Não é fácil e não é bonito, e o Arcanine dela fica de pé quatro turnos depois de qualquer Pokémon razoável ter caído.',
    'Ela atravessa a arena antes do locutor terminar de falar e aperta a sua mão com as duas dela.',
    fala('Nadia', 'Você não pegou leve. Obrigada.'),
    fala('Nadia', 'Me dá o seu número. Eu vou tirar a segunda insígnia em quatro meses e eu quero que você saiba o dia.'),
    'A taça é de plástico pintado e tem o ano errado gravado na base. Ninguém liga.'
  ],
  ef:{dinheiro:18000, flag:'venceu_o_aberto', moral:6,
      itens:{'Taça com o ano errado':1},
      npc:{nome:'Nadia Arden', opiniao:5, memoria:'Perdeu a final do aberto pra você e pediu o seu número.'},
      rep:{eixo:'bom',delta:3,motivo:'Venceu o torneio aberto do Planalto', rep:{notorio:true, peso:2}},
      registrar:'Venceu o torneio aberto do Planalto Indigo.'},
  escolhas:[
    {texto:'Dar o número e pegar o dela.', vai:'c22_trocou_numero',
     cond:d=>Estado.temPokenav()},
    {texto:'Agradecer e ir embora.', vai:'c22_foi_embora'}
  ]
},

c22_perdeu_a_final:{
  texto:[
    'Você perde. O Arcanine dela não cai, e em algum ponto do combate você entende que não vai cair, e continua tentando mesmo assim, que é a única coisa decente a fazer.',
    'Ela atravessa a arena antes do locutor terminar de falar e aperta a sua mão com as duas dela.',
    fala('Nadia', 'Você é {bom|boa}. Você vai ser muito melhor.'),
    fala('Nadia', 'Eu levei vinte e dois anos pra voltar pra essa arena. Você chegou aqui em quanto tempo?'),
    d=>fala(d.jogador.nome, 'Uns meses.'),
    fala('Nadia', 'Então não faz essa cara.', 'riso')
  ],
  ef:{dinheiro:6000, flag:'perdeu_o_aberto', moral:3,
      npc:{nome:'Nadia Arden', opiniao:4, memoria:'Ganhou a final do aberto de você e te consolou na arena.'},
      rep:{eixo:'bom',delta:1,motivo:'Chegou à final do aberto e perdeu direito'},
      registrar:'Perdeu a final do torneio aberto para a Nadia Arden.'},
  escolhas:[
    {texto:'Pedir o número dela.', vai:'c22_trocou_numero',
     cond:d=>Estado.temPokenav()},
    {texto:'Ir embora.', vai:'c22_foi_embora'}
  ]
},

c22_trocou_numero:{
  texto:[
    'Vocês trocam número no meio da arena, com a arquibancada esvaziando, com o locutor já falando de outra coisa.',
    fala('Nadia', 'Eu não sei usar isso direito. A minha filha que configurou.'),
    fala('Nadia', 'Se eu ligar errado e desligar na sua cara, não leva a mal. Liga de volta.', 'riso')
  ],
  ef:{flag:'numero_da_nadia', moral:3,
      rep:{eixo:'bom',delta:1,motivo:'Trocou número com quem te enfrentou de igual pra igual'},
      registrar:'Trocou número com a Nadia Arden.'},
  escolhas:[{texto:'Ir embora do Planalto.', vai:'c22_foi_embora'}]
},

c22_foi_embora:{
  texto:[
    'Você desce a estrada do Planalto no fim da tarde com a arquibancada esvaziando atrás de você e o quadro de cortiça já sem nome nenhum.',
    d=>d.flags.viu_a_mulher_do_cracha_azul || d.flags.pagou_uma_de_cracha_azul
      ? 'A vaga que alguém comprou pra você já foi usada. Quem comprou vai cobrar, e você já sabe que vai, e já sabe mais ou menos quando.'
      : 'Alguém pagou a sua inscrição e nunca apareceu, e isso vai ficar guardado num canto da sua cabeça pelo resto da estrada.',
    'Na descida você passa por uma placa nova, de madeira, que não estava aqui na sua última subida.',
    '**ROTA 23 — CONTROLE DE ACESSO. SETE POSTOS. TENHA O CARTÃO EM MÃOS.**'
  ],
  ef:{flag:'viu_a_placa_da_rota23',
      registrar:'Viu a placa nova do controle de acesso da Rota 23.'},
  fim:true
}

}
}

);
