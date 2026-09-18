/* ============================================================
   CAPÍTULOS 2–7
   ============================================================ */
CAPITULOS.push(

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 2 — GENTE BOA E GENTE COMUM
   ══════════════════════════════════════════════════════════ */
{
num:2, titulo:'Gente Boa e Gente Comum', local:'Rota 1 / Viridian', ambiente:'campo', nivelArea:8,
tom:'leve', inicio:'c2_estrada',
cenas:{

c2_estrada:{
  texto:[
    'A estrada para Viridian é larga e honesta. Dá pra ver longe. Dá pra ser visto de longe.',
    'Um garoto mais ou menos da sua idade está sentado numa pedra há tempo suficiente pra ter marcado o traseiro na pedra. Ele levanta quando te vê.',
    '"Ô. Você é treinador?" Ele já está pegando a bola do cinto antes de você responder. "Eu sou o Téo. Tô aqui desde as seis e você é a primeira pessoa que passa."'
  ],
  ef:{npc:{nome:'Téo', opiniao:1, memoria:'Primeiro treinador que te desafiou na estrada.'}},
  escolhas:[
    {texto:'Aceitar o desafio.', vai:'c2_batalha_teo'},
    {texto:'"Hoje não." E seguir andando.', vai:'c2_recusa',
     ef:{npc:{nome:'Téo', opiniao:-1, memoria:'Você recusou a primeira batalha dele.'}}},
    {texto:'Sentar na pedra com ele e conversar antes.', vai:'c2_conversa'}
  ]
},

c2_conversa:{
  texto:[
    'Ele te conta que está esperando há três dias. Que a mãe achou que ele não ia durar uma semana. Que ele trouxe comida pra dois "por precaução" e não sabe explicar precaução de quê.',
    'Você divide o que tem. Ele ri alto demais de uma piada mediana.',
    '"Agora a gente luta?" ele pergunta, e é impossível dizer não.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Tratou bem um estranho na estrada'},
      npc:{nome:'Téo', opiniao:4, memoria:'Você sentou, ouviu e dividiu a comida. Ele nunca esqueceu.'},
      flag:'teo_amigo'},
  escolhas:[{texto:'Lutar.', vai:'c2_batalha_teo'}]
},

c2_recusa:{
  texto:[
    '"Ah." Ele senta de novo na pedra. "Tá."',
    'Você anda uns cinquenta metros e ainda consegue sentir ele olhando.'
  ],
  escolhas:[{texto:'Continuar para Viridian.', vai:'c2_viridian'}]
},

c2_batalha_teo:{
  texto:['Téo joga a bola com mais força do que precisa. "VAI!"'],
  batalha:{dex:16, nivel:7, tipo:'treinador', treinador:'Téo', fuga:false,
           vitoria:'c2_pos_batalha', derrota:'c2_pos_derrota', gameover:'gameover'}
},

c2_pos_batalha:{
  texto:[
    'Téo pega o Pidgey no colo antes mesmo de devolver pra bola. "Foi mal, foi mal, você foi bem."',
    'Ele tira dinheiro do bolso e te entrega sem você pedir. É pouco. É quase tudo o que ele tem.',
    '"Regra é regra." Ele sorri, e o sorriso é verdadeiro. "Te encontro no Ginásio de Pewter, hein? Não chega antes de mim."'
  ],
  ef:{dinheiro:400, npc:{nome:'Téo', opiniao:2, memoria:'Perdeu para você na Rota 1 e pagou com um sorriso.'}},
  escolhas:[
    {texto:'"Te espero lá."', vai:'c2_viridian', ef:{rep:{eixo:'bom',delta:1,motivo:'Rivalidade sadia com Téo'}}},
    {texto:'Pegar o dinheiro e ir embora sem responder.', vai:'c2_viridian',
     ef:{npc:{nome:'Téo', opiniao:-2, memoria:'Você pegou o dinheiro dele e não disse nada.'}}}
  ]
},

c2_pos_derrota:{
  texto:[
    'Téo parece mais assustado que você. "Ei — ei, tá tudo bem? Tem Centro Pokémon em Viridian, é perto, eu te levo."',
    'Ele te leva. Não aceita nada em troca. Fala o caminho inteiro pra você não pensar na derrota.'
  ],
  ef:{curaTime:true, npc:{nome:'Téo', opiniao:3, memoria:'Te levou até o Centro Pokémon depois de te vencer.'}},
  escolhas:[{texto:'Chegar em Viridian.', vai:'c2_viridian'}]
},

c2_viridian:{
  texto:[
    'Viridian tem prédio de dois andares e semáforo. Pra quem veio de onde você veio, isso é uma cidade grande.',
    'O Centro Pokémon cheira a desinfetante e a sopa. Tem um mural de recados na entrada, cheio de bilhetes de gente procurando gente.',
    'Perto da máquina de café, um homem de casaco pesado demais para o clima segura uma Poké Ball e te olha como quem já decidiu alguma coisa.'
  ],
  escolhas:[
    {texto:'Falar com ele.', vai:'c2_troca'},
    {texto:'Ler o mural de recados.', vai:'c2_mural'},
    {texto:'Ignorar e descansar.', vai:'c2_fim', ef:{curaTime:true}}
  ]
},

c2_mural:{
  texto:[
    '"Procuro meu Growlithe. Sumiu dia 4 perto da Rota 22. Recompensa."',
    '"Meu filho saiu pra jornada em março. Se alguém vir, diz que a mãe não tá brava."',
    '"NÃO ENTRE NA FLORESTA DE VIRIDIAN À NOITE." — sem assinatura, escrito com pressa, três vezes sublinhado.',
    'Você olha essa última por um tempo desnecessário.'
  ],
  ef:{flag:'leu_aviso_floresta'},
  escolhas:[
    {texto:'Falar com o homem do casaco.', vai:'c2_troca'},
    {texto:'Descansar e seguir.', vai:'c2_fim', ef:{curaTime:true}}
  ]
},

c2_troca:{
  texto:[
    '"Você tem cara de quem tá começando." Não é ofensa, do jeito que ele fala. "Eu tenho um bicho aqui que não combina comigo. Nunca combinou."',
    'Ele mostra a bola. Dentro, alguma coisa se mexe devagar.',
    '"Troco por qualquer um dos seus. Sem escolher, sem olhar. Você me dá um, eu te dou esse. Topa?"'
  ],
  escolhas:[
    {texto:'Trocar. (Você escolhe quem entrega — e não sabe o que recebe.)', vai:'c2_troca_feita', trocaNPC:true},
    {texto:'Recusar educadamente.', vai:'c2_fim', ef:{curaTime:true}}
  ]
},

c2_troca_feita:{
  texto:[
    'A troca é rápida demais para o tamanho do que ela significa.',
    '"Cuida dele", o homem diz, e vai embora antes de você conferir o que recebeu.'
  ],
  escolhas:[{texto:'Descansar e seguir.', vai:'c2_fim', ef:{curaTime:true}}]
},

c2_fim:{
  texto:[
    'À noite, no alojamento do Centro, dá pra ouvir outros treinadores conversando baixo no corredor.',
    'Alguém fala da Floresta de Viridian. Alguém manda o outro calar a boca.',
    'Você dorme bem. É a última vez em muito tempo.'
  ],
  fim:true, resumo:'Capítulo 2 concluído — você conheceu gente.'
}
}},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 3 — O QUE TEM DEBAIXO DAS FOLHAS
   (primeiro desconforto)
   ══════════════════════════════════════════════════════════ */
{
num:3, titulo:'O Que Tem Debaixo das Folhas', local:'Floresta de Viridian', ambiente:'floresta', nivelArea:10,
tom:'inquieto', inicio:'c3_entrada',
cenas:{

c3_entrada:{
  texto:[
    'A Floresta de Viridian não é escura. É pior: é verde demais, e a luz que passa pelas copas deixa tudo com a mesma cor, e você perde a noção de profundidade.',
    'O barulho é constante — insetos, folhas, alguma coisa grande longe. Depois de vinte minutos, o barulho é que fica normal, e o silêncio é que assusta.',
    d=>d.flags.leu_aviso_floresta ? 'Você lembra do bilhete no mural. Três vezes sublinhado.' : 'Ninguém te avisou de nada. Talvez não tivesse nada pra avisar.'
  ],
  escolhas:[
    {texto:'Seguir a trilha marcada. Mais longo, mais seguro.', vai:'c3_trilha'},
    {texto:'Cortar caminho pelo mato fechado.', vai:'c3_atalho'}
  ]
},

c3_trilha:{
  texto:[
    'A trilha tem marcas de facão velhas, cicatrizadas no tronco das árvores. Alguém passou por aqui e quis que outros conseguissem passar depois.',
    'Você anda quase duas horas sem incidente. Quase.'
  ],
  teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção',
         critico:'c3_achou_cedo', sucesso:'c3_achou_cedo', parcial:'c3_som', falha:'c3_emboscada'}
},

c3_atalho:{
  texto:[
    'O mato fecha atrás de você em cinco passos. Em quinze, você não sabe mais de que lado entrou.',
    'Tem um cheiro aqui que não é de floresta. É adocicado e errado.'
  ],
  ef:{flag:'entrou_no_fechado'},
  teste:{status:'percepcao', dificuldade:8, nomeStatus:'Percepção',
         critico:'c3_achou_cedo', sucesso:'c3_som', parcial:'c3_emboscada', falha:'c3_emboscada'}
},

c3_emboscada:{
  texto:[
    'Você não vê chegar. Nenhum aviso — só o peso em cima de você e o chão vindo rápido demais.',
    'Alguma coisa te derruba de lado e você bate o ombro numa raiz. Dói do jeito que machucado de verdade dói: com atraso.'
  ],
  ef:{hp:-4, causa:'Emboscada na Floresta de Viridian'},
  batalha:{aleatorio:true, ambiente:'floresta', nivelBase:14, tipo:'selvagem',
           vitoria:'c3_som', derrota:'c3_som', fuga:'c3_som', captura:'c3_som', gameover:'gameover'}
},

c3_achou_cedo:{
  texto:[
    'Você vê antes de pisar: o chão à frente está errado. As folhas estão amassadas num rastro largo, e o rastro é fresco.',
    'Você contorna. O que quer que tenha feito aquilo não te viu.',
    'Cinquenta metros depois, você entende o que era o cheiro.'
  ],
  ef:{rep:{eixo:'bom',delta:0,motivo:''}},
  escolhas:[{texto:'Continuar.', vai:'c3_som'}]
},

c3_som:{
  texto:[
    'É um som fino e repetido. Não é chamado de acasalamento, não é aviso de território. Você não sabe nomear, mas o seu corpo sabe: é dor.',
    'Numa clareira pequena, um Pikachu está preso. Não numa armadilha de caça — num fio de aço amarrado em torno da pata traseira, preso a uma estaca. Amarrado por gente.',
    'Ele está aqui há dias. Dá pra ver pelo chão em volta, girado até virar terra batida.',
    'E tem uma mochila jogada a três metros. De alguém que voltou pra buscar depois. Ou que não voltou.'
  ],
  ef:{flag:'achou_pikachu', registrar:'Encontrou um Pikachu preso por gente na Floresta de Viridian.'},
  escolhas:[
    {texto:'Soltar o Pikachu. Devagar, com as mãos.', vai:'c3_soltar'},
    {texto:'Soltar e tentar capturar antes que ele fuja.', vai:'c3_capturar'},
    {texto:'Pegar a mochila e ir embora. Não é problema seu.', vai:'c3_mochila'},
    {texto:'Deixar tudo como está. Não mexer em nada.', vai:'c3_deixar'}
  ]
},

c3_soltar:{
  texto:[
    'Você chega agachado, de lado, sem encarar. Leva quatro minutos pra chegar perto o suficiente pra tocar no fio.',
    'Ele te dá um choque. Não de ataque — de pânico. Queima a mão e você não solta.',
    'O fio cede. O Pikachu não corre. Fica ali, tremendo, olhando a pata que não sabe mais como usar.'
  ],
  ef:{hp:-3, causa:'Choque ao soltar o Pikachu',
      rep:{eixo:'bom',delta:2,motivo:'Libertou um Pokémon preso por caçadores'},
      registrar:'Libertou o Pikachu da armadilha.'},
  escolhas:[
    {texto:'Ficar até ele conseguir andar.', vai:'c3_ficar'},
    {texto:'Ir embora. Você fez a sua parte.', vai:'c3_ir_embora'}
  ]
},

c3_ficar:{
  texto:[
    'Você fica. Uma hora, talvez mais. Divide a água. Ele aceita na terceira tentativa.',
    'Quando ele finalmente apoia a pata no chão e dá dois passos, olha pra você de um jeito que não é gratidão — Pokémon selvagem não faz gratidão. É reconhecimento. Ele decorou você.',
    'Depois some no mato. E volta em dez minutos. E te segue.'
  ],
  ef:{pokemon:{dex:25, nivel:12, opcoes:{natureza:'Jolly', moral:85, historia:'Você o soltou de uma armadilha na Floresta de Viridian e esperou ele conseguir andar.'}},
      rep:{eixo:'bom',delta:1,motivo:'Esperou o Pokémon ferido se recuperar'},
      flag:'pikachu_aliado', registrar:'O Pikachu libertado passou a te seguir.'},
  escolhas:[{texto:'Seguir com ele.', vai:'c3_caçadores'}]
},

c3_ir_embora:{
  texto:[
    'Você vira as costas. Atrás de você, o som fino continua por mais um tempo, mais baixo agora.',
    'Não é culpa. É só que você vai lembrar disso.'
  ],
  ef:{registrar:'Soltou o Pikachu e foi embora sem olhar para trás.'},
  escolhas:[{texto:'Continuar.', vai:'c3_caçadores'}]
},

c3_capturar:{
  texto:[
    'Você solta o fio e joga a bola no mesmo movimento, antes que ele consiga sair do lugar.',
    'Ele não luta. Não tem como lutar — está há dias amarrado. A bola fecha sem resistência nenhuma.',
    'Foi fácil demais. Isso devia significar alguma coisa.'
  ],
  ef:{executar:d=>{
        const p = criarPokemon(25, 12, {natureza:'Lonely', moral:15, historia:'Capturado enquanto estava preso e ferido. Não escolheu você.'});
        p.status = 'veneno'; p.hp = Math.max(1, Math.floor(p.hpMax*0.3));
        Estado.adicionar(p);
        Estado.registrar('Capturou o Pikachu enquanto ele estava preso e indefeso.');
        return [{tipo:'pokemon', texto:`Pikachu (Nv 12, Lonely) entrou no time — ferido, com 30% de HP, e com a moral no chão.`}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Capturou um Pokémon indefeso numa armadilha'},
      flag:'pikachu_capturado_preso'},
  escolhas:[{texto:'Seguir.', vai:'c3_caçadores'}]
},

c3_mochila:{
  texto:[
    'A mochila tem comida velha, um mapa rabiscado e três Great Balls. E um caderno.',
    'O caderno tem uma lista. Datas, lugares, espécies, e do lado de cada uma um preço.',
    'Você entende o que era a armadilha. Você entende que quem armou vai voltar.',
    'O Pikachu continua girando na estaca atrás de você enquanto você lê.'
  ],
  ef:{itens:{'Great Ball':3}, dinheiro:600, flag:'pegou_mochila_cacador',
      rep:{eixo:'ruim',delta:1,motivo:'Saqueou e deixou um Pokémon preso para trás'},
      registrar:'Pegou a mochila do caçador e deixou o Pikachu amarrado.'},
  escolhas:[
    {texto:'Voltar e soltar o Pikachu mesmo assim.', vai:'c3_soltar'},
    {texto:'Ir embora com a mochila.', vai:'c3_caçadores'}
  ]
},

c3_deixar:{
  texto:[
    'Você dá a volta na clareira. Não toca em nada.',
    'A trilha continua do outro lado. O som fino acompanha você por uns duzentos metros até sumir na distância.',
    'Você não fez nada. Isso também é uma coisa que você fez.'
  ],
  ef:{rep:{eixo:'ruim',delta:1,motivo:'Virou as costas para um Pokémon preso sofrendo'},
      flag:'ignorou_pikachu', registrar:'Deixou o Pikachu preso na armadilha.'},
  escolhas:[{texto:'Continuar.', vai:'c3_caçadores'}]
},

c3_caçadores:{
  texto:[
    'Dois homens vêm pela trilha em sentido contrário. Roupa boa demais pra floresta. Um deles carrega um rolo de fio de aço no ombro, sem disfarçar.',
    'Eles param quando te veem. O da frente olha pra suas mãos, depois pro seu cinto, depois pros seus olhos. Nessa ordem.',
    d=>d.flags.pegou_mochila_cacador ? '"Essa mochila é minha", ele diz. Sem levantar a voz.' :
       (d.flags.pikachu_aliado || d.flags.pikachu_capturado_preso ? '"Cadê o amarelo", ele diz. Não é pergunta.' :
        '"Viu alguma coisa aí atrás?" Ele sorri. O sorriso não sobe até os olhos.')
  ],
  escolhas:[
    {texto:'Enfrentar. Alguém tem que enfrentar.', vai:'c3_luta_cacador'},
    {texto:'Mentir. Dizer que não viu nada.', vai:'c3_mentir'},
    {texto:'Negociar — eles têm dinheiro, você tem informação.', vai:'c3_negociar'}
  ]
},

c3_luta_cacador:{
  texto:['O homem suspira como quem já fez isso antes. "Tá." Ele solta a bola no chão em vez de jogar.'],
  batalha:{dex:24, nivel:16, tipo:'treinador', treinador:'Caçador Vasco', fuga:false,
           vitoria:'c3_venceu_cacador', derrota:'c3_perdeu_cacador', gameover:'gameover'}
},

c3_venceu_cacador:{
  texto:[
    'O Arbok volta pra bola e o homem não reclama, não xinga, não ameaça. Ele só te olha com atenção nova, do jeito que se olha uma despesa inesperada.',
    '"Anota aí", ele diz pro parceiro. E o parceiro anota. Anota o seu rosto.',
    'Eles saem pela trilha. Sem pressa nenhuma.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Enfrentou caçadores na Floresta de Viridian'},
      npc:{nome:'Caçador Vasco', opiniao:-5, memoria:'Você o derrotou na floresta. Ele anotou seu rosto.'},
      flag:'inimigo_cacadores', registrar:'Fez inimigos: os caçadores da floresta anotaram seu rosto.'},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_perdeu_cacador:{
  texto:[
    'Quando acaba, ele se agacha na sua frente pra ficar na sua altura.',
    '"Você é novo. Então eu vou te explicar uma vez." Ele fala baixo, quase gentil. "Essa floresta é grande e ninguém vem procurar ninguém aqui. Da próxima vez que você me ver, você olha pro chão e passa."',
    'Ele pega o que quer da sua mochila. Não pega tudo. Deixa o suficiente pra você chegar em Pewter — porque um morto na floresta dá trabalho, e você vivo e calado não dá nenhum.'
  ],
  ef:{dinheiro:-500, hp:-5, causa:'Espancamento na Floresta de Viridian',
      npc:{nome:'Caçador Vasco', opiniao:-3, memoria:'Te derrubou na floresta e te deixou ir. Como aviso.'},
      flag:'humilhado_cacadores', registrar:'Perdeu para os caçadores e foi deixado como aviso.'},
  escolhas:[{texto:'Levantar e sair da floresta.', vai:'c3_fim'}]
},

c3_mentir:{
  texto:['"Não vi nada."'],
  teste:{status:'carisma', dificuldade:7, nomeStatus:'Carisma',
         critico:'c3_mentiu_bem', sucesso:'c3_mentiu_bem', parcial:'c3_mentiu_mal', falha:'c3_luta_cacador'}
},

c3_mentiu_bem:{
  texto:[
    'Você mente bem. Mais fácil do que devia ser.',
    'Ele acredita, ou finge acreditar, o que dá no mesmo pelos próximos cinco minutos. Eles passam por você e seguem trilha adentro.',
    'Quando eles somem na curva, você percebe que estava segurando a respiração.'
  ],
  ef:{flag:'mentiu_cacadores'},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_mentiu_mal:{
  texto:[
    'Você mente, mas o rosto entrega. Ele olha pra você mais um segundo do que seria confortável.',
    '"Certo", ele diz. Não acreditou. Deixou passar mesmo assim — porque não vale o trabalho hoje.',
    '"A gente se vê."'
  ],
  ef:{npc:{nome:'Caçador Vasco', opiniao:-2, memoria:'Você mentiu mal para ele na floresta.'}},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_negociar:{
  texto:['"Tem um Pikachu preso lá atrás. Quanto vale a informação?"'],
  teste:{status:'carisma', dificuldade:8, nomeStatus:'Carisma',
         critico:'c3_negociou', sucesso:'c3_negociou', parcial:'c3_negociou_mal', falha:'c3_negociou_mal'}
},

c3_negociou:{
  texto:[
    'O homem ri pela primeira vez de verdade. Conta as notas na sua mão, uma por uma, olhando pra você o tempo todo.',
    '"Olha só. Você aprende rápido." Ele guarda a carteira. "Se cansar de brincar de treinador, pergunta por mim em Celadon."',
    'O dinheiro pesa no bolso de um jeito estranho.'
  ],
  ef:{dinheiro:1500, rep:{eixo:'ruim',delta:2,motivo:'Vendeu a localização de um Pokémon preso a caçadores'},
      npc:{nome:'Caçador Vasco', opiniao:2, memoria:'Você vendeu informação pra ele. Ele te acha promissor.'},
      flag:'vendeu_para_cacadores', registrar:'Vendeu informação para os caçadores. Eles gostaram de você.'},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_negociou_mal:{
  texto:[
    '"Informação." Ele repete a palavra como se fosse engraçada. "Garoto, eu amarrei o bicho. Eu sei onde ele tá."',
    'Ele te dá uma nota pequena. Menos por pena e mais por achar graça.',
    '"Toma. Compra um lanche."'
  ],
  ef:{dinheiro:300, rep:{eixo:'ruim',delta:1,motivo:'Tentou vender informação a caçadores'},
      flag:'vendeu_para_cacadores'},
  escolhas:[{texto:'Sair da floresta.', vai:'c3_fim'}]
},

c3_fim:{
  texto:[
    'A saída da floresta dá numa descida de pedra, e Pewter aparece lá embaixo, cinza e sólida, com fumaça de chaminé subindo reta.',
    'Você senta na pedra por um tempo antes de descer.',
    d=>d.flags.ignorou_pikachu || d.flags.vendeu_para_cacadores
       ? 'Alguma coisa ficou naquela floresta que era sua. Você não vai conseguir explicar o que foi, nem pra você mesmo.'
       : 'Você entrou numa floresta achando que o perigo era o mato. O mato era a parte fácil.'
  ],
  fim:true, resumo:'Capítulo 3 concluído — você descobriu que gente é pior que bicho.'
}
}},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 4 — PEDRA SOBRE PEDRA
   ══════════════════════════════════════════════════════════ */
{
num:4, titulo:'Pedra Sobre Pedra', local:'Pewter', ambiente:'montanha', nivelArea:14,
tom:'inquieto', inicio:'c4_cidade',
cenas:{

c4_cidade:{
  texto:[
    'Pewter é uma cidade de pedra que decidiu ser sobre pedra. Museu de pedra, ginásio de pedra, gente com cara de pedra.',
    d=>{
      const t = d.npcs['Téo'];
      if (t && t.opiniao >= 2) return 'Téo está sentado na escada do Centro Pokémon e levanta com o braço erguido quando te vê. Ele chegou primeiro. Está insuportavelmente feliz com isso.';
      if (t) return 'Téo está sentado na escada do Centro Pokémon. Ele te vê. Não levanta.';
      return 'Um garoto na escada do Centro Pokémon te olha como se te conhecesse, depois desiste da ideia.';
    },
    d=>Estado.rep.eixo === 'ruim' && Estado.rep.ruim >= 3
       ? 'Duas pessoas atravessam a rua quando você passa. Notícia corre mais rápido do que gente anda.'
       : 'Ninguém te reconhece aqui. É bom, por enquanto.'
  ],
  escolhas:[
    {texto:'Ir direto ao Ginásio.', vai:'c4_ginasio'},
    {texto:'Falar com Téo primeiro.', vai:'c4_teo', cond:d=>!!d.npcs['Téo']},
    {texto:'Passar no museu. Dizem que tem fóssil de verdade.', vai:'c4_museu'}
  ]
},

c4_teo:{
  texto:[
    '"Eu perdi", ele diz antes de você perguntar. "Duas vezes. O Onix dele é do tamanho de um ônibus, cara."',
    'Ele ri, mas é o riso de quem está com medo de não servir pra isso.',
    '"Você vai entrar hoje?"'
  ],
  escolhas:[
    {texto:'"A gente entra junto. Você assiste, eu assisto."', vai:'c4_ginasio',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Apoiou um treinador em baixa'},
         npc:{nome:'Téo',opiniao:3,memoria:'Você ficou do lado dele depois que ele perdeu duas vezes.'},
         flag:'teo_assiste'}},
    {texto:'"Talvez isso não seja pra todo mundo."', vai:'c4_ginasio',
     ef:{rep:{eixo:'ruim',delta:1,motivo:'Humilhou um amigo em baixa'},
         npc:{nome:'Téo',opiniao:-4,memoria:'Você disse que talvez ele não servisse pra isso. Ele ouviu de você.'},
         flag:'teo_ferido'}}
  ]
},

c4_museu:{
  texto:[
    'O museu tem duas salas e um funcionário. Na segunda sala, atrás do vidro, um Kabutops reconstruído em pedra.',
    'A placa diz: "Extinto há aproximadamente 300 milhões de anos."',
    'Uma mulher de jaleco está parada na frente do vidro, anotando. Ela fala sem olhar pra você: "Extinto é uma palavra otimista. Presume que acabou."',
    'Ela vira. Tem olheiras de três dias. "Você vai pro Monte da Lua?"'
  ],
  ef:{npc:{nome:'Dra. Ivone', opiniao:1, memoria:'Encontrou você no museu de Pewter falando de fósseis.'}},
  escolhas:[
    {texto:'"Vou. Por quê?"', vai:'c4_ivone'},
    {texto:'Sair sem responder.', vai:'c4_cidade2'}
  ]
},

c4_ivone:{
  texto:[
    '"Porque alguém está tirando coisa de lá." Ela fecha o caderno. "Fóssil não anda sozinho até um mercado em Celadon."',
    '"Eu reportei. A Liga mandou um oficial, o oficial escreveu um relatório, e o relatório está numa gaveta."',
    'Ela te dá um cartão amassado com um número escrito à mão. "Se você vir alguma coisa lá dentro, me liga. Não liga pra Liga. Liga pra mim."'
  ],
  ef:{flag:'cartao_ivone', npc:{nome:'Dra. Ivone', opiniao:3, memoria:'Te deu o número dela por causa dos fósseis do Monte da Lua.'},
      registrar:'Dra. Ivone pediu ajuda sobre o tráfico de fósseis no Monte da Lua.'},
  escolhas:[{texto:'Guardar o cartão.', vai:'c4_cidade2'}]
},

c4_cidade2:{
  texto:['O ginásio fica no fim da rua. Porta de metal, sem placa bonita.'],
  escolhas:[{texto:'Entrar.', vai:'c4_ginasio'}]
},

c4_ginasio:{
  texto:[
    'O chão do ginásio é de terra batida sobre pedra. Não tem arquibancada — tem uma linha pintada e um homem parado do outro lado dela.',
    '"Primeira insígnia?" Ele nem espera resposta. "Então escuta: eu não pego leve. Se eu pegar leve, você morre na segunda cidade achando que era bom."',
    d=>d.flags.teo_assiste ? 'Téo senta no chão encostado na parede, de braços cruzados, torcendo sem fazer barulho.' : 'Não tem ninguém assistindo.'
  ],
  batalha:{dex:74, nivel:14, tipo:'treinador', treinador:'Líder Brock', fuga:false,
           timeExtra:[{dex:95, nivel:17}],
           vitoria:'c4_venceu', derrota:'c4_perdeu', gameover:'gameover'}
},

c4_venceu:{
  texto:[
    'O Onix cai de lado e o chão inteiro sente. A poeira leva um tempo pra assentar.',
    'Brock atravessa a linha pintada e te entrega a insígnia na mão, não no ar.',
    '"Você tem alguma coisa." Ele olha pro seu time. "Cuida deles melhor do que você cuida de você. Treinador ruim é o que se esquece disso."',
    d=>d.flags.teo_assiste ? 'Téo grita. Grita mesmo. O eco é constrangedor e perfeito.' : ''
  ],
  ef:{insignia:'Insígnia Pedra', rep:{eixo:'bom',delta:1,motivo:'Primeira insígnia de Kanto'},
      dinheiro:1200, itens:{'Super Potion':2},
      npc:{nome:'Líder Brock', opiniao:3, memoria:'Você venceu o ginásio dele e ele te mandou cuidar do time.'},
      registrar:'Conquistou a Insígnia Pedra.'},
  escolhas:[{texto:'Sair para o Monte da Lua.', vai:'c4_fim'}]
},

c4_perdeu:{
  texto:[
    'Você perde. Não por pouco.',
    'Brock não comemora. Ele recolhe o Onix e vem até você com uma Super Potion na mão.',
    '"Volta." Ele diz isso como ordem, não como consolo. "Amanhã, semana que vem, quando for. Mas volta."',
    d=>d.flags.teo_assiste ? 'Téo não fala nada. Só senta do seu lado no chão do ginásio por um tempo.' : ''
  ],
  ef:{curaTime:true, itens:{'Super Potion':2}, flag:'perdeu_brock',
      npc:{nome:'Líder Brock', opiniao:1, memoria:'Você perdeu para ele e ele te mandou voltar.'}},
  escolhas:[
    {texto:'Treinar na saída da cidade e voltar.', vai:'c4_ginasio', ef:{executar:d=>{
       d.time.forEach(p=>{ const ev=ganharExp(p, 260); });
       return [{tipo:'info', texto:'Você treina até o braço doer. O time sobe de nível.'}];
    }}},
    {texto:'Seguir sem a insígnia. Você volta depois.', vai:'c4_fim',
     ef:{flag:'sem_insignia_pedra'}}
  ]
},

c4_fim:{
  texto:[
    'A estrada pro Monte da Lua sobe. Dá pra ver a entrada da caverna de longe, uma boca preta na pedra cinza.',
    d=>d.flags.cartao_ivone ? 'O cartão da Dra. Ivone está no seu bolso, amassando devagar.' : 'Você não sabe o que tem lá dentro. Ninguém que você conhece sabe.',
    'Começa a escurecer. Você podia esperar de manhã. Você não espera.'
  ],
  fim:true, resumo:'Capítulo 4 concluído — Pewter ficou pra trás.'
}
}},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 5 — O QUE SOBROU DA ROCKET
   ══════════════════════════════════════════════════════════ */
{
num:5, titulo:'O Que Sobrou da Rocket', local:'Monte da Lua', ambiente:'caverna', nivelArea:18,
tom:'sombrio', inicio:'c5_entrada',
cenas:{

c5_entrada:{
  texto:[
    'A caverna engole o som. Três passos lá dentro e a sua respiração vira a coisa mais alta do mundo.',
    'Tem cabo elétrico no chão. Grosso, industrial, preso na parede com abraçadeiras novas. Alguém montou infraestrutura aqui.',
    'A Equipe Rocket acabou há dois anos. Red desmontou a organização, prenderam quem dava pra prender, e o resto virou notícia velha.',
    'Mas organização que acaba deixa gente. E gente precisa comer.'
  ],
  ef:{registrar:'Entrou no Monte da Lua e encontrou instalação elétrica recente.'},
  escolhas:[
    {texto:'Seguir o cabo.', vai:'c5_cabo'},
    {texto:'Evitar o cabo e procurar a saída pelo outro lado.', vai:'c5_desvio'}
  ]
},

c5_desvio:{
  texto:[
    'Você vai pelo túnel lateral. É mais estreito e mais longo e a sua lanterna começa a ficar amarela depois de uma hora.',
    'O túnel te devolve exatamente onde você não queria: numa passarela de metal, acima de uma câmara iluminada.',
    'Não dava pra evitar. Só dava pra chegar depois.'
  ],
  escolhas:[{texto:'Olhar para baixo.', vai:'c5_camara'}]
},

c5_cabo:{
  texto:[
    'O cabo te leva por vinte minutos de caverna. Depois vira luz.',
    'Uma câmara natural, grande, com refletores de obra montados nas paredes. Mesas. Caixas plásticas empilhadas com etiqueta.',
    'E gaiolas.'
  ],
  escolhas:[{texto:'Chegar mais perto.', vai:'c5_camara'}]
},

c5_camara:{
  texto:[
    'As gaiolas são pequenas demais. Clefairy em quase todas — cinco, seis por gaiola. Um Paras numa sozinho, que não se mexe.',
    'Nas mesas, fósseis. Meio expostos ainda na rocha, com etiqueta numerada e preço a lápis. Kabuto. Omanyte. Coisas de trezentos milhões de anos com adesivo de leilão.',
    'Três pessoas trabalhando. Nenhuma de uniforme. O uniforme acabou junto com a organização; o trabalho não.',
    'Um deles é o Vasco. O da floresta. Ele levanta a cabeça.'
  ],
  ef:{npc:{nome:'Caçador Vasco', memoria:'Você o encontrou de novo no Monte da Lua, trabalhando com fósseis e gaiolas.'},
      registrar:'Encontrou a operação de tráfico no Monte da Lua. Vasco está lá.'},
  escolhas:[
    {texto:'Atacar. Agora, antes que eles se organizem.', vai:'c5_ataque'},
    {texto:'Recuar e ligar para a Dra. Ivone.', vai:'c5_ligar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Recuar e avisar a Liga Pokémon.', vai:'c5_liga'},
    {texto:'Descer e conversar. Eles precisam de gente.', vai:'c5_proposta'},
    {texto:'Sair de fininho. Isso é grande demais.', vai:'c5_fugir'}
  ]
},

c5_ataque:{
  texto:[
    '"Sério?" Vasco nem parece bravo. Parece cansado. "Sério mesmo?"',
    'Ele solta a bola.'
  ],
  batalha:{dex:89, nivel:22, tipo:'treinador', treinador:'Vasco', fuga:false,
           timeExtra:[{dex:42, nivel:24}],
           vitoria:'c5_venceu', derrota:'c5_perdeu', gameover:'gameover'}
},

c5_venceu:{
  texto:[
    'Os outros dois correm. Vasco fica, porque correr na frente de alguém que te venceu é pior do que apanhar.',
    '"Você acha que salvou eles." Ele aponta as gaiolas com o queixo. "Abre. Vai, abre. Metade não sai. Tão aqui há semanas."',
    'Você abre. Ele tem razão sobre a metade.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Desmontou uma operação de tráfico no Monte da Lua'},
      itens:{'Ultra Ball':1,'Hyper Potion':1}, dinheiro:900,
      npc:{nome:'Caçador Vasco', opiniao:-8, memoria:'Você destruiu a operação dele no Monte da Lua. Ele não esquece.'},
      flag:'destruiu_operacao', registrar:'Libertou os Pokémon do Monte da Lua e fez um inimigo permanente.'},
  escolhas:[
    {texto:'Carregar o Paras que não se mexe até o Centro Pokémon. São três horas de caminhada.', vai:'c5_paras'},
    {texto:'Ir embora. Você já fez o que dava.', vai:'c5_fim'}
  ]
},

c5_paras:{
  texto:[
    'Três horas e vinte. O Paras pesa mais do que parece e a caverna é toda subida.',
    'Ele morre na segunda hora. Você percebe e continua carregando mesmo assim, porque largar ele no meio do caminho é pior do que qualquer coisa.',
    'A enfermeira do Centro pega ele das suas mãos com cuidado, mesmo sabendo. Depois te serve um chá e não pergunta nada.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Carregou um Pokémon moribundo por três horas'},
      hp:-4, causa:'Exaustão no Monte da Lua',
      flag:'carregou_paras', registrar:'Carregou o Paras por três horas. Ele morreu no caminho.'},
  escolhas:[{texto:'Seguir.', vai:'c5_fim'}]
},

c5_perdeu:{
  texto:[
    'Dessa vez ele não te deixa ir com um aviso.',
    'Você acorda do lado de fora da caverna, com o sol na cara e o gosto de ferro na boca. Sua mochila está do seu lado, revirada.',
    'Eles não te mataram. Isso não é misericórdia — é logística. Corpo dá trabalho.',
    'Quando você volta lá dentro, não tem mais nada. Nem cabo, nem mesa, nem gaiola. Nem os bichos.'
  ],
  ef:{hp:-9, causa:'Espancado no Monte da Lua', dinheiro:-1000,
      flag:'operacao_escapou', instabilidade:1,
      npc:{nome:'Caçador Vasco', opiniao:-4, memoria:'Te derrubou no Monte da Lua e levou tudo embora.'},
      registrar:'Perdeu no Monte da Lua. A operação se mudou e levou os Pokémon.'},
  escolhas:[{texto:'Seguir para Cerulean.', vai:'c5_fim'}]
},

c5_ligar:{
  texto:[
    'Você recua até pegar sinal. A Dra. Ivone atende no segundo toque, como quem dorme com o telefone na mão.',
    'Você fala. Ela não interrompe uma vez.',
    '"Fica longe", ela diz. "Eu levo gente de imprensa. Com a Liga eles somem antes; com câmera eles não somem."',
    'Ela chega em seis horas com quatro pessoas e uma câmera. Você fica na entrada da caverna esse tempo todo, porque alguém tem que ficar olhando a boca do buraco.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Expôs o tráfico do Monte da Lua à imprensa'},
      npc:{nome:'Dra. Ivone', opiniao:6, memoria:'Você ligou pra ela do Monte da Lua. Ela nunca vai esquecer isso.'},
      flag:'expos_operacao', dinheiro:500,
      registrar:'Expôs a operação do Monte da Lua com a Dra. Ivone e a imprensa.'},
  escolhas:[{texto:'Ver o que acontece.', vai:'c5_imprensa'}]
},

c5_imprensa:{
  texto:[
    'Sai no jornal de Pewter e no de Cerulean. Seu nome aparece — pequeno, errado, com uma letra trocada. Você lê umas dez vezes.',
    'Dezessete Clefairy foram para um centro de recuperação. Onze voltaram para o Monte da Lua depois. Os outros seis não.',
    'Prenderam duas pessoas. Vasco não estava entre elas.',
    'A Dra. Ivone te manda uma mensagem três dias depois: "Foi o que deu pra fazer. Quase nunca é o que a gente queria."'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Seu nome saiu no jornal pela primeira vez'},
      npc:{nome:'Caçador Vasco', opiniao:-6, memoria:'Você o expôs no jornal. Ele escapou e sabe que foi você.'},
      flag:'vasco_solto'},
  escolhas:[{texto:'Seguir para Cerulean.', vai:'c5_fim'}]
},

c5_liga:{
  texto:[
    'Você liga para a Liga Pokémon. Um atendente educado anota tudo, repete o seu nome duas vezes e diz que "um oficial será designado".',
    'O oficial chega em dois dias. A caverna está vazia há um dia e meio.',
    'Ele tira fotos do cabo cortado e das marcas de mesa no chão, agradece a sua colaboração, e te dá um formulário.',
    '"Isso aqui é comum", ele diz, e é a frase mais assustadora do dia.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Reportou o tráfico às autoridades'},
      flag:'operacao_escapou', instabilidade:1,
      registrar:'Reportou à Liga. Eles chegaram tarde demais.'},
  escolhas:[{texto:'Seguir para Cerulean.', vai:'c5_fim'}]
},

c5_proposta:{
  texto:[
    'Você desce a passarela fazendo barulho de propósito, com as mãos à mostra.',
    'Vasco te reconhece e leva três segundos pra decidir o que você é. Depois ri.',
    '"Olha só quem cresceu." Ele limpa a mão no jeans e estende. "Eu preciso de gente que anda em rota e não chama atenção. Paga bem. Você nem precisa pegar em gaiola — só carrega e cala a boca."'
  ],
  escolhas:[
    {texto:'Apertar a mão.', vai:'c5_aceitou'},
    {texto:'Recusar e sair andando devagar.', vai:'c5_recusou_perto'},
    {texto:'Apertar a mão — e avisar a Dra. Ivone depois.', vai:'c5_duplo', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c5_aceitou:{
  texto:[
    'A mão dele é seca e firme. O acordo leva onze segundos.',
    'Você carrega duas caixas até um caminhão numa estrada de terra a quatro quilômetros da caverna. Não olha dentro. Isso é a parte importante: não olhar dentro.',
    'O dinheiro é bom. É bom de um jeito que assusta, porque você percebe na hora quanto tempo ia levar pra juntar isso ganhando batalha.'
  ],
  ef:{dinheiro:4000, itens:{'Ultra Ball':2},
      rep:{eixo:'ruim',delta:3,motivo:'Trabalhou para traficantes de Pokémon'},
      npc:{nome:'Caçador Vasco', opiniao:5, memoria:'Você trabalhou pra ele. Agora você é útil.'},
      flag:'trabalhou_rocket', moral:-15,
      registrar:'Passou a trabalhar para os remanescentes da Rocket.'},
  escolhas:[{texto:'Seguir para Cerulean com o dinheiro no bolso.', vai:'c5_fim'}]
},

c5_duplo:{
  texto:[
    'Você aperta a mão. Carrega as caixas. Pega o dinheiro.',
    'E liga para a Dra. Ivone da beira da estrada, com o caminhão ainda visível na curva.',
    'Ela ouve tudo em silêncio. Depois: "Você carregou as caixas."',
    '"Carreguei."',
    '"Tá." Ela desliga. Ela usa a informação. Ela não te agradece.'
  ],
  ef:{dinheiro:4000, rep:{eixo:'ruim',delta:1,motivo:'Carregou carga de traficantes'},
      npc:{nome:'Dra. Ivone', opiniao:-2, memoria:'Você entregou o esquema, mas só depois de receber por ele.'},
      npc2:null, flag:['trabalhou_rocket','delatou_rocket'],
      registrar:'Trabalhou para os traficantes e entregou a rota depois.'},
  escolhas:[{texto:'Seguir para Cerulean.', vai:'c5_fim'}]
},

c5_recusou_perto:{
  texto:[
    '"Não."',
    'O silêncio na câmara dura tempo demais. Um dos outros dois coloca a mão no cinto.',
    'Vasco levanta a palma. "Deixa." Pra você: "Você entrou aqui e viu tudo. Agora sobe essa passarela devagar e esquece o caminho."',
    'Você sobe. Devagar. Ele te olha o percurso inteiro.'
  ],
  ef:{flag:'recusou_rocket', npc:{nome:'Caçador Vasco', opiniao:-3, memoria:'Você recusou a proposta dele na cara dele.'},
      registrar:'Recusou trabalhar para os traficantes.'},
  escolhas:[
    {texto:'Voltar depois com um plano — e atacar.', vai:'c5_ataque'},
    {texto:'Ir embora de verdade.', vai:'c5_fim'}
  ]
},

c5_fugir:{
  texto:[
    'Você sai. Não faz barulho, não corre, não olha pra trás.',
    'Do lado de fora o ar é frio e você percebe que estava suando.',
    'Você não fez nada de errado. Você não fez nada.'
  ],
  ef:{flag:'ignorou_operacao', registrar:'Saiu do Monte da Lua sem fazer nada.'},
  escolhas:[{texto:'Seguir para Cerulean.', vai:'c5_fim'}]
},

c5_fim:{
  texto:[
    'A saída norte do Monte da Lua dá numa descida verde, e Cerulean aparece embaixo com o rio cortando a cidade em dois.',
    'É bonito. É genuinamente bonito, e você fica com raiva de achar bonito.',
    d=>d.flags.trabalhou_rocket ? 'O dinheiro no bolso pesa exatamente como dinheiro. É esse o problema.'
       : d.flags.ignorou_operacao ? 'Você pensa nas gaiolas a cada dez minutos, mais ou menos. Depois a cada vinte.'
       : 'Você pensa nas gaiolas. Vai pensar por um tempo.'
  ],
  fim:true, resumo:'Capítulo 5 concluído — a Rocket acabou, mas as pessoas continuaram.'
}
}},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 6 — O PREÇO DE UMA COISA VIVA
   ══════════════════════════════════════════════════════════ */
{
num:6, titulo:'O Preço de Uma Coisa Viva', local:'Cerulean / Rota 25', ambiente:'agua', nivelArea:22,
tom:'sombrio', inicio:'c6_cidade',
cenas:{

c6_cidade:{
  texto:[
    d=>{
      const r = Estado.nomeRep();
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=4) return `Cerulean te reconhece. Não com festa — com aquele meio-aceno de quem leu seu nome em algum lugar. "${r}", alguém sussurra atrás de você, e é sobre você.`;
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=4) return 'Cerulean te reconhece. Uma mulher puxa a criança pra perto quando você passa. O lojista te acompanha com os olhos do balcão até a porta.';
      return 'Cerulean não faz ideia de quem você é, e isso é um descanso.';
    },
    'O rio é o centro de tudo aqui. As pontes são cheias mesmo à noite.',
    'Na ponte norte, um homem montou uma banca. Não vende comida. Vende Pokémon — seis bolas numa caixa de veludo, com preço em plaquinha.',
    '"Todos legalizados", ele diz antes de você perguntar. "Documentados. Quer ver o papel?"'
  ],
  escolhas:[
    {texto:'Ver os papéis.', vai:'c6_papeis'},
    {texto:'"Isso não é ilegal?"', vai:'c6_legal'},
    {texto:'Passar reto.', vai:'c6_rota25'}
  ]
},

c6_papeis:{
  texto:[
    'Os papéis são reais. Carimbo da Liga, registro, tudo.',
    'Na quarta folha, a origem: "Transferência voluntária — treinador desistente."',
    'Você olha a caixa de veludo de novo. Seis bolas. Seis treinadores que desistiram.',
    '"O negócio não é o bicho", ele diz, acompanhando seu olhar. "O negócio é que tem muita gente saindo de casa aos quinze e voltando aos dezesseis."'
  ],
  ef:{flag:'viu_papeis'},
  escolhas:[
    {texto:'Comprar um. (3.000 ₽)', vai:'c6_comprou', cond:d=>d.jogador.dinheiro>=3000},
    {texto:'"Quanto você paga por um?"', vai:'c6_vender'},
    {texto:'Sair dessa conversa.', vai:'c6_rota25'}
  ]
},

c6_legal:{
  texto:[
    '"Ilegal?" Ele acha graça de verdade. "Rapaz, a Liga cobra imposto disso. Tem formulário e tudo."',
    '"Ilegal é o que acontece quando não tem banca. Aí o bicho vai pro porão de alguém em Celadon e ninguém carimba nada."',
    'Ele não está errado. É por isso que incomoda.'
  ],
  escolhas:[
    {texto:'Ver os papéis.', vai:'c6_papeis'},
    {texto:'Passar reto.', vai:'c6_rota25'}
  ]
},

c6_comprou:{
  texto:[
    'A transação leva menos tempo que comprar um sanduíche.',
    'Ele te entrega a bola e o papel dobrado em três. "Cuida bem."',
    'Dentro da bola tem alguém que conheceu outra pessoa primeiro.'
  ],
  ef:{dinheiro:-3000, flag:'comprou_pokemon',
      executar:d=>{
        const dex = Dados.escolher([52,58,63,66,84,96,104,109,116,118]);
        const p = criarPokemon(dex, Dados.entre(16,22), {moral:20, historia:'Comprado numa banca em Cerulean. Teve outro treinador antes de você.'});
        Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${p.nome} (Nv ${p.nivel}, ${p.natureza}) é seu agora. Moral: 20/100 — ele não te escolheu.`}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Comprou um Pokémon em banca de rua'}},
  escolhas:[{texto:'Ir para a Rota 25.', vai:'c6_rota25'}]
},

c6_vender:{
  texto:[
    'Ele te olha diferente agora. Com interesse comercial.',
    '"Depende do bicho. Nível, natureza, se tem golpe bom." Ele tira uma calculadora do bolso. "Traz aqui que eu avalio."',
    'Ele está falando dos seus. Do que está no seu cinto agora.'
  ],
  escolhas:[
    {texto:'Vender um do seu time.', vai:'c6_venda_feita', vendaTime:true},
    {texto:'"Esquece."', vai:'c6_rota25', ef:{rep:{eixo:'bom',delta:1,motivo:'Recusou vender um companheiro'}}}
  ]
},

c6_venda_feita:{
  texto:[
    'Ele conta as notas na sua mão. Você segura a bola até o último segundo e depois não segura mais.',
    'Ele guarda na caixa de veludo, na quinta posição, e ajeita a plaquinha de preço.',
    'Você fica olhando a caixa por tempo demais. Ele pigarreia. Você vai embora.'
  ],
  escolhas:[{texto:'Ir para a Rota 25.', vai:'c6_rota25'}]
},

c6_rota25:{
  texto:[
    'A Rota 25 acompanha o rio até o mar. Tem cabana de pescador, tem trilha de terra, tem gente pescando em silêncio há horas.',
    'Você ouve antes de ver: alguém chorando, adulto, tentando não fazer barulho.',
    'É uma mulher sentada na beira da água com um Vaporeon deitado no colo. O Vaporeon está respirando errado — rápido demais, curto demais.',
    '"Ele comeu alguma coisa", ela diz sem olhar pra você. "Na cidade. Tem gente pondo veneno nos Pokémon de rua e ele comeu."'
  ],
  ef:{npc:{nome:'Marta', opiniao:0, memoria:'Você a encontrou na Rota 25 com o Vaporeon envenenado.'},
      registrar:'Encontrou Marta e o Vaporeon envenenado na Rota 25.'},
  escolhas:[
    {texto:'Dar seu Antídoto / Full Heal.', vai:'c6_curou', cond:d=>Estado.contaItem('Antidote')>0||Estado.contaItem('Full Heal')>0},
    {texto:'Carregar o Vaporeon até o Centro Pokémon de Cerulean. Uma hora de corrida.', vai:'c6_correu'},
    {texto:'Ficar com ela. Não tem o que fazer.', vai:'c6_ficou'},
    {texto:'Seguir caminho. Você não conhece essa mulher.', vai:'c6_seguiu'}
  ]
},

c6_curou:{
  texto:[
    'Você abre a mochila e o frasco já está na mão dela antes de você terminar de explicar como usa.',
    'Leva sete minutos. A respiração do Vaporeon vai ficando longa de novo, e no oitavo minuto ele abre os olhos e lambe a mão dela.',
    'Marta chora de um jeito completamente diferente agora.',
    '"Como é seu nome?" ela pergunta. Você fala. Ela repete duas vezes pra decorar.'
  ],
  ef:{executar:d=>{ if(Estado.contaItem('Full Heal')) Estado.usarItem('Full Heal'); else Estado.usarItem('Antidote'); return []; },
      rep:{eixo:'bom',delta:2,motivo:'Salvou o Pokémon de uma estranha na Rota 25'},
      npc:{nome:'Marta', opiniao:8, memoria:'Você salvou o Vaporeon dela. Ela decorou o seu nome.'},
      flag:'salvou_vaporeon', itens:{'Hyper Potion':2,'Full Heal':2}},
  escolhas:[{texto:'Seguir.', vai:'c6_veneno'}]
},

c6_correu:{
  texto:[
    'O Vaporeon pesa vinte e nove quilos. Você descobre isso na prática, no quilômetro dois.',
    'Marta corre do seu lado dizendo o nome dele sem parar, como se o nome fosse segurar ele aqui.'
  ],
  teste:{status:'forca', dificuldade:7, nomeStatus:'Força',
         critico:'c6_correu_ok', sucesso:'c6_correu_ok', parcial:'c6_correu_quase', falha:'c6_correu_tarde'}
},

c6_correu_ok:{
  texto:[
    'Você chega. Os seus braços não funcionam direito por vinte minutos depois, mas você chega.',
    'A enfermeira leva o Vaporeon pra dentro correndo. Vinte minutos depois volta e faz que sim com a cabeça.',
    'Marta abraça você. É desconfortável e você deixa acontecer.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Carregou um Pokémon envenenado por uma hora até o Centro'},
      hp:-4, causa:'Exaustão na Rota 25',
      npc:{nome:'Marta', opiniao:9, memoria:'Você carregou o Vaporeon dela por uma hora inteira. Ela conta essa história pra todo mundo.'},
      flag:'salvou_vaporeon', itens:{'Hyper Potion':2}, dinheiro:800},
  escolhas:[{texto:'Seguir.', vai:'c6_veneno'}]
},

c6_correu_quase:{
  texto:[
    'Você chega. Tarde, mas chega.',
    'Eles conseguem estabilizar. O Vaporeon vai viver, e não vai voltar a ser o que era — o veneno ficou onde não sai.',
    'Marta agradece muito. Muito demais, do jeito de quem está agradecendo pra não pensar no resto.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Tentou salvar o Vaporeon de Marta'}, hp:-5, causa:'Exaustão na Rota 25',
      npc:{nome:'Marta', opiniao:5, memoria:'Você correu com o Vaporeon dela. Ele sobreviveu com sequelas.'},
      flag:'vaporeon_sequela'},
  escolhas:[{texto:'Seguir.', vai:'c6_veneno'}]
},

c6_correu_tarde:{
  texto:[
    'Você tropeça no quilômetro quatro. Cai com o Vaporeon e ele guincha.',
    'Vocês chegam. Não adianta.',
    'Marta não te culpa. Ela agradece — agradece de verdade, olhando no seu olho — e isso é muito pior do que se ela gritasse com você.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Tentou salvar o Vaporeon e falhou'}, hp:-6, causa:'Queda na Rota 25',
      npc:{nome:'Marta', opiniao:4, memoria:'Você tentou salvar o Vaporeon dela. Ele morreu no seu colo.'},
      flag:'vaporeon_morreu', registrar:'O Vaporeon de Marta morreu apesar da corrida.'},
  escolhas:[{texto:'Seguir.', vai:'c6_veneno'}]
},

c6_ficou:{
  texto:[
    'Você senta na grama. Não fala nada, porque não tem nada.',
    'Leva quarenta minutos. Marta segura a cabeça dele o tempo todo e no fim coloca a mão nos olhos dele, que já estão fechados, e deixa lá.',
    'Depois ela olha pra você. "Obrigada por não ter ido embora."'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Ficou com uma estranha no pior momento dela'},
      npc:{nome:'Marta', opiniao:6, memoria:'Você ficou com ela até o Vaporeon morrer. Ela lembra disso.'},
      flag:'vaporeon_morreu', registrar:'Ficou com Marta até o fim do Vaporeon.'},
  escolhas:[{texto:'Seguir.', vai:'c6_veneno'}]
},

c6_seguiu:{
  texto:[
    'Você passa. Ela nem levanta a cabeça.',
    'Duzentos metros depois o som para. Você não sabe se é porque acabou ou porque ficou longe.',
    'Você não volta pra descobrir.'
  ],
  ef:{rep:{eixo:'ruim',delta:2,motivo:'Passou reto por alguém em desespero'},
      flag:'ignorou_marta', registrar:'Ignorou Marta e o Vaporeon morrendo na Rota 25.'},
  escolhas:[{texto:'Continuar.', vai:'c6_veneno'}]
},

c6_veneno:{
  texto:[
    'Mais adiante na rota, você encontra a fonte.',
    'Tigelas. Umas quinze, espalhadas onde os Pokémon de rua bebem. Comida boa, cara, do tipo que ninguém desperdiça — com alguma coisa dentro.',
    'E um homem agachado, enchendo a décima sexta.',
    'Ele te vê e não corre. Levanta com as mãos sujas de ração e diz, com voz de quem explica o óbvio: "Eles estavam entrando nas casas. Alguém tinha que resolver."'
  ],
  ef:{flag:'achou_envenenador', registrar:'Encontrou o homem que envenenava os Pokémon de rua da Rota 25.'},
  escolhas:[
    {texto:'Derrubar as tigelas. Todas.', vai:'c6_tigelas'},
    {texto:'Batalhar com ele.', vai:'c6_luta_veneno'},
    {texto:'Chamar a Liga e ficar de olho até chegarem.', vai:'c6_liga_veneno'},
    {texto:'Fazer com ele o que ele fez com eles.', vai:'c6_vinganca'},
    {texto:'Ir embora. Não é sua cidade, não é seu problema.', vai:'c6_fim'}
  ]
},

c6_tigelas:{
  texto:[
    'Você chuta a primeira. Ele grita alguma coisa. Você chuta a segunda.',
    'Na sétima ele tenta te segurar pelo braço e você empurra com mais força do que planejou. Ele cai sentado e fica lá, olhando você destruir o trabalho da manhã inteira dele.',
    'Dezesseis tigelas. Você vira todas.',
    'Quando acaba, ele diz, baixinho: "Vou encher de novo amanhã."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Destruiu as armadilhas de veneno da Rota 25'},
      flag:'destruiu_tigelas'},
  escolhas:[
    {texto:'"Então eu volto amanhã."', vai:'c6_fim', ef:{rep:{eixo:'bom',delta:1,motivo:'Prometeu voltar todos os dias'}, flag:'promessa_tigelas'}},
    {texto:'Ir embora em silêncio.', vai:'c6_fim'}
  ]
},

c6_luta_veneno:{
  texto:['"Você quer brigar por causa de bicho de rua." Ele solta uma bola. "Tá bom."'],
  batalha:{dex:110, nivel:26, tipo:'treinador', treinador:'Homem das tigelas', fuga:false,
           vitoria:'c6_venceu_veneno', derrota:'c6_perdeu_veneno', gameover:'gameover'}
},

c6_venceu_veneno:{
  texto:[
    'Ele recolhe o Weezing e senta na grama, derrotado de um jeito mais profundo que o placar.',
    '"Minha filha tem sete anos", ele diz pro chão. "Um Rattata mordeu ela no quintal. Ponto na mão. Ela não sai mais sozinha."',
    'Nada disso desfaz as dezesseis tigelas. E nada disso é mentira.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Parou o envenenador da Rota 25'},
      flag:'venceu_envenenador', registrar:'Derrotou o homem das tigelas. Ele tinha motivos.'},
  escolhas:[
    {texto:'Ajudar ele a recolher as tigelas. Juntos.', vai:'c6_fim',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Resolveu um conflito sem destruir ninguém'}, flag:'resolveu_tigelas'}},
    {texto:'"O problema da sua filha não vira problema deles."', vai:'c6_fim'}
  ]
},

c6_perdeu_veneno:{
  texto:[
    'Você perde. Ele nem comemora — recolhe as coisas e continua enchendo a décima sétima tigela enquanto você se recupera sentado na grama.',
    'Isso é o pior tipo de derrota: a que não interrompe nada.'
  ],
  ef:{hp:-5, causa:'Derrota na Rota 25', flag:'falhou_envenenador'},
  escolhas:[{texto:'Seguir.', vai:'c6_fim'}]
},

c6_liga_veneno:{
  texto:[
    'Você liga e fica. Duas horas e quarenta na beira da trilha, olhando ele encher tigela e olhando você.',
    'Os oficiais chegam. Levam ele. Levam as tigelas em sacos etiquetados.',
    'Um dos oficiais anota seu nome no relatório. "Boa, garoto. Sério."',
    'Três semanas depois ele está de volta na rota. Advertência e multa. Mas as tigelas ficaram.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Entregou o envenenador às autoridades'},
      flag:'entregou_envenenador', dinheiro:600},
  escolhas:[{texto:'Seguir.', vai:'c6_fim'}]
},

c6_vinganca:{
  texto:[
    'Você pega a tigela cheia da mão dele.',
    'O que acontece nos próximos dois minutos não é batalha Pokémon. Não tem turno, não tem tipo, não tem dado. É só você, ele, e a decisão que você já tinha tomado antes de chegar perto.',
    'Ele vai ficar bem. Fisicamente, vai ficar bem.',
    'Tinha três pessoas pescando a duzentos metros. Elas viram.'
  ],
  ef:{rep:{eixo:'ruim',delta:3,motivo:'Agrediu um homem na Rota 25 diante de testemunhas'},
      flag:'agrediu_envenenador', moral:-20,
      registrar:'Agrediu o homem das tigelas. Três pessoas viram.',
      executar:d=>{
        Estado.dados.liga.avisos++;
        return [{tipo:'liga', texto:'Um relatório com o seu nome entrou no sistema da Liga Pokémon hoje.'}];
      }},
  escolhas:[{texto:'Ir embora antes que alguém chegue.', vai:'c6_fim'}]
},

c6_fim:{
  texto:[
    'A Rota 25 termina num mirante sobre o mar. De lá dá pra ver a curva da costa e, muito longe, a silhueta de uma ilha.',
    d=>{
      if (d.flags.agrediu_envenenador) return 'Você percebe que não pensou uma vez no homem desde que saiu de lá. Isso deveria incomodar mais do que incomoda.';
      if (d.flags.ignorou_marta) return 'Você percebe que não lembra do rosto da mulher. Só do som.';
      return 'Você fica ali até escurecer. Foi um dia longo e você fez o que deu.';
    },
    'Amanhã tem estrada de novo. Lavender fica a três dias a pé, e dizem que lá tem uma torre.'
  ],
  fim:true, resumo:'Capítulo 6 concluído — você começou a entender o preço das coisas.'
}
}},

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
