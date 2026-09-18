/* ============================================================
   CAPÍTULO 8 — TODO MUNDO PAGA PASSAGEM  (Vermilion / S.S. Anne)
   ============================================================ */
CAPITULOS.push(
{
num:8, titulo:'Todo Mundo Paga Passagem', local:'Vermilion / S.S. Anne', ambiente:'agua', nivelArea:30,
tom:'sombrio', inicio:'c8_chegada',
cenas:{

c8_chegada:{
  texto:[
    'Vermilion cheira a três coisas na mesma proporção: sal, óleo diesel e fritura.',
    'O porto trabalha vinte e quatro horas e o barulho não para nunca — guindaste, buzina de ré, corrente, metal em metal. Depois de duas horas você para de ouvir. Depois de seis, você vai reparar que parou de ouvir.',
    'A cidade é toda em declive até a água. De qualquer rua dá pra ver o mar no fim, e no mar tem navio.',
    'E tem o S.S. Anne.',
    'Ele está atracado no cais três e é grande de um jeito que fotografia não transmite: um prédio deitado na água, com janelas acesas em nove fileiras.',
    d=>{
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=5) return 'Um funcionário do cais te reconhece, cutuca o colega, e os dois discutem baixo se devem te chamar. Não chamam. Mas discutem, e você vê.';
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) return 'Dois seguranças mudam de posição quando você passa. Não é coincidência: eles se posicionam entre você e a passarela do cais três.';
      return 'Ninguém olha pra você duas vezes. Num porto, isso é um privilégio e você ainda não sabe disso.';
    }
  ],
  ef:{registrar:'Chegou ao porto de Vermilion.'},
  escolhas:[
    {texto:'Descer até o cais três e ver o navio de perto.', vai:'c8_cais'},
    {texto:'Andar pela cidade primeiro.', vai:'c8_cidade'},
    {texto:'Procurar onde se come nessa cidade.', vai:'c8_fritura'},
    {texto:'Sentar num banco e olhar o porto trabalhar.', vai:'c8_olhou_o_porto'}
  ]
},

c8_olhou_o_porto:{
  texto:[
    'Você senta na mureta de um canteiro e fica olhando.',
    'Um porto é a coisa mais organizada que você já viu. Tudo tem lugar, tudo tem ordem, tudo tem alguém apontando com uma prancheta.',
    'Um contêiner sai do navio, pousa num caminhão, o caminhão anda quarenta metros, para numa balança, e segue. Repete. Repete.',
    'Depois de quarenta minutos você entende a coisa mais importante do porto: ninguém abre nada.',
    'Nada é aberto. Nada é conferido por dentro. Tudo é conferido por número, por lacre e por peso.',
    d=>d.flags.conferem_por_numero
      ? 'Você já ouviu isso numa passarela de grade dentro de uma montanha. "Eles conferem por número, não por bicho."'
      : 'Você não sabe por que isso te incomoda tanto.'
  ],
  ef:{flag:'entendeu_o_porto',
      presagio:'Ninguém abre nada. Um porto inteiro funciona confiando num número e num lacre.'},
  escolhas:[
    {texto:'Descer até o cais três.', vai:'c8_cais'},
    {texto:'Ir falar com quem tem a prancheta.', vai:'c8_prancheta'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'},
    {texto:'Ir comer.', vai:'c8_fritura'}
  ]
},

c8_prancheta:{
  texto:[
    'O homem da prancheta tem uns quarenta anos e uma caneta amarrada com barbante na prancheta, porque caneta some.',
    '"Pois não."',
    '"Como funciona a conferência?"',
    'Ele te olha de cima a baixo e decide que você é curioso e não problema.',
    '"Lacre, número, peso." Ele mostra. "Se o lacre tá inteiro e o número bate e o peso tá dentro da margem, passa."',
    '"E se tiver coisa errada dentro?"',
    '"Aí é problema do destinatário."',
    'Ele já está olhando o próximo contêiner.',
    '"Eu confiro cento e oitenta por turno, garoto. Se eu abrisse um, eu atrasava o porto inteiro."'
  ],
  ef:{flag:'lacre_numero_peso',
      npc:{nome:'Conferente do porto', opiniao:1, memoria:'Te explicou que a conferência é por lacre, número e peso — nunca por dentro.'},
      presagio:'"Aí é problema do destinatário." A frase inteira desse sistema cabe nessas quatro palavras.'},
  escolhas:[
    {texto:'"E se o peso não bater?"', vai:'c8_peso'},
    {texto:'Descer até o cais três.', vai:'c8_cais'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'},
    {texto:'Agradecer e sair.', vai:'c8_fritura'}
  ]
},

c8_peso:{
  texto:[
    '"E se o peso não bater?"',
    '"Aí retém."',
    'Ele vira uma folha da prancheta.',
    '"Acontece umas três vezes por semana. Quase sempre é erro de digitação."',
    '"Quase sempre?"',
    'Ele para de escrever.',
    '"Ano passado reteve um que tava quarenta quilo mais leve que a nota." Ele coça a orelha com a caneta amarrada. "Aí veio um cara de terno com um papel e liberou em quarenta minuto."',
    '"Que papel?"',
    '"Papel." Ele dá de ombros. "Eu leio número, moço. Eu não leio papel."'
  ],
  ef:{flag:'papel_libera_carga', registrar:'No porto, um homem de terno já liberou carga retida com um papel em quarenta minutos.',
      presagio:'Um papel que libera quarenta quilos de diferença em quarenta minutos. Você conhece o cabeçalho.'},
  escolhas:[
    {texto:'"Que cara de terno? Você lembra?"', vai:'c8_lembra_do_terno'},
    {texto:'Descer até o cais três.', vai:'c8_cais'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'}
  ]
},

c8_lembra_do_terno:{
  texto:[
    '"Que cara de terno? Você lembra?"',
    '"Lembro do sapato."',
    'Ele ri de si mesmo.',
    '"Sério. Eu trabalho num porto há vinte e dois ano e eu reparo em sapato. Sapato limpo aqui é notícia."',
    d=>d.flags.sapato_limpo
      ? 'Você já ouviu isso, num chão de caverna, de um homem que limpava a mão no jeans.'
      : 'Você guarda isso sem saber por quê.',
    '"E o crachá dele não era do porto e não era de Liga." Ele volta pra prancheta. "Tinha um desenho de balança."'
  ],
  ef:{flag:['sapato_limpo','brasao_no_porto'],
      registrar:'O homem de terno que libera carga retida no porto usa crachá com uma balança.',
      presagio:'A balança tem acesso ao porto de Vermilion. Isso é outro patamar.'},
  escolhas:[
    {texto:'Descer até o cais três.', vai:'c8_cais'},
    {texto:'Andar pela cidade.', vai:'c8_cidade'},
    {texto:'Ir comer e pensar.', vai:'c8_fritura'}
  ]
},

c8_cidade:{
  texto:[
    'Vermilion acima do porto é uma cidade normal que finge não depender do porto.',
    'Tem praça com coreto, tem escola, tem farmácia. E tem, em cada duas quadras, um bar que abre às cinco da manhã pro turno da noite.',
    'Na rua paralela ao cais, um galpão baixo de manutenção portuária, reformado, com um cabo mais grosso que o seu braço saindo por baixo da porta e entrando numa caixa de passagem na calçada.',
    'De fora dá pra sentir cheiro de ozônio — aquele cheiro de depois de raio.',
    'Não tem placa. Tem uma marca de queimado no batente da porta, na altura do ombro.'
  ],
  ef:{executar:d=>{ Mundo.descobrir('ginasio_vermilion'); Mundo.descobrir('achou_ginasio_vermilion'); return [{tipo:'eco', texto:'Você vai lembrar desse galpão.'}]; }},
  escolhas:[
    {texto:'Chegar perto da porta do galpão.', vai:'c8_galpao'},
    {texto:'Entrar num dos bares que abrem às cinco.', vai:'c8_bar'},
    {texto:'Descer até o cais três.', vai:'c8_cais'},
    {texto:'Ir comer.', vai:'c8_fritura'}
  ]
},

c8_galpao:{
  texto:[
    'Você chega perto. O cabo entra na caixa de passagem da calçada e a tampa da caixa está quente.',
    'Lá dentro tem um zumbido constante, e de uns quarenta em quarenta segundos um estalo.',
    'A porta abre sozinha — não sozinha: alguém abre, de dentro, e sai um rapaz de uns dezoito anos com o cabelo em pé de um jeito que não é penteado.',
    'Ele te vê.',
    '"Tá aberto", ele diz. "Mas se você tá aqui por acaso, não entra."',
    '"Por quê?"',
    '"Porque quem entra por acaso apanha." Ele acende um cigarro com a mão tremendo um pouco. "Quem entra de propósito apanha também. Mas aí é escolha."'
  ],
  ef:{flag:'aviso_do_galpao',
      presagio:'Ele estava tremendo. Não era medo — era outra coisa, e passa em uns vinte minutos.'},
  escolhas:[
    {texto:'"Quem tá lá dentro?"', vai:'c8_quem_ta_dentro'},
    {texto:'Entrar de propósito.', vai:'c8_entrou_galpao'},
    {texto:'"Valeu." E ir pro cais.', vai:'c8_cais'},
    {texto:'Perguntar do cabo e da caixa de passagem.', vai:'c8_o_cabo'}
  ]
},

c8_quem_ta_dentro:{
  texto:[
    '"Quem tá lá dentro?"',
    '"O Surge."',
    'Ele fala o nome como quem fala de clima.',
    '"Ele foi militar. De verdade, não de história." O rapaz traga. "Não é ruim. É que ele acha que gentileza atrapalha o aprendizado."',
    '"E atrapalha?"',
    'O rapaz pensa nisso com uma seriedade genuína.',
    '"Eu vim aqui três vez. Na primeira eu chorei. Na segunda eu durei quatro turno." Ele joga o cigarro no chão e pisa. "Na terceira eu ganhei."',
    '"E o que mudou?"',
    '"Eu parei de tentar não apanhar."'
  ],
  ef:{flag:'sabe_do_surge',
      presagio:'"Eu parei de tentar não apanhar." Isso não é sabedoria. É uma coisa que fica na cabeça mesmo assim.'},
  escolhas:[
    {texto:'Entrar de propósito.', vai:'c8_entrou_galpao'},
    {texto:'Voltar outro dia.', vai:'c8_cais'},
    {texto:'Perguntar do cabo.', vai:'c8_o_cabo'},
    {texto:'Ir comer e pensar.', vai:'c8_fritura'}
  ]
},

c8_o_cabo:{
  texto:[
    '"Por que o cabo é tão grosso?"',
    'O rapaz olha o cabo como se nunca tivesse reparado.',
    '"Ah. É que o ginásio puxa da subestação do porto direto."',
    '"Isso pode?"',
    '"Pode não." Ele ri. "É gambiarra de trinta ano. Eles fizeram na época que o porto era do governo e ninguém desfez."',
    'Ele aponta a caixa de passagem.',
    '"Quando ele treina forte, a luz da rua pisca. Você vai ver. Todo mundo dessa quadra sabe a hora que tem desafio."'
  ],
  ef:{flag:'a_luz_pisca',
      presagio:'A luz da rua pisca quando ele treina. A cidade inteira sabe e ninguém reclama.'},
  escolhas:[
    {texto:'Entrar de propósito.', vai:'c8_entrou_galpao'},
    {texto:'Ir pro cais.', vai:'c8_cais'},
    {texto:'Ir comer.', vai:'c8_fritura'}
  ]
},

c8_entrou_galpao:{
  texto:[
    'Você empurra a porta.',
    'O chão do galpão é de concreto com pintura de quadra descascada e tem cheiro de ozônio de um jeito que dá gosto metálico na boca.',
    'No fundo, um homem enorme está prendendo um cabo num poste de aterramento com uma chave de fenda, agachado, de costas pra porta.',
    'Ele não vira.',
    '"Desafio é quinta e sexta, das duas às seis. Hoje não é nem um nem outro."',
    '"Como o senhor sabe que eu—"',
    '"Porque ninguém entra aqui por outro motivo." Ele aperta o parafuso. "Volta quinta. E vem com o time descansado, porque eu não pego leve e eu não vou pegar leve com você."'
  ],
  ef:{flag:'falou_com_surge',
      npc:{nome:'Líder Surge', opiniao:1, memoria:'Você entrou no galpão fora do horário. Ele te mandou voltar na quinta.'},
      executar:d=>{ Mundo.descobrir('ginasio_vermilion'); Mundo.descobrir('achou_ginasio_vermilion'); return []; },
      presagio:'Ele nem virou pra olhar. Você vai querer que ele vire, um dia.'},
  escolhas:[
    {texto:'"Por que o senhor não pega leve?"', vai:'c8_porque_nao_pega_leve'},
    {texto:'Sair e ir pro cais.', vai:'c8_cais'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'},
    {texto:'Ir comer.', vai:'c8_fritura'}
  ]
},

c8_porque_nao_pega_leve:{
  texto:[
    '"Por que o senhor não pega leve?"',
    'Aí ele vira.',
    'Ele tem uns quarenta e cinco anos e uma cicatriz que entra no cabelo acima da orelha esquerda.',
    '"Porque eu peguei leve uma vez."',
    'Ele volta pro aterramento.',
    '"Moleque de dezesseis. Eu vi que ele não tava pronto, eu segurei, ele ganhou a insígnia e saiu daqui feliz."',
    'Ele aperta o parafuso com mais força do que o parafuso precisa.',
    '"Ele foi pro Monte da Lua na semana seguinte."',
    'Ele não termina a frase. Não precisa.'
  ],
  ef:{flag:'a_historia_do_surge',
      npc:{nome:'Líder Surge', opiniao:2, memoria:'Te contou por que não pega leve: pegou leve uma vez, com um garoto de dezesseis.'},
      presagio:'Uma insígnia dada por gentileza matou alguém. É por isso que a sua vai custar caro.'},
  escolhas:[
    {texto:'"Isso não foi culpa sua."', vai:'c8_nao_foi_culpa'},
    {texto:'Ficar calado e sair.', vai:'c8_cais'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'},
    {texto:'"Eu volto na quinta."', vai:'c8_cais'}
  ]
},

c8_nao_foi_culpa:{
  texto:[
    '"Isso não foi culpa sua."',
    'Surge ri. É uma risada sem nada dentro.',
    '"Eu sei que não foi."',
    'Ele levanta. É muito maior de pé.',
    '"Isso é o tipo de coisa que todo mundo me fala e que é verdade e que não muda nada." Ele guarda a chave de fenda no bolso do macacão. "Eu não mudei porque me sinto culpado, garoto. Eu mudei porque funciona melhor."',
    'Ele pega uma toalha.',
    '"Todo moleque que sai daqui apanhado vai pro Monte da Lua sabendo que existe uma coisa maior que ele. Isso salva vida. Insígnia de graça não salva ninguém."'
  ],
  ef:{flag:'entendeu_o_surge',
      npc:{nome:'Líder Surge', opiniao:3, memoria:'Você disse que não foi culpa dele. Ele explicou que não muda por culpa, muda porque funciona.'},
      presagio:'"Existe uma coisa maior que você." Ele está falando de um Raichu. Você vai encontrar coisas bem maiores.'},
  escolhas:[
    {texto:'Sair e ir pro cais.', vai:'c8_cais'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'},
    {texto:'"E o navio? O senhor sabe do S.S. Anne?"', vai:'c8_surge_navio'}
  ]
},

c8_surge_navio:{
  texto:[
    '"O senhor sabe do S.S. Anne?"',
    'Surge para de enxugar a nuca.',
    '"Sei que ele atraca quatro vezes por ano e que a cidade fatura o ano inteiro nessas quatro semanas."',
    '"E?"',
    '"E que na semana que ele atraca, o número de ocorrência policial no porto cai quase a zero." Ele joga a toalha no ombro. "Isso não é porque melhora, garoto. É porque ninguém registra."',
    'Ele olha pra porta do galpão, pra rua em declive, pro mar no fim.',
    '"Eu fui militar. Eu sei como é lugar onde ninguém registra nada."'
  ],
  ef:{flag:'aviso_do_surge_sobre_o_navio',
      registrar:'Na semana em que o S.S. Anne atraca, as ocorrências policiais do porto caem a quase zero.',
      presagio:'Ninguém registra. Você vai entrar naquele navio sabendo disso.'},
  escolhas:[
    {texto:'Ir pro cais.', vai:'c8_cais'},
    {texto:'"O senhor já entrou nele?"', vai:'c8_surge_entrou'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'}
  ]
},

c8_surge_entrou:{
  texto:[
    '"O senhor já entrou nele?"',
    '"Uma vez. Convidado, de gravata, como líder de ginásio."',
    'Ele faz uma careta com a palavra gravata.',
    '"Fiquei quarenta minutos e desci."',
    '"Por quê?"',
    '"Porque tinha um sujeito no salão explicando pra uma roda de gente, com taça na mão, que existe um jeito certo e um jeito errado de ser dono de um bicho."',
    'Ele pendura a toalha num gancho.',
    '"E todo mundo tava concordando."'
  ],
  ef:{flag:'o_sujeito_do_salao',
      presagio:'Um jeito certo e um jeito errado de ser dono de um bicho. E todo mundo concordando, com taça na mão.'},
  escolhas:[
    {texto:'Ir pro cais.', vai:'c8_cais'},
    {texto:'"Quem era o sujeito?"', vai:'c8_quem_era_o_sujeito'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'}
  ]
},

c8_quem_era_o_sujeito:{
  texto:[
    '"Quem era o sujeito?"',
    '"Não sei o nome." Surge dá de ombros. "Sei que ele volta todo ano. Camarote de cima."',
    'Ele pega a chave de fenda de novo.',
    '"E sei que ele é educado do jeito que assusta. Aquele educado que não é pra ser gentil, é pra deixar claro que ele não precisa levantar a voz."',
    'Ele volta pro aterramento.',
    '"Eu conheci oficial assim. Os que levantam a voz você aprende a lidar. Os que não levantam, não."'
  ],
  ef:{flag:'o_homem_do_camarote', registrar:'Um homem de camarote superior volta ao S.S. Anne todo ano.',
      presagio:'Educado do jeito que assusta. Camarote de cima. Todo ano.'},
  escolhas:[
    {texto:'Ir pro cais.', vai:'c8_cais'},
    {texto:'Ficar olhando ele trabalhar.', vai:'c8_olhou_surge'},
    {texto:'Ir comer e pensar.', vai:'c8_fritura'}
  ]
},

c8_olhou_surge:{
  texto:[
    'Você fica encostado no batente vendo um homem de quarenta e cinco anos consertar um aterramento.',
    'Ele leva quase uma hora. Testa três vezes. Refaz uma vez inteira porque não gostou do jeito que ficou.',
    'Quando acaba, ele solta um Raichu do cinto sem cerimônia nenhuma e diz uma frase curta, e o Raichu descarrega no poste, e a luz do galpão pisca, e os dois olham o medidor.',
    'Ele não comemora e não comemora de um jeito que é claramente a versão dele de comemorar.',
    'Depois ele coça a cabeça do Raichu, uma vez, rápido, do jeito de quem não quer que ninguém veja.'
  ],
  ef:{flag:'viu_o_surge_com_o_raichu', moral:5,
      npc:{nome:'Líder Surge', opiniao:1, memoria:'Você ficou uma hora vendo ele consertar um aterramento.'},
      presagio:'Uma coçada rápida na cabeça, de quem não quer que ninguém veja. Guarda isso pra quando ele te derrubar.'},
  escolhas:[
    {texto:'Ir pro cais.', vai:'c8_cais'},
    {texto:'Ir comer.', vai:'c8_fritura'},
    {texto:'Ir pro bar do turno da noite.', vai:'c8_bar'}
  ]
},

c8_bar:{
  texto:[
    'O bar abre às cinco da manhã e às onze da noite está cheio de gente do turno que acabou.',
    'Ninguém está bêbado. É diferente: é gente cansada bebendo devagar, com o corpo ainda em posição de trabalho.',
    'Você pede uma coisa qualquer e fica ouvindo, porque bar de porto é onde tudo se fala e ninguém repara em adolescente.',
    '"...o Anne atraca amanhã à noite." / "Já atracou." / "Já?" / "Cais três, desde as quatro."',
    'E numa mesa do fundo, mais baixo: "Esse ano eles vão levar de novo?" / "Todo ano levam." / "Não é da nossa conta."'
  ],
  ef:{flag:'ouviu_no_bar',
      presagio:'"Todo ano levam." "Não é da nossa conta." Você vai ouvir essa dupla de frases até o fim.'},
  escolhas:[
    {texto:'Ir até a mesa do fundo.', vai:'c8_mesa_do_fundo'},
    {texto:'Continuar ouvindo sem se meter.', vai:'c8_continuou_ouvindo'},
    {texto:'Ir pro cais três agora.', vai:'c8_cais'},
    {texto:'Sair e dormir.', vai:'c8_fritura'}
  ]
},

c8_mesa_do_fundo:{
  texto:[
    'Você senta na mesa do fundo sem ser convidado, o que é uma coisa que só funciona com quinze anos.',
    'São dois estivadores. O mais velho te olha e ri.',
    '"Ô."',
    '"Levam o quê?"',
    'Silêncio de três segundos.',
    '"Carga", diz o mais novo.',
    '"Carga viva", diz o mais velho, e o mais novo chuta ele por baixo da mesa e todo mundo vê.'
  ],
  ef:{flag:'carga_viva'},
  escolhas:[
    {texto:'"Carga viva de quê?"', vai:'c8_carga_viva'},
    {texto:'Ficar quieto e deixar eles decidirem se falam.', vai:'c8_deixou_falarem'},
    {texto:'Pagar a mesa e ficar.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Levantar e ir pro cais.', vai:'c8_cais'}
  ]
},

c8_deixou_falarem:{
  texto:[
    'Você não pergunta nada. Fica sentado.',
    'Os dois se olham. O mais velho dá de ombros e o mais novo bufa.',
    '"Olha, garoto." O mais velho empurra o copo. "A gente carrega contêiner. A gente não abre contêiner."',
    '"Mas vocês sabem."',
    '"A gente escuta." Ele corrige. "Contêiner de carga geral não faz barulho."',
    'Ele bebe.',
    '"E uma vez por ano, na semana do Anne, passa contêiner que faz barulho."'
  ],
  ef:{flag:['carga_viva','conteiner_que_faz_barulho'],
      registrar:'Uma vez por ano, na semana do S.S. Anne, passa contêiner que faz barulho pelo porto de Vermilion.',
      presagio:'Contêiner que faz barulho. E um lacre inteiro, um número que bate e um peso dentro da margem.'},
  escolhas:[
    {texto:'"Quando passa? Que horas?"', vai:'c8_que_horas'},
    {texto:'"Vocês nunca reportaram?"', vai:'c8_nunca_reportaram'},
    {texto:'Pagar a mesa deles.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Agradecer e ir pro cais.', vai:'c8_cais'}
  ]
},

c8_carga_viva:{
  texto:[
    '"Carga viva de quê?"',
    'O mais novo levanta e vai embora da mesa sem terminar o copo, o que é a coisa mais eloquente da noite.',
    'O mais velho fica.',
    '"Ele tem filho pequeno", ele explica. "Eu não tenho mais ninguém, então eu posso falar."',
    'Ele empurra o copo pro meio da mesa.',
    '"Carga viva é carga viva, garoto. Nem sempre é bicho."'
  ],
  ef:{flag:['carga_viva','nem_sempre_e_bicho'],
      registrar:'Um estivador insinuou que a carga viva do porto nem sempre é Pokémon.',
      presagio:'"Nem sempre é bicho." Ele pode estar exagerando. Bar de porto exagera. Você vai querer ter certeza.'},
  escolhas:[
    {texto:'"Como assim nem sempre é bicho?"', vai:'c8_nem_sempre'},
    {texto:'"Quando passa? Que horas?"', vai:'c8_que_horas'},
    {texto:'Pagar a mesa dele.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Isso é conversa de bar. Ir embora.', vai:'c8_cais'}
  ]
},

c8_nem_sempre:{
  texto:[
    '"Como assim nem sempre é bicho?"',
    'O homem ri e balança a cabeça.',
    '"Ah, não. Não é isso que você tá pensando."',
    'Ele bebe.',
    '"Eu falo de gente que embarca por vontade. Moleque de dezesseis, dezessete ano, que não tem passagem e que aceita ir no porão até Cinnabar em troca de nada."',
    'Ele apoia os dois cotovelos.',
    '"Eles chamam de vaga de trabalho. Não tem contrato, não tem registro, não tem nome em lista de passageiro." Ele olha pra você. "Você sabe o que acontece com quem não tem nome em lista de passageiro?"',
    '"O quê?"',
    '"Nada." Ele encolhe os ombros. "Não acontece nada. Nunca aconteceu nada com ninguém que não tem nome em lista."'
  ],
  ef:{flag:['vagas_de_trabalho','nem_sempre_e_bicho'],
      registrar:'O S.S. Anne leva adolescentes sem passagem no porão como "vaga de trabalho", sem registro.',
      presagio:'Ninguém na lista de passageiros. Você está pensando em embarcar de graça.'},
  escolhas:[
    {texto:'"Quando passa o contêiner? Que horas?"', vai:'c8_que_horas'},
    {texto:'"Vocês nunca reportaram?"', vai:'c8_nunca_reportaram'},
    {texto:'Pagar a mesa dele.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Ir pro cais três.', vai:'c8_cais'}
  ]
},

c8_que_horas:{
  texto:[
    '"Quando passa? Que horas?"',
    'Ele ri.',
    '"Você quer ver."',
    '"Quero."',
    '"Três e quarenta da manhã." Ele fala sem hesitar, o que quer dizer que ele já pensou muito nisso. "Portão cinco, o de serviço. Não passa pela balança principal — passa pela balança dois, a que tá em manutenção desde março."',
    'Ele termina o copo.',
    '"E antes que você pergunte: sim, eu já pensei em ir ver. Todo ano eu penso."',
    '"E por que não vai?"',
    '"Porque eu trabalho às seis."'
  ],
  ef:{flag:'portao_cinco', registrar:'3h40, portão cinco, balança dois (em manutenção desde março).',
      presagio:'"Porque eu trabalho às seis." É essa a razão. Não é medo. É que amanhã tem trabalho.'},
  escolhas:[
    {texto:'"Eu vou."', vai:'c8_eu_vou'},
    {texto:'Pagar a mesa dele.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"Vocês nunca reportaram?"', vai:'c8_nunca_reportaram'}
  ]
},

c8_eu_vou:{
  texto:[
    '"Eu vou."',
    'Ele te olha por um tempo comprido.',
    'Depois tira uma coisa do bolso do macacão e põe na mesa: um crachá velho de estivador, com foto de um homem de uns vinte e cinco anos que é ele há vinte anos.',
    '"Isso aqui é vencido. Não abre porta nenhuma."',
    'Ele empurra na sua direção.',
    '"Mas se alguém te parar no portão cinco e você mostrar isso rápido e continuar andando, dá uns quatro segundo."',
    'Ele bebe o resto.',
    '"Quatro segundo é muita coisa, garoto."'
  ],
  ef:{flag:'cracha_do_estivador',
      npc:{nome:'Estivador velho', opiniao:5, memoria:'Te deu o crachá vencido dele e o horário do contêiner do portão cinco.'},
      registrar:'Ganhou um crachá de estivador vencido.',
      presagio:'Quatro segundos. Ele mediu isso. Ele mediu isso um dia, em algum lugar.'},
  escolhas:[
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco'},
    {texto:'Ir pro cais três primeiro.', vai:'c8_cais'},
    {texto:'Pagar a mesa dele.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}}
  ]
},

c8_nunca_reportaram:{
  texto:[
    '"Vocês nunca reportaram?"',
    '"Reportar pra quem?"',
    'Não é retórica. Ele está genuinamente perguntando.',
    '"Pra polícia do porto, que é contratada pela administração do porto. Pra administração do porto, que fatura com o Anne. Pra Liga, que credencia o torneio que acontece a bordo."',
    'Ele conta nos dedos e fica sem dedos.',
    '"Ou pro sindicato, que é o único que ia escutar, e que tem trinta e dois filiado e um advogado que atende de terça."',
    'Ele empurra o copo.',
    '"Eu não sou covarde, garoto. Eu sou realista, que é pior."'
  ],
  ef:{flag:'reportar_pra_quem',
      presagio:'"Reportar pra quem?" Em algum momento você vai ter que ser a resposta dessa pergunta.'},
  escolhas:[
    {texto:'"Quando passa? Que horas?"', vai:'c8_que_horas'},
    {texto:'Pagar a mesa dele.', vai:'c8_pagou_a_mesa', cond:d=>d.jogador.dinheiro>=800,
     ef:{dinheiro:-800}},
    {texto:'Ir pro cais três.', vai:'c8_cais'}
  ]
},

c8_pagou_a_mesa:{
  texto:[
    'Você paga a mesa. Não é muito dinheiro e é muito mais do que eles esperavam de um garoto de quinze anos.',
    'O estivador velho fica genuinamente sem graça, o que num homem daquele tamanho é engraçado.',
    '"Não precisava."',
    '"Precisava."',
    'Ele faz que sim.',
    '"Então senta direito e escuta uma coisa que eu não ia falar."'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Pagou a mesa de quem trabalhou a noite toda'},
      npc:{nome:'Estivador velho', opiniao:4, memoria:'Você pagou a mesa dele no bar do porto.'}},
  escolhas:[
    {texto:'Escutar.', vai:'c8_eu_vou'},
    {texto:'"Quando passa o contêiner?"', vai:'c8_que_horas'},
    {texto:'"Carga viva de quê?"', vai:'c8_carga_viva'}
  ]
},

c8_continuou_ouvindo:{
  texto:[
    'Você fica no balcão e não se mete.',
    'Ouve: que o Anne atracou às quatro. Que a cozinha do navio contrata dez pessoas da cidade por temporada e paga bem. Que tem torneio a bordo hoje à noite.',
    'Que faltou um no torneio.',
    'E ouve, de uma mulher no balcão, sem nenhum contexto: "Esse ano de novo aquele negócio do camarote quarenta."',
    'Ninguém responde. Ela também não continua.'
  ],
  ef:{flag:['ouviu_camarote_40','sabe_do_torneio']},
  escolhas:[
    {texto:'Perguntar pra ela o que é o camarote quarenta.', vai:'c8_a_mulher_do_balcao'},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir até a mesa do fundo.', vai:'c8_mesa_do_fundo'},
    {texto:'Sair e comer alguma coisa.', vai:'c8_fritura'}
  ]
},

c8_a_mulher_do_balcao:{
  texto:[
    '"O que é o camarote quarenta?"',
    'Ela olha pra você. Tem uns cinquenta anos e mãos de quem lava louça há muito tempo.',
    '"Você trabalha no navio?"',
    '"Não."',
    '"Então esquece." Ela volta pro copo. E depois, porque você não sai: "Eu trabalho. Na temporada. Cozinha."',
    'Ela mexe o gelo.',
    '"Camarote quarenta é o que a gente não limpa. Tem um cara na porta e a gente deixa a bandeja no chão do corredor."',
    '"E o que tem dentro?"',
    '"Eu deixo a bandeja no chão do corredor", ela repete, exatamente igual, e isso é a resposta inteira.'
  ],
  ef:{flag:'ouviu_camarote_40',
      npc:{nome:'Cozinheira do Anne', opiniao:1, memoria:'Trabalha na cozinha do S.S. Anne por temporada. Não limpa o camarote 40.'},
      registrar:'O camarote 40 do S.S. Anne não é limpo. A bandeja fica no chão do corredor.',
      presagio:'A bandeja fica no chão do corredor. Alguém come essa bandeja.'},
  escolhas:[
    {texto:'"Quantas bandejas?"', vai:'c8_quantas_bandejas'},
    {texto:'"A senhora pode me arrumar um trabalho lá?"', vai:'c8_pediu_trabalho'},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Deixar ela em paz.', vai:'c8_fritura'}
  ]
},

c8_quantas_bandejas:{
  texto:[
    '"Quantas bandejas?"',
    'Ela para de mexer o gelo.',
    'É a pergunta que ela não esperava e dá pra ver exatamente o momento em que ela decide responder.',
    '"Quatro."',
    'Ela bebe.',
    '"Quatro bandeja pra um camarote de duas cama."',
    'Ela põe o copo no balcão com muito cuidado.',
    '"Eu monto quatro bandeja todo dia da temporada há seis ano e eu conto quatro todo dia e eu nunca falei isso em voz alta até agora."'
  ],
  ef:{flag:'quatro_bandejas',
      npc:{nome:'Cozinheira do Anne', opiniao:4, memoria:'Te contou que monta quatro bandejas por dia para um camarote de duas camas. Nunca tinha dito isso em voz alta.'},
      rep:{eixo:'bom',delta:1,motivo:'Fez a pergunta que ninguém fazia'},
      registrar:'Quatro bandejas por dia para o camarote 40, que tem duas camas.',
      presagio:'Quatro bandejas, duas camas, seis anos. Ela contou todos os dias e nunca disse em voz alta.'},
  escolhas:[
    {texto:'"A senhora pode me arrumar um trabalho lá?"', vai:'c8_pediu_trabalho'},
    {texto:'"A senhora quer que alguém veja?"', vai:'c8_quer_que_alguem_veja'},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Deixar ela em paz e sair.', vai:'c8_fritura'}
  ]
},

c8_quer_que_alguem_veja:{
  texto:[
    '"A senhora quer que alguém veja?"',
    'Ela demora muito.',
    '"Eu tenho cinquenta e dois anos e eu ganho mais em três semana de temporada do que em quatro mês de restaurante da cidade."',
    'Ela olha o copo.',
    '"E eu conto quatro bandeja todo dia."',
    'Ela abre a bolsa, tira uma chave de latão pequena e velha, e põe no balcão sem empurrar na sua direção.',
    '"Isso aqui abre o corredor de serviço do convés três. Eu perdi ela em duas mil e dezenove." Ela olha pra frente, não pra você. "Eu não sei onde ela tá."'
  ],
  ef:{flag:'chave_do_corredor',
      npc:{nome:'Cozinheira do Anne', opiniao:6, memoria:'Te deu a chave do corredor de serviço do convés três, fingindo que a tinha perdido.'},
      rep:{eixo:'bom',delta:1,motivo:'Deu a alguém a chance de fazer a coisa certa sem se expor'},
      registrar:'Ganhou a chave do corredor de serviço do convés três do S.S. Anne.',
      presagio:'Ela não empurrou a chave. Ela só parou de saber onde estava.'},
  escolhas:[
    {texto:'Pegar a chave.', vai:'c8_pegou_chave'},
    {texto:'Não pegar. Isso vai queimar ela.', vai:'c8_nao_pegou_chave'},
    {texto:'"A senhora pode me arrumar um trabalho lá?"', vai:'c8_pediu_trabalho'}
  ]
},

c8_pegou_chave:{
  texto:[
    'Você pega a chave do balcão sem falar nada e guarda no bolso da frente.',
    'Ela não olha. Continua olhando pra frente, pro espelho atrás das garrafas.',
    'Depois de uns vinte segundos ela pede outro e paga o seu também.',
    'Vocês não trocam mais nenhuma palavra.'
  ],
  ef:{flag:'tem_a_chave'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"A senhora pode me arrumar um trabalho lá?"', vai:'c8_pediu_trabalho'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_nao_pegou_chave:{
  texto:[
    '"Não. Se sumir uma chave e aparecer alguém no corredor, eles vão até a senhora em duas horas."',
    'Ela pega a chave de volta devagar.',
    'E aí ela faz uma coisa: guarda a chave, pega um guardanapo, e escreve uma coisa nele com o lápis de conta do bar.',
    'Empurra o guardanapo.',
    'Está escrito: "CONVÉS 3 — PORTA DE SERVIÇO FICA DESTRANCADA DAS 23H ÀS 23H20 (TROCA DE TURNO DA COPA)."',
    '"Guardanapo some", ela diz. "Chave não some."'
  ],
  ef:{flag:'janela_das_23h',
      npc:{nome:'Cozinheira do Anne', opiniao:8, memoria:'Você recusou a chave pra proteger ela, e ela te deu o horário da troca de turno num guardanapo.'},
      rep:{eixo:'bom',delta:3,motivo:'Recusou a ferramenta que queimaria quem te ajudou'},
      registrar:'Convés 3, porta de serviço destrancada das 23h às 23h20.',
      presagio:'Vinte minutos por noite. Guardanapo some.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"A senhora pode me arrumar um trabalho lá?"', vai:'c8_pediu_trabalho'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_pediu_trabalho:{
  texto:[
    '"A senhora pode me arrumar um trabalho lá?"',
    'Ela ri pela primeira vez.',
    '"Você quer lavar louça pra oitocentas pessoa?"',
    '"Quero."',
    'Ela para de rir.',
    '"Tá." Ela escreve um nome num guardanapo. "Fala pro contramestre que a Neusa mandou. Turno começa às seis. Oito hora."',
    'Ela devolve o lápis pro balcão.',
    '"E, garoto: quem trabalha na cozinha entra pelo corredor de serviço. Ninguém repara em quem entra pelo corredor de serviço."'
  ],
  ef:{flag:'indicacao_da_neusa',
      npc:{nome:'Cozinheira do Anne', opiniao:3, memoria:'Te indicou para o turno de cozinha do S.S. Anne.'},
      presagio:'Ninguém repara em quem entra pelo corredor de serviço. Ela falou isso devagar.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir direto procurar o contramestre.', vai:'c8_trabalho'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_fritura:{
  texto:[
    'A fritura do porto é uma janela numa parede com três banquinhos na calçada.',
    'Peixe, mandioca e um molho que a dona não explica. Custa pouco e é excelente.',
    'Você come em pé olhando o cais três, onde um navio do tamanho de um quarteirão está acendendo as luzes do salão uma fileira por vez.',
    'Do banquinho do lado, um menino de uns dez anos come batata com a mão e tem uma caixa de isopor entre os pés.',
    'A caixa se mexe.'
  ],
  ef:{dinheiro:-200, hp:4},
  escolhas:[
    {texto:'Perguntar o que tem na caixa.', vai:'c8_a_caixa_do_menino'},
    {texto:'Não perguntar nada e ir pro cais.', vai:'c8_cais'},
    {texto:'Comprar batata pra ele também.', vai:'c8_batata',
     ef:{dinheiro:-100, rep:{eixo:'bom',delta:1,motivo:'Comprou comida pra uma criança sem motivo'}}},
    {texto:'Ficar comendo em silêncio.', vai:'c8_a_caixa_do_menino'}
  ]
},

c8_batata:{
  texto:[
    'Você pede outra porção e põe no banquinho do lado sem falar nada.',
    'O menino olha a batata. Olha você. Olha a batata.',
    '"Eu tenho dinheiro", ele diz, ofendido.',
    '"Eu sei."',
    'Ele come a batata.',
    'Dois minutos depois ele empurra a caixa de isopor com o pé pra você ver melhor.',
    '"É meu", ele diz rápido. "Eu peguei. Não roubei."'
  ],
  ef:{npc:{nome:'Menino do cais', opiniao:3, memoria:'Você comprou batata pra ele na fritura do porto.'}},
  escolhas:[
    {texto:'Olhar na caixa.', vai:'c8_a_caixa_do_menino'},
    {texto:'"Eu sei que é seu." E continuar comendo.', vai:'c8_a_caixa_do_menino'},
    {texto:'Ir pro cais.', vai:'c8_cais'}
  ]
},

c8_a_caixa_do_menino:{
  texto:[
    'Na caixa de isopor tem um Krabby, com um dedo de água e um pano molhado por cima, o que é mais cuidado do que a maioria dos adultos teria.',
    '"É meu", ele diz. "Eu peguei na pedra do quebra-mar. Não roubei."',
    '"Tá vendendo?"',
    '"Tô." Ele endireita as costas. "Quatrocentos."',
    'Quatrocentos.',
    'Um Krabby daquele nível vale seis vezes isso em qualquer loja de Cerulean, e ele não sabe, e o rosto dele mostra que quatrocentos é um número que ele achou ousado.'
  ],
  ef:{flag:'o_krabby_do_menino'},
  escolhas:[
    {texto:'Pagar o preço justo — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo a quem não sabia o preço'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu e explicou por quê.'}}},
    {texto:'Pagar os 400 que ele pediu.', vai:'c8_krabby_barato', cond:d=>d.jogador.dinheiro>=400,
     ef:{dinheiro:-400, rep:{eixo:'ruim',delta:2,motivo:'Levou vantagem sobre uma criança no cais'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:40, historia:'Comprado de uma criança por um sexto do que valia.'}},
         npc:{nome:'Menino do cais', opiniao:0, memoria:'Você comprou o Krabby dele por 400. Ele ficou feliz na hora.'}}},
    {texto:'Explicar o valor e não comprar.', vai:'c8_krabby_licao',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Ensinou em vez de aproveitar'},
         npc:{nome:'Menino do cais', opiniao:4, memoria:'Você explicou quanto valia o Krabby dele e foi embora sem comprar.'}}},
    {texto:'"Por que você tá vendendo?"', vai:'c8_porque_vender'}
  ]
},

c8_porque_vender:{
  texto:[
    '"Por que você tá vendendo?"',
    'Ele encolhe os ombros.',
    '"Porque eu pego outro."',
    'É a resposta mais simples e mais devastadora possível.',
    '"Eu pego dois, três por semana na pedra do quebra-mar. Eu vendo pra quem vai pro navio." Ele aponta o S.S. Anne com a batata. "Gente do navio compra qualquer coisa."',
    '"E o que você faz com o dinheiro?"',
    '"Guardo."',
    '"Pra quê?"',
    'Ele olha pro navio.',
    '"Passagem."'
  ],
  ef:{flag:'o_menino_quer_a_passagem',
      registrar:'O menino do cais junta dinheiro vendendo Krabby pra comprar a passagem do S.S. Anne.',
      presagio:'Ele está juntando oito mil, quatrocentos por vez. Faz a conta de quantos Krabby são.'},
  escolhas:[
    {texto:'Pagar o preço justo — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo a quem não sabia o preço'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu e explicou por quê.'}}},
    {texto:'"Não compra passagem. Tem gente que embarca de graça e some."', vai:'c8_avisou_o_menino',
     cond:d=>!!d.flags.vagas_de_trabalho},
    {texto:'Explicar o valor e não comprar.', vai:'c8_krabby_licao',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Ensinou em vez de aproveitar'},
         npc:{nome:'Menino do cais', opiniao:4, memoria:'Você explicou quanto valia o Krabby dele.'}}},
    {texto:'Ir pro cais sem comprar nada.', vai:'c8_cais'}
  ]
},

c8_avisou_o_menino:{
  texto:[
    'Você conta. As vagas de trabalho, o porão, a ausência de nome em lista de passageiro.',
    'O menino escuta com a batata parada no meio do caminho.',
    '"Eu sei."',
    'Ele volta a comer.',
    '"O Denis foi ano passado. Ele tinha dezesseis." Ele mastiga. "Ele mandou carta de Cinnabar. Aí parou."',
    '"Parou como?"',
    '"Parou." Ele dá de ombros com uma naturalidade que te gela. "Mas ele mandou carta. Ele chegou."',
    'Ele fecha a caixa de isopor.',
    '"Eu vou de passagem. Com nome na lista. Por isso eu tô juntando."'
  ],
  ef:{flag:'o_denis', registrar:'Denis, 16 anos, foi de "vaga de trabalho" ano passado. Mandou uma carta de Cinnabar e parou.',
      npc:{nome:'Menino do cais', opiniao:4, memoria:'Te contou do Denis, que foi de vaga de trabalho e mandou uma carta só.'},
      presagio:'Ele mandou carta e chegou. Uma carta. Uma.'},
  escolhas:[
    {texto:'Pagar o preço justo — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo a quem não sabia o preço'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu.'}}},
    {texto:'Dar oito mil pra ele comprar a passagem. (8.000 ₽)', vai:'c8_pagou_a_passagem_dele',
     cond:d=>d.jogador.dinheiro>=8000},
    {texto:'"Guarda a carta do Denis." Perguntar dela.', vai:'c8_a_carta_do_denis'},
    {texto:'Ir pro cais.', vai:'c8_cais'}
  ]
},

c8_pagou_a_passagem_dele:{
  texto:[
    'Você conta oito mil na frente dele, em cima de um banquinho de fritura de porto.',
    'Ele não pega.',
    '"Isso é de mentira."',
    '"Não é."',
    '"Isso é de mentira", ele repete, e a voz falha, e ele fica com muita raiva da própria voz.',
    'Ele pega. Conta. Conta de novo. Guarda dentro da meia, que é onde criança de porto guarda dinheiro.',
    '"Eu vou pagar de volta."',
    '"Não vai."',
    '"EU VOU PAGAR DE VOLTA." Ele grita isso na calçada e duas pessoas olham.',
    'E aí ele pega a caixa de isopor e enfia na sua mão e sai correndo antes que você recuse.'
  ],
  ef:{dinheiro:-8000, rep:{eixo:'bom',delta:5,motivo:'Pagou a passagem de um menino do cais'},
      umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:70, historia:'Um menino de dez anos do cais de Vermilion enfiou essa caixa na sua mão e saiu correndo.'}},
      npc:{nome:'Menino do cais', opiniao:10, memoria:'Você pagou a passagem inteira dele. Ele jurou pagar de volta.'},
      flag:'pagou_a_passagem_do_menino',
      registrar:'Pagou os oito mil da passagem do menino do cais.',
      presagio:'"EU VOU PAGAR DE VOLTA." Ele tem dez anos e acabou de fazer uma promessa que vai carregar.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir atrás dele.', vai:'c8_atras_do_menino'}
  ]
},

c8_atras_do_menino:{
  texto:[
    'Você vai atrás e não acha. Menino de porto some em porto melhor do que qualquer um.',
    'Duas quadras depois você desiste e volta pro banquinho.',
    'A dona da fritura está olhando pra você com uma expressão que você não sabe ler.',
    '"Você deu oito mil pro Tunico."',
    '"É o nome dele?"',
    '"É." Ela vira o peixe. "Ele vende Krabby na minha porta faz três ano."',
    'Ela serve outra porção e empurra pra você sem cobrar.',
    '"A mãe dele embarcou nesse navio há quatro ano. Pra trabalhar. Ela mandou uma carta de Cinnabar."'
  ],
  ef:{flag:['o_nome_do_menino','a_mae_do_tunico'],
      registrar:'O menino se chama Tunico. A mãe dele embarcou no S.S. Anne há quatro anos e mandou uma carta.',
      npc:{nome:'Menino do cais', opiniao:2, memoria:'Nome: Tunico. A mãe embarcou no Anne há quatro anos.'},
      presagio:'Uma carta de Cinnabar. De novo. Sempre uma carta de Cinnabar.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"Ele vai atrás dela."', vai:'c8_vai_atras_dela'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_vai_atras_dela:{
  texto:[
    '"Ele vai atrás dela."',
    'A dona da fritura não responde na hora.',
    '"Vai."',
    'Ela vira o peixe.',
    '"E eu passei três ano torcendo pra ele não juntar o dinheiro."',
    'Ela olha pra você pela primeira vez, direto.',
    '"E você juntou pra ele numa tarde."'
  ],
  ef:{flag:'o_peso_dos_oito_mil', moral:-5,
      presagio:'Você fez uma coisa boa e acelerou uma coisa. As duas são verdade ao mesmo tempo.'},
  escolhas:[
    {texto:'"Então eu vou junto."', vai:'c8_vai_junto',
     ef:{flag:'prometeu_ir_junto', rep:{eixo:'bom',delta:2,motivo:'Assumiu o que acelerou'}}},
    {texto:'"Desculpa."', vai:'c8_cais'},
    {texto:'"Ela pode estar viva."', vai:'c8_pode_estar_viva'}
  ]
},

c8_pode_estar_viva:{
  texto:[
    '"Ela pode estar viva."',
    '"Pode." A dona da fritura fecha a tampa da panela. "Muita gente vai pra Cinnabar e fica. Tem trabalho lá."',
    'Ela limpa as mãos.',
    '"Eu não digo que morreu. Eu digo que não escreveu de novo, e que são coisas diferentes, e que uma delas eu consigo viver."',
    'Ela serve outro cliente.',
    '"O Tunico não consegue viver com nenhuma das duas. Por isso ele junta."'
  ],
  ef:{flag:'nao_escreveu_de_novo',
      presagio:'Não morreu: não escreveu de novo. Você vai conhecer muita gente que vive na diferença entre essas duas coisas.'},
  escolhas:[
    {texto:'"Então eu vou junto."', vai:'c8_vai_junto',
     ef:{flag:'prometeu_ir_junto', rep:{eixo:'bom',delta:2,motivo:'Assumiu o que acelerou'}}},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_vai_junto:{
  texto:[
    '"Então eu vou junto."',
    'A dona da fritura para.',
    '"Você vai junto."',
    '"Eu vou no navio. Se ele for, eu vou junto."',
    'Ela olha pra você por uns cinco segundos e depois faz uma coisa que ninguém fez com você nessa jornada: ela escreve o seu nome num papel.',
    '"Como você chama?"',
    'Você fala. Ela escreve num pedaço de papel de embrulho e prende com ímã na parede da fritura, entre as contas a pagar.',
    '"Pronto." Ela volta pro peixe. "Agora tem registro."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Prometeu acompanhar quem você empurrou'},
      flag:'nome_na_parede_da_fritura',
      npc:{nome:'Dona da fritura', opiniao:5, memoria:'Pregou o seu nome na parede da fritura dela, entre as contas a pagar.'},
      registrar:'Seu nome está pregado na parede de uma fritura do porto de Vermilion.',
      presagio:'"Agora tem registro." É a coisa mais parecida com um contrato que você assinou até hoje.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_a_carta_do_denis:{
  texto:[
    '"Você tem a carta do Denis?"',
    'O menino tira do bolso de trás uma folha dobrada em oito, mole de tanto ser aberta.',
    'Letra ruim. Caneta esferográfica. Sete linhas.',
    '"Cheguei. Tá tudo certo. O trabalho é de descarregar e eles pagam no fim. Fala pra minha tia que eu ligo quando der. Não conta pra ninguém que eu fui assim. Eu tô bem. Denis."',
    'No verso, escrito de cabeça pra baixo, quase apagado, como quem escreveu com a folha em cima do joelho e depois desistiu de mandar:',
    '"eles contaram a gente duas vezes"'
  ],
  ef:{flag:'a_carta_do_denis', registrar:'No verso da carta do Denis: "eles contaram a gente duas vezes".',
      presagio:'Contaram duas vezes. Conferência. Ele viu conferência e não soube o nome do que viu.'},
  escolhas:[
    {texto:'Pedir a carta emprestada.', vai:'c8_pegou_a_carta'},
    {texto:'"Mostra isso pra sua tia."', vai:'c8_mostra_pra_tia'},
    {texto:'Pagar o preço justo pelo Krabby — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu.'}}},
    {texto:'Ir pro cais.', vai:'c8_cais'}
  ]
},

c8_pegou_a_carta:{
  texto:[
    '"Me empresta essa carta."',
    '"Não."',
    'Na hora, sem pensar.',
    '"É a única que ele mandou."',
    'Você não insiste. Em vez disso você tira o seu caderno e copia as sete linhas e a frase do verso, palavra por palavra, sentado num banquinho de fritura, com o menino conferindo cada letra por cima do seu ombro.',
    '"Tá errado", ele diz duas vezes, e as duas vezes está errado mesmo.',
    'No fim ele lê a sua cópia inteira e faz que sim.'
  ],
  ef:{flag:'copiou_a_carta',
      rep:{eixo:'bom',delta:1,motivo:'Copiou em vez de tomar'},
      npc:{nome:'Menino do cais', opiniao:4, memoria:'Você copiou a carta do Denis em vez de levar a dele.'},
      registrar:'Copiou a carta do Denis, com a frase do verso.',
      presagio:'Você tem uma cópia. Ele ficou com o original. Alguém em Cerulean te ensinou a diferença.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco},
    {texto:'Pagar o preço justo pelo Krabby — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu.'}}}
  ]
},

c8_mostra_pra_tia:{
  texto:[
    '"Mostra isso pra sua tia."',
    '"A tia é do Denis, não minha."',
    '"Mostra pra ela."',
    'Ele dobra a carta em oito de novo, com uma precisão de quem dobra essa carta há um ano.',
    '"Ela já viu."',
    'Ele guarda no bolso de trás.',
    '"Ela leu e falou: graças a Deus ele tá bem."',
    'Ele olha pro navio.',
    '"Ela não virou o papel."'
  ],
  ef:{flag:'ela_nao_virou_o_papel',
      presagio:'Ela não virou o papel. Quase ninguém vira o papel.'},
  escolhas:[
    {texto:'Copiar a carta.', vai:'c8_pegou_a_carta'},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Pagar o preço justo pelo Krabby — 2.400 ₽.', vai:'c8_krabby_justo', cond:d=>d.jogador.dinheiro>=2400,
     ef:{dinheiro:-2400, rep:{eixo:'bom',delta:3,motivo:'Pagou o preço justo'},
         umaVez:'c08_krabby', pokemon:{dex:98, nivel:22, opcoes:{moral:60, historia:'Comprado de um menino no cais de Vermilion pelo preço justo.'}},
         npc:{nome:'Menino do cais', opiniao:6, memoria:'Você pagou seis vezes o que ele pediu.'}}}
  ]
},

c8_krabby_justo:{
  texto:[
    'Ele conta o dinheiro três vezes e ainda acha que você errou.',
    '"Por que você fez isso?"',
    'Você explica o que é uma tabela de preço. Que existe um valor de mercado. Que loja de Cerulean vende esse Krabby por seis vezes o que ele pediu.',
    'Ele ouve com uma seriedade de adulto, e no meio da explicação ele tira um lápis do bolso e começa a anotar na tampa de isopor.',
    'Semanas depois, você vai ouvir falar de um menino em Vermilion que virou o melhor avaliador de Pokémon do porto e que cobra pelo serviço.',
    'Boa sorte pra quem tentar enganá-lo.'
  ],
  ef:{presagio:'Você ensinou uma criança a pôr preço nas coisas. Isso pode ser a melhor ou a pior coisa que você fez hoje.'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"Por que você tá vendendo?"', vai:'c8_porque_vender'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_krabby_barato:{
  texto:[
    'Ele te entrega a caixa de isopor e sai correndo, feliz, com quatrocentos no bolso.',
    'Você fica olhando ele ir embora.',
    'Não foi crime. Foi só o tipo de coisa que, depois, você não conta pra ninguém.',
    'A dona da fritura viu. Ela não diz nada. Ela vira o peixe e não diz nada, e você paga a conta e ela não diz nada.'
  ],
  ef:{presagio:'Ela não disse nada. Você vai lembrar do silêncio dela por muito mais tempo do que de qualquer bronca.'},
  escolhas:[
    {texto:'Ir atrás dele e pagar a diferença.', vai:'c8_pagou_diferenca',
     cond:d=>d.jogador.dinheiro>=2000},
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_pagou_diferenca:{
  texto:[
    'Você acha ele duas quadras adiante, contando as notas sentado num meio-fio.',
    'Você entrega o resto.',
    '"Isso é o preço certo. Eu te paguei errado."',
    'Ele não entende. Você explica. Ele entende e fica bravo — não com você, com ele mesmo.',
    '"Eu ia vender por quatrocentos pra qualquer um."',
    '"Agora não vai mais."',
    'Ele guarda dentro da meia.'
  ],
  ef:{dinheiro:-2000, rep:{eixo:'bom',delta:2,motivo:'Voltou e pagou a diferença'},
      npc:{nome:'Menino do cais', opiniao:5, memoria:'Você voltou e pagou a diferença do Krabby.'},
      limpaFlag:'levou_vantagem_no_cais'},
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"Por que você tá vendendo?"', vai:'c8_porque_vender'}
  ]
},

c8_krabby_licao:{
  texto:[
    '"Dois mil e quatrocentos?"',
    'Ele olha a caixa de isopor de um jeito completamente novo.',
    '"Então eu não vou vender."',
    '"Boa", você diz. E é boa mesmo.',
    'Ele fecha a caixa com as duas mãos e senta em cima, como quem guarda um cofre.',
    '"Como você sabe disso?"',
    '"Eu vi numa banca em Cerulean."',
    'Ele repete "Cerulean" baixinho, do jeito de quem está guardando.'
  ],
  escolhas:[
    {texto:'Ir pro cais três.', vai:'c8_cais'},
    {texto:'"Por que você tá vendendo?"', vai:'c8_porque_vender'},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco}
  ]
},

c8_cais:{
  texto:[
    'O cais três de perto é outra coisa.',
    'O S.S. Anne não parece um navio daqui: parece uma parede. Uma parede branca de nove andares com janelas, encostada num muro de concreto, com uma passarela coberta ligando os dois.',
    'Na entrada da passarela tem uma mesa com duas moças de uniforme, uma fila de gente bem vestida, e um preço numa placa de acrílico.',
    'PASSAGEM — VERMILION / CINNABAR — ₽ 8.000.',
    'Tem gente pagando isso sem piscar. Um casal na sua frente paga quatro passagens e a mulher reclama do preço do jeito que se reclama de uma coisa que não dói.',
    'E, do lado, uma porta de serviço sem placa, com um cabo de energia entrando por baixo.'
  ],
  ef:{registrar:'Chegou ao cais três, onde o S.S. Anne está atracado.'},
  escolhas:[
    {texto:'Comprar a passagem. (8.000 ₽)', vai:'c8_bordo', cond:d=>d.jogador.dinheiro>=8000,
     ef:{dinheiro:-8000, flag:'pagou_passagem'}},
    {texto:'Procurar um jeito de entrar sem pagar.', vai:'c8_clandestino'},
    {texto:'Perguntar se precisam de mão de obra a bordo.', vai:'c8_trabalho'},
    {texto:'Ficar no cais e esperar escurecer.', vai:'c8_noite_porto'}
  ]
},

c8_noite_porto:{
  texto:[
    'À noite, o navio acende. Da beira do cais dá pra ver as janelas do salão de festas, cheias de gente que nunca dormiu no mato.',
    'Tem música lá dentro. Música ao vivo, com piano, e o som sai pela passarela coberta e morre na água.',
    'Você fica sentado num cabeço de amarração por quase uma hora olhando isso.',
    'E aí uma mulher de uniforme da tripulação desce a passarela e vem direto na sua direção, andando rápido, olhando o seu cinto.',
    '"Você é treinador?"',
    '"Sou."',
    '"Tem um torneio a bordo hoje. Faltou um." Ela já está fazendo sinal pra alguém lá em cima. "Entrada de graça. Só entra e luta."'
  ],
  ef:{flag:'sabe_do_torneio'},
  escolhas:[
    {texto:'Aceitar.', vai:'c8_bordo', ef:{flag:'entrou_pelo_torneio'}},
    {texto:'"Por que faltou um?"', vai:'c8_por_que_faltou'},
    {texto:'"Quanto paga o primeiro lugar?"', vai:'c8_premio'},
    {texto:'Recusar e ficar no porto.', vai:'c8_recusou_torneio'}
  ]
},

c8_premio:{
  texto:[
    '"Quanto paga o primeiro lugar?"',
    '"Vinte mil."',
    'Ela fala isso e espera a sua reação, e a sua reação é exatamente a que ela esperava.',
    '"E o segundo?"',
    '"Nada." Ela dá de ombros. "É torneio de rico, garoto. Eles não fazem por dinheiro. Eles fazem porque dá pra apostar."',
    'Ela olha pra cima, pro salão iluminado.',
    '"Cada um deles põe um valor num dos oito. Esse é o jogo. Vocês são o jogo."'
  ],
  ef:{flag:['premio_do_torneio','voces_sao_o_jogo'],
      presagio:'Vocês são o jogo. Não os Pokémon: vocês.'},
  escolhas:[
    {texto:'Aceitar mesmo assim.', vai:'c8_bordo', ef:{flag:'entrou_pelo_torneio'}},
    {texto:'"Por que faltou um?"', vai:'c8_por_que_faltou'},
    {texto:'Recusar.', vai:'c8_recusou_torneio'},
    {texto:'"Quem aposta em quem?"', vai:'c8_quem_aposta'}
  ]
},

c8_quem_aposta:{
  texto:[
    '"Quem aposta em quem?"',
    'Ela ri sem alegria.',
    '"Isso eu não sei e eu não quero saber."',
    'Ela olha o relógio.',
    '"Mas eu vou te dizer uma coisa porque eu já vi isso acontecer três vez: se você ganhar, alguém vai te chamar pra conversar depois."',
    '"Conversar sobre o quê?"',
    '"Sobre você." Ela começa a subir a passarela. "Você vem ou não vem?"'
  ],
  ef:{flag:'aviso_da_conversa',
      presagio:'Se você ganhar, alguém vai querer conversar. Ela já viu isso três vezes.'},
  escolhas:[
    {texto:'Ir.', vai:'c8_bordo', ef:{flag:'entrou_pelo_torneio'}},
    {texto:'Recusar.', vai:'c8_recusou_torneio'},
    {texto:'"Por que faltou um?"', vai:'c8_por_que_faltou'}
  ]
},

c8_por_que_faltou:{
  texto:[
    '"Por que faltou um?"',
    'Ela hesita meio segundo. É o suficiente.',
    '"O garoto passou mal."',
    '"Passou mal como?"',
    '"Passou mal." Ela olha pra trás, pro navio. "Você entra ou não entra?"',
    'E aí, porque você não responde, ela baixa a voz:',
    '"Ele tá na enfermaria do convés dois. Ele tem dezesseis anos e ele entrou pelo porão, e ele lutou três luta seguida hoje porque falta gente todo ano."'
  ],
  ef:{flag:['desconfiou_torneio','o_garoto_da_enfermaria'],
      registrar:'Um garoto de 16 anos está na enfermaria do convés dois depois de três lutas seguidas no torneio.',
      presagio:'Falta gente todo ano. Todo ano alguém luta três vezes seguidas.'},
  escolhas:[
    {texto:'Entrar. Você quer ver o que tem lá dentro.', vai:'c8_bordo', ef:{flag:'entrou_pelo_torneio'}},
    {texto:'"Me leva na enfermaria."', vai:'c8_bordo', ef:{flag:['entrou_pelo_torneio','vai_na_enfermaria']}},
    {texto:'"Quanto paga o primeiro lugar?"', vai:'c8_premio'},
    {texto:'Recusar.', vai:'c8_recusou_torneio'}
  ]
},

c8_recusou_torneio:{
  texto:[
    '"Não."',
    'Ela não insiste. Faz que sim, vira, e sobe a passarela.',
    'No meio ela para e fala por cima do ombro, sem virar:',
    '"Boa."',
    'Só isso. Uma palavra.',
    'Você fica no cabeço de amarração e vê ela sumir na passarela coberta, e a música do piano continua, e você não sabe se acabou de fazer a coisa certa ou de perder a única chance.'
  ],
  ef:{flag:'recusou_o_torneio',
      presagio:'"Boa." Ela disse isso de costas e você não vai conseguir decidir o que significou.'},
  escolhas:[
    {texto:'Mudar de ideia e subir.', vai:'c8_bordo', ef:{flag:'entrou_pelo_torneio'}},
    {texto:'Comprar a passagem. (8.000 ₽)', vai:'c8_bordo', cond:d=>d.jogador.dinheiro>=8000,
     ef:{dinheiro:-8000, flag:'pagou_passagem'}},
    {texto:'Ir pro portão cinco às três e quarenta.', vai:'c8_portao_cinco', cond:d=>!!d.flags.portao_cinco},
    {texto:'Ficar no porto. O navio não é seu problema.', vai:'c8_fim_porto'}
  ]
},

c8_portao_cinco:{
  texto:[
    'Três e quarenta da manhã.',
    'O portão cinco é o de serviço, no fim do muro, com uma guarita vazia e uma cancela levantada.',
    'A balança dois tem uma faixa de PARADA PARA MANUTENÇÃO amarrada no poste, e a faixa está desbotada de sol de vários meses.',
    'Você espera agachado atrás de uma pilha de pallets.',
    'Três e quarenta e dois: entra um caminhão.',
    'Contêiner de vinte pés, lacre azul, plaquinha com número. Ele passa reto pela balança dois — reto, sem parar — e vai até o cais três.',
    'E na descida, quando o caminhão reduz na lombada, dá pra ouvir.'
  ],
  ef:{flag:'viu_o_conteiner', registrar:'Viu o contêiner passar reto pela balança dois às 3h42.',
      presagio:'Você ouviu. Na lombada, quando reduziu. Não dá pra desouvir.'},
  escolhas:[
    {texto:'Seguir o caminhão a pé.', vai:'c8_seguiu_caminhao'},
    {texto:'Ir até a balança dois olhar.', vai:'c8_balanca_dois'},
    {texto:'Anotar o número do lacre e da plaquinha.', vai:'c8_anotou_lacre'},
    {texto:'Sair correndo e gritar.', vai:'c8_gritou_no_portao'}
  ]
},

c8_anotou_lacre:{
  texto:[
    'Você anota no caderno, com a lanterna do celular por baixo da jaqueta pra não vazar luz:',
    'Contêiner: KTU 409 118-2. Lacre azul nº 77451. Caminhão: placa coberta com papelão e fita.',
    'Placa coberta com papelão e fita.',
    'Dentro de um porto. Passando por um portão. Com um lacre oficial e um número de contêiner válido.',
    'Alguém fez o trabalho inteiro direito e deixou a placa coberta, porque a placa é a única parte que uma pessoa lê.'
  ],
  ef:{flag:'anotou_o_lacre', registrar:'Contêiner KTU 409 118-2, lacre 77451, caminhão com placa coberta.',
      rep:{eixo:'bom',delta:1,motivo:'Anotou o número em vez de correr atrás'},
      presagio:'Você tem um número de contêiner. Isso entra em sistema. Isso é rastreável.'},
  escolhas:[
    {texto:'Seguir o caminhão a pé.', vai:'c8_seguiu_caminhao'},
    {texto:'Ir até a balança dois.', vai:'c8_balanca_dois'},
    {texto:'Voltar pro cais e embarcar.', vai:'c8_cais'},
    {texto:'Procurar o conferente da prancheta amanhã cedo.', vai:'c8_voltou_no_conferente'}
  ]
},

c8_balanca_dois:{
  texto:[
    'A balança dois não está em manutenção.',
    'Você olha o painel: está ligado, com o display aceso, mostrando zero.',
    'A faixa de manutenção está amarrada no poste com nó de quem amarra faixa todo dia, e o nó está desgastado de ser amarrado e desamarrado muitas vezes.',
    'Embaixo do painel tem uma etiqueta de aferição do Inmetro.',
    'Válida. Deste ano.',
    'Uma balança funcionando, aferida e válida, com uma faixa de manutenção amarrada por cima, num portão de serviço que abre às três e quarenta da manhã.'
  ],
  ef:{flag:'a_balanca_funciona', registrar:'A balança dois do portão cinco funciona: aferição válida, faixa de manutenção falsa.',
      presagio:'Alguém amarra e desamarra essa faixa todo dia. Alguém tem essa função.'},
  escolhas:[
    {texto:'Anotar tudo e ir embora.', vai:'c8_anotou_lacre'},
    {texto:'Seguir o caminhão.', vai:'c8_seguiu_caminhao'},
    {texto:'Ficar e esperar quem vem desamarrar a faixa.', vai:'c8_esperou_a_faixa'},
    {texto:'Voltar pro cais.', vai:'c8_cais'}
  ]
},

c8_esperou_a_faixa:{
  texto:[
    'Você espera atrás dos pallets.',
    'Quatro e vinte: vem um homem de colete refletivo. Ele desamarra a faixa, enrola, e guarda numa caixa de ferramenta ao lado da guarita.',
    'Depois liga a balança na tomada, confere o display, e vai embora.',
    'Ele faz isso em noventa segundos com a naturalidade de quem faz isso há anos.',
    'E antes de ir, ele anota uma coisa numa prancheta pendurada na guarita.',
    'Quando ele some, você vai lá e lê.',
    'É uma folha de controle. Colunas: DATA, HORA, VEÍCULO, LACRE. E a última coluna: RESP.',
    'Na coluna RESP, a mesma sigla em todas as linhas dos últimos oito meses. Três letras.'
  ],
  ef:{flag:'a_folha_de_controle', registrar:'Existe uma folha de controle na guarita do portão cinco, com a mesma sigla de responsável em oito meses.',
      rep:{eixo:'bom',delta:2,motivo:'Esperou quarenta minutos por noventa segundos de informação'},
      presagio:'Três letras na coluna RESP. Em oito meses, sempre as mesmas.'},
  escolhas:[
    {texto:'Fotografar / copiar a folha.', vai:'c8_copiou_a_folha'},
    {texto:'Levar a folha.', vai:'c8_levou_a_folha'},
    {texto:'Deixar tudo como está e ir embarcar.', vai:'c8_cais'},
    {texto:'Seguir o caminhão.', vai:'c8_seguiu_caminhao'}
  ]
},

c8_copiou_a_folha:{
  texto:[
    'Você copia as últimas quinze linhas no caderno e devolve a prancheta ao gancho, no mesmo ângulo.',
    'Leva doze minutos e você tem que parar duas vezes porque passa gente.',
    'Quando acaba, a prancheta está exatamente como estava, e você tem quinze datas, quinze horários e quinze números de lacre.',
    'E a sigla, quinze vezes.'
  ],
  ef:{flag:['copiou_o_controle','papel_com_brasao'],
      rep:{eixo:'bom',delta:2,motivo:'Copiou sem levar'},
      registrar:'Copiou quinze linhas da folha de controle do portão cinco.',
      presagio:'Quinze linhas. Cópia. Guardada em outro lugar. Alguém em Cerulean ficaria orgulhosa.'},
  escolhas:[
    {texto:'Ir embarcar no navio.', vai:'c8_cais'},
    {texto:'Seguir o caminhão.', vai:'c8_seguiu_caminhao'},
    {texto:'Procurar o conferente da prancheta de manhã.', vai:'c8_voltou_no_conferente'}
  ]
},

c8_levou_a_folha:{
  texto:[
    'Você arranca a folha e guarda.',
    'Às sete da manhã, um homem de colete refletivo vai chegar na guarita, procurar a folha, não achar, e ligar pra alguém.',
    'E às oito, alguém vai amarrar a faixa de manutenção na balança dois de manhã, o que nunca aconteceu antes, e o portão cinco vai ficar fechado por três semanas.',
    'Você tem a folha. Eles têm três semanas pra mudar tudo.',
    'Você só vai entender o tamanho desse erro muito depois.'
  ],
  ef:{flag:['levou_o_controle','papel_com_brasao','queimou_o_portao'],
      registrar:'Levou a folha de controle. O portão cinco fechou por três semanas.',
      presagio:'Você tem a prova e eles têm o aviso. Quase sempre o aviso vale mais.'},
  escolhas:[
    {texto:'Ir embarcar.', vai:'c8_cais'},
    {texto:'Devolver a folha antes que alguém veja.', vai:'c8_copiou_a_folha',
     ef:{limpaFlag:['levou_o_controle','queimou_o_portao']}},
    {texto:'Seguir o caminhão.', vai:'c8_seguiu_caminhao'}
  ]
},

c8_seguiu_caminhao:{
  texto:[
    'Você segue o caminhão a pé pelo pátio, usando as pilhas de contêiner como cobertura.',
    'Ele para embaixo do guindaste do cais três.',
    'E aí acontece a coisa mais banal do mundo: o guindaste pega o contêiner, gira, e põe no porão do S.S. Anne.',
    'Quatro minutos. Dois homens, um operador de guindaste e um conferente com prancheta.',
    'O conferente não abre nada. Ele confere o número, o lacre e o peso, e assina.',
    'Você viu o crime inteiro e o crime inteiro foi legal.'
  ],
  ef:{flag:'viu_o_embarque', registrar:'O contêiner das 3h42 foi embarcado no S.S. Anne com conferência normal.',
      presagio:'Você viu o crime inteiro e o crime inteiro foi legal. Guarda essa frase; vai servir várias vezes.'},
  escolhas:[
    {texto:'Anotar o número do lacre.', vai:'c8_anotou_lacre'},
    {texto:'Embarcar nesse navio de qualquer jeito.', vai:'c8_cais'},
    {texto:'Ir até o conferente e falar.', vai:'c8_falou_com_conferente'},
    {texto:'Voltar pro portão e olhar a balança.', vai:'c8_balanca_dois'}
  ]
},

c8_falou_com_conferente:{
  texto:[
    'Você anda até o conferente no meio do pátio às quatro da manhã, o que é uma das coisas mais burras que você já fez.',
    'Ele leva um susto de verdade.',
    '"O que você tá fazendo aqui?"',
    '"Tem coisa viva nesse contêiner."',
    'Ele olha o contêiner, que já está no porão. Olha a prancheta. Olha você.',
    '"Lacre inteiro, número bate, peso dentro da margem."',
    '"Eu ouvi."',
    '"Eu também ouço." Ele fala isso e o rosto dele não muda nada. "Todo ano eu ouço, garoto."',
    'Ele assina a última linha.',
    '"E todo ano o lacre tá inteiro, o número bate e o peso tá dentro da margem."'
  ],
  ef:{flag:'o_conferente_ouve',
      npc:{nome:'Conferente do porto', opiniao:2, memoria:'Admitiu que ouve o contêiner todo ano e assina do mesmo jeito.'},
      registrar:'O conferente ouve a carga viva todos os anos e assina.',
      presagio:'Ele não é cúmplice. Ele é conferente. É exatamente isso que faz funcionar.'},
  escolhas:[
    {texto:'"E se eu abrir?"', vai:'c8_e_se_eu_abrir'},
    {texto:'Anotar o número do lacre.', vai:'c8_anotou_lacre'},
    {texto:'Embarcar no navio.', vai:'c8_cais'},
    {texto:'Ir embora.', vai:'c8_fim_porto'}
  ]
},

c8_e_se_eu_abrir:{
  texto:[
    '"E se eu abrir?"',
    'Pela primeira vez ele te olha de verdade.',
    '"Se você romper lacre de contêiner embarcado, você comete crime federal, garoto. Com pena."',
    'Ele guarda a caneta amarrada com barbante.',
    '"E o que tiver dentro passa a ser prova de um processo em que você é réu."',
    'Ele começa a andar e depois para.',
    '"É por isso que funciona. Não é medo. É que quem abre vira o criminoso."'
  ],
  ef:{flag:'quem_abre_vira_o_criminoso',
      presagio:'Quem abre vira o criminoso. Esse é o desenho inteiro, e ele foi projetado por alguém.'},
  escolhas:[
    {texto:'Embarcar no navio.', vai:'c8_cais'},
    {texto:'Anotar o número do lacre.', vai:'c8_anotou_lacre'},
    {texto:'Ir embora do porto.', vai:'c8_fim_porto'}
  ]
},

c8_voltou_no_conferente:{
  texto:[
    'De manhã você procura o conferente da prancheta e mostra o que anotou.',
    'Ele lê o número do contêiner. Lê o número do lacre.',
    'E aí ele faz uma coisa que você não esperava: entra no sistema, num terminal velho de tela verde no escritório do pátio, e digita.',
    '"KTU 409 118-2." Ele lê a tela. "Carga geral. Peças de reposição náutica. Destinatário: um CNPJ de Saffron."',
    'Ele copia o CNPJ num papel e te dá, sem você pedir.',
    '"Eu não te dei isso."',
    '"Não deu."',
    '"E, garoto." Ele desliga a tela. "Peça de reposição náutica não faz barulho na lombada."'
  ],
  ef:{flag:['cnpj_de_saffron','destinacao_saffron'],
      npc:{nome:'Conferente do porto', opiniao:4, memoria:'Puxou o contêiner no sistema e te deu o CNPJ do destinatário em Saffron.'},
      rep:{eixo:'bom',delta:2,motivo:'Levou um número a quem tinha o sistema'},
      registrar:'O contêiner KTU 409 118-2 vai para um CNPJ de Saffron, declarado como peças náuticas.',
      presagio:'Um CNPJ. Empresa tem endereço, sócio e contrato social. Tudo público.'},
  escolhas:[
    {texto:'Ir embarcar no navio.', vai:'c8_cais'},
    {texto:'"Como eu descubro de quem é esse CNPJ?"', vai:'c8_como_descubro'},
    {texto:'Ir pro cais e entrar pelo torneio.', vai:'c8_noite_porto'}
  ]
},

c8_como_descubro:{
  texto:[
    '"Como eu descubro de quem é esse CNPJ?"',
    '"Cartório." Ele fala sem pensar. "Ou junta comercial. Contrato social é público."',
    'Ele guarda o barbante da caneta.',
    '"Você vai em cartório, pede certidão simplificada, paga uns oito reais a página e sai com o nome dos sócio."',
    '"É legal?"',
    '"É legal, é barato e ninguém faz." Ele dá de ombros. "Todo mundo acha que segredo de empresa é segredo. Empresa é a coisa mais pública que existe, garoto. O que é secreto é gente."'
  ],
  ef:{flag:'sabe_do_cartorio',
      registrar:'Certidão simplificada em cartório revela os sócios de um CNPJ. É legal, barato e ninguém faz.',
      presagio:'Cartório da rua Dez, em Saffron, abre até as cinco e cobra oito reais a cópia.'},
  escolhas:[
    {texto:'Ir embarcar.', vai:'c8_cais'},
    {texto:'Ir pro cais e entrar pelo torneio.', vai:'c8_noite_porto'}
  ]
},

c8_gritou_no_portao:{
  texto:[
    'Você sai de trás dos pallets e grita.',
    'O caminhão não para. Ele nem desacelera — o motorista olha no retrovisor, vê um adolescente gritando num pátio de porto às três e quarenta da manhã, e continua.',
    'Você corre atrás por uns cinquenta metros e desiste.',
    'Ninguém aparece. Nenhum alarme, nenhuma sirene, nenhum segurança.',
    'Você fica sozinho no meio de um pátio de contêineres, sem fôlego, tendo gritado com um caminhão.',
    'Isso é o que acontece quando se grita: nada.'
  ],
  ef:{flag:'gritou_no_portao', hp:-2, causa:'Corrida no pátio do porto',
      presagio:'Nada aconteceu. Guardar isso é mais útil do que parece.'},
  escolhas:[
    {texto:'Ir até a balança dois.', vai:'c8_balanca_dois'},
    {texto:'Seguir o caminhão até o cais.', vai:'c8_seguiu_caminhao'},
    {texto:'Voltar pro cais e embarcar.', vai:'c8_cais'}
  ]
},

c8_clandestino:{
  texto:[
    'Tem três jeitos de entrar num navio sem passagem.',
    'O primeiro é a passarela de serviço, que tem gente.',
    'O segundo é o cabo de amarração, que é filme.',
    'O terceiro você encontra na terceira volta pelo cais: a escotilha de carga do convés inferior, aberta pra ventilação, com uma escada de gato do lado de fora do casco.',
    'Passa das onze da noite quando você tenta.',
    d=>d.flags.janela_das_23h ? 'E o guardanapo dizia: das 23h às 23h20. Você olha o relógio. São 23h04.' : ''
  ],
  teste:{status:'percepcao', dificuldade:8, nomeStatus:'Percepção',
         critico:'c8_entrou_bem', sucesso:'c8_entrou_bem', parcial:'c8_entrou_visto', falha:'c8_pego'}
},

c8_entrou_bem:{
  texto:[
    'Você entra e ninguém vê.',
    'O corredor de carga é quente de um jeito que não faz sentido num navio, e cheira a ferrugem, tinta e óleo.',
    'Você acha um uniforme de tripulante pendurado num gancho, com o nome de outra pessoa bordado no peito, e veste por cima da sua roupa.',
    'Ninguém olha duas vezes pra um uniforme. Isso é a descoberta mais útil da sua semana.'
  ],
  ef:{flag:['clandestino','uniforme_tripulacao'], rep:{eixo:'ruim',delta:1,motivo:'Entrou clandestino no S.S. Anne'},
      presagio:'Você está usando o nome de outra pessoa bordado no peito. Vai dar certo até não dar.'},
  escolhas:[
    {texto:'Subir para o salão.', vai:'c8_bordo'},
    {texto:'Explorar o porão agora, com uniforme.', vai:'c8_porao'},
    {texto:'Procurar a enfermaria do convés dois.', vai:'c8_enfermaria', cond:d=>!!d.flags.o_garoto_da_enfermaria},
    {texto:'Procurar o corredor de serviço do convés três.', vai:'c8_corredor_servico', cond:d=>!!d.flags.tem_a_chave || !!d.flags.janela_das_23h}
  ]
},

c8_entrou_visto:{
  texto:[
    'Você entra. Um marinheiro te vê de costas no fim do corredor e grita alguma coisa.',
    'Você corre. Ele não corre atrás — só anota, mentalmente, que tem alguém a bordo que não devia estar.',
    'A partir de agora tem gente procurando você neste navio, e o navio tem nove andares e você não conhece nenhum deles.'
  ],
  ef:{flag:['clandestino','procurado_no_navio'], rep:{eixo:'ruim',delta:1,motivo:'Entrou clandestino e foi visto'}},
  escolhas:[
    {texto:'Subir para o salão e se misturar.', vai:'c8_bordo'},
    {texto:'Ficar no porão, longe de gente.', vai:'c8_porao'},
    {texto:'Procurar um uniforme.', vai:'c8_procurou_uniforme'}
  ]
},

c8_procurou_uniforme:{
  texto:[
    'Você passa quarenta minutos procurando alguma coisa pra vestir e acha: um avental de cozinha branco, num carrinho de rouparia.',
    'Avental de cozinha é pior que uniforme de tripulante e melhor que roupa de rota.',
    'Com o avental, você vira um garoto da cozinha, e garoto da cozinha pode andar por três conveses.',
    'Não pelo salão. Não pelos camarotes de cima. Mas por três conveses.'
  ],
  ef:{flag:'uniforme_tripulacao', limpaFlag:'procurado_no_navio'},
  escolhas:[
    {texto:'Subir para o salão mesmo assim.', vai:'c8_bordo'},
    {texto:'Ir pro porão.', vai:'c8_porao'},
    {texto:'Procurar a enfermaria do convés dois.', vai:'c8_enfermaria'},
    {texto:'Procurar o corredor de serviço do convés três.', vai:'c8_corredor_servico'}
  ]
},

c8_pego:{
  texto:[
    'Você é pego antes de passar da escotilha. Dois seguranças, sem conversa.',
    'Eles não chamam a polícia. Levam você pra uma sala do convés inferior com uma mesa e duas cadeiras, revistam sua mochila item por item, e tiram o que acharem que compensa o incômodo.',
    'Um deles anota o seu nome numa folha.',
    '"Some do porto", diz o outro. "Hoje."',
    'Na saída você repara na folha: é uma lista. Tem umas trinta linhas preenchidas. Você é a trinta e uma.'
  ],
  ef:{dinheiro:-800, hp:-4, causa:'Segurança do S.S. Anne', flag:['expulso_do_navio','a_lista_dos_trinta'],
      rep:{eixo:'ruim',delta:1,motivo:'Pego entrando clandestino no S.S. Anne'},
      registrar:'Seu nome entrou numa lista de trinta e uma pessoas na segurança do S.S. Anne.',
      presagio:'Trinta e uma linhas. Trinta pessoas tentaram entrar nesse navio antes de você essa temporada.'},
  escolhas:[
    {texto:'Tentar de novo por outro caminho.', vai:'c8_clandestino'},
    {texto:'Procurar trabalho a bordo.', vai:'c8_trabalho'},
    {texto:'Ficar no cais e esperar o torneio.', vai:'c8_noite_porto'},
    {texto:'Desistir do navio.', vai:'c8_fim_porto'}
  ]
},

c8_trabalho:{
  texto:[
    'O contramestre é um homem de sessenta anos com antebraços de trinta e um bigode que já foi moda.',
    d=>d.flags.indicacao_da_neusa ? '"A Neusa mandou?" Ele lê o guardanapo. "Então tá."' : '"Mão de obra." Ele te mede de cima a baixo. "Cozinha ou carga?"',
    'Nenhuma das duas tem a ver com Pokémon. As duas pagam a passagem.',
    '"Carga é seis hora e é pesado. Cozinha é oito hora e é chato."',
    'Ele já está olhando o próximo da fila, que também é um adolescente.'
  ],
  escolhas:[
    {texto:'Carga. Trabalho pesado, seis horas.', vai:'c8_carga'},
    {texto:'Cozinha. Trabalho chato, oito horas.', vai:'c8_cozinha'},
    {texto:'"Quantos como eu vocês contratam por temporada?"', vai:'c8_quantos_como_eu'},
    {texto:'Desistir e comprar passagem. (8.000 ₽)', vai:'c8_bordo', cond:d=>d.jogador.dinheiro>=8000,
     ef:{dinheiro:-8000, flag:'pagou_passagem'}}
  ]
},

c8_quantos_como_eu:{
  texto:[
    '"Quantos como eu vocês contratam por temporada?"',
    'O contramestre para de olhar a fila.',
    '"Registrado? Uns quarenta."',
    '"E não registrado?"',
    'Ele te olha por um tempo longo e responde uma coisa completamente diferente:',
    '"Eu contrato registrado, garoto. Com carteira, com exame, com nome em lista."',
    'Ele bate na prancheta dele.',
    '"O que acontece dois convés abaixo do meu não é meu departamento, e eu já perguntei duas vez, e das duas vez me disseram que não é meu departamento."'
  ],
  ef:{flag:'nao_e_meu_departamento',
      npc:{nome:'Contramestre Bruno', opiniao:2, memoria:'Já perguntou duas vezes sobre o que acontece dois conveses abaixo. Disseram que não é o departamento dele.'},
      presagio:'Ele perguntou duas vezes. Duas é mais do que quase todo mundo.'},
  escolhas:[
    {texto:'Carga.', vai:'c8_carga'},
    {texto:'Cozinha.', vai:'c8_cozinha'},
    {texto:'"Pergunta uma terceira vez."', vai:'c8_terceira_vez'},
    {texto:'"O que tem dois conveses abaixo?"', vai:'c8_dois_conveses'}
  ]
},

c8_terceira_vez:{
  texto:[
    '"Pergunta uma terceira vez."',
    'Ele ri.',
    '"Eu tenho sessenta anos e três neto."',
    '"Então pergunta."',
    'O riso para.',
    'Ele olha a fila de adolescentes atrás de você, que é comprida, e depois olha a prancheta, e depois olha o navio.',
    '"Eu vou perguntar."',
    'Ele fala isso devagar, como quem se ouve falando.',
    '"Depois que esse navio zarpar e eu tiver o contrato da temporada assinado, eu vou perguntar uma terceira vez."',
    'É covardia. É também muito mais do que ele ia fazer há cinco minutos.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Empurrou alguém pra uma terceira pergunta'},
      flag:'a_terceira_pergunta',
      npc:{nome:'Contramestre Bruno', opiniao:4, memoria:'Você o convenceu a perguntar uma terceira vez, depois do contrato assinado.'},
      presagio:'Ele vai perguntar depois de assinar o contrato. É covardia e é muito mais do que ontem.'},
  escolhas:[
    {texto:'Carga.', vai:'c8_carga'},
    {texto:'Cozinha.', vai:'c8_cozinha'},
    {texto:'"O que tem dois conveses abaixo?"', vai:'c8_dois_conveses'}
  ]
},

c8_dois_conveses:{
  texto:[
    '"O que tem dois conveses abaixo?"',
    '"Porão de carga."',
    'Ele responde rápido demais.',
    'E depois, porque você não sai, ele baixa a voz sem baixar a guarda:',
    '"E um corredor de acomodação que não tá na planta que eles me deram."',
    'Ele volta pra fila.',
    '"Cozinha ou carga, garoto?"'
  ],
  ef:{flag:'corredor_fora_da_planta', registrar:'Existe um corredor de acomodação fora da planta, dois conveses abaixo do porão de carga do S.S. Anne.',
      presagio:'Fora da planta. Alguém desenhou uma planta e alguém construiu outra coisa.'},
  escolhas:[
    {texto:'Carga.', vai:'c8_carga'},
    {texto:'Cozinha.', vai:'c8_cozinha'},
    {texto:'"Pergunta uma terceira vez."', vai:'c8_terceira_vez'}
  ]
},

c8_carga:{
  texto:[
    'Seis horas carregando caixa num corredor de aço a trinta e oito graus.',
    'Você entende, na primeira hora, que trabalho braçal de verdade não tem nada a ver com esforço: tem a ver com repetição.',
    'É a mesma caixa, o mesmo caminho, o mesmo movimento, seiscentas vezes.'
  ],
  teste:{status:'forca', dificuldade:6, nomeStatus:'Força',
         critico:'c8_carga_ok', sucesso:'c8_carga_ok', parcial:'c8_carga_meio', falha:'c8_carga_ruim'}
},

c8_carga_ok:{
  texto:[
    'Você aguenta. Mais que isso: você aguenta bem o suficiente pro contramestre reparar.',
    '"Você tem passagem, comida e cama de tripulante até Cinnabar." Ele te dá um tapa no ombro que quase te derruba. "E se quiser emprego depois, me procura."',
    'No meio do turno você percebe uma coisa que não consegue mais desperceber.',
    'Três caixas do fundo do corredor têm furo de ventilação.',
    'Caixa de carga não tem furo de ventilação.'
  ],
  ef:{flag:['trabalhou_no_navio','viu_caixas_furadas'], dinheiro:600,
      npc:{nome:'Contramestre Bruno', opiniao:4, memoria:'Você aguentou seis horas de carga sem reclamar.'},
      rep:{eixo:'bom',delta:1,motivo:'Trabalhou honestamente pela passagem'}},
  escolhas:[
    {texto:'Subir para o salão — e pensar nas caixas.', vai:'c8_bordo'},
    {texto:'Ficar no porão e abrir uma agora.', vai:'c8_porao'},
    {texto:'Contar pro contramestre.', vai:'c8_contou_ao_contramestre'},
    {texto:'Procurar a enfermaria do convés dois.', vai:'c8_enfermaria'}
  ]
},

c8_contou_ao_contramestre:{
  texto:[
    '"Tem três caixa com furo de ventilação no fundo do corredor."',
    'Bruno para de escrever.',
    'Ele vai lá. Você vai junto. Ele olha as três caixas por um tempo longo, e passa a mão nos furos, e cheira, o que é a coisa mais eficiente que dá pra fazer.',
    'Depois ele endireita as costas.',
    '"Caixa lacrada de carga geral."',
    '"Tem furo."',
    '"Tem furo." Ele confirma. E aí: "Isso é do manifesto do convés inferior. Isso não é meu."',
    'Ele volta pro corredor. No meio do caminho, sem virar:',
    '"Eu vou perguntar. Não hoje."'
  ],
  ef:{flag:'bruno_vai_perguntar',
      npc:{nome:'Contramestre Bruno', opiniao:3, memoria:'Você mostrou as caixas com furo pra ele. Ele disse que vai perguntar, não hoje.'},
      presagio:'"Não hoje." Você vai ouvir isso de muita gente boa.'},
  escolhas:[
    {texto:'Abrir uma caixa você mesmo.', vai:'c8_porao'},
    {texto:'Subir para o salão.', vai:'c8_bordo'},
    {texto:'Procurar a enfermaria.', vai:'c8_enfermaria'}
  ]
},

c8_carga_meio:{
  texto:[
    'Você aguenta, mal. Nas últimas duas horas é só teimosia e o gosto de ferro na boca.',
    'O contramestre te dá a passagem e nenhum elogio, o que é justo.',
    'Antes de sair do porão, você repara em três caixas com furo de ventilação no fundo do corredor.',
    'Você está cansado demais pra reagir. Mas você repara, e reparar já muda alguma coisa.'
  ],
  ef:{flag:['trabalhou_no_navio','viu_caixas_furadas'], hp:-3, causa:'Turno de carga no S.S. Anne'},
  escolhas:[
    {texto:'Subir para o salão.', vai:'c8_bordo'},
    {texto:'Ficar no porão e olhar as caixas.', vai:'c8_porao'},
    {texto:'Contar pro contramestre.', vai:'c8_contou_ao_contramestre'},
    {texto:'Dormir. Você não aguenta mais.', vai:'c8_bordo'}
  ]
},

c8_carga_ruim:{
  texto:[
    'Você não aguenta.',
    'Na quarta hora, o contramestre te manda parar antes que você se machuque de verdade. Não tem deboche nenhum no jeito dele.',
    '"Sem julgamento", ele diz. "Você tem quinze ano e sessenta quilo. Mas sem passagem também."',
    'Ele te dá comida e um lugar pra sentar no corredor de serviço. É o que ele pode.',
    'Você fica sentado no chão de aço comendo arroz com a mão tremendo, olhando outros adolescentes carregarem caixa.'
  ],
  ef:{hp:-5, causa:'Esforço no porão do S.S. Anne',
      presagio:'Outros adolescentes carregando caixa. Você está sentado olhando. Repara em quantos são.'},
  escolhas:[
    {texto:'Tentar a cozinha.', vai:'c8_cozinha'},
    {texto:'Contar quantos adolescentes estão carregando.', vai:'c8_contou_os_adolescentes'},
    {texto:'Tentar entrar clandestino mais tarde.', vai:'c8_clandestino'},
    {texto:'Desistir do navio.', vai:'c8_fim_porto'}
  ]
},

c8_contou_os_adolescentes:{
  texto:[
    'Você conta.',
    'Dezenove. Dezenove pessoas de menos de vinte anos carregando caixa naquele corredor, no mesmo turno.',
    'Você pergunta pro que está mais perto quantos são registrados.',
    '"Registrado?" Ele nem para de andar. "Eu, não. Eu tô por passagem."',
    'Você pergunta pro próximo. Mesma resposta.',
    'Você pergunta pra cinco. Cinco "por passagem".',
    'Ninguém está mentindo, ninguém está escondendo nada, ninguém acha que isso é errado.',
    'É só como funciona.'
  ],
  ef:{flag:'dezenove_por_passagem',
      registrar:'Dezenove adolescentes carregando carga no S.S. Anne, "por passagem", sem registro.',
      rep:{eixo:'bom',delta:1,motivo:'Contou o que ninguém conta'},
      presagio:'Ninguém acha que é errado. É só como funciona. Essa frase é o motor de tudo.'},
  escolhas:[
    {texto:'Tentar a cozinha.', vai:'c8_cozinha'},
    {texto:'Falar com o contramestre sobre isso.', vai:'c8_quantos_como_eu'},
    {texto:'Tentar entrar clandestino mais tarde.', vai:'c8_clandestino'},
    {texto:'Desistir do navio.', vai:'c8_fim_porto'}
  ]
},

c8_cozinha:{
  texto:[
    'Oito horas descascando, lavando e carregando bandeja. A cozinha do S.S. Anne alimenta setecentas pessoas por noite e tem trinta e dois funcionários.',
    'É quente, é barulhento, e ninguém para.',
    'E você ouve muita coisa, porque cozinha é onde tudo se fala.',
    '"...o do camarote 40 trouxe de novo."',
    '"Não é da nossa conta."',
    '"Tinha um garoto junto, esse ano."',
    '"NÃO É DA NOSSA CONTA."'
  ],
  ef:{flag:['trabalhou_no_navio','ouviu_camarote_40'], dinheiro:400,
      rep:{eixo:'bom',delta:1,motivo:'Trabalhou honestamente pela passagem'},
      registrar:'Ouviu falar do camarote 40 na cozinha do S.S. Anne.'},
  escolhas:[
    {texto:'Perguntar quem montou as bandejas do 40.', vai:'c8_bandejas_do_40'},
    {texto:'Se oferecer pra levar a bandeja do 40.', vai:'c8_levou_a_bandeja'},
    {texto:'Subir para o salão quando o turno acabar.', vai:'c8_bordo'},
    {texto:'Não se meter. Terminar o turno.', vai:'c8_bordo'}
  ]
},

c8_bandejas_do_40:{
  texto:[
    '"Quem monta as bandeja do quarenta?"',
    'A cozinha inteira não para, mas três pessoas olham pra você ao mesmo tempo, e isso é mais eloquente que qualquer resposta.',
    'Um cozinheiro de uns trinta anos responde sem olhar:',
    '"A Neusa monta."',
    '"Quantas?"',
    'Pausa de dois segundos e o barulho de panela continua.',
    '"Quatro."',
    'Ele vira a chapa.',
    '"E a gente não fala disso na cozinha, garoto. A gente fala disso no bar."'
  ],
  ef:{flag:'quatro_bandejas',
      registrar:'Quatro bandejas por dia para o camarote 40.',
      presagio:'"A gente não fala disso na cozinha. A gente fala disso no bar." Todo lugar tem o cômodo onde se fala.'},
  escolhas:[
    {texto:'Se oferecer pra levar a bandeja.', vai:'c8_levou_a_bandeja'},
    {texto:'Terminar o turno e subir.', vai:'c8_bordo'},
    {texto:'Procurar o corredor de serviço do convés três.', vai:'c8_corredor_servico'}
  ]
},

c8_levou_a_bandeja:{
  texto:[
    '"Eu levo a do quarenta."',
    'Ninguém discute. Ninguém quer levar a do quarenta.',
    'São quatro bandejas empilhadas num carrinho, com cúpula de metal em cima de cada prato.',
    'O corredor do convés três é carpetado e silencioso de um jeito que o resto do navio não é.',
    'Na porta do 40 tem um homem sentado numa cadeira dobrável, lendo um livro de bolso.',
    'Ele levanta a cabeça, olha o carrinho, e aponta o chão.',
    '"Aí."',
    'Você põe as quatro bandejas no chão do corredor. Ele volta pro livro.',
    'A porta não abre enquanto você está lá. Você demora de propósito arrumando o carrinho. A porta não abre.'
  ],
  ef:{flag:['levou_a_bandeja','ouviu_camarote_40','quatro_bandejas'],
      registrar:'Levou as quatro bandejas ao camarote 40. A porta não abriu.',
      presagio:'A porta não abre enquanto tem alguém no corredor. Isso é uma regra, e regras têm horário.'},
  escolhas:[
    {texto:'Voltar depois pra pegar as bandejas vazias.', vai:'c8_bandejas_vazias'},
    {texto:'Perguntar alguma coisa pro homem da cadeira.', vai:'c8_homem_da_cadeira'},
    {texto:'Terminar o turno e subir pro salão.', vai:'c8_bordo'},
    {texto:'Procurar o corredor de serviço.', vai:'c8_corredor_servico'}
  ]
},

c8_bandejas_vazias:{
  texto:[
    'Quarenta minutos depois você volta com o carrinho.',
    'As quatro bandejas estão empilhadas no chão do corredor, vazias.',
    'Você recolhe.',
    'E aí você repara: três estão limpas do jeito que prato fica quando alguém come com talher.',
    'A quarta está limpa do jeito que prato fica quando alguém come com a mão.'
  ],
  ef:{flag:'a_quarta_bandeja',
      registrar:'Das quatro bandejas do camarote 40, três foram comidas com talher e uma com a mão.',
      presagio:'Três com talher, uma com a mão. Repara em quantas informações cabem num prato sujo.'},
  escolhas:[
    {texto:'Perguntar alguma coisa pro homem da cadeira.', vai:'c8_homem_da_cadeira'},
    {texto:'Voltar amanhã e conferir de novo.', vai:'c8_conferiu_de_novo'},
    {texto:'Subir pro salão.', vai:'c8_bordo'},
    {texto:'Procurar o corredor de serviço.', vai:'c8_corredor_servico'}
  ]
},

c8_conferiu_de_novo:{
  texto:[
    'Você faz o serviço do camarote 40 por três dias.',
    'Todo dia: quatro bandejas. Três com talher, uma sem.',
    'No segundo dia você põe, sem falar com ninguém, um bilhete embaixo da quarta bandeja.',
    'Está escrito: "VOCÊ TÁ BEM?"',
    'No terceiro dia, quando você recolhe, o bilhete voltou.',
    'Do outro lado, escrito com o dedo molhado em molho, quase ilegível, uma palavra:',
    '"NAO"'
  ],
  ef:{flag:['contato_no_40','o_bilhete'],
      rep:{eixo:'bom',delta:3,motivo:'Mandou um bilhete pra dentro de uma porta que não abre'},
      registrar:'Alguém dentro do camarote 40 respondeu "NAO" num bilhete escrito com molho.',
      presagio:'Escrito com o dedo molhado em molho. Quem está lá dentro não tem caneta.'},
  escolhas:[
    {texto:'Mandar outro bilhete perguntando o nome.', vai:'c8_segundo_bilhete'},
    {texto:'Procurar o capitão agora.', vai:'c8_capitao'},
    {texto:'Entrar no camarote 40 de qualquer jeito.', vai:'c8_camarote'},
    {texto:'Procurar o corredor de serviço.', vai:'c8_corredor_servico'}
  ]
},

c8_segundo_bilhete:{
  texto:[
    'Você manda outro. "QUAL SEU NOME?"',
    'Volta no dia seguinte, com o mesmo molho, num guardanapo em vez do bilhete, porque o bilhete não voltou.',
    'Está escrito: "DENIS"',
    d=>d.flags.a_carta_do_denis || d.flags.copiou_a_carta
      ? 'Você senta no chão do corredor de serviço com um guardanapo na mão e fica um tempo sem conseguir respirar direito.'
      : 'Você não conhece nenhum Denis. Mas agora tem um nome, e nome é tudo.',
    'Embaixo, menor, quase sem molho porque estava acabando:',
    '"SOMOS 2"'
  ],
  ef:{flag:['o_denis_esta_no_40','somos_2'],
      rep:{eixo:'bom',delta:2,motivo:'Insistiu até ter um nome'},
      registrar:'Dentro do camarote 40: Denis, e mais um. "SOMOS 2".',
      presagio:'Somos dois. Quatro bandejas, duas camas, dois que comem com talher e dois que não.'},
  escolhas:[
    {texto:'Procurar o capitão.', vai:'c8_capitao'},
    {texto:'Entrar no camarote 40.', vai:'c8_camarote'},
    {texto:'Procurar o corredor de serviço do convés três.', vai:'c8_corredor_servico'},
    {texto:'Subir pro salão e achar quem é do camarote.', vai:'c8_bordo'}
  ]
},

c8_homem_da_cadeira:{
  texto:[
    'Você pergunta a coisa mais inofensiva que consegue pensar.',
    '"O senhor quer água?"',
    'Ele levanta a cabeça do livro de bolso.',
    'Tem uns cinquenta anos, camisa social sem gravata, e um jeito de sentar que não é de segurança de balada: é de quem já ficou muito tempo sentado em cadeira dobrável em corredor.',
    '"Quero."',
    'Você traz. Ele agradece e volta pro livro.',
    'O livro é um romance policial de banca. Ele está na página duzentos e poucos.',
    'No terceiro dia ele vai estar com outro livro.'
  ],
  ef:{flag:'o_homem_do_corredor',
      npc:{nome:'Homem do corredor', opiniao:1, memoria:'Você levou água pra ele no corredor do camarote 40.'},
      presagio:'Ele lê um romance por temporada e não pergunta nada. É a pessoa mais perigosa desse navio.'},
  escolhas:[
    {texto:'Voltar depois pra pegar as bandejas vazias.', vai:'c8_bandejas_vazias'},
    {texto:'Perguntar o que tem lá dentro.', vai:'c8_perguntou_o_que_tem'},
    {texto:'Terminar o turno e subir.', vai:'c8_bordo'},
    {texto:'Procurar o corredor de serviço.', vai:'c8_corredor_servico'}
  ]
},

c8_perguntou_o_que_tem:{
  texto:[
    '"O que tem aí dentro?"',
    'Ele marca a página com o dedo.',
    '"Hóspede."',
    '"Quatro bandeja pra dois hóspede."',
    'Ele olha pra você por uns três segundos e volta pro livro.',
    '"Você tem quantos anos?"',
    '"Quinze."',
    '"Quinze." Ele vira a página. "Então você ainda vai fazer muita pergunta e um dia você vai parar. Eu parei aos trinta e um."',
    'Ele não olha mais pra você.',
    '"Traz a água amanhã também."'
  ],
  ef:{flag:'ele_parou_aos_31',
      presagio:'"Eu parei aos trinta e um." Ele falou isso sem nenhum arrependimento, e é isso que gela.'},
  escolhas:[
    {texto:'Voltar pra pegar as bandejas vazias.', vai:'c8_bandejas_vazias'},
    {texto:'Procurar o capitão.', vai:'c8_capitao'},
    {texto:'Subir pro salão.', vai:'c8_bordo'},
    {texto:'Procurar o corredor de serviço.', vai:'c8_corredor_servico'}
  ]
}

}}

);
