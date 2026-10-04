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
/* O trio lendário (Raikou, Entei, Suicune) e Ho-Oh — existem em Kanto por decreto do universo desta campanha */
[243,'Raikou',['Elétrico'],90,85,75,115,100,115,0,0],
[244,'Entei',['Fogo'],115,115,85,90,75,100,0,0],
[245,'Suicune',['Água'],100,75,115,90,115,85,0,0],
[250,'Ho-Oh',['Fogo','Voador'],106,130,90,110,154,90,0,0]
];

/* ============================================================
   JOHTO — registros 152 a 251
   Entram na tabela desde o começo porque a Pokédex Nacional é
   um upgrade de software, não um catálogo novo: o aparelho já
   sabe ler tudo, só não te mostra antes da hora. Os três do trio lendário,
   o Ho-Oh e, por tabela, o Lugia e o Celebi já tinham entrada
   acima porque a história de Kanto passa por eles.

   Sem tipo Fada: em 1999 ela não existia, e Cleffa, Igglybuff,
   Togepi, Togetic, Snubbull e Granbull eram Normais.
   ============================================================ */
const DEX_RAW_JOHTO = [
[152,'Chikorita',['Grama'],45,49,65,49,65,45,153,16],
[153,'Bayleef',['Grama'],60,62,80,63,80,60,154,32],
[154,'Meganium',['Grama'],80,82,100,83,100,80,0,0],
[155,'Cyndaquil',['Fogo'],39,52,43,60,50,65,156,14],
[156,'Quilava',['Fogo'],58,64,58,80,65,80,157,36],
[157,'Typhlosion',['Fogo'],78,84,78,109,85,100,0,0],
[158,'Totodile',['Água'],50,65,64,44,48,43,159,18],
[159,'Croconaw',['Água'],65,80,80,59,63,58,160,30],
[160,'Feraligatr',['Água'],85,105,100,79,83,78,0,0],
[161,'Sentret',['Normal'],35,46,34,35,45,20,162,15],
[162,'Furret',['Normal'],85,76,64,45,55,90,0,0],
[163,'Hoothoot',['Normal','Voador'],60,30,30,36,56,50,164,20],
[164,'Noctowl',['Normal','Voador'],100,50,50,86,96,70,0,0],
[165,'Ledyba',['Inseto','Voador'],40,20,30,40,80,55,166,18],
[166,'Ledian',['Inseto','Voador'],55,35,50,55,110,85,0,0],
[167,'Spinarak',['Inseto','Venenoso'],40,60,40,40,40,30,168,22],
[168,'Ariados',['Inseto','Venenoso'],70,90,70,60,60,40,0,0],
[169,'Crobat',['Venenoso','Voador'],85,90,80,70,80,130,0,0],
[170,'Chinchou',['Água','Elétrico'],75,38,38,56,56,67,171,27],
[171,'Lanturn',['Água','Elétrico'],125,58,58,76,76,67,0,0],
[172,'Pichu',['Elétrico'],20,40,15,35,35,60,0,0],
[173,'Cleffa',['Normal'],50,25,28,45,55,15,0,0],
[174,'Igglybuff',['Normal'],90,30,15,40,20,15,0,0],
[175,'Togepi',['Normal'],35,20,65,40,65,20,176,0],
[176,'Togetic',['Normal','Voador'],55,40,85,80,105,40,0,0],
[177,'Natu',['Psíquico','Voador'],40,50,45,70,45,70,178,25],
[178,'Xatu',['Psíquico','Voador'],65,75,70,95,70,95,0,0],
[179,'Mareep',['Elétrico'],55,40,40,65,45,35,180,15],
[180,'Flaaffy',['Elétrico'],70,55,55,80,60,45,181,30],
[181,'Ampharos',['Elétrico'],90,75,85,115,90,55,0,0],
[182,'Bellossom',['Grama'],75,80,95,90,100,50,0,0],
[183,'Marill',['Água'],70,20,50,20,50,40,184,18],
[184,'Azumarill',['Água'],100,50,80,60,80,50,0,0],
[185,'Sudowoodo',['Pedra'],70,100,115,30,65,30,0,0],
[186,'Politoed',['Água'],90,75,75,90,100,70,0,0],
[187,'Hoppip',['Grama','Voador'],35,35,40,35,55,50,188,18],
[188,'Skiploom',['Grama','Voador'],55,45,50,45,65,80,189,27],
[189,'Jumpluff',['Grama','Voador'],75,55,70,55,95,110,0,0],
[190,'Aipom',['Normal'],55,70,55,40,55,85,0,0],
[191,'Sunkern',['Grama'],30,30,30,30,30,30,192,0],
[192,'Sunflora',['Grama'],75,75,55,105,85,30,0,0],
[193,'Yanma',['Inseto','Voador'],65,65,45,75,45,95,0,0],
[194,'Wooper',['Água','Terrestre'],55,45,45,25,25,15,195,20],
[195,'Quagsire',['Água','Terrestre'],95,85,85,65,65,35,0,0],
[196,'Espeon',['Psíquico'],65,65,60,130,95,110,0,0],
[197,'Umbreon',['Sombrio'],95,65,110,60,130,65,0,0],
[198,'Murkrow',['Sombrio','Voador'],60,85,42,85,42,91,0,0],
[199,'Slowking',['Água','Psíquico'],95,75,80,100,110,30,0,0],
[200,'Misdreavus',['Fantasma'],60,60,60,85,85,85,0,0],
[201,'Unown',['Psíquico'],48,72,48,72,48,48,0,0],
[202,'Wobbuffet',['Psíquico'],190,33,58,33,58,33,0,0],
[203,'Girafarig',['Normal','Psíquico'],70,80,65,90,65,85,0,0],
[204,'Pineco',['Inseto'],50,65,90,35,35,15,205,31],
[205,'Forretress',['Inseto','Metálico'],75,90,140,60,60,40,0,0],
[206,'Dunsparce',['Normal'],100,70,70,65,65,45,0,0],
[207,'Gligar',['Terrestre','Voador'],65,75,105,35,65,85,0,0],
[208,'Steelix',['Metálico','Terrestre'],75,85,200,55,65,30,0,0],
[209,'Snubbull',['Normal'],60,80,50,40,40,30,210,23],
[210,'Granbull',['Normal'],90,120,75,60,60,45,0,0],
[211,'Qwilfish',['Água','Venenoso'],65,95,75,55,55,85,0,0],
[212,'Scizor',['Inseto','Metálico'],70,130,100,55,80,65,0,0],
[213,'Shuckle',['Inseto','Pedra'],20,10,230,10,230,5,0,0],
[214,'Heracross',['Inseto','Lutador'],80,125,75,40,95,85,0,0],
[215,'Sneasel',['Sombrio','Gelo'],55,95,55,35,75,115,0,0],
[216,'Teddiursa',['Normal'],60,80,50,50,50,40,217,30],
[217,'Ursaring',['Normal'],90,130,75,75,75,55,0,0],
[218,'Slugma',['Fogo'],40,40,40,70,40,20,219,38],
[219,'Magcargo',['Fogo','Pedra'],50,50,120,80,80,30,0,0],
[220,'Swinub',['Gelo','Terrestre'],50,50,40,30,30,50,221,33],
[221,'Piloswine',['Gelo','Terrestre'],100,100,80,60,60,50,0,0],
[222,'Corsola',['Água','Pedra'],55,55,85,65,85,35,0,0],
[223,'Remoraid',['Água'],35,65,35,65,35,65,224,25],
[224,'Octillery',['Água'],75,105,75,105,75,45,0,0],
[225,'Delibird',['Gelo','Voador'],45,55,45,65,45,75,0,0],
[226,'Mantine',['Água','Voador'],65,40,70,80,140,70,0,0],
[227,'Skarmory',['Metálico','Voador'],65,80,140,40,70,70,0,0],
[228,'Houndour',['Sombrio','Fogo'],45,60,30,80,50,65,229,24],
[229,'Houndoom',['Sombrio','Fogo'],75,90,50,110,80,95,0,0],
[230,'Kingdra',['Água','Dragão'],75,95,95,95,95,85,0,0],
[231,'Phanpy',['Terrestre'],90,60,60,40,40,40,232,25],
[232,'Donphan',['Terrestre'],90,120,120,60,60,50,0,0],
[233,'Porygon2',['Normal'],85,80,90,105,95,60,0,0],
[234,'Stantler',['Normal'],73,95,62,85,65,85,0,0],
[235,'Smeargle',['Normal'],55,20,35,20,45,75,0,0],
[236,'Tyrogue',['Lutador'],35,35,35,35,35,35,237,20],
[237,'Hitmontop',['Lutador'],50,95,95,35,110,70,0,0],
[238,'Smoochum',['Gelo','Psíquico'],45,30,15,85,65,65,0,0],
[239,'Elekid',['Elétrico'],45,63,37,65,55,95,0,0],
[240,'Magby',['Fogo'],45,75,37,70,55,83,0,0],
[241,'Miltank',['Normal'],95,80,105,40,70,100,0,0],
[242,'Blissey',['Normal'],255,10,10,75,135,55,0,0],
[246,'Larvitar',['Pedra','Terrestre'],50,64,50,45,50,41,247,30],
[247,'Pupitar',['Pedra','Terrestre'],70,84,70,65,70,51,248,55],
[248,'Tyranitar',['Pedra','Sombrio'],100,134,110,95,100,61,0,0],
[249,'Lugia',['Psíquico','Voador'],106,90,130,90,154,110,0,0],
[251,'Celebi',['Psíquico','Grama'],100,100,100,100,100,100,0,0]
];
DEX_RAW_JOHTO.forEach(r => DEX_RAW.push(r));

