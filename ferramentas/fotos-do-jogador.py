#!/usr/bin/env python3
"""fotos-do-jogador — a foto do cartão, parte por parte, na cor que você quer.

Escolhido o corpo, quem joga troca a cor do cabelo, dos olhos, da pele,
da camisa, da calça, dos sapatos e dos detalhes (boné, cinto, faixa…),
e o desenho continua sendo o do artista: só a paleta muda. Pra isso
cada foto de sprites_nds/npcs/jogador/ vira um PNG de paleta em que
cada cor de cada parte tem a sua casa, separada da mesma cor usada
noutro lugar (o marrom do cabelo não é o marrom da bota). O jogo troca
só essas casas, no próprio PNG (FotoJogador, em js/ui/foto-jogador.js):
sem canvas, que em file:// suja e não deixa ler a imagem, e sem
redesenhar pixel nenhum.

Onde fica cada parte foi anotado à mão, pixel a pixel, em
ferramentas/fotos-partes.py (o formato está lá). A cor nova é uma escala
(matiz, saturação, do escuro ao claro), e cada cor da parte cai no ponto
dela, pela claridade, entre a mais escura e a mais clara da parte: a
sombra e o brilho ficam onde o artista pôs. Parte de uma cor só (a
pupila preta, quase sempre) cai no meio da escala.

A cor que a foto tem como veio (a que vai na descrição de quem não
troca) sai da mais perto entre as de CORES_DA_FOTO; NOME_A_MAO escolhe
quando o olho discorda da conta (o cabelo da gótica é azul-violeta na
conta e roxo pra quem olha).

As cores (CORES_DA_FOTO), as peças (PECAS_DO_RETRATO) e o porquê da
parte que a foto não tem (SEM_PARTE_DO_RETRATO) moram em
js/data/inscricao.js, e o gerador lê de lá e confere que batem com a
anotação.

Uso: python3 ferramentas/fotos-do-jogador.py                (gera js/data/fotos-jogador.js)
     python3 ferramentas/fotos-do-jogador.py --folha f.png  (e a folha pra conferir no olho)
"""
import base64, colorsys, importlib.util, io, json, os, struct, subprocess, sys, zlib
from PIL import Image, ImageDraw

RAIZ = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
PASTA = os.path.join(RAIZ, 'sprites_nds', 'npcs', 'jogador')
INSCRICAO = os.path.join(RAIZ, 'js', 'data', 'inscricao.js')
SAIDA = os.path.join(RAIZ, 'js', 'data', 'fotos-jogador.js')
PARTES = ('cabelo', 'olhos', 'pele', 'camisa', 'calca', 'sapatos', 'detalhes')
ROUPA = ('camisa', 'calca', 'sapatos', 'detalhes')
# parte sem aba: a mochila que a pessoa carrega sai na cor da mochila da
# inscrição (CORES_MOCHILA), não numa cor de CORES_DA_FOTO
EXTRAS = ('mochila',)
TODAS = PARTES + EXTRAS

# quando a conta da cor mais perto discorda do olho (a parte de duas cores
# vira cinza na conta: o tênis branco de sola preta, o macacão branco e azul)
NOME_A_MAO = {
    'viajante': {'calca': 'azul'},                      # o jeans é azul acinzentado
    'urbano': {'camisa': 'preto', 'calca': 'preto'},
    'patinador': {'sapatos': 'preto', 'detalhes': 'branco'},
    'colecionador': {'calca': 'verde-agua', 'sapatos': 'verde-agua'},
    'trilheiro': {'calca': 'marrom'},
    'durao': {'olhos': 'azul-claro'},                   # a pupila preta puxa a íris pro cinza na conta
    'esportivo': {'olhos': 'azul-claro'},
    'roqueiro': {'sapatos': 'branco'},
    'mistico': {'cabelo': 'verde'},                     # verde quase preto, mas verde
    'piloto': {'camisa': 'branco'},
    'criador': {'detalhes': 'branco'},
    'ciclista': {'calca': 'preto', 'sapatos': 'preto', 'detalhes': 'vermelho'},
    'surfista': {'detalhes': 'azul'},                   # contas de várias cores
    'violeiro': {'camisa': 'azul', 'detalhes': 'marrom'},
    'cinegrafista': {'sapatos': 'vermelho'},
    'aventureira': {'detalhes': 'azul-claro'},
    'animada': {'camisa': 'branco'},
    'atleta': {'cabelo': 'rosa'},
    'estudante': {'calca': 'preto', 'olhos': 'azul'},
    'elegante': {'cabelo': 'loiro', 'camisa': 'preto', 'calca': 'preto'},
    'gotica': {'cabelo': 'roxo', 'camisa': 'roxo', 'calca': 'roxo'},   # azul-violeta na conta
    'dancarina': {'detalhes': 'preto'},
    'artista': {'calca': 'preto'},
    'aviadora': {'camisa': 'branco', 'detalhes': 'azul-claro'},
    'patinadora': {'camisa': 'preto', 'calca': 'preto', 'sapatos': 'preto'},
    'ciclista_f': {'calca': 'marrom'},                  # o laranja do brilho e a faixa branca puxam pro bege
    'mochileira': {'cabelo': 'loiro', 'sapatos': 'verde'},
    'despojada': {'calca': 'azul', 'sapatos': 'branco'},
    'esportiva': {'sapatos': 'azul-marinho'},
    'fazendeira': {'cabelo': 'loiro', 'sapatos': 'marrom'},
    'cantora': {'cabelo': 'castanho'},
    'vidente': {'cabelo': 'verde', 'detalhes': 'verde', 'calca': 'roxo'},   # os babados brancos puxam a calça pro cinza
    'guitarrista': {'sapatos': 'vermelho'},             # a meia preta escurece a conta
}


