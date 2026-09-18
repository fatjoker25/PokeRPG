/* ============================================================
   CAPÍTULO 22 — O vale
   ============================================================ */
CAPITULOS.push(

{
num:22, titulo:'O Vale', local:'Norte de Kanto, acima da Rota 10', ambiente:'montanha', nivelArea:58,
tom:'muito sombrio', inicio:'c22_subida',
cenas:{

c22_subida:{
  texto:[
    'O norte de Kanto, acima da Rota 10, é uma região que os mapas resolvem com a palavra "acidentado".',
    'Você anda dois dias.',
    d=>{
      const inst = d.mundo.instabilidade;
      if (inst >= 7) return 'No segundo dia, chove pra cima. Isso não é figura de linguagem: a chuva sobe por uns quatro segundos e depois desce de novo, e ninguém nunca mais vai acreditar em você.';
      if (inst >= 4) return 'No segundo dia, a temperatura oscila doze graus em vinte minutos, duas vezes. Os Pokémon da rota estão todos parados, virados pra mesma direção.';
      if (inst >= 1) return 'No segundo dia, o vento fica errado: constante, sem rajada, sempre do mesmo lado. Vento não faz isso.';
      return 'Nada de anormal. Só frio, pedra, e o barulho do vento.';
    },
    d=>{
      if (d.flags.deixou_o_mapa) return 'Você não tem o mapa. Está indo pela lembrança das coordenadas que leu de cabeça pra baixo em cima de uma mesa.';
      if (d.jogador.cargo) return `Você está subindo como ${d.jogador.cargo}, o que não ajuda em nada aqui em cima.`;
      return 'O mapa da Liga marca um ponto e não marca mais nada em volta dele por quinze quilômetros.';
    }
  ],
  ef:{registrar:'Subiu ao norte de Kanto.'},
  escolhas:[
    {texto:'Continuar.', vai:'c22_terceira_equipe'},
    {texto:'Acampar e observar antes.', vai:'c22_acampou'}
  ]
},

c22_acampou:{
  texto:[
    'Você acampa num ponto alto e passa a noite acordado olhando o vale a dois quilômetros.',
    'Às 2h da manhã, uma luz azul acende no fundo do vale e apaga. Uma vez só.',
    'Às 4h40, alguma coisa cruza o céu acima do vale — grande, rápida, e reta demais pra ser pássaro comum.',
    'De manhã, você desce sabendo duas coisas a mais e com quatro horas a menos de sono.'
  ],
  ef:{flag:'observou_o_vale', rep:{eixo:'bom',delta:0,motivo:''},
      hp:-2, causa:'Noite em claro no norte'},
  escolhas:[{texto:'Descer.', vai:'c22_terceira_equipe'}]
},

c22_terceira_equipe:{
  texto:[
    'A cerca de um quilômetro do vale você acha o acampamento da terceira equipe.',
    'Está montado. Barracas de pé, fogareiro, equipamento. Nada revirado, nada quebrado, nada saqueado.',
    'Tem café numa térmica que ainda está morna.',
    'Não tem ninguém.',
    'Num caderno em cima da mesa dobrável, a última anotação, feita com letra tranquila:',
    '"Dia 4. Ele nos deixou entrar. Vamos descer amanhã. O R. quer voltar e avisar; nós três queremos descer. Decidimos no par ou ímpar. Ganhou descer."'
  ],
  ef:{flag:'achou_o_acampamento',
      registrar:'Encontrou o acampamento intacto da terceira equipe. Ninguém.'},
  escolhas:[
    {texto:'Pegar o caderno.', vai:'c22_pegou_caderno_equipe', ef:{flag:'caderno_da_equipe'}},
    {texto:'Procurar a equipe.', vai:'c22_procurou_equipe'},
    {texto:'Ir direto ao vale.', vai:'c22_encontro'}
  ]
},

c22_pegou_caderno_equipe:{
  texto:[
    'Você folheia pra trás.',
    '"Dia 1. Chegamos. O vale tem dois guardas. Não são hostis. Não nos impedem."',
    '"Dia 2. Eles não estão impedindo a gente de entrar. Eles estão impedindo alguma coisa de sair. Isso muda o cálculo inteiro."',
    '"Dia 3. Ouvimos uma voz. Não com o ouvido. Ela perguntou o que a gente queria e ninguém soube responder e ela não insistiu."',
    '"Dia 4. Ele nos deixou entrar."',
    'Depois disso são páginas em branco.'
  ],
  ef:{flag:'leu_caderno_equipe',
      registrar:'A terceira equipe foi convidada a entrar. Ninguém voltou.'},
  escolhas:[
    {texto:'Procurar eles.', vai:'c22_procurou_equipe'},
    {texto:'Ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_procurou_equipe:{
  texto:['Você procura em volta do acampamento por três horas.'],
  teste:{status:'percepcao', dificuldade:8, nomeStatus:'Percepção',
         critico:'c22_achou_equipe', sucesso:'c22_achou_equipe', parcial:'c22_achou_pegadas', falha:'c22_nao_achou'}
},

c22_achou_equipe:{
  texto:[
    'Você acha os três. Vivos.',
    'Estão sentados numa depressão de pedra a quatrocentos metros do acampamento, os três, virados pro vale.',
    'Eles te veem chegar e não reagem muito. Um deles acena devagar.',
    '"Já faz quanto tempo?" pergunta uma mulher de uns trinta.',
    '"Que vocês estão aqui? Não sei. Uma semana?"',
    'Ela assente. "É. Parecia menos."',
    'Eles não estão feridos, não estão drogados e não estão presos. Eles estão esperando, e não sabem dizer o quê, e quando você pergunta eles ficam sinceramente confusos com a pergunta.'
  ],
  ef:{flag:'achou_a_equipe',
      rep:{eixo:'bom',delta:2,motivo:'Encontrou a terceira equipe viva'},
      registrar:'Encontrou os três da terceira equipe, vivos, sentados olhando o vale há uma semana.'},
  escolhas:[
    {texto:'Tirar eles dali à força.', vai:'c22_tirou_equipe'},
    {texto:'Perguntar o que eles ouviram.', vai:'c22_o_que_ouviram'},
    {texto:'Deixar eles e ir ao vale.', vai:'c22_encontro'}
  ]
},

c22_o_que_ouviram:{
  texto:[
    'Os três respondem ao mesmo tempo e dizem a mesma coisa com palavras diferentes:',
    '"Ele perguntou o que a gente queria."',
    '"E vocês responderam o quê?"',
    'Silêncio longo. A mulher de trinta finalmente fala:',
    '"A gente respondeu com o objetivo da missão. \'Avaliação de risco\'." Ela ri sem alegria. "A gente respondeu com o formulário."',
    '"E ele?"',
    '"Ele parou de falar com a gente. Faz cinco dias."',
    'Ela olha pro vale. "A gente tá esperando ele perguntar de novo. Pra responder direito."'
  ],
  ef:{flag:'sabe_da_pergunta',
      registrar:'Mewtwo perguntou à equipe o que eles queriam. Eles responderam com o formulário.'},
  escolhas:[
    {texto:'Tirar eles dali à força.', vai:'c22_tirou_equipe'},
    {texto:'"Eu vou responder por vocês."', vai:'c22_encontro',
     ef:{flag:'vai_responder', rep:{eixo:'bom',delta:1,motivo:'Assumiu responder o que três adultos não conseguiram'}}}
  ]
},

c22_tirou_equipe:{
  texto:[
    'Você levanta os três pelo braço, um por um. Eles não resistem — vão, com a mesma docilidade com que estavam sentados.',
    'A duzentos metros do acampamento, um deles para de repente e olha pra trás.',
    '"Espera." A voz dele muda completamente. "Espera, o que —"',
    'E aí eles todos acordam, ao mesmo tempo, e o pânico chega de uma vez em três pessoas adultas.',
    'Vocês levam quatro horas pra descer até o posto da Rota 10. Nenhum dos três fala nada no caminho.'
  ],
  ef:{flag:'salvou_a_equipe',
      rep:{eixo:'bom',delta:3,motivo:'Tirou três pessoas do vale antes que fosse tarde'},
      hp:-3, causa:'Descida forçada carregando gente',
      registrar:'Tirou a terceira equipe do vale. Eles acordaram a 200 metros.'},
  escolhas:[{texto:'Voltar sozinho ao vale.', vai:'c22_encontro'}]
},

c22_achou_pegadas:{
  texto:[
    'Você acha pegadas. Três pares, indo na direção do vale, sem nenhum par voltando.',
    'As pegadas são regulares, com passada normal. Ninguém correu, ninguém foi arrastado.',
    'Eles foram andando.'
  ],
  ef:{flag:'achou_pegadas'},
  escolhas:[{texto:'Seguir as pegadas.', vai:'c22_encontro'}]
},

c22_nao_achou:{
  texto:[
    'Três horas e nada.',
    'Você volta ao acampamento e a térmica de café esfriou. Isso, por algum motivo, é a coisa mais triste do dia.'
  ],
  escolhas:[{texto:'Ir ao vale.', vai:'c22_encontro'}]
},

c22_encontro:{
  texto:[
    'O vale fica entre duas paredes de pedra e não tem saída no fundo.',
    'E tem coisa demais aqui.',
    d=>{
      const a=Estado.dados.lendarios[144], z=Estado.dados.lendarios[145];
      const artPreso = a && a.estado==='capturado', zapPreso = z && z.estado==='capturado';
      if (artPreso && zapPreso) return 'Ou tinha. Os dois postos estão vazios, porque os dois guardas estão no seu cinto. A entrada da caverna, no fundo do vale, está completamente desguardada.';
      if (artPreso) return 'Zapdos está pousado numa pedra alta, sozinho, com o ar em volta zumbindo. O outro posto — o do fundo do vale — está vazio, porque quem devia estar nele está no seu cinto.';
      if (zapPreso) return 'Articuno está no fundo do vale, imóvel, e o chão embaixo dele está branco de gelo. O posto alto está vazio, porque quem devia estar nele está no seu cinto.';
      return 'Zapdos, pousado numa pedra alta, com o ar em volta zumbindo. Articuno, no fundo do vale, imóvel, com o chão branco de gelo embaixo.';
    },
    'Aves Lendárias não dividem território. Nunca dividiram, em nenhum registro.',
    'Eles não estão olhando um pro outro. Estão olhando pra mesma coisa: uma abertura na parede de pedra, no fundo do vale.',
    'Eles não estão caçando. Estão montando guarda.'
  ],
  ef:{executar:d=>{ Estado.lend(144).encontros++; Estado.lend(145).encontros++;
        return [{tipo:'mundo', texto:'Articuno e Zapdos, juntos, guardando a entrada de uma caverna.'}]; },
      flag:'viu_guarda_aves', registrar:'As duas aves guardam a entrada da caverna do norte.'},
  escolhas:[
    {texto:'Passar entre eles, devagar, sem tocar em bola nenhuma.', vai:'c22_passou'},
    {texto:'Soltar as aves que você tem, aqui, nos postos delas.', vai:'c22_recolocou',
     cond:d=>Estado.lendariosCapturados().some(l=>GRUPO_AVES.includes(l.dex))},
    {texto:'Tentar capturar Zapdos.', vai:'c22_luta_zapdos',
     cond:d=>!(Estado.dados.lendarios[145]&&Estado.dados.lendarios[145].estado==='capturado')},
    {texto:'Tentar capturar Articuno.', vai:'c22_luta_articuno',
     cond:d=>!(Estado.dados.lendarios[144]&&Estado.dados.lendarios[144].estado==='capturado')},
    {texto:'Voltar. Isso é maior do que você.', vai:'c22_voltou'}
  ]
},

c22_passou:{
  texto:[
    'Você anda pelo meio do vale.',
    'Os dois te acompanham com a cabeça, sem sair do lugar. Você passa a doze metros do Articuno e o frio atravessa o casaco como se o casaco não existisse.',
    d=>{
      if (d.flags.salvou_o_filhote) return 'E Articuno — que te reconhece das Seafoam — abaixa a cabeça um centímetro quando você passa. Um centímetro. É a maior honra da sua vida.';
      if (d.flags.respeitou_zapdos||d.flags.zapdos_desceu) return 'E Zapdos, na pedra alta, para de zumbir enquanto você atravessa. Só enquanto você atravessa.';
      return 'Nenhum dos dois te impede.';
    },
    'E é aí que você entende a parte ruim: eles não estão te impedindo de entrar.',
    'Eles estão impedindo alguma coisa de sair.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Passou entre dois lendários sem tentar capturá-los'},
      flag:'passou_pelas_aves',
      executar:d=>{ [144,145].forEach(x=>{const L=Estado.lend(x); if(L.disposicao!=='hostil') L.disposicao='passivo';}); return []; }},
  escolhas:[{texto:'Entrar na caverna.', vai:'c22_fim'}]
},

c22_recolocou:{
  texto:[
    'Você abre a bola — ou as bolas — apontando pras pedras onde eles deviam estar.',
    'Eles saem e não hesitam nem um segundo: voam direto pro posto, assumem a posição e voltam a olhar a caverna.',
    'Nenhum olha pra você. Nenhum agradece. Eles tinham um trabalho e voltaram pra ele.',
    'O outro — o que nunca saiu do lugar — solta um som curto. Não é saudação. É conferência de efetivo.'
  ],
  ef:{executar:d=>{
        const avisos=[];
        [...d.time,...d.pc].filter(p=>GRUPO_AVES.includes(p.dex)).forEach(p=>{
          Captura.soltar(p).forEach(e=>avisos.push({tipo:e.tipo,texto:e.texto}));
        });
        Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade-3);
        return avisos;
      },
      rep:{eixo:'bom',delta:3,motivo:'Recolocou os guardas no posto antes de descer'},
      flag:'recolocou_guarda'},
  escolhas:[{texto:'Entrar na caverna.', vai:'c22_fim'}]
},

c22_luta_zapdos:{
  texto:['Você tira a bola do cinto e o vale inteiro fica com cheiro de metal quente antes de você jogar.'],
  ef:{executar:d=>{ Estado.lend(145).ataquesSofridos++; return []; }},
  batalha:{dex:145, nivel:56, tipo:'lendario', fuga:true, ambiente:'montanha',
           vitoria:'c22_pos_ave', derrota:'c22_pos_ave', fuga2:'c22_pos_ave', captura:'c22_capturou_ave', gameover:'gameover'}
},

c22_luta_articuno:{
  texto:['O ar em volta dele é vinte graus mais frio. Você joga a bola e vê ela congelar no meio do arco.'],
  ef:{executar:d=>{ Estado.lend(144).ataquesSofridos++; return []; }},
  batalha:{dex:144, nivel:56, tipo:'lendario', fuga:true, ambiente:'montanha',
           vitoria:'c22_pos_ave', derrota:'c22_pos_ave', fuga2:'c22_pos_ave', captura:'c22_capturou_ave', gameover:'gameover'}
},

c22_pos_ave:{
  texto:[
    'Quando acaba, os dois estão olhando pra você em vez da caverna.',
    'Pela primeira vez desde que você chegou, eles pararam de montar guarda.',
    'Isso dura quatro segundos. Depois voltam a olhar a caverna.',
    'E os quatro segundos ficam na sua cabeça por muito tempo, porque nesses quatro segundos alguma coisa podia ter saído.'
  ],
  ef:{rep:{eixo:'ruim',delta:2,motivo:'Atacou os guardiões que protegiam a entrada'}, instabilidade:1},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c22_luta_zapdos'},
    {texto:'Parar. Entrar na caverna.', vai:'c22_fim'}
  ]
},

c22_capturou_ave:{
  texto:[
    'A bola fecha.',
    'E o outro — o que sobrou — solta um som que não é de ataque. É de alarme.',
    'Ele abandona o posto e vem na sua direção, e você percebe tarde demais que tirou um dos dois guardas de uma porta que precisava de dois.',
    'Dentro da caverna, muito fundo, alguma coisa se mexe pela primeira vez em muito tempo.'
  ],
  ef:{instabilidade:3, flag:'quebrou_a_guarda',
      registrar:'Capturou uma das aves da guarda. A porta ficou com um guarda só.'},
  escolhas:[
    {texto:'Soltar imediatamente. Recolocar o guarda no posto.', vai:'c22_recolocou'},
    {texto:'Ficar com ele e entrar na caverna.', vai:'c22_fim', ef:{flag:'entrou_com_ave'}}
  ]
},

c22_voltou:{
  texto:[
    'Você volta. Dois dias de caminhada no sentido contrário, com o vale nas costas o tempo todo.',
    'Em Saffron, você tenta explicar pra alguém da Liga o que viu. Eles anotam. Agradecem.',
    'Onze dias depois, os jornais publicam que a temperatura na Rota 10 caiu sozinha, que houve relato de descarga elétrica sem tempestade, e que uma equipe de campo não retornou.',
    'Você vai ter que voltar lá. Todo mundo sabe disso, principalmente você.'
  ],
  ef:{instabilidade:2, flag:'adiou_o_norte',
      rep:{eixo:'ruim',delta:1,motivo:'Recuou quando era a única pessoa no lugar certo'}},
  escolhas:[{texto:'Voltar ao vale. Dessa vez até o fim.', vai:'c22_fim'}]
},

c22_fim:{
  texto:[
    'A boca da caverna é mais alta que uma casa e o ar que sai dela é morno, o que está errado pra essa altitude e pra esse frio.',
    'Lá dentro, a passagem desce. Muito.',
    'As paredes são lisas demais pra serem naturais — não foram cavadas, foram derretidas e esfriadas.',
    d=>{
      if (d.flags.leu_caderno) return '"Dia 241. Ele pediu para sair. Usou a palavra por favor." Você lembra disso agora, e devia ter lembrado antes.';
      if (d.flags.viu_os_doze) return 'Você pensa nos onze tanques do andar 11 e no décimo segundo, vazio, com a placa "MATRIZ".';
      if (d.flags.sabe_da_pergunta) return 'Três adultos ficaram uma semana sentados numa pedra esperando uma segunda chance de responder uma pergunta. Você vai ter a primeira.';
      return 'Alguém morou aqui. Alguém mora aqui.';
    },
    'Você não precisa de mais nenhuma pista pra saber o que tem no fim dessa descida.'
  ],
  fim:true, resumo:'Capítulo 22 concluído — você chegou onde só cabe ir sozinho.'
}
}}

);
