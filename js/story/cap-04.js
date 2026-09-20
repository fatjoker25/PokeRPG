/* ============================================================
   CAPÍTULO 4 — PEDRA SOBRE PEDRA  (Pewter)
   ============================================================ */
CAPITULOS.push(
{
num:4, titulo:'Pedra Sobre Pedra', local:'Pewter', ambiente:'montanha', nivelArea:14,
tom:'inquieto', inicio:'c4_chegada',
cenas:{

c4_chegada:{
  texto:[
    'Pewter é uma cidade que decidiu ser sobre pedra e não voltou atrás. As casas são de pedra, os muros são de pedra, as calçadas são placas irregulares de pedra que balançam quando você pisa na quina errada.',
    'A poeira é fina e cinza e entra em tudo. Em duas horas você vai achar poeira dentro do bolso fechado da mochila e não vai entender como.',
    'A cada vinte minutos, longe, um som baixo que você sente no peito antes de ouvir. Detonação na pedreira. Ninguém na rua levanta a cabeça.',
    d=>{
      const t = d.npcs['Téo'];
      if (t && t.opiniao >= 4) return 'Téo está sentado na escada do Centro Pokémon com a mochila entre os pés. Ele te vê de longe e levanta os dois braços como se você tivesse ganhado alguma coisa.';
      if (t && t.opiniao >= 1) return 'Téo está sentado na escada do Centro Pokémon. Ele te vê e faz um aceno curto, e depois finge que estava mexendo na mochila.';
      if (t) return 'Téo está sentado na escada do Centro Pokémon. Ele te vê. Não levanta a cabeça de novo.';
      return 'Um garoto na escada do Centro Pokémon te olha como se te conhecesse, depois desiste da ideia e volta pra mochila dele.';
    },
    d=>Estado.rep.eixo === 'ruim' && Estado.rep.ruim >= 3
       ? 'Duas pessoas atravessam a rua quando você passa. Notícia corre mais rápido do que gente anda, e Pewter é uma cidade pequena com telefone.'
       : 'Ninguém te reconhece aqui. Você ainda não é nada pra ninguém, e isso é um tipo de descanso que você só vai valorizar depois.'
  ],
  ef:{registrar:'Chegou a Pewter.'},
  escolhas:[
    {texto:'Ir falar com Téo.', vai:'c4_teo', cond:d=>!!d.npcs['Téo']},
    {texto:'Andar até a rua principal e ver o que essa cidade tem.', vai:'c4_rua'},
    {texto:'Seguir o som das detonações.', vai:'c4_pedreira_caminho'},
    {texto:'Sentar na praça e não fazer nada por um tempo. Você atravessou uma floresta.', vai:'c4_praca'}
  ]
},

c4_praca:{
  texto:[
    'A praça de Pewter tem quatro bancos e uma árvore que claramente não escolheu nascer ali.',
    'Você senta. O corpo entende antes da cabeça: os ombros descem uns dois dedos e você percebe que estava carregando eles assim desde a floresta.',
    'Uma senhora do outro banco desembrulha um pastel e parte no meio sem perguntar. Estende a metade.',
    '"Come. Você tá com cara de quem andou."'
  ],
  ef:{hp:3},
  escolhas:[
    {texto:'Aceitar e comer em silêncio.', vai:'c4_senhora'},
    {texto:'Aceitar e perguntar da cidade.', vai:'c4_senhora_cidade'},
    {texto:'Recusar educadamente.', vai:'c4_recusou_pastel'},
    {texto:'Levantar e ir andar.', vai:'c4_rua'}
  ]
},

c4_senhora:{
  texto:[
    'O pastel é de carne e está frio e é a melhor coisa que você comeu em dois dias.',
    'Vocês dois comem sem falar nada. Passa um caminhão. Passa um casal discutindo baixo. Passa o tempo.',
    'Quando acaba, ela amassa o papel e diz, como quem comenta o tempo: "Meu filho saiu daqui com quinze anos também. Voltou com dezesseis."',
    'Ela não continua. Você entende que não é pra perguntar, e não pergunta.'
  ],
  ef:{presagio:'Você vai ouvir essa mesma conta — quinze, dezesseis — mais três vezes nessa jornada, e na terceira vai ser sobre alguém que você conhece.'},
  escolhas:[
    {texto:'"Ele tá bem?"', vai:'c4_senhora_filho'},
    {texto:'Agradecer o pastel e levantar.', vai:'c4_rua'},
    {texto:'Ficar sentado mais um pouco sem dizer nada.', vai:'c4_senhora_silencio'},
    {texto:'Contar pra ela de onde você veio.', vai:'c4_senhora_contou'}
  ]
},

c4_senhora_filho:{
  texto:[
    '"Ele tá bem?"',
    'Ela amassa o papel um pouco mais.',
    '"Tá. Trabalha na pedreira." Uma pausa. "Todo mundo aqui trabalha na pedreira ou é filho de quem trabalhou. Inclusive o do ginásio."',
    '"Ele desistiu?"',
    '"Ele voltou." Ela corrige com firmeza, sem levantar a voz. "Não é a mesma coisa. Muita gente fala que é."'
  ],
  ef:{flag:'ouviu_a_senhora', npc:{nome:'Sra. Ercília', opiniao:2, memoria:'Dividiu um pastel com você na praça de Pewter e falou do filho que voltou.'}},
  escolhas:[
    {texto:'"Não é a mesma coisa mesmo."', vai:'c4_senhora_concordou',
     ef:{npc:{nome:'Sra. Ercília', opiniao:2, memoria:'Você concordou com ela sobre o filho, e ela reparou.'}}},
    {texto:'"Como é o nome dele? Se eu passar na pedreira."', vai:'c4_senhora_nome'},
    {texto:'Não dizer nada. Só ficar.', vai:'c4_senhora_silencio'},
    {texto:'Agradecer e ir andar.', vai:'c4_rua'}
  ]
},

c4_senhora_concordou:{
  texto:[
    '"Não é a mesma coisa mesmo."',
    'Ela olha pra você pela primeira vez direito. Avalia. Decide alguma coisa.',
    '"Você é o quê, treinador?"',
    '"Faz três dias."',
    '"Três dias." Ela ri um riso curto, sem deboche. "Então você ainda não fez nada de que se arrepender. Aproveita."'
  ],
  ef:{presagio:'Ela disse isso como piada. Vai deixar de ser piada.'},
  escolhas:[
    {texto:'"Como é o nome do seu filho?"', vai:'c4_senhora_nome'},
    {texto:'"O que tem pra fazer nessa cidade?"', vai:'c4_senhora_cidade'},
    {texto:'Levantar e ir andar.', vai:'c4_rua'}
  ]
},

c4_senhora_nome:{
  texto:[
    '"Nilo." Ela fala o nome do jeito que se fala o nome de quem se ama e com quem não se conversa mais. "Turno da tarde. Ele é o que fica no rádio."',
    '"Se eu vir ele, falo que a senhora mandou—"',
    '"Não fala nada." Rápido demais. Depois, mais devagar: "Não fala nada. A gente se vê no domingo."',
    'Ela guarda o papel do pastel no bolso em vez de jogar fora, porque é uma dessas pessoas.'
  ],
  ef:{flag:'sabe_do_nilo', registrar:'Sra. Ercília falou do filho Nilo, que trabalha na pedreira.'},
  escolhas:[
    {texto:'Ir pra pedreira agora.', vai:'c4_pedreira_caminho'},
    {texto:'"O que tem pra fazer nessa cidade?"', vai:'c4_senhora_cidade'},
    {texto:'Levantar e ir andar.', vai:'c4_rua'}
  ]
},

c4_senhora_silencio:{
  texto:[
    'Você fica. Não fala nada, ela não fala nada.',
    'Dá pra ficar quinze minutos sentado num banco ao lado de uma desconhecida sem dizer uma palavra, e não ser estranho. Você não sabia disso.',
    'Quando ela levanta, põe a mão no seu ombro de leve, do jeito rápido de quem não quer que vire cena, e vai embora pela rua da igreja.'
  ],
  ef:{hp:2, npc:{nome:'Sra. Ercília', opiniao:3, memoria:'Ficou sentada em silêncio com você na praça e gostou disso.'}},
  escolhas:[
    {texto:'Ir andar pela cidade.', vai:'c4_rua'},
    {texto:'Ir atrás do som das detonações.', vai:'c4_pedreira_caminho'},
    {texto:'Ir falar com Téo.', vai:'c4_teo', cond:d=>!!d.npcs['Téo']}
  ]
},

c4_senhora_contou:{
  texto:[
    'Você conta. Pallet, a manhã da saída, a floresta, o que teve na floresta.',
    'Ela escuta inteiro sem interromper, que é uma coisa que quase ninguém faz, e no fim só pergunta uma coisa:',
    '"E você dormiu depois?"',
    'Você pensa na resposta por mais tempo do que a pergunta parecia pedir.',
    '"Pouco."',
    '"Pois é." Ela faz que sim. "Guarda isso. O dia em que você dormir bem depois de uma coisa dessas, você olha pra si mesmo com atenção."'
  ],
  ef:{flag:'conselho_do_sono', npc:{nome:'Sra. Ercília', opiniao:4, memoria:'Você contou da floresta pra ela. Ela te disse pra reparar no dia em que você dormisse bem depois.'},
      presagio:'Alguma noite dessa jornada você vai dormir muito bem, e vai lembrar disso e ficar acordado de novo.'},
  escolhas:[
    {texto:'"E se eu dormir bem?"', vai:'c4_senhora_dormir'},
    {texto:'Agradecer e levantar.', vai:'c4_rua'},
    {texto:'Ficar em silêncio.', vai:'c4_senhora_silencio'}
  ]
},

c4_senhora_dormir:{
  texto:[
    '"E se eu dormir bem?"',
    '"Aí não quer dizer que você virou ruim." Ela pensa. "Quer dizer que você acostumou. E acostumar é o caminho, entende? Ninguém vira ruim de uma vez. Vira de acostumar."',
    'Ela levanta. Sacode a saia.',
    '"Mas você tem quinze anos e tá filosofando com velha na praça, então você ainda tá bem."'
  ],
  escolhas:[
    {texto:'Ir andar pela cidade.', vai:'c4_rua'},
    {texto:'Ir atrás do som das detonações.', vai:'c4_pedreira_caminho'}
  ]
},

c4_recusou_pastel:{
  texto:[
    '"Não, obrigado."',
    'Ela dá de ombros e come as duas metades, sem nenhum ressentimento, porque velha de cidade pequena oferece por educação e não por necessidade de que aceitem.',
    'Você fica sentado um tempo ouvindo a detonação distante, e depois a fome te lembra que você tomou uma decisão burra.'
  ],
  escolhas:[
    {texto:'Voltar atrás. "Ainda tem?"', vai:'c4_senhora_cidade'},
    {texto:'Ir andar pela cidade.', vai:'c4_rua'},
    {texto:'Ir atrás do som das detonações.', vai:'c4_pedreira_caminho'}
  ]
},

c4_senhora_cidade:{
  texto:[
    '"O que tem pra fazer aqui?"',
    '"Aqui?" Ela acha graça. "Pedra. Tem pedra. Tem o museu, que é pedra velha. Tem a pedreira, que é pedra nova. E tem o resto, que é gente."',
    '"O museu vale?"',
    '"O museu é a única coisa dessa cidade que alguém de fora já quis ver." Ela aponta com o queixo pra um prédio quadrado de dois andares. "E tá caindo aos pedaços. Vai lá antes que caia."'
  ],
  ef:{flag:'ouviu_do_museu'},
  escolhas:[
    {texto:'Ir ao museu.', vai:'c4_museu'},
    {texto:'Ir pra pedreira.', vai:'c4_pedreira_caminho'},
    {texto:'"E gente? Que gente?"', vai:'c4_senhora_gente'},
    {texto:'Agradecer e andar pela rua principal.', vai:'c4_rua'}
  ]
},

c4_senhora_gente:{
  texto:[
    '"E gente? Que gente?"',
    '"Gente que mora." Ela dá de ombros como se isso explicasse. "Mil e duzentas pessoas. Todo mundo sabe o nome de todo mundo e a maioria não gosta da maioria, mas ninguém deixa ninguém passar fome."',
    'Uma pausa.',
    '"Ultimamente tem chegado gente de fora também. Gente com carro bom perguntando de pedra. Não de pedra de construção. De pedra antiga."',
    'Ela fala isso sem dar importância nenhuma, do jeito que se fala uma coisa que a gente já contou pra três pessoas que não acharam interessante.'
  ],
  ef:{flag:'ouviu_dos_carros', registrar:'Alguém de fora tem perguntado por fósseis em Pewter.'},
  escolhas:[
    {texto:'"Que tipo de gente?"', vai:'c4_senhora_carros'},
    {texto:'Ir ao museu agora.', vai:'c4_museu'},
    {texto:'Guardar isso e ir andar.', vai:'c4_rua'}
  ]
},

c4_senhora_carros:{
  texto:[
    '"Que tipo de gente?"',
    '"Educada." Ela fala a palavra como acusação. "Educada demais. Do tipo que chama todo mundo de senhor."',
    '"Eles perguntam o quê?"',
    '"Se alguém acha coisa na pedreira. Se o museu vende. Se o museu empresta." Ela ri sem achar graça nenhuma. "O museu não tem telhado inteiro e eles perguntam se empresta."'
  ],
  ef:{flag:'sabe_dos_compradores'},
  escolhas:[
    {texto:'Ir ao museu.', vai:'c4_museu'},
    {texto:'Ir pra pedreira.', vai:'c4_pedreira_caminho'},
    {texto:'Ir andar pela rua principal.', vai:'c4_rua'}
  ]
},

/* ─────────────── TÉO ─────────────── */

c4_teo:{
  texto:[
    d=>{
      const t = d.npcs['Téo'];
      if (t && t.opiniao >= 4) return '"CARA." Ele levanta antes de você chegar. "Eu cheguei ontem. Eu dormi aqui. Eu tô nessa escada desde as sete da manhã esperando você aparecer, isso é patético, eu sei."';
      if (t && t.opiniao >= 1) return '"Ô." Ele levanta meio devagar. "Achei que você tinha ficado na floresta."';
      return '"Ah. Você." Ele continua mexendo na mochila. "Chegou."';
    },
    d=>d.flags.ensinou_o_pidgey
      ? 'O Pidgey dele está no ombro, não no braço. Ele repara que você reparou e tenta não sorrir e falha completamente.'
      : 'O Pidgey dele está no chão, andando em volta da escada, subindo os degraus a pé, um por um.',
    '"Eu perdi", ele diz, antes de você perguntar qualquer coisa. "No ginásio. Duas vezes."',
    'Ele ri. É um riso ruim — o riso de quem está com medo de descobrir que não serve pra isso e está testando a piada antes que outra pessoa faça.'
  ],
  ef:{flag:'teo_em_pewter', npc:{nome:'Téo', memoria:'Te encontrou em Pewter depois de perder duas vezes no ginásio.'}},
  escolhas:[
    {texto:'"Duas vezes é pouco. Eu pretendo perder mais."', vai:'c4_teo_piada',
     ef:{npc:{nome:'Téo', opiniao:3, memoria:'Você fez piada com a própria derrota pra ele não se sentir sozinho.'},
         rep:{eixo:'bom',delta:1,motivo:'Segurou a barra de alguém em baixa'}}},
    {texto:'"Me conta como foi. Tudo. Do começo."', vai:'c4_teo_relato'},
    {texto:'"Talvez isso não seja pra todo mundo."', vai:'c4_teo_ferido',
     ef:{rep:{eixo:'ruim',delta:2,motivo:'Disse a um amigo em baixa que talvez ele não servisse'},
         npc:{nome:'Téo', opiniao:-6, memoria:'Você disse que talvez ele não servisse pra isso. Ele ouviu de você, e foi de você que doeu.'},
         flag:'teo_ferido'}},
    {texto:'"Treina comigo. Agora."', vai:'c4_teo_treino'}
  ]
},

c4_teo_piada:{
  texto:[
    '"Duas vezes é pouco. Eu pretendo perder mais."',
    'Ele olha pra você com uma desconfiança genuína, procurando o deboche, e não acha.',
    '"Você tá falando sério?"',
    '"Eu saí de casa faz três dias, Téo. Eu perdi pra um Rattata na Rota 1 no primeiro dia."',
    'Isso é mentira. Ele não precisa saber que é mentira. Ele endireita as costas uns três centímetros e fica evidente que os três centímetros vieram daí.',
    '"Então a gente é dois lixos", ele conclui, feliz.'
  ],
  escolhas:[
    {texto:'"Me conta como foi lá dentro."', vai:'c4_teo_relato'},
    {texto:'"Treina comigo."', vai:'c4_teo_treino'},
    {texto:'"Vou dar uma volta pela cidade. Vem?"', vai:'c4_teo_volta'},
    {texto:'Deixar ele em paz e ir andar sozinho.', vai:'c4_rua'}
  ]
},

c4_teo_relato:{
  texto:[
    '"Me conta como foi. Tudo."',
    'Ele conta. Conta demais, com detalhe de tempo e de posição, do jeito de quem reviveu isso umas quarenta vezes deitado no beliche.',
    '"Ele tem um bicho pequeno primeiro. Parece fácil. Não é fácil, é uma armadilha, porque ele te faz gastar."',
    '"E depois?"',
    '"E depois vem uma coisa do tamanho de um ônibus." Téo mede com os braços e os braços não chegam. "Do tamanho de um ÔNIBUS, cara."',
    'Ele para. Fica sério de um jeito que não combina com o rosto dele.',
    '"E o cara nem comemora. Ele te derruba e fica esperando você levantar com a cara de quem já sabia. Isso é pior."'
  ],
  ef:{flag:'dica_do_teo', presagio:'Um dia você vai estar do outro lado de uma linha pintada no chão, esperando alguém levantar, com a cara de quem já sabia.'},
  escolhas:[
    {texto:'"Ele fala alguma coisa depois?"', vai:'c4_teo_brock'},
    {texto:'"Treina comigo antes de você tentar de novo."', vai:'c4_teo_treino'},
    {texto:'"Vou dar uma volta. Vem?"', vai:'c4_teo_volta'},
    {texto:'"Valeu." Guardar isso e ir andar.', vai:'c4_rua'}
  ]
},

c4_teo_brock:{
  texto:[
    '"Ele fala alguma coisa depois?"',
    '"Fala." Téo faz uma cara esquisita. "Ele falou o nome do meu Pidgey. Eu não falei o nome pra ele. Ele ouviu eu gritando durante a luta e guardou."',
    '"E falou o quê?"',
    '"Falou: cuida do Pico melhor do que você cuida de você." Téo encolhe os ombros. "Aí eu chorei um pouco lá fora. Não conta isso pra ninguém."',
    'Ele olha pro Pidgey subindo o quarto degrau a pé.',
    '"O nome dele é Pico. Eu tinha nove anos quando escolhi."'
  ],
  ef:{flag:'sabe_do_pico', npc:{nome:'Téo', opiniao:3, memoria:'Te contou que chorou depois de perder, e o nome do Pidgey: Pico.'},
      presagio:'Você vai ouvir essa frase de novo, dita pra você, e vai entender por que ele chorou.'},
  escolhas:[
    {texto:'"Pico é um nome bom."', vai:'c4_teo_nome',
     ef:{npc:{nome:'Téo', opiniao:2, memoria:'Você elogiou o nome que ele deu ao Pidgey aos nove anos.'}}},
    {texto:'"Treina comigo."', vai:'c4_teo_treino'},
    {texto:'"Vem dar uma volta comigo pela cidade."', vai:'c4_teo_volta'},
    {texto:'Não comentar. Mudar de assunto.', vai:'c4_teo_volta'}
  ]
},

c4_teo_nome:{
  texto:[
    '"Pico é um nome bom."',
    '"É horrível", ele diz, radiante. "É um nome horrível. Eu tinha NOVE ANOS."',
    'O Pidgey, ao ouvir o nome duas vezes, para no meio do degrau e olha pra cima, esperando.',
    'Téo desce e pega ele no colo sem nenhum constrangimento, que é a coisa mais bonita que essa cidade de pedra vai te mostrar hoje.'
  ],
  ef:{hp:2},
  escolhas:[
    {texto:'"Treina comigo."', vai:'c4_teo_treino'},
    {texto:'"Vem dar uma volta."', vai:'c4_teo_volta'},
    {texto:'Ir andar sozinho.', vai:'c4_rua'}
  ]
},

c4_teo_treino:{
  texto:[
    '"Treina comigo. Agora."',
    'O pátio de terra atrás do Centro de Pewter é maior que o de Viridian e tem uma parede de pedra no fundo onde gente treina mira.',
    'Vocês não batalham de verdade. Vocês treinam — que é diferente e muito mais chato e muito mais útil.',
    'Ele conta em voz alta os turnos que o Pico aguenta. Você conta os seus. Vocês descobrem, os dois, que estavam atacando cedo demais a jornada inteira.'
  ],
  ef:{executar:d=>{
        const av = [];
        d.time.forEach(p=>{ const ev = ganharExp(p, 180); if (ev && ev.length) ev.forEach(x=>av.push({tipo:'info', texto:x})); });
        return av.length ? av : [{tipo:'info', texto:'Vocês treinam até a luz ir embora. Alguma coisa assenta no jeito que o seu time te ouve.'}];
      },
      moral:8, npc:{nome:'Téo', opiniao:3, memoria:'Vocês treinaram juntos no pátio do Centro de Pewter até escurecer.'},
      flag:'treinou_com_teo'},
  escolhas:[
    {texto:'"Amanhã a gente entra lá. Os dois."', vai:'c4_teo_combinado',
     ef:{flag:'teo_assiste', npc:{nome:'Téo', opiniao:3, memoria:'Vocês combinaram de encarar o ginásio de Pewter juntos.'}}},
    {texto:'"Me conta como foi lá dentro."', vai:'c4_teo_relato'},
    {texto:'"Vem dar uma volta pela cidade comigo."', vai:'c4_teo_volta'},
    {texto:'Encerrar por hoje e ir andar sozinho.', vai:'c4_rua'}
  ]
},

c4_teo_combinado:{
  texto:[
    '"Amanhã a gente entra lá. Os dois."',
    '"Você primeiro", ele diz na hora.',
    '"Por quê?"',
    '"Porque se você perder eu sei que não é só comigo." Ele fala isso sem nenhuma vergonha, o que é uma forma esquisita de coragem. "E se você ganhar eu vejo como."',
    'Combinado. Ele bate na sua mão com a mesma solenidade ridícula de Viridian.'
  ],
  ef:{flag:'teo_assiste'},
  escolhas:[
    {texto:'"Vem dar uma volta pela cidade antes."', vai:'c4_teo_volta'},
    {texto:'Ir andar sozinho.', vai:'c4_rua'},
    {texto:'Ir pra pedreira.', vai:'c4_pedreira_caminho'}
  ]
},

c4_teo_volta:{
  texto:[
    'Vocês andam. Téo fala o tempo todo e quase nada do que ele fala tem função, e isso é exatamente o ponto.',
    'Ele já mapeou a cidade em dois dias: onde o pão sai às cinco, qual banco não balança, qual rua pega vento.',
    '"Ah, e tem um museu", ele diz, apontando. "Eu entrei. Tem um bicho de pedra do tamanho de uma pessoa. Tem uma moça lá dentro que fica olhando ele igual gente olha parente no caixão."'
  ],
  ef:{flag:'ouviu_do_museu'},
  escolhas:[
    {texto:'Ir ao museu agora, com ele.', vai:'c4_museu', ef:{flag:'teo_no_museu'}},
    {texto:'Ir pra pedreira.', vai:'c4_pedreira_caminho'},
    {texto:'"Boa. Depois eu vejo." Continuar andando.', vai:'c4_rua'},
    {texto:'Perguntar por que ele reparou na moça.', vai:'c4_teo_moca'}
  ]
},

c4_teo_moca:{
  texto:[
    '"Por que você reparou nela?"',
    'Téo demora a responder, o que nele é raro.',
    '"Porque ela tava sozinha num museu vazio numa terça de manhã", ele diz. "Isso não é normal, cara. Ninguém faz isso por hobby."',
    'Às vezes o Téo diz uma coisa inteligente sem perceber, e depois estraga: "Ou ela é doida. Pode ser que ela seja só doida."'
  ],
  escolhas:[
    {texto:'Ir ao museu agora.', vai:'c4_museu', ef:{flag:'teo_no_museu'}},
    {texto:'Ir pra pedreira.', vai:'c4_pedreira_caminho'},
    {texto:'Continuar andando pela cidade.', vai:'c4_rua'}
  ]
},

c4_teo_ferido:{
  texto:[
    '"Talvez isso não seja pra todo mundo."',
    'Téo não responde na hora. Fecha o zíper da mochila devagar, com muito mais cuidado do que um zíper precisa.',
    '"É." Ele faz que sim várias vezes, pro chão. "É, pode ser."',
    'Ele chama o Pidgey, que sobe no braço dele na terceira tentativa.',
    '"Boa sorte aí", ele diz, e é a voz mais educada que você já ouviu dele, e educado é a coisa mais longe que ele consegue ficar de você agora.',
    'Ele entra no Centro. Você fica na escada.'
  ],
  ef:{registrar:'Você disse ao Téo que talvez ele não servisse pra isso.',
      presagio:'Isso vai voltar. Não como briga. Como uma pessoa diferente da que era.'},
  escolhas:[
    {texto:'Ir atrás dele e voltar atrás.', vai:'c4_teo_desculpa'},
    {texto:'Deixar. Você não falou nenhuma mentira.', vai:'c4_rua'},
    {texto:'Ir pra pedreira e não pensar nisso.', vai:'c4_pedreira_caminho'},
    {texto:'Ficar sentado na escada por um tempo.', vai:'c4_teo_escada'}
  ]
},

c4_teo_escada:{
  texto:[
    'Você senta na escada onde ele estava sentado.',
    'A pedra ainda está morna do corpo dele. Isso é um detalhe desnecessário e é o único em que você consegue pensar por uns bons dois minutos.',
    'Pela porta de vidro dá pra ver ele na fila da enfermeira, de costas, falando com o Pidgey.'
  ],
  escolhas:[
    {texto:'Entrar e voltar atrás.', vai:'c4_teo_desculpa'},
    {texto:'Levantar e ir andar.', vai:'c4_rua'},
    {texto:'Ir pra pedreira.', vai:'c4_pedreira_caminho'}
  ]
},

c4_teo_desculpa:{
  texto:[
    'Você entra e fala antes de perder a coragem.',
    '"Eu falei merda."',
    'Ele não vira.',
    '"Falou."',
    '"Eu não sei se isso é pra mim. Eu falei de mim e joguei em você porque é mais fácil."',
    'Aí ele vira. Olha a sua cara procurando a mentira, do mesmo jeito que olhou na escada.',
    '"Isso é verdade ou você tá sendo legal?"',
    '"Os dois."',
    'Ele aceita. Não desfaz o que aconteceu — ele vai lembrar dessa frase pelo resto da vida —, mas aceita.'
  ],
  ef:{limpaFlag:'teo_ferido', flag:'teo_perdoou',
      npc:{nome:'Téo', opiniao:4, memoria:'Você voltou atrás e admitiu que a frase era sobre você, não sobre ele. Ele lembra das duas coisas.'},
      rep:{eixo:'bom',delta:1,motivo:'Voltou atrás de uma crueldade'}},
  escolhas:[
    {texto:'"Treina comigo."', vai:'c4_teo_treino'},
    {texto:'"Me conta como foi lá dentro."', vai:'c4_teo_relato'},
    {texto:'Ir andar pela cidade.', vai:'c4_rua'}
  ]
},

/* ─────────────── A RUA ─────────────── */

c4_rua:{
  texto:[
    'A rua principal de Pewter tem dezoito estabelecimentos e você consegue contar todos de uma esquina.',
    'Uma menina de uns dez anos está sentada no meio-fio com um caderno, anotando quem passa. Ela te anota.',
    'Um prédio quadrado de dois andares, com letras de metal na fachada: MUSEU DE PEWTER. Metade das letras está mais escura que a outra metade — dá pra ler onde estiveram as que caíram.',
    'No fim da rua, uma porta de metal sem placa bonita. Não tem nada indicando o que é. Dá pra ouvir alguma coisa pesada caindo lá dentro, em intervalos regulares.'
  ],
  ef:{flag:'ouviu_do_museu'},
  escolhas:[
    {texto:'Entrar no museu.', vai:'c4_museu'},
    {texto:'Falar com a menina do caderno.', vai:'c4_menina'},
    {texto:'Chegar perto da porta de metal e escutar.', vai:'c4_porta_metal'},
    {texto:'Seguir o som das detonações, pra fora da cidade.', vai:'c4_pedreira_caminho'}
  ]
},

c4_porta_metal:{
  texto:[
    'Você chega perto. A porta é de metal industrial, pintada de cinza sobre cinza, com uma marca de arranhão longo na altura do peito.',
    'Lá dentro: uma coisa pesada cai. Silêncio de uns quinze segundos. A coisa pesada cai de novo.',
    'Não tem placa. Não tem horário. Não tem "bem-vindo".',
    'Quem entra aqui já sabe o que é, e quem não sabe não devia entrar. Você fica com a sensação clara de que essa porta não está escondida — ela só não está se oferecendo.'
  ],
  ef:{executar:d=>{ Mundo.descobrir('ginasio_pewter'); Mundo.descobrir('achou_ginasio_pewter'); return [{tipo:'eco', texto:'Você vai lembrar onde fica essa porta.'}]; }},
  escolhas:[
    {texto:'Empurrar a porta.', vai:'c4_porta_empurrou'},
    {texto:'Não. Hoje não.', vai:'c4_rua2'},
    {texto:'Perguntar pra alguém na rua o que é aquilo.', vai:'c4_perguntou_porta'},
    {texto:'Entrar no museu em vez disso.', vai:'c4_museu'}
  ]
},

c4_porta_empurrou:{
  texto:[
    'Você empurra. Ela é mais pesada do que parece e você tem que usar o ombro.',
    'Dentro: terra batida sobre pedra, sem arquibancada, sem faixa, sem música. Uma linha pintada no chão, gasta no meio de tanto ser pisada.',
    'Um homem no fundo levanta uma coisa do tamanho de um motor de carro e solta. A coisa cai. É o som que você estava ouvindo da rua.',
    'Ele te vê. Não para o que está fazendo.',
    '"Quando você tiver certeza, você volta", ele diz. "E não precisa ser hoje. Aqui não fecha."',
    'Você sai. A porta se fecha sozinha pelo próprio peso.'
  ],
  ef:{flag:'viu_brock_de_longe', npc:{nome:'Líder Brock', opiniao:1, memoria:'Você entrou no ginásio dele, olhou, e saiu sem desafiar. Ele achou isso maduro.'},
      presagio:'Ele não perguntou seu nome. Vai perguntar depois, e você vai reparar em que momento.'},
  escolhas:[
    {texto:'Ir ao museu.', vai:'c4_museu'},
    {texto:'Ir pra pedreira.', vai:'c4_pedreira_caminho'},
    {texto:'Falar com a menina do caderno.', vai:'c4_menina'},
    {texto:'Voltar pro Centro e encerrar o dia.', vai:'c4_fim'}
  ]
},

c4_perguntou_porta:{
  texto:[
    'Você pergunta pro primeiro que passa, um senhor com um saco de cimento no ombro.',
    'Ele olha a porta. Olha você. Olha a porta de novo.',
    '"Isso aí é o ginásio."',
    'Ele diz isso do jeito que se diz "isso aí é a padaria" — sem nenhum peso, porque pra ele não tem peso nenhum. Mora ao lado disso a vida inteira.',
    '"O cara é gente boa. Cresceu aqui. Cuida de uns cinco irmão sozinho." Ele ajeita o cimento. "Mas lá dentro ele não é gente boa não."'
  ],
  ef:{flag:'sabe_do_ginasio_pewter'},
  escolhas:[
    {texto:'Empurrar a porta.', vai:'c4_porta_empurrou'},
    {texto:'"Cinco irmãos?"', vai:'c4_irmaos'},
    {texto:'Agradecer e ir ao museu.', vai:'c4_museu'},
    {texto:'Agradecer e ir pra pedreira.', vai:'c4_pedreira_caminho'}
  ]
},

c4_irmaos:{
  texto:[
    '"Cinco irmãos?"',
    '"Cinco, seis, eu perco a conta." O senhor troca o cimento de ombro. "O pai foi embora. A mãe foi atrás do pai. Ele tinha dezesseis anos e uma casa cheia."',
    '"E o ginásio?"',
    '"A Liga queria fechar. Ele falou que não. Aí ele fez o ginásio dar dinheiro, sabe como? Aceitando desafio de todo mundo que aparece, todo dia, o ano inteiro. Todo mundo."',
    'Ele cospe no chão de um jeito prático, sem agressividade.',
    '"Por isso ele não pega leve com moleque de quinze anos. Ele foi um."'
  ],
  ef:{flag:'historia_do_brock', npc:{nome:'Líder Brock', opiniao:1, memoria:'Você ouviu a história dele antes de conhecer ele.'}},
  escolhas:[
    {texto:'Empurrar a porta.', vai:'c4_porta_empurrou'},
    {texto:'Ir ao museu.', vai:'c4_museu'},
    {texto:'Ir pra pedreira.', vai:'c4_pedreira_caminho'},
    {texto:'Voltar pro Centro.', vai:'c4_fim'}
  ]
},

c4_menina:{
  texto:[
    'A menina do caderno tem uns dez anos e uma organização assustadora. O caderno tem colunas.',
    '"Treinador?" ela pergunta, já escrevendo.',
    '"Sou."',
    '"De onde?" Você fala. Ela anota. "Quantas insígnias?"',
    d=>d.insignias.length ? `"${d.insignias.length}." Ela anota sem reagir, o que é decepcionante.` : '"Nenhuma." Ela anota sem reagir, o que de alguma forma é pior do que se ela tivesse rido.',
    '"Eu tô fazendo pesquisa", ela explica. "Sobre quantos passam e quantos voltam."'
  ],
  ef:{npc:{nome:'Zuleica', opiniao:1, memoria:'A menina do caderno de Pewter. Anotou você na pesquisa dela.'}},
  escolhas:[
    {texto:'"E qual é o resultado?"', vai:'c4_menina_resultado'},
    {texto:'"Quantos anos você tem pra estar fazendo isso?"', vai:'c4_menina_idade'},
    {texto:'"Me dá uma dica do ginásio."', vai:'c4_menina_dica'},
    {texto:'Deixar ela trabalhar e seguir.', vai:'c4_rua2'}
  ]
},

c4_menina_resultado:{
  texto:[
    '"E qual é o resultado?"',
    'Ela vira o caderno pra você com o orgulho de quem mostra uma casa que construiu.',
    'Duas colunas. PASSOU e VOLTOU. A primeira tem oitenta e três riscos. A segunda tem trinta e um.',
    '"Ah, mas nem todo mundo que não voltou morreu", ela esclarece, prestativa. "Tem gente que vai pro outro lado. Sai por Cerulean e não passa mais aqui."',
    '"E quantos você acha que é cada coisa?"',
    'Pela primeira vez ela hesita. Fecha o caderno.',
    '"Eu não anoto isso."'
  ],
  ef:{flag:'viu_o_caderno', presagio:'Oitenta e três e trinta e um. Você vai fazer essa conta de novo, com você dentro dela.'},
  escolhas:[
    {texto:'"Anota que eu volto."', vai:'c4_menina_promessa',
     ef:{npc:{nome:'Zuleica', opiniao:4, memoria:'Você prometeu voltar e ela anotou numa coluna nova só pra você.'}}},
    {texto:'"Me dá uma dica do ginásio."', vai:'c4_menina_dica'},
    {texto:'"Boa sorte com a pesquisa." Seguir.', vai:'c4_rua2'},
    {texto:'"Você devia anotar. É o dado mais importante."', vai:'c4_menina_dado'}
  ]
},

c4_menina_promessa:{
  texto:[
    '"Anota que eu volto."',
    'Ela pensa. Abre o caderno numa página nova. Escreve no topo, com régua: PROMETEU.',
    'Depois escreve seu nome embaixo, e é o primeiro da lista.',
    '"Se você não voltar eu risco", ela avisa, sem nenhuma emoção. "Eu risco com caneta vermelha."'
  ],
  ef:{flag:'prometeu_voltar_pewter',
      presagio:'Existe agora uma página com o seu nome no topo, numa cidade de pedra, esperando uma caneta vermelha.'},
  escolhas:[
    {texto:'"Me dá uma dica do ginásio."', vai:'c4_menina_dica'},
    {texto:'Seguir pela rua.', vai:'c4_rua2'},
    {texto:'Ir ao museu.', vai:'c4_museu'}
  ]
},

c4_menina_dado:{
  texto:[
    '"Você devia anotar. É o dado mais importante."',
    '"Eu sei que é o mais importante." Ela fecha o caderno com as duas mãos. "Por isso eu não anoto."',
    'Ela levanta, sacode a poeira do short, e vai embora pela rua da igreja sem se despedir.',
    'Você fica com a impressão bem clara de ter estragado alguma coisa que não era sua.'
  ],
  ef:{npc:{nome:'Zuleica', opiniao:-2, memoria:'Você insistiu para ela anotar quantos morreram. Ela foi embora.'}},
  escolhas:[
    {texto:'Ir atrás e pedir desculpa.', vai:'c4_menina_desculpa'},
    {texto:'Seguir pela rua.', vai:'c4_rua2'},
    {texto:'Ir ao museu.', vai:'c4_museu'}
  ]
},

c4_menina_desculpa:{
  texto:[
    'Você alcança ela na esquina.',
    '"Desculpa."',
    '"Tá." Ela não para de andar.',
    '"Eu não devia ter falado isso."',
    'Aí ela para.',
    '"Meu irmão tá na primeira coluna faz dois anos", ela diz, muito rápido e muito baixo. "Se eu fizer a outra coluna eu vou ter que escolher onde botar ele."',
    'Ela vai embora de verdade agora, e dessa vez você deixa.'
  ],
  ef:{flag:'irmao_da_zuleica',
      npc:{nome:'Zuleica', opiniao:2, memoria:'Você pediu desculpa e ela te contou do irmão que está na primeira coluna há dois anos.'},
      presagio:'Um nome numa coluna, em algum lugar de Kanto, esperando pra ser movido.'},
  escolhas:[
    {texto:'Seguir pela rua.', vai:'c4_rua2'},
    {texto:'Ir ao museu.', vai:'c4_museu'},
    {texto:'Ir pra pedreira.', vai:'c4_pedreira_caminho'}
  ]
},

c4_menina_idade:{
  texto:[
    '"Quantos anos você tem pra estar fazendo isso?"',
    '"Dez." Ela nem levanta a cabeça. "E antes que você fale: não, eu não vou ser treinadora."',
    '"Por quê?"',
    '"Porque eu tenho a lista." Ela bate no caderno com o dedo. "Você não leu a lista."'
  ],
  escolhas:[
    {texto:'"Deixa eu ler."', vai:'c4_menina_resultado'},
    {texto:'"Me dá uma dica do ginásio, então."', vai:'c4_menina_dica'},
    {texto:'Seguir pela rua.', vai:'c4_rua2'}
  ]
},

c4_menina_dica:{
  texto:[
    '"Me dá uma dica do ginásio."',
    'Ela suspira do jeito de quem já deu essa dica cem vezes e cem vezes não adiantou.',
    '"Leva alguma coisa de Água ou de Planta. Todo mundo esquece."',
    '"Só isso?"',
    '"Não." Ela olha pros lados como quem vai contar segredo de estado. "E não ataca nos dois primeiros turnos. Ele conta os seus turnos. Ele sabe quanto você aguenta antes de você saber."'
  ],
  ef:{flag:'dica_ginasio_pewter', presagio:'Você vai contar turnos daqui pra frente. Nunca mais vai conseguir não contar.'},
  escolhas:[
    {texto:'"Como você sabe disso?"', vai:'c4_menina_sabe'},
    {texto:'Agradecer e ir pra rua.', vai:'c4_rua2'},
    {texto:'Ir direto olhar a porta de metal.', vai:'c4_porta_metal'},
    {texto:'Ir ao museu.', vai:'c4_museu'}
  ]
},

c4_menina_sabe:{
  texto:[
    '"Como você sabe disso?"',
    '"Eu fico sentada nessa rua o dia inteiro há dois anos." Ela dá de ombros. "Eu vejo entrar e vejo sair. Quem sai feliz eu pergunto o que fez."',
    'Ela abre o caderno numa aba lateral que você não tinha visto. Tem uma tabela.',
    'Uma menina de dez anos numa cidade de pedra montou, sem ninguém pedir, o melhor levantamento estatístico do ginásio de Pewter que existe.'
  ],
  ef:{npc:{nome:'Zuleica', opiniao:3, memoria:'Você levou a pesquisa dela a sério e ela te mostrou a tabela secreta.'}},
  escolhas:[
    {texto:'"Anota que eu volto."', vai:'c4_menina_promessa'},
    {texto:'Ir olhar a porta de metal.', vai:'c4_porta_metal'},
    {texto:'Ir ao museu.', vai:'c4_museu'},
    {texto:'Seguir pela rua.', vai:'c4_rua2'}
  ]
},

c4_rua2:{
  texto:[
    'A rua continua sendo a rua. A luz baixou um pouco e a poeira ficou dourada, o que quase compensa a poeira.',
    'Ainda tem o museu de letras faltando. Ainda tem a porta de metal no fim da rua. E ainda tem, longe, a cada vinte minutos, a detonação.'
  ],
  escolhas:[
    {texto:'Museu.', vai:'c4_museu'},
    {texto:'A porta de metal.', vai:'c4_porta_metal'},
    {texto:'A pedreira.', vai:'c4_pedreira_caminho'},
    {texto:'Chega por hoje. Voltar pro Centro.', vai:'c4_fim'}
  ]
},

/* ─────────────── MUSEU ─────────────── */

c4_museu:{
  texto:[
    'A entrada custa duzentos e a moça da bilheteria parece genuinamente surpresa de ter que dar um ingresso.',
    'O museu tem duas salas. Na primeira, minerais em vitrines com etiqueta datilografada e um mapa geológico de Kanto desbotado até o azul virar cinza.',
    'Tem um balde no canto, embaixo de uma mancha no teto. O balde tem água.',
    'Na segunda sala, atrás de um vidro que precisa de limpeza, um Kabutops reconstruído em pedra. Do tamanho de uma pessoa. As lâminas dos braços ainda são lâminas depois de trezentos milhões de anos.',
    'A placa diz: "Extinto há aproximadamente 300 milhões de anos."',
    d=>d.flags.teo_no_museu ? 'Téo para na porta da segunda sala e não entra. "Eu já vi. Vai você."' : ''
  ],
  ef:{flag:'viu_o_museu', dinheiro:-200, registrar:'Visitou o museu de Pewter.'},
  escolhas:[
    {texto:'Ficar olhando o Kabutops.', vai:'c4_kabutops'},
    {texto:'Falar com a mulher de jaleco que está parada na frente do vidro.', vai:'c4_ivone'},
    {texto:'Procurar o funcionário e perguntar do balde.', vai:'c4_funcionario'},
    {texto:'Dar uma volta rápida e sair.', vai:'c4_museu_saiu'}
  ]
},

c4_kabutops:{
  texto:[
    'Você fica. Mais tempo do que pretendia.',
    'De perto dá pra ver que a reconstrução tem partes cinza e partes um pouco mais claras: o cinza é osso, o claro é gesso. O bicho é uns sessenta por cento chute.',
    'E mesmo assim: as lâminas. Os olhos, que são buracos e mesmo assim são olhos. A postura, que é de uma coisa que estava indo pra frente.',
    'Uma voz do seu lado, sem cumprimento nenhum:',
    '"Extinto é uma palavra otimista. Presume que acabou."'
  ],
  escolhas:[
    {texto:'"Como assim, presume que acabou?"', vai:'c4_ivone'},
    {texto:'"A senhora trabalha aqui?"', vai:'c4_ivone'},
    {texto:'Não responder e continuar olhando.', vai:'c4_ivone_calado'},
    {texto:'Sair da sala.', vai:'c4_museu_saiu'}
  ]
},

c4_ivone_calado:{
  texto:[
    'Você não responde. Continua olhando o bicho.',
    'Ela também não insiste. Fica do seu lado, olhando a mesma coisa que você, por quase dois minutos inteiros.',
    'Depois: "Você é a primeira pessoa em quatro dias que não perguntou se é de verdade."',
    'Ela vira. Tem olheiras de três dias e um caderno de campo debaixo do braço com elástico e tudo.',
    '"Você vai pro Monte da Lua?"'
  ],
  ef:{npc:{nome:'Dra. Ivone', opiniao:2, memoria:'Ficou dois minutos em silêncio com você na frente do Kabutops. Gostou disso.'}},
  escolhas:[
    {texto:'"Vou. Por quê?"', vai:'c4_ivone_monte'},
    {texto:'"Ainda não decidi."', vai:'c4_ivone_monte'},
    {texto:'"Por que a senhora quer saber?"', vai:'c4_ivone_desconfiado'},
    {texto:'"Vou." E não perguntar mais nada.', vai:'c4_ivone_seco'}
  ]
},

c4_ivone:{
  texto:[
    'Ela está parada na frente do vidro anotando alguma coisa num caderno de campo com elástico. Tem olheiras de três dias.',
    '"Extinto é uma palavra otimista", ela diz, sem olhar pra você. "Presume que acabou."',
    '"E não acabou?"',
    '"Ah, acabou." Ela vira uma página. "Eles morreram. Todos. Isso acabou."',
    'Aí ela fecha o caderno e te olha de verdade pela primeira vez.',
    '"O que não acabou é o que a gente faz com eles depois. Você vai pro Monte da Lua?"'
  ],
  ef:{npc:{nome:'Dra. Ivone', opiniao:1, memoria:'Te abordou no museu de Pewter falando de fósseis.'}},
  escolhas:[
    {texto:'"Vou. Por quê?"', vai:'c4_ivone_monte'},
    {texto:'"Por que a senhora quer saber?"', vai:'c4_ivone_desconfiado'},
    {texto:'"Vou." E esperar ela continuar.', vai:'c4_ivone_seco'},
    {texto:'"Não é da sua conta." Sair da sala.', vai:'c4_museu_saiu',
     ef:{npc:{nome:'Dra. Ivone', opiniao:-2, memoria:'Você a cortou no museu de Pewter.'}}}
  ]
},

c4_ivone_desconfiado:{
  texto:[
    '"Por que a senhora quer saber?"',
    'Ela gosta da pergunta. Dá pra ver.',
    '"Boa. Guarda essa pergunta, ela vale mais que insígnia." Ela apoia o caderno na vitrine. "Meu nome é Ivone Barcelos. Eu sou paleontóloga e eu trabalhava aqui até três meses atrás."',
    '"Trabalhava?"',
    '"O museu não tem verba pra dois funcionários. Sobrou o que abre a porta." Ela dá de ombros, e o dar de ombros é a parte mais triste. "Eu continuo vindo. Não tenho pra onde mais ir com isso na cabeça."'
  ],
  ef:{npc:{nome:'Dra. Ivone', opiniao:3, memoria:'Você desconfiou dela primeiro, e ela respeitou isso.'}},
  escolhas:[
    {texto:'"Com o quê na cabeça?"', vai:'c4_ivone_monte'},
    {texto:'"E o museu, como fica?"', vai:'c4_funcionario'},
    {texto:'"Sinto muito." E sair.', vai:'c4_museu_saiu'},
    {texto:'"Eu vou pro Monte da Lua. É sobre isso?"', vai:'c4_ivone_monte'}
  ]
},

c4_ivone_seco:{
  texto:[
    '"Vou."',
    'Você não pergunta mais nada. Ela espera. Você continua não perguntando.',
    '"Tá bom", ela cede. "Eu falo mesmo assim."'
  ],
  escolhas:[{texto:'Escutar.', vai:'c4_ivone_monte'}]
},

c4_ivone_monte:{
  texto:[
    '"Alguém está tirando coisa de lá."',
    'Ela abre o caderno numa página com fotografia colada. Uma parede de caverna com um fóssil meio exposto na rocha. Do lado, a mesma parede, com um buraco retangular limpo.',
    '"Isso aqui é março. Isso aqui é junho. Não foi erosão, não foi desabamento. Foi serra."',
    '"E pra onde vai?"',
    '"Celadon. Sempre Celadon." Ela fecha o caderno. "Fóssil não anda sozinho até um mercado. Tem caminhão, tem estrada, tem gente pagando e gente carregando."',
    'Ela olha o Kabutops atrás do vidro.',
    '"Esse aqui é o único que ainda está inteiro em Kanto num lugar onde qualquer pessoa pode olhar de graça. Digo, por duzentos pokedólares. E o teto dele vaza."'
  ],
  ef:{flag:'sabe_do_trafico_fossil', registrar:'Dra. Ivone falou do saque de fósseis no Monte da Lua.'},
  escolhas:[
    {texto:'"A senhora reportou isso?"', vai:'c4_ivone_reportou'},
    {texto:'"O que a senhora quer de mim?"', vai:'c4_ivone_pedido'},
    {texto:'"Por que fóssil? Quem compra isso?"', vai:'c4_ivone_compradores'},
    {texto:'"Isso é grande demais pra mim." Sair.', vai:'c4_ivone_recusa'}
  ]
},

c4_ivone_reportou:{
  texto:[
    '"A senhora reportou isso?"',
    'Ela ri uma risada de uma sílaba só.',
    '"Três vezes. A Liga mandou um oficial. O oficial subiu até a entrada da caverna, tirou quatro fotos, escreveu um relatório de uma página e meia e voltou."',
    '"E aí?"',
    '"E aí o relatório está numa gaveta em Saffron. Eu sei o número da gaveta. Eu liguei tantas vezes que a moça do arquivo me deu o número da gaveta pra eu parar de ligar."'
  ],
  ef:{flag:'liga_engavetou', presagio:'Uma gaveta em Saffron, com um número. Você vai ter motivo pra lembrar desse detalhe.'},
  escolhas:[
    {texto:'"O que a senhora quer de mim?"', vai:'c4_ivone_pedido'},
    {texto:'"Por que a Liga não faz nada?"', vai:'c4_ivone_liga'},
    {texto:'"Então não tem o que fazer." Sair.', vai:'c4_ivone_recusa'},
    {texto:'"Me dá o número da gaveta."', vai:'c4_ivone_gaveta'}
  ]
},

c4_ivone_gaveta:{
  texto:[
    '"Me dá o número da gaveta."',
    'Ela para. Te olha de um jeito completamente novo.',
    '"Pra quê?"',
    '"Sei lá. Pra saber."',
    'Ela escreve num canto de página, arranca, dobra e te entrega. Está escrito: ARQUIVO CENTRAL — SAFFRON — SETOR 3 — GAV. 118 — PROC. 44.207/R.',
    '"Se algum dia você tiver motivo pra pedir vista desse processo", ela diz, "você vai precisar desse número e de um papel timbrado. Eu só tenho o número."'
  ],
  ef:{flag:'numero_da_gaveta', registrar:'Anotou o número do processo engavetado: 44.207/R, Arquivo Central de Saffron.',
      presagio:'Um número de processo cabe no bolso e não pesa nada. Vai pesar.'},
  escolhas:[
    {texto:'"O que a senhora quer de mim?"', vai:'c4_ivone_pedido'},
    {texto:'"Por que fóssil? Quem compra isso?"', vai:'c4_ivone_compradores'},
    {texto:'Guardar o papel e sair.', vai:'c4_museu_saiu'}
  ]
},

c4_ivone_liga:{
  texto:[
    '"Por que a Liga não faz nada?"',
    '"Porque a Liga é uma federação esportiva."',
    'Ela fala isso devagar, como quem repete uma coisa que teve que aceitar.',
    '"Ela organiza campeonato, emite licença e credencia ginásio. Em algum momento nos últimos quarenta anos ela virou também polícia, tribunal e conselho de ética, porque ninguém mais quis fazer isso e ela tinha o carimbo."',
    '"E ela é ruim nisso."',
    '"Ela é péssima nisso." Ivone guarda a caneta no bolso do jaleco. "E o problema não é a maldade. É que não tem ninguém no organograma cujo trabalho seja se importar."'
  ],
  ef:{flag:'entendeu_a_liga', presagio:'Você vai reencontrar essa frase escrita num documento, dita com outras palavras e com muito mais frieza.'},
  escolhas:[
    {texto:'"O que a senhora quer de mim?"', vai:'c4_ivone_pedido'},
    {texto:'"Me dá o número da gaveta."', vai:'c4_ivone_gaveta'},
    {texto:'"E se alguém se importasse?"', vai:'c4_ivone_importar'},
    {texto:'Sair.', vai:'c4_museu_saiu'}
  ]
},

c4_ivone_importar:{
  texto:[
    '"E se alguém se importasse?"',
    'Ela te olha com um cansaço que não é com você.',
    '"Aí essa pessoa ia ter que decidir até onde." Ela fecha o caderno. "E é aí que mora a parte feia, porque todo mundo que se importa muito acaba achando que pode um pouco mais do que pode."',
    'Ela pega a bolsa.',
    '"Eu já achei isso. Uma vez. Não deu certo e eu não vou contar."'
  ],
  ef:{flag:'ivone_tem_passado',
      presagio:'Ela não vai contar hoje. Vai contar em outro lugar, num dia pior.'},
  escolhas:[
    {texto:'"O que a senhora quer de mim?"', vai:'c4_ivone_pedido'},
    {texto:'Não insistir. Mudar de assunto.', vai:'c4_ivone_compradores'},
    {texto:'Sair.', vai:'c4_museu_saiu'}
  ]
},

c4_ivone_compradores:{
  texto:[
    '"Por que fóssil? Quem compra isso?"',
    '"Quem tem sala de estar grande." Ela diz isso sem nenhum humor. "E, ultimamente, gente que não quer pendurar na parede."',
    '"Pra quê, então?"',
    '"Boa pergunta. Fóssil tem material dentro. Tem estrutura orgânica preservada em raríssimos casos." Ela bate no vidro com a unha. "Teve um laboratório em Cinnabar que passou uns anos interessado nisso. O laboratório fechou."',
    'Uma pausa exatamente do tamanho errado.',
    '"Fechou no papel."'
  ],
  ef:{flag:'fossil_e_material', registrar:'Ivone insinuou que alguém quer fósseis pelo material, não pelo enfeite.',
      presagio:'Uma ilha com um laboratório fechado no papel. Você não vai chegar lá tão cedo, e vai chegar.'},
  escolhas:[
    {texto:'"O que a senhora quer de mim?"', vai:'c4_ivone_pedido'},
    {texto:'"Fechou no papel como?"', vai:'c4_ivone_cinnabar'},
    {texto:'Isso é conversa demais. Sair.', vai:'c4_museu_saiu'}
  ]
},

c4_ivone_cinnabar:{
  texto:[
    '"Fechou no papel como?"',
    '"Como fecham as coisas." Ela dá de ombros. "Encerra o CNPJ, demite o quadro, publica no diário oficial. E o prédio continua com luz acesa."',
    '"A senhora viu a luz acesa?"',
    '"Eu vi a conta de energia." Ela quase sorri. "Isso é público, sabia? Consumo de unidade consumidora é público. Deu pra ver que o laboratório desativado de Cinnabar gastou, em outubro, mais energia que o museu inteiro em um ano."',
    'Ela olha pro balde no canto da sala.',
    '"O que não é difícil, convenhamos."'
  ],
  ef:{flag:'conta_de_luz_cinnabar', registrar:'O laboratório "fechado" de Cinnabar consome mais energia que o museu de Pewter.'},
  escolhas:[
    {texto:'"O que a senhora quer de mim?"', vai:'c4_ivone_pedido'},
    {texto:'"Por que a senhora tá me contando isso?"', vai:'c4_ivone_porque_eu'},
    {texto:'Sair. É informação demais pra um dia.', vai:'c4_museu_saiu'}
  ]
},

c4_ivone_porque_eu:{
  texto:[
    '"Por que a senhora tá me contando isso? Eu tenho quinze anos."',
    '"Porque você vai passar por lá." Simples assim. "E eu não vou."',
    'Ela fecha o caderno pela última vez.',
    '"Eu já contei isso pra onze treinadores nesse museu. Nenhum voltou pra me falar nada. Você provavelmente também não vai."',
    '"Então por que continuar contando?"',
    '"Porque o custo de contar é dois minutos", ela diz. "E o custo de não contar é não saber o que teria acontecido."'
  ],
  ef:{npc:{nome:'Dra. Ivone', opiniao:2, memoria:'Explicou por que conta isso a adolescentes: o custo de contar é dois minutos.'}},
  escolhas:[
    {texto:'"O que a senhora quer de mim?"', vai:'c4_ivone_pedido'},
    {texto:'"Eu volto pra te contar."', vai:'c4_ivone_pedido',
     ef:{npc:{nome:'Dra. Ivone', opiniao:3, memoria:'Você prometeu voltar pra contar. Ela anotou o seu nome com a data.'}}},
    {texto:'Sair sem prometer nada.', vai:'c4_museu_saiu'}
  ]
},

c4_ivone_pedido:{
  texto:[
    '"O que a senhora quer de mim?"',
    '"Nada perigoso." Ela levanta as duas mãos. "Eu não sou doida de mandar um garoto de quinze anos enfrentar gente com serra."',
    'Ela tira do bolso do jaleco um cartão amassado. Não é cartão de visita profissional — é um pedaço de cartolina cortado à mão, com um número escrito à caneta.',
    '"Se você vir alguma coisa lá dentro — mesa, gerador, gaiola, buraco quadrado na parede — você me liga. Não liga pra Liga. Liga pra mim."',
    '"Qual a diferença?"',
    '"A Liga manda um oficial em dois dias." Ela põe o cartão na sua mão. "Eu chego em seis horas com imprensa."'
  ],
  ef:{flag:'cartao_ivone',
      npc:{nome:'Dra. Ivone', opiniao:4, memoria:'Te deu o número dela por causa do saque no Monte da Lua.'},
      registrar:'Dra. Ivone te deu o número dela. Ligar para ela, não para a Liga.',
      presagio:'Um pedaço de cartolina com um número. Vai amassar no bolso até você precisar dele.'},
  escolhas:[
    {texto:'Guardar o cartão. "Se eu vir, eu ligo."', vai:'c4_ivone_aceitou'},
    {texto:'Guardar o cartão sem prometer nada.', vai:'c4_museu_saiu'},
    {texto:'"E se eu vir e não ligar?"', vai:'c4_ivone_e_se'},
    {texto:'Devolver o cartão.', vai:'c4_ivone_recusa'}
  ]
},

c4_ivone_aceitou:{
  texto:[
    '"Se eu vir, eu ligo."',
    'Ela não agradece. Faz que sim uma vez e volta pro caderno, e demora um segundo pra você entender que ela está te dando privacidade pra ir embora.',
    'Na porta da segunda sala, ela fala mais uma coisa sem levantar a cabeça:',
    '"Se tiver gente lá dentro, você não entra. Você anda pra trás até pegar sinal. Isso é a parte importante e é a que todo mundo esquece."'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Assumiu um compromisso com alguém que não tinha a quem pedir'}},
  escolhas:[
    {texto:'"Combinado."', vai:'c4_museu_saiu'},
    {texto:'Perguntar do balde e do museu antes de sair.', vai:'c4_funcionario'},
    {texto:'Ficar mais um pouco olhando o Kabutops.', vai:'c4_kabutops_2'}
  ]
},

c4_ivone_e_se:{
  texto:[
    '"E se eu vir e não ligar?"',
    'Ela não se ofende. Pelo contrário: relaxa um pouco, como se a pergunta fosse um alívio.',
    '"Aí você não liga." Ela dá de ombros. "Você não me deve nada. Eu te abordei num museu."',
    'Ela fecha a caneta.',
    '"Só não inventa uma justificativa boa depois. Isso é o que estraga as pessoas. Não é o não ligar — é a história que a gente conta sobre o não ligar."'
  ],
  ef:{flag:'aviso_da_justificativa',
      presagio:'Você vai se pegar montando uma justificativa boa, em algum lugar, e vai reconhecer o que está fazendo no meio da frase.'},
  escolhas:[
    {texto:'Guardar o cartão. "Se eu vir, eu ligo."', vai:'c4_ivone_aceitou'},
    {texto:'Guardar o cartão calado.', vai:'c4_museu_saiu'},
    {texto:'Devolver o cartão.', vai:'c4_ivone_recusa'}
  ]
},

c4_ivone_recusa:{
  texto:[
    'Você devolve o cartão. Ou nem chega a pegar.',
    'Ela guarda no bolso do jaleco sem nenhum drama, do jeito de quem já guardou esse cartão de volta várias vezes.',
    '"Tudo bem."',
    'E é isso. Ela não insiste, não apela, não faz cara. Volta pro caderno.',
    'Você sai do museu com uma sensação irritante de ter feito a coisa razoável.'
  ],
  ef:{flag:'recusou_ivone',
      npc:{nome:'Dra. Ivone', opiniao:-1, memoria:'Você recusou o cartão dela no museu de Pewter.'},
      presagio:'Você vai descer numa caverna sem o número de ninguém no bolso.'},
  escolhas:[
    {texto:'Sair do museu.', vai:'c4_museu_saiu'},
    {texto:'Voltar atrás e pegar o cartão.', vai:'c4_ivone_pedido'},
    {texto:'Procurar o funcionário antes de sair.', vai:'c4_funcionario'}
  ]
},

c4_kabutops_2:{
  texto:[
    'Você fica mais um pouco.',
    'Ivone volta a anotar. Em algum momento ela fala, sem olhar pra você, no tom de quem não está conversando:',
    '"Kabutops era predador. Rápido, litoral raso, provavelmente em grupo." Uma pausa. "E mesmo assim acabou. Não por ser fraco."',
    '"Por quê, então?"',
    '"Porque o mundo mudou mais rápido do que ele." Ela vira a página. "É sempre isso. Nunca é o predador que mata o predador."'
  ],
  ef:{flag:'licao_do_kabutops', presagio:'Guarda essa frase. Ela vai ser dita de novo, por alguém muito pior, com um sorriso.'},
  escolhas:[
    {texto:'Procurar o funcionário.', vai:'c4_funcionario'},
    {texto:'Sair do museu.', vai:'c4_museu_saiu'}
  ]
},

c4_funcionario:{
  texto:[
    'O funcionário do museu é também o bilheteiro, o segurança e o faxineiro. Ele se chama Delmo e tem cinquenta e poucos anos.',
    'Você pergunta do balde.',
    '"Ah, o balde." Ele nem parece constrangido. "Telhado. Desde a chuva de abril."',
    '"E ninguém conserta?"',
    '"O orçamento do museu é municipal e o município tem uma pedreira que emprega quatrocentas pessoas." Ele fala isso sem amargura, como quem explica aritmética. "Quando é escolher entre telhado de museu e asfalto de rua de pedreira, o museu perde. E deve perder mesmo."',
    'Ele olha pra segunda sala.',
    '"Mas vai chegar uma hora que a água vai passar do balde."'
  ],
  ef:{npc:{nome:'Delmo', opiniao:1, memoria:'O funcionário único do museu de Pewter. Te explicou o balde.'}},
  escolhas:[
    {texto:'Doar dinheiro pro museu. (1.500 ₽)', vai:'c4_doou', cond:d=>d.jogador.dinheiro>=1500,
     ef:{dinheiro:-1500, rep:{eixo:'bom',delta:2,motivo:'Doou parte do que tinha para um museu que vaza'},
         flag:'doou_museu', npc:{nome:'Delmo', opiniao:6, memoria:'Você doou dinheiro pro museu. Ele colou o recibo na parede da bilheteria.'}}},
    {texto:'"Posso subir e olhar o telhado?"', vai:'c4_telhado'},
    {texto:'"E se alguém oferecesse dinheiro pelo Kabutops?"', vai:'c4_delmo_oferta'},
    {texto:'Agradecer e sair.', vai:'c4_museu_saiu'}
  ]
},

c4_doou:{
  texto:[
    'Você tira o dinheiro da mochila e conta na frente dele, e a contagem demora porque você para no meio pra repensar e depois continua.',
    'Delmo olha o maço como se fosse uma pegadinha.',
    '"Isso é muito."',
    '"É o que dá."',
    'Ele preenche um recibo à mão, em duas vias, com carimbo e tudo. Faz isso com uma solenidade absurda, e no fim carimba duas vezes porque o primeiro saiu borrado.',
    'Quando você olha pra trás, saindo, ele está colando a segunda via na parede atrás da bilheteria.'
  ],
  ef:{presagio:'Existe agora, numa parede de Pewter, um papel com o seu nome que ninguém vai tirar tão cedo.'},
  escolhas:[
    {texto:'Sair do museu.', vai:'c4_museu_saiu'},
    {texto:'Voltar e falar com a Dra. Ivone.', vai:'c4_ivone'},
    {texto:'Ficar mais um pouco com o Kabutops.', vai:'c4_kabutops_2'}
  ]
},

c4_telhado:{
  texto:[
    '"Posso subir e olhar o telhado?"',
    'Delmo pensa por dois segundos e decide que sim, porque num museu com uma sala e um balde, por que não.',
    'A escada dos fundos é de ferro e balança. Lá em cima, o telhado é de telha francesa velha, e o problema é óbvio até pra você: uma calha entupida de folha há tanto tempo que virou terra, e a terra virou planta.',
    'Tem uma plantinha de uns vinte centímetros crescendo na calha do museu de Pewter.',
    'Dá pra limpar. Vai sujar sua roupa inteira e vai levar uma hora.'
  ],
  escolhas:[
    {texto:'Limpar a calha.', vai:'c4_limpou_calha'},
    {texto:'Descer e avisar o que é.', vai:'c4_avisou_calha'},
    {texto:'Descer e não falar nada.', vai:'c4_museu_saiu'},
    {texto:'Limpar a calha e não contar pra ninguém.', vai:'c4_limpou_calado'}
  ]
},

c4_limpou_calha:{
  texto:[
    'Uma hora e dez. A terra da calha sai em placas, como torrão, e embaixo tem uma camada preta de folha apodrecida que cheira a coisa morta.',
    'Delmo sobe na metade e ajuda sem falar nada, e vocês dois ficam ali em cima na luz do fim da tarde arrancando dez anos de abandono de uma calha de ferro.',
    'No fim, ele joga um balde de água pra testar. A água corre. Corre inteira, até o cano, e desce.',
    'Delmo olha a água correndo por muito mais tempo do que o necessário.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Passou a tarde limpando a calha de um museu falido'},
      hp:-2, causa:'Trabalho no telhado do museu',
      flag:'limpou_calha_museu',
      npc:{nome:'Delmo', opiniao:7, memoria:'Você subiu no telhado e limpou a calha do museu com ele. Ele conta isso pra todo mundo que compra ingresso.'},
      itens:{'Super Potion':1}},
  escolhas:[
    {texto:'Descer e ir embora.', vai:'c4_museu_saiu'},
    {texto:'Falar com a Dra. Ivone antes de sair.', vai:'c4_ivone'},
    {texto:'"O balde pode sair?"', vai:'c4_balde'}
  ]
},

c4_limpou_calado:{
  texto:[
    'Você limpa a calha inteira e desce pela escada dos fundos sem passar pela bilheteria.',
    'Sai pela lateral. Ninguém vê.',
    'Sua roupa está destruída e você não tem nenhuma prova de nada, e é exatamente por isso que a coisa é limpa de um jeito que quase nada é.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Consertou uma coisa sem que ninguém soubesse'},
      hp:-2, causa:'Trabalho no telhado do museu',
      flag:['limpou_calha_museu','limpou_calha_anonimo'],
      presagio:'Ninguém viu. Isso conta de um jeito diferente, e conta mais.'},
  escolhas:[
    {texto:'Ir andar pela rua.', vai:'c4_rua2'},
    {texto:'Ir pra pedreira.', vai:'c4_pedreira_caminho'},
    {texto:'Voltar pro Centro.', vai:'c4_fim'}
  ]
},

c4_avisou_calha:{
  texto:[
    'Você desce e explica: não é telha quebrada, é calha entupida, tem planta nascendo lá em cima.',
    'Delmo escuta com atenção total e no fim diz:',
    '"Eu sei."',
    'Uma pausa desconfortável.',
    '"Eu tenho cinquenta e sete anos e um joelho que não sobe escada de ferro, moço. Eu sei faz três anos."'
  ],
  escolhas:[
    {texto:'"Então eu limpo."', vai:'c4_limpou_calha'},
    {texto:'"Desculpa." E sair.', vai:'c4_museu_saiu'},
    {texto:'Doar dinheiro pra contratar alguém. (1.500 ₽)', vai:'c4_doou', cond:d=>d.jogador.dinheiro>=1500,
     ef:{dinheiro:-1500, rep:{eixo:'bom',delta:2,motivo:'Doou para o museu de Pewter'}, flag:'doou_museu'}}
  ]
},

c4_balde:{
  texto:[
    '"O balde pode sair?"',
    'Delmo olha o balde. Pensa. Pega o balde, esvazia numa pia, e leva pro almoxarifado.',
    'Volta com o balde na mão vazia e não sabe onde colocar, então põe no chão do almoxarifado, e fecha a porta, e fica olhando a porta fechada.',
    '"Doze anos", ele diz. "Doze anos que esse balde tava naquele canto."'
  ],
  ef:{npc:{nome:'Delmo', opiniao:3, memoria:'Guardou o balde do museu depois que você limpou a calha.'}},
  escolhas:[
    {texto:'Sair do museu.', vai:'c4_museu_saiu'},
    {texto:'Falar com a Dra. Ivone.', vai:'c4_ivone'}
  ]
},

c4_delmo_oferta:{
  texto:[
    '"E se alguém oferecesse dinheiro pelo Kabutops?"',
    'Delmo para de arrumar os panfletos.',
    '"Ofereceram."',
    'Ele diz isso do jeito de quem não ia contar e contou porque a pergunta chegou primeiro.',
    '"Duas vezes esse ano. Gente de terno, educada. Falaram em empréstimo pra exposição itinerante. Falaram em restauro patrocinado."',
    '"E?"',
    '"E a prefeitura ia aceitar." Ele volta aos panfletos. "Foi a doutora que travou. Ela apareceu na câmara com um calhamaço e fez um barraco. Por isso demitiram ela."'
  ],
  ef:{flag:'ivone_foi_demitida', registrar:'Ivone foi demitida do museu por barrar a "cessão" do Kabutops.',
      npc:{nome:'Dra. Ivone', opiniao:1, memoria:'Você descobriu por que ela foi demitida.'}},
  escolhas:[
    {texto:'Voltar e falar com ela sobre isso.', vai:'c4_ivone_demitida'},
    {texto:'"Quem era a gente de terno?"', vai:'c4_delmo_terno'},
    {texto:'Doar dinheiro pro museu. (1.500 ₽)', vai:'c4_doou', cond:d=>d.jogador.dinheiro>=1500,
     ef:{dinheiro:-1500, flag:'doou_museu', rep:{eixo:'bom',delta:2,motivo:'Doou para o museu de Pewter'}}},
    {texto:'Sair.', vai:'c4_museu_saiu'}
  ]
},

c4_delmo_terno:{
  texto:[
    '"Quem era a gente de terno?"',
    '"Fundação alguma coisa." Delmo faz um gesto vago. "Tinha um nome comprido. Preservação de não sei o quê, patrimônio de não sei o quê."',
    'Ele procura embaixo do balcão e acha um envelope pardo, e dentro dele um folheto em papel bom, brilhante, com foto aérea de um prédio branco.',
    'Você lê o rodapé. É um nome longo e sério e completamente esquecível, e um brasão pequeno com uma balança.',
    'Você não faz ideia do que é isso. Guarda mesmo assim.'
  ],
  ef:{flag:'folheto_comissao', registrar:'Guardou um folheto de uma "fundação" que quis levar o Kabutops.',
      presagio:'Você vai ver esse brasão de novo. Não em folheto.'},
  escolhas:[
    {texto:'Voltar e mostrar pra Ivone.', vai:'c4_ivone_folheto'},
    {texto:'Guardar e sair.', vai:'c4_museu_saiu'},
    {texto:'Doar dinheiro pro museu. (1.500 ₽)', vai:'c4_doou', cond:d=>d.jogador.dinheiro>=1500,
     ef:{dinheiro:-1500, flag:'doou_museu', rep:{eixo:'bom',delta:2,motivo:'Doou para o museu de Pewter'}}}
  ]
},

c4_ivone_folheto:{
  texto:[
    'Você mostra o folheto pra ela.',
    'A cara dela muda. Não muito — ela é de não mudar muito — mas muda.',
    '"Onde você achou isso?"',
    '"Debaixo do balcão."',
    'Ela lê o rodapé inteiro, duas vezes, e depois devolve com uma delicadeza exagerada, como quem devolve uma coisa que preferia queimar.',
    '"Guarda." Ela fala baixo. "E não mostra pra funcionário de Liga."',
    '"Por quê?"',
    '"Porque eu não sei ainda." Ela fecha o caderno. "E porque as duas vezes em que eu mostrei uma coisa dessas pra alguém de crachá, a coisa sumiu da minha mesa na semana seguinte."'
  ],
  ef:{flag:'ivone_viu_folheto', npc:{nome:'Dra. Ivone', opiniao:3, memoria:'Você mostrou o folheto da fundação pra ela. Ela mandou guardar e não mostrar pra Liga.'},
      presagio:'Existe uma coisa em Kanto com papel bom, brasão e advogado, e ela ainda não tem nome na sua cabeça.'},
  escolhas:[
    {texto:'"Me dá o número da gaveta."', vai:'c4_ivone_gaveta'},
    {texto:'"O que a senhora quer de mim?"', vai:'c4_ivone_pedido'},
    {texto:'Sair do museu.', vai:'c4_museu_saiu'}
  ]
},

c4_ivone_demitida:{
  texto:[
    'Você volta na segunda sala.',
    '"O senhor Delmo me contou por que a senhora foi demitida."',
    'Ela não para de escrever.',
    '"Ele fala demais."',
    '"A senhora fez barraco na câmara municipal."',
    '"Eu fiz um barraco esplêndido", ela corrige, com um certo orgulho. "Eu levei um calhamaço de cento e dez páginas e li em voz alta até o presidente da mesa pedir pra polícia me tirar. Foi o melhor dia dos últimos dois anos."',
    'Aí ela para de escrever.',
    '"E não adiantou nada, porque eles voltam. Gente assim não desiste, entende? Gente assim só espera."'
  ],
  ef:{npc:{nome:'Dra. Ivone', opiniao:3, memoria:'Te contou do barraco na câmara e de que "gente assim só espera".'},
      presagio:'Gente assim só espera. Você vai lembrar disso num prédio de escritório, numa segunda-feira, às dez da manhã.'},
  escolhas:[
    {texto:'"O que a senhora quer de mim?"', vai:'c4_ivone_pedido'},
    {texto:'"Me dá o número da gaveta."', vai:'c4_ivone_gaveta'},
    {texto:'Sair do museu.', vai:'c4_museu_saiu'}
  ]
},

c4_museu_saiu:{
  texto:[
    'Você sai do museu. A porta de vidro tem uma rachadura consertada com fita, e a fita é antiga o suficiente pra ter amarelado.',
    'Lá fora ainda é dia, mas é aquele fim de dia de cidade alta em que a luz vira laranja de repente e tudo fica bonito por doze minutos.',
    'Longe, a detonação.'
  ],
  escolhas:[
    {texto:'Ir pra pedreira.', vai:'c4_pedreira_caminho'},
    {texto:'Ir olhar a porta de metal no fim da rua.', vai:'c4_porta_metal'},
    {texto:'Ir falar com Téo.', vai:'c4_teo', cond:d=>!!d.npcs['Téo'] && !d.flags.teo_em_pewter},
    {texto:'Chega. Voltar pro Centro.', vai:'c4_fim'}
  ]
},

/* ─────────────── PEDREIRA ─────────────── */

c4_pedreira_caminho:{
  texto:[
    'A pedreira fica a quarenta minutos a pé, subindo. A estrada é larga e destruída por caminhão.',
    'Na metade do caminho você para porque a estrada abre e você vê.',
    'É um buraco. Um buraco na montanha do tamanho de um bairro, com degraus gigantes descendo em espiral, e lá no fundo, minúsculos, caminhões do tamanho de caminhões que daqui parecem de brinquedo.',
    'Não é feio. É a coisa mais impressionante que você viu na vida e ao mesmo tempo é um buraco onde antes tinha montanha.'
  ],
  ef:{registrar:'Subiu até a pedreira de Pewter.'},
  escolhas:[
    {texto:'Descer até o portão.', vai:'c4_pedreira_portao'},
    {texto:'Ficar aqui em cima olhando.', vai:'c4_pedreira_mirante'},
    {texto:'Contornar pela borda, por fora da estrada.', vai:'c4_pedreira_borda'},
    {texto:'Voltar pra cidade.', vai:'c4_rua2'}
  ]
},

c4_pedreira_mirante:{
  texto:[
    'Você senta na mureta de contenção e fica.',
    'Dá pra ver o ciclo inteiro daqui: a perfuratriz, o caminhão que recua, a sirene, a pausa, a detonação, a poeira que sobe e leva um minuto e meio pra assentar, e a escavadeira que entra antes da poeira assentar.',
    'Repete. Repete de novo.',
    'Em algum lugar nesse buraco tem quatrocentas pessoas, e daqui você não consegue ver nenhuma.',
    d=>d.flags.sabe_do_nilo ? 'Uma delas é o Nilo, que fica no rádio, e que você não vai reconhecer nem se passar do lado.' : ''
  ],
  escolhas:[
    {texto:'Descer até o portão.', vai:'c4_pedreira_portao'},
    {texto:'Contornar pela borda.', vai:'c4_pedreira_borda'},
    {texto:'Voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Ficar até a próxima detonação.', vai:'c4_pedreira_detonacao'}
  ]
},

c4_pedreira_detonacao:{
  texto:[
    'A sirene toca três vezes com intervalo longo. Todo movimento no fundo do buraco para de uma vez, como se alguém tivesse desligado.',
    'Silêncio de uns quarenta segundos. É o silêncio mais completo que você já ouviu num lugar com quatrocentas pessoas.',
    'E então o chão bate em você pelos pés antes do som chegar no ouvido.',
    'A poeira sobe em cúpula. E de dentro da poeira, num susto que você não esperava, sai uma revoada — dezenas de coisas voando, Zubat e Golbat e o que mais morava naquela parede, saindo em pânico do lugar onde estavam dormindo.',
    'Eles fazem isso a cada vinte minutos, o dia inteiro, todos os dias.'
  ],
  ef:{flag:'viu_a_revoada', presagio:'Uma parede de pedra a menos por dia. Alguma coisa mora ali dentro, e a conta vai chegar.'},
  escolhas:[
    {texto:'Descer até o portão e perguntar sobre isso.', vai:'c4_pedreira_portao'},
    {texto:'Contornar pela borda pra ver onde eles vão.', vai:'c4_pedreira_borda'},
    {texto:'Voltar pra cidade.', vai:'c4_rua2'}
  ]
},

c4_pedreira_borda:{
  texto:[
    'Você sai da estrada e contorna a borda do buraco por fora, por uma trilha de bicho que claramente já foi usada por gente.',
    'Depois de quinze minutos, você entende por quê: tem uma fenda na rocha, do lado de fora da cerca, e ela é funda.',
    'Do lado de dentro dela tem barulho. Muito barulho, de coisa pequena e de muitas.',
    'E tem marca de bota na terra, fresca, entrando e saindo. Alguém sabe dessa fenda.'
  ],
  ef:{flag:'achou_a_fenda', registrar:'Achou uma fenda fora da cerca da pedreira, com marca de bota fresca.'},
  escolhas:[
    {texto:'Entrar na fenda.', vai:'c4_fenda'},
    {texto:'Esperar escondido pra ver quem vem.', vai:'c4_fenda_espera'},
    {texto:'Voltar e contar no portão da pedreira.', vai:'c4_pedreira_portao', ef:{flag:'vai_contar_da_fenda'}},
    {texto:'Marcar o lugar na cabeça e ir embora.', vai:'c4_rua2'}
  ]
},

c4_fenda:{
  texto:[
    'A fenda é estreita nos primeiros três metros e depois abre.',
    'Lá dentro é uma câmara natural do tamanho de uma sala, e o teto é vivo. Zubat. Centenas. Eles não atacam — eles se apertam mais uns nos outros quando a sua luz passa.',
    'No chão, embaixo deles, tem quatro armadilhas. Gaiola de arame com gatilho de chapa, do tipo que se compra pronta.',
    'Duas estão vazias. Uma tem um Zubat morto. A outra tem um Zubat vivo, que para de se debater quando você chega perto, o que é pior do que se continuasse.'
  ],
  ef:{registrar:'Encontrou armadilhas dentro da fenda da pedreira.'},
  escolhas:[
    {texto:'Abrir a gaiola e soltar.', vai:'c4_soltou_zubat',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Soltou um Pokémon preso em armadilha'}, flag:'soltou_zubat'}},
    {texto:'Destruir as quatro armadilhas.', vai:'c4_destruiu_armadilhas'},
    {texto:'Deixar como está e esperar o dono aparecer.', vai:'c4_fenda_espera'},
    {texto:'Sair. Isso não é seu problema.', vai:'c4_fenda_saiu'}
  ]
},

c4_soltou_zubat:{
  texto:[
    'A gaiola abre por um gatilho simples que você entende em cinco segundos, e isso te deixa com raiva: é uma coisa barata e fácil.',
    'O Zubat não sai. Fica no canto da gaiola aberta por um tempo longo demais.',
    'Depois sai, e sobe, e some no teto vivo, e você não consegue mais distinguir ele dos outros, e por algum motivo isso é a parte boa.',
    'O da outra gaiola continua ali. Você tira ele e põe no chão de terra, no canto, porque não dá pra enterrar Zubat em rocha.'
  ],
  escolhas:[
    {texto:'Destruir as quatro armadilhas.', vai:'c4_destruiu_armadilhas'},
    {texto:'Esperar escondido pelo dono.', vai:'c4_fenda_espera'},
    {texto:'Sair e contar no portão da pedreira.', vai:'c4_pedreira_portao', ef:{flag:'vai_contar_da_fenda'}},
    {texto:'Sair e ir embora.', vai:'c4_fenda_saiu'}
  ]
},

c4_destruiu_armadilhas:{
  texto:[
    'Arame não quebra com a mão. Você descobre isso rápido e descobre também que pedra existe em abundância aqui.',
    'Leva vinte minutos. No fim, as quatro gaiolas são quatro coisas amassadas que não fecham mais, e as suas mãos estão cortadas em dois lugares.',
    'Você empilha os restos no meio da câmara, bem no meio, onde é impossível não ver.',
    'É um recado. Você nunca tinha deixado um recado desse tipo pra ninguém.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Destruiu armadilhas de captura na pedreira'},
      hp:-3, causa:'Cortes de arame na fenda da pedreira',
      flag:'destruiu_armadilhas_fenda',
      presagio:'Alguém vai voltar aqui e entender o recado. Recado tem resposta.'},
  escolhas:[
    {texto:'Esperar escondido pra ver a resposta.', vai:'c4_fenda_espera'},
    {texto:'Sair e contar no portão da pedreira.', vai:'c4_pedreira_portao', ef:{flag:'vai_contar_da_fenda'}},
    {texto:'Sair e ir embora.', vai:'c4_fenda_saiu'}
  ]
},

c4_fenda_espera:{
  texto:[
    'Você sai da fenda, sobe uns dez metros e senta atrás de uma pedra grande, de costas pro sol pra não brilhar nada em você.',
    'Espera uma hora e vinte. Fica com o pé dormente duas vezes.',
    'E aí vem.',
    'Não é ninguém sinistro. É um rapaz de uns dezenove anos, de uniforme da pedreira, com um saco de estopa dobrado no bolso de trás. Ele desce pela fenda assobiando.',
    'Doze segundos depois, ele para de assobiar.'
  ],
  ef:{flag:'viu_o_armadilheiro'},
  escolhas:[
    {texto:'Descer e encarar.', vai:'c4_encarou'},
    {texto:'Esperar ele sair e seguir ele.', vai:'c4_seguiu_rapaz'},
    {texto:'Ir embora agora, sem ser visto.', vai:'c4_fenda_saiu'},
    {texto:'Gritar da pedra, sem descer.', vai:'c4_gritou_pedra'}
  ]
},

c4_gritou_pedra:{
  texto:[
    '"EU VI AS GAIOLAS."',
    'A voz ecoa no buraco inteiro de um jeito ridículo e você se arrepende no meio da frase.',
    'O rapaz sai da fenda tão rápido que escorrega. Procura de onde veio a voz, olhando pra cima, com a mão fazendo sombra.',
    '"QUEM É?"',
    'Vocês dois ficam se gritando através de vinte metros de rocha por um tempo constrangedor. Ele não sobe. Você não desce.'
  ],
  escolhas:[
    {texto:'Descer e falar de perto.', vai:'c4_encarou'},
    {texto:'"EU VOLTO AMANHÃ." E ir embora.', vai:'c4_fenda_saiu',
     ef:{flag:'ameacou_voltar', rep:{eixo:'bom',delta:1,motivo:'Deu um aviso em vez de uma surra'}}},
    {texto:'Ficar calado e deixar ele ir embora assustado.', vai:'c4_fenda_saiu'}
  ]
},

c4_encarou:{
  texto:[
    'Você desce. Ele te vê chegando e não corre, o que diz alguma coisa sobre ele.',
    'De perto ele é mais novo do que parecia. Uniforme grande demais, cara de quem dorme pouco.',
    '"Você mexeu nas minhas coisa."',
    '"Mexi."',
    'Ele olha as gaiolas amassadas, ou a gaiola aberta, ou o que você tiver deixado. Depois olha o próprio pé.',
    '"É trinta paus por Zubat", ele diz. "Trinta paus. Vem um cara de Cerulean toda sexta."'
  ],
  ef:{npc:{nome:'Rapaz da fenda', opiniao:0, memoria:'Você o pegou pegando Zubat na fenda da pedreira. Ele vende a trinta por cabeça.'},
      flag:'sabe_do_comprador_sexta', registrar:'Alguém compra Zubat da fenda de Pewter toda sexta, a 30 por cabeça.'},
  escolhas:[
    {texto:'"Quem é o cara de Cerulean?"', vai:'c4_comprador'},
    {texto:'"Para com isso."', vai:'c4_mandou_parar'},
    {texto:'"Eu compro. Quanto tem?"', vai:'c4_comprou_zubat',
     ef:{rep:{eixo:'ruim',delta:1,motivo:'Entrou no mercado que queria acabar'}}},
    {texto:'Batalhar com ele.', vai:'c4_luta_rapaz'}
  ]
},

c4_comprador:{
  texto:[
    '"Quem é o cara de Cerulean?"',
    'O rapaz dá de ombros com a sinceridade de quem realmente não sabe e realmente não quis saber.',
    '"Sei lá. Ele tem uma van. Ele fala pouco." Pausa. "Ele paga em dinheiro e não pede nada assinado."',
    '"E pra que ele quer Zubat?"',
    '"Ele não quer Zubat." O rapaz fala isso como se fosse óbvio. "Ele quer qualquer coisa. Ele leva o que aparecer. Semana passada ele levou um Geodude com o braço quebrado."',
    'Ele chuta uma pedrinha.',
    '"Aí eu perguntei pra quê. Ele falou: pra pesquisa. E deu risada."'
  ],
  ef:{flag:'van_de_cerulean', registrar:'Uma van de Cerulean compra qualquer Pokémon, "pra pesquisa".',
      presagio:'"Pra pesquisa", e uma risada. Você vai descobrir do que era a risada.'},
  escolhas:[
    {texto:'"Para com isso."', vai:'c4_mandou_parar'},
    {texto:'"Me leva nele na sexta."', vai:'c4_sexta',
     ef:{flag:'combinou_sexta'}},
    {texto:'Batalhar com ele.', vai:'c4_luta_rapaz'},
    {texto:'Ir embora com essa informação.', vai:'c4_fenda_saiu'}
  ]
},

c4_mandou_parar:{
  texto:[
    '"Para com isso."',
    '"Tá." Na hora. Sem discutir.',
    'E aí, porque você fica calado, ele continua, e o que ele diz estraga o resto do seu dia:',
    '"Mas eu vou voltar. Não é ameaça não, é que eu vou voltar mesmo." Ele mostra o uniforme. "Eu ganho mil e cem por mês nesse buraco. Um Zubat é trinta. Dez Zubat é trezentos. Trezentos é a diferença entre a minha mãe tomar o remédio inteiro ou tomar metade."',
    'Ele espera você responder alguma coisa.',
    'Você não tem nenhuma resposta que caiba nisso.'
  ],
  ef:{flag:'a_mae_do_rapaz', presagio:'Não existe resposta boa pra essa frase, e você vai ouvir versões dela até o fim.'},
  escolhas:[
    {texto:'Dar dinheiro pra ele. (2.000 ₽)', vai:'c4_deu_dinheiro', cond:d=>d.jogador.dinheiro>=2000,
     ef:{dinheiro:-2000, rep:{eixo:'bom',delta:2,motivo:'Pagou a diferença de um estranho'},
         flag:'pagou_o_rapaz'}},
    {texto:'"Isso não justifica."', vai:'c4_nao_justifica'},
    {texto:'"Então vende o que já morreu e não põe mais armadilha."', vai:'c4_acordo_rapaz'},
    {texto:'Não dizer nada e ir embora.', vai:'c4_fenda_saiu'}
  ]
},

c4_deu_dinheiro:{
  texto:[
    'Você tira o dinheiro e entrega. Ele não pega na hora.',
    '"Isso é mais do que dez Zubat."',
    '"É."',
    '"Você tá comprando o quê?"',
    'É uma pergunta muito melhor do que você esperava dele, e você não tem resposta.',
    'Ele pega. Guarda no bolso da frente, não no de trás, que é onde se guarda o que importa.',
    '"Esse mês eu não ponho gaiola", ele diz. Não promete mais que isso, e é exatamente por não prometer mais que você acredita.'
  ],
  ef:{npc:{nome:'Rapaz da fenda', opiniao:5, memoria:'Você pagou o mês dele pra ele não pôr armadilha. Ele cumpriu.'},
      presagio:'Um mês. Você comprou um mês. O mês vai acabar.'},
  escolhas:[
    {texto:'"E no mês que vem?"', vai:'c4_mes_que_vem'},
    {texto:'Ir embora.', vai:'c4_fenda_saiu'},
    {texto:'"Me leva no cara da van na sexta."', vai:'c4_sexta', ef:{flag:'combinou_sexta'}}
  ]
},

c4_mes_que_vem:{
  texto:[
    '"E no mês que vem?"',
    'Ele ri. É a primeira vez que ele ri.',
    '"No mês que vem eu vou pôr gaiola, cara."',
    'Ele fala isso sem nenhuma culpa e sem nenhum desafio. É só informação.',
    '"A não ser que você apareça de novo. Aí a gente faz igual."'
  ],
  ef:{flag:'entendeu_o_ciclo'},
  escolhas:[
    {texto:'"Então eu apareço."', vai:'c4_fenda_saiu',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Prometeu voltar'}, flag:'promessa_ao_rapaz'}},
    {texto:'"Não dá pra fazer isso a vida inteira."', vai:'c4_nao_da'},
    {texto:'Ir embora sem responder.', vai:'c4_fenda_saiu'}
  ]
},

c4_nao_da:{
  texto:[
    '"Não dá pra fazer isso a vida inteira."',
    '"Não dá mesmo." Ele concorda com uma facilidade desanimadora. "Por isso é que não adianta."',
    'Ele guarda o saco de estopa no bolso de trás, vazio.',
    '"Cê é boa gente. Sério. Mas boa gente sozinha é só uma pessoa, e o cara da van é uma van."'
  ],
  ef:{flag:'boa_gente_sozinha', presagio:'Uma pessoa não é uma van. Você vai passar o resto dessa história tentando virar alguma outra coisa.'},
  escolhas:[
    {texto:'Ir embora.', vai:'c4_fenda_saiu'},
    {texto:'"Me leva no cara da van na sexta."', vai:'c4_sexta', ef:{flag:'combinou_sexta'}}
  ]
},

c4_nao_justifica:{
  texto:[
    '"Isso não justifica."',
    'Ele encara você por uns três segundos.',
    '"Não justifica mesmo", ele concorda. "Justificar é outra coisa. Isso aqui é só o que acontece."',
    'Ele pega o saco de estopa vazio e sobe pela fenda, passando do seu lado sem encostar.',
    'Na boca da fenda ele para.',
    '"Cê tem quantos anos?"',
    '"Quinze."',
    '"Pois é", ele diz, e vai embora, e essa é a coisa mais perto de um insulto que ele consegue.'
  ],
  ef:{flag:'discussao_com_o_rapaz'},
  escolhas:[
    {texto:'Ir atrás dele.', vai:'c4_atras_do_rapaz'},
    {texto:'Ir embora.', vai:'c4_fenda_saiu'},
    {texto:'Voltar e destruir as armadilhas.', vai:'c4_destruiu_armadilhas'}
  ]
},

c4_atras_do_rapaz:{
  texto:[
    'Você sobe atrás dele e alcança na estrada.',
    '"Pois é o quê?"',
    'Ele para, surpreso de verdade que você tenha vindo.',
    '"Pois é que você tem quinze anos e tá aqui em cima decidindo o que justifica." Ele não está sendo agressivo. É pior: ele está sendo paciente. "Daqui a cinco anos você vai ter uma conta pra pagar e a conta não vai te perguntar o que justifica."',
    '"E aí eu viro você?"',
    '"E aí você descobre." Ele ajeita o capacete. "Eu torço que não."'
  ],
  ef:{npc:{nome:'Rapaz da fenda', opiniao:2, memoria:'Vocês discutiram na estrada da pedreira. Ele torceu pra você não virar ele.'},
      presagio:'Ele torceu pra você não virar ele. A jornada inteira é sobre isso.'},
  escolhas:[
    {texto:'Dar dinheiro pra ele. (2.000 ₽)', vai:'c4_deu_dinheiro', cond:d=>d.jogador.dinheiro>=2000,
     ef:{dinheiro:-2000, rep:{eixo:'bom',delta:2,motivo:'Pagou a diferença de um estranho'}, flag:'pagou_o_rapaz'}},
    {texto:'Voltar e destruir as armadilhas.', vai:'c4_destruiu_armadilhas'},
    {texto:'Ir embora.', vai:'c4_fenda_saiu'}
  ]
},

c4_acordo_rapaz:{
  texto:[
    '"Então vende o que já morreu e não põe mais armadilha."',
    'Ele pensa nisso com uma seriedade que te pega de surpresa.',
    '"Ele não compra morto."',
    '"Então ele quer vivo."',
    '"Ele quer vivo." O rapaz coça a nuca. "Cara. Ele quer vivo e ele não quer bonito. Isso é ruim, né? Eu penso nisso."',
    'Vocês dois ficam ali na boca da fenda pensando na mesma coisa e sem coragem de dizer.'
  ],
  ef:{flag:'vivo_e_nao_bonito', registrar:'O comprador quer os Pokémon vivos e não se importa com o estado.',
      presagio:'Vivo e não bonito. Guarda isso. Vai fazer sentido numa sala com azulejo.'},
  escolhas:[
    {texto:'"Me leva nele na sexta."', vai:'c4_sexta', ef:{flag:'combinou_sexta'}},
    {texto:'"Para com isso." ', vai:'c4_mandou_parar'},
    {texto:'Ir embora.', vai:'c4_fenda_saiu'}
  ]
},

c4_sexta:{
  texto:[
    '"Me leva nele na sexta."',
    'O rapaz te olha com um pavor sincero.',
    '"Pra quê?"',
    '"Pra ver."',
    '"Cara, não." Ele balança a cabeça. "Você não entende. Eu levo o saco, ele pega o saco, ele me dá o dinheiro, e a gente não conversa. Se eu aparecer com gente, ele não aparece mais. E aí eu perdi trezentos por mês por causa da sua curiosidade."',
    'Ele pensa um pouco mais.',
    '"Mas eu posso te falar onde. Você faz o que quiser com isso. Eu não te falei nada."',
    'Ele diz o lugar: a estrada velha de Cerulean, depois da segunda ponte, sexta às cinco da manhã.'
  ],
  ef:{flag:'ponto_da_van', registrar:'Sexta, 5h, estrada velha de Cerulean depois da segunda ponte: o ponto da van.',
      presagio:'Você tem um lugar e um horário. Isso é o tipo de coisa que muda uma jornada.'},
  escolhas:[
    {texto:'"Valeu." Ir embora.', vai:'c4_fenda_saiu'},
    {texto:'"Para com as gaiolas mesmo assim."', vai:'c4_mandou_parar'},
    {texto:'Dar dinheiro pra ele. (2.000 ₽)', vai:'c4_deu_dinheiro', cond:d=>d.jogador.dinheiro>=2000,
     ef:{dinheiro:-2000, flag:'pagou_o_rapaz', rep:{eixo:'bom',delta:2,motivo:'Pagou a diferença de um estranho'}}}
  ]
},

c4_comprou_zubat:{
  texto:[
    '"Eu compro. Quanto tem?"',
    'O rapaz abre um sorriso de alívio tão grande que fica claro o quanto ele não queria discutir.',
    '"Tem um vivo. Trinta."',
    'Você paga. Ele te entrega a gaiola com uma delicadeza estranha, do jeito de quem entrega uma coisa que sabe que não devia ter.',
    'Você solta o Zubat lá mesmo. Ele sobe e some no teto.',
    'O rapaz te olha soltar trinta pokedólares no ar e não diz nada, e o que ele está pensando está escrito na testa dele: esse aqui vai voltar toda semana.'
  ],
  ef:{dinheiro:-30, flag:'comprou_pra_soltar',
      presagio:'Você acabou de criar um cliente. Pensa nisso antes de voltar na semana que vem.'},
  escolhas:[
    {texto:'"Quem é o cara de Cerulean?"', vai:'c4_comprador'},
    {texto:'"Para com isso."', vai:'c4_mandou_parar'},
    {texto:'Ir embora.', vai:'c4_fenda_saiu'}
  ]
},

c4_luta_rapaz:{
  texto:[
    '"Você mexeu nas minhas coisa."',
    '"Mexi."',
    'Ele solta a bola antes de terminar de falar, e o Geodude cai no chão da fenda com um baque.',
    '"Então resolve."'
  ],
  batalha:{dex:74, nivel:13, tipo:'treinador', treinador:'Rapaz da pedreira', fuga:false,
           vitoria:'c4_venceu_rapaz', derrota:'c4_perdeu_rapaz', gameover:'gameover'}
},

c4_venceu_rapaz:{
  texto:[
    'O Geodude cai e ele recolhe sem reclamar.',
    '"Pronto." Ele guarda a bola. "Você ganhou. E agora?"',
    'É a pergunta certa. Você ganhou uma batalha numa fenda e as gaiolas continuam existindo e o cara da van vem na sexta do mesmo jeito.',
    '"Cê ganhou de mim", ele repete, sem raiva nenhuma, quase didático. "Não ganhou do problema."'
  ],
  ef:{flag:'venceu_o_rapaz', dinheiro:200,
      npc:{nome:'Rapaz da fenda', opiniao:-1, memoria:'Você ganhou dele numa batalha na fenda e ele te perguntou de que adiantou.'}},
  escolhas:[
    {texto:'"Quem é o cara de Cerulean?"', vai:'c4_comprador'},
    {texto:'Dar dinheiro pra ele. (2.000 ₽)', vai:'c4_deu_dinheiro', cond:d=>d.jogador.dinheiro>=2000,
     ef:{dinheiro:-2000, flag:'pagou_o_rapaz', rep:{eixo:'bom',delta:2,motivo:'Pagou a diferença de um estranho'}}},
    {texto:'Destruir as armadilhas na frente dele.', vai:'c4_destruiu_armadilhas'},
    {texto:'Ir embora.', vai:'c4_fenda_saiu'}
  ]
},

c4_perdeu_rapaz:{
  texto:[
    'Você perde. Numa fenda, pra um rapaz de dezenove anos com um Geodude e nenhum treino.',
    'Ele não comemora. Recolhe o Geodude, pega o saco de estopa e olha pra você sentado na pedra.',
    '"Cê tá bem?"',
    'Você faz que sim.',
    '"Então fica quieto que eu vou trabalhar."',
    'E ele trabalha. Na sua frente. Você fica ali sentado até acabar, porque não tem mais nada a fazer, e isso é a pior parte do dia.'
  ],
  ef:{hp:-4, causa:'Derrota na fenda da pedreira', flag:'perdeu_na_fenda',
      presagio:'Você vai lembrar dessa sensação: assistir sentado. Vai fazer de tudo pra não sentir de novo.'},
  escolhas:[
    {texto:'"Quem é o cara de Cerulean?"', vai:'c4_comprador'},
    {texto:'Levantar e ir embora.', vai:'c4_fenda_saiu'}
  ]
},

c4_seguiu_rapaz:{
  texto:[
    'Você espera ele sair e segue de longe.',
    'Ele não vai pra lugar nenhum interessante: desce a estrada, entra pelo portão de funcionários da pedreira com o crachá, e vai trabalhar.',
    'Turno da tarde. Você fica na cerca vendo ele virar um ponto laranja de capacete no meio de outros trezentos pontos laranja de capacete.',
    'A revelação é essa: não tem organização, não tem chefe, não tem conspiração. Tem um cara que precisa de trezentos pokedólares e uma fenda que tem Zubat.'
  ],
  ef:{flag:'entendeu_a_fenda', presagio:'As coisas grandes e podres de Kanto quase sempre começam assim, com alguém precisando de trezentos pokedólares.'},
  escolhas:[
    {texto:'Entrar pelo portão e falar com alguém da empresa.', vai:'c4_pedreira_portao', ef:{flag:'vai_contar_da_fenda'}},
    {texto:'Voltar na fenda e destruir as armadilhas.', vai:'c4_destruiu_armadilhas'},
    {texto:'Voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Esperar ele sair do turno.', vai:'c4_encarou'}
  ]
},

c4_fenda_saiu:{
  texto:[
    'Você sai da fenda e a luz de fora dói um pouco.',
    'Daqui dá pra ver a cidade inteira lá embaixo, pequena e cinza e ordenada, com o museu de letras faltando e a praça com quatro bancos.',
    'A detonação das seis toca. A revoada sai da parede, gira, e volta a se acomodar em outro lugar da mesma pedreira.'
  ],
  escolhas:[
    {texto:'Descer até o portão da pedreira.', vai:'c4_pedreira_portao'},
    {texto:'Voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Voltar pro Centro e encerrar o dia.', vai:'c4_fim'}
  ]
},

c4_pedreira_portao:{
  texto:[
    'O portão da pedreira tem guarita, cancela e uma placa com o número de dias sem acidente. O número é 12.',
    'Alguém repintou o 12 por cima de um número maior. Dá pra ver o fantasma do número antigo embaixo.',
    'O guarda da guarita é um homem gordo e simpático com um ventilador de mesa apontado direto na cara.',
    '"Boa tarde. Visita? A gente não faz visita."'
  ],
  escolhas:[
    {texto:'Contar da fenda e das armadilhas.', vai:'c4_contou_fenda'},
    {texto:'"Eu tô procurando o Nilo."', vai:'c4_nilo', cond:d=>!!d.flags.sabe_do_nilo},
    {texto:'"O que aconteceu com o número antigo na placa?"', vai:'c4_placa'},
    {texto:'"Nada, obrigado." Voltar pra cidade.', vai:'c4_rua2'}
  ]
},

c4_placa:{
  texto:[
    '"O que aconteceu com o número antigo?"',
    'O guarda olha a placa como se nunca tivesse olhado.',
    '"Zerou."',
    '"Foi grave?"',
    'Ele desliga o ventilador, o que é o gesto mais sério que um homem naquela guarita consegue fazer.',
    '"Foi bicho." Ele olha pro buraco. "Detonou a bancada nova e saiu um monte de coisa de dentro. Um Golbat bateu na cara de um operador a sessenta por hora. Perdeu o olho."',
    '"E o Golbat?"',
    'O guarda te olha como se a pergunta fosse de outro planeta.',
    '"O Golbat morreu, moço. Bateu num capacete a sessenta por hora."'
  ],
  ef:{flag:'sabe_do_acidente', presagio:'Ninguém aqui é o vilão. É isso que vai ficar mais difícil de aceitar.'},
  escolhas:[
    {texto:'Contar da fenda e das armadilhas.', vai:'c4_contou_fenda'},
    {texto:'"Tem como avisar antes de detonar? Pros bichos, digo."', vai:'c4_sugestao'},
    {texto:'"Eu tô procurando o Nilo."', vai:'c4_nilo', cond:d=>!!d.flags.sabe_do_nilo},
    {texto:'Voltar pra cidade.', vai:'c4_rua2'}
  ]
},

c4_sugestao:{
  texto:[
    '"Tem como avisar antes de detonar? Pros bichos, digo."',
    'O guarda ri. Depois para de rir, porque percebe que você falou sério.',
    '"Avisar bicho."',
    '"A sirene toca três vezes e todo mundo sai. Se a sirene tocasse antes, uns vinte minutos antes, e alguém batesse na parede da bancada—"',
    '"Aí eles saem antes." Ele completa devagar. "E não saem todos juntos no susto."',
    'Ele coça o queixo.',
    '"Isso ia atrasar a operação em vinte minutos por detonação. São três detonação por turno." Ele faz a conta. "Uma hora por turno."',
    '"E um olho custa quanto?"',
    'Ele não responde. Mas ele anota alguma coisa num papel e enfia no bolso da camisa, e a anotação é sua.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Propôs uma solução em vez de uma acusação'},
      flag:'sugeriu_a_sirene',
      npc:{nome:'Guarda da pedreira', opiniao:4, memoria:'Você sugeriu tocar a sirene antes pra os Pokémon saírem. Ele anotou.'},
      presagio:'Um papel no bolso de uma camisa. É assim que quase todas as coisas boas começam, e quase nenhuma acaba.'},
  escolhas:[
    {texto:'Contar da fenda e das armadilhas.', vai:'c4_contou_fenda'},
    {texto:'"Eu tô procurando o Nilo."', vai:'c4_nilo', cond:d=>!!d.flags.sabe_do_nilo},
    {texto:'Voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Voltar pro Centro e encerrar o dia.', vai:'c4_fim'}
  ]
},

c4_contou_fenda:{
  texto:[
    'Você conta. A fenda por fora da cerca, as quatro gaiolas, o comprador de sexta.',
    'O guarda escuta tudo e a cara dele vai fechando, e no fim ele diz uma coisa que você não esperava:',
    '"Fora da cerca não é nosso."',
    '"Como assim?"',
    '"A cerca é o limite da concessão. Fora da cerca é área da prefeitura." Ele abre as mãos. "Eu não posso mandar ninguém lá. Eu posso registrar, e eu vou registrar, e o registro vai pra prefeitura, e a prefeitura tem dois fiscal pra cidade inteira."',
    'Ele já está preenchendo o formulário enquanto fala, o que de alguma forma torna tudo pior.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Reportou as armadilhas da fenda'},
      flag:'reportou_a_fenda',
      presagio:'Mais um papel, mais uma gaveta. Você está começando a mapear como Kanto perde as coisas.'},
  escolhas:[
    {texto:'"E se for funcionário de vocês?"', vai:'c4_funcionario_da_pedreira'},
    {texto:'"Tem como avisar antes de detonar? Pros bichos."', vai:'c4_sugestao'},
    {texto:'Agradecer e voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Voltar na fenda e resolver você mesmo.', vai:'c4_fenda'}
  ]
},

c4_funcionario_da_pedreira:{
  texto:[
    '"E se for funcionário de vocês?"',
    'A caneta para.',
    '"Aí é outra conversa." Ele olha pra você com atenção nova. "Aí é justa causa."',
    'Justa causa. Você entende o que isso quer dizer: o rapaz, os mil e cem por mês, a mãe, o remédio pela metade.',
    'O guarda espera. A caneta está parada em cima de um campo em branco do formulário.',
    '"Você viu quem era?"'
  ],
  ef:{flag:'pergunta_da_justa_causa'},
  escolhas:[
    {texto:'"Vi." Entregar.', vai:'c4_entregou_rapaz',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Entregou quem armava as gaiolas'},
         flag:'entregou_o_rapaz',
         npc:{nome:'Rapaz da fenda', opiniao:-8, memoria:'Você o entregou. Ele foi demitido por justa causa.'}}},
    {texto:'"Não vi."', vai:'c4_mentiu_guarda',
     ef:{flag:'protegeu_o_rapaz'}},
    {texto:'"Vi. E eu não vou falar."', vai:'c4_recusou_entregar',
     ef:{flag:'protegeu_o_rapaz', rep:{eixo:'bom',delta:1,motivo:'Recusou entregar alguém sem mentir sobre isso'}}},
    {texto:'"Vi. Mas antes: quanto vocês pagam?"', vai:'c4_quanto_pagam'}
  ]
},

