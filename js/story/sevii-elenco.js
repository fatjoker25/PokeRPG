/* ============================================================
   O ELENCO DAS ILHAS SEVII — quem vem pro Torneio das Ilhas
   Foi pedido assim: treinadores de Johto e de Hoenn, fortes, uns
   especialistas num tipo e outros com time variado, cada um com
   ficha como a de quem joga (a inscrição: traços, objetivo, gostos,
   o status forte, aparência) e rosto só dele, guardado em
   sprites_nds/npcs/trainers/sevii_<id>.png. Personagem marcante, que
   conta da jornada e de por que veio — porque eles vão aparecer de
   novo noutra região.

   Cada ficha:
     id, nome, sobrenome, f (mulher), idade, nasceu (dia, mês),
     regiao, de (cidade), classe, tipo (o da especialidade; null é
     time variado), tracos (2 ou 3, os da ficha de inscrição), meta
     (um dos sete rumos de rumo.js), gosta/desgosta ({lugar, tipo,
     especie}), forte (o status que começa em 2), aparencia (o que o
     rosto mostra), voz (como fala), jornada e porque (o que ele conta,
     cena por cena), gancho (o que fica pra depois), time (do mais
     fraco ao ás: [dex, golpes, natureza, item]), falas do torneio
     (torneio, vence, perde) e ajuste (o acerto de nível, medido no
     sim-sevii).
   O que vem da história (o Pokémon roubado, quem entra no torneio)
   mora em sevii.js; aqui é só quem a pessoa é.

   O docs/SEVII.md é gerado daqui (ferramentas/fichas-sevii.js).
   ============================================================ */
