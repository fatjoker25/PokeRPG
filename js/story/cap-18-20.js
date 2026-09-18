/* ============================================================
   CAPÍTULOS 18–20 — A COMISSÃO
   O que veio depois da Rocket não usa uniforme. Usa estatuto.
   ============================================================ */
CAPITULOS.push(

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 18 — ATAS
   ══════════════════════════════════════════════════════════ */
{
num:18, titulo:'Atas', local:'Saffron / Celadon', ambiente:'cidade', nivelArea:52,
tom:'muito sombrio', inicio:'c18_fio',
cenas:{

c18_fio:{
  texto:[
    'Você passou meses puxando fios diferentes e todos eles davam nó no mesmo lugar.',
    d=>{
      const n = conhecimentoComissao();
      if (n >= 4) return 'Sete cargas do depósito de Celadon com destino SPH-11. Dezenove anos de "manejo" na Zona Safári com comprador não identificado. Uma expedição com equipamento da Silph numa ilha sem mapa. Quatro pessoas caçando Mew com dinheiro de alguém.';
      if (n >= 2) return 'O livro de destinos tinha uma sigla repetida. A Zona Safári tinha um comprador que ninguém nomeava. E o andar 11 tinha um prazo de noventa dias imposto por um "conselho".';
      return 'Você tem pedaços: uma sigla, um prazo, um conselho que ninguém nomeia. Pouco, mas todos apontam para o mesmo lugar.';
    },
    'Um "conselho". Uma "comissão". Sempre no singular, sempre sem nome, sempre como se fosse óbvio de quem se trata.',
    'Você decide fazer a coisa mais óbvia que ninguém fez ainda: procurar o nome num cartório.'
  ],
  ef:{registrar:'Decidiu procurar o nome da organização no registro público.'},
  escolhas:[
    {texto:'Ir ao cartório de registro de pessoas jurídicas em Saffron.', vai:'c18_cartorio'},
    {texto:'Perguntar à Dra. Ivone.', vai:'c18_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Perguntar à Terceira — ela sabe pra quem vende.', vai:'c18_terceira', cond:d=>!!d.flags.conheceu_terceira},
    {texto:'Perguntar na Liga.', vai:'c18_liga'}
  ]
},

c18_cartorio:{
  texto:[
    'O cartório fecha às 17h e você chega às 16h20.',
    'A funcionária ouve o que você quer, digita, e devolve o resultado em quarenta segundos.',
    '"Comissão de Gestão de Risco Biológico de Kanto. CGRB." Ela vira a tela pra você. "Associação civil sem fins lucrativos. Registrada há um ano e oito meses. Estatuto público, atas públicas."',
    '"Públicas?"',
    '"Associação é obrigada a publicar." Ela dá de ombros. "Custa oito reais a cópia."',
    'Você paga oito reais por cento e quarenta páginas de atas de reunião de uma organização que ninguém em Kanto sabe que existe.'
  ],
  ef:{flag:['sabe_da_comissao','tem_as_atas'], dinheiro:-100,
      rep:{eixo:'bom',delta:1,motivo:'Encontrou a Comissão num cartório, por oito reais'},
      registrar:'Descobriu a CGRB no registro público e comprou 140 páginas de atas.'},
  escolhas:[{texto:'Ler as atas.', vai:'c18_leitura'}]
},

c18_ivone:{
  texto:[
    '"CGRB." A Dra. Ivone diz a sigla antes de você terminar de descrever. "Eu sei o que é."',
    '"Você sabe e não me falou?"',
    '"Eu não te falei porque eu não tinha prova e porque falar sem prova é como eu perco processo." Ela pega uma pasta. "Comissão de Gestão de Risco Biológico. Associação civil. Registrada. Legal."',
    '"Eles compram do setor 7, financiam o andar 11 e mandaram a equipe pra ilha. E é tudo legal, ou quase, porque eles fizeram questão de que fosse."',
    'Ela empurra a pasta pra você. "As atas são públicas. Eu comprei as minhas faz seis meses. Leia e depois a gente conversa, porque eu quero ver a sua cara quando você chegar na página quarenta."'
  ],
  ef:{flag:['sabe_da_comissao','tem_as_atas','ivone_sabia'],
      npc:{nome:'Dra. Ivone', opiniao:1, memoria:'Já conhecia a CGRB e esperou você chegar sozinho até lá.'},
      registrar:'Dra. Ivone já conhecia a Comissão há seis meses.'},
  escolhas:[{texto:'Ler as atas.', vai:'c18_leitura'}]
},

c18_terceira:{
  texto:[
    'A Terceira ouve a pergunta e fuma metade de um cigarro antes de responder.',
    '"Comissão." Ela solta a fumaça. "Sabe por que eu nunca te falei deles? Porque eu não trabalho pra eles. Eu VENDO pra eles."',
    '"Qual a diferença?"',
    '"A diferença é que eu sei o que eu sou." Ela apaga o cigarro. "Eu sou traficante. Eu vendo coisa viva pra quem paga. Isso é feio e eu não tenho ilusão nenhuma."',
    '"Eles acham que estão salvando Kanto. E é por isso que eles vão fazer coisa que eu nunca faria."',
    'Ela escreve um endereço num guardanapo. De novo. "Cartório da rua Dez, em Saffron. As atas são públicas. É isso que me assusta neles."'
  ],
  ef:{flag:'sabe_da_comissao',
      npc:{nome:'A Terceira', opiniao:2, memoria:'Te contou da Comissão e disse que ela é pior do que ela.'},
      registrar:'A Terceira revelou: ela vende para a Comissão e tem medo deles.'},
  escolhas:[{texto:'Ir ao cartório.', vai:'c18_cartorio'}]
},

c18_liga:{
  texto:[
    'Você pergunta na Liga e a resposta demora três dias.',
    'Quando vem, vem por telefone, de alguém que não se identifica: "A Comissão é uma associação privada com atas públicas. Não há inquérito em curso. Não há previsão de haver."',
    '"Por quê?"',
    'Uma pausa longa demais para ser falta de informação.',
    '"Porque parte do nosso conselho consultivo integra o conselho deles."',
    'A ligação cai antes de você perguntar quem.'
  ],
  ef:{flag:['sabe_da_comissao','liga_infiltrada'], instabilidade:1,
      rep:{eixo:'bom',delta:1,motivo:'Fez a pergunta que a Liga não queria responder'},
      registrar:'Alguém do conselho da Liga também integra o conselho da Comissão.'},
  escolhas:[{texto:'Ir ao cartório buscar as atas.', vai:'c18_cartorio'}]
},

c18_leitura:{
  texto:[
    'Cento e quarenta páginas. Você lê num quarto de Centro Pokémon, a noite inteira, com um lápis.',
    'Não tem código, não tem cifra, não tem linguagem de crime. Tem pauta, deliberação e voto.',
    COMISSAO.estatuto[0],
    COMISSAO.estatuto[3],
    'Na página quarenta, o Art. 19:',
    COMISSAO.estatuto[4],
    '"Descarte." A mesma palavra que estava nas últimas três páginas do livro de Celadon, com uma data ao lado de cada linha.',
    'Você fica olhando essa página por muito tempo.'
  ],
  ef:{flag:['leu_as_atas','entendeu_a_comissao'], instabilidade:1,
      registrar:'Leu o estatuto da CGRB. O Art. 19 autoriza descarte de unidades inviáveis.'},
  escolhas:[
    {texto:'Continuar lendo até o fim.', vai:'c18_pagina_cento'},
    {texto:'Parar. Você já entendeu.', vai:'c18_auditora'}
  ]
},

c18_pagina_cento:{
  texto:[
    'Página 103, ata da 31ª reunião ordinária:',
    '"Deliberação 4: aprovada, por unanimidade, a Fase II do programa de substituição populacional na Rota 21, com meta de liberação de 400 unidades no primeiro semestre."',
    '"Voto em separado do Curador Adnan: manifesta preocupação com a irreversibilidade da liberação em ambiente aberto. Voto vencido."',
    'Página 118, ata da 34ª:',
    '"Comunicação da Presidência: o indivíduo classificado como Risco 01 permanece não localizado. Reitera-se que a Fase III depende de material da matriz original."',
    'Risco 01.',
    'Eles numeram Mewtwo. Ele é o primeiro item de uma lista, numa ata, com número.'
  ],
  ef:{flag:['sabe_da_fase2','sabe_do_risco01','sabe_da_rota21'], instabilidade:1,
      registrar:'Fase II: liberar 400 unidades na Rota 21. Mewtwo é o "Risco 01" deles.'},
  escolhas:[{texto:'Fechar as atas.', vai:'c18_auditora'}]
},

c18_auditora:{
  texto:[
    'De manhã, tem alguém sentada na cadeira do outro lado do quarto.',
    'Não arrombou nada. A porta está intacta. Ela tem uma chave, porque a Comissão tem contrato de manutenção com a rede de Centros Pokémon, porque é uma associação civil registrada e isso é uma coisa que associações civis registradas têm.',
    '"Auditora Prado." Ela mostra um crachá que é real. "Você comprou um material público, então eu não vou te acusar de nada."',
    '"Eu vim te fazer uma pergunta e vou aceitar qualquer resposta, inclusive a que eu não quero."',
    '"O que você pretende fazer com isso?"'
  ],
  ef:{npc:{nome:'Auditora Prado', opiniao:0, memoria:'Apareceu no seu quarto no Centro Pokémon com um crachá de verdade.'},
      flag:'conheceu_auditora'},
  escolhas:[
    {texto:'"Publicar. Tudo."', vai:'c18_publicar'},
    {texto:'"Ainda não sei."', vai:'c18_nao_sei'},
    {texto:'"Nada. Eu li e vou seguir a minha vida."', vai:'c18_nada'},
    {texto:'"Quero conversar com quem manda."', vai:'c18_conversar'},
    {texto:'Atacar. Ela entrou no seu quarto.', vai:'c18_luta_auditora'}
  ]
},

c18_publicar:{
  texto:[
    '"Publicar. Tudo."',
    'Ela assente devagar, como quem confirma uma hipótese.',
    '"Tá." Ela se levanta. "Eu vou te dizer o que vai acontecer, sem ironia, porque eu já vi acontecer duas vezes."',
    '"Você vai publicar. Vai sair em jornal pequeno. A Comissão vai emitir uma nota dizendo que o material é público e que qualquer cidadão pode consultá-lo — o que é verdade."',
    '"Em três semanas o assunto morre, e a Fase II continua, e a única coisa que muda é que você passa a ser uma pessoa que a gente acompanha."',
    'Na porta, ela para. "Eu torço pra estar errada. Sinceramente. Já são duas vezes."'
  ],
  ef:{flag:'vai_publicar',
      rep:{eixo:'bom',delta:2,motivo:'Disse na cara de uma auditora que ia publicar tudo'},
      npc:{nome:'Auditora Prado', opiniao:2, memoria:'Você disse que ia publicar. Ela torceu para estar errada.'}},
  escolhas:[{texto:'Publicar.', vai:'c18_publicacao'}]
},

c18_publicacao:{
  texto:[
    'Você publica. Com a Dra. Ivone, com o jornal de Fuchsia, com quem topar.',
    'Sai. Sai de verdade: três veículos, uma nota da Liga, um debate de rádio de quarenta minutos.',
    'A Comissão responde no mesmo dia com uma nota de duas páginas que cita os artigos do próprio estatuto e informa o endereço do cartório onde qualquer cidadão pode consultar as atas.',
    'A nota deles é melhor escrita que a sua denúncia.',
    'Em dezenove dias, o assunto sai do noticiário.',
    'A Fase II continua no cronograma.'
  ],
  ef:{flag:['publicou_as_atas','comissao_sabe_de_voce'],
      rep:{eixo:'bom',delta:2,motivo:'Expôs a Comissão publicamente'},
      registrar:'Publicou as atas. Durou dezenove dias no noticiário.'},
  escolhas:[
    {texto:'"Então eu vou lá pessoalmente."', vai:'c18_adnan'},
    {texto:'Aceitar que acabou.', vai:'c18_fim'}
  ]
},

c18_nao_sei:{
  texto:[
    '"Ainda não sei."',
    'É a primeira vez que a expressão dela muda.',
    '"Essa é uma resposta boa." Ela senta de novo. "Todo mundo que lê aquilo já sabe o que vai fazer antes da página vinte. Os dois tipos: os que vão publicar e os que vão pedir emprego."',
    '"E os que não sabem?"',
    '"São os que a gente respeita e os que dão mais trabalho." Ela tira um cartão do bolso. "Tem um Curador que quer falar com você. Adnan. Ele é o melhor argumentador que eu conheço e ele acredita em tudo o que fala."',
    '"Isso é aviso ou convite?"',
    '"É os dois. É sempre os dois."'
  ],
  ef:{flag:'cartao_adnan',
      npc:{nome:'Auditora Prado', opiniao:3, memoria:'Você disse que não sabia. Ela respeitou isso.'},
      rep:{eixo:'bom',delta:1,motivo:'Foi honesto sobre não ter decidido'}},
  escolhas:[
    {texto:'Encontrar o Curador Adnan.', vai:'c18_adnan'},
    {texto:'Publicar as atas mesmo assim.', vai:'c18_publicacao'}
  ]
},

c18_nada:{
  texto:[
    '"Nada. Eu li e vou seguir a minha vida."',
    'Ela olha pra você por quatro segundos e você entende, pela cara dela, que ela não acredita.',
    '"Certo." Ela se levanta. "Boa jornada."',
    'Ela sai e fecha a porta devagar.',
    'Você fica no quarto com cento e quarenta páginas em cima da cama e a certeza absoluta de que acabou de mentir pra si mesmo em voz alta na frente de uma testemunha.'
  ],
  ef:{flag:'mentiu_para_prado',
      npc:{nome:'Auditora Prado', opiniao:-1, memoria:'Você disse que não ia fazer nada. Ela não acreditou.'}},
  escolhas:[
    {texto:'Ir atrás deles mesmo assim.', vai:'c18_adnan'},
    {texto:'Ir mesmo embora.', vai:'c18_fim', ef:{flag:'ignorou_a_comissao', rep:{eixo:'ruim',delta:2,motivo:'Leu tudo sobre a Comissão e virou as costas'}}}
  ]
},

c18_conversar:{
  texto:[
    '"Quero conversar com quem manda."',
    '"Todo mundo quer." Ela já está anotando. "E, diferente de qualquer organização criminosa que você conheceu até hoje, aqui isso é possível: a Presidente atende quem pede."',
    'Ela arranca a folha e te entrega. Tem um endereço, um horário e um número de sala.',
    '"Só que não é hoje. Hoje ela está no viveiro, e no viveiro não entra visita."',
    '"Que viveiro?"',
    'Ela para. Foi um deslize, e ela sabe que foi.',
    '"Rota 21", ela diz, depois de pensar. "Eu vou ser repreendida por isso e vou aceitar a repreensão."'
  ],
  ef:{flag:['cartao_adnan','sabe_da_rota21','endereco_presidente'],
      npc:{nome:'Auditora Prado', opiniao:4, memoria:'Deixou escapar a localização do viveiro de propósito. Sabia que seria repreendida.'},
      rep:{eixo:'bom',delta:1,motivo:'Pediu para falar com quem manda, e conseguiu'},
      registrar:'A Auditora Prado entregou a Rota 21 e o endereço da Presidente.'},
  escolhas:[
    {texto:'Falar com o Curador Adnan primeiro.', vai:'c18_adnan'},
    {texto:'Ir direto à Rota 21.', vai:'c18_fim', ef:{flag:'vai_pro_viveiro'}}
  ]
},

c18_luta_auditora:{
  texto:[
    'Você ataca uma funcionária com crachá dentro de um Centro Pokémon.',
    '"Isso é péssimo pra você." Ela solta a primeira bola sem pressa. "E é ótimo pro meu relatório."'
  ],
  batalha:{comissao:'auditora', nivel:50, tipo:'treinador', treinador:'Auditora Prado', fuga:true,
           vitoria:'c18_venceu_auditora', derrota:'c18_perdeu_auditora', fuga2:'c18_adnan', gameover:'gameover'}
},

c18_venceu_auditora:{
  texto:[
    'As três unidades dela caem em sequência e nenhuma delas reage como Pokémon reage.',
    'Elas não fogem, não rosnam, não procuram a treinadora. Ficam onde caíram, esperando ser recolhidas.',
    'Você olha as bolas na mão dela. Nenhuma tem nome. Todas têm código.',
    '"Unidade três-A, três-B, três-C." Prado recolhe uma por uma. "Elas nasceram em bandeja. Você está com nojo de mim e eu não vou te culpar por isso."',
    '"Mas foi você que derrubou três coisas que não escolheram nada, e não fui eu."'
  ],
  ef:{flag:['viu_as_unidades','entendeu_a_comissao'],
      rep:{eixo:'ruim',delta:1,motivo:'Atacou uma funcionária dentro de um Centro Pokémon'},
      npc:{nome:'Auditora Prado', opiniao:-2, memoria:'Você atacou ela num quarto de Centro Pokémon e venceu.'},
      registrar:'Enfrentou a Auditora Prado. As unidades dela não têm nome, só código de lote.'},
  escolhas:[
    {texto:'"O que são essas coisas?"', vai:'c18_explicacao_unidades'},
    {texto:'Pegar as atas e sair.', vai:'c18_fim'}
  ]
},

c18_perdeu_auditora:{
  texto:[
    'Você perde no seu próprio quarto.',
    'Ela não leva as atas. Não leva nada. Levanta, endireita a cadeira que caiu, e vai embora.',
    'Na porta: "As atas são públicas. Eu não tenho autorização pra tirar de você uma coisa que qualquer um compra por oito reais."',
    'Isso é infinitamente pior do que se ela tivesse levado.'
  ],
  ef:{hp:-4, causa:'Batalha num quarto de Centro Pokémon',
      npc:{nome:'Auditora Prado', opiniao:0, memoria:'Te venceu no seu quarto e não levou nada.'}},
  escolhas:[
    {texto:'"O que são essas coisas que você usa?"', vai:'c18_explicacao_unidades'},
    {texto:'Deixar ela ir.', vai:'c18_adnan'}
  ]
},

c18_explicacao_unidades:{
  texto:[
    '"O que são essas coisas?"',
    'Prado demora pra responder. Quando responde, é sem defesa nenhuma.',
    '"Unidades de viveiro. Nascem em incubadora, de material genético comprado ou coletado. Crescem em quatorze semanas em vez de dois anos."',
    '"Elas são dóceis por seleção, não por treino. Não têm instinto territorial, não têm hierarquia, não reproduzem."',
    '"E servem pra quê?"',
    '"Pra soltar." Ela fecha a maleta. "A Fase II solta quatrocentas na Rota 21 no primeiro semestre. Elas ocupam o nicho das populações silvestres sem os riscos das populações silvestres."',
    '"Isso é substituir Kanto por uma maquete de Kanto."',
    '"É." Ela diz isso sem hesitar um segundo. "É exatamente isso. E funciona, e é mais barato que conservação, e por isso vai acontecer com você ou sem você."'
  ],
  ef:{flag:['sabe_da_fase2','sabe_da_rota21','entendeu_a_comissao'], instabilidade:1,
      registrar:'Prado explicou as unidades de viveiro e a Fase II.'},
  escolhas:[{texto:'"Onde é o viveiro?"', vai:'c18_adnan'}]
},

c18_adnan:{
  texto:[
    'O Curador Adnan te encontra numa lanchonete comum, de tarde, e paga o seu lanche antes de você chegar.',
    'Ele tem trinta e poucos anos e a característica mais desarmante possível: ele te escuta.',
    'Você fala por onze minutos sem ser interrompido uma vez.',
    'Quando você termina, ele não rebate. Ele concorda.',
    '"Você tem razão em tudo, menos numa coisa." Ele mexe o café. "Você acha que existe uma alternativa e que ela só não foi tentada por má-fé."',
    COMISSAO.doutrina[0],
    COMISSAO.doutrina[1],
    COMISSAO.doutrina[3],
    '"A resposta institucional a essas duas coisas foi emitir notas de esclarecimento." Ele finalmente bebe o café. "Eu li todas. Eu escrevi duas."'
  ],
  ef:{npc:{nome:'Curador Adnan', opiniao:1, memoria:'Te ouviu por onze minutos sem interromper, na lanchonete.'},
      flag:'conheceu_adnan', registrar:'O Curador Adnan apresentou a doutrina da Comissão.'},
  escolhas:[
    {texto:'"E o Art. 19? O descarte?"', vai:'c18_art19'},
    {texto:'"Quanto vocês pagam?"', vai:'c18_oferta'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'},
    {texto:'"Não interessa se funciona."', vai:'c18_moral'}
  ]
},

c18_art19:{
  texto:[
    '"E o Art. 19?"',
    'É a primeira vez que ele desvia o olhar.',
    '"Eu votei contra." Ele diz isso baixo. "Está na ata. Voto vencido, 11 a 1."',
    '"E você continuou."',
    '"Eu continuei." Ele encara você de volta. "Porque sair da sala não muda o voto. Ficar dentro dela me deu onze derrotas e duas vitórias, e as duas vitórias existem, e sem elas seria pior."',
    '"Isso é a coisa mais covarde ou mais corajosa que eu já ouvi e eu não sei qual."',
    '"Eu também não", ele diz. "Faz um ano e oito meses que eu não sei."'
  ],
  ef:{flag:'adnan_votou_contra',
      npc:{nome:'Curador Adnan', opiniao:3, memoria:'Admitiu que votou contra o Art. 19 e perdeu por 11 a 1.'},
      rep:{eixo:'bom',delta:1,motivo:'Fez a pergunta certa a alguém que esperava por ela'},
      registrar:'Adnan votou contra o descarte. Perdeu por 11 a 1 e ficou.'},
  escolhas:[
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'},
    {texto:'"Então me ajuda a derrubar isso por dentro."', vai:'c18_alianca_adnan'}
  ]
},

c18_alianca_adnan:{
  texto:[
    '"Então me ajuda a derrubar isso por dentro."',
    'Ele fica quieto por tempo demais.',
    '"Eu tenho crachá nível 2." Ele desliza um cartão pela mesa, virado pra baixo. "Ele abre o viveiro e não abre a sala do conselho."',
    '"Se você usar isso, em quarenta e oito horas eles vão saber que foi o meu, porque o sistema registra. Eu não vou negar e não vou fugir."',
    '"Por que você faria isso?"',
    '"Porque onze a um é um placar que eu não consigo mudar votando." Ele se levanta. "E porque você perguntou do Art. 19 antes de perguntar quanto a gente paga. Você foi o primeiro."'
  ],
  ef:{flag:['cracha_adnan','adnan_aliado'],
      npc:{nome:'Curador Adnan', opiniao:6, memoria:'Te deu o crachá nível 2 dele sabendo que seria identificado em 48 horas.'},
      rep:{eixo:'bom',delta:2,motivo:'Conseguiu um aliado dentro da Comissão'},
      registrar:'Adnan entregou o crachá nível 2. Ele será identificado em 48 horas.'},
  escolhas:[{texto:'Ir para a Rota 21.', vai:'c18_fim', ef:{flag:'vai_pro_viveiro'}}]
},

c18_oferta:{
  texto:[
    '"Quanto vocês pagam?"',
    'Adnan não demonstra decepção, o que é pior do que demonstrar.',
    '"Auditor de campo inicial: quarenta mil por mês, equipamento, cobertura jurídica e um plano de saúde que cobre ferimento em serviço." Ele recita sem consultar nada.',
    '"E o que eu faço?"',
    '"Você já faz." Ele sorri sem alegria. "Você anda em rota, entra onde não devia e resolve coisa sozinho. A diferença é que passa a ter uma pauta e uma linha orçamentária."'
  ],
  escolhas:[
    {texto:'Aceitar.', vai:'c18_entrou_na_comissao'},
    {texto:'"Era teste, né."', vai:'c18_era_teste'},
    {texto:'Recusar.', vai:'c18_pedido_viveiro'}
  ]
},

c18_entrou_na_comissao:{
  texto:[
    'Você assina três folhas numa lanchonete.',
    'Não tem juramento, não tem uniforme, não tem tatuagem. Tem contrato de prestação de serviço, número de matrícula e um crachá que sai em cinco dias úteis.',
    'É a coisa mais banal que já te aconteceu e ela muda tudo.'
  ],
  ef:{flag:['trabalha_para_comissao','cracha_comissao'],
      dinheiro:40000, itens:{'Ultra Ball':3,'Hyper Potion':3,'Full Heal':3},
      rep:{eixo:'ruim',delta:3,motivo:'Entrou para a Comissão como auditor de campo'},
      executar:d=>{ Historia.definirVia('mercenario','assinou com a Comissão'); return [{tipo:'mundo', texto:'Você agora é da Comissão. Isso vai mudar como a Liga, os ginásios e o norte te tratam.'}]; },
      npc:{nome:'Curador Adnan', opiniao:2, memoria:'Te recrutou numa lanchonete.'},
      registrar:'Assinou contrato como Auditor de Campo da CGRB.'},
  escolhas:[{texto:'Ir para a Rota 21 — agora como funcionário.', vai:'c18_fim', ef:{flag:'vai_pro_viveiro'}}]
},

c18_era_teste:{
  texto:[
    '"Era teste, né."',
    'Adnan ri de verdade pela primeira vez.',
    '"Era. E você passou." Ele guarda a carteira. "Mas eu ia pagar de verdade, se você tivesse aceitado. Essa é a parte que ninguém acredita."',
    '"Eu acredito."',
    '"Pois é. Esse é o problema."'
  ],
  ef:{npc:{nome:'Curador Adnan', opiniao:4, memoria:'Você percebeu que a oferta era teste. Ele gostou.'},
      rep:{eixo:'bom',delta:1,motivo:'Não se vendeu nem quando era fácil'}},
  escolhas:[{texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'}]
},

c18_moral:{
  texto:[
    '"Não interessa se funciona."',
    'Adnan põe a xícara na mesa.',
    '"Essa é a única frase que me derruba e você achou ela em onze minutos." Ele esfrega os olhos. "Eu não tenho resposta. Eu tenho planilha."',
    '"A planilha diz que a Fase II reduz em 60% os incidentes graves com Pokémon silvestres em três anos. Sessenta por cento. Isso é gente que não vai pro hospital."',
    '"E do outro lado eu tenho... o quê? O direito de um Pidgey de existir sem ser projetado? Eu acredito nisso. Eu acredito de verdade."',
    '"Eu só não consigo colocar num slide."'
  ],
  ef:{flag:'desarmou_adnan',
      npc:{nome:'Curador Adnan', opiniao:5, memoria:'Você achou em onze minutos a frase que derruba ele.'},
      rep:{eixo:'bom',delta:2,motivo:'Encarou o argumento da Comissão sem se vender'}},
  escolhas:[
    {texto:'"Então me ajuda a derrubar isso por dentro."', vai:'c18_alianca_adnan'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'}
  ]
},

c18_pedido_viveiro:{
  texto:[
    '"Me leva no viveiro."',
    '"Eu não posso." Ele diz isso rápido. "Mas eu também não posso te impedir de andar pela Rota 21, porque é uma rota pública."',
    'Ele deixa o dinheiro do lanche na mesa e se levanta.',
    '"Estação 4. Fica depois da curva grande, do lado do mar. Tem cerca, tem placa e tem câmera, e nada disso é ilegal."',
    '"Uma coisa só." Ele para. "Quando você entrar, não olhe as incubadoras primeiro. Olha o galpão do fundo. As incubadoras são o que eles mostram pra imprensa."'
  ],
  ef:{flag:['sabe_da_rota21','sabe_do_galpao_do_fundo','vai_pro_viveiro'],
      npc:{nome:'Curador Adnan', opiniao:3, memoria:'Te disse onde é a Estação 4 e o que olhar primeiro.'},
      registrar:'Estação 4, Rota 21. Olhar o galpão do fundo, não as incubadoras.'},
  escolhas:[{texto:'Ir para a Rota 21.', vai:'c18_fim'}]
},

c18_fim:{
  texto:[
    d=>{
      if (d.flags.trabalha_para_comissao) return 'Você desce para a Rota 21 com um contrato assinado e um número de matrícula que ainda não decorou.';
      if (d.flags.cracha_adnan) return 'Você desce para a Rota 21 com o crachá de outra pessoa no bolso e quarenta e oito horas de relógio correndo contra ela.';
      if (d.flags.ignorou_a_comissao) return 'Você não desce para a Rota 21. Você pega a estrada pro norte e não olha pra trás, e a Fase II acontece sem nenhuma testemunha.';
      return 'Você desce para a Rota 21 sem crachá, sem convite e sem plano.';
    },
    'A Rota 21 é litorânea, ventosa e quase vazia. Tem uma curva grande e, depois dela, uma cerca nova de três metros com placa de "ÁREA DE PESQUISA — ACESSO RESTRITO".',
    'Do lado de fora da cerca, o mato é normal: Tangela, Pidgey, um Rattata atravessando.',
    'Do lado de dentro, o mato é igual.',
    'Exatamente igual. Todos os arbustos na mesma distância um do outro.'
  ],
  fim:true, resumo:'Capítulo 18 concluído — o que veio depois da Rocket tem estatuto.'
}
}},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 19 — O VIVEIRO
   ══════════════════════════════════════════════════════════ */
{
num:19, titulo:'O Viveiro', local:'Estação 4 — Rota 21', ambiente:'campo', nivelArea:56,
tom:'muito sombrio', inicio:'c19_cerca',
cenas:{

c19_cerca:{
  texto:[
    'A Estação 4 tem oito hectares, cerca nova, e não parece um lugar de crime. Parece um lugar de trabalho.',
    'Tem estacionamento com sete carros. Tem uma placa de "24 DIAS SEM ACIDENTES".',
    'Tem gente de macacão tomando café na porta de um galpão às 9h40 da manhã.',
    d=>{
      if (d.flags.trabalha_para_comissao) return 'Você entra pela portaria, mostra a matrícula e é recebido por alguém do RH que te explica onde fica o banheiro.';
      if (d.flags.cracha_adnan) return 'O crachá do Adnan abre a catraca da portaria no primeiro toque. O sistema registra. O relógio das quarenta e oito horas começa agora.';
      return 'Você vai ter que entrar de outro jeito.';
    }
  ],
  ef:{registrar:'Chegou à Estação 4 na Rota 21.'},
  escolhas:[
    {texto:'Entrar pela portaria.', vai:'c19_dentro',
     cond:d=>!!(d.flags.trabalha_para_comissao||d.flags.cracha_adnan)},
    {texto:'Pular a cerca pelo lado do mar.', vai:'c19_cerca_mar'},
    {texto:'Entrar junto com o caminhão de insumos.', vai:'c19_caminhao'},
    {texto:'Bater na portaria e pedir para ver.', vai:'c19_pedir'}
  ]
},

c19_pedir:{
  texto:[
    'Você bate na portaria e pede pra ver.',
    'O porteiro liga para alguém. Alguém liga para outro alguém. Em onze minutos, uma técnica de jaleco vem até o portão com um sorriso profissional.',
    '"A gente faz visita monitorada às quintas." Ela é gentil de verdade. "Posso agendar?"',
    '"Hoje é quinta."',
    'O sorriso não cai, mas atrasa meio segundo. "Então venha. Sério. A gente tem orgulho do que faz aqui."',
    'E é isso que te desarma: ela tem orgulho mesmo.'
  ],
  ef:{flag:'visita_monitorada'},
  escolhas:[{texto:'Entrar na visita monitorada.', vai:'c19_visita'}]
},

c19_visita:{
  texto:[
    'A visita monitorada mostra as incubadoras.',
    'São bonitas. É a palavra: bonitas. Fileiras de câmaras de vidro com controle de umidade, cada uma com um ovo ou um filhote recém-saído, com temperatura registrada a cada quinze minutos.',
    'A técnica explica o processo com um cuidado que é indistinguível de amor.',
    '"A taxa de sobrevivência aqui é 96%." Ela fala com orgulho legítimo. "Na natureza, no mesmo nicho, é 31%."',
    'Ela não está mentindo. Nada do que ela diz na próxima meia hora é mentira.',
    d=>d.flags.sabe_do_galpao_do_fundo
       ? 'E o tempo todo, no fim do terreno, tem um galpão sem janela para o qual a visita não vai.'
       : 'A visita termina no refeitório, com café e um folheto.'
  ],
  ef:{flag:'viu_as_incubadoras'},
  escolhas:[
    {texto:'Perguntar sobre o galpão do fundo.', vai:'c19_pergunta_galpao'},
    {texto:'Sair da visita e ir ao galpão do fundo sozinho.', vai:'c19_galpao'},
    {texto:'Aceitar o café e ir embora.', vai:'c19_foi_embora'}
  ]
},

c19_pergunta_galpao:{
  texto:[
    '"E aquele galpão?"',
    'A técnica olha para onde você aponta e a resposta dela é boa demais para ser improvisada:',
    '"Processamento de material não viável."',
    'Ela continua sorrindo. É a mesma pessoa que passou meia hora falando de umidade com amor.',
    '"Material não viável."',
    '"Sim." Ela consulta o relógio. "A visita termina no refeitório. Tem café."'
  ],
  ef:{flag:'ouviu_material_nao_viavel'},
  escolhas:[
    {texto:'Ir ao galpão do fundo.', vai:'c19_galpao'},
    {texto:'Tomar o café e ir embora.', vai:'c19_foi_embora'}
  ]
},

c19_cerca_mar:{
  texto:['Pelo lado do mar a cerca chega até a pedra e a pedra é escorregadia.'],
  teste:{status:'forca', dificuldade:7, nomeStatus:'Força',
         critico:'c19_dentro', sucesso:'c19_dentro', parcial:'c19_dentro_visto', falha:'c19_caiu'}
},

c19_caiu:{
  texto:[
    'Você escorrega na pedra molhada e cai três metros dentro do terreno.',
    'O barulho é grande. Duas pessoas de macacão aparecem em quarenta segundos.',
    'Eles não te agridem. Um deles pergunta se você quebrou alguma coisa e o outro já está chamando a enfermaria.',
    'Você é atendido, enfaixado e escoltado até a portaria, e alguém pede desculpa pela cerca ser perigosa.'
  ],
  ef:{hp:-6, causa:'Queda na cerca da Estação 4', flag:'caiu_na_estacao'},
  escolhas:[
    {texto:'Voltar a tentar entrar.', vai:'c19_cerca'},
    {texto:'Pedir a visita monitorada, já que estão sendo tão gentis.', vai:'c19_visita'}
  ]
},

c19_caminhao:{
  texto:[
    'O caminhão de insumos chega às 11h. Ração, meio de cultura, embalagem.',
    'Você entra atrás dele a pé, encostado na lateral, e ninguém olha — porque ninguém aqui está esperando invasão.',
    'É uma estação de pesquisa numa rota litorânea. O sistema de segurança deles foi desenhado contra vandalismo, não contra você.'
  ],
  ef:{flag:'entrou_com_caminhao'},
  escolhas:[{texto:'Seguir para dentro.', vai:'c19_dentro'}]
},

c19_dentro_visto:{
  texto:[
    'Você entra, e um técnico te vê de longe e acena.',
    'Acena. Porque você está dentro de uma área restrita, e portanto você deve ser autorizado, porque pessoas não autorizadas não estão dentro de áreas restritas.',
    'Você acena de volta.',
    'Essa é a falha de segurança mais eficaz que existe e não custou nada.'
  ],
  ef:{flag:'entrou_acenando'},
  escolhas:[{texto:'Ir adiante.', vai:'c19_dentro'}]
},

c19_dentro:{
  texto:[
    'Por dentro, a Estação 4 é um complexo de quatro galpões ligados por corredores cobertos.',
    'Galpão 1: incubadoras. Galpão 2: berçário. Galpão 3: "adaptação" — um viveiro coberto de meio hectare, com mato plantado em grade, onde as unidades aprendem a ser Pokémon selvagens.',
    'Você fica olhando o galpão 3 por muito tempo. Tem trinta e poucos Pokémon lá dentro. Eles se comportam quase certo. Quase.',
    'Um Rattata corre em linha reta até a parede, para, e volta. Depois faz de novo. Depois de novo.',
    'Nenhum deles sabe o que fazer com um espaço que tem borda.',
    d=>d.flags.sabe_do_galpao_do_fundo ? 'E tem o galpão 4, no fundo, sem janela, com uma porta de aço e um sistema de ventilação grande demais para o tamanho do prédio.' : 'E tem um galpão 4, no fundo, sem janela.'
  ],
  ef:{flag:'viu_o_galpao_3', instabilidade:1,
      registrar:'Viu o galpão de adaptação: unidades aprendendo a ser selvagens dentro de uma grade.'},
  escolhas:[
    {texto:'Ir ao galpão 4.', vai:'c19_galpao'},
    {texto:'Abrir o galpão 3 e soltar as trinta e poucas.', vai:'c19_soltar_g3'},
    {texto:'Procurar o arquivo genético.', vai:'c19_arquivo'},
    {texto:'Procurar o Dr. Sena.', vai:'c19_sena'}
  ]
},

c19_soltar_g3:{
  texto:[
    'Você abre o portão do galpão 3.',
    'Nada acontece por quase um minuto.',
    'Depois um Nidoran sai — e para, a dois metros da porta, no meio do corredor coberto, e não anda mais.',
    'Nenhum dos outros sai.',
    'Eles não sabem o que é "fora". Eles nasceram numa bandeja, cresceram numa grade, e a grade é o mundo inteiro que eles conhecem.',
    'Você fica ali segurando um portão aberto por onze minutos e sai um total de três unidades, e as três ficam paradas no corredor esperando alguém dizer o que fazer.'
  ],
  ef:{flag:'tentou_soltar_g3', instabilidade:1,
      rep:{eixo:'bom',delta:1,motivo:'Tentou libertar unidades que não sabem o que é liberdade'},
      registrar:'Abriu o galpão 3. Três saíram e ficaram paradas no corredor.'},
  escolhas:[
    {texto:'Carregar as três para fora da estação.', vai:'c19_carregou_tres'},
    {texto:'Fechar o portão. Isso não é soltar, é abandonar.', vai:'c19_fechou_g3',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Entendeu que abrir a porta não era soltar'}}},
    {texto:'Ir ao galpão 4.', vai:'c19_galpao'}
  ]
},

c19_carregou_tres:{
  texto:[
    'Você carrega as três até a cerca e as coloca do lado de fora, no mato de verdade.',
    'Duas ficam paradas. A terceira anda uns dez metros, encontra um Pidgey silvestre, e é imediatamente atacada — porque território existe, e ela não sabe disso.',
    'Ela não revida. Não sabe revidar.',
    'Você tem que intervir. Você intervém.',
    'E fica ali, na beira da Rota 21, com três coisas que não sabem viver no lugar onde você acabou de colocá-las.'
  ],
  ef:{flag:'levou_tres_unidades',
      executar:d=>{
        const p = unidadeComissao(29, 24, '4-J');
        p.moral = 5;
        Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${nomeExib(p)} ficou com você. As outras duas você levou ao Centro Pokémon de Fuchsia, que não soube o que registrar na ficha.`}];
      },
      rep:{eixo:'bom',delta:2,motivo:'Assumiu a responsabilidade por três unidades que não sabem viver soltas'},
      registrar:'Tirou três unidades da Estação 4 e descobriu que elas não sobrevivem sozinhas.'},
  escolhas:[{texto:'Voltar para dentro.', vai:'c19_galpao'}]
},

c19_fechou_g3:{
  texto:[
    'Você fecha o portão.',
    'É a decisão mais difícil do dia e ela parece covardia e não é.',
    'Soltar uma coisa que não sabe viver solta não é liberdade. É só o mesmo abandono com uma palavra melhor.'
  ],
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_arquivo:{
  texto:[
    'O arquivo genético fica numa sala refrigerada do galpão 2. Não tem guarda — tem controle de temperatura e um alarme de temperatura.',
    'São gavetas. Centenas de gavetas com amostras etiquetadas por espécie, lote e origem.',
    'Muitas dizem "ZS-7". Algumas dizem "SPH-11". Sete dizem "IL-SN" e a etiqueta é mais nova que as outras.',
    d=>d.flags.chegou_na_ilha ? '"IL-SN". Ilha Sem Nome. Eles conseguiram material lá em alguma das expedições anteriores à sua.' : '"IL-SN". Você não sabe o que é e sabe que é ruim.',
    'E, numa gaveta sozinha, refrigerada em separado, com dois cadeados: "MATRIZ 01".'
  ],
  ef:{flag:['achou_o_arquivo','sabe_da_matriz01'], instabilidade:1,
      registrar:'Encontrou o arquivo genético. Uma gaveta com dois cadeados: MATRIZ 01.'},
  escolhas:[
    {texto:'Destruir o arquivo inteiro.', vai:'c19_destruiu_arquivo'},
    {texto:'Levar só a MATRIZ 01.', vai:'c19_levou_matriz'},
    {texto:'Fotografar tudo e deixar como está.', vai:'c19_fotografou_arquivo'},
    {texto:'Ir ao galpão 4.', vai:'c19_galpao'}
  ]
},

c19_destruiu_arquivo:{
  texto:[
    'Você desliga a refrigeração e abre todas as gavetas.',
    'Leva quatro minutos. Depois disso, a temperatura sobe sozinha, e em duas horas não existe mais nada de aproveitável ali.',
    'Você destruiu dezenove anos de coleta do setor 7, sete cargas do depósito de Celadon e o material do andar 11.',
    'Você também destruiu as únicas amostras que existiam de duas linhagens que a Zona Safári perdeu em 2019.',
    'As duas coisas são verdade. Você vai ter que decidir com qual delas dorme.'
  ],
  ef:{flag:['destruiu_o_arquivo','atrasou_a_comissao'], instabilidade:-1,
      rep:{eixo:'bom',delta:2,motivo:'Destruiu o arquivo genético da Comissão'},
      registrar:'Destruiu o arquivo genético inteiro da Estação 4.'},
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_levou_matriz:{
  texto:[
    'Os dois cadeados são bons. A gaveta não é.',
    'Dentro: um tubo de vinte centímetros numa caixa de transporte com bateria própria e visor de temperatura.',
    'A etiqueta diz MATRIZ 01 e embaixo, em letra menor: "origem: CIN-88 / FUJI, K."',
    'Você está segurando a coisa de que Mewtwo foi feito.',
    'E, pelas atas, a coisa de que a Fase III vai ser feita.'
  ],
  ef:{flag:['carrega_a_matriz','atrasou_a_comissao'],
      rep:{eixo:'bom',delta:1,motivo:'Tirou a MATRIZ 01 das mãos da Comissão'},
      registrar:'Está carregando a MATRIZ 01 — o material de origem de Mewtwo.'},
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_fotografou_arquivo:{
  texto:[
    'Você fotografa as etiquetas, as gavetas, a sala, a MATRIZ 01 com os dois cadeados.',
    'Trinta e uma fotos.',
    'É prova de que a origem do material é o setor 7, é Celadon, é a Silph e é uma ilha sem nome. É a cadeia inteira num arquivo só.',
    'E você deixa tudo exatamente onde estava, porque prova mexida é prova contestada.'
  ],
  ef:{flag:['provas_do_viveiro','escolha_fria'],
      rep:{eixo:'bom',delta:2,motivo:'Documentou a cadeia inteira do material genético'},
      registrar:'Fotografou o arquivo genético: 31 fotos ligando ZS-7, Celadon, SPH-11 e a ilha.'},
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_sena:{
  texto:[
    'O Dr. Sena está no galpão 2, de jaleco, anotando numa prancheta, e reconhece você antes de você se apresentar.',
    '"Ah." Ele não corre, não chama segurança, não parece nem um pouco surpreso. "O do andar 11."',
    '"Você estava lá."',
    '"Eu era o terceiro na cadeia. Eu assinava o que o segundo aprovava." Ele continua anotando. "Quando lacraram, eu vim pra cá com o projeto. Como quem muda de sala."',
    'Ele finalmente levanta a cabeça.',
    '"Você quer saber o que eu acho, de verdade? Eu acho que a gente estava errado no andar 11 e certo aqui."',
    '"Lá a gente tentou fazer uma mente. Aqui a gente faz população. Mente pergunta coisa. População não."'
  ],
  ef:{npc:{nome:'Dr. Sena', opiniao:0, memoria:'Migrou do andar 11 para a Estação 4 "como quem muda de sala".'},
      flag:'conheceu_sena'},
  escolhas:[
    {texto:'"E o galpão 4?"', vai:'c19_sena_galpao'},
    {texto:'Atacar.', vai:'c19_luta_sena'},
    {texto:'Ir ao galpão 4 sem ele.', vai:'c19_galpao'}
  ]
},

c19_sena_galpao:{
  texto:[
    '"E o galpão 4?"',
    'Ele para de anotar.',
    '"Art. 19." Ele diz o número do artigo como quem diz o nome de uma doença. "Unidade que não atinge parâmetro de viabilidade é descartada."',
    '"Quantas não atingem?"',
    '"Trinta e um por cento."',
    'Você faz a conta da Fase II na cabeça: quatrocentas unidades liberadas. Trinta e um por cento a mais produzidas e não liberadas.',
    '"Cento e oitenta."',
    '"Cento e oitenta" ele confirma, e volta a anotar, porque a prancheta dele tem uma coluna pra isso.'
  ],
  ef:{flag:['sabe_do_descarte','entendeu_o_galpao4'], instabilidade:1,
      registrar:'31% das unidades não atingem viabilidade. São descartadas no galpão 4.'},
  escolhas:[
    {texto:'Ir ao galpão 4.', vai:'c19_galpao'},
    {texto:'Atacar.', vai:'c19_luta_sena'}
  ]
},

c19_luta_sena:{
  texto:['"Eu esperava isso." Sena põe a prancheta na bancada com cuidado. "Eu sempre espero isso."'],
  batalha:{comissao:'tecnico', nivel:54, tipo:'treinador', treinador:'Dr. Sena', fuga:true,
           vitoria:'c19_venceu_sena', derrota:'c19_perdeu_sena', fuga2:'c19_galpao', gameover:'gameover'}
},

c19_venceu_sena:{
  texto:[
    'As quatro unidades dele caem e ficam onde caíram, esperando.',
    'Sena recolhe uma por uma com o mesmo cuidado com que pousou a prancheta.',
    '"Você sabe o que me incomoda?" Ele não parece abalado. "Que você acha que isso aqui foi uma vitória moral."',
    '"Você derrotou quatro unidades de lote. A gente produz quatro unidades de lote em dezoito dias."',
    'Ele guarda a última bola. "O galpão 4 fica no fim do corredor. A porta não está trancada. Nunca esteve."'
  ],
  ef:{flag:'venceu_sena',
      rep:{eixo:'bom',delta:1,motivo:'Derrotou o técnico-chefe do viveiro'},
      npc:{nome:'Dr. Sena', opiniao:-1, memoria:'Perdeu para você e te disse que o galpão 4 nunca esteve trancado.'}},
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_perdeu_sena:{
  texto:[
    'Você perde, e ele não comemora, e chama a enfermaria pro seu time.',
    'Enquanto os seus Pokémon são atendidos por uma equipe competente e educada, Sena volta a anotar na prancheta.',
    '"A porta do galpão 4 nunca esteve trancada", ele diz, sem levantar a cabeça. "Vai lá. Sério. Eu prefiro que as pessoas vejam."'
  ],
  ef:{hp:-4, causa:'Derrota no viveiro', curaTime:true},
  escolhas:[{texto:'Ir ao galpão 4.', vai:'c19_galpao'}]
},

c19_galpao:{
  texto:[
    'A porta do galpão 4 não está trancada.',
    'Por dentro, não tem incubadora, não tem grade e não tem gaiola.',
    'Tem uma esteira, uma bancada de aço com dreno, um forno industrial e uma prancheta pendurada num prego.',
    'A prancheta tem uma planilha. Data, lote, quantidade, responsável, assinatura.',
    'A última linha é de anteontem. O campo "quantidade" diz 14.',
    'O forno está desligado agora. O galpão inteiro cheira a desinfetante industrial do tipo que se usa depois, não antes.',
    'Não tem nada de ilegal aqui. Está tudo previsto no Art. 19, que foi aprovado por onze votos a um, e a ata é pública, e custa oito reais.'
  ],
  ef:{flag:['viu_o_galpao4','tem_sangue_nas_maos_deles'], instabilidade:2,
      registrar:'Viu o galpão 4: esteira, bancada com dreno, forno e uma planilha de descarte.'},
  escolhas:[
    {texto:'Fotografar tudo.', vai:'c19_fotografou_galpao'},
    {texto:'Destruir o galpão.', vai:'c19_destruiu_galpao'},
    {texto:'Pegar a prancheta.', vai:'c19_pegou_prancheta'},
    {texto:'Sair. Você não aguenta ficar aqui.', vai:'c19_saiu_galpao'}
  ]
},

c19_fotografou_galpao:{
  texto:[
    'Você fotografa a esteira, o dreno, o forno e as trinta e nove páginas da planilha, uma por uma, com a mão tremendo nas primeiras seis.',
    'A planilha tem dois anos. Dá pra somar.',
    'Você soma.',
    'O número é quatro dígitos.'
  ],
  ef:{flag:['provas_do_galpao4','provas_do_viveiro'],
      rep:{eixo:'bom',delta:3,motivo:'Documentou o galpão 4 inteiro'},
      registrar:'Fotografou a planilha de descarte. Dois anos. Quatro dígitos.'},
  escolhas:[{texto:'Sair.', vai:'c19_saida'}]
},

c19_pegou_prancheta:{
  texto:[
    'Você tira a prancheta do prego e leva.',
    'É o objeto mais pesado que você já carregou e ele pesa trezentos gramas.'
  ],
  ef:{flag:['provas_do_galpao4','provas_do_viveiro'],
      rep:{eixo:'bom',delta:2,motivo:'Levou a planilha de descarte do galpão 4'},
      registrar:'Levou a prancheta do galpão 4.'},
  escolhas:[{texto:'Sair.', vai:'c19_saida'}]
},

c19_destruiu_galpao:{
  texto:[
    'Você destrói o galpão 4.',
    'A esteira, a bancada, o forno, o dreno. Leva vinte minutos e faz muito barulho e ninguém vem.',
    'Ninguém vem porque todo mundo aqui sabe o que é esse galpão e ninguém quer estar dentro dele hoje.',
    'Quando acaba, você está de pé no meio de uma sala destruída e o número da planilha continua sendo quatro dígitos, e o forno vai ser substituído em duas semanas pelo seguro.'
  ],
  ef:{flag:['destruiu_o_galpao4'],
      rep:{eixo:'bom',delta:1,motivo:'Destruiu o galpão de descarte'},
      hp:-3, causa:'Vinte minutos destruindo um galpão',
      registrar:'Destruiu o galpão 4. Será substituído em duas semanas.'},
  escolhas:[
    {texto:'Pegar a prancheta antes de sair.', vai:'c19_pegou_prancheta'},
    {texto:'Sair.', vai:'c19_saida'}
  ]
},

c19_saiu_galpao:{
  texto:[
    'Você sai do galpão 4 depois de quarenta segundos lá dentro e senta no chão do corredor coberto.',
    'Passa um técnico. Ele te vê sentado, entende exatamente de onde você saiu, e não diz nada.',
    'Ele te traz um copo de água e continua o turno dele.'
  ],
  ef:{hp:-2, causa:'O galpão 4'},
  escolhas:[{texto:'Levantar.', vai:'c19_saida'}]
},

c19_foi_embora:{
  texto:[
    'Você toma o café, pega o folheto e vai embora pela portaria.',
    'O folheto tem um gráfico de sobrevivência e a frase "conservação de segunda geração".',
    'Você lê esse folheto umas quinze vezes nos dias seguintes.'
  ],
  ef:{flag:'so_a_visita'},
  escolhas:[{texto:'Seguir.', vai:'c19_fim'}]
},

c19_saida:{
  texto:[
    'Na saída da Estação 4 tem alguém encostada num carro no estacionamento.',
    'Auditora Prado. Ela não faz nenhum movimento de te impedir.',
    '"Você viu o galpão."',
    '"Vi."',
    'Ela assente devagar.',
    d=>d.flags.cracha_adnan
      ? '"O crachá que você usou é do Adnan." Ela olha o chão. "O sistema me avisou às 9h41. Eu tinha quarenta e oito horas pra reportar e eu reportei às 9h44, porque se eu não reportasse eles descobririam de qualquer jeito e aí seríamos dois."'
      : '"Eu não vou te deter. Não tem crime. Isso é o mais difícil de explicar pra quem chega até aqui: não tem crime."'
  ],
  ef:{npc:{nome:'Auditora Prado', memoria:'Te esperou no estacionamento depois que você viu o galpão 4.'}},
  escolhas:[
    {texto:'"Como você dorme?"', vai:'c19_pergunta_prado'},
    {texto:'"Me leva até a Presidente."', vai:'c19_leva_presidente'},
    {texto:'Passar por ela sem falar nada.', vai:'c19_fim'}
  ]
},

c19_pergunta_prado:{
  texto:[
    '"Como você dorme?"',
    'Ela demora muito pra responder, e a demora é a resposta.',
    '"Eu tenho uma filha de seis anos." Ela abre a porta do carro. "Em 2019 um Rhyhorn entrou num quintal em Fuchsia e matou um menino de nove."',
    '"Eu fui na ocorrência. Eu era da Liga na época."',
    '"E aí você entrou nisso."',
    '"E aí eu entrei nisso." Ela entra no carro. "Eu não estou te dizendo que estou certa. Eu estou te dizendo por quê, que é diferente, e eu sei a diferença."',
    'É a terceira vez nesta jornada que alguém te diz exatamente essa frase.'
  ],
  ef:{flag:'prado_explicou',
      npc:{nome:'Auditora Prado', opiniao:4, memoria:'Te contou do menino de nove anos em Fuchsia, em 2019.'},
      rep:{eixo:'bom',delta:1,motivo:'Ouviu o motivo de alguém em vez de só o argumento'}},
  escolhas:[
    {texto:'"Me leva até a Presidente."', vai:'c19_leva_presidente'},
    {texto:'Deixar ela ir.', vai:'c19_fim'}
  ]
},

c19_leva_presidente:{
  texto:[
    '"Me leva até a Presidente."',
    'Prado olha o galpão 4 por cima do seu ombro.',
    '"Segunda-feira, 10h, sala 704." Ela liga o carro. "Reunião ordinária do conselho. É aberta. Consta no estatuto."',
    '"Aberta?"',
    '"Art. 27. Qualquer interessado pode assistir e pedir a palavra." Ela fecha a porta. "Em um ano e oito meses, nenhum interessado apareceu."'
  ],
  ef:{flag:['convite_conselho','endereco_presidente'],
      npc:{nome:'Auditora Prado', opiniao:5, memoria:'Te disse a data, a hora e o número da sala da reunião do conselho.'},
      registrar:'Reunião ordinária do conselho: segunda, 10h, sala 704. É aberta ao público.'},
  escolhas:[{texto:'Ir para Saffron.', vai:'c19_fim'}]
},

c19_fim:{
  texto:[
    'Você sai da Rota 21 e o mato do lado de fora da cerca continua desorganizado, cheio de buraco, com Pokémon brigando por território e morrendo de doença e vivendo trinta e um por cento.',
    'É feio. É muito mais feio que os oito hectares que você acabou de deixar.',
    'E ainda assim, quando você olha pra trás pela última vez, você sabe qual dos dois lados da cerca você escolheria pra nascer.',
    d=>d.flags.convite_conselho
       ? 'Segunda-feira, 10h, sala 704, Saffron. Aberta a qualquer interessado. Em um ano e oito meses, nenhum apareceu.'
       : 'Em algum lugar de Saffron tem uma sala onde onze pessoas votaram e uma perdeu.'
  ],
  fim:true, resumo:'Capítulo 19 concluído — o número da planilha tem quatro dígitos.'
}
}},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 20 — A PRESIDENTE
   ══════════════════════════════════════════════════════════ */
{
num:20, titulo:'A Presidente', local:'Saffron — sala 704', ambiente:'cidade', nivelArea:60,
tom:'muito sombrio', inicio:'c20_predio',
cenas:{

c20_predio:{
  texto:[
    'O prédio é comercial, de dezesseis andares, com uma farmácia no térreo.',
    'No sétimo andar, a sala 704 tem uma placa de acrílico com a sigla CGRB em Arial.',
    'A porta está aberta. Tem café numa garrafa térmica numa mesinha do lado de fora, com copos descartáveis e um saquinho de açúcar.',
    'Lá dentro, doze pessoas sentadas em volta de uma mesa oval, com pasta e caneta.',
    'Uma delas está falando sobre o cronograma de liberação. A pauta está escrita num flip chart.',
    'Eles param quando você entra. Não com susto. Com a pausa educada de quem foi interrompido numa reunião.',
    '"Boa manhã." A mulher na cabeceira tem cinquenta e poucos anos e tailleur cinza. "O senhor é...?"'
  ],
  ef:{registrar:'Entrou na reunião ordinária do conselho da CGRB.'},
  escolhas:[
    {texto:'Dizer seu nome.', vai:'c20_nome'},
    {texto:'Pedir a palavra, pelo Art. 27.', vai:'c20_palavra'},
    {texto:'Não dizer nada e olhar quem está na mesa.', vai:'c20_mesa'}
  ]
},

c20_mesa:{
  texto:[
    'Você olha a mesa antes de falar.',
    'Doze pessoas. Nenhuma de uniforme. Uma de jaleco — Dr. Sena. Um de terno com um crachá nível 2 no bolso — Adnan, que não levanta os olhos da pasta.',
    d=>{
      const L = [];
      if (d.flags.liga_infiltrada || d.flags.liga_aliada) L.push('E, na terceira cadeira da direita, uma mulher que você conhece: a conselheira da Liga Pokémon que te mandou ao norte.');
      if (d.flags.sabe_da_terceira) L.push('Não tem ninguém de Celadon aqui. A Terceira vende pra eles e não senta com eles. Isso, agora, faz muito sentido.');
      return L.join(' ');
    },
    'A mulher da cabeceira espera você terminar de olhar. Ela deixa você olhar. Isso é escolha dela.'
  ],
  ef:{executar:d=>{
        if (d.flags.liga_infiltrada || d.flags.liga_aliada){
          Estado.marcar('viu_a_liga_na_mesa');
          return [{tipo:'liga', texto:'A conselheira da Liga que te equipou para o norte tem assento no conselho da Comissão.'}];
        }
        return [];
      }},
  escolhas:[
    {texto:'Pedir a palavra, pelo Art. 27.', vai:'c20_palavra'},
    {texto:'"Você." — apontando para a conselheira da Liga.', vai:'c20_conselheira', cond:d=>!!d.flags.viu_a_liga_na_mesa},
    {texto:'Dizer seu nome.', vai:'c20_nome'}
  ]
},

c20_conselheira:{
  texto:[
    '"Você."',
    'A conselheira da Liga não desvia o olhar e não parece constrangida.',
    '"Eu tenho assento de observadora." Ela fala com a mesma calma da sala do Planalto. "Sem direito a voto. Consta na ata, e a ata é pública, e você leu."',
    '"Você me mandou pro norte."',
    '"Mandei."',
    '"Pra quê?"',
    'Pela primeira vez em duas conversas, ela hesita.',
    '"Porque eu queria que alguém de fora chegasse lá antes de nós." Ela olha a Presidente do outro lado da mesa. "E porque eu não podia ser eu."'
  ],
  ef:{flag:'conselheira_confrontada', instabilidade:1,
      npc:{nome:'Conselheira da Liga', opiniao:1, memoria:'Admitiu, na frente do conselho da Comissão, que te mandou ao norte para chegar antes deles.'},
      registrar:'A conselheira da Liga te mandou ao norte para chegar antes da Comissão.'},
  escolhas:[{texto:'Pedir a palavra.', vai:'c20_palavra'}]
},

c20_nome:{
  texto:[
    'Você diz seu nome.',
    'Metade da mesa reage. A Presidente, não.',
    d=>{
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=6) return '"Ah." Ela fecha a pasta. "Você é bem mais novo do que o relatório sugere."';
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) return '"Ah." Ela fecha a pasta. "Nós temos uma pasta sua. É mais grossa que a de qualquer conselheiro aqui."';
      return '"Ah." Ela fecha a pasta. "Nós esperávamos você em algum momento. Não hoje, mas em algum momento."';
    },
    '"Senta, por favor. Tem café lá fora."'
  ],
  escolhas:[{texto:'Sentar e pedir a palavra.', vai:'c20_palavra'}]
},

c20_palavra:{
  texto:[
    '"Art. 27. Eu quero a palavra."',
    'A Presidente olha para a secretária da mesa, que confere o estatuto, assente, e anota na ata.',
    '"Concedida. Cinco minutos, prorrogáveis."',
    'E é isso que quebra você: eles te dão a palavra. Formalmente. Em ata.',
    'Você fala. Fala do galpão 4, da planilha de quatro dígitos, das trinta e poucas unidades que não sabem o que é uma borda, do Rattata que corre até a parede e volta.',
    'Ninguém interrompe. Uma conselheira anota. Adnan não levanta a cabeça uma vez.',
    'Quando você termina, a Presidente espera cinco segundos inteiros antes de responder.'
  ],
  ef:{flag:'falou_no_conselho',
      rep:{eixo:'bom',delta:2,motivo:'Falou no conselho da Comissão e foi ouvido em ata'}},
  escolhas:[{texto:'Ouvir a resposta.', vai:'c20_resposta'}]
},

c20_resposta:{
  texto:[
    '"Obrigada." Ela diz isso sem ironia nenhuma. "É a primeira manifestação de interessado em um ano e oito meses. Vai constar na ata com o seu nome."',
    '"Agora eu vou te responder, e eu peço que você me ouça com a mesma atenção, porque eu ouvi."',
    COMISSAO.doutrina[0],
    COMISSAO.doutrina[1],
    COMISSAO.doutrina[2],
    '"Eu fui diretora de fiscalização da Liga por nove anos. Eu assinei setenta e um relatórios sobre risco populacional. Nenhum virou política pública."',
    '"No septuagésimo segundo, eu pedi demissão e fundei isto aqui."',
    'Ela junta as mãos.',
    '"O galpão 4 é indefensável. Eu sei. Eu votei a favor do Art. 19 e eu durmo mal por causa dele, e eu votaria de novo, porque a alternativa era não produzir, e não produzir é aceitar o número que a gente tinha antes."',
    '"Eu não vou te pedir que concorde. Eu vou te fazer uma pergunta, e ela é honesta:"',
    d=>`"${d.jogador.nome}, o que você faria no meu lugar?"`
  ],
  ef:{flag:'presidente_perguntou'},
  escolhas:[
    {texto:'"Eu fecharia. Hoje. E aceitaria o número."', vai:'c20_fechar'},
    {texto:'"Eu manteria os viveiros e acabaria com o Art. 19."', vai:'c20_reforma'},
    {texto:'"Eu não sei. Mas isso não te autoriza."', vai:'c20_nao_autoriza'},
    {texto:'"Eu faria exatamente o que você faz."', vai:'c20_concordar'},
    {texto:'Não responder. Derrubar tudo agora.', vai:'c20_luta_presidente'}
  ]
},

c20_fechar:{
  texto:[
    '"Eu fecharia. Hoje. E aceitaria o número."',
    '"O número são pessoas." A voz dela não muda. "Trinta e uma ocorrências graves por ano. Onze crianças em 2019."',
    '"Eu sei."',
    '"Você aceitaria isso."',
    '"Eu aceitaria isso, porque o outro lado do número está numa planilha pendurada num prego, e ele tem quatro dígitos, e ninguém nunca votou nele."',
    'Silêncio na sala oval.',
    'Uma conselheira anota. Outra olha para a Presidente. Adnan, pela primeira vez, levanta a cabeça.'
  ],
  ef:{flag:'defendeu_fechar', rep:{eixo:'bom',delta:2,motivo:'Defendeu o fim do programa diante do conselho inteiro'}},
  escolhas:[
    {texto:'Pedir votação. Pelo estatuto.', vai:'c20_votacao'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'}
  ]
},

c20_reforma:{
  texto:[
    '"Eu manteria os viveiros e acabaria com o Art. 19."',
    'A Presidente inclina a cabeça um grau.',
    '"Trinta e um por cento das unidades não atingem viabilidade. Sem descarte, elas vivem — com dor, sem autonomia, consumindo recurso de viveiro."',
    '"Então vocês param de produzir trinta e um por cento a mais."',
    '"Isso reduz a liberação em um terço e aumenta o custo por unidade em 44%."',
    '"Eu sei. Eu li a ata."',
    'Pela primeira vez, alguém na mesa fala além da Presidente. É Adnan.',
    '"O custo por unidade não é argumento moral", ele diz, olhando a mesa, não ela. "Isso está na minha declaração de voto de onze meses atrás. Página quatro."'
  ],
  ef:{flag:'defendeu_reforma',
      rep:{eixo:'bom',delta:2,motivo:'Propôs uma reforma viável no conselho, em vez de um discurso'},
      npc:{nome:'Curador Adnan', opiniao:3, memoria:'Falou na mesa pela primeira vez depois da sua proposta.'}},
  escolhas:[
    {texto:'Pedir votação. Pelo estatuto.', vai:'c20_votacao'},
    {texto:'Sair. Você plantou o que dava.', vai:'c20_saiu_sala'}
  ]
},

c20_nao_autoriza:{
  texto:[
    '"Eu não sei. Mas isso não te autoriza."',
    'A Presidente fica em silêncio por muito tempo.',
    '"Não", ela concorda. "Não autoriza."',
    '"Eu não tenho autorização de ninguém. Eu tenho um estatuto que eu mesma escrevi e doze pessoas que concordaram comigo."',
    '"Isso não é legitimidade. Isso é organização."',
    'Ela olha para a janela.',
    '"Eu penso nisso todo domingo à noite, e toda segunda às dez da manhã eu abro esta reunião assim mesmo, porque a alternativa é ninguém fazer nada, e eu já vi como é ninguém fazer nada por nove anos."'
  ],
  ef:{flag:'desarmou_presidente',
      rep:{eixo:'bom',delta:2,motivo:'Encontrou a frase que a Presidente não tem resposta'}},
  escolhas:[
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar.', vai:'c20_publicar_tudo'},
    {texto:'"Então eu te paro."', vai:'c20_luta_presidente'}
  ]
},

c20_concordar:{
  texto:[
    '"Eu faria exatamente o que você faz."',
    'A sala fica quieta.',
    '"Isso é uma coisa muito séria de se dizer numa reunião que está sendo gravada em ata", diz a Presidente.',
    '"Eu sei."',
    'Ela olha para a secretária. "Registra."',
    'Depois para você. "Tem uma cadeira vaga nesta mesa desde março. Ela é de conselheiro titular, com direito a voto."',
    '"Você tem quinze anos, o que é um problema jurídico que eu consigo resolver em três semanas."'
  ],
  ef:{flag:'aceitou_cadeira_conselho',
      rep:{eixo:'ruim',delta:3,motivo:'Aceitou uma cadeira no conselho da Comissão'},
      executar:d=>{ Historia.definirVia('foragido','assumiu uma cadeira no conselho da Comissão'); return []; },
      registrar:'Aceitou a cadeira de conselheiro titular da CGRB.'},
  escolhas:[
    {texto:'Aceitar a cadeira.', vai:'c20_virou_conselheiro'},
    {texto:'"Não. Eu menti pra ver o que você ia oferecer."', vai:'c20_mentiu_conselho'}
  ]
},

c20_mentiu_conselho:{
  texto:[
    '"Não. Eu menti pra ver o que você ia oferecer."',
    'A Presidente não se irrita. Ela parece, de todas as coisas possíveis, aliviada.',
    '"Bom." Ela anota alguma coisa na pasta. "Eu ia ter que conviver com isso."',
    '"Com o quê?"',
    '"Com ter recrutado a única pessoa em um ano e oito meses que apareceu por conta própria." Ela fecha a caneta. "Isso teria sido a coisa mais feia que eu já fiz, e eu aprovei o Art. 19."'
  ],
  ef:{limpaFlag:'aceitou_cadeira_conselho',
      rep:{eixo:'bom',delta:3,motivo:'Recusou uma cadeira no conselho depois de arrancar a oferta'},
      flag:'recusou_a_cadeira',
      executar:d=>{ Historia.definirVia(d.viaAnterior || 'heroi', 'recusou a cadeira do conselho'); return []; }},
  escolhas:[{texto:'Pedir votação.', vai:'c20_votacao'}]
},

c20_virou_conselheiro:{
  texto:[
    'Você assina a ata como interessado e, três semanas depois, como conselheiro titular com direito a voto.',
    'A primeira reunião de que você participa vota a Fase II-B: ampliação para a Rota 14.',
    'Você levanta a mão junto com os outros onze.',
    'Adnan vota contra. Sozinho. Como sempre.',
    'Na saída, ele te espera no corredor e não diz nada. Só olha.',
    'Você vai lembrar desse olhar por muito tempo, e vai continuar votando.'
  ],
  ef:{flag:['conselheiro_da_comissao','tem_sangue_nas_maos'],
      dinheiro:60000, moral:-25, instabilidade:2,
      rep:{eixo:'ruim',delta:3,motivo:'Passou a votar a expansão dos viveiros'},
      npc:{nome:'Curador Adnan', opiniao:-6, memoria:'Te viu levantar a mão a favor da Fase II-B.'},
      registrar:'Tornou-se conselheiro titular da CGRB e votou a favor da expansão.'},
  escolhas:[{texto:'Seguir.', vai:'c20_fim'}]
},

c20_votacao:{
  texto:[
    '"Eu quero votação."',
    'A Presidente olha a secretária, que confere o estatuto.',
    '"Art. 27, §3º: interessado pode propor matéria, que será submetida a voto na mesma sessão, a critério da mesa."',
    '"A critério da mesa", repete a Presidente.',
    'Ela olha a sala inteira, uma pessoa por vez, e leva quase meio minuto pra fazer isso.',
    '"Submeto." Ela assente para a secretária. "Matéria: revogação do Art. 19 e suspensão da Fase II até revisão do protocolo de descarte."',
    'Doze cadeiras. Onze votos, mais o dela em caso de empate.'
  ],
  ef:{flag:'votacao_aberta'},
  escolhas:[{texto:'Ouvir a votação.', vai:'c20_contagem'}]
},

c20_contagem:{
  texto:[
    'A votação leva quatro minutos e é a coisa mais tensa que já te aconteceu sem nenhuma bola envolvida.',
    'Adnan vota a favor da revogação. Primeiro, alto, sem esperar.',
    d=>{
      let votos = 1; // Adnan
      const razoes = [];
      if (d.flags.provas_do_galpao4){ votos += 2; razoes.push('Duas conselheiras que viram as fotos do galpão 4 votam a favor, e uma delas não consegue terminar a frase.'); }
      if (d.flags.provas_do_viveiro || d.flags.provas_do_11){ votos += 1; razoes.push('Uma conselheira que passou a sessão inteira olhando o material que você trouxe vota a favor.'); }
      if (d.flags.desarmou_presidente || d.flags.defendeu_reforma){ votos += 1; razoes.push('Uma conselheira diz, antes de votar, que a sua proposta é a primeira que não é um discurso.'); }
      if (d.flags.publicou_as_atas){ votos += 1; razoes.push('Um conselheiro que passou dezenove dias sendo perguntado sobre isso em jantares de família vota a favor.'); }
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=6){ votos += 1; razoes.push('Um conselheiro vota a favor e diz o seu nome como justificativa, o que é constrangedor para todo mundo na sala, inclusive para você.'); }
      if (d.flags.conselheira_confrontada){ razoes.push('A conselheira da Liga não vota: assento de observadora, sem direito a voto. Ela fecha os olhos quando a contagem chega.'); }
      if (Historia.via()==='mercenario' || Historia.via()==='foragido'){ votos -= 1; razoes.push('Um conselheiro lembra, em voz alta e com documentos, de onde vem o seu dinheiro. Dois votos mudam de lado.'); }
      Estado.dados.votosComissao = Math.max(0, votos);
      return razoes.join(' ');
    },
    d=>`Contagem final: ${Estado.dados.votosComissao} votos pela revogação, ${Math.max(0, 11 - Estado.dados.votosComissao)} contra.`
  ],
  escolhas:[
    {texto:'Ver o resultado.', vai:'c20_resultado_votacao'}
  ]
},

c20_resultado_votacao:{
  texto:[
    d=>{
      const v = Estado.dados.votosComissao || 0;
      if (v >= 6) return 'Aprovada.';
      if (v === 5) return 'Empate em cinco a cinco, com uma abstenção. O desempate é da Presidente.';
      return 'Rejeitada.';
    },
    d=>{
      const v = Estado.dados.votosComissao || 0;
      if (v >= 6) return 'A Presidente ouve a contagem, assente uma vez, e diz "revogado" com a mesma voz com que abriu a reunião. A secretária anota. Acabou assim, numa sala comercial, num prédio com farmácia no térreo.';
      if (v === 5) return 'A sala inteira olha para ela. Ela fica quieta por onze segundos.\n\n"Eu voto pela revogação do Art. 19 e contra a suspensão da Fase II."\n\nMeia vitória. A pior de todas, porque agora ninguém pode dizer que não foi ouvido.';
      return 'A Presidente ouve a contagem e não comemora. Ela agradece a sua manifestação, registra em ata, e retoma a pauta de onde parou — item 4, cronograma de liberação.';
    }
  ],
  ef:{executar:d=>{
        const v = d.votosComissao || 0;
        const avisos = [];
        if (v >= 6){
          Estado.marcar('art19_revogado'); Estado.marcar('fase2_suspensa');
          Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade - 2);
          Estado.mudarRep('bom', 4, 'Revogou o Art. 19 pelo voto, dentro da sala');
          avisos.push({tipo:'rep', texto:'O Art. 19 foi revogado e a Fase II, suspensa. Você fez isso com uma votação.'});
        } else if (v === 5){
          Estado.marcar('art19_revogado');
          Estado.mudarRep('bom', 2, 'Revogou o Art. 19, mas não parou a Fase II');
          avisos.push({tipo:'rep', texto:'O Art. 19 caiu. A Fase II continua no cronograma.'});
        } else {
          Estado.marcar('votacao_perdida');
          Estado.mudarRep('bom', 1, 'Perdeu a votação e ficou até o fim da sessão');
          avisos.push({tipo:'info', texto:'Você perdeu. E ficou sentado até o fim da sessão, que durou mais uma hora e quarenta.'});
        }
        return avisos;
      }},
  escolhas:[
    {texto:'Sair da sala.', vai:'c20_saiu_sala'},
    {texto:'"Então eu resolvo do meu jeito."', vai:'c20_luta_presidente',
     cond:d=>!d.flags.art19_revogado}
  ]
},

c20_publicar_tudo:{
  texto:[
    'Você sai da sala 704 no meio da reunião e publica tudo o que tem.',
    d=>d.flags.provas_do_galpao4
       ? 'Dessa vez é diferente, porque dessa vez você tem a planilha. Trinta e nove páginas, dois anos, quatro dígitos, com assinatura de responsável em cada linha.'
       : 'Você tem as atas, que são públicas, e a sua palavra, que não é prova.',
    d=>{
      if (d.flags.provas_do_galpao4 && d.flags.provas_do_viveiro)
        return 'A Comissão emite uma nota. A nota não funciona dessa vez. Em nove dias, o Ministério Público abre inquérito. Em quarenta, a Estação 4 é interditada. Em quatro meses, três conselheiros são indiciados.';
      if (d.flags.provas_do_galpao4)
        return 'A planilha sozinha sustenta a manchete por dois meses. A Estação 4 suspende o descarte "para revisão de protocolo" e nunca retoma oficialmente.';
      return 'Sem a planilha, a Comissão responde citando o próprio estatuto e o endereço do cartório. Em três semanas o assunto morre outra vez.';
    }
  ],
  ef:{executar:d=>{
        const avisos=[];
        if (d.flags.provas_do_galpao4 && d.flags.provas_do_viveiro){
          Estado.marcar('comissao_derrubada'); Estado.marcar('fase2_suspensa');
          Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade-3);
          const r = Estado.mudarRep('bom', 4, 'Derrubou a Comissão com a planilha do galpão 4');
          avisos.push({tipo:'rep', texto:'A Estação 4 foi interditada. Três conselheiros indiciados.'});
        } else if (d.flags.provas_do_galpao4){
          Estado.marcar('descarte_suspenso');
          Estado.mudarRep('bom', 3, 'Suspendeu o descarte com a planilha');
          avisos.push({tipo:'rep', texto:'O descarte foi suspenso "para revisão de protocolo".'});
        } else {
          Estado.mudarRep('bom', 1, 'Publicou o que tinha, que não era o bastante');
          avisos.push({tipo:'info', texto:'Sem prova material, durou três semanas.'});
        }
        return avisos;
      },
      flag:'publicou_o_viveiro',
      registrar:'Publicou o material sobre a Estação 4.'},
  escolhas:[{texto:'Seguir.', vai:'c20_fim'}]
},

c20_luta_presidente:{
  texto:[
    'Você saca uma bola dentro de uma reunião de conselho.',
    'Onze pessoas saem da sala em ordem, sem correr, porque existe um procedimento para isso e eles treinaram.',
    'A Presidente não sai. Ela tira o paletó e o dobra sobre o encosto da cadeira.',
    '"Eu fui treinadora antes de ser diretora." Ela solta a primeira bola. "Todo mundo foi. É esse o problema deste país."',
    'As unidades dela não têm nome. Têm código de lote: 1-A, 1-B, 1-C, 1-D.',
    'E a última tem só dois dígitos.'
  ],
  ef:{flag:'atacou_o_conselho',
      rep:{eixo:'ruim',delta:2,motivo:'Atacou uma reunião de conselho'}},
  batalha:{comissao:'presidente', nivel:58, tipo:'treinador', treinador:'a Presidente', fuga:false,
           vitoria:'c20_venceu_presidente', derrota:'c20_perdeu_presidente', gameover:'gameover'}
},

c20_venceu_presidente:{
  texto:[
    'A Unidade 01 cai por último.',
    'Você olha ela caída no carpete de uma sala comercial e entende, com um atraso de quatro segundos, o que ela é.',
    'É o décimo segundo tanque. Eles conseguiram.',
    'Não é Mewtwo. É uma coisa com o rosto dele, nível 63, código de lote e nenhuma pergunta na cabeça.',
    'A Presidente recolhe a bola com cuidado profissional.',
    '"Ela não fala", diz a Presidente, respondendo à pergunta que você não fez. "Nenhuma das quatro tentativas falou. Nós acertamos o corpo e nunca acertamos a outra parte."',
    '"E vocês continuam."',
    '"E nós continuamos." Ela dobra o paletó de novo. "Porque a Fase III não precisa que ela fale. Precisa que ela obedeça."'
  ],
  ef:{flag:['viu_a_unidade01','sabe_da_fase3'], instabilidade:2,
      rep:{eixo:'bom',delta:1,motivo:'Derrotou a Presidente da Comissão na sala dela'},
      registrar:'A Unidade 01 existe: uma cópia de Mewtwo que não fala. A Fase III só precisa que ela obedeça.'},
  escolhas:[
    {texto:'Levar a Unidade 01 embora.', vai:'c20_levou_unidade01'},
    {texto:'Destruir a Unidade 01.', vai:'c20_destruiu_unidade01'},
    {texto:'Sair. Você já sabe o que precisava.', vai:'c20_saiu_sala'}
  ]
},

c20_levou_unidade01:{
  texto:[
    'Você tira a bola da mão dela. Ela não impede — e não impedir, aqui, é uma decisão dela.',
    '"Ela vai te obedecer", diz a Presidente. "É pra isso que ela existe. Você vai descobrir que isso é a pior parte."'
  ],
  ef:{flag:'tem_a_unidade01',
      executar:d=>{
        const p = unidadeComissao(150, 63, '01');
        p.moral = 0;
        p.historia = 'Décima segunda tentativa. A primeira que vingou. Não fala, não pergunta, obedece.';
        Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv 63) entrou no seu time. Moral 0. Ela vai obedecer a tudo.`}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Saiu com uma cópia de Mewtwo na mão'},
      registrar:'Levou a Unidade 01.'},
  escolhas:[{texto:'Sair.', vai:'c20_fim'}]
},

c20_destruiu_unidade01:{
  texto:[
    'Você destrói a Unidade 01 na sala 704, no carpete, com a Presidente olhando.',
    'Ela não tenta impedir. Anota alguma coisa na pasta quando acaba.',
    '"Quarta tentativa perdida", ela diz. "Dezoito meses de trabalho."',
    'E aí, pela única vez na manhã inteira, a voz dela falha:',
    '"Eu vou ter que aprovar a quinta. Você entende isso? Você acabou de me obrigar a aprovar a quinta."'
  ],
  ef:{flag:['destruiu_a_unidade01','tem_sangue_nas_maos'], instabilidade:1,
      rep:{eixo:'ruim',delta:2,motivo:'Destruiu uma criatura que não escolheu existir'},
      registrar:'Destruiu a Unidade 01. A quinta tentativa foi aprovada por causa disso.'},
  escolhas:[{texto:'Sair.', vai:'c20_fim'}]
},

c20_perdeu_presidente:{
  texto:[
    'Você perde numa sala comercial para uma mulher de tailleur cinza.',
    'Ela chama a enfermaria do prédio — o prédio tem enfermaria — e espera com você até chegarem.',
    '"Isso vai constar na ata como incidente", ela diz, vestindo o paletó de novo. "Com o seu nome. Eu sinto muito, mas ata é ata."',
    'Ela retoma a reunião no item 4 assim que te levam.'
  ],
  ef:{hp:-8, causa:'Derrota na sala 704',
      executar:d=>{ d.liga.avisos++; return [{tipo:'liga', texto:'O incidente foi registrado em ata, com o seu nome.'}]; },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou um conselho e perdeu'}},
  escolhas:[{texto:'Sair do prédio.', vai:'c20_fim'}]
},

c20_saiu_sala:{
  texto:[
    'Você sai da sala 704 e a reunião continua atrás de você.',
    'Dá pra ouvir, do corredor, a secretária lendo o item 4 da pauta em voz normal.',
    'No elevador, você divide o espaço com um conselheiro que desceu pra fumar. Ele te cumprimenta com a cabeça.',
    'No térreo tem uma farmácia e uma banca de jornal, e gente comprando coisa, e trânsito.'
  ],
  escolhas:[{texto:'Sair do prédio.', vai:'c20_fim'}]
},

c20_fim:{
  texto:[
    d=>{
      if (d.flags.comissao_derrubada) return 'A Comissão de Gestão de Risco Biológico de Kanto é dissolvida por decisão judicial sete meses depois. Três conselheiros respondem processo. A Presidente não foge, não se esconde e comparece a todas as audiências.';
      if (d.flags.art19_revogado && d.flags.fase2_suspensa) return 'O Art. 19 foi revogado numa segunda-feira de manhã, por votação, numa sala comercial. Nenhum jornal noticiou. É assim que as coisas mudam de verdade e é por isso que ninguém acredita.';
      if (d.flags.art19_revogado) return 'O Art. 19 caiu. A Fase II continua. Você conseguiu metade e vai passar anos decidindo se metade conta.';
      if (d.flags.conselheiro_da_comissao) return 'Você agora tem cadeira, voto e uma pasta com o seu nome numa mesa oval em Saffron. A reunião é toda segunda, às dez.';
      if (d.flags.ignorou_a_comissao) return 'A Fase II sai do papel no primeiro semestre, como previsto na ata, e ninguém nunca soube que você leu aquilo.';
      return 'A reunião terminou às 11h40, como todas as reuniões. O item 4 foi aprovado.';
    },
    d=>d.flags.sabe_do_risco01 || d.flags.sabe_da_fase3
       ? 'E em algum lugar de uma ata, numa linha só, existe um item que não foi resolvido hoje: "Risco 01 — não localizado."'
       : 'E em algum lugar existe uma coisa que eles numeraram e não acharam.',
    'A Liga te mandou uma carta enquanto você estava em Saffron. Papel bom, timbre em relevo.'
  ],
  fim:true, resumo:'Capítulo 20 concluído — o mal agora tem ata, pauta e café na entrada.'
}
}}

);
