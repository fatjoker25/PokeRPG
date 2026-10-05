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
baixar — então ela é pintada em CSS: arquibancada, refletor, linha de fundo
e círculo do meio.

Três armadilhas que já aconteceram aqui:

- **URL dentro de `var()`.** O navegador resolve caminho relativo pela pasta
  do CSS, não pela da página, e o fundo some calado. Por isso `Arenas.fundoDe()`
  devolve caminho absoluto (`new URL(rel, document.baseURI)`).
- **Enquadramento único não serve pras nove.** O mar da praia está no alto da
  imagem e a lava do vulcão no pé dela; cada ambiente tem o seu `--ar-foco` no
  CSS. Cenário novo entra com o foco junto.
- **No celular a arena empilha.** Faixa única deixa o segundo lutador no
  escuro, e esticar a mesma imagem numa caixa alta amplia demais. Empilhado,
  cada lutador carrega o próprio cenário atrás de si.

Os dois lutadores ficam **espelhados** na cena: cada um centrado na sua
metade, à mesma distância da borda de fora e do meio. O que os diferencia
é a profundidade — o de lá pousa mais alto no quadro e menor, o seu mais
baixo e maior. Se os dois pousassem na mesma linha, um deles estaria
flutuando sobre o chão que a imagem desenha.

Duas coisas andam junto com isso e já quebraram: **a base tem que subir
com o sprite** (sombra descolada do pé é bicho flutuando), e **no celular
o recuo não se aplica** — empilhado não existe chão compartilhado, cada
lutador tem a sua moldura e os dois pousam no pé dela.

Fora da batalha, o **fundo da página** também é o lugar: `CENARIO_POR_LOCAL`
(em `arenas.js`) dá um cenário a cada ponto do mapa — os nove da batalha,
mais `prado.png` (Pallet, Rota 1, Fuchsia) e `gelo.png` (Seafoam). Em cena
de capítulo cujo ambiente não é o do lugar, vale o do capítulo. É só
estética, fica escurecido e puxado pro tom do capítulo, e entra por
`UI.pintarCenario()`, chamado no `topo()` de toda tela. Lugar novo em
`LOCAIS` precisa de entrada aqui também.

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
  da antiga de costas, então sai menor na tela sem ter encolhido. Todo
  tamanho já vem multiplicado por essa diferença: **1,18x na frente,
  1,44x nas costas**. O lutador aliado fica maior que o inimigo de
  propósito, o que também acerta a perspectiva — é ele que está mais
  perto de quem olha.

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
- **fundo** (céu escuro do Thunder, roxo do Psychic) cobre só o cenário,
  nunca as fichas de HP; empilhado, vai dentro da moldura de cada um;
- **cópia de sprite** (rastro do Quick Attack) leva o `filter` do sprite:
  sem isso a silhueta vira bicho colorido e entrega a espécie;
- **quem ataca fica por cima** durante a cena, senão no celular ele passa
  por trás do cartão do outro.

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
o evento que muda o clima leva `clima` e a camada é pintada **dentro da
moldura de cada lutador**, nunca por cima da arena inteira — por cima, ela
cobria as fichas de HP.

Gritos: `sons/gritos/{dex}.ogg`, versão legacy da PokeAPI (~6 KB cada);
o `build.py` embute junto com os sprites.

Som mora em `js/ui/som.js` (`Som`). Cada coisa tem o seu controle:
geral, música, sons da interface (canal `efeitos`) e sons dos Pokémon
(canal `gritos`), mais o mudo, em `localStorage` ('jc-audio'), lidos por
`Som.volume(canal)` — `tocarGrito` e `somLigado` passam por ali. Som de
interface é sintetizado (`Som.EFEITOS`: toque, pokedex, scan, arremesso,
abrir, clique, item, compra) e entra por `Som.efeito(nome)` no ponto em
que a coisa acontece; o **toque** sai sozinho em todo clique de botão,
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
`Dados.contaDoTeste(r)`. d10 não existe mais pra ninguém.

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

**Haunter e Kadabra só vêm do Sr. Juniper.** Ele aparece primeiro como
**a figura de capuz** (rótulo `'a figura de capuz'`, que recusa o nome em
`RECUSAM_O_NOME`; contato `curador` com `falaComo`), faz as três perguntas
de índole em Lavender (`lav_a_pergunta_do_curador` e as duas `encadeado`
que seguem por `segue:`; `indoleDoJuniper` soma `ef.juniper`, empate fica
com a primeira) e entrega o Pokémon com quatro insígnias, ainda de capuz.
Só depois, na ligação `cha_juniper_capuz`, ele diz o nome
(`Nomes.apresentar`) e por que se esconde — e essa e qualquer fala dele
depois sabem qual Pokémon você recebeu (`pokemonDoJuniper`, pela marca
`p.doJuniper`). É ele também quem completa a evolução por troca: mandar
pelo PC do Centro pra mão dele. Nenhuma troca dá Haunter, Kadabra ou
alguém da linha deles, e a troca não oferece Abra nem Gastly. Ele não é o
Curador Fabre da Comissão — são duas pessoas.

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
  dois com `trocaEvolui`; o Sr. Juniper completa pelo PC só o que ele
  mesmo deu. Diglett e Dugtrio saem nas duas pontas da caverna deles
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

