/* ============================================================
   ROSTO DE QUEM TE DESAFIA
   Sprite de treinador (80×80, estilo HG/SS) pra abertura da batalha,
   pro fundo da arena enquanto a briga acontece e pro balão de fala.

   Vem do Pokémon Showdown (play.pokemonshowdown.com/sprites/trainers),
   a mesma origem dos cenários. O endereço de gen4 da PokeAPI dá 404
   pra todos eles.

   Só entra quem tem equivalente de verdade: líder é o líder, o
   Campeão é o Red. Quem só existe neste jogo ganha a classe de
   treinador que os jogos dariam pra ele — o Caçador é roughneck, a
   Nadia é veterana. Quem não tem rosto de propósito (a pessoa da
   sombra, os quatro da Elite em fila) fica sem, e a abertura pula
   o treinador: é melhor nada do que o rosto errado.
   ============================================================ */
const NPC_BASE = 'sprites_nds/npcs/';

/* nome exato → arquivo (sem .png) */
const RETRATO_POR_NOME = {
  'Brock':'gym_leaders/brock', 'Misty':'gym_leaders/misty', 'Lt. Surge':'gym_leaders/lt_surge',
  'Erika':'gym_leaders/erika', 'Koga':'gym_leaders/koga', 'Sabrina':'gym_leaders/sabrina',
  'Blaine':'gym_leaders/blaine', 'Blue':'gym_leaders/blue', 'Giovanni':'gym_leaders/giovanni',
  'Lance':'elite/lance', 'Red':'elite/red',
  /* substitutos da Elite: a classe de treinador que os jogos dariam */
  'Giselle':'trainers/ace_trainer_f', 'A.J.':'trainers/ace_trainer', 'Mandi':'trainers/psychic_f',
  /* rival e rivais de estrada */
  'Ezra':'trainers/lucas', 'Otto':'trainers/roughneck', 'Caçador Roque':'trainers/roughneck',
  'Lior':'trainers/camper', 'Nolan':'trainers/sailor', 'Rory':'trainers/ninjaboy', 'o garoto de Fuchsia':'trainers/ninjaboy',
  'Garoto de Fuchsia':'trainers/ninjaboy', 'Menino do cais':'trainers/sailor',
  'Nadia':'trainers/veteran_f', 'Nadia Arden':'trainers/veteran_f',
  /* torneio */
  'Fenna, da Silph':'trainers/scientist_f', 'Guia Orin':'trainers/pokemon_ranger',
  'Ás do Planalto':'trainers/dragon_tamer', 'Veterana de Saffron':'trainers/psychic_f',
  'Pescador de Fuchsia':'trainers/fisherman', 'Criador de Pallet':'trainers/pokemon_breeder',
  'Estudante de Cinnabar':'trainers/schoolkid', 'Mochileiro da Rota 3':'trainers/backpacker',
  'Enfermeira de folga':'overworld/nurse_joy', 'Adversário do torneio':'trainers/ace_trainer',
  /* cenas */
  'Rapaz da pedreira':'trainers/hiker', 'Carregador':'trainers/worker', 'Motorista':'trainers/worker',
  'Homem das tigelas':'trainers/gentleman', 'Encarregado do Armazém 7':'trainers/worker',
  'Segurança da Silph':'overworld/policial', 'Segurança da expedição':'overworld/policial',
  'Caçadores de recompensa':'trainers/roughneck', 'Auditora Brill':'trainers/office_worker_f',
  'Dr. Hollis':'trainers/scientist', 'a Presidente':'trainers/office_worker_f',
  'o homem do portão':'trainers/gentleman',
  /* quem ganhou nome em cena e antes caía no retrato do cargo */
  'Capitão Marlow':'trainers/sailor', 'Pike':'overworld/policial',

  /* gente da história, pela classe que os jogos dariam pra ela. Quem
     trabalha de jaleco é cientista; quem vive de vara, pescador; quem
     guarda a Torre é o zelador. Rosto de propósito ausente continua
     ausente: a Terceira, a mulher de crachá azul, a voz do rádio. */
  'Surge':'gym_leaders/lt_surge', 'Tenente Surge':'gym_leaders/lt_surge', 'Fenna':'trainers/scientist_f',
  'Dra. Cordell':'trainers/scientist_f', 'Dra. Sallow':'trainers/scientist_f', 'Chefe da expedição':'trainers/scientist_f',
  'Dra. Sorrel':'trainers/scientist_f', 'Kira':'trainers/scientist_f', 'Dra. Isolde Yarrow':'trainers/scientist_f',
  'Técnica da Liga':'trainers/scientist_f', 'Comprador de jaleco':'trainers/scientist',
  'Curador Fabre':'trainers/gentleman', 'Fabre':'trainers/gentleman', 'Diretor Quince':'trainers/gentleman',
  'Sr. Tobias Dahl':'trainers/gentleman',
  'Hester Colman':'trainers/office_worker_f', 'a presidente':'trainers/office_worker_f',
  'Conselheira Edda Thistle':'trainers/office_worker_f', 'Sra. Cybil':'trainers/office_worker_f',
  'Secretária da Colônia Z-14':'trainers/office_worker_f', 'a mulher da pasta':'trainers/office_worker_f',
  'a mulher da pasta de vinil':'trainers/office_worker_f', 'Conselheira da Liga':'trainers/office_worker_f',
  'a conselheira da Liga':'trainers/office_worker_f', 'a mulher do broche da Liga':'trainers/office_worker_f',
  'Sr. Waldo':'trainers/office_worker', 'o homem de camisa social':'trainers/office_worker',
  'Zelador da Torre':'trainers/caretaker',
  'Sr. Edric':'trainers/fisherman', 'Sr. Tanner':'trainers/fisherman', 'Sr. Dane':'trainers/fisherman',
  'Tobin':'trainers/fisherman', 'Sr. Cosmo':'trainers/fisherman',
  'Célio':'trainers/courier', 'Capitão do Anne':'trainers/sailor', 'Contramestre Varo':'trainers/sailor',
  'Orso':'trainers/sailor', 'Marinheiro do turno':'trainers/sailor',
  'Sra. Zelda':'trainers/madame', 'Senhora do Growlithe':'trainers/madame', 'Sra. Wilma':'trainers/madame',
  'Sra. Odile':'trainers/maid', 'Sr. Ives':'trainers/janitor',
  'Lojista de Celadon':'trainers/clerk', 'Tito':'trainers/clerk', 'a moça da junta':'trainers/clerk_f',
  'Gina':'trainers/clerk_f',
  'Rhea Ashford':'trainers/reporter', 'Dra. Pia':'trainers/nurse', 'o médico do conselho':'trainers/doctor',
  'Sr. Emory Poplar':'trainers/pokemon_ranger', 'o guia do colete verde':'trainers/pokemon_ranger',
  'Xavi':'trainers/backpacker', 'Ylva':'trainers/backpacker_f', 'Enzo':'trainers/hiker',
  'Elias':'trainers/ace_trainer', 'Ulla':'trainers/schoolkid_f', 'Filha do Koga':'trainers/janine',
  'Sr. Zane':'trainers/baker', 'Cozinheira do Anne':'trainers/cook', 'a dona da fritura':'trainers/cook',
  'a moça do bolinho frito':'trainers/cook', 'Dono da pousada':'trainers/owner',
  'Dono do curral':'trainers/rancher', 'Gus':'trainers/cabbie', 'o motorista da van':'trainers/cabbie',
  'Conferente do porto':'trainers/worker', 'Estivador velho':'trainers/worker', 'Sr. Holt':'trainers/worker',
  'Carregador da Rota 25':'trainers/worker', 'Marceneiro de Lavender':'trainers/worker',
  'o rapaz do galpão':'trainers/worker', 'o encarregado':'trainers/worker',
  'Lena':'trainers/league_staff_f', 'Sra. Ada':'trainers/league_staff_f', 'a moça das licenças':'trainers/league_staff_f',
  'a recepcionista da Liga':'trainers/league_staff_f', 'a recepcionista do Planalto':'trainers/league_staff_f',
  'o funcionário da mesa':'trainers/league_staff',
  'Sra. Greta Nettle':'trainers/veteran_f', 'o lutador da Elite 4':'trainers/black_belt',
  'a mulher de jaleco':'trainers/scientist_f', 'a mulher de jaleco do galpão':'trainers/scientist_f', 'o homem do bar do cais':'trainers/sailor',
  'a atendente do Centro de Fuchsia':'trainers/nurse', 'o homem da banca':'trainers/clerk',

  /* segunda leva: o resto de quem carrega cena, pela classe que os jogos
     dariam. Quem o texto deixa sem rosto de propósito continua sem: a
     Terceira, a mulher de crachá azul, a voz do rádio e do telefone. */
  'Homem da banca':'trainers/clerk', 'Sr. Mervin':'trainers/veteran', 'Rapaz da fenda':'trainers/worker',
  'Sibyl':'trainers/pokefan_f', 'Filha da Sibyl':'trainers/lass', 'Maren Kestrel':'trainers/office_worker_f',
  'Sra. Laurel':'trainers/madame', 'Moça da floricultura':'trainers/aroma_lady', 'Sr. Ulric':'trainers/veteran',
  'o fumante':'trainers/worker', 'Ex-Silph':'trainers/office_worker', 'Sra. Hedda':'trainers/office_worker_f',
  'Lorca':'trainers/sage', 'Vernon':'trainers/gentleman', 'o homem de sapato limpo':'trainers/gentleman',
  'Revelador de Celadon':'trainers/clerk', 'Sra. Wren':'trainers/office_worker_f', 'Sra. Perla':'trainers/madame',
  'Ivo':'trainers/sightseer', 'Dorian':'trainers/camper', 'o mais velho dos quatro':'trainers/worker',
  'o voluntário sem nome':'trainers/worker', 'Sr. Bram':'trainers/clerk', 'Sra. Hazel':'trainers/madame',
  'o magro de boné':'trainers/fisherman', 'Amos':'trainers/sailor', 'Sr. Alder':'trainers/owner',
  'Varian':'trainers/clerk', 'o homem do bar':'trainers/waiter', 'Sra. Myrtle':'trainers/office_worker_f',
  'a mulher do fogo':'trainers/backpacker_f', 'Sr. Berto':'trainers/gentleman', 'Janus':'trainers/doctor',
  'Sr. Yves':'trainers/cabbie', 'Sr. Quint':'trainers/worker', 'a mulher da locadora':'trainers/clerk_f',
  'Lina':'trainers/office_worker_f', 'o gerente':'trainers/clerk_boss', 'a mulher almoçando':'trainers/worker',
  'Rufo':'trainers/courier', 'Cleo':'trainers/schoolkid_f', 'a mãe da Cleo':'trainers/lady',
  'o rapaz da caneta':'trainers/league_staff', 'Pipoqueiro da face sul':'trainers/chef',
  'a mulher de tailleur':'trainers/office_worker_f', 'a senhora da barraca':'trainers/madame',
  'o rapaz do posto':'trainers/pokemon_ranger', 'o homem de terno claro':'trainers/office_worker',
  'a dona do armazém':'trainers/clerk_f', 'o homem do macacão':'trainers/worker',
  'a funcionária da reserva':'trainers/pokemon_ranger_f', 'a mulher do baralho':'trainers/madame',
  'Sr. Dunmore':'trainers/baker', 'Sr. Pell':'trainers/clerk', 'o rapaz da descarga':'trainers/worker',
  'a moça do berçário':'trainers/pokemon_breeder_f', 'Livia Gale':'trainers/office_worker_f',
  'a editora do jornal':'trainers/reporter', 'Falk':'trainers/worker', 'Sr. Delmar':'overworld/policial',
  'Sr. Nolan':'trainers/worker', 'o cozinheiro':'trainers/chef', 'a supervisora':'trainers/league_staff_f',
  'o conselheiro mais velho':'trainers/gentleman', 'Leo':'trainers/ace_trainer', 'Tessa Rue':'trainers/pokemon_ranger_f', 'a mulher de trinta':'trainers/pokemon_ranger_f',

  /* quem tem nome fixo (NOMES_FIXOS) usa o MESMO rosto antes e depois
     de dizer o nome: o rótulo e o nome apontam pro mesmo arquivo */
  'a funcionária da guarita':'trainers/office_worker_f', 'o rapaz do protocolo':'trainers/clerk',
  'a balconista da farmácia':'trainers/clerk_f', 'o homem de barba':'trainers/gentleman',
  'Thea Larkin':'trainers/worker', 'o rapaz da enfermaria':'trainers/doctor',
  'o colega da enfermaria':'trainers/worker', 'Pascal':'trainers/worker',
  'a técnica de jaleco':'trainers/scientist_f',
  'o sargento de Viridian':'overworld/policial', 'Sargento Holt':'overworld/policial',
  'a editora do Jornal':'trainers/reporter', 'Hazel Moss':'trainers/reporter',
  'a avaliadora da Associação':'trainers/madame',
  'a coordenadora da quadra':'trainers/league_staff_f', 'Coordenadora Maple':'trainers/league_staff_f',

  /* quem só falava e ficava sem rosto: agora todo mundo que fala tem.
     Voz de rádio e de telefone ganha o rosto de quem está do outro lado */
  'o locutor':'trainers/waiter', 'uma voz no salão':'trainers/gentleman', 'outra voz':'trainers/lady',
  'Stellan':'trainers/psychic', 'Funcionário da doca':'trainers/worker', 'outra acampada':'trainers/picnicker',
  'Funcionária da reserva':'trainers/pokemon_ranger_f', 'o locutor do rádio':'trainers/office_worker',
  'a voz no telefone':'trainers/pokemon_ranger_f', 'a voz do rádio':'trainers/league_staff',
  'Roland':'trainers/league_staff', 'Roland (central do Planalto)':'trainers/league_staff',
  'Caçadores da Rota 23':'trainers/roughneck', 'a voz do telefone':'trainers/office_worker_f',
  'o locutor da arena':'trainers/league_staff', 'Supervisora da arena':'trainers/league_staff_f',
  'Conselheira do broche':'trainers/office_worker_f', 'Nico Hart':'trainers/punk_guy',
  'Nilo, o do posto':'trainers/worker', 'a voz do outro lado':'trainers/office_worker',
  'Maren de Pewter':'trainers/lass', 'Museu de Pewter':'trainers/gentleman',
  'As duas da caixa de gelo':'trainers/twins', 'quem estava na porta antes de você':'trainers/ace_trainer',

  /* caminho da Lei */
  'o delegado de Fuchsia':'overworld/policial', 'Delegado Crane':'overworld/policial',
  'a delegada de Saffron':'trainers/veteran_f', 'a delegada':'trainers/veteran_f', 'Delegada Thorne':'trainers/veteran_f',
  'o advogado da Comissão':'trainers/office_worker', 'Dr. Bramble':'trainers/office_worker',
  'Motoqueiro da escolta':'trainers/biker', 'Segurança da Estação 4':'trainers/veteran',
  'o técnico da prancheta':'trainers/worker',
  /* caminho da Rocket */
  'o contato da Terceira':'trainers/team_rocket_grunt_m', 'Rook':'trainers/team_rocket_grunt_m',
  'Guarda da reserva':'trainers/pokemon_ranger_f',
  /* caminho da Ciência; o Professor é o Oak de verdade */
  'Professor Oak':'trainers/oak', 'Oak':'trainers/oak',
  'a pesquisadora de bota':'trainers/scientist_f', 'Dra. Quill':'trainers/scientist_f',
  'a mulher do envelope':'trainers/office_worker_f', 'Recolhedor da Comissão':'trainers/veteran',
  /* caminho da Imprensa */
  'o fotógrafo do Jornal':'trainers/cameraman', 'Bastian Fern':'trainers/cameraman',
  'a assessora da reserva':'trainers/office_worker_f', 'Vigia do portão':'trainers/veteran',
  'a voz da lavanderia':'trainers/pokemon_breeder_f', 'o homem do carro cinza':'trainers/office_worker',
  'o oficial de justiça':'trainers/office_worker',
  /* caminho da Criação */
  'a tratadora da Associação':'trainers/pokemon_breeder_f', 'Mina Bray':'trainers/pokemon_breeder_f',
  'Caçador de filhote':'trainers/roughneck', 'Técnico do berçário':'trainers/scientist',
  'Representante da Comissão':'trainers/veteran',
  /* caminho da Liga */
  'o pai do patrocínio':'trainers/gentleman',
  /* caminho do Herói */
  'a brigadista de Fuchsia':'trainers/pokemon_ranger_f', 'Tess Calder':'trainers/pokemon_ranger_f',
  'a mãe do píer':'trainers/pokefan_f', 'Dale':'trainers/fisherman', 'a mãe do menino':'trainers/lady',
  /* caminho do Mercenário */
  'o intermediário':'trainers/gambler', 'o chefe do manejo':'trainers/worker',
  'o velho do caminhão':'trainers/gentleman', 'Edith':'trainers/office_worker_f',
  /* caminho do Foragido */
  'o atravessador':'trainers/backpacker', 'Corwin':'trainers/backpacker',
  'Guarda da ponte':'overworld/policial', 'a técnica fugida':'trainers/scientist_f',
  /* caminho do Andarilho */
  'a mulher do mapa':'trainers/backpacker_f', 'Tamsin Reed':'trainers/backpacker_f',
  'o velho da primeira fogueira':'trainers/veteran', 'a moça de macacão':'trainers/pokefan_f',
  'o menino do balde':'trainers/youngster', 'o treinador de capa de chuva':'trainers/veteran'
};

