/* ============================================================
   LUGARES — o que se descobre e o que se ouve em cada lugar
   ============================================================ */

/* Onde cada arco da história espera por você.
   Ele não aparece como "capítulo": aparece como uma coisa no lugar. */
const ANCORAS = {
  2:  {local:'viridian',  chamada:'Tem um mural de recados na entrada do Centro Pokémon.'},
  3:  {local:'floresta',  chamada:'Um som fino, repetido, vindo de dentro do mato fechado.'},
  4:  {local:'pewter',    chamada:'Uma detonação que faz o vidro das lojas tremer, e a rua inteira para sem ninguém levantar a cabeça.'},
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
  18: {local:'saffron',   chamada:'O cartório da rua Dez abre até as 17h e cobra oito pokedólares a cópia.'},
  19: {local:'rota21',    chamada:'A cerca nova de três metros, com placa de área de pesquisa.'},
  20: {local:'saffron',   chamada:'Sala 704, sétimo andar, prédio comercial com farmácia no térreo. Segunda, 10h.'},
  21: {local:()=>localDoCapitulo(1), chamada:'Faz tempo demais que você não vê a sua rua, e alguém ligou três vezes.'},
  22: {local:'planalto',  chamada:'A arena aberta tem chaveamento afixado e o seu nome está nele, e você não se inscreveu.'},
  23: {local:'viridian',  chamada:'O segundo andar do ginásio está aberto pela primeira vez em dois anos.'},
  24: {local:'rota23',    chamada:'Sete guaritas em fila, e a primeira já quer ver o seu cartão.'},
  25: {local:'saffron',   chamada:'A convocação chegou por telegrama, e telegrama não se responde com "não".'},
  26: {local:'planalto',  chamada:'Eles te esperam numa sala com mesa comprida e quatro cadeiras.'},
  27: {local:'norte',     chamada:'O vale entre duas paredes de pedra, sem saída no fundo.'},
  28: {local:'norte',     chamada:'A boca da caverna é mais alta que uma casa e o ar que sai dela é morno.'},

  /* Capítulos condicionais: só existem em certas rotas, e por isso
     a âncora deles fica aqui embaixo, fora da ordem da jornada. */
  29: {local:'cerulean',  chamada:'Quarta casa depois da segunda ponte. Portão de chapa verde, sem número.'},
  30: {local:'lavender',  chamada:'Onze linhas no livro da guarita e a coluna de descida vazia nas onze.'},
  31: {local:'celadon',   chamada:'A sede da Associação Comercial fica no sobrado de uma loja de tecido, e o fax chega toda segunda.'},
  32: {local:'saffron',   chamada:'Rua Industrial 3: um galpão sem placa, com a caixa de correio cheia e nenhuma janela na fachada.'}
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
    'No portão de funcionários da pedreira, no fim do turno da tarde, um homem de capacete pergunta se você é {treinador|treinadora}.',
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
  {chave:'relembrar_cerulean', texto:[
    'Nos fundos da escola de treinadores tem uma sala com a porta encostada e caixas de apostila velha até o teto.',
    'Uma senhora de óculos de leitura está lá dentro com um Slowpoke no colo, e o Slowpoke está fazendo um golpe que você não via ele fazer desde que era filhote.',
    'Ela levanta os olhos. "Não ensino nada novo. Só faço lembrar."'], descobre:'relembrar_cerulean'},
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
  {chave:'relembrar_celadon', texto:[
    'No terceiro andar da loja de departamentos, entre o provador e o depósito, tem uma porta sem placa.',
    'Sai de lá um treinador com um Machoke, e o Machoke faz no corredor um movimento que o dono fica olhando como quem vê um parente voltar.'], descobre:'relembrar_celadon'},
  {chave:'loja_celadon', texto:['O shopping tem sete andares e o quarto inteiro é de item de treinador. Você fica quinze minutos parad{o|a} só olhando prateleira.'], descobre:'loja_celadon'},
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
  {chave:'s_cartorio', texto:['O cartório da rua Dez abre até as 17h, cobra oito pokedólares a cópia e não faz pergunta nenhuma.']},
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
  {chave:'pl_ushio', texto:['Sr. Ives varre a mesma calçada há vinte anos. Ele te olha passar e não diz nada, que no caso dele é uma coisa que ele escolheu.']}
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
  {amb:['campo','floresta'], texto:['Uma colmeia caída, vazia, e o cheiro de mel ainda no ar. Você não é {o primeiro|a primeira} a chegar aqui hoje.'], ef:{itens:{'Ração':1}}},

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
  {amb:['montanha'], texto:['Do alto dá pra ver quatro cidades ao mesmo tempo. Você fica parad{o|a} mais tempo do que planejou.'], ef:{hp:3}},

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
  /* Gente de estrada que troca não precisa de entrada duplicada na
     tabela: a descoberta sai da própria troca. Assim, mexer numa
     troca nunca deixa a descoberta dela desatualizada. */
  deTroca(id){
    if (typeof TROCAS === 'undefined' || !TROCAS[id]) return [];
    if (Estado.dados.descobertas['troca_' + id]) return [];
    const t = (Trocas.lista(id) || [])[0];
    if (!t) return [];
    return [{chave:'troca_' + id, descobre:'troca_' + id, texto:[
      `Tem gente ${t.onde}.`,
      `É ${t.quem}. ${Dados.chance(50)
        ? 'Levanta a cabeça quando você passa e olha o seu cinto antes de olhar a sua cara.'
        : 'Te vê chegar de longe e já vai falando, do jeito de quem estava esperando qualquer um.'}`
    ]}];
  },

  sortear(id, local, soCidade){
    const d = Estado.dados;
    const lista = (DESCOBERTAS[id] || []).concat(this.deTroca(id))
      .filter(x => !Mundo.descobriu('achou_' + x.chave));
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
    ['Uma senhora para de varrer só pra te encarar melhor.',
     fala('a senhora do número 12', 'Você é {filho|filha} de quem mesmo?', null, 'Ela sabe a resposta. É o jeito dela de puxar assunto.')],
    ['Um pescador conserta rede na varanda e fala sem levantar a cabeça.',
     fala('o pescador', 'Ninguém sai daqui, sabia? Você é {o terceiro|a terceira} em dez anos.')],
    [fala('o padeiro', 'O Professor não recebe mais ninguém. Desde que aquele menino voltou de Cinnabar, ele não recebe mais ninguém.', 'baixo')],
    ['Duas crianças jogam bola contra o muro do laboratório.',
     fala('a menina da bola', 'Esse muro é o melhor muro de Pallet. Ele devolve RETO.', null, 'Ela explica isso com uma seriedade absoluta.')],
    [fala('o homem do armazém', 'Pallet não tem Centro Pokémon. Tem eu, que vendo band-aid, e tem Viridian, que fica a um dia.', null,
          'Ele fala isso sem que você tenha perguntado nada.')],
    ['Uma mulher estende roupa no varal conversando com um Rattata que mora embaixo da casa dela há seis anos.',
     fala('a mulher do varal', 'Sai daí, Senhor. SAI DAÍ, SENHOR.', 'grita', 'Ela chama ele de Senhor. O Rattata atende pelo nome.')],
    [fala('o pescador', 'Todo ano sai um. Todo ano volta um. Quase nunca é o mesmo.')],
    ['O armazém tem um telefone de parede com uma lista de números escrita a lápis direto na tinta. O último número foi riscado.'],
    {cond:d=>d.insignias.length>0, texto:[
     fala('a senhora do número 12', 'Eu vi a tua gente no armazém. Não falou de você. Falou de comida a viagem inteira — que é como essa gente fala de você.')]},
    {cond:d=>d.relogio.periodo==='madrugada', texto:['Pallet de madrugada é quatro postes e o mar. Um dos postes está queimado desde que você se entende por gente.']}
  ],
  viridian:[
    [fala('o atendente do Centro', 'Tem gente perguntando por gente. Sempre teve. Mas esse ano tá demais.')],
    ['Um treinador mais velho te para no meio da calçada.',
     fala('o treinador mais velho', 'A Floresta de Viridian tem dois caminhos: o marcado e o curto. Nenhum dos dois é bom à noite.')],
    [fala('o homem da esquina', 'Aquele ginásio ali? Ficou fechado dois anos. Reabriu faz pouco.', null, 'Ele ri, e não tem alegria nenhuma no riso.'),
     fala('o homem da esquina', 'Boa sorte em entrar.')],
    ['A recepcionista do Centro atende três pessoas ao mesmo tempo sem levantar a voz uma vez. Você fica olhando mais do que devia.'],
    [fala('a moça da banca de fruta', 'Viridian é cidade de passagem. Ninguém compra pra casa. Todo mundo compra pra estrada.')],
    ['Um guarda florestal de folga, com o uniforme ainda meio vestido, escuta a conversa da mesa ao lado e se intromete.',
     fala('o guarda florestal', 'A Floresta não é perigosa. A Floresta é GRANDE. As pessoas confundem.', 'grita')],
    ['Um casal discute na fila do Centro se vale a pena atravessar hoje ou esperar amanhã. Pelo estado dos dois, essa discussão já passou de uma hora.'],
    [fala('o velho do banco da praça', 'O menino de Pallet passou por aqui faz dois anos. Não falou com ninguém. Nem naquela época.')],
    {cond:d=>d.flags.leu_aviso_floresta, texto:[
     'Você pergunta do bilhete do mural. A atendente não sorri.',
     fala('a atendente do Centro', 'Fui eu que escrevi. E eu escreveria de novo.', 'frio')]},
    {cond:d=>d.insignias.length>=4, texto:[
     'Um garoto de uns doze anos te segue meio quarteirão antes de criar coragem.',
     fala('o garoto de doze anos', 'Quantas... quantas insígnias você tem?', 'baixo',
          'Você responde. Ele só fala "ah" e vai embora feliz da vida.')]}
  ],
  pewter:[
    [fala('a mulher da banca', 'Aqui todo mundo trabalhou na pedreira ou é filho de quem trabalhou. Inclusive o líder do ginásio.')],
    ['Uma menina de uns dez anos te aborda com a autoridade de quem já viu isso dar errado.',
     fala('a menina de dez anos', 'Você vai lutar no ginásio? Leva alguma coisa de Água. TODO MUNDO esquece.', 'grita')],
    [fala('o senhor do museu', 'O museu tá pedindo doação de novo. Eles têm um bicho de trezentos milhões de anos e não têm telhado.')],
    ['Um homem de capacete atravessa a rua com um Machop carregando viga. Nenhum dos dois parece achar aquilo digno de nota.'],
    [fala('o dono da lanchonete', 'Pedra de Pewter foi pro mundo inteiro. Tem prédio em Saffron feito da minha cidade.'),
     fala('o dono da lanchonete', 'Eles não sabem disso. Eu sei.')],
    ['Uma senhora varre a calçada, e a calçada é de pedra irregular, e ela varre mesmo assim, todo dia, porque é a calçada dela.'],
    ['O museu tem uma sala fechada com um aviso escrito à mão: FÓSSEIS — REFORMA. A folha do aviso já amarelou.'],
    [fala('o rapaz da pedreira', 'O líder daqui não pega leve com criança. Tem gente que acha ruim.'),
     fala('o rapaz da pedreira', 'Eu acho que é a única coisa honesta nesta cidade.')],
    {cond:d=>d.insignias.includes('Insígnia Pedra'), texto:[
     'A mulher da banca vê a sua insígnia e não comenta nada. Só põe uma fruta a mais no saco e empurra a sua mão quando você vai pagar por ela.']},
    {cond:d=>d.relogio.periodo==='manhã', texto:['Às seis e meia a sirene da pedreira toca e a cidade inteira muda de ritmo em quinze segundos, como se alguém tivesse trocado a marcha.']}
  ],
  cerulean:[
    [fala('a moça do Centro', 'Cuidado com quem vende na ponte. É legal. É legalizado.', null, 'Uma pausa curta.'),
     fala('a moça do Centro', 'Não é bom.')],
    [fala('o pescador da ponte', 'O rio mudou de cor duas vezes esse mês. Ninguém explica. Ninguém pergunta.')],
    ['Um garoto de boné te aborda com a empolgação de quem torce pelo time da casa.',
     fala('o garoto de boné', 'A líder daqui é BRABA. Ela não perde em casa faz uns três anos!', 'grita')],
    ['Duas irmãs discutem na porta do ginásio de quem é a vez de limpar a piscina. Pelo tom, essa discussão é mais velha que você.'],
    [fala('o rapaz da loja', 'Tem um cara na Rota 25 que estuda bicho o dia inteiro sozinho. Ele é gente boa.'),
     fala('o rapaz da loja', 'Só não vai de tarde. De tarde ele dorme.')],
    ['Uma mulher lava um Poliwag numa bacia na calçada. O Poliwag está claramente adorando e a mulher está claramente atrasada pro trabalho.'],
    [fala('o velho da praça', 'Cerulean é a cidade mais bonita de Kanto.', null, 'E aí ele olha pra você.'),
     fala('o velho da praça', 'Isso é o que a gente fala aqui. Não repete em Celadon.', 'baixo')],
    ['A ponte norte tem seis garotos que desafiam quem passa, em fila, um atrás do outro. É uma tradição e é também um pequeno negócio.'],
    {cond:d=>d.flags.salvou_vaporeon, texto:[
     'Uma senhora te para na rua e segura a sua mão com as duas dela.',
     fala('a senhora da rua', '...obrigada. Obrigada, obrigada.', 'baixo',
          'Ela não explica, e não precisa: metade da cidade já sabe o que aconteceu na Rota 25.')]},
    {cond:d=>d.reputacao.eixo==='ruim'&&d.reputacao.ruim>=3, texto:[
     'A moça do Centro atende você com toda a educação do mundo e não olha na sua cara uma vez sequer. Isso é bem pior do que se ela gritasse.']}
  ],
  vermilion:[
    [fala('o estivador', 'Porto é assim. Chega coisa, sai coisa, e ninguém pergunta.', null, 'Ele não para de trabalhar em momento nenhum.')],
    [fala('a vendedora de peixe frito', 'Navio grande atraca quinta. Aí a cidade enche de gente que nunca dormiu no chão.')],
    ['Um garoto do cais aponta o ginásio com o queixo.',
     fala('o garoto do cais', 'O líder daqui foi soldado. De verdade! Antes disso tudo.')],
    ['Um marinheiro aposentado descreve a Rota 21 pra um grupo de turistas com uma precisão que ninguém pediu e que todo mundo agradece.'],
    [fala('o rapaz do posto', 'Tem um buraco ali perto que vai dar em Pewter. Leva o dia todo, é escuro e tem Diglett até no teto.'),
     fala('o rapaz do posto', 'Mas vai.')],
    ['Duas mulheres carregam uma caixa de gelo entre as duas e param a cada dez metros pra trocar de mão. Elas fazem isso todo dia e não aceitam ajuda de ninguém.'],
    [fala('o homem da guarita', 'Vermilion tem o melhor pôr do sol de Kanto e ninguém olha.'),
     fala('o homem da guarita', 'Eu olho. Sou pago pra ficar olhando pra algum lugar mesmo.')],
    ['Um menino vende concha na calçada, arrumada por tamanho numa toalha. As grandes custam mais e ele explica por quê com uma lógica impecável.'],
    {cond:d=>d.insignias.includes('Insígnia Trovão'), texto:[
     'O estivador aponta a sua insígnia com o queixo.',
     fala('o estivador', 'Ele te deu aquela?', null, 'Uma pausa longa.'),
     fala('o estivador', 'Então ele não tá tão velho quanto eu andava achando.')]},
    {cond:d=>d.relogio.periodo==='noite', texto:['À noite o porto não para, só fica mais devagar. Os guindastes continuam trabalhando com luz amarela, e é bonito de um jeito que ninguém do turno reconhece.']}
  ],
  lavender:[
    ['A senhora de luto não fala nada por um tempo comprido.',
     fala('a senhora de luto', 'O primeiro é o pior. Depois você aprende a escrever mais rápido.', 'baixo')],
    [fala('o zelador da torre', 'Ninguém sobe na torre à noite. Não é proibido.'),
     fala('o zelador da torre', 'É que ninguém sobe.')],
    ['Um homem bem mais novo do que aparenta ser, encostado na parede do abrigo.',
     fala('o funcionário do abrigo', 'Eu trabalho aqui há um ano e não acostumei. Dizem que ninguém acostuma.')],
    ['O Sr. Fuji atende a porta do abrigo com um Cubone no colo.',
     fala('Sr. Fuji', 'Me desculpe, eu não posso conversar agora.', 'baixo',
          'Ele parece pedir desculpa a muita gente, o dia inteiro, todo dia.')],
    [fala('a dona da marcenaria', 'A gente é a cidade pra onde as coisas vão. Alguém tem que ser.')],
    ['Um casal jovem sai da torre em silêncio. Ela está segurando uma bola vazia. Ele está segurando ela.'],
    ['O abrigo do Sr. Fuji tem onze Pokémon que não são de ninguém e um caderno na porta onde as pessoas escrevem o nome de quem deixaram.'],
    [fala('o zelador da torre', 'Tem gente que vem de Saffron só pra subir a torre. De carro. Sobem, descem, voltam.'),
     fala('o zelador da torre', 'Eu não julgo. Muito.')],
    {cond:d=>d.cemiterio.length>0, texto:[
     'A senhora de luto olha o seu cinto e conta. Ela não pergunta nada.',
     fala('a senhora de luto', 'Tem um lugar lá em cima com vista pro leste. É onde eu vou.', 'baixo')]},
    ['A cidade inteira não tem música em lugar nenhum. Você percebe isso depois de meia hora e não consegue mais desperceber.']
  ],
  celadon:[
    [fala('o segurança do shopping', 'Você tem cara de quem tá procurando alguma coisa.', null, 'Ele fala isso sem hostilidade nenhuma.'),
     fala('o segurança do shopping', 'Todo mundo aqui tem.')],
    ['Um entregador de gás encosta o botijão no chão e fala sem você ter perguntado nada.',
     fala('o entregador de gás', 'Chega caminhão de madrugada no depósito atrás do cassino. Todo mês.', 'baixo'),
     fala('o entregador de gás', 'Ninguém pergunta, porque paga bem não perguntar.')],
    [fala('a florista', 'A dona do ginásio é a pessoa mais educada desta cidade.'),
     fala('a florista', 'E a mais difícil de agradar. As duas coisas juntas.')],
    ['O quarto andar do shopping tem um vendedor que sabe de cabeça o preço de tudo e se recusa a usar a etiqueta. Ele erra pra menos, às vezes, de propósito.'],
    ['Um senhor sentado no chão do corredor do shopping resolve desabafar com você.',
     fala('o senhor do corredor', 'Sete andares de loja e nenhum lugar pra sentar de graça! SETE!', 'grita')],
    ['Um grupo de meninas de uniforme de escola atravessa o saguão do cassino sem olhar pros lados, como quem já foi avisado de tudo.'],
    ['A estufa do ginásio dá pra ver da rua. Tem mais gente olhando de fora do que você esperava, e ninguém entra.'],
    [fala('a moça do café', 'Eu trabalhei no cassino antes. Não quero falar disso.', 'baixo'),
     fala('a moça do café', 'Mas se você for: não joga na máquina do canto.')],
    {cond:d=>d.insignias.length>=5, texto:[
     'O segurança do shopping te reconhece e te chama de "{moço|moça}" de um jeito completamente diferente do que chamava antes. Você repara, e fica meio sem graça.']},
    {cond:d=>d.flags.sabe_da_comissao, texto:[
     'A florista baixa a voz sem motivo aparente nenhum.',
     fala('a florista', 'Tem uns moços de camisa social perguntando de galpão nesta cidade. Não são da prefeitura.', 'baixo')]}
  ],
  fuchsia:[
    [fala('o dono do bar', 'Metade desta cidade trabalha na Zona. A outra metade vive de quem trabalha na Zona.')],
    ['Um guarda-parque de folga, já bem bêbado, derruba o copo na mesa.',
     fala('o guarda-parque', 'Setor 7 é onde a gente aprende que não existe emprego limpo!', 'grita',
          'O colega dele manda ele calar a boca, e manda sério.')],
    ['A mulher da banca ri quando você pergunta onde fica o ginásio.',
     fala('a mulher da banca', 'O ginásio daqui você não acha. Tem gente que procura TRÊS DIAS.', 'riso')],
    ['Uma criança explica pra outra, com total autoridade, que a Zona Safári tem um bicho que ninguém nunca pegou. Ela não sabe qual. Isso não atrapalha em nada a história.'],
    [fala('o atendente do posto', 'Poké Ball não funciona lá dentro. Só as de lá. Não é golpe, é regra.'),
     fala('o atendente do posto', 'Eu explico isso quarenta vezes por dia. Quarenta.')],
    ['Um veterinário sai da reserva com a manga da camisa rasgada e conversa normalmente com você sobre o clima.'],
    [fala('o dono do bar', 'Aqui a gente chama a cerca de cerca. Em Saffron eles chamam de área de manejo.'),
     fala('o dono do bar', 'É a mesma cerca.')],
    ['Uma placa na entrada da reserva lista os horários. Alguém corrigiu o horário de domingo com caneta, e a correção também já está velha.'],
    {cond:d=>d.flags.sabe_do_setor7, texto:[
     'O guarda-parque bêbado te reconhece e fica sóbrio na hora. Ele não fala nada. Ele paga e sai do bar.']},
    {cond:d=>d.relogio.periodo==='tarde', texto:['Às quatro da tarde o ônibus da Zona descarrega quarenta pessoas de chapéu novo, e a cidade inteira aumenta de volume por vinte minutos.']}
  ],
  saffron:[
    [fala('o funcionário da fila', 'Crachá branco vai até o oitavo andar. Azul vai até o décimo.')],
    [fala('a moça do Centro', 'O ginásio fechou faz três semanas.', null, 'E aí ela baixa a voz sem nenhum motivo.'),
     fala('a moça do Centro', 'A líder não explicou nada pra ninguém.', 'baixo')],
    [fala('o segurança do prédio', 'Quinta-feira à noite sobe uma entrega pela doca que ninguém do administrativo registra.', 'baixo')],
    ['A Silph tem onze andares e um saguão onde cabe a praça de Pallet inteira. Tem também quatro pessoas sentadas num sofá, esperando desde antes de você chegar.'],
    [fala('o rapaz da banca de jornal', 'Saffron é a cidade onde o Kanto decide as coisas.'),
     fala('o rapaz da banca de jornal', 'E é a cidade onde ninguém vota em nada.')],
    ['Um grupo de estagiários almoça na escada do prédio comercial, todos com o mesmo crachá branco, todos com a mesma marmita do mesmo lugar.'],
    ['Uma mulher de terno atende o Pokégear na calçada e diz "não" catorze vezes seguidas com entonações completamente diferentes.'],
    [fala('o segurança do prédio', 'Tem um dojo do outro lado da cidade. Eles brigaram com o ginásio faz uns anos e perderam.'),
     fala('o segurança do prédio', 'Continuam lá. Continuam brigados.')],
    {cond:d=>d.flags.sabe_da_silph, texto:[
     'O rapaz da banca de jornal dobra o jornal quando você chega e destrava assunto sozinho.',
     fala('o rapaz da banca de jornal', '{O senhor|A senhora} também tá atrás do andar oito, né.', 'baixo')]},
    {cond:d=>d.reputacao.eixo==='bom'&&d.reputacao.bom>=5, texto:[
     'Uma mulher de crachá azul te para na calçada.',
     fala('a mulher de crachá azul', 'Eu li o seu nome em algum lugar.', null,
          'E some antes de você conseguir perguntar onde.')]}
  ],
  cinnabar:[
    [fala('o barqueiro', 'A ilha inteira é o vulcão. As casas são o que sobrou de espaço.')],
    [fala('a moça da vitrine', 'O laboratório aceita fóssil. Aceita mesmo.'),
     fala('a moça da vitrine', 'Já vi sair bicho de lá que não devia estar andando.', 'baixo')],
    ['Um velho aponta a mansão queimada no alto do morro e não fala nada sobre ela. Ele só aponta e continua o caminho.'],
    [fala('o rapaz do píer', 'O líder daqui faz pergunta antes de lutar. Se você não souber responder, ele luta mesmo assim.'),
     fala('o rapaz do píer', 'Mas você sabe que ele sabe.')],
    ['A dona da vitrine leva tudo o que vende de barco, o que quer dizer que às vezes falta tudo, e ela avisa disso com humor.'],
    ['Uma família de turistas tira foto com o vulcão ao fundo, e o guia local espera com a paciência de quem faz isso quarenta vezes por semana.'],
    [fala('o barqueiro', 'Ninguém da ilha entra naquela mansão. Gente de fora entra.'),
     fala('o barqueiro', 'A gente vê entrar e vê sair. É só isso que a gente faz.')],
    ['O laboratório tem uma janela onde dá pra ver uma bancada com luz acesa a qualquer hora do dia ou da noite. Ninguém nunca está sentado nela.'],
    {cond:d=>d.insignias.length>=6, texto:[
     'O rapaz do píer olha o seu cinto e conta.',
     fala('o rapaz do píer', 'Seis.', null, 'Ele assobia.'),
     fala('o rapaz do píer', 'Então {o senhor|a senhora} vai pra Viridian depois daqui. E aí a gente vai ver notícia sua.')]},
    {cond:d=>d.mundo&&d.mundo.instabilidade>=6, texto:[
     fala('o barqueiro', 'O mar tá diferente.', 'baixo', 'E ele não diz mais nada por um tempo comprido.'),
     fala('o barqueiro', 'Não é maré. Eu sei o que é maré.')]}
  ]
};

