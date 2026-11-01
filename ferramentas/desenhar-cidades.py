#!/usr/bin/env python3
"""Os panoramas das cidades: um fundo por cidade, em pixel.

Os cenários de lugar vêm dos fundos de batalha do Showdown, e lá não tem
cidade nenhuma além de uma rua de tijolo — Viridian, Cerulean, Saffron e
Celadon dividiam a mesma, Pewter a montanha de mais sete lugares, Fuchsia
o prado de Pallet. Aqui cada cidade ganha o dela, no jeito daqueles
fundos (pixel dobrado, luz de cima à esquerda, sem contorno preto), com o
marco da cidade e a cor que dá nome a ela: Pallet branca, Viridian verde,
Pewter cinza, Cerulean azul, Vermilion vermelha do poente, Lavender lilás,
Celadon verde-clara, Fuchsia rosa, Saffron amarela, Cinnabar vermelha.

Desenha em meia escala (376×250) e sai em 752×500, a medida dos outros.
O marco fica no alto e à direita: a placa do lugar mostra a faixa de
cima da imagem, com a esquerda escurecida pro título.

    python3 ferramentas/desenhar-cidades.py            # gera os dez
    python3 ferramentas/desenhar-cidades.py --folha f.png
"""
import os
import random
import sys

from PIL import Image, ImageDraw

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, 'sprites_nds', 'arenas')
W, H = 376, 250
HORIZONTE = 104


