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


def caderno(capa='verde'):
    t = Tela()
    t.ret(21, 5, 24, 26, 'papel', fixo=1)                             # as folhas
    for y in range(7, 26, 2):
        t.ponto(23, y, M['papel'][3])
    t.ret(6, 4, 21, 26, capa, grad=0.5)
    t.ret(6, 4, 7, 26, capa, fixo=3)                                  # a lombada
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


# ----------------------------------------------------------------------
#  o que as cenas te dão e não é papel: crachá, aparelho, objeto, comida
# ----------------------------------------------------------------------
def cracha(faixa='azul'):
    t = Tela()
    t.ret(7, 7, 22, 27, 'branco', grad=0.3)                                       # o cartão
    t.ret(7, 7, 22, 11, faixa, fixo=1)                                            # a faixa de cima
    t.ret(12, 2, 17, 7, 'aco', fixo=1)                                            # o prendedor
    t.ret(13, 3, 16, 4, 'aco', fixo=3)
    t.ret(9, 13, 14, 20, 'cinza', fixo=0)                                         # a foto
    t.elipse(11.5, 15.4, 1.6, 1.7, 'pele', fixo=1)
    t.poli([(9.2, 20.5), (10, 17.8), (13, 17.8), (13.8, 20.5)], 'azul', fixo=2)
    for y in (14, 16, 18):
        t.linha(16, y, 20, y, M['cinza'][2])
    t.linha(9, 23, 20, 23, M['cinza'][2])
    t.linha(9, 25, 16, 25, M['cinza'][1])
    return t


def prancheta():
    t = Tela()
    t.ret(6, 5, 23, 28, 'marrom', grad=0.4)                                       # a tábua
    t.ret(8, 8, 21, 26, 'papel', grad=0.2)                                        # a folha
    for y in (12, 15, 18, 21):
        t.linha(10, y, 19 if y < 21 else 15, y, M['cinza'][2])
    t.ret(11, 3, 18, 8, 'aco', fixo=1)                                            # o prendedor
    t.ret(13, 4, 16, 5, 'aco', fixo=3)
    return t


def pasta():
    t = Tela()
    t.poli([(5, 3), (12, 3), (14, 5), (25, 5), (25, 27), (5, 27)], 'papelao', fixo=2)    # o fundo, com a aba
    t.ret(7, 6, 23, 12, 'papel', fixo=1)                                          # as folhas
    t.linha(9, 8, 20, 8, M['cinza'][2])
    t.poli([(4, 10), (26, 13), (26, 28), (4, 28)], 'lona', grad=0.5)              # a frente
    t.ret(9, 17, 19, 20, 'branco', fixo=0)                                        # a etiqueta
    t.linha(10, 18, 17, 18, M['cinza'][2])
    return t


def jornal():
    t = Tela()
    t.poli([(4, 7), (24, 4), (26, 23), (6, 26)], 'papel', grad=0.3)
    t.poli([(6.5, 8), (23, 5.6), (23.4, 9), (7, 11.4)], 'preto', fixo=2)          # a manchete
    t.poli([(7.4, 13), (13.6, 12.1), (14.4, 18.6), (8.1, 19.6)], 'cinza', fixo=1) # a foto
    for i, y in enumerate((13, 15, 17, 19)):
        t.linha(16, y - 1, 23, y - 2, M['cinza'][2])
    t.linha(9, 22, 23, 20, M['cinza'][2])
    t.linha(15, 5, 16, 24, M['papel'][3])                                         # a dobra
    return t


def envelope():
    t = Tela()
    t.ret(3, 8, 26, 23, 'papel', grad=0.3)
    c = M['papel'][3]
    t.linha(3, 8, 14, 17, c)
    t.linha(26, 8, 15, 17, c)
    t.linha(3, 23, 11, 16, c)
    t.linha(26, 23, 18, 16, c)
    t.elipse(14.6, 17, 2.4, 2.2, 'vermelho')                                      # o lacre
    t.ret(20, 10, 23, 13, 'azul', fixo=1)                                         # o selo
    return t