c4_quanto_pagam:{
  texto:[
    '"Vi. Mas antes: quanto vocês pagam?"',
    'O guarda franze a testa.',
    '"Como assim quanto a gente paga?"',
    '"Salário. De quem trabalha aí embaixo."',
    'Ele olha pro buraco. Volta pra você. Larga a caneta.',
    '"Mil e cem", ele diz. "Mais insalubridade, que dá mais cento e oitenta."',
    'Ele entende exatamente o que você está fazendo e entende também que não tem como discordar.',
    '"Some esse formulário", ele diz, amassando. "Eu não vi você aqui hoje."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Fez a pergunta certa em vez de dar o nome certo'},
      flag:'protegeu_o_rapaz',
      npc:{nome:'Guarda da pedreira', opiniao:5, memoria:'Você perguntou quanto eles pagam antes de entregar alguém. Ele amassou o formulário.'},
      presagio:'Você aprendeu hoje que uma pergunta bem colocada faz mais estrago que uma acusação.'},
  escolhas:[
    {texto:'"Tem como avisar antes de detonar? Pros bichos."', vai:'c4_sugestao'},
    {texto:'Voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Voltar pro Centro e encerrar o dia.', vai:'c4_fim'}
  ]
},

c4_entregou_rapaz:{
  texto:[
    'Você descreve: dezenove anos mais ou menos, uniforme grande demais, turno da tarde, saco de estopa no bolso de trás.',
    'O guarda escreve tudo. Sabe de quem é antes de você terminar — dá pra ver no rosto dele, no jeito que ele para de escrever por meio segundo e continua.',
    '"Certo." Ele assina embaixo. "A gente resolve."',
    'Você sai. Na descida você pensa em vinte coisas e nenhuma delas melhora nada.',
    'Duas semanas depois, se alguém contasse pra você, você ficaria sabendo que ele foi demitido por justa causa e que a carteira dele tem uma anotação que vai impedir contratação em qualquer pedreira de Kanto.',
    'Ninguém vai te contar.'
  ],
  ef:{presagio:'Ninguém vai te contar. Isso é o que permite continuar.'},
  escolhas:[
    {texto:'Voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Voltar pro Centro e encerrar o dia.', vai:'c4_fim'}
  ]
},

