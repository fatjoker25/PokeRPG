#!/usr/bin/env python3
"""desenhar-itens — os ícones dos itens que só existem aqui, em pixel.

Item com equivalente exato nos jogos usa o ícone dos jogos (ITEM_SPRITE,
em js/data/sprites.js). O resto — as ferramentas da ferragem, a Ração, a
Bandagem, as mochilas, o que a rede te dá e o papel de enredo — ganha
desenho aqui, no jeito dos ícones de mochila de HG/SS que estão do lado
deles: 30×30, contorno cinza-escuro de 1 px, luz de cima à esquerda, três
tons e o brilho branco, e o objeto ocupando uns 24 px, às vezes em três
quartos. Antes eram vetores chapados (js/data/icones.js) e destoavam.

O desenho é feito de formas (elipse, bastão, polígono) e cada forma se
sombreia sozinha pela luz: esfera, cilindro ou plano com chanfro. O
contorno sai no fim, em volta da silhueta; linha de dentro (a costura, o
cabo entrando no aço) é a `borda` da forma.

Uso:  python3 ferramentas/desenhar-itens.py [--folha folha.png]
      --folha monta a folha ampliada, ao lado de ícones dos jogos, pra
      conferir no olho.
Grava em sprites_nds/items/nossos/<arquivo>.png; o mapa nome → arquivo
mora em js/data/icones.js (ITEM_PIXEL e os genéricos do papel).
"""
import math
import os
import sys

from PIL import Image

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SAIDA = os.path.join(RAIZ, 'sprites_nds', 'items', 'nossos')
LADO = 30
CONTORNO = (49, 49, 49, 255)


def _norm(v):
    n = math.sqrt(sum(c * c for c in v))
    return tuple(c / n for c in v)


LUZ = _norm((-0.55, -0.7, 0.55))

# rampas: brilho, claro, base, sombra
M = {
    'madeira':  [(239, 198, 132), (206, 148, 82), (160, 102, 52), (110, 68, 34)],
    'aco':      [(255, 255, 255), (214, 222, 231), (156, 165, 181), (99, 107, 123)],
    'ferro':    [(181, 189, 206), (123, 132, 148), (82, 90, 107), (52, 58, 72)],
    'gaze':     [(255, 255, 255), (247, 243, 232), (222, 211, 189), (176, 160, 136)],
    'lona':     [(240, 218, 166), (214, 182, 118), (178, 138, 82), (128, 96, 56)],
    'lona_esc': [(214, 182, 118), (178, 138, 82), (140, 104, 60), (98, 70, 40)],
    'vermelho': [(255, 160, 150), (240, 86, 74), (200, 44, 44), (134, 26, 30)],
    'azul':     [(180, 214, 255), (102, 160, 240), (58, 108, 206), (34, 66, 140)],
    'verde':    [(178, 240, 150), (102, 198, 92), (58, 150, 60), (34, 100, 42)],
    'oliva':    [(206, 214, 140), (156, 170, 90), (112, 128, 60), (74, 86, 38)],
    'amarelo':  [(255, 250, 186), (255, 224, 80), (232, 182, 26), (166, 124, 16)],
    'preto':    [(132, 136, 152), (86, 88, 104), (56, 58, 72), (34, 34, 44)],
    'branco':   [(255, 255, 255), (240, 242, 248), (208, 210, 224), (158, 160, 178)],
    'prata':    [(255, 255, 255), (226, 234, 242), (176, 190, 208), (118, 134, 158)],
    'dourado':  [(255, 248, 196), (248, 214, 104), (214, 164, 50), (154, 106, 26)],
    'papel':    [(255, 255, 255), (248, 244, 232), (224, 214, 190), (176, 166, 140)],
    'papelao':  [(234, 200, 142), (208, 166, 100), (174, 124, 66), (124, 84, 42)],
    'marrom':   [(216, 168, 118), (176, 118, 68), (134, 84, 42), (92, 52, 26)],
    'laranja':  [(255, 208, 150), (248, 158, 68), (216, 108, 34), (150, 68, 18)],
    'rosa':     [(255, 216, 232), (248, 158, 192), (224, 100, 150), (158, 58, 100)],
    'roxo':     [(224, 192, 255), (174, 124, 232), (134, 84, 200), (90, 50, 140)],
    'cinza':    [(232, 232, 240), (190, 190, 200), (142, 142, 158), (100, 100, 116)],
    'vidro':    [(255, 255, 255), (214, 238, 255), (160, 204, 236), (104, 150, 196)],
    'amarelo_luz': [(255, 255, 230), (255, 250, 180), (255, 236, 120), (230, 200, 70)],
    'pele':     [(255, 230, 206), (248, 206, 168), (222, 166, 126), (170, 116, 82)],
}


