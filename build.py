#!/usr/bin/env python3
"""Gera pokerpg.html: um arquivo único com tudo embutido."""
import re, os

html = open('index.html', encoding='utf-8').read()
css = re.findall(r'<link rel="stylesheet" href="([^"]+)"', html)
js  = re.findall(r'<script src="([^"]+)"></script>', html)

estilos  = ['<style>\n' + open(c, encoding='utf-8').read() + '\n</style>' for c in css]
scripts  = ['/* ===== ' + j + ' ===== */\n' + open(j, encoding='utf-8').read() for j in js]

# ---- sprites: o arquivo único carrega as artes dentro dele ----
# Sem isso, pokerpg.html deixaria de funcionar sozinho:
# a promessa é abrir em qualquer lugar, sem pasta do lado.
import base64, json
SPRITES_DIR = 'sprites_nds'
# Pastas que ficaram na árvore mas ninguém mais pede: embuti-las
# custaria megabytes de data URI no arquivo único sem nada aparecer.
# Sai daqui quando voltar a ser usada em js/data/sprites.js.
SPRITES_FORA = ('sprites_nds/battle/back/', 'sprites_nds/battle/back_shiny/',
                'sprites_nds/battle/front/', 'sprites_nds/battle/front_shiny/')
# As GIFs animadas de Black/White (33 MB; 22 MB com o shiny pela paleta,
# mais abaixo) entram só no arquivo único que fica no repositório, e que
# tem que ficar abaixo dos 50 MB do aviso do GitHub; o artefato publicado
# tem teto de 16 MB e sai sem elas — lá cada <img> cai sozinha na arte
# parada.
SPRITES_SO_NO_UNICO = ('sprites_nds/battle/front_ani/', 'sprites_nds/battle/back_ani/',
                       'sprites_nds/battle/front_ani_shiny/', 'sprites_nds/battle/back_ani_shiny/')
sprites = {}
animadas = {}
if os.path.isdir(SPRITES_DIR):
    for raiz, _, arqs in os.walk(SPRITES_DIR):
        pasta = raiz.replace(os.sep, '/').rstrip('/') + '/'
        if pasta.startswith(SPRITES_FORA):
            continue
        if pasta.startswith(SPRITES_SO_NO_UNICO):
            for a in sorted(arqs):
                if a.endswith('.gif'):
                    caminho = os.path.join(raiz, a).replace(os.sep, '/')
                    animadas[caminho] = 'data:image/gif;base64,' + base64.b64encode(open(caminho, 'rb').read()).decode('ascii')
            continue
        for a in sorted(arqs):
            # png de sprite e efeito; jpg só nos fundos de golpe do Showdown
            if not a.endswith(('.png', '.jpg')):
                continue
            caminho = os.path.join(raiz, a).replace(os.sep, '/')
            dados = base64.b64encode(open(caminho, 'rb').read()).decode('ascii')
            tipo = 'image/jpeg' if a.endswith('.jpg') else 'image/png'
            sprites[caminho] = 'data:' + tipo + ';base64,' + dados
    # os gritos vão no mesmo dicionário: o jogo procura qualquer
    # arquivo pelo caminho relativo, seja imagem ou som
    if os.path.isdir('sons'):
        for raiz, _, arqs in os.walk('sons'):
            # a trilha é de quem joga, fica do lado do arquivo, nunca dentro
            if raiz.replace(os.sep, '/').startswith('sons/musica'):
                continue
            for a in sorted(arqs):
                if not a.endswith('.ogg'):
                    continue
                caminho = os.path.join(raiz, a).replace(os.sep, '/')
                dados = base64.b64encode(open(caminho, 'rb').read()).decode('ascii')
                sprites[caminho] = 'data:audio/ogg;base64,' + dados
    print(f'sprites embutidos: {len(sprites)} arquivos (+ {len(animadas)} GIFs animadas só no arquivo único)')
else:
    print('sprites_nds/ ausente — o arquivo único sai sem as artes')

