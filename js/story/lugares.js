/* ============================================================
   LUGARES — o que se descobre e o que se ouve em cada lugar
   ============================================================ */

/* Onde cada arco da história espera por você.
   Ele não aparece como "capítulo": aparece como uma coisa no lugar. */
const ANCORAS = {
  2:  {local:'viridian',  chamada:'Tem um mural de recados na entrada do Centro Pokémon.'},
  3:  {local:'floresta',  chamada:'Um som fino, repetido, vindo de dentro do mato fechado.'},
  4:  {local:'pewter',    chamada:'Uma detonação a cada vinte minutos, e ninguém na rua levanta a cabeça.'},
  5:  {local:'monte_lua', chamada:'O cabo elétrico no chão da caverna leva a algum lugar.'},
  6:  {local:'cerulean',  chamada:'Na ponte norte tem gente reunida em volta de uma mesa com toalha.'},
  7:  {local:'lavender',  chamada:'Um som de osso batendo em pedra, três vezes, pausa, três vezes.'},
  8:  {local:'vermilion', chamada:'No cais três tem uma parede branca de nove andares com as janelas acesas.'},
  9:  {local:'celadon',   chamada:'Três caminhões de Vermilion descarregaram aqui hoje de manhã.'},
  10: {local:'usina',     chamada:'O zumbido vem da subestação, e a usina está desligada há onze anos.'},
  11: {local:'saffron',   chamada:'A Silph Co. ocupa um quarteirão inteiro. O ginásio da cidade está fechado.'},
  12: {local:'fuchsia',   chamada:'A Zona Safári vende entrada a quinhentos e tem trinta e um quilômetros de cerca.'},
  13: {local:'seafoam',   chamada:'O mar congelou em outubro e ninguém de Fuchsia vem mais aqui.'},
  14: {local:'cinnabar',  chamada:'O laboratório queimou semana passada. A fita de isolamento é nova; o buraco na cerca, também.'},
  15: {local:'rota16',    chamada:'O chão avisa antes do som: batida de pata em solo duro, muito rápida, vindo.'},
  16: {local:'ilha_sem_nome', chamada:'Um alicerce de torre no topo da ilha. Só o alicerce.'},
  17: {local:'rota23',    chamada:'Uma clareira redonda, fora da trilha, com grama mais alta e mais verde que a de fora.'},
  18: {local:'saffron',   chamada:'O cartório da rua Dez abre até as 17h e cobra oito reais a cópia.'},
  19: {local:'rota21',    chamada:'A cerca nova de três metros, com placa de área de pesquisa.'},
  20: {local:'saffron',   chamada:'Sala 704, sétimo andar, prédio comercial com farmácia no térreo. Segunda, 10h.'},
  21: {local:'planalto',  chamada:'Eles te esperam numa sala com mesa comprida e quatro cadeiras.'},
  22: {local:'norte',     chamada:'O vale entre duas paredes de pedra, sem saída no fundo.'},
  23: {local:'norte',     chamada:'A boca da caverna é mais alta que uma casa e o ar que sai dela é morno.'}
};

/* ============================================================
   DESCOBERTAS
   ============================================================ */