def mistura(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def hexa(s):
    s = s.lstrip('#')
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


class Cena:
    def __init__(self, semente):
        self.im = Image.new('RGB', (W, H), (0, 0, 0))
        self.d = ImageDraw.Draw(self.im)
        self.r = random.Random(semente)

    # ---------- céu, nuvem, chão ----------
    def ceu(self, cores, y0=0, y1=HORIZONTE + 6):
        """faixas de cor de cima pra baixo, com a emenda pontilhada"""
        n = len(cores) - 1
        alt = (y1 - y0) / n
        for i in range(n):
            ya, yb = int(y0 + i * alt), int(y0 + (i + 1) * alt)
            for y in range(ya, yb):
                t = (y - ya) / max(1, yb - ya)
                cor = cores[i] if t < .5 else cores[i + 1]
                self.d.line([(0, y), (W, y)], fill=cor)
            # a emenda em xadrez, como nos fundos dos jogos
            ym = (ya + yb) // 2
            for x in range(0, W, 2):
                self.im.putpixel((x + (ym % 2), ym), cores[i])
                if ym + 1 < H:
                    self.im.putpixel((x + ((ym + 1) % 2), ym + 1), cores[i + 1])

    def sol(self, cx, cy, r, cor, halo):
        self.d.ellipse([cx - r - 5, cy - r - 5, cx + r + 5, cy + r + 5], fill=halo)
        self.d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=cor)

    def nuvem(self, cx, cy, w, cor=(255, 255, 255), sombra=(214, 228, 244)):
        h = max(5, w // 4)
        bolhas = [(-.32, .1, .3), (0, -.18, .36), (.3, .05, .28), (-.12, .2, .3), (.14, .2, .3)]
        for dx, dy, rr in bolhas:
            rx = int(w * rr)
            x, y = cx + int(dx * w), cy + int(dy * h * 2)
            self.d.ellipse([x - rx, y - int(rx * .7), x + rx, y + int(rx * .7)], fill=sombra)
        for dx, dy, rr in bolhas:
            rx = int(w * rr) - 1
            x, y = cx + int(dx * w) - 1, cy + int(dy * h * 2) - 2
            self.d.ellipse([x - rx, y - int(rx * .7), x + rx, y + int(rx * .7)], fill=cor)

    def faixa(self, y0, y1, cor):
        self.d.rectangle([0, y0, W, y1], fill=cor)

    def pintas(self, caixa, cores, n, tam=(1, 2)):
        x0, y0, x1, y1 = caixa
        for _ in range(n):
            x, y = self.r.randint(x0, x1), self.r.randint(y0, y1)
            w = self.r.randint(*tam)
            self.d.rectangle([x, y, x + w, y], fill=self.r.choice(cores))

    def grama(self, y0, tons, y1=H):
        """o chão de grama: a cor, as moitas mais escuras e o brilho"""
        claro, base, escuro = tons
        self.d.rectangle([0, y0, W, y1], fill=base)
        for _ in range(int(W * (y1 - y0) / 55)):
            x, y = self.r.randint(0, W), self.r.randint(y0 + 2, y1)
            w = self.r.randint(3, 9)
            self.d.rectangle([x, y, x + w, y + 1], fill=escuro)
            self.d.rectangle([x + 1, y - 1, x + w - 2, y - 1], fill=claro)

    def calcada(self, y0, tons, y1=H, passo=16):
        claro, base, escuro = tons
        self.d.rectangle([0, y0, W, y1], fill=base)
        linha, y = 0, y0
        while y < y1:
            alt = 6 + linha * 2
            self.d.line([(0, y), (W, y)], fill=escuro)
            off = (linha % 2) * passo // 2
            for x in range(-passo + off, W, passo):
                self.d.line([(x, y), (x, y + alt)], fill=escuro)
                self.d.line([(x + 1, y + 1), (x + passo - 2, y + 1)], fill=claro)
            y += alt
            linha += 1

    def agua(self, y0, y1, tons, brilho=(255, 255, 255)):
        n = len(tons)
        alt = (y1 - y0) / n
        for i, c in enumerate(tons):
            self.d.rectangle([0, int(y0 + i * alt), W, int(y0 + (i + 1) * alt)], fill=c)
        for _ in range(int(W * (y1 - y0) / 140)):
            y = self.r.randint(y0 + 1, y1 - 1)
            x = self.r.randint(0, W)
            w = self.r.randint(4, 14) * (1 + (y - y0) // 30)
            self.d.line([(x, y), (x + w, y)], fill=mistura(tons[min(n - 1, int((y - y0) / alt))], brilho, .55))

    # ---------- terra ao longe ----------
    def serra(self, base, picos, luz, sombra, neve=None):
        """cada pico, um triângulo: a encosta da esquerda na luz, a da
        direita na sombra"""
        for (x, y, larg) in picos:
            esq, dir_ = x - larg, x + larg
            self.d.polygon([(esq, base), (x, y), (x, base)], fill=luz)
            self.d.polygon([(x, y), (dir_, base), (x, base)], fill=sombra)
            if neve:
                k = (base - y) // 4
                self.d.polygon([(x - k * larg // (base - y), y + k), (x, y), (x + k * larg // (base - y), y + k)], fill=neve)

    def morros(self, base, morros, cor, luz):
        for (cx, rx, ry) in morros:
            self.d.ellipse([cx - rx, base - ry, cx + rx, base + ry], fill=cor)
            self.d.ellipse([cx - rx + 4, base - ry + 2, cx + rx // 3, base - ry // 3], fill=luz)

    def mata(self, base, alt, cor, escuro, passo=7):
        """a linha de árvores ao longe: copas redondas encostadas"""
        x = -4
        while x < W + 8:
            r = self.r.randint(passo - 2, passo + 3)
            y = base - alt + self.r.randint(-3, 3)
            self.d.ellipse([x - r, y - r, x + r, y + r + alt], fill=escuro)
            self.d.ellipse([x - r + 1, y - r, x + r - 2, y + r // 2], fill=cor)
            x += r
        self.d.rectangle([0, base - 2, W, base + 2], fill=escuro)

    # ---------- coisas ----------
    def arvore(self, x, y, r, tons, tronco=(110, 74, 46)):
        claro, base, escuro = tons
        self.d.rectangle([x - 1, y - r // 2, x + 1, y], fill=tronco)
        self.d.ellipse([x - r, y - r * 2 - 2, x + r, y - r // 2], fill=escuro)
        self.d.ellipse([x - r + 1, y - r * 2 - 2, x + r - 2, y - r], fill=base)
        self.d.ellipse([x - r + 2, y - r * 2 - 1, x, y - r * 2 + r // 2 + 1], fill=claro)

    def palmeira(self, x, y, h, folha, tronco=(150, 104, 62)):
        claro, base, escuro = folha
        for k in range(h):
            dx = int((k / h) ** 2 * 6)
            anel = mistura(tronco, (0, 0, 0), .28) if k % 4 == 0 else tronco
            self.d.rectangle([x + dx - 2, y - k, x + dx + 2, y - k], fill=anel)
            self.d.point((x + dx - 2, y - k), fill=mistura(tronco, (255, 255, 255), .3))
        tx, ty = x + 6, y - h
        for (ex, ey) in ((-20, 8), (-16, -4), (-6, -12), (8, -11), (18, -3), (21, 9), (8, 10), (-9, 11)):
            self.d.line([(tx, ty), (tx + ex, ty + ey)], fill=escuro, width=5)
            self.d.line([(tx, ty - 1), (tx + ex, ty + ey - 1)], fill=base, width=3)
            self.d.line([(tx, ty - 2), (tx + ex * 2 // 3, ty + ey * 2 // 3 - 2)], fill=claro, width=1)
        self.d.ellipse([tx - 3, ty - 3, tx + 3, ty + 3], fill=hexa('8a5a32'))

    def casa(self, x, base, w, h, parede, telhado, porta=(96, 66, 44), janela=(150, 200, 236)):
        """casa de duas águas: parede, telhado, porta e duas janelas"""
        pl, pb, pe = parede
        tl, tb, te = telhado
        self.d.rectangle([x, base - h, x + w, base], fill=pb)
        self.d.rectangle([x, base - h, x + 1, base], fill=pl)
        self.d.rectangle([x + w - 1, base - h, x + w, base], fill=pe)
        b = max(3, w // 6)
        self.d.polygon([(x - b, base - h + 1), (x + w // 2, base - h - w // 2), (x + w + b, base - h + 1)], fill=tb)
        self.d.polygon([(x - b, base - h + 1), (x + w // 2, base - h - w // 2), (x + w // 2, base - h + 1)], fill=tl)
        self.d.line([(x - b, base - h + 1), (x + w + b, base - h + 1)], fill=te)
        pw = max(3, w // 5)
        self.d.rectangle([x + w // 2 - pw // 2, base - h // 2, x + w // 2 + pw // 2, base], fill=porta)
        for jx in (x + 3, x + w - 3 - pw):
            self.d.rectangle([jx, base - h + 4, jx + pw, base - h + 4 + pw], fill=janela)
            self.d.line([(jx, base - h + 4), (jx + pw, base - h + 4)], fill=(255, 255, 255))

    def predio(self, x, base, w, h, parede, janela, colunas, linhas, margem=3, topo=None, luz=(255, 236, 160)):
        pl, pb, pe = parede
        self.d.rectangle([x, base - h, x + w, base], fill=pb)
        self.d.rectangle([x, base - h, x + 1, base], fill=pl)
        self.d.rectangle([x + w - 2, base - h, x + w, base], fill=pe)
        if topo:
            self.d.rectangle([x - 1, base - h - 2, x + w + 1, base - h], fill=topo)
        jw = max(2, (w - margem * 2) // colunas - 2)
        jh = max(2, (h - margem * 2) // linhas - 3)
        for c in range(colunas):
            for l in range(linhas):
                jx = x + margem + c * (jw + 2)
                jy = base - h + margem + l * (jh + 3)
                if jy + jh > base - 4:
                    continue
                acesa = self.r.random() < .18
                self.d.rectangle([jx, jy, jx + jw - 1, jy + jh], fill=luz if acesa else janela)
                self.d.line([(jx, jy), (jx + jw - 1, jy)], fill=mistura(janela, (255, 255, 255), .5))

    def cerca(self, y, x0, x1, cor, sombra, passo=6):
        self.d.rectangle([x0, y - 6, x1, y - 5], fill=cor)
        self.d.rectangle([x0, y - 2, x1, y - 1], fill=cor)
        for x in range(x0, x1, passo):
            self.d.rectangle([x, y - 9, x + 1, y + 1], fill=cor)
            self.d.point((x + 1, y + 1), fill=sombra)

    def flores(self, caixa, cores, n):
        x0, y0, x1, y1 = caixa
        for _ in range(n):
            x, y = self.r.randint(x0, x1), self.r.randint(y0, y1)
            c = self.r.choice(cores)
            self.d.point((x, y), fill=c)
            self.d.point((x + 1, y), fill=c)
            self.d.point((x, y + 1), fill=mistura(c, (40, 90, 40), .5))

    def imagem(self):
        grande = self.im.resize((W * 2, H * 2), Image.NEAREST)
        return grande.quantize(colors=64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)


# ======================================================================
#  AS DEZ
# ======================================================================
CEU_DIA = [hexa('6fb2f0'), hexa('8cc4f4'), hexa('a8d4f6'), hexa('c4e2f8'), hexa('dcefff')]


def pallet():
    """Pallet: a manhã branca, o laboratório do Professor com o moinho,
    duas casas de telhado vermelho, a cerca branca e o mar lá atrás"""
    c = Cena(1)
    c.ceu([hexa('86c0f2'), hexa('a4d0f6'), hexa('c2e0f8'), hexa('e0f0fc'), hexa('f6fbff')])
    c.nuvem(70, 30, 46); c.nuvem(200, 18, 34); c.nuvem(320, 40, 40)
    c.agua(HORIZONTE - 8, HORIZONTE + 2, [hexa('7cc2e8'), hexa('94d0ee')])
    c.morros(HORIZONTE + 4, [(40, 70, 16), (330, 90, 14)], hexa('8ccf78'), hexa('a8de8e'))
    c.grama(HORIZONTE, (hexa('b4e690'), hexa('92d270'), hexa('72b656')))
    # o laboratório: branco, telhado cinza-azulado, janelão
    lx, lb = 236, 136
    c.predio(lx, lb, 96, 44, (hexa('ffffff'), hexa('eef0f4'), hexa('c8ccd6')), hexa('9cc8ec'), 6, 2, topo=hexa('7c8aa8'))
    c.d.polygon([(lx - 6, lb - 44), (lx + 48, lb - 64), (lx + 102, lb - 44)], fill=hexa('8090b0'))
    c.d.polygon([(lx - 6, lb - 44), (lx + 48, lb - 64), (lx + 48, lb - 44)], fill=hexa('98a8c6'))
    c.d.rectangle([lx + 42, lb - 18, lx + 54, lb], fill=hexa('6a7896'))
    # o moinho do laboratório
    mx, my = lx + 84, lb - 70
    c.d.rectangle([mx - 1, my, mx + 1, lb - 46], fill=hexa('9aa4b8'))
    for (ex, ey) in ((-12, -10), (12, -10), (-10, 12), (10, 12)):
        c.d.line([(mx, my), (mx + ex, my + ey)], fill=hexa('f4f6fa'), width=3)
    c.d.ellipse([mx - 2, my - 2, mx + 2, my + 2], fill=hexa('c03a3a'))
    # as duas casas
    c.casa(46, 140, 40, 26, (hexa('fffaf0'), hexa('f2ead8'), hexa('d6ccb4')), (hexa('f07a6a'), hexa('d84a3e'), hexa('a83228')))
    c.casa(126, 134, 36, 24, (hexa('fffaf0'), hexa('f2ead8'), hexa('d6ccb4')), (hexa('f07a6a'), hexa('d84a3e'), hexa('a83228')))
    c.cerca(160, 0, W, hexa('ffffff'), hexa('c8d0c0'))
    c.d.rectangle([150, 160, 196, H], fill=hexa('d8c49a'))                       # o caminho de terra
    c.d.rectangle([152, 160, 154, H], fill=hexa('e8d8b2'))
    c.flores((10, 168, 140, 240), [hexa('ffffff'), hexa('ffd6e6'), hexa('fff2a8')], 70)
    c.flores((210, 168, 370, 240), [hexa('ffffff'), hexa('ffd6e6'), hexa('fff2a8')], 70)
    return c


def viridian():
    """Viridian: a mata da floresta atrás, a cidade verde e o ginásio
    fechado de telhado verde-escuro, árvores grandes na frente"""
    c = Cena(2)
    c.ceu(CEU_DIA)
    c.nuvem(90, 26, 40); c.nuvem(250, 36, 52)
    c.mata(HORIZONTE, 18, hexa('3e9a52'), hexa('2a7240'))
    c.grama(HORIZONTE, (hexa('8fd472'), hexa('6cbc58'), hexa('4c9a44')))
    # o ginásio: grande, sóbrio, porta fechada
    gx, gb = 214, 140
    c.predio(gx, gb, 120, 48, (hexa('e8f0e0'), hexa('d2dec8'), hexa('a8b89c')), hexa('6e8c70'), 7, 1, margem=8, luz=hexa('6e8c70'))
    c.d.polygon([(gx - 6, gb - 48), (gx + 10, gb - 66), (gx + 110, gb - 66), (gx + 126, gb - 48)], fill=hexa('2f6a46'))
    c.d.polygon([(gx - 6, gb - 48), (gx + 10, gb - 66), (gx + 60, gb - 66), (gx + 60, gb - 48)], fill=hexa('3f8256'))
    c.d.rectangle([gx + 50, gb - 22, gx + 70, gb], fill=hexa('3a4a3c'))           # a porta trancada
    c.d.rectangle([gx + 59, gb - 22, gx + 61, gb], fill=hexa('6f7f6c'))
    c.d.ellipse([gx + 54, gb - 62, gx + 66, gb - 52], fill=hexa('f2d36a'))         # o emblema
    c.casa(40, 134, 38, 24, (hexa('f8f4e8'), hexa('e8e0cc'), hexa('c8bea4')), (hexa('7cc68a'), hexa('4f9e62'), hexa('357a48')))
    c.casa(110, 138, 34, 22, (hexa('f8f4e8'), hexa('e8e0cc'), hexa('c8bea4')), (hexa('7cc68a'), hexa('4f9e62'), hexa('357a48')))
    c.d.polygon([(150, H), (186, 150), (206, 150), (232, H)], fill=hexa('d6c08c'))   # a estrada pro norte
    for (x, y, r) in ((18, 214, 16), (356, 222, 18), (300, 236, 12)):
        c.arvore(x, y, r, (hexa('5cc070'), hexa('3c9a52'), hexa('287040')))
    return c


def pewter():
    """Pewter: o Monte da Lua cinza atrás, o museu de pedra com colunas
    e cúpula, e pedra por todo lado"""
    c = Cena(3)
    c.ceu([hexa('9ab8d8'), hexa('aec6e0'), hexa('c2d4e6'), hexa('d6e2ee'), hexa('e6eef4')])
    c.nuvem(60, 22, 36, sombra=hexa('cdd8e6'))
    c.serra(HORIZONTE + 2, [(40, 52, 50), (120, 36, 60), (196, 58, 46), (300, 30, 70), (370, 54, 40)],
            hexa('a8a4a0'), hexa('7e7a78'), neve=hexa('e8e8ee'))
    c.d.ellipse([112, 84, 128, 100], fill=hexa('4a4644'))                           # a boca do Monte da Lua
    c.calcada(HORIZONTE + 2, (hexa('c8c4bc'), hexa('b0aca4'), hexa('8e8a84')), passo=20)
    # o museu: escadaria, colunas, frontão e a cúpula
    mx, mb = 206, 150
    c.d.rectangle([mx - 6, mb - 4, mx + 130, mb], fill=hexa('9c9890'))
    c.d.rectangle([mx - 2, mb - 8, mx + 126, mb - 4], fill=hexa('b4b0a8'))
    c.d.rectangle([mx, mb - 52, mx + 124, mb - 8], fill=hexa('d8d4cc'))
    for k in range(7):
        cx = mx + 8 + k * 18
        c.d.rectangle([cx, mb - 50, cx + 6, mb - 8], fill=hexa('f0eee8'))
        c.d.rectangle([cx + 5, mb - 50, cx + 6, mb - 8], fill=hexa('bcb8b0'))
    c.d.polygon([(mx - 6, mb - 52), (mx + 62, mb - 74), (mx + 130, mb - 52)], fill=hexa('c8c4bc'))
    c.d.polygon([(mx - 6, mb - 52), (mx + 62, mb - 74), (mx + 62, mb - 52)], fill=hexa('e0dcd4'))
    c.d.pieslice([mx + 40, mb - 100, mx + 84, mb - 60], 180, 360, fill=hexa('8aa0b4'))
    c.d.pieslice([mx + 42, mb - 98, mx + 64, mb - 62], 180, 270, fill=hexa('a8bccc'))
    c.d.rectangle([mx + 61, mb - 106, mx + 63, mb - 98], fill=hexa('6e7c88'))
    for (x, y, w) in ((20, 190, 26), (88, 214, 18), (330, 200, 30), (170, 230, 14)):   # as pedras
        c.d.ellipse([x, y, x + w, y + w // 2], fill=hexa('8e8a84'))
        c.d.ellipse([x + 2, y, x + w - 6, y + w // 4], fill=hexa('b8b4ac'))
    return c


def cerulean():
    """Cerulean: azul de ponta a ponta — o lago na frente, a ponte comprida
    que sai pro norte e as casas de telhado azul na margem"""
    c = Cena(4)
    c.ceu([hexa('4ea2ee'), hexa('6cb4f2'), hexa('8cc6f6'), hexa('acd8f8'), hexa('cce8fc')])
    c.nuvem(110, 30, 48); c.nuvem(300, 20, 36)
    c.morros(HORIZONTE + 2, [(60, 90, 20), (250, 120, 16)], hexa('76c070'), hexa('94d488'))
    c.grama(HORIZONTE, (hexa('a0dc84'), hexa('7cc466'), hexa('5aa24e')), y1=150)
    c.casa(26, 136, 40, 26, (hexa('ffffff'), hexa('eef2f8'), hexa('c8d0dc')), (hexa('7ab8f0'), hexa('3e86d6'), hexa('2a64a8')))
    c.casa(96, 132, 34, 22, (hexa('ffffff'), hexa('eef2f8'), hexa('c8d0dc')), (hexa('7ab8f0'), hexa('3e86d6'), hexa('2a64a8')))
    c.agua(146, H, [hexa('4f9ee6'), hexa('3f8cd8'), hexa('347ac6'), hexa('2a68b0')])
    # a ponte: tabuleiro, guarda-corpo e pilares, saindo pra direita e subindo
    for k in range(0, 150, 2):
        x = 200 + k
        y = 150 - k // 3
        c.d.rectangle([x, y, x + 2, y + 3], fill=hexa('d8b47a'))
        c.d.point((x, y - 4), fill=hexa('f4f0e6'))
        if k % 18 == 0:
            c.d.rectangle([x, y + 4, x + 2, y + 22], fill=hexa('8a6a44'))
            c.d.rectangle([x, y - 4, x + 1, y], fill=hexa('f4f0e6'))
    return c


def vermilion():
    """Vermilion: o porto no poente vermelho, o S.S. Anne atracado e o
    cais de madeira na frente"""
    c = Cena(5)
    c.ceu([hexa('5a4a8c'), hexa('9c5a8e'), hexa('e0707a'), hexa('f49a6a'), hexa('ffc890')])
    c.sol(110, HORIZONTE - 14, 14, hexa('fff0b8'), hexa('ffd590'))
    c.nuvem(60, 30, 40, cor=hexa('f6a08c'), sombra=hexa('c86a7c'))
    c.nuvem(250, 22, 50, cor=hexa('f6a08c'), sombra=hexa('c86a7c'))
    c.agua(HORIZONTE - 4, 178, [hexa('e0806e'), hexa('c66a6c'), hexa('a4566c'), hexa('84466a')], brilho=hexa('ffd7a0'))
    for y in range(HORIZONTE, 176, 3):                                               # o reflexo do sol
        w = 16 - (y - HORIZONTE) // 8
        c.d.line([(110 - w, y), (110 + w, y)], fill=hexa('ffd590'))
    # o navio: casco, faixa, conveses, chaminés
    nx, nb = 196, 150
    c.d.polygon([(nx, nb - 30), (nx + 168, nb - 30), (nx + 156, nb), (nx + 12, nb)], fill=hexa('f4f2f0'))
    c.d.rectangle([nx + 4, nb - 12, nx + 162, nb - 7], fill=hexa('c83a3a'))
    c.d.rectangle([nx + 10, nb - 7, nx + 158, nb], fill=hexa('2e3a66'))
    for k in range(3):
        c.d.rectangle([nx + 30 + k * 6, nb - 46 - k * 10, nx + 140 - k * 14, nb - 30 - k * 10], fill=hexa('ffffff') if k % 2 == 0 else hexa('eceae6'))
        for j in range(nx + 34 + k * 6, nx + 134 - k * 14, 6):
            c.d.rectangle([j, nb - 41 - k * 10, j + 2, nb - 38 - k * 10], fill=hexa('5a7ab4'))
    for fx in (nx + 76, nx + 104):
        c.d.rectangle([fx, nb - 92, fx + 12, nb - 66], fill=hexa('e8a23a'))
        c.d.rectangle([fx, nb - 92, fx + 12, nb - 86], fill=hexa('2e2a30'))
    for (sx, sy) in ((nx + 82, nb - 100), (nx + 110, nb - 104)):                    # a fumaça
        c.d.ellipse([sx - 6, sy - 5, sx + 6, sy + 3], fill=hexa('c8a4b0'))
    # o cais
    c.d.rectangle([0, 176, W, H], fill=hexa('a8744c'))
    for y in range(176, H, 7):
        c.d.line([(0, y), (W, y)], fill=hexa('7c5234'))
    for x in range(20, W, 64):
        c.d.rectangle([x, 168, x + 8, 180], fill=hexa('4a3a36'))                      # os cabeços
        c.d.rectangle([x + 1, 168, x + 7, 170], fill=hexa('6e5c58'))
    return c


def lavender():
    """Lavender: o fim de tarde lilás, a neblina e a Torre alta à direita"""
    c = Cena(6)
    c.ceu([hexa('3c2c5a'), hexa('5a4080'), hexa('7c5ca2'), hexa('a07cc0'), hexa('c4a6d8')])
    c.nuvem(80, 30, 42, cor=hexa('b496cc'), sombra=hexa('8a6cae'))
    c.morros(HORIZONTE + 4, [(60, 100, 14), (300, 110, 12)], hexa('6c5a86'), hexa('7e6c98'))
    c.grama(HORIZONTE, (hexa('8c84a4'), hexa('726a8c'), hexa('5c5476')))
    # a Torre: sete andares que afinam, telhadinho em cada um
    tx, tb = 268, 150
    for k in range(7):
        w = 64 - k * 7
        y = tb - k * 18
        c.d.rectangle([tx - w // 2, y - 16, tx + w // 2, y], fill=hexa('b49ed0') if k % 2 else hexa('a690c4'))
        c.d.rectangle([tx + w // 2 - 3, y - 16, tx + w // 2, y], fill=hexa('7c6a9a'))
        c.d.polygon([(tx - w // 2 - 4, y - 16), (tx + w // 2 + 4, y - 16), (tx + w // 2 - 2, y - 20), (tx - w // 2 + 2, y - 20)], fill=hexa('5a4878'))
        for j in range(tx - w // 2 + 4, tx + w // 2 - 4, 7):
            c.d.rectangle([j, y - 12, j + 2, y - 7], fill=hexa('3c2c52'))
    c.d.rectangle([tx - 1, tb - 140, tx + 1, tb - 124], fill=hexa('5a4878'))
    c.casa(30, 140, 36, 22, (hexa('e8e0f0'), hexa('d4cae2'), hexa('ada0c4')), (hexa('9c7cc4'), hexa('7a5aa8'), hexa('5a3e86')), janela=hexa('f6e6a0'))
    c.casa(100, 136, 32, 20, (hexa('e8e0f0'), hexa('d4cae2'), hexa('ada0c4')), (hexa('9c7cc4'), hexa('7a5aa8'), hexa('5a3e86')), janela=hexa('f6e6a0'))
    for y in (150, 172, 200):                                                         # a neblina em faixas
        for x in range(0, W, 3):
            if (x // 3 + y) % 4:
                c.d.point((x, y + (x // 9) % 2), fill=hexa('c8b8dc'))
    return c


def celadon():
    """Celadon: a cidade grande e verde — a Grande Loja alta com jardim no
    terraço, árvores e o canteiro de flores da frente"""
    c = Cena(7)
    c.ceu([hexa('78b8ea'), hexa('94c8ee'), hexa('b0d8f2'), hexa('cce6f4'), hexa('e4f2f6')])
    c.nuvem(70, 22, 40); c.nuvem(190, 34, 30)
    for (x, w, h) in ((0, 40, 40), (44, 30, 54), (78, 36, 34), (120, 28, 46), (152, 30, 30)):   # a cidade ao fundo
        c.d.rectangle([x, HORIZONTE - h, x + w, HORIZONTE + 4], fill=hexa('a4c4c0'))
        for j in range(x + 3, x + w - 3, 5):
            for k in range(HORIZONTE - h + 4, HORIZONTE, 6):
                c.d.rectangle([j, k, j + 2, k + 2], fill=hexa('c4dcd6'))
    c.calcada(HORIZONTE + 4, (hexa('e2e6dc'), hexa('cfd6c8'), hexa('aab4a2')))
    # a Grande Loja: alta, vidro, faixa de letreiro e o jardim no alto
    lx, lb = 218, 166
    c.predio(lx, lb, 112, 136, (hexa('f4f8f0'), hexa('e0e8dc'), hexa('b4c2ae')), hexa('8cc0d4'), 9, 11, margem=5)
    c.d.rectangle([lx, lb - 112, lx + 112, lb - 104], fill=hexa('4aa070'))           # o letreiro
    c.d.rectangle([lx + 6, lb - 110, lx + 106, lb - 106], fill=hexa('7cd29a'))
    for (x, r) in ((lx + 14, 7), (lx + 36, 9), (lx + 64, 8), (lx + 92, 9)):          # o jardim no terraço
        c.arvore(x, lb - 136, r, (hexa('86d67a'), hexa('5cb860'), hexa('3c8a48')))
    c.d.rectangle([lx + 44, lb - 20, lx + 68, lb], fill=hexa('6a8c80'))              # a porta de vidro
    for (x, y, r) in ((24, 196, 14), (186, 190, 12), (356, 200, 14)):
        c.arvore(x, y, r, (hexa('86d67a'), hexa('5cb860'), hexa('3c8a48')))
    c.d.rectangle([0, 214, W, H], fill=hexa('6cbc5c'))                               # o canteiro
    c.flores((0, 216, W, H - 2), [hexa('ff7a9c'), hexa('ffd44a'), hexa('ffffff'), hexa('b48cff'), hexa('ff9a4a')], 260)
    return c


def fuchsia():
    """Fuchsia: o rosa da tarde, a mata da Zona Safári, o portão de
    madeira com telhado de palha e as palmeiras"""
    c = Cena(8)
    c.ceu([hexa('8a7ce0'), hexa('b48ae0'), hexa('e29ad6'), hexa('f6b6d2'), hexa('ffd8e2')])
    c.nuvem(70, 24, 44, cor=hexa('fff0f6'), sombra=hexa('e8b4d0'))
    c.nuvem(220, 32, 34, cor=hexa('fff0f6'), sombra=hexa('e8b4d0'))
    c.mata(HORIZONTE, 22, hexa('3fa064'), hexa('2a7a4c'), passo=9)
    c.grama(HORIZONTE, (hexa('a6dc8a'), hexa('84c870'), hexa('62aa56')))
    # o portão da Zona Safári
    px, pb = 210, 158
    for x in (px, px + 112):
        c.d.rectangle([x, pb - 70, x + 14, pb], fill=hexa('9a643a'))
        c.d.rectangle([x, pb - 70, x + 3, pb], fill=hexa('c08a56'))
    c.d.rectangle([px - 6, pb - 82, px + 132, pb - 68], fill=hexa('8a5632'))
    c.d.rectangle([px - 6, pb - 82, px + 132, pb - 79], fill=hexa('b07a4a'))
    c.d.polygon([(px - 16, pb - 82), (px + 63, pb - 112), (px + 142, pb - 82)], fill=hexa('d8b45c'))   # a palha
    c.d.polygon([(px - 16, pb - 82), (px + 63, pb - 112), (px + 63, pb - 82)], fill=hexa('ecc874'))
    for k in range(-14, 140, 6):
        c.d.line([(px + k, pb - 82), (px + k + 3, pb - 86)], fill=hexa('b8943e'))
    c.d.rectangle([px + 40, pb - 76, px + 86, pb - 72], fill=hexa('f4e2c0'))          # a placa sem letra
    c.d.rectangle([px + 14, pb - 40, px + 112, pb], fill=hexa('5a8a4c'))              # a trilha que entra na mata
    c.d.polygon([(px + 40, pb), (px + 58, pb - 40), (px + 68, pb - 40), (px + 86, pb)], fill=hexa('d8c08c'))
    c.d.polygon([(px + 40, pb), (px + 86, pb), (px + 110, H), (px + 16, H)], fill=hexa('e4cc98'))
    for (x, h) in ((30, 70), (80, 56), (350, 74)):
        c.palmeira(x, 196, h, (hexa('7cd06a'), hexa('4fa84e'), hexa('2f7a3c')))
    c.flores((0, 200, 200, H - 2), [hexa('ff6ab4'), hexa('ff9ad0'), hexa('ffffff')], 120)
    return c


def saffron():
    """Saffron: a capital amarela — a torre da Silph, alta e de vidro, os
    prédios em volta e a avenida"""
    c = Cena(9)
    c.ceu([hexa('8fb4d8'), hexa('b0c4d0'), hexa('d8d2b8'), hexa('f0dca0'), hexa('fbe8b0')])
    c.nuvem(60, 26, 36, cor=hexa('fff6dc'), sombra=hexa('e6d6a6'))
    for (x, w, h) in ((0, 34, 44), (36, 26, 62), (64, 40, 50), (106, 30, 74), (138, 34, 40), (174, 24, 58)):
        c.d.rectangle([x, HORIZONTE - h, x + w, HORIZONTE + 6], fill=hexa('c8bc96'))
        for j in range(x + 3, x + w - 3, 5):
            for k in range(HORIZONTE - h + 4, HORIZONTE + 2, 6):
                c.d.rectangle([j, k, j + 2, k + 2], fill=hexa('e2d6ae'))
    c.d.rectangle([0, HORIZONTE + 6, W, H], fill=hexa('8c8c94'))                      # a avenida
    for y in range(HORIZONTE + 8, H, 22):
        c.d.rectangle([0, y, W, y + 1], fill=hexa('7a7a82'))
    for x in range(0, W, 30):
        c.d.rectangle([x, 196, x + 16, 199], fill=hexa('f2d24a'))                      # a faixa amarela
    c.d.rectangle([0, HORIZONTE + 6, W, HORIZONTE + 14], fill=hexa('d6d0bc'))
    # a Silph: torre de vidro com o topo escalonado e a antena
    sx, sb = 246, 172
    c.predio(sx, sb, 84, 156, (hexa('dfe6f0'), hexa('c4d0e0'), hexa('8e9cb4')), hexa('5e86c0'), 8, 16, margem=4, luz=hexa('ffe9a0'))
    c.d.rectangle([sx + 10, sb - 166, sx + 74, sb - 156], fill=hexa('b4c0d4'))
    c.d.rectangle([sx + 24, sb - 174, sx + 60, sb - 166], fill=hexa('a2b0c8'))
    c.d.rectangle([sx + 41, sb - 196, sx + 43, sb - 174], fill=hexa('8e9cb4'))
    c.d.point((sx + 42, sb - 197), fill=hexa('ff5a4a'))
    c.d.rectangle([sx + 30, sb - 18, sx + 54, sb], fill=hexa('4a5a78'))
    c.predio(206, 172, 34, 70, (hexa('ece0bc'), hexa('dccc9c'), hexa('b4a274')), hexa('8aa0b8'), 3, 6)
    c.predio(336, 172, 40, 90, (hexa('ece0bc'), hexa('dccc9c'), hexa('b4a274')), hexa('8aa0b8'), 4, 8)
    return c


def cinnabar():
    """Cinnabar: a ilha do vulcão — o cone vermelho fumegando, o mar em
    volta e o laboratório branco na areia escura"""
    c = Cena(10)
    c.ceu([hexa('5e9ee0'), hexa('7cb2e4'), hexa('a4c8e6'), hexa('d0dce4'), hexa('f0e2d0')])
    c.nuvem(60, 26, 34)
    # o vulcão, com a fumaça e o vermelho da boca
    vx, vb = 250, HORIZONTE + 4
    c.d.polygon([(vx - 120, vb), (vx - 26, vb - 74), (vx + 26, vb - 74), (vx + 124, vb)], fill=hexa('9c4a3a'))
    c.d.polygon([(vx - 120, vb), (vx - 26, vb - 74), (vx, vb - 74), (vx, vb)], fill=hexa('b8604a'))
    c.d.rectangle([vx - 26, vb - 76, vx + 26, vb - 72], fill=hexa('ff7a3a'))
    for (dx, dy, r) in ((-6, -88, 10), (8, -102, 13), (-4, -120, 15), (12, -138, 12)):
        c.d.ellipse([vx + dx - r, vb + dy - r, vx + dx + r, vb + dy + r], fill=hexa('c8c0c4'))
        c.d.ellipse([vx + dx - r + 2, vb + dy - r, vx + dx + r - 4, vb + dy], fill=hexa('e8e2e4'))
    for k in range(5):                                                               # a lava escorrendo
        x = vx - 18 + k * 9
        c.d.line([(x, vb - 72), (x + (k - 2) * 6, vb - 40 + k * 4)], fill=hexa('ff5a2a'))
    c.agua(HORIZONTE, 150, [hexa('4e9ad8'), hexa('3e88c8'), hexa('3274b4')])
    c.d.rectangle([0, 150, W, H], fill=hexa('6a5550'))                               # a areia escura
    c.pintas((0, 152, W, H), [hexa('5a4642'), hexa('7e6862'), hexa('8e7468')], 300, tam=(1, 3))
    # o laboratório
    lx, lb = 40, 176
    c.predio(lx, lb, 92, 40, (hexa('ffffff'), hexa('eef0f4'), hexa('c4c8d2')), hexa('9cc8ec'), 7, 2)
    c.d.rectangle([lx - 3, lb - 44, lx + 95, lb - 40], fill=hexa('c83a3a'))
    c.d.rectangle([lx + 38, lb - 16, lx + 54, lb], fill=hexa('7a8296'))
    c.casa(160, 182, 34, 22, (hexa('fff4ec'), hexa('f0e0d4'), hexa('cfb8a8')), (hexa('f07a5a'), hexa('d04a34'), hexa('a03224')))
    for (x, h) in ((340, 60), (300, 48)):
        c.palmeira(x, 200, h, (hexa('7cd06a'), hexa('4fa84e'), hexa('2f7a3c')))
    return c


CIDADES = {'pallet': pallet, 'viridian': viridian, 'pewter': pewter, 'cerulean': cerulean,
           'vermilion': vermilion, 'lavender': lavender, 'celadon': celadon, 'fuchsia': fuchsia,
           'saffron': saffron, 'cinnabar': cinnabar}


def main():
    feitos = {}
    for nome, fn in CIDADES.items():
        im = fn().imagem()
        caminho = os.path.join(SAIDA, nome + '.png')
        im.save(caminho, optimize=True)
        feitos[nome] = im
    print(f'{len(feitos)} cidades em {os.path.relpath(SAIDA, RAIZ)}/')
    if '--folha' in sys.argv:
        destino = sys.argv[sys.argv.index('--folha') + 1]
        w, h = 376, 250
        folha = Image.new('RGB', (2 * (w + 6) + 6, 5 * (h + 6) + 6), (24, 24, 30))
        for i, im in enumerate(feitos.values()):
            folha.paste(im.convert('RGB').resize((w, h), Image.NEAREST), (6 + (i % 2) * (w + 6), 6 + (i // 2) * (h + 6)))
        folha.save(destino)
        print('folha:', destino)


if __name__ == '__main__':
    main()