c4_mentiu_guarda:{
  texto:[
    '"Não vi."',
    'O guarda te olha por um tempo que é longo demais pra ser confortável.',
    '"Tá bom."',
    'Ele preenche o resto do formulário com "autor desconhecido" e carimba.',
    'Ele sabe que você mentiu. Você sabe que ele sabe. Ele decide não fazer nada com isso, e é uma gentileza que você não pediu e não sabe se merece.'
  ],
  escolhas:[
    {texto:'"Tem como avisar antes de detonar? Pros bichos."', vai:'c4_sugestao'},
    {texto:'Voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Voltar pro Centro.', vai:'c4_fim'}
  ]
},

c4_recusou_entregar:{
  texto:[
    '"Vi. E eu não vou falar."',
    'O guarda pousa a caneta.',
    '"Por quê?"',
    '"Porque vocês pagam mil e cem."',
    'Silêncio na guarita. O ventilador continua.',
    '"Isso não é problema meu", ele diz, e é verdade, e ele não gosta que seja verdade.',
    'Ele escreve "autor não identificado" e carimba com mais força do que precisava.'
  ],
  ef:{npc:{nome:'Guarda da pedreira', opiniao:2, memoria:'Você se recusou a entregar o rapaz e disse o motivo na cara dele.'}},
  escolhas:[
    {texto:'"Tem como avisar antes de detonar? Pros bichos."', vai:'c4_sugestao'},
    {texto:'Voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Voltar pro Centro.', vai:'c4_fim'}
  ]
},

