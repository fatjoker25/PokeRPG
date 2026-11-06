"""fotos-partes — onde fica cada parte de cada foto do jogador, pixel a pixel.

Lido por ferramentas/fotos-do-jogador.py, que monta o PNG de paleta de
cada foto com casa própria pra cada parte. Anotado à mão, foto por foto,
olhando cada cor isolada no lugar dela e a foto ampliada, e conferido
com uma cor gritante por parte (cabelo rosa, pele escura, camisa verde,
calça vermelha, sapato azul, detalhe amarelo, olho azul) nas 48.

Cada foto é um dicionário:
  'n'      quantas cores a foto tem — se o arquivo mudar, o número muda e
           o gerador para, porque os índices deixam de valer;
  'px'     {(x, y): parte ou None}: o pixel que vale à parte (a pupila,
           o branco do olho, o brinco), antes de qualquer regra;
  'fixo'   [(x0, y0, x1, y1), ...]: caixas que não mudam nunca (a
           Pokébola, o violão, a prancha, a mochila da mochileira);
  '<parte>' [(cores, caixa), ...]: as cores (os índices de
           `ordem_das_cores`: pela matiz em doze fatias, o que é quase
           cinza antes, e do escuro ao claro) que são aquela parte dentro
           da caixa [x0, x1) × [y0, y1) — TUDO é a foto inteira.
As partes são lidas na ordem em que estão escritas no dicionário, e a
primeira regra que pega o pixel ganha: é assim que o mesmo marrom é
cabelo em cima e bota embaixo. O que nenhuma regra pega fica como o
desenho tem (contorno, branco do olho, o que a pessoa segura).

Política, pra foto nova: chapéu, boné, capacete e viseira são detalhes;
o cabelo que aparece embaixo deles é cabelo; sobrancelha e barba da cor
do cabelo são cabelo; a pupila (e a íris, quando tem) é olho, o branco
fica; o que a pessoa segura fica (uma Pokébola na cor da camisa não é
mais Pokébola); roupa por cima de roupa vai pra peça que mais aparece, e
a de baixo fica ou vira detalhe; acabamento da própria peça (a pelúcia
da cantora, os babados da vidente) vai com ela e fica no claro da cor.
A mochila que a pessoa carrega nas costas (a da mochileira, a do
viajante) é a parte 'mochila', que não tem aba: sai na cor da mochila
escolhida na inscrição. Os nomes das peças
moram em PECAS_DO_RETRATO (js/data/inscricao.js), e o porquê da parte
que falta, em SEM_PARTE_DO_RETRATO.
"""
TUDO = None
ANOT = {
    'trilheiro': {'n': 14,
        'px':       {(38, 15): 'olhos', (38, 16): 'olhos', (38, 17): 'pele', (35, 19): 'pele', (35, 20): 'pele'},
        'cabelo':   [([9, 10, 11], (0, 0, 80, 26))],
        'pele':     [([5, 6, 7, 8], TUDO)],
        'detalhes': [([9, 10, 11], (0, 42, 80, 51))],          # o cinto
        'sapatos':  [([9, 10, 11], (0, 64, 80, 80))],          # as botas
        'camisa':   [([2, 4, 12], (0, 0, 80, 50)), ([2, 4, 12], (0, 50, 31, 53))],
        'calca':    [([2, 4, 12], (0, 50, 80, 70))],
    },
    'viajante': {'n': 29,
        'px':       {(34, 18): 'olhos', (34, 19): 'olhos', (39, 19): 'olhos', (39, 20): 'olhos'},
        'cabelo':   [([1, 12], (0, 0, 80, 40))],
        'pele':     [([13, 14, 15, 26], TUDO)],
        'detalhes': [([22, 24, 25], (26, 4, 52, 19))],         # o boné
        'camisa':   [([11, 27, 28], (24, 30, 56, 48))],         # a regata
        'calca':    [([18, 20, 23], TUDO), ([24], (30, 45, 60, 80))],   # o jeans (o 24 é o claro dele)
        'sapatos':  [([2, 3, 4, 8, 9], (12, 68, 68, 80))],      # o tênis
        'mochila':  [([16, 17, 19], TUDO)],                     # a mochila azul e as alças (o fundo cinza e o que vai pendurado ficam)
    },
    'urbano': {'n': 14,
        'olhos':    [([11], (36, 18, 43, 23))],
        'cabelo':   [([1, 2, 12], (30, 8, 50, 19))],
        'pele':     [([6, 7, 8, 9, 13], TUDO)],
        'detalhes': [([10, 11], (31, 16, 36, 27)), ([10, 11], (43, 16, 49, 27))],   # os fones
        'camisa':   [([2, 4, 5, 12], (26, 26, 60, 45))],
        'calca':    [([2, 4, 5, 12], (26, 45, 60, 63))],                            # a bermuda
        'sapatos':  [([2, 3, 4, 5, 12], (26, 63, 62, 80))],                         # meia e tênis
    },
    'patinador': {'n': 16,
        'px':       {(43, 27): None, (43, 28): None, (48, 31): None,                     # o branco do olho
                     (42, 27): 'olhos', (42, 28): 'olhos', (47, 30): 'olhos', (47, 31): 'olhos'},
        'cabelo':   [([1, 7], (36, 25, 44, 29))],                                   # a franja embaixo do capacete
        'pele':     [([8, 10, 11, 15], TUDO)],
        'detalhes': [([1, 2, 3, 5, 6], (36, 15, 57, 25)), ([1, 2, 3, 5, 6], (43, 24, 57, 29)),
                     ([1, 2], (24, 8, 37, 29)), ([1, 2], (37, 51, 49, 61)), ([1], (44, 42, 58, 50))],  # capacete, luva e joelheira
        'camisa':   [([3, 5, 6, 12, 13], (25, 26, 52, 49))],
        'calca':    [([12, 13, 14], (28, 46, 53, 61))],
        'sapatos':  [([1, 2, 3, 5, 12, 13], (20, 59, 52, 80))],                     # os patins
    },
    'colecionador': {'n': 34,
        'px':       {(34, 18): 'olhos', (39, 18): 'olhos'},
        'cabelo':   [([7, 9, 16, 19, 20, 21], (24, 3, 52, 16))],                   # o topete verde e o raspado
        'pele':     [([10, 11, 12, 13, 15, 32, 33], TUDO)],
        'detalhes': [([30, 31], TUDO)],                                             # a pochete
        'camisa':   [([1, 2, 3, 4, 27], (18, 22, 62, 46))],                         # a jaqueta
        'calca':    [([5, 6, 22, 23, 24], (18, 44, 62, 60))],                       # a bermuda
        'sapatos':  [([5, 6, 22, 23, 24], (18, 64, 62, 80))],
    },
    'terno': {'n': 19,
        'px':       {(31, 17): 'pele', (31, 18): 'pele', (36, 21): 'pele', (35, 17): 'olhos', (40, 17): 'olhos'},
        'sapatos':  [([5, 8], (0, 75, 80, 80))],                                    # os sapatos marrons (o 8 é da pele)
        'cabelo':   [([12, 13, 14], (0, 0, 80, 26))],
        'pele':     [([7, 8, 9, 10], TUDO)],
        'detalhes': [([15, 16, 17], (28, 22, 52, 54)), ([15, 16], (20, 72, 50, 76))],   # a gravata, o colete e a meia
        'camisa':   [([1, 2, 3], (0, 22, 80, 47))],                                 # o paletó
        'calca':    [([1, 2, 3], (0, 47, 80, 76))],
    },
    'roqueiro': {'n': 17,
        'fixo':     [(33, 41, 49, 53), (34, 53, 43, 60), (35, 59, 43, 68),              # o violão e o cabo
                     (29, 31, 30, 35), (30, 35, 31, 41), (31, 41, 32, 46)],             # a correia
        'px':       {(28, 28): 'pele'},
        'cabelo':   [([7, 11, 12], (22, 5, 44, 22))],
        'pele':     [([6, 8, 9, 10, 16], TUDO)],
        'sapatos':  [([3, 5, 15], (14, 70, 62, 80))],
        'camisa':   [([2, 3], (26, 28, 44, 48))],                                       # a regata
        'calca':    [([2, 3], (14, 48, 62, 71))],
    },
    'chamativo': {'n': 21,                                                              # os óculos escuros escondem os olhos
        'px':       {(26, 30): None, (27, 29): None},                                   # o dourado da Luxury Ball
        'cabelo':   [([1, 17, 18], (20, 0, 60, 17))],                                   # o cabelo e as sobrancelhas
        'pele':     [([8, 10, 11, 12], TUDO)],
        'detalhes': [([9], (29, 14, 44, 20)),                                           # a armação dos óculos
                     ([9, 13, 14], (19, 28, 29, 36)), ([9, 13, 14], (43, 17, 60, 28)),  # as mangas douradas
                     ([9, 13, 14], (29, 24, 50, 44)),                                   # o friso da jaqueta
                     ([13], (21, 72, 53, 80))],                                         # a sola
        'camisa':   [([16, 19, 20], (28, 24, 48, 44))],                                 # a jaqueta
        'calca':    [([3, 4, 6, 15], (21, 43, 53, 71))],                                # a camuflada
        'sapatos':  [([16, 19, 20], (21, 69, 53, 80))],
    },
    'lutador': {'n': 22,                                                                # descalço
        'fixo':     [(31, 34, 36, 39), (36, 35, 37, 39)],                                               # a etiqueta vermelha da faixa
        'px':       {(37, 13): None, (38, 13): 'olhos', (38, 14): 'olhos', (43, 14): 'olhos'},
        'olhos':    [([1], TUDO)],
        'cabelo':   [([2, 3, 20], (30, 0, 50, 22))],                                    # cabelo, sobrancelha e barba
        'pele':     [([11, 12, 13, 14, 16], TUDO)],
        'detalhes': [([2, 3], (30, 36, 54, 50))],                                       # a faixa
        'camisa':   [([4, 5, 6, 7, 8, 9], (22, 18, 57, 45))],                           # o quimono
        'calca':    [([4, 5, 7, 9], (22, 45, 57, 72))],
    },
    'mistico': {'n': 15,                                                                # olhos fechados
        'fixo':     [(28, 26, 35, 32)],                                                 # a Pokébola (o brilho é cor própria)
        'cabelo':   [([1, 8], (30, 7, 53, 23))],                                        # cabelo e sobrancelha
        'pele':     [([3, 4, 5, 6], TUDO)],
        'detalhes': [([9, 10, 11, 12], (30, 20, 56, 42))],                              # gola, punho e faixa roxos
        'camisa':   [([2, 13], (18, 20, 60, 50))],                                      # a túnica
        'calca':    [([9, 10], (18, 42, 60, 74))],
        'sapatos':  [([9, 10], (18, 74, 60, 80))],                                      # o chinelo
    },
    'piloto': {'n': 17,                                                                 # o macacão cobre os pés
        'fixo':     [(16, 9, 20, 13)],                                                  # a Pokébola
        'px':       {(20, 10): None},
        'olhos':    [([12], (43, 9, 51, 14))],
        'cabelo':   [([1, 3, 4], (36, 2, 56, 11))],
        'pele':     [([2, 8, 9, 10, 11], TUDO)],
        'detalhes': [([12, 13, 14], (16, 0, 64, 46))],                                  # o capuz e a capa
        'camisa':   [([1, 3, 4, 5, 6], (16, 6, 64, 46))],                               # o macacão, das luvas à cintura
        'calca':    [([1, 3, 4, 5, 6, 12, 13, 14], (16, 46, 64, 80))],
    },
    'naturalista': {'n': 25,                                                            # os óculos verdes escondem os olhos
        'fixo':     [(10, 17, 29, 52)],                                                 # a rede
        'cabelo':   [([2], (34, 13, 50, 23))],                                          # o cabelo embaixo do chapéu
        'pele':     [([9, 11, 24], TUDO)],
        'detalhes': [([12, 13, 15], (28, 7, 56, 27))],                                  # o chapéu
        'camisa':   [([18, 20, 21], TUDO)],
        'calca':    [([7, 8, 10], TUDO)],                                               # a bermuda
        'sapatos':  [([2, 5], (30, 72, 62, 80))],                                       # o tênis (a meia e a sola brancas ficam)
    },
    'durao': {'n': 27,
        'px':       {(36, 13): 'olhos', (41, 13): 'olhos'},
        'olhos':    [([19], TUDO)],
        'cabelo':   [([9, 15, 16, 18], (30, 0, 50, 14))],
        'pele':     [([10, 11, 12, 13, 14, 26], TUDO)],
        'detalhes': [([17], TUDO)],                                                     # o friso amarelo
        'camisa':   [([24, 25], TUDO)],                                                 # a jaqueta (as mangas brancas ficam)
        'calca':    [([1, 3], (24, 40, 52, 70))],
        'sapatos':  [([20, 22], (20, 66, 60, 80))],                                     # o tênis (cadarço e sola ficam)
    },
    'criador': {'n': 22,
        'px':       {(37, 18): 'olhos', (37, 19): 'olhos', (42, 18): 'olhos', (42, 19): 'olhos'},
        'cabelo':   [([9, 10], (30, 10, 50, 21))],                                      # o cabelo embaixo do boné e a sobrancelha
        'pele':     [([11, 12, 14, 20], TUDO)],
        'detalhes': [([3, 6, 17, 18], (28, 4, 52, 17))],                                # o boné
        'camisa':   [([1, 4], (27, 23, 53, 43))],                                       # a camisa escura por baixo
        'calca':    [([3, 6, 17], (27, 23, 53, 66))],                                   # o macacão
        'sapatos':  [([1, 4], (27, 63, 53, 80))],                                       # a bota (a sola amarela fica)
    },
    'corredor': {'n': 21,                                                               # os óculos escondem os olhos
        'px':       {(45, 22): 'pele'},
        'cabelo':   [([7, 8, 10], (30, 5, 54, 22))],
        'pele':     [([9, 11, 12, 14, 20], TUDO)],
        'detalhes': [([1, 15, 19], (34, 16, 46, 21))],                                  # os óculos
        'camisa':   [([16, 17, 18], TUDO)],                                             # a regata
        'calca':    [([4, 5, 6, 13], (28, 43, 46, 58))],                                # o short (a listra branca fica)
        'sapatos':  [([4, 5, 6], (46, 52, 56, 62)), ([4, 5, 6], (22, 71, 36, 80))],
    },
    'ciclista': {'n': 15,                                                               # o capacete cobre o cabelo
        'fixo':     [(16, 25, 23, 30)],                                                 # a Pokébola
        'px':       {(42, 21): 'olhos', (47, 21): 'olhos'},
        'pele':     [([7, 8, 9], TUDO), ([14], (0, 0, 80, 49)), ([14], (33, 49, 50, 80)), ([14], (55, 49, 80, 80))],   # o 14 também é a roda
        'detalhes': [([3, 5, 6, 10, 11, 12], (20, 7, 56, 20)), ([10], (49, 19, 52, 23))],   # o capacete e a correia
        'camisa':   [([4, 5, 6], (30, 22, 50, 36))],                                    # a regata
        'calca':    [([3, 10, 11, 12, 13], (30, 35, 49, 40)), ([3, 10, 11, 12, 13], (30, 40, 43, 48))],   # a bermuda
        'sapatos':  [([2, 3, 5, 6, 13], (31, 63, 37, 70))],                             # o pé no pedal
    },
    'esportivo': {'n': 21,
        'px':       {(38, 18): 'olhos', (43, 19): 'olhos', (38, 23): 'pele'},
        'olhos':    [([19], TUDO)],
        'cabelo':   [([10, 11, 12], (32, 11, 50, 22))],                                 # o cabelo embaixo do boné
        'pele':     [([7, 13, 15, 17, 20], TUDO)],
        'detalhes': [([2, 3, 18], (32, 6, 52, 17))],                                    # o boné
        'camisa':   [([1, 3], (28, 24, 58, 45))],
        'calca':    [([1, 3], (28, 45, 58, 62))],                                       # a bermuda (a listra amarela fica)
        'sapatos':  [([8, 9], (20, 69, 60, 80))],                                       # o tênis (o branco e o cinza ficam)
    },
    'surfista': {'n': 22,                                                               # sem camisa e descalço
        'fixo':     [(43, 0, 62, 12), (42, 12, 62, 15), (41, 15, 62, 19), (39, 19, 62, 22), (40, 22, 62, 23),   # a prancha
                     (45, 23, 62, 27), (43, 27, 62, 29), (42, 29, 62, 38), (41, 38, 62, 80)],
        'olhos':    [([13, 15], (26, 12, 34, 17))],
        'cabelo':   [([0, 1, 2], (18, 4, 42, 23))],
        'pele':     [([7, 8, 9], TUDO)],
        'detalhes': [([1, 4, 6], (26, 22, 38, 29)), ([11, 13, 15], (34, 22, 46, 32))],   # o colar e as pulseiras
        'calca':    [([17, 18, 19], (20, 40, 41, 60))],                                 # a bermuda (o cós e a lateral ficam)
    },
    'artesao': {'n': 22,
        'px':       {(30, 20): 'olhos', (30, 21): 'olhos', (35, 20): 'olhos', (35, 21): 'olhos'},
        'cabelo':   [([1, 3, 6], (14, 6, 46, 22)), ([9], (26, 15, 40, 20)), ([13], (30, 21, 36, 24))],   # cabelo, sobrancelha e bigode
        'pele':     [([14, 16, 18, 20, 21], TUDO)],
        'detalhes': [([9, 15, 19], (24, 43, 46, 59)), ([6], (36, 32, 41, 37))],        # o avental e a alça
        'camisa':   [([2, 7], (20, 25, 44, 43))],                                       # a camisa xadrez
        'calca':    [([10, 12], (20, 57, 52, 67))],
        'sapatos':  [([6, 12], (20, 72, 52, 80))],
    },
    'prateado': {'n': 19,
        'px':       {(35, 19): 'olhos', (35, 20): 'olhos', (40, 19): 'olhos', (40, 20): 'olhos'},
        'cabelo':   [([2, 4, 5, 14], (26, 3, 52, 21))],                                 # o 4 é a nuca, que antes não mudava
        'pele':     [([8, 9, 10, 15], TUDO)],
        'detalhes': [([11, 12], TUDO)],                                                 # o lenço, a faixa e a listra da calça
        'camisa':   [([3, 16, 18], (17, 20, 63, 44))],                                  # a jaqueta e a luva (a listra branca fica)
        'calca':    [([1, 3, 13], (26, 44, 54, 76))],
        'sapatos':  [([16, 18], (26, 73, 54, 80))],
    },
    'violeiro': {'n': 24,                                                               # os olhos ficam na sombra do chapéu
        'cabelo':   [([1, 2], TUDO)],                                                   # o cabelo comprido embaixo do chapéu
        'pele':     [([6, 8, 9], TUDO)],
        'detalhes': [([11, 13, 21, 22], (25, 0, 53, 16))],                              # o chapéu
        'camisa':   [([15, 16, 17], (30, 18, 52, 45))],                                 # a camisa jeans
        'calca':    [([4, 15, 16, 17, 19], (22, 45, 56, 74))],                          # a calça (o gasto é o claro dela)
        'sapatos':  [([10, 12, 21], (20, 72, 56, 80))],                                 # a bota
    },
    'explorador': {'n': 15,
        'fixo':     [(57, 40, 62, 45)],                                                 # a Pokébola
        'px':       {(40, 14): None, (41, 14): None,                                    # o meio do emblema do boné
                     (39, 19): 'olhos', (39, 20): 'olhos', (43, 19): 'olhos'},
        'cabelo':   [([12], (34, 19, 52, 23)), ([12, 14], (37, 24, 42, 26)), ([3], (33, 19, 37, 20))],   # cabelo e barba
        'pele':     [([7, 10, 11], (0, 0, 80, 40)), ([7, 10, 11], (40, 40, 80, 57)), ([6], (30, 18, 52, 28))],   # a corda é da mesma cor
        'detalhes': [([3, 4, 5, 9], (30, 9, 52, 19))],                                  # o boné (o emblema fica)
        'camisa':   [([4, 5, 9], (14, 19, 64, 45))],                                    # a jaqueta
        'calca':    [([12, 13, 14], (14, 40, 64, 59))],
        'sapatos':  [([3, 6, 7, 10], (36, 57, 50, 70))],                                # a bota
    },
    'cinegrafista': {'n': 22,                                                           # um olho na câmera, o outro fechado
        'fixo':     [(19, 11, 34, 22)],                                                 # a câmera
        'cabelo':   [([20], TUDO)],
        'pele':     [([11, 13, 14, 19], TUDO)],
        'detalhes': [([4, 6, 21], (30, 4, 50, 17)), ([4, 6, 21], (19, 21, 60, 47))],   # o boné e a jaqueta brancos
        'camisa':   [([10, 12], (34, 22, 46, 47))],                                     # a camiseta (a estampa fica)
        'calca':    [([2, 3, 6, 16], (20, 47, 60, 73))],
        'sapatos':  [([8, 10], (20, 72, 60, 80))],                                      # o tênis (a sola fica)
    },
    'lavrador': {'n': 26,
        'px':       {(35, 14): 'olhos', (35, 15): 'olhos', (31, 16): 'olhos'},
        'cabelo':   [([20, 21], TUDO)],
        'pele':     [([11, 12, 13, 14, 15, 24], TUDO)],
        'detalhes': [([6, 8, 25], (24, 0, 46, 15)), ([6, 8, 25], (22, 19, 47, 56))],    # a touca e o avental
        'camisa':   [([2, 3, 5], (20, 19, 50, 45))],                                    # a camiseta (a luva fica)
        'calca':    [([22, 23], TUDO)],
        'sapatos':  [([3, 4, 5, 8, 25], (28, 68, 41, 78))],
    },
    'aventureira': {'n': 23,
        'px':       {(45, 20): 'olhos', (45, 21): 'olhos', (50, 20): 'olhos', (50, 21): 'olhos'},
        'cabelo':   [([6, 21, 22], TUDO)],
        'pele':     [([7, 8, 9, 10, 11, 12, 19, 20], TUDO)],
        'detalhes': [([2, 3, 13, 14, 16, 17], (38, 9, 56, 18)),                         # a viseira
                     ([1, 2], (14, 20, 30, 30)), ([1, 2], (47, 26, 56, 36))],           # e as luvas
        'camisa':   [([14, 15, 16, 17], (20, 26, 56, 48))],                             # o vestido (a alça escura fica)
        'calca':    [([1, 2], (30, 48, 50, 53))],                                       # o short
        'sapatos':  [([2, 14, 15, 16, 17, 18], (28, 62, 58, 78))],                      # a bota
    },
    'animada': {'n': 15,
        'px':       {(32, 24): 'olhos', (33, 23): 'olhos', (34, 24): 'olhos', (39, 24): 'olhos', (39, 25): 'olhos',
                     (33, 24): None, (40, 24): None, (40, 25): None},                   # o brilho do olho
        'cabelo':   [([6, 7], (28, 12, 55, 41)), ([14], (28, 12, 55, 21))],             # o 14 em cima é o brilho do cabelo
        'pele':     [([9, 10, 14], TUDO), ([8], (0, 0, 80, 76))],                       # o 8 também é o claro do sapato
        'detalhes': [([11, 12, 13], TUDO)],                                             # o lenço do uniforme
        'camisa':   [([1, 2, 3, 4], (22, 24, 52, 42))],                                 # a blusa de marinheiro
        'calca':    [([1, 2, 3], (22, 42, 52, 53))],                                    # a saia
        'sapatos':  [([6, 7], (35, 53, 52, 62)), ([7, 8], (30, 76, 45, 80))],           # o sapato (a meia fica)
    },
    'urbana': {'n': 24,
        'px':       {(41, 19): 'olhos', (36, 20): 'olhos'},
        'olhos':    [([10], TUDO)],
        'cabelo':   [([2, 9, 11, 23], TUDO)],                                           # castanho com as pontas loiras
        'pele':     [([6, 7, 8, 20, 21, 22], TUDO)],
        'detalhes': [([14, 15], TUDO)],                                                 # as listras da jaqueta
        'camisa':   [([4, 16, 18], (24, 23, 57, 48))],                                  # a jaqueta (o top preto fica)
        'calca':    [([12, 13], TUDO)],                                                 # o short jeans
        'sapatos':  [([4, 16, 17, 18, 19], (20, 69, 60, 80))],
    },
    'atleta': {'n': 24,
        'px':       {(35, 19): 'olhos', (40, 19): 'olhos', (34, 18): None},
        'cabelo':   [([1, 5, 7, 19, 22], (28, 4, 54, 21))],                             # o coque rosa e o raspado escuro
        'pele':     [([10, 11, 12, 13], TUDO)],
        'detalhes': [([15, 16], TUDO)],                                                 # as listras douradas
        'camisa':   [([2, 6, 17], (20, 23, 56, 50))],                                   # a jaqueta (o top rosa fica)
        'calca':    [([2, 6], (20, 50, 56, 74))],
        'sapatos':  [([9, 17, 18], (20, 73, 56, 80))],
    },
    'estudante': {'n': 23,
        'px':       {(34, 21): 'olhos', (39, 20): 'olhos'},
        'olhos':    [([16], TUDO)],
        'cabelo':   [([8, 9, 12, 14], (20, 8, 56, 32))],
        'pele':     [([10, 11, 13, 18], TUDO)],
        'detalhes': [([7, 15], (35, 28, 42, 41))],                                      # a gravata
        'camisa':   [([20, 21, 22], TUDO)],                                             # o blazer (a camisa branca fica)
        'calca':    [([2, 3, 4], (20, 40, 56, 51))],                                    # a saia (a meia-calça fica)
        'sapatos':  [([1, 4], (20, 73, 56, 80))],
    },
    'elegante': {'n': 18,
        'px':       {(35, 19): 'olhos', (39, 19): 'olhos'},
        'olhos':    [([5], TUDO)],
        'cabelo':   [([7, 8, 12, 13], TUDO)],
        'pele':     [([9, 10, 11, 17], TUDO)],
        'detalhes': [([14, 15, 16], TUDO)],                                             # o laço e os frisos roxos
        'camisa':   [([1, 2], (20, 22, 60, 41))],                                       # o blazer (o lenço branco fica)
        'calca':    [([1, 2], (20, 41, 60, 50))],                                       # a saia
        'sapatos':  [([1, 2], (20, 59, 60, 80))],                                       # a bota
    },
    'trilheira': {'n': 14,
        'px':       {(37, 18): 'olhos', (37, 19): 'olhos', (41, 19): 'olhos', (42, 19): 'olhos', (42, 20): 'olhos'},   # o verde do olho é o do cabelo
        'cabelo':   [([9, 10, 11], (20, 4, 62, 30))],
        'pele':     [([5, 7, 8, 13], TUDO)],
        'detalhes': [([9, 10, 11], (20, 38, 60, 45))],                                  # a faixa verde da cintura
        'camisa':   [([2, 4, 6, 12], (20, 19, 60, 41)), ([4, 12], (44, 41, 60, 48))],   # a blusa e a manga do braço de baixo
        'calca':    [([2, 6], (20, 43, 60, 51)), ([4], (38, 43, 44, 49))],              # o short e o vinco dele (a meia-calça fica)
        'sapatos':  [([9, 10, 11], (20, 62, 60, 80))],                                  # a bota
    },
    'punk': {'n': 22,
        'px':       {(39, 15): 'olhos', (39, 16): 'olhos', (34, 16): 'olhos', (34, 17): 'olhos',   # o vermelho do olho é o da jaqueta
                     (43, 19): None},                                                   # o brinco
        'cabelo':   [([14, 16, 18, 19, 20], (18, 4, 62, 26))],
        'pele':     [([8, 10, 12, 15, 17], TUDO)],
        'detalhes': [([7, 9], TUDO)],                                                   # o vermelho da jaqueta, da meia e da bota
        'camisa':   [([1, 2, 3], (18, 22, 58, 40))],                                    # a jaqueta
        'calca':    [([11, 13, 21], (18, 36, 58, 56))],                                 # a saia (a renda preta fica)
        'sapatos':  [([1, 2, 3], (18, 70, 58, 80))],                                    # a bota
    },
    'gotica': {'n': 22,
        'px':       {(35, 33): 'olhos', (35, 34): 'olhos'},                             # o olho é do roxo-escuro do cabelo
        'cabelo':   [([14, 15, 18], TUDO), ([16], (42, 18, 70, 64)), ([16], (14, 18, 28, 32)), ([16], (28, 18, 42, 39))],
        'pele':     [([11, 12, 13, 21], TUDO)],
        'detalhes': [([17, 19, 20], TUDO)],                                             # a tiara e o lenço roxos
        'camisa':   [([5, 6], (28, 38, 50, 57))],                                       # o vestido, em cima
        'calca':    [([5, 6], (0, 55, 80, 80))],                                        # a saia do vestido (a renda fica)
        'sapatos':  [([2, 4], (50, 70, 62, 80))],
    },
    'lutadora': {'n': 17,                                                               # descalça
        'px':       {(38, 22): 'olhos', (38, 23): 'olhos', (38, 24): 'olhos', (43, 23): 'olhos', (43, 24): 'olhos'},   # o azul do olho é o do quimono
        'cabelo':   [([1, 2, 9], TUDO)],                                                # (a liga vermelha fica)
        'pele':     [([5, 6, 7, 8, 13, 15], TUDO)],
        'detalhes': [([3, 4], (20, 42, 60, 48))],                                       # a faixa
        'camisa':   [([10, 11, 12], (18, 28, 62, 44))],                                 # o quimono (a camiseta branca fica)
        'calca':    [([10, 11, 12], (18, 44, 62, 80))],
    },
    'dancarina': {'n': 23,
        'px':       {(40, 19): 'olhos', (40, 20): 'olhos', (45, 22): 'olhos'},
        'olhos':    [([14], TUDO)],
        'cabelo':   [([15, 17, 18, 19], TUDO)],
        'pele':     [([8, 9, 10, 11, 16], TUDO)],
        'detalhes': [([1, 2], (34, 8, 54, 25)),                                         # o boné (o emblema fica)
                     ([3, 4], (20, 11, 30, 17)), ([1, 2, 3, 4], (34, 30, 50, 39)),      # as munhequeiras
                     ([4, 6], (30, 43, 46, 46))],                                       # e o cós
        'camisa':   [([7, 12, 13], (20, 18, 56, 43))],                                  # a jaqueta amarela
        'calca':    [([1, 20, 21], (20, 45, 60, 70))],                                  # a calça estampada
        'sapatos':  [([3, 4, 6, 7, 12], (20, 69, 60, 80))],
    },
    'modelo': {'n': 17,                                                                 # o casaco vai até a coxa: sem calça
        'px':       {(36, 15): 'olhos', (41, 15): 'olhos',
                     (36, 13): None, (40, 15): None, (41, 14): None},                   # a sombra dourada do olho
        'cabelo':   [([1, 2, 3, 4], (26, 3, 48, 20))],
        'pele':     [([8, 9, 10], TUDO)],
        'detalhes': [([11, 13], (0, 13, 80, 80))],                                      # o dourado do casaco e do salto
        'camisa':   [([15, 16], (18, 13, 58, 50))],                                     # o casaco
        'sapatos':  [([15, 16], (20, 68, 56, 80))],
    },
    'artista': {'n': 23,
        'px':       {(23, 21): 'olhos', (23, 22): 'olhos', (28, 21): 'olhos'},
        'cabelo':   [([9, 12], (8, 6, 36, 26))],
        'pele':     [([6, 7, 8, 10, 11, 14], TUDO)],
        'detalhes': [([20, 21, 22], (19, 26, 80, 56)), ([1, 2], (16, 11, 32, 21))],     # o lenço e a faixa do cabelo (a tinta fica)
        'camisa':   [([3, 4, 5], (14, 24, 40, 42))],                                    # a blusa (o pincel fica)
        'calca':    [([1, 2], (14, 41, 54, 64))],                                       # a calça (os respingos ficam)
        'sapatos':  [([1, 2], (4, 73, 54, 80))],
    },
    'aviadora': {'n': 19,
        'fixo':     [(63, 16, 67, 19)],                                                 # a Pokébola
        'px':       {(33, 10): 'olhos', (33, 11): 'olhos', (38, 12): 'olhos', (38, 13): 'olhos'},   # o azul do olho é o da capa
        'cabelo':   [([11, 12, 13], (28, 4, 46, 21))],
        'pele':     [([7, 8, 9, 10], TUDO)],
        'detalhes': [([1, 2, 3], (28, 0, 48, 13)), ([14, 15, 16], (12, 0, 68, 47)),     # o capacete e a capa
                     ([11, 12, 13], (40, 28, 68, 45))],                                 # (o forro creme da capa)
        'camisa':   [([1, 2, 3, 4, 5], (10, 2, 22, 14)), ([1, 2, 3, 4, 5], (12, 13, 40, 49)), ([1, 2, 3, 4, 5], (40, 14, 68, 25))],   # o macacão e as luvas
        'calca':    [([1, 2, 3, 4, 5, 14, 15, 16], (12, 47, 68, 68))],
    },
    'patinadora': {'n': 15,
        'fixo':     [(22, 36, 27, 40)],                                                 # a Pokébola
        'px':       {(49, 25): 'olhos', (49, 26): 'olhos', (54, 24): 'olhos'},
        'cabelo':   [([1, 2, 4], (14, 21, 50, 30))],                                    # o rabo de cavalo e a franja
        'pele':     [([9, 10, 11, 14], TUDO)],
        'detalhes': [([8, 12, 13], (38, 10, 58, 24)), ([12], (40, 24, 46, 29)),         # o capacete (os óculos ficam)
                     ([1, 2], (46, 50, 56, 61))],                                       # e a joelheira
        'camisa':   [([1, 2, 3, 5, 6], (36, 30, 58, 42)), ([1, 2, 3, 5, 6], (14, 28, 36, 42)), ([1, 2, 3, 5, 6], (56, 24, 68, 44))],   # a blusa e as mangas pretas
        'calca':    [([1, 2, 8, 13], (30, 40, 52, 51))],                                # a saia e a bermuda
        'sapatos':  [([1, 2, 3, 5, 8, 12, 13], (12, 47, 33, 66)), ([1, 2, 3, 5, 8, 12, 13], (30, 51, 46, 60)),
                     ([1, 2, 3, 5, 8, 12, 13], (12, 58, 34, 80))],                      # os patins
    },
    'ciclista_f': {'n': 15,
        'px':       {(28, 19): 'olhos', (33, 17): 'olhos'},
        'cabelo':   [([7, 9], (18, 4, 50, 23))],
        'pele':     [([8, 10, 11], TUDO), ([14], (0, 0, 80, 49)), ([14], (30, 49, 48, 80))],   # o 14 também é a roda
        'detalhes': [([3, 5, 6, 12], (20, 8, 40, 17))],                                 # a viseira
        'camisa':   [([4, 5, 6], (26, 22, 52, 37))],                                    # a regata
        'calca':    [([3, 7, 9, 12], (36, 34, 52, 46))],                                # o short
        'sapatos':  [([2, 3, 5, 6, 13], (43, 62, 51, 70))],                             # o pé no pedal
    },
    # a mochileira: o vermelho da mochila gigante é a mochila, que sai na cor
    # da mochila da inscrição (as duas Pokébolas presas nela, as listras cinza
    # e as cordas da cor do cabelo ficam); o peito que aparece entre a alça e o
    # braço é pele — a mochila cobre a blusa, então não tem camisa pra trocar
    'mochileira': {'n': 15,
        'fixo': [(32, 36, 38, 41), (28, 40, 36, 45)],  # as duas Pokébolas presas na mochila
        'px': {(49, 24): 'olhos', (52, 25): 'olhos'},
        'cabelo': [([6, 10, 11], (39, 4, 52, 17)), ([6, 10, 11], (46, 15, 63, 29))],
        'calca': [([6, 11, 14], (30, 44, 45, 58)), ([6, 11, 14], (38, 58, 45, 64)), ([6, 14], (40, 41, 45, 44))],  # a bermuda
        'sapatos': [([1, 2, 3, 4, 10, 12, 13], (23, 56, 32, 70)), ([1, 2, 3, 4, 10, 12, 13], (36, 72, 50, 80))],
        'detalhes': [([12, 13], (47, 13, 52, 17)), ([12, 13], (61, 34, 66, 40)), ([1, 2], (57, 27, 59, 29))],  # o prendedor, a munhequeira e o brinco
        'pele': [([7, 8, 9, 14], (46, 17, 80, 42)), ([7, 8, 9, 14], (20, 56, 50, 80))],
        'mochila': [([3, 4, 5], (6, 16, 52, 51))]},  # o vermelho da mochila (listras cinza e cordas ficam)
    # a despojada: tranças rentes; a jaqueta amarrada na cintura, as contas
    # da trança e o pingente são os detalhes; a sombra do queixo na mão fica
    'despojada': {'n': 22,
        'px': {(36, 20): 'olhos', (36, 21): 'olhos', (41, 20): 'olhos', (41, 21): 'olhos',
               (42, 25): None, (43, 25): None, (43, 26): None},
        'cabelo': [([1, 2], (30, 8, 56, 30))],
        'pele': [([7, 10, 11], TUDO)],
        'camisa': [([12, 14, 15], TUDO)],  # a regata
        'calca': [([13, 16, 17, 18, 19], TUDO)],  # a bermuda jeans
        'sapatos': [([1, 3, 5, 6], (24, 71, 33, 79)), ([1, 3, 5, 6], (44, 71, 53, 79))],
        'detalhes': [([4, 5, 6], (28, 42, 53, 56)), ([20, 21], TUDO), ([6, 9], (48, 21, 51, 25))]},
    # a esportiva: a faixa do cabelo é o detalhe; a camisa vai até a listra
    # da cintura e a saia pregueada começa embaixo; o pé de trás, dobrado,
    # aparece de lado (sola amarela) e é sapato também; a Pokébola fica
    'esportiva': {'n': 17,
        'px': {(39, 24): 'olhos', (39, 25): 'olhos', (44, 23): 'olhos', (44, 24): 'olhos'},
        'cabelo': [([6, 7, 8], (26, 12, 52, 31))],
        'detalhes': [([13], (34, 14, 48, 19))],  # a faixa
        'camisa': [([1, 2, 3, 4, 13, 14, 15], (26, 30, 50, 40))],
        'calca': [([1, 2, 3, 13, 14, 15], (20, 40, 42, 52))],  # a saia
        'sapatos': [([2, 10, 13, 14], (33, 56, 43, 68)), ([3], (29, 69, 33, 73)), ([1, 10, 13, 14, 15], (25, 72, 38, 80))],
        'pele': [([9, 11, 12, 16], TUDO)]},
    # a descolada, de perfil: os óculos na cabeça e o cinto são os detalhes;
    # a blusa é de alcinha (a barriga aparece entre ela e a calça); a sacola
    # de compras, a maçã e o que cai dela ficam como estão
    'descolada': {'n': 26,
        'px': {(41, 17): 'olhos', (41, 18): 'olhos'},
        'detalhes': [([21, 23, 24], (37, 7, 48, 12)), ([10, 16], (38, 39, 49, 43))],
        'cabelo': [([4, 12, 17], (26, 5, 47, 26))],
        'camisa': [([19, 22], (36, 24, 49, 39))],
        'calca': [([20, 23], (30, 38, 50, 71)), ([19], (36, 39, 48, 41))],
        'sapatos': [([19, 22], (35, 70, 47, 80)), ([19], (21, 47, 31, 57))],
        'pele': [([6, 11, 13, 15, 25], TUDO)]},
    # a fazendeira: chapéu (com a fita), lenço e cinto são os detalhes e
    # dividem as cores com as tranças, então tudo vai por caixa; a jardineira
    # é a calça; os botões dela, o laço e a Pokébola ficam como estão
    'fazendeira': {'n': 15,
        'px': {(36, 26): 'olhos', (36, 27): 'olhos', (36, 28): 'olhos', (42, 25): 'olhos', (42, 26): 'olhos'},
        'detalhes': [([4, 5, 6, 9], (24, 13, 48, 24)), ([4, 5, 6, 9], (27, 24, 42, 25)),
                     ([3, 14], (38, 35, 42, 37)), ([4, 5], (32, 44, 47, 49))],
        'cabelo': [([4, 5, 6, 9], (20, 24, 56, 37))],
        'camisa': [([1, 2], (29, 32, 49, 42))],
        'calca': [([11, 12, 13], TUDO)],
        'sapatos': [([1, 2, 4, 5, 6], (25, 60, 37, 79)), ([1, 2, 4, 5, 6], (43, 59, 53, 77))],
        'pele': [([7, 8, 10, 14], TUDO)]},
    # a cantora: a fita do cabelo, a flor, os brincos, o laço da gola e o
    # painel amarelo da saia são os detalhes; o vestido vai em cima (camisa)
    # e na saia com o laço de trás (calça), e a pelúcia branca da gola e da
    # barra vai com eles, no claro da cor; o microfone e o fio ficam, e o rosa
    # da bochecha e da língua também
    'cantora': {'n': 15,
        'fixo': [(37, 30, 42, 35)],  # o microfone
        'px': {(38, 23): 'olhos', (38, 24): 'olhos', (43, 23): 'olhos', (43, 24): 'olhos',
               (44, 25): None, (45, 25): None, (42, 28): None},
        'detalhes': [([7, 10], (34, 13, 46, 17)), ([13, 14], (44, 13, 52, 19)),
                     ([7], (35, 25, 37, 28)), ([2, 10], (47, 26, 49, 28)),
                     ([7, 10], (43, 30, 45, 34)), ([7, 10], (24, 41, 60, 57))],
        'cabelo': [([3, 4, 5], (32, 10, 57, 31))],
        'camisa': [([13, 14], (35, 33, 47, 46)), ([1, 2, 11], (33, 28, 37, 32)), ([1, 2, 11], (42, 28, 56, 35))],  # e a pelúcia da gola
        'calca': [([12, 13, 14], (28, 46, 62, 57)), ([12, 13, 14], (47, 36, 62, 46)), ([1, 2, 11], (27, 53, 62, 62))],  # e a da barra
        'sapatos': [([13, 14], (38, 73, 47, 79)), ([13, 14], (50, 65, 57, 71))],
        'pele': [([6, 8, 9, 12], TUDO)]},
    # a vidente: um olho piscando (só o aberto muda); a faixa da cintura, o
    # forro da manga e a fita do rabo de cavalo são os detalhes; o quimono é a
    # camisa (a blusa branca da gola fica), e a calça leva os babados da
    # barra, no claro da cor; descalça; o brilho e a Pokébola no ar ficam
    'vidente': {'n': 15,
        'px': {(35, 24): 'olhos', (35, 25): 'olhos', (26, 26): 'detalhes', (35, 32): 'cabelo'},
        'cabelo': [([1, 2, 3, 11], (17, 14, 48, 32)), ([1, 2, 3], (17, 32, 32, 36))],
        'detalhes': [([1, 3], (33, 46, 47, 51)), ([1, 2], (49, 33, 54, 38))],
        'camisa': [([4, 13], (28, 25, 58, 48))],
        'calca': [([4, 13], (20, 48, 60, 66)), ([5, 12], (26, 58, 38, 66)), ([5, 12], (48, 57, 59, 65))],  # e os babados da barra
        'pele': [([7, 8, 9, 14], TUDO)]},
    # a guitarrista: o preto do contorno é o do cabelo, então o cabelo vai por
    # caixa (o fio da guitarra que desce pela esquerda fica); o prendedor e a
    # munhequeira são os detalhes; a regata é o cinza-escuro, a saia xadrez é
    # a calça; tênis e meia juntos (a sola fica); a guitarra fica
    'guitarrista': {'n': 15,
        'px': {(30, 23): 'olhos', (30, 24): 'olhos', (30, 25): 'olhos', (25, 24): 'olhos', (25, 25): 'olhos'},
        'detalhes': [([13, 14], (22, 13, 26, 17)), ([6, 13, 14], (46, 28, 51, 33))],
        'cabelo': [([1, 2, 3], (11, 8, 37, 22)), ([1, 2, 3], (11, 22, 24, 36)), ([1, 2, 3], (33, 16, 37, 24))],
        'camisa': [([2], (17, 30, 36, 45))],
        'calca': [([6, 13, 14], (12, 44, 40, 54))],
        'sapatos': [([2, 6, 13, 14], (11, 60, 24, 80)), ([2, 6, 13, 14], (34, 60, 48, 80))],
        'pele': [([7, 8, 9, 10], TUDO)]},
}
