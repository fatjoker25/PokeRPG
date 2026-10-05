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
  insignia:'Insígnia Pedra', dificuldade:0,
  escaloes:[
    {min:0, especies:[74, 95], variacoes:[27,50,74]},                  // Geodude, Onix
    {min:2, especies:[74, 95, 111], variacoes:[27,50,95,74]},             // + Rhyhorn
    {min:4, especies:[75, 111, 95, 138], variacoes:[28,105,74,95]},        // Graveler, Rhyhorn, Onix, Omanyte
    {min:6, especies:[76, 112, 95, 141, 142], variacoes:[28,105,76,112]}    // Golem, Rhydon, Onix, Kabutops, Aerodactyl
  ],
  efeito:'Pokémon que não escolheram você passam a hesitar menos.',
  premio:{dinheiro:1200, itens:{'Super Potion':2,'TM20 Rage':1}, rep:1},

  /* a conversa de quem volta com a insígnia no bolso */
  depois:d=>[
    'Brock está varrendo a terra da linha pintada pra dentro, que é o que se faz depois de cada luta e ninguém vê.',
    numInsignias() >= 6
      ? fala('Líder Brock', `${numInsignias()} insígnias. Eu ouço falar de você no rádio do Centro. Não deixa o rádio decidir quem você é.`)
      : fala('Líder Brock', 'Voltou pra ver se o chão ainda é de terra? É. Vai continuar sendo.'),
    d.cemiterio.length
      ? fala('Líder Brock', 'Você continua carregando quem ficou. Dá pra ver no jeito que você entra. Isso não é fraqueza, é memória.', 'baixo')
      : fala('Líder Brock', 'Se o seu time está comendo direito, dormindo direito e voltando inteiro, você está fazendo mais do que a maioria. Vai.')
  ],

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
  insignia:'Insígnia Cascata', dificuldade:1,
  escaloes:[
    {min:0, especies:[116, 120], variacoes:[54,118,98]},                     // Horsea, Staryu
    {min:2, especies:[116, 120, 60], variacoes:[54,118,98,86]},                 // + Poliwag
    {min:4, especies:[117, 61, 121, 119], variacoes:[55,119,99,87]},            // Seadra, Poliwhirl, Starmie, Seaking
    {min:6, especies:[117, 62, 87, 131, 121, 130], variacoes:[55,119,99,80]}    // Seadra, Poliwrath, Dewgong, Lapras, Starmie, Gyarados
  ],
  efeito:'Lojas de Kanto passam a te vender o estoque de trás do balcão.',
  premio:{dinheiro:2400, itens:{'Super Potion':2,'Great Ball':3,'TM11 Bubble Beam':1}, rep:1},

  recusa:d=>{
    const lavou = Estado.rep.eixo==='bom' && Estado.rep.bom >= 4;
    if (lavou) return null;
    if (d.flags.ignorou_marta) return '"Eu conheço a Sibyl." Misty não se levanta da beira da piscina. "Ela me contou de {um treinador|uma treinadora} que passou reto. Não descreveu, mas eu não preciso de descrição."';
    if (d.flags.agrediu_envenenador) return '"Três pessoas estavam pescando a duzentos metros." Ela olha a água. "Elas vieram aqui contar. Eu não luto com quem resolve as coisas assim."';
    return null;
  },
  comoDestravar:'Misty ouviu o que aconteceu na Rota 25. Ela abre a piscina pra quem Kanto passar a contar de outro jeito.',

  depois:d=>[
    'Misty está na beira da piscina com os pés dentro da água, de costas pra porta.',
    fala('Líder Misty', d.flags.salvou_vaporeon
      ? 'A Sibyl passou aqui de novo. Ela pergunta de você toda vez, e eu nunca sei o que responder, então eu invento.'
      : 'Se veio nadar, a piscina é pública depois das seis. Se veio lutar de novo, a insígnia já está no seu bolso.'),
    fala('Líder Misty', 'E não deixa ninguém te dizer que água é tipo fácil. Água é paciência. Quem não tem, afoga.', 'riso')
  ],

  intro:d=>[
    'O ginásio de Cerulean é uma piscina olímpica com uma passarela no meio. A acústica faz tudo ecoar duas vezes.',
    d.flags.salvou_vaporeon
      ? '"Você é o da Rota 25." Misty já está de pé quando você entra. "A Sibyl chorou aqui na minha porta contando. Eu ia te procurar."'
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
    'Você sai da piscina encharcad{o|a} e derrotad{o|a}, o que é uma combinação humilhante específica.',
    'Misty joga uma toalha na sua cara sem nenhuma delicadeza.',
    '"O problema não é o seu time. É que você tem pressa. Água não tem pressa."'
  ]
},

