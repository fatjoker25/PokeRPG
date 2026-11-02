#!/usr/bin/env python3
"""fotos-do-jogador — a foto do cartão com cor de cabelo, pele e roupa.

Escolhido o corpo, quem joga troca a cor do cabelo, da pele e da roupa,
e o desenho continua sendo o do artista: só a paleta muda. Pra isso
cada foto de sprites_nds/npcs/jogador/ vira um PNG de paleta em que
cada cor de cabelo, de pele e de roupa tem a sua casa, separada da
mesma cor usada noutro lugar (o preto do cabelo não é o preto do
sapato). O jogo troca só essas casas, no próprio PNG (FotoJogador, em
js/ui/foto-jogador.js): sem canvas, que em file:// suja e não deixa
ler a imagem, e sem redesenhar pixel nenhum.

GRUPOS diz, por foto, quais cores (na ordem de `ordem_das_cores`) são
cabelo, pele e roupa, e onde: `<parte>_onde` 'cabeca' ou 'corpo' corta
na altura `corte` da figura (0,30 se não diz), e `<parte>_caixa`
[x0, y0, x1, y1] fecha num retângulo. Foram anotados à mão, cor por
cor, numa folha que isola cada cor no lugar dela, e conferidos com
cabelo rosa, roupa verde e pele clara e escura nas 48 fotos. A cor em
duas partes é decidida pelo lugar (a da mochileira é cabelo em cima e
bermuda embaixo); se as duas regiões se cruzam, ganha a primeira de
PARTES. Cor que está na lista e não aparece no lugar dela (a sombra do
boné, quando a roupa é só do corpo) não ganha casa, mas conta na escala
do escuro ao claro, como contou quando a foto foi conferida. `n` é
quantas cores a foto tem: se o arquivo mudar, o número muda e o
gerador para, porque os índices deixam de valer.

A cor que a foto tem como veio (a que vai na descrição de quem não
troca) sai da mais perto entre as de CORES_DA_FOTO; `nome_<parte>`
escolhe à mão quando o olho discorda da conta (o cabelo da gótica é
azul-violeta na conta e roxo pra quem olha).

As cores novas (CORES_DA_FOTO), a peça de roupa (PECA_DO_RETRATO) e o
que vai na cabeça de quem não tem cabelo à mostra (CABECA_DO_RETRATO)
moram em js/data/inscricao.js, e o gerador lê de lá: é ele que diz
qual daquelas é a cor de cada foto como ela veio.

Uso: python3 ferramentas/fotos-do-jogador.py                (gera js/data/fotos-jogador.js)
     python3 ferramentas/fotos-do-jogador.py --folha f.png  (e a folha pra conferir no olho)
"""
import base64, colorsys, io, json, os, struct, subprocess, sys, zlib
from PIL import Image, ImageDraw

RAIZ = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
PASTA = os.path.join(RAIZ, 'sprites_nds', 'npcs', 'jogador')
INSCRICAO = os.path.join(RAIZ, 'js', 'data', 'inscricao.js')
SAIDA = os.path.join(RAIZ, 'js', 'data', 'fotos-jogador.js')
PARTES = ('cabelo', 'roupa', 'pele')

