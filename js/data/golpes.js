/* ============================================================
   GOLPES — poder, precisão, PP, tipo, categoria, efeito
   categoria: 'fis' | 'esp' | 'status'
   ef: {tipo:'queimadura|veneno|paralisia|sono|congelamento|confusao',
        chance:0-100} | {drena:0.5} | {recuo:0.25} | {fixo:n} | {nivel:true}
   nv: nível mínimo sugerido para aprender
   ============================================================ */
const GOLPES = {
  /* --- NORMAL --- */
  'Tackle':        {t:'Normal',c:'fis',p:40,a:100,pp:35,nv:1},
  'Scratch':       {t:'Normal',c:'fis',p:40,a:100,pp:35,nv:1},
  'Pound':         {t:'Normal',c:'fis',p:40,a:100,pp:35,nv:1},
  'Quick Attack':  {t:'Normal',c:'fis',p:40,a:100,pp:30,nv:10,ef:{prioridade:1}},
  'Bite':          {t:'Normal',c:'fis',p:60,a:100,pp:25,nv:14,ef:{tipo:'recuo',chance:30}},
  'Swift':         {t:'Normal',c:'esp',p:60,a:999,pp:20,nv:18},
  'Headbutt':      {t:'Normal',c:'fis',p:70,a:100,pp:15,nv:20,ef:{tipo:'recuo',chance:30}},
  'Mega Punch':    {t:'Normal',c:'fis',p:80,a:85,pp:20,nv:24},
  'Slam':          {t:'Normal',c:'fis',p:80,a:75,pp:20,nv:24},
  'Hyper Fang':    {t:'Normal',c:'fis',p:80,a:90,pp:15,nv:26},
  'Body Slam':     {t:'Normal',c:'fis',p:85,a:100,pp:15,nv:30,ef:{tipo:'paralisia',chance:30}},
  'Take Down':     {t:'Normal',c:'fis',p:90,a:85,pp:20,nv:32,ef:{recuo:0.25}},
  'Mega Kick':     {t:'Normal',c:'fis',p:120,a:75,pp:5,nv:40,raro:true},
  'Double-Edge':   {t:'Normal',c:'fis',p:120,a:100,pp:15,nv:44,ef:{recuo:0.33}},
  'Hyper Beam':    {t:'Normal',c:'esp',p:150,a:90,pp:5,nv:50,ef:{recarga:true},raro:true},
  'Growl':         {t:'Normal',c:'status',p:0,a:100,pp:40,nv:1,ef:{baixa:'atk'}},
  'Tail Whip':     {t:'Normal',c:'status',p:0,a:100,pp:30,nv:1,ef:{baixa:'def'}},
  'Leer':          {t:'Normal',c:'status',p:0,a:100,pp:30,nv:1,ef:{baixa:'def'}},
  'Screech':       {t:'Normal',c:'status',p:0,a:85,pp:40,nv:16,ef:{baixa:'def',forte:true},raro:true},
  'Harden':        {t:'Normal',c:'status',p:0,a:999,pp:30,nv:1,ef:{sobe:'def'}},
  'Swords Dance':  {t:'Normal',c:'status',p:0,a:999,pp:20,nv:28,ef:{sobe:'atk',forte:true},raro:true},
  'Agility':       {t:'Normal',c:'status',p:0,a:999,pp:30,nv:26,ef:{sobe:'spe',forte:true},raro:true},
  'Recover':       {t:'Normal',c:'status',p:0,a:999,pp:10,nv:30,ef:{cura:0.5},raro:true},
  'Rest':          {t:'Normal',c:'status',p:0,a:999,pp:10,nv:34,ef:{cura:1,dorme:true},raro:true},
  'Sing':          {t:'Normal',c:'status',p:0,a:55,pp:15,nv:8,ef:{tipo:'sono',chance:100},soPara:[35,36,39,40,124,54,55]},
  'Supersonic':    {t:'Normal',c:'status',p:0,a:55,pp:20,nv:8,ef:{tipo:'confusao',chance:100},soPara:[41,42,46,47,48,49,72,73,100,101,120,121,90,91,98,99]},

  /* --- FOGO --- */
  'Ember':         {t:'Fogo',c:'esp',p:40,a:100,pp:25,nv:1,ef:{tipo:'queimadura',chance:10}},
  'Fire Punch':    {t:'Fogo',c:'fis',p:75,a:100,pp:15,nv:24,ef:{tipo:'queimadura',chance:10}},
  'Flamethrower':  {t:'Fogo',c:'esp',p:90,a:100,pp:15,nv:34,ef:{tipo:'queimadura',chance:10}},
  'Fire Blast':    {t:'Fogo',c:'esp',p:110,a:85,pp:5,nv:46,ef:{tipo:'queimadura',chance:30}},
  'Fire Spin':     {t:'Fogo',c:'esp',p:35,a:85,pp:15,nv:14,ef:{preso:true}},

  /* --- ÁGUA --- */
  'Bubble':        {t:'Água',c:'esp',p:40,a:100,pp:30,nv:1},
  'Water Gun':     {t:'Água',c:'esp',p:40,a:100,pp:25,nv:1},
  'Bubble Beam':   {t:'Água',c:'esp',p:65,a:100,pp:20,nv:18,ef:{baixa:'spe'}},
  'Waterfall':     {t:'Água',c:'fis',p:80,a:100,pp:15,nv:28},
  'Surf':          {t:'Água',c:'esp',p:90,a:100,pp:15,nv:36},
  'Hydro Pump':    {t:'Água',c:'esp',p:110,a:80,pp:5,nv:46},

  /* --- ELÉTRICO --- */
  'Thunder Shock': {t:'Elétrico',c:'esp',p:40,a:100,pp:30,nv:1,ef:{tipo:'paralisia',chance:10}},
  'Thunder Wave':  {t:'Elétrico',c:'status',p:0,a:90,pp:20,nv:12,ef:{tipo:'paralisia',chance:100}},
  'Thunder Punch': {t:'Elétrico',c:'fis',p:75,a:100,pp:15,nv:24,ef:{tipo:'paralisia',chance:10}},
  'Thunderbolt':   {t:'Elétrico',c:'esp',p:90,a:100,pp:15,nv:34,ef:{tipo:'paralisia',chance:10}},
  'Thunder':       {t:'Elétrico',c:'esp',p:110,a:70,pp:10,nv:46,ef:{tipo:'paralisia',chance:30}},

  /* --- GRAMA --- */
  'Absorb':        {t:'Grama',c:'esp',p:20,a:100,pp:25,nv:1,ef:{drena:0.5}},
  'Vine Whip':     {t:'Grama',c:'fis',p:45,a:100,pp:25,nv:1},
  'Mega Drain':    {t:'Grama',c:'esp',p:40,a:100,pp:15,nv:16,ef:{drena:0.5}},
  'Razor Leaf':    {t:'Grama',c:'fis',p:55,a:95,pp:25,nv:20,ef:{critico:true}},
  'Sleep Powder':  {t:'Grama',c:'status',p:0,a:75,pp:15,nv:12,ef:{tipo:'sono',chance:100}},
  'Stun Spore':    {t:'Grama',c:'status',p:0,a:75,pp:30,nv:12,ef:{tipo:'paralisia',chance:100}},
  'Poison Powder': {t:'Grama',c:'status',p:0,a:75,pp:35,nv:12,ef:{tipo:'veneno',chance:100}},
  'Solar Beam':    {t:'Grama',c:'esp',p:120,a:100,pp:10,nv:44,ef:{carga:true}},
  'Petal Dance':   {t:'Grama',c:'esp',p:120,a:100,pp:10,nv:42,ef:{confundeSe:true}},

  /* --- GELO --- */
  'Aurora Beam':   {t:'Gelo',c:'esp',p:65,a:100,pp:20,nv:20,ef:{baixa:'atk'}},
  'Ice Punch':     {t:'Gelo',c:'fis',p:75,a:100,pp:15,nv:24,ef:{tipo:'congelamento',chance:10}},
  'Ice Beam':      {t:'Gelo',c:'esp',p:90,a:100,pp:10,nv:34,ef:{tipo:'congelamento',chance:10}},
  'Blizzard':      {t:'Gelo',c:'esp',p:110,a:70,pp:5,nv:46,ef:{tipo:'congelamento',chance:10}},

  /* --- LUTADOR --- */
  'Karate Chop':   {t:'Lutador',c:'fis',p:50,a:100,pp:25,nv:1,ef:{critico:true}},
  'Double Kick':   {t:'Lutador',c:'fis',p:30,a:100,pp:30,nv:12,ef:{golpes:2}},
  'Low Kick':      {t:'Lutador',c:'fis',p:50,a:90,pp:20,nv:14},
  'Seismic Toss':  {t:'Lutador',c:'fis',p:0,a:100,pp:20,nv:22,ef:{nivel:true}},
  'Submission':    {t:'Lutador',c:'fis',p:80,a:80,pp:25,nv:30,ef:{recuo:0.25}},
  'Cross Chop':    {t:'Lutador',c:'fis',p:100,a:80,pp:5,nv:42,ef:{critico:true}},

  /* --- VENENOSO --- */
  'Poison Sting':  {t:'Venenoso',c:'fis',p:15,a:100,pp:35,nv:1,ef:{tipo:'veneno',chance:30}},
  'Acid':          {t:'Venenoso',c:'esp',p:40,a:100,pp:30,nv:10,ef:{baixa:'def'}},
  'Smog':          {t:'Venenoso',c:'esp',p:30,a:70,pp:20,nv:8,ef:{tipo:'veneno',chance:40}},
  'Sludge':        {t:'Venenoso',c:'esp',p:65,a:100,pp:20,nv:24,ef:{tipo:'veneno',chance:30}},
  'Toxic':         {t:'Venenoso',c:'status',p:0,a:85,pp:10,nv:28,ef:{tipo:'veneno',chance:100,grave:true}},

  /* --- TERRESTRE --- */
  'Sand Attack':   {t:'Terrestre',c:'status',p:0,a:100,pp:15,nv:1,ef:{baixa:'precisao'}},
  'Bone Club':     {t:'Terrestre',c:'fis',p:65,a:85,pp:20,nv:16,ef:{tipo:'recuo',chance:10}},
  'Dig':           {t:'Terrestre',c:'fis',p:80,a:100,pp:10,nv:26,ef:{carga:true}},
  'Bonemerang':    {t:'Terrestre',c:'fis',p:50,a:90,pp:10,nv:30,ef:{golpes:2}},
  'Earthquake':    {t:'Terrestre',c:'fis',p:100,a:100,pp:10,nv:40},

  /* --- VOADOR --- */
  'Peck':          {t:'Voador',c:'fis',p:35,a:100,pp:35,nv:1},
  'Gust':          {t:'Voador',c:'esp',p:40,a:100,pp:35,nv:1},
  'Wing Attack':   {t:'Voador',c:'fis',p:60,a:100,pp:35,nv:16},
  'Drill Peck':    {t:'Voador',c:'fis',p:80,a:100,pp:20,nv:30},
  'Fly':           {t:'Voador',c:'fis',p:90,a:95,pp:15,nv:36,ef:{carga:true}},
  'Sky Attack':    {t:'Voador',c:'fis',p:140,a:90,pp:5,nv:48,ef:{carga:true}},

  /* --- PSÍQUICO --- */
  'Confusion':     {t:'Psíquico',c:'esp',p:50,a:100,pp:25,nv:1,ef:{tipo:'confusao',chance:10}},
  'Hypnosis':      {t:'Psíquico',c:'status',p:0,a:60,pp:20,nv:10,ef:{tipo:'sono',chance:100}},
  'Psybeam':       {t:'Psíquico',c:'esp',p:65,a:100,pp:20,nv:20,ef:{tipo:'confusao',chance:10}},
  'Barrier':       {t:'Psíquico',c:'status',p:0,a:999,pp:20,nv:24,ef:{sobe:'def',forte:true}},
  'Amnesia':       {t:'Psíquico',c:'status',p:0,a:999,pp:20,nv:28,ef:{sobe:'spd',forte:true}},
  'Psychic':       {t:'Psíquico',c:'esp',p:90,a:100,pp:10,nv:38,ef:{baixa:'spd'}},
  'Dream Eater':   {t:'Psíquico',c:'esp',p:100,a:100,pp:15,nv:42,ef:{drena:0.5,soDormindo:true}},

  /* --- INSETO --- */
  'String Shot':   {t:'Inseto',c:'status',p:0,a:95,pp:40,nv:1,ef:{baixa:'spe'}},
  'Leech Life':    {t:'Inseto',c:'fis',p:20,a:100,pp:15,nv:1,ef:{drena:0.5}},
  'Pin Missile':   {t:'Inseto',c:'fis',p:25,a:95,pp:20,nv:14,ef:{golpes:3}},
  'Twineedle':     {t:'Inseto',c:'fis',p:25,a:100,pp:20,nv:20,ef:{golpes:2,tipo:'veneno',chance:20}},

  /* --- PEDRA --- */
  'Rock Throw':    {t:'Pedra',c:'fis',p:50,a:90,pp:15,nv:10},
  'Rock Slide':    {t:'Pedra',c:'fis',p:75,a:90,pp:10,nv:32,ef:{tipo:'recuo',chance:30}},

  /* --- FANTASMA --- */
  'Lick':          {t:'Fantasma',c:'fis',p:30,a:100,pp:30,nv:1,ef:{tipo:'paralisia',chance:30}},
  'Night Shade':   {t:'Fantasma',c:'esp',p:0,a:100,pp:15,nv:18,ef:{nivel:true}},
  'Confuse Ray':   {t:'Fantasma',c:'status',p:0,a:100,pp:10,nv:22,ef:{tipo:'confusao',chance:100}},
  'Shadow Punch':  {t:'Fantasma',c:'fis',p:60,a:999,pp:20,nv:30},

  /* --- DRAGÃO --- */
  'Dragon Rage':   {t:'Dragão',c:'esp',p:0,a:100,pp:10,nv:20,ef:{fixo:40}},
  'Dragon Claw':   {t:'Dragão',c:'fis',p:80,a:100,pp:15,nv:38},
  'Outrage':       {t:'Dragão',c:'fis',p:120,a:100,pp:10,nv:50,ef:{confundeSe:true}},
  'Dragon Breath': {t:'Dragão',c:'esp',p:60,a:100,pp:20,nv:26,ef:{tipo:'paralisia',chance:30}},

  /* ============================================================
     GOLPES QUE CHEGAM COM JOHTO
     Os dois tipos novos e o punhado de golpes da 2ª Geração que
     as espécies de lá precisam para não lutar de mãos vazias.
     ============================================================ */

  /* --- SOMBRIO --- */
  'Pursuit':       {t:'Sombrio',c:'fis',p:40,a:100,pp:20,nv:8},
  'Thief':         {t:'Sombrio',c:'fis',p:40,a:100,pp:10,nv:12},
  'Faint Attack':  {t:'Sombrio',c:'fis',p:60,a:999,pp:20,nv:18},
  'Beat Up':       {t:'Sombrio',c:'fis',p:70,a:100,pp:10,nv:28,raro:true},
  'Crunch':        {t:'Sombrio',c:'fis',p:80,a:100,pp:15,nv:34,ef:{baixa:'spd',chance:20}},

  /* --- METÁLICO --- */
  'Metal Claw':    {t:'Metálico',c:'fis',p:50,a:95,pp:35,nv:8,ef:{sobe:'atk',chance:10}},
  'Steel Wing':    {t:'Metálico',c:'fis',p:70,a:90,pp:25,nv:22,ef:{sobe:'def',chance:10}},
  'Iron Tail':     {t:'Metálico',c:'fis',p:100,a:75,pp:15,nv:38,ef:{baixa:'def',chance:30}},

  /* --- reforço de 2ª Geração nos tipos que já existiam --- */
  'Giga Drain':    {t:'Grama',c:'esp',p:60,a:100,pp:5,nv:30,ef:{drena:0.5}},
  'Icy Wind':      {t:'Gelo',c:'esp',p:55,a:95,pp:15,nv:20,ef:{baixa:'spe',chance:100}},
  'Ancient Power': {t:'Pedra',c:'esp',p:60,a:100,pp:5,nv:26,raro:true},
  'Shadow Ball':   {t:'Fantasma',c:'esp',p:80,a:100,pp:15,nv:34,ef:{baixa:'spd',chance:20}},
  'Sludge Bomb':   {t:'Venenoso',c:'esp',p:90,a:100,pp:10,nv:36,ef:{tipo:'veneno',chance:30}},
  'Zap Cannon':    {t:'Elétrico',c:'esp',p:100,a:50,pp:5,nv:44,ef:{tipo:'paralisia',chance:100},raro:true},
  'Megahorn':      {t:'Inseto',c:'fis',p:120,a:85,pp:10,nv:46,raro:true},
  'Sacred Fire':   {t:'Fogo',c:'fis',p:100,a:95,pp:5,nv:40,ef:{tipo:'queimadura',chance:50},soPara:[250]},
  'Aeroblast':     {t:'Voador',c:'esp',p:100,a:95,pp:5,nv:40,ef:{critico:true},soPara:[249]},

  /* ============================================================
     O RESTO DA TABELA DE APRENDIZADO
     Os golpes que as espécies aprendem por nível e que ainda não
     existiam aqui. Poder, precisão, PP e tipo são os da 1ª e 2ª
     Geração. O efeito é o mais próximo que este motor sabe fazer:
     onde a mecânica original não cabe, está anotado na linha.
     ============================================================ */

  /* --- NORMAL --- */
  'Comet Punch':   {t:'Normal',c:'fis',p:18,a:85,pp:15,nv:1,ef:{golpes:3}},
  'Double Slap':   {t:'Normal',c:'fis',p:15,a:85,pp:10,nv:1,ef:{golpes:3}},
  'Fury Attack':   {t:'Normal',c:'fis',p:15,a:85,pp:20,nv:1,ef:{golpes:3}},
  'Fury Swipes':   {t:'Normal',c:'fis',p:18,a:80,pp:15,nv:1,ef:{golpes:3}},
  'Barrage':       {t:'Normal',c:'fis',p:15,a:85,pp:20,nv:1,ef:{golpes:3}},
  'Spike Cannon':  {t:'Normal',c:'fis',p:20,a:100,pp:15,nv:1,ef:{golpes:3}},
  'Constrict':     {t:'Normal',c:'fis',p:10,a:100,pp:35,nv:1,ef:{baixa:'spe',chance:10}},
  'Vice Grip':     {t:'Normal',c:'fis',p:55,a:100,pp:30,nv:1},
  'Horn Attack':   {t:'Normal',c:'fis',p:65,a:100,pp:25,nv:1},
  'Stomp':         {t:'Normal',c:'fis',p:65,a:100,pp:20,nv:1,ef:{tipo:'recuo',chance:30}},
  'Rage':          {t:'Normal',c:'fis',p:20,a:100,pp:20,nv:1},
  'Pay Day':       {t:'Normal',c:'fis',p:40,a:100,pp:20,nv:1},
  'Dizzy Punch':   {t:'Normal',c:'fis',p:70,a:100,pp:10,nv:1},
  'Slash':         {t:'Normal',c:'fis',p:70,a:100,pp:20,nv:1,ef:{critico:true}},
  'Thrash':        {t:'Normal',c:'fis',p:90,a:100,pp:20,nv:1,ef:{confundeSe:true}},
  'Skull Bash':    {t:'Normal',c:'fis',p:100,a:100,pp:15,nv:1,ef:{carga:true}},
  'Tri Attack':    {t:'Normal',c:'esp',p:80,a:100,pp:10,nv:1},
  'Wrap':          {t:'Normal',c:'fis',p:15,a:90,pp:20,nv:1,ef:{preso:true}},
  'Bind':          {t:'Normal',c:'fis',p:15,a:75,pp:20,nv:1,ef:{preso:true}},
  'Self-Destruct': {t:'Normal',c:'fis',p:200,a:100,pp:5,nv:1,ef:{recuo:1}},
  'Explosion':     {t:'Normal',c:'fis',p:250,a:100,pp:5,nv:1,ef:{recuo:1}},
  /* fulminantes: aqui viram um número alto e uma precisão péssima */
  'Horn Drill':    {t:'Normal',c:'fis',p:0,a:30,pp:5,nv:1,ef:{fixo:200}},
  'Guillotine':    {t:'Normal',c:'fis',p:0,a:30,pp:5,nv:1,ef:{fixo:200}},
  /* Super Fang tira metade; sem essa conta, vai por nível */
  'Super Fang':    {t:'Normal',c:'fis',p:0,a:90,pp:10,nv:1,ef:{nivel:true}},
  'Sonic Boom':    {t:'Normal',c:'esp',p:0,a:90,pp:20,nv:1,ef:{fixo:20}},
  'Growth':        {t:'Normal',c:'status',p:0,a:999,pp:20,nv:1,ef:{sobe:'spa'}},
  'Sharpen':       {t:'Normal',c:'status',p:0,a:999,pp:30,nv:1,ef:{sobe:'atk'}},
  'Meditate':      {t:'Normal',c:'status',p:0,a:999,pp:40,nv:1,ef:{sobe:'atk'}},
  'Focus Energy':  {t:'Normal',c:'status',p:0,a:999,pp:30,nv:1,ef:{sobe:'atk'}},
  'Defense Curl':  {t:'Normal',c:'status',p:0,a:999,pp:40,nv:1,ef:{sobe:'def'}},
  'Withdraw':      {t:'Água',c:'status',p:0,a:999,pp:40,nv:1,ef:{sobe:'def'}},
  'Minimize':      {t:'Normal',c:'status',p:0,a:999,pp:20,nv:1,ef:{sobe:'def'}},
  'Substitute':    {t:'Normal',c:'status',p:0,a:999,pp:10,nv:1,ef:{sobe:'def'}},
  'Double Team':   {t:'Normal',c:'status',p:0,a:999,pp:15,nv:1,ef:{sobe:'spe'}},
  'Conversion':    {t:'Normal',c:'status',p:0,a:999,pp:30,nv:1,ef:{sobe:'def'}},
  'Light Screen':  {t:'Psíquico',c:'status',p:0,a:999,pp:30,nv:1,ef:{sobe:'spd'}},
  'Reflect':       {t:'Psíquico',c:'status',p:0,a:999,pp:20,nv:1,ef:{sobe:'def'}},
  'Mist':          {t:'Gelo',c:'status',p:0,a:999,pp:30,nv:1,ef:{sobe:'spd'}},
  'Acid Armor':    {t:'Venenoso',c:'status',p:0,a:999,pp:20,nv:1,ef:{sobe:'def',forte:true}},
  /* Haze zera as alterações dos dois lados; aqui derruba o ataque de quem está na frente */
  'Haze':          {t:'Gelo',c:'status',p:0,a:999,pp:30,nv:1,ef:{baixa:'atk'}},
  'Smokescreen':   {t:'Normal',c:'status',p:0,a:100,pp:20,nv:1,ef:{baixa:'precisao'}},
  /* Whirlwind e Roar tiram o adversário do lugar; sem troca forçada, tiram o ritmo */
  'Whirlwind':     {t:'Normal',c:'status',p:0,a:85,pp:20,nv:1,ef:{baixa:'spe'}},
  'Roar':          {t:'Normal',c:'status',p:0,a:100,pp:20,nv:1,ef:{baixa:'spe'}},
  /* Disable trava um golpe; o mais perto que este motor faz é a confusão */
  'Disable':       {t:'Normal',c:'status',p:0,a:55,pp:20,nv:1,ef:{tipo:'confusao',chance:100}},
  'Lovely Kiss':   {t:'Normal',c:'status',p:0,a:75,pp:10,nv:1,ef:{tipo:'sono',chance:100}},
  /* Metronome sorteia um golpe; aqui ele sai sempre, e sai médio */
  'Metronome':     {t:'Normal',c:'esp',p:70,a:999,pp:10,nv:1},
  /* Transform copia o adversário; sem cópia, é a postura de quem imita */
  'Transform':     {t:'Normal',c:'status',p:0,a:999,pp:10,nv:1,ef:{sobe:'atk'}},
  'Teleport':      {t:'Psíquico',c:'status',p:0,a:999,pp:20,nv:1,ef:{sobe:'spe'}},
  'Mirror Move':   {t:'Voador',c:'status',p:0,a:999,pp:20,nv:1,ef:{sobe:'atk'}},
  'Splash':        {t:'Normal',c:'status',p:0,a:999,pp:40,nv:1},

  /* --- LUTADOR --- */
  'Rolling Kick':  {t:'Lutador',c:'fis',p:60,a:85,pp:15,nv:1,ef:{tipo:'recuo',chance:30}},
  'Jump Kick':     {t:'Lutador',c:'fis',p:70,a:95,pp:25,nv:1},
  'High Jump Kick':{t:'Lutador',c:'fis',p:85,a:90,pp:20,nv:1},
  'Counter':       {t:'Lutador',c:'fis',p:60,a:100,pp:20,nv:1},

  /* --- GRAMA --- */
  'Leech Seed':    {t:'Grama',c:'status',p:0,a:90,pp:10,nv:1,ef:{tipo:'veneno',chance:100}},
  'Spore':         {t:'Grama',c:'status',p:0,a:999,pp:15,nv:1,ef:{tipo:'sono',chance:100}},

  /* --- VENENOSO --- */
  'Poison Gas':    {t:'Venenoso',c:'status',p:0,a:55,pp:40,nv:1,ef:{tipo:'veneno',chance:100}},
  'Glare':         {t:'Normal',c:'status',p:0,a:75,pp:30,nv:1,ef:{tipo:'paralisia',chance:100}},

  /* --- ÁGUA --- */
  'Clamp':         {t:'Água',c:'fis',p:35,a:75,pp:10,nv:1,ef:{preso:true}},
  'Crabhammer':    {t:'Água',c:'fis',p:90,a:85,pp:10,nv:1,ef:{critico:true}},

  /* --- os que Johto trouxe para a tabela de aprendizado --- */
  'Flame Wheel':   {t:'Fogo',c:'fis',p:60,a:100,pp:25,nv:1,ef:{tipo:'queimadura',chance:10}},
  'Spark':         {t:'Elétrico',c:'fis',p:65,a:100,pp:20,nv:1,ef:{tipo:'paralisia',chance:30}},
  'Rollout':       {t:'Pedra',c:'fis',p:30,a:90,pp:20,nv:1,ef:{golpes:2}},
  'Rapid Spin':    {t:'Normal',c:'fis',p:20,a:100,pp:40,nv:1},
  'Present':       {t:'Normal',c:'fis',p:40,a:90,pp:15,nv:1},
  'Psywave':       {t:'Psíquico',c:'esp',p:0,a:80,pp:15,nv:1,ef:{nivel:true}},
  'Hidden Power':  {t:'Normal',c:'esp',p:60,a:100,pp:15,nv:1},
  /* Flail bate mais quanto menos HP sobra; aqui é só um golpe curto e forte */
  'Flail':         {t:'Normal',c:'fis',p:70,a:100,pp:15,nv:1},
  'Scary Face':    {t:'Normal',c:'status',p:0,a:90,pp:10,nv:1,ef:{baixa:'spe',forte:true}},
  'Foresight':     {t:'Normal',c:'status',p:0,a:100,pp:40,nv:1,ef:{baixa:'precisao'}},
  'Charm':         {t:'Normal',c:'status',p:0,a:100,pp:20,nv:1,ef:{baixa:'atk',forte:true}},
  'Swagger':       {t:'Normal',c:'status',p:0,a:90,pp:15,nv:1,ef:{tipo:'confusao',chance:100}},
  'Spider Web':    {t:'Inseto',c:'status',p:0,a:999,pp:10,nv:1,ef:{baixa:'spe'}},
  'Cotton Spore':  {t:'Grama',c:'status',p:0,a:85,pp:40,nv:1,ef:{baixa:'spe',forte:true}},
  'Synthesis':     {t:'Grama',c:'status',p:0,a:999,pp:5,nv:1,ef:{cura:0.5}},
  'Softboiled':    {t:'Normal',c:'status',p:0,a:999,pp:10,nv:1,ef:{cura:0.5}},
  'Safeguard':     {t:'Normal',c:'status',p:0,a:999,pp:25,nv:1,ef:{sobe:'spd'}},
  'Mirror Coat':   {t:'Psíquico',c:'esp',p:60,a:100,pp:20,nv:1},
  /* Sandstorm e Rain Dance mudam o tempo; sem clima, o que sobra é o estorvo */
  'Sandstorm':     {t:'Pedra',c:'status',p:0,a:999,pp:10,nv:1,ef:{clima:'areia'}},
  'Rain Dance':    {t:'Água',c:'status',p:0,a:999,pp:5,nv:1,ef:{clima:'chuva'}}
};

