# Conferidores

Node puro, sem dependência. Rodar da raiz do projeto ou de qualquer lugar —
eles acham o `index.html` sozinhos e carregam os scripts na ordem de lá.

| arquivo | o que ele acusa |
|---|---|
| `valida.js` | cena que aponta pra cena que não existe, entrada que não existe, capítulo sem fim, função global declarada em dois arquivos (o `<script>` de baixo apaga o de cima calado) |
| `orfas.js` | cena que existe e que ninguém alcança |
| `render.js` | cena que estoura ao ser renderizada (função de texto que quebra) |
| `chk-efkeys.js` | chave de `ef:{}` que o motor não lê — `ef.cura`, `ef.val`, `ef.item` não existem e não fazem nada |
| `chk-estrutura.js` | quantos capítulos abrem sempre na mesma cena, onde estão os finais, quantas ramificações |
| `chk-gramatica.js` | palavra repetida, espaço duplo, vírgula solta |
| `chk-canon.js` | tipo, ginásio, líder, golpe ou nível que briga com o cânone de Kanto |
| `chk-flags.js` | gancho morto: flag que alguma cena lê e nenhuma escreve, então a cena condicional nunca aparece |
| `chk-finais.js` | todo final do jogo, onde mora, id repetido e final que nenhuma escolha alcança |
| `chk-nomes.js` | personagem que carrega cena (12+ falas) e continua sendo chamado por descrição em vez de nome |
| `chk-campo.js` | o sistema de cortar/atravessar/voar/forçar/iluminar: quantas espécies servem pra cada coisa e se as portas apontam pra cena que existe |
| `chk-tms.js` | TM que ninguém dá, vende ou acha; TM sem preço; disco que não é o do tipo do golpe |
| `chk-caminho.js` | menor caminho da entrada até o fim de cada capítulo, e quanto do capítulo dá pra alcançar de uma entrada só |
| `sim-estrada.js` | força dos treinadores de estrada, lugar por lugar, com o motor de batalha do jogo |
| `sim-veteranos.js` | força dos veteranos, dos convites e das três rodadas da Conferência do Planalto Indigo |
| `sim-moral.js` | moral do time capítulo a capítulo (1 a 20), quanto a história e a fome tiram, quantas Rações o time come e a chance de desobedecer — de quem anda com Ração e de quem nunca compra |

Um é Python, porque precisa ler imagem (Pillow, o mesmo dos geradores de
rosto em `variar-rostos.py` e `desenhar-capuz.py`):

| arquivo | o que ele acusa |
|---|---|
| `chk-arte.py` | GIF animada que não tem a cara da arte parada da mesma espécie — forma regional, outra espécie ou brilhante trocado. A PokeAPI tinha o Rattata de costas de Alola no lugar do de Kanto |

Rodar todos os de Node:

```sh
for f in ferramentas/*.js; do case "$f" in *baloes*|*lutas*|*telas*|*bot-*) continue;; esac; echo "== $f"; node "$f"; done
```

Quatro deles abrem o jogo de verdade num navegador e precisam de
Playwright (com o Chromium do ambiente, `/opt/pw-browsers/chromium`):

| arquivo | o que ele acusa |
|---|---|
| `chk-baloes.js` | balão sem nome, sem rosto ou com rosto que não existe no disco, em toda cena (capítulos, eventos, linhas, PokéNav) |
| `chk-lutas.js` | luta que não começa, não termina, sai sem fala, sem rosto ou com o time errado, ou que manda pra cena que não existe — ginásios, Elite, rivais, estrada, veteranos, a rede, barreiras, revanches e toda luta de cena |
| `chk-telas.js` | erro de JavaScript ou texto quebrado (marca sem resolver, `undefined`, `NaN`, `null`, HTML vazando) na inscrição (cada passo e cada opção, nos dois gêneros, até sair de casa) e em toda janela (os cinco bolsos da mochila, time, sumário, Pokédex e as 251 fichas, PokéNav e cada contato, cartão, ficha, diário, rota, finais, credenciais, PC, ajustes, regras, tutorial, mapa, o Salvar e o Carregar jogo com arquivo bom e ruim), em toda loja comprando e vendendo, e em todo lugar do mapa com cada afazer da lista dele — num save cheio do meio do jogo e num save do começo, com a mochila quase vazia |
| `chk-celular.js` | o `artefato.html` dentro do esqueleto da publicação, a 320, 390 e 360 px: página que rola de lado, coisa pra fora da tela, erro de JavaScript e texto quebrado na abertura, na inscrição, num capítulo, nas janelas, na loja, no Centro, numa luta e na evolução (rodar depois do build) |
| `bot-jogador.js` | o robô que joga pela tela, como gente |