GRUPOS = {
    'viajante': {'n': 29, 'cabelo': [12], 'pele': [13, 14, 15], 'roupa': [18, 20, 23]},
    'urbano': {'n': 14, 'pele': [6, 7, 8, 9], 'roupa': [12, 1, 2], 'roupa_onde': 'corpo'},
    'patinador': {'n': 16, 'pele': [7, 8, 10, 11], 'roupa': [12, 13, 14]},
    'colecionador': {'n': 34, 'cabelo': [16, 19, 20, 21], 'pele': [9, 10, 11, 12, 13, 15], 'roupa': [22, 23, 24]},
    'terno': {'n': 19, 'cabelo': [12, 13], 'pele': [7, 8, 9, 10], 'roupa': [1, 2]},
    'trilheiro': {'n': 14, 'cabelo': [9, 10, 11], 'pele': [5, 7, 8], 'roupa': [2, 4, 6], 'cabelo_onde': 'cabeca'},
    'roqueiro': {'n': 17, 'cabelo': [7, 11, 12], 'pele': [6, 8, 9, 10], 'roupa': [2, 3, 4], 'cabelo_onde': 'cabeca'},
    'chamativo': {'n': 21, 'cabelo': [17, 18], 'pele': [8, 10, 11, 12], 'roupa': [16, 19, 20]},
    'lutador': {'n': 22, 'cabelo': [2, 3], 'pele': [11, 12, 14, 16], 'roupa': [4, 5, 6, 7, 8, 9], 'cabelo_onde': 'cabeca'},
    'mistico': {'n': 15, 'cabelo': [1, 8], 'pele': [3, 4, 5, 6], 'roupa': [9, 10, 11], 'cabelo_onde': 'cabeca'},
    'piloto': {'n': 17, 'cabelo': [1, 3], 'pele': [8, 9, 10, 11], 'roupa': [12, 13, 14], 'cabelo_caixa': [33, 0, 58, 20]},
    'naturalista': {'n': 25, 'cabelo': [2], 'pele': [9, 11, 24], 'roupa': [18, 20, 21], 'cabelo_onde': 'cabeca'},
    'durao': {'n': 27, 'cabelo': [9, 15, 16, 17, 18], 'pele': [10, 11, 12, 13, 14], 'roupa': [24, 25], 'cabelo_onde': 'cabeca'},
    'criador': {'n': 22, 'pele': [9, 10, 11, 12, 14], 'roupa': [3, 4, 6, 17]},
    'corredor': {'n': 21, 'cabelo': [7, 8, 10], 'pele': [11, 12, 14, 20], 'roupa': [16, 17, 18]},
    'ciclista': {'n': 15, 'pele': [7, 8, 9, 14], 'roupa': [5, 6]},
    'esportivo': {'n': 21, 'pele': [13, 15, 17, 20], 'roupa': [1, 2, 3], 'roupa_onde': 'corpo'},
    'surfista': {'n': 22, 'cabelo': [1, 2], 'pele': [7, 8, 9], 'roupa': [18, 19], 'cabelo_onde': 'cabeca'},
    'artesao': {'n': 22, 'cabelo': [6], 'pele': [14, 16, 18, 21], 'roupa': [2, 3, 19], 'cabelo_onde': 'cabeca'},
    'prateado': {'n': 19, 'cabelo': [2, 5, 14], 'pele': [8, 9, 10, 15], 'roupa': [16, 17, 18], 'cabelo_onde': 'cabeca'},
    'violeiro': {'n': 24, 'pele': [20, 21, 22], 'roupa': [15, 16, 17]},
    'explorador': {'n': 15, 'pele': [6, 7, 10, 11], 'roupa': [4, 5, 9]},
    'cinegrafista': {'n': 22, 'pele': [11, 12, 13, 14, 19], 'roupa': [4, 6, 21]},
    'lavrador': {'n': 26, 'cabelo': [20, 21], 'pele': [11, 12, 13, 14, 15, 24], 'roupa': [6, 7, 8, 25]},
    'aventureira': {'n': 23, 'cabelo': [19, 21, 22], 'pele': [6, 7, 8, 9, 10, 11, 12], 'roupa': [13, 14, 15, 16, 17], 'cabelo_onde': 'cabeca'},
    'animada': {'n': 15, 'cabelo': [6, 7], 'pele': [8, 9, 10, 14], 'roupa': [11, 12, 13], 'cabelo_onde': 'cabeca', 'corte': 0.45},
    'urbana': {'n': 24, 'cabelo': [9, 10, 11, 23], 'pele': [6, 7, 8, 20, 21, 22], 'roupa': [12, 13, 14, 15], 'cabelo_onde': 'cabeca'},
    'atleta': {'n': 24, 'cabelo': [7, 19, 22], 'pele': [10, 11, 12, 13, 14], 'roupa': [2, 3, 4, 6], 'cabelo_onde': 'cabeca', 'roupa_onde': 'corpo', 'nome_cabelo': 'rosa'},
    'estudante': {'n': 23, 'cabelo': [8, 9, 12, 14], 'pele': [10, 11, 13, 18], 'roupa': [19, 20, 21, 22], 'cabelo_onde': 'cabeca', 'corte': 0.5},
    'elegante': {'n': 18, 'cabelo': [7, 8, 12, 13], 'pele': [5, 9, 10, 11, 17], 'roupa': [1, 2]},
    'trilheira': {'n': 14, 'cabelo': [9, 10, 11], 'pele': [5, 7, 8], 'roupa': [2, 4, 6], 'cabelo_onde': 'cabeca', 'corte': 0.45},
    'punk': {'n': 22, 'cabelo': [16, 18, 19, 20], 'pele': [8, 10, 12, 14], 'roupa': [11, 13, 21]},
    'gotica': {'n': 22, 'cabelo': [14, 15, 16], 'pele': [11, 12, 13], 'roupa': [4, 5, 6], 'cabelo_onde': 'cabeca', 'corte': 0.55, 'nome_cabelo': 'roxo'},
    'lutadora': {'n': 17, 'cabelo': [1, 2, 9], 'pele': [5, 6, 7, 8, 15], 'roupa': [10, 11, 12]},
    'dancarina': {'n': 23, 'cabelo': [15, 17, 18, 19], 'pele': [8, 9, 10, 11, 16], 'roupa': [20, 21, 22]},
    'modelo': {'n': 17, 'cabelo': [1, 2], 'pele': [7, 8, 9, 10], 'roupa': [15, 16], 'cabelo_onde': 'cabeca'},
    'artista': {'n': 23, 'cabelo': [9, 11, 12], 'pele': [8, 10, 14], 'roupa': [1, 2], 'cabelo_onde': 'cabeca', 'roupa_onde': 'corpo'},
    'aviadora': {'n': 19, 'pele': [7, 8, 9, 10], 'roupa': [14, 15, 16]},
    'patinadora': {'n': 15, 'pele': [9, 10, 11, 14], 'roupa': [1, 2, 3], 'roupa_onde': 'corpo'},
    'ciclista_f': {'n': 15, 'cabelo': [7, 9], 'pele': [8, 10, 11, 14], 'roupa': [5, 6], 'cabelo_onde': 'cabeca'},
    'mochileira': {'n': 15, 'cabelo': [10, 11], 'pele': [7, 8, 9, 14], 'roupa': [6, 11], 'cabelo_caixa': [38, 0, 60, 26], 'roupa_caixa': [28, 38, 46, 66]},
    'despojada': {'n': 22, 'cabelo': [1, 2], 'pele': [7, 10, 11], 'roupa': [12, 13, 14, 15], 'cabelo_onde': 'cabeca'},
    'esportiva': {'n': 17, 'cabelo': [6, 7, 8], 'pele': [9, 11, 12, 16], 'roupa': [13, 14, 15]},
    'descolada': {'n': 26, 'cabelo': [4, 12], 'pele': [11, 15, 17, 25], 'roupa': [19, 20, 21, 22, 23], 'cabelo_onde': 'cabeca'},
    'fazendeira': {'n': 15, 'cabelo': [9], 'pele': [7, 8, 10, 14], 'roupa': [11, 12, 13], 'cabelo_caixa': [0, 0, 80, 44]},
    'cantora': {'n': 15, 'cabelo': [3, 4, 5], 'pele': [6, 8, 9, 12], 'roupa': [13, 14], 'cabelo_onde': 'cabeca'},
    'vidente': {'n': 15, 'cabelo': [2, 3, 11], 'pele': [7, 8, 9, 14], 'roupa': [4, 13], 'cabelo_onde': 'cabeca'},
    'guitarrista': {'n': 15, 'cabelo': [2, 3], 'pele': [7, 8, 9, 10], 'roupa': [6, 13, 14], 'cabelo_caixa': [10, 0, 37, 30]},
}


