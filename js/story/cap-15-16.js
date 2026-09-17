/* ============================================================
   CAPÍTULOS 15–16 — Os três que correm e a ilha sem nome
   ============================================================ */
CAPITULOS.push(

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 15 — OS TRÊS QUE CORREM
   ══════════════════════════════════════════════════════════ */
{
num:15, titulo:'Os Três que Correm', local:'Rotas 14–18', ambiente:'campo', nivelArea:46,
tom:'muito sombrio', inicio:'c15_estrada',
cenas:{

c15_estrada:{
  texto:[
    'Você está na estrada entre Fuchsia e a Rota 18 quando o chão avisa antes do som.',
    'Não é tremor. É ritmo — batida de pata em solo duro, muito rápida, muito longe, vindo.',
    'Os Pokémon da rota somem em quinze segundos. Todos. Inclusive os que normalmente não fogem de nada.',
    d=>{
      const presos = Estado.lendariosCapturados().filter(l=>GRUPO_CAES.includes(l.dex));
      if (presos.length) return `Você tem ${DEX[presos[0].dex].nome} numa bola no seu cinto. E os outros dois estão vindo buscar.`;
      const cacando = Object.values(d.lendarios).filter(l=>l.caçandoVoce);
      if (cacando.length) return `Alguma coisa te caça desde ${cacando.map(l=>DEX[l.dex].nome).join(' e ')}. Talvez seja hoje.`;
      return 'Você não fez nada pra merecer isso. Nem sempre é sobre merecer.';
    }
  ],
  ef:{registrar:'Os Cães Lendários apareceram na Rota 18.'},
  escolhas:[
    {texto:'Sair da estrada e se esconder.', vai:'c15_escondeu'},
    {texto:'Ficar parado no meio da estrada.', vai:'c15_ficou'},
    {texto:'Correr.', vai:'c15_correu'}
  ]
},

c15_correu:{
  texto:[
    'Você corre. Você corre de uma coisa que faz noventa quilômetros por hora em terreno acidentado.',
    'Dura quarenta segundos.'
  ],
  ef:{hp:-4, causa:'Queda ao correr na Rota 18'},
  escolhas:[{texto:'Se virar.', vai:'c15_encontro'}]
},

c15_escondeu:{
  texto:['Você sai da estrada e se joga atrás de um barranco.'],
  teste:{status:'percepcao', dificuldade:8, nomeStatus:'Percepção',
         critico:'c15_viu_sem_ser_visto', sucesso:'c15_viu_sem_ser_visto', parcial:'c15_encontro', falha:'c15_encontro'}
},

c15_viu_sem_ser_visto:{
  texto:[
    'Você se esconde bem o suficiente pra ver sem participar.',
    'Eles passam pela estrada a quarenta metros: três vultos, em fila, no mesmo passo.',
    'Raikou na frente. Entei no meio. Suicune atrás, e Suicune corre de um jeito que não levanta poeira.',
    'Eles não estão caçando bicho. Eles estão fazendo ronda — mesmo trajeto, mesmo ritmo, como quem cerca uma área.',
    'Duzentos metros depois da estrada, eles param todos ao mesmo tempo e olham para o sul.',
    'Para Cinnabar.'
  ],
  ef:{flag:['viu_os_tres','caes_olham_cinnabar'],
      executar:d=>{ GRUPO_CAES.forEach(x=>Estado.lend(x).encontros++); return []; },
      registrar:'Os três cães fazem ronda e olham para Cinnabar.'},
  escolhas:[
    {texto:'Sair do esconderijo e chamar a atenção deles.', vai:'c15_encontro'},
    {texto:'Deixar passar e seguir a rota.', vai:'c15_deixou_passar'},
    {texto:'Seguir eles.', vai:'c15_seguiu'}
  ]
},

c15_deixou_passar:{
  texto:[
    'Você espera quarenta minutos depois de eles sumirem e só então sai do barranco.',
    'A rota está vazia. Vai continuar vazia por dias — os Pokémon daqui não voltam tão cedo.',
    'Você fez a coisa sensata. Você vai pensar nisso muitas vezes.'
  ],
  ef:{flag:'evitou_os_caes'},
  escolhas:[{texto:'Seguir.', vai:'c15_fim'}]
},

c15_seguiu:{
  texto:[
    'Você segue três lendários a pé. É uma ideia ruim e você tem consciência plena disso.',
    'Eles não andam rápido quando não estão correndo — andam em ritmo de patrulha, e dá pra acompanhar de longe.',
    'Ao anoitecer, eles param num ponto alto da Rota 18, de onde se vê o mar e Cinnabar do outro lado.',
    'E fazem uma coisa que você não esperava nunca: deitam. Os três. Virados pro sul.',
    'Eles estão vigiando a ilha. Há quanto tempo, não dá pra saber.'
  ],
  ef:{flag:['seguiu_os_caes','caes_vigiam_cinnabar'],
      rep:{eixo:'bom',delta:1,motivo:'Seguiu três lendários e não atacou nenhum'},
      registrar:'Os cães lendários vigiam Cinnabar de um ponto alto da Rota 18.'},
  escolhas:[
    {texto:'Chegar perto.', vai:'c15_encontro'},
    {texto:'Acampar e vigiar junto, a distância.', vai:'c15_vigiou_junto'}
  ]
},

c15_vigiou_junto:{
  texto:[
    'Você acampa a cento e cinquenta metros e vigia junto. Sem fogo, sem barulho.',
    'Às 3h40, Raikou levanta a cabeça e olha exatamente na sua direção.',
    'Ele sabia que você estava ali desde o começo. Ele deixou.',
    'Depois volta a deitar.',
    'De manhã, quando você acorda, eles não estão mais lá — e do lado da sua barraca, no chão, tem três marcas de pata. Uma de cada.',
    'Eles vieram até você enquanto você dormia e escolheram não fazer nada.'
  ],
  ef:{flag:'caes_te_toleram',
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); if(L.disposicao==='neutro') L.disposicao='passivo'; }); return []; },
      rep:{eixo:'bom',delta:2,motivo:'Dormiu a 150 metros de três lendários e nenhum atacou'},
      registrar:'Os três cães te toleram. Passaram ao lado da sua barraca e não fizeram nada.'},
  escolhas:[{texto:'Seguir viagem.', vai:'c15_fim'}]
},