const CONVERSAS_ROTA = [
  ['Um treinador acampado reclama do vento por dez minutos e depois te deseja boa sorte com uma sinceridade desproporcional.'],
  ['Uma mulher com três Pokémon no pé pergunta se você viu um Growlithe. Ela procura há dois dias.'],
  ['"Não anda de noite", diz um homem com mochila grande. "Não porque tem bicho. Porque tem gente."'],
  ['Dois irmãos discutindo qual caminho é mais curto. Nenhum dos dois está certo, e você resolve não falar nada.'],
  ['Um senhor sentado numa pedra há tanto tempo que os Pidgey pousam perto dele sem se importar.'],
  ['Um ciclista passa, freia vinte metros à frente, volta de marcha a ré pedalando, e pergunta se você tem água. Você tem. Ele agradece demais.'],
  ['Uma família inteira almoça numa toalha na beira da estrada. A mãe te oferece comida com a naturalidade de quem oferece a todo mundo que passa.'],
  ['Um homem conta Pidgey. Ele explica que faz isso há onze anos e que o número vem caindo, e que ninguém quer o caderno dele.'],
  ['"Você tem Repelente sobrando?" Dois treinadores jovens dividem o último de um frasco entre os dois, o que não é como Repelente funciona.'],
  ['Um entregador com uma caixa amarrada nas costas anda mais rápido que você sem parecer estar com pressa.'],
  ['Uma senhora com um Meowth no ombro pergunta as horas e depois fica conversando por dez minutos sem olhar o relógio nenhuma vez.'],
  ['Dois guardas da Liga passam a cavalo de Rapidash e cumprimentam com a cabeça. Nenhum dos dois diminui o passo.']
];

