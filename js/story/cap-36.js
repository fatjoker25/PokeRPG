/* ============================================================
   ILHAS SEVII · IV — OS FARÓIS (capítulo 36, pós-jogo)
   Ilha Três: a gangue das motos, que empresta óleo fiado e toma barco,
   compra da Maré e manda o que vale pro armazém da Ilha Cinco. A turma
   do Brody perdeu os doze Pokémon de trabalho na noite em que chegou;
   no farol apagado estão a caixa deles, a caixa térmica do Florian e o
   caderno das dívidas da ilha. Quando você entra, a gangue se divide,
   e quem você trouxe de outros capítulos cobre o lado que você não
   escolheu (Brody, Noa, Zev). Ver sevii.js.
   ============================================================ */
/* quem cobre o outro lado do farol: a turma do Brody fica com a caixa
   dela; a Noa (ou o Zev) vai atrás da caixa térmica */
function _c36AliadoDaCaixa(d){ return !!(d.flags.sv_brody_esperou || d.flags.sv_brody_junto); }
function _c36AliadoDosOvos(d){
  if (d.flags.sv_noa_guiou) return 'Noa';
  if (d.flags.sv_conheceu_zev && ((d.npcs['Zev'] || {}).opiniao || 0) >= 3) return 'Zev';
  return null;
}

