/* ============================================================
   CAPÍTULO 13 — CONGELOU  (Ilhas Espuma)
   ============================================================ */
CAPITULOS.push(
{
num:13, titulo:'Congelou', local:'Ilhas Seafoam', ambiente:'agua', nivelArea:42,
tom:'muito sombrio', inicio:'c13_barco',
cenas:{

c13_barco:{
  texto:[
    'Nenhum pescador de Fuchsia te leva às Seafoam. Nenhum, por nenhum dinheiro.',
    'O único que aceita é um homem de setenta e quatro anos que já não pesca mais e que diz, com toda a calma do mundo: "Eu vou porque eu quero ver antes de morrer."',
    'A travessia leva três horas. Nas últimas quarenta minutos, a temperatura da água cai — dá pra sentir com a mão na borda.',
    'A duzentos metros da ilha, tem gelo. Gelo no mar, em Kanto, em outubro.'
  ],
  ef:{npc:{nome:'Seu Bento', opiniao:2, memoria:'Te levou às Seafoam porque queria ver antes de morrer.'},
      registrar:'Atravessou até as Ilhas Seafoam. O mar está congelando.'},
  escolhas:[
    {texto:'Desembarcar.', vai:'c13_ilha'},
    {texto:'"Seu Bento, volta. Isso não é lugar."', vai:'c13_voltou'}
  ]
},

c13_voltou:{
  texto:[
    'Ele te olha muito tempo. Depois vira o barco sem discutir.',
    'No caminho de volta ele diz uma coisa só: "Meu pai dizia que o mar avisa três vezes. Essa foi a segunda."',
    'Duas semanas depois, o gelo alcança a costa de Fuchsia e a cidade perde a safra de pesca do trimestre.'
  ],
  ef:{flag:'nao_foi_seafoam', instabilidade:2,
      rep:{eixo:'ruim',delta:1,motivo:'Recuou das Seafoam e o gelo chegou à costa'},
      registrar:'Não desembarcou nas Seafoam. O gelo avançou.'},
  escolhas:[{texto:'Seguir para Cinnabar.', vai:'c13_fim'}]
},

c13_ilha:{
  texto:[
    'As Ilhas Seafoam são duas formações de rocha branca furadas por dentro — a água entra por baixo e sai pelo outro lado.',
    'Por dentro, elas são um sistema de cavernas que some e reaparece com a maré.',
    'Hoje não some. Hoje está tudo congelado — a água parada virou chão.',
    'Você entra andando por onde barco entrava.',
    'E nas paredes, no gelo, tem coisa dentro. Peixe. Tentacool. Um Dewgong inteiro, de olhos abertos, a dois metros de profundidade no gelo.'
  ],
  ef:{flag:'entrou_nas_seafoam', registrar:'Entrou nas cavernas congeladas das Seafoam.'},
  escolhas:[
    {texto:'Ir mais fundo.', vai:'c13_fundo'},
    {texto:'Tentar quebrar o gelo e tirar o Dewgong.', vai:'c13_dewgong'},
    {texto:'Voltar. Isso é maior do que uma pessoa.', vai:'c13_voltou_da_caverna'}
  ]
},

c13_dewgong:{
  texto:[
    'Você quebra gelo por quarenta minutos com o que tem.',
    'Chega até ele. Ele está vivo — em torpor, com batimento tão lento que você precisa encostar o ouvido pra ter certeza.',
    'Tirar do gelo é fácil. Manter vivo fora do gelo é outra coisa: sem o torpor, ele precisa de água, e a água aqui é gelo.'
  ],
  escolhas:[
    {texto:'Carregar até o barco. Seu Bento tem tanque de vivo.', vai:'c13_salvou_dewgong'},
    {texto:'Colocar de volta no gelo. O torpor era o que estava salvando ele.', vai:'c13_deixou_dewgong',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Entendeu que salvar não é sempre tirar de onde está'}, flag:'entendeu_o_torpor'}}
  ]
},

c13_salvou_dewgong:{
  texto:[
    'Você carrega um Dewgong de cento e vinte quilos por cento e setenta metros de caverna congelada.',
    'Não dá. Você faz mesmo assim, arrastando os últimos setenta.',
    'Seu Bento vê você chegar e não faz uma pergunta — só abre o tanque.',
    'O Dewgong acorda em Fuchsia, três dias depois, num aquário municipal, e vive.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Arrastou um Dewgong por cento e setenta metros de gelo'},
      hp:-6, causa:'Esforço extremo nas Seafoam',
      flag:'salvou_dewgong',
      npc:{nome:'Seu Bento', opiniao:6, memoria:'Te viu arrastar um Dewgong de 120 kg por 170 metros de gelo.'}},
  escolhas:[{texto:'Voltar à caverna.', vai:'c13_fundo'}]
},

c13_deixou_dewgong:{
  texto:[
    'Você recoloca ele na cavidade e empurra os pedaços de gelo de volta.',
    'Em quarenta minutos, a cavidade fecha de novo sozinha.',
    'Você fez a coisa mais difícil que existe: entendeu que a ajuda certa era não ajudar.'
  ],
  escolhas:[{texto:'Ir mais fundo.', vai:'c13_fundo'}]
},

c13_voltou_da_caverna:{
  texto:[
    'Você sai. Seu Bento não pergunta nada, e a viagem de volta é silenciosa.',
    'A três quilômetros da ilha, ele desliga o motor e fica olhando pra trás por um tempo.',
    '"Eu vi", ele diz, finalmente. "Tá bom. Eu vi."'
  ],
  ef:{flag:'recuou_seafoam', instabilidade:1},
  escolhas:[{texto:'Seguir para Cinnabar.', vai:'c13_fim'}]
},

c13_fundo:{
  texto:[
    'Quanto mais fundo, mais frio e mais claro. O gelo aqui é transparente como vidro de janela.',
    'A caverna se abre numa câmara enorme onde a água — a água antiga, de antes do congelamento — formou colunas do chão ao teto.',
    'No centro da câmara, num pilar de gelo que subiu do chão como se tivesse crescido, está Articuno.',
    'Ele não está preso. Ele está pousado. E ao redor dele, num raio de dez metros, o gelo é diferente: tem camada, como tronco de árvore.',
    'Ele está aqui há meses. Sem sair. Sem caçar.'
  ],
  ef:{executar:d=>{ Estado.lend(144).encontros++; return []; },
      registrar:'Encontrou Articuno no fundo das Seafoam. Ele está parado há meses.'},
  escolhas:[
    {texto:'Chegar perto devagar.', vai:'c13_perto'},
    {texto:'Atacar. Ele está enfraquecido.', vai:'c13_luta_articuno'},
    {texto:'Ficar parado e observar.', vai:'c13_observar_articuno'},
    {texto:'Sair. Deixar ele em paz.', vai:'c13_saiu_articuno'}
  ]
},

c13_observar_articuno:{
  texto:[
    'Você senta no gelo e espera. Vinte minutos. Quarenta.',
    'Ele não se move. Não uma vez. Nem para respirar de forma visível.',
    'Na hora e dez, você percebe: ele está olhando pra uma direção específica, e não muda.',
    'Você segue a linha do olhar dele. Do outro lado da câmara, congelado numa parede, tem outro Articuno.',
    'Não é reflexo. É outro. Menor. Mais novo.',
    'E o gelo em volta dele tem as mesmas camadas — a mesma contagem de meses.'
  ],
  ef:{flag:'viu_o_segundo_articuno', instabilidade:1,
      registrar:'Existe um segundo Articuno, menor, congelado na parede. O primeiro está velando.'},
  escolhas:[
    {texto:'Tentar libertar o segundo.', vai:'c13_libertar_filhote'},
    {texto:'Perguntar em voz alta o que aconteceu.', vai:'c13_perguntou_articuno'},
    {texto:'Sair sem tocar em nada.', vai:'c13_saiu_articuno'}
  ]
},

c13_perto:{
  texto:[
    'Você anda pelo gelo em camadas, e a cada passo a temperatura cai mais.',
    'A cinco metros, sua respiração congela no ar e cai como pó.',
    'A três metros, ele finalmente se move: vira a cabeça, devagar, e olha.',
    'E você entende, na hora, que ele não está te ameaçando nem te aceitando. Ele está te avaliando pra uma tarefa.',
    'Ele olha pra você, depois olha pra parede do outro lado da câmara, depois olha pra você de novo.',
    'Na parede, congelado, tem outro Articuno. Menor.'
  ],
  ef:{flag:'viu_o_segundo_articuno',
      registrar:'Articuno te mostrou o segundo, congelado na parede.'},
  escolhas:[
    {texto:'Tentar libertar o menor.', vai:'c13_libertar_filhote'},
    {texto:'"Eu não sei como."', vai:'c13_perguntou_articuno'},
    {texto:'Jogar a bola nele agora, que está distraído.', vai:'c13_traicao_articuno'}
  ]
},

c13_perguntou_articuno:{
  texto:[
    '"O que aconteceu aqui?"',
    'Não vem resposta em palavra. Vem em temperatura.',
    'O gelo embaixo dos seus pés fica levemente morno por dois segundos — e você vê, por dentro dele, como um filme preso em âmbar: um barco. Uma rede. Gente.',
    'Depois frio de novo, e a imagem some.',
    'Alguém pescou o menor. Alguém o feriu. E o maior congelou tudo — o mar, a caverna, o tempo — pra que nada piorasse enquanto ele não sabia o que fazer.',
    'Ele não está atacando Kanto. Ele está segurando uma coisa no lugar há meses porque não sabe o que mais fazer.'
  ],
  ef:{flag:['entendeu_articuno','sabe_do_barco'], instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Perguntou a um lendário o que tinha acontecido — e ele respondeu'},
      registrar:'Articuno congelou as Seafoam para preservar o menor, ferido por uma rede.'},
  escolhas:[
    {texto:'Tentar libertar o menor.', vai:'c13_libertar_filhote'},
    {texto:'"Eu vou buscar quem sabe fazer isso."', vai:'c13_buscar_ajuda'},
    {texto:'Sair. Você não tem como ajudar nisso.', vai:'c13_saiu_articuno'}
  ]
},

c13_libertar_filhote:{
  texto:[
    'O gelo em volta do menor tem dois metros de espessura e é duro como pedra.',
    'Você começa a quebrar com o que tem. O maior te observa sem ajudar e sem impedir.'
  ],
  teste:{status:'forca', dificuldade:9, nomeStatus:'Força',
         critico:'c13_libertou', sucesso:'c13_libertou', parcial:'c13_libertou_tarde', falha:'c13_nao_libertou'}
},

c13_libertou:{
  texto:[
    'Quatro horas. Você quebra gelo por quatro horas com as mãos sangrando dentro da luva.',
    'Na quarta, o bloco cede.',
    'O menor cai de lado no chão da caverna e não se mexe por muito tempo — tempo suficiente pra você achar que fez tudo isso por nada.',
    'Depois ele respira.',
    'E o maior, pela primeira vez em meses, sai do pilar.',
    'O que acontece com a temperatura da caverna nos trinta segundos seguintes é a coisa mais bonita que você vai ver na vida: o gelo das paredes começa a rachar e correr, e a água volta, e a caverna volta a ser caverna.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Libertou o segundo Articuno e descongelou as Seafoam'},
      hp:-8, causa:'Quatro horas quebrando gelo nas Seafoam',
      flag:'salvou_o_filhote', instabilidade:-2,
      executar:d=>{
        const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true;
        Estado.dados.mundo.clima = 'normal';
        return [{tipo:'mundo', texto:'Articuno passou a te dever uma. Lendários não esquecem isso também.'}];
      },
      registrar:'Libertou o segundo Articuno. As Seafoam descongelaram.'},
  escolhas:[{texto:'Sair da caverna.', vai:'c13_depois_salvou'}]
},

c13_libertou_tarde:{
  texto:[
    'Cinco horas e meia. Você consegue.',
    'O menor cai no chão e respira — mas a asa esquerda ficou no gelo tempo demais e não abre.',
    'O maior desce do pilar e fica ao lado dele. O gelo da caverna começa a ceder, devagar, em vez de de uma vez.',
    'Ele vai viver. Não vai voar.',
    'Você conseguiu o suficiente e não conseguiu tudo, e essa é a forma mais comum de vitória que existe.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Libertou o segundo Articuno, tarde demais para a asa'},
      hp:-9, causa:'Cinco horas e meia quebrando gelo',
      flag:'salvou_o_filhote_tarde', instabilidade:-1,
      executar:d=>{ const L=Estado.lend(144); L.disposicao='passivo'; return []; },
      registrar:'Libertou o segundo Articuno, mas a asa esquerda não abre mais.'},
  escolhas:[{texto:'Sair.', vai:'c13_depois_salvou'}]
},

c13_nao_libertou:{
  texto:[
    'Seis horas e você não chega nem na metade.',
    'Suas mãos param de funcionar direito. Você senta no gelo e admite em voz alta: "Eu não consigo."',
    'O maior te olha por muito tempo. Depois volta pro pilar, se acomoda, e recomeça a esperar.',
    'Ele já esperou meses. Ele pode esperar mais.',
    'Isso é infinitamente pior do que se ele tivesse te atacado.'
  ],
  ef:{hp:-7, causa:'Exaustão nas Seafoam', flag:'nao_conseguiu_libertar',
      registrar:'Não conseguiu quebrar o gelo. Articuno voltou a esperar.'},
  escolhas:[
    {texto:'Ir buscar quem sabe fazer isso.', vai:'c13_buscar_ajuda'},
    {texto:'Sair e não voltar.', vai:'c13_saiu_articuno'}
  ]
},

c13_buscar_ajuda:{
  texto:[
    'Você sai da caverna e volta a Fuchsia com Seu Bento na mesma noite.',
    d=>{
      if (d.flags.cartao_ivone) return 'A Dra. Ivone chega em dois dias com uma equipe de resgate de fauna marinha e equipamento de corte térmico.';
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=5) return 'Você pede ajuda em Fuchsia e — pela primeira vez na jornada — a sua reputação faz o trabalho: onze pessoas aparecem. Onze.';
      return 'Você pede ajuda em Fuchsia. Duas pessoas aparecem: Seu Bento e um veterinário aposentado.';
    },
    'A operação leva um dia e meio. Corte térmico, corda, três turnos.',
    'Quando o bloco cede, tem gente chorando numa caverna congelada e ninguém se envergonha disso.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Mobilizou gente para libertar o segundo Articuno'},
      flag:['salvou_o_filhote','mobilizou_gente'], instabilidade:-2,
      executar:d=>{ const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true; Estado.dados.mundo.clima='normal'; return []; },
      npc:{nome:'Seu Bento', opiniao:8, memoria:'Participou do resgate do segundo Articuno. Viu antes de morrer.'},
      registrar:'Uma equipe libertou o segundo Articuno. As Seafoam descongelaram.'},
  escolhas:[{texto:'Ver o gelo derreter.', vai:'c13_depois_salvou'}]
},