def anilha():
    t = Tela()
    t.elipse(11, 11, 7, 7, 'aco')
    t.furo(11, 11, 4.2, 4.2)                                                      # o anel
    t.bastao(15, 15, 18, 18, 2.2, 'aco', fixo=2)
    t.poli([(16, 16), (26, 16), (26, 26), (16, 26)], 'amarelo', grad=0.4)         # a plaqueta
    t.furo(18.6, 18.6, 1.1, 1.1)
    for y in (21, 23):
        t.linha(19, y, 24, y, M['amarelo'][3])
    return t


def apito():
    t = Tela()
    t.elipse(9, 9, 4.2, 4.2, 'vermelho')                                          # a argola do cordão
    t.furo(9, 9, 2.2, 2.2)
    t.bastao(12, 12, 15, 15, 2, 'vermelho', fixo=2)
    t.elipse(18, 19, 7.5, 6.5, 'aco')                                             # o corpo
    t.ret(4, 17, 12, 21, 'aco', fixo=1)                                           # o bocal
    t.ret(4, 18, 8, 20, 'aco', fixo=2)
    t.ret(15, 13, 18, 15, 'preto', fixo=3)                                        # a fenda
    t.ponto(16, 16, B)
    return t


def binoculo():
    t = Tela()
    for x in (9, 21):
        t.bastao(x, 6, x, 22, 8, 'preto', redondo=True)                          # os canos
        t.elipse(x, 23, 3.4, 2, 'vidro', fixo=1)                                  # a lente
        t.elipse(x, 6, 3, 1.4, 'cinza', fixo=2)
    t.ret(12, 11, 18, 16, 'preto', fixo=2)                                        # a ponte
    t.elipse(15, 13.5, 1.8, 1.8, 'cinza')
    return t


def placa(mat='aco'):
    t = Tela()
    t.ret(3, 8, 26, 21, mat, grad=0.4, borda=True)
    esc = M[mat][3]
    for x, y in ((5, 10), (24, 10), (5, 19), (24, 19)):
        t.ponto(x, y, esc)                                                        # os parafusos
    for y in (13, 16):
        t.linha(8, y, 21, y, esc)
    return t


def fita():
    t = Tela()
    t.ret(3, 8, 26, 22, 'preto', grad=0.3)                                        # a fita cassete
    t.ret(6, 10, 23, 14, 'branco', fixo=0)                                        # a etiqueta
    t.linha(8, 12, 19, 12, M['cinza'][2])
    for x in (10, 19):
        t.elipse(x, 17.5, 2.6, 2.6, 'branco', fixo=1)
        t.elipse(x, 17.5, 1.2, 1.2, 'preto', fixo=2)
    t.ret(12, 20, 17, 22, 'cinza', fixo=2)
    return t


def rolo():
    t = Tela()
    t.elipse(15, 15, 10.5, 10.5, 'preto')                                        # a fita isolante
    t.elipse(15, 15, 5, 5, 'papelao', modo='plano', fixo=1)                       # o tubo
    t.furo(15, 15, 3.2, 3.2)
    t.poli([(24, 18), (28, 19), (27, 23), (23, 22)], 'preto', fixo=1)             # a ponta solta
    return t


def garrafa():
    t = Tela()
    t.ret(12, 2, 17, 5, 'azul', fixo=1)                                           # a tampa
    t.poli([(12, 6), (17, 6), (20, 11), (20, 27), (9, 27), (9, 11)], 'vidro', grad=0.3)
    t.poli([(9.6, 15), (19.4, 15), (19.4, 26.5), (9.6, 26.5)], 'azul', fixo=1)   # a água
    t.ret(9, 18, 19, 21, 'branco', fixo=0)                                        # o rótulo
    t.linha(10, 8, 10, 13, B)
    return t


