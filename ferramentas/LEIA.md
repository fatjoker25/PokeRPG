# Conferidores

Node puro, sem dependência. Rodar da raiz do projeto ou de qualquer lugar —
eles acham o `index.html` sozinhos e carregam os scripts na ordem de lá.

| arquivo | o que ele acusa |
|---|---|
| `valida.js` | cena que aponta pra cena que não existe, entrada que não existe, capítulo sem fim |
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

Rodar todos os de Node:

```sh
for f in ferramentas/*.js; do case "$f" in *baloes*|*lutas*|*telas*|*bot-*) continue;; esac; echo "== $f"; node "$f"; done
```

Quatro deles abrem o jogo de verdade num navegador e precisam de
Playwright (com o Chromium do ambiente, `/opt/pw-browsers/chromium`):

| arquivo | o que ele acusa |
|---|---|
| `chk-baloes.js` | balão sem nome, sem rosto ou com rosto que não existe no disco, em toda cena (capítulos, eventos, linhas, PokéNav) |
| `chk-lutas.js` | luta que não começa, não termina, sai sem fala, sem rosto ou com o time errado, ou que manda pra cena que não existe — ginásios, Elite, rivais, estrada, veteranos, barreiras, revanches e toda luta de cena |
| `chk-telas.js` | erro de JavaScript ou texto quebrado (marca sem resolver, `undefined`, `NaN`, `null`, HTML vazando) em toda janela (os cinco bolsos da mochila, time, sumário, Pokédex e as 251 fichas, PokéNav e cada contato, cartão, ficha, diário, rota, finais, credenciais, PC, ajustes, regras, tutorial, mapa), em toda loja comprando e vendendo, e em todo lugar do mapa com cada afazer da lista dele — num save cheio do meio do jogo e num save do começo, com a mochila quase vazia |
| `bot-jogador.js` | o robô que joga pela tela, como gente |

O `bot-jogador.js` escolhe golpe, troca, cura, captura, compra, treina, pega
o ônibus da Liga quando nasceu longe e segue a história, e anota todo texto
quebrado que aparecer — marca de gênero sem resolver, `undefined`, `NaN`,
HTML vazando, "bicho", "bola" sozinha, balão sem nome — além de erro de
JavaScript. "Travou no mapa" com `treinar` é a espera do treino, não erro.

```sh
node ferramentas/chk-telas.js
node ferramentas/bot-jogador.js 15 saida.json
CIDADE=Cerulean GENERO=Homem node ferramentas/bot-jogador.js 20
```
