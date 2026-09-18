/* ============================================================
   CAPÍTULO 7 — A TORRE  (Lavender)
   ============================================================ */
CAPITULOS.push(

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 7 — A TORRE
   ══════════════════════════════════════════════════════════ */
{
num:7, titulo:'A Torre', local:'Lavender', ambiente:'cemiterio', nivelArea:28,
tom:'muito sombrio', inicio:'c7_cidade',
cenas:{

c7_cidade:{
  texto:[
    'Lavender não tem música. Você só percebe isso depois de meia hora na cidade — nenhum rádio, nenhuma loja com alto-falante. É uma decisão coletiva que ninguém tomou.',
    'A Torre Pokémon tem sete andares e é a coisa mais alta num raio de quilômetros. Não é um prédio bonito. Não foi feita pra ser vista de fora.',
    'Na base, um mural com nomes. Muitos nomes. Alguns com data de um Pokémon e data de um treinador na mesma linha.',
    d=>d.cemiterio.length ? `Você encontra espaço em branco no mural. Tem giz numa caixinha ao lado. ${d.cemiterio.map(p=>nomeExib(p)).join(', ')} não está escrito em lugar nenhum.` : 'Você não tem nenhum nome pra escrever aí. Ainda.'
  ],
  ef:{registrar:'Chegou a Lavender Town.'},
  escolhas:[
    {texto:'Escrever no mural.', vai:'c7_mural', cond:d=>d.cemiterio.length>0,
     ef:{rep:{eixo:'bom',delta:1,motivo:'Honrou os próprios mortos'}, flag:'escreveu_mural', moral:10}},
    {texto:'Entrar na torre.', vai:'c7_torre'},
    {texto:'Procurar quem cuida daqui.', vai:'c7_zelador'}
  ]
},

c7_mural:{
  texto:[
    'O giz range. Você escreve devagar, com a letra melhor que consegue.',
    'Uma senhora de luto, dois metros à sua direita, espera você terminar e diz: "O primeiro é o pior. Depois você aprende a escrever mais rápido."',
    'Ela não está sendo cruel. Ela está sendo verdadeira, o que é diferente.'
  ],
  escolhas:[{texto:'Entrar na torre.', vai:'c7_torre'}]
},

c7_zelador:{
  texto:[
    'O zelador da torre é um homem magro com as mãos manchadas de incenso.',
    '"Você é treinador." Ele olha seu cinto. "Sobe se quiser. Mas escuta uma coisa antes."',
    '"Do quarto andar pra cima, os Gastly te mostram coisa. Eles não inventam — eles pegam o que já tá em você e põem na sua frente. Se você não tem nada podre, não tem o que ver."',
    'Ele te olha com um interesse desconfortável. "Você tem alguma coisa podre?"'
  ],
  ef:{npc:{nome:'Zelador da Torre', opiniao:1, memoria:'Te avisou sobre o que tem do quarto andar pra cima.'},
      flag:'aviso_zelador'},
  escolhas:[
    {texto:'"Não."', vai:'c7_torre', ef:{flag:'negou_podre'}},
    {texto:'"Tenho."', vai:'c7_torre', ef:{flag:'admitiu_podre', rep:{eixo:'bom',delta:1,motivo:'Foi honesto sobre si mesmo'}}},
    {texto:'Não responder.', vai:'c7_torre'}
  ]
},

c7_torre:{
  texto:[
    'Os três primeiros andares são só andares. Velas, incenso, gente rezando baixo, lápides pequenas em fileira.',
    'No quarto, a temperatura cai de verdade — dá pra ver a respiração.',
    'E começam as vozes. Não palavras. Só o formato de uma voz conhecida, sem o conteúdo.'
  ],
  escolhas:[{texto:'Subir.', vai:'c7_visao'}]
},

c7_visao:{
  texto:[
    d=>{
      const f = d.flags;
      if (f.ignorou_pikachu) return 'No quinto andar, no meio do corredor, tem uma estaca fincada no chão de pedra e um fio de aço amarrado nela. O fio se mexe sozinho, girando, girando, girando o mesmo círculo que você viu na terra da floresta.';
      if (f.trabalhou_rocket) return 'No quinto andar tem duas caixas plásticas empilhadas, do tipo que você carregou. A de cima está aberta. Você não olha dentro. Você sabe que não deve olhar dentro. Você olha dentro.';
      if (f.ignorou_marta) return 'No quinto andar tem uma mulher sentada de costas com alguma coisa no colo. Ela não vira. Você já sabe que ela não vai virar, e mesmo assim fica esperando, e o tempo passa errado.';
      if (f.agrediu_envenenador) return 'No quinto andar tem uma tigela de ração no meio do chão. Só isso. E o som das suas próprias mãos, que você reconhece na hora, e que não devia dar pra reconhecer.';
      if (f.vendeu_para_cacadores) return 'No quinto andar alguém conta dinheiro. Nota por nota, devagar, olhando pra você o tempo todo. Você conhece as mãos. São as suas.';
      if (d.cemiterio.length) return `No quinto andar, ${nomeExib(d.cemiterio[0])} está esperando você no meio do corredor. Inteiro. Sem marca nenhuma. Ele não te ataca e não foge — só senta e espera, do jeito que esperava.`;
      if (f.saiu_sem_despedir) return 'No quinto andar tem uma cortina de cozinha se mexendo, sem janela em volta, sem vento nenhum.';
      return 'No quinto andar não tem nada. Você anda o corredor inteiro e não tem nada, e de alguma forma isso é o mais perturbador que podia acontecer.';
    },
    'Alguma coisa respira atrás de você.'
  ],
  ef:{registrar:'A Torre mostrou o que você trouxe.'},
  batalha:{dex:92, nivel:30, tipo:'selvagem', ambiente:'cemiterio', fuga:true,
           vitoria:'c7_marowak', derrota:'c7_marowak', fuga2:'c7_marowak', captura:'c7_marowak', gameover:'gameover'}
},

c7_marowak:{
  texto:[
    'No sexto andar, você para de subir sem decidir parar.',
    'Tem um Marowak no fim do corredor. Não é fantasma — é um Marowak, sólido, com o osso na mão. Nível alto demais pra essa torre.',
    'Atrás dele, encolhido contra a parede, um Cubone. Pequeno, machucado na perna, respirando rápido.',
    'O Marowak não é a mãe dele. A mãe dele está enterrada no terceiro andar — você passou pela lápide. Esse Marowak é de outro treinador, e tem uma bola no chão, vazia, a cinco metros.',
    'O treinador está caído ao lado da bola. Vivo. Inconsciente. O Marowak não deixa ninguém chegar perto de nenhum dos dois.'
  ],
  ef:{registrar:'Encontrou o Marowak enlouquecido no sexto andar da Torre.'},
  escolhas:[
    {texto:'Batalhar. Derrubar o Marowak e tirar os dois de lá.', vai:'c7_luta_marowak'},
    {texto:'Tentar acalmar. Chegar devagar, sem bola na mão.', vai:'c7_acalmar'},
    {texto:'Usar um dos seus como escudo pra chegar até o treinador caído.', vai:'c7_escudo'},
    {texto:'Descer e chamar ajuda. Leva quarenta minutos.', vai:'c7_ajuda'}
  ]
},

c7_luta_marowak:{
  texto:['O Marowak grita quando você dá o primeiro passo. É um som que não devia sair de um corpo daquele tamanho.'],
  batalha:{dex:105, nivel:34, tipo:'selvagem', fuga:false, ambiente:'cemiterio',
           vitoria:'c7_pos_luta', derrota:'c7_pos_luta', captura:'c7_pos_luta', gameover:'gameover'}
},

c7_pos_luta:{
  texto:[
    'Quando acaba, o Marowak está caído e o Cubone não sai de perto dele.',
    'Você carrega o treinador inconsciente escada abaixo, seis andares, parando duas vezes.',
    'O zelador chama o hospital. O treinador acorda três horas depois e a primeira coisa que ele pergunta é pelo Marowak.',
    'Você não sabe o que responder, então diz a verdade, e a verdade é uma frase curta e feia.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Salvou um treinador inconsciente na Torre Pokémon'},
      hp:-5, causa:'Esforço na Torre Pokémon',
      flag:'salvou_treinador_torre'},
  escolhas:[
    {texto:'Voltar no sexto andar buscar o Cubone.', vai:'c7_cubone'},
    {texto:'Deixar o Cubone lá. Ele escolheu ficar.', vai:'c7_fim'}
  ]
},

c7_acalmar:{
  texto:['Você solta o cinto no chão, com todas as bolas, e mostra as mãos vazias. Depois anda.'],
  teste:{status:'carisma', dificuldade:9, nomeStatus:'Carisma',
         critico:'c7_acalmou_bem', sucesso:'c7_acalmou_bem', parcial:'c7_acalmou_meio', falha:'c7_acalmou_mal'}
},

c7_acalmou_bem:{
  texto:[
    'Leva doze minutos pra andar cinco metros. Você não fala — só continua indo, devagar, com as mãos abertas.',
    'A um metro, o Marowak abaixa o osso. Não solta. Só abaixa.',
    'Você senta no chão frio ao lado dele, e vocês dois ficam ali olhando o Cubone machucado, e depois de um tempo ele deixa você chegar no menor.',
    'O treinador acorda sozinho enquanto isso. Vê a cena. Não se mexe, porque entendeu o que está acontecendo.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Acalmou um Pokémon enlouquecido sem violência na Torre'},
      flag:'acalmou_marowak', moral:15,
      npc:{nome:'Zelador da Torre', opiniao:5, memoria:'Ele ouviu o que você fez no sexto andar. Não acreditou até ver.'},
      registrar:'Acalmou o Marowak sem lutar. A torre inteira comentou.'},
  escolhas:[
    {texto:'Levar o Cubone com você — com a permissão dos dois.', vai:'c7_cubone'},
    {texto:'Deixar os dois juntos e descer.', vai:'c7_fim', ef:{rep:{eixo:'bom',delta:1,motivo:'Deixou os dois juntos'}}}
  ]
},

c7_acalmou_meio:{
  texto:[
    'Você chega a dois metros. O Marowak não ataca, mas não cede — e o osso continua no alto.',
    'Vocês ficam nesse impasse por vinte minutos, até ele decidir que você não vale o esforço e recuar pro canto com o Cubone.',
    'Dá pra arrastar o treinador inconsciente pela escada. É o que você consegue.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Evitou violência na Torre'}, hp:-3, causa:'Tensão na Torre',
      flag:'impasse_marowak'},
  escolhas:[{texto:'Descer com o treinador.', vai:'c7_fim'}]
},