c13_traicao_articuno:{
  texto:[
    'Ele está te mostrando o filho preso na parede e você joga a bola.',
    'Não tem como suavizar isso.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(144); L.disposicao='hostil'; L.ataquesSofridos+=2; return []; },
      rep:{eixo:'ruim',delta:3,motivo:'Atacou um lendário no momento em que ele pediu ajuda'},
      flag:'traiu_articuno'},
  escolhas:[{texto:'Encarar o que vem.', vai:'c13_luta_articuno'}]
},

c13_luta_articuno:{
  texto:[
    'A câmara inteira baixa dez graus de uma vez.',
    'As colunas de gelo começam a rachar no teto.'
  ],
  batalha:{dex:144, nivel:52, tipo:'lendario', fuga:true, ambiente:'agua',
           vitoria:'c13_pos_articuno', derrota:'c13_pos_articuno', fuga2:'c13_saiu_articuno',
           captura:'c13_capturou_articuno', gameover:'gameover'}
},

c13_pos_articuno:{
  texto:[
    'Ele volta pro pilar.',
    'Não porque venceu ou perdeu. Porque o lugar dele é ali, e ele tem uma coisa pra fazer, e você foi só uma interrupção de vinte minutos numa vigília de meses.'
  ],
  ef:{executar:d=>{
        const L=Estado.lend(144); L.ataquesSofridos++;
        if (L.ataquesSofridos>=2){ L.disposicao='hostil'; return [{tipo:'perigo', texto:'Articuno te marcou. O frio vai te seguir.'}]; }
        return [];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou Articuno nas Seafoam'}, instabilidade:1},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c13_luta_articuno'},
    {texto:'Parar e olhar em volta.', vai:'c13_observar_articuno'},
    {texto:'Sair.', vai:'c13_saiu_articuno'}
  ]
},

