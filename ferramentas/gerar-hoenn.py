#!/usr/bin/env python3
"""Gera js/data/hoenn.js: as 135 espécies de Hoenn (252 a 386).

Fonte: os dados do Pokémon Showdown (github.com/smogon/pokemon-showdown,
pasta data/), os arquivos pokedex.ts e learnsets.ts. São objetos
literais de TypeScript, só dado; este script lê como texto e converte
pra JSON sem executar nada.

Uso:
    mkdir pasta && cd pasta
    curl -O https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/pokedex.ts
    curl -O https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/learnsets.ts
    python3 -I ferramentas/gerar-hoenn.py pasta

O que sai:
  - DEX_RAW_HOENN, no formato do DEX_RAW (pokedex.js): número, nome,
    tipos, base dos jogos, a evolução e o nível dela (0 = pedra, troca
    ou amizade). Os tipos são os da 3ª geração: o Fada não existia, e
    o Gardevoir, o Mawile e o Azurill voltam pro tipo de antes.
  - PRE_EVO_HOENN: as evoluções que se dividem (o Wurmple, o Nincada,
    o Clamperl), que o campo `evo` não guarda.
  - APRENDE_RAW_HOENN: o que cada espécie aprende por nível na 3ª
    geração (código 3L do Showdown), só com golpes que existem em
    js/data/golpes.js.
O Azurill e o Wynaut ficam sem evolução ligada, como os bebês de Johto
(pokedex.js): ligar daria piso de nível 18 ao Marill e ao Wobbuffet.
Os atributos do Pokérole vêm de outro gerador (gerar-pokerole.py).
"""
import json, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TIPO = {'Normal': 'Normal', 'Fire': 'Fogo', 'Water': 'Água', 'Electric': 'Elétrico', 'Grass': 'Grama',
        'Ice': 'Gelo', 'Fighting': 'Lutador', 'Poison': 'Venenoso', 'Ground': 'Terrestre',
        'Flying': 'Voador', 'Psychic': 'Psíquico', 'Bug': 'Inseto', 'Rock': 'Pedra',
        'Ghost': 'Fantasma', 'Dragon': 'Dragão', 'Dark': 'Sombrio', 'Steel': 'Metálico'}
# o tipo de antes do Fada (6ª geração)
TIPO_DA_TERCEIRA = {'Azurill': ['Normal'], 'Mawile': ['Steel']}
# nome do golpe no Showdown -> nome no jogo, quando a conta de letras não bate
RENOMEADOS = {'feintattack': 'Faint Attack', 'highjumpkick': 'High Jump Kick'}
SEM_LIGACAO = {298, 360}          # Azurill e Wynaut: bebês de espécie de Johto
DIVIDIDAS = {268: 265, 292: 290, 368: 366}   # Cascoon, Shedinja, Gorebyss


def ler_ts(caminho):
    """Objeto literal do .ts -> dict, por texto (nada é executado)."""
    t = open(caminho, encoding='utf-8').read()
    t = t[t.index('{', t.index('=')):]
    t = t[:t.rindex('}') + 1]
    t = re.sub(r'^\s*//.*$', '', t, flags=re.M)
    t = re.sub(r'[ \t]*//[^"\n]*$', '', t, flags=re.M)
    t = re.sub(r'([{,]\s*|^\s*)([A-Za-z_][A-Za-z0-9_]*|\d+)\s*:',
               lambda m: m.group(1) + '"' + m.group(2) + '":', t, flags=re.M)
    t = re.sub(r"'([^'\"\\\n]*)'", r'"\1"', t)
    t = re.sub(r',(\s*[}\]])', r'\1', t)
    return json.loads(t)