c7_acalmou_mal:{
  texto:[
    'Você chega perto demais rápido demais.',
    'O osso acerta você acima da orelha e o mundo inclina. Você cai de joelhos e vê o chão de pedra muito de perto.',
    'O Marowak não continua. Ele recua, tremendo, e volta pro canto com o Cubone — e é isso que faz você entender que ele nunca quis brigar com ninguém.'
  ],
  ef:{hp:-11, causa:'Golpe de osso na Torre Pokémon', flag:'ferido_marowak',
      registrar:'Levou um golpe de osso na cabeça no sexto andar.'},
  escolhas:[
    {texto:'Levantar e tentar de novo, mais devagar.', vai:'c7_acalmar'},
    {texto:'Arrastar o treinador e descer.', vai:'c7_fim'},
    {texto:'Chega de gentileza. Batalhar.', vai:'c7_luta_marowak'}
  ]
},

c7_escudo:{
  texto:[
    'Você escolhe um dos seus e o coloca na frente. Não pra lutar — pra absorver.',
    'A ideia é simples: o Marowak bate em alguma coisa enquanto você chega no treinador caído.',
    'Você olha pro seu time e escolhe quem vai apanhar.'
  ],
  sacrificio:{
    pergunta:'Quem você põe na frente?',
    causa:'Usado como escudo contra o Marowak na Torre Pokémon',
    vai:'c7_escudo_resultado'
  }
},