c4_nilo:{
  texto:[
    '"Eu tô procurando o Nilo."',
    '"Qual Nilo? Tem três."',
    '"O do rádio."',
    '"Ah, o Nilo do rádio." O guarda fala no rádio dele mesmo, duas frases em código, e espera.',
    'Cinco minutos depois aparece um homem de uns vinte e cinco anos com um capacete debaixo do braço e uma cara que é a cara da Sra. Ercília com vinte anos a menos e muito mais cansaço.',
    '"Pois não?"'
  ],
  ef:{npc:{nome:'Nilo', opiniao:0, memoria:'Você o chamou no portão da pedreira de Pewter.'}},
  escolhas:[
    {texto:'"Sua mãe dividiu um pastel comigo na praça."', vai:'c4_nilo_mae'},
    {texto:'"Nada. Confundi." E ir embora.', vai:'c4_pedreira_portao'},
    {texto:'Contar da fenda e das armadilhas pra ele.', vai:'c4_nilo_fenda'},
    {texto:'"Você era treinador?"', vai:'c4_nilo_treinador'}
  ]
},

c4_nilo_mae:{
  texto:[
    '"Sua mãe dividiu um pastel comigo na praça."',
    'O rosto dele muda de uma vez só e de um jeito que não dá pra descrever direito.',
    '"Ela tá bem?"',
    '"Tá. Ela falou pra eu não falar nada com você."',
    '"E você falou."',
    '"Falei."',
    'Nilo olha pro chão, pro capacete, pro portão. Depois ri uma risada curta e sem alegria nenhuma.',
    '"A gente se vê no domingo", ele diz. "A gente se vê todo domingo. Faz quatro anos que a gente almoça todo domingo e não fala nada."'
  ],
  ef:{flag:'falou_com_nilo', npc:{nome:'Nilo', opiniao:2, memoria:'Você contou que a mãe dele dividiu um pastel com você.'}},
  escolhas:[
    {texto:'"Por que vocês não falam nada?"', vai:'c4_nilo_domingo'},
    {texto:'"Você era treinador?"', vai:'c4_nilo_treinador'},
    {texto:'Não insistir. Mudar de assunto pra fenda.', vai:'c4_nilo_fenda'},
    {texto:'Se despedir e ir embora.', vai:'c4_rua2'}
  ]
},

