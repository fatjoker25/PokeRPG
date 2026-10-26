#!/usr/bin/env python3
"""desenhar-capuz.py — desenha o rosto da figura de capuz (o Sr. Juniper).

Nenhum treinador do acervo do Showdown é uma figura encapuzada (o sábio,
a médium e o cavalheiro mostram o rosto), então este é desenhado aqui,
pixel a pixel, no quadro de 80×80 dos outros: o capuz puxado até o
nariz e a sombra no lugar do rosto, as mãos velhas segurando o caderno
de capa dura, e a barra da capa sumindo em névoa, como aparição.

    python3 ferramentas/desenhar-capuz.py [saída.png] [--grande]

Sem argumento, grava em sprites_nds/npcs/trainers/capuz.png.
"""
import math
import os
import sys

from PIL import Image

L = A = 80
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# a paleta: capa fria e dessaturada, de quem anda na neblina de Lavender
CONTORNO = (22, 18, 34)
CAPA = [(36, 32, 54), (50, 45, 74), (66, 60, 94), (88, 81, 118), (112, 104, 142)]
FUNDO_CAPUZ = [(8, 7, 13), (14, 12, 21), (21, 18, 31)]
PELE = [(126, 104, 92), (170, 146, 124), (214, 194, 170)]
CAPA_LIVRO = [(64, 26, 30), (92, 38, 42), (124, 54, 56)]
FOLHA = (232, 224, 204)
CORDAO = (150, 138, 104)
NEVOA = (206, 216, 232)

BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]


def dentro_poligono(x, y, pts):
    """par-ímpar, com o centro do pixel"""
    px, py = x + .5, y + .5
    dentro = False
    j = len(pts) - 1
    for i in range(len(pts)):
        xi, yi = pts[i]
        xj, yj = pts[j]
        if (yi > py) != (yj > py) and px < (xj - xi) * (py - yi) / (yj - yi) + xi:
            dentro = not dentro
        j = i
    return dentro


def dentro_elipse(x, y, cx, cy, rx, ry):
    return ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1