def hls(c):
    r, g, b = (v / 255 for v in c[:3])
    return colorsys.rgb_to_hls(r, g, b)


def hexa(c):
    return '#%02x%02x%02x' % tuple(c[:3])


def pixels(im):
    return im.get_flattened_data() if hasattr(im, 'get_flattened_data') else im.getdata()


def ordem_das_cores(im):
    """as cores opacas da foto, numa ordem que não depende de nada além
    delas: pela matiz em doze fatias (o que é quase cinza vai antes) e,
    dentro da fatia, do escuro ao claro"""
    tot = {}
    for p in pixels(im):
        if p[3]:
            tot[p[:3]] = tot.get(p[:3], 0) + 1
    lista = sorted(tot, key=lambda c: (round(hls(c)[0] * 12) if hls(c)[2] >= .14 else -1, hls(c)[1]))
    return lista, tot


def na_regiao(g, parte, x, y, corte_y):
    onde = g.get(parte + '_onde')
    cx = g.get(parte + '_caixa')
    if onde == 'cabeca' and y >= corte_y:
        return False
    if onde == 'corpo' and y < corte_y:
        return False
    if cx and not (cx[0] <= x < cx[2] and cx[1] <= y < cx[3]):
        return False
    return True


def rampa(alvo, t):
    """a cor nova no ponto t (0 o escuro, 1 o claro) da escala do alvo —
    a mesma conta do FotoJogador.rgb, no jogo"""
    lo, hi = alvo['l']
    r, g, b = colorsys.hls_to_rgb(alvo['h'] / 360, lo + (hi - lo) * t, alvo['s'])
    return (round(r * 255), round(g * 255), round(b * 255))