c4_nilo_domingo:{
  texto:[
    '"Por que vocês não falam nada?"',
    'Ele demora.',
    '"Porque a primeira coisa que ela ia perguntar é se eu me arrependo." Ele bate o capacete na perna, duas vezes. "E eu não sei a resposta. Faz quatro anos que eu não sei a resposta."',
    '"Do que você ia se arrepender?"',
    '"De ter voltado." Ele fala isso rápido, como quem tira um esparadrapo. "Eu voltei porque meu pai morreu e alguém tinha que trabalhar. Isso é motivo bom. Motivo bom é a pior coisa que existe, moço, porque não dá pra brigar com ele."',
    'A sirene toca lá embaixo. Três vezes.',
    '"Tenho que voltar."'
  ],
  ef:{flag:'historia_do_nilo', npc:{nome:'Nilo', opiniao:4, memoria:'Te contou por que ele e a mãe não conversam no almoço de domingo.'},
      presagio:'Motivo bom é a pior coisa que existe. Você ainda não entende. Vai entender num porto, e depois numa sala com mesa comprida.'},
  escolhas:[
    {texto:'"Fala isso pra ela."', vai:'c4_nilo_conselho',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Empurrou duas pessoas de volta pra uma conversa'}}},
    {texto:'"Você era treinador?"', vai:'c4_nilo_treinador'},
    {texto:'Deixar ele voltar ao trabalho.', vai:'c4_rua2'}
  ]
},

c4_nilo_conselho:{
  texto:[
    '"Fala isso pra ela."',
    '"Falar o quê? Que eu não sei?"',
    '"Que você não sabe. É melhor que quatro anos de arroz com silêncio."',
    'Nilo põe o capacete. Aperta a jugular.',
    '"Você tem quantos anos?"',
    '"Quinze."',
    '"Meu Deus." Ele ri, dessa vez de verdade. "Tá certo. Domingo eu falo."',
    'Ele volta pro buraco. Você não vai ficar sabendo se ele falou.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Fez alguém prometer uma conversa difícil'},
      flag:'nilo_vai_falar',
      npc:{nome:'Nilo', opiniao:5, memoria:'Você mandou ele falar com a mãe. Ele disse que ia falar no domingo.'},
      presagio:'Você não vai ficar sabendo. Quase nada do que você faz de bom vai voltar como notícia.'},
  escolhas:[
    {texto:'Voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Voltar pro Centro e encerrar o dia.', vai:'c4_fim'}
  ]
},

