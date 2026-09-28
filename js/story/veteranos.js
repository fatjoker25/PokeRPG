/* ============================================================
   VETERANOS
   Gente que treina há mais tempo do que você tem de estrada. Cada
   um mora num lugar que importa — o fundo do Monte da Lua, o cais
   de pesca de Vermilion, o Caminho da Vitória — e aparece ali
   quando você chega com as insígnias que ele respeita.

   Ninguém te para: você vai atrás. O time é inteiro, o nível fica
   acima do seu, e eles erram pouco. Quem vence leva um prêmio que
   não se compra, o número do PokéNav, e dias depois o telefone toca
   com um convite. Os que vão à Conferência do Planalto Indigo te esperam lá
   depois que você senta na cadeira do Campeão.

   O motor mora aqui junto com os dados, porque os dois só fazem
   sentido juntos. A Conferência fica no fim do arquivo.
   ============================================================ */

/* O nível do veterano é o do lugar + PISO_VETERANO, fixo: de passagem
   ele está bem acima de você, e dá pra voltar mais forte. Quando você
   passa desse número, ele acompanha os seus três mais fortes (mais
   ACIMA_VETERANO) — senão voltar no fim do jogo virava passeio. */
const PISO_VETERANO = 9;
const ACIMA_VETERANO = 0;
/* na Conferência, acima dos seus três mais fortes, mais a rodada */
const ACIMA_CONFERENCIA = 2;
/* chance, em %, de a IA escolher o segundo melhor golpe (o normal é 22) */
const ERRO_IA_VETERANO = 8;
/* o prêmio é o da classe × nível do último Pokémon, vezes isto */
const PAGA_VETERANO = 3;
/* tamanho do time pelas insígnias que o lugar pede: fica fixo, pra voltar
   mais forte valer a pena (a revanche pelo PokéNav vem sempre com 6) */
const TAM_VETERANO = [3, 3, 4, 4, 5, 5, 6, 6, 6];