def _lab(c):
    def lin(v):
        v /= 255
        return v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4
    r, g, b = (lin(v) for v in c[:3])
    x = (r * .4124 + g * .3576 + b * .1805) / .95047
    y = r * .2126 + g * .7152 + b * .0722
    z = (r * .0193 + g * .1192 + b * .9505) / 1.08883
    f = lambda t: t ** (1 / 3) if t > .008856 else 7.787 * t + 16 / 116
    fx, fy, fz = f(x), f(y), f(z)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))


def _de(a, b):
    return sum((p - q) ** 2 for p, q in zip(_lab(a), _lab(b))) ** .5


def cor_mais_perto(alvos, contagem):
    """qual das cores da lista é a desta parte da foto: a de menor
    distância somada, pixel por pixel, a qualquer ponto da escala dela"""
    def custo(alvo):
        pontos = [rampa(alvo, t / 10) for t in range(11)]
        return sum(n * min(_de(c, p) for p in pontos) for c, n in contagem.items())
    return min(alvos, key=custo)['id']


def ler_inscricao():
    """as listas de js/data/inscricao.js, pela mão do node"""
    js = ("const vm=require('vm'),fs=require('fs');const c={};vm.createContext(c);"
          "vm.runInContext(fs.readFileSync(process.argv[1],'utf8')+"
          "';this.X={cores:CORES_DA_FOTO,peca:PECA_DO_RETRATO,cabeca:CABECA_DO_RETRATO,fotos:RETRATOS_DA_FICHA};',c);"
          "process.stdout.write(JSON.stringify(c.X))")
    saida = subprocess.run(['node', '-e', js, INSCRICAO], capture_output=True, text=True, check=True)
    return json.loads(saida.stdout)


def chunks(dados):
    p = 8
    while p < len(dados):
        n = struct.unpack('>I', dados[p:p + 4])[0]
        yield dados[p + 4:p + 8], p, n
        p += 12 + n


def trocar_paleta(dados, trocas):
    """o que o jogo faz: escreve as cores novas nas casas da paleta e
    refaz o CRC do PLTE. trocas: {casa: (r, g, b)}"""
    b = bytearray(dados)
    for tipo, p, n in chunks(dados):
        if tipo == b'PLTE':
            for i, c in trocas.items():
                b[p + 8 + i * 3:p + 11 + i * 3] = bytes(c)
            crc = zlib.crc32(bytes(b[p + 4:p + 8 + n])) & 0xffffffff
            b[p + 8 + n:p + 12 + n] = struct.pack('>I', crc)
            return bytes(b)
    raise ValueError('PNG sem PLTE')


