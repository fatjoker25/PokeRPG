/* ============================================================
   APRENDIZADO POR NÍVEL — o que cada espécie aprende, e quando
   1ª Geração (Red/Blue) para 001–151.
   Formato: 'nível Golpe, nível Golpe, …' em ordem crescente.
   Quem entra em combate leva os quatro últimos que já aprendeu,
   exatamente como nos jogos.
   ============================================================ */
const APRENDE_RAW = {
1:'1 Tackle,1 Growl,7 Leech Seed,13 Vine Whip,20 Poison Powder,27 Razor Leaf,34 Growth,41 Sleep Powder,48 Solar Beam',
2:'1 Tackle,1 Growl,1 Leech Seed,7 Leech Seed,13 Vine Whip,22 Poison Powder,30 Razor Leaf,38 Growth,46 Sleep Powder,54 Solar Beam',
3:'1 Tackle,1 Growl,1 Leech Seed,1 Vine Whip,7 Leech Seed,13 Vine Whip,22 Poison Powder,30 Razor Leaf,43 Growth,55 Sleep Powder,65 Solar Beam',
4:'1 Scratch,1 Growl,9 Ember,15 Leer,22 Rage,30 Slash,38 Flamethrower,46 Fire Spin',
5:'1 Scratch,1 Growl,1 Ember,9 Ember,15 Leer,24 Rage,33 Slash,42 Flamethrower,56 Fire Spin',
6:'1 Scratch,1 Growl,1 Ember,1 Leer,9 Ember,15 Leer,24 Rage,36 Slash,46 Flamethrower,55 Fire Spin',
7:'1 Tackle,1 Tail Whip,8 Bubble,15 Water Gun,22 Bite,28 Withdraw,35 Skull Bash,42 Hydro Pump',
8:'1 Tackle,1 Tail Whip,1 Bubble,8 Bubble,15 Water Gun,24 Bite,31 Withdraw,39 Skull Bash,47 Hydro Pump',
9:'1 Tackle,1 Tail Whip,1 Bubble,1 Water Gun,8 Bubble,15 Water Gun,24 Bite,31 Withdraw,42 Skull Bash,52 Hydro Pump',
10:'1 Tackle,1 String Shot',
11:'1 Harden,7 Harden',
12:'1 Confusion,12 Confusion,15 Poison Powder,16 Stun Spore,17 Sleep Powder,21 Supersonic,26 Whirlwind,32 Psybeam',
13:'1 Poison Sting,1 String Shot',
14:'1 Harden,7 Harden',
15:'1 Fury Attack,12 Fury Attack,16 Focus Energy,20 Twineedle,25 Rage,30 Pin Missile,35 Agility',
16:'1 Gust,5 Sand Attack,12 Quick Attack,19 Whirlwind,28 Wing Attack,36 Agility,44 Mirror Move',
17:'1 Gust,1 Sand Attack,5 Sand Attack,12 Quick Attack,21 Whirlwind,31 Wing Attack,40 Agility,49 Mirror Move',
18:'1 Gust,1 Sand Attack,1 Quick Attack,5 Sand Attack,12 Quick Attack,21 Whirlwind,31 Wing Attack,44 Agility,54 Mirror Move',
19:'1 Tackle,1 Tail Whip,7 Quick Attack,14 Hyper Fang,23 Focus Energy,34 Super Fang',
20:'1 Tackle,1 Tail Whip,1 Quick Attack,7 Quick Attack,14 Hyper Fang,27 Focus Energy,41 Super Fang',
21:'1 Peck,1 Growl,9 Leer,15 Fury Attack,22 Mirror Move,29 Drill Peck,36 Agility',
22:'1 Peck,1 Growl,1 Leer,9 Leer,15 Fury Attack,25 Mirror Move,34 Drill Peck,43 Agility',
23:'1 Wrap,1 Leer,10 Poison Sting,17 Bite,24 Glare,31 Screech,38 Acid',
24:'1 Wrap,1 Leer,1 Poison Sting,10 Poison Sting,17 Bite,27 Glare,36 Screech,47 Acid',
25:'1 Thunder Shock,1 Growl,9 Thunder Wave,16 Quick Attack,26 Swift,33 Agility,43 Thunder',
26:'1 Thunder Shock,1 Thunder Wave,1 Quick Attack,1 Swift,1 Agility,1 Thunder',
27:'1 Scratch,10 Sand Attack,17 Slash,24 Poison Sting,31 Swift,38 Fury Swipes',
28:'1 Scratch,1 Sand Attack,10 Sand Attack,17 Slash,27 Poison Sting,36 Swift,47 Fury Swipes',
29:'1 Growl,1 Tackle,8 Scratch,14 Double Kick,21 Poison Sting,29 Tail Whip,36 Bite,43 Fury Swipes',
30:'1 Growl,1 Tackle,1 Scratch,8 Scratch,14 Double Kick,23 Poison Sting,32 Tail Whip,41 Bite,50 Fury Swipes',
31:'1 Tackle,1 Scratch,1 Tail Whip,1 Double Kick,23 Body Slam',
32:'1 Leer,1 Tackle,8 Horn Attack,14 Double Kick,21 Poison Sting,29 Focus Energy,36 Fury Attack,43 Horn Drill',
33:'1 Leer,1 Tackle,1 Horn Attack,8 Horn Attack,14 Double Kick,23 Poison Sting,32 Focus Energy,41 Fury Attack,50 Horn Drill',
34:'1 Tackle,1 Horn Attack,1 Poison Sting,1 Double Kick,23 Thrash',
35:'1 Pound,1 Growl,13 Sing,18 Double Slap,24 Minimize,31 Metronome,39 Defense Curl,48 Light Screen',
36:'1 Pound,1 Growl,1 Sing,1 Double Slap,1 Minimize,1 Metronome,1 Defense Curl,1 Light Screen',
37:'1 Ember,1 Tail Whip,16 Quick Attack,21 Roar,28 Confuse Ray,35 Flamethrower,42 Fire Spin',
38:'1 Ember,1 Tail Whip,1 Quick Attack,1 Roar,1 Confuse Ray,43 Flamethrower',
39:'1 Sing,9 Pound,14 Disable,19 Defense Curl,24 Double Slap,29 Rest,34 Body Slam,39 Double-Edge',
40:'1 Sing,1 Pound,1 Disable,1 Defense Curl,1 Double Slap,1 Rest,1 Body Slam,1 Double-Edge',
41:'1 Leech Life,10 Supersonic,15 Bite,21 Confuse Ray,28 Wing Attack,36 Haze',
42:'1 Leech Life,1 Screech,1 Bite,10 Screech,15 Bite,21 Confuse Ray,32 Wing Attack,43 Haze',
43:'1 Absorb,15 Poison Powder,17 Stun Spore,19 Sleep Powder,24 Acid,33 Petal Dance,46 Solar Beam',
44:'1 Absorb,1 Poison Powder,1 Stun Spore,15 Poison Powder,17 Stun Spore,19 Sleep Powder,28 Acid,38 Petal Dance,52 Solar Beam',
45:'1 Absorb,1 Stun Spore,1 Sleep Powder,1 Acid,1 Petal Dance,1 Solar Beam',
46:'1 Scratch,13 Stun Spore,20 Leech Life,27 Spore,34 Slash,41 Growth',
47:'1 Scratch,1 Stun Spore,1 Leech Life,13 Stun Spore,20 Leech Life,30 Spore,39 Slash,48 Growth',
48:'1 Tackle,1 Disable,24 Poison Powder,27 Leech Life,30 Stun Spore,35 Psybeam,38 Sleep Powder,43 Psychic',
49:'1 Tackle,1 Disable,1 Poison Powder,1 Leech Life,24 Poison Powder,27 Leech Life,30 Stun Spore,38 Psybeam,43 Sleep Powder,50 Psychic',
50:'1 Scratch,15 Growl,19 Dig,24 Sand Attack,31 Slash,40 Earthquake',
51:'1 Scratch,1 Growl,1 Dig,15 Growl,19 Dig,24 Sand Attack,35 Slash,47 Earthquake',
52:'1 Scratch,1 Growl,12 Bite,17 Pay Day,24 Screech,33 Fury Swipes,44 Slash',
53:'1 Scratch,1 Growl,1 Bite,12 Bite,17 Pay Day,24 Screech,37 Fury Swipes,51 Slash',
54:'1 Scratch,28 Tail Whip,31 Disable,36 Confusion,43 Fury Swipes,52 Hydro Pump',
55:'1 Scratch,1 Tail Whip,1 Disable,28 Tail Whip,31 Disable,39 Confusion,48 Fury Swipes,59 Hydro Pump',
56:'1 Scratch,1 Leer,15 Karate Chop,21 Fury Swipes,27 Focus Energy,33 Seismic Toss,39 Thrash',
57:'1 Scratch,1 Leer,1 Karate Chop,1 Fury Swipes,15 Karate Chop,21 Fury Swipes,27 Focus Energy,37 Seismic Toss,46 Thrash',
58:'1 Bite,1 Roar,18 Ember,23 Leer,30 Take Down,39 Agility,50 Flamethrower',
59:'1 Bite,1 Roar,1 Ember,1 Leer,1 Take Down,1 Agility,1 Flamethrower',
60:'1 Bubble,16 Hypnosis,19 Water Gun,25 Double Slap,31 Body Slam,38 Amnesia,45 Hydro Pump',
61:'1 Bubble,1 Hypnosis,1 Water Gun,16 Hypnosis,19 Water Gun,26 Double Slap,34 Body Slam,43 Amnesia,51 Hydro Pump',
62:'1 Hypnosis,1 Water Gun,1 Double Slap,1 Body Slam,1 Amnesia,1 Hydro Pump',
63:'1 Teleport',
64:'1 Teleport,1 Confusion,16 Confusion,20 Disable,27 Psybeam,31 Recover,38 Psychic,42 Reflect',
65:'1 Teleport,1 Confusion,1 Disable,16 Confusion,20 Disable,27 Psybeam,31 Recover,38 Psychic,42 Reflect',
66:'1 Karate Chop,20 Low Kick,25 Leer,32 Focus Energy,39 Seismic Toss,46 Submission',
67:'1 Karate Chop,1 Low Kick,1 Leer,20 Low Kick,25 Leer,36 Focus Energy,44 Seismic Toss,52 Submission',
68:'1 Karate Chop,1 Low Kick,1 Leer,1 Focus Energy,20 Low Kick,25 Leer,36 Focus Energy,44 Seismic Toss,52 Submission',
69:'1 Vine Whip,1 Growth,13 Wrap,15 Poison Powder,18 Sleep Powder,21 Stun Spore,26 Acid,33 Razor Leaf,42 Slam',
70:'1 Vine Whip,1 Growth,1 Wrap,13 Wrap,15 Poison Powder,18 Sleep Powder,23 Stun Spore,29 Acid,38 Razor Leaf,49 Slam',
71:'1 Vine Whip,1 Sleep Powder,1 Stun Spore,1 Acid,1 Razor Leaf,1 Slam',
72:'1 Acid,7 Supersonic,13 Wrap,18 Poison Sting,22 Water Gun,27 Constrict,33 Barrier,40 Screech,48 Hydro Pump',
73:'1 Acid,1 Supersonic,1 Wrap,7 Supersonic,13 Wrap,18 Poison Sting,22 Water Gun,27 Constrict,35 Barrier,43 Screech,50 Hydro Pump',
74:'1 Tackle,11 Defense Curl,16 Rock Throw,21 Self-Destruct,26 Harden,31 Earthquake,36 Explosion',
75:'1 Tackle,1 Defense Curl,11 Defense Curl,16 Rock Throw,21 Self-Destruct,29 Harden,36 Earthquake,43 Explosion',
76:'1 Tackle,1 Defense Curl,1 Rock Throw,11 Defense Curl,16 Rock Throw,21 Self-Destruct,29 Harden,36 Earthquake,43 Explosion',
77:'1 Ember,30 Tail Whip,32 Stomp,35 Growl,39 Fire Spin,43 Take Down,48 Agility',
78:'1 Ember,1 Tail Whip,1 Stomp,1 Growl,30 Tail Whip,32 Stomp,35 Growl,39 Fire Spin,47 Take Down,55 Agility',
79:'1 Confusion,18 Disable,22 Headbutt,27 Growl,33 Water Gun,40 Amnesia,48 Psychic',
80:'1 Confusion,1 Disable,1 Headbutt,18 Disable,22 Headbutt,27 Growl,33 Water Gun,37 Withdraw,44 Amnesia,55 Psychic',
81:'1 Tackle,21 Sonic Boom,25 Thunder Shock,29 Supersonic,35 Thunder Wave,41 Swift,47 Screech',
82:'1 Tackle,1 Sonic Boom,1 Thunder Shock,21 Sonic Boom,25 Thunder Shock,29 Supersonic,38 Thunder Wave,46 Swift,54 Screech',
83:'1 Peck,1 Sand Attack,7 Leer,15 Fury Attack,23 Swords Dance,31 Agility,39 Slash',
84:'1 Peck,1 Growl,20 Fury Attack,24 Drill Peck,30 Rage,36 Tri Attack,40 Agility',
85:'1 Peck,1 Growl,1 Fury Attack,20 Fury Attack,24 Drill Peck,34 Rage,43 Tri Attack,51 Agility',
86:'1 Headbutt,30 Growl,35 Aurora Beam,40 Rest,45 Take Down,50 Ice Beam',
87:'1 Headbutt,1 Growl,1 Aurora Beam,30 Growl,35 Aurora Beam,44 Rest,50 Take Down,56 Ice Beam',
88:'1 Pound,1 Disable,30 Poison Gas,33 Minimize,37 Sludge,42 Harden,48 Screech,55 Acid Armor',
89:'1 Pound,1 Disable,1 Poison Gas,30 Poison Gas,33 Minimize,37 Sludge,45 Harden,53 Screech,60 Acid Armor',
90:'1 Tackle,1 Withdraw,18 Supersonic,23 Clamp,30 Aurora Beam,39 Leer,50 Ice Beam',
91:'1 Tackle,1 Withdraw,1 Supersonic,1 Clamp,1 Aurora Beam,50 Spike Cannon',
92:'1 Lick,1 Confuse Ray,1 Night Shade,27 Hypnosis,35 Dream Eater',
93:'1 Lick,1 Confuse Ray,1 Night Shade,29 Hypnosis,38 Dream Eater',
94:'1 Lick,1 Confuse Ray,1 Night Shade,29 Hypnosis,38 Dream Eater',
95:'1 Tackle,1 Screech,15 Bind,19 Rock Throw,25 Rage,33 Slam,43 Harden',
96:'1 Pound,1 Hypnosis,12 Disable,17 Confusion,24 Headbutt,29 Poison Gas,32 Psychic,37 Meditate',
97:'1 Pound,1 Hypnosis,1 Disable,1 Confusion,12 Disable,17 Confusion,24 Headbutt,33 Poison Gas,37 Psychic,43 Meditate',
98:'1 Bubble,1 Leer,20 Vice Grip,25 Guillotine,30 Stomp,35 Crabhammer,40 Harden',
99:'1 Bubble,1 Leer,1 Vice Grip,20 Vice Grip,25 Guillotine,34 Stomp,42 Crabhammer,49 Harden',
100:'1 Tackle,1 Screech,17 Sonic Boom,22 Self-Destruct,29 Light Screen,36 Swift,43 Explosion',
101:'1 Tackle,1 Screech,1 Sonic Boom,17 Sonic Boom,22 Self-Destruct,29 Light Screen,40 Swift,50 Explosion',
102:'1 Barrage,1 Hypnosis,25 Reflect,28 Leech Seed,32 Stun Spore,37 Poison Powder,42 Solar Beam,48 Sleep Powder',
103:'1 Barrage,1 Hypnosis,1 Stun Spore,1 Solar Beam,28 Stomp',
104:'1 Bone Club,1 Growl,25 Leer,31 Focus Energy,38 Thrash,43 Bonemerang,46 Rage',
105:'1 Bone Club,1 Growl,1 Leer,25 Leer,33 Focus Energy,41 Thrash,48 Bonemerang,55 Rage',
106:'1 Double Kick,1 Meditate,33 Rolling Kick,38 Jump Kick,43 Focus Energy,48 High Jump Kick,53 Mega Kick',
107:'1 Comet Punch,1 Agility,33 Fire Punch,38 Ice Punch,43 Thunder Punch,48 Mega Punch,53 Counter',
108:'1 Wrap,1 Supersonic,7 Stomp,15 Disable,23 Defense Curl,31 Slam,39 Screech',
109:'1 Smog,1 Smokescreen,32 Sludge,37 Self-Destruct,40 Haze,45 Explosion',
110:'1 Smog,1 Smokescreen,1 Sludge,32 Sludge,39 Self-Destruct,43 Haze,49 Explosion',
111:'1 Horn Attack,30 Stomp,35 Tail Whip,40 Fury Attack,45 Horn Drill,50 Take Down',
112:'1 Horn Attack,1 Stomp,1 Tail Whip,1 Fury Attack,30 Stomp,35 Tail Whip,40 Fury Attack,48 Horn Drill,55 Take Down',
113:'1 Pound,1 Double Slap,24 Sing,30 Growl,38 Minimize,44 Defense Curl,48 Light Screen,54 Double-Edge',
114:'1 Constrict,1 Bind,29 Absorb,32 Poison Powder,36 Stun Spore,39 Sleep Powder,45 Slam,49 Growth',
115:'1 Comet Punch,1 Rage,26 Bite,31 Tail Whip,36 Mega Punch,41 Leer,46 Dizzy Punch',
116:'1 Bubble,19 Smokescreen,24 Leer,30 Water Gun,37 Agility,45 Hydro Pump',
117:'1 Bubble,1 Smokescreen,1 Leer,19 Smokescreen,24 Leer,30 Water Gun,41 Agility,52 Hydro Pump',
118:'1 Peck,1 Tail Whip,19 Supersonic,24 Horn Attack,30 Fury Attack,37 Waterfall,45 Horn Drill,54 Agility',
119:'1 Peck,1 Tail Whip,1 Supersonic,19 Supersonic,24 Horn Attack,30 Fury Attack,39 Waterfall,48 Horn Drill,54 Agility',
120:'1 Tackle,17 Water Gun,22 Harden,27 Recover,32 Swift,37 Minimize,42 Light Screen,47 Hydro Pump',
121:'1 Tackle,1 Water Gun,1 Harden,1 Recover,1 Swift,1 Minimize,1 Light Screen,1 Hydro Pump',
122:'1 Confusion,1 Barrier,15 Confusion,23 Light Screen,31 Double Slap,39 Meditate,47 Substitute',
123:'1 Quick Attack,17 Leer,20 Focus Energy,24 Double Team,29 Slash,35 Swords Dance,42 Agility',
124:'1 Pound,1 Lovely Kiss,18 Lick,23 Double Slap,31 Ice Punch,39 Body Slam,47 Thrash,58 Blizzard',
125:'1 Quick Attack,1 Leer,34 Thunder Shock,37 Screech,42 Thunder Punch,49 Light Screen,54 Thunder',
126:'1 Ember,36 Leer,39 Confuse Ray,43 Fire Punch,48 Smokescreen,52 Smog,55 Flamethrower',
127:'1 Vice Grip,25 Seismic Toss,30 Guillotine,36 Focus Energy,43 Harden,49 Slash,54 Swords Dance',
128:'1 Tackle,21 Stomp,28 Tail Whip,35 Leer,44 Rage,51 Take Down',
129:'1 Splash,15 Tackle',
130:'1 Bite,20 Dragon Rage,25 Leer,32 Hydro Pump,41 Hyper Beam',
131:'1 Water Gun,1 Growl,16 Sing,20 Mist,25 Body Slam,31 Confuse Ray,38 Ice Beam,46 Hydro Pump',
132:'1 Transform',
133:'1 Tackle,1 Sand Attack,27 Quick Attack,31 Tail Whip,37 Bite,45 Take Down',
134:'1 Tackle,1 Sand Attack,1 Quick Attack,1 Water Gun,27 Quick Attack,31 Water Gun,37 Tail Whip,42 Bite,47 Acid Armor,52 Haze,57 Mist,62 Hydro Pump',
135:'1 Tackle,1 Sand Attack,1 Quick Attack,1 Thunder Shock,27 Quick Attack,31 Thunder Shock,37 Tail Whip,42 Thunder Wave,47 Double Kick,52 Agility,57 Pin Missile,62 Thunder',
136:'1 Tackle,1 Sand Attack,1 Quick Attack,1 Ember,27 Quick Attack,31 Ember,37 Tail Whip,42 Bite,47 Leer,52 Fire Spin,57 Rage,62 Flamethrower',
137:'1 Tackle,1 Sharpen,1 Conversion,23 Psybeam,28 Recover,35 Agility,42 Tri Attack',
138:'1 Water Gun,1 Withdraw,34 Horn Attack,39 Leer,46 Spike Cannon,53 Hydro Pump',
139:'1 Water Gun,1 Withdraw,1 Horn Attack,34 Horn Attack,39 Leer,44 Spike Cannon,49 Hydro Pump',
140:'1 Scratch,1 Harden,34 Absorb,39 Slash,44 Leer,49 Hydro Pump',
141:'1 Scratch,1 Harden,1 Absorb,34 Absorb,39 Slash,46 Leer,53 Hydro Pump',
142:'1 Wing Attack,33 Supersonic,38 Bite,45 Take Down,54 Hyper Beam',
143:'1 Headbutt,1 Amnesia,1 Rest,35 Body Slam,41 Harden,48 Double-Edge,56 Hyper Beam',
144:'1 Peck,1 Ice Beam,51 Blizzard,55 Agility,60 Mist',
145:'1 Thunder Shock,1 Drill Peck,51 Thunder,55 Agility,60 Light Screen',
146:'1 Peck,1 Fire Spin,51 Leer,55 Agility,60 Sky Attack',
147:'1 Wrap,1 Leer,10 Thunder Wave,20 Agility,30 Slam,40 Dragon Rage,50 Hyper Beam',
148:'1 Wrap,1 Leer,1 Thunder Wave,10 Thunder Wave,20 Agility,35 Slam,45 Dragon Rage,55 Hyper Beam',
149:'1 Wrap,1 Leer,1 Thunder Wave,1 Agility,10 Thunder Wave,20 Agility,35 Slam,45 Dragon Rage,60 Hyper Beam',
150:'1 Confusion,1 Disable,1 Swift,63 Barrier,66 Psychic,70 Recover,75 Mist,81 Amnesia',
151:'1 Pound,10 Transform,20 Mega Punch,30 Metronome,40 Psychic',

/* ---- 2ª Geração (Gold/Silver/Crystal), 152–251 ---- */
152:'1 Tackle,1 Growl,8 Razor Leaf,12 Reflect,15 Poison Powder,22 Synthesis,29 Body Slam,36 Light Screen,43 Safeguard,50 Solar Beam',
153:'1 Tackle,1 Growl,1 Razor Leaf,8 Razor Leaf,12 Reflect,15 Poison Powder,23 Synthesis,31 Body Slam,39 Light Screen,47 Safeguard,55 Solar Beam',
154:'1 Tackle,1 Growl,1 Razor Leaf,1 Reflect,12 Reflect,15 Poison Powder,23 Synthesis,31 Body Slam,41 Light Screen,51 Safeguard,61 Solar Beam',
155:'1 Tackle,1 Leer,6 Smokescreen,12 Ember,19 Quick Attack,27 Flame Wheel,36 Swift,46 Flamethrower',
156:'1 Tackle,1 Leer,1 Smokescreen,6 Smokescreen,12 Ember,21 Quick Attack,31 Flame Wheel,42 Swift,54 Flamethrower',
157:'1 Tackle,1 Leer,1 Smokescreen,1 Ember,12 Ember,21 Quick Attack,31 Flame Wheel,45 Swift,60 Flamethrower',
158:'1 Scratch,1 Leer,7 Rage,13 Water Gun,20 Bite,27 Scary Face,35 Slash,43 Screech,52 Hydro Pump',
159:'1 Scratch,1 Leer,1 Rage,7 Rage,13 Water Gun,21 Bite,28 Scary Face,37 Slash,45 Screech,55 Hydro Pump',
160:'1 Scratch,1 Leer,1 Rage,1 Water Gun,13 Water Gun,21 Bite,28 Scary Face,38 Slash,47 Screech,58 Hydro Pump',
161:'1 Scratch,1 Foresight,7 Defense Curl,13 Quick Attack,19 Fury Swipes,25 Slam,31 Rest,37 Amnesia',
162:'1 Scratch,1 Foresight,1 Defense Curl,7 Defense Curl,13 Quick Attack,21 Fury Swipes,29 Slam,37 Rest,45 Amnesia',
163:'1 Tackle,6 Growl,11 Foresight,16 Peck,22 Hypnosis,28 Reflect,34 Take Down,48 Dream Eater',
164:'1 Tackle,1 Growl,1 Foresight,11 Foresight,16 Peck,25 Hypnosis,33 Reflect,41 Take Down,57 Dream Eater',
165:'1 Tackle,8 Supersonic,15 Comet Punch,22 Light Screen,29 Swift,36 Agility,43 Double-Edge',
166:'1 Tackle,1 Supersonic,1 Comet Punch,8 Supersonic,15 Comet Punch,24 Light Screen,33 Swift,42 Agility,51 Double-Edge',
167:'1 Poison Sting,1 String Shot,6 Scary Face,11 Constrict,17 Night Shade,23 Leech Life,30 Fury Swipes,37 Spider Web,45 Agility',
168:'1 Poison Sting,1 String Shot,1 Scary Face,11 Constrict,17 Night Shade,25 Leech Life,34 Fury Swipes,43 Spider Web,53 Agility',
169:'1 Screech,1 Leech Life,1 Supersonic,1 Bite,11 Supersonic,16 Bite,21 Confuse Ray,33 Wing Attack,42 Haze',
170:'1 Bubble,13 Thunder Wave,17 Supersonic,25 Flail,29 Water Gun,37 Confuse Ray,41 Spark,49 Hydro Pump',
171:'1 Bubble,1 Thunder Wave,1 Supersonic,17 Supersonic,27 Flail,33 Water Gun,43 Confuse Ray,49 Spark,59 Hydro Pump',
172:'1 Thunder Shock,1 Charm,6 Tail Whip,8 Thunder Wave,11 Swift',
173:'1 Pound,1 Charm,8 Sing,13 Metronome',
174:'1 Sing,1 Charm,4 Defense Curl,9 Pound,14 Double Slap',
175:'1 Growl,1 Charm,7 Metronome,18 Swift,25 Safeguard,31 Double-Edge',
176:'1 Growl,1 Charm,1 Metronome,7 Metronome,18 Swift,25 Light Screen,31 Safeguard,38 Double-Edge',
177:'1 Peck,10 Night Shade,20 Teleport,30 Psybeam,40 Confuse Ray,50 Psychic',
178:'1 Peck,1 Night Shade,1 Teleport,20 Teleport,35 Psybeam,50 Confuse Ray,65 Psychic',
179:'1 Tackle,9 Growl,16 Thunder Shock,23 Thunder Wave,30 Cotton Spore,37 Light Screen,44 Thunder',
180:'1 Tackle,1 Growl,1 Thunder Shock,18 Thunder Shock,27 Thunder Wave,36 Cotton Spore,45 Light Screen,54 Thunder',
181:'1 Tackle,1 Growl,1 Thunder Shock,1 Thunder Punch,18 Thunder Shock,27 Thunder Wave,30 Thunder Punch,42 Cotton Spore,57 Light Screen,72 Thunder',
182:'1 Absorb,1 Stun Spore,1 Acid,1 Petal Dance,55 Solar Beam',
183:'1 Tackle,3 Defense Curl,6 Tail Whip,10 Water Gun,21 Bubble Beam,28 Double-Edge',
184:'1 Tackle,1 Defense Curl,1 Tail Whip,1 Water Gun,10 Water Gun,24 Bubble Beam,33 Double-Edge,45 Hydro Pump',
185:'1 Rock Throw,1 Harden,9 Flail,17 Low Kick,25 Rock Slide,33 Faint Attack,41 Slam,49 Double-Edge',
186:'1 Water Gun,1 Hypnosis,1 Double Slap,1 Amnesia,35 Body Slam,51 Hydro Pump',
187:'1 Splash,10 Synthesis,13 Tail Whip,15 Tackle,20 Poison Powder,22 Stun Spore,24 Sleep Powder,30 Leech Seed,40 Mega Drain',
188:'1 Splash,1 Synthesis,1 Tail Whip,15 Tackle,22 Poison Powder,25 Stun Spore,28 Sleep Powder,35 Leech Seed,47 Mega Drain',
189:'1 Splash,1 Synthesis,1 Tail Whip,15 Tackle,22 Poison Powder,25 Stun Spore,28 Sleep Powder,38 Leech Seed,53 Mega Drain',
190:'1 Scratch,6 Tail Whip,13 Sand Attack,18 Double Team,25 Fury Swipes,31 Swift,38 Screech,46 Agility',
191:'1 Absorb,4 Growth,10 Mega Drain,19 Leech Seed,31 Razor Leaf,46 Solar Beam',
192:'1 Absorb,1 Growth,10 Mega Drain,19 Leech Seed,31 Razor Leaf,46 Solar Beam,50 Petal Dance',
193:'1 Tackle,7 Foresight,13 Quick Attack,19 Double Team,25 Sonic Boom,31 Agility,37 Supersonic,43 Wing Attack,49 Screech',
194:'1 Water Gun,11 Tail Whip,21 Slam,31 Amnesia,41 Earthquake',
195:'1 Water Gun,1 Tail Whip,11 Tail Whip,23 Slam,35 Amnesia,47 Earthquake',
196:'1 Tackle,1 Tail Whip,1 Sand Attack,8 Sand Attack,16 Confusion,23 Quick Attack,30 Swift,36 Psybeam,42 Psychic,47 Recover',
197:'1 Tackle,1 Tail Whip,1 Sand Attack,8 Sand Attack,16 Pursuit,23 Quick Attack,30 Confuse Ray,36 Faint Attack,42 Screech,47 Rest',
198:'1 Peck,1 Bite,9 Pursuit,14 Haze,22 Night Shade,27 Faint Attack,35 Screech,40 Whirlwind',
199:'1 Confusion,1 Disable,1 Headbutt,20 Water Gun,29 Growl,35 Amnesia,41 Psychic',
200:'1 Growl,6 Psywave,11 Screech,17 Confuse Ray,23 Night Shade,30 Psybeam,37 Shadow Ball,45 Dream Eater',
201:'1 Hidden Power',
202:'1 Counter,1 Safeguard,1 Amnesia',
203:'1 Tackle,1 Growl,7 Confusion,13 Stomp,20 Agility,28 Double Team,36 Psybeam,45 Crunch',
204:'1 Tackle,1 Harden,9 Self-Destruct,17 Take Down,25 Rapid Spin,31 Screech,39 Explosion,45 Double-Edge',
205:'1 Tackle,1 Harden,1 Self-Destruct,17 Take Down,23 Rapid Spin,39 Iron Tail,43 Explosion,49 Double-Edge',
206:'1 Rage,11 Defense Curl,14 Glare,21 Pursuit,28 Screech,31 Rollout,41 Take Down',
207:'1 Poison Sting,6 Sand Attack,13 Harden,20 Quick Attack,28 Faint Attack,36 Slash,44 Screech,52 Guillotine',
208:'1 Tackle,1 Screech,1 Bind,1 Rock Throw,19 Rock Throw,25 Rage,33 Harden,43 Iron Tail',
209:'1 Tackle,1 Scary Face,1 Tail Whip,1 Charm,13 Bite,19 Lick,25 Roar,31 Rage,37 Take Down,43 Crunch',
210:'1 Tackle,1 Scary Face,1 Tail Whip,1 Charm,13 Bite,19 Lick,28 Roar,37 Rage,46 Take Down,55 Crunch',
211:'1 Tackle,10 Poison Sting,10 Harden,19 Minimize,28 Water Gun,37 Pin Missile,46 Take Down',
212:'1 Quick Attack,1 Leer,1 Focus Energy,20 Focus Energy,24 Pursuit,35 Agility,41 Metal Claw,47 Swords Dance',
213:'1 Constrict,9 Withdraw,14 Wrap,23 Screech,28 Safeguard,37 Rollout,42 Rest',
214:'1 Tackle,1 Leer,6 Horn Attack,19 Fury Attack,27 Counter,35 Megahorn,43 Double-Edge',
215:'1 Scratch,1 Leer,9 Quick Attack,17 Screech,25 Faint Attack,33 Fury Swipes,41 Agility,49 Slash,57 Beat Up',
216:'1 Scratch,8 Lick,15 Fury Swipes,22 Faint Attack,29 Rest,36 Slash,50 Thrash',
217:'1 Scratch,1 Lick,15 Fury Swipes,24 Faint Attack,33 Rest,42 Slash,51 Thrash',
218:'1 Smog,8 Ember,15 Rock Throw,22 Harden,29 Amnesia,36 Flamethrower,43 Rock Slide,50 Body Slam',
219:'1 Smog,1 Ember,1 Rock Throw,15 Rock Throw,22 Harden,29 Amnesia,36 Flamethrower,48 Rock Slide,60 Body Slam',
220:'1 Tackle,10 Aurora Beam,19 Mist,28 Take Down,37 Ice Beam,46 Blizzard',
221:'1 Horn Attack,1 Aurora Beam,19 Mist,22 Fury Attack,33 Take Down,40 Ice Beam,46 Blizzard',
222:'1 Tackle,7 Harden,13 Bubble,19 Recover,25 Bubble Beam,31 Spike Cannon,37 Ancient Power,43 Ice Beam',
223:'1 Water Gun,11 Psybeam,22 Aurora Beam,28 Bubble Beam,33 Focus Energy,44 Ice Beam,55 Hyper Beam',
224:'1 Water Gun,1 Constrict,1 Psybeam,22 Aurora Beam,25 Bubble Beam,38 Focus Energy,54 Ice Beam,65 Hyper Beam',
225:'1 Present,25 Ice Beam,45 Blizzard',
226:'1 Tackle,10 Bubble,18 Supersonic,25 Bubble Beam,32 Take Down,40 Agility,49 Wing Attack,55 Confuse Ray',
227:'1 Leer,1 Peck,13 Sand Attack,19 Swift,25 Agility,37 Fury Attack,49 Steel Wing',
228:'1 Leer,1 Ember,7 Roar,13 Smog,20 Bite,27 Faint Attack,35 Flamethrower,43 Crunch',
229:'1 Leer,1 Ember,1 Roar,13 Smog,20 Bite,30 Faint Attack,41 Flamethrower,52 Crunch',
230:'1 Bubble,1 Smokescreen,1 Leer,24 Leer,30 Water Gun,41 Agility,52 Hydro Pump',
231:'1 Tackle,9 Growl,17 Defense Curl,25 Flail,33 Take Down,49 Double-Edge',
232:'1 Horn Attack,1 Growl,1 Defense Curl,17 Defense Curl,25 Rollout,33 Fury Attack,41 Rapid Spin,49 Earthquake',
233:'1 Conversion,1 Tackle,1 Sharpen,9 Psybeam,12 Agility,20 Recover,24 Tri Attack,32 Zap Cannon',
234:'1 Tackle,8 Leer,15 Hypnosis,23 Stomp,31 Sand Attack,40 Take Down,49 Confuse Ray',
235:'1 Tackle,11 Swift,21 Agility,31 Double Team,41 Slash',
236:'1 Tackle',
237:'1 Rolling Kick,7 Focus Energy,13 Pursuit,19 Quick Attack,25 Rapid Spin,31 Counter,37 Agility,49 Mega Kick',
238:'1 Pound,1 Lick,13 Aurora Beam,21 Confusion,25 Sing,37 Psychic,49 Blizzard',
239:'1 Quick Attack,1 Leer,9 Thunder Punch,17 Light Screen,25 Swift,33 Screech,41 Thunder Wave,49 Thunderbolt',
240:'1 Ember,7 Leer,13 Smog,19 Fire Punch,25 Smokescreen,37 Flamethrower,43 Confuse Ray',
241:'1 Tackle,1 Growl,4 Defense Curl,8 Stomp,19 Rollout,34 Body Slam,53 Double-Edge',
242:'1 Pound,1 Growl,4 Tail Whip,7 Sing,10 Defense Curl,13 Double Slap,16 Minimize,20 Softboiled,29 Light Screen,40 Double-Edge',
243:'1 Bite,11 Leer,21 Thunder Shock,31 Roar,41 Quick Attack,51 Spark,61 Reflect,71 Crunch,81 Thunder',
244:'1 Bite,11 Leer,21 Ember,31 Roar,41 Fire Spin,51 Stomp,61 Flamethrower,71 Swagger,81 Fire Blast',
245:'1 Bite,11 Leer,21 Bubble Beam,31 Rain Dance,41 Gust,51 Aurora Beam,61 Mist,71 Mirror Coat,81 Hydro Pump',
246:'1 Bite,8 Leer,15 Sandstorm,22 Screech,29 Rock Slide,36 Thrash,43 Scary Face,50 Crunch',
247:'1 Bite,1 Leer,15 Sandstorm,22 Screech,29 Rock Slide,38 Thrash,47 Scary Face,56 Crunch',
248:'1 Bite,1 Leer,1 Sandstorm,22 Screech,29 Rock Slide,38 Thrash,47 Scary Face,61 Crunch',
249:'1 Aeroblast,1 Safeguard,1 Gust,22 Gust,33 Recover,44 Hydro Pump,66 Swift,77 Whirlwind,88 Ancient Power',
250:'1 Sacred Fire,1 Gust,11 Safeguard,22 Gust,33 Recover,44 Fire Blast,66 Swift,77 Whirlwind,88 Ancient Power',
251:'1 Leech Seed,1 Confusion,1 Recover,10 Safeguard,20 Ancient Power,30 Psychic,50 Solar Beam'
};

