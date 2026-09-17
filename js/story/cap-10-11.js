/* ============================================================
   CAPÍTULOS 10–11 — A usina e a torre de vidro
   ============================================================ */
CAPITULOS.push(

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 10 — O ZUMBIDO
   ══════════════════════════════════════════════════════════ */
{
num:10, titulo:'O Zumbido', local:'Usina Abandonada — Rota 10', ambiente:'ruina', nivelArea:34,
tom:'sombrio', inicio:'c10_rota',
cenas:{

c10_rota:{
  texto:[
    'A Rota 10 desce para o leste e o ar fica diferente antes de você ver qualquer coisa: seco, com aquele cheiro de tomada queimada.',
    'A usina foi desativada há onze anos. A companhia nunca desmontou — só trancou o portão e foi embora.',
    'E ela está zumbindo.',
    d=>{
      const via = Historia.via();
      if (via==='mercenario') return 'Você está aqui porque a Terceira mandou: "tem material na usina, ninguém entra há anos, traz o que der". A caixa vazia na sua mochila pesa mais que caixa cheia.';
      if (via==='foragido') return 'Você está aqui porque agora é você que precisa de material, e a usina é uma fonte que ninguém explorou.';
      if (via==='pesquisador') return 'Você está aqui porque o livro de destinos tinha uma entrada esquisita: "R10 — coleta local — sem custo". Coleta de quê, numa usina desativada?';
      if (via==='heroi') return 'Você está aqui porque três pessoas em Cerulean te falaram da mesma coisa: relâmpago em céu limpo, toda semana, no mesmo lugar.';
      return 'Você está aqui porque estava passando e porque o zumbido é impossível de ignorar.';
    }
  ],
  ef:{registrar:'Chegou à usina abandonada da Rota 10.'},
  escolhas:[
    {texto:'Entrar pelo portão principal.', vai:'c10_dentro'},
    {texto:'Contornar e procurar a subestação — a fonte do zumbido.', vai:'c10_subestacao'},
    {texto:'Observar de longe até escurecer.', vai:'c10_observar'}
  ]
},

c10_observar:{
  texto:[
    'Você espera quatro horas na encosta, deitado no mato seco.',
    'Às 18h40, com o céu ainda claro, um raio cai dentro do pátio da usina. Céu limpo. Sem nuvem em nenhuma direção.',
    'Às 18h52, outro.',
    'Não é tempestade. É alguma coisa recarregando.'
  ],
  ef:{flag:'viu_os_raios', rep:{eixo:'bom',delta:0,motivo:''},
      registrar:'Observou raios caindo em céu limpo dentro da usina.'},
  escolhas:[
    {texto:'Entrar agora, no escuro.', vai:'c10_dentro'},
    {texto:'Ir embora. Isso não é assunto seu.', vai:'c10_foi_embora'}
  ]
},

c10_foi_embora:{
  texto:[
    'Você desce a encosta no sentido contrário.',
    'Três dias depois, a Rota 10 é interditada por "instabilidade elétrica". Duas pessoas ficaram feridas.',
    'Você não tinha obrigação nenhuma. Você também sabia antes deles.'
  ],
  ef:{flag:'ignorou_usina', instabilidade:1,
      rep:{eixo:'ruim',delta:1,motivo:'Sabia do perigo na Rota 10 e não avisou ninguém'}},
  escolhas:[{texto:'Seguir para Saffron.', vai:'c10_fim'}]
},

c10_subestacao:{
  texto:[
    'A subestação fica nos fundos, e é onde o zumbido vira som físico — dá pra sentir no maxilar.',
    'Os transformadores estão energizados. Numa usina desligada há onze anos, com a linha de transmissão cortada, os transformadores estão energizados.',
    'E tem marca no chão de concreto: queimaduras em formato de pé. Grandes. De três dedos.'
  ],
  ef:{flag:'achou_marcas'},
  escolhas:[
    {texto:'Seguir as marcas.', vai:'c10_dentro'},
    {texto:'Desligar os transformadores.', vai:'c10_desligou'}
  ]
},

c10_desligou:{
  texto:[
    'Você acha a chave seccionadora e puxa com as duas mãos.',
    'O zumbido para. O silêncio depois dele é a coisa mais alta que você já ouviu.',
    'E então, do outro lado do pátio, alguma coisa grita — e o grito é elétrico, literalmente: você sente nos dentes antes de ouvir.',
    'Você acabou de tirar a comida de alguma coisa.'
  ],
  ef:{flag:'desligou_a_usina',
      executar:d=>{ const L=Estado.lend(145); L.encontros++; L.disposicao = 'hostil';
        return [{tipo:'perigo', texto:'Zapdos perdeu a fonte de energia. E sabe que foi você.'}]; },
      registrar:'Desligou os transformadores da usina. Zapdos ficou hostil.'},
  escolhas:[{texto:'Se virar.', vai:'c10_zapdos'}]
},

c10_dentro:{
  texto:[
    'O galpão principal tem cinquenta metros de pé-direito e um buraco no teto que não foi feito por chuva.',
    'O chão está coberto de Voltorb e Magnemite — dezenas, parados, alinhados, todos virados para o mesmo canto do galpão.',
    'Eles não reagem à sua presença. Nenhum.',
    'No canto para onde todos olham, empoleirado numa viga de sustentação a vinte metros de altura, está Zapdos.',
    d=>{
      const L = Estado.dados.lendarios[145];
      if (L && L.disposicao==='hostil') return 'E ele já estava olhando pra você, porque ele já sabe quem você é.';
      return 'Ele não está caçando, não está descansando, não está fazendo ninho. Ele está carregando — e os outros vieram assistir.';
    }
  ],
  ef:{executar:d=>{ Estado.lend(145).encontros++; return []; },
      registrar:'Encontrou Zapdos na usina abandonada.'},
  escolhas:[
    {texto:'Sair de fininho. Não mexer com isso.', vai:'c10_saiu'},
    {texto:'Ficar parado e observar até ele terminar.', vai:'c10_observar_zapdos'},
    {texto:'Atacar. Uma ave lendária vale mais que um ano de jornada.', vai:'c10_zapdos'},
    {texto:'Oferecer comida.', vai:'c10_comida_zapdos', cond:d=>Estado.contaItem('Ração')>0},
    {texto:'Coletar os Voltorb parados — eles nem reagem.', vai:'c10_coleta',
     cond:d=>['mercenario','foragido'].includes(Historia.via())}
  ]
},

c10_coleta:{
  texto:[
    'Eles não reagem. Você pega um. Depois outro.',
    'Na terceira bola, um Magnemite do fundo do galpão vira lentamente a cabeça na sua direção.',
    'Depois todos viram. Todos os outros quarenta e poucos, ao mesmo tempo, com o mesmo som de servo motor.',
    'Eles não atacam. Só olham. E lá em cima, na viga, Zapdos para de carregar.'
  ],
  ef:{flag:'coletou_na_usina',
      executar:d=>{
        const avisos=[];
        for (let i=0;i<2;i++){
          const p = criarPokemon(Dados.escolher([100,81]), Dados.entre(28,34),
            {moral:10, historia:'Recolhido do chão da usina enquanto olhava para Zapdos.'});
          Estado.adicionar(p);
          avisos.push({tipo:'pokemon', texto:`${p.nome} (Nv ${p.nivel}) foi recolhido. Ele não resistiu, o que é pior.`});
        }
        const L=Estado.lend(145); L.disposicao='hostil';
        avisos.push({tipo:'perigo', texto:'Zapdos parou de carregar. Ele te viu fazer isso.'});
        return avisos;
      },
      rep:{eixo:'ruim',delta:2,motivo:'Recolheu Pokémon paralisados como quem cata sucata'},
      registrar:'Coletou Pokémon indefesos na usina, na frente de Zapdos.'},
  escolhas:[{texto:'Encarar o que vem.', vai:'c10_zapdos'}]
},

c10_observar_zapdos:{
  texto:[
    'Você senta no chão do galpão, entre os Voltorb, e espera.',
    'Leva quarenta minutos. Zapdos puxa energia do prédio inteiro em ciclos — a luz das lâmpadas de emergência apaga e acende no ritmo dele.',
    'Quando termina, ele desce da viga. Anda pelo chão como uma ave comum, entre os Voltorb, que abrem espaço.',
    'Ele passa a três metros de você. Vira a cabeça. Olha.',
    'Depois sai pelo buraco do teto, e o galpão inteiro escurece de uma vez.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(145); if(L.disposicao!=='hostil') L.disposicao='passivo';
        return [{tipo:'mundo', texto:'Zapdos te considera parte da paisagem. Isso é o mais perto de aprovação que uma ave lendária chega.'}]; },
      rep:{eixo:'bom',delta:2,motivo:'Encontrou uma Ave Lendária e escolheu só olhar'},
      flag:'respeitou_zapdos', registrar:'Observou Zapdos carregar e não interferiu.'},
  escolhas:[{texto:'Sair da usina.', vai:'c10_depois'}]
},

c10_comida_zapdos:{
  texto:[
    'Você coloca a ração no chão de concreto e recua.',
    'Zapdos olha a comida do alto da viga por um tempo humilhante.',
    'Depois desce — não pela comida. Ele pousa do lado da ração, ignora completamente, e olha pra você.',
    'Ele não come ração. Ele come corrente elétrica. O gesto não significou nada pra ele.',
    'E ainda assim ele desceu. Ele desceu porque alguém tentou.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Ração'); const L=Estado.lend(145); if(L.disposicao!=='hostil') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:1,motivo:'Tentou um gesto inútil e sincero com um lendário'},
      flag:'zapdos_desceu'},
  escolhas:[
    {texto:'Ficar parado.', vai:'c10_observar_zapdos'},
    {texto:'Aproveitar que ele desceu e jogar a bola.', vai:'c10_traicao_zapdos'}
  ]
},