def montar(nome, info):
    g = GRUPOS[nome]
    im = Image.open(os.path.join(PASTA, nome + '.png')).convert('RGBA')
    W, H = im.size
    px = im.load()
    alfas = {p[3] for p in pixels(im)}
    if not alfas <= {0, 255}:
        sys.exit(f'{nome}: transparência pela metade ({sorted(alfas)[:6]}…): a paleta só sabe ligado e desligado')
    lista, _ = ordem_das_cores(im)
    if len(lista) != g['n']:
        sys.exit(f'{nome}: a foto tem {len(lista)} cores e os grupos foram anotados com {g["n"]} — o arquivo mudou, anote de novo')
    bb = im.getchannel('A').getbbox()
    corte_y = bb[1] + (bb[3] - bb[1]) * g.get('corte', .30)
    cores_da = {p: [lista[i] for i in g.get(p) or []] for p in PARTES}

    # cada pixel: transparente, ou (parte, cor) — parte None é a cor que fica
    chave_px, contagem = [], {}
    for y in range(H):
        for x in range(W):
            p = px[x, y]
            if not p[3]:
                chave_px.append(None)
                continue
            c = p[:3]
            k = (None, c)
            for parte in PARTES:
                if c in cores_da[parte] and na_regiao(g, parte, x, y, corte_y):
                    k = (parte, c)
                    break
            chave_px.append(k)
            contagem[k] = contagem.get(k, 0) + 1

    # a paleta: 0 é o transparente; depois o que fica, e as três partes
    pos = {c: i for i, c in enumerate(lista)}
    ordem = sorted(contagem, key=lambda k: ((PARTES.index(k[0]) + 1) if k[0] else 0, pos[k[1]]))
    casa = {k: i + 1 for i, k in enumerate(ordem)}
    if len(ordem) + 1 > 256:
        sys.exit(f'{nome}: {len(ordem) + 1} casas de paleta, o PNG aceita 256')
    out = Image.new('P', (W, H))
    out.putpalette([0, 0, 0] + [v for k in ordem for v in k[1]])
    out.putdata([0 if k is None else casa[k] for k in chave_px])
    buf = io.BytesIO()
    out.save(buf, 'PNG', transparency=0, optimize=True)
    dados = buf.getvalue()

    # volta igual ao original, pixel por pixel
    volta = Image.open(io.BytesIO(dados)).convert('RGBA')
    for i, (a, b) in enumerate(zip(pixels(volta), pixels(im))):
        if (b[3] == 0 and a[3] != 0) or (b[3] and a != b):
            sys.exit(f'{nome}: o PNG de paleta não volta igual no pixel {i % W},{i // W}: {a} ≠ {b}')
    # e a casa de cada cor tem a cor que tem
    plte = next(dados[p + 8:p + 8 + n] for t, p, n in chunks(dados) if t == b'PLTE')
    for k, i in casa.items():
        if tuple(plte[i * 3:i * 3 + 3]) != k[1]:
            sys.exit(f'{nome}: a casa {i} da paleta saiu {tuple(plte[i * 3:i * 3 + 3])}, esperava {k[1]}')

    registro = {'png': base64.b64encode(dados).decode('ascii')}
    for parte in PARTES:
        cores = cores_da[parte]
        if not cores:
            continue
        ls = [hls(c)[1] for c in cores]
        lo, hi = min(ls), max(ls)
        casas, na_parte = [], {}
        for c, l in zip(cores, ls):
            k = (parte, c)
            if k not in casa:
                continue
            t = .5 if hi - lo < 1e-6 else (l - lo) / (hi - lo)
            casas.append([casa[k], round(t, 3)])
            na_parte[c] = contagem[k]
        if not casas:
            sys.exit(f'{nome}: o {parte} não tem pixel nenhum no lugar dele')
        mais = max(na_parte, key=na_parte.get)
        cor = g.get('nome_' + parte) or cor_mais_perto(info['cores'][parte], na_parte)
        if not any(a['id'] == cor for a in info['cores'][parte]):
            sys.exit(f'{nome}: nome_{parte} "{cor}" não está em CORES_DA_FOTO.{parte}')
        registro[parte] = {'i': casas, 'cor': cor, 'de': hexa(mais)}
    return registro, dados


def conferir_listas(info):
    fotos = info['fotos']['Homem'] + info['fotos']['Mulher']
    arquivos = sorted(f[:-4] for f in os.listdir(PASTA) if f.endswith('.png'))
    erros = []
    if sorted(fotos) != sorted(GRUPOS):
        erros.append(f'RETRATOS_DA_FICHA e GRUPOS não batem: {sorted(set(fotos) ^ set(GRUPOS))}')
    if sorted(GRUPOS) != arquivos:
        erros.append(f'GRUPOS e a pasta não batem: {sorted(set(arquivos) ^ set(GRUPOS))}')
    sem_cabelo = sorted(n for n, g in GRUPOS.items() if not g.get('cabelo'))
    if sem_cabelo != sorted(info['cabeca']):
        erros.append(f'CABECA_DO_RETRATO tem que ser as fotos sem cabelo: {sorted(set(sem_cabelo) ^ set(info["cabeca"]))}')
    falta_peca = sorted(set(GRUPOS) - set(info['peca']))
    if falta_peca:
        erros.append(f'PECA_DO_RETRATO não diz a roupa de: {falta_peca}')
    for n, g in GRUPOS.items():
        for p in ('pele', 'roupa'):
            if not g.get(p):
                erros.append(f'{n} sem {p}')
    if erros:
        sys.exit('\n'.join(erros))