/* ── VERMILION ──────────────────────────────────────────── */
{
  id:'vermilion', cidade:'Vermilion', lider:'Lt. Surge', tipo:'Elétrico',
  insignia:'Insígnia Trovão', dificuldade:1,
  escaloes:[
    {min:0, especies:[100, 25], variacoes:[81,25,100]},                      // Voltorb, Pikachu
    {min:2, especies:[100, 81, 25], variacoes:[81,25,100]},                  // + Magnemite
    {min:4, especies:[101, 82, 26, 125], variacoes:[26,82,101,125]},             // Electrode, Magneton, Raichu, Electabuzz
    {min:6, especies:[101, 82, 125, 135, 26], variacoes:[26,82,101,135]}         // + Jolteon, Raichu de ace
  ],
  efeito:'Você aprende a ler uma sala antes de entrar nela. (+1 Percepção)',
  premio:{dinheiro:3500, itens:{'Hyper Potion':1,'Great Ball':3,'TM24 Thunderbolt':1}, rep:1, status:'percepcao'},

  depois:d=>[
    'O galpão está com metade das luzes acesas e Surge está trocando um fusível em cima de uma escada.',
    fala('Líder Lt. Surge', 'Ô, você! Segura a escada.', 'grita'),
    d.flags.provas_navio || d.flags.caderno_do_trafico
      ? fala('Líder Lt. Surge', 'Os caminhões pararam de sair de madrugada. Eu não sei se foi você. Eu não vou perguntar. Mas pararam.', 'baixo')
      : fala('Líder Lt. Surge', 'Porto continua igual: chega coisa, sai coisa. Mas agora eu pergunto de vez em quando. Culpa sua.')
  ],

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
  insignia:'Insígnia Arco-Íris', dificuldade:2,
  escaloes:[
    {min:0, especies:[43, 69], variacoes:[46,102,43]},                       // Oddish, Bellsprout
    {min:2, especies:[44, 70, 102], variacoes:[46,102,44,70]},                  // Gloom, Weepinbell, Exeggcute
    {min:4, especies:[45, 70, 114, 102], variacoes:[47,103,45,71]},             // Vileplume, Weepinbell, Tangela, Exeggcute
    {min:6, especies:[45, 71, 114, 103, 3], variacoes:[47,103,114,45]}           // Vileplume, Victreebel, Tangela, Exeggutor, Venusaur
  ],
  efeito:'Você passa a reconhecer veneno, remédio e o que há entre os dois. (+1 Intelecto)',
  premio:{dinheiro:4200, itens:{'Full Heal':3,'Hyper Potion':1,'TM21 Mega Drain':1}, rep:1, status:'intelecto'},

  recusa:d=>{
    const lavou = Estado.rep.eixo === 'bom' && Estado.rep.bom >= 5;
    if (lavou) return null;
    if (Historia.via()==='mercenario' || Historia.via()==='foragido')
      return '"Eu sei de onde vem o seu dinheiro." Erika continua regando uma samambaia sem olhar pra você. "Eu não vou fingir que não sei só porque você tem insígnias. Sai da minha estufa."';
    if (d.flags.incendiou_deposito)
      return '"Havia seres vivos naquele prédio quando você ateou fogo." Ela finalmente olha. "Eu passei a vida cuidando de coisa que não fala. Você queimou seis. Não."';
    return null;
  },
  comoDestravar:'Erika não luta com quem lucra com aquilo. A estufa abre pra quem Kanto passar a contar de outro jeito.',

  depois:d=>[
    'Erika está podando uma planta que já parece perfeita. Ela não para quando você entra.',
    fala('Líder Erika', 'Você voltou com o cheiro da estrada. Senta um pouco. Ninguém aqui vai te cobrar por sentar.'),
    fala('Líder Erika', numInsignias() >= 6
      ? 'Faltam poucas, eu sei. Quando acabar, lembra de voltar aqui sem motivo. É a melhor visita que existe.'
      : 'Planta cresce no tempo dela. Time também. Quem apressa um, estraga o outro.')
  ],

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
    'Você perde numa estufa, cercad{o|a} de plantas, em silêncio.',
    'Erika não humilha e não consola. Ela volta a regar.',
    '"Você atacou o tempo todo. Contra grama, atacar o tempo todo é a maneira mais elegante de perder devagar."'
  ]
},

