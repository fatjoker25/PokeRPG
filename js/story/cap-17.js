/* ============================================================
   CAPÍTULO 17 — O jardim (Mew)
   ============================================================ */
CAPITULOS.push(

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 17 — O JARDIM
   ══════════════════════════════════════════════════════════ */
{
num:17, titulo:'O Jardim', local:'Rota 23 / Caminho Vitória', ambiente:'floresta', nivelArea:50,
tom:'muito sombrio', inicio:'c17_envelope',
cenas:{

c17_envelope:{
  texto:[
    'O envelope tem o timbre da Liga e uma frase: "Sua presença é solicitada no Planalto Indigo."',
    'Você guarda pra depois. Primeiro tem o garoto no poste.',
    d=>{
      const t=d.npcs['Téo'];
      if (!t) return 'O garoto do poste já foi embora quando você sai. Você segue sozinho para a Rota 23.';
      if (t.opiniao>=3) return '"Eu sabia que você ia passar por aqui." Téo fala rápido demais, do jeito dele. "Cara, eu preciso te mostrar uma coisa e você vai achar que eu tô louco."';
      if (t.opiniao<=-2) return '"Não vim te cumprimentar." Téo não estende a mão. "Vim porque não tem mais ninguém pra quem contar isso, e isso me irrita muito."';
      return '"Ô." Téo enfia as mãos no bolso. "Eu preciso mostrar uma coisa pra alguém que não vai rir."';
    }
  ],
  ef:{registrar:'Recebeu a convocação da Liga. E Téo apareceu com alguma coisa para mostrar.'},
  escolhas:[
    {texto:'"Mostra."', vai:'c17_teo_mostra', cond:d=>!!d.npcs['Téo']},
    {texto:'Ir direto para o Planalto. A Liga te chamou.', vai:'c17_pulou', cond:d=>!!d.npcs['Téo']},
    {texto:'Seguir sozinho pela Rota 23.', vai:'c17_rota23', cond:d=>!d.npcs['Téo']}
  ]
},

c17_pulou:{
  texto:[
    '"A Liga me chamou."',
    'Téo assente devagar. "Claro. Beleza."',
    'Ele guarda o celular sem te mostrar a foto.',
    '"Boa sorte lá, hein." Ele vai embora, e o jeito que ele vai embora diz que você acabou de perder uma coisa que não vai voltar.'
  ],
  ef:{npc:{nome:'Téo', opiniao:-3, memoria:'Veio te mostrar uma coisa e você foi ao Planalto em vez disso.'},
      flag:'ignorou_teo', rep:{eixo:'ruim',delta:1,motivo:'Descartou um amigo por uma convocação'}},
  escolhas:[{texto:'Seguir para a Rota 23.', vai:'c17_rota23'}]
},

c17_teo_mostra:{
  texto:[
    'Ele mostra uma foto no celular. Está tremida e é de longe.',
    'É uma clareira. No meio dela, pairando a um metro do chão, tem uma coisa pequena, rosa, com cauda comprida.',
    '"Isso é um borrão", você diz.',
    '"Eu sei." Ele passa pra próxima foto. E pra próxima. São nove.',
    'Na sétima, a coisa está olhando pra câmera. Na nona, ela está muito mais perto.',
    '"Eu tirei nove fotos em dois minutos e ela deixou. Ela FICOU. E aí ela sumiu e eu fiquei sentado no chão daquela clareira por uma hora."',
    '"Isso foi na Rota 23. Terça."'
  ],
  ef:{flag:['viu_as_fotos','sabe_do_jardim'],
      npc:{nome:'Téo', opiniao:3, memoria:'Te mostrou nove fotos de Mew numa clareira da Rota 23.'},
      registrar:'Téo fotografou Mew numa clareira da Rota 23.'},
  escolhas:[
    {texto:'"Me leva lá."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Apaga essas fotos."', vai:'c17_apagar'},
    {texto:'"Quem mais viu isso?"', vai:'c17_quem_viu'}
  ]
},

c17_quem_viu:{
  texto:[
    'Téo fica branco.',
    '"Eu postei uma." Ele fala baixo. "A terceira. Num grupo de treinadores. Terça à noite."',
    '"E?"',
    '"E na quarta de manhã tinha três pessoas perguntando na minha cidade onde eu morava."',
    'Ele olha em volta pela primeira vez na conversa. "Cara. Eu acho que eu fiz merda."'
  ],
  ef:{flag:['foto_vazou','tem_gente_atras_do_mew'], instabilidade:1,
      registrar:'Téo postou uma foto de Mew num grupo. Tem gente procurando.'},
  escolhas:[
    {texto:'"Então a gente vai lá agora, antes deles."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Apaga tudo e some de Fuchsia por uma semana."', vai:'c17_apagar'}
  ]
},

c17_apagar:{
  texto:[
    'Ele apaga as nove na sua frente, uma por uma.',
    'Na última, a mão dele treme um pouco. "Isso era a coisa mais importante que já aconteceu comigo."',
    '"Eu sei."',
    '"Você tá certo. Eu sei que você tá certo." Ele guarda o celular. "Mas isso era a coisa mais importante que já aconteceu comigo."'
  ],
  ef:{flag:'fotos_apagadas', limpaFlag:'foto_vazou',
      rep:{eixo:'bom',delta:2,motivo:'Protegeu um lendário apagando a única prova dele'},
      npc:{nome:'Téo', opiniao:4, memoria:'Apagou as nove fotos de Mew porque você pediu.'}},
  escolhas:[
    {texto:'"Agora me leva lá. Só nós dois."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"E agora a gente esquece que isso existiu."', vai:'c17_esqueceu'}
  ]
},

c17_esqueceu:{
  texto:[
    'Vocês não vão à clareira.',
    'Téo volta pra cidade dele. Você segue pro Planalto.',
    'Nenhum dos dois toca no assunto de novo, e é exatamente por isso que funciona: a única coisa que protege Mew é ninguém saber.',
    'É a decisão mais madura da sua jornada inteira, e ela não tem nenhuma recompensa, porque decisão madura nunca tem.'
  ],
  ef:{flag:'protegeu_mew_pelo_silencio',
      rep:{eixo:'bom',delta:3,motivo:'Protegeu Mew da melhor forma possível: não indo'},
      executar:d=>{ const L=Estado.lend(151); L.disposicao='passivo'; return []; },
      registrar:'Escolheu nunca procurar Mew. É a proteção mais eficaz que existe.'},
  escolhas:[{texto:'Seguir para o Planalto.', vai:'c17_fim'}]
},

c17_rota23:{
  texto:[
    'A Rota 23 é a última antes do Caminho da Vitória e é patrulhada — ou era. Os postos de controle estão vazios há semanas.',
    'A clareira fica fora da trilha, a quarenta minutos de mato fechado.',
    d=>d.flags.teo_leva ? 'Téo vai na frente. Ele fez esse caminho três vezes desde terça.' : 'Você encontra por acaso, o que é impossível, e você sabe que é impossível.',
    'A clareira é redonda e tem uns vinte metros. A grama dentro dela é mais alta e mais verde que a de fora, e não tem árvore caída, nem toca, nem trilha de bicho.',
    'É um lugar onde nada acontece há muito tempo.',
    d=>d.flags.tem_gente_atras_do_mew ? 'E tem marca de pneu na entrada do mato. De ontem.' : 'E não tem marca de ninguém além da sua.'
  ],
  ef:{flag:'chegou_na_clareira', registrar:'Chegou à clareira da Rota 23.'},
  escolhas:[
    {texto:'Sentar no meio e esperar.', vai:'c17_esperou_mew'},
    {texto:'Procurar as marcas de pneu.', vai:'c17_pneus', cond:d=>!!d.flags.tem_gente_atras_do_mew},
    {texto:'Ir embora. Isso não devia ter dono.', vai:'c17_foi_embora_clareira'}
  ]
},

c17_pneus:{
  texto:[
    'As marcas levam a uma estrada de terra a oitocentos metros, onde tem uma van parada e quatro pessoas montando alguma coisa.',
    'Não é a equipe da Silph. Estes são diferentes: mais jovens, equipamento mais barato, e mais animados — do jeito errado.',
    '"...se a gente pegar, a gente não vende pra empresa nenhuma, a gente vende pra comissão, que é quem paga mais..."',
    '"Comissão?" pergunta um deles. "Que comissão?"',
    '"Sei lá. Foi o nome que tava no anúncio."',
    'Eles não são organizados. São só quatro pessoas que viram uma foto num grupo e vieram.',
    'Isso é pior. Organização tem procedimento. Eles não têm nada.'
  ],
  ef:{flag:'achou_os_caçadores_de_mew'},
  escolhas:[
    {texto:'Enfrentar os quatro.', vai:'c17_luta_cacadores_mew'},
    {texto:'Sabotar a van e sair.', vai:'c17_sabotou_van'},
    {texto:'Denunciar por rádio à Liga e voltar à clareira.', vai:'c17_denunciou_van'},
    {texto:'Voltar à clareira. O que importa está lá, não aqui.', vai:'c17_esperou_mew'}
  ]
},

c17_luta_cacadores_mew:{
  texto:['Quatro pessoas, um de você. Eles não lutam bem, mas são quatro.'],
  batalha:{dex:34, nivel:48, tipo:'treinador', treinador:'Caçadores de recompensa', fuga:true,
           timeExtra:[{dex:31, nivel:48},{dex:73, nivel:47}],
           vitoria:'c17_venceu_cacadores', derrota:'c17_perdeu_cacadores', fuga2:'c17_esperou_mew', gameover:'gameover'}
},

c17_venceu_cacadores:{
  texto:[
    'Você derruba os três times e o quarto nem solta bola.',
    '"A gente só queria..." começa um.',
    '"Eu sei o que vocês queriam."',
    'Eles vão embora na van. Você fica com a sensação exata de que eles vão voltar daqui a três semanas, e vão.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Enfrentou caçadores de recompensa sozinho'},
      flag:'espantou_cacadores_mew'},
  escolhas:[{texto:'Voltar à clareira.', vai:'c17_esperou_mew'}]
},

c17_perdeu_cacadores:{
  texto:[
    'Quatro contra um é quatro contra um.',
    'Eles te deixam na estrada de terra, pegam o que quiserem da sua mochila, e seguem pra clareira.',
    'Você chega lá depois deles.',
    'E a clareira está vazia. Completamente vazia — e a grama alta do meio está pisada em círculo, como se uma dúzia de pessoas tivesse procurado alguma coisa ali por horas.'
  ],
  ef:{hp:-7, causa:'Quatro contra um na Rota 23', dinheiro:-1500,
      flag:'cacadores_chegaram_primeiro', instabilidade:1,
      registrar:'Os caçadores chegaram à clareira antes de você.'},
  escolhas:[{texto:'Esperar mesmo assim.', vai:'c17_esperou_mew'}]
},

c17_sabotou_van:{
  texto:[
    'Você corta duas mangueiras e leva a chave que estava na ignição — porque gente animada demais deixa a chave na ignição.',
    'A van não sai do lugar. Eles vão levar meio dia pra resolver.',
    'Meio dia é tudo que você precisa.'
  ],
  ef:{flag:'sabotou_a_van', rep:{eixo:'bom',delta:1,motivo:'Ganhou meio dia contra quatro caçadores'}},
  escolhas:[{texto:'Voltar à clareira.', vai:'c17_esperou_mew'}]
},

c17_denunciou_van:{
  texto:[
    'Você denuncia. A Liga responde em quatro horas, porque Rota 23 é área de acesso controlado ao Planalto e ali eles têm jurisdição imediata.',
    'Os quatro são detidos por acampamento irregular em área restrita — não por caça, porque não dá pra provar caça.',
    'Multa e liberação em dois dias. Mas a van fica apreendida por três semanas.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Usou o sistema onde o sistema funcionava'},
      flag:'liga_pegou_a_van'},
  escolhas:[{texto:'Voltar à clareira.', vai:'c17_esperou_mew'}]
},

c17_foi_embora_clareira:{
  texto:[
    'Você chega na borda da clareira, olha o meio dela, e não entra.',
    d=>d.flags.teo_leva ? 'Téo te olha sem entender. "Você não vai nem..."\n"Não."\nEle demora, mas acompanha você de volta.' : 'Você fica na borda uns dois minutos e vira as costas.',
    'Você nunca vai saber se ela estava lá naquele dia.'
  ],
  ef:{flag:'nao_entrou_na_clareira',
      rep:{eixo:'bom',delta:2,motivo:'Chegou até a borda e escolheu não entrar'},
      executar:d=>{ const L=Estado.lend(151); L.disposicao='passivo'; return []; }},
  escolhas:[{texto:'Ir para o Planalto.', vai:'c17_fim'}]
},

c17_esperou_mew:{
  texto:[
    'Você senta no meio da clareira.',
    d=>d.flags.teo_leva ? 'Téo senta a três metros e fica quieto, o que pra ele é um esforço físico.' : 'Você fica sozinho no meio de vinte metros de grama alta.',
    'Duas horas.',
    'E aí, sem nenhum aviso e sem nenhum som, tem uma coisa pairando a um metro e meio do chão, a quatro metros de você.',
    'Mew é menor do que qualquer foto sugere. É do tamanho de um gato. A cauda é mais comprida que o corpo inteiro.',
    'E ela não está te observando com cautela. Ela está te observando com curiosidade — que é uma coisa completamente diferente e muito mais perigosa, porque significa que ela não tem medo.'
  ],
  ef:{executar:d=>{ Estado.lend(151).encontros++; return []; },
      registrar:'Mew apareceu na clareira da Rota 23.'},
  escolhas:[
    {texto:'Ficar parado.', vai:'c17_mew_brinca'},
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Tentar capturar.', vai:'c17_captura_mew'},
    {texto:'Avisar em voz alta que tem gente atrás dela.', vai:'c17_avisou_mew'}
  ]
},

c17_mew_brinca:{
  texto:[
    'Você fica parado e ela se aproxima.',
    'O que acontece nos vinte minutos seguintes é a coisa mais absurda da sua jornada: Mew brinca.',
    'Ela copia. Você coça o nariz, ela coça o nariz. Você cruza os braços, ela cruza os braços — com as patinhas, do jeito errado, e você ri, e ela imita o riso sem som nenhum.',
    'Ela levanta a sua mochila do chão sem tocar, olha por baixo, e coloca de volta no lugar exato.',
    d=>d.flags.teo_leva ? 'Téo está chorando a três metros e nem percebeu.' : 'Você percebe, em algum momento, que está sorrindo de um jeito que não sorria desde o capítulo dois.',
    'Ela não está te avaliando. Ela nunca esteve. Ela só achou você interessante por vinte minutos.'
  ],
  ef:{flag:'brincou_com_mew',
      rep:{eixo:'bom',delta:2,motivo:'Passou vinte minutos brincando com Mew'},
      executar:d=>{ const L=Estado.lend(151); L.disposicao='passivo'; L.aliado=true; return []; },
      registrar:'Mew brincou com você por vinte minutos na clareira.'},
  escolhas:[
    {texto:'Avisar que tem gente atrás dela.', vai:'c17_avisou_mew'},
    {texto:'Tentar capturar agora, que ela confia.', vai:'c17_captura_mew',
     ef:{rep:{eixo:'ruim',delta:3,motivo:'Traiu Mew depois de vinte minutos de brincadeira'}, flag:'traiu_mew'}},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'}
  ]
},

c17_mew_mao:{
  texto:[
    'Você estende a mão.',
    'Ela olha a mão. Depois olha você. Depois olha a mão de novo.',
    'E encosta a testa nela — não a pata: a testa — por talvez dois segundos.',
    'Nesses dois segundos você vê uma coisa que não é imagem: é a sensação física de um lugar muito velho e muito quieto onde nada nunca precisou de nome.',
    'Depois ela recua, e você fica com a mão estendida por mais tempo do que devia.'
  ],
  ef:{flag:'tocou_mew',
      rep:{eixo:'bom',delta:2,motivo:'Mew encostou a testa na sua mão'},
      executar:d=>{ const L=Estado.lend(151); L.disposicao='passivo'; L.aliado=true; return []; }},
  escolhas:[
    {texto:'Avisar que tem gente atrás dela.', vai:'c17_avisou_mew'},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'},
    {texto:'Capturar.', vai:'c17_captura_mew', ef:{flag:'traiu_mew', rep:{eixo:'ruim',delta:3,motivo:'Capturou Mew depois que ela te tocou'}}}
  ]
},

c17_avisou_mew:{
  texto:[
    '"Tem gente te procurando."',
    'Você diz isso em voz alta numa clareira, pra uma criatura que provavelmente entende tudo e provavelmente não liga.',
    'Ela inclina a cabeça.',
    'E aí faz uma coisa desconcertante: ela sobe uns três metros, olha na direção exata da estrada de terra onde estavam as marcas de pneu, e volta.',
    'Ela já sabia. Ela sabia antes de você chegar.',
    'Ela só não considera isso um problema — e você percebe, com um arrepio, que provavelmente ela está certa, e que ela já viu isso muitas vezes, e que ela vai continuar aqui muito tempo depois de todos nós.'
  ],
  ef:{flag:'avisou_mew',
      rep:{eixo:'bom',delta:2,motivo:'Avisou Mew sobre os caçadores'},
      executar:d=>{ const L=Estado.lend(151); L.disposicao='passivo'; L.aliado=true; return []; },
      registrar:'Avisou Mew. Ela já sabia, e não se importava.'},
  escolhas:[{texto:'Deixar ela ir.', vai:'c17_deixou_mew'}]
},

c17_deixou_mew:{
  texto:[
    'Ela vai embora do jeito que chegou: sem aviso, sem som, sem transição.',
    'Num instante está a quatro metros. No seguinte, a clareira tem vinte metros de grama alta e mais nada.',
    d=>d.flags.teo_leva ? 'Téo fica sentado mais uns dez minutos. Depois: "Ninguém vai acreditar."\n"Não."\n"Ótimo." Ele se levanta. "Ótimo mesmo."' : 'Você fica sentado mais uns dez minutos, sozinho, no lugar mais comum do mundo.'
  ],
  ef:{flag:'deixou_mew_ir',
      rep:{eixo:'bom',delta:1,motivo:'Encontrou Mew e não pegou nada'}},
  escolhas:[{texto:'Ir para o Planalto.', vai:'c17_fim'}]
},

c17_captura_mew:{
  texto:[
    'Você joga a bola.',
    'Mew não desvia, não se defende, não foge.',
    'Ela olha a bola vindo com a mesma curiosidade com que olhou tudo o mais.'
  ],
  batalha:{dex:151, nivel:55, tipo:'lendario', fuga:true, ambiente:'floresta',
           vitoria:'c17_pos_mew', derrota:'c17_pos_mew', fuga2:'c17_deixou_mew',
           captura:'c17_capturou_mew', gameover:'gameover'}
},

c17_pos_mew:{
  texto:[
    'Ela some no meio do combate. Não foge — some, no sentido literal, e a clareira fica vazia.',
    'Você fica de pé ali por um tempo com uma bola na mão.',
    d=>d.flags.brincou_com_mew||d.flags.tocou_mew ? 'E pensando nos vinte minutos anteriores, que agora significam uma coisa completamente diferente.' : 'A grama alta volta ao normal em alguns minutos.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(151); L.ataquesSofridos++; L.disposicao='desconfiado'; return []; },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou Mew'}},
  escolhas:[
    {texto:'Esperar ela voltar.', vai:'c17_esperou_mew'},
    {texto:'Ir embora.', vai:'c17_fim'}
  ]
},