c10_traicao_zapdos:{
  texto:[
    'Você joga a bola no segundo em que ele baixa a guarda.',
    'Não importa se prende. O gesto já aconteceu, e ele já entendeu o que foi.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(145); L.disposicao='hostil'; L.ataquesSofridos+=2; return []; },
      rep:{eixo:'ruim',delta:2,motivo:'Traiu a confiança de um lendário'},
      flag:'traiu_zapdos'},
  escolhas:[{texto:'Encarar o que vem.', vai:'c10_zapdos'}]
},

c10_zapdos:{
  texto:[
    'O galpão inteiro se ilumina de baixo pra cima.',
    'Os Voltorb no chão começam a brilhar em sequência, como uma pista de pouso, e todos apontam pra você.'
  ],
  batalha:{dex:145, nivel:50, tipo:'lendario', fuga:true, ambiente:'ruina',
           vitoria:'c10_pos_zapdos', derrota:'c10_pos_zapdos', fuga2:'c10_fugiu_zapdos',
           captura:'c10_capturou_zapdos', gameover:'gameover'}
},

c10_pos_zapdos:{
  texto:[
    'Ele volta pra viga. Não terminou, não fugiu, não perdeu — só voltou a fazer o que estava fazendo.',
    'Para uma coisa como Zapdos, você foi uma interrupção. Não uma ameaça.',
    'Isso devia ser humilhante e, por algum motivo, é um alívio.'
  ],
  ef:{executar:d=>{
        const L=Estado.lend(145); L.ataquesSofridos++;
        if (L.ataquesSofridos>=2){ L.disposicao='hostil'; return [{tipo:'perigo', texto:'Zapdos passou a te caçar. Céu limpo não é mais seguro pra você.'}]; }
        return [];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou uma Ave Lendária'}},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c10_zapdos'},
    {texto:'Parar.', vai:'c10_depois'}
  ]
},

c10_fugiu_zapdos:{
  texto:[
    'Você corre pelo pátio com o cabelo em pé e o gosto de metal na boca.',
    'Ele não persegue. Aves lendárias não perseguem — elas lembram.'
  ],
  escolhas:[{texto:'Sair da usina.', vai:'c10_depois'}]
},

c10_capturou_zapdos:{
  texto:[
    'A bola fecha e os quarenta e poucos Voltorb do chão apagam ao mesmo tempo.',
    'O galpão fica escuro, silencioso, e — pela primeira vez em onze anos — desligado de verdade.',
    'Lá fora, no céu limpo, uma nuvem começa a se formar exatamente sobre a usina. E outra no norte. E outra no sul.'
  ],
  ef:{instabilidade:2, registrar:'Capturou Zapdos na usina.'},
  escolhas:[
    {texto:'Soltar. Agora, antes de sair daqui.', vai:'c10_soltou_zapdos'},
    {texto:'Sair com ele.', vai:'c10_depois', ef:{flag:'levou_zapdos'}}
  ]
},

c10_soltou_zapdos:{
  texto:['Você abre a bola apontando pro buraco do teto.'],
  ef:{executar:d=>{
        const p=[...d.time,...d.pc].find(x=>x.dex===145);
        return p ? Captura.soltar(p).map(e=>({tipo:e.tipo,texto:e.texto})) : [];
      }},
  escolhas:[{texto:'Sair.', vai:'c10_depois'}]
},

c10_saiu:{
  texto:[
    'Você sai de costas, devagar, sem tirar o olho da viga.',
    'Nenhum dos Voltorb reage à sua saída. Eles nem sabiam que você estava lá.',
    'No portão, você olha pra trás uma última vez e entende uma coisa: aquilo não estava escondido. Estava só num lugar onde ninguém vai.'
  ],
  ef:{flag:'saiu_da_usina', rep:{eixo:'bom',delta:1,motivo:'Encontrou um lendário e escolheu não mexer'}},
  escolhas:[{texto:'Seguir.', vai:'c10_depois'}]
},