/* quem ficou em casa: o rosto sai do parentesco da ficha */
const RETRATO_DA_CASA = {
  'mãe':'trainers/mom', 'avó':'trainers/madame', 'tia':'trainers/lady', 'madrinha':'trainers/lady',
  'irmã mais velha':'trainers/ace_trainer_f', 'pai':'trainers/office_worker', 'avô':'trainers/gentleman',
  'tio':'trainers/office_worker', 'padrinho':'trainers/gentleman', 'irmão mais velho':'trainers/ace_trainer'
};

/* cargo → arquivo, pra quem fala sem nome. Só os que não deixam dúvida
   de quem é: enfermeira é enfermeira, guarda (ele) é guarda. */
const RETRATO_POR_CARGO = [
  [/^(a )?enfermeira\b/i,                'overworld/nurse_joy'],
  [/^(a )?atendente( do Centro| de Viridian)?$/i, 'overworld/nurse_joy'],
  [/^(o )?(\S+ )?(guarda|policial)\b/i,  'overworld/policial'],
  [/^(o )?oficial\b/i,                   'overworld/policial'],
  [/^(o )?(barqueiro|capitão do porto|marinheiro)/i,'trainers/sailor'],
  [/^(o )?pescador\b/i,                  'trainers/fisherman'],
  [/^(a |o )?repórter\b/i,               'trainers/reporter'],
  [/^(o )?médico\b/i,                    'trainers/doctor'],
  [/^(a )?médica\b/i,                    'trainers/nurse'],
  [/^(o )?(estivador|conferente|operário|outro operário)\b/i, 'trainers/worker'],
  /* \b do JavaScript não conhece letra acentuada: "escrivã" nunca fechava */
  [/^(a )?(escrevente|escrivã|secretária)(?=\s|$)/i, 'trainers/office_worker_f'],
  [/^(o )?motorista(?=\s|$)/i,           'trainers/cabbie'],
  [/^(o |a )?gerente(?=\s|$)/i,          'trainers/clerk_boss']
];

