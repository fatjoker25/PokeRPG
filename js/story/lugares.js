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
  7:  {local:'lavender',  chamada:'A torre de sete andares no fim da rua sem música.'},
  8:  {local:'vermilion', chamada:'O S.S. Anne está atracado no cais três.'},
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
  {chave:'loja_viridian', texto:['Você encontra a loja da cidade escondida atrás da praça, com a fachada tão sem graça que você passou por ela duas vezes.'], descobre:'loja_viridian'},
  {chave:'ginasio_viridian', texto:[
    'Na saída oeste de Viridian tem um prédio grande, repintado, com uma placa de acrílico nova na porta.',
    'A placa diz uma coisa só: "SETE INSÍGNIAS."',
    'Você não tem sete insígnias. Você nem tem uma.'], descobre:'ginasio_viridian'},
  {chave:'v_mural', texto:['O mural de recados do Centro Pokémon tem um bilhete escrito com pressa e sublinhado três vezes: "NÃO ENTRE NA FLORESTA DE VIRIDIAN À NOITE."'], ef:{flag:'leu_aviso_floresta'}},
  {chave:'v_velho', texto:['Um homem de uns setenta anos ensina uma criança a jogar uma Poké Ball num poste. A criança erra oito vezes. Ele não perde a paciência uma vez.']}
],
pewter:[
  {chave:'ginasio_pewter', texto:[
    'O ginásio fica no fim da rua principal: porta de metal, sem placa bonita, sem vidro.',
    'Dá pra ouvir alguma coisa pesada caindo lá dentro, em intervalos regulares.'], descobre:'ginasio_pewter'},
  {chave:'loja_pewter', texto:['A loja de Pewter vende mais equipamento de escalada que item de treinador. A dona explica que é questão de demanda.'], descobre:'loja_pewter'},
  {chave:'p_museu', texto:[
    'O museu tem duas salas e um funcionário. Na segunda, atrás do vidro, um Kabutops reconstruído em pedra.',
    'A placa diz: "Extinto há aproximadamente 300 milhões de anos."'], ef:{flag:'viu_o_museu'}}
],
cerulean:[
  {chave:'ginasio_cerulean', texto:[
    'O ginásio de Cerulean é uma piscina olímpica coberta, e dá pra ouvir o eco de fora.',
    'Tem um cartaz meio velho na porta: "DESAFIOS: MANHÃ E TARDE. NÃO ENTRE MOLHADO."'], descobre:'ginasio_cerulean'},
  {chave:'loja_cerulean', texto:['A loja fica na ponte sul e atende pelo balcão, sem ninguém entrar.'], descobre:'loja_cerulean'},
  {chave:'c_ponte', texto:['Na ponte norte, alguém montou uma banca de veludo com seis Poké Balls e preço em plaquinha. Você olha por tempo demais e a pessoa te olha de volta.']}
],
vermilion:[
  {chave:'ginasio_vermilion', texto:[
    'O ginásio de Vermilion é um galpão de manutenção portuária adaptado, com cabo grosso saindo por baixo da porta.',
    'De fora dá pra sentir cheiro de ozônio.'], descobre:'ginasio_vermilion'},
  {chave:'loja_vermilion', texto:['A loja do porto abre às cinco da manhã e vende comida, corda e Poké Ball no mesmo balcão.'], descobre:'loja_vermilion'},
  {chave:'vm_cais', texto:['No cais três, um navio do tamanho de um prédio deitado. Tem fila pra entrar e a passagem custa oito mil.']}
],
lavender:[
  {chave:'l_mural', texto:[
    'Na base da torre tem um mural com nomes. Muitos nomes.',
    'Alguns têm data de um Pokémon e data de um treinador na mesma linha.']},
  {chave:'loja_lavender', texto:['A loja de Lavender vende incenso e vela junto com Potion, o que faz um sentido triste.'], descobre:'loja_lavender'},
  {chave:'l_silencio', texto:['Você percebe, depois de meia hora, que a cidade inteira não tem música em lugar nenhum. Nenhum rádio, nenhuma loja com alto-falante.']}
],
celadon:[
  {chave:'ginasio_celadon', texto:[
    'O ginásio de Celadon é uma estufa de vidro em cima do shopping. Do térreo dá pra ver o verde lá em cima.',
    'O elevador de serviço tem um botão sem número.'], descobre:'ginasio_celadon'},
  {chave:'loja_celadon', texto:['O shopping tem sete andares e o quarto inteiro é de item de treinador. Você fica quinze minutos parado só olhando prateleira.'], descobre:'loja_celadon'},
  {chave:'cl_cassino', texto:['O cassino mudou de nome duas vezes desde que a Rocket caiu. Agora se chama "Celadon Palace" e tem a mesma carpete.']}
],
fuchsia:[
  {chave:'ginasio_fuchsia', texto:[
    'O ginásio de Fuchsia não tem fachada. Você passa duas vezes na frente antes de entender que aquilo é a entrada.',
    'Não tem placa, não tem janela, e a porta abre pra dentro de um jeito estranho.'], descobre:'ginasio_fuchsia'},
  {chave:'loja_fuchsia', texto:['A loja fica na entrada da Zona Safári e vende mais repelente que Poké Ball.'], descobre:'loja_fuchsia'},
  {chave:'f_cartaz', texto:['Um cartaz desbotado na recepção da reserva: "AJUDE-NOS — Pokémon avistados fora da cerca devem ser reportados."']}
],
saffron:[
  {chave:'ginasio_saffron', texto:[
    'O ginásio de Saffron é um prédio baixo e sem janela, espremido entre dois arranha-céus.',
    'A porta está trancada e tem um papel colado: "SUSPENSO POR TEMPO INDETERMINADO — S."',
    'A luz interna está acesa.'], descobre:'ginasio_saffron'},
  {chave:'loja_saffron', texto:['A loja de Saffron fica no térreo de um prédio comercial e tem fila de gente de crachá na hora do almoço.'], descobre:'loja_saffron'},
  {chave:'s_silph', texto:['A Silph Co. ocupa um quarteirão inteiro. Recepção com catraca, crachá, câmera, e uma mulher no balcão com um sorriso impecável.']}
],
cinnabar:[
  {chave:'ginasio_cinnabar', texto:[
    'O ginásio de Cinnabar fica do outro lado da ilha e sobreviveu ao incêndio por isso.',
    'Pela janela dá pra ver uma lousa cheia de conta de física.'], descobre:'ginasio_cinnabar'},
  {chave:'loja_cinnabar', texto:['A loja da ilha é uma casa com uma vitrine. A dona atende de chinelo.'], descobre:'loja_cinnabar'},
  {chave:'cn_lab', texto:['O prédio do laboratório queimou parcialmente na semana passada. A fita de isolamento é nova. O buraco na cerca, também.']}
],
pallet:[
  {chave:'pl_praia', texto:['Do alto do morro dá pra ver o mar. Do outro lado dele, num dia limpo, uma mancha escura que é uma ilha.']},
  {chave:'loja_pallet', texto:['O mercado de Pallet abre tarde e vende Poké Ball atrás do balcão, junto com pilha e anzol.'], descobre:'loja_pallet'},
  {chave:'pl_rufino', texto:['Seu Rufino varre a mesma calçada há vinte anos. Ele te olha passar e não diz nada, que no caso dele é uma coisa que ele escolheu.']}
]
};

