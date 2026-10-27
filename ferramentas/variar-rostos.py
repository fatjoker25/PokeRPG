#!/usr/bin/env python3
"""variar-rostos — rosto próprio pra quem tem nome e não tem arquivo seu.

Quem carrega cena tem que ter rosto só dele, e o acervo do Showdown não
tem uma funcionária de escritório por pessoa, nem um pescador, nem uma
recepcionista da Liga. Quando o arquivo que serve já é o de outra
pessoa (ou o da regra genérica de quem não tem nome), a pessoa ganha
uma variação de paleta do mesmo desenho: outro cabelo, outra roupa —
como a rede, que veste o uniforme da HG/SS com a letra do peito apagada.

O script separa as cores sozinho:
  - contorno (quase preto) e brilho (quase branco) ficam;
  - pele fica (as faixas de pele dos sprites de Black/White);
  - cabelo é o que mora na cabeça (o topo do corpo) e não é pele;
  - roupa é o resto.
Cada variação diz o que muda em cada grupo:
  {'h':, 's':, 'l':(de, até)}  cor nova, e o claro-escuro esticado na faixa;
  {'rot': graus}               gira a cor (o que é cinza continua cinza);
  {'tinta': (h, s)}            pinta o branco e o cinza de uma cor, sem
                               mexer no claro-escuro (blusa branca → lilás);
  'onde': 'cabeca' | 'corpo'   prende a troca numa parte (quando cabelo e
                               roupa são pintados com as mesmas cores).
'cores' troca a escolha automática por uma lista (cabelo ruivo é da cor
da sombra da pele, e o automático não separa).

Uso: python3 ferramentas/variar-rostos.py           (gera todos)
     python3 ferramentas/variar-rostos.py --folha f.png   (e a folha de conferir)
Os arquivos saem em sprites_nds/npcs/trainers/<nome>.png; o mesmo pedido
dá sempre o mesmo arquivo.
"""
import colorsys, os, sys
from PIL import Image

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
NPC = os.path.join(RAIZ, 'sprites_nds', 'npcs')