c10_depois:{
  texto:[
    'No portão da usina tem alguém esperando.',
    d=>{
      const via = Historia.via();
      if (via==='mercenario' || via==='foragido') return 'Dois homens com uma van. "A Terceira mandou perguntar se deu certo." Eles olham a sua mochila. Eles sabem contar bolas.';
      if (via==='pesquisador') return 'A Dra. Ivone, encostada num carro emprestado, com uma garrafa térmica. "Eu vi o relâmpago da estrada. Sobe aí, você tá com cara de quem precisa sentar."';
      if (via==='heroi') return 'Três pessoas de Cerulean, que vieram a pé, porque alguém falou que tinha um treinador na usina. Eles não sabem o que perguntar. Só queriam saber se era verdade.';
      return 'Um técnico da companhia elétrica, aposentado, que vem aqui uma vez por mês por conta própria. "Você viu?" Ele não precisa dizer o quê.';
    }
  ],
  escolhas:[
    {texto:'Contar tudo.', vai:'c10_contou',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Contou a verdade sobre o que viu na usina'}}},
    {texto:'Mentir.', vai:'c10_mentiu', ef:{flag:'mentiu_sobre_usina'}},
    {texto:'Não dizer nada e seguir andando.', vai:'c10_fim'}
  ]
},

c10_contou:{
  texto:[
    'Você conta. Sem enfeitar.',
    'Quem está ouvindo reage de um jeito que você não esperava: ninguém duvida. Nem por um segundo.',
    '"A gente sabia", diz um deles. "A gente só não tinha quem falasse."'
  ],
  ef:{flag:'contou_da_usina', registrar:'Contou publicamente o que viu na usina.'},
  escolhas:[{texto:'Seguir para Saffron.', vai:'c10_fim'}]
},

c10_mentiu:{
  texto:[
    '"Não tinha nada lá."',
    'Eles aceitam. Ou fingem aceitar, o que num contexto desses dá exatamente no mesmo.',
    'Você segue estrada com a sensação estranha de ter roubado uma coisa que não era sua: a certeza deles.'
  ],
  ef:{rep:{eixo:'ruim',delta:1,motivo:'Mentiu sobre o que viu na usina'}},
  escolhas:[{texto:'Seguir para Saffron.', vai:'c10_fim'}]
},

c10_fim:{
  texto:[
    'A estrada pra Saffron atravessa a Rota 5 e é a única de Kanto com asfalto o caminho inteiro.',
    'Saffron aparece antes do que você espera — e aparece por cima: os prédios são visíveis de dezenove quilômetros.',
    'O mais alto deles é azul e tem o logotipo da Silph no topo.',
    d=>d.flags.sabe_do_andar_11 ? 'Você conta os andares da estrada, andando. Conta dez. Conta de novo. Dez.' : 'Você conta os andares da estrada, sem motivo nenhum. Dez.'
  ],
  fim:true, resumo:'Capítulo 10 concluído — a usina te mostrou que os lendários não estão escondidos.'
}
}},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 11 — A TORRE DE VIDRO
   ══════════════════════════════════════════════════════════ */
{
num:11, titulo:'A Torre de Vidro', local:'Saffron / Silph Co.', ambiente:'cidade', nivelArea:38,
tom:'muito sombrio', inicio:'c11_saffron',
cenas:{

c11_saffron:{
  texto:[
    'Saffron não tem rota, não tem mato, não tem rio. É concreto até onde a vista alcança.',
    'A Silph Co. ocupa um quarteirão inteiro. Recepção com catraca, crachá, câmera, e uma mulher no balcão que atende com um sorriso impecável.',
    'E o ginásio de Saffron está fechado há três semanas, com um papel na porta: "SUSPENSO POR TEMPO INDETERMINADO — S."',
    d=>{
      const via = Historia.via();
      if (via==='pesquisador') return 'Você tem um guardanapo com o número 11 e um livro que diz SPH-11 sete vezes. É o suficiente pra saber onde procurar e insuficiente pra qualquer outra coisa.';
      if (via==='mercenario') return 'A Terceira te mandou fazer uma entrega aqui. Você é o entregador. Você tem acesso pela doca de carga — o que é mais do que a Liga conseguiu em nove meses.';
      if (via==='foragido') return 'Você herdou um cliente quando herdou a rede. O cliente é este prédio. Você veio renegociar.';
      if (via==='heroi') return 'Você não tem crachá, não tem mandado e não tem plano. Tem um livro de destinos e raiva suficiente pra atravessar uma catraca.';
      return 'Você não sabe direito por que veio. Sabe que veio.';
    }
  ],
  ef:{registrar:'Chegou a Saffron.'},
  escolhas:[
    {texto:'Entrar pela recepção, na cara de pau.', vai:'c11_recepcao'},
    {texto:'Entrar pela doca de carga.', vai:'c11_doca'},
    {texto:'Procurar o ginásio fechado primeiro.', vai:'c11_ginasio'},
    {texto:'Procurar quem trabalha lá — bar, ponto de ônibus, fila do almoço.', vai:'c11_funcionarios'}
  ]
},

c11_ginasio:{
  texto:[
    'O ginásio de Saffron é um prédio baixo e sem janela, encaixado entre dois arranha-céus.',
    'A porta está trancada. Mas a luz interna está acesa.',
    'Você bate. Ninguém responde por dois minutos inteiros. Depois a fechadura gira sozinha — do outro lado, sem ninguém tocando nela.',
    'Uma voz de mulher, dentro da sua cabeça, sem passar pelos ouvidos:',
    '"Você está pensando muito alto. Entra antes que a rua toda ouça."'
  ],
  ef:{flag:'entrou_no_ginasio_saffron'},
  escolhas:[{texto:'Entrar.', vai:'c11_sabrina'}]
},

c11_sabrina:{
  texto:[
    'Sabrina está sentada no chão do centro da arena, de olhos abertos, e não se levanta.',
    '"Eu fechei o ginásio porque não consigo mais separar." Ela diz isso sem drama, como quem relata sintoma pro médico.',
    '"Todo pensamento neste quarteirão chega em mim. Todos. Ao mesmo tempo. E tem um andar naquele prédio ali onde os pensamentos estão errados."',
    '"Não maus. Errados. Como uma frase com a gramática quebrada. Doze vozes falando na primeira pessoa do plural sobre uma coisa que é singular."',
    'Ela finalmente te olha. "Você veio por causa do andar onze."'
  ],
  ef:{npc:{nome:'Sabrina', opiniao:2, memoria:'Fechou o ginásio porque o andar 11 da Silph não a deixa em paz.'},
      flag:['sabe_do_andar_11','sabrina_avisou'],
      registrar:'Sabrina confirmou: existe um andar 11 na Silph e os pensamentos de lá estão "errados".'},
  escolhas:[
    {texto:'"Me ajuda a entrar."', vai:'c11_sabrina_ajuda'},
    {texto:'"O que tem lá?"', vai:'c11_sabrina_oque'},
    {texto:'"Por que você não entra você mesma?"', vai:'c11_sabrina_porque'}
  ]
},

c11_sabrina_oque:{
  texto:[
    '"Doze." Ela diz o número devagar. "Doze mentes que acham que são uma."',
    '"Eles não sabem que são doze. Cada um acha que é o único e que os outros onze são lembrança dele mesmo."',
    '"E tem uma décima terceira coisa lá, que não é mente, que é... molde. Como uma forma de gelatina. Eles estão sendo despejados nela."',
    'Ela para. "Eu já disse isso em voz alta pra três pessoas. Você é a primeira que não me perguntou se eu tenho dormido bem."'
  ],
  ef:{flag:'sabe_dos_doze'},
  escolhas:[
    {texto:'"Me ajuda a entrar."', vai:'c11_sabrina_ajuda'},
    {texto:'"Por que você não entra você mesma?"', vai:'c11_sabrina_porque'}
  ]
},

c11_sabrina_porque:{
  texto:[
    '"Porque se eu entrar, eu escuto de perto." Ela fala isso com um medo muito específico, de quem sabe exatamente o que teme.',
    '"Eu sou boa nisso. Boa demais. Se eu chegar a dez metros dos doze, eu viro a décima terceira."',
    '"Você não é psíquico. Você é surdo pra isso. É a sua melhor qualidade hoje."'
  ],
  escolhas:[{texto:'"Então me ajuda a entrar."', vai:'c11_sabrina_ajuda'}]
},

c11_sabrina_ajuda:{
  texto:[
    'Ela levanta pela primeira vez. Tira um crachá do bolso — crachá de manutenção, vencido, com foto de um homem de sessenta anos.',
    '"Isso era do zelador do prédio. Ele me deu e pediu demissão no mesmo dia."',
    '"Uma coisa mais." Ela encosta dois dedos na sua testa, rápido, antes que você recue. "Pronto. Se você ficar sem saber quem você é lá dentro, vai lembrar de uma coisa idiota e específica e isso vai te trazer de volta."',
    '"Qual coisa?"',
    '"Você vai descobrir. Tem que ser surpresa, senão não funciona."'
  ],
  ef:{flag:['crachas_sabrina','ancora_mental'], itens:{'Full Heal':2},
      npc:{nome:'Sabrina', opiniao:5, memoria:'Te deu o crachá do zelador e uma âncora mental antes de você subir.'},
      rep:{eixo:'bom',delta:1,motivo:'Conseguiu a confiança da líder de Saffron'}},
  escolhas:[{texto:'Ir para a Silph.', vai:'c11_recepcao'}]
},

c11_funcionarios:{
  texto:[
    'A fila da lanchonete em frente à Silph, 12h15. Quarenta pessoas de crachá.',
    'Ninguém fala de trabalho. Isso é normal. O que não é normal é que ninguém fala do prédio, nem pra reclamar — e gente de escritório reclama do prédio.',
    'Uma mulher de uns trinta anos, sozinha, come em pé olhando o celular. Crachá azul. Os outros são brancos.'
  ],
  escolhas:[
    {texto:'Puxar conversa com ela.', vai:'c11_crachaz_azul'},
    {texto:'Ouvir a fila em silêncio.', vai:'c11_fila'}
  ]
},

c11_fila:{
  texto:[
    'Você fica vinte minutos ouvindo. Colhe três coisas:',
    '— crachá branco vai até o andar 8; crachá azul vai até o 10;',
    '— o elevador de serviço não tem botão pro 11, mas a escada de incêndio tem o patamar;',
    '— toda quinta-feira, 19h, sobe uma entrega pela doca que ninguém do administrativo registra.',
    'Hoje é quinta.'
  ],
  ef:{flag:['sabe_dos_crachas','sabe_da_quinta','sabe_do_andar_11']},
  escolhas:[
    {texto:'Falar com a mulher do crachá azul.', vai:'c11_crachaz_azul'},
    {texto:'Ir para a doca de carga.', vai:'c11_doca'}
  ]
},

c11_crachaz_azul:{
  texto:[
    'Ela te ouve sem olhar. Quando você diz "andar onze", ela finalmente levanta a cabeça.',
    '"Quem te falou disso?"',
    'Você responde. Ela ouve, fecha o celular, e fala muito baixo e muito rápido.',
    '"Eu trabalho no 9. Eu assino requisição de material biológico. Eu assino há dois anos e nunca vi o material."',
    '"Eu não sou heroína. Eu tenho filho e financiamento. Mas eu vou te falar uma coisa e depois vou embora e a gente nunca se viu."',
    '"O 11 não fica em cima do 10. Fica embaixo do subsolo. Chamaram de 11 porque era o próximo número disponível na planilha."'
  ],
  ef:{flag:['sabe_onde_e_o_11','sabe_do_andar_11'],
      npc:{nome:'Marina (crachá azul)', opiniao:2, memoria:'Te contou onde fica o andar 11 e pediu para nunca ter acontecido.'},
      registrar:'O "andar 11" da Silph fica abaixo do subsolo.'},
  escolhas:[
    {texto:'"Me leva até a porta."', vai:'c11_marina_leva'},
    {texto:'"Obrigado. Some daqui."', vai:'c11_recepcao',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Protegeu quem te ajudou'}}}
  ]
},

c11_marina_leva:{
  texto:['Ela te olha por muito tempo.'],
  teste:{status:'carisma', dificuldade:9, nomeStatus:'Carisma',
         critico:'c11_marina_topa', sucesso:'c11_marina_topa', parcial:'c11_marina_meio', falha:'c11_marina_nao'}
},

c11_marina_topa:{
  texto:[
    '"Uma vez." Ela já está andando. "Eu te passo pela catraca como visita técnica, te levo até a escada de incêndio e volto pra minha mesa."',
    '"Se te pegarem, eu não te conheço."',
    '"Combinado."',
    'Na catraca, ela digita a matrícula dela pra te liberar. Ela sabe que isso fica registrado. Ela faz mesmo assim.'
  ],
  ef:{flag:['entrou_com_marina','dentro_da_silph'],
      npc:{nome:'Marina (crachá azul)', opiniao:5, memoria:'Usou a própria matrícula pra te passar pela catraca da Silph.'},
      rep:{eixo:'bom',delta:1,motivo:'Convenceu alguém a arriscar o emprego pelo certo'}},
  escolhas:[{texto:'Descer para a escada de incêndio.', vai:'c11_escada'}]
},

c11_marina_meio:{
  texto:[
    '"Não." Ela pega a bolsa. "Mas eu esqueci meu crachá reserva no bolso desse casaco aqui, que eu vou deixar nessa cadeira, porque eu sou distraída."',
    'Ela vai embora sem olhar pra trás.',
    'O casaco fica na cadeira. O crachá está no bolso.'
  ],
  ef:{flag:['cracha_roubado','dentro_da_silph'],
      npc:{nome:'Marina (crachá azul)', opiniao:3, memoria:'Deixou o crachá reserva num casaco para você, sem admitir.'}},
  escolhas:[{texto:'Entrar.', vai:'c11_recepcao'}]
},

c11_marina_nao:{
  texto:[
    '"Não." Ela levanta. "Eu já falei demais. Boa sorte, sério."',
    'Ela vai embora rápido, e na esquina olha pra trás uma vez — não pra você, pro prédio.'
  ],
  escolhas:[
    {texto:'Entrar pela recepção.', vai:'c11_recepcao'},
    {texto:'Entrar pela doca.', vai:'c11_doca'}
  ]
},

c11_recepcao:{
  texto:[
    'A recepção da Silph tem pé-direito de doze metros e uma catraca que abre com crachá.',
    d=>{
      if (d.flags.entrou_com_marina) return 'Marina já te passou. Você está do lado de dentro, com um crachá de visitante e quinze minutos de plausibilidade.';
      if (d.flags.crachas_sabrina) return 'O crachá do zelador é vencido, mas a catraca da Silph lê o chip, não a data. Ela abre.';
      if (d.flags.cracha_roubado) return 'O crachá reserva de Marina abre a catraca no primeiro toque.';
      return 'Você não tem crachá. A recepcionista sorri e pergunta com quem você tem hora marcada.';
    }
  ],
  escolhas:[
    {texto:'Subir pela escada de incêndio.', vai:'c11_escada',
     cond:d=>!!(d.flags.entrou_com_marina||d.flags.crachas_sabrina||d.flags.cracha_roubado||d.flags.dentro_da_silph)},
    {texto:'Inventar uma reunião.', vai:'c11_inventar'},
    {texto:'Ir pela doca de carga.', vai:'c11_doca'},
    {texto:'Desistir do prédio.', vai:'c11_desistiu'}
  ]
},

c11_inventar:{
  texto:['"Eu tenho reunião no nono andar. Requisição de material biológico."'],
  teste:{status:'intelecto', dificuldade:9, nomeStatus:'Intelecto',
         critico:'c11_entrou_blefe', sucesso:'c11_entrou_blefe', parcial:'c11_barrado', falha:'c11_barrado'}
},

c11_entrou_blefe:{
  texto:[
    'Você usou as palavras exatas, na ordem exata, com a segurança de quem já falou isso cem vezes.',
    'A recepcionista digita, franze a testa meio segundo, e imprime um crachá de visitante.',
    '"Nono andar. Elevador da direita."',
    'O elevador da direita passa pelo subsolo.'
  ],
  ef:{flag:'dentro_da_silph', rep:{eixo:'bom',delta:0,motivo:''}},
  escolhas:[{texto:'Descer no subsolo em vez de subir.', vai:'c11_escada'}]
},

c11_barrado:{
  texto:[
    'Ela sorri, digita, e o sorriso não muda nem um milímetro enquanto ela aperta um botão embaixo do balcão.',
    'A segurança chega em quarenta segundos. Dois homens grandes e muito educados.',
    '"O senhor precisa se retirar."'
  ],
  ef:{flag:'barrado_na_silph'},
  escolhas:[
    {texto:'Sair e tentar a doca.', vai:'c11_doca'},
    {texto:'Reagir.', vai:'c11_reagiu_seguranca'}
  ]
},

c11_reagiu_seguranca:{
  texto:[
    'Você reage no saguão de uma empresa, sob quatro câmeras.',
    'Isso não é uma batalha Pokémon — é uma ocorrência policial com registro audiovisual.'
  ],
  batalha:{dex:82, nivel:36, tipo:'treinador', treinador:'Segurança da Silph', fuga:true,
           timeExtra:[{dex:57, nivel:36}],
           vitoria:'c11_venceu_seguranca', derrota:'c11_expulso', fuga2:'c11_doca', gameover:'gameover'}
},

c11_venceu_seguranca:{
  texto:[
    'Você derruba os dois. No saguão. Na frente da recepção, de doze funcionários e de quatro câmeras.',
    'A catraca não te impede — segurança derrubada não tranca porta.',
    'Mas a partir de agora existe um vídeo seu, com data e hora, invadindo uma empresa.'
  ],
  ef:{flag:['dentro_da_silph','video_da_silph'],
      rep:{eixo:'ruim',delta:2,motivo:'Invadiu a Silph à força, gravado por quatro câmeras'},
      executar:d=>{ d.liga.avisos++; return [{tipo:'liga', texto:'A Silph vai acionar a Liga. Isso é questão de horas.'}]; }},
  escolhas:[{texto:'Descer pela escada de incêndio.', vai:'c11_escada'}]
},

c11_expulso:{
  texto:[
    'Eles te tiram do saguão com uma eficiência que sugere prática.',
    'Você acorda na calçada, sem nada quebrado e com a mochila do lado.',
    'A porta de vidro atrás de você reflete a rua inteira e não mostra nada do que tem dentro.'
  ],
  ef:{hp:-5, causa:'Retirado à força da Silph', flag:'expulso_da_silph'},
  escolhas:[
    {texto:'Tentar a doca de carga.', vai:'c11_doca'},
    {texto:'Desistir do prédio.', vai:'c11_desistiu'}
  ]
},

c11_doca:{
  texto:[
    'A doca de carga fica na lateral e funciona até tarde. Quinta-feira, 19h.',
    'Um caminhão sem identificação encosta. A carga é uma só: uma caixa branca de um metro e meio, com trava e etiqueta de material biológico.',
    d=>{
      const via = Historia.via();
      if (via==='mercenario'||via==='foragido') return 'Você conhece essa caixa. Você provavelmente ajudou a carregar uma igual em algum lugar.';
      return 'Dois funcionários descem pra buscar. Nenhum dos dois assina nada.';
    }
  ],
  escolhas:[
    {texto:'Entrar junto com a caixa.', vai:'c11_com_a_caixa'},
    {texto:'Abrir a caixa ali mesmo, na doca.', vai:'c11_abriu_caixa_silph'},
    {texto:'Se passar por entregador.', vai:'c11_entregador'},
    {texto:'Voltar para a recepção.', vai:'c11_recepcao'}
  ]
},

c11_entregador:{
  texto:['"Chegou mais uma. Cadê o responsável pra assinar?"'],
  teste:{status:'carisma', dificuldade:7, nomeStatus:'Carisma',
         critico:'c11_com_a_caixa', sucesso:'c11_com_a_caixa', parcial:'c11_com_a_caixa', falha:'c11_barrado'}
},

c11_abriu_caixa_silph:{
  texto:[
    'Você abre a trava na doca, com dois funcionários a dez metros de distância.',
    'Dentro: um Ditto. Vivo, sedado, com um monitor colado no dorso.',
    'E, embaixo dele, separados por espuma, mais quatro. Todos Ditto. Todos com monitor.',
    'Ditto copia. É a única coisa que Ditto faz.',
    'Você entende o experimento inteiro em dois segundos e queria muito não ter entendido.'
  ],
  ef:{flag:['viu_os_dittos','entendeu_o_projeto'],
      registrar:'A Silph recebe Dittos sedados semanalmente. Eles estão copiando alguma coisa.'},
  escolhas:[
    {texto:'Levar a caixa inteira e correr.', vai:'c11_roubou_caixa_silph'},
    {texto:'Fechar e entrar junto com ela.', vai:'c11_com_a_caixa'},
    {texto:'Soltar os cinco ali mesmo.', vai:'c11_soltou_dittos'}
  ]
},

c11_soltou_dittos:{
  texto:[
    'Você tira os cinco e coloca no chão da doca.',
    'Sedados, eles levam quase um minuto pra reagir. Quando reagem, fazem a única coisa que sabem: copiam o que está por perto.',
    'Quatro deles copiam você.',
    'Você fica cara a cara com quatro cópias suas, de crachá e mochila, na doca de carga da Silph, às sete da noite de uma quinta-feira.',
    'Nenhum funcionário sabe qual dos cinco perseguir. É a distração mais eficiente e mais perturbadora possível.'
  ],
  ef:{flag:['soltou_dittos','dentro_da_silph'],
      rep:{eixo:'bom',delta:2,motivo:'Libertou os Dittos da entrega semanal da Silph'},
      registrar:'Soltou cinco Dittos na doca da Silph. Quatro copiaram você.'},
  escolhas:[{texto:'Entrar enquanto eles se confundem.', vai:'c11_escada'}]
},

c11_roubou_caixa_silph:{
  texto:[
    'Você pega a caixa e corre. Ela pesa vinte e dois quilos.',
    'Você corre quatro quarteirões com vinte e dois quilos e some numa galeria.',
    'Dentro, cinco Dittos. E a certeza de que a Silph vai receber outra caixa igual na quinta que vem.'
  ],
  ef:{flag:'roubou_caixa_silph', hp:-3, causa:'Fuga com vinte e dois quilos',
      rep:{eixo:'bom',delta:1,motivo:'Interceptou uma entrega da Silph'},
      pokemon:{dex:132, nivel:30, opcoes:{moral:30, historia:'Estava numa caixa branca com monitor colado no dorso, a caminho do andar 11 da Silph.'}},
      registrar:'Roubou a caixa de Dittos da doca da Silph.'},
  escolhas:[
    {texto:'Voltar ao prédio mesmo assim.', vai:'c11_escada'},
    {texto:'Ir embora de Saffron com os Dittos.', vai:'c11_fim'}
  ]
},

c11_com_a_caixa:{
  texto:[
    'Você entra empurrando o carrinho, de cabeça baixa, como quem faz isso toda semana.',
    'Ninguém questiona um carrinho.',
    'O elevador de carga desce — não sobe. Subsolo. Depois continua descendo.',
    'O painel tem oito botões. O último não tem número, só uma etiqueta de fita crepe escrita à mão.'
  ],
  ef:{flag:'dentro_da_silph'},
  escolhas:[{texto:'Apertar o último botão.', vai:'c11_onze'}]
},

c11_escada:{
  texto:[
    'A escada de incêndio da Silph desce mais do que sobe. Isso é a primeira coisa errada.',
    'Subsolo 1: garagem. Subsolo 2: arquivo. Subsolo 3: sala de máquinas.',
    'Subsolo 4 não está na placa e a escada continua.',
    'No patamar seguinte, uma porta de aço com fechadura biométrica e, colada nela, uma folha A4 impressa em fonte padrão:',
    '"ANDAR 11 — ACESSO RESTRITO — NÍVEL 3"'
  ],
  ef:{flag:'chegou_no_11', registrar:'Chegou à porta do andar 11 da Silph.'},
  escolhas:[
    {texto:'Forçar a porta.', vai:'c11_forcou'},
    {texto:'Esperar alguém sair.', vai:'c11_esperou_11'},
    {texto:'Usar o crachá do zelador.', vai:'c11_onze', cond:d=>!!d.flags.crachas_sabrina},
    {texto:'Voltar. Ainda dá tempo de não saber.', vai:'c11_desistiu'}
  ]
},

c11_forcou:{
  texto:['Fechadura biométrica não se força. O que se força é a dobradiça.'],
  teste:{status:'forca', dificuldade:9, nomeStatus:'Força',
         critico:'c11_onze', sucesso:'c11_onze', parcial:'c11_esperou_11', falha:'c11_alarme'}
},

c11_alarme:{
  texto:[
    'A porta não cede e o alarme dispara.',
    'Não é sirene. É uma luz azul girando em silêncio, o que é infinitamente pior.',
    'Você ouve o elevador de carga sendo chamado três andares acima.'
  ],
  ef:{flag:'alarme_silph'},
  escolhas:[
    {texto:'Esconder e esperar eles abrirem.', vai:'c11_onze'},
    {texto:'Correr escada acima.', vai:'c11_desistiu'}
  ]
},

c11_esperou_11:{
  texto:[
    'Você espera no patamar de cima, agachado, por duas horas e meia.',
    'Às 22h40 a porta abre e sai uma mulher de jaleco, sozinha, falando ao telefone.',
    '"...não, o quarto ciclo também não pegou. A matriz rejeita." Pausa. "Eu sei o que custa. Eu também sei o que custa explicar sete Dittos por semana."',
    'Ela sobe. A porta leva onze segundos pra fechar sozinha.'
  ],
  ef:{flag:'ouviu_a_cientista'},
  escolhas:[{texto:'Entrar nos onze segundos.', vai:'c11_onze'}]
},

c11_onze:{
  texto:[
    'O andar 11 é branco, iluminado e absolutamente silencioso.',
    'Não tem mesa, não tem cadeira, não tem computador à vista. Tem doze tanques.',
    'Doze tanques cilíndricos de dois metros, em duas fileiras de seis, cheios de líquido claro.',
    'Onze deles têm alguma coisa dentro. Todas as onze coisas são a mesma coisa em estágios diferentes de terminado.',
    'O décimo segundo tanque está vazio e limpo, e a placa dele diz "MATRIZ — VAGO".',
    'Na parede do fundo, num quadro branco, uma anotação em caneta preta:',
    '"O original respondeu. Nenhuma cópia responde. Conclusão provisória: não é o material. É o tempo de fala."'
  ],
  ef:{flag:['viu_os_doze','entendeu_o_projeto'], instabilidade:2,
      registrar:'Viu os doze tanques do andar 11 da Silph. Estão tentando refazer Mewtwo.'},
  escolhas:[
    {texto:'Ler o resto do quadro.', vai:'c11_quadro'},
    {texto:'Abrir os tanques.', vai:'c11_abrir_tanques'},
    {texto:'Fotografar tudo e sair.', vai:'c11_fotografou_11'},
    {texto:'Destruir o andar inteiro.', vai:'c11_destruir'},
    {texto:'Sair. Você não devia ter visto isso.', vai:'c11_saiu_11'}
  ]
},

c11_quadro:{
  texto:[
    'O quadro tem uma linha do tempo.',
    '"Aquisição do material — Cinnabar, arquivo morto." / "Primeira série: falha estrutural." / "Segunda série: viável, sem cognição." / "Terceira série: cognição parcial, sem vontade."',
    'E embaixo, numa letra diferente, mais nova, quase raivosa:',
    '"O DR. FUJI CONVERSOU COM ELE POR 241 DIAS. NÓS NÃO TEMOS 241 DIAS. O CONSELHO QUER RESULTADO EM 90."',
    'E no canto, apagado pela metade e reescrito por cima três vezes, o mesmo rabisco:',
    '"eles não falam porque ninguém pergunta"'
  ],
  ef:{flag:'leu_o_quadro',
      registrar:'O quadro do andar 11: as cópias não falam porque ninguém pergunta.'},
  escolhas:[
    {texto:'Perguntar alguma coisa. Em voz alta. Para os tanques.', vai:'c11_perguntou'},
    {texto:'Abrir os tanques.', vai:'c11_abrir_tanques'},
    {texto:'Fotografar e sair.', vai:'c11_fotografou_11'},
    {texto:'Destruir o andar.', vai:'c11_destruir'}
  ]
},

c11_perguntou:{
  texto:[
    'Você se sente ridículo por três segundos inteiros.',
    'Depois fala, em voz alta, numa sala branca com onze corpos em tanques:',
    '"Vocês estão aí?"',
    'O líquido do quarto tanque se move.',
    'Não é uma resposta em palavra. É uma pressão atrás dos seus olhos, e uma sensação que você reconhece imediatamente porque todo mundo reconhece: o alívio de alguém que passou muito tempo esperando ser chamado.',
    'Onze pressões. Uma depois da outra. Em ordem, do primeiro tanque ao décimo primeiro.',
    d=>d.flags.ancora_mental ? 'Alguma coisa começa a puxar você pra dentro daquilo, e aí você lembra — de um jeito absurdo e nítido — do cheiro da cozinha da sua casa no capítulo um. A âncora da Sabrina. Você volta.' : 'Alguma coisa começa a puxar você pra dentro daquilo e você não tem nada pra se segurar.'
  ],
  ef:{flag:'falou_com_os_doze',
      executar:d=>{
        if (!d.flags.ancora_mental){
          const morreu = Estado.ferir(9, 'Contato mental com o andar 11');
          return [{tipo:'dano', texto:'Você perdeu 9 de HP. Ficou vinte minutos sem saber seu próprio nome.'}];
        }
        return [{tipo:'info', texto:'A âncora da Sabrina funcionou. Você voltou inteiro.'}];
      },
      rep:{eixo:'bom',delta:2,motivo:'Foi a primeira pessoa a perguntar alguma coisa às cópias'},
      registrar:'Falou com as onze cópias. Elas responderam.'},
  escolhas:[
    {texto:'Abrir os tanques.', vai:'c11_abrir_tanques'},
    {texto:'Fotografar e sair — a prova vale mais que onze vidas.', vai:'c11_fotografou_11'},
    {texto:'Prometer voltar.', vai:'c11_prometeu_voltar'}
  ]
},

c11_prometeu_voltar:{
  texto:[
    '"Eu volto."',
    'Você diz isso em voz alta numa sala branca, para onze coisas em tanques, e não tem a menor ideia de como vai cumprir.',
    'As onze pressões respondem ao mesmo tempo, e dessa vez você entende a textura do que elas mandam: não é esperança.',
    'É registro. Elas anotaram.'
  ],
  ef:{flag:['prometeu_aos_doze','divida_com_os_doze'],
      rep:{eixo:'bom',delta:1,motivo:'Prometeu a onze pessoas que ninguém considera pessoa'},
      registrar:'Prometeu voltar ao andar 11. Eles anotaram.'},
  escolhas:[{texto:'Sair.', vai:'c11_saiu_11'}]
},

c11_abrir_tanques:{
  texto:[
    'O painel de dreno é analógico e tem uma alavanca por tanque. Isso é projeto de gente que não achava que alguém fosse querer abrir.',
    'Você abre os onze.',
    'O líquido desce em noventa segundos. Sete não se mexem — nunca iam se mexer.',
    'Três se mexem e não conseguem ficar de pé.',
    'Um fica de pé.',
    'Ele tem mais ou menos a sua altura, a pele clara demais, e olha em volta de um jeito que você reconhece: primeira vez.'
  ],
  ef:{flag:'abriu_os_tanques', instabilidade:2,
      registrar:'Abriu os onze tanques do andar 11. Um ficou de pé.'},
  escolhas:[
    {texto:'Levar ele com você.', vai:'c11_levou_copia'},
    {texto:'Mostrar a saída e deixar ele escolher.', vai:'c11_deixou_escolher'},
    {texto:'Fugir. Você não sabe o que é isso.', vai:'c11_fugiu_do_11'}
  ]
},

c11_levou_copia:{
  texto:[
    'Você estende a mão. Ele olha a mão, olha você, e não entende o gesto — ninguém nunca estendeu nada pra ele.',
    'Você pega no braço dele, com cuidado, e puxa. Ele vem.',
    'Vocês sobem quatro lances de escada de incêndio com um alarme azul girando em silêncio.',
    'Na rua, ele para. Olha o céu pela primeira vez na vida e trava completamente.',
    'Você tem que puxar de novo.'
  ],
  ef:{flag:['levou_uma_copia','tem_uma_copia'],
      pokemon:{dex:150, nivel:25, opcoes:{apelido:'Décimo Segundo', natureza:'Bashful', moral:40,
        historia:'Cópia incompleta feita no andar 11 da Silph. Ficou de pé quando você abriu o tanque. Não é Mewtwo — é uma tentativa de Mewtwo.'}},
      rep:{eixo:'bom',delta:2,motivo:'Tirou uma cópia viva do andar 11'},
      registrar:'Tirou o Décimo Segundo do andar 11 da Silph.'},
  escolhas:[{texto:'Sumir de Saffron.', vai:'c11_fim'}]
},

c11_deixou_escolher:{
  texto:[
    'Você aponta a porta da escada e recua.',
    'Ele olha a porta por quarenta segundos. Depois olha os três no chão que não conseguem levantar.',
    'Depois senta no chão, ao lado deles.',
    'Ele escolheu. A primeira escolha da vida dele foi ficar com os outros três.',
    'Você sai sozinho e essa imagem vai te acompanhar até o último capítulo.'
  ],
  ef:{flag:['deixou_a_copia','divida_com_os_doze'],
      rep:{eixo:'bom',delta:3,motivo:'Deu a alguém a primeira escolha da vida dele'},
      registrar:'A cópia escolheu ficar com os outros três. Você saiu sozinho.'},
  escolhas:[{texto:'Sair.', vai:'c11_fim'}]
},

c11_fugiu_do_11:{
  texto:[
    'Você sobe a escada correndo com quatro coisas vivas atrás de você num chão molhado.',
    'Nenhuma te persegue. Elas não sabem correr.',
    'Você fecha a porta de aço do lado de fora e ela tranca sozinha.'
  ],
  ef:{flag:'fechou_a_porta_do_11',
      rep:{eixo:'ruim',delta:1,motivo:'Abriu os tanques e fugiu'},
      registrar:'Abriu os tanques e trancou a porta atrás de si.'},
  escolhas:[{texto:'Sair do prédio.', vai:'c11_fim'}]
},

c11_fotografou_11:{
  texto:[
    'Você fotografa os doze tanques, o quadro branco, a etiqueta "MATRIZ — VAGO", a linha do tempo, o rabisco no canto.',
    'Vinte e três fotos.',
    'Depois sai sem abrir nenhum tanque, porque uma foto de onze corpos em tanque fecha uma empresa, e onze corpos soltos numa escada de incêndio fecham só uma noite.',
    'Você faz a conta friamente e sai, e a frieza é a parte que te assusta.'
  ],
  ef:{flag:['provas_do_11','escolha_fria'],
      rep:{eixo:'bom',delta:2,motivo:'Documentou o andar 11 inteiro'},
      registrar:'Fotografou o andar 11: 23 fotos.'},
  escolhas:[
    {texto:'Levar à Dra. Ivone.', vai:'c11_entregou_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Liga.', vai:'c11_entregou_liga'},
    {texto:'Levar à Sabrina.', vai:'c11_entregou_sabrina', cond:d=>!!d.flags.sabrina_avisou},
    {texto:'Guardar. Você decide depois.', vai:'c11_fim', ef:{flag:'guardou_provas_11'}}
  ]
},

c11_entregou_ivone:{
  texto:[
    'A Dra. Ivone olha as vinte e três fotos em silêncio absoluto.',
    'Na foto do quadro branco — a do "241 dias" — ela tira os óculos e esfrega os olhos por muito tempo.',
    '"Eu conheci o Fuji." Ela diz isso do nada. "Na faculdade. Ele era o mais gentil da turma."',
    '"Isso aqui não é a Silph sendo má. Isso é a Silph tendo prazo."',
    'Ela liga pra três pessoas naquela noite. Duas atendem.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Entregou o andar 11 a quem sabia o que fazer com aquilo'},
      npc:{nome:'Dra. Ivone', opiniao:10, memoria:'Recebeu as 23 fotos do andar 11. Conhecia o Dr. Fuji da faculdade.'},
      flag:'ivone_tem_o_11', instabilidade:-1,
      registrar:'Dra. Ivone recebeu as provas do andar 11.'},
  escolhas:[{texto:'Sair de Saffron.', vai:'c11_fim'}]
},

c11_entregou_liga:{
  texto:[
    'A Liga age rápido dessa vez. Rápido demais, na verdade.',
    'Em nove horas tem gente de terno na Silph. Em dezoito, um comunicado oficial: "irregularidades administrativas em unidade de pesquisa".',
    'Em trinta e seis horas, o andar 11 não existe mais. Esvaziado, limpo, lacrado.',
    'Ninguém diz o que aconteceu com o conteúdo dos tanques. Você pergunta três vezes. Três respostas diferentes.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Entregou o andar 11 à Liga Pokémon'},
      flag:'liga_lacrou_o_11', instabilidade:1,
      executar:d=>{ d.liga.avisos = Math.max(0, d.liga.avisos-1); return [{tipo:'liga', texto:'A Liga passou a te dever um favor. Isso é uma moeda estranha.'}]; },
      registrar:'A Liga lacrou o andar 11 em 36 horas. Ninguém explicou o destino dos tanques.'},
  escolhas:[{texto:'Sair de Saffron.', vai:'c11_fim'}]
},

c11_entregou_sabrina:{
  texto:[
    'Sabrina olha três fotos e para.',
    '"Eu não preciso ver o resto. Eu já ouvi o resto todo dia durante três semanas."',
    'Ela devolve o celular. "Você perguntou pra eles?"',
    d=>d.flags.falou_com_os_doze ? '"Perguntei."\n"Eu sei. Eu senti daqui." Ela fecha os olhos. "Onze coisas sentiram alívio ao mesmo tempo e eu quase caí no chão da arena."' :
       '"Não."\n"Ah." Ela olha pro lado. "Então volta lá um dia e pergunta. É a única coisa que ninguém tentou."',
    'Ela reabre o ginásio na semana seguinte. Não porque melhorou — porque agora ela sabe que tem alguém a par.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Compartilhou a verdade com quem estava sozinha nela'},
      npc:{nome:'Sabrina', opiniao:8, memoria:'Reabriu o ginásio depois que você confirmou o que ela ouvia.'},
      flag:'sabrina_aliada'},
  escolhas:[{texto:'Sair de Saffron.', vai:'c11_fim'}]
},