/* ---- parse: 'nível Golpe' -> [[nível, 'Golpe'], …] ---- */
const APRENDE = {};
for (const [dex, str] of Object.entries(APRENDE_RAW)){
  APRENDE[dex] = str.split(',').map(item => {
    const t = item.trim();
    const i = t.indexOf(' ');
    return [parseInt(t.slice(0, i), 10), t.slice(i + 1)];
  }).filter(([nv, nome]) => !isNaN(nv) && GOLPES[nome]);
}

/* Os golpes de Gold/Silver que chegaram com as TMs (Protect, Curse,
   Sweet Scent, Snore…) também se aprendem por nível em algumas espécies.
   Níveis da 2ª geração, do learnset de Gen 2 do Showdown (código 2L). */
const APRENDE_G2_EXTRA = {
  1:'25 Sweet Scent', 2:'29 Sweet Scent', 3:'29 Sweet Scent', 7:'28 Protect',
  8:'31 Protect', 9:'31 Protect', 43:'7 Sweet Scent', 44:'7 Sweet Scent,1 Sweet Scent',
  45:'1 Sweet Scent', 54:'31 Psych Up', 55:'31 Psych Up', 69:'30 Sweet Scent',
  70:'33 Sweet Scent', 71:'1 Sweet Scent', 79:'1 Curse', 80:'1 Curse',
  90:'25 Protect', 91:'1 Protect', 92:'16 Curse', 93:'16 Curse',
  94:'16 Curse', 96:'43 Psych Up', 97:'55 Psych Up', 98:'34 Protect',
  99:'38 Protect', 106:'41 Endure', 107:'44 Detect', 115:'37 Endure',
  138:'37 Protect', 139:'37 Protect', 140:'37 Endure', 141:'37 Endure',
  143:'36 Snore', 145:'37 Detect', 146:'37 Endure', 150:'33 Psych Up',
  182:'1 Sweet Scent', 193:'25 Detect', 196:'42 Psych Up', 199:'1 Curse',
  204:'1 Protect', 205:'1 Protect', 214:'12 Endure', 216:'43 Snore',
  217:'49 Snore', 220:'19 Endure', 221:'19 Endure,1 Endure', 231:'41 Endure',
  237:'43 Detect',
};
for (const [dex, str] of Object.entries(APRENDE_G2_EXTRA)){
  const extra = str.split(',').map(t => { const i = t.indexOf(' '); return [parseInt(t.slice(0, i), 10), t.slice(i + 1)]; })
                   .filter(([nv, nome]) => !isNaN(nv) && GOLPES[nome]);
  const lista = (APRENDE[dex] || []).concat(extra);
  lista.sort((a, b) => a[0] - b[0]);
  APRENDE[dex] = lista;
}