# quem é quem: a base, e o que muda. A descrição de cada pessoa está na cena
# dela (idade, ofício); o que o texto não diz, a variação não inventa.
VARIACOES = {
    # --- escritório: a funcionária de óculos (office_worker_f) é o rosto de
    #     toda secretária e escrevente sem nome; cada uma com nome ganha o seu
    'edda':   dict(base='trainers/office_worker_f',          # Conselheira, uns 45, diretoria
                   cabelo=dict(cores=['#303138', '#53565a', '#8a8491'], h=12, s=.45, l=(.18, .48)),
                   roupa=dict(tinta=(225, .16), so_neutros=True, l=(.30, .55)),
                   extra=[(['#c4b8a2', '#8b7b6b', '#5b4f47'], dict(h=225, s=.14, l=(.16, .40))),
                          (['#7a4758', '#ee6c7f', '#f9dbdf'], dict(h=212, s=.55, l=(.32, .78)))]),
    'hedda':  dict(base='trainers/office_worker_f',          # secretária da mesa, uns 60
                   cabelo=dict(cores=['#303138', '#53565a', '#8a8491'], h=230, s=.04, l=(.62, .90)),
                   roupa=dict(tinta=(285, .30), so_neutros=True),
                   extra=[(['#c4b8a2', '#8b7b6b', '#5b4f47'], dict(h=250, s=.06, l=(.36, .66)))]),
    'cybil':  dict(base='trainers/office_worker_f',          # escrevente do cartório, vaidosa
                   cabelo=dict(cores=['#303138', '#53565a', '#8a8491'], h=18, s=.62, l=(.30, .62)),
                   roupa=dict(tinta=(340, .55), so_neutros=True),
                   extra=[(['#c4b8a2', '#8b7b6b', '#5b4f47'], dict(h=222, s=.30, l=(.18, .42))),
                          (['#7a4758', '#ee6c7f', '#f9dbdf'], dict(h=172, s=.45, l=(.30, .78)))]),
    'myrtle': dict(base='trainers/office_worker_f',          # portaria da guarita, Lavender
                   cabelo=dict(cores=['#303138', '#53565a', '#8a8491'], h=30, s=.05, l=(.40, .74)),
                   roupa=dict(tinta=(140, .24), so_neutros=True, l=(.32, .62)),
                   extra=[(['#c4b8a2', '#8b7b6b', '#5b4f47'], dict(h=28, s=.30, l=(.22, .48)))]),
    'lina':   dict(base='trainers/office_worker_f',          # a moça da administração da ciclovia
                   cabelo=dict(cores=['#303138', '#53565a', '#8a8491'], h=28, s=.40, l=(.30, .58)),
                   roupa=dict(tinta=(205, .50), so_neutros=True),
                   extra=[(['#7a4758', '#ee6c7f', '#f9dbdf'], dict(h=45, s=.70, l=(.40, .80)))]),
    # --- a Liga: o uniforme é um só, quem veste é que muda
    'lena':   dict(base='trainers/league_staff_f',           # recepcionista do prédio da Liga
                   cabelo=dict(cores=['#7b4141', '#c96e4d', '#ac5040'], h=230, s=.12, l=(.14, .34))),
    'ada':    dict(base='trainers/league_staff_f',           # recepcionista do Planalto, Sra.
                   cabelo=dict(cores=['#7b4141', '#c96e4d', '#ac5040'], h=230, s=.05, l=(.58, .84))),
    'maple':  dict(base='trainers/league_staff_f',           # coordenadora da quadra
                   cabelo=dict(cores=['#7b4141', '#c96e4d', '#ac5040'], h=28, s=.45, l=(.24, .46)),
                   extra=[(['#fd1956', '#df515a', '#96072c'], dict(h=40, s=.85, l=(.30, .58)))]),
    # --- os do ofício que tem regra genérica: o genérico fica com o arquivo,
    #     quem tem nome ganha outro cabelo e outra roupa do mesmo ofício
    # o pescador: chapéu e calça cáqui (as mesmas três cores), colete verde-água
    'edric':  dict(base='trainers/fisherman',                                                  # o homem do boné, no açude
                   extra=[(['#686030', '#988858', '#d0b888'], dict(h=218, s=.32, l=(.24, .62))),
                          (['#385850', '#589088', '#78c0a8'], dict(h=24, s=.50, l=(.28, .64)))]),
    'cosmo':  dict(base='trainers/fisherman',                                                  # pescador velho, trinta anos de barco
                   extra=[(['#686030', '#988858', '#d0b888'], dict(h=36, s=.08, l=(.36, .80))),
                          (['#385850', '#589088', '#78c0a8'], dict(h=354, s=.36, l=(.24, .56)))]),
    'nilo':   dict(base='trainers/worker', roupa=dict(rot=-32)),                               # o do posto: macacão vermelho
    'rufo':   dict(base='trainers/courier',                                                    # entregador de pão: boné e camisa
                   extra=[(['#643939', '#663939', '#b34d45', '#e87b7a'], dict(h=128, s=.38, l=(.18, .64)))]),
    'hale':   dict(base='trainers/rancher',                                                    # dono do curral: o macacão
                   extra=[(['#39395a', '#5a62a4', '#628be6'], dict(h=118, s=.30, l=(.22, .58)))]),
    'tito':   dict(base='trainers/clerk',                                                      # o rapaz do protocolo
                   cabelo=dict(cores=['#202828', '#384040', '#585868'], h=26, s=.48, l=(.24, .52), onde='cabeca'),
                   roupa=dict(tinta=(215, .40), so_neutros=True, l=(.14, .52), onde='corpo')),
    'rhea':   dict(base='trainers/reporter', cabelo=dict(h=10, s=.55, l=(.22, .52)), roupa=dict(rot=150)),   # repórter do jornal
    'maeve':  dict(base='trainers/reporter', cabelo=dict(h=45, s=.60, l=(.45, .80)), roupa=dict(rot=-90)),   # rádio comunitária
    'pia':    dict(base='trainers/doctorf_gen8', cabelo=dict(h=22, s=.45, l=(.18, .46))),     # médica de Pokémon, uns 45
    'yarrow': dict(base='trainers/teacher', cabelo=dict(h=15, s=.40, l=(.30, .60)), roupa=dict(rot=110)),    # giz na manga, uns 40
    'pike':   dict(base='trainers/policeman_gen7',                                             # o guarda da primeira guarita: cinza da Liga
                   extra=[(['#1b1b2d', '#2d2d40', '#2f3437', '#4c4b55', '#777294'], dict(h=220, s=.06, l=(.22, .62)))]),
    'fenna':  dict(base='trainers/scientist_f', cabelo=dict(h=28, s=.40, l=(.26, .56))),      # crachá azul, uns 30
    'kira':   dict(base='trainers/scientist_f', cabelo=dict(h=8, s=.55, l=(.30, .58))),       # a técnica de jaleco
    'ulla':   dict(base='trainers/schoolkid_f', cabelo=dict(h=230, s=.12, l=(.10, .32)), roupa=dict(rot=-120)),  # dez anos, o caderno
    'rina':   dict(base='trainers/baker',                                                      # a cozinheira do Anne: avental e cabelo
                   extra=[(['#703030', '#984848', '#c86868'], dict(h=214, s=.42, l=(.22, .56))),
                          (['#402820', '#684828'], dict(h=230, s=.10, l=(.10, .24)))]),
    'yves':   dict(base='trainers/cabbie', cabelo=dict(h=230, s=.04, l=(.55, .85))),          # motorista, uns sessenta
    'janus':  dict(base='trainers/doctor', cabelo=dict(h=30, s=.35, l=(.18, .42)), roupa=dict(rot=-60)),     # o rapaz da enfermaria
    'berto':  dict(base='trainers/gentleman',                                                  # vigia velho, de bengala: terno de vigia
                   extra=[(['#605848', '#887858', '#a89870'], dict(h=220, s=.28, l=(.22, .56)))]),
    # --- pessoas com nome que dividiam o rosto entre si
    'vale':   dict(base='trainers/madame_gen4dp', roupa=dict(rot=120), cabelo=dict(h=230, s=.04, l=(.55, .85))),  # 31 anos na rua
    'tilly':  dict(base='trainers/clerk_f', cabelo=dict(h=40, s=.55, l=(.40, .76))),          # a moça do caixa
    'tamsin': dict(base='trainers/backpacker_f', cabelo=dict(h=30, s=.06, l=(.48, .80)), roupa=dict(rot=-100)),  # cinquenta anos, o mapa 7
    'greta':  dict(base='trainers/veteran_f', cabelo=dict(h=230, s=.04, l=(.58, .86))),       # ensina treinador
    'rico':   dict(base='trainers/worker',                                                     # o da empilhadeira, no armazém do 32
                   extra=[(['#984800', '#c86800', '#e89828'], dict(h=214, s=.42, l=(.20, .54)))]),
    'roland': dict(base='trainers/league_staff',                                               # a voz do rádio, a central do Planalto
                   extra=[(['#96072c', '#fd1956', '#df515a'], dict(h=214, s=.70, l=(.26, .62))),
                          (['#7b4141'], dict(h=28, s=.30, l=(.28, .28)))]),
    'thorne': dict(base='trainers/veteran_f',                                                  # a delegada de Saffron
                   extra=[(['#202020', '#303038', '#505050'], dict(h=222, s=.34, l=(.13, .40))),
                          (['#784040', '#b04848'], dict(h=222, s=.10, l=(.26, .46))),
                          (['#403838'], dict(h=24, s=.22, l=(.34, .34)))]),
    # --- gente da história que dividia o rosto com treinador de classe (a
    #     Treinadora Ás da estrada, a Veterana) ou com quem não tem nome
    'giselle': dict(base='trainers/ace_trainer_f',                                             # vinte e poucos, a cadeira da Lorelei
                    cabelo=dict(cores=['#407898', '#68b0d8'], h=18, s=.45, l=(.20, .42)),
                    extra=[(['#e89058'], dict(h=190, s=.55, l=(.72, .72))),
                           (['#a05860', '#604050'], dict(h=205, s=.22, l=(.24, .44)))]),
    'nadia':  dict(base='trainers/veteran_f',                                                  # 41 anos, a segunda licença
                   extra=[(['#202020', '#303038', '#505050'], dict(h=150, s=.28, l=(.12, .36))),
                          (['#784040', '#b04848'], dict(h=40, s=.55, l=(.32, .50))),
                          (['#403838'], dict(h=20, s=.42, l=(.28, .28)))]),
    'crane':  dict(base='trainers/veteran',                                                    # delegado de Fuchsia: casaco por cima do pijama
                   extra=[(['#181818', '#303038', '#505050'], dict(h=30, s=.30, l=(.16, .44))),
                          (['#383028'], dict(h=215, s=.22, l=(.56, .56)))]),
    'laurel': dict(base='trainers/madame_gen4dp',                                              # secretária da associação, uns sessenta
                   extra=[(['#947b62', '#cda46a'], dict(h=222, s=.32, l=(.30, .52))),
                          (['#7b4a5a', '#b45a6a', '#ff8b9c'], dict(h=42, s=.62, l=(.36, .70)))]),
    'tess':   dict(base='trainers/workerf_gen8',                                               # brigadista: capacete amarelo
                   extra=[(['#16498f', '#1e65b5', '#3193f2', '#7ebefe'], dict(h=48, s=.85, l=(.32, .80))),
                          (['#9f652b', '#dcab5c', '#fff7a9'], dict(h=25, s=.22, l=(.08, .26))),
                          (['#b40d49', '#f02d7a'], dict(h=8, s=.78, l=(.36, .54)))]),
    'dara':   dict(base='trainers/workerf_gen8',                                               # a da pedreira, no caixote de ferramenta
                   extra=[(['#16498f', '#1e65b5', '#3193f2', '#7ebefe'], dict(h=210, s=.05, l=(.44, .92))),
                          (['#9f652b', '#dcab5c', '#fff7a9'], dict(h=12, s=.58, l=(.26, .56))),
                          (['#b40d49', '#f02d7a'], dict(h=88, s=.62, l=(.34, .54)))]),
    'hal':    dict(base='trainers/tarragon',                                                   # o mais velho da oficina: macacão azul
                   extra=[(['#5a4a3a', '#5f4933', '#957a54', '#ddbe96'], dict(h=214, s=.42, l=(.22, .64)))]),
    'bram':   dict(base='trainers/clerk',                                                      # a banca da esquina, vinte e seis anos
                   cabelo=dict(cores=['#202828', '#384040', '#585868'], h=230, s=.04, l=(.46, .80), onde='cabeca'),
                   roupa=dict(tinta=(32, .32), so_neutros=True, l=(.14, .46), onde='corpo')),
    'gina':   dict(base='trainers/scientist_f', cabelo=dict(h=46, s=.34, l=(.54, .90)),       # a farmácia do 118, uns trinta
                   extra=[(['#683840', '#784858', '#a84068'], dict(h=178, s=.42, l=(.26, .46)))]),
    # --- os inscritos do Torneio Aberto que o acervo não tem livres
    'ewan':   dict(base='trainers/fisherman',                                                  # pescador de Fuchsia, colete amarelo
                   extra=[(['#686030', '#988858', '#d0b888'], dict(h=88, s=.26, l=(.20, .56))),
                          (['#385850', '#589088', '#78c0a8'], dict(h=46, s=.72, l=(.36, .70)))]),
}