def pote():
    t = Tela()
    t.ret(8, 5, 21, 8, 'aco', grad=0.3)                                           # a tampa
    t.ret(7, 9, 22, 27, 'vidro', grad=0.3)
    t.ret(8, 15, 21, 26, 'oliva', fixo=1)                                         # a água verde do rio
    t.pontos([(11, 19), (15, 21), (18, 18), (13, 24)], M['oliva'][3])
    t.linha(9, 11, 9, 14, B)
    return t


def lata():
    t = Tela()
    t.ret(6, 9, 23, 27, 'vermelho', grad=0.5)                                     # o galão
    t.poli([(8, 5), (17, 5), (17, 9), (8, 9)], 'vermelho', fixo=2)               # a alça
    t.furo(12.5, 7, 2.6, 1.1)
    t.bastao(20, 9, 24, 4, 2.6, 'aco')                                            # o bico
    t.ret(9, 14, 20, 21, 'amarelo', fixo=1)                                       # o rótulo
    t.linha(11, 17, 18, 17, M['amarelo'][3])
    return t


def luva():
    t = Tela()
    for x, topo in ((11, 6), (14, 4), (17, 4), (20, 6)):
        t.bastao(x, 15, x, topo, 3.2, 'amarelo', redondo=True)                  # os dedos
    t.bastao(9, 18, 5, 12, 3.4, 'amarelo', redondo=True)                         # o polegar
    t.poli([(9, 13), (22, 13), (22, 24), (10, 24), (8, 19)], 'amarelo', grad=0.4)
    t.ret(9, 23, 23, 28, 'laranja', grad=0.3)                                     # o punho
    return t


def medidor():
    t = Tela()
    t.ret(6, 3, 23, 27, 'amarelo', grad=0.4, borda=True)                          # o corpo
    t.ret(8, 5, 21, 13, 'vidro', fixo=0)                                          # o visor
    t.linha(9, 12, 20, 12, M['cinza'][2])
    t.linha(11, 12, 19, 6, M['vermelho'][2])                                      # a agulha no fim da escala
    t.elipse(14.5, 19, 3.6, 3.6, 'preto')                                         # o seletor
    t.linha(14, 19, 14, 16, M['cinza'][0])
    for x in (9, 20):
        t.elipse(x, 25, 1.2, 1.2, 'preto', fixo=2)                                # as entradas
    return t


def muda():
    t = Tela()
    t.ret(8, 17, 21, 19, 'laranja', fixo=1)                                       # a borda do vaso
    t.poli([(9, 19), (21, 19), (19, 28), (11, 28)], 'laranja', grad=0.5)
    t.linha(15, 17, 15, 8, M['verde'][3])                                         # o caule
    t.elipse(11, 13, 3.6, 1.9, 'verde')
    t.elipse(19, 11, 3.6, 1.9, 'verde')
    t.elipse(15, 6, 2.8, 2.8, 'branco')                                           # a flor branca
    t.ponto(15, 6, M['amarelo'][1])
    return t


def rede():
    t = Tela()
    dentro = t.poli([(4, 9), (12, 5), (22, 7), (27, 14), (24, 25), (13, 27), (5, 21)], 'lona', grad=0.4)  # a rede embolada
    esc = M['lona'][3]
    for x, y in dentro:                                                           # a malha, em losango
        if (x + y) % 5 == 0 or (x - y) % 5 == 0:
            t.ponto(x, y, esc)
    t.elipse(22, 21, 3, 3, 'vermelho')                                            # a boia
    t.ponto(21, 20, B)
    t.bastao(4, 9, 1, 5, 1.4, 'lona', fixo=2)                                     # a ponta cortada
    return t


def pena(mat='amarelo'):
    t = Tela()
    t.poli([(6, 25), (9, 17), (15, 9), (23, 3), (25, 5), (21, 13), (14, 20)], mat, grad=0.3)
    t.linha(6, 25, 23, 5, M[mat][3])                                              # a haste
    t.poli([(13, 14), (16, 15), (14, 17)], mat, fixo=3)                           # o corte em raio
    t.bastao(3, 28, 7, 24, 1.6, 'branco', redondo=True)
    return t