def carregar_partes():
    caminho = os.path.join(RAIZ, 'ferramentas', 'fotos-partes.py')
    spec = importlib.util.spec_from_file_location('fotos_partes', caminho)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m.ANOT


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


def dentro(caixa, x, y):
    return caixa is None or (caixa[0] <= x < caixa[2] and caixa[1] <= y < caixa[3])


def partes_de(a, im, lista):
    """(x, y) -> a parte do pixel, ou None (fica como o desenho tem): o
    pixel anotado primeiro, depois as caixas fixas, depois as partes na
    ordem em que a anotação escreve, e a primeira regra que pega ganha"""
    idx = {c: i for i, c in enumerate(lista)}
    px = im.load()
    ordem = [k for k in a if k in TODAS]
    mapa = {}
    W, H = im.size
    for y in range(H):
        for x in range(W):
            p = px[x, y]
            if not p[3]:
                continue
            if (x, y) in a.get('px', {}):
                mapa[(x, y)] = a['px'][(x, y)]
                continue
            if any(dentro(b, x, y) for b in a.get('fixo', [])):
                mapa[(x, y)] = None
                continue
            ci, achou = idx[p[:3]], None
            for parte in ordem:
                if any(ci in cores and dentro(caixa, x, y) for cores, caixa in a[parte]):
                    achou = parte
                    break
            mapa[(x, y)] = achou
    return mapa


def escala_de_hex(cor):
    """a escala de uma cor da mochila (hexadecimal): a matiz e a saturação
    dela, do escuro ao claro em volta da claridade dela — a mesma conta do
    FotoJogador.escalaDeHex, no jogo"""
    r, g, b = (int(cor[i:i + 2], 16) / 255 for i in (1, 3, 5))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    lim = lambda v, a, z: min(z, max(a, v))
    return {'h': h * 360, 's': s, 'l': [lim(l - .18, .05, .9), lim(l + .16, .1, .96)]}


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
          "';this.X={cores:CORES_DA_FOTO,paleta:PALETA_DA_PARTE,partes:PARTES_DA_FOTO,pecas:PECAS_DO_RETRATO,"
          "sem:SEM_PARTE_DO_RETRATO,fotos:RETRATOS_DA_FICHA};',c);"
          "process.stdout.write(JSON.stringify(c.X))")
    saida = subprocess.run(['node', '-e', js, INSCRICAO], capture_output=True, text=True, check=True)
    info = json.loads(saida.stdout)
    info['de'] = {p: info['cores'][info['paleta'][p]] for p in PARTES}
    return info


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