def hls(c):
    r, g, b = (int(c[i:i + 2], 16) / 255 for i in (1, 3, 5)) if isinstance(c, str) else (v / 255 for v in c[:3])
    return colorsys.rgb_to_hls(r, g, b)


def rgb(h, l, s):
    return tuple(round(v * 255) for v in colorsys.hls_to_rgb(h % 1, max(0, min(1, l)), max(0, min(1, s))))


def hexa(c):
    return '#%02x%02x%02x' % tuple(c[:3])


def eh_pele(c):
    h, l, s = hls(c)
    return 10 / 360 <= h <= 32 / 360 and s >= .30 and .50 <= l <= .92


def eh_neutro(c):
    _, _, s = hls(c)
    return s < .14


def corte_da_cabeca(im):
    """onde a cabeça acaba: o topo do corpo, um quarto da altura"""
    caixa = im.getbbox()
    return caixa[1] + (caixa[3] - caixa[1]) * .26


def grupos(im):
    """cabelo (o que mora no topo do corpo), roupa e o que fica"""
    px = im.load()
    corte = corte_da_cabeca(im)
    tot, cab = {}, {}
    for y in range(im.height):
        for x in range(im.width):
            p = px[x, y]
            if p[3] == 0:
                continue
            c = p[:3]
            tot[c] = tot.get(c, 0) + 1
            if y < corte:
                cab[c] = cab.get(c, 0) + 1
    fica, cabelo, roupa = set(), set(), set()
    for c, n in tot.items():
        h, l, s = hls(c)
        if l < .08 or (l > .93 and s < .2) or eh_pele(c):
            fica.add(c)
        elif cab.get(c, 0) / n >= .55:
            cabelo.add(c)
        else:
            roupa.add(c)
    return fica, cabelo, roupa


