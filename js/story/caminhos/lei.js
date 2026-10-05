/* ============================================================
   CAMINHO DA LEI — Patrulha, Polícia, Auditoria, perícia
   Três capítulos que só existem pra quem está do lado da lei na hora
   do desvio (docs/CAMINHOS.md). Quem acompanha: o Sargento Holt, o
   Delegado Crane (Fuchsia) e a Delegada Thorne (Saffron).
   ============================================================ */

/* ── I · A BLITZ DA ROTA 18 (depois do 12) ─────────────────── */
CAPITULOS.push(
{
num:12.01, titulo:'A Blitz da Rota 18', local:'Rota 18 — a ciclovia', ambiente:'campo', nivelArea:40,
tom:'muito sombrio',
ancora:{local:'rota16', chamada:'Na entrada da ciclovia tem um cavalete da Patrulha, e um colete pendurado nele, do seu tamanho.'},
entradas:['cl1_o_colete', 'cl1_o_radio'],
inicio: d => d.flags.sabe_do_manejo || d.flags.ouviu_manejo ? 'cl1_o_radio' : 'cl1_o_colete',
cenas:{

cl1_o_colete:{
  texto:[
    'São duas e meia da manhã e a ciclovia está vazia, iluminada a cada cem metros por um poste que zumbe.',
    d => { Nomes.apresentar('o sargento de Viridian'); return 'No cavalete da Patrulha, com a lanterna apontada pro chão, está o sargento. HOLT, no bolso do uniforme, bordado torto.'; },
    fala('o sargento de Viridian', 'Bloqueio de rotina. É o que está escrito na ordem.'),
    fala('o sargento de Viridian', 'Rotina às duas e meia da manhã, na única estrada que sai do portão de serviço da Zona Safári. Eu também sei ler.', 'baixo')
  ],
  ef:{flag:'cm_lei_1', registrar:'A Patrulha montou um bloqueio na Rota 18, de madrugada, na saída do portão de serviço da Zona Safári.'},
  escolhas:[
    {texto:'"Quem pediu o bloqueio?"', vai:'cl1_quem_pediu'},
    {texto:'Ir até o portão de serviço antes do caminhão sair.', vai:'cl1_o_portao'},
    {texto:'Assumir o cavalete e esperar.', vai:'cl1_o_cavalete'}
  ]
},

cl1_o_radio:{
  texto:[
    'O rádio do colete chia uma vez e fala com a voz de quem está lendo:',
    fala('o sargento de Viridian', 'Bloqueio na Rota 18, duas e meia. Você é o segundo nome da escala. O primeiro sou eu.'),
    d => { Nomes.apresentar('o sargento de Viridian'); return 'Na guarita improvisada da ciclovia, o sargento Holt já está de lanterna na mão.'; },
    'Você sabe o que sai de madrugada pelo portão de serviço da Zona Safári. A cidade chama de manejo.',
    fala('o sargento de Viridian', 'Pela sua cara, você sabe o que a gente vai parar hoje. Melhor. Assim eu não preciso fingir que não sei.', 'baixo')
  ],
  ef:{flag:'cm_lei_1', registrar:'A Patrulha montou um bloqueio na Rota 18, de madrugada, na saída do portão de serviço da Zona Safári.'},
  escolhas:[
    {texto:'"Quem pediu o bloqueio?"', vai:'cl1_quem_pediu'},
    {texto:'Ir até o portão de serviço antes do caminhão sair.', vai:'cl1_o_portao'},
    {texto:'Assumir o cavalete e esperar.', vai:'cl1_o_cavalete'}
  ]
},

cl1_quem_pediu:{
  falante:'o sargento de Viridian',
  vozes:['N','N','N'],
  texto:[
    '"O delegado de Fuchsia." Holt desliga a lanterna pra falar, como se a luz atrapalhasse.',
    '"Ele pediu o bloqueio e pediu que o bloqueio não achasse nada. Na mesma ligação. Em frases seguidas."',
    'Um carro escuro encosta no acostamento, sem sirene, e desce dele um homem de casaco por cima do pijama.',
    d => { Nomes.apresentar('o delegado de Fuchsia'); return 'No crachá preso no casaco, com a foto mais nova do que ele: BASIL CRANE — DELEGADO.'; },
    '"Tudo tranquilo, sargento?"'
  ],
  ef:{flag:'cm_lei_conheceu_crane',
      npc:{nome:'Delegado Crane', opiniao:0, memoria:'Apareceu no bloqueio da Rota 18 de casaco por cima do pijama.'}},
  escolhas:[
    {texto:'Perguntar ao delegado, na frente do Holt, o que o bloqueio deve achar.', vai:'cl1_perguntou_ao_crane',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Perguntou na cara do delegado o que o bloqueio devia achar'}}},
    {texto:'Ligar o gravador do PokéNav no bolso e deixar ele falar.', vai:'cl1_gravou',
     ef:{flag:'cm_lei_gravou', rep:{eixo:'bom', delta:1, motivo:'Gravou a conversa com o delegado'}}},
    {texto:'Dizer que está tudo tranquilo.', vai:'cl1_o_cavalete',
     ef:{flag:'cm_lei_calou', rep:{eixo:'ruim', delta:1, motivo:'Disse ao delegado o que ele queria ouvir'}}}
  ]
},

cl1_perguntou_ao_crane:{
  falante:'Delegado Crane',
  vozes:['P','N','N','N'],
  texto:[
    '"O que esse bloqueio tem que achar, delegado?"',
    '"Bicicleta sem farol." Ele sorri. Os dentes são muito brancos pro resto dele.',
    'Holt olha pro chão.',
    '"Tem muita bicicleta sem farol na ciclovia, {garoto|garota}. Você nem imagina."',
    '"E o caminhão que sai às três?"'
  ],
  ef:{npc:{nome:'Delegado Crane', opiniao:-2, memoria:'Você perguntou, na frente do sargento, o que o bloqueio devia achar.'}},
  escolhas:[
    {texto:'Esperar a resposta.', vai:'cl1_a_resposta'}
  ]
},

cl1_a_resposta:{
  falante:'Delegado Crane',
  vozes:['N','N'],
  texto:[
    'Ele não responde do caminhão. Ele responde de você.',
    '"Você é {o|a} da guarita de Viridian. Eu li a sua ficha no carro, vindo pra cá."',
    '"Ficha boa. Ficha que pode ficar boa por muito tempo, se a pessoa souber o que é rotina."',
    'Ele volta pro carro e não liga o motor. Fica lá dentro, com o vidro meio aberto, olhando a estrada.'
  ],
  ef:{presagio:'Ele não foi embora. Ele ficou pra ver.'},
  escolhas:[
    {texto:'Voltar pro cavalete.', vai:'cl1_o_cavalete'}
  ]
},

cl1_gravou:{
  falante:'Delegado Crane',
  vozes:['N','N','N'],
  texto:[
    'O gravador do PokéNav não faz barulho nenhum. Você testou duas vezes no Centro, numa conversa sobre o tempo.',
    'O delegado fala com o Holt como se você fosse parte do cavalete.',
    '"Sai um baú às três e pouco. Papel em ordem, transporte de manejo sanitário. Você confere o papel e libera."',
    '"Se tiver alguma coisa fora do papel, você me liga. Não escreve. Me liga."',
    '"Rotina, sargento. Rotina é a coisa mais bonita que tem."'
  ],
  ef:{flag:'cm_lei_tem_gravacao', itens:{'Gravação do bloqueio':1},
      registrar:'Gravou o Delegado Crane mandando liberar o caminhão do manejo sem escrever nada.',
      npc:{nome:'Delegado Crane', opiniao:0, memoria:'Falou na sua frente sem saber que o PokéNav gravava.'}},
  escolhas:[
    {texto:'Voltar pro cavalete.', vai:'cl1_o_cavalete'}
  ]
},

cl1_o_portao:{
  texto:[
    'O portão de serviço fica a oitocentos metros, depois de uma curva de pinheiro e de uma casa onde mora um velho que acorda com caminhão.',
    'Às três e dez o portão abre sozinho, com um motor elétrico que range.',
    'Sai um baú branco, sem logotipo, com dois motoqueiros na frente. Eles andam devagar, de farol baixo.',
    'A placa você lê na primeira passada: três letras e quatro números, com a lama em cima de um deles.'
  ],
  ef:{flag:'cm_lei_placa', itens:{'Placa do baú (anotada)':1},
      rep:{eixo:'bom', delta:1, motivo:'Foi conferir o portão do manejo antes de esperar no cavalete'},
      registrar:'Anotou a placa do baú que sai do portão de serviço da Zona Safári às três e dez.'},
  escolhas:[
    {texto:'Voltar correndo pro cavalete antes deles.', vai:'cl1_o_cavalete'},
    {texto:'Cortar caminho pelo mato.', vai:'cl1_o_mato'}
  ]
},

cl1_o_mato:{
  texto:['O mato da beira da ciclovia é fechado, e no escuro todo galho parece trilha.'],
  teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção',
         critico:'cl1_atalho', sucesso:'cl1_atalho', parcial:'cl1_o_cavalete', falha:'cl1_o_cavalete'}
},

cl1_atalho:{
  texto:[
    'Pelo mato dá dois minutos a menos. Você chega no cavalete sem fôlego e com carrapicho até o joelho.',
    'Dá tempo de dizer ao Holt a placa, o número de motoqueiros e que o farol está baixo de propósito.',
    fala('o sargento de Viridian', 'Farol baixo é quem não quer ser visto de longe. Bom.')
  ],
  ef:{flag:'cm_lei_avisou_holt', moral:2},
  escolhas:[
    {texto:'Assumir o cavalete.', vai:'cl1_o_cavalete'}
  ]
},

cl1_o_cavalete:{
  texto:[
    'Às três e vinte e dois o baú aparece na curva da ciclovia, com os dois motoqueiros na frente.',
    'Você levanta a mão. O baú para. Os motoqueiros param um pouco depois, de lado, com o motor ligado.',
    'O motorista entrega o papel pela janela antes de você pedir: TRANSPORTE DE MANEJO SANITÁRIO — DESTINAÇÃO: ROTA 21.',
    'Tem carimbo, tem assinatura, tem o brasão da reserva. Atrás, dentro do baú, alguma coisa bate uma vez na parede de metal.',
    d => d.flags.cm_lei_conheceu_crane ? 'No acostamento, o vidro do carro escuro está meio aberto.' : 'Holt segura a lanterna no papel e não diz nada.'
  ],
  escolhas:[
    {texto:'Pedir pra abrir o baú.', vai:'cl1_abrir'},
    {texto:'Anotar a placa e liberar, pra seguir depois.', vai:'cl1_seguir',
     ef:{flag:'cm_lei_seguiu', rep:{eixo:'bom', delta:1, motivo:'Deixou o baú ir pra descobrir pra onde ia'}}},
    {texto:'Conferir o papel e liberar. O papel está em ordem.', vai:'cl1_liberou',
     ef:{flag:'cm_lei_liberou', rep:{eixo:'ruim', delta:2, motivo:'Liberou o baú do manejo sem abrir'}}}
  ]
},

cl1_abrir:{
  falante:'Motoqueiro da escolta',
  vozes:['P','N','N'],
  texto:[
    '"Abre o baú, por favor."',
    'O motorista não se mexe. Quem se mexe é o motoqueiro mais perto, que desce da moto sem desligar.',
    '"O papel tá em ordem, colete."',
    '"A gente tem hora."',
    'Ele solta a primeira Pokébola no asfalto, devagar, como quem coloca uma xícara na mesa.'
  ],
  batalha:{dex:110, nivel:d => nivelDoCaminho(d, -2), tipo:'treinador', treinador:'Motoqueiro da escolta', fuga:false,
           timeExtra:[{dex:89, nivel:d => nivelDoCaminho(d, -1)}, {dex:24, nivel:d => nivelDoCaminho(d, 0)}],
           vitoria:'cl1_carroceria', derrota:'cl1_fugiram', gameover:'gameover'}
},

cl1_fugiram:{
  texto:[
    'O seu último cai, e o motoqueiro já está em cima da moto antes de você recolher.',
    'O baú arranca. Os dois motoqueiros vão atrás, agora de farol alto.',
    fala('o sargento de Viridian', 'Deixa. Não corre atrás de moto a pé.'),
    d => d.flags.cm_lei_placa ? 'Você tem a placa. É pouco. É alguma coisa.' : 'Você não tem a placa. Ficou com o cheiro de óleo queimado e uma Pokébola rachada no asfalto que não é sua.'
  ],
  ef:{flag:'cm_lei_fugiram', hp:-2, causa:'A blitz da Rota 18',
      rep:{eixo:'bom', delta:1, motivo:'Tentou abrir o baú do manejo e apanhou por isso'}},
  escolhas:[
    {texto:'Escrever o relatório.', vai:'cl1_o_relatorio'}
  ]
},

cl1_carroceria:{
  texto:[
    'O motoqueiro recolhe o time com raiva e não tenta de novo. O motorista desce e abre o baú ele mesmo, sem olhar pra dentro.',
    'São gaiolas de grade fina, empilhadas em três alturas, presas com cinta.',
    'Nidoran, Exeggcute, um Rhyhorn jovem deitado de lado, dois Venonat, um Tauros sem a ponta de um chifre. Todos quietos de um jeito que não é sono.',
    'Em cada gaiola, uma etiqueta de papel com um código à caneta. Nenhuma tem nome de espécie.',
    fala('o sargento de Viridian', 'Manejo sanitário.', 'baixo'),
    fala('o sargento de Viridian', 'Nenhum deles tá doente. Olha o pelo. Olha o olho.', 'baixo')
  ],
  ef:{flag:'cm_lei_abriu',
      rep:{eixo:'bom', delta:2, motivo:'Abriu o baú do manejo e viu o que tinha dentro'},
      registrar:'O baú do manejo levava Pokémon saudáveis, sedados, com etiqueta de código no lugar da espécie. Destino escrito: Rota 21.'},
  escolhas:[
    {texto:'Apreender o baú inteiro.', vai:'cl1_apreendeu',
     ef:{flag:'cm_lei_apreendeu', rep:{eixo:'bom', delta:2, motivo:'Apreendeu o baú do manejo na Rota 18'}}},
    {texto:'Lacrar com o lacre da Patrulha e chamar a perícia, como manda o regulamento.', vai:'cl1_lacrou',
     ef:{flag:'cm_lei_lacrou', rep:{eixo:'bom', delta:2, motivo:'Lacrou o baú pra perícia, pelo regulamento'}}},
    {texto:'Abrir as gaiolas ali mesmo, na beira da ciclovia.', vai:'cl1_soltou',
     ef:{flag:'cm_lei_soltou', moral:5, rep:{eixo:'bom', delta:1, motivo:'Soltou os Pokémon do baú na beira da estrada'}}}
  ]
},

cl1_apreendeu:{
  falante:'Delegado Crane',
  vozes:['N','N','P','N'],
  texto:[
    'O carro escuro liga o farol.',
    d => { if (d.flags.cm_lei_conheceu_crane) return 'O delegado desce, agora sem fingir pressa.';
           Nomes.apresentar('o delegado de Fuchsia'); return 'Desce um homem de casaco por cima do pijama, com um crachá de delegado: BASIL CRANE.'; },
    '"Apreender um transporte autorizado é abuso, {garoto|garota}. Abuso é crime."',
    '"Então o senhor me prende junto com o baú."',
    'Ele olha pro Holt, que segura a lanterna firme no papel, e decide que hoje não.',
    '"O baú vai pro pátio de Fuchsia. O pátio é meu."'
  ],
  ef:{npc:{nome:'Delegado Crane', opiniao:-4, memoria:'Você apreendeu o baú do manejo na frente dele e disse pra ele te prender junto.'},
      presagio:'O pátio é dele.'},
  escolhas:[
    {texto:'Deixar ir pro pátio de Fuchsia e fotografar cada etiqueta antes.', vai:'cl1_o_relatorio',
     ef:{flag:'cm_lei_fotos', itens:{'Fotos das etiquetas do baú':1}, rep:{eixo:'bom', delta:1, motivo:'Fotografou as etiquetas antes de entregar o baú'}}},
    {texto:'Levar o baú pro posto da Patrulha, não pro pátio dele.', vai:'cl1_o_relatorio',
     ef:{flag:'cm_lei_levou_ao_posto', rep:{eixo:'bom', delta:1, motivo:'Levou o baú apreendido pra Patrulha, não pro pátio do delegado'}}}
  ]
},

cl1_lacrou:{
  texto:[
    'O lacre da Patrulha é uma fita plástica numerada que só sai cortada.',
    'Você passa a fita nas duas portas do baú, anota o número no livro da guarita, assina e pede pro Holt assinar embaixo.',
    fala('o sargento de Viridian', 'Número do lacre, hora, placa, nome dos dois. Agora ninguém some com isso sem deixar um buraco no livro.'),
    'A perícia de Fuchsia chega às seis, com sono. Corta o lacre na frente de vocês dois e conta as gaiolas em voz alta.',
    'Quarenta e uma.'
  ],
  ef:{flag:'cm_lei_41', registrar:'Quarenta e uma gaiolas no baú do manejo, lacradas e contadas pela perícia de Fuchsia.'},
  escolhas:[
    {texto:'Escrever o relatório.', vai:'cl1_o_relatorio'}
  ]
},

cl1_soltou:{
  texto:[
    'O motorista não te impede. Ele se afasta e acende um cigarro e olha pro outro lado.',
    'Gaiola por gaiola. Os primeiros não saem: ficam olhando a porta aberta como se fosse uma pergunta difícil.',
    'O Rhyhorn sai primeiro, bambo. Os outros vão atrás dele, um por um, pro mato da beira da ciclovia, onde não tem cerca.',
    fala('o sargento de Viridian', 'Isso não tem no regulamento.', 'baixo'),
    fala('o sargento de Viridian', 'Eu não vou escrever que fui contra. Eu também não vou escrever que fui a favor. Você escreve.')
  ],
  ef:{registrar:'Soltou os Pokémon do baú do manejo na beira da Rota 18.',
      presagio:'Sem cerca, o mato é deles. Com cerca, era de alguém.'},
  escolhas:[
    {texto:'Escrever o relatório.', vai:'cl1_o_relatorio'}
  ]
},

cl1_seguir:{
  texto:[
    'Você anota a placa, devolve o papel e acena. O baú vai, os motoqueiros vão.',
    'Na bicicleta da guarita dá pra seguir de longe, com o farol apagado. A ciclovia desce até a beira do mar.',
    'No fim da Rota 19, num píer de madeira que não está em mapa nenhum, tem uma balsa baixa esperando com o motor ligado.',
    'As gaiolas passam pra balsa em vinte minutos, de mão em mão. A balsa sai pro oeste sem luz.',
    'Oeste, daqui, é mar aberto até a Rota 21.'
  ],
  ef:{flag:['cm_lei_balsa','cm_lei_placa'], itens:{'Placa do baú (anotada)':1},
      registrar:'O baú do manejo descarregou num píer sem mapa no fim da Rota 19, numa balsa que saiu pro oeste.'},
  escolhas:[
    {texto:'Voltar e escrever o relatório.', vai:'cl1_o_relatorio'}
  ]
},

cl1_liberou:{
  texto:[
    'Você devolve o papel. O baú vai. Os motoqueiros vão.',
    'Dentro do baú, alguma coisa bate na parede de metal mais uma vez, na curva.',
    d => d.flags.cm_lei_conheceu_crane ? 'O carro escuro sai do acostamento logo depois, sem pressa, e o delegado acena de dentro com dois dedos.' : 'No livro da guarita, a linha das três e vinte e dois fica com a palavra que o papel mandou: rotina.',
    fala('o sargento de Viridian', 'Eu não vou escrever no livro que você liberou.', 'baixo'),
    fala('o sargento de Viridian', 'Você escreve.', 'baixo')
  ],
  ef:{npc:{nome:'Delegado Crane', opiniao:3, memoria:'Você liberou o baú sem abrir, como ele queria.'}},
  escolhas:[
    {texto:'Escrever o relatório.', vai:'cl1_o_relatorio'}
  ]
},

cl1_o_relatorio:{
  texto:[
    'O formulário da Patrulha tem três folhas e um campo chamado OBSERVAÇÕES com quatro linhas.',
    d => {
      if (d.flags.cm_lei_abriu) return 'Quatro linhas pra quarenta e um Pokémon sem nome numa grade. Você escreve pequeno.';
      if (d.flags.cm_lei_balsa) return 'Quatro linhas pra um píer que não existe e uma balsa sem luz.';
      return 'Quatro linhas pra uma madrugada em que, no papel, não aconteceu nada.';
    },
    d => d.flags.cm_lei_tem_gravacao ? 'No bolso, o PokéNav tem quatro minutos de um delegado mandando não escrever.' : '',
    fala('o sargento de Viridian', 'O relatório vai pro delegado de Fuchsia. É a regra. A cópia, a regra não diz pra onde vai.')
  ],
  escolhas:[
    {texto:'Escrever tudo, com o nome do delegado, e mandar pela via normal.', vai:'cl1_fim',
     ef:{flag:'cm_lei_relatorio_inteiro', rep:{eixo:'bom', delta:2, motivo:'Escreveu o relatório da blitz inteiro, com o nome do delegado'},
         npc:{nome:'Delegado Crane', opiniao:-2, memoria:'O nome dele está no seu relatório.'}}},
    {texto:'Escrever tudo e mandar a cópia pra Auditora Brill.', vai:'cl1_fim', cond:d => !!d.npcs['Auditora Brill'],
     ef:{flag:'cm_lei_copia_brill', rep:{eixo:'bom', delta:2, motivo:'Mandou a cópia do relatório da blitz pra auditoria'},
         npc:{nome:'Auditora Brill', opiniao:2, memoria:'Recebeu de você a cópia do relatório da blitz da Rota 18.'}}},
    {texto:'Escrever "nada consta".', vai:'cl1_fim',
     ef:{flag:'cm_lei_nada_consta', rep:{eixo:'ruim', delta:2, motivo:'Assinou "nada consta" num relatório que constava'},
         npc:{nome:'Delegado Crane', opiniao:2, memoria:'Você escreveu "nada consta". Ele vai lembrar disso como favor.'}}}
  ]
},

cl1_fim:{
  texto:[
    'O sol sai em cima da ciclovia e ela vira de novo o que é de dia: uma estrada de bicicleta, com casal correndo e criança de capacete.',
    d => {
      if (d.flags.cm_lei_soltou) return 'Na beira do mato, um Venonat olha a estrada de cima de uma folha, e não desce.';
      if (d.flags.cm_lei_lacrou) return 'O número do lacre está no livro da guarita, com duas assinaturas embaixo.';
      if (d.flags.cm_lei_apreendeu) return 'O baú foi pra onde foi. As etiquetas estão fotografadas, ou não.';
      if (d.flags.cm_lei_balsa) return 'Em algum lugar a oeste, uma balsa sem luz chegou onde ia.';
      return 'Às três e vinte e dois de amanhã, outro baú vai passar por aqui.';
    },
    fala('o sargento de Viridian', 'Vai dormir. A estrada ainda vai estar aqui.', 'baixo')
  ],
  fim:true, resumo:'A blitz da Rota 18: um baú de manejo sanitário, um delegado de pijama e quatro linhas de observação.'
}

}
},

/* ── II · O INQUÉRITO (depois do 19) ─────────────────────────── */
{
num:19.01, titulo:'O Inquérito', local:'Saffron — a delegacia', ambiente:'cidade', nivelArea:57,
tom:'muito sombrio',
ancora:{local:'saffron', chamada:'Na delegacia de Saffron tem uma pasta com o seu nome na capa, e alguém riscou o carimbo de URGENTE.'},
entradas:['cl2_a_pasta'],
inicio: d => 'cl2_a_pasta',
cenas:{

cl2_a_pasta:{
  texto:[
    'A delegacia de Saffron ocupa dois andares de um prédio de repartição, com uma escada que range no quarto degrau e em mais nenhum.',
    d => { Nomes.apresentar('a delegada de Saffron'); return 'A sala da delegada tem uma planta morta e uma placa de mesa virada pra quem entra: DELEGADA MARA THORNE.'; },
    fala('a delegada de Saffron', 'Inquérito sobre a Estação 4, na Rota 21. Denúncia anônima, três folhas, nenhuma com sobrenome.'),
    fala('a delegada de Saffron', 'O Conselho me ligou duas vezes pra saber quem ia pegar. Isso é tudo que eu precisava saber pra dar pra você.', 'baixo'),
    d => d.flags.cm_lei_1 ? (d.flags.cm_lei_balsa ? 'Rota 21. Você lembra de uma balsa sem luz saindo pro oeste.' : 'Rota 21. Estava escrito num papel de manejo, numa madrugada na ciclovia.') : 'Você esteve na Estação 4. Você sabe o que tem nas baias.'
  ],
  ef:{flag:'cm_lei_2',
      npc:{nome:'Delegada Thorne', opiniao:2, memoria:'Te deu o inquérito da Estação 4 porque o Conselho ligou duas vezes.'},
      registrar:'A Delegada Thorne, de Saffron, te deu o inquérito sobre a Estação 4.'},
  escolhas:[
    {texto:'Ler a pasta inteira antes de qualquer coisa.', vai:'cl2_a_leitura'},
    {texto:'"Quem do Conselho ligou?"', vai:'cl2_quem_ligou'},
    {texto:'Ir direto à Estação 4.', vai:'cl2_a_estacao'}
  ]
},

cl2_quem_ligou:{
  falante:'a delegada de Saffron',
  vozes:['P','N','N','N'],
  texto:[
    '"Quem do Conselho ligou?"',
    '"Uma secretária, das duas vezes. Educada. Perguntou o seu nome antes de eu dizer que era você."',
    'Ela pega a caneta e bate na mesa, três vezes.',
    '"Eu não disse. Ela disse. Eu só confirmei."',
    '"Então já sabem que é você. Trabalha sabendo."'
  ],
  ef:{flag:'cm_lei_sabem_de_voce'},
  escolhas:[
    {texto:'Ler a pasta.', vai:'cl2_a_leitura'},
    {texto:'Ir à Estação 4.', vai:'cl2_a_estacao'}
  ]
},

cl2_a_leitura:{
  texto:[
    'A denúncia diz três coisas, em letra de quem escreve rápido com medo: que as baias da Estação 4 recebem Pokémon que chegam "de fora" e saem "com código"; que tem um galpão onde ninguém entra sem dois crachás; e que as unidades que não vingam saem em saco preto às terças.',
    'Junto, grampeada, uma carta em papel timbrado da Comissão, assinada por um advogado. Ela chegou antes do inquérito ser aberto.',
    d => d.flags.cm_lei_fotos || d.flags.cm_lei_41 ? 'Você abre o PokéNav e põe as fotos da ciclovia do lado da denúncia. As etiquetas à caneta têm o mesmo jeito de letra.' : 'A carta tem a data de antes. Isso já é uma resposta.'
  ],
  ef:{flag:'cm_lei_leu_tudo', rep:{eixo:'bom', delta:1, motivo:'Leu o inquérito inteiro antes de agir'},
      registrar:'A carta do advogado da Comissão chegou antes do inquérito da Estação 4 ser aberto.'},
  escolhas:[
    {texto:'Ir à Estação 4 ouvir quem trabalha lá.', vai:'cl2_a_estacao'},
    {texto:'Chamar o advogado da carta pra depor primeiro.', vai:'cl2_o_advogado'}
  ]
},

cl2_o_advogado:{
  falante:'Dr. Bramble',
  vozes:['N','N','N','P','N'],
  texto:[
    d => { Nomes.apresentar('o advogado da Comissão'); return 'O advogado chega antes da hora, com um terno cinza claro e um cartão que ele deixa em cima da mesa sem você pedir: DR. OTIS BRAMBLE.'; },
    '"A Estação 4 é área de pesquisa licenciada. A licença está anexada. O manejo é técnico."',
    '"O inquérito, com todo o respeito, é uma confusão de competência. Pesquisa não é caso de polícia."',
    '"E saco preto às terças?"',
    '"Resíduo biológico, com destinação certificada." Ele não pisca. "Quer o certificado? Eu tenho cópia aqui."'
  ],
  ef:{npc:{nome:'Dr. Bramble', opiniao:0, memoria:'Depôs no inquérito da Estação 4 com o certificado de resíduo na pasta.'}},
  escolhas:[
    {texto:'Pedir o certificado e conferir o número no cartório.', vai:'cl2_o_certificado',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Conferiu no cartório o certificado do advogado'}}},
    {texto:'Ir à Estação 4.', vai:'cl2_a_estacao'}
  ]
},

cl2_o_certificado:{
  texto:[
    'O cartório da rua Dez abre até as cinco e cobra oito pokedólares a cópia.',
    'O número do certificado existe. É de uma empresa de destinação de resíduo de hospital, de Celadon.',
    'A empresa tem um caminhão. O caminhão tem registro de pesagem. Nas terças, ele pesa a mesma coisa na ida e na volta da Rota 21.',
    'Ninguém leva nada dali. O saco preto fica.'
  ],
  ef:{flag:'cm_lei_pesagem', itens:{'Registro de pesagem das terças':1},
      rep:{eixo:'bom', delta:1, motivo:'Descobriu que o caminhão de resíduo volta da Estação 4 com o mesmo peso'},
      registrar:'O caminhão de resíduo pesa o mesmo na ida e na volta da Estação 4. O que sai em saco preto fica lá.'},
  escolhas:[
    {texto:'Ir à Estação 4.', vai:'cl2_a_estacao'}
  ]
},

cl2_a_estacao:{
  texto:[
    'Na portaria da Estação 4, com a cerca de três metros atrás, um segurança novo de colete preto pede o documento e o motivo.',
    'Você mostra a pasta. Ele lê o carimbo de inquérito, liga pra alguém, desliga.',
    fala('Segurança da Estação 4', 'Pode entrar. Acompanhado.'),
    d => d.npcs['Pascal'] ? 'O acompanhante é o Pascal, do galpão 2, com a mesma caneta no bolso e a mesma cara de quem acha que regra é regra.' : 'O acompanhante é um técnico de jaleco com três canetas na prancheta, que não fala o caminho inteiro.'
  ],
  escolhas:[
    {texto:'Pedir pra ver o galpão de dois crachás.', vai:'cl2_o_galpao'},
    {texto:'Conversar com o acompanhante, longe das câmeras.', vai:'cl2_a_testemunha'}
  ]
},

cl2_a_testemunha:{
  texto:[
    'Atrás do berçário tem um corredor sem câmera, porque a câmera queimou e o pedido de troca está "em análise".',
    d => d.npcs['Pascal']
      ? fala('o colega da enfermaria', 'Eu escrevi a denúncia.', 'baixo')
      : fala('o técnico da prancheta', 'Eu escrevi a denúncia.', 'baixo'),
    d => d.npcs['Pascal']
      ? fala('o colega da enfermaria', 'Três folhas. Eu tremia tanto que reescrevi a terceira. Se você me chamar pra depor, eu perco o emprego e ninguém mais fala.', 'baixo')
      : fala('o técnico da prancheta', 'Se você me chamar pra depor, eu perco o emprego e ninguém mais fala.', 'baixo'),
    'Ele te dá um papel dobrado em oito: o horário dos sacos de terça, com o número das baias.'
  ],
  ef:{flag:'cm_lei_testemunha', itens:{'Horário dos sacos de terça':1},
      registrar:'Quem escreveu a denúncia da Estação 4 trabalha lá e tem medo de depor.'},
  escolhas:[
    {texto:'Prometer que o nome dele não sai.', vai:'cl2_o_galpao',
     ef:{flag:'cm_lei_protegeu_fonte', rep:{eixo:'bom', delta:2, motivo:'Protegeu quem denunciou a Estação 4'}}},
    {texto:'Dizer que sem depoimento não há processo.', vai:'cl2_o_galpao',
     ef:{flag:'cm_lei_pediu_depoimento', rep:{eixo:'bom', delta:1, motivo:'Pediu depoimento formal à testemunha'}}}
  ]
},

cl2_o_galpao:{
  texto:[
    'O galpão de dois crachás fica no fim do corredor. O segundo crachá não é do acompanhante.',
    'Na frente da porta, um segurança mais velho, de colete preto, com a mão no cinto onde ficam as Pokébolas.',
    fala('Segurança da Estação 4', 'Inquérito não tem mandado. Sem mandado, não entra.'),
    fala('Segurança da Estação 4', 'E se entrar sem mandado, eu tenho autorização pra impedir. Por escrito.')
  ],
  escolhas:[
    {texto:'Entrar assim mesmo.', vai:'cl2_a_luta',
     ef:{flag:'cm_lei_forcou', rep:{eixo:'ruim', delta:1, motivo:'Forçou a porta do galpão sem mandado'}}},
    {texto:'Voltar pra delegacia e pedir o mandado.', vai:'cl2_a_decisao',
     ef:{flag:'cm_lei_pelo_mandado', rep:{eixo:'bom', delta:1, motivo:'Voltou pra pedir o mandado em vez de forçar a porta'}}}
  ]
},

cl2_a_luta:{
  texto:['O segurança solta as Pokébolas dele no corredor estreito sem dizer mais nada. As unidades saem com o código pintado na pele.'],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 0), tipo:'treinador', treinador:'Segurança da Estação 4', fuga:false,
           vitoria:'cl2_dentro', derrota:'cl2_expulso', gameover:'gameover'}
},

cl2_dentro:{
  texto:[
    'As duas unidades caem e ficam onde caíram, sem reagir, esperando ordem.',
    'Dentro do galpão tem uma câmara fria com porta de aço e uma mesa de inox com uma balança.',
    'Na balança, um livro de registro. Na coluna DESTINAÇÃO, a palavra que se repete é "inviável", e do lado de cada uma tem uma assinatura de técnico e um número de lote.',
    'Você fotografa vinte páginas antes de o alarme tocar.'
  ],
  ef:{flag:'cm_lei_livro_inviavel', itens:{'Fotos do livro do galpão':1},
      rep:{eixo:'bom', delta:1, motivo:'Fotografou o livro do galpão da Estação 4'},
      registrar:'No galpão de dois crachás da Estação 4, um livro registra as unidades "inviáveis" por lote. Você tem vinte páginas.'},
  escolhas:[
    {texto:'Sair antes que cheguem.', vai:'cl2_a_decisao'}
  ]
},

cl2_expulso:{
  texto:[
    'O segurança não te machuca mais do que precisa. Ele te leva até a portaria pelo braço, com o seu time recolhido, e devolve a pasta.',
    fala('Segurança da Estação 4', 'Vai constar que você tentou. Vai constar que eu impedi. Os dois estão certos.'),
    'Na portaria, o segurança novo já está ao telefone com alguém.'
  ],
  ef:{flag:'cm_lei_expulso', hp:-2, causa:'O galpão da Estação 4'},
  escolhas:[
    {texto:'Voltar pra delegacia.', vai:'cl2_a_decisao'}
  ]
},

cl2_a_decisao:{
  falante:'a delegada de Saffron',
  vozes:['N','N','N'],
  texto:[
    'A Delegada Thorne lê o que você trouxe com os óculos na ponta do nariz, folha por folha.',
    '"Eu posso pedir o mandado. O juiz pode negar. Se negar, o Conselho sabe exatamente o que a gente tem e quando."',
    '"Eu posso arquivar, e você volta pra guarita, e o Conselho esquece o seu nome em seis meses."',
    '"E tem a terceira coisa, que eu não vou dizer em voz alta numa delegacia."',
    d => d.flags.cm_lei_protegeu_fonte ? 'Você prometeu um nome que não sai.' : ''
  ],
  escolhas:[
    {texto:'Pedir o mandado.', vai:'cl2_fim',
     ef:{flag:'cm_lei_mandado', rep:{eixo:'bom', delta:2, motivo:'Pediu o mandado contra a Estação 4'},
         npc:{nome:'Delegada Thorne', opiniao:3, memoria:'Vocês pediram o mandado da Estação 4 junt{os|as}, sabendo o risco.'}}},
    {texto:'Fazer a terceira coisa: entregar a cópia à imprensa.', vai:'cl2_fim',
     ef:{flag:'cm_lei_vazou', rep:{eixo:'bom', delta:1, motivo:'Vazou o inquérito da Estação 4 pra imprensa'},
         npc:{nome:'Delegada Thorne', opiniao:1, memoria:'Você fez a terceira coisa. Ela não viu e vai negar que viu.'}}},
    {texto:'Arquivar.', vai:'cl2_fim',
     ef:{flag:'cm_lei_arquivou', dinheiro:1500, rep:{eixo:'ruim', delta:3, motivo:'Arquivou o inquérito da Estação 4'},
         npc:{nome:'Delegada Thorne', opiniao:-3, memoria:'Você arquivou o inquérito que ela te deu porque ninguém mais pegaria.'}}}
  ]
},

cl2_fim:{
  texto:[
    d => {
      if (d.flags.cm_lei_mandado) return 'O pedido de mandado sai às cinco e cinquenta, protocolado, com o número do inquérito na capa e o seu nome no campo do responsável.';
      if (d.flags.cm_lei_vazou) return 'Às onze da noite, um envelope pardo sem remetente entra pela fresta da porta de uma redação.';
      return 'A pasta vai pro armário de aço do arquivo, gaveta de baixo, junto com outras que também tinham carimbo de URGENTE riscado.';
    },
    d => d.flags.cm_lei_arquivou ? 'No dia seguinte aparece um depósito na sua conta com a descrição "diária de diligência". Você não fez diligência nenhuma que pagasse diária.' : 'Na saída, a escada range no quarto degrau, e em mais nenhum.'
  ],
  fim:true, resumo:'O inquérito da Estação 4: uma denúncia sem sobrenome, uma carta que chegou antes e um galpão de dois crachás.'
}

}
},

