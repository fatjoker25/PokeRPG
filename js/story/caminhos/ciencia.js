/* ============================================================
   CAMINHO DA CIÊNCIA — laboratório, nota de campo, dado que não fecha
   Pra quem está do lado do laboratório de Pallet (ou é conhecid{o|a}
   como pesquisador) na hora do desvio. Quem acompanha: o Professor
   Oak e a Dra. Vera Quill, que conta Pokémon por contrato.
   ============================================================ */

/* ── I · A CONTAGEM (depois do 12) ─────────────────────────── */
CAPITULOS.push(
{
num:12.03, titulo:'A Contagem', local:'Rotas 13 a 15 — fora da cerca', ambiente:'campo', nivelArea:40,
tom:'sombrio',
ancora:{local:'rota13', chamada:'No acostamento da Rota 13 tem uma barraca de lona verde com uma prancheta pendurada do lado de fora, e ninguém dentro.'},
entradas:['cc1_a_mensagem'],
inicio: d => 'cc1_a_mensagem',
cenas:{

cc1_a_mensagem:{
  texto:[
    'O PokéNav recebe uma mensagem longa, sem parágrafo, de quem digita com dois dedos.',
    fala('Professor Oak', 'A planilha de manejo da Zona Safári diz que fora da cerca, nas Rotas 13, 14 e 15, sobra Pokémon. Que tem de mais. Que precisa retirar.'),
    fala('Professor Oak', 'Eu não acredito em planilha que eu não vi ninguém preencher. Conta pra mim. Três dias, três rotas, transecto de um quilômetro, hora por hora.'),
    d => d.flags.ln_ciencia_nota_boa ? 'Ele não precisa explicar o que é transecto. Você aprendeu com um ninho de Pidgey e sete voltas.' : 'Transecto, ele explica na mensagem seguinte, é andar uma linha reta e contar tudo que aparece dos dois lados, sempre do mesmo jeito.'
  ],
  ef:{flag:'cm_ciencia_1', registrar:'O Professor Oak te pediu um censo de três dias nas rotas fora da cerca da Zona Safári.'},
  escolhas:[
    {texto:'Começar pela Rota 13, de madrugada.', vai:'cc1_a_barraca'}
  ]
},

cc1_a_barraca:{
  texto:[
    'No acostamento da Rota 13 tem uma barraca de lona verde com uma prancheta pendurada do lado de fora.',
    'A dona da barraca chega da trilha com bota molhada até o joelho e um contador mecânico em cada mão.',
    d => { Nomes.apresentar('a pesquisadora de bota'); return 'No crachá plastificado preso na alça da mochila: DRA. VERA QUILL — CENSO CONTRATADO.'; },
    fala('a pesquisadora de bota', 'Você tá contando também? Pra quem?'),
    fala('a pesquisadora de bota', 'Eu conto pra quem paga. Esse ano quem paga é a reserva. Ano passado também. E o retrasado.', 'baixo')
  ],
  ef:{npc:{nome:'Dra. Quill', opiniao:0, memoria:'Encontrou você contando Pokémon na mesma rota que ela, pra outra pessoa.'}},
  escolhas:[
    {texto:'"Pro laboratório de Pallet. Pro Professor Oak."', vai:'cc1_o_nome_do_oak'},
    {texto:'"Pra mim mesm{o|a}."', vai:'cc1_o_metodo'},
    {texto:'Perguntar quanto ela contou no ano passado.', vai:'cc1_o_numero_dela'}
  ]
},

cc1_o_nome_do_oak:{
  falante:'a pesquisadora de bota',
  vozes:['N','N','N'],
  texto:[
    'Ela para de desamarrar a bota.',
    '"O Oak. Ele me reprovou numa banca há vinte anos. Disse que a minha amostra era pequena demais pra ter opinião."',
    '"Ele estava certo." Ela volta a desamarrar. "Isso é o pior dele: ele quase sempre está certo e diz na sua cara."'
  ],
  escolhas:[
    {texto:'Perguntar o método dela.', vai:'cc1_o_metodo'},
    {texto:'Perguntar quanto ela contou no ano passado.', vai:'cc1_o_numero_dela'}
  ]
},

cc1_o_numero_dela:{
  falante:'a pesquisadora de bota',
  vozes:['P','N','N','N'],
  texto:[
    '"Quanto você contou no ano passado?"',
    '"Eu não conto. Eu estimo." Ela mostra os dois contadores. "Eu conto num quilômetro e multiplico pela área. É assim que se faz em todo lugar."',
    '"O problema é que o quilômetro quem escolhe é a reserva. E a reserva escolhe o quilômetro da beira do rio, onde todo mundo vai beber."',
    'Ela sabe o que acabou de dizer. Ela fala como quem está há muito tempo esperando alguém perguntar.'
  ],
  ef:{flag:'cm_ciencia_quilometro_do_rio', registrar:'O censo contratado da reserva estima a população fora da cerca contando só o quilômetro da beira do rio.'},
  escolhas:[
    {texto:'Fazer o seu transecto onde ninguém escolheu.', vai:'cc1_o_metodo'}
  ]
},

cc1_o_metodo:{
  texto:[
    'O transecto que o Professor pediu é chato do jeito que ciência boa é chata: um quilômetro em linha reta, no mesmo horário, contando tudo dos dois lados até dez metros.',
    'Você escolhe as linhas jogando a moeda no mapa, como ele ensinou, pra ninguém escolher por você.',
    'A primeira linha cai no meio de um capinzal seco, longe do rio.'
  ],
  escolhas:[
    {texto:'Andar a linha inteira, contando tudo.', vai:'cc1_a_linha'},
    {texto:'Andar até a metade e estimar o resto, como todo mundo.', vai:'cc1_a_metade',
     ef:{flag:'cm_ciencia_estimou', rep:{eixo:'ruim', delta:1, motivo:'Estimou o censo em vez de contar'}}}
  ]
},

cc1_a_linha:{
  texto:['O capim bate na cintura. Contar no capim é contar com o ouvido antes do olho.'],
  teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção',
         critico:'cc1_contou_bem', sucesso:'cc1_contou_bem', parcial:'cc1_contou_mal', falha:'cc1_o_tauros'}
},

cc1_o_tauros:{
  texto:[
    'Você não ouve o Tauros. Você ouve o chão.',
    'Ele está deitado no capim no meio da sua linha, e você entra no território dele de cabeça baixa, contando Venonat.',
    'Ele levanta.'
  ],
  batalha:{dex:128, nivel:d => nivelDoCaminho(d, -3), tipo:'selvagem', fuga:true,
           vitoria:'cc1_contou_mal', derrota:'cc1_contou_mal', gameover:'gameover'}
},

cc1_contou_bem:{
  texto:[
    'Três dias, três rotas, nove linhas de um quilômetro.',
    'Fora da beira do rio não tem excesso de nada. Tem Venonat no capim, Rattata nos barrancos, um bando de Doduo atravessando a Rota 14 de manhã, e menos de um Pokémon a cada cem metros.',
    'A planilha da reserva diz quarenta por quilômetro. O seu caderno diz sete.',
    'Sete. Com hora, lugar e o nome de cada linha.'
  ],
  ef:{flag:'cm_ciencia_sete', itens:{'Caderno do censo (sete por km)':1},
      rep:{eixo:'bom', delta:2, motivo:'Contou nove linhas de transecto fora da cerca, com hora e lugar'},
      registrar:'O seu censo fora da cerca deu sete Pokémon por quilômetro. A planilha da reserva diz quarenta.'},
  escolhas:[
    {texto:'Mostrar pra Dra. Quill antes de mandar.', vai:'cc1_mostrou'},
    {texto:'Mandar direto pro Professor.', vai:'cc1_mandou'}
  ]
},

cc1_contou_mal:{
  texto:[
    'Você termina as linhas, mas com buraco: uma hora perdida aqui, uma linha cortada ali, um trecho contado de longe.',
    'Mesmo assim, o número é baixo. Muito mais baixo que o da planilha.',
    'O Professor vai perguntar dos buracos. Ele sempre pergunta dos buracos.'
  ],
  ef:{flag:'cm_ciencia_buraco', itens:{'Caderno do censo (com buracos)':1},
      rep:{eixo:'bom', delta:1, motivo:'Contou as rotas fora da cerca, mesmo com buracos'}},
  escolhas:[
    {texto:'Mostrar pra Dra. Quill antes de mandar.', vai:'cc1_mostrou'},
    {texto:'Mandar direto pro Professor, com os buracos anotados.', vai:'cc1_mandou',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Mandou o censo com os buracos anotados'}}}
  ]
},

cc1_a_metade:{
  texto:[
    'Meio quilômetro, multiplicado por dois. É mais rápido, e o número que sai é bonito e redondo.',
    'Também é o mesmo erro da planilha, do outro lado: você escolheu onde parar.',
    'Na mensagem pro Professor, você escreve "transecto completo". O teclado não reclama.'
  ],
  ef:{itens:{'Caderno do censo (estimado)':1}},
  escolhas:[
    {texto:'Mandar pro Professor.', vai:'cc1_mandou'}
  ]
},

cc1_mostrou:{
  falante:'a pesquisadora de bota',
  vozes:['N','N','N'],
  texto:[
    'A Dra. Quill lê o seu caderno sentada na porta da barraca, sem pressa, linha por linha.',
    '"Isso aqui me tira o contrato."',
    '"E é melhor do que o que eu entrego há quatro anos." Ela fecha o caderno. "Eu vou assinar junto, se você deixar. Com o meu nome em cima do seu, eles não conseguem dizer que foi uma criança brincando de contar."'
  ],
  ef:{npc:{nome:'Dra. Quill', opiniao:3, memoria:'Você mostrou o seu censo antes de mandar, e ela pediu pra assinar junto.'}},
  escolhas:[
    {texto:'Deixar ela assinar junto.', vai:'cc1_mandou',
     ef:{flag:'cm_ciencia_quill_assinou', rep:{eixo:'bom', delta:2, motivo:'Dividiu a assinatura do censo com quem arrisca o contrato'}}},
    {texto:'Mandar só com o seu nome. Ela tem contrato a perder; você não.', vai:'cc1_mandou',
     ef:{flag:'cm_ciencia_so_seu_nome', rep:{eixo:'bom', delta:1, motivo:'Protegeu o contrato da Dra. Quill assinando sozinh{o|a}'}}}
  ]
},

cc1_mandou:{
  texto:[
    d => d.flags.cm_ciencia_estimou
      ? fala('Professor Oak', 'Número bonito. Redondo. Você andou a linha inteira?')
      : fala('Professor Oak', 'Sete.', 'baixo'),
    d => d.flags.cm_ciencia_estimou
      ? 'Ele espera. O PokéNav mostra "digitando" e para, e mostra de novo.'
      : fala('Professor Oak', 'Faz trinta anos que eu desconfio dessa planilha e nunca tive o caderno que você tem agora.'),
    d => d.flags.cm_ciencia_quill_assinou ? fala('Professor Oak', 'A Vera assinou? A Vera Quill?', 'riso') : ''
  ],
  escolhas:[
    {texto:'Contar a verdade sobre a linha.', vai:'cc1_fim', cond:d => !!d.flags.cm_ciencia_estimou,
     ef:{flag:'cm_ciencia_confessou', rep:{eixo:'bom', delta:2, motivo:'Confessou ao Professor que estimou o censo'}}},
    {texto:'"Inteira."', vai:'cc1_fim', cond:d => !!d.flags.cm_ciencia_estimou,
     ef:{flag:'cm_ciencia_mentiu', rep:{eixo:'ruim', delta:2, motivo:'Mentiu ao Professor sobre o censo'}}},
    {texto:'"Pode publicar?"', vai:'cc1_fim', cond:d => !d.flags.cm_ciencia_estimou,
     ef:{flag:'cm_ciencia_publicar', rep:{eixo:'bom', delta:1, motivo:'Pediu pra publicar o censo'}}}
  ]
},

cc1_fim:{
  texto:[
    d => d.flags.cm_ciencia_confessou ? fala('Professor Oak', 'Obrigado por dizer. Agora volta e anda a outra metade. Eu espero.') : '',
    d => d.flags.cm_ciencia_publicar ? fala('Professor Oak', 'Vai pro boletim do laboratório. Ninguém lê o boletim do laboratório. Por enquanto.', 'riso') : '',
    'Na Rota 14, de manhã, o bando de Doduo atravessa a estrada de novo, no mesmo horário, e você anota sem querer.',
    'Sete por quilômetro. A planilha diz quarenta. A diferença entre os dois números é o que sai de madrugada pelo portão de serviço.'
  ],
  fim:true, resumo:'A contagem: nove linhas de um quilômetro, sete Pokémon por quilômetro e uma planilha que diz quarenta.'
}

}
},

/* ── II · A AMOSTRA 4 (depois do 19) ───────────────────────── */
{
num:19.03, titulo:'A Amostra 4', local:'Pallet — o laboratório', ambiente:'campo', nivelArea:56,
tom:'muito sombrio',
ancora:{local:'pallet', chamada:'No laboratório de Pallet a luz do fundo está acesa às duas da manhã, e o Professor não costuma ficar até tarde.'},
entradas:['cc2_o_frasco'],
inicio: d => 'cc2_o_frasco',
cenas:{

cc2_o_frasco:{
  texto:[
    'O laboratório de Pallet às duas da manhã cheira a café requentado e a papel.',
    'Em cima da bancada, numa caixa térmica com gelo, um frasco com etiqueta de lote: muda de pele, um tufo de pelo e uma gota seca numa lâmina. AMOSTRA 4.',
    fala('Professor Oak', 'Chegou pelo correio, sem remetente. Alguém de dentro da Estação 4 mandou. Alguém com medo e com bom treinamento, porque está bem conservada.', 'baixo'),
    fala('Professor Oak', 'Eu sou velho pra fazer a análise sozinho a noite inteira. Você não é.')
  ],
  ef:{flag:'cm_ciencia_2', registrar:'Uma amostra de unidade de viveiro da Estação 4 chegou ao laboratório de Pallet, sem remetente.'},
  escolhas:[
    {texto:'Fazer a análise com ele, a noite inteira.', vai:'cc2_a_analise'},
    {texto:'"Quem mandou?"', vai:'cc2_quem_mandou'}
  ]
},

cc2_quem_mandou:{
  texto:[
    'O Professor vira a caixa térmica. No fundo, por baixo do gelo, escrito à caneta no plástico da tampa, que é a única coisa que ninguém pensou em trocar:',
    '**"Galpão 2. Não procura."**',
    fala('Professor Oak', 'Então a gente não procura.', 'baixo'),
    d => d.npcs['Pascal'] ? 'Galpão 2. Você conhece uma pessoa que trabalha no galpão 2 e anda com três canetas na prancheta.' : 'Galpão 2. Você não conhece ninguém lá. Talvez seja melhor assim.'
  ],
  escolhas:[
    {texto:'Fazer a análise.', vai:'cc2_a_analise'}
  ]
},

cc2_a_analise:{
  texto:['Microscópio, reagente, a balança de precisão que o Professor não deixa ninguém tocar, e um caderno de bancada aberto na página em branco.'],
  teste:{status:'intelecto', dificuldade:7, nomeStatus:'Intelecto',
         critico:'cc2_o_resultado', sucesso:'cc2_o_resultado', parcial:'cc2_o_resultado_parcial', falha:'cc2_o_resultado_parcial'}
},

cc2_o_resultado:{
  texto:[
    'Às cinco e quarenta da manhã, o caderno de bancada tem três páginas e uma conclusão que nenhum dos dois quer escrever primeiro.',
    'A unidade da amostra 4 não tem marcador de idade nenhum acima de dois anos. Nenhum. As células param de se renovar antes disso, como relógio que já sai de fábrica marcado.',
    'Ninguém da Estação 4 escreveu isso em ata. Uma unidade de viveiro não envelhece: ela acaba, aos dois anos, e a Comissão compra a próxima.',
    fala('Professor Oak', 'Isso não é manejo. Isso é assinatura.', 'baixo')
  ],
  ef:{flag:'cm_ciencia_dois_anos', itens:{'Caderno de bancada da amostra 4':1},
      rep:{eixo:'bom', delta:2, motivo:'Analisou a amostra 4 e achou o prazo das unidades de viveiro'},
      registrar:'A amostra 4 mostra que unidade de viveiro não passa dos dois anos: acaba, e a Comissão compra a próxima.'},
  escolhas:[
    {texto:'Decidir o que fazer com isso.', vai:'cc2_o_que_fazer'}
  ]
},

cc2_o_resultado_parcial:{
  texto:[
    'O resultado sai torto: uma lâmina contaminada, uma leitura repetida três vezes com três números diferentes.',
    'O que dá pra afirmar é pouco: a unidade é jovem demais pro tamanho que tem, e as células dela trabalham rápido demais.',
    fala('Professor Oak', 'Pouco é muito, quando é verdade. A gente escreve o pouco.', 'baixo')
  ],
  ef:{flag:'cm_ciencia_pouco', itens:{'Caderno de bancada da amostra 4':1},
      rep:{eixo:'bom', delta:1, motivo:'Fez a análise da amostra 4 e escreveu só o que dava pra afirmar'}},
  escolhas:[
    {texto:'Decidir o que fazer com isso.', vai:'cc2_o_que_fazer'}
  ]
},

cc2_o_que_fazer:{
  texto:[
    'De manhã, um carro estaciona na frente do laboratório. Desce uma mulher de terninho com um envelope.',
    fala('a mulher do envelope', 'A Silph Co. tem interesse em parceria de pesquisa. Ouvimos dizer que o laboratório recebeu material raro.'),
    fala('a mulher do envelope', 'O envelope tem uma proposta de financiamento por três anos. O material vem com a gente, claro.'),
    fala('Professor Oak', 'Eu não sei de onde ela ouviu. Eu sei que foi rápido demais.', 'baixo')
  ],
  escolhas:[
    {texto:'Publicar tudo no boletim do laboratório, hoje, com o seu nome e o dele.', vai:'cc2_publicou',
     ef:{flag:'cm_ciencia_publicou', rep:{eixo:'bom', delta:3, motivo:'Publicou a análise da amostra 4 com o próprio nome'}}},
    {texto:'Aceitar a parceria da Silph.', vai:'cc2_vendeu',
     ef:{flag:'cm_ciencia_vendeu', dinheiro:6000, rep:{eixo:'ruim', delta:3, motivo:'Vendeu a amostra 4 pra Silph'}}},
    {texto:'Esconder a amostra e o caderno até ter mais.', vai:'cc2_escondeu',
     ef:{flag:'cm_ciencia_escondeu', rep:{eixo:'bom', delta:1, motivo:'Guardou a amostra 4 até ter prova maior'}}}
  ]
},

cc2_publicou:{
  texto:[
    'O boletim do laboratório tem quarenta assinantes, e trinta e nove são aposentados. O quadragésimo é uma redação de jornal.',
    'Às quatro da tarde, a mulher do envelope volta, sem envelope, com dois homens de colete preto.',
    fala('a mulher do envelope', 'O material é propriedade de pesquisa licenciada. Viemos buscar.', 'frio')
  ],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 0), tipo:'treinador', treinador:'Recolhedor da Comissão', fuga:false,
           vitoria:'cc2_ficou', derrota:'cc2_levaram', gameover:'gameover'}
},

cc2_ficou:{
  texto:[
    'As unidades caem no gramado do laboratório. Os Pokémon do Professor olham da janela do curral, quietos, como quem assiste.',
    'Os homens de colete recolhem e vão embora. A mulher anota alguma coisa e vai também.',
    fala('Professor Oak', 'Eles vão voltar com papel. Papel eu respondo com papel.', 'baixo')
  ],
  ef:{flag:'cm_ciencia_amostra_ficou', rep:{eixo:'bom', delta:1, motivo:'Defendeu o laboratório de Pallet'}},
  escolhas:[
    {texto:'Fechar o laboratório e dormir.', vai:'cc2_fim'}
  ]
},

cc2_levaram:{
  texto:[
    'Eles levam a caixa térmica. Não levam o caderno de bancada, porque o caderno estava no seu bolso.',
    fala('Professor Oak', 'Amostra se colhe de novo. O que a gente escreveu, não tira mais de ninguém.', 'baixo')
  ],
  ef:{flag:'cm_ciencia_levaram', hp:-2, causa:'O gramado do laboratório de Pallet'},
  escolhas:[
    {texto:'Fechar o laboratório e dormir.', vai:'cc2_fim'}
  ]
},

cc2_vendeu:{
  texto:[
    'O envelope tem seis mil de adiantamento e um contrato de vinte páginas que o Professor não lê.',
    'Ele não briga. Ele te entrega a caixa térmica e vai pro fundo do laboratório regar uma planta que já está regada.',
    fala('Professor Oak', 'A pesquisa vai ser feita. Por quem paga, com o resultado que quem paga quiser. Isso também é ciência. A pior parte dela.', 'baixo')
  ],
  ef:{npc:{nome:'Professor Oak', opiniao:-4, memoria:'Você vendeu a amostra 4 pra Silph na frente dele.'}},
  escolhas:[
    {texto:'Ir embora de Pallet.', vai:'cc2_fim'}
  ]
},

cc2_escondeu:{
  texto:[
    'O fundo falso da gaveta de mapas do Professor existe desde antes de você nascer. Ele nunca contou a ninguém por que tem.',
    'A amostra vai pra lá, com o caderno de bancada por cima.',
    'A mulher do envelope volta à tarde e encontra o laboratório aberto, o Professor dando aula de capim pra três crianças, e nada na bancada.'
  ],
  ef:{flag:'cm_ciencia_gaveta'},
  escolhas:[
    {texto:'Fechar o laboratório e dormir.', vai:'cc2_fim'}
  ]
},

cc2_fim:{
  texto:[
    'Dois anos. Uma unidade de viveiro acaba aos dois anos, e no papel isso se chama vida útil.',
    d => d.flags.cm_ciencia_vendeu ? 'O dinheiro da Silph está no seu bolso, e ele pesa menos do que devia.' : 'O caderno de bancada tem três páginas, com a letra de dois dedos do Professor e a sua por cima.',
    'Em Pallet, de madrugada, o laboratório apaga a luz do fundo.'
  ],
  fim:true, resumo:'A amostra 4: um frasco sem remetente, uma noite de bancada e dois anos de vida útil.'
}

}
},