/* Rotas: achados genéricos, temperados pelo ambiente */
const ACHADOS_ROTA = [
  {texto:['No meio do mato você acha uma mochila velha, molhada de sereno, com uma Poké Ball dentro e mais nada.'], ef:{itens:{'Poké Ball':1}}},
  {texto:['Embaixo de uma pedra, um vidro de Potion fechado, dentro da validade por pouco.'], ef:{itens:{'Potion':1}}},
  {texto:['Um treinador acampado te oferece café e conversa por vinte minutos sobre absolutamente nada. Você sai dali melhor do que entrou.'], ef:{hp:3}},
  {texto:['Você acha dinheiro no chão. Uma nota só, dobrada quatro vezes, do jeito que gente guarda quando é a última.'], ef:{dinheiro:700}},
  {texto:['Um ninho abandonado, ainda inteiro, com casca de ovo quebrada por dentro — do jeito certo, de quem nasceu e foi embora.']},
  {texto:['Marca de pneu onde não devia ter pneu. Larga, funda, indo pra dentro do mato.']},
  {texto:['Você acha uma placa caída, apagada pelo sol. Dá pra ler "CUIDADO" e mais nada.']},
  {texto:['Uma trilha estreita que não está em mapa nenhum. Ela dá em nada — mas alguém andou por ela o suficiente pra abrir o mato.']}
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
    if (!soCidade && Dados.chance(45)) return Dados.escolher(ACHADOS_ROTA);
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
    const catalogo = [
      ['Poké Ball',200],['Great Ball',600],['Ultra Ball',1200],
      ['Potion',300],['Super Potion',700],['Hyper Potion',1500],
      ['Revive',1500],['Antidote',250],['Full Heal',600],
      ['Bandagem',400],['Ração',350]
    ];
    UI.modal('Loja — ' + Estado.j.dinheiro + ' ₽', catalogo.map(([n,p]) =>
      `<button class="escolha" ${Estado.j.dinheiro < p ? 'disabled style="opacity:.4"':''}
        onclick="Cidade.comprar('${n}',${p})">${n} — ${p} ₽
        <span class="pd">${descricaoItem(n)}</span></button>`).join(''));
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