const DESCOBERTAS = {

/* ─── cidades ─── */
viridian:[
  {chave:'troca_viridian', texto:[
    'Atrás do posto de gasolina tem um homem sentado num caixote com um rádio ligado no jogo.',
    'Ele te vê passar, olha o seu cinto, e faz um gesto de quem quer falar mas não quer levantar.'], descobre:'troca_viridian'},
  {chave:'v_ferro', texto:['Na calçada da praça, alguém desenhou com giz um mapa da Floresta de Viridian. Está errado em dois pontos, e um deles é perigoso.']},
  {chave:'loja_viridian', texto:['Você encontra a loja da cidade escondida atrás da praça, com a fachada tão sem graça que você passou por ela duas vezes.'], descobre:'loja_viridian'},
  {chave:'ginasio_viridian', texto:[
    'Na saída oeste de Viridian tem um prédio grande, repintado, com uma placa de acrílico nova na porta.',
    'A placa diz uma coisa só: "SETE INSÍGNIAS."',
    'Você não tem sete insígnias. Você nem tem uma.'], descobre:'ginasio_viridian'},
  {chave:'v_mural', texto:['O mural de recados do Centro Pokémon tem um bilhete escrito com pressa e sublinhado três vezes: "NÃO ENTRE NA FLORESTA DE VIRIDIAN À NOITE."'], ef:{flag:'leu_aviso_floresta'}},
  {chave:'v_velho', texto:['Um homem de uns setenta anos ensina uma criança a jogar uma Poké Ball num poste. A criança erra oito vezes. Ele não perde a paciência uma vez.']}
],
pewter:[
  {chave:'troca_pewter', texto:[
    'No portão de funcionários da pedreira, no fim do turno da tarde, um homem de capacete pergunta se você é treinador.',
    '"Você tem Graveler?" Ele fala isso antes de dizer bom dia.'], descobre:'troca_pewter'},
  {chave:'p_placa', texto:['Uma placa na entrada da cidade: DIAS SEM ACIDENTE — 12. O 12 foi repintado por cima de um número maior.']},
  {chave:'ginasio_pewter', texto:[
    'O ginásio fica no fim da rua principal: porta de metal, sem placa bonita, sem vidro.',
    'Dá pra ouvir alguma coisa pesada caindo lá dentro, em intervalos regulares.'], descobre:'ginasio_pewter'},
  {chave:'loja_pewter', texto:['A loja de Pewter vende mais equipamento de escalada que item de treinador. A dona explica que é questão de demanda.'], descobre:'loja_pewter'},
  {chave:'p_museu', texto:[
    'O museu tem duas salas e um funcionário. Na segunda, atrás do vidro, um Kabutops reconstruído em pedra.',
    'A placa diz: "Extinto há aproximadamente 300 milhões de anos."'], ef:{flag:'viu_o_museu'}}
],
cerulean:[
  {chave:'troca_cerulean', texto:[
    'A escola de natação funciona num galpão colado no rio. Depois da aula das crianças, a professora fica sentada na borda rasa com um Seel.',
    'O Seel odeia a piscina. Dá pra ver de longe.'], descobre:'troca_cerulean'},
  {chave:'c_cartaz', texto:['Um cartaz colado num poste da ponte sul: "ÁGUA COM COR ESTRANHA? ANOTE DIA E HORA E ME PROCURE — Ginásio."']},
  {chave:'ginasio_cerulean', texto:[
    'O ginásio de Cerulean é uma piscina olímpica coberta, e dá pra ouvir o eco de fora.',
    'Tem um cartaz meio velho na porta: "DESAFIOS: MANHÃ E TARDE. NÃO ENTRE MOLHADO."'], descobre:'ginasio_cerulean'},
  {chave:'loja_cerulean', texto:['A loja fica na ponte sul e atende pelo balcão, sem ninguém entrar.'], descobre:'loja_cerulean'},
  {chave:'c_ponte', texto:['Na ponte norte, alguém montou uma banca de veludo com seis Poké Balls e preço em plaquinha. Você olha por tempo demais e a pessoa te olha de volta.']}
],
vermilion:[
  {chave:'troca_vermilion', texto:[
    'Na pedra do quebra-mar, no fim da tarde, tem sempre um menino com uma caixa de isopor.',
    'Hoje ele está com um Shellder e uma cara de quem não queria estar com um Shellder.'], descobre:'troca_vermilion'},
  {chave:'vm_portao', texto:['O portão cinco, no fim do muro do porto, tem uma guarita vazia e uma balança com faixa de manutenção desbotada de sol.']},
  {chave:'ginasio_vermilion', texto:[
    'O ginásio de Vermilion é um galpão de manutenção portuária adaptado, com cabo grosso saindo por baixo da porta.',
    'De fora dá pra sentir cheiro de ozônio.'], descobre:'ginasio_vermilion'},
  {chave:'loja_vermilion', texto:['A loja do porto abre às cinco da manhã e vende comida, corda e Poké Ball no mesmo balcão.'], descobre:'loja_vermilion'},
  {chave:'vm_cais', texto:['No cais três, um navio do tamanho de um prédio deitado. Tem fila pra entrar e a passagem custa oito mil.']}
],
lavender:[
  {chave:'troca_lavender', texto:[
    'O zelador da torre te para entre as velas do primeiro andar.',
    '"Tem uma coisa no sétimo que quer ir embora daqui", ele diz, sem nenhum drama. "E ela quer trocar."'], descobre:'troca_lavender'},
  {chave:'l_urnas', texto:['A marcenaria tem uma vitrine com urnas de todos os tamanhos. As menores são muito pequenas.']},
  {chave:'l_mural', texto:[
    'Na base da torre tem um mural com nomes. Muitos nomes.',
    'Alguns têm data de um Pokémon e data de um treinador na mesma linha.']},
  {chave:'loja_lavender', texto:['A loja de Lavender vende incenso e vela junto com Potion, o que faz um sentido triste.'], descobre:'loja_lavender'},
  {chave:'l_silencio', texto:['Você percebe, depois de meia hora, que a cidade inteira não tem música em lugar nenhum. Nenhum rádio, nenhuma loja com alto-falante.']}
],
celadon:[
  {chave:'troca_celadon', texto:[
    'Na entrada de serviço do shopping tem uma banca de flor que não aparece em planta nenhuma.',
    'A florista tem uma caixa de papelão com furo ao lado do pé e não esconde.'], descobre:'troca_celadon'},
  {chave:'cl_deposito', texto:['Atrás do cassino tem um depósito com doca coberta e portão automático. Chega caminhão de madrugada.']},
  {chave:'ginasio_celadon', texto:[
    'O ginásio de Celadon é uma estufa de vidro em cima do shopping. Do térreo dá pra ver o verde lá em cima.',
    'O elevador de serviço tem um botão sem número.'], descobre:'ginasio_celadon'},
  {chave:'loja_celadon', texto:['O shopping tem sete andares e o quarto inteiro é de item de treinador. Você fica quinze minutos parado só olhando prateleira.'], descobre:'loja_celadon'},
  {chave:'cl_cassino', texto:['O cassino mudou de nome duas vezes desde que a Rocket caiu. Agora se chama "Celadon Palace" e tem a mesma carpete.']}
],
fuchsia:[
  {chave:'troca_fuchsia', texto:[
    'No bar da esquina da reserva, um guarda-parque de folga na terceira dose olha pra você e fala, alto demais:',
    '"VOCÊ TEM EXEGGCUTE?"'], descobre:'troca_fuchsia'},
  {chave:'f_portao_azul', texto:['Na estrada da Zona Safári, do lado esquerdo, tem um sítio com portão azul e nada à venda na frente.']},
  {chave:'ginasio_fuchsia', texto:[
    'O ginásio de Fuchsia não tem fachada. Você passa duas vezes na frente antes de entender que aquilo é a entrada.',
    'Não tem placa, não tem janela, e a porta abre pra dentro de um jeito estranho.'], descobre:'ginasio_fuchsia'},
  {chave:'loja_fuchsia', texto:['A loja fica na entrada da Zona Safári e vende mais repelente que Poké Ball.'], descobre:'loja_fuchsia'},
  {chave:'f_cartaz', texto:['Um cartaz desbotado na recepção da reserva: "AJUDE-NOS — Pokémon avistados fora da cerca devem ser reportados."']}
],
saffron:[
  {chave:'troca_saffron', texto:[
    'Na praça de alimentação, na hora do almoço, tem uma mulher de crachá azul sentada sozinha com uma bandeja intacta.',
    'Ela olha pra você como quem já decidiu falar.'], descobre:'troca_saffron'},
  {chave:'s_cartorio', texto:['O cartório da rua Dez abre até as 17h, cobra oito reais a cópia e não faz pergunta nenhuma.']},
  {chave:'ginasio_saffron', texto:[
    'O ginásio de Saffron é um prédio baixo e sem janela, espremido entre dois arranha-céus.',
    'A porta está trancada e tem um papel colado: "SUSPENSO POR TEMPO INDETERMINADO — S."',
    'A luz interna está acesa.'], descobre:'ginasio_saffron'},
  {chave:'loja_saffron', texto:['A loja de Saffron fica no térreo de um prédio comercial e tem fila de gente de crachá na hora do almoço.'], descobre:'loja_saffron'},
  {chave:'s_silph', texto:['A Silph Co. ocupa um quarteirão inteiro. Recepção com catraca, crachá, câmera, e uma mulher no balcão com um sorriso impecável.']}
],
cinnabar:[
  {chave:'troca_cinnabar', texto:[
    'O dono da pousada te chama na varanda com um gesto de queixo.',
    '"Você tem Ponyta? Eu tenho um problema de conta de luz e o problema dorme na minha lavanderia."'], descobre:'troca_cinnabar'},
  {chave:'cn_conta', texto:['Alguém colou no mural do Centro Pokémon uma conta de energia impressa, com um trecho circulado a caneta. Ninguém tirou.']},
  {chave:'ginasio_cinnabar', texto:[
    'O ginásio de Cinnabar fica do outro lado da ilha e sobreviveu ao incêndio por isso.',
    'Pela janela dá pra ver uma lousa cheia de conta de física.'], descobre:'ginasio_cinnabar'},
  {chave:'loja_cinnabar', texto:['A loja da ilha é uma casa com uma vitrine. A dona atende de chinelo.'], descobre:'loja_cinnabar'},
  {chave:'cn_lab', texto:['O prédio do laboratório queimou parcialmente na semana passada. A fita de isolamento é nova. O buraco na cerca, também.']}
],
pallet:[
  {chave:'pl_troca', texto:['Um menino de sete anos te para na rua e pergunta, muito sério, se você tem um Caterpie. Ele não explica pra quê.']},
  {chave:'pl_praia', texto:['Do alto do morro dá pra ver o mar. Do outro lado dele, num dia limpo, uma mancha escura que é uma ilha.']},
  {chave:'loja_pallet', texto:['O mercado de Pallet abre tarde e vende Poké Ball atrás do balcão, junto com pilha e anzol.'], descobre:'loja_pallet'},
  {chave:'pl_rufino', texto:['Sr. Rufino varre a mesma calçada há vinte anos. Ele te olha passar e não diz nada, que no caso dele é uma coisa que ele escolheu.']}
]
};