TESTES_DA_FOLHA = [
    None,
    {'cabelo': 'rosa', 'roupa': 'verde'},
    {'cabelo': 'preto', 'pele': 'escura', 'roupa': 'branco'},
    {'cabelo': 'loiro', 'pele': 'muito-clara', 'roupa': 'vermelho'},
    {'cabelo': 'ruivo', 'pele': 'morena', 'roupa': 'azul-marinho'},
    {'cabelo': 'prateado', 'pele': 'morena-clara', 'roupa': 'amarelo'},
]


def recolorir(dados, registro, escolha, info):
    trocas = {}
    for parte, id_ in escolha.items():
        if parte not in registro:
            continue
        alvo = next(a for a in info['cores'][parte] if a['id'] == id_)
        for i, t in registro[parte]['i']:
            trocas[i] = rampa(alvo, t)
    return Image.open(io.BytesIO(trocar_paleta(dados, trocas))).convert('RGBA')


def nome_da_cor(info, parte, id_, fem):
    a = next(a for a in info['cores'][parte] if a['id'] == id_)
    return a['nome'][1 if fem else 0] if isinstance(a['nome'], list) else a['nome']


def folha(saida, feitos, info):
    Q, W = 2, 160
    nomes = list(feitos)
    out = Image.new('RGB', (W * len(TESTES_DA_FOLHA), (W + 26) * len(nomes)), (38, 42, 60))
    d = ImageDraw.Draw(out)
    for i, n in enumerate(nomes):
        registro, dados = feitos[n]
        y0 = i * (W + 26)
        for j, t in enumerate(TESTES_DA_FOLHA):
            v = Image.open(io.BytesIO(dados)).convert('RGBA') if t is None else recolorir(dados, registro, t, info)
            v = v.resize((W, W), Image.NEAREST)
            out.paste(v, (j * W, y0 + 24), v)
        peca, gen = info['peca'][n]
        cab = f"cabelo {nome_da_cor(info, 'cabelo', registro['cabelo']['cor'], False)}" if 'cabelo' in registro else info['cabeca'][n]
        rou = f"{peca} {nome_da_cor(info, 'roupa', registro['roupa']['cor'], gen == 'f')}"
        d.text((3, y0 + 2), f'{n}: {cab}, {rou}', fill=(255, 230, 120))
        d.text((3, y0 + 12), f"pele de {registro['pele']['de']} ~ {registro['pele']['cor']}", fill=(170, 180, 210))
    out.save(saida)


def main():
    info = ler_inscricao()
    conferir_listas(info)
    feitos = {}
    for n in info['fotos']['Homem'] + info['fotos']['Mulher']:
        feitos[n] = montar(n, info)
    linhas = []
    for n, (registro, _) in feitos.items():
        linhas.append(f'{json.dumps(n)}:{json.dumps(registro, separators=(",", ":"), ensure_ascii=False)}')
    js = ('/* ============================================================\n'
          '   gerado por ferramentas/fotos-do-jogador.py — não editar à mão.\n'
          '   As fotos do jogador em PNG de paleta, com casa própria pra cada\n'
          '   cor de cabelo, pele e roupa. Em cada parte, i lista [casa, t]:\n'
          '   a casa da paleta e onde aquela cor fica do escuro (0) ao claro\n'
          '   (1); cor é a cor de CORES_DA_FOTO que o desenho tem, de é a\n'
          '   amostra dela. Foto sem cabelo não tem a parte.\n'
          '   ============================================================ */\n'
          'const FOTOS_DO_JOGADOR = {\n' + ',\n'.join(linhas) + '\n};\n')
    with open(SAIDA, 'w', encoding='utf-8') as f:
        f.write(js)
    print(f'{len(feitos)} fotos em {os.path.relpath(SAIDA, RAIZ)} ({len(js) // 1024} KB)')
    if '--folha' in sys.argv:
        caminho = sys.argv[sys.argv.index('--folha') + 1]
        folha(caminho, feitos, info)
        print('folha em', caminho)


if __name__ == '__main__':
    main()