CAPITULOS.push(
{
num:36, titulo:'Os Faróis', local:'Ilha Três — o farol apagado', ambiente:'cidade', nivelArea:63,
tom:'sombrio', posJogo:true,
ancora:{local:'ilha_tres', chamada:'Na rua de terra da Ilha Três, doze homens de capacete laranja estão parados na frente da pousada, e o maior deles segura uma alavanca de ferro.'},
entradas:['c36_a_rua'],
inicio: d => 'c36_a_rua',
cenas:{

c36_a_rua:{
  texto:[
    'A Ilha Três tem uma rua de terra batida, uma loja, um Centro, e um ronco que vem de longe e faz as janelas fecharem uma por uma antes de ele chegar.',
    'Passam seis motos em fila, devagar, de propósito. Cada uma com um farol pintado no tanque. Ninguém na rua olha pra elas, e todo mundo vê.',
    'Quando o ronco some, na frente da pousada ficam doze homens de capacete laranja, de colete refletivo, sem os Pokémon no cinto.',
    'O maior deles, de âncora tatuada no braço, segura uma alavanca de ferro e chora de raiva, sem vergonha nenhuma.',
    fala('Brody', 'DOZE, chefia. Doze Pokémon de trabalho. Os Machoke de carga, os Wingull de sinal. Do galpão da pousada, na primeira noite.', 'grita'),
    fala('Brody', 'Seis meses de vaquinha pra trazer a turma inteira pra ver um torneio. E na primeira noite.'),
    fala('Brody', 'O farol é ali na ponta. Todo mundo sabe. Ninguém vai. A gente vai.', 'frio')
  ],
  ef:{flag:'sv_viu_o_brody', registrar:'Na Ilha Três, a turma de estivadores de Slateport perdeu os doze Pokémon de trabalho na primeira noite. O Brody quer ir no farol de alavanca na mão.'},
  escolhas:[
    {texto:'"Espera. Me dá a noite. Doze homens de alavanca contra seis motos não volta inteiro."', vai:'c36_segurar'},
    {texto:'"Eu vou com vocês."', vai:'c36_junto'},
    {texto:'Deixar o Brody ir pela frente e ir sozinh{o|a} por trás.', vai:'c36_por_tras'},
    {texto:'Ir primeiro na loja da rua, perguntar dos Faróis.', vai:'c36_a_loja', cond:d => !Historia.jaAconteceu('c36_a_loja')}
  ]
},

c36_segurar:{
  texto:[
    'Ele te olha de cima. É uma cabeça mais alto que você, e a alavanca pesa na mão dele como se não pesasse nada.',
    fala('Brody', 'Você é {o|a} de Kanto. Do navio. Por que eu vou esperar alguém de Kanto?')
  ],
  teste:{status:'carisma', dificuldade:7, nomeStatus:'Carisma', critico:'c36_brody_esperou', sucesso:'c36_brody_esperou', parcial:'c36_brody_vai', falha:'c36_brody_vai'}
},
c36_brody_esperou:{
  texto:[
    'Ele olha a turma. A turma olha ele. Doze capacetes laranja esperando uma ordem.',
    fala('Brody', 'Uma noite, chefia. Uma.', null, 'Ele baixa a alavanca até o chão, devagar.'),
    fala('Brody', 'Mas quando você der o sinal, a turma cerca o farol. Doze homens de Slateport fazem barulho de cinquenta. Isso eu garanto.'),
    'Ele estende a mão. Aperta a sua com a mão inteira, e sacode duas vezes, como se fechasse um contrato do sindicato.'
  ],
  ef:{flag:'sv_brody_esperou', npc:{nome:'Brody', opiniao:3, memoria:'Convenceu ele a esperar uma noite em vez de ir no farol de alavanca.'},
      rep:{eixo:'bom', delta:1, motivo:'Segurou doze estivadores de Slateport antes de eles se machucarem no farol'},
      registrar:'Convenceu o Brody a esperar a noite. A turma dele cerca o farol quando você der o sinal.'},
  escolhas:[
    {texto:'Ir na loja da rua, perguntar dos Faróis.', vai:'c36_a_loja', cond:d => !Historia.jaAconteceu('c36_a_loja')},
    {texto:'Esperar a noite e ir pro farol.', vai:'c36_o_farol'}
  ]
},
c36_brody_vai:{
  texto:[
    fala('Brody', 'Não, chefia. Esperar é o que a gente faz no cais o ano inteiro.'),
    'Ele levanta a alavanca e a turma vai atrás, rua acima, cantando a música de cais, alto, pra quem quiser ouvir.'
  ],
  escolhas:[
    {texto:'Ir com eles.', vai:'c36_junto'},
    {texto:'Dar a volta por trás, enquanto eles fazem barulho na frente.', vai:'c36_por_tras'}
  ]
},
c36_junto:{
  texto:[
    'Você vai na frente da turma, do lado do Brody. Ele não diz nada, mas a turma canta mais alto.',
    'As janelas da rua, que fecharam pro ronco das motos, abrem uma fresta pra música de cais.'
  ],
  ef:{flag:'sv_brody_junto', npc:{nome:'Brody', opiniao:2, memoria:'Foi com a turma dele até o farol, na frente.'}},
  escolhas:[
    {texto:'Seguir até o farol.', vai:'c36_o_farol'}
  ]
},
c36_por_tras:{
  texto:[
    'A turma sobe a rua pela frente, cantando. Você sai pelo lado da praia, pelas pedras, com a maré baixando.',
    'Lá na frente, quando a turma chega no farol, começa a gritaria. Motor ligando. Alguém xingando em sotaque de Hoenn.'
  ],
  ef:{flag:'sv_brody_sozinho'},
  escolhas:[
    {texto:'Subir pelas pedras até o farol.', vai:'c36_as_pedras'}
  ]
},

c36_a_loja:{
  texto:[
    'A loja tem a prateleira da frente cheia e a de trás vazia. O dono fecha a cortina quando você olha muito, e quando você não para de olhar, abre de novo.',
    fala('o dono da loja', 'A de trás é a parte do farol. Toda semana eles levam a parte do farol. Taxa de proteção, eles chamam.', 'baixo'),
    fala('o dono da loja', 'O Kaspar tinha oficina de moto aqui na rua. Consertava a moto de todo mundo. Aí começou a emprestar óleo pros pescadores, quando a fábrica fechou e ninguém mais comprava nada. Óleo fiado. E de fiado em fiado, a ilha ficou dele.'),
    fala('o dono da loja', 'Ele tem um caderno. Quem deve, está no caderno. O número nunca desce.'),
    d => d.flags.sv_noa_ajudou
      ? 'Do fundo da loja sai uma menina de jaqueta preta grande demais, com um Murkrow no ombro e um saco de pão debaixo do braço.'
      : ''
  ],
  ef:{flag:'sv_sabe_do_caderno', registrar:'O dono da loja da Ilha Três contou: o Kaspar começou emprestando óleo fiado aos pescadores, e tem um caderno onde a dívida da ilha inteira nunca desce.'},
  escolhas:[
    {texto:'"Noa."', vai:'c36_a_noa', cond:d => !!d.flags.sv_noa_ajudou},
    {texto:'Voltar pra rua.', vai:'c36_a_rua_volta'}
  ]
},
c36_a_noa:{
  texto:[
    fala('Noa', 'Eu vim buscar pão. Não vim por sua causa.', null, 'Ela olha nos seus olhos. É mentira.'),
    fala('Noa', 'Pela frente do farol você não entra: tem moto na porta, sempre. Pelas pedras da ponta, na maré baixa, tem uma janela da casa de máquinas sem grade. Eu entrava por ela quando era pequena, pra ver o farol aceso.'),
    fala('Noa', 'A maré baixa às onze. E eu vou junto, porque você não sabe onde pisar.', 'frio')
  ],
  ef:{flag:'sv_noa_guiou', npc:{nome:'Noa', opiniao:1, memoria:'Te levou pelas pedras da ponta da Ilha Três até a janela do farol.'},
      registrar:'A Noa mostrou o caminho pelas pedras da ponta, na maré baixa, até a janela da casa de máquinas do farol.'},
  escolhas:[
    {texto:'Voltar pra rua.', vai:'c36_a_rua_volta'}
  ]
},
c36_a_rua_volta:{
  texto:[
    d => d.flags.sv_brody_esperou ? 'A turma do Brody está sentada na calçada da pousada, de capacete no colo, esperando o seu sinal.'
      : d.flags.sv_brody_junto || d.flags.sv_brody_sozinho ? 'A rua está vazia. Lá na ponta, no farol, ainda tem gritaria.'
      : 'O Brody continua na frente da pousada, com a alavanca na mão e a turma em volta, decidindo.'
  ],
  escolhas:[
    {texto:'"Espera. Me dá a noite."', vai:'c36_segurar', cond:d => !d.flags.sv_brody_esperou && !d.flags.sv_brody_junto && !d.flags.sv_brody_sozinho},
    {texto:'"Eu vou com vocês."', vai:'c36_junto', cond:d => !d.flags.sv_brody_esperou && !d.flags.sv_brody_junto && !d.flags.sv_brody_sozinho},
    {texto:'Ir pelas pedras da ponta, com a Noa, na maré baixa.', vai:'c36_as_pedras', cond:d => !!d.flags.sv_noa_guiou},
    {texto:'Ir pro farol.', vai:'c36_o_farol'}
  ]
},

c36_o_farol:{
  texto:[
    'O farol fica na ponta da ilha, em cima da pedra: uma torre branca descascada, com a lente lá em cima quebrada e uma casa de máquinas encostada no pé.',
    'Na rampa dos barcos, do lado, tem seis barcos de pesca puxados pra terra, de casco seco. Num deles, o nome pintado está descascando: DENTE.',
    'Na porta do farol, quatro motos e um homem de jaqueta marrom e topete raspado do lado, sentado de lado na moto.',
    d => d.flags.sv_brody_esperou ? 'Você levanta o braço. Lá atrás, na rua, doze capacetes laranja se levantam ao mesmo tempo da calçada.' : '',
    d => d.flags.sv_brody_junto ? 'A turma do Brody para atrás de você, cantando. O homem da moto levanta devagar.' : ''
  ],
  escolhas:[
    {texto:'Ir até a porta.', vai:'c36_a_porta'}
  ]
},
c36_a_porta:{
  texto:[
    fala('um dos Faróis', 'Farol fechado. Faz vinte anos.', 'frio'),
    d => (d.flags.sv_brody_esperou || d.flags.sv_brody_junto)
      ? 'Ele olha a turma de capacete laranja e conta. Doze. Ele chama pra dentro, e saem mais três.'
      : 'Ele não chama ninguém. Não precisa.'
  ],
  batalha:{sevii:'farol', mais:-4, tipo:'treinador', fuga:false,
           intro:'O homem da moto solta a Pokébola sem descer da moto.',
           vitoria:'c36_dentro', derrota:'c36_a_porta_perdeu'}
},
c36_a_porta_perdeu:{
  texto:[
    'O seu último cai na rampa dos barcos. O homem da moto ri pelo nariz.',
    d => (d.flags.sv_brody_esperou || d.flags.sv_brody_junto)
      ? 'Aí a turma do Brody entra pela porta inteira de uma vez, cantando, e o homem da moto vai junto pra dentro, de costas, sem entender o que aconteceu.'
      : 'Ele volta pra moto, e por cima do ombro dele dá pra ver a porta do farol aberta, sem ninguém.',
    'Você entra atrás.'
  ],
  escolhas:[
    {texto:'Entrar no farol.', vai:'c36_dentro'}
  ]
},
c36_as_pedras:{
  texto:[
    'Na maré baixa a ponta da ilha vira um caminho de pedra molhada, com poça e alga, por baixo da torre do farol.',
    d => d.flags.sv_noa_guiou ? 'A Noa vai na frente pisando sempre na mesma cor de pedra, a escura, sem olhar pra baixo. Você pisa onde ela pisou.' : 'Você pisa devagar, numa pedra de cada vez, e escorrega duas vezes.',
    'A janela da casa de máquinas está lá, sem grade, à altura do ombro. Lá dentro, cheiro de óleo e de maresia.'
  ],
  ef:{flag:'sv_entrou_pelas_pedras'},
  escolhas:[
    {texto:'Pular pra dentro.', vai:'c36_dentro'}
  ]
},

c36_dentro:{
  texto:[
    'A casa de máquinas do farol virou depósito. Caixote empilhado, rolo de corda, galão de óleo, e no meio, em cima de uma bancada de oficina, um caderno grosso de capa de lona.',
    'Encostado na bancada, um caixote de madeira com o carimbo do porto de Slateport, cheio de Pokébola: doze, com uma plaquinha de lata amarrada em cada uma, com nome de homem.',
    'Do lado, uma caixa térmica azul, desligada da tomada, com a tampa entreaberta.',
    'E um papel preso com prego na parede, escrito a lápis: ARMAZÉM 5 — QUINTA — 2H — P.',
    'Lá do alto da escada em caracol desce um homem grande, de barba, colete de vinil por cima da camiseta preta, com uma Pokébola em cada mão.',
    fala('Kaspar', 'Visita. No meu farol. Pela janela.', 'riso'),
    fala('Kaspar', 'A caixa térmica! Pela ponte, agora, pro barco!', 'grita', 'Ele grita isso pra porta dos fundos, sem tirar os olhos de você.'),
    'Um rapaz de moto que estava na porta da escada pega a caixa térmica e sai correndo pela porta dos fundos, em direção à ponte. O Kaspar fica entre você e o caixote de Slateport.'
  ],
  ef:{flag:'sv_sabe_do_armazem', registrar:'No farol da Ilha Três: o caixote com os doze Pokémon da turma do Brody, a caixa térmica do Florian, o caderno das dívidas, e um papel na parede: ARMAZÉM 5 — QUINTA — 2H — P.'},
  escolhas:[
    {texto:'Correr atrás da caixa térmica, pela ponte.', vai:'c36_a_ponte'},
    {texto:'Ficar e enfrentar o Kaspar pelo caixote de Slateport.', vai:'c36_o_kaspar'}
  ]
},

c36_a_ponte:{
  texto:[
    'A Ponte do Laço range com o vento e com você correndo em cima dela. O rapaz da caixa térmica vai na frente, de ilhota em ilhota, e na ponta da ponte tem um barco de motor ligado.',
    d => _c36AliadoDaCaixa(d)
      ? 'Atrás de você, no farol, a turma do Brody entra cantando. Você ouve a voz do Brody por cima de todas: "É NOSSO, CHEFIA!"'
      : 'Atrás de você, no farol, uma moto liga, e depois outra.',
    'No meio da ponte o rapaz vira, larga a caixa no chão de tábua, e solta uma Pokébola.'
  ],
  batalha:{sevii:'farol', mais:-3, tipo:'treinador', fuga:false,
           intro:'O rapaz da ponte solta a Pokébola em cima das tábuas.',
           vitoria:'c36_ponte_ganhou', derrota:'c36_ponte_perdeu'}
},
c36_ponte_ganhou:{
  texto:[
    'O último dele cai na tábua, e a ponte balança inteira. Ele pula no mar e nada pro barco, que sai sem esperar.',
    'A caixa térmica ficou no meio da ponte. Você abre a tampa um dedo, como o Florian abriu no navio: seis ovos creme, em fila, frios demais.',
    d => _c36AliadoDaCaixa(d)
      ? 'Quando você volta pro farol, a turma do Brody está sentada no chão da casa de máquinas, cada um com uma Pokébola no colo, conferindo a plaquinha de lata. O Kaspar sumiu de moto pela estrada de trás.'
      : 'Quando você volta pro farol, o caixote de Slateport não está mais lá. Nem o Kaspar. Na rampa, uma moto a menos, e marca de pneu indo pro cais de trás.'
  ],
  ef:{flag:'sv_rec_ovos', executar:d => {
        Estado.marcar('sv_kaspar_fugiu');
        if (_c36AliadoDaCaixa(d)) Estado.marcar('sv_rec_turma'); else Estado.marcar('sv_turma_subiu');
      },
      rep:{eixo:'bom', delta:1, motivo:'Recuperou na Ponte do Laço a caixa térmica com os seis ovos do Florian'},
      registrar:'Ganhou do rapaz dos Faróis na Ponte do Laço e recuperou a caixa térmica com os seis ovos do Florian. O Kaspar fugiu de moto.'},
  escolhas:[
    {texto:'Voltar pro farol, pro caderno de capa de lona.', vai:'c36_o_caderno'}
  ]
},
c36_ponte_perdeu:{
  texto:[
    'O seu último cai na tábua. O rapaz pega a caixa térmica de novo e corre pro barco, que sai pro sul sem luz nenhuma.',
    d => _c36AliadoDosOvos(d) === 'Noa'
      ? 'Mas do lado da ponte, por baixo, a água abre: o Sharpedo da Noa sobe na frente do barco, e o barco desvia, bate na pedra, e a caixa térmica cai no raso. A Noa pula na água e volta com ela nos braços, encharcada.'
      : _c36AliadoDosOvos(d) === 'Zev'
      ? 'Mas na ponta da ponte tem um homem de cabelo comprido sentado na amurada, com uma Pokébola na mão, que não estava ali antes. O Zev. O Houndoom dele aparece na frente do rapaz, que larga a caixa e pula no barco sozinho.'
      : 'Você fica na ponte vendo o barco ir embora. Seis ovos, sem caixa ligada, num barco sem luz.'
  ],
  ef:{executar:d => {
        Estado.marcar('sv_kaspar_fugiu');
        if (_c36AliadoDosOvos(d)) Estado.marcar('sv_rec_ovos'); else Estado.marcar('sv_ovos_subiram');
        if (_c36AliadoDaCaixa(d)) Estado.marcar('sv_rec_turma'); else Estado.marcar('sv_turma_subiu');
      }},
  escolhas:[
    {texto:'Voltar pro farol, pro caderno de capa de lona.', vai:'c36_o_caderno'}
  ]
},

c36_o_kaspar:{
  texto:[
    'O Kaspar sorri do jeito de quem fez esse sorriso pra muita gente que devia pra ele.',
    fala('Kaspar', 'Eu consertei moto nessa ilha vinte anos. Eu emprestei óleo quando ninguém emprestava. Agora eles me devem, e eu cobro. Isso tem nome em Kanto? Aqui chama negócio.'),
    d => _c36AliadoDosOvos(d) === 'Noa' ? 'Pela porta dos fundos você vê a Noa saindo correndo atrás do rapaz da caixa térmica, pela ponte, sem ninguém mandar.'
      : _c36AliadoDosOvos(d) === 'Zev' ? 'Pela janela você vê alguém de cabelo comprido na ponta da ponte, parado, esperando o rapaz da caixa térmica chegar: o Zev.'
      : 'Pela porta dos fundos você ouve o rapaz da caixa térmica correndo nas tábuas da ponte, cada vez mais longe.'
  ],
  batalha:{sevii:'kaspar', mais:-1, tipo:'treinador', fuga:false, treinador:'Kaspar', vontadeIA:true,
           intro:'Kaspar solta as duas Pokébolas ao mesmo tempo, uma pra cada lado, e uma volta pro cinto.',
           vitoria:'c36_kaspar_caiu', derrota:'c36_kaspar_ganhou'}
},
c36_kaspar_caiu:{
  texto:[
    'O último do Kaspar cai em cima dos galões de óleo, que rolam pela casa de máquinas inteira.',
    'Ele fica olhando o Ursaring no chão um tempo, e quando levanta o olho pra você não sorri mais.',
    d => _c36AliadoDosOvos(d) === 'Noa' ? 'Pela porta dos fundos entra a Noa, encharcada, com a caixa térmica nos braços. O rapaz da ponte ficou no mar.'
      : _c36AliadoDosOvos(d) === 'Zev' ? 'Pela porta dos fundos entra o Zev, com a caixa térmica debaixo do braço, e põe ela na bancada sem dizer nada.'
      : 'Lá fora, um motor de barco vai embora pro sul. A caixa térmica foi com ele.'
  ],
  ef:{flag:['sv_kaspar_vencido', 'sv_rec_turma'], executar:d => { if (_c36AliadoDosOvos(d)) Estado.marcar('sv_rec_ovos'); else Estado.marcar('sv_ovos_subiram'); },
      rep:{eixo:'bom', delta:2, motivo:'Ganhou do Kaspar no farol da Ilha Três e devolveu os doze Pokémon da turma de Slateport', notorio:true},
      registrar:'Ganhou do Kaspar no farol. Os doze Pokémon de trabalho da turma do Brody voltaram.'},
  escolhas:[
    {texto:'Amarrar o Kaspar na escada e mandar chamar o Sargento Lund.', vai:'c36_kaspar_preso'},
    {texto:'Ouvir o que ele tem pra oferecer.', vai:'c36_kaspar_proposta', cond:d => Sevii.daRede(d) || Sevii.lado(d) === 'mercenario'},
    {texto:'Deixar ele pegar a moto e sumir da ilha.', vai:'c36_kaspar_solto'}
  ]
},
c36_kaspar_ganhou:{
  texto:[
    'O seu último cai em cima dos galões. O Kaspar recolhe os dele, devagar, e pega o caixote de Slateport pela alça, sozinho.',
    fala('Kaspar', 'Volta pra Kanto. Diz pra eles que o farol está fechado.', 'frio'),
    d => _c36AliadoDaCaixa(d)
      ? 'Ele não chega na porta. A turma do Brody está na porta, doze capacetes laranja, e o Brody tira o caixote da mão dele com uma mão só. O Kaspar olha os doze, olha a moto, e escolhe a moto.'
      : 'Ele sai pela porta da frente com o caixote, liga a moto, e some na estrada de trás com o caixote amarrado na garupa.'
  ],
  ef:{executar:d => {
        Estado.marcar('sv_kaspar_fugiu');
        if (_c36AliadoDaCaixa(d)) Estado.marcar('sv_rec_turma'); else Estado.marcar('sv_turma_subiu');
        if (_c36AliadoDosOvos(d)) Estado.marcar('sv_rec_ovos'); else Estado.marcar('sv_ovos_subiram');
      }},
  escolhas:[
    {texto:'Ficar com o caderno de capa de lona.', vai:'c36_o_caderno'}
  ]
},
c36_kaspar_preso:{
  texto:[
    'Você amarra o Kaspar no corrimão da escada em caracol com a corda dos rolos dele mesmo. Ele deixa, rindo, até perceber que o nó é bom.',
    d => d.flags.sv_lund_auxiliar
      ? 'Um moleque da ilha corre até o cais pra mandar recado pela balsa. "A Guarda pediu." É só o que você manda dizer.'
      : 'Um moleque da ilha corre até o cais pra mandar recado pela balsa pro Sargento Lund.',
    'O Lund chega de madrugada num barco de pesca emprestado, de farda e pijama, metade de cada, e olha o Kaspar amarrado um tempo comprido.',
    fala('Sargento Lund', 'Vinte anos. Vinte anos eu passo na frente dessa oficina.', 'baixo')
  ],
  ef:{flag:'sv_kaspar_preso', npc:{nome:'Sargento Lund', opiniao:2, memoria:'Você amarrou o Kaspar no farol da Ilha Três e mandou chamar a Guarda.'},
      rep:{eixo:'bom', delta:2, motivo:'Entregou o Kaspar, chefe dos Faróis, à Guarda das Ilhas', notorio:true},
      registrar:'Amarrou o Kaspar no farol e entregou ao Sargento Lund.'},
  escolhas:[
    {texto:'Abrir o caderno de capa de lona.', vai:'c36_o_caderno'}
  ]
},
c36_kaspar_proposta:{
  texto:[
    'Ele senta no degrau da escada, olhando o seu pino, ou o jeito como você segura a Pokébola, e ri.',
    fala('Kaspar', 'Você não veio pelos estivadores. Gente como você não vem por estivador.'),
    fala('Kaspar', 'O farol é bom ponto. Fica entre a Um e a Cinco, vê tudo que passa de barco. Eu fico com a ilha, você fica com a parte de Kanto. Cinco mil agora, pra começar a conversa.', 'baixo'),
    'Ele tira um bolo de dinheiro do colete e põe no degrau, entre vocês dois.'
  ],
  escolhas:[
    {texto:'Pegar o dinheiro.', vai:'c36_kaspar_acordo'},
    {texto:'Amarrar o Kaspar na escada com o dinheiro no bolso dele.', vai:'c36_kaspar_preso'}
  ]
},
c36_kaspar_acordo:{
  texto:[
    'Você pega o dinheiro. Ele aperta a sua mão com a mão suja de óleo, e o óleo fica.',
    fala('Kaspar', 'O caderno fica comigo. O resto, a gente conversa.'),
    'Ele sobe na moto e vai embora devagar pela rua, de farol aceso, pra ilha inteira ver que ele saiu do farol inteiro.'
  ],
  ef:{flag:'sv_kaspar_acordo', dinheiro:5000,
      rep:{eixo:'ruim', delta:3, motivo:'Fez acordo com o Kaspar, chefe dos Faróis, e deixou a ilha com ele', notorio:true},
      npc:{nome:'Kaspar', opiniao:3, memoria:'Pegou os cinco mil no degrau do farol e fez acordo.'},
      registrar:'Fez acordo com o Kaspar no farol: cinco mil, e a ilha continua dele.'},
  escolhas:[
    {texto:'Sair do farol.', vai:'c36_o_fim'}
  ]
},
c36_kaspar_solto:{
  texto:[
    fala('Kaspar', 'Assim, sem nada?', null, 'Ele não acredita, e espera o resto.'),
    'Não tem resto. Ele sobe na moto, liga, e vai embora pela estrada de trás, sem farol aceso, devagar, como quem ainda acha que alguém vai mudar de ideia.'
  ],
  ef:{flag:'sv_kaspar_fugiu', npc:{nome:'Kaspar', opiniao:1, memoria:'Deixou ele ir embora do farol de moto, sem nada.'},
      registrar:'Deixou o Kaspar ir embora de moto pela estrada de trás.'},
  escolhas:[
    {texto:'Abrir o caderno de capa de lona.', vai:'c36_o_caderno'}
  ]
},

c36_o_caderno:{
  texto:[
    'O caderno tem a capa de lona engordurada e duzentas páginas, cada página uma família da ilha. Nome, barco, o que pegou fiado, o que pagou. A coluna do que pagou é a maior, e a do que deve não desce nunca.',
    'Na página do Kelp tem um desenho de barco a lápis e, embaixo, sublinhado duas vezes: DENTE — TOMADO.',
    d => d.flags.sv_noa_guiou ? 'A Noa está do seu lado, lendo por cima do seu ombro, e para de respirar nessa página.' : ''
  ],
  escolhas:[
    {texto:'Queimar o caderno no galão de óleo, na frente da ilha.', vai:'c36_queimou'},
    {texto:'Entregar o caderno pro Sargento Lund, como prova.', vai:'c36_entregou_o_caderno'},
    {texto:'Guardar o caderno com você.', vai:'c36_guardou_o_caderno'}
  ]
},
c36_queimou:{
  texto:[
    'Você leva o caderno pra rampa dos barcos e põe fogo num galão vazio, com um resto de óleo no fundo.',
    'A ilha vem ver. Primeiro dois, depois vinte. Ninguém fala. O caderno queima devagar, porque é grosso, página por página, família por família.',
    'Quando acaba, um velho de boné desce até a rampa, empurra sozinho um dos barcos de casco seco pra água, e entra nele. Depois outro. Depois outro.',
    d => d.flags.sv_noa_guiou || d.flags.sv_noa_ajudou ? 'O Dente vai pra água empurrado por uma menina de jaqueta preta grande demais, que não chora porque não chora na frente de ninguém.' : 'O Dente vai pra água empurrado por um homem magro de barba grande, que parece não sair de casa faz um ano.'
  ],
  ef:{flag:['sv_caderno_queimado', 'sv_barco_devolvido'], npc:{nome:'Noa', opiniao:3, memoria:'Você queimou o caderno do Kaspar, e o Dente voltou pra água.'},
      rep:{eixo:'bom', delta:3, motivo:'Queimou na frente da Ilha Três o caderno de dívidas dos Faróis', notorio:true},
      registrar:'Queimou o caderno de dívidas do Kaspar na rampa do farol. A ilha empurrou os barcos de volta pra água.'},
  escolhas:[
    {texto:'Ficar na rampa até o último barco.', vai:'c36_o_fim'}
  ]
},
c36_entregou_o_caderno:{
  texto:[
    d => d.flags.sv_kaspar_preso ? 'O Lund recebe o caderno de capa de lona com as duas mãos, do jeito que se recebe uma coisa que pesa mais do que parece.' : 'De manhã você leva o caderno pro Sargento Lund, na Ilha Um, pela primeira balsa.',
    fala('Sargento Lund', 'Isso é prova de vinte anos.', 'baixo'),
    fala('Sargento Lund', 'Com isso, nenhuma dívida dessas vale um tostão. Eu escrevo pra cada família. Uma por uma. Vai levar o mês.'),
    'Ele já está abrindo o caderno na primeira página e tirando a caneta do bolso da camisa.'
  ],
  ef:{flag:['sv_caderno_lund', 'sv_barco_devolvido'], npc:{nome:'Sargento Lund', opiniao:2, memoria:'Você entregou o caderno de dívidas do Kaspar como prova.'},
      rep:{eixo:'bom', delta:2, motivo:'Entregou à Guarda das Ilhas o caderno de dívidas dos Faróis', notorio:true},
      registrar:'Entregou o caderno de dívidas do Kaspar ao Sargento Lund. Ele vai escrever pra cada família.'},
  escolhas:[
    {texto:'Sair do farol.', vai:'c36_o_fim'}
  ]
},
c36_guardou_o_caderno:{
  texto:[
    'Você guarda o caderno na mochila. Pesa.',
    'Duzentas famílias da Ilha Três, cada uma com o que deve escrito a lápis, e quem tiver esse caderno na mão tem a ilha na mão.',
    d => d.flags.sv_noa_guiou ? fala('Noa', 'Pra que você quer isso?', 'frio', 'Ela não espera resposta. Sai pela janela da casa de máquinas, e você ouve os passos dela nas pedras indo embora.') : ''
  ],
  ef:{flag:'sv_caderno_guardado', itens:{'Caderno de dívidas':1},
      npc:{nome:'Noa', opiniao:-2, memoria:'Você guardou o caderno de dívidas do Kaspar, em vez de queimar.'},
      rep:{eixo:'ruim', delta:2, motivo:'Ficou com o caderno de dívidas dos Faróis, com a Ilha Três inteira dentro'},
      registrar:'Ficou com o caderno de dívidas do Kaspar.'},
  escolhas:[
    {texto:'Sair do farol.', vai:'c36_o_fim'}
  ]
},

c36_o_fim:{
  texto:[
    'De manhã, a rua de terra da Ilha Três tem as janelas abertas. Todas.',
    d => d.flags.sv_rec_turma ? 'Na frente da pousada, a turma do Brody confere os doze Pokémon de trabalho pela décima vez, e o Brody chora de novo, agora de outro jeito, abraçado num Machoke que não sabe o que está acontecendo.' : 'Na frente da pousada, a turma do Brody está sentada na calçada, sem os Pokémon, olhando pro sul.',
    d => d.flags.sv_rec_ovos ? 'O Florian chega na primeira balsa, desce correndo, e põe a mão na caixa térmica antes de falar com qualquer pessoa. Liga na tomada da pousada. Fica olhando a luzinha acender.' : 'O Florian chega na primeira balsa e escuta você contar da ponte. Ele não calcula nada em voz alta.',
    d => d.flags.sv_rec_ovos ? fala('Florian', 'Seis. Os seis. Ainda dá tempo. Eu calculei. Eu vou calcular sempre, agora.', 'riso') : '',
    'O papel da parede do farol está no seu bolso: ARMAZÉM 5 — QUINTA — 2H — P.',
    d => (d.flags.sv_turma_subiu || d.flags.sv_ovos_subiram) ? 'O que saiu de barco pro sul, sem luz, foi pro armazém. E o armazém é na Ilha Cinco.' : 'A Milotic da Esme não estava no farol. Estava no papel da parede: no armazém, na Ilha Cinco.'
  ],
  ef:{executar:d => {
        if (d.flags.sv_rec_turma) Historia.aplicar({npc:{nome:'Brody', opiniao:4, memoria:'Devolveu os doze Pokémon de trabalho da turma de Slateport.'}});
        if (d.flags.sv_rec_ovos) Historia.aplicar({npc:{nome:'Florian', opiniao:4, memoria:'Trouxe de volta a caixa térmica com os seis ovos.'}});
      }},
  fim:true, sai:'ilha_tres',
  resumo:'Os Faróis: um farol apagado, um caderno onde a dívida da ilha nunca descia, e um papel na parede — armazém 5, quinta, duas da manhã, P.'
}

}
});