/* Rotas: o que se acha andando devagar. `amb` limita ao ambiente. */
const ACHADOS_ROTA = [
  /* ─── genéricos ─── */
  {texto:['No meio do mato você acha uma mochila velha, molhada de sereno, com uma Poké Ball dentro e mais nada.'], ef:{itens:{'Poké Ball':1}}},
  {texto:['Embaixo de uma pedra, um vidro de Potion fechado, dentro da validade por pouco.'], ef:{itens:{'Potion':1}}},
  {texto:['Um treinador acampado te oferece café e conversa por vinte minutos sobre absolutamente nada. Você sai dali melhor do que entrou.'], ef:{hp:3}},
  {texto:['Você acha dinheiro no chão. Uma nota só, dobrada quatro vezes, do jeito que gente guarda quando é a última.'], ef:{dinheiro:700}},
  {texto:['Um ninho abandonado, ainda inteiro, com casca de ovo quebrada por dentro — do jeito certo, de quem nasceu e foi embora.']},
  {texto:['Marca de pneu onde não devia ter pneu. Larga, funda, indo pra dentro do mato.']},
  {texto:['Você acha uma placa caída, apagada pelo sol. Dá pra ler "CUIDADO" e mais nada.']},
  {texto:['Uma trilha estreita que não está em mapa nenhum. Ela dá em nada — mas alguém andou por ela o suficiente pra abrir o mato.']},
  {texto:['Um carretel de linha de pesca preso num galho a dois metros do chão. Alguém jogou muito mal ou muito longe.'], ef:{itens:{'Isca':1}}},
  {texto:['Uma bota. Uma só, do pé direito, no meio do caminho, em bom estado.',
          'Você olha em volta por mais tempo do que gostaria de admitir.']},
  {texto:['Alguém pregou um saco plástico num tronco com dois pregos. Dentro tem Antídoto e um bilhete: "PEGA SE PRECISAR. DEVOLVE QUANDO DER."'],
   ef:{itens:{'Antidote':1}}},
  {texto:['Uma fogueira apagada há poucas horas, com pedra em círculo e a lata de comida enterrada de propósito.',
          'Quem acampou aqui sabia o que estava fazendo e não queria ser encontrado.']},
  {texto:['Um par de pegadas pequenas indo, e o mesmo par voltando, e entre eles um lugar onde alguém sentou por muito tempo.']},
  {texto:['Um pedaço de corda boa, doze metros, enrolado direito e deixado num galho. Isso não se perde: isso se deixa.'], ef:{itens:{'Corda':1}}},
  {texto:['Uma cerca velha que separa duas coisas exatamente iguais.']},
  {texto:['Um Pidgey morto na beira da trilha, sem marca nenhuma. Você enterra porque não custa nada e porque custa alguma coisa não enterrar.'],
   ef:{rep:{eixo:'bom',delta:1,motivo:'Enterrou um bicho que ninguém ia enterrar'}}},
  {texto:['Um vidro de Super Potion caído do bolso de alguém, ainda lacrado, na beira de uma pedra onde é óbvio que gente senta.'],
   ef:{itens:{'Super Potion':1}}},
  {texto:['Uma bicicleta enferrujada, encostada numa árvore, com as duas rodas murchas e o cadeado ainda trancado.']},
  {texto:['Alguém escreveu num tronco com canivete: "EU PASSEI POR AQUI E EU VOLTEI". Está escrito duas vezes, com letras diferentes e anos de diferença.']},
  {texto:['Um Repelente pela metade, jogado no acostamento. Ninguém joga fora Repelente pela metade sem um motivo.'], ef:{itens:{'Repelente':1}}},
  {texto:['Você acha uma carteira sem documento nenhum, com dinheiro dentro e uma foto de duas pessoas na praia.',
          'Você guarda o dinheiro e deixa a carteira no lugar, com a foto pra cima, o que não faz sentido nenhum e é o que dá pra fazer.'],
   ef:{dinheiro:1400}},
  {texto:['Um caderno de campo largado, com chuva por cima. As dez primeiras páginas são anotação de treinador. Da décima primeira em diante é só data e a palavra "nada".'],
   ef:{itens:{'Caderno de campo':1}}},

  /* ─── mata e campo ─── */
  {amb:['floresta','campo'], texto:['Um tronco oco com fungo amarelo por dentro. Dentro do fungo, um vidro que alguém escondeu ali: Full Heal.'], ef:{itens:{'Full Heal':1}}},
  {amb:['floresta'], texto:['Fita laranja amarrada em cinco árvores em linha. Não é marcação de trilha — é marcação de outra coisa.']},
  {amb:['floresta'], texto:['Você acha uma clareira que não devia existir: dez metros de círculo sem uma única árvore, com o capim mais alto no meio.']},
  {amb:['campo'], texto:['Um espantalho de roupa boa. Ninguém veste espantalho com roupa boa.']},
  {amb:['campo','floresta'], texto:['Uma colmeia caída, vazia, e o cheiro de mel ainda no ar. Você não é o primeiro a chegar aqui hoje.'], ef:{itens:{'Ração':1}}},

  /* ─── água ─── */
  {amb:['agua'], texto:['Na beira, uma garrafa fechada com um papel dentro. O papel está em branco dos dois lados.']},
  {amb:['agua'], texto:['Uma rede de pesca rasgada enrolada numa pedra, com dois anzóis bons ainda presos.'], ef:{itens:{'Isca':2}}},
  {amb:['agua'], texto:['Alguém deixou um cantil cheio em cima de uma pedra, tampado, com o sol batendo.'], ef:{itens:{'Cantil':1}}},
  {amb:['agua'], texto:['A água mudou de cor num trecho de uns vinte metros. Não é sombra. Você anota o ponto de cabeça.']},

  /* ─── caverna e montanha ─── */
  {amb:['caverna','montanha'], texto:['Numa fresta da rocha, um par de pilhas embalado e ainda bom.'], ef:{itens:{'Pilha':2}}},
  {amb:['caverna'], texto:['Uma lanterna caída, com a luz amarelada ainda acesa, apontada pra parede.',
                            'Ela está acesa. Isso quer dizer que caiu hoje.'], ef:{itens:{'Lanterna':1}}},
  {amb:['caverna'], texto:['Um retângulo liso na parede da caverna, do tamanho de uma porta, cortado com serra.']},
  {amb:['montanha','caverna'], texto:['Uma máscara de pó de pedreira pendurada num prego batido na rocha, limpa, esperando alguém.'], ef:{itens:{'Máscara de pó':1}}},
  {amb:['montanha'], texto:['Do alto dá pra ver quatro cidades ao mesmo tempo. Você fica parado mais tempo do que planejou.'], ef:{hp:3}},

  /* ─── cemitério, cidade e ruína ─── */
  {amb:['cemiterio'], texto:['Uma flor amarela nascida sozinha entre duas pedras, longe de onde essa flor devia nascer.']},
  {amb:['cidade','especial'], texto:['Numa lixeira de rua, uma Câmera descartável com dezoito poses ainda. Ninguém joga isso fora à toa.'],
   ef:{itens:{'Câmera descartável':1}}},
  {amb:['especial','cidade'], texto:['Um papel timbrado amassado no chão, com brasão no alto. Você desamassa. É um aviso de cobrança de água.']},

  /* ─── itens segurados: coisa de gente, largada por gente ─── */
  {texto:['Amarrado num galho, na altura do peito, um saquinho de pano com ração boa dentro e um nó que alguém deu com muito cuidado.',
          'O nó é de quem amarrou pra não perder e perdeu assim mesmo.'], ef:{itens:{'Resto de Ração':1}}},
  {texto:['Uma faixa de algodão grossa, suja de terra, no meio da trilha. Tem marca de nó nas duas pontas.'], ef:{itens:{'Faixa Firme':1}}},
  {amb:['montanha','caverna'], texto:['Um peso de chumbo costurado numa tira de couro, encostado numa pedra. Pesa muito mais do que parece.'], ef:{itens:{'Punho de Ferro':1}}},
  {amb:['cidade','especial'], texto:['Numa mureta, um par de óculos de lente grossa com a armação torta, esperando um dono que não voltou.'], ef:{itens:{'Óculos Grossos':1}}},
  {amb:['campo','floresta'], texto:['Um colete de couro rachado pendurado numa cerca, com remendo nas costas e a fivela ainda boa.'], ef:{itens:{'Colete de Couro':1}}},
  {texto:['Um sino de latão do tamanho de uma unha, no chão, com o barbante arrebentado.',
          'Você balança sem querer e o som é ridículo e você balança de novo de propósito.'], ef:{itens:{'Sino Calmante':1}}},
  {amb:['agua','cidade'], texto:['Uma moeda antiga furada no meio, pendurada num barbante, presa numa fresta de calçada.'], ef:{itens:{'Amuleto de Moeda':1}}},
  {amb:['campo','rota','floresta'], texto:['Uma botina de sola fina, quase gasta, do pé esquerdo — e o do direito três metros adiante.'], ef:{itens:{'Botina Leve':1}}}
];