def golpes_do_jogo():
    txt = open(os.path.join(RAIZ, 'js/data/golpes.js'), encoding='utf-8').read()
    ini = txt.index('const GOLPES')
    fim = txt.index('\n};', ini)
    nomes = re.findall(r"^\s*'([^']+)':\s*\{", txt[ini:fim], re.M)
    por_id = {}
    for n in nomes:
        por_id[re.sub(r'[^a-z0-9]', '', n.lower())] = n
    for k, v in RENOMEADOS.items():
        if v in nomes:
            por_id[k] = v
    return por_id


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    pasta = sys.argv[1]
    dex = ler_ts(os.path.join(pasta, 'pokedex.ts'))
    sets = ler_ts(os.path.join(pasta, 'learnsets.ts'))
    golpes = golpes_do_jogo()

    por_num, por_nome = {}, {}
    for chave, e in dex.items():
        n = e.get('num', 0)
        if 252 <= n <= 386 and not e.get('forme') and not e.get('baseSpecies'):
            por_num[n] = dict(e, id=chave)
        por_nome[e.get('name')] = e

    faltam = [n for n in range(252, 387) if n not in por_num]
    if faltam:
        sys.exit('espécies sem ficha: %s' % faltam)

    linhas_dex, linhas_apr = [], []
    for n in range(252, 387):
        e = por_num[n]
        nome = e['name']
        tipos = TIPO_DA_TERCEIRA.get(nome) or [t for t in e['types'] if t != 'Fairy']
        tipos = [TIPO[t] for t in tipos]
        b = e['baseStats']
        evo, nivel = 0, 0
        if n not in SEM_LIGACAO:
            for alvo in e.get('evos', []):
                y = por_nome.get(alvo)
                if not y or y.get('num', 0) > 386:
                    continue
                evo = y['num']
                nivel = y.get('evoLevel', 0) if not y.get('evoType') else 0
                break
        linhas_dex.append('[%d,%s,%s,%d,%d,%d,%d,%d,%d,%d,%d]' % (
            n, json.dumps(nome), json.dumps(tipos, ensure_ascii=False),
            b['hp'], b['atk'], b['def'], b['spa'], b['spd'], b['spe'], evo, nivel))

        aprende = []
        for mid, fontes in ((sets.get(e['id']) or {}).get('learnset') or {}).items():
            nome_golpe = golpes.get(mid)
            if not nome_golpe:
                continue
            niveis = [int(f[2:]) for f in fontes if f.startswith('3L')]
            if niveis:
                aprende.append((min(niveis), nome_golpe))
        aprende.sort()
        if aprende:
            linhas_apr.append('%d:%s' % (n, json.dumps(','.join('%d %s' % x for x in aprende), ensure_ascii=False)))

    saida = ['/* ============================================================',
             '   HOENN — as 135 espécies da 3ª geração (252 a 386)',
             '   Gerado por ferramentas/gerar-hoenn.py a partir dos dados do',
             '   Pokémon Showdown. Não editar à mão.',
             '',
             '   Ninguém pega Pokémon de Hoenn em Kanto nem nas Ilhas Sevii: eles',
             '   vêm no time de quem veio de lá (o torneio de Sevii). A Pokédex',
             '   registra quem você viu (pokedex.js, idsDeHoenn); os sprites só',
             '   existem pra quem aparece num time (sprites_nds/battle/…).',
             '   ============================================================ */',
             'const DEX_RAW_HOENN = [']
    saida += [l + ',' for l in linhas_dex]
    saida[-1] = saida[-1].rstrip(',')
    saida.append('];')
    saida.append('/* as evoluções que se dividem, que o campo evo não guarda */')
    saida.append('const PRE_EVO_HOENN = %s;' % json.dumps({str(k): v for k, v in DIVIDIDAS.items()}).replace('"', ''))
    saida.append('/* o que cada uma aprende por nível na 3ª geração (só golpe que existe no jogo) */')
    saida.append('const APRENDE_RAW_HOENN = {')
    saida += [l + ',' for l in linhas_apr]
    saida[-1] = saida[-1].rstrip(',')
    saida.append('};')
    destino = os.path.join(RAIZ, 'js/data/hoenn.js')
    open(destino, 'w', encoding='utf-8').write('\n'.join(saida) + '\n')
    print('%d espécies, %d com golpes por nível -> %s' % (len(linhas_dex), len(linhas_apr), destino))


if __name__ == '__main__':
    main()
