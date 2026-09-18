#!/usr/bin/env python3
"""Gera jornada-do-campeao.html: um arquivo único com tudo embutido."""
import re, os

html = open('index.html', encoding='utf-8').read()
css = re.findall(r'<link rel="stylesheet" href="([^"]+)"', html)
js  = re.findall(r'<script src="([^"]+)"></script>', html)

estilos  = ['<style>\n' + open(c, encoding='utf-8').read() + '\n</style>' for c in css]
scripts  = ['/* ===== ' + j + ' ===== */\n' + open(j, encoding='utf-8').read() for j in js]

saida = re.sub(r'<link rel="stylesheet" href="[^"]+">', '\n'.join(estilos), html)
saida = re.sub(r'<script src="[^"]+"></script>\s*', '', saida)
saida = saida.replace('</body>', '<script>\n' + '\n\n'.join(scripts) + '\n</script>\n</body>')

open('jornada-do-campeao.html', 'w', encoding='utf-8').write(saida)
print(f'jornada-do-campeao.html — {os.path.getsize("jornada-do-campeao.html")/1024:.0f} KB '
      f'({len(css)} css, {len(js)} scripts)')