def montar(nome, a, info):
    im = Image.open(os.path.join(PASTA, nome + '.png')).convert('RGBA')
    W, H = im.size
    px = im.load()
    alfas = {p[3] for p in pixels(im)}
    if not alfas <= {0, 255}:
        sys.exit(f'{nome}: transparência pela metade ({sorted(alfas)[:6]}…): a paleta só sabe ligado e desligado')
    lista, _ = ordem_das_cores(im)
    if len(lista) != a['n']:
        sys.exit(f'{nome}: a foto tem {len(lista)} cores e foi anotada com {a["n"]} — o arquivo mudou, anote de novo')
    for (x, y), v in a.get('px', {}).items():
        if v is not None and v not in TODAS:
            sys.exit(f'{nome}: o pixel {x},{y} foi anotado como "{v}", que não é parte')
    mapa = partes_de(a, im, lista)

    # cada pixel: transparente, ou (parte, cor) — parte None é a cor que fica
    chave_px, contagem = [], {}
    for y in range(H):
        for x in range(W):
            p = px[x, y]
            if not p[3]:
                chave_px.append(None)
                continue
            k = (mapa[(x, y)], p[:3])
            chave_px.append(k)
            contagem[k] = contagem.get(k, 0) + 1

    # a paleta: 0 é o transparente; depois o que fica, e as partes
    pos = {c: i for i, c in enumerate(lista)}
    ordem = sorted(contagem, key=lambda k: ((TODAS.index(k[0]) + 1) if k[0] else 0, pos[k[1]]))
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
    for i, (q, b) in enumerate(zip(pixels(volta), pixels(im))):
        if (b[3] == 0 and q[3] != 0) or (b[3] and q != b):
            sys.exit(f'{nome}: o PNG de paleta não volta igual no pixel {i % W},{i // W}: {q} ≠ {b}')
    # e a casa de cada cor tem a cor que tem
    plte = next(dados[p + 8:p + 8 + n] for t, p, n in chunks(dados) if t == b'PLTE')
    for k, i in casa.items():
        if tuple(plte[i * 3:i * 3 + 3]) != k[1]:
            sys.exit(f'{nome}: a casa {i} da paleta saiu {tuple(plte[i * 3:i * 3 + 3])}, esperava {k[1]}')

    registro = {'png': base64.b64encode(dados).decode('ascii')}
    for parte in TODAS:
        cores = sorted({c for (q, c) in casa if q == parte}, key=lambda c: pos[c])
        if not cores:
            continue
        ls = {c: hls(c)[1] for c in cores}
        lo, hi = min(ls.values()), max(ls.values())
        casas, na_parte = [], {}
        for c in cores:
            t = .5 if hi - lo < 1e-6 else (ls[c] - lo) / (hi - lo)
            casas.append([casa[(parte, c)], round(t, 3)])
            na_parte[c] = contagem[(parte, c)]
        mais = max(na_parte, key=na_parte.get)
        if parte in EXTRAS:
            registro[parte] = {'i': casas, 'de': hexa(mais)}
            continue
        cor = NOME_A_MAO.get(nome, {}).get(parte) or cor_mais_perto(info['de'][parte], na_parte)
        if not any(k['id'] == cor for k in info['de'][parte]):
            sys.exit(f'{nome}: NOME_A_MAO {parte} "{cor}" não está nas cores de {parte}')
        registro[parte] = {'i': casas, 'cor': cor, 'de': hexa(mais)}
    return registro, dados


def conferir_listas(anot, info, feitos):
    fotos = info['fotos']['Homem'] + info['fotos']['Mulher']
    arquivos = sorted(f[:-4] for f in os.listdir(PASTA) if f.endswith('.png'))
    erros = []
    if [p for p, _ in info['partes']] != list(PARTES):
        erros.append(f'PARTES_DA_FOTO ({[p for p, _ in info["partes"]]}) não é {list(PARTES)}')
    if sorted(fotos) != sorted(anot):
        erros.append(f'RETRATOS_DA_FICHA e fotos-partes.py não batem: {sorted(set(fotos) ^ set(anot))}')
    if sorted(anot) != arquivos:
        erros.append(f'fotos-partes.py e a pasta não batem: {sorted(set(arquivos) ^ set(anot))}')
    for n, (registro, _) in feitos.items():
        if 'pele' not in registro:
            erros.append(f'{n}: sem pele')
        pecas, sem = info['pecas'].get(n, {}), info['sem'].get(n, {})
        for p in PARTES:
            tem = p in registro
            if p in ROUPA and tem and p not in pecas:
                erros.append(f'{n}: PECAS_DO_RETRATO não diz o que é a {p}')
            if p in ROUPA and not tem and p in pecas:
                erros.append(f'{n}: PECAS_DO_RETRATO diz a {p}, que a foto não tem')
            if not tem and p != 'pele' and p not in sem:
                erros.append(f'{n}: SEM_PARTE_DO_RETRATO não diz por que a foto não tem {p}')
            if tem and p in sem:
                erros.append(f'{n}: SEM_PARTE_DO_RETRATO diz que falta {p}, e a foto tem')
        for p, (texto, forma) in pecas.items():
            if forma not in ('m', 'f', 'mp', 'fp'):
                erros.append(f'{n}: a {p} "{texto}" tem a forma "{forma}" (m, f, mp ou fp)')
    if erros:
        sys.exit('\n'.join(erros))


