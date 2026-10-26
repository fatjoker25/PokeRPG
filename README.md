# PokéRPG

RPG de Pokémon feito para jogar no navegador. Projeto de fã, em português do Brasil.

## Como abrir

- **Arquivo único:** baixe `pokerpg.html` e abra em qualquer navegador. Funciona offline e não precisa de instalação.
- **Pelo repositório:** abra `index.html`.

O progresso fica salvo no próprio navegador.

Depois de mexer em qualquer arquivo de `js/` ou `css/`, gere o arquivo único de novo:

```bash
python3 build.py
```

## Feito com

HTML, CSS e JavaScript puro, sem dependências nem servidor.

## Créditos

- Sprites de Pokémon, ícones de item, insígnias e gritos: repositórios de sprites e gritos da [PokeAPI](https://github.com/PokeAPI) (artes de Black/White e HeartGold/SoulSilver).
- Ícones dos bolsos da mochila e dos aparelhos (Pokédex, PokéNav e Cartão de Treinador): acervo da [Bulbapedia](https://archives.bulbagarden.net) (artes de Platinum e Ruby/Sapphire/Emerald).
- Cenários de batalha, rostos de treinador, efeitos e animações de golpe e músicas de batalha: [Pokémon Showdown](https://play.pokemonshowdown.com) (animações do cliente sob CC0 e MIT). Os rostos da rede (`sprites_nds/npcs/trainers/rede_*.png`) são os de recruta e executivo de HG/SS de lá, com a letra do peito apagada. O da Diana (`sprites_nds/npcs/trainers/diana.png`) é a Ace Trainer de HG/SS de lá. Os rostos de gente da história vêm do acervo inteiro de treinadores de lá — todas as gerações e os sprites de fã do Smogon Sprite Project no estilo de Black/White —, com o nome do arquivo de origem (`gentleman_gen7.png` é o `gentleman-gen7` do Showdown).
- Quatro rostos de gente da história (`sprites_nds/npcs/trainers/pr_*.png`): o primeiro quadro das folhas de treinador do [PokeRogue](https://github.com/pagefaultgames/pokerogue-assets) (`images/trainer/`), arte de fã no estilo de Black/White.
- Regras de jogo: Pokérole (Pokérole Project), com dados do Pokerole-Data, mantido pela comunidade.
- Fonte do título: Press Start 2P, de CodeMan38 (SIL Open Font License 1.1, em `fontes/`).
- Fonte da interface (fichas da luta, comandos, topo e cabeçalhos): Jost, de The Jost Project Authors / indestructible type* (SIL Open Font License 1.1, em `fontes/`).
- Ícones em SVG, efeitos sonoros e trilha calma: feitos no próprio projeto.

Pokémon é marca da Nintendo, Game Freak e Creatures Inc. Este é um projeto de fã, sem fim comercial.
