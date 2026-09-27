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
  'Ezra':'trainers/rival', 'Otto':'trainers/roughneck', 'Caçador Roque':'trainers/roughneck',
  'Lior':'trainers/camper', 'Nolan':'trainers/sailor', 'o garoto de Fuchsia':'trainers/youngster',
  'Garoto de Fuchsia':'trainers/youngster', 'Menino do cais':'trainers/sailor',
  'Nadia':'trainers/veteran_f',
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
  'o homem do portão':'trainers/gentleman'
};

/* cargo → arquivo, pra quem fala sem nome. Só os que não deixam dúvida
   de quem é: enfermeira é enfermeira, guarda (ele) é guarda. */
const RETRATO_POR_CARGO = [
  [/^(a )?enfermeira\b/i,                'overworld/nurse_joy'],
  [/^(o )?(guarda|policial)\b/i,         'overworld/policial'],
  [/^(o )?(barqueiro|capitão do porto)/i,'trainers/sailor'],
  [/^(o )?pescador\b/i,                  'trainers/fisherman']
];

function caminhoNPC(arq){
  const rel = NPC_BASE + arq + '.png';
  return (typeof SPRITES_EMBUTIDOS !== 'undefined' && SPRITES_EMBUTIDOS[rel]) || rel;
}

/* "Líder Brock", "Sabrina, Líder de Saffron" e "Brock" são a mesma pessoa */
function retratoDe(nome){
  if (!nome) return null;
  let n = String(nome).trim();
  if (RETRATO_POR_NOME[n]) return caminhoNPC(RETRATO_POR_NOME[n]);
  n = n.replace(/^Líder\s+/, '').replace(/,\s*Líder de .*$/, '').trim();
  if (RETRATO_POR_NOME[n]) return caminhoNPC(RETRATO_POR_NOME[n]);
  for (const [re, arq] of RETRATO_POR_CARGO) if (re.test(n)) return caminhoNPC(arq);
  return null;
}