c17_capturou_mew:{
  texto:[
    'A bola fecha e cai na grama alta.',
    'Não tem tremor no céu, não tem clima mudando, não tem lendário nenhum vindo caçar você.',
    'Isso é o assustador de Mew: capturar ela não quebra nada. O mundo não reage.',
    d=>d.flags.teo_leva ? 'Téo olha a bola no chão. Depois olha você. Ele não fala nada, e não falar nada é a coisa mais alta que ele já fez.' : 'A clareira fica exatamente igual.',
    'Mas em algum lugar, alguém vai descobrir. E a partir daí, você deixa de ser uma pessoa e vira um endereço.'
  ],
  ef:{flag:'capturou_mew',
      registrar:'Capturou Mew. O mundo não reagiu, o que é pior.'},
  escolhas:[
    {texto:'Soltar. Agora.', vai:'c17_soltou_mew'},
    {texto:'Ficar com ela.', vai:'c17_ficou_com_mew'}
  ]
},

c17_soltou_mew:{
  texto:[
    'Você abre a bola na mesma clareira, menos de um minuto depois.',
    'Ela sai e paira no mesmo lugar de antes, na mesma altura.',
    'E aí faz a coisa que te derruba: ela inclina a cabeça de novo, com a mesma curiosidade de antes. Igual.',
    'Ela não ficou com raiva. Ela não entendeu como ofensa.',
    'Você fez a pior coisa possível com ela e ela te perdoou instantaneamente porque nem registrou como algo a perdoar.',
    'Isso é muito pior do que raiva.'
  ],
  ef:{executar:d=>{
        const avisos=[];
        const p=[...d.time,...d.pc].find(x=>x.dex===151);
        if(p) Captura.soltar(p).forEach(e=>avisos.push({tipo:e.tipo,texto:e.texto}));
        const L=Estado.lend(151); L.disposicao='passivo';
        return avisos;
      },
      rep:{eixo:'bom',delta:2,motivo:'Soltou Mew um minuto depois de capturar'},
      flag:'soltou_mew'},
  escolhas:[{texto:'Ir para o Planalto.', vai:'c17_fim'}]
},

