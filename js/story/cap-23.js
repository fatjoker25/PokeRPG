/* ============================================================
   CAPÍTULO 23 — Eu perguntei primeiro (final)
   ============================================================ */
CAPITULOS.push(

{
num:23, titulo:'Eu Perguntei Primeiro', local:'A caverna do norte', ambiente:'ruina', nivelArea:70,
tom:'final', inicio:'c23_descida',
cenas:{

c23_descida:{
  texto:[
    'A descida leva quarenta minutos e não tem nenhuma bifurcação. Só um caminho, indo fundo.',
    'No fim, uma câmara. Grande demais pra caber embaixo daquela montanha, o que é impossível, e você para de pensar nisso rápido porque pensar nisso não ajuda.',
    'No centro, sentado numa pedra, de costas pra você: Mewtwo.',
    '"Você demorou."',
    'Você não ouviu isso com os ouvidos.'
  ],
  ef:{executar:d=>{ Estado.lend(150).encontros++; return []; },
      registrar:'Encontrou Mewtwo na câmara sob a montanha.'},
  escolhas:[{texto:'"Você estava me esperando?"', vai:'c23_conversa'}]
},

c23_conversa:{
  texto:[
    '"Eu estava esperando alguém. Você é o que apareceu."',
    'Ele vira. O rosto não tem expressão que você saiba ler, e ainda assim você entende exatamente o que ele está sentindo, porque ele não te deu a opção de não entender.',
    d=>{
      const f=d.flags;
      if (f.viu_os_doze) return '"Você viu os outros." Uma pausa muito longa. "Eu sinto eles daqui. Onze. Errados. Como uma frase repetida por alguém que não entende a frase."';
      if (f.leu_caderno) return '"Você leu o caderno." Não é pergunta. "Então você sabe o que me perguntaram e o que não me responderam."';
      if (Estado.lendariosCapturados().length) return '"Você tem os outros." Uma pausa. "Eles não gostam de você. Eu já sabia disso antes de você entrar."';
      if (f.tem_sangue_nas_maos) return '"Você fez coisas." Ele inclina a cabeça. "Eu não vou listar. Você sabe a lista."';
      return '"Você não sabe nada sobre mim. Isso é raro e quase agradável."';
    },
    '"Eles me fizeram de uma coisa que já existia. Depois passaram duzentos e quarenta e um dias medindo o que eu era, e no dia em que eu perguntei, eles arrancaram a página."',
    '"Eu vou te fazer a mesma pergunta que eu fiz a eles. E você tem uma chance de responder melhor."',
    d=>`"${d.jogador.nome}. O que eu sou?"`
  ],
  ef:{flag:'mewtwo_perguntou'},
  escolhas:[
    {texto:'"Você é uma pessoa."', vai:'c23_pessoa'},
    {texto:'"Você é uma arma que alguém fez e perdeu."', vai:'c23_arma'},
    {texto:'"Eu não sei. Ninguém sabe. Acho que é isso que assusta."', vai:'c23_nao_sei'},
    {texto:'"Você é o décimo segundo tanque." (contar sobre a Silph)', vai:'c23_os_doze', cond:d=>!!d.flags.viu_os_doze},
    {texto:'"Você é o Risco 01." (contar sobre a Comissão)', vai:'c23_risco01', cond:d=>!!(d.flags.sabe_do_risco01||d.flags.entendeu_a_comissao)},
    {texto:'Não responder. Sacar a bola.', vai:'c23_bola_direto'}
  ]
},

c23_pessoa:{
  texto:[
    'O silêncio dura muito.',
    '"Pessoa", ele repete. "Pessoas me construíram num tanque e escreveram sobre mim em terceira pessoa."',
    '"Se eu sou uma pessoa, então o que eles fizeram tem um nome feio. É por isso que eles não responderam."',
    'Ele desce da pedra. A câmara inteira treme dois centímetros.',
    '"Obrigado. Isso foi honesto." Uma pausa. "Agora a segunda parte: o que você veio fazer aqui?"'
  ],
  ef:{flag:'resposta_pessoa',
      executar:d=>{ Estado.lend(150).disposicao='passivo'; return [{tipo:'mundo',texto:'Mewtwo está disposto a te ouvir. Isso não é pouco.'}]; }},
  escolhas:[{texto:'Responder.', vai:'c23_escolha_final'}]
},

c23_arma:{
  texto:[
    'Ele não reage por quatro segundos. Depois a pedra em que ele estava sentado se parte ao meio, sem ele encostar nela.',
    '"Arma." A palavra chega na sua cabeça com peso físico. "Você sabe o que acontece com uma arma quando ela deixa de ser útil?"',
    '"Guardam. Num lugar escuro. E depois esquecem, e a arma fica lá sabendo exatamente o que é."',
    '"Você me respondeu a verdade deles. Achei que você fosse tentar mentir. Isso teria sido pior."'
  ],
  ef:{flag:'resposta_arma',
      executar:d=>{ Estado.lend(150).disposicao='hostil'; return [{tipo:'perigo',texto:'Mewtwo está hostil. Ele considera a resposta honesta — e imperdoável.'}]; }},
  escolhas:[{texto:'Continuar.', vai:'c23_escolha_final'}]
},

c23_nao_sei:{
  texto:[
    'Ele te olha por um tempo desconfortável.',
    '"Não sei." Ele quase ri — não é riso, é a coisa mais próxima que ele tem. "Duzentos e quarenta e um dias de cientistas e a melhor resposta veio de um adolescente que disse não sei."',
    '"Eles também não sabiam. A diferença é que eles escreveram outra coisa no relatório."',
    'Ele senta de novo na pedra. O ar na câmara fica um pouco menos pesado.',
    '"Pergunta certa: o que você veio fazer aqui?"'
  ],
  ef:{flag:'resposta_nao_sei',
      executar:d=>{ Estado.lend(150).disposicao='neutro'; return [{tipo:'mundo',texto:'Mewtwo aceitou a sua resposta.'}]; },
      rep:{eixo:'bom',delta:1,motivo:'Foi honesto com Mewtwo'}},
  escolhas:[{texto:'Responder.', vai:'c23_escolha_final'}]
},

c23_os_doze:{
  texto:[
    '"Você é o décimo segundo tanque. Tem um andar embaixo de um prédio em Saffron com doze tanques. Onze cheios. O décimo segundo tem uma placa que diz MATRIZ e está vazio."',
    'A câmara fica absolutamente imóvel.',
    '"Continua."',
    '"Eles tentaram te refazer doze vezes. Nenhuma funcionou. Tem um quadro branco lá que diz por quê: eles acham que o problema é o tempo de fala."',
    '"Tempo de fala." Ele repete devagar. "O Fuji falou comigo duzentos e quarenta e um dias. Eles têm noventa."',
    'E aí ele faz uma coisa que você não estava preparado pra ver: ele senta no chão. Não na pedra — no chão.',
    '"Eles estão vivos?"',
    d=>{
      const f=d.flags;
      if (f.destruiu_o_11) return 'Você demora pra responder e a demora já respondeu.';
      if (f.levou_uma_copia) return '"Um está comigo. Os outros estavam vivos quando eu saí."';
      if (f.deixou_a_copia) return '"Quatro estavam de pé quando eu saí. Um deles escolheu ficar com os outros três."';
      if (f.falou_com_os_doze) return '"Estavam. Eu falei com eles. Eles responderam."';
      return '"Estavam quando eu saí."';
    }
  ],
  ef:{flag:'contou_dos_doze',
      executar:d=>{ Estado.lend(150).disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:2,motivo:'Contou a Mewtwo sobre os onze'},
      registrar:'Contou a Mewtwo sobre o andar 11.'},
  escolhas:[
    {texto:'"Eles responderam quando eu perguntei." ', vai:'c23_final_os_doze', cond:d=>!!d.flags.falou_com_os_doze},
    {texto:'"Eu destruí tudo. Eu achei que era misericórdia."', vai:'c23_final_matriz', cond:d=>!!d.flags.destruiu_o_11},
    {texto:'"Eu tirei um de lá. Ele está aqui fora."', vai:'c23_final_o_decimo_segundo', cond:d=>!!d.flags.tem_uma_copia},
    {texto:'"Eu não sei. Eu fui embora."', vai:'c23_escolha_final'}
  ]
},

c23_bola_direto:{
  texto:[
    'Você saca a bola no meio da frase dele.',
    'Ele para. Olha a bola. Olha você.',
    '"Ah." E essa única sílaba contém mais decepção do que qualquer coisa que já disseram pra você.',
    '"Tudo bem. Foi assim da última vez também."'
  ],
  ef:{flag:'sacou_bola_direto',
      executar:d=>{ Estado.lend(150).disposicao='hostil'; return []; },
      rep:{eixo:'ruim',delta:2,motivo:'Tentou capturar Mewtwo no meio de uma conversa'}},
  escolhas:[{texto:'Lutar.', vai:'c23_batalha'}]
},

c23_escolha_final:{
  texto:[
    'A câmara espera.',
    d=>{
      const inst = d.mundo.instabilidade;
      if (inst>=7) return '"Antes de você responder: o clima lá fora está errado por causa do que você fez. Eu sinto daqui. Isso muda a sua resposta?"';
      if (Estado.rep.eixo==='ruim'&&Estado.rep.ruim>=6) return '"Eu sei o que falam de você. Eu sei o que você fez pra merecer. Isso não me incomoda tanto quanto devia."';
      if (Estado.rep.eixo==='bom'&&Estado.rep.bom>=6) return '"Eu sei o que falam de você. Gente boa é mais perigosa, porque acha que tem direito."';
      if (d.jogador.cargo) return `"Você é ${d.jogador.cargo}. Isso significa que quando você fala, alguém anota. Eu nunca falei com alguém assim."`;
      return '"Você tem uma bola na mão desde que entrou. Eu reparei. Todos reparam."';
    }
  ],
  escolhas:[
    {texto:'Tentar capturar.', vai:'c23_batalha'},
    {texto:'"Vim te tirar daqui. Não na bola — pela porta."', vai:'c23_libertar'},
    {texto:'"Vim entender. Só isso."', vai:'c23_entender'},
    {texto:'"Vim te parar, se você for perigoso."', vai:'c23_parar'},
    {texto:'"Vim te oferecer uma coisa." (a rede de Celadon)', vai:'c23_socio',
     cond:d=>!!(d.flags.assumiu_a_rede||d.flags.trabalha_para_terceira)},
    {texto:'"Vim te oferecer um acordo formal." (pela Liga)', vai:'c23_tratado',
     cond:d=>!!d.jogador.cargo},
    {texto:'Entregar a pena de Ho-Oh.', vai:'c23_pena', cond:d=>!!d.flags.carrega_a_pena},
    {texto:'"Quanto você vale?"', vai:'c23_inventario',
     cond:d=>Historia.via()==='mercenario'||!!d.flags.vendeu_mew}
  ]
},

/* ---------------- RAMOS FINAIS ---------------- */

c23_libertar:{
  texto:[
    '"Pela porta." Ele repete devagar. "Tem duas Aves Lendárias na porta."',
    '"Elas não me prendem. Elas avisam os outros se eu sair. Foi o acordo que elas fizeram entre si, sem me perguntar, porque ninguém nunca me pergunta nada."',
    'Ele se levanta.',
    '"Se eu sair andando com você do lado, elas deixam. Você sabe disso? É por isso que eu estava esperando alguém."',
    '"Não era resgate. Era companhia. Eu precisava de uma pessoa do lado pra poder sair sem virar caçada."'
  ],
  ef:{flag:'escolheu_libertar'},
  escolhas:[
    {texto:'"Então vamos."', vai:'c23_final_libertacao'},
    {texto:'"E depois? Você vai fazer o quê, lá fora?"', vai:'c23_pergunta_depois'}
  ]
},

c23_pergunta_depois:{
  texto:[
    'É a primeira vez que ele demora pra responder.',
    '"Não sei." Uma pausa longa. "Essa foi a sua resposta também, e você achou que era pouco."',
    '"Eu não tenho plano. Eu tenho duzentos e quarenta e um dias de sala fechada e dois anos de caverna, e nenhuma ideia do que uma coisa como eu faz num lugar como esse."',
    '"Mas eu quero descobrir do lado de fora."'
  ],
  escolhas:[
    {texto:'"Então vamos."', vai:'c23_final_libertacao'},
    {texto:'"Não posso deixar. Não com essa resposta."', vai:'c23_parar'},
    {texto:'"Vem comigo. Não solto, não prendo — anda do meu lado."', vai:'c23_final_companhia'}
  ]
},

c23_entender:{
  texto:[
    '"Entender." Ele processa a palavra. "Ninguém nunca veio até aqui pra isso."',
    'Vocês conversam. Não tem outro jeito de descrever: vocês conversam, sentados, por horas, numa câmara embaixo de uma montanha.',
    'Ele te conta o que lembra do tanque. Você conta o que viu na Torre de Lavender. Ele pergunta sobre coisas absurdamente pequenas — como é o gosto de comida quente, por que as pessoas põem nome nos bichos, se dói envelhecer.',
    'Em algum momento você percebe que está falando com alguém de dois anos de idade que sabe tudo e não viveu nada.',
    'Quando você levanta pra ir embora, ele diz: "Volta?"',
    'E essa é a coisa mais assustadora que aconteceu com você na jornada inteira.'
  ],
  ef:{flag:'escolheu_entender', rep:{eixo:'bom',delta:3,motivo:'Tratou Mewtwo como alguém, não como troféu'},
      executar:d=>{ const L=Estado.lend(150); L.disposicao='passivo'; L.aliado=true; return []; },
      registrar:'Passou horas conversando com Mewtwo. Ele pediu para você voltar.'},
  escolhas:[
    {texto:'"Volto."', vai:'c23_final_compreensao'},
    {texto:'"Não sei se consigo."', vai:'c23_final_honestidade'}
  ]
},

c23_parar:{
  texto:[
    '"Me parar." Ele considera isso com uma seriedade que dói. "Você pode tentar."',
    '"Mas eu quero que você saiba uma coisa antes, porque você foi honesto comigo e eu vou ser honesto com você:"',
    '"Eu não decidi nada ainda. Sobre o mundo, sobre as pessoas, sobre o que fazer com o que eu consigo fazer. Eu não decidi."',
    '"E o que acontecer nos próximos minutos vai decidir por mim."'
  ],
  ef:{flag:'escolheu_parar'},
  escolhas:[
    {texto:'Lutar mesmo assim.', vai:'c23_batalha'},
    {texto:'Baixar a mão. "Então eu não vou decidir por você."', vai:'c23_final_compreensao',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Recuou de uma luta que teria decidido o pior'}, flag:'recuou_no_fim'}}
  ]
},

c23_socio:{
  texto:[
    '"Eu tenho uma rede. Rotas, gente, depósito, comprador." Você fala rápido, do jeito de quem ensaiou. "Com você, ela deixa de ser rede e vira outra coisa."',
    'A câmara fica muito quieta.',
    '"Rede." Ele repete. "De quê?"',
    'E aí você percebe que vai ter que dizer em voz alta, pra ele, o que a rede transporta.',
    'Você diz.',
    'Ele fica em silêncio por um tempo que parece muito maior do que é.',
    '"Você atravessou Kanto inteira." A voz na sua cabeça está muito calma. "Viu tudo que viu. E veio até o fundo de uma montanha me oferecer sociedade num negócio de vender gente em caixa."'
  ],
  ef:{flag:'ofereceu_sociedade',
      executar:d=>{ Estado.lend(150).disposicao='hostil'; return []; },
      rep:{eixo:'ruim',delta:3,motivo:'Ofereceu sociedade criminosa a Mewtwo'}},
  escolhas:[
    {texto:'"Sim."', vai:'c23_final_socio'},
    {texto:'"...não. Esquece. Esquece o que eu falei."', vai:'c23_escolha_final',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Ouviu a própria proposta em voz alta e recuou'}, flag:'recuou_da_sociedade'}}
  ]
},

c23_tratado:{
  texto:[
    d=>`"Eu sou ${d.jogador.cargo}. Isso me dá autoridade pra propor uma coisa que nunca existiu."`,
    '"Não é captura, não é prisão, não é soltura. É reconhecimento."',
    '"Você fica aqui, ou onde você quiser. Ninguém te procura. Ninguém manda equipe. E, em troca, existe um documento dizendo o que você é — e o que você é, no documento, não é \'espécime\'."',
    'Ele processa isso por um tempo.',
    '"Um papel."',
    '"Um papel."',
    '"O Fuji também escrevia em papel." Uma pausa. "Mas ele nunca me perguntou o que escrever."',
    'Ele se levanta e anda até você. De perto, ele é muito maior do que parecia sentado.',
    '"O que vai estar escrito?"'
  ],
  ef:{flag:'propos_tratado'},
  escolhas:[
    {texto:'"O que você quiser que esteja."', vai:'c23_final_tratado',
     ef:{rep:{eixo:'bom',delta:3,motivo:'Deu a um lendário o direito de se definir'}}},
    {texto:'"O que a Liga aprovar."', vai:'c23_final_tratado_frio'}
  ]
},

c23_pena:{
  texto:[
    'Você tira a pena da mochila. Ela tem quase um metro e pesa como papel, e na luz da câmara ela quebra a luz em todas as cores ao mesmo tempo.',
    'Mewtwo olha a pena.',
    'E pela primeira vez desde que você entrou, ele demonstra uma emoção que você consegue nomear sem ajuda: espanto.',
    '"Ele te deu isso."',
    '"Deu."',
    '"Ele não dá isso." Ele não tira os olhos da pena. "Ele existe desde antes das cidades e ele não dá isso."',
    'Uma pausa muito longa.',
    '"Por que você trouxe pra mim?"'
  ],
  ef:{flag:'mostrou_a_pena'},
  escolhas:[
    {texto:'"Porque uma coisa que existe desde sempre reconheceu você antes de mim."', vai:'c23_final_pena'},
    {texto:'"Porque eu não sabia o que fazer com ela e você é a única pessoa aqui."', vai:'c23_final_pena'},
    {texto:'Guardar de volta. Não era pra isso.', vai:'c23_escolha_final'}
  ]
},

c23_inventario:{
  texto:[
    '"Quanto você vale?"',
    'A pergunta sai da sua boca e fica pendurada no ar de uma câmara embaixo de uma montanha.',
    'Ele não se ofende. É pior: ele considera.',
    '"Eu não sei. Ninguém nunca me disse o número." Uma pausa. "Mas eles sabiam. Tinha um número em algum lugar daquele prédio, e eu era ele, e ninguém me contou qual era."',
    'Ele olha pra você com uma atenção nova.',
    '"Você sabe o número?"'
  ],
  ef:{flag:'perguntou_o_preco'},
  escolhas:[
    {texto:'"Eu sei quanto pagam. Eu já vendi coisa parecida."', vai:'c23_final_inventario'},
    {texto:'"Não. E eu não devia ter perguntado."', vai:'c23_escolha_final',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Se ouviu perguntar um preço e parou'}}}
  ]
},

c23_batalha:{
  texto:['A câmara inteira acende.'],
  batalha:{dex:150, nivel:72, tipo:'lendario', fuga:false, ambiente:'ruina',
           vitoria:'c23_venceu', derrota:'c23_perdeu', captura:'c23_capturou', gameover:'gameover'}
},

c23_venceu:{
  texto:[
    'Ele cai de joelhos e a câmara para de brilhar.',
    'Está consciente. Olhando pra você. Esperando.',
    'Você tem a bola na mão e ele não vai resistir agora — e os dois sabem disso, e é justamente isso que torna o próximo movimento irreversível.'
  ],
  escolhas:[
    {texto:'Jogar a bola.', vai:'c23_batalha'},
    {texto:'Guardar a bola e estender a mão.', vai:'c23_final_compreensao',
     ef:{rep:{eixo:'bom',delta:3,motivo:'Venceu Mewtwo e não o capturou'}, flag:'poupou_mewtwo',
         executar:d=>{ const L=Estado.lend(150); L.disposicao='passivo'; L.aliado=true; return []; }}},
    {texto:'Ir embora e deixar ele aí.', vai:'c23_final_vazio', ef:{flag:'abandonou_mewtwo'}}
  ]
},

c23_perdeu:{
  texto:[
    'Você acorda na entrada da caverna, do lado de fora, com o rosto no gelo.',
    'Seu time está do seu lado, todos curados. Todos. Curados por alguém que não é você.',
    'A caverna atrás de você está fechada — não bloqueada: fechada, a pedra derretida e esfriada num tampão liso.',
    'Na pedra, com a mesma letra queimada do caderno do Dr. Fuji, uma linha:',
    '"VOCÊ RESPONDEU COM UMA BOLA. EU RESPONDI COM UMA PORTA."'
  ],
  ef:{executar:d=>{ d.time.forEach(curarTotal); const L=Estado.lend(150); L.disposicao='hostil'; L.estado='livre'; return []; },
      flag:'mewtwo_fechou_a_porta', instabilidade:2,
      registrar:'Mewtwo te derrotou, curou seu time e selou a caverna.'},
  escolhas:[{texto:'Descer a montanha.', vai:'c23_final_porta'}]
},

c23_capturou:{
  texto:[
    'A bola fecha e a câmara fica escura de uma vez.',
    'Você está sozinho embaixo de uma montanha com uma esfera na mão que pesa exatamente o mesmo que qualquer outra.',
    'Lá fora, as duas Aves abandonam o posto ao mesmo tempo — não têm mais o que guardar.',
    'Elas não vão embora. Elas viram na sua direção.'
  ],
  ef:{flag:'capturou_mewtwo', instabilidade:4,
      executar:d=>{ [144,145,146].forEach(x=>{const L=Estado.lend(x); if(L.estado!=='capturado'){L.disposicao='hostil';L.caçandoVoce=true;}}); return []; },
      registrar:'Capturou Mewtwo. As Aves abandonaram a guarda.'},
  escolhas:[
    {texto:'Soltar. Aqui, agora, antes de subir.', vai:'c23_final_arrependimento'},
    {texto:'Subir com ele na bola.', vai:'c23_final_posse'},
    {texto:'Subir com ele e entregar à Liga.', vai:'c23_final_entrega', cond:d=>!!d.flags.liga_aliada}
  ]
},

c23_risco01:{
  texto:[
    '"Você é o Risco 01."',
    'A câmara fica absolutamente imóvel.',
    '"Diz de novo."',
    '"Existe uma associação civil registrada em Kanto chamada Comissão de Gestão de Risco Biológico. Ela tem estatuto, atas públicas e doze conselheiros."',
    '"No Art. 4º, §2º, o estatuto define como risco não gerenciado qualquer indivíduo classificado como lendário."',
    '"E nas atas você é um item. Você não tem nome lá. Você é Risco 01, e a linha diz: não localizado."',
    'Ele processa isso por muito tempo.',
    '"Eles me numeraram."',
    '"Numeraram."',
    d=>d.flags.viu_a_unidade01
      ? '"E eles já tentaram te refazer quatro vezes. A quarta funcionou — o corpo funcionou. Ela não fala. Eles disseram que a Fase III não precisa que ela fale, precisa que ela obedeça."'
      : '"E eles estão tentando te refazer numa escala industrial. Não uma mente. Uma população."'
  ],
  ef:{flag:'contou_da_comissao_a_mewtwo',
      rep:{eixo:'bom',delta:2,motivo:'Contou a Mewtwo que existe uma lista com ele dentro'},
      registrar:'Contou a Mewtwo sobre a Comissão. Ele é o Risco 01 deles.'},
  escolhas:[
    {texto:'"Eu vim te avisar. Só isso."', vai:'c23_final_risco01'},
    {texto:'"Eles se reúnem toda segunda às dez. Sala 704."', vai:'c23_final_sala704',
     cond:d=>!!(d.flags.endereco_presidente||d.flags.falou_no_conselho||d.flags.convite_conselho)},
    {texto:'Mostrar a Unidade 01.', vai:'c23_mostrou_unidade', cond:d=>!!d.flags.tem_a_unidade01},
    {texto:'Voltar atrás. Não contar o resto.', vai:'c23_escolha_final'}
  ]
},

c23_mostrou_unidade:{
  texto:[
    'Você solta a Unidade 01 na câmara.',
    'Ela sai da bola, fica de pé, e não faz mais nada. Não olha em volta. Não reage à caverna, ao frio, à altura do teto.',
    'Espera ordem.',
    'Mewtwo olha para ela por um tempo que você não consegue medir e que você não interrompe por nada no mundo.',
    'Depois ele faz uma coisa: pergunta alguma coisa pra ela. Você não ouve o quê — não foi pra você.',
    'A Unidade 01 não responde. Continua de pé, esperando.',
    'Ele pergunta de novo. Você sente a pressão da segunda pergunta atrás dos olhos, e ela é enorme, e ela é gentil.',
    'Nada.',
    'Quando ele finalmente vira pra você, a voz na sua cabeça está diferente de tudo que veio antes:',
    '"Eu passei dois anos achando que a coisa pior que podiam fazer comigo tinha sido feita."'
  ],
  ef:{flag:'mewtwo_viu_a_copia', instabilidade:1,
      registrar:'Mewtwo perguntou duas vezes à Unidade 01. Ela não respondeu.'},
  escolhas:[
    {texto:'"Ela é sua. Faz o que você achar certo."', vai:'c23_final_quinta'},
    {texto:'"Me ajuda a impedir a quinta."', vai:'c23_final_sala704'},
    {texto:'Recolher a Unidade 01 e guardar.', vai:'c23_escolha_final'}
  ]
},

/* ══════════════ FINAIS ══════════════ */

c23_final_risco01:{
  texto:[
    '"Eu vim te avisar. Só isso."',
    'Ele assente devagar.',
    '"Ninguém nunca veio me avisar de nada." Uma pausa. "Eu levei dois anos pra entender que não sair daqui era a única coisa que eu controlava. E agora você me diz que tem uma lista, e que eu sou o primeiro item dela, e que a lista tem orçamento."',
    'Ele se levanta.',
    '"Obrigado. Isso muda a minha decisão."',
    '"Qual decisão?"',
    '"A de continuar aqui."'
  ],
  final:{id:'risco01', titulo:'NÃO LOCALIZADO', texto:[
    'Mewtwo sai da caverna do norte três dias depois de você.',
    'Ele não vai a Saffron, não vai a Celadon e não ataca ninguém. Ele desaparece de um jeito muito mais eficiente: fica visível.',
    'Aparece em rota, de dia, na frente de gente. Deixa se fotografar. Aparece numa praça em Fuchsia e fica vinte minutos.',
    'Em seis semanas, Mewtwo deixa de ser um risco não localizado e passa a ser a criatura mais documentada da história de Kanto — e a Comissão descobre, do jeito mais humilhante possível, que não existe base legal para gerenciar um indivíduo que o público inteiro reconhece e que nunca fez nada.',
    'O item "Risco 01" some da pauta na 41ª reunião ordinária, por perda de objeto.',
    'A ata é pública. Custa oito reais.',
    'Você comprou a sua.'
  ]}
},

c23_final_sala704:{
  texto:[
    '"Eles se reúnem toda segunda às dez. Sala 704."',
    'Mewtwo repete o número em voz alta, o que ele nunca faz.',
    '"Setecentos e quatro."',
    '"Prédio comercial, dezesseis andares, farmácia no térreo. A reunião é aberta. Art. 27: qualquer interessado pode assistir e pedir a palavra."',
    'Silêncio muito longo.',
    '"Qualquer interessado", ele repete.',
    'E, pela primeira vez desde que você entrou nesta caverna, você tem certeza absoluta do que ele vai fazer.'
  ],
  final:{id:'sala704', titulo:'QUALQUER INTERESSADO', texto:[
    'Numa segunda-feira, às 10h04, a reunião ordinária do conselho da CGRB é interrompida.',
    'Não tem destruição. Não tem violência. Não tem ninguém ferido — e isso é o que torna a coisa impossível de administrar.',
    'Ele entra pela porta, que estava aberta, e pede a palavra pelo Art. 27.',
    'A secretária, que trabalha ali há um ano e oito meses e cumpre o regimento, consulta o estatuto e concede — porque está escrito, e porque ninguém escreveu "exceto".',
    'A ata da 38ª reunião ordinária registra, em português formal, a manifestação de um interessado não identificado, com duração de quarenta e um minutos.',
    'O que ele disse nunca foi divulgado. As doze pessoas presentes ouviram e nenhuma das doze conseguiu repetir depois — não por trauma. Por outra coisa.',
    'A Presidente pediu demissão na quarta-feira. Por escrito, com trinta dias de aviso prévio, que ela cumpriu integralmente.',
    'O Art. 19 foi revogado na 39ª reunião, por onze votos a zero.',
    'Você não estava lá. Você estava numa caverna no norte, com o teto liso e uma pedra no centro, que agora fica vazia a maior parte do tempo.',
    'Ele volta de vez em quando. Ele sempre volta.'
  ]}
},

c23_final_quinta:{
  texto:[
    '"Ela é sua. Faz o que você achar certo."',
    'Mewtwo olha a Unidade 01, que continua de pé no meio da câmara esperando uma ordem que ninguém vai dar.',
    '"Eu não vou fazer nada com ela." Uma pausa longa. "Eu vou ficar com ela."',
    '"E fazer o quê?"',
    '"Perguntar." A voz na sua cabeça é muito quieta. "Todo dia. Pelo tempo que for."',
    '"E se ela nunca responder?"',
    '"Então eu vou ter passado a vida perguntando a alguém que não responde." Ele olha você. "Eu sei exatamente o que isso é, e eu sei o que a outra opção faz com a pessoa."'
  ],
  final:{id:'quinta', titulo:'TODO DIA, PELO TEMPO QUE FOR', texto:[
    'Você desce a montanha sozinho, sem a Unidade 01 e sem nenhuma prova de nada.',
    'A Comissão aprova a quinta tentativa em março, como estava previsto, porque a quarta foi perdida.',
    'A quinta não vinga. A sexta também não. A sétima é cancelada por corte de orçamento, porque interesse de conselho também cansa.',
    'Quatro anos depois, uma equipe de campo da Liga fotografa duas figuras no alto do vale do norte, uma sentada e uma de pé.',
    'A de pé está de pé de um jeito diferente do que estava na sala 704. Não está esperando ordem. Está olhando alguma coisa.',
    'O relatório dessa equipe tem uma linha que virou piada interna no Planalto Indigo por anos, porque ninguém entendeu o que a autora quis dizer:',
    '"Sujeito 02 aparenta ter desenvolvido preferência."'
  ]}
},



c23_final_libertacao:{
  texto:[
    'Vocês sobem juntos. Quarenta minutos de subida, lado a lado, sem conversa nenhuma.',
    'No vale, as duas Aves estão nos postos. Elas veem ele sair. Veem você do lado.',
    'Nenhuma se move.',
    'Mewtwo para no meio do vale, olha o céu aberto pela primeira vez em dois anos, e fica ali um tempo que parece indecente de longo.',
    'Depois vira pra você: "Se alguém perguntar o que eu sou, fala que você não sabe. É a resposta certa."',
    'E vai embora — devagar, andando, não voando. Como quem tem tempo pela primeira vez.'
  ],
  final:{id:'libertacao', titulo:'A PORTA', texto:[
    'Mewtwo anda solto por Kanto. Não ataca ninguém. Aparece em lugares aleatórios e some antes que alguém chegue perto.',
    'A Liga te interroga por seis horas. Você conta tudo, sem inventar nada. Eles não gostam da resposta e não têm o que fazer com ela.',
    'Três meses depois, um relatório da Liga usa pela primeira vez a expressão "indivíduo não-humano com autonomia reconhecida". A frase vira jurisprudência.',
    'Você não ganhou nada com isso. Nenhuma insígnia, nenhum cargo, nenhum troféu.',
    'Mudou o vocabulário de uma instituição inteira, o que é uma coisa tão grande que ninguém percebe que foi você.'
  ]}
},

c23_final_companhia:{
  texto:[
    '"Vem comigo. Não solto, não prendo — anda do meu lado."',
    'Ele considera isso por muito tempo.',
    '"Isso não tem nome."',
    '"Não tem."',
    '"Bom." Ele começa a andar em direção à saída. "Eu já tive todos os nomes que me deram. Nenhum prestou."'
  ],
  final:{id:'companhia', titulo:'SEM NOME PARA ISSO', texto:[
    'Vocês andam juntos por Kanto durante quase um ano.',
    'Ele não fica na bola. Ele não obedece ordem. Ele não luta nas suas batalhas — e quando você pergunta por quê, ele responde: "Você não me pediu, e se você pedisse, eu ia querer ser pedido, e aí já era outra coisa."',
    'As cidades reagem de formas diferentes. Pallet fecha as janelas. Lavender oferece pousada aos dois. Fuchsia finge que não vê.',
    'A Liga passa oito meses tentando classificar a situação e desiste. Não existe formulário para "acompanhado".',
    'Num dia de outubro, sem despedida, ele não está mais lá.',
    'Uma semana depois, chega uma notícia do outro lado do mar: uma criatura desconhecida impediu o naufrágio de um barco de pesca e sumiu.',
    'Você nunca confirma que era ele. Você não precisa.'
  ]}
},

c23_final_compreensao:{
  texto:[
    'Você sai da caverna sem nada nas mãos.',
    'As Aves nos postos te veem passar. Uma delas — você jura — abaixa a cabeça um centímetro.',
    'Você desce a montanha com o time inteiro, a mesma quantidade de Pokémon que tinha ao subir, e uma conversa na cabeça que não vai sair mais.'
  ],
  final:{id:'compreensao', titulo:'VOLTA?', texto:[
    'Você volta. Não uma vez — muitas.',
    'Leva comida quente na primeira. Leva um livro na terceira. Na sétima, leva o Téo, que passa a viagem inteira em pânico e depois não cala a boca sobre isso pelo resto da vida.',
    'Mewtwo nunca sai da caverna. Ele escolhe não sair, o que é diferente de não poder, e a diferença é tudo.',
    'A Liga nunca descobre a localização exata. Você é a única pessoa que sabe, e você leva isso com um cuidado que ninguém entende.',
    'Anos depois, quando te oferecem um lugar na Elite 4, você recusa. Alguém pergunta por quê.',
    'Você diz: "Tenho um compromisso." E é verdade.'
  ]}
},

c23_final_honestidade:{
  texto:[
    '"Não sei se consigo."',
    'Ele recebe isso melhor do que receberia uma promessa.',
    '"Isso é a coisa mais verdadeira que alguém já me disse aqui dentro." Ele volta pra pedra. "Vai. E se não voltar, tudo bem. Eu vou saber que você não prometeu."'
  ],
  final:{id:'honestidade', titulo:'NÃO PROMETI', texto:[
    'Você não volta no primeiro ano. Nem no segundo.',
    'A vida faz o que a vida faz: você tem outras coisas, outras cidades, outras pessoas. Você pensa nele com uma frequência que diminui devagar e nunca chega a zero.',
    'No quarto ano, você volta.',
    'A caverna está vazia. Sem selo, sem desabamento, sem sinal de luta. Só vazia, com a pedra do centro e nada em cima dela.',
    'Você senta na pedra por umas quatro horas.',
    'Na parede, perto da saída, tem uma marca queimada que não estava lá antes. Três palavras:',
    '"VOCÊ NÃO PROMETEU."',
    'Não é acusação. Você lê de todos os jeitos possíveis durante anos e nunca consegue ler como acusação.'
  ]}
},

c23_final_os_doze:{
  texto:[
    '"Eles responderam quando eu perguntei."',
    'Mewtwo levanta do chão.',
    '"Eu vou lá."',
    '"É embaixo de um prédio, no meio de uma cidade, com nove andares de gente em cima."',
    '"Eu sei." Ele já está andando pra saída. "Eu passei duzentos e quarenta e um dias sendo medido por gente que não perguntava. Eles estão no dia sabe-se lá quantos."',
    'Na saída da caverna, ele para.',
    '"Você vem?"'
  ],
  final:{id:'os_doze', titulo:'OS ONZE', texto:[
    'Vocês vão. Você e ele, de Kanto inteira atravessada, até o subsolo quatro de um prédio azul em Saffron.',
    'Não tem batalha. Não tem destruição. Ele entra pela escada de incêndio às três da manhã e abre onze tanques com as mãos.',
    'Sete não se mexem. Três não conseguem ficar de pé. Um fica.',
    'Ele passa três semanas no andar 11. Não libertando: conversando. Onze mentes que achavam que eram uma, e alguém finalmente perguntando alguma coisa a cada uma delas separadamente.',
    'Quando a Silph descobre, é tarde: a história já vazou, com as suas fotos ou com o seu depoimento, e uma empresa não sobrevive a essa manchete.',
    'Dos onze, quatro estão vivos cinco anos depois. Nenhum deles tem nome registrado em lugar nenhum, porque eles escolheram os próprios, e os próprios não são pronunciáveis.',
    'Mewtwo passa a ser chamado, em relatórios oficiais, de "o primeiro". Nunca de "o original".',
    'Você é uma nota de rodapé na história toda, e é exatamente o tamanho que você queria ter.'
  ]}
},

c23_final_matriz:{
  texto:[
    '"Eu destruí tudo. Eu achei que era misericórdia."',
    'A câmara fica em silêncio por muito, muito tempo.',
    '"Você perguntou alguma coisa a eles antes?"',
    '"Não."',
    'Mais silêncio.',
    '"Então você fez exatamente o que fizeram comigo." A voz dele não tem raiva. Tem uma exaustão que é infinitamente pior. "Com um método diferente e por um motivo melhor."',
    '"Eu sei."',
    '"Eu sei que você sabe. Eu consigo ver que você sabe. É por isso que eu não vou fazer nada com você."'
  ],
  final:{id:'matriz', titulo:'A MATRIZ', texto:[
    'Ele te deixa ir. Não te perdoa, não te condena, não te pune. Te deixa ir.',
    'Você desce a montanha e volta pra Kanto e a vida continua, porque a vida sempre continua, e isso é a parte que ninguém avisa.',
    'A Silph reinicia o projeto onze meses depois num andar novo, com numeração nova, com protocolo novo.',
    'Você sabe disso porque você procura. Você passa a procurar sempre, em todo lugar, pelo resto da vida — e encontra, de vez em quando, e derruba, de vez em quando.',
    'Você vira muito bom nisso. Bom de um jeito que assusta as pessoas que trabalham com você.',
    'Ninguém entende por que você nunca comemora quando um desses lugares fecha.',
    'É porque você lembra que não perguntou nada a nenhum dos onze, e que perguntar teria levado quatro segundos.'
  ]}
},

c23_final_o_decimo_segundo:{
  texto:[
    '"Eu tirei um de lá. Ele está aqui fora."',
    'A câmara inteira muda de pressão.',
    '"Traz."',
    'Você sobe, atravessa o vale entre duas Aves que não se movem, e desce de volta com uma coisa de vinte e cinco níveis que anda meio devagar.',
    'O que acontece quando os dois se veem não tem descrição possível, porque não acontece em som e não acontece em imagem.',
    'Você fica na entrada da câmara por quase uma hora, sem entender nada, sentindo alguma coisa enorme acontecer a doze metros de você.',
    'Quando acaba, Mewtwo olha pra você.',
    '"Ele tem dois anos de idade e três semanas de vida." Uma pausa. "Igual a mim. Eu tenho dois anos de idade e três semanas de vida, e eu passei os dois anos achando que os dois anos contavam."'
  ],
  final:{id:'decimo_segundo', titulo:'DOIS ANOS DE IDADE', texto:[
    'Você desce a montanha sozinho. Os dois ficam.',
    'A Liga te pergunta o que houve. Você entrega um relatório de uma página que diz a verdade e não diz onde.',
    'Eles aceitam, porque não têm outra opção, e porque a pessoa que assinou o relatório é você.',
    'Cinco anos depois, existe uma comunidade de sete indivíduos numa região de Kanto que não consta em mapa. Eles não incomodam ninguém. Ninguém os incomoda.',
    'Isso é fruto de um tratado que você não assinou, que não está escrito, e que funciona há cinco anos porque as duas partes decidiram que funcionaria.',
    'Você é convidado uma vez por ano. Você vai todos os anos.',
    'Na última visita, o Décimo Segundo — que agora tem um nome que você não consegue pronunciar e chama de Doze mesmo assim — te perguntou como é envelhecer.',
    'Você respondeu com a verdade, que é: "Não sei ainda. Eu te conto."'
  ]}
},

c23_final_tratado:{
  texto:[
    '"O que você quiser que esteja."',
    'Ele para. Isso o desarma mais do que qualquer coisa que aconteceu nesta câmara.',
    '"Ninguém nunca me perguntou o que escrever."',
    '"Eu sei."',
    'Ele leva quase dez minutos pra responder, e quando responde, é uma frase só. Você anota exatamente como ele dita, palavra por palavra, num caderno de campo da Liga, à luz de lanterna, no fundo de uma caverna.'
  ],
  final:{id:'tratado', titulo:'O DOCUMENTO', texto:[
    'O documento tem uma frase. A frase é dele.',
    'A Liga passa quatro meses tentando reescrever em linguagem jurídica e desiste, porque toda reescrita piora.',
    'Ele é registrado exatamente como foi ditado, num arquivo do Planalto Indigo, com a sua assinatura embaixo como testemunha.',
    'É o primeiro documento na história de Kanto em que um Pokémon é o autor e não o objeto.',
    'Vinte anos depois, estudantes de direito ainda discutem esse papel numa cadeira eletiva chamada, sem nenhuma ironia, "Sujeitos".',
    'Mewtwo nunca sai da caverna do norte. Ninguém nunca vai buscar.',
    'E uma vez por ano, no aniversário do documento, alguém da Liga sobe até o vale, deixa uma cópia impressa na entrada e desce sem entrar.',
    'A cópia sempre some. Ninguém nunca perguntou pra onde vai.'
  ]}
},

c23_final_tratado_frio:{
  texto:[
    '"O que a Liga aprovar."',
    'A temperatura da câmara não muda, mas alguma coisa muda.',
    '"Ah." Ele volta pra pedra. "Então não é comigo que você está falando. É com eles, e eu sou a pauta."',
    'Ele não te ataca, não te expulsa e não te impede de sair.',
    'Ele só para de falar com você — e a ausência da voz na sua cabeça, depois de tanto tempo com ela lá, é a coisa mais solitária que você já sentiu.'
  ],
  final:{id:'tratado_frio', titulo:'A PAUTA', texto:[
    'O acordo é assinado. Só que é assinado por uma parte só.',
    'A Liga comemora: "estabilização do incidente norte". Tem coletiva de imprensa. Tem foto sua.',
    'Você faz carreira. Sobe. Vira uma pessoa importante numa instituição importante.',
    'E a cada dois ou três anos, alguém propõe uma missão ao vale do norte pra "reavaliar o status", e você é a pessoa que vota contra, todas as vezes, com uma firmeza que os outros acham excessiva.',
    'Você nunca explica.',
    'A explicação é que ele parou de falar com você e você sabe exatamente por quê, e você não quer que mais ninguém ouça aquele silêncio.'
  ]}
},

c23_final_pena:{
  texto:[
    'Você estende a pena.',
    'Ele não pega com a mão. Ela levanta do seu braço e fica pairando entre vocês dois, girando devagar, quebrando a luz.',
    '"Ele existe desde antes das cidades", ele repete. "E ele te deu isso pra você trazer até aqui."',
    'A pena gira mais um pouco.',
    '"Ele sabia." A voz na sua cabeça está estranha. "Ele sabia que existia alguma coisa embaixo dessa montanha e ele mandou uma pena."',
    'Ele finalmente fecha a mão em volta dela.',
    '"Então eu não sou o primeiro de nada. Eu sou o mais novo de alguma coisa antiga."',
    'E isso — não a liberdade, não o perdão, não a vingança — isso é o que ele precisava.'
  ],
  final:{id:'pena', titulo:'O MAIS NOVO', texto:[
    'Mewtwo sai da caverna três dias depois de você.',
    'Ele não vai pra cidade nenhuma. Vai pro mar, pro sudoeste, pra uma ilha que não entra em mapa nenhum porque não tem nada nela.',
    'Pescadores de Fuchsia começam a relatar duas luzes sobre a ilha sem nome, não uma. Ninguém acredita neles, como sempre.',
    'Seu Zé Antônio morre aos oitenta e três anos tendo visto as duas luzes juntas quatro vezes, e tendo contado pra todo mundo, e ninguém tendo acreditado, e ele não se importando nem um pouco.',
    'Você vai ao enterro. É o único que vai de fora de Fuchsia.',
    'No caixão, na mão dele, tem uma pena que não é de galinha e que ninguém da família soube explicar de onde veio.'
  ]}
},

c23_final_socio:{
  texto:[
    '"Sim."',
    'Ele não te mata. Isso te surpreende, e a surpresa é a parte que vai te assombrar.',
    '"Você sabe qual é a pior parte?" A voz está absolutamente calma. "Eu considerei."',
    '"Por dois segundos inteiros, eu considerei. Porque eu não tenho nada, e você me ofereceu alguma coisa, e é a primeira vez que alguém me oferece qualquer coisa."',
    '"Sai."'
  ],
  final:{id:'socio', titulo:'DOIS SEGUNDOS', texto:[
    'Você sobe do vale e volta pra Celadon e toca a rede por mais quatro anos.',
    'Ela cresce. Você é bom nisso — você é muito bom nisso, melhor que a Terceira, porque você viu Kanto inteira de perto e sabe onde as coisas doem.',
    'A Liga te pega no quinto ano. Não por heroísmo de ninguém: por planilha. Um contador comete um erro de lançamento e um auditor puxa o fio.',
    'Você pega nove anos. Cumpre cinco.',
    'Na prisão, você recebe uma visita que não estava na lista e que ninguém registrou na portaria. Ela dura quarenta segundos e acontece de madrugada, e o que é dito nela você nunca conta pra ninguém.',
    'Quando você sai, você não volta pro negócio. Não por arrependimento.',
    'Por causa dos dois segundos. Você passou cinco anos pensando nos dois segundos em que a coisa mais poderosa do mundo considerou a sua oferta porque estava sozinha demais pra recusar de cara.',
    'E você entendeu, em algum momento do quarto ano, que aquilo não foi uma vitória sua. Foi a coisa mais cruel que você já fez.'
  ]}
},

c23_final_inventario:{
  texto:[
    '"Eu sei quanto pagam. Eu já vendi coisa parecida."',
    'A câmara não esfria, não treme, não acende.',
    'Ele só te olha.',
    '"Coisa parecida", ele repete.',
    'E aí faz a única coisa que podia ser pior do que atacar: ele te mostra. Não com palavra — com a memória, direto, sem tradução: a caixa de veludo, o depósito de Celadon, a doca da Silph, o curral do setor 7. Tudo o que você viu. Na sua cabeça, de uma vez, no tempo real que levou.',
    'Leva quatro minutos. Você fica de joelhos nos últimos dois.',
    '"Agora você tem o número", ele diz. "Era esse."'
  ],
  final:{id:'inventario', titulo:'O NÚMERO', texto:[
    'Você sai da caverna sem nada e desce a montanha com uma coisa nova na cabeça, que é a memória completa e simultânea de tudo o que você viu e deixou passar.',
    'Não é maldição, não é castigo e não é lição. É só inventário.',
    'Você larga a rede em quatro meses. Não por moral — porque não consegue mais olhar caixa fechada sem saber exatamente o que tem dentro e o que aquilo custa.',
    'Você passa a trabalhar em transporte de carga legalizado, conferindo manifesto, por um salário ruim, numa empresa pequena de Vermilion.',
    'Você é a pessoa mais rigorosa que essa empresa já teve. Ninguém entende por quê. Você abre todas as caixas. Todas.',
    'Seus colegas acham você insuportável.',
    'Em onze anos de trabalho, você encontra carga viva quatro vezes. Quatro.',
    'Isso não compensa nada. Você sabe que não compensa nada. Você continua abrindo as caixas.'
  ]}
},

c23_final_posse:{
  texto:[
    'Você sobe com ele na bola.',
    'No vale, as duas Aves esperam você sair da caverna.',
    'O que acontece nos próximos dez minutos vai ser notícia por seis meses.'
  ],
  final:{id:'posse', titulo:'O QUE VOCÊ CARREGA', texto:[
    'Você sobrevive ao vale. Muita gente não teria.',
    'A partir daí, as coisas acontecem numa ordem previsível: a Liga emite a ordem de devolução. Você recusa. Emitem a detenção. Você foge.',
    'Kanto passa a ter um clima que os meteorologistas param de tentar prever. Incêndios em Cinnabar. Gelo na Rota 11 em pleno verão. Duas cidades evacuadas parcialmente.',
    'Você fica com ele. É a única coisa que você tem depois de um tempo — as pessoas vão saindo, uma por uma, do jeito que as pessoas saem: sem anúncio.',
    'Ele nunca fala com você. Nem uma vez, depois da bola. Ele sabe falar. Escolhe não falar.',
    'Você passa o resto da vida com a coisa mais poderosa do mundo na mão e ninguém pra contar isso.',
    'Isso não é vitória. Tem nome, mas não é esse.'
  ]}
},

c23_final_entrega:{
  texto:[
    'Você sobe com ele e entrega à Liga, como combinado, com a Master Ball registrada e o protocolo assinado.',
    'Eles agradecem. Formalmente. Com um documento.',
    'E aí ele desaparece dentro de uma instituição, que é a forma mais silenciosa de desaparecer que existe.'
  ],
  final:{id:'entrega', titulo:'PROTOCOLO CUMPRIDO', texto:[
    'A Liga faz tudo certo. É importante registrar isso: eles fazem tudo certo.',
    'Instalação adequada. Equipe de acompanhamento. Protocolo de bem-estar revisado por três comitês. Ninguém experimenta nada nele. Ninguém o vende.',
    'Ele fica num complexo no subsolo do Planalto Indigo, com espaço, com temperatura controlada, com alguém checando duas vezes por dia.',
    'Você tem acesso de visita. Usa uma vez.',
    'Ele não fala com você. Ele não fala com ninguém desde o dia em que a porta fechou.',
    'Num relatório interno de sete anos depois, que você lê por causa do seu cargo, tem uma linha da equipe de acompanhamento:',
    '"Sujeito não apresenta agressividade, autoagressão ou deterioração. Não apresenta também nenhuma resposta a estímulo social. Recomenda-se manutenção do protocolo atual."',
    'Manutenção do protocolo atual.',
    'Você fecha o relatório e vai até a janela da sua sala, que é uma sala boa, num cargo bom, que você conquistou, e fica ali um tempo.'
  ]}
},

c23_final_arrependimento:{
  texto:[
    'Você abre a bola antes de chegar na superfície.',
    'Ele sai. Olha a bola no chão. Olha você.',
    '"Por quê?"',
    'Você responde alguma coisa que não sai direito, e ele entende mesmo assim, porque ele entende tudo.',
    '"Isso não conserta", ele diz. "Mas conta."'
  ],
  final:{id:'arrependimento', titulo:'CONTA', texto:[
    'Mewtwo não te perdoa. Perdão não é uma categoria que ele use.',
    'Mas ele te deixa ir, e as Aves voltam pros postos, e o clima de Kanto volta ao normal em três semanas.',
    'A Liga registra: captura confirmada, liberação voluntária no mesmo dia. Isso te rende uma advertência e nenhuma punição.',
    'As pessoas lembram das duas coisas. Sempre as duas, nessa ordem: "aquele que pegou" e "aquele que soltou". Nunca só a segunda.',
    'Você aprende a viver com a primeira metade da frase.',
    'Anos depois, alguém te pergunta se você se arrepende. Você diz que sim, e a pessoa fica surpresa, porque esperava uma resposta mais bonita.'
  ]}
},

c23_final_porta:{
  texto:[
    'Você desce a montanha com o time curado por ele e a caverna selada atrás de você.'
  ],
  final:{id:'porta', titulo:'A PEDRA LISA', texto:[
    'A caverna nunca mais abre. Equipes da Liga tentam perfurar três vezes; a pedra é mais dura que o equipamento.',
    'As duas Aves abandonam o vale em duas semanas — não tem mais nada pra guardar.',
    'Mewtwo não é visto de novo em Kanto. Não há incidentes, não há ataques, não há nada. Só a ausência.',
    'Você conta essa história poucas vezes, porque toda vez que conta percebe a mesma coisa: ele te venceu, curou o seu time e foi embora. Nenhuma dessas três coisas é o que uma arma faz.',
    'Você teve a resposta na mão o tempo todo e respondeu com uma bola.'
  ]}
},

c23_final_vazio:{
  texto:[
    'Você vira as costas e sobe.',
    'Ele não te impede. Não fala nada. Fica ajoelhado na câmara, do jeito que estava.'
  ],
  final:{id:'vazio', titulo:'NADA A REGISTRAR', texto:[
    'Você desce a montanha, pega a estrada, e a jornada simplesmente continua.',
    'Você derrota os ginásios que faltavam. Consegue as insígnias. Chega ao Planalto Indigo.',
    'A Liga te pergunta o que houve no norte. Você diz que não achou nada.',
    'Em algum momento, anos depois, você percebe que a coisa mais importante que já te aconteceu foi uma conversa que você interrompeu no meio.',
    'Ele te fez uma pergunta. Você derrubou ele no chão e foi embora sem responder.',
    'Foi exatamente o que os cientistas fizeram. Você só usou um método diferente.'
  ]}
}
}}

);