c4_nilo_treinador:{
  texto:[
    '"Você era treinador?"',
    '"Fui." Ele diz isso sem nostalgia, o que é pior que nostalgia. "Cheguei em Celadon. Quatro insígnias."',
    '"Quatro é muito."',
    '"Quatro é nada." Ele ajeita o capacete debaixo do braço. "Eu tinha um Sandslash bom. Bom de verdade, cara. Ele tá ali no alojamento, dormindo, porque ele tem nove anos e o joelho dele não presta."',
    'Uma pausa.',
    '"Ele foi comigo até Celadon e voltou comigo pra cá, e eu acho que ele nunca entendeu por quê. Isso é o que me pega."'
  ],
  ef:{flag:'sandslash_do_nilo', npc:{nome:'Nilo', opiniao:3, memoria:'Te contou do Sandslash que voltou com ele e nunca entendeu por quê.'},
      presagio:'Os seus também não vão entender. Eles vão só ir junto.'},
  escolhas:[
    {texto:'"Sua mãe dividiu um pastel comigo na praça."', vai:'c4_nilo_mae'},
    {texto:'"Ele entendeu." ', vai:'c4_nilo_entendeu'},
    {texto:'Contar da fenda pra ele.', vai:'c4_nilo_fenda'},
    {texto:'Deixar ele voltar ao trabalho.', vai:'c4_rua2'}
  ]
},

