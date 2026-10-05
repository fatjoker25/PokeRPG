/* ============================================================
   CAMINHO DA IMPRENSA — o Jornal de Fuchsia
   Pra quem tem credencial de repórter na hora do desvio. Quem
   acompanha: Hazel Moss, a editora, e o Bastian Fern, fotógrafo que
   carrega três câmeras e não confia em nenhuma.
   ============================================================ */

/* ── I · A CERCA (depois do 12) ────────────────────────────── */
CAPITULOS.push(
{
num:12.04, titulo:'A Cerca', local:'Fuchsia — a redação e a reserva', ambiente:'campo', nivelArea:40,
tom:'sombrio',
ancora:{local:'fuchsia', chamada:'Na janela da redação do Jornal de Fuchsia tem um bilhete colado pra fora: "VOLTA ÀS SEIS. A PAUTA É SUA."'},
entradas:['ci1_a_pauta'],
inicio: d => 'ci1_a_pauta',
cenas:{

ci1_a_pauta:{
  texto:[
    d => { Nomes.apresentar('a editora do Jornal'); return 'A redação do Jornal de Fuchsia é uma sala com quatro mesas e uma cafeteira que é mais velha que o jornal. Hazel Moss está na mesa do fundo, de óculos na cabeça.'; },
    fala('a editora do Jornal', 'Trinta e um quilômetros de cerca. Nove mil hectares. Uma reserva que vende entrada a quinhentos e não tem um Pokémon selvagem na cidade do lado.'),
    fala('a editora do Jornal', 'Eu quero a cerca. Foto, número, gente. E eu quero que você ouça a reserva antes de escrever uma linha. Antes.'),
    'Na mesa do lado, um rapaz magro limpa a lente de uma câmera com a ponta da camiseta, sem levantar os olhos.'
  ],
  ef:{flag:'cm_imprensa_1', registrar:'A Hazel Moss te deu a pauta da cerca da Zona Safári.'},
  escolhas:[
    {texto:'Falar com o rapaz da câmera.', vai:'ci1_o_fotografo'},
    {texto:'Ir direto à assessoria da reserva.', vai:'ci1_a_assessoria'}
  ]
},

ci1_o_fotografo:{
  falante:'o fotógrafo do Jornal',
  vozes:['N','N','N'],
  texto:[
    d => { Nomes.apresentar('o fotógrafo do Jornal'); return 'Ele tem três câmeras penduradas no pescoço e uma etiqueta de máquina colada em cada uma: B. FERN.'; },
    '"Bastian. Três câmeras porque uma eles tomam, uma quebra e a terceira é a que volta."',
    '"Eu fotografo a cerca há dois anos, por conta. Ninguém publica. Ou publica a parte bonita, com o pôr do sol atrás."',
    '"Tem um portão de serviço que abre de madrugada. Eu tenho onze fotos dele, todas escuras. Me falta alguém que escreva o que tem dentro das fotos."'
  ],
  ef:{npc:{nome:'Bastian Fern', opiniao:1, memoria:'Te mostrou as onze fotos escuras do portão de serviço.'}},
  escolhas:[
    {texto:'Ir com ele ao portão de serviço de madrugada.', vai:'ci1_o_portao'},
    {texto:'Primeiro ouvir a reserva, como a Hazel mandou.', vai:'ci1_a_assessoria',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Ouviu a reserva antes de ir atrás da foto'}}}
  ]
},

ci1_a_assessoria:{
  texto:[
    'A assessoria de imprensa da reserva fica num anexo do escritório, com ar-condicionado e um folheto em três idiomas.',
    'A assessora é simpática e rápida. Ela te dá a nota oficial antes de você perguntar qualquer coisa: "A Zona Safári realiza manejo técnico conforme plano aprovado em conselho."',
    fala('a assessora da reserva', 'Se quiser, eu marco uma visita guiada pro seu fotógrafo. Às dez da manhã a luz é linda no lago.'),
    fala('a assessora da reserva', 'O portão de serviço? Ah, é só pra caminhão de ração. Não tem nada pra fotografar ali.')
  ],
  ef:{flag:'cm_imprensa_ouviu_reserva', itens:{'Nota oficial da reserva':1},
      registrar:'A assessoria da reserva disse que o portão de serviço é só pra caminhão de ração.'},
  escolhas:[
    {texto:'Aceitar a visita guiada e anotar o que não mostram.', vai:'ci1_a_visita'},
    {texto:'Ir ao portão de serviço de madrugada.', vai:'ci1_o_portao'}
  ]
},

ci1_a_visita:{
  texto:[
    'A visita guiada mostra o lago, a trilha de madeira, dois Exeggcute num galho e um Chansey que vem comer na mão.',
    'Ela não mostra o setor 7, que tem placa de "área de recuperação" e um caminho de cascalho com marca de pneu.',
    'Na volta, o guia — um senhor de colete verde que não fala o caminho todo — deixa cair um papel dobrado perto do seu pé, sem olhar.',
    '**"Ração não sai às três da manhã."**'
  ],
  ef:{flag:'cm_imprensa_bilhete_do_guia', itens:{'Bilhete do guia':1},
      registrar:'Um guia da reserva deixou cair perto de você um bilhete: "Ração não sai às três da manhã."'},
  escolhas:[
    {texto:'Ir ao portão de serviço de madrugada.', vai:'ci1_o_portao'}
  ]
},

ci1_o_portao:{
  texto:[
    'Três da manhã, no mato em frente ao portão de serviço. Bastian com a câmera do meio, a que ele diz que é a que volta.',
    'O portão abre. Sai um baú sem logotipo, devagar, de farol baixo. Por trás do baú, atravessando a estrada, um homem de colete preto com uma lanterna.',
    'A lanterna para em cima de vocês.',
    fala('Vigia do portão', 'Filme. Agora. Ou eu tiro.')
  ],
  escolhas:[
    {texto:'Entregar a câmera de cima, que estava vazia.', vai:'ci1_entregou_a_vazia',
     ef:{flag:'cm_imprensa_enganou', rep:{eixo:'bom', delta:1, motivo:'Salvou as fotos do portão entregando a câmera vazia'}}},
    {texto:'Dizer que é imprensa e que não entrega nada.', vai:'ci1_luta',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Não entregou o filme ao vigia da reserva'}}}
  ]
},

ci1_luta:{
  texto:['Ele não discute. Solta o Pokémon dele no meio da estrada, entre vocês e o portão.'],
  batalha:{dex:59, nivel:d => nivelDoCaminho(d, -2), tipo:'treinador', treinador:'Vigia do portão', fuga:true,
           timeExtra:[{dex:20, nivel:d => nivelDoCaminho(d, -2)}],
           vitoria:'ci1_as_fotos', derrota:'ci1_tomou_o_filme', gameover:'gameover'}
},

ci1_entregou_a_vazia:{
  texto:[
    'O vigia abre a câmera, puxa o filme virgem pra fora na luz da lanterna e devolve a câmera aberta, satisfeito.',
    'Bastian não respira até o vigia virar as costas.',
    fala('o fotógrafo do Jornal', 'A de cima é a que eles tomam. Eu te disse.', 'baixo')
  ],
  escolhas:[
    {texto:'Revelar as fotos.', vai:'ci1_as_fotos'}
  ]
},

ci1_tomou_o_filme:{
  texto:[
    'O vigia tira as três câmeras do pescoço do Bastian, uma por uma, e abre as três na estrada.',
    fala('o fotógrafo do Jornal', 'Três. Ele levou as três.', 'baixo'),
    'Sobra o que você viu: o baú, a hora, o farol baixo. Escrito no seu caderno, que ele não pensou em pedir.'
  ],
  ef:{flag:'cm_imprensa_sem_foto', hp:-2, causa:'O portão de serviço da Zona Safári'},
  escolhas:[
    {texto:'Escrever assim mesmo.', vai:'ci1_a_materia'}
  ]
},

ci1_as_fotos:{
  texto:[
    'O laboratório de revelação do Jornal é um banheiro com luz vermelha.',
    'Na foto doze, a melhor que o Bastian já tirou em dois anos, dá pra ler a placa do baú e a cara do motorista. E dá pra ver, pelo vão da lona de trás, uma grade de gaiola com uma pata de Rhyhorn encostada.',
    fala('o fotógrafo do Jornal', 'Doze. Dois anos e a doze é a que presta.', 'baixo')
  ],
  ef:{flag:'cm_imprensa_foto_doze', itens:{'Foto doze do portão':1},
      rep:{eixo:'bom', delta:1, motivo:'Fotografou o baú do portão de serviço da Zona Safári'},
      npc:{nome:'Bastian Fern', opiniao:3, memoria:'A foto doze, depois de dois anos de fotos escuras.'}},
  escolhas:[
    {texto:'Escrever a matéria.', vai:'ci1_a_materia'}
  ]
},

ci1_a_materia:{
  texto:[
    'Trezentas palavras pra trinta e um quilômetros de cerca.',
    d => d.flags.cm_imprensa_ouviu_reserva ? 'Na matéria cabe a nota oficial, entre aspas, com o nome da assessora.' : 'Você não ouviu a reserva. A Hazel vai perguntar por quê.',
    fala('a editora do Jornal', 'Lê em voz alta pra mim. Se não aguentar ler em voz alta, não aguenta ser publicado.')
  ],
  escolhas:[
    {texto:'Publicar com a foto, com a nota da reserva e com o bilhete do guia sem o nome dele.', vai:'ci1_fim', cond:d => !!d.flags.cm_imprensa_ouviu_reserva,
     ef:{flag:'cm_imprensa_publicou_a_cerca', rep:{eixo:'bom', delta:2, motivo:'Publicou a matéria da cerca ouvindo os dois lados'}}},
    {texto:'Publicar com o que você tem.', vai:'ci1_fim', cond:d => !d.flags.cm_imprensa_ouviu_reserva,
     ef:{flag:'cm_imprensa_publicou_a_cerca', rep:{eixo:'bom', delta:1, motivo:'Publicou a matéria da cerca'}}},
    {texto:'Vender a foto doze pro jornal de Celadon, que paga cinco vezes mais e publica com manchete.', vai:'ci1_fim', cond:d => !!d.flags.cm_imprensa_foto_doze,
     ef:{flag:'cm_imprensa_vendeu_a_doze', dinheiro:2500, rep:{eixo:'ruim', delta:2, motivo:'Vendeu a foto do Jornal pra outro jornal'},
         npc:{nome:'Bastian Fern', opiniao:-4, memoria:'Você vendeu a foto doze pra Celadon.'}}}
  ]
},

ci1_fim:{
  texto:[
    d => d.flags.cm_imprensa_vendeu_a_doze
      ? 'O jornal de Celadon publica a foto doze na capa, com uma manchete em que a palavra MASSACRE aparece duas vezes. Ninguém em Fuchsia compra.'
      : 'O Jornal de Fuchsia sai na quinta, com a cerca na página três. Vende trezentos exemplares a mais que o normal. A Hazel finge que não contou.',
    d => d.flags.cm_imprensa_publicou_a_cerca ? fala('a editora do Jornal', 'Seco. Bom. Agora ninguém pode dizer que não sabia.') : '',
    'Na saída sul de Fuchsia, às três da manhã, o portão de serviço abre como sempre. Agora tem alguém olhando.'
  ],
  fim:true, resumo:'A cerca: trinta e um quilômetros, uma nota oficial e a foto doze.'
}

}
},

/* ── II · A FONTE (depois do 19) ───────────────────────────── */
{
num:19.04, titulo:'A Fonte', local:'Saffron — uma lavanderia de bairro', ambiente:'cidade', nivelArea:56,
tom:'muito sombrio',
ancora:{local:'saffron', chamada:'Numa lavanderia de bairro de Saffron, a máquina 6 tem um papel colado: QUEBRADA. Ela não está quebrada.'},
entradas:['ci2_a_ligacao'],
inicio: d => 'ci2_a_ligacao',
cenas:{

ci2_a_ligacao:{
  texto:[
    'O telefone da redação toca às onze da noite e quem atende é a Hazel, que te passa o fone sem dizer quem é.',
    fala('a voz da lavanderia', 'Eu trabalho na Estação 4. Eu vi a matéria. Eu tenho o que vocês não têm.', 'baixo'),
    fala('a voz da lavanderia', 'Amanhã, sete da noite, lavanderia da rua Doze, em Saffron. Máquina seis. Venha sozinh{o|a}.', 'baixo'),
    fala('a editora do Jornal', 'Fonte que pede pra você ir sozinh{o|a} ou tem muito medo ou tem muito plano. Leva o Bastian, de longe.')
  ],
  ef:{flag:'cm_imprensa_2', registrar:'Alguém da Estação 4 marcou encontro numa lavanderia de Saffron.'},
  escolhas:[
    {texto:'Ir sozinh{o|a}, como a fonte pediu.', vai:'ci2_a_lavanderia',
     ef:{flag:'cm_imprensa_foi_so', rep:{eixo:'bom', delta:1, motivo:'Respeitou o pedido da fonte de ir sozinh{o|a}'}}},
    {texto:'Ir com o Bastian de longe, como a Hazel mandou.', vai:'ci2_a_lavanderia',
     ef:{flag:'cm_imprensa_bastian_de_longe'}}
  ]
},

ci2_a_lavanderia:{
  texto:[
    'A lavanderia da rua Doze tem doze máquinas, cheiro de sabão de coco e uma televisão ligada sem som.',
    'Na máquina seis, sentada no banco de plástico com uma sacola de roupa no colo, uma mulher de uns trinta anos com um crachá virado do avesso no peito.',
    fala('a voz da lavanderia', 'Eu sou do berçário. Eu não vou te dar o meu nome, e você não vai perguntar.', 'baixo'),
    'Ela tira de dentro da sacola de roupa, entre duas camisetas, um envelope pardo.'
  ],
  escolhas:[
    {texto:'Abrir o envelope ali.', vai:'ci2_o_envelope'},
    {texto:'Perguntar por que agora.', vai:'ci2_por_que_agora'}
  ]
},

ci2_por_que_agora:{
  falante:'a voz da lavanderia',
  vozes:['N','N'],
  texto:[
    '"Porque na semana passada eu assinei a destinação de uma ninhada inteira. Eu assino desde que entrei. Na semana passada eu li o que eu assinei."',
    '"Eu tenho uma filha de seis anos. Ela pediu um Pokémon de aniversário. E eu falei que ia pensar."'
  ],
  escolhas:[
    {texto:'Abrir o envelope.', vai:'ci2_o_envelope'}
  ]
},

ci2_o_envelope:{
  texto:[
    'Dentro, cópia de trinta folhas de destinação, cada uma com o número da baia, o lote, a palavra "inviável" e uma assinatura.',
    'Metade das assinaturas é dela. O nome dela está ali, trinta vezes, de caneta azul.',
    fala('a voz da lavanderia', 'Se você publicar isso, publica o meu nome junto. Não tem como apagar sem apagar a prova.', 'baixo'),
    'Na televisão sem som, passa propaganda de ração. Pela vitrine da lavanderia, um carro cinza estaciona do outro lado da rua e não desliga o motor.'
  ],
  ef:{flag:'cm_imprensa_tem_as_trinta', itens:{'Trinta folhas de destinação':1},
      registrar:'Uma funcionária do berçário da Estação 4 te deu trinta folhas de destinação com o próprio nome nelas.'},
  escolhas:[
    {texto:'Sair com ela pelos fundos da lavanderia.', vai:'ci2_os_fundos',
     ef:{rep:{eixo:'bom', delta:2, motivo:'Tirou a fonte da lavanderia pelos fundos'}}},
    {texto:'Sair pela frente e encarar o carro cinza, pra ela ganhar tempo.', vai:'ci2_o_carro',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Foi encarar o carro cinza pra fonte ganhar tempo'}}}
  ]
},

ci2_os_fundos:{
  texto:[
    'Os fundos da lavanderia dão num corredor de varal, e o corredor de varal dá numa rua de padaria.',
    d => d.flags.cm_imprensa_bastian_de_longe ? 'O Bastian está na esquina da padaria, com a câmera do meio, e fotografa o carro cinza de trás pra frente quando ele dá a volta no quarteirão.' : 'Ninguém fotografa o carro cinza dando a volta no quarteirão. Você vê, e lembra da placa até a metade.',
    'A mulher do berçário pega um ônibus qualquer e vai embora sem olhar pra trás.',
    'O carro cinza para do seu lado no sinal fechado. O vidro desce.'
  ],
  escolhas:[
    {texto:'Encarar.', vai:'ci2_o_carro'}
  ]
},

ci2_o_carro:{
  falante:'o homem do carro cinza',
  vozes:['N','N'],
  texto:[
    'O homem do carro cinza é educado, tem um terno barato e um Pokémon de cada lado no banco de trás.',
    '"O envelope é propriedade de pesquisa licenciada. Eu não quero briga. Eu quero o envelope."'
  ],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 0), tipo:'treinador', treinador:'o homem do carro cinza', fuga:true,
           vitoria:'ci2_ficou', derrota:'ci2_levou', gameover:'gameover'}
},

ci2_ficou:{
  texto:[
    'As unidades dele caem na calçada e ficam esperando ordem. Ele recolhe, sobe o vidro e vai embora devagar.',
    'O envelope está no seu bolso de dentro, colado no corpo, úmido de suor.',
    d => d.flags.cm_imprensa_bastian_de_longe ? fala('o fotógrafo do Jornal', 'Peguei a placa inteira. E a cara dele. Era a câmera do meio.', 'baixo') : ''
  ],
  ef:{flag:'cm_imprensa_salvou_o_envelope', rep:{eixo:'bom', delta:1, motivo:'Não entregou o envelope da fonte'}},
  escolhas:[
    {texto:'Levar pra Hazel.', vai:'ci2_a_hazel'}
  ]
},

ci2_levou:{
  texto:[
    'Ele leva o envelope. Não leva o que você leu, e você leu as trinta folhas na lavanderia enquanto a televisão passava propaganda de ração.',
    'Você lembra de onze números de baia, de cor. É pouco, e é o que tem.'
  ],
  ef:{flag:'cm_imprensa_perdeu_o_envelope', hp:-2, causa:'A rua da lavanderia'},
  escolhas:[
    {texto:'Levar o que você lembra pra Hazel.', vai:'ci2_a_hazel'}
  ]
},

ci2_a_hazel:{
  texto:[
    fala('a editora do Jornal', 'Trinta folhas com o nome dela. Se a gente publica, a gente prova. E queima ela.'),
    fala('a editora do Jornal', 'Se a gente tira o nome, a Comissão diz que é montagem. Se a gente espera, a gente espera o quê?'),
    'Ela tira os óculos da cabeça, pela primeira vez, e põe na mesa.',
    fala('a editora do Jornal', 'A matéria é sua. A decisão também. Eu assino embaixo do que você decidir.', 'baixo')
  ],
  escolhas:[
    {texto:'Tarjar o nome dela em todas as folhas e publicar as folhas inteiras.', vai:'ci2_fim',
     ef:{flag:'cm_imprensa_tarjou', rep:{eixo:'bom', delta:2, motivo:'Protegeu a fonte tarjando o nome dela nas trinta folhas'}}},
    {texto:'Publicar com o nome, porque prova é prova.', vai:'ci2_fim',
     ef:{flag:'cm_imprensa_publicou_o_nome', rep:{eixo:'ruim', delta:2, motivo:'Publicou o nome da fonte'}}},
    {texto:'Segurar a matéria até achar uma segunda fonte.', vai:'ci2_fim',
     ef:{flag:'cm_imprensa_segurou', rep:{eixo:'bom', delta:1, motivo:'Segurou a matéria até ter uma segunda fonte'}}}
  ]
},

ci2_fim:{
  texto:[
    d => {
      if (d.flags.cm_imprensa_tarjou) return 'A matéria sai na sexta com trinta folhas e trinta tarjas pretas, uma em cada assinatura. A Comissão diz em nota que é montagem. Ninguém acredita na nota.';
      if (d.flags.cm_imprensa_publicou_o_nome) return 'A matéria sai na sexta com trinta folhas e trinta assinaturas. Na segunda, a mulher do berçário é demitida por justa causa. Na terça, ela muda de cidade com a filha.';
      return 'A matéria fica na gaveta da Hazel, numa pasta com o nome da rua Doze.';
    },
    'Em Saffron, a máquina seis da lavanderia da rua Doze volta a funcionar. O papel de QUEBRADA fica colado mais uma semana.'
  ],
  fim:true, resumo:'A fonte: uma lavanderia, trinta folhas de destinação e um nome escrito trinta vezes de caneta azul.'
}

}
},

/* ── III · EDIÇÃO EXTRA (depois do 25) ──────────────────────── */
{
num:25.04, titulo:'Edição Extra', local:'Fuchsia — a gráfica do Jornal', ambiente:'cidade', nivelArea:58,
tom:'muito sombrio',
ancora:{local:'fuchsia', chamada:'A gráfica do Jornal de Fuchsia está com a luz acesa às quatro da tarde, e ela só roda de madrugada.'},
entradas:['ci3_a_grafica'],
inicio: d => 'ci3_a_grafica',
cenas:{

ci3_a_grafica:{
  texto:[
    'A gráfica do Jornal fica no fundo da redação, atrás de uma porta de correr, e tem uma rotativa de quarenta anos que a Hazel chama pelo nome de um tio.',
    fala('a editora do Jornal', 'Depois da audiência de segunda, eu tenho tudo: a cerca, as folhas, a planilha, a sala 704. Edição extra, oito páginas, só isso.'),
    fala('a editora do Jornal', 'E tenho isto.', 'baixo'),
    'Ela mostra uma notificação de cartório: se a edição extra circular, a Comissão processa o Jornal por difamação, num valor que é três vezes o que o Jornal vale.'
  ],
  ef:{flag:'cm_imprensa_3', registrar:'A Hazel montou a edição extra sobre a Comissão. Se circular, o Jornal é processado.'},
  escolhas:[
    {texto:'Revisar as oito páginas, linha por linha, pra não ter erro nenhum.', vai:'ci3_a_revisao'},
    {texto:'Procurar a fonte do berçário pra ver se ela aguenta.', vai:'ci3_a_fonte',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Foi perguntar à fonte antes de rodar a edição extra'}}}
  ]
},

ci3_a_fonte:{
  texto:[
    d => d.flags.cm_imprensa_publicou_o_nome ? 'Ela mora em outra cidade agora, numa casa com quintal. A filha atende a porta com um Pidgey no ombro.' : 'Ela ainda trabalha no berçário. Ela atende o telefone na lavanderia, na máquina seis.',
    d => d.flags.cm_imprensa_publicou_o_nome ? fala('a voz da lavanderia', 'Vocês já me queimaram. Rodem. Pelo menos que tenha valido.', 'frio') : fala('a voz da lavanderia', 'Roda. Eu aguento. Eu aguento mais do que aguentava assinar.', 'baixo')
  ],
  ef:{flag:'cm_imprensa_fonte_concordou'},
  escolhas:[
    {texto:'Revisar as oito páginas.', vai:'ci3_a_revisao'}
  ]
},

ci3_a_revisao:{
  texto:['Oito páginas, cada nome, cada número, cada data, conferido com o documento de onde saiu.'],
  teste:{status:'intelecto', dificuldade:7, nomeStatus:'Intelecto',
         critico:'ci3_limpa', sucesso:'ci3_limpa', parcial:'ci3_com_erro', falha:'ci3_com_erro'}
},

ci3_limpa:{
  texto:[
    'Às onze da noite, as oito páginas estão limpas. Nenhum número sem documento, nenhum nome sem prova.',
    fala('a editora do Jornal', 'Limpa. Eu nunca vi uma edição limpa em vinte anos.', 'baixo')
  ],
  ef:{flag:'cm_imprensa_limpa', rep:{eixo:'bom', delta:2, motivo:'Revisou a edição extra até não ter erro nenhum'}},
  escolhas:[
    {texto:'Rodar.', vai:'ci3_a_noite'}
  ]
},

ci3_com_erro:{
  texto:[
    'Às onze da noite, você acha um erro: uma data da planilha trocada por outra. Pequeno. Corrigível.',
    'Você não sabe se tem outro.',
    fala('a editora do Jornal', 'Sempre tem outro. O que importa é se é o que eles vão achar.', 'baixo')
  ],
  ef:{flag:'cm_imprensa_com_erro'},
  escolhas:[
    {texto:'Rodar.', vai:'ci3_a_noite'}
  ]
},

ci3_a_noite:{
  texto:[
    'À meia-noite, a rotativa liga com um barulho de trem. Às duas da manhã, alguém bate na porta da gráfica.',
    'Dois homens de colete preto, com um oficial de justiça de pijama no meio, que não queria estar ali.',
    fala('o oficial de justiça', 'Liminar. Suspende a circulação.', 'baixo'),
    'Atrás dele, os dois homens de colete já estão com as Pokébolas na mão, olhando pra pilha de jornal.'
  ],
  escolhas:[
    {texto:'Ler a liminar inteira antes de qualquer coisa.', vai:'ci3_a_liminar',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Leu a liminar inteira antes de reagir'}}},
    {texto:'Ficar na frente da pilha.', vai:'ci3_a_pilha'}
  ]
},

ci3_a_liminar:{
  texto:[
    'A liminar suspende a circulação no município de Fuchsia. No município.',
    fala('a editora do Jornal', 'Fuchsia.', 'baixo'),
    fala('a editora do Jornal', 'O Bastian tem uma caminhonete e um primo em Celadon com uma banca de jornal.', 'baixo')
  ],
  ef:{flag:'cm_imprensa_leu_a_liminar'},
  escolhas:[
    {texto:'Ficar na frente da pilha enquanto o Bastian carrega a caminhonete pelos fundos.', vai:'ci3_a_pilha'}
  ]
},

ci3_a_pilha:{
  texto:['Os dois homens de colete passam pelo oficial de justiça sem pedir licença. O oficial dá um passo pro lado e olha pro teto.'],
  batalha:{comissao:'seguranca', nivel:d => nivelDoCaminho(d, 3), tipo:'treinador', treinador:'Segurança da Estação 4', fuga:false,
           timeExtra:[{dex:97, nivel:d => nivelDoCaminho(d, 3)}],
           vitoria:'ci3_a_banca', derrota:'ci3_recolheram', gameover:'gameover'}
},

ci3_recolheram:{
  texto:[
    'Eles recolhem a pilha de cima. A de baixo, a que já estava na caminhonete, não.',
    d => d.flags.cm_imprensa_leu_a_liminar ? 'A caminhonete do Bastian sai pelos fundos com quatro mil exemplares e a luz apagada.' : 'A caminhonete do Bastian sai pelos fundos com o que deu pra carregar.'
  ],
  ef:{flag:'cm_imprensa_metade', hp:-2, causa:'A gráfica do Jornal de Fuchsia'},
  escolhas:[
    {texto:'Ir atrás da caminhonete.', vai:'ci3_a_banca'}
  ]
},

ci3_a_banca:{
  texto:[
    'De manhã, numa banca de jornal na esquina da estação de Celadon, a edição extra está pendurada no varal da frente, com prendedor de roupa.',
    'Às oito, já não tem mais nenhuma.',
    fala('a editora do Jornal', 'Agora vem o processo. Agora vem a parte que ninguém fotografa.', 'baixo')
  ],
  ef:{flag:'cm_imprensa_circulou', rep:{eixo:'bom', delta:2, motivo:'Fez a edição extra circular apesar da liminar'}},
  escolhas:[
    {texto:'Enfrentar o processo com a Hazel, no tribunal, com as oito páginas.', vai:'ci3_o_processo'},
    {texto:'Retirar a matéria em troca de a Comissão retirar o processo. O Jornal sobrevive.', vai:'ci3_final_nao_saiu',
     ef:{rep:{eixo:'ruim', delta:2, motivo:'Trocou a matéria pela sobrevivência do Jornal'}}},
    {texto:'Deixar o processo com o advogado do Jornal e seguir pro Planalto.', vai:'ci3_seguir',
     ef:{rep:{eixo:'bom', delta:1, motivo:'Deixou a edição extra correr e seguiu viagem'}}}
  ]
},

ci3_o_processo:{
  texto:[
    'O processo dura oito meses. O advogado da Comissão é o Dr. Bramble, de terno cinza claro, que cumprimenta você todo dia no corredor.',
    'O juiz lê as oito páginas, e depois lê de novo, procurando o erro.'
  ],
  escolhas:[
    {texto:'Esperar a sentença.', vai:'ci3_a_sentenca'}
  ]
},

ci3_a_sentenca:{
  texto:[
    d => d.flags.cm_imprensa_limpa ? 'Ele não acha. Não tem erro pra achar.' : 'Ele acha uma data trocada. Pequena. É o bastante pra eles.'
  ],
  escolhas:[
    {texto:'Ouvir a sentença.', vai:'ci3_final_primeira', cond:d => !!d.flags.cm_imprensa_limpa,
     ef:{rep:{eixo:'bom', delta:3, motivo:'Ganhou o processo da edição extra'}}},
    {texto:'Ouvir a sentença.', vai:'ci3_final_processada', cond:d => !d.flags.cm_imprensa_limpa,
     ef:{rep:{eixo:'bom', delta:2, motivo:'Perdeu o processo da edição extra por uma data, sem desmentir nada'}}}
  ]
},

ci3_seguir:{
  texto:[
    fala('a editora do Jornal', 'Vai. Processo de jornal se ganha sentado. Eu sento.', 'riso'),
    'O ônibus da Liga pro Planalto sai às oito e quinze. Alguém no banco da frente está lendo a edição extra.'
  ],
  ef:{flag:'cm_imprensa_seguiu_planalto'},
  fim:true, resumo:'A edição extra: oito páginas, uma liminar de município e uma banca de jornal em Celadon.'
},

ci3_final_primeira:{
  texto:[
    'Improcedente. O juiz escreve que "a matéria descreve, com documentação idônea, fato de interesse público".',
    'A Hazel ri tanto no corredor que o Dr. Bramble para de cumprimentar.'
  ],
  final:{id:'imprensa_primeira', titulo:'PRIMEIRA PÁGINA', texto:[
    'A sentença sai na primeira página do Jornal de Fuchsia, com foto da rotativa do tio.',
    'A Comissão não fecha por causa de uma matéria. Ela fecha por causa de cem pequenas coisas que vêm depois, e todas citam a matéria.',
    'Você continua no Jornal. Escreve sobre feira de Pokémon, sobre buraco de rua, sobre a cerca da reserva todo ano no mesmo mês.',
    'O Bastian ganha um prêmio pela foto doze. Ele vai buscar com as três câmeras no pescoço, e no discurso agradece a câmera do meio.'
  ]}
},

ci3_final_processada:{
  texto:[
    'Procedente em parte. Uma data errada, uma indenização que o Jornal não tem como pagar.',
    'O Jornal de Fuchsia fecha em março. A rotativa vai pra um ferro-velho de Vermilion.'
  ],
  final:{id:'imprensa_processada', titulo:'PROCESSADA', texto:[
    'O Jornal fechou. O que ele publicou, não.',
    'A edição extra circula por anos, em fotocópia, de mão em mão, em sala de aula de técnico de reserva e em balcão de Centro Pokémon.',
    'Você e a Hazel abrem uma folha semanal de quatro páginas, impressa numa copiadora de papelaria, que vocês chamam de Jornal de Fuchsia mesmo, porque ninguém registrou o nome.',
    'Ela custa uma moeda. Vende trezentos exemplares toda quinta. A Hazel diz que é o melhor jornal que ela já editou, e diz isso de óculos na cabeça.'
  ]}
},

ci3_final_nao_saiu:{
  texto:[
    'A Comissão aceita. O acordo tem duas folhas e uma cláusula de silêncio.',
    'A Hazel assina sem ler, que é a única coisa que ela nunca tinha feito na vida.'
  ],
  final:{id:'imprensa_nao_saiu', titulo:'A MATÉRIA QUE NÃO SAIU', texto:[
    'O Jornal de Fuchsia continua. Publica feira, buraco de rua e o resultado da Liga.',
    'As quatro mil que circularam em Celadon viram lenda: todo mundo conhece alguém que leu, ninguém tem uma.',
    'A fonte do berçário, numa lavanderia de Saffron, lê no jornal de domingo que a Comissão ganhou mais uma licença. Ela não liga pra redação.',
    'Na gaveta da Hazel tem uma pasta com o nome da rua Doze. Ela nunca joga fora. Você também não pede.'
  ]}
}

}
}
);
