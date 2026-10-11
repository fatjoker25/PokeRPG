/* ============================================================
   A REDE — o escalão do que sobrou da Rocket

   A Equipe Rocket caiu, e o que sobrou dela é uma rede pequena que
   ainda usa as palavras de antes: recruta, executivo. Quem entra
   pelo envelope do armário 14 (o posto de Informante, em cargos.js)
   pode subir. São cinco degraus:

     1 Informante   o envelope, sem uniforme
     2 Recruta      o uniforme preto
     3 Contador     o caderno do lote
     4 Chefe de turno  a chave do subsolo
     5 Executivo    o branco, e a letra antiga no peito

   Subir pede CONFIANÇA (o que a rede acha de você), o capítulo do
   degrau e vencer a PROVA: uma luta contra quem já está lá em cima.
   A confiança sai de duas fontes:
     - o que a rede viu você fazer na história (CONFIANCA_DAS_MARCAS),
       lido das flags toda vez, nunca guardado;
     - os SERVIÇOS, que aparecem nos pontos da rede, um a cada
       SERVICO_ESPERA_DIAS dias, e somam em d.rede.pontos.
   O que a rede não viu não conta: sabotagem que passa no teste fica
   em zero, e a foto que você mandou pro policial nunca pesa.

   Confiança em CONFIANCA_EXPULSA ou menos depois de um serviço e a rede
   para de ligar: o posto cai e não volta. Só depois de serviço: escolha
   antiga da linha baixa a confiança mas não expulsa sozinha, senão a
   cena da linha escrita pra quem sabotou nunca chegava. Pedir pra sair
   na linha também fecha a porta.

   O nome do posto (o que aparece no cartão), a renda, o desconto e o
   peso do posto saem do degrau: o posto 'rocket' de cargos.js lê
   daqui por getter.
   ============================================================ */

const SERVICO_ESPERA_DIAS = 2;
const PROVA_ESPERA_DIAS = 1;
const CONFIANCA_EXPULSA = -3;
/* o prêmio da prova é o da classe × nível do último Pokémon, vezes isto */
const PAGA_PROVA = 2;

const ESCALOES = [
  {n:1, nome:'Informante', insignia:'o envelope', uniforme:null,
   conf:0, cap:8, renda:1200, loja:0.75, peso:3},
  {n:2, nome:'Recruta', insignia:'o uniforme preto', uniforme:['rede_recruta_m', 'rede_recruta_f'],
   conf:3, cap:10, renda:1600, loja:0.75, peso:3, item:'Uniforme preto da rede', prova:'brant'},
  {n:3, nome:'{Contador|Contadora}', insignia:'o caderno do lote', uniforme:['rede_recruta_m', 'rede_recruta_f'],
   conf:7, cap:14, renda:2100, loja:0.72, peso:3, item:'Caderno de lote', prova:'juno'},
  {n:4, nome:'Chefe de turno', insignia:'a chave do subsolo', uniforme:['rede_recruta_m', 'rede_recruta_f'],
   conf:13, cap:18, renda:2700, loja:0.7, peso:4, item:'Chave do subsolo', prova:'mercer'},
  {n:5, nome:'{Executivo|Executiva}', insignia:'a letra antiga', uniforme:['rede_executivo', 'rede_executiva'],
   conf:20, cap:22, renda:3500, loja:0.65, peso:5, item:'Broche da letra antiga', prova:'corbin'}
];

/* o que a rede viu: as flags da história, com o peso que ela dá. O que
   ela não viu fica de fora: a delação do Monte da Lua (a Dra. Cordell
   nunca disse de quem ouviu), o número errado do primeiro pedido, a foto
   pro policial, a lista inventada. E a caixa do Vulpix aberta não pesa
   contra: a própria voz achou "interessante, não ruim". */
const CONFIANCA_DAS_MARCAS = {
  trabalhou_rocket:1,
  ln_rocket_contou:1, ln_rocket_calou:-1,
  ln_rocket_entregou:2,
  ln_rocket_dentro:2,
  ln_rocket_vigiou:2, ln_rocket_lapras:-2,
  ln_rocket_lista:3, ln_rocket_recusou_lista:-2,
  ln_rocket_subiu:3,
  cm_rocket_contou_certo:2, cm_rocket_tres:-1, cm_rocket_filhote:-3,
  cm_rocket_quer_subir:3, cm_rocket_pediu_pra_parar:-2
};

/* onde a rede atende, e desde que degrau você sabe da porta */
const PONTOS_DA_REDE = {
  vermilion:{titulo:'O armário 14', desde:1,
    sub:'No Centro, do lado do bebedouro. Nunca fica vazio muito tempo.'},
  celadon:{titulo:'O subsolo de carga', desde:2,
    sub:'Uma porta de serviço atrás do estacionamento do shopping. Quem tem chave desce.'},
  fuchsia:{titulo:'O galpão da saída sul', desde:3,
    sub:'Telhado de zinco, cadeado novo numa porta velha.'}
};

/* ── AS PROVAS: quem já está no degrau te testa ──
   `times` lista LINHAS, uma por entrada, do fraco pro forte: o time sai
   das últimas `tam` e o nível escolhe a forma (timeDeLinhas). Base e
   evolução da mesma linha na lista viram um Pokémon só. */
const PROVAS_DA_REDE = {
brant:{
  escalao:2, local:'vermilion', classe:'Recruta', nome:'Brant', rosto:'trainers/rede_recruta_m',
  times:[52, 19, 41, 23], tam:3, acima:2, golpes:['Thief', 'Toxic'],
  porta:'Brant quer te ver no armazém do fim do cais',
  apresenta:[
    'O armazém do fim do cais tem luz acesa de madrugada e um homem de uniforme preto sentado num caixote, comendo pão com a mão suja de graxa.',
    'O uniforme é antigo. No peito, onde ficava a letra, tem só a marca da costura e uns fios soltos.',
    fala('Brant', 'Brant. Eu visto isso faz seis anos, contando os dois que ninguém mais vestia.'),
    fala('Brant', 'A voz diz que você conta direito. Contar direito qualquer um conta. Eu quero ver se você segura.'),
    fala('Brant', 'Se ganhar, o preto é seu. Se perder, volta pro envelope e ninguém fica chateado.')
  ],
  volta:[fala('Brant', 'De novo? Tá. O caixote não sai daqui.')],
  vence:'"Volta pro envelope. Ninguém fica chateado."',
  perde:'"Segura. Tá bom. Segura."',
  depois:[
    'Brant tira um uniforme dobrado de dentro do caixote. Cheira a naftalina e a porão.',
    fala('Brant', 'Era de um cara que saiu. Ninguém sai, então ele só parou de vir.'),
    fala('Brant', 'Não costura letra nenhuma. A gente não usa mais. A gente só sabe.', 'baixo')
  ]
},
juno:{
  escalao:3, local:'celadon', classe:'Contadora', nome:'Juno', rosto:'trainers/rede_recruta_f',
  times:[19, 96, 109, 23, 88], tam:4, acima:1, golpes:['Sludge Bomb', 'Swagger', 'Thief'],
  porta:'Juno espera no subsolo com o caderno aberto',
  apresenta:[
    'O subsolo de carga é um corredor comprido com piso de cimento e cheiro de papelão molhado. No fim dele, uma mulher de uniforme preto confere uma pilha de notas com a ponta do lápis.',
    fala('Juno', 'Juno. Eu conto tudo que desce aqui. Gaiola, caixa, dinheiro, gente.'),
    /* quem ganhou o preto da voz, sem prova, nunca viu o Brant */
    d => fala('Juno', `${provaVencida(d, 'brant') ? 'O Brant diz' : 'A voz diz'} que você segura. Segurar é fácil. Contar errado com alguém olhando e não piscar é o que eu quero ver.`),
    'Ela fecha o caderno no lápis, pra marcar a página, e solta a primeira Pokébola sem levantar.'
  ],
  volta:[fala('Juno', 'O caderno continua aberto na mesma página.')],
  vence:'"Errado. Volta quando a conta fechar."',
  perde:'"Fechou. Pode anotar."',
  depois:[
    'Juno arranca as últimas folhas em branco do caderno dela, grampeia num caderno novo e te entrega.',
    fala('Juno', 'Quilo, não cabeça. Número de lote, não espécie. Se você escrever o nome de algum, rasga e começa de novo.'),
    fala('Juno', 'É assim que se aguenta.', 'baixo')
  ]
},
mercer:{
  escalao:4, local:'fuchsia', classe:'Chefe de turno', nome:'Mercer', rosto:'trainers/rede_chefe',
  times:[56, 23, 50, 41, 111, 109], tam:5, acima:6, golpes:['Sludge Bomb', 'Dig', 'Rock Slide', 'Thief'],
  porta:'Mercer passa a noite no galpão da saída sul',
  apresenta:[
    'No galpão da saída sul tem uma balança de carga, uma mesa de ferro e um homem de cabelo pintado que fuma de costas pra porta, como quem não tem medo de quem entra.',
    fala('Mercer', 'Mercer. Eu cuido do turno da noite daqui até Celadon. Tudo que anda de madrugada anda porque eu deixei.'),
    fala('Mercer', 'Chefe de turno não é quem conta. É quem decide o que se conta. A Juno diz que você já sabe a diferença.'),
    fala('Mercer', 'Eu não acho. Me mostra.')
  ],
  volta:[fala('Mercer', 'Voltou. A balança também não mudou de opinião.')],
  vence:'"Ainda não. O turno é meu."',
  perde:'"O turno de terça é seu. Não me liga na terça."',
  depois:[
    'Mercer tira uma chave do chaveiro, uma só, de cabeça quadrada, e põe em cima da mesa de ferro.',
    fala('Mercer', 'O subsolo inteiro. Inclusive a porta que a Juno não abre.'),
    fala('Mercer', 'Quem tem essa chave não pergunta mais pra ninguém. Isso parece bom até a primeira vez.', 'baixo')
  ]
},
corbin:{
  escalao:5, local:'celadon', classe:'Executivo', nome:'Corbin', rosto:'trainers/rede_executivo_velho',
  times:[52, 23, 41, 88, 109, 228], tam:6, acima:3, golpes:['Sludge Bomb', 'Shadow Ball', 'Swagger', 'Thief'],
  porta:'Corbin manda te chamar na sala sem janela do subsolo',
  apresenta:[
    'A sala sem janela do subsolo tem duas cadeiras de escritório viradas pra mesma mesa. Numa delas, um homem magro de cabelo roxo lixa a unha com uma lixa de metal.',
    fala('Corbin', 'Corbin. Executivo, como se dizia antes. A gente ainda diz, porque ninguém inventou palavra melhor.'),
    fala('Corbin', 'A outra cadeira é de quem senta do lado da mesa de cima. Ela está vazia faz quase um ano, e eu cansei de conversar sozinho.'),
    fala('Corbin', 'O Mercer te deu a chave. A chave abre porta. A cadeira, quem dá sou eu.'),
    'Ele guarda a lixa no bolso do paletó e tira seis Pokébolas, uma por uma, e enfileira na mesa.'
  ],
  volta:[fala('Corbin', 'A cadeira continua vazia. Eu continuo conversando sozinho.')],
  vence:'"Senta na escada. A cadeira não é sua."',
  perde:'"Senta. A cadeira é sua."',
  depois:[
    'Corbin tira do bolso do paletó um broche pequeno, de metal escuro, com uma letra que ninguém usa mais em Kanto, e empurra pela mesa até você.',
    fala('Corbin', 'Não é pra usar no peito. É pra você saber que tem.'),
    fala('Corbin', 'Lá em cima vão te ligar direto agora. Eu atenderia no primeiro toque.', 'baixo')
  ]
}
};