**Captura de lendário é a do Pokérole 3.0** (`captura.js`): só Ultra Ball
e Master Ball (`BOLAS_DE_LENDARIO`; qualquer outra recusa e gasta). A
Ultra rola o selo (`SELO_DA_BOLA`, 8d6) + os bônus da condição
(`bonusDaCondicao`: metade do HP 1, 1 HP 2, 1 por condição) contra os
sucessos do posto (`SUCESSOS_DO_POSTO`), e lendário conta no mínimo como
Ás (10). Com HP cheio é impossível de propósito: o pedido foi "bem
difícil". A Master fecha sem rolagem. A rolagem vai pro log inteira.

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

Loja de vários andares só mostra, em cada andar, o que está na lista
**daquele andar**. Item que entra no catálogo depois (`ESTOQUE_NACIONAL`)
tem que estar também num andar, senão nunca aparece — a Pedra do Sol ficou
invisível assim até alguém olhar.

Toda batalha contra treinador paga. Cena de vitória com `ef.dinheiro` já é
o prêmio; sem isso, paga `pagaPorNivel(classe) × nível do último Pokémon`
(`premioCena`, em `main.js`), com a classe saindo do rosto em
`treinadores.js`.

O mapa desenhado (`Exploracao.mapa`) abre com o item **Mapa de Kanto**
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

Sem o item **Relógio** o jogador só vê o período (manhã, tarde…): o
`Relogio.texto()` e o `cabecalho()` escondem hora e data. Com ele, dia
da semana, data e hora. O calendário (`Calendario`, em `mundo.js`)
conta a partir de segunda, 1º de março, com mês de tamanho de verdade,
e a jornada começa no dia da perua na cidade natal (`Calendario.inicio`),
que é o dia da entrega no capítulo 1.

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
se for à Conferência, de `conferencia:true`. A final da Conferência é sempre quem tem
`final:true`.

`node ferramentas/sim-veteranos.js` mede cada um de passagem (lugar + 2),
treinado (+6) e preparado (+10), os convites e as rodadas da Conferência. O
jogador simulado é ingênuo — time sorteado da área, sem item nem troca
— então o número é o piso: de passagem fica entre 0% e 58%, preparado
entre 10% e 90% (com veterano e jogador gastando Vontade). Espécie cuja evolução é por troca com item (Onix,
Scyther) entra na lista **pela forma final** (208, 212): `finalDaLinha`
não acha o Steelix saindo do Onix.

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

## A luta não acaba no recarregar
`Estado.salvar` chama `LutaSalva.anotar` (`js/engine/luta-salva.js`): com
luta ativa, ou com resultado esperando o Continuar (`Jogo.fimPendente`),
o save leva a foto da batalha e do contexto (ginásio por id, cena por
capítulo e cena, o resto como dado). `Jogo.continuar` retoma antes de
tudo. Campo novo em `Batalha` entra sozinho na foto, desde que seja dado
— função não viaja. Contexto novo em `Jogo` entra em `LutaSalva.CONTEXTOS`.
Contra treinador a saída é o **Forfeit** (`Batalha.desistir`): derrota,
multa e moral (`MULTA_FORFEIT_POR_NIVEL`, `MORAL_FORFEIT`).

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
- Os verificadores leem `js/story/caminhos/`; arquivo novo de caminho
  entra no `index.html` antes do `condicionais.js`, e o `caminhos.js`
  depois dele.

## Tudo pesa na reputação
Escolha que muda em 2 ou mais a opinião de alguém e não tem `rep` escrita
na cena mexe na reputação sozinha (`repDaOpiniao`, em `motor.js`): gente
comum que sai melhor conta pro bom, a que sai pior pro ruim. Quem vive do
crime está em `NPC_DO_CRIME` (o sinal inverte) e quem fica no meio — a
Comissão, o comércio cinzento — em `NPC_NO_MEIO` (não conta sozinho).
NPC novo de um desses dois lados entra na lista; cena que precisa de outro
peso escreve `rep` própria, e aí a regra não soma por cima.

## O Pico do Ezra
O parceiro do Ezra é sorteado pela tabela do inicial aleatório da casa
(`sortearPicoDoEzra`, em `rival.js`) e é o ás do time dele. Texto que fala
do bicho usa a marca `{pico}` (a espécie de agora, resolvida em
`concordaJogador`), nunca "Pidgey" escrito à mão, e o jeito dele (criado
em casa, olha pro Ezra antes de cada golpe) serve a qualquer espécie.

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

## Convenções de texto
- Fala de NPC: `fala(quem, diz, tom, nota)`. Tons válidos: `grita`, `baixo`, `riso`,
  `frio`. Frase inteira entre aspas numa linha de narração também vira balão sozinha.
- Aspas de ironia ("análise jurídica") continuam narração porque não terminam em
  pontuação — se for fala, termina a frase dentro das aspas.
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