const VETERANOS = [
{
  id:'harlan', local:'monte_lua', insignias:1, conferencia:true,
  classe:'Montanhista', arq:'hiker', artigo:'um', nome:'Harlan',
  porta:{titulo:'Seguir a luz de lanterna que vem do fundo da caverna',
         sub:'Alguém acampa lá embaixo, onde a trilha marcada acaba.'},
  onde:'no fundo da caverna',
  times:[27, 104, 66, 111, 74, 208],
  golpes:['Rock Slide', 'Dig', 'Earthquake'],
  premio:{'TM48 Rock Slide':1, 'Colete de Lona':1},
  apresenta:[
    'A trilha marcada acaba numa placa de "PERIGO" que alguém pintou por cima com "É SÓ OLHAR ONDE PISA".',
    'Depois da placa tem uma barraca, um fogareiro, e um homem de barba branca desenhando num caderno quadriculado com a lanterna presa na testa.',
    fala('Harlan', 'Se você veio pela trilha marcada, você perdeu metade da caverna.'),
    fala('Harlan', 'Harlan. Eu desenho o mapa daqui faz vinte e seis anos, e ele muda toda estação. Pedra anda, sabia? Devagar, mas anda.'),
    fala('Harlan', 'Quem desce até aqui sem ninguém mandar quer uma coisa só. Eu tenho seis que moram comigo nessa pedra, e nenhum deles perde pra quem só conhece a trilha marcada.'),
    fala('Harlan', 'Se quiser, é agora. Se não quiser, a saída é por onde você veio.')
  ],
  volta:[fala('Harlan', 'Voltou. A pedra também não saiu do lugar.', 'riso'), fala('Harlan', 'De novo?')],
  vence:'"Olha onde pisa na volta."',
  perde:'"Vinte e seis anos e você me desenha um caminho que eu não conhecia."',
  depois:[
    'Harlan está no mesmo lugar, com o caderno aberto numa página nova.',
    fala('Harlan', 'Eu pus você no mapa. Canto de baixo, perto da água. Não é homenagem, é que foi ali que você me passou.')
  ],
  torneio:'"Saí da caverna por causa de torneio. Faz onze anos que eu não fazia isso."',
  chamada:{
    falas:[
      fala('Harlan', 'É o Harlan, da caverna. Tem sinal aqui na boca do Túnel da Rocha, então é agora ou nunca.'),
      fala('Harlan', 'Tem uma turma abrindo parede lá dentro com carga de explosivo pra tirar pedra de construção. Três estouros ontem. O que mora lá dentro não tem pra onde ir.'),
      fala('Harlan', 'Eu sou velho pra discutir com três de uma vez. Com dois eu ainda dou conta.', 'baixo')
    ],
    aceita:'"Eu vou. Me espera na entrada."',
    combinado:[fala('Harlan', 'Entrada leste. Traz lanterna.')],
    recusa:'"Não dá agora."',
    recusado:[fala('Harlan', 'Tá. Eu vou sozinho, então. Já fui sozinho pior.', 'frio')]
  },
  convite:{
    local:'tunel_rocha', titulo:'Encontrar Harlan na entrada leste do túnel',
    sub:'Ele marcou ali. Tem pó de explosão no ar.',
    cena:[
      'Harlan está sentado numa pedra na entrada leste, com a lanterna apagada pra poupar pilha.',
      fala('Harlan', 'Eles estão no segundo salão. O capataz é o de capacete amarelo. Os outros dois só obedecem.'),
      'O segundo salão tem a parede aberta num buraco do tamanho de uma porta, e um homem de capacete amarelo contando pavio.',
      fala('Capataz Doyle', 'A área é concedida. Tem papel. Quem não tem papel sai.'),
      fala('Harlan', 'O papel diz pedreira na encosta. Isso aqui é o túnel.', 'frio'),
      fala('Capataz Doyle', 'Então resolve com os meus, velho. Ou manda {o garoto|a garota}.')
    ],
    botao:'Tomar a frente de Harlan',
    luta:{classe:'Capataz', arq:'worker', nome:'Doyle', times:[74, 66, 100, 95, 111], acima:2},
    fim:[
      'O capataz recolhe o último e olha a parede aberta um tempo comprido.',
      fala('Capataz Doyle', 'Eu vou ter que explicar isso pra alguém.'),
      fala('Harlan', 'Explica que o túnel tem dono. São uns quatrocentos, e nenhum deles assina papel.'),
      'Na saída, Harlan tira do caderno uma folha dobrada e te entrega sem abrir.',
      fala('Harlan', 'O túnel inteiro, com os salões que ninguém sabe. Não é pra vender. É pra não se perder.')
    ],
    recompensa:()=>{
      Estado.darItem('Revive', 2); Estado.darItem('Máscara de pó', 1); Estado.j.dinheiro += 4000;
      return [{tipo:'item', texto:'+4.000 ₽ · 2× Revive · Máscara de pó'}];
    }
  }
},
{
  id:'morgan', local:'cerulean', insignias:2, conferencia:false,
  classe:'Treinador Ás', arq:'ace_trainer', artigo:'um', nome:'Morgan',
  porta:{titulo:'Ver quem treina sozinho debaixo da ponte velha',
         sub:'Seis bolas enfileiradas na beira do rio, e ninguém em volta.'},
  onde:'debaixo da ponte velha',
  times:[21, 60, 43, 58, 111, 25],
  golpes:['Body Slam', 'Swift', 'Thunder Wave'],
  premio:{'TM08 Body Slam':1, 'Exp. Share':1},
  apresenta:[
    'Debaixo da ponte velha, onde o rio faz barulho de gente falando, um rapaz de jaqueta de Liga treina seis Pokémon ao mesmo tempo, um de cada vez, em silêncio.',
    'Ele te vê chegar pelo reflexo na água antes de virar.',
    fala('Morgan', 'Morgan. Eu fui da Liga dois anos. Oito insígnias, quarta rodada do Planalto, e depois eu voltei pra cá pra aprender o que eu não tinha aprendido.'),
    fala('Morgan', 'Eu não desafio gente com duas insígnias.'),
    fala('Morgan', 'Mas eu também não recuso. Se você quiser ver onde fica a distância entre duas e oito, é agora.')
  ],
  volta:[fala('Morgan', 'Duas semanas de treino ou duas horas?'), fala('Morgan', 'Tanto faz. Vem.')],
  vence:'"Ainda tem distância. Menos do que tinha."',
  perde:'"Oito insígnias e você me pegou na troca. Eu vou pensar nisso a noite inteira."',
  depois:[
    'Morgan continua debaixo da ponte, agora com cinco bolas na fila e uma no bolso.',
    fala('Morgan', 'A sexta eu tirei da fila. Ela perdeu pra você e eu achei que ela precisava de uns dias fora do treino. Bicho sente.')
  ],
  torneio:'"Quarta rodada, de novo. Eu queria ver se desta vez era você do outro lado."',
  chamada:{
    falas:[
      fala('Morgan', 'Morgan, da ponte. Eu vou treinar na Rota 25 amanhã de manhã, no descampado do fim.'),
      fala('Morgan', 'Treino de verdade, de manhã até a tarde, com o time inteiro. É chato, é repetitivo, e é o único que funciona.'),
      fala('Morgan', 'Se quiser vir, vem com o seu. Eu não te espero depois das sete.')
    ],
    aceita:'"Às sete eu tô lá."',
    combinado:[fala('Morgan', 'Seis e meia. Às sete eu já comecei.')],
    recusa:'"Não vai dar."',
    recusado:[fala('Morgan', 'Tudo bem. O descampado continua lá.')]
  },
  convite:{
    local:'rota24', titulo:'Treinar com Morgan no descampado do fim da rota',
    sub:'Seis e meia da manhã, antes do sol.',
    cena:[
      'Morgan já está lá, de tênis molhado de orvalho, com um caderno e um cronômetro.',
      fala('Morgan', 'Nada de luta. Hoje é repetição. Seu time faz a mesma coisa cem vezes até fazer sem pensar.'),
      'Vocês passam a manhã inteira e metade da tarde nisso. Ninguém fala muito.',
      'No fim, os seus estão cansados de um jeito diferente do cansaço de luta: cansaço de quem aprendeu.'
    ],
    botao:'Treinar até a tarde',
    treino:true,
    fim:[
      fala('Morgan', 'É isso. Não tem segredo. Quem te disser que tem está vendendo alguma coisa.'),
      'Ele te entrega um frasco sem rótulo antes de ir embora.',
      fala('Morgan', 'Éter que eu mesmo faço. Não pergunta a receita.')
    ],
    recompensa:()=>{
      Estado.darItem('Éter', 3);
      const avisos = [{tipo:'item', texto:'3× Éter'}];
      Estado.dados.time.filter(p => !p.morto).forEach(p => {
        ganharExp(p, Math.round(p.nivel * p.nivel * 2.5 + 60));
      });
      avisos.push({tipo:'pokemon', texto:'O time inteiro ganhou experiência de um dia de treino.'});
      Mundo.passar(3);
      return avisos;
    }
  }
},
{
  id:'rhoda', local:'vermilion', insignias:3, conferencia:true, f:true,
  classe:'Veterana', arq:'veteran_f', artigo:'uma', nome:'Rhoda',
  porta:{titulo:'Falar com a mulher que treina no fim do cais de pesca',
         sub:'O cais de pesca, não o de carga. Ela está lá desde antes de a maré baixar.'},
  onde:'no fim do cais de pesca',
  times:[98, 120, 81, 171, 125, 129],
  golpes:['Bubble Beam', 'Thunder Wave', 'Water Gun'],
  premio:{'TM13 Ice Beam':1, 'Resto de Ração':1},
  apresenta:[
    'No fim do cais de pesca tem uma mulher de uns sessenta anos, de capa de chuva num dia sem chuva, fazendo um Gyarados subir e descer na água como quem ensina escada a criança.',
    fala('Rhoda', 'Trinta e um anos de mar. Rhoda. Eu comandava rebocador nesse porto quando o porto ainda era de rebocador.'),
    fala('Rhoda', 'Eu vi você passar três vezes olhando pra cá. Na terceira eu resolvi que era pra mim.'),
    fala('Rhoda', 'Eu luto do jeito que o mar luta: não tenho pressa, e não paro.')
  ],
  volta:[fala('Rhoda', 'A maré virou duas vezes desde a última.'), fala('Rhoda', 'Vamos de novo.')],
  vence:'"O mar não tem raiva de ninguém. Ele só não para."',
  perde:'"Ha! Faz nove anos que alguém não me tira desse cais molhada."',
  depois:[
    'Rhoda está no fim do cais, remendando uma rede com a mão boa.',
    fala('Rhoda', 'O Gyarados ficou dois dias de mau humor depois de você. Ele não perdia pra ninguém de terra.', 'riso')
  ],
  torneio:'"Eu vim de barco. Eu não subo escada rolante."',
  chamada:{
    falas:[
      fala('Rhoda', 'Rhoda, do cais. Escuta.'),
      fala('Rhoda', 'Tem um barco na Rota 12 pescando com rede de choque. Liga a rede, o cardume de Magikarp inteiro sobe de barriga pra cima, eles escolhem os bons e o resto fica boiando.'),
      fala('Rhoda', 'A capitania diz que não é com ela. Eu tenho sessenta e um anos e uma perna ruim.', 'frio'),
      fala('Rhoda', 'Você tem duas boas.')
    ],
    aceita:'"Onde eu te encontro?"',
    combinado:[fala('Rhoda', 'No píer da Rota 12, ao amanhecer. O barco é o azul sem nome no casco. Barco honesto tem nome.')],
    recusa:'"Isso não é comigo."',
    recusado:[fala('Rhoda', 'Não é com ninguém. É esse o problema.', 'frio')]
  },
  convite:{
    local:'rota12', titulo:'Encontrar Rhoda no píer, ao amanhecer',
    sub:'O barco azul sem nome no casco.',
    cena:[
      'O barco azul está atracado no píer com o gerador ligado. Tem Magikarp boiando de barriga pra cima em volta do casco inteiro.',
      'Rhoda chega mancando, de capa, e para do seu lado sem dizer nada.',
      fala('Pescador Garrick', 'O rio é público. Eu pesco do jeito que eu quiser.'),
      fala('Rhoda', 'O rio é público. O que tá boiando também era.', 'frio'),
      fala('Pescador Garrick', 'Então vem tirar, vó.')
    ],
    botao:'Tirar ele do píer',
    luta:{classe:'Pescador', arq:'fisherman', nome:'Garrick', times:[118, 98, 81, 72, 129], acima:2},
    fim:[
      'Rhoda desce no barco sem pedir licença, arranca o cabo do gerador com a mão boa e joga no rio.',
      fala('Rhoda', 'Agora é público de novo.'),
      'Vocês passam a manhã tirando os Magikarp que ainda mexem de volta pra água funda. Uns cento e vinte. Rhoda conta um por um.'
    ],
    recompensa:()=>{
      Estado.darItem('Isca', 5); Estado.darItem('Super Potion', 4); Estado.j.dinheiro += 5000;
      const r = Estado.mudarRep('bom', 1, 'Tirou do rio um barco que pescava com choque', {rep:{notorio:false, peso:2}});
      const av = [{tipo:'item', texto:'+5.000 ₽ · 5× Isca · 4× Super Potion'}];
      if (r && r.mudou) av.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
      return av;
    }
  }
},
{
  id:'odessa', local:'lavender', insignias:4, conferencia:false, f:true,
  classe:'Médium', arq:'medium', artigo:'uma', nome:'Odessa',
  porta:{titulo:'Subir a escada da casa de chá, onde uma mulher joga cartas sozinha',
         sub:'A mesa dela tem duas xícaras. Uma é pra quem sobe.'},
  onde:'na casa de chá',
  times:[200, 96, 177, 124, 122, 92],
  golpes:['Shadow Ball', 'Psychic', 'Dream Eater'],
  premio:{'TM30 Shadow Ball':1, 'Sino Calmante':1},
  apresenta:[
    'O segundo andar da casa de chá tem uma mesa só, perto da janela que dá pra Torre. Uma mulher de xale joga paciência com um baralho de cartas sem desenho.',
    'Ela serve a segunda xícara antes de você sentar.',
    fala('Odessa', 'Odessa. Eu não leio a sorte de ninguém. As cartas são brancas porque eu não gosto de figura.'),
    fala('Odessa', 'Eu treino quem a cidade tem medo de treinar. Eles são quietos, e a quietude deles cansa quem luta contra.'),
    fala('Odessa', 'Termina o chá primeiro. Depois a gente desce.')
  ],
  volta:[fala('Odessa', 'O chá ainda está quente. Senta.'), fala('Odessa', 'Ou não senta, e a gente desce direto.')],
  vence:'"Não tem vergonha. Quem cansa primeiro é quem ainda está vivo."',
  perde:'"Eles gostaram de você. Eles não gostam de quase ninguém."',
  depois:[
    'Odessa está na mesma mesa, com a mesma segunda xícara servida.',
    fala('Odessa', 'Eu sirvo todo dia. Na maioria dos dias ninguém sobe. Não é desperdício: é convite.')
  ],
  torneio:'"Eu não vim pelo torneio. Eu vim porque tinha barulho demais em Lavender hoje."',
  chamada:{
    falas:[
      fala('Odessa', 'Odessa. Na lua nova a cidade faz vigília na base da Torre, com vela.'),
      fala('Odessa', 'Não é pra ninguém em especial. É pra todos que não têm quem acenda.'),
      d=>d.cemiterio.length
        ? fala('Odessa', `E eu sei que você tem alguém pra acender. ${nomeExib(d.cemiterio[0])}. Eu não sei como eu sei.`, 'baixo')
        : fala('Odessa', 'Venha, se puder. Traga os seus. Eles gostam de ver a vela.')
    ],
    aceita:'"Eu vou."',
    combinado:[fala('Odessa', 'Depois do anoitecer. Eu guardo uma vela pra você.')],
    recusa:'"Eu não gosto de vigília."',
    recusado:[fala('Odessa', 'Ninguém gosta. É por isso que precisa de gente.')]
  },
  convite:{
    local:'lavender', titulo:'Ir à vigília na base da Torre',
    sub:'Depois do anoitecer. Odessa guardou uma vela.',
    cena:[
      'Tem umas quarenta pessoas na base da Torre, cada uma com uma vela, e ninguém fala mais alto que o vento.',
      'Odessa te entrega a vela acesa sem dizer nada e volta pro lugar dela.',
      d=>d.cemiterio.length
        ? `Você pensa em ${d.cemiterio.map(p => nomeExib(p)).join(', ')}. Não em como foi. Em como era antes.`
        : 'Você não tem ninguém pra lembrar aqui, e mesmo assim a vela fica acesa na sua mão a noite inteira.',
      'Os seus ficam do seu lado, quietos, olhando a chama. Nenhum deles tenta apagar.'
    ],
    botao:'Ficar até a última vela apagar',
    fim:[
      'Quando a última vela apaga, já é quase manhã.',
      fala('Odessa', 'Obrigada por ficar. Quase ninguém fica até o fim.', 'baixo'),
      fala('Odessa', 'Eles descansam melhor quando alguém fica até o fim.')
    ],
    recompensa:d=>{
      d.time.filter(p => !p.morto).forEach(p => { p.moral = Math.min(100, (p.moral || 50) + 10); });
      Estado.curarJogador(20);
      Mundo.passar(2);
      return [{tipo:'cura', texto:'Alguma coisa em você descansa também.'},
              {tipo:'pokemon', texto:'Os seus ficaram mais perto de você. +10 de moral.'}];
    }
  }
},
{
  id:'corinne', local:'celadon', insignias:4, conferencia:false, f:true,
  classe:'Dama', arq:'lady', artigo:'uma', nome:'Corinne',
  porta:{titulo:'Aceitar o convite para o chá no jardim do terraço',
         sub:'Um cartão de papel grosso, deixado no balcão do Centro com o seu nome.'},
  onde:'no jardim do terraço',
  times:[114, 209, 241, 35, 43, 102],
  golpes:['Giga Drain', 'Body Slam', 'Mega Drain'],
  premio:{'TM19 Giga Drain':1, 'Amuleto de Moeda':1},
  apresenta:[
    'O terraço do prédio mais alto da avenida é um jardim inteiro, com árvore de verdade plantada em vaso do tamanho de um carro.',
    'A mulher que te chamou tem cabelo branco preso com grampo de ouro e as unhas sujas de terra.',
    fala('Corinne', 'Corinne. Eu mandei o cartão porque vi você lutar na rua de baixo e achei que valia um chá.'),
    fala('Corinne', 'Eu tive dinheiro a vida inteira. Isso é uma coisa que eu não escolhi. O jardim eu escolhi, e cada um deles eu escolhi.'),
    fala('Corinne', 'Eles são lentos, e são pacientes, e não caem. Quer ver?')
  ],
  volta:[fala('Corinne', 'O jardim cresceu dois dedos desde a última vez.'), fala('Corinne', 'Quer ver se você também?')],
  vence:'"Paciência não se compra. Eu tentei, quando era moça."',
  perde:'"Que bonito. Eu vou replantar a tarde inteira e vou lembrar de você o tempo todo."',
  depois:[
    'Corinne está de joelhos num canteiro, sem luva, com o grampo de ouro caído na terra.',
    fala('Corinne', 'Eu dei o amuleto porque eu não preciso de mais dinheiro. Você talvez precise. É assim que deveria funcionar.')
  ],
  torneio:'"Minha família acha que eu vim pro chá da diretoria."',
  chamada:{
    falas:[
      fala('Corinne', 'Corinne, do terraço. Eu vou te pedir uma coisa que eu não posso pedir pra mais ninguém da minha família.'),
      fala('Corinne', 'Um conhecido meu, desses de jantar, coleciona Pokémon. Coleciona mesmo, em vitrine, no salão de festas da casa dele aqui em Celadon.'),
      fala('Corinne', 'Ele me convidou pra ver a coleção nova. Eu quero ir com alguém que saiba lutar.', 'baixo')
    ],
    aceita:'"Eu vou com a senhora."',
    combinado:[fala('Corinne', 'Sábado, sete da noite. Vem com roupa limpa, que ele repara.')],
    recusa:'"Eu não me meto em briga de rico."',
    recusado:[fala('Corinne', 'Eu entendo. Eu também não me metia, e foi assim que ele juntou quarenta vitrines.', 'frio')]
  },
  convite:{
    local:'celadon', titulo:'Ir com Corinne ao jantar da coleção',
    sub:'Sábado, sete da noite, roupa limpa.',
    cena:[
      'O salão de festas tem quarenta vitrines iluminadas por baixo, e em cada uma tem um Pokémon parado olhando o vidro.',
      'O anfitrião usa terno de veludo em pleno verão e apresenta cada vitrine com o preço pago.',
      fala('Colecionador Everett', 'Esse aqui veio de Johto. Treze mil. Não faz nada, e é isso que eu gosto nele.'),
      fala('Corinne', 'Everett, abre as vitrines.'),
      fala('Colecionador Everett', 'Corinne, querida, você veio pro jantar ou pra me dar lição?'),
      fala('Corinne', 'Eu vim com alguém que vai te dar a lição. Eu só vim pro jantar.')
    ],
    botao:'Desafiar o colecionador',
    luta:{classe:'Colecionador', arq:'gentleman', nome:'Everett', times:[53, 40, 122, 113, 124], acima:2},
    fim:[
      'Everett fica olhando o time dele no chão do salão como quem olha um prato quebrado.',
      fala('Corinne', 'As vitrines, Everett.'),
      'Ele abre as quarenta, uma por uma, sem falar. Corinne passa a noite ligando pro Centro, pro controle de bichos e pra três criadores que ela conhece pelo nome.',
      fala('Corinne', 'Eu devia ter feito isso faz tempo. Eu precisava de alguém do lado.', 'baixo')
    ],
    recompensa:()=>{
      Estado.darItem('Pedra do Sol', 1); Estado.darItem('Pedra da Folha', 1); Estado.j.dinheiro += 8000;
      const r = Estado.mudarRep('bom', 2, 'Fez um colecionador de Celadon abrir as quarenta vitrines', {rep:{notorio:true, peso:3}});
      const av = [{tipo:'item', texto:'+8.000 ₽ · Pedra do Sol · Pedra da Folha'}];
      if (r && r.mudou) av.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
      return av;
    }
  }
},
{
  id:'conrad', local:'saffron', insignias:5, conferencia:true,
  classe:'Faixa-Preta', arq:'black_belt', artigo:'um', nome:'Conrad',
  porta:{titulo:'Entrar no salão de luta da rua de trás',
         sub:'A porta está aberta e dá pra ouvir alguém contando golpe em voz alta.'},
  onde:'no salão de luta da rua de trás',
  times:[56, 106, 107, 237, 214, 66],
  golpes:['Dynamic Punch', 'Submission', 'Rock Slide'],
  premio:{'TM01 Dynamic Punch':1, 'Punho de Ferro':1},
  apresenta:[
    'O salão tem tatame gasto, espelho rachado na parede do fundo, e um homem de cinquenta e poucos anos contando em voz alta enquanto um Machamp repete o mesmo soco no saco de areia.',
    'Ele para de contar quando você entra. O Machamp não para de socar.',
    fala('Conrad', 'Conrad. O salão é meu faz vinte anos. Não tem nome na porta porque quem precisa acha.'),
    fala('Conrad', 'Eu não ensino a ganhar. Eu ensino a aguentar. Ganhar é o que acontece com quem aguentou mais que o outro.'),
    fala('Conrad', 'Tira o sapato. No tatame não se entra de sapato, nem pra perder.')
  ],
  volta:[fala('Conrad', 'Sapato.'), fala('Conrad', 'Agora sim.')],
  vence:'"Você aguentou bem. Não o bastante."',
  perde:'"Aguentou mais que eu. Faz tempo que ninguém aguenta mais que eu."',
  depois:[
    'Conrad está contando de novo, e o Machamp está socando de novo, como se você nunca tivesse saído.',
    fala('Conrad', 'Os alunos perguntaram de você. Eu disse que você não era aluno. Eles não entenderam o elogio.')
  ],
  torneio:'"Eu fechei o salão por um dia. Os alunos vieram assistir."',
  chamada:{
    falas:[
      fala('Conrad', 'Conrad. Sábado tem exame de faixa no salão.'),
      fala('Conrad', 'A minha melhor aluna vai fazer a prova. Ela precisa de alguém de fora pra lutar contra, alguém que eu não treinei.'),
      fala('Conrad', 'Se ela ganhar de você, passa. Se perder, espera mais um ano. Não pega leve. Pegar leve com ela é roubar dela.')
    ],
    aceita:'"Eu vou, e eu não pego leve."',
    combinado:[fala('Conrad', 'Oito da manhã. Sapato na porta.')],
    recusa:'"Não quero decidir o ano de ninguém."',
    recusado:[fala('Conrad', 'Quem decide é ela. Você só ia estar lá.', 'frio')]
  },
  convite:{
    local:'saffron', titulo:'Ir ao exame de faixa no salão de Conrad',
    sub:'Oito da manhã. Sapato na porta.',
    cena:[
      'Tem vinte alunos sentados em volta do tatame, de pernas cruzadas, em silêncio.',
      'A aluna é uma moça de uns dezenove anos, de cabelo raspado dos lados, com as mãos enfaixadas até o cotovelo.',
      fala('Ilse', 'Ilse. Quatro anos de salão. Eu não vou pedir desculpa depois.'),
      fala('Conrad', 'Ninguém pede. Começa.')
    ],
    botao:'Lutar o exame',
    luta:{classe:'Lutadora', arq:'battle_girl', nome:'Ilse', times:[56, 60, 66, 106, 107], acima:1},
    fim:[
      'Ilse fica de joelhos no tatame, respirando fundo, olhando o chão.',
      fala('Conrad', 'Mais um ano.'),
      fala('Ilse', 'Mais um ano.', 'baixo'),
      'Ela se levanta, se curva pra você reto até a cintura, e vai embora do salão com as faixas ainda nas mãos.',
      fala('Conrad', 'Ano que vem ela passa. Ela precisava saber quanto faltava. Agora ela sabe.')
    ],
    recompensa:()=>{
      Estado.darItem('Faixa Firme', 1); Estado.darItem('PP Up', 1); Estado.j.dinheiro += 6000;
      return [{tipo:'item', texto:'+6.000 ₽ · Faixa Firme · PP Up'}];
    }
  }
},
{
  id:'quinn', local:'rota16', insignias:5, conferencia:true,
  classe:'Motoqueiro', arq:'biker', artigo:'um', nome:'Quinn',
  porta:{titulo:'Parar no posto onde as motos ficam de noite',
         sub:'Uma fila de motos, e uma delas tem o banco rasgado com fita.'},
  onde:'no posto da Ciclovia',
  times:[23, 88, 211, 41, 32, 109],
  golpes:['Sludge Bomb', 'Toxic', 'Earthquake'],
  premio:{'TM36 Sludge Bomb':1, 'Botina Leve':1},
  apresenta:[
    'O posto da Ciclovia fica aberto a noite inteira, e a noite inteira tem moto parada em fila na frente dele.',
    'Quem manda na fila é um homem grisalho de jaqueta de lona remendada, sentado no banco de fita da moto mais velha.',
    fala('Quinn', 'Quinn. Eu rodo essa Ciclovia desde que ela era estrada de terra.'),
    fala('Quinn', 'A turma aqui acha que eu sou chefe. Eu não sou chefe de ninguém. Eu só sou a que ninguém ganhou ainda.'),
    fala('Quinn', 'Quer tentar? A turma vai assistir. A turma sempre assiste.')
  ],
  volta:[fala('Quinn', 'A turma apostou em você dessa vez. Metade dela.'), fala('Quinn', 'Vamos ver quem perde dinheiro.')],
  vence:'"A Ciclovia tem descida comprida. Descansa lá embaixo."',
  perde:'"A turma vai falar disso por um ano. Tudo bem. Faz tempo que eles não têm assunto novo."',
  depois:[
    'Quinn está sentado no banco de fita, com a turma em volta, e a turma abre espaço quando você chega.',
    fala('Quinn', 'Eles te chamam de "{aquele|aquela}". Assim, sem nome. É respeito, do jeito deles.')
  ],
  torneio:'"Eu vim de moto. Estacionei na vaga do diretor."',
  chamada:{
    falas:[
      fala('Quinn', 'Quinn, da Ciclovia. Tem uma turma nova descendo a Rota 17 de noite, tirando racha no meio de quem pedala.'),
      fala('Quinn', 'Ontem derrubaram uma menina de bicicleta. Ela tá bem. O Pokémon dela não.', 'frio'),
      fala('Quinn', 'Eu podia resolver do meu jeito. O meu jeito dá polícia. Vem resolver do seu.')
    ],
    aceita:'"Eu vou. Que horas eles descem?"',
    combinado:[fala('Quinn', 'Meia-noite. O chefe deles tem moto vermelha e acha isso importante.')],
    recusa:'"Isso é com a polícia."',
    recusado:[fala('Quinn', 'É. E a polícia não vem na Ciclovia depois das dez.', 'frio')]
  },
  convite:{
    local:'rota16', titulo:'Esperar a turma do racha com Quinn, à meia-noite',
    sub:'Moto vermelha. Ele acha isso importante.',
    cena:[
      'À meia-noite o barulho vem antes da luz. São sete motos, e a da frente é vermelha.',
      'Quinn se levanta do banco de fita e fica no meio da pista, de braço cruzado. As sete param.',
      fala('Dirk', 'A pista é de quem é mais rápido, tio.'),
      fala('Quinn', 'A pista é de quem pedala. Você não pedala.'),
      fala('Dirk', 'E quem vai me tirar? Você?'),
      fala('Quinn', 'Eu não. Eu tô velho pra isso.')
    ],
    botao:'Tirar a turma da pista',
    luta:{classe:'Arruaceiro', arq:'roughneck', nome:'Dirk', times:[109, 88, 23, 41, 58], acima:2},
    fim:[
      'Dirk sobe na moto vermelha sem olhar pra trás e desce a Ciclovia devagar, na velocidade de quem pedala.',
      'As outras seis descem atrás dele, em fila, também devagar.',
      fala('Quinn', 'Eles voltam. Mas voltam devagar. Às vezes é só isso que dá pra fazer.')
    ],
    recompensa:()=>{
      Estado.darItem('Repelente', 5); Estado.darItem('Hyper Potion', 2); Estado.j.dinheiro += 7000;
      return [{tipo:'item', texto:'+7.000 ₽ · 5× Repelente · 2× Hyper Potion'}];
    }
  }
},
{
  id:'talia', local:'fuchsia', insignias:5, conferencia:true, f:true,
  classe:'Guarda-Parque', arq:'pokemon_ranger_f', artigo:'uma', nome:'Talia',
  porta:{titulo:'Ir até a guarita da cerca, onde a guarda-parque almoça',
         sub:'A guarita fica no fim da estrada de terra, onde a cerca da reserva faz curva.'},
  onde:'na guarita da cerca',
  times:[123, 127, 115, 128, 111, 147],
  golpes:['Earthquake', 'Body Slam', 'Swords Dance'],
  premio:{'TM26 Earthquake':1, 'Ultra Ball':5},
  apresenta:[
    'A guarita é de madeira, com uma cadeira de plástico do lado de fora e uma marmita aberta em cima de um toco.',
    'A guarda-parque tem o chapéu de aba larga caído nas costas e uma cicatriz que atravessa a sobrancelha.',
    fala('Talia', 'Talia. Eu cuido de doze quilômetros dessa cerca. Os outros dezenove são de gente que não aparece.'),
    fala('Talia', 'Os meus eu não peguei. Eles vieram. Cada um apareceu na guarita um dia e não foi mais embora.'),
    fala('Talia', 'Eu termino a marmita e a gente vê.')
  ],
  volta:[fala('Talia', 'Almoçou?'), fala('Talia', 'Então vamos.')],
  vence:'"Mato não perdoa pressa. Nem eu."',
  perde:'"Eles vão ficar emburrados a semana inteira. Valeu a pena ver."',
  depois:[
    'Talia está sentada na cadeira de plástico, com o Scyther cochilando em pé do lado.',
    fala('Talia', 'Ele não dormia na frente de estranho. Depois de você, dorme. Vai entender.')
  ],
  torneio:'"Eu tirei o primeiro dia de folga do ano pra isso. Não me faz perder cedo."',
  chamada:{
    falas:[
      fala('Talia', 'Talia, da guarita. Eu achei armadilha de laço na Rota 15, do lado de fora da cerca. Onze.'),
      fala('Talia', 'Do lado de fora eu não tenho jurisdição. Eu tenho só o chapéu.', 'frio'),
      fala('Talia', 'Amanhã cedo eles voltam pra ver o que pegou. Eu vou estar lá. Seria bom não estar sozinha.')
    ],
    aceita:'"Eu vou estar do seu lado."',
    combinado:[fala('Talia', 'Antes do sol. A trilha começa no terceiro poste da cerca.')],
    recusa:'"Não dá dessa vez."',
    recusado:[fala('Talia', 'Tá. Eu vou do mesmo jeito.')]
  },
  convite:{
    local:'rota13', titulo:'Esperar os caçadores com Talia, no terceiro poste',
    sub:'Antes do sol. Onze laços na trilha.',
    cena:[
      'Talia já desarmou nove laços quando você chega. Os outros dois ela deixou armados, de propósito, de isca.',
      'O caçador chega com um saco de lona nas costas e para quando vê o chapéu.',
      fala('Caçador Sloan', 'Aqui é fora da reserva, moça. Aqui você não manda.'),
      fala('Talia', 'Não mando.'),
      fala('Talia', 'Mas {esse aí|essa aí} do meu lado também não é da reserva.')
    ],
    botao:'Encarar o caçador',
    luta:{classe:'Caçador', arq:'burglar', nome:'Sloan', times:[24, 53, 20, 110, 105], acima:2},
    fim:[
      'Sloan larga o saco de lona e corre pela trilha. Talia não corre atrás.',
      fala('Talia', 'Ele volta. Eles sempre voltam. Mas agora eu sei a cara dele.'),
      'Dentro do saco tem mais laço, uma lista de preços e duas Ultra Balls que ele não vai vir buscar.'
    ],
    recompensa:()=>{
      Estado.darItem('Ultra Ball', 2); Estado.darItem('Revive', 3); Estado.j.dinheiro += 7000;
      const r = Estado.mudarRep('bom', 1, 'Tirou um caçador da cerca da reserva', {rep:{notorio:false, peso:2}});
      const av = [{tipo:'item', texto:'+7.000 ₽ · 2× Ultra Ball · 3× Revive'}];
      if (r && r.mudou) av.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
      return av;
    }
  }
},
{
  id:'wendell', local:'seafoam', insignias:6, conferencia:true,
  classe:'Mergulhador', arq:'scuba_diver', artigo:'um', nome:'Wendell',
  porta:{titulo:'Descer até a lagoa de gelo onde alguém mergulha',
         sub:'Tem uma roupa de mergulho estendida numa pedra, dura de gelo.'},
  onde:'na lagoa de gelo',
  times:[220, 215, 124, 90, 86, 131],
  golpes:['Blizzard', 'Ice Beam', 'Icy Wind'],
  premio:{'TM14 Blizzard':1, 'Faixa Firme':1},
  apresenta:[
    'A lagoa de dentro das ilhas é verde-escura, com uma crosta de gelo nas bordas, e tem um homem saindo dela de roupa de borracha como se fosse agosto.',
    'Ele tira a máscara e o rosto está roxo de frio e sorrindo.',
    fala('Wendell', 'Wendell! Dezoito anos mergulhando aqui. Todo mundo diz que a água mata, e a água nunca matou ninguém que respeitou ela.'),
    fala('Wendell', 'Os meus nasceram nessa água. Eles não sentem frio, eles sentem saudade dele quando saem.'),
    fala('Wendell', 'Luta aqui na beira? Se cair, eu te tiro.')
  ],
  volta:[fala('Wendell', 'Esquentou lá fora?'), fala('Wendell', 'Aqui não esquenta nunca. Vem.')],
  vence:'"Se enxuga direito antes de sair, senão o vento te pega."',
  perde:'"Ha! Eu vou mergulhar pra esfriar a cabeça. Literalmente."',
  depois:[
    'Wendell está sentado na pedra, com a roupa de borracha aberta até a cintura, tomando alguma coisa quente de uma garrafa térmica.',
    fala('Wendell', 'Quer? É chá de gengibre. Queima a garganta e esquenta a alma, nessa ordem.')
  ],
  torneio:'"Eu nunca lutei em lugar com aquecimento. Pode ser que eu perca só por isso."',
  chamada:{
    falas:[
      fala('Wendell', 'Wendell! Escuta, rápido, o sinal aqui é ruim.'),
      fala('Wendell', 'Um Lapras ficou preso na lagoa de dentro. O gelo fechou a saída pro mar, e ele tá batendo na crosta faz dois dias. Tá bravo, tá cansado, e não deixa ninguém chegar perto.'),
      fala('Wendell', 'Se ninguém quebrar o gelo, ele não sai. E pra quebrar o gelo alguém tem que passar por ele.')
    ],
    aceita:'"Segura ele aí. Eu tô indo."',
    combinado:[fala('Wendell', 'Eu não seguro nada, ele pesa duzentos quilos! Mas eu fico olhando.', 'riso')],
    recusa:'"Não é comigo."',
    recusado:[fala('Wendell', 'Tá bom. Eu tento de novo sozinho. Terceira vez.', 'baixo')]
  },
  convite:{
    local:'seafoam', titulo:'Ajudar Wendell com o Lapras preso na lagoa',
    sub:'O gelo fechou a saída pro mar.',
    cena:[
      'O Lapras está no meio da lagoa, batendo o pescoço na crosta de gelo que fechou a passagem pro mar. A crosta está rachada e não abre.',
      'Wendell está na beira, molhado até o pescoço, com o lábio cortado.',
      fala('Wendell', 'Ele não entende que eu tô tentando ajudar. Pra ele eu sou mais uma coisa no caminho.'),
      'O Lapras te vê chegar e vem na sua direção, grande, cansado e com raiva de tudo.'
    ],
    botao:'Enfrentar o Lapras',
    selvagem:{dex:131, acima:3},
    fim:[
      'Com o Lapras parado, Wendell mergulha e quebra a crosta da passagem com uma picareta de gelo, em sete batidas.',
      'A água do mar entra, fria e salgada, e a lagoa inteira muda de cor.',
      fala('Wendell', 'Pronto. Pronto, grandão. Agora é só ir.', 'baixo')
    ],
    recompensa:()=>{
      Estado.darItem('Cobertor térmico', 1); Estado.darItem('Hyper Potion', 3); Estado.j.dinheiro += 6000;
      return [{tipo:'item', texto:'+6.000 ₽ · Cobertor térmico · 3× Hyper Potion'}];
    }
  }
},
{
  id:'maxine', local:'cinnabar', insignias:7, conferencia:true, f:true,
  classe:'Cientista', arq:'scientist_f', artigo:'uma', nome:'Maxine',
  porta:{titulo:'Seguir o fio de sensor até a barraca na encosta do vulcão',
         sub:'Tem uma barraca de lona laranja e três aparelhos apitando fora de ritmo.'},
  onde:'na barraca da encosta',
  times:[58, 109, 100, 126, 228, 137],
  golpes:['Tri Attack', 'Fire Blast', 'Thunderbolt'],
  premio:{'TM49 Tri Attack':1, 'Óculos Grossos':1},
  apresenta:[
    'A barraca laranja está presa na encosta com estaca de ferro, e tem fio de sensor saindo dela pra todo lado, enterrado na pedra quente.',
    'A mulher lá dentro usa óculos de proteção na testa e escreve número numa prancheta sem olhar pro papel.',
    fala('Maxine', 'Maxine. Vulcanóloga, não pesquisadora de Pokémon. Os meus vieram de brinde com o vulcão.'),
    fala('Maxine', 'Eu meço essa encosta faz quinze anos. Eu sei a temperatura dela melhor que a minha.'),
    fala('Maxine', 'Você tem cara de quem veio lutar. Tudo bem. Eu tenho quarenta minutos até a próxima leitura.')
  ],
  volta:[fala('Maxine', 'Trinta e dois minutos até a leitura.'), fala('Maxine', 'Dá tempo.')],
  vence:'"Dado bom. Pena que foi o seu."',
  perde:'"Interessante. Eu vou precisar anotar isso, e eu não sei em que coluna."',
  depois:[
    'Maxine está na porta da barraca, com a prancheta, olhando um número que não gosta.',
    fala('Maxine', 'Subiu dois graus desde ontem. Não é nada. Eu digo isso toda vez que sobe, e toda vez é verdade.')
  ],
  torneio:'"Eu deixei os sensores ligados. Se eu perder cedo, eu volto pra ler."',
  chamada:{
    falas:[
      fala('Maxine', 'Maxine, da encosta. Tem um Magmar enorme morando perto da boca do vulcão desde o último tremor.'),
      fala('Maxine', 'Ele senta em cima dos meus sensores. Três queimados. Eu não tenho mais sensor pra perder.'),
      fala('Maxine', 'Eu não quero machucar ele. Eu quero que ele saia de cima do meu equipamento. Talvez com alguém que ele respeite.')
    ],
    aceita:'"Eu vou tirar ele de lá."',
    combinado:[fala('Maxine', 'Traz coisa que aguente calor. Ele tem cinco palmos de altura e um humor pior que o meu.')],
    recusa:'"Compra sensor novo."',
    recusado:[fala('Maxine', 'Com que dinheiro? Eu sou vulcanóloga.', 'frio')]
  },
  convite:{
    local:'cinnabar', titulo:'Subir até a boca do vulcão atrás do Magmar',
    sub:'Cinco palmos de altura, sentado nos sensores.',
    cena:[
      'Perto da boca do vulcão a pedra é quente através da sola do sapato.',
      'O Magmar está sentado em cima de uma caixa de sensor, derretida pela metade, como quem senta num banco de praça.',
      fala('Maxine', 'Não chega por trás. Ele não gosta de nada que chega por trás.'),
      'O Magmar se levanta devagar. Ele é maior que qualquer Magmar que você já viu, e o ar em volta dele treme.'
    ],
    botao:'Enfrentar o Magmar',
    selvagem:{dex:126, acima:3},
    fim:[
      'Maxine desencaixa o que sobrou da caixa de sensor e guarda na mochila, com cuidado, como se ainda servisse.',
      fala('Maxine', 'Obrigada. Eu vou escrever no relatório que foi um "evento térmico". Ninguém lê relatório mesmo.')
    ],
    recompensa:()=>{
      Estado.darItem('Pedra do Fogo', 1); Estado.darItem('Full Heal', 3); Estado.j.dinheiro += 8000;
      return [{tipo:'item', texto:'+8.000 ₽ · Pedra do Fogo · 3× Full Heal'}];
    }
  }
},
{
  id:'lorne', local:'caminho_vitoria', insignias:8, conferencia:true,
  classe:'Domador de Dragões', arq:'dragon_tamer', artigo:'um', nome:'Lorne',
  porta:{titulo:'Ir até a fogueira no salão alto do Caminho',
         sub:'Tem fogo aceso num lugar onde não entra vento.'},
  onde:'no salão alto do Caminho',
  times:[227, 116, 4, 142, 129, 147],
  golpes:['Hyper Beam', 'Dragon Breath', 'Earthquake'],
  premio:{'TM15 Hyper Beam':1, 'PP Up':3},
  apresenta:[
    'O salão alto do Caminho da Vitória tem um teto que some no escuro e uma fogueira no meio, alimentada com lenha que alguém carregou lá de baixo.',
    'O homem sentado na frente do fogo tem capa curta, cabelo grisalho amarrado, e um Dragonite deitado atrás dele como um muro.',
    fala('Lorne', 'Lorne. Eu fiz esse Caminho vinte e duas vezes. Entrei no Planalto em nove.'),
    fala('Lorne', 'Nas outras treze eu voltei daqui mesmo. Não por medo. Porque eu olhava pro fogo e sabia que não era o ano.'),
    fala('Lorne', 'Eu fico aqui pra ver quem passa. Quem passa por mim, é o ano dele.')
  ],
  volta:[fala('Lorne', 'O fogo não apagou.'), fala('Lorne', 'Eu também não.')],
  vence:'"Não é o seu ano ainda. Mas ele vem."',
  perde:'"É o seu ano. Sobe."',
  depois:[
    'Lorne está sentado na frente do fogo, com o Dragonite dormindo atrás.',
    fala('Lorne', 'Eu te vi subir e eu fiquei aqui. É isso que eu faço. Eu fico aqui.')
  ],
  torneio:'"Eu desci do Caminho pra isso. A lenha lá em cima vai durar três dias sem mim."',
  chamada:{
    cond:d=>!!d.flags.campeao_de_kanto,
    falas:[
      fala('Lorne', 'Lorne, do Caminho. Eu soube da cadeira.'),
      fala('Lorne', 'Todo ano, depois que a Elite fecha a temporada, a arena recebe a Conferência do Planalto Indigo. Quem luta lá é quem ficou na estrada tempo demais pra caber em torneio aberto.'),
      fala('Lorne', 'Eu nunca inscrevi ninguém. Eu queria inscrever você.')
    ],
    aceita:'"Pode inscrever."',
    combinado:[fala('Lorne', 'Já está. A inscrição dessa vez fica por minha conta. Na próxima você paga, como todo mundo.')],
    recusa:'"Eu já tive Liga demais."',
    recusado:[fala('Lorne', 'Entendo. A Conferência acontece todo ano. Eu também.')]
  },
  convite:{
    local:'planalto', titulo:'Aceitar a inscrição que Lorne pagou',
    sub:'A Conferência do Planalto Indigo, na arena central.',
    cena:[
      'No balcão da arena tem um envelope com o seu nome escrito com letra de quem aprendeu a escrever faz muito tempo.',
      'Dentro, o recibo da inscrição da Conferência do Planalto Indigo, pago em dinheiro, e um bilhete.',
      '**NÃO É PRESENTE. É APOSTA. — L.**'
    ],
    botao:'Guardar o recibo',
    fim:['O recibo vale uma inscrição na Conferência. A atendente carimba e devolve sem perguntar nada.'],
    recompensa:d=>{ d.flags.conferencia_paga = true; return [{tipo:'item', texto:'Inscrição da Conferência do Planalto Indigo paga.'}]; }
  }
},
{
  id:'greer', local:'planalto', insignias:8, campeao:true, conferencia:true, final:true, f:true,
  classe:'Treinadora Ás', arq:'ace_trainer_f', artigo:'uma', nome:'Greer',
  porta:{titulo:'Ir ao campo de treino dos fundos, atrás da arena',
         sub:'Ninguém usa esse campo. Ontem alguém usou.'},
  onde:'no campo dos fundos',
  times:[197, 212, 94, 130, 63, 246],
  golpes:['Psychic', 'Earthquake', 'Hyper Beam'],
  premio:{'TM29 Psychic':1, 'Master Ball':1},
  apresenta:[
    'O campo de treino dos fundos tem a grama queimada em círculos, e uma mulher de uns trinta anos sentada no alambrado, balançando as pernas.',
    fala('Greer', 'Então é você. A cadeira.'),
    fala('Greer', 'Greer. Três vezes campeã da Conferência. Nunca subi pra Elite dos Quatro, e nunca quis. Eu gosto de lutar, não de ficar sentada esperando luta.'),
    fala('Greer', 'Eu fiquei curiosa com quem ganhou do Red. Eu fiquei curiosa com isso o mês inteiro.'),
    fala('Greer', 'Não é pela cadeira. É pela curiosidade.')
  ],
  volta:[fala('Greer', 'Ainda curiosa.'), fala('Greer', 'Desce do alambrado comigo.')],
  vence:'"Tá. Eu não estou mais curiosa. Mas eu ainda quero de novo."',
  perde:'"Ah. Agora eu entendi o Red."',
  depois:[
    'Greer está no alambrado, balançando as pernas, olhando o campo.',
    fala('Greer', 'Eu te vejo na Conferência. Não vou ficar curiosa lá. Vou ficar é com raiva.', 'riso')
  ],
  torneio:'"Torneio aberto? Eu vim assistir. Me inscreveram de brincadeira."',
  chamada:{
    falas:[
      fala('Greer', 'Greer. Eu tô com um problema e o problema é você.'),
      fala('Greer', 'Tem gente na arena falando da nossa luta. Gente que não estava lá. Metade diz que eu entreguei, metade diz que você teve sorte.'),
      fala('Greer', 'Eu quero uma de exibição. Arena cheia, arquibancada paga, sem desculpa pra nenhum dos dois lados. Eu venho mais forte.')
    ],
    aceita:'"Marca."',
    combinado:[fala('Greer', 'Sábado, arena central. Eu já vendi os ingressos.', 'riso')],
    recusa:'"Deixa falarem."',
    recusado:[fala('Greer', 'Você é a única pessoa em Kanto que consegue me irritar dizendo não.', 'frio')]
  },
  convite:{
    local:'planalto', titulo:'Lutar a exibição com Greer na arena central',
    sub:'Arquibancada cheia. Ela vem mais forte.',
    cena:[
      'A arena central tem quatrocentos lugares e hoje tem quatrocentas pessoas, e mais umas cinquenta de pé no corredor.',
      'Greer entra pelo túnel do outro lado sem acenar pra ninguém.',
      fala('Greer', 'Sem desculpa. Nem minha, nem sua.')
    ],
    botao:'Entrar na arena',
    luta:{veterano:'greer', acima:3}, quadra:true,
    fim:[
      'A arena demora pra entender que acabou. Depois ela entende de uma vez.',
      fala('Greer', 'Pronto. Agora ninguém fala mais nada.'),
      fala('Greer', 'Metade do dinheiro dos ingressos é seu. Eu não gosto de dever.')
    ],
    recompensa:()=>{
      Estado.j.dinheiro += 30000; Estado.darItem('PP Up', 2);
      const r = Estado.mudarRep('bom', 2, 'Venceu a exibição contra Greer na arena central', {rep:{notorio:true, peso:4}});
      const av = [{tipo:'item', texto:'+30.000 ₽ · 2× PP Up'}];
      if (r && r.mudou) av.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
      return av;
    }
  }
}
];

