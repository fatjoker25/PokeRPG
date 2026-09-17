# Jornada do Campeão — RPG de Mesa de Pokémon (Kanto)

RPG narrativo de navegador. Sem instalação, sem build, sem servidor: **abra `index.html`**.

O universo é Kanto **dois anos depois** de Red desmontar a Equipe Rocket. Nele:

- Red **não** capturou Mewtwo — ele continua solto.
- Red capturou as três Aves Lendárias e **as soltou**.
- Só existem Pokémon de **1ª Geração**.
- Os únicos lendários de Kanto são: **Mew, Mewtwo, Moltres, Zapdos, Articuno, Entei, Raikou, Suicune e Ho-Oh**.
- Você tem **15 anos** e está saindo de casa pela primeira vez.

A campanha começa leve e vai escurecendo capítulo a capítulo — a própria paleta da interface acompanha o tom.

## A campanha

**20 capítulos · 488 cenas · 769 escolhas · 17 finais · 8 ginásios.**

| # | Capítulo | Tom |
|---|---|---|
| 1 | A Última Manhã | leve |
| 2 | Gente Boa e Gente Comum | leve |
| 3 | O Que Tem Debaixo das Folhas | inquieto |
| 4 | Pedra Sobre Pedra | inquieto |
| 5 | O Que Sobrou da Rocket | sombrio |
| 6 | O Preço de Uma Coisa Viva | sombrio |
| 7 | A Torre | muito sombrio |
| 8 | Todo Mundo Paga Passagem | sombrio |
| 9 | A Cidade que Compra | muito sombrio |
| 10 | O Zumbido | sombrio |
| 11 | A Torre de Vidro | muito sombrio |
| 12 | Nove Mil Hectares | muito sombrio |
| 13 | Congelou | muito sombrio |
| 14 | O Caderno de Cinnabar | muito sombrio |
| 15 | Os Três que Correm | muito sombrio |
| 16 | A Ilha Sem Nome | muito sombrio |
| 17 | O Jardim | muito sombrio |
| 18 | O Que Te Oferecem | muito sombrio |
| 19 | O Vale | muito sombrio |
| 20 | Eu Perguntei Primeiro | final |

### Os oito ginásios

Acessíveis a qualquer momento pelo botão **Ginásios** na barra do topo, entre capítulos ou no encerramento de cada um. Cada líder tem time completo, fala diferente conforme o que você fez **na cidade dele**, e uma insígnia com efeito mecânico.

| # | Líder | Cidade | Tipo | Insígnia | Efeito |
|---|---|---|---|---|---|
| 1 | Brock | Pewter | Pedra | Pedra | Pokémon que não escolheram você hesitam menos |
| 2 | Misty | Cerulean | Água | Cascata | Lojas vendem o estoque de trás do balcão |
| 3 | Lt. Surge | Vermilion | Elétrico | Trovão | +1 Percepção |
| 4 | Erika | Celadon | Grama | Arco-Íris | +1 Intelecto |
| 5 | Koga | Fuchsia | Venenoso | Alma | +1 Resistência |
| 6 | Sabrina | Saffron | Psíquico | Pântano | +1 Carisma |
| 7 | Blaine | Cinnabar | Fogo | Vulcão | +1 Sorte |
| 8 | Giovanni | Viridian | Terrestre | Terra | A Liga passa a te tratar como quem terminou o que começou |

Cada insígnia também reduz a desobediência do time em 3 pontos — com as oito, até um Pokémon comprado numa banca de rua obedece.

**Viridian só abre com sete insígnias**, e quem está lá dentro é Giovanni. Dois anos depois de Red desmontar a Rocket, ele voltou para a única coisa que sempre foi legalmente dele: a licença do ginásio, em nome próprio, com certificado de vistoria na parede. É o pagamento da linhagem que o capítulo 9 abre ("Giovanni era o primeiro. O segundo durou nove meses. Eu sou a terceira.").

**Líderes recusam luta.** Erika não enfrenta quem lucra com o tráfico de Celadon; Sabrina não fica na mesma sala de quem destruiu o andar 11; Misty lembra de quem passou reto pela Marta na Rota 25. Toda recusa tem saída — pela reputação, que lava o eixo contrário, exatamente como as regras do sistema definem.

### Rotas narrativas

O capítulo 9, em Celadon, é o ponto de virada: o que você responde ali define como Kanto passa a te enxergar pelo resto da campanha.

| Rota | Como se entra | O que muda |
|---|---|---|
| **Herói** | recusa a rede e vai atrás do depósito | NPCs te procuram quando algo dá errado; cenas exclusivas de resgate |
| **Mercenário** | aceita trabalhar para a Terceira | acesso por docas e portões de serviço; opções de venda e coleta |
| **Foragido** | anuncia que quer a rede para si | você herda clientes e problemas; a Liga abre ficha |
| **Pesquisador** | escolhe entender antes de agir | descobre o andar 11, a matriz e o que ninguém mais vê |
| **Neutro** | sai no meio da conversa | nenhuma porta se abre; nenhuma se fecha |

A rota altera texto, escolhas disponíveis e cenas inteiras em oito capítulos diferentes — e alguns finais só existem dentro de uma rota.

### Os 17 finais

Todos são alcançados no capítulo 20, e o que abre cada um é o que você fez nos dezenove anteriores: o que leu, o que soltou, o que destruiu, a quem prometeu alguma coisa, e o que você responde quando ele pergunta o que ele é.

O jogo mantém um **códice de finais** no navegador, que sobrevive entre partidas — dá para ver quantos dos 17 você já encontrou pela tela inicial.

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
js/story/motor.js        cenas, efeitos, rotas divergentes e progressão
js/story/capitulos.js    registro da campanha
js/story/cap-*.js        os 20 capítulos
js/story/ginasios.js     os 8 líderes, times, falas e travas
js/ui/interface.js       telas
js/main.js               fluxo do jogo
```

## Encontros aleatórios

Espécie e nível são **totalmente aleatórios**. O ambiente apenas enviesa a probabilidade — um Pokémon de nível 30 pode aparecer na Rota 1 (`1d20 = 20` na rolagem de nível). Lendários nunca aparecem em encontro aleatório: só em evento narrativo.


## Continuidade

O mundo lembra de tudo, e isso é mecânico, não decorativo:

- **NPCs têm memória individual** — cada um guarda uma opinião numérica e as cenas em que você apareceu. Téo, a Dra. Ivone, o Caçador Vasco, o Capitão do S.S. Anne, a Terceira, Sabrina, Seu Bento e outros reagem ao que você fez com eles muitos capítulos antes.
- **O cemitério é permanente.** Quem morre por escolha sua aparece na ficha até o fim, com a causa escrita, e é citado na Torre de Lavender e na entrevista da Liga.
- **A instabilidade de Kanto** é um número que sobe quando você captura lendários ou quebra equilíbrios, e ela muda o clima descrito nas rotas, o que a Liga fala com você e o que você vê no capítulo 19.
- **A Liga escala em três estágios** e emite ordem de detenção por conta própria se você insistir.
- **A reputação nunca zera.** Ações contrárias lavam o eixo oposto antes de subir o seu — e os NPCs continuam citando as duas metades da frase.
