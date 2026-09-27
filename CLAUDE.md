# Jornada do Campeão — como mexer neste projeto

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
- ginásio, Elite dos Quatro e torneio entram **por cima de tudo**, na quadra.

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
(Machado, Picareta, Lanterna…) e papel de enredo ficam com a casa vazia do
mesmo tamanho, pra coluna do nome não pular.

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

Bola aberta, brilho e inclinação não têm arquivo: os endereços de
`ball_open` e `sparkle` dão 404 na origem, e `tilt_left`/`tilt_right` são
byte a byte a bola fechada. A aberta é a fechada cortada ao meio, a
inclinação é rotação e o brilho é desenhado.

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

Os efeitos são **desenhados em CSS**: os endereços de efeito dos roteiros
(fire_slash, water_beam, heal_sparkle, status_burn…) eram ícones de item
da PokeAPI — Fire Stone, Water Stone, Potion, Burn Heal. Cor por cima do
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

## O combate é Pokérole
Desde a troca de mecânica o combate segue o **Pokérole 3.0**; a ficha do
treinador e os testes de história continuam no d10. Os dois sistemas não
se misturam: d10/d20 é gente e cena, parada de d6 é Pokémon brigando.

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

Duas adaptações, as duas escritas na folha de regras: o crítico pede mais
sobra no posto alto (no livro a sobra vira ação extra na rodada, e aqui cada
um age uma vez), e **não existe esquiva nem choque** — testado, derrubava o
acerto pra 35%.

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

## Como o projeto é montado
- HTML/CSS/JS puro, `<script>` comum, sem módulo ES: tem que abrir em `file://`
  offline. Nada de `import`/`export`.
- A ordem dos scripts está em `index.html`. Script novo entra lá.
- `python3 build.py` gera `jornada-do-campeao.html` e `artefato.html` (arquivo único
  com sprites, cenários, ícones, rostos, insígnias e gritos embutidos). Rodar depois de qualquer mudança em js/ ou css/.
- Texto do jogo em português do Brasil. Comentário de código também.

## Onde as coisas ficam
- `js/data/` — pokédex, golpes, learnsets, naturezas, afinidade, pokénav,
  nomes, porte, arenas, treinadores, tms, pokerole (gerado).
- `js/engine/` — estado, batalha, dados, mundo, captura, pokémon.
- `js/story/` — capítulos (`cap-01` a `cap-28`), lugares, mercado, eventos, motor.
- `js/ui/interface.js` — todas as telas e modais; `js/ui/efeitos.js` — o
  turno encenado, a abertura e a entrada do seu Pokémon.

## Convenções de texto
- Fala de NPC: `fala(quem, diz, tom, nota)`. Tons válidos: `grita`, `baixo`, `riso`,
  `frio`. Frase inteira entre aspas numa linha de narração também vira balão sozinha.
- Aspas de ironia ("análise jurídica") continuam narração porque não terminam em
  pontuação — se for fala, termina a frase dentro das aspas.