TESTES_DA_FOLHA = [
    None,
    {'cabelo': 'rosa', 'olhos': 'verde', 'camisa': 'verde', 'calca': 'vermelho', 'sapatos': 'azul', 'detalhes': 'amarelo', 'mochila': '#3d8b56'},
    {'cabelo': 'preto', 'olhos': 'azul', 'pele': 'escura', 'camisa': 'branco', 'calca': 'preto', 'sapatos': 'vermelho', 'detalhes': 'roxo', 'mochila': '#26262d'},
    {'cabelo': 'loiro', 'olhos': 'castanho', 'pele': 'muito-clara', 'camisa': 'vermelho', 'calca': 'azul-marinho', 'sapatos': 'branco', 'detalhes': 'verde', 'mochila': '#e9e5db'},
    {'cabelo': 'ruivo', 'olhos': 'mel', 'pele': 'morena', 'camisa': 'azul-marinho', 'calca': 'bege', 'sapatos': 'marrom', 'detalhes': 'laranja', 'mochila': '#d9b53a'},
    {'cabelo': 'prateado', 'olhos': 'violeta', 'pele': 'morena-clara', 'camisa': 'amarelo', 'calca': 'cinza', 'sapatos': 'preto', 'detalhes': 'rosa', 'mochila': '#7a4fa3'},
]


def recolorir(dados, registro, escolha, info):
    trocas = {}
    for parte, id_ in escolha.items():
        if parte not in registro:
            continue
        alvo = escala_de_hex(id_) if parte in EXTRAS else next(k for k in info['de'][parte] if k['id'] == id_)
        for i, t in registro[parte]['i']:
            trocas[i] = rampa(alvo, t)
    return Image.open(io.BytesIO(trocar_paleta(dados, trocas))).convert('RGBA')


def nome_da_cor(info, parte, id_, forma='m'):
    k = next(k for k in info['de'][parte] if k['id'] == id_)
    if not isinstance(k['nome'], list):
        return k['nome']
    return k['nome'][{'m': 0, 'f': 1, 'mp': 2, 'fp': 3}[forma]]


def descricao(n, registro, info):
    """a mesma conta do descricaoDaFoto, com as cores que o desenho tem"""
    cab = []
    if 'cabelo' in registro:
        cab.append('cabelo ' + nome_da_cor(info, 'cabelo', registro['cabelo']['cor']))
    if 'olhos' in registro:
        cab.append('olhos ' + nome_da_cor(info, 'olhos', registro['olhos']['cor'], 'mp'))
    roupa = []
    for p in ROUPA:
        if p in registro:
            texto, forma = info['pecas'][n][p]
            cor = nome_da_cor(info, p, registro[p]['cor'], forma)
            roupa.append(texto.replace('{cor}', cor) if '{cor}' in texto else f'{texto} {cor}')
    return ', '.join(cab), ', '.join(roupa)


def folha(saida, feitos, info):
    W = 160
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
        cab, roupa = descricao(n, registro, info)
        d.text((3, y0 + 2), f'{n}: {cab}', fill=(255, 230, 120))
        d.text((3, y0 + 12), f"{roupa} · pele de {registro['pele']['de']} ~ {registro['pele']['cor']}", fill=(170, 180, 210))
    out.save(saida)


def main():
    anot = carregar_partes()
    info = ler_inscricao()
    feitos = {}
    for n in info['fotos']['Homem'] + info['fotos']['Mulher']:
        if n not in anot:
            sys.exit(f'{n}: está em RETRATOS_DA_FICHA e não foi anotada em fotos-partes.py')
        feitos[n] = montar(n, anot[n], info)
    conferir_listas(anot, info, feitos)
    linhas = []
    for n, (registro, _) in feitos.items():
        linhas.append(f'{json.dumps(n)}:{json.dumps(registro, separators=(",", ":"), ensure_ascii=False)}')
    js = ('/* ============================================================\n'
          '   gerado por ferramentas/fotos-do-jogador.py — não editar à mão.\n'
          '   As fotos do jogador em PNG de paleta, com casa própria pra cada\n'
          '   cor de cada parte (cabelo, olhos, pele, camisa, calça, sapatos e\n'
          '   detalhes, e a mochila nas costas de quem carrega uma, que sai na\n'
          '   cor da mochila da inscrição), anotadas em ferramentas/fotos-partes.py. Em cada\n'
          '   parte, i lista [casa, t]: a casa da paleta e onde aquela cor\n'
          '   fica do escuro (0) ao claro (1); cor é a cor de CORES_DA_FOTO\n'
          '   que o desenho tem, de é a amostra dela. Parte que a foto não\n'
          '   tem não aparece.\n'
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
