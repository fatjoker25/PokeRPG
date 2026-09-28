/* ------------------------------------------------------------
   ABERTURAS — Cerulean é cidade de ponte, e ponte é lugar onde
   se vê quem chega. Quem desce do Monte inteiro, quem desce
   arrebentado e quem desce com nome já falado entram na cidade
   por ângulos diferentes.
   ------------------------------------------------------------ */
const C6_ABERTURAS = ['c6_chegada', 'c6_ab_pela_agua', 'c6_ab_arrebentado', 'c6_ab_cartaz', 'c6_ab_de_cracha'];
function c6_cabe(id, d){
  if (id === 'c6_ab_arrebentado')
    return (d.time || []).some(p => !p.morto && p.hp < p.hpMax * 0.5) || d.jogador.hp < Estado.hpMaxJogador() * 0.7;
  if (id === 'c6_ab_cartaz')  return Estado.rep.eixo === 'ruim' && Estado.rep.ruim >= 3;
  if (id === 'c6_ab_de_cracha') return typeof Cargos !== 'undefined' && Cargos.lista().length >= 1;
  return true;
}
function c6_abertura(d){
  const cand = C6_ABERTURAS.filter(id => c6_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 6 — O PREÇO DE UMA COISA VIVA  (Cerulean / Rota 25)
   ============================================================ */
CAPITULOS.push(
{
num:6, titulo:'O Preço de Uma Coisa Viva', local:'Cerulean / Rota 25', ambiente:'agua', nivelArea:22,
tom:'sombrio', entradas:C6_ABERTURAS,
inicio: d => c6_abertura(d),
cenas:{

c6_ab_pela_agua:{
  texto:[
    'A saída norte do Monte da Lua dá num córrego, e o córrego dá no rio, e tem um homem com uma chata de fundo chato amarrada numa raiz esperando exatamente isso: gente saindo da caverna sem vontade nenhuma de andar mais.',
    fala('o barqueiro', 'Cento e vinte até a ponte sul. Cento e oitenta se você quiser que eu vá devagar.'),
    d=>fala(d.jogador.nome, 'Por que alguém pagaria mais pra ir mais devagar?'),
    fala('o barqueiro', 'Você acabou de sair do Monte da Lua e tá me perguntando isso.'),
    'Você paga os cento e vinte, porque cento e oitenta é dinheiro, e ele vai devagar do mesmo jeito.',
    'O rio leva quarenta minutos e nos quarenta minutos não acontece absolutamente nada, e isso é a coisa mais generosa que te aconteceu em três dias.',
    'Cerulean aparece de baixo pra cima: primeiro as estacas das pontes, depois as pontes, depois a cidade em cima delas.'
  ],
  ef:{dinheiro:-120, flag:'desceu_de_chata', registrar:'Desceu o rio de chata até Cerulean.'},
  escolhas:[
    {texto:'Descer na ponte sul e ir ver o movimento.', vai:'c6_ponte_norte'},
    {texto:'Perguntar ao barqueiro o que mudou na cidade.', vai:'c6_ab_o_que_mudou'},
    {texto:'Descer e procurar onde se come.', vai:'c6_peixe'}
  ]
},

c6_ab_o_que_mudou:{
  texto:[
    'Ele demora a responder porque está manobrando, e manobrar uma chata exige as duas mãos e metade da cabeça.',
    fala('o barqueiro', 'Apareceu comprador.'),
    d=>fala(d.jogador.nome, 'Comprador de quê?'),
    fala('o barqueiro', 'De bicho. De Pokémon.'),
    'Ele encosta a chata na escadinha de pedra e amarra com um nó que leva um segundo e meio.',
    fala('o barqueiro', 'Sempre teve, né. Sempre teve gente comprando e vendendo. Mas agora tem preço de tabela.', 'baixo'),
    fala('o barqueiro', 'Quando vira tabela, não é mais um sujeito. É um negócio.')
  ],
  ef:{flag:'sabe_da_tabela', registrar:'Em Cerulean, comprar e vender Pokémon virou negócio com preço de tabela.',
      presagio:'Preço de tabela precisa de alguém que faça a tabela.'},
  escolhas:[
    {texto:'Descer e ir pra ponte norte, onde tem gente reunida.', vai:'c6_ponte_norte'},
    {texto:'Descer e olhar a cidade com calma.', vai:'c6_chegada'}
  ]
},

c6_ab_arrebentado:{
  texto:[
    'Você atravessa a primeira ponte de Cerulean encostando na mureta a cada vinte metros, e a mureta é fria e é boa.',
    'A cidade tem barulho de água o tempo todo e hoje isso não é bonito, é só barulho.',
    d=>{
      const p = (d.time || []).filter(x => !x.morto && x.hp < x.hpMax * 0.5)[0];
      return p ? `${nomeExib(p)} está na bola porque não dava pra andar do lado de fora, e você fica com a mão em cima da bola o caminho inteiro sem perceber que está fazendo isso.`
               : 'Você está inteir{o|a} por fora e nem um pouco por dentro, que é uma distinção que ninguém na rua consegue fazer olhando.';
    },
    'O Centro Pokémon de Cerulean fica na terceira quadra depois da ponte e tem uma fila de quatro pessoas, e as quatro estão iguais a você.',
    'Vocês não conversam. Ninguém que saiu do Monte da Lua hoje quer conversar.',
    'A enfermeira olha a sua ficha, olha você, e não pergunta nada. É o segundo Centro de Kanto em volume de atendimento e ela parou de perguntar faz tempo.'
  ],
  ef:{curaTime:true, flag:'chegou_quebrado_em_cerulean',
      registrar:'Chegou a Cerulean direto pro Centro Pokémon, e não foi o único.'},
  escolhas:[
    {texto:'Esperar sentad{o|a} até terminarem o atendimento.', vai:'c6_ab_sala_de_espera'},
    {texto:'Sair e ir pra ponte norte, onde tem gente reunida.', vai:'c6_ponte_norte'},
    {texto:'Sair e sentar na beira do rio.', vai:'c6_beira'}
  ]
},

c6_ab_sala_de_espera:{
  texto:[
    'A sala de espera do Centro de Cerulean tem doze cadeiras e uma televisão presa no alto com o som desligado.',
    'Na televisão está passando um programa sobre a Liga com o volume mudo, e todo mundo olha mesmo assim, porque o alternativo é olhar um pro outro.',
    'A mulher do seu lado é uns dez anos mais velha e tem uma bandagem no antebraço que ela mesma fez.',
    fala('a mulher da bandagem', 'Monte da Lua?'),
    d=>fala(d.jogador.nome, 'Monte da Lua.'),
    fala('a mulher da bandagem', 'Terceira vez que eu venho parar aqui vindo de lá.'),
    'Ela fala isso com um orgulho triste, do tipo que a pessoa não sabe que está demonstrando.',
    fala('a mulher da bandagem', 'Uma dica: nessa cidade não aceita bicho como pagamento em lugar nenhum. Se alguém te oferecer isso, é porque não é loja.', 'baixo')
  ],
  ef:{flag:'aviso_do_pagamento_em_bicho', registrar:'Em Cerulean, quem aceita Pokémon como pagamento não é loja.'},
  escolhas:[
    {texto:'Perguntar quem oferece isso.', vai:'c6_ab_quem_oferece'},
    {texto:'Agradecer e sair pra rua.', vai:'c6_chegada'}
  ]
},

c6_ab_quem_oferece:{
  texto:[
    'Ela olha pros lados antes de responder, e o fato de ela olhar pros lados numa sala de espera vazia é mais informativo que a resposta.',
    fala('a mulher da bandagem', 'Tem uma casa depois da segunda ponte. Portão verde. Não tem placa.'),
    fala('a mulher da bandagem', 'Eles não compram de qualquer um. Eles compram de quem tá precisando.'),
    d=>fala(d.jogador.nome, 'E como eles sabem quem tá precisando?'),
    fala('a mulher da bandagem', 'Porque quem tá precisando aparece na fila do Centro Pokémon sem dinheiro pra poção.'),
    'Ela volta a olhar a televisão muda.',
    fala('a mulher da bandagem', 'Eu tô te contando porque alguém me contou e eu não acreditei.')
  ],
  ef:{flag:'sabe_do_portao_verde', registrar:'Uma casa de portão verde, depois da segunda ponte, compra Pokémon de quem está precisando.',
      presagio:'Quem escolhe comprar de quem está precisando escolheu o preço antes de escolher a mercadoria.'},
  escolhas:[
    {texto:'Sair e ir direto pra estrada velha, depois da segunda ponte.', vai:'c6_estrada_velha', cond:d=>!!d.flags.ponto_da_van},
    {texto:'Sair pra rua e olhar a cidade primeiro.', vai:'c6_chegada'}
  ]
},

c6_ab_cartaz:{
  texto:[
    'Tem um quadro de avisos na cabeceira da ponte sul, daqueles com vidro e cadeado, e é ali que Cerulean pendura o que a cidade precisa saber.',
    'Aviso de dedetização. Horário da balsa. Um Growlithe perdido com foto ruim.',
    d=>{
      const r = Estado.nomeRep();
      return `E uma folha impressa, colada por dentro do vidro, com um retrato falado que não é bom e com uma palavra que é: "${r}".`;
    },
    d=>`A descrição diz ${Estado.descricaoFisica() || 'pouca coisa'}. É o bastante.`,
    'Uma mulher está lendo o quadro do seu lado. Ela lê o cartaz, olha pra você, e lê o cartaz de novo.',
    'Ela não grita. Ela dobra o jornal debaixo do braço e atravessa a ponte no sentido contrário ao seu, no passo de quem não quer que pareça pressa.',
    'Você tem entre trinta segundos e dez minutos.'
  ],
  ef:{flag:'seu_retrato_na_ponte', registrar:'Seu retrato falado está no quadro de avisos da ponte sul de Cerulean.'},
  escolhas:[
    {texto:'Arrancar o cartaz. É vidro com cadeado, mas vidro quebra.', vai:'c6_ab_quebrou_o_vidro'},
    {texto:'Sair da ponte e sumir no movimento da cidade.', vai:'c6_ab_sumiu'},
    {texto:'Ficar. Deixar acontecer o que vai acontecer.', vai:'c6_ab_ficou'}
  ]
},

c6_ab_quebrou_o_vidro:{
  texto:[
    'Você quebra o vidro com o cotovelo enrolado na manga, que é o jeito certo, e arranca a folha, que é o jeito errado de resolver o problema.',
    'O barulho de vidro numa ponte de pedra viaja. Três pessoas olham. Um homem numa banca de peixe grita alguma coisa que você não ouve porque já está andando.',
    'A folha na sua mão é uma folha. Tem mais quatro iguais em quatro quadros de avisos dessa cidade e você não sabe onde ficam os outros quatro.',
    'Você amassa e joga no rio, e o papel boia, o que é a pior coisa que papel pode fazer nessa situação.'
  ],
  ef:{rep:{eixo:'ruim', delta:2, motivo:'Quebrou o quadro de avisos da ponte sul na frente de meia dúzia de pessoas.'},
      flag:'quebrou_o_quadro', registrar:'Quebrou o quadro de avisos da ponte sul de Cerulean.'},
  escolhas:[
    {texto:'Sumir no movimento da cidade.', vai:'c6_chegada'}
  ]
},

c6_ab_sumiu:{
  texto:[
    'Você desce da ponte pelo lado de dentro, entra na primeira travessa, e faz a coisa que aprendeu sem ninguém ensinar: anda no ritmo de quem mora aqui.',
    'Duas quadras depois passa uma viatura branca e verde no sentido da ponte, sem sirene, no passo de quem foi chamado mas não foi chamado com urgência.',
    'Você não olha pra ela. Olhar pra viatura é o que denuncia.',
    'Na terceira quadra tem uma feira coberta e você entra na feira, porque feira é o melhor lugar do mundo pra deixar de existir por quarenta minutos.'
  ],
  ef:{flag:'sumiu_na_feira', registrar:'Sumiu na feira coberta de Cerulean antes da viatura chegar na ponte.'},
  escolhas:[
    {texto:'Sair da feira quando esfriar e ver a cidade.', vai:'c6_chegada'},
    {texto:'Ir direto pra estrada velha, depois da segunda ponte.', vai:'c6_estrada_velha', cond:d=>!!d.flags.ponto_da_van}
  ]
},

c6_ab_ficou:{
  texto:[
    'Você fica. Encosta na mureta da ponte e olha a água, que é o que todo mundo faz nessa ponte, e espera.',
    'Doze minutos depois param dois oficiais da Liga. Não é a polícia da cidade: é a Liga, de uniforme cinza, e isso é pior e melhor ao mesmo tempo.',
    fala('a oficial de cinza', 'Documento.'),
    'Você entrega. Ela lê com calma, compara com a folha do quadro, e a comparação não fecha do jeito que ela esperava que fechasse.',
    fala('a oficial de cinza', 'Esse retrato aqui é de três semanas atrás e foi feito por alguém que te viu de longe.'),
    fala('a oficial de cinza', 'A Liga tem três avisos abertos no seu nome. Aviso não é mandado. Você sabe a diferença?'),
    d=>fala(d.jogador.nome, 'Não.'),
    fala('a oficial de cinza', 'A diferença é que hoje eu te devolvo o documento.'),
    'Ela devolve. O parceiro dela anota alguma coisa numa prancheta e o ato de anotar demora mais do que precisaria.',
    fala('a oficial de cinza', 'Quarto aviso é mandado. Boa estadia em Cerulean.', 'frio')
  ],
  ef:{flag:'tres_avisos_da_liga',
      executar:d=>{ d.liga.avisos = Math.max(d.liga.avisos, 3); return [{tipo:'liga', texto:'A Liga registrou três avisos abertos no seu nome.'}]; },
      registrar:'Dois oficiais da Liga te pararam na ponte sul. Três avisos abertos; o quarto vira mandado.',
      presagio:'Ela devolveu o documento hoje. Ela disse "hoje" de propósito.'},
  escolhas:[
    {texto:'Seguir pra cidade com a conversa na cabeça.', vai:'c6_chegada'}
  ]
},

c6_ab_de_cracha:{
  texto:[
    d=>{
      const c = Cargos.principal();
      return `Na cabeceira da ponte sul tem um posto de fiscalização de pesca, e o rapaz do posto olha o seu crachá de ${c ? c.nome : 'serviço'} antes de olhar a sua cara.`;
    },
    'Isso nunca tinha acontecido com você. É uma inversão pequena e ela muda tudo.',
    fala('o rapaz do posto', 'Você é de fora, né? Assina aqui o livro de entrada, é protocolo.'),
    'Você assina. O livro tem quatro assinaturas hoje e a quarta é a sua.',
    fala('o rapaz do posto', 'Então, já que você tá aqui e é do serviço — eu posso te perguntar uma coisa fora do protocolo?'),
    d=>fala(d.jogador.nome, 'Pode.'),
    fala('o rapaz do posto', 'Quem é que fiscaliza venda de Pokémon nessa cidade?', 'baixo'),
    fala('o rapaz do posto', 'Eu perguntei pro meu chefe. Ele falou que é a Liga. Eu liguei pra Liga. A Liga falou que é a prefeitura.')
  ],
  ef:{flag:'ninguem_fiscaliza_a_venda',
      registrar:'Nenhum órgão assume a fiscalização de venda de Pokémon em Cerulean.',
      npc:{nome:'o rapaz do posto', opiniao:1, viuVoce:'Te reconheceu como gente do serviço na ponte sul.'},
      presagio:'Quando dois órgãos apontam um pro outro, o que tem no meio funciona sem ninguém olhando.'},
  escolhas:[
    {texto:'Perguntar o que ele viu que fez ele perguntar isso.', vai:'c6_ab_o_que_ele_viu'},
    {texto:'Anotar e seguir pra cidade.', vai:'c6_chegada'}
  ]
},

c6_ab_o_que_ele_viu:{
  texto:[
    'Ele fecha o livro de entrada antes de falar, o que não faz diferença nenhuma e faz toda diferença.',
    fala('o rapaz do posto', 'Passa caminhão-gaiola por essa ponte três vezes por semana. Terça, quinta e sábado, de madrugada.'),
    fala('o rapaz do posto', 'Gaiola de transporte é legal. Tem nota, tem tudo.'),
    d=>fala(d.jogador.nome, 'Então qual é o problema?'),
    fala('o rapaz do posto', 'A nota diz "material de pesca".'),
    'Ele dá de ombros de um jeito que não é despreocupação, é impotência.',
    fala('o rapaz do posto', 'Eu sou da pesca. Eu sei o que é material de pesca. E material de pesca não respira.')
  ],
  ef:{flag:'caminhao_gaiola_terca_quinta_sabado',
      registrar:'Caminhão-gaiola atravessa Cerulean terça, quinta e sábado de madrugada, com nota de "material de pesca".'},
  escolhas:[
    {texto:'Ir pra estrada velha, depois da segunda ponte.', vai:'c6_estrada_velha', cond:d=>!!d.flags.ponto_da_van},
    {texto:'Ir pra ponte norte, onde tem gente reunida.', vai:'c6_ponte_norte'},
    {texto:'Andar pela cidade e entender onde você está.', vai:'c6_chegada'}
  ]
},


c6_chegada:{
  texto:[
    'Cerulean é a primeira cidade da sua vida que tem barulho de água o tempo todo.',
    'O rio corta a cidade em duas e as três pontes são o centro de tudo: é onde tem gente, é onde tem banca, é onde as pessoas param no meio pra olhar a água como se fosse a primeira vez.',
    d=>{
      const r = Estado.nomeRep();
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=4) return `Na ponte sul, um rapaz cutuca o amigo e aponta com o queixo. "${r}", ele diz baixo, e é sobre você, e você não sabe onde pôr a cara.`;
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=4) return 'Uma mulher puxa a criança pra perto quando você passa na ponte. O lojista te acompanha com os olhos do balcão até a porta.';
      return 'Ninguém aqui faz ideia de quem você é, e depois do Monte da Lua isso é quase um presente.';
    },
    'A cidade cheira a água doce e a peixe frito, nessa ordem, e as duas coisas vêm da mesma direção.'
  ],
  ef:{registrar:'Chegou a Cerulean.'},
  escolhas:[
    {texto:'Ir até a ponte norte, onde tem gente reunida.', vai:'c6_ponte_norte'},
    {texto:'Procurar onde se come nessa cidade.', vai:'c6_peixe'},
    {texto:'Ir direto pra estrada velha, depois da segunda ponte.', vai:'c6_estrada_velha', cond:d=>!!d.flags.ponto_da_van},
    {texto:'Sentar na beira do rio e não fazer nada por um tempo.', vai:'c6_beira'}
  ]
},

c6_beira:{
  texto:[
    'Você desce pela escadinha de pedra até a margem e senta com os pés a vinte centímetros da água.',
    'Depois de uma caverna, água correndo é quase indecente de tão viva.',
    'Um Poliwag aparece na margem oposta, olha pra você por uns quinze segundos, e some.',
    'Um senhor pesca a uns trinta metros com uma vara de bambu e não pega nada e claramente não está ali pra pegar nada.',
    d=>d.flags.carregou_paras ? 'Você percebe que está com as duas mãos abertas em cima dos joelhos, do jeito que ficaram quando a enfermeira tirou o Paras delas.' : 'Você fica um tempo sem pensar em nada, e isso não acontecia havia dias.'
  ],
  ef:{hp:4},
  escolhas:[
    {texto:'Ir falar com o pescador.', vai:'c6_pescador'},
    {texto:'Ir pra ponte norte.', vai:'c6_ponte_norte'},
    {texto:'Ficar mais um pouco.', vai:'c6_beira_2'},
    {texto:'Ir comer alguma coisa.', vai:'c6_peixe'}
  ]
},

c6_beira_2:{
  texto:[
    'Você fica.',
    'A luz na água faz aquela coisa que luz na água faz e você entende, sentad{o|a} ali, por que tem gente que mora em cidade de rio a vida inteira e nunca sai.',
    'Em algum momento você tira um dos seus da bola e ele senta do seu lado, e vocês dois ficam olhando a mesma água.',
    'Ninguém passa. Ninguém precisa de nada. Dura uns quarenta minutos e é o melhor pedaço da semana.'
  ],
  ef:{hp:3, moral:8, presagio:'Guarda esse quarenta minutos. Vai ser difícil conseguir outro igual.'},
  escolhas:[
    {texto:'Ir pra ponte norte.', vai:'c6_ponte_norte'},
    {texto:'Ir falar com o pescador.', vai:'c6_pescador'},
    {texto:'Ir comer.', vai:'c6_peixe'}
  ]
},

c6_pescador:{
  texto:[
    'O senhor da vara de bambu não se incomoda de ter companhia. Ele aponta a pedra do lado como quem oferece cadeira.',
    '"Não tá pegando nada", ele avisa, com orgulho.',
    '"Tem peixe?"',
    '"Tem. Tem muito." Ele ajeita a linha. "Eu é que não pego."',
    'Ele fica calado um tempo e depois diz, do nada:',
    '"O rio mudou de cor duas vezes esse mês."'
  ],
  ef:{npc:{nome:'Sr. Cosmo', opiniao:1, memoria:'O pescador da margem de Cerulean. Falou do rio mudando de cor.'}},
  escolhas:[
    {texto:'"Mudou de cor como?"', vai:'c6_rio_cor'},
    {texto:'"E ninguém fez nada?"', vai:'c6_rio_ninguem'},
    {texto:'"O senhor pesca aqui há quanto tempo?"', vai:'c6_bilac_tempo'},
    {texto:'Ficar calad{o|a} junto com ele.', vai:'c6_bilac_calado'}
  ]
},

c6_rio_cor:{
  texto:[
    '"Mudou de cor como?"',
    '"Marrom. Não marrom de terra — marrom de outra coisa." Ele mexe a linha. "E veio de cima. De cima é o Monte da Lua."',
    'Ele olha pra você pela primeira vez.',
    '"Você desceu de lá agora, né? Tá com poeira de pedra na costura da mochila."',
    'Você olha. Está.'
  ],
  ef:{flag:'rio_marrom', registrar:'O rio de Cerulean mudou de cor duas vezes este mês, e a água vem do Monte da Lua.',
      presagio:'Alguém está pondo alguma coisa na água lá em cima, ou tirando.'},
  escolhas:[
    {texto:'Contar pra ele o que você viu lá em cima.', vai:'c6_contou_bilac'},
    {texto:'"E ninguém fez nada?"', vai:'c6_rio_ninguem'},
    {texto:'"Não. Só passei." Mudar de assunto.', vai:'c6_bilac_tempo'},
    {texto:'Levantar e ir pra ponte norte.', vai:'c6_ponte_norte'}
  ]
},

c6_contou_bilac:{
  texto:[
    'Você conta. Não tudo — a parte da caverna, das gaiolas, do gerador.',
    'Sr. Cosmo escuta pescando, sem reagir.',
    'No fim ele diz: "Gerador a diesel."',
    '"É."',
    '"Diesel é o que faz a água ficar daquele marrom." Ele puxa a linha e a isca está intacta. "Eu trabalhei em barco trinta anos. Eu conheço esse marrom."',
    'Ele enrola a linha e guarda a vara, e é a primeira vez que você o vê fazer alguma coisa com pressa.',
    '"Vem cá. Você fala isso pra uma pessoa comigo."'
  ],
  ef:{flag:'bilac_sabe_do_diesel',
      npc:{nome:'Sr. Cosmo', opiniao:4, memoria:'Você contou do gerador a diesel e ele reconheceu a cor do rio.'},
      registrar:'Sr. Cosmo identificou o marrom do rio como diesel.'},
  escolhas:[
    {texto:'Ir com ele.', vai:'c6_bilac_leva'},
    {texto:'"Agora não." E ir pra ponte norte.', vai:'c6_ponte_norte'},
    {texto:'"Quem é a pessoa?"', vai:'c6_quem_e_a_pessoa'}
  ]
},

c6_quem_e_a_pessoa:{
  falante:'Sr. Cosmo',
  texto:[
    '"Quem é a pessoa?"',
    '"A Misty."',
    'Ele fala o nome do jeito que se fala o nome de quem se conhece desde criança.',
    '"Ela é o quê, da prefeitura?"',
    'Sr. Cosmo ri com a garganta.',
    '"Ela é a do ginásio, {moço|moça}." Ele põe a vara no ombro. "E ela é a única pessoa nessa cidade que já processou uma empresa por causa de peixe morto. Duas vezes."'
  ],
  ef:{flag:'sabe_da_misty',
      executar:d=>{ Mundo.descobrir('ginasio_cerulean'); Mundo.descobrir('achou_ginasio_cerulean'); return [{tipo:'eco', texto:'Agora você sabe onde fica o prédio da piscina coberta.'}]; },
      presagio:'A líder de ginásio dessa cidade processa empresa. Isso não é o que você esperava de líder de ginásio.'},
  escolhas:[
    {texto:'Ir com ele.', vai:'c6_bilac_leva'},
    {texto:'"Depois eu vou." Ir pra ponte norte.', vai:'c6_ponte_norte'},
    {texto:'"Duas vezes? Como foi?"', vai:'c6_misty_processos'}
  ]
},

c6_misty_processos:{
  texto:[
    '"Duas vezes? Como foi?"',
    '"A primeira foi uma tinturaria. Ela tinha dezenove anos e entrou com ação sozinha." Ele começa a andar e você acompanha. "Perdeu. Perdeu feio, e pagou custa."',
    '"E a segunda?"',
    '"A segunda foi ano retrasado, contra uma empresa de Saffron." Ele para de andar por um segundo. "Essa ela ganhou. E aí aconteceu uma coisa engraçada."',
    '"O quê?"',
    '"A empresa recorreu, e enquanto recorria comprou a tinturaria da primeira ação." Ele volta a andar. "Hoje é tudo a mesma gente, {moço|moça}. Tudo. Por isso que ela não processa mais ninguém."'
  ],
  ef:{flag:'historia_da_misty', registrar:'Misty processou duas empresas. A segunda comprou a primeira.',
      presagio:'Tudo vira a mesma gente. Você vai ver isso acontecer de novo, mais rápido.'},
  escolhas:[
    {texto:'Ir com ele até ela.', vai:'c6_bilac_leva'},
    {texto:'Ir pra ponte norte primeiro.', vai:'c6_ponte_norte'}
  ]
},

c6_bilac_leva:{
  texto:[
    'Sr. Cosmo te leva por três ruas até um prédio baixo e comprido com telhado de chapa e cheiro de cloro saindo pelas frestas.',
    'Lá dentro é uma piscina coberta, olímpica, com eco.',
    'Tem uma mulher de uns vinte e poucos anos sentada na borda com os pés na água e uma pasta de plástico no colo, discutindo com alguém no telefone sobre uma coisa chamada "outorga".',
    'Ela levanta a mão pedindo um minuto sem olhar pra vocês. Esse minuto dura onze.',
    'Quando desliga, ela guarda a pasta e diz: "Cosmo. O que foi?"'
  ],
  ef:{executar:d=>{ Mundo.descobrir('ginasio_cerulean'); Mundo.descobrir('achou_ginasio_cerulean'); return []; },
      npc:{nome:'Líder Misty', opiniao:0, memoria:'Você a conheceu na borda da piscina, discutindo outorga por telefone.'}},
  escolhas:[
    {texto:'Contar do gerador e do rio.', vai:'c6_misty_diesel'},
    {texto:'"Eu vim desafiar o ginásio." (Não era isso que você ia falar.)', vai:'c6_misty_desafio'},
    {texto:'Deixar o Cosmo falar.', vai:'c6_misty_diesel'},
    {texto:'"Nada. A gente se enganou." E sair.', vai:'c6_ponte_norte'}
  ]
},

c6_misty_desafio:{
  texto:[
    '"Eu vim desafiar o ginásio."',
    'Misty olha pro Cosmo. O Cosmo olha pro teto.',
    '"Desafio é de manhã e de tarde, com licença na mão, e hoje já passou das cinco." Ela fala sem nenhuma hostilidade, do jeito de quem repete isso oito vezes por dia. "Você volta amanhã."',
    'Ela começa a se levantar. E aí para.',
    '"Espera. Você tá com poeira de pedra na mochila."'
  ],
  escolhas:[
    {texto:'Contar do gerador e do rio.', vai:'c6_misty_diesel'},
    {texto:'"É, eu vim do Monte da Lua." E parar aí.', vai:'c6_ponte_norte'},
    {texto:'Deixar o Cosmo falar.', vai:'c6_misty_diesel'}
  ]
},

c6_misty_diesel:{
  texto:[
    'Cosmo fala a parte do marrom. Você fala a parte do gerador.',
    'Misty não interrompe. Quando acaba, ela pergunta uma coisa só:',
    '"O gerador tá lá ainda?"',
    d=>d.flags.destruiu_operacao || d.flags.expos_operacao ? '"Não. Levaram tudo."' : '"Tava lá quando eu saí."',
    'Ela pensa, com o pé fazendo círculo na água.',
    '"Diesel em caverna cárstica vai pro lençol. Do lençol vem pro rio. Do rio vem pra torneira de metade dessa cidade." Ela fala isso com uma naturalidade assustadora, como quem lê um manual que decorou. "E ninguém vai medir nada, porque medir custa."',
    '"E a senhora não pode—"',
    '"Eu posso pedir." Ela corta. "Pedir eu posso. Eu peço desde março."'
  ],
  ef:{flag:'misty_sabe_do_diesel',
      npc:{nome:'Líder Misty', opiniao:3, memoria:'Você trouxe a informação do gerador a diesel do Monte da Lua pra ela.'},
      rep:{eixo:'bom',delta:2,motivo:'Levou informação a quem podia usar'},
      registrar:'Misty sabe do diesel do Monte da Lua e pede providência desde março.',
      presagio:'"Eu peço desde março." Você vai ouvir variações disso em oito cidades.'},
  escolhas:[
    {texto:'"Se eu trouxer prova, a senhora usa?"', vai:'c6_misty_prova'},
    {texto:'"Por que ninguém faz nada nessa região?"', vai:'c6_misty_ninguem'},
    {texto:'Agradecer e sair.', vai:'c6_ponte_norte'},
    {texto:'Mostrar a folha com o brasão.', vai:'c6_misty_folha', cond:d=>!!d.flags.guardou_a_folha || !!d.flags.levou_a_pasta}
  ]
},

c6_misty_folha:{
  texto:[
    'Você tira a folha dobrada em quatro e entrega.',
    'Misty lê. Tira o pé da água. Lê de novo.',
    '"Onde você conseguiu isso?"',
    '"Numa mesa de cavalete dentro de uma caverna."',
    'Ela olha o rodapé. O brasão. A balança.',
    'E aí ela faz uma coisa que te assusta: ela devolve a folha rápido, quase empurrando na sua mão, como quem devolve uma coisa quente.',
    '"Guarda isso e não mostra pra mais ninguém aqui."',
    '"Por quê?"',
    '"Porque eu já vi esse brasão." Ela olha pra porta da piscina, que está aberta. "Num ofício. Endereçado a mim."'
  ],
  ef:{flag:'misty_viu_o_brasao',
      npc:{nome:'Líder Misty', opiniao:4, memoria:'Você mostrou a folha com o brasão da balança. Ela já tinha recebido um ofício com o mesmo brasão.'},
      registrar:'Misty já recebeu um ofício oficial com o brasão da balança.',
      presagio:'Eles escrevem para líderes de ginásio. Isso não é uma quadrilha.'},
  escolhas:[
    {texto:'"Que ofício?"', vai:'c6_misty_oficio'},
    {texto:'Guardar e sair.', vai:'c6_ponte_norte'},
    {texto:'"Se eu trouxer mais, a senhora usa?"', vai:'c6_misty_prova'}
  ]
},

c6_misty_oficio:{
  texto:[
    '"Que ofício?"',
    'Ela abre a pasta de plástico, folheia, e tira uma folha timbrada.',
    'Você lê. É educadíssimo. É a coisa mais educada que você já leu.',
    '"Comunicamos a instauração de procedimento de avaliação de idoneidade de custódia referente aos espécimes registrados sob a titularidade de V.Sa., nos termos do Art. 11 do Estatuto."',
    '"O que isso quer dizer?"',
    '"Quer dizer que alguém abriu um processo pra decidir se eu sou uma boa dona dos meus Pokémon." Ela guarda a folha. "Eu tenho um Starmie há nove anos. Ele dorme na minha cama."',
    'Ela fecha a pasta com força.',
    '"Eu não respondi. Tem gente que respondeu."'
  ],
  ef:{flag:'oficio_idoneidade', registrar:'Existe um procedimento de "avaliação de idoneidade de custódia" contra a líder de Cerulean.',
      presagio:'Art. 11. Alguém escreveu um estatuto, com artigos, sobre quem merece ficar com os próprios Pokémon.'},
  escolhas:[
    {texto:'"O que aconteceu com quem respondeu?"', vai:'c6_quem_respondeu'},
    {texto:'"Se eu trouxer mais prova, a senhora usa?"', vai:'c6_misty_prova'},
    {texto:'Guardar tudo isso e sair.', vai:'c6_ponte_norte'}
  ]
},

c6_quem_respondeu:{
  texto:[
    '"O que aconteceu com quem respondeu?"',
    'Misty demora a responder e a demora é a resposta.',
    '"Eu conheço um criador em Fuchsia que respondeu." Ela fala devagar. "Ele mandou os documentos todos, direitinho, com laudo veterinário e tudo, porque ele achou que era fiscalização."',
    '"E?"',
    '"E eles agradeceram muito educadamente, arquivaram, e três meses depois voltaram com uma decisão."',
    'Ela olha pra água.',
    '"Ele não tem mais os Pokémon dele. Foi tudo legal. Tem número de processo."'
  ],
  ef:{flag:'caso_de_fuchsia', registrar:'Um criador de Fuchsia perdeu todos os Pokémon por decisão com número de processo.',
      presagio:'Foi tudo legal. Essa vai ser a frase mais assustadora dessa jornada.'},
  escolhas:[
    {texto:'"Se eu trouxer prova, a senhora usa?"', vai:'c6_misty_prova'},
    {texto:'"Qual o nome dele? Do criador."', vai:'c6_nome_criador'},
    {texto:'Sair. É informação demais.', vai:'c6_ponte_norte'}
  ]
},

c6_nome_criador:{
  texto:[
    '"Qual o nome dele? Do criador."',
    '"Por quê?"',
    '"Porque eu vou passar em Fuchsia."',
    'Misty te olha com uma desconfiança nova — não de você, mas da própria vontade de responder.',
    '"Ele se chama Ulisses. Tem um sítio na estrada da Zona Safári, do lado esquerdo, com um portão azul."',
    'Ela pega uma caneta e escreve no verso de um panfleto de horário de piscina.',
    '"E se você for lá, leva comida. Ele não tem mais o que vender."'
  ],
  ef:{flag:'sabe_do_ulisses', registrar:'Ulisses, criador de Fuchsia: sítio na estrada da Zona Safári, portão azul.',
      npc:{nome:'Líder Misty', opiniao:3, memoria:'Te deu o endereço do Ulisses em Fuchsia.'},
      presagio:'Um portão azul numa estrada que você ainda não conhece, e alguém atrás dele sem nada pra vender.'},
  escolhas:[
    {texto:'"Se eu trouxer prova, a senhora usa?"', vai:'c6_misty_prova'},
    {texto:'Guardar o panfleto e sair.', vai:'c6_ponte_norte'}
  ]
},

c6_misty_prova:{
  texto:[
    '"Se eu trouxer prova, a senhora usa?"',
    'Ela pensa por muito mais tempo do que você esperava.',
    '"Depende do que é prova."',
    '"Papel. Com número."',
    '"Aí sim." Ela cruza os braços. "Escuta. Foto de gaiola sensibiliza e não decide nada. O que decide é papel com número, porque papel com número obriga alguém a responder por escrito."',
    'Ela aponta pra você com o queixo.',
    '"Se você achar papel com número, você não me traz. Você guarda, tira cópia em cartório, e guarda a cópia em outro lugar."',
    '"Por quê?"',
    '"Porque original some."'
  ],
  ef:{flag:'conselho_da_copia',
      npc:{nome:'Líder Misty', opiniao:3, memoria:'Te ensinou a tirar cópia em cartório e guardar em outro lugar. "Original some."'},
      rep:{eixo:'bom',delta:1,motivo:'Aprendeu a se proteger antes de precisar'},
      registrar:'Conselho de Misty: papel com número, cópia em cartório, guardada em outro lugar.',
      presagio:'Cartório da rua Dez, em Saffron, abre até as cinco. Você ainda não sabe que isso vai importar.'},
  escolhas:[
    {texto:'Agradecer e sair.', vai:'c6_ponte_norte'},
    {texto:'"Eu volto pra desafiar o ginásio."', vai:'c6_misty_volto'},
    {texto:'"Por que a senhora tá me ajudando?"', vai:'c6_misty_porque'}
  ]
},

c6_misty_porque:{
  texto:[
    '"Por que a senhora tá me ajudando?"',
    '"Eu não tô te ajudando." Ela pega a pasta. "Eu tô te usando."',
    'Ela diz isso sem nenhuma culpa.',
    '"Eu sou líder de ginásio credenciada. Tudo que eu faço tem meu nome e meu número de credencial em cima. Você é {um moleque|uma moleca} de mochila que ninguém registra."',
    'Ela para na porta da piscina.',
    '"Isso é uma vantagem enorme e é temporária. Aproveita enquanto ninguém sabe seu nome."'
  ],
  ef:{flag:'vantagem_temporaria',
      presagio:'Aproveita enquanto ninguém sabe seu nome. O nome vem. Sempre vem.'},
  escolhas:[
    {texto:'Sair.', vai:'c6_ponte_norte'},
    {texto:'"E quando souberem?"', vai:'c6_quando_souberem'}
  ]
},

c6_quando_souberem:{
  texto:[
    '"E quando souberem?"',
    'Misty apaga a luz da piscina antes de responder, e no escuro o eco fica maior.',
    '"Aí você vira uma das duas coisas." Ela fala da porta. "Ou vira gente grande demais pra mexerem com você, ou vira processo."',
    '"E a senhora virou o quê?"',
    '"Eu virei as duas." Ela tranca. "É possível virar as duas."'
  ],
  ef:{flag:'as_duas_coisas',
      npc:{nome:'Líder Misty', opiniao:2, memoria:'Te disse que virou as duas coisas: grande demais e processo.'},
      presagio:'É possível virar as duas. Guarda isso pra quando te oferecerem escolher uma.'},
  escolhas:[
    {texto:'Ir pra ponte norte.', vai:'c6_ponte_norte'},
    {texto:'Ir pra estrada velha.', vai:'c6_estrada_velha', cond:d=>!!d.flags.ponto_da_van},
    {texto:'Ir comer alguma coisa.', vai:'c6_peixe'}
  ]
},

c6_misty_volto:{
  texto:[
    '"Eu volto pra desafiar o ginásio."',
    '"Volta." Ela dá de ombros. "De manhã ou de tarde, com a licença."',
    'E aí ela acrescenta, já de costas:',
    '"E não traz nada de Elétrico achando que é esperto. Todo mundo traz. Eu tenho um plano pra isso desde os dezessete anos."'
  ],
  ef:{flag:'dica_ginasio_cerulean', presagio:'Ela te avisou. Muita gente ouve isso como bravata.'},
  escolhas:[
    {texto:'Ir pra ponte norte.', vai:'c6_ponte_norte'},
    {texto:'Ir comer.', vai:'c6_peixe'},
    {texto:'Ir pra estrada velha.', vai:'c6_estrada_velha', cond:d=>!!d.flags.ponto_da_van}
  ]
},

c6_rio_ninguem:{
  texto:[
    '"E ninguém fez nada?"',
    'Sr. Cosmo ri. É uma risada sem graça nenhuma e ele para no meio dela.',
    '"Fizeram. Reclamaram na prefeitura. A prefeitura mandou ofício pra empresa de saneamento, a de saneamento mandou ofício pro estado, e o estado mandou de volta pra prefeitura."',
    'Ele puxa a linha.',
    '"Isso levou cinco meses. Eu sei porque eu acompanhei. Eu não tenho mais nada pra fazer."'
  ],
  ef:{flag:'ciclo_dos_oficios'},
  escolhas:[
    {texto:'"Mudou de cor como?"', vai:'c6_rio_cor'},
    {texto:'"O senhor pesca aqui há quanto tempo?"', vai:'c6_bilac_tempo'},
    {texto:'Ir pra ponte norte.', vai:'c6_ponte_norte'}
  ]
},

c6_bilac_tempo:{
  texto:[
    '"O senhor pesca aqui há quanto tempo?"',
    '"Quatro anos."',
    'Ele responde rápido demais, do jeito de quem tem esse número pronto.',
    '"E antes?"',
    '"Antes eu trabalhava." Ele ajeita a linha. "Trinta anos em barco. Aí me aposentaram e eu descobri que eu não sabia fazer mais nada."',
    'Ele joga a linha de novo.',
    '"Então eu venho aqui. Não pego nada. Mas eu venho, entende? Eu venho todo dia."'
  ],
  ef:{npc:{nome:'Sr. Cosmo', opiniao:2, memoria:'Pesca há quatro anos e não pega nada. Vem todo dia.'}},
  escolhas:[
    {texto:'"Mudou de cor como, o rio?"', vai:'c6_rio_cor'},
    {texto:'Ficar pescando com ele um tempo.', vai:'c6_bilac_calado'},
    {texto:'Ir pra ponte norte.', vai:'c6_ponte_norte'}
  ]
},

c6_bilac_calado:{
  texto:[
    'Vocês dois ficam ali. Ele pescando, você não.',
    'Uma hora e dez.',
    'Em nenhum momento nenhum dos dois fala nada, e isso não fica estranho em momento nenhum.',
    'Quando você levanta pra ir, ele diz, sem olhar: "Passa aqui de novo."',
    'E é a coisa mais simples do mundo e você vai lembrar disso em lugares muito piores.'
  ],
  ef:{hp:3, npc:{nome:'Sr. Cosmo', opiniao:3, memoria:'Passaram uma hora em silêncio na margem. Ele pediu pra você passar de novo.'},
      presagio:'"Passa aqui de novo." Tenta passar.'},
  escolhas:[
    {texto:'Ir pra ponte norte.', vai:'c6_ponte_norte'},
    {texto:'Ir comer.', vai:'c6_peixe'},
    {texto:'"O rio mudou de cor?"', vai:'c6_rio_cor'}
  ]
},

c6_peixe:{
  texto:[
    'A barraca de peixe frito fica na cabeceira da ponte sul e tem fila às cinco da tarde.',
    'A moça serve num papel pardo, com farinha e limão, e cobra pouco.',
    'Você come em pé, encostad{o|a} no parapeito, e é a primeira comida quente desde Pewter.',
    'Do lado, dois estivadores discutem sobre um navio. Atrás, uma família inteira come em silêncio.',
    'E na ponte norte, cinquenta metros rio acima, tem gente reunida em volta de alguma coisa.'
  ],
  ef:{dinheiro:-150, hp:4},
  escolhas:[
    {texto:'Ir ver o que é na ponte norte.', vai:'c6_ponte_norte'},
    {texto:'Perguntar pra moça da barraca.', vai:'c6_moca_barraca'},
    {texto:'Comer outro e não fazer nada.', vai:'c6_beira'},
    {texto:'Ir pra estrada velha.', vai:'c6_estrada_velha', cond:d=>!!d.flags.ponto_da_van}
  ]
},

c6_moca_barraca:{
  falante:'a moça do peixe frito',
  texto:[
    '"O que é aquilo lá na ponte norte?"',
    'A moça não levanta a cabeça da frigideira.',
    '"Banca."',
    '"Banca de quê?"',
    'Aí ela levanta.',
    '"De bicho." Ela vira o peixe. "Vender é proibido, então ele não vende: ele cobra o papel da transferência. Tem carimbo. Eu não gosto, mas tem carimbo."',
    'Ela serve o próximo da fila.',
    '"Eu não gosto e eu vendo peixe frito, então quem sou eu, né."'
  ],
  ef:{flag:'sabe_da_banca'},
  escolhas:[
    {texto:'Ir ver a banca.', vai:'c6_ponte_norte'},
    {texto:'"Por que a senhora não gosta?"', vai:'c6_porque_nao_gosta'},
    {texto:'Agradecer e ir pra beira do rio.', vai:'c6_beira'}
  ]
},

c6_porque_nao_gosta:{
  texto:[
    '"Por que a senhora não gosta?"',
    'Ela pensa enquanto tira o peixe do óleo.',
    '"Porque tem preço na plaquinha."',
    'Ela embrulha no papel pardo.',
    '"Peixe tem preço na plaquinha. Peixe tá morto. Aquilo ali tá vivo e tem preço na plaquinha, e eu não sei explicar melhor que isso, {moço|moça}, mas é isso."'
  ],
  ef:{flag:'preco_na_plaquinha',
      presagio:'Preço na plaquinha numa coisa viva. Você vai ver isso com cifras muito maiores.'},
  escolhas:[
    {texto:'Ir ver a banca.', vai:'c6_ponte_norte'},
    {texto:'Ir pra beira do rio.', vai:'c6_beira'}
  ]
},

/* ─────────────── A BANCA ─────────────── */

c6_ponte_norte:{
  texto:[
    'Na ponte norte, um homem montou uma banca. Não é barraca — é uma mesa dobrável com toalha, e em cima da toalha uma caixa forrada de veludo azul com seis Poké Balls encaixadas em espuma.',
    'Cada uma tem uma plaquinha de acrílico na frente, com espécie, nível e "taxa" escritos à mão em letra caprichada.',
    'Tem umas oito pessoas em volta. Duas crianças. Um casal discutindo baixinho se dá ou não dá.',
    '"Aqui ninguém vende nada", ele diz antes de você perguntar, porque ele já sabe qual é a sua cara. "É taxa de transferência voluntária. Documentada. Quer ver o papel?"'
  ],
  ef:{registrar:'A banca da ponte norte de Cerulean não vende Pokémon, que é crime: cobra "taxa de transferência".'},
  escolhas:[
    {texto:'Ver os papéis.', vai:'c6_papeis'},
    {texto:'"Isso não é ilegal?"', vai:'c6_legal'},
    {texto:'Olhar as seis plaquinhas com atenção.', vai:'c6_plaquinhas'},
    {texto:'Passar reto.', vai:'c6_saida_norte'}
  ]
},

c6_plaquinhas:{
  texto:[
    'Você lê as seis.',
    '"GROWLITHE — Nv 18 — Macho — 4.500"',
    '"ODDISH — Nv 12 — 1.800"',
    '"MACHOP — Nv 20 — 5.200"',
    '"PSYDUCK — Nv 16 — 2.900"',
    '"NIDORAN♀ — Nv 14 — 2.200"',
    'E a sexta, na ponta, com a letra menor: "PIDGEY — Nv 9 — 400"',
    'Quatrocentos. Você olha pro preço do peixe frito na sua mão e faz uma conta que preferia não ter feito.'
  ],
  ef:{flag:'leu_as_plaquinhas',
      presagio:'Quatrocentos. Alguém, em algum lugar, decidiu que esse número era justo.'},
  escolhas:[
    {texto:'"Por que esse é tão barato?"', vai:'c6_pidgey_barato'},
    {texto:'Ver os papéis.', vai:'c6_papeis'},
    {texto:'"Isso não é ilegal?"', vai:'c6_legal'},
    {texto:'Passar reto.', vai:'c6_saida_norte'}
  ]
},

c6_pidgey_barato:{
  texto:[
    '"Por que esse é tão barato?"',
    'O homem da banca não fica constrangido. Ele responde com a naturalidade de quem já respondeu isso quatrocentas vezes.',
    '"Porque é Pidgey nível nove." Ele ajeita a plaquinha. "Tem Pidgey de graça em qualquer capim daqui até Pewter. O que eu vendo não é o Pidgey."',
    '"É o quê?"',
    '"É não precisar pegar." Ele abre as mãos. "Tem gente que quer um bicho e não quer a parte de ir no mato. Eu vendo a parte do mato."',
    d=>d.flags.sabe_do_pico
      ? 'Você olha a bola do Pidgey na espuma e pensa num Pidgey que nasceu numa gaiola numa loja e demorou nove anos pra voar um metro.'
      : 'Você olha a bola do Pidgey na espuma por tempo demais.'
  ],
  ef:{flag:'entendeu_a_banca'},
  escolhas:[
    {texto:'Pagar a taxa do Pidgey. (400 ₽)', vai:'c6_comprou_pidgey', cond:d=>d.jogador.dinheiro>=400},
    {texto:'Ver os papéis.', vai:'c6_papeis'},
    {texto:'"E o que acontece com o que não vende?"', vai:'c6_nao_vende'},
    {texto:'Passar reto.', vai:'c6_saida_norte'}
  ]
},

c6_nao_vende:{
  texto:[
    '"E o que acontece com o que não vende?"',
    'Primeira vez que ele hesita.',
    '"Eu não fico com estoque parado."',
    '"Isso não é resposta."',
    'Ele olha em volta. Tem gente perto. Ele baixa a voz, e a baixada de voz já é a resposta.',
    '"Tem quem compre lote." Ele arruma a toalha da mesa sem precisão nenhuma. "Não é da minha alçada o que eles fazem. Eu emito nota."',
    '"Compra lote pra quê?"',
    '"{Moço|Moça}." Ele te olha. "Eu emito nota."'
  ],
  ef:{flag:'compra_de_lote', registrar:'O que não vende na banca da ponte é vendido em lote para alguém.',
      presagio:'"Eu emito nota." Toda essa história vai ser feita de gente que emite nota.'},
  escolhas:[
    {texto:'"Quem compra lote?"', vai:'c6_quem_compra_lote'},
    {texto:'Ver os papéis.', vai:'c6_papeis'},
    {texto:'Pagar a taxa do mais barato pra tirar um dali. (400 ₽)', vai:'c6_comprou_pidgey', cond:d=>d.jogador.dinheiro>=400},
    {texto:'Passar reto.', vai:'c6_saida_norte'}
  ]
},

c6_quem_compra_lote:{
  texto:[
    '"Quem compra lote?"',
    'O homem da banca fecha a caixa de veludo. Só isso: fecha a caixa.',
    '"Acabou o expediente."',
    'São quatro e vinte da tarde. Tem oito pessoas em volta da mesa. Ele dobra a mesa e vai embora com a caixa debaixo do braço.',
    'Na terceira passada, sem parar de andar, ele fala baixo por cima do ombro:',
    '"Van branca. Sexta. Não vem."'
  ],
  ef:{flag:['ponto_da_van','aviso_da_van'],
      registrar:'O homem da banca confirmou: van branca, sexta.',
      presagio:'"Não vem." Duas palavras que garantem que você vai.'},
  escolhas:[
    {texto:'Ir pra estrada velha agora e reconhecer o lugar.', vai:'c6_estrada_velha'},
    {texto:'Seguir ele.', vai:'c6_seguiu_banca'},
    {texto:'Deixar pra lá e ir pra Rota 25.', vai:'c6_saida_norte'},
    {texto:'Contar pra Misty.', vai:'c6_bilac_leva'}
  ]
},

c6_seguiu_banca:{
  texto:[
    'Você segue ele. Ele sabe que você está seguindo — dá pra ver pelos ombros.',
    'Duas quadras depois ele entra numa loja de ferragem, e você espera, e ele não sai.',
    'Vinte minutos. A loja tem porta dos fundos.',
    'Quando você finalmente entra e pergunta, o dono da ferragem diz que não entrou ninguém com caixa nenhuma, e diz isso sem levantar a cabeça do que está fazendo.'
  ],
  ef:{flag:'perdeu_o_da_banca'},
  escolhas:[
    {texto:'Ir pra estrada velha reconhecer o lugar.', vai:'c6_estrada_velha'},
    {texto:'Ir pra Rota 25.', vai:'c6_saida_norte'},
    {texto:'Voltar pra ponte.', vai:'c6_ponte_norte'}
  ]
},

c6_papeis:{
  texto:[
    'Os papéis são reais. É isso que estraga tudo.',
    'Carimbo da Liga, registro numérico, campo de espécie, campo de nível, campo de procedência. Tudo preenchido a máquina.',
    'Na quarta folha, o campo de origem: "Transferência voluntária — treinador desistente."',
    'Você olha a caixa de veludo de novo. Seis bolas. Seis treinadores que desistiram.',
    '"O negócio não é o bicho", ele diz, acompanhando seu olhar com uma precisão desconfortável. "O negócio é que tem muita gente saindo de casa aos quinze e voltando aos dezesseis."',
    d=>d.flags.ouviu_a_senhora ? 'Quinze e dezesseis. Você já ouviu essa conta na praça de Pewter, num banco, com meio pastel na mão.' : ''
  ],
  ef:{flag:'viu_papeis'},
  escolhas:[
    {texto:'"O que faz um treinador desistir?"', vai:'c6_desistente'},
    {texto:'Pagar a taxa de um. (3.000 ₽)', vai:'c6_comprou', cond:d=>d.jogador.dinheiro>=3000},
    {texto:'"Quanto você paga por um?"', vai:'c6_vender'},
    {texto:'Sair dessa conversa.', vai:'c6_saida_norte'}
  ]
},

c6_desistente:{
  texto:[
    '"O que faz um treinador desistir?"',
    'Ele guarda os papéis na pasta com uma calma que te irrita.',
    '"Dinheiro." Um. "Escola." Dois. "Mãe." Três. "Medo." Quatro.',
    'Ele para nos quatro dedos levantados e pensa se vale a pena o quinto.',
    '"E o quinto é o que traz a maioria aqui." Ele levanta o polegar. "Perceber que gostava menos do que achava."',
    'Ele fecha a mão.',
    '"Esse quinto é o pior de todos, {moço|moça}, porque não dá pra falar pra ninguém. Você pode chegar em casa e dizer que acabou o dinheiro. Você não pode chegar em casa e dizer que não era pra você."'
  ],
  ef:{flag:'os_cinco_motivos',
      presagio:'Cinco motivos. Anota. Em algum momento você vai testar quantos deles se aplicam a você.'},
  escolhas:[
    {texto:'"E eles voltam pra buscar?"', vai:'c6_voltam_buscar'},
    {texto:'Pagar a taxa de um. (3.000 ₽)', vai:'c6_comprou', cond:d=>d.jogador.dinheiro>=3000},
    {texto:'"Quanto você paga por um?"', vai:'c6_vender'},
    {texto:'Sair.', vai:'c6_saida_norte'}
  ]
},

c6_voltam_buscar:{
  texto:[
    '"E eles voltam pra buscar?"',
    'Silêncio de dois segundos.',
    '"Já aconteceu três vezes em quatro anos."',
    'Ele arruma a toalha.',
    '"Das três, duas eu não tinha mais. Uma eu tinha."',
    '"E aí?"',
    '"E aí eu vendi de volta." Ele fala isso sem nenhuma ironia. "Pelo mesmo preço que eu paguei. Sem lucro."',
    'Ele olha pra ponte, pro rio, pra qualquer coisa que não seja você.',
    '"Ele chorou na ponte. Um homem de vinte e dois anos chorando numa ponte com uma bola na mão. Eu fechei a banca mais cedo naquele dia."'
  ],
  ef:{flag:'historia_da_volta',
      npc:{nome:'Homem da banca', opiniao:2, memoria:'Te contou do treinador que voltou pra buscar e chorou na ponte.'},
      presagio:'Ele fechou a banca mais cedo e abriu no dia seguinte. É assim que todo mundo continua.'},
  escolhas:[
    {texto:'"Por que você continua fazendo isso?"', vai:'c6_porque_continua'},
    {texto:'Pagar a taxa de um. (3.000 ₽)', vai:'c6_comprou', cond:d=>d.jogador.dinheiro>=3000},
    {texto:'Sair.', vai:'c6_saida_norte'},
    {texto:'"Quanto você paga por um?"', vai:'c6_vender'}
  ]
},

c6_porque_continua:{
  texto:[
    '"Por que você continua fazendo isso?"',
    '"Porque se eu não fizer, faz o de lote."',
    'Ele diz isso e percebe que disse, e não tenta consertar.',
    '"Eu pago mais que o de lote. Eu documento. Eu recuso vender pra criança sem responsável." Ele conta nos dedos de novo, e dessa vez é defesa. "Isso é alguma coisa. É pouco. É alguma coisa."',
    'Ele olha as seis plaquinhas.',
    '"Eu sei o que eu sou. Eu só não sou o pior que tem."'
  ],
  ef:{flag:'nao_sou_o_pior',
      presagio:'"Eu só não sou o pior que tem." Você vai ouvir essa frase de gente cada vez mais assustadora.'},
  escolhas:[
    {texto:'"Quem é o pior que tem?"', vai:'c6_quem_compra_lote'},
    {texto:'Pagar a taxa de um. (3.000 ₽)', vai:'c6_comprou', cond:d=>d.jogador.dinheiro>=3000},
    {texto:'Sair.', vai:'c6_saida_norte'}
  ]
},

c6_legal:{
  falante:'Homem da banca',
  texto:[
    '"Isso não é ilegal?"',
    'Ele acha graça de verdade — não é deboche, é alívio de ouvir uma pergunta fácil.',
    '"Vender é. Dá cadeia." Ele bate no veludo. "Eu não vendo. Eu faço transferência voluntária, que é legal, e cobro a papelada, que também é. E a Liga cobra imposto da papelada. Tem formulário e tudo. Tem campo pra alíquota."',
    'Ele tira uma nota fiscal do bolso e balança.',
    '"Ilegal é o que acontece quando não tem banca. Aí o bicho vai pro porão de alguém em Celadon e ninguém carimba nada e ninguém sabe quantos foram."',
    'Ele não está errado. É por isso que incomoda.'
  ],
  escolhas:[
    {texto:'Ver os papéis.', vai:'c6_papeis'},
    {texto:'"E quem carimba, sabe quantos foram?"', vai:'c6_quem_carimba'},
    {texto:'Olhar as plaquinhas.', vai:'c6_plaquinhas'},
    {texto:'Passar reto.', vai:'c6_saida_norte'}
  ]
},

c6_quem_carimba:{
  texto:[
    '"E quem carimba, sabe quantos foram?"',
    'Ele para de balançar a nota.',
    '"Sabe."',
    '"Quantos?"',
    '"Eu não sei quantos. Eu sei que sabe." Ele guarda a nota. "Cada nota minha tem número. Número é sequência. Sequência é contagem."',
    'Ele olha pra você com uma atenção nova, do jeito de quem reavalia com quem está falando.',
    '"Você não é {o primeiro|a primeira} a perguntar isso. Mas você é {o primeiro|a primeira} de mochila."'
  ],
  ef:{flag:'sequencia_e_contagem',
      presagio:'Alguém, em algum lugar, tem a contagem completa. E a contagem completa é a coisa mais perigosa que existe.'},
  escolhas:[
    {texto:'"Quem mais perguntou?"', vai:'c6_quem_mais'},
    {texto:'Ver os papéis.', vai:'c6_papeis'},
    {texto:'Passar reto.', vai:'c6_saida_norte'}
  ]
},

c6_quem_mais:{
  texto:[
    '"Quem mais perguntou?"',
    '"Uma mulher de jaleco." Ele nem pensa. "Ano passado. Ficou uma hora aqui fazendo pergunta e anotando num caderninho com elástico."',
    d=>d.flags.cartao_ivone ? 'Você conhece o caderninho com elástico.' : 'Você não faz ideia de quem seja.',
    '"E a outra foi a Misty." Ele dá de ombros. "Essa não perguntou. Essa veio com papel."'
  ],
  ef:{flag:'ivone_esteve_na_banca'},
  escolhas:[
    {texto:'Ver os papéis.', vai:'c6_papeis'},
    {texto:'Ir falar com a Misty.', vai:'c6_bilac_leva'},
    {texto:'Passar reto.', vai:'c6_saida_norte'}
  ]
},

c6_comprou:{
  texto:[
    'A transação leva menos tempo que comprar um sanduíche.',
    'Ele preenche dois campos, carimba, destaca a via, e te entrega a bola e o papel dobrado em três.',
    '"Cuida bem."',
    'Ele fala isso pra todo mundo. Dá pra ouvir o desgaste da frase.',
    'Dentro da bola tem alguém que conheceu outra pessoa primeiro, aprendeu o jeito dela de chamar, e não vai encontrar isso em você.'
  ],
  ef:{dinheiro:-3000, flag:'comprou_pokemon',
      executar:d=>{
        const dex = Dados.escolher([52,58,63,66,84,96,104,109,116,118]);
        const p = criarPokemon(dex, Dados.entre(16,22), {moral:20, historia:'Comprad{o} numa banca em Cerulean. Teve outro treinador antes de você.'});
        const onde = Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${p.nome} (Nv ${p.nivel}, ${p.natureza}) é seu agora. ${pron(p).Ele} não te escolheu.${notaDestino(onde)}`}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Pagou "taxa de transferência" por um Pokémon numa banca de rua'},
      presagio:'Ele vai levar semanas pra te obedecer, e meses pra te olhar. Isso não está escrito no papel dobrado em três.'},
  escolhas:[
    {texto:'Perguntar o nome do treinador anterior.', vai:'c6_nome_anterior'},
    {texto:'Ir pra Rota 25.', vai:'c6_saida_norte'},
    {texto:'"Quanto você paga por um?"', vai:'c6_vender'}
  ]
},

c6_comprou_pidgey:{
  texto:[
    'Quatrocentos. Ele carimba a via e te entrega a bola com a plaquinha junto, porque a plaquinha é de acrílico e ele reaproveita, e ele tira a plaquinha da sua mão de volta com um "desculpa" automático.',
    'Você solta o Pidgey ali mesmo, na ponte.',
    'Ele não voa. Fica parado no parapeito de concreto, virando a cabeça, olhando a água correr embaixo.',
    'O homem da banca olha pra isso e não diz nada.',
    'Depois de uns dois minutos o Pidgey levanta voo, sobe uns quatro metros, dá uma volta em cima da ponte, e vai embora rio acima.'
  ],
  ef:{dinheiro:-400, flag:'soltou_o_pidgey_da_banca',
      rep:{eixo:'bom',delta:2,motivo:'Comprou uma coisa viva para soltá-la'},
      registrar:'Comprou o Pidgey de 400 da banca da ponte e soltou ali mesmo.',
      presagio:'Sobrou uma espuma vazia na caixa de veludo, e amanhã vai ter outro ali.'},
  escolhas:[
    {texto:'"Quanto custa comprar os seis?"', vai:'c6_os_seis'},
    {texto:'Ver os papéis.', vai:'c6_papeis'},
    {texto:'Ir pra Rota 25.', vai:'c6_saida_norte'},
    {texto:'"Amanhã eu volto."', vai:'c6_amanha_volto'}
  ]
},

c6_os_seis:{
  texto:[
    '"Quanto custa comprar os seis?"',
    'Ele faz a conta na calculadora de bolso, embora saiba de cabeça.',
    '"Dezesseis e seiscentos."',
    'Você tem menos que isso. Provavelmente muito menos.',
    'E mesmo se tivesse: amanhã a caixa está cheia de novo. Ele não vende os seis. Ele vende o lugar na espuma.',
    '"Você não tá comprando bicho", ele diz, lendo sua cara. "Você tá tentando comprar o problema. O problema não tá à venda."'
  ],
  ef:{flag:'o_problema_nao_esta_a_venda',
      presagio:'O problema não está à venda. Vai ter que ser outra coisa.'},
  escolhas:[
    {texto:'"Então o que tá à venda?"', vai:'c6_o_que_esta_a_venda'},
    {texto:'"Amanhã eu volto."', vai:'c6_amanha_volto'},
    {texto:'Ir pra Rota 25.', vai:'c6_saida_norte'}
  ]
},

c6_o_que_esta_a_venda:{
  texto:[
    '"Então o que tá à venda?"',
    'Ele guarda a calculadora.',
    '"Informação." Ele fala olhando o rio. "Eu vendo bicho porque bicho paga meu aluguel. Mas informação é de graça pra quem pergunta direito, e quase ninguém pergunta direito."',
    '"Eu tô perguntando direito?"',
    '"Você tá chegando perto."'
  ],
  escolhas:[
    {texto:'"E o que acontece com o que não vende?"', vai:'c6_nao_vende'},
    {texto:'"Quem carimba, sabe quantos foram?"', vai:'c6_quem_carimba'},
    {texto:'Ir pra Rota 25.', vai:'c6_saida_norte'}
  ]
},

c6_amanha_volto:{
  falante:'Homem da banca',
  texto:[
    '"Amanhã eu volto."',
    '"Volta." Ele ajeita a espuma vazia. "Eu tô aqui das nove às cinco, menos sexta."',
    '"Por que menos sexta?"',
    'Ele demora um pouco pra responder e você percebe, pela primeira vez, que ele está com medo de alguma coisa que não é você.',
    '"Sexta eu não abro."'
  ],
  ef:{flag:'ponto_da_van',
      presagio:'Sexta ele não abre. Você já sabe o que acontece na sexta.'},
  escolhas:[
    {texto:'Ir pra estrada velha reconhecer o lugar.', vai:'c6_estrada_velha'},
    {texto:'Ir pra Rota 25.', vai:'c6_saida_norte'},
    {texto:'Insistir: "Por que sexta não?"', vai:'c6_quem_compra_lote'}
  ]
},

c6_nome_anterior:{
  texto:[
    '"Como era o nome do treinador anterior?"',
    'Ele olha o papel.',
    '"Isso aqui é dado pessoal, {moço|moça}. Eu não posso passar."',
    'E aí, porque você fica parad{o|a} sem sair, ele suspira e olha em volta e vira a folha pra você por dois segundos, com o polegar cobrindo o sobrenome.',
    'Você lê o primeiro nome. É um nome comum. Um nome que tem em qualquer sala de aula.',
    'De alguma forma isso é pior do que se fosse um nome esquisito.'
  ],
  ef:{flag:'sabe_o_nome_anterior', moral:5,
      presagio:'Agora tem um nome. Você vai dizer esse nome em voz alta uma vez, e ele vai reagir.'},
  escolhas:[
    {texto:'Ir pra Rota 25.', vai:'c6_saida_norte'},
    {texto:'Ver os papéis do resto.', vai:'c6_papeis'}
  ]
},

c6_vender:{
  texto:[
    'Ele te olha diferente agora. Com interesse comercial, que é um tipo específico de atenção e dá pra sentir.',
    '"Depende do bicho. Nível, natureza, se tem golpe bom." Ele tira uma calculadora do bolso. "Traz aqui que eu avalio."',
    'Ele está falando dos seus. Do que está no seu cinto agora, a vinte centímetros da sua mão.',
    'E o pior: você já está fazendo a conta. Você não decidiu fazer a conta. Ela começou sozinha.'
  ],
  escolhas:[
    {texto:'Vender um do seu time.', vai:'c6_venda_feita', vendaTime:true},
    {texto:'"Esquece."', vai:'c6_saida_norte', ef:{rep:{eixo:'bom',delta:1,motivo:'Recusou vender um companheiro'}}},
    {texto:'"Avalia, mas eu não vendo. Só quero saber."', vai:'c6_so_avaliar'},
    {texto:'Sair dessa ponte agora.', vai:'c6_saida_norte'}
  ]
},

c6_so_avaliar:{
  texto:[
    '"Avalia, mas eu não vendo. Só quero saber."',
    'Ele avalia. Faz perguntas técnicas, olha, digita.',
    'E diz um número.',
    'O número é baixo. Muito mais baixo do que você esperava, e a sua reação a isso te envergonha imediatamente, porque por meio segundo você ficou ofendid{o|a} — não por ele ter posto preço, mas por o preço ser pouco.',
    'Você agradece e sai andando rápido.'
  ],
  ef:{flag:'avaliou_o_time', moral:-5,
      presagio:'Por meio segundo você ficou ofendid{o|a} pelo valor, não pela pergunta. Isso vai voltar.'},
  escolhas:[
    {texto:'Ir pra Rota 25.', vai:'c6_saida_norte'},
    {texto:'Voltar e vender mesmo assim.', vai:'c6_venda_feita', vendaTime:true},
    {texto:'Ir pra beira do rio ficar quiet{o|a} um tempo.', vai:'c6_beira'}
  ]
},

c6_venda_feita:{
  texto:[
    'Ele conta as notas na sua mão. Você segura a bola até o último segundo e depois não segura mais.',
    'Ele guarda na caixa de veludo, na quinta posição, e escreve uma plaquinha nova com a letra caprichada dele.',
    'Você fica olhando a plaquinha secar.',
    'Ele pigarreia. Você vai embora.',
    'Você atravessa a ponte inteira sem olhar pra trás e para na outra ponta, e aí olha pra trás, e daqui não dá pra distinguir qual das seis é.'
  ],
  ef:{moral:-20, flag:'vendeu_um_do_time',
      presagio:'Daqui não dá pra distinguir qual é. Em duas semanas você não vai lembrar da plaquinha.'},
  escolhas:[
    {texto:'Voltar e comprar de volta.', vai:'c6_comprar_de_volta'},
    {texto:'Ir pra Rota 25.', vai:'c6_saida_norte'},
    {texto:'Ir pra beira do rio.', vai:'c6_beira'}
  ]
},

c6_comprar_de_volta:{
  falante:'Homem da banca',
  texto:[
    'Você volta.',
    'Ele te vê chegando e já sabe, e o rosto dele fica com uma expressão que você só vai entender depois: é pena.',
    '"Eu te pago o mesmo que você me pagou", ele diz antes de você abrir a boca. "Sem lucro."',
    'Você paga. A diferença entre o que você recebeu e o que você paga é zero, e mesmo assim você sai dali sentindo que perdeu alguma coisa.',
    'A plaquinha ainda estava secando.'
  ],
  ef:{flag:'comprou_de_volta', limpaFlag:'vendeu_um_do_time',
      rep:{eixo:'bom',delta:1,motivo:'Voltou atrás antes que a tinta secasse'},
      executar:d=>{
        return [{tipo:'eco', texto:'Ele volta pro cinto. Vai levar um tempo até olhar pra você do mesmo jeito.'}];
      },
      moral:-8},
  escolhas:[
    {texto:'Ir pra Rota 25.', vai:'c6_saida_norte'},
    {texto:'Ir pra beira do rio.', vai:'c6_beira'}
  ]
},

c6_saida_norte:{
  texto:[
    'A saída norte de Cerulean passa por baixo de um viaduto e vira a Rota 25 sem aviso: num passo tem asfalto, no outro tem terra batida.',
    'A rota acompanha o rio até o mar. Tem cabana de pescador, tem trilha, tem gente pescando em silêncio há horas.',
    d=>d.flags.ponto_da_van ? 'A estrada velha sai à direita, logo depois da segunda ponte. Você repara nela sem querer reparar.' : 'Uma estrada velha sai à direita e você não presta atenção nela.'
  ],
  escolhas:[
    {texto:'Seguir a Rota 25.', vai:'c6_rota25'},
    {texto:'Pegar a estrada velha.', vai:'c6_estrada_velha', cond:d=>!!d.flags.ponto_da_van},
    {texto:'Voltar pra cidade.', vai:'c6_ponte_norte'},
    {texto:'Acampar aqui e entrar na rota de manhã.', vai:'c6_acampou'}
  ]
},

c6_acampou:{
  texto:[
    'Você acampa embaixo do viaduto, que é seco e tem parede de um lado, e dorme mal por causa do barulho de carro em cima.',
    'Às quatro e quarenta da manhã você acorda com uma coisa esquisita: silêncio total. Parou de passar carro.',
    'E aí passa um. Devagar, com o pneu fazendo aquele barulho de asfalto molhado.',
    'Você levanta a cabeça a tempo de ver as lanternas traseiras entrando na estrada velha.',
    'Van. Branca. Sem placa.'
  ],
  ef:{flag:['ponto_da_van','viu_a_van_entrando'],
      registrar:'Viu a van branca entrar na estrada velha às 4h40.',
      presagio:'Ela chegou vinte minutos antes do combinado. Quem chega cedo já fez isso muitas vezes.'},
  escolhas:[
    {texto:'Ir atrás, a pé, no escuro.', vai:'c6_estrada_velha'},
    {texto:'Voltar a dormir.', vai:'c6_rota25', ef:{flag:'ignorou_a_van'}},
    {texto:'Esperar clarear e ir olhar o lugar.', vai:'c6_estrada_depois'}
  ]
},

c6_estrada_velha:{
  texto:[
    'A estrada velha tem cento e poucos metros de asfalto rachado e depois vira terra.',
    'Ela termina num descampado de cascalho onde antes tinha alguma coisa — dá pra ver o retângulo de concreto de uma construção que demoliram.',
    'No cascalho: marca de pneu. Muita. De veículo pesado, várias vezes, ao longo de meses.',
    'E marca de pé. Duas fileiras: uma indo até onde o veículo para, outra voltando.',
    'A que volta é mais funda. Quem volta está carregando.'
  ],
  ef:{flag:'achou_o_ponto', registrar:'O ponto da van é um descampado de cascalho no fim da estrada velha.',
      presagio:'A fileira que volta é mais funda. Isso é o tipo de detalhe que um dia vai ser lido em voz alta numa sala.'},
  escolhas:[
    {texto:'Achar um lugar pra esperar sexta.', vai:'c6_esconderijo'},
    {texto:'Procurar mais coisas no cascalho.', vai:'c6_cascalho'},
    {texto:'Voltar e contar pra Misty.', vai:'c6_bilac_leva'},
    {texto:'Isso é grande demais. Voltar pra rota.', vai:'c6_rota25'}
  ]
},

c6_cascalho:{
  texto:[
    'Você anda o descampado inteiro olhando o chão, o que leva quarenta minutos e faz você se sentir ridículo.',
    'Acha três coisas.',
    'Uma tampa de caixa plástica azul, quebrada num canto, com um número estampado: 0-9-1.',
    d=>d.flags.numero_da_caixa ? 'A que você viu no Monte da Lua era 074. Dezessete caixas de diferença.' : 'Você não sabe o que o número quer dizer.',
    'Um pedaço de fita de embalagem com metade de um brasão impresso. Dá pra ver o prato de uma balança.',
    'E uma bituca de cigarro com filtro branco, apagada no cascalho, ao lado de exatamente onze outras bitucas no mesmo ponto — alguém fuma sempre no mesmo lugar, encostado no mesmo poste, há muito tempo.'
  ],
  ef:{flag:['tampa_091','brasao_na_fita'],
      registrar:'No ponto da van: tampa de caixa nº 091, fita com brasão de balança, e onze bitucas no mesmo lugar.',
      presagio:'Onze bitucas no mesmo ponto. Alguém espera aqui, sempre, e espera o suficiente pra fumar.'},
  escolhas:[
    {texto:'Achar um lugar pra esperar sexta.', vai:'c6_esconderijo'},
    {texto:'Levar a tampa e a fita como prova.', vai:'c6_levou_prova',
     ef:{flag:'levou_prova_do_ponto'}},
    {texto:'Voltar e contar pra Misty.', vai:'c6_bilac_leva'},
    {texto:'Voltar pra rota.', vai:'c6_rota25'}
  ]
},

c6_levou_prova:{
  texto:[
    'Você guarda a tampa quebrada e o pedaço de fita na mochila, o que é uma coisa esquisita de carregar e você vai ter que explicar se alguém abrir.',
    'A fita com meio brasão é a peça boa. Meio brasão é mais convincente que um brasão inteiro, porque brasão inteiro parece que você desenhou.',
    'Você não sabe por que pensou isso. Você está começando a pensar como quem monta um caso, e isso aconteceu em algum lugar entre uma caverna e uma ponte.'
  ],
  ef:{presagio:'Você está montando um caso. Ninguém te ensinou isso. Você começou sozinh{o|a}.'},
  escolhas:[
    {texto:'Achar um lugar pra esperar sexta.', vai:'c6_esconderijo'},
    {texto:'Levar pra Misty.', vai:'c6_bilac_leva'},
    {texto:'Voltar pra rota.', vai:'c6_rota25'}
  ]
},

c6_esconderijo:{
  texto:[
    'Você acha o lugar em vinte minutos: uma vala de drenagem a uns quarenta metros do retângulo de concreto, com mato alto na borda.',
    'Dá pra deitar. Dá pra ver o descampado inteiro. Não dá pra ser visto, a não ser que alguém venha justamente até a vala.',
    'Se hoje é quinta, você tem uma noite pra esperar. Se hoje é sexta, você tem até as cinco da manhã.',
    'De qualquer jeito, é muito tempo deitado numa vala, e você não trouxe água suficiente.'
  ],
  ef:{flag:'achou_a_vala'},
  escolhas:[
    {texto:'Esperar. Quanto tempo for.', vai:'c6_espera_van'},
    {texto:'Voltar, buscar água e comida, e voltar pra vala.', vai:'c6_espera_van',
     ef:{flag:'se_preparou', dinheiro:-400, hp:2}},
    {texto:'Chamar alguém pra esperar com você.', vai:'c6_chamou_ajuda'},
    {texto:'Desistir. Voltar pra rota.', vai:'c6_rota25'}
  ]
},

c6_chamou_ajuda:{
  texto:[
    'Você volta pra cidade e tenta.',
    d=>d.flags.cartao_ivone ? 'A Dra. Cordell não atende. Toca seis vezes e cai.' : 'Você não tem o número de ninguém que resolva isso.',
    d=>d.flags.misty_sabe_do_diesel ? 'A piscina está fechada. Tem um papel na porta: "SEM EXPEDIENTE — QUINTA".' : 'A cidade inteira está fechando.',
    d=>d.npcs['Ezra'] ? 'E o Ezra não está em Cerulean. Você não sabe nem por onde ele anda.' : '',
    'Você volta pra vala sozinh{o|a}, no escuro, com uma sensação muito específica de estar fazendo uma coisa que não devia fazer sozinho.'
  ],
  ef:{flag:'tentou_chamar_ajuda',
      presagio:'Você tentou. Isso vai contar depois, quando alguém perguntar por que você estava lá sozinh{o|a}.'},
  escolhas:[
    {texto:'Esperar na vala.', vai:'c6_espera_van'},
    {texto:'Desistir. Ir pra rota.', vai:'c6_rota25'}
  ]
},

c6_espera_van:{
  texto:[
    'Você espera.',
    'A noite numa vala de drenagem é longa de um jeito que não dá pra explicar pra quem não passou uma. O frio entra pelo chão. Você muda de posição a cada dez minutos e nenhuma posição funciona.',
    'Às quatro e quarenta, um par de faróis entra na estrada velha.',
    'A van estaciona com a traseira virada pro descampado. O motorista desce e acende um cigarro encostado no poste.',
    'Às cinco e cinco, chegam duas pessoas a pé, vindo do mato, com quatro caixas plásticas azuis.',
    'A transação leva quatro minutos. Ninguém fala quase nada. Um deles assina uma prancheta.'
  ],
  ef:{flag:'viu_a_entrega', registrar:'Assistiu à entrega no ponto da van: quatro caixas, uma prancheta assinada.'},
  escolhas:[
    {texto:'Sair da vala agora, no meio da entrega.', vai:'c6_interrompeu'},
    {texto:'Esperar eles irem e seguir a van a pé.', vai:'c6_seguiu_van_25'},
    {texto:'Esperar eles irem e seguir os dois que vieram do mato.', vai:'c6_seguiu_os_dois'},
    {texto:'Não fazer nada. Só olhar e guardar tudo.', vai:'c6_so_olhou'}
  ]
},

c6_interrompeu:{
  texto:[
    'Você sai da vala e anda até o descampado no escuro, e o cascalho debaixo do seu pé faz um barulho absurdo.',
    'As três pessoas param.',
    'O motorista joga o cigarro no chão e pisa em cima — devagar, girando o pé, sem pressa nenhuma.',
    '"Boa noite", ele diz.',
    'Ele diz boa noite. Às cinco da manhã, num descampado, pra um garoto que saiu de uma vala.',
    'E é aí que você entende que ele não tem nenhum medo, e que isso não é coragem: é experiência.'
  ],
  ef:{flag:'encarou_a_van'},
  escolhas:[
    {texto:'"Abre as caixas."', vai:'c6_abre_as_caixas'},
    {texto:'Batalhar.', vai:'c6_luta_van'},
    {texto:'"Eu só quero saber pra onde vai."', vai:'c6_pra_onde_vai'},
    {texto:'Voltar pra vala. Foi burrice.', vai:'c6_so_olhou'}
  ]
},

c6_abre_as_caixas:{
  texto:[
    '"Abre as caixas."',
    'O motorista olha os dois que vieram do mato. Os dois dão de ombros.',
    'Ele abre. Abre mesmo, as quatro, sem discutir, e é isso que te desmonta pela segunda vez nessa jornada.',
    'Duas têm Pokémon. Uma tem seis Rattata e três Sandshrew, apertados. A outra tem um Growlithe deitado de lado, respirando devagar demais.',
    'A terceira tem fósseis embalados em espuma.',
    'A quarta tem pasta de papel. Muita. Com elástico.',
    '"Satisfeito?" Ele fecha as tampas uma a uma. "Agora sai do caminho."'
  ],
  ef:{flag:'viu_dentro_das_caixas',
      registrar:'Nas caixas: Pokémon vivos, fósseis, e uma caixa inteira de papelada.',
      presagio:'Uma caixa inteira só de papel. O papel viaja junto. O papel é o que importa.'},
  escolhas:[
    {texto:'Pegar a caixa do Growlithe e correr.', vai:'c6_roubou_growlithe'},
    {texto:'Pegar a caixa de papel e correr.', vai:'c6_roubou_papel'},
    {texto:'Batalhar.', vai:'c6_luta_van'},
    {texto:'Sair do caminho.', vai:'c6_saiu_do_caminho'}
  ]
},

c6_roubou_growlithe:{
  texto:[
    'Você pega a caixa do Growlithe com as duas mãos e corre pro mato.',
    'Eles não correm atrás. Você ouve o motorista dizer, alto, sem pressa: "Deixa."',
    'Você corre por quatro minutos de mato fechado e para porque não dá mais.',
    'Dentro da caixa, o Growlithe está com a respiração curta e as patas traseiras frias. Tem uma etiqueta amarrada no pescoço dele com barbante e um número escrito a caneta.',
    'Você tira a etiqueta. Leva mais tempo do que devia porque suas mãos estão tremendo.'
  ],
  ef:{flag:'salvou_o_growlithe',
      rep:{eixo:'bom',delta:3,motivo:'Tirou um Pokémon de dentro de uma caixa numerada'},
      registrar:'Tirou um Growlithe etiquetado da carga da van.',
      presagio:'Eles deixaram você levar. Um. Isso não é derrota deles.'},
  escolhas:[
    {texto:'Correr pro Centro Pokémon de Cerulean.', vai:'c6_growlithe_centro'},
    {texto:'Voltar e pegar mais uma caixa.', vai:'c6_voltou_por_mais'},
    {texto:'Ficar no mato até clarear.', vai:'c6_growlithe_centro'}
  ]
},

c6_growlithe_centro:{
  texto:[
    'Você corre uma hora e dez com uma caixa plástica nos braços, pela beira do rio, entrando em Cerulean quando o céu está começando a ficar cinza.',
    'A enfermeira do plantão abre a porta antes de você bater.',
    'Duas horas depois ela sai e diz que ele vai ficar bem, e que estava sedado, e que a dose era grande pro tamanho dele.',
    '"Quem sedou sabia fazer", ela diz, e olha pra você esperando uma explicação que você não tem.',
    'Ela anota alguma coisa numa ficha. Você não pergunta o quê.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Correu uma hora com uma caixa nos braços'},
      hp:-3, causa:'Corrida com a caixa até Cerulean',
      flag:'growlithe_salvo',
      umaVez:'c06_p1', pokemon:{dex:58, nivel:18, opcoes:{moral:30, historia:'Tirad{o} de uma caixa numerada num descampado, na estrada velha de Cerulean.'}},
      registrar:'O Growlithe da caixa sobreviveu.',
      presagio:'"Quem sedou sabia fazer." Tem profissional de saúde nisso.'},
  escolhas:[
    {texto:'Contar tudo pra Misty.', vai:'c6_bilac_leva'},
    {texto:'Dormir. Você não dorme há um dia e meio.', vai:'c6_rota25'},
    {texto:'Voltar pro descampado assim que clarear.', vai:'c6_estrada_depois'}
  ]
},

c6_voltou_por_mais:{
  texto:[
    'Você deixa a caixa no mato e volta.',
    'O descampado está vazio. Não tem van, não tem gente, não tem caixa.',
    'Tem um cigarro apagado no cascalho, ainda quente.',
    'Doze minutos. Você levou doze minutos e eles sumiram em doze minutos, o que quer dizer que eles têm um tempo padrão de retirada e que você está muito atrás nessa conta.'
  ],
  ef:{flag:'tempo_de_retirada',
      presagio:'Doze minutos. Eles treinaram isso.'},
  escolhas:[
    {texto:'Pegar a caixa do Growlithe e correr pro Centro.', vai:'c6_growlithe_centro'},
    {texto:'Procurar o que ficou no cascalho.', vai:'c6_cascalho'}
  ]
},

c6_roubou_papel:{
  texto:[
    'Você pega a caixa de papel.',
    'E dessa vez eles correm.',
    'Os três. O motorista na frente, e ele é rápido de um jeito que não combina com a idade dele.',
    'Você corre pro mato e o mato salva você — eles não conhecem, você também não, mas você é menor e o mato é mais generoso com quem é menor.',
    'Você corre até não conseguir e depois anda por mais uma hora e meia.',
    'Quando finalmente para, abre a caixa. Tem duzentas e poucas folhas. Guias de remessa, autos, laudos, e um documento grampeado com capa dura e o título em negrito no alto:',
    '"ESTATUTO DA COMISSÃO — ÍNTEGRA CONSOLIDADA".'
  ],
  ef:{flag:['tem_o_estatuto','papel_com_brasao'],
      hp:-5, causa:'Fuga pelo mato da Rota 25',
      rep:{eixo:'bom',delta:2,motivo:'Levou o papel em vez do que era mais fácil de carregar'},
      registrar:'Está com o Estatuto da Comissão e duzentas folhas de processo.',
      presagio:'Eles correram pelo papel e não correram pelo bicho. Agora você sabe a ordem das prioridades.'},
  escolhas:[
    {texto:'Ler o Estatuto agora mesmo, no mato, no escuro.', vai:'c6_leu_estatuto'},
    {texto:'Correr pra Cerulean e procurar a Misty.', vai:'c6_bilac_leva'},
    {texto:'Esconder tudo e só depois decidir.', vai:'c6_escondeu_estatuto'},
    {texto:'Voltar pro descampado quando clarear.', vai:'c6_estrada_depois'}
  ]
},

c6_leu_estatuto:{
  texto:[
    'Você lê com lanterna, deitad{o|a} no mato, às seis da manhã, com a mão tremendo de frio.',
    '"Art. 1º — A guarda de um ser vivo não é direito adquirido, mas concessão condicionada à idoneidade do guardião."',
    'Você lê três vezes.',
    '"Art. 4º — Compete à Comissão avaliar, de ofício ou mediante provocação, a idoneidade de qualquer guardião, independentemente de registro, licença ou vínculo com federação esportiva."',
    '"Art. 11 — Constatada a inidoneidade, procede-se ao recolhimento cautelar do espécime, que passa à custódia da Comissão até deliberação final."',
    'E, no fim, o que gela:',
    '"Art. 19 — Não há prazo para a deliberação final."'
  ],
  ef:{flag:'leu_o_estatuto',
      registrar:'Leu o Estatuto da Comissão: guarda é concessão, recolhimento cautelar, e sem prazo para deliberar.',
      presagio:'Não há prazo para a deliberação final. Todo o resto dessa história cabe nessa frase.'},
  escolhas:[
    {texto:'Correr pra Cerulean e procurar a Misty.', vai:'c6_bilac_leva'},
    {texto:'Esconder tudo em algum lugar.', vai:'c6_escondeu_estatuto'},
    {texto:'Continuar lendo até acabar.', vai:'c6_leu_tudo'},
    {texto:'Seguir pra Rota 25 com tudo isso.', vai:'c6_rota25'}
  ]
},

c6_leu_tudo:{
  texto:[
    'Você lê as duzentas folhas. Leva quatro horas e o sol nasce no meio.',
    'Quase tudo é chato. É essa a descoberta: é chatíssimo. Ofício respondendo ofício, prorrogação de prazo, juntada de documento.',
    'Mas em duas folhas tem nome.',
    'Um despacho assinado por "H. Colman — Presidência".',
    'E um laudo assinado por "Dr. M. Hollis — Núcleo Técnico".',
    'E, num canto de uma folha de rosto, um endereço: um prédio comercial em Saffron, sétimo andar, sala 704.'
  ],
  ef:{flag:['sabe_da_sala704','sabe_de_renno','sabe_de_sena'],
      hp:-2, causa:'Noite sem dormir lendo processo',
      registrar:'Nomes: H. Colman (Presidência), Dr. M. Hollis (Núcleo Técnico). Endereço: Saffron, sala 704.',
      presagio:'Sala 704. Sétimo andar. Você acabou de ganhar um destino final, e faltam muitas cidades até lá.'},
  escolhas:[
    {texto:'Ir pra Cerulean, procurar a Misty.', vai:'c6_bilac_leva'},
    {texto:'Esconder tudo.', vai:'c6_escondeu_estatuto'},
    {texto:'Seguir pra Rota 25.', vai:'c6_rota25'}
  ]
},

c6_escondeu_estatuto:{
  texto:[
    'Você acha uma árvore caída com o tronco oco e enfia a caixa lá dentro, e cobre com folha, e marca a árvore com uma pedra branca em cima de um toco.',
    'Depois anda trezentos metros, olha pra trás, e não consegue distinguir qual árvore é.',
    'Volta. Refaz a marcação com duas pedras brancas. Anda trezentos metros de novo. Dessa vez dá.',
    'É a coisa mais paranoica que você já fez e daqui a três meses você vai achar que foi pouco.'
  ],
  ef:{flag:'estatuto_escondido',
      presagio:'Tem uma caixa num tronco oco na Rota 25 com duas pedras brancas em cima de um toco.'},
  escolhas:[
    {texto:'Ir pra Cerulean.', vai:'c6_bilac_leva'},
    {texto:'Seguir pra Rota 25.', vai:'c6_rota25'}
  ]
},

c6_saiu_do_caminho:{
  texto:[
    'Você sai do caminho.',
    'Eles carregam as quatro caixas, fecham a porta lateral, e a van sai devagar porque a estrada é ruim.',
    'O motorista abaixa o vidro ao passar por você.',
    '"Você fica bem?" ele pergunta.',
    'Ele pergunta se você fica bem. Com uma preocupação que parece real.',
    'Você faz que sim com a cabeça e a van vai embora e você fica no descampado de cascalho ouvindo o motor diminuir.'
  ],
  ef:{flag:'saiu_do_caminho_da_van',
      presagio:'Ele perguntou se você fica bem. Gente assim é muito pior do que gente que ameaça.'},
  escolhas:[
    {texto:'Procurar o que ficou no cascalho.', vai:'c6_cascalho'},
    {texto:'Voltar pra cidade e contar pra Misty.', vai:'c6_bilac_leva'},
    {texto:'Seguir pra Rota 25.', vai:'c6_rota25'}
  ]
},

c6_pra_onde_vai:{
  texto:[
    '"Eu só quero saber pra onde vai."',
    'O motorista pensa nisso com uma seriedade que te pega de surpresa.',
    '"Saffron."',
    '"E depois?"',
    '"Não tem depois pra mim." Ele abre a porta da van. "Eu levo até o depósito. No depósito tem gente que recebe. Essa gente tem crachá e chefe e a gente não conversa."',
    'Ele entra.',
    '"Olha, {garoto|garota}. Eu dirijo. Faz onze anos que eu dirijo. Antes eu levava peixe congelado."',
    'Ele fecha a porta e fala pela janela:',
    '"Peixe congelado era pior. Cheirava."'
  ],
  ef:{flag:['destinacao_saffron','motorista_de_onze_anos'],
      registrar:'A van leva a carga para um depósito em Saffron.',
      presagio:'"Peixe congelado era pior. Cheirava." Ele não estava sendo cínico. É esse o problema.'},
  escolhas:[
    {texto:'Pegar a caixa de papel e correr.', vai:'c6_roubou_papel'},
    {texto:'Pegar a caixa dos vivos e correr.', vai:'c6_roubou_growlithe'},
    {texto:'Deixar ir e procurar o que ficou no chão.', vai:'c6_cascalho'},
    {texto:'Batalhar.', vai:'c6_luta_van'}
  ]
},

c6_luta_van:{
  texto:[
    'Você solta a bola no cascalho.',
    'O motorista suspira. Não é medo e não é raiva: é o suspiro de quem vai se atrasar.',
    '"Tá." Ele tira uma bola do bolso do casaco. "Rápido, então. Eu tenho horário."'
  ],
  batalha:{dex:104, nivel:26, tipo:'treinador', treinador:'Motorista', fuga:false,
           timeExtra:[{dex:56, nivel:27}],
           vitoria:'c6_venceu_van', derrota:'c6_perdeu_van', gameover:'gameover'}
},

c6_venceu_van:{
  texto:[
    'Você ganha. Os três ficam parados no cascalho, e você fica parad{o|a} no cascalho, e as quatro caixas continuam exatamente onde estavam.',
    'O motorista recolhe o time e limpa a mão na calça.',
    '"Pronto." Ele não parece abalado. "E agora?"',
    'É sempre essa pergunta. Em toda cidade, em toda caverna, é sempre essa pergunta.',
    'Ele abre a porta da van, mas não entra. Espera. Genuinamente espera pra ver o que você vai fazer, com uma curiosidade quase gentil.'
  ],
  ef:{flag:'venceu_o_motorista', dinheiro:1200},
  escolhas:[
    {texto:'Pegar a caixa de papel.', vai:'c6_roubou_papel'},
    {texto:'Pegar a caixa dos vivos.', vai:'c6_roubou_growlithe'},
    {texto:'"Abre as caixas."', vai:'c6_abre_as_caixas'},
    {texto:'Sair do caminho.', vai:'c6_saiu_do_caminho'}
  ]
},

c6_perdeu_van:{
  texto:[
    'Você perde.',
    'Ninguém encosta em você. O motorista recolhe a bola, olha o relógio, e pergunta se você tem como voltar pra cidade sozinh{o|a}.',
    'Você responde que tem.',
    '"Então vai." Ele já está carregando a última caixa. "E não conta pra ninguém que você veio aqui, tá? Não por mim. Por você."',
    'A van sai. Você fica sentad{o|a} no cascalho com o time desmaiado e o sol nascendo.'
  ],
  ef:{hp:-4, causa:'Derrota no ponto da van', flag:'perdeu_pro_motorista',
      presagio:'"Não por mim. Por você." Foi a única ameaça da noite e ela veio embrulhada em cuidado.'},
  escolhas:[
    {texto:'Procurar o que ficou no cascalho.', vai:'c6_cascalho'},
    {texto:'Voltar pra cidade e contar pra Misty.', vai:'c6_bilac_leva'},
    {texto:'Seguir pra Rota 25.', vai:'c6_rota25'}
  ]
},

c6_seguiu_van_25:{
  texto:[
    'Você espera a van sair e segue pelo acostamento, no escuro, correndo quando ela some na curva.',
    'Isso funciona por seiscentos metros, até a estrada velha encontrar o asfalto.',
    'A van vira à direita. Direita é o sentido de Saffron.',
    'Você fica no acostamento vendo as lanternas traseiras diminuírem, com uma placa em cima da sua cabeça e o sol nascendo atrás dela.'
  ],
  ef:{flag:'destinacao_saffron', hp:-2, causa:'Corrida no acostamento',
      presagio:'Direita. Saffron. Falta muito, e você vai chegar.'},
  escolhas:[
    {texto:'Voltar e ver o que ficou no cascalho.', vai:'c6_cascalho'},
    {texto:'Voltar pra cidade e contar pra Misty.', vai:'c6_bilac_leva'},
    {texto:'Seguir pra Rota 25.', vai:'c6_rota25'}
  ]
},

c6_seguiu_os_dois:{
  texto:[
    'Você deixa a van ir e segue os dois que vieram do mato.',
    'Eles voltam pela trilha, sem lanterna, o que quer dizer que fazem isso há tempo suficiente pra decorar.',
    'Quarenta minutos depois, eles saem do mato e entram numa casa comum, numa rua comum, na periferia norte de Cerulean.',
    'Tem varal com roupa de criança. Tem bicicleta no portão.',
    'Um deles dá boa noite pro outro. O outro responde. As luzes acendem em duas casas vizinhas.',
    'Eles são vizinhos. Eles vão pro trabalho juntos e voltam juntos e moram um do lado do outro.'
  ],
  ef:{flag:'sabe_onde_moram',
      registrar:'Os dois que entregam a carga são vizinhos, numa rua comum da periferia norte de Cerulean.',
      presagio:'Tem varal com roupa de criança. Guarda isso pra quando você decidir o que fazer com esse endereço.'},
  escolhas:[
    {texto:'Bater na porta.', vai:'c6_bateu_na_porta'},
    {texto:'Anotar o endereço e ir embora.', vai:'c6_anotou_endereco'},
    {texto:'Esperar de manhã e seguir eles de novo.', vai:'c6_estrada_depois'},
    {texto:'Ir embora e esquecer que viu.', vai:'c6_rota25', ef:{flag:'esqueceu_o_endereco'}}
  ]
},

c6_bateu_na_porta:{
  texto:[
    'Você bate na porta às seis e dez da manhã.',
    'Abre uma mulher de uns trinta anos com uma criança pendurada na perna.',
    '"Pois não?"',
    'E você não tem absolutamente nada pra dizer. Você preparou uma frase pro homem e a frase não serve pra ela.',
    '"Eu... me enganei de casa."',
    'Ela fecha a porta. Do lado de dentro, você ouve a criança perguntar quem era, e ela responder "ninguém".'
  ],
  ef:{flag:'bateu_na_porta_errada',
      presagio:'"Ninguém." Por enquanto.'},
  escolhas:[
    {texto:'Anotar o endereço e ir embora.', vai:'c6_anotou_endereco'},
    {texto:'Esperar ele sair e falar na rua.', vai:'c6_falou_na_rua'},
    {texto:'Ir embora de vez.', vai:'c6_rota25'}
  ]
},

c6_falou_na_rua:{
  texto:[
    'Você espera na esquina. Ele sai às sete e vinte com uma marmita e uma bicicleta.',
    'Você fala com ele no meio da rua.',
    'Ele não nega nada. Essa é a parte que você nunca vai se acostumar: ninguém nega nada.',
    '"Eu carrego caixa do mato até o cascalho", ele diz, com a bicicleta entre vocês dois. "Quatro por semana. Trezentos cada."',
    '"Você sabe o que tem dentro."',
    '"Eu sei o que tem dentro."',
    'Ele olha pra trás, pro varal, pra casa.',
    '"E eu tenho três filho, e o mais velho tem asma, e bombinha custa oitenta e quatro."'
  ],
  ef:{flag:'conversou_com_o_carregador',
      npc:{nome:'Carregador da Rota 25', opiniao:1, memoria:'Você o encarou na rua de casa. Ele não negou nada.'},
      registrar:'O carregador da Rota 25: quatro caixas por semana, trezentos cada.',
      presagio:'Oitenta e quatro pokedólares. É sempre um número pequeno que segura a engrenagem inteira.'},
  escolhas:[
    {texto:'Dar dinheiro pra ele. (2.500 ₽)', vai:'c6_pagou_carregador', cond:d=>d.jogador.dinheiro>=2500,
     ef:{dinheiro:-2500, rep:{eixo:'bom',delta:2,motivo:'Pagou a bombinha de uma criança que não conhece'}, flag:'pagou_o_carregador'}},
    {texto:'"Me fala quem recebe no depósito."', vai:'c6_quem_recebe'},
    {texto:'"Isso não justifica."', vai:'c6_nao_justifica_25'},
    {texto:'Ir embora sem dizer nada.', vai:'c6_rota25'}
  ]
},

c6_pagou_carregador:{
  texto:[
    'Ele conta o dinheiro com a bicicleta apoiada no quadril.',
    '"Isso é trinta bombinha."',
    '"É."',
    '"E depois das trinta?"',
    'Você não responde, porque a resposta é "não sei", e ele sabe que é "não sei".',
    'Ele guarda no bolso da frente. Depois faz uma coisa: tira um papel do bolso de trás, uma nota de entrega amassada, e te entrega.',
    '"Isso aqui é da semana passada. Tem o carimbo do depósito."'
  ],
  ef:{flag:['papel_com_brasao','nota_do_deposito'],
      npc:{nome:'Carregador da Rota 25', opiniao:5, memoria:'Você pagou trinta bombinhas de asma e ele te deu uma nota carimbada do depósito.'},
      registrar:'Ganhou uma nota de entrega com carimbo do depósito de Saffron.',
      presagio:'Ele te deu o papel sem você pedir. Ele queria dar pra alguém há muito tempo.'},
  escolhas:[
    {texto:'"Me fala quem recebe no depósito."', vai:'c6_quem_recebe'},
    {texto:'Agradecer e ir pra Rota 25.', vai:'c6_rota25'},
    {texto:'Levar a nota pra Misty.', vai:'c6_bilac_leva'}
  ]
},

c6_quem_recebe:{
  texto:[
    '"Me fala quem recebe no depósito."',
    '"Eu nunca entrei no depósito." Ele ajeita a marmita no bagageiro. "Eu vou até o cascalho e volto. Quem entra é o motorista."',
    'Ele pensa um pouco.',
    '"Mas uma vez eu fui junto, porque o motorista tava com o braço quebrado e eu dirigi." Ele faz uma careta. "Portão automático. Doca coberta. Tem uma mulher com prancheta que confere caixa por caixa."',
    '"Como ela é?"',
    '"Alta. Uns cinquenta. Óculos na cabeça." Ele monta na bicicleta. "E ela trata a gente super bem, cara. Ela ofereceu café. Eu tomei café com ela."'
  ],
  ef:{flag:'sabe_da_auditora',
      registrar:'No depósito de Saffron: doca coberta e uma mulher com prancheta que confere caixa por caixa.',
      presagio:'Ela ofereceu café. Você vai sentar na frente dela um dia.'},
  escolhas:[
    {texto:'Ir pra Rota 25.', vai:'c6_rota25'},
    {texto:'Levar tudo pra Misty.', vai:'c6_bilac_leva'},
    {texto:'"Isso não justifica."', vai:'c6_nao_justifica_25'}
  ]
},

c6_nao_justifica_25:{
  texto:[
    '"Isso não justifica."',
    'Ele para de montar na bicicleta.',
    '"Eu não falei que justifica."',
    'Ele não está bravo. Ele está corrigindo um erro de leitura, com paciência.',
    '"Eu falei que é o que tem." Ele monta. "Justificar é coisa de quem tem escolha, {moço|moça}. Eu tenho asma de criança."',
    'Ele sai pedalando e vira na esquina sem olhar pra trás.'
  ],
  ef:{flag:'discutiu_com_o_carregador'},
  escolhas:[
    {texto:'Ir atrás dele.', vai:'c6_falou_na_rua'},
    {texto:'Anotar o endereço e ir embora.', vai:'c6_anotou_endereco'},
    {texto:'Ir pra Rota 25.', vai:'c6_rota25'}
  ]
},

c6_anotou_endereco:{
  texto:[
    'Você anota o nome da rua e o número da casa num canto do seu caderno, e fecha o caderno, e guarda.',
    'Não é pra usar agora. Você sabe disso.',
    'É pra quando alguém te perguntar, numa sala, com um papel na frente, se você sabe de nomes e de endereços.',
    'E é aí que você vai ter que decidir o que fazer com uma rua que tem varal com roupa de criança.'
  ],
  ef:{flag:'anotou_o_endereco',
      presagio:'Você tem um endereço no caderno. Um dia alguém vai pedir ele, com muita educação.'},
  escolhas:[
    {texto:'Ir pra Rota 25.', vai:'c6_rota25'},
    {texto:'Voltar e falar com ele na rua.', vai:'c6_falou_na_rua'},
    {texto:'Levar tudo pra Misty.', vai:'c6_bilac_leva'}
  ]
},

c6_so_olhou:{
  texto:[
    'Você não se mexe.',
    'A van sai às cinco e doze. Os dois voltam pro mato às cinco e treze.',
    'Você fica na vala por mais quarenta minutos porque as suas pernas não obedecem e porque você quer ter certeza.',
    'Quando sai, o sol já está batendo no cascalho, e o descampado é só um descampado.',
    'Você não fez nada. Mas você viu, e você é a única pessoa em Kanto que viu isso de fora, e isso não é nada.'
  ],
  ef:{flag:'viu_e_nao_agiu',
      rep:{eixo:'bom',delta:1,motivo:'Segurou o impulso e ficou com a informação'},
      presagio:'Você viu de fora. Informação vista de fora é a única que não tem contraparte.'},
  escolhas:[
    {texto:'Procurar o que ficou no cascalho.', vai:'c6_cascalho'},
    {texto:'Ir pra cidade contar pra Misty.', vai:'c6_bilac_leva'},
    {texto:'Voltar amanhã e olhar de dia.', vai:'c6_estrada_depois'},
    {texto:'Seguir pra Rota 25.', vai:'c6_rota25'}
  ]
},

c6_estrada_depois:{
  texto:[
    'De dia o descampado é ridiculamente banal: cascalho, mato na borda, um retângulo de concreto e um poste.',
    'Nenhuma pessoa que passasse aqui de dia pensaria em nada.',
    'É por isso que é aqui. Não é escondido. É insignificante, que é muito melhor que escondido.',
    'Você fica em pé no meio, girando devagar, olhando as quatro direções, entendendo pela primeira vez que essas pessoas são muito boas no que fazem.'
  ],
  ef:{flag:'entendeu_o_ponto',
      presagio:'Insignificante é melhor que escondido. Anota. Você vai precisar disso pra encontrar os outros pontos.'},
  escolhas:[
    {texto:'Procurar no cascalho.', vai:'c6_cascalho'},
    {texto:'Ir pra cidade contar pra Misty.', vai:'c6_bilac_leva'},
    {texto:'Seguir pra Rota 25.', vai:'c6_rota25'}
  ]
}
,

/* ─────────────── ROTA 25 ─────────────── */

c6_rota25:{
  texto:[
    'A Rota 25 acompanha o rio até o mar e é a coisa mais bonita que você viu desde que saiu de casa.',
    'Tem cabana de pescador com varanda de madeira. Tem trilha de terra batida com raiz atravessada. Tem gente pescando em silêncio há horas, sentada em banquinho dobrável, com garrafa térmica.',
    'Depois de tudo o que você viu em três dias, isso aqui parece um lugar de outro mundo.',
    'E aí você ouve.',
    'Alguém chorando. Adulto, tentando não fazer barulho, o que é o pior tipo.'
  ],
  ef:{registrar:'Entrou na Rota 25.'},
  escolhas:[
    {texto:'Ir ver.', vai:'c6_marta'},
    {texto:'Chamar de longe antes de chegar perto.', vai:'c6_chamou_marta'},
    {texto:'Seguir caminho. Não é da sua conta.', vai:'c6_seguiu_do_choro'},
    {texto:'Ficar parad{o|a} e escutar mais um pouco.', vai:'c6_escutou_choro'}
  ]
},

c6_escutou_choro:{
  texto:[
    'Você fica parad{o|a} na trilha por uns quarenta segundos escutando alguém chorar.',
    'É uma coisa horrível de fazer e você faz.',
    'Pelo som dá pra saber três coisas: é mulher, está a uns trinta metros na direção da água, e já está chorando há muito tempo — a respiração está naquele ritmo que só acontece depois de um bom tempo.',
    'Também dá pra ouvir que ela está falando. Não palavras: um nome, repetido.'
  ],
  escolhas:[
    {texto:'Ir ver.', vai:'c6_marta'},
    {texto:'Chamar de longe.', vai:'c6_chamou_marta'},
    {texto:'Seguir caminho.', vai:'c6_seguiu_do_choro'}
  ]
},

c6_chamou_marta:{
  texto:[
    '"Ô!" Você grita da trilha. "Tá tudo bem aí?"',
    'O choro para na hora, do jeito que para quem foi pego.',
    'Uns cinco segundos de nada.',
    '"NÃO." A voz sai rouca e alta. "NÃO TÁ."',
    'E aí, mais baixo, quase pra si mesma: "Você entende de veneno?"'
  ],
  escolhas:[
    {texto:'Ir até lá.', vai:'c6_marta'},
    {texto:'"Não." E ir até lá mesmo assim.', vai:'c6_marta'},
    {texto:'"Não." E seguir caminho.', vai:'c6_seguiu_do_choro'}
  ]
},

c6_marta:{
  texto:[
    'Ela está sentada na beira da água com um Vaporeon deitado no colo.',
    'Uns quarenta anos. Roupa de trabalho — camisa de uniforme de supermercado, com crachá ainda pendurado. Ela saiu do trabalho e veio direto.',
    'O Vaporeon está respirando errado. Rápido demais, curto demais, com uma pausa no fim de cada ciclo que não devia estar ali.',
    '"Ele comeu alguma coisa", ela diz sem olhar pra você. "Na cidade. Tem gente pondo veneno nos Pokémon de rua e ele comeu."',
    '"Ele é seu?"',
    '"Ele é de rua." Ela ajeita a cabeça dele no colo. "Ele é de rua e ele é meu. As duas coisas."'
  ],
  ef:{npc:{nome:'Sibyl', opiniao:0, memoria:'Você a encontrou na Rota 25 com um Vaporeon de rua envenenado no colo.'},
      registrar:'Encontrou Sibyl e o Vaporeon envenenado na Rota 25.'},
  escolhas:[
    {texto:'Dar seu Antídoto / Full Heal.', vai:'c6_curou', cond:d=>Estado.contaItem('Antidote')>0||Estado.contaItem('Full Heal')>0},
    {texto:'Carregar o Vaporeon até o Centro Pokémon. Uma hora de corrida.', vai:'c6_correu'},
    {texto:'Ficar com ela. Não tem o que fazer.', vai:'c6_ficou'},
    {texto:'"Onde é que tem o veneno? Me leva lá."', vai:'c6_marta_leva'}
  ]
},

c6_marta_leva:{
  texto:[
    '"Onde é que tem o veneno? Me leva lá."',
    'Ela levanta a cabeça pela primeira vez.',
    '"Pra quê?"',
    '"Porque se eu souber o que é, o Centro sabe o que dar."',
    'Ela pensa. Olha o Vaporeon. Olha você.',
    '"Não dá pra eu carregar ele e andar."',
    '"Então eu carrego e você me leva."'
  ],
  escolhas:[
    {texto:'Carregar e ir junto.', vai:'c6_correu', ef:{flag:'foi_com_marta'}},
    {texto:'Dar seu Antídoto primeiro.', vai:'c6_curou', cond:d=>Estado.contaItem('Antidote')>0||Estado.contaItem('Full Heal')>0},
    {texto:'"Me fala só onde é. Eu vou e volto."', vai:'c6_foi_sozinho_tigelas'},
    {texto:'Ficar com ela.', vai:'c6_ficou'}
  ]
},

c6_foi_sozinho_tigelas:{
  texto:[
    'Ela explica: quinhentos metros trilha acima, onde tem a curva com a árvore caída.',
    'Você corre. Encontra em seis minutos.',
    'Tigelas. Umas quinze, espalhadas onde os Pokémon de rua bebem e comem, em pontos onde eles claramente já vinham há muito tempo.',
    'A ração é boa. Cara. Do tipo que ninguém desperdiça.',
    'Você pega um punhado e cheira, e não cheira a nada, e é exatamente por isso que funciona.',
    'Mas na quinta tigela tem um pacote rasgado jogado no mato ao lado, e no pacote tem nome comercial e princípio ativo impresso em letra miúda.'
  ],
  ef:{flag:['achou_as_tigelas','sabe_o_veneno'],
      registrar:'Identificou o princípio ativo do veneno das tigelas da Rota 25.',
      presagio:'Você pegou o nome. Agora o Centro sabe o que fazer, e isso é a diferença entre duas coisas muito diferentes.'},
  escolhas:[
    {texto:'Voltar correndo com o pacote.', vai:'c6_voltou_com_pacote'},
    {texto:'Virar todas as tigelas antes de voltar.', vai:'c6_virou_antes'},
    {texto:'Voltar e depois resolver as tigelas.', vai:'c6_voltou_com_pacote'}
  ]
},

c6_virou_antes:{
  texto:[
    'Você vira as quinze tigelas. Leva quatro minutos e você faz isso com raiva, chutando.',
    'Quatro minutos que você não tinha.',
    'Quando volta, a Sibyl está do mesmo jeito e o Vaporeon está pior, e você não vai nunca saber se os quatro minutos importaram.'
  ],
  ef:{flag:['destruiu_tigelas','quatro_minutos'],
      presagio:'Você não vai nunca saber se os quatro minutos importaram. É esse o formato dessa dúvida.'},
  escolhas:[
    {texto:'Correr pro Centro com o Vaporeon.', vai:'c6_correu', ef:{flag:'com_o_pacote'}},
    {texto:'Dar seu Antídoto.', vai:'c6_curou', cond:d=>Estado.contaItem('Antidote')>0||Estado.contaItem('Full Heal')>0},
    {texto:'Ficar com ela.', vai:'c6_ficou'}
  ]
},

c6_voltou_com_pacote:{
  texto:[
    'Você volta correndo com o pacote rasgado na mão.',
    'Sibyl lê o nome e não entende nada, e é claro que não entende, e você também não.',
    'Mas agora existe um papel com um nome, e um papel com um nome é uma coisa que se entrega numa recepção de Centro Pokémon.',
    '"Vamos", você diz, e pega o Vaporeon do colo dela antes de ela decidir.'
  ],
  ef:{flag:'com_o_pacote'},
  escolhas:[
    {texto:'Correr.', vai:'c6_correu'},
    {texto:'Dar seu Antídoto primeiro e depois correr.', vai:'c6_curou', cond:d=>Estado.contaItem('Antidote')>0||Estado.contaItem('Full Heal')>0}
  ]
},

c6_seguiu_do_choro:{
  texto:[
    'Você passa. Ela nem levanta a cabeça.',
    'Duzentos metros depois o som para.',
    'Você não sabe se é porque acabou ou porque ficou longe.',
    'Você não volta pra descobrir. Essa é a parte que você vai ter que carregar, e ela não pesa nada, e é justamente por não pesar nada que ela funciona assim.'
  ],
  ef:{rep:{eixo:'ruim',delta:2,motivo:'Passou reto por alguém em desespero'},
      flag:'ignorou_marta', registrar:'Ignorou Sibyl e o Vaporeon morrendo na Rota 25.',
      presagio:'Não pesou nada. Isso vai ser o problema.'},
  escolhas:[
    {texto:'Continuar pela rota.', vai:'c6_veneno'},
    {texto:'Voltar. Você não consegue continuar.', vai:'c6_marta'}
  ]
},

c6_curou:{
  texto:[
    'Você abre a mochila e o frasco já está na mão dela antes de você terminar de explicar como usa.',
    'Ela aplica errado na primeira vez. Você segura a mão dela e mostra, e a mão dela está gelada.',
    'Leva sete minutos.',
    'A respiração do Vaporeon vai ficando longa de novo, aquela pausa horrível no fim do ciclo vai sumindo, e no oitavo minuto ele abre os olhos e lambe a mão dela.',
    'Sibyl chora de um jeito completamente diferente agora.',
    '"Como é seu nome?" ela pergunta. Você fala. Ela repete duas vezes pra decorar.'
  ],
  ef:{executar:d=>{ if(Estado.contaItem('Full Heal')) Estado.usarItem('Full Heal'); else Estado.usarItem('Antidote'); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Salvou o Pokémon de uma estranha na Rota 25'},
      npc:{nome:'Sibyl', opiniao:8, memoria:'Você salvou o Vaporeon dela. Ela decorou o seu nome na hora.'},
      flag:'salvou_vaporeon', itens:{'Hyper Potion':2,'Full Heal':2},
      presagio:'Ela decorou o seu nome. Em Kanto, gente que decora seu nome é o que sobra no fim.'},
  escolhas:[
    {texto:'"Quem faz isso?" Perguntar do veneno.', vai:'c6_marta_conta'},
    {texto:'Ajudar ela a levar o Vaporeon pra casa.', vai:'c6_levou_pra_casa'},
    {texto:'Seguir pela rota.', vai:'c6_veneno'},
    {texto:'Ficar mais um pouco com ela na beira da água.', vai:'c6_marta_agua'}
  ]
},

c6_marta_agua:{
  texto:[
    'Vocês ficam os três na beira da água: você, ela, e um Vaporeon fraco demais pra entrar no rio que está a meio metro dele.',
    'Ela conta que trabalha no supermercado da ponte sul, turno da tarde, há nove anos.',
    'Conta que o Vaporeon apareceu no estacionamento há quatro anos e nunca foi embora, e que ela nunca tentou pegar ele numa bola.',
    '"Por que não?"',
    '"Porque aí ele ia ser meu." Ela dá de ombros. "Ele não é meu. Ele fica."',
    'Ela olha pra ele.',
    '"Ficar é melhor. Ficar é uma coisa que a pessoa faz todo dia de novo."'
  ],
  ef:{flag:'ficar_e_melhor', moral:10,
      npc:{nome:'Sibyl', opiniao:3, memoria:'Te contou por que nunca pôs o Vaporeon numa bola.'},
      presagio:'"Ficar é uma coisa que a pessoa faz todo dia de novo." Pensa nisso olhando pro seu cinto.'},
  escolhas:[
    {texto:'"Quem faz isso? O veneno."', vai:'c6_marta_conta'},
    {texto:'Ajudar ela a levar ele pra casa.', vai:'c6_levou_pra_casa'},
    {texto:'Seguir pela rota.', vai:'c6_veneno'}
  ]
},

c6_levou_pra_casa:{
  texto:[
    'Vocês levam o Vaporeon pro apartamento dela, que fica em cima de uma oficina e tem dezoito degraus de escada externa.',
    'É pequeno e muito limpo. Tem uma toalha velha dobrada num canto da sala que é claramente a cama dele.',
    'Ela faz café. Você bebe café numa cozinha de estranha às sete da noite e é a coisa mais normal que te acontece em uma semana.',
    'Na estante tem um porta-retrato com uma menina de uns dezoito anos de uniforme de escola.',
    'Você não pergunta. Ela repara que você não perguntou, e agradece com a cabeça.'
  ],
  ef:{hp:5, npc:{nome:'Sibyl', opiniao:4, memoria:'Você subiu com o Vaporeon e tomou café na cozinha dela.'},
      presagio:'Tem um porta-retrato na estante e você não perguntou. Você vai perguntar um dia, e vai ser tarde.'},
  escolhas:[
    {texto:'"Quem faz isso? O veneno."', vai:'c6_marta_conta'},
    {texto:'Agradecer o café e ir pra rota.', vai:'c6_veneno'},
    {texto:'Perguntar da foto.', vai:'c6_a_foto'}
  ]
},

c6_a_foto:{
  texto:[
    '"Quem é na foto?"',
    'Sibyl olha a estante como se tivesse esquecido que a foto existia.',
    '"Minha filha."',
    'Ela mexe o café.',
    '"Ela saiu de casa aos quinze, igual você." Uma pausa exata. "Faz três anos."',
    '"E ela—"',
    '"Ela liga no Natal." Sibyl sorri um sorriso pequeno e verdadeiro. "Ela tá bem. Ela tá em Celadon e ela tá bem e ela não volta."',
    'Ela bebe o café.',
    '"E tá tudo certo. Foi pra isso que eu criei. Só que a casa fica muito grande."'
  ],
  ef:{flag:'a_filha_da_marta',
      npc:{nome:'Sibyl', opiniao:4, memoria:'Te contou da filha que saiu aos quinze e liga no Natal.'},
      presagio:'A casa fica muito grande. Pensa na sua, e em quem ficou nela.'},
  escolhas:[
    {texto:'"Eu ligo pra minha mãe hoje."', vai:'c6_ligou_pra_casa',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Lembrou de quem ficou'}, flag:'ligou_pra_casa'}},
    {texto:'"Quem faz isso? O veneno."', vai:'c6_marta_conta'},
    {texto:'Agradecer e ir pra rota.', vai:'c6_veneno'}
  ]
},

c6_ligou_pra_casa:{
  texto:[
    'Você liga do telefone público da ponte sul, às nove da noite, com uma pilha de moedas em cima do aparelho.',
    'Sua mãe atende no primeiro toque, o que quer dizer que ela estava perto do telefone, o que quer dizer muita coisa.',
    'A conversa é péssima. É constrangida, cheia de "e aí", com você mentindo por omissão sobre uma caverna e uma vala.',
    'Dura quatorze minutos e vocês dois dizem quase nada.',
    'Quando desliga, você fica com a mão no gancho por um tempo, e é o melhor que você se sente desde que saiu de casa.'
  ],
  ef:{hp:5, moral:10, flag:'ligou_pra_casa',
      rep:{eixo:'bom',delta:1,motivo:'Ligou pra casa'},
      presagio:'Catorze minutos e quase nada dito. Liga de novo. Sempre dá pra ligar de novo, até um dia não dar.'},
  escolhas:[
    {texto:'Voltar pra Rota 25.', vai:'c6_veneno'},
    {texto:'"Quem faz isso? O veneno." Voltar e perguntar.', vai:'c6_marta_conta'}
  ]
},

c6_marta_conta:{
  texto:[
    '"Quem faz isso? O veneno."',
    'Sibyl fica dura.',
    '"Todo mundo sabe quem faz."',
    '"E ninguém—"',
    '"Ninguém." Ela corta. "Porque ele tem razão."',
    'Ela vê a sua cara e explica, cansada:',
    '"Os bicho de rua tavam entrando nas casa. Um Rattata mordeu a mão de uma menina de sete anos no quintal, aqui na Rota 25. Levou ponto."',
    'Ela olha o Vaporeon dormindo.',
    '"Aí o pai da menina resolveu. E metade dessa rota acha que ele tá certo, e a outra metade acha que ele tá errado, e as duas metades compram na mesma padaria."'
  ],
  ef:{flag:'sabe_do_envenenador', registrar:'O envenenador da Rota 25 é o pai de uma menina que foi mordida.'},
  escolhas:[
    {texto:'Ir atrás dele agora.', vai:'c6_veneno'},
    {texto:'"E a senhora, acha o quê?"', vai:'c6_marta_acha'},
    {texto:'"Onde é que ele mora?"', vai:'c6_onde_mora'},
    {texto:'Deixar pra lá e seguir pela rota.', vai:'c6_veneno'}
  ]
},

c6_marta_acha:{
  texto:[
    '"E a senhora, acha o quê?"',
    'Sibyl demora muito.',
    '"Eu acho que eu ia fazer igual." Ela fala olhando pro chão. "Se fosse a minha filha com sete anos e a mão costurada, eu ia fazer igual e eu ia dormir bem."',
    'Ela levanta a cabeça.',
    '"E aí um dia ia chegar {um garoto|uma garota} na minha porta e eu ia ter que explicar."',
    'Ela mexe o café que já acabou.',
    '"Eu não sei o que eu acho, {moço|moça}. Eu sei que o meu tá vivo no chão da minha sala e que outro não tá."'
  ],
  ef:{flag:'as_duas_metades',
      presagio:'Ninguém aqui é o vilão. Você já ouviu isso numa pedreira e vai ouvir de novo numa torre.'},
  escolhas:[
    {texto:'Ir atrás dele.', vai:'c6_veneno'},
    {texto:'"Onde é que ele mora?"', vai:'c6_onde_mora'},
    {texto:'Seguir pela rota.', vai:'c6_veneno'}
  ]
},

c6_onde_mora:{
  texto:[
    '"Onde é que ele mora?"',
    'Sibyl te olha desconfiada pela primeira vez desde que vocês se conheceram.',
    '"Pra quê?"',
    '"Pra conversar."',
    '"Conversar." Ela repete sem acreditar. "Todo mundo que pergunta endereço fala que é pra conversar."',
    'Mas ela fala. Cabana verde na curva, depois da árvore caída, com uma bicicleta rosa de criança encostada na parede.',
    '"Tem bicicleta rosa lá fora", ela acrescenta, e é um aviso, e ela sabe que é um aviso.'
  ],
  ef:{flag:'endereco_do_envenenador',
      presagio:'Tem uma bicicleta rosa encostada na parede. Ela te falou isso de propósito.'},
  escolhas:[
    {texto:'Ir lá.', vai:'c6_veneno'},
    {texto:'Não ir. Seguir pela rota.', vai:'c6_veneno'},
    {texto:'Ficar mais um pouco com ela.', vai:'c6_marta_agua'}
  ]
},

c6_correu:{
  texto:[
    'O Vaporeon pesa vinte e nove quilos. Você descobre isso na prática, no quilômetro dois.',
    'Ele é escorregadio e não tem onde segurar direito e a cabeça dele balança com o seu passo, o que te obriga a correr de um jeito que não é correr.',
    'Sibyl corre do seu lado dizendo o nome dele sem parar, como se o nome fosse segurar ele aqui.',
    'O nome dele é Duque. Você vai lembrar disso.'
  ],
  teste:{status:'forca', dificuldade:7, nomeStatus:'Força',
         critico:'c6_correu_ok', sucesso:'c6_correu_ok', parcial:'c6_correu_quase', falha:'c6_correu_tarde'}
},

c6_correu_ok:{
  texto:[
    'Você chega. Os seus braços não funcionam direito por vinte minutos depois, mas você chega.',
    'A enfermeira leva o Vaporeon pra dentro correndo.',
    d=>d.flags.com_o_pacote ? 'Você entrega o pacote rasgado do veneno na recepção, e a enfermeira lê o princípio ativo enquanto anda, e grita uma coisa pra dentro que você não entende, e isso — você vai descobrir depois — foi o que resolveu.' : 'Ninguém sabe o que ele comeu. Eles tratam pelo sintoma, que é o mesmo que tratar no escuro.',
    'Vinte minutos depois ela volta e faz que sim com a cabeça.',
    'Sibyl abraça você. É desconfortável e você deixa acontecer.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Carregou um Pokémon envenenado por uma hora até o Centro'},
      hp:-4, causa:'Exaustão na Rota 25',
      npc:{nome:'Sibyl', opiniao:9, memoria:'Você carregou o Vaporeon dela por uma hora inteira. Ela conta essa história pra todo mundo do supermercado.'},
      flag:'salvou_vaporeon', itens:{'Hyper Potion':2}, dinheiro:800},
  escolhas:[
    {texto:'"Quem faz isso? O veneno."', vai:'c6_marta_conta'},
    {texto:'Ajudar ela a levar ele pra casa.', vai:'c6_levou_pra_casa'},
    {texto:'Seguir pela rota.', vai:'c6_veneno'},
    {texto:'Sentar no chão do Centro e não levantar por um tempo.', vai:'c6_sentou_centro'}
  ]
},

c6_sentou_centro:{
  texto:[
    'Você senta no chão da recepção do Centro Pokémon, de costas pra parede, com as pernas esticadas, sem nenhuma dignidade.',
    'A enfermeira passa duas vezes e na terceira traz um copo de água e senta no chão do seu lado, o que enfermeira de Centro Pokémon não faz.',
    '"Você carregou vinte e nove quilo por uma hora."',
    '"Foi."',
    '"Você tem quantos anos?"',
    '"Quinze."',
    'Ela bebe da própria caneca.',
    '"Eu vou te dar um conselho que ninguém te deu ainda: come de três em três horas. Não é frescura. Gente que carrega coisa precisa comer de três em três horas."'
  ],
  ef:{hp:6, flag:'conselho_da_enfermeira',
      presagio:'É um conselho idiota e você vai lembrar dele numa montanha, com fome, muito longe de qualquer lugar.'},
  escolhas:[
    {texto:'Ficar até o Vaporeon acordar.', vai:'c6_levou_pra_casa'},
    {texto:'Seguir pela rota.', vai:'c6_veneno'},
    {texto:'"Quem faz o veneno?"', vai:'c6_marta_conta'}
  ]
},

c6_correu_quase:{
  texto:[
    'Você chega. Tarde, mas chega.',
    'Eles conseguem estabilizar. O Vaporeon vai viver, e não vai voltar a ser o que era — o veneno ficou em algum lugar que não sai, e uma das patas traseiras não responde direito.',
    'Sibyl agradece muito. Muito demais, do jeito de quem está agradecendo pra não pensar no resto.',
    'Três semanas depois, se você voltar a Cerulean, vai ver um Vaporeon na beira do rio com um jeito de andar diferente, e uma mulher de uniforme de supermercado sentada do lado dele.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Tentou salvar o Vaporeon de Sibyl'}, hp:-5, causa:'Exaustão na Rota 25',
      npc:{nome:'Sibyl', opiniao:5, memoria:'Você correu com o Vaporeon dela. Ele sobreviveu com sequelas.'},
      flag:['vaporeon_sequela','salvou_vaporeon']},
  escolhas:[
    {texto:'"Quem faz isso? O veneno."', vai:'c6_marta_conta'},
    {texto:'Sentar no chão do Centro.', vai:'c6_sentou_centro'},
    {texto:'Seguir pela rota.', vai:'c6_veneno'}
  ]
},

c6_correu_tarde:{
  texto:[
    'Você tropeça no quilômetro quatro. Cai com o Vaporeon e ele guincha, e o guincho é o som mais horrível que você já produziu no mundo.',
    'Vocês chegam. Não adianta.',
    'Sibyl não te culpa. Ela agradece — agradece de verdade, olhando no seu olho, com as duas mãos nas suas — e isso é muito pior do que se ela gritasse com você.',
    'Depois ela vai embora andando, sozinha, e recusa companhia, e você fica na porta do Centro Pokémon vendo ela virar a esquina.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Tentou salvar o Vaporeon e falhou'}, hp:-6, causa:'Queda na Rota 25',
      npc:{nome:'Sibyl', opiniao:4, memoria:'Você tentou salvar o Vaporeon dela. Ele morreu no seu colo, e ela te agradeceu.'},
      flag:'vaporeon_morreu', registrar:'O Vaporeon de Sibyl morreu apesar da corrida.',
      presagio:'Ela agradeceu. Você vai preferir, pelo resto da vida, que ela tivesse gritado.'},
  escolhas:[
    {texto:'Ir atrás dela.', vai:'c6_atras_da_marta'},
    {texto:'Ir atrás de quem pôs o veneno.', vai:'c6_veneno'},
    {texto:'Sentar no chão do Centro e não levantar.', vai:'c6_sentou_centro'}
  ]
},

c6_atras_da_marta:{
  texto:[
    'Você alcança ela três quadras depois.',
    '"Eu tropecei."',
    '"Eu sei."',
    '"Se eu não tivesse—"',
    '"Para." Ela para de andar. "Para agora."',
    'Ela segura os seus dois braços.',
    '"Eu tenho quarenta e um anos e eu não carreguei ele nem duzentos metros. Você carregou quatro quilômetro."',
    'Ela solta.',
    '"Se você começar essa conta, ela não acaba nunca. Eu sei porque eu já fiz essa conta com outra coisa."'
  ],
  ef:{npc:{nome:'Sibyl', opiniao:6, memoria:'Você foi atrás dela pedir desculpa e ela te proibiu de fazer a conta.'},
      flag:'a_conta_que_nao_acaba', moral:5,
      presagio:'Você vai começar essa conta mesmo assim. Todo mundo começa.'},
  escolhas:[
    {texto:'Ir atrás de quem pôs o veneno.', vai:'c6_veneno'},
    {texto:'Ficar com ela.', vai:'c6_ficou'},
    {texto:'Seguir pela rota sozinh{o|a}.', vai:'c6_veneno'}
  ]
},

c6_ficou:{
  texto:[
    'Você senta na grama. Não fala nada, porque não tem nada.',
    'Leva quarenta minutos.',
    'Sibyl segura a cabeça dele o tempo todo e fala com ele o tempo todo, coisas idiotas e específicas: que amanhã tem sol, que o rio tá cheio, que ela comprou o de peixe e não o de carne.',
    'No fim ela põe a mão nos olhos dele, que já estão fechados, e deixa lá.',
    'Depois ela olha pra você.',
    '"Obrigada por não ter ido embora."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Ficou com uma estranha no pior momento dela'},
      npc:{nome:'Sibyl', opiniao:6, memoria:'Você ficou com ela até o Vaporeon morrer. Ela lembra disso.'},
      flag:'vaporeon_morreu', registrar:'Ficou com Sibyl até o fim do Vaporeon.',
      presagio:'Você não fez nada e fez a única coisa. Vai levar anos pra entender que essas duas frases são a mesma.'},
  escolhas:[
    {texto:'Ajudar ela a enterrar.', vai:'c6_enterrou'},
    {texto:'"Quem fez isso?"', vai:'c6_marta_conta'},
    {texto:'Seguir pela rota.', vai:'c6_veneno'},
    {texto:'Levar ela pra casa.', vai:'c6_levou_marta_casa'}
  ]
},

c6_enterrou:{
  texto:[
    'Vocês cavam com as mãos e com uma tábua de cabana velha, na terra fofa da beira do rio, a uns dez metros da água.',
    'Leva mais de uma hora porque a terra da beira de rio tem pedra e raiz.',
    'Sibyl põe a toalha velha dele no fundo antes. Você não pergunta de onde veio a toalha; ela estava na mochila dela.',
    'Ela trouxe a toalha de casa antes de sair. Isso quer dizer que ela já sabia, no apartamento, antes de descer os dezoito degraus.',
    'Ninguém diz nada quando acaba. Vocês dois ficam olhando um monte de terra.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Cavou por uma hora ao lado de uma estranha'},
      hp:-3, causa:'Cavar na beira do rio',
      npc:{nome:'Sibyl', opiniao:8, memoria:'Vocês enterraram o Vaporeon juntos na beira do rio.'},
      flag:'enterrou_o_vaporeon',
      presagio:'Ela trouxe a toalha de casa. Ela já sabia. Todo mundo sabe antes.'},
  escolhas:[
    {texto:'"Quem fez isso?"', vai:'c6_marta_conta'},
    {texto:'Levar ela pra casa.', vai:'c6_levou_marta_casa'},
    {texto:'Ir atrás de quem pôs o veneno.', vai:'c6_veneno'}
  ]
},

c6_levou_marta_casa:{
  texto:[
    'Você anda com ela até em casa. Dezoito degraus de escada externa em cima de uma oficina.',
    'Na porta ela para e olha a chave na mão como se não reconhecesse.',
    '"Você quer entrar? Eu faço café."',
    'E você entende, pela primeira vez na vida, que essa pergunta às vezes não é sobre café.'
  ],
  escolhas:[
    {texto:'Entrar e tomar café.', vai:'c6_cafe_depois'},
    {texto:'"Não posso." E ir embora.', vai:'c6_veneno'},
    {texto:'"Eu entro, mas eu não sei o que falar."', vai:'c6_cafe_depois'}
  ]
},

c6_cafe_depois:{
  texto:[
    'Você entra. É pequeno e muito limpo.',
    'Tem uma toalha velha faltando num canto da sala, e o canto vazio é a coisa mais alta do apartamento.',
    'Ela faz café. Vocês bebem sem falar. Em algum momento ela chora de novo, curto, e depois pede desculpa, e você diz que não precisa, e ela diz "precisa sim", e vocês voltam a beber café.',
    'Você fica uma hora e quinze.',
    'Na estante tem um porta-retrato com uma menina de uns dezoito anos de uniforme de escola.'
  ],
  ef:{hp:3, npc:{nome:'Sibyl', opiniao:5, memoria:'Você ficou uma hora e quinze na cozinha dela depois de enterrarem o Vaporeon.'}},
  escolhas:[
    {texto:'Perguntar da foto.', vai:'c6_a_foto'},
    {texto:'"Quem fez isso? O veneno."', vai:'c6_marta_conta'},
    {texto:'Agradecer e ir pra rota.', vai:'c6_veneno'}
  ]
},

/* ─────────────── AS TIGELAS ─────────────── */

c6_veneno:{
  texto:[
    'Mais adiante na rota, depois da curva com a árvore caída, você encontra a fonte.',
    'Tigelas. Umas quinze, espalhadas com um cuidado que é a pior parte: estão nos lugares certos. Onde os Pokémon de rua já bebiam. Onde já tinha marca de pata no barro.',
    'Quem pôs isso observou primeiro. Por dias.',
    'A ração é boa. Cara. Do tipo que ninguém desperdiça — com alguma coisa dentro.',
    'E tem um homem agachado, enchendo a décima sexta.',
    'Ele te vê e não corre. Levanta com as mãos sujas de ração e diz, com a voz de quem explica o óbvio pela vigésima vez:',
    '"Eles estavam entrando nas casas. Alguém tinha que resolver."'
  ],
  ef:{flag:'achou_envenenador', registrar:'Encontrou o homem que envenenava os Pokémon de rua da Rota 25.'},
  escolhas:[
    {texto:'Derrubar as tigelas. Todas.', vai:'c6_tigelas'},
    {texto:'"Me conta o que aconteceu com a sua filha."', vai:'c6_a_filha'},
    {texto:'Batalhar com ele.', vai:'c6_luta_veneno'},
    {texto:'Chamar a Liga e ficar de olho até chegarem.', vai:'c6_liga_veneno'}
  ]
},

c6_a_filha:{
  texto:[
    '"Me conta o que aconteceu com a sua filha."',
    'Ele para de encher a tigela.',
    'Fica de cócoras no chão por uns bons dez segundos, e quando levanta, levanta devagar, com a mão nas costas.',
    '"Como você sabe da minha filha?"',
    '"Todo mundo sabe."',
    'Ele ri sem alegria. "Pois é. Todo mundo sabe e ninguém pergunta."',
    'Ele limpa a mão no jeans.',
    '"Ela tem sete anos. Um Rattata mordeu a mão dela no quintal, aqui, atrás daquela cerca. Sete ponto. Ela ficou com medo do quintal."',
    'Ele olha pra cabana verde a uns quarenta metros. Tem uma bicicleta rosa encostada na parede.',
    '"Ela não sai mais sozinha. Faz cinco meses."'
  ],
  ef:{flag:'ouviu_a_historia_da_filha',
      npc:{nome:'Homem das tigelas', opiniao:2, memoria:'Você perguntou da filha dele antes de fazer qualquer outra coisa.'},
      presagio:'Você perguntou antes de agir. Isso muda o que dá pra fazer agora, e não pra melhor.'},
  escolhas:[
    {texto:'"E o veneno resolveu?"', vai:'c6_resolveu'},
    {texto:'"Isso não justifica quinze tigelas."', vai:'c6_quinze_tigelas'},
    {texto:'"Deixa eu tentar de outro jeito."', vai:'c6_outro_jeito'},
    {texto:'Derrubar as tigelas mesmo assim.', vai:'c6_tigelas'}
  ]
},

c6_resolveu:{
  texto:[
    '"E o veneno resolveu?"',
    'Ele demora.',
    '"Ela ainda não sai no quintal."',
    'Ele olha as tigelas espalhadas na trilha, uma por uma, como se contasse.',
    '"Eu comecei com três. Agora são dezesseis." Ele coça a cabeça. "Eu não sei quando virou dezesseis."',
    'E aí ele diz a coisa que te desmonta:',
    '"Eu acho que em algum momento parou de ser pela menina."'
  ],
  ef:{flag:'parou_de_ser_pela_menina',
      presagio:'"Parou de ser pela menina." Guarda isso pra quando você mesm{o|a} estiver na décima sexta tigela de alguma coisa.'},
  escolhas:[
    {texto:'"Então para."', vai:'c6_entao_para'},
    {texto:'"Deixa eu tentar de outro jeito."', vai:'c6_outro_jeito'},
    {texto:'Derrubar as tigelas.', vai:'c6_tigelas'},
    {texto:'Chamar a Liga.', vai:'c6_liga_veneno'}
  ]
},

c6_entao_para:{
  texto:[
    '"Então para."',
    'Ele olha pra tigela na mão.',
    '"Eu não sei parar."',
    'Ele fala isso como quem relata um sintoma.',
    '"Todo dia de manhã eu encho. Virou a primeira coisa que eu faço. Antes do café."',
    'Ele põe a décima sexta tigela no chão e não enche.',
    'Fica olhando pra ela vazia.',
    '"Se você virar todas, eu não encho hoje."',
    'É a coisa mais estranha que já pediram pra você.'
  ],
  ef:{flag:'ele_pediu'},
  escolhas:[
    {texto:'Virar todas.', vai:'c6_tigelas', ef:{flag:'virou_a_pedido'}},
    {texto:'"Vira você."', vai:'c6_vira_voce'},
    {texto:'"A gente vira junto."', vai:'c6_juntos'},
    {texto:'Chamar a Liga em vez disso.', vai:'c6_liga_veneno'}
  ]
},

c6_vira_voce:{
  texto:[
    '"Vira você."',
    'Ele olha pra você com um pânico genuíno.',
    '"Eu não consigo."',
    '"Você encheu."',
    '"Encher é fácil." Ele está com a voz mudada. "Encher é uma coisa que eu faço sem pensar. Virar é uma decisão."',
    'Ele fica parado no meio da trilha, um homem de uns trinta e cinco anos com as mãos sujas de ração, incapaz de virar uma tigela que ele mesmo encheu.',
    'Passam uns dois minutos.',
    'E aí ele chuta a primeira. Com o pé, mal, torto, e a ração espalha no mato.',
    'E depois a segunda.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Fez alguém desfazer a própria coisa'},
      flag:['resolveu_tigelas','ele_virou'],
      npc:{nome:'Homem das tigelas', opiniao:5, memoria:'Você o fez virar as próprias tigelas. Ele chutou a primeira sozinho.'},
      registrar:'O homem das tigelas virou as dezesseis com os próprios pés.',
      presagio:'Ele virou dezesseis hoje. Amanhã de manhã ainda vai ser a primeira coisa que ele pensa em fazer.'},
  escolhas:[
    {texto:'Ajudar nas últimas.', vai:'c6_juntos'},
    {texto:'Ficar olhando até a última.', vai:'c6_ate_a_ultima'},
    {texto:'Ir embora enquanto ele vira.', vai:'c6_fim'}
  ]
},

c6_ate_a_ultima:{
  texto:[
    'Você fica. Ele vira as dezesseis.',
    'Na décima segunda ele para e senta na trilha, e chora um choro seco e curto de homem que não sabe chorar, e depois levanta e vira as quatro últimas.',
    'Quando acaba, ele olha a trilha limpa.',
    '"Amanhã eu vou querer encher de novo."',
    '"Eu sei."',
    '"Você volta?"',
    'E é aí que você percebe que essa não é uma pergunta sobre tigela.'
  ],
  ef:{flag:'ele_perguntou_se_volta'},
  escolhas:[
    {texto:'"Eu volto."', vai:'c6_prometeu_voltar_25',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Prometeu voltar pra alguém que ia recair'}, flag:'promessa_tigelas'}},
    {texto:'"Não. Eu tô de passagem."', vai:'c6_nao_volto'},
    {texto:'"Procura quem mora aqui. Eu não moro."', vai:'c6_quem_mora_aqui'},
    {texto:'Não responder e ir embora.', vai:'c6_fim'}
  ]
},

c6_prometeu_voltar_25:{
  texto:[
    '"Eu volto."',
    'Ele faz que sim várias vezes, rápido, do jeito de quem está segurando o rosto.',
    '"Tá. Tá bom."',
    'Ele estende a mão suja de ração e vocês apertam, e a sua mão fica suja também.',
    'Você vai andar por vinte minutos com a mão cheirando a ração de Pokémon antes de achar água.'
  ],
  ef:{presagio:'Você prometeu voltar a uma cabana verde numa curva da Rota 25. Anota isso em algum lugar que você olhe.'},
  escolhas:[
    {texto:'Seguir pela rota.', vai:'c6_fim'}
  ]
},

c6_nao_volto:{
  texto:[
    '"Não. Eu tô de passagem."',
    'Ele faz que sim. Não fica bravo, não fica magoado.',
    '"Claro." Ele olha pras tigelas viradas. "Claro, claro."',
    'Ele começa a recolher as tigelas do mato — e por um segundo você acha que é pra guardar, pra parar de vez.',
    'E aí ele empilha as dezesseis, ordenadamente, ao lado da cerca.',
    'Empilhar não é jogar fora. Empilhar é organizar pra amanhã.'
  ],
  ef:{flag:'empilhou_as_tigelas',
      presagio:'Ele empilhou. Você vai passar meses tentando não pensar nessa pilha.'},
  escolhas:[
    {texto:'Voltar atrás. "Eu volto sim."', vai:'c6_prometeu_voltar_25',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Voltou atrás e prometeu'}, flag:'promessa_tigelas'}},
    {texto:'"Procura quem mora aqui."', vai:'c6_quem_mora_aqui'},
    {texto:'Seguir pela rota.', vai:'c6_fim'}
  ]
},

c6_quem_mora_aqui:{
  texto:[
    '"Procura quem mora aqui. Eu não moro."',
    '"Procurar quem?"',
    'E você não tem nome nenhum. Você chegou hoje.',
    'Mas aí você tem.',
    '"A Sibyl. Do supermercado da ponte sul."',
    'Ele fica pálido.',
    '"O Duque era dela."',
    '"Era."',
    'Ele senta na trilha, no chão, entre as tigelas viradas, e põe as duas mãos na cabeça, e é a primeira vez que o que ele fez tem um nome e um dono.'
  ],
  ef:{flag:'ligou_marta_e_ele',
      rep:{eixo:'bom',delta:2,motivo:'Deu nome ao que era estatística'},
      registrar:'O homem das tigelas descobriu o nome do Vaporeon que morreu.',
      presagio:'Agora ele tem um nome pra carregar. Essa é a única coisa que às vezes funciona.'},
  escolhas:[
    {texto:'"Vai falar com ela."', vai:'c6_vai_falar_com_ela'},
    {texto:'Deixar ele ali e seguir.', vai:'c6_fim'},
    {texto:'"Eu volto."', vai:'c6_prometeu_voltar_25',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Prometeu voltar'}, flag:'promessa_tigelas'}}
  ]
},

c6_vai_falar_com_ela:{
  texto:[
    '"Vai falar com ela."',
    '"Eu não posso."',
    '"Pode."',
    '"O que eu vou dizer?"',
    '"Sei lá." Você dá de ombros, porque é verdade. "Você é adulto. Eu tenho quinze anos."',
    'Ele fica um tempo quieto.',
    'Três semanas depois — você não vai estar aqui pra ver — um homem vai subir dezoito degraus de escada externa em cima de uma oficina com um pacote de café na mão e vai levar quarenta minutos pra tocar a campainha.',
    'Ela vai abrir. E as duas metades da Rota 25 vão continuar comprando na mesma padaria, e uma delas vai ter falado com a outra.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Empurrou duas pessoas pra uma conversa impossível'},
      flag:'marta_e_ele_conversaram',
      registrar:'Você fez o homem das tigelas ir falar com a Sibyl.',
      presagio:'Você não vai estar lá pra ver. Quase nada do que você conserta acontece na sua frente.'},
  escolhas:[
    {texto:'Seguir pela rota.', vai:'c6_fim'}
  ]
},

c6_juntos:{
  texto:[
    '"A gente vira junto."',
    'E vocês viram.',
    'Dezesseis tigelas, dois pares de mãos, quinze minutos.',
    'Ninguém fala nada durante. No meio, uma criança sai da cabana verde e grita "PAI?" e ele grita de volta "JÁ VOU, FILHA", sem parar de virar tigela, e depois vocês continuam.',
    'No fim, a trilha está limpa e os dois estão com as mãos sujas de ração e não tem nada pra dizer.',
    '"Obrigado", ele diz.',
    'Ele agradece. Você virou o trabalho da manhã inteira dele e ele agradece.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Resolveu um conflito sem destruir ninguém'},
      flag:'resolveu_tigelas',
      npc:{nome:'Homem das tigelas', opiniao:6, memoria:'Vocês dois viraram as dezesseis tigelas juntos. A filha dele gritou do quintal no meio.'},
      registrar:'Virou as tigelas junto com o homem que as encheu.',
      presagio:'A filha dele gritou do quintal. Ela estava no quintal.'},
  escolhas:[
    {texto:'"Ela tava no quintal."', vai:'c6_no_quintal'},
    {texto:'"Amanhã eu volto."', vai:'c6_prometeu_voltar_25',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Prometeu voltar'}, flag:'promessa_tigelas'}},
    {texto:'Seguir pela rota.', vai:'c6_fim'},
    {texto:'"Vai falar com a Sibyl."', vai:'c6_quem_mora_aqui'}
  ]
},

c6_no_quintal:{
  texto:[
    '"Ela tava no quintal."',
    'Ele para.',
    'Olha pra cabana verde. A menina já entrou, mas a porta dos fundos está aberta e dá pra ver o quintal daqui.',
    '"Ela tava no quintal", ele repete, com a voz completamente diferente.',
    'Ele larga a tigela que estava segurando e vai andando pra casa, rápido, quase correndo, e não se despede.',
    'Você fica sozinh{o|a} na trilha com dezesseis tigelas viradas.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Mostrou a alguém a coisa que ele não conseguia ver'},
      flag:'ela_estava_no_quintal', moral:10,
      presagio:'Ela estava no quintal e ele não tinha reparado. As coisas melhoram sem avisar, e a gente não repara.'},
  escolhas:[
    {texto:'Seguir pela rota.', vai:'c6_fim'}
  ]
},

c6_outro_jeito:{
  texto:[
    '"Deixa eu tentar de outro jeito."',
    '"Que jeito?"',
    'E aí você tem que ter um jeito, e você não tem, e você fala a primeira coisa que passa:',
    '"Eu tiro eles daqui."',
    '"Você tira os bicho de rua da Rota 25." Ele fala devagar, medindo o tamanho da bobagem. "Quantos?"',
    'Você não sabe quantos. Ninguém sabe quantos.',
    'Mas você passa as quatro horas seguintes tentando, e é uma das coisas mais idiotas e mais honestas que você faz nessa jornada.'
  ],
  escolhas:[
    {texto:'Ir até o fim. Pegar quantos der.', vai:'c6_tentou_tirar'},
    {texto:'Desistir na segunda hora e virar as tigelas.', vai:'c6_tigelas'},
    {texto:'Desistir e chamar a Liga.', vai:'c6_liga_veneno'},
    {texto:'Desistir e ir procurar a Misty.', vai:'c6_misty_tigelas'}
  ]
},

c6_tentou_tirar:{
  texto:[
    'Quatro horas e quarenta minutos.',
    'Você pega sete. Sete Rattata e um Zubat, com as bolas que você tinha, gastando quase tudo.',
    'Tem mais. Tem muito mais — você vê pelo menos vinte só nesse trecho, e a rota tem seis quilômetros.',
    'No fim, sentado na trilha, sem bola, com o time cansado, você olha o homem das tigelas do outro lado da curva.',
    'Ele não riu. Em nenhum momento das quatro horas e quarenta ele riu de você.',
    'Ele senta na trilha a uns dez metros e diz: "Eu vou parar de encher."',
    '"Por quê?"',
    '"Porque eu vi você fazer isso por quatro hora."'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Passou uma tarde inteira fazendo o impossível na frente de quem precisava ver'},
      hp:-4, causa:'Quatro horas correndo atrás de Pokémon de rua',
      flag:['resolveu_tigelas','tirou_os_de_rua'],
      npc:{nome:'Homem das tigelas', opiniao:7, memoria:'Ele te viu passar quatro horas e quarenta pegando Pokémon de rua um por um. Parou de encher as tigelas.'},
      registrar:'Passou quase cinco horas tirando Pokémon de rua da Rota 25 na frente do homem das tigelas.',
      presagio:'Não foi o argumento. Foi as quatro horas. Guarda essa diferença.'},
  escolhas:[
    {texto:'"E os sete que eu peguei, o que eu faço?"', vai:'c6_os_sete'},
    {texto:'"A gente vira as tigelas junto."', vai:'c6_juntos'},
    {texto:'Seguir pela rota.', vai:'c6_fim'}
  ]
},

c6_os_sete:{
  texto:[
    '"E os sete que eu peguei, o que eu faço?"',
    'Silêncio comprido.',
    '"Solta do outro lado do rio", ele diz. "Lá é mato. Não tem casa por dois quilômetro."',
    '"E eles voltam?"',
    '"Alguns voltam." Ele dá de ombros. "Mas alguns não."',
    'Você atravessa a ponte norte no fim da tarde com sete bolas no cinto e solta os sete na margem oposta, um por um, e cinco somem no mato na hora.',
    'Dois ficam olhando você da margem por um tempo constrangedor antes de ir.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Levou os sete pro outro lado do rio'},
      flag:'soltou_do_outro_lado',
      presagio:'Alguns voltam. Você não vai estar aqui pra contar quantos.'},
  escolhas:[
    {texto:'Seguir pela rota.', vai:'c6_fim'}
  ]
},

c6_misty_tigelas:{
  texto:[
    'Você volta pra cidade e conta pra Misty.',
    'Ela ouve inteiro, com o pé na água, sem interromper.',
    '"Eu sei das tigelas."',
    '"E a senhora—"',
    '"Eu fui lá três vezes." Ela tira o pé da água. "Na primeira eu joguei tudo fora. Na segunda eu dei bronca. Na terceira eu levei um saco de ração boa e pedi pra ele pôr ração boa sem veneno."',
    '"E?"',
    '"E ele pôs. Por duas semanas." Ela seca o pé na toalha. "Depois voltou. Porque o problema nunca foi a ração."',
    'Ela olha pra você.',
    '"O problema é uma menina de sete anos com medo do quintal, e isso eu não resolvo com processo."'
  ],
  ef:{flag:'misty_e_as_tigelas',
      npc:{nome:'Líder Misty', opiniao:2, memoria:'Te contou das três vezes que ela tentou resolver as tigelas da Rota 25.'},
      presagio:'Ela já tentou tudo o que é institucional. Sobrou o que não é.'},
  escolhas:[
    {texto:'Voltar lá e falar da filha dele.', vai:'c6_a_filha'},
    {texto:'Voltar lá e virar as tigelas.', vai:'c6_tigelas'},
    {texto:'Seguir pela rota.', vai:'c6_fim'}
  ]
},

c6_tigelas:{
  texto:[
    'Você chuta a primeira. Ele grita alguma coisa. Você chuta a segunda.',
    'Na sétima ele tenta te segurar pelo braço e você empurra com mais força do que planejou. Ele cai sentado no barro e fica lá, olhando você destruir o trabalho da manhã inteira dele.',
    'Dezesseis tigelas. Você vira todas.',
    'A ração fica espalhada no mato, ainda envenenada, o que é uma coisa que você só vai pensar depois.',
    'Quando acaba, ele diz, baixinho, do chão:',
    '"Vou encher de novo amanhã."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Destruiu as armadilhas de veneno da Rota 25'},
      flag:'destruiu_tigelas'},
  escolhas:[
    {texto:'"Então eu volto amanhã."', vai:'c6_prometeu_voltar_25',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Prometeu voltar todos os dias'}, flag:'promessa_tigelas'}},
    {texto:'"Me conta o que aconteceu com a sua filha."', vai:'c6_a_filha'},
    {texto:'Recolher a ração espalhada. Você espalhou veneno no mato.', vai:'c6_recolheu_racao'},
    {texto:'Ir embora em silêncio.', vai:'c6_fim'}
  ]
},

c6_recolheu_racao:{
  texto:[
    'Você percebe no meio do caminho e volta.',
    'Recolher ração envenenada espalhada no mato com as mãos é uma tarefa humilhante e você faz por duas horas, de quatro, catando grão por grão do capim.',
    'Na primeira meia hora ele fica olhando, sentado no barro.',
    'Na segunda meia hora ele começa a catar também, do outro lado da trilha, sem falar nada.',
    'Vocês dois passam duas horas de quatro no mato catando ração, em silêncio, e no fim tem um saco plástico cheio entre os dois.',
    '"E agora?" ele pergunta.',
    '"Agora você joga fora."',
    'Ele joga.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Consertou o próprio estrago de quatro'},
      hp:-3, causa:'Duas horas de quatro no mato da Rota 25',
      flag:'resolveu_tigelas',
      npc:{nome:'Homem das tigelas', opiniao:5, memoria:'Vocês dois passaram duas horas de quatro catando a ração envenenada que você espalhou.'},
      presagio:'Ele catou do outro lado da trilha sem você pedir. As pessoas fazem isso quando alguém começa.'},
  escolhas:[
    {texto:'"Vai falar com a Sibyl."', vai:'c6_quem_mora_aqui'},
    {texto:'"Amanhã eu volto."', vai:'c6_prometeu_voltar_25',
     ef:{flag:'promessa_tigelas', rep:{eixo:'bom',delta:1,motivo:'Prometeu voltar'}}},
    {texto:'Seguir pela rota.', vai:'c6_fim'}
  ]
},

c6_vinganca:{
  texto:[
    'Você pega a tigela cheia da mão dele.',
    'O que acontece nos próximos dois minutos não é batalha Pokémon. Não tem turno, não tem tipo, não tem dado. É só você, ele, e uma decisão que você já tinha tomado antes de chegar perto — você só não sabia que tinha tomado.',
    'Ele vai ficar bem. Fisicamente, vai ficar bem.',
    'Tinha três pessoas pescando a duzentos metros. Elas viram.',
    'E tinha uma janela numa cabana verde a quarenta metros, e você não olha pra ela, e vai passar muito tempo não olhando pra ela.'
  ],
  ef:{rep:{eixo:'ruim',delta:4,motivo:'Agrediu um homem na Rota 25 diante de testemunhas'},
      flag:'agrediu_envenenador', moral:-20,
      registrar:'Agrediu o homem das tigelas. Três pessoas viram. A filha dele estava em casa.',
      executar:d=>{
        Estado.dados.liga.avisos++;
        return [{tipo:'liga', texto:'Um relatório com o seu nome entrou no sistema da Liga Pokémon hoje.'}];
      },
      presagio:'Existe agora, em algum arquivo, uma primeira linha sobre você. A segunda linha é mais fácil de escrever que a primeira.'},
  escolhas:[
    {texto:'Ir embora antes que alguém chegue.', vai:'c6_fim'},
    {texto:'Ficar. Esperar quem vier.', vai:'c6_ficou_depois'},
    {texto:'Ir até a cabana verde.', vai:'c6_a_menina'},
    {texto:'Ajudar ele a levantar.', vai:'c6_ajudou_levantar'}
  ]
},

c6_ficou_depois:{
  texto:[
    'Você senta na trilha ao lado de um homem caído e espera.',
    'Os três pescadores chegam em quatro minutos. Um deles ajuda ele a sentar. Outro olha pra você com uma cara que você nunca tinha recebido de um adulto.',
    'Ninguém grita. É pior: eles te tratam com uma educação cuidadosa, do jeito que se trata alguém de quem se tem um pouco de medo.',
    'Os oficiais chegam em quarenta minutos. Você conta tudo, sem inventar nada.',
    'Um deles escreve o seu nome no formulário e pergunta a idade, e quando você diz quinze ele para de escrever por um segundo e depois continua.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Ficou e assumiu'},
      flag:'assumiu_a_agressao',
      presagio:'Ele parou de escrever por um segundo. Guarda esse segundo: é a última vez que a sua idade vai te proteger.'},
  escolhas:[
    {texto:'Seguir pela rota.', vai:'c6_fim'}
  ]
},

c6_ajudou_levantar:{
  texto:[
    'Você estende a mão. Ele olha a sua mão por um tempo horrível e pega.',
    'Você ajuda ele a sentar na beira da trilha. Ele cospe. Tem sangue.',
    '"Isso aqui não muda nada", ele diz, com a voz esquisita.',
    '"Eu sei."',
    '"Você vai embora e eu vou encher de novo."',
    '"Eu sei."',
    'Ele limpa a boca na manga.',
    '"Então pra que você fez?"',
    'Você não tem resposta e essa é a parte que vai ficar.'
  ],
  ef:{flag:'pra_que_voce_fez', moral:-5,
      presagio:'"Então pra que você fez?" Você vai ensaiar respostas pra isso por muito tempo e nenhuma vai servir.'},
  escolhas:[
    {texto:'Ficar e esperar quem vier.', vai:'c6_ficou_depois'},
    {texto:'Ir embora.', vai:'c6_fim'},
    {texto:'Virar as tigelas antes de ir.', vai:'c6_tigelas'}
  ]
},

c6_misty_ninguem:{
  texto:[
    '"Por que ninguém faz nada nessa região?"',
    'Misty ri um riso curto e sem graça nenhuma.',
    '"Todo mundo faz alguma coisa." Ela tira o pé da água. "É esse o problema."',
    'Ela levanta e começa a enrolar um cabo de mangueira, porque ela é do tipo que não consegue conversar parada.',
    '"A prefeitura faz ofício. A Liga designa oficial. Eu peço providência. O pescador acompanha o processo. A doutora do museu vai na câmara municipal."',
    'O cabo já está enrolado e ela continua enrolando.',
    '"Todo mundo faz a parte que cabe no cargo de cada um. E a soma das partes dá zero, porque ninguém tem o cargo de juntar as partes."'
  ],
  ef:{flag:'a_soma_das_partes',
      presagio:'Ninguém tem o cargo de juntar as partes. Talvez essa vaga esteja aberta.'},
  escolhas:[
    {texto:'"E se alguém juntar?"', vai:'c6_juntar_as_partes'},
    {texto:'"Se eu trouxer prova, a senhora usa?"', vai:'c6_misty_prova'},
    {texto:'Mostrar a folha com o brasão.', vai:'c6_misty_folha', cond:d=>!!d.flags.guardou_a_folha || !!d.flags.levou_a_pasta},
    {texto:'Agradecer e sair.', vai:'c6_ponte_norte'}
  ]
},

c6_juntar_as_partes:{
  texto:[
    '"E se alguém juntar?"',
    'Misty para de enrolar o cabo.',
    '"Aí essa pessoa vira alvo." Ela fala sem nenhum drama. "Porque ninguém se incomoda com quem tem uma peça. Todo mundo se incomoda com quem tem o quadro."',
    'Ela pendura o cabo no gancho.',
    '"E, olha, isso não é conselho pra não fazer." Ela te olha. "É conselho pra fazer sabendo."'
  ],
  ef:{flag:'fazer_sabendo',
      npc:{nome:'Líder Misty', opiniao:3, memoria:'Te avisou que quem junta as peças vira alvo, e mandou fazer sabendo.'},
      rep:{eixo:'bom',delta:1,motivo:'Ouviu o aviso e não recuou'},
      presagio:'Ninguém se incomoda com quem tem uma peça. Você já tem três.'},
  escolhas:[
    {texto:'"Se eu trouxer prova, a senhora usa?"', vai:'c6_misty_prova'},
    {texto:'Mostrar a folha com o brasão.', vai:'c6_misty_folha', cond:d=>!!d.flags.guardou_a_folha || !!d.flags.levou_a_pasta},
    {texto:'Sair.', vai:'c6_ponte_norte'}
  ]
},

c6_quinze_tigelas:{
  texto:[
    '"Isso não justifica quinze tigelas."',
    '"Dezesseis."',
    'Ele corrige sem pensar e depois percebe o que fez, e a correção fica pendurada no ar entre vocês dois.',
    '"É." Ele olha as tigelas. "É, não justifica."',
    'Ele senta na beira da trilha com o saco de ração no colo.',
    '"Justificava três. Eu comecei com três, nos três lugar onde eles passavam pro quintal." Ele passa a mão na cara. "Aí eu comecei a achar outros lugar. E a ficar bom em achar."'
  ],
  ef:{flag:'parou_de_ser_pela_menina',
      presagio:'Ele ficou bom em achar. Toda coisa horrível começa com alguém ficando bom em alguma coisa.'},
  escolhas:[
    {texto:'"Então para."', vai:'c6_entao_para'},
    {texto:'"E o veneno resolveu?"', vai:'c6_resolveu'},
    {texto:'"Deixa eu tentar de outro jeito."', vai:'c6_outro_jeito'},
    {texto:'Virar as tigelas.', vai:'c6_tigelas'}
  ]
},

c6_luta_veneno:{
  falante:'Homem das tigelas',
  texto:[
    '"Você quer brigar por causa de bicho de rua."',
    'Ele limpa a mão no jeans e tira uma bola do bolso do casaco, e a bola é velha e arranhada e claramente não é comprada.',
    '"Tá bom."'
  ],
  batalha:{dex:109, nivel:26, tipo:'treinador', treinador:'Homem das tigelas', fuga:false,
           vitoria:'c6_venceu_veneno', derrota:'c6_perdeu_veneno', gameover:'gameover'}
},

c6_venceu_veneno:{
  texto:[
    'Ele recolhe o Weezing e senta na grama, derrotado de um jeito mais profundo que o placar.',
    '"Minha filha tem sete anos", ele diz pro chão. "Um Rattata mordeu ela no quintal. Sete ponto na mão. Ela não sai mais sozinha."',
    'Nada disso desfaz as dezesseis tigelas. E nada disso é mentira.',
    'Do outro lado da cerca, a quarenta metros, uma menina pequena olha vocês dois pela janela da cabana verde.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Parou o envenenador da Rota 25'},
      flag:['venceu_envenenador','ouviu_a_historia_da_filha'], registrar:'Derrotou o homem das tigelas. Ele tinha motivos.'},
  escolhas:[
    {texto:'Ajudar ele a recolher as tigelas. Juntos.', vai:'c6_juntos'},
    {texto:'"E o veneno resolveu?"', vai:'c6_resolveu'},
    {texto:'"O problema da sua filha não vira problema deles."', vai:'c6_nao_vira_problema'},
    {texto:'Fazer com ele o que ele fez com eles.', vai:'c6_vinganca'},
    {texto:'Ir embora.', vai:'c6_fim'}
  ]
},

c6_nao_vira_problema:{
  texto:[
    '"O problema da sua filha não vira problema deles."',
    'Ele levanta a cabeça devagar.',
    '"Não vira?"',
    'Ele aponta a cerca, o quintal, a janela com a menina atrás.',
    '"Explica isso pra ela. Vai lá. Explica pra uma criança de sete anos que a mão dela costurada não é problema de ninguém, que é só bicho sendo bicho, que é a natureza."',
    'Ele levanta.',
    '"Eu topo. Sério. Vai lá e explica, e se ela entender, eu paro hoje."',
    'A janela está a quarenta metros. Ele está falando sério.'
  ],
  ef:{flag:'o_desafio_da_menina'},
  escolhas:[
    {texto:'Ir falar com a menina.', vai:'c6_a_menina'},
    {texto:'"Não." Recuar dessa.', vai:'c6_recuou_do_desafio'},
    {texto:'"A gente vira as tigelas junto."', vai:'c6_juntos'},
    {texto:'Ir embora.', vai:'c6_fim'}
  ]
},

c6_a_menina:{
  texto:[
    'Você atravessa os quarenta metros.',
    'Ela tem sete anos e uma cicatriz irregular no dorso da mão direita, que ela esconde no bolso quando percebe que você olhou.',
    'Você não explica nada sobre natureza. Você não consegue.',
    'Você pergunta o nome dela. Ela fala. Você pergunta o nome do quintal — porque quintal de criança sempre tem nome — e ela ri e fala que quintal não tem nome, e depois fala que ele tem sim, e fala o nome.',
    'Vocês conversam onze minutos sobre uma tartaruga de brinquedo.',
    'No fim ela pergunta se você tem Pokémon. Você mostra um. Ela recua meio passo e depois não recua mais.',
    'Ela não encosta. Mas ela fica.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Passou onze minutos com uma criança com medo, sem explicar nada'},
      flag:'falou_com_a_menina', moral:10,
      registrar:'Conversou onze minutos com a filha do homem das tigelas.',
      presagio:'Ela não encostou. Ela ficou. Isso é como começa, e leva meses.'},
  escolhas:[
    {texto:'Voltar e falar com o pai.', vai:'c6_pai_depois'},
    {texto:'Ficar mais um pouco com ela.', vai:'c6_mais_com_a_menina'},
    {texto:'Ir embora sem falar mais nada com ninguém.', vai:'c6_fim'}
  ]
},

c6_mais_com_a_menina:{
  texto:[
    'Você fica mais quarenta minutos.',
    'Ela mostra o quintal inteiro da varanda, apontando, sem descer. Mostra onde foi. Mostra a cerca. Mostra onde a tartaruga de brinquedo mora.',
    'Em algum momento ela desce dois degraus.',
    'Em outro momento, o seu Pokémon deita no chão do quintal, de lado, do jeito que eles deitam, e ela olha isso por muito tempo.',
    'Ela não desce mais. Mas ela ficou na varanda quarenta minutos com um Pokémon no quintal dela.',
    'O pai está parado na trilha, a quarenta metros, sem se aproximar, olhando.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Ficou quarenta minutos numa varanda com uma criança'},
      flag:'a_menina_na_varanda', moral:10,
      presagio:'Ela ficou na varanda. O pai viu. É a primeira vez em cinco meses que ele vê isso.'},
  escolhas:[
    {texto:'Voltar e falar com o pai.', vai:'c6_pai_depois'},
    {texto:'Ir embora sem dizer nada.', vai:'c6_fim'}
  ]
},

c6_pai_depois:{
  texto:[
    'Você volta pela trilha. Ele não pergunta nada.',
    'Fica olhando a varanda por um tempo.',
    '"Ela desceu dois degrau."',
    '"Desceu."',
    'Ele passa a mão na cara.',
    '"Cinco meses."',
    'Ele vai andando até as tigelas e começa a virar, uma por uma, sem falar nada, e não pede ajuda, e você não oferece.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Resolveu o problema pela raiz em vez de pelo sintoma'},
      flag:'resolveu_tigelas',
      npc:{nome:'Homem das tigelas', opiniao:8, memoria:'Você fez a filha dele descer dois degraus do quintal. Ele virou as dezesseis tigelas sozinho depois.'},
      registrar:'O homem das tigelas virou tudo depois de ver a filha descer dois degraus.',
      presagio:'Cinco meses e dois degraus. Essa é a escala real das coisas que você vai conseguir mudar.'},
  escolhas:[
    {texto:'Seguir pela rota.', vai:'c6_fim'},
    {texto:'"Vai falar com a Sibyl."', vai:'c6_quem_mora_aqui'}
  ]
},

c6_recuou_do_desafio:{
  texto:[
    '"Não."',
    'Ele faz que sim, sem triunfo nenhum.',
    '"Pois é."',
    'Ele começa a recolher as tigelas do mato, e empilha ao lado da cerca, ordenadamente, pra amanhã.',
    'Você fica sabendo, nesse momento, uma coisa desagradável sobre você: você tem convicção até o ponto em que ela custa uma conversa difícil.'
  ],
  ef:{flag:'recuou_do_desafio',
      presagio:'Convicção até o ponto em que custa uma conversa difícil. Isso vai ser testado de novo, com apostas maiores.'},
  escolhas:[
    {texto:'Voltar atrás e ir falar com a menina.', vai:'c6_a_menina'},
    {texto:'Chamar a Liga.', vai:'c6_liga_veneno'},
    {texto:'Ir embora.', vai:'c6_fim'}
  ]
},

c6_perdeu_veneno:{
  texto:[
    'Você perde. Ele nem comemora — recolhe as coisas e continua enchendo a décima sétima tigela enquanto você se recupera sentad{o|a} na grama.',
    'Isso é o pior tipo de derrota: a que não interrompe nada.',
    'Ele trabalha na sua frente por vinte minutos. Depois pega o saco de ração vazio, dobra, guarda no bolso de trás, e vai embora pra cabana verde.',
    'Na porta ele grita "CHEGUEI" e uma voz de criança responde de dentro.'
  ],
  ef:{hp:-5, causa:'Derrota na Rota 25', flag:'falhou_envenenador',
      presagio:'Ele chegou em casa e a filha respondeu. Isso continua acontecendo todo dia, com ou sem você.'},
  escolhas:[
    {texto:'Virar as tigelas mesmo assim.', vai:'c6_tigelas'},
    {texto:'Ir atrás dele e perguntar da filha.', vai:'c6_a_filha'},
    {texto:'Ir atrás dele e resolver isso do jeito feio.', vai:'c6_vinganca'},
    {texto:'Chamar a Liga.', vai:'c6_liga_veneno'},
    {texto:'Seguir.', vai:'c6_fim'}
  ]
},

c6_liga_veneno:{
  texto:[
    'Você liga e fica.',
    'Duas horas e quarenta na beira da trilha, olhando ele encher tigela e ele olhando você. Em certo momento ele oferece água da garrafa dele e você recusa e depois aceita.',
    'Os oficiais chegam. São dois, educados, com formulário. Levam ele. Levam as tigelas em sacos etiquetados.',
    'Um dos oficiais anota seu nome no relatório. "Boa, {garoto|garota}. Sério."',
    'Três semanas depois ele está de volta na rota. Advertência e multa de setecentos.',
    'A menina de sete anos ficou sozinha em casa naquela tarde, pela primeira vez em cinco meses, porque o pai foi levado pra prestar depoimento.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Entregou o envenenador às autoridades'},
      flag:'entregou_envenenador', dinheiro:600,
      presagio:'Ela ficou sozinha em casa naquela tarde. Ninguém anota isso em formulário nenhum.'},
  escolhas:[
    {texto:'Seguir.', vai:'c6_fim'},
    {texto:'Ir ver a menina antes de sair da rota.', vai:'c6_a_menina'}
  ]
},

c6_fim:{
  texto:[
    'A Rota 25 termina num mirante sobre o mar. Uma plataforma de madeira velha em cima de uma pedra, com o parapeito faltando um pedaço.',
    'De lá dá pra ver a curva da costa inteira e, muito longe, quase na linha do horizonte, a silhueta de uma ilha.',
    'O vento vem do mar e é salgado e é a primeira vez que você sente cheiro de mar na vida.',
    d=>{
      if (d.flags.agrediu_envenenador) return 'Você percebe que não pensou uma vez no homem desde que saiu de lá. Isso deveria incomodar mais do que incomoda.';
      if (d.flags.ignorou_marta) return 'Você percebe que não lembra do rosto da mulher. Só do som.';
      if (d.flags.resolveu_tigelas) return 'As suas mãos ainda cheiram a ração. Você não lava por mais tempo do que precisaria.';
      if (d.flags.vaporeon_morreu) return 'O nome dele era Duque. Você repete isso pra você mesm{o|a}, olhando o mar, porque alguém tem que continuar sabendo.';
      return 'Você fica ali até escurecer. Foi um dia longo e você fez o que deu.';
    },
    d=>d.flags.leu_o_estatuto
      ? 'E no fundo da mochila tem um documento grampeado com capa dura que diz que a guarda de um ser vivo não é direito adquirido.'
      : 'Amanhã tem estrada de novo.',
    'Lavender fica a três dias a pé, e dizem que lá tem uma torre de sete andares.',
    'Dizem também que a cidade não tem música, e ninguém explica isso direito.'
  ],
  fim:true, resumo:'Cerulean e a Rota 25: preço na plaquinha, uma van sem placa e dezesseis tigelas.'
}


}}

);