c11_destruir:{
  texto:[
    'Você destrói o andar 11.',
    'Não tem outra forma de descrever: você usa o seu time, o painel de dreno, o que estiver à mão, e em doze minutos não tem mais tanque em pé.',
    'Onze coisas que nunca foram perguntadas sobre nada acabam sem que ninguém pergunte nada.',
    'Você acha que está fazendo misericórdia. Talvez esteja.',
    'Você nunca vai ter como saber, porque você não perguntou.'
  ],
  ef:{rep:{eixo:'ruim',delta:3,motivo:'Destruiu os onze sem perguntar a nenhum deles'},
      flag:['destruiu_o_11','tem_sangue_nas_maos'], instabilidade:2, moral:-15,
      executar:d=>{ d.liga.avisos++; return [{tipo:'liga', texto:'A Silph vai registrar isso como terrorismo industrial. E vai estar tecnicamente correta.'}]; },
      registrar:'Destruiu o andar 11 e os onze tanques.'},
  escolhas:[{texto:'Sair antes que cheguem.', vai:'c11_fim'}]
},

c11_saiu_11:{
  texto:[
    'Você sai do andar 11 sem tocar em nada.',
    'Sobe quatro lances de escada, atravessa um saguão com pé-direito de doze metros e sai pela porta giratória pra uma rua com gente comprando jantar.',
    'A distância entre essas duas coisas — a sala branca e a rua com gente comprando jantar — é de quarenta metros verticais.',
    'Você senta no meio-fio um tempo.'
  ],
  ef:{flag:'saiu_do_11_intacto'},
  escolhas:[{texto:'Seguir.', vai:'c11_fim'}]
},