def nivel(i):
    """intensidade da luz → posição na rampa"""
    if i >= 0.82:
        return 0
    if i >= 0.38:
        return 1
    if i >= -0.12:
        return 2
    return 3


def escurecer(c, f=0.62):
    return tuple(int(v * f) for v in c[:3]) + (255,)


class Tela:
    def __init__(self):
        self.px = [[None] * LADO for _ in range(LADO)]

    def ponto(self, x, y, cor):
        if 0 <= x < LADO and 0 <= y < LADO:
            self.px[y][x] = cor if len(cor) == 4 else tuple(cor) + (255,)

    def tem(self, x, y):
        return 0 <= x < LADO and 0 <= y < LADO and self.px[y][x] is not None

    # ---------- o miolo: pinta uma forma, sombreada pela luz ----------
    def _forma(self, dentro, mat, luz, borda=False, fixo=None):
        rampa = M[mat] if isinstance(mat, str) else mat
        cel = [(x, y) for y in range(LADO) for x in range(LADO) if dentro(x + 0.5, y + 0.5)]
        conj = set(cel)
        for x, y in cel:
            if fixo is not None:
                k = fixo
            else:
                k = nivel(luz(x, y, conj))
            self.ponto(x, y, rampa[k])
        if borda:
            cor = escurecer(rampa[3], 0.7)
            for x, y in cel:
                if any((x + dx, y + dy) not in conj for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    self.ponto(x, y, cor)
        return conj

    def elipse(self, cx, cy, rx, ry, mat, modo='esfera', borda=False, fixo=None):
        def dentro(x, y):
            return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.0

        def luz(x, y, conj):
            if modo == 'plano':
                return _plano(x, y, conj)
            u, v = (x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry
            z = math.sqrt(max(0.0, 1 - u * u - v * v))
            n = _norm((u, v, z + 0.35))
            return sum(a * b for a, b in zip(n, LUZ)) * 1.15 - 0.15
        return self._forma(dentro, mat, luz, borda, fixo)

    def bastao(self, ax, ay, bx, by, larg, mat, modo='cil', borda=False, redondo=False, fixo=None):
        """barra grossa de A até B: cabo, corpo de lanterna, alça"""
        dx, dy = bx - ax, by - ay
        L = math.hypot(dx, dy) or 1.0
        ux, uy = dx / L, dy / L
        px_, py_ = -uy, ux            # perpendicular
        w = larg / 2.0

        def dentro(x, y):
            rx, ry = x - ax, y - ay
            t = rx * ux + ry * uy
            s = rx * px_ + ry * py_
            if redondo:
                tt = min(max(t, 0), L)
                return math.hypot(rx - tt * ux, ry - tt * uy) <= w
            return -0.01 <= t <= L + 0.01 and abs(s) <= w

        def luz(x, y, conj):
            if modo == 'plano':
                return _plano(x, y, conj)
            rx, ry = x + 0.5 - ax, y + 0.5 - ay
            s = max(-1.0, min(1.0, (rx * px_ + ry * py_) / w))
            n = _norm((s * px_, s * py_, math.sqrt(max(0.0, 1 - s * s)) + 0.25))
            return sum(a * b for a, b in zip(n, LUZ)) * 1.2 - 0.1
        return self._forma(dentro, mat, luz, borda, fixo)

    def poli(self, pts, mat, modo='plano', borda=False, fixo=None, grad=0.0):
        """polígono; 'plano' é chapa com chanfro (luz no canto de cima à
        esquerda, sombra no de baixo à direita); grad inclina o tom de
        cima pra baixo"""
        ys = [p[1] for p in pts]
        y0, y1 = min(ys), max(ys)

        def dentro(x, y):
            return _dentro_poli(x, y, pts)

        def luz(x, y, conj):
            v = (y + 0.5 - y0) / max(1.0, (y1 - y0))
            return _plano(x, y, conj) - grad * (v - 0.5)
        return self._forma(dentro, mat, luz, borda, fixo)

    def ret(self, x0, y0, x1, y1, mat, **kw):
        return self.poli([(x0, y0), (x1 + 1, y0), (x1 + 1, y1 + 1), (x0, y1 + 1)], mat, **kw)

    def furo(self, cx, cy, rx, ry):
        for y in range(LADO):
            for x in range(LADO):
                if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1.0:
                    self.px[y][x] = None

    def linha(self, x0, y0, x1, y1, cor):
        cor = cor if len(cor) == 4 else tuple(cor) + (255,)
        dx, dy = abs(x1 - x0), -abs(y1 - y0)
        sx, sy = (1 if x0 < x1 else -1), (1 if y0 < y1 else -1)
        err = dx + dy
        while True:
            self.ponto(x0, y0, cor)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                x0 += sx
            if e2 <= dx:
                err += dx
                y0 += sy

    def pontos(self, lista, cor):
        for x, y in lista:
            self.ponto(x, y, cor)

    # ---------- o contorno em volta da silhueta, como nos jogos ----------
    def contornar(self):
        novos = []
        for y in range(LADO):
            for x in range(LADO):
                if self.px[y][x] is None and any(self.tem(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    novos.append((x, y))
        for x, y in novos:
            self.px[y][x] = CONTORNO
        return self

    def imagem(self):
        im = Image.new('RGBA', (LADO, LADO), (0, 0, 0, 0))
        for y in range(LADO):
            for x in range(LADO):
                if self.px[y][x] is not None:
                    im.putpixel((x, y), self.px[y][x])
        return im


def _dentro_poli(x, y, pts):
    dentro = False
    j = len(pts) - 1
    for i in range(len(pts)):
        xi, yi = pts[i]
        xj, yj = pts[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-9) + xi:
            dentro = not dentro
        j = i
    return dentro


def _plano(x, y, conj):
    """chapa: borda de cima/esquerda acende, de baixo/direita apaga"""
    x, y = int(x), int(y)
    acima = (x, y - 1) not in conj or (x - 1, y) not in conj
    abaixo = (x, y + 1) not in conj or (x + 1, y) not in conj
    if acima and not abaixo:
        return 0.9
    if abaixo and not acima:
        return -0.5
    return 0.1


B = (255, 255, 255, 255)
ESC = (49, 49, 49, 255)


# ======================================================================
#  OS DESENHOS — um por item (ou por família: papel, mochila, bolsa)
# ======================================================================
def machado():
    t = Tela()
    t.bastao(11, 27, 18, 6, 3.2, 'madeira')
    # a lâmina larga pra esquerda, o fio curvo, o olho de ferro no cabo
    t.poli([(10, 2), (15, 4), (18, 5), (18, 11), (15, 12), (10, 15), (7, 12), (6, 8), (7, 4)], 'aco', grad=0.7)
    t.linha(7, 5, 6, 8, M['aco'][0])
    t.linha(6, 9, 7, 12, M['aco'][1])
    t.linha(9, 3, 12, 4, M['aco'][0])
    t.ret(17, 4, 21, 11, 'ferro', grad=0.4)
    t.ret(18, 6, 19, 9, 'madeira', fixo=2)
    return t


def picareta():
    t = Tela()
    t.bastao(8, 27, 17, 9, 3.2, 'madeira')
    # a cabeça curva, de bico a bico
    pts = [(3, 13), (7, 8), (12, 5), (16, 4), (20, 5), (25, 8), (28, 13), (25, 11), (20, 8.5), (16, 8), (12, 8.5), (7, 11)]
    t.poli(pts, 'aco', grad=0.8)
    t.linha(8, 8, 12, 6, M['aco'][0])
    t.linha(17, 5, 21, 6, M['aco'][0])
    t.ret(14, 6, 18, 9, 'ferro', fixo=2)
    return t


def lanterna():
    t = Tela()
    t.bastao(5, 26, 15, 16, 7, 'vermelho')
    t.bastao(14, 17, 20, 11, 10, 'aco')
    t.bastao(19.4, 11.6, 21.2, 9.8, 10, 'amarelo_luz', fixo=0)
    t.bastao(20.6, 10.4, 21.6, 9.4, 10, 'amarelo_luz', fixo=2)
    t.ret(9, 20, 10, 21, 'preto', fixo=2)        # o botão
    t.linha(7, 22, 12, 17, M['vermelho'][1])
    for a, b in (((24, 6), (26, 4)), ((25, 10), (28, 10)), ((20, 5), (21, 2))):   # a luz saindo
        t.linha(a[0], a[1], b[0], b[1], M['amarelo_luz'][2])
    return t


def pilha():
    t = Tela()
    for x0, y0 in ((7, 6), (15, 8)):
        t.bastao(x0 + 3.5, y0 + 2, x0 + 3.5, y0 + 18, 7, 'verde')
        t.bastao(x0 + 3.5, y0 + 1, x0 + 3.5, y0 + 3, 7, 'aco')
        t.ret(int(x0 + 2.5), y0 - 1, int(x0 + 4.5), y0, 'aco', fixo=1)
        t.bastao(x0 + 3.5, y0 + 15, x0 + 3.5, y0 + 18, 7, 'preto')
    t.ret(6, 15, 23, 18, 'papelao', grad=0.4)    # a cinta da embalagem
    t.linha(8, 16, 13, 16, M['papelao'][0])
    return t


def bandagem():
    t = Tela()
    # o rolo de pé, a ponta solta descendo e o grampo de metal
    t.poli([(17, 13), (21, 13), (24, 21), (22, 27), (18, 27), (20, 21)], 'gaze', grad=0.6)
    t.bastao(12, 9, 12, 21, 13, 'gaze')
    t.elipse(12, 21, 6.5, 2.4, 'gaze', fixo=3)
    t.elipse(12, 9, 6.5, 2.6, 'gaze', modo='plano', fixo=1)
    t.elipse(12, 9, 3.6, 1.4, 'gaze', fixo=3)
    t.elipse(12, 9, 1.6, 0.8, 'gaze', fixo=2)
    for y in (13, 16, 19):                     # a trama da gaze
        t.ponto(8, y, M['gaze'][2])
        t.ponto(10, y + 1, M['gaze'][2])
    t.ret(18, 24, 22, 25, 'aco', fixo=1)       # o grampo
    t.pontos([(18, 25), (20, 25), (22, 25)], M['aco'][3])
    return t


def cantil():
    t = Tela()
    t.bastao(4, 13, 11, 6, 1.6, 'marrom', redondo=True)    # a alça
    t.bastao(19, 6, 26, 13, 1.6, 'marrom', redondo=True)
    t.elipse(15, 17.5, 10, 9.5, 'oliva')
    t.elipse(15, 17.5, 7.5, 7, 'oliva', modo='plano', fixo=1)
    t.elipse(15, 17.5, 6.5, 6, 'oliva')
    for a in range(0, 360, 30):                 # a costura da capa
        t.ponto(int(15 + 8.6 * math.cos(math.radians(a))), int(17.5 + 8.2 * math.sin(math.radians(a))), M['oliva'][0])
    t.ret(13, 5, 17, 8, 'aco', fixo=2)
    t.ret(12, 3, 18, 5, 'preto', grad=0.3)
    return t


def racao():
    t = Tela()
    t.poli([(8, 9), (22, 9), (24, 26), (6, 26)], 'papelao', grad=0.7)
    t.poli([(8, 5), (22, 5), (22, 9), (8, 9)], 'papelao', fixo=3)        # a dobra de cima
    t.linha(9, 6, 21, 6, M['papelao'][1])
    t.elipse(15, 17, 5, 4.6, 'verde', modo='plano')                    # o rótulo
    for x, y in ((13, 16), (16, 15), (15, 18), (17, 18)):
        t.ponto(x, y, M['marrom'][2])
        t.ponto(x - 1, y, M['marrom'][1])
    for x, y in ((5, 27), (25, 27), (27, 26)):                          # grão caído
        t.ponto(x, y, M['marrom'][2])
    return t


def colete():
    t = Tela()
    esq = [(7, 7), (11, 4), (14, 12), (14, 26), (7, 26), (5, 16), (8, 12)]
    dir_ = [(23, 7), (19, 4), (16, 12), (16, 26), (23, 26), (25, 16), (22, 12)]
    t.poli(esq, 'lona', grad=0.5)
    t.poli(dir_, 'lona', grad=0.5)
    t.ret(14, 12, 15, 26, 'lona_esc', fixo=3)
    t.ret(12, 16, 18, 17, 'marrom', fixo=2)                            # a correia
    t.ret(14, 15, 16, 18, 'aco', borda=True)                           # a fivela
    t.ret(8, 19, 11, 22, 'lona_esc', fixo=1)                           # o remendo
    t.pontos([(8, 19), (11, 19), (8, 22), (11, 22)], M['lona_esc'][3])
    return t


def botina():
    t = Tela()
    t.poli([(11, 5), (19, 5), (19, 16), (24, 19), (24, 23), (6, 23), (6, 19), (11, 17)], 'marrom', grad=0.6)
    t.ret(5, 23, 24, 25, 'preto', fixo=2)                              # a sola
    t.linha(6, 24, 23, 24, M['preto'][1])
    t.ret(11, 5, 19, 7, 'marrom', fixo=3)                              # a borda do cano
    for y in (9, 11, 13, 15):
        t.ponto(18, y, M['lona'][0])
        t.ponto(17, y + 1, M['lona'][0])
    return t


def bota_borracha():
    t = Tela()
    t.bastao(15, 4, 15, 20, 10, 'amarelo')
    t.poli([(10, 16), (20, 16), (25, 20), (25, 24), (6, 24), (6, 20)], 'amarelo', grad=0.4)
    t.ret(10, 3, 19, 5, 'amarelo', fixo=3)                            # o friso de cima
    t.ret(5, 24, 25, 26, 'preto', fixo=2)
    t.linha(12, 7, 12, 17, M['amarelo'][0])
    return t


def mascara():
    t = Tela()
    t.linha(5, 15, 3, 7, M['cinza'][2])                               # o elástico
    t.linha(25, 15, 27, 7, M['cinza'][2])
    t.linha(3, 7, 8, 3, M['cinza'][2])
    t.linha(27, 7, 22, 3, M['cinza'][2])
    t.elipse(15, 16, 10, 7.5, 'branco')
    t.linha(8, 15, 22, 15, M['branco'][3])                            # as pregas
    t.linha(9, 18, 21, 18, M['branco'][3])
    t.ret(12, 9, 18, 10, 'aco', fixo=2)                               # o arame do nariz
    return t


def cobertor():
    t = Tela()
    t.poli([(4, 11), (17, 5), (27, 11), (14, 18)], 'prata', grad=0.5)            # em cima
    t.poli([(4, 11), (14, 18), (14, 23), (4, 16)], 'prata', fixo=2)              # o lado da frente
    t.poli([(14, 18), (27, 11), (27, 16), (14, 23)], 'prata', fixo=3)
    for i in range(3):                                                          # as dobras
        t.linha(5, 13 + i * 1, 13, 19 + i * 1, M['prata'][1 if i % 2 else 3])
        t.linha(15, 19 + i, 26, 13 + i, M['dourado'][2 if i % 2 else 3])
    for x, y in ((9, 10), (13, 9), (18, 9), (21, 12), (12, 13), (16, 14)):       # o amassado que brilha
        t.ponto(x, y, B)
    return t


def camera():
    t = Tela()
    t.ret(4, 9, 25, 22, 'amarelo', grad=0.4)
    t.ret(4, 18, 25, 22, 'verde', fixo=2)                             # a faixa da embalagem
    t.linha(5, 19, 24, 19, M['verde'][1])
    t.ret(20, 6, 23, 8, 'preto', grad=0.2)                            # o botão
    t.ret(6, 11, 10, 14, 'preto', fixo=3)                             # o visor
    t.ret(20, 11, 24, 13, 'branco', borda=True)                       # o flash
    t.elipse(15.5, 15.5, 5, 5, 'preto')
    t.elipse(15.5, 15.5, 3, 3, 'azul')
    t.ponto(14, 14, B)
    return t


def caderno():
    t = Tela()
    t.ret(21, 5, 24, 26, 'papel', fixo=1)                             # as folhas
    for y in range(7, 26, 2):
        t.ponto(23, y, M['papel'][3])
    t.ret(6, 4, 21, 26, 'verde', grad=0.5)
    t.ret(6, 4, 7, 26, 'verde', fixo=3)                               # a lombada
    t.ret(10, 8, 17, 11, 'papel', borda=True)                         # a etiqueta
    t.ret(17, 4, 18, 26, 'preto', fixo=2)                             # o elástico
    return t


def isca():
    t = Tela()
    t.bastao(15, 15, 15, 24, 15, 'aco')
    t.elipse(15, 14, 7.5, 3.6, 'ferro', modo='plano', fixo=3)
    for cx, cy, r in ((12, 12, 2.6), (16.5, 11.5, 2.8), (14.5, 14.2, 2.4), (18.5, 14, 2.2)):
        t.elipse(cx, cy, r, r * 0.9, 'pele')                         # as bolinhas de massa
    t.linha(9, 18, 9, 23, M['aco'][0])
    t.ret(10, 18, 20, 21, 'vermelho', fixo=2)                        # o rótulo
    t.linha(11, 19, 18, 19, M['vermelho'][1])
    return t


def relogio():
    t = Tela()
    t.ret(12, 1, 18, 28, 'marrom', grad=0.4)                           # a pulseira
    for y in (4, 7, 22, 25):
        t.linha(13, y, 17, y, M['marrom'][3])
    t.elipse(15, 15, 8, 8, 'aco')
    t.elipse(15, 15, 6, 6, 'branco', modo='plano')
    for a in range(0, 360, 90):
        t.ponto(int(15 + 4.6 * math.cos(math.radians(a))), int(15 + 4.6 * math.sin(math.radians(a))), M['preto'][2])
    t.linha(15, 15, 15, 11, M['preto'][3])                            # os ponteiros
    t.linha(15, 15, 18, 15, M['preto'][3])
    t.ret(17, 17, 18, 18, 'branco', fixo=2)                           # a janelinha do dia
    t.ponto(21, 13, M['aco'][3])                                      # a coroa
    t.ponto(22, 14, M['aco'][2])
    return t


def uniforme():
    t = Tela()
    # a camisa preta dobrada, sem letra nenhuma: gola, carcela e as mangas
    t.ret(5, 8, 24, 24, 'preto', grad=0.5)
    t.poli([(10, 5), (15, 9), (20, 5), (21, 8), (15, 12), (9, 8)], 'preto', fixo=1)   # a gola
    t.linha(10, 6, 14, 9, M['preto'][0])
    t.linha(15, 12, 15, 24, M['preto'][3])                                          # a carcela
    for y in (14, 17, 20, 23):
        t.ponto(16, y, M['cinza'][1])
    t.linha(5, 12, 10, 21, M['preto'][3])                                           # as mangas dobradas
    t.linha(24, 12, 19, 21, M['preto'][3])
    t.linha(6, 12, 10, 19, M['preto'][1])
    return t


def caderno_lote():
    t = Tela()
    t.ret(8, 4, 23, 26, 'cinza', grad=0.5)
    for y in range(6, 26, 4):                                        # a espiral
        t.ret(5, y, 9, y + 1, 'aco', fixo=1)
        t.ponto(5, y + 1, M['aco'][3])
    t.ret(12, 9, 21, 14, 'papel', borda=True)                        # a etiqueta do lote
    t.linha(14, 11, 19, 11, M['preto'][2])
    t.linha(14, 13, 17, 13, M['preto'][2])
    return t


def chave(mat='dourado', velha=False):
    t = Tela()
    t.bastao(12, 12, 25, 25, 3.4, mat)
    t.bastao(19, 19, 16, 22, 3, mat, fixo=2)          # os dentes, pra baixo
    t.bastao(23, 23, 20, 26, 3, mat, fixo=2)
    t.elipse(9, 9, 6.5, 6.5, mat)
    t.furo(9, 9, 2.4, 2.4)                             # a argola, vazada
    t.linha(5, 7, 7, 5, M[mat][0])
    if velha:
        for x, y in ((5, 11), (12, 6), (16, 17), (21, 20), (24, 26)):
            t.ponto(x, y, M['marrom'][2])               # ferrugem
    return t


def broche():
    t = Tela()
    t.elipse(15, 15, 11, 11, 'preto')
    t.elipse(15, 15, 8.4, 8.4, 'dourado', modo='plano', fixo=3)
    t.elipse(15, 15, 7.4, 7.4, 'preto')
    vm = M['vermelho']
    letra = ['XXXXX.', 'X....X', 'X....X', 'XXXXX.', 'X..X..', 'X...X.', 'X....X']   # a letra antiga
    for j, row in enumerate(letra):
        for i, c in enumerate(row):
            if c == 'X':
                t.ponto(12 + i, 12 + j, vm[1] if (i + j) % 5 else vm[0])
    t.ponto(8, 9, B)
    return t


def medalha():
    """medalha de prova: a fita em V, a argola e o disco com a onda
    (as duas do jogo são de natação)"""
    t = Tela()
    t.poli([(6, 2), (12, 2), (17.5, 13), (13, 14)], 'azul', fixo=1)              # a tira de cá
    t.poli([(18, 2), (24, 2), (17, 14), (12.5, 13)], 'azul', fixo=2)             # a de lá, por cima
    t.linha(9, 2, 14, 12, M['branco'][1])                                         # a listra de cada uma
    t.linha(21, 2, 16, 12, M['branco'][2])
    t.elipse(15, 13.2, 1.9, 1.5, 'dourado', fixo=2)                               # a argola
    t.elipse(15, 20.5, 7.6, 7.6, 'dourado')
    t.elipse(15, 20.5, 5.4, 5.4, 'dourado', modo='plano', fixo=1)                 # o relevo do meio
    esc, luz = M['dourado'][3], M['dourado'][0]
    sobe = [0, 1, 2, 2, 1, 0, 0, 1, 2]                                            # duas ondas, gravadas
    for base in (17, 21):
        onda = [(11 + i, base + s) for i, s in enumerate(sobe)]
        t.pontos(onda, esc)
        t.pontos([(x, y + 1) for x, y in onda], luz)
    t.ponto(9, 16, B)
    return t


def papel():
    t = Tela()
    t.poli([(7, 3), (19, 3), (23, 7), (23, 27), (7, 27)], 'papel', grad=0.3)
    t.poli([(19, 3), (23, 7), (19, 7)], 'papel', fixo=3)                          # a orelha
    for y in (11, 14, 17, 20):
        t.linha(10, y, 20 if y < 20 else 16, y, M['cinza'][2])
    return t


def foto():
    t = Tela()
    t.poli([(5, 6), (25, 4), (26, 25), (6, 27)], 'branco', grad=0.3)
    t.poli([(7, 8), (24, 6), (24.6, 19), (7.8, 21)], 'vidro', fixo=2)            # o céu
    t.poli([(7.6, 16), (13, 12), (18, 15), (24.5, 11), (24.6, 19), (7.8, 21)], 'verde', fixo=2)
    t.elipse(20, 9.5, 1.8, 1.8, 'amarelo', fixo=1)
    return t


def mapa():
    t = Tela()
    t.poli([(4, 7), (11, 4), (11, 24), (4, 27)], 'papel', fixo=1)
    t.poli([(11, 4), (19, 7), (19, 27), (11, 24)], 'papel', fixo=2)
    t.poli([(19, 7), (26, 4), (26, 24), (19, 27)], 'papel', fixo=1)
    for x, y in ((6, 20), (8, 18), (10, 15), (12, 13), (14, 14), (16, 12), (18, 10), (21, 11), (23, 9)):
        t.ponto(x, y, M['vermelho'][2])                                         # a rota
    t.elipse(23.5, 8.5, 1.4, 1.4, 'vermelho', fixo=1)
    t.linha(5, 9, 9, 8, M['verde'][2])
    t.linha(20, 19, 24, 17, M['azul'][2])
    return t


def caixa():
    t = Tela()
    t.poli([(3, 10), (15, 5), (27, 10), (15, 15)], 'papelao', fixo=1)
    t.poli([(3, 10), (15, 15), (15, 27), (3, 22)], 'papelao', fixo=2)
    t.poli([(15, 15), (27, 10), (27, 22), (15, 27)], 'papelao', fixo=3)
    t.poli([(8, 8), (11, 7), (23, 12), (20, 13)], 'lona', fixo=0)                  # a fita
    return t


def pacote():
    t = Tela()
    t.poli([(4, 11), (15, 6), (26, 11), (15, 16)], 'papelao', fixo=1)
    t.poli([(4, 11), (15, 16), (15, 26), (4, 21)], 'papelao', fixo=2)
    t.poli([(15, 16), (26, 11), (26, 21), (15, 26)], 'papelao', fixo=3)
    cor = M['vermelho']
    t.linha(9, 9, 20, 14, cor[1])                                                  # o barbante
    t.linha(10, 14, 21, 9, cor[1])
    t.linha(9, 13, 9, 23, cor[2])
    t.linha(21, 13, 21, 23, cor[3])
    t.elipse(15, 11.5, 2, 1.4, 'vermelho', fixo=1)
    return t


def mochila(mat):
    t = Tela()
    t.bastao(10, 6, 20, 6, 3, mat, redondo=True)          # a alça de mão
    t.elipse(15, 6.5, 2.6, 1.2, mat, fixo=3)
    t.poli([(7, 8), (23, 8), (24, 26), (6, 26)], mat, grad=0.6)
    t.poli([(7, 8), (23, 8), (23, 14), (15, 15), (7, 14)], mat, fixo=1)          # a aba
    t.linha(7, 14, 15, 15, M[mat][3])
    t.linha(15, 15, 23, 14, M[mat][3])
    t.ret(14, 13, 16, 16, 'aco', fixo=2)                                          # a fivela
    t.ret(9, 18, 21, 24, mat, fixo=2, borda=True)                                 # o bolso
    t.linha(10, 19, 20, 19, M['aco'][1])                                          # o zíper
    return t


def bolsa(mat):
    t = Tela()
    t.linha(6, 13, 10, 4, M[mat][3])                       # a alça do ombro
    t.linha(7, 13, 11, 4, M[mat][2])
    t.linha(11, 4, 19, 4, M[mat][2])
    t.linha(19, 4, 23, 13, M[mat][2])
    t.linha(20, 4, 24, 13, M[mat][3])
    t.ret(5, 13, 25, 26, mat, grad=0.6)
    t.poli([(5, 13), (26, 13), (26, 19), (15, 21), (5, 19)], mat, fixo=1)        # a tampa
    t.linha(5, 19, 15, 21, M[mat][3])
    t.linha(15, 21, 25, 19, M[mat][3])
    t.ret(14, 18, 16, 21, 'aco', fixo=2)
    return t


# o nome do arquivo e quem desenha; o mapa nome → arquivo mora no JS
DESENHOS = {
    'machado': machado, 'picareta': picareta, 'lanterna': lanterna, 'pilha': pilha,
    'bandagem': bandagem, 'cantil': cantil, 'racao': racao, 'colete': colete, 'botina': botina,
    'bota_borracha': bota_borracha, 'mascara': mascara, 'cobertor': cobertor, 'camera': camera,
    'caderno': caderno, 'isca': isca, 'relogio': relogio, 'uniforme_rede': uniforme,
    'caderno_lote': caderno_lote, 'chave_subsolo': lambda: chave('ferro', velha=True),
    'broche': broche, 'papel': papel, 'foto': foto, 'mapa': mapa, 'caixa': caixa,
    'chave': chave, 'pacote': pacote, 'medalha': medalha,
}
CORES_DE_MOCHILA = {'bege': 'lona', 'preta': 'preto', 'vermelha': 'vermelho', 'azul': 'azul', 'verde': 'verde',
                    'amarela': 'amarelo', 'marrom': 'marrom', 'laranja': 'laranja', 'roxa': 'roxo',
                    'branca': 'branco', 'cinza': 'cinza', 'rosa': 'rosa', 'prateada': 'prata',
                    'dourada': 'dourado'}
for nome, mat in CORES_DE_MOCHILA.items():
    DESENHOS['mochila_' + nome] = (lambda m: lambda: mochila(m))(mat)
    DESENHOS['bolsa_' + nome] = (lambda m: lambda: bolsa(m))(mat)


def main():
    os.makedirs(SAIDA, exist_ok=True)
    feitos = {}
    for arq, fn in DESENHOS.items():
        im = fn().contornar().imagem()
        im.save(os.path.join(SAIDA, arq + '.png'))
        feitos[arq] = im
    print(f'{len(feitos)} ícones em {os.path.relpath(SAIDA, RAIZ)}/')
    if '--folha' in sys.argv:
        destino = sys.argv[sys.argv.index('--folha') + 1]
        jogo = ['potion', 'escape_rope', 'town_map', 'repel', 'fresh_water', 'amulet_coin']
        lista = [Image.open(os.path.join(RAIZ, 'sprites_nds', 'items', j + '.png')).convert('RGBA') for j in jogo]
        lista += list(feitos.values())
        Z, cols = 6, 12
        linhas = (len(lista) + cols - 1) // cols
        folha = Image.new('RGBA', (cols * LADO * Z, linhas * LADO * Z), (40, 48, 80, 255))
        for i, im in enumerate(lista):
            folha.alpha_composite(im.resize((LADO * Z, LADO * Z), Image.NEAREST), ((i % cols) * LADO * Z, (i // cols) * LADO * Z))
        folha.save(destino)
        print('folha:', destino)


if __name__ == '__main__':
    main()