function caminhoNPC(arq){
  const rel = NPC_BASE + arq + '.png';
  return (typeof SPRITES_EMBUTIDOS !== 'undefined' && SPRITES_EMBUTIDOS[rel]) || rel;
}

/* "Líder Brock", "Sabrina, Líder de Saffron" e "Brock" são a mesma pessoa.
   Devolve a classe (o arquivo, sem .png): é dela que sai o rosto e o
   quanto a pessoa paga quando perde. */
function classeDoTreinador(nome){
  if (!nome) return null;
  let n = String(nome).trim();
  if (RETRATO_POR_NOME[n]) return RETRATO_POR_NOME[n];
  /* a pessoa de casa: pelo parentesco que a ficha escolheu */
  if (typeof nomeCasa === 'function' && typeof casaDe === 'function'){
    try { if (n === nomeCasa() && RETRATO_DA_CASA[casaDe().quem]) return RETRATO_DA_CASA[casaDe().quem]; } catch (e) {}
  }
  n = n.replace(/^Líder\s+/, '').replace(/,\s*Líder de .*$/, '').trim();
  if (RETRATO_POR_NOME[n]) return RETRATO_POR_NOME[n];
  for (const [re, arq] of RETRATO_POR_CARGO) if (re.test(n)) return arq;
  return null;
}
function retratoDe(nome){
  const c = classeDoTreinador(nome);
  if (c) return caminhoNPC(c);
  /* Pokémon que fala (Mewtwo, no fim): o rosto é o próprio sprite de frente */
  if (typeof DEX !== 'undefined' && typeof caminhoSprite === 'function'){
    const n = String(nome || '').trim();
    for (const id in DEX) if (DEX[id].nome === n) return caminhoSprite(+id, 'frente');
  }
  return null;
}