def lanche():
    t = Tela()
    t.elipse(11, 19, 9, 5.5, 'madeira')                                           # o pão
    for x in (6, 10, 14):
        t.linha(x, 19, x + 3, 16, M['madeira'][3])                                # os cortes
        t.linha(x + 1, 19, x + 4, 16, M['madeira'][0])
    t.elipse(21, 11, 5.5, 5.5, 'laranja')                                         # a laranja
    t.elipse(22, 5.5, 2, 1, 'verde', fixo=1)
    t.ponto(19, 9, B)
    return t


def pipoca():
    t = Tela()
    for x, y in ((10, 9), (14, 7), (18, 8), (21, 11), (8, 12), (13, 11), (17, 11)):
        t.elipse(x, y, 2.6, 2.4, 'amarelo_luz')                                   # a pipoca
    t.poli([(7, 13), (23, 13), (21, 28), (9, 28)], 'branco', grad=0.3)            # o saquinho
    for x0, x1 in ((9, 10.4), (13, 13.8), (17, 17.2), (20.8, 20.2)):
        t.linha(int(x0), 14, int(x1), 27, M['vermelho'][2])
    return t


def radio():
    t = Tela()
    t.bastao(19, 9, 19, 2, 2.4, 'preto', redondo=True)                           # a antena
    t.ret(8, 8, 22, 28, 'preto', grad=0.3)
    t.ret(10, 10, 20, 14, 'verde', fixo=1)                                        # o visor
    for y in (17, 19, 21, 23):
        t.linha(11, y, 19, y, M['preto'][0])                                      # o alto-falante
    t.ret(10, 25, 12, 26, 'vermelho', fixo=1)                                     # o botão
    return t


def sacola():
    t = Tela()
    t.bastao(10, 11, 11, 4, 1.4, 'papelao')                                       # as alças
    t.bastao(11, 4, 18, 4, 1.4, 'papelao')
    t.bastao(18, 4, 19, 11, 1.4, 'papelao')
    t.poli([(6, 10), (24, 10), (25, 28), (5, 28)], 'papelao', grad=0.5)
    t.linha(6, 13, 24, 13, M['papelao'][3])                                       # a dobra
    return t


def taca():
    t = Tela()
    for x in (6, 24):
        t.elipse(x, 10, 3.6, 4, 'dourado')                                        # as asas
        t.furo(x, 10, 1.8, 2.2)
    t.poli([(7, 4), (23, 4), (21, 13), (17, 16), (13, 16), (9, 13)], 'dourado', grad=0.3)
    t.ret(14, 16, 16, 21, 'dourado', fixo=2)                                      # o pé
    t.ret(9, 21, 21, 27, 'marrom', grad=0.3)                                      # a base
    t.ret(11, 23, 19, 25, 'dourado', fixo=1)                                      # a plaquinha
    t.ponto(10, 6, B)
    return t


def etiqueta():
    t = Tela()
    t.poli([(5, 9), (19, 9), (26, 16), (19, 23), (5, 23)], 'amarelo', grad=0.4)
    t.furo(19.5, 16, 1.6, 1.6)                                                    # o furo do lacre
    t.linha(21, 16, 27, 11, M['vermelho'][2])                                     # a fita do lacre
    t.linha(27, 11, 28, 6, M['vermelho'][2])
    for y in (13, 16, 19):
        t.linha(8, y, 15, y, M['amarelo'][3])                                     # o número
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


# ---------- as bolsas da loja: cada uma com o desenho do que ela é ----------
def mochila_escolar(mat='azul'):
    """o alto arredondado, o bolso grande da frente com zíper e dois puxadores"""
    t = Tela()
    t.bastao(12, 4.5, 18, 4.5, 2.2, mat, redondo=True)                          # a alça de mão
    t.poli([(6, 26), (6, 13), (7, 10), (9, 8), (12, 6.6), (18, 6.6), (21, 8), (23, 10), (24, 13), (24, 26)], mat, grad=0.6)
    t.linha(8, 11, 22, 11, M[mat][3])                                             # o zíper de cima
    t.poli([(8, 17), (22, 17), (22, 24), (21, 25), (9, 25), (8, 24)], mat, fixo=2, borda=True)  # o bolso
    t.linha(9, 19, 21, 19, M['aco'][1])
    t.pontos([(12, 20), (12, 21), (18, 20), (18, 21)], M['aco'][0])              # os puxadores
    t.ret(10, 13, 13, 14, 'branco', fixo=1)                                       # a etiqueta do nome
    return t