/* Uma conversa pode vir condicionada ao estado: {cond, texto}.
   E a última não se repete — nada mata mais uma cidade do que
   falar com três pessoas e ouvir a mesma frase duas vezes. */
const Conversas = {
  ultima: {},

  disponiveis(banco){
    const d = Estado.dados;
    return (banco || []).filter(c => {
      if (Array.isArray(c)) return true;
      try { return !c.cond || c.cond(d); } catch(e){ return false; }
    });
  },

  sortear(id){
    const banco = this.disponiveis(CONVERSAS[id]);
    const fonte = banco.length ? banco : this.disponiveis(CONVERSAS_ROTA);
    if (!fonte.length) return ['Não tem ninguém por perto pra falar coisa nenhuma.'];
    const texto = c => Array.isArray(c) ? c : c.texto;
    /* A chave de "não repetir a última" tem que ser uma string: a primeira
       linha pode ser um objeto de fala, e objeto nunca é igual a objeto. */
    const chave = c => {
      const l = texto(c)[0];
      if (typeof l === 'string') return l;
      if (l && typeof l === 'object' && l.diz) return String(l.quem) + '|' + String(l.diz);
      return JSON.stringify(l);
    };
    let pool = fonte;
    if (fonte.length > 1){
      const antes = this.ultima[id];
      const semRepetir = fonte.filter(c => chave(c) !== antes);
      if (semRepetir.length) pool = semRepetir;
    }
    const escolhida = Dados.escolher(pool);
    this.ultima[id] = chave(escolhida);
    return texto(escolhida);
  }
};