/* ── FUCHSIA ────────────────────────────────────────────── */
{
  id:'fuchsia', cidade:'Fuchsia', lider:'Koga', tipo:'Venenoso',
  insignia:'Insígnia Alma', dificuldade:3,
  escaloes:[
    {min:0, especies:[41, 109], variacoes:[48,88,41]},                      // Zubat, Koffing
    {min:2, especies:[41, 109, 88], variacoes:[48,88,109,41]},                  // + Grimer
    {min:4, especies:[42, 110, 89, 48], variacoes:[49,89,72,110]},              // Golbat, Weezing, Muk, Venonat
    {min:6, especies:[42, 110, 89, 49, 73, 94], variacoes:[49,89,73,94]}       // + Venomoth, Tentacruel, Gengar
  ],
  efeito:'Seu corpo aprende a aguentar o que devia derrubar. (+1 Resistência)',
  premio:{dinheiro:5000, itens:{'Full Heal':3,'Antidote':3,'Ultra Ball':1,'TM06 Toxic':1}, rep:1, status:'resistencia'},

  depois:d=>[
    'O ginásio de Fuchsia está com as paredes falsas fechadas, o que quer dizer que Koga não está esperando ninguém.',
    'Ele aparece mesmo assim, de um lugar que não era porta.',
    fala('Líder Koga', 'Quem volta a um ginásio já vencido está procurando outra coisa. Eu também procuro. Ninguém acha nada aqui.', 'frio'),
    fala('Líder Koga', 'Veneno ensina uma coisa só: o que mata devagar é o que ninguém vê chegando. Lembra disso quando alguém sorrir demais pra você.')
  ],

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
  insignia:'Insígnia Pântano', dificuldade:3,
  escaloes:[
    {min:0, especies:[63, 122], variacoes:[96,63,122]},                      // Abra, Mr. Mime
    {min:2, especies:[63, 96, 122], variacoes:[96,63,79,122]},                  // + Drowzee
    {min:4, especies:[64, 97, 122, 79], variacoes:[80,97,64,102]},              // Kadabra, Hypno, Mr. Mime, Slowpoke
    {min:6, especies:[64, 97, 122, 80, 121, 65], variacoes:[80,97,121,65]}      // + Slowbro, Starmie, Alakazam
  ],
  efeito:'Você aprende a falar com quem já decidiu não te ouvir. (+1 Carisma)',
  premio:{dinheiro:6000, itens:{'Full Heal':3,'Ultra Ball':2,'TM46 Psywave':1}, rep:1, status:'carisma'},

  recusa:d=>{
    if (d.flags.destruiu_o_11){
      const redimido = Estado.rep.eixo === 'bom' && Estado.rep.bom >= 6;
      if (!redimido)
        return '"Eu senti onze coisas pararem de existir ao mesmo tempo." Sabrina não abre a porta do ginásio. "Você estava lá. Eu não consigo estar na mesma sala que você sem ouvir aquilo de novo."';
    }
    /* Antes da terceira insígnia a Rocket ainda não pôs o pé na Silph,
       e Sabrina recebe quem aparecer. Da terceira em diante a torre de
       vidro está tomada, o ginásio fecha e só reabre depois da Silph. */
    if (numInsignias() >= 3 && d.capitulo < 12 && !d.flags.entrou_no_ginasio_saffron && !d.flags.viu_os_doze && !d.flags.sabrina_aliada)
      return 'O ginásio está trancado. Um papel na porta: "SUSPENSO POR TEMPO INDETERMINADO — S." A luz interna está acesa. Duas quadras pra cima, tem homem de terno escuro na porta da Silph, e nenhum deles é da Silph.';
    return null;
  },
  comoDestravar:'Sabrina fechou o ginásio por causa do que ela ouve embaixo da Silph. Vá até lá — ou espere o mundo seguir sem você.',

  depois:d=>[
    'A luz vem do chão de novo. Sabrina não levanta a cabeça.',
    fala('Líder Sabrina', 'Você ia perguntar se eu estou bem. Eu ouvi antes de você entrar.', 'baixo'),
    d.flags.sabrina_aliada || d.flags.viu_os_doze
      ? fala('Líder Sabrina', 'Está mais quieto lá embaixo. Não é silêncio. É menos barulho. Já é alguma coisa.')
      : fala('Líder Sabrina', 'A cidade continua pensando alto. Você pensa um pouco mais baixo agora. Volte quando pensar mais baixo ainda.')
  ],

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
  insignia:'Insígnia Vulcão', dificuldade:4,
  escaloes:[
    {min:0, especies:[37, 58], variacoes:[37,58,77]},                       // Vulpix, Growlithe
    {min:2, especies:[37, 58, 77], variacoes:[37,58,77]},                   // + Ponyta
    {min:4, especies:[38, 78, 126, 58], variacoes:[38,78,126,59]},              // Ninetales, Rapidash, Magmar, Growlithe
    {min:6, especies:[38, 78, 126, 136, 59, 6], variacoes:[38,78,126,136]}       // + Flareon, Arcanine, Charizard
  ],
  efeito:'Você passa a improvisar quando o plano falha. (+1 Sorte)',
  premio:{dinheiro:7000, itens:{'Hyper Potion':3,'Ultra Ball':2,'TM38 Fire Blast':1}, rep:1, status:'sorte'},

  depois:d=>[
    'Blaine está na lousa de novo, escrevendo uma conta que não termina.',
    fala('Líder Blaine', 'Equação de calor. Eu escrevo todo dia e todo dia ela dá o mesmo resultado. É reconfortante.'),
    fala('Líder Blaine', d.flags.leu_caderno
      ? 'Você ainda carrega o que leu naquele caderno. Eu também. A gente podia almoçar um dia, só pra não carregar sozinho.'
      : 'Volta quando quiser aprender física. Eu dou aula de graça pra quem já me venceu. É a única regra que eu inventei.', 'riso')
  ],

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
      : '"Você é rápid{o|a} e eu sou velho. Não se engane achando que foi mais que isso." Ele sorri. "Mas é o suficiente, e o suficiente é o que existe."'
  ],
  derrota:d=>[
    'Você perde numa ilha com um vulcão ativo, dentro de um prédio com ar-condicionado quebrado.',
    'Blaine te dá água e espera você respirar.',
    '"Você lutou contra o calor em vez de lutar contra o Pokémon. Todo mundo faz isso aqui. O calor não tem HP, {garoto|garota}."'
  ]
},