/* Lendários (lista fechada do universo) */
const LENDARIOS = [144,145,146,150,151,243,244,245,249,250,251];
/* Quebram Poké Balls: Mewtwo e Ho-Oh */
const QUEBRA_BOLA = [150,249,250,251];
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

/* ── Nível mínimo de existência ───────────────────────────────
   Um Dodrio não existe no nível 6: ele foi um Doduo até o 31.
   Para cada espécie, o piso é o nível em que a forma anterior
   evolui; em cadeia, o piso do estágio anterior sobe junto.
   Evolução por pedra ou troca não tem nível: ali o piso é o da
   forma anterior com uma folga, porque ninguém usa pedra em
   filhote recém-nascido.                                        */
/* O campo evo guarda um destino só. Eevee tem cinco depois de
   Johto, então os outros quatro entram aqui à mão — junto com as
   evoluções que a 2ª Geração pendurou em espécies de Kanto.

   Só o lado de Johto é registrado. Pôr Pichu como forma anterior
   do Pikachu daria ao Pikachu um piso de nível 18 e quebraria o
   inicial de nível 5 da primeira cena; a evolução de bebê para
   Kanto mora em EVO_JOHTO, que não mexe em piso nenhum. */
const PRE_EVO_EXTRA = {
  134:133, 135:133, 136:133, 196:133, 197:133,   /* Eevee */
  169:42,                                         /* Golbat  -> Crobat    */
  182:44,                                         /* Gloom   -> Bellossom */
  186:61,                                         /* Poliwhirl -> Politoed */
  199:79,                                         /* Slowpoke -> Slowking */
  208:95,                                         /* Onix    -> Steelix   */
  212:123,                                        /* Scyther -> Scizor    */
  230:117,                                        /* Seadra  -> Kingdra   */
  233:137,                                        /* Porygon -> Porygon2  */
  242:113                                         /* Chansey -> Blissey   */
};