/* ============================================================
   SERVIÇOS DA CIDADE
   ============================================================ */
/* ============================================================
   RELEMBRADOR DE GOLPES — Cerulean, Celadon e o Planalto
   Faz o Pokémon lembrar de um golpe que a linha dele aprende até o
   nível atual e que ficou pelo caminho (esquecido pra dar lugar a
   outro, ou recusado quando subiu de nível). Nos jogos custa uma
   Heart Scale; aqui, que não tem Heart Scale, cobra em dinheiro — e
   só cobra se o golpe entrar. Mudou o preço? Folha de regras junto.
   ============================================================ */
const PRECO_RELEMBRAR = 1000;
const RELEMBRADOR = {
  cerulean:{
    sub:'Uma sala nos fundos da escola de treinadores.',
    ar:'Uma senhora de óculos de leitura atende numa sala dos fundos da escola de treinadores, entre caixas de apostila velha. Ela não ensina nada que o bicho não soube um dia. Ela só faz ele lembrar.'
  },
  celadon:{
    sub:'Uma porta sem placa no terceiro andar da loja de departamentos.',
    ar:'No terceiro andar da loja de departamentos tem uma porta sem placa entre o provador e o depósito. O homem lá dentro cobra caro, trabalha rápido e não pergunta o que aconteceu com o golpe.'
  },
  planalto:{
    sub:'Uma treinadora aposentada, no saguão antes da ala dos quatro.',
    ar:'No saguão antes da ala dos quatro, uma treinadora aposentada ocupa a mesma poltrona há anos. Ela diz que metade de quem chega até aqui esqueceu no caminho alguma coisa que ia precisar lá dentro.'
  }
};