c4_nilo_entendeu:{
  texto:[
    '"Ele entendeu."',
    'Nilo te olha.',
    '"Você não conhece meu Sandslash."',
    '"Não conheço. Mas ele voltou com você e ficou. Ele podia ter ido embora em qualquer um desses quatro anos."',
    'Nilo fica um tempo sem dizer nada.',
    '"É", ele fala por fim. "Ele podia."',
    'A sirene toca. Ele vai. Na metade do caminho ele levanta a mão sem virar, que é o jeito de agradecer de quem não agradece.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Disse a coisa certa pra um homem cansado'},
      npc:{nome:'Nilo', opiniao:4, memoria:'Você disse que o Sandslash dele entendeu. Ele levou isso pra casa.'},
      moral:5},
  escolhas:[
    {texto:'Voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Voltar pro Centro e encerrar o dia.', vai:'c4_fim'}
  ]
},

c4_nilo_fenda:{
  texto:[
    'Você conta da fenda. Nilo escuta com o capacete debaixo do braço e o queixo cada vez mais tenso.',
    '"Eu sei da fenda."',
    '"Sabe?"',
    '"Metade do turno da tarde sabe da fenda." Ele olha pros lados, e é um olhar de quem trabalha num lugar onde olhar pros lados é hábito. "Ninguém fala porque todo mundo entende."',
    'Ele bate o capacete na perna.',
    '"Mas eu vou falar com ele. Não com a empresa — com ele. Isso eu posso."'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Levou o problema a quem podia resolver sem destruir ninguém'},
      flag:'nilo_vai_falar_com_o_rapaz',
      npc:{nome:'Nilo', opiniao:3, memoria:'Você contou da fenda pra ele e ele disse que ia falar com o rapaz, não com a empresa.'},
      presagio:'Às vezes a solução é uma conversa entre duas pessoas que ninguém registra em formulário nenhum.'},
  escolhas:[
    {texto:'"Sua mãe dividiu um pastel comigo na praça."', vai:'c4_nilo_mae'},
    {texto:'"Você era treinador?"', vai:'c4_nilo_treinador'},
    {texto:'Voltar pra cidade.', vai:'c4_rua2'},
    {texto:'Voltar pro Centro e encerrar o dia.', vai:'c4_fim'}
  ]
},

