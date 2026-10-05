/* ============================================================
   CAMINHO DO HERÓI — quem precisa de ajuda te acha
   Pra quem Kanto passou a ver como herói (a via do capítulo 9) na hora
   do desvio. Quem acompanha: a brigadista Tess Calder, o menino do
   Caterpie e quem mais pedir.
   ============================================================ */

/* ── I · O FOGO NO CAPIM (depois do 12) ────────────────────── */
CAPITULOS.push(
{
num:12.07, titulo:'O Fogo no Capim', local:'Rota 15 — a borda da reserva', ambiente:'campo', nivelArea:40,
tom:'muito sombrio',
ancora:{local:'rota13', chamada:'No horizonte da Rota 15 sobe uma coluna de fumaça amarela, e o vento está soprando pro lado das casas.'},
entradas:['ch1_a_fumaca'],
inicio: d => 'ch1_a_fumaca',
cenas:{

ch1_a_fumaca:{
  texto:[
    'A fumaça é amarela porque o capim está seco desde abril. O vento empurra pro lado de três casas de sítio e de um curral de Miltank.',
    d => { Nomes.apresentar('a brigadista de Fuchsia'); return 'Na estrada, uma caminhonete-pipa velha e uma mulher de capacete amarelo com o nome pintado à mão na lateral: CALDER.'; },
    fala('a brigadista de Fuchsia', 'Somos quatro brigadistas pra seis quilômetros de fogo. Quem tem Pokémon de água, vem. Quem não tem, carrega mangueira.'),
    fala('a brigadista de Fuchsia', 'Você é {o|a} que ajuda. Todo mundo de Fuchsia falou. Vem.')
  ],
  ef:{flag:'cm_heroi_1', registrar:'Um incêndio no capim da borda da reserva, na Rota 15, ameaça três sítios.'},
  escolhas:[
    {texto:'Ir pra linha de fogo com a brigada.', vai:'ch1_a_linha'},
    {texto:'Ir direto pros sítios tirar as famílias.', vai:'ch1_os_sitios',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Foi tirar as famílias dos sítios antes de tudo'}}}
  ]
},

ch1_a_linha:{
  texto:[
    'Linha de fogo é cavar uma faixa sem capim na frente do fogo, rápido, antes que ele chegue. É enxada, abafador e Pokémon de água molhando a borda.',
    'Às duas da tarde, a linha segura. Às três, o vento vira.',
    d => { const p = (d.time || []).find(x => !x.morto); return p ? `${nomeExib(p)} trabalha do seu lado sem parar, e quando o fogo pula a faixa é ${pron(p).ele} que vê primeiro.` : 'Quando o fogo pula a faixa, quem vê primeiro é a brigadista.'; },
    fala('a brigadista de Fuchsia', 'Pulou! Recua tudo pra estrada!', 'grita')
  ],
  escolhas:[
    {texto:'Recuar pra estrada, como ela mandou.', vai:'ch1_os_sitios',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Segurou a linha de fogo com a brigada'}}},
    {texto:'Ficar e segurar o pedaço que ainda dá.', vai:'ch1_segurou',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Ficou segurando a linha de fogo depois da ordem de recuar'}}}
  ]
},

ch1_segurou:{
  texto:['O fogo chega na sua frente com um barulho de papel rasgando. Você tem um minuto pra decidir o que é coragem e o que é teimosia.'],
  teste:{status:'resistencia', dificuldade:7, nomeStatus:'Resistência',
         critico:'ch1_segurou_bem', sucesso:'ch1_segurou_bem', parcial:'ch1_queimou', falha:'ch1_queimou'}
},

ch1_segurou_bem:{
  texto:[
    'Você segura. Vinte metros de faixa, que são os vinte metros entre o fogo e o curral de Miltank.',
    'Quando acaba, você não sente as mãos. A brigadista te olha de longe e não briga, que é o jeito dela de agradecer.'
  ],
  ef:{flag:'cm_heroi_segurou_a_linha', moral:3},
  escolhas:[
    {texto:'Ir pros sítios.', vai:'ch1_os_sitios'}
  ]
},

ch1_queimou:{
  texto:[
    'O fogo passa. Você recua tarde, com o braço queimado e o cabelo cheirando a capim.',
    fala('a brigadista de Fuchsia', 'Teimosia não segura fogo. Água segura fogo. Vai pro sítio, que lá tem água.', 'frio')
  ],
  ef:{hp:-4, causa:'O fogo no capim da Rota 15'},
  escolhas:[
    {texto:'Ir pros sítios.', vai:'ch1_os_sitios'}
  ]
},

ch1_os_sitios:{
  texto:[
    'No primeiro sítio, um casal de velhos já está na estrada com uma mala e um Snorlax que não quer sair do quintal.',
    'No segundo, ninguém. No terceiro, uma menina de oito anos chorando na porteira, porque o Ponyta dela se soltou e correu pro lado do fogo.',
    'Do lado da cerca da reserva, um Rapidash selvagem corre em pânico de um lado pro outro, com a crina pegando fogo e os olhos brancos.'
  ],
  escolhas:[
    {texto:'Ir atrás do Ponyta da menina.', vai:'ch1_o_ponyta'},
    {texto:'Acalmar o Rapidash selvagem antes que ele leve o fogo pra outro lugar.', vai:'ch1_o_rapidash'}
  ]
},

ch1_o_rapidash:{
  texto:['Rapidash em pânico não escuta. Ele precisa cair pra ouvir.'],
  batalha:{dex:78, nivel:d => nivelDoCaminho(d, -2), tipo:'selvagem', fuga:true,
           vitoria:'ch1_acalmou', derrota:'ch1_o_ponyta', gameover:'gameover'}
},

ch1_acalmou:{
  texto:[
    'O Rapidash cai de lado no capim queimado, cansado, e deixa você jogar água na crina.',
    'Quando ele levanta, ele vai pro lado certo, pra longe do fogo. Atrás dele, como quem segue o grande, vai o Ponyta da menina.',
    'A menina corre pra porteira gritando um nome que você não entende.'
  ],
  ef:{flag:['cm_heroi_rapidash','cm_heroi_ponyta'], rep:{eixo:'bom', delta:2, motivo:'Acalmou um Rapidash selvagem no meio do incêndio e o Ponyta da menina voltou junto'}},
  escolhas:[
    {texto:'Voltar pra estrada.', vai:'ch1_a_causa'}
  ]
},

ch1_o_ponyta:{
  texto:[
    'O Ponyta da menina está parado no meio do capim, sem saber pra onde, com o fogo dos dois lados.',
    'Você entra no capim. Do lado de fora, alguém grita o seu nome.',
    d => d.flags.cm_heroi_segurou_a_linha ? 'O caminho que você abriu com a brigada ainda está ali, sem capim, e é por ele que vocês saem.' : 'Você sai pelo lado que o fogo deixou, que é o lado errado, e dá a volta comprida.'
  ],
  ef:{flag:'cm_heroi_ponyta', hp:-1, causa:'O fogo no capim da Rota 15',
      rep:{eixo:'bom', delta:2, motivo:'Entrou no capim em chamas pra buscar o Ponyta de uma menina'}},
  escolhas:[
    {texto:'Voltar pra estrada.', vai:'ch1_a_causa'}
  ]
},

ch1_a_causa:{
  texto:[
    'O fogo morre de noite, na estrada de terra, porque estrada de terra não queima.',
    'Na caminhonete-pipa, a brigadista mostra uma coisa que achou na origem do fogo, do lado de dentro da cerca da reserva: uma lata de querosene vazia e um isqueiro de cozinha.',
    fala('a brigadista de Fuchsia', 'Queima de limpeza. O manejo faz pra empurrar Pokémon pro lado da cerca, onde é mais fácil pegar. Sempre do lado de dentro, sempre com vento a favor.', 'baixo'),
    fala('a brigadista de Fuchsia', 'Hoje o vento virou.', 'baixo')
  ],
  ef:{flag:'cm_heroi_queima_de_limpeza', itens:{'Lata de querosene da origem':1},
      registrar:'O incêndio da Rota 15 começou numa queima de limpeza do manejo, do lado de dentro da cerca.'},
  escolhas:[
    {texto:'Levar a lata ao Koga, que é conselheiro da reserva.', vai:'ch1_fim', cond:d => !!d.npcs['Koga'] || !!d.flags.achou_ginasio_fuchsia,
     ef:{flag:'cm_heroi_lata_koga', rep:{eixo:'bom', delta:2, motivo:'Levou ao Koga a prova da queima de limpeza'},
         npc:{nome:'Koga', opiniao:2, memoria:'Você trouxe a lata de querosene da origem do incêndio da Rota 15.'}}},
    {texto:'Deixar a lata com a brigadista, pro laudo dela.', vai:'ch1_fim',
     ef:{flag:'cm_heroi_lata_brigada', rep:{eixo:'bom', delta:1, motivo:'Deixou a prova do incêndio com a brigada'},
         npc:{nome:'Tess Calder', opiniao:3, memoria:'Você deixou a lata de querosene com ela, pro laudo.'}}},
    {texto:'Contar pra família da menina o que causou o fogo.', vai:'ch1_fim',
     ef:{flag:'cm_heroi_contou_familia', rep:{eixo:'bom', delta:1, motivo:'Contou às famílias dos sítios o que causou o incêndio'}}}
  ]
},

ch1_fim:{
  texto:[
    'Na manhã seguinte, a menina do Ponyta aparece na estrada com um pote de doce de leite e um desenho de você com o cabelo em pé, em cima de um Rapidash de giz de cera.',
    fala('a brigadista de Fuchsia', 'Isso aí é o salário de brigadista. Doce e desenho. Tem gente que acha pouco.', 'riso'),
    'Seis quilômetros de capim preto. Três sítios em pé.'
  ],
  fim:true, resumo:'O fogo no capim: seis quilômetros pretos, três sítios em pé e uma lata de querosene do lado de dentro da cerca.'
}

}
},

/* ── II · OS QUE SUMIRAM (depois do 19) ────────────────────── */
{
num:19.07, titulo:'Os Que Sumiram', local:'Rota 21 — a vila de pescadores', ambiente:'agua', nivelArea:56,
tom:'muito sombrio',
ancora:{local:'rota21', chamada:'Na vila de pescadores da Rota 21, uma mulher espera no píer com uma foto na mão, todo dia, na hora do barco.'},
entradas:['ch2_a_mae'],
inicio: d => 'ch2_a_mae',
cenas:{

ch2_a_mae:{
  texto:[
    'A vila de pescadores da Rota 21 tem doze casas, um píer e um telefone público que só funciona com ficha.',
    'A mulher do píer segura a foto de um rapaz de uns vinte anos, de boné, sorrindo com um Magikarp na mão.',
    fala('a mãe do píer', 'Meu filho foi trabalhar na estação nova, a de cerca alta. Seis meses. Ligava todo domingo. Faz cinco domingos que não liga.', 'baixo'),
    fala('a mãe do píer', 'Mais quatro da vila foram junto. Nenhum liga. Falaram que você ajuda quem pede. Eu tô pedindo.')
  ],
  ef:{flag:'cm_heroi_2', registrar:'Cinco rapazes da vila de pescadores da Rota 21 foram trabalhar na Estação 4 e pararam de ligar.'},
  escolhas:[
    {texto:'Prometer que traz notícia.', vai:'ch2_a_estacao',
     ef:{flag:'cm_heroi_prometeu', rep:{eixo:'bom', delta:1, motivo:'Prometeu à mãe do píer que trazia notícia do filho'}}},
    {texto:'Perguntar o nome dele e o que ele fazia.', vai:'ch2_o_nome'}
  ]
},

ch2_o_nome:{
  texto:[
    fala('a mãe do píer', 'Dale. Dale Moran. Ele pescava comigo desde os oito. Foi pra estação porque pagava o triplo e tinha alojamento.'),
    fala('a mãe do píer', 'Ele mandou a primeira carta dizendo que tinha cama com lençol e que dava comida três vezes. A segunda carta veio sem selo, só com a letra dele no envelope e nada dentro.', 'baixo'),
    'Ela te mostra o envelope vazio. Na dobra de dentro, tem um número escrito a lápis, quase apagado: 3-14.'
  ],
  ef:{flag:'cm_heroi_3_14', registrar:'O envelope vazio do filho da mãe do píer tinha um número a lápis na dobra: 3-14.'},
  escolhas:[
    {texto:'Ir à Estação 4.', vai:'ch2_a_estacao'}
  ]
},

ch2_a_estacao:{
  texto:[
    'O alojamento da Estação 4 fica atrás do berçário: dois blocos de concreto com janela pequena e um portão com catraca.',
    'Na catraca, um aviso plastificado:',
    '**PROIBIDO APARELHO TELEFÔNICO NAS DEPENDÊNCIAS. CONTRATO, CLÁUSULA 9.**',
    'Às seis da tarde, a troca de turno: vinte homens e mulheres de macacão azul atravessam o pátio sem falar, de cabeça baixa, como quem está muito cansado ou muito vigiado.',
    'Um deles, de boné, olha pra você um segundo a mais.'
  ],
  escolhas:[
    {texto:'Chamar "Dale!" alto, do lado de fora da cerca.', vai:'ch2_chamou',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Chamou pelo nome um trabalhador da Estação 4'}}},
    {texto:'Esperar a noite e achar o bloco 3, quarto 14.', vai:'ch2_o_quarto', cond:d => !!d.flags.cm_heroi_3_14}
  ]
},

ch2_chamou:{
  texto:[
    'O rapaz de boné para no meio do pátio. Os outros não param, mas andam mais devagar.',
    'Um segurança de colete preto vem pela cerca, por dentro, sem pressa, e chega na sua frente antes do rapaz responder.',
    fala('Segurança da Estação 4', 'Funcionário em turno não recebe visita. Se ele quiser falar com alguém, ele pede dispensa.'),
    fala('Segurança da Estação 4', 'Ninguém nunca pediu dispensa.', 'frio')
  ],
  escolhas:[
    {texto:'Esperar a noite e achar ele de outro jeito.', vai:'ch2_o_quarto'}
  ]
},

ch2_o_quarto:{
  texto:[
    'O bloco 3 tem uma janela de banheiro sem grade, do lado do muro. O quarto 14 tem quatro camas e cinco homens.',
    'O rapaz de boné é o Dale. Ele te reconhece da foto que a mãe mostra pra todo mundo, porque ela mostrou pra ele também, numa carta que chegou aberta.',
    fala('Dale', 'A gente não pode sair. A gente deve o alojamento. O alojamento custa o salário, e o que sobra é a comida, e a comida é da cantina deles.', 'baixo'),
    fala('Dale', 'Quem sai antes do contrato paga multa. A multa é o salário de um ano. Ninguém tem.', 'baixo')
  ],
  ef:{flag:'cm_heroi_achou_davi', registrar:'Os rapazes da vila estão presos no alojamento da Estação 4 por dívida de alojamento e multa de contrato.',
      npc:{nome:'Dale', opiniao:3, memoria:'Você entrou pela janela do banheiro do bloco 3 pra achar ele.'}},
  escolhas:[
    {texto:'Tirar os cinco hoje, pela janela, e enfrentar quem aparecer.', vai:'ch2_a_fuga',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Tirou cinco trabalhadores do alojamento da Estação 4 de noite'}}},
    {texto:'Fotografar o contrato e o quarto e levar pra fora, pra polícia do trabalho.', vai:'ch2_as_fotos',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Juntou prova do alojamento da Estação 4 antes de agir'}}},
    {texto:'Pagar a multa de um, o Dale, com o seu dinheiro.', vai:'ch2_pagou', cond:d => d.jogador.dinheiro >= 6000,
     ef:{flag:'cm_heroi_pagou_multa', dinheiro:-6000, rep:{eixo:'bom', delta:2, motivo:'Pagou do bolso a multa de contrato de um rapaz da Estação 4'}}}
  ]
},

ch2_a_fuga:{
  texto:[
    'Cinco homens por uma janela de banheiro levam doze minutos. No décimo, a lanterna do segurança aparece na esquina do bloco.',
    fala('Segurança da Estação 4', 'Funcionário fora do alojamento depois das dez é abandono de posto.', 'frio')
  ],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 1), tipo:'treinador', treinador:'Segurança da Estação 4', fuga:false,
           vitoria:'ch2_sairam', derrota:'ch2_voltaram', gameover:'gameover'}
},

ch2_sairam:{
  texto:[
    'As unidades caem e esperam. O segurança recolhe e, pela primeira vez, não diz nada. Ele olha pros cinco e olha pro chão.',
    'Às duas da manhã, num barco de pesca emprestado, cinco rapazes atravessam a Rota 21 de volta pra vila, sem luz, remando.',
    'No píer, a mãe do Dale está esperando. Ela não sabe que vocês vêm. Ela espera todo dia na hora do barco, e hoje o barco veio.'
  ],
  ef:{flag:'cm_heroi_trouxe_os_cinco', rep:{eixo:'bom', delta:3, motivo:'Trouxe de volta os cinco rapazes da vila de pescadores'},
      registrar:'Os cinco rapazes da vila de pescadores voltaram pra casa de barco, de noite.'},
  escolhas:[
    {texto:'Ficar pra ver.', vai:'ch2_fim'}
  ]
},

ch2_voltaram:{
  texto:[
    'O segurança leva os cinco de volta pro quarto 14, um por um, sem violência e sem pressa.',
    'O Dale, antes de entrar, te olha e diz uma coisa só com a boca, sem som: "fala pra ela".',
    'Você é escoltad{o|a} até a portaria.'
  ],
  ef:{hp:-2, causa:'O alojamento da Estação 4'},
  escolhas:[
    {texto:'Voltar pro píer.', vai:'ch2_fim'}
  ]
},

ch2_as_fotos:{
  texto:[
    'O contrato tem dezoito cláusulas. A cláusula 9 proíbe telefone. A 14 diz que o alojamento é descontado em folha. A 17 diz a multa.',
    'Você fotografa tudo, e fotografa o quarto: quatro camas, cinco homens, um ventilador sem hélice.',
    'Na delegacia do trabalho de Saffron, o fiscal lê as fotos e marca uma visita surpresa pra daqui a três semanas.',
    'Três semanas é muito tempo pra um quarto de quatro camas e cinco homens.'
  ],
  ef:{flag:'cm_heroi_fiscal', itens:{'Fotos do contrato da Estação 4':1}},
  escolhas:[
    {texto:'Voltar pro píer e contar pra mãe.', vai:'ch2_fim'}
  ]
},

ch2_pagou:{
  texto:[
    'O escritório de pessoal da Estação 4 aceita o pagamento da multa com recibo, carimbo e um sorriso educado.',
    'O Dale sai pela portaria às oito da manhã, com uma mochila e o boné na mão.',
    'Os outros quatro ficam olhando da janela do bloco 3.'
  ],
  ef:{npc:{nome:'Dale', opiniao:6, memoria:'Você pagou a multa dele com o seu dinheiro.'}},
  escolhas:[
    {texto:'Levar ele pro píer.', vai:'ch2_fim'}
  ]
},

ch2_fim:{
  texto:[
    d => d.flags.cm_heroi_trouxe_os_cinco ? 'Na vila de pescadores, naquele domingo, o telefone público toca cinco vezes, e não é ninguém: são os cinco ligando uns pros outros, de casa em casa, só porque podem.' : d.flags.cm_heroi_pagou_multa ? 'O Dale volta pro barco da mãe. No domingo seguinte ele vai à Estação 4 de visita, do lado de fora da cerca, e grita o nome de cada um dos quatro.' : 'A mãe do Dale ouve tudo de pé, segurando a foto. "Ele tá vivo", ela repete, como quem conta. "Ele tá vivo."',
    'A cerca alta da Estação 4 fica do outro lado da água, com a luz do alojamento acesa a noite inteira.'
  ],
  fim:true, resumo:'Os que sumiram: um envelope vazio com um número a lápis, um quarto de quatro camas e cinco homens.'
}

}
},

/* ── III · QUEM AJUDA QUEM (depois do 25) ───────────────────── */
{
num:25.07, titulo:'Quem Ajuda Quem', local:'Saffron — a praça da estação', ambiente:'cidade', nivelArea:58,
tom:'sombrio',
ancora:{local:'saffron', chamada:'Na praça da estação de Saffron tem um palanque montado, um microfone e uma faixa com o seu nome escrito errado.'},
entradas:['ch3_o_palanque'],
inicio: d => 'ch3_o_palanque',
cenas:{

ch3_o_palanque:{
  texto:[
    'Depois da audiência de segunda, o seu nome saiu em três jornais. A prefeitura de Saffron montou um palanque na praça da estação pra te dar uma medalha.',
    'Na fila da frente: o prefeito, um conselheiro da Liga, e um homem de terno cinza claro que você já viu num corredor de fórum.',
    'Atrás da grade, umas trezentas pessoas. Muita criança com Pokémon no colo.',
    d => d.flags.ln_heroi_conselho || d.flags.ln_heroi_melhor ? 'Na grade, de boné, um menino com um Butterfree no ombro acena com as duas mãos. Era um Caterpie da última vez.' : 'Na grade, uma senhora segura um pote de doce de leite e um Meowth que não quer ficar no colo.'
  ],
  ef:{flag:'cm_heroi_3', registrar:'Saffron montou um palanque pra te dar uma medalha depois da audiência.'},
  escolhas:[
    {texto:'Subir no palanque.', vai:'ch3_a_medalha'},
    {texto:'Ir falar com o menino da grade antes.', vai:'ch3_o_menino'}
  ]
},

ch3_o_menino:{
  texto:[
    d => d.flags.ln_heroi_conselho || d.flags.ln_heroi_melhor ? fala('o menino do Caterpie', 'Ele evoluiu! Você falou pra fazer o que tivesse na frente, depois o próximo. Eu fiz. Ele evoluiu fazendo.') : fala('o menino do Caterpie', 'Eu vi você no jornal. Eu tenho um Butterfree. Ele era um Caterpie. Ninguém acredita.'),
    fala('o menino do Caterpie', 'Eu quero ajudar também. Eu tenho doze anos. Me leva.'),
    'Atrás dele, a mãe dele faz que não com a cabeça, devagar, olhando pra você e não pra ele.'
  ],
  escolhas:[
    {texto:'Subir no palanque.', vai:'ch3_a_medalha'}
  ]
},

ch3_a_medalha:{
  texto:[
    'O prefeito põe a medalha no seu pescoço. É pesada e tem o brasão de Saffron.',
    'O homem de terno cinza claro pede a palavra e anuncia, no microfone, que a Comissão de Gestão de Risco tem orgulho de patrocinar a homenagem.',
    'O microfone volta pra você. Trezentas pessoas esperam.',
    fala('Dr. Bramble', 'Um herói de Kanto é bom pra todo mundo. Inclusive pra quem estava do outro lado. Fala bonito.', 'baixo')
  ],
  escolhas:[
    {texto:'Agradecer e falar da Comissão, no microfone, com nome e número.', vai:'ch3_o_microfone',
     ef:{rep:{eixo:'bom', delta:3, motivo:'Usou a própria homenagem pra falar da Comissão no microfone'}}},
    {texto:'Agradecer, sorrir e descer.', vai:'ch3_desceu',
     ef:{rep:{eixo:'ruim', delta:1, motivo:'Aceitou uma homenagem patrocinada pela Comissão sem dizer nada'}}},
    {texto:'Devolver a medalha ali mesmo.', vai:'ch3_devolveu',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Devolveu no palanque a medalha patrocinada pela Comissão'}}}
  ]
},

ch3_o_microfone:{
  texto:[
    'Você fala do capim queimado, do quarto de quatro camas e cinco homens, do que você viu. Trezentas pessoas param de mexer no PokéNav.',
    'O Dr. Bramble sobe no palanque no meio da sua frase e tenta pegar o microfone, educadamente.',
    'Atrás dele, dois homens de colete preto se aproximam da escada do palanque.'
  ],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 3), tipo:'treinador', treinador:'Segurança da Estação 4', fuga:false,
           timeExtra:[{dex:68, nivel:d => nivelDoCaminho(d, 3)}],
           vitoria:'ch3_terminou_a_frase', derrota:'ch3_cortaram', gameover:'gameover'}
},

ch3_terminou_a_frase:{
  texto:[
    'As unidades caem no palco de madeira. O microfone ainda está ligado na sua mão.',
    'Você termina a frase. A praça inteira ouve.',
    'Quem aplaude primeiro é a mãe de um pescador da Rota 21, na terceira fila, de pé.'
  ],
  ef:{flag:'cm_heroi_falou_tudo', rep:{eixo:'bom', delta:2, motivo:'Terminou a frase no palanque'}},
  escolhas:[
    {texto:'Descer do palanque.', vai:'ch3_depois'}
  ]
},

ch3_cortaram:{
  texto:[
    'Cortam o som. Você continua falando sem microfone, e as primeiras filas ouvem, e repetem pra trás, de boca em boca.',
    'No jornal do dia seguinte, a foto é a sua, de boca aberta, sem microfone, com um segurança segurando o fio.'
  ],
  ef:{flag:'cm_heroi_sem_microfone', hp:-1, causa:'O palanque de Saffron'},
  escolhas:[
    {texto:'Descer do palanque.', vai:'ch3_depois'}
  ]
},

ch3_desceu:{
  texto:[
    'Você agradece e desce. Trezentas pessoas aplaudem. O homem de terno cinza claro aperta a sua mão e posa pra foto.',
    'No jornal do dia seguinte, a foto é essa: você e ele, de mão dada, com o brasão da Comissão atrás.'
  ],
  ef:{flag:'cm_heroi_foto_com_bramble'},
  escolhas:[
    {texto:'Ir embora da praça.', vai:'ch3_depois'}
  ]
},

ch3_devolveu:{
  texto:[
    'Você tira a medalha do pescoço e põe na mão do prefeito, que não sabe o que fazer com ela.',
    'Ninguém aplaude. Ninguém vaia. A praça fica em silêncio, que é pior e melhor.',
    'Na grade, o menino do Butterfree bate palma sozinho, até a mãe segurar a mão dele.'
  ],
  ef:{flag:'cm_heroi_devolveu_medalha'},
  escolhas:[
    {texto:'Descer do palanque.', vai:'ch3_depois'}
  ]
},

ch3_depois:{
  texto:[
    'Na saída da praça, a brigadista Calder te espera encostada na caminhonete-pipa, de capacete na mão.',
    fala('a brigadista de Fuchsia', 'Agora todo mundo sabe o seu nome. Isso é bom pra quem precisa de ajuda e é ruim pra você.'),
    fala('a brigadista de Fuchsia', 'Herói de palanque dura um ano. Brigadista dura a vida. Escolhe.', 'baixo')
  ],
  escolhas:[
    {texto:'Aceitar ser o rosto de Kanto: palanque, entrevista, campanha. Usar o nome pra ajudar mais gente.', vai:'ch3_final_simbolo',
     ef:{rep:{eixo:'bom', delta:3, motivo:'Aceitou ser o símbolo de Kanto pra ajudar mais gente'}}},
    {texto:'Sumir do palanque e ajudar sem nome, onde precisar.', vai:'ch3_final_ninguem',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Largou a fama pra ajudar sem nome'}}},
    {texto:'Ensinar o menino do Butterfree a fazer o que você faz.', vai:'ch3_final_proximo',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Passou adiante o que sabia a quem queria ajudar'}}},
    {texto:'Seguir pro Planalto. Ainda tem coisa no caminho.', vai:'ch3_seguir',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Seguiu a jornada depois do palanque'}}}
  ]
},

ch3_seguir:{
  texto:[
    fala('a brigadista de Fuchsia', 'Vai. Se pegar fogo no caminho, você sabe onde é a linha.', 'riso'),
    'O ônibus da Liga pro Planalto sai às oito e quinze. Alguém deixou um pote de doce de leite no seu assento.'
  ],
  ef:{flag:'cm_heroi_seguiu'},
  fim:true, resumo:'Quem ajuda quem: um palanque, uma medalha pesada e um microfone que alguém tentou desligar.'
},

ch3_final_simbolo:{
  texto:[
    'O seu rosto vai pra cartaz, pra jornal, pra rádio. Você aprende a falar em trinta segundos o que antes levava uma tarde.',
    'Cada vez que alguém te liga pedindo ajuda, o seu nome manda dez pessoas no seu lugar.'
  ],
  final:{id:'heroi_simbolo', titulo:'O SÍMBOLO', texto:[
    'Ser símbolo é ser usado. Você aprende a escolher por quem.',
    'A Comissão tenta três vezes pôr o seu rosto num cartaz deles. As três vezes você vai a público dizer que não. As três vezes funciona.',
    'Você quase não ajuda mais ninguém com as próprias mãos. Você manda gente. É mais gente ajudada e é menos você, e você nunca decide se isso é bom.',
    'Na sua mesa tem um desenho de giz de cera, de uma menina de Fuchsia, de você em cima de um Rapidash. Você olha ele toda vez que dá uma entrevista.'
  ]}
},

ch3_final_ninguem:{
  texto:[
    'Você some do palanque, do jornal e da rádio em um mês. O telefone continua tocando; você continua atendendo.',
    'Ninguém em Kanto sabe mais onde você está. Quem precisa sabe.'
  ],
  final:{id:'heroi_ninguem', titulo:'NINGUÉM', texto:[
    'Você vira brigadista em Fuchsia. Capacete amarelo com o nome pintado à mão na lateral.',
    'Às vezes você tira um Meowth de uma caixa d\'água, às vezes você segura uma linha de fogo de seis quilômetros. Ninguém escreve sobre nenhuma das duas.',
    'Uma vez por ano, numa vila de pescadores da Rota 21, cinco rapazes te mandam um cartão pelo correio, sem saber o seu endereço, endereçado só a "quem ajuda, Fuchsia". Chega.',
    'Ser ninguém é o jeito mais difícil de ser herói. É também o único em que ninguém te usa.'
  ]}
},

ch3_final_proximo:{
  texto:[
    'O menino do Butterfree aparece no Centro de Saffron no dia seguinte, às sete da manhã, com a mochila feita e a mãe do lado, de braço cruzado.',
    fala('a mãe do menino', 'Ele vai. Ele ia de qualquer jeito. Prefiro que vá com alguém.', 'baixo')
  ],
  final:{id:'heroi_proximo', titulo:'O PRÓXIMO', texto:[
    'Você ensina o que aprendeu: faz o que tiver na frente, depois o próximo. Água, sombra, sono. Linha de fogo. Janela de banheiro sem grade.',
    'Em dois anos, ele ajuda mais gente do que você ajudou. Em três, ele tem um menino do lado dele, com um Caterpie no ombro.',
    'Ninguém lembra mais de você em Kanto. Lembram dele.',
    'É isso que você queria. Você descobre que era isso que você queria no dia em que ele te liga, de longe, e diz: "eu fiz o que tinha na frente."'
  ]}
}

}
}
);
