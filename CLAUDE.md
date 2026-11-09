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

**No balão, o cargo vai sem o "da X"** (`rotuloNoBalao`, em `nomes.js`):
"a funcionária da guarita" aparece "A FUNCIONÁRIA" na cena da guarita,
porque o "da guarita" só repetia o que a cena acabou de dizer — foi
pedido assim. O rótulo inteiro continua sendo a pessoa: memória, nome
perguntado, rosto, agenda do PokéNav e Ficha usam ele, e fora da cena é
ele que diz quem é. Só encurta quem é chamado por ofício
(`OFICIOS_NO_BALAO`) e só o "da/do X" e o "de" com lugar ("de
Viridian"); "a vendedora de flores", "a técnica de jaleco" e "Chefe de
turno" dizem o que a pessoa é, e ficam. "A mulher da pasta" e "a mãe
da Cleo" precisam do resto pra ser alguém. O `chk-baloes` reprova dois
rótulos com o mesmo balão na mesma cena; rótulo que precisar ficar
inteiro entra em `BALAO_INTEIRO`.

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
recepcionista") ganha rótulo próprio antes ("a recepcionista do Conselho"),
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

## Quem manda em Kanto
A **Liga é a do esporte**: licença e Cartão de Treinador, ginásios,
insígnias, Elite, Campeão, Torneio Aberto, Conferência, o Planalto, a
passagem da Rota 23 e a do norte. Ela convoca, credencia, contrata e
manda carta; não prende, não fiscaliza e não faz política. Já fez: a
Liga tinha oficial, custódia, convênio e plenário que decidia, e virou
um governo sem ninguém dizer. Quem manda é o **governo de Kanto**:

- a **Patrulha de Kanto**, os oficiais de cinza: estrada, posto,
  barreira, custódia, apreensão, o aviso e o mandado da sua ficha (o
  campo ainda se chama `d.liga.avisos`) e a ordem de devolução e de
  detenção de quem prende lendário na frente dos outros
  (`Captura.ligaReage`). Aviso dela é `tipo:'lei'`, com o distintivo
  (`patrulha` em `icones.js`);
- a **polícia**: inquérito e crime (o incêndio de Celadon, o andar 11);
- a **Fiscalização de Kanto**, em Saffron: Pokémon selvagem, manejo,
  chamado de ataque, guia de trânsito. Foi ela que assinou o convênio
  com a CGRB, e a Hester Colman era a diretora;
- o **Conselho Regional**: quinze conselheiros que decidem. A Margot
  Heath é a conselheira regional (`'a conselheira regional'`) que senta
  de observadora na Comissão (cláusula nona) e na audiência do 25, e o
  estatuto dele dá cadeira extraordinária ao Campeão;
- a **Auditoria de Kanto**, a do posto de Investigador.

E **"da Liga" não é enfeite**: a mochila é a Mochila, o cartão é o
Cartão de Treinador, o ônibus é o ônibus. Escreve "da Liga" quando a
Liga é o assunto, e uma vez, não em cada objeto da cena. Rótulo de quem
fala não carrega instituição quando o lugar ou o ofício bastam ("o
oficial de Celadon", "a técnica do terceiro andar", "a secretária do
Planalto"). Rótulo que mudou entra em `NPC_DA_LIGA`, no `Estado.abrir`,
e papel que mudou de nome em `PAPEL_DA_LIGA`.

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
`Estado.abrir`, senão some da mochila de quem já tinha.

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
A abertura toma a tela inteira (`body.na-titulo`, que tira a coluna
do `#app`); a tela de morte fica no meio (`body.na-abertura`).

Fora da batalha, o **fundo da página** também é o lugar: `CENARIO_POR_LOCAL`
(em `arenas.js`) dá um cenário a cada ponto do mapa — os nove da batalha
nas rotas e cavernas, mais `prado.png` (Rota 1) e `gelo.png` (Seafoam) —,
e **cada cidade tem o panorama dela**, em pixel no jeito dos fundos do
Showdown, com o marco e a cor do nome (Pallet branca com o moinho do
laboratório, Lavender lilás com a Torre, Vermilion no poente com o S.S.
Anne, Saffron amarela com a Silph…), gerado por `python3
ferramentas/desenhar-cidades.py` em `sprites_nds/arenas/<cidade>.png`.
Antes Viridian, Cerulean, Saffron e Celadon dividiam a mesma rua de
tijolo, e o Showdown não tem mais fundo de cidade. A placa do lugar
recorta a faixa de cima da imagem; no panorama o marco fica no meio, e
`FOCO_DO_CENARIO` desce a placa até ele (`--cenario-foco`). Cidade nova
entra no gerador, no mapa e no foco. Em cena
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
por cima. A PokeAPI tem arquivo trocado: o Rattata animado de costas
era o de Alola, e o seu Rattata virava de Alola na luta. O certo veio do
Showdown (`gen5ani-back`, a mesma coleção), e `python3
ferramentas/chk-arte.py` confere cada GIF contra a arte parada da mesma
vista, pela cor: GIF nova ou trocada passa por ali. Sem a GIF a `<img>` cai sozinha na arte parada
(`spriteParado`). O `pokerpg.html` **embute as GIFs**
(`SPRITES_SO_NO_UNICO` no `build.py`; ~43 MB, ~4 s pra carregar); o
`artefato.html` não, porque a publicação tem teto de 16 MB — lá a arte é
a parada.

O `pokerpg.html` fica no repositório e tem que ficar **abaixo de 50 MB**,
o aviso do GitHub (já passou: 57 MB). O que segura é a paleta: 363 dos
502 GIFs shiny são o GIF normal byte a byte, menos as tabelas de cor, e
esses vão só com as tabelas (`SPRITES_PALETA`, do `build.py`); o
`sprites.js` monta o arquivo na primeira vez que alguém pede, com as
tabelas do shiny nos bytes do normal — o mesmo arquivo, byte a byte. O
build decide sozinho quem vai assim (`tabelas_de_cor`), e o que difere
em outra coisa (tela de outro tamanho, quadro, tempo) vai inteiro. GIF
trocada de um lado só sai da conta sozinha, mas pesa: medir o arquivo
depois do build. O build diz quantos foram pela paleta.

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
exato nos jogos.

**Item de segurar é sempre um dos jogos**, com o nome e o ícone deles:
Leftovers, Focus Band, Muscle Band, Wise Glasses, Eviolite, Quick Claw,
Soothe Bell, Amulet Coin e Exp. Share. O Colete de Lona e a Botina Leve
eram inventados, com desenho nosso, e repetiam o Eviolite e o Quick Claw
do livro; o Resto de Ração e os outros eram itens dos jogos com nome
traduzido. O Quick Claw (+2 na iniciativa) e o Eviolite (+1 de
Vitalidade e de Instinto contra dano) têm o efeito do Pokérole 3.0, e o
Eviolite só pega em quem ainda evolui, por qualquer caminho
(`aindaEvolui`, lido no `efeitoSegurado`); os outros o livro não tem, e
o efeito é o dos jogos traduzido pra parada de dados. A lista inteira,
com o efeito de cada um, está na folha de regras. O `chk-icones` reprova
segurado sem ícone dos jogos e luta que segura item que não existe, e
nome que muda entra no `ITEM_NOVO` do `Estado.abrir`.

**Nome de item de história diz o que a coisa é, não de onde ela veio.**
Era "Rádio da companhia", "Binóculo do pai do Sr. Poplar", "Medidor com a
agulha no fim da escala": a cena já contou de onde veio, e o nome na
mochila e no "Recebeu" repetia. Hoje é "Rádio", "Binóculo", "Medidor". O
"da X" fica quando separa duas coisas que podem estar na mesma mochila
(Caderno do Rook e do Toby, Chave do subsolo e do portão, as duas
medalhas de natação) ou quando é o nome da coisa (Crachá da Limptotal,
Caderno 6 do Dr. Fuji). Nome que muda entra no `ITEM_NOVO`.

**O nome não diz a cor que o desenho mostra.** Era "Mochila Azul" com a
mochila azul na frente. A bolsa tem nome do que ela é (Mochila
escolar, Mochila de resgate, Bolsa de festa) e a cor mora na ficha
(`cor` em `BOLSAS_VENDIDAS`, lida por `nomeDaCorDaMochila`); a de casa
é só "Mochila", com a cor da inscrição. E cada bolsa da loja tem o
**desenho dela**, do que o nome e a descrição dizem (`BOLSAS_DA_LOJA`
no gerador, mapa em `ITEM_PIXEL`): a escolar de alto arredondado e
bolso, a de acampamento com o isolante enrolado e o cantil, a de carga
de lona velha com bolsos dos lados, uma correia e a fivela de latão (a
armação de metal que ela tinha não estava na descrição, e por fora da
mochila inteira ela parecia um armário: desenho sai do texto), a térmica
acolchoada, a de algodão de sacola, a
de festa com a corrente. Eram treze no mesmo desenho, só trocando a cor;
o desenho de cada cor (`mochila_azul`, `bolsa_verde`) ficou pra de casa,
pra da descrição e pra de história. Item de história cuja cor o
desenho mostra também fica sem ela: o Crachá da Limptotal tem o
crachá verde (`cracha_verde`), o Caderno do Rook o caderno azul. O
`chk-icones` reprova desenho de cor com a cor no nome e duas bolsas da
loja no mesmo desenho. Cor que o
desenho não mostra continua no nome quando diz o que a coisa é (a via
amarela é a cópia do formulário; a caminhonete branca é o carro).

Ferramenta que só existe aqui
(Machado, Picareta, Lanterna…), a Ração, a Bandagem, as mochilas, o que
a rede te dá e o papel de enredo ganham **desenho em pixel no jeito dos
ícones dos jogos** — 30×30, contorno cinza-escuro, luz de cima à
esquerda, três tons e o brilho —, gerado por `python3
ferramentas/desenhar-itens.py` em `sprites_nds/items/nossos/` (com
`--folha f.png` sai a folha ampliada ao lado de ícones dos jogos). O
mapa nome → arquivo é `ITEM_PIXEL` (`js/data/icones.js`); mochila e
bolsa saem pela cor da ficha delas (`ITENS_INFO[nome].cor`, desenhos em
`CORES_DE_MOCHILA`), e o que a história te dá sai
pelo que a coisa é (`arquivoDoDesenho`: papel, caderno, jornal,
envelope, pasta, prancheta, crachá, chave, foto, mapa, etiqueta, rádio,
medidor, apito, binóculo, pena, placa, fita, lata, luva, garrafa, pote,
muda, rede, lanche, pipoca, sacola, taça…), em `desenhoDoItem`. O
`pacote` é a sobra: já foram 61 itens ali, apito, binóculo, rádio e a
Poké Ball velha com cara de caixa de papelão, e o
`ferramentas/chk-icones.js` reprova item que cai nele. Papel de
enredo que é a coisa dos jogos vai pelo `ITEM_SPRITE`: a Pena Arco-Íris
é a Rainbow Wing de HG/SS, e a Poké Ball velha é a Poké Ball. Item
novo sem equivalente entra no gerador e no `ITEM_PIXEL` (ou numa regra
do `arquivoDoDesenho`); o `chk-sprites` confere que todo arquivo
apontado existe. Antes eram
vetores chapados e destoavam dos ícones dos jogos do lado. Lugares,
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

A **mochila aberta** (`UI.modalItens`, `.modal.mochila-cheia`) é a dos
jogos de hoje: no alto, o desenho em pixel da bolsa que você carrega
(`desenhoDaBolsa`: a da loja com o desenho dela, a de casa pela cor
de `mochilaAtual().corNome`), o nome e o zíper; embaixo, os bolsos (coluna no computador, faixa no celular),
a lista do bolso e a **ficha do item tocado** (`fichaMochila`; sem item
tocado — bolso vazio, ou só aparelhos — o lugar dela fica vazio, sem
forro, e no celular nem aparece: ela já mostrou a bolsa ali, com o
nome, e parecia item): o ícone
grande no pedestal, a categoria, quantos tem, o desgaste, a conta, a
descrição e os botões do que dá pra fazer (Usar, Ensinar, Dar pra
segurar, Usar esta bolsa, Descartar; na luta, Arremessar e Usar, por
`usarNaLuta`). TM, pedra e item de segurar mostram o time de relance
(quem aprende, em quem funciona, quem tem a mão livre). Lista tem uma
linha por item (`linhaMochila`, com `data-item`, nunca o nome dentro de
aspas no `onclick`), e o que não serve na luta fica apagado com o
motivo na ficha. A janela tem altura fixa e trocar de bolso, de item ou
de bolsa redesenha só o miolo (`mioloMochila`): reconstruir a janela
fazia ela abrir de novo a cada toque. O × no canto vem de `com-x` na
classe do `UI.modal` (fecha por fora e no Esc, como o Fechar). Setas
andam na lista e Enter faz o primeiro botão da ficha.

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

**Golpe que erra vai pro lado**, como no Showdown. O evento do golpe
sai antes da rolagem de precisão, então quem decide como ele acaba
marca o próprio evento (`Batalha.ev` devolve o evento): `errou:true`
quando a precisão falha, `'esquiva'` quando o outro gasta Vontade e
sai da frente. A encenação toca o golpe inteiro contra o
`missedPokemon` de lá — um alvo invisível na altura de quem levaria o
golpe, 100 pontos da cena do Showdown pro lado de dentro
(`CenaShowdown.pontoDoErro`; a nossa animação erra pro mesmo ponto,
`Efeitos.alvoErrado`). Investida, projétil e estalo vão até ali, e
quem não foi acertado não treme nem pisca: o alvo é um ponto, e ponto
não tem sprite (`Efeitos.sprite` não acha nada). Na esquiva ele salta
pro lado de fora e fica lá enquanto o golpe passa
(`AnimadorSprite.esquivar(lado, segura)`). Desfecho novo em que o
golpe não chega marca o evento do mesmo jeito, senão a tela mostra o
acerto e o texto diz que errou.

## O tamanho da letra
Quem joga escolhe nos Ajustes **Pequena, Normal, Grande ou Maior**
(`TAMANHOS_DA_LETRA`, `Letra`, em `js/ui/letra.js`), e a escolha fica
no navegador ('jc-letra'), valendo pras três jornadas. Cresce o que se
lê — a história e as falas (`.narrativa`, que também é a descrição do
lugar, o aviso que é fala e a conversa do PokéNav), as opções
(`#app .escolhas`) e as tarjas de aviso (`.avisos > .aviso`) — pelo
`zoom: var(--letra-ler)` desses blocos, então o rosto do balão e a
bolinha da tecla crescem junto. O alto da tela, a luta e as fichas
ficam do tamanho delas: são de relance.

Duas coisas: bloco com zoom **não entra noutro bloco com zoom** (o
aviso que é fala já é `.narrativa`, e por isso o zoom pega o `.aviso`,
não o `.avisos`), e bloco com zoom mede largura na conta dele — a
coluna de 48rem divide pelo fator (`calc(48rem / var(--letra-ler))`),
senão a letra maior alargava o texto além da placa.

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
lá: `gentleman_gen7`, `madame_gen6`) e alguns do PokeRogue (`pr_*`).
Pessoa nova lê a cena antes de escolher: o Célio tem uns cinquenta anos e
não é o entregador de boné; a Elsa tem treze e não é funcionária de
escritório; a cozinheira do Anne é mulher, e o `cook` é homem. Os
oficiais da Patrulha andam de cinza (`policeman_gen7` pelo cargo, a mulher
pelo `league_staff_f`); o de azul (`overworld/policial`) é polícia de
cidade. Arquivo novo que vem de luta entra em `PAGA_POR_CLASSE` com o que
o antigo pagava, e o veterano muda pelo `arq`. O de GBC (Polished Crystal)
foi olhado e ficou de fora: no balão, entre os de Black/White, parece
outro jogo.

**Rosto genérico nunca é rosto de alguém com nome.** O balão de quem não
tem nome sai de `ROSTO_POR_PALAVRA` e `RETRATO_POR_CARGO`; se uma dessas
regras cai no arquivo de um personagem, ele aparece em todo balão sem
dono. Foi o que aconteceu com a Sra. Perla: o `madame` dela era o de
toda "senhora", "velha", "viúva", de todo nome sorteado com "Sra." e da
avó de casa, e parecia que ela estava em todo lugar. Hoje a senhora sem
nome é o `madame_gen4`, e o `chk-rostos` reprova rosto da casa ou da
Perla que seja de outra pessoa ou de regra genérica, e rosto de NPC que
seja, byte a byte, uma foto que o jogador escolhe pra si.

O mesmo vale pra **toda pessoa com nome**: o `chk-rostos` reprova quem
tem nome da história (`NOMES_DA_HISTORIA`) ou nome fixo e fala pelo
rosto de uma regra genérica (palavra, cargo, ou o rótulo solto que é de
qualquer um, "os pescadores", "quem te atendeu"). O treinador de classe
(estrada, veterano, quem luta na rede) fica de fora: o Pescador Andrew
é o pescador dos jogos. A Sra. Cybil tinha o rosto de toda escrevente,
o Sargento Holt o de todo guarda, a Lena, a Sra. Ada e a Coordenadora
Maple o mesmo uniforme da Liga com a mesma cara. Nome novo na história
entra em `NOMES_DA_HISTORIA` — é por ela que o sorteio não dá "Sra.
Maple" pra uma desconhecida, e é por ela que o verificador sabe quem
tem nome.

E o rosto de quem tem nome é **só dele**: nem o treinador de classe (a
Giselle tinha a cara de toda Treinadora Ás da estrada, o Arlo a de todo
Montanhista), nem quem não tem nome (a Gina e quatro balconistas), nem
outra pessoa com nome (o Sr. Bram da banca de Saffron era o marceneiro
de Lavender). O `chk-rostos` reprova. Dois rótulos no mesmo rosto só
quando são a mesma pessoa: o nome fixo do rótulo, um nome da história
em comum ("Nadia" e "Nadia Arden") ou `MESMA_PESSOA` (em
`treinadores.js`), onde mora o rótulo de antes do nome ("Menino do
cais" é o Nolan), o de luta e o do save velho. Treinador de estrada que
é gente da história luta com o rosto dela — o Roque da barreira da Rota
9 é o Otto Roque, `arq:'otto'` —, porque o registro da estrada escreve
`nomeDeLuta` por cima do `RETRATO_POR_NOME` na carga, e o rosto escrito
à mão sumia de todos os capítulos sem ninguém ver; o verificador
compara o mapa escrito à mão com o que sobra depois de carregar.

Quando o acervo não tem um rosto livre do ofício (não há uma funcionária
de escritório por pessoa, nem uma recepcionista do Conselho), a pessoa ganha
uma **variação de paleta** do desenho do ofício: outro cabelo, outra
roupa, mesma pele e mesmo contorno. `python3 ferramentas/variar-rostos.py`
gera todas (`VARIACOES`, uma linha por pessoa com o que a cena diz dela),
sempre iguais, em `trainers/<nome>.png`; com `--folha f.png` sai a folha
pra conferir no olho. Antes de variar, procura no acervo um desenho de
verdade: o Holt é o policial de DP, o Hollis o cientista careca de
óculos, o Quinlan o senhor de chapéu-coco e maleta. Arquivo do `pr_*`
pode ser o mesmo desenho de um que já está no jogo com outros bytes
(`pr_baker` é o `baker`), e o do Polished Crystal continua fora.

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
4/4. **Cada cidade tem a dela** (`CALMAS[<id>]`, contexto `cidade:<id>`;
a pasta de arquivos continua lendo `cidade`), com o timbre e o ritmo do
jeito dela: Pallet valsa de flauta, Viridian clarinete, Pewter trompa
em marcha, Cerulean sino corrido, Vermilion sanfona de porto, Celadon
sino em bossa com sétima, Fuchsia marimba e Cinnabar tambor de aço em
ritmo tropical, Saffron metais sobre um pulso de cidade grande; Lavender
é a Torre. O tocador sabe os timbres `flauta`, `clarinete`, `trompa`,
`metais`, `sino`, `sanfona`, `marimba` e `aco` e os ritmos `arpejo`,
`valsa`, `marcha`, `tropical`, `pulso` e `bossa`, e `node
ferramentas/chk-musica.js` confere que toda melodia fecha a volta e que
toda cidade do mapa tem tema. Três lugares fogem disso, e o contexto sai do ambiente do capítulo
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
  fração (Substitute, Curse, Recover) tem `Math.max(1, …)`. O veneno é o
  do GM Screen do 3.0 (2 por rodada, o grave sobe 2); o "1 por rodada"
  do Cheat Sheet do SRD é do 2.0.
- **Wrap, Bind, Clamp e Fire Spin** são do livro: prendem 4 rodadas
  (`RODADAS_PRESO`) e rolam 2 dados de dano no fim de cada uma, sem
  defesa (`DADOS_PRESO`; `BlockDamagePool: 2` no Pokerole-Data), com a
  rolagem no registro. A prisão é **de quem prendeu** (`est.presoQuem`):
  ele caiu ou saiu de campo, `Batalha.conferirPresos` solta na hora —
  no `entrouEmCampo`, no começo de toda ação e no fim de turno. Antes
  ela durava 2 a 5 turnos e continuava depois de quem prendeu cair.

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
Golpe de cura (Recover, Softboiled, Synthesis, Rest) também gasta: acertou,
a cura só ativa com 1 de Vontade (é o texto do golpe no SRD), e sem ela não
cura. Sem PP, era isso que faltava pra um Blissey não se curar pra sempre:
a Vera perdeu uma luta de 152 turnos assim, e a IA ainda se curava de HP
cheio (hoje a cura vale pelo que falta, e nada com 80% ou mais).
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
  `fecharCapitulo`, o ônibus pra Viridian, `Relogio.viver`. Pulo novo de
  `relogio.dia` escrito à mão chama `Fome.alimentarTime()` junto, senão o
  primeiro tique do relógio cobra os dias de uma vez;
- a moral que **a cena tira** passa por `moralDaCena` (em `motor.js`): no
  máximo `MORAL_CENA_TETO` (10) por cena e nunca abaixo de
  `MORAL_PISO_CENA` (30). O que a cena dá entra inteiro. Abaixo de 30, só
  o que acontece com o próprio Pokémon (fome, desistir da luta, par solto ou morto).
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

**Lugia, Celebi e Unown ficam pra Johto**, de propósito (foi pedido
assim): não têm caminho em Kanto, nem de mato, nem de evento, nem de
troca. A Pokédex Nacional mostra os 251 e fecha em 248, como a de
FireRed, que lista quem só sai noutra região, e a folha de regras diz
isso na linha da Pokédex. Os outros 97 de Johto saem do sorteio de
Johto depois que a região abre (`sorteioJohto`, um quarto dos
encontros, pelo tipo do ambiente), da creche e das evoluções da 2ª
geração. Não é lacuna pra fechar com evento.

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

Lendário que a cena já derrubou e continua ali pra Pokébola entra na
luta **ferido** (`ferido` no `batalha` da cena: a fração do HP, no
mínimo 1, lida no `iniciarBatalhaDaCena`), e a captura é a de sempre. É
o Mewtwo de joelhos do 28 (`c23_bola`): o "Jogar a Pokébola" depois da
vitória voltava pra `c23_batalha`, acendia a câmara de novo e recomeçava
a luta com ele de HP cheio, e dava pra repetir pra sempre. Opção que
volta pra uma cena de batalha recomeça a luta inteira: depois de vencer,
ela vai pra outra cena.

## A creche e os ovos
Os bebês de Johto (Pichu, Cleffa, Igglybuff, Togepi, Tyrogue,
Smoochum, Elekid, Magby) não nascem no mato: saem de ovo, e o ovo sai
da **creche da Rota 5** (`js/story/creche.js`, afazer `creche` em
`LUGAR_DA_CRECHE`). Um casal de idosos cuida de até dois Pokémon do seu
cinto (pelo menos um fica com você), cobra a diária na hora de buscar
(`PRECO_DIA_CRECHE`; sem o bastante, ficam com o que você tem) e
devolve curado. Ninguém treina lá, e lá ninguém come da sua Ração.

- **Quem dá ovo** (`Creche.par`): mesma linha de evolução, macho e
  fêmea (`generoDe`), ou qualquer um com Ditto; quem não tem sexo, só
  com Ditto; bebê e lendário não (`podeCriar`). Nidoran ♂ e ♀ são uma
  família só (`FAMILIA_DA_LINHA`).
- **O tempo anda quando alguém olha** (`Creche.atualizar`): um 1d6 por
  dia que os dois passaram juntos (`OVO_NO_D6`: espécie 3+, linha 4+,
  Ditto 5+), até sair um ovo, que espera no quintal, um de cada vez. A
  senhora entrega na próxima visita, antes de qualquer conversa.
- **O ovo** mora em `d.ovos` (`{dex, choca}`) e aparece na mochila como
  o item `Ovo`, em Itens-chave (`sincronizarOvos` acerta a conta; o
  balcão não compra, porque não tem `PRECO_BASE`). Choca
  `HORAS_DO_OVO` depois, na primeira tela de mapa (`Creche.nascer`, no
  `Exploracao.tela`), no `NIVEL_DO_OVO` e com moral `MORAL_DO_OVO`. A
  ficha do ovo na mochila diz quanto falta sem dar a conta
  (`notaDosOvos`).
- **Quem nasce** é a primeira forma da linha da mãe (`especieDoOvo`),
  e com a Pokédex Nacional o bebê da linha (`BEBE_DA_LINHA`). O Togepi
  não tem pai em Kanto: sai do ovo sem dono que o casal guarda
  (`OVO_GUARDADO`), entregue uma vez a quem chega com a Pokédex
  Nacional, como o ovo do Water Labyrinth em FireRed.
- Pokémon na creche está em `d.creche.pk`, fora do time e do PC: quem
  procura o seu inicial (`inicialDoJogador`) não acha ele lá, e é isso
  mesmo — o Célio não vê o que está no quintal.

Os números estão na folha de regras ("Creche e ovos"). `chk-telas`
deixa um par, um com Ditto e um par com a Pokédex Nacional, entrega o
ovo, abre a ficha dele, busca sem dinheiro e choca.

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
não vendem. Tudo na folha de regras. Comprar e vender repintam o alto da
tela, que fica atrás da loja (`UI.atualizarTopo`): sem isso o dinheiro
e a foto (a bolsa comprada passa a ser a que você carrega) ficavam
velhos até a próxima tela.

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
ícone do item, não um mapa. Da mochila, o topo é a barra de aparelho
("‹ Mochila"); da parede, é a do Centro (`UI.barraDoCentro`), com
"‹ Centro" quando o mapa foi aberto no balcão (`Exploracao.mapa('centro')`).
A ficha do lugar tocado no mapa (`mapaInfo`) fala o idioma da tela do
lugar: o vizinho é placa de estrada (seta pro rumo, "Ir para · leste"),
a passagem fechada mostra o cadeado e o `esc-trava`, e o voo leva o
desenho `voar` e diz com quem se voa. Em tela larga (900 px ou mais) a
ficha fica do lado do mapa, como o painel do Town Map, e a janela
cresce só até o mapa caber na altura; embaixo do mapa ela caía fora da
janela no computador. Na tela estreita, tocar num ponto rola só o que
falta pra ficha aparecer inteira (`mapaInfo(id, tocou)`).

## A estrada não pede licença
Andar por rota é estar sujeito a ela: entrar numa rota, sair dela, vasculhar,
treinar e acampar podem virar briga sem o jogador escolher. As chances moram no topo de `js/story/estrada.js`
(`CHANCE_TREINADOR`, `CHANCE_SELVAGEM_SURGE`) e estão na folha de regras.
Repelente segura selvagem, não gente.

Briga que interrompe outra coisa segue a outra coisa depois: quem a começou
põe o que vem a seguir em `Jogo.depoisDaEstrada`, e o fim de briga livre
passa por `Jogo.seguirDaEstrada`. Não existe viagem entre capítulos: o
capítulo seguinte espera na âncora dele, e chegar lá é andar pelo mapa,
rota por rota.

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
é só esperar, então não destrava porta nenhuma. A janela não casa com
os períodos (fazer coisa pula pro começo do próximo: 0h, 6h, 12h,
18h), então o "Esperar a hora passar" na cidade dele, no dia certo e
antes da hora, leva até a porta abrir (`Exploracao.esperar`). Sem isso
quem esperava ao meio-dia de quinta ia direto pras 18h, e um robô
esperou 513 vezes em Cinnabar.

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
(lua nova) não entra na chamada. A Conferência é a **mesma chave de
dezesseis do Torneio Aberto** (`novaChave('conferencia')`, registrada
em `CHAVES` no fim de `veteranos.js`): a Greer (`final:true`) entra
sempre, quem você venceu na estrada também (vem atrás de revanche), e
o resto sai no dado entre os outros veteranos com `conferencia:true` e
os convidados (`CONVIDADOS_DA_CONFERENCIA`), gente que só aparece ali —
os campos são os do veterano que a Conferência lê, e quem acha um ou
outro é `daConferencia(id)`, nunca `veterano(id)` direto. A final já
foi sempre a Greer; hoje ninguém tem vaga marcada. O nível de cada
rodada é `nivelDaConferencia` (`PISO_CONFERENCIA`, `SUBIDA_CONFERENCIA`
e o acerto de cada um em `AJUSTE_NA_CONFERENCIA`). Convidado novo entra
com rosto livre, `local`, as três falas (`torneio`, `vence`, `perde`) e
passa pelo `sim-veteranos.js --conf` e pelo `chk-lutas`, que roda cada
um nas quatro rodadas. A Conferência é **aos sábados** (`DIA_DA_CONFERENCIA`),
uma por semana, na mesma tarde da arena do Torneio Aberto (no dia em
que se joga um, o outro já fechou), com a reputação de cada rodada só
na primeira vez (`rep_conferencia_<rodada>`). As falas dela dizem
"todo sábado"; já disseram "todo ano", com a Conferência repetindo no
mesmo minuto.

`node ferramentas/sim-veteranos.js` mede cada um de passagem (lugar + 2),
treinado (+6) e preparado (+10), os convites e as rodadas da Conferência. O
jogador simulado é ingênuo — time sorteado da área, sem item nem troca
— então o número é o piso: de passagem fica entre 0% e 58%, preparado
entre 10% e 90% (com veterano e jogador gastando Vontade). Espécie cuja evolução é por troca com item (Onix,
Scyther) entra na lista **pela forma final** (208, 212): `finalDaLinha`
não acha o Steelix saindo do Onix.

## O Torneio Aberto
É uma **chave de dezesseis, sorteada na inscrição** (`novaChave`, em
`js/story/liga.js`; a Conferência usa a mesma, ver "Veteranos e a
Conferência"): oitavas, quartas, semifinal e final, e foi
pedido assim — "não fosse decidido desde já quem tá na final". Você é
uma das vagas (`t.eu`), e ninguém tem vaga marcada: o Ezra ficava
sempre com a final, e não fica mais. `t.chave[k]` são as vagas de quem
começa a rodada k, na ordem dos confrontos (a 0 com a 1, a 2 com a 3),
e `t.chave[4]` é quem levou o título. As outras lutas de cada rodada se
decidem quando a sua acaba (`fecharRodada`, `lutaDeFora`, `forcaNaChave`): uma
parada de d6 de cada lado, um dado a cada dez níveis somados do time
que ele levaria pra arena; a chave mostra quem passou, nunca o placar.
Caiu, a tarde se joga sem você até o título (`terminarSemVoce`), e a
tela de eliminado mostra a chave inteira e diz quem levou. O
adversário da vez é montado quando a rodada abre (`t.adv`,
`adversarioDaVez`), e é ele que a tela mostra e a luta usa.

Cada competição se registra em `CHAVES` (quem se inscreve, como se
monta o adversário de uma rodada, o que cada rodada paga), e o resto é
um motor só: `novaChave`, `adversarioDaVez`, `fecharRodada`,
`terminarSemVoce`, `chaveAteARodada` (a chave andada até uma rodada,
pros verificadores). `t.qual` diz de quem é a chave.

A chave mora **no save** (`d.torneioAberto` e `d.conferenciaAberta`,
por getter e setter de `Jogo.torneioAtual` e `Jogo.conferenciaAtual`):
recarregar entre uma rodada e outra volta pra chave, e luta que começa
noutro lugar (`Jogo.torneioAtual = null`) tira o torneio de cena junto.
Luta salva de antes da chave (três rodadas, `adversarios`) vira chave
nova na carga (`torneioDeAntes`, `conferenciaDeAntes`).

Todo inscrito (`RIVAIS_TORNEIO`) tem uma chave (`id`, a vaga dele no
save), nome, nome curto (`curto`, o que cabe na chave), cidade (`de`,
que o quadro da sua luta mostra com a faixa de nível), rosto só dele
(`arq`, registrado no `RETRATO_POR_NOME` na carga, com o nome curto no
`NOMES_DA_HISTORIA`) e time montado: `linhas` do mais fraco ao ás,
`golpes` de TM do dono, `segura` (o item do ás) e `ajuste` (o acerto de
nível dele). Os de sempre são vinte e quatro, bem mais que as quinze
vagas, então a chave de cada dia tem gente diferente. Quem vem da sua história (o
Ezra, o Roque, a Fenna, o Orin, veterano vencido) entra pelo `cond`,
até quatro por chave (`DA_HISTORIA_NO_TORNEIO`), sorteados. O ás
acompanha os seus três mais fortes (`nivelDoTorneio`, com
`NIVEL_TORNEIO` por rodada), o tamanho sai das insígnias
(`TAM_TORNEIO`) e a escolha de golpe erra `ERRO_IA_TORNEIO`.

A chave na tela (`UI.chaveDoTorneio`) é a tabela de copa: duas metades
que se encontram na final, no meio, a da direita no espelho
(`direction:rtl`, então os colchetes usam propriedade lógica e viram
sozinhos). Cada confronto mora numa casa de altura igual à das irmãs
(`flex:1`), e é isso que põe o confronto seguinte no meio do par que o
alimenta. No celular as metades descem uma depois da outra e a final
fecha embaixo. Rodada que termina em "s" é plural: `naRodada`
("nas Oitavas", "na Semifinal") e `rodadaVencida` ("Quartas vencidas").

**Um chaveamento por dia, à tarde** (`tardeDaArena`, em `liga.js`): a
inscrição abre de manhã e fecha às seis, o chaveamento sai à uma (quem
se inscreve antes espera: `entrarNaArena` leva o relógio até lá) e o
torneio toma a tarde — no fim, ganhando, perdendo ou desistindo,
`sairDaArena` leva o relógio às seis. O dia jogado fica em `d.arena`, e
a inscrição já conta. A reputação da semifinal e da final vem só na
primeira vez que você passa por elas (`repDaRodada`, flag
`rep_torneio_<rodada>`); dinheiro e itens, toda vez. Antes o torneio
repetia no mesmo minuto, sem o relógio andar, e a reputação de notícia
subia sem teto. A arena fica no Planalto, atrás da guarita das oito
insígnias.

Antes era um sorteio do mato por tipo, com forma final em qualquer
nível: impossível no começo do jogo (6% de vitória) e passeio no fim
(90%). `node ferramentas/sim-torneio.js` mede a curva por fase e por
rodada, e `--cada` acha o inscrito que destoa. Quem destoa se acerta
primeiro trocando espécie da lista (o Snorlax e o Machoke saíram do
Criador) e só depois pelo `ajuste`; `NIVEL=… EXTRA=… ERRO=… SEM_ITEM=1`
na frente do comando calibram sem mexer no jogo, e a última coluna é a
chance de título (as quatro rodadas seguidas). Inscrito novo entra com
as seis coisas (o `id` sai do `curto` se não vier), passa por ali e
pelo `chk-lutas`, que roda cada inscrito nas quatro rodadas; o
`chk-telas` confere a chave de cada rodada, a de quem caiu e o sorteio
(dezesseis vagas, ninguém repetido, a final variando).

As finais de torneio da história (a Celeste no S.S. Anne, no 8; a Nadia
no aberto do Planalto, no 22) usam as mesmas armas pela luta de cena:
`erroIA`, `vontadeIA` e `segura` no `batalha` (e `segura` em cada
`timeExtra`), que o `iniciarBatalhaDaCena` repassa, e nível em função
do seu time (`nivelDeReferencia`), nunca fixo.

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
Contra treinador a saída é **Desistir** (`Batalha.desistir`, o botão
com a bandeira branca; texto do jogo é português, nada de "Forfeit"): derrota,
multa e moral (`MULTA_FORFEIT_POR_NIVEL`, `MORAL_FORFEIT`).

## O save em arquivo
O jogo se salva sozinho no navegador (`Estado.salvar`, a cada passo,
por cima do anterior). O **Salvar** do alto da tela (o disquete, entre
o Diário e os Ajustes) e dos Ajustes, do lado das Regras, baixa uma
cópia em `.json` (`ArquivoSave`, em `js/engine/save-arquivo.js`): o save
inteiro dentro de uma etiqueta, `{jogo:'PokéRPG', formato, salvoEm,
save, finais}`, com a luta junto se tiver uma — o `montar` passa pelo
`Estado.salvar`, que chama o `LutaSalva.anotar`. O códice de finais é do
navegador, não da jornada, mas vai no arquivo e, na carga, soma com o
daqui (`Estado.somarFinais`): nenhum final some. A janela
(`UI.modalSalvar`) é o recibo: o toque já baixou. Página publicada barra
download calada, e lá quem entrega o arquivo é a própria publicação: o
`downloads` (`window.claude.use('downloads')`, declarado no publicar
com `capabilities: {downloads: true}`), que mostra o nome e pergunta
antes de salvar (`ArquivoSave.entregar`, que conta como foi: salvo,
recusado, pergunta já aberta ou o download de sempre). Fora da
publicação `window.claude` não existe e vale o download do navegador. A
janela também copia o texto (`ArquivoSave.copiar`; sem área de
transferência, o texto aparece selecionado).

O **Carregar jogo** da abertura (`UI.modalCarregar`) abre o seletor de
arquivo junto com a janela, e aceita também o arquivo solto em qualquer
lugar da abertura e o texto colado. `ArquivoSave.ler` aceita a etiqueta
ou o save cru e recusa com o motivo: JSON quebrado, sem treinador, time,
mochila ou flags, Pokémon sem `dex` ou `uid` que preste, formato maior
que `FORMATO`, e texto com cara de código (etiqueta de HTML, `on…=`,
`javascript:`) — o save vai pra tela de muitos jeitos e o arquivo pode
ter vindo de outra pessoa. Antes de trocar, o cartão
(`UI.cartaoDoSave`, tudo pelo `esc`) mostra de quem é a jornada, e a
janela pergunta **em qual dos três lugares** ela entra (`.save-lugar`,
`UI.alvoDoCarregar`): vem marcado o da jornada em uso se ele está
vazio, senão o primeiro vazio (`alvoPadraoDoCarregar`), e o aviso diz
qual jornada sai, se sai alguma. Aceito, o arquivo é gravado naquele
lugar (`ArquivoSave.usar(dados, finais, jornada)`, que passa a ser a
jornada em uso) e quem segue é o `Jogo.continuar()`, como num
recarregar.

**Três jornadas por navegador** (`JORNADAS_NO_NAVEGADOR`). A primeira
mora na chave de sempre (`pokerpg_save_auto`), as outras em `_auto2` e
`_auto3` (`Estado.chaveDoSave`). O slot `'auto'` de `salvar`,
`carregar`, `gravar`, `existeSave` e `apagarSave` quer dizer **a
jornada em uso** (`Estado.jornada`, lembrada em `pokerpg_jornada`); um
número fala de uma jornada certa. Por isso nada no jogo mudou de
`Estado.salvar('auto')`, e o save de antes das três é a Jornada 1. Nova
jornada (`Jogo.novo`, com o nome no `confirm`) e a tela de fim só
apagam a jornada em uso. Quem quer o save cru de uma jornada, só pra
mostrar, pede `Estado.saveCru(n)`; nada de ler `localStorage` à mão.

- **Conversão de save velho mora em `Estado.abrir`**, que o recarregar
  e o arquivo usam. Nada de converter no `carregar` nem no
  `ArquivoSave`, senão um dos dois caminhos fica sem.
- Mudou o jeito de guardar de um modo que a conversão não cobre: sobe o
  `FORMATO`, e arquivo novo aberto em jogo velho é recusado com aviso.
- Navegador que não deixa gravar: a jornada roda da memória
  (`Jogo.continuar(dados)`) e o recado (`UI.avisar`, com `dura`) pede
  pra salvar antes de fechar.
- O topo tem seis botões. No celular eles cabem na linha do nome a
  partir de 385 px: o nome cede (`.topo-quem` com `flex:1 1 0` e
  mínimo de 130 px) e, no pior caso, corta com reticências; abaixo disso
  os botões descem pra linha de baixo, como já desciam. Botão novo no
  topo mede de novo em 375, 390 e 761 px.

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
  "Planta" — esse erro deixou o gosto por grama sem efeito nenhum). O
  que está marcado numa lista fica **trancado** na outra (riscado,
  `.na-outra`) até sair de lá, e a espécie escrita que já está na outra
  não entra (`c.avisoGosto` diz por quê). Antes a marca pulava de uma
  lista pra outra, e parecia que dava pra gostar e ter medo da mesma
  coisa;
- o **forte** (`j.forte`) começa em 2; os outros status, em 1;
- mochila (`j.corMochila`), cartão (`j.corCartao`) e foto (`j.retrato`,
  rosto de `RETRATOS_DA_FICHA`, no cartão e na Ficha por
  `retratoDoJogador`) são só aparência.

**A foto é só de quem joga.** As 48 fotos (24 por gênero, de jeitos e
tons de pele diferentes) moram em `sprites_nds/npcs/jogador/`
(`PASTA_DOS_RETRATOS`) e nenhum NPC tem a mesma cara — senão o rival ou
o moço da rua aparecem com a sua. Todas jovens, nenhuma criança (quem
sai de casa tem quinze anos), e nada de protagonista dos jogos. **A
ficha só mostra as fotos do gênero dela**: as `RETRATOS_A_VISTA` (16)
primeiras de cara, as outras oito a um toque ("Mais rostos",
`c.maisRostos`), e o sorteio sai da lista inteira do gênero. O "Mais
rostos" já abriu a lista do outro gênero, e quem fazia uma treinadora
via os rapazes ali: trocar o gênero tira a foto que não é do novo.
`retratoDaFicha` ainda aceita qualquer uma das duas listas, pro save
velho. Foto nova sai do acervo com o desenho conferido contra todo
rosto em uso, pelos pixels e não pelos bytes. Cada foto tem nome em
`ROTULO_DO_RETRATO`, pra leitor de tela. Save velho com `trainers/…`
continua valendo. `chk-sprites` confere que cada foto existe e que
nenhuma é arquivo de NPC; `chk-telas` abre os "Mais rostos", escolhe
um de lá e reprova foto do outro gênero na grade e gosto que fica nas
duas listas.

**A cor é sua, o desenho é do artista.** Escolhido o corpo, quem joga
abre a **Customização**: uma aba por parte — cabelo, olhos, pele,
camisa, calça, sapatos e detalhes (`PARTES_DA_FOTO`; boné, cinto,
faixa, o que a pessoa veste por cima) —, cada uma com a cor
**Padrão** (a do desenho) primeiro e as da lista depois
(`CORES_DA_FOTO`, em `inscricao.js`: cabelo, olhos e pele têm a sua,
as quatro de roupa dividem `roupa`, por `PALETA_DA_PARTE`). Só a foto
grande e o cartão mudam: a grade de fotos fica como o desenho tem
(trocar a cor ou a aba redesenha só a customização, `crRefazProvador`).
Parte que a foto não mostra (olho atrás dos óculos, pé descalço, o
cabelo debaixo do capacete do ciclista) fica com a aba tracejada e diz
por quê (`SEM_PARTE_DO_RETRATO`); as setas andam de aba em aba. A
mochila que a foto carrega nas costas (a da mochileira, a do viajante)
é a parte `mochila`, sem aba: sai na cor da bolsa que você carrega, a
da inscrição até comprar outra (`CORES_MOCHILA`, em escala por
`FotoJogador.escalaDeHex`). Quem diz qual é a bolsa é o `mochilaAtual`,
que aceita um save qualquer: o `FotoJogador.doSave(j, d)` lê o save
inteiro, o do jogo e o cru da abertura, e trocar de bolsa
(`UI.usarBolsa`) repinta a foto do alto da tela. Na criação, a foto
grande muda quando se escolhe a mochila (`crCoresDaFoto`). A aparência,
que era texto livre, sai daí por `descricaoDaFoto`: cabelo e olhos em
`j.aparencia`, a roupa em `j.vestimenta` (`PECAS_DO_RETRATO`, a palavra
e a forma pra cor concordar — "tênis preto", "saia preta", "sapatos
pretos", "botas pretas", e `{cor}` no meio quando a cor não vai no fim,
"faixa verde na cintura", ou quando o detalhe junta coisas de cores
diferentes e a cor é de uma só: "fita amarela, flor e brincos", porque
a flor é rosa), com o detalhe depois de um "com" ("regata
preta e tênis branco, com boné e luvas azuis": duas peças juntas com
"e" no meio da lista davam "tênis e meias azuis e prendedor e
munhequeira vermelhos"), e o retrato falado do capítulo 6 diz tudo numa
frase só, com a bolsa que você carrega no fim (`faladoDaFoto`, lido pelo
`Estado.descricaoFisica`, e `bolsaFalada`, por extenso em
`bolsaPorExtenso`: "mochila verde", "mochila escolar azul", "bolsa
dourada de festa" — a cor logo depois da primeira palavra quando o
resto começa por "de" ou "sem"). A Ficha diz a mesma bolsa na linha
"Bolsa". As cores ficam em
`j.retratoCores`; a pele fica só na foto. Desenho novo não tem: cada
foto vira um PNG de paleta com casa própria pra cada cor de cada parte
(`js/data/fotos-jogador.js`, gerado por `python3
ferramentas/fotos-do-jogador.py`; com `--folha f.png` sai a folha com
seis combinações por foto, pra conferir no olho), e o `FotoJogador`
(`js/ui/foto-jogador.js`) escreve as cores novas nessas casas e refaz o
CRC da paleta — sem canvas, que em `file://` suja. A cor nova é uma
escala (matiz, saturação, do escuro ao claro) e cada cor da parte cai
no ponto dela, então sombra e brilho ficam onde o artista pôs; a
pupila preta, que é quase sempre o olho inteiro, cai no meio da escala
do olho.

**Onde fica cada parte foi anotado pixel a pixel**, foto por foto, em
`ferramentas/fotos-partes.py` (o formato e a política estão lá): cores
por caixa, a primeira regra que pega ganha, pixel avulso (`px`: a
pupila, o branco do olho, o brinco) e caixa que nunca muda (`fixo`: a
Pokébola, o violão, a mochila da mochileira). Conta por cor não basta:
o marrom do cabelo é o da bota, o preto do contorno é o do cabelo da
guitarrista, o verde do olho da trilheira é o do cabelo dela — a
primeira versão, por cor e altura, deixava metade do cabelo do
trilheiro sem mudar e a nuca do prateado parada. Chapéu, boné,
capacete e viseira são detalhe, e o cabelo que aparece embaixo deles é
cabelo; o que a pessoa segura fica; acabamento da própria peça (a
pelúcia da gola e da barra da cantora, os babados da vidente) vai com
ela, no claro da cor. Foto nova ou trocada é anotada de
novo (o gerador para se o número de cores mudar) e conferida com uma
cor gritante por parte; peça nova entra em `PECAS_DO_RETRATO`, parte
que falta em `SEM_PARTE_DO_RETRATO`, e o gerador reprova foto em que as
três não batem. Cor nova na lista roda o gerador, que diz qual é a cor
de cada parte como ela veio (`NOME_A_MAO` acerta quando o olho discorda
da conta: parte de duas cores vira cinza na conta). Tudo que mostra a
sua foto passa por `retratoDoJogador` ou `FotoJogador.doSave`: o save
de arquivo pode trazer cor que não existe, e ela não passa. Save de
antes das sete partes (cabelo, pele e roupa) é convertido no
`Estado.abrir` (`converterFotoAntiga`): a cor da roupa vai pras partes
que ela pintava (`ROUPA_DE_ANTES`), e a descrição que a foto tinha
escrito é refeita — a escrita à mão fica. O `chk-telas` abre cada aba
de cada foto com cada cor, reprova parte que a foto não tem oferecendo
cor, grade que muda junto com a foto grande, pixel que muda pra cor de
outra parte (cada parte sozinha, e todas juntas igual à soma delas),
mochila da foto que não segue a bolsa em uso (a da inscrição e, depois,
a comprada, no alto da tela e no cartão da abertura) e seta que não
anda de aba, confere a descrição peça por peça, no Estado e no alto da
tela, a bolsa comprada na descrição e na Ficha, e
abre no navegador um save de antes das sete partes (a cor da roupa vai
pra peça certa, e a descrição escrita à mão fica).

Save de antes da inscrição continua sendo lido por palavra (`rumoDe`,
`perfilDoJogador`, `corNaDescricao`), e o de antes das cores fica com a
aparência escrita à mão. O `chk-telas` passa por cada passo e cada
opção nos dois gêneros, e o `bot-jogador` sai de casa pelo "Sortear o
resto".

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

**Todo capítulo começa pelo `Jogo.entrarNoCapitulo`**, inclusive o que
se abre no mapa (`Exploracao.entrarNoArco`): é ali que mora a virada —
o que o posto paga (`Cargos.pagarCapitulo`), a caixa da Sra. Perla, a
cena da linha e o telefone. O mapa já chamou o `iniciarCapitulo`
direto, e por semanas nenhuma cena de linha apareceu e nenhum posto
pagou. Entrada nova de capítulo passa por ele, nunca pelo
`iniciarCapitulo` solto.

## O começo do capítulo e o que a ficha pesa
`js/story/rumo.js`. O começo de cada capítulo (`avisosDeRumo`) era
lista de chamada: a linha da via, a do objetivo ("três insígnias no
cinto…") e a do gosto, toda vez, e o personagem passava a jornada se
lembrando do que já tinha feito. Hoje é **acaso, uma vez por capítulo**
(`d.rumoCap`): a linha da via sai pela fama (`chanceDaVia`: 35%, +10%
por degrau de reputação), o **momento do objetivo** pelo status que ele
puxa (`STATUS_DA_META`, `chanceDoMomento`: 25% com o status em 1, +15%
por ponto) e, quando sai, deixa uma coisa pequena (`MOMENTOS_DA_META`,
`aplicarMomento`: Vontade, moral, Poké Ball ou Potion, dinheiro de
`dinheiroDoMomento`, fôlego), e a frase do lugar de gosto ou desgosto
(`GOSTO_DO_LUGAR`) só sai quando você chega num tipo de lugar diferente
do último (`d.rumoLugar`) — o dado a mais ou a menos vale sempre.
Nenhuma linha repete as últimas doze (`_semRepetir`, `d.rumoVisto`).
Momento novo entra com `deixa` (nunca `ef`: não é o das cenas) e, se
for o caso, `cond`; os números moram
na folha de regras.

Gosto e desgosto de Pokémon são **alegria e medo** (`gostoDe`: a
espécie manda antes do tipo): ±10 de moral pra quem chega no time, e,
quando ele aparece do outro lado de uma luta, a frase
(`fraseDeGosto`, `Batalha.sentirGosto`, também na troca do adversário)
e ±1 de Vontade do treinador uma vez por luta (nunca abaixo de 1), e ±1
dado no selo da Pokébola (`gostoNaCaptura`). Só vale **espécie que a
Pokédex já catalogou** (`gostoSabido`): reação a um vulto entregaria o
que ele é. O lugar lê o ambiente do capítulo por `Arenas.doCapitulo`
(`grupoDoLugar`), nunca `cap.ambiente` direto.

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

## A estreia do Ezra
O Ezra é da sua cidade (o Pico sai da tabela dela; no 17 ele vem de
ônibus de lá), então ele **estreia onde você nasceu**. Quem nasceu em
Pallet ou em Viridian divide a Rota 1 com ele, e Pallet não tem Centro:
o encontro continua no capítulo 2, na escada do Centro de Viridian, com
a pedra da Rota 1. O resto vê o Ezra na placa da saída da cidade, no fim
do capítulo 1, sentado numa pedra (`ezraEstreiaEmCasa`, em `rival.js`;
cenas `c1_ezra_*`). Falar com ele marca `falou_com_ezra_em_casa`, e no
capítulo 2 o desvio de `c2_teo` leva ao reencontro (`c2_teo_reencontro`,
esperado se ele combinou de te esperar, `ezra_te_espera_em_viridian`);
passar reto marca `passou_pelo_ezra_em_casa`, e em Viridian ele conta
que te viu. A luta continua sendo em Viridian. Texto que cita onde vocês
se conheceram usa `pedraDoEzra(d)` ("na Rota 1" ou "na saída de
Vermilion"), nunca "Rota 1" escrito à mão, e opção que leva até ele na
escada passa por `c2_escada` (o nome dele pra quem já sabe).

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

A jornada começa na cidade natal, uma das dez cidades de `CIDADES`.
A cidade da ficha é o nome curto e o lugar no mapa pode ter outro
("Cinnabar" é a `Ilha Cinnabar`): quem procura a cidade natal no mapa
passa por `Mundo.idDaCidade(j.cidade)`, nunca compara `L.nome` com
`j.cidade`. Comparando, quem nascia em Cinnabar ficava sem casa e sem o
ônibus, preso numa ilha cuja saída é a Rota 19, de nível 36, e o
calendário e o aniversário perdiam o dia da perua.
Indigo saiu da lista: quem nascia lá começava em Viridian (o Planalto
fica atrás da guarita das oito insígnias), não tinha casa em lugar
nenhum e voltava pro Planalto no capítulo 21; o `Estado.abrir` passa
o save antigo pra Viridian. Na cidade natal tem **Sua casa** (cura
de graça, `Cidade.casa`) e, pra quem nasceu longe de Pallet e Viridian,
a **rodoviária** com o ônibus pra Viridian, uma vez, opcional (`Cidade.onibus`).
**Pallet não tem Centro nem loja**: o cadastro de treinador lá é no
laboratório, e cena de Pallet que fala em Centro usa `oPostoDaCidade(d)`.
Quem atende é `cadastra(d)` (a assistente do Professor em Pallet, a
enfermeira no resto); em Pallet a Pokédex sai da mão do Professor e o
cartão não sai — ele vem na primeira ida ao Centro de Viridian
(`Cidade.cartaoDeViridian`).

Texto que não pode depender de "mãe": quem ficou em casa é `nomeCasa()`,
`casaQuem()`, `{casa:ela|ele}` — nunca "sua mãe" escrito à mão.

**Quem ficou em casa fala por `falaCasa(diz, tom, nota)`**, nunca por
`fala(nomeCasa(), …)`: o balão leva o nome da ficha e o rosto do
parentesco (`retratoDaCasa()`, de `RETRATO_DA_CASA`), e o contato da casa
no PokéNav também. O rosto não sai do nome porque o nome é de quem joga:
irmão que se chama Bruno ganhava o rosto do Bruno da Elite, e o sorteio
já deu Bruno e Otto (o rival) pra casa. Os rostos de `RETRATO_DA_CASA`
são só da casa, e `NOMES_DE_CASA` não tem nome da história — o
`chk-rostos` confere os dois.

## A abertura
A tela de título (`UI.telaInicial`, `css/titulo.css`) é a noite em
Pallet, de ponta a ponta: o `prado.png` desfocado de leve e puxado pra
cor do jogo (as `--fundo-*` da moldura), estrelas no céu e um Pidgeot
que cruza de tempos em tempos. No alto o logo; no meio, lado a lado
(empilhados no celular), o **cartão da jornada** e o **menu**; embaixo,
no chão, o seu time vivo — ou, sem jornada, Bulbasaur, Charmander,
Pikachu e Squirtle —, com as GIFs na escala do jogo (`--q` é o quadro).

- No alto do cartão, **uma aba por jornada** (`.tt-slot`): nome e
  capítulo, ou "Vazia · começar aqui". Tocar escolhe a jornada em uso
  (`UI.escolherJornada`) e troca só o cartão, o menu e o chão
  (`partesDaAbertura`): o céu, as estrelas e o Pidgeot continuam, e o
  cartão novo entra sem a espera da abertura (`.tela-titulo.trocou`).
- O cartão lê o save do navegador **cru e só pra mostrar**: nome, foto,
  capítulo, lugar, dias, o estojo das oito, catalogados, time e
  dinheiro, tudo pelo `esc` (o save pode ter vindo de arquivo de outra
  pessoa). Save que não abre ali ainda tem o Continuar. Sem jornada, o
  cartão conta o que espera (capítulos, finais e Pokémon contados do
  jogo, nunca escritos à mão) e tem o Começar.
- O menu é uma linha por coisa (`.tt-op`): Nova jornada (só com
  jornada), Carregar jogo, Tutorial, Regras, Códice de finais (com a
  conta) e Ajustes, cada uma com o desenho na pastilha da cor dele. No
  celular vira grade de dois, só desenho e nome, e o ímpar ocupa a linha.
- O meio fica no meio do que sobra (`margin-block:auto`), e em tela
  grande cresce (`zoom`), senão sobra noite em volta. O `.json` do
  Salvar pode ser solto em qualquer lugar dela (`UI.soltarSave`).

Na abertura **ainda não tem jogo** (`Estado.dados` é nulo até o
Continuar): janela que o menu dela abre (Regras, Tutorial, Códice,
Ajustes, Carregar) não lê o jogo sem conferir. A folha de regras
quebrava ali, lendo os lendários de um jogo que não existia, e só abria
pra quem já tinha entrado numa jornada.

`chk-telas` abre a abertura com e sem jornada, cada janela do menu sem
jogo carregado, troca de aba e carrega um arquivo noutro lugar sem
apagar a jornada que já estava.

## A festa da vitória
Luta grande ganha tem festa antes da tela de resultado
(`js/ui/vitoria.js`, `css/vitoria.css`): ginásio, cada porta da Elite,
o Campeão, cada rodada do Torneio Aberto e da Conferência, e as finais
de torneio da história (luta de cena com `festa:{sub, legenda, trofeu,
cor, dinheiro, itens, frase}` no `batalha`, lida no `finalizarBatalha`;
o prêmio de verdade continua no `ef` da cena de vitória, a festa só
mostra). A tela inteira acende na cor da luta (`--vt`: o tipo do líder
ou da porta), o "Vitória!" bate, o rosto de quem perdeu entra numa
cápsula, e a peça do meio chega: a insígnia cai girando e acende a casa
dela no estojo das oito, a porta da Elite tem a placa do titular e leva
o carimbo "Vencida", o título vem com o troféu desenhado (ouro, prata)
e a rodada com a medalha de fita (bronze até as quartas, prata na semi),
com as etapas do chaveamento. Depois os prêmios, um cartão por vez.

- **A tela de resultado é desenhada antes**, e a festa vai por cima
  (`Vitoria.mostrar(o)` logo depois do `telaResultado…`): Continuar só
  tira a festa da frente, sem piscar a tela da luta.
- O compasso é por classe na raiz (`.f1`…`.f5`); adiantar (toque,
  Enter, espaço, A) põe `.ja`, que zera a duração de tudo que entra
  (`.vt-e`) e deixa o laço (raios, faíscas, brilho) seguindo. Animação
  de entrada nova leva `.vt-e`, senão o adiantar não pega.
- O tipo vai em `data-tipo`, nunca em classe `vt-<tipo>`: o título se
  chama `.vt-titulo` e a raiz com essa classe herdou itálico e sombra.
- A fanfarra é sintetizada (`Som.EFEITOS.fanfarra`, composição nossa),
  com `insignia` e `carimbo` na hora da peça; a trilha do lugar espera
  por `Som.segurar(true)` e volta quando a festa sai da página (um
  `MutationObserver` solta, saia como sair).
- Nada de placar nem de time de ninguém: só quem perdeu, o que você
  ganhou e onde você está no chaveamento.

`chk-telas` abre a festa de cada ginásio, porta, rodada, do Campeão e
das duas finais da história, adiantada até o fim.

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
- O `artefato.html` é **só o miolo**: o `<meta name="viewport">` e o
  reset (`img{max-width:100%}`, `[hidden]`, body de 14 px) vêm da
  publicação. Aberto solto, o celular desenha a página com 980 px e
  encolhe, e tudo parece caber — o primeiro teste de celular deu 105
  telas limpas assim. `node ferramentas/chk-celular.js` (depois do
  build) abre ele dentro do mesmo esqueleto, a 320, 390 e 360 px, e
  passa pela abertura, pela inscrição, por um capítulo, pelas janelas,
  pela loja, pelo Centro, por uma luta e pela evolução. Tela nova entra
  ali.
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
  quem joga com os seis botões de menu (cada um com o desenho de
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
  Fugir azul, Desistir cinza) e os do Pokérole menores (Vontade roxa,
  Pokédex na cor da tela dela). Golpe na cor do tipo, com a aba do tipo
  e, quando o tipo do outro lado é conhecido, o aviso de eficácia
  (super eficaz, pouco eficaz, sem efeito) — que está na folha de regras.
  No computador a caixa de mensagem ocupa a coluna da esquerda e a
  bandeja de dados mora embaixo dos comandos; no celular, mensagem,
  comandos e bandeja, nessa ordem. **A caixa de mensagem tem altura
  fixa** desde a primeira linha (132 px no celular; no computador o
  bloco inteiro, entre 282 e 360 px pelo que sobra da tela) e rola por
  dentro: o turno novo desce lá dentro e a tela da luta não anda. No
  computador a bandeja ocupa o que sobra embaixo dos comandos e rola
  também, e os quatro golpes com o Voltar cabem no bloco (abrir o
  Lutar não mexe na tela) — comando novo mais alto que a lista de
  golpes empurra a tela de novo. **A bandeja mostra só o último turno**:
  `Jogo.acaoBatalha` chama `UI.novaRodadaDeDados()`, e a primeira
  rolagem do turno tira as do anterior; turno que não rola nada deixa a
  bandeja como estava.

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

O **PC** é a carcaça bege com a tela de fósforo, e mora no Centro: o
topo é a barra do Centro (`UI.barraDoCentro`, "‹ Centro" de volta pro
balcão, como o "‹ Mochila" dos aparelhos). Na tela, nome, seção (o
losango na luz verde) e botão são Jost; número (nível, HP, a faixa do
sistema) fica na letra de terminal. Golpe tem a faixa da cor do tipo,
como na luta, e os botões são tecla com espessura que afunda: Guardar
na caixa / Levar no cinto (desligado com o motivo embaixo) e Ver ficha,
que abre o Sumário com o Voltar levando de volta pro PC
(`UI._sumarioDe`; o time aberto pela mochila marca `'time'`). Tocar
num Pokémon, guardar e levar redesenham **só a tela de dentro**
(`modalPC(sel)` com o PC aberto): reconstruir a janela fazia ela entrar
de novo a cada toque e voltava a caixa rolada pro começo. No celular a
ficha mora embaixo das listas, e o toque rola só o que falta pra ela
aparecer.

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
torneio e da Conferência é a chave de dezesseis (`chaveDoTorneio`, ver
"O Torneio Aberto"), numa tela só (`telaDaChave`): o quadro da sua luta
em cima (rosto, de onde vem, a bola fechada de cada Pokémon — quantos,
nunca quais — e o prêmio; o torneio diz a faixa de nível, a Conferência
não diz nada, e quem você nunca viu chega sem lugar), a chave e a
escada dos prêmios embaixo. A Conferência acende em azul (`.conf`). Na **Pokédex**, a casa tem duas linhas
(número e marca em cima, nome embaixo): na mesma linha, a etiqueta
"visto" cortava o nome. E `.linha .v` (a conta das linhas de valor) é
letra do HUD; só a Pokédex e o PC guardam a letra de tela deles (no PC,
só nos números).

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
- Atribuição curta entre ou depois de aspas ("ele diz.", "ela pergunta",
  "Você diz.") **some da tela** (`_SO_ATRIBUICAO`): o nome já está em
  cima do balão, e solta ela lia como frase começando em minúscula. Ela
  continua valendo pra saber quem fala. A que diz mais alguma coisa
  ("ele diz, sem levantar os olhos") fica, com maiúscula.
- Papel no meio da frase (`_ESCRITO` antes das aspas e a frase continuando
  depois: "letra de criança escrevendo "AQUI TEM VULCÃO" em lugares…")
  fica dentro da frase (`.escrito-inline`), em vez de partir a frase em
  blocos. O grito de alguém no meio da narração ("a menina grita "não"")
  vai sem pontuação dentro da aspa, senão vira balão.
- Presságio (`ef.presagio`) sai em itálico sem aspas em volta: se ele cita uma
  fala, as aspas são dele.
- Cena em que **toda escolha tem `cond`** precisa de uma que sempre vale
  (ou de duas que se completam, `x` e `!x`): a lista de pendências de
  Celadon só tinha opção pra quem trouxe pendência, e quem chegava sem
  nenhuma ficava no banco de praça pra sempre. Se acontecer de novo, o
  motor não prende: mostra "Voltar." pra cena de onde a pessoa veio
  (`d.cenaDeAntes`, gravada no `Historia.ir`) ou pro começo do capítulo,
  e escreve `Cena sem saída: <cap>:<cena>` no console, que o robô
  (`bot-jogador.js`) registra como achado.
- Conversa de cidade (`CONVERSAS`, em `lugares.js`) pode ter linha que é
  função — quem é de lá, quantas insígnias, se o ginásio está fechado — e
  `{cond, texto}` pro que só vale às vezes, com `ef` se a conversa ensina
  alguma coisa (aplicado na primeira vez que ela é ouvida). Descoberta começa sempre por
  texto, que vai pro diário. Morador tem rótulo próprio da cidade: dois
  "o dono do bar" em lugares diferentes viram a mesma pessoa no dia em
  que o jogador pergunta o nome de um deles.
