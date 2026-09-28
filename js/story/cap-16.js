/* ------------------------------------------------------------
   ABERTURAS — a ilha sem nome chega até você por quatro bocas
   diferentes: o Sr. Tanner no dominó, uma carta náutica numa
   loja de material de pesca, um pescador que não quer falar, e
   uma pena que alguém achou na praia.
   ------------------------------------------------------------ */
const C16_ABERTURAS = ['c16_velho', 'c16_ab_a_carta_nautica', 'c16_ab_a_pena', 'c16_ab_quem_nao_fala'];
function c16_cabe(id, d){
  if (id === 'c16_ab_a_carta_nautica') return d.jogador.dinheiro >= 900;
  return true;
}
function c16_abertura(d){
  const cand = C16_ABERTURAS.filter(id => c16_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 16 — A ILHA SEM NOME
   ============================================================ */
CAPITULOS.push(
{
num:16, titulo:'A Ilha Sem Nome', local:'Mar a sudoeste de Kanto', ambiente:'montanha', nivelArea:52,
tom:'muito sombrio', entradas:C16_ABERTURAS,
inicio: d => c16_abertura(d),
cenas:{

c16_ab_a_carta_nautica:{
  texto:[
    'A loja de material de pesca de Fuchsia vende anzol, linha, bóia, isca, e numa gaveta de madeira no fundo da loja, cartas náuticas.',
    'Elas custam novecentos cada e ninguém compra, porque quem precisa de carta náutica já tem a carta náutica.',
    'Você pede a do setor sudoeste. O dono levanta as sobrancelhas e não pergunta nada, que é o serviço dele.',
    'A carta é linda: azul-clara nos baixios, azul-escura nos fundões, com números em cada metro de profundidade e uma malha de linhas finas.',
    'E a sudoeste, a noventa e poucas milhas, um ponto preto com uma legenda de três palavras:',
    '**RECIFE ALTO S/ NOME**',
    'Recife alto quer dizer que é rocha que sai da água. Ilha, portanto.',
    'Uma ilha que está na carta náutica e não está em nenhum mapa de Kanto, porque mapa de Kanto é feito pra quem anda em terra e ninguém anda em terra até lá.'
  ],
  ef:{dinheiro:-900, flag:['sabe_da_ilha','tem_a_carta_nautica'],
      registrar:'Comprou a carta náutica do setor sudoeste. A ilha consta como "recife alto s/ nome".',
      presagio:'A informação nunca esteve escondida. Estava no documento que ninguém lê.'},
  escolhas:[
    {texto:'Perguntar ao dono se alguém já foi lá.', vai:'c16_ab_o_dono_da_loja'},
    {texto:'Levar a carta pro cais e procurar quem leve você.', vai:'c16_travessia'},
    {texto:'Procurar o velho do dominó que fala dessa ilha.', vai:'c16_velho'}
  ]
},

c16_ab_o_dono_da_loja:{
  texto:[
    'Ele olha o ponto na carta onde o seu dedo está e demora a responder.',
    fala('o dono da loja', 'Essa carta aí eu vendi três vezes em dezoito anos.'),
    d=>fala(d.jogador.nome, 'Pra quem?'),
    fala('o dono da loja', 'Uma pra um pesquisador em oitenta e nove. Uma pra uns caras de terno em noventa e sete.'),
    'Ele bate no balcão com o nó do dedo.',
    fala('o dono da loja', 'E uma pra você.'),
    d=>fala(d.jogador.nome, 'Caras de terno compram carta náutica?'),
    fala('o dono da loja', 'Compraram quatro. Sudoeste, sul, sudeste e a geral.'),
    fala('o dono da loja', 'E compraram dois GPS, que naquela época custava o preço de um carro.'),
    'Ele dobra a carta pra você no vinco certo, que é um cuidado de quem respeita papel.',
    fala('o dono da loja', 'Homem que compra GPS de preço de carro pra ir num recife sem nome não tá indo pescar.', 'baixo')
  ],
  ef:{flag:'os_de_terno_compraram_carta',
      npc:{nome:'o dono da loja', opiniao:1, viuVoce:'Te vendeu a carta náutica do setor sudoeste.'},
      registrar:'Em 1997, homens de terno compraram quatro cartas náuticas e dois GPS na loja de pesca de Fuchsia.',
      presagio:'Noventa e sete. A mesma década em que a luz aparece duas vezes.'},
  escolhas:[
    {texto:'Ir pro cais procurar quem leve você.', vai:'c16_travessia'},
    {texto:'Procurar o velho do dominó.', vai:'c16_velho'},
    {texto:'Procurar quem foi com os de terno em noventa e sete.', vai:'c16_ab_quem_nao_fala'}
  ]
},

c16_ab_a_pena:{
  texto:[
    'Tem uma menina de uns nove anos vendendo concha numa toalha estendida no calçadão de Fuchsia, e o negócio dela vai mal porque concha é de graça na praia, e ela sabe disso e monta a toalha todo dia mesmo assim.',
    'Tem um papelão na frente da toalha com o preço e o nome do negócio em letra de criança: CONCHAS DA NINA.',
    'No canto da toalha, entre as conchas, tem uma coisa que não é concha.',
    'É uma pena. Uns vinte e dois centímetros, curvada, com a haste clara e a barba em três faixas: vermelha na ponta, depois branca, depois uma faixa que não é bem dourada e não é bem verde e que muda quando você move a cabeça.',
    'Você já viu pena de Pidgeot, de Fearow, de Spearow. Nenhuma faz isso.',
    d=>fala(d.jogador.nome, 'Quanto é essa?'),
    fala('Nina', 'Essa não é de vender.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('Nina', 'Porque meu irmão achou na praia do sul e ele falou que é de sorte.'),
    'Ela endireita a pena na toalha com um dedo.',
    fala('Nina', 'Mas ele morreu em agosto. Então eu não sei mais se é.')
  ],
  ef:{flag:'viu_a_pena',
      npc:{nome:'Nina', opiniao:1, viuVoce:'Você reparou na pena entre as conchas dela.'},
      registrar:'Nina, de Fuchsia, tem uma pena de três faixas que o irmão achou na praia do sul.',
      presagio:'Vermelha, branca e uma cor que muda com o ângulo. Isso não é de nenhum bicho que você conhece.'},
  escolhas:[
    {texto:'Perguntar exatamente onde o irmão achou.', vai:'c16_ab_onde_achou'},
    {texto:'Oferecer para comprar mesmo assim.', vai:'c16_ab_ofereceu_pela_pena'},
    {texto:'Não insistir. Procurar o velho que fala da ilha.', vai:'c16_velho'}
  ]
},

c16_ab_onde_achou:{
  texto:[
    fala('Nina', 'Na ponta sul, depois da pedra grande.'),
    'Ela aponta e a ponta sul fica visível daqui, a uns dois quilômetros, e a pedra grande também.',
    fala('Nina', 'Ele ia lá todo dia de manhã. Ele catava vidro.'),
    d=>fala(d.jogador.nome, 'Vidro?'),
    fala('Nina', 'Vidro de garrafa que o mar lixa. Fica fosco e fica bonito.'),
    'Ela puxa um potinho de plástico de dentro da bolsa e mostra: uns quarenta cacos de vidro verde e âmbar, lixados pelo mar, bonitos mesmo.',
    fala('Nina', 'A pena tava junto do vidro. Em cima da linha da maré.'),
    'E aí ela fala a frase que muda a cena:',
    fala('Nina', 'Ele achou em três de agosto e a gente enterrou ele dia sete.'),
    fala('Nina', 'Meu pai falou que a pena deu azar. Eu acho que ela só tava lá.', 'baixo')
  ],
  ef:{flag:'a_pena_da_ponta_sul',
      registrar:'A pena foi achada na linha da maré da ponta sul de Fuchsia, em 3 de agosto.',
      presagio:'Coisa que boia vem de onde o mar vem. O mar de Fuchsia vem do sudoeste.'},
  escolhas:[
    {texto:'Oferecer para comprar a pena.', vai:'c16_ab_ofereceu_pela_pena'},
    {texto:'Ir até a ponta sul procurar mais.', vai:'c16_ab_a_ponta_sul'},
    {texto:'Procurar o velho que fala da ilha do sudoeste.', vai:'c16_velho'}
  ]
},

c16_ab_ofereceu_pela_pena:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu não quero comprar pra guardar. Eu quero saber de onde ela veio.'),
    'A menina te olha do jeito que criança olha adulto que falou uma coisa que criança entende e adulto não costuma dizer.',
    fala('Nina', 'De onde ela veio ou de quem ela é?'),
    d=>fala(d.jogador.nome, 'De quem ela é.'),
    'Ela pega a pena, olha contra o sol, e a faixa do meio muda de cor na mão dela.',
    fala('Nina', 'Então leva.'),
    d=>fala(d.jogador.nome, 'Eu pago.'),
    fala('Nina', 'Não. Se você pagar vira concha.'),
    'Ela põe a pena na sua mão com as duas mãos dela, que é como se entrega coisa importante.',
    fala('Nina', 'Você volta e me conta de quem é.'),
    'Não é pedido. É condição.'
  ],
  ef:{flag:['carrega_a_pena','a_promessa_da_menina'], moral:1,
      npc:{nome:'Nina', opiniao:3, viuVoce:'Te deu a pena de graça, com a condição de você voltar e contar de quem é.'},
      registrar:'Está carregando a pena de três faixas. Prometeu à Nina voltar e dizer de quem ela é.',
      presagio:'Você prometeu voltar. Guarde isso: promessa feita pra criança tem cobrança diferente.'},
  escolhas:[
    {texto:'Ir até a ponta sul procurar mais.', vai:'c16_ab_a_ponta_sul'},
    {texto:'Procurar o velho que fala da ilha do sudoeste.', vai:'c16_velho'},
    {texto:'Ir pro cais procurar quem leve você.', vai:'c16_travessia'}
  ]
},

c16_ab_a_ponta_sul:{
  texto:[
    'A ponta sul de Fuchsia é uma praia de pedra com dois quilômetros de nada e uma pedra grande que dá nome ao lugar.',
    'Você anda a linha da maré por uma hora e quarenta, de cabeça baixa, catando com os olhos.',
    'Acha: vidro fosco (muito), uma sandália, meio quilômetro de linha de pesca enrolada em alga, e um isqueiro.',
    'Não acha pena nenhuma.',
    'Mas na volta, em cima da pedra grande, tem uma coisa que você não viu na ida porque estava olhando pro chão.',
    'Uma marca. Uma queimadura circular na rocha, de uns setenta centímetros, com a borda vitrificada.',
    'Pedra vitrifica a mil e poucos graus. Isso não é fogueira de pescador.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} não sobe na pedra. Fica embaixo, olhando pra cima, e não sobe nem quando você chama.`
               : 'Você põe a mão na marca e a rocha está fria, o que de alguma forma é pior.';
    }
  ],
  ef:{flag:'a_marca_na_pedra',
      registrar:'Na pedra grande da ponta sul há uma queimadura circular de 70 cm com a borda vitrificada.',
      presagio:'Mil e poucos graus, na beira do mar, e ninguém na cidade comentou.'},
  escolhas:[
    {texto:'Procurar o velho que fala da ilha do sudoeste.', vai:'c16_velho'},
    {texto:'Ir pro cais procurar quem leve você.', vai:'c16_travessia'}
  ]
},

c16_ab_quem_nao_fala:{
  texto:[
    'Tem um homem no cais de Fuchsia que todo mundo aponta e ninguém apresenta.',
    'Cinquenta e poucos anos, barco médio, trabalha sozinho. Chama-se Orso — está pintado na popa, como em todo barco de dono — e a frase que dizem dele é sempre a mesma: "aquele ali foi em noventa e sete".',
    'Ninguém completa a frase. Você tem que perguntar pra ele.',
    'Ele está remendando rede na proa e não levanta a cabeça quando você chega.',
    fala('Orso', 'Não.'),
    d=>fala(d.jogador.nome, 'Eu não perguntei nada.'),
    fala('Orso', 'Você ia perguntar de noventa e sete.'),
    'Ele passa a agulha de rede duas vezes antes de falar de novo.',
    fala('Orso', 'Eu levo carga, levo gente, levo o que pagarem. Pra sudoeste eu não vou.'),
    d=>fala(d.jogador.nome, 'Por quanto?'),
    'Aí ele levanta a cabeça.',
    fala('Orso', '{Menino|Menina}, eu acabei de te dizer que tem um preço que eu não aceito. Você perguntou o preço.')
  ],
  ef:{flag:'sabe_da_ilha',
      npc:{nome:'Orso', opiniao:-1, viuVoce:'Você perguntou o preço depois de ele dizer que não tinha preço.'},
      registrar:'Um pescador de Fuchsia foi à ilha em 1997 e não volta lá por dinheiro nenhum.'},
  escolhas:[
    {texto:'Pedir desculpa e perguntar o que aconteceu.', vai:'c16_ab_pediu_desculpa'},
    {texto:'Insistir no dinheiro.', vai:'c16_ab_insistiu_no_dinheiro'},
    {texto:'Deixar ele em paz e procurar o velho do dominó.', vai:'c16_velho'}
  ]
},

c16_ab_pediu_desculpa:{
  texto:[
    d=>fala(d.jogador.nome, 'Desculpa. Foi burrice.'),
    'Ele volta pra rede. Passa a agulha umas seis vezes. Você fica parad{o|a}, porque sair agora seria pior.',
    fala('Orso', 'Eu levei quatro homens em noventa e sete. Dois dias, ida e volta, muito bem pago.'),
    fala('Orso', 'Eles desceram na ilha com equipamento e eu fiquei no barco, fundeado, porque foi o combinado.'),
    'Ele para de costurar.',
    fala('Orso', 'Na segunda noite apareceu a luz.'),
    d=>fala(d.jogador.nome, 'A luz colorida.'),
    fala('Orso', 'Colorida. Igual arco-íris, mas de noite, e arco-íris de noite não existe.'),
    fala('Orso', 'Durou uns trinta minutos.'),
    'Ele olha pro mar.',
    fala('Orso', 'E no outro dia eu levei três homens de volta.', 'baixo')
  ],
  ef:{flag:['sabe_da_ilha','tres_voltaram_de_quatro'],
      npc:{nome:'Orso', opiniao:2, viuVoce:'Te contou de 1997 porque você pediu desculpa.'},
      registrar:'Em 1997 ele levou quatro homens à ilha e trouxe três de volta. Na segunda noite houve luz colorida.',
      presagio:'Quatro entraram e três saíram. Você já ouviu essa conta antes, em outro porto.'},
  escolhas:[
    {texto:'Perguntar quem era o quarto.', vai:'c16_ab_quem_era_o_quarto'},
    {texto:'Perguntar se ele levaria você.', vai:'c16_travessia'},
    {texto:'Procurar o velho do dominó com isso na cabeça.', vai:'c16_velho'}
  ]
},

c16_ab_quem_era_o_quarto:{
  texto:[
    fala('Orso', 'Eu não sei o nome de nenhum dos quatro.'),
    fala('Orso', 'Eles não falaram nome e eu não perguntei, porque quem paga o triplo não gosta de pergunta.'),
    'Ele enrola o fio da agulha de rede no dedo.',
    fala('Orso', 'Mas eu sei que o quarto era o mais velho e era o que mandava.'),
    fala('Orso', 'E eu sei que os três que voltaram não falaram uma palavra no caminho inteiro.'),
    d=>fala(d.jogador.nome, 'Você não perguntou do quarto?'),
    fala('Orso', 'Perguntei. Uma vez.'),
    'Ele volta pra rede.',
    fala('Orso', 'Um deles falou "que quarto".'),
    fala('Orso', 'E aí eu não perguntei mais, e recebi, e nunca mais fui pro sudoeste.', 'baixo')
  ],
  ef:{flag:'que_quarto',
      registrar:'Os três que voltaram negaram que houvesse um quarto homem.',
      presagio:'"Que quarto." Eles ensaiaram isso na ilha, antes de embarcar.'},
  escolhas:[
    {texto:'Perguntar se ele levaria você.', vai:'c16_travessia'},
    {texto:'Procurar o velho do dominó.', vai:'c16_velho'}
  ]
},

c16_ab_insistiu_no_dinheiro:{
  texto:[
    d=>fala(d.jogador.nome, 'Todo mundo tem preço.'),
    'Ele corta a linha da rede com o dente, devagar, e enrola a sobra no dedo.',
    fala('Orso', 'Todo mundo tem. Eu tinha.'),
    fala('Orso', 'Em noventa e sete o meu preço foi o triplo da diária, e eu aceitei, e eu levei quatro homens pra lá.'),
    'Ele levanta e amarra a rede na amurada, de costas pra você.',
    fala('Orso', 'Sai do meu barco.'),
    'Você desce. Do cais dá pra ver ele ainda de costas, parado, sem fazer nada com as mãos.'
  ],
  ef:{flag:['sabe_da_ilha','quatro_homens_em_noventa_e_sete'],
      npc:{nome:'Orso', opiniao:-3, viuVoce:'Você insistiu no dinheiro depois do "não".'},
      registrar:'Em 1997 ele levou quatro homens à ilha pelo triplo da diária. Não fala mais com você.'},
  escolhas:[
    {texto:'Procurar outro barco no cais.', vai:'c16_travessia'},
    {texto:'Procurar o velho do dominó.', vai:'c16_velho'}
  ]
},


c16_velho:{
  texto:[
    'O pescador se chama Otis Tanner, tem oitenta e um anos e conta a mesma história há quarenta.',
    'No cais o chamam de Seu Otis. Você vai chamá-lo de Sr. Tanner o capítulo inteiro, e na terceira vez ele vai reparar, e não vai corrigir.',
    'Ele conta ela no cais de Fuchsia, na mesa de dominó, pra quem pedir e pra quem não pedir, e todo mundo já ouviu, e todo mundo muda de assunto educadamente.',
    'Hoje ele conta pra você.',
    '"Tem uma ilha a sudoeste que não entra em mapa nenhum porque não tem nada nela. Pedra e mato. Nem água doce."',
    '"E por que ela não entra no mapa se ela existe?"',
    '"Ela entra na carta náutica." Ele levanta um dedo. "Carta náutica é outra coisa, {meu filho|minha filha}. Carta náutica tem que ter tudo que é pedra, porque pedra afunda barco."',
    '"Ela entra na carta como “recife alto sem nome”, e é por isso que ninguém sabe dela: porque quem lê carta náutica é pescador, e pescador não conta pra ninguém o que não dá peixe."',
    'Ele bebe.',
    '"Meu avô chamava de ilha da torre."',
    '"Tem torre?"',
    '"Não tem torre."',
    'Ele olha o mar.',
    '"Ele dizia que tinha tido."',
    'E depois, sem mudar o tom:',
    '"E de vez em quando, umas duas vezes por década, aparece luz em cima dela. À noite. Com cor."',
    'Ele te olha.',
    '"Você acredita em mim."',
    'Não é pergunta. É constatação, e ele parece cansado de a resposta ser sempre não.'
  ],
  ef:{npc:{nome:'Sr. Tanner', opiniao:2, memoria:'Te contou da ilha sem nome e do arco-íris noturno, e reparou que você acreditou.'},
      flag:'sabe_da_ilha', registrar:'Ouviu falar da ilha sem nome a sudoeste. Entra na carta náutica como "recife alto sem nome".',
      presagio:'Entra na carta náutica. A informação nunca esteve escondida — só estava no documento que ninguém lê.'},
  escolhas:[
    {texto:'"Duas vezes por década desde quando?"', vai:'c16_desde_quando'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'Não ir. Você já tem problema demais.', vai:'c16_nao_foi'}
  ]
},

c16_desde_quando:{
  texto:[
    '"Duas vezes por década desde quando?"',
    'Ele para de mexer no copo.',
    '"Boa pergunta."',
    'Ele se levanta, o que leva um tempo, e vai até o barco dele, e volta com uma caixa de charuto amarrada com elástico.',
    'Dentro tem papel.',
    'Muito papel: folha de caderno, verso de nota fiscal, guardanapo, e uns quarenta bilhetes em papel de pão.',
    'Cada um com uma data e uma linha.',
    '**"12/3/61 — luz sobre a ilha da torre, 23h mais ou menos, uns 30 min. — O. Tanner"**',
    '**"4/9/68 — luz, cor, 22h40 até 23h20. Meu pai viu junto. — Z. A."**',
    '**"19/11/74 — luz. Sozinho. Ninguém acreditou. — Z. A."**',
    '"Quarenta anos disso?"',
    '"Sessenta e um, {meu filho|minha filha}. Meu pai começou em trinta e nove e eu peguei em sessenta e um."',
    'Ele bate na caixa.',
    '"Vinte e três vezes anotadas em sessenta e um anos."'
  ],
  ef:{flag:['viu_a_caixa_de_charuto','tem_o_registro_da_ilha'],
      npc:{nome:'Sr. Tanner', opiniao:5, memoria:'Guarda numa caixa de charuto 61 anos de bilhetes com as datas do arco-íris noturno.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou desde quando, e a resposta era uma caixa de charuto'},
      registrar:'O arco-íris noturno sobre a ilha foi anotado 23 vezes em 61 anos, por pai e filho.',
      presagio:'Vinte e três vezes em sessenta e um anos. Isso é um dado. Ninguém nunca chamou de dado.'},
  escolhas:[
    {texto:'Ordenar as datas e procurar padrão.', vai:'c16_o_padrao'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'"Posso levar a caixa?"', vai:'c16_levou_a_caixa'}
  ]
},

c16_o_padrao:{
  texto:[
    'Você espalha os quarenta e poucos papéis na mesa de dominó e ordena por data, e o Sr. Tanner assiste sem ajudar, porque ele nunca ordenou.',
    'Ele guardou sessenta e um anos e nunca ordenou.',
    'Leva vinte minutos.',
    'E aí aparece.',
    'Trinta e nove, quarenta e seis, cinquenta e três, sessenta e um, sessenta e oito, setenta e quatro, oitenta e um, oitenta e oito, noventa e seis.',
    'Não é exatamente regular — varia de seis a oito anos — mas é um intervalo.',
    'E a última é de noventa e seis.',
    'Faz quatro anos.',
    'Você faz a conta na margem de um papel de pão.',
    'Se o intervalo for de seis, já passou. Se for de oito, é ano que vem.',
    'Se for sete, é este ano.',
    'O Sr. Tanner olha a tabela que você montou na mesa de dominó com quarenta papéis de pão e não fala nada por um tempo.',
    '"Sessenta e um anos", ele diz. "Eu nunca botei em ordem."'
  ],
  ef:{flag:['achou_o_padrao','sabe_que_e_esse_ano'],
      npc:{nome:'Sr. Tanner', opiniao:8, memoria:'Guardou 61 anos de bilhetes e nunca os pôs em ordem, até você fazer isso numa mesa de dominó.'},
      rep:{eixo:'bom',delta:5,motivo:'Ordenou sessenta e um anos de papel de pão'},
      instabilidade:1,
      registrar:'O arco-íris aparece a cada 6 a 8 anos. O último foi em 1996.',
      presagio:'Noventa e seis de novo. Guarde o ano — ele volta em toda cidade desde Saffron.'},
  escolhas:[
    {texto:'"Me leva lá. Agora."', vai:'c16_travessia'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'"O que aconteceu em noventa e seis?"', vai:'c16_noventa_e_seis'},
    {texto:'"Posso levar a caixa?"', vai:'c16_levou_a_caixa'}
  ]
},

c16_noventa_e_seis:{
  texto:[
    '"O que aconteceu em noventa e seis?"',
    'Ele procura o papel de noventa e seis na pilha ordenada e acha, porque agora está em ordem.',
    'É um pedaço de saco de pão com a letra dele.',
    '**"14/11/96 — luz. Muito mais forte. A noite toda. E de manhã tinha bicho na água."**',
    '"Bicho na água?"',
    '"Bicho na água. Eu tava saindo pra pescar às quatro da manhã e passou perto do meu barco, nadando, indo pra terra."',
    '"Que bicho?"',
    '"Três."',
    'Ele bate no papel.',
    '"Três bichos grandes nadando trinta quilômetros da ilha sem nome até a costa de Kanto, em fila, no dia seguinte ao arco-íris mais forte que eu vi na vida."',
    'Ele olha pra você.',
    '"E eu falei isso pra sete pessoas e as sete riram."',
    d=>d.flags.viu_os_tres || d.flags.sabe_dos_tres ? 'Você não ri.\nVocê conta o que você viu numa ciclovia, e o Sr. Tanner segura na beirada da mesa de dominó com as duas mãos.' : ''
  ],
  ef:{flag:['sabe_dos_tres_nadando','ligou_os_tres_a_ilha'],
      npc:{nome:'Sr. Tanner', opiniao:9, memoria:'Viu os três nadando da ilha para a costa em 14/11/1996 e sete pessoas riram dele.'},
      rep:{eixo:'bom',delta:6,motivo:'Ligou os três da ciclovia à ilha sem nome'},
      instabilidade:1,
      registrar:'Em 14/11/1996 os três atravessaram nadando da ilha sem nome até a costa de Kanto.',
      presagio:'Catorze de novembro de noventa e seis. Dois dias depois de um homem subir um vulcão em Cinnabar.'},
  escolhas:[
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'"Posso levar a caixa?"', vai:'c16_levou_a_caixa'},
    {texto:'Contar pra ele o que aconteceu em Cinnabar.', vai:'c16_contou_pro_ze', cond:d=>!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu}
  ]
},

c16_contou_pro_ze:{
  texto:[
    'Você conta.',
    'Doze de novembro de noventa e seis, num subsolo de Cinnabar, um homem abriu um tanque e saiu às quatro e dez da manhã com uma coisa andando do lado dele, no mesmo passo.',
    'Treze de novembro, os dois subiram um vulcão e passaram a noite na borda da cratera.',
    'Catorze de novembro, apareceu o arco-íris mais forte em sessenta e um anos sobre uma ilha a trinta quilômetros dali.',
    'E na manhã do quinze, três bichos grandes atravessaram nadando.',
    'O Sr. Tanner ouve tudo com as duas mãos na mesa.',
    'E no fim ele não fala nada por quase um minuto.',
    'Depois:',
    '"Então a luz não é ele chegando."',
    '"Como?"',
    '"Eu passei sessenta e um anos achando que a luz era uma coisa chegando na ilha."',
    'Ele olha os quarenta papéis em ordem.',
    '"A luz é ele fazendo uma coisa."'
  ],
  ef:{flag:['ze_entendeu','ligou_tudo'],
      npc:{nome:'Sr. Tanner', opiniao:10, memoria:'Entendeu, com você, que a luz não é uma chegada — é alguém fazendo alguma coisa.'},
      rep:{eixo:'bom',delta:6,motivo:'Juntou três capítulos numa mesa de dominó'},
      instabilidade:1, moral:15,
      registrar:'A luz sobre a ilha não é uma chegada: é alguém fazendo alguma coisa.',
      presagio:'Vinte e três vezes em sessenta e um anos, alguém fez alguma coisa naquela ilha.'},
  escolhas:[
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'"Posso levar a caixa?"', vai:'c16_levou_a_caixa'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'Ir com ele hoje mesmo.', vai:'c16_travessia'}
  ]
},

c16_levou_a_caixa:{
  texto:[
    '"Posso levar a caixa?"',
    'Ele olha a caixa de charuto amarrada com elástico.',
    '"Pra quê?"',
    '"Pra dar pra alguém que publique."',
    'Ele demora.',
    '"Isso aqui é do meu pai."',
    '"Eu sei."',
    '"Isso aqui é a única coisa que sobrou do meu pai, {meu filho|minha filha}, porque ele morreu no mar e a gente não achou e o enterro foi de caixão vazio."',
    'Silêncio na mesa de dominó.',
    'E aí ele empurra a caixa na sua direção com os dois dedos.',
    '"Leva."',
    '"Não precisa."',
    '"Leva." Ele empurra mais. "Sessenta e um anos guardado numa caixa de charuto embaixo do banco de um barco é a mesma coisa que não ter guardado."',
    'Ele ajeita o elástico.',
    '"Meu pai não anotou pra ficar numa caixa."'
  ],
  ef:{flag:['tem_a_caixa_de_charuto','provas_da_ilha'],
      itens:{'Caixa de charuto com 61 anos de bilhetes':1},
      npc:{nome:'Sr. Tanner', opiniao:10, memoria:'Te entregou a caixa de charuto do pai, que morreu no mar e teve enterro de caixão vazio.'},
      rep:{eixo:'bom',delta:6,motivo:'Recebeu sessenta e um anos de registro de quem tinha só isso'},
      moral:20,
      registrar:'Recebeu a caixa de charuto com 61 anos de registros do arco-íris.',
      presagio:'"Meu pai não anotou pra ficar numa caixa." Cumpra isso.'},
  escolhas:[
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'Levar a caixa à Dra. Cordell antes.', vai:'c16_ivone_caixa', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar a caixa à colônia de pescadores.', vai:'c16_colonia_caixa'}
  ]
},

c16_colonia_caixa:{
  texto:[
    'Você leva a caixa à Colônia Z-14 e a secretária de sessenta e dois anos abre o elástico com um cuidado que você não esperava.',
    'Ela lê três bilhetes e para.',
    '"O. Tanner."',
    '"A senhora conhece?"',
    '"Meu bem, eu tenho o livro de saída de embarcação de mil novecentos e trinta e nove."',
    'Ela vai ao armário e volta com o livro mais velho da pilha, com a capa descolando, e abre em março.',
    'E ali está: **FERRAZ, J. A. — saída 12/03 — área declarada: recife alto SW**.',
    'A mesma data do primeiro bilhete.',
    '"Ele declarou o recife como área de pesca em trinta e nove."',
    'Ela vira mais páginas.',
    '"E em quarenta e seis. E em cinquenta e três."',
    'Ela levanta a cabeça.',
    '"Meu bem, esse homem declarou saída pra ilha em todas as vinte e três datas da caixa."',
    '"E isso quer dizer o quê?"',
    '"Que ele não via da costa."',
    'Ela fecha o livro.',
    '"Ele ia."'
  ],
  ef:{flag:['descobriu_que_ele_ia','provas_da_ilha'],
      npc:{nome:'Secretária da Colônia Z-14', opiniao:8, memoria:'Cruzou a caixa de charuto com o livro de 1939 e descobriu que o velho Tanner ia à ilha.'},
      rep:{eixo:'bom',delta:6,motivo:'Cruzou a caixa com o livro de 1939'},
      instabilidade:1,
      registrar:'O. Tanner declarou saída para a ilha em todas as 23 datas do arco-íris, desde 1939.',
      presagio:'Ele ia. Sessenta e um anos e o filho achava que era da costa.'},
  escolhas:[
    {texto:'Contar isso pro Sr. Tanner.', vai:'c16_contou_que_ele_ia'},
    {texto:'"Me leva lá."', vai:'c16_travessia'},
    {texto:'Levar tudo à Dra. Cordell.', vai:'c16_ivone_caixa', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir direto pra ilha sozinh{o|a}.', vai:'c16_travessia'}
  ]
},

c16_contou_que_ele_ia:{
  texto:[
    'Você volta ao cais com a caixa e com a fotocópia de três páginas do livro de mil novecentos e trinta e nove.',
    'O Sr. Tanner lê a linha do nome do pai dele.',
    'E lê de novo.',
    'E depois ele faz uma coisa que ninguém no cais esperava, porque tem umas doze pessoas assistindo:',
    'ele ri.',
    'Ri alto, sozinho, no meio do cais, com uma folha xerocada na mão.',
    '"O velho sacana."',
    'Ele bate na mesa de dominó.',
    '"Ele ia! Ele ia e chegava em casa e falava que tinha visto da linha do horizonte, pra minha mãe não brigar!"',
    'Ele ri mais, e depois para de rir de uma vez, do jeito que velho para.',
    '"Ele morreu numa saída pra lá."',
    'Ele olha a folha.',
    '"Treze de outubro de setenta e nove. Tá aqui a saída e não tem retorno."',
    'Ele dobra a folha e guarda no bolso da camisa.',
    '"Quarenta anos eu conto essa história e eu nunca soube por que ela é minha."'
  ],
  ef:{flag:['ze_sabe_do_pai','ze_vai_junto'],
      npc:{nome:'Sr. Tanner', opiniao:10, memoria:'Descobriu que o pai ia à ilha, e que morreu numa saída para lá em 13/10/1979.'},
      rep:{eixo:'bom',delta:7,motivo:'Devolveu a um velho o motivo da própria história'},
      moral:25,
      registrar:'O pai do Sr. Tanner morreu numa saída para a ilha sem nome, em 13/10/1979.',
      presagio:'"Eu nunca soube por que ela é minha." Agora ele sabe, e agora ele vai.'},
  escolhas:[
    {texto:'"Então vamos os dois."', vai:'c16_travessia'},
    {texto:'"O senhor não precisa ir."', vai:'c16_nao_precisa_ir'},
    {texto:'Levar tudo à Dra. Cordell antes.', vai:'c16_ivone_caixa', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir sozinh{o|a}.', vai:'c16_travessia'}
  ]
},

c16_nao_precisa_ir:{
  texto:[
    '"O senhor não precisa ir."',
    'Ele guarda a folha xerocada no bolso e bate duas vezes em cima.',
    '"Eu tenho oitenta e um anos, um barco de sete metros e uma próstata que não deixa eu dormir."',
    '"Eu sei."',
    '"E eu tenho onze horas de travessia numa direção e onze na outra, e eu já fiz essa travessia duas vezes na vida e nas duas eu voltei sem ver nada."',
    'Ele olha o mar.',
    '"E agora eu sei que meu pai fez vinte e três."',
    'Ele começa a soltar a amarra.',
    '"Sobe no barco, {meu filho|minha filha}."'
  ],
  ef:{flag:'ze_vai_junto',
      npc:{nome:'Sr. Tanner', opiniao:10, memoria:'Recusou ficar. Vai fazer a travessia que o pai fez vinte e três vezes.'},
      rep:{eixo:'bom',delta:3,motivo:'Ofereceu e aceitou o não'},
      moral:15,
      presagio:'Ele já fez duas e voltou sem ver nada. Essa é a terceira.'},
  escolhas:[{texto:'Subir no barco.', vai:'c16_travessia'}]
},

c16_ivone_caixa:{
  texto:[
    'A Dra. Cordell recebe a caixa de charuto numa mesa de lanchonete de rodoviária, porque é sempre numa mesa de lanchonete de rodoviária.',
    'Ela abre o elástico, tira os papéis, e a primeira coisa que ela faz é contar quantos são.',
    'Quarenta e três.',
    'E a segunda coisa que ela faz é pedir uma caneta emprestada ao balconista e numerar cada um no canto, a lápis, de um a quarenta e três.',
    '"O que a senhora tá fazendo?"',
    '"Cadeia de custódia."',
    'Ela numera o vigésimo.',
    '"Isso aqui é a coisa mais valiosa que alguém já me deu, e é um saco de pão com letra de pescador, e se eu publicar isso sem numerar e sem fotografar alguém vai dizer que eu escrevi."',
    'Ela termina de numerar e tira uma foto de cada um.',
    'Quarenta e três fotos.',
    '"E agora?"',
    '"E agora eu devolvo."',
    'Ela amarra o elástico de volta e empurra a caixa pra você.',
    '"Isso é do homem. Eu fico com a foto."'
  ],
  ef:{flag:['ivone_tem_a_ilha','provas_da_ilha'],
      npc:{nome:'Dra. Cordell', opiniao:9, memoria:'Numerou e fotografou os 43 bilhetes da caixa de charuto e devolveu a caixa.'},
      rep:{eixo:'bom',delta:5,motivo:'Levou a caixa a quem soube o que fazer com ela'},
      moral:12,
      registrar:'A Dra. Cordell fotografou e numerou os 43 bilhetes e devolveu a caixa ao dono.',
      presagio:'"Eu fico com a foto." Anota como se preserva uma coisa sem tomar ela.'},
  escolhas:[
    {texto:'Devolver a caixa ao Sr. Tanner e ir pra ilha.', vai:'c16_travessia'},
    {texto:'"A senhora vem junto?"', vai:'c16_ivone_vem'},
    {texto:'Ir pra ilha sozinh{o|a}.', vai:'c16_travessia'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'}
  ]
},

c16_ivone_vem:{
  texto:[
    '"A senhora vem junto?"',
    'Ela ri e diz não antes de você terminar a pergunta.',
    '"Eu tenho cinquenta e oito anos, enjoo em barco parado e uma matéria pra fechar."',
    'Ela guarda a câmera.',
    '"E eu vou te dizer uma coisa que eu levei trinta anos pra aprender, porque você é novo e ainda dá tempo."',
    '"O quê?"',
    '"Eu não preciso ver."',
    'Ela bebe o café.',
    '"Metade dos jornalistas que eu conheci se perderam porque queriam estar lá. Querer estar lá é vaidade, meu bem, e vaidade é ruim de checar."',
    '"Eu preciso que alguém tenha estado lá e me conte, e que a conta bata com o papel."',
    'Ela paga o café dos dois.',
    '"Vai você. Eu confiro."'
  ],
  ef:{flag:'ivone_confere',
      npc:{nome:'Dra. Cordell', opiniao:9, memoria:'Explicou por que não vai: querer estar lá é vaidade, e vaidade é ruim de checar.'},
      rep:{eixo:'bom',delta:2,motivo:'Convidou e recebeu uma aula'},
      presagio:'"Vai você. Eu confiro." Anota a divisão de trabalho.'},
  escolhas:[
    {texto:'Ir pra ilha.', vai:'c16_travessia'},
    {texto:'Devolver a caixa ao Sr. Tanner antes.', vai:'c16_contou_que_ele_ia'},
    {texto:'"Quem mais sabe disso?"', vai:'c16_quem_sabe'},
    {texto:'Ir sozinh{o|a}, sem o Sr. Tanner.', vai:'c16_travessia'}
  ]
},

c16_quem_sabe:{
  texto:[
    '"Quem mais sabe disso?"',
    '"Todo pescador velho de Fuchsia sabe. Nenhum pescador novo acredita."',
    'Ele cospe no chão do cais, que é uma coisa que ele faz quando vai dizer uma coisa que incomoda.',
    '"E teve gente de fora perguntando, faz uns três meses."',
    '"Gente de fora?"',
    '"Gente de terno, num carro bom, perguntando de ilha sem mapa. Dois. Um moço e uma moça, os dois de trinta e poucos, educados demais."',
    '"E o senhor falou?"',
    '"Eu falei que não sabia de nada."',
    'Ele olha pra você.',
    '"Com você eu falei. Você não tem carro."',
    'E depois, mais baixo:',
    '"E porque a moça perguntou uma coisa errada."',
    '"O quê?"',
    '"Ela perguntou se a ilha tinha “janela de ocorrência regular”."',
    'Ele bate na mesa.',
    '"Isso não é jeito de perguntar de uma luz no céu, {meu filho|minha filha}. Isso é jeito de perguntar de um horário de ônibus."'
  ],
  ef:{flag:['outros_procuram_a_ilha','sabe_da_janela'],
      npc:{nome:'Sr. Tanner', opiniao:6, memoria:'Não contou nada aos dois de terno porque a moça perguntou de "janela de ocorrência regular".'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou quem mais sabia'},
      registrar:'Duas pessoas de terno procuram a ilha há três meses, perguntando por "janela de ocorrência regular".',
      presagio:'Janela de ocorrência regular. Alguém já ordenou as datas antes de você.'},
  escolhas:[
    {texto:'"Então a gente tem que ir antes deles."', vai:'c16_travessia'},
    {texto:'"Duas vezes por década desde quando?"', vai:'c16_desde_quando'},
    {texto:'"Como era o carro?"', vai:'c16_o_carro'},
    {texto:'Deixar pra lá.', vai:'c16_nao_foi'}
  ]
},

c16_o_carro:{
  texto:[
    '"Como era o carro?"',
    'Ele descreve com uma precisão que você já aprendeu a esperar de gente de cais: modelo, cor, ano aproximado, e o detalhe.',
    '"Utilitário, prata, uns três anos de uso, com o para-choque de trás amassado do lado direito."',
    d=>d.flags.anotou_as_placas ? 'Você para de escrever.\nVocê já viu esse carro. Nível 3 da garagem da Silph, vaga 11-D, com uma caixa de papelão aberta no porta-malas e uma pasta marcada PROJ. 11 — SÉRIE 3 — ENCERRAMENTO.' :
       'Você anota. Utilitário prata com o para-choque de trás amassado do lado direito. É pouco e é específico, que é a melhor combinação que existe.',
    'E ele acrescenta, sem você perguntar:',
    '"E tinha um adesivo no vidro de trás. Redondinho, azul, com número."',
    '"Que número?"',
    '"Onze."'
  ],
  ef:{flag:['reconheceu_o_carro','outros_procuram_a_ilha'],
      npc:{nome:'Sr. Tanner', opiniao:7, memoria:'Descreveu o carro dos dois de terno com o adesivo azul número 11 no vidro traseiro.'},
      rep:{eixo:'bom',delta:5,motivo:'Perguntou como era o carro'},
      instabilidade:1,
      registrar:'O carro dos dois de terno tem um adesivo azul com o número 11 no vidro traseiro.',
      presagio:'Adesivo de vaga de garagem. Eles nem tiraram.'},
  escolhas:[
    {texto:'"Me leva lá. Hoje."', vai:'c16_travessia'},
    {texto:'"Duas vezes por década desde quando?"', vai:'c16_desde_quando'},
    {texto:'Avisar a Dra. Cordell antes.', vai:'c16_ivone_caixa', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir hoje mesmo, sozinh{o|a} se preciso.', vai:'c16_travessia'}
  ]
},

c16_nao_foi:{
  texto:[
    'Você não vai.',
    'É defensável: onze horas de travessia num barco de sete metros com um homem de oitenta e um anos, até uma ilha sem água doce, atrás de uma luz que aparece duas vezes por década.',
    'Dois meses depois, alguém vai.',
    'Não você.',
    'O que acontece na ilha nesses dois meses você só descobre por notícia, e notícia sobre coisa lendária é sempre pequena, sempre tarde e sempre no rodapé.',
    'E o Sr. Tanner continua contando a história no cais, e as pessoas continuam mudando de assunto educadamente, e agora você é uma delas.'
  ],
  ef:{flag:'nao_foi_a_ilha', instabilidade:1, moral:-15,
      npc:{nome:'Sr. Tanner', opiniao:-1, memoria:'Você acreditou nele e não foi, o que é pior do que não ter acreditado.'},
      registrar:'Não foi à ilha sem nome. Outra pessoa foi.',
      presagio:'Agora você é uma delas.'},
  escolhas:[
    {texto:'Mudar de ideia e ir.', vai:'c16_travessia'},
    {texto:'Voltar e ouvir a história inteira de novo.', vai:'c16_desde_quando'},
    {texto:'Levar a caixa dele a quem publique.', vai:'c16_levou_a_caixa'},
    {texto:'Seguir.', vai:'c16_fim'}
  ]
},

/* ─────────────── A TRAVESSIA E A ILHA ─────────────── */

c16_travessia:{
  texto:[
    'A travessia leva onze horas num barco de pesca de sete metros com motor de quarenta cavalos e um toldo de lona.',
    'Onze horas é muito tempo.',
    'Nas três primeiras vocês conversam. Nas três seguintes o Sr. Tanner dorme sentado com a mão no leme e acorda a cada vinte minutos pra corrigir o rumo, e depois dorme de novo, e isso é a coisa mais tranquilizadora que já aconteceu com você num barco.',
    'Nas cinco últimas ninguém fala nada e o sol desce.',
    'A ilha aparece ao anoitecer e é exatamente o que ele descreveu:',
    'pedra e mato. Sem praia, sem cais, sem enseada.',
    'Um bloco de rocha de uns oitocentos metros de comprimento com uns sessenta de altura, com a face oeste cortada a pique e a leste em rampa de pedregulho.',
    'E no topo dela, no ponto mais alto, tem uma coisa que não é pedra natural.',
    'Uma base retangular de alvenaria antiga, com uns doze metros de lado, com as linhas retas demais pra ser geologia.',
    'Alicerce de torre.',
    'Só o alicerce.',
    'O resto não existe há séculos.'
  ],
  ef:{flag:'chegou_na_ilha',
      registrar:'Chegou à ilha sem nome. Há um alicerce de torre de 12 metros de lado no topo.',
      presagio:'Doze metros de lado. Alguém carregou pedra até aqui num barco.'},
  escolhas:[
    {texto:'Subir até o alicerce agora.', vai:'c16_alicerce'},
    {texto:'Acampar e esperar a noite.', vai:'c16_esperou_noite'},
    {texto:'Dar a volta na ilha de barco antes.', vai:'c16_volta_de_barco'},
    {texto:'Procurar água doce.', vai:'c16_procurou_agua'}
  ]
},

c16_volta_de_barco:{
  texto:[
    'Vocês dão a volta na ilha antes de desembarcar, o que leva quarenta minutos e que é ideia do Sr. Tanner, porque pescador nunca desembarca sem dar a volta.',
    'E a volta rende três coisas.',
    'Primeira: na face norte, a uns dez metros acima da linha d’água, tem um degrau.',
    'Um degrau cortado na rocha, de uns oitenta centímetros, com o corte reto e muito gasto — e acima dele mais um, e mais um, subindo a face norte em zigue-zague até sumir na vegetação.',
    'Uma escada de rocha cortada à mão, na única face que não dá pra ver da costa.',
    'Segunda: no pé da escada, no nível da água, tem argolas.',
    'Quatro argolas de ferro forjado chumbadas na rocha, enferrujadas até a metade da espessura, na altura certa pra amarrar barco.',
    'Terceira: numa das argolas tem corda.',
    'Corda de náilon azul. Náilon.',
    'Náilon não existia quando forjaram essas argolas e não enferruja em vinte anos.',
    'Alguém amarrou um barco aqui recentemente.'
  ],
  ef:{flag:['achou_a_escada','outros_estiveram_la'],
      rep:{eixo:'bom',delta:4,motivo:'Deu a volta na ilha antes de desembarcar'},
      registrar:'Há uma escada cortada na rocha na face norte, com quatro argolas de amarração antigas — e corda de náilon numa delas.',
      presagio:'Corda de náilon numa argola forjada à mão. Duzentos anos de diferença na mesma argola.'},
  escolhas:[
    {texto:'Desembarcar pela escada.', vai:'c16_subiu_a_escada'},
    {texto:'Desembarcar pela rampa leste, longe da corda.', vai:'c16_alicerce'},
    {texto:'Esperar a noite antes de subir.', vai:'c16_esperou_noite'},
    {texto:'Procurar o barco da corda.', vai:'c16_procurou_o_barco'}
  ]
},

c16_procurou_o_barco:{
  texto:[
    'Vocês procuram o barco da corda por mais quarenta minutos e não acham, porque não tem barco.',
    'A corda está amarrada na argola com um nó de pescador, cortada na ponta, com uns quatro metros de sobra na água.',
    'O Sr. Tanner puxa a corda com o gancho e olha a ponta cortada.',
    '"Cortaram do lado de lá."',
    '"Como o senhor sabe?"',
    '"Porque o corte é limpo e a ponta tá desfiando pra fora." Ele mostra. "Corda cortada com faca desfia pro lado de quem cortou."',
    'Ele solta a corda na água.',
    '"Quem tava amarrado aqui saiu com pressa e cortou em vez de desamarrar."',
    'Ele olha a escada na rocha.',
    '"E quem corta corda em vez de desamarrar ou tá com muita pressa ou tá com alguém em cima do barco."'
  ],
  ef:{flag:['sabe_da_corda_cortada','outros_estiveram_la'],
      npc:{nome:'Sr. Tanner', opiniao:7, memoria:'Leu o desfiado da corda e concluiu que quem estava amarrado ali saiu com pressa.'},
      rep:{eixo:'bom',delta:3,motivo:'Puxou a corda e olhou a ponta'},
      registrar:'A corda de náilon foi cortada com faca, do lado de fora. Alguém saiu com pressa.',
      presagio:'Ou muita pressa, ou alguém em cima do barco.'},
  escolhas:[
    {texto:'Subir pela escada.', vai:'c16_subiu_a_escada'},
    {texto:'Desembarcar pela rampa leste.', vai:'c16_alicerce'},
    {texto:'Esperar a noite.', vai:'c16_esperou_noite'},
    {texto:'Procurar quem cortou.', vai:'c16_botas'}
  ]
},

c16_subiu_a_escada:{
  texto:[
    'A escada tem cento e quatro degraus.',
    'Você conta porque contar é o que você aprendeu a fazer quando não dá pra fazer mais nada.',
    'Cento e quatro degraus cortados à mão na rocha viva de uma ilha a onze horas da costa.',
    'E os degraus são gastos no meio.',
    'Gastos no meio quer dizer uso. Muito uso, por muito tempo, por muita gente — porque um pé só não gasta pedra: uma geração gasta.',
    'Na metade da subida você para pra respirar e repara numa coisa nos degraus.',
    'Alguns têm entalhe na lateral. Uma linha vertical, riscada, de uns três centímetros.',
    'Você começa a contar as linhas.',
    'Vinte e três.',
    'Vinte e três linhas riscadas na lateral dos degraus dessa escada, e vinte e três bilhetes numa caixa de charuto no barco lá embaixo.',
    d=>d.flags.tem_a_caixa_de_charuto ? 'E as duas contagens não podem ter a mesma origem, porque a caixa começa em trinta e nove e essa pedra está gasta há séculos.\nA não ser que a coisa aconteça a cada seis, sete ou oito anos, há muito mais tempo do que sessenta e um anos.\nVocê senta no degrau e faz a conta que dói: se for assim desde que cortaram essa escada, são centenas.' : ''
  ],
  ef:{flag:['contou_os_degraus','viu_os_entalhes'],
      rep:{eixo:'bom',delta:5,motivo:'Contou os degraus e reparou nos entalhes'},
      instabilidade:1,
      registrar:'A escada da face norte tem 104 degraus gastos e 23 entalhes na lateral.',
      presagio:'Vinte e três. O mesmo número da caixa de charuto e não pode ser coincidência e não pode ser a mesma contagem.'},
  escolhas:[
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    {texto:'Procurar mais entalhes nos degraus de baixo.', vai:'c16_mais_entalhes'},
    {texto:'Chamar o Sr. Tanner pra ver.', vai:'c16_ze_viu_os_entalhes'},
    {texto:'Esperar a noite antes de subir.', vai:'c16_esperou_noite'}
  ]
},

c16_mais_entalhes:{
  texto:[
    'Você desce de novo e procura direito, degrau por degrau, com a lanterna de lado pra pegar sombra na lateral.',
    'Leva uma hora e você acha o que não queria achar.',
    'Não são vinte e três.',
    'São vinte e três **novos**.',
    'Embaixo deles, na mesma lateral, tem mais riscos — mais rasos, quase apagados pela erosão, mas em grupos de cinco, riscados em conjunto, do jeito que se conta em cinco.',
    'Você conta os grupos.',
    'Você conta os grupos duas vezes porque na primeira você errou.',
    'Sessenta e um grupos de cinco.',
    'Trezentos e cinco.',
    'Trezentas e cinco vezes, riscadas na lateral de uma escada de pedra, por gente que morreu antes de Kanto ter esse nome.',
    'E as vinte e três mais novas são de pai e filho Tanner.',
    'Eles continuaram a contagem de alguém.'
  ],
  ef:{flag:['contou_os_riscos','sabe_dos_trezentos_e_cinco'],
      rep:{eixo:'bom',delta:6,motivo:'Desceu e contou de novo'},
      instabilidade:2, moral:-8,
      registrar:'Há 305 marcas antigas na escada, em grupos de cinco, mais as 23 dos Tanner.',
      presagio:'Eles continuaram a contagem de alguém. Sem saber que estavam continuando.'},
  escolhas:[
    {texto:'Chamar o Sr. Tanner pra ver.', vai:'c16_ze_viu_os_entalhes'},
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    {texto:'Riscar o trezentos e vinte e nove.', vai:'c16_riscou'},
    {texto:'Esperar a noite.', vai:'c16_esperou_noite'}
  ]
},

c16_ze_viu_os_entalhes:{
  texto:[
    'Ele sobe. Leva quarenta minutos pra subir cinquenta degraus e não aceita ajuda em nenhum.',
    'Você mostra as vinte e três, e ele passa o dedo em cada uma, em ordem, subindo.',
    'E na décima nona ele para.',
    'Porque a décima nona é diferente das outras: é mais funda, feita com mais força, e tem uma coisa ao lado dela.',
    'Uma letra.',
    '**Z**',
    '"Setenta e nove", ele diz.',
    '"O quê?"',
    '"A décima nona é setenta e nove. Treze de outubro."',
    'Ele senta no degrau.',
    '"Meu pai riscou essa aí e botou a inicial do meu nome."',
    'Ele passa o dedo na letra.',
    '"E não voltou."',
    'Ele fica um tempo sentado no degrau cento e quatro menos cinquenta e quatro, a onze horas da costa, aos oitenta e um anos.',
    '"Ele riscou meu nome antes."'
  ],
  ef:{flag:['achou_a_marca_do_pai','ze_vai_junto'],
      npc:{nome:'Sr. Tanner', opiniao:10, memoria:'Achou na escada a marca que o pai fez em 1979, com a inicial dele ao lado, antes de não voltar.'},
      rep:{eixo:'bom',delta:7,motivo:'Levou um velho até a marca que o pai dele deixou'},
      moral:25, instabilidade:1,
      registrar:'Na escada, a marca de 13/10/1979 tem um Z riscado ao lado.',
      presagio:'Ele riscou o nome do filho antes de subir. Pensa no que ele esperava.'},
  escolhas:[
    {texto:'Riscar a próxima marca junto com ele.', vai:'c16_riscou'},
    {texto:'Subir até o alicerce com ele.', vai:'c16_alicerce'},
    {texto:'Esperar a noite ali mesmo, no degrau.', vai:'c16_esperou_noite'},
    {texto:'Deixar ele sozinh{o|a} um tempo.', vai:'c16_alicerce'}
  ]
},

c16_riscou:{
  texto:[
    'Você tira a faca e risca um traço na lateral do próximo degrau.',
    d=>d.flags.achou_a_marca_do_pai ? 'O Sr. Tanner segura a sua mão antes de você terminar.\n"Deixa eu."\nE ele risca. Devagar, com a mão ruim, levando uns quatro minutos pra fazer três centímetros.\nE do lado ele risca uma letra.\nNão é Z.\nÉ F.\n"Tanner", ele diz. "Meu pai também era."' :
       'Fica torto e raso e leva uns quatro minutos, porque riscar rocha com faca é muito mais difícil do que parece e é exatamente por isso que as marcas antigas importam.',
    'Você senta no degrau depois.',
    'Alguém vai subir essa escada daqui a cem anos e contar as marcas e a sua vai estar lá, no meio, sem nome e sem data, e vai entrar na conta.'
  ],
  ef:{flag:'riscou_o_degrau',
      rep:{eixo:'bom',delta:4,motivo:'Entrou numa contagem de trezentos anos'},
      moral:20,
      registrar:'Riscou a próxima marca na escada da ilha.',
      presagio:'Vai entrar na conta. É o máximo que quase todo mundo consegue.'},
  escolhas:[
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    {texto:'Esperar a noite no degrau.', vai:'c16_esperou_noite'},
    {texto:'Procurar quem cortou a corda.', vai:'c16_botas'},
    {texto:'Descer e dar a volta na ilha.', vai:'c16_volta_de_barco'}
  ]
},

c16_procurou_agua:{
  texto:[
    'Você procura água doce por três horas, porque o Sr. Tanner diz que não tem e você quer conferir, e conferir o que os velhos dizem é uma coisa que você aprendeu a fazer e que dá certo metade das vezes.',
    'Não tem.',
    'Não tem nascente, não tem poça, não tem depressão úmida, e o mato da ilha é todo de espécie que vive de neblina.',
    'Mas você acha outra coisa.',
    'Na face leste, na rampa de pedregulho, encaixada entre duas pedras e invisível de qualquer ângulo que não seja de cima: uma cisterna.',
    'Uma cisterna de alvenaria, redonda, de uns dois metros de diâmetro e não dá pra saber quantos de profundidade, com a boca coberta por uma laje de pedra rachada ao meio.',
    'Cisterna de captação de chuva.',
    'Quem morava aqui — e alguém morou aqui, porque ninguém constrói cisterna pra visita — bebia chuva.'
  ],
  ef:{flag:['achou_a_cisterna','alguem_morou_aqui'],
      rep:{eixo:'bom',delta:4,motivo:'Conferiu o que o velho disse e achou outra coisa'},
      registrar:'Há uma cisterna de captação de chuva na face leste da ilha. Alguém morou aqui.',
      presagio:'Ninguém constrói cisterna pra visita.'},
  escolhas:[
    {texto:'Olhar dentro da cisterna.', vai:'c16_dentro_da_cisterna'},
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    {texto:'Chamar o Sr. Tanner.', vai:'c16_alicerce'},
    {texto:'Esperar a noite.', vai:'c16_esperou_noite'}
  ]
},

c16_dentro_da_cisterna:{
  texto:[
    'Você empurra a metade rachada da laje, o que leva vinte minutos e toda a sua força, e aponta a lanterna pra dentro.',
    'A cisterna tem uns quatro metros de profundidade e está seca há muito tempo.',
    'No fundo tem folha, terra, e coisa.',
    'Você desce com a corda do barco.',
    'No fundo de uma cisterna seca numa ilha a onze horas da costa tem: cacos de cerâmica vidrada, dois cabos de ferramenta de madeira apodrecida, uma placa de metal do tamanho de uma mão, e ossos de peixe.',
    'Muito osso de peixe.',
    'A placa de metal é de bronze, oxidada verde, e tem coisa gravada de um lado.',
    'Você limpa com a manga.',
    'Não é escrita que você conheça. São sete linhas de traços verticais de alturas diferentes, agrupados, com espaço regular entre os grupos.',
    'Sete linhas.',
    'E embaixo delas, gravado depois — com ferramenta diferente, mais tosca, e em letra que você reconhece porque é letra de alfabeto — quatro palavras:',
    '**"eles voltaram. nós ficamos."**'
  ],
  ef:{flag:['achou_a_placa','provas_da_ilha'],
      itens:{'Placa de bronze':1},
      rep:{eixo:'bom',delta:7,motivo:'Desceu quatro metros numa cisterna seca'},
      instabilidade:2, moral:-10,
      registrar:'No fundo da cisterna há uma placa de bronze com sete linhas de traços e a frase "eles voltaram. nós ficamos."',
      presagio:'"Eles voltaram. Nós ficamos." Duas frases e um ponto entre elas.'},
  escolhas:[
    {texto:'Subir e mostrar pro Sr. Tanner.', vai:'c16_mostrou_a_placa'},
    {texto:'Subir até o alicerce com a placa.', vai:'c16_alicerce'},
    {texto:'Procurar mais coisa no fundo.', vai:'c16_mais_no_fundo'},
    {texto:'Deixar a placa e subir.', vai:'c16_alicerce'}
  ]
},

c16_mais_no_fundo:{
  texto:[
    'Você cava o fundo da cisterna com as mãos por mais uma hora, com a lanterna presa na axila, num espaço de dois metros de diâmetro a quatro de profundidade.',
    'Debaixo de trinta centímetros de folha e terra, encostado na parede, tem uma coisa que você demora a identificar porque ela não devia estar ali.',
    'Um degrau.',
    'Um degrau de pedra, do mesmo corte dos cento e quatro da face norte, embutido na parede da cisterna e indo pra baixo.',
    'A cisterna não é uma cisterna.',
    'A cisterna é a boca de uma escada, e alguém encheu ela de folha e terra em algum século, ou o tempo encheu.',
    'Você cava mais três degraus e para, porque cavar quatro metros de terra com as mãos é impossível e porque o ar lá embaixo já está ficando ruim.',
    'Você sobe.',
    'E lá em cima, na luz, você fica sentad{o|a} na borda da cisterna por um tempo bem longo pensando na diferença entre "não tem água doce nessa ilha" e "não tem mais".'
  ],
  ef:{flag:['achou_a_escada_de_baixo','alguem_morou_aqui'],
      rep:{eixo:'bom',delta:6,motivo:'Cavou uma hora no fundo de uma cisterna'},
      instabilidade:1, hp:-4, causa:'Uma hora cavando num poço de quatro metros',
      registrar:'A cisterna é a boca de uma escada que desce, soterrada.',
      presagio:'A diferença entre "não tem" e "não tem mais". Guarde.'},
  escolhas:[
    {texto:'Mostrar pro Sr. Tanner.', vai:'c16_mostrou_a_placa'},
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    {texto:'Esperar a noite.', vai:'c16_esperou_noite'},
    {texto:'Marcar o lugar e ir pro alicerce.', vai:'c16_alicerce'}
  ]
},

c16_mostrou_a_placa:{
  texto:[
    'O Sr. Tanner segura a placa de bronze com as duas mãos e olha as sete linhas de traços por muito tempo.',
    '"Isso é escrita?"',
    '"Acho que é."',
    '"De quem?"',
    '"De quem morava aqui."',
    'Ele vira a placa e lê as quatro palavras em letra de alfabeto.',
    '"Eles voltaram. Nós ficamos."',
    'Ele lê em voz alta três vezes.',
    '"Eles quem?"',
    d=>d.flags.sabe_dos_tres_nadando ? 'E você não responde, porque você já sabe, e porque falar em voz alta ia ser pior.\nMas ele chega sozinho: ele olha o mar na direção de Kanto, e depois a placa, e depois o mar.\n"Ah."\nSó isso. "Ah."' :
       '"Eu não sei."',
    'Ele devolve a placa.',
    '"Guarda você. Eu já tenho a caixa."'
  ],
  ef:{flag:'ze_viu_a_placa',
      npc:{nome:'Sr. Tanner', opiniao:9, memoria:'Leu a placa de bronze três vezes em voz alta e entendeu sozinho.'},
      rep:{eixo:'bom',delta:3,motivo:'Mostrou a placa a quem tinha direito de ver primeiro'},
      moral:10,
      presagio:'"Eles voltaram. Nós ficamos." Você vai reler isso no último capítulo.'},
  escolhas:[
    {texto:'Subir até o alicerce.', vai:'c16_alicerce'},
    {texto:'Esperar a noite.', vai:'c16_esperou_noite'},
    {texto:'Procurar quem cortou a corda.', vai:'c16_botas'},
    {texto:'Voltar à cisterna e cavar mais.', vai:'c16_mais_no_fundo'}
  ]
},

c16_esperou_noite:{
  texto:[
    'Você acampa na base da subida e espera.',
    d=>d.flags.ze_vai_junto ? 'O Sr. Tanner fica no barco, a duzentos metros da costa, com a luz de posição acesa, porque ele não dorme em terra desde mil novecentos e sessenta e oito e não vai começar hoje.' :
       'O Sr. Tanner fica no barco, a duzentos metros da costa, com a luz de posição acesa.',
    'Às vinte e três e dez, começa.',
    'Não é arco-íris.',
    'Arco-íris precisa de sol e de chuva, e não tem nem um nem outro, e arco-íris é um arco e isso não é.',
    'É uma faixa de luz colorida no céu, imóvel, ancorada exatamente sobre o alicerce, subindo reta uns duzentos metros e abrindo em leque no alto.',
    'E ela não pisca e não oscila e não faz barulho nenhum.',
    'Fica quarenta minutos.',
    'E some de uma vez, sem esmaecer.',
    'No barco, a duzentos metros, um homem de oitenta e um anos está de pé olhando pra cima.',
    'Quarenta anos contando essa história e é a primeira vez que ele vê com alguém junto.'
  ],
  ef:{flag:'viu_o_arco_iris',
      rep:{eixo:'bom',delta:3,motivo:'Deu razão a um velho que ninguém acreditava'},
      npc:{nome:'Sr. Tanner', opiniao:9, memoria:'Viu o arco-íris noturno junto com você, depois de quarenta anos vendo sozinho.'},
      moral:15,
      registrar:'Viu o arco-íris noturno sobre o alicerce, das 23h10 às 23h50.',
      presagio:'Não pisca, não oscila, não faz barulho. Não é fenômeno: é sinal.'},
  escolhas:[
    {texto:'Subir agora.', vai:'c16_alicerce'},
    {texto:'Esperar amanhecer e subir de dia.', vai:'c16_alicerce'},
    {texto:'Voltar ao barco e ficar com ele.', vai:'c16_ficou_com_o_ze'},
    {texto:'Riscar a marca no degrau antes de subir.', vai:'c16_riscou'}
  ]
},

c16_ficou_com_o_ze:{
  texto:[
    'Você volta ao barco e fica.',
    'Ele não fala nada por uns dez minutos e depois fala sem parar por uma hora, o que é a coisa mais normal do mundo com alguém que passou quarenta anos sem ser acreditado.',
    'Ele conta do pai. Da mãe, que não deixava ele sair de noite. Do irmão que foi pra Vermilion em cinquenta e nove e nunca mais voltou. De um Growlithe chamado Tampa.',
    'Às duas da manhã ele para de falar no meio de uma frase e olha a ilha.',
    '"Eu vou morrer em uns três anos."',
    '"O senhor não sabe disso."',
    '"Eu sei." Ele ajeita o boné. "E tá tudo bem, {meu filho|minha filha}, porque eu vi."',
    'Ele bate na borda do barco.',
    '"Eu vi e teve testemunha."',
    'E é essa a coisa que ele precisava a vida inteira: não ver. Ter testemunha.'
  ],
  ef:{flag:'noite_com_o_ze',
      npc:{nome:'Sr. Tanner', opiniao:10, memoria:'Falou uma hora sem parar e disse que está tudo bem porque agora teve testemunha.'},
      rep:{eixo:'bom',delta:4,motivo:'Ficou no barco e ouviu uma hora'},
      moral:20, hp:2,
      registrar:'"Eu vi e teve testemunha."',
      presagio:'Ele não precisava ver. Ele precisava de testemunha. Ninguém nunca precisa só ver.'},
  escolhas:[
    {texto:'Subir de manhã.', vai:'c16_alicerce'},
    {texto:'Subir agora, no escuro.', vai:'c16_alicerce'},
    {texto:'Dormir no barco e subir depois.', vai:'c16_alicerce'},
    {texto:'Riscar a marca no degrau.', vai:'c16_riscou'}
  ]
},

c16_alicerce:{
  texto:[
    'O alicerce está no topo e é mais impressionante de perto.',
    'Blocos de pedra encaixados sem argamassa, cada um do tamanho de uma geladeira, com o encaixe tão justo que não passa a lâmina da sua faca em nenhuma junta.',
    'Isso não é técnica de Kanto. Nenhuma construção de Kanto faz isso.',
    'No centro do retângulo, o chão é de pedra lisa — uma laje só, de doze metros, que alguém trouxe inteira de algum lugar — com um desgaste circular no meio de uns três metros de diâmetro.',
    'Desgaste. Como se alguma coisa grande pousasse ali repetidamente, por muito tempo.',
    'Não tem nada escrito. Nenhum símbolo. Nenhum entalhe.',
    'Quem construiu isso não achava que precisava explicar.',
    'E em volta do desgaste circular, a uns quatro metros dele, na laje, tem três depressões rasas.',
    'Três.',
    'Do tamanho de um corpo grande deitado.',
    'Lado a lado, com uns quatro metros entre elas.'
  ],
  ef:{flag:['viu_o_alicerce','viu_as_tres_depressoes'],
      instabilidade:1,
      registrar:'No alicerce há um desgaste circular central e três depressões rasas em volta, a quatro metros uma da outra.',
      presagio:'Quatro metros entre elas. Você já mediu essa distância numa ciclovia.'},
  escolhas:[
    {texto:'Esperar no centro do círculo.', vai:'c16_esperou_no_circulo'},
    {texto:'Deitar numa das três depressões.', vai:'c16_deitou_na_depressao'},
    {texto:'Procurar quem deixou as marcas de bota.', vai:'c16_botas', cond:d=>!!d.flags.outros_procuram_a_ilha || !!d.flags.outros_estiveram_la},
    {texto:'Descer. Isso é um lugar de pousar, não de estar.', vai:'c16_desceu_ilha'}
  ]
},

c16_deitou_na_depressao:{
  texto:[
    'Você deita numa das três depressões da laje.',
    'É rasa — uns seis centímetros — e é maior que você em todas as direções, e a pedra está fria.',
    'E dali, deitado, você vê o que quem deitava ali via:',
    'o céu, e mais nada. A parede do alicerce corta o horizonte inteiro.',
    'Deitad{o|a} numa dessas você não vê o mar, não vê Kanto, não vê o alicerce.',
    'Vê o céu.',
    'Três coisas grandes deitavam aqui, lado a lado, olhando o céu, esperando uma coisa que vem do céu.',
    'E hoje elas deitam numa praia de pedra em Kanto, lado a lado, com quatro metros entre elas, olhando o mar.',
    'Você fica deitad{o|a} ali um tempo e a coisa que você pensa é: elas mudaram o que estavam olhando.'
  ],
  ef:{flag:['deitou_na_depressao','entendeu_as_depressoes'],
      rep:{eixo:'bom',delta:5,motivo:'Deitou na depressão pra ver o que dava pra ver'},
      moral:10, instabilidade:1,
      registrar:'Das depressões do alicerce só se vê o céu. Na praia de Kanto, os três olham o mar.',
      presagio:'Elas mudaram o que estavam olhando. Depois de quanto tempo?'},
  escolhas:[
    {texto:'Esperar no centro do círculo.', vai:'c16_esperou_no_circulo'},
    {texto:'Ficar deitad{o|a} até acontecer alguma coisa.', vai:'c16_esperou_no_circulo'},
    {texto:'Procurar as marcas de bota.', vai:'c16_botas', cond:d=>!!d.flags.outros_procuram_a_ilha || !!d.flags.outros_estiveram_la},
    {texto:'Descer.', vai:'c16_desceu_ilha'}
  ]
},

/* ─────────────── A EQUIPE ─────────────── */

c16_botas:{
  texto:[
    'As marcas de bota levam pro outro lado do topo, descendo uns trinta metros pela face sul, até um platô que não dá pra ver do alicerce.',
    'E no platô tem um acampamento.',
    'Três barracas técnicas de lona branca, um gerador silencioso de bancada, quatro caixas plásticas empilhadas, uma antena de uns dois metros, e uma lona esticada em cima de tudo em camuflagem de cor de rocha.',
    'Quatro pessoas.',
    'Uma delas está sentada numa caixa com um caderno e uma câmera térmica apoiada no joelho, apontada pro alicerce.',
    '"...o padrão é bianual com desvio, a gente perdeu duas janelas esperando o conselho aprovar a verba, e se perder essa a próxima é em dois mil e sete..."',
    'Ela para de falar quando te vê.',
    'Um silêncio muito longo, em que ninguém corre, ninguém grita e ninguém pega nada.',
    '"Você é o de Saffron", diz outro.',
    'E não é pergunta.'
  ],
  ef:{flag:'achou_equipe_na_ilha',
      registrar:'Uma equipe com equipamento da Silph está acampada na face sul da ilha esperando a janela.',
      presagio:'Eles sabem quem você é antes de você falar. Isso vem de um relatório.'},
  escolhas:[
    {texto:'"O que vocês querem com ele?"', vai:'c16_pergunta_equipe'},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'},
    {texto:'"Quantas janelas vocês já perderam?"', vai:'c16_quantas_janelas'},
    {texto:'Atacar o acampamento.', vai:'c16_ataque_equipe'}
  ]
},

c16_quantas_janelas:{
  texto:[
    '"Quantas janelas vocês já perderam?"',
    'A mulher do caderno pisca duas vezes, porque não era a pergunta que ela esperava.',
    '"Duas."',
    '"Oitenta e oito e noventa e seis."',
    'Ela abre o caderno.',
    '"Como você sabe as datas?"',
    '"Eu tenho quarenta e três bilhetes em papel de pão numa caixa de charuto."',
    'Ela olha pra você por um tempo comprido.',
    'E aí ela faz uma coisa que muda a conversa inteira: ela levanta da caixa, chega perto, e olha os seus olhos com interesse profissional real.',
    '"Quarenta e três observações?"',
    '"Vinte e três eventos. Quarenta e três bilhetes porque alguns são a mesma noite."',
    '"De que ano a que ano?"',
    '"Trinta e nove a noventa e seis."',
    'Ela fecha os olhos por um segundo.',
    '"Cinquenta e sete anos de série temporal."',
    'E aí ela diz a coisa mais honesta e mais assustadora do capítulo:',
    '"Eu daria o meu salário de um ano por essa caixa, e eu ganho muito bem, e eu não vou te oferecer dinheiro porque eu já entendi que você não vende."'
  ],
  ef:{flag:['sabe_das_janelas_perdidas','equipe_te_respeita'],
      npc:{nome:'Chefe da expedição', opiniao:2, memoria:'Descobriu que você tem 57 anos de série temporal numa caixa de charuto e não tentou comprar.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou quantas janelas em vez de ameaçar'},
      registrar:'A expedição perdeu as janelas de 1988 e 1996 esperando verba.',
      presagio:'Ela não ofereceu dinheiro. Isso é pior: ela vai oferecer outra coisa.'},
  escolhas:[
    {texto:'"O que vocês querem com ele?"', vai:'c16_pergunta_equipe'},
    {texto:'"O que você me oferece, então?"', vai:'c16_o_que_oferece'},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'},
    {texto:'"Vocês são do andar onze."', vai:'c16_pergunta_equipe'}
  ]
},

c16_o_que_oferece:{
  texto:[
    '"O que você me oferece, então?"',
    'Ela senta de novo na caixa.',
    '"Coautoria."',
    '"O quê?"',
    '"Se a série temporal for real e verificável, ela é o dado mais importante de toda essa linha de pesquisa, e ela não é minha, e eu não vou publicar dado dos outros com o meu nome sozinho."',
    'Ela abre o caderno numa página em branco.',
    '"Eu preciso do nome de quem anotou."',
    '"O nome é Tanner. O. Tanner e Z. A. Tanner. Pai e filho, pescadores de Fuchsia."',
    'Ela escreve.',
    'E escreve devagar, conferindo a grafia com você duas vezes, que é a segunda vez que alguém faz isso na sua frente neste mês.',
    '"E o velho tá vivo?"',
    '"Tá no barco, a duzentos metros da costa."',
    'Ela fecha o caderno e olha o mar.',
    '"Quarenta e um anos de carreira e eu nunca coloquei um pescador como coautor."',
    'Pausa.',
    '"Isso diz mais sobre a minha carreira do que sobre pescador."'
  ],
  ef:{flag:['coautoria','equipe_aliada'],
      npc:{nome:'Chefe da expedição', opiniao:6, memoria:'Anotou O. Tanner e Z. A. Tanner como coautores da série temporal.'},
      rep:{eixo:'bom',delta:6,motivo:'Transformou uma caixa de charuto em coautoria'},
      moral:20,
      registrar:'A expedição vai creditar os Tanner como coautores da série temporal.',
      presagio:'"Isso diz mais sobre a minha carreira do que sobre pescador." Ela sabe.'},
  escolhas:[
    {texto:'"E o que vocês querem com ele?"', vai:'c16_pergunta_equipe'},
    {texto:'"Então vocês não levam pena nenhuma."', vai:'c16_sem_pena'},
    {texto:'Ir pro círculo esperar.', vai:'c16_esperou_no_circulo'},
    {texto:'Buscar o Sr. Tanner pra ele ouvir isso.', vai:'c16_buscou_o_ze'}
  ]
},

c16_buscou_o_ze:{
  texto:[
    'Você desce os cento e quatro degraus, rema até o barco, e traz o Sr. Tanner.',
    'Ele leva uma hora e dez pra subir e xinga durante quarenta minutos dela.',
    'No platô, a chefe da expedição levanta da caixa e faz uma coisa que nenhum dos outros três faz: ela estende a mão.',
    '"Senhor Tanner?"',
    '"Sr. Tanner."',
    '"Doutora Mariko Odile, do Instituto de Biologia Comparada de Celadon."',
    'Ela pega o caderno.',
    '"O senhor tem uma série de observação de cinquenta e sete anos e eu vou te pedir umas quarenta perguntas chatas sobre metodologia, e algumas vão parecer que eu tô desconfiando do senhor, e eu não tô. É assim que se faz."',
    'Ele olha pra você.',
    'Depois olha pra ela.',
    '"Pode perguntar."',
    'Eles ficam três horas no platô, ela perguntando e ele respondendo, e no meio disso ela passa a chamar ele de senhor Tanner e ele passa a deixar.'
  ],
  ef:{flag:['ze_virou_coautor','equipe_aliada'],
      npc:{nome:'Sr. Tanner', opiniao:10, memoria:'Passou três horas respondendo perguntas de metodologia para uma doutora que o chamou de senhor Tanner.'},
      rep:{eixo:'bom',delta:7,motivo:'Levou um pescador de oitenta e um anos até a mesa onde se decide o que é dado'},
      moral:30,
      registrar:'Sr. Tanner passou três horas sendo entrevistado como coautor da série temporal.',
      presagio:'Ele deixou ela chamar ele de senhor Tanner. Guarde o momento em que ele deixou.'},
  escolhas:[
    {texto:'Ir pro círculo esperar.', vai:'c16_esperou_no_circulo'},
    {texto:'"E o que vocês querem com ele?"', vai:'c16_pergunta_equipe'},
    {texto:'Esperar as três horas com eles.', vai:'c16_esperou_no_circulo'},
    {texto:'"Então vocês não levam pena nenhuma."', vai:'c16_sem_pena'}
  ]
},

c16_sem_pena:{
  texto:[
    '"Então vocês não levam pena nenhuma."',
    'Ela para de escrever.',
    '"Essa é uma exigência ou uma proposta?"',
    '"É uma pergunta."',
    'Ela pensa por um tempo honesto.',
    '"Eu vim aqui buscar material genético porque foi assim que o projeto foi aprovado e foi assim que a verba veio."',
    '"E se eu voltar sem material, eu volto com uma série temporal de cinquenta e sete anos e uma observação direta de um evento que ninguém nunca registrou com instrumento."',
    'Ela olha o caderno.',
    '"E isso, pra ciência, é melhor."',
    '"E pra quem pagou?"',
    '"Pra quem pagou é pior."',
    'Ela fecha o caderno.',
    '"E eu tenho quarenta e um anos de carreira e dois filhos na faculdade e um contrato de dois anos."',
    'Ela olha pra você.',
    '"Me dá um motivo que eu possa escrever num relatório."'
  ],
  ef:{flag:'equipe_hesita',
      npc:{nome:'Chefe da expedição', opiniao:5, memoria:'Pediu um motivo que ela pudesse escrever num relatório.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou em vez de exigir'},
      presagio:'"Me dá um motivo que eu possa escrever num relatório." É isso que muda as coisas.'},
  escolhas:[
    {texto:'"Contaminação da amostra por evento não controlado."', vai:'c16_motivo_tecnico'},
    {texto:'"Porque ele vai ver vocês fazendo."', vai:'c16_motivo_moral'},
    {texto:'"Não tenho motivo nenhum. Só um pedido."', vai:'c16_so_um_pedido'},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'}
  ]
},

c16_motivo_tecnico:{
  texto:[
    '"Contaminação da amostra por evento não controlado."',
    'Ela levanta a cabeça devagar.',
    '"Explica."',
    '"Vocês vão coletar pena depois do evento, certo? Depois da luz."',
    '"Certo."',
    '"E a luz dura quarenta minutos e vocês não sabem o que ela é, não sabem a energia envolvida e não têm baseline de antes."',
    'Você aponta a câmera térmica.',
    '"Qualquer amostra coletada nessa laje depois do evento passou por quarenta minutos de uma coisa que vocês não conseguem descrever. Isso não é amostra: é amostra exposta."',
    'Silêncio.',
    'E aí ela faz uma coisa horrível e maravilhosa: ela ri e começa a escrever rápido.',
    '"Isso é bom."',
    '"É verdade?"',
    '"É completamente verdade, e é exatamente o motivo pelo qual eu ia coletar mesmo assim, porque a alternativa é voltar de mãos vazias."',
    'Ela continua escrevendo.',
    '"Mas escrito desse jeito, num relatório, com a série temporal anexada, isso vira justificativa de prorrogação e não de fracasso."',
    'Ela levanta.',
    '"Você acabou de me dar dois anos."'
  ],
  ef:{flag:['equipe_nao_coleta','equipe_aliada'],
      npc:{nome:'Chefe da expedição', opiniao:8, memoria:'Recebeu de você a justificativa técnica que transformou fracasso em prorrogação.'},
      rep:{eixo:'bom',delta:7,motivo:'Deu a um cientista a frase que ela precisava escrever'},
      moral:20, instabilidade:-1,
      registrar:'A expedição não vai coletar: a amostra seria contaminada por evento não controlado.',
      presagio:'Você ganhou dois anos com uma frase de relatório. Anota o método.'},
  escolhas:[
    {texto:'Ir pro círculo esperar.', vai:'c16_esperou_no_circulo'},
    {texto:'Buscar o Sr. Tanner.', vai:'c16_buscou_o_ze'},
    {texto:'Esperar o evento junto com eles.', vai:'c16_esperou_no_circulo'},
    {texto:'"E se eu estiver errado?"', vai:'c16_esperou_no_circulo'}
  ]
},

c16_motivo_moral:{
  texto:[
    '"Porque ele vai ver vocês fazendo."',
    'Ela não responde na hora.',
    '"Isso não vai num relatório."',
    '"Eu sei."',
    '"Isso não vai em relatório nenhum do mundo."',
    '"Eu sei. Você pediu um motivo que você pudesse escrever e eu não tenho. Eu tenho esse."',
    'Ela olha o alicerce lá em cima.',
    'E fica olhando por um tempo bem mais longo do que a resposta exige.',
    '"Eu trabalhei onze anos num projeto onde a gente não perguntava nada pra ninguém."',
    'Ela mexe na câmera térmica sem ligar.',
    '"E o resultado do projeto foi que doze coisas nasceram e nenhuma delas foi perguntada sobre nada, e eu assinei os onze relatórios."',
    'Ela põe a câmera na caixa.',
    '"Eu não vou coletar."',
    '"E o relatório?"',
    '"Eu vou escrever que a janela não ocorreu."',
    'Ela fecha a caixa.',
    '"É mentira, é a primeira da minha vida profissional, e eu vou dormir muito bem."'
  ],
  ef:{flag:['equipe_nao_coleta','equipe_mentiu_por_voce','equipe_aliada'],
      npc:{nome:'Chefe da expedição', opiniao:9, memoria:'Decidiu escrever no relatório que a janela não ocorreu. A primeira mentira da carreira dela.'},
      rep:{eixo:'bom',delta:6,motivo:'Deu o motivo que não cabe em relatório'},
      moral:20, instabilidade:-1,
      registrar:'A chefe da expedição vai reportar que a janela não ocorreu.',
      presagio:'A primeira mentira da vida profissional dela, aos quarenta e um anos de carreira.'},
  escolhas:[
    {texto:'Ir pro círculo esperar.', vai:'c16_esperou_no_circulo'},
    {texto:'Buscar o Sr. Tanner.', vai:'c16_buscou_o_ze'},
    {texto:'"Não mente. Escreve a verdade técnica."', vai:'c16_motivo_tecnico'},
    {texto:'Esperar o evento com eles.', vai:'c16_esperou_no_circulo'}
  ]
},

c16_so_um_pedido:{
  texto:[
    '"Não tenho motivo nenhum. Só um pedido."',
    'Ela espera.',
    '"Não leva nada hoje."',
    'Ela olha o acampamento inteiro: três barracas, gerador, antena, quatro caixas, quatro pessoas, e uma verba que levou oito anos pra ser aprovada.',
    '"É só isso?"',
    '"É."',
    'Ela ri, sem alegria nenhuma.',
    '"Você sabe quanto custou botar quatro pessoas nessa ilha?"',
    '"Não."',
    '"Nem eu, exatamente. Uns cento e sessenta mil."',
    'Ela senta na caixa.',
    '"E você chega aqui com quinze anos, sem crachá, sem autorização e sem argumento, e pede."',
    'Silêncio comprido.',
    '"E o pior é que pedir é a única coisa que ninguém tinha tentado."'
  ],
  ef:{flag:'pediu_pra_equipe',
      npc:{nome:'Chefe da expedição', opiniao:4, memoria:'Ouviu um pedido sem argumento nenhum, e reparou que pedir era o que ninguém tinha tentado.'},
      rep:{eixo:'bom',delta:4,motivo:'Pediu, sem argumento, o que ninguém pede'},
      presagio:'Pedir é a única coisa que ninguém tinha tentado. Vale pra esse capítulo e pros dois anteriores.'},
  escolhas:[
    {texto:'"Contaminação da amostra por evento não controlado."', vai:'c16_motivo_tecnico'},
    {texto:'"Porque ele vai ver vocês fazendo."', vai:'c16_motivo_moral'},
    {texto:'Ir pro círculo esperar.', vai:'c16_esperou_no_circulo'},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'}
  ]
},

c16_pergunta_equipe:{
  texto:[
    '"O que vocês querem com ele?"',
    'A mulher do caderno responde, e responde com uma honestidade que te desarma:',
    '"Material genético. Uma pena basta. Nós nem precisamos capturar, nem nos aproximar, nem interagir."',
    '"Pra quê?"',
    '"Pra um projeto que já custou onze anos e quatro rodadas de investimento."',
    'Ela fecha o caderno.',
    '"E que fracassou doze vezes seguidas porque a gente estava usando a matriz errada."',
    '"Matriz errada como?"',
    '"A matriz que a gente usa tem linhagem de um espécime que é potente e instável. O que a gente precisa é de uma linhagem que seja estável e antiga."',
    'Ela olha o alicerce.',
    '"E não tem nada mais antigo que isso em Kanto."',
    '"Quem paga?"',
    '"Uma comissão."',
    'Ela guarda a câmera térmica.',
    '"É o nome que eles usam. Comissão. Nunca perguntei de quê."',
    'E você entende, com um frio que não é da altitude:',
    'eles não vão parar no décimo segundo tanque.',
    'Ho-Oh é o próximo molde.'
  ],
  ef:{flag:['entendeu_o_proximo_projeto','sabe_da_proxima_matriz'], instabilidade:2, moral:-12,
      registrar:'A Silph quer material genético de Ho-Oh para a próxima matriz. O projeto fracassou doze vezes.',
      presagio:'"Nunca perguntei de quê." É a mesma frase da veterinária da reserva.'},
  escolhas:[
    {texto:'"Doze vezes. Eu vi as doze."', vai:'c16_eu_vi_as_doze', cond:d=>!!d.flags.viu_os_doze},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'},
    {texto:'"Quantas janelas vocês já perderam?"', vai:'c16_quantas_janelas'},
    {texto:'Atacar o acampamento.', vai:'c16_ataque_equipe'}
  ]
},

c16_eu_vi_as_doze:{
  texto:[
    '"Doze vezes. Eu vi as doze."',
    'Ela para.',
    '"Como assim você viu?"',
    '"Subsolo quatro. Doze tanques, onze ocupados, o décimo segundo com uma plaqueta que diz MATRIZ — VAGO. Quadro branco na parede do fundo com a linha do tempo de três séries."',
    'Você continua, e não consegue parar, e nem quer:',
    '"E um rabisco no canto do quadro, escrito e apagado três vezes pela mesma pessoa, que diz “eles não falam porque ninguém pergunta”."',
    'Os quatro do acampamento estão olhando pra você.',
    'E a chefe da expedição senta na caixa devagar.',
    '"Eu não sabia que eles estavam ocupados."',
    '"O quê?"',
    '"Eu recebo relatório de rendimento. Percentual de viabilidade, taxa de cognição, tempo de estabilização."',
    'Ela olha as próprias mãos.',
    '"Eu recebo tabela, meu bem. Eu nunca desci."',
    'Ela levanta a cabeça.',
    '"Eles falam?"',
    'E aí você tem que dizer em voz alta, num platô de rocha no meio do mar, pra quatro cientistas:',
    '"Seis querem sair. Cinco querem acabar."'
  ],
  ef:{flag:['contou_pra_equipe','equipe_quebrada'],
      npc:{nome:'Chefe da expedição', opiniao:7, memoria:'Descobriu com você que os onze tanques do andar 11 estão ocupados e que eles respondem.'},
      rep:{eixo:'bom',delta:8,motivo:'Contou aos que recebem tabela o que existe embaixo da tabela'},
      moral:15, instabilidade:1,
      registrar:'A equipe da expedição não sabia que os tanques do andar 11 estavam ocupados.',
      presagio:'"Eu recebo tabela. Eu nunca desci." É como tudo funciona desde o capítulo nove.'},
  escolhas:[
    {texto:'"Então não coleta nada hoje."', vai:'c16_sem_pena'},
    {texto:'"Vai lá descer, então."', vai:'c16_va_descer'},
    {texto:'"Saiam da ilha."', vai:'c16_expulsou_equipe'},
    {texto:'Ir pro círculo esperar.', vai:'c16_esperou_no_circulo'}
  ]
},

c16_va_descer:{
  texto:[
    '"Vai lá descer, então."',
    '"Como?"',
    '"Você tem crachá. Você tem autorização de pesquisa. Você é chefe de expedição de um projeto de onze anos."',
    '"E daí?"',
    '"E daí que eu desci com quinze anos e sem nada."',
    'Ela fica olhando pra você por um tempo bem desconfortável.',
    'E depois abre o caderno numa página em branco e escreve uma linha, e vira o caderno pra você ler:',
    '**"Solicitar vistoria técnica presencial ao módulo 11 antes da próxima rodada de coleta. Justificativa: verificação de premissa de projeto."**',
    '"Isso é um pedido de vistoria?"',
    '"Isso é um pedido de vistoria."',
    'Ela fecha o caderno.',
    '"E o jurídico deles vai indeferir, e eu vou recorrer, e eles vão indeferir de novo, e vai levar uns oito meses."',
    'Ela guarda a caneta.',
    '"E aí eu vou ter oito meses de indeferimento por escrito, que é uma coisa que vale muito mais do que a vistoria."'
  ],
  ef:{flag:['equipe_vai_pedir_vistoria','equipe_aliada'],
      npc:{nome:'Chefe da expedição', opiniao:9, memoria:'Vai pedir vistoria presencial ao módulo 11 para coletar os indeferimentos por escrito.'},
      rep:{eixo:'bom',delta:7,motivo:'Mandou um chefe de expedição descer'},
      moral:20, instabilidade:-1,
      registrar:'A expedição vai solicitar vistoria presencial ao andar 11 — para colecionar indeferimentos.',
      presagio:'Oito meses de indeferimento por escrito valem mais que a vistoria. Todo mundo nessa história aprendeu isso sozinho.'},
  escolhas:[
    {texto:'Ir pro círculo esperar.', vai:'c16_esperou_no_circulo'},
    {texto:'Buscar o Sr. Tanner.', vai:'c16_buscou_o_ze'},
    {texto:'"E hoje vocês não coletam."', vai:'c16_sem_pena'},
    {texto:'Esperar o evento com eles.', vai:'c16_esperou_no_circulo'}
  ]
},

c16_expulsou_equipe:{
  texto:['"Saiam da ilha."'],
  teste:{status:'carisma', dificuldade:9, nomeStatus:'Carisma',
         critico:'c16_equipe_saiu', sucesso:'c16_equipe_saiu', parcial:'c16_equipe_ficou', falha:'c16_equipe_ficou'}
},

c16_equipe_saiu:{
  texto:[
    'Você diz isso com uma autoridade que você não tem e que eles, por algum motivo, aceitam.',
    d=>Estado.rep.eixo==='bom'&&Estado.rep.bom>=5 ? 'Talvez seja a sua reputação. Metade de Kanto sabe o seu nome e a outra metade sabe a sua história, e as duas metades chegaram aqui antes de você.' :
       Estado.rep.eixo==='ruim'&&Estado.rep.ruim>=5 ? 'Talvez seja a sua reputação — mas de um jeito bem diferente. Um deles já estava guardando o equipamento antes de você terminar a frase.' :
       'Talvez seja porque ninguém ali quer explicar pra um chefe por que houve confronto numa ilha sem jurisdição definida a onze horas da costa.',
    'Eles desmontam em três horas e saem antes do amanhecer.',
    'A chefe da expedição é a última a embarcar.',
    'Ela para na argola de ferro com a corda na mão e olha pra você.',
    '"A gente volta na próxima janela."',
    '"Quando?"',
    '"Se o intervalo for sete, dois mil e sete. Se for oito, dois mil e oito."',
    'Ela amarra a corda no barco — não corta: amarra e desamarra, direito, sem pressa.',
    '"Eu também", você responde.',
    'Ela assente.',
    '"Eu sei."'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Expulsou uma expedição científica de uma ilha sem jurisdição'},
      flag:'expulsou_a_equipe', instabilidade:-1,
      npc:{nome:'Chefe da expedição', opiniao:1, memoria:'Saiu da ilha quando você mandou, e desamarrou a corda direito em vez de cortar.'},
      registrar:'Expulsou a expedição da ilha sem nome. A próxima janela é em 2007 ou 2008.',
      presagio:'Ela desamarrou em vez de cortar. Repare em quem corta e quem desamarra.'},
  escolhas:[
    {texto:'Esperar no círculo.', vai:'c16_esperou_no_circulo'},
    {texto:'Deitar numa das depressões.', vai:'c16_deitou_na_depressao'},
    {texto:'Buscar o Sr. Tanner.', vai:'c16_buscou_o_ze'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'}
  ]
},

c16_equipe_ficou:{
  falante:'o mais velho da equipe',
  vozes:['N','N'],
  texto:[
    '"Com todo respeito", diz o mais velho, sem largar a chave de fenda, "essa ilha não é de ninguém, a gente tem autorização de pesquisa protocolada, e você tem quinze anos."',
    'Ele volta ao trabalho.',
    'Ele não está errado em nenhum dos três pontos.',
    'E é exatamente isso que enraivece: você passou a jornada inteira aprendendo que estar certo no papel é o que decide, e agora o papel está do outro lado.'
  ],
  ef:{flag:'equipe_ficou',
      moral:-8,
      presagio:'O papel está do outro lado. Aprende a lidar com isso agora, porque vai acontecer de novo.'},
  escolhas:[
    {texto:'"Quantas janelas vocês já perderam?"', vai:'c16_quantas_janelas'},
    {texto:'"O que vocês querem com ele?"', vai:'c16_pergunta_equipe'},
    {texto:'Ir pro círculo e esperar na frente deles.', vai:'c16_esperou_no_circulo'},
    {texto:'Atacar o acampamento.', vai:'c16_ataque_equipe'}
  ]
},

c16_ataque_equipe:{
  texto:[
    'Você ataca um acampamento científico numa ilha deserta.',
    'Eles têm Pokémon de segurança, porque expedição sempre tem, e o segurança é um profissional contratado que não tem nada a ver com a discussão e que vai fazer o trabalho dele.'
  ],
  ef:{moral:-10},
  batalha:{dex:103, nivel:52, tipo:'treinador', treinador:'Segurança da expedição', fuga:true,
           timeExtra:[{dex:76, nivel:53}],
           vitoria:'c16_venceu_equipe', derrota:'c16_perdeu_equipe', fuga2:'c16_esperou_no_circulo', gameover:'gameover'}
},

c16_venceu_equipe:{
  texto:[
    'Você derruba a segurança e destrói o gerador, a câmera térmica e a antena.',
    'Eles não revidam.',
    'Cientista não revida — cientista anota.',
    'A chefe da expedição escreve alguma coisa enquanto você quebra o equipamento dela, e isso te assusta mais do que se ela gritasse.',
    '"O que você está escrevendo?"',
    '"A data."',
    'Ela não levanta a cabeça.',
    '"A gente vai precisar dela no relatório do seguro. E no boletim de ocorrência."',
    'Ela vira a página.',
    '"E na justificativa de prorrogação da verba, que agora eu tenho."',
    'E aí ela levanta a cabeça.',
    '"Obrigada, sinceramente. Eu ia voltar com nada e agora eu volto com um incidente, e incidente prorroga projeto."'
  ],
  ef:{rep:{eixo:'ruim',delta:3,motivo:'Destruiu equipamento de uma expedição autorizada'},
      flag:'destruiu_a_expedicao', instabilidade:1, moral:-15,
      executar:d=>{ d.liga.avisos++; return [{tipo:'liga', texto:'Mais uma ocorrência com o seu nome no sistema da Liga.'}]; },
      registrar:'Destruiu o equipamento da expedição. O incidente prorroga o projeto.',
      presagio:'Incidente prorroga projeto. Você acabou de comprar dois anos pra eles.'},
  escolhas:[
    {texto:'Ir para o círculo.', vai:'c16_esperou_no_circulo'},
    {texto:'"Desculpa." E ajudar a recolher.', vai:'c16_ajudou_a_recolher'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Deitar numa das depressões.', vai:'c16_deitou_na_depressao'}
  ]
},

c16_ajudou_a_recolher:{
  texto:[
    '"Desculpa."',
    'Você passa as quatro horas seguintes ajudando quatro cientistas a recolher os cacos do equipamento que você quebrou, num platô de rocha, no escuro, com lanterna de cabeça.',
    'Ninguém fala com você.',
    'Na terceira hora, o mais novo da equipe — um rapaz de uns vinte e cinco — te passa uma caixa e diz "essa vai fechada" e é a primeira frase que alguém te dirige.',
    'Na quarta, a chefe senta na caixa que sobrou e pergunta, sem olhar:',
    '"Por que você quebrou?"',
    'E você tem que responder, e a resposta honesta é ruim:',
    '"Porque eu não sabia mais o que fazer e quebrar era a única coisa que eu sabia como."',
    'Ela assente.',
    '"Eu vou botar isso no relatório também."',
    '"Sério?"',
    '"Não."',
    'Ela levanta.',
    '"Mas eu ia querer poder."'
  ],
  ef:{flag:'ajudou_a_recolher',
      npc:{nome:'Chefe da expedição', opiniao:3, memoria:'Você ajudou a recolher por quatro horas o que tinha quebrado, e disse por quê.'},
      rep:{eixo:'bom',delta:4,motivo:'Ficou quatro horas recolhendo o que quebrou'},
      moral:15, hp:-3, causa:'Quatro horas recolhendo caco no escuro',
      registrar:'Ajudou a expedição a recolher o equipamento destruído.',
      presagio:'"Quebrar era a única coisa que eu sabia como." Aprende outra.'},
  escolhas:[
    {texto:'Ir pro círculo esperar.', vai:'c16_esperou_no_circulo'},
    {texto:'"Quantas janelas vocês já perderam?"', vai:'c16_quantas_janelas'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Ficar e esperar o evento com eles.', vai:'c16_esperou_no_circulo'}
  ]
},

c16_perdeu_equipe:{
  texto:[
    'Você perde para a segurança de uma expedição científica.',
    'Eles te tratam bem depois — dão água, olham seus ferimentos com um kit de primeiros socorros de verdade, oferecem carona no barco deles e perguntam se você precisa ligar pra alguém.',
    'É humilhante de um jeito muito completo, porque não tem nada de errado com nada disso.',
    'A chefe da expedição senta na caixa do lado da sua e não diz nada por um tempo.',
    'Depois:',
    '"Você tem quinze anos."',
    '"Tenho."',
    '"E veio onze horas de barco pra ficar entre quatro adultos e uma coisa que você acha que a gente vai machucar."',
    'Ela olha o alicerce.',
    '"Eu tinha vinte e dois quando eu fiz uma coisa parecida. Era uma barragem."',
    '"E funcionou?"',
    '"Não."',
    'Ela levanta.',
    '"Mas eu não me arrependo, e eu sou muito chata em reunião desde então, e isso serve pra alguma coisa."'
  ],
  ef:{hp:-8, causa:'Derrota para a segurança da expedição', flag:'perdeu_pra_equipe',
      npc:{nome:'Chefe da expedição', opiniao:4, memoria:'Cuidou dos seus ferimentos e contou de quando ela tinha 22 anos e uma barragem.'},
      moral:-5,
      registrar:'Perdeu para a segurança da expedição.',
      presagio:'"Eu sou muito chata em reunião desde então." É uma carreira inteira nessa frase.'},
  escolhas:[
    {texto:'"Quantas janelas vocês já perderam?"', vai:'c16_quantas_janelas'},
    {texto:'"O que vocês querem com ele?"', vai:'c16_pergunta_equipe'},
    {texto:'Ir pro círculo esperar.', vai:'c16_esperou_no_circulo'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'}
  ]
},

/* ─────────────── O CÍRCULO ─────────────── */

c16_esperou_no_circulo:{
  texto:[
    'Você senta no centro do desgaste circular, no meio da laje de doze metros, no topo de uma ilha sem nome a onze horas da costa.',
    'E espera.',
    'Uma hora. Três. Cinco.',
    'Faz frio e venta e a pedra é dura e você não tem nada pra fazer, e é a coisa mais parecida com rezar que você já fez na vida sem nunca ter rezado.',
    'Às onze e dez começa.',
    'A luz não vem do céu.',
    'Essa é a coisa que ninguém nunca contou direito, e você entende por quê: porque quem viu da costa não podia ver.',
    'A luz sai da laje.',
    'Sai do desgaste circular embaixo de você, sobe reta pelos duzentos metros e abre em leque no alto, e você está dentro dela, sentad{o|a}, e não queima e não cega e não esquenta.',
    'Tem cor. Todas.',
    'E dentro da luz, descendo por ela como quem desce por um corrimão, tem uma coisa de sete metros de envergadura.'
  ],
  ef:{flag:'viu_hooh',
      executar:d=>{ const L=Estado.lend(250); if(L) L.encontros++; return []; },
      instabilidade:1,
      registrar:'A luz sai da laje, não do céu. Ho-Oh desceu por ela.',
      presagio:'A luz sai de baixo. Sessenta e um anos e ninguém podia saber disso da costa.'},
  escolhas:[
    {texto:'Ficar parad{o|a}. Absolutamente parad{o|a}.', vai:'c16_ficou_parado'},
    {texto:'Ajoelhar.', vai:'c16_ajoelhou'},
    {texto:'Falar com ele.', vai:'c16_falou_hooh'},
    {texto:'Jogar a bola.', vai:'c16_captura_hooh'}
  ]
},

c16_ficou_parado:{
  texto:[
    'Você fica absolutamente parad{o|a}.',
    'Ele pousa no círculo, a dois metros de você, e o círculo é do tamanho exato dele, o que responde de uma vez a pergunta de quem gastou a pedra.',
    'Ele não te olha na primeira meia hora.',
    'Ele faz outra coisa: ele anda pelo alicerce inteiro, devagar, e para nas três depressões, uma por uma, e encosta o bico em cada uma delas.',
    'Uma. Duas. Três.',
    'E em cada uma ele fica uns quarenta segundos.',
    'E aí você entende, sentad{o|a} numa laje com uma coisa de sete metros de envergadura a dois metros de distância:',
    'ele vem aqui a cada seis, sete ou oito anos, há trezentas e vinte e oito vezes contadas, pra encostar o bico em três buracos vazios.',
    'E depois ele te olha.'
  ],
  ef:{flag:['ficou_parado_hooh','entendeu_o_ritual'],
      rep:{eixo:'bom',delta:5,motivo:'Ficou parado e viu o ritual inteiro'},
      moral:15, instabilidade:1,
      registrar:'Ho-Oh encosta o bico nas três depressões vazias, uma por uma, quarenta segundos em cada.',
      presagio:'Três buracos vazios. E os donos deles estão numa praia de pedra em Kanto olhando o mar.'},
  escolhas:[
    {texto:'"Eles estão vivos."', vai:'c16_eles_estao_vivos', cond:d=>!!d.flags.viu_os_tres || !!d.flags.sabe_dos_tres},
    {texto:'Falar com ele.', vai:'c16_falou_hooh'},
    {texto:'Ajoelhar.', vai:'c16_ajoelhou'},
    {texto:'Não fazer nada.', vai:'c16_deixou_pena'}
  ]
},

c16_eles_estao_vivos:{
  texto:[
    '"Eles estão vivos."',
    'Você fala isso em voz alta, sentad{o|a} numa laje de pedra, dentro de uma coluna de luz, pra uma coisa de sete metros de envergadura.',
    'Ele não se move.',
    '"Os três. Eles estão numa praia de pedra no fim de uma ciclovia em Kanto, deitados lado a lado com quatro metros entre eles, olhando o mar."',
    d=>d.flags.contou_pros_caes ? '"Eu falei com eles. Um deles encostou a testa no meu ombro."' :
       d.flags.viu_os_tres ? '"Eu vi os três. Eles fazem um circuito de trinta e quatro quilômetros todas as madrugadas há quatro anos."' :
       '"Eu vi eles."',
    'E aí acontece uma coisa que você vai passar o resto da vida sem conseguir descrever direito.',
    'A luz muda de cor.',
    'Não em ondas, não em pulso: ela muda inteira, de uma vez, em todas as direções, e fica dourada por uns quatro segundos.',
    'E depois volta.',
    'E ele abaixa a cabeça até o nível da sua, que é uma distância enorme pra ele descer, e fica assim.',
    'E você entende que está sendo ouvido pela primeira vez em duzentos anos por alguém que vem aqui a cada sete pra encostar o bico em três buracos.'
  ],
  ef:{flag:['contou_pra_hooh','hooh_aliado'],
      executar:d=>{ const L=Estado.lend(250); if(L){ L.disposicao='passivo'; L.aliado=true; }
        Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade-3);
        return [{tipo:'mundo', texto:'Ho-Oh soube que os três estão vivos. A luz ficou dourada por quatro segundos.'}]; },
      rep:{eixo:'bom',delta:8,motivo:'Contou a coisa que trezentas e vinte e oito visitas não descobriram'},
      moral:30, instabilidade:-2,
      registrar:'Contou a Ho-Oh que os três estão vivos em Kanto. A luz ficou dourada.',
      presagio:'Trezentas e vinte e oito vezes encostando o bico em buraco vazio. E ninguém tinha contado.'},
  escolhas:[
    {texto:'"Eles estão esperando uma coisa sair de Cinnabar."', vai:'c16_falou_hooh'},
    {texto:'Ficar em silêncio e deixar ele decidir.', vai:'c16_deixou_pena'},
    {texto:'Ajoelhar.', vai:'c16_ajoelhou'},
    {texto:'Pegar uma pena que caiu.', vai:'c16_pegou_pena'}
  ]
},

c16_falou_hooh:{
  texto:[
    'Você fala.',
    'Não tem nada de solene: você fala rápido, atropelado, com a voz tremendo, sentad{o|a} numa pedra fria com as mãos dormentes de frio, pra uma coisa que não pisca.',
    'Você fala do armazém de Celadon e das quarenta e uma gaiolas com número de processo.',
    'Da reserva de Fuchsia e da planilha de mil novecentos e setenta e um.',
    'Do andar onze e dos doze tanques e da plaqueta que diz MATRIZ — VAGO.',
    'Do laboratório de Cinnabar e do caderno sete e do homem que subiu um vulcão com alguém do lado, no mesmo passo.',
    'Da caixa de charuto com quarenta e três bilhetes em papel de pão.',
    'E no fim, sem planejar, você fala da coisa que está aqui agora, nessa ilha, a trinta metros de distância, montando uma antena:',
    '"E tem gente ali atrás querendo uma pena sua."',
    'Ele vira a cabeça na direção do platô sul.',
    'E fica olhando naquela direção por um tempo muito longo.',
    'E depois volta pra você.',
    'E abaixa a cabeça de um jeito que não é ameaça e não é submissão e que você só vai entender daqui a uns dois capítulos.'
  ],
  ef:{flag:['falou_com_hooh'],
      executar:d=>{ const L=Estado.lend(250); if(L && L.disposicao!=='hostil') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:6,motivo:'Contou tudo em voz alta pra quem não tinha como responder'},
      moral:20,
      registrar:'Contou tudo a Ho-Oh, inclusive que havia gente na ilha querendo uma pena dele.',
      presagio:'Ele olhou pro platô sul. Você acabou de apontar quatro pessoas.'},
  escolhas:[
    {texto:'"Não faz nada com eles."', vai:'c16_nao_faz_nada'},
    {texto:'"Eles estão vivos." — falar dos três.', vai:'c16_eles_estao_vivos', cond:d=>!!d.flags.viu_os_tres || !!d.flags.sabe_dos_tres},
    {texto:'Ficar em silêncio.', vai:'c16_deixou_pena'},
    {texto:'Ajoelhar.', vai:'c16_ajoelhou'}
  ]
},

c16_nao_faz_nada:{
  texto:[
    '"Não faz nada com eles."',
    'Você fala isso antes de pensar, e depois de falar você percebe o tamanho da frase:',
    'você acabou de pedir clemência a uma coisa lendária em nome de quatro cientistas que vieram arrancar uma pena dela.',
    'Ele olha pra você.',
    'E aí ele faz uma coisa pequena e absurda: ele encolhe um pouco o pescoço e mexe a cabeça de lado.',
    'É um gesto que você já viu num Raikou numa ciclovia às quatro da manhã.',
    'Ele não entendeu a frase.',
    'Ele entendeu que você pediu, e que você pediu apontando pra eles, e que pedir apontando pra alguém é uma coisa que ele conhece.',
    'E ele não vai fazer nada com eles.',
    'Não porque você pediu.',
    'Porque ele nunca ia fazer nada com eles, e você é que precisava pedir.'
  ],
  ef:{flag:['pediu_clemencia'],
      rep:{eixo:'bom',delta:4,motivo:'Pediu clemência por quem veio te tirar uma pena'},
      moral:15,
      registrar:'Pediu a Ho-Oh que não fizesse nada com a expedição.',
      presagio:'Ele nunca ia fazer nada. Você é que precisava pedir.'},
  escolhas:[
    {texto:'"Eles estão vivos." — falar dos três.', vai:'c16_eles_estao_vivos', cond:d=>!!d.flags.viu_os_tres || !!d.flags.sabe_dos_tres},
    {texto:'Ficar em silêncio até ele ir.', vai:'c16_deixou_pena'},
    {texto:'Ajoelhar.', vai:'c16_ajoelhou'},
    {texto:'Pegar a pena que caiu.', vai:'c16_pegou_pena'}
  ]
},

c16_ajoelhou:{
  texto:[
    'Você ajoelha.',
    'Não é decisão: seu joelho vai ao chão e você não decidiu nada, e depois você fica ajoelhad{o|a} porque levantar seria pior.',
    'Ele olha.',
    'E aí ele faz a coisa que te desmonta: ele recua um passo.',
    'Uma coisa de sete metros de envergadura, num círculo que ela gastou na pedra ao longo de séculos, recua um passo porque uma pessoa ajoelhou.',
    'E depois abaixa a cabeça até o chão — até a pedra, literalmente encostando o bico na laje — e fica assim uns quatro segundos.',
    'E depois levanta e olha pra você e espera.',
    'Você entende, ajoelhad{o|a}, com as mãos na pedra fria: ele devolveu o gesto.',
    'Ele não quer isso.',
    'Ele não sabe o que fazer com isso e devolveu, que é a coisa mais educada que dava pra fazer.',
    'Você levanta.',
    'Ele também.'
  ],
  ef:{flag:['ajoelhou_hooh'],
      executar:d=>{ const L=Estado.lend(250); if(L && L.disposicao!=='hostil') L.disposicao='passivo'; return []; },
      rep:{eixo:'bom',delta:3,motivo:'Ajoelhou e foi corrigido'},
      moral:10,
      registrar:'Ajoelhou diante de Ho-Oh e ele devolveu o gesto.',
      presagio:'Ele devolveu o gesto. Ele não quer isso. Guarde.'},
  escolhas:[
    {texto:'Falar com ele.', vai:'c16_falou_hooh'},
    {texto:'"Eles estão vivos."', vai:'c16_eles_estao_vivos', cond:d=>!!d.flags.viu_os_tres || !!d.flags.sabe_dos_tres},
    {texto:'Ficar parad{o|a} até ele ir.', vai:'c16_deixou_pena'},
    {texto:'Pegar a pena que caiu.', vai:'c16_pegou_pena'}
  ]
},

c16_pegou_pena:{
  texto:[
    'Uma pena cai.',
    'Não é dele largando — é pena caindo, do jeito que pena cai de qualquer bicho de pena, porque bicho de pena troca pena e isso é a coisa mais banal do mundo.',
    'Ela desce planando por uns oito segundos e para na laje a um metro de você.',
    'Tem uns quarenta centímetros e é vermelha na base e dourada na ponta, e ela não brilha, porque ela é uma pena.',
    'Você pega.',
    'Ela é morna. E leve de um jeito que não faz sentido pro tamanho.',
    'Ele olha você pegar.',
    'E não faz nada — nem impede, nem aprova, e a ausência das duas coisas é o que te deixa com um nó no estômago, porque quer dizer que a decisão é inteiramente sua e vai continuar sendo.'
  ],
  ef:{flag:['tem_a_pena'],
      itens:{'Pena Arco-Íris':1},
      registrar:'Pegou uma pena de Ho-Oh caída na laje.',
      presagio:'Ele não impediu e não aprovou. A decisão é sua e vai continuar sendo.'},
  escolhas:[
    {texto:'Guardar. Ela é sua agora.', vai:'c16_guardou_a_pena'},
    {texto:'Devolver: pôr de volta no chão do círculo.', vai:'c16_deixou_pena'},
    {texto:'Dar a pena pra expedição.', vai:'c16_deu_a_pena', cond:d=>!!d.flags.achou_equipe_na_ilha},
    {texto:'Queimar a pena.', vai:'c16_queimou_a_pena'}
  ]
},

c16_guardou_a_pena:{
  texto:[
    'Você guarda a pena na mochila, enrolada no cobertor, com cuidado.',
    'E ele vai embora.',
    'Não ofendido, não com pressa: ele sobe pela luz do mesmo jeito que desceu, e a luz apaga quando ele acaba de subir, e o alicerce fica escuro e frio e vazio de uma vez.',
    'Você fica sozinh{o|a} numa laje de doze metros com uma pena de quarenta centímetros na mochila.',
    'E a coisa que te incomoda pelas onze horas de travessia de volta é essa:',
    'você não tirou nada de ninguém. A pena caiu. Ele viu você pegar.',
    'E mesmo assim.',
    d=>d.flags.achou_equipe_na_ilha ? 'E a trinta metros do platô sul tem quatro pessoas com equipamento de cento e sessenta mil que vieram fazer exatamente isso e não conseguiram, e agora você tem a pena e elas não, e você vai ter que decidir o que isso significa.' : ''
  ],
  ef:{flag:['guardou_a_pena'],
      rep:{eixo:'ruim',delta:1,motivo:'Ficou com a pena'},
      moral:-8,
      registrar:'Guardou a Pena Arco-Íris.',
      presagio:'"E mesmo assim." Fica com essas duas palavras.'},
  escolhas:[
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Voltar e pôr a pena de volta no círculo.', vai:'c16_deixou_pena'},
    {texto:'Dar a pena pra expedição.', vai:'c16_deu_a_pena', cond:d=>!!d.flags.achou_equipe_na_ilha},
    {texto:'Dar a pena pro Sr. Tanner.', vai:'c16_deu_pro_ze'}
  ]
},

c16_deu_pro_ze:{
  texto:[
    'Você desce os cento e quatro degraus com a pena enrolada no cobertor e rema até o barco.',
    'E entrega.',
    'O Sr. Tanner desenrola o cobertor na luz de posição do barco e olha quarenta centímetros de pena vermelha e dourada.',
    'E não pega.',
    'Ele olha por um tempo bem longo, com as mãos no colo.',
    '"Não."',
    '"Como não?"',
    '"Meu pai foi vinte e três vezes e não trouxe nada."',
    'Ele enrola o cobertor de volta, com cuidado, sem encostar na pena.',
    '"E eu sempre achei que era porque ele não conseguia."',
    'Ele empurra o cobertor pra você.',
    '"Agora eu acho que era porque ele não quis."'
  ],
  ef:{flag:['ze_recusou_a_pena'],
      npc:{nome:'Sr. Tanner', opiniao:9, memoria:'Recusou pegar a pena. Entendeu que o pai nunca trouxe nada porque não quis.'},
      rep:{eixo:'bom',delta:3,motivo:'Ofereceu a pena a quem tinha mais direito que você'},
      moral:10,
      registrar:'Sr. Tanner recusou a pena. O pai dele foi 23 vezes e nunca trouxe nada.',
      presagio:'Ele não quis. Vinte e três vezes e ele não quis.'},
  escolhas:[
    {texto:'Subir e devolver a pena ao círculo.', vai:'c16_deixou_pena'},
    {texto:'Ficar com ela.', vai:'c16_guardou_a_pena'},
    {texto:'Dar pra expedição.', vai:'c16_deu_a_pena', cond:d=>!!d.flags.achou_equipe_na_ilha},
    {texto:'Ir embora com ela.', vai:'c16_desceu_ilha'}
  ]
},

c16_deu_a_pena:{
  texto:[
    'Você desce até o platô sul com a pena na mão e entrega pra chefe da expedição.',
    'Ela não pega.',
    'Ela olha a pena, olha você, olha a pena, e põe as mãos nos bolsos do casaco — um gesto físico, deliberado, de quem está impedindo a própria mão.',
    '"Como você conseguiu?"',
    '"Caiu."',
    '"Caiu ou você tirou?"',
    '"Caiu. Ele viu eu pegar e não fez nada."',
    'Ela fica com as mãos no bolso por muito tempo.',
    d=>d.flags.equipe_quebrada || d.flags.contou_pra_equipe ? '"Se eu levar isso, em três anos tem mais um tanque."\nEla tira as mãos do bolso, vazias.\n"E eu vou receber a tabela."' :
       '"Se eu levar isso, a verba renova por seis anos e eu mantenho quatro empregos."\nEla olha o alicerce.\n"E em três anos tem mais um tanque."',
    'Ela olha a pena mais uma vez.',
    '"Leva de volta pra cima."',
    '"Você tem certeza?"',
    '"Não."',
    'Ela vira de costas.',
    '"Leva antes que eu tenha."'
  ],
  ef:{flag:['equipe_recusou_a_pena','equipe_aliada'],
      npc:{nome:'Chefe da expedição', opiniao:8, memoria:'Pôs as mãos nos bolsos para não pegar a pena e mandou você levar de volta antes que ela mudasse de ideia.'},
      rep:{eixo:'bom',delta:6,motivo:'Ofereceu a pena a quem veio buscá-la e recebeu um não'},
      moral:20, instabilidade:-1,
      registrar:'A chefe da expedição recusou a pena e mandou devolvê-la.',
      presagio:'"Leva antes que eu tenha." Essa é a frase mais honesta sobre ética que existe.'},
  escolhas:[
    {texto:'Levar de volta ao círculo.', vai:'c16_deixou_pena'},
    {texto:'Ficar com ela mesmo assim.', vai:'c16_guardou_a_pena'},
    {texto:'Insistir pra ela ficar.', vai:'c16_insistiu'},
    {texto:'Descer da ilha com ela.', vai:'c16_desceu_ilha'}
  ]
},

c16_insistiu:{
  texto:[
    '"Fica com ela."',
    'Ela vira de volta e a cara dela mudou.',
    '"Por quê?"',
    '"Porque se você não ficar, alguém vem em dois mil e sete e tira à força, e você é a melhor pessoa que vai vir nessa ilha."',
    'Ela ouve isso inteiro.',
    'E responde uma coisa que você não esperava:',
    '"Essa é a frase que me trouxe até aqui."',
    '"Como?"',
    '"“Se eu não fizer, alguém pior faz.” Eu me disse isso em oitenta e nove pra aceitar o primeiro contrato, e em noventa e dois pra assinar o segundo, e em noventa e seis pra não perguntar o que era a comissão."',
    'Ela pega a pena da sua mão — e no segundo em que ela pega, você entende que errou.',
    'Ela olha a pena.',
    'E depois anda até a beira do platô, e você acha que ela vai jogar no mar, e ela não joga.',
    'Ela sobe.',
    'Ela sobe os trinta metros até o alicerce com a pena na mão e põe ela de volta no centro do círculo, e desce, e não fala com você o resto da noite.'
  ],
  ef:{flag:['equipe_devolveu_a_pena','pena_devolvida'],
      perdeItens:{'Pena Arco-Íris':1},
      npc:{nome:'Chefe da expedição', opiniao:6, memoria:'Pegou a pena da sua mão, subiu trinta metros e devolveu ela ao círculo.'},
      rep:{eixo:'bom',delta:4,motivo:'Errou e foi corrigido por quem você tentou corromper'},
      moral:10, instabilidade:-1,
      registrar:'A chefe da expedição devolveu a pena ao círculo com as próprias mãos.',
      presagio:'"Se eu não fizer, alguém pior faz." Você acabou de dizer a frase que constrói tudo isso.'},
  escolhas:[
    {texto:'Subir atrás dela.', vai:'c16_deixou_pena'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Pedir desculpa.', vai:'c16_ajudou_a_recolher', cond:d=>!!d.flags.destruiu_a_expedicao},
    {texto:'Ficar no platô até amanhecer.', vai:'c16_desceu_ilha'}
  ]
},

c16_queimou_a_pena:{
  texto:[
    'Você queima a pena.',
    'Ela não queima como pena.',
    'Ela pega fogo devagar, da ponta pra base, e o fogo é branco, e não tem cheiro de pena queimada e não tem cheiro de nada.',
    'Leva quase dois minutos.',
    'E quando acaba não sobra cinza — sobra um risco preto na pedra da laje, de uns quarenta centímetros, exatamente do tamanho dela.',
    'Você fica olhando o risco.',
    'E aí você repara numa coisa que vai te acompanhar:',
    'tem outros riscos na laje.',
    'Muitos. Apagados pelo tempo, quase invisíveis, espalhados pelo desgaste circular inteiro.',
    'Dezenas.',
    'Outras pessoas já queimaram penas aqui, e cada uma delas achou que estava sendo a primeira a ter essa ideia.'
  ],
  ef:{flag:['queimou_a_pena','pena_destruida'],
      perdeItens:{'Pena Arco-Íris':1},
      rep:{eixo:'bom',delta:2,motivo:'Destruiu a coisa que vinham buscar'},
      moral:-5, instabilidade:-1,
      registrar:'Queimou a Pena Arco-Íris. A laje está cheia de riscos iguais.',
      presagio:'Dezenas de riscos. Cada um foi a primeira pessoa a ter essa ideia.'},
  escolhas:[
    {texto:'Contar as marcas.', vai:'c16_contou_as_marcas'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Ficar no círculo até amanhecer.', vai:'c16_deixou_pena'},
    {texto:'Ir contar pra expedição.', vai:'c16_botas', cond:d=>!!d.flags.outros_procuram_a_ilha || !!d.flags.outros_estiveram_la}
  ]
},

c16_contou_as_marcas:{
  texto:[
    'Você conta as marcas de queimado na laje, deitad{o|a} de bruços com a lanterna de lado, por uma hora e quarenta.',
    'Trinta e uma.',
    'Trinta e uma pessoas, ao longo de quem sabe quantos séculos, subiram essa ilha, receberam uma pena e queimaram ela na mesma laje.',
    'Uma a cada dez anos, mais ou menos, o que bate com a frequência das visitas.',
    'Uma a cada duas ou três visitas, alguém queima.',
    'Você deita de costas na laje, do lado do seu risco novo, e olha o céu que é a única coisa que dá pra ver daqui de baixo.',
    'Trinta e uma pessoas antes de você acharam que estavam resolvendo.',
    'E ele continua vindo.'
  ],
  ef:{flag:['contou_as_marcas_de_queimado'],
      rep:{eixo:'bom',delta:4,motivo:'Contou as trinta e uma marcas'},
      moral:-10, instabilidade:1,
      registrar:'Há 31 marcas de pena queimada na laje do alicerce.',
      presagio:'Trinta e uma pessoas acharam que estavam resolvendo. E ele continua vindo.'},
  escolhas:[
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Ficar até amanhecer.', vai:'c16_deixou_pena'},
    {texto:'Ir contar pra expedição.', vai:'c16_botas', cond:d=>!!d.flags.outros_procuram_a_ilha || !!d.flags.outros_estiveram_la},
    {texto:'Ir contar pro Sr. Tanner.', vai:'c16_desceu_ilha'}
  ]
},

c16_deixou_pena:{
  texto:[
    'Você põe a pena de volta no chão do círculo — ou nunca pega, ou volta pra pôr, e nos três casos o gesto é o mesmo.',
    'E recua até a borda da laje.',
    'Ele olha a pena no chão.',
    'Depois olha você.',
    'E aí ele faz uma coisa muito pequena: ele empurra a pena com o bico, dois centímetros, na sua direção.',
    'E depois recua ele mesmo um passo.',
    'Você não pega.',
    'Ele empurra de novo.',
    'E vocês ficam nisso — ele empurrando e você não pegando — umas quatro vezes, numa laje de doze metros, dentro de uma coluna de luz, às onze e quarenta da noite, e é a coisa mais absurda e mais engraçada que já aconteceu com você.',
    'Na quinta vez, você pega.',
    'E ele bate as asas uma vez, e sobe.'
  ],
  ef:{flag:['pena_dada','tem_a_pena'],
      itens:{'Pena Arco-Íris':1},
      executar:d=>{ const L=Estado.lend(250); if(L){ L.disposicao='passivo'; L.aliado=true; } return []; },
      rep:{eixo:'bom',delta:7,motivo:'Não pegou até ser dado quatro vezes'},
      moral:25, instabilidade:-2,
      registrar:'Ho-Oh empurrou a pena para você cinco vezes até você pegar.',
      presagio:'Cinco vezes. A diferença entre tirar e receber custa cinco vezes.'},
  escolhas:[
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Ficar no círculo até amanhecer.', vai:'c16_desceu_ilha'},
    {texto:'Ir contar pro Sr. Tanner.', vai:'c16_desceu_ilha'},
    {texto:'Ir contar pra expedição.', vai:'c16_deu_a_pena', cond:d=>!!d.flags.achou_equipe_na_ilha}
  ]
},

c16_captura_hooh:{
  texto:[
    'Você joga a bola dentro de uma coluna de luz que sai de uma laje de pedra num topo de ilha sem nome.',
    'Ele não desvia.',
    'Ele olha a bola vindo, na trajetória inteira, e não desvia.'
  ],
  ef:{moral:-15,
      executar:d=>{ const L=Estado.lend(250); if(L) L.ataquesSofridos++; return []; }},
  batalha:{dex:250, nivel:60, tipo:'lendario', fuga:true, ambiente:'montanha',
           vitoria:'c16_pos_hooh', derrota:'c16_pos_hooh', fuga2:'c16_desceu_ilha',
           captura:'c16_capturou_hooh', gameover:'gameover'}
},

c16_pos_hooh:{
  texto:[
    'Ele sobe pela luz.',
    'A luz apaga quando ele acaba de subir, e o alicerce fica escuro e frio de uma vez, e é o silêncio mais completo que você já ouviu, porque não tem mato, não tem bicho, não tem estrada.',
    'Só vento e mar a sessenta metros abaixo.',
    'E você fica de pé no meio de uma laje, no escuro, sozinh{o|a}.',
    'Ele não lutou de verdade.',
    'Você entende isso pelo que não aconteceu: a laje está inteira, o alicerce está inteiro, você está inteir{o|a}.',
    'Uma coisa de sete metros de envergadura passou vinte minutos com você e não quebrou nada.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(250); if(L && L.ataquesSofridos>=2){ L.disposicao='hostil'; return [{tipo:'perigo', texto:'Ho-Oh não vai voltar enquanto você estiver em Kanto.'}]; } return []; },
      rep:{eixo:'ruim',delta:2,motivo:'Atacou Ho-Oh no alicerce'}, moral:-15, instabilidade:1,
      presagio:'Ele não quebrou nada. Repara que você não sabe se isso é bondade ou desprezo.'},
  escolhas:[
    {texto:'Tentar de novo na próxima janela.', vai:'c16_desceu_ilha'},
    {texto:'Deitar numa das três depressões.', vai:'c16_deitou_na_depressao'},
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'Ficar na laje até amanhecer.', vai:'c16_desceu_ilha'}
  ]
},

c16_capturou_hooh:{
  texto:[
    'A bola fecha.',
    'E a luz não apaga.',
    'Isso é o que quebra você: a coluna de luz continua saindo da laje, subindo duzentos metros e abrindo em leque no alto, sem nada dentro dela.',
    'Ela fica assim quarenta minutos, que é o tempo de sempre, e depois some, sozinha, no horário.',
    'A luz nunca foi ele.',
    'A luz é o lugar chamando.',
    'E ela vai continuar chamando a cada seis, sete ou oito anos, pelo tempo que for, com o círculo vazio.',
    d=>d.flags.viu_as_tres_depressoes ? 'E as três depressões na laje vão continuar vazias, e agora tem uma quarta coisa que não vem.' : ''
  ],
  ef:{instabilidade:3, flag:'capturou_hooh', moral:-25,
      registrar:'Capturou Ho-Oh. A luz continuou saindo da laje, vazia, pelos quarenta minutos de sempre.',
      presagio:'A luz é o lugar chamando. Vai continuar chamando.'},
  escolhas:[
    {texto:'Soltar. Agora, aqui.', vai:'c16_soltou_hooh'},
    {texto:'Descer com ele.', vai:'c16_desceu_com_hooh'},
    {texto:'Ficar até a luz sumir e decidir depois.', vai:'c16_soltou_hooh'},
    {texto:'Deitar numa das depressões com a bola na mão.', vai:'c16_deitou_com_a_bola'}
  ]
},

c16_deitou_com_a_bola:{
  texto:[
    'Você deita numa das três depressões da laje com a bola na mão.',
    'Dali só se vê o céu, e o céu tem a coluna de luz atravessando ele, e a coluna está vazia.',
    'Você fica deitad{o|a} os quarenta minutos inteiros.',
    'E na metade deles você percebe que está deitad{o|a} num lugar gasto por um corpo que morreu aqui há séculos, com o responsável por trazer esse corpo de volta fechado numa esfera de dez centímetros na sua mão.',
    'E que a três horas de mar tem uma praia de pedra com três lugares gastos, ocupados agora, esperando.',
    'A luz some no horário.',
    'E você continua deitad{o|a}.'
  ],
  ef:{flag:'deitou_com_a_bola',
      moral:-15, instabilidade:1,
      registrar:'Ficou deitado numa das depressões com Ho-Oh na mão até a luz sumir.',
      presagio:'Três lugares gastos numa praia de pedra, ocupados, esperando.'},
  escolhas:[
    {texto:'Soltar.', vai:'c16_soltou_hooh'},
    {texto:'Descer com ele.', vai:'c16_desceu_com_hooh'},
    {texto:'Ficar até amanhecer e soltar.', vai:'c16_soltou_hooh'},
    {texto:'Descer da ilha.', vai:'c16_desceu_com_hooh'}
  ]
},

c16_soltou_hooh:{
  texto:[
    'Você abre a bola no centro do círculo.',
    'Ele sai.',
    'E não vai embora na hora: ele fica na laje, no lugar dele, no desgaste que o corpo dele fez ao longo de séculos, e olha você.',
    'E depois faz a coisa que ele tinha começado a fazer antes de você jogar a bola:',
    'ele anda pelo alicerce e para nas três depressões, uma por uma, e encosta o bico em cada uma.',
    'Uma. Duas. Três.',
    'Quarenta segundos em cada.',
    'Ele termina o que estava fazendo.',
    'E só depois de terminar é que ele sobe.'
  ],
  ef:{flag:'soltou_hooh', limpaFlag:'capturou_hooh',
      executar:d=>{
        const p=[...d.time,...d.pc].find(x=>x.dex===250);
        const av = p ? Captura.soltar(p).map(e=>({tipo:e.tipo,texto:e.texto})) : [];
        const L=Estado.lend(250); if(L) L.disposicao='passivo';
        return av;
      },
      rep:{eixo:'bom',delta:5,motivo:'Soltou antes de descer da ilha'},
      moral:20, instabilidade:-2,
      registrar:'Soltou Ho-Oh no círculo. Ele terminou o ritual antes de subir.'},
  escolhas:[
    {texto:'Descer da ilha.', vai:'c16_desceu_ilha'},
    {texto:'"Eles estão vivos."', vai:'c16_eles_estao_vivos', cond:d=>!!d.flags.viu_os_tres || !!d.flags.sabe_dos_tres},
    {texto:'Falar com ele.', vai:'c16_falou_hooh'},
    {texto:'Ficar parad{o|a} e ver.', vai:'c16_ficou_parado'}
  ]
},

c16_desceu_com_hooh:{
  texto:[
    'Você desce os cento e quatro degraus com uma bola no cinto.',
    'O Sr. Tanner está no barco com a luz de posição acesa e ele te vê chegar e a primeira coisa que ele pergunta é:',
    '"Viu?"',
    '"Vi."',
    'E ele ri, e fica rindo por uns vinte segundos, e depois para de rir porque ele reparou na sua cara.',
    '"Que foi?"',
    'E você não responde.',
    'E ele olha o seu cinto, e depois o seu rosto, e depois o seu cinto de novo.',
    'E ele não pergunta mais nada.',
    'Onze horas de travessia de volta com um velho de oitenta e um anos que passou quarenta esperando ver, e que viu, e que agora não olha pra você.'
  ],
  ef:{flag:'desceu_com_hooh',
      rep:{eixo:'ruim',delta:3,motivo:'Desceu da ilha com Ho-Oh no cinto'},
      npc:{nome:'Sr. Tanner', opiniao:-4, memoria:'Reparou na bola no seu cinto e não perguntou mais nada nas onze horas de volta.'},
      moral:-25, instabilidade:2,
      registrar:'Saiu da ilha com Ho-Oh capturado.',
      presagio:'Ele não olha pra você. Onze horas.'},
  escolhas:[
    {texto:'Soltar no meio da travessia.', vai:'c16_soltou_hooh'},
    {texto:'Voltar pra ilha e soltar no círculo.', vai:'c16_soltou_hooh'},
    {texto:'Explicar pro Sr. Tanner.', vai:'c16_explicou_pro_ze'},
    {texto:'Não dizer nada as onze horas.', vai:'c16_fim'}
  ]
},

c16_explicou_pro_ze:{
  texto:[
    'Você tenta explicar.',
    'Você fala de instabilidade, de gente que vem em dois mil e sete, de que é melhor estar com você do que com eles, de que você vai soltar depois, de que é temporário.',
    'Ele ouve tudo.',
    'E no fim ele fala uma coisa só, sem raiva nenhuma, que é o que torna tudo pior:',
    '"Meu pai foi vinte e três vezes."',
    'Ele corrige o rumo.',
    '"Eu fui três."',
    'Ele olha o mar.',
    '"E você foi uma."'
  ],
  ef:{flag:'ze_falou_das_vezes',
      npc:{nome:'Sr. Tanner', opiniao:-3, memoria:'Disse que o pai foi 23 vezes, ele foi 3 e você foi 1.'},
      moral:-15,
      registrar:'"Meu pai foi vinte e três vezes. Eu fui três. E você foi uma."',
      presagio:'Ele contou as vezes. É a única coisa que ele podia contar.'},
  escolhas:[
    {texto:'Mandar ele virar o barco.', vai:'c16_soltou_hooh'},
    {texto:'Soltar do barco mesmo.', vai:'c16_soltou_hooh'},
    {texto:'Não dizer mais nada.', vai:'c16_fim'},
    {texto:'"Você tem razão." E ficar calad{o|a}.', vai:'c16_fim'}
  ]
},

c16_desceu_ilha:{
  texto:[
    'Você desce os cento e quatro degraus.',
    d=>d.flags.riscou_o_degrau ? 'Na metade você passa pela sua marca nova, que é a mais rasa e a mais torta de todas, e você encosta o dedo nela ao passar.' : '',
    'O Sr. Tanner está no barco com a luz de posição acesa e a garrafa térmica vazia.',
    '"Viu?"',
    d=>{
      if (d.flags.tem_a_pena || d.flags.pena_dada) return '"Vi."\nVocê mostra a pena.\nEle olha quarenta centímetros de vermelho e dourado por muito tempo e não encosta.\n"Meu pai ia gostar."';
      if (d.flags.viu_hooh) return '"Vi."\nEle bate na borda do barco duas vezes com a palma da mão.\n"Pronto. Agora tem dois."';
      if (d.flags.viu_o_arco_iris) return '"A luz eu vi. O resto não deu tempo."\nEle assente.\n"A luz já é."';
      return '"Não."\nEle assente devagar.\n"Da próxima."';
    },
    'A travessia de volta leva onze horas e ele dorme sentado com a mão no leme, acordando a cada vinte minutos pra corrigir o rumo, do mesmo jeito da ida.',
    'Você fica acordad{o|a} as onze horas inteiras.'
  ],
  ef:{flag:'desceu_da_ilha'},
  escolhas:[{texto:'Voltar a Fuchsia.', vai:'c16_fim'}]
},

c16_fim:{
  texto:[
    d=>{
      if (d.flags.contou_pra_hooh) return 'A luz ficou dourada por quatro segundos. Você não sabe o que isso quis dizer e nunca vai saber, e quem sabe desceu por ela e subiu de novo sem explicar nada a ninguém.';
      if (d.flags.pena_dada) return 'Você tem uma pena de quarenta centímetros que foi empurrada cinco vezes na sua direção até você pegar, e que pesa vinte gramas, e que você não faz ideia do que é pra fazer com.';
      if (d.flags.capturou_hooh || d.flags.desceu_com_hooh) return 'Você tem no cinto uma coisa que uma ilha inteira foi construída pra esperar, e a ilha vai continuar esperando, e a luz vai continuar saindo da laje no horário.';
      if (d.flags.queimou_a_pena) return 'Tem um risco preto novo numa laje de doze metros a onze horas da costa, e ele é o trigésimo segundo, e nenhum dos trinta e um anteriores resolveu nada.';
      if (d.flags.nao_foi_a_ilha) return 'A ilha continua onde estava, e a luz continua aparecendo duas vezes por década, e um velho continua contando no cais.';
      return 'A ilha continua onde estava, sem nome, com um alicerce de doze metros de lado e uma cisterna seca e uma escada de cento e quatro degraus cortada à mão.';
    },
    d=>{
      if (d.flags.equipe_recusou_a_pena || d.flags.equipe_devolveu_a_pena) return 'E numa expedição que custou cento e sessenta mil, uma mulher de quarenta e um anos de carreira vai voltar sem amostra, de propósito, pela primeira vez.';
      if (d.flags.equipe_nao_coleta) return 'E um relatório vai ser escrito de um jeito que compra dois anos, e dois anos é o que existe entre uma coisa acontecer e não acontecer.';
      if (d.flags.destruiu_a_expedicao) return 'E um incidente vai prorrogar um projeto que ia fechar por falta de resultado, e você é o incidente.';
      if (d.flags.expulsou_a_equipe) return 'E quatro pessoas voltaram sem nada e vão voltar em dois mil e sete, e a chefe delas desamarrou a corda em vez de cortar.';
      return 'E em algum lugar, alguém está preenchendo um formulário de prorrogação de verba.';
    },
    d=>d.flags.ze_virou_coautor ? 'E num artigo que vai sair daqui a dois anos numa revista que ninguém lê, o segundo nome da lista de autores vai ser Z. A. Tanner, pescador, Fuchsia.' :
       d.flags.tem_a_caixa_de_charuto ? 'E você está com uma caixa de charuto amarrada com elástico que tem sessenta e um anos dentro, e que não é sua, e que você prometeu não deixar numa caixa.' : '',
    'Em Fuchsia, no cais, o Sr. Tanner amarra o barco e sobe os quatro degraus da rampa devagar, e vai direto pra mesa de dominó.',
    'E senta.',
    'E as pessoas da mesa perguntam onde ele esteve.',
    'E ele começa a contar.'
  ],
  fim:true, resumo:'Capítulo 16 concluído — a ilha sem nome tinha três buracos vazios em cima.'

}

}}

);
