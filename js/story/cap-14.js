/* ============================================================
   CAPÍTULO 14 — Cinnabar e Moltres
   ============================================================ */
CAPITULOS.push(

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 8 — O CADERNO DE CINNABAR
   ══════════════════════════════════════════════════════════ */
{
num:14, titulo:'O Caderno de Cinnabar', local:'Ilha Cinnabar', ambiente:'vulcao', nivelArea:36,
tom:'muito sombrio', inicio:'c14_ilha',
cenas:{

c14_ilha:{
  texto:[
    'Cinnabar é uma ilha com um vulcão no meio e um laboratório na beira. Os dois estão inativos. Os dois estão mentindo.',
    d=>{
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) return 'A recepcionista do hotel olha seu rosto duas vezes, depois olha uma tela, depois sorri de um jeito que não chega aos olhos. "Quarto 12." Você não deu seu nome.';
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=6) return 'Duas crianças te seguem do porto até o hotel a uma distância constante de dez metros, cochichando. Quando você vira, elas param de andar. Quando você anda, elas andam.';
      return 'Ninguém te nota no porto. O barco vai embora e você fica.';
    },
    'O prédio do laboratório queimou parcialmente na semana passada. A fita de isolamento é nova; o buraco na cerca, também.',
    'Alguém entrou antes de você. E não saiu pela cerca.'
  ],
  ef:{registrar:'Chegou à Ilha Cinnabar depois do incêndio no laboratório.'},
  escolhas:[
    {texto:'Entrar pelo buraco na cerca.', vai:'c14_lab'},
    {texto:'Subir o vulcão primeiro. Tem fumaça errada saindo dele.', vai:'c14_vulcao'},
    {texto:'Perguntar na cidade o que aconteceu.', vai:'c14_cidade'}
  ]
},

c14_cidade:{
  texto:[
    'Ninguém quer falar do laboratório. Todo mundo fala do laboratório.',
    '"Fechou há anos." / "Fechou no papel." / "Tinha gente entrando de madrugada até semana passada."',
    'Uma mulher que trabalhou lá na limpeza, hoje aposentada, te conta a parte que importa, depois de aceitar um café e antes de se arrepender:',
    '"Tinha um tanque. Grande, do tamanho de um carro. E o que tava dentro cresceu rápido demais pro tanque. Aí um dia não tinha mais tanque, não tinha mais teto, e não tinha mais o Dr. Fuji."'
  ],
  ef:{flag:'ouviu_historia_lab', npc:{nome:'Dona Selma', opiniao:2, memoria:'Te contou sobre o tanque no laboratório de Cinnabar.'}},
  escolhas:[
    {texto:'Entrar no laboratório.', vai:'c14_lab'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'}
  ]
},

c14_lab:{
  texto:[
    'O laboratório por dentro é um museu de coisa interrompida. Café petrificado numa caneca. Um jaleco pendurado. Cadeira caída que ninguém levantou em dois anos.',
    'O incêndio pegou só a ala leste — e pegou de dentro pra fora, o que é a direção errada pra um incêndio elétrico.',
    'No subsolo, a sala do tanque. O tanque não existe mais. Existe o buraco onde ele estava e o teto com um rombo que sobe três andares até o céu.',
    'Numa mesa encostada na parede, um caderno de capa dura. Não queimou. Estava aberto.'
  ],
  ef:{registrar:'Encontrou o caderno no subsolo do laboratório de Cinnabar.'},
  escolhas:[{texto:'Ler o caderno.', vai:'c14_caderno'}]
},

c14_caderno:{
  texto:[
    '"Dia 41. O material genético de Mew respondeu melhor do que o previsto. Viabilidade alta."',
    '"Dia 112. Ele sonha. Registramos atividade onírica. Não sabíamos que ele podia sonhar."',
    '"Dia 180. Perguntou o que ele é. Não respondemos porque não temos resposta que sirva."',
    '"Dia 241. Ele pediu para sair. Usou a palavra por favor."',
    '"Dia 242. —"',
    'A página do dia 242 está arrancada. As seguintes estão em branco, todas, até a última folha, onde tem uma frase escrita com outra letra, maior, sem caneta — queimada na página:',
    '"EU PERGUNTEI PRIMEIRO."'
  ],
  ef:{flag:'leu_caderno', instabilidade:1,
      registrar:'Leu o caderno do Dr. Fuji. Mewtwo perguntou o que era e ninguém respondeu.'},
  escolhas:[
    {texto:'Levar o caderno.', vai:'c14_saida_lab', ef:{flag:'pegou_caderno'}},
    {texto:'Deixar o caderno onde estava.', vai:'c14_saida_lab'},
    {texto:'Queimar o resto. Ninguém mais precisa ler isso.', vai:'c14_queimou',
     ef:{flag:'queimou_caderno', rep:{eixo:'ruim',delta:1,motivo:'Destruiu a única prova do que fizeram em Cinnabar'}}}
  ]
},

c14_queimou:{
  texto:[
    'Você queima. A capa dura demora e fede.',
    'No meio do fogo, você percebe uma coisa: sem esse caderno, o que fizeram com ele nunca aconteceu oficialmente.',
    'Você acabou de apagar a única vez que alguém escreveu "ele pediu para sair".'
  ],
  ef:{instabilidade:1},
  escolhas:[{texto:'Sair do laboratório.', vai:'c14_saida_lab'}]
},

c14_saida_lab:{
  texto:[
    'Ao sair, você percebe que a fumaça do vulcão está mais densa do que quando você chegou.',
    'E vermelha. Fumaça não é vermelha.'
  ],
  escolhas:[{texto:'Subir o vulcão.', vai:'c14_vulcao'}]
},

c14_vulcao:{
  texto:[
    'A subida leva quase quatro horas. O chão fica quente através da sola do sapato no último terço.',
    'Na cratera, o calor deforma o ar e faz tudo tremer.',
    'E tem alguma coisa pousada na borda do outro lado — grande, parada, com o corpo inteiro parecendo brasa que não apaga.',
    'Moltres. Solto por Red há dois anos e nunca mais visto por ninguém que soubesse contar direito.',
    'Ele já estava olhando pra você antes de você chegar.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(146); L.encontros++; return [{tipo:'mundo',texto:'Moltres, uma das três Aves Lendárias de Kanto. Solto por Red. Nunca capturado desde então.'}]; },
      registrar:'Encontrou Moltres na cratera do vulcão de Cinnabar.'},
  escolhas:[
    {texto:'Ficar parado. Só olhar.', vai:'c14_olhar'},
    {texto:'Oferecer comida e recuar devagar.', vai:'c14_comida', cond:d=>Estado.contaItem('Ração')>0},
    {texto:'Atacar. Uma chance dessas não se repete.', vai:'c14_luta_moltres'},
    {texto:'Descer o vulcão sem fazer nada.', vai:'c14_desceu'}
  ]
},

c14_olhar:{
  texto:[
    'Você fica parado onze minutos. Ele fica parado onze minutos.',
    'Em algum momento você para de achar que está sendo avaliado e começa a achar que está sendo lembrado — como se ele estivesse arquivando o seu rosto pra usar depois.',
    'Depois ele abre as asas, e o calor que sai disso derruba você de joelhos, e quando você levanta a cratera está vazia.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(146); L.disposicao='neutro'; return []; },
      rep:{eixo:'bom',delta:1,motivo:'Encontrou um lendário e não tentou pegá-lo'},
      flag:'respeitou_moltres'},
  escolhas:[{texto:'Descer.', vai:'c14_fim'}]
},

c14_comida:{
  texto:[
    'Você abre o pacote de ração, coloca na pedra, e anda pra trás sem virar as costas.',
    'É um gesto ridículo. Você está oferecendo comida de loja a uma coisa que existe desde antes das cidades.',
    'Ele desce. Olha a ração. Olha você. E come — não porque precisa, mas porque entendeu o que o gesto queria dizer.',
    'Quando ele levanta voo, o rastro de calor passa a dois metros de você e não te queima. Isso foi escolha dele.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Ração'); const L=Estado.lend(146); L.disposicao='passivo'; return [{tipo:'mundo',texto:'Moltres agora te vê como não-ameaça. Isso tem valor.'}]; },
      rep:{eixo:'bom',delta:2,motivo:'Tratou bem uma Ave Lendária'},
      flag:'moltres_amigo', registrar:'Moltres aceitou comida de você e ficou passivo.'},
  escolhas:[{texto:'Descer.', vai:'c14_fim'}]
},

