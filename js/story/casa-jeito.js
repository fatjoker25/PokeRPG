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
      d => fala(nomeCasa(), 'Senta. Hoje você come primeiro.', null, 'Nesta casa quem come primeiro é visita. Hoje é você.'),
      d => fala(nomeCasa(), `Então é hoje. ${d.jogador.nome}, de ${d.jogador.cidade}, treinador${d.jogador.genero === 'Mulher' ? 'a' : ''}.`, 'riso', 'Fala devagar, testando como soa.')
    ],
    pergunta: d => fala(nomeCasa(), 'Já sabe por onde começa? Me conta, que eu quero contar pros outros.'),
    verdade: [
      d => fala(nomeCasa(), 'Melhor ainda. Quem sai sabendo tudo não descobre nada.'),
      d => fala(nomeCasa(), 'Descobre e me liga. Eu quero ser a primeira pessoa a saber.')
    ],
    objetivo: [
      d => fala(nomeCasa(), 'Olha isso. Falou igual gente grande.', 'riso'),
      d => fala(nomeCasa(), 'Vai lá e faz. E faz do seu jeito, que o seu jeito é bom.')
    ],
    mentira: d => fala(nomeCasa(), 'Claro que sabe. Você sempre soube das coisas antes de mim.', 'riso'),
    ligacao: d => fala(nomeCasa(), 'Contei pra rua inteira que você ia ligar. Aí ninguém ligou, então liguei eu.', 'riso'),
    adeus: [
      d => fala(nomeCasa(), 'Endireita essa mochila. Treinador desta casa sai de cabeça erguida.'),
      d => fala(nomeCasa(), 'E quando alguém perguntar de onde você é, fala o nome da rua inteiro.', 'riso')
    ]
  },

  brincalhao: {
    mesa: [
      d => fala(nomeCasa(), 'Senta, senta. Fiz o dobro, porque treinador come o dobro. Li isso numa revista.', 'riso'),
      d => fala(nomeCasa(), 'Se sobrar eu dou pros Pidgey da calha, que eles também vão sentir a sua falta.')
    ],
    pergunta: d => fala(nomeCasa(), 'E aí, qual é o plano? Campeão até o almoço ou só até o jantar?', 'riso'),
    verdade: [
      d => fala(nomeCasa(), 'Ótimo! Eu também não sabia nada na sua idade e olha que beleza que eu fiquei.', 'riso'),
      d => fala(nomeCasa(), 'Vai descobrindo. E me liga contando as partes engraçadas.')
    ],
    objetivo: [
      d => fala(nomeCasa(), 'Uau. Anota isso num papel, que daqui a pouco você vai querer provar que disse primeiro.', 'riso'),
      d => fala(nomeCasa(), 'Tô brincando. É um objetivo bonito. Vai.')
    ],
    mentira: d => fala(nomeCasa(), 'Sabe nada. Mas tá bonito o jeito que você falou, vou fingir que acredito.', 'riso'),
    ligacao: d => fala(nomeCasa(), 'Aqui é da Liga Pokémon, você foi desclassificad{o|a} por saudade. Brincadeira. Sou eu.', 'riso'),
    adeus: [
      d => fala(nomeCasa(), 'Regra da casa: se ganhar insígnia, liga. Se perder, liga também, que eu conto piada.', 'riso'),
      d => fala(nomeCasa(), 'Agora vai, antes que eu invente outra regra.')
    ]
  },

  pratico: {
    mesa: [
      d => fala(nomeCasa(), 'Senta e come. Proteína primeiro, café depois.'),
      d => fala(nomeCasa(), 'Separei três pares de meia. Treinador que molha o pé no primeiro dia perde o segundo.')
    ],
    pergunta: d => fala(nomeCasa(), 'Rota de hoje: já decidiu ou decide na saída?'),
    verdade: [
      d => fala(nomeCasa(), 'Então começa pelo Centro mais perto e decide lá. Mapa de parede existe pra isso.'),
      d => fala(nomeCasa(), 'Decisão boa é decisão tomada com o pé na estrada.')
    ],
    objetivo: [
      d => fala(nomeCasa(), 'Bom. Objetivo claro economiza sola de sapato.'),
      d => fala(nomeCasa(), 'Divide em pedaço pequeno. Um por semana. É assim que se chega.')
    ],
    mentira: d => fala(nomeCasa(), 'Ótimo. Então não esquece a garrafa d\'água, que plano nenhum funciona com sede.'),
    ligacao: d => fala(nomeCasa(), 'Liguei no horário que a tarifa é mais barata. Tenho uns minutos.'),
    adeus: [
      d => fala(nomeCasa(), 'Potion no bolso de fora, dinheiro no de dentro. Nunca o contrário.'),
      d => fala(nomeCasa(), 'Liga domingo. Pode ser curto. Curto e sempre é melhor que longo e nunca.')
    ]
  },

  ex_treinador: {
    mesa: [
      d => fala(nomeCasa(), 'Senta. Eu saí desta mesma porta com a sua idade, sabia? Com um Rattata e uma mochila furada.', null, 'Os olhos vão pra prateleira, onde tem uma insígnia velha dentro de um copo.'),
      d => fala(nomeCasa(), 'Cheguei em duas insígnias. Você vai passar disso fácil.')
    ],
    pergunta: d => fala(nomeCasa(), 'Primeira parada? Me diz que eu te conto o atalho que eu usava.'),
    verdade: [
      d => fala(nomeCasa(), 'Eu também não sabia. A estrada decide por você nas primeiras semanas, e ela decide bem.'),
      d => fala(nomeCasa(), 'Só não foge de luta com treinador de rota. É lá que se aprende.')
    ],
    objetivo: [
      d => fala(nomeCasa(), 'Isso. Eu queria a mesma coisa e não falei em voz alta. Você falou. Já tá na frente.'),
      d => fala(nomeCasa(), 'Troca de Pokémon antes de ele cair, não depois. É o único conselho que eu tenho.')
    ],
    mentira: d => fala(nomeCasa(), 'Sabe nada. Eu também dizia isso. Vai saber lá.', 'riso'),
    ligacao: d => fala(nomeCasa(), 'Primeira semana fora é a mais comprida. Eu lembro da minha.'),
    adeus: [
      d => fala(nomeCasa(), 'Vai lá e faz a parte que eu não fiz.', null, 'Bate duas vezes no seu ombro, do jeito que se faz na quadra antes de entrar.'),
      d => fala(nomeCasa(), 'E me traz a primeira insígnia pra eu ver de perto. Só pra ver.')
    ]
  },

  sonhador: {
    mesa: [
      d => fala(nomeCasa(), 'Senta. Hoje o café tem gosto de começo, você reparou?'),
      d => fala(nomeCasa(), 'Eu fiquei acordad{casa:a|o} pensando em todos os lugares que você vai pisar e eu não. Que coisa boa.')
    ],
    pergunta: d => fala(nomeCasa(), 'Pra onde você vai primeiro? Me fala devagar, que eu quero imaginar.'),
    verdade: [
      d => fala(nomeCasa(), 'Que sorte a sua. O mapa inteiro em branco.'),
      d => fala(nomeCasa(), 'Me manda cartão de cada cidade. Eu vou colar na geladeira em ordem.')
    ],
    objetivo: [
      d => fala(nomeCasa(), 'Que bonito ouvir isso dito em voz alta nesta cozinha.'),
      d => fala(nomeCasa(), 'Vai. E repara em tudo no caminho. O caminho é a melhor parte.')
    ],
    mentira: d => fala(nomeCasa(), 'Sabe? Que bom. Então me conta depois, quando chegar lá.'),
    ligacao: d => fala(nomeCasa(), 'Olhei o mapa da parede hoje cedo e fiquei tentando adivinhar em qual pedacinho você estava.'),
    adeus: [
      d => fala(nomeCasa(), 'Olha pro céu de vez em quando. É o mesmo daqui, e eu vou estar olhando também.'),
      d => fala(nomeCasa(), 'Agora vai. O dia tá bonito demais pra ficar em porta.')
    ]
  },

  durao: {
    mesa: [
      d => fala(nomeCasa(), 'Senta. Come tudo. Ninguém sai desta casa com fome.'),
      d => fala(nomeCasa(), 'E arruma essa gola. Treinador também é visto.')
    ],
    pergunta: d => fala(nomeCasa(), 'Já sabe o que vai fazer ou vai inventar na hora?'),
    verdade: [
      d => fala(nomeCasa(), 'Então inventa direito.'),
      d => fala(nomeCasa(), 'E cuida deles antes de cuidar de você. Isso não é conselho, é regra.')
    ],
    objetivo: [
      d => fala(nomeCasa(), 'Hm.', null, 'É o "hm" que nesta casa quer dizer que gostou.'),
      d => fala(nomeCasa(), 'Então faz. Sem desculpa e sem pressa.')
    ],
    mentira: d => fala(nomeCasa(), 'Hm. Tá bom.', null, '{casa:Ela|Ele} não acreditou, e decidiu que hoje não vai implicar.'),
    ligacao: d => fala(nomeCasa(), 'Liguei pra saber se o número funciona. Funciona.'),
    adeus: [
      d => fala(nomeCasa(), 'Liga quando chegar em Viridian. Não precisa falar muito. Fala que chegou.'),
      d => fala(nomeCasa(), 'Vai.', null, 'E fica na porta até você virar a esquina, de braço cruzado, que é como esta casa abraça em público.')
    ]
  },

  atrapalhado: {
    mesa: [
      d => fala(nomeCasa(), 'Senta! Cuidado, a cadeira bamba é essa. Não, a outra. Também.', 'riso'),
      d => fala(nomeCasa(), 'Eu fiz panqueca. Ou fiz uma coisa que começou panqueca.', 'riso')
    ],
    pergunta: d => fala(nomeCasa(), 'Então… você já sabe pra onde vai? Porque eu ia te dar um mapa e acho que dei pro vizinho.'),
    verdade: [
      d => fala(nomeCasa(), 'Ufa. Então ninguém nesta casa sabe, a gente tá empatad{casa:a|o}.', 'riso'),
      d => fala(nomeCasa(), 'Pergunta no Centro. Lá eles sabem tudo. Eu sempre pergunto lá.')
    ],
    objetivo: [
      d => fala(nomeCasa(), 'Nossa. Isso foi muito mais organizado do que qualquer coisa que eu já disse nesta cozinha.', 'riso'),
      d => fala(nomeCasa(), 'Vai fundo. Você puxou isso de alguém, e não foi de mim.')
    ],
    mentira: d => fala(nomeCasa(), 'Que bom, porque eu não sei nem onde deixei a chave.', 'riso'),
    ligacao: d => fala(nomeCasa(), 'Eu apertei o botão errado umas quatro vezes. A Perla que me ensinou.'),
    adeus: [
      d => fala(nomeCasa(), 'Tem tudo? Tem. Eu acho. Tem a Pokébola? Tem o… tem. Tem tudo.', 'riso'),
      d => fala(nomeCasa(), 'Vai, que se eu continuar conferindo você só sai amanhã.', 'riso')
    ]
  },

  calmo: {
    mesa: [
      d => fala(nomeCasa(), 'Senta. Sem pressa. A estrada não sai do lugar.'),
      d => fala(nomeCasa(), 'Come com calma. Dia grande começa com o estômago tranquilo.')
    ],
    pergunta: d => fala(nomeCasa(), 'Você já sabe por onde vai? Pode não saber também.'),
    verdade: [
      d => fala(nomeCasa(), 'Tá certo. Saber vem andando.'),
      d => fala(nomeCasa(), 'Quem confia no próprio passo chega em qualquer lugar.')
    ],
    objetivo: [
      d => fala(nomeCasa(), 'É um bom lugar pra querer chegar.'),
      d => fala(nomeCasa(), 'Eu confio em você. Sempre confiei.')
    ],
    mentira: d => fala(nomeCasa(), 'Tá bom.', null, 'Um sorriso pequeno, de quem não precisa de resposta nenhuma pra ficar tranquil{casa:a|o}.'),
    ligacao: d => fala(nomeCasa(), 'Sem pressa. Só queria ouvir sua voz um pouco.', 'baixo'),
    adeus: [
      d => fala(nomeCasa(), 'Vai com calma e volta quando quiser. A porta é sua.'),
      d => fala(nomeCasa(), 'Eu tô aqui. Isso não muda.')
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