/* ============================================================
   MURAIS — o que cada cidade prega na parede do Centro
   Recado de gente, aviso da prefeitura, anúncio de quem precisa.
   Ninguém explica nada: é papel, e papel diz o que a pessoa quis.
   ============================================================ */
const MURAIS = {
  pallet:[
    {t:'Achado: um boné vermelho na cerca da Rota 1. Tá na portaria do laboratório.', nota:'letra de fôrma, a lápis'},
    {t:'Aula de natação pra criança, sábado de manhã, na praia do outro lado do morro. Traga toalha.', nota:'com um desenho de Poliwag'},
    {t:'O mercado abre às dez. Não adianta bater antes.', nota:'papel de embrulho, preso com dois percevejos'}
  ],
  viridian:[
    {t:'Procuro meu Growlithe. Sumiu dia 4 perto da Rota 22. Recompensa.', nota:'com uma foto colada, tirada de longe, meio tremida'},
    {t:'Meu filho saiu pra jornada em março. Se alguém vir, diz que a mãe dele não tá brava.', nota:'sem foto e sem nome'},
    {t:'COMPRO POKÉMON. QUALQUER UM. QUALQUER ESTADO.', nota:'letra de imprensa, sem telefone, só um horário e um lugar'},
    {t:'NÃO ENTRE NA FLORESTA DE VIRIDIAN À NOITE.', nota:'escrito à mão com pressa e sublinhado três vezes'}
  ],
  pewter:[
    {t:'Museu: entrada franca na terça. Não encoste nos ossos.', nota:'impresso, com o carimbo do museu'},
    {t:'Vendo corda de escalada, pouco uso. Motivo: joelho.', nota:'com o número de telefone rasgado em tirinhas, faltam quatro'},
    {t:'O Monte da Lua não é passeio. Leve lanterna ou leve alguém que brilhe.', nota:'escrito com giz de cera, alguém corrigiu a ortografia'}
  ],
  cerulean:[
    {t:'Casa de barco aluga vaga por semana. Tratar com o barqueiro da ponte sul.', nota:'plastificado'},
    {t:'Achado: um Psyduck com dor de cabeça no chafariz. Continua lá. Ninguém sabe de quem é.', nota:'a caneta, com três pontos de exclamação'},
    {t:'Vender Pokémon é crime. Denuncie.', nota:'cartaz oficial, com a parte de baixo arrancada'}
  ],
  vermilion:[
    {t:'Estiva contrata por dia. Chegue às cinco.', nota:'datilografado, com a marca de um copo de café'},
    {t:'Perdi um Shellder no píer 3. Se ele estiver fechado, é ele.', nota:'letra de criança'},
    {t:'O navio atraca na lua cheia. Passagem só com reserva.', nota:'impresso, com o logotipo da companhia'}
  ],
  lavender:[
    {t:'Missa pelos que se foram, domingo, na torre. Traga uma vela.', nota:'papel roxo, sem assinatura'},
    {t:'Não deixe comida na porta da torre. Atrai o que não é pra atrair.', nota:'letra de gente velha, tremida'},
    {t:'Cubone sozinho na Rota 8. Se alguém souber da mãe dele, fala com o Sr. Fuji.', nota:'escrito a caneta, com o nome sublinhado'}
  ],
  celadon:[
    {t:'Loja de departamentos contrata para o natal. Currículo no quinto andar.', nota:'impresso, com borda dourada'},
    {t:'Aulas de arranjo com Pokémon de planta. Terça e quinta, no ginásio. Vagas limitadas.', nota:'com uma flor seca colada no canto'},
    {t:'Achado: um Eevee no estacionamento do shopping. Ele foi embora antes da gente ligar.', nota:'escrito à mão, meio apagado'}
  ],
  saffron:[
    {t:'A Silph informa: visitas guiadas suspensas até segunda ordem.', nota:'papel timbrado, preso com fita adesiva nova'},
    {t:'Dojô de luta: aula experimental grátis. Não traga Pokémon Psíquico, por favor.', nota:'letra grossa de pincel'},
    {t:'Perdi o ônibus, perdi a carteira e perdi a paciência. Se achar qualquer um dos três, devolve.', nota:'a lápis'}
  ],
  fuchsia:[
    {t:'Zona Safári: nada de briga lá dentro. O preço e as regras estão na guarita.', nota:'impresso, com o mapa da zona'},
    {t:'Achei um dente de ouro na Zona Safári. Não é meu. Não é de ninguém que eu conheça.', nota:'escrito à mão, com um ponto de interrogação enorme'},
    {t:'Não alimente os Slowpoke da praça. Eles não precisam, e depois não saem mais.', nota:'placa da prefeitura, colada por cima de outra'}
  ],
  cinnabar:[
    {t:'Laboratório aceita fóssil para análise. Não garantimos resultado. Não devolvemos a pedra.', nota:'datilografado, com o carimbo do laboratório'},
    {t:'Casa velha no alto do morro: não entre. O chão não é chão.', nota:'escrito a caneta vermelha'},
    {t:'Balsa pra Seafoam só com o mar calmo. Hoje não.', nota:'giz na lousa, e embaixo, noutro dia, alguém escreveu "nem amanhã"'}
  ],
  planalto:[
    {t:'Desafiante: a Liga não se responsabiliza por nada que aconteça depois da primeira porta.', nota:'impresso, com o selo da Liga'},
    {t:'Quem voltar, conta. Quem não voltar, a gente conta por você.', nota:'escrito à mão por baixo, com várias assinaturas'}
  ]
};