c13_capturou_articuno:{
  texto:[
    'A bola fecha.',
    'E o gelo — o gelo que ele estava segurando — começa a ceder no mesmo segundo, porque não tem mais ninguém segurando.',
    'A caverna inteira racha. Colunas caem. A água volta com força de maré represada por meses.',
    'Do outro lado da câmara, na parede que está se partindo, tem outro Articuno congelado.',
    'Você só vê ele durante um segundo e meio, quando a parede cede, antes da água levar tudo.'
  ],
  ef:{instabilidade:3, flag:'capturou_articuno_e_perdeu_o_outro',
      rep:{eixo:'ruim',delta:2,motivo:'Capturou o guardião e a caverna cedeu'},
      registrar:'Capturou Articuno. A caverna cedeu e o segundo Articuno foi levado pela água.'},
  escolhas:[
    {texto:'Mergulhar atrás.', vai:'c13_mergulhou'},
    {texto:'Correr para a saída.', vai:'c13_correu_da_agua'}
  ]
},

c13_mergulhou:{
  texto:[
    'Você mergulha em água de dois graus dentro de uma caverna desabando.',
    'Você não acha nada. Você quase não volta.',
    'Seu Bento te tira da água na entrada da caverna, sozinho, com setenta e quatro anos.',
    '"Burrice", ele diz, enrolando você num cobertor. "Burrice bonita, mas burrice."'
  ],
  ef:{hp:-12, causa:'Mergulho em água de dois graus nas Seafoam',
      rep:{eixo:'bom',delta:1,motivo:'Arriscou a própria vida tentando consertar o próprio erro'},
      flag:'mergulhou_nas_seafoam',
      npc:{nome:'Seu Bento', opiniao:4, memoria:'Te tirou da água gelada sozinho, aos setenta e quatro anos.'}},
  escolhas:[{texto:'Voltar para o barco.', vai:'c13_fim'}]
},

