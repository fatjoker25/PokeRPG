/* ============================================================
   CAPÍTULO 9 — A CIDADE QUE COMPRA  (Celadon)
   ============================================================ */
CAPITULOS.push(

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 9 — A CIDADE QUE COMPRA
   PONTO DE VIRADA: aqui a sua rota é definida.
   ══════════════════════════════════════════════════════════ */
{
num:9, titulo:'A Cidade que Compra', local:'Celadon', ambiente:'cidade', nivelArea:32,
tom:'muito sombrio', inicio:'c9_chegada',
proximo:d=>{
  // a rota escolhida aqui muda o que vem depois
  if (d.via === 'foragido') return 10;
  return 10;
},
cenas:{

c9_chegada:{
  texto:[
    'Celadon é a maior cidade de Kanto e a única que não finge ser outra coisa.',
    'O shopping tem sete andares. O cassino tem três. A diferença entre os dois é menos clara do que deveria.',
    d=>{
      const r = Estado.nomeRep();
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=5) return `Numa banca de jornal, seu nome aparece num canto de página três. "${r}", diz alguém no ponto de ônibus, apontando com o queixo. Não é elogio nem ofensa. É só constatação.`;
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) return 'Um guarda de shopping fala no rádio quando você entra. Ele te segue a quinze metros pelo térreo inteiro.';
      return 'Cidade grande tem essa gentileza: ninguém tem tempo de saber quem você é.';
    },
    d=>d.flags.roubou_a_caixa ? 'E em algum lugar desta cidade tem um homem de terno claro contando uma caixa de veludo que está faltando.' :
       d.flags.sabe_da_terceira ? 'Em algum lugar desta cidade, às 23h, alguém chamado "a Terceira" vai receber três caminhões.' :
       'Três caminhões de Vermilion descarregaram aqui hoje de manhã. Você não sabe onde.'
  ],
  ef:{registrar:'Chegou a Celadon.'},
  escolhas:[
    {texto:'Ir ao endereço do cartão. (depois das 23h)', vai:'c9_endereco', cond:d=>!!d.flags.cartao_celadon},
    {texto:'Procurar os caminhões. Alguém viu onde descarregaram.', vai:'c9_procurar'},
    {texto:'Ir ao cassino. Tudo em Celadon passa pelo cassino.', vai:'c9_cassino'},
    {texto:'Ligar para a Dra. Ivone.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Entregar o que você tem à Liga Pokémon.', vai:'c9_liga_celadon',
     cond:d=>!!(d.flags.provas_navio||d.flags.caderno_do_trafico)}
  ]
},

c9_procurar:{
  texto:['Você passa a tarde perguntando. Em cidade grande, perguntar é um esporte de risco.'],
  teste:{status:'percepcao', dificuldade:7, nomeStatus:'Percepção',
         critico:'c9_achou_deposito', sucesso:'c9_achou_deposito', parcial:'c9_achou_meio', falha:'c9_perdido'}
},

c9_achou_deposito:{
  texto:[
    'Um entregador de gás te dá em três minutos o que a sua tarde inteira não deu: o depósito atrás do cassino, rua de serviço, portão azul.',
    '"Chega caminhão de madrugada e sai de madrugada. Todo mês." Ele dá de ombros. "Ninguém pergunta porque paga bem não perguntar."'
  ],
  ef:{flag:'sabe_do_deposito'},
  escolhas:[{texto:'Ir ao depósito.', vai:'c9_deposito'}]
},

c9_achou_meio:{
  texto:[
    'Você descobre a região — atrás do cassino, na zona de serviço — mas não o prédio.',
    'E descobre também que perguntar demais em Celadon faz alguém perguntar de volta.',
    'Um homem que você nunca viu pergunta o seu nome num ponto de ônibus. Você não responde. Ele anota alguma coisa mesmo assim.'
  ],
  ef:{flag:['sabe_da_zona','foi_notado_celadon']},
  escolhas:[
    {texto:'Procurar mais.', vai:'c9_deposito'},
    {texto:'Recuar e ir ao cassino.', vai:'c9_cassino'}
  ]
},

c9_perdido:{
  texto:[
    'Você passa seis horas andando e não descobre nada.',
    'Descobre uma coisa, na verdade: que as pessoas em Celadon respondem muito rápido, muito educadamente, e sem dizer absolutamente nada.',
    'À noite, um bilhete aparece embaixo da porta do seu quarto no Centro Pokémon.',
    '"Para de perguntar. Isso é um favor. O próximo não é."'
  ],
  ef:{flag:'ameacado_celadon', rep:{eixo:'ruim',delta:0,motivo:''},
      registrar:'Recebeu uma ameaça escrita em Celadon.'},
  escolhas:[
    {texto:'Ignorar o bilhete e continuar.', vai:'c9_cassino', ef:{flag:'ignorou_ameaca'}},
    {texto:'Parar. Tem hora de parar.', vai:'c9_desistiu'}
  ]
},

c9_desistiu:{
  texto:[
    'Você para. Não é covardia — é aritmética: você tem quinze anos e eles têm uma cidade.',
    'Você fica três dias em Celadon fazendo coisa nenhuma. Treina no parque. Compra roupa nova. Dorme.',
    'No terceiro dia, na primeira página do jornal de Celadon: um depósito na zona de serviço pegou fogo. Sem vítimas humanas.',
    '"Sem vítimas humanas" é uma expressão que você vai ouvir de forma diferente pelo resto da vida.'
  ],
  ef:{flag:'recuou_celadon', instabilidade:1,
      rep:{eixo:'ruim',delta:1,motivo:'Recuou quando tinha informação e podia agir'},
      registrar:'Recuou em Celadon. O depósito queimou com a carga dentro.'},
  escolhas:[{texto:'Seguir viagem.', vai:'c9_fim'}]
},

c9_cassino:{
  texto:[
    'O Rocket Game Corner mudou de nome duas vezes desde que a Rocket caiu. Agora se chama "Celadon Palace" e tem a mesma carpete.',
    'Todo mundo aqui sabe de tudo e não fala nada, de graça.',
    'A gerente do salão é uma mulher de uns quarenta anos que anda pelo cassino como se fosse a sala da casa dela. Porque é.',
    'Ela para na sua frente antes de você decidir se quer falar com ela.',
    '"Você é o de Pewter." Ela acende um cigarro dentro de um lugar onde não se pode fumar. "Ou o do Monte da Lua. As histórias se misturam."'
  ],
  ef:{npc:{nome:'A Terceira', opiniao:0, memoria:'Te abordou no cassino de Celadon antes de você abordá-la.'},
      flag:'conheceu_terceira', registrar:'Conheceu a mulher que comanda o esquema de Celadon.'},
  escolhas:[
    {texto:'"Você é a Terceira."', vai:'c9_terceira_sim', cond:d=>!!d.flags.sabe_da_terceira},
    {texto:'"Quem é você?"', vai:'c9_quem_terceira'},
    {texto:'Atacar. Sem conversa.', vai:'c9_ataque_cedo'},
    {texto:'Sair do cassino.', vai:'c9_chegada'}
  ]
},

c9_quem_terceira:{
  texto:[
    '"Terceira." Ela solta a fumaça pro lado. "Não é apelido de origem interessante. Giovanni era o primeiro. O segundo durou nove meses."',
    '"Eu sou a terceira. E, diferente dos dois, eu não quero Kanto. Kanto dá muito trabalho."',
    '"Eu quero logística."'
  ],
  ef:{flag:'sabe_da_terceira'},
  escolhas:[
    {texto:'Ouvir o resto.', vai:'c9_proposta_terceira'},
    {texto:'Atacar.', vai:'c9_ataque_cedo'}
  ]
},

c9_terceira_sim:{
  texto:[
    'Ela não nega, não confirma, não muda de expressão.',
    '"Você andou lendo caderno dos outros." A brasa do cigarro sobe. "Isso é educação ruim e instinto bom."',
    '"Senta. Eu explico o negócio inteiro pra você em quatro minutos, porque gente informada toma decisão melhor, e eu prefiro gente que decidiu a gente que obedeceu."'
  ],
  escolhas:[{texto:'Sentar.', vai:'c9_proposta_terceira'}]
},

c9_proposta_terceira:{
  texto:[
    '"A Rocket caiu porque queria governar. Governo é caro."',
    '"O que sobrou é isso aqui: uma rede de distribuição. Pokémon sai de rota e chega em coleção particular. Fóssil sai de caverna e chega em leilão. Ninguém morre, ninguém apanha, ninguém faz discurso."',
    '"Isso é crime? É. Isso é pior que o que a Liga faz quando confisca um bicho e deixa ele três anos num depósito legalizado? Não."',
    'Ela apaga o cigarro numa xícara.',
    d=>{
      if (d.flags.trabalhou_rocket) return '"E você já carregou caixa pra mim uma vez, no Monte da Lua. Você só não sabia que era pra mim."';
      if (d.flags.destruiu_operacao || d.flags.expos_operacao) return '"E você já me custou uma operação inteira no Monte da Lua. Eu sei quem você é. Estou falando com você mesmo assim — isso devia te dizer alguma coisa."';
      return '"E você chegou até aqui sozinho, com quinze anos. Isso é currículo."';
    },
    '"Eu tenho três coisas pra te oferecer. Escolhe uma, ou escolhe nenhuma e a gente se despede sem drama."'
  ],
  escolhas:[
    {texto:'"Trabalhar pra você." — dinheiro, rotas, proteção.', vai:'c9_via_mercenario'},
    {texto:'"Nada. Eu vim acabar com isso." — e sair para atacar o depósito.', vai:'c9_via_heroi'},
    {texto:'"Me dá tudo. Eu quero o lugar." — a rede inteira.', vai:'c9_via_foragido'},
    {texto:'"Só quero entender." — perguntar, anotar, não escolher lado.', vai:'c9_via_pesquisador'},
    {texto:'Levantar e ir embora sem responder.', vai:'c9_neutro'}
  ]
},

/* ---------------- AS QUATRO ROTAS ---------------- */

c9_via_mercenario:{
  texto:[
    'Ela não comemora. Empurra um envelope pela mesa como quem paga uma conta.',
    '"Regra única: você não pergunta o que tem na caixa, e eu não pergunto o que você faz com o dinheiro."',
    '"Você vai carregar em rota, porque treinador em rota é invisível. Você vai ter proteção nas cidades. E se a Liga te parar, você me liga antes de abrir a boca."',
    'O envelope é grosso. O primeiro sempre é.'
  ],
  ef:{dinheiro:12000, itens:{'Ultra Ball':3,'Hyper Potion':3,'Full Heal':2},
      rep:{eixo:'ruim',delta:3,motivo:'Entrou para a rede de tráfico de Celadon'},
      flag:['via_definida','trabalha_para_terceira'], moral:-20,
      npc:{nome:'A Terceira', opiniao:5, memoria:'Você trabalha para ela desde Celadon.'},
      executar:d=>{ Historia.definirVia('mercenario','entrou para a rede da Terceira'); return [{tipo:'mundo', texto:'ROTA: Mercenário. Cidades vão te tratar como alguém que se resolve com dinheiro.'}]; },
      registrar:'Entrou para a rede da Terceira como transportador.'},
  escolhas:[{texto:'Guardar o envelope.', vai:'c9_fim'}]
},

c9_via_heroi:{
  texto:[
    '"Eu vim acabar com isso."',
    'Ela ouve a frase inteira sem interromper. Depois faz uma coisa que você não esperava: ela diz onde é.',
    '"Zona de serviço, portão azul, atrás daqui. Vai hoje, porque amanhã de manhã descarrega e eu não vou poder te prometer nada."',
    '"Eu não vou te ajudar. Mas eu não vou te esconder o endereço, porque se você morrer num beco procurando, isso dá mais problema pra mim do que o depósito inteiro."',
    'Ela acende outro cigarro. "Boa sorte. Sério."'
  ],
  ef:{flag:['via_definida','sabe_do_deposito','terceira_te_respeita'],
      rep:{eixo:'bom',delta:2,motivo:'Recusou a rede de Celadon na cara da chefe'},
      npc:{nome:'A Terceira', opiniao:1, memoria:'Você recusou o emprego e ela te deu o endereço mesmo assim.'},
      executar:d=>{ Historia.definirVia('heroi','recusou a rede e foi atrás do depósito'); return [{tipo:'mundo', texto:'ROTA: Herói. As pessoas vão passar a esperar que você apareça quando tudo der errado.'}]; }},
  escolhas:[{texto:'Ir ao depósito.', vai:'c9_deposito'}]
},

c9_via_foragido:{
  texto:[
    '"Me dá tudo. Eu quero o lugar."',
    'O cassino continua barulhento em volta de vocês dois. Ela não pisca.',
    '"Você tem quinze anos."',
    '"E você tem uma rede que sobreviveu à queda da Rocket porque é pequena. Pequena demais pra uma pessoa só defender."',
    'Silêncio. Ela apaga o cigarro.',
    '"Certo." Ela se levanta. "Aqui é como funciona: eu não entrego nada. Você toma. Se você tomar, é seu — e todo mundo que trabalha pra mim vai trabalhar pra você amanhã, porque ninguém aqui é leal, todo mundo aqui é pago."',
    '"O depósito é atrás daqui. Portão azul. Vai lá tomar."'
  ],
  ef:{flag:['via_definida','sabe_do_deposito','quer_a_rede'],
      rep:{eixo:'ruim',delta:2,motivo:'Anunciou que vai tomar uma rede criminosa para si'},
      npc:{nome:'A Terceira', opiniao:-2, memoria:'Você disse, na cara dela, que queria o lugar dela.'},
      executar:d=>{ Historia.definirVia('foragido','anunciou que quer a rede'); return [{tipo:'mundo', texto:'ROTA: Foragido. Você não vai ser tratado como treinador de novo.'}]; }},
  escolhas:[{texto:'Ir ao depósito.', vai:'c9_deposito'}]
},

c9_via_pesquisador:{
  texto:[
    '"Só quero entender."',
    'Ela ri — de verdade, curto, surpresa. "Essa é nova."',
    '"Então entende: nada disso funcionaria se não tivesse comprador. Você acha que eu sou o problema? Eu sou o meio de campo."',
    '"O problema é um senhor de Saffron que quer um Kabutops na sala porque o vizinho tem. O problema é uma empresa que precisa de material biológico e não quer assinar formulário."',
    'Ela escreve dois endereços num guardanapo. Um é o depósito. O outro é um prédio em Saffron.',
    '"Vai nos dois. Depois volta aqui e me diz qual dos dois te assustou mais. Eu tenho uma aposta comigo mesma."'
  ],
  ef:{flag:['via_definida','sabe_do_deposito','sabe_da_silph','guardanapo_terceira'],
      rep:{eixo:'bom',delta:1,motivo:'Escolheu entender antes de julgar'},
      npc:{nome:'A Terceira', opiniao:3, memoria:'Você disse que só queria entender. Ela achou isso interessante demais para mentir.'},
      executar:d=>{ Historia.definirVia('pesquisador','escolheu entender a rede inteira'); return [{tipo:'mundo', texto:'ROTA: Pesquisador. Você vai enxergar coisas que os outros caminhos não mostram — e vai demorar mais para agir.'}]; },
      registrar:'Escolheu investigar em vez de escolher lado.'},
  escolhas:[
    {texto:'Ir ao depósito primeiro.', vai:'c9_deposito'},
    {texto:'Ir direto para Saffron.', vai:'c9_fim', ef:{flag:'pulou_deposito'}}
  ]
},

c9_neutro:{
  texto:[
    'Você levanta e vai embora no meio da frase dela.',
    'Ela não te impede. Não manda ninguém atrás. Só volta a andar pelo cassino como se a conversa nunca tivesse acontecido.',
    'Isso te incomoda mais do que ameaça incomodaria.'
  ],
  ef:{flag:'recusou_terceira', npc:{nome:'A Terceira', opiniao:0, memoria:'Você saiu no meio da conversa dela. Ela achou isso pouco interessante.'}},
  escolhas:[
    {texto:'Procurar o depósito por conta própria.', vai:'c9_procurar'},
    {texto:'Sair de Celadon.', vai:'c9_fim'}
  ]
},

c9_ataque_cedo:{
  texto:[
    'Você saca uma bola no meio do cassino.',
    'Três seguranças estão em cima de você antes da bola abrir. A mulher nem se mexe.',
    '"Aqui não", ela diz, sem irritação. "Tem câmera, tem cliente, tem seguro. Lá fora eu não me importo."',
    'Eles te levam pela porta de serviço e te deixam no beco. Sem violência — o que é assustador de um jeito próprio.'
  ],
  ef:{hp:-3, causa:'Expulso do cassino de Celadon', flag:'atacou_no_cassino',
      npc:{nome:'A Terceira', opiniao:-3, memoria:'Você sacou uma bola no salão dela. Ela te achou desorganizado.'}},
  escolhas:[
    {texto:'Procurar o depósito.', vai:'c9_procurar'},
    {texto:'Voltar e conversar direito.', vai:'c9_cassino'}
  ]
},

/* ---------------- O DEPÓSITO ---------------- */

c9_deposito:{
  texto:[
    'Zona de serviço, 23h40. Portão azul, sem placa, com câmera nova.',
    'Dá pra ouvir de fora: motor de gerador, e por baixo dele um som contínuo que não é máquina.',
    d=>Historia.via()==='foragido' ? 'Você não veio fechar isso. Você veio pegar isso. É uma diferença que muda tudo o que você vai fazer nos próximos vinte minutos.' :
       Historia.via()==='pesquisador' ? 'Você veio ver. Se você só ver, vai ter que viver com isso. Se você agir, vai perder o que ainda não entendeu.' :
       'São quatro pessoas lá dentro, no mínimo. Você é um.'
  ],
  escolhas:[
    {texto:'Entrar pela frente. Sem plano.', vai:'c9_frente'},
    {texto:'Procurar outra entrada.', vai:'c9_lateral'},
    {texto:'Esperar o caminhão chegar e entrar junto com a carga.', vai:'c9_caminhao'},
    {texto:'Chamar a Liga agora e esperar.', vai:'c9_liga_deposito'},
    {texto:'Ir embora.', vai:'c9_fim', ef:{flag:'desistiu_deposito', rep:{eixo:'ruim',delta:1,motivo:'Chegou até a porta e voltou'}}}
  ]
},

c9_lateral:{
  texto:['Você dá a volta no quarteirão procurando um jeito que não seja o portão azul.'],
  teste:{status:'percepcao', dificuldade:7, nomeStatus:'Percepção',
         critico:'c9_dentro_limpo', sucesso:'c9_dentro_limpo', parcial:'c9_dentro_visto', falha:'c9_frente'}
},

c9_caminhao:{
  texto:['O caminhão chega às 23h58. Você tem quatro segundos entre o portão abrir e o farol varrer a rua.'],
  teste:{status:'sorte', dificuldade:7, nomeStatus:'Sorte',
         critico:'c9_dentro_limpo', sucesso:'c9_dentro_limpo', parcial:'c9_dentro_visto', falha:'c9_dentro_visto'}
},

c9_dentro_limpo:{
  texto:[
    'Você entra sem ninguém ver.',
    'O depósito é maior por dentro. Prateleira industrial, empilhadeira, e no fundo — a parte que importa — três fileiras de gaiola em estrutura de aço, do chão ao teto.',
    'Quarenta e uma gaiolas. Você conta duas vezes porque não acredita na primeira.',
    'Numa mesa perto da porta: pranchetas com número de série, uma caixa de Poké Balls vazias e um livro de destino. Metade dos destinos é fora de Kanto.'
  ],
  ef:{flag:['dentro_do_deposito','contou_gaiolas'], registrar:'Entrou no depósito de Celadon. Quarenta e uma gaiolas.'},
  escolhas:[
    {texto:'Abrir todas as gaiolas de uma vez.', vai:'c9_abriu_tudo'},
    {texto:'Fotografar tudo e sair sem tocar em nada.', vai:'c9_documentou'},
    {texto:'Pegar o livro de destinos e sair.', vai:'c9_livro'},
    {texto:'Cortar a energia do prédio primeiro.', vai:'c9_energia'},
    {texto:'Assumir o lugar: chamar os funcionários e dar uma ordem.', vai:'c9_tomou', cond:d=>!!d.flags.quer_a_rede}
  ]
},

c9_dentro_visto:{
  texto:[
    'Você entra, e na terceira fileira de gaiolas alguém acende a luz do corredor.',
    '"Ô." Voz calma. "Você não é da equipe."',
    'Três homens. Um deles já tem a bola na mão.'
  ],
  ef:{flag:'dentro_do_deposito'},
  escolhas:[
    {texto:'Lutar.', vai:'c9_luta_deposito'},
    {texto:'"A Terceira me mandou." Blefar.', vai:'c9_blefe'},
    {texto:'Correr para as gaiolas e abrir o máximo que der.', vai:'c9_corrida_gaiolas'}
  ]
},

c9_frente:{
  texto:[
    'Você bate no portão azul.',
    'Silêncio de cinco segundos. Depois ele abre, e tem quatro pessoas do outro lado que claramente não esperavam ninguém bater.',
    '"Boa noite", diz o mais velho. Ele não parece bravo. Parece contrariado, como quem vai ter que refazer uma planilha.'
  ],
  escolhas:[
    {texto:'Lutar.', vai:'c9_luta_deposito'},
    {texto:'"A Terceira me mandou." Blefar.', vai:'c9_blefe'},
    {texto:'"Eu vim comprar." Blefar para o outro lado.', vai:'c9_blefe_comprador'}
  ]
},

c9_blefe:{
  texto:['"A Terceira me mandou."'],
  teste:{status:'carisma', dificuldade:8, nomeStatus:'Carisma',
         critico:'c9_blefe_ok', sucesso:'c9_blefe_ok', parcial:'c9_blefe_meio', falha:'c9_luta_deposito'}
},

c9_blefe_ok:{
  texto:[
    'Funciona. Funciona porque ninguém ali quer ser a pessoa que barrou alguém que a chefe mandou.',
    '"Ela podia avisar." O mais velho já está voltando pro que estava fazendo. "Fica longe da fileira C, tá com bicho novo e eles mordem."',
    'Você tem, talvez, dez minutos antes de alguém pensar melhor.'
  ],
  ef:{flag:['dentro_do_deposito','blefou_bem']},
  escolhas:[
    {texto:'Abrir todas as gaiolas de uma vez.', vai:'c9_abriu_tudo'},
    {texto:'Fotografar tudo e sair.', vai:'c9_documentou'},
    {texto:'Pegar o livro de destinos.', vai:'c9_livro'},
    {texto:'Cortar a energia.', vai:'c9_energia'}
  ]
},

c9_blefe_meio:{
  texto:[
    'Eles quase acreditam. "Quase" aqui significa que um deles sai da sala pra ligar.',
    'Você tem o tempo de uma ligação.'
  ],
  ef:{flag:['dentro_do_deposito','tempo_curto']},
  escolhas:[
    {texto:'Abrir as gaiolas agora, rápido.', vai:'c9_corrida_gaiolas'},
    {texto:'Cortar a energia.', vai:'c9_energia'},
    {texto:'Sair enquanto dá.', vai:'c9_saiu_cedo'}
  ]
},

c9_blefe_comprador:{
  texto:[
    '"Eu vim comprar."',
    'O mais velho te mede da cabeça ao pé — roupa de rota, mochila surrada, quinze anos.',
    '"Comprar." Ele não ri, o que é pior. "Com quê?"'
  ],
  escolhas:[
    {texto:'Mostrar o dinheiro. (precisa de 10.000 ₽)', vai:'c9_comprador_ok', cond:d=>d.jogador.dinheiro>=10000},
    {texto:'Blefar mais.', vai:'c9_blefe'},
    {texto:'Desistir do blefe e lutar.', vai:'c9_luta_deposito'}
  ]
},

c9_comprador_ok:{
  texto:[
    'Você mostra o maço. O clima muda instantaneamente — dinheiro é a única identidade que esse lugar reconhece.',
    'Eles te deixam andar entre as gaiolas escolhendo, com uma prancheta, como quem escolhe fruta.',
    'Quarenta e uma gaiolas. Você anda por todas. Isso vai ficar com você.'
  ],
  ef:{flag:['dentro_do_deposito','andou_entre_as_gaiolas']},
  escolhas:[
    {texto:'Comprar um. Tirar pelo menos um dali. (10.000 ₽)', vai:'c9_comprou_um'},
    {texto:'Fingir que desistiu, sair, e voltar pela lateral.', vai:'c9_lateral'},
    {texto:'Largar o dinheiro no chão e abrir todas as gaiolas.', vai:'c9_abriu_tudo',
     ef:{dinheiro:-10000, rep:{eixo:'bom',delta:2,motivo:'Trocou todo o dinheiro por um instante de caos'}}}
  ]
},

c9_comprou_um:{
  texto:[
    'Você paga e eles te entregam uma bola com um adesivo numerado.',
    'Você sai andando entre as outras quarenta gaiolas com a sua na mão.',
    'Salvar um é melhor que salvar nenhum. Essa frase é verdadeira e não ajuda nada agora.'
  ],
  ef:{dinheiro:-10000, flag:'comprou_do_deposito',
      executar:d=>{
        const p = criarPokemon(Dados.escolher([123,127,113,115,131,143,137,142]), Dados.entre(26,34),
          {moral:20, historia:'Comprado numa gaiola de depósito em Celadon. Tinha um número colado na bola.'});
        Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${p.nome} (Nv ${p.nivel}) saiu do depósito. Os outros quarenta não.`}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Comprou um Pokémon traficado — mesmo para salvá-lo'}},
  escolhas:[{texto:'Sair.', vai:'c9_fim'}]
},

c9_energia:{
  texto:[
    'O quadro de força fica no corredor lateral. Você desliga a chave geral.',
    'O depósito inteiro apaga. O gerador leva onze segundos pra ligar.',
    'Onze segundos de escuro total com quarenta e uma gaiolas cheias.',
    'Na escuridão, o som muda — para de ser abafado e vira outra coisa. Quarenta e uma vozes ao mesmo tempo, sem uma luz pra se orientar.',
    'Quando o gerador pega, as travas magnéticas das gaiolas estão todas abertas. Elas abrem por falta de energia. Era um problema de segurança do projeto e agora é o seu maior aliado.'
  ],
  ef:{flag:'cortou_energia'},
  escolhas:[{texto:'Abrir o portão de carga antes que alguém reaja.', vai:'c9_abriu_tudo'}]
},

c9_abriu_tudo:{
  texto:[
    'Você abre o portão de carga e sai da frente.',
    'O que acontece nos dois minutos seguintes não é resgate, é evacuação. Quarenta e um Pokémon de espécies que nunca dividiram um espaço saem ao mesmo tempo por uma porta de três metros.',
    'Dois funcionários tentam conter e desistem rápido — ninguém é pago o suficiente pra isso.',
    'Vinte e nove chegam na rua. Seis ficam no depósito, escondidos, porque não sabem o que fazer com espaço aberto. Os outros seis não conseguem andar.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Esvaziou o depósito de Celadon'},
      flag:'esvaziou_deposito', instabilidade:1,
      npc:{nome:'A Terceira', opiniao:-4, memoria:'Você esvaziou o depósito dela em Celadon. Prejuízo real.'},
      registrar:'Esvaziou o depósito de Celadon: 29 escaparam, 6 ficaram, 6 não conseguiram andar.'},
  escolhas:[
    {texto:'Ficar e carregar os seis que não andam.', vai:'c9_carregou_seis'},
    {texto:'Sair agora. A polícia vem, a imprensa vem, e você não pode estar aqui.', vai:'c9_saiu_cedo'},
    {texto:'Incendiar o depósito vazio.', vai:'c9_incendio'}
  ]
},

c9_carregou_seis:{
  texto:[
    'Você fica. Faz seis viagens até a esquina, uma por vez, com uma manta encontrada no chão.',
    'Na quarta viagem, os funcionários já foram embora e você está sozinho num depósito aberto às duas da manhã.',
    'Na sexta, chega a polícia. Eles te encontram sentado no meio-fio com um Lickitung desidratado no colo.',
    'O oficial mais novo pergunta o que aconteceu. O mais velho olha o interior do depósito e responde por você: "Aconteceu isso aí."'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Ficou até o fim, carregando quem não podia andar'},
      hp:-5, causa:'Exaustão em Celadon',
      flag:'carregou_os_seis',
      umaVez:'c08-09_p4', pokemon:{dex:108, nivel:28, opcoes:{moral:55, historia:'Você o carregou numa manta, sozinho, às duas da manhã em Celadon.'}},
      registrar:'Carregou os seis que não andavam. A polícia te encontrou no meio-fio.'},
  escolhas:[{texto:'Ir embora quando deixarem.', vai:'c9_fim'}]
},

c9_saiu_cedo:{
  texto:[
    'Você sai antes de qualquer coisa chegar. É a decisão certa e não parece.',
    'De três quarteirões de distância dá pra ouvir a sirene.',
    'De manhã, o jornal fala em "operação frustrada" e não cita ninguém. Você é uma ausência na notícia.'
  ],
  ef:{flag:'saiu_antes'},
  escolhas:[{texto:'Seguir.', vai:'c9_fim'}]
},

c9_incendio:{
  texto:[
    'Você incendeia.',
    'O depósito é de alvenaria e o fogo não se espalha pro quarteirão — você verifica isso antes, o que diz uma coisa esquisita sobre você.',
    'Os seis que não conseguiam andar estavam lá dentro.',
    'Você lembra disso depois. Não durante.'
  ],
  ef:{rep:{eixo:'ruim',delta:4,motivo:'Incendiou um depósito com Pokémon feridos dentro'},
      flag:['incendiou_deposito','tem_sangue_nas_maos'], instabilidade:2, moral:-25,
      executar:d=>{ Estado.dados.liga.avisos++; return [{tipo:'liga', texto:'A Liga Pokémon abriu inquérito sobre o incêndio de Celadon.'}]; },
      registrar:'Incendiou o depósito de Celadon com seis Pokémon feridos dentro.'},
  escolhas:[{texto:'Ir embora.', vai:'c9_fim'}]
},

c9_documentou:{
  texto:[
    'Você fotografa tudo: as quarenta e uma gaiolas, as pranchetas, o livro de destino, a caixa de bolas vazias.',
    'Depois sai sem tocar em nada. Sem soltar ninguém.',
    'Essa é a decisão mais fria que você já tomou, e você sabe exatamente por que tomou: uma noite de caos fecha um depósito. Trinta e uma páginas de destino fecham uma rede.',
    'Você fica com isso na consciência do jeito que se fica com uma escolha certa que parece errada.'
  ],
  ef:{flag:['provas_deposito','escolha_fria'],
      rep:{eixo:'bom',delta:2,motivo:'Documentou a rede inteira em vez de agir na hora'},
      registrar:'Documentou o depósito de Celadon sem soltar ninguém.'},
  escolhas:[
    {texto:'Levar à Dra. Ivone.', vai:'c9_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Liga.', vai:'c9_liga_celadon'},
    {texto:'Guardar. Você ainda não sabe em quem confiar.', vai:'c9_fim', ef:{flag:'guardou_provas'}}
  ]
},

c9_livro:{
  texto:[
    'O livro de destinos tem trinta e uma páginas.',
    'Doze são coleções particulares em Kanto. Nove são fora de Kanto. Sete são a mesma sigla repetida: **SPH-11**.',
    'As últimas três páginas não têm destino. Têm a palavra "descarte" e uma data ao lado de cada linha.'
  ],
  ef:{flag:['livro_de_destinos','sabe_do_andar_11'],
      rep:{eixo:'bom',delta:1,motivo:'Tomou o livro-caixa da rede de Celadon'},
      registrar:'Pegou o livro de destinos: sete cargas foram para "SPH-11".'},
  escolhas:[
    {texto:'Abrir as gaiolas também.', vai:'c9_abriu_tudo'},
    {texto:'Sair só com o livro.', vai:'c9_saiu_cedo'}
  ]
},

c9_corrida_gaiolas:{
  texto:[
    'Você corre pras gaiolas com três homens atrás de você.',
    'Abre sete antes de te alcançarem. Sete em quarenta e uma.',
    'Os sete saem correndo por baixo das pernas dos funcionários, o que gera exatamente a confusão que você precisava e exatamente o tipo de raiva que você não queria.'
  ],
  ef:{flag:'abriu_sete', rep:{eixo:'bom',delta:1,motivo:'Libertou sete antes de ser contido'}},
  escolhas:[{texto:'Lutar.', vai:'c9_luta_deposito'}]
},

c9_luta_deposito:{
  texto:['Não tem mais conversa.'],
  batalha:{dex:110, nivel:34, tipo:'treinador', treinador:'Encarregado do depósito', fuga:true,
           timeExtra:[{dex:89, nivel:35},{dex:24, nivel:33}],
           vitoria:'c9_venceu_deposito', derrota:'c9_perdeu_deposito', fuga2:'c9_saiu_cedo', gameover:'gameover'}
},

c9_venceu_deposito:{
  texto:[
    'Três times inteiros e você continua de pé.',
    'O encarregado senta numa caixa e não tenta mais nada. "Faz o que você veio fazer. Eu ganho por hora."',
    'As chaves das gaiolas estão no cinto dele. Ele te entrega sem você pedir.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Derrotou a segurança do depósito de Celadon'}, flag:'venceu_deposito'},
  escolhas:[
    {texto:'Abrir todas as gaiolas.', vai:'c9_abriu_tudo'},
    {texto:'Pegar o livro de destinos primeiro.', vai:'c9_livro'},
    {texto:'Assumir o depósito. Mandar ele voltar ao trabalho — pra você.', vai:'c9_tomou', cond:d=>!!d.flags.quer_a_rede}
  ]
},

c9_perdeu_deposito:{
  texto:[
    'Você perde.',
    'Eles não te machucam muito — machucar dá processo. Te colocam na rua, com a sua mochila, e fecham o portão azul.',
    'Às três da manhã, o caminhão sai carregado. Você vê da esquina.',
    'Quarenta e uma gaiolas passam por você a quarenta quilômetros por hora.'
  ],
  ef:{hp:-7, causa:'Derrota no depósito de Celadon', flag:'falhou_deposito', instabilidade:1,
      registrar:'Perdeu no depósito de Celadon. A carga saiu.'},
  escolhas:[
    {texto:'Seguir o caminhão a pé enquanto der.', vai:'c9_seguiu_caminhao'},
    {texto:'Sentar no meio-fio.', vai:'c9_fim'}
  ]
},

c9_seguiu_caminhao:{
  texto:[
    'Você segue o caminhão por onze quarteirões até perder de vista na avenida.',
    'Mas você anota a placa. E o horário. E o sentido.',
    'É pouco. É mais do que você tinha há onze quarteirões.'
  ],
  ef:{flag:'placa_do_caminhao', rep:{eixo:'bom',delta:1,motivo:'Não desistiu quando já tinha perdido'}},
  escolhas:[{texto:'Seguir.', vai:'c9_fim'}]
},

c9_tomou:{
  texto:[
    'Você não abre as gaiolas.',
    'Você chama os dois funcionários que ainda estão ali, e diz — com uma calma que assusta você mesmo — que a partir de hoje eles se reportam a você, que o pagamento continua igual, e que a carga de amanhã sai no horário.',
    'Eles olham um pro outro. Um deles pergunta da Terceira.',
    '"A Terceira sabe", você diz. E tecnicamente é verdade.',
    'Eles voltam a trabalhar. É assim que acontece: não com um discurso, com um turno de trabalho.'
  ],
  ef:{rep:{eixo:'ruim',delta:4,motivo:'Tomou para si uma rede de tráfico de Pokémon'},
      flag:['assumiu_a_rede','tem_sangue_nas_maos'], dinheiro:15000, moral:-25,
      npc:{nome:'A Terceira', opiniao:-5, memoria:'Você tomou o depósito dela. Ela previu e não gostou de ter previsto.'},
      executar:d=>{
        Historia.definirVia('foragido','assumiu a rede de Celadon');
        Estado.dados.liga.avisos++;
        return [{tipo:'liga', texto:'Um relatório da Liga sobre Celadon passou a ter o seu nome no topo.'}];
      },
      registrar:'Assumiu o controle do depósito e da rede de Celadon.'},
  escolhas:[{texto:'Ir dormir. Você tem uma operação pra tocar amanhã.', vai:'c9_fim'}]
},

c9_ivone:{
  texto:[
    'A Dra. Ivone chega em Celadon em cinco horas, com duas pessoas e uma câmera, do mesmo jeito do Monte da Lua.',
    'Ela olha o que você trouxe em silêncio. Vira as páginas devagar.',
    'Quando chega na sigla SPH-11, ela para.',
    '"Isso não é contrabando de bicho." Ela fecha o caderno. "Isso é fornecimento."',
    '"Fornecimento tem cliente. E cliente com sigla e número de andar tem CNPJ."'
  ],
  ef:{flag:['ivone_sabe','sabe_da_silph'],
      rep:{eixo:'bom',delta:2,motivo:'Entregou a rede de Celadon a quem faz alguma coisa com isso'},
      npc:{nome:'Dra. Ivone', opiniao:8, memoria:'Você entregou a ela o livro-caixa da rede de Celadon. Foi o maior material que ela já teve.'},
      registrar:'Dra. Ivone recebeu as provas e identificou a Silph como cliente.'},
  escolhas:[
    {texto:'"Então a gente vai pra Saffron."', vai:'c9_fim',
     ef:{flag:'vai_para_saffron', executar:d=>{ if(Historia.via()==='neutro') Historia.definirVia('pesquisador','seguiu a trilha até a Silph'); return []; }}},
    {texto:'"Eu já fiz a minha parte."', vai:'c9_fim'}
  ]
},

c9_liga_celadon:{
  texto:[
    'O posto da Liga em Celadon fica no terceiro andar de um prédio comercial e fecha às 18h.',
    'O oficial que te atende é competente e honesto, e é por isso que a conversa é tão frustrante.',
    '"Isso aqui é bom material." Ele folheia. "Mas eu preciso de mandado, e mandado pra empresa privada leva de quatro a nove meses."',
    '"Quatro a nove meses."',
    '"Eu sei." Ele te olha nos olhos. "Eu sei."'
  ],
  ef:{flag:'liga_tem_provas',
      rep:{eixo:'bom',delta:1,motivo:'Levou provas às autoridades'},
      executar:d=>{ d.liga.avisos = Math.max(0, d.liga.avisos); return [{tipo:'liga', texto:'A Liga registrou você como informante — o que é bom e ruim.'}]; },
      registrar:'Entregou as provas à Liga. Prazo estimado: quatro a nove meses.'},
  escolhas:[
    {texto:'"Então eu vou eu mesmo."', vai:'c9_fim',
     ef:{flag:'vai_sozinho_saffron', executar:d=>{ if(Historia.via()==='neutro') Historia.definirVia('heroi','decidiu ir sozinho quando o sistema disse nove meses'); return []; }}},
    {texto:'Aceitar. Quatro a nove meses.', vai:'c9_fim', ef:{flag:'aceitou_prazo'}}
  ]
},

c9_liga_deposito:{
  texto:[
    'Você liga da esquina e espera.',
    'A viatura chega em quarenta minutos. Dois oficiais, sem mandado, sem autorização pra entrar.',
    'Eles batem no portão azul. O portão abre. Um homem muito educado mostra a documentação do depósito, que está em ordem, porque depósito de carga é uma coisa legal.',
    'Os oficiais vão embora às 00h51.',
    'O caminhão sai às 01h20.'
  ],
  ef:{flag:'liga_falhou_celadon', instabilidade:1,
      rep:{eixo:'bom',delta:1,motivo:'Tentou fazer pelo caminho certo'},
      registrar:'A Liga foi ao depósito, não pôde entrar, e o caminhão saiu depois.'},
  escolhas:[
    {texto:'Entrar sozinho agora, com raiva.', vai:'c9_frente',
     ef:{executar:d=>{ if(Historia.via()==='neutro') Historia.definirVia('heroi','perdeu a fé no caminho oficial'); return []; }}},
    {texto:'Ir embora.', vai:'c9_fim'}
  ]
},

c9_endereco:{
  texto:[
    'O endereço do cartão é uma porta de aço no fundo de uma galeria comercial fechada, entre uma loja de peça de moto e um lugar que já foi lanchonete.',
    'Depois das 23h, a porta abre.',
    'Dentro é limpo, iluminado e organizado como escritório. Tem planilha na parede.',
    'O homem de terno claro está lá. E a mulher do cassino também.',
    d=>d.flags.roubou_a_caixa ? '"Ah", diz o homem de terno claro, ao te ver. "Você trouxe minha caixa de volta ou trouxe coragem?"' :
       '"Pontual", diz ele. "Isso é raro em gente da sua idade."'
  ],
  ef:{flag:['conheceu_terceira','sabe_da_terceira'],
      npc:{nome:'A Terceira', opiniao:0, memoria:'Você foi ao endereço do cartão, depois das 23h.'}},
  escolhas:[{texto:'Ouvir a proposta.', vai:'c9_proposta_terceira'}]
},

c9_fim:{
  texto:[
    d=>{
      const via = Historia.via();
      if (via==='mercenario') return 'Você sai de Celadon com dinheiro, contato e um trabalho. É mais do que você tinha na entrada da cidade, e é a primeira vez na jornada que "mais" parece uma palavra ruim.';
      if (via==='foragido') return 'Você sai de Celadon com uma operação nas costas. Não com uma gangue, não com poder — com responsabilidade sobre uma coisa que não devia existir.';
      if (via==='pesquisador') return 'Você sai de Celadon com mais perguntas do que entrou, e com endereços em vez de respostas. É o pior tipo de progresso: o que funciona.';
      if (via==='heroi') return 'Você sai de Celadon com o nome numa delegacia como testemunha, numa redação como fonte, e num escritório como prejuízo. Três listas diferentes.';
      return 'Você sai de Celadon do jeito que entrou. Poucas pessoas conseguem isso e não é um elogio.';
    },
    d=>d.flags.sabe_do_andar_11 || d.flags.sabe_da_silph
       ? 'De qualquer forma, existe um prédio em Saffron com dez andares e uma sigla que fala em onze.'
       : 'Saffron fica a um dia daqui. É a única cidade de Kanto maior que Celadon.',
    'A estrada é reta e você anda ela inteira pensando na mesma coisa.'
  ],
  fim:true, resumo:'Capítulo 9 concluído — Celadon te mostrou o tamanho do problema.'
}
}}

);