/* Quanto cada classe paga por nível do último Pokémon dela quando perde —
   a tabela de Red/Blue, pela classe equivalente dos jogos (Caçador é
   Burglar, Carregador e Motorista são Engineer, Auditora e Presidente
   são Gentleman). Quem não tem classe honesta paga como Jr. Trainer. */
const PAGA_POR_CLASSE = {
  'gym_leaders':99, 'elite':99,
  'trainers/youngster':15, 'trainers/lass':15, 'trainers/bug_catcher':10, 'trainers/hiker':35,
  'trainers/team_rocket_grunt_m':30, 'trainers/team_rocket_grunt_f':30, 'trainers/rival':35, 'trainers/lucas':35,
  'trainers/ace_trainer':35, 'trainers/ace_trainer_f':35, 'trainers/worker':50,
  'trainers/scientist':50, 'trainers/scientist_f':50, 'trainers/office_worker_f':70,
  'trainers/veteran_f':70, 'trainers/roughneck':90, 'trainers/sailor':30, 'trainers/gentleman':70,
  'trainers/camper':20, 'trainers/pokemon_breeder':40, 'trainers/psychic_f':10,
  'trainers/fisherman':35, 'trainers/backpacker':25, 'trainers/dragon_tamer':40,
  'trainers/pokemon_ranger':35, 'trainers/schoolkid':25,
  'overworld/nurse_joy':20, 'overworld/policial':50,
  /* as classes que os treinadores de rota trouxeram, pela mesma tabela */
  'trainers/picnicker':20, 'trainers/swimmer':5, 'trainers/swimmer_f':5, 'trainers/biker':20,
  'trainers/bird_keeper':25, 'trainers/black_belt':25, 'trainers/battle_girl':25, 'trainers/beauty':70,
  'trainers/burglar':90, 'trainers/gambler':70, 'trainers/juggler':35, 'trainers/pokemaniac':50,
  'trainers/super_nerd':25, 'trainers/medium':30, 'trainers/psychic':10, 'trainers/sage':25,
  'trainers/firebreather':50, 'trainers/ninjaboy':15, 'trainers/guitarist':30, 'trainers/cyclist':20, 'trainers/cyclist_f':20,
  'trainers/tuber':4, 'trainers/tuber_f':4, 'trainers/twins':20, 'trainers/lady':80, 'trainers/rich_boy':80,
  'trainers/pokefan':50, 'trainers/pokefan_f':50, 'trainers/ruin_maniac':50, 'trainers/veteran':70,
  'trainers/pokemon_breeder_f':40, 'trainers/pokemon_ranger_f':35, 'trainers/backpacker_f':25,
  'trainers/schoolkid_f':25, 'trainers/scuba_diver':30, 'trainers/golfer':40, 'trainers/dancer':30,
  'trainers/punk_guy':30, 'trainers/punk_girl':30, 'trainers/sightseer':30, 'trainers/sightseer_f':30,
  'trainers/artist':30, 'trainers/rancher':40, 'trainers/cook':30
};
const PAGA_PADRAO = 20;
function pagaPorNivel(nome){
  const c = classeDoTreinador(nome);
  if (!c) return PAGA_PADRAO;
  return PAGA_POR_CLASSE[c] || PAGA_POR_CLASSE[c.split('/')[0]] || PAGA_PADRAO;
}