c14_luta_moltres:{
  texto:[
    'Você joga a primeira bola sem nem tentar enfraquecer.',
    'A bola derrete no ar antes de chegar. Literalmente derrete.',
    'Moltres desce da borda e a cratera inteira fica dez graus mais quente.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(146); L.ataquesSofridos++; return []; }},
  batalha:{dex:146, nivel:50, tipo:'lendario', fuga:true, ambiente:'vulcao',
           vitoria:'c14_pos_moltres', derrota:'c14_pos_moltres', fuga2:'c14_pos_moltres',
           captura:'c14_capturou_moltres', gameover:'gameover'}
},

c14_pos_moltres:{
  texto:[
    'Acabe como acabar, uma coisa fica: ele viu seu rosto enquanto você tentava.',
    'Aves lendárias não esquecem rosto. Foi por isso que Red soltou as três.'
  ],
  ef:{executar:d=>{
        const L = Estado.lend(146);
        if (L.ataquesSofridos >= 2){ L.disposicao='hostil'; return [{tipo:'perigo', texto:'Moltres agora é hostil a você. Ele vai te procurar.'}]; }
        return [{tipo:'mundo', texto:'Moltres foi embora. Desconfiado.'}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou uma Ave Lendária'}},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c14_luta_moltres'},
    {texto:'Descer o vulcão.', vai:'c14_fim'}
  ]
},

c14_capturou_moltres:{
  texto:[
    'A bola fecha. O vulcão fica em silêncio de um jeito que vulcão não fica.',
    'Você segura na mão uma coisa que existia antes de Kanto ter nome.',
    'A trezentos quilômetros daqui, no norte, uma tempestade que não estava no mapa começa a se formar. E numa caverna de gelo, outra coisa abre os olhos.'
  ],
  ef:{registrar:'Capturou Moltres na cratera de Cinnabar.'},
  escolhas:[
    {texto:'Soltar. Agora, antes de descer.', vai:'c14_soltou_moltres'},
    {texto:'Descer com ele.', vai:'c14_fim', ef:{flag:'desceu_com_moltres'}}
  ]
},

c14_soltou_moltres:{
  texto:['Você abre a bola na mesma pedra onde ele estava.'],
  ef:{executar:d=>{
        const p = [...d.time, ...d.pc].find(x=>x.dex===146);
        if (p) return Captura.soltar(p).map(e=>({tipo:e.tipo, texto:e.texto}));
        return [];
      }},
  escolhas:[{texto:'Descer.', vai:'c14_fim'}]
},

c14_desceu:{
  texto:[
    'Você desce sem olhar pra trás. Leva três horas e quarenta, e nas três horas e quarenta você pensa na mesma coisa.',
    'Você não sabe se o que sentiu foi respeito ou covardia, e provavelmente nunca vai saber, porque as duas coisas parecem exatamente iguais de dentro.'
  ],
  ef:{flag:'evitou_moltres'},
  escolhas:[{texto:'Voltar para o porto.', vai:'c14_fim'}]
},

c14_fim:{
  texto:[
    'No porto, o barco da noite está atrasado e tem um homem de terno sentado no banco de espera. Só ele, e você, e o mar.',
    'Ele não olha pra você quando fala.',
    d=>{
      if (Estado.lendariosCapturados().length) return '"A Liga Pokémon gostaria de conversar. Não hoje." Ele levanta quando o barco chega. "Só queria que você soubesse que a gente sabe."';
      if (d.flags.pegou_caderno) return '"Esse caderno não é seu." Ele levanta quando o barco chega. "Mas também não é meu. Boa leitura."';
      return '"Você subiu o vulcão." Ele levanta quando o barco chega. "Pouca gente sobe o vulcão e desce igual."';
    },
    'Ele embarca primeiro. No barco inteiro, ele não senta perto de você nenhuma vez.'
  ],
  fim:true, resumo:'Capítulo 14 concluído — você leu o que ninguém devia ter escrito.'
}
}}

);