/* A linha inteira, da forma base até esta. Ninguém esquece o que
   aprendeu antes de evoluir: sem isso, um Metapod entraria em
   combate só com Harden e não teria como atacar. */
function linhaDe(dexId){
  const linha = [];
  let d = dexId, guarda = 0;
  while (d && guarda++ < 5){ linha.unshift(d); d = (DEX[d] || {}).preEvo || 0; }
  return linha;
}

/* Os quatro golpes que esta espécie tem NESTE nível: os quatro
   últimos que ela aprendeu, como nos jogos. Repetido não conta
   duas vezes — a segunda vez só empurra o golpe para a frente. */
/* De onde vêm os golpes de nível: a tabela da PRÓPRIA espécie, como nos
   jogos — um Gyarados selvagem não chega com Splash, e um Butterfree não
   aprende String Shot subindo de nível. A linha evolutiva só entra se a
   espécie não tiver tabela nenhuma. */
function fontesDeGolpe(dexId){
  return (APRENDE[dexId] && APRENDE[dexId].length) ? [dexId] : linhaDe(dexId);
}

function golpesPorNivel(dexId, nivel){
  const ordem = [];
  let achou = false;
  for (const d of fontesDeGolpe(dexId)){
    const lista = APRENDE[d];
    if (!lista || !lista.length) continue;
    achou = true;
    for (const [nv, nome] of lista){
      if (nv > nivel) break;
      const i = ordem.indexOf(nome);
      if (i >= 0) ordem.splice(i, 1);
      ordem.push(nome);
    }
  }
  if (!achou || !ordem.length) return null;
  return ordem.slice(-4);
}

/* Golpe de assinatura entra sempre: é o que aquele bicho é, e só
   ele tem. Cuidado com o campo soPara — quando ele lista várias
   espécies não é assinatura, é restrição de linhagem do gerador
   antigo, e forçar isso no time colocava Supersonic em Staryu. */
function assinaturaDe(dexId, nivel){
  const fora = [];
  for (const [nome, g] of Object.entries(GOLPES))
    if (g.soPara && g.soPara.length === 1 && g.soPara[0] === dexId && g.nv <= nivel) fora.push(nome);
  return fora;
}

/* O que a espécie aprende exatamente NESTE nível — é o que o jogo
   anuncia quando alguém sobe de nível. Só a tabela dela: o que a forma
   anterior aprendia ficou pra trás na evolução, como nos jogos. */
function golpesDoNivel(dexId, nivel){
  const saida = [];
  for (const d of fontesDeGolpe(dexId)){
    for (const [nv, nome] of (APRENDE[d] || []))
      if (nv === nivel && !saida.includes(nome)) saida.push(nome);
  }
  return saida;
}