def desenhar():
    img = [[None] * L for _ in range(A)]
    parte = [[None] * L for _ in range(A)]

    def pinta(nome, teste):
        for y in range(A):
            for x in range(L):
                if teste(x, y):
                    parte[y][x] = nome

    meio = 40
    # o corpo da capa: estreito nos ombros, abrindo até a barra
    corpo = [(29, 30), (51, 30), (55, 44), (59, 60), (62, 76), (18, 76), (21, 60), (25, 44)]
    pinta('capa', lambda x, y: dentro_poligono(x, y, corpo))
    # as mangas largas, caindo dos ombros até as mãos
    manga_e = [(29, 30), (24, 38), (25, 48), (31, 52), (36, 47), (33, 36)]
    manga_d = [(51, 30), (56, 38), (55, 48), (49, 52), (44, 47), (47, 36)]
    pinta('manga_e', lambda x, y: dentro_poligono(x, y, manga_e))
    pinta('manga_d', lambda x, y: dentro_poligono(x, y, manga_d))
    # o capuz: a cabeça redonda com a ponta caída pra trás e a capinha nos ombros
    pinta('capuz', lambda x, y: dentro_elipse(x, y, meio, 20, 11.5, 12.5)
          or dentro_poligono(x, y, [(meio - 3, 9), (meio + 4, 4), (meio + 9, 10), (meio + 6, 14)])
          or dentro_poligono(x, y, [(27, 26), (53, 26), (56, 33), (47, 36), (meio, 37), (33, 36), (24, 33)]))
    # a boca do capuz: a sombra onde devia estar o rosto
    pinta('sombra', lambda x, y: dentro_elipse(x, y, meio, 22, 6.6, 8.2) and y >= 15)
    # o caderno de capa dura, segurado na frente do peito, e as mãos dos lados
    pinta('livro', lambda x, y: 34 <= x <= 45 and 41 <= y <= 50)
    pinta('maos', lambda x, y: (dentro_elipse(x, y, 33.6, 46, 2.1, 3.1) or dentro_elipse(x, y, 46.4, 46, 2.1, 3.1)))

    for y in range(A):
        for x in range(L):
            p = parte[y][x]
            if not p:
                continue
            if p in ('capa', 'manga_e', 'manga_d', 'capuz'):
                # luz de cima e da esquerda; dobras verticais na capa
                d = (x - meio) / 22
                t = 2 - d * 2.2 - (y - 30) / 60
                if p == 'capa' and y > 50:
                    for dobra in (31, 39, 47, 54):
                        onda = dobra + math.sin(y / 5.0 + dobra) * 1.2 + (dobra - meio) * (y - 50) / 60
                        if abs(x - onda) < .7:
                            t -= 1.4
                        elif abs(x - onda - 1) < .7:
                            t += .5
                if p == 'manga_e':
                    t += .6
                if p == 'manga_d':
                    t -= .6
                if p == 'capuz':
                    t += .5 - (y - 8) / 30
                i = max(0, min(len(CAPA) - 1, round(t)))
                img[y][x] = CAPA[i]
            elif p == 'sombra':
                prof = (y - 14) / 16
                i = 0 if prof < .55 else (1 if prof < .85 else 2)
                img[y][x] = FUNDO_CAPUZ[i]
            elif p == 'livro':
                if x == 45 or y == 50:
                    img[y][x] = FOLHA if (x == 45 and y < 50) else CAPA_LIVRO[0]
                elif x == 34 or y == 41:
                    img[y][x] = CAPA_LIVRO[2]
                else:
                    img[y][x] = CAPA_LIVRO[1]
            elif p == 'maos':
                cx = 33.5 if x < meio else 46.5
                t = 1.4 - (x - cx) / 3 - (y - 46) / 4
                img[y][x] = PELE[max(0, min(2, round(t)))]

    # a beira do capuz pega luz: um fio claro em volta da sombra, mais do lado esquerdo
    for y in range(A):
        for x in range(L):
            if parte[y][x] == 'capuz' and img[y][x]:
                viz = [(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))]
                if any(0 <= a < L and 0 <= b < A and parte[b][a] == 'sombra' for a, b in viz):
                    img[y][x] = CAPA[4] if x <= meio + 1 else CAPA[2]
    # os dedos: mão velha, magra, cada dedo uma linha por cima da capa
    for x in (33, 46):
        for y in (45, 47):
            if parte[y][x] == 'maos':
                img[y][x] = PELE[0]
    # o cordão do caderno, caindo da lombada
    for y, x in ((51, 41), (52, 41), (53, 42), (54, 42)):
        img[y][x] = CORDAO
    # o vinco do caderno: a linha da capa
    for y in range(43, 49):
        img[y][39] = CAPA_LIVRO[0]

    # contorno: escuro onde encosta no vazio
    saida = [[None] * L for _ in range(A)]
    for y in range(A):
        for x in range(L):
            if img[y][x]:
                saida[y][x] = img[y][x] + (255,)
                continue
            if any(0 <= x + dx < L and 0 <= y + dy < A and img[y + dy][x + dx]
                   for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                saida[y][x] = CONTORNO + (255,)
    # o contorno entre partes: a manga sobre o corpo e as mãos sobre a manga
    for y in range(1, A - 1):
        for x in range(1, L - 1):
            p = parte[y][x]
            if p in ('manga_e', 'manga_d', 'maos', 'livro'):
                for dx, dy in ((1, 0), (-1, 0), (0, 1)):
                    q = parte[y + dy][x + dx]
                    if q == 'capa' and saida[y + dy][x + dx]:
                        c = saida[y + dy][x + dx]
                        saida[y + dy][x + dx] = tuple(max(0, v - 26) for v in c[:3]) + (255,)

    # a barra some em névoa: o pano rareia (pontilhado) e a névoa sobe por cima
    for y in range(A):
        for x in range(L):
            c = saida[y][x]
            if not c or y < 62:
                continue
            fica = (76 - y) / 14
            if BAYER[y % 4][x % 4] / 16 >= fica:
                saida[y][x] = None
            elif y > 68:
                a = max(60, int(255 * (fica + .25)))
                saida[y][x] = c[:3] + (min(255, a),)
    for y in range(60, 78):
        for x in range(12, 68):
            if saida[y][x]:
                continue
            onda = math.sin(x / 3.1) * 1.6 + math.sin(x / 7.3 + 1) * 1.3
            alvo = 69 + onda
            dist = abs(y - alvo)
            if dist < 2.6 and 15 <= x <= 65 and BAYER[y % 4][x % 4] < 10:
                a = int(130 * (1 - dist / 2.6) * (1 - abs(x - 40) / 28))
                if a > 18:
                    saida[y][x] = NEVOA + (a,)

    out = Image.new('RGBA', (L, A), (0, 0, 0, 0))
    for y in range(A):
        for x in range(L):
            if saida[y][x]:
                out.putpixel((x, y), saida[y][x])
    return out


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    destino = args[0] if args else os.path.join(RAIZ, 'sprites_nds', 'npcs', 'trainers', 'capuz.png')
    img = desenhar()
    img.save(destino)
    if '--grande' in sys.argv:
        g = Image.new('RGBA', (L * 6, A * 6), (36, 44, 66, 255))
        g.alpha_composite(img.resize((L * 6, A * 6), Image.NEAREST))
        g.save(os.path.splitext(destino)[0] + '-grande.png')
    print('desenhado:', destino)