const ELENCO_SEVII = [

/* ─────────────────────────── JOHTO ─────────────────────────── */
{
  id:'soren', nome:'Soren', sobrenome:'Larkspur', f:false, idade:19, nasceu:[2, 11],
  regiao:'Johto', de:'Blackthorn', classe:'Domador de Dragões', tipo:'Dragão',
  tracos:['teimoso', 'solitário', 'leal'], meta:'vinculo', forte:'resistencia',
  gosta:{lugar:'montanha', tipo:'Dragão', especie:'Salamence'},
  desgosta:{lugar:'cidade', tipo:'Gelo', especie:'Glalie'},
  aparencia:'Alto e magro, cabelo azul-escuro preso atrás, capa comprida de domador de dragões, gasta na barra de tanto arrastar em pedra.',
  voz:'Frase curta. Fala de dragão como quem fala de gente da família, e nunca levanta a voz.',
  jornada:[
    'Nasceu no Covil dos Dragões de Blackthorn, filho de um guardião do santuário.',
    'Aos nove anos trocou o Rattata do irmão por um ovo com um marinheiro de Hoenn, no porto de Olivine. Do ovo saiu um Bagon.',
    'Os anciãos do clã não deixaram o Bagon entrar no Covil: dragão que não nasceu da água de lá, disseram, não é dragão.',
    'Ele saiu de Blackthorn aos treze com o Bagon no colo, fez o desafio de Hoenn e foi barrado no fim. O Bagon virou Salamence no dia da segunda recusa do clã.'
  ],
  porque:'O Torneio das Ilhas é o único grande que não tem cadeira do clã no júri. Aqui ninguém pergunta de onde veio o dragão.',
  gancho:'Dizem que o clã mandou alguém assistir o torneio. Ele finge que não procura na arquibancada.',
  time:[
    [130, ['Waterfall', 'Dragon Breath', 'Earthquake', 'Body Slam'], 'Adamant'],
    [230, ['Surf', 'Dragon Breath', 'Ice Beam', 'Agility'], 'Modest'],
    [142, ['Rock Slide', 'Earthquake', 'Ancient Power', 'Fly'], 'Jolly'],
    [330, ['Earthquake', 'Dragon Claw', 'Rock Slide', 'Fire Blast'], 'Jolly'],
    [149, ['Outrage', 'Fly', 'Thunder Wave', 'Fire Blast'], 'Adamant'],
    [373, ['Dragon Claw', 'Crunch', 'Fly', 'Flamethrower'], 'Naive', 'Dragon Scale']
  ],
  torneio:'"Ele não nasceu no Covil. Nasceu numa caixa de papelão no porto de Olivine. Vem."',
  vence:'"Não foi contra você. Foi a favor dele."',
  perde:'"Ele voou do mesmo jeito. Era isso que eu vim ver."'
},
{
  id:'gideon', nome:'Gideon', sobrenome:'Spruce', f:false, idade:71, nasceu:[30, 3],
  regiao:'Johto', de:'Olivine', classe:'Pescador', tipo:'Água',
  tracos:['paciente', 'brincalhão', 'teimoso'], meta:'campeao', forte:'sorte',
  gosta:{lugar:'agua', tipo:'Água', especie:'Lapras'},
  desgosta:{lugar:'cidade', tipo:'Elétrico', especie:'Qwilfish'},
  aparencia:'Velho, barba branca curta, chapéu de pescador desbotado e a vara de bambu que ele não larga nem pra apertar a mão.',
  voz:'Conta tudo como causo, no ritmo de quem espera a linha puxar. Chama todo mundo de moço e de moça.',
  jornada:[
    'Pesca no cais de Olivine há cinquenta e tantos anos.',
    'Veio ao Torneio das Ilhas pela primeira vez com dezenove anos e um Lapras novo, e perdeu a final pro Magnus Holm, da Ilha Sete.',
    'Voltou em todas as edições desde então: quarenta e duas. Nunca ganhou. O Lapras é o mesmo.'
  ],
  porque:'"Tem gente que vem pelo torneio. Eu venho pelo barco." É o primeiro ano sem a mulher dele acenando do cais de Olivine na saída.',
  gancho:'Guarda um mapa de pesca de Johto com marcas a lápis nos lugares onde, diz ele, o mar canta.',
  time:[
    [224, ['Surf', 'Ice Beam', 'Flamethrower', 'Sludge Bomb'], 'Modest'],
    [195, ['Earthquake', 'Surf', 'Ice Beam', 'Amnesia'], 'Relaxed'],
    [226, ['Surf', 'Wing Attack', 'Ice Beam', 'Confuse Ray'], 'Calm'],
    [171, ['Thunderbolt', 'Surf', 'Thunder Wave', 'Confuse Ray'], 'Modest'],
    [340, ['Earthquake', 'Waterfall', 'Amnesia', 'Ice Beam'], 'Adamant'],
    [131, ['Surf', 'Ice Beam', 'Body Slam', 'Thunderbolt'], 'Calm', 'Leftovers']
  ],
  torneio:'"Quarenta e duas vezes eu entrei nesta arena, moço. Em quarenta e uma eu saí com o barco cheio de história e sem troféu."',
  vence:'"Viu? O mar devolve. Demora, mas devolve."',
  perde:'"Quarenta e três. Número bonito. Ano que vem eu volto."'
},
{
  id:'etta', nome:'Etta', sobrenome:'Hemlock', f:true, idade:14, nasceu:[14, 6],
  regiao:'Johto', de:'Azalea', classe:'Artesã de Pokébolas', tipo:'Inseto',
  tracos:['orgulhosa', 'curiosa', 'determinada'], meta:'casa', forte:'intelecto',
  gosta:{lugar:'floresta', tipo:'Inseto', especie:'Heracross'},
  desgosta:{lugar:'vulcao', tipo:'Fogo', especie:'Slowpoke'},
  aparencia:'Cabelo ruivo enrolado, mochila maior que ela, cheia de Pokébolas de Apricorn penduradas por fora, cada uma de uma cor.',
  voz:'Rápida e técnica. Explica a costura de uma Pokébola sem ninguém pedir e corrige quem diz "Pokébola comum".',
  jornada:[
    'A família dela faz Pokébola de Apricorn em Azalea há quatro gerações, na rua de baixo da do mestre famoso. Todo mundo conhece a rua de cima. Ninguém conhece a de baixo.',
    'Fez o desafio de Johto só com Pokémon que ela mesma pegou com as bolas da família.',
    'Carrega oitenta e quatro Pokébolas feitas à mão. Sabe o dia em que fez cada uma.'
  ],
  porque:'Vender as bolas na feira do torneio (quem vem de Hoenn nunca viu uma Apricorn) e provar que inseto ganha torneio.',
  gancho:'Quer abrir uma banca da família em Lilycove, do outro lado do mar.',
  time:[
    [127, ['Swords Dance', 'Body Slam', 'Earthquake', 'Rock Slide'], 'Jolly'],
    [205, ['Earthquake', 'Explosion', 'Rapid Spin', 'Protect'], 'Relaxed'],
    [291, ['Slash', 'Fury Cutter', 'Swords Dance', 'Double-Edge'], 'Jolly'],
    [214, ['Megahorn', 'Earthquake', 'Body Slam', 'Swords Dance'], 'Adamant'],
    [348, ['Rock Slide', 'Earthquake', 'Fury Cutter', 'Swords Dance'], 'Adamant'],
    [212, ['Metal Claw', 'Fury Cutter', 'Swords Dance', 'Quick Attack'], 'Adamant', 'Metal Coat']
  ],
  torneio:'"Cada bola dessas eu fiz com a mão. Se eu perder, pelo menos você viu o acabamento."',
  vence:'"Inseto! Escreve aí: inseto!"',
  perde:'"Tá. Mas olha a costura da bola que você usou. Agora olha a minha."'
},
{
  id:'ziggy', nome:'Ziggy', sobrenome:'Bay', f:false, idade:28, nasceu:[1, 4],
  regiao:'Johto', de:'Goldenrod', classe:'Radialista', tipo:null,
  tracos:['alegre', 'competitivo', 'sonhador'], meta:'poder', forte:'carisma',
  gosta:{lugar:'cidade', tipo:'Normal', especie:'Miltank'},
  desgosta:{lugar:'caverna', tipo:'Fantasma', especie:'Misdreavus'},
  aparencia:'Topete azul que não se mexe com vento nenhum, jaqueta de couro sintético, o fio do microfone enrolado no braço.',
  voz:'Fala como quem está no ar: em vinheta, chamando todo mundo de ouvinte. Quando o microfone desliga, fica quieto de repente.',
  jornada:[
    'Apresenta "Ziggy na Madrugada" na rádio de Goldenrod há seis anos, o programa que todo caminhoneiro de Johto escuta da meia-noite às quatro.',
    'A rádio vai tirar o programa do ar daqui a três meses. Ninguém mais escuta rádio de madrugada, diz o diretor.'
  ],
  porque:'Narrar o torneio ao vivo, lutando nele, num transmissor de mão. Se o Ziggy da madrugada ganhar o Torneio das Ilhas, a rádio não tem coragem de tirar do ar.',
  gancho:'Promete uma entrevista com você "no programa", se o programa existir.',
  time:[
    [181, ['Thunderbolt', 'Fire Punch', 'Thunder Wave', 'Light Screen'], 'Modest'],
    [241, ['Body Slam', 'Earthquake', 'Rollout', 'Attract'], 'Careful'],
    [352, ['Shadow Ball', 'Thunderbolt', 'Body Slam', 'Ice Beam'], 'Brave'],
    [277, ['Double-Edge', 'Fly', 'Quick Attack', 'Steel Wing'], 'Jolly'],
    [335, ['Swords Dance', 'Slash', 'Shadow Ball', 'Rock Slide'], 'Adamant'],
    [295, ['Body Slam', 'Earthquake', 'Flamethrower', 'Ice Beam'], 'Lonely', 'Muscle Band']
  ],
  torneio:'"Boa tarde, ouvinte! Agora é comigo e com {o|a} visitante de Kanto, ao vivo das ilhas!"',
  vence:'"E É DO ZIGGY! Repete pro pessoal de Ecruteak que não acreditou!"',
  perde:'"…e o Ziggy cai, ouvinte. Mas cai bonito. Fica com a gente que depois do intervalo tem mais."'
},
{
  id:'saskia', nome:'Saskia', sobrenome:'Rush', f:true, idade:22, nasceu:[8, 8],
  regiao:'Johto', de:'Cianwood', classe:'Lutadora', tipo:'Lutador',
  tracos:['corajosa', 'alegre', 'impulsiva'], meta:'campeao', forte:'forca',
  gosta:{lugar:'agua', tipo:'Lutador', especie:'Hariyama'},
  desgosta:{lugar:'cidade', tipo:'Psíquico', especie:'Alakazam'},
  aparencia:'Cabelo castanho num rabo alto, quimono azul de treino com a faixa amarrada duas vezes, os braços cheios de arranhão de rocha.',
  voz:'Ri alto, fala com o corpo inteiro e cumprimenta apertando o braço, não a mão.',
  jornada:[
    'Cresceu no dojô de Cianwood. Nada até as Ilhas do Redemoinho toda manhã, ida e volta antes do café.',
    'Passou um ano em Hoenn treinando com os lutadores de Dewford e voltou com um Makuhita, hoje Hariyama: o único Pokémon que a derrubou na areia.'
  ],
  porque:'Lutar de novo com quem vem de Hoenn. E porque a mãe dela disse que ela nunca termina nada. "Eu vim terminar um torneio."',
  gancho:'Quer atravessar o mar entre Cianwood e as Ilhas Sevii nadando, um dia. Já calculou as paradas.',
  time:[
    [237, ['Rolling Kick', 'Dig', 'Quick Attack', 'Detect'], 'Impish'],
    [62, ['Surf', 'Submission', 'Ice Punch', 'Hypnosis'], 'Adamant'],
    [308, ['High Jump Kick', 'Fire Punch', 'Ice Punch', 'Thunder Punch'], 'Jolly'],
    [286, ['Dynamic Punch', 'Giga Drain', 'Stun Spore', 'Swords Dance'], 'Adamant'],
    [68, ['Cross Chop', 'Rock Slide', 'Earthquake', 'Fire Punch'], 'Adamant'],
    [297, ['Seismic Toss', 'Earthquake', 'Rock Slide', 'Fire Punch'], 'Adamant', 'Focus Band']
  ],
  torneio:'"Aperta aqui. Não, de verdade. Eu quero saber a força da mão de quem eu vou enfrentar."',
  vence:'"HA! Isso! Agora a gente vai nadar, os dois. É assim que se agradece."',
  perde:'"Ai. Essa entrou. Entrou bonito. Me mostra de novo como foi?"'
},
{
  id:'florian', nome:'Florian', sobrenome:'Ashgrove', f:false, idade:34, nasceu:[22, 9],
  regiao:'Johto', de:'Rota 34', classe:'Criador Pokémon', tipo:null,
  tracos:['organizado', 'observador', 'cauteloso'], meta:'vinculo', forte:'intelecto',
  gosta:{lugar:'campo', tipo:'Normal', especie:'Eevee'},
  desgosta:{lugar:'vulcao', tipo:'Fantasma', especie:'Ditto'},
  aparencia:'Macacão verde de jardineiro, luva de couro sintético no bolso de trás e um caderno de capa mole sempre aberto.',
  voz:'Fala em porcentagem e depois pede desculpa por falar em porcentagem.',
  jornada:[
    'Neto do casal que cuida da creche da Rota 34. Cresceu entre ovo e cesto de palha.',
    'Cria Eevee há vinte anos e anota tudo em caderno: a temperatura do ovo, o dia, a hora em que rachou.',
    'Os seis do time dele são da mesma linhagem, filhos e netos de uma Eevee só, que mora na creche até hoje.'
  ],
  porque:'A creche faz cinquenta anos. Ele trouxe seis ovos da linhagem pra dar de presente a quem chegar na final, que é a tradição dele em todo torneio.',
  gancho:'Quer ver um Eevee da linhagem dele crescer em Hoenn, com alguém de lá.',
  time:[
    [143, ['Body Slam', 'Earthquake', 'Shadow Ball', 'Curse'], 'Adamant'],
    [134, ['Surf', 'Ice Beam', 'Acid Armor', 'Body Slam'], 'Bold'],
    [135, ['Thunderbolt', 'Thunder Wave', 'Pin Missile', 'Shadow Ball'], 'Timid'],
    [136, ['Flamethrower', 'Body Slam', 'Shadow Ball', 'Quick Attack'], 'Adamant'],
    [197, ['Faint Attack', 'Confuse Ray', 'Toxic', 'Protect'], 'Careful'],
    [196, ['Psychic', 'Shadow Ball', 'Swift', 'Reflect'], 'Timid', 'Wise Glasses']
  ],
  torneio:'"Os seis vieram da mesma avó. Cada um escolheu um caminho. Igual a gente."',
  vence:'"Noventa e um por cento, eu tinha calculado. Desculpa. Eu sempre calculo."',
  perde:'"Anotado. Não é derrota, é dado."'
},
{
  id:'zev', nome:'Zev', sobrenome:'Fernley', f:false, idade:31, nasceu:[13, 12],
  regiao:'Johto', de:'Mahogany', classe:'Pescador do Lago', tipo:'Sombrio',
  tracos:['desconfiado', 'solitário', 'protetor'], meta:'heroi', forte:'percepcao',
  gosta:{lugar:'agua', tipo:'Sombrio', especie:'Houndoom'},
  desgosta:{lugar:'cidade', tipo:'Psíquico', especie:'Raticate'},
  aparencia:'Cabelo preto comprido, barba de semanas, casaco escuro grande demais e um anzol de metal pendurado no pescoço.',
  voz:'Fala pouco, olha nos olhos. Nunca diz "nós" quando fala da Equipe Rocket: diz "eles", mesmo quando era "nós".',
  jornada:[
    'Há três anos era recruta da Equipe Rocket no esconderijo de Mahogany, o que ficava debaixo da loja de lembrancinhas.',
    'Quando o esconderijo caiu, ele não fugiu: ficou pra abrir as gaiolas. Pegou dois anos.',
    'Saiu e vive de pesca no Lago da Fúria. Os Pokémon do time são os mesmos de antes, menos um.'
  ],
  porque:'Torneio é a única coisa em que ninguém pergunta o que ele fez. Ou era.',
  gancho:'Tem um nome que ele não diz: o do chefe de turno de Mahogany, que fugiu antes da polícia chegar.',
  time:[
    [110, ['Sludge Bomb', 'Flamethrower', 'Thunderbolt', 'Shadow Ball'], 'Bold'],
    [169, ['Wing Attack', 'Sludge Bomb', 'Confuse Ray', 'Bite'], 'Jolly'],
    [229, ['Flamethrower', 'Crunch', 'Shadow Ball', 'Sludge Bomb'], 'Timid'],
    [262, ['Crunch', 'Double-Edge', 'Shadow Ball', 'Iron Tail'], 'Adamant'],
    [332, ['Giga Drain', 'Faint Attack', 'Thunder Punch', 'Cotton Spore'], 'Quiet'],
    [248, ['Crunch', 'Rock Slide', 'Earthquake', 'Thunderbolt'], 'Adamant', 'Leftovers']
  ],
  torneio:'"Pode olhar. Todo mundo olha. Eu prefiro que olhe de frente."',
  vence:'"Não foi sorte. Eu treinei mais que todo mundo aqui, porque eu comecei atrasado."',
  perde:'"Foi limpo. Pra mim isso é muito."'
},

/* ─────────────────────────── HOENN ─────────────────────────── */
{
  id:'skye', nome:'Skye', sobrenome:'Fernwood', f:true, idade:15, nasceu:[20, 5],
  regiao:'Hoenn', de:'Fortree', classe:'Escaladora', tipo:'Voador',
  tracos:['sonhadora', 'distraída', 'alegre'], meta:'explorar', forte:'sorte',
  gosta:{lugar:'floresta', tipo:'Voador', especie:'Altaria'},
  desgosta:{lugar:'agua', tipo:'Elétrico', especie:'Sharpedo'},
  aparencia:'Boné verde virado pra trás, bermuda de escalada com o joelho ralado e uma pena de Swablu presa atrás da orelha.',
  voz:'Fala olhando pro céu e conta o vento. Se distrai no meio da frase quando passa alguma coisa voando.',
  jornada:[
    'Cresceu nas casas de árvore de Fortree, onde a rua é ponte de corda.',
    'Nunca tinha pisado num barco antes desta viagem. Enjoou as trinta horas de Slateport até aqui.',
    'O Altaria dela era um Swablu que ficou pra trás numa tempestade, na migração de outono, e ela cuidou dele no telhado de casa.'
  ],
  porque:'A migração. Os Swablu de Hoenn atravessam o mar até as Ilhas Sevii no outono, e ela quer ver eles chegarem. O torneio é o que dá pra fazer enquanto eles descansam.',
  gancho:'Jura que um dia vai seguir a migração inteira, de Fortree até onde ela acaba.',
  time:[
    [85, ['Drill Peck', 'Tri Attack', 'Agility', 'Body Slam'], 'Jolly'],
    [227, ['Steel Wing', 'Drill Peck', 'Agility', 'Swift'], 'Impish'],
    [178, ['Psychic', 'Night Shade', 'Confuse Ray', 'Steel Wing'], 'Timid'],
    [279, ['Surf', 'Ice Beam', 'Wing Attack', 'Steel Wing'], 'Modest'],
    [357, ['Razor Leaf', 'Fly', 'Body Slam', 'Synthesis'], 'Careful'],
    [334, ['Dragon Claw', 'Fly', 'Flamethrower', 'Ice Beam'], 'Jolly', 'Leftovers']
  ],
  torneio:'"Vento de sudoeste hoje. Bom pra voar. Ruim pra você."',
  vence:'"Eles chegam na quinta. Você vem ver?"',
  perde:'"Tudo bem. Daqui eu vejo o céu inteiro do mesmo jeito."'
},
{
  id:'calla', nome:'Calla', sobrenome:'Sumac', f:true, idade:24, nasceu:[5, 1],
  regiao:'Hoenn', de:'Lavaridge', classe:'Dona de Termas', tipo:'Fogo',
  tracos:['orgulhosa', 'impulsiva', 'prática'], meta:'casa', forte:'carisma',
  gosta:{lugar:'vulcao', tipo:'Fogo', especie:'Torkoal'},
  desgosta:{lugar:'agua', tipo:'Água', especie:'Wailord'},
  aparencia:'Cabelo preto num coque firme, quimono de festa vermelho e preto, o leque fechado na mão como quem segura uma régua.',
  voz:'Afiada e educada ao mesmo tempo. Negocia tudo, até o preço do chá, e sorri do jeito que corta.',
  jornada:[
    'Herdou da avó a pousada de termas mais velha de Lavaridge.',
    'Desde que o vulcão de lá entrou em repouso os turistas sumiram, e as termas novas da beira-mar levaram o resto.',
    'Ela tem três funcionários, um telhado que pinga e a foto da avó na parede da recepção.'
  ],
  porque:'O prêmio paga a reforma do telhado. E ela veio olhar as termas da Estrada da Brasa, na Ilha Um, "a concorrência", de perto.',
  gancho:'Quer comprar uma fonte termal fora de Hoenn. Já perguntou o preço de três.',
  time:[
    [219, ['Flamethrower', 'Rock Slide', 'Earthquake', 'Amnesia'], 'Modest'],
    [324, ['Flamethrower', 'Body Slam', 'Rock Slide', 'Curse'], 'Bold'],
    [38, ['Flamethrower', 'Confuse Ray', 'Quick Attack', 'Iron Tail'], 'Timid'],
    [323, ['Earthquake', 'Fire Blast', 'Rock Slide', 'Amnesia'], 'Quiet'],
    [59, ['Flamethrower', 'Body Slam', 'Iron Tail', 'Dig'], 'Adamant'],
    [257, ['Fire Blast', 'Earthquake', 'Rock Slide', 'Double Kick'], 'Naive', 'Muscle Band']
  ],
  torneio:'"Eu cobro entrada de quem vem ver o meu Blaziken. Hoje é cortesia."',
  vence:'"Isso vai pra parede da pousada. Do lado da foto da minha avó."',
  perde:'"Tudo bem. Passa lá em casa um dia. Banho de graça pra quem me ganhou."'
},
{
  id:'imogen', nome:'Imogen', sobrenome:'Vetch', f:true, idade:31, nasceu:[11, 8],
  regiao:'Hoenn', de:'Mossdeep', classe:'Astrônoma', tipo:'Psíquico',
  tracos:['calma', 'observadora', 'curiosa'], meta:'pokedex', forte:'intelecto',
  gosta:{lugar:'montanha', tipo:'Psíquico', especie:'Lunatone'},
  desgosta:{lugar:'cidade', tipo:'Sombrio', especie:'Murkrow'},
  aparencia:'Jaleco branco por cima de roupa de campo, cabelo preto curto, a pele escura cheia de sardas de sol de observatório.',
  voz:'Precisa e seca. Ri sem som, mede distância em coisa que ninguém mede e responde pergunta com outra.',
  jornada:[
    'Calcula órbita de satélite no centro espacial de Mossdeep.',
    'O Lunatone e o Solrock dela vieram de um meteorito, no fundo das Cataratas do Meteoro. Ela estava lá no dia em que acharam.'
  ],
  porque:'Uma chuva de meteoros que, este ano, só se vê inteira do sul do arquipélago. O torneio cai na mesma semana e paga a passagem. "É a desculpa que eu dei pro meu chefe."',
  gancho:'Quer subir uma montanha de Johto que, diz ela, tem o céu mais limpo do mundo.',
  time:[
    [337, ['Psychic', 'Ice Beam', 'Hypnosis', 'Rock Slide'], 'Modest'],
    [338, ['Psychic', 'Flamethrower', 'Rock Slide', 'Earthquake'], 'Adamant'],
    [344, ['Earthquake', 'Psychic', 'Ice Beam', 'Shadow Ball'], 'Sassy'],
    [326, ['Psychic', 'Shadow Ball', 'Ice Punch', 'Confuse Ray'], 'Calm'],
    [65, ['Psychic', 'Recover', 'Shadow Ball', 'Thunder Wave'], 'Timid'],
    [376, ['Psychic', 'Earthquake', 'Metal Claw', 'Thunder Punch'], 'Adamant', 'Metal Coat']
  ],
  torneio:'"Faltam quatro noites pra chuva. Eu não pretendo perder nenhuma delas."',
  vence:'"Previsível. Bonito do jeito que órbita é bonita."',
  perde:'"Interessante. Eu errei a conta em algum lugar. Vou achar onde."'
},
{
  id:'brody', nome:'Brody', sobrenome:'Teak', f:false, idade:38, nasceu:[27, 7],
  regiao:'Hoenn', de:'Slateport', classe:'Estivador', tipo:'Água',
  tracos:['protetor', 'impulsivo', 'leal'], meta:'heroi', forte:'forca',
  gosta:{lugar:'agua', tipo:'Água', especie:'Wailord'},
  desgosta:{lugar:'cidade', tipo:'Elétrico', especie:'Pelipper'},
  aparencia:'Ombro largo, braço tatuado com âncora, camiseta laranja do sindicato do cais de Slateport e o boné azul de estiva.',
  voz:'Grita ordem como quem fala normal, chama todo mundo de chefia e chora fácil, sem vergonha nenhuma.',
  jornada:[
    'Estivador do cais de Slateport há vinte anos e delegado do sindicato.',
    'Trouxe os doze homens da turma dele numa vaquinha de seis meses. É a primeira viagem da turma inteira na vida.'
  ],
  porque:'A turma. Ganhar importa menos do que voltar com todo mundo, e com os Pokémon de todo mundo.',
  gancho:'Jurou que o sindicato de Slateport vai visitar o cais de Vermilion. Já escreveu a carta.',
  time:[
    [99, ['Crabhammer', 'Swords Dance', 'Body Slam', 'Metal Claw'], 'Adamant'],
    [73, ['Surf', 'Sludge Bomb', 'Ice Beam', 'Barrier'], 'Calm'],
    [369, ['Rock Slide', 'Earthquake', 'Waterfall', 'Rest'], 'Impish'],
    [342, ['Crabhammer', 'Swords Dance', 'Body Slam', 'Ice Beam'], 'Adamant'],
    [321, ['Surf', 'Body Slam', 'Earthquake', 'Rest'], 'Modest'],
    [260, ['Earthquake', 'Surf', 'Ice Beam', 'Rock Slide'], 'Adamant', 'Leftovers']
  ],
  torneio:'"A turma tá na arquibancada, chefia. Doze homens que pagaram a passagem em seis vezes. Eu não vou fazer eles passarem vergonha."',
  vence:'"VIU, TURMA? VIU?"',
  perde:'"Tudo bem, tudo bem. Foi justo. Aperta aqui."'
},
{
  id:'esme', nome:'Esme', sobrenome:'Wisteria', f:true, idade:20, nasceu:[3, 3],
  regiao:'Hoenn', de:'Lilycove', classe:'Coordenadora', tipo:null,
  tracos:['competitiva', 'orgulhosa', 'gentil'], meta:'campeao', forte:'carisma',
  gosta:{lugar:'cidade', tipo:'Água', especie:'Milotic'},
  desgosta:{lugar:'caverna', tipo:'Pedra', especie:'Geodude'},
  aparencia:'Vestido de palco lilás com babado, o cabelo preso com um laço do mesmo tom e o sorriso de quem já foi fotografada demais.',
  voz:'Gentil na frente, fria por baixo. Termina frase com sorriso de palco, mesmo quando a frase é ruim.',
  jornada:[
    'Três vezes campeã do Concurso Mestre de Lilycove, na categoria Beleza.',
    'Uma revista de Hoenn escreveu que coordenadora "não sabe batalhar de verdade". Ela recortou a matéria e guarda na carteira.'
  ],
  porque:'Ganhar um torneio de batalha de verdade, longe de palco, de jurado e de nota.',
  gancho:'Se ganhar, vai mandar o troféu pra redação da revista, embrulhado na matéria.',
  time:[
    [284, ['Ice Beam', 'Giga Drain', 'Shadow Ball', 'Stun Spore'], 'Modest'],
    [315, ['Giga Drain', 'Sludge Bomb', 'Stun Spore', 'Synthesis'], 'Modest'],
    [359, ['Slash', 'Swords Dance', 'Faint Attack', 'Iron Tail'], 'Adamant'],
    [272, ['Surf', 'Giga Drain', 'Ice Beam', 'Thunder Punch'], 'Modest'],
    [282, ['Psychic', 'Thunderbolt', 'Shadow Ball', 'Hypnosis'], 'Modest'],
    [350, ['Surf', 'Ice Beam', 'Recover', 'Attract'], 'Bold', 'Leftovers']
  ],
  torneio:'"Não é concurso, eu sei. Ninguém vai dar nota pra beleza. Hoje eu dou nota pra mim mesma."',
  vence:'"Recorta essa, revista."',
  perde:'"Bom. Foi uma batalha de verdade. Era o que eu queria."'
},
{
  id:'oona', nome:'Oona', sobrenome:'Yew', f:true, idade:16, nasceu:[31, 10],
  regiao:'Hoenn', de:'Monte Pyre', classe:'Zeladora do Monte Pyre', tipo:'Fantasma',
  tracos:['calma', 'solitária', 'observadora'], meta:'vinculo', forte:'percepcao',
  gosta:{lugar:'cemiterio', tipo:'Fantasma', especie:'Dusclops'},
  desgosta:{lugar:'cidade', tipo:'Normal', especie:'Exploud'},
  aparencia:'Cabelo branco desgrenhado até a cintura, vestido roxo comprido, os olhos de quem dormiu pouco e não se importa.',
  voz:'Baixa e pausada. Olha por cima do seu ombro, como se tivesse mais alguém ali.',
  jornada:[
    'Neta dos zeladores do Monte Pyre, o morro de Hoenn onde se enterram os Pokémon.',
    'Cresceu varrendo degrau e ouvindo quem sobe pra conversar com túmulo.',
    'No cume tem um costume: o que alguém deixa num túmulo volta pra casa dezenove anos depois. Ela é quem leva.'
  ],
  porque:'Uma Pokébola velha deixada num túmulo do cume há dezenove anos, com as iniciais M. H. e a palavra "Sete" gravadas na tampa. O torneio paga a passagem.',
  gancho:'Leva no bolso uma lista de outras coisas que voltam pra casa este ano. Uma delas é em Johto.',
  time:[
    [358, ['Psychic', 'Shadow Ball', 'Light Screen', 'Confuse Ray'], 'Calm'],
    [302, ['Night Shade', 'Faint Attack', 'Shadow Ball', 'Confuse Ray'], 'Careful'],
    [200, ['Shadow Ball', 'Thunderbolt', 'Psychic', 'Confuse Ray'], 'Timid'],
    [354, ['Shadow Ball', 'Thunderbolt', 'Faint Attack', 'Curse'], 'Lonely'],
    [94, ['Shadow Ball', 'Thunderbolt', 'Hypnosis', 'Dream Eater'], 'Timid'],
    [356, ['Night Shade', 'Shadow Ball', 'Earthquake', 'Curse'], 'Impish', 'Leftovers']
  ],
  torneio:d=>(d && d.cemiterio && d.cemiterio.length)
    ? '"Você trouxe gente. Não aqui. Atrás. Os que ficaram no caminho."'
    : '"Você veio sozinh{o|a}. Isso é raro."',
  vence:'"Eles gostaram de você. Isso não muda o resultado."',
  perde:'"Eu vou contar pra eles que foi bonito."'
},
{
  id:'rhys', nome:'Rhys', sobrenome:'Ironwood', f:false, idade:26, nasceu:[19, 2],
  regiao:'Hoenn', de:'Sootopolis', classe:'Ás de Hoenn', tipo:null,
  tracos:['competitivo', 'orgulhoso', 'calmo'], meta:'campeao', forte:'resistencia',
  gosta:{lugar:'montanha', tipo:'Metálico', especie:'Aggron'},
  desgosta:{lugar:'floresta', tipo:'Lutador', especie:'Hariyama'},
  aparencia:'Terno escuro bem cortado sem gravata, cabelo preto penteado pra trás e luva de couro sintético numa mão só.',
  voz:'Educado e frio. Diz "por favor" antes de ameaçar e agradece depois de ganhar.',
  jornada:[
    'Chegou duas vezes à Elite de Hoenn e caiu nas duas no mesmo lugar: a terceira porta.',
    'Treinou o Aggron desde Aron, numa caverna de granito de Dewford.',
    'É o nome mais conhecido do torneio, o favorito das casas de aposta de Slateport.'
  ],
  porque:'Ouviu dizer que {o Campeão|a Campeã} de Kanto vinha. "Eu não vim pelo troféu. Eu vim pela luta que você não aceitaria em Kanto."',
  gancho:'Vai tentar a Elite de Hoenn uma terceira vez. Diz que quer você na arquibancada.',
  time:[
    [275, ['Giga Drain', 'Faint Attack', 'Swords Dance', 'Body Slam'], 'Adamant'],
    [346, ['Giga Drain', 'Rock Slide', 'Earthquake', 'Sludge Bomb'], 'Calm'],
    [310, ['Thunderbolt', 'Thunder Wave', 'Iron Tail', 'Body Slam'], 'Timid'],
    [365, ['Blizzard', 'Surf', 'Earthquake', 'Rock Slide'], 'Modest'],
    [254, ['Giga Drain', 'Dragon Claw', 'Earthquake', 'Thunder Punch'], 'Naive'],
    [306, ['Iron Tail', 'Earthquake', 'Rock Slide', 'Thunder Punch'], 'Adamant', 'Leftovers']
  ],
  torneio:'"Finalmente. Eu atravessei um mar inteiro por esta luta, e eu não costumo atravessar nem a rua."',
  vence:'"Era isso que eu queria saber. Obrigado."',
  perde:'"Terceira porta de novo. Engraçado como a vida rima."'
},

/* ─────────────────────────── AS ILHAS ─────────────────────────── */
{
  id:'noa', nome:'Noa', sobrenome:'Kelp', f:true, idade:16, nasceu:[9, 9],
  regiao:'Ilhas Sevii', de:'Ilha Um', classe:'Moça do Cais', tipo:null, rival:true,
  tracos:['desconfiada', 'ousada', 'leal'], meta:'casa', forte:'sorte',
  gosta:{lugar:'agua', tipo:'Sombrio', especie:'Sharpedo'},
  desgosta:{lugar:'cidade', tipo:'Psíquico', especie:'Persian'},
  aparencia:'Cabelo verde-mar curto e arrepiado de sal, jaqueta preta grande demais, tênis sem cadarço e um Murkrow no ombro que encara todo mundo.',
  voz:'Fala rápido e de lado, nunca de frente. Quando mente, olha nos olhos; quando fala a verdade, olha pro chão.',
  jornada:[
    'Filha de pescador da Ilha Um.',
    'Quando a fábrica de conserva fechou, o pai pegou óleo fiado com os Faróis, e o barco foi junto com a dívida.',
    'Desde então ela trabalha pra Maré, a turma do cais, que trabalha pros Faróis.',
    'O Sharpedo dela, o Dente, o pai pescou ainda Carvanha, na rede, no último dia em que o barco saiu.'
  ],
  porque:'O prêmio do torneio paga a dívida e devolve o barco. Ela não pode se inscrever enquanto trabalha pra gangue.',
  gancho:'Nunca saiu das ilhas. Quer ver Vermilion de perto, "só pra ver se é feia como dizem".',
  time:[
    [198, ['Drill Peck', 'Faint Attack', 'Pursuit', 'Thief'], 'Naughty'],
    [215, ['Faint Attack', 'Slash', 'Icy Wind', 'Quick Attack'], 'Jolly'],
    [211, ['Sludge Bomb', 'Surf', 'Pin Missile', 'Take Down'], 'Adamant'],
    [222, ['Surf', 'Ancient Power', 'Earthquake', 'Spike Cannon'], 'Impish'],
    [264, ['Slash', 'Body Slam', 'Shadow Ball', 'Iron Tail'], 'Jolly'],
    [319, ['Crunch', 'Surf', 'Earthquake', 'Waterfall'], 'Adamant', 'Muscle Band']
  ],
  apelidos:{319:'Dente'},
  torneio:'"Eu não devia estar aqui. É por isso que eu vou ganhar."',
  vence:'"…eu ganhei. Eu ganhei de você. Alguém viu isso?"',
  perde:'"De novo. Tudo bem. Eu volto. Eu sempre volto."'
},
{
  id:'magnus', nome:'Magnus', sobrenome:'Holm', f:false, idade:74, nasceu:[17, 4],
  regiao:'Ilhas Sevii', de:'Ilha Sete', classe:'Bicampeão das Ilhas', tipo:null, completa:true,
  tracos:['calmo', 'orgulhoso', 'paciente'], meta:'casa', forte:'resistencia',
  gosta:{lugar:'montanha', tipo:'Normal', especie:'Kangaskhan'},
  desgosta:{lugar:'cidade', tipo:'Fantasma', especie:'Banette'},
  aparencia:'Velho de terno cinza e chapéu, bengala de madeira escura com castão de latão, o bigode branco aparado à régua.',
  voz:'Pausada, de quem já contou a mesma história muitas vezes e ainda gosta de contar.',
  jornada:[
    'Ganhou o Torneio das Ilhas duas vezes, há mais de cinquenta anos. Numa das finais, ganhou de um pescador de Olivine chamado Gideon.',
    'Hoje organiza o torneio na arena da Ilha Sete, que o pai dele construiu.',
    'Só entra na chave quando falta gente pra completar os dezesseis, e diz que é por obrigação.'
  ],
  porque:'É a casa dele. O torneio é a única coisa das ilhas que ainda traz gente de fora.',
  gancho:'Nunca foi a Hoenn. Diz que é tarde, e diz de um jeito que pede pra alguém discordar.',
  time:[
    [127, ['Swords Dance', 'Body Slam', 'Submission', 'Rock Slide'], 'Adamant'],
    [121, ['Surf', 'Psychic', 'Thunderbolt', 'Recover'], 'Timid'],
    [208, ['Iron Tail', 'Earthquake', 'Rock Slide', 'Crunch'], 'Impish'],
    [112, ['Earthquake', 'Rock Slide', 'Body Slam', 'Megahorn'], 'Adamant'],
    [115, ['Body Slam', 'Earthquake', 'Rock Slide', 'Dizzy Punch'], 'Adamant'],
    [143, ['Body Slam', 'Earthquake', 'Curse', 'Shadow Ball'], 'Careful', 'Leftovers']
  ],
  torneio:'"Faltava um pra fechar os dezesseis. Faltar um, na minha idade, é a melhor notícia do ano."',
  vence:'"Ainda tem pedra nesta bengala. Quem diria."',
  perde:'"Bem jogado. Na minha época ninguém jogava assim. Na minha época eu era o único."'
}
];