/* Golpes por tipo, prontos para montar learnsets */
const GOLPES_POR_TIPO = {};
for (const [nome,g] of Object.entries(GOLPES)){
  (GOLPES_POR_TIPO[g.t] = GOLPES_POR_TIPO[g.t] || []).push(nome);
}

/* Golpes iniciais genéricos que qualquer um pode ter */
const GOLPES_BASICOS = ['Tackle','Scratch','Pound','Growl','Leer','Tail Whip'];

/*
  Monta 4 golpes coerentes para uma espécie em um nível:
  - prioriza golpes do(s) tipo(s) da espécie (STAB)
  - respeita a categoria dominante (Ataque vs Ataque Especial)
  - completa com Normal e com um golpe de status
*/
/* Quanto vale um golpe de status na mão da IA/do moveset */
function utilidadeStatus(g){
  const e = g.ef || {};
  if (e.tipo === 'sono') return 95;
  if (e.tipo === 'paralisia') return 85;
  if (e.grave) return 80;
  if (e.sobe && e.forte) return 75;
  if (e.tipo === 'veneno') return 70;
  if (e.tipo === 'confusao') return 65;
  if (e.cura) return 55;
  if (e.baixa && e.forte) return 50;
  if (e.sobe) return 45;
  return 35;
}

function montarGolpes(dexId, nivel){
  /* A tabela de aprendizado manda: se a espécie tem learnset, os
     golpes são os dela, no nível dela. O gerador abaixo só existe
     para espécie sem tabela — hoje, nenhuma. */
  if (typeof golpesPorNivel === 'function'){
    const daTabela = golpesPorNivel(dexId, nivel);
    if (daTabela){
      const assin = assinaturaDe(dexId, nivel);
      const nomes = assin.concat(daTabela.filter(n => !assin.includes(n))).slice(0, 4);
      return nomes.map(n => ({nome:n, pp:GOLPES[n].pp, ppMax:GOLPES[n].pp}));
    }
  }
  const esp = DEX[dexId];
  const fisico = esp.base.atk >= esp.base.spa;

  // poder efetivo: golpes de dano fixo/por nível contam como poder médio
  const poderEf = (g) => {
    if (g.c === 'status') return 0;
    if (g.p > 0) return g.p;
    if (g.ef && (g.ef.nivel || g.ef.fixo)) return 55;
    return 40;
  };

  const nota = (nome, g, stab) => {
    if (g.c === 'status') return utilidadeStatus(g) + (stab ? 10 : 0);
    let s = poderEf(g) * (g.a >= 999 ? 1 : g.a / 100);      // poder ponderado pela precisão
    if (stab) s *= 1.5;                                      // STAB pesa de verdade
    s *= (g.c === (fisico ? 'fis' : 'esp')) ? 1.25 : 0.55;   // usa o stat bom do bicho
    if (g.ef && g.ef.golpes) s *= g.ef.golpes * 0.8;
    if (g.p >= 110 && nivel < 42) s *= 0.35;                 // nada de Hyper Beam cedo
    if (g.ef && g.ef.recarga && nivel < 50) s *= 0.5;
    return s;
  };

  // hash estável: o mesmo bicho sempre aprende os mesmos golpes raros
  const hash = (str) => { let h = dexId * 131; for (let i=0;i<str.length;i++) h = (h*31 + str.charCodeAt(i)) % 100003; return h; };
  const disponivel = (nome) => {
    const g = GOLPES[nome];
    if (g.nv > nivel) return false;
    if (g.soPara && !g.soPara.includes(dexId)) return false;          // golpe de linhagem
    if (g.raro && !esp.tipos.includes(g.t) && hash(nome) % 5 !== 0) return false;  // raro, mas não pra todo mundo
    return true;
  };
  const lista = (tipo) => (GOLPES_POR_TIPO[tipo] || []).filter(disponivel);

  const escolhidos = [];
  const vistos = new Set();
  const por = (nome) => { if (nome && !vistos.has(nome) && escolhidos.length < 4){ vistos.add(nome); escolhidos.push(nome); } };

  // 0) golpe de assinatura: quem tem um, sempre entra com ele
  for (const [nome, g] of Object.entries(GOLPES))
    if (g.soPara && g.soPara.includes(dexId) && g.nv <= nivel) por(nome);

  // 1) garante o melhor golpe de dano com STAB de CADA tipo da espécie
  for (const tipo of esp.tipos){
    const melhor = lista(tipo)
      .filter(n => GOLPES[n].c !== 'status')
      .sort((a,b) => nota(b,GOLPES[b],true) - nota(a,GOLPES[a],true))[0];
    por(melhor);
  }

  // 2) preenche com o melhor restante (STAB ou Normal), sem status ainda
  const resto = [];
  for (const tipo of [...esp.tipos, 'Normal']){
    for (const n of lista(tipo)){
      if (GOLPES[n].c === 'status' || vistos.has(n)) continue;
      resto.push({n, s: nota(n, GOLPES[n], esp.tipos.includes(GOLPES[n].t))});
    }
  }
  resto.sort((a,b) => b.s - a.s);
  while (escolhidos.length < 3 && resto.length) por(resto.shift().n);

  // 3) um golpe de status, se houver espaço e nível
  if (escolhidos.length < 4 && nivel >= 8){
    const status = [];
    for (const tipo of [...esp.tipos, 'Normal']){
      for (const n of lista(tipo)){
        if (GOLPES[n].c !== 'status' || vistos.has(n)) continue;
        status.push({n, s: nota(n, GOLPES[n], true)});
      }
    }
    status.sort((a,b) => b.s - a.s);
    if (status.length) por(status[0].n);
  }

  // 4) completa o que faltar
  while (escolhidos.length < 4 && resto.length) por(resto.shift().n);
  if (!escolhidos.length) por('Tackle');

  return escolhidos.map(n => ({nome:n, pp:GOLPES[n].pp, ppMax:GOLPES[n].pp}));
}