/* ─────────────── FIM ─────────────── */

c4_fim:{
  texto:[
    'O Centro Pokémon de Pewter tem dez beliches e cheira a sabão. Você deita e o colchão é melhor do que você merece.',
    d=>{
      if (d.flags.entregou_o_rapaz) return 'Você fica acordado pensando num formulário assinado. Não é culpa, exatamente. É a sensação de ter acertado uma coisa e estragado outra na mesma frase.';
      if (d.flags.limpou_calha_anonimo) return 'Suas mãos ainda cheiram a folha podre. Ninguém sabe o que você fez hoje e isso te deixa numa paz esquisita.';
      if (d.flags.teo_ferido) return 'Téo está num dos outros beliches, de costas. Você sabe qual, porque você contou os beliches quando entrou.';
      if (d.flags.teo_assiste) return 'Téo está no beliche de baixo do outro lado, acordado, olhando o teto e fingindo que não está nervoso.';
      return 'Do outro lado do quarto, um treinador mais velho ronca com uma convicção impressionante.';
    },
    'Amanhã, a estrada pro Monte da Lua. Ela sobe por três horas e a boca da caverna dá pra ver de longe: um buraco preto numa parede cinza, com uma escada de madeira encostada do lado que ninguém sabe quem pôs.',
    d=>d.flags.cartao_ivone ? 'O cartão de cartolina está no bolso da frente da mochila, que é onde você guarda o que importa.' : 'Ninguém te deu número nenhum. Você vai entrar lá com o que tem.',
    'Pewter fica pra trás amanhã. A porta de metal no fim da rua não vai a lugar nenhum — ela não fecha, o homem lá dentro falou. Você volta quando tiver certeza.'
  ],
  fim:true, resumo:'Pewter: pedra, um museu que vaza e uma fenda fora da cerca.'
}
}}

);