def mochila_sinalizacao(mat='vermelho'):
    """duas faixas refletivas de lado a lado e a alça de fita em cima"""
    t = Tela()
    t.bastao(11, 4.5, 19, 4.5, 2.2, 'preto', redondo=True)                       # a alça de fita
    t.poli([(9, 6), (21, 6), (23, 8.5), (23, 27), (7, 27), (7, 8.5)], mat, grad=0.6)
    t.linha(9, 9, 21, 9, M[mat][3])                                               # o zíper
    t.pontos([(20, 10), (20, 11)], M['aco'][1])
    t.ret(7, 13, 23, 14, 'prata', fixo=1)                                         # as faixas refletivas
    t.ret(7, 20, 23, 21, 'prata', fixo=1)
    t.linha(7, 14, 23, 14, M['prata'][2])
    t.linha(7, 21, 23, 21, M['prata'][2])
    t.linha(9, 24, 21, 24, M[mat][3])                                             # a costura do fundo
    return t


def mochila_resgate(mat='laranja'):
    """o zíper em U que abre com uma mão, a argola de puxar e a faixa amarela"""
    t = Tela()
    t.bastao(11, 4.5, 19, 4.5, 2.4, 'preto', redondo=True)                       # a alça
    t.poli([(8, 6), (22, 6), (24, 9), (24, 27), (6, 27), (6, 9)], mat, grad=0.6)
    for x in range(9, 22, 2):                                                     # o zíper em U, os dentes
        t.ponto(x, 9, M[mat][3])
    for y in range(10, 21, 2):
        t.ponto(8, y, M[mat][3])
        t.ponto(22, y, M[mat][3])
    t.linha(8, 21, 22, 21, M[mat][3])
    t.ret(13, 9, 17, 13, 'preto', fixo=1)                                         # a argola de puxar
    t.ret(14, 10, 16, 12, mat, fixo=2)
    t.ret(6, 23, 24, 25, 'amarelo', fixo=1)                                       # a faixa de brigada
    t.linha(6, 25, 24, 25, M['amarelo'][2])
    return t


def mochila_acampamento(mat='verde'):
    """o isolante enrolado em cima, preso por duas tiras, e o cantil do lado"""
    t = Tela()
    t.poli([(8, 9), (22, 9), (23, 27), (7, 27)], mat, grad=0.6)
    t.poli([(8, 9), (22, 9), (22, 15), (8, 15)], mat, fixo=1)                    # a aba
    t.linha(8, 15, 22, 15, M[mat][3])
    t.ret(14, 14, 16, 17, 'aco', fixo=2)                                          # a fivela
    t.bastao(5, 6.5, 25, 6.5, 5, 'lona', redondo=True)                           # o isolante enrolado
    t.elipse(24.2, 6.5, 1.4, 2.4, 'lona_esc', fixo=2)                             # a ponta do rolo
    t.ret(10, 4, 11, 9, 'preto', fixo=2)                                          # as tiras
    t.ret(19, 4, 20, 9, 'preto', fixo=2)
    t.ret(3, 17, 7, 26, 'oliva', grad=0.4)                                        # o bolso do cantil
    t.ret(4, 15, 6, 16, 'aco', fixo=1)                                            # a tampa do cantil
    t.ret(10, 19, 20, 24, mat, fixo=2, borda=True)                                # o bolso da frente
    return t