c7_escudo_resultado:{
  texto:[
    'Funciona. É importante registrar isso: funciona.',
    'Você chega no treinador, arrasta ele pelo colarinho até a escada e desce seis andares com ele.',
    'O que ficou pra trás no sexto andar ficou pra trás no sexto andar.',
    'O zelador olha o seu cinto quando você chega embaixo. Conta as bolas. Não diz nada. O não-dizer-nada dele é alto.'
  ],
  ef:{rep:{eixo:'ruim',delta:3,motivo:'Sacrificou o próprio Pokémon como escudo'},
      moral:-30, flag:'usou_escudo',
      npc:{nome:'Zelador da Torre', opiniao:-6, memoria:'Ele contou as bolas no seu cinto quando você desceu. Faltava uma.'},
      registrar:'Usou um Pokémon como escudo. O time viu.'},
  escolhas:[{texto:'Descer.', vai:'c7_fim'}]
},

c7_ajuda:{
  texto:[
    'Você desce correndo. Leva onze minutos pra achar o zelador, mais quinze pra ele reunir três pessoas, mais catorze pra subir de volta.',
    'Quarenta minutos.',
    'O treinador está morto quando vocês chegam. Não foi o Marowak — foi o que ele já tinha, que ninguém sabia, e que quarenta minutos decidiram.',
    'O Marowak está sentado do lado dele. Parou de defender. Deixou todo mundo chegar perto.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Buscou ajuda na Torre Pokémon'},
      flag:'treinador_morreu_torre', instabilidade:1,
      npc:{nome:'Zelador da Torre', opiniao:2, memoria:'Subiu com você e viu o treinador morto no sexto andar.'},
      registrar:'O treinador do sexto andar morreu enquanto você buscava ajuda.'},
  escolhas:[
    {texto:'Ficar com o Cubone.', vai:'c7_cubone'},
    {texto:'Descer.', vai:'c7_fim'}
  ]
},

