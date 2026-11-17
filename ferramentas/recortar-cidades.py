#!/usr/bin/env python3
"""Os fundos das cidades: o mapa de cada uma nos jogos, recortado em volta do marco.

Antes eram panoramas desenhados aqui (o desenhar-cidades.py, que saiu), e
quem joga pediu os dos jogos, e dos de DS, que são mais bonitos. São os
mapas inteiros de HeartGold/SoulSilver que o PokéWiki monta (um arquivo
por cidade, sem ninguém andando por cima), e o de Cinnabar é o de
FireRed/LeafGreen, do Pokéarth do Serebii: a Cinnabar de HeartGold/
SoulSilver é a ilha depois da erupção, sem o laboratório e sem o ginásio
que a história ainda tem.

Uso (os arquivos ficam numa pasta à parte, com o nome da cidade):

    mkdir pasta && cd pasta
    curl -o pallet.png https://www.pokewiki.de/images/d/d7/HGSS_Alabastia.png
    ... (um por cidade, endereços em ORIGEM)
    python3 -I ferramentas/recortar-cidades.py pasta

Sai em sprites_nds/arenas/<cidade>.png, 768x512, com 256 cores (a conta
de cor do recorte não muda nada à vista e o arquivo cai pela metade: o
artefato publicado tem teto de 16 MB). Mapa pequeno (Pallet, Lavender,
Cinnabar) é recortado em 384x256 e dobrado pixel a pixel; o resto vai
no tamanho do jogo. Mudou um recorte, confere o foco da placa
(FOCO_DO_CENARIO, em js/data/arenas.js): é a altura do marco no recorte.
"""
import os
import sys

from PIL import Image

ORIGEM = {
    'pallet':   'https://www.pokewiki.de/images/d/d7/HGSS_Alabastia.png',
    'viridian': 'https://www.pokewiki.de/images/1/12/HGSS_Vertania_City.png',
    'pewter':   'https://www.pokewiki.de/images/d/d9/HGSS_Marmoria_City.png',
    'cerulean': 'https://www.pokewiki.de/images/8/8a/HGSS_Azuria_City.png',
    'vermilion':'https://www.pokewiki.de/images/b/b7/HGSS_Orania_City.png',
    'lavender': 'https://www.pokewiki.de/images/0/0d/HGSS_Lavandia.png',
    'celadon':  'https://www.pokewiki.de/images/f/f3/HGSS_Prismania_City.png',
    'saffron':  'https://www.pokewiki.de/images/5/57/HGSS_Saffronia_City.png',
    'fuchsia':  'https://www.pokewiki.de/images/2/2b/HGSS_Fuchsania_City.png',
    'cinnabar': 'https://www.serebii.net/pokearth/maps/kanto-frlg/38.png',
}

# x, y, largura, altura (no mapa) e quantas vezes dobra. O marco de cada
# uma: as duas casas e o laboratório; o ginásio e a loja; o museu e o
# ginásio; o ginásio e o Centro na beira do rio; o porto com os barcos e
# o terminal; a torre; a loja de departamento e o cassino; a Silph; o
# ginásio, o Centro e os cercados do Safári; o laboratório e o ginásio.
RECORTE = {
    'pallet':   (24, 30, 384, 256, 2),
    'viridian': (336, 110, 768, 512, 1),
    'pewter':   (70, 0, 768, 512, 1),
    'cerulean': (130, 60, 768, 512, 1),
    'vermilion':(60, 300, 768, 512, 1),
    'lavender': (20, 0, 384, 256, 2),
    'celadon':  (180, 90, 768, 512, 1),
    'saffron':  (166, 80, 768, 512, 1),
    'fuchsia':  (60, 110, 768, 512, 1),
    'cinnabar': (0, 0, 384, 256, 2),
}

SAIDA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sprites_nds', 'arenas')


def recortar(pasta):
    faltam = [c for c in RECORTE if not os.path.isfile(os.path.join(pasta, c + '.png'))]
    if faltam:
        sys.exit('faltam na pasta: ' + ', '.join(f + '.png' for f in faltam))
    for cidade, (x, y, w, h, k) in RECORTE.items():
        im = Image.open(os.path.join(pasta, cidade + '.png')).convert('RGB')
        if x + w > im.size[0] or y + h > im.size[1]:
            sys.exit(f'{cidade}: o recorte passa da borda do mapa ({im.size[0]}x{im.size[1]})')
        im = im.crop((x, y, x + w, y + h))
        if k != 1:
            im = im.resize((w * k, h * k), Image.NEAREST)
        im = im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        destino = os.path.join(SAIDA, cidade + '.png')
        im.save(destino, optimize=True)
        print(f'{cidade}: {im.size[0]}x{im.size[1]}, {os.path.getsize(destino) // 1024} KB')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    recortar(sys.argv[1])