Object.values(DEX).forEach(p => { p.preEvo = 0; p.nivelMin = 1; });
Object.values(DEX).forEach(p => { if (p.evo) DEX[p.evo].preEvo = p.dex; });
Object.entries(PRE_EVO_EXTRA).forEach(([dex, anterior]) => { DEX[dex].preEvo = anterior; });

(function calcularPisos(){
  const piso = dex => {
    const e = DEX[dex];
    if (!e || !e.preEvo) return 1;
    const anterior = DEX[e.preEvo];
    const pisoAnterior = piso(e.preEvo);
    return anterior.nivelEvo > 0
      ? Math.max(anterior.nivelEvo, pisoAnterior)     /* evolui por nível */
      : Math.max(pisoAnterior + 5, 18);               /* pedra ou troca   */
  };
  Object.values(DEX).forEach(p => { p.nivelMin = piso(p.dex); });
})();

/* O piso de quem já evoluiu vale para qualquer lugar que gere um
   Pokémon: selvagem, time de treinador ou cena escrita à mão. */
function nivelMinimoDe(dexId){
  const e = DEX[dexId];
  return e ? (e.nivelMin || 1) : 1;
}

/* Taxa de captura derivada: lendários 3, fortões 45, médios 90, comuns 190 */
Object.values(DEX).forEach(p => {
  if (p.lendario) p.captura = 3;
  else if (p.total >= 490) p.captura = 45;
  else if (p.total >= 400) p.captura = 90;
  else if (p.total >= 320) p.captura = 150;
  else p.captura = 220;
});