c15_ficou:{
  texto:[
    'Você fica no meio da estrada.',
    'Não é coragem exatamente — é a sensação, que você não sabe explicar, de que correr seria a pior decisão possível.',
    'Eles param a doze metros. Os três, ao mesmo tempo, sem desacelerar antes.',
    'Silêncio absoluto por quatro segundos.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Não correu'}, flag:'encarou_os_caes'},
  escolhas:[{texto:'Continuar parado.', vai:'c15_encontro'}]
},

c15_encontro:{
  texto:[
    'Os três estão na sua frente.',
    'Raikou, com o pelo levantado por carga elétrica constante. Entei, com o ar tremendo em volta dele. Suicune, absolutamente imóvel, e o mais assustador dos três por causa disso.',
    d=>{
      const presos = Estado.lendariosCapturados().filter(l=>GRUPO_CAES.includes(l.dex));
      if (presos.length===2) return 'Só que não são três. São um. O terceiro, sozinho, com os outros dois no seu cinto. E "sozinho" nesse caso é uma palavra que significa algo muito específico e muito perigoso.';
      if (presos.length===1) return 'Só que não são três. São dois — porque o terceiro está numa bola no seu cinto, e os dois que sobraram vieram exatamente por causa disso.';
      return 'Eles não avançam. Ficam ali, os três, a doze metros, olhando.';
    },
    d=>{
      const presos = Estado.lendariosCapturados().filter(l=>GRUPO_CAES.includes(l.dex));
      if (presos.length) return 'Suicune dá um passo à frente e abaixa a cabeça — não em submissão. Em posição de investida.';
      if (d.flags.tem_sangue_nas_maos) return 'Entei dá um passo à frente. O asfalto embaixo da pata dele racha com o calor.';
      return 'Nenhum dos três avança. Eles estão te medindo.';
    }
  ],
  ef:{executar:d=>{ GRUPO_CAES.forEach(x=>Estado.lend(x).encontros++); return []; }},
  escolhas:[
    {texto:'Soltar os que você tem. Agora.', vai:'c15_soltou_caes',
     cond:d=>Estado.lendariosCapturados().some(l=>GRUPO_CAES.includes(l.dex))},
    {texto:'Mostrar as mãos vazias e não se mexer.', vai:'c15_maos_vazias'},
    {texto:'Oferecer comida.', vai:'c15_comida_caes', cond:d=>Estado.contaItem('Ração')>0},
    {texto:'Atacar. Três lendários numa estrada é uma chance única.', vai:'c15_luta_cao'},
    {texto:'Falar com eles. Em voz alta. Como se entendessem.', vai:'c15_falou'}
  ]
},