/* ── OS SERVIÇOS ──
   Cada um aparece num ponto, do degrau dele até o seguinte, uma vez.
   Escolha: {texto, conf, ef, luta, teste, bom, ruim, resultado, cond}.
   Teste rola e escolhe o ramo (bom/ruim), que pode ter conf, ef, luta e
   resultado próprios. Luta perdida vale −1 de confiança e não paga. */
const SERVICOS_DA_REDE = [
/* ---------- Informante ---------- */
{
  id:'fila', escalao:1, local:'vermilion', titulo:'A fila do Centro', quem:'a voz do outro lado',
  texto:[
    'O aparelho do envelope vibra no bolso quando você ainda está na porta do Centro de Vermilion.',
    fala('a voz do outro lado', 'Hoje é fácil. Quantos treinadores de fora da cidade passam pela fila até o fim da tarde. Só os de fora.'),
    'A fila anda devagar. Crachá de ginásio, mochila de outra região, gente que dorme no banco de espera com a Pokébola no colo.'
  ],
  escolhas:[
    {texto:'Ficar a tarde inteira e contar direito.',
     teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção', eixo:'paciencia'},
     bom:{conf:1, ef:{dinheiro:500, rep:{eixo:'ruim', delta:1, motivo:'Contou a fila do Centro de Vermilion pra rede'}},
       resultado:['Vinte e três. Você confere duas vezes antes de dizer.', fala('a voz do outro lado', 'Vinte e três. Bate com o nosso.')]},
     ruim:{conf:0, ef:{dinheiro:200},
       resultado:['Você perde a conta duas vezes e diz dezenove.', fala('a voz do outro lado', 'Dezenove. O nosso diz vinte e três. Da próxima, conta com o dedo.', 'frio')]}},
    {texto:'Dizer um número qualquer e ir almoçar.', conf:-1, ef:{dinheiro:200},
     resultado:['Você diz trinta.', fala('a voz do outro lado', 'Trinta. O nosso diz vinte e três.', 'frio'), 'O dinheiro cai na conta. Menos do que da outra vez.']}
  ]
},
{
  id:'recado', escalao:1, local:'vermilion', titulo:'O envelope do cais',
  texto:[
    'Dentro do armário 14 tem um envelope pardo grosso, fechado com grampo, e um bilhete.',
    '**CAIS 3. O MARINHEIRO DE GORRO VERDE. NÃO ABRE.**',
    'No cais 3 tem um marinheiro só de gorro verde, sentado num rolo de corda, olhando o mar como quem conta onda.'
  ],
  escolhas:[
    {texto:'Entregar o envelope como mandaram.',
     luta:{classe:'Marinheiro', nome:'Reeve', rosto:'trainers/sailor', times:[60, 90, 98, 72], tam:2, acima:-2,
       antes:[fala('Reeve', 'Envelope? Eu não espero envelope de ninguém.'),
              fala('Reeve', 'Quem te mandou sabe que eu saí. Então quem te mandou quer saber se eu ainda brigo.'),
              'Ele levanta do rolo de corda já com a Pokébola na mão.'],
       vence:'"Volta lá e diz que eu ainda brigo."', perde:'"Diz pra eles que eu não brigo mais. Agora é verdade."',
       perdeu:[fala('Reeve', 'Pega o seu envelope. Diz que eu não aceitei.'), 'Ele te devolve o envelope fechado. Pesa igual.']},
     conf:1, ef:{dinheiro:700, rep:{eixo:'ruim', delta:1, motivo:'Fez o recado da rede no cais de Vermilion'},
       npc:{nome:'Reeve', opiniao:-2, memoria:'Você levou até ele o envelope da rede e brigou com ele no cais.'}},
     resultado:['Reeve abre o envelope depois da briga, sentado de novo na corda. Dentro tem dinheiro e uma foto da casa dele, tirada do outro lado da rua.',
       fala('Reeve', 'Isso é aviso, não pagamento. Você sabia?', 'baixo'), 'Você não sabia. Agora sabe.']},
    {texto:'Abrir o envelope no banheiro do cais antes.',
     teste:{status:'intelecto', dificuldade:6, nomeStatus:'Intelecto', eixo:'discricao'},
     bom:{conf:0, ef:{dinheiro:400},
       resultado:['Dentro: dinheiro e a foto da casa de um homem, tirada do outro lado da rua. Você põe o grampo de volta nos mesmos furos.',
         'Reeve abre, olha a foto e fica muito tempo sem dizer nada. Depois te dá uma moeda, como gorjeta, e volta a olhar o mar.']},
     ruim:{conf:-2,
       resultado:['O grampo não entra nos furos de novo. Reeve olha o envelope amassado e olha pra você.',
         fala('Reeve', 'Abriu. Eles vão saber que abriu. Eles sempre sabem.', 'baixo')]}},
    {texto:'Jogar o envelope no mar.', conf:-2, ef:{rep:{eixo:'bom', delta:1, motivo:'Jogou no mar o envelope que a rede mandou pro cais'}},
     resultado:['O envelope boia um pouco, encharca e afunda devagar do lado do casco de um barco de pesca.', 'No dia seguinte o armário 14 está vazio. No outro também.']}
  ]
},
/* ---------- Recruta ---------- */
{
  id:'porta', escalao:2, local:'vermilion', titulo:'A porta do armazém',
  texto:[
    'Uniforme preto, um banquinho e a porta de um armazém no fim do cais. A ordem cabe numa frase: ninguém entra.',
    'Lá pelas tantas, um guarda portuário vem pela beira do cais com uma lanterna, devagar, conferindo cadeado por cadeado.',
    fala('Guarda Teague', 'Esse armazém está vazio no registro do porto. Abre pra mim.')
  ],
  escolhas:[
    {texto:'Ficar na frente da porta.',
     luta:{classe:'Guarda', nome:'Teague', rosto:'overworld/policial', times:[21, 66, 58], tam:3, acima:-1,
       antes:[fala('Guarda Teague', 'Então vai ser assim. Tá bom.'), 'Ele apoia a lanterna num poste, virada pra vocês dois.'],
       vence:'"Abre a porta agora."', perde:'"Eu volto com mais gente."',
       perdeu:['Teague abre a porta com o seu molho de chaves e anota o que vê num caderninho. Caixas lacradas, furo de ar em cada uma.', 'Na semana seguinte o armazém está vazio e com outro cadeado.']},
     conf:2, ef:{dinheiro:900, rep:{eixo:'ruim', delta:1, motivo:'Brigou com o guarda do porto na porta de um armazém da rede'}},
     resultado:['Teague recolhe a lanterna e vai embora sem pressa, olhando pra trás duas vezes.', 'De manhã alguém troca o cadeado e te paga na porta, em dinheiro dobrado no meio.']},
    {texto:'Dizer que o armazém é de uma transportadora e que a papelada está no escritório.',
     teste:{status:'carisma', dificuldade:7, nomeStatus:'Carisma', eixo:'simpatia'},
     bom:{conf:2, ef:{dinheiro:900},
       resultado:[fala('Guarda Teague', 'Transportadora. Tá. Amanhã eu passo no escritório.'), 'Ele não passa. De manhã, alguém troca o cadeado e te paga na porta.']},
     ruim:{conf:0,
       luta:{classe:'Guarda', nome:'Teague', rosto:'overworld/policial', times:[21, 66, 58], tam:3, acima:-1,
         antes:[fala('Guarda Teague', 'Transportadora de madrugada, com {moço|moça} de preto na porta. Não.'), 'Ele apoia a lanterna num poste.'],
         vence:'"Abre a porta agora."', perde:'"Eu volto com mais gente."',
         perdeu:['Teague abre a porta e anota o que vê. Caixas lacradas, furo de ar em cada uma.', 'Na semana seguinte o armazém está vazio e com outro cadeado.']},
       ef:{dinheiro:900}, conf:2,
       resultado:['Teague vai embora sem a resposta que veio buscar.', 'De manhã alguém troca o cadeado e te paga na porta.']}},
    {texto:'Sair da frente e deixar ele olhar.', conf:-2, ef:{rep:{eixo:'bom', delta:2, motivo:'Deixou o guarda do porto abrir o armazém da rede'}},
     resultado:['Teague abre a porta e fica um tempo parado com a lanterna apontada pra dentro. Caixas lacradas, furo de ar em cada uma, e um barulho baixinho que não é do mar.',
       fala('Guarda Teague', 'Você não estava aqui. Some.', 'baixo'), 'De manhã tem viatura no cais. O armário 14 fica vazio três dias.']}
  ]
},
{
  id:'divida', escalao:2, local:'celadon', titulo:'A dívida da mesa dos fundos',
  texto:[
    'O bilhete do subsolo tem um nome, um valor e uma mesa.',
    '**DORN. 4.000. MESA DOS FUNDOS DO CASSINO.**',
    'Dorn é um homem de camisa florida que joga moeda na máquina como quem dá comida a um Pokémon que morde. Quando vê o preto por baixo do seu casaco, para de jogar.',
    fala('Dorn', 'Eu pago. Semana que vem. Diz pra eles que é semana que vem.')
  ],
  escolhas:[
    {texto:'Cobrar do jeito que a rede cobra.',
     luta:{classe:'Apostador', nome:'Dorn', rosto:'trainers/gambler', times:[116, 37, 100, 52], tam:3, acima:-1,
       antes:[fala('Dorn', 'Então a gente aposta. Se eu ganhar, é semana que vem.')],
       vence:'"Semana que vem, então."', perde:'"Tá. Tá. Leva."',
       perdeu:['Dorn guarda a Pokébola e volta pra máquina sem olhar pra você.', 'O subsolo fica sabendo antes de você chegar lá.']},
     conf:2, ef:{dinheiro:1000, rep:{eixo:'ruim', delta:1, motivo:'Cobrou uma dívida pra rede no cassino de Celadon'},
       npc:{nome:'Dorn', opiniao:-3, memoria:'Você cobrou dele a dívida da rede na mesa dos fundos do cassino.'}},
     resultado:['Dorn conta quatro mil em ficha e nota amassada em cima do feltro verde.', 'A rede te deixa ficar com mil. O resto desce pro subsolo num envelope.']},
    {texto:'Pagar a dívida do seu bolso e dizer que cobrou. (3.000 ₽)', cond:d => d.jogador.dinheiro >= 3000,
     conf:2, ef:{dinheiro:-3000, rep:{eixo:'bom', delta:1, motivo:'Pagou do bolso a dívida de um apostador com a rede'},
       npc:{nome:'Dorn', opiniao:3, memoria:'Você pagou a dívida dele com a rede e não pediu nada.'}},
     resultado:['Você completa o envelope com o seu dinheiro. A rede devolve mil, como paga do serviço.', fala('Dorn', 'Por quê?'), 'Você não sabe responder, e ele não insiste.']},
    {texto:'Dizer ao Dorn pra sair da cidade hoje.', conf:-2,
     ef:{rep:{eixo:'bom', delta:2, motivo:'Avisou um devedor da rede pra fugir'}, npc:{nome:'Dorn', opiniao:4, memoria:'Você mandou ele sair de Celadon antes da rede.'}},
     resultado:['Dorn deixa as moedas na bandeja da máquina e sai pela porta da frente, que é a que tem câmera.', 'No subsolo, ninguém fala com você o resto do dia.']}
  ]
},
{
  id:'gaiola', escalao:2, local:'celadon', titulo:'A gaiola do beco',
  texto:[
    'Atrás do depósito tem um beco, e no beco uma gaiola de arame com um Meowth magro dentro, de coleira vermelha sem plaqueta.',
    'A ordem é levar a gaiola pro subsolo antes das seis.',
    'O Meowth não mia. Olha a sua mão como quem já sabe o que mão faz.'
  ],
  escolhas:[
    {texto:'Levar a gaiola pro subsolo.', conf:2, ef:{dinheiro:600, rep:{eixo:'ruim', delta:2, motivo:'Levou pro subsolo da rede um Meowth de coleira'}},
     resultado:['Alguém de lápis atrás da orelha escreve um número de lote num pedaço de esparadrapo e cola na gaiola.', 'A coleira vermelha vai pra uma caixa de sapato cheia de coleiras.']},
    {texto:'Soltar e dizer que a gaiola já estava aberta.',
     teste:{status:'carisma', dificuldade:6, nomeStatus:'Carisma', eixo:'discricao'},
     bom:{conf:0, ef:{moral:2, rep:{eixo:'bom', delta:1, motivo:'Soltou um Meowth de coleira no beco do depósito'}},
       resultado:['O Meowth some por cima do muro sem barulho.', 'No subsolo, você diz que o arame estava torto quando chegou. Alguém anota "arame" num caderno e ninguém pergunta mais nada.']},
     ruim:{conf:-2, ef:{moral:2, rep:{eixo:'bom', delta:1, motivo:'Soltou um Meowth de coleira no beco do depósito'}},
       resultado:['O Meowth some por cima do muro.', 'No subsolo, você diz que o arame estava torto. Quem ouve olha pras suas mãos, que estão com marca de arame.']}}
  ]
},
/* ---------- Contador ---------- */
{
  id:'lote', escalao:3, local:'celadon', titulo:'O lote que não fecha',
  texto:[
    'A nota do caminhão diz uma coisa e a carroceria diz outra.',
    '**LOTE 31 — 22 UNIDADES**',
    'Você conta vinte e quatro gaiolas. O motorista, um homem grande de macacão com o nome bordado no bolso, LARK, fuma encostado na roda e não parece surpreso.',
    fala('Lark', 'Duas a mais é meu. Sempre foi. Você é nov{o|a} no caderno.')
  ],
  escolhas:[
    {texto:'Anotar vinte e quatro e mandar subir a diferença.',
     luta:{classe:'Motorista', nome:'Lark', rosto:'trainers/worker', times:[95, 74, 66], tam:3, acima:0,
       antes:[fala('Lark', 'Então a gente resolve como se resolve no pátio.')],
       vence:'"Vinte e dois. Escreve vinte e dois."', perde:'"Vinte e quatro, então. Anota aí."',
       perdeu:['Você anota vinte e dois, com o Lark olhando por cima do seu ombro.', 'Juno confere o caderno à noite e passa o lápis duas vezes em cima do seu número.']},
     conf:3, ef:{dinheiro:1200, rep:{eixo:'ruim', delta:1, motivo:'Fechou a conta de um lote da rede'}},
     resultado:['Vinte e quatro no caderno. Juno lê, não diz nada e vira a página.', 'O Lark não estaciona mais no pátio quando é o seu turno.']},
    {texto:'Anotar vinte e dois e dividir as duas com o Lark.', conf:0,
     ef:{dinheiro:1500, rep:{eixo:'ruim', delta:2, motivo:'Dividiu com o motorista duas gaiolas fora da nota'}},
     resultado:['O Lark conta o dinheiro na sua frente, como se diz que se faz, e te passa metade.', 'As duas gaiolas sobem num carro de passeio de vidro escuro.']},
    {texto:'Anotar vinte e dois e soltar as duas no pátio de madrugada.',
     teste:{status:'intelecto', dificuldade:7, nomeStatus:'Intelecto', eixo:'discricao'},
     bom:{conf:0, ef:{moral:3, rep:{eixo:'bom', delta:2, motivo:'Soltou duas gaiolas que não estavam na nota'}},
       resultado:['Um Growlithe e um Ponyta, os dois de olho grande. Saem pelo portão do pátio sem olhar pra trás.', 'O Lark acha que foi o outro motorista. Os dois não se falam mais.']},
     ruim:{conf:-3, ef:{moral:3, rep:{eixo:'bom', delta:2, motivo:'Soltou duas gaiolas que não estavam na nota'}},
       resultado:['As duas saem pelo portão do pátio.', 'De manhã, a câmera do pátio está no caderno da Juno, numa folha dobrada, com a sua hora de entrada.']}}
  ]
},
{
  id:'fichas', escalao:3, local:'celadon', titulo:'As fichas do caixa',
  texto:[
    'O cassino lava o que o subsolo ganha, e alguém tem que conferir que o que entra de um lado sai do outro.',
    'A moça do caixa tem o nome escrito num crachá torto, TILLY, e a mão rápida demais na hora de fechar a gaveta.',
    'Você conta as fichas de três noites. Faltam seiscentas, sempre no turno dela.'
  ],
  escolhas:[
    {texto:'Refazer a conta inteira antes de falar qualquer coisa.',
     teste:{status:'intelecto', dificuldade:6, nomeStatus:'Intelecto', eixo:'paciencia'},
     bom:{conf:2, ef:{dinheiro:800},
       resultado:['Na segunda conta, faltam seiscentas e é a máquina sete que come ficha, não a Tilly.', 'Você anota "máquina sete" no caderno. Juno manda abrir a máquina e acha as fichas embaixo da gaveta de moedas.',
         fala('Tilly', 'Obrigada por contar duas vezes.', 'baixo')]},
     ruim:{conf:1, ef:{dinheiro:500, npc:{nome:'Tilly', opiniao:-3, memoria:'Você anotou o turno dela no caderno da rede por seiscentas fichas.'}},
       resultado:['A conta fecha do mesmo jeito: seiscentas, turno dela. Você anota.', 'Na semana seguinte tem outra moça no caixa, e o crachá torto está na caixa de sapato junto com as coleiras.']}},
    {texto:'Pôr seiscentas do seu bolso e fechar a conta. (600 ₽)', cond:d => d.jogador.dinheiro >= 600, conf:1,
     ef:{dinheiro:-600, npc:{nome:'Tilly', opiniao:2, memoria:'Você fechou a conta do caixa dela com o seu dinheiro.'}},
     resultado:['A conta fecha. Tilly vê você pondo as fichas na gaveta e não diz nada. Na noite seguinte, também não falta nada.']}
  ]
},
{
  id:'balanca', escalao:3, local:'fuchsia', titulo:'A balança da saída sul',
  texto:[
    'O galpão da saída sul tem uma balança de carga e um caderno. Tudo que sai de Fuchsia pela rede passa por ela e vira número: quilo, não cabeça.',
    'Hoje a balança marca quarenta quilos a mais do que a nota.',
    'Na porta do galpão aparece uma guarda-parque de chapéu de aba larga, com o crachá da reserva preso no bolso.',
    fala('Guarda-parque Ines', 'Esse caderno é o que eu acho que é?')
  ],
  escolhas:[
    {texto:'Fechar o caderno e ficar entre ela e a balança.',
     luta:{classe:'Guarda-parque', nome:'Ines', rosto:'trainers/pokemon_ranger_f', times:[30, 48, 102, 111, 115], tam:3, acima:0,
       antes:[fala('Guarda-parque Ines', 'Eu esperava que fosse.'), 'Ela tira o chapéu, põe na balança e solta a primeira Pokébola.'],
       vence:'"Esse caderno vem comigo."', perde:'"Eu volto com o caderno de outro jeito."',
       perdeu:['Ines leva o caderno debaixo do braço, com o chapéu na outra mão.', 'O galpão fica fechado uma semana inteira.']},
     conf:2, ef:{dinheiro:1100, rep:{eixo:'ruim', delta:1, motivo:'Brigou com a guarda da reserva pelo caderno da balança'},
       npc:{nome:'Ines', opiniao:-3, memoria:'Você brigou com ela no galpão da saída sul pelo caderno da balança.'}},
     resultado:['Ines pega o chapéu da balança e vai embora. O ponteiro volta pro zero.', 'Quem cuida do turno da noite do galpão, quando fica sabendo, só diz "quarenta quilos" e acende outro cigarro.']},
    {texto:'Entregar o caderno pra ela.', conf:-3,
     ef:{flag:'rede_caderno_da_balanca', rep:{eixo:'bom', delta:3, motivo:'Entregou à reserva o caderno da balança da rede'},
       npc:{nome:'Ines', opiniao:4, memoria:'Você entregou a ela o caderno da balança da saída sul.'}},
     resultado:['Ines folheia o caderno ali mesmo, de pé, sem pressa. Para numa página e passa o dedo numa linha.', fala('Guarda-parque Ines', 'Quarenta quilos de quê?', 'baixo'), 'Você não sabe. Ela vai descobrir.']},
    {texto:'Arrancar a página de hoje e entregar o resto como se fosse tudo.',
     teste:{status:'intelecto', dificuldade:7, nomeStatus:'Intelecto', eixo:'discricao'},
     bom:{conf:1, ef:{rep:{eixo:'bom', delta:1, motivo:'Entregou à reserva um caderno velho da balança'}},
       resultado:['O caderno que ela leva é de meses atrás e não diz nada que ela não saiba. A página de hoje vai pro seu bolso, dobrada em quatro.']},
     ruim:{conf:-2, ef:{rep:{eixo:'bom', delta:1, motivo:'Entregou à reserva o caderno da balança, com uma página arrancada'}},
       resultado:['Ines passa o dedo na borda rasgada da costura e olha pra você.', fala('Guarda-parque Ines', 'Faltou uma.', 'baixo'), 'Quem cuida do galpão também conta páginas.']}}
  ]
},
/* ---------- Chefe de turno ---------- */
{
  id:'celula', escalao:4, local:'fuchsia', titulo:'A outra célula',
  texto:[
    'O caminhão de terça chega em Fuchsia com a lona cortada e metade da carga a menos.',
    'Quem cortou deixou um recado pintado na porta do galpão: um número de telefone e um nome.',
    '**SABLE**',
    'Ela atende no primeiro toque, de uma praça perto do galpão, e quando você chega está sentada no banco com o pé em cima de uma das gaiolas.',
    fala('Sable', 'A rede é pequena. Pequena demais pra ter duas cabeças em Fuchsia. Eu vim ver qual é a sua.')
  ],
  escolhas:[
    {texto:'Pegar a carga de volta na briga.',
     luta:{classe:'Chefe de célula', nome:'Sable', rosto:'trainers/rede_recruta_f', times:[88, 109, 41, 23], tam:4, acima:1, vilao:true,
       antes:[fala('Sable', 'Eu esperava que você dissesse isso.')],
       vence:'"Fuchsia é minha. Diz pro Mercer."', perde:'"Leva. Por hoje."',
       perdeu:['Sable sobe a carga numa caminhonete sem placa e vai embora devagar, pra você ver.']},
     conf:3, ef:{dinheiro:1500, rep:{eixo:'ruim', delta:1, motivo:'Tomou de volta uma carga da rede em Fuchsia'},
       npc:{nome:'Sable', opiniao:-2, memoria:'Você tomou dela a carga de terça, numa praça de Fuchsia.'}},
     resultado:['Sable levanta do banco, devolve a chave da caminhonete e sai andando.', fala('Sable', 'Da próxima eu corto a lona do lado de lá.', 'frio')]},
    {texto:'Propor que ela trabalhe pra você em vez de contra.',
     teste:{status:'carisma', dificuldade:8, nomeStatus:'Carisma', eixo:'simpatia'},
     bom:{conf:3, ef:{dinheiro:800, npc:{nome:'Sable', opiniao:2, memoria:'Você ofereceu a ela um turno em vez de uma briga.'}},
       resultado:[fala('Sable', 'Turno de quinta. E eu escolho quem dirige.'), 'Ela aperta a sua mão com a mão que estava em cima da gaiola.']},
     ruim:{conf:1,
       luta:{classe:'Chefe de célula', nome:'Sable', rosto:'trainers/rede_recruta_f', times:[88, 109, 41, 23], tam:4, acima:1, vilao:true,
         antes:[fala('Sable', 'Trabalhar pra você. Que gracinha.'), 'Ela tira o pé da gaiola.'],
         vence:'"Fuchsia é minha. Diz pro Mercer."', perde:'"Leva. Por hoje."',
         perdeu:['Sable sobe a carga numa caminhonete sem placa e vai embora devagar, pra você ver.']},
       ef:{dinheiro:1500}, conf:2,
       resultado:['Sable levanta do banco, devolve a chave da caminhonete e sai andando.']}},
    {texto:'Deixar a carga com ela e dizer ao Mercer que não achou ninguém.', conf:-3,
     ef:{rep:{eixo:'bom', delta:1, motivo:'Deixou duas células da rede brigarem entre si'}},
     resultado:['Sable ri, de verdade, pela primeira vez.', fala('Sable', 'Você vai durar pouco aqui. Isso é um elogio.'), 'Mercer escuta a sua história sem tirar o cigarro da boca, e não pergunta nada. Isso é pior.']}
  ]
},
{
  id:'batida', escalao:4, local:'vermilion', titulo:'A batida do cais',
  texto:[
    'Um bilhete por baixo da porta do armário 14, com letra de quem escreve rápido.',
    '**AMANHÃ, CINCO DA MANHÃ, ARMAZÉM DO FIM DO CAIS. POLÍCIA.**',
    'Dentro do armazém, hoje, tem onze gaiolas e um caminhão que só chega às seis.',
    'O oficial que vai chefiar a batida já está no cais, sozinho, de folga e de jaqueta, olhando o armazém do outro lado da água com um copo de café.'
  ],
  escolhas:[
    {texto:'Avisar a rede e segurar o oficial até o caminhão passar.',
     luta:{classe:'Oficial', nome:'Rourke', rosto:'overworld/policial', times:[17, 66, 125, 58], tam:4, acima:1,
       antes:['Você atravessa o cais e para do lado dele.', fala('Oficial Rourke', 'Eu sei o que você é. Senta, que eu também sei o que você vai fazer.'), 'Ele termina o café, joga o copo no lixo e não erra.'],
       vence:'"Cinco da manhã. Você vai estar lá dentro."', perde:'"Vai. Leva as onze. A gente se vê."',
       perdeu:['De madrugada, a viatura chega antes do caminhão. Você vê de longe, do outro lado da água, as gaiolas saindo uma por uma.']},
     conf:3, ef:{dinheiro:1800, rep:{eixo:'ruim', delta:2, motivo:'Segurou a polícia até a carga da rede sair do cais'},
       npc:{nome:'Rourke', opiniao:-4, memoria:'Você segurou ele no cais até o caminhão da rede passar.'}},
     resultado:['Às cinco, a polícia abre um armazém vazio, varrido, com cheiro de desinfetante.', 'Rourke fica na porta um tempo, depois olha pro cais, como quem procura alguém.']},
    {texto:'Avisar a rede, mas deixar as gaiolas lá dentro pra polícia achar.',
     teste:{status:'intelecto', dificuldade:8, nomeStatus:'Intelecto', eixo:'discricao'},
     bom:{conf:1, ef:{moral:3, rep:{eixo:'bom', delta:2, motivo:'Deixou a polícia achar onze gaiolas da rede'}},
       resultado:['Você diz pra rede que o caminhão atrasou. Às cinco, a polícia abre o armazém e acha onze gaiolas e ninguém.', 'Na rede, a culpa vai pro motorista. Você não corrige.']},
     ruim:{conf:-3, ef:{moral:3, rep:{eixo:'bom', delta:2, motivo:'Deixou a polícia achar onze gaiolas da rede'}},
       resultado:['Às cinco, a polícia acha as onze gaiolas. Às sete, o Mercer te liga.', fala('Mercer', 'O caminhão chegou às seis. Você disse que atrasou.', 'frio')]}},
    {texto:'Não avisar ninguém.', conf:-4, ef:{moral:4, rep:{eixo:'bom', delta:3, motivo:'Deixou a batida do cais acontecer'}},
     resultado:['Você dorme mal e acorda às cinco com a sirene do outro lado da água.', 'Onze gaiolas, um motorista e uma pessoa de uniforme preto que você conhecia de vista. O armário 14 não abre por uma semana.']}
  ]
},
{
  id:'novato', escalao:4, local:'celadon', titulo:'O recruta novo',
  texto:[
    'No subsolo tem um garoto de catorze anos esperando no banco, de mochila nas costas, com um Rattata no colo.',
    'O nome dele está escrito à caneta num papel que o Mercer deixou na mesa: **PIP. VÊ SE SERVE.**',
    fala('Pip', 'Me disseram que aqui dá pra ganhar dinheiro pra mandar pra casa. Eu faço qualquer coisa.')
  ],
  escolhas:[
    {texto:'Testar o garoto numa luta, como te testaram.',
     luta:{classe:'Recruta', nome:'Pip', rosto:'trainers/rede_recruta_m', times:[19, 41, 23], tam:3, acima:-5, vilao:true,
       antes:[fala('Pip', 'Agora? Tá. Tá bom.'), 'Ele põe o Rattata no chão com cuidado, como se fosse de vidro.'],
       vence:'"Eu sirvo?"', perde:'"Eu sirvo?"',
       perdeu:[fala('Pip', 'Eu... ganhei?'), 'Mercer, encostado na porta, anota alguma coisa e não é sobre o garoto.']},
     conf:2, ef:{rep:{eixo:'ruim', delta:1, motivo:'Testou um garoto de catorze anos pra rede'},
       npc:{nome:'Pip', opiniao:1, memoria:'Você testou ele no subsolo, como alguém testou você.'}},
     resultado:[fala('Pip', 'Eu sirvo?'), 'Você diz que sim. Ele sorri com a boca inteira e vai embora pela porta de serviço com o Rattata no ombro e um envelope no bolso.']},
    {texto:'Mandar o garoto pra casa e dizer ao Mercer que ele não serviu.', conf:-1,
     ef:{rep:{eixo:'bom', delta:2, motivo:'Mandou pra casa um garoto que queria entrar na rede'},
       npc:{nome:'Pip', opiniao:-1, memoria:'Você mandou ele embora do subsolo sem nem deixar tentar.'}},
     resultado:[fala('Pip', 'Mas eu nem...'), 'Você diz que não. Ele pega a mochila devagar, como quem espera ser chamado de volta, e você não chama.']},
    {texto:'Aceitar o garoto sem teste nenhum.', conf:1, ef:{rep:{eixo:'ruim', delta:2, motivo:'Pôs um garoto de catorze anos na rede'}},
     resultado:['Pip recebe o envelope com as duas mãos.', 'Na saída, ele se vira pra perguntar o seu nome. Você diz outro.']}
  ]
},
/* ---------- Executivo ---------- */
{
  id:'laboratorio', escalao:5, local:'celadon', titulo:'O pedido do laboratório',
  texto:[
    'Um homem de jaleco espera na sala sem janela, com uma prancheta e a paciência de quem não precisa de ninguém pra continuar.',
    fala('Cientista Odran', 'Odran. Eu peço seis por mês, sempre seis, e o seu antecessor nunca perguntou pra quê.'),
    fala('Cientista Odran', 'Preciso da sua assinatura aqui. Só aqui.'),
    'Na prancheta, uma lista de espécies e uma coluna escrita "resistência".'
  ],
  escolhas:[
    {texto:'Assinar.', conf:3, ef:{dinheiro:3000, rep:{eixo:'ruim', delta:3, motivo:'Assinou o pedido do laboratório da rede'}},
     resultado:['Odran destaca a folha com cuidado, sem rasgar a margem.', fala('Cientista Odran', 'Até o mês que vem.'), 'Seis gaiolas descem a escada naquela mesma noite.']},
    {texto:'Perguntar pra quê.',
     luta:{classe:'Cientista', nome:'Odran', rosto:'trainers/scientist', times:[109, 137, 100, 81], tam:4, acima:2,
       antes:[fala('Cientista Odran', 'O seu antecessor nunca perguntou. Ele sabia que a pergunta tem preço.'), 'Ele pousa a prancheta e solta as Pokébolas na ordem da lista.'],
       vence:'"Assina."', perde:'"Pra saber quanto aguentam. Satisfeit{o|a}?"',
       perdeu:['Você assina com a mão tremendo. Odran destaca a folha sem rasgar a margem.']},
     conf:0, ef:{rep:{eixo:'bom', delta:2, motivo:'Fez o laboratório da rede responder o que faz'},
       npc:{nome:'Odran', opiniao:-3, memoria:'Você perguntou pra que serve a lista, e não assinou.'}},
     resultado:['Odran recolhe as Pokébolas na ordem da lista e não repete a resposta.', 'Você rasga a folha no meio. Ele não tenta impedir, só anota a hora no relógio.']},
    {texto:'Assinar com um nome que não é o seu.',
     teste:{status:'sorte', dificuldade:7, nomeStatus:'Sorte'},
     bom:{conf:2, ef:{dinheiro:3000, flag:'rede_assinou_falso'},
       resultado:['Odran não confere a assinatura. Ninguém confere assinatura de executivo.', 'Seis gaiolas descem a escada naquela noite, e o pedido tem o nome de uma pessoa que não existe.']},
     ruim:{conf:-2,
       resultado:['Odran olha a assinatura, olha você.', fala('Cientista Odran', 'Eu sei como você se chama. Assina de novo.'), 'Você assina de novo, com o seu nome.']}}
  ]
},
{
  id:'comprador', escalao:5, local:'celadon', titulo:'O comprador do terno claro',
  texto:[
    'O comprador chega pela porta do shopping, de terno claro e sapato que não pisou em cimento a vida inteira.',
    fala('Sr. Quinlan', 'Quinlan. Eu quero o Dratini do lote quarenta. Só ele. Pago o que pedirem, desde que peçam rápido.'),
    'O Dratini do lote quarenta está numa caixa d\'água de plástico no canto do subsolo, enrolado em si mesmo, de olho aberto.'
  ],
  escolhas:[
    {texto:'Vender pelo preço da tabela.', conf:2, ef:{dinheiro:3500, rep:{eixo:'ruim', delta:2, motivo:'Vendeu um Dratini da rede pra um colecionador'}},
     resultado:['Quinlan paga em dinheiro, conta duas vezes e leva a caixa d\'água inteira, com Dratini e tudo, no porta-malas.']},
    {texto:'Dobrar o preço na cara dele.',
     luta:{classe:'Sr.', nome:'Quinlan', rosto:'trainers/gentleman', times:[53, 22, 115, 148, 131], tam:4, acima:1,
       antes:[fala('Sr. Quinlan', 'Eu não pago o dobro. Eu pago o que pedirem a quem merece pedir.'), 'Ele tira as luvas, um dedo de cada vez.'],
       vence:'"Pelo preço da tabela, então."', perde:'"O dobro. Você mereceu pedir."',
       perdeu:['Quinlan paga o preço da tabela e leva a caixa d\'água no porta-malas.']},
     conf:3, ef:{dinheiro:7000, rep:{eixo:'ruim', delta:2, motivo:'Vendeu um Dratini da rede pelo dobro'}},
     resultado:['Quinlan paga o dobro, sorrindo pela primeira vez, e leva a caixa d\'água no porta-malas.', 'Corbin, quando sabe, só diz "o dobro" e volta a lixar a unha.']},
    {texto:'Dizer que o Dratini morreu de noite, e soltar ele no canal de madrugada.',
     teste:{status:'carisma', dificuldade:8, nomeStatus:'Carisma', eixo:'discricao'},
     bom:{conf:0, ef:{moral:4, rep:{eixo:'bom', delta:3, motivo:'Soltou no canal um Dratini que a rede ia vender'}},
       resultado:['Quinlan põe as luvas de volta e vai embora sem raiva, como quem perde leilão.', 'De madrugada, o Dratini escorrega da caixa pro canal e some sem fazer onda.']},
     ruim:{conf:-4, ef:{moral:4, rep:{eixo:'bom', delta:3, motivo:'Soltou no canal um Dratini que a rede ia vender'}},
       resultado:['O Dratini some no canal.', 'De manhã, Corbin te mostra a foto da câmera do estacionamento, com você e a caixa d\'água. Ele não diz nada. Lixa a unha.']}}
  ]
},
{
  id:'armario', escalao:5, local:'vermilion', titulo:'O armário 14, do outro lado',
  texto:[
    'Corbin te entrega um envelope pardo, uma chave pequena e um nome escrito num papel.',
    fala('Corbin', 'Agora é você que escolhe quem recebe o envelope. É assim que a rede cresce: de dentro.'),
    'O nome é de alguém de quinze anos que foi recusado no balcão de licença do Centro de Vermilion, duas vezes, por falta de documento.',
    'O armário 14 é o mesmo. A chave abre do mesmo jeito.'
  ],
  escolhas:[
    {texto:'Pôr o envelope no armário.', conf:2, ef:{rep:{eixo:'ruim', delta:2, motivo:'Pôs o envelope da rede no armário de alguém de quinze anos'}},
     resultado:['Você tranca o armário e vai embora sem olhar o bebedouro.', 'Três dias depois, o envelope não está mais lá.']},
    {texto:'Pôr um envelope vazio.', conf:-1,
     resultado:['Três dias depois, o envelope vazio continua lá. Uma semana depois, alguém escreveu a lápis no lado de fora: "?".']},
    {texto:'Ir até o balcão de licença e pagar o documento que falta. (500 ₽)', cond:d => d.jogador.dinheiro >= 500, conf:-2,
     ef:{dinheiro:-500, rep:{eixo:'bom', delta:2, motivo:'Pagou o documento de quem a rede ia recrutar'}},
     resultado:['A atendente carimba a folha e não pergunta por que você está pagando o documento de outra pessoa.', 'O envelope pardo volta fechado pro bolso do Corbin. Ele não pergunta. Ele sabe.']}
  ]
}
];

