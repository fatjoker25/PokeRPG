/* ============================================================
   CAPÍTULO 21 — O que te oferecem (Liga)
   ============================================================ */
CAPITULOS.push(

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 18 — O QUE TE OFERECEM
   ══════════════════════════════════════════════════════════ */
{
num:21, titulo:'O Que Te Oferecem', local:'Planalto Indigo', ambiente:'montanha', nivelArea:56,
tom:'muito sombrio', inicio:'c21_chegada',
cenas:{

c21_chegada:{
  texto:[
    'O Planalto Indigo é um complexo de pedra e vidro no alto de uma montanha e foi construído pra intimidar.',
    'Funciona.',
    d=>{
      const r = Estado.nomeRep();
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=7) return `Tem gente esperando na entrada. Não seguranças — gente. Um grupo de treinadores jovens que ficou sabendo que você vinha hoje. Um deles pede autógrafo no caderno e você não sabe o que fazer com as mãos. "${r}", alguém diz. E é sobre você.`;
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=5) return 'A recepcionista diz o seu nome antes de você falar. Isso é novo e não é confortável.';
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=6) return 'Tem dois oficiais na entrada que não estavam ali dez minutos atrás. Eles não te abordam. Eles te acompanham a dez metros pelo saguão inteiro.';
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=4) return 'A recepcionista digita seu nome, lê alguma coisa na tela, e o sorriso dela muda de categoria.';
      return 'Ninguém te reconhece. Você é só mais um com envelope na mão.';
    },
    'A sala é a mesma de sempre nesses lugares: mesa comprida, quatro cadeiras, três ocupadas.',
    'E, em cima da mesa, uma pasta com o seu nome.'
  ],
  ef:{registrar:'Chegou ao Planalto Indigo.'},
  escolhas:[{texto:'Sentar.', vai:'c21_pasta'}]
},

c21_pasta:{
  texto:[
    'A mulher no centro abre a pasta e não lê — ela já leu.',
    d=>{
      const d2=Estado.dados;
      const linhas=[];
      if (d2.insignias.length) linhas.push(`${d2.insignias.length} insígnia(s)`);
      if (d2.cemiterio.length) linhas.push(`${d2.cemiterio.length} morte(s) registrada(s) sob sua responsabilidade`);
      const presos = Estado.lendariosCapturados();
      if (presos.length) linhas.push(`${presos.length} lendário(s) em sua posse`);
      if (d2.liga.avisos) linhas.push(`${d2.liga.avisos} ocorrência(s) no nosso sistema`);
      return linhas.length ? `"Vamos ao que consta: ${linhas.join(', ')}."` : '"Consta muito pouco aqui. Isso é raro em alguém que andou tanto."';
    },
    d=>{
      const via = Historia.via();
      if (via==='foragido') return '"E consta que existe uma operação de distribuição em Celadon que mudou de dono recentemente." Ela fecha a pasta. "Nós não temos prova. Nós temos certeza. As duas coisas são diferentes e só uma delas serve pra processo."';
      if (via==='mercenario') return '"E consta que o seu nome aparece em três manifestos de carga que não deviam existir." Ela fecha a pasta. "Nós não vamos usar isso hoje."';
      if (via==='pesquisador') return '"E consta que metade do material que a Dra. Ivone protocolou nos últimos meses passou pelas suas mãos primeiro." Ela fecha a pasta. "Isso é útil. Útil é uma palavra perigosa aqui."';
      if (via==='heroi') return '"E consta uma lista de lugares em que você apareceu logo antes de alguma coisa parar de funcionar." Ela fecha a pasta. "Sempre coisas que a gente queria que parassem de funcionar, e sempre sem mandado."';
      return '"E consta que você foi a muito lugar e não pediu nada a ninguém." Ela fecha a pasta.';
    },
    '"Eu vou te fazer três perguntas. Não são pegadinha."'
  ],
  escolhas:[{texto:'"Pode perguntar."', vai:'c21_pergunta1'}]
},

c21_pergunta1:{
  texto:[
    '"Primeira: por que você saiu de casa?"'
  ],
  escolhas:[
    {texto:d=>`"${d.jogador.objetivo}"`, vai:'c21_pergunta2', ef:{flag:'respondeu_objetivo'}},
    {texto:'"Eu já não lembro mais."', vai:'c21_pergunta2',
     ef:{flag:'esqueceu_objetivo', rep:{eixo:'bom',delta:1,motivo:'Foi honesto sobre ter perdido o rumo'}}},
    {texto:'"Não é da sua conta."', vai:'c21_pergunta2', ef:{flag:'recusou_pergunta1'}}
  ]
},

