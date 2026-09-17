/* ============================================================
   POKÉDEX — 1ª Geração completa (151) + Lendários de Kanto
   [dex, nome, tipos, hp, atk, def, spa, spd, spe, evoluiPara, nivelEvo]
   nivelEvo: 0 = pedra/troca (evolui por evento narrativo)
   ============================================================ */
const DEX_RAW = [
[1,'Bulbasaur',['Grama','Venenoso'],45,49,49,65,65,45,2,16],
[2,'Ivysaur',['Grama','Venenoso'],60,62,63,80,80,60,3,32],
[3,'Venusaur',['Grama','Venenoso'],80,82,83,100,100,80,0,0],
[4,'Charmander',['Fogo'],39,52,43,60,50,65,5,16],
[5,'Charmeleon',['Fogo'],58,64,58,80,65,80,6,36],
[6,'Charizard',['Fogo','Voador'],78,84,78,109,85,100,0,0],
[7,'Squirtle',['Água'],44,48,65,50,64,43,8,16],
[8,'Wartortle',['Água'],59,63,80,65,80,58,9,36],
[9,'Blastoise',['Água'],79,83,100,85,105,78,0,0],
[10,'Caterpie',['Inseto'],45,30,35,20,20,45,11,7],
[11,'Metapod',['Inseto'],50,20,55,25,25,30,12,10],
[12,'Butterfree',['Inseto','Voador'],60,45,50,90,80,70,0,0],
[13,'Weedle',['Inseto','Venenoso'],40,35,30,20,20,50,14,7],
[14,'Kakuna',['Inseto','Venenoso'],45,25,50,25,25,35,15,10],
[15,'Beedrill',['Inseto','Venenoso'],65,90,40,45,80,75,0,0],
[16,'Pidgey',['Normal','Voador'],40,45,40,35,35,56,17,18],
[17,'Pidgeotto',['Normal','Voador'],63,60,55,50,50,71,18,36],
[18,'Pidgeot',['Normal','Voador'],83,80,75,70,70,101,0,0],
[19,'Rattata',['Normal'],30,56,35,25,35,72,20,20],
[20,'Raticate',['Normal'],55,81,60,50,70,97,0,0],
[21,'Spearow',['Normal','Voador'],40,60,30,31,31,70,22,20],
[22,'Fearow',['Normal','Voador'],65,90,65,61,61,100,0,0],
[23,'Ekans',['Venenoso'],35,60,44,40,54,55,24,22],
[24,'Arbok',['Venenoso'],60,95,69,65,79,80,0,0],
[25,'Pikachu',['Elétrico'],35,55,40,50,50,90,26,0],
[26,'Raichu',['Elétrico'],60,90,55,90,80,110,0,0],
[27,'Sandshrew',['Terrestre'],50,75,85,20,30,40,28,22],
[28,'Sandslash',['Terrestre'],75,100,110,45,55,65,0,0],
[29,'Nidoran-F',['Venenoso'],55,47,52,40,40,41,30,16],
[30,'Nidorina',['Venenoso'],70,62,67,55,55,56,31,0],
[31,'Nidoqueen',['Venenoso','Terrestre'],90,92,87,75,85,76,0,0],
[32,'Nidoran-M',['Venenoso'],46,57,40,40,40,50,33,16],
[33,'Nidorino',['Venenoso'],61,72,57,55,55,65,34,0],
[34,'Nidoking',['Venenoso','Terrestre'],81,102,77,85,75,85,0,0],
[35,'Clefairy',['Normal'],70,45,48,60,65,35,36,0],
[36,'Clefable',['Normal'],95,70,73,95,90,60,0,0],
[37,'Vulpix',['Fogo'],38,41,40,50,65,65,38,0],
[38,'Ninetales',['Fogo'],73,76,75,81,100,100,0,0],
[39,'Jigglypuff',['Normal'],115,45,20,45,25,20,40,0],
[40,'Wigglytuff',['Normal'],140,70,45,85,50,45,0,0],
[41,'Zubat',['Venenoso','Voador'],40,45,35,30,40,55,42,22],
[42,'Golbat',['Venenoso','Voador'],75,80,70,65,75,90,0,0],
[43,'Oddish',['Grama','Venenoso'],45,50,55,75,65,30,44,21],
[44,'Gloom',['Grama','Venenoso'],60,65,70,85,75,40,45,0],
[45,'Vileplume',['Grama','Venenoso'],75,80,85,110,90,50,0,0],
[46,'Paras',['Inseto','Grama'],35,70,55,45,55,25,47,24],
[47,'Parasect',['Inseto','Grama'],60,95,80,60,80,30,0,0],
[48,'Venonat',['Inseto','Venenoso'],60,55,50,40,55,45,49,31],
[49,'Venomoth',['Inseto','Venenoso'],70,65,60,90,75,90,0,0],
[50,'Diglett',['Terrestre'],10,55,25,35,45,95,51,26],
[51,'Dugtrio',['Terrestre'],35,100,50,50,70,120,0,0],
[52,'Meowth',['Normal'],40,45,35,40,40,90,53,28],
[53,'Persian',['Normal'],65,70,60,65,65,115,0,0],
[54,'Psyduck',['Água'],50,52,48,65,50,55,55,33],
[55,'Golduck',['Água'],80,82,78,95,80,85,0,0],
[56,'Mankey',['Lutador'],40,80,35,35,45,70,57,28],
[57,'Primeape',['Lutador'],65,105,60,60,70,95,0,0],
[58,'Growlithe',['Fogo'],55,70,45,70,50,60,59,0],
[59,'Arcanine',['Fogo'],90,110,80,100,80,95,0,0],
[60,'Poliwag',['Água'],40,50,40,40,40,90,61,25],
[61,'Poliwhirl',['Água'],65,65,65,50,50,90,62,0],
[62,'Poliwrath',['Água','Lutador'],90,95,95,70,90,70,0,0],
[63,'Abra',['Psíquico'],25,20,15,105,55,90,64,16],
[64,'Kadabra',['Psíquico'],40,35,30,120,70,105,65,0],
[65,'Alakazam',['Psíquico'],55,50,45,135,95,120,0,0],
[66,'Machop',['Lutador'],70,80,50,35,35,35,67,28],
[67,'Machoke',['Lutador'],80,100,70,50,60,45,68,0],
[68,'Machamp',['Lutador'],90,130,80,65,85,55,0,0],
[69,'Bellsprout',['Grama','Venenoso'],50,75,35,70,30,40,70,21],
[70,'Weepinbell',['Grama','Venenoso'],65,90,50,85,45,55,71,0],
[71,'Victreebel',['Grama','Venenoso'],80,105,65,100,70,70,0,0],
[72,'Tentacool',['Água','Venenoso'],40,40,35,50,100,70,73,30],
[73,'Tentacruel',['Água','Venenoso'],80,70,65,80,120,100,0,0],
[74,'Geodude',['Pedra','Terrestre'],40,80,100,30,30,20,75,25],
[75,'Graveler',['Pedra','Terrestre'],55,95,115,45,45,35,76,0],
[76,'Golem',['Pedra','Terrestre'],80,120,130,55,65,45,0,0],
[77,'Ponyta',['Fogo'],50,85,55,65,65,90,78,40],
[78,'Rapidash',['Fogo'],65,100,70,80,80,105,0,0],
[79,'Slowpoke',['Água','Psíquico'],90,65,65,40,40,15,80,37],
[80,'Slowbro',['Água','Psíquico'],95,75,110,100,80,30,0,0],
[81,'Magnemite',['Elétrico'],25,35,70,95,55,45,82,30],
[82,'Magneton',['Elétrico'],50,60,95,120,70,70,0,0],
[83,"Farfetch'd",['Normal','Voador'],52,90,55,58,62,60,0,0],
[84,'Doduo',['Normal','Voador'],35,85,45,35,35,75,85,31],
[85,'Dodrio',['Normal','Voador'],60,110,70,60,60,110,0,0],
[86,'Seel',['Água'],65,45,55,45,70,45,87,34],
[87,'Dewgong',['Água','Gelo'],90,70,80,70,95,70,0,0],
[88,'Grimer',['Venenoso'],80,80,50,40,50,25,89,38],
[89,'Muk',['Venenoso'],105,105,75,65,100,50,0,0],
[90,'Shellder',['Água'],30,65,100,45,25,40,91,0],
[91,'Cloyster',['Água','Gelo'],50,95,180,85,45,70,0,0],
[92,'Gastly',['Fantasma','Venenoso'],30,35,30,100,35,80,93,25],
[93,'Haunter',['Fantasma','Venenoso'],45,50,45,115,55,95,94,0],
[94,'Gengar',['Fantasma','Venenoso'],60,65,60,130,75,110,0,0],
[95,'Onix',['Pedra','Terrestre'],35,45,160,30,45,70,0,0],
[96,'Drowzee',['Psíquico'],60,48,45,43,90,42,97,26],
[97,'Hypno',['Psíquico'],85,73,70,73,115,67,0,0],
[98,'Krabby',['Água'],30,105,90,25,25,50,99,28],
[99,'Kingler',['Água'],55,130,115,50,50,75,0,0],
[100,'Voltorb',['Elétrico'],40,30,50,55,55,100,101,30],
[101,'Electrode',['Elétrico'],60,50,70,80,80,150,0,0],
[102,'Exeggcute',['Grama','Psíquico'],60,40,80,60,45,40,103,0],
[103,'Exeggutor',['Grama','Psíquico'],95,95,85,125,75,55,0,0],
[104,'Cubone',['Terrestre'],50,50,95,40,50,35,105,28],
[105,'Marowak',['Terrestre'],60,80,110,50,80,45,0,0],
[106,'Hitmonlee',['Lutador'],50,120,53,35,110,87,0,0],
[107,'Hitmonchan',['Lutador'],50,105,79,35,110,76,0,0],
[108,'Lickitung',['Normal'],90,55,75,60,75,30,0,0],
[109,'Koffing',['Venenoso'],40,65,95,60,45,35,110,35],
[110,'Weezing',['Venenoso'],65,90,120,85,70,60,0,0],
[111,'Rhyhorn',['Terrestre','Pedra'],80,85,95,30,30,25,112,42],
[112,'Rhydon',['Terrestre','Pedra'],105,130,120,45,45,40,0,0],
[113,'Chansey',['Normal'],250,5,5,35,105,50,0,0],
[114,'Tangela',['Grama'],65,55,115,100,40,60,0,0],
[115,'Kangaskhan',['Normal'],105,95,80,40,80,90,0,0],
[116,'Horsea',['Água'],30,40,70,70,25,60,117,32],
[117,'Seadra',['Água'],55,65,95,95,45,85,0,0],
[118,'Goldeen',['Água'],45,67,60,35,50,63,119,33],
[119,'Seaking',['Água'],80,92,65,65,80,68,0,0],
[120,'Staryu',['Água'],30,45,55,70,55,85,121,0],
[121,'Starmie',['Água','Psíquico'],60,75,85,100,85,115,0,0],
[122,'Mr. Mime',['Psíquico'],40,45,65,100,120,90,0,0],
[123,'Scyther',['Inseto','Voador'],70,110,80,55,80,105,0,0],
[124,'Jynx',['Gelo','Psíquico'],65,50,35,115,95,95,0,0],
[125,'Electabuzz',['Elétrico'],65,83,57,95,85,105,0,0],
[126,'Magmar',['Fogo'],65,95,57,100,85,93,0,0],
[127,'Pinsir',['Inseto'],65,125,100,55,70,85,0,0],
[128,'Tauros',['Normal'],75,100,95,40,70,110,0,0],
[129,'Magikarp',['Água'],20,10,55,15,20,80,130,20],
[130,'Gyarados',['Água','Voador'],95,125,79,60,100,81,0,0],
[131,'Lapras',['Água','Gelo'],130,85,80,85,95,60,0,0],
[132,'Ditto',['Normal'],48,48,48,48,48,48,0,0],
[133,'Eevee',['Normal'],55,55,50,45,65,55,0,0],
[134,'Vaporeon',['Água'],130,65,60,110,95,65,0,0],
[135,'Jolteon',['Elétrico'],65,65,60,110,95,130,0,0],
[136,'Flareon',['Fogo'],65,130,60,95,110,65,0,0],
[137,'Porygon',['Normal'],65,60,70,85,75,40,0,0],
[138,'Omanyte',['Pedra','Água'],35,40,100,90,55,35,139,40],
[139,'Omastar',['Pedra','Água'],70,60,125,115,70,55,0,0],
[140,'Kabuto',['Pedra','Água'],30,80,90,55,45,55,141,40],
[141,'Kabutops',['Pedra','Água'],60,115,105,65,70,80,0,0],
[142,'Aerodactyl',['Pedra','Voador'],80,105,65,60,75,130,0,0],
[143,'Snorlax',['Normal'],160,110,65,65,110,30,0,0],
[144,'Articuno',['Gelo','Voador'],90,85,100,95,125,85,0,0],
[145,'Zapdos',['Elétrico','Voador'],90,90,85,125,90,100,0,0],
[146,'Moltres',['Fogo','Voador'],90,100,90,125,85,90,0,0],
[147,'Dratini',['Dragão'],41,64,45,50,50,50,148,30],
[148,'Dragonair',['Dragão'],61,84,65,70,70,70,149,55],
[149,'Dragonite',['Dragão','Voador'],91,134,95,100,100,80,0,0],
[150,'Mewtwo',['Psíquico'],106,110,90,154,90,130,0,0],
[151,'Mew',['Psíquico'],100,100,100,100,100,100,0,0],
/* Cães Lendários e Ho-Oh — existem em Kanto por decreto do universo desta campanha */
[243,'Raikou',['Elétrico'],90,85,75,115,100,115,0,0],
[244,'Entei',['Fogo'],115,115,85,90,75,100,0,0],
[245,'Suicune',['Água'],100,75,115,90,115,85,0,0],
[250,'Ho-Oh',['Fogo','Voador'],106,130,90,110,154,90,0,0]
];

