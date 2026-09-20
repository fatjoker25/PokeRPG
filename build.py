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
sprites = {}
if os.path.isdir(SPRITES_DIR):
    for raiz, _, arqs in os.walk(SPRITES_DIR):
        for a in sorted(arqs):
            if not a.endswith('.png'):
                continue
            caminho = os.path.join(raiz, a).replace(os.sep, '/')
            dados = base64.b64encode(open(caminho, 'rb').read()).decode('ascii')
            sprites[caminho] = 'data:image/png;base64,' + dados
    scripts.insert(0, '/* ===== sprites embutidos (' + str(len(sprites)) + ') ===== */\n'
                      'const SPRITES_DATA = ' + json.dumps(sprites, separators=(',', ':')) + ';')
    print(f'sprites embutidos: {len(sprites)} arquivos')
else:
    print('sprites_nds/ ausente — o arquivo único sai sem as artes')

saida = re.sub(r'<link rel="stylesheet" href="[^"]+">', '\n'.join(estilos), html)
saida = re.sub(r'<script src="[^"]+"></script>\s*', '', saida)
saida = saida.replace('</body>', '<script>\n' + '\n\n'.join(scripts) + '\n</script>\n</body>')

open('jornada-do-campeao.html', 'w', encoding='utf-8').write(saida)
print(f'jornada-do-campeao.html — {os.path.getsize("jornada-do-campeao.html")/1024:.0f} KB '
      f'({len(css)} css, {len(js)} scripts)')

# variante para publicação como Artifact: sem doctype/html/body (o host envolve)
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