# ---- o shiny animado que é o normal com outra paleta ----
# Quase todo GIF shiny é o GIF normal byte a byte, menos as tabelas de
# cor. Esses vão só com as tabelas (SPRITES_PALETA), e o jogo monta o
# arquivo na primeira vez que alguém pede (js/data/sprites.js): o
# mesmo arquivo, byte a byte, por uma fração do peso. O que difere em
# outra coisa (quadro, tempo, recorte) vai inteiro, como sempre foi.
def tabelas_de_cor(b):
    """onde ficam as tabelas de cor (global e locais) de um GIF"""
    if b[:6] not in (b'GIF87a', b'GIF89a'):
        return None
    tabs, i = [], 13
    if b[10] & 0x80:
        n = 3 * (2 ** ((b[10] & 7) + 1))
        tabs.append((i, i + n)); i += n
    while i < len(b):
        c = b[i]
        if c == 0x3B:
            return tabs
        if c == 0x21:
            i += 2
        elif c == 0x2C:
            fl = b[i + 9]; i += 10
            if fl & 0x80:
                n = 3 * (2 ** ((fl & 7) + 1))
                tabs.append((i, i + n)); i += n
            i += 1
        else:
            return None
        while True:              # os sub-blocos, até o de tamanho zero
            t = b[i]; i += 1
            if t == 0:
                break
            i += t
    return tabs

def sem_tabelas(b, tabs):
    partes, pos = [], 0
    for a, z in tabs:
        partes.append(b[pos:a]); pos = z
    return b''.join(partes) + b[pos:]

paletas = {}
for caminho in sorted(animadas):
    if '_ani_shiny/' not in caminho:
        continue
    normal = caminho.replace('_ani_shiny/', '_ani/')
    if normal not in animadas:
        continue
    n, s = open(normal, 'rb').read(), open(caminho, 'rb').read()
    tn, ts = tabelas_de_cor(n), tabelas_de_cor(s)
    if not tn or tn != ts or sem_tabelas(n, tn) != sem_tabelas(s, ts):
        continue
    paletas[caminho] = [normal, [[a, base64.b64encode(s[a:z]).decode('ascii')] for a, z in ts]]
for caminho in paletas:
    del animadas[caminho]
if paletas:
    print(f'shiny animado pela paleta: {len(paletas)} GIFs montados no jogo, {len(animadas)} GIFs inteiros')

def montar(dados, paletas=None):
    s = re.sub(r'<link rel="stylesheet" href="[^"]+">', '\n'.join(estilos), html)
    s = re.sub(r'<script src="[^"]+"></script>\s*', '', s)
    blocos = list(scripts)
    if paletas:
        blocos.insert(0, '/* ===== shiny animado pela paleta (' + str(len(paletas)) + ') ===== */\n'
                         'const SPRITES_PALETA = ' + json.dumps(paletas, separators=(',', ':')) + ';')
    if dados:
        blocos.insert(0, '/* ===== sprites embutidos (' + str(len(dados)) + ') ===== */\n'
                         'const SPRITES_DATA = ' + json.dumps(dados, separators=(',', ':')) + ';')
    return s.replace('</body>', '<script>\n' + '\n\n'.join(blocos) + '\n</script>\n</body>')

saida = montar(dict(sprites, **animadas), paletas)

open('pokerpg.html', 'w', encoding='utf-8').write(saida)
print(f'pokerpg.html — {os.path.getsize("pokerpg.html")/1024:.0f} KB '
      f'({len(css)} css, {len(js)} scripts)')
if os.path.getsize('pokerpg.html') > 50 * 1024 * 1024:
    print('  ATENÇÃO: passou de 50 MB, o GitHub avisa a cada push (ver CLAUDE.md, "A arte é de corpo inteiro")')

# variante para publicação como Artifact: sem doctype/html/body (o host envolve)
# e sem as GIFs, que não cabem no teto de 16 MB
saida = montar(sprites)
titulo = '<title>Pok\u00e9RPG</title>'
estilo = '\n'.join(re.findall(r'<style>.*?</style>', saida, re.S))
corpo  = re.search(r'<body[^>]*>(.*?)</body>', saida, re.S).group(1)
estilo = estilo.replace('html,body{margin:0;padding:0}', 'body{margin:0}')
estilo = estilo.replace('body[data-tom=', 'html[data-tom=')
corpo  = corpo.replace('<div id="app"></div>', '<div id="app" data-tom="leve"></div>')
corpo  = corpo.replace("tom(t){ document.body.setAttribute('data-tom', t || 'leve'); }",
                       "tom(t){ document.documentElement.setAttribute('data-tom', t || 'leve'); }")
open('artefato.html', 'w', encoding='utf-8').write(titulo + '\n' + estilo + '\n' + corpo.strip() + '\n')
print(f'artefato.html — {os.path.getsize("artefato.html")/1024:.0f} KB (para publicar)')
