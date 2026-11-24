/* ============================================================
   ILHAS SEVII · CAPÍTULO 1 — A PASSAGEM (pós-jogo; por dentro, o 33)
   Depois do fim, com o título de Campeão: o Blue em Pallet, na casa
   onde cresceu, com dois anos de convite do Torneio das Ilhas numa
   pilha amarrada com elástico. Ele entrega a passagem. O jeito dele
   muda com o que aconteceu com ele na sua jornada (o ginásio que ele
   deixou ou não, o que você acha dele, o seu lado e a ordem da
   Patrulha). Ver sevii.js.
   ============================================================ */
/* o que dá pra dizer na mesa da cozinha: cada assunto uma vez, e a
   passagem sempre */
function _c33Mesa(){
  const ainda = id => d => !Historia.jaAconteceu(id);
  return [
    {texto:'"Por que você nunca foi?"', vai:'c33_por_que', cond:ainda('c33_por_que')},
    {texto:'"Vem comigo."', vai:'c33_vem_comigo', cond:ainda('c33_vem_comigo')},
    {texto:'"Antes de eu ir: uma luta. No quintal."', vai:'c33_o_quintal', cond:ainda('c33_a_luta')},
    {texto:'"Como está o segundo andar?"', vai:'c33_o_segundo_andar',
     cond:d => !Historia.jaAconteceu('c33_o_segundo_andar') && typeof Defesa !== 'undefined' && Defesa.meuGinasio(d) === 'viridian'},
    {texto:'"Tem um oficial de cinza na esquina do laboratório."', vai:'c33_o_oficial',
     cond:d => !Historia.jaAconteceu('c33_o_oficial') && Sevii.procurado(d)},
    {texto:'Guardar a passagem no bolso.', vai:'c33_a_passagem'}
  ];
}
CAPITULOS.push(
{
num:33, titulo:'A Passagem', local:'Pallet — a casa do Blue', ambiente:'campo', nivelArea:60,
tom:'leve', posJogo:true,
ancora:{local:'pallet', chamada:'A casa do Blue, do lado do laboratório, está com a janela de cima aberta, e tem alguém sentado no peitoril olhando a rua.'},
entradas:['c33_a_porta'],
inicio: d => 'c33_a_porta',
cenas:{

c33_a_porta:{
  texto:[
    'A casa do Blue fica do lado do laboratório, de muro baixo e caixa de correio torta, pintada de novo por cima da tinta velha sem ninguém lixar.',
    d => (d.flags.recusou_o_ginasio || d.flags.blue_ofereceu_o_ginasio)
      ? 'Desde que ele saiu de Viridian, a janela de cima fica aberta o dia inteiro. Ele está sentado no peitoril, de meia, com uma perna pra fora.'
      : 'Hoje o ginásio de Viridian abriu sem o líder. Ele está sentado no peitoril da janela de cima, de meia, com uma perna pra fora.',
    fala('Blue', 'Eu vi você subindo a rua.', null, 'Ele fala lá de cima, sem levantar a voz.'),
    fala('Blue', 'Entra antes que o meu avô te veja. Se ele te vê, são três horas de conversa sobre a Pokédex, e eu preciso de você pra outra coisa.')
  ],
  escolhas:[
    {texto:'Entrar.', vai:'c33_a_cozinha'},
    {texto:'"Você que desce."', vai:'c33_ele_desce'}
  ]
},

c33_ele_desce:{
  texto:[
    'Ele te olha um segundo, decide que não vale a discussão, e desce. Não pela escada: pela janela, pelo telhado da varanda, como quem fazia isso aos dez anos e não parou.',
    'Cai de pé no canteiro da mãe, em cima de uma muda que não volta mais.',
    fala('Blue', 'Pronto. Desci. Agora entra, que a conversa é lá dentro.', 'frio')
  ],
  ef:{npc:{nome:'Blue', opiniao:1, memoria:'Desceu pela janela porque você mandou ele descer.'}},
  escolhas:[
    {texto:'Entrar.', vai:'c33_a_cozinha'}
  ]
},

c33_a_cozinha:{
  texto:[
    'A cozinha é de casa onde ninguém cozinha faz tempo: fogão limpo demais, geladeira com três ímãs e uma fruteira com uma fruta só.',
    'Em cima da mesa tem uma pilha de envelope amarrada com elástico de dinheiro. Todos iguais. Papel grosso, cor de areia, um selo de cera azul com o desenho de uma arena redonda.',
    fala('Blue', 'Catorze minutos.', null, 'Ele senta do outro lado da mesa e empurra a pilha pra você com dois dedos.'),
    fala('Blue', 'Foi o tempo que eu fui Campeão. A Liga não tira o nome da gente da lista. Ela só escreve o próximo embaixo. E como ficou dois anos sem ninguém embaixo, tudo que chegava pro Campeão de Kanto vinha parar aqui.'),
    'Você olha o primeiro envelope. CAMPEÃO DE KANTO, AOS CUIDADOS DA LIGA POKÉMON. E embaixo, numa letra de velho, firme: Torneio das Ilhas — Ilha Sete.',
    fala('Blue', 'Todo ano um senhor da Ilha Sete convida o Campeão de Kanto pro torneio dele. Eu abri o primeiro. Os outros eu não abri.'),
    fala('Blue', 'Esse aqui chegou semana passada.', null, 'Ele tira do bolso um envelope igual, já aberto.'),
    d => `No envelope de cima, onde devia estar escrito CAMPEÃO DE KANTO, a mesma letra de velho escreveu o seu nome. ${d.jogador.nome}. Com acento certo e tudo.`
  ],
  ef:{flag:'sv_viu_os_convites', registrar:'Na cozinha do Blue, em Pallet: dois anos de convites do Torneio das Ilhas pro Campeão de Kanto, e o deste ano com o seu nome.'},
  escolhas:[
    {texto:'Abrir o envelope.', vai:'c33_o_envelope'}
  ]
},

c33_o_envelope:{
  texto:[
    'Dentro tem uma carta de uma folha só e um bilhete grosso de papel-cartão, com um furo no canto pra passar barbante.',
    '**O Torneio das Ilhas convida {o Campeão|a Campeã} de Kanto para a chave de dezesseis da arena da Ilha Sete. Vêm este ano treinadores de Johto e de Hoenn. A passagem é do S.S. Anne, que faz a viagem às ilhas uma vez por ano, saindo do cais três de Vermilion. — Magnus Holm, Ilha Sete.**',
    'O bilhete é a passagem: S.S. ANNE — VERMILION / ILHA UM — CABINE 14 — e um carimbo de arena redonda, igual ao da cera.',
    fala('Blue', 'Ilhas Sevii. Sete ilhas lá no sul, que não aparecem no mapa da parede do Centro porque o mapa da parede é de Kanto, e as ilhas nunca decidiram se são.'),
    fala('Blue', 'Gente de Johto vem de barco de Olivine. Gente de Hoenn atravessa trinta horas de mar. Por um torneio numa arena de pedra em cima de um morro.')
  ],
  escolhas:_c33Mesa()
},

c33_a_mesa:{
  texto:[
    d => {
      const n = ['c33_por_que', 'c33_vem_comigo', 'c33_ganhou', 'c33_perdeu', 'c33_o_segundo_andar', 'c33_o_oficial'].filter(id => Historia.jaAconteceu(id)).length;
      return n >= 2 ? 'A fruta da fruteira continua sozinha. O Blue está com os cotovelos na mesa, esperando você decidir alguma coisa.'
                    : 'O Blue empurra a passagem de volta pro seu lado da mesa com dois dedos, igual fez com a pilha.';
    }
  ],
  escolhas:_c33Mesa()
},

c33_por_que:{
  texto:[
    fala('Blue', 'Porque o convite é pro Campeão.'),
    'Ele gira o envelope aberto na mesa, devagar, uma volta inteira.',
    fala('Blue', 'Ir com catorze minutos de Campeão é ir de mentira. Eu ia descer do navio e todo mundo ia saber quem entrou pela porta depois de mim.'),
    d => (d.flags.recusou_o_ginasio || d.flags.blue_ofereceu_o_ginasio)
      ? fala('Blue', 'E depois que eu saí de Viridian, eu não sou nem líder. Sou o neto do Professor que mora no quarto de cima.', 'baixo')
      : fala('Blue', 'E líder de ginásio não tira férias de duas semanas. Tira um dia. Hoje é o dia.', 'riso'),
    fala('Blue', 'Você ganhou a cadeira. Quem vai é você.')
  ],
  ef:{npc:{nome:'Blue', opiniao:1, memoria:'Contou por que nunca foi ao Torneio das Ilhas: catorze minutos de Campeão não bastam.'}},
  escolhas:[
    {texto:'Ouvir e não dizer nada.', vai:'c33_a_mesa'},
    {texto:'"Catorze minutos é mais do que quase todo mundo."', vai:'c33_a_mesa',
     ef:{npc:{nome:'Blue', opiniao:1, memoria:'Disse que catorze minutos de Campeão é mais do que quase todo mundo teve.'}}}
  ]
},

c33_vem_comigo:{
  texto:[
    fala('Blue', 'Não.', null, 'Rápido demais.'),
    'Ele levanta, abre a geladeira, olha dentro como quem procura uma coisa que não está lá, e fecha.',
    fala('Blue', 'A passagem é de uma pessoa. A cabine é de uma pessoa.'),
    d => ((d.npcs['Blue'] || {}).opiniao || 0) >= 3
      ? fala('Blue', 'Mas… o torneio tem arquibancada. Arquibancada não pede passagem do Campeão.', 'baixo')
      : fala('Blue', 'E eu não sou de assistir.', 'frio')
  ],
  ef:{flag:'sv_blue_convidado', registrar:'Chamou o Blue pra ir com você ao Torneio das Ilhas.'},
  escolhas:[
    {texto:'"Então assiste."', vai:'c33_a_mesa',
     ef:{npc:{nome:'Blue', opiniao:1, memoria:'Disse pra ele ir assistir o Torneio das Ilhas, já que não vinha lutar.'}}},
    {texto:'Deixar o assunto ali.', vai:'c33_a_mesa'}
  ]
},

c33_o_segundo_andar:{
  texto:[
    'Ele demora pra responder, e quando responde é pra fruteira.',
    fala('Blue', 'Eu sei como está. Eu passo na frente às vezes. Do outro lado da rua.'),
    fala('Blue', 'A luz de cima fica acesa até tarde. Você lê lá, né. As pastas.', 'baixo'),
    'Não é pergunta. Ele não espera resposta.',
    fala('Blue', 'Que bom. Alguém tinha que ler sentado direito, e não no chão de costas pra escada.')
  ],
  ef:{npc:{nome:'Blue', opiniao:2, memoria:'Disse que passa na frente do ginásio de Viridian e vê a luz do segundo andar acesa até tarde.'}},
  escolhas:[
    {texto:'"A porta está aberta, se você quiser subir."', vai:'c33_a_mesa',
     ef:{npc:{nome:'Blue', opiniao:1, memoria:'Você disse que a porta do segundo andar está aberta pra ele.'}}},
    {texto:'Mudar de assunto.', vai:'c33_a_mesa'}
  ]
},

c33_o_oficial:{
  texto:[
    fala('Blue', 'Eu vi. Está ali desde ontem, de manhã, com uma foto num papel. Ele mostrou a foto pro meu avô. Meu avô disse que nunca viu você na vida.', 'riso'),
    fala('Blue', 'Meu avô mente muito mal. O oficial acreditou mesmo assim, porque ninguém acha que um velho de jaleco mente.'),
    'Ele fica sério.',
    fala('Blue', 'A Patrulha é de Kanto. O S.S. Anne é do capitão, e o capitão não deixa ninguém de cinza subir no navio dele sem mandado dele mesmo. E nas ilhas a Patrulha não pisa: lá tem uma Guarda de um homem só.'),
    fala('Blue', 'Não estou dizendo pra você fugir. Estou dizendo onde fica o cais três.', 'frio')
  ],
  ef:{flag:'sv_blue_avisou', npc:{nome:'Blue', opiniao:1, memoria:'Te contou do oficial de cinza na esquina, e que no S.S. Anne quem manda é o capitão.'}},
  escolhas:[
    {texto:'Agradecer.', vai:'c33_a_mesa'}
  ]
},

c33_o_quintal:{
  texto:[
    'Ele ri pelo nariz, a primeira risada da tarde.',
    fala('Blue', 'No quintal. Com o canteiro da minha mãe do lado.'),
    'Ele já está levantando, tirando a Pokébola do bolso de trás da calça, que é onde ele sempre guardou e onde a mãe dele sempre disse pra não guardar.',
    fala('Blue', 'Se eu ganhar, você vai pras ilhas do mesmo jeito. Mas eu vou ter ganhado {do Campeão|da Campeã}.')
  ],
  escolhas:[
    {texto:'Ir pro quintal.', vai:'c33_a_luta'},
    {texto:'"Pensando bem, outro dia."', vai:'c33_a_mesa'}
  ]
},

c33_a_luta:{
  texto:['O quintal é estreito, de grama baixa e varal. O Professor aparece na janela do laboratório, do outro lado do muro, e não fala nada: só puxa uma cadeira pra perto do vidro.'],
  batalha:{sevii:'blue', mais:-1, tipo:'treinador', fuga:false, treinador:'Blue', vontadeIA:true, erroIA:10,
           intro:'Blue não diz nada. Joga a Pokébola por cima do ombro, sem olhar onde ela cai.',
           vitoria:'c33_ganhou', derrota:'c33_perdeu'}
},

c33_ganhou:{
  texto:[
    'O último dele cai no canteiro, em cima de outra muda.',
    fala('Blue', 'Ok.', null, 'Ele recolhe o Pokémon e fica olhando a Pokébola na mão.'),
    fala('Blue', 'Ok. Era isso que eu queria saber. Se a cadeira estava com a pessoa certa.'),
    'Do outro lado do muro, o Professor bate palma sozinho, atrás do vidro, sem som nenhum.'
  ],
  ef:{flag:['sv_blue_lutou', 'sv_blue_venceu'], npc:{nome:'Blue', opiniao:2, memoria:'Perdeu pra você no quintal de casa, em Pallet, antes das ilhas.'},
      registrar:'Ganhou do Blue no quintal da casa dele, em Pallet.'},
  escolhas:[
    {texto:'Voltar pra cozinha.', vai:'c33_a_mesa'}
  ]
},

c33_perdeu:{
  texto:[
    'O seu último cai em cima do varal, e o lençol vem junto.',
    fala('Blue', 'Ganhei {do Campeão|da Campeã}.', 'riso', 'Ele fala isso devagar, provando cada palavra.'),
    fala('Blue', 'Ninguém viu. Ótimo. Melhor assim.'),
    'Do outro lado do muro, o Professor anota alguma coisa num caderno, que é o jeito dele de torcer.',
    fala('Blue', 'Cura o time no laboratório. O meu avô tem a máquina. E vai pras ilhas assim mesmo: lá ninguém sabe que eu ganhei.')
  ],
  ef:{flag:'sv_blue_lutou', npc:{nome:'Blue', opiniao:1, memoria:'Ganhou de você no quintal de casa, em Pallet, antes das ilhas.'},
      executar:d => { (d.time || []).forEach(p => { if (!p.morto) curarTotal(p); }); },
      registrar:'Perdeu pro Blue no quintal da casa dele, em Pallet. O Professor curou o time.'},
  escolhas:[
    {texto:'Voltar pra cozinha.', vai:'c33_a_mesa'}
  ]
},

c33_a_passagem:{
  texto:[
    'Você guarda a passagem no bolso de dentro. O papel-cartão é duro e faz um volume quadrado no peito.',
    d => {
      const r = Estado.rep;
      if (Sevii.procurado(d)) return fala('Blue', 'Vai pelo cais três. E chega cedo: quem chega cedo embarca no meio da turma de Johto, e turma de Johto não olha pra cara de ninguém.');
      if (r.eixo === 'ruim' && r.ruim >= 4) return fala('Blue', 'Eu sei o que falam de você em Kanto. Nas ilhas ninguém sabe. Isso pode ser bom ou pode ser pior.', 'frio');
      if (r.eixo === 'bom' && r.bom >= 6) return fala('Blue', 'Lá ninguém vai te pedir autógrafo. Lá você vai ser só mais um nome na lousa. Aproveita.');
      return fala('Blue', 'Lá ninguém conhece ninguém. Você chega igual a todo mundo, com o time que tem.');
    },
    fala('Blue', 'E o senhor da carta. Magnus Holm. Ele perguntou de mim no primeiro convite, e eu nunca respondi.'),
    fala('Blue', 'Se ele perguntar de novo, fala que eu li. Todos. Hoje.', 'baixo'),
    fala('Blue', 'E o Anne sai de Vermilion, do outro lado de Kanto. Se você quiser, o Pidgeot te deixa no cais três. Ele anda precisando voar.', null, 'Ele diz isso sem olhar pra você, como quem oferece uma coisa à toa.'),
    'Na porta, ele para com a mão no batente.',
    d => d.flags.sv_blue_convidado
      ? fala('Blue', 'A arquibancada de lá é de pedra. Pedra é ruim pra sentar o dia inteiro.', null, 'Ele diz isso olhando pra rua, como quem calcula uma coisa.')
      : fala('Blue', 'Manda notícia. Não precisa ser carta. Passa aqui na volta e fala que o mar é feio.')
  ],
  ef:{flag:'sv_passagem', itens:{'Passagem':1},
      npc:{nome:'Blue', opiniao:1, memoria:'Te entregou a passagem do S.S. Anne pro Torneio das Ilhas, que chegou com o seu nome.'},
      registrar:'O Blue entregou a passagem do S.S. Anne pras Ilhas Sevii, cabine 14, saindo do cais três de Vermilion.'},
  escolhas:[
    {texto:'Aceitar o Pidgeot até o cais três de Vermilion.', vai:'c33_o_pidgeot'},
    {texto:'Sair pela porta da frente, a pé.', vai:'c33_fim'}
  ]
},

/* a carona: de Pallet ao cais três, que fica do outro lado de Kanto. Sem
   ela, o caminho até o Anne é a pé, rota por rota */
c33_o_pidgeot:{
  texto:[
    'No quintal, o Blue assobia uma vez, curto, e o Pidgeot desce do telhado da varanda como se esperasse o assobio desde cedo.',
    'Ele ajeita a sua mochila nas costas do Pokémon, puxa uma alça, confere outra e bate duas vezes no pescoço dele.',
    fala('Blue', 'Cais três. E volta direto pra casa, ouviu? Nada de ficar rodando o farol de Vermilion.', null, 'Ele fala com o Pidgeot, não com você.'),
    'Pallet fica pequena embaixo em dois minutos. A Rota 1 vira um risco, Viridian uma mancha de telhado, e o mar, quando aparece, já é o de Vermilion.',
    'O Pidgeot pousa no fim do cais três, do lado de um navio branco com uma faixa de lona no costado, e vai embora antes de você agradecer.'
  ],
  ef:{flag:'sv_foi_de_pidgeot', executar:() => { Relogio.avancar(2); },
      npc:{nome:'Blue', opiniao:1, memoria:'Te emprestou o Pidgeot pra chegar ao cais três de Vermilion.'},
      registrar:'O Pidgeot do Blue te levou de Pallet até o cais três de Vermilion.'},
  fim:true, sai:'vermilion',
  resumo:'A Passagem: dois anos de convite numa pilha de elástico, e o deste ano com o seu nome. O Pidgeot do Blue te deixou no cais três de Vermilion.'
},

c33_fim:{
  texto:[
    'Lá fora a rua de Pallet está igual: a mesma cerca, o mesmo cheiro de grama cortada do lado do laboratório.',
    'Mas no bolso de dentro tem um bilhete duro com um furo no canto, e o nome de sete ilhas que não estão no mapa da parede do Centro.',
    d => d.flags.sv_blue_lutou ? 'Lá de cima, da janela, o Blue não acena. Mas fica olhando até você virar a esquina.' : 'Lá de cima, da janela, o Blue não acena. Ele já voltou pro peitoril, de meia, com a perna pra fora.'
  ],
  fim:true, resumo:'A Passagem: dois anos de convite numa pilha de elástico, e o deste ano com o seu nome. O S.S. Anne sai do cais três de Vermilion.'
}

}
});