def mochila_estrada(mat='amarelo'):
    """a aba com a faixa refletiva e duas tiras de compressão com fivela"""
    t = Tela()
    t.bastao(11, 5, 19, 5, 2.4, mat, redondo=True)
    t.poli([(7, 7), (23, 7), (24, 27), (6, 27)], mat, grad=0.6)
    t.poli([(7, 7), (23, 7), (23, 15), (15, 16), (7, 15)], mat, fixo=1)          # a aba
    t.linha(7, 15, 15, 16, M[mat][3])
    t.linha(15, 16, 23, 15, M[mat][3])
    t.ret(7, 10, 23, 11, 'prata', fixo=1)                                         # a faixa refletiva
    t.ret(10, 12, 11, 26, 'preto', fixo=2)                                        # as tiras
    t.ret(19, 12, 20, 26, 'preto', fixo=2)
    t.ret(9, 20, 12, 21, 'aco', fixo=1)                                           # as fivelas
    t.ret(18, 20, 21, 21, 'aco', fixo=1)
    return t


def mochila_carga(mat='marrom'):
    """a armação de metal por fora, duas correias e a fivela de latão"""
    t = Tela()
    t.bastao(6, 3, 6, 27, 1.6, 'aco')                                            # a armação
    t.bastao(24, 3, 24, 27, 1.6, 'aco')
    t.bastao(6, 3.5, 24, 3.5, 1.6, 'aco')
    t.poli([(7, 6), (23, 6), (23, 26), (7, 26)], mat, grad=0.6)
    t.poli([(7, 6), (23, 6), (23, 11), (7, 11)], mat, fixo=1)                    # a aba
    t.linha(7, 11, 23, 11, M[mat][3])
    for x in (10, 19):                                                           # as correias
        t.ret(x, 8, x + 1, 23, 'lona_esc', fixo=2)
        t.ret(x - 1, 15, x + 2, 17, 'dourado', fixo=1)                           # a fivela de latão
        t.ponto(x, 16, M['dourado'][3])
    t.ret(8, 22, 22, 25, 'lona_esc', fixo=1)                                      # o fundo reforçado
    return t


def mochila_sem_marca(mat='preto'):
    """lisa: a alça reforçada, as alças de ombro dos lados, um zíper só"""
    t = Tela()
    t.bastao(12, 4.5, 18, 4.5, 3.0, mat, redondo=True)                          # a alça reforçada
    t.poli([(5, 10), (8, 8), (8, 25), (5, 27)], mat, fixo=3)                     # as alças de ombro
    t.poli([(25, 10), (22, 8), (22, 25), (25, 27)], mat, fixo=3)
    t.poli([(6, 26), (6, 12), (8, 8.5), (11, 6.5), (19, 6.5), (22, 8.5), (24, 12), (24, 26)], mat, grad=0.6)
    t.linha(9, 11, 21, 11, M['aco'][2])                                           # o zíper
    t.ponto(20, 12, M['aco'][1])
    t.linha(8, 25, 22, 25, M[mat][3])
    t.pontos([(9, 14), (9, 15), (9, 19), (9, 20)], M[mat][1])                    # a lona encerada brilha
    return t


def bolsa_festa(mat='dourado'):
    """a corrente de alça, o fecho de beijo e a ferragem pesada"""
    t = Tela()
    for i in range(13):                                                          # a corrente
        a = math.pi * i / 12
        x, y = 15 - 6.5 * math.cos(a), 12 - 8 * math.sin(a)
        t.ponto(int(round(x)), int(round(y)), M[mat][1] if i % 2 else M[mat][3])
    t.poli([(9, 13), (21, 13), (25, 26), (5, 26)], mat, grad=0.6)
    t.bastao(7.5, 13.5, 22.5, 13.5, 2.2, mat)                                    # a ferragem de cima
    t.elipse(13.6, 11.6, 1.3, 1.3, mat)                                           # o fecho de beijo
    t.elipse(16.4, 11.6, 1.3, 1.3, mat)
    t.pontos([(8, 23), (12, 23), (18, 23), (22, 23)], M['prata'][0])             # as tachas
    t.linha(7, 21, 23, 21, M[mat][3])
    return t


