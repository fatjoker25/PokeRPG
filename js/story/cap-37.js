/* ============================================================
   ILHAS SEVII · V — O ARMAZÉM (capítulo 37, pós-jogo)
   Ilha Cinco, quinta-feira, duas da manhã. O armazém velho da conserva,
   na campina, onde o barco sem luz encosta. O "P." do papel do farol é
   o Penrose, o dono da fábrica que fechou, e o cartaz do torneio diz o
   resto: ele é quem paga o troféu. O que a gangue mandou pra cá (a
   Milotic, e o que você não segurou no farol) espera nos caixotes. Quem
   vem com você é quem você ganhou nos outros capítulos. Ver sevii.js.
   ============================================================ */
/* quem está do seu lado na campina */
function _c37Lund(d){ return !!(d.flags.sv_lund_auxiliar || d.flags.sv_kaspar_preso || d.flags.sv_caderno_lund || d.flags.sv_jory_preso); }
function _c37Aliados(d){
  const l = [];
  if (_c37Lund(d)) l.push('lund');
  if (d.flags.sv_rec_turma && !d.flags.sv_kaspar_acordo) l.push('brody');
  if ((d.flags.sv_noa_ajudou || d.flags.sv_noa_guiou) && !d.flags.sv_caderno_guardado) l.push('noa');
  if (d.flags.sv_conheceu_zev && ((d.npcs['Zev'] || {}).opiniao || 0) >= 3) l.push('zev');
  return l;
}
/* o que estava no armazém e volta, além da Milotic */
function _c37Volta(d){
  if (d.flags.sv_mochila_subiu) Estado.marcar('sv_rec_etta');
  if (d.flags.sv_ovos_subiram) Estado.marcar('sv_rec_ovos');
  if (d.flags.sv_turma_subiu) Estado.marcar('sv_rec_turma');
}
/* O pedido de quem compra: o papel que liga as ilhas à Comissão da
   história principal. O nome em cima é outro; o registro e a sala são os
   de sempre. O que você reconhece sai do que você viu em Kanto (o
   cartório e as atas do 18, a Estação 4 do 19, a sala do 20), nunca do
   final que você teve. A última linha é o norte, e para ali. */
const C37_PEDIDO = [
  '**INSTITUTO DE DIVERSIDADE GENÉTICA DE KANTO · Registro 11.402**',
  '**Rua do Comércio, 118, sala 704 · Saffron**',
  '**Coleta de matriz fora da área de convênio · Remessa sul: Ilhas Sevii**',
  d => d.flags.sv_viu_a_lista_no_farol
    ? 'Embaixo, a lista inteira, batida à máquina, com uma coluna que a cópia dos Faróis não tem: LINHAGEM. Milotic, linhagem de Lilycove. Heracross e Ninjask, linhagem de Azalea. Ovos de Eevee, linhagem da Rota 34. Doze Pokémon de trabalho, linhagem de Slateport.'
    : 'Embaixo, uma lista batida à máquina, um Pokémon por linha, com uma coluna chamada LINHAGEM. Milotic, linhagem de Lilycove. Heracross e Ninjask, linhagem de Azalea. Ovos de Eevee, linhagem da Rota 34. Doze Pokémon de trabalho, linhagem de Slateport.',
  d => (d.capitulosFechados || []).includes(20)
    ? 'Sala 704. O elevador do 118, que é de 1971 e demora, e o corredor de carpete gasto no sétimo andar. Você já esteve lá.'
    : d.flags.sabe_do_endereco_704 ? 'Rua do Comércio, 118, sala 704. O endereço da ficha do cartório de Saffron.' : '',
  d => d.flags.sabe_o_nome_da_comissao
    ? 'Registro 11.402. O número da Comissão de Gestão de Risco Biológico na ficha do cartório. O nome mudou de novo. O número, não.' : '',
  d => d.flags.sabe_da_matriz ? 'Matriz. A palavra que as atas usavam sem explicar, explicada aqui numa coluna.' : '',
  d => (d.cenasAplicadas || {})['19:c19_de_onde_vem_os_ovos']
    ? '"De matriz própria e de coleta autorizada", tinha dito a técnica da Estação 4. Aqui não tem autorização: tem "fora da área de convênio".' : '',
  'Na última linha, depois da lista, duas palavras e um traço, sem nada na frente: REMESSA NORTE — ILHAS DO REDEMOINHO.'
];