function veterano(id){ return VETERANOS.find(v => v.id === id) || null; }

/* o time do jogador que conta pro nível: os três mais fortes. Quem
   leva um inicial no 40 e o resto no 15 não enfrenta um veterano no 20. */
function nivelDeReferencia(){
  const t = (Estado.dados.time || []).filter(p => !p.morto).map(p => p.nivel).sort((a, b) => b - a);
  if (!t.length) return 10;
  const tres = t.slice(0, 3);
  return Math.round(tres.reduce((s, n) => s + n, 0) / tres.length);
}

/* Golpe que só um veterano ensinou: troca o golpe mais fraco do bicho
   por um da lista do dono, se a espécie aprende por TM. */
function ensinarDoVeterano(p, lista){
  for (const nome of (lista || [])){
    if (!GOLPES[nome] || p.golpes.some(g => g.nome === nome)) continue;
    const tm = TM_LISTA.find(t => t[2] === nome);
    if (!tm || !(TM_COMPAT[p.dex] || '').split(',').includes(tm[0] + '.' + tm[1])) continue;
    const forca = g => { const G = GOLPES[g.nome] || {}; return G.c === 'status' ? 30 : (G.p || 0); };
    if (p.golpes.length < 4){ p.golpes.push({nome, pp:GOLPES[nome].pp, ppMax:GOLPES[nome].pp}); return; }
    let pior = 0;
    p.golpes.forEach((g, i) => { if (forca(g) < forca(p.golpes[pior])) pior = i; });
    if (forca(p.golpes[pior]) >= (GOLPES[nome].p || 0)) return;
    p.golpes[pior] = {nome, pp:GOLPES[nome].pp, ppMax:GOLPES[nome].pp};
    return;
  }
}