/* ── III · A TERCEIRA EDIÇÃO (depois do 25) ─────────────────── */
{
num:25.03, titulo:'A Terceira Edição', local:'Saffron — o auditório da Liga', ambiente:'cidade', nivelArea:58,
tom:'muito sombrio',
ancora:{local:'saffron', chamada:'Na porta do auditório da Liga tem uma lista de quem defende trabalho hoje, e o seu nome está nela, escrito errado.'},
entradas:['cc3_a_banca'],
inicio: d => 'cc3_a_banca',
cenas:{

cc3_a_banca:{
  texto:[
    'O auditório da Liga em Saffron tem duzentas cadeiras e, hoje, quarenta pessoas. Na mesa da banca, três: um professor de Celadon, uma médica de Pokémon de Cinnabar, e o Dr. Hollis, da Estação 4.',
    fala('Professor Oak', 'O Hollis na banca. Isso não é coincidência, é convite.', 'baixo'),
    fala('Professor Oak', 'Hoje é a terceira edição do livro. A primeira eu escrevi sozinho. A segunda eu errei. Esta é sua também.'),
    d => d.flags.cm_ciencia_sete || d.flags.cm_ciencia_dois_anos ? 'No seu fichário: sete por quilômetro, dois anos de vida útil. Duas coisas que ninguém na mesa quer ouvir.' : 'No seu fichário, o que você conseguiu juntar. É menos do que você queria.'
  ],
  ef:{flag:'cm_ciencia_3', registrar:'Defendeu dados contra o manejo e o viveiro numa banca da Liga, com o Dr. Hollis na mesa.'},
  escolhas:[
    {texto:'Apresentar os números, sem adjetivo.', vai:'cc3_os_numeros',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Apresentou os números na banca da Liga sem adjetivo'}}},
    {texto:'Começar contando do bando de Doduo da Rota 14, do Tauros no capim, da gota na lâmina.', vai:'cc3_a_historia',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Contou na banca o que os números não contam'}}}
  ]
},

cc3_os_numeros:{
  falante:'Dr. Hollis',
  vozes:['N','N','N'],
  texto:[
    'Você fala doze minutos. Ninguém tosse.',
    '"Metodologia interessante." O Dr. Hollis folheia o seu fichário. "Amostra de um único observador, sem calibração externa, por três dias."',
    '"E uma análise laboratorial de uma amostra de origem desconhecida, sem cadeia de custódia. Com todo o respeito: é um caderno de excursão."'
  ],
  escolhas:[
    {texto:'Responder ponto por ponto.', vai:'cc3_a_resposta'}
  ]
},

cc3_a_historia:{
  falante:'Dr. Hollis',
  vozes:['N','N'],
  texto:[
    'Você fala do que viu. As quarenta pessoas da plateia param de olhar o relógio.',
    '"Comovente." O Dr. Hollis não sorri. "Ciência não é comoção. Me mostra o número e eu respeito. Me conta história e eu só lamento."'
  ],
  escolhas:[
    {texto:'Mostrar o número.', vai:'cc3_a_resposta'}
  ]
},

cc3_a_resposta:{
  texto:['Você tem uma resposta pra cada ponto. A questão é se ela sai na hora, na frente de duzentas cadeiras.'],
  teste:{status:'intelecto', dificuldade:8, nomeStatus:'Intelecto',
         critico:'cc3_venceu_a_banca', sucesso:'cc3_venceu_a_banca', parcial:'cc3_empate', falha:'cc3_empate'}
},

cc3_venceu_a_banca:{
  texto:[
    d => d.flags.cm_ciencia_quill_assinou ? 'Da plateia, uma mulher de bota levanta a mão e diz o próprio nome e o contrato que perdeu. A calibração externa estava sentada na fila oito.' : 'Você responde a calibração com as nove linhas sorteadas na moeda. Responde a custódia com o caderno de bancada, assinado e datado hora por hora.',
    'O professor de Celadon pede a palavra e diz que gostaria de ver o protocolo replicado. A médica de Pokémon de Cinnabar diz que ela replica.',
    'O Dr. Hollis fecha o fichário com cuidado, como quem pousa uma prancheta.'
  ],
  ef:{flag:'cm_ciencia_banca_aprovou', rep:{eixo:'bom', delta:3, motivo:'Defendeu os dados contra o manejo e o viveiro e convenceu a banca'}},
  escolhas:[
    {texto:'Ouvir o que o Hollis vai dizer.', vai:'cc3_o_hollis'}
  ]
},

cc3_empate:{
  texto:[
    'Você responde, mas responde pela metade, e a banca anota a metade.',
    'O resultado é a pior palavra da ciência: inconclusivo. Precisa de mais dados.',
    fala('Professor Oak', 'Mais dados é o que sempre se pede a quem tem razão cedo demais.', 'baixo')
  ],
  ef:{flag:'cm_ciencia_inconclusivo', rep:{eixo:'bom', delta:1, motivo:'Defendeu os dados na banca, mesmo saindo inconclusivo'}},
  escolhas:[
    {texto:'Ouvir o que o Hollis vai dizer.', vai:'cc3_o_hollis'}
  ]
},

cc3_o_hollis:{
  falante:'Dr. Hollis',
  vozes:['N','N','N'],
  texto:[
    'No corredor, depois, o Dr. Hollis te espera do lado do bebedouro.',
    '"Eu desenhei as unidades. Eu sei quanto elas duram. Eu escrevi isso em ata, numa ata que ninguém lê, e cumpri o meu dever."',
    '"Você quer que eu diga que estava errado. Eu não estava errado. Eu estava certo e o mundo era pior do que eu, e isso não muda o meu protocolo."',
    d => d.flags.cm_ciencia_publicou ? 'Ele tira do bolso o boletim do laboratório de Pallet, dobrado em quatro. Leu.' : ''
  ],
  escolhas:[
    {texto:'Voltar pro laboratório e escrever a terceira edição, devagar, até o fim.', vai:'cc3_final_tabela',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Escreveu a terceira edição com o Professor'}}},
    {texto:'Assumir sozinh{o|a} a autoria, pra que o laboratório do Professor não feche no lugar de você.', vai:'cc3_final_lacrado',
     ef:{rep:{eixo:'bom', delta:3, motivo:'Assumiu sozinh{o|a} a autoria pra proteger o laboratório de Pallet'}}},
    {texto:'Largar a banca, o boletim e o auditório. Voltar pro capim.', vai:'cc3_final_campo',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Largou a ciência de auditório pela ciência de campo'}}},
    {texto:'Seguir pro Planalto. A terceira edição pode esperar a jornada acabar.', vai:'cc3_seguir',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Guardou a terceira edição pra depois da jornada'}}}
  ]
},

cc3_seguir:{
  texto:[
    fala('Professor Oak', 'Vai. Livro bom é livro que espera o autor voltar com mais coisa.', 'riso'),
    'O ônibus da Liga pro Planalto sai às oito e quinze. O fichário vai no seu colo a viagem inteira.'
  ],
  ef:{flag:'cm_ciencia_seguiu_planalto'},
  fim:true, resumo:'A terceira edição: uma banca, um bebedouro e um homem que estava certo num mundo pior que ele.'
},

cc3_final_tabela:{
  texto:[
    'A terceira edição sai oito meses depois, com seiscentas páginas e uma tabela nova no capítulo sobre manejo.',
    'Na capa, dois nomes. O dele em cima, porque ele insistiu que ficasse embaixo e você insistiu mais.'
  ],
  final:{id:'ciencia_tabela', titulo:'A TABELA', texto:[
    'Ninguém lê livro de ciência. Mas todo técnico de reserva de Kanto tem um, na estante, e abre quando o chefe pede número.',
    'Em quatro anos, a planilha de manejo da Zona Safári muda o método. Ninguém anuncia. Só muda.',
    'Em Pallet, toda segunda, o Professor te manda uma mensagem longa, sem parágrafo, com um dado que não fecha.',
    'Você responde com sete voltas de um ninho de Pidgey, ou com nove linhas de um quilômetro. É o que vocês sabem fazer. É o bastante.'
  ]}
},

cc3_final_lacrado:{
  texto:[
    'O processo vem em nome de uma pessoa só: a sua. Uso indevido de material licenciado, difamação técnica.',
    'O laboratório de Pallet fica de fora porque você jurou, em cartório, que o Professor só emprestou a bancada.',
    fala('Professor Oak', 'Você mentiu num cartório por mim. Eu nunca vou te perdoar por isso.', 'baixo'),
    fala('Professor Oak', 'Nem me esquecer.', 'baixo')
  ],
  final:{id:'ciencia_lacrado', titulo:'O LABORATÓRIO LACRADO', texto:[
    'Você perde. A multa leva quatro anos pra pagar. O seu nome não pode mais assinar laudo nenhum em Kanto.',
    'O laboratório de Pallet continua aberto, e lá dentro o Professor ensina capim pra criança de sete anos, toda terça.',
    'Na parede do fundo, ao lado da gaveta de mapas de fundo falso, tem uma foto sua emoldurada, sem legenda.',
    'Os técnicos que passam pelo laboratório perguntam quem é. Ele diz: "Alguém que contou certo."'
  ]}
},

cc3_final_campo:{
  texto:[
    'Você sai do auditório pela porta do fundo, a que dá pro estacionamento, e não volta pra pegar o fichário.',
    'Na rodoviária, compra uma passagem pra Fuchsia. Da rodoviária de Fuchsia, vai a pé até a Rota 13.'
  ],
  final:{id:'ciencia_campo', titulo:'CAMPO', texto:[
    'A barraca de lona verde da Dra. Quill tem lugar pra dois, e ela não pergunta nada quando você chega.',
    'Vocês contam. Todo ano, toda linha, jogando a moeda no mapa. Não publicam em lugar nenhum: mandam pra quem pedir, e quase ninguém pede.',
    'Um dia, um técnico novo da reserva aparece na barraca com uma planilha e uma dúvida.',
    'Vocês mostram o caderno. Ele copia à mão, a noite inteira, e vai embora de madrugada sem agradecer, que é o certo: ele não tinha tempo pra isso.'
  ]}
}

}
}
);