c21_pergunta2:{
  texto:[
    '"Segunda: de tudo que você fez, o que você refaria diferente?"',
    d=>{
      const d2=Estado.dados;
      if (d2.cemiterio.length) return `Ela não desvia o olhar. Você pensa em ${nomeExib(d2.cemiterio[0])} antes de conseguir pensar em qualquer outra coisa.`;
      if (d2.flags.incendiou_deposito) return 'Você pensa nos seis que não conseguiam andar.';
      if (d2.flags.destruiu_o_11) return 'Você pensa em onze coisas em tanques e no fato de que você não perguntou nada a nenhuma delas.';
      if (d2.flags.ignorou_marta) return 'Você pensa numa mulher sentada na beira de um rio.';
      return 'Você leva mais tempo do que gostaria pra achar uma resposta.';
    }
  ],
  escolhas:[
    {texto:'Responder com a verdade, seja qual for.', vai:'c21_pergunta3',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Assumiu o próprio erro diante da Liga'}, flag:'assumiu_erro'}},
    {texto:'"Nada."', vai:'c21_pergunta3',
     ef:{flag:'nao_refaria_nada', rep:{eixo:'ruim',delta:1,motivo:'Disse à Liga que não refaria nada'}}},
    {texto:'"Eu teria feito mais cedo."', vai:'c21_pergunta3', ef:{flag:'faria_mais_cedo'}}
  ]
},

c21_pergunta3:{
  texto:[
    '"Terceira." Ela junta as mãos. "Existe alguma coisa em Kanto que só você pode resolver?"',
    'A pergunta parece vaidosa até você perceber que não é: eles já sabem a resposta e querem ver se você sabe.'
  ],
  escolhas:[
    {texto:'"Tem uma coisa no norte."', vai:'c21_ofertas', cond:d=>!!d.flags.sabe_do_norte||true,
     ef:{flag:'falou_do_norte'}},
    {texto:'"Não. Ninguém é insubstituível."', vai:'c21_ofertas', ef:{flag:'modestia'}},
    {texto:'"Tem. Eu."', vai:'c21_ofertas', ef:{flag:'arrogancia', rep:{eixo:'ruim',delta:1,motivo:'Se declarou insubstituível diante da Liga'}}}
  ]
},

c21_ofertas:{
  texto:[
    'Eles se olham. A conversa entre os três acontece sem palavra nenhuma e dura quatro segundos.',
    '"Certo." Ela desliza três folhas pela mesa. "Todas são reais. Nenhuma expira hoje."',
    d=>{
      const via=Historia.via(); const rep=Estado.rep;
      if (rep.eixo==='bom' && rep.bom>=6) return '"A primeira é uma cadeira na Elite 4. A segunda é a diretoria de fiscalização da Liga. A terceira é o que a gente realmente precisa, e é a pior das três."';
      if (rep.eixo==='ruim' && rep.ruim>=5) return '"A primeira é um acordo: você para, a gente arquiva. A segunda é trabalhar pra nós fazendo o que você já faz, só que com cobertura. A terceira é o que a gente realmente precisa, e ela não te inocenta de nada."';
      if (via==='pesquisador') return '"A primeira é um cargo de pesquisa com verba. A segunda é testemunhar no processo que a Dra. Ivone está montando. A terceira é o que a gente realmente precisa."';
      return '"A primeira é um cargo de instrutor aqui no Planalto. A segunda é um contrato de campo. A terceira é o que a gente realmente precisa."';
    },
    '"A terceira é o norte."'
  ],
  escolhas:[
    {texto:'Aceitar o cargo formal da Liga.', vai:'c21_cargo'},
    {texto:'Aceitar o contrato de campo.', vai:'c21_contrato'},
    {texto:'"Me fala do norte."', vai:'c21_norte_conversa'},
    {texto:'Recusar as três e enfrentar a Elite 4.', vai:'c21_desafio_elite'}
  ]
},

c21_cargo:{
  texto:[
    'Você assina.',
    'O cargo vem com sala, salário, crachá e uma frase que ela diz na saída, sem maldade nenhuma:',
    '"Você vai descobrir em uns seis meses que um cargo aqui dentro resolve menos do que você resolvia sozinho lá fora."',
    '"Por que você está me contratando, então?"',
    '"Porque o que você resolvia sozinho lá fora não escalava, e o que a gente faz aqui dentro escala mal, e a gente não achou nada melhor que isso ainda."'
  ],
  ef:{flag:'aceitou_cargo_liga',
      executar:d=>{ d.jogador.cargo = Estado.rep.eixo==='bom'&&Estado.rep.bom>=6 ? 'Elite 4' : 'Diretoria de Fiscalização da Liga';
        return [{tipo:'insignia', texto:`Cargo assumido: ${d.jogador.cargo}.`}]; },
      rep:{eixo:'bom',delta:2,motivo:'Assumiu um cargo formal na Liga Pokémon'},
      dinheiro:30000,
      registrar:'Aceitou um cargo formal na Liga Pokémon.'},
  escolhas:[{texto:'"E o norte?"', vai:'c21_norte_conversa'}]
},

c21_contrato:{
  texto:[
    'Você assina o contrato de campo.',
    'Ele te dá cobertura jurídica, acesso a informação da Liga e nenhuma autoridade formal.',
    '"É o pior dos dois mundos", ela admite, deslizando a cópia pra você. "Você continua fazendo tudo sozinho, só que agora com processo interno se fizer errado."',
    '"Por que alguém assinaria isso?"',
    '"Porque assinou." Ela guarda a via dela.'
  ],
  ef:{flag:'contrato_de_campo',
      executar:d=>{ d.jogador.cargo='Agente de campo da Liga'; return []; },
      itens:{'Ultra Ball':4,'Hyper Potion':4,'Full Heal':3}, dinheiro:12000,
      rep:{eixo:'bom',delta:1,motivo:'Assinou contrato de campo com a Liga'},
      registrar:'Assinou contrato de campo com a Liga.'},
  escolhas:[{texto:'"Agora o norte."', vai:'c21_norte_conversa'}]
},

c21_desafio_elite:{
  texto:[
    '"Eu não vim pra ser contratado."',
    'Ela ri — a primeira reação humana da reunião inteira. "Ótimo. Também tem isso."',
    'A arena da Elite 4 fica dois andares abaixo e é um poço de pedra com iluminação vinda de cima.',
    'Não tem plateia. Nunca teve. É outra coisa que os jogos não contam.'
  ],
  batalha:{dex:65, nivel:58, tipo:'treinador', treinador:'Elite 4', fuga:false,
           timeExtra:[{dex:94, nivel:59},{dex:149, nivel:62}],
           vitoria:'c21_venceu_elite', derrota:'c21_perdeu_elite', gameover:'gameover'}
},

c21_venceu_elite:{
  texto:[
    'Você vence três times seguidos de Elite 4 num poço de pedra sem plateia nenhuma.',
    'Não tem confete, não tem hino, não tem foto.',
    'Tem um homem de sessenta anos sentado na borda do poço que desce e aperta a sua mão com as duas dele.',
    '"Muita gente chega aqui", ele diz. "Quase ninguém chega aqui com o time inteiro de pé e sem ter comprado nenhum deles."',
    d=>d.cemiterio.length ? `Ele olha a lista que trouxe. "Você perdeu ${d.cemiterio.length}. Isso conta. Vai contar pra você por muito tempo, e é bom que conte."` : 'Ele olha a lista que trouxe. "E você não perdeu nenhum. Isso é mais raro que vencer."'
  ],
  ef:{flag:'venceu_a_elite',
      executar:d=>{ d.jogador.cargo='Campeão de Kanto'; return [{tipo:'insignia', texto:'Você é Campeão de Kanto.'}]; },
      rep:{eixo:'bom',delta:3,motivo:'Venceu a Elite 4 do Planalto Indigo'},
      insignia:'Campeão de Kanto', dinheiro:50000,
      curaTime:true,
      registrar:'Venceu a Elite 4 e tornou-se Campeão de Kanto.'},
  escolhas:[{texto:'"E o norte?"', vai:'c21_norte_conversa'}]
},

c21_perdeu_elite:{
  texto:[
    'Você perde. Não tem vergonha nisso — perder aqui é o resultado padrão.',
    'Eles curam o seu time, te dão água e te deixam sentar na borda do poço o tempo que você precisar.',
    '"Volta", diz o de sessenta anos. "Eu perdi quatro vezes antes de sentar desse lado."'
  ],
  ef:{curaTime:true, flag:'perdeu_a_elite', itens:{'Hyper Potion':3}},
  escolhas:[
    {texto:'Treinar e tentar de novo.', vai:'c21_desafio_elite',
     ef:{executar:d=>{ d.time.forEach(p=>ganharExp(p, 1800)); return [{tipo:'info', texto:'Você treina por semanas no Planalto. O time sobe.'}]; }}},
    {texto:'"Deixa a Elite pra lá. Me fala do norte."', vai:'c21_norte_conversa'}
  ]
},

c21_norte_conversa:{
  texto:[
    'A sala fica diferente quando o assunto muda. Todo mundo senta um pouco mais reto.',
    '"Acima da Rota 10 tem um vale entre duas paredes de pedra. Nós mandamos três equipes."',
    '"Duas voltaram e não conseguem descrever o que viram. Não é trauma — elas tentam descrever e as frases não fecham."',
    '"A terceira voltou com uma pessoa a menos."',
    'Ela desliza uma fotografia. Borrada, noturna, tirada de longe: uma silhueta de pé numa pedra.',
    '"A gente acha que ele está esperando alguém específico."',
    d=>d.flags.leu_caderno ? '"E pelo seu rosto agora, você sabe quem ele é."' :
       d.flags.viu_os_doze ? '"E, pelo que você viu na Silph, você provavelmente sabe mais do que nós."' :
       '"Você não faz ideia de quem é. Ainda bem. Gente que já sabe não vai."'
  ],
  ef:{flag:'sabe_do_norte', registrar:'A Liga revelou o vale do norte.'},
  escolhas:[
    {texto:'"Eu vou."', vai:'c21_aceitou_norte'},
    {texto:'"Manda outra equipe."', vai:'c21_recusou_norte'},
    {texto:'Devolver os lendários aqui, na mesa, antes de qualquer coisa.', vai:'c21_devolveu',
     cond:d=>Estado.lendariosCapturados().length>0}
  ]
},

c21_devolveu:{
  texto:[
    'Você coloca a bola — ou as bolas — na mesa e empurra.',
    'A sala fica em silêncio de um jeito que não estava previsto na pauta.',
    '"Obrigada." Ela parece genuinamente surpresa, o que diz muito sobre quem sentou nessa cadeira antes de você.',
    'Eles soltam na mesma tarde, na rota mais próxima, com dois biólogos e nenhuma câmera.'
  ],
  ef:{executar:d=>{
        const avisos=[];
        Estado.lendariosCapturados().forEach(L=>{
          const p=[...d.time,...d.pc].find(x=>x.dex===L.dex);
          if(p) Captura.soltar(p).forEach(e=>avisos.push({tipo:e.tipo,texto:e.texto}));
        });
        d.liga.ordemDevolucao=false; d.liga.detencao=false;
        return avisos;
      },
      rep:{eixo:'bom',delta:3,motivo:'Devolveu voluntariamente os lendários à liberdade'},
      flag:'devolveu_lendarios_liga'},
  escolhas:[{texto:'"Agora o norte."', vai:'c21_aceitou_norte'}]
},

c21_aceitou_norte:{
  texto:[
    'Eles te dão um mapa, coordenadas e uma caixa com quatro Ultra Balls e uma Master Ball.',
    '"A Master Ball é da Liga. Está registrada." Ela deixa isso no ar um segundo. "O que você fizer com ela vai ser registrado também."',
    'Na porta, ela diz a última coisa, e é a única frase do dia que não parece ensaiada:',
    '"Se ele falar com você — e ele fala — não minta. Ele sabe."'
  ],
  ef:{itens:{'Ultra Ball':4,'Master Ball':1,'Hyper Potion':3,'Full Heal':2},
      flag:'liga_aliada', rep:{eixo:'bom',delta:1,motivo:'Aceitou ir ao vale do norte'},
      npc:{nome:'Conselheira da Liga', opiniao:4, memoria:'Te mandou ao norte com uma Master Ball registrada.'},
      curaTime:true,
      registrar:'A Liga te equipou para o norte.'},
  escolhas:[{texto:'Sair do Planalto.', vai:'c21_fim'}]
},

c21_recusou_norte:{
  texto:[
    '"Manda outra equipe."',
    '"Já mandamos três." Ela não se irrita. "A quarta seria enviar gente sabendo que eles não voltam. Eu não faço isso."',
    '"E mandar eu, você faz?"',
    '"Eu não estou te mandando. Eu estou te contando." Ela empurra o mapa pela mesa mesmo assim. "A diferença importa pra mim, mesmo que não importe pra você."'
  ],
  ef:{flag:'recusou_norte'},
  escolhas:[
    {texto:'Pegar o mapa.', vai:'c21_aceitou_norte'},
    {texto:'Deixar o mapa na mesa e sair.', vai:'c21_fim', ef:{flag:'deixou_o_mapa'}}
  ]
},

c21_fim:{
  texto:[
    'Você desce do Planalto Indigo no fim da tarde.',
    d=>{
      if (d.jogador.cargo) return `Você desce como ${d.jogador.cargo}, o que é uma frase que a sua versão de quinze anos saindo de casa não teria acreditado.`;
      if (d.flags.deixou_o_mapa) return 'Você desce sem nada nas mãos e sem nada assinado, do jeito que subiu.';
      return 'Você desce com um mapa no bolso e coordenadas de um lugar onde três equipes entraram.';
    },
    d=>{
      const inst=d.mundo.instabilidade;
      if (inst>=6) return 'E o céu, no norte, tem uma cor que céu não tem.';
      if (inst>=3) return 'E o vento vira de direção duas vezes na sua descida, o que não deveria acontecer.';
      return 'E o norte é só o norte, por enquanto.';
    },
    'A Rota 10 fica a dois dias daqui.'
  ],
  fim:true, resumo:'Capítulo 21 concluído — te ofereceram tudo e você escolheu.'
}
}}

);
