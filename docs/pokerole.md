# Pokérole — anotações pra quando for a hora

Pedido do jogador: trocar a mecânica pela do **Pokérole**. **Feito no
combate** (edição 3.0), com o nível dos jogos mantido e a ficha do
treinador intacta — ver a seção "O combate é Pokérole" do CLAUDE.md e a
folha de regras. O que segue ficou como registro de onde vieram os dados.

## Onde estão os dados

O PDF do livro tem 172 MB e não precisa vir: a comunidade mantém os dados
em JSON num repositório público, que é fonte de verdade pra vários apps
de Pokérole (Foundry VTT, Pokeroledex, bot de Discord).

- `https://github.com/Willowlark/Pokerole-Data`
- clonar com `GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 …` (~600 MB, a
  maior parte é imagem; os JSON são pequenos)
- conferido no commit `e0f5c16` (2 set. 2026)
- duas edições lado a lado: `v2.0/` e `v3.0/`

| pasta | v2.0 | v3.0 |
|---|---|---|
| Pokedex | 1022 | 1200 |
| Moves | 734 | 892 |
| Abilities | 292 | 305 |
| Natures | 25 | 25 |

Cobertura do que o jogo usa (v3.0): as 251 espécies estão todas lá, e
208 dos 212 golpes de `js/data/golpes.js` têm ficha com o mesmo nome.

## Formato

**Espécie** (`v3.0/Pokedex/Rattata.json`): `BaseHP 3`, atributo e
máximo pra `Strength 2/4`, `Dexterity 2/5`, `Vitality 1/3`,
`Special 1/3`, `Insight 1/3`, `RecommendedRank`, habilidades, e golpes
por posto (`Starter`, `Rookie`, `Standard`, `Advanced`, `Expert`, `Ace`),
não por nível.

**Golpe** (`v3.0/Moves/Tackle.json`): `Power` de 1 a ~10 (às vezes
texto), `Damage1` (atributo que soma no dano: Strength/Special),
`Accuracy1` + `Accuracy2` (atributo + perícia da precisão, ex.
Dexterity + Channel), `Category` (Physical/Special/Support), `Effect` em
texto e `AddedEffects` estruturado (ex. queimadura com 1 dado de chance).

**Natureza**: `Confidence` (número) e palavras-chave de temperamento —
no Pokérole a natureza não mexe em atributo, mexe em confiança/vontade.

## O que foi decidido com o jogador

1. Só no combate; a ficha do treinador continua no d10.
2. Edição 3.0 (o jogador não disse qual é o PDF dele; se for 2.0, os
   números de veneno, queimadura e posto mudam um pouco).
3. O d10 fica pra história, pra ficha e pros testes de cena.
4. Os dois convivem: o nível dos jogos continua e vira posto e pontos.

## Estimativa dada

3 etapas só pro combate (regras de dado/dano/HP/iniciativa, atributos
das espécies, conversão dos golpes); 4 a 5 com a ficha do treinador,
remapeando os ~50 testes de atributo da história e da exploração, mais
folha de regras, interface e rebalanceamento.

As regras de combate em si (quantos sucessos, como a Defesa desconta,
dor, ações por rodada) **não** estão no JSON: conferir no PDF antes de
escrever o motor, não de memória.

## Por que isso importa pro jogo de hoje

A análise geral achou que o dano atual (`1d10 × poder ÷ 10 × razão
Ataque/Defesa`) não escala com o nível, e o HP escala: entre bichos
iguais a luta acaba num golpe só até perto do nível 30. O Pokérole
resolve isso de outro jeito (HP pequeno e Defesa descontando sucessos),
então a troca de mecânica e o conserto do balanço são a mesma decisão.
