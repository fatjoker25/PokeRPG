/* ------------------------------------------------------------
   ABERTURAS — o Monte da Lua não recebe todo mundo igual.
   Quem sobe de carona, quem sobe com um nome a menos no time e
   quem sobe sem dinheiro pra pilha chegam na mesma boca de
   caverna por estradas que não se parecem.
   ------------------------------------------------------------ */
const C5_ABERTURAS = ['c5_boca', 'c5_ab_carona', 'c5_ab_luto', 'c5_ab_sem_pilha', 'c5_ab_fila'];
function c5_cabe(id, d){
  if (id === 'c5_ab_luto')      return (d.cemiterio || []).length > 0;
  if (id === 'c5_ab_sem_pilha') return d.jogador.dinheiro < 900;
  if (id === 'c5_ab_fila')      return Estado.rep.eixo === 'bom' && Estado.rep.bom >= 3;
  return true;
}
function c5_abertura(d){
  const cand = C5_ABERTURAS.filter(id => c5_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 5 — O QUE SOBROU DA ROCKET  (Monte da Lua)
   ============================================================ */
CAPITULOS.push(
{
num:5, titulo:'O Que Sobrou da Rocket', local:'Monte da Lua', ambiente:'caverna', nivelArea:18,
tom:'sombrio', entradas:C5_ABERTURAS,
inicio: d => c5_abertura(d),
cenas:{

c5_ab_carona:{
  texto:[
    'Você não subiu a pé. Um caminhão de ração parou sozinho na subida da Rota 3, o motorista abriu a porta sem você pedir e disse "vai pro Monte?" como quem já sabe que não tem outro destino nessa estrada.',
    'O nome dele é Gus, ele tem cinquenta e poucos anos, e ele fala o caminho inteiro sem exigir resposta nenhuma.',
    fala('Gus', 'Eu faço essa subida três vezes por semana faz dezenove anos. Sabe o que mudou?'),
    d=>fala(d.jogador.nome, 'O quê?'),
    fala('Gus', 'Nada. Absolutamente nada. Essa é a parte boa.'),
    'Na última curva ele fica quieto. Fica quieto de um jeito diferente do resto do trajeto.',
    fala('Gus', 'Mudou uma coisa, na verdade. Tem uns dois meses que tem carro subindo de noite.', 'baixo'),
    fala('Gus', 'Carro bom. Desses que não deviam estar em estrada de terra.'),
    'Ele encosta antes da boca da caverna, porque daí pra frente não é mais estrada.',
    fala('Gus', 'Não vou te dizer pra não entrar. Você ia entrar do mesmo jeito.')
  ],
  ef:{flag:'kenji_falou_dos_carros', registrar:'Gus, caminhoneiro de ração, subiu com você até a boca do Monte da Lua.',
      npc:{nome:'Gus', opiniao:1, viuVoce:'Deu carona na subida da Rota 3.'},
      presagio:'Carro bom em estrada de terra, de noite, é gente que não quer ser vista de dia.'},
  escolhas:[
    {texto:'Perguntar onde exatamente ele viu os carros.', vai:'c5_ab_onde'},
    {texto:'Agradecer e descer.', vai:'c5_boca'},
    {texto:'Perguntar se ele já entrou na caverna.', vai:'c5_ab_ja_entrou'}
  ]
},

c5_ab_onde:{
  texto:[
    'Ele aponta com dois dedos, sem tirar a mão do volante, pra um ponto acima da boca da caverna.',
    fala('Gus', 'Ali em cima. Eles param ali em cima, não na entrada.'),
    fala('Gus', 'Sabe por quê? Porque da entrada dá pra te ver da estrada. Dali em cima não dá.'),
    'Você olha pra onde ele apontou e vê uma saliência de rocha a uns quatro metros do chão, com uma sombra do lado que pode ser sombra e pode ser outra coisa.',
    fala('Gus', 'Eu passo de dia. De dia não tem ninguém. Isso também não me acalma.')
  ],
  ef:{flag:'sabe_da_saliencia', registrar:'Alguém estaciona de noite acima da boca do Monte da Lua.'},
  escolhas:[
    {texto:'Descer e ir ver essa saliência.', vai:'c5_boca'}
  ]
},

c5_ab_ja_entrou:{
  texto:[
    'Ele ri sem alegria nenhuma.',
    fala('Gus', 'Uma vez. Em oitenta e nove. Levei uma lanterna de quatro pilhas e voltei em quarenta minutos.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('Gus', 'Porque lá dentro o barulho do meu próprio pé ficava chegando depois de mim.'),
    fala('Gus', 'Não tem nada de sobrenatural nisso. É eco. Eu sei que é eco.'),
    'Ele destrava a porta.',
    fala('Gus', 'Sabendo que é eco, eu voltei em quarenta minutos.')
  ],
  ef:{registrar:'Gus entrou no Monte da Lua uma vez, em 1989, e voltou em quarenta minutos.'},
  escolhas:[
    {texto:'Descer.', vai:'c5_boca'}
  ]
},

c5_ab_luto:{
  texto:[
    d=>{
      const m = d.cemiterio[d.cemiterio.length - 1];
      return `A estrada sobe por três horas e você faz as três horas contando de novo, sem querer, o que deu errado com ${m && m.apelido ? m.apelido : (m && m.nome ? m.nome : 'ele')}.`;
    },
    'Não adianta. A conta não fecha melhor na terceira vez do que na primeira.',
    'A boca do Monte da Lua é mais baixa do que você imaginava — você tem que abaixar a cabeça pra entrar, e hoje abaixar a cabeça custa mais do que devia.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} para antes de você, na entrada, e espera. Não entra sozinh${pron(p).o}. Espera.`
               : 'Você para na entrada e o vento morno que sai da caverna bate na sua cara como se estivesse te esperando.';
    },
    'Do lado de dentro o ar sai morno, o que é o contrário do que uma caverna devia fazer, e hoje você não tem paciência nenhuma pra coisas que fazem o contrário do que deviam.'
  ],
  ef:{flag:'subiu_o_monte_de_luto', registrar:'Chegou à boca do Monte da Lua carregando uma morte recente.'},
  escolhas:[
    {texto:'Entrar. Parar de pensar nisso.', vai:'c5_entrada'},
    {texto:'Sentar na boca da caverna um tempo antes.', vai:'c5_esperar'},
    {texto:'Examinar a escada de madeira encostada na parede.', vai:'c5_escada'}
  ]
},

c5_ab_sem_pilha:{
  texto:[
    'Tem uma barraca de beira de estrada a seiscentos metros da boca da caverna. Lona azul, um balcão de madeira compensada, e uma senhora que vende três coisas: água, biscoito e pilha.',
    'A pilha é o único produto com preço escrito à mão em papelão. Quinhentos e vinte por par.',
    d=>fala(d.jogador.nome, `Quinhentos e vinte?`),
    fala('a senhora da barraca', 'Você tá vendo outra barraca aqui?'),
    'Ela não diz isso com maldade. Diz com a serenidade de quem entendeu a economia do lugar antes de você.',
    d=>`Você tem ${Number(d.jogador.dinheiro).toLocaleString('pt-BR')} ₽ e uma caverna pela frente.`,
    fala('a senhora da barraca', 'Tem gente que entra sem. Eu não julgo. Só vendo.', 'baixo')
  ],
  ef:{registrar:'A barraca antes do Monte da Lua vende pilha a 520 ₽ o par.'},
  escolhas:[
    {texto:'Comprar o par de pilhas mesmo assim.', vai:'c5_ab_comprou', cond:d=>d.jogador.dinheiro >= 520},
    {texto:'Não comprar. Entrar no escuro do jeito que dá.', vai:'c5_ab_sem_comprar'},
    {texto:'Perguntar se ela vê muita gente entrando.', vai:'c5_ab_quem_entra'}
  ]
},

c5_ab_comprou:{
  texto:[
    'Você paga. Ela conta as moedas duas vezes, porque é o jeito dela, não porque desconfia de você.',
    'Ela entrega o par de pilhas e mais uma coisa que você não comprou: um toco de vela de sete centímetros, desses de vigília.',
    fala('a senhora da barraca', 'Esse é de graça.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('a senhora da barraca', 'Porque pilha acaba e vela avisa antes de acabar.')
  ],
  ef:{dinheiro:-520, itens:{'Potion':1}, flag:'tem_a_vela_da_barraca',
      registrar:'Comprou pilhas na barraca da estrada e ganhou um toco de vela.'},
  escolhas:[
    {texto:'Seguir pra boca da caverna.', vai:'c5_boca'}
  ]
},

c5_ab_sem_comprar:{
  texto:[
    'Você agradece e não compra. Ela balança a cabeça uma vez, sem cobrança nenhuma, e volta a olhar a estrada.',
    'Seiscentos metros depois a barraca não dá mais pra ver e você pensa nas pilhas de novo, o que é exatamente o que ela sabia que ia acontecer e é exatamente por isso que ela montou a barraca aí.',
    'A boca do Monte da Lua é mais baixa do que você imaginava. Lá dentro, a luz do dia morre depois de uns nove metros, e dá pra ver exatamente onde.'
  ],
  ef:{flag:'entrou_sem_luz', registrar:'Entrou no Monte da Lua sem lanterna boa.'},
  escolhas:[
    {texto:'Entrar assim mesmo.', vai:'c5_entrada'},
    {texto:'Examinar a escada de madeira encostada na parede de fora.', vai:'c5_escada'}
  ]
},

c5_ab_quem_entra:{
  texto:[
    fala('a senhora da barraca', 'Cinco, seis por semana. Sobe muito menino da sua idade.'),
    'Ela dobra um pano no balcão enquanto fala, e dobrar o pano parece ser mais importante que a conversa.',
    fala('a senhora da barraca', 'Volta menos.'),
    d=>fala(d.jogador.nome, 'Volta menos?'),
    fala('a senhora da barraca', 'Volta menos por aqui. A caverna tem outra saída do lado de Cerulean, todo mundo sabe disso.'),
    'Ela para de dobrar o pano.',
    fala('a senhora da barraca', 'Mas nos últimos dois meses parou de voltar gente dos dois lados. Aí não é mais a saída, é outra coisa.', 'baixo')
  ],
  ef:{flag:'sumiram_dos_dois_lados', registrar:'Faz dois meses que gente entra no Monte da Lua e não sai por nenhum dos lados.'},
  escolhas:[
    {texto:'Comprar o par de pilhas.', vai:'c5_ab_comprou', cond:d=>d.jogador.dinheiro >= 520},
    {texto:'Seguir pra boca da caverna.', vai:'c5_boca'}
  ]
},

c5_ab_fila:{
  texto:[
    'Tem três pessoas na boca da caverna quando você chega, e as três param de falar ao mesmo tempo.',
    'Não é medo. É o outro negócio, o que começou a acontecer com você depois de Pewter e que você ainda não sabe manejar.',
    d=>{
      const r = Estado.nomeRep();
      return `Um deles, o mais novo, fala o seu nome pro amigo com a mão do lado da boca. O amigo responde "${r}" como se isso fosse uma explicação completa.`;
    },
    'O terceiro, que é mais velho e não está impressionado com nada, é o único que fala com você:',
    fala('o homem de bota', 'Se você vai entrar, entra na frente. Eles vão te seguir de qualquer jeito e é melhor você saber onde eles estão.'),
    d=>fala(d.jogador.nome, 'Eu não pedi pra ninguém me seguir.'),
    fala('o homem de bota', 'Eu sei. Não muda nada.')
  ],
  ef:{flag:'tem_gente_te_seguindo_no_monte', registrar:'Três pessoas esperavam na boca do Monte da Lua e reconheceram você.'},
  escolhas:[
    {texto:'Entrar na frente, como ele disse.', vai:'c5_entrada'},
    {texto:'Esperar os três entrarem primeiro.', vai:'c5_ab_deixou_passar'},
    {texto:'Dizer que ninguém entra atrás de você.', vai:'c5_ab_negou'}
  ]
},

c5_ab_deixou_passar:{
  texto:[
    'Você encosta na parede de fora e faz sinal pra eles irem.',
    'Os dois mais novos hesitam, porque eles vieram pra seguir alguém, não pra ir na frente de alguém.',
    'O homem de bota entra sem discutir. Os outros dois entram atrás dele.',
    'Quinze minutos depois você entra e ouve os três lá na frente, três vozes que o eco transforma em seis, e isso é informação: agora você sabe onde eles estão e eles não sabem onde você está.'
  ],
  ef:{flag:'entrou_por_ultimo', registrar:'Deixou os três entrarem primeiro no Monte da Lua.'},
  escolhas:[
    {texto:'Entrar.', vai:'c5_entrada'}
  ]
},

c5_ab_negou:{
  texto:[
    d=>fala(d.jogador.nome, 'Ninguém entra atrás de mim.'),
    'Sai mais duro do que você queria. O mais novo dos três fica vermelho até a orelha.',
    fala('o homem de bota', 'Tá certo.'),
    'Ele diz isso sem discordar e sem concordar, do jeito de quem já viu isso acontecer com outra pessoa que também achava que tinha autoridade pra dizer.',
    'Você entra sozinh{o|a}. Dez minutos depois, lá dentro, você ouve três pares de pé na pedra atrás de você mesmo assim.'
  ],
  ef:{rep:{eixo:'ruim', delta:1, motivo:'Cortou três pessoas na boca da caverna.'},
      flag:'tem_gente_te_seguindo_no_monte', registrar:'Mandou os três não te seguirem. Eles seguiram.'},
  escolhas:[
    {texto:'Seguir em frente e fingir que não ouviu.', vai:'c5_entrada'}
  ]
},


c5_boca:{
  texto:[
    'A estrada sobe por três horas e depois para de ser estrada.',
    'A boca do Monte da Lua é mais baixa do que você imaginava — você tem que abaixar a cabeça, e abaixar a cabeça pra entrar em algum lugar muda o jeito que você entra.',
    'Tem uma escada de madeira encostada na parede de fora. Velha, com três degraus podres, claramente ali há anos. Não leva a lugar nenhum: ela encosta na rocha e acaba.',
    'Do lado de dentro, o ar sai morno. Isso é o contrário do que você esperava de uma caverna, e você não sabe o que fazer com essa informação.',
    d=>d.relogio && d.relogio.periodo === 'noite'
      ? 'É noite. Você chegou de noite, e a boca da caverna e o lado de fora da caverna são exatamente igualmente escuros, o que de alguma forma é pior.'
      : 'Lá dentro a luz do dia morre depois de uns nove metros. Dá pra ver exatamente onde.'
  ],
  ef:{registrar:'Chegou à boca do Monte da Lua.'},
  escolhas:[
    {texto:'Entrar.', vai:'c5_entrada'},
    {texto:'Examinar a escada de madeira primeiro.', vai:'c5_escada'},
    {texto:'Dar a volta por fora, procurar outra entrada.', vai:'c5_fora'},
    {texto:'Sentar na boca e esperar clarear / esfriar a cabeça.', vai:'c5_esperar'}
  ]
},

c5_escada:{
  texto:[
    'A escada é de madeira roliça amarrada com arame, feita à mão, do tipo que se faz numa tarde.',
    'Ela encosta na parede e termina numa saliência a uns quatro metros. Da saliência não sai caminho nenhum.',
    'Mas na saliência tem coisa: dois pregos batidos na rocha, uma lona verde dobrada, e uma lata de feijão vazia, enferrujada por fora e limpa por dentro.',
    'Alguém dormiu aqui em cima. Alguém que queria ver a boca da caverna sem ser visto da boca da caverna.'
  ],
  ef:{flag:'achou_o_posto', registrar:'Alguém montou um posto de observação sobre a entrada do Monte da Lua.',
      presagio:'Quem vigia uma entrada está esperando alguém sair, não alguém entrar.'},
  escolhas:[
    {texto:'Subir e ficar lá em cima um tempo, olhando o que ele olhava.', vai:'c5_posto'},
    {texto:'Entrar na caverna.', vai:'c5_entrada'},
    {texto:'Dar a volta por fora.', vai:'c5_fora'},
    {texto:'Derrubar a escada.', vai:'c5_derrubou_escada',
     ef:{flag:'derrubou_a_escada'}}
  ]
},

c5_posto:{
  texto:[
    'Você sobe. A saliência é do tamanho de uma cama de solteiro e dá pra deitar.',
    'Deitad{o|a}, você vê exatamente uma coisa: a boca da caverna, de cima, com um ângulo que cobre quem entra e quem sai e não cobre nada mais.',
    'Embaixo da lona tem um caderninho. Não é diário — é planilha. Datas, horas, e uma coluna com números pequenos.',
    '"14/03 — 06:40 — 3." "14/03 — 19:10 — 3." "17/03 — 05:55 — 4." "17/03 — 20:30 — 4."',
    'Alguém conta quantas pessoas entram e quantas saem. Todo dia. Há meses.'
  ],
  ef:{flag:'achou_o_caderno_do_posto', registrar:'Achou um caderno de vigia sobre a entrada do Monte da Lua: contagem de entradas e saídas.'},
  escolhas:[
    {texto:'Levar o caderno.', vai:'c5_pegou_caderno', ef:{flag:'pegou_o_caderno'}},
    {texto:'Deixar exatamente como estava e entrar na caverna.', vai:'c5_entrada'},
    {texto:'Esperar aqui em cima pra ver quem aparece.', vai:'c5_espera_posto'},
    {texto:'Anotar as últimas datas de cabeça e entrar.', vai:'c5_entrada', ef:{flag:'memorizou_as_datas'}}
  ]
},

c5_pegou_caderno:{
  texto:[
    'Você guarda o caderno na mochila.',
    'Na última página preenchida, a data é de ontem, e a última linha não tem hora de saída.',
    '"Ontem — 16:20 — 5." E nada depois.',
    'Cinco pessoas entraram ontem à tarde. Nenhuma saiu.'
  ],
  ef:{flag:'cinco_entraram'},
  escolhas:[
    {texto:'Entrar.', vai:'c5_entrada'},
    {texto:'Esperar aqui em cima pra ver quem aparece.', vai:'c5_espera_posto'},
    {texto:'Ligar pra Dra. Cordell agora, antes de entrar.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Dar a volta por fora antes de entrar.', vai:'c5_fora'}
  ]
},

c5_espera_posto:{
  texto:[
    'Você fica. Deitado de bruços numa saliência de rocha, com o queixo nas mãos, olhando um buraco.',
    'Uma hora e quarenta.',
    'E então sai gente.',
    'Três pessoas. Roupa de trabalho comum, botina, luva. Uma carrega uma caixa plástica com tampa. Outra carrega duas.',
    'Eles não olham pra cima. Descem a trilha conversando sobre a Liga.',
    'A caixa de cima, na pilha de duas, está com a tampa mal encaixada. Dá pra ver que dentro tem palha. E dá pra ver a palha se mexendo.'
  ],
  ef:{flag:'viu_a_saida', registrar:'Viu três pessoas saírem do Monte da Lua com caixas. Dentro de uma delas tinha coisa viva.',
      presagio:'A palha se mexeu. Você viu. Não dá pra desver.'},
  escolhas:[
    {texto:'Descer e seguir eles.', vai:'c5_seguiu_trio'},
    {texto:'Deixar eles irem e entrar na caverna.', vai:'c5_entrada'},
    {texto:'Ligar pra Dra. Cordell agora.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Gritar da saliência.', vai:'c5_gritou_trio'}
  ]
},

c5_gritou_trio:{
  falante:'o da aliança',
  vozes:['P','N'],
  texto:[
    '"O QUE TEM NA CAIXA?"',
    'Os três param. Procuram. Um deles acha você em cima da saliência, aponta, e os outros dois olham.',
    'O que carrega uma caixa só põe ela no chão devagar.',
    '"Desce aí, {moleque|moleca}."',
    'A voz não é ameaçadora. É pior: é entediada.'
  ],
  escolhas:[
    {texto:'Descer.', vai:'c5_desceu_trio'},
    {texto:'Não descer. Ficar em cima.', vai:'c5_ficou_em_cima'},
    {texto:'Descer pelo outro lado e correr pra dentro da caverna.', vai:'c5_entrada',
     ef:{flag:'entrou_correndo'}}
  ]
},

c5_desceu_trio:{
  falante:'o da aliança',
  vozes:['N','N','N','N'],
  texto:[
    'Você desce a escada de madeira de costas, degrau por degrau, sentindo os três olhando suas costas o caminho inteiro.',
    'No chão, de perto, eles são absolutamente comuns. Um deles tem uma aliança. Outro tem um curativo no polegar.',
    '"O que tem na caixa é trabalho", diz o da aliança. "E trabalho não é da sua conta."',
    'Ele abre a tampa. Dentro tem palha, e na palha tem seis ovos. Ovos grandes, manchados, quentes — dá pra sentir o calor de meio metro.',
    '"Ovo de Clefairy", ele diz. "Vale oito mil cada um em Celadon. Tá aqui, ó. Pode olhar."',
    'Ele deixa você olhar. É essa a parte que desmonta você: ele deixa você olhar.'
  ],
  ef:{flag:'viu_os_ovos', registrar:'Tiraram seis ovos de Clefairy do Monte da Lua. Oito mil cada em Celadon.',
      presagio:'Ele te deixou olhar porque não tem medo nenhum de você. Ainda.'},
  escolhas:[
    {texto:'"Põe de volta."', vai:'c5_poe_de_volta'},
    {texto:'Batalhar com eles. Os três.', vai:'c5_luta_trio'},
    {texto:'"Quanto vocês querem pelos seis?"', vai:'c5_comprar_ovos'},
    {texto:'Deixar passar e entrar na caverna.', vai:'c5_entrada', ef:{flag:'deixou_os_ovos_irem'}}
  ]
},

c5_poe_de_volta:{
  falante:'o da aliança',
  vozes:['P','N','N','N'],
  texto:[
    '"Põe de volta."',
    'O da aliança fecha a tampa com o joelho, sem pressa.',
    '"Põe de volta onde, {moleque|moleca}? Eu não sei mais de qual ninho é qual."',
    'Ele fala isso sem crueldade nenhuma, e é um argumento verdadeiro, e ele vence a discussão com um argumento verdadeiro.',
    '"Se eu jogar de volta lá dentro no ninho errado, a mãe come." Ele levanta a caixa. "Você quer isso?"',
    'Você não quer isso. Você não quer nada disso. Não existe nenhuma escolha aqui que devolva os seis ovos aos seis lugares certos.'
  ],
  ef:{flag:'licao_do_irreversivel'},
  escolhas:[
    {texto:'Batalhar com eles mesmo assim.', vai:'c5_luta_trio'},
    {texto:'"Então me leva junto. Eu carrego uma caixa."', vai:'c5_carregar_caixa'},
    {texto:'Anotar tudo de cabeça e deixar eles irem.', vai:'c5_anotou_trio',
     ef:{flag:'anotou_o_trio'}},
    {texto:'Deixar ir e entrar na caverna.', vai:'c5_entrada', ef:{flag:'deixou_os_ovos_irem'}}
  ]
},

c5_anotou_trio:{
  texto:[
    'Você não faz nada. Você olha.',
    'Olha a marca da botina, olha o curativo no polegar, olha que o da aliança tem uma tatuagem borrada no antebraço que parece uma âncora e não é.',
    'Olha a caixa: plástica, azul, com um número estampado em preto no canto. 0-7-4.',
    'Eles descem a trilha. Você fica na boca da caverna repetindo 074 na cabeça até virar música.'
  ],
  ef:{flag:'numero_da_caixa', registrar:'Caixa plástica azul, número 074. Três homens, um com tatuagem no antebraço.'},
  escolhas:[
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Entrar na caverna.', vai:'c5_entrada'},
    {texto:'Seguir eles de longe.', vai:'c5_seguiu_trio'}
  ]
},

c5_carregar_caixa:{
  falante:'o da aliança',
  vozes:['P','N','N','P','N'],
  texto:[
    '"Então me leva junto. Eu carrego uma caixa."',
    'Os três se olham. O da aliança ri primeiro, e os outros dois riem depois dele, o que diz quem manda.',
    '"Olha só." Ele mede você de cima a baixo. "Você tem quantos, quinze?"',
    '"Quinze."',
    '"E você carrega caixa por quanto?"',
    'É uma pergunta real. Ele está realmente perguntando quanto você cobra.'
  ],
  escolhas:[
    {texto:'"De graça. Eu só quero ver onde vai."', vai:'c5_de_graca'},
    {texto:'"Quinhentos."', vai:'c5_cobrou'},
    {texto:'Desistir. "Esquece."', vai:'c5_entrada', ef:{flag:'deixou_os_ovos_irem'}},
    {texto:'Atacar agora, enquanto eles estão rindo.', vai:'c5_luta_trio'}
  ]
},

c5_de_graca:{
  falante:'o da aliança',
  vozes:['P','N','N','N'],
  texto:[
    '"De graça. Eu só quero ver onde vai."',
    'O riso morre.',
    '"Não." O da aliança fica sério de uma vez. "Isso aí é a resposta errada, {moleque|moleca}. Quem trabalha de graça quer outra coisa."',
    'Ele levanta a caixa e passa por você com um ombro que quase encosta e não encosta.',
    '"Vai pra dentro da caverna brincar. Não vem atrás."',
    'Eles descem. Você fica com a certeza clara de que errou a jogada por meio segundo de honestidade.'
  ],
  ef:{flag:'errou_a_jogada'},
  escolhas:[
    {texto:'Seguir eles de longe mesmo assim.', vai:'c5_seguiu_trio'},
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Entrar na caverna.', vai:'c5_entrada'}
  ]
},

c5_cobrou:{
  falante:'o da aliança',
  vozes:['P','N','P'],
  texto:[
    '"Quinhentos."',
    'O da aliança assobia.',
    '"Quinhentos pra carregar caixa vazia meia hora ladeira abaixo. Você é {ladrão|ladra}."',
    '"Sou caro."',
    'Ele ri de verdade dessa vez, e tira duas notas do bolso, e são trezentos e não quinhentos, e ele te entrega do jeito que se entrega quando se sabe que a outra pessoa vai aceitar.',
    'Você carrega a caixa por trinta e cinco minutos, ladeira abaixo, sentindo o calor dos ovos através do plástico na altura da barriga.',
    'A estrada de terra termina numa van branca parada numa curva. Nenhuma placa. Motor ligado.'
  ],
  ef:{dinheiro:300, flag:['carregou_a_caixa','viu_a_van'],
      rep:{eixo:'ruim',delta:2,motivo:'Carregou carga de quem tirou ovos do Monte da Lua'},
      registrar:'Carregou uma caixa de ovos até uma van branca sem placa na estrada velha.'},
  escolhas:[
    {texto:'Memorizar tudo da van e voltar pra caverna.', vai:'c5_memorizou_van'},
    {texto:'Perguntar se tem mais trabalho.', vai:'c5_mais_trabalho'},
    {texto:'Devolver o dinheiro e ir embora.', vai:'c5_devolveu_trezentos'},
    {texto:'Voltar pra caverna e não pensar nisso.', vai:'c5_entrada'}
  ]
},

c5_memorizou_van:{
  texto:[
    'Você fica olhando enquanto eles carregam.',
    'Van branca, teto alto, porta lateral corrediça, sem placa na traseira e com o suporte de placa dobrado pra dentro — o que não é descuido, é trabalho de alguém com alicate.',
    'No para-brisa, um adesivo pequeno no canto inferior direito. Um brasão. Uma balança.',
    d=>d.flags.folheto_comissao
      ? 'Você já viu esse brasão. No folheto de papel bom que estava debaixo do balcão do museu de Pewter.'
      : 'Você não faz ideia do que é. Você grava.',
    'O motorista não desce da van uma vez sequer.'
  ],
  ef:{flag:'brasao_na_van', registrar:'A van branca sem placa tem um adesivo com um brasão de balança no para-brisa.',
      presagio:'Uma balança. Um símbolo de justiça num veículo sem placa.'},
  escolhas:[
    {texto:'Voltar pra caverna.', vai:'c5_entrada'},
    {texto:'Ligar pra Dra. Cordell daqui.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Perguntar se tem mais trabalho.', vai:'c5_mais_trabalho'}
  ]
},

c5_mais_trabalho:{
  falante:'o da aliança',
  vozes:['P','N','N','P','N','N'],
  texto:[
    '"Tem mais trabalho?"',
    'O da aliança bate a porta lateral da van.',
    '"Sempre tem." Ele te olha de um jeito novo, avaliando de verdade. "Você anda em rota, né? Passa em cidade, ninguém te para, ninguém te revista, porque você é moleque de mochila."',
    '"É."',
    '"Então tem." Ele escreve um número num maço de cigarro amassado e te dá. "Liga quando passar em Cerulean."'
  ],
  ef:{flag:'numero_dos_carregadores', rep:{eixo:'ruim',delta:1,motivo:'Se ofereceu para transportar carga'},
      registrar:'Ganhou um número de contato para "trabalho" em Cerulean.',
      presagio:'Um número num maço amassado. É assim que começa, nunca com um contrato.'},
  escolhas:[
    {texto:'Guardar o número e voltar pra caverna.', vai:'c5_entrada'},
    {texto:'Rasgar o número na frente dele.', vai:'c5_rasgou_numero',
     ef:{limpaFlag:'numero_dos_carregadores', rep:{eixo:'bom',delta:1,motivo:'Rasgou o convite na cara de quem convidou'}}},
    {texto:'Memorizar tudo da van.', vai:'c5_memorizou_van'}
  ]
},

c5_rasgou_numero:{
  falante:'o da aliança',
  vozes:['N'],
  texto:[
    'Você rasga o maço em quatro na frente dele e deixa cair.',
    'Ele olha os pedaços no chão. Depois olha você.',
    '"Pegou os trezentos, hein."',
    'É o único golpe que ele precisava dar, e ele acerta em cheio, e você volta a subir a trilha com trezentos pokedólares no bolso e nenhuma resposta.'
  ],
  ef:{flag:'rasgou_o_numero', presagio:'Você pegou os trezentos. Isso já aconteceu e não desacontece.'},
  escolhas:[
    {texto:'Voltar pra caverna.', vai:'c5_entrada'},
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c5_devolveu_trezentos:{
  falante:'o da aliança',
  vozes:['N','P','N','N'],
  texto:[
    'Você tira as duas notas e estende.',
    'O da aliança não pega.',
    '"Cê carregou a caixa."',
    '"Eu não quero."',
    '"Eu também não quero. Eu quero que você carregue caixa e eu pago." Ele bate a porta da van. "O dinheiro é seu. Você fez o serviço. Joga fora se quiser, mas não põe na minha mão."',
    'A van sai. Você fica na curva da estrada de terra com trezentos pokedólares que não dá pra devolver e não dá pra gastar direito.'
  ],
  ef:{flag:'dinheiro_sujo',
      presagio:'Tem trezentos pokedólares na sua mochila agora com um formato diferente do resto do dinheiro.'},
  escolhas:[
    {texto:'Voltar pra caverna.', vai:'c5_entrada'},
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c5_luta_trio:{
  falante:'o da aliança',
  vozes:['N'],
  texto:[
    'Você solta a Pokébola antes de pensar direito.',
    'Os três param. O da aliança suspira fundo, do jeito de quem vai ter que fazer hora extra.',
    '"Ah, cara."',
    'Ele põe a caixa no chão com cuidado — com cuidado, é o detalhe que você vai lembrar — e só depois solta a dele.'
  ],
  batalha:{dex:23, nivel:19, tipo:'treinador', treinador:'Carregador', fuga:false,
           timeExtra:[{dex:20, nivel:20}],
           vitoria:'c5_venceu_trio', derrota:'c5_perdeu_trio', gameover:'gameover'}
},

c5_venceu_trio:{
  falante:'o da aliança',
  vozes:['N','N'],
  texto:[
    'Você ganha. Os outros dois não entram — eles ficam com as caixas e olham.',
    'O da aliança recolhe o time e limpa a boca com as costas da mão.',
    '"Tá." Ele pega a caixa do chão de novo. "Ganhou. E agora?"',
    'Porque é isso: você ganhou uma batalha Pokémon. Isso não amarra ninguém, não prende ninguém, não devolve nada.',
    'Eles descem a trilha com as três caixas.',
    'A não ser que você faça alguma coisa que não é batalha.'
  ],
  ef:{flag:'venceu_o_trio', dinheiro:600},
  escolhas:[
    {texto:'Ficar na frente deles. Fisicamente.', vai:'c5_barrou'},
    {texto:'Pegar uma caixa e correr pra dentro da caverna.', vai:'c5_roubou_caixa'},
    {texto:'Deixar ir e ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Deixar ir e entrar na caverna.', vai:'c5_entrada', ef:{flag:'deixou_os_ovos_irem'}}
  ]
},

c5_barrou:{
  falante:'o da aliança',
  vozes:['N','N'],
  texto:[
    'Você atravessa na frente deles na trilha, de braços abertos, que é a coisa mais estúpida e mais humana que dá pra fazer.',
    'Os três param.',
    'E aí acontece uma coisa que você não previu: eles esperam.',
    'Ficam ali, parados, com as caixas, olhando você de braços abertos numa trilha de terra.',
    'Um minuto. Dois. Seu braço começa a cansar.',
    '"A gente tem o dia todo", diz o da aliança, sentando numa pedra. "Você tem?"'
  ],
  ef:{flag:'barrou_a_trilha'},
  escolhas:[
    {texto:'Ficar. Não importa quanto tempo.', vai:'c5_ficou_barrando'},
    {texto:'Pegar uma caixa e correr pra dentro da caverna.', vai:'c5_roubou_caixa'},
    {texto:'Sair da frente.', vai:'c5_saiu_da_frente'},
    {texto:'Ligar pra Dra. Cordell daqui mesmo, de braços abertos.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c5_ficou_barrando:{
  falante:'o da aliança',
  vozes:['N','N','P','N','P','N'],
  texto:[
    'Você fica.',
    'Uma hora e dez minutos numa trilha de terra, de pé, na frente de três homens sentados em pedras.',
    'Em certo momento um deles te oferece água e você aceita, porque recusar seria teatro, e vocês quatro ficam ali bebendo água num impasse absurdo.',
    'No fim, o da aliança levanta.',
    '"Olha." Ele fala com um cansaço genuíno. "Eu tenho que entregar até as sete. Se eu não entregar, eu é que vou ter problema. Você entende isso?"',
    '"Entendo."',
    '"Então sai."',
    '"Não."',
    'Ele olha pra você por um tempo comprido. E aí faz uma coisa que muda tudo: pega uma das três caixas, a menor, e põe no chão do seu lado.',
    '"Essa aqui eu perdi no caminho. Tá bom? Eu perdi essa no caminho."',
    'E eles passam pelos seus braços abertos com as outras duas.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Segurou uma trilha por uma hora e salvou o que deu'},
      flag:'salvou_uma_caixa', hp:-2, causa:'Exaustão no impasse da trilha',
      registrar:'Segurou os carregadores por uma hora. Eles deixaram uma caixa com você.'},
  escolhas:[
    {texto:'Levar a caixa de volta pra dentro da caverna.', vai:'c5_devolver_ovos'},
    {texto:'Levar a caixa pra Pewter, pro museu.', vai:'c5_ovos_pro_museu'},
    {texto:'Ligar pra Dra. Cordell com a caixa na mão.', vai:'c5_ligou_com_caixa', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Entrar na caverna com a caixa.', vai:'c5_entrada', ef:{flag:'carregando_ovos'}}
  ]
},

c5_devolver_ovos:{
  texto:[
    'Você entra na caverna com a caixa nos braços.',
    'Leva quarenta minutos pra achar um ninho — uma depressão na rocha forrada de fibra seca, com casca de ovo antiga em volta, num nível de umidade completamente diferente do resto.',
    'Você põe os dois ovos lá. Só dois: os outros já estavam frios demais quando você abriu a caixa, e você não sabia disso até abrir a caixa.',
    'Você fica escondid{o|a} a uns vinte metros por uma hora e meia. Aparece um Clefairy. Ele chega perto do ninho, para, e fica olhando os dois ovos de um jeito que não dá pra interpretar.',
    'Depois senta em cima deles.',
    'Você não sabe se ele sabe que não são os mesmos. Você prefere não saber.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Devolveu ao ninho o que deu pra devolver'},
      flag:'devolveu_os_ovos'},
  escolhas:[
    {texto:'Ir mais fundo na caverna.', vai:'c5_entrada'}
  ]
},

c5_ovos_pro_museu:{
  texto:[
    'Três horas de descida com uma caixa de ovos nos braços.',
    'Varian abre a porta do museu fora do horário porque você bate insistindo, olha a caixa, e chama a Dra. Cordell pelo telefone da bilheteria sem perguntar nada.',
    'Ela chega em vinte minutos com um termômetro e uma caixa térmica.',
    '"Quatro estão mortos." Ela fala isso rápido e sem drama, que é o jeito dela de ser gentil. "Dois não."',
    'Os dois ficam numa incubadora improvisada no museu de Pewter, entre uma vitrine de minerais e um balde.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Levou os ovos a quem sabia o que fazer'},
      flag:['ovos_no_museu','cartao_ivone'],
      npc:{nome:'Dra. Cordell', opiniao:6, memoria:'Você desceu três horas com uma caixa de ovos de Clefairy. Dois sobreviveram.'},
      registrar:'Dois ovos de Clefairy estão numa incubadora no museu de Pewter.',
      presagio:'Tem duas coisas vivas num museu que vaza, esperando por você.'},
  escolhas:[
    {texto:'Voltar pro Monte da Lua.', vai:'c5_entrada'}
  ]
},

c5_ligou_com_caixa:{
  texto:[
    'Você anda até pegar sinal com a caixa debaixo do braço.',
    'A Dra. Cordell atende no segundo toque.',
    'Você fala. Ela não interrompe uma vez. No fim ela faz duas perguntas: "Estão quentes?" e "Você abriu?"',
    '"Quentes. E eu abri."',
    '"Fecha. Fecha agora e não abre mais." Você ouve ela levantando de alguma cadeira. "Eu chego em duas horas. Fica na sombra. Não põe no sol, não põe no chão de pedra, põe em cima da sua mochila."',
    'Você fica duas horas na sombra com uma caixa de ovos em cima da mochila. É a coisa mais estranha que você já fez.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Chamou quem sabia, e esperou'},
      flag:'ovos_com_ivone',
      npc:{nome:'Dra. Cordell', opiniao:7, memoria:'Você segurou uma caixa de ovos na sombra por duas horas esperando ela chegar.'},
      itens:{'Super Potion':2}},
  escolhas:[
    {texto:'Entrar na caverna depois que ela for embora.', vai:'c5_entrada'}
  ]
},

c5_roubou_caixa:{
  texto:[
    'Você pega a caixa do chão e corre pra dentro da caverna.',
    'Atrás de você tem gritaria, mas ninguém entra. Nove metros lá dentro você entende por quê: eles têm lanterna e você tem lanterna e eles têm que entregar até as sete.',
    'Você corre até não ouvir mais nada, e depois corre mais um pouco, e depois para porque não sabe mais pra onde está correndo.',
    'A caixa na sua mão está quente.'
  ],
  ef:{flag:['roubou_a_caixa','carregando_ovos'],
      rep:{eixo:'bom',delta:1,motivo:'Tirou uma caixa de ovos de quem ia vendê-los'}},
  escolhas:[
    {texto:'Procurar um ninho e devolver os ovos.', vai:'c5_devolver_ovos'},
    {texto:'Seguir fundo com a caixa.', vai:'c5_entrada'},
    {texto:'Sair pelo outro lado e levar pra Pewter.', vai:'c5_ovos_pro_museu'}
  ]
},

c5_saiu_da_frente:{
  texto:[
    'Seu braço dói. Você abaixa.',
    'Eles passam. O da aliança diz "valeu" ao passar, e é a pior palavra que já disseram pra você.'
  ],
  ef:{flag:'deixou_os_ovos_irem'},
  escolhas:[
    {texto:'Entrar na caverna.', vai:'c5_entrada'},
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c5_perdeu_trio:{
  falante:'o da aliança',
  vozes:['N','N'],
  texto:[
    'Você perde.',
    'Eles não te machucam. Isso é importante e é pior do que se machucassem: o da aliança dá um tapinha no seu ombro, do jeito de quem consola um sobrinho.',
    '"Treina mais." Ele pega a caixa. "Sério, {moleque|moleca}. Treina mais."',
    'Eles descem a trilha conversando sobre a Liga de novo, e você fica sentad{o|a} na terra com o time desmaiado e uma humilhação que não tem nome.'
  ],
  ef:{flag:['perdeu_pro_trio','deixou_os_ovos_irem'], hp:-3, causa:'Derrota na trilha do Monte da Lua'},
  escolhas:[
    {texto:'Entrar na caverna.', vai:'c5_entrada'},
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Seguir eles de longe, mancando.', vai:'c5_seguiu_trio'}
  ]
},

c5_seguiu_trio:{
  texto:[
    'Você desce a trilha atrás deles, longe, usando as curvas.',
    'Trinta e cinco minutos depois a estrada de terra termina numa curva onde tem uma van branca parada com o motor ligado.',
    'Eles carregam. O motorista não desce. A porta lateral fecha. A van sai devagar porque a estrada é ruim.',
    'Sem placa. Suporte de placa dobrado pra dentro com alicate.',
    'E no canto do para-brisa, um adesivo pequeno: um brasão com uma balança.'
  ],
  ef:{flag:['viu_a_van','brasao_na_van'], registrar:'A van branca sem placa do Monte da Lua tem um brasão de balança no para-brisa.',
      presagio:'Uma balança. Alguém desenhou uma balança e colou num veículo sem placa, e achou isso apropriado.'},
  escolhas:[
    {texto:'Ligar pra Dra. Cordell com tudo isso.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Voltar e entrar na caverna.', vai:'c5_entrada'},
    {texto:'Seguir a van a pé enquanto der.', vai:'c5_seguiu_van'}
  ]
},

c5_seguiu_van:{
  texto:[
    'Você segue a van a pé. Isso funciona por quase dois quilômetros, porque a estrada de terra é péssima e ela anda a vinte por hora.',
    'Depois ela pega o asfalto e some em nove segundos.',
    'Você fica no acostamento, com falta de ar, olhando uma estrada vazia.',
    'Do outro lado do asfalto tem uma placa: CERULEAN 31 KM.'
  ],
  ef:{flag:'van_foi_pra_cerulean', hp:-2, causa:'Corrida atrás da van'},
  escolhas:[
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Voltar pra caverna.', vai:'c5_entrada'}
  ]
},

c5_comprar_ovos:{
  falante:'o da aliança',
  vozes:['P','P','P','N'],
  texto:[
    '"Quanto vocês querem pelos seis?"',
    'Silêncio. Os três se olham.',
    '"Quarenta e oito mil", diz o da aliança, sem piscar.',
    'Você não tem quarenta e oito mil. Você não tem cinco por cento de quarenta e oito mil.',
    '"Isso é o preço de Celadon", você diz. "O preço de vocês é outro."',
    'Ele sorri sem nenhuma alegria.',
    '"O preço nosso é o que a gente recebe de quem manda. E quem manda não negocia com moleque numa trilha."'
  ],
  ef:{flag:'quem_manda', presagio:'"Quem manda." A frase tem dono, e o dono não estava naquela trilha.'},
  escolhas:[
    {texto:'"Quem manda?"', vai:'c5_quem_manda'},
    {texto:'Batalhar com eles.', vai:'c5_luta_trio'},
    {texto:'Ficar na frente deles.', vai:'c5_barrou'},
    {texto:'Deixar ir e entrar na caverna.', vai:'c5_entrada', ef:{flag:'deixou_os_ovos_irem'}}
  ]
},

c5_quem_manda:{
  falante:'o da aliança',
  vozes:['P','N','N'],
  texto:[
    '"Quem manda?"',
    'O da aliança levanta a caixa e não responde na hora. Responde na quarta passada, já de costas, já descendo:',
    '"Gente que assina papel."',
    'Ele diz isso do jeito de quem acha graça de si mesmo por ter medo.',
    '"Gente que assina papel é pior que gente com arma, {moleque|moleca}. Arma acaba. Papel não."'
  ],
  ef:{flag:'gente_que_assina_papel'},
  escolhas:[
    {texto:'Ir atrás e insistir.', vai:'c5_barrou'},
    {texto:'Anotar tudo de cabeça.', vai:'c5_anotou_trio'},
    {texto:'Entrar na caverna.', vai:'c5_entrada'}
  ]
},

c5_ficou_em_cima:{
  texto:[
    'Você não desce.',
    'Os três esperam uns vinte segundos, e depois um deles dá de ombros e eles continuam descendo a trilha com as caixas.',
    'Ninguém sobe atrás de você. Ninguém ameaça. Ninguém se importa o suficiente pra isso.',
    'Deitad{o|a} naquela saliência, você entende uma coisa desagradável: não ser levado a sério é a forma mais eficiente de te neutralizar, e não custa nada pra eles.'
  ],
  ef:{flag:'nao_levado_a_serio'},
  escolhas:[
    {texto:'Descer e seguir eles.', vai:'c5_seguiu_trio'},
    {texto:'Entrar na caverna.', vai:'c5_entrada'},
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c5_ligou_antes:{
  texto:[
    'Você anda até pegar sinal — uns quatrocentos metros de subida, num lugar onde o vale abre.',
    'A Dra. Cordell atende no segundo toque, como quem dorme com o telefone na mão.',
    'Você fala tudo. Ela não interrompe nenhuma vez.',
    'Quando você acaba, o silêncio dela dura quatro segundos e é um silêncio de quem está escrevendo.',
    '"Você tá do lado de fora?"',
    '"Tô."',
    '"Fica do lado de fora." Ela fala devagar, com muito cuidado de ser entendida. "Eu chego em seis horas. Eu levo gente com câmera. Se for pra Liga eles somem antes; com câmera eles não somem."'
  ],
  ef:{flag:'ligou_pra_ivone', registrar:'Ligou para a Dra. Cordell da entrada do Monte da Lua.',
      npc:{nome:'Dra. Cordell', opiniao:4, memoria:'Você ligou pra ela do Monte da Lua, como combinado.'}},
  escolhas:[
    {texto:'Obedecer. Esperar seis horas na boca da caverna.', vai:'c5_esperou_ivone',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Esperou seis horas fazendo o que era certo e chato'}}},
    {texto:'"Não dá. Tem coisa acontecendo agora." E entrar.', vai:'c5_entrada',
     ef:{flag:'desobedeceu_ivone'}},
    {texto:'Entrar só pra olhar e voltar antes dela chegar.', vai:'c5_entrada',
     ef:{flag:'so_pra_olhar'}},
    {texto:'Esperar, mas do posto de observação lá em cima.', vai:'c5_esperou_ivone',
     ef:{flag:'esperou_do_posto', rep:{eixo:'bom',delta:1,motivo:'Esperou, e esperou de um lugar inteligente'}}}
  ]
},

c5_esperou_ivone:{
  texto:[
    'Seis horas é muito tempo.',
    'Você come tudo o que tinha. Cochila duas vezes e acorda as duas assustad{o|a}. Conta pedras. Conversa com o seu time em voz alta, o que é uma coisa que você começou a fazer essa semana sem perceber.',
    'Em algum momento, duas pessoas saem da caverna, olham a trilha, e voltam pra dentro.',
    d=>d.flags.esperou_do_posto ? 'Elas não te veem, porque você está deitad{o|a} numa saliência quatro metros acima da boca. Isso foi inteligente.' : 'Elas te veem sentad{o|a} na pedra. Uma delas acena. Você acena de volta, porque o que mais dá pra fazer.',
    'A Dra. Cordell chega às sete e quarenta da noite com quatro pessoas, dois carros e uma câmera de ombro.',
    'A primeira coisa que ela faz é olhar a sua cara e perguntar se você comeu.'
  ],
  ef:{flag:'ivone_chegou', hp:2,
      npc:{nome:'Dra. Cordell', opiniao:6, memoria:'Você esperou seis horas na boca do Monte da Lua como ela pediu. Ela não esperava que você esperasse.'}},
  escolhas:[
    {texto:'Entrar com eles.', vai:'c5_entrou_com_imprensa'},
    {texto:'Ficar na boca da caverna, guardando a saída.', vai:'c5_guardou_saida'},
    {texto:'"Deixa eu ir na frente. Eu já sei o caminho."', vai:'c5_entrou_com_imprensa',
     ef:{flag:'guiou_a_imprensa'}}
  ]
},

c5_entrou_com_imprensa:{
  texto:[
    'Entrar numa caverna com quatro adultos e uma câmera com luz é uma experiência completamente diferente de entrar sozinho.',
    'A luz da câmera transforma a caverna num lugar comum: é só pedra, é só chão, é só gente andando.',
    'Vocês seguem o cabo elétrico por vinte minutos. Ninguém fala.',
    'A câmara está lá. As mesas estão lá. As gaiolas estão lá.',
    'As pessoas, não. Tem café pela metade numa caneca e ainda está morno.'
  ],
  ef:{flag:'expos_operacao', registrar:'A Dra. Cordell e a imprensa entraram na câmara. Os operadores tinham acabado de sair.'},
  escolhas:[
    {texto:'Ajudar a abrir as gaiolas.', vai:'c5_gaiolas_imprensa'},
    {texto:'Procurar por onde eles saíram.', vai:'c5_saida_secreta'},
    {texto:'Olhar os papéis nas mesas.', vai:'c5_papeis_mesa'},
    {texto:'Ficar olhando a câmera filmar tudo.', vai:'c5_a_camera'}
  ]
},

c5_papeis_mesa:{
  texto:[
    'Nas mesas tem papel. Muito papel, e nenhum deles é o que você esperava.',
    'Não tem bilhete de criminoso, não tem mapa com X. Tem formulário.',
    'Guia de remessa. Termo de recolhimento. Laudo de espécime. Tudo impresso, tudo com campo e linha e numeração sequencial.',
    'No cabeçalho de cada folha, um brasão pequeno: uma balança.',
    'Você pega uma folha e lê o campo do meio. Diz: "FUNDAMENTO LEGAL: Art. 4º, III."',
    'Alguém está fazendo isso com formulário. Alguém acha que tem direito.'
  ],
  ef:{flag:['papel_com_brasao','gente_que_assina_papel'],
      registrar:'Os papéis da câmara do Monte da Lua têm brasão, numeração e "fundamento legal".',
      presagio:'Não é bandido. É pior: é alguém com um artigo pra citar.'},
  escolhas:[
    {texto:'Guardar uma folha na mochila.', vai:'c5_guardou_folha', ef:{flag:'guardou_a_folha'}},
    {texto:'Mostrar pra Dra. Cordell.', vai:'c5_mostrou_folha'},
    {texto:'Chamar a câmera pra filmar o cabeçalho.', vai:'c5_filmou_papel'},
    {texto:'Ajudar a abrir as gaiolas primeiro.', vai:'c5_gaiolas_imprensa'}
  ]
},

c5_guardou_folha:{
  texto:[
    'Você dobra a folha em quatro e põe no bolso interno da mochila, junto com o que importa.',
    'Ninguém vê. A câmera está filmando as gaiolas do outro lado da câmara.',
    'Você não sabe por que guardou. Vai levar meses pra entender que foi a decisão mais importante que você tomou nessa caverna.'
  ],
  ef:{flag:'guardou_a_folha', registrar:'Guardou uma guia de remessa com brasão do Monte da Lua.'},
  escolhas:[
    {texto:'Ajudar com as gaiolas.', vai:'c5_gaiolas_imprensa'},
    {texto:'Mostrar pra Dra. Cordell assim mesmo.', vai:'c5_mostrou_folha'},
    {texto:'Procurar por onde eles saíram.', vai:'c5_saida_secreta'}
  ]
},

c5_mostrou_folha:{
  texto:[
    'Você chama a Dra. Cordell e entrega a folha.',
    'Ela lê. Lê de novo. Vira pro verso, que está em branco, e volta pra frente.',
    '"Isso não é contrabando", ela diz baixo, pra você e pra mais ninguém.',
    '"Como não? Tem gaiola ali."',
    '"Contrabando esconde." Ela balança a folha. "Isso aqui tem numeração sequencial, {moço|moça}. Numeração sequencial é pra auditoria. Isso é feito pra ser conferido depois."',
    'Ela dobra a folha e põe no bolso interno do jaleco.',
    '"Eu passei dois anos achando que estava atrás de ladrão de fóssil."'
  ],
  ef:{flag:['papel_com_brasao','ivone_entendeu'],
      npc:{nome:'Dra. Cordell', opiniao:5, memoria:'Você entregou a ela a guia de remessa que mudou o entendimento dela sobre tudo.'},
      registrar:'Cordell concluiu que o Monte da Lua não era contrabando: era operação com contabilidade.'},
  escolhas:[
    {texto:'"E o que é, então?"', vai:'c5_o_que_e'},
    {texto:'Ajudar com as gaiolas.', vai:'c5_gaiolas_imprensa'},
    {texto:'Chamar a câmera.', vai:'c5_filmou_papel'}
  ]
},

c5_o_que_e:{
  texto:[
    '"E o que é, então?"',
    'Ela demora.',
    '"Eu não sei." Ela olha em volta, pras mesas, pros refletores de obra, pro cabo que alguém instalou com abraçadeira nova. "Mas quem monta instalação elétrica numa caverna pra operação ilegal está contando com ter tempo."',
    '"E quem conta com ter tempo—"',
    '"—acha que não vai ser incomodado." Ela fecha o jaleco. "E quem acha que não vai ser incomodado geralmente tem razão."'
  ],
  ef:{flag:'conclusao_da_caverna',
      presagio:'Eles montaram infraestrutura. Ninguém monta infraestrutura pra um crime: monta pra um serviço.'},
  escolhas:[
    {texto:'Ajudar com as gaiolas.', vai:'c5_gaiolas_imprensa'},
    {texto:'Procurar por onde eles saíram.', vai:'c5_saida_secreta'},
    {texto:'Ficar olhando a câmera filmar.', vai:'c5_a_camera'}
  ]
},

c5_filmou_papel:{
  texto:[
    'Você chama o rapaz da câmera e aponta o cabeçalho.',
    'Ele faz um close de oito segundos no brasão da balança e mais um close no campo "FUNDAMENTO LEGAL".',
    'Depois abaixa a câmera e fala, meio pra ele mesmo: "Isso aqui não vai passar."',
    '"Como assim não vai passar?"',
    '"Vai passar a gaiola." Ele aponta com o queixo. "Gaiola é imagem. Papel é chato. A pauta vai ser a gaiola."',
    'E foi exatamente isso que aconteceu.'
  ],
  ef:{flag:['papel_filmado','papel_com_brasao'],
      presagio:'A gaiola é imagem. O papel é chato. É por isso que o papel ganha.'},
  escolhas:[
    {texto:'Guardar uma folha mesmo assim.', vai:'c5_guardou_folha'},
    {texto:'Mostrar pra Dra. Cordell.', vai:'c5_mostrou_folha'},
    {texto:'Ajudar com as gaiolas.', vai:'c5_gaiolas_imprensa'}
  ]
},

c5_gaiolas_imprensa:{
  texto:[
    'Vocês abrem as gaiolas. São onze.',
    'Clefairy em oito delas, cinco ou seis por gaiola, em gaiolas de dois palmos. Um Paras numa sozinha, que não se mexe. Dois Zubat. Uma vazia com palha.',
    'A parte que a câmera filma é a abertura. A parte que ela não filma é o que vem depois: metade não sai.',
    'Eles ficam na gaiola aberta, no canto, encolhidos. Um deles, quando você põe a mão pra ajudar, morde com uma força que não tem nada a ver com o tamanho dele.',
    'Leva quase duas horas pra tirar todos. Alguns precisam ser tirados.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Abriu as gaiolas do Monte da Lua'},
      hp:-3, causa:'Mordida e esforço na câmara do Monte da Lua',
      flag:'abriu_as_gaiolas', itens:{'Hyper Potion':1},
      registrar:'Onze gaiolas abertas na câmara do Monte da Lua.'},
  escolhas:[
    {texto:'Carregar o Paras até o Centro Pokémon. São três horas.', vai:'c5_paras'},
    {texto:'Procurar por onde os operadores saíram.', vai:'c5_saida_secreta'},
    {texto:'Ficar com a Dra. Cordell até o fim.', vai:'c5_imprensa'},
    {texto:'Sair. Você já fez o que dava.', vai:'c5_imprensa'}
  ]
},

c5_saida_secreta:{
  texto:[
    'Você procura. Leva uns quinze minutos e é mais fácil do que devia ser, porque eles nem esconderam.',
    'Atrás das caixas empilhadas tem um túnel de serviço com o chão nivelado a pá, largura de carrinho de mão, com trilho improvisado.',
    'Ele sai a quatrocentos metros dali, numa depressão de rocha atrás de um arbusto, direto numa estrada de terra.',
    'Marca de pneu fresca. Van, teto alto, pneu bom.',
    'Eles não fugiram por essa saída. Eles usam essa saída todo dia. Era por ali que a carga saía.'
  ],
  ef:{flag:'achou_a_saida_de_servico', registrar:'A câmara tem uma saída de serviço com trilho que dá numa estrada de terra.',
      presagio:'Quatrocentos metros de túnel cavado a pá. Isso é semanas de trabalho de alguém.'},
  escolhas:[
    {texto:'Chamar a câmera aqui.', vai:'c5_filmou_tunel'},
    {texto:'Seguir a estrada de terra.', vai:'c5_seguiu_van'},
    {texto:'Voltar e ajudar com as gaiolas.', vai:'c5_gaiolas_imprensa'},
    {texto:'Voltar pra câmara e olhar os papéis.', vai:'c5_papeis_mesa'}
  ]
},

c5_filmou_tunel:{
  falante:'o rapaz da câmera',
  texto:[
    'O rapaz da câmera filma o túnel inteiro, andando de costas, com a luz batendo no trilho improvisado.',
    'No fim, do lado de fora, ele filma a marca de pneu e fala baixo:',
    '"Isso aqui é caro."',
    '"O quê?"',
    '"Cavar quatrocentos metros e pôr trilho." Ele desliga a câmera. "Isso é obra. Obra tem orçamento. Orçamento tem alguém que aprovou."'
  ],
  ef:{flag:'tunel_filmado', presagio:'Alguém aprovou um orçamento. Alguém, numa sala, aprovou isso.'},
  escolhas:[
    {texto:'Voltar e ajudar com as gaiolas.', vai:'c5_gaiolas_imprensa'},
    {texto:'Ficar com a Dra. Cordell até o fim.', vai:'c5_imprensa'}
  ]
},

c5_a_camera:{
  texto:[
    'Você fica encostad{o|a} na parede olhando a câmera trabalhar.',
    'O rapaz filma as gaiolas de três ângulos. Filma uma etiqueta de perto. Pede pra Dra. Cordell repetir uma frase porque a primeira vez saiu com eco.',
    'Ela repete. A segunda vez sai pior, mais ensaiada.',
    'Você entende, ali encostad{o|a} na parede fria, uma coisa que vai te acompanhar: existe a coisa que acontece, e existe a coisa que dá pra mostrar, e não são a mesma coisa, e a segunda é a que vira verdade.'
  ],
  ef:{flag:'licao_da_camera'},
  escolhas:[
    {texto:'Ajudar com as gaiolas.', vai:'c5_gaiolas_imprensa'},
    {texto:'Olhar os papéis nas mesas.', vai:'c5_papeis_mesa'},
    {texto:'Procurar por onde eles saíram.', vai:'c5_saida_secreta'}
  ]
},

c5_guardou_saida:{
  texto:[
    'Você fica na boca da caverna enquanto eles entram.',
    'É a função mais chata e provavelmente a mais útil: se alguém sair correndo, você vê.',
    'Ninguém sai correndo. Passam duas horas e meia. Um Zubat sai e volta. O sol some.',
    'Quando eles voltam, a Dra. Cordell está com a mandíbula travada e o rapaz da câmera está carregando um Paras nos braços, com o maior cuidado do mundo, do jeito que se carrega uma coisa que ainda não morreu.'
  ],
  ef:{flag:['expos_operacao','guardou_a_boca'],
      rep:{eixo:'bom',delta:2,motivo:'Guardou a saída enquanto outros faziam o trabalho'}},
  escolhas:[
    {texto:'Carregar o Paras você mesm{o|a} até o Centro.', vai:'c5_paras'},
    {texto:'Descer junto com eles.', vai:'c5_imprensa'},
    {texto:'Entrar agora, sozinh{o|a}, pra ver o que ficou.', vai:'c5_camara_vazia'}
  ]
},

c5_camara_vazia:{
  texto:[
    'Você entra sozinh{o|a}, depois de todo mundo, com a luz da lanterna já amarelando.',
    'A câmara agora é um lugar completamente diferente: mesas vazias, gaiolas abertas no chão, refletores de obra apagados.',
    'Tem café pela metade numa caneca. Já frio.',
    'E tem, na parede dos fundos, um retângulo limpo na rocha do tamanho de uma porta — o lugar de onde tiraram um fóssil com serra, e a superfície é lisa como bancada de cozinha.',
    'Trezentos milhões de anos, e uma serra circular leva quarenta minutos.'
  ],
  ef:{flag:'viu_o_retangulo'},
  escolhas:[
    {texto:'Olhar os papéis nas mesas.', vai:'c5_papeis_mesa'},
    {texto:'Procurar a saída de serviço.', vai:'c5_saida_secreta'},
    {texto:'Subir mais fundo, pro topo da caverna.', vai:'c5_subida'},
    {texto:'Descer e alcançar os outros.', vai:'c5_imprensa'}
  ]
},

c5_imprensa:{
  texto:[
    'Sai no jornal de Pewter e no de Cerulean, e um trecho de quarenta segundos na TV regional.',
    'Seu nome aparece — pequeno, errado, com uma letra trocada. Você lê umas dez vezes.',
    'Dezessete Clefairy foram para um centro de recuperação em Cerulean. Onze voltaram para o Monte da Lua três semanas depois. Os outros seis não.',
    'Prenderam duas pessoas: um motorista e um rapaz de vinte e dois anos que trabalhava lá havia cinco meses. As duas foram soltas em dois dias.',
    'Ninguém foi indiciado por nada com numeração sequencial.',
    'A Dra. Cordell te manda uma mensagem três dias depois: "Foi o que deu pra fazer. Quase nunca é o que a gente queria."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Seu nome saiu no jornal pela primeira vez'},
      flag:['expos_operacao','vasco_solto'],
      registrar:'A operação do Monte da Lua saiu na imprensa. Duas prisões, duas solturas.',
      presagio:'Prenderam o motorista e o rapaz de vinte e dois anos. Não prenderam ninguém que assina.'},
  escolhas:[
    {texto:'Seguir para Cerulean.', vai:'c5_fim'},
    {texto:'Voltar pra caverna antes de descer. Tem uma parte que você não viu.', vai:'c5_subida'}
  ]
},

/* ─────────────── CAMINHO DE DENTRO ─────────────── */

c5_fora:{
  texto:[
    'Você contorna o monte por fora. A rocha é ruim de andar e leva quase uma hora.',
    'Você acha três coisas: uma fenda estreita demais pra passar, um monte de lata de comida enferrujada num ponto onde alguém acampou muito tempo, e uma segunda boca.',
    'A segunda boca é baixa, escondida atrás de um arbusto, e não tem trilha levando até ela. Tem uma coisa melhor: tem uma corrente de ar saindo.',
    'Ar saindo quer dizer que tem outra abertura do outro lado. Quer dizer que essa caverna atravessa.'
  ],
  ef:{flag:'achou_a_segunda_boca', registrar:'Encontrou uma segunda entrada escondida no Monte da Lua.'},
  escolhas:[
    {texto:'Entrar pela segunda boca.', vai:'c5_desvio'},
    {texto:'Voltar e entrar pela principal.', vai:'c5_entrada'},
    {texto:'Acampar aqui e entrar de manhã.', vai:'c5_esperar'},
    {texto:'Examinar o acampamento das latas.', vai:'c5_latas'}
  ]
},

c5_latas:{
  texto:[
    'Vinte e duas latas. Você conta porque não tem mais nada pra fazer com essa informação.',
    'Feijão, milho, ervilha. Todas abertas com faca, não com abridor. Todas empilhadas — empilhadas, não jogadas —, o que quer dizer que a pessoa ficou tempo o bastante pra criar um sistema.',
    'Embaixo de uma pedra tem um pedaço de papelão com escrita a caneta, quase apagada pelo sereno.',
    '"DIA 31. ELES TROCAM O TURNO ÀS 6 E ÀS 18. O DA MANHÃ É O QUE CONTA AS CAIXAS."',
    'Não tem assinatura. O papelão é velho de meses.'
  ],
  ef:{flag:'papelao_do_acampamento', registrar:'Alguém acampou meses vigiando a troca de turno do Monte da Lua.',
      presagio:'Alguém esteve aqui antes de você, com muito mais paciência, e não está mais aqui.'},
  escolhas:[
    {texto:'Entrar pela segunda boca.', vai:'c5_desvio'},
    {texto:'Voltar e entrar pela principal.', vai:'c5_entrada'},
    {texto:'Acampar aqui e entrar de manhã.', vai:'c5_esperar'}
  ]
},

c5_esperar:{
  texto:[
    'Você acampa. Come o que tem, que é pouco, e divide com quem está com você, o que deixa menos ainda.',
    'De noite o Monte da Lua não é silencioso. É o contrário: é um lugar barulhento de um jeito baixo. Vento passando em buraco. Coisa caindo longe. Asa.',
    'Em algum momento, entre uma e três da manhã, você acorda e a parede da montanha está acesa.',
    'Não muito. Um brilho fraco, azulado, vindo de algum lugar lá em cima, atrás da crista — como se tivesse lua dentro da pedra.',
    'Dura uns quarenta minutos. Depois apaga.'
  ],
  ef:{flag:'viu_a_luz_do_topo', hp:3,
      registrar:'Viu um brilho azul saindo do alto do Monte da Lua no meio da madrugada.',
      presagio:'Tem uma coisa no alto dessa montanha que ninguém em Pewter mencionou.'},
  escolhas:[
    {texto:'Entrar de manhã pela boca principal.', vai:'c5_entrada'},
    {texto:'Subir agora, atrás da luz.', vai:'c5_subida_externa'},
    {texto:'Contornar por fora até achar outra entrada.', vai:'c5_fora'},
    {texto:'Dormir de novo e fingir que não viu.', vai:'c5_entrada', ef:{flag:'ignorou_a_luz'}}
  ]
},

c5_subida_externa:{
  texto:[
    'Subir pela rocha no escuro é uma péssima ideia e você faz mesmo assim.',
    'Leva quase duas horas. Duas vezes você põe o pé em coisa que cede e as duas vezes você tem sorte.',
    'Lá em cima, a crista abre numa cratera rasa — grande, uns oitenta metros, com o fundo de areia cinza fina, e no meio, uma pedra.',
    'Ela não é grande. É do tamanho de uma cabeça. E não está brilhando mais.',
    'Em volta dela, na areia, tem umas trinta marcas de pé pequenas, em círculo, feitas há poucas horas.'
  ],
  ef:{flag:'achou_a_cratera', registrar:'Encontrou a cratera do topo do Monte da Lua e a pedra no centro.'},
  escolhas:[
    {texto:'Pegar a pedra.', vai:'c5_pegou_pedra'},
    {texto:'Não encostar. Sentar na borda e esperar.', vai:'c5_esperou_cratera'},
    {texto:'Descer pela cratera pra dentro da caverna.', vai:'c5_entrada'},
    {texto:'Ir embora e não contar pra ninguém.', vai:'c5_entrada', ef:{flag:'guardou_o_segredo_da_cratera'}}
  ]
},

c5_pegou_pedra:{
  texto:[
    'Você pega.',
    'É mais pesada do que o tamanho sugere e é morna, e a superfície tem a textura de vidro fosco.',
    'Não acontece nada. Nenhuma luz, nenhum som, nenhuma revelação.',
    'Você fica de pé no meio de uma cratera no alto de uma montanha segurando uma pedra morna, cercad{o|a} por trinta marcas de pé em círculo, e o que você sente é constrangimento.',
    'Guarda na mochila. Ela fica morna lá dentro por horas.'
  ],
  ef:{itens:{'Moon Stone':1}, flag:'pegou_a_pedra_da_lua',
      registrar:'Pegou a pedra do centro da cratera do Monte da Lua.',
      presagio:'Trinta pares de pés vieram até aqui ontem à noite por causa dessa pedra. E você pôs ela na mochila.'},
  escolhas:[
    {texto:'Devolver ao centro da cratera.', vai:'c5_devolveu_pedra',
     ef:{perdeItens:{'Moon Stone':1}, rep:{eixo:'bom',delta:2,motivo:'Devolveu o que não era seu ao lugar de onde tirou'},
         limpaFlag:'pegou_a_pedra_da_lua', flag:'devolveu_a_pedra'}},
    {texto:'Sentar na borda e esperar a noite.', vai:'c5_esperou_cratera'},
    {texto:'Descer pra dentro da caverna com ela.', vai:'c5_entrada'},
    {texto:'Descer a montanha e seguir viagem.', vai:'c5_entrada'}
  ]
},

c5_devolveu_pedra:{
  texto:[
    'Você põe a pedra exatamente onde estava. Ajeita duas vezes até ficar na posição certa, o que é ridículo e necessário.',
    'Depois apaga suas próprias pegadas na areia com a manga, andando de costas até a borda.',
    'Ninguém vai saber que você esteve aqui.',
    'Isso não muda nada no mundo. Muda alguma coisa em você, e você vai levar um tempo pra entender o quê.'
  ],
  ef:{moral:10, presagio:'Você aprendeu, numa cratera vazia, que existe fazer a coisa certa sem plateia.'},
  escolhas:[
    {texto:'Sentar na borda e esperar a noite.', vai:'c5_esperou_cratera'},
    {texto:'Descer pra dentro da caverna.', vai:'c5_entrada'}
  ]
},

c5_esperou_cratera:{
  texto:[
    'Você senta na borda da cratera, atrás de uma pedra, e espera.',
    'O dia inteiro. É a coisa mais chata que você já fez e você faz porque em algum lugar, no meio da noite, você decidiu que vale a pena.',
    'Às onze e quarenta da noite eles vêm.',
    'Clefairy. Trinta e dois — você conta, porque contar é a única coisa que dá pra fazer quando se está assistindo a uma coisa dessas.',
    'Eles entram na cratera em fila e param em círculo em volta da pedra. E ficam.',
    'Não tem dança, não tem canto, não tem nada do que as histórias dizem. Eles ficam parados em círculo olhando uma pedra por quarenta minutos, em silêncio, e a pedra fica azul.',
    'Depois eles vão embora em fila, pela mesma trilha.',
    'Foi a coisa mais bonita que você viu na vida e você não tem ideia nenhuma do que era.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Esperou um dia inteiro para ver e não atrapalhar'},
      flag:'viu_o_circulo', hp:-2, causa:'Um dia inteiro sem comer na cratera',
      registrar:'Viu trinta e dois Clefairy em círculo na cratera do Monte da Lua.'},
  escolhas:[
    {texto:'Contar pra Dra. Cordell.', vai:'c5_contou_ivone_cratera', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Não contar pra ninguém, nunca.', vai:'c5_entrada',
     ef:{flag:'guardou_o_segredo_da_cratera', rep:{eixo:'bom',delta:1,motivo:'Guardou um lugar em segredo para protegê-lo'}}},
    {texto:'Descer pra dentro da caverna.', vai:'c5_entrada'},
    {texto:'Pegar a pedra agora que eles foram.', vai:'c5_pegou_pedra'}
  ]
},

c5_contou_ivone_cratera:{
  texto:[
    'Você liga e conta.',
    'A Dra. Cordell fica calada tanto tempo que você acha que a ligação caiu.',
    '"Trinta e dois."',
    '"Trinta e dois."',
    '"Eu subi lá quatro vezes", ela diz. "Quatro. Nunca vi nada."',
    'Uma pausa longa.',
    '"Não me conta onde é." Ela fala firme. "Não escreve, não marca em mapa, não fala em telefone de Centro Pokémon. Se isso vira publicação, em dois meses tem gente com lanterna lá em cima."',
    '"Mas a senhora é cientista."',
    '"Eu sou cientista há vinte e dois anos", ela diz. "Isso é tempo suficiente pra aprender que nem tudo que dá pra saber precisa ser sabido."'
  ],
  ef:{flag:'segredo_com_ivone',
      npc:{nome:'Dra. Cordell', opiniao:6, memoria:'Você contou da cratera pra ela, e ela te pediu pra nunca escrever onde é.'},
      rep:{eixo:'bom',delta:2,motivo:'Confiou um segredo a quem sabia guardá-lo'}},
  escolhas:[
    {texto:'Descer pra dentro da caverna.', vai:'c5_entrada'}
  ]
},

c5_derrubou_escada:{
  texto:[
    'Você derruba a escada. Ela cai com um estrondo desproporcional e fica caída no chão de pedra, e a saliência lá em cima fica inalcançável.',
    'Você não sabe de quem era. Você não sabe pra quê era. Você derrubou porque parecia errada.',
    'Isso é um tipo de decisão que você vai tomar de novo, várias vezes, com coisas maiores que uma escada.'
  ],
  ef:{flag:'derrubou_a_escada'},
  escolhas:[
    {texto:'Entrar na caverna.', vai:'c5_entrada'},
    {texto:'Dar a volta por fora.', vai:'c5_fora'}
  ]
},

c5_entrada:{
  texto:[
    'Você entra.',
    'Três passos lá dentro e a sua respiração vira a coisa mais alta do mundo. A caverna engole o som de um jeito que você não estava preparad{o|a}: você fala uma palavra pra testar e a palavra não volta.',
    d=>{
      const l = (typeof Campo !== 'undefined') ? Campo.iluminar() : {pode:false};
      if (!l.pode) return 'A nove metros a luz do dia acaba. Você não tem luz nenhuma: anda com a mão na parede, contando os passos, com o pé tateando antes de pisar.';
      return l.semPilha
        ? `A nove metros a luz do dia acaba, e ${nomeExib(l.quem)} vira a única luz do mundo, um círculo pequeno em volta de vocês.`
        : 'A nove metros a luz do dia acaba. Você acende a lanterna e o cone dela parece minúsculo.';
    },
    d=>d.flags.carregando_ovos ? 'A caixa nos seus braços está quente e isso, aqui dentro, é a única coisa boa.' : '',
    'E aí você vê o cabo.',
    'Cabo elétrico no chão. Grosso, industrial, preso na parede com abraçadeira nova. Seguindo pra dentro.',
    'A Equipe Rocket acabou há dois anos. Red desmontou a organização, prenderam quem dava pra prender, e o resto virou notícia velha e piada de bar.',
    'Mas organização que acaba deixa gente. E gente precisa comer.'
  ],
  ef:{registrar:'Entrou no Monte da Lua e encontrou instalação elétrica recente.'},
  escolhas:[
    {texto:'Seguir o cabo.', vai:'c5_cabo'},
    {texto:'Ir pelo túnel lateral, evitando o cabo.', vai:'c5_desvio'},
    {texto:'Cortar o cabo aqui, na entrada.', vai:'c5_cortou_cabo'},
    {texto:'Subir. Tem passagem indo pra cima.', vai:'c5_subida'}
  ]
},

c5_cortou_cabo:{
  texto:[
    'Você não tem alicate. Você tem uma pedra e teimosia.',
    'Leva dezoito minutos e no fim você consegue: o cabo abre, solta um estalo seco e uma faísca que te joga sentad{o|a}, e lá dentro da caverna, muito longe, a luz que você nem sabia que existia apaga.',
    'O escuro que vem depois é absoluto por três segundos, até você lembrar da lanterna.',
    'E aí começam as vozes. Adultas. Bravas. Vindo de dentro, ecoando de um jeito que não dá pra saber a distância.'
  ],
  ef:{hp:-4, causa:'Choque ao cortar o cabo do Monte da Lua', flag:'cortou_o_cabo',
      registrar:'Cortou o cabo de energia da operação do Monte da Lua.',
      presagio:'Você acabou de anunciar sua chegada da maneira mais barulhenta possível.'},
  escolhas:[
    {texto:'Ir na direção das vozes.', vai:'c5_cabo'},
    {texto:'Se esconder e esperar eles passarem.', vai:'c5_escondeu'},
    {texto:'Sair correndo pra fora da caverna.', vai:'c5_saiu_correndo'},
    {texto:'Ir pelo túnel lateral.', vai:'c5_desvio'}
  ]
},

c5_escondeu:{
  texto:[
    'Você apaga a lanterna e se enfia atrás de uma coluna de rocha, e o escuro é tão completo que os seus olhos inventam formas.',
    'Duas pessoas passam com lanterna de cabeça, rápido, reclamando.',
    fala('o homem da lanterna', 'É o disjuntor. É sempre o disjuntor.'),
    fala('a mulher da lanterna', 'Não é o disjuntor, tá cortado. Olha aqui, ó. Cortado.'),
    'Silêncio. Uma das lanternas varre a caverna e passa a meio metro de você.',
    fala('a mulher da lanterna', 'Tem moleque aqui dentro.', 'baixo'),
    'E é isso: eles sabem, e não estão com medo, e agora você está numa caverna escura com duas pessoas que sabem.'
  ],
  ef:{flag:'sabem_que_voce_esta_aqui',
      presagio:'Eles não correram. Gente que não corre já viu isso acontecer antes.'},
  escolhas:[
    {texto:'Sair do esconderijo e encarar.', vai:'c5_cabo'},
    {texto:'Ir pro túnel lateral no escuro.', vai:'c5_desvio'},
    {texto:'Subir pela passagem de cima.', vai:'c5_subida'},
    {texto:'Correr pra fora.', vai:'c5_saiu_correndo'}
  ]
},

c5_saiu_correndo:{
  texto:[
    'Você corre pra fora e não é bonito.',
    'Tropeça duas vezes. Bate o ombro numa quina. Sai na luz do dia com o coração na garganta e senta na pedra de fora, respirando como quem correu muito mais do que correu.',
    'Ninguém vem atrás.',
    'Você fica sentad{o|a} lá fora por um tempo longo, com a boca preta da caverna a três metros, tentando decidir se você é covarde ou prudente, e a resposta honesta é que não dá pra saber a diferença de fora.'
  ],
  ef:{flag:'fugiu_da_caverna'},
  escolhas:[
    {texto:'Entrar de novo.', vai:'c5_entrada'},
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Contornar por fora e entrar por outro lugar.', vai:'c5_fora'},
    {texto:'Desistir. Ir embora pra Cerulean.', vai:'c5_desistiu'}
  ]
},

c5_desistiu:{
  texto:[
    'Você desce a trilha.',
    'A caverna atravessa a montanha e você não vai atravessar por dentro — vai dar a volta por fora, o que leva um dia e meio a mais e é completamente possível.',
    'Você faz o dia e meio.',
    'No segundo dia, no acostamento da estrada, uma van branca sem placa passa por você indo no sentido contrário, e o motorista não olha.'
  ],
  ef:{flag:['ignorou_operacao','viu_a_van'],
      registrar:'Deu a volta no Monte da Lua por fora e não entrou.',
      presagio:'Você contornou. O mundo não contorna.'},
  escolhas:[
    {texto:'Seguir para Cerulean.', vai:'c5_fim'}
  ]
},

c5_desvio:{
  texto:[
    'Você pega o túnel lateral, sem cabo, sem instalação, sem sinal de ninguém.',
    'É mais estreito. Em dois pontos você tem que passar de lado, com a mochila na mão.',
    'Leva uma hora e dez. Sua lanterna começa a amarelar no fim e você percebe que não trouxe pilha sobressalente, o que é o tipo de descoberta que só acontece dentro de uma montanha.',
    'E o túnel te devolve exatamente onde você não queria estar: numa passarela de metal, de grade, montada com parafuso na rocha, a seis metros acima de uma câmara iluminada.',
    'Não dava pra evitar. Só dava pra chegar por cima.'
  ],
  ef:{flag:'chegou_por_cima'},
  escolhas:[
    {texto:'Olhar para baixo.', vai:'c5_camara'},
    {texto:'Deitar na passarela e escutar antes de olhar.', vai:'c5_escutou_passarela'},
    {texto:'Voltar pelo túnel.', vai:'c5_entrada'},
    {texto:'Seguir a passarela sem olhar para baixo.', vai:'c5_passarela_frente'}
  ]
},

c5_escutou_passarela:{
  texto:[
    'Você deita de bruços na grade da passarela e fica escutando.',
    'Embaixo tem quatro vozes. Duas conversam sobre a chuva. Uma reclama do gerador. A quarta, mais longe, está contando em voz alta: "…quinze, dezesseis, dezessete."',
    'Aí uma das vozes diz, sem nenhuma emoção: "Esse aqui não vai chegar."',
    'E outra responde: "Põe no dezoito mesmo. Eles conferem por número, não por Pokémon."',
    'Você fica com o rosto na grade de metal por mais um minuto e meio sem se mexer.'
  ],
  ef:{flag:'conferem_por_numero',
      registrar:'"Eles conferem por número, não por Pokémon."',
      presagio:'Conferem por número. Em algum lugar tem uma planilha, e a planilha está certa.'},
  escolhas:[
    {texto:'Olhar para baixo.', vai:'c5_camara'},
    {texto:'Seguir a passarela sem olhar.', vai:'c5_passarela_frente'},
    {texto:'Voltar pelo túnel e sair da caverna.', vai:'c5_saiu_correndo'}
  ]
},

c5_passarela_frente:{
  texto:[
    'Você segue a passarela sem olhar pra baixo. Ela contorna a câmara e entra num túnel de serviço do outro lado.',
    'Lá tem um almoxarifado improvisado: prateleira de aço, caixa empilhada, um gerador a diesel de porte médio e latão de combustível.',
    'E, numa prateleira, uma pasta preta com elástico.',
    'Dentro da pasta: folha após folha de formulário. Cabeçalho com brasão. Uma balança.',
    'Cada folha tem um número no canto superior direito e os números são sequenciais, e o último é 1.184.'
  ],
  ef:{flag:['papel_com_brasao','viu_a_pasta'],
      registrar:'Encontrou uma pasta com 1.184 formulários numerados na câmara do Monte da Lua.',
      presagio:'Mil cento e oitenta e quatro. Isso não é um esquema. É um serviço em operação há muito tempo.'},
  escolhas:[
    {texto:'Levar a pasta inteira.', vai:'c5_levou_pasta',
     ef:{flag:'levou_a_pasta', rep:{eixo:'bom',delta:1,motivo:'Levou a contabilidade de uma operação'}}},
    {texto:'Levar só três folhas, das mais antigas.', vai:'c5_levou_folhas',
     ef:{flag:'guardou_a_folha'}},
    {texto:'Fotografar de cabeça e deixar tudo como está.', vai:'c5_memorizou_pasta'},
    {texto:'Olhar para baixo, pra câmara.', vai:'c5_camara'}
  ]
},

c5_levou_pasta:{
  texto:[
    'Você enfia a pasta inteira na mochila. Ela não cabe direito e você tem que tirar a jaqueta pra fechar.',
    'Dois minutos depois, embaixo, uma voz: "Cadê a pasta?"',
    'E outra: "Tava aí."',
    'E a primeira, com uma mudança de tom que congela você onde está: "Cadê a pasta?"',
    'A caverna inteira fica em silêncio. E aí começam a subir.'
  ],
  ef:{flag:'perseguido_na_caverna',
      presagio:'A pasta importava mais que as gaiolas. Você descobriu isso pelo tom de voz.'},
  escolhas:[
    {texto:'Correr pelo túnel lateral.', vai:'c5_fuga_tunel'},
    {texto:'Subir pela passagem de cima.', vai:'c5_subida'},
    {texto:'Encarar. Descer na câmara com a pasta na mão.', vai:'c5_camara'},
    {texto:'Esconder a pasta numa fresta e ir sem ela.', vai:'c5_escondeu_pasta'}
  ]
},

c5_escondeu_pasta:{
  texto:[
    'Você enfia a pasta numa fresta atrás de uma pedra solta e encaixa a pedra de volta.',
    'Depois anda pra frente, na passarela, com as mãos à mostra, deixando eles te encontrarem.',
    'Revistam sua mochila. Não acham nada. Um deles fica com a sua lanterna e um deles te empurra escada abaixo pelos últimos três degraus.',
    'Eles te botam pra fora da caverna com um chute simbólico e um aviso genérico.',
    'A pasta continua na fresta. Você sabe exatamente onde é.'
  ],
  ef:{hp:-5, causa:'Empurrado escada abaixo no Monte da Lua',
      flag:['escondeu_a_pasta','operacao_escapou'],
      registrar:'Escondeu a pasta numa fresta do Monte da Lua. Ainda está lá.',
      presagio:'Existe uma pasta com 1.184 números atrás de uma pedra solta numa passarela, e só você sabe.'},
  escolhas:[
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Voltar depois. Agora, seguir pra Cerulean.', vai:'c5_fim'},
    {texto:'Entrar de novo hoje mesmo.', vai:'c5_entrada'}
  ]
},

c5_fuga_tunel:{
  texto:[
    'Você corre pelo túnel lateral com uma lanterna amarelando e uma pasta que não deixa a mochila fechar.',
    'Passar de lado nos dois pontos estreitos custa tempo que você não tem, e você ouve eles atrás, e depois não ouve mais, e não saber é pior.',
    'Você sai na luz do dia uma hora e vinte depois, com o braço ralado do ombro ao cotovelo, e não para de andar por mais duas horas.',
    'Quando finalmente para, senta numa pedra e abre a pasta, e passa a tarde inteira lendo formulário.',
    'Não entende quase nada. Entende o suficiente pra saber que isso não vai poder ser esquecido.'
  ],
  ef:{hp:-4, causa:'Fuga pelo túnel do Monte da Lua',
      flag:['levou_a_pasta','papel_com_brasao'],
      rep:{eixo:'bom',delta:2,motivo:'Tirou a contabilidade de uma operação de dentro dela'},
      registrar:'Fugiu do Monte da Lua com a pasta de 1.184 formulários.'},
  escolhas:[
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_pasta_pra_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Seguir pra Cerulean com a pasta.', vai:'c5_fim'},
    {texto:'Voltar pra Pewter e entregar no museu.', vai:'c5_pasta_pra_ivone'}
  ]
},

c5_pasta_pra_ivone:{
  texto:[
    'A Dra. Cordell abre a pasta na mesa da bilheteria do museu e fica em pé, lendo, por quarenta minutos sem sentar.',
    'Varian traz café. Ela não toca.',
    'No fim ela fecha a pasta e põe as duas mãos em cima dela.',
    '"Isso aqui não pode ficar comigo."',
    '"Por quê?"',
    '"Porque eu sou uma paleontóloga demitida que já foi retirada de uma câmara municipal pela polícia." Ela fala com uma calma horrível. "Se isso aparece na minha mão, a história vira eu."',
    'Ela empurra a pasta de volta.',
    '"Isso tem que chegar em alguém com nome limpo e cargo. E eu não conheço ninguém assim."'
  ],
  ef:{flag:'pasta_recusada', npc:{nome:'Dra. Cordell', opiniao:4, memoria:'Leu a pasta em pé por quarenta minutos e devolveu, porque na mão dela a história viraria ela.'},
      registrar:'Cordell recusou ficar com a pasta. Precisa chegar em alguém com nome limpo e cargo.'},
  escolhas:[
    {texto:'Ficar com a pasta.', vai:'c5_fim'},
    {texto:'"E se eu virar esse alguém?"', vai:'c5_virar_alguem'},
    {texto:'Deixar a pasta no museu mesmo assim.', vai:'c5_deixou_pasta'}
  ]
},

c5_virar_alguem:{
  texto:[
    '"E se eu virar esse alguém?"',
    'A Dra. Cordell te olha por um tempo desconfortável.',
    '"Com o quê? Com insígnia?"',
    '"Com insígnia."',
    'Ela ri. Depois para de rir, porque a ideia é menos idiota do que ela gostaria.',
    '"Oito insígnias te dão credencial de Liga." Ela pensa em voz alta. "Credencial de Liga te dá legitimação pra pedir vista de processo administrativo. Você virava parte interessada."',
    'Ela bate na pasta com dois dedos.',
    '"É o plano mais lento e mais bobo que eu já ouvi. E é o único que eu ouvi."'
  ],
  ef:{flag:'plano_das_insignias',
      npc:{nome:'Dra. Cordell', opiniao:5, memoria:'Você propôs ganhar as oito insígnias pra ter legitimidade de pedir vista do processo. Ela chamou de bobo e não discordou.'},
      rep:{eixo:'bom',delta:1,motivo:'Encontrou um motivo maior para uma jornada comum'},
      registrar:'As oito insígnias deixaram de ser esporte: viraram credencial.',
      presagio:'A partir de hoje cada insígnia tem um segundo motivo, e o segundo motivo é o verdadeiro.'},
  escolhas:[
    {texto:'"Então guarda a pasta até lá."', vai:'c5_ivone_guarda'},
    {texto:'"Eu fico com a pasta."', vai:'c5_fim'},
    {texto:'Sair sem decidir nada.', vai:'c5_fim'}
  ]
},

c5_ivone_guarda:{
  texto:[
    '"Então guarda a pasta até lá."',
    'Ela pensa. Olha pro Varian, que está fingindo arrumar panfleto a quatro metros e escutando tudo.',
    '"Varian."',
    '"Doutora."',
    '"O senhor tem um lugar aqui onde nunca ninguém olha?"',
    'Varian pensa com uma seriedade cômica.',
    '"Tenho a reserva técnica." Ele coça a cabeça. "Tem caixa lá que não abre desde mil novecentos e oitenta e quatro."',
    'E é assim que a contabilidade de uma operação de tráfico de vida vai parar numa caixa de papelão da reserva técnica do museu de Pewter, entre um crânio de Rhyhorn e um mapa geológico desatualizado.'
  ],
  ef:{flag:'pasta_na_reserva', limpaFlag:'levou_a_pasta',
      npc:{nome:'Varian', opiniao:5, memoria:'Guardou a pasta na reserva técnica do museu, entre coisas que ninguém abre desde 1984.'},
      registrar:'A pasta está na reserva técnica do museu de Pewter, esperando as oito insígnias.',
      presagio:'Tem uma caixa em Pewter esperando você ter oito insígnias.'},
  escolhas:[
    {texto:'Voltar pra estrada.', vai:'c5_fim'}
  ]
},

c5_deixou_pasta:{
  texto:[
    'Você deixa a pasta em cima do balcão e sai antes que ela termine de discordar.',
    'Ela grita seu nome na porta do museu, na rua, o que é uma coisa que ela claramente nunca faz.',
    'Você não volta.',
    'Três dias depois, a pasta está numa caixa de papelão na reserva técnica do museu, porque a Dra. Cordell é do tipo que reclama e resolve.'
  ],
  ef:{flag:'pasta_na_reserva', limpaFlag:'levou_a_pasta',
      registrar:'Deixou a pasta com a Dra. Cordell à força.'},
  escolhas:[
    {texto:'Seguir pra Cerulean.', vai:'c5_fim'}
  ]
},

c5_levou_folhas:{
  texto:[
    'Você tira três folhas do fundo da pasta — as mais antigas, as de numeração baixa — e fecha o elástico de volta.',
    'A pasta continua na prateleira, com aparência idêntica.',
    'Isso é melhor do que levar tudo por um motivo simples: ninguém vai notar hoje.',
    'As três folhas vão dobradas em quatro no bolso interno da mochila.'
  ],
  ef:{flag:['guardou_a_folha','papel_com_brasao'],
      rep:{eixo:'bom',delta:1,motivo:'Tirou prova sem dar o alarme'},
      registrar:'Tirou três formulários antigos da pasta e deixou a pasta no lugar.',
      presagio:'Três folhas. Números baixos. As mais antigas são as que provam há quanto tempo isso existe.'},
  escolhas:[
    {texto:'Olhar para baixo, pra câmara.', vai:'c5_camara'},
    {texto:'Sair da caverna com o que tem.', vai:'c5_saiu_correndo'},
    {texto:'Subir pela passagem de cima.', vai:'c5_subida'}
  ]
},

c5_memorizou_pasta:{
  texto:[
    'Você não leva nada. Você lê.',
    'Vinte minutos deitado numa passarela de grade com uma lanterna amarelando, lendo formulário e repetindo na cabeça.',
    'O que fica: o brasão da balança. O número final, 1.184. A expressão "Art. 4º, III". E um campo que aparece em todas as folhas e que você não entende: "DESTINAÇÃO: CENTRAL — SAFFRON".',
    'Você põe a pasta de volta exatamente no ângulo em que estava.'
  ],
  ef:{flag:['papel_com_brasao','destinacao_saffron'],
      registrar:'Todas as guias do Monte da Lua têm destino: CENTRAL — SAFFRON.',
      presagio:'Central, Saffron. A cidade dos arranha-céus tem um endereço nisso tudo.'},
  escolhas:[
    {texto:'Olhar para baixo, pra câmara.', vai:'c5_camara'},
    {texto:'Voltar pelo túnel e sair.', vai:'c5_saiu_correndo'},
    {texto:'Subir pela passagem de cima.', vai:'c5_subida'}
  ]
},

c5_cabo:{
  texto:[
    'O cabo te leva por vinte minutos de caverna.',
    'Ele é uma companhia estranha: enquanto tem cabo no chão, tem outra pessoa no mundo. Você segue ele como quem segue um corrimão.',
    d=>{
      const l = (typeof Campo !== 'undefined') ? Campo.iluminar() : {pode:false};
      const luz = !l.pode ? 'já está enxergando de novo' : l.semPilha ? `já não precisa da luz ${pron(l.quem).do} ${nomeExib(l.quem)}` : 'já não precisa de lanterna';
      return `A caverna vai abrindo. O teto sobe. Em certo ponto você percebe que ${luz} e que não sabe há quanto tempo.`;
    },
    'Depois vira luz.',
    'Uma câmara natural, grande, com refletores de obra de canteiro montados nas paredes. Mesas de cavalete. Caixas plásticas azuis empilhadas com etiqueta.',
    'E gaiolas.'
  ],
  escolhas:[
    {texto:'Chegar mais perto.', vai:'c5_camara'},
    {texto:'Ficar na sombra e observar antes.', vai:'c5_observou_camara'},
    {texto:'Voltar e ir pelo túnel lateral.', vai:'c5_desvio'},
    {texto:'Voltar e sair da caverna.', vai:'c5_saiu_correndo'}
  ]
},

c5_observou_camara:{
  texto:[
    'Você fica na sombra, na boca do corredor, a uns trinta metros, e olha por vinte minutos.',
    'Aprende quatro coisas:',
    'Primeira: são cinco pessoas, não três. Duas estão sentadas fora do círculo de luz, fazendo pausa.',
    'Segunda: eles têm rotina. Alguém confere etiqueta, alguém empilha, alguém escreve numa prancheta.',
    'Terceira: um deles é o Roque. O caçador da floresta.',
    'Quarta: não tem arma nenhuma à vista, e isso é a coisa mais assustadora, porque quer dizer que eles não acham que precisam.'
  ],
  ef:{flag:'observou_a_camara',
      npc:{nome:'Caçador Roque', memoria:'Você o viu de novo, no Monte da Lua, trabalhando numa operação com cinco pessoas.'}},
  escolhas:[
    {texto:'Chegar mais perto.', vai:'c5_camara'},
    {texto:'Recuar e ligar pra Dra. Cordell.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Recuar e sair da caverna.', vai:'c5_saiu_correndo'},
    {texto:'Contornar pela passarela de cima.', vai:'c5_desvio'}
  ]
},

c5_camara:{
  texto:[
    'As gaiolas são pequenas demais. Isso é a primeira coisa e é a coisa que não sai.',
    'Clefairy em quase todas — cinco, seis por gaiola, em gaiolas de dois palmos. Um Paras numa sozinha, que não se mexe. Dois Zubat.',
    'Nas mesas de cavalete, fósseis. Meio expostos ainda na rocha, com etiqueta numerada e preço a lápis no canto. Kabuto. Omanyte. Coisas de trezentos milhões de anos com adesivo de leilão.',
    'Cinco pessoas trabalhando. Nenhuma de uniforme, nenhuma escondendo o rosto. O uniforme acabou junto com a organização; o trabalho não.',
    'Um deles é o Roque. O caçador da floresta. Ele levanta a cabeça e te reconhece, e o rosto dele faz uma coisa complicada que não é raiva nem medo.',
    '"Ah, não."',
    'Alguém na mesa do fundo chama por ele, Otto, e ele responde levantando a mão sem tirar os olhos de você. O Roque tem primeiro nome.'
  ],
  ef:{npc:{nome:'Caçador Roque', memoria:'Você o encontrou de novo no Monte da Lua, trabalhando com fósseis e gaiolas.'},
      registrar:'Encontrou a operação do Monte da Lua. Otto Roque, o caçador da floresta, está lá.'},
  escolhas:[
    {texto:'Atacar. Agora, antes que se organizem.', vai:'c5_ataque'},
    {texto:'Recuar e ligar para a Dra. Cordell.', vai:'c5_ligar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Descer e conversar. Eles precisam de gente.', vai:'c5_proposta'},
    {texto:'Perguntar, antes de qualquer coisa: "De quem é isso aqui?"', vai:'c5_de_quem_e'}
  ]
},

c5_de_quem_e:{
  texto:[
    '"De quem é isso aqui?"',
    'É a pergunta que ninguém nunca faz, e dá pra ver na cara dele.',
    'Otto limpa a mão no jeans e olha em volta — pras mesas, pros refletores, pras gaiolas — como se estivesse vendo tudo pela primeira vez.',
    '"Não é meu."',
    '"Eu sei que não é seu."',
    '"Eu recebo por semana." Ele encosta na mesa. "Vem um cara de terno de dois em dois meses, olha a planilha, assina, e vai embora. Ele nunca desceu aqui. Ele fica lá em cima, na entrada, com sapato limpo."',
    'Ele cospe no chão.',
    '"Eu já pensei nisso, sabe? Eu penso muito nisso. O sapato dele nunca suja."'
  ],
  ef:{flag:['sapato_limpo','gente_que_assina_papel'],
      registrar:'Um homem de terno visita o Monte da Lua a cada dois meses, assina a planilha e nunca desce.'},
  escolhas:[
    {texto:'"E se eu acabar com isso aqui hoje?"', vai:'c5_acabar_hoje'},
    {texto:'Atacar.', vai:'c5_ataque'},
    {texto:'Recuar e ligar pra Dra. Cordell.', vai:'c5_ligar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'"Me dá o nome do cara de terno."', vai:'c5_nome_do_terno'}
  ]
},

c5_nome_do_terno:{
  texto:[
    '"Me dá o nome do cara de terno."',
    'Otto ri sem nenhum humor.',
    '"Eu não sei o nome dele, {moleque|moleca}. Ele não se apresenta."',
    'Ele pensa um pouco.',
    '"Ele usa um crachá. Não é crachá de Liga, é outro. Tem uma balança desenhada." Ele faz o gesto no ar. "E embaixo tem escrito uma coisa em latim ou sei lá o quê."',
    '"O que tá escrito?"',
    '"Sei lá, eu não sei latim." Ele dá de ombros. "Tem uma palavra que parece custódia. Custodiam, alguma coisa assim."'
  ],
  ef:{flag:'palavra_custodia',
      registrar:'O crachá do homem de terno tem uma balança e uma palavra parecida com "custódia".',
      presagio:'Custódia. Uma palavra que parece cuidado e significa posse.'},
  escolhas:[
    {texto:'"E se eu acabar com isso aqui hoje?"', vai:'c5_acabar_hoje'},
    {texto:'Atacar.', vai:'c5_ataque'},
    {texto:'Recuar e ligar pra Dra. Cordell.', vai:'c5_ligar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Descer e conversar de verdade.', vai:'c5_proposta'}
  ]
},

c5_acabar_hoje:{
  texto:[
    '"E se eu acabar com isso aqui hoje?"',
    'Otto olha pra você com uma paciência de professor cansado.',
    '"Aí amanhã abre outra."',
    'Ele aponta as gaiolas.',
    '"Isso aqui não é o negócio, {garoto|garota}. Isso aqui é um ponto de coleta. Tem ponto de coleta na Rota 25, tem na Zona Safári, tem um que eu ouvi falar em Seafoam que é pesado."',
    'Ele bate na mesa de cavalete.',
    '"Isso aqui é uma mesa de cavalete e cinco pessoa ganhando por semana. Você acaba com isso, você acaba com uma mesa de cavalete."'
  ],
  ef:{flag:['mapa_dos_pontos','sabe_de_seafoam'],
      registrar:'Existem outros pontos de coleta: Rota 25, Zona Safári, e um em Seafoam.',
      presagio:'Rota 25. Zona Safári. Seafoam. Você acabou de ganhar um itinerário.'},
  escolhas:[
    {texto:'"Então me diz onde ficam os outros."', vai:'c5_onde_ficam'},
    {texto:'Acabar com essa mesa de cavalete mesmo assim.', vai:'c5_ataque'},
    {texto:'Recuar e ligar pra Dra. Cordell.', vai:'c5_ligar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Descer e conversar de verdade.', vai:'c5_proposta'}
  ]
},

c5_onde_ficam:{
  texto:[
    '"Então me diz onde ficam os outros."',
    'Otto olha pros colegas. Os colegas estão trabalhando e não estão prestando atenção, o que já diz muito sobre o quanto você os assusta.',
    '"Por que eu diria?"',
    'Você não tem resposta boa. Fica calad{o|a}.',
    'E o silêncio faz o trabalho, porque Otto continua:',
    '"A Rota 25 não é ponto de coleta nosso. É de um cara que envenena Pokémon de rua e vende o que sobra." Ele faz cara de nojo genuíno. "Isso eu acho errado. Eu tenho limite, {moleque|moleca}. Você não acredita, mas eu tenho."'
  ],
  ef:{flag:'sabe_do_envenenador', registrar:'Alguém envenena Pokémon de rua na Rota 25 e vende o que sobra.',
      npc:{nome:'Caçador Roque', opiniao:1, memoria:'Te contou do ponto da Rota 25 porque ele mesmo acha aquilo errado.'}},
  escolhas:[
    {texto:'Atacar. Limite ou não.', vai:'c5_ataque'},
    {texto:'Recuar e ligar pra Dra. Cordell.', vai:'c5_ligar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Descer e conversar de verdade.', vai:'c5_proposta'},
    {texto:'Sair. Você conseguiu o que precisava.', vai:'c5_fugir'}
  ]
},

c5_ataque:{
  texto:[
    '"Sério?" Otto nem parece bravo. Parece cansado. "Sério mesmo?"',
    'Os outros quatro param de trabalhar e ficam vendo, sem nenhuma intenção de ajudar, do jeito que colega de trabalho assiste a briga de colega de trabalho.',
    'Ele solta a Pokébola.'
  ],
  batalha:{dex:88, nivel:22, tipo:'treinador', treinador:'Otto', fuga:false,
           timeExtra:[{dex:42, nivel:24}],
           vitoria:'c5_venceu', derrota:'c5_perdeu', gameover:'gameover'}
},

c5_venceu:{
  texto:[
    'Os outros quatro pegam as mochilas e saem pelo túnel de serviço, sem correr, sem falar com você, do jeito de quem bate ponto.',
    'Otto fica, porque sair na frente de alguém que te venceu é pior do que apanhar.',
    '"Você acha que salvou eles." Ele aponta as gaiolas com o queixo, sentado no chão, com o Weezing recolhido. "Abre. Vai, abre. Metade não sai. Tão aqui há semanas."',
    'Você abre. Ele tem razão sobre a metade.',
    'Onze gaiolas. Onze fechaduras baratas. Quinze minutos de trabalho e algumas mordidas.',
    'Os que saem não vão longe: ficam na câmara, na beira do círculo de luz, sem saber pra onde.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Desmontou uma operação de tráfico no Monte da Lua'},
      itens:{'Ultra Ball':1,'Hyper Potion':1}, dinheiro:900,
      npc:{nome:'Caçador Roque', opiniao:-8, memoria:'Você destruiu a operação dele no Monte da Lua. Ele não esquece.'},
      flag:'destruiu_operacao', registrar:'Libertou os Pokémon do Monte da Lua e fez um inimigo permanente.'},
  escolhas:[
    {texto:'Carregar o Paras até o Centro Pokémon. São três horas.', vai:'c5_paras'},
    {texto:'Revistar as mesas antes de sair.', vai:'c5_papeis_mesa'},
    {texto:'Ficar até todos saírem da câmara, quanto tempo for.', vai:'c5_ficou_ate_o_fim'},
    {texto:'Ir embora. Você já fez o que dava.', vai:'c5_fim'}
  ]
},

c5_ficou_ate_o_fim:{
  texto:[
    'Você fica.',
    'Desliga os refletores um a um, porque alguém falou uma vez que Pokémon de caverna não gosta de luz forte e você não tem nenhuma fonte melhor.',
    'No escuro, com a sua lanterna apontada pro chão, eles começam a se mexer.',
    'Leva quatro horas. Quatro horas sentado imóvel num chão de pedra, de madrugada, ouvindo pé pequeno em rocha.',
    'No fim ficam três: dois que não conseguem andar e o Paras.',
    'Otto foi embora em algum momento dessas quatro horas e você não percebeu quando.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Ficou quatro horas no escuro esperando os últimos saírem'},
      hp:-4, causa:'Noite inteira na câmara do Monte da Lua',
      flag:'ficou_ate_o_fim', moral:12},
  escolhas:[
    {texto:'Carregar o Paras até o Centro Pokémon.', vai:'c5_paras'},
    {texto:'Carregar os três. De uma vez. Vai ser terrível.', vai:'c5_carregou_tres'},
    {texto:'Revistar as mesas antes de sair.', vai:'c5_papeis_mesa'},
    {texto:'Sair.', vai:'c5_fim'}
  ]
},

c5_carregou_tres:{
  texto:[
    'Você improvisa uma rede com a jaqueta e as alças da mochila e carrega os três.',
    'Não dá certo nos primeiros vinte minutos. Dá certo do trigésimo em diante, quando você para de tentar ser rápido.',
    'Quatro horas e dez até o Centro Pokémon de Pewter, descendo no escuro, com paradas.',
    'A enfermeira do plantão noturno abre a porta, olha a trouxa de jaqueta nos seus braços, e chama alguém sem dizer uma palavra.',
    'Dois sobrevivem. O Paras não.',
    'Ela te serve um chá e senta na cadeira de plástico do seu lado, e vocês dois ficam ali às cinco da manhã sem falar nada.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Carregou três Pokémon por quatro horas no escuro'},
      hp:-6, causa:'Exaustão na descida do Monte da Lua',
      flag:['carregou_paras','carregou_os_tres'],
      registrar:'Carregou três Pokémon por quatro horas até Pewter. Dois sobreviveram.',
      presagio:'Dois de três. Você está começando a colecionar essas frações.'},
  escolhas:[
    {texto:'Dormir. Só isso.', vai:'c5_fim'},
    {texto:'Voltar pra caverna assim que clarear.', vai:'c5_camara_vazia'}
  ]
},

c5_paras:{
  texto:[
    'Três horas e vinte. O Paras pesa mais do que parece e a caverna é toda subida até a boca.',
    'Ele não se mexe. Não reage. Você fala com ele o caminho inteiro, coisas idiotas, sobre a estrada, sobre o tempo, sobre Pallet.',
    'Ele morre na segunda hora. Você percebe — dá pra perceber, o peso muda — e continua carregando mesmo assim, porque largar ele no meio do caminho é pior do que qualquer coisa.',
    'A enfermeira do Centro pega ele das suas mãos com cuidado, mesmo sabendo. Depois te serve um chá e não pergunta nada.',
    'Você fica sentad{o|a} na cadeira de plástico do Centro Pokémon de Pewter até o dia clarear.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Carregou um Pokémon moribundo por três horas'},
      hp:-4, causa:'Exaustão no Monte da Lua',
      flag:'carregou_paras', registrar:'Carregou o Paras por três horas. Ele morreu no caminho.'},
  escolhas:[
    {texto:'Seguir.', vai:'c5_fim'},
    {texto:'Voltar pra caverna quando clarear.', vai:'c5_camara_vazia'}
  ]
},

c5_perdeu:{
  texto:[
    'Dessa vez ele não te deixa ir com um aviso.',
    'Você acorda do lado de fora da caverna, com o sol na cara e o gosto de ferro na boca. Sua mochila está do seu lado, revirada, com tudo ainda dentro.',
    'Eles não te mataram, e não roubaram você. Isso não é misericórdia — é logística. Corpo dá trabalho e roubo vira ocorrência.',
    'Quando você volta lá dentro, não tem mais nada. Nem cabo, nem mesa, nem gaiola, nem o gerador.',
    'Tem a marca de onde as coisas estavam. E, na parede dos fundos, o retângulo liso onde tiraram um fóssil com serra.',
    'Mudaram de lugar em uma noite. Isso quer dizer que já fizeram isso antes.'
  ],
  ef:{hp:-9, causa:'Espancado no Monte da Lua', dinheiro:-1000,
      flag:['operacao_escapou','viu_o_retangulo'], instabilidade:1,
      npc:{nome:'Caçador Roque', opiniao:-4, memoria:'Te derrubou no Monte da Lua e levou tudo embora numa noite.'},
      registrar:'Perdeu no Monte da Lua. A operação se mudou em uma noite e levou os Pokémon.',
      presagio:'Eles desmontaram em uma noite. Ninguém desmonta em uma noite na primeira vez.'},
  escolhas:[
    {texto:'Procurar por onde eles saíram.', vai:'c5_saida_secreta'},
    {texto:'Ligar pra Dra. Cordell e contar tudo.', vai:'c5_ligou_antes', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Subir. Tem uma parte da montanha que você não viu.', vai:'c5_subida'},
    {texto:'Seguir para Cerulean.', vai:'c5_fim'}
  ]
},

c5_ligar:{
  texto:[
    'Você recua. Devagar, de costas, até a curva, e depois rápido.',
    'Quatrocentos metros de caverna e mais quatrocentos de subida até o vale abrir e o telefone pegar.',
    'A Dra. Cordell atende no segundo toque, como quem dorme com o telefone na mão.',
    'Você fala. Ela não interrompe uma vez.',
    '"Fica longe", ela diz. "Eu levo gente de imprensa. Com a Liga eles somem antes; com câmera eles não somem."',
    'Ela chega em seis horas com quatro pessoas, dois carros e uma câmera de ombro. Você fica na entrada da caverna esse tempo todo, porque alguém tem que ficar olhando a boca do buraco.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Expôs o tráfico do Monte da Lua à imprensa'},
      npc:{nome:'Dra. Cordell', opiniao:6, memoria:'Você ligou pra ela do Monte da Lua. Ela nunca vai esquecer isso.'},
      flag:'expos_operacao', dinheiro:500,
      registrar:'Expôs a operação do Monte da Lua com a Dra. Cordell e a imprensa.'},
  escolhas:[
    {texto:'Entrar com eles.', vai:'c5_entrou_com_imprensa'},
    {texto:'Guardar a boca da caverna.', vai:'c5_guardou_saida'},
    {texto:'Ir na frente. Você conhece o caminho.', vai:'c5_entrou_com_imprensa', ef:{flag:'guiou_a_imprensa'}}
  ]
},

c5_proposta:{
  texto:[
    'Você desce fazendo barulho de propósito, com as mãos à mostra.',
    'Otto te reconhece e leva três segundos pra decidir o que você é. Depois ri.',
    '"Olha só quem cresceu." Ele limpa a mão no jeans e estende. "Eu preciso de gente que anda em rota e não chama atenção. Paga bem. Você nem precisa pegar em gaiola — só carrega e cala a boca."',
    'Os outros quatro voltaram a trabalhar. Isso é o mais perturbador: sua presença aqui já é normal.'
  ],
  escolhas:[
    {texto:'Apertar a mão.', vai:'c5_aceitou'},
    {texto:'Recusar e sair andando devagar.', vai:'c5_recusou_perto'},
    {texto:'Apertar a mão — e avisar a Dra. Cordell depois.', vai:'c5_duplo', cond:d=>!!d.flags.cartao_ivone},
    {texto:'"Antes disso: de quem é isso aqui?"', vai:'c5_de_quem_e'}
  ]
},

c5_aceitou:{
  texto:[
    'A mão dele é seca e firme. O acordo leva onze segundos.',
    'Você carrega duas caixas até um caminhão numa estrada de terra a quatro quilômetros da caverna. Não olha dentro. Isso é a parte importante: não olhar dentro.',
    'O dinheiro é bom. É bom de um jeito que assusta, porque você percebe na hora quanto tempo ia levar pra juntar isso ganhando batalha.',
    'No caminho de volta, sozinh{o|a}, você faz a conta. Quatro caixas por semana dá vinte e quatro mil por mês. Você faz essa conta três vezes.'
  ],
  ef:{dinheiro:4000, itens:{'Ultra Ball':2},
      rep:{eixo:'ruim',delta:3,motivo:'Trabalhou para traficantes de Pokémon'},
      npc:{nome:'Caçador Roque', opiniao:5, memoria:'Você trabalhou pra ele. Agora você é útil.'},
      flag:'trabalhou_rocket', moral:-15,
      registrar:'Passou a trabalhar para os remanescentes da Rocket.'},
  escolhas:[
    {texto:'Seguir para Cerulean com o dinheiro no bolso.', vai:'c5_fim'},
    {texto:'Voltar e abrir as gaiolas hoje à noite.', vai:'c5_traicao'},
    {texto:'Pedir pra ver a planilha.', vai:'c5_planilha'}
  ]
},

c5_planilha:{
  texto:[
    '"Deixa eu ver a planilha."',
    'Otto hesita meio segundo e decide que você é funcionário.',
    'A prancheta tem quatro folhas. Colunas: DATA, ESPÉCIE, QTD, DESTINO, GUIA Nº.',
    'A coluna DESTINO tem a mesma palavra em quase todas as linhas: CENTRAL.',
    'A coluna GUIA Nº chega a 1.184.',
    'E no rodapé de cada folha, um brasão pequeno. Uma balança.'
  ],
  ef:{flag:['papel_com_brasao','destinacao_saffron'],
      registrar:'Viu a planilha da operação: destino CENTRAL, guias até o número 1.184.',
      presagio:'Você está dentro. E de dentro dá pra ver a planilha.'},
  escolhas:[
    {texto:'Memorizar tudo e continuar trabalhando.', vai:'c5_fim', ef:{flag:'infiltrado'}},
    {texto:'Roubar uma folha.', vai:'c5_levou_folhas'},
    {texto:'Voltar à noite e abrir as gaiolas.', vai:'c5_traicao'},
    {texto:'Ligar pra Dra. Cordell hoje mesmo.', vai:'c5_duplo', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c5_traicao:{
  texto:[
    'Você volta às duas da manhã.',
    'Tem uma pessoa de plantão e ela está dormindo numa cadeira de praia, o que diz tudo sobre o quanto eles se sentem seguros.',
    'Você abre as onze gaiolas em silêncio, uma por uma, com as mãos tremendo de um jeito que te irrita.',
    'Metade não sai. Você já sabia que metade não ia sair e mesmo assim doeu.',
    'Na saída, você olha pra trás uma vez, e a pessoa da cadeira de praia está acordada, olhando você, sem levantar.',
    'Ela não levanta. Ela não grita. Ela só olha, e você vai embora, e nunca vai saber o que aquilo significou.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Voltou de madrugada e abriu as gaiolas que tinha ajudado a carregar'},
      flag:['destruiu_operacao','traiu_vasco'],
      npc:{nome:'Caçador Roque', opiniao:-10, memoria:'Você trabalhou pra ele e voltou de madrugada pra abrir as gaiolas. Ele considera isso pior que inimizade.'},
      registrar:'Voltou de madrugada e libertou os Pokémon depois de ter trabalhado para eles.'},
  escolhas:[
    {texto:'Seguir para Cerulean.', vai:'c5_fim'},
    {texto:'Carregar o Paras até o Centro.', vai:'c5_paras'}
  ]
},

c5_duplo:{
  texto:[
    'Você aperta a mão. Carrega as caixas. Pega o dinheiro.',
    'E liga para a Dra. Cordell da beira da estrada, com o caminhão ainda visível na curva.',
    'Ela ouve tudo em silêncio. Depois: "Você carregou as caixas."',
    '"Carreguei."',
    '"Tá." Ela desliga.',
    'Ela usa a informação. Chega em cinco horas com a imprensa e monta tudo do jeito certo.',
    'Ela não te agradece. Não te cumprimenta. Quando os dois se cruzam na trilha, ela desvia o olhar, e isso custa mais caro do que uma bronca.'
  ],
  ef:{dinheiro:4000, rep:{eixo:'ruim',delta:1,motivo:'Carregou carga de traficantes'},
      npc:{nome:'Dra. Cordell', opiniao:-2, memoria:'Você entregou o esquema, mas só depois de receber por ele. Ela desviou o olhar na trilha.'},
      flag:['trabalhou_rocket','delatou_rocket','expos_operacao'],
      registrar:'Trabalhou para os traficantes e entregou a rota depois.'},
  escolhas:[
    {texto:'Ir atrás dela e falar.', vai:'c5_falou_com_ivone'},
    {texto:'Seguir para Cerulean.', vai:'c5_fim'}
  ]
},

c5_falou_com_ivone:{
  texto:[
    'Você alcança ela no carro.',
    '"Eu peguei o dinheiro porque eu precisava entrar."',
    'Ela fecha a porta do carro e abaixa o vidro só pela metade.',
    '"Eu sei." Ela fala sem raiva. "Essa é a justificativa boa. Eu te avisei sobre a justificativa boa."',
    'Uma pausa.',
    '"E o pior é que ela pode até ser verdade." Ela liga o carro. "Nunca dá pra saber por dentro, {moço|moça}. Só dá pra saber pelo que a gente faz depois."'
  ],
  ef:{npc:{nome:'Dra. Cordell', opiniao:2, memoria:'Você foi atrás dela explicar. Ela disse que só dá pra saber pelo que se faz depois.'},
      flag:'so_pelo_que_vem_depois'},
  escolhas:[
    {texto:'Seguir para Cerulean.', vai:'c5_fim'},
    {texto:'Voltar de madrugada e abrir as gaiolas.', vai:'c5_traicao'}
  ]
},

c5_recusou_perto:{
  texto:[
    '"Não."',
    'O silêncio na câmara dura tempo demais. Um dos outros quatro coloca a mão no cinto, não numa arma — numa Pokébola.',
    'Otto levanta a palma. "Deixa."',
    'Pra você: "Você entrou aqui e viu tudo. Agora sobe essa passarela devagar e esquece o caminho."',
    'Você sobe. Devagar. Ele te olha o percurso inteiro, sem piscar, e continua olhando quando você some na curva — dá pra sentir.'
  ],
  ef:{flag:'recusou_rocket', npc:{nome:'Caçador Roque', opiniao:-3, memoria:'Você recusou a proposta dele na cara dele.'},
      registrar:'Recusou trabalhar para os traficantes.'},
  escolhas:[
    {texto:'Voltar depois com um plano — e atacar.', vai:'c5_ataque'},
    {texto:'Ligar pra Dra. Cordell assim que pegar sinal.', vai:'c5_ligar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Subir pela passagem de cima e ver o resto da montanha.', vai:'c5_subida'},
    {texto:'Ir embora de verdade.', vai:'c5_fim'}
  ]
},

c5_fugir:{
  texto:[
    'Você sai. Não faz barulho, não corre, não olha pra trás.',
    'Do lado de fora o ar é frio e você percebe que estava suando.',
    'Você não fez nada de errado.',
    'Você não fez nada.'
  ],
  ef:{flag:'ignorou_operacao', registrar:'Saiu do Monte da Lua sem fazer nada.',
      presagio:'"Eu não fiz nada de errado" e "eu não fiz nada" são a mesma frase com uma palavra a menos.'},
  escolhas:[
    {texto:'Voltar. Você não consegue.', vai:'c5_camara'},
    {texto:'Ligar pra Dra. Cordell.', vai:'c5_ligar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Subir pra ver o resto da montanha.', vai:'c5_subida'},
    {texto:'Seguir para Cerulean.', vai:'c5_fim'}
  ]
},

/* ─────────────── O ALTO ─────────────── */

c5_subida:{
  texto:[
    'Tem uma passagem indo pra cima. Não é trilha, é uma série de degraus naturais na rocha, íngreme, com um fiapo de corrente de ar descendo.',
    'Você sobe por quarenta minutos e o ar vai ficando mais fresco.',
    'No fim, a passagem desemboca numa abertura no teto e você sai da caverna sem sair da montanha: está numa cratera rasa de uns oitenta metros, com fundo de areia cinza fina, e o céu aberto em cima.',
    'No meio, uma pedra do tamanho de uma cabeça.',
    'Em volta dela, trinta marcas de pé pequenas em círculo.'
  ],
  ef:{flag:'achou_a_cratera', registrar:'Encontrou a cratera do topo do Monte da Lua por dentro.',
      presagio:'Você subiu por dentro de uma montanha e saiu num lugar que ninguém te falou que existia.'},
  escolhas:[
    {texto:'Pegar a pedra.', vai:'c5_pegou_pedra'},
    {texto:'Sentar na borda e esperar.', vai:'c5_esperou_cratera'},
    {texto:'Voltar pra baixo sem encostar em nada.', vai:'c5_fim'},
    {texto:'Apagar as próprias pegadas e ir embora.', vai:'c5_fim',
     ef:{flag:'guardou_o_segredo_da_cratera', rep:{eixo:'bom',delta:1,motivo:'Saiu de um lugar sem deixar rastro'}}}
  ]
},

c5_fim:{
  texto:[
    'A saída norte do Monte da Lua dá numa descida verde, e a mudança é violenta: você passa de pedra cinza pra capim alto em duzentos metros.',
    'Cerulean aparece embaixo com o rio cortando a cidade em dois e três pontes ligando as duas metades.',
    'É bonito. É genuinamente bonito, e você fica com raiva de achar bonito.',
    d=>{
      if (d.flags.trabalhou_rocket) return 'O dinheiro no bolso pesa exatamente como dinheiro. É esse o problema.';
      if (d.flags.ignorou_operacao) return 'Você pensa nas gaiolas a cada dez minutos, mais ou menos. Depois a cada vinte. Você repara em quando o intervalo aumenta.';
      if (d.flags.levou_a_pasta) return 'A mochila não fecha direito por causa da pasta. A cada vinte passos você confere se ela ainda está lá.';
      if (d.flags.viu_o_circulo) return 'Você continua vendo trinta e dois Clefairy parados em círculo toda vez que fecha os olhos, e não é assustador, é a outra coisa.';
      return 'Você pensa nas gaiolas. Vai pensar por um tempo.';
    },
    d=>d.flags.ponto_da_van
      ? 'E tem uma coisa marcada na sua cabeça: sexta, cinco da manhã, estrada velha de Cerulean, depois da segunda ponte.'
      : 'Cerulean tem mercado, ponte e gente. Você não sabe mais o que esperar de nada.'
  ],
  fim:true, resumo:'O Monte da Lua: a Rocket acabou, mas as pessoas continuaram — e agora alguém assina papel.'
}
}}

);