c15_soltou_caes:{
  texto:[
    'Você tira a bola do cinto e abre.',
    'O que sai dela não corre para os outros. Fica parado, entre vocês, sem saber para que lado ir — porque passou tempo demais numa bola e o instinto de matilha não é uma chave que liga na hora.',
    'Os outros esperam. Não chamam, não empurram.',
    'Leva quase dois minutos.',
    'Depois ele anda até eles. Devagar. E os três se acertam ali, na estrada, na frente de uma pessoa.',
    'Só depois disso é que Suicune olha pra você de novo — e dessa vez não é investida.'
  ],
  ef:{executar:d=>{
        const avisos=[];
        [...d.time,...d.pc].filter(p=>GRUPO_CAES.includes(p.dex)).forEach(p=>{
          Captura.soltar(p).forEach(e=>avisos.push({tipo:e.tipo,texto:e.texto}));
        });
        GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); L.disposicao='desconfiado'; L.caçandoVoce=false; });
        Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade-3);
        return avisos;
      },
      rep:{eixo:'bom',delta:3,motivo:'Devolveu um Cão Lendário à matilha, na frente dela'},
      flag:'devolveu_os_caes', registrar:'Soltou os cães capturados diante dos outros.'},
  escolhas:[{texto:'Ficar parado até eles irem.', vai:'c15_foram_embora'}]
},

c15_maos_vazias:{
  texto:[
    'Você abre as mãos, devagar, e não se mexe mais.',
    'Cinquenta segundos.',
    'Entei é o primeiro a relaxar — o ar em volta dele para de tremer. Depois Raikou. Suicune leva mais tempo e nunca relaxa completamente.',
    'Eles contornam você pela estrada, os três, passando a menos de dois metros.',
    'Entei encosta de leve no seu braço ao passar. Não é carinho. É o jeito de dizer "eu podia".'
  ],
  ef:{executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); if(L.disposicao==='neutro') L.disposicao='passivo'; }); return []; },
      rep:{eixo:'bom',delta:2,motivo:'Ficou de mãos abertas diante de três lendários'},
      flag:'caes_passaram'},
  escolhas:[{texto:'Ver eles irem.', vai:'c15_foram_embora'}]
},

c15_comida_caes:{
  texto:[
    'Você coloca a ração na estrada e recua três passos.',
    'Raikou cheira de longe e ignora. Entei nem olha.',
    'Suicune anda até a ração, olha, e depois olha você — e você jura, pelo resto da vida, que aquele olhar era de pena.',
    'Eles não comem ração. Eles não comem nada que você tenha.',
    'Mas Suicune fica. Os outros dois seguem, e Suicune fica mais dez segundos olhando pra você antes de ir.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Ração'); const L=Estado.lend(245); if(L.disposicao==='neutro') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:1,motivo:'Ofereceu o que tinha, mesmo sendo inútil'},
      flag:'suicune_ficou'},
  escolhas:[
    {texto:'Ver eles irem.', vai:'c15_foram_embora'},
    {texto:'Tentar capturar Suicune agora que ele ficou.', vai:'c15_luta_cao',
     ef:{rep:{eixo:'ruim',delta:2,motivo:'Atacou o único lendário que tinha ficado'}, flag:'traiu_suicune',
         executar:d=>{ GRUPO_CAES.forEach(x=>{Estado.lend(x).disposicao='hostil';}); return []; }}}
  ]
},

