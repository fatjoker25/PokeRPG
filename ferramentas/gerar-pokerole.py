#!/usr/bin/env python3
"""Gera js/data/pokerole.js a partir dos dados da comunidade do Pokérole.

Fonte: https://github.com/Willowlark/Pokerole-Data, pasta v3.0/
(clonar com GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 ...; os JSON são
pequenos, as imagens é que pesam).

Uso: python3 ferramentas/gerar-pokerole.py /caminho/Pokerole-Data/v3.0

Só entra o que o jogo usa: as espécies 1 a 251 (forma normal, sem mega,
alola ou galar) e os golpes que existem em js/data/golpes.js.
"""
import json, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTE = sys.argv[1] if len(sys.argv) > 1 else '/home/user/willowlark/pokerole-data/v3.0'

# nome do golpe no jogo -> nome da ficha no Pokérole
RENOMEADOS = {'Faint Attack': 'Feint Attack', 'Self-Destruct': 'Self Destruct',
              'Softboiled': 'Soft Boiled', 'Mud-Slap': 'Mud Slap'}

ATRIB = {'Strength': 'for', 'Dexterity': 'des', 'Vitality': 'vit', 'Special': 'esp',
         'Insight': 'ins', 'Will': 'von',
         'Tough': 'soc', 'Cool': 'soc', 'Beauty': 'soc', 'Clever': 'soc', 'Cute': 'soc'}

PERICIA = {'Brawl': 'Briga', 'Channel': 'Canalizar', 'Nature': 'Natureza',
           'Stealth': 'Furtividade', 'Perform': 'Atuação', 'Athletic': 'Atletismo',
           'Intimidate': 'Intimidação', 'Charm': 'Charme', 'Alert': 'Alerta',
           'Etiquette': 'Etiqueta', 'Clash': 'Choque', 'Evasion': 'Esquiva',
           'Medicine': 'Medicina', 'Empathy': 'Empatia', 'Throw': 'Arremesso'}


def nomes_golpes_do_jogo():
    txt = open(os.path.join(RAIZ, 'js/data/golpes.js'), encoding='utf-8').read()
    ini = txt.index('const GOLPES')
    fim = txt.index('\n};', ini)
    return re.findall(r"^\s*'([^']+)':\s*\{", txt[ini:fim], re.M)


def atributos(campo):
    """'Dexterity/Strength' -> ['des','for'] (vale o maior na hora)."""
    out = []
    for parte in (campo or '').split('/'):
        k = ATRIB.get(parte.strip())
        if k and k not in out:
            out.append(k)
    return out


def especies():
    saida = {}
    pasta = os.path.join(FONTE, 'Pokedex')
    for arq in os.listdir(pasta):
        d = json.load(open(os.path.join(pasta, arq), encoding='utf-8'))
        n = d.get('Number', 0)
        if not (1 <= n <= 251) or d.get('DexID') != '%04d' % n:
            continue
        saida[n] = [d['BaseHP'],
                    d['Strength'], d['Dexterity'], d['Vitality'], d['Special'], d['Insight'],
                    d['MaxStrength'], d['MaxDexterity'], d['MaxVitality'], d['MaxSpecial'], d['MaxInsight']]
    faltam = [n for n in range(1, 252) if n not in saida]
    if faltam:
        sys.exit('espécies sem ficha: %s' % faltam)
    return saida


def golpes():
    saida = {}
    pasta = os.path.join(FONTE, 'Moves')
    for nome in nomes_golpes_do_jogo():
        arq = os.path.join(pasta, RENOMEADOS.get(nome, nome) + '.json')
        if not os.path.exists(arq):
            sys.exit('golpe sem ficha: %s' % nome)
        m = json.load(open(arq, encoding='utf-8'))
        at = m.get('Attributes') or {}
        ef = m.get('AddedEffects') or {}
        g = {}
        p = m.get('Power')
        g['p'] = p if isinstance(p, int) else 0
        dano = atributos(m.get('Damage1'))
        if dano:
            g['d'] = dano
        if m.get('Damage1') == 'Varies' and 'Rank' in (m.get('Effect') or ''):
            g['posto'] = True           # Seismic Toss, Night Shade, Psywave
        prec = atributos(m.get('Accuracy1'))
        if prec:
            g['a'] = prec
        per = (m.get('Accuracy2') or '').split('/')[0].strip()
        if per in PERICIA:
            g['h'] = PERICIA[per]
        red = at.get('AccuracyReduction')
        if red:
            g['r'] = abs(int(red))
        for chave, curto in (('HighCritical', 'crit'), ('IgnoreDefenses', 'ign'),
                             ('NeverMiss', 'nunca'), ('DoubleAction', 'dupla'),
                             ('TripleAction', 'tripla'), ('SuccessiveActions', 'suc'),
                             ('AlwaysCrit', 'semprecrit')):
            if at.get(chave):
                g[curto] = 1
        fixo = ef.get('FixedDamage') or {}
        if fixo.get('Type') == 'Absolute':
            g['fixo'] = fixo.get('Value')
        elif fixo.get('Type') == 'OneHitKO':
            g['ohko'] = 1
        elif fixo.get('Type') == 'HpPercentage':
            g['metade'] = 1
        if m.get('Damage1') == 'SetDamage' and 'fixo' not in g:
            g['fixo'] = 1               # Sonic Boom: 1 de dano, sempre
        # dados de chance: o maior que o golpe pede pra condição ou atributo
        cd = 0
        for a in ef.get('Ailments') or []:
            cd = max(cd, int(a.get('ChanceDice') or 0))
        for s in ef.get('StatChanges') or []:
            cd = max(cd, int(s.get('ChanceDice') or 0))
        if cd:
            g['cd'] = cd
        saida[nome] = g
    return saida


def js(o):
    return json.dumps(o, ensure_ascii=False, separators=(',', ':'))


def main():
    esp = especies()
    gol = golpes()
    linhas = []
    linhas.append('/* ============================================================')
    linhas.append('   POKÉROLE 3.0 — atributos das espécies e dados dos golpes')
    linhas.append('   Gerado por ferramentas/gerar-pokerole.py a partir de')
    linhas.append('   github.com/Willowlark/Pokerole-Data (v3.0). Não editar à mão.')
    linhas.append('')
    linhas.append('   PR_ESPECIE[dex] = [HP base, FOR, DES, VIT, ESP, INS,')
    linhas.append('                      máx FOR, máx DES, máx VIT, máx ESP, máx INS]')
    linhas.append('   PR_GOLPE[nome]  = {p: poder (dados de dano), d: atributo do dano,')
    linhas.append('     a: atributo da precisão, h: perícia da precisão, r: precisão baixa,')
    linhas.append('     crit, ign (ignora defesa), nunca (não erra), dupla, tripla,')
    linhas.append('     suc (ações sucessivas), fixo, ohko, metade, posto, cd (dados de chance)}')
    linhas.append('   ============================================================ */')
    linhas.append('const PR_ESPECIE = {')
    for n in sorted(esp):
        linhas.append('  %d:%s,' % (n, js(esp[n])))
    linhas.append('};')
    linhas.append('')
    linhas.append('const PR_GOLPE = {')
    for nome in gol:
        linhas.append('  %s:%s,' % (js(nome), js(gol[nome])))
    linhas.append('};')
    destino = os.path.join(RAIZ, 'js/data/pokerole.js')
    open(destino, 'w', encoding='utf-8').write('\n'.join(linhas) + '\n')
    print('%d espécies, %d golpes -> %s' % (len(esp), len(gol), destino))


if __name__ == '__main__':
    main()