c11_desistiu:{
  texto:[
    'Você sobe a escada de volta sem abrir a porta.',
    'Não saber é uma escolha. É uma escolha legítima, que muita gente faz, e quase sempre é a mais confortável das disponíveis.',
    'Você faz essa.',
    'Ela vai voltar.'
  ],
  ef:{flag:'nao_entrou_no_11',
      rep:{eixo:'ruim',delta:1,motivo:'Chegou à porta e escolheu não saber'},
      registrar:'Chegou à porta do andar 11 e voltou.'},
  escolhas:[{texto:'Sair de Saffron.', vai:'c11_fim'}]
},

c11_fim:{
  texto:[
    'Saffron continua funcionando. Esse é o detalhe que não sai da sua cabeça.',
    'Quarenta metros acima dos tanques tem gente discutindo planilha, e trinta metros acima dessa gente tem gente comprando jantar, e nenhuma dessas camadas sabe da outra, e a cidade funciona perfeitamente assim.',
    d=>{
      if (d.flags.tem_uma_copia) return 'E do seu lado, andando meio devagar, tem uma coisa de vinte e cinco níveis que nasceu num tanque e tá vendo rua pela primeira vez.';
      if (d.flags.destruiu_o_11) return 'E você não sabe o nome de nenhum dos onze, porque eles não tinham nome, porque ninguém perguntou.';
      if (d.flags.provas_do_11 || d.flags.ivone_tem_o_11) return 'E no seu bolso tem vinte e três fotos que valem mais do que tudo que você carregou até hoje.';
      return 'E você desce a avenida sabendo de uma coisa que a cidade inteira não sabe.';
    },
    'A próxima cidade é Fuchsia. Lá tem uma reserva de nove mil hectares que se chama Zona Safári, e o nome já diz tudo se você parar pra pensar.'
  ],
  fim:true, resumo:'Capítulo 11 concluído — você viu o que Cinnabar virou.'
}
}}

);
