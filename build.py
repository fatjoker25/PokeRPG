#!/usr/bin/env python3
"""Gera jornada-do-campeao.html: um arquivo único com tudo embutido."""
import re, os

html = open('index.html', encoding='utf-8').read()
css = re.findall(r'<link rel="stylesheet" href="([^"]+)"', html)
js  = re.findall(r'<script src="([^"]+)"></script>', html)

estilos  = ['<style>\n' + open(c, encoding='utf-8').read() + '\n</style>' for c in css]
scripts  = ['/* ===== ' + j + ' ===== */\n' + open(j, encoding='utf-8').read() for j in js]

# ---- sprites: o arquivo único carrega as artes dentro dele ----
# Sem isso, jornada-do-campeao.html deixaria de funcionar sozinho:
# a promessa é abrir em qualquer lugar, sem pasta do lado.
import base64, json
SPRITES_DIR = 'sprites_nds'
# Pastas que ficaram na árvore mas ninguém mais pede: embuti-las
# custaria megabytes de data URI no arquivo único sem nada aparecer.
# Sai daqui quando voltar a ser usada em js/data/sprites.js.
SPRITES_FORA = ('sprites_nds/battle/back/', 'sprites_nds/battle/back_shiny/',
                'sprites_nds/battle/front/', 'sprites_nds/battle/front_shiny/')
# As GIFs animadas de Black/White (34 MB) entram só no arquivo único que
# fica no repositório; o artefato publicado tem teto de 16 MB e sai sem
# elas — lá cada <img> cai sozinha na arte parada.
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

def montar(dados):
    s = re.sub(r'<link rel="stylesheet" href="[^"]+">', '\n'.join(estilos), html)
    s = re.sub(r'<script src="[^"]+"></script>\s*', '', s)
    blocos = list(scripts)
    if dados:
        blocos.insert(0, '/* ===== sprites embutidos (' + str(len(dados)) + ') ===== */\n'
                         'const SPRITES_DATA = ' + json.dumps(dados, separators=(',', ':')) + ';')
    return s.replace('</body>', '<script>\n' + '\n\n'.join(blocos) + '\n</script>\n</body>')

saida = montar(dict(sprites, **animadas))

open('jornada-do-campeao.html', 'w', encoding='utf-8').write(saida)
print(f'jornada-do-campeao.html — {os.path.getsize("jornada-do-campeao.html")/1024:.0f} KB '
      f'({len(css)} css, {len(js)} scripts)')

# variante para publicação como Artifact: sem doctype/html/body (o host envolve)
# e sem as GIFs, que não cabem no teto de 16 MB
saida = montar(sprites)
titulo = '<title>Jornada do Campeao</title>'.replace('Campeao', 'Campe\u00e3o')
estilo = re.search(r'<style>.*?</style>', saida, re.S).group(0)
corpo  = re.search(r'<body[^>]*>(.*?)</body>', saida, re.S).group(1)
estilo = estilo.replace('html,body{margin:0;padding:0}', 'body{margin:0}')
estilo = estilo.replace('body[data-tom=', 'html[data-tom=')
corpo  = corpo.replace('<div id="app"></div>', '<div id="app" data-tom="leve"></div>')
corpo  = corpo.replace("tom(t){ document.body.setAttribute('data-tom', t || 'leve'); }",
                       "tom(t){ document.documentElement.setAttribute('data-tom', t || 'leve'); }")
open('artefato.html', 'w', encoding='utf-8').write(titulo + '\n' + estilo + '\n' + corpo.strip() + '\n')
print(f'artefato.html — {os.path.getsize("artefato.html")/1024:.0f} KB (para publicar)')