const Descobertas = {
  sortear(id, local, soCidade){
    const d = Estado.dados;
    const lista = (DESCOBERTAS[id] || []).filter(x => !Mundo.descobriu('achou_' + x.chave));
    if (lista.length && Dados.chance(soCidade ? 75 : 55)){
      const a = Dados.escolher(lista);
      Mundo.descobrir('achou_' + a.chave);
      Estado.registrar(`Descobriu em ${local.nome}: ${a.texto[0].slice(0,60)}…`);
      return a;
    }
    if (!soCidade && Dados.chance(52)){
      const amb = local.ambiente || 'campo';
      const pool = ACHADOS_ROTA.filter(a => !a.amb || a.amb.includes(amb));
      return Dados.escolher(pool.length ? pool : ACHADOS_ROTA);
    }
    return null;
  }
};

/* ============================================================
   CONVERSAS — o que os moradores falam
   ============================================================ */
const CONVERSAS = {
  pallet:[
    ['"Você é filho de quem mesmo?" A senhora pergunta sabendo a resposta. É o jeito dela de puxar assunto.'],
    ['Um pescador conserta rede na varanda. "Ninguém sai daqui, sabia? Você é o terceiro em dez anos."'],
    ['"O Professor não recebe mais ninguém", diz o padeiro. "Desde que aquele menino voltou de Cinnabar, ele não recebe."']
  ],
  viridian:[
    ['"Tem gente perguntando por gente", diz o atendente do Centro. "Sempre teve. Mas esse ano tá demais."'],
    ['Um treinador mais velho: "Floresta de Viridian tem dois caminhos. O marcado e o curto. Nenhum dos dois é bom à noite."'],
    ['"Aquele ginásio ali?" O homem ri sem alegria. "Ficou fechado dois anos. Reabriu faz pouco. Boa sorte em entrar."']
  ],
  pewter:[
    ['"Aqui todo mundo trabalhou na pedreira ou é filho de quem trabalhou", diz a mulher da banca. "Inclusive o líder do ginásio."'],
    ['Uma menina de uns dez anos: "Você vai lutar no ginásio? Leva alguma coisa de Água. Todo mundo esquece."'],
    ['"O museu tá pedindo doação de novo", reclama um senhor. "Eles têm um bicho de trezentos milhões de anos e não têm telhado."']
  ],
  cerulean:[
    ['"Cuidado com quem vende na ponte", diz a moça do Centro. "É legal. É legalizado. Não é bom."'],
    ['Um pescador: "O rio mudou de cor duas vezes esse mês. Ninguém explica. Ninguém pergunta."'],
    ['"A líder daqui é braba", diz um garoto. "Ela não perde em casa faz uns três anos."']
  ],
  vermilion:[
    ['"Porto é assim", diz o estivador, sem parar de trabalhar. "Chega coisa, sai coisa, e ninguém pergunta."'],
    ['Uma vendedora de peixe frito: "Navio grande atraca quinta. Aí a cidade enche de gente que nunca dormiu no chão."'],
    ['"O líder daqui foi soldado", diz o garoto do cais. "De verdade. Antes disso."']
  ],
  lavender:[
    ['A senhora de luto não fala nada por um tempo. Depois: "O primeiro é o pior. Depois você aprende a escrever mais rápido."'],
    ['"Ninguém sobe na torre à noite", diz o zelador. "Não é proibido. É que ninguém sobe."'],
    ['Um homem mais novo que você aparenta: "Eu trabalho aqui há um ano e não acostumei. Dizem que ninguém acostuma."']
  ],
  celadon:[
    ['"Você tem cara de quem tá procurando alguma coisa", diz o segurança do shopping. "Todo mundo aqui tem."'],
    ['Um entregador de gás, sem você perguntar: "Chega caminhão de madrugada no depósito atrás do cassino. Todo mês. Ninguém pergunta porque paga bem não perguntar."'],
    ['"A dona do ginásio é a pessoa mais educada dessa cidade", diz a florista. "E a mais difícil de agradar."']
  ],
  fuchsia:[
    ['"Metade dessa cidade trabalha na Zona", diz o dono do bar. "A outra metade vive de quem trabalha na Zona."'],
    ['Um guarda-parque de folga, já bêbado: "Setor 7 é onde a gente aprende que não existe emprego limpo." O colega manda ele calar a boca.'],
    ['"O ginásio daqui você não acha", ri a mulher da banca. "Tem gente que procura três dias."']
  ],
  saffron:[
    ['"Crachá branco vai até o oitavo andar", diz um funcionário na fila da lanchonete. "Azul vai até o décimo."'],
    ['"O ginásio fechou faz três semanas", diz a moça do Centro, e baixa a voz sem motivo. "A líder não explicou."'],
    ['Um segurança de prédio comercial: "Quinta-feira à noite sobe uma entrega pela doca que ninguém do administrativo registra."']
  ],
  cinnabar:[
    ['"Fechou há anos", diz a aposentada sobre o laboratório. Depois, mais baixo: "Fechou no papel."'],
    ['"Tinha um tanque lá dentro", diz ela, aceitando o café. "Grande, do tamanho de um carro. E o que tava dentro cresceu rápido demais pro tanque."'],
    ['O dono da pousada: "O vulcão tá soltando fumaça vermelha. Fumaça não é vermelha."']
  ]
};