const Cidade = {
  /* A porta do Centro: tudo o que tem lá dentro, num lugar só. */
  centro(){
    const d = Estado.dados, L = Mundo.atual();
    const mural = MURAIS[Mundo.id()] ? `<button class="escolha" onclick="UI.fecharModal(true);Cidade.mural()">Ler o mural de recados<br><span class="pd">Cortiça, percevejo e papel em três camadas.</span></button>` : '';
    const cargos = (typeof Cargos !== 'undefined') ? (() => {
      const abertos = Cargos.quadro().filter(x => !x.tem && x.ok).length;
      return `<button class="escolha" onclick="UI.fecharModal(true);UI.modalCredenciais()">Balcão de credenciais<br><span class="pd">${
        abertos ? `${abertos} posto${abertos===1?'':'s'} aceitando o seu nome hoje.` : 'Formulário, carimbo e fila.'}</span></button>`;
    })() : '';
    UI.modal(`Centro Pokémon de ${L.nome}`, `
      <button class="escolha" onclick="UI.fecharModal(true);Cidade.atenderAqui()">Deixar o time com a enfermeira e dormir<br><span class="pd">${
        (d.flags.tem_licenca || (typeof Cargos !== 'undefined' && Cargos.centroGratis())) ? 'Com licença, não paga.' : 'Sem licença, ela cobra.'}</span></button>
      <button class="escolha" onclick="UI.fecharModal(true);UI.modalPC()">PC do saguão<br><span class="pd">${
        d.pc.length ? `Você tem ${d.pc.length} guardado${d.pc.length===1?'':'s'}.` : 'O cinto leva seis; o resto fica aqui.'}</span></button>
      ${cargos}
      <button class="escolha" onclick="UI.fecharModal(true);Exploracao.mapa('parede')">Olhar o mapa da parede<br><span class="pd">Kanto inteira, com o que você já conhece.</span></button>
      ${mural}`, false, 'centro');
  },

  /* Cura o time e devolve o que aconteceu. Quem chama decide a tela:
     o mapa da cidade, ou a cena do capítulo, que continua depois. */
  atender(){
    Mundo.passar(1);
    const d = Estado.dados;
    const credenciado = !!d.flags.tem_licenca
      || (typeof Cargos !== 'undefined' && Cargos.centroGratis());
    if (!credenciado){
      /* Sem licença você é cliente, não treinador: ela atende e cobra.
         O que ela não faz é atender de graça — nem te mandar embora à toa. */
      const feridos = d.time.filter(p => p.hp < p.hpMax || p.status).length;
      const preco = 300 + 250 * feridos;
      if (Estado.j.dinheiro < preco){
        return [
          {tipo:'info', texto:'A enfermeira olha o seu cinto, depois a sua cara, e pergunta o número da sua licença.'},
          {tipo:'dano', texto:`Você não tem número nenhum. Sem licença é ${preco} ₽, e você tem ${Estado.j.dinheiro}. Ela não discute: só empurra a ficha de volta pelo balcão.`}
        ];
      }
      Estado.j.dinheiro -= preco;
      d.time.forEach(curarTotal);
      Estado.curarJogador(10);
      const pac = this.retirarPacotes();
      Estado.salvar('auto');
      return [
        {tipo:'info', texto:'A enfermeira olha o seu cinto, depois a sua cara, e pergunta o número da sua licença.'},
        {tipo:'dano', texto:`Você não tem número nenhum. Ela atende do mesmo jeito — e cobra ${preco} ₽, porque sem licença você é cliente e não treinador.`},
        {tipo:'cura', texto:'O time volta inteiro. Ela não te olha na saída.'},
        {tipo:'info', texto:'Amanhece.'}, ...pac
      ];
    }
    d.time.forEach(curarTotal);
    Estado.curarJogador(10);
    const pac = this.retirarPacotes();
    Estado.salvar('auto');
    return [
      {tipo:'cura', texto:'A enfermeira leva o time pra dentro e devolve tudo certo em vinte minutos. Você dorme num quarto com seis camas e cinco desconhecidos.'},
      {tipo:'info', texto:'Amanhece.'}, ...pac
    ];
  },
  atenderAqui(){
    const av = this.atender();
    if (Estado.dados.modo === 'cena' && Historia.cenaAtual) return UI.telaCena(Historia.cenaAtual, av);
    return Exploracao.tela(av);
  },

  /* O mural de cada Centro: o que a cidade pendura na parede. */
  mural(){
    const m = MURAIS[Mundo.id()] || [];
    UI.modal(`Mural do Centro de ${Mundo.atual().nome}`,
      `<div class="mural">${m.map((x, i) => `<div class="bilhete b${i % 4}">
        <p>${UI.esc(x.t)}</p>${x.nota ? `<span>${UI.esc(x.nota)}</span>` : ''}</div>`).join('')}</div>`, false, 'centro');
  },

  /* O que o Célio mandou pela perua espera no balcão de qualquer Centro. */
  retirarPacotes(){
    const d = Estado.dados, n = d.flags.pacote_celio || 0;
    if (!n) return [];
    d.flags.pacote_celio = 0;
    Estado.darItem('Potion', 2 * n); Estado.darItem('Ração', n);
    return [{tipo:'item', texto:`No balcão, ${n === 1 ? 'um pacote' : n + ' pacotes'} no seu nome, com a letra do Célio: ${2 * n}× Potion e ${n}× Ração.`}];
  },

  relembrar(uid, recado){
    const R = RELEMBRADOR[Mundo.id()] || RELEMBRADOR.cerulean;
    const d = Estado.dados;
    const din = Estado.j.dinheiro;
    const preco = PRECO_RELEMBRAR.toLocaleString('pt-BR');
    const topo = `<p class="narrativa" style="margin:0 0 10px">${UI.esc(R.ar)}</p>
      <p class="sussurro" style="margin:0 0 12px">Cada golpe: ${preco} ₽. Você tem ${din.toLocaleString('pt-BR')} ₽.</p>
      ${recado ? `<p class="relembrar-recado">${UI.esc(recado)}</p>` : ''}`;

    /* primeiro: quem vai lembrar */
    const p = uid && d.time.find(x => x.uid === uid);
    if (!p){
      const linhas = d.time.map(x => {
        const n = golpesParaRelembrar(x).length;
        return `<button class="escolha com-item" ${n ? '' : 'disabled'}
          onclick="Cidade.relembrar('${x.uid}')">${imgSprite(x, 'icone')}${UI.esc(nomeExib(x))} · Nv ${x.nivel}
          <span class="pd">${n ? `${n} golpe${n === 1 ? '' : 's'} pra lembrar` : 'nada pra lembrar'}</span></button>`;
      }).join('');
      return UI.modal('Relembrador de Golpes', topo + (linhas || '<p class="nada">Você não tem ninguém com você.</p>'));
    }

    /* depois: qual golpe */
    const lista = golpesParaRelembrar(p);
    const linhas = lista.map(g => `<button class="aprender-op relembrar-op" ${din < PRECO_RELEMBRAR ? 'disabled' : ''}
        onclick="Cidade.relembrarGolpe('${p.uid}', '${g.nome.replace(/'/g, "\\'")}')">
        ${UI.cartaoGolpe(g.nome)}<span class="aprender-acao">${g.nv <= 1 ? 'início' : 'Nv ' + g.nv}</span></button>`).join('');
    UI.modal(`${nomeExib(p)} · Nv ${p.nivel}`, topo +
      (lista.length
        ? `<div class="aprender-lista">${linhas}</div>` +
          (din < PRECO_RELEMBRAR ? `<p class="sussurro" style="margin-top:10px">Falta dinheiro: são ${preco} ₽ por golpe.</p>` : '')
        : '<p class="nada">Não tem nada que ele tenha esquecido.</p>') +
      `<div style="margin-top:12px"><button class="btn" onclick="Cidade.relembrar()">Escolher outro</button></div>`);
  },

  relembrarGolpe(uid, nome){
    const p = Estado.dados.time.find(x => x.uid === uid);
    if (!p || Estado.j.dinheiro < PRECO_RELEMBRAR) return this.relembrar(uid);
    const pagar = () => {
      Estado.j.dinheiro -= PRECO_RELEMBRAR;
      Estado.registrar(`${nomeExib(p)} relembrou ${nome} (${PRECO_RELEMBRAR} ₽).`);
      Estado.salvar('auto');
    };
    if (p.golpes.length < 4){
      p.golpes.push({nome, pp:GOLPES[nome].pp, ppMax:GOLPES[nome].pp});
      registrarGolpeNaDex(p.dex, nome);
      pagar();
      return this.relembrar(uid, `${nomeExib(p)} lembrou de ${nome}.`);
    }
    UI.perguntarGolpe(p, nome, 'modal', (i) => {
      if (i < 0) return this.relembrar(uid, 'Deixou pra outra hora. Não cobrou nada.');
      const esqueceu = aprenderNoLugar(p, nome, i);
      pagar();
      this.relembrar(uid, `${nomeExib(p)} esqueceu ${esqueceu} e lembrou de ${nome}.`);
    });
  },

  loja(andar){
    const id = Mundo.id();
    const L = LOJAS[id];
    const catalogo = catalogoDaCidade(id);
    if (!catalogo.length)
      return UI.modal('Loja', '<p class="nada">Não tem loja aqui. Tem quem venda, mas não tem loja.</p>', false, 'mochila');

    /* Loja de vários andares: a escada rolante é uma aba. */
    let abas = '', ar = L.ar, sub = '';
    let lista = catalogo;
    if (L.andares && L.andares.length){
      const n = andar || this._andar || L.andares[0].n;
      this._andar = n;
      const A = L.andares.find(x => x.n === n) || L.andares[0];
      abas = `<div class="tut-abas loja-abas">${L.andares.map(x =>
        `<button class="tut-aba${x.n === A.n ? ' sel' : ''}" onclick="Cidade.loja(${x.n})">${x.n}º</button>`
      ).join('')}</div>`;
      sub = UI.esc(A.nome);
      ar = A.ar;
      const so = new Set(A.itens);
      lista = catalogo.filter(([nome]) => so.has(nome));
    }

    const topo = `<div class="mochila-topo">
      <span class="grana">${Estado.j.dinheiro} ₽</span>
      <span class="peso">${UI.esc(L.nome)}${sub ? ' · ' + sub : ''}</span>
    </div>
    ${abas}
    <p class="sussurro" style="margin:0 0 12px">${UI.esc(ar)}</p>`;

    const linhas = lista.map(([n,p]) => {
      const caro = Estado.j.dinheiro < p;
      /* Bola mostra só o número: a prosa em cima dela saiu a pedido. */
      const desc = (ITENS_INFO[n] || {}).tipo === 'bola' ? fichaItem(n) : descricaoItem(n);
      const tenho = Estado.contaItem(n);
      return `<button class="item-linha compravel${caro ? ' caro' : ''}" ${caro ? 'disabled' : ''}
        onclick="Cidade.comprar('${n.replace(/'/g,"\\'")}',${p})">
        ${imgItem(n)}
        <span class="qtd">${p}</span>
        <span class="corpo">
          <span class="nome">${UI.esc(n)}${tenho ? ` <span class="fraco">(você tem ${tenho})</span>` : ''}</span>
          ${desc ? `<span class="desc">${UI.esc(desc)}</span>` : ''}
        </span>
      </button>`;
    }).join('');

    UI.modal('', topo + linhas, false, 'mochila');
  },
  /* ------------------------------------------------------------
     DOAÇÃO — o único lugar em que dinheiro vira outra coisa.
     Cada causa é uma ponta solta que a história já deixou: a lona
     no telhado do museu de Pewter, o abrigo de Lavender, e a linha
     do caderno do Célio que ninguém foi buscar.
     ------------------------------------------------------------ */
  causas(){
    const d = Estado.dados;
    const id = Mundo.id();
    return [
      {id:'museu', cidade:'pewter', valor:12000,
       nome:'O telhado do museu de Pewter',
       linha:'Lona de 1994, relatório numa gaveta, e uma pessoa passando pano sozinha há onze anos.',
       requer:d=>!!d.flags.sabe_da_lona_do_museu || !!d.visitados.pewter,
       rep:3, marca:'pagou_o_telhado',
       texto:[
         'Você entrega o dinheiro no balcão do museu e a moça atrás do balcão não entende a primeira vez que você fala.',
         fala('Dra. Cordell', 'Doação pra quê?'),
         d=>fala(d.jogador.nome, 'Pro telhado.'),
         'Ela olha o valor escrito no recibo e senta, que é uma coisa que ela faz sem perceber.',
         fala('Dra. Cordell', 'Eu escrevi vinte e duas cartas.'),
         d=>fala(d.jogador.nome, 'Vinte e duas?'),
         fala('Dra. Cordell', 'Vinte e duas. E a coisa se resolve porque {um moleque|uma moleca} de quinze anos passou aqui e tinha dinheiro no bolso.', 'baixo'),
         fala('Dra. Cordell', 'Não é crítica a você. É que eu vou ter que pensar nisso por uns dois anos.'),
         'A lona sai numa quinta-feira do mês seguinte. Você não vai estar lá pra ver.'
       ]},
      {id:'abrigo', cidade:'lavender', valor:6000,
       nome:'O abrigo de Lavender',
       linha:'Bola lacrada de 1989 numa prateleira, e quarenta e uma na frente dela.',
       requer:d=>!!d.visitados.lavender,
       rep:2, marca:'pagou_o_abrigo',
       texto:[
         'Não tem placa, não tem recibo e não tem ninguém pra agradecer: você deixa o envelope com quem abre a porta.',
         fala('Curador Fabre', 'Você sabe que isso não devolve ninguém, né.'),
         d=>fala(d.jogador.nome, 'Sei.'),
         fala('Curador Fabre', 'Tá bom. Só queria ter certeza de que você sabia.', 'baixo'),
         'Ele guarda o envelope no bolso de dentro do casaco, sem contar, e volta pro que estava fazendo.'
       ]},
      {id:'bolsa', cidade:'*', valor:8000,
       nome:'Uma linha do caderno',
       linha:'Pagar o pedido de quem não pôde pagar. Você não escolhe quem, e nunca fica sabendo.',
       requer:d=>!!d.flags.sabe_do_nr || !!d.flags.numero_do_goro,
       rep:3, marca:'pagou_uma_bola',
       texto:[
         'Você liga pro laboratório e leva três minutos pra explicar o que quer fazer, porque não existe um nome pra isso.',
         fala('Célio', 'Você quer pagar o pedido de quem?'),
         d=>fala(d.jogador.nome, 'De quem não puder pagar. Qualquer um.'),
         'Do outro lado tem um silêncio longo e um barulho de caneta batendo em caderno.',
         fala('Célio', 'Eu tenho onze cidades e eu tenho uma lista de gente que cancelou e não falou por quê.'),
         fala('Célio', 'Eu sei exatamente quem eu vou ligar primeiro.', 'baixo'),
         fala('Célio', 'E não, eu não vou te dizer o nome. Você não vai ficar sabendo, e é melhor assim.')
       ]}
    ].filter(c => (c.cidade === '*' || c.cidade === id) && !Estado.dados.flags[c.marca]
                  && (!c.requer || c.requer(d)));
  },

  doar(){
    const causas = this.causas();
    if (!causas.length)
      return UI.modal('Doação', '<p class="nada">Nada aqui precisa do seu dinheiro hoje.</p>', false, 'credencial');
    const linhas = causas.map(c => {
      const caro = Estado.j.dinheiro < c.valor;
      return `<div class="cargo ${caro ? 'fechado' : 'aberto'}">
        <div class="cargo-topo"><span class="cargo-nome">${UI.esc(c.nome)}</span>
          <span class="cargo-peso mono">${c.valor} ₽</span></div>
        <div class="cargo-resumo">${UI.esc(c.linha)}</div>
        ${caro ? `<div class="cargo-motivo">Você tem ${Number(Estado.j.dinheiro).toLocaleString('pt-BR')} ₽.</div>`
               : `<button class="btn destaque" onclick="Cidade.doarPara('${c.id}')">Pagar</button>`}
      </div>`;
    }).join('');
    UI.modal('Doação', linhas, false, 'credencial');
  },

  doarPara(idCausa){
    const c = this.causas().find(x => x.id === idCausa);
    if (!c || Estado.j.dinheiro < c.valor) return;
    Estado.j.dinheiro -= c.valor;
    Estado.marcar(c.marca);
    /* doação é notícia: passa por cima do teto do capítulo, e por isso
       vai em ef.rep.notorio, que é onde mudarRep procura */
    const r = Estado.mudarRep('bom', c.rep, 'Pagou do próprio bolso ' + c.nome.toLowerCase(),
                              {rep:{notorio:true}});
    Estado.registrar(`Pagou ${c.valor} ₽ por: ${c.nome}.`);
    Estado.salvar('auto');
    const avisos = [{tipo:'item', texto:`−${c.valor} ₽.`}];
    if (r && r.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
    UI.telaDoacao(c, avisos);
  },

  comprar(nome, preco){
    if (Estado.j.dinheiro < preco) return;
    Estado.j.dinheiro -= preco;
    Estado.darItem(nome, 1);
    Estado.salvar('auto');
    this.loja(this._andar);
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