CAPITULOS.push(
{
num:37, titulo:'O Armazém', local:'Ilha Cinco — o armazém da conserva', ambiente:'campo', nivelArea:64,
tom:'sombrio', posJogo:true,
ancora:{local:'ilha_cinco', chamada:'Na praça da Ilha Cinco, debaixo do relógio que adianta quatro minutos, tem um cartaz novo do torneio colado por cima dos velhos.'},
entradas:['c37_a_praca'],
inicio: d => 'c37_a_praca',
cenas:{

c37_a_praca:{
  texto:[
    'A Ilha Cinco é verde até onde o mar deixa, com uma praça redonda e um relógio de torre que marca quatro minutos a mais do que a hora que é.',
    'No quadro da praça, por cima de cartaz velho de festa e de anúncio de barco, tem um cartaz novo, de papel bom, com a arena redonda da Ilha Sete desenhada em azul.',
    'Do outro lado da campina, no fundo, um armazém de telhado de zinco com o cadeado novo numa porta velha.',
    d => d.flags.sv_viu_o_barco ? 'Os pescadores da Ilha Quatro disseram: duas da manhã. O papel do farol diz: quinta.' : 'O papel do farol diz: quinta, duas da manhã.'
  ],
  escolhas:[
    {texto:'Ler o cartaz do torneio.', vai:'c37_o_cartaz', cond:d => !Historia.jaAconteceu('c37_o_cartaz')},
    {texto:'Falar com a mulher que estende roupa no varal da praça.', vai:'c37_o_varal', cond:d => !Historia.jaAconteceu('c37_o_varal')},
    {texto:'Atravessar a campina e olhar o armazém de dia.', vai:'c37_de_dia', cond:d => !Historia.jaAconteceu('c37_de_dia')},
    {texto:'Esperar a quinta-feira à noite.', vai:'c37_a_espera'}
  ]
},
c37_a_praca_volta:{
  texto:['O relógio da torre adianta quatro minutos. A campina balança com o vento. O armazém, lá no fundo, não balança.'],
  escolhas:[
    {texto:'Ler o cartaz do torneio.', vai:'c37_o_cartaz', cond:d => !Historia.jaAconteceu('c37_o_cartaz')},
    {texto:'Falar com a mulher que estende roupa no varal da praça.', vai:'c37_o_varal', cond:d => !Historia.jaAconteceu('c37_o_varal')},
    {texto:'Atravessar a campina e olhar o armazém de dia.', vai:'c37_de_dia', cond:d => !Historia.jaAconteceu('c37_de_dia')},
    {texto:'Esperar a quinta-feira à noite.', vai:'c37_a_espera'}
  ]
},

c37_o_cartaz:{
  texto:[
    '**TORNEIO DAS ILHAS — ARENA DA ILHA SETE — CHAVE DE DEZESSEIS, COM TREINADORES DE JOHTO E DE HOENN.**',
    'E embaixo, numa faixa de letra mais fina, do tipo que ninguém lê:',
    '**PATROCÍNIO: CONSERVAS PENROSE.**',
    d => d.flags.sv_viu_a_placa || Historia.jaAconteceu('c34_o_fim') ? 'A mesma palavra da placa caída de cabeça pra baixo no portão da fábrica fechada, no cais da Ilha Um.' : 'O nome da fábrica de conserva fechada, no cais da Ilha Um.',
    'A fábrica fechou. O patrocínio, não. E no papel do farol, depois de ARMAZÉM 5, QUINTA e 2H, tinha uma letra só: P.'
  ],
  ef:{flag:'sv_sabe_do_penrose', registrar:'No cartaz do torneio, na Ilha Cinco: o patrocínio é das Conservas Penrose, a fábrica fechada da Ilha Um. P.'},
  escolhas:[
    {texto:'Voltar pro meio da praça.', vai:'c37_a_praca_volta'}
  ]
},

c37_o_varal:{
  texto:[
    'Ela estende lençol branco com prendedor de madeira, um atrás do outro, sem pressa e sem olhar pra você.',
    fala('a mulher do varal da praça', 'De noite tem barco sem luz encostando lá no armazém. Eu já disse pra Guarda. A Guarda é um homem só.', 'baixo'),
    fala('a mulher do varal da praça', 'Tem um homem que dorme lá dentro. Careca, grande, jaqueta com um dragão bordado nas costas. Trabalhava na segurança da fábrica, quando tinha fábrica. Era boxeador antes disso, diz o meu marido.'),
    fala('a mulher do varal da praça', 'E toda quinta, de madrugada, desce do barco um senhor de terno branco. Terno branco, de madrugada, na campina. Quem usa terno branco de madrugada não é pescador.')
  ],
  ef:{flag:'sv_sabe_do_dekker', registrar:'A mulher do varal da Ilha Cinco: um homem careca de jaqueta de dragão dorme no armazém, e toda quinta desce do barco sem luz um senhor de terno branco.'},
  escolhas:[
    {texto:'Agradecer e voltar pro meio da praça.', vai:'c37_a_praca_volta'}
  ]
},

c37_de_dia:{
  texto:[
    'Atravessar a campina de dia leva meia hora, com o capim batendo na cintura e a flor amarela grudando na calça.',
    'O armazém é de tijolo, com o telhado de zinco remendado e a pintura da porta descascada: CONSERVAS PENROSE — DEPÓSITO 5.',
    'Pela fresta da porta dá pra ver caixote empilhado, e em cima de um deles, presa no ferro do cadeado de dentro, uma fita lilás de concurso.',
    'Alguém ronca lá dentro, alto, num catre encostado na parede.'
  ],
  ef:{flag:'sv_viu_a_fita', registrar:'Pela fresta da porta do armazém da Ilha Cinco: caixotes, e uma fita lilás de concurso presa no cadeado de dentro.'},
  escolhas:[
    {texto:'Voltar pela campina e esperar a noite.', vai:'c37_a_praca_volta'}
  ]
},

c37_a_espera:{
  texto:[
    'Quinta-feira, onze da noite. A praça está vazia e o relógio da torre já marca onze e quatro.',
    d => {
      const a = _c37Aliados(d), l = [];
      if (a.includes('lund')) l.push('O Sargento Lund chega no último barco de pesca da noite, de farda inteira dessa vez, sem pijama nenhum, e senta no banco da praça do seu lado sem dizer nada.');
      if (a.includes('brody')) l.push('Doze capacetes laranja descem da mesma balsa, em silêncio, coisa que eles nunca fizeram na vida. O Brody aperta a sua mão com a mão inteira.');
      if (a.includes('noa')) l.push('A Noa está sentada no muro do relógio, de jaqueta fechada até o queixo, com o Murkrow dormindo no ombro.');
      if (a.includes('zev')) l.push('E encostado na torre do relógio, de cabelo preso, sem ninguém ter chamado, o Zev.');
      if (!a.length) l.push('Ninguém vem. A praça fica vazia, e o relógio continua quatro minutos na frente.');
      return l.join(' ');
    },
    d => _c37Aliados(d).includes('zev') ? fala('Zev', 'Eu sei como é a porta de um lugar desses por dentro. Eu já fui quem segura ela.', 'baixo') : ''
  ],
  ef:{executar:() => { Relogio.ateODia(3, 23); }},
  escolhas:[
    {texto:'Atravessar a campina no escuro.', vai:'c37_a_campina'}
  ]
},

c37_a_campina:{
  texto:[
    'De noite a campina canta de Pokémon miúdo escondido no capim, e para de cantar onde você pisa, e volta a cantar quando você passa.',
    'O armazém tem luz dentro, uma lâmpada só, amarela. Na porta, sentado num caixote, um homem grande e careca de jaqueta com um dragão bordado nas costas, olhando o mar.',
    d => _c37Aliados(d).includes('brody') ? 'Atrás de você, no capim, doze capacetes laranja se espalham em volta do armazém, devagar, abaixados.' : ''
  ],
  escolhas:[
    {texto:'Ir até a porta, de frente.', vai:'c37_o_dekker'},
    {texto:'Dar a volta e subir pelo telhado de zinco.', vai:'c37_o_telhado'}
  ]
},
c37_o_telhado:{
  texto:['O telhado de zinco é remendado, e cada remendo é um barulho diferente esperando acontecer.'],
  teste:{status:'percepcao', dificuldade:7, nomeStatus:'Percepção', critico:'c37_por_cima', sucesso:'c37_por_cima', parcial:'c37_o_dekker', falha:'c37_o_dekker'}
},
c37_por_cima:{
  texto:[
    'Você acha o remendo que não range, levanta a chapa solta, e desce por uma viga até cima dos caixotes, devagar.',
    'O homem da porta continua olhando o mar.'
  ],
  ef:{flag:'sv_entrou_pelo_telhado'},
  escolhas:[
    {texto:'Olhar os caixotes.', vai:'c37_dentro'}
  ]
},
c37_o_dekker:{
  texto:[
    'O homem da porta levanta do caixote sem pressa, e levantado ele é maior ainda.',
    fala('Dekker', 'Dekker. Eu seguro a porta. Faz trinta anos que eu seguro porta pra família Penrose, e nunca ninguém passou.', 'frio'),
    fala('Dekker', 'Volta pra campina. Volta, e amanhã você nem lembra.')
  ],
  batalha:{sevii:'dekker', mais:0, tipo:'treinador', fuga:false, treinador:'Dekker', vontadeIA:true,
           intro:'Dekker tira a jaqueta do dragão, dobra no caixote, e só então solta a primeira Pokébola.',
           vitoria:'c37_dekker_caiu', derrota:'c37_dekker_ganhou'}
},
c37_dekker_caiu:{
  texto:[
    'O último do Dekker cai encostado na porta, e a porta abre um palmo com o peso.',
    'Ele senta de novo no caixote, devagar, e veste a jaqueta do dragão.',
    fala('Dekker', 'Trinta anos.', null, 'Ele fala isso pro mar, não pra você.'),
    fala('Dekker', 'Entra. Eu não vou segurar porta pra quem não ganha.', 'baixo')
  ],
  ef:{flag:'sv_dekker_vencido', rep:{eixo:'bom', delta:1, motivo:'Ganhou do Dekker na porta do armazém da Ilha Cinco'},
      registrar:'Ganhou do Dekker, o homem da porta do armazém. Ele deixou entrar.'},
  escolhas:[
    {texto:'Entrar no armazém.', vai:'c37_dentro'}
  ]
},
c37_dekker_ganhou:{
  texto:[
    'O seu último cai no capim. O Dekker recolhe os dele e volta pro caixote.',
    d => _c37Aliados(d).length
      ? 'Mas na porta do armazém não sobra só você. ' + (_c37Aliados(d).includes('brody') ? 'Os doze capacetes laranja saem do capim ao mesmo tempo, e o Dekker, que já segurou porta contra muita gente, nunca segurou contra doze estivadores de Slateport. Ele levanta as mãos.' : 'Quem veio com você entra pela porta enquanto ele está de costas, e ele levanta as mãos sem brigar.')
      : 'Ele volta a olhar o mar. Depois de um tempo, sem virar, empurra a porta com o pé, e a porta abre um palmo.',
    d => _c37Aliados(d).length ? '' : fala('Dekker', 'Ganhar eu ganhei. Mas eu cansei de segurar porta.', 'baixo')
  ],
  escolhas:[
    {texto:'Entrar no armazém.', vai:'c37_dentro'}
  ]
},

c37_dentro:{
  texto:[
    'Dentro, debaixo da lâmpada amarela, os caixotes estão abertos e arrumados como prateleira de loja: Pokébola em fila, cada uma com uma etiqueta de papel amarrada no botão.',
    'Cada etiqueta tem quatro linhas batidas à máquina, espécie, lote, origem e data, e embaixo um preço a lápis, em letra de contador. Na linha da origem: LILYCOVE. ECRUTEAK. FORTREE. MAUVILLE. OLIVINE. GOLDENROD. Vinte e três etiquetas.',
    d => d.flags.achou_o_arquivo ? 'Espécie, lote, origem, data. É a etiqueta das gavetas do arquivo da Estação 4. Onde lá estava ZS-7, aqui está o nome de uma cidade de fora.' : '',
    'Na ponta da fila, sozinha, presa com uma fita lilás de concurso: a da Milotic. Do lado do preço dela alguém desenhou uma estrela.',
    d => d.flags.sv_mochila_subiu ? 'Numa prateleira de baixo, jogada de qualquer jeito, uma mochila cheia de Pokébola de Apricorn pendurada por fora.' : '',
    d => d.flags.sv_ovos_subiram ? 'Em cima de um caixote, uma caixa térmica azul desligada, com seis ovos frios dentro.' : '',
    d => d.flags.sv_turma_subiu ? 'E um caixote com carimbo do porto de Slateport e doze plaquinhas de lata com nome de homem.' : '',
    'Lá fora, pro lado do mar, um motor baixo, sem luz nenhuma, encosta no cais velho do armazém.',
    'Às duas e quatro do relógio da praça. Às duas em ponto da hora que é.'
  ],
  ef:{executar:() => { Relogio.ate(2); }},
  escolhas:[
    {texto:'Esperar quem vem do barco no meio dos caixotes.', vai:'c37_penrose'}
  ]
},

c37_penrose:{
  texto:[
    'Desce do barco um senhor magro de terno branco, cabelo grisalho penteado, com uma Pokébola na mão, segurada de um jeito que não é de quem luta.',
    'Ele entra no armazém, vê você no meio dos caixotes, e não se assusta. Ajeita o punho da camisa.',
    fala('Sr. Penrose', 'Penrose. Conrad Penrose. A fábrica era do meu pai, e o armazém também. {O senhor|A senhora} de Kanto, imagino. O torneio inteiro sabe que {o Campeão|a Campeã} de Kanto veio.'),
    d => d.flags.sv_kaspar_acordo
      ? fala('Sr. Penrose', 'O Kaspar me disse que Kanto agora tem parte. Eu não gosto de sócio novo. Mas eu gosto menos ainda de perder dinheiro.', 'frio')
      : fala('Sr. Penrose', 'E veio até aqui, de madrugada, pela campina. Isso eu respeito.'),
    fala('Sr. Penrose', 'A fábrica fechou porque a corrente mudou, e o cardume de Magikarp que a ilha vivia dele mudou junto. Ninguém tem culpa de corrente. As ilhas estão morrendo devagar, e todo ano, uma vez por ano, chega gente de Johto e de Hoenn com Pokémon que em Kanto vale uma casa.'),
    fala('Sr. Penrose', 'O torneio traz o estoque. Eu pago o troféu. Eu nunca roubei ninguém: eu compro de quem rouba, e quem rouba é criança com fome, que eu não criei.', 'frio'),
    d => _c37Lund(d) ? 'Atrás dele, na porta do armazém, aparece o Sargento Lund, de farda inteira, com o caderno no bolso da camisa.' : ''
  ],
  ef:{flag:'sv_conheceu_penrose', registrar:'No armazém da Ilha Cinco, às duas da manhã: Conrad Penrose, dono da fábrica fechada e patrocinador do torneio. "O torneio traz o estoque. Eu pago o troféu."'},
  escolhas:[
    {texto:d => d.flags.sv_viu_a_lista || d.flags.sv_viu_a_lista_no_farol ? '"A lista batida à máquina. Quem escreve?"' : '"Pra quem você vende?"',
     vai:'c37_o_pedido', cond:d => !Historia.jaAconteceu('c37_o_pedido')},
    {texto:'"Sargento. É ele."', vai:'c37_penrose_preso', cond:d => _c37Lund(d)},
    {texto:'Amarrar o Penrose num caixote e esperar a Guarda de manhã.', vai:'c37_penrose_amarrado', cond:d => !_c37Lund(d)},
    {texto:'"Quanto você paga pra eu sair daqui?"', vai:'c37_penrose_oferta'},
    {texto:'Ir pro cais do armazém e não deixar o barco sair com os caixotes.', vai:'c37_o_barco'}
  ]
},

/* quem escolhe o que a Maré pega: o pedido que chega de Kanto */
c37_o_pedido:{
  texto:[
    'O Penrose não responde de primeira. Tira do bolso de dentro do paletó uma folha de papel bom, dobrada em quatro, e abre em cima do caixote, alisando com a palma da mão.',
    fala('Sr. Penrose', 'Eu não escolho nada. Quem escolhe manda isto toda segunda, no malote do barco de Vermilion. Eu bato à máquina de novo pros Faróis, sem o cabeçalho. Ninguém nas ilhas precisa saber de onde vem.'),
    ...C37_PEDIDO,
    fala('Sr. Penrose', 'O convênio da Fiscalização vale do lado de lá do mar. Do lado de cá não tem convênio, não tem Fiscalização e não tem dono de nada. Pra eles isso não é roubo. É coleta.', 'frio'),
    fala('Sr. Penrose', 'Linhagem de Kanto eles já têm. Eles querem a que nunca viu viveiro, e quem traz isso pra cá, uma vez por ano, de barco, é o torneio.'),
    fala('Sr. Penrose', 'O sul sou eu. O norte não é comigo, e eu nunca perguntei de quem é.', null, 'Ele bate com o dedo na última linha.')
  ],
  ef:{flag:'sv_viu_o_pedido',
      registrar:'O Penrose mostrou o pedido de quem compra: Instituto de Diversidade Genética de Kanto, Registro 11.402, Rua do Comércio, 118, sala 704, Saffron. "Coleta de matriz fora da área de convênio." Remessa sul: Ilhas Sevii. Remessa norte: Ilhas do Redemoinho.'},
  escolhas:[
    {texto:'"Sargento. É ele."', vai:'c37_penrose_preso', cond:d => _c37Lund(d)},
    {texto:'Amarrar o Penrose num caixote e esperar a Guarda de manhã.', vai:'c37_penrose_amarrado', cond:d => !_c37Lund(d)},
    {texto:'"Quanto você paga pra eu sair daqui?"', vai:'c37_penrose_oferta'},
    {texto:'Ir pro cais do armazém e não deixar o barco sair com os caixotes.', vai:'c37_o_barco'}
  ]
},

c37_penrose_preso:{
  texto:[
    'O Lund entra no armazém, olha os caixotes, olha as etiquetas com preço, e tira o quepe.',
    fala('Sargento Lund', 'Conrad.', null, 'Ele fala o nome como quem fala o nome de alguém com quem jogou bola na rua.'),
    fala('Sargento Lund', 'O seu pai me deu a primeira bicicleta da Guarda. Eu pedalo nela até hoje.', 'baixo'),
    'O Penrose estende os pulsos sozinho, sem ninguém pedir, e olha pro chão.',
    d => Historia.jaAconteceu('c37_o_pedido') ? 'O Lund pega a folha do pedido de cima do caixote, lê devagar e para na linha do endereço.' : '',
    d => Historia.jaAconteceu('c37_o_pedido') ? fala('Sargento Lund', 'Saffron. Isso eu não alcanço nem de bicicleta.', 'baixo') : '',
    d => _c37Aliados(d).includes('brody') ? 'Do lado de fora, os doze estivadores de Slateport seguram o barco no cais pela corda, e o homem do motor sai com as mãos pra cima.' : 'Do lado de fora, o barco liga o motor e vai embora vazio, sem luz, pro mar aberto.'
  ],
  ef:{flag:['sv_penrose_preso', 'sv_rec_milotic'], executar:d => _c37Volta(d),
      rep:{eixo:'bom', delta:3, motivo:'Entregou à Guarda das Ilhas o Penrose, que comprava os Pokémon roubados das ilhas', notorio:true},
      npc:{nome:'Sargento Lund', opiniao:3, memoria:'Você esperou ele no armazém pra prender o Penrose.'},
      registrar:'O Sargento Lund prendeu o Penrose no armazém da Ilha Cinco. Os Pokémon dos caixotes ficaram.'},
  escolhas:[
    {texto:'Abrir os caixotes.', vai:'c37_os_caixotes'}
  ]
},
c37_penrose_amarrado:{
  texto:[
    'Ele não resiste. Senta no caixote que você aponta, e enquanto você passa a corda ele fala, calmo, como se estivesse numa reunião.',
    fala('Sr. Penrose', '{O senhor|A senhora} sabe que de manhã eu pago a fiança, e na outra semana eu compro de novo. A Guarda é um homem só.'),
    'Lá fora, o barco liga o motor e vai embora vazio, sem luz.',
    'De manhã, o Lund chega no primeiro barco de pesca. Olha o Penrose amarrado num caixote de conserva, de terno branco amassado, e tira o quepe.',
    fala('Sargento Lund', 'Fiança de quem compra Pokémon roubado de gente de fora quem decide não sou eu. É o juiz de Kanto. E o juiz de Kanto demora pra atravessar o mar.', 'frio')
  ],
  ef:{flag:['sv_penrose_preso', 'sv_rec_milotic'], executar:d => _c37Volta(d),
      rep:{eixo:'bom', delta:3, motivo:'Amarrou o Penrose no armazém da Ilha Cinco e entregou à Guarda das Ilhas', notorio:true},
      npc:{nome:'Sargento Lund', opiniao:2, memoria:'Você deixou o Penrose amarrado num caixote pra ele buscar de manhã.'},
      registrar:'Amarrou o Penrose num caixote do armazém e entregou à Guarda de manhã.'},
  escolhas:[
    {texto:'Abrir os caixotes.', vai:'c37_os_caixotes'}
  ]
},
c37_penrose_oferta:{
  texto:[
    'Ele sorri pela primeira vez. É o sorriso de quem achou que a conversa ia ser difícil e descobriu que não.',
    fala('Sr. Penrose', 'Vinte mil. Agora, em dinheiro.'),
    fala('Sr. Penrose', 'E a Milotic. Leva a Milotic e devolve pra moça de Lilycove, e o torneio inteiro vai saber que {o Campeão|a Campeã} de Kanto achou a Milotic. Ela vale demais pra vender sem alguém notar mesmo.'),
    fala('Sr. Penrose', 'O resto sobe no barco. E na semana que vem a gente nem se conhece.')
  ],
  escolhas:[
    {texto:'Pegar o dinheiro e a Milotic.', vai:'c37_penrose_pagou'},
    {texto:'"Não."', vai:'c37_o_barco'}
  ]
},
c37_penrose_pagou:{
  texto:[
    'Ele conta o dinheiro em cima de um caixote, nota por nota, e te entrega o bolo com a Pokébola da fita lilás por cima.',
    d => Historia.jaAconteceu('c37_o_pedido') ? 'A folha do pedido ele pega de volta de cima do caixote, dobra em quatro e guarda no paletó, sem olhar pra você.' : '',
    'O homem do barco entra e começa a levar os caixotes. Um por um. LILYCOVE. ECRUTEAK. FORTREE.',
    d => (d.flags.sv_mochila_subiu || d.flags.sv_ovos_subiram || d.flags.sv_turma_subiu) ? 'Leva também o que você não segurou nas outras ilhas. Você vê sair pela porta, e não diz nada.' : '',
    'O barco vai embora sem luz. O Penrose vai embora nele, de terno branco, acenando da proa, como o velho da varanda da Ilha Dois acena pra todo mundo que passa.'
  ],
  ef:{flag:['sv_penrose_pagou', 'sv_rec_milotic'], dinheiro:20000,
      rep:{eixo:'ruim', delta:4, motivo:'Aceitou dinheiro do Penrose e deixou os Pokémon roubados das ilhas irem embora no barco', notorio:true},
      npc:{nome:'Sr. Penrose', opiniao:3, memoria:'Aceitou os vinte mil e a Milotic no armazém da Ilha Cinco.'},
      registrar:'Aceitou vinte mil do Penrose e a Milotic. Os outros Pokémon do armazém foram embora no barco sem luz.'},
  escolhas:[
    {texto:'Sair do armazém pela campina.', vai:'c37_o_amanhecer'}
  ]
},
c37_o_barco:{
  texto:[
    'Você sai pelo cais do armazém. O barco está encostado, de motor ligado, e o homem do motor já está com o primeiro caixote na mão.',
    d => d.flags.sv_dekker_vencido
      ? 'Você para na frente da prancha. O homem do motor olha você, olha o Dekker sentado no caixote com a jaqueta do dragão, sem se mexer, e larga o caixote.'
      : 'O Dekker aparece na porta do armazém, atrás de você, de jaqueta do dragão. Ele olha o barco, olha você, e senta no caixote da porta. Não segura nada.',
    'O Penrose entende antes de todo mundo. Passa por você sem olhar, sobe no barco sem caixote nenhum, e o barco sai pro mar aberto, sem luz, levando só ele.'
  ],
  ef:{flag:['sv_penrose_fugiu', 'sv_rec_milotic'], executar:d => _c37Volta(d),
      rep:{eixo:'bom', delta:2, motivo:'Não deixou o barco do Penrose sair com os Pokémon roubados das ilhas', notorio:true},
      registrar:'Segurou o cais do armazém. O Penrose fugiu de barco, sem os caixotes.'},
  escolhas:[
    {texto:'Abrir os caixotes.', vai:'c37_os_caixotes'}
  ]
},

c37_os_caixotes:{
  texto:[
    'Vinte e três Pokébolas com etiqueta de cidade de longe e preço de contador. Você tira as etiquetas uma por uma, e no fim tem um monte de papel no chão e vinte e três Pokébolas que não valem nada pra ninguém, só pra quem é dono.',
    'A da Milotic você guarda separada, no bolso de dentro, com a fita lilás.',
    d => d.flags.sv_mochila_subiu ? 'A mochila de Apricorn vai junto, pendurada no seu ombro, batendo bola com bola a cada passo.' : '',
    d => d.flags.sv_ovos_subiram ? 'A caixa térmica você liga na tomada do armazém antes de qualquer coisa. A luzinha acende.' : '',
    d => Historia.jaAconteceu('c37_o_pedido')
      ? 'A folha do pedido ficou em cima do caixote onde o Penrose alisou. Você dobra em quatro e guarda.'
      : 'Embaixo do último caixote, numa pasta de papelão, tem uma folha de papel bom, dobrada em quatro.',
    ...C37_PEDIDO.map(l => d => Historia.jaAconteceu('c37_o_pedido') ? '' : (typeof l === 'function' ? l(d) : l))
  ],
  ef:{flag:['sv_viu_o_pedido', 'sv_pedido_no_bolso'], itens:{'Folha do pedido':1},
      rep:{eixo:'bom', delta:1, motivo:'Tirou as etiquetas de preço dos Pokémon roubados no armazém da Ilha Cinco'},
      registrar:d => Historia.jaAconteceu('c37_o_pedido')
        ? 'Guardou no bolso a folha do pedido que o Penrose deixou em cima do caixote.'
        : 'Achou embaixo do último caixote o pedido de quem compra: Instituto de Diversidade Genética de Kanto, Registro 11.402, Rua do Comércio, 118, sala 704, Saffron. Coleta de matriz fora da área de convênio. Remessa sul: Ilhas Sevii. Remessa norte: Ilhas do Redemoinho.'},
  escolhas:[
    {texto:'Esperar o dia clarear na porta do armazém.', vai:'c37_o_amanhecer'}
  ]
},

c37_o_amanhecer:{
  texto:[
    'O dia clareia em cima da campina, e ela volta a cantar.',
    d => d.flags.sv_penrose_pagou
      ? 'Você atravessa o capim com vinte mil no bolso e uma Pokébola com fita lilás. Pesa mais o dinheiro.'
      : 'Você atravessa o capim com uma Pokébola de fita lilás no bolso de dentro, e o resto vai atrás, num carrinho de mão que a mulher do varal emprestou sem perguntar pra quê.',
    d => d.flags.sv_penrose_pagou ? '' : 'No Centro da Ilha Cinco, a enfermeira manda recado pela torre de rádio da Ilha Um pras sete ilhas: quem perdeu Pokémon, venha buscar. Ela lê a lista de cidade em voz alta, devagar, pra ninguém errar.',
    'No relógio da praça são seis e quatro. Na hora que é, são seis.',
    'A balsa da Ilha Sete, que só sai na semana do torneio, está no cais com a bandeira da arena redonda no mastro.'
  ],
  ef:{registrar:'Amanheceu na Ilha Cinco. A balsa da Ilha Sete está no cais: a semana do torneio começou.'},
  fim:true, sai:'ilha_cinco',
  resumo:'O Armazém: vinte e três Pokébolas com etiqueta de preço, um senhor de terno branco às duas da manhã, e o nome de quem paga o troféu.'
}

}
});
