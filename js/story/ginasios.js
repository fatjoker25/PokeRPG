/* ============================================================
   OS OITO GINÁSIOS DE KANTO
   Ordem livre: você escolhe por onde começar, e o time de cada
   líder escala com quantas insígnias você já tem.
   Viridian é a exceção — Blue só recebe quem já tem sete.
   ============================================================ */

/* Cidade natal -> ginásio que já é "o seu" desde o primeiro dia */
const GINASIO_DE_CASA = {
  'Pallet':'pewter', 'Viridian':'viridian', 'Pewter':'pewter', 'Cerulean':'cerulean',
  'Vermilion':'vermilion', 'Lavender':'saffron', 'Celadon':'celadon', 'Fuchsia':'fuchsia',
  'Saffron':'saffron', 'Cinnabar':'cinnabar', 'Indigo':'viridian'
};

/* O título de Campeão fica na mesma lista, mas não é insígnia */
function numInsignias(){
  return Estado.dados.insignias.filter(i => i !== 'Título de Campeão').length;
}

const GINASIOS = [

/* ── PEWTER ─────────────────────────────────────────────── */
{
  id:'pewter', cidade:'Pewter', lider:'Brock', tipo:'Pedra',
  insignia:'Insígnia Pedra', nivelBase:12,
  especies:[74, 95, 112, 76, 141, 142],   // Geodude, Onix, Rhydon, Golem, Kabutops, Aerodactyl
  efeito:'Pokémon que não escolheram você passam a hesitar menos.',
  premio:{dinheiro:1200, itens:{'Super Potion':2}, rep:1},

  intro:d=>[
    'O chão do ginásio é de terra batida sobre pedra. Não tem arquibancada — tem uma linha pintada e um homem parado do outro lado dela.',
    numInsignias() === 0
      ? '"Primeira?" Brock nem espera resposta. "Então escuta: eu não pego leve. Se eu pegar leve, você morre na segunda cidade achando que era bom."'
      : `"${numInsignias()} insígnias." Ele olha o seu cinto e ajusta alguma coisa na cabeça. "Então eu subo o meu time. Ginásio que não acompanha o desafiante é museu."`
  ],
  vitoria:d=>[
    'O último cai de lado e o chão inteiro sente. A poeira leva um tempo pra assentar.',
    'Brock atravessa a linha pintada e te entrega a insígnia na mão, não no ar.',
    d.cemiterio.length
      ? `"Eu soube do que aconteceu com ${nomeExib(d.cemiterio[0])}." Ele não suaviza. "Isso não some. Você vai treinar com isso do lado pelo resto da vida, e é assim mesmo."`
      : '"Cuida deles melhor do que você cuida de você. Treinador ruim é o que se esquece disso."'
  ],
  derrota:d=>[
    'Você perde. Não por pouco.',
    'Brock não comemora. Recolhe o time e vem até você com uma Super Potion na mão.',
    '"Volta." Ele diz isso como ordem, não como consolo. "Amanhã, semana que vem, quando for. Mas volta."'
  ]
},

/* ── CERULEAN ───────────────────────────────────────────── */
{
  id:'cerulean', cidade:'Cerulean', lider:'Misty', tipo:'Água',
  insignia:'Insígnia Cascata', nivelBase:13,
  especies:[120, 61, 121, 87, 131, 130],  // Staryu, Poliwhirl, Starmie, Dewgong, Lapras, Gyarados
  efeito:'Lojas de Kanto passam a te vender o estoque de trás do balcão.',
  premio:{dinheiro:2400, itens:{'Super Potion':2,'Great Ball':3}, rep:1},

  recusa:d=>{
    const lavou = Estado.rep.eixo==='bom' && Estado.rep.bom >= 4;
    if (lavou) return null;
    if (d.flags.ignorou_marta) return '"Eu conheço a Marta." Misty não se levanta da beira da piscina. "Ela me contou de um treinador que passou reto. Não descreveu, mas eu não preciso de descrição."';
    if (d.flags.agrediu_envenenador) return '"Três pessoas estavam pescando a duzentos metros." Ela olha a água. "Elas vieram aqui contar. Eu não luto com quem resolve as coisas assim."';
    return null;
  },
  comoDestravar:'Misty ouviu o que aconteceu na Rota 25. Faça o bastante do outro lado (reputação Boa nível 4) e ela abre a piscina.',

  intro:d=>[
    'O ginásio de Cerulean é uma piscina olímpica com uma passarela no meio. A acústica faz tudo ecoar duas vezes.',
    d.flags.salvou_vaporeon
      ? '"Você é o da Rota 25." Misty já está de pé quando você entra. "A Marta chorou aqui na minha porta contando. Eu ia te procurar."'
      : d.flags.destruiu_tigelas || d.flags.entregou_envenenador
      ? '"As tigelas." Ela assente devagar. "Foi você. Meus irmãos acham que foi a prefeitura."'
      : '"Regra da casa: o chão é escorregadio e eu não aviso duas vezes."',
    numInsignias() >= 4 ? '"E você já tem estrada. Eu não vou usar o time de iniciante com você."' : ''
  ],
  vitoria:d=>[
    'O último afunda e o núcleo dele apaga debaixo d\'água — uma luz descendo devagar até o fundo azul.',
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

/* ── VERMILION ──────────────────────────────────────────── */
{
  id:'vermilion', cidade:'Vermilion', lider:'Lt. Surge', tipo:'Elétrico',
  insignia:'Insígnia Trovão', nivelBase:14,
  especies:[100, 81, 26, 82, 101, 125],   // Voltorb, Magnemite, Raichu, Magneton, Electrode, Electabuzz
  efeito:'Você aprende a ler uma sala antes de entrar nela. (+1 Percepção)',
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
    'O último cai e o galpão inteiro apaga — disjuntor geral, escuro total por quatro segundos.',
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

/* ── CELADON ────────────────────────────────────────────── */
{
  id:'celadon', cidade:'Celadon', lider:'Erika', tipo:'Grama',
  insignia:'Insígnia Arco-Íris', nivelBase:15,
  especies:[71, 114, 45, 103, 3, 44],     // Victreebel, Tangela, Vileplume, Exeggutor, Venusaur, Gloom
  efeito:'Você passa a reconhecer veneno, remédio e o que há entre os dois. (+1 Intelecto)',
  premio:{dinheiro:4200, itens:{'Full Heal':3,'Hyper Potion':1}, rep:1, status:'intelecto'},

  recusa:d=>{
    const lavou = Estado.rep.eixo === 'bom' && Estado.rep.bom >= 5;
    if (lavou) return null;
    if (Historia.via()==='mercenario' || Historia.via()==='foragido')
      return '"Eu sei de onde vem o seu dinheiro." Erika continua regando uma samambaia sem olhar pra você. "Eu não vou fingir que não sei só porque você tem insígnias. Sai da minha estufa."';
    if (d.flags.incendiou_deposito)
      return '"Havia seres vivos naquele prédio quando você ateou fogo." Ela finalmente olha. "Eu passei a vida cuidando de coisa que não fala. Você queimou seis. Não."';
    return null;
  },
  comoDestravar:'Erika não luta com quem lucra com aquilo. Faça o bastante do outro lado (reputação Boa nível 5) e ela abre a estufa.',

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
    'A última tomba entre os vasos e o pó dela levanta e desce devagar no ar quente da estufa.',
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

/* ── FUCHSIA ────────────────────────────────────────────── */
{
  id:'fuchsia', cidade:'Fuchsia', lider:'Koga', tipo:'Venenoso',
  insignia:'Insígnia Alma', nivelBase:16,
  especies:[109, 49, 89, 110, 73, 94],    // Koffing, Venomoth, Muk, Weezing, Tentacruel, Gengar
  efeito:'Seu corpo aprende a aguentar o que devia derrubar. (+1 Resistência)',
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
    'O último se desfaz no ar em duas nuvens que descem e ficam rentes ao chão.',
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

/* ── SAFFRON ────────────────────────────────────────────── */
{
  id:'saffron', cidade:'Saffron', lider:'Sabrina', tipo:'Psíquico',
  insignia:'Insígnia Pântano', nivelBase:17,
  especies:[64, 122, 49, 65, 121, 97],    // Kadabra, Mr. Mime, Venomoth, Alakazam, Starmie, Hypno
  efeito:'Você aprende a falar com quem já decidiu não te ouvir. (+1 Carisma)',
  premio:{dinheiro:6000, itens:{'Full Heal':3,'Ultra Ball':2}, rep:1, status:'carisma'},

  recusa:d=>{
    if (d.flags.destruiu_o_11){
      const redimido = Estado.rep.eixo === 'bom' && Estado.rep.bom >= 6;
      if (!redimido)
        return '"Eu senti onze coisas pararem de existir ao mesmo tempo." Sabrina não abre a porta do ginásio. "Você estava lá. Eu não consigo estar na mesma sala que você sem ouvir aquilo de novo."';
    }
    if (d.capitulo < 12 && !d.flags.entrou_no_ginasio_saffron && !d.flags.viu_os_doze && !d.flags.sabrina_aliada)
      return 'O ginásio está trancado. Um papel na porta: "SUSPENSO POR TEMPO INDETERMINADO — S." A luz interna está acesa.';
    return null;
  },
  comoDestravar:'Sabrina fechou o ginásio por causa do que ela ouve embaixo da Silph. Vá até lá — ou espere o mundo seguir sem você.',

  intro:d=>[
    'A arena de Saffron não tem iluminação de teto. A luz vem do chão, e o efeito é que ninguém tem sombra.',
    d.flags.sabrina_aliada
      ? '"Eu reabri por sua causa." Sabrina está de pé, o que já é novidade. "Não porque melhorou. Porque agora tem duas pessoas sabendo, e duas pessoas dividem melhor do que uma carrega."'
      : d.flags.destruiu_o_11
      ? '"Eu ainda ouço." Sabrina abre a porta sem tocar nela. "Mas eu ouvi o que você fez depois, por muito tempo, em muitos lugares. Isso não apaga aquilo. Só me deixa ficar na mesma sala."'
      : d.flags.ivone_tem_o_11 || d.flags.liga_lacrou_o_11
      ? '"O barulho parou na quinta-feira." Ela te olha com uma intensidade desconfortável. "Você é o motivo. Senta."'
      : '"Você pensa alto demais." Ela toca a têmpora. "Eu vou ouvir cada ordem antes de você dar. Isso não é trapaça — é o meu tipo."'
  ],
  vitoria:d=>[
    'O último cai sentado, de olhos abertos, e alguma coisa de metal tilinta no chão de pedra por um tempo longo demais.',
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

/* ── CINNABAR ───────────────────────────────────────────── */
{
  id:'cinnabar', cidade:'Cinnabar', lider:'Blaine', tipo:'Fogo',
  insignia:'Insígnia Vulcão', nivelBase:18,
  especies:[58, 77, 78, 59, 126, 6],      // Growlithe, Ponyta, Rapidash, Arcanine, Magmar, Charizard
  efeito:'Você passa a improvisar quando o plano falha. (+1 Sorte)',
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
    'O último cai e o calor do ginásio inteiro cai junto, de uma vez, como se alguém tivesse fechado um forno.',
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

/* ── VIRIDIAN — BLUE ────────────────────────────────────── */
{
  id:'viridian', cidade:'Viridian', lider:'Blue', tipo:'variado',
  insignia:'Insígnia Terra', nivelBase:30, requerInsignias:7,
  especies:[18, 65, 112, 130, 59, 0],     // Pidgeot, Alakazam, Rhydon, Gyarados, Arcanine, [ace dinâmico]
  aceContraInicial:true,
  efeito:'A Liga passa a te tratar como alguém que terminou o que começou.',
  premio:{dinheiro:12000, itens:{'Ultra Ball':3,'Full Heal':3,'Hyper Potion':2}, rep:2},
  comoDestravar:'O ginásio de Viridian ficou fechado dois anos depois que a Equipe Rocket caiu. Blue reabriu com uma regra: sete insígnias, ou nada.',

  intro:d=>[
    'O ginásio de Viridian ficou lacrado por dois anos depois que a Equipe Rocket foi desmontada. Ninguém quis o lugar. Ele tinha cheiro do que tinha sido.',
    'Hoje está aberto, repintado, e tem uma placa nova na porta que diz só: "SETE INSÍGNIAS."',
    'O líder tem a sua idade mais três ou quatro anos, jaqueta cara e uma segurança que não é totalmente falsa.',
    '"Blue." Ele não estende a mão. "Antes que você pergunte: sim, aquele Blue. E não, eu não sei onde o Red está."',
    d.flags.sabe_da_terceira
      ? '"E você andou em Celadon." Ele senta na borda da arena. "Aquela mulher do cassino. Sabe por que ela usa o número três? Porque o primeiro era o Giovanni, e o Giovanni foi preso, e a Rocket acabou de verdade." Uma pausa. "O que sobrou não é Rocket. É gente com planilha. É pior."'
      : '"Todo mundo que entra aqui espera encontrar outra pessoa." Ele senta na borda da arena. "A Rocket acabou. O Giovanni foi preso. Eu peguei um ginásio vazio porque ninguém queria, e agora ele é meu."',
    numInsignias() >= 7
      ? '"Sete insígnias." Ele finalmente levanta. "Então você é sério. Vamos ver o quanto."'
      : ''
  ],
  vitoria:d=>[
    'O último cai e Blue fica olhando a arena por um tempo antes de olhar você.',
    '"Ok." Ele diz só isso por uns cinco segundos. "Ok."',
    'Ele pega a insígnia de uma caixa na parede e te entrega.',
    '"Eu fui campeão por quatorze minutos." Ele guarda a caixa. "Catorze. Aí o Red entrou pela porta e eu voltei a ser o cara que perdeu."',
    Estado.rep.eixo==='bom' && Estado.rep.bom>=6
      ? '"Você é melhor do que eu era. Isso não me incomoda mais, o que é a coisa mais adulta que eu consegui aprender em dois anos."'
      : d.via==='foragido' || d.via==='mercenario'
      ? '"Eu sei o que falam de você." Ele cruza os braços. "Eu não sou juiz. Mas se você virar o próximo Giovanni, eu vou ser a pessoa que te para, e eu vou odiar isso."'
      : '"Guarda essa insígnia. Ela vale exatamente o que você fez pra conseguir e nada além."',
    'Na porta, ele fala mais uma vez:',
    '"Se você for pro norte — e você vai, todo mundo vai — lembra de uma coisa que o Red me disse uma única vez. Ele disse que não capturou aquilo porque aquilo perguntou uma coisa pra ele e ele não soube responder."',
    '"O Red nunca falava nada. Essa foi a frase mais longa que eu ouvi dele na vida."'
  ],
  derrota:d=>[
    'Você perde para seis Pokémon completamente destreinados de fraqueza.',
    'Blue não comemora. Ele parece quase irritado.',
    '"Você chegou aqui com sete insígnias e perdeu." Ele chama alguém pra levar seu time ao Centro. "Isso significa que uma delas foi de graça. Descobre qual e volta."'
  ]
}
];

/* ============================================================
   ESCALA: o time do líder acompanha quantas insígnias você tem
   ============================================================ */
function timeGinasio(g){
  const n = numInsignias();                             // 0..7
  const qtd = Math.max(2, Math.min(g.especies.length, 2 + Math.round(n * 0.6)));
  const nivel = g.nivelBase + n * 4;
  const lista = g.especies.slice(0, qtd).map((dex, i) => ({dex, nivel: nivel + i}));
  // o último é o ace: dois níveis acima do resto
  if (lista.length) lista[lista.length-1].nivel += 2;

  // Blue fecha com o inicial que vence o seu
  if (g.aceContraInicial){
    const contra = {1:6, 4:9, 7:3};                     // Bulbasaur->Charizard, Charmander->Blastoise, Squirtle->Venusaur
    const meu = Estado.j.inicialDex;
    const ace = contra[meu] || Dados.escolher([3,6,9]);
    lista[lista.length-1] = {dex:ace, nivel: nivel + lista.length + 3};
  }
  return lista;
}

function faixaGinasio(g){
  const t = timeGinasio(g);
  if (!t.length) return '—';
  return `${t[0].nivel}–${t[t.length-1].nivel}`;
}

function ginasioPorId(id){ return GINASIOS.find(g => g.id === id) || null; }

/* Estado de cada ginásio para o jogador atual */
function statusGinasio(g){
  const d = Estado.dados;
  if (d.insignias.includes(g.insignia)) return {estado:'conquistado', texto:'Insígnia conquistada'};
  if (g.requerInsignias && numInsignias() < g.requerInsignias)
    return {estado:'trancado', texto:`Abre com ${g.requerInsignias} insígnias (você tem ${numInsignias()})`};
  // o ginásio da sua cidade natal está aberto desde o primeiro dia; os outros, a partir do capítulo 2
  const deCasa = GINASIO_DE_CASA[d.jogador.cidade] === g.id;
  if (!deCasa && d.capitulo < 2)
    return {estado:'distante', texto:'Você mal saiu de casa'};
  if (g.recusa){
    const r = g.recusa(d);
    if (r) return {estado:'recusado', texto:'O líder se recusa a lutar com você', fala:r};
  }
  return {estado:'disponivel', texto: deCasa && !numInsignias() ? 'O ginásio da sua cidade' : 'Disponível'};
}

function insigniasConquistadas(){
  return GINASIOS.filter(g => Estado.dados.insignias.includes(g.insignia)).length;
}