def faixa(cores, regra):
    """mapa de cada cor pra cor nova, pela regra"""
    mapa = {}
    if 'rot' in regra:
        for c in cores:
            h, l, s = hls(c)
            if s >= .12:
                mapa[c] = rgb(h + regra['rot'] / 360, l, s)
        return mapa
    if 'tinta' in regra:
        h0, s0 = regra['tinta']
        alvo = [c for c in cores if eh_neutro(c)] if regra.get('so_neutros') else list(cores)
        if regra.get('l'):
            lo, hi = regra['l']
            ord_ = sorted(alvo, key=lambda c: hls(c)[1])
            for i, c in enumerate(ord_):
                t = i / max(1, len(ord_) - 1)
                mapa[c] = rgb(h0 / 360, lo + (hi - lo) * t, s0)
        else:
            for c in alvo:
                _, l, _ = hls(c)
                mapa[c] = rgb(h0 / 360, l, s0 if l < .97 else s0 * .4)
        return mapa
    lo, hi = regra['l']
    ord_ = sorted(cores, key=lambda c: hls(c)[1])
    for i, c in enumerate(ord_):
        t = i / max(1, len(ord_) - 1)
        mapa[c] = rgb(regra['h'] / 360, lo + (hi - lo) * t, regra['s'])
    return mapa


