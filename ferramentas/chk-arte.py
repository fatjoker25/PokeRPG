#!/usr/bin/env python3
"""chk-arte — a arte animada de cada espécie tem que ser a mesma da parada.

As GIFs de Black/White (battle/*_ani*) vieram da PokeAPI, e a PokeAPI
tem arquivo trocado: o Rattata animado de costas (back/19.gif) é o de
Alola, preto, e o jogo mostrava o seu Rattata de Alola na luta sem
ninguém ver. A troca é calada (a <img> carrega, só que com outro
Pokémon), então a conferência é pela cor: o primeiro quadro de cada GIF
contra a arte parada da mesma vista (battle/*_full*), num histograma
grosso de cor. Forma regional, outra espécie ou brilhante no lugar do
normal ficam bem abaixo do limite; a mesma arte em outra pose, bem acima.

Uso:  python3 ferramentas/chk-arte.py
Precisa de Pillow (o mesmo dos geradores de rosto).
"""
import os
import sys

from PIL import Image

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BASE = os.path.join(RAIZ, 'sprites_nds', 'battle')
LIMITE = 0.35   # a pior arte certa (o Koffing, com o gás da animação) dá 0,49; o Rattata de Alola deu 0,16


def histograma(im):
    """fração de cada cor (4 níveis por canal) nos pixels que aparecem"""
    im = im.convert('RGBA').resize((48, 48), Image.NEAREST)
    h, n = {}, 0
    for r, g, b, a in im.getdata():
        if a <= 128:
            continue
        k = (r // 64, g // 64, b // 64)
        h[k] = h.get(k, 0) + 1
        n += 1
    return {k: v / n for k, v in h.items()} if n else {}


def parecido(a, b):
    return sum(min(a.get(k, 0), b.get(k, 0)) for k in set(a) | set(b))


def main():
    falhas, conferidas = [], 0
    for n in range(1, 252):
        for vista in ('front', 'back'):
            for brilho in ('', '_shiny'):
                ani = os.path.join(BASE, f'{vista}_ani{brilho}', f'{n}.gif')
                parada = os.path.join(BASE, f'{vista}_full{brilho}', f'{n}.png')
                if not (os.path.exists(ani) and os.path.exists(parada)):
                    continue   # arquivo que falta é com o chk-sprites
                gif = Image.open(ani)
                gif.seek(0)
                s = parecido(histograma(gif), histograma(Image.open(parada)))
                conferidas += 1
                if s < LIMITE:
                    falhas.append(f'{vista}_ani{brilho}/{n}.gif não parece a {vista}_full{brilho}/{n}.png '
                                  f'(cor em comum {s:.2f}, limite {LIMITE}): forma ou espécie trocada?')
    if falhas:
        print('FALHAS:')
        for f in falhas:
            print(' -', f)
        sys.exit(1)
    print(f'arte: {conferidas} animações com a mesma cara da arte parada.')


if __name__ == '__main__':
    main()
