/* ============================================================
   CAPÍTULO 16 — A ILHA SEM NOME
   ============================================================ */
CAPITULOS.push(
{
num:16, titulo:'A Ilha Sem Nome', local:'Mar a sudoeste de Kanto', ambiente:'montanha', nivelArea:52,
tom:'muito sombrio', inicio:'c16_velho',
cenas:{

c16_velho:{
  texto:[
    'O pescador tem oitenta e um anos e conta a mesma história há quarenta.',
    '"Tem uma ilha a sudoeste que não entra em mapa nenhum porque não tem nada nela. Pedra e mato. Nem água doce."',
    '"Meu avô chamava de ilha da torre. Não tem torre. Ele dizia que tinha tido."',
    '"E de vez em quando, umas duas vezes por década, aparece luz em cima dela. À noite. Com cor."',
    'Ele te olha. "Você acredita em mim."',
    'Não é pergunta. É constatação, e ele parece cansado de a resposta ser sempre não.'
  ],
  ef:{npc:{nome:'Pescador Zé Antônio', opiniao:2, memoria:'Te contou da ilha sem nome e do arco-íris noturno.'},
      flag:'sabe_da_ilha', registrar:'Ouviu falar da ilha sem nome a sudoeste.'},
  escolhas:[
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'Não ir. Você já tem problema demais.', vai:'c16_nao_foi'}
  ]
},

c16_quem_sabe:{
  texto:[
    '"Todo pescador velho de Fuchsia sabe. Nenhum pescador novo acredita."',
    'Ele cospe no chão. "E teve gente de fora perguntando, faz uns três meses. Gente de terno, num carro bom, perguntando de ilha sem mapa."',
    '"Eu falei que não sabia de nada."',
    'Ele olha pra você. "Com você eu falei. Você não tem carro."'
  ],
  ef:{flag:'outros_procuram_a_ilha',
      registrar:'Gente de terno anda perguntando pela ilha sem nome há três meses.'},
  escolhas:[
    {texto:'"Então a gente tem que ir antes deles."', vai:'c16_travessia'},
    {texto:'Deixar pra lá.', vai:'c16_nao_foi'}
  ]
},

c16_nao_foi:{
  texto:[
    'Você não vai.',
    'Dois meses depois, alguém vai. Não você.',
    'O que acontece na ilha nesses dois meses você só descobre por notícia, e notícia sobre coisa lendária é sempre pequena e sempre tarde.'
  ],
  ef:{flag:'nao_foi_a_ilha', instabilidade:1,
      registrar:'Não foi à ilha sem nome. Outra pessoa foi.'},
  escolhas:[{texto:'Seguir.', vai:'c16_fim'}]
},

c16_travessia:{
  texto:[
    'A travessia leva onze horas num barco de pesca de sete metros.',
    'A ilha aparece ao anoitecer e é exatamente o que o velho descreveu: pedra e mato, sem praia, sem cais, sem nada.',
    'E no topo dela, no ponto mais alto, tem uma coisa que não é pedra: uma base retangular de alvenaria antiga, quadrada, de uns doze metros de lado.',
    'Alicerce de torre. Só o alicerce. O resto não existe há séculos.'
  ],
  ef:{flag:'chegou_na_ilha', registrar:'Chegou à ilha sem nome. Há um alicerce de torre no topo.'},
  escolhas:[
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    {texto:'Acampar e esperar a noite.', vai:'c16_esperou_noite'}
  ]
},

c16_esperou_noite:{
  texto:[
    'Você acampa na base da subida e espera.',
    'Às 23h10, começa.',
    'Não é arco-íris — arco-íris precisa de sol e de chuva, e não tem nem um nem outro.',
    'É uma faixa de luz colorida no céu, imóvel, ancorada exatamente sobre o alicerce.',
    'Ela fica quarenta minutos e some.',
    'Seu Zé Antônio, do barco, a duzentos metros da costa, está de pé olhando pra cima. Quarenta anos contando essa história e é a primeira vez que ele vê com alguém junto.'
  ],
  ef:{flag:'viu_o_arco_iris',
      rep:{eixo:'bom',delta:1,motivo:'Deu razão a um velho que ninguém acreditava'},
      npc:{nome:'Pescador Zé Antônio', opiniao:8, memoria:'Viu o arco-íris noturno junto com você. Depois de quarenta anos.'},
      registrar:'Viu o arco-íris noturno sobre o alicerce.'},
  escolhas:[{texto:'Subir agora.', vai:'c16_alicerce'}]
},

c16_alicerce:{
  texto:[
    'O alicerce está no topo e é mais impressionante de perto: blocos de pedra encaixados sem argamassa, cada um do tamanho de uma geladeira.',
    'No centro do retângulo, o chão é de pedra lisa, com um desgaste circular no meio — como se alguma coisa grande pousasse ali repetidamente, por muito tempo.',
    'Não tem nada escrito. Nenhum símbolo. Quem construiu isso não achava que precisava explicar.',
    d=>d.flags.outros_procuram_a_ilha ? 'E tem marca de bota recente na terra da subida. Mais de um par. Dias, não semanas.' : 'E não tem marca de ninguém. Você é o primeiro em muito tempo.'
  ],
  escolhas:[
    {texto:'Esperar no centro do círculo.', vai:'c16_esperou_no_circulo'},
    {texto:'Procurar quem deixou as marcas de bota.', vai:'c16_botas', cond:d=>!!d.flags.outros_procuram_a_ilha},
    {texto:'Descer. Isso é um lugar de pousar, não de estar.', vai:'c16_desceu_ilha'}
  ]
},

c16_botas:{
  texto:[
    'As marcas levam a um acampamento montado do outro lado do topo: três barracas técnicas, gerador, e equipamento que você reconhece do andar 11 da Silph.',
    'Quatro pessoas. Uma delas está com um caderno e uma câmera térmica apontada pro alicerce.',
    '"...o padrão é bianual, a gente perdeu duas janelas esperando o conselho aprovar a verba..." Ela para de falar quando te vê.',
    'Um silêncio muito longo.',
    '"Você é o de Saffron", diz outro. E não é pergunta.'
  ],
  ef:{flag:'achou_equipe_na_ilha',
      registrar:'Uma equipe com equipamento da Silph está acampada na ilha esperando Ho-Oh.'},
  escolhas:[
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'},
    {texto:'"O que vocês querem com ele?"', vai:'c16_pergunta_equipe'},
    {texto:'Atacar o acampamento.', vai:'c16_ataque_equipe'},
    {texto:'Recuar e deixar que eles não te vejam de novo.', vai:'c16_esperou_no_circulo'}
  ]
},

c16_pergunta_equipe:{
  texto:[
    'A mulher do caderno responde, e responde com uma honestidade que te desarma:',
    '"Material genético. Uma pena basta. Nós nem precisamos capturar."',
    '"Pra quê?"',
    '"Pra um projeto que já custou onze anos e quatro rodadas de investimento." Ela fecha o caderno. "E que fracassou doze vezes seguidas porque a gente estava usando a matriz errada."',
    '"Quem paga?"',
    '"Uma comissão." Ela guarda a câmera térmica. "É o nome que eles usam. Comissão. Nunca perguntei de quê."',
    'Você entende, com um frio que não é da altitude: eles não vão parar no Mewtwo. Ho-Oh é o próximo molde.'
  ],
  ef:{flag:'entendeu_o_proximo_projeto', instabilidade:1,
      registrar:'A Silph quer material genético de Ho-Oh para a próxima matriz.'},
  escolhas:[
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'},
    {texto:'Atacar o acampamento.', vai:'c16_ataque_equipe'},
    {texto:'"Eu fico e assisto."', vai:'c16_esperou_no_circulo', ef:{flag:'deixou_a_equipe'}}
  ]
},

c16_expulsou_equipe:{
  texto:['"Saiam da ilha."'],
  teste:{status:'carisma', dificuldade:9, nomeStatus:'Carisma',
         critico:'c16_equipe_saiu', sucesso:'c16_equipe_saiu', parcial:'c16_equipe_ficou', falha:'c16_equipe_ficou'}
},

c16_equipe_saiu:{
  texto:[
    'Você diz isso com uma autoridade que você não tem e que eles, por algum motivo, aceitam.',
    d=>Estado.rep.eixo==='bom'&&Estado.rep.bom>=5 ? 'Talvez seja a sua reputação. Metade de Kanto sabe o seu nome e a outra metade sabe a sua história.' :
       Estado.rep.eixo==='ruim'&&Estado.rep.ruim>=5 ? 'Talvez seja a sua reputação — mas de um jeito bem diferente. Um deles já estava guardando o equipamento antes de você terminar a frase.' :
       'Talvez seja porque ninguém ali quer explicar pra um chefe por que houve confronto numa ilha sem jurisdição definida.',
    'Eles desmontam em três horas e saem antes do amanhecer.',
    'A mulher do caderno é a última a embarcar. "A gente volta na próxima janela", ela diz. "Daqui a dois anos."',
    '"Eu também", você responde.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Expulsou uma expedição científica de uma ilha sagrada'},
      flag:'expulsou_a_equipe', instabilidade:-1,
      registrar:'Expulsou a equipe da Silph da ilha sem nome.'},
  escolhas:[{texto:'Esperar no círculo.', vai:'c16_esperou_no_circulo'}]
},

c16_equipe_ficou:{
  texto:[
    '"Com todo respeito", diz o mais velho, "essa ilha não é de ninguém, a gente tem autorização de pesquisa, e você tem quinze anos."',
    'Ele volta ao trabalho.',
    'Ele não está errado em nenhum dos três pontos, e é isso que enraivece.'
  ],
  ef:{flag:'equipe_ficou'},
  escolhas:[
    {texto:'Atacar o acampamento.', vai:'c16_ataque_equipe'},
    {texto:'Ir para o círculo e esperar junto — mas na frente deles.', vai:'c16_esperou_no_circulo'}
  ]
},

c16_ataque_equipe:{
  texto:[
    'Você ataca um acampamento científico numa ilha deserta.',
    'Eles têm Pokémon de segurança, porque expedição sempre tem.'
  ],
  batalha:{dex:103, nivel:52, tipo:'treinador', treinador:'Segurança da expedição', fuga:true,
           timeExtra:[{dex:76, nivel:53}],
           vitoria:'c16_venceu_equipe', derrota:'c16_perdeu_equipe', fuga2:'c16_esperou_no_circulo', gameover:'gameover'}
},

c16_venceu_equipe:{
  texto:[
    'Você derruba a segurança e destrói o gerador, a câmera térmica e as antenas.',
    'Eles não revidam. Cientista não revida — cientista anota.',
    'A mulher do caderno escreve alguma coisa enquanto você quebra o equipamento dela, e isso te assusta mais do que se ela gritasse.',
    '"O que você está escrevendo?"',
    '"A data." Ela não levanta a cabeça. "A gente vai precisar dela no relatório do seguro. E no boletim de ocorrência."'
  ],
  ef:{rep:{eixo:'ruim',delta:2,motivo:'Destruiu equipamento de uma expedição autorizada'},
      flag:'destruiu_a_expedicao', instabilidade:-1,
      executar:d=>{ d.liga.avisos++; return [{tipo:'liga', texto:'Mais uma ocorrência com o seu nome no sistema da Liga.'}]; },
      registrar:'Destruiu o equipamento da expedição na ilha sem nome.'},
  escolhas:[{texto:'Ir para o círculo.', vai:'c16_esperou_no_circulo'}]
},

c16_perdeu_equipe:{
  texto:[
    'Você perde para a segurança de uma expedição científica.',
    'Eles te tratam bem depois — dão água, olham seus ferimentos, oferecem carona no barco deles.',
    'É humilhante de um jeito muito completo.'
  ],
  ef:{hp:-6, causa:'Derrota na ilha sem nome'},
  escolhas:[{texto:'Ir para o círculo mesmo assim.', vai:'c16_esperou_no_circulo'}]
},

c16_esperou_no_circulo:{
  texto:[
    'Você senta no centro do desgaste circular, no topo de uma ilha sem nome, e espera.',
    'Quatro horas. Depois seis.',
    'Na sétima hora, o vento para completamente — e não é o vento diminuindo, é o vento parando, como se alguém tivesse fechado uma porta.',
    'A luz vem de cima.',
    'Ho-Oh não pousa. Ele para no ar, a uns quinze metros, e o calor que desce dele não queima — aquece, como sol de manhã em dia frio.',
    'Ele é grande de um jeito que não cabe na cabeça, e é a coisa mais colorida que já existiu no seu campo de visão.'
  ],
  ef:{executar:d=>{ Estado.lend(250).encontros++; return []; },
      registrar:'Ho-Oh apareceu sobre o alicerce da ilha sem nome.'},
  escolhas:[
    {texto:'Ficar parado. Só isso.', vai:'c16_ficou_parado'},
    {texto:'Se ajoelhar.', vai:'c16_ajoelhou'},
    {texto:'Tentar capturar.', vai:'c16_captura_hooh'},
    {texto:'Falar com ele.', vai:'c16_falou_hooh'}
  ]
},

c16_falou_hooh:{
  texto:[
    '"Tem gente querendo uma pena sua."',
    'Você fala isso pra uma coisa a quinze metros de altura que não tem nenhum motivo pra te ouvir.',
    'Ho-Oh desce dois metros.',
    '"Eles querem copiar você. Já copiaram outro. Deu errado doze vezes e eles vão continuar."',
    'Mais dois metros.',
    'E aí — sem nenhum aviso — uma pena cai. Uma só. Ela desce girando e leva quase um minuto pra chegar no chão do alicerce.',
    'Ele te deu uma pena. De propósito. Sabendo exatamente o que você acabou de dizer.',
    'Depois sobe e some, e o vento volta de uma vez.'
  ],
  ef:{flag:['pena_de_hooh','hooh_confiou'],
      executar:d=>{ const L=Estado.lend(250); L.disposicao='passivo'; L.aliado=true; return []; },
      rep:{eixo:'bom',delta:3,motivo:'Avisou Ho-Oh do que queriam com ele'},
      itens:{'Ração':2},
      registrar:'Ho-Oh deixou cair uma pena depois que você o avisou. De propósito.'},
  escolhas:[
    {texto:'Pegar a pena.', vai:'c16_pegou_pena'},
    {texto:'Deixar a pena onde caiu.', vai:'c16_deixou_pena',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Recusou até o presente de um lendário'}, flag:'deixou_a_pena'}}
  ]
},

c16_pegou_pena:{
  texto:[
    'A pena tem quase um metro e pesa como papel.',
    'Ela não é colorida — ela é todas as cores, dependendo do ângulo, e olhar pra ela por muito tempo cansa a vista.',
    'Você entende, guardando ela na mochila, que acabou de virar a pessoa mais procurada de Kanto por um motivo completamente novo.'
  ],
  ef:{flag:'carrega_a_pena',
      registrar:'Está carregando uma pena de Ho-Oh.'},
  escolhas:[{texto:'Descer da ilha.', vai:'c16_fim'}]
},

c16_deixou_pena:{
  texto:[
    'Você deixa a pena onde caiu, no centro do círculo, e desce a ilha.',
    'No barco, Seu Zé Antônio pergunta se aconteceu alguma coisa lá em cima.',
    '"Aconteceu."',
    '"E você trouxe alguma coisa?"',
    '"Não."',
    'Ele assente devagar, como quem aprova. "Meu avô dizia que o que se traz de lá é o que estraga."'
  ],
  escolhas:[{texto:'Voltar.', vai:'c16_fim'}]
},

c16_ficou_parado:{
  texto:[
    'Você não faz nada. Nem gesto, nem palavra, nem bola.',
    'Ho-Oh fica no ar por quatro minutos inteiros — quatro minutos, cronometrados, de uma coisa lendária parada a quinze metros olhando uma pessoa de quinze anos que não quer nada.',
    'E depois vai embora.',
    'Não tem presente, não tem bênção, não tem sinal.',
    'Teve quatro minutos, e ninguém vai acreditar em você, e você não liga.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(250); L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:2,motivo:'Encontrou Ho-Oh e não quis nada'},
      flag:'quatro_minutos_com_hooh',
      registrar:'Ficou quatro minutos parado diante de Ho-Oh, sem fazer nada.'},
  escolhas:[{texto:'Descer.', vai:'c16_fim'}]
},

c16_ajoelhou:{
  texto:[
    'Você se ajoelha no centro do círculo, sem decidir que ia fazer isso.',
    'Ho-Oh desce até quase encostar no alicerce — e nesse momento você vê, de perto, que as penas dele não são coloridas por pigmento. Elas são transparentes e quebram a luz.',
    'Ele encosta o bico na sua testa, de leve, exatamente por um segundo.',
    'Você não recebe nenhum poder, nenhuma visão e nenhuma revelação.',
    'Você só para de ter medo. De tudo. Por umas quatro horas. E depois o medo volta, e você passa o resto da vida sabendo que existe uma versão sua sem medo, e que ela é possível.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(250); L.disposicao='passivo'; L.aliado=true; return []; },
      rep:{eixo:'bom',delta:3,motivo:'Se ajoelhou e foi tocado por Ho-Oh'},
      flag:'tocado_por_hooh', hp:6,
      registrar:'Ho-Oh encostou o bico na sua testa.'},
  escolhas:[{texto:'Descer.', vai:'c16_fim'}]
},

c16_captura_hooh:{
  texto:[
    'Você tira a bola do cinto no meio do silêncio do vento parado.',
    'Ho-Oh vê. Ele não recua.',
    'Ele espera — e esperar é o gesto mais condenatório possível, porque significa que ele já viu isso antes e sabe como termina.'
  ],
  batalha:{dex:250, nivel:65, tipo:'lendario', fuga:true, ambiente:'montanha',
           vitoria:'c16_pos_hooh', derrota:'c16_pos_hooh', fuga2:'c16_fim',
           captura:'c16_capturou_hooh', gameover:'gameover'}
},

c16_pos_hooh:{
  texto:[
    'Ele sobe e some sem pressa nenhuma.',
    'O vento volta de uma vez, e o barulho do vento depois de horas de silêncio é ensurdecedor.',
    'A próxima janela é daqui a dois anos. Você não vai estar aqui.'
  ],
  ef:{executar:d=>{
        const L=Estado.lend(250); L.ataquesSofridos++;
        if (L.ataquesSofridos>=2){ L.disposicao='hostil'; return [{tipo:'perigo', texto:'Ho-Oh te reconhece agora. E isso é um problema de escala diferente.'}]; }
        return [];
      },
      rep:{eixo:'ruim',delta:2,motivo:'Atacou Ho-Oh no alicerce da torre'}, instabilidade:1},
  escolhas:[
    {texto:'Tentar de novo enquanto ele está visível.', vai:'c16_captura_hooh'},
    {texto:'Parar.', vai:'c16_fim'}
  ]
},

c16_capturou_hooh:{
  texto:[
    'A bola fecha no ar e cai no alicerce.',
    'O céu inteiro muda de cor por três segundos e volta ao normal — e "volta ao normal" é uma descrição errada, porque nada volta ao normal.',
    'O vento retorna. Depois a chuva, que não estava prevista. Depois o mar, que fica revolto em quinze minutos sem motivo meteorológico.',
    'Seu Zé Antônio grita da praia pra você descer AGORA.',
    'E no horizonte, muito longe, vindo do oeste, tem uma coisa na água que é grande demais pra ser onda.'
  ],
  ef:{instabilidade:5, flag:['capturou_hooh','lugia_chamado'],
      registrar:'Capturou Ho-Oh. Alguma coisa muito grande começou a vir do oeste.'},
  escolhas:[
    {texto:'Soltar. Agora. Antes de descer a ilha.', vai:'c16_soltou_hooh'},
    {texto:'Descer correndo com ele.', vai:'c16_desceu_com_hooh'}
  ]
},

c16_soltou_hooh:{
  texto:[
    'Você abre a bola no alicerce e recua.',
    'Ele sai e não vai embora imediatamente. Fica te olhando por um tempo com uma expressão que você não tem vocabulário pra descrever.',
    'Depois sobe.',
    'O mar se acalma em quarenta minutos. A coisa no horizonte oeste vira e some.',
    'Seu Zé Antônio, do barco, faz o sinal da cruz — ele não é religioso, ele só não tem outro gesto disponível.'
  ],
  ef:{executar:d=>{
        const avisos=[];
        const p=[...d.time,...d.pc].find(x=>x.dex===250);
        if(p) Captura.soltar(p).forEach(e=>avisos.push({tipo:e.tipo,texto:e.texto}));
        Estado.marcar('lugia_chamado', false);
        Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade-4);
        return avisos;
      },
      rep:{eixo:'bom',delta:2,motivo:'Soltou Ho-Oh antes que o mundo pagasse por isso'},
      registrar:'Soltou Ho-Oh no mesmo lugar. O mar se acalmou.'},
  escolhas:[{texto:'Descer.', vai:'c16_fim'}]
},

c16_desceu_com_hooh:{
  texto:[
    'Você desce a ilha correndo com Ho-Oh no cinto, em mar revolto, num barco de sete metros com um homem de oitenta e um anos no leme.',
    'A travessia de volta leva dezenove horas em vez de onze.',
    'Vocês chegam. É quase um milagre que vocês cheguem.',
    'Seu Zé Antônio não fala com você nas últimas seis horas de viagem. No cais, ele diz uma coisa só, sem olhar:',
    '"Eu não devia ter te levado."'
  ],
  ef:{flag:'trouxe_hooh', instabilidade:3, hp:-6, causa:'Dezenove horas em mar revolto',
      npc:{nome:'Pescador Zé Antônio', opiniao:-6, memoria:'Te levou à ilha e se arrependeu. Disse isso na sua cara, no cais.'},
      rep:{eixo:'ruim',delta:3,motivo:'Trouxe Ho-Oh de volta ao continente'},
      registrar:'Trouxe Ho-Oh para o continente. O mar levou 19 horas para deixar vocês passarem.'},
  escolhas:[{texto:'Descer do barco.', vai:'c16_fim'}]
},

c16_desceu_ilha:{
  texto:[
    'Você desce sem esperar.',
    'No barco, Seu Zé Antônio pergunta se você viu.',
    '"Vi o lugar onde ele pousa."',
    '"E não esperou?"',
    '"Não."',
    'Ele pensa um tempo. "Meu avô também não esperava. Ele dizia que a gente não senta no lugar onde uma coisa dessas pousa. A gente olha e vai embora."'
  ],
  ef:{flag:'nao_esperou_hooh',
      rep:{eixo:'bom',delta:1,motivo:'Não se sentou no lugar onde um lendário pousa'}},
  escolhas:[{texto:'Voltar.', vai:'c16_fim'}]
},

c16_fim:{
  texto:[
    d=>{
      if (d.flags.trouxe_hooh) return 'Kanto muda em uma semana. Chuva onde não chovia, seca onde chovia, e Pokémon que ninguém via há décadas aparecendo em lugares completamente errados, confusos, procurando alguma coisa.';
      if (d.flags.tocado_por_hooh || d.flags.pena_de_hooh) return 'Você volta diferente de um jeito que ninguém percebe, o que é o único jeito de voltar diferente que vale alguma coisa.';
      if (d.flags.capturou_hooh) return 'O mar se acalmou. Mas a memória de ver uma coisa grande demais vindo do oeste não sai.';
      return 'A ilha sem nome continua sem nome, sem mapa e sem visita.';
    },
    'No Centro Pokémon de Fuchsia, tem um envelope esperando por você. Papel bom. Timbre em relevo.',
    'E do lado de fora, encostado no poste, um garoto da sua idade que você não vê desde Pewter.',
    d=>{
      const t=d.npcs['Téo'];
      if (t && t.opiniao>=3) return 'Téo. Ele cresceu quinze centímetros e continua com a mesma cara de quem quer contar uma coisa.';
      if (t) return 'Téo. Ele não sorri quando te vê.';
      return 'Não é ninguém que você conheça. Ele te olha e vai embora.';
    }
  ],
  fim:true, resumo:'Capítulo 16 concluído — a ilha sem nome tinha alguém em cima.'
}
}}

);