/* ============================================================
   O MOTOR
   ============================================================ */
function provaDaRede(id){ return PROVAS_DA_REDE[id] || null; }
function provaVencida(d, id){ return !!(d && d.rede && d.rede.provas && d.rede.provas[id] && d.rede.provas[id].venceu); }
function servicoDaRede(id){ return SERVICOS_DA_REDE.find(s => s.id === id) || null; }

const Rede = {
  reg(){
    const d = Estado.dados;
    if (!d.rede){
      /* save de antes do escalão: quem aceitou o lugar à mesa já veste o preto */
      const vestido = !!d.flags.ln_rocket_dentro;
      d.rede = Object.assign(this.novoRegistro(), {escalao: vestido ? 2 : 1, fora:!!d.flags.largou_rocket});
      if (vestido && !Estado.contaItem(ESCALOES[1].item)) Estado.darItem(ESCALOES[1].item, 1);
      if (vestido && typeof Cargos !== 'undefined' && Cargos.principal()) Estado.j.cargo = Cargos.principal().nome;
    }
    return d.rede;
  },
  novoRegistro(){
    return {escalao:1, pontos:0, servicos:{}, provas:{}, ultimoServico:null, fora:false};
  },
  /* está dentro: tem o posto e a rede não te largou */
  dentro(d){
    d = d || Estado.dados;
    if (!d || typeof Cargos === 'undefined') return false;
    return Cargos.tem('rocket') && !(d.rede && d.rede.fora);
  },
  escalao(d){
    d = d || (typeof Estado !== 'undefined' ? Estado.dados : null);
    if (!d) return 1;
    if (!d.rede) return d.flags && d.flags.ln_rocket_dentro ? 2 : 1;
    return Math.max(1, Math.min(ESCALOES.length, d.rede.escalao || 1));
  },
  degrau(n){ return ESCALOES[Math.max(1, Math.min(ESCALOES.length, n)) - 1]; },
  atual(d){ return this.degrau(this.escalao(d)); },
  proximo(d){ const n = this.escalao(d); return n < ESCALOES.length ? this.degrau(n + 1) : null; },

  /* a confiança: o que a rede viu na história mais o que os serviços somaram */
  confianca(d){
    d = d || Estado.dados;
    let c = (d.rede && d.rede.pontos) || 0;
    for (const [f, v] of Object.entries(CONFIANCA_DAS_MARCAS)) if (d.flags[f]) c += v;
    return c;
  },

  /* o posto lê daqui: nome, renda, desconto e peso do degrau */
  nomeDoPosto(){ return this.atual().nome; },
  beneficios(){
    const e = this.atual();
    return {renda:e.renda, loja:e.loja, repRuim:1};
  },

  /* ── subir ── */
  podeSubir(d){
    d = d || Estado.dados;
    const p = this.proximo(d);
    if (!p || !this.dentro(d)) return {ok:false, p};
    const falta = [];
    if (this.confianca(d) < p.conf) falta.push('confianca');
    if (d.capitulo < p.cap) falta.push('cap');
    return {ok:!falta.length, p, falta};
  },
  /* a voz pode dar o preto sem prova (o lugar à mesa, na linha) */
  promoverPelaVoz(){
    /* a marca do lugar à mesa acabou de ser gravada: aqui não é save
       antigo, então o registro nasce no degrau 1 e a promoção acontece */
    const d = Estado.dados;
    if (!d.rede) d.rede = this.novoRegistro();
    const r = d.rede;
    if (!this.dentro() || r.escalao >= 2) return [];
    return this.promover(2, 'A voz do outro lado te deu o preto.');
  },
  promover(n, porque){
    const r = this.reg();
    const e = this.degrau(n);
    r.escalao = n;
    const avisos = [{tipo:'item', texto:`Você agora é ${e.nome} da rede.`}];
    if (e.item){ Estado.darItem(e.item, 1); avisos.push({tipo:'item', texto:`Recebeu: ${e.item}.`}); }
    if (typeof Cargos !== 'undefined'){ const c = Cargos.principal(); if (c) Estado.j.cargo = c.nome; }
    const m = Estado.mudarRep('ruim', 1, `Subiu na rede: ${e.nome.replace(/\{([^|}]*)\|[^}]*\}/, '$1')}`);
    if (m && m.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${m.de} → ${m.para}`});
    avisos.push({tipo:'info', texto:`A rede passa a pagar ${fmtDin(e.renda)} ₽ por capítulo.`});
    Estado.marcar('rede_escalao_' + n);
    Estado.registrar(porque || `Subiu na rede: ${e.nome}.`);
    return avisos;
  },

  /* a rede larga quem não confia mais */
  conferir(){
    const d = Estado.dados;
    if (!this.dentro(d)) return [];
    if (this.confianca(d) > CONFIANCA_EXPULSA) return [];
    this.reg().fora = true;
    Cargos.largar('rocket');
    Estado.marcar('rede_largou_voce');
    Estado.registrar('A rede parou de ligar.');
    return [{tipo:'dano', texto:'O aparelho do envelope para de tocar. O armário 14 não abre mais com a sua chave.'}];
  },

  /* ── o que aparece na lista do lugar ── */
  afazeres(localId){
    const d = Estado.dados;
    if (!d || !this.dentro(d)) return [];
    const P = PONTOS_DA_REDE[localId];
    if (!P || this.escalao(d) < P.desde) return [];
    return [{lugar:true, id:'rede', titulo:P.titulo, sub:P.sub}];
  },

  servicosAqui(localId){
    const d = Estado.dados, r = this.reg(), n = this.escalao(d);
    return SERVICOS_DA_REDE.filter(s => s.local === localId && !r.servicos[s.id]
      && n >= s.escalao && n <= s.escalao + 1);
  },
  /* dias até o próximo serviço (0 = já pode) */
  esperaServico(){
    const r = this.reg(), dia = Estado.dados.relogio.dia;
    if (r.ultimoServico == null) return 0;
    return Math.max(0, r.ultimoServico + SERVICO_ESPERA_DIAS - dia);
  },
  provaAqui(localId){
    const s = this.podeSubir();
    if (!s.p || !s.p.prova) return null;
    const pv = provaDaRede(s.p.prova);
    return pv && pv.local === localId ? pv : null;
  },
  esperaProva(id){
    const r = this.reg(), x = r.provas[id];
    if (!x || x.dia == null) return 0;
    return Math.max(0, x.dia + PROVA_ESPERA_DIAS - Estado.dados.relogio.dia);
  },

  /* o retrato de quem você é na rede: o envelope não tem uniforme */
  retrato(){
    const e = this.atual();
    if (!e.uniforme || typeof caminhoNPC !== 'function') return null;
    const mulher = Estado.j && Estado.j.genero === 'Mulher';
    return caminhoNPC('trainers/' + e.uniforme[mulher ? 1 : 0]);
  },

  /* ── a tela do ponto ── */
  tela(avisos){
    const d = Estado.dados;
    if (!this.dentro(d)) return Exploracao.tela(avisos);
    /* escolheu a briga e saiu antes (recarregou, foi ao mapa): ela continua ali */
    if (this.reg().pendente) return this.telaPendente(avisos);
    const id = Mundo.id(), P = PONTOS_DA_REDE[id] || {titulo:'A rede'};
    const e = this.atual(), prox = this.proximo(), conf = this.confianca();
    const alvo = prox ? prox.conf : e.conf;
    const base = e.conf;
    const pct = prox ? Math.max(0, Math.min(100, Math.round((conf - base) / Math.max(1, alvo - base) * 100))) : 100;
    const img = this.retrato();
    const esc = s => UI.esc(txt(s));

    const escada = ESCALOES.map(x => `<li class="rede-degrau${x.n === e.n ? ' atual' : ''}${x.n < e.n ? ' feito' : ''}">
        <span class="rede-pino" aria-hidden="true">${pinoDaRede(x.n)}</span>
        <span class="rede-nome">${esc(x.nome)}</span></li>`).join('');

    /* o que falta pro próximo degrau, sem contar o que fazer */
    let proxTxt = 'Não tem degrau acima deste. Acima daqui tem só a mesa de cima.';
    if (prox){
      const s = this.podeSubir();
      if (s.ok){
        const pv = provaDaRede(prox.prova);
        proxTxt = pv.local === id ? `${pv.nome} está esperando por você aqui.`
          : `${pv.porta}, em ${LOCAIS[pv.local].nome}.`;
      } else if (s.falta.includes('cap')) proxTxt = 'Ninguém sobe tão rápido. Ainda não é hora.';
      else proxTxt = 'Ainda não confiam em você o bastante.';
    }

    const botoes = [];
    const pv = this.provaAqui(id);
    if (pv){
      const w = this.esperaProva(Object.keys(PROVAS_DA_REDE).find(k => PROVAS_DA_REDE[k] === pv));
      if (w) botoes.push({texto:`${pv.nome} não te recebe hoje`, acao:'', off:true});
      else botoes.push({texto:pv.porta, acao:`Rede.abordarProva('${Object.keys(PROVAS_DA_REDE).find(k => PROVAS_DA_REDE[k] === pv)}')`});
    }
    const servs = this.servicosAqui(id);
    const espera = this.esperaServico();
    if (servs.length && !espera) servs.forEach(s => botoes.push({texto:s.titulo, acao:`Rede.servico('${s.id}')`}));
    botoes.push({texto:'Ir embora', acao:'Exploracao.tela()'});

    let nota = '';
    if (servs.length && espera) nota = `Nada pra você hoje. Volta daqui a ${espera} dia${espera > 1 ? 's' : ''}.`;
    else if (!servs.length && !pv) nota = 'Hoje não tem nada aqui com o seu nome.';

    UI.limpar();
    UI.add(UI.topo());
    UI.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">A rede</div>
        <div class="tit">${esc(P.titulo)}</div>
        <div class="loc">${esc(LOCAIS[id] ? LOCAIS[id].nome : '')}</div>
      </div>
      <div class="rede-ficha">
        <div class="rede-retrato${img ? '' : ' sem'}">
          ${img ? `<img src="${img}" alt="" onerror="this.remove()">` : '<span class="silhueta" aria-hidden="true"></span>'}
        </div>
        <div class="rede-dados">
          <div class="rede-sub">Escalão</div>
          <div class="rede-titulo">${esc(e.nome)}</div>
          <div class="rede-insignia">${esc(e.insignia)}</div>
          <div class="rede-conf">
            <div class="rede-conf-rot"><span>Confiança</span><span class="mono">${conf}${prox ? ' / ' + alvo : ''}</span></div>
            <div class="rede-barra${conf < 0 ? ' baixa' : ''}"><i style="width:${pct}%"></i></div>
          </div>
          <div class="rede-prox">${esc(proxTxt)}</div>
        </div>
        <ol class="rede-escada">${escada}</ol>
      </div>
      ${nota ? `<p class="sussurro">${esc(nota)}</p>` : ''}
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas" style="margin-top:14px">
        ${botoes.map(b => `<button class="escolha"${b.off ? ' disabled' : ''} onclick="${b.acao}">${esc(b.texto)}</button>`).join('')}
      </div>
    </div>`);
    if (avisos && avisos.length) UI.avisos(avisos);
    UI.rolarTopo();
  },

  /* ── serviço ── */
  servico(id){
    const s = servicoDaRede(id);
    if (!s) return this.tela();
    const d = Estado.dados;
    const botoes = s.escolhas.map((e, i) => ({e, i})).filter(x => { try { return !x.e.cond || x.e.cond(d); } catch(err){ return false; } })
      .map(x => ({texto:x.e.texto, acao:`Rede.escolher('${id}', ${x.i})`}));
    UI.telaConversa({num:'A rede', titulo:s.titulo, loc:LOCAIS[s.local].nome,
      quem:s.quem || null, falas:s.texto.map(t => typeof t === 'function' ? t(d) : t), botoes});
  },

  escolher(id, i){
    const s = servicoDaRede(id);
    const esc = s && s.escolhas[i];
    if (!esc) return this.tela();
    const r = this.reg();
    r.servicos[id] = true;
    r.ultimoServico = Estado.dados.relogio.dia;
    Mundo.passar(1);
    let ramo = esc, avisos = [];
    if (esc.teste){
      const t = esc.teste;
      const valor = Estado.j.status[t.status] || 0;
      const rol = t.eixo ? Dados.testeComTime(valor, t.dificuldade, t.nomeStatus, t.eixo)
                         : Dados.teste(valor, t.dificuldade, t.nomeStatus);
      const passou = rol.grau === 'sucesso' || rol.grau === 'critico';
      ramo = (passou ? esc.bom : esc.ruim) || {};
      if (rol.linhaTime) avisos.push({tipo:'natureza', texto:rol.linhaTime});
      avisos.push({tipo:'info', texto:`${t.nomeStatus}: ${Dados.contaDoTeste ? Dados.contaDoTeste(rol) : rol.texto}`});
    }
    if (ramo.luta){
      r.pendente = {tipo:'servico', id, i, ramo: ramo === esc ? null : (ramo === esc.bom ? 'bom' : 'ruim'), avisos};
      Estado.salvar('auto');
      return this.telaPendente();
    }
    return this.fecharServico(s, ramo, avisos);
  },

  /* a briga que a escolha comprou: a cena de antes e o botão de lutar,
     sem volta — escolher já foi o compromisso */
  telaPendente(extra){
    const a = this.reg().pendente;
    const s = a && servicoDaRede(a.id);
    const L = a && this.definicaoDaLuta(a);
    if (!L){ this.reg().pendente = null; return this.tela(extra); }
    const d = Estado.dados;
    UI.telaConversa({num:'A rede', titulo:s.titulo, loc:LOCAIS[s.local].nome,
      falas:(L.antes || []).map(t => typeof t === 'function' ? t(d) : t),
      avisos:(a.avisos || []).concat(extra || []),
      botoes:[{texto:'Lutar', acao:'Rede.lutarPendente()'}]});
  },
  lutarPendente(){
    const r = this.reg(), a = r.pendente;
    if (!a) return this.tela();
    if (!Estado.primeiroApto()) return UI.modal('A rede', '<p class="nada">Nenhum Pokémon em pé. Cure o time antes.</p>');
    r.pendente = null;
    this.lutar(Object.assign({}, a, {avisos:[]}));
  },

  /* aplica o que a escolha (ou o ramo) dá e mostra o resultado */
  fecharServico(s, ramo, avisos, falas){
    const r = this.reg();
    r.pontos = (r.pontos || 0) + (ramo.conf || 0);
    if (ramo.ef) avisos = avisos.concat(Historia.aplicar(ramo.ef) || []);
    if (ramo.conf) avisos.push({tipo:ramo.conf > 0 ? 'rep' : 'dano', texto:`Confiança da rede ${ramo.conf > 0 ? '+' : ''}${ramo.conf}.`});
    Estado.registrar(`Rede: ${s.titulo}.`);
    avisos = avisos.concat(this.conferir());
    Estado.salvar('auto');
    const d = Estado.dados;
    Jogo.resolverPendencias(() => UI.telaConversa({
      num:'A rede', titulo:s.titulo, loc:LOCAIS[s.local].nome, quem:s.quem || null,
      falas:(falas || ramo.resultado || []).map(t => typeof t === 'function' ? t(d) : t), avisos,
      botoes: this.dentro() ? [{texto:'Voltar ao ponto', acao:'Rede.tela()'}, {texto:'Seguir', acao:'Exploracao.tela()'}]
                            : [{texto:'Seguir', acao:'Exploracao.tela()'}]
    }));
  },

  /* ── prova ── */
  abordarProva(id){
    const pv = provaDaRede(id);
    if (!pv) return this.tela();
    const r = this.reg();
    const primeira = !(r.provas[id] && r.provas[id].conheceu);
    r.provas[id] = Object.assign(r.provas[id] || {}, {conheceu:true});
    const d = Estado.dados;
    UI.telaConversa({num:'A rede', titulo: primeira ? pv.classe : pv.nome, loc:LOCAIS[pv.local].nome,
      falas:(primeira ? pv.apresenta : pv.volta).map(t => typeof t === 'function' ? t(d) : t),
      botoes:[{texto:'Aceitar a prova', acao:`Rede.lutar({tipo:'prova', id:'${id}'})`}, {texto:'Agora não', acao:'Rede.tela()'}]});
  },

  /* ── luta: prova ou serviço ── */
  definicaoDaLuta(a){
    if (a.tipo === 'prova') return provaDaRede(a.id);
    const s = servicoDaRede(a.id), esc = s && s.escolhas[a.i];
    if (!esc) return null;
    return (a.ramo ? esc[a.ramo] : esc).luta;
  },
  nomeDaLuta(L){ return `${L.classe} ${L.nome}`; },
  lutar(a){
    const L = this.definicaoDaLuta(a);
    const meu = Estado.primeiroApto();
    if (!L) return this.tela();
    if (!meu) return UI.modal('A rede', '<p class="nada">Nenhum Pokémon em pé. Cure o time antes.</p>');
    const local = a.tipo === 'prova' ? L.local : servicoDaRede(a.id).local;
    const base = ((LOCAIS[local] || {}).nivel || 20) + 2;
    const nv = Math.min(85, Math.max(base, nivelDeReferencia()) + (L.acima || 0));
    const time = timeDeLinhas(L.times, nv, Math.min(L.tam, L.times.length), L.golpes, a.tipo === 'prova' ? 90 : 70);
    if (a.tipo === 'prova') Mundo.passar(1);
    time.forEach(x => { x.nomeAnunciado = true; });
    Jogo.cenaBatalha = null; Jogo.ginasioAtual = null; Jogo.eliteAtual = null;
    Jogo.torneioAtual = null; Jogo.rivalAtual = null; Jogo.revancheAtual = null; Jogo.estradaAtual = null;
    Jogo.conferenciaAtual = null; Jogo.veteranoAtual = null;
    Jogo.redeAtual = {tipo:a.tipo, id:a.id, i:a.i, ramo:a.ramo || null, avisos:a.avisos || [], vilao:a.tipo === 'prova' || !!L.vilao};
    Jogo.batalhaLivre = true;
    UI.limparDados();
    const nome = this.nomeDaLuta(L);
    Batalha.iniciar(meu, time[0], {
      tipo:'treinador', fuga:false, treinador:nome,
      timeInimigo:time.slice(1), revelarNatureza:a.tipo === 'prova',
      erroIA: a.tipo === 'prova' ? ERRO_IA_VETERANO : undefined, vontadeIA: a.tipo === 'prova',
      introducao:`${nome} enviou ${nomeVisivel(time[0])} (Nv ${time[0].nivel})!`
    });
    UI.telaBatalha([`${nome} quer lutar!`]);
  },

  premio(){
    const a = Jogo.redeAtual;
    if (!a || a.tipo !== 'prova') return 0;
    const L = this.definicaoDaLuta(a);
    const nivel = (Batalha.inimigo && Batalha.inimigo.nivel) || 1;
    return Math.round(pagaPorNivel(this.nomeDaLuta(L)) * nivel * PAGA_PROVA * (Batalha.bonusDinheiro || 1));
  },
  citacao(venceu){
    const a = Jogo.redeAtual;
    const L = a && this.definicaoDaLuta(a);
    if (!L) return null;
    return `${L.nome}: ${txt(venceu ? L.perde : L.vence)}`;
  },

  resultado(fim){
    const a = Jogo.redeAtual;
    Jogo.redeAtual = null;
    Jogo.batalhaLivre = false;
    if (fim.resultado === 'gameover') return UI.telaGameOver('Você caiu num serviço da rede. Ninguém da rede foi ao enterro.');
    if (!a) return Exploracao.tela();
    const venceu = fim.resultado === 'vitoria' || fim.resultado === 'captura';
    const L = this.definicaoDaLuta(a);
    const r = this.reg();

    if (a.tipo === 'prova'){
      const pv = provaDaRede(a.id);
      const x = r.provas[a.id] = Object.assign(r.provas[a.id] || {}, {});
      let avisos = [];
      if (venceu){
        const valor = this.premio();
        Estado.j.dinheiro += valor;
        if (valor) avisos.push({tipo:'item', texto:`Você venceu ${this.nomeDaLuta(L)}. +${fmtDin(valor)} ₽`});
        x.venceu = true;
        avisos = avisos.concat(this.promover(pv.escalao, `Venceu ${pv.nome} e subiu na rede: ${this.degrau(pv.escalao).nome}.`));
        Estado.salvar('auto');
        return Jogo.resolverPendencias(() => UI.telaConversa({
          num:'A rede', titulo:pv.nome, loc:LOCAIS[pv.local].nome, falas:pv.depois.map(t => typeof t === 'function' ? t(Estado.dados) : t), avisos,
          botoes:[{texto:'Voltar ao ponto', acao:'Rede.tela()'}, {texto:'Seguir', acao:'Exploracao.tela()'}]
        }));
      }
      x.derrotas = (x.derrotas || 0) + 1;
      x.dia = Estado.dados.relogio.dia;
      Estado.registrar(`Perdeu a prova da rede para ${pv.nome}.`);
      Estado.salvar('auto');
      return Jogo.resolverPendencias(() => Exploracao.tela([{tipo:'dano', texto:`${pv.nome} venceu. A prova volta a valer daqui a ${PROVA_ESPERA_DIAS} dia.`}]));
    }

    /* serviço */
    const s = servicoDaRede(a.id), esc = s.escolhas[a.i];
    const ramo = a.ramo ? esc[a.ramo] : esc;
    if (venceu) return this.fecharServico(s, ramo, a.avisos || []);
    return this.fecharServico(s, {conf:-1}, a.avisos || [], L.perdeu || []);
  }
};