def bolsa_termica(mat='prata'):
    """caixa acolchoada em losango, a tampa de zíper e a alça curta"""
    t = Tela()
    t.bastao(10, 5.5, 20, 5.5, 2.4, 'cinza', redondo=True)                       # a alça
    t.ret(10, 6, 11, 10, 'cinza', fixo=2)
    t.ret(19, 6, 20, 10, 'cinza', fixo=2)
    t.ret(5, 10, 25, 27, mat, grad=0.5)
    t.ret(5, 10, 25, 12, mat, fixo=1)                                            # a tampa
    t.linha(6, 12, 24, 12, M['aco'][3])                                           # o zíper
    for k in range(-16, 24, 5):                                                   # o acolchoado
        for x in range(6, 25):
            for y in (x + k, -x + k + 30):
                if 14 <= y <= 26:
                    t.ponto(x, y, M[mat][3] if (x + y) % 2 else M[mat][2])
    return t


def bolsa_algodao(mat='branco'):
    """sacola de algodão cru: duas alças compridas e a dobra da boca"""
    t = Tela()
    for x0, x1 in ((8, 13), (17, 22)):                                           # as alças
        t.bastao(x0, 13, x0 + 1.5, 4.5, 1.6, 'lona')
        t.bastao(x0 + 1.5, 4.5, x1 - 1.5, 4.5, 1.6, 'lona')
        t.bastao(x1 - 1.5, 4.5, x1, 13, 1.6, 'lona')
    t.poli([(6, 12), (24, 12), (25, 27), (5, 27)], mat, grad=0.6)
    t.ret(6, 12, 24, 14, mat, fixo=2)                                             # a dobra da boca
    t.linha(6, 14, 24, 14, M[mat][3])
    t.pontos([(9, 19), (14, 22), (20, 18), (11, 25), (21, 24)], M['lona'][1])    # a sujeira do primeiro dia
    return t


def bolsa_discreta(mat='cinza'):
    """transversal: a tira que atravessa, a aba curta e o botão de pressão"""
    t = Tela()
    t.bastao(3, 3, 22, 13, 1.8, 'preto')                                          # a tira transversal
    t.poli([(9, 12), (23, 12), (23, 27), (9, 27)], mat, grad=0.6)
    t.poli([(9, 12), (23, 12), (23, 19), (16, 20), (9, 19)], mat, fixo=1)        # a aba
    t.linha(9, 19, 16, 20, M[mat][3])
    t.linha(16, 20, 23, 19, M[mat][3])
    t.elipse(16, 18, 1.2, 1.2, 'aco')                                             # o botão de pressão
    t.linha(11, 24, 21, 24, M['aco'][2])                                          # o zíper do forro
    return t


def bolsa_vitrine(mat='rosa'):
    """bolsa de mão: a alça redonda, o laço e a costura à mostra"""
    t = Tela()
    t.elipse(15, 11, 6, 6.5, mat)                                                 # a alça redonda
    t.furo(15, 11.3, 3.8, 4.4)
    t.poli([(7, 13), (23, 13), (25, 24), (23, 27), (7, 27), (5, 24)], mat, grad=0.6)
    for x in range(7, 24, 2):                                                     # a costura
        t.ponto(x, 15, M['branco'][1])
        t.ponto(x, 25, M['branco'][1])
    for y in range(17, 25, 2):
        t.ponto(7, y, M['branco'][1])
        t.ponto(23, y, M['branco'][1])
    t.poli([(11, 17), (15, 19.5), (11, 22)], mat, fixo=3)                        # o laço
    t.poli([(19, 17), (15, 19.5), (19, 22)], mat, fixo=3)
    t.elipse(15, 19.5, 1.3, 1.3, mat, fixo=1)
    return t