/* Time de uma lista de linhas, no nível pedido: os últimos da lista
   (onde mora o forte), com o nível subindo até o último. */
function timeDeLinhas(linhas, nivel, tam, golpes, moral){
  const especies = linhas.slice(Math.max(0, linhas.length - tam));
  const usados = new Set(), time = [];
  especies.forEach((dex, i) => {
    const passo = especies.length > 1 ? Math.round(i * 3 / (especies.length - 1)) : 0;
    const nv = Math.max(5, Math.min(90, nivel - 3 + passo));
    const forma = formaDaEstrada(finalDaLinha(dex), nv);
    if (usados.has(forma)) return;
    usados.add(forma);
    const p = criarPokemon(forma, nv, {moral: moral || 85});
    ensinarDoVeterano(p, golpes);
    time.push(p);
  });
  return time;
}

const Veteranos = {
  reg(){
    const d = Estado.dados;
    if (!d.veteranos) d.veteranos = {};
    return d.veteranos;
  },
  registro(id){
    const r = this.reg();
    if (!r[id]) r[id] = {conheceu:false, vitorias:0, derrotas:0, diaVitoria:null, conviteFeito:false};
    return r[id];
  },
  venceu(id){ const r = (Estado.dados && Estado.dados.veteranos || {})[id]; return !!(r && r.vitorias); },
  liberado(v){
    const d = Estado.dados;
    if (v.campeao && !d.flags.campeao_de_kanto) return false;
    return numInsignias() >= (v.insignias || 0);
  },
  daqui(localId){ return VETERANOS.filter(v => v.local === localId && this.liberado(v)); },

  /* o nível do veterano: o do lugar + 9, ou o dos seus três mais
     fortes, o que for maior */
  nivel(v, extra){
    const L = LOCAIS[v.local] || {nivel:20};
    return Math.min(85, Math.max(L.nivel + PISO_VETERANO, nivelDeReferencia() + ACIMA_VETERANO) + (extra || 0));
  },
  tamanho(v){
    if (!v) return TAM_VETERANO[Math.min(8, numInsignias())];
    return v.campeao ? 6 : TAM_VETERANO[Math.min(8, v.insignias || 0)];
  },
  time(v, extra, tam){
    return timeDeLinhas(v.times, this.nivel(v, extra), tam || this.tamanho(v), v.golpes, 90);
  },

  /* o que aparece na lista do lugar */
  afazeres(localId){
    const lista = [];
    this.daqui(localId).forEach(v => {
      const r = this.registro(v.id);
      if (r.vitorias) lista.push({id:'vet_' + v.id, titulo:`Falar com ${v.nome} ${v.onde}`,
        sub:'Quem perdeu pra você não esquece o seu rosto.'});
      else if (r.conheceu) lista.push({id:'vet_' + v.id, titulo:`Voltar a ${v.nome}, ${v.onde}`,
        sub:'Ainda está lá. Ainda esperando.'});
      else lista.push({id:'vet_' + v.id, titulo:v.porta.titulo, sub:v.porta.sub});
    });
    VETERANOS.forEach(v => {
      const c = v.convite;
      if (!c || c.local !== localId || !this.convidado(v.id)) return;
      lista.push({id:'conv_' + v.id, titulo:c.titulo, sub:c.sub});
    });
    return lista;
  },
  convidado(id){
    const d = Estado.dados;
    return !!(d.flags['convite_vt_' + id] && !this.registro(id).conviteFeito);
  },

  /* a chamada chega três dias depois da vitória, no mínimo */
  podeChamar(v){
    const d = Estado.dados, r = (d.veteranos || {})[v.id];
    if (!r || !r.vitorias || r.diaVitoria == null) return false;
    if (d.relogio.dia < r.diaVitoria + 3) return false;
    try { return !v.chamada.cond || v.chamada.cond(d); } catch(e){ return false; }
  },

  /* ── chegar até o veterano ── */
  abordar(id){
    const v = veterano(id);
    if (!v) return Exploracao.tela();
    const r = this.registro(id);
    const primeira = !r.conheceu;
    r.conheceu = true;
    if (typeof Nomes !== 'undefined' && typeof NOMES_DA_HISTORIA !== 'undefined') NOMES_DA_HISTORIA.add(v.nome);
    Estado.salvar('auto');
    if (r.vitorias){
      return UI.telaConversa({
        num:(LOCAIS[v.local] || {}).nome, titulo:v.nome, loc:v.onde,
        falas:v.depois,
        botoes:[
          {texto:'Pedir outra luta, pelo gosto da coisa', acao:`Veteranos.lutar('${id}')`},
          {texto:'Seguir caminho', acao:'Exploracao.tela()'}
        ]
      });
    }
    UI.telaConversa({
      num:(LOCAIS[v.local] || {}).nome, titulo: primeira ? v.classe : v.nome, loc:v.onde,
      falas: primeira ? v.apresenta : v.volta,
      botoes:[
        {texto:'Aceitar a luta', acao:`Veteranos.lutar('${id}')`},
        {texto:'Agora não', acao:'Exploracao.tela()'}
      ]
    });
  },

  lutar(id, extra){
    const v = veterano(id);
    const meu = Estado.primeiroApto();
    if (!v) return Exploracao.tela();
    if (!meu) return UI.modal(v.nome, '<p class="nada">Nenhum Pokémon em pé. Cure o time antes.</p>');
    const time = this.time(v, extra);
    Mundo.passar(1);
    this.iniciarLuta(nomeDeLuta(v), time, {id, tipo:'desafio'});
    const r = this.registro(id);
    UI.telaBatalha([r.vitorias ? `${v.nome}: "De novo, então. Pelo gosto."` : `${nomeDeLuta(v)} quer lutar!`]);
  },

  iniciarLuta(nome, time, atual, selvagem){
    time.forEach(x => { x.nomeAnunciado = true; });
    Jogo.cenaBatalha = null; Jogo.ginasioAtual = null; Jogo.eliteAtual = null;
    Jogo.torneioAtual = null; Jogo.rivalAtual = null; Jogo.revancheAtual = null; Jogo.estradaAtual = null;
    Jogo.conferenciaAtual = atual.conferencia ? Jogo.conferenciaAtual : null;
    Jogo.veteranoAtual = atual;
    Jogo.batalhaLivre = true;
    UI.limparDados();
    const meu = Estado.primeiroApto();
    if (selvagem){
      Batalha.iniciar(meu, time[0], {tipo:'selvagem', fuga:false, erroIA:ERRO_IA_VETERANO});
      return;
    }
    Batalha.iniciar(meu, time[0], {
      tipo:'treinador', fuga:false, treinador:nome, arena: atual.arena || null,
      timeInimigo: time.slice(1), revelarNatureza:true, erroIA:ERRO_IA_VETERANO,
      introducao:`${nome} enviou ${nomeVisivel(time[0])} (Nv ${time[0].nivel})!`
    });
  },

  /* ── convite: o que a chamada marcou ── */
  abrirConvite(id){
    const v = veterano(id);
    if (!v || !v.convite) return Exploracao.tela();
    const c = v.convite;
    UI.telaConversa({
      num:(LOCAIS[c.local] || {}).nome, titulo:v.nome, loc:'convite',
      falas:c.cena,
      botoes:[
        {texto:c.botao, acao:`Veteranos.cumprirConvite('${id}')`},
        {texto:'Voltar depois', acao:'Exploracao.tela()'}
      ]
    });
  },

  cumprirConvite(id){
    const v = veterano(id);
    const c = v && v.convite;
    if (!c) return Exploracao.tela();
    if (c.luta || c.selvagem){
      const meu = Estado.primeiroApto();
      if (!meu) return UI.modal(v.nome, '<p class="nada">Nenhum Pokémon em pé. Cure o time antes.</p>');
      Mundo.passar(1);
      if (c.selvagem){
        const nv = Math.min(85, Math.max((LOCAIS[c.local] || {}).nivel || 30, nivelDeReferencia()) + (c.selvagem.acima || 0));
        const p = criarPokemon(c.selvagem.dex, nv, {moral:40});
        this.iniciarLuta(null, [p], {id, tipo:'convite'}, true);
        return UI.telaBatalha([`${nomeVisivel(p)} (Nv ${p.nivel}) vem pra cima!`]);
      }
      const L = c.luta;
      let nome, time;
      if (L.veterano){
        const w = veterano(L.veterano);
        nome = nomeDeLuta(w);
        time = this.time(w, L.acima, 6);
      } else {
        nome = `${L.classe} ${L.nome}`;
        const nv = Math.min(85, Math.max(((LOCAIS[c.local] || {}).nivel || 20) + 2, nivelDeReferencia() + (L.acima || 0)));
        time = timeDeLinhas(L.times, nv, Math.min(L.times.length, this.tamanho(v) + 1), v.golpes, 70);
      }
      /* luta marcada em arena (a exibição da Greer) é na quadra */
      this.iniciarLuta(nome, time, {id, tipo:'convite', arena: c.quadra ? 'ginasio' : null});
      return UI.telaBatalha([`${nome} quer lutar!`]);
    }
    /* convite sem luta: acontece e pronto */
    this.fecharConvite(v, []);
  },

  fecharConvite(v, avisos){
    const r = this.registro(v.id);
    r.conviteFeito = true;
    let extra = [];
    try { extra = v.convite.recompensa(Estado.dados) || []; } catch(e){ extra = []; }
    Estado.registrar(`${v.convite.titulo}.`);
    Estado.salvar('auto');
    Jogo.resolverPendencias(() => UI.telaConversa({
      num:(LOCAIS[v.convite.local] || {}).nome, titulo:v.nome, loc:'convite',
      falas:v.convite.fim, avisos:avisos.concat(extra),
      botoes:[{texto:'Continuar', acao:'Exploracao.tela()'}]
    }));
  },

  /* ── prêmio ── */
  premio(){
    const a = Jogo.veteranoAtual;
    if (!a || a.tipo !== 'desafio') return 0;
    const v = veterano(a.id);
    const nivel = (Batalha.inimigo && Batalha.inimigo.nivel) || 1;
    return Math.round(pagaPorNivel(nomeDeLuta(v)) * nivel * PAGA_VETERANO * (Batalha.bonusDinheiro || 1));
  },
  citacao(venceu){
    const a = Jogo.veteranoAtual;
    if (!a) return null;
    const v = veterano(a.id);
    if (a.tipo === 'desafio') return `${v.nome}: ${txt(venceu ? v.perde : v.vence)}`;
    return null;
  },

  resultado(fim){
    const a = Jogo.veteranoAtual;
    Jogo.veteranoAtual = null;
    Jogo.batalhaLivre = false;
    const v = a && veterano(a.id);
    if (fim.resultado === 'gameover') return UI.telaGameOver('Você caiu numa luta que você mesm{o|a} foi procurar.');
    if (!v) return Exploracao.tela();
    const r = this.registro(v.id);
    const venceu = fim.resultado === 'vitoria' || fim.resultado === 'captura';
    const avisos = [];

    if (a.tipo === 'convite'){
      if (venceu) return this.fecharConvite(v, fim.resultado === 'captura' ? [{tipo:'pokemon', texto:'Captura concluída.'}] : []);
      Estado.salvar('auto');
      return Jogo.resolverPendencias(() => UI.telaConversa({
        num:(LOCAIS[v.convite.local] || {}).nome, titulo:v.nome, loc:'convite',
        falas:[`${v.nome} te ajuda a juntar o que sobrou do seu time.`, fala(v.nome, 'Não foi hoje. O convite continua de pé.')],
        avisos:[{tipo:'dano', texto:'Você perdeu essa.'}],
        botoes:[{texto:'Continuar', acao:'Exploracao.tela()'}]
      }));
    }

    if (venceu){
      const valor = this.premioAgora(v);
      Estado.j.dinheiro += valor;
      avisos.push({tipo:'item', texto: valor ? `Você venceu ${nomeDeLuta(v)}. +${valor.toLocaleString('pt-BR')} ₽` : `Você venceu ${nomeDeLuta(v)}.`});
      if (!r.vitorias){
        for (const [n, q] of Object.entries(v.premio || {})){
          Estado.darItem(n, q);
          avisos.push({tipo:'item', texto:`${v.nome} te entrega ${q > 1 ? q + '× ' : ''}${n}.`});
        }
        const m = Estado.mudarRep('bom', 1, `Venceu ${nomeDeLuta(v)}, que ninguém vencia`, {rep:{notorio:true, peso:3}});
        if (m && m.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${m.de} → ${m.para}`});
        r.diaVitoria = Estado.dados.relogio.dia;
        if (Estado.temPokenav()) avisos.push({tipo:'eco', texto:`${v.nome} anota o número no verso da sua mão, com caneta, porque é o que tinha. "Eu ligo."`});
      }
      r.vitorias++;
      Estado.registrar(`Venceu ${nomeDeLuta(v)} ${v.onde}.`);
    } else {
      r.derrotas++;
      avisos.push({tipo:'dano', texto:`${nomeDeLuta(v)} venceu.`});
      Estado.registrar(`Perdeu para ${nomeDeLuta(v)}.`);
    }
    Estado.salvar('auto');
    Jogo.resolverPendencias(() => Exploracao.tela(avisos));
  },
  /* só a primeira vitória paga: depois, lutar de novo no lugar é pelo
     gosto (a revanche que paga é a do PokéNav, que tem espera) */
  premioAgora(v){ return this.registro(v.id).vitorias ? 0 : this.premioDe(v); },
  premioDe(v){
    const nivel = (Batalha.inimigo && Batalha.inimigo.nivel) || 1;
    return Math.round(pagaPorNivel(nomeDeLuta(v)) * nivel * PAGA_VETERANO * (Batalha.bonusDinheiro || 1));
  }
};

/* rosto e nome: o rosto sai da classe, e o nome sai do sorteio */
VETERANOS.forEach(v => {
  if (typeof NOMES_DA_HISTORIA !== 'undefined') NOMES_DA_HISTORIA.add(v.nome);
  if (typeof RETRATO_POR_NOME === 'undefined') return;
  RETRATO_POR_NOME[nomeDeLuta(v)] = 'trainers/' + v.arq;
  RETRATO_POR_NOME[v.nome] = 'trainers/' + v.arq;
  const c = v.convite;
  if (c && c.luta && c.luta.nome){
    if (typeof NOMES_DA_HISTORIA !== 'undefined') NOMES_DA_HISTORIA.add(c.luta.nome);
    RETRATO_POR_NOME[`${c.luta.classe} ${c.luta.nome}`] = 'trainers/' + c.luta.arq;
    RETRATO_POR_NOME[c.luta.nome] = 'trainers/' + c.luta.arq;
  }
});

/* ── PokéNav: quem perdeu pra você te passa o número ── */
function contatosVeteranos(){
  return VETERANOS.map(v => ({
    id:'vt_' + v.id, tipo:'treinador', nome:v.nome, papel:'',
    cidade:(LOCAIS[v.local] || {}).nome || '', veterano:v.id,
    requer:d=>Veteranos.venceu(v.id),
    oferece:['revanche'],
    revanche:{esperaCap:1},
    timeRevanche:d=>Veteranos.time(v, 2, 6)
  }));
}

/* ── e liga: dias depois, com um convite ── */
if (typeof CHAMADAS !== 'undefined') VETERANOS.forEach(v => {
  const ch = v.chamada;
  if (!ch) return;
  CHAMADAS.push({
    id:'cha_vt_' + v.id, de:'vt_' + v.id, peso:4,
    cond:d=>Estado.temNumero('vt_' + v.id) && Veteranos.podeChamar(v),
    falas:d=>ch.falas,
    escolhas:[
      {texto:ch.aceita, ef:{flag:'convite_vt_' + v.id, registrar:`Aceitou o convite de ${v.nome}.`}, resultado:ch.combinado},
      {texto:ch.recusa, resultado:ch.recusado}
    ]
  });
});

/* ── no Torneio Aberto, quem você venceu pode cair no seu chaveamento ── */
if (typeof RIVAIS_TORNEIO !== 'undefined') VETERANOS.forEach(v => {
  RIVAIS_TORNEIO.push({nome:nomeDeLuta(v), veterano:v.id, fala:v.torneio, cond:d=>Veteranos.venceu(v.id)});
});

/* ============================================================
   COPA DOS VETERANOS
   Depois da cadeira do Campeão. Três rodadas na arena do Planalto,
   contra quem ficou na estrada tempo demais pra caber em torneio
   aberto. A final é sempre contra a dona de três Conferências.
   ============================================================ */
const INSCRICAO_CONFERENCIA = 5000;
const PREMIO_CONFERENCIA = [
  {rodada:'Quartas',   dinheiro:12000, rep:1, itens:{'Hyper Potion':3}},
  {rodada:'Semifinal', dinheiro:25000, rep:1, itens:{'Full Heal':3, 'Revive':2}},
  {rodada:'Final',     dinheiro:60000, rep:3, itens:{'PP Up':3, 'Elixir':2}}
];
/* piso de nível da Conferência, rodada a rodada */
const PISO_CONFERENCIA = [66, 68, 72];

function statusConferencia(){
  const d = Estado.dados;
  if (!d.flags.campeao_de_kanto) return {estado:'trancado', texto:'Só pra quem sentou na cadeira do Campeão'};
  if (d.flags.conferencia_paga) return {estado:'disponivel', texto:'Inscrição paga por Lorne'};
  if (d.jogador.dinheiro < INSCRICAO_CONFERENCIA) return {estado:'sem_dinheiro', texto:`Inscrição: ${INSCRICAO_CONFERENCIA.toLocaleString('pt-BR')} ₽ (você tem ${d.jogador.dinheiro.toLocaleString('pt-BR')})`};
  return {estado:'disponivel', texto:`Inscrição: ${INSCRICAO_CONFERENCIA.toLocaleString('pt-BR')} ₽`};
}

/* Dois adversários antes da final: primeiro quem você já venceu na
   estrada (eles vêm atrás de revanche), o resto sorteado. */
function montarConferencia(){
  const final = VETERANOS.find(v => v.final);
  const pool = VETERANOS.filter(v => v.conferencia && !v.final);
  const conhecidos = pool.filter(v => Veteranos.venceu(v.id));
  const outros = pool.filter(v => !Veteranos.venceu(v.id));
  const escolhe = lista => lista.splice(Dados.entre(0, lista.length - 1), 1)[0];
  const lados = [];
  while (lados.length < 2 && (conhecidos.length || outros.length)) lados.push(escolhe(conhecidos.length ? conhecidos : outros).id);
  lados.push(final.id);
  return lados;
}

const Conferencia = {
  iniciar(){
    const st = statusConferencia();
    if (st.estado !== 'disponivel') return UI.telaLiga();
    if (!Estado.primeiroApto()) return UI.modal('Conferência', '<p class="nada">Nenhum Pokémon em pé. Cure o time antes de se inscrever.</p>');
    const d = Estado.dados;
    if (d.flags.conferencia_paga) d.flags.conferencia_paga = false;
    else d.jogador.dinheiro -= INSCRICAO_CONFERENCIA;
    Jogo.conferenciaAtual = {rodada:0, adversarios:montarConferencia()};
    Estado.registrar('Inscreveu-se na Conferência do Planalto Indigo.');
    Estado.salvar('auto');
    UI.telaConferencia();
  },

  lutar(){
    const c = Jogo.conferenciaAtual;
    if (!c) return UI.telaLiga();
    const v = veterano(c.adversarios[c.rodada]);
    if (!Estado.primeiroApto()) return this.resultado({resultado:'derrota'});
    const nivel = Math.max(PISO_CONFERENCIA[c.rodada], nivelDeReferencia() + ACIMA_CONFERENCIA + c.rodada);
    const time = timeDeLinhas(v.times, nivel, 6, v.golpes, 95);
    Veteranos.iniciarLuta(nomeDeLuta(v), time, {id:v.id, tipo:'conferencia', conferencia:true});
    const conhece = Veteranos.registro(v.id).conheceu;
    UI.telaBatalha([`${PREMIO_CONFERENCIA[c.rodada].rodada} — ${nomeDeLuta(v)}`,
      conhece ? `${v.nome}: ${txt(v.torneio)}` : `${v.nome} entra pelo túnel do outro lado. Você nunca viu essa pessoa e a arquibancada inteira sabe o nome dela.`]);
    Veteranos.registro(v.id).conheceu = true;
  },

  premio(venceu){
    const c = Jogo.conferenciaAtual;
    if (!c) return 0;
    const pr = PREMIO_CONFERENCIA[c.rodada];
    return venceu ? pr.dinheiro : Math.round(pr.dinheiro * 0.2);
  },

  resultado(fim){
    const c = Jogo.conferenciaAtual;
    Jogo.veteranoAtual = null;
    Jogo.batalhaLivre = false;
    if (fim.resultado === 'gameover'){ Jogo.conferenciaAtual = null; return UI.telaGameOver('Você caiu na arena do Planalto, na frente de quatrocentas pessoas.'); }
    const v = veterano(c.adversarios[c.rodada]);
    const pr = PREMIO_CONFERENCIA[c.rodada];
    const venceu = fim.resultado === 'vitoria';
    const avisos = [];
    const valor = this.premio(venceu);
    Estado.j.dinheiro += valor;

    if (!venceu){
      Jogo.conferenciaAtual = null;
      avisos.push({tipo:'item', texto:`Premiação por participação: +${valor.toLocaleString('pt-BR')} ₽`});
      Estado.registrar(`Eliminado da Conferência do Planalto Indigo por ${v.nome} nas ${pr.rodada}.`);
      Estado.salvar('auto');
      return Jogo.resolverPendencias(() => UI.telaResultadoLiga({
        titulo:'Eliminado', sub:`Conferência do Planalto Indigo · ${pr.rodada}`,
        falas:[`${nomeDeLuta(v)}: ${txt(v.vence)}`,
          'Na Conferência ninguém vaia quem perde. Quem está na arquibancada já perdeu pra todo mundo que está na arena.',
          'A Conferência é todo ano. Eles vão estar aqui.'],
        avisos, venceu:false
      }));
    }

    avisos.push({tipo:'item', texto:`+${valor.toLocaleString('pt-BR')} ₽`});
    for (const [n, q] of Object.entries(pr.itens || {})){ Estado.darItem(n, q); avisos.push({tipo:'item', texto:`Recebeu ${q}× ${n}.`}); }
    if (pr.rep){
      const m = Estado.mudarRep('bom', pr.rep, `Avançou nas ${pr.rodada} da Conferência do Planalto Indigo`, {rep:{notorio:true, peso:3}});
      if (m && m.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${m.de} → ${m.para}`});
    }
    c.rodada++;
    if (c.rodada >= c.adversarios.length){
      Jogo.conferenciaAtual = null;
      const d = Estado.dados;
      d.conferenciasVencidas = (d.conferenciasVencidas || 0) + 1;
      if (d.conferenciasVencidas === 1){
        Estado.darItem('Master Ball', 1);
        avisos.push({tipo:'item', texto:'A primeira Conferência vem com uma Master Ball no fundo do troféu.'});
      }
      Estado.marcar('venceu_conferencia');
      Estado.registrar(`Venceu a Conferência do Planalto Indigo (${d.conferenciasVencidas}ª vez).`);
      Estado.salvar('auto');
      return Jogo.resolverPendencias(() => UI.telaResultadoLiga({
        titulo:'{CAMPEÃO|CAMPEÃ} DA CONFERÊNCIA', sub:`Conferência do Planalto Indigo · ${d.conferenciasVencidas}º título`,
        falas:[`${nomeDeLuta(v)}: ${txt(v.perde)}`,
          'A arquibancada da Conferência não levanta pra quem ganha. Ela levanta pra quem aguentou as três.',
          'Hoje ela levanta.',
          d.conferenciasVencidas === 1 ? 'No vestiário, alguém escreveu o seu nome a giz na parede, embaixo de outros quarenta e poucos. O de cima é o da Greer, três vezes.' : 'O seu nome na parede do vestiário ganhou mais um risco do lado.'],
        avisos, venceu:true
      }));
    }
    Estado.salvar('auto');
    Jogo.resolverPendencias(() => UI.telaResultadoLiga({
      titulo:`${v.nome} derrotad${v.f ? 'a' : 'o'}`, sub:`Conferência do Planalto Indigo · ${pr.rodada} vencida`,
      falas:[`${nomeDeLuta(v)}: ${txt(v.perde)}`,
        `Próxima: ${PREMIO_CONFERENCIA[c.rodada].rodada}, contra ${nomeDeLuta(veterano(c.adversarios[c.rodada]))}.`,
        'Vinte minutos entre as lutas. Dá pra curar o time.'],
      avisos, venceu:true, conferencia:true
    }));
  },

  curar(){
    Estado.dados.time.forEach(curarTotal);
    Estado.salvar('auto');
    UI.telaConferencia();
  },
  desistir(){
    Jogo.conferenciaAtual = null;
    UI.telaLiga();
  }
};