c7_cubone:{
  texto:[
    'O Cubone tem a perna quebrada e não pesa quase nada.',
    'Ele não luta contra a bola. Não é aceitação — é uma coisa mais triste, que é não ter mais preferência nenhuma.',
    'Vai levar semanas pra perna sarar. Vai levar mais tempo pro resto.'
  ],
  ef:{pokemon:{dex:104, nivel:24, opcoes:{natureza:'Lonely', moral:25, historia:'Resgatado do sexto andar da Torre Pokémon de Lavender.'}},
      rep:{eixo:'bom',delta:1,motivo:'Resgatou um Pokémon órfão na Torre'},
      flag:'salvou_cubone'},
  escolhas:[{texto:'Descer.', vai:'c7_fim'}]
},

c7_fim:{
  texto:[
    'Você sai da torre e a rua de Lavender está do jeito que estava: sem música.',
    'Agora você entende o porquê.',
    d=>{
      if (d.flags.usou_escudo) return 'Você olha pro cinto. Tem um espaço. Você vai olhar pra esse espaço todo dia pelo resto da jornada.';
      if (d.flags.acalmou_marowak) return 'Alguma coisa mudou em você lá em cima, e pela primeira vez em muito tempo é uma mudança pra melhor.';
      if (d.flags.treinador_morreu_torre) return 'Quarenta minutos. Você vai fazer essa conta muitas vezes, com resultados diferentes, e nenhum deles vai importar.';
      return 'Você não é a mesma pessoa que entrou. Não tem uma cena específica pra apontar. É só verdade.';
    },
    'No dia seguinte, sai uma notícia de Cinnabar: incêndio numa instalação abandonada do laboratório. Ninguém ferido. Ninguém consegue explicar o que causou.'
  ],
  fim:true, resumo:'Capítulo 7 concluído — a Torre te mostrou o que você trouxe.'
}
}}

);