const CONVERSAS_ROTA = [
  ['Um treinador acampado reclama do vento por dez minutos e depois te deseja boa sorte com uma sinceridade desproporcional.'],
  ['Uma mulher com três Pokémon no pé pergunta se você viu um Growlithe. Ela procura há dois dias.'],
  ['"Não anda de noite", diz um homem com mochila grande. "Não porque tem bicho. Porque tem gente."'],
  ['Dois irmãos discutindo qual caminho é mais curto. Nenhum dos dois está certo, e você resolve não falar nada.'],
  ['Um senhor sentado numa pedra há tanto tempo que os Pidgey pousam perto dele sem se importar.']
];

const Conversas = {
  sortear(id){
    const L = LOCAIS[id];
    const banco = CONVERSAS[id];
    if (banco && banco.length) return Dados.escolher(banco);
    return Dados.escolher(CONVERSAS_ROTA);
  }
};

/* ============================================================
   SERVIÇOS DA CIDADE
   ============================================================ */
const Cidade = {
  centro(){
    Mundo.passar(1);
    const d = Estado.dados;
    if (!d.flags.tem_licenca){
      return Exploracao.tela([
        {tipo:'info', texto:'A enfermeira olha o seu cinto, depois a sua cara, e pergunta o número da sua licença.'},
        {tipo:'dano', texto:'Você não tem número nenhum. Ela atende do mesmo jeito — mas cobra, e cobra caro, porque sem licença você é cliente e não treinador.'}
      ]);
    }
    Estado.dados.time.forEach(curarTotal);
    Estado.curarJogador(10);
    Estado.salvar('auto');
    Exploracao.tela([
      {tipo:'cura', texto:'A enfermeira leva o time pra dentro e devolve tudo certo em vinte minutos. Você dorme num quarto com seis camas e cinco desconhecidos.'},
      {tipo:'info', texto:'Amanhece.'}
    ]);
  },

  loja(){
    const id = Mundo.id();
    const L = LOJAS[id];
    const catalogo = catalogoDaCidade(id);
    if (!catalogo.length)
      return UI.modal('Loja', '<p class="nada">Não tem loja aqui. Tem quem venda, mas não tem loja.</p>', false, 'mochila');

    const topo = `<div class="mochila-topo">
      <span class="grana">${Estado.j.dinheiro} ₽</span>
      <span class="peso">${UI.esc(L.nome)}</span>
    </div>
    <p class="sussurro" style="margin:0 0 12px">${UI.esc(L.ar)}</p>`;

    const linhas = catalogo.map(([n,p]) => {
      const caro = Estado.j.dinheiro < p;
      const desc = descricaoItem(n);
      const tenho = Estado.contaItem(n);
      return `<button class="item-linha compravel${caro ? ' caro' : ''}" ${caro ? 'disabled' : ''}
        onclick="Cidade.comprar('${n.replace(/'/g,"\\'")}',${p})">
        <span class="qtd">${p}</span>
        <span class="corpo">
          <span class="nome">${UI.esc(n)}${tenho ? ` <span class="fraco">(você tem ${tenho})</span>` : ''}</span>
          ${desc ? `<span class="desc">${UI.esc(desc)}</span>` : ''}
        </span>
      </button>`;
    }).join('');

    UI.modal('', topo + linhas, false, 'mochila');
  },
  comprar(nome, preco){
    if (Estado.j.dinheiro < preco) return;
    Estado.j.dinheiro -= preco;
    Estado.darItem(nome, 1);
    Estado.salvar('auto');
    this.loja();
  },

  ginasio(){
    const id = Mundo.id();
    const g = GINASIOS.find(x => x.id === id);
    if (!g) return Exploracao.tela([{tipo:'info', texto:'Não tem ginásio aqui.'}]);
    const st = statusGinasio(g);
    if (st.estado === 'conquistado')
      return Exploracao.tela([{tipo:'info', texto:'Você já tem a insígnia daqui. O líder acena de longe e volta ao que estava fazendo.'}]);
    if (st.estado === 'recusado')
      return Exploracao.tela([{tipo:'dano', texto:st.fala}]);
    if (st.estado !== 'disponivel')
      return Exploracao.tela([{tipo:'info', texto:st.texto}]);
    Jogo.voltarDeGinasio = 'exploracao';
    Jogo.desafiarGinasio(g.id);
  }
};