/* As gangues e quem mais luta nas ilhas fora do torneio: time de
   linhas de Kanto e Johto (nada de Hoenn com quem mora aqui). */
const LUTAS_DE_SEVII = {
  jory:   {nome:'Jory', f:false, arq:'sevii_jory', times:[42, 57, 210, 99], ajuste:-3},
  kaspar: {nome:'Kaspar', f:false, arq:'sevii_kaspar', times:[24, 89, 126, 217], ajuste:-1},
  dekker: {nome:'Dekker', f:false, arq:'sevii_dekker', times:[107, 76, 68], ajuste:0},
  farol:  {nome:'um dos Faróis', f:false, arq:'sevii_farol', times:[110, 78, 89], ajuste:-5},
  mare:   {nome:'um garoto da Maré', f:false, arq:'sevii_mare', times:[20, 22, 99], ajuste:-7}
};

/* rosto e nome: cada ficha tem o arquivo dela, e o nome entra na lista
   de nomes da história (o sorteio não dá "Soren" pra um desconhecido) */
ELENCO_SEVII.forEach(f => {
  f.arq = f.arq || 'sevii_' + f.id;
  if (typeof NOMES_DA_HISTORIA !== 'undefined') NOMES_DA_HISTORIA.add(f.nome);
  if (typeof RETRATO_POR_NOME !== 'undefined' && !RETRATO_POR_NOME[f.nome]) RETRATO_POR_NOME[f.nome] = 'trainers/' + f.arq;
});
Object.values(LUTAS_DE_SEVII).forEach(l => {
  if (/^[A-Z]/.test(l.nome) && typeof NOMES_DA_HISTORIA !== 'undefined') NOMES_DA_HISTORIA.add(l.nome);
  if (typeof RETRATO_POR_NOME !== 'undefined' && !RETRATO_POR_NOME[l.nome]) RETRATO_POR_NOME[l.nome] = 'trainers/' + l.arq;
});

function fichaSevii(id){ return ELENCO_SEVII.find(f => f.id === id) || null; }

/* O time da ficha no nível pedido: do mais fraco ao ás, o nível sobe
   um a cada dois até o ás, que fica no nível pedido. `sem` tira quem
   não está com a pessoa (o Pokémon roubado). Nada de brilhante: o
   arquivo só tem a arte comum das espécies de Hoenn. */
function timeDaFicha(f, nivel, tam, sem){
  const lista = f.time.filter(([dex]) => !(sem || []).includes(dex));
  const usar = lista.slice(Math.max(0, lista.length - (tam || 6)));
  return usar.map(([dex, golpes, natureza, item], i) => {
    const nv = Math.max(5, Math.min(100, Math.round(nivel - (usar.length - 1 - i) * 0.6)));
    const p = criarPokemon(dex, nv, {
      natureza, shiny:false, moral:90,
      golpes: golpes.filter(g => GOLPES[g]).map(nome => ({nome, pp:GOLPES[nome].pp, ppMax:GOLPES[nome].pp})),
      apelido: (f.apelidos || {})[dex] || null,
      segurando: item || null
    });
    p.nomeAnunciado = true;
    return p;
  });
}