c17_ficou_com_mew:{
  texto:[
    'Você segue com Mew no cinto.',
    'Nos dias seguintes, nada acontece. Nenhum lendário te caça. O clima não muda. A Liga não sabe.',
    'O que acontece é mais silencioso: você começa a reparar em carros que passam devagar. Em gente que olha demais. Em telefonemas que caem.',
    'Na quinta-feira, no Centro Pokémon, um homem de jaleco senta na mesa ao lado da sua e diz, sem olhar:',
    '"Nós pagamos qualquer valor. Literalmente qualquer valor. Você define."',
    'Ele não ameaça. Ele nem precisa. Ele está oferecendo, e a oferta é a ameaça.'
  ],
  ef:{flag:['ficou_com_mew','cientistas_atras'], instabilidade:1,
      rep:{eixo:'ruim',delta:2,motivo:'Manteve Mew em cativeiro'},
      registrar:'Ficou com Mew. Cientistas começaram a se aproximar.'},
  escolhas:[
    {texto:'"Não."', vai:'c17_recusou_cientistas',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Recusou "qualquer valor" por Mew'}}},
    {texto:'"Quanto é qualquer valor?"', vai:'c17_vendeu_mew'}
  ]
},

c17_recusou_cientistas:{
  texto:[
    '"Não."',
    'Ele assente, levanta, e vai embora sem insistir uma única vez.',
    'Isso devia te tranquilizar. Não tranquiliza, porque gente que não insiste é gente que tem outro plano.'
  ],
  ef:{flag:'recusou_venda_mew'},
  escolhas:[{texto:'Ir para o Planalto.', vai:'c17_fim'}]
},

c17_vendeu_mew:{
  texto:[
    'Ele escreve um número num guardanapo e empurra pela mesa.',
    'O número tem dígitos suficientes pra comprar uma casa em Celadon, e ainda sobra.',
    'A transferência acontece num estacionamento, numa terça-feira, às 6h40 da manhã.',
    'Ele leva a bola numa maleta com controle de temperatura.',
    'Antes de ir, ele diz uma coisa gentil, que é a pior parte: "Ela vai ser muito bem cuidada. Isso não é mentira. Nós precisamos dela viva e saudável por décadas."',
    'Décadas.'
  ],
  ef:{dinheiro:200000, flag:['vendeu_mew','tem_sangue_nas_maos'],
      rep:{eixo:'ruim',delta:5,motivo:'Vendeu Mew para um laboratório'},
      moral:-40, instabilidade:3,
      executar:d=>{
        const p=[...d.time,...d.pc].find(x=>x.dex===151);
        if(p){ Estado.removerDoTime(p.uid); const i=d.pc.findIndex(x=>x.uid===p.uid); if(i>=0) d.pc.splice(i,1); }
        const L=Estado.lend(151); L.estado='vendido'; L.disposicao='prisioneiro';
        return [{tipo:'morte', texto:'Mew saiu da sua vida numa maleta com controle de temperatura.'}];
      },
      registrar:'Vendeu Mew para um laboratório. Décadas.'},
  escolhas:[{texto:'Ir para o Planalto com o dinheiro.', vai:'c17_fim'}]
},

c17_fim:{
  texto:[
    'O Caminho da Vitória começa na Rota 23 e sobe quatro quilômetros de rocha.',
    'No alto dele fica o Planalto Indigo, e no Planalto Indigo fica a Liga Pokémon, e a Liga Pokémon te mandou um envelope com timbre em relevo.',
    d=>{
      if (d.flags.vendeu_mew) return 'Você sobe com uma quantia de dinheiro que não cabe em nenhuma conta que você saiba abrir e uma coisa na garganta que não passa desde terça.';
      if (d.flags.brincou_com_mew||d.flags.tocou_mew) return 'Você sobe pensando em vinte minutos numa clareira, e nenhuma das coisas que vão te dizer lá em cima vai ser maior que aqueles vinte minutos.';
      if (d.flags.protegeu_mew_pelo_silencio) return 'Você sobe sem ter visto nada e sabendo que essa foi a parte certa.';
      return 'Você sobe.';
    },
    'A subida leva o dia inteiro.'
  ],
  fim:true, resumo:'Capítulo 17 concluído — Mew não precisava de você.'
}
}}

);
