/* ------------------------------------------------------------
   ABERTURAS — a sala 704 é uma sala de reunião comum num prédio
   comum, e é por isso que o capítulo é o que é. Dá pra chegar
   nela pela banca de jornal, pelo elevador, pela farmácia do
   térreo ou pela porta, direto.
   ------------------------------------------------------------ */
const C20_ABERTURAS = ['c20_predio', 'c20_ab_a_banca', 'c20_ab_o_elevador', 'c20_ab_a_farmacia'];
function c20_cabe(id, d){ return true; }
function c20_abertura(d){
  const cand = C20_ABERTURAS.filter(id => c20_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 20 — A PRESIDENTE
   Sala comercial, sétimo andar, farmácia no térreo.
   ============================================================ */
CAPITULOS.push(
{
num:20, titulo:'A Presidente', local:'Saffron — sala 704', ambiente:'cidade', nivelArea:60,
tom:'muito sombrio', entradas:C20_ABERTURAS,
inicio: d => c20_abertura(d),
cenas:{

c20_ab_a_banca:{
  texto:[
    'Rua do Comércio, 118. Antes de entrar no prédio você para na banca de jornal da porta, porque você está adiando e porque banca de jornal é o melhor lugar do mundo pra adiar.',
    'O jornaleiro tem uns sessenta anos, um banquinho e um rádio pequeno tocando baixo.',
    d=>fala(d.jogador.nome, 'O senhor tá aqui há muito tempo?'),
    fala('o jornaleiro', 'Vinte e seis anos nessa esquina.'),
    d=>fala(d.jogador.nome, 'O senhor conhece o pessoal do sétimo andar?'),
    'Ele não pergunta por que você quer saber, o que é a gentileza dos jornaleiros.',
    fala('o jornaleiro', 'Sala 704? Conheço doze deles de vista.'),
    fala('o jornaleiro', 'Eles vêm uma vez por mês, numa terça, sempre de manhã.'),
    'Ele dobra um jornal pra um cliente sem parar de falar.',
    fala('o jornaleiro', 'Compram revista, compram bala, um deles compra charuto e depois joga fora sem fumar. Eu vi ele jogar fora duas vezes.'),
    fala('o jornaleiro', 'São gente normal, moço. É isso que eu ia te falar antes de você perguntar.')
  ],
  ef:{flag:'o_jornaleiro_da_118',
      npc:{nome:'o jornaleiro', opiniao:1, viuVoce:'Te contou do pessoal da 704 antes de você subir.'},
      registrar:'O conselho da sala 704 se reúne uma vez por mês, numa terça de manhã, há anos.',
      presagio:'"São gente normal." Ele disse isso antes de você perguntar como eles são.'},
  escolhas:[
    {texto:'Perguntar se ele sabe o que eles fazem.', vai:'c20_ab_o_que_eles_fazem'},
    {texto:'Perguntar quem é a mulher da cabeceira.', vai:'c20_ab_a_mulher_da_cabeceira'},
    {texto:'Subir.', vai:'c20_predio'}
  ]
},

c20_ab_o_que_eles_fazem:{
  texto:[
    fala('o jornaleiro', 'Sei lá. É uma sigla.'),
    'Ele coça a nuca.',
    fala('o jornaleiro', 'Já perguntei uma vez, faz uns dez anos, pra uma delas. Ela falou que é gestão de recurso.'),
    d=>fala(d.jogador.nome, 'Recurso de quê?'),
    fala('o jornaleiro', 'Foi exatamente o que eu perguntei.'),
    'Ele ri, e é um riso curto de quem lembra de uma coisa engraçada de dez anos atrás.',
    fala('o jornaleiro', 'Ela falou "recurso natural" e sorriu e comprou uma revista de palavra cruzada.'),
    'Ele volta a arrumar os jornais.',
    fala('o jornaleiro', 'E eu achei ótimo, porque recurso natural é árvore, é água. É coisa boa.', 'baixo'),
    fala('o jornaleiro', 'Eu achei isso por dez anos.')
  ],
  ef:{flag:'recurso_natural',
      registrar:'Uma conselheira da 704 descreveu o trabalho como "gestão de recurso natural".',
      presagio:'Recurso natural é uma categoria contábil. Cabe árvore, cabe água, e cabe outra coisa.'},
  escolhas:[
    {texto:'Perguntar quem é a mulher da cabeceira.', vai:'c20_ab_a_mulher_da_cabeceira'},
    {texto:'Subir.', vai:'c20_predio'}
  ]
},

c20_ab_a_mulher_da_cabeceira:{
  texto:[
    'Você descreve: cinquenta e poucos anos, tailleur cinza, senta na cabeceira.',
    'Ele sabe de quem você está falando antes de você terminar.',
    fala('o jornaleiro', 'A presidente. Ela vem a pé.'),
    d=>fala(d.jogador.nome, 'A pé?'),
    fala('o jornaleiro', 'A pé, de sacola de pano, todo mês. Ela mora a seis quadras.'),
    'Ele aponta com o queixo numa direção qualquer.',
    fala('o jornaleiro', 'Ela compra o mesmo jornal há não sei quantos anos e sempre paga contado e nunca pede troco arredondado.'),
    fala('o jornaleiro', 'Uma vez o filho dela ficou doente e ela me contou. Aí eu perguntei do menino no mês seguinte e ela ficou tão feliz que eu tinha lembrado que ela quase chorou.'),
    'Ele arruma uma pilha de revista.',
    fala('o jornaleiro', 'Eu tô te falando isso porque você tá com cara de quem vai subir e brigar com alguém.'),
    fala('o jornaleiro', 'Sobe. Mas sobe sabendo que ela é assim.')
  ],
  ef:{flag:'a_presidente_vem_a_pe',
      registrar:'A presidente do conselho vem a pé, de sacola de pano, e mora a seis quadras.',
      presagio:'Ninguém do outro lado dessa mesa vai parecer o que você precisa que ele pareça.'},
  escolhas:[
    {texto:'Subir.', vai:'c20_predio'},
    {texto:'Sentar na banca mais um pouco antes.', vai:'c20_ab_sentou_na_banca'}
  ]
},

c20_ab_sentou_na_banca:{
  texto:[
    'Ele te empresta o banquinho dele e fica em pé, o que você tenta recusar e não consegue.',
    'Você fica sentado na esquina da Rua do Comércio por uns vinte minutos, olhando a porta do 118.',
    'Nesses vinte minutos entram no prédio: dois entregadores, uma mulher com uma criança de colo, um homem de terno com pasta, três adolescentes de uniforme escolar e um senhor com um saco de pão.',
    'Nenhum deles parece nada.',
    'Você entende, sentado num banquinho emprestado, a coisa mais difícil deste capítulo: você veio preparado pra um esconderijo e vai entrar numa reunião.',
    'E não existe treino pra isso.'
  ],
  ef:{flag:'sentou_na_banca', hp:2,
      registrar:'Sentou vinte minutos na banca antes de subir.'},
  escolhas:[
    {texto:'Subir.', vai:'c20_predio'}
  ]
},

c20_ab_o_elevador:{
  texto:[
    'O elevador do 118 é de 1971 e demora, e a demora dele é parte da arquitetura do prédio: todo mundo que vai ao sétimo andar passa um minuto e quarenta parado no saguão.',
    'Você passa esse minuto e quarenta com outras três pessoas.',
    'Uma mulher com uma pasta de couro. Um homem com um saquinho de padaria. Uma moça com uma pilha de papel e uma caneta atrás da orelha.',
    'O elevador chega. Vocês quatro entram. A mulher da pasta aperta o sete sem perguntar a ninguém, e quando ela aperta o sete, o homem do saquinho de padaria não aperta nada.',
    'Nem a moça do papel.',
    'Três dos quatro vão pro sétimo andar. Só você não apertou nada.',
    'A moça do papel olha pro painel, depois pra você.',
    fala('a moça do papel', 'Sétimo também?'),
    'É a pergunta mais simples do mundo e você leva dois segundos pra responder.'
  ],
  ef:{flag:'subiu_no_elevador_com_eles',
      registrar:'Subiu no elevador do 118 com três pessoas do conselho.'},
  escolhas:[
    {texto:'"Sétimo."', vai:'c20_ab_disse_setimo'},
    {texto:'"Eu não sei ainda."', vai:'c20_ab_nao_sei_ainda'},
    {texto:'Não responder.', vai:'c20_predio'}
  ]
},

c20_ab_disse_setimo:{
  texto:[
    d=>fala(d.jogador.nome, 'Sétimo.'),
    'Ela aperta o sete de novo, sem precisar, que é o gesto automático de quem ouviu.',
    fala('a moça do papel', 'Você é do conselho ou é visita?'),
    d=>fala(d.jogador.nome, 'Visita.'),
    fala('a moça do papel', 'Ah, ótimo. A gente quase nunca tem visita.'),
    'Ela diz isso com alegria genuína, e isso é a coisa mais desorientadora que te aconteceu em semanas.',
    fala('a moça do papel', 'A pauta de hoje é chata, aviso desde já. Cronograma de liberação e aprovação de ata.'),
    'O elevador passa pelo quarto andar.',
    fala('a moça do papel', 'Mas tem café na porta. O café é bom. É a única coisa que a gente faz bem por unanimidade.'),
    'A mulher da pasta de couro dá um riso curto pelo nariz.',
    'O elevador chega no sétimo e a porta abre e é um corredor com carpete gasto.'
  ],
  ef:{flag:'foi_recebido_como_visita',
      npc:{nome:'a moça do papel', opiniao:1, viuVoce:'Te recebeu no elevador como visita da reunião.'},
      registrar:'A pauta da reunião de hoje é cronograma de liberação e aprovação de ata.'},
  escolhas:[
    {texto:'Entrar na sala com eles.', vai:'c20_predio'},
    {texto:'Ficar no corredor e tomar o café primeiro.', vai:'c20_cafe'}
  ]
},

c20_ab_nao_sei_ainda:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu não sei ainda.'),
    'Os três olham pra você ao mesmo tempo, e é o homem do saquinho de padaria que fala, e ele fala com a boca cheia de uma coisa que ele acabou de comer.',
    fala('o homem do saquinho', 'Melhor resposta que eu já ouvi nesse elevador.'),
    'A mulher da pasta de couro não acha graça. Ela te olha do jeito que se olha um problema de agenda.',
    fala('a mulher da pasta', 'Você é jornalista?'),
    d=>fala(d.jogador.nome, 'Não.'),
    fala('a mulher da pasta', 'Advogado de alguma parte?'),
    d=>fala(d.jogador.nome, 'Não.'),
    'O elevador passa pelo quinto andar. Ninguém fala nada por dois andares, o que num elevador é uma eternidade.',
    fala('a mulher da pasta', 'Então você é a terceira coisa.'),
    'Ela não diz qual é a terceira coisa. A porta abre no sétimo.'
  ],
  ef:{flag:'a_terceira_coisa',
      npc:{nome:'a mulher da pasta de couro', opiniao:-1, viuVoce:'Te classificou no elevador e não disse como.'},
      registrar:'A mulher da pasta de couro te classificou como "a terceira coisa".',
      presagio:'Ela tem uma lista de três tipos de gente que sobe nesse elevador. Duas ela sabe lidar.'},
  escolhas:[
    {texto:'Entrar na sala atrás deles.', vai:'c20_predio'},
    {texto:'Ficar no corredor e tomar o café primeiro.', vai:'c20_cafe'}
  ]
},

c20_ab_a_farmacia:{
  texto:[
    'Tem uma farmácia no térreo do 118 e você entra nela porque está com dor de cabeça de verdade e porque a farmácia atrasa a subida em mais dez minutos.',
    'A balconista tem uns trinta anos e um crachá com o nome dela e uma caneta presa no bolso do jaleco.',
    'Você compra o analgésico mais barato e toma ali mesmo, com água do bebedouro.',
    d=>fala(d.jogador.nome, 'Você conhece o pessoal da 704?'),
    fala('a balconista', 'Da reunião?'),
    'Ela nem levanta os olhos do caixa.',
    fala('a balconista', 'Eles descem aqui de vez em quando. Uma delas compra remédio de pressão.'),
    d=>fala(d.jogador.nome, 'Você sabe o que eles fazem?'),
    fala('a balconista', 'Reunião, ué.'),
    'E aí ela levanta os olhos, porque a pergunta foi estranha.',
    fala('a balconista', 'Por quê? Eles devem alguma coisa pra você?'),
    'É a pergunta certa, feita pela pessoa errada, e ela é a primeira pessoa a fazer ela em voz alta.'
  ],
  ef:{dinheiro:-40, hp:2, flag:'a_farmacia_do_terreo',
      registrar:'Uma das conselheiras da 704 compra remédio de pressão na farmácia do térreo.'},
  escolhas:[
    {texto:'"Devem."', vai:'c20_ab_devem'},
    {texto:'"Ainda não sei."', vai:'c20_predio'},
    {texto:'Perguntar qual delas compra o remédio.', vai:'c20_ab_qual_delas'}
  ]
},

c20_ab_devem:{
  texto:[
    d=>fala(d.jogador.nome, 'Devem.'),
    'Ela fecha a gaveta do caixa devagar.',
    fala('a balconista', 'Então sobe e cobra.'),
    d=>fala(d.jogador.nome, 'É o que eu vim fazer.'),
    fala('a balconista', 'Então por que você tá comprando analgésico?'),
    'Você não tem resposta pra isso.',
    'Ela pega o troco e conta na sua mão, moeda por moeda, sem pressa.',
    fala('a balconista', 'Meu pai trabalhou vinte e dois anos numa firma que devia pra ele. Ele nunca subiu cobrar.'),
    fala('a balconista', 'Ele reclamava todo domingo no almoço, por vinte e dois anos.'),
    'Ela fecha a sua mão em volta do troco com as duas mãos dela.',
    fala('a balconista', 'Sobe.', 'baixo')
  ],
  ef:{flag:'a_balconista_mandou_subir', moral:1,
      npc:{nome:'a balconista', opiniao:2, viuVoce:'Fechou a sua mão em volta do troco e mandou você subir.'},
      registrar:'A balconista da farmácia do térreo mandou você subir e cobrar.'},
  escolhas:[
    {texto:'Subir.', vai:'c20_predio'}
  ]
},

c20_ab_qual_delas:{
  texto:[
    fala('a balconista', 'A da cabeceira. A que manda.'),
    d=>fala(d.jogador.nome, 'Como você sabe que ela é a que manda?'),
    fala('a balconista', 'Porque ela é a única que desce sozinha.'),
    'Ela arruma umas caixas no balcão.',
    fala('a balconista', 'Os outros descem em dupla, em trio, conversando. Ela desce sozinha, compra, e sobe.'),
    fala('a balconista', 'E uma vez ela esqueceu a receita aqui e eu subi pra devolver.'),
    d=>fala(d.jogador.nome, 'E?'),
    fala('a balconista', 'E a porta tava aberta e eles tavam discutindo, e pararam quando eu bati.'),
    'Ela dá de ombros.',
    fala('a balconista', 'Eles discutem. Eu achei isso interessante. Eu achava que gente assim não discutia.')
  ],
  ef:{flag:'eles_discutem',
      registrar:'O conselho da 704 discute entre si. A presidente é a única que desce sozinha.',
      presagio:'Se eles discutem, não são um bloco. Se não são um bloco, tem alguém na mesa que perde as votações.'},
  escolhas:[
    {texto:'Subir.', vai:'c20_predio'},
    {texto:'"Eles devem alguma coisa pra mim."', vai:'c20_ab_devem'}
  ]
},


c20_predio:{
  texto:[
    'Rua do Comércio, 118. Prédio comercial de dezesseis andares, com uma farmácia no térreo, uma banca de jornal na porta e um elevador que demora.',
    'No sétimo andar, o corredor tem carpete gasto, três portas e um extintor com a validade em dia.',
    'A sala 704 tem uma placa de acrílico com a sigla CGRB em letra comum.',
    'A porta está aberta. Do lado de fora, numa mesinha dobrável, tem uma garrafa térmica de café, copos descartáveis, um saquinho de açúcar e uma colher amarrada com barbante para não sumir.',
    'Lá dentro, doze pessoas sentadas em volta de uma mesa oval, com pasta e caneta. Uma delas está falando sobre cronograma de liberação. A pauta está escrita num flip chart, em letra grande.',
    'Eles param quando você entra. Não com susto: com a pausa educada de quem foi interrompido numa reunião.',
    '"Bom dia." A mulher na cabeceira tem cinquenta e poucos anos e um tailleur cinza sem nada de caro. "O senhor é…?"'
  ],
  ef:{registrar:'Entrou na reunião ordinária do conselho da CGRB.'},
  escolhas:[
    {texto:'Dizer o seu nome.', vai:'c20_nome'},
    {texto:'Pedir a palavra, pelo Art. 27.', vai:'c20_palavra'},
    {texto:'Não dizer nada e olhar quem está na mesa.', vai:'c20_mesa'},
    {texto:'Sair para o corredor e tomar o café primeiro.', vai:'c20_cafe'},
    {texto:'Perguntar quem paga esse café.', vai:'c20_quem_paga_o_cafe'}
  ]
},

c20_cafe:{
  texto:[
    'Você sai, serve um copo e fica no corredor com a porta aberta atrás de você.',
    'O café é ruim de um jeito específico: é café de garrafa térmica que ficou pronto às sete da manhã.',
    'Pela porta dá para ouvir tudo, porque ninguém abaixa a voz.',
    'Item 3: readequação do orçamento da Estação 4 por causa do aumento do preço da ração.',
    'Item 4: cronograma de liberação da Fase II.',
    'Alguém pergunta se dá para adiantar uma semana. Outra pessoa responde que não, porque a chuva atrasa a adaptação, e a resposta é técnica e todo mundo aceita.'
  ],
  ef:{flag:'ouviu_do_corredor', instabilidade:1,
      registrar:'Ouviu a reunião do corredor. Item 4: cronograma de liberação da Fase II.'},
  escolhas:[
    {texto:'Continuar ouvindo até o fim do item 4.', vai:'c20_item_quatro'},
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Perguntar a quem serve o café quem faz o café.', vai:'c20_quem_paga_o_cafe'},
    {texto:'Entrar e olhar a mesa.', vai:'c20_mesa'}
  ]
},

c20_item_quatro:{
  texto:[
    'O item 4 leva dezoito minutos.',
    'Discutem logística: quantos veículos, quantos dias, em que ordem por espécie, e se liberam de manhã ou no fim da tarde.',
    'Uma voz de homem defende o fim da tarde, porque de manhã tem movimento na estrada e unidade nova não sabe atravessar.',
    'Ninguém ri disso. Todo mundo anota.',
    'E é aí que você entende uma coisa que não estava preparado para entender: eles estão tentando fazer direito.',
    'Não bem. Direito. São coisas diferentes e ninguém nessa sala confunde as duas.'
  ],
  ef:{instabilidade:1, moral:-2,
      registrar:'Discutiram por dezoito minutos o melhor horário para soltar, para as unidades não morrerem na estrada.'},
  escolhas:[
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Entrar e olhar a mesa antes.', vai:'c20_mesa'},
    {texto:'Ir embora antes de entrar.', vai:'c20_foi_embora_do_predio'}
  ]
},

c20_quem_paga_o_cafe:{
  texto:[
    'A pergunta é dirigida a ninguém e é respondida por uma mulher de uns sessenta anos que está arrumando os copos.',
    '"Eu." Ela alinha a colher no barbante. "Eu compro e eu faço, e eu recebo de volta no mês seguinte por reembolso, com nota."',
    '"A senhora é da Comissão?"',
    '"Eu sou a secretária da mesa." Ela estende a mão. "Sra. Hidaka. Eu redijo as atas."',
    'Você aperta a mão de quem escreveu, palavra por palavra, tudo o que você leu numa noite inteira num quarto de Centro Pokémon.'
  ],
  ef:{flag:'conheceu_bonfim',
      npc:{nome:'Sra. Hidaka', opiniao:1, memoria:'Secretária da mesa. Redige todas as atas e faz o café.'},
      registrar:'Sra. Hidaka, secretária da mesa, redige as atas da CGRB.'},
  escolhas:[
    {texto:'"A senhora escreveu as cento e quarenta páginas?"', vai:'c20_bonfim_atas'},
    {texto:'"E o livro do Art. 33? A senhora escreve esse também?"', vai:'c20_bonfim_livro'},
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Entrar e olhar a mesa.', vai:'c20_mesa'}
  ]
},

c20_bonfim_atas:{
  texto:[
    '"Escrevi." Ela não tem orgulho nem vergonha nisso. "Trinta e quatro atas em um ano e oito meses, mais as alterações de estatuto."',
    '"A senhora lê o que escreve?"',
    'Ela para de arrumar os copos.',
    '"Moço, eu não leio o que eu escrevo. Eu escrevo e depois eu confiro, que é diferente e é pior." Ela alinha um copo. "Conferir é ler duas vezes procurando erro, e a gente não erra, e por isso eu sei tudo de cor."',
    '"E a senhora concorda?"',
    '"Eu redijo." Ela pega a garrafa. "Se eu começar a concordar ou discordar, a ata deixa de ser confiável, e a ata é a única coisa aqui que é confiável."'
  ],
  ef:{instabilidade:1,
      npc:{nome:'Sra. Hidaka', opiniao:2, memoria:'Sabe todas as atas de cor de tanto conferir.'},
      registrar:'A Sra. Hidaka sabe as 140 páginas de cor porque confere, não porque lê.'},
  escolhas:[
    {texto:'"E o livro do Art. 33?"', vai:'c20_bonfim_livro'},
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Entrar e olhar a mesa.', vai:'c20_mesa'}
  ]
},

c20_bonfim_livro:{
  texto:[
    'Ela para com a garrafa térmica na mão.',
    '"O senhor leu o estatuto inteiro."',
    '"Li."',
    '"Poucos leem o Art. 33." Ela põe a garrafa na mesinha. "Eu escrevo esse também. É um livro de capa dura, numerado, que fica no armário e não sai da sala."',
    '"Quantas reuniões fechadas já teve?"',
    'Ela olha para a porta aberta, e depois para você, e a resposta dela é a coisa mais útil que você vai ouvir hoje.',
    '"Nove." Ela pega a garrafa de novo. "E as nove estão na mesma prateleira das outras, no mesmo armário, que é fechado com a mesma chave que abre a porta da frente."'
  ],
  ef:{flag:['sabe_do_livro_fechado','sabe_onde_fica_o_livro'], instabilidade:2,
      npc:{nome:'Sra. Hidaka', opiniao:2, memoria:'Te disse quantas reuniões fechadas houve e onde fica o livro.'},
      rep:{eixo:'bom',delta:1,motivo:'Leu o estatuto inteiro, inclusive o artigo que ninguém lê'},
      registrar:'Nove reuniões fechadas. O livro fica no armário da sala 704, na mesma chave da porta.'},
  escolhas:[
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Entrar e olhar a mesa.', vai:'c20_mesa'},
    {texto:'"Me deixa ver o livro."', vai:'c20_pediu_o_livro'}
  ]
},

c20_pediu_o_livro:{
  texto:[
    '"Me deixa ver o livro."',
    '"Não."',
    'Sem hesitação nenhuma, e sem hostilidade nenhuma.',
    '"Eu sou secretária de uma associação e o estatuto diz acesso restrito ao Conselho. Se eu te der, eu não sirvo mais para nada, nem para o senhor."',
    'Ela ajeita o barbante da colher.',
    '"Mas o senhor pode pedir na mesa. Interessado pode propor matéria, e matéria pode ser exibição de documento. Art. 27, §3º."',
    'Ela olha para você por cima dos óculos.',
    '"Eu não posso te dar. O conselho pode votar te dar."'
  ],
  ef:{flag:['pode_pedir_o_livro'],
      npc:{nome:'Sra. Hidaka', opiniao:3, memoria:'Te ensinou como pedir o livro fechado pelo caminho certo.'},
      registrar:'O conselho pode votar a exibição do livro de reuniões fechadas, pelo Art. 27, §3º.'},
  escolhas:[
    {texto:'Entrar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'Entrar e olhar a mesa antes.', vai:'c20_mesa'}
  ]
},

c20_foi_embora_do_predio:{
  texto:[
    'Você desce sem entrar.',
    'No térreo tem uma farmácia, uma banca de jornal e gente comprando coisa, e trânsito, e um rapaz distribuindo panfleto de curso de informática.',
    'Você fica parado na calçada com o panfleto na mão por bastante tempo.',
    'Lá em cima, no sétimo andar, a reunião continua e vai terminar às onze e quarenta, como todas as reuniões.'
  ],
  ef:{flag:'nao_entrou_na_reuniao', moral:-4,
      registrar:'Desceu sem entrar na sala 704.'},
  escolhas:[
    {texto:'Subir de novo.', vai:'c20_predio'},
    {texto:'Ir embora de verdade.', vai:'c20_fim'}
  ]
},

/* ── A mesa ─────────────────────────────────────────────── */
c20_mesa:{
  texto:[
    'Você olha a mesa antes de falar, e eles deixam.',
    'Doze cadeiras. Onze ocupadas e uma vazia, com a pasta na frente dela mesmo assim.',
    'Nenhuma pessoa de uniforme. Um jaleco — o Dr. Amano, que levanta os olhos e volta para a pasta. Um terno com crachá no bolso — o Curador Ren, que não levanta os olhos nenhuma vez.',
    d=>{
      const L = [];
      if (d.flags.liga_infiltrada || d.flags.liga_aliada) L.push('E, na terceira cadeira da direita, uma mulher que você conhece: a conselheira da Liga Pokémon que te mandou ao norte.');
      if (d.flags.sabe_da_terceira) L.push('Não tem ninguém de Celadon aqui. A Terceira vende para eles e não senta com eles, e agora isso faz muito sentido.');
      return L.join(' ');
    },
    'A mulher da cabeceira espera você terminar de olhar. Ela deixa você olhar, e isso é escolha dela.'
  ],
  ef:{executar:d=>{
        if (d.flags.liga_infiltrada || d.flags.liga_aliada){
          Estado.marcar('viu_a_liga_na_mesa');
          return [{tipo:'liga', texto:'A conselheira da Liga que te equipou para o norte tem assento no conselho da Comissão.'}];
        }
        return [];
      }},
  escolhas:[
    {texto:'"Quem é cada um aqui?"', vai:'c20_quem_e_quem'},
    {texto:'"De quem é a cadeira vazia?"', vai:'c20_cadeira_vazia'},
    {texto:'"Você." — apontando para a conselheira da Liga.', vai:'c20_conselheira', cond:d=>!!d.flags.viu_a_liga_na_mesa},
    {texto:'Pedir a palavra, pelo Art. 27.', vai:'c20_palavra'},
    {texto:'Dizer o seu nome.', vai:'c20_nome'}
  ]
},

c20_quem_e_quem:{
  texto:[
    'A Presidente apresenta a mesa inteira, um por um, com cargo e formação, e leva dois minutos e meio.',
    'Bióloga, com doutorado. Veterinário, vinte e dois anos de clínica de grande porte. Engenheiro agrônomo. Advogada. Contador. Professor titular aposentado, que dormiu por três segundos no meio da apresentação dele mesmo.',
    'Dois servidores públicos licenciados. Uma ex-diretora de escola técnica. O Dr. Amano. O Curador Ren.',
    'E ela: Reika Ando, ex-diretora de fiscalização da Liga por nove anos.',
    'Nenhum deles desvia o olhar quando o nome é dito. Todo mundo aqui está com o nome no cartório desde o primeiro dia.'
  ],
  ef:{flag:['viu_a_mesa_inteira','sabe_o_nome_da_presidente'],
      registrar:'Os onze da mesa, com nome e formação, todos registrados em cartório desde o primeiro dia.'},
  escolhas:[
    {texto:'"E o professor que dormiu?"', vai:'c20_o_professor'},
    {texto:'"De quem é a cadeira vazia?"', vai:'c20_cadeira_vazia'},
    {texto:'"E o veterinário? Como ele assina isso?"', vai:'c20_o_veterinario'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'}
  ]
},

c20_o_professor:{
  texto:[
    'O professor titular aposentado se chama Sr. Tetsuo Maki e tem oitenta e um anos.',
    'Ele acorda quando ouve o próprio nome e responde antes de qualquer outra pessoa.',
    '"Eu escrevi o primeiro levantamento de população de fauna de Kanto em 1971." A voz é fraca e a frase é firme. "Cento e oitenta páginas. Eu andei a região inteira a pé com um caderno."',
    '"E o senhor está aqui por quê?"',
    '"Porque eu entreguei aquele levantamento para três governos e nenhum deles abriu." Ele arruma os óculos. "Estes aqui abriram. Eles leram as cento e oitenta páginas e me chamaram."',
    'Ele volta a se encostar na cadeira.',
    '"Eu tenho oitenta e um anos, moço. Alguém finalmente me leu."'
  ],
  ef:{flag:'entendeu_o_professor', instabilidade:1, moral:-2,
      npc:{nome:'Sr. Tetsuo Maki', opiniao:1, memoria:'Entrou na Comissão porque foram os primeiros a ler o levantamento de 1971.'},
      registrar:'O levantamento de fauna de 1971 do Sr. Maki foi lido pela Comissão e por mais ninguém.'},
  escolhas:[
    {texto:'"E o que o senhor acha do Art. 19?"', vai:'c20_professor_art19'},
    {texto:'"De quem é a cadeira vazia?"', vai:'c20_cadeira_vazia'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'}
  ]
},

c20_professor_art19:{
  texto:[
    'Ele leva um tempo, e quando fala, fala para a mesa e não para você.',
    '"Eu votei a favor."',
    'Ele põe as duas mãos na bengala.',
    '"Em 1971 eu contei quatro mil e oitenta indivíduos numa faixa que hoje tem oitocentos. Eu vi a conta descer a vida inteira, e todo ano alguém me dizia que era cedo para agir."',
    '"E agora é tarde?"',
    '"Agora é tarde." Ele fecha os olhos. "E quando é tarde, moço, a gente aceita coisa que não aceitaria. Eu sou a prova disso, sentado aqui."'
  ],
  ef:{instabilidade:1, moral:-2,
      registrar:'O Sr. Maki votou a favor do Art. 19 porque achou que já era tarde.'},
  escolhas:[
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'"E o veterinário?"', vai:'c20_o_veterinario'},
    {texto:'"De quem é a cadeira vazia?"', vai:'c20_cadeira_vazia'}
  ]
},

c20_o_veterinario:{
  texto:[
    '"E o senhor? Como um veterinário assina isso?"',
    'Ele é magro, de camisa de manga curta, e responde com uma calma de quem já respondeu.',
    '"Eu assino porque se eu não assinar assina outro, e o outro assina sem exame." Ele abre a pasta. "Eu exijo exame. Eu exijo laudo. Eu reprovei quarenta e um pedidos de descarte em dois anos."',
    '"E aprovou quantos?"',
    'Ele não hesita e não amacia.',
    '"Todos os outros."',
    'Ele fecha a pasta.',
    '"O senhor queria que eu dissesse um número menor. Eu não vou dizer um número menor."'
  ],
  ef:{flag:'ouviu_o_veterinario', instabilidade:1,
      npc:{nome:'o veterinário do conselho', opiniao:1, memoria:'Reprovou 41 pedidos de descarte e aprovou todos os outros.'},
      registrar:'O veterinário do conselho reprovou 41 descartes em dois anos e aprovou todos os outros.'},
  escolhas:[
    {texto:'"E dá para aumentar os quarenta e um?"', vai:'c20_aumentar_os_41'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'"De quem é a cadeira vazia?"', vai:'c20_cadeira_vazia'}
  ]
},

c20_aumentar_os_41:{
  texto:[
    '"Dá para aumentar os quarenta e um?"',
    'Ele para com a mão na pasta.',
    'É a primeira vez na manhã inteira que alguém nessa sala faz uma cara de surpresa de verdade.',
    '"Dá." Ele fala devagar, pensando enquanto fala. "Se os critérios do Art. 19 forem revistos, dá. Se a faixa de agressividade for alargada, dá. Se estereotipia leve sair da lista, dá."',
    'Ele olha a Presidente.',
    '"Isso o Dr. Amano já pediu três vezes."',
    '"E por que não passou?"',
    '"Porque quem pede é ele e ele é técnico e não tem voto." O veterinário fecha a pasta. "Eu tenho voto e nunca propus. Isso é meu e é agora."'
  ],
  ef:{flag:['veterinario_vai_propor'], instabilidade:1,
      npc:{nome:'o veterinário do conselho', opiniao:3, memoria:'Percebeu, na sua frente, que nunca usou o voto que tem.'},
      rep:{eixo:'bom',delta:2,motivo:'Fez um conselheiro perceber que nunca usou o próprio voto'},
      registrar:'O veterinário do conselho vai propor a revisão dos critérios do Art. 19.'},
  escolhas:[
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'"De quem é a cadeira vazia?"', vai:'c20_cadeira_vazia'}
  ]
},

c20_cadeira_vazia:{
  texto:[
    '"De quem é a cadeira vazia?"',
    'A Presidente olha para a cadeira antes de responder, o que já é uma resposta.',
    '"Era da Dra. Akane Kurogane, bióloga. Ela renunciou em março."',
    '"Por quê?"',
    '"Consta em ata: motivo pessoal." Ela junta as mãos. "Fora da ata, ela me disse que não conseguia mais ler o relatório mensal do galpão 4 e que preferia sair antes de se acostumar."',
    'Ninguém na mesa desvia o olhar.',
    '"A gente deixa a pasta dela ali", diz a Presidente, "porque eu determinei que a cadeira ficasse vaga até que alguém fosse eleito, e ninguém foi eleito, e eu não abri edital."',
    'Ela olha para a cadeira de novo.',
    '"Isso é uma coisa que eu faço e que eu não sei explicar."'
  ],
  ef:{flag:['sabe_da_alcina'], instabilidade:1,
      registrar:'A Dra. Akane Kurogane renunciou em março para não se acostumar. A cadeira dela segue vaga.'},
  escolhas:[
    {texto:'"Onde ela está agora?"', vai:'c20_onde_esta_alcina'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'Dizer o seu nome.', vai:'c20_nome'},
    {texto:'"Quem é cada um aqui?"', vai:'c20_quem_e_quem'}
  ]
},

c20_onde_esta_alcina:{
  texto:[
    '"Dando aula." A Presidente responde na hora. "Escola técnica de Celadon, primeiro ano."',
    '"A senhora sabe de cor."',
    '"Eu sei de cor onde estão as três pessoas que saíram daqui." Ela não desvia. "Eu ligo em dezembro. Duas atendem."',
    'A sala está muito quieta.',
    '"Se o senhor quiser falar com ela, o nome é público e a escola tem telefone." Ela abre a pasta. "E eu vou dizer o que eu digo sempre: ela não vai te dizer nada que eu não esteja dizendo agora. Ela só vai dizer com a voz melhor."'
  ],
  ef:{flag:['contato_alcina'],
      registrar:'A Dra. Akane Kurogane dá aula na escola técnica de Celadon, primeiro ano.'},
  escolhas:[
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'Dizer o seu nome.', vai:'c20_nome'},
    {texto:'Sair e ir falar com ela antes.', vai:'c20_foi_falar_com_alcina'}
  ]
},

c20_foi_falar_com_alcina:{
  texto:[
    'Você desce, atravessa a cidade e pega o ônibus para Celadon, e chega na escola técnica no fim da última aula.',
    'A Dra. Akane Kurogane tem uns quarenta anos, giz na manga e uma pilha de provas para corrigir.',
    'Ela ouve, e o rosto dela não muda nada até o fim.',
    '"Eu vou te dizer a única coisa que eu sei que você não ouviu lá."',
    'Ela empilha as provas.',
    '"Eu não saí porque eu discordo. Eu concordo com quase tudo, ainda hoje." Ela põe a pilha na bolsa. "Eu saí porque no oitavo mês eu li o relatório do galpão 4 inteiro enquanto almoçava, e não parei de mastigar."'
  ],
  ef:{flag:['falou_com_alcina'], instabilidade:1,
      npc:{nome:'Dra. Akane Kurogane', opiniao:2, memoria:'Saiu do conselho por ter lido o relatório do galpão 4 sem parar de mastigar.'},
      rep:{eixo:'bom',delta:1,motivo:'Foi até Celadon ouvir quem tinha saído'},
      registrar:'A Dra. Kurogane saiu do conselho por ter se acostumado, não por discordar.'},
  escolhas:[
    {texto:'"Volta comigo para a reunião."', vai:'c20_alcina_volta'},
    {texto:'"Me dá alguma coisa que eu possa usar."', vai:'c20_alcina_da'},
    {texto:'Voltar sozinho para Saffron.', vai:'c20_palavra'}
  ]
},

c20_alcina_volta:{
  texto:[
    '"Volta comigo."',
    'Ela ri, e é uma risada curta e sem alegria.',
    '"Eu renunciei por escrito. Eu não tenho cadeira."',
    '"A cadeira está vazia até hoje."',
    'Ela para de arrumar a bolsa.',
    'Fica assim uns dez segundos.',
    '"Ela está vazia?"',
    '"Com a sua pasta em cima."',
    'Ela olha a janela da sala de aula, para o pátio vazio, e depois pega a bolsa.',
    '"A próxima reunião é segunda. Eu vou."'
  ],
  ef:{flag:['alcina_volta'], 
      npc:{nome:'Dra. Akane Kurogane', opiniao:4, memoria:'Voltou ao conselho porque a cadeira dela nunca foi ocupada.'},
      rep:{eixo:'bom',delta:2,motivo:'Trouxe de volta quem tinha desistido'},
      registrar:'A Dra. Kurogane vai voltar ao conselho.'},
  escolhas:[{texto:'Voltar para Saffron com ela.', vai:'c20_palavra'}]
},

c20_alcina_da:{
  texto:[
    '"Me dá alguma coisa que eu possa usar."',
    'Ela pensa, e depois abre a bolsa e tira um caderno de espiral com capa de plástico.',
    '"Isso é a minha cópia dos relatórios mensais do galpão 4 dos oito meses em que eu fui conselheira." Ela segura por um instante. "Eu não devia ter levado e eu levei."',
    '"E por que a senhora guardou?"',
    '"Porque eu queria ter certeza de que eu não tinha exagerado na memória." Ela entrega. "Eu não exagerei. É pior do que eu lembro."'
  ],
  ef:{flag:['tem_relatorios_alcina','provas_do_viveiro'], itens:{'Oito relatórios mensais do galpão 4':1},
      npc:{nome:'Dra. Akane Kurogane', opiniao:3, memoria:'Te deu os relatórios mensais que levou quando saiu.'},
      rep:{eixo:'bom',delta:2,motivo:'Saiu de Celadon com oito meses de relatório na mão'},
      registrar:'Oito relatórios mensais do galpão 4, guardados por quem renunciou.'},
  escolhas:[
    {texto:'"Volta comigo para a reunião."', vai:'c20_alcina_volta'},
    {texto:'Voltar para Saffron.', vai:'c20_palavra'}
  ]
},

c20_conselheira:{
  texto:[
    '"Você."',
    'A conselheira da Liga não desvia o olhar e não parece constrangida.',
    '"Eu tenho assento de observadora." Ela fala com a mesma calma da sala do Planalto. "Sem direito a voto. Consta na ata, e a ata é pública, e você leu."',
    '"Você me mandou para o norte."',
    '"Mandei."',
    '"Para quê?"',
    'Pela primeira vez em duas conversas, ela hesita.',
    '"Porque eu queria que alguém de fora chegasse lá antes de nós." Ela olha a Presidente do outro lado da mesa. "E porque eu não podia ser eu."'
  ],
  ef:{flag:'conselheira_confrontada', instabilidade:1,
      npc:{nome:'Conselheira da Liga', opiniao:1, memoria:'Admitiu, na frente do conselho, que te mandou ao norte para chegar antes deles.'},
      registrar:'A conselheira da Liga te mandou ao norte para chegar antes da Comissão.'},
  escolhas:[
    {texto:'"A Liga sabe que você senta aqui?"', vai:'c20_liga_sabe'},
    {texto:'"Então vote comigo."', vai:'c20_pediu_voto_dela'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'}
  ]
},

c20_liga_sabe:{
  texto:[
    '"A Liga sabe que você senta aqui?"',
    '"A Liga assinou o convênio que criou este assento." Ela abre a pasta e tira uma folha. "Cláusula nona. Publicada. Com a minha assinatura e a de mais três diretores."',
    'Ela desliza a folha pela mesa até você.',
    '"O que a Liga não sabe é o que eu faço na cadeira, porque ninguém nunca me perguntou em três anos."',
    '"E o que você faz?"',
    '"Eu anoto." Ela guarda a folha de volta. "Eu tenho três anos de anotação de reunião de conselho de uma entidade privada, feita por uma diretora da Liga, e nunca ninguém pediu para ver."'
  ],
  ef:{flag:['sabe_do_assento_da_liga','liga_infiltrada'], instabilidade:1,
      registrar:'O assento de observadora da Liga foi criado pela cláusula nona do convênio.'},
  escolhas:[
    {texto:'"Me dá as anotações."', vai:'c20_pediu_as_anotacoes'},
    {texto:'"Então vote comigo."', vai:'c20_pediu_voto_dela'},
    {texto:'Pedir a palavra.', vai:'c20_palavra'}
  ]
},

c20_pediu_as_anotacoes:{
  texto:[
    '"Me dá as anotações."',
    'Ela olha a mesa inteira, devagar, e depois olha a Presidente, que não faz nenhum sinal em nenhuma direção.',
    '"São quatro cadernos."',
    '"Eu carrego."',
    'Ela abre a pasta e tira um. Só um.',
    '"Este é do último ano, que é o que interessa, e é o que eu posso justificar se me perguntarem." Ela empurra pela mesa. "Os outros três eu entrego quando alguém me perguntar oficialmente, e eu vou querer que perguntem por escrito."'
  ],
  ef:{flag:['tem_caderno_da_liga','provas_do_11'], itens:{'Caderno de anotações da conselheira':1},
      npc:{nome:'Conselheira da Liga', opiniao:3, memoria:'Te entregou um dos quatro cadernos, na frente da mesa inteira.'},
      rep:{eixo:'bom',delta:2,motivo:'Arrancou um ano de anotações na frente do conselho'},
      registrar:'Um ano de anotações da observadora da Liga nas reuniões do conselho.'},
  escolhas:[
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'"Então vote comigo."', vai:'c20_pediu_voto_dela'}
  ]
},

c20_pediu_voto_dela:{
  texto:[
    '"Então vote comigo."',
    '"Eu não tenho voto."',
    '"Então fale."',
    'Ela fica quieta.',
    'A Presidente, da cabeceira, diz uma coisa que muda o dia inteiro:',
    '"Observador pode falar. Art. 27, §2º. Só não pode votar."',
    'As duas se olham por cima da mesa oval por um tempo longo demais.',
    '"Eu sei", diz a conselheira da Liga. "Eu sei há três anos."'
  ],
  ef:{flag:['observadora_pode_falar'], instabilidade:1,
      npc:{nome:'Conselheira da Liga', opiniao:2, memoria:'Foi lembrada, na sua frente, de que pode falar há três anos.'},
      registrar:'A observadora da Liga pode falar nas reuniões. Nunca falou em três anos.'},
  escolhas:[{texto:'Pedir a palavra.', vai:'c20_palavra'}]
},

c20_nome:{
  texto:[
    'Você diz o seu nome.',
    'Metade da mesa reage. A Presidente, não.',
    d=>{
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=6) return '"Ah." Ela fecha a pasta. "O senhor é bem mais novo do que o relatório sugere."';
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) return '"Ah." Ela fecha a pasta. "Nós temos uma pasta sua. É mais grossa que a de qualquer conselheiro aqui."';
      return '"Ah." Ela fecha a pasta. "Nós esperávamos o senhor em algum momento. Não hoje, mas em algum momento."';
    },
    '"Senta, por favor. Tem café lá fora."'
  ],
  escolhas:[
    {texto:'Sentar e pedir a palavra.', vai:'c20_palavra'},
    {texto:'"Eu não vou sentar."', vai:'c20_nao_senta'},
    {texto:'Olhar a mesa antes.', vai:'c20_mesa'}
  ]
},

c20_nao_senta:{
  texto:[
    '"Eu não vou sentar."',
    '"Tudo bem." Ela não insiste. "O senhor pode falar em pé. Alguns preferem."',
    'Alguns.',
    'Você fica com essa palavra atravessada por uns segundos, tentando imaginar quem foram os outros, e a Presidente vê você tentar.',
    '"Três", ela diz. "Em um ano e oito meses. Duas por escrito e uma por telefone."',
    '"E nenhuma apareceu aqui."',
    '"Nenhuma apareceu aqui." Ela abre o estatuto na página do Art. 27. "O senhor é o primeiro. Eu peço que o senhor leve isso a sério, porque eu estou levando."'
  ],
  ef:{flag:'ficou_em_pe', instabilidade:1,
      registrar:'Três manifestações em um ano e oito meses. Nenhuma presencial. Você é o primeiro.'},
  escolhas:[{texto:'Pedir a palavra.', vai:'c20_palavra'}]
},

/* ── A palavra ──────────────────────────────────────────── */
c20_palavra:{
  texto:[
    '"Art. 27. Eu quero a palavra."',
    'A Presidente olha para a Sra. Hidaka, que confere o estatuto, assente, e anota na ata.',
    '"Concedida. Cinco minutos, prorrogáveis."',
    'E é isso que quebra você: eles te dão a palavra. Formalmente. Em ata. Com hora de início anotada na margem.',
    'A sala fica em silêncio e todo mundo olha para você, e você percebe que passou meses ensaiando o que faria se eles te impedissem e nada do que faria se eles te ouvissem.'
  ],
  ef:{flag:'falou_no_conselho',
      rep:{eixo:'bom',delta:2,motivo:'Falou no conselho da Comissão e foi ouvido em ata'}},
  escolhas:[
    {texto:'Falar da planilha. Trinta e nove páginas, quatro dígitos.', vai:'c20_falou_da_planilha', cond:d=>!!d.flags.provas_do_galpao4},
    {texto:'Falar do Rattata que corre até a parede e volta.', vai:'c20_falou_do_rattata'},
    {texto:'Falar das pessoas que trabalham lá.', vai:'c20_falou_das_pessoas'},
    {texto:'Não fazer discurso. Fazer uma pergunta só.', vai:'c20_uma_pergunta_so'},
    {texto:'Ler em voz alta o Art. 19 deles.', vai:'c20_leu_o_art19'}
  ]
},

c20_falou_da_planilha:{
  texto:[
    'Você põe as trinta e nove páginas na mesa e não faz discurso nenhum.',
    'Você lê em voz alta, linha por linha, o último dia: catorze anilhas, do zero um ao catorze, com o mesmo motivo em todas.',
    'Leva quatro minutos ler catorze linhas em voz alta, porque você lê devagar.',
    'Na oitava, uma conselheira pede licença e sai da sala. Ninguém a impede e ninguém comenta.',
    'Na décima segunda, o Curador Ren levanta a cabeça pela primeira vez na manhã inteira.',
    'Quando você termina, a Presidente espera cinco segundos inteiros antes de responder.'
  ],
  ef:{flag:['leu_a_planilha_no_conselho'], instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Leu catorze linhas em voz alta numa sala de reunião'},
      registrar:'Leu a planilha do galpão 4 em voz alta no conselho. Uma conselheira saiu da sala.'},
  escolhas:[{texto:'Ouvir a resposta.', vai:'c20_resposta'}]
},

c20_falou_do_rattata:{
  texto:[
    'Você fala do galpão 3.',
    'Do mato plantado em grade regular, da chuva programada para as dezesseis horas, dos dois Nidoran que se cruzam a meio metro um do outro sem nenhum sinal.',
    'E do Rattata que corre em linha reta até a parede, para, e volta, e faz de novo, e de novo.',
    'Você fala quatro minutos sobre um Rattata numa sala onde onze pessoas decidem o destino de quatrocentas.',
    'A bióloga anota alguma coisa. O Dr. Amano fecha os olhos.',
    'Quando você termina, a Presidente espera cinco segundos inteiros antes de responder.'
  ],
  ef:{flag:['falou_do_rattata'], instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Falou de um bicho só numa sala que só fala em lote'},
      registrar:'Falou do Rattata que corre até a parede, no conselho.'},
  escolhas:[{texto:'Ouvir a resposta.', vai:'c20_resposta'}]
},

c20_falou_das_pessoas:{
  texto:[
    'Você fala das pessoas.',
    'Da moça do berçário que dá nome escondido para ter a quem pedir desculpa. Do rapaz da enfermaria que pediu transferência duas vezes e foi atendido as duas. Da mulher que faz a apresentação de costas para a porta há vinte e sete visitas.',
    'Do voluntário que dorme bem e fez questão de te dizer isso.',
    'Você não acusa ninguém. Você só conta o que viu.',
    'E é assim que a sala muda: porque ninguém aqui esperava ser acusado do que eles fazem com os bichos, e ninguém aqui tinha pensado no que fazem com a própria equipe.',
    'A Presidente não responde por cinco segundos. Depois por mais cinco.'
  ],
  ef:{flag:['falou_das_pessoas'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Contou o que o trabalho faz com quem trabalha'},
      registrar:'Falou no conselho sobre o que o galpão 4 faz com as pessoas que trabalham nele.'},
  escolhas:[{texto:'Ouvir a resposta.', vai:'c20_resposta'}]
},

c20_uma_pergunta_so:{
  texto:[
    '"Eu não vou usar os cinco minutos."',
    'A Sra. Hidaka levanta os olhos da ata.',
    '"Eu vou fazer uma pergunta e sentar."',
    'Silêncio.',
    '"Quantos dos senhores já entraram no galpão 4?"',
    'Ninguém responde por sete segundos inteiros, que numa sala com onze pessoas é um tempo enorme.',
    'Depois o Curador Ren levanta a mão. Depois a Presidente levanta a mão.',
    'Duas mãos de onze.'
  ],
  ef:{flag:['fez_a_pergunta_das_maos'], instabilidade:2,
      rep:{eixo:'bom',delta:3,motivo:'Fez uma pergunta em vez de um discurso'},
      registrar:'Duas de onze pessoas do conselho já entraram no galpão 4.'},
  escolhas:[{texto:'Ouvir a resposta.', vai:'c20_resposta'}]
},

c20_leu_o_art19:{
  texto:[
    'Você abre o estatuto na página quarenta e lê o Art. 19 em voz alta, sem comentar, do jeito que está escrito.',
    'Unidades que não atinjam os parâmetros de viabilidade serão objeto de descarte, na forma do regulamento interno.',
    'Depois fecha o estatuto e não fala mais nada.',
    'Quarenta segundos de silêncio. Quarenta segundos numa reunião de conselho é uma eternidade e todo mundo aguenta, porque eles são educados.',
    'A advogada da mesa é a primeira a falar, e fala baixo, para a mesa.',
    '"Fui eu que redigi esse artigo."',
    'Ela olha para a própria pasta.',
    '"Eu redigi assim para ser estreito. Eu escrevi na forma do regulamento interno justamente para amarrar. E hoje eu sei que amarrar e autorizar é a mesma frase."'
  ],
  ef:{flag:['leu_o_art19_no_conselho','sabe_do_art19'], instabilidade:2,
      npc:{nome:'a advogada do conselho', opiniao:2, memoria:'Admitiu, em voz alta, que redigiu o Art. 19 tentando amarrar.'},
      rep:{eixo:'bom',delta:2,motivo:'Leu o artigo deles para eles, sem comentar'},
      registrar:'A advogada do conselho redigiu o Art. 19 para restringir e entendeu que autorizou.'},
  escolhas:[{texto:'Ouvir a resposta da Presidente.', vai:'c20_resposta'}]
},

c20_resposta:{
  texto:[
    '"Obrigada." Ela diz isso sem ironia nenhuma. "É a primeira manifestação presencial de interessado em um ano e oito meses. Vai constar na ata com o seu nome."',
    '"Agora eu vou responder, e eu peço que o senhor me ouça com a mesma atenção, porque eu ouvi."',
    COMISSAO.doutrina[0],
    COMISSAO.doutrina[1],
    COMISSAO.doutrina[2],
    '"Eu fui diretora de fiscalização da Liga por nove anos. Eu assinei setenta e um relatórios sobre risco populacional. Nenhum virou política pública. Nenhum."',
    '"No septuagésimo segundo, eu pedi demissão e fundei isto aqui."',
    'Ela junta as mãos.',
    '"O galpão 4 é indefensável. Eu sei. Eu votei a favor do Art. 19, eu durmo mal por causa dele, e eu votaria de novo, porque a alternativa era não produzir, e não produzir é aceitar o número que a gente tinha antes."',
    '"Eu não vou te pedir que concorde. Eu vou fazer uma pergunta, e ela é honesta:"',
    d=>`"${d.jogador.nome}, o que o senhor faria no meu lugar?"`
  ],
  ef:{flag:'presidente_perguntou'},
  escolhas:[
    {texto:'"Eu fecharia. Hoje. E aceitaria o número."', vai:'c20_fechar'},
    {texto:'"Eu manteria os viveiros e acabaria com o Art. 19."', vai:'c20_reforma'},
    {texto:'"Eu não sei. Mas isso não te autoriza."', vai:'c20_nao_autoriza'},
    {texto:'"Eu perguntaria quem elegeu vocês."', vai:'c20_quem_elegeu'},
    {texto:'"Eu entraria no galpão uma vez por semana."', vai:'c20_entraria_no_galpao'},
    {texto:'"Eu faria exatamente o que a senhora faz."', vai:'c20_concordar'},
    {texto:'Não responder. Derrubar tudo agora.', vai:'c20_luta_presidente'}
  ]
},

c20_fechar:{
  texto:[
    '"Eu fecharia. Hoje. E aceitaria o número."',
    '"O número são pessoas." A voz dela não muda. "Trinta e uma ocorrências graves por ano. Onze crianças em quatro anos."',
    '"Eu sei."',
    '"O senhor aceitaria isso."',
    '"Eu aceitaria isso, porque o outro lado do número está numa planilha pendurada num prego, tem quatro dígitos, e ninguém nunca votou nele."',
    'Silêncio na sala oval.',
    'Uma conselheira anota. Outra olha para a Presidente. O Curador Ren, pela primeira vez, levanta a cabeça.'
  ],
  ef:{flag:'defendeu_fechar', rep:{eixo:'bom',delta:2,motivo:'Defendeu o fim do programa diante do conselho inteiro'}},
  escolhas:[
    {texto:'Pedir votação. Pelo estatuto.', vai:'c20_votacao'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'},
    {texto:'"E se eu estiver errado?"', vai:'c20_e_se_eu_estiver_errado'}
  ]
},

c20_e_se_eu_estiver_errado:{
  texto:[
    '"E se eu estiver errado?"',
    'Você diz isso na frente de onze pessoas que passaram dois anos tendo certeza.',
    'A Presidente demora a responder, e quando responde, responde mais devagar do que falou a manhã inteira.',
    '"Aí o senhor vai ter defendido uma coisa que custou vidas de gente." Ela apoia as mãos na mesa. "E vai viver com isso, como eu vivo com o meu lado."',
    'Ela olha para a mesa inteira.',
    '"É isso que ninguém entende sobre esta sala. Aqui dentro não tem ninguém confortável. Tem gente que escolheu de que lado ia ficar mal."'
  ],
  ef:{flag:'perguntou_se_estava_errado', instabilidade:1, moral:3,
      npc:{nome:'Reika Ando', opiniao:3, memoria:'Você perguntou, na frente da mesa, e se estivesse errado.'},
      rep:{eixo:'bom',delta:2,motivo:'Admitiu dúvida numa sala cheia de certezas'},
      registrar:'Perguntou em voz alta se estava errado, na frente do conselho.'},
  escolhas:[
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'}
  ]
},

c20_reforma:{
  texto:[
    '"Eu manteria os viveiros e acabaria com o Art. 19."',
    'A Presidente inclina a cabeça um grau.',
    '"Trinta e um por cento das unidades não atingem viabilidade. Sem descarte, elas vivem: com dor, sem autonomia, consumindo recurso de viveiro."',
    '"Então parem de produzir trinta e um por cento a mais."',
    '"Isso reduz a liberação em um terço e aumenta o custo por unidade em quarenta e quatro por cento."',
    '"Eu sei. Eu li a ata."',
    'Pela primeira vez, alguém na mesa fala além da Presidente. É o Curador Ren.',
    '"Custo por unidade não é argumento moral", ele diz, olhando a mesa e não ela. "Isso está na minha declaração de voto de onze meses atrás. Página quatro."'
  ],
  ef:{flag:'defendeu_reforma',
      rep:{eixo:'bom',delta:2,motivo:'Propôs uma reforma viável no conselho, em vez de um discurso'},
      npc:{nome:'Curador Ren', opiniao:3, memoria:'Falou na mesa pela primeira vez depois da sua proposta.'}},
  escolhas:[
    {texto:'Pedir votação. Pelo estatuto.', vai:'c20_votacao'},
    {texto:'"E o senhor, doutor? O senhor é veterinário."', vai:'c20_o_veterinario'},
    {texto:'Sair. Você plantou o que dava.', vai:'c20_saiu_sala'}
  ]
},

c20_nao_autoriza:{
  texto:[
    '"Eu não sei. Mas isso não autoriza a senhora."',
    'A Presidente fica em silêncio por muito tempo.',
    '"Não", ela concorda. "Não autoriza."',
    '"Eu não tenho autorização de ninguém. Eu tenho um estatuto que eu mesma escrevi e onze pessoas que concordaram comigo."',
    '"Isso não é legitimidade. Isso é organização."',
    'Ela olha para a janela.',
    '"Eu penso nisso todo domingo à noite, e toda segunda às dez da manhã eu abro esta reunião assim mesmo, porque a alternativa é ninguém fazer nada, e eu já vi como é ninguém fazer nada. Foram nove anos."'
  ],
  ef:{flag:'desarmou_presidente',
      rep:{eixo:'bom',delta:2,motivo:'Encontrou a frase para a qual a Presidente não tem resposta'}},
  escolhas:[
    {texto:'"Então legitima. Abre para eleição."', vai:'c20_abrir_eleicao'},
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar.', vai:'c20_publicar_tudo'},
    {texto:'"Então eu paro a senhora."', vai:'c20_luta_presidente'}
  ]
},

c20_abrir_eleicao:{
  texto:[
    '"Então legitima. Abre para eleição."',
    '"Eleição entre quem?"',
    '"Entre quem quiser se associar. Vocês são uma associação civil. Qualquer pessoa pode se associar. Está no estatuto de vocês, Art. 6º."',
    'A advogada da mesa vira as páginas depressa e confirma com a cabeça.',
    'A Presidente não olha o estatuto, porque ela sabe.',
    '"Está." Ela fala devagar. "E em um ano e oito meses, além dos onze fundadores, nós temos três associados, e os três são parentes de conselheiro."',
    '"Porque ninguém sabe que dá."',
    '"Porque ninguém sabe que dá", ela repete, e alguma coisa no rosto dela muda de lugar.'
  ],
  ef:{flag:['propos_eleicao','sabe_do_art6'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Achou, no estatuto deles, a porta que ninguém abriu'},
      registrar:'Art. 6º: qualquer pessoa pode se associar à CGRB. Em 20 meses, três se associaram.'},
  escolhas:[
    {texto:'"Eu quero me associar. Agora."', vai:'c20_se_associou'},
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar que dá para se associar.', vai:'c20_publicar_tudo'}
  ]
},

c20_se_associou:{
  texto:[
    '"Eu quero me associar. Agora."',
    'A sala inteira olha para a advogada, que confere, e depois para a Sra. Hidaka, que já está tirando uma folha de papel da pasta.',
    '"Ficha de proposta de associado", diz a Sra. Hidaka, sem nenhuma emoção. "Nome, qualificação, endereço e duas assinaturas de associados proponentes."',
    'Duas assinaturas.',
    'A sala fica muito quieta.',
    'O Curador Ren assina primeiro. A Dra. Akane Kurogane assinaria se estivesse aqui.',
    d=>d.flags.alcina_volta
      ? 'A Dra. Kurogane, que voltou hoje, assina em segundo, e a caneta dela falha na primeira letra.'
      : 'A segunda assinatura demora quatro minutos e vem do veterinário, que assina sem olhar para ninguém.'
  ],
  ef:{flag:['virou_associado'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Entrou na associação pela porta da frente, para votar dentro dela'},
      npc:{nome:'Curador Ren', opiniao:3, memoria:'Foi o primeiro a assinar a sua proposta de associado.'},
      registrar:'Virou associado da CGRB, com direito de voto em assembleia.'},
  escolhas:[
    {texto:'Pedir votação agora.', vai:'c20_votacao'},
    {texto:'"E quando é a próxima assembleia?"', vai:'c20_proxima_assembleia'}
  ]
},

c20_proxima_assembleia:{
  texto:[
    '"Assembleia geral ordinária é em março", diz a Sra. Hidaka, sem consultar nada. "Extraordinária pode ser convocada por um quinto dos associados."',
    'Um quinto de catorze é três.',
    'Você faz essa conta em voz alta, sem querer, e a sala inteira faz junto.',
    'A Presidente fecha a pasta.',
    '"O senhor entendeu rápido." Ela não parece nem contrariada nem impressionada. "Eu escrevi esse estatuto para ser à prova de mim mesma, e o senhor acabou de achar a porta em vinte minutos."',
    '"E a senhora vai fechar a porta?"',
    '"Se eu fechar, eu deixo de ser o que eu escrevi que eu era." Ela olha a Sra. Hidaka. "Registra a proposta."'
  ],
  ef:{flag:['sabe_da_assembleia'], 
      npc:{nome:'Reika Ando', opiniao:2, memoria:'Registrou a sua proposta de associado sabendo o que isso abre.'},
      registrar:'Assembleia extraordinária pode ser convocada por três associados.'},
  escolhas:[
    {texto:'Pedir votação agora mesmo.', vai:'c20_votacao'},
    {texto:'Sair e voltar em março.', vai:'c20_saiu_sala'}
  ]
},

c20_quem_elegeu:{
  texto:[
    '"Eu perguntaria quem elegeu a senhora."',
    '"A assembleia de associados." Ela responde no mesmo segundo, porque a resposta existe.',
    '"E quem são os associados?"',
    'Ela abre a boca e não fala.',
    'A advogada da mesa vira uma página. O contador olha para o teto. O Sr. Maki abre os olhos.',
    '"Catorze pessoas", diz a Presidente. "Onze fundadores e três parentes."',
    '"Então a senhora elegeu a senhora."',
    '"Sim." Ela não tenta amaciar. "Foi exatamente isso que aconteceu, e está tudo registrado, e o senhor acabou de ser a primeira pessoa a dizer em voz alta nesta sala."'
  ],
  ef:{flag:['desarmou_presidente','sabe_do_art6'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Fez a pergunta de uma linha que o conselho não sabia responder'},
      registrar:'Catorze associados elegem o conselho: onze fundadores e três parentes.'},
  escolhas:[
    {texto:'"Então abre para eleição."', vai:'c20_abrir_eleicao'},
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar isso.', vai:'c20_publicar_tudo'}
  ]
},

c20_entraria_no_galpao:{
  texto:[
    '"Eu entraria no galpão uma vez por semana."',
    'A Presidente não entende no primeiro segundo.',
    '"Como medida de quê?"',
    '"De nada. Não é medida. É só entrar."',
    'Você olha a mesa inteira antes de continuar.',
    '"Duas pessoas nesta sala já entraram lá. As outras nove votam no Art. 19 toda quinzena e nunca viram para onde ele leva."',
    '"E isso mudaria alguma coisa?"',
    '"Eu não sei. Mas se não mudar nada, aí a senhora tem razão sobre tudo, e eu vou embora sem ter mais argumento."'
  ],
  ef:{flag:['propos_a_visita_obrigatoria'], instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Propôs a única coisa que ninguém nessa mesa tinha proposto'},
      registrar:'Propôs ao conselho que todos entrassem no galpão 4 uma vez por semana.'},
  escolhas:[
    {texto:'Pedir votação sobre isso.', vai:'c20_votacao'},
    {texto:'"Comecem hoje. Agora."', vai:'c20_comecem_hoje'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'}
  ]
},

c20_comecem_hoje:{
  texto:[
    '"Comecem hoje. Agora. A Rota 21 é a duas horas de carro e a reunião acaba às onze e quarenta."',
    'Ninguém responde.',
    'A Presidente olha o relógio de pulso, e o gesto é involuntário e todo mundo vê.',
    '"Eu tenho compromisso às quinze", diz alguém, e a frase fica pendurada no ar de um jeito insuportável.',
    'A Sra. Hidaka, na ponta da mesa, para de escrever e não escreve mais nada por um tempo.',
    'Depois a Presidente fecha a pasta.',
    '"Eu vou." Ela diz isso sem olhar para ninguém. "Quem quiser vai comigo. Quem não quiser não precisa justificar nada, e isso vai constar em ata assim mesmo."'
  ],
  ef:{flag:['conselho_vai_ao_galpao'], instabilidade:1,
      rep:{eixo:'bom',delta:4,motivo:'Fez um conselho inteiro sair da sala e ir ver'},
      npc:{nome:'Reika Ando', opiniao:3, memoria:'Levantou da mesa e foi ao galpão no meio de uma reunião.'},
      registrar:'A Presidente levantou da reunião para ir à Estação 4. Quem quisesse ia junto.'},
  escolhas:[
    {texto:'Ver quantos levantam.', vai:'c20_quantos_levantam'}
  ]
},

c20_quantos_levantam:{
  texto:[
    'Levantam quatro.',
    'A Presidente. O Curador Ren. A advogada que redigiu o Art. 19. E o Sr. Tetsuo Maki, de oitenta e um anos, que leva quarenta segundos para levantar e não aceita ajuda de ninguém.',
    'O veterinário fica sentado, e diz por quê, em voz alta, para a ata:',
    '"Eu vou na quinta. Hoje eu tenho cirurgia às duas e é de um bicho de verdade, e eu não vou desmarcar por simbolismo."',
    'Sete ficam. Quatro vão.',
    'A Sra. Hidaka escreve tudo, os nomes dos quatro e os nomes dos sete, porque ata é ata.'
  ],
  ef:{flag:['quatro_foram'], instabilidade:1,
      registrar:'Quatro conselheiros foram ao galpão 4. Sete ficaram, e os nomes dos onze constam em ata.'},
  escolhas:[
    {texto:'Ir com eles.', vai:'c20_foi_com_eles'},
    {texto:'Ficar e pedir votação aos sete que sobraram.', vai:'c20_votacao'}
  ]
},

c20_foi_com_eles:{
  texto:[
    'Duas horas de carro em silêncio quase completo. Na rodovia, o Sr. Maki adormece com a cabeça no vidro.',
    'Na Estação 4, o Sr. Daimon abre o portão e não entende por que a Presidente veio numa segunda.',
    'Eles entram no galpão 4 pela porta que não tranca.',
    'A Presidente fica quatro minutos. A advogada fica dois e sai. O Curador Ren fica até o fim, encostado na parede, olhando o quadro que ele mesmo mandou pendurar.',
    'O Sr. Maki fica onze minutos e não fala nada, e depois pede para sentar, e sentam ele numa cadeira de plástico no corredor coberto.',
    'Na volta, no carro, ele diz a única frase do dia inteiro.',
    '"Em 1971 eu contei quatro mil e oitenta e eu achava que estava sendo o pessimista."'
  ],
  ef:{flag:['levou_o_conselho_ao_galpao'], instabilidade:2, moral:3,
      rep:{eixo:'bom',delta:3,motivo:'Levou quatro conselheiros para dentro do galpão'},
      registrar:'Quatro conselheiros entraram no galpão 4. O Sr. Maki ficou onze minutos.'},
  escolhas:[
    {texto:'Voltar para Saffron e pedir votação na próxima sessão.', vai:'c20_votacao'},
    {texto:'Publicar que o conselho foi.', vai:'c20_publicar_tudo'}
  ]
},

c20_concordar:{
  texto:[
    '"Eu faria exatamente o que a senhora faz."',
    'A sala fica quieta.',
    '"Isso é uma coisa muito séria de se dizer numa reunião que está sendo registrada em ata", diz a Presidente.',
    '"Eu sei."',
    'Ela olha para a Sra. Hidaka. "Registra."',
    'Depois para você.',
    '"Tem uma cadeira vaga nesta mesa desde março. Ela é de conselheiro titular, com direito a voto."',
    '"O senhor tem quinze anos, o que é um problema jurídico que eu resolvo em três semanas."'
  ],
  ef:{flag:'aceitou_cadeira_conselho',
      rep:{eixo:'ruim',delta:3,motivo:'Aceitou uma cadeira no conselho da Comissão'},
      executar:d=>{ Historia.definirVia('foragido','assumiu uma cadeira no conselho da Comissão'); return []; },
      registrar:'Aceitou a cadeira de conselheiro titular da CGRB.'},
  escolhas:[
    {texto:'Aceitar a cadeira.', vai:'c20_virou_conselheiro'},
    {texto:'"Não. Eu menti para ver o que a senhora ia oferecer."', vai:'c20_mentiu_conselho'},
    {texto:'"Eu aceito, e o meu primeiro voto é pela revogação do Art. 19."', vai:'c20_aceitou_e_virou'}
  ]
},

c20_aceitou_e_virou:{
  texto:[
    '"Eu aceito, e o meu primeiro voto é pela revogação do Art. 19."',
    'A Presidente não muda de expressão.',
    '"Então a senhora me recrutou para perder", ela diz, e demora um segundo até você entender que ela está falando consigo mesma.',
    'Ela olha a mesa.',
    '"É legítimo." Ela assente para a Sra. Hidaka. "Registra a posse e registra a matéria."',
    'E aí, com uma calma que te assusta mais que qualquer ameaça:',
    '"Eu prefiro perder para dentro do que continuar ganhando sozinha."'
  ],
  ef:{flag:['virou_conselheiro_contra'], limpaFlag:'aceitou_cadeira_conselho',
      rep:{eixo:'bom',delta:3,motivo:'Entrou no conselho para votar contra ele'},
      executar:d=>{ Historia.definirVia(d.viaAnterior || 'heroi', 'entrou no conselho para votar contra'); return []; },
      registrar:'Aceitou a cadeira e propôs, como primeiro voto, a revogação do Art. 19.'},
  escolhas:[{texto:'Pedir votação.', vai:'c20_votacao'}]
},

c20_mentiu_conselho:{
  texto:[
    '"Não. Eu menti para ver o que a senhora ia oferecer."',
    'A Presidente não se irrita. Ela parece, de todas as coisas possíveis, aliviada.',
    '"Bom." Ela anota alguma coisa na pasta. "Eu ia ter que conviver com isso."',
    '"Com o quê?"',
    '"Com ter recrutado a única pessoa em um ano e oito meses que apareceu por conta própria." Ela fecha a caneta. "Isso teria sido a coisa mais feia que eu já fiz, e eu aprovei o Art. 19."'
  ],
  ef:{limpaFlag:'aceitou_cadeira_conselho',
      rep:{eixo:'bom',delta:3,motivo:'Recusou uma cadeira no conselho depois de arrancar a oferta'},
      flag:'recusou_a_cadeira',
      executar:d=>{ Historia.definirVia(d.viaAnterior || 'heroi', 'recusou a cadeira do conselho'); return []; }},
  escolhas:[
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'}
  ]
},

c20_virou_conselheiro:{
  texto:[
    'Você assina a ata como interessado e, três semanas depois, como conselheiro titular com direito a voto.',
    'A primeira reunião de que você participa vota a Fase II-B: ampliação para a Rota 14.',
    'Você levanta a mão junto com os outros.',
    'O Curador Ren vota contra. Sozinho. Como sempre.',
    'Na saída, ele te espera no corredor e não diz nada. Só olha.',
    'Você vai lembrar desse olhar por muito tempo, e vai continuar votando.'
  ],
  ef:{flag:['conselheiro_da_comissao','tem_sangue_nas_maos'],
      dinheiro:60000, moral:-25, instabilidade:2,
      rep:{eixo:'ruim',delta:3,motivo:'Passou a votar a expansão dos viveiros'},
      npc:{nome:'Curador Ren', opiniao:-6, memoria:'Te viu levantar a mão a favor da Fase II-B.'},
      registrar:'Tornou-se conselheiro titular da CGRB e votou a favor da expansão.'},
  escolhas:[{texto:'Seguir.', vai:'c20_fim'}]
},

/* ── A votação ──────────────────────────────────────────── */
c20_votacao:{
  texto:[
    '"Eu quero votação."',
    'A Presidente olha para a Sra. Hidaka, que confere o estatuto.',
    '"Art. 27, §3º: interessado pode propor matéria, que será submetida a voto na mesma sessão, a critério da mesa."',
    '"A critério da mesa", repete a Presidente.',
    'Ela olha a sala inteira, uma pessoa por vez, e leva quase meio minuto para fazer isso.',
    '"Submeto." Ela assente para a secretária. "Qual é a matéria?"'
  ],
  ef:{flag:'votacao_aberta'},
  escolhas:[
    {texto:'Revogação do Art. 19 e suspensão da Fase II.', vai:'c20_materia_art19'},
    {texto:'Exibição do livro de reuniões fechadas, do Art. 33.', vai:'c20_materia_livro', cond:d=>!!d.flags.sabe_do_livro_fechado},
    {texto:'Visita obrigatória de todo conselheiro ao galpão 4.', vai:'c20_materia_visita'},
    {texto:'Abertura de edital de associados, pelo Art. 6º.', vai:'c20_materia_edital', cond:d=>!!d.flags.sabe_do_art6}
  ]
},

c20_materia_art19:{
  texto:[
    '"Revogação do Art. 19 e suspensão da Fase II até revisão do protocolo de descarte."',
    'A Sra. Hidaka escreve a matéria e lê em voz alta, palavra por palavra, para conferência, como manda o procedimento.',
    'A Presidente confirma a redação.',
    'Onze cadeiras com direito a voto, mais o dela em caso de empate.',
    'E, do lado de fora, no corredor, a garrafa térmica esfriando numa mesinha dobrável.'
  ],
  ef:{flag:'materia_art19'},
  escolhas:[{texto:'Ouvir a votação.', vai:'c20_contagem'}]
},

c20_materia_livro:{
  texto:[
    '"Exibição do livro de reuniões fechadas ao interessado, pelo Art. 27, §3º."',
    'A sala muda de temperatura. É a primeira vez na manhã inteira que alguém nessa mesa parece surpreso de verdade.',
    'A advogada é a primeira a falar.',
    '"O Art. 33 diz acesso restrito ao Conselho."',
    '"E o Art. 27, §3º diz que o Conselho pode deliberar sobre matéria proposta por interessado", diz a Sra. Hidaka, sem levantar os olhos da ata. "Os dois são do mesmo estatuto e não se contradizem: o Conselho pode dar acesso ao que é restrito ao Conselho."',
    'A Presidente olha para a Sra. Hidaka por um tempo comprido.',
    '"Submeto."'
  ],
  ef:{flag:'materia_livro', instabilidade:1,
      npc:{nome:'Sra. Hidaka', opiniao:3, memoria:'Resolveu, em voz alta, a contradição entre o Art. 33 e o Art. 27.'},
      registrar:'Matéria em votação: exibição do livro de reuniões fechadas.'},
  escolhas:[{texto:'Ouvir a votação.', vai:'c20_contagem'}]
},

c20_materia_visita:{
  texto:[
    '"Visita obrigatória de todo conselheiro ao galpão 4, uma vez por mês, com registro de presença em ata."',
    'É a matéria mais estranha que já foi submetida nessa mesa e todo mundo percebe isso ao mesmo tempo.',
    'Não muda protocolo. Não muda orçamento. Não salva nenhuma unidade.',
    'Só obriga onze pessoas a olhar.',
    'A advogada da mesa diz, baixinho: "isso não tem efeito jurídico nenhum."',
    'E a Presidente responde, mais baixinho ainda: "eu sei."',
    '"Submeto."'
  ],
  ef:{flag:'materia_visita',
      registrar:'Matéria em votação: visita mensal obrigatória de todo conselheiro ao galpão 4.'},
  escolhas:[{texto:'Ouvir a votação.', vai:'c20_contagem'}]
},

c20_materia_edital:{
  texto:[
    '"Abertura de edital público de admissão de associados, pelo Art. 6º, com divulgação em jornal de circulação regional."',
    'A advogada fecha os olhos.',
    'O contador faz uma conta no canto do papel e não diz o resultado.',
    'Todo mundo nessa sala entende, em menos de dois segundos, o que essa matéria significa: se passar, em seis meses a assembleia que elege este conselho pode ter trezentas pessoas dentro.',
    'A Presidente demora mais para responder do que demorou em qualquer momento da manhã.',
    '"Submeto." Ela põe as duas mãos na mesa. "E eu quero que conste em ata que fui eu que submeti."'
  ],
  ef:{flag:'materia_edital', instabilidade:1,
      npc:{nome:'Reika Ando', opiniao:3, memoria:'Submeteu à votação a matéria que pode tirar o conselho dela.'},
      registrar:'Matéria em votação: edital público de admissão de associados.'},
  escolhas:[{texto:'Ouvir a votação.', vai:'c20_contagem'}]
},

c20_contagem:{
  texto:[
    'A votação leva quatro minutos e é a coisa mais tensa que já te aconteceu sem nenhuma bola envolvida.',
    'O Curador Ren vota a favor. Primeiro, alto, sem esperar a vez.',
    d=>{
      let votos = 1; // Ren
      const razoes = [];
      if (d.flags.provas_do_galpao4){ votos += 2; razoes.push('Duas conselheiras que viram o material do galpão 4 votam a favor, e uma delas não consegue terminar a frase.'); }
      if (d.flags.provas_do_viveiro || d.flags.provas_do_11){ votos += 1; razoes.push('Uma conselheira que passou a sessão inteira olhando o que você trouxe vota a favor.'); }
      if (d.flags.desarmou_presidente || d.flags.defendeu_reforma){ votos += 1; razoes.push('Uma conselheira diz, antes de votar, que a sua proposta é a primeira que não é um discurso.'); }
      if (d.flags.publicou_as_atas || d.flags.publicou){ votos += 1; razoes.push('Um conselheiro que passou dezenove dias sendo perguntado sobre isso em jantar de família vota a favor.'); }
      if (d.flags.veterinario_vai_propor){ votos += 1; razoes.push('O veterinário vota a favor e pede que conste que ele mesmo vai propor a revisão dos critérios na próxima sessão.'); }
      if (d.flags.levou_o_conselho_ao_galpao || d.flags.quatro_foram){ votos += 2; razoes.push('Os que foram ao galpão votam juntos, e o Sr. Maki vota levantando a bengala em vez da mão, porque o ombro dele não sobe.'); }
      if (d.flags.alcina_volta){ votos += 1; razoes.push('A Dra. Kurogane, de volta à cadeira que ficou vazia desde março, vota a favor sem dizer uma palavra.'); }
      if (d.flags.fez_a_pergunta_das_maos){ votos += 1; razoes.push('Uma conselheira que não levantou a mão quando você perguntou vota a favor, e diz que é por isso.'); }
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=6){ votos += 1; razoes.push('Um conselheiro vota a favor e diz o seu nome como justificativa, o que é constrangedor para todo mundo na sala, inclusive para você.'); }
      if (d.flags.conselheira_confrontada){ razoes.push('A conselheira da Liga não vota: assento de observadora, sem direito a voto. Ela fecha os olhos quando a contagem chega nela.'); }
      if (d.flags.observadora_pode_falar){ razoes.push('A conselheira da Liga pede a palavra pela primeira vez em três anos e fala noventa segundos. Não muda voto nenhum, e muda a sala.'); }
      if (Historia.via()==='mercenario' || Historia.via()==='foragido'){ votos -= 2; razoes.push('Um conselheiro lembra, em voz alta e com documento, de onde vem o seu dinheiro. Dois votos mudam de lado.'); }
      if (d.flags.atacou_o_conselho){ votos -= 3; razoes.push('Alguém lembra que você sacou uma bola dentro desta sala. Isso pesa mais que tudo o que você disse.'); }
      Estado.dados.votosComissao = Math.max(0, Math.min(11, votos));
      return razoes.join(' ');
    },
    d=>`Contagem final: ${Estado.dados.votosComissao} votos a favor, ${Math.max(0, 11 - Estado.dados.votosComissao)} contra.`
  ],
  escolhas:[{texto:'Ver o resultado.', vai:'c20_resultado_votacao'}]
},

c20_resultado_votacao:{
  texto:[
    d=>{
      const v = Estado.dados.votosComissao || 0;
      if (v >= 6) return 'Aprovada.';
      if (v === 5) return 'Empate em cinco a cinco, com uma abstenção. O desempate é da Presidência.';
      return 'Rejeitada.';
    },
    d=>{
      const v = Estado.dados.votosComissao || 0;
      if (v >= 6) return 'A Presidente ouve a contagem, assente uma vez, e diz "aprovada" com a mesma voz com que abriu a reunião. A Sra. Hidaka anota. Acabou assim, numa sala comercial, num prédio com farmácia no térreo.';
      if (v === 5) return 'A sala inteira olha para ela. Ela fica quieta por onze segundos.\n\n"Eu voto a favor."\n\nE depois, antes que alguém respire: "e eu quero que conste que eu levei um ano e oito meses e uma pessoa de fora para fazer isso."';
      return 'A Presidente ouve a contagem e não comemora. Ela agradece a sua manifestação, registra em ata, e retoma a pauta de onde parou — item 4, cronograma de liberação.';
    },
    d=>{
      const v = Estado.dados.votosComissao || 0;
      if (v < 5) return 'Você fica sentado. A reunião continua por mais uma hora e quarenta e você fica sentado até o fim, porque sair agora seria dizer que veio fazer discurso.';
      return 'Do lado de fora, no corredor, a garrafa térmica de café está fria e ninguém foi recolher.';
    }
  ],
  ef:{executar:d=>{
        const v = d.votosComissao || 0;
        const avisos = [];
        if (d.flags.votou_uma_vez) Estado.marcar('segunda_materia'); else Estado.marcar('votou_uma_vez');
        const mat = d.flags.materia_livro ? 'livro'
                  : d.flags.materia_visita ? 'visita'
                  : d.flags.materia_edital ? 'edital' : 'art19';
        if (v >= 5){
          if (mat === 'art19'){
            Estado.marcar('art19_revogado');
            if (v >= 6) Estado.marcar('fase2_suspensa');
            Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade - (v>=6?2:1));
            Estado.mudarRep('bom', v>=6?4:2, 'Revogou o Art. 19 pelo voto, dentro da sala', {rep:{notorio:true, peso:3}});
            avisos.push({tipo:'rep', texto: v>=6
              ? 'O Art. 19 foi revogado e a Fase II, suspensa. Você fez isso com uma votação.'
              : 'O Art. 19 caiu. A Fase II continua no cronograma.'});
          } else if (mat === 'livro'){
            Estado.marcar('viu_o_livro_fechado'); Estado.marcar('provas_do_11');
            Estado.mudarRep('bom', 3, 'Fez o conselho abrir o próprio livro fechado', {rep:{notorio:true, peso:3}});
            avisos.push({tipo:'rep', texto:'O conselho votou a exibição do livro de reuniões fechadas.'});
          } else if (mat === 'visita'){
            Estado.marcar('visita_obrigatoria_aprovada');
            Estado.mudarRep('bom', 3, 'Obrigou onze pessoas a olhar uma vez por mês', {rep:{notorio:true, peso:3}});
            avisos.push({tipo:'rep', texto:'Todo conselheiro passa a entrar no galpão 4 uma vez por mês, com presença em ata.'});
          } else {
            Estado.marcar('edital_aprovado');
            Estado.mudarRep('bom', 4, 'Abriu a associação para qualquer pessoa de Kanto', {rep:{notorio:true, peso:3}});
            avisos.push({tipo:'rep', texto:'O edital de associados foi aprovado. A assembleia que elege o conselho deixa de ter catorze pessoas.'});
          }
        } else {
          Estado.marcar('votacao_perdida');
          Estado.mudarRep('bom', 1, 'Perdeu a votação e ficou até o fim da sessão', {rep:{notorio:true, peso:3}});
          avisos.push({tipo:'info', texto:'Você perdeu. E ficou sentado até o fim da sessão, que durou mais uma hora e quarenta.'});
        }
        return avisos;
      }},
  escolhas:[
    {texto:'Ver o livro que acabou de ser aberto.', vai:'c20_abriram_o_livro', cond:d=>!!d.flags.viu_o_livro_fechado},
    {texto:'Propor outra matéria na mesma sessão.', vai:'c20_votacao', cond:d=>!d.flags.segunda_materia},
    {texto:'Sair da sala.', vai:'c20_saiu_sala'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'},
    {texto:'"Então eu resolvo do meu jeito."', vai:'c20_luta_presidente',
     cond:d=>!d.flags.art19_revogado}
  ]
},

c20_abriram_o_livro:{
  texto:[
    'A Sra. Hidaka abre o armário com a mesma chave que abre a porta da frente e põe o livro na mesa.',
    'Capa dura preta, páginas numeradas, nove atas.',
    'As oito primeiras são sobre contratação de vigilância, sobre um processo trabalhista e sobre a compra de um terreno que não se concretizou.',
    'A nona tem três linhas.',
    'Reunião fechada. Deliberação única: aprovada, por unanimidade, a continuidade do Projeto Matriz, com aporte do centro de custo 11, condicionada à localização do Risco 01.',
    'Condicionada à localização do Risco 01.',
    'Tudo isso — a Fase II, a Fase III, o galpão, quatro mil e cento e nove — depende de eles acharem uma coisa que está solta em Kanto há dois anos.'
  ],
  ef:{flag:['leu_o_livro_fechado','sabe_da_fase3','sabe_do_risco01','provas_do_11'], instabilidade:2,
      rep:{eixo:'bom',delta:3,motivo:'Leu o livro que o estatuto dizia ser restrito'},
      registrar:'A nona ata fechada: o Projeto Matriz continua, condicionado à localização do Risco 01.'},
  escolhas:[
    {texto:'"E se eu achar ele primeiro?"', vai:'c20_se_eu_achar_primeiro'},
    {texto:'Propor outra matéria.', vai:'c20_votacao'},
    {texto:'Sair e publicar isso.', vai:'c20_publicar_tudo'},
    {texto:'Sair da sala.', vai:'c20_saiu_sala'}
  ]
},

c20_se_eu_achar_primeiro:{
  texto:[
    '"E se eu achar ele primeiro?"',
    'A Presidente fecha o livro devagar.',
    '"Aí o senhor vai ter na mão uma coisa que doze pessoas procuram há dois anos, e o senhor vai ter que decidir sozinho o que fazer com ela." Ela empurra o livro de volta para a Sra. Hidaka. "Que é exatamente a situação que esta associação foi criada para não existir."',
    'Ela olha para você por um tempo comprido.',
    '"E o senhor vai fazer melhor do que nós, provavelmente, porque o senhor vai ter olhado para ele na cara."',
    'Ela abre a pasta e volta para a pauta.',
    '"Item quatro."'
  ],
  ef:{flag:['sabe_do_risco01'], instabilidade:1,
      npc:{nome:'Reika Ando', opiniao:2, memoria:'Admitiu que você faria melhor por ter olhado na cara.'},
      registrar:'A Presidente sabe que você pode achar o Risco 01 antes deles.'},
  escolhas:[
    {texto:'Sair da sala.', vai:'c20_saiu_sala'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'}
  ]
},

/* ── Publicar ───────────────────────────────────────────── */
c20_publicar_tudo:{
  texto:[
    'Você sai da sala 704 e leva tudo o que tem para quem publica.',
    d=>d.flags.provas_do_galpao4
       ? 'Dessa vez é diferente, porque dessa vez você tem a planilha. Trinta e nove páginas, dois anos, quatro dígitos, com assinatura de responsável em cada linha.'
       : 'Você tem as atas, que são públicas, e a sua palavra, que não é prova.',
    'A pergunta agora não é se você publica. É onde, e com quem, e como.'
  ],
  ef:{flag:'vai_publicar'},
  escolhas:[
    {texto:'Izumi Hashi, jornal de Celadon.', vai:'c20_pub_isaura', cond:d=>!!d.flags.contato_isaura},
    {texto:'Nozomi Arata, rádio comunitária de Fuchsia.', vai:'c20_pub_nadia', cond:d=>!!d.flags.contato_nadia},
    {texto:'A Dra. Sayo Serizawa, e pelo caminho do Ministério Público.', vai:'c20_pub_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Qualquer redação que aceite.', vai:'c20_pub_qualquer'}
  ]
},

c20_pub_isaura:{
  texto:[
    'Izumi Hashi lê tudo em silêncio por uma hora e vinte, com um lápis, marcando as páginas com tirinhas de papel.',
    'Quando termina, ela faz três perguntas.',
    '"Você tem a ata da reunião de hoje?" Ainda não, sai em cinco dias. "Você consegue?" Consigo, é pública. "Você aceita esperar cinco dias?"',
    'Você aceita.',
    'Ela publica no sexto dia, com a ata da sessão reproduzida inteira ao lado da planilha, e com a hora em que você pediu a palavra impressa na legenda.'
  ],
  ef:{flag:['publicou','publicou_as_atas'],
      rep:{eixo:'bom',delta:3,motivo:'Esperou cinco dias para publicar com a ata junto'},
      registrar:'A matéria saiu com a planilha e a ata da sessão lado a lado.'},
  escolhas:[{texto:'Ver o que acontece.', vai:'c20_resultado_publicacao'}]
},

c20_pub_nadia:{
  texto:[
    'Nozomi Arata tem um programa das seis da manhã numa rádio comunitária de Fuchsia e uma audiência de gente que está acordada às seis da manhã: pescador, motorista, guarda-parque, gente de plantão.',
    'Ela não pede prova, porque ela já sabe. Ela pede outra coisa.',
    '"Você fala ao vivo?"',
    'Você fala ao vivo, das seis e dez às sete, sem corte, respondendo telefonema.',
    'O quarto telefonema é de uma mulher que trabalha na Estação 4 e que não diz o nome, e que confirma tudo em vinte segundos e desliga.',
    'Não vira manchete em lugar nenhum. Vira assunto em Fuchsia inteira por três semanas.'
  ],
  ef:{flag:['publicou','falou_na_radio'],
      rep:{eixo:'bom',delta:3,motivo:'Falou ao vivo, sem corte, e atendeu telefonema'},
      npc:{nome:'Nozomi Arata', opiniao:3, memoria:'Te pôs no ar ao vivo por cinquenta minutos.'},
      registrar:'Falou cinquenta minutos ao vivo na rádio de Fuchsia. Uma funcionária ligou e confirmou.'},
  escolhas:[{texto:'Ver o que acontece.', vai:'c20_resultado_publicacao'}]
},

c20_pub_ivone:{
  texto:[
    'A Dra. Serizawa lê o material em duas horas, sem falar, e depois faz uma coisa que você não esperava: ela chora de raiva por uns quinze segundos e depois continua trabalhando como se nada tivesse acontecido.',
    '"Agora dá." Ela puxa três folhas em branco. "Agora tem tipo penal."',
    '"Qual?"',
    '"Nenhum dos que eu procurei." Ela começa a escrever. "Falsidade ideológica em documento particular equiparado a público, no manifesto de resíduo. É pequeno, é feio, é o que pega."',
    'Ela escreve por quarenta minutos sem levantar a cabeça.',
    '"Capone foi preso por imposto", ela diz, sem parar de escrever. "Eu não tenho vergonha nenhuma."'
  ],
  ef:{flag:['publicou','representacao_no_mp'],
      rep:{eixo:'bom',delta:3,motivo:'Levou o material a quem sabia o que fazer com ele'},
      npc:{nome:'Dra. Sayo', opiniao:4, memoria:'Achou o tipo penal que procurava havia seis meses.'},
      registrar:'A Dra. Serizawa protocolou representação no Ministério Público.'},
  escolhas:[{texto:'Ver o que acontece.', vai:'c20_resultado_publicacao'}]
},

c20_pub_qualquer:{
  texto:[
    'Você bate em quatro redações em três dias.',
    'A primeira pergunta se tem foto. A segunda diz que precisa de posicionamento oficial e que vai pedir, e nunca pede. A terceira agenda e desmarca.',
    'A quarta é um jornal de bairro de Saffron com tiragem de mil e duzentos exemplares e um editor que também é o diagramador.',
    'Ele lê tudo em quarenta minutos, fecha a pasta e diz uma coisa que você vai lembrar por muito tempo.',
    '"Eu vou publicar e ninguém vai ler." Ele já está mexendo na página. "Mas vai existir. Daqui a dez anos, quando alguém for procurar, vai estar aqui, com data."'
  ],
  ef:{flag:['publicou','publicou_no_bairro'],
      rep:{eixo:'bom',delta:2,motivo:'Publicou num jornal de bairro porque era o que tinha'},
      registrar:'Saiu num jornal de bairro de Saffron, tiragem de 1.200.'},
  escolhas:[{texto:'Ver o que acontece.', vai:'c20_resultado_publicacao'}]
},

c20_resultado_publicacao:{
  texto:[
    d=>{
      if (d.flags.provas_do_galpao4 && d.flags.provas_do_viveiro)
        return 'A Comissão emite uma nota. A nota não funciona dessa vez. Em nove dias, o Ministério Público abre inquérito. Em quarenta, a Estação 4 é interditada. Em quatro meses, três conselheiros são indiciados.';
      if (d.flags.provas_do_galpao4)
        return 'A planilha sozinha sustenta a manchete por dois meses. A Estação 4 suspende o descarte para revisão de protocolo e nunca retoma oficialmente.';
      if (d.flags.provas_do_11 || d.flags.leu_o_livro_fechado)
        return 'O livro fechado é o que pega. Uma entidade que publica tudo e guarda nove atas num armário é uma manchete melhor que qualquer planilha, porque cabe numa linha.';
      return 'Sem prova material, a Comissão responde citando o próprio estatuto e o endereço do cartório. Em três semanas o assunto morre outra vez.';
    },
    d=>d.flags.representacao_no_mp
      ? 'A representação da Dra. Serizawa entra no meio disso e muda o ritmo de tudo: com inquérito aberto, a nota de esclarecimento deixa de ser resposta suficiente.'
      : 'A Comissão continua atendendo chamado de ataque em área urbana durante toda a repercussão, e continua sendo mais rápida que a Liga, e isso sai em nenhum jornal.',
    'E a Presidente concede entrevista. Ela concede todas as entrevistas que pedem, sempre, sem exceção, e responde tudo, e é por isso que é difícil.'
  ],
  ef:{executar:d=>{
        const avisos=[];
        if (d.flags.provas_do_galpao4 && d.flags.provas_do_viveiro){
          Estado.marcar('comissao_derrubada'); Estado.marcar('fase2_suspensa');
          Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade-3);
          Estado.mudarRep('bom', 4, 'Derrubou a Comissão com a planilha do galpão 4', {rep:{notorio:true, peso:3}});
          avisos.push({tipo:'rep', texto:'A Estação 4 foi interditada. Três conselheiros indiciados.'});
        } else if (d.flags.provas_do_galpao4){
          Estado.marcar('descarte_suspenso');
          Estado.mudarRep('bom', 3, 'Suspendeu o descarte com a planilha', {rep:{notorio:true, peso:3}});
          avisos.push({tipo:'rep', texto:'O descarte foi suspenso para revisão de protocolo.'});
        } else if (d.flags.provas_do_11 || d.flags.leu_o_livro_fechado){
          Estado.marcar('descarte_suspenso');
          Estado.mudarRep('bom', 3, 'Publicou a existência do livro fechado', {rep:{notorio:true, peso:3}});
          avisos.push({tipo:'rep', texto:'A existência do livro de reuniões fechadas virou o assunto.'});
        } else {
          Estado.mudarRep('bom', 1, 'Publicou o que tinha, que não era o bastante', {rep:{notorio:true, peso:3}});
          avisos.push({tipo:'info', texto:'Sem prova material, durou três semanas.'});
        }
        return avisos;
      },
      flag:'publicou_o_viveiro',
      registrar:'Publicou o material sobre a Estação 4 e a Comissão.'},
  escolhas:[
    {texto:'Ler a entrevista da Presidente.', vai:'c20_entrevista'},
    {texto:'Seguir.', vai:'c20_fim'}
  ]
},

c20_entrevista:{
  texto:[
    'A entrevista tem duas páginas e ela não erra uma vez.',
    'Ela confirma o número. Ela confirma o artigo. Ela confirma a existência do galpão e diz o nome da rua.',
    'E quando perguntam se ela se arrepende, ela responde a coisa mais eficaz que uma pessoa na posição dela pode responder:',
    '"Eu me arrependo de ter feito sozinha."',
    'A última pergunta é sobre você. Ela responde com o seu nome inteiro, correto, e diz que você pediu a palavra pelo Art. 27 e que foi a primeira pessoa a fazer isso.',
    'Depois acrescenta uma frase que o jornal põe em destaque, num quadradinho, em corpo maior:',
    '"Eu gostaria que tivesse sido em 2019, e não gostaria que tivesse sido uma criança."'
  ],
  ef:{flag:'leu_a_entrevista', instabilidade:1, moral:-2,
      registrar:'A Presidente deu entrevista, confirmou tudo e disse que se arrepende de ter feito sozinha.'},
  escolhas:[{texto:'Seguir.', vai:'c20_fim'}]
},

/* ── A luta ─────────────────────────────────────────────── */
c20_luta_presidente:{
  texto:[
    'Você saca uma bola dentro de uma reunião de conselho.',
    'Onze pessoas saem da sala em ordem, sem correr, porque existe um procedimento para isso e eles treinaram.',
    'A Sra. Hidaka sai por último, levando a ata, porque a ata não pode ficar.',
    'A Presidente não sai. Ela tira o paletó e o dobra sobre o encosto da cadeira.',
    '"Eu fui treinadora antes de ser diretora." Ela solta a primeira bola. "Todo mundo foi. É esse o problema deste país."',
    'As unidades dela não têm nome. Têm código de lote: 1-A, 1-B, 1-C, 1-D.',
    'E a última tem só dois dígitos.'
  ],
  ef:{flag:'atacou_o_conselho',
      rep:{eixo:'ruim',delta:2,motivo:'Atacou uma reunião de conselho'}},
  batalha:{comissao:'presidente', nivel:58, tipo:'treinador', treinador:'a Presidente', fuga:false,
           vitoria:'c20_venceu_presidente', derrota:'c20_perdeu_presidente', gameover:'gameover'}
},

c20_venceu_presidente:{
  texto:[
    'A Unidade 01 cai por último.',
    'Você olha ela caída no carpete de uma sala comercial e entende, com um atraso de quatro segundos, o que ela é.',
    'É o décimo segundo tanque. Eles conseguiram.',
    'Não é Mewtwo. É uma coisa com o rosto dele, nível sessenta e três, código de lote e nenhuma pergunta na cabeça.',
    'A Presidente recolhe a bola com cuidado profissional.',
    '"Ela não fala", diz a Presidente, respondendo à pergunta que você não fez. "Nenhuma das quatro tentativas falou. Nós acertamos o corpo e nunca acertamos a outra parte."',
    '"E vocês continuam."',
    '"E nós continuamos." Ela dobra o paletó de novo. "Porque a Fase III não precisa que ela fale. Precisa que ela obedeça."'
  ],
  ef:{flag:['viu_a_unidade01','sabe_da_fase3'], instabilidade:2,
      rep:{eixo:'bom',delta:1,motivo:'Derrotou a Presidente da Comissão na sala dela'},
      registrar:'A Unidade 01 existe: uma cópia de Mewtwo que não fala. A Fase III só precisa que ela obedeça.'},
  escolhas:[
    {texto:'Levar a Unidade 01 embora.', vai:'c20_levou_unidade01'},
    {texto:'Destruir a Unidade 01.', vai:'c20_destruiu_unidade01'},
    {texto:'"Solta ela aqui. Agora. Na minha frente."', vai:'c20_solta_aqui'},
    {texto:'Sair. Você já sabe o que precisava.', vai:'c20_saiu_sala'}
  ]
},

c20_solta_aqui:{
  texto:[
    '"Solta ela aqui. Agora. Na minha frente."',
    'A Presidente olha para a bola na mão e depois para você.',
    '"Para quê?"',
    '"Para a senhora ver ela sem estar lutando."',
    'Ela solta.',
    'A Unidade 01 fica em pé no carpete de uma sala comercial, no meio de uma mesa oval com onze pastas abertas, e não faz nada.',
    'Não ataca, não foge, não olha para a janela. Fica em pé, exatamente onde foi solta, esperando.',
    'Passam quarenta segundos. Ela não muda de posição uma vez.',
    'A Presidente olha por todo esse tempo e, no fim, senta na cadeira dela e apoia a testa nas duas mãos.'
  ],
  ef:{flag:['mostrou_a_unidade01'], instabilidade:2, moral:2,
      npc:{nome:'Reika Ando', opiniao:2, memoria:'Ficou quarenta segundos olhando a Unidade 01 parada, esperando.'},
      rep:{eixo:'bom',delta:2,motivo:'Fez alguém olhar para o que fez sem estar lutando'},
      registrar:'A Unidade 01 ficou quarenta segundos parada no carpete, esperando ordem.'},
  escolhas:[
    {texto:'Levar a Unidade 01 embora.', vai:'c20_levou_unidade01'},
    {texto:'Destruir a Unidade 01.', vai:'c20_destruiu_unidade01'},
    {texto:'Sair sem ela.', vai:'c20_saiu_sala'}
  ]
},

c20_levou_unidade01:{
  texto:[
    'Você tira a bola da mão dela. Ela não impede, e não impedir, aqui, é uma decisão dela.',
    '"Ela vai te obedecer", diz a Presidente. "É para isso que ela existe. O senhor vai descobrir que isso é a pior parte."'
  ],
  ef:{flag:'tem_a_unidade01',
      executar:d=>{
        const p = unidadeComissao(150, 63, '01');
        p.moral = 0;
        p.historia = 'Décima segunda tentativa. A primeira que vingou. Não fala, não pergunta, obedece.';
        const onde = Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv 63) entrou no seu time. Moral 0. Ela vai obedecer a tudo.${notaDestino(onde)}`}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Saiu com uma cópia de Mewtwo na mão'},
      registrar:'Levou a Unidade 01.'},
  escolhas:[{texto:'Sair.', vai:'c20_fim'}]
},

c20_destruiu_unidade01:{
  texto:[
    'Você destrói a Unidade 01 na sala 704, no carpete, com a Presidente olhando.',
    'Ela não tenta impedir. Anota alguma coisa na pasta quando acaba.',
    '"Quarta tentativa perdida", ela diz. "Dezoito meses de trabalho."',
    'E aí, pela única vez na manhã inteira, a voz dela falha:',
    '"Eu vou ter que aprovar a quinta. O senhor entende isso? O senhor acabou de me obrigar a aprovar a quinta."'
  ],
  ef:{flag:['destruiu_a_unidade01','tem_sangue_nas_maos'], instabilidade:1,
      rep:{eixo:'ruim',delta:2,motivo:'Destruiu uma criatura que não escolheu existir'},
      registrar:'Destruiu a Unidade 01. A quinta tentativa foi aprovada por causa disso.'},
  escolhas:[{texto:'Sair.', vai:'c20_fim'}]
},

c20_perdeu_presidente:{
  texto:[
    'Você perde numa sala comercial para uma mulher de tailleur cinza.',
    'Ela chama a enfermaria do prédio — o prédio tem enfermaria, no quarto andar, de um plano de saúde — e espera com você até chegarem.',
    '"Isso vai constar na ata como incidente", ela diz, vestindo o paletó de novo. "Com o seu nome. Eu sinto muito, mas ata é ata."',
    'Ela retoma a reunião no item 4 assim que te levam.'
  ],
  ef:{hp:-8, causa:'Derrota na sala 704',
      executar:d=>{ d.liga.avisos++; return [{tipo:'liga', texto:'O incidente foi registrado em ata, com o seu nome.'}]; },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou um conselho e perdeu'}},
  escolhas:[
    {texto:'Sair do prédio.', vai:'c20_fim'},
    {texto:'Voltar à sala quando conseguir andar.', vai:'c20_voltou_depois'}
  ]
},

c20_voltou_depois:{
  texto:[
    'Você sobe de novo às onze e vinte, com o braço na tipoia que o enfermeiro do quarto andar fez.',
    'A reunião ainda está acontecendo. Item 6.',
    'Você fica na porta e não entra.',
    'A Presidente te vê, para a frase no meio, e diz para a mesa: "suspendo por dois minutos."',
    'Depois olha para você.',
    '"O senhor ainda pode pedir a palavra. O incidente não tira o seu direito, porque o estatuto não prevê isso, e eu não vou inventar."'
  ],
  ef:{flag:'voltou_com_tipoia', moral:2,
      npc:{nome:'Reika Ando', opiniao:2, memoria:'Suspendeu a sessão por dois minutos quando você voltou.'},
      rep:{eixo:'bom',delta:1,motivo:'Voltou depois de perder'},
      registrar:'Voltou à sala 704 depois de perder e ainda tinha direito à palavra.'},
  escolhas:[
    {texto:'Pedir a palavra.', vai:'c20_palavra'},
    {texto:'Ir embora de vez.', vai:'c20_fim'}
  ]
},

c20_saiu_sala:{
  texto:[
    'Você sai da sala 704 e a reunião continua atrás de você.',
    'Dá para ouvir, do corredor, a Sra. Hidaka lendo o item seguinte da pauta em voz normal.',
    'No elevador, você divide o espaço com um conselheiro que desceu para fumar. Ele te cumprimenta com a cabeça e não diz nada durante os sete andares, e no térreo segura a porta para você passar primeiro.',
    'Na calçada tem uma farmácia, uma banca de jornal, gente comprando coisa e trânsito.',
    'Lá em cima a reunião vai acabar às onze e quarenta, como todas.'
  ],
  escolhas:[
    {texto:'Sair do prédio.', vai:'c20_fim'},
    {texto:'Voltar e publicar tudo.', vai:'c20_publicar_tudo'},
    {texto:'Esperar a reunião acabar na calçada.', vai:'c20_esperou_na_calcada'}
  ]
},

c20_esperou_na_calcada:{
  texto:[
    'Onze e quarenta e dois. Eles descem em três levas, porque o elevador é pequeno.',
    'Ninguém corre de você. Dois cumprimentam. O contador para na banca e compra um jornal.',
    'O Curador Ren sai por último e vem direto até você, com a pasta debaixo do braço.',
    '"O senhor vai voltar na próxima?"',
    '"Vou."',
    'Ele assente, e alguma coisa nos ombros dele desce dois centímetros.',
    '"Então eu tenho dois votos na próxima." Ele ajeita a pasta. "Um meu e o do senhor, que não conta, mas que muda a sala, e a sala é onde eu perco."'
  ],
  ef:{flag:['adnan_espera_voce'], moral:3,
      npc:{nome:'Curador Ren', opiniao:4, memoria:'Perguntou se você vai voltar na próxima reunião.'},
      rep:{eixo:'bom',delta:2,motivo:'Prometeu voltar na segunda seguinte'},
      registrar:'Prometeu ao Curador Ren voltar à próxima reunião.'},
  escolhas:[{texto:'Seguir.', vai:'c20_fim'}]
},

c20_fim:{
  texto:[
    d=>{
      if (d.flags.comissao_derrubada) return 'A Comissão de Gestão de Risco Biológico de Kanto é dissolvida por decisão judicial sete meses depois. Três conselheiros respondem processo. A Presidente não foge, não se esconde e comparece a todas as audiências, sempre com o mesmo tailleur.';
      if (d.flags.edital_aprovado) return 'O edital sai em quatro jornais e a assembleia de março tem duzentas e onze pessoas dentro de um salão paroquial alugado, porque a sala 704 não cabia. É a coisa mais chata e mais importante que já aconteceu nesta história.';
      if (d.flags.art19_revogado && d.flags.fase2_suspensa) return 'O Art. 19 foi revogado numa segunda-feira de manhã, por votação, numa sala comercial. Nenhum jornal noticiou. É assim que as coisas mudam de verdade e é por isso que ninguém acredita.';
      if (d.flags.art19_revogado) return 'O Art. 19 caiu. A Fase II continua. Você conseguiu metade e vai passar anos decidindo se metade conta.';
      if (d.flags.visita_obrigatoria_aprovada) return 'Onze pessoas passam a entrar no galpão 4 uma vez por mês, com presença registrada em ata. Não muda nenhum protocolo. Em quatro meses, três delas renunciam.';
      if (d.flags.conselheiro_da_comissao) return 'Você agora tem cadeira, voto e uma pasta com o seu nome numa mesa oval em Saffron. A reunião é toda segunda, às dez.';
      if (d.flags.ignorou_a_comissao) return 'A Fase II sai do papel no primeiro semestre, como previsto na ata, e ninguém nunca soube que você leu aquilo.';
      return 'A reunião terminou às onze e quarenta, como todas as reuniões. O item 4 foi aprovado.';
    },
    d=>d.flags.leu_o_livro_fechado
       ? 'E na nona ata do livro que ninguém lia está escrito, em três linhas, que tudo aquilo depende de eles acharem uma coisa que está solta em Kanto há dois anos.'
       : (d.flags.sabe_do_risco01 || d.flags.sabe_da_fase3
          ? 'E em algum lugar de uma ata, numa linha só, existe um item que não foi resolvido hoje: Risco 01 — não localizado.'
          : 'E em algum lugar existe uma coisa que eles numeraram e não acharam.'),
    'A Liga te mandou uma carta enquanto você estava em Saffron. Papel bom, timbre em relevo.'
  ],
  fim:true, resumo:'Capítulo 20 concluído — o mal agora tem ata, pauta e café na entrada.'
}
}}

);
