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
| `chk-caminho.js` | menor caminho da entrada até o fim de cada capítulo, e quanto do capítulo dá pra alcançar de uma entrada só |

Rodar todos:

```sh
for f in ferramentas/*.js; do echo "== $f"; node "$f"; done
```

Os conferidores que abrem o jogo de verdade num navegador (balão de fala,
missões do PokéNav, eventos de cidade, epílogos) precisam de Playwright
instalado e por isso não moram aqui.
