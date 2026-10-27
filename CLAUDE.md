# PokéRPG — como mexer neste projeto

## Regra permanente
**Toda mudança de mecânica tem que aparecer na folha de regras** (`UI.modalRegras`,
em `js/ui/interface.js`). Mudou fórmula, limite, custo, sistema novo ou número de
balanceamento? Atualiza a seção correspondente no mesmo commit. Regra que existe no
código e não está na folha é regra que o jogador não tem como saber.

Isso não briga com o pedido de tirar as dicas: a folha de regras é o lugar onde as
regras moram, aberta de propósito por quem quer ler. O que não pode é o jogo
explicar a regra durante a partida — nada de "pra essa missão pokémons calmos
ajudam", nada de descrição de quem é quem no PokéNav. O jogador repara jogando.

## Capítulo não sabe do futuro
Um capítulo pode **citar o nome** de um lugar aonde o jogador ainda não foi —
a carta da Liga fala do Planalto Indigo no capítulo 17, o navio vai pra
Cinnabar no capítulo 8. Isso é como o jogador descobre pra onde ir.

O que ele não pode é usar um **fato** que só se descobre depois. Se uma cena
do capítulo 32 diz "trezentas e onze, o mesmo número de baias da Estação 4",
ela está contando pro jogador uma coisa que ele só vai ver no capítulo 19 —
e pior, os capítulos condicionais (29 a 32) rodam no meio da jornada, não
no fim. Presságio insinua; não entrega.

E presságio (`ef.presagio`) **nunca diz o que vai acontecer**: nada de
"guarde isso", "isso vai voltar", "você vai precisar disso lá embaixo".
Ele repara no que está na cena e para ali. O jogador descobre jogando.

Isso não dá pra conferir com script: nome de lugar citado antes é normal e
fato citado antes não é detectável. Confere na leitura.

## Nome de personagem
**Registro: o das localizações dos jogos.** Samuel Oak, Giovanni, Célio, Bill,
Lorelei, Lance. Nem japonês, nem brasileiro — internacional, curto, fácil de
ler em voz alta. Sobrenome no espírito dos professores, que são todos planta:
Oak, Elm, Birch, Rowan. "Estilo do anime" aqui quer dizer o anime dublado,
que usa os nomes localizados, não os japoneses.

Cargo fica como cargo: "a atendente do Centro", "o barqueiro", "a enfermeira".
Quem carrega uma cena e assume risco ganha nome, porque nomear é como o jogo
diz que aquilo é uma pessoa — e numa história sobre instituição que
transforma bicho em "lote" e em "recurso", isso importa dentro do texto.

Três armadilhas que já aconteceram:
- o personagem **diz o próprio nome na fala** e o balão por cima continua com
  a descrição ("Reika Ando, Correio de Kanto" debaixo de A REPÓRTER);
- dois personagens **se chamam pelo nome** no diálogo e nenhum dos dois tem
  nome no balão ("Quatro, Tetsu" debaixo de O MECÂNICO MAIS VELHO);
- a narração diz que **ela assina com o nome completo** e o jogo nunca conta
  qual é.

`ferramentas/chk-nomes.js` lista quem tem 12+ falas e nenhum nome. Não é erro
automático: recusa escrita de propósito é resposta válida — mas aí a recusa
precisa estar no texto, não ser esquecimento.

E desde `js/data/nomes.js` o jogador pode **perguntar o nome de qualquer um**
que fale com ele, em qualquer cena, pelo botão ou escrevendo no campo livre.
Isso muda o que "anônimo" quer dizer no projeto: personagem sem nome não é
mais personagem que o jogo esconde, é personagem que o jogador ainda não
perguntou. Quem não deve dizer entra em `RECUSAM_O_NOME`, com a recusa
escrita à mão — porque recusar é caracterização e não pode ser sorteada.