def bolsa_acetinada(mat='roxo'):
    """saco de cetim de cordão: a boca franzida, os cordões e o brilho"""
    t = Tela()
    t.linha(13, 9, 8, 3, M['dourado'][2])                                         # os cordões
    t.linha(17, 9, 22, 3, M['dourado'][2])
    t.elipse(8, 3, 1.2, 1.2, 'dourado')
    t.elipse(22, 3, 1.2, 1.2, 'dourado')
    t.poli([(10, 12), (20, 12), (24, 18), (24, 24), (21, 27), (9, 27), (6, 24), (6, 18)], mat, grad=0.6)
    t.ret(12, 8, 18, 12, mat, fixo=2)                                             # a boca franzida
    for x in (13, 15, 17):
        t.linha(x, 8, x, 12, M[mat][3])
    t.linha(11, 12, 19, 12, M['dourado'][2])
    for i in range(5):                                                            # o brilho do cetim
        t.ponto(9 + i, 21 - i, M[mat][0])
        t.ponto(10 + i, 21 - i, M[mat][1])
    return t


# a bolsa da loja → o desenho dela; a cor de cada uma é a da ficha
BOLSAS_DA_LOJA = {
    'mochila_escolar': mochila_escolar, 'mochila_sinalizacao': mochila_sinalizacao,
    'mochila_resgate': mochila_resgate, 'mochila_acampamento': mochila_acampamento,
    'mochila_estrada': mochila_estrada, 'mochila_carga': mochila_carga,
    'mochila_sem_marca': mochila_sem_marca, 'bolsa_festa': bolsa_festa,
    'bolsa_termica': bolsa_termica, 'bolsa_algodao': bolsa_algodao,
    'bolsa_discreta': bolsa_discreta, 'bolsa_vitrine': bolsa_vitrine,
    'bolsa_acetinada': bolsa_acetinada,
}


# o nome do arquivo e quem desenha; o mapa nome → arquivo mora no JS
DESENHOS = {
    'machado': machado, 'picareta': picareta, 'lanterna': lanterna, 'pilha': pilha,
    'bandagem': bandagem, 'cantil': cantil, 'racao': racao,
    'bota_borracha': bota_borracha, 'mascara': mascara, 'cobertor': cobertor, 'camera': camera,
    'caderno': caderno, 'isca': isca, 'relogio': relogio, 'uniforme_rede': uniforme,
    'caderno_lote': caderno_lote, 'chave_subsolo': lambda: chave('ferro', velha=True),
    'broche': broche, 'papel': papel, 'foto': foto, 'mapa': mapa, 'caixa': caixa,
    'chave': chave, 'pacote': pacote, 'medalha': medalha,
    'cracha': cracha, 'cracha_verde': lambda: cracha('verde'), 'caderno_azul': lambda: caderno('azul'),
    'prancheta': prancheta, 'pasta': pasta, 'jornal': jornal, 'envelope': envelope,
    'anilha': anilha, 'apito': apito, 'binoculo': binoculo, 'placa': placa,
    'placa_bronze': lambda: placa('dourado'), 'fita': fita, 'rolo': rolo, 'garrafa': garrafa, 'pote': pote,
    'lata': lata, 'luva': luva, 'medidor': medidor, 'muda': muda, 'rede': rede, 'pena': pena,
    'lanche': lanche, 'pipoca': pipoca, 'radio': radio, 'sacola': sacola, 'taca': taca, 'etiqueta': etiqueta,
}
CORES_DE_MOCHILA = {'bege': 'lona', 'preta': 'preto', 'vermelha': 'vermelho', 'azul': 'azul', 'verde': 'verde',
                    'amarela': 'amarelo', 'marrom': 'marrom', 'laranja': 'laranja', 'roxa': 'roxo',
                    'branca': 'branco', 'cinza': 'cinza', 'rosa': 'rosa', 'prateada': 'prata',
                    'dourada': 'dourado'}
for nome, mat in CORES_DE_MOCHILA.items():
    DESENHOS['mochila_' + nome] = (lambda m: lambda: mochila(m))(mat)
    DESENHOS['bolsa_' + nome] = (lambda m: lambda: bolsa(m))(mat)
DESENHOS.update(BOLSAS_DA_LOJA)


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