/* o pino de cada degrau: o envelope, as divisas e a letra antiga */
function pinoDaRede(n){
  if (n === 1) return '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  /* a letra sozinha, grossa, sem moldura: num círculo ela virava ® */
  if (n === 5) return '<svg viewBox="0 0 24 24"><path d="M8 19.5V4.5h5.2a4 4 0 010 8H8m5 0l4.5 7" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  /* as divisas, empilhadas no meio do pino */
  const divisas = [], k = n - 1, y0 = 12 - ((k - 1) * 5 + 4) / 2;
  for (let j = 0; j < k; j++){
    const y = y0 + j * 5;
    divisas.push(`<path d="M5 ${y}l7 4 7-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
  return `<svg viewBox="0 0 24 24">${divisas.join('')}</svg>`;
}

/* rosto e nome de quem luta: pela classe, como os veteranos */
(function(){
  const lutas = Object.values(PROVAS_DA_REDE).slice();
  SERVICOS_DA_REDE.forEach(s => s.escolhas.forEach(e => {
    if (e.luta) lutas.push(e.luta);
    ['bom', 'ruim'].forEach(k => { if (e[k] && e[k].luta) lutas.push(e[k].luta); });
  }));
  lutas.forEach(L => {
    if (typeof NOMES_DA_HISTORIA !== 'undefined') NOMES_DA_HISTORIA.add(L.nome);
    if (typeof RETRATO_POR_NOME === 'undefined') return;
    RETRATO_POR_NOME[`${L.classe} ${L.nome}`] = L.rosto;
    RETRATO_POR_NOME[L.nome] = L.rosto;
  });
  /* quem fala nos serviços sem lutar */
  if (typeof RETRATO_POR_NOME !== 'undefined'){
    RETRATO_POR_NOME['Tilly'] = 'trainers/clerk_f';
    RETRATO_POR_NOME['Guarda Teague'] = 'overworld/policial';
    RETRATO_POR_NOME['Guarda-parque Ines'] = 'trainers/pokemon_ranger_f';
    RETRATO_POR_NOME['Oficial Rourke'] = 'overworld/policial';
    RETRATO_POR_NOME['Cientista Odran'] = 'trainers/scientist';
    RETRATO_POR_NOME['Sr. Quinlan'] = 'trainers/gentleman';
  }
  if (typeof NOMES_DA_HISTORIA !== 'undefined') NOMES_DA_HISTORIA.add('Tilly');
})();