Quem carrega cena e se arrisca ganha nome fixo em `NOMES_FIXOS`, e a
cena em que a pessoa entra mostra o nome (crachá, placa, porta pintada)
numa linha que chama `Nomes.apresentar(rotulo)` — dali em diante o balão
usa o nome, e perguntar antes dá o mesmo nome, nunca um sorteado. Rótulo
compartilhado por pessoas diferentes em capítulos diferentes ("a
recepcionista") ganha rótulo próprio antes ("a recepcionista da Liga"),
senão o nome de uma vira o de todas. Cargo que é função de cidade em
cidade fica em `CARGO_DE_PROPOSITO`. `chk-nomes.js` lê as três listas.

Duas ferramentas conferem tudo isso junto. `ferramentas/chk-rostos.js` lê o
código: toda pessoa que fala (fala, falante, vozes, npc, contatos, trocas,
rivais, líderes, Elite, veteranos) tem rosto pela regra do balão
(`UI.retratoFala`), o arquivo existe em `sprites_nds/`, quem carrega cena
tem nome, recusa ou cargo, quem diz o próprio nome tem o balão sabendo, e
nome fixo é apresentado em alguma cena. `ferramentas/chk-baloes.js`
renderiza no navegador toda cena (capítulos, eventos, linhas, PokéNav) e
confere cada balão de verdade: nome em cima, rosto e arquivo no disco.
Pessoa nova que fala entra com rosto em `treinadores.js` — pelo rótulo,
ou pela palavra do cargo em `ROSTO_POR_PALAVRA`.

`ferramentas/chk-lutas.js` faz o mesmo pras lutas: começa cada uma pela
função de verdade (ginásios, Elite, Campeão, torneio, o Ezra nos cinco
arcos, os rivais extras em cada arco, estrada nos quatro escalões,
veteranos, Conferência, barreiras, revanches e toda luta de cena), nas
duas fichas, vence e perde, e confere fala, rosto, time e a cena pra onde
a luta manda. Luta nova roda ali antes do commit.

`ferramentas/chk-telas.js` faz o mesmo pras **janelas e lugares**: monta
um save cheio do meio do jogo (time de seis com shiny, PC, cemitério,
mochila com TM e ferramenta quebrada, todo lugar visitado) e um do começo
(um Pokémon, mochila vazia), abre toda janela — os cinco bolsos, time,
sumário, Pokédex e as 251 fichas, PokéNav e cada contato, cartão, ficha,
diário, rota, finais, credenciais, PC, ajustes, regras, tutorial e mapa —,
toda loja comprando e vendendo, a tela de cada posto e de cada doação, o
rival na saída do capítulo, o chaveamento do torneio e da Conferência em
cada rodada, o "Qual Pokébola?", e todo lugar do mapa com cada afazer da
lista dele, e acusa erro de JavaScript e texto quebrado (`undefined`,
`NaN`, `null`, marca sem resolver, HTML vazando). Janela nova ou afazer
novo passa por ali. Texto que entra numa janela montada à mão, sem
`UI.esc`, não resolve a marca de gênero: a folha de regras já mostrou
`sentad{o|a}` assim.

Tela que monta conversa (`telaCargo`, `telaDoacao`, as do rival) chama
`UI.limpar()` **antes** de pôr o falante: o `limpar` zera
`falanteDaCena`, e o posto já saiu com metade das falas no balão do
jogador e a outra metade sem dono. Fala de posto e de doação vai por
`fala()`, nunca aspa solta. E o atalho pro Centro dessas telas
(`Jogo.hubCentro`) é o balcão da cidade (`Cidade.atender`), com licença,
conta e hora: só aparece onde tem Centro. O balcão dorme até as seis de
noite, anda um período de dia e não mexe no relógio no meio de uma cena
de capítulo; a casa, o mesmo.

## Nada do mundo real
O mundo é o de Pokémon, e nele **não existe bicho de verdade**: nada de
cachorro, gato, peixe, gado, mula, cavalo, urubu, morcego. Onde o texto
precisa de um, entra o Pokémon que ocupa aquele lugar (Tauros de carga,
cardume de Magikarp, Murkrow, Zubat, Miltank no pasto), e o genérico é
**"Pokémon"**, nunca "bicho". A bola é **Pokébola** (o item na mochila
continua com o nome dos jogos: Poké Ball, Great Ball); "bola" sozinha só
quando é bola de brinquedo. Nada de encurtar. O trio Raikou/Entei/Suicune é o **trio lendário**, nunca "cães".

O mesmo vale pro que só existe no nosso mundo:
- comida de bicho real: peixe, carne, sardinha, frango viram alga, queijo,
  ovo, polpa de fruta, ração marinha;
- material de bicho real: couro vira lona ou vinil;
- marca e objeto do nosso dia a dia: fita crepe, durex, isopor, post-it,
  band-aid, xerox, papel A4, marmita (quem come, está almoçando);
- profissão e órgão: médico de Pokémon (não veterinário), controle de
  bichos (não zoonoses), registro comercial (não CNPJ), número de documento
  (não CPF), imposto da casa (não IPTU), Kanto (não União); sem "Ltda.";
- religião, festa e esporte reais: sem Deus, missa, igreja, padre, Natal,
  futebol — a conversa de bar é sobre a Liga, a vigília é na Torre.

Expressão que carrega bicho no meio também sai: "burrice" é besteira,
"pé de cabra" é alavanca, "galo na testa" é calombo, "motor de quarenta
cavalos" é motor forte. Item que muda de nome ganha conversão em
`Estado.carregar`, senão some da mochila de quem já tinha.

## Não existe HM
Nenhum Pokémon aprende "Corte" ou "Surf" aqui. O que existe:

- **machado** e **picareta** são objeto de mochila, comprados na ferragem;
- **atravessar água** pede tipo Água de porte médio ou grande;
- **voar** pede tipo Voador de porte grande que voe de verdade — Doduo,
  Dodrio e Gyarados têm o tipo e não decolam, e estão em `NAO_DECOLA`. É
  também o Fly do mapa: com ele, o mapa leva a qualquer cidade já pisada;
- **forçar** pede porte grande, de qualquer tipo;
- **iluminar** pede lanterna (gasta pilha) ou bicho que emita luz (não gasta).

Porte e luz moram em `js/data/porte.js`, por número de dex. `Campo.cortar()`,
`.surfar()`, `.voar()`, `.forcar()`, `.quebrar()` e `.iluminar()` devolvem
`{pode, quem, como, falta}` — sempre com o `falta` preenchido, porque a cena
precisa poder **dizer o que falta** em vez de esconder a opção. Ver a porta
fechada é o que faz querer a chave.

Cena nova que dependa disso entra em `js/story/campo.js`, com `portaDeCampo()`
pro rótulo que muda sozinho. `ferramentas/chk-campo.js` confere.

## A arena sai do lugar
São **duas coisas separadas**, e confundir as duas dá bug:

- o **cenário** é uma imagem por ambiente, em `sprites_nds/arenas/`;
- a **arena** é o grupo de ambientes que compartilham o tipo de chão, e é
  ela que manda nas bases sob os pés e no gradiente de reserva.

Nove ambientes, nove cenários, cinco arenas. O mapa das duas coisas está em
`js/data/arenas.js` (`FUNDO_POR_AMBIENTE` e `ARENA_POR_AMBIENTE`):

- `campo`, `floresta` → grama;
- `agua` → água;
- `caverna`, `montanha`, `vulcao` → rocha;
- `cidade`, `ruina`, `cemiterio` → piso duro;
- ginásio, Elite dos Quatro, torneio e Conferência entram **por cima de tudo**,
  na quadra (`Arenas.ehQuadra`); luta marcada em arena passa `arena:'ginasio'`.

A quadra é a única arena sem imagem — fundo de ginásio livre não existe pra
baixar — então ela é pintada em CSS: arquibancada com a fileira de luzes e a
torcida, refletor, e as linhas da quadra em perspectiva (um SVG embutido no
próprio CSS: o retângulo que afina pro fundo, o meio e o círculo).

Três armadilhas que já aconteceram aqui:

- **URL dentro de `var()`.** O navegador resolve caminho relativo pela pasta
  do CSS, não pela da página, e o fundo some calado. Por isso `Arenas.fundoDe()`
  devolve caminho absoluto (`new URL(rel, document.baseURI)`).
- **Enquadramento único não serve pras nove.** O mar da praia está no alto da
  imagem e a lava do vulcão no pé dela; cada ambiente tem o seu `--ar-foco` no
  CSS. Cenário novo entra com o foco junto.
- **A arena empilhada do celular saiu.** Ela existia porque a faixa única
  deixava o segundo lutador no escuro e esticar a imagem numa caixa alta
  ampliava demais. Hoje a cena é uma só em toda largura, no formato dos
  jogos: a imagem cobre a arena inteira, e no celular a cena é a mesma,
  menor (290 px de altura), com os dois lado a lado. Caixa larga não
  amplia a imagem: a de 753×500 cabe quase inteira.

Os dois lutadores ficam **na diagonal**, como no Showdown, pra qual os
cenários foram desenhados: o seu embaixo à esquerda, maior (está mais perto
de quem olha), o de lá mais alto à direita, menor. Quem manda são as
variáveis da `.arena`, por largura de tela: `--cena-alt`, `--arte-eu` e
`--arte-ele` (o quadro de cada um), `--x-eu`/`--x-ele` (o meio de cada um)
e `--pe-eu`/`--pe-ele` (a altura do pé). Se os dois pousassem na mesma
linha, um deles estaria flutuando sobre o chão que a imagem desenha.

Cada `.arte` é uma caixa do tamanho do quadro do sprite, posta na cena
pelo pé: a borda de baixo é o chão, e **a base (a sombra) mora ali**, no
`::after` da própria caixa — sombra descolada do pé é bicho flutuando, e
foi assim que já quebrou. O `.lutador` não desenha nada
(`display:contents`): arte e ficha são camadas da cena, e as classes dele
(`fixo`, `caido`, `capturado`, `por-entrar`) continuam valendo pros
filhos. Medir o `.lutador` com `getBoundingClientRect` dá zero; quem
precisa de posição mede a `.arte`, o sprite ou a `.arena`.

As camadas, de baixo pra cima: cenário (0), fundo de golpe do Showdown
(1), os dois Pokémon (2; quem ataca sobe pra 4 durante a cena), clima e a
bola do arremesso (5; a bola entra depois e fica por cima), efeitos de
golpe (6) e as fichas de HP (8), que nada cobre.

O **fundo do site** sai da **cor do jogo** que quem joga escolhe nos Ajustes
(`CORES_MOLDURA` em `interface.js`, `data-moldura` em `estilo.css`): cada
cor é um conjunto inteiro no jeito do azul da abertura — degradê de fundo
(`--fundo-topo`, `--fundo-site`, `--fundo-pe`, brilho em `--fundo-brilho`),
painel, borda e texto secundário. O padrão é o azul-noite; "Do capítulo"
deixa o tom de cada capítulo mandar no painel. A abertura e a película do
cenário leem as mesmas variáveis. Cor nova entra com as quatro do fundo.
A abertura fica no meio da tela (`body.na-abertura`).

Fora da batalha, o **fundo da página** também é o lugar: `CENARIO_POR_LOCAL`
(em `arenas.js`) dá um cenário a cada ponto do mapa — os nove da batalha,
mais `prado.png` (Pallet, Rota 1, Fuchsia) e `gelo.png` (Seafoam). Em cena
de capítulo cujo ambiente não é o do lugar, vale o do capítulo. É só
estética, fica escurecido e puxado pro tom do capítulo, e entra por
`UI.pintarCenario()`, chamado no `topo()` de toda tela. Lugar novo em
`LOCAIS` precisa de entrada aqui também.

Capítulo que anda por mais de um lugar escreve `ambiente` como função da
cena (o 17 começa no Centro de Viridian, sobe a trilha da Rota 23 e acaba
numa clareira), e quem lê o ambiente do capítulo passa por
`Arenas.doCapitulo(cap)`, nunca por `cap.ambiente` direto.

Ambiente novo em capítulo ou em `LOCAIS` tem que entrar nos dois mapas junto,
senão cai no fundo de reserva sem ninguém perceber. `ferramentas/chk-arenas.js`
confere arena, imagem no disco, desenho no CSS e foco de enquadramento. Cena
que precise fixar a arena passa `arena:` na batalha.

As imagens de cenário vieram dos fundos de batalha do Pokémon Showdown
(`play.pokemonshowdown.com/fx/bg-*.png`), mesma categoria de arte de fã dos
1264 sprites que o projeto já embute. Crédito no README.

## A arte é de corpo inteiro
Frente e costas são Black/White, em `battle/front_full/`,
`front_full_shiny/`, `back_full/` e `back_full_shiny/`. As de HG/SS
enquadram de perto e cortam nas bordas. Os **ícones de equipe**
continuam HG/SS: ícone é outra arte, não a mesma imagem reduzida.

**Em movimento, são as GIFs animadas de Black/White da PokeAPI**
(`battle/front_ani/`, `back_ani/` e os `_shiny`), em batalha, Pokédex,
PC e sumário. Elas vêm recortadas no tamanho do bicho e com o pé na
borda de baixo — todo mundo na mesma escala de pixel, Bulbasaur pequeno
e Lugia enorme, como no jogo. `ajustarSpriteAni` desenha cada uma na
escala que o CSS dá ao quadro de 96 px da arte parada (`.ani`), e na
arena soma à margem os 24% que a arte parada tinha embaixo do pé.
Quem mede a arte pergunta `peDoSprite(img)` (76% na parada, 100% na
GIF) — `Efeitos.alvo`, a cena do Showdown e o desmaio já perguntam.
Com GIF o repouso é o da própria GIF: o `AnimadorSprite` não respira
por cima. Sem a GIF a `<img>` cai sozinha na arte parada
(`spriteParado`). O `pokerpg.html` **embute as GIFs**
(`SPRITES_SO_NO_UNICO` no `build.py`; ~52 MB, ~5 s pra carregar); o
`artefato.html` não, porque a publicação tem teto de 16 MB — lá a arte é
a parada.

Duas consequências que mordem e já estão no CSS. Os dois números
foram **medidos** pelo canvas nas 251 espécies, não chutados:

- a arte guarda **24% do quadro em transparência embaixo**, nas duas
  vistas, então sem puxar pra baixo o bicho flutua acima da própria
  sombra;
- ela ocupa **53% do quadro**, contra 62% da antiga de frente e 76%
  da antiga de costas, então sai menor na tela sem ter encolhido. Por
  isso o quadro da arena é grande: 192 px o seu e 160 px o de lá no
  computador (2x e 1,67x a arte de 96), 128 e 104 no celular. O
  lutador aliado fica maior que o inimigo de propósito, o que também
  acerta a perspectiva — é ele que está mais perto de quem olha.

Trocar de conjunto de arte é mexer em **quatro telas**, não só na
batalha: combate, ficha da Pokédex, varredura da Pokédex e PC. O
`grep` de `imgSprite` acha todas.

**Nunca escreva `filter` direto num sprite.** O estado dele mora em
`--fx-sprite`, e quem quiser somar um efeito escreve
`var(--fx-sprite, opacity(1)) mais-alguma-coisa`. Um `filter` com
seletor mais específico já apagou a silhueta uma vez — e silhueta
apagada é o jogo entregando de graça espécie que o jogador ainda não
catalogou, além de sumir com o brilho do shiny. `opacity(1)` é o
não-efeito, porque `none` não pode ser somado a outro filtro.

E **testar porte só de um lado não vale**: o adversário tem três
estados que o seu nunca tem — catalogado, silhueta e brilhante — e foi
testando sempre com o mesmo Rattata pequenininho que a silhueta quebrada
passou batida.

Pasta que saiu de uso fica na árvore mas entra em `SPRITES_FORA`, no
`build.py`, senão o arquivo único carrega megabytes que ninguém pede.
`ferramentas/chk-sprites.js` confere as duas pontas: pasta apontada
tem que existir e estar completa, e o build não pode pular pasta em
uso. Caminho pra pasta ausente não quebra nada — cada `<img>` se apaga
sozinha — e é por ser silencioso que precisa de script.

## Ícone de item e arremesso da bola
Ícones em `sprites_nds/items/`, 30×30. `ITEM_SPRITE` (em `js/data/sprites.js`)
vai do nome que **o jogo** usa pro arquivo, e só entra item com equivalente
exato nos jogos — Resto de Ração é Leftovers porque a ficha é a mesma, Faixa
Firme é Focus Band porque sobrevive com 1 HP. Ferramenta que só existe aqui
(Machado, Picareta, Lanterna…), as mochilas e o papel de enredo ganham
**desenho em SVG** de `js/data/icones.js` (`desenhoDoItem`, pelo nome; o
papel de enredo pelo tipo: bilhete, foto, mapa, caixa, chave). Lugares,
ações e opções do Centro usam os ícones de traço do mesmo arquivo
(`svgIcone`, `iconeDoAfazer`): afazer novo com id novo entra lá.

A **mochila tem os bolsos dos jogos** (`BOLSOS`, em `sprites.js`): Itens,
Remédios, Pokébolas, TMs e Itens-chave, com os ícones de bolso de
Platinum em `sprites_nds/items/bolsos/`. O bolso sai da categoria do
item (`bolsoDoItem`); ferramenta que acaba (`CONSUMIVEL_DE_CAMPO`: Pilha,
Isca) é item comum, a que fica é item-chave. Categoria nova entra num
bolso, senão cai em Itens-chave. Na luta, TMs e Itens-chave não abrem.
**Pokédex, PokéNav, Cartão de Treinador e Mapa moram em Itens-chave**
(`APARELHOS`, em `interface.js`): tocar abre, e o aparelho aberto tem no
topo o caminho de volta (`abasMochila`, que agora devolve a barra
"‹ Mochila"). Os ícones são os de menu dos jogos — Pokédex e Cartão de
Platinum, PokéNav de Ruby/Sapphire/Emerald — do acervo da Bulbapedia.
A **loja tem cor própria**, a do Poké Mart (`.modal.loja`): toldo
listrado, placa azul, visor da caixa e etiqueta de preço; a mochila
continua na cor da bolsa que você carrega.

O arremesso segue uma máquina de estados (`UI.animarArremesso`): arco de
Bézier até o alto, sobre a cabeça → abre, um raio vermelho pega o Pokémon,
ele fica vermelho com linha de aura (o recolher do anime) e encolhe pra
dentro → cai na vertical até a base → chacoalha 15° pra cada lado
com 0,5 s entre validações → brilho, ou abre e o sprite de frente volta.

**A animação obedece ao dado, nunca o contrário.** `Captura.tentar` grava
em `Captura.ultimo` o desfecho e o número de chacoalhadas de cada uma das
sete saídas (captura, escapou, rompeu, recusou, quebrou…), e a tela lê
dali. Saída nova em `captura.js` tem que chamar `anima(...)`, senão a bola
não voa.

Três armadilhas que já aconteceram aqui:

- **`opacity` inline não esconde o sprite.** Ele entra com a animação
  `surgeSprite` (fill both), e animação CSS ganha de estilo inline: o
  Pokémon ficava de pé ao lado da bola que devia estar com ele dentro. Use
  `visibility`.
- **A máscara branca é um clone, nunca o sprite.** O `filter` dela começa
  com `brightness(0)`, que mata a cor antes do `invert` pintar de branco —
  medido: saturação 0,04 na máscara isolada, com espécie não catalogada.
- **Meia volta a mais e a bola pousa de cabeça pra baixo.** O giro do voo
  termina em volta inteira (`GIRO = 720`).

A bola **na arena** é a da mochila de Black/White, da PokeAPI
(`sprites/items/gen5`), em `sprites_nds/animations/pokeball/{tipo}-ball.png`,
por `spriteDaBola(nome)` — a mesma geração dos sprites de batalha, e 24 px
a 1,25× dá a escala da arena. O ícone da mochila continua o outro. A
PokeAPI não tem arremesso, bola aberta nem captura animada: o movimento é
nosso. A mesma entrada pela bola serve aos dois lados
(`Efeitos.entradaPorBola`): o seu sai da bola em que foi pego, o do
treinador adversário sai da mão dele no fundo (`bolaDoAdversario`: Elite
e Conferência de Ultra Ball, líder e veterano de Great Ball). Selvagem
não tem bola. E o aviso de troca no motor sai **depois** de trocar o
lutador: com o `ev` antes, a foto é a do antigo e a tela não vê a troca.

Bola aberta, brilho e inclinação não têm arquivo: os endereços de
`ball_open` e `sparkle` dão 404 na origem, e `tilt_left`/`tilt_right` são
byte a byte a bola fechada. A aberta é a fechada cortada ao meio, a
inclinação é rotação e o brilho é desenhado.
Ela abre **pela costura**: as duas cascas se afastam na vertical, na
mesma medida (`ABRE_CASCA`), e o clarão sai da fenda do meio; nada gira.
Capturou, a ficha de lá ganha `.capturado` (corpo e sombra somem e não
voltam no redesenho) e a bola pisca três vezes e some. Quem mede a arte
pra máscara branca espera ela carregar (`Efeitos.spritePronto`): GIF
sem carregar tem o tamanho do quadro inteiro, e a máscara saía gigante.
A sombra (`.arte::after`) some com HP zero (`.sem-sombra`, `.caido`).

## O turno é encenado
`Batalha.ev()` põe em **todo** evento uma foto dos dois lutadores e do
treinador (`fotoA`, `fotoI`, `fotoJ`: uid, hp, hpMax, status). O motor
continua resolvendo o turno inteiro de uma vez; `Efeitos.encenar`
(`js/ui/efeitos.js`) toca a lista um evento por vez e anima o que mudou
de uma foto pra outra: golpe (`lado` no evento), dano (pisca três vezes,
barra desliza), cura (brilho verde), condição nova, troca de lutador. Só
no fim a arena se redesenha com o estado final.

Consequências:
- **evento novo passa por `this.ev`**, nunca por `eventos.push` direto,
  senão ele chega sem foto e a tela não sabe o que animar;
- a arena não se redesenha no meio do turno; quem precisa (troca) chama
  `UI.atualizarArena()` e repinta as barras com a foto do instante;
- `atualizarArena` marca `.fixo` quem já estava lá, pra arte não "entrar"
  de novo a cada turno.

Golpe é **a animação do próprio Showdown**. `js/data/golpes-showdown.js`
é gerado por `node ferramentas/gerar-golpes-showdown.js <pasta dos .ts>`
(`battle-animations-moves.ts`, CC0, e `battle-animations.ts`, MIT, do
`pokemon-showdown-client`), com os 212 golpes de `GOLPES` e o que eles
chamam por dentro; as imagens ficam em `sprites_nds/animations/showdown/`.
Golpe novo em `GOLPES` pede rodar o gerador de novo. Quem toca é
`CenaShowdown` (`js/ui/cena-showdown.js`): uma cena de mentira anota
`showEffect`, `backgroundEffect`, `anim` e `delay`, e depois tudo roda com
Web Animations. Quatro coisas que já morderam aqui:
- **posição**: a profundidade `z` anda pela linha entre os centros dos
  nossos dois lutadores, e `x`/`y`/tamanho crescem pelo tamanho do
  sprite — pela distância, os efeitos saíam enormes e o pulo do Tackle
  saía pelo teto da arena. A altura ainda é limitada pelo céu que a
  arena tem acima do bicho de lá;
- **fundo** (céu escuro do Thunder, roxo do Psychic) cobre a cena
  inteira por baixo dos dois Pokémon (`.arena > .sd-fundo`); as fichas
  de HP flutuam por cima dele pela camada, nunca por conta;
- **cópia de sprite** (rastro do Quick Attack) leva o `filter` do sprite:
  sem isso a silhueta vira bicho colorido e entrega a espécie;
- **quem ataca fica por cima** do outro durante a cena (a `.arte` dele
  sobe de camada), senão o pulo do Tackle e o rastro do Quick Attack
  passam por trás do bicho de lá.

Golpe que o Showdown deixa vazio (Earthquake, Reflect, Substitute…) cai na
animação nossa, em `Efeitos.golpe`: imagens de efeito do Showdown em
`sprites_nds/animations/moves/`, com os nomes de arquivo do roteiro
(`physical_scratch`, `special_fire`, `stat_boost`…). Os endereços dos
roteiros eram **ícones de item da PokeAPI** — Fire Stone, X Attack, disco
de TM, Potion — e isso já aconteceu três vezes: link de
`sprites/items/` nunca é animação. Confere a imagem antes de usar.
Essa animação nossa: físico investe e bate pelo jeito
(`jeitoDeBater`), especial brilha 0,2 s na cor do tipo e o projétil de
`FX_TIPO` viaja, status solta `stat_boost`/`stat_drop`.

## A velocidade da luta
Quem joga escolhe **1×, 2× ou 3×** no botão do canto de cima à direita
da arena (`Velocidade.botao()`, desenhado no `atualizarArena`) ou nos
Ajustes (`Velocidade.ajustes()`), e a escolha fica no navegador
('jc-vel-luta'). O botão mora fora de `#acoes` de propósito: o menu
apaga (`.esperando`) enquanto o turno é encenado, e é justo aí que se
quer apertar. Só a encenação muda; dado, conta e turno são os mesmos,
nada é pulado.

**Todo tempo da luta passa por `Velocidade`** (`js/ui/velocidade.js`):
- espera: `Velocidade.ms(ms)` — o `Efeitos.esperar` já passa;
- Web Animations: `Velocidade.acelerar(el.animate(…))`, que põe o
  `playbackRate` (atraso e duração encolhem juntos e o `finished` chega
  na hora). O `Efeitos.tocar` (e com ele a cena do Showdown), o
  `AnimadorSprite`, `abrirBola`/`fecharBola` e o arremesso já passam;
- CSS da luta: `calc(.34s / var(--vel-luta, 1))` — a variável mora na
  raiz, então só regra da luta lê (a barra de HP da arena, as fichas
  entrando, o clima, o sprite surgindo, a linha do registro e a
  leitura da Pokédex).
Animação nova na luta passa por um desses, senão fica em 1× no meio das
outras, e a espera casada com ela desencontra (a barra desliza enquanto
o `esperar(560)` corre). Loop sem fim (respiração, chuva) fica no ritmo
dele. Trocar no meio de um golpe acelera o golpe: `aplicar()` muda o
ritmo do que já está andando na arena, menos CSS (que lê a variável) e
loop. A evolução e o treino ficam de fora: não são a luta.

Medido numa luta de líder: a abertura vai de ~6,1 s a ~3,3 s e ~2,3 s,
e um turno de dois golpes de ~2,9 s a ~1,7 s e ~1,1 s — a 3× sobra a
latência de quadro entre um passo e outro.

## O corpo do Pokémon na luta
O que o **lutador** faz com o próprio corpo mora em
`js/ui/animador-sprite.js` (`AnimadorSprite`; os nomes da especificação,
`play_idle()` e companhia, estão em `PokemonSpriteAnimator`). Efeito de
golpe, partícula e texto não entram ali. Um estado por lado, em
`ESTADOS_SPRITE`: IDLE (respira em loop, ou sobe e desce quem paira —
`PAIRA_NO_AR`), ATTACK_PHYSICAL, ATTACK_SPECIAL, TAKE_DAMAGE, FAINT,
ENTRY, RETREAT, STAT_BOOST/DROP. Quem dispara é o turno encenado:
`Efeitos.golpe` (conjura antes do especial; investe antes do físico só
se a cena do Showdown não leva o atacante — `CenaShowdown.mexeAtacante`),
`Efeitos.reagir` (dano, desmaio quando a barra zera, recolher e entrar na
troca, e o evento com `estagio` que `mudarEstagio` grava) e
`UI.atualizarArena`, que chama `AnimadorSprite.montar()`.

- **Só `translate`, `scale` e `opacity`.** O `transform` é da cena do
  Showdown e do tremor de golpe; as propriedades separadas somam com ele.
  `filter` nunca — a silhueta mora em `--fx-sprite`.
- **A escala gira em volta do pé** (`transform-origin: 50% 76%` no
  sprite). A cena do Showdown escala pelo centro, então ela compensa na
  conta (`pe` em `CenaShowdown.tocar`); quem escalar sprite de outro
  jeito compensa também.
- **Degrau (`steps`) vai em cada quadro, nunca no tempo da animação
  inteira**: no tempo inteiro ele segura o primeiro quadro até o fim. O
  pisca-pisca de dano e a faísca da paralisia ficaram parados assim sem
  ninguém ver.
- Desmaiado volta da arena como `.lutador.caido`, sem sprite; animação
  com `fill:'forwards'` (recolher, desmaio) é cancelada no `entrar`.
- Ritmo do IDLE sai do porte e do número da dex, fase do uid: o mesmo
  Pokémon respira sempre igual, dois Pidgey não respiram em uníssono.
- Sprite quadro a quadro (Gen 5) entra por
  `AnimadorSprite.registrarQuadros(dex, vista, {quadros|folha, fps})`;
  a lista está vazia: as GIFs de Black/White já animam sozinhas, e a
  respiração pela escala só vale pra arte parada (artefato, ou GIF que
  não carregou).

Condição, cura e clima continuam **desenhados em CSS**. Cor por cima do
Pokémon é clone sem `.sprite`, pintado por filtro SVG que só lê o alfa
(`Efeitos.filtroDeCor`), então silhueta continua silhueta.

A abertura (`Efeitos.abertura`) é: treinador com rosto entra pela direita,
recua pro fundo e **fica lá a luta inteira** (`.treinador-fundo`); depois a
bola do seu sai do canto de baixo, abre, e ele nasce branco e ganha cor.
Rosto de treinador mora em `js/data/treinadores.js` (Showdown, 80×80) —
quem não tem equivalente honesto fica sem, e a abertura pula o treinador.
A exceção é a figura de capuz: nenhum treinador do acervo é alguém
encapuzado, e o rosto dela é pixel art nossa, no mesmo 80×80, gerada
por `python3 ferramentas/desenhar-capuz.py` (capa, sombra no lugar do
rosto, as mãos no caderno e a barra sumindo em névoa).

**O rosto sai da descrição, não da classe.** Quem carrega cena tem o
rosto que o texto pede — idade, ofício, roupa e sexo —, e ninguém divide
rosto com quem não é parecido com ele. O acervo é o do Showdown inteiro
(todas as gerações e o Smogon Sprite Project, com o nome do arquivo de
lá: `gentleman_gen7`, `madame_gen6`) e quatro do PokeRogue (`pr_*`).
Pessoa nova lê a cena antes de escolher: o Célio tem uns cinquenta anos e
não é o entregador de boné; a Elsa tem treze e não é funcionária de
escritório; a cozinheira do Anne é mulher, e o `cook` é homem. Os
oficiais da Liga andam de cinza (`policeman_gen7` pelo cargo, a mulher
pelo `league_staff_f`); o de azul (`overworld/policial`) é polícia de
cidade. Arquivo novo que vem de luta entra em `PAGA_POR_CLASSE` com o que
o antigo pagava, e o veterano muda pelo `arq`. O de GBC (Polished Crystal)
foi olhado e ficou de fora: no balão, entre os de Black/White, parece
outro jogo.

Golpe de status que faz outra coisa além de mexer em número tem
`ef.acao` e mora em `Batalha.acaoEspecial` (Protect, Substitute, Reflect,
Leech Seed, Transform, Roar…). Estado que o golpe deixa fica no `est` do
lutador (`novoEstado`) e some quando ele sai; o que vale pro lado inteiro
(Reflect, Light Screen, Mist, Safeguard) fica em `Batalha.lados`. Tudo
isso aparece na ficha de HP por `Batalha.marcas(lado)`, que vai junto na
foto de cada evento. Efeito secundário de golpe de dano só acontece na
`ef.chance` dele — sem chance, é sempre.

Golpe que acaba a luta (Roar, Whirlwind, Teleport) chama `encerrar` no
meio do turno: o resto do turno tem que parar ali (`!this.ativo`).

Clima (Rain Dance, Sandstorm) mora em `Batalha.clima` e dura cinco turnos;
o evento que muda o clima leva `clima` e a camada é **uma só, pela cena
inteira** (`.arena > .clima-camada`, camada 5): por cima dos dois Pokémon e
por baixo das fichas de HP, que ficam limpas.

Gritos: `sons/gritos/{dex}.ogg`, versão legacy da PokeAPI (~6 KB cada);
o `build.py` embute junto com os sprites.

Som mora em `js/ui/som.js` (`Som`). Cada coisa tem o seu controle:
geral, música, sons da interface (canal `efeitos`) e sons dos Pokémon
(canal `gritos`), mais o mudo, em `localStorage` ('jc-audio'), lidos por
`Som.volume(canal)` — `tocarGrito` e `somLigado` passam por ali. Som de
interface é sintetizado (`Som.EFEITOS`: toque, pokedex, scan, arremesso,
abrir, clique, item, compra, pc, cura) e entra por `Som.efeito(nome)` no ponto em
que a coisa acontece — `pc` na primeira abertura do PC (`UI.modalPC()` sem
argumento), `cura` nas três curas do balcão (`Cidade.atender`). Quem está em
`EFEITOS_COM_ARQUIVO` toca `sons/efeitos/<nome>.ogg` se ele existir (o build
embute) e cai no sintetizado se não; o **toque** sai sozinho em todo clique de botão,
escolha, porta e aba (botão que já tem som próprio leva
`data-sem-toque`). A trilha segue a tela (`Som.contexto`) e é trocada no
`topo()`: na luta, `batalha:<tipo>` (selvagem, treinador, rival, líder,
elite — `Som.tipoDeLuta`) toca a faixa de batalha do Pokémon Showdown
do tema (`TEMAS_DE_MUSICA[].luta`, arquivos em
`sons/musica/showdown/`); rota, cidade e caverna não têm faixa no
Showdown e tocam `sons/musica/<pasta>/`, se quem joga puser, ou a
sintetizada. Tentativa de arquivo é assíncrona: toda troca muda
`_geracao`, e erro de trilha velha não liga nada por cima da nova.

**Cada ginásio tem a sua faixa**, em qualquer tema do Showdown
(`faixasDosGinasios`): cada faixa de `FAIXAS_SHOWDOWN` tem energia e
marcas de clima, cada ginásio é lido por quatro lados — tipo
(`MARCAS_DO_TIPO`, peso 3), jeito do líder (`MARCAS_DO_LIDER`, 2),
lugar (`MARCAS_DO_LUGAR`, 2) e dificuldade, que vira a energia
esperada (−1,2 por ponto de distância) — e a escolha é gulosa, sem
faixa repetida entre ginásios. Faixa nova ou ginásio novo entra com as
marcas, não com a faixa escrita à mão. As faixas voltam no ponto de
laço do próprio Showdown (`laco`, em ms), não no começo do arquivo.

Fora da luta, a trilha sintetizada é **calma** (`Som.CALMAS`,
`tocarCalma`): composição própria no clima de cidade pequena dos jogos
(flauta com vibrato, dedilhado, colchão, eco) — cidade em 3/4 e rota em
4/4. Três lugares fogem disso, e o contexto sai do ambiente do capítulo
na cena e do lugar no mapa (`Som.contexto`):
- **caverna** (`tocarCaverna`): quase silêncio — grave que mal se ouve,
  gota sem hora marcada, e de vez em quando um ronco ou um tom que sobe
  e some. Sem melodia, sem laço fixo: é sorteado enquanto toca;
- **torre** (ambiente `cemiterio`: Lavender e a Torre): caixinha de
  música desafinada em Dó menor, colchão tremendo e sussurro;
- **esconderijo** (`CENAS_DO_ESCONDERIJO`, por capítulo e id de cena: a
  operação no Monte da Lua e o depósito/cassino de Celadon): radical,
  bumbo, baixo serrote e riff.

Luta contra a equipe vilã toca faixa radical do Showdown
(`LUTAS_DO_VILAO` por cena, `FAIXA_DO_VILAO` dentro do esconderijo), e
**cada rival tem a sua** (`FAIXA_DO_RIVAL`, pelo id do rival extra, e o
Ezra pelo arco — parceiro troca de faixa). Cena nova de esconderijo
entra no regex do capítulo; rival novo entra com faixa. Melodia nova soma exatamente os tempos
dos compassos (`acordes.length × compasso`), senão a volta desencontra. O
`build.py` deixa `sons/musica/` fora do arquivo único.

## O combate é Pokérole
**Tudo é Pokérole 3.0**, combate e cena. O Pokémon briga com os atributos
do livro; o treinador testa com o status (o atributo) + `PERICIA_BASE` (2
dados de perícia) + o cinto, numa parada de d6 com sucesso em 4+
(`Dados.teste`, `Dados.testeComTime`). A `dificuldade` que as cenas
escrevem continua na escala antiga (4 a 11) e vira sucessos pedidos em
`Dados.sucessosPedidos` (1 a 5); os graus saem da sobra (um a mais é
crítico, na conta é sucesso, faltou um é parcial, faltaram dois é
fracasso), então as cenas não precisaram mudar. A conta escrita sai de
`Dados.contaDoTeste(r)`. d4, d10, d20 e d100 não existem mais pra
ninguém: os últimos foram a captura comum e o selvagem agressivo, que
hoje rola o Instinto dele e vem pra cima de você com um sucesso (no
começo do jogo dá os mesmos 55% do d20 antigo; quem tem mais Instinto
vem mais vezes).

- **Atributos** moram em `p.stats` com as chaves do livro: `for`, `des`,
  `vit`, `esp`, `ins` e `hp`. As chaves dos jogos (`atk`, `def`, `spa`,
  `spd`, `spe`) **não existem mais em `p.stats`**; continuam só como nome
  de estágio no `est` da batalha e em `ef.sobe`/`ef.baixa` dos golpes,
  traduzidas por `ATRIB_DO_ESTAGIO`. Save antigo é convertido na carga
  (`atualizarAtributos`).
- **Nível continua**: `calcularStats(dex, nível, ivs, natureza)` parte do
  mínimo da espécie em `PR_ESPECIE`, dá um ponto a cada 7 níveis e manda
  pro atributo de maior peso (atributo base dos jogos, natureza ×1,3/×0,7,
  Vitalidade nunca abaixo da média), sem passar do teto. É determinístico.
- **`js/data/pokerole.js` é gerado**, não se edita à mão:
  `python3 ferramentas/gerar-pokerole.py <Pokerole-Data>/v3.0`. Golpe novo
  em `GOLPES` precisa rodar o gerador; nome que difere do livro entra em
  `RENOMEADOS` lá dentro.
- Toda rolagem de combate passa por `Dados.pool(n, motivo)` ou
  `Dados.chanceDados(n, motivo)`, que vão inteiras pra bandeja. A conta
  aparece no log como evento `rolagem` — **número que decide o turno tem
  que estar escrito ali**, senão o jogador não tem como conferir.
- Dano de condição e de item é número fixo do livro (veneno 2, queimadura
  1, Potion 2), não fração do HP: o HP vai de 4 a uns 20. O que continua
  fração (Substitute, Curse, Recover) tem `Math.max(1, …)`.

**Não existe PP**, como no livro: golpe não acaba (o campo `pp` ainda
mora no slot, de save antigo, e ninguém lê). Éter e Elixir repõem
Vontade (1 e 2), e o PP Up dá +1 de Vontade máxima (`p.vontadeExtra`,
até 3, somado em `vontadeMaxDe`).

Duas adaptações, as duas escritas na folha de regras: o crítico pede mais
sobra no posto alto (no livro a sobra vira ação extra na rodada, e aqui cada
um age uma vez), e **não existe choque, e esquiva só gastando Vontade** —
esquiva de graça em todo golpe derrubava o acerto pra 35%.

**Vontade** (Will, Pokérole 3.0) mora em `p.vontade`; leia por
`vontadeDe(p)` (save antigo começa cheio), máximo `vontadeMaxDe(p)` =
Instinto + 2. Os gastos são os do livro (GM Screen do SRD 3.0 em
`/home/user/willowlark/pokeroleobsidiansrd`): Forçar o destino (+1
sucesso na precisão), Arriscar (rerrola um dado que falhou), Esquivar
(a adaptação: Destreza + Evasão contra a precisão do outro) — um deles
por turno, armado antes do golpe (`Batalha.gastarVontade`, válido em
`vontadeDoTurno()`) — e Aguentar a dor (`Batalha.semDor`, a luta inteira).
Quem zera numa luta desmaia no `encerrar`. `curarTotal` enche, treino
devolve 2, vitória 1. **Todo adversário gasta**, selvagem também: `iaGastarVontade` roda no
começo de todo turno — Aguentar a dor com dor 2, Esquivar na metade do
HP, Forçar o destino com golpe impreciso ou dor, Arriscar com golpe
forte, nunca o último ponto; o gasto vive em `vontadeInimigo` só naquele
turno. `vontadeIA:true` na batalha (líder, Elite, rival, torneio,
veterano, revanche) vira `vontadePeso` e gasta com a chance cheia; o
resto, com metade. Os simuladores
fazem o jogador gastar com o mesmo critério: medido assim, líder caiu
4 pontos na média (80% → 76%) e veterano ficou na mesma faixa.
**O treinador também tem Vontade** (`Estado.vontadeJogador()`, 2 +
Resistência): nos testes de cena, "rolar gastando 1 de Vontade" dá um
sucesso a mais, garantido; zerar custa metade do HP (adaptação: no livro desmaia). O dado é **d6 com sucesso em 4+**; o pedido de
trocar por d10 com sucesso em 6+ já apareceu e foi recusado, porque isso
é Storyteller, não Pokérole. Toda parada vai pro log com as faces
(`facesDe(r)`).

## O que o olho lê e o que o time come
Tipo e natureza de quem está do outro lado **não têm dado**: o tipo
aparece com a espécie catalogada ou com Percepção e Intelecto 4
(`leTipo`, `LEITURA_DO_TIPO`); a natureza, com Percepção 3
(`leNatureza`). Líder que "fala do time" só anuncia o nome — natureza
alheia nunca vem de graça. Postos (`POSTOS`, 3.0) dão o número de
golpes de quem nasce no mato ou em time alheio (`golpesDoPosto`: 2, 3,
4) e aparecem no cabeçalho da rota. O inicial aleatório sai de
`sortearInicialDaCasa` (entrega.js): 1d6 de coluna, cidade ou jeito da
ficha, 1d6 de linha.

Fome mora em `js/engine/fome.js`: `p.comeu` em horas corridas,
`Fome.passar()` no `Relogio.avancar`, toda cura completa alimenta.
Treino e acampamento gastam Ração; o treino ainda pede
`TREINO_ESPERA_MIN` minutos reais entre um e outro, porque acampar pula a
noite do jogo e o treino era por dia do jogo.

**A fome e a moral pesam, mas não atrapalham** — foi pedido assim, depois
que a medição (relógio de 1 minuto real por hora, −4 de moral a cada 12 h
de fome e a história tirando até 45 num capítulo) deixou o time perto de
moral 0 do capítulo 8 ao 12, com uma ordem em cada dez ignorada. Hoje:
- com Ração na mochila o time **come sozinho** quando o dia passa (uma
  por dia, `Fome.passar`), e o topo da tela mostra quantas sobram
  (`racaoNoTopo`) e o aviso da refeição (`Fome.avisos`);
- sem Ração a fome chega **primeiro na luta** (`Fome.distrai`: 10% com
  fome, 20% faminto, em `Batalha.vontade`) e só o faminto perde moral,
  `FOME_MORAL` a cada 12 h até `FOME_TETO` por jejum;
- pulo de dia que a história conta como vivido **alimenta**: o
  `fecharCapitulo`, o ônibus da Liga, `Relogio.viver`. Pulo novo de
  `relogio.dia` escrito à mão chama `Fome.alimentarTime()` junto, senão o
  primeiro tique do relógio cobra os dias de uma vez;
- a moral que **a cena tira** passa por `moralDaCena` (em `motor.js`): no
  máximo `MORAL_CENA_TETO` (10) por cena e nunca abaixo de
  `MORAL_PISO_CENA` (30). O que a cena dá entra inteiro. Abaixo de 30, só
  o que acontece com o próprio Pokémon (fome, Forfeit, par solto ou morto).
`node ferramentas/sim-moral.js` anda os capítulos 1 a 20 com o motor e
mede a moral por capítulo, de quem anda com Ração e de quem nunca compra:
hoje a média fica entre 50 e 85, e a desobediência pela moral abaixo de
2%. Mexeu em fome, em moral de cena ou na conta de desobedecer, roda ali.

## Trocas
**Cada pessoa troca uma vez só** (`TROCAS`, em `mercado.js`;
`Trocas.repete` é sempre falso). Quem tem `alt` (duas versões além da
original, cada uma com `da`, `fala`, `memoria` e, se precisar, `depois`)
decide **no primeiro contato** qual Pokémon vai oferecer
(`Trocas.versao`, guardada em `d.trocaVersao`) e fica com ela. O jogador
não escolhe, e nada no jogo — nem a tela, nem a folha — conta que havia
outras. Leia sempre por `Trocas.efetiva(t)`, nunca `t.da` direto. As três
opções de cada troca comum são **forma base, comuns no mato** (peso 5+ em
`ENCONTROS`) e chegam **abaixo do nível de evolução** (`nivelEvo`) —
`ferramentas/chk-trocas.js` confere isso, e também que fala e memória
nomeiam o Pokémon certo. Troca nova comum entra com `alt`; troca que gira em volta de um Pokémon só
(fóssil, o Marowak da senhora, o Golbat da Torre, o Hypno da praça, o
Machoke de `trocaEvolui`) fica sem `alt`.

Depois da troca a pessoa vira contato do PokéNav e **sabe as duas
pontas**: pergunta do que foi com ela (`trocasFeitas[id].deu`) e do que
foi com você (`.recebeu`, a espécie que chegou, já evoluída se for o caso).
Passar por ela de novo também: ela pergunta pelo que te deu.

A fala de quem troca chama o Pokémon dela de "ele", então o da primeira
troca chega macho, se a espécie tiver macho (`generoDaTroca`; troca que
fala de outro jeito escreve `da.genero`). O que você deu foi seu, e o
texto concorda com ele: `depois` pode ser função do Pokémon que saiu
(`meu => …pron(meu)…`), e a ligação do contato resolve `{ele}`, `{o}`,
`{dele}` pelos sexos guardados na troca (`deuGenero`, `recebeuGenero`).

**Haunter e Kadabra só vêm da figura de capuz.** Ela é quase
aparição (rótulo `'a figura de capuz'`, que recusa o nome em
`RECUSAM_O_NOME` e não tem nome fixo): a neblina baixa e ela está no
banco, sem passo no cascalho; a neblina passa e o banco está vazio.
Fala como quem pensa em voz alta, e **não conta nada de si** — nem
nome, nem de onde vem, nem há quanto tempo, nem quantas insígnias. Te
chama pelo nome que você não disse, e isso fica sem explicação. Faz as
três perguntas de índole em Lavender (`lav_a_pergunta_do_curador` e as
duas `encadeado` que seguem por `segue:`; `indoleDoJuniper` soma
`ef.juniper`, empate fica com a primeira) e some.

**Ela não tem PokéNav.** Quem chama de volta é a **intuição**
(`js/story/intuicao.js`): com quatro insígnias (`INSIGNIAS_DA_INTUICAO`,
que o jogo não diz) a tela do mapa avisa que a intuição pede pra
voltar a Lavender (`Intuicao.talvez`, aviso `tipo:'intuicao'`, a lua),
uma vez e depois um lembrete por capítulo; em Lavender aparece "Seguir
a intuição até a porta do abrigo" (`Intuicao.afazeres`), que abre a
entrega em pessoa (`lav_capuz_volta`, `Intuicao.entregar`). Dois
capítulos depois (`CAPS_ATE_COMPLETAR`), com o Pokémon dela no cinto, a
intuição volta: ela segura a Pokébola e devolve evoluído
(`lav_capuz_completa`, `Intuicao.completar`) — é a troca que completa
Haunter e Kadabra, e o `chk-obtencao` conta com ela pra Gengar e
Alakazam. Recusar é resposta, e ela não volta mais. O presente se acha
por `pokemonDoJuniper` (a marca `p.doJuniper`). Os nomes de código
(`juniper`, `curador`) ficaram de quando ela tinha nome e telefone; o
save velho perde o nome, o contato e a missão na carga. Rosto ela não
mostra: `a figura de capuz` e `Figura de capuz` são o `trainers/capuz`,
desenhado aqui. Nenhuma troca dá Haunter, Kadabra ou alguém da linha
deles, e a troca não oferece Abra nem Gastly. Ela não é o Curador
Fabre da Comissão — são duas pessoas.

Evento com `encadeado:true` não entra no sorteio do lugar: só chega por
`segue:` de outra escolha.

A Pokédex de Kanto tem 150 casas (`DEX_KANTO_IDS`); Mew e os lendários
de Johto entram por `idsKanto()` só depois de vistos ou catalogados.

## Todo Pokémon de Kanto tem caminho
Os 151 têm que dar pra ter, e `node ferramentas/chk-obtencao.js` confere:
junta mato e vara (`ENCONTROS`), inicial, presente e luta capturável
escritos nas cenas, troca (só conta se o que a pessoa pede também dá pra
ter) e fóssil, e fecha pelas evoluções — nível, pedra que se compra ou
acha, e troca só onde alguém faz. Quem só sai num sorteio de uma vez (a
compra do depósito, uma das três versões de uma troca) aparece como "só
na sorte" e reprova: precisa de outro caminho.

Os que não vêm do mato:
- **fóssil** é item (`tipo:'fossil'`, com `dex`), achado vasculhando
  caverna com Sorte crítica (Monte da Lua: Hélice e Domo; Túnel da
  Rocha: Âmbar). Quem revive é o laboratório de Cinnabar
  (`js/story/laboratorio.js`, `d.labFossil`), um de cada vez,
  `HORAS_DO_FOSSIL` depois, no `NIVEL_DO_FOSSIL`;
- **Porygon** está no balcão de prêmios do cassino de Celadon
  (`PRECO_PORYGON`), que aparece em toda cidade com `'cassino'` em
  `lugares`;
- **evolução por troca** só acontece com quem troca com você: o Arlo
  (Túnel da Rocha) entrega Machamp, a Dara (Rota 9) entrega Golem, os
  dois com `trocaEvolui`; a figura de capuz completa, na neblina de
  Lavender, só o que ela mesma deu. Diglett e Dugtrio saem nas duas pontas da caverna deles
  (Rotas 2 e 11), que não é lugar do mapa.

Espécie nova numa tabela, troca nova ou fonte nova: roda o verificador.

**Lendário ronda depois de aparecer na história** (`js/story/lendarios-errantes.js`).
Quem tem `encontros > 0` ou `visto` (a luta de cena com `tipo:'lendario'`
marca, em `main.js`) e está solto passa a andar pelos lugares de
`LENDARIOS_ERRANTES`, e `Exploracao.encontro` rola `CHANCE_ERRANTE` (1%)
em todo encontro selvagem do mapa; se sair, a luta é `tipo:'lendario'`,
com a captura de sempre. Evento de agenda que já escolheu o Pokémon passa
`{fixo:true}` pro `encontro`, senão o lendário toma o lugar dele. O Lugia
não ronda: a história nunca põe ele na sua frente. O texto da entrada
repara no sinal (frio, estalo, calor) e na disposição dele; não conta onde
mais ele anda.

**Captura é a do Pokérole 3.0, pra todo Pokémon** (`captura.js`): o
selo da bola (`SELO_DA_BOLA`: Poké Ball 4d6, Great 6d6, Ultra 8d6) + os
bônus da condição (`bonusDaCondicao`: metade do HP 1, 1 HP 2, 1 por
condição) contra os sucessos que o posto do exemplar pede
(`SUCESSOS_DO_POSTO`, por `postoDoNivel`). **O nível manda, não a
espécie**: taxa de captura não existe mais, e a varredura da Pokédex
mostra quantos sucessos aquele exemplar pede. A fórmula dos jogos com
três d100 saiu a pedido — "quero o do Pokérole". As sacudidas saem do
que faltou (na conta, três e o clique; faltou um, duas; faltaram dois,
uma; mais que isso, nenhuma), e a animação obedece. Lendário: só Ultra
Ball e Master Ball (`BOLAS_DE_LENDARIO`; qualquer outra recusa e gasta)
e conta no mínimo como Ás (10); com HP cheio é impossível de propósito,
o pedido foi "bem difícil". A Master fecha sem rolagem. Quem quebra a
bola (`QUEBRA_BOLA`: Mewtwo, Lugia, Ho-Oh, Celebi) rola 2d6 antes de
tudo, e sem sucesso nenhum ela racha no ar (1 em 4). A rolagem vai pro
log inteira.

## Ferramenta gasta, e o balcão compra
`js/engine/desgaste.js`: Machado, Picareta e Lanterna têm `DURABILIDADE` em
usos; o estado (nova, meio desgastada, desgastada, quebrando, quebrada) sai
da fração gasta e aparece na mochila. Quebrada fica na mochila
(`d.quebrados`) até descartar, e não serve: `Campo._tem` conta só as
inteiras. Gasta em dois lugares: vasculhar no ambiente dela
(`AMBIENTE_DA_FERRAMENTA`, +1 dado de Percepção) e `ef.desgaste` na escolha
de cena que usa a ferramenta — nunca em `cond` nem em texto, que rodam toda
vez que a tela redesenha. A lanterna também gasta 1 Pilha por uso, e sem
pilha não acende. A loja tem Comprar e Vender: venda paga metade de
`PRECO_BASE`, ferramenta gasta vale ¾, ½ ou ¼, quebrada e a mochila em uso
não vendem. Tudo na folha de regras.

## TM e mapa
As TMs são as de Red/Blue e as de Gold/Silver que ensinam golpe que a 1ª
não ensina, cada uma com o número dos jogos dela (`js/data/tms.js`). São todas as
de Gold/Silver que não repetem golpe da 1ª. Os
números se repetem entre as gerações (TM11 é Bubble Beam e é Sunny Day),
então a TM é **geração + número** (`'2.11'` em `TM_COMPAT`), nunca só o
número. TM de golpe que não existe aqui fica vaga — o número não é
reaproveitado. Quem aprende o quê (`TM_COMPAT`) saiu dos learnsets de Gen 1
e 2 do Showdown (`data/mods/gen2/learnsets.ts`, códigos `1M`/`2M`); o
`learnsets.js` do cliente do Showdown **não traz** Gen 1/2 e dá tabela vazia.
Golpe novo que entrar em `GOLPES` e for TM de Gen 1 tem que voltar pra
`TM_LISTA` no número dele. O ícone do disco sai do tipo do golpe
(`arquivoTM`), então item TM novo não precisa de entrada em `ITEM_SPRITE`.

**Toda TM tem de onde sair** (`ferramentas/chk-tms.js` confere, junto com o preço e a cor do disco): a Grande
Loja de Celadon (2º andar), o prêmio dos oito líderes (Brock dá Rage, o
mais perto do Bide que ele dá em Red/Blue e que não existe aqui; Blue dá
Sky Attack), os doze veteranos e o chão: `TM_NO_CAMPO`, em
`vasculhar.js`, põe as que sobravam uma por lugar (duas na Rota 24/25),
achadas uma vez só no vasculhar (`tmDoChao`: Sorte crítica sempre, comum
uma vez em cinco; a flag `achou_<TM>` segura). Toda TM tem `PRECO_BASE`
(2.000 a que não está à venda), então o balcão compra. TM nova entra numa
dessas fontes, senão fica impossível de ter.

Loja de vários andares só mostra, em cada andar, o que está na lista
**daquele andar**. Item que entra no catálogo depois (`ESTOQUE_NACIONAL`)
tem que estar também num andar, senão nunca aparece — a Pedra do Sol ficou
invisível assim até alguém olhar.

Toda batalha contra treinador paga. Cena de vitória com `ef.dinheiro` já é
o prêmio; sem isso, paga `pagaPorNivel(classe) × nível do último Pokémon`
(`premioCena`, em `main.js`), com a classe saindo do rosto em
`treinadores.js`.

O mapa desenhado (`Exploracao.mapa`) é o **Town Map de FireRed/LeafGreen**
redesenhado em SVG: `MAPA_GRADE` põe cada lugar na quadra dele (Pallet no
sudoeste, a Rota 22/23 subindo pro Planalto no oeste, a Rota 10 descendo
pelo leste, Fuchsia na costa sul, as ilhas embaixo), a estrada anda reta e
dobra em ângulo (`DESCE_PRIMEIRO` diz qual desce antes), trecho de mar é
tracejado (`NO_MAR`) e o chão (`terrenoKanto`: costa, praia, baía de
Vermilion, o mar encostado na Rota 12 com o píer, lago de Cerulean, serras, mata, ilhas, rosa dos ventos) é
desenhado por baixo. O nome de cada lugar tem posição própria em
`ROTULO_MAPA`, pra nenhum cair em cima de outro: lugar novo entra com
quadra e, se precisar, rótulo.

Lugar `oculto` (a ilha sem nome, o norte da Rota 10, a travessia da
Rota 21) só entra no mapa e na lista de vizinhos por `Mundo.conhecido`:
descoberto (`local_<id>`), já pisado, ou onde o próximo arco espera
(`Historia.proximoDestino`). Sem a última regra a jornada parava: o 16,
o 19 e o 27 esperavam em lugar que o mapa nunca mostrava. Conexão de
lugar escondido vai nos dois sentidos, senão ele só tem saída. E
capítulo que acaba longe de onde começou diz onde (`sai:` na cena
final, lido no `Jogo.fecharCapitulo`): o ferry do 14 desce em Fuchsia,
e o mapa tem que estar lá quando o texto diz que você está.

O mapa desenhado abre com o item **Mapa de Kanto**
na mochila, como o Town Map dos jogos — ou, sem ele, pela parede do Centro
Pokémon de qualquer cidade que tenha um (`Exploracao.temCentro`). O `town-map.png` do roteiro é o
ícone do item, não um mapa.

## A estrada não pede licença
Andar por rota é estar sujeito a ela: entrar numa rota, sair dela, vasculhar,
treinar, acampar e a viagem entre capítulos podem virar briga sem o jogador
escolher. As chances moram no topo de `js/story/estrada.js`
(`CHANCE_TREINADOR`, `CHANCE_SELVAGEM_SURGE`) e estão na folha de regras.
Repelente segura selvagem, não gente.

Briga que interrompe outra coisa segue a outra coisa depois: quem a começou
põe o que vem a seguir em `Jogo.depoisDaEstrada`, e o fim de briga livre
passa por `Jogo.seguirDaEstrada`. Viagem entre capítulos para no máximo uma
vez, num trecho de rota do caminho, e entra no capítulo depois.

Os **treinadores de estrada** (`js/story/estrada-dados.js`) funcionam como os
líderes: quatro times, um por escalão de insígnias (0–1, 2–3, 4–5, 6–8), com
parte sorteada da `reserva`. O time lista a **linha**, não a forma — o nível
escolhe (`finalDaLinha` + `formaAteONivel`). Vencido num escalão, só volta no
seguinte. Quem tem `numero` vira contato do PokéNav na primeira derrota
(`contatosDaEstrada`), com a fala entre aspas virando balão com o nome dele.
Nome de treinador de estrada sai do sorteio de nomes (`NOMES_DA_HISTORIA`) e
ganha rosto pela classe (`arq`).

A força foi **medida**, não chutada: `node ferramentas/sim-estrada.js`
luta cada treinador contra times do tamanho e nível de cada fase, e compara
com selvagens e líderes. O alvo é o jogador no nível da rota + 2 vencer
~90% (líder fica mais difícil que isso), perdendo 1 a 3 Pokémon por luta.
Três coisas que o simulador pegou: time de seis no fim do jogo (24% no
Caminho da Vitória), nível subindo +1 por Pokémon na fila, e evolução por
pedra/troca cedo demais (Arcanine no 22). Daí `TAM_ESTRADA`, o time em 2
níveis e `pisoNaEstrada`. E o jogador simulado **ataca**: com a IA do
inimigo nos dois lados, o seu Pokémon passava a luta dando Growl.

Contato de gente da história entra por `opiniaoDe(rótulo)`, que acha a
pessoa pelo rótulo ou pelo nome perguntado, e sempre depois do capítulo em
que ela aparece.

## A estrada cobra insígnias
`INSIGNIAS_DO_CAPITULO` e `INSIGNIAS_DA_PASSAGEM` (em `js/story/ginasios.js`)
dizem quantas insígnias um capítulo pede pra começar e quantas uma passagem
pede pra atravessar (as guaritas da Rota 23). Quem lê é `travaDoCapitulo(n)`
e `travaDaPassagem(de, para)`, que devolvem `null` ou `{pedidas, tem}` — e a
tela mostra a porta fechada com `textoTrava`, nunca esconde.

A regra que não pode quebrar: **ninguém fica preso**. Misty, Erika e Sabrina
podem recusar o jogador pelo resto do jogo, e Blue só abre com sete. Se
nenhum ginásio que falta está `disponivel`, `faltaInsignias` libera com o
que o jogador tem. Trava nova passa por essas funções, não por `requer` no
capítulo — `requer` pula o capítulo em vez de esperar.

Ginásio com `horario` (Cinnabar: quinta, das 14h às 18h, como diz a
folha da porta no capítulo 14) responde `fechado` fora da hora, com o
dia de hoje no texto. `ginasioAoAlcance` conta `fechado` como aberto:
é só esperar, então não destrava porta nenhuma.

O líder também acompanha a estrada: `pisoDoGinasio()` põe o time no
mínimo em `nivelArea` do capítulo atual − `ABAIXO_DA_AREA` (8). Sem
isso, quem deixava Misty pra depois achava ela no 17 num capítulo de
área 30. Ginásio se desafia na porta, na cidade (`Cidade.ginasio`); a
lista de ginásios não existe mais e não volta.

## Barreiras de escolha
`js/story/barreiras.js` fecha passagem do mapa pelo que o jogador fez
(`BARREIRAS_DE_ESCOLHA`, `fecha(d)`), nos dois sentidos, sempre com outro caminho mais comprido.
Quem fecha com `luta` é um treinador de estrada com `barreira:true` (não
para ninguém na rota; a luta aparece na lista dos dois lados), e vencer
abre de vez. `travaDaPassagem` lê as barreiras antes das insígnias, então
mapa, lista de vizinhos e viagem já respeitam. Barreira nova tem que
deixar o mapa conexo — confere no grafo de `LOCAIS` antes.

Líder tem quatro falas: `intro` (o desafio), `vitoria` (ele perdeu),
`derrota` (ele ganhou) e `depois` (a visita com a insígnia no bolso,
`Cidade.ginasio`).

## Relógio e dia marcado
O relógio conta minuto (um segundo real) entre uma hora e outra
(`Relogio.minutos`, `_marca`), e a **luz** anda junto: `Luz` (em
`mundo.js`) interpola `LUZ_DO_DIA` e põe `--luz-cor` (multiplica o
cenário) e `--luz-brilho` na raiz; o cenário da página e o da arena
leem as duas. Caverna, vulcão e quadra não têm céu. Hora que pula
(acampar, viajar) zera os minutos e repinta a luz na hora.

Na **cena de capítulo** (`d.modo === 'cena'`) o relógio para, como na
luta: quem anda com a hora ali é a história, pelo `ef.executar`. Sem
isso, quem lia devagar via o relógio passar da hora que o texto dizia.

Sem o item **Relógio** o jogador só vê o período (manhã, tarde…): o
`Relogio.texto()` e o `cabecalho()` escondem hora e data. Com ele, dia
da semana, data e hora. O calendário (`Calendario`, em `mundo.js`)
conta a partir de segunda, 1º de março, com mês de tamanho de verdade,
e a jornada começa no dia da perua na cidade natal (`Calendario.inicio`),
que é o dia da entrega no capítulo 1.

**O presente da história é o ano 2000** (`ANO_DO_JOGO`, em `idade.js`).
É nele que as contas dos textos fecham: a usina fechou em 89 e "faz
onze anos", a porta da Silph foi tapada em 96 e "faz quatro", a próxima
janela da ilha do 16 é "em dois mil e seis". Texto que diz "faz N anos"
a partir de um ano escrito conta de 2000. O ano já esteve em 2010 (pra
1º de março cair numa segunda de verdade) e meia história ficou com a
conta errada; o ano não aparece na tela, e o calendário do jogo começa
numa segunda de propósito.

Cena que pula horas (dormir, esperar a noite, viajar) passa o relógio
no `ef.executar`, que roda uma vez: `Relogio.avancar(h)`, `.ate(h)` (a
próxima vez que der h horas), `.amanhaAs(h)` e `.ateODia(s, h)` (o
próximo dia da semana `s`, 0 = segunda). Os dois últimos contam dias
vividos e passam por `Relogio.viver`, que alimenta o time a cada meio
dia: a fome não cobra a semana que a história pulou. Hora escrita no
texto ("são dez e cinquenta") é hora que o relógio desmente: ou o
relógio vai até ela, ou o texto não diz. E o que o texto conta em dias
("está lá há dezenove dias") conta a partir do dia em que a cena
começou, não pra sempre: no capítulo 11 a conta anda com o relógio
(`c11_passados`). Mês escrito à mão mente do mesmo jeito: a jornada
começa em março e cada um chega ao capítulo num mês. No 13 a água
baixou dezenove semanas antes do dia da chegada (`c13_queda`), e o
"julho" e o "agosto" da história são meses contados de trás pra frente
a partir do mês de agora (`c13_mes`). Como o `executar` roda depois de `flag`, `registrar` e
`presagio`, texto que depende do que era verdade antes da cena guarda
isso numa flag dentro do `executar`, antes de marcar o que a cena marca.

Voltar a uma cena de primeiro encontro (a líder que abre a porta, a
fonte que conta tudo na fila do almoço) repete o primeiro encontro. Onde
a cidade inteira tem opção que leva à mesma pessoa, `desvios` no
capítulo manda a volta pra uma cena de reencontro depois que a primeira
aconteceu (`Historia.jaAconteceu`), com a condição `d.cena !== id` pra
não desviar o redesenho da própria cena.

Coisa com dia e hora marcados mora em `js/story/agenda.js` (`AGENDA`):
`local`, `quando()`, `anuncio` (vai pro mural da cidade em `mural`, por
`muralDoCentro`), `titulo` e `fazer()`. Aparece na lista do lugar só na
janela, uma vez por data. A volta da perua do Célio é `DIA_DA_PERUA` —
mural, praça (`ger_a_perua`) e PokéNav leem dali; dia novo entra ali, não
em três lugares. Papel de mural que vira evento sai de `MURAIS`, senão
aparece duas vezes. As janelas casam com os períodos de 6 h, porque fazer
coisa pula de período em período (`Esperar a hora passar` existe pra isso).

## Veteranos e a Conferência
Os **veteranos** (`js/story/veteranos.js`, dados e motor juntos) são o
contrário do treinador de estrada: ninguém te para, você vai atrás pela
lista do lugar (`Veteranos.afazeres`, chamado no fim de
`afazeresDoLocal`). Três números mandam na força e estão na folha de
regras: `PISO_VETERANO` (lugar + 9, fixo), `ACIMA_VETERANO` (quando você
passa do piso, ele acompanha os seus três mais fortes) e
`ERRO_IA_VETERANO` (8%, contra os 22% de todo mundo — é o `erroIA` do
`Batalha.iniciar`). O tamanho do time é **fixo por veterano**, pelas
insígnias que o lugar pede: se crescesse com as suas, voltar mais forte
não adiantaria.

`Jogo.veteranoAtual` tem três tipos — `desafio`, `convite` e `conferencia` — e
o `finalizarBatalha` olha ele antes de tudo. O convite nasce da chamada
(`CHAMADAS`, três dias depois da vitória), vira a flag
`convite_vt_<id>` e aparece como lugar pra ir no mapa até ser cumprido;
perder a luta do convite não apaga o convite. Veterano novo precisa de
`premio` com uma TM (a folha de regras promete isso), de `convite` e,
se for à Conferência, de `conferencia:true`. Convite cuja chamada
marca dia e hora ("sábado, sete da noite") leva `hora:{dia, h}` — abrir
o convite leva o relógio até lá (`Veteranos.irNaHora`) — e, se o fim
conta horas ("a manhã inteira"), `dura`. Fato que o relógio não conta
(lua nova) não entra na chamada. A final da Conferência é sempre quem tem
`final:true`.

`node ferramentas/sim-veteranos.js` mede cada um de passagem (lugar + 2),
treinado (+6) e preparado (+10), os convites e as rodadas da Conferência. O
jogador simulado é ingênuo — time sorteado da área, sem item nem troca
— então o número é o piso: de passagem fica entre 0% e 58%, preparado
entre 10% e 90% (com veterano e jogador gastando Vontade). Espécie cuja evolução é por troca com item (Onix,
Scyther) entra na lista **pela forma final** (208, 212): `finalDaLinha`
não acha o Steelix saindo do Onix.

## Os titulares da Elite
Lorelei, Bruno e Agatha pararam de subir no mesmo mês (o capítulo 17
conta desde quando) e estão em casa: a Lorelei no cais velho de
Fuchsia, o Bruno no turno da manhã da pedreira de Pewter, a Agatha na
casa de janela verde atrás da Torre de Lavender. Dados, decisão e
visitas moram em `js/story/titulares.js` (`TITULARES`, `Titulares`).

- **Voltar depende de decisão**, e nunca da Liga pedir. Cada um lê uma
  coisa que você fez na cidade dele (`jeito(f)`, lido das flags, nunca
  guardado): a Lorelei o gelo das Seafoam (capítulo 13), o Bruno a
  fenda da pedreira (4), a Agatha o sexto andar da Torre (7). Dá
  `volta` (o que você fez basta), `fecha` (não volta), `raiva` (só a
  Agatha: volta pra ganhar de você) ou `talvez`, e no `talvez` a
  conversa na porta decide — com o que cada um valoriza: a Lorelei
  quer quem pergunta por quê e odeia elogio e carta da Liga, o Bruno
  quer quem trabalha e odeia discurso, a Agatha gosta de aposta e de
  cara de pau e odeia pena. O jogo não diz nada disso; a folha de
  regras diz só que pesa.
- **A visita** é um evento encadeado (`tit_<id>`) que abre pelo afazer
  do lugar (`Titulares.afazeres`, `Titulares.fazer`), depois do 17
  (`liberado`), pra quem sabe onde a pessoa está (`sabe_onde_<id>`) e
  até a cadeira do Campeão. O que ela decide fica em `titular_<id>`
  (`'voltou'`/`'ficou'`, por `Titulares.decidir`) e não se desfaz; ir
  embora sem decidir deixa a porta pra outro dia. O Bruno só trabalha
  de manhã (`hora`): fora dela, a visita leva o relógio até o turno.
- **A pista** vem de três lados: o substituto, ganhando ou perdendo
  (`pista` no ELITE4, marcada no `resultadoElite`), a cidade
  (`DESCOBERTAS` andando e `CONVERSAS` com `ef`) e a Conselheira no
  capítulo 26, que diz onde estão os que faltam.
- **Quem volta senta na própria porta**: tudo que lê a ala passa por
  `Titulares.membro(i)` (luta, citação, tela da Liga), nunca por
  `ELITE4[i]`. Time e nível próprios, 2 acima do substituto na
  primeira e na segunda porta e 1 na terceira, com o Lance sempre no
  topo. O substituto continua na sala (a Giselle anota a Lorelei, o
  A.J. perdeu a cadeira numa luta, o Mandi abre a porta pra Agatha), o
  Lance conta quem voltou (`lanceSobreOsOutros`), a Conselheira do
  26 conta, a oferta de cadeira na Elite (`c26_oferta`) e o posto
  `elite` precisam de porta sem dono.
- **O Lance é imponente.** É a última porta e a única que nunca ficou
  sem dono: fala pouco, fala de cima, sem piada, e a sala fala com ele
  (o fogo das bacias deita quando o dragão respira). Fala dos outros
  como quem fala de uma defesa: o que você já atravessou pra chegar
  ali. A fala da vitória é lida **antes** do carimbo da porta
  (`resultadoElite`), então `elite_passou_lance` nela quer dizer que
  ele já tinha sido vencido noutra vez.
- **Ninguém gira em volta de reverência.** Cada substituto olha o dono
  da placa do jeito dele: a Giselle quer a placa (a dela cabe no mesmo
  furo), o A.J. tem uma conta antiga com o Bruno, o Mandi sente falta
  de ser xingado pela Agatha. Fala nova deles segue o jeito, não o
  respeito.
- Rosto: `elite/lorelei` e `elite/agatha` (Let's Go) e `elite/bruno`
  (HG/SS), do traço do Lance. O texto descreve o que a arte mostra.

`chk-lutas` roda cada titular de volta, a Agatha com raiva e o Lance
com os três; `chk-telas` abre a pista de cada cidade, cada jeito de
cada visita com cada escolha (o teste pros dois lados) e a Liga com
titulares de volta.

## Sexo do Pokémon
Todo Pokémon ganha `genero` (`'m'`, `'f'` ou `null`) no `criarPokemon`,
na proporção dos jogos (`chanceDeMacho`, em `js/engine/pokemon.js`). Save
antigo sem o campo sorteia na primeira pergunta — por isso **leia sempre
por `generoDe(p)`**, nunca `p.genero` direto.

Sexo não mexe em atributo nem em temperamento: o temperamento é a
natureza, e amarrar comportamento a sexo seria inventar estereótipo. O
que ele muda é o **par** (mesma linha de evolução, sexos opostos, no
mesmo time — `parDe`, `paresDoTime`): obediência, a luta quando o par
cai, o luto quando o par morre (`Estado.matar` devolve o par) e a
soltura. E muda como a história fala do bicho.

**Texto que fala de Pokémon do jogador concorda com ele.** Nada de
`ele`, `dele`, `sentado`, `confuso` fixo depois de `nomeExib(p)`:
- em template, `pron(p)` dá `ele/ela`, `Ele/Ela`, `dele/dela`, `o/a`
  (terminação), `do/da`, `pro/pra`: `` `${n} está sentad${pron(p).o}` ``;
- em texto escrito antes de o bicho existir (a `historia` que a cena
  passa pro `criarPokemon`), use as marcas `{o}`, `{ele}`, `{dele}`…,
  que o `concordar()` resolve quando o sexo é sorteado.
Sem sexo fica no masculino, que é o gênero da palavra "Pokémon". Selvagem
que o texto chama de "o bicho" ou "o Rattata" também: concorda com o
substantivo, não com o sexo.

Quem a cena descreve antes de existir tem o sexo decidido antes: o
inicial sorteia na escolha (`reservarInicial`), e a lona, o Célio e o
Professor falam dele por `pronReservado(d)`. Etiqueta de condição
(`UI.etiquetaStatus(st, p)`) e marca de desmaio concordam com o seu; a
do adversário fica no masculino do substantivo.

## Quem já te viu lembra, e o telefone é o PokéNav
`js/story/reencontros.js` põe, antes da primeira fala de um NPC numa
cena de capítulo ou num evento, o reconhecimento: pelo seu nome, com a
cara da opinião. Vale pra quem está em `d.npcs` com opinião ±3 ou duas
lembranças, num capítulo depois do que te conheceu, uma vez por
capítulo. Não entra se a cena já trata você como conhecido (diz o seu
nome, "de novo", "lembra"), se o NPC está se apresentando ("prazer",
"meu nome é"), nem pra quem tem cena própria (o Célio, quem ficou em
casa, o rival). Cena nova com NPC que volta pode escrever o reencontro à
mão: aí o genérico sai sozinho.

**Toda comunicação acontece dentro do PokéNav** (`UI.navTela`): chamada
recebida (`telaChamada`), resultado, ligação que você faz, mensagens de
aniversário e cena de linha que começa no aparelho ("O PokéNav apita…",
`Linhas.ehLigacao`). Abre por cima da tela, que não muda; guardar o
aparelho só fecha e repinta o topo. Nada de ligação em `UI.limpar()`.

O aparelho (`UI.modalNav`) tem a barra de volta na carcaça e a tela
de cristal embaixo (`.nav-tela`), com altura de aparelho: a agenda e a
ficha rolam por dentro. A **agenda** vai em ordem de nome, como a de um
telefone (`navChave`: sem artigo, sem acento; a casa fica em cima), com
letra separando e busca quando passa de oito — e continua sem descrever
ninguém (`textoContato` só dá o papel da casa). Número que te deram e
você não gravou é **uma faixa só** (`details.nav-novos`, com "Gravar os
N"); com um número só, ele já vem pronto pra gravar. A ficha tem um
serviço por linha de menu (`.nav-acao`, desenho na pastilha), o motivo
da porta fechada embaixo, e a missão cumprida e não contada acende um
ponto na agenda. Na **ligação** (`navTela` marca `.em-linha`) a agenda
sai de cena: quem liga em cima, com o rosto (o de cena de linha sai do
rótulo, como no balão), a conversa no meio e as respostas
(`navResposta`) presas embaixo, como num aplicativo de mensagem;
desligar (`navFim`) é o fone vermelho. Atender **continua a conversa na
mesma tela** (a sua resposta entra como `.nav-resposta`, a mensagem que
sai, e `navEmLinha` para o toque); não atender apaga, porque a conversa
não aconteceu. No celular é uma tela de cada vez: a agenda, e a ficha
por cima com "‹ Agenda" (`.vendo-ficha`, quando um contato foi
escolhido). Os balões da história são escuros: na tela clara do
aparelho eles são refeitos com seletor mais forte (`.modal.nav
.nav-conversa .fala…`), senão a sua fala e a fala sem dono saíam faixa
preta com letra preta.

## A luta não acaba no recarregar
`Estado.salvar` chama `LutaSalva.anotar` (`js/engine/luta-salva.js`): com
luta ativa, ou com resultado esperando o Continuar (`Jogo.fimPendente`),
o save leva a foto da batalha e do contexto (ginásio por id, cena por
capítulo e cena, o resto como dado). `Jogo.continuar` retoma antes de
tudo. Campo novo em `Batalha` entra sozinho na foto, desde que seja dado
— função não viaja. Contexto novo em `Jogo` entra em `LutaSalva.CONTEXTOS`.
Contra treinador a saída é o **Forfeit** (`Batalha.desistir`): derrota,
multa e moral (`MULTA_FORFEIT_POR_NIVEL`, `MORAL_FORFEIT`).

## A inscrição (criação de personagem)
A criação é a **ficha de inscrição da Liga** (`UI.telaCriacao`, dados em
`js/data/inscricao.js`, desenho em `css/criacao.css`): seis passos no
idioma da abertura — você, seu jeito, o que você quer, aparência, casa e
começo, conferência —, com o cartão de inscrição se preenchendo ao lado
(no celular, só na conferência). O estado mora em `UI._cr` até "Sair de
casa", e `UI.lerCriacao()` entrega pro `Jogo.criar`.

**O que pesa no jogo é escolha, nunca palavra solta.** A ficha antiga era
texto livre lido por radical, e escrever "ambiciosa" em vez de "teimosa"
não dava afinidade nenhuma. Hoje:
- os traços (`TRACOS_DA_FICHA`, 2 ou 3) são todos radicais de
  `TRACOS_JOGADOR` (afinidade.js), na forma do gênero — traço novo entra
  com radical, e cada palavra casa com **um** radical só;
- o objetivo é um dos sete `METAS`, gravado em `j.meta`, com a frase
  sugerida em `OBJETIVOS_DA_FICHA` (é ela que o capítulo 1 põe na sua boca);
- gostos e desgostos saem prontos (`gostoDaFicha`: lugar, tipo, espécie),
  em `j.gostos`/`j.desgostos`; o tipo usa o nome do jogo (`Grama`, nunca
  "Planta" — esse erro deixou o gosto por grama sem efeito nenhum);
- o **forte** (`j.forte`) começa em 2; os outros status, em 1;
- mochila (`j.corMochila`), cartão (`j.corCartao`) e foto (`j.retrato`,
  rosto de `RETRATOS_DA_FICHA`, no cartão e na Ficha por
  `retratoDoJogador`) são só aparência.

**A foto é só de quem joga.** As 32 fotos (16 por gênero, de jeitos e
tons de pele diferentes) moram em `sprites_nds/npcs/jogador/`
(`PASTA_DOS_RETRATOS`) e nenhum NPC tem a mesma cara — senão o rival ou
o moço da rua aparecem com a sua. Todas jovens, nenhuma criança (quem
sai de casa tem quinze anos), e nada de protagonista dos jogos. A lista
do gênero vem primeiro e é dela que sai o sorteio; a outra fica a um
toque ("Mais rostos", `c.maisRostos`), e qualquer foto serve a qualquer
ficha (`retratoDaFicha`): a escolhida de propósito fica quando o gênero
muda, a sorteada sai. Cada foto tem nome em `ROTULO_DO_RETRATO`, pra
leitor de tela. Save velho com `trainers/…` continua valendo.
`chk-sprites` confere que cada foto existe e que nenhuma é arquivo de
NPC; `chk-telas` abre os "Mais rostos" e escolhe um de lá.

Aparência e roupa continuam texto livre, com sugestão sorteada (o dado ao
lado do campo). Save de antes da inscrição continua sendo lido por
palavra (`rumoDe`, `perfilDoJogador`, `corNaDescricao`). O `chk-telas`
passa por cada passo e cada opção nos dois gêneros, e o `bot-jogador` sai
de casa pelo "Sortear o resto".

## Idade de quem joga
**Todo mundo sai de casa com quinze anos.** A ficha pede só o
**aniversário** (dia e mês); o ano é calculado pra dar quinze no dia da
perua (`anoQueDaQuinze`, em `js/story/idade.js`), e save antigo com ano
escolhido volta pros quinze na carga. Se o aniversário cai durante a
jornada, a pessoa faz dezesseis na estrada. A idade é calculada, nunca
guardada: `idadeJogador()`.

A idade **não abre nem fecha nada**: nem porta (a estiva e o cassino,
em `PORTAS_DA_IDADE`, não perguntam), nem posto (cargo não tem idade
mínima). O pedido foi de uma história sem escolha de idade, e a história
foi escrita pra alguém de quinze. Cena que trata você como adulto não
existe; `{menor:A|B}` ainda funciona no motor, mas texto novo não usa —
escreve só a versão de quinze.

**Texto nunca escreve a idade do jogador à mão.** "Você tem quinze
anos" é `{idade}` (vira dezesseis depois do aniversário); com maiúscula
`{Idade}`, em título `{IDADE}`, daqui a N anos `{idade+N}`, a idade com
que saiu de casa `{saida}`. Lembrança da infância conta pra trás a partir
da idade − 3 (`{idade-3}`, a primeira coisa de que se lembra): "o mapa
de {idade-3} anos atrás", nunca "nove anos atrás" escrito à mão.
`Estado.registrar` congela a idade do dia, pra o diário não mudar depois
do aniversário. Personagem que **não é** o jogador e tem quinze anos (o
rival, a filha da Sibyl) continua escrito.

Aniversário é `Aniversario`, na primeira tela de mapa do dia, uma vez
por ano: quem ficou em casa (`aniversario` nos oito jeitos de
`casa-jeito.js`), o Célio, quem tem opinião 4+ e o rival. Tudo isso está
na folha de regras.

## Gênero de quem joga
A ficha pergunta Homem ou Mulher, e **o texto inteiro concorda**. Frase
que fala do jogador escreve as duas formas numa marca, **forma de Homem
primeiro**: `sentad{o|a}`, `{o senhor|a senhora}`, `{moço|moça}`,
`{Obrigado|Obrigada}`. Quem resolve é `concordaJogador` (em `motor.js`),
chamado por `UI.esc` — então todo texto que vai pra tela já sai certo,
inclusive diário e `registrar` gravados antes. Texto que for pra tela
sem passar por `UI.esc` tem que chamar `concordaJogador` na mão.

Duas marcas irmãs, pelo mesmo caminho:
- `{casa:ela|ele}` — a pessoa que ficou em casa, **forma feminina
  primeiro** (as cenas foram escritas pra ela). O parentesco da ficha
  decide (`parentescoEhMulher`); o que fica em branco é sorteado
  combinando nome e parentesco.
- `{pk:ele|ela}` — o Pokémon da frente do time, pra cena escrita sem
  variável. Com `p` na mão, prefira `pron(p)`.

Cuidado ao marcar "o senhor": **metade deles é o jogador falando com um
homem**, e esses não mudam. A pergunta é sempre quem está sendo tratado.
Vocativo neutro ("cara") fica como está.

## A história anda em cima da sua linha
`js/story/linhas.js`. A **linha** é o lado do jogador: o posto de maior
peso (`LINHA_DO_CARGO`) ou, sem posto, a via (`LINHA_DA_VIA`). Na virada
de capítulo (`entrarNoCapitulo`), `Linhas.talvez` mostra a próxima cena
da linha (`CENAS_DE_LINHA`, em ordem, `cap` mínimo, uma por capítulo),
e cada cena lê as flags `ln_*` da anterior (seis por linha, do capítulo 3
ao 28; a segunda metade está em `MAIS_CENAS_DE_LINHA`). A frase que abre
o capítulo (`avisosDeRumo`) sai da linha, e o epílogo fecha cada linha
vivida em `rodapeDaLinha`. Trocou de linha: a antiga
reage uma vez (`VIRADAS_DE_LINHA`) e a nova começa do começo. Linha nova
ou cena nova entra ali; quem acompanha a linha inteira tem nome em
`NOMES_FIXOS` (Holt, Hazel Moss, Sra. Linden, Coordenadora Maple, Dona
Briar), apresentado na primeira cena, e quem não diz está em
`RECUSAM_O_NOME`. Cena de linha não sabe do futuro como capítulo nenhum.

## Os caminhos dividem a história
`js/story/caminhos.js` desvia a jornada depois do 12, do 19 e do 25 por
um capítulo do **caminho** do jogador naquela hora (`caminhoAtual`: a
linha; sem linha, Liga com 4 insígnias ou mais, senão Andarilho). Os
capítulos moram em `js/story/caminhos/<caminho>.js`, três por arquivo,
e o desenho está em `docs/CAMINHOS.md` (o que cada ponto já sabe, quem
acompanha, os finais).

- **O número é a posição**: 12.01 a 12.10, 19.01…, 25.01…. Nada de 33
  em diante: código que compara `d.capitulo >= 14` destravaria coisa do
  fim do jogo. Na tela, `numeroDoCapitulo(cap)` desenha "Lei · II".
- Capítulo de caminho entra **só pelo desvio** (`proximoCapitulo` pula
  em sequência) e não aparece em `capitulosPulados`.
- O terceiro de cada caminho pode acabar a jornada (`final:`) ou voltar
  pro 26 (`fim:true`). Final novo conta no códice sozinho.
- Toda escolha que muda alguma coisa leva `rep`, com motivo. Luta usa
  `nivelDoCaminho(d, extra)`, que acompanha o time, não só a área.
- A âncora (`ancora.local`) tem que estar ao alcance de quem chega ao
  desvio: a guarita da Rota 23 pede oito insígnias, então capítulo de
  caminho antes do 22 não espera no Planalto. O 19.06 esperava lá e
  prendia quem vive de ginásio com seis; hoje é em Viridian.
- Capítulo de caminho não sabe o que o jogador viveu nos outros dois:
  quem trocou de lado chega no II ou no III sem o I. Texto que cita o
  capítulo anterior do caminho (o Rook da cerca, a foto doze, o lote 12)
  pergunta pela flag `cm_*` dele, e o `resumo` de encerramento, que o
  `txt()` resolve, também pode ser função.
- Os verificadores leem `js/story/caminhos/`; arquivo novo de caminho
  entra no `index.html` antes do `condicionais.js`, e o `caminhos.js`
  depois dele.

## A rede tem degrau
O posto de Informante (o envelope sem timbre, `id:'rocket'` em
`cargos.js`) é o primeiro degrau da **rede**, o que sobrou da Rocket
(`js/story/rede.js`, dados e motor juntos): Informante, Recruta,
Contador, Chefe de turno, Executivo (`ESCALOES`). O posto lê o degrau
por getter — `nome`, `peso`, `beneficios` —, então o cartão, a renda,
o desconto e o peso da linha sobem junto; quem promove atualiza
`Estado.j.cargo`.

- **Subir** pede confiança, o capítulo do degrau e vencer a **prova**
  (`PROVAS_DA_REDE`: Brant, Juno, Mercer, Corbin, cada um no ponto
  dele). O preto também vem da voz, sem prova, no "lugar à mesa" da
  linha (`Rede.promoverPelaVoz`, chamado pelo `executar` da cena do 17);
  por isso texto de prova que cita o Brant pergunta `provaVencida`.
- **Confiança** = `CONFIANCA_DAS_MARCAS` (flags da história, lidas
  toda vez, nunca guardadas) + `d.rede.pontos` (serviços). Marca que a
  rede não viu não entra: a delação do Monte da Lua, o número errado,
  a foto pro policial, a lista inventada. A caixa do Vulpix aberta
  também não pesa: a própria voz achou "útil".
- **Serviços** (`SERVICOS_DA_REDE`) aparecem no ponto da cidade
  (`PONTOS_DA_REDE`: Vermilion; Celadon desde Recruta; Fuchsia desde
  Contador), um a cada `SERVICO_ESPERA_DIAS`, cada um uma vez, do
  degrau dele até o seguinte. Escolha com `teste` rola e cai em
  `bom`/`ruim`; com `luta`, a escolha vira `d.rede.pendente` e a cena
  de antes (`telaPendente`) espera o "Lutar" — recarregar não desfaz.
- **Sair**: terminar um serviço com a confiança em `CONFIANCA_EXPULSA`
  ou menos, ou largar o posto por qualquer porta (`Cargos.largar`
  marca `largou_rocket`, e o `requer` do posto não deixa voltar).
  Escolha antiga da linha baixa a confiança mas **não expulsa
  sozinha**: a cena do capítulo 27 foi escrita pra quem sabotou.
- Luta da rede é `Jogo.redeAtual` (`{tipo:'prova'|'servico', id, i,
  ramo}`), olhado antes de tudo no `finalizarBatalha` e salvo pela
  `LutaSalva`. Prova joga de Great Ball (o Corbin de Ultra), erra como
  veterano e gasta Vontade; briga com gente da própria rede
  (`vilao:true`) toca a faixa radical.
- O jogador veste o degrau: `Rede.retrato()` dá o rosto do uniforme
  (silhueta no envelope, recruta de preto, executivo de branco, pelo
  gênero da ficha), e cada degrau tem pino (`pinoDaRede`) e item na
  mochila com desenho próprio em `icones.js`.
- Os rostos da rede são `trainers/rede_*`: os de recruta e executivo de
  HG/SS com a **letra do peito apagada**, porque a rede veste "preto
  sem letra nenhuma" (a linha do 20, o uniforme do Brant). O
  `team_rocket_grunt_*` com o R continua pra quem é da Rocket de antes
  (o Rook guarda o broche do avesso).

A força foi medida no `sim-veteranos.js` (seção da rede), com o jogador
no nível da área do capítulo do degrau: Brant vence-se ~95% das vezes
(a porta de entrada), Juno ~75%, Mercer ~87% mas custando 4 dos 6, e o
Corbin ~60%, que é prova final. A prova acompanha os seus três mais
fortes, como o veterano, então treinar não a esvazia. `times` lista
**linhas**, uma por entrada: base e evolução da mesma linha viram um
Pokémon só, e o Brant já lutou com 2 em vez de 3 assim — o `chk-lutas`
confere o tamanho.

Serviço novo entra com rosto pra quem fala (`RETRATO_POR_NOME` no fim
do arquivo, ou classe na luta), nome pra quem se arrisca e `rep` em
toda escolha que muda alguma coisa. Serviço leva um período; o que conta
a noite inteira na porta, a madrugada no canal ou a tarde na fila leva
o relógio até lá no `ef.executar` do ramo (`Relogio.ate(h)`), e a luta
perdida também pode (`perdeuEf` na luta). `chk-lutas` roda toda prova e toda
briga de serviço em cada ramo; `chk-telas` abre cada degrau em cada
ponto, cada serviço e cada escolha.

## Tudo pesa na reputação
Escolha que muda em 2 ou mais a opinião de alguém e não tem `rep` escrita
na cena mexe na reputação sozinha (`repDaOpiniao`, em `motor.js`): gente
comum que sai melhor conta pro bom, a que sai pior pro ruim. Quem vive do
crime está em `NPC_DO_CRIME` (o sinal inverte) e quem fica no meio — a
Comissão, o comércio cinzento — em `NPC_NO_MEIO` (não conta sozinho).
NPC novo de um desses dois lados entra na lista; cena que precisa de outro
peso escreve `rep` própria, e aí a regra não soma por cima.

Ato que vira notícia (doação, depoimento, coisa feita na frente da
cidade inteira) escreve `notorio:true` **dentro** do `rep` da cena:
`rep:{eixo, delta, motivo, notorio:true}`, com `peso` do lado se
precisar. Nunca um `rep` dentro do outro — aninhado, o `mudarRep` não
lê, e trinta cenas ficaram assim sem ninguém ver: valiam como ato comum
e gastavam o teto do capítulo. Notícia vale 1,5× e passa por cima do
teto, como ginásio e Liga.

## O rosto do Ezra
O Ezra é `trainers/ezra`, o Rising Star de X/Y: tem a sua idade (jovem,
não criança) e a roupa nova demais de quem comprou tudo de uma vez pra
viagem. Rosto de rival **nunca é protagonista dos jogos** (o Lucas já
foi o dele) **nem foto que o jogador pode escolher pra si**
(`RETRATOS_DA_FICHA`), senão o rival aparece com a cara de quem joga.

## O Pico do Ezra
O parceiro do Ezra é sorteado pela tabela do inicial aleatório da casa
(`sortearPicoDoEzra`, em `rival.js`) e é o ás do time dele. Texto que fala
do bicho usa a marca `{pico}` (a espécie de agora, resolvida em
`concordaJogador`), nunca "Pidgey" escrito à mão, e o jeito dele (criado
em casa, olha pro Ezra antes de cada golpe) serve a qualquer espécie.

## Os rivais extras e a Diana
Os rivais que não são o Ezra moram em `RIVAIS_EXTRA` (`js/story/rival.js`):
nascem de uma escolha sua (`gatilho`, lido no fim de cada capítulo por
`conquistarRivais`) e te param na saída dos capítulos de `caps`. O Ezra
tem preferência; quando dois extras dividem a passagem, a estreia de
quem ainda não se apresentou vai na frente, e depois quem você viu há
mais tempo (`rivalDeveAparecer`).

A **Diana** é a exceção: não nasce de escolha sua, ela escolhe você.
Entra no registro depois de Celadon (`gatilho` no capítulo 9), mas é
`silencioso:true` — nada de "virou seu rival", nada no diário, fora da
Ficha — até te parar na estrada pela primeira vez (`apresentarRival`,
que guarda onde foi em `reg.desde`; `rivalConhecido` diz se ela já se
apresentou). `estreia:true` põe essa primeira vez na frente do Otto no
10. O time é o Rhydon (o ás, `aceFixo`, o primeiro dela), Lapras,
Flareon, Dodrio, Electabuzz e Hitmonlee, sempre na forma final
(`formasFixas`); o `criarPokemon` ainda segura o nível mínimo da forma,
e o Rhydon nunca sai abaixo do 42 (está na folha de regras). Rival
mulher leva `f:true`: tela, resultado, Ficha, diário e a memória dela
dizem "ela" (`proRival`). O texto dela olha onde
está: a estreia em Celadon é na saída da avenida, na água ela chega de
Lapras, e a fala que promete "eu te digo por quê" só volta se a estreia
foi luta. Rosto: `trainers/diana` (a Cooltrainer de HG/SS do acervo do
Showdown — jaqueta vermelha, rabo de cavalo, em posição de luta); faixa:
`bw2-kanto-gym-leader`, que nenhum ginásio pegou.

A força foi medida com `node ferramentas/sim-rivais.js` (cada rival
extra em cada passagem, jogador ingênuo na área do capítulo): a Diana
fica entre 50% e 63% até o 18 e entre 34% e 48% do 24 em diante — mais
difícil que líder, que é a ideia. Rival novo passa por ali, pelo
`chk-lutas` (cada arco, nas duas fichas) e pelo `chk-telas` (a estreia,
a volta depois de passar reto, o placar e o resultado).

## Quem ficou em casa e onde a jornada começa
A pessoa de casa tem um **jeito** sorteado uma vez e guardado na ficha
(`jeitoDaCasa`, em `js/story/casa-jeito.js`): orgulho, brincalhão,
prático, ex-treinador, sonhador, durão, atrapalhado, calmo. A mesa do
café e a despedida do capítulo 1 saem de `falaDaCasa(momento)`. Nenhum
jeito é medroso; fala nova de casa entra nos oito, não numa só.

A jornada começa na cidade natal. Na cidade natal tem **Sua casa** (cura
de graça, `Cidade.casa`) e, pra quem nasceu longe de Pallet e Viridian,
a **rodoviária** com o ônibus da Liga, uma vez, opcional (`Cidade.onibus`).
**Pallet não tem Centro nem loja**: o cadastro de treinador lá é no
laboratório, e cena de Pallet que fala em Centro usa `oPostoDaCidade(d)`.
Quem atende é `cadastra(d)` (a assistente do Professor em Pallet, a
enfermeira no resto); em Pallet a Pokédex sai da mão do Professor e o
cartão não sai — ele vem na primeira ida ao Centro de Viridian
(`Cidade.cartaoDeViridian`).

Texto que não pode depender de "mãe": quem ficou em casa é `nomeCasa()`,
`casaQuem()`, `{casa:ela|ele}` — nunca "sua mãe" escrito à mão.

## A tela de morte
`UI.telaGameOver(motivo)` fala o idioma da abertura (`css/titulo.css`,
`.tela-fim`): no meio da tela (`body.na-abertura`), Pokébola do fundo
apagada e rachada, título em fonte de pixel, o motivo numa caixa de
diálogo, o resumo em quadros (capítulo, dias, insígnias, reputação), os
ícones de quem ficou no time e de quem morreu antes (com a causa), e o
botão da abertura. O save automático é apagado ali.

## Como o projeto é montado
- HTML/CSS/JS puro, `<script>` comum, sem módulo ES: tem que abrir em `file://`
  offline. Nada de `import`/`export`.
- A ordem dos scripts está em `index.html`. Script novo entra lá.
- `python3 build.py` gera `pokerpg.html` e `artefato.html` (arquivo único
  com sprites, cenários, ícones, rostos, insígnias e gritos embutidos). Rodar depois de qualquer mudança em js/ ou css/.
- Texto do jogo em português do Brasil. Comentário de código também.

## Onde as coisas ficam
- `js/data/` — pokédex, golpes, learnsets, naturezas, afinidade, pokénav,
  nomes, porte, arenas, treinadores, tms, pokerole (gerado).
- `js/engine/` — estado, batalha, dados, mundo, captura, pokémon.
- `js/story/` — capítulos (`cap-01` a `cap-32`; os de caminho em `caminhos/`), lugares, mercado, eventos, motor,
  estrada (treinadores de rota e o que surge nela), vasculhar (achado,
  falha e acampamento por ambiente e por lugar — texto novo de rota entra
  com o ambiente dele, senão aparece cerca no mar e tronco na caverna).
- `js/ui/interface.js` — todas as telas e modais; `js/ui/efeitos.js` — o
  turno encenado, a abertura e a entrada do seu Pokémon.

## A interface é a dos jogos de hoje
O pedido foi "deixar no formato de hoje o gráfico", e o modelo é o dos
jogos de Switch (Sword/Shield, Scarlet/Violet) levado pra arte de pixel
que o projeto tem:

- **Letra**: a interface (fichas da luta, comandos, topo, placas) é
  Jost, embutida em `css/fonte-jogo.css` (OFL, em `fontes/`), pela
  variável `--letra-hud`, que mora no `:root`. Ela já morou só no topo
  e na luta, e tudo fora deles que pedia `var(--letra-hud, …)` caía
  calado na fonte do sistema — medido com `getComputedStyle`, não no
  olho. O menu do lugar (portas, o que fazer, para
  onde ir) e a ação de cena que não é frase (encarar, rolar, encerrar)
  também. O texto da história continua na fonte do sistema, que é a de
  ler, e a opção de cena que é frase vai junto com ele. Nada de fonte
  de pixel fora do título.
- **Topo** (`UI.topo`): HUD em duas linhas — rosto, nome e título de
  quem joga com os cinco botões de menu (cada um com o desenho de
  `icones.js`; no celular só o desenho, com `aria-label`), e embaixo os
  chips do que se carrega (lugar, hora, HP com barrinha, Vontade,
  dinheiro, Ração). No celular os chips andam numa linha de arrastar. O
  `.relogio` continua lá dentro pro `UI.pintarRelogio`.
- **Placa do lugar**: o `.cap-cabecalho` é o letreiro de área — a arte
  do lugar (a mesma do fundo da página, pela `--cenario-lugar` que o
  `UI.pintarCenario` põe no body, na luz da hora) com a etiqueta, o
  título grande e o lugar por cima.
- **Luta**: cena grande; as fichas de HP **flutuam** nos cantos livres
  (a do de lá em cima à esquerda, a sua embaixo à direita), cápsula
  escura com a faixa da cor do lado. Em cima o que se lê de relance —
  nome, nível, condição, tipo, time, HP, Vontade; a parte de conferir
  (natureza, atributos, item, `.ficha-mais`) abre num toque na alça
  (`UI.alternarFicha`), e fica aberta entre turnos e lutas. Comandos
  grandes na cor dos jogos (Lutar vermelho, Mochila âmbar, Time verde,
  Fugir azul, Forfeit cinza) e os do Pokérole menores (Vontade roxa,
  Pokédex na cor da tela dela). Golpe na cor do tipo, com a aba do tipo
  e, quando o tipo do outro lado é conhecido, o aviso de eficácia
  (super eficaz, pouco eficaz, sem efeito) — que está na folha de regras.
  No computador a caixa de mensagem ocupa a coluna da esquerda e a
  bandeja de dados mora embaixo dos comandos; no celular, mensagem,
  comandos e bandeja, nessa ordem.

## A caixa de diálogo e o menu
Tela de história (capítulo, linha, cidade: todo painel com
`.cap-cabecalho`) lê numa **coluna só** de 48rem, placa, texto,
opções e campo livre com as mesmas bordas. O balão é a caixa de diálogo
dos jogos: o rosto fica **fora** do `.fala-quem`, à esquerda, numa
moldura na cor da pessoa (`.fala.com-rosto`, grade de duas colunas), e
quem repete a vez guarda o lugar com `.fala-retrato.vazio` pro texto
alinhar. O balão tem o tamanho da fala (`fit-content`). Quem confere
rosto (`chk-baloes`) procura a `img.fala-retrato` no balão inteiro.

Opção é menu: o número no botão é a **tecla** que escolhe (`Teclas`, no
fim de `interface.js`), contado na tela inteira por um `MutationObserver`
em `#app` (`data-tecla`, de 1 a 9; quem passa do nono fica com o
marcador). A cidade conta "O que fazer" e "Para onde ir" juntos. Tecla
não age com modal aberto nem dentro de campo de texto. Opção que é fala
sua (começa com aspas) ganha `.diz` e sai em itálico; opção de linha
pode ter `cond` (`Linhas.mostrar` pula a que não vale).

A linha de opção tem o jeito dos comandos da luta: espessura embaixo
(afunda quando aperta), brilho na diagonal, a tecla numa bolinha de
botão de controle e a seta à direita. A cor dela é `--ac`: dourada na
história, a da coisa no resto. Na janela (Centro) não tem tecla, e
quem abre a linha é o desenho, numa pastilha da cor dele (`svg.icone`
filho direto de `.escolha.com-icone`). "Qual Pokébola?" (`menuBolas`)
é cartão por bola: a bola da arena grande, quantas tem e o selo em
dados (um por sucesso possível; a Master "fecha sem rolar") — o selo é
da bola, nunca a conta contra o alvo, que só sai no log. Ação de cena que
não é frase ganha classe e desenho: `.luta` (Encarar, vermelho do
Lutar), `.teste` (rolar, ciano), `.vontade` (roxo), `.fim` (encerrar,
dourado), `.olhar`; as de serviço (`.utilitaria`, `.discreta`) ficam
tracejadas, um tom abaixo. Detalhe de uma opção vai em `<small>` dentro
de `.esc-rot` (`.esc-det` embaixo do nome; sem classe, etiqueta em
cima), motivo de porta fechada em `.esc-trava`, e custo numa etiqueta
`.esc-custo`.

A tela do lugar (`Exploracao.tela`) tem quatro seções com cabeçalho no
idioma do HUD (`h3.sec-*`: losango e linha na cor da seção — história
dourada, porta vermelha, ação verde, caminho azul). A descrição encosta
embaixo da placa como legenda (`.descricao-lugar`), com "como o lugar
te recebe" no rodapé. **Porta** é botão na cor da casa, como o ícone do
mapa dos jogos (Centro vermelho, loja azul, ginásio dourado, casa
verde): a cor sai do desenho, em `COR_DO_ICONE` (`icones.js`), e porta
nova com desenho novo entra lá com cor. As portas enchem a linha
(`--cols`: três numa, quatro em duas de duas), nenhuma sobra pela
metade. **O que fazer** é menu em letra de placa (`.escolha.menu`), e o
que vem depois de " — " no título vira a etiqueta de custo ("1 Ração").
**Para onde ir** é placa de estrada: a seta aponta pra onde o vizinho
fica no mapa (`Exploracao.rumo`, pelas quadras de `MAPA_GRADE`, em oito
rumos), e o rumo vai escrito ("Ir para · leste"); lugar novo sem quadra
fica sem seta. O capítulo que espera aqui é a missão dourada
(`.escolha.chamado`), com a exclamação pulsando e o número do capítulo.

**Janela** (`UI.modal`) tem o título em letra de placa, com o desenho
da janela numa moeda da cor dele (`ICONE_DA_JANELA`, pela classe da
janela; a cor vira o `--ac` da janela inteira). As janelas de ler
(`JANELAS_DE_LER`: regras, tutorial, ajustes, rota, diário, códice)
ganham a classe `.folha`: seção com losango e linha, a conta em linhas
agrupadas numa ficha (a primeira e a última de cada grupo arredondam
sozinhas, por `:has`), o exemplo da folha de regras num cartão com o
dado. Ajustes tem a chave de liga e desliga no mudo e a régua de volume
que enche até o valor (`--v`, posto pelo `oninput`). A Rota é a trilha
dos capítulos, cada nó na cor do tom do capítulo, e o Diário é a ficha
de agora com a linha do tempo. O fim da jornada (`telaFinal`) usa a
mesma folha e põe os números em quadros. Janela nova de ler entra nas
duas listas.

Time, Sumário, Cartão e Ficha têm estrutura própria (o cartão e a ficha
com a cara de aparelho, na cor do cartão), mas a letra é a do HUD:
número (nível, HP, XP, atributo, a conta do golpe, dinheiro, registro)
em Jost com algarismo de largura fixa, como na ficha de HP da luta —
dentro dessas quatro janelas `.mono` vira Jost —, nome, aba e rótulo
também, e o cabeçalho de seção com o losango (no sumário na cor do tipo
do Pokémon, `--t1`; na ficha na cor do cartão). O que fazer com um
Pokémon do time é menu com desenho, como o do lugar.

**Aviso** (o que a escolha mudou, `UI.avisos`) é a caixa de "você
recebeu" dos jogos: o desenho numa pastilha da cor do tipo
(`iconeDoAviso`) — a moeda no que tem ₽, o próprio item em "Recebeu
N× X"/"Perdeu N× X", o coração na moral, um desenho por tipo no resto
— e o texto puxado pra cor de ler. Dinheiro que sai, item perdido e
moral que cai ganham `.perde` (vermelho), a moral `.moral` (rosa).
Tipo novo de aviso entra no `POR_TIPO`. No PokéNav o aviso fica na
tela clara do aparelho.

A **Liga** (`telaLiga`) é o corredor das quatro portas: madeira, a
placa de bronze com o nome que está nela desde sempre (LORELEI,
BRUNO…), quem senta atrás (rosto, tipo, níveis) só pra quem já sabe,
e o carimbo no pé da porta já atravessada (`elite_passou_<id>`, marcado
no `resultadoElite`; pra quem é Campeão, todas). Embaixo, o Salão do
Campeão; Torneio e Conferência com os prêmios em etiquetas. Entrar é
pelo menu numerado, com a porta fechada dizendo o que falta.
**Placar e prévia de time não aparecem em lugar nenhum** — foi pedido
assim: o rival te para sem quadro (o placar é coisa que ele diz, se
quiser), o resultado mostra o lugar, a Ficha e o diário não contam, e
o time de quem você enfrenta só se vê na arena. O **chaveamento** do
torneio e da Conferência (`chaveamentoHTML`) são as três lutas em
quadros ligados por um trilho — vencida verde, a de agora acesa, a de
depois apagada —, com rosto, a bola fechada de cada Pokémon (quantos,
nunca quais) e o prêmio da rodada. Na **Pokédex**, a casa tem duas linhas
(número e marca em cima, nome embaixo): na mesma linha, a etiqueta
"visto" cortava o nome. E `.linha .v` (a conta das linhas de valor) é
letra do HUD; só a Pokédex e o PC guardam a letra de tela deles.

Botão que entra animado entra com `animation-fill-mode` **backwards**,
nunca `both`. O `both` segura o último quadro, e animação manda mais
que regra: o hover não subia, o apertar não afundava, a opção fechada
não apagava, o aviso flutuante (`.recado`) não esmaecia ao sair e os
comandos desligados da luta ficavam inteiros. Foi medido com
`getComputedStyle`: o `transform` do hover saía matriz identidade.

A **evolução** (`UI.telaEvolucao`) toma a tela inteira: o palco na cor
dos tipos de quem evolui (`--t1`/`--t2` de `COR_TIPO`; o fundo da forma
nova acende por cima no fim), a aura azul e as bolhas do anime, e
embaixo a caixa de diálogo dos jogos com **B Parar** (o B e o Esc também
param) e **A Continuar**. Duas coisas que já morderam ali: botão com
`display` próprio precisa de `[hidden]{display:none}`, senão o atributo
não esconde e os dois ficam na tela; e quem a animação escala pelo
`transform` se centra pela propriedade `translate`, porque o
`commitStyles` do fim grava o `transform` por cima do centro. O
`bot-jogador` segue pelo `#evo-seguir:visible`.

## Convenções de texto
- Fala de NPC: `fala(quem, diz, tom, nota)`. Tons válidos: `grita`, `baixo`, `riso`,
  `frio`. Frase inteira entre aspas numa linha de narração também vira balão sozinha.
- Aspas de ironia ("análise jurídica") continuam narração porque não terminam em
  pontuação — se for fala, termina a frase dentro das aspas. Fala com a
  vírgula do lado de fora (`"Foi sorte", ele diz.`) vira balão pela
  atribuição, e o balão ganha o ponto que a aspa não tinha.
- Número que alguém **diz em voz alta** vai por extenso: placar no masculino
  (`porExtenso`: "dois a um"), conta de vitória, vez e insígnia no feminino
  (`porExtensoF`, `insigniasDitas`: "duas pra você", "uma insígnia"), com
  `cap1` no começo da frase. Algarismo na fala ("1 a 2.", "Uma de 1.") lê
  como erro de digitação; os rivais falavam assim até alguém reparar.
- Quem fala numa aspa sem `fala()` é adivinhado, e a adivinhação alterna entre você
  e o outro. `"…", ele diz` / `"…" Ele concorda` manda no lado (ele/ela é o outro,
  você é você). Cena de conversa comprida ganha `falante:'…'` e, se precisar,
  `vozes:['P','N',…]` — uma letra por aspa, na ordem: `P` é o jogador, `N` o
  falante, qualquer outro texto é o nome de uma terceira pessoa. Balão sem nome
  é bug: o script `anonimos` do scratchpad (ou `render.js`) acha.
- Linha inteira entre `**…**` é coisa escrita (placa, bilhete, cabeçalho) e sai
  como papel, mesmo com aspas dentro; `**trecho**` no meio da frase é negrito.
  Nunca aparece asterisco na tela.
- Presságio (`ef.presagio`) sai em itálico sem aspas em volta: se ele cita uma
  fala, as aspas são dele.
- Conversa de cidade (`CONVERSAS`, em `lugares.js`) pode ter linha que é
  função — quem é de lá, quantas insígnias, se o ginásio está fechado — e
  `{cond, texto}` pro que só vale às vezes, com `ef` se a conversa ensina
  alguma coisa (aplicado na primeira vez que ela é ouvida). Descoberta começa sempre por
  texto, que vai pro diário. Morador tem rótulo próprio da cidade: dois
  "o dono do bar" em lugares diferentes viram a mesma pessoa no dia em
  que o jogador pergunta o nome de um deles.