c13_correu_da_agua:{
  texto:[
    'Você corre. Cento e setenta metros de caverna desabando com uma bola no bolso.',
    'Você chega no barco. Seu Bento arranca antes de você sentar.',
    'De cinquenta metros, vocês veem a entrada da caverna sumir.',
    'Seu Bento não pergunta o que tem no seu bolso. Ele vê o seu rosto e decide não perguntar, e esse é um tipo específico de gentileza.'
  ],
  ef:{flag:'saiu_com_articuno'},
  escolhas:[{texto:'Voltar a Fuchsia.', vai:'c13_fim'}]
},

c13_saiu_articuno:{
  texto:[
    'Você sai da câmara e refaz os cento e setenta metros de volta.',
    'Na saída, o ar de fora parece quente, o que é absurdo, porque está fazendo nove graus.',
    d=>d.flags.viu_o_segundo_articuno ? 'Você sabe o que tem lá dentro. Você sabe exatamente o que tem lá dentro, e está indo embora.' :
       'Você não sabe o que viu. Sabe que viu.'
  ],
  ef:{flag:'saiu_das_seafoam'},
  escolhas:[{texto:'Voltar para o barco.', vai:'c13_fim'}]
},

c13_depois_salvou:{
  texto:[
    'Você sai da caverna com água até o joelho — água, não gelo.',
    'Os dois Articuno saem pelo alto, pelo furo natural no teto da ilha, com dez minutos de diferença.',
    'Seu Bento está no barco, de pé, olhando pra cima, e não diz nada por muito tempo.',
    'Depois: "Eu queria ver antes de morrer." Ele senta. "Agora eu não sei mais o que fazer com o resto."'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Devolveu o inverno ao lugar dele'}},
  escolhas:[{texto:'Voltar a Fuchsia.', vai:'c13_fim'}]
},

c13_fim:{
  texto:[
    d=>{
      if (d.flags.salvou_o_filhote) return 'Em Fuchsia, na semana seguinte, a pesca volta. Ninguém liga uma coisa à outra — ninguém sabe. Só você, Seu Bento e dois Articuno.';
      if (d.flags.capturou_articuno_e_perdeu_o_outro) return 'O gelo continua avançando na costa. Sem o guardião segurando, ele avança mais rápido, não menos. Você entendeu isso tarde demais.';
      if (d.flags.nao_conseguiu_libertar) return 'O gelo fica. Você sabe por quê, sabe onde, e não conseguiu. Isso é uma coisa que você vai carregar.';
      return 'O gelo continua onde estava. Fuchsia continua sem pesca.';
    },
    'Do cais de Fuchsia, Cinnabar é visível num dia limpo. Hoje está limpo.',
    'O vulcão está soltando fumaça. Vermelha.'
  ],
  fim:true, resumo:'Capítulo 13 concluído — o inverno tinha um motivo.'
}
}}

);
