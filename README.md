# Jornada do Campeão — RPG de Mesa de Pokémon (Kanto)

RPG narrativo de navegador. Sem instalação, sem build, sem servidor: **abra `index.html`**.

O universo é Kanto **dois anos depois** de Red desmontar a Equipe Rocket. Nele:

- Red **não** capturou Mewtwo — ele continua solto.
- Red capturou as três Aves Lendárias e **as soltou**.
- Só existem Pokémon de **1ª Geração**.
- Os únicos lendários de Kanto são: **Mew, Mewtwo, Moltres, Zapdos, Articuno, Entei, Raikou, Suicune e Ho-Oh**.
- Você tem **15 anos** e está saindo de casa pela primeira vez.

A campanha começa leve e vai escurecendo capítulo a capítulo — a própria paleta da interface acompanha o tom.

## Como jogar

```
Abra index.html em qualquer navegador.
```

O progresso é salvo automaticamente no `localStorage` do navegador.

## Sistema

### Combate
| Regra | Fórmula |
|---|---|
| Dano | `1d10 × (poder ÷ 10)` |
| Crítico | `1d20 = 20` → ×1,5 |
| Precisão | `1d20 > (100 − precisão) ÷ 5` |
| STAB | ×1,5 |
| Eficácia de tipo | 0× / 0,5× / 2× (tabela da 1ª Geração, 15 tipos) |
| Fuga | `1d20 ≥ (Vel. selvagem − sua + 10)` |

Turnos são ordenados por **Velocidade**, com prioridade para golpes como Quick Attack. PP, condições de status (veneno, queimadura, paralisia, sono, congelamento), confusão e estágios de atributo funcionam como nos jogos.

**Extensão documentada:** o dano também é multiplicado pela razão Ataque/Defesa (limitada entre 0,45× e 2,2×) — sem isso os 6 stats clássicos não teriam efeito algum sobre o dano. No modo *Combate prolongado*, escolhido na criação de personagem, o dano final é multiplicado por 0,6 para alongar as batalhas; o modo *fiel* usa a regra pura.

### Naturezas
As 25 naturezas dão ±10% em atributos **e mudam o comportamento em combate**: um `Brave` recusa golpes especiais, um `Timid` hesita no corpo a corpo, um `Naughty` erra o alvo de propósito, um `Hasty` ataca antes da ordem. Moral baixa aumenta a desobediência.

### Quando o seu Pokémon cai contra um selvagem
Se o selvagem tem natureza agressiva (Naughty, Brave, Adamant, Hasty, Impish, Jolly, Naive, Lonely, Rash), rola-se `1d20`: com **10+** ele ataca **você**. Dano = `(Ataque dele ÷ 10) × 1d10`. Naturezas passivas não atacam o treinador.

Você pode correr (`1d10 + Força ≥ 7`), encarar (`1d10 + Carisma`), usar item ou tentar a captura.

### Morte
- Em combate normal, Pokémon **desmaiam** — eles voltam.
- **Morte permanente** só acontece por escolha narrativa: escudo humano, abandono, sacrifício, não intervir. Quem morre vai para o cemitério da ficha e **nunca** sai de lá.
- **Treinador com 0 HP = fim de jogo permanente.** O save é apagado.

### Captura de lendários
- Poké Ball e Great Ball **não funcionam**.
- Ultra Ball: `1d20`, só **1–2** capturam.
- Master Ball normalmente captura.
- **Mewtwo e Ho-Oh** rolam `1d20` antes de tudo: em **1–5 a bola quebra**, o lendário fica furioso e passa a te caçar para sempre.

Capturar um lendário gera consequências em cascata: os outros do grupo caçam você, o clima de Kanto se desestabiliza, a Liga age em três estágios (conversa → ordem de devolução → ordem de detenção), e manter o lendário preso faz a reputação Ruim subir com o tempo.

### Reputação
Dois eixos de 8 níveis (Bom: Desconhecido → Lendário; Ruim: Desconhecido → Monstro Lendário). Ações contrárias **lavam** o eixo oposto antes de subir o seu, e nada te devolve a "Desconhecido" — o mundo lembra, e os NPCs lembram individualmente.

### Perícias
`1d10 + status` contra a dificuldade: 1–3 fracasso · 4–6 parcial · 7–9 sucesso · 10+ crítico.
Status do treinador: Força, Percepção, Intelecto, Carisma, Sorte, Resistência (1 → 10). **2 pontos por capítulo**, no máximo +1 por status por capítulo.

## Estrutura do projeto

```
index.html
css/estilo.css           paleta que escurece conforme o tom do capítulo
js/data/types.js         15 tipos + tabela de eficácia da 1ª Geração
js/data/pokedex.js       os 151 + cães lendários + Ho-Oh, com stats e evoluções
js/data/golpes.js        97 golpes e o gerador de movesets por espécie/nível
js/data/naturezas.js     25 naturezas com efeito mecânico e comportamental
js/engine/dados.js       todas as rolagens, registradas e exibidas
js/engine/pokemon.js     instâncias, stats por nível, exp, evolução, encontros
js/engine/estado.js      reputação, memória de NPCs, lendários, save/load
js/engine/batalha.js     combate completo
js/engine/captura.js     captura e consequências em cascata dos lendários
js/story/motor.js        resolução de cenas, efeitos e progressão
js/story/capitulos.js    a campanha
js/ui/interface.js       telas
js/main.js               fluxo do jogo
```

## Encontros aleatórios

Espécie e nível são **totalmente aleatórios**. O ambiente apenas enviesa a probabilidade — um Pokémon de nível 30 pode aparecer na Rota 1 (`1d20 = 20` na rolagem de nível). Lendários nunca aparecem em encontro aleatório: só em evento narrativo.