/* ── VIRIDIAN — BLUE ────────────────────────────────────── */
{
  id:'viridian', cidade:'Viridian', lider:'Blue', tipo:'variado',
  insignia:'Insígnia Terra', dificuldade:8, requerInsignias:7,
  escaloes:[
    {min:0, especies:[18, 65, 112, 130, 59, 0], variacoes:[53,85,49,80,113]}       // só existe um escalão: ele só recebe quem tem sete
  ],
  aceContraInicial:true,
  efeito:'A Liga passa a te tratar como alguém que terminou o que começou.',
  premio:{dinheiro:12000, itens:{'Ultra Ball':3,'Full Heal':3,'Hyper Potion':2,'TM43 Sky Attack':1}, rep:2},
  comoDestravar:'O ginásio de Viridian ficou fechado dois anos depois que a Equipe Rocket caiu. Blue reabriu com uma regra: sete insígnias, ou nada.',

  depois:d=>[
    'Blue está sentado na borda da arena com o celular na mão, e guarda rápido demais quando você entra.',
    fala('Líder Blue', 'Não era nada. Era o meu avô. Ele pergunta de você, sabia? Pergunta mais de você do que de mim.'),
    fala('Líder Blue', 'Oito insígnias. A Rota 23 está te esperando, e ela não espera ninguém por muito tempo. Vai logo.')
  ],

  intro:d=>[
    'O ginásio de Viridian ficou lacrado por dois anos depois que a Equipe Rocket foi desmontada. Ninguém quis o lugar. Ele tinha cheiro do que tinha sido.',
    'Hoje está aberto, repintado, e tem uma placa nova na porta que diz só: "SETE INSÍGNIAS."',
    'O líder tem a sua idade mais três ou quatro anos, jaqueta cara e uma segurança que não é totalmente falsa.',
    '"Blue." Ele não estende a mão. "Antes que você pergunte: sim, aquele Blue. E não, eu não sei onde o Red está."',
    d.flags.sabe_da_terceira
      ? '"E você andou em Celadon." Ele senta na borda da arena. "Aquela mulher do cassino. Sabe por que ela usa o número três? Porque o primeiro era o Giovanni, e o Giovanni foi preso, e a Rocket acabou de verdade." Uma pausa. "O que sobrou não é Rocket. É gente com planilha. É pior."'
      : '"Todo mundo que entra aqui espera encontrar outra pessoa." Ele senta na borda da arena. "A Rocket acabou. O Giovanni foi preso. Eu peguei um ginásio vazio porque ninguém queria, e agora ele é meu."',
    numInsignias() >= 7
      ? '"Sete insígnias." Ele finalmente levanta. "Então você é séri{o|a}. Vamos ver o quanto."'
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
   ESCALA — o líder adapta o TIME INTEIRO ao seu progresso
   Não é só nível: com poucas insígnias ele usa Pokémon não
   evoluídos; com muitas, traz a linha completa e o ace.
   ============================================================ */
const ESCALOES_NIVEL = [
  {min:0, base:10},   // novato
  {min:2, base:18},
  {min:4, base:28},
  {min:6, base:40}    // reta final
];

function escalaoDe(g, n){
  let alvo = g.escaloes[0];
  for (const e of g.escaloes) if (n >= e.min) alvo = e;
  return alvo;
}

/* O líder também não fica pra trás da estrada: quem deixa um ginásio pra
   depois encontra o líder no nível do capítulo em que está, menos
   ABAIXO_DA_AREA. Sem isso, a insígnia que o capítulo seguinte pede era
   de 6 a 13 níveis mais fraca que a luta de história daquele ponto
   (Misty no 17 pra um capítulo de área 30), e não preparava ninguém. */
const ABAIXO_DA_AREA = 8;
function pisoDoGinasio(){
  const d = Estado.dados;
  if (!d || d.capitulo < 2 || typeof Historia === 'undefined') return 0;
  const cap = Historia.capitulo(d.capitulo);
  return cap && cap.nivelArea ? cap.nivelArea - ABAIXO_DA_AREA : 0;
}

function timeGinasio(g, nForcado){
  // ginásio ainda trancado mostra o time do momento em que ele abre
  const n = (nForcado !== undefined) ? nForcado
          : (g.requerInsignias && numInsignias() < g.requerInsignias ? g.requerInsignias : numInsignias());
  const esc = escalaoDe(g, n);
  let faixa = ESCALOES_NIVEL[0];
  for (const f of ESCALOES_NIVEL) if (n >= f.min) faixa = f;
  const base = Math.max(faixa.base + (g.dificuldade || 0) + (n - faixa.min) * 3, pisoDoGinasio());

  // o líder não repete o mesmo time: parte dos slots varia a cada desafio
  const especies = esc.especies.slice();
  const pool = (esc.variacoes || []).filter(x => !especies.includes(x));
  for (let i = 0; i < especies.length - 1 && pool.length; i++){
    if (Dados.chance(45)){
      const j = Dados.entre(0, pool.length - 1);
      especies[i] = pool.splice(j, 1)[0];
    }
  }
  const lista = especies.map((dex, i) => ({dex, nivel: base + i}));
  if (lista.length) lista[lista.length-1].nivel += 2;   // ace, sempre o mesmo

  // Blue fecha com o inicial que vence o seu
  if (g.aceContraInicial){
    const contra = {1:6, 4:9, 7:3};
    const ace = contra[Estado.j.inicialDex] || Dados.escolher([3,6,9]);
    lista[lista.length-1] = {dex:ace, nivel: base + lista.length + 3};
  }
  return lista;
}

function faixaGinasio(g){
  const t = timeGinasio(g);
  if (!t.length) return '—';
  return `${t[0].nivel}–${t[t.length-1].nivel}`;
}

/* Nível aproximado do ginásio — o que se ouve na cidade, sem detalhe */
function nivelGinasio(g){
  const t = timeGinasio(g);
  if (!t.length) return 10;
  return Math.round(t.reduce((s,x)=>s+x.nivel,0) / t.length / 5) * 5;
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

/* ============================================================
   O QUE A ESTRADA COBRA EM INSÍGNIAS
   Alguns capítulos só começam com um mínimo de insígnias, e as guaritas
   da Rota 23 só deixam subir pro Caminho da Vitória com as oito, como
   nos jogos. Sem isso dava pra chegar ao fim da história sem entrar num
   ginásio, e o time chegava a cada área uns quatro níveis abaixo dela.

   Mas a estrada só cobra o que o mundo deixa você ter. Misty, Erika e
   Sabrina podem se recusar a lutar com você pelo resto do jogo, e Blue
   só abre com sete: se nenhum ginásio que falta está aberto pra você,
   a porta abre com o que você tem. Ninguém fica preso no meio do jogo.
   ============================================================ */
const INSIGNIAS_DO_CAPITULO = {6:1, 8:2, 10:3, 11:3, 12:4, 14:5, 17:6, 22:8};
const INSIGNIAS_DA_PASSAGEM = {'rota23>caminho_vitoria':8, 'caminho_vitoria>rota23':0};

function ginasioAoAlcance(){
  return GINASIOS.some(g => statusGinasio(g).estado === 'disponivel');
}
/* null se pode passar; senão {pedidas, tem} */
function faltaInsignias(pedidas){
  const tem = numInsignias();
  if (!pedidas || tem >= pedidas || !ginasioAoAlcance()) return null;
  return {pedidas, tem};
}
function travaDoCapitulo(n){ return faltaInsignias(INSIGNIAS_DO_CAPITULO[n]); }
function travaDaPassagem(de, para){
  const b = (typeof Barreiras !== 'undefined') ? Barreiras.entre(de, para) : null;
  if (b) return {barreira:b, texto:b.texto};
  return faltaInsignias(INSIGNIAS_DA_PASSAGEM[de + '>' + para]);
}
function textoTrava(t){
  if (t.texto) return t.texto;
  return `Isso espera quem tem ${t.pedidas} insígnia${t.pedidas === 1 ? '' : 's'}. Você tem ${t.tem}.`;
}

function insigniasConquistadas(){
  return GINASIOS.filter(g => Estado.dados.insignias.includes(g.insignia)).length;
}