c15_falou:{
  texto:[
    '"Vocês estão olhando pra Cinnabar."',
    'Você diz isso em voz alta, numa estrada vazia, para três animais lendários.',
    'Raikou vira a cabeça de lado — um gesto tão de cachorro, tão comum, que quebra alguma coisa na sua cabeça.',
    'Eles não entendem palavras. Mas entenderam que você falou, e que você falou olhando pro sul.',
    'Suicune anda até você — até muito perto, até você sentir a temperatura do hálito dele — e depois vira e olha pro sul também.',
    'Vocês dois ficam ali, olhando a mesma ilha, por um tempo que você não consegue medir.'
  ],
  ef:{flag:['falou_com_os_caes','caes_vigiam_cinnabar'],
      executar:d=>{ GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); if(L.disposicao!=='hostil') L.disposicao='passivo'; }); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Falou com três lendários como quem fala com alguém'},
      registrar:'Falou com os três cães. Suicune olhou para Cinnabar junto com você.'},
  escolhas:[
    {texto:'"Eu vou lá."', vai:'c15_prometeu_caes',
     ef:{flag:'prometeu_aos_caes', rep:{eixo:'bom',delta:1,motivo:'Prometeu a três lendários que iria à ilha'}}},
    {texto:'Ficar em silêncio.', vai:'c15_foram_embora'}
  ]
},

c15_prometeu_caes:{
  texto:[
    '"Eu vou lá."',
    'Suicune olha pra você mais uma vez e sai andando — não corre. Anda.',
    'Os outros dois seguem.',
    'A trinta metros, os três param e olham pra trás ao mesmo tempo, esperando você começar a andar.',
    'Eles não estão te acompanhando. Eles estão conferindo se você vai cumprir.'
  ],
  ef:{flag:'caes_conferindo'},
  escolhas:[{texto:'Começar a andar.', vai:'c15_fim'}]
},

c15_luta_cao:{
  texto:[
    'Você saca uma bola numa estrada, contra três.',
    'Dois deles recuam — não por medo. Por acordo. Eles decidem em algum lugar que não é aqui que é um contra um.',
    'O que fica é o que você escolheu olhar primeiro.'
  ],
  batalha:{aleatorio:false, dex:244, nivel:55, tipo:'lendario', fuga:true, ambiente:'campo',
           vitoria:'c15_pos_cao', derrota:'c15_pos_cao', fuga2:'c15_fugiu_dos_caes',
           captura:'c15_capturou_cao', gameover:'gameover'}
},

c15_pos_cao:{
  texto:[
    'Ele recua para junto dos outros.',
    'Os três te olham em silêncio por um tempo desconfortável, e depois viram e vão embora juntos — no mesmo passo, sem pressa.',
    'Eles vieram, foram atacados por uma pessoa e foram embora sem matar essa pessoa.',
    'Isso é a coisa mais próxima de julgamento que você já recebeu.'
  ],
  ef:{executar:d=>{
        GRUPO_CAES.forEach(x=>{ const L=Estado.lend(x); L.ataquesSofridos++; if(L.ataquesSofridos>=2) L.disposicao='hostil'; });
        return [{tipo:'mundo', texto:'Os três se afastaram. Eles decidiram alguma coisa sobre você.'}];
      },
      rep:{eixo:'ruim',delta:2,motivo:'Atacou os Cães Lendários na Rota 18'}},
  escolhas:[
    {texto:'Tentar de novo com outro.', vai:'c15_luta_cao'},
    {texto:'Parar.', vai:'c15_foram_embora'}
  ]
},

c15_fugiu_dos_caes:{
  texto:[
    'Você foge de três lendários numa estrada aberta, o que só funciona porque eles deixam.',
    'Você entende isso enquanto corre e não é uma sensação boa.'
  ],
  escolhas:[{texto:'Continuar.', vai:'c15_fim'}]
},

