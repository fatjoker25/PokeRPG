/* ============================================================
   CAMINHO DA LIGA — quadra, torneio, plenário
   Pra quem é da Liga (instrutor, líder, elite, conselheiro) ou, sem
   lado nenhum, vive de ginásio (4 insígnias ou mais). Quem acompanha:
   a Coordenadora Maple, que organiza torneio de criança e não aguenta
   pai de criança.
   ============================================================ */

/* ── I · A COPA JÚNIOR DE FUCHSIA (depois do 12) ───────────── */
CAPITULOS.push(
{
num:12.06, titulo:'A Copa Júnior de Fuchsia', local:'Fuchsia — a quadra da escola', ambiente:'campo', nivelArea:40,
tom:'sombrio',
ancora:{local:'fuchsia', chamada:'Na quadra da escola de Fuchsia tem faixa pendurada, cadeira de plástico e trinta crianças com Pokémon no colo.'},
entradas:['cg1_a_quadra'],
inicio: d => 'cg1_a_quadra',
cenas:{

cg1_a_quadra:{
  texto:[
    'A Copa Júnior de Fuchsia é um torneio de criança de dez a doze anos, com chaveamento desenhado à mão numa cartolina.',
    d => { Nomes.apresentar('a coordenadora da quadra'); return 'Quem organiza é uma mulher de agasalho da Liga com um apito no pescoço e uma pasta embaixo do braço, onde se lê, em letra de máquina: COORDENADORA MAPLE.'; },
    fala('a coordenadora da quadra', 'O árbitro faltou. Você tem insígnia. Você apita.'),
    fala('a coordenadora da quadra', 'Regra é a da Liga, versão criança: dois Pokémon, sem item, sem golpe que derrube nível. E ninguém chora no meio da luta, que não deixa.', 'riso')
  ],
  ef:{flag:'cm_liga_1', registrar:'A Coordenadora Maple te pôs pra apitar a Copa Júnior de Fuchsia.'},
  escolhas:[
    {texto:'Pegar o apito.', vai:'cg1_as_lutas'}
  ]
},

cg1_as_lutas:{
  texto:[
    'As primeiras lutas são o que luta de criança é: um Caterpie que não quer atacar, um Pidgey que voa pra arquibancada, um menino que esquece o nome do próprio Pokémon de nervoso.',
    'Na semifinal, uma menina de dez anos com um Oddish e um Paras, de tênis furado, contra um menino de doze com um Growlithe que tem coleira de grife e um Ponyta de pelo escovado.',
    'Na arquibancada, um homem de terno claro filma o menino com uma câmera do tamanho de uma mala.'
  ],
  escolhas:[
    {texto:'Apitar a semifinal.', vai:'cg1_a_semifinal'}
  ]
},

cg1_a_semifinal:{
  texto:[
    'O Oddish da menina ganha do Growlithe na terceira troca, com um Stun Spore bem colocado e muita teimosia.',
    'Antes de você apitar o fim, o homem de terno claro já está do seu lado, com a mão no seu ombro.',
    fala('o pai do patrocínio', 'O Oddish estava segurando alguma coisa na folha. Eu vi da arquibancada. Item é desclassificação.'),
    fala('o pai do patrocínio', 'O patrocínio da copa é meu, aliás. As medalhas, a faixa, o lanche. Só pra você saber.', 'baixo')
  ],
  escolhas:[
    {texto:'Conferir o Oddish, na frente de todo mundo.', vai:'cg1_conferiu',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Conferiu o Oddish na frente de todo mundo antes de decidir'}}},
    {texto:'Desclassificar a menina, como ele pediu.', vai:'cg1_desclassificou',
     ef:{flag:'cm_liga_desclassificou', dinheiro:1000, rep:{eixo:'ruim', delta:3, motivo:'Desclassificou uma menina de dez anos a pedido do patrocinador'}}}
  ]
},

cg1_conferiu:{
  texto:[
    'Você se agacha e pede pra menina mostrar a folha do Oddish.',
    'Na folha tem um Ledyba de plástico, de enfeite, preso com cola. Ela pôs de manhã pra dar sorte.',
    'Não é item. Não faz nada. É um Ledyba de plástico.',
    fala('a coordenadora da quadra', 'Isso é enfeite. Regra da Liga, artigo onze: enfeite sem efeito é livre. Árbitro decide.', 'baixo')
  ],
  escolhas:[
    {texto:'Validar a vitória da menina.', vai:'cg1_validou',
     ef:{flag:'cm_liga_validou', rep:{eixo:'bom', delta:2, motivo:'Validou a vitória da menina contra o filho do patrocinador'}}},
    {texto:'Desclassificar assim mesmo. O pai do menino paga a copa.', vai:'cg1_desclassificou',
     ef:{flag:'cm_liga_desclassificou', dinheiro:1000, rep:{eixo:'ruim', delta:3, motivo:'Desclassificou uma menina por um enfeite'}}}
  ]
},

cg1_desclassificou:{
  texto:[
    'Você apita. A menina não chora: ela pega o Oddish no colo e tira o Ledyba de plástico da folha com muito cuidado, e guarda no bolso.',
    'O menino do Growlithe ganha a final de um Caterpie que não quer atacar.',
    'No fim, o homem de terno claro aperta a sua mão. Na palma dele tem um envelope dobrado.',
    fala('a coordenadora da quadra', 'Você apita a próxima também? Não. Não apita.', 'frio')
  ],
  ef:{npc:{nome:'Coordenadora Maple', opiniao:-3, memoria:'Você desclassificou uma menina de dez anos a pedido do patrocinador.'}},
  escolhas:[
    {texto:'Ir embora.', vai:'cg1_fim'}
  ]
},

cg1_validou:{
  texto:[
    'Você apita a vitória do Oddish. A arquibancada das crianças grita. A dos pais fica quieta, menos uma mãe de tênis furado que grita mais que as crianças.',
    'O homem de terno claro desce a arquibancada, tira o paletó e entrega pro filho segurar.',
    fala('o pai do patrocínio', 'Então o árbitro luta comigo. Exibição. Se eu ganhar, a semifinal se repete.'),
    fala('a coordenadora da quadra', 'Isso não existe no regulamento.', 'frio'),
    fala('o pai do patrocínio', 'O regulamento é meu, que eu paguei a impressão.')
  ],
  escolhas:[
    {texto:'Aceitar a exibição. Na frente das crianças.', vai:'cg1_exibicao'},
    {texto:'Recusar e mandar a final começar.', vai:'cg1_final',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Não deixou o patrocinador mudar o regulamento'}}}
  ]
},

cg1_exibicao:{
  texto:['Ele não é um pai qualquer. O time dele é de quem passou anos comprando o melhor.'],
  batalha:{dex:59, nivel:d => nivelDoCaminho(d, -1), tipo:'treinador', treinador:'o pai do patrocínio', fuga:false, arena:'ginasio',
           timeExtra:[{dex:78, nivel:d => nivelDoCaminho(d, 0)}, {dex:131, nivel:d => nivelDoCaminho(d, 1)}],
           vitoria:'cg1_venceu_o_pai', derrota:'cg1_perdeu_pro_pai', gameover:'gameover'}
},

cg1_venceu_o_pai:{
  texto:[
    'O Lapras dele cai na quadra de escola e a quadra inteira treme.',
    'Ele recolhe, veste o paletó, pega o filho pela mão e vai embora sem olhar pra trás. O filho olha.',
    'A final é Oddish contra Caterpie. O Caterpie, finalmente, ataca. O Oddish ganha assim mesmo.'
  ],
  ef:{flag:'cm_liga_venceu_o_pai', rep:{eixo:'bom', delta:2, motivo:'Venceu o patrocinador na frente das crianças e manteve o resultado'},
      npc:{nome:'Coordenadora Maple', opiniao:4, memoria:'Você apitou a Copa Júnior e venceu o patrocinador na quadra.'}},
  escolhas:[
    {texto:'Entregar a medalha.', vai:'cg1_fim'}
  ]
},

cg1_perdeu_pro_pai:{
  texto:[
    'Você perde. Ele não comemora: ele aponta pra quadra, pra repetir a semifinal.',
    'A menina do Oddish entra de novo, sem você pedir, e ganha de novo, mais rápido.',
    'Agora não tem enfeite pra reclamar. Tem só uma menina de tênis furado que ganhou duas vezes a mesma luta.'
  ],
  ef:{flag:'cm_liga_ela_ganhou_duas', hp:-1, causa:'A Copa Júnior de Fuchsia',
      rep:{eixo:'bom', delta:1, motivo:'Perdeu a exibição mas não mudou o regulamento'}},
  escolhas:[
    {texto:'Apitar a final.', vai:'cg1_final'}
  ]
},

cg1_final:{
  texto:[
    'A final é Oddish contra Caterpie. O Caterpie, finalmente, ataca. O Oddish ganha assim mesmo.',
    'A medalha é de latão com fita azul, e a menina põe no pescoço do Oddish, não no dela.'
  ],
  ef:{npc:{nome:'Coordenadora Maple', opiniao:3, memoria:'Você apitou a Copa Júnior até o fim, pelo regulamento.'}},
  escolhas:[
    {texto:'Ir embora.', vai:'cg1_fim'}
  ]
},

cg1_fim:{
  texto:[
    fala('a coordenadora da quadra', 'Ano que vem tem de novo. Com patrocinador ou sem.'),
    d => d.flags.cm_liga_desclassificou ? 'No caminho pra estrada, você passa pela menina sentada no meio-fio, com o Ledyba de plástico na palma da mão. Ela não olha pra você.' : 'No caminho pra estrada, você passa pela menina sentada no meio-fio, contando pro Oddish, em voz baixa, cada golpe da luta. Ele escuta.'
  ],
  fim:true, resumo:'A Copa Júnior de Fuchsia: uma cartolina, um Ledyba de plástico e um patrocinador de terno claro.'
}

}
},

/* ── II · A REGRA NOVA (depois do 19) ──────────────────────── */
{
num:19.06, titulo:'A Regra Nova', local:'Planalto Indigo — a quadra de treino', ambiente:'montanha', nivelArea:56,
tom:'muito sombrio',
ancora:{local:'planalto', chamada:'Na quadra de treino do Planalto, a Coordenadora Maple te espera com uma pasta que ela não quer abrir.'},
entradas:['cg2_a_pasta'],
inicio: d => 'cg2_a_pasta',
cenas:{

cg2_a_pasta:{
  texto:[
    d => { Nomes.apresentar('a coordenadora da quadra'); return 'A Coordenadora Maple está sentada na arquibancada vazia da quadra de treino, com uma pasta no colo e o apito no pescoço.'; },
    fala('a coordenadora da quadra', 'Programa Primeiro Pokémon. A Comissão propôs à Liga: toda criança de Kanto sem condição de pegar um inicial recebe uma unidade de viveiro, com laudo, de graça.'),
    fala('a coordenadora da quadra', 'De graça. A Liga adora de graça.', 'frio'),
    fala('a coordenadora da quadra', 'Eles querem um teste na quadra antes da votação. Criança da escola de treino contra unidade. Eu preciso de alguém que apite e que diga o que viu.')
  ],
  ef:{flag:'cm_liga_2', registrar:'A Comissão propôs à Liga dar unidades de viveiro como primeiro Pokémon de criança.'},
  escolhas:[
    {texto:'Apitar o teste.', vai:'cg2_o_teste'},
    {texto:'"E se o teste for bom?"', vai:'cg2_e_se'}
  ]
},

cg2_e_se:{
  falante:'a coordenadora da quadra',
  vozes:['P','N','N'],
  texto:[
    '"E se o teste for bom?"',
    '"Então a gente diz que foi bom. Eu não sou contra porque é da Comissão. Eu sou contra porque é de graça."',
    '"Nada que é de graça pra criança fica de graça pra sempre."'
  ],
  escolhas:[
    {texto:'Apitar o teste.', vai:'cg2_o_teste'}
  ]
},

cg2_o_teste:{
  texto:[
    'Doze crianças da escola de treino, com Pokémon que elas mesmas pegaram, contra doze unidades de viveiro com um técnico de jaleco dando ordem.',
    'As unidades ganham onze de doze. Elas obedecem na hora, sem erro, sem medo.',
    'A única que perde é contra uma menina com um Rattata desdentado que não obedece nada, e que morde a unidade quando a menina grita "não!".',
    'As outras onze crianças choram. As unidades não olham pra elas.'
  ],
  escolhas:[
    {texto:'Pedir pra lutar você mesm{o|a} contra as unidades.', vai:'cg2_luta'},
    {texto:'Escrever o relatório do teste.', vai:'cg2_o_relatorio'}
  ]
},

cg2_luta:{
  texto:['O técnico de jaleco não se incomoda. Ele já esperava. Ele chama as três melhores.'],
  batalha:{comissao:'tecnico', nivel:d => nivelDoCaminho(d, 0), tipo:'treinador', treinador:'Técnico do berçário', fuga:false, arena:'ginasio',
           vitoria:'cg2_venceu', derrota:'cg2_perdeu', gameover:'gameover'}
},

cg2_venceu:{
  texto:[
    'Você vence. Não porque é melhor: porque o seu time faz uma coisa que as unidades não fazem.',
    'Quando você erra a ordem, o seu Pokémon corrige sozinho. Quando a unidade erra a ordem, ela erra até o fim.',
    fala('a coordenadora da quadra', 'Você viu isso. Escreve isso.', 'baixo')
  ],
  ef:{flag:'cm_liga_viu_o_erro', rep:{eixo:'bom', delta:1, motivo:'Mostrou na quadra que as unidades não corrigem ordem errada'}},
  escolhas:[
    {texto:'Escrever o relatório do teste.', vai:'cg2_o_relatorio'}
  ]
},

cg2_perdeu:{
  texto:[
    'Você perde. Elas são boas. Elas são muito boas.',
    'Na arquibancada, as onze crianças que perderam assistem você perder também, e uma delas para de chorar.',
    fala('a coordenadora da quadra', 'Perder não muda o que você viu. Escreve o que você viu.', 'baixo')
  ],
  ef:{hp:-1, causa:'A quadra de treino do Planalto'},
  escolhas:[
    {texto:'Escrever o relatório do teste.', vai:'cg2_o_relatorio'}
  ]
},

cg2_o_relatorio:{
  texto:[
    'O relatório é pra comissão técnica da Liga, que vai ler antes de votar.',
    'Onze de doze. Esse é o número que todo mundo vai citar.',
    'O que o número não diz: que a única que perdeu, perdeu pra um Rattata que mordeu por conta própria. E que onze crianças choraram e nenhuma unidade olhou.'
  ],
  escolhas:[
    {texto:'Escrever tudo: o número, o Rattata, as onze crianças.', vai:'cg2_fim',
     ef:{flag:'cm_liga_relatorio_inteiro', rep:{eixo:'bom', delta:2, motivo:'Escreveu o relatório do teste inteiro, com o que o número não diz'}}},
    {texto:'Escrever só o número. Onze de doze.', vai:'cg2_fim',
     ef:{flag:'cm_liga_so_o_numero', dinheiro:1500, rep:{eixo:'ruim', delta:2, motivo:'Escreveu no relatório só o número que a Comissão queria'}}},
    {texto:'Escrever tudo e mandar cópia pra cada pai das doze crianças.', vai:'cg2_fim',
     ef:{flag:['cm_liga_relatorio_inteiro','cm_liga_pais'], rep:{eixo:'bom', delta:2, motivo:'Mandou o relatório do teste pros pais das crianças'}}}
  ]
},

cg2_fim:{
  texto:[
    d => d.flags.cm_liga_so_o_numero ? fala('a coordenadora da quadra', 'Onze de doze. Bonito. Vão citar o seu nome no plenário.', 'frio') : fala('a coordenadora da quadra', 'Vão dizer que você exagerou. Deixa dizerem. Exagero assinado vale mais que número sem nome.'),
    'Na saída da quadra, a menina do Rattata desdentado está sentada na escada, dando água pra ele numa tampinha de garrafa.'
  ],
  fim:true, resumo:'A regra nova: onze de doze, um Rattata desdentado e o que o número não diz.'
}

}
},

/* ── III · A VOTAÇÃO (depois do 25) ────────────────────────── */
{
num:25.06, titulo:'A Votação', local:'Planalto Indigo — o plenário da Liga', ambiente:'montanha', nivelArea:58,
tom:'muito sombrio',
ancora:{local:'planalto', chamada:'O plenário da Liga abre as portas às nove, e a pauta do dia tem uma linha só: Programa Primeiro Pokémon.'},
entradas:['cg3_o_plenario'],
inicio: d => 'cg3_o_plenario',
cenas:{

cg3_o_plenario:{
  texto:[
    'O plenário da Liga é uma sala redonda com quarenta cadeiras de vinil verde e um painel de votação que ninguém sabe ligar direito.',
    'Lance não está. Ele assina os documentos da Liga e não vem a plenário. Na cadeira dele, uma placa: AUSENTE.',
    fala('a coordenadora da quadra', 'Depois da audiência de segunda, a Comissão precisa disso aprovado mais do que nunca. É o jeito deles de virarem coisa boa no jornal.'),
    fala('a coordenadora da quadra', 'Você tem voz. Eu tenho voto. Usa a sua antes de eu usar o meu.')
  ],
  ef:{flag:'cm_liga_3', registrar:'O plenário da Liga vota o Programa Primeiro Pokémon.'},
  escolhas:[
    {texto:'Pedir a palavra.', vai:'cg3_a_palavra'}
  ]
},

cg3_a_palavra:{
  texto:[
    'Você tem cinco minutos no microfone do plenário. O relógio na parede é de ponteiro e anda alto.',
    d => d.flags.cm_liga_relatorio_inteiro ? 'Você tem o relatório inteiro do teste da quadra, com o Rattata e as onze crianças.' : d.flags.cm_liga_so_o_numero ? 'Você tem o relatório que você assinou: onze de doze. Os conselheiros já citaram o seu nome duas vezes, a favor.' : 'Você tem o que viu numa quadra de escola, numa copa de criança, com um Ledyba de plástico.'
  ],
  teste:{status:'carisma', dificuldade:7, nomeStatus:'Carisma',
         critico:'cg3_convenceu', sucesso:'cg3_convenceu', parcial:'cg3_meio', falha:'cg3_meio'}
},

cg3_convenceu:{
  texto:[
    'Você fala quatro minutos e para antes do quinto. O silêncio do plenário dura o minuto que sobrou.',
    'Um conselheiro velho, de gravata torta, pede a palavra e diz que começou a jornada com um Rattata que não obedecia nada, e que é o melhor Pokémon que ele já teve.'
  ],
  ef:{flag:'cm_liga_convenceu', rep:{eixo:'bom', delta:2, motivo:'Falou no plenário da Liga contra o Programa Primeiro Pokémon'}},
  escolhas:[
    {texto:'Esperar a votação.', vai:'cg3_o_corredor'}
  ]
},

cg3_meio:{
  texto:[
    'Você fala, mas a voz sai baixa e o relógio de ponteiro fala mais alto.',
    'Os conselheiros anotam. Uns anotam o que você disse; outros, a hora.'
  ],
  ef:{rep:{eixo:'bom', delta:1, motivo:'Falou no plenário da Liga, mesmo sem convencer'}},
  escolhas:[
    {texto:'Esperar a votação.', vai:'cg3_o_corredor'}
  ]
},

cg3_o_corredor:{
  texto:[
    'No intervalo, no corredor, um homem de terno claro te espera do lado do bebedouro. Você já viu ele numa arquibancada de escola.',
    fala('o pai do patrocínio', 'Eu sou do conselho de patrocinadores da Liga agora. O programa tem um rosto de campanha, e o rosto ainda não foi escolhido.'),
    fala('o pai do patrocínio', 'Alguém jovem, com insígnia, que fale bonito no microfone. Paga bem. Muito bem.')
  ],
  escolhas:[
    {texto:'Recusar e voltar pro plenário.', vai:'cg3_a_votacao',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Recusou ser o rosto do Programa Primeiro Pokémon'}}},
    {texto:'Desafiar ele ali: se você ganhar, ele retira o patrocínio do programa.', vai:'cg3_desafio',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Desafiou o patrocinador do programa no corredor do plenário'}}},
    {texto:'Aceitar ser o rosto do programa.', vai:'cg3_final_comprada',
     ef:{rep:{eixo:'ruim', delta:4, motivo:'Virou o rosto do programa que dá unidade de viveiro pra criança'}}}
  ]
},

cg3_desafio:{
  texto:['Ele sorri, tira o paletó de novo, e dessa vez entrega pra um segurança segurar.'],
  batalha:{dex:131, nivel:d => nivelDoCaminho(d, 2), tipo:'treinador', treinador:'o pai do patrocínio', fuga:false, arena:'ginasio',
           timeExtra:[{dex:59, nivel:d => nivelDoCaminho(d, 2)}, {dex:78, nivel:d => nivelDoCaminho(d, 3)}, {dex:149, nivel:d => nivelDoCaminho(d, 4)}],
           vitoria:'cg3_retirou', derrota:'cg3_a_votacao', gameover:'gameover'}
},

cg3_retirou:{
  texto:[
    'O Dragonite dele cai no tapete do corredor do plenário e o bebedouro balança.',
    'Ele cumpre. Ele é desse tipo: compra tudo, mas paga o que perde.',
    fala('o pai do patrocínio', 'Retirado. O meu filho ainda fala daquela menina do Oddish, sabia? Toda semana.', 'baixo')
  ],
  ef:{flag:'cm_liga_retirou_patrocinio', rep:{eixo:'bom', delta:2, motivo:'Venceu o patrocinador e ele retirou o dinheiro do programa'}},
  escolhas:[
    {texto:'Voltar pro plenário.', vai:'cg3_a_votacao'}
  ]
},

cg3_a_votacao:{
  texto:[
    'O painel de votação liga na terceira tentativa.',
    d => (d.flags.cm_liga_convenceu || d.flags.cm_liga_retirou_patrocinio) ? 'Vinte e dois contra, quinze a favor, três abstenções. O Programa Primeiro Pokémon não passa.' : 'Vinte e um a favor, dezoito contra, uma abstenção. O Programa Primeiro Pokémon passa.',
    fala('a coordenadora da quadra', 'Pronto. E agora a parte que não tem painel.', 'baixo')
  ],
  ef:{executar:d => { if (d.flags.cm_liga_convenceu || d.flags.cm_liga_retirou_patrocinio) d.flags.cm_liga_programa_caiu = true; else d.flags.cm_liga_programa_passou = true; return []; }},
  escolhas:[
    {texto:'Ficar no plenário, como {conselheiro|conselheira}, {instrutor|instrutora} ou o que te deixarem ser.', vai:'cg3_final_plenario', cond:d => !!d.flags.cm_liga_programa_caiu,
     ef:{rep:{eixo:'bom', delta:3, motivo:'Ficou na Liga pra mudar ela por dentro'}}},
    {texto:'Largar o Planalto e ir dar aula numa quadra de terra.', vai:'cg3_final_quadra',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Largou o Planalto pra dar aula a criança numa quadra de terra'}}},
    {texto:'Seguir pro que te espera no Planalto, que não é o plenário.', vai:'cg3_seguir',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Seguiu a jornada depois da votação'}}}
  ]
},

cg3_seguir:{
  texto:[
    fala('a coordenadora da quadra', 'Vai. Plenário tem toda semana. Você não.', 'riso'),
    'No corredor, o painel de votação desliga sozinho e ninguém liga de novo.'
  ],
  ef:{flag:'cm_liga_seguiu'},
  fim:true, resumo:'A votação: um painel que não liga, um relógio de ponteiro e uma placa de AUSENTE.'
},

cg3_final_plenario:{
  texto:[
    'Você fica. A Coordenadora Maple te apresenta pra cada conselheiro pelo nome, e diz o nome de cada criança da Copa Júnior junto.',
    'A cadeira que te dão é a de vinil verde mais rasgada do plenário. Você não pede outra.'
  ],
  final:{id:'liga_plenario', titulo:'O PLENÁRIO', texto:[
    'Em cinco anos, a Liga muda três regras: criança escolhe o primeiro Pokémon que pega, não o que recebe; árbitro de torneio júnior não pode ser pago por patrocinador; e todo relatório técnico vem com o que o número não diz.',
    'Nenhuma das três tem o seu nome. Todas três têm a sua letra, em algum rascunho.',
    'Todo ano você apita a Copa Júnior de Fuchsia. Uma menina de tênis furado, agora com dezesseis, aparece pra ajudar na cartolina do chaveamento.',
    'O Oddish dela virou Vileplume. O Ledyba de plástico ainda está colado numa das pétalas.'
  ]}
},

cg3_final_comprada:{
  texto:[
    'O contrato de rosto de campanha tem doze páginas e uma foto sua de agasalho da Liga, sorrindo, com um Eevee de lote no colo.',
    'A Coordenadora Maple vê o cartaz no corredor do plenário e não arranca. Ela só para de te cumprimentar.'
  ],
  final:{id:'liga_comprada', titulo:'A LIGA COMPRADA', texto:[
    'O seu rosto aparece em cartaz em todo Centro Pokémon de Kanto, do lado de uma frase: "TODA CRIANÇA MERECE UM PRIMEIRO AMIGO."',
    'O programa distribui quatro mil unidades no primeiro ano. Elas obedecem perfeitamente.',
    'Você fica conhecid{o|a} em Kanto inteiro, e rico, e convidad{o|a} pra todo evento da Liga.',
    'Numa rota qualquer, um menino com um Eevee de lote te reconhece do cartaz e pede autógrafo. O Eevee olha pra ele esperando ordem. Você assina rápido e vai embora antes de ver se ele manda alguma.'
  ]}
},

cg3_final_quadra:{
  texto:[
    'A quadra de terra fica atrás da escola da sua cidade, com duas traves de madeira e um muro onde alguém pintou um Pikachu torto.',
    'No primeiro dia aparecem três crianças. No segundo, nove.'
  ],
  final:{id:'liga_quadra', titulo:'A QUADRA DE TERRA', texto:[
    'Você não ensina tática. Ensina água, sombra e sono, e ensina a deixar o Pokémon corrigir a ordem errada sozinho.',
    'Ninguém paga. Às vezes uma mãe deixa um bolo no muro com um bilhete.',
    'De lá saem, em dez anos, quatro treinadores que chegam ao Planalto. Nenhum deles com unidade de lote.',
    'A Coordenadora Maple vem uma vez por ano, de agasalho da Liga, e apita uma copa de criança na sua quadra de terra, com chaveamento desenhado à mão numa cartolina.'
  ]}
}

}
}
);