/* Lendários (lista fechada do universo) */
const LENDARIOS = [144,145,146,150,151,243,244,245,250];
/* Quebram Poké Balls: Mewtwo e Ho-Oh */
const QUEBRA_BOLA = [150,250];
/* Grupos para consequências em cascata */
const GRUPO_AVES = [144,145,146];
const GRUPO_CAES = [243,244,245];

const DEX = {};
DEX_RAW.forEach(r => {
  const [dex,nome,tipos,hp,atk,def,spa,spd,spe,evo,nivelEvo] = r;
  DEX[dex] = {
    dex, nome, tipos,
    base:{hp,atk,def,spa,spd,spe},
    evo, nivelEvo,
    lendario: LENDARIOS.includes(dex),
    total: hp+atk+def+spa+spd+spe
  };
});

/* Taxa de captura derivada: lendários 3, fortões 45, médios 90, comuns 190 */
Object.values(DEX).forEach(p => {
  if (p.lendario) p.captura = 3;
  else if (p.total >= 490) p.captura = 45;
  else if (p.total >= 400) p.captura = 90;
  else if (p.total >= 320) p.captura = 150;
  else p.captura = 220;
});

/* Pool de encontros selvagens: tudo menos lendários e Ditto/Porygon/Mew */
const POOL_SELVAGEM = Object.values(DEX)
  .filter(p => !p.lendario && p.dex <= 151 && ![132,137].includes(p.dex))
  .map(p => p.dex);

/* Viés de ambiente — aumenta a chance, mas QUALQUER um pode aparecer */
const VIES_AMBIENTE = {
  'campo':     ['Normal','Grama','Inseto','Voador'],
  'floresta':  ['Inseto','Grama','Venenoso'],
  'caverna':   ['Pedra','Terrestre','Venenoso','Voador'],
  'agua':      ['Água','Gelo'],
  'montanha':  ['Pedra','Terrestre','Fogo','Lutador'],
  'cidade':    ['Normal','Venenoso','Elétrico'],
  'cemiterio': ['Fantasma','Venenoso','Psíquico'],
  'vulcao':    ['Fogo','Pedra'],
  'ruina':     ['Psíquico','Fantasma','Venenoso','Elétrico']
};

function dexPorNome(nome){
  return Object.values(DEX).find(p => p.nome.toLowerCase() === String(nome).toLowerCase());
}