/* ── III · O MANDADO (depois do 25) ──────────────────────────── */
{
num:25.01, titulo:'O Mandado', local:'Saffron — o fórum e a rua', ambiente:'cidade', nivelArea:58,
tom:'muito sombrio',
ancora:{local:'saffron', chamada:'Na porta do fórum de Saffron, a Delegada Thorne fuma um cigarro que ela parou de fumar há seis anos.'},
entradas:['cl3_o_forum'],
inicio: d => 'cl3_o_forum',
cenas:{

cl3_o_forum:{
  falante:'a delegada de Saffron',
  vozes:['N','N','N'],
  texto:[
    d => { Nomes.apresentar('a delegada de Saffron'); return 'A Delegada Thorne apaga o cigarro na sola do sapato e guarda a bituca no bolso, porque ninguém joga bituca na porta de fórum.'; },
    d => d.flags.cm_lei_mandado
      ? '"Saiu. O juiz assinou às oito da manhã, antes de alguém ligar pra ele. O nome no mandado é o da sala 704."'
      : d.flags.cm_lei_vazou
        ? '"A matéria saiu, a Liga se mexeu, e o juiz achou mais seguro assinar do que não assinar. O nome no mandado é o da sala 704."'
        : '"Você arquivou e eu desarquivei. Não pergunta como. Saiu o mandado, e o nome é o da sala 704."',
    '"Mandado de busca e apreensão, com condução. Vale até a meia-noite. Depois disso, alguém liga pra alguém."',
    'Ela te estende a folha. O nome da Presidente está escrito por extenso, com o número do documento dela embaixo.'
  ],
  ef:{flag:'cm_lei_3', itens:{'Mandado da sala 704':1},
      registrar:'O mandado de busca e condução contra a Presidente da Comissão saiu. Vale até a meia-noite.'},
  escolhas:[
    {texto:'Cumprir o mandado pelo regulamento, com a equipe.', vai:'cl3_a_equipe'},
    {texto:'Ir sozinh{o|a} antes, pra ninguém avisar.', vai:'cl3_sozinho',
     ef:{flag:'cm_lei_foi_sozinho', rep:{eixo:'bom', delta:1, motivo:'Foi cumprir o mandado antes que alguém avisasse'}}},
    {texto:'Ligar pro Holt primeiro.', vai:'cl3_o_holt'}
  ]
},

cl3_o_holt:{
  texto:[
    'Holt atende no segundo toque, como sempre, com barulho de rádio de guarita atrás.',
    d => d.flags.ln_lei_apito || d.flags.ln_lei_cafe
      ? fala('o sargento de Viridian', 'Aposentado não cumpre mandado. Mas aposentado pode estar na calçada, olhando, de casaco. Pra testemunhar.')
      : fala('o sargento de Viridian', 'Eu tô de plantão até as seis. Depois das seis eu tô onde você precisar, de colete.'),
    fala('o sargento de Viridian', 'E outra coisa: leva o livro. O de verdade. Mandado bem cumprido é o que tem registro de cada passo.', 'baixo')
  ],
  ef:{flag:'cm_lei_holt_junto', moral:3,
      npc:{nome:'Sargento Holt', opiniao:2, memoria:'Você ligou antes de cumprir o mandado da sala 704.'}},
  escolhas:[
    {texto:'Cumprir com a equipe e com o Holt de testemunha.', vai:'cl3_a_equipe'},
    {texto:'Ir só com o Holt.', vai:'cl3_sozinho'}
  ]
},

cl3_a_equipe:{
  texto:[
    'Quatro policiais, uma perita, a delegada e você, em dois carros sem sirene. Saffron às quatro da tarde não para pra ver polícia passar.',
    'Sala 704, sétimo andar, prédio comercial com farmácia no térreo. O elevador demora.',
    'Na porta da sala, quem abre é o Dr. Bramble, de terno cinza claro, como se estivesse esperando um entregador.',
    fala('Dr. Bramble', 'Boa tarde. A Presidente não está. A Presidente está em reunião no Planalto, numa agenda pública desde a semana passada.'),
    fala('Dr. Bramble', 'A busca, claro, pode ser feita. Eu acompanho, com o seu perdão.')
  ],
  ef:{rep:{eixo:'bom', delta:1, motivo:'Cumpriu o mandado da sala 704 pelo regulamento'}},
  escolhas:[
    {texto:'Fazer a busca inteira, gaveta por gaveta, com registro.', vai:'cl3_a_busca'},
    {texto:'Ir atrás da Presidente no Planalto antes da meia-noite.', vai:'cl3_o_carro'}
  ]
},

cl3_sozinho:{
  texto:[
    d => d.flags.cm_lei_holt_junto ? 'Holt está na calçada da farmácia, de casaco, fingindo que lê o jornal de ontem.' : 'Na calçada da farmácia ninguém olha pra você.',
    'Sala 704. A porta está aberta e a sala está quase vazia: três caixas de papelão fechadas com fita, uma mesa sem gaveta e um homem de terno cinza.',
    fala('Dr. Bramble', 'Você chegou antes da equipe. Isso é bonito e é inútil.'),
    fala('Dr. Bramble', 'As caixas vão pro arquivo da Comissão às cinco. Se você abrir sem equipe, nada do que estiver dentro vale em processo nenhum.')
  ],
  escolhas:[
    {texto:'Esperar a equipe com o pé na porta.', vai:'cl3_a_busca',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Segurou as caixas da sala 704 até a equipe chegar'}}},
    {texto:'Abrir as caixas assim mesmo.', vai:'cl3_abriu_sozinho',
     ef:{flag:'cm_lei_abriu_sem_equipe', rep:{eixo:'ruim', delta:1, motivo:'Abriu provas sem equipe nem registro'}}}
  ]
},

cl3_abriu_sozinho:{
  texto:[
    'Atas. Planilhas. Uma pasta de capa vermelha com "Art. 19" na lombada.',
    'Você lê, e é tudo o que você achava, e nada disso vale mais nada, porque foi você, sozinh{o|a}, quem abriu.',
    fala('Dr. Bramble', 'Prova contaminada. Eu agradeço, sinceramente. Me poupou um mês de petição.', 'frio')
  ],
  ef:{flag:'cm_lei_prova_perdida'},
  escolhas:[
    {texto:'Ir atrás da Presidente no Planalto.', vai:'cl3_o_carro'}
  ]
},

cl3_a_busca:{
  texto:[
    'A busca leva três horas. A perita numera cada folha, você assina cada lacre, e o Dr. Bramble anota tudo num caderninho, também.',
    'Numa caixa marcada ARQUIVO MORTO tem o original da planilha da Estação 4, com rubrica em cada página.',
    'A rubrica é a mesma do mandado: a da Presidente.',
    fala('a delegada de Saffron', 'Isso aqui não é arquivo morto. Isso aqui tá vivo demais.', 'baixo')
  ],
  ef:{flag:'cm_lei_planilha_original', itens:{'Planilha original (lacrada)':1},
      rep:{eixo:'bom', delta:2, motivo:'Achou a planilha original na busca da sala 704, com registro'},
      registrar:'Na busca da sala 704, a planilha original da Estação 4, com a rubrica da Presidente em cada página.'},
  escolhas:[
    {texto:'Ir conduzir a Presidente no Planalto antes da meia-noite.', vai:'cl3_o_carro'}
  ]
},

cl3_o_carro:{
  texto:[
    'A estrada pro Planalto sobe em curva. Às onze e dez, num acostamento antes da guarita da Rota 23, um carro preto está parado de pisca alerta.',
    'Ao lado do carro, um segurança de colete preto que você já viu numa porta de galpão.',
    fala('Segurança da Estação 4', 'Ela não vai descer do carro. E você não vai abrir a porta.'),
    fala('Segurança da Estação 4', 'São onze e dez. Eu só preciso de cinquenta minutos.')
  ],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 3), tipo:'treinador', treinador:'Segurança da Estação 4', fuga:false,
           timeExtra:[{dex:94, nivel:d => nivelDoCaminho(d, 3)}],
           vitoria:'cl3_a_porta', derrota:'cl3_meia_noite', gameover:'gameover'}
},

cl3_meia_noite:{
  texto:[
    'O seu último cai às onze e quarenta e oito.',
    'Ele não te impede de ficar de pé. Ele só fica entre você e a porta até o relógio do painel virar.',
    'Meia-noite. O vidro de trás desce dois dedos, e uma voz educada diz "obrigada" pro segurança, pelo nome dele, que você não ouve direito. E o carro vai embora.',
    'O mandado continua no seu bolso, inteiro, sem valer nada.'
  ],
  ef:{flag:'cm_lei_meia_noite', hp:-3, causa:'O acostamento antes da Rota 23'},
  escolhas:[
    {texto:'Voltar pra Saffron.', vai:'cl3_a_escolha'}
  ]
},

cl3_a_porta:{
  texto:[
    'O segurança recolhe as unidades e dá um passo pro lado, devagar, sem levantar as mãos.',
    'Você abre a porta de trás.',
    'A Presidente está sentada com uma pasta no colo, de óculos, e termina de ler a folha que estava lendo antes de olhar pra você.',
    fala('Hester Colman', 'Onze e cinquenta e um. Você cumpre prazo. Eu gosto de gente que cumpre prazo.'),
    fala('Hester Colman', 'Eu vou com você. Eu sempre ia. Eu só queria terminar de ler isto.', 'baixo')
  ],
  ef:{flag:'cm_lei_conduziu',
      rep:{eixo:'bom', delta:3, motivo:'Conduziu a Presidente da Comissão com mandado'},
      npc:{nome:'Hester Colman', opiniao:1, memoria:'Você a conduziu com mandado, às onze e cinquenta e um, num acostamento.'},
      registrar:'Conduziu Hester Colman, Presidente da Comissão, com mandado, antes da meia-noite.'},
  escolhas:[
    {texto:'Levar ela pra Saffron.', vai:'cl3_a_escolha'}
  ]
},

cl3_a_escolha:{
  texto:[
    d => d.flags.cm_lei_conduziu
      ? 'A Presidente depõe por quatro horas e não diz uma palavra que não esteja na ata. Às seis da manhã, o Conselho liga pra delegacia. Às sete, liga de novo.'
      : 'Às seis da manhã, o Conselho liga pra delegacia. Às sete, liga de novo. Querem saber de quem foi a ideia do mandado.',
    fala('a delegada de Saffron', 'Daqui pra frente, ou isso vira processo com o seu nome em cada folha, ou vira nota de esclarecimento com o meu.', 'baixo'),
    d => d.flags.cm_lei_planilha_original ? 'A planilha original está lacrada no cofre da delegacia. Por enquanto.' : 'O que você tem é o que você viu. Visto não é lacrado.'
  ],
  escolhas:[
    {texto:'Ficar. Pôr o seu nome em cada folha e esperar o processo, por dentro da polícia.', vai:'cl3_final_farda',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Assinou o processo contra a Comissão por dentro da polícia'}}},
    {texto:'Pôr o distintivo na mesa e contar tudo, em público, com nome e documento.', vai:'cl3_final_distintivo',
     ef:{rep:{eixo:'bom', delta:3, motivo:'Largou a polícia pra contar a Estação 4 em público'}}},
    {texto:'Resolver do seu jeito, sem papel, antes que o papel apodreça.', vai:'cl3_final_lei_dura',
     ef:{rep:{eixo:'ruim', delta:4, motivo:'Decidiu fazer justiça sem lei'}}},
    {texto:'Ainda não. O Planalto mandou chamar você também.', vai:'cl3_seguir',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Deixou o processo correr e seguiu pro Planalto'}}}
  ]
},

cl3_seguir:{
  texto:[
    'Você deixa a sua parte assinada e a outra parte com a delegada.',
    fala('a delegada de Saffron', 'Vai. Processo anda sozinho, devagar. Gente é que não espera.'),
    'Na rodoviária, o ônibus da Liga pro Planalto sai às oito e quinze.'
  ],
  ef:{flag:'cm_lei_seguiu_planalto'},
  fim:true, resumo:'O mandado da sala 704: uma busca, um acostamento e a meia-noite.'
},

cl3_final_farda:{
  texto:[
    'O processo tem mil e duzentas folhas. Você assina quatrocentas e onze.',
    'Leva dois anos. A Comissão muda de nome uma vez e de endereço duas. A Estação 4 fecha numa terça, sem saco preto.',
    'Você continua na Patrulha. Volta pra guarita de Viridian quando pedem, e pede pra ir pra guarita que ninguém quer quando não pedem.'
  ],
  final:{id:'lei_farda', titulo:'A FARDA', texto:[
    'O jornal dá a sentença na página onze, com quatro parágrafos.',
    'Você recorta e guarda no fundo da mochila, junto com o número de um lacre de plástico de uma madrugada na ciclovia.',
    'A polícia de Kanto continua sendo o que era. Um pouco menos. Por dentro, que é o único lugar de onde dá pra mudar uma coisa sem quebrar ela inteira.',
    'Na guarita de Viridian, todo dia às seis, alguém faz café ruim e pergunta se você quer. Você sempre quer.'
  ]}
},

cl3_final_distintivo:{
  texto:[
    'O distintivo fica na mesa da delegada, em cima da planta morta.',
    fala('a delegada de Saffron', 'Eu vou guardar. Não vou devolver pra corregedoria. Vou guardar.', 'baixo'),
    'A entrevista coletiva é no saguão de um hotel de Saffron, com onze microfones e uma mesa de toalha branca.',
    'Você fala por quarenta minutos. Diz o número de cada baia. Diz o peso do caminhão nas terças.'
  ],
  final:{id:'lei_distintivo', titulo:'O DISTINTIVO NA MESA', texto:[
    'O que você disse não vira processo. Vira outra coisa: vira o que todo mundo sabe.',
    'A Comissão fecha em três meses, não por sentença, por vergonha. Ninguém é preso.',
    'Você nunca mais usa colete. Em toda cidade, alguém te reconhece da televisão e não sabe se te agradece ou se atravessa a rua.',
    'Holt manda um cartão-postal de uma praia com o apito desenhado à caneta. Atrás, uma frase só: "Valeu o bolo."'
  ]}
},

cl3_final_lei_dura:{
  texto:[
    'Não tem papel nenhum no que você faz nas três semanas seguintes.',
    'O segurança da porta do galpão some de Saffron. O Dr. Bramble passa a andar com dois. A Estação 4 amanhece com o portão aberto e as baias vazias, e ninguém sabe dizer quem abriu.',
    'Na delegacia, a Delegada Thorne tira a sua foto do mural da Patrulha e põe na outra parede.'
  ],
  final:{id:'lei_dura', titulo:'LEI DURA', texto:[
    'Você ganhou. Do único jeito que eles entendiam.',
    'Kanto passa a contar a sua história em voz baixa, do mesmo jeito que contava a da Rocket.',
    'Numa guarita de Viridian, um sargento aposentado lê o jornal e dobra em quatro, com muito cuidado, e não diz nada pra ninguém.',
    'Tem gente que fica com medo de você. Tem gente que fica com medo e chama isso de respeito. Você aprende a não saber a diferença.'
  ]}
}

}
}
);