O `bot-jogador.js` escolhe golpe, troca, cura, captura, compra, treina, pega
o ônibus quando nasceu longe, vai atrás de ginásio quando a história pede
insígnia e segue a história, e anota todo texto
quebrado que aparecer — marca de gênero sem resolver, `undefined`, `NaN`,
HTML vazando, "bicho", "bola" sozinha, balão sem nome — além de erro de
JavaScript. "Travou no mapa" com `treinar` é a espera do treino, não erro.
No fim ele lista também todo o dinheiro que saiu (`GASTOS`), agrupado
pela função que tirou, com onde foi a primeira vez. Dinheiro que some sem
derrota é o primeiro sinal de laço: o robô já comprou Ração sem parar em
Saffron, onde a loja não vende Potion, e saiu de lá com 129.

Ele joga do **jeito** que o objetivo da ficha pede (`META=`, ou o que a
inscrição sortear; os números estão em `JEITOS`): o competitivo caça
ginásio e tenta a Elite, o colecionador captura toda espécie que a
Pokédex não tem, o protetor e o ambicioso trocam no PC pelo que é mais
forte, o fiel ao time fica com os seis primeiros, o andarilho vasculha e
desvia, o prudente cura cedo e foge antes. As escolhas de cena continuam
no dado, com o que combina com o jeito pesando três vezes. Todo mundo
completa o time capturando, ninguém joga Pokébola no que tem medo, e no
Centro ele usa o PC (tira o morto, completa o cinto, troca o pior) e a
pedra de evolução que comprou. `INICIAL=rand` marca "O que já estava em
casa" na inscrição, o inicial sorteado pela tabela da casa, e `'?'` em
`NOME`, `GENERO` e `CIDADE` deixa o jogo ou o dado escolher.

A jornada inteira não cabe numa etapa: a cada `PONTO_MIN` minutos (5), no
mapa, e no fim da etapa, ele grava `<saída>.ponto.json` (o save do
Salvar, com a luta se tiver uma, mais o diário e o que ele lembra), e
`RETOMAR=` começa a etapa seguinte dali, com o diário continuando. A saída
diz como a etapa acabou (`estado`: `final`, `morte`, `pausa`, `erros`,
`travou`). `TURBO=N` encena a luta N vezes mais rápido que 1× (o botão do
jogo vai até 3×; só a encenação muda, dado e turno são os mesmos). Com
`TURBO=20` ele chega ao capítulo 4 em seis minutos.

Em 25 minutos e 3× ele chega ao capítulo 4 ou 5. Pro meio e o fim do jogo,
`CAPITULO=N` faz a inscrição e pula pra antes do capítulo N: o inicial
entregue e subido pro nível da área, mais cinco no time, os capítulos de
antes fechados (com o de caminho de cada desvio que ficou pra trás: antes
do 26 é depois do 25.06), as insígnias que o capítulo pede, pontos,
dinheiro, mochila e PokéNav, no lugar onde o capítulo anterior acaba (as
escolhas desses capítulos não aconteceram, e as flags ficam vazias).
`SAVE=` começa de um arquivo do Salvar, pelo caminho do "Carregar jogo",
e `NOME=` dá o nome da inscrição. Ele joga a luta em 3×.

O arquivo de saída traz o diário de bordo (`reg.passos`: cada capítulo
aberto e fechado, cada escolha de cena com o texto, cada luta com o
contexto — ginásio, Liga, rival, estrada, história, mato —, viagem,
compra, evolução, morte, cena de linha, rival e o final) e a ficha do fim
(`ficha`: quem jogou, o inicial, o time com golpes, insígnias, dinheiro,
reputação, via, linha e o diário do próprio jogo).

```sh
node ferramentas/chk-telas.js
node ferramentas/bot-jogador.js 15 saida.json
CIDADE=Cerulean GENERO=Homem node ferramentas/bot-jogador.js 20
CAPITULO=17 node ferramentas/bot-jogador.js 25 saida.json
SAVE=jornada.json node ferramentas/bot-jogador.js 25
NOME='?' GENERO='?' CIDADE='?' META=pokedex INICIAL=rand TURBO=20 node ferramentas/bot-jogador.js 105 r1.json
RETOMAR=r1.ponto.json TURBO=20 node ferramentas/bot-jogador.js 105 r1.json
```