def para_rgb(c):
    return tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))


def variar(nome, v):
    im = Image.open(os.path.join(NPC, v['base'] + '.png')).convert('RGBA')
    fica, cabelo, roupa = grupos(im)
    corte = corte_da_cabeca(im)
    # cada troca é uma camada; 'onde' prende a troca na cabeça ou no corpo,
    # pro desenho que pinta cabelo e terno com os mesmos cinzas (o vendedor)
    camadas = []
    if v.get('roupa'):
        camadas.append((faixa(sorted(roupa), v['roupa']), v['roupa'].get('onde')))
    for cores, regra in v.get('extra', []):
        camadas.append((faixa([para_rgb(c) for c in cores], regra), regra.get('onde')))
    if v.get('cabelo'):
        cc = [para_rgb(c) for c in v['cabelo']['cores']] if v['cabelo'].get('cores') else sorted(cabelo)
        camadas.append((faixa(cc, v['cabelo']), v['cabelo'].get('onde')))
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            p = px[x, y]
            if not p[3]:
                continue
            novo = None
            for mapa, onde in camadas:          # a última que pega vale: o cabelo por cima da roupa
                if (onde == 'cabeca' and y >= corte) or (onde == 'corpo' and y < corte):
                    continue
                if p[:3] in mapa:
                    novo = mapa[p[:3]]
            if novo:
                px[x, y] = novo + (p[3],)
    destino = os.path.join(NPC, 'trainers', nome + '.png')
    im.save(destino, optimize=True)
    return destino


def folha(saida):
    """a base ao lado de cada variação, pra conferir no olho"""
    from PIL import ImageDraw
    pares = [(v['base'], n) for n, v in VARIACOES.items()]
    T, esc = 96, 2
    out = Image.new('RGB', (len(pares) * (T * esc + 8), 2 * (T * esc + 8)), (60, 66, 84))
    d = ImageDraw.Draw(out)
    for i, (base, n) in enumerate(pares):
        for j, cam in enumerate([base, 'trainers/' + n]):
            im = Image.open(os.path.join(NPC, cam + '.png')).convert('RGBA')
            im = im.resize((im.width * esc, im.height * esc), Image.NEAREST)
            out.paste(im, (i * (T * esc + 8), j * (T * esc + 8)), im)
        d.text((i * (T * esc + 8) + 4, 2 * (T * esc + 8) - 14), n, fill=(255, 230, 150))
    out.save(saida)


if __name__ == '__main__':
    for nome, v in VARIACOES.items():
        print(os.path.relpath(variar(nome, v), RAIZ))
    if '--folha' in sys.argv:
        folha(sys.argv[sys.argv.index('--folha') + 1])
