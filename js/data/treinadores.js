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
  /* os titulares, quando voltam (titulares.js): a arte de Let's Go da
     Lorelei e da Agatha e o Bruno de HG/SS, do traço do Lance */
  'Lorelei':'elite/lorelei', 'Bruno':'elite/bruno', 'Agatha':'elite/agatha',
  /* a Elite inteira no poço do capítulo 26: quem puxa a fila é o Lance */
  'Elite 4':'elite/lance',
  /* substitutos da Elite: a classe de treinador que os jogos dariam */
  'Giselle':'trainers/ace_trainer_f', 'A.J.':'trainers/veteran_gen7', 'Mandi':'trainers/harlequin',
  /* rival e rivais de estrada. O Ezra é o Rising Star de X/Y: tem a
     sua idade e a roupa nova demais de quem comprou tudo pra viagem.
     Rosto de rival nunca é protagonista dos jogos nem foto que o
     jogador pode escolher pra si (RETRATOS_DA_FICHA) */
  'Ezra':'trainers/ezra', 'Otto':'trainers/otto', 'Caçador Roque':'trainers/otto', 'o caçador mais novo':'trainers/roughneck',
  'Lior':'trainers/worker_gen7', 'Nolan':'trainers/nolan', 'Rory':'trainers/rory', 'o garoto de Fuchsia':'trainers/rory',
  'Diana':'trainers/diana',
  'Garoto de Fuchsia':'trainers/rory', 'Menino do cais':'trainers/nolan',
  'Nadia':'trainers/veteran_f', 'Nadia Arden':'trainers/veteran_f',
  /* torneio */
  'Fenna, da Silph':'trainers/scientist_f', 'Guia Orin':'trainers/pokemon_ranger',
  'Ás do Planalto':'trainers/dragon_tamer', 'Veterana de Saffron':'trainers/psychic_f',
  'Pescador de Fuchsia':'trainers/fisherman', 'Criador de Pallet':'trainers/pokemon_breeder',
  'Estudante de Cinnabar':'trainers/schoolkid', 'Mochileiro da Rota 3':'trainers/backpacker',
  'Enfermeira de folga':'overworld/nurse_joy', 'Adversário do torneio':'trainers/ace_trainer',
  /* cenas */
  'Rapaz da pedreira':'trainers/hiker', 'Carregador':'trainers/worker', 'Motorista':'trainers/worker',
  'Homem das tigelas':'trainers/gardener', 'Encarregado do Armazém 7':'trainers/worker',
  'Segurança da Silph':'overworld/policial', 'Segurança da expedição':'overworld/policial',
  'Caçadores de recompensa':'trainers/roughneck', 'Auditora Brill':'trainers/madame_gen8',
  'Dr. Hollis':'trainers/scientist', 'a Presidente':'trainers/officeworkerf_gen9',
  'o homem do portão':'trainers/gentleman',
  /* quem ganhou nome em cena e antes caía no retrato do cargo */
  'Capitão Marlow':'trainers/sailor_gen6', 'Pike':'trainers/policeman_gen7',

  /* gente da história, pela classe que os jogos dariam pra ela. Quem
     trabalha de jaleco é cientista; quem vive de vara, pescador; quem
     guarda a Torre é o zelador. */
  'Surge':'gym_leaders/lt_surge', 'Tenente Surge':'gym_leaders/lt_surge', 'Fenna':'trainers/scientist_f',
  'Dra. Cordell':'trainers/neroli', 'Dra. Sallow':'trainers/cyllene', 'Chefe da expedição':'trainers/cyllene',
  'Dra. Sorrel':'trainers/scientistf_gen6', 'Kira':'trainers/scientist_f', 'Dra. Isolde Yarrow':'trainers/teacher',
  'Técnica da Liga':'trainers/scientist_f', 'Comprador de jaleco':'trainers/scientist_gen4',
  'Curador Fabre':'trainers/cedricjuniper', 'Fabre':'trainers/cedricjuniper', 'a figura de capuz':'trainers/capuz', 'Figura de capuz':'trainers/capuz', 'Diretor Quince':'trainers/mrstone',
  'Sr. Tobias Dahl':'trainers/gentleman_gen3', 'o professor do conselho':'trainers/gentleman_gen3',
  'a conselheira da Liga':'trainers/madame_gen6', 'Margot Heath':'trainers/madame_gen6',
  'o contador do conselho':'trainers/larry', 'Sr. Mallow':'trainers/larry',
  'a secretária da mesa':'trainers/office_worker_f', 'a advogada do conselho':'trainers/teacher_gen7',
  'Dra. Sedge':'trainers/teacher_gen7', 'Dr. Senna':'trainers/scientist_gen7',
  'Hester Colman':'trainers/officeworkerf_gen9', 'a presidente':'trainers/officeworkerf_gen9',
  'Conselheira Edda Thistle':'trainers/office_worker_f', 'Sra. Cybil':'trainers/office_worker_f',
  'a secretária da colônia':'trainers/tyme', 'a mulher da pasta':'trainers/teacher',
  'a mulher da pasta de vinil':'trainers/teacher', 'Conselheira da Liga':'trainers/madame_gen6',
  'a mulher do elevador':'trainers/office_worker_f',
  'a conselheira da Liga':'trainers/madame_gen6', 'a mulher do broche da Liga':'trainers/madame_gen6',
  'Sr. Waldo':'trainers/phillipe', 'o homem de camisa social':'trainers/office_worker',
  'Zelador da Torre':'trainers/caretaker',
  'Sr. Edric':'trainers/fisherman', 'o homem do boné':'trainers/fisherman', 'Sr. Tanner':'trainers/mrbriney', 'Sr. Dane':'trainers/fisherman_gen7',
  'Tobin':'trainers/fisherman_gen4', 'Sr. Cosmo':'trainers/fisherman',
  'Célio':'trainers/mateo', 'Capitão do Anne':'trainers/pilot', 'Contramestre Varo':'trainers/sailor',
  'Orso':'trainers/mohn', 'Marinheiro do turno':'trainers/sailor_gen3',
  'Sra. Zelda':'trainers/madame', 'Senhora do Growlithe':'trainers/madame_gen4', 'Sra. Wilma':'trainers/madame_gen7',
  'Sra. Odile':'trainers/maid', 'Sr. Ives':'trainers/janitor',
  'Lojista de Celadon':'trainers/clerk', 'Tito':'trainers/clerk', 'a moça da junta':'trainers/clerk_f',
  'Gina':'trainers/clerk_f',
  'Rhea Ashford':'trainers/reporter', 'Dra. Pia':'trainers/doctorf_gen8', 'o médico do conselho':'trainers/scientist_gen7',
  'Sr. Emory Poplar':'trainers/vince', 'o guia do colete verde':'trainers/pokemonranger_gen6xy',
  'Xavi':'trainers/baoba', 'Ylva':'trainers/pokemonbreederf_gen6xy', 'Enzo':'trainers/pokemonbreeder_gen7',
  'Elias':'trainers/ace_trainer', 'Ulla':'trainers/schoolkid_f', 'Filha do Koga':'trainers/janine', 'a filha do Koga':'trainers/janine',
  'Sr. Zane':'trainers/gentleman_gen7', 'Cozinheira do Anne':'trainers/baker', 'a dona da fritura':'trainers/waitress',
  'a moça do bolinho frito':'trainers/waitress_gen4', 'Dono da pousada':'trainers/waiter_gen9',
  'o dono do curral':'trainers/rancher', 'Sr. Hale':'trainers/rancher', 'o velho pescador':'trainers/mrbriney',
  'o homem da cabine':'trainers/roughneck', 'o homem da caminhonete':'trainers/roughneck', 'Gus':'trainers/cabbie', 'o motorista da van':'trainers/cabbie', 'o homem da van':'trainers/roughneck',
  'Conferente do porto':'trainers/railstaff', 'Estivador velho':'trainers/tarragon', 'Sr. Larch':'trainers/taohua',
  'Carregador da Rota 25':'trainers/worker', 'Marceneiro de Lavender':'trainers/kurt',
  'o rapaz do galpão':'trainers/delinquent_gen9', 'o encarregado':'trainers/worker',
  'Lena':'trainers/league_staff_f', 'Sra. Ada':'trainers/league_staff_f', 'a moça das licenças':'trainers/league_staff_f',
  'a recepcionista da Liga':'trainers/league_staff_f', 'a recepcionista do Planalto':'trainers/league_staff_f',
  'o funcionário da mesa':'trainers/league_staff',
  'Sra. Greta Nettle':'trainers/veteran_f', 'o lutador da Elite 4':'trainers/veteran_gen7',
  'a mulher de jaleco':'trainers/scientistf_gen6', 'a mulher de jaleco do galpão':'trainers/scientist_f', 'o homem do bar do cais':'trainers/sailor',
  'a atendente do Centro de Fuchsia':'trainers/nurse', 'o homem da banca':'trainers/clerk',

  /* segunda leva: o resto de quem carrega cena, pela classe que os jogos
     dariam */
  'Homem da banca':'trainers/clerk', 'Sr. Mervin':'trainers/gentleman_lgpe', 'Rapaz da fenda':'trainers/worker',
  'Sibyl':'trainers/waitress_gen6', 'Filha da Sibyl':'trainers/lass', 'Maren Kestrel':'trainers/beauty_gen9',
  'Sra. Laurel':'trainers/madame_gen4dp', 'Moça da floricultura':'trainers/aroma_lady', 'Sr. Ulric':'trainers/janitor_gen7',
  'o fumante':'trainers/worker_gen8', 'Ex-Silph':'trainers/officeworker_gen9', 'Sra. Hedda':'trainers/office_worker_f',
  'Lorca':'trainers/mohn_anime', 'Vernon':'trainers/veteran_gen6', 'o homem de sapato limpo':'trainers/cedricjuniper',
  'Revelador de Celadon':'trainers/cafemaster', 'Sra. Wren':'trainers/office_worker_f', 'Sra. Perla':'trainers/madame',
  'Ivo':'trainers/sightseer', 'Dorian':'trainers/youngster_gen8', 'a voz do duto':'trainers/youngster_gen8', 'o garoto da maca':'trainers/psychic', 'o mais velho dos quatro':'trainers/fisherman_gen6xy',
  'o voluntário sem nome':'trainers/worker', 'Sr. Bram':'trainers/kurt', 'Sra. Tansy':'trainers/madame',
  'o mais velho da mesa':'trainers/worker_gen7',
  'o magro de boné':'trainers/fisherman_gen6', 'Sr. Alder':'trainers/heath',
  'Varian':'trainers/laventon2', 'o senhor do museu':'trainers/laventon2', 'o homem do bar':'trainers/waiter', 'Sra. Myrtle':'trainers/office_worker_f',
  'a mulher do fogo':'trainers/backpacker_f', 'Sr. Berto':'trainers/gentleman', 'Janus':'trainers/doctor',
  'Sr. Yves':'trainers/cabbie', 'Sr. Quint':'trainers/worker_gen9', 'a mulher da locadora':'trainers/clerk_f',
  'Lina':'trainers/office_worker_f', 'o gerente':'trainers/clerk_boss', 'a mulher almoçando':'trainers/pr_worker_f',
  'Rufo':'trainers/courier', 'Cleo':'trainers/lass_gen4dp', 'a mãe da Cleo':'trainers/mom_paldea',
  'o rapaz da caneta':'trainers/league_staff', 'Pipoqueiro da face sul':'trainers/garcon',
  'a mulher de tailleur':'trainers/officeworkerf_gen9', 'a senhora da barraca':'trainers/pokefanf_gen4',
  'o rapaz do posto':'trainers/pokemon_ranger', 'o homem de terno claro':'trainers/gentleman_gen6xy',
  'o homem de terno escuro':'trainers/office_worker', 'a mulher do ferry':'trainers/madame_gen4', 'o homem do ferry':'trainers/gentleman_gen6',
  'a funcionária da prefeitura':'trainers/office_worker_f', 'a diretora da escola de Cinnabar':'trainers/teacher',
  'a recepcionista da pousada':'trainers/clerk_f', 'o homem da ferragem':'trainers/clerk',
  'a dona do armazém':'trainers/clerk_f', 'o homem do macacão':'trainers/worker_gen4',
  'a funcionária da reserva':'trainers/pokemon_ranger_f', 'a mulher do baralho':'trainers/madame',
  'Sr. Dunmore':'trainers/cook_gen7', 'Sr. Pell':'trainers/gentleman_gen4dp', 'o rapaz da descarga':'trainers/worker',
  'a moça do berçário':'trainers/pokemon_breeder_f', 'Livia Gale':'trainers/office_worker_f',
  'a editora do jornal':'trainers/madame_gen4dp', 'Falk':'trainers/worker_gen6', 'Sr. Delmar':'trainers/postman',
  'Sr. Nolan':'trainers/worker', 'o cozinheiro':'trainers/chef', 'a supervisora':'trainers/league_staff_f',
  'o conselheiro mais velho':'trainers/gentleman', 'Leo':'trainers/acetrainer_gen7', 'Tessa Rue':'trainers/veteranf_gen6', 'a mulher de trinta':'trainers/veteranf_gen6',

  /* quem tem nome fixo (NOMES_FIXOS) usa o MESMO rosto antes e depois
     de dizer o nome: o rótulo e o nome apontam pro mesmo arquivo */
  'a funcionária da guarita':'trainers/office_worker_f', 'o rapaz do protocolo':'trainers/clerk',
  'a balconista da farmácia':'trainers/clerk_f', 'o homem de barba':'trainers/cedricjuniper',
  'Thea Larkin':'trainers/pr_worker_f', 'o rapaz da enfermaria':'trainers/doctor',
  'o colega da enfermaria':'trainers/worker', 'Pascal':'trainers/worker',
  'a técnica de jaleco':'trainers/scientist_f',
  'o sargento de Viridian':'overworld/policial', 'Sargento Holt':'overworld/policial',
  'a editora do Jornal':'trainers/reporter_gen8', 'Hazel Moss':'trainers/reporter_gen8',
  'a avaliadora da Associação':'trainers/madame',
  'a coordenadora da quadra':'trainers/league_staff_f', 'Coordenadora Maple':'trainers/league_staff_f',

  /* quem só falava e ficava sem rosto: agora todo mundo que fala tem.
     Voz de rádio e de telefone ganha o rosto de quem está do outro lado */
  'o locutor':'trainers/waiter', 'uma voz no salão':'trainers/gentleman', 'outra voz':'trainers/lady',
  'Stellan':'trainers/psychic', 'Funcionário da doca':'trainers/worker', 'outra acampada':'trainers/picnicker',
  'Funcionária da reserva':'trainers/pokemon_ranger_f', 'o locutor do rádio':'trainers/office_worker',
  'o homem da Defesa Civil':'trainers/firefighter', 'o homem da caixa térmica':'trainers/fisherman', 'a voz do rádio':'trainers/league_staff',
  'Roland':'trainers/league_staff', 'Roland (central do Planalto)':'trainers/league_staff',
  'Caçadores da Rota 23':'trainers/roughneck', 'a voz do telefone':'trainers/office_worker_f',
  /* os operários da câmara do Monte da Lua, ouvidos de cima da passarela */
  'a voz que conta':'trainers/worker', 'a voz de baixo':'trainers/worker', 'outra voz de baixo':'trainers/worker',
  'o locutor da arena':'trainers/league_staff', 'Supervisora da arena':'trainers/league_staff_f',
  'Conselheira do broche':'trainers/madame_gen6', 'Nico Hart':'trainers/jamie',
  'Nilo, o do posto':'trainers/worker', 'a voz do outro lado':'trainers/office_worker',
  'Maren de Pewter':'trainers/lass', 'a menina do formulário':'trainers/lass', 'Ida':'trainers/lass',
  'Museu de Pewter':'trainers/gentleman',
  /* quem troca na estrada e tem nome no rótulo */
  'Arlo da pedreira':'trainers/hiker', 'Dara da pedreira':'trainers/backpacker_f',
  'Beatrix, da escola de natação':'trainers/swimmer_f',
  'As duas da caixa de gelo':'trainers/twins', 'quem estava na porta antes de você':'trainers/ace_trainer',

  /* caminho da Lei */
  'o delegado de Fuchsia':'trainers/veteran', 'Delegado Crane':'trainers/veteran',
  'a delegada de Saffron':'trainers/veteran_f', 'a delegada':'trainers/veteran_f', 'Delegada Thorne':'trainers/veteran_f',
  'o advogado da Comissão':'trainers/collector_masters', 'Dr. Bramble':'trainers/collector_masters',
  'Motoqueiro da escolta':'trainers/biker', 'Segurança da Estação 4':'trainers/policeman_gen8',
  'o técnico da prancheta':'trainers/worker',
  /* caminho da Rocket */
  'o contato da Terceira':'trainers/team_rocket_grunt_m', 'Rook':'trainers/team_rocket_grunt_m',
  'Guarda da reserva':'trainers/pokemon_ranger_f',
  /* caminho da Ciência; o Professor é o Oak de verdade */
  'Professor Oak':'trainers/oak', 'Oak':'trainers/oak',
  'a pesquisadora de bota':'trainers/pokemonbreederf_gen8', 'Dra. Quill':'trainers/pokemonbreederf_gen8',
  'a mulher do envelope':'trainers/office_worker_f', 'Recolhedor da Comissão':'trainers/veteran',
  /* caminho da Imprensa */
  'o fotógrafo do Jornal':'trainers/cameraman', 'Bastian Fern':'trainers/cameraman',
  'a assessora da reserva':'trainers/office_worker_f', 'Vigia do portão':'trainers/veteran',
  'a voz da lavanderia':'trainers/pokemon_breeder_f', 'o homem do carro cinza':'trainers/officeworker_gen9',
  'o oficial de justiça':'trainers/office_worker',
  /* caminho da Criação */
  'a tratadora da Associação':'trainers/pokemon_breeder_f', 'Mina Bray':'trainers/pokemon_breeder_f',
  'Caçador de filhote':'trainers/roughneck', 'Técnico do berçário':'trainers/scientist',
  'Representante da Comissão':'trainers/veteran',
  /* caminho da Liga */
  'o pai do patrocínio':'trainers/richboy_gen6',
  /* caminho do Herói */
  'a brigadista de Fuchsia':'trainers/workerf_gen8', 'Tess Calder':'trainers/workerf_gen8',
  'a mãe do píer':'trainers/mom_alola', 'Dale':'trainers/fisherman', 'a mãe do menino':'trainers/mom_hoenn',
  /* caminho do Mercenário */
  'o intermediário':'trainers/gambler', 'o chefe do manejo':'trainers/worker',
  'o velho do caminhão':'trainers/gentleman', 'Edith':'trainers/tyme',
  /* caminho do Foragido */
  'o atravessador':'trainers/pr_veteran_m', 'Corwin':'trainers/pr_veteran_m',
  'Guarda da ponte':'overworld/policial', 'a técnica fugida':'trainers/scientist_f',
  /* caminho do Andarilho */
  'a mulher do mapa':'trainers/backpacker_f', 'Tamsin Reed':'trainers/backpacker_f',
  'o velho da primeira fogueira':'trainers/expert_gen6', 'a moça de macacão':'trainers/pokefan_f',
  'o menino do balde':'trainers/youngster', 'o treinador de capa de chuva':'trainers/veteran',

  /* terceira leva: cada um com o rosto que a descrição pede, de mais
     acervos (todas as gerações do Showdown, os sprites de fã do Smogon e o
     PokeRogue, em pr_*). Ninguém mais divide rosto com quem não é igual a ele:
     idade, ofício, roupa e sexo saem do texto da cena. */
  'a criança de nove anos':'trainers/preschoolerf_gen7', 'a criança':'trainers/preschooler',
  'o senhor do cimento':'trainers/janitor_gen7', 'o menino da escada':'trainers/youngster_gen6',
  'a operária':'trainers/workerf_gen8', 'o da aliança':'trainers/worker_gen6',
  'o rapaz da câmera':'trainers/cameraman_gen6', 'a mulher da bandagem':'trainers/hayley',
  'a oficial de cinza':'trainers/league_staff_f', 'a mulher do carregador':'trainers/mom_hoenn',
  'Elsa':'trainers/schoolkidf_gen6', 'a mulher da varanda':'trainers/mom_unova2',
  'a senhora do mural':'trainers/cogita', 'Menina do mural':'trainers/schoolkidf_gen3',
  'a mulher da tripulação':'trainers/waitress_gen9', 'Rina':'trainers/baker',
  'uma cozinheira':'trainers/baker', 'o homem do megafone':'trainers/pokefan_gen6',
  'Homem do corredor':'trainers/clerk_boss', 'Vizinho do 38':'trainers/gamer_gen3',
  'a moça do cartório':'trainers/clerkf_gen8', 'A Terceira':'trainers/charm',
  'a Terceira':'trainers/charm', 'o leiloeiro':'trainers/pr_rich_m', 'Milo':'trainers/risingstar',
  'o rapaz das sete insígnias':'trainers/risingstar', 'a mulher do fogareiro':'trainers/backpacker_f',
  'o guarda-parque mais velho':'trainers/pokemonranger_gen6', 'Kell':'trainers/pokemonranger_gen6',
  'o guarda-parque mais novo':'trainers/pokemonranger_gen4',
  'a oficial da Liga':'trainers/league_staff_f', 'a médica de Cerulean':'trainers/miriam',
  'o pescador de gorro':'trainers/fisherman_gen3',
  'a mulher da beirada do cais':'trainers/fisher_gen8', 'o capitão do porto':'trainers/sailor_gen6',
  'Nina':'trainers/schoolkidf_gen4', 'Brent Fennel':'trainers/fisherman_gen6xy',
  'Marla Clover':'trainers/harmony', 'a mulher dos quatro':'trainers/harmony',
  'a mulher do mural':'trainers/acetrainerf_gen6', 'o oficial de cinza':'trainers/policeman_gen7',
  'o repórter':'trainers/office_worker', 'a ex-técnica da Estação 2':'trainers/veteranf_gen7',
  'o rapaz novo':'trainers/clerk_gen8', 'Dona Briar':'trainers/pokefanf_gen6',
  'a dona da pensão':'trainers/pokefanf_gen6', 'o guarda da primeira':'trainers/policeman_gen7',
  'o guarda da terceira':'trainers/policeman_gen7', 'o oitavo guarda':'trainers/policeman_gen7',
  'o guarda da sétima':'trainers/policeman_gen7', 'o guarda da quinta':'trainers/policeman_gen7',
  'Dario':'trainers/streetthug', 'Sra. Vale':'trainers/touristf2', 'Nico':'trainers/jamie',
  'o revelador':'trainers/mirror', 'o presidente da associação':'trainers/owner',
  'Hal':'trainers/tarragon', 'o porteiro da reserva':'trainers/postman',
  'o menino do muro':'trainers/youngster_gen4', 'o senhor do corredor':'trainers/gentleman_gen6',
  'a mulher de terno':'trainers/clerkf_gen8', 'o primeiro da ponte':'trainers/youngster_gen9',
  'o sexto da ponte':'trainers/camper_gen6', 'Sr. Fuji':'trainers/mrfuji_gen3',
  'o estagiário do fim da escada':'trainers/office_worker',
  'a estagiária do meio':'trainers/schoolkidf_gen8', 'Cora':'trainers/schoolkidf_gen8',
  'a mulher do quatorze':'trainers/pokefanf_gen6xy', 'a mulher que atende':'trainers/mom_unova',
  'o menino do Caterpie':'trainers/youngster_gen9'
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
  /* a Liga anda de uniforme cinza ("um oficial da Liga, de uniforme cinza"):
     o policial de Alola, de cinza, e não o de azul da cidade */
  [/^(o )?oficial\b/i,                   'trainers/policeman_gen7'],
  [/^(o )?(barqueiro|capitão do porto|marinheiro)/i,'trainers/sailor'],
  [/^(o )?pescador\b/i,                  'trainers/fisherman'],
  [/^(a |o )?repórter\b/i,               'trainers/reporter'],
  [/^(o )?médico\b/i,                    'trainers/doctor'],
  [/^(a )?médica\b/i,                    'trainers/doctorf_gen8'],
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
  'trainers/team_rocket_grunt_m':30, 'trainers/team_rocket_grunt_f':30, 'trainers/rival':35, 'trainers/lucas':35, 'trainers/ezra':35,
  'trainers/ace_trainer':35, 'trainers/ace_trainer_f':35, 'trainers/diana':35, 'trainers/worker':50,
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
  'trainers/artist':30, 'trainers/rancher':40, 'trainers/cook':30,
  /* a rede (js/story/rede.js): os rostos de HG/SS sem a letra no peito */
  'trainers/rede_recruta_m':30, 'trainers/rede_recruta_f':30, 'trainers/rede_chefe':70,
  'trainers/rede_executivo_velho':80,
  /* rostos novos de quem luta: o mesmo que a classe antiga pagava */
  'trainers/gardener':70, 'trainers/policeman_gen8':70, 'trainers/madame_gen8':70,
  'trainers/officeworkerf_gen9':70, 'trainers/richboy_gen6':70, 'trainers/expert_gen6':70,
  'trainers/nolan':30, 'trainers/worker_gen7':20, 'trainers/pr_rich_f':80,
  'trainers/blackbelt_gen7':25, 'trainers/dragontamer_gen6':40, 'trainers/hiker_gen4':35,
  'trainers/acetrainer_gen6':35, 'trainers/veteran_gen7':35, 'trainers/harlequin':10,
  'trainers/rory':15, 'trainers/otto':90
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
  'o Professor':'trainers/oak', 'Rico':'trainers/worker', 'Maeve Bracken':'trainers/reporter',
  'quem te atendeu':'trainers/league_staff', 'a assistente do Professor':'trainers/scientist_f',
  'a assistente nova':'trainers/scientist_f', 'a enfermeira de Viridian':'overworld/nurse_joy',
  'outro dos seis':'trainers/fisherman', 'os pescadores':'trainers/fisherman',
  'os três':'trainers/pokefan'
};
const ROSTO_POR_PALAVRA = [
  [/\bvoz\b|r[áa]dio|telefone|locutor/i, null],
  [/^Sra\.?\s/i, 'trainers/madame'],
  [/^Sr\.?\s/i, 'trainers/gentleman'],
  [/entregador|encomenda|correio/i, 'trainers/courier'],
  [/leiloeiro/i, 'trainers/gentleman'],
  [/contramestre|navio/i, 'trainers/sailor'],
  [/carregador|frentista|seguran[çc]a/i, 'trainers/worker'],
  [/crach[áa]|escrit[óo]rio|assessor|advogad|secret[áa]ri|recepcion|guich[êe]|junta|cart[óo]rio|pessoal|coluna|atendente|balconista|diretor|editor|presidente|cadastro/i, 'office'],
  [/tripula|ferry|barco|casco|marinh|porto|cais/i, 'trainers/sailor'],
  [/oper[áa]ri|pe[ãa]o|macac[ãa]o|setor|esta[çc][ãa]o|t[ée]cnic|mec[âa]nic|obra|cimento/i, 'trainers/worker'],
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