c15_capturou_cao:{
  texto:[
    'A bola fecha numa estrada aberta, na frente dos outros dois.',
    'Eles não atacam. Isso é o mais perturbador: eles não atacam.',
    'Raikou dá um passo à frente e cheira a bola no seu cinto. Depois recua.',
    'E aí os dois saem correndo — não para longe. Em volta. Um círculo de duzentos metros de raio, em velocidade máxima, em torno de você.',
    'Eles dão três voltas e vão embora.',
    'Você acabou de ser marcado de um jeito que não sai.'
  ],
  ef:{instabilidade:2, flag:'marcado_pelos_caes',
      registrar:'Capturou um Cão Lendário. Os outros dois deram três voltas em torno de você antes de sumir.'},
  escolhas:[
    {texto:'Soltar imediatamente.', vai:'c15_soltou_caes'},
    {texto:'Ficar com ele.', vai:'c15_ficou_com_cao'}
  ]
},

c15_ficou_com_cao:{
  texto:[
    'Você segue viagem com um Cão Lendário no cinto.',
    'Nos dias seguintes, três coisas acontecem em ordem:',
    'Primeiro, você começa a ouvir passos à noite, sempre a uma distância que não dá pra confirmar.',
    'Segundo, Pokémon selvagens param de aparecer nas rotas onde você anda. Todos. Como se avisassem uns aos outros.',
    'Terceiro, num vilarejo da Rota 17, você chega e encontra dois currais destruídos, sem nenhum ferido, e todo mundo perguntando o que passou por ali na noite anterior.',
    'Eles não vão te atacar de frente. Eles vão andar na sua frente destruindo coisas até você entender.'
  ],
  ef:{flag:'caes_caçam_voce', instabilidade:2,
      rep:{eixo:'ruim',delta:2,motivo:'Manteve um Cão Lendário e os outros começaram a destruir propriedades'},
      executar:d=>{ GRUPO_CAES.forEach(x=>{const L=Estado.lend(x); if(L.estado!=='capturado'){L.disposicao='hostil';L.caçandoVoce=true;}}); return []; },
      registrar:'Os cães passaram a destruir propriedades no seu rastro.'},
  escolhas:[{texto:'Seguir.', vai:'c15_fim'}]
},

c15_foram_embora:{
  texto:[
    'Eles vão embora em fila, no mesmo passo, e o som some antes deles sumirem de vista.',
    'A estrada leva quase uma hora pra voltar a ter bicho.',
    'Quando volta, um Rattata sai do mato, olha pra você, e some de novo — e é a coisa mais normal que aconteceu no seu dia.'
  ],
  escolhas:[{texto:'Seguir.', vai:'c15_fim'}]
},

c15_fim:{
  texto:[
    d=>{
      if (d.flags.caes_vigiam_cinnabar || d.flags.caes_olham_cinnabar) return 'Três lendários olhando pra mesma ilha por meses não é comportamento de caça nem de território. É comportamento de quem espera uma coisa sair de lá.';
      if (d.flags.caes_caçam_voce) return 'Nos próximos dias, cada lugar por onde você passa amanhece com alguma coisa quebrada. Nunca ninguém ferido. Sempre alguma coisa quebrada.';
      return 'Você não sabe o que eles estavam fazendo ali. Ninguém sabe. Esse é o ponto dos lendários — eles não explicam.';
    },
    'Em Fuchsia, no cais, um velho pescador está contando uma história que ninguém acredita.',
    '"Eu vi um arco-íris de noite", ele diz. "Sobre a ilha que não tem nome. De NOITE."',
    'Todo mundo ri. Você não.'
  ],
  fim:true, resumo:'Capítulo 15 concluído — os três estão esperando alguma coisa.'
}
}},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 16 — A ILHA SEM NOME
   ══════════════════════════════════════════════════════════ */
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
    '"...o padrão é bianual, a gente perdeu duas janelas esperando autorização..." Ela para de falar quando te vê.',
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
