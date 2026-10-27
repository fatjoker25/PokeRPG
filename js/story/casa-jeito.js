/* ============================================================
   O JEITO DE QUEM FICOU EM CASA
   A pessoa que te criou não é sempre a mesma pessoa com medo da
   porta. Cada partida sorteia um jeito (e guarda na ficha), e a
   mesa do café, a despedida e as ligações saem desse jeito.
   Nenhum deles é medroso: tem quem se orgulhe, quem brinque, quem
   resolva tudo com lista, quem já foi treinador e quem só confia.
   Marcas: {casa:ela|ele} pra pessoa, {o|a} pro jogador.
   ============================================================ */
const JEITOS_DA_CASA = {

  orgulho: {
    mesa: [
      d => falaCasa('Senta. Hoje você come primeiro.', null, 'Nesta casa quem come primeiro é visita. Hoje é você.'),
      d => falaCasa(`Então é hoje. ${d.jogador.nome}, de ${d.jogador.cidade}, treinador${d.jogador.genero === 'Mulher' ? 'a' : ''}.`, 'riso', 'Fala devagar, testando como soa.')
    ],
    pergunta: d => falaCasa('Já sabe por onde começa? Me conta, que eu quero contar pros outros.'),
    verdade: [
      d => falaCasa('Melhor ainda. Quem sai sabendo tudo não descobre nada.'),
      d => falaCasa('Descobre e me liga. Eu quero ser a primeira pessoa a saber.')
    ],
    objetivo: [
      d => falaCasa('Olha isso. Falou igual gente grande.', 'riso'),
      d => falaCasa('Vai lá e faz. E faz do seu jeito, que o seu jeito é bom.')
    ],
    mentira: d => falaCasa('Claro que sabe. Você sempre soube das coisas antes de mim.', 'riso'),
    ligacao: d => falaCasa('Contei pra rua inteira que você ia ligar. Aí ninguém ligou, então liguei eu.', 'riso'),
    aniversario: [
      d => falaCasa(`${cap1(porExtenso(idadeJogador(d)))} anos! Eu contei pra padaria, pro carteiro e pra vizinha do lado. A vizinha já sabia.`, 'riso'),
      d => falaCasa('Liga de noite que eu quero contar pra você o que todo mundo mandou dizer.')
    ],
    adeus: [
      d => falaCasa('Endireita essa mochila. {Treinador|Treinadora} desta casa sai de cabeça erguida.'),
      d => falaCasa('E quando alguém perguntar de onde você é, fala o nome da rua inteiro.', 'riso')
    ]
  },

  brincalhao: {
    mesa: [
      d => falaCasa('Senta, senta. Fiz o dobro, porque treinador come o dobro. Li isso numa revista.', 'riso'),
      d => falaCasa('Se sobrar eu dou pros Pidgey da calha, que eles também vão sentir a sua falta.')
    ],
    pergunta: d => falaCasa('E aí, qual é o plano? {Campeão|Campeã} até o almoço ou só até o jantar?', 'riso'),
    verdade: [
      d => falaCasa('Ótimo! Eu também não sabia nada na sua idade e olha que beleza que eu fiquei.', 'riso'),
      d => falaCasa('Vai descobrindo. E me liga contando as partes engraçadas.')
    ],
    objetivo: [
      d => falaCasa('Uau. Anota isso num papel, que daqui a pouco você vai querer provar que disse primeiro.', 'riso'),
      d => falaCasa('Tô brincando. É um objetivo bonito. Vai.')
    ],
    mentira: d => falaCasa('Sabe nada. Mas tá bonito o jeito que você falou, vou fingir que acredito.', 'riso'),
    ligacao: d => falaCasa('Aqui é da Liga Pokémon, você foi desclassificad{o|a} por saudade. Brincadeira. Sou eu.', 'riso'),
    aniversario: [
      d => falaCasa('Atenção, atenção: aqui fala a central de aniversários de Kanto. Parabéns. Fim do comunicado.', 'riso'),
      d => falaCasa('Tá. Agora sério: feliz aniversário. Eu fiz o bolo mesmo assim e comi a sua fatia.', 'riso')
    ],
    adeus: [
      d => falaCasa('Regra da casa: se ganhar insígnia, liga. Se perder, liga também, que eu conto piada.', 'riso'),
      d => falaCasa('Agora vai, antes que eu invente outra regra.')
    ]
  },

  pratico: {
    mesa: [
      d => falaCasa('Senta e come. Proteína primeiro, café depois.'),
      d => falaCasa('Separei três pares de meia. Treinador que molha o pé no primeiro dia perde o segundo.')
    ],
    pergunta: d => falaCasa('Rota de hoje: já decidiu ou decide na saída?'),
    verdade: [
      d => falaCasa('Então começa pelo Centro mais perto e decide lá. Mapa de parede existe pra isso.'),
      d => falaCasa('Decisão boa é decisão tomada com o pé na estrada.')
    ],
    objetivo: [
      d => falaCasa('Bom. Objetivo claro economiza sola de sapato.'),
      d => falaCasa('Divide em pedaço pequeno. Um por semana. É assim que se chega.')
    ],
    mentira: d => falaCasa('Ótimo. Então não esquece a garrafa d\'água, que plano nenhum funciona com sede.'),
    ligacao: d => falaCasa('Liguei no horário que a tarifa é mais barata. Tenho uns minutos.'),
    aniversario: [
      d => falaCasa('Parabéns. Mandei dinheiro pro Centro mais perto de onde você disse que ia estar. Usa com comida.'),
      d => falaCasa('E lava a roupa. Aniversário não é desculpa.')
    ],
    adeus: [
      d => falaCasa('Potion no bolso de fora, dinheiro no de dentro. Nunca o contrário.'),
      d => falaCasa('Liga domingo. Pode ser curto. Curto e sempre é melhor que longo e nunca.')
    ]
  },

  ex_treinador: {
    mesa: [
      d => falaCasa('Senta. Eu saí desta mesma porta com a sua idade, sabia? Com um Rattata e uma mochila furada.', null, 'Os olhos vão pra prateleira, onde tem uma insígnia velha dentro de um copo.'),
      d => falaCasa('Cheguei em duas insígnias. Você vai passar disso fácil.')
    ],
    pergunta: d => falaCasa('Primeira parada? Me diz que eu te conto o atalho que eu usava.'),
    verdade: [
      d => falaCasa('Eu também não sabia. A estrada decide por você nas primeiras semanas, e ela decide bem.'),
      d => falaCasa('Só não foge de luta com treinador de rota. É lá que se aprende.')
    ],
    objetivo: [
      d => falaCasa('Isso. Eu queria a mesma coisa e não falei em voz alta. Você falou. Já tá na frente.'),
      d => falaCasa('Troca de Pokémon antes de ele cair, não depois. É o único conselho que eu tenho.')
    ],
    mentira: d => falaCasa('Sabe nada. Eu também dizia isso. Vai saber lá.', 'riso'),
    ligacao: d => falaCasa('Primeira semana fora é a mais comprida. Eu lembro da minha.'),
    aniversario: [
      d => falaCasa('Feliz aniversário. Eu passei o meu de ' + porExtenso(idadeJogador(d)) + ' anos num Centro de Celadon, comendo bolacha de máquina.', 'baixo'),
      d => falaCasa('Foi um dos melhores da minha vida. Espero que o seu seja também.')
    ],
    adeus: [
      d => falaCasa('Vai lá e faz a parte que eu não fiz.', null, 'Bate duas vezes no seu ombro, do jeito que se faz na quadra antes de entrar.'),
      d => falaCasa('E me traz a primeira insígnia pra eu ver de perto. Só pra ver.')
    ]
  },

  sonhador: {
    mesa: [
      d => falaCasa('Senta. Hoje o café tem gosto de começo, você reparou?'),
      d => falaCasa('Eu fiquei acordad{casa:a|o} pensando em todos os lugares que você vai pisar e eu não. Que coisa boa.')
    ],
    pergunta: d => falaCasa('Pra onde você vai primeiro? Me fala devagar, que eu quero imaginar.'),
    verdade: [
      d => falaCasa('Que sorte a sua. O mapa inteiro em branco.'),
      d => falaCasa('Me manda cartão de cada cidade. Eu vou colar na geladeira em ordem.')
    ],
    objetivo: [
      d => falaCasa('Que bonito ouvir isso dito em voz alta nesta cozinha.'),
      d => falaCasa('Vai. E repara em tudo no caminho. O caminho é a melhor parte.')
    ],
    mentira: d => falaCasa('Sabe? Que bom. Então me conta depois, quando chegar lá.'),
    ligacao: d => falaCasa('Olhei o mapa da parede hoje cedo e fiquei tentando adivinhar em qual pedacinho você estava.'),
    aniversario: [
      d => falaCasa('Feliz aniversário! Eu acendi uma vela na janela, virada pro lado que eu acho que você tá.', 'baixo'),
      d => falaCasa('Se você olhar pro céu hoje à noite, eu também tô olhando.')
    ],
    adeus: [
      d => falaCasa('Olha pro céu de vez em quando. É o mesmo daqui, e eu vou estar olhando também.'),
      d => falaCasa('Agora vai. O dia tá bonito demais pra ficar em porta.')
    ]
  },

  durao: {
    mesa: [
      d => falaCasa('Senta. Come tudo. Ninguém sai desta casa com fome.'),
      d => falaCasa('E arruma essa gola. Treinador também é visto.')
    ],
    pergunta: d => falaCasa('Já sabe o que vai fazer ou vai inventar na hora?'),
    verdade: [
      d => falaCasa('Então inventa direito.'),
      d => falaCasa('E cuida deles antes de cuidar de você. Isso não é conselho, é regra.')
    ],
    objetivo: [
      d => falaCasa('Hm.', null, 'É o "hm" que nesta casa quer dizer que gostou.'),
      d => falaCasa('Então faz. Sem desculpa e sem pressa.')
    ],
    mentira: d => falaCasa('Hm. Tá bom.', null, '{casa:Ela|Ele} não acreditou, e decidiu que hoje não vai implicar.'),
    ligacao: d => falaCasa('Liguei pra saber se o número funciona. Funciona.'),
    aniversario: [
      d => falaCasa('Parabéns.'),
      d => falaCasa('Tô orgulhos{casa:a|o}. Pronto, falei. Não vou repetir.', 'baixo')
    ],
    adeus: [
      d => falaCasa(`Liga quando chegar ${d.jogador.cidade === 'Viridian' ? 'na próxima cidade' : 'em Viridian'}. Não precisa falar muito. Fala que chegou.`),
      d => falaCasa('Vai.', null, 'E fica na porta até você virar a esquina, de braço cruzado, que é como esta casa abraça em público.')
    ]
  },

  atrapalhado: {
    mesa: [
      d => falaCasa('Senta! Cuidado, a cadeira bamba é essa. Não, a outra. Também.', 'riso'),
      d => falaCasa('Eu fiz panqueca. Ou fiz uma coisa que começou panqueca.', 'riso')
    ],
    pergunta: d => falaCasa('Então… você já sabe pra onde vai? Porque eu ia te dar um mapa e acho que dei pro vizinho.'),
    verdade: [
      d => falaCasa('Ufa. Então ninguém nesta casa sabe, a gente tá empatad{casa:a|o}.', 'riso'),
      d => falaCasa('Pergunta no Centro. Lá eles sabem tudo. Eu sempre pergunto lá.')
    ],
    objetivo: [
      d => falaCasa('Nossa. Isso foi muito mais organizado do que qualquer coisa que eu já disse nesta cozinha.', 'riso'),
      d => falaCasa('Vai fundo. Você puxou isso de alguém, e não foi de mim.')
    ],
    mentira: d => falaCasa('Que bom, porque eu não sei nem onde deixei a chave.', 'riso'),
    ligacao: d => falaCasa('Eu apertei o botão errado umas quatro vezes. Foi a Perla, a vizinha do dezoito, que me ensinou.'),
    aniversario: [
      d => falaCasa('FELIZ ANIVERSÁRIO! Ai, desculpa, tava no viva-voz. Feliz aniversário.', 'grita'),
      d => falaCasa('Eu mandei um presente pelo correio e acho que escrevi o endereço errado, então se chegar um pacote estranho em algum lugar, é seu.', 'riso')
    ],
    adeus: [
      d => falaCasa('Tem tudo? Tem. Eu acho. Tem a Pokébola? Tem o… tem. Tem tudo.', 'riso'),
      d => falaCasa('Vai, que se eu continuar conferindo você só sai amanhã.', 'riso')
    ]
  },

  calmo: {
    mesa: [
      d => falaCasa('Senta. Sem pressa. A estrada não sai do lugar.'),
      d => falaCasa('Come com calma. Dia grande começa com o estômago tranquilo.')
    ],
    pergunta: d => falaCasa('Você já sabe por onde vai? Pode não saber também.'),
    verdade: [
      d => falaCasa('Tá certo. Saber vem andando.'),
      d => falaCasa('Quem confia no próprio passo chega em qualquer lugar.')
    ],
    objetivo: [
      d => falaCasa('É um bom lugar pra querer chegar.'),
      d => falaCasa('Eu confio em você. Sempre confiei.')
    ],
    mentira: d => falaCasa('Tá bom.', null, 'Um sorriso pequeno, de quem não precisa de resposta nenhuma pra ficar tranquil{casa:a|o}.'),
    ligacao: d => falaCasa('Sem pressa. Só queria ouvir sua voz um pouco.', 'baixo'),
    aniversario: [
      d => falaCasa('Feliz aniversário. Não precisa falar muito, eu só queria ser a primeira voz do seu dia.', 'baixo'),
      d => falaCasa('Cuida de você. E deixa o time cuidar de você também, hoje.')
    ],
    adeus: [
      d => falaCasa('Vai com calma e volta quando quiser. A porta é sua.'),
      d => falaCasa('Eu tô aqui. Isso não muda.')
    ]
  }
};

/* O jeito é sorteado uma vez e fica na ficha: recarregar não troca a pessoa. */
function jeitoDaCasa(d){
  d = d || Estado.dados;
  const c = d && d.jogador && d.jogador.casa;
  if (!c) return 'calmo';
  if (!c.jeito || !JEITOS_DA_CASA[c.jeito]) c.jeito = Dados.escolher(Object.keys(JEITOS_DA_CASA));
  return c.jeito;
}
function falaDaCasa(momento, d){
  const j = JEITOS_DA_CASA[jeitoDaCasa(d)];
  const v = j[momento];
  if (!v) return [];
  return (Array.isArray(v) ? v : [v]).map(f => (typeof f === 'function' ? f(d || Estado.dados) : f));
}