/* ============================================================
   ROSTO DE BALÃO PRA QUEM NÃO É TREINADOR
   Só pro balão de fala (não muda quanto ninguém paga): quem não tem
   rosto próprio ganha o de alguém do mesmo tipo de gente, pelo que o
   rótulo diz — crachá, macacão, barco, idade, e homem ou mulher.
   Toda voz de rádio e de telefone que fala tem rosto por nome, em
   RETRATO_POR_NOME; o null abaixo só segura voz nova sem dono.
   ============================================================ */
const ROSTO_POR_NOME_SOLTO = {
  'Dario':'trainers/roughneck', 'Sra. Vale':'trainers/madame', 'Nina':'trainers/sightseer_f',
  'Elsa':'trainers/office_worker_f', 'Milo':'trainers/camper', 'Nico':'trainers/punk_guy',
  'A Terceira':'trainers/veteran_f', 'a Terceira':'trainers/veteran_f', 'Thea Larkin':'trainers/worker',
  'o Professor':'trainers/oak',
  'Rico':'trainers/worker', 'Hal':'trainers/worker', 'Maeve Corwin':'trainers/reporter', 'quem te atendeu':'trainers/league_staff',
  'a assistente do Professor':'trainers/scientist_f', 'a enfermeira de Viridian':'overworld/nurse_joy',
  'outro dos seis':'trainers/fisherman', 'os pescadores':'trainers/fisherman', 'os três':'trainers/pokefan'
};
const ROSTO_POR_PALAVRA = [
  [/\bvoz\b|r[áa]dio|telefone|locutor/i, null],
  [/^Sra\.?\s/i, 'trainers/madame'],
  [/^Sr\.?\s/i, 'trainers/gentleman'],
  [/entregador|encomenda|correio/i, 'trainers/courier'],
  [/leiloeiro/i, 'trainers/gentleman'],
  [/contramestre|navio/i, 'trainers/sailor'],
  [/carregador|frentista|seguran[çc]a/i, 'trainers/worker'],
  [/crach[áa]|escrit[óo]rio|assessor|advogad|secret[áa]ri|recepcion|guich[êe]|junta|pessoal|coluna|atendente|balconista|diretor|editor|presidente|cadastro/i, 'office'],
  [/tripula|ferry|barco|casco|marinh|porto|cais/i, 'trainers/sailor'],
  [/oper[áa]ri|pe[ãa]o|macac[ãa]o|setor|esta[çc][ãa]o|t[ée]cnic|mec[âa]nic|obra/i, 'trainers/worker'],
  [/padaria/i, 'trainers/baker'],
  [/lanchonete|cozinh|fogareiro|restaurante/i, 'trainers/cook'],
  [/jornaleiro|banca|loja|vendedor|balc[ãa]o/i, 'trainers/clerk'],
  [/zool[óo]gico|fazend|pasto|curral/i, 'trainers/rancher'],
  [/bibliotec|professor|professora/i, 'trainers/teacher'],
  [/cientista|laborat[óo]rio|pesquisador/i, 'trainers/scientist'],
  [/oficial|policia|guarda|delegad/i, 'overworld/policial'],
  [/menina|garota/i, 'trainers/schoolkid_f'],
  [/menino|garoto|crian[çc]a/i, 'trainers/schoolkid'],
  [/senhora|velha|av[óo]\b|vi[úu]va/i, 'trainers/madame'],
  [/senhor|velho|av[ôo]\b/i, 'trainers/gentleman'],
  [/rapaz|cara\b|jovem/i, 'trainers/punk_guy'],
  [/mo[çc]a\b/i, 'trainers/sightseer_f'],
  [/mulher|ela\b|dona\b/i, 'trainers/pokefan_f'],
  [/homem|ele\b|dono\b|sujeito|vizinho|primo|colega/i, 'trainers/pokefan'],
  [/vizinha|prima/i, 'trainers/pokefan_f'],
  /* o resto dos rótulos ("o da aliança", "o mais novo"): pelo artigo */
  [/^(o|um)\s/i, 'trainers/pokefan'],
  [/^(a|uma)\s/i, 'trainers/pokefan_f']
];
function rostoGenerico(nome){
  const n = String(nome || '').trim();
  if (!n) return null;
  if (ROSTO_POR_NOME_SOLTO[n]) return caminhoNPC(ROSTO_POR_NOME_SOLTO[n]);
  const mulher = /\b(a|uma)\b|mulher|senhora|moça|menina|dona|ela\b|[^ ]a$/i.test(n.split(' ').slice(0, 2).join(' '));
  for (const [re, arq] of ROSTO_POR_PALAVRA){
    if (!re.test(n)) continue;
    if (!arq) return null;
    if (arq === 'office') return caminhoNPC(mulher ? 'trainers/office_worker_f' : 'trainers/office_worker');
    if (arq === 'trainers/scientist' && mulher) return caminhoNPC('trainers/scientist_f');
    return caminhoNPC(arq);
  }
  return null;
}