/* ============================================================
   O QUE APARECE NO MATO
   Kanto é o pool de sempre. Johto fica guardado e só entra
   depois que a Liga acaba e a região abre — os quatro lendários
   de lá que a história usa nunca dependeram disso, porque
   nenhum deles aparece por sorteio.
   ============================================================ */
/* Bebês não aparecem no mato: em Johto eles só saem de ovo. */
const BEBES_JOHTO = [172,173,174,175,236,238,239,240];

const POOL_KANTO = Object.values(DEX)
  .filter(p => !p.lendario && p.dex <= 151 && ![132,137].includes(p.dex))
  .map(p => p.dex);

const POOL_JOHTO_SELVAGEM = Object.values(DEX)
  .filter(p => !p.lendario && p.dex >= 152 && !BEBES_JOHTO.includes(p.dex) && p.dex !== 201)
  .map(p => p.dex);

/* Compatibilidade: quem lê POOL_SELVAGEM direto continua vendo Kanto. */
const POOL_SELVAGEM = POOL_KANTO;

function johtoLiberado(){
  try { return !!(Estado.dados && Estado.dados.flags.johto_liberado); } catch(e){ return false; }
}
function poolSelvagem(){
  return johtoLiberado() ? POOL_KANTO.concat(POOL_JOHTO_SELVAGEM) : POOL_KANTO;
}

/* ============================================================
   EVOLUÇÕES QUE A 2ª GERAÇÃO TROUXE
   Nada disso existe antes da Pokédex Nacional. Enquanto Kanto
   é Kanto, um Golbat feliz continua sendo um Golbat.
   ============================================================ */
const EVO_JOHTO_AMIZADE = {42:169, 113:242, 133:196, 172:25, 173:35, 174:39, 175:176};
const EVO_JOHTO_TROCA   = {95:208, 123:212, 117:230, 61:186, 79:199, 137:233};
const EVO_JOHTO_PEDRA   = {44:182, 191:192};
const EVO_JOHTO_NIVEL   = {238:124, 239:125, 240:126};

function dexNacional(){
  try { return !!(Estado.dados && Estado.dados.flags.dex_nacional); } catch(e){ return false; }
}

/* A lista que a Pokédex mostra agora. A de Kanto são os 150; o 151
   (Mew) e os lendários de Johto que a história de Kanto atravessa só
   entram na lista depois que a Pokédex registra um deles — antes
   disso, nem a casa vazia existe, que casa vazia já é notícia. */
const DEX_KANTO_IDS = Object.values(DEX).filter(p => p.dex <= 150).map(p => p.dex).sort((a,b) => a-b);
const DEX_KANTO_SO_REGISTRADO = [151, 243, 244, 245, 250];
const DEX_NACIONAL_IDS = Object.values(DEX).map(p => p.dex).sort((a,b) => a-b);

function idsKanto(){
  let pd = null;
  try { pd = Estado.pdex(); } catch(e){}
  const tem = d => !!(pd && ((pd.catalogados || {})[d] || (pd.vistos || {})[d]));
  return DEX_KANTO_IDS.concat(DEX_KANTO_SO_REGISTRADO.filter(tem)).sort((a,b) => a-b);
}
function registroAtivo(){ return dexNacional() ? DEX_NACIONAL_IDS : idsKanto(); }

/* Viés de ambiente — aumenta a chance, mas QUALQUER um pode aparecer */
const VIES_AMBIENTE = {
  'campo':     ['Normal','Grama','Inseto','Voador'],
  'floresta':  ['Inseto','Grama','Venenoso'],
  'caverna':   ['Pedra','Terrestre','Venenoso','Voador','Metálico'],
  'agua':      ['Água','Gelo'],
  'montanha':  ['Pedra','Terrestre','Fogo','Lutador','Metálico'],
  'cidade':    ['Normal','Venenoso','Elétrico'],
  'cemiterio': ['Fantasma','Venenoso','Psíquico','Sombrio'],
  'vulcao':    ['Fogo','Pedra'],
  'ruina':     ['Psíquico','Fantasma','Venenoso','Elétrico','Sombrio']
};

function dexPorNome(nome){
  return Object.values(DEX).find(p => p.nome.toLowerCase() === String(nome).toLowerCase());
}
