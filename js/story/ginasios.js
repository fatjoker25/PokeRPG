/* ============================================================
   OS OITO GINÁSIOS DE KANTO
   Cada líder reage à sua reputação, à sua rota e ao que você fez
   na cidade dele. Viridian só abre com sete insígnias.
   ============================================================ */

const GINASIOS = [

/* ── 1 ─────────────────────────────────────────────────── */
{
  id:'pewter', num:1, cidade:'Pewter', lider:'Brock', tipo:'Pedra',
  insignia:'Insígnia Pedra', capMin:4, faixa:'14–17',
  efeito:'Pokémon que não escolheram você passam a hesitar menos.',
  time:[{dex:74,nivel:14},{dex:95,nivel:17}],
  premio:{dinheiro:1200, itens:{'Super Potion':2}, rep:1},

  intro:d=>[
    'O chão do ginásio é de terra batida sobre pedra. Não tem arquibancada — tem uma linha pintada e um homem parado do outro lado dela.',
    d.insignias.includes('Insígnia Pedra')
      ? '"De novo?" Brock cruza os braços. "Tudo bem. Treinar contra pedra nunca fez mal a ninguém."'
      : '"Primeira insígnia?" Ele nem espera resposta. "Então escuta: eu não pego leve. Se eu pegar leve, você morre na segunda cidade achando que era bom."'
  ],
  vitoria:d=>[
    'O Onix cai de lado e o chão inteiro sente. A poeira leva um tempo pra assentar.',
    'Brock atravessa a linha pintada e te entrega a insígnia na mão, não no ar.',
    d.cemiterio.length
      ? `"Eu soube do que aconteceu com ${nomeExib(d.cemiterio[0])}." Ele não suaviza. "Isso não some. Você vai treinar com isso do lado pelo resto da vida, e é assim mesmo."`
      : '"Cuida deles melhor do que você cuida de você. Treinador ruim é o que se esquece disso."'
  ],
  derrota:d=>[
    'Você perde. Não por pouco.',
    'Brock não comemora. Recolhe o Onix e vem até você com uma Super Potion na mão.',
    '"Volta." Ele diz isso como ordem, não como consolo. "Amanhã, semana que vem, quando for. Mas volta."'
  ]
},

/* ── 2 ─────────────────────────────────────────────────── */
{
  id:'cerulean', num:2, cidade:'Cerulean', lider:'Misty', tipo:'Água',
  insignia:'Insígnia Cascata', capMin:6, faixa:'20–23',
  efeito:'Lojas de Kanto passam a te vender o estoque de trás do balcão.',
  time:[{dex:120,nivel:20},{dex:61,nivel:22},{dex:121,nivel:23}],
  premio:{dinheiro:2400, itens:{'Super Potion':2,'Great Ball':3}, rep:1},

  recusa:d=>{
    if (d.flags.ignorou_marta) return '"Eu conheço a Marta." Misty não se levanta da beira da piscina. "Ela me contou de um treinador que passou reto. Não descreveu, mas eu não preciso de descrição."';
    if (d.flags.agrediu_envenenador) return '"Três pessoas estavam pescando a duzentos metros." Ela olha a água. "Elas vieram aqui contar. Eu não luto com quem resolve as coisas assim."';
    return null;
  },
  comoDestravar:'Faça algo em Cerulean que valha a pena ser contado — ou lave a reputação e volte.',

  intro:d=>[
    'O ginásio de Cerulean é uma piscina olímpica com uma passarela no meio. A acústica faz tudo ecoar duas vezes.',
    d.flags.salvou_vaporeon
      ? '"Você é o da Rota 25." Misty já está de pé quando você entra. "A Marta chorou aqui na minha porta contando. Eu ia te procurar."'
      : d.flags.destruiu_tigelas || d.flags.entregou_envenenador
      ? '"As tigelas." Ela assente devagar. "Foi você. Meus irmãos acham que foi a prefeitura."'
      : '"Regra da casa: o chão é escorregadio e eu não aviso duas vezes."'
  ],
  vitoria:d=>[
    'A Starmie afunda e o núcleo dela apaga debaixo d\'água — uma luz vermelha descendo devagar até o fundo azul.',
    'Misty pesca a insígnia do bolso do roupão e te entrega molhada.',
    d.flags.salvou_vaporeon
      ? '"Eu ia te dar mesmo que você perdesse." Ela ri do próprio absurdo. "Mas não fala isso pra ninguém, porque aí vira precedente."'
      : '"Você lê a água bem." Ela seca as mãos. "A maioria só bate. Você espera."'
  ],
  derrota:d=>[
    'Você sai da piscina encharcado e derrotado, o que é uma combinação humilhante específica.',
    'Misty joga uma toalha na sua cara sem nenhuma delicadeza.',
    '"O problema não é o seu time. É que você tem pressa. Água não tem pressa."'
  ]
},

/* ── 3 ─────────────────────────────────────────────────── */
{
  id:'vermilion', num:3, cidade:'Vermilion', lider:'Lt. Surge', tipo:'Elétrico',
  insignia:'Insígnia Trovão', capMin:8, faixa:'24–28',
  efeito:'Você aprende a ler uma sala antes de entrar nela. (+1 em testes de Percepção)',
  time:[{dex:100,nivel:24},{dex:81,nivel:25},{dex:26,nivel:28}],
  premio:{dinheiro:3500, itens:{'Hyper Potion':1,'Great Ball':3}, rep:1, status:'percepcao'},

  intro:d=>[
    'O ginásio de Vermilion é um galpão de manutenção portuária adaptado. Tem gerador, tem cabo no chão, tem cheiro de ozônio.',
    'Lt. Surge tem quarenta e poucos anos e a postura de quem já foi coisa pior que líder de ginásio.',
    d.flags.provas_navio || d.flags.caderno_do_trafico
      ? '"Você andou no navio." Ele não pergunta. "Eu vi sair três caminhões hoje de manhã e eu vi você olhando eles. A gente tem uma coisa em comum e não é boa."'
      : d.flags.chantageou_capitao
      ? '"O capitão me ligou." Ele acende o painel com o pé. "Ele não pediu nada. Só queria que alguém soubesse. Agora eu sei."'
      : '"Porto é assim: chega coisa, sai coisa, e ninguém pergunta." Ele acende o painel com o pé. "Eu parei de perguntar faz doze anos. Vamos ver o que você faz com isso."'
  ],
  vitoria:d=>[
    'O Raichu cai e o galpão inteiro apaga — disjuntor geral, escuro total por quatro segundos.',
    'Quando a luz de emergência liga, Surge está rindo alto.',
    '"HA! Faz uns dois anos que ninguém queima meu disjuntor."',
    d.flags.provas_navio || d.flags.caderno_do_trafico
      ? 'Ele te entrega a insígnia e segura a sua mão mais tempo do que o normal. "Ô. O que você tiver no bolso do navio — usa. Eu não usei o meu e olha onde eu tô."'
      : 'Ele te entrega a insígnia como quem entrega uma ferramenta. "Guarda no bolso, não no pescoço. Quem usa no pescoço apanha."'
  ],
  derrota:d=>[
    'Você acorda com cheiro de queimado e Surge segurando um extintor por precaução.',
    '"Relaxa, isso acontece." Ele te dá água. "Elétrico é o tipo mais covarde que existe: ele ganha antes de você acordar. Da próxima vez, entra rápido."'
  ]
},

/* ── 4 ─────────────────────────────────────────────────── */
{
  id:'celadon', num:4, cidade:'Celadon', lider:'Erika', tipo:'Grama',
  insignia:'Insígnia Arco-Íris', capMin:9, faixa:'30–33',
  efeito:'Você passa a reconhecer veneno, remédio e o que há entre os dois. (+1 em Intelecto)',
  time:[{dex:71,nivel:30},{dex:114,nivel:30},{dex:45,nivel:33}],
  premio:{dinheiro:4200, itens:{'Full Heal':3,'Hyper Potion':1}, rep:1, status:'intelecto'},

  recusa:d=>{
    // reputação boa alta lava a recusa: o mundo registrou o que você fez depois
    const lavou = Estado.rep.eixo === 'bom' && Estado.rep.bom >= 5;
    if (lavou) return null;
    if (Historia.via()==='mercenario' || Historia.via()==='foragido')
      return '"Eu sei de onde vem o seu dinheiro." Erika continua regando uma samambaia sem olhar pra você. "Eu não vou fingir que não sei só porque você tem insígnias. Sai da minha estufa."';
    if (d.flags.incendiou_deposito)
      return '"Havia seres vivos naquele prédio quando você ateou fogo." Ela finalmente olha. "Eu passei a vida cuidando de coisa que não fala. Você queimou seis. Não."';
    return null;
  },
  comoDestravar:'Erika não luta com quem lucra com aquilo. Faça o bastante do outro lado para o mundo registrar (reputação Boa nível 5) e ela abre a estufa.',

  intro:d=>[
    'O ginásio de Celadon é uma estufa de vidro em cima do shopping. É úmido, quente e absurdamente silencioso pro andar de baixo.',
    'Erika rega as plantas enquanto fala com você, e não para de regar em nenhum momento.',
    d.flags.esvaziou_deposito || d.flags.sabotou_o_setor7
      ? '"Vinte e nove chegaram na rua." Ela não explica como sabe. "Seis ficaram lá dentro e seis não conseguiam andar. Eu sei os números. Eu sempre sei os números."'
      : d.flags.provas_deposito
      ? '"Você tem fotos." A mangueira continua. "Eu tenho um jardim em cima de um shopping que é dono de metade dessa cidade. A gente tem funções diferentes."'
      : '"Todo mundo acha que grama é o tipo mais gentil." Ela fecha a mangueira. "Grama é o tipo mais paciente. É diferente."'
  ],
  vitoria:d=>[
    'A Vileplume tomba entre os vasos e o pó dela levanta e desce devagar no ar quente da estufa.',
    'Erika te entrega a insígnia e segura a sua mão fechada em volta dela por um segundo.',
    '"Você ganhou aqui dentro. Isso é fácil."',
    '"Lá fora, nessa cidade, tem um depósito com portão azul e tem uma mulher que fuma dentro de um cassino. Isso é difícil."',
    d.flags.esvaziou_deposito ? '"E você já fez." Ela solta a sua mão. "Então eu te devo mais que uma insígnia e nós duas sabemos que eu não vou pagar."' : ''
  ],
  derrota:d=>[
    'Você perde numa estufa, cercado de plantas, em silêncio.',
    'Erika não humilha e não consola. Ela volta a regar.',
    '"Você atacou o tempo todo. Contra grama, atacar o tempo todo é a maneira mais elegante de perder devagar."'
  ]
},

/* ── 5 ─────────────────────────────────────────────────── */
{
  id:'fuchsia', num:5, cidade:'Fuchsia', lider:'Koga', tipo:'Venenoso',
  insignia:'Insígnia Alma', capMin:12, faixa:'36–39',
  efeito:'Seu corpo aprende a aguentar o que devia derrubar. (+1 em Resistência)',
  time:[{dex:109,nivel:36},{dex:49,nivel:36},{dex:89,nivel:37},{dex:110,nivel:39}],
  premio:{dinheiro:5000, itens:{'Full Heal':3,'Antidote':3,'Ultra Ball':1}, rep:1, status:'resistencia'},

  intro:d=>[
    'O ginásio de Fuchsia tem parede falsa, corredor cego e piso que range de propósito. Você leva onze minutos pra achar o líder num prédio de quarenta metros.',
    'Koga está sentado no chão no centro da última sala, de costas, e fala antes de você chegar.',
    d.flags.provas_zona || d.flags.abriu_o_curral
      ? '"Dezenove anos." Ele se levanta devagar. "Eu documento o setor 7 há dezenove anos e entrego relatório a cada seis meses. Você resolveu em uma noite. Eu quero te odiar por isso e não estou conseguindo."'
      : d.flags.vendeu_a_zona
      ? '"Você vendeu a rotina do plantão." Ele se levanta. "Eu sei porque o plantão mudou na terça. Eu vou lutar com você mesmo assim, porque recusar seria fingir que essa cidade é melhor do que é."'
      : '"Veneno é o único tipo honesto." Ele se levanta. "Ele avisa o que vai fazer e faz devagar, na sua frente, e você não consegue impedir."'
  ],
  vitoria:d=>[
    'O Weezing se desfaz no ar em duas nuvens que descem e ficam rentes ao chão.',
    'Koga te entrega a insígnia com as duas mãos e uma reverência curta que te deixa sem reação.',
    d.flags.provas_zona || d.flags.abriu_o_curral
      ? '"Eu tenho uma pasta." Ele diz isso baixo. "Dezenove anos de relatório que ninguém leu. Ela é sua se você quiser. Eu já não sirvo pra isso."'
      : '"Você aguentou envenenado até o fim. A maioria troca de Pokémon e perde o ritmo." Ele senta de novo. "Aguentar é um talento. Não desperdiça ele com coisa pequena."'
  ],
  derrota:d=>[
    'Você cai numa sala sem janela, com todos os seus Pokémon envenenados ao mesmo tempo.',
    'Koga te carrega até a entrada do ginásio sozinho e chama alguém.',
    '"Você lutou contra o veneno", ele diz, antes de você apagar. "Não se luta contra veneno. Se sobrevive a ele."'
  ]
},

/* ── 6 ─────────────────────────────────────────────────── */
{
  id:'saffron', num:6, cidade:'Saffron', lider:'Sabrina', tipo:'Psíquico',
  insignia:'Insígnia Pântano', capMin:11, faixa:'40–44',
  efeito:'Você aprende a falar com quem já decidiu não te ouvir. (+1 em Carisma)',
  time:[{dex:64,nivel:40},{dex:122,nivel:40},{dex:49,nivel:41},{dex:65,nivel:44}],
  premio:{dinheiro:6000, itens:{'Full Heal':3,'Ultra Ball':2}, rep:1, status:'carisma'},

  recusa:d=>{
    if (d.flags.destruiu_o_11){
      // ela ouviu onze coisas pararem. Só o que você fez depois, e por muito tempo, muda isso.
      const redimido = Estado.rep.eixo === 'bom' && Estado.rep.bom >= 6 && d.capitulo >= 16;
      if (!redimido)
        return '"Eu senti onze coisas pararem de existir ao mesmo tempo." Sabrina não abre a porta do ginásio. "Você estava lá. Eu não consigo estar na mesma sala que você sem ouvir aquilo de novo."';
    }
    // até o capítulo 12 o ginásio está fechado por causa do barulho do andar 11
    if (d.capitulo < 12 && !d.flags.entrou_no_ginasio_saffron && !d.flags.viu_os_doze && !d.flags.sabrina_aliada)
      return 'O ginásio está trancado. Um papel na porta: "SUSPENSO POR TEMPO INDETERMINADO — S." A luz interna está acesa.';
    return null;
  },
  comoDestravar:'Sabrina fechou o ginásio por causa do que ela ouve embaixo da Silph. Vá até lá — ou espere o mundo seguir em frente sem você.',

  intro:d=>[
    'A arena de Saffron não tem iluminação de teto. A luz vem do chão, e o efeito é que ninguém tem sombra.',
    d.flags.sabrina_aliada
      ? '"Eu reabri por sua causa." Sabrina está de pé, o que já é novidade. "Não porque melhorou. Porque agora tem duas pessoas sabendo, e duas pessoas dividem melhor do que uma carrega."'
      : d.flags.ivone_tem_o_11 || d.flags.liga_lacrou_o_11
      ? '"O barulho parou na quinta-feira." Ela te olha com uma intensidade desconfortável. "Você é o motivo. Senta."'
      : d.flags.destruiu_o_11
      ? '"Eu ainda ouço." Sabrina abre a porta sem tocar nela. "Mas eu ouvi o que você fez depois, por muito tempo, em muitos lugares. Isso não apaga aquilo. Só me deixa ficar na mesma sala."'
      : '"Você pensa alto demais." Ela toca a têmpora. "Eu vou ouvir cada ordem antes de você dar. Isso não é trapaça — é o meu tipo."'
  ],
  vitoria:d=>[
    'O Alakazam cai sentado, de olhos abertos, e as colheres tilintam no chão de pedra por um tempo longo demais.',
    'Sabrina te entrega a insígnia sem levantar da cadeira e sem estender a mão — a insígnia simplesmente está na sua palma.',
    d.flags.prometeu_aos_doze
      ? '"Você prometeu voltar lá." Ela fecha os olhos. "Eles anotaram. Eu ouço eles anotando, todo dia, desde que você falou."'
      : '"Você ganhou de alguém que sabia todas as suas ordens antes de você." Uma pausa. "Isso significa que suas ordens não eram o importante. Lembra disso."'
  ],
  derrota:d=>[
    'Você perde sem entender direito como, o que é exatamente o ponto.',
    '"Você tentou surpreender." Sabrina já está de pé quando você abre os olhos. "Contra mim não dá pra surpreender. Dá pra insistir. São coisas diferentes e só uma funciona."'
  ]
},

/* ── 7 ─────────────────────────────────────────────────── */
{
  id:'cinnabar', num:7, cidade:'Cinnabar', lider:'Blaine', tipo:'Fogo',
  insignia:'Insígnia Vulcão', capMin:14, faixa:'44–49',
  efeito:'Você passa a improvisar quando o plano falha. (+1 em Sorte)',
  time:[{dex:58,nivel:44},{dex:77,nivel:44},{dex:78,nivel:46},{dex:59,nivel:49}],
  premio:{dinheiro:7000, itens:{'Hyper Potion':3,'Ultra Ball':2}, rep:1, status:'sorte'},

  intro:d=>[
    'O ginásio de Cinnabar sobreviveu ao incêndio porque fica do outro lado da ilha. Blaine dá aula de física numa lousa quando você entra.',
    'Ele tem setenta e poucos anos, óculos escuros dentro de um prédio e uma calma de quem já perdeu o que tinha pra perder.',
    d.flags.leu_caderno
      ? '"Você leu o caderno dele." Ele tira os óculos pela primeira e única vez. "O Fuji e eu almoçamos juntos por nove anos. Eu sabia do tanque e eu não fiz nada, e essa é a frase inteira, sem parte dois."'
      : d.flags.pegou_caderno
      ? '"Tem um caderno de capa dura na sua mochila." Ele não pergunta como sabe. "Guarda ele. Um dia alguém vai precisar provar que aquilo existiu."'
      : '"Todo mundo acha que fogo é sobre raiva." Ele volta pra lousa. "Fogo é sobre o que sobra depois. Eu sou professor de física. Eu sei o que sobra."'
  ],
  vitoria:d=>[
    'O Arcanine cai e o calor do ginásio inteiro cai junto, de uma vez, como se alguém tivesse fechado um forno.',
    'Blaine te entrega a insígnia sem cerimônia nenhuma.',
    d.flags.leu_caderno || d.flags.viu_os_doze
      ? '"Você vai pro norte." Não é pergunta. "Quando você encontrar ele, não peça desculpa pelo Fuji. Ele não quer isso." Uma pausa longa. "Só responde o que ele perguntar. Foi só isso que a gente não fez."'
      : '"Você é rápido e eu sou velho. Não se engane achando que foi mais que isso." Ele sorri. "Mas é o suficiente, e o suficiente é o que existe."'
  ],
  derrota:d=>[
    'Você perde numa ilha com um vulcão ativo, dentro de um prédio com ar-condicionado quebrado.',
    'Blaine te dá água e espera você respirar.',
    '"Você lutou contra o calor em vez de lutar contra o Pokémon. Todo mundo faz isso aqui. O calor não tem HP, garoto."'
  ]
},

/* ── 8 ─────────────────────────────────────────────────── */
{
  id:'viridian', num:8, cidade:'Viridian', lider:'Giovanni', tipo:'Terrestre',
  insignia:'Insígnia Terra', capMin:2, requerInsignias:7, faixa:'48–55',
  efeito:'A Liga passa a te tratar como alguém que terminou o que começou.',
  time:[{dex:111,nivel:48},{dex:51,nivel:50},{dex:31,nivel:51},{dex:34,nivel:52},{dex:112,nivel:55}],
  premio:{dinheiro:12000, itens:{'Ultra Ball':3,'Full Heal':3,'Hyper Potion':2}, rep:2},

  comoDestravar:'O ginásio de Viridian está fechado desde que a Equipe Rocket caiu. Dizem que reabre quando alguém junta sete insígnias — ninguém sabe por quê.',

  intro:d=>[
    'O ginásio de Viridian está fechado há dois anos. Você passou por ele no segundo dia da sua jornada e a porta estava lacrada.',
    'Hoje está aberta.',
    'Lá dentro é o oposto de tudo que você esperava: limpo, iluminado, organizado, com licença emoldurada na parede e certificado de vistoria de agosto.',
    'O homem no centro da arena tem cinquenta e poucos anos, terno bom, e cumprimenta você pelo nome completo.',
    '"Eu sou o líder deste ginásio. O registro está na parede, se quiser conferir."',
    'Você confere. Está.',
    '"Giovanni."',
    '"Esse mesmo." Ele não nega nada, não se explica e não pede nada. "A Liga não pôde me tirar a licença porque a licença nunca esteve em nome de nenhuma organização. Estava em meu nome. Sempre esteve."',
    d.flags.sabe_da_terceira
      ? '"E você conheceu a terceira." Ele diz isso sem nenhuma inflexão. "Ela é boa. Melhor que o segundo. Pior que eu — mas isso é vaidade minha, e eu já tive tempo pra reconhecer as minhas vaidades."'
      : '"Duas coisas sobreviveram àquilo tudo: esta licença e o meu nome. Eu uso as duas, legalmente, todos os dias. É a coisa mais eficiente que eu já fiz."'
  ],
  vitoria:d=>[
    'O Rhydon cai sobre o próprio joelho e o piso de concreto racha embaixo dele.',
    'Giovanni olha a rachadura antes de olhar você. Depois anda até a parede, tira a insígnia de uma caixa, e te entrega com as duas mãos.',
    '"Oito." Ele diz o número devagar. "Você tem oito."',
    d.via==='foragido' || d.via==='mercenario'
      ? '"E eu sei o que mais você tem." Um sorriso muito curto. "Não se preocupe. Eu não sou nenhum tipo de autoridade moral, e você não é nenhum tipo de novidade. Você é uma etapa. Eu fui uma etapa também."'
      : Estado.rep.eixo==='bom' && Estado.rep.bom>=6
      ? '"As pessoas vão te oferecer coisas agora." Ele guarda a caixa. "Vão te oferecer cargo, vão te oferecer nome, vão te oferecer a chance de consertar alguma coisa grande. Aceite exatamente uma delas. Eu aceitei todas, e é por isso que eu dou aula de batalha num galpão em Viridian."'
      : '"Não me agradeça e não me odeie. As duas coisas são trabalho demais para o que eu sou hoje."',
    'Na saída, ele fala mais uma vez, e é a única frase em que a voz dele muda:',
    '"O que está no norte não é um Pokémon. Quando você chegar lá, lembre que a culpa é minha também. Eu financiei os primeiros quatro anos."'
  ],
  derrota:d=>[
    'Você perde para cinco Pokémon de terra num piso de concreto.',
    'Giovanni não comemora. Ele chama alguém para levar seu time ao Centro e espera com você até chegarem.',
    '"Você tem sete insígnias e perdeu para mim." Ele checa o relógio. "Isso é normal. Eu tive vinte anos de vantagem e uma organização inteira pra treinar contra. Volte."'
  ]
}
];

function ginasioPorId(id){ return GINASIOS.find(g => g.id === id) || null; }

/* Estado de cada ginásio para o jogador atual */
function statusGinasio(g){
  const d = Estado.dados;
  if (d.insignias.includes(g.insignia)) return {estado:'conquistado', texto:'Insígnia conquistada'};
  if (g.requerInsignias && d.insignias.length < g.requerInsignias)
    return {estado:'trancado', texto:`Abre com ${g.requerInsignias} insígnias (você tem ${d.insignias.length})`};
  if (d.capitulo < g.capMin)
    return {estado:'distante', texto:`Você ainda não chegou em ${g.cidade}`};
  if (g.recusa){
    const r = g.recusa(d);
    if (r) return {estado:'recusado', texto:'O líder se recusa a lutar com você', fala:r};
  }
  return {estado:'disponivel', texto:'Disponível'};
}

function insigniasConquistadas(){
  return GINASIOS.filter(g => Estado.dados.insignias.includes(g.insignia)).length;
}
