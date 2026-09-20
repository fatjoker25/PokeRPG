/* ============================================================
   CAPÍTULO 17 — O JARDIM  (Rota 23 / Caminho Vitória)
   ============================================================ */
CAPITULOS.push(
{
num:17, titulo:'O Jardim', local:'Rota 23 / Caminho Vitória', ambiente:'floresta', nivelArea:50,
tom:'muito sombrio', inicio:'c17_envelope',
cenas:{

c17_envelope:{
  texto:[
    'O envelope tem timbre em relevo e chega na sua mão num Centro Pokémon, entregue pela atendente, que já estava com ele separado atrás do balcão há três dias.',
    'Papel de gramatura alta, dobra em três, e uma frase:',
    '**"Sua presença é solicitada no Planalto Indigo. Apresentar-se à recepção com as insígnias em mãos."**',
    'Sem data. Sem prazo. Sem assinatura — só um carimbo.',
    'Você lê três vezes e guarda pra depois, porque tem um garoto encostado no poste do lado de fora do Centro que está te esperando há pelo menos uma hora.',
    d=>{
      const t=d.npcs['Téo'];
      if (!t) return 'Ou tinha. Quando você sai, o poste está vazio e tem uma bituca de cigarro no chão que você não sabe de quem é. Você segue sozinho para a Rota 23.';
      if (t.opiniao>=3) return '"Eu sabia que você ia passar por aqui." Téo fala rápido demais, do jeito dele. "Cara, eu preciso te mostrar uma coisa e você vai achar que eu tô louco."';
      if (t.opiniao<=-2) return '"Não vim te cumprimentar." Téo não estende a mão. "Vim porque não tem mais ninguém pra quem contar isso, e isso me irrita muito."';
      return '"Ô." Téo enfia as mãos no bolso. "Eu preciso mostrar uma coisa pra alguém que não vai rir."';
    }
  ],
  ef:{registrar:'Recebeu a convocação da Liga.',
      presagio:'Sem data e sem prazo. Convocação sem prazo é convocação de quem não sabe se vai estar lá.'},
  escolhas:[
    {texto:'"Mostra."', vai:'c17_teo_mostra', cond:d=>!!d.npcs['Téo']},
    {texto:'Ler o envelope inteiro primeiro.', vai:'c17_leu_o_envelope'},
    {texto:'Ir direto para o Planalto. A Liga te chamou.', vai:'c17_pulou', cond:d=>!!d.npcs['Téo']},
    {texto:'Seguir sozinho pela Rota 23.', vai:'c17_rota23', cond:d=>!d.npcs['Téo']}
  ]
},

c17_leu_o_envelope:{
  texto:[
    'Você abre o envelope inteiro, que tem duas folhas e não uma.',
    'A primeira é a convocação.',
    'A segunda é um anexo de meia página, em fonte menor, que quase ninguém leria:',
    '**"Comunicado aos convocados: em razão de reestruturação administrativa em curso, o acesso ao Planalto Indigo permanece por conta e risco do desafiante. Os postos de controle das Rotas 22 e 23 estão temporariamente desguarnecidos."**',
    'Você lê essa frase quatro vezes.',
    'Os postos de controle da Rota 23 — a última antes do Caminho da Vitória, a rota de acesso ao Planalto — estão desguarnecidos.',
    'A Liga Pokémon convocou desafiantes e avisou, em corpo oito, que tirou a segurança do caminho.',
    d=>d.npcs['Téo'] ? 'Você levanta a cabeça e o Téo está te olhando com as mãos no bolso, esperando você terminar de ler pra poder falar.' : 'E não tem ninguém pra mostrar isso.'
  ],
  ef:{flag:['leu_o_anexo','sabe_dos_postos_vazios'],
      rep:{eixo:'bom',delta:2,motivo:'Leu a segunda folha'},
      registrar:'Os postos de controle das rotas 22 e 23 estão desguarnecidos por "reestruturação administrativa".',
      presagio:'Reestruturação administrativa. Guarde — o próximo capítulo é sobre isso.'},
  escolhas:[
    {texto:'"Mostra o que você tem."', vai:'c17_teo_mostra', cond:d=>!!d.npcs['Téo']},
    {texto:'Ir pra Rota 23.', vai:'c17_rota23'},
    {texto:'Ir direto pro Planalto.', vai:'c17_pulou', cond:d=>!!d.npcs['Téo']},
    {texto:'Perguntar na recepção do Centro o que é reestruturação.', vai:'c17_perguntou_no_centro'}
  ]
},

c17_perguntou_no_centro:{
  texto:[
    'A atendente do Centro tem uns trinta anos e já respondeu essa pergunta hoje.',
    '"Eu não sei, e eu já perguntei."',
    'Ela mostra um mural atrás do balcão com quatro comunicados afixados.',
    'O mais novo, de doze dias atrás, tem duas linhas:',
    '**"Suspensa até segunda ordem a escala de plantão dos postos 22-A, 22-B, 23-A e 23-B. Servidores realocados."**',
    '"Realocados pra onde?"',
    '"Não diz."',
    'Ela ajeita o comunicado no mural, que não precisava ser ajeitado.',
    '"Eu conheço três dos servidores dos postos. Dois foram pra Viridian e um tirou licença."',
    '"E pra que tem gente indo pra Viridian?"',
    'Ela olha pros lados num Centro Pokémon vazio.',
    '"Ninguém me disse. Mas o ginásio de Viridian tá fechado há oito meses e alguém tá indo trabalhar lá."'
  ],
  ef:{flag:['sabe_de_viridian','sabe_dos_postos_vazios'],
      npc:{nome:'Atendente do Centro', opiniao:3, memoria:'Te mostrou o comunicado de suspensão de plantão e contou que servidores foram realocados para Viridian.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou o que significava e conferiu no mural'},
      registrar:'Servidores dos postos 22 e 23 foram realocados para Viridian, cujo ginásio está fechado há oito meses.',
      presagio:'Viridian. O ginásio fechado há oito meses. Guarde os dois.'},
  escolhas:[
    {texto:'"Mostra o que você tem."', vai:'c17_teo_mostra', cond:d=>!!d.npcs['Téo']},
    {texto:'Ir pra Rota 23.', vai:'c17_rota23'},
    {texto:'Ir direto pro Planalto.', vai:'c17_pulou', cond:d=>!!d.npcs['Téo']},
    {texto:'Anotar tudo e seguir.', vai:'c17_rota23', ef:{flag:'anotou_viridian'}}
  ]
},

c17_pulou:{
  texto:[
    '"A Liga me chamou."',
    'Téo assente devagar.',
    '"Claro. Beleza."',
    'Ele guarda o Pokégear sem te mostrar a foto e enfia as duas mãos no bolso.',
    '"Boa sorte lá, hein."',
    'Ele vai embora, e o jeito que ele vai embora — sem pressa, sem drama, olhando o chão — diz que você acabou de perder uma coisa que não volta.',
    'A três quarteirões ele para na esquina e olha pra trás uma vez.',
    'E você já está de costas.'
  ],
  ef:{flag:'pulou_o_teo', moral:-10,
      npc:{nome:'Téo', opiniao:-3, memoria:'Guardou o Pokégear sem te mostrar a foto e foi embora olhando o chão.'},
      registrar:'Não quis ver o que Téo tinha para mostrar.',
      presagio:'Ele parou na esquina e olhou pra trás. Você estava de costas.'},
  escolhas:[
    {texto:'Voltar e chamar ele.', vai:'c17_voltou_no_teo'},
    {texto:'Seguir pra Rota 23.', vai:'c17_rota23'},
    {texto:'Seguir direto pro Planalto.', vai:'c17_fim'},
    {texto:'Ler o envelope inteiro antes.', vai:'c17_leu_o_envelope'}
  ]
},

c17_voltou_no_teo:{
  texto:[
    'Você corre três quarteirões e alcança ele na esquina.',
    '"Mostra."',
    'Ele não vira.',
    '"Agora você quer ver."',
    '"Agora eu quero ver."',
    'Ele fica de costas mais uns cinco segundos, que são cinco segundos longos, e depois vira e tira o Pokégear do bolso.',
    'E antes de ligar ele fala uma coisa:',
    '"Eu vim de ônibus. Quatro horas."',
    '"Eu sei."',
    '"Você não sabia."',
    'Ele liga o Pokégear.',
    '"Agora você sabe."'
  ],
  ef:{flag:'voltou_no_teo', limpaFlag:'pulou_o_teo',
      npc:{nome:'Téo', opiniao:2, memoria:'Você voltou correndo três quarteirões. Ele veio de ônibus, quatro horas.'},
      rep:{eixo:'bom',delta:3,motivo:'Voltou correndo'},
      moral:10,
      presagio:'Quatro horas de ônibus. Ele não falou isso pra te cobrar. Ele falou porque era verdade.'},
  escolhas:[{texto:'Ver as fotos.', vai:'c17_teo_mostra'}]
},

c17_teo_mostra:{
  texto:[
    'Ele mostra uma foto no Pokégear. Está tremida e é de longe.',
    'É uma clareira. No meio dela, pairando a um metro do chão, tem uma coisa pequena, rosa, com cauda comprida.',
    '"Isso é um borrão", você diz.',
    '"Eu sei."',
    'Ele passa pra próxima. E pra próxima.',
    'São nove.',
    'Na terceira, dá pra ver que tem forma. Na quinta, dá pra ver que tem cauda e que a cauda é mais comprida que o corpo.',
    'Na sétima, a coisa está olhando pra câmera.',
    'Na nona, ela está muito mais perto — tão perto que ocupa metade do quadro, e a foto está desfocada porque o Pokégear não consegue focar tão perto.',
    '"Eu tirei nove fotos em dois minutos e ela deixou."',
    'Ele fica olhando a nona.',
    '"Ela ficou, cara. Ela foi chegando."',
    '"E aí?"',
    '"E aí ela sumiu e eu fiquei sentado no chão daquela clareira por uma hora sem conseguir levantar."',
    'Ele guarda o Pokégear.',
    '"Isso foi na Rota 23. Terça."'
  ],
  ef:{flag:['viu_as_fotos','sabe_do_jardim'],
      npc:{nome:'Téo', opiniao:3, memoria:'Te mostrou nove fotos de Mew numa clareira da Rota 23.'},
      registrar:'Téo fotografou Mew numa clareira da Rota 23, na terça.',
      presagio:'Ela foi chegando. Guarde: ela chegou perto de um garoto com Pokégear.'},
  escolhas:[
    {texto:'"Quem mais viu isso?"', vai:'c17_quem_viu'},
    {texto:'"O que você tava fazendo na Rota 23?"', vai:'c17_o_que_fazia'},
    {texto:'"Me leva lá."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Apaga essas fotos."', vai:'c17_apagar'}
  ]
},

c17_o_que_fazia:{
  texto:[
    '"O que você tava fazendo na Rota 23?"',
    'Ele demora.',
    '"Indo pro Planalto."',
    '"Você tem oito insígnias?"',
    '"Eu tenho quatro."',
    'Ele olha o chão.',
    '"Eu tava indo olhar."',
    '"Olhar?"',
    '"Cara, eu sei que é idiota. Eu ia subir a Rota 23, chegar na base do Caminho da Vitória, olhar, e voltar."',
    'Ele chuta uma pedrinha.',
    '"Eu queria ver de perto uma vez. A entrada. Só isso."',
    'Silêncio.',
    '"E aí eu me perdi da trilha, porque eu sou péssimo de mato, e aí eu achei uma clareira."',
    'Ele levanta a cabeça.',
    '"A coisa mais importante que já aconteceu comigo aconteceu porque eu me perdi indo olhar uma porta que eu não podia atravessar."'
  ],
  ef:{flag:'sabe_do_teo',
      npc:{nome:'Téo', opiniao:5, memoria:'Ia à Rota 23 só para olhar a entrada do Caminho da Vitória, com quatro insígnias, e se perdeu.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou o que ele estava fazendo lá'},
      moral:8,
      registrar:'Téo tem quatro insígnias e ia à Rota 23 só para olhar a entrada.',
      presagio:'Ele se perdeu indo olhar uma porta que não podia atravessar. Repara.'},
  escolhas:[
    {texto:'"Quem mais viu isso?"', vai:'c17_quem_viu'},
    {texto:'"Me leva lá."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Vem comigo pro Planalto depois."', vai:'c17_convidou_teo'},
    {texto:'"Apaga essas fotos."', vai:'c17_apagar'}
  ]
},

c17_convidou_teo:{
  texto:[
    '"Vem comigo pro Planalto depois."',
    '"Eu tenho quatro insígnias."',
    '"Eu sei. Vem como acompanhante."',
    'Ele abre a boca e fecha.',
    '"Pode?"',
    '"Não sei. Tá escrito que eu me apresento com as insígnias em mãos. Não tá escrito que eu me apresento sozinho."',
    'Ele ri — uma risada curta e feia, dessas de quem está tentando não fazer outra coisa com o rosto.',
    '"Cara."',
    'Ele passa a mão no cabelo.',
    '"Cara."',
    'E é só isso que ele consegue falar por uns quinze segundos.'
  ],
  ef:{flag:['teo_vai_junto','teo_acompanhante'],
      npc:{nome:'Téo', opiniao:8, memoria:'Foi convidado a ir ao Planalto Indigo como acompanhante, com quatro insígnias.'},
      rep:{eixo:'bom',delta:4,motivo:'Convidou quem não podia entrar'},
      moral:15,
      registrar:'Téo vai ao Planalto Indigo com você, como acompanhante.',
      presagio:'"Não tá escrito que eu me apresento sozinho." Você está aprendendo a ler regulamento.'},
  escolhas:[
    {texto:'"Agora me leva na clareira."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Quem mais viu isso?"', vai:'c17_quem_viu'},
    {texto:'"Apaga as fotos antes."', vai:'c17_apagar'},
    {texto:'Ir os dois pra Rota 23.', vai:'c17_rota23', ef:{flag:'teo_leva'}}
  ]
},

c17_quem_viu:{
  texto:[
    '"Quem mais viu isso?"',
    'Téo fica branco.',
    'Não é figura de linguagem: a cor sai do rosto dele em tempo real e você vê acontecer.',
    '"Eu postei uma."',
    'Ele fala muito baixo.',
    '"A terceira. Num grupo de treinadores da minha cidade. Terça à noite. Umas onze da noite."',
    '"E?"',
    '"E na quarta de manhã tinha três pessoas perguntando na minha cidade onde eu morava."',
    'Ele olha em volta pela primeira vez na conversa inteira — olha a rua, os dois lados, o Centro atrás de vocês.',
    '"Cara."',
    'Ele engole.',
    '"Eu acho que eu fiz merda."'
  ],
  ef:{flag:['foto_vazou','tem_gente_atras_do_mew'], instabilidade:1,
      npc:{nome:'Téo', opiniao:3, memoria:'Postou uma das fotos num grupo e na manhã seguinte tinha gente perguntando onde ele morava.'},
      registrar:'Téo postou uma foto de Mew num grupo. Três pessoas foram procurá-lo no dia seguinte.',
      presagio:'Onze da noite de terça e nove horas depois tinha gente na cidade dele. Nove horas.'},
  escolhas:[
    {texto:'"Apaga tudo e some da sua cidade por uma semana."', vai:'c17_apagar'},
    {texto:'"Como eram as três pessoas?"', vai:'c17_as_tres_pessoas'},
    {texto:'"Então a gente vai lá agora, antes deles."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Não foi merda. Foi merda o grupo."', vai:'c17_nao_foi_merda'}
  ]
},

c17_nao_foi_merda:{
  texto:[
    '"Não foi merda."',
    '"Foi."',
    '"Você tirou nove fotos de uma coisa que ninguém nunca fotografou e mostrou pra gente que você achava que ia gostar. Isso é a coisa mais normal do mundo."',
    'Ele não olha pra você.',
    '"Merda foi ter gente num grupo de treinadores que ganha por informação."',
    'Ele fica quieto um tempo.',
    '"É a mesma coisa."',
    '"Não é."',
    'Você fala isso com uma firmeza que surpreende vocês dois.',
    '"Se fosse a mesma coisa, ninguém ia poder contar nada pra ninguém nunca, e aí quem vende informação ganhava de qualquer jeito."',
    'Ele solta o ar.',
    '"Você melhorou de falar."',
    '"Eu tive aula com umas pessoas."'
  ],
  ef:{flag:'consolou_o_teo',
      npc:{nome:'Téo', opiniao:6, memoria:'Você separou o erro dele do erro do grupo, e ele reparou que você melhorou de falar.'},
      rep:{eixo:'bom',delta:3,motivo:'Não deixou alguém carregar culpa alheia'},
      moral:10,
      presagio:'"Eu tive aula com umas pessoas." Você teve. Conte quantas.'},
  escolhas:[
    {texto:'"Como eram as três pessoas?"', vai:'c17_as_tres_pessoas'},
    {texto:'"Apaga as fotos mesmo assim."', vai:'c17_apagar'},
    {texto:'"Me leva lá."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Vem comigo pro Planalto depois."', vai:'c17_convidou_teo'}
  ]
},

c17_as_tres_pessoas:{
  texto:[
    '"Como eram as três pessoas?"',
    'Ele descreve o que ele conseguiu ver da janela da tia dele, que é de onde ele viu.',
    '"Dois homens e uma mulher. Vinte e poucos, trinta. Roupa de trilha nova demais, aquela que ainda tem vinco de loja."',
    '"E eles perguntaram pra quem?"',
    '"Pro seu Nilton da mercearia. Perguntaram pelo “moleque das fotos”."',
    '"E o seu Nilton falou?"',
    '"Falou que não sabia."',
    'Ele finalmente olha pra você.',
    '"E aí ele fechou a mercearia às onze da manhã, na quarta, coisa que ele não faz desde que a mulher dele morreu, e foi na casa da minha tia me avisar."',
    'Ele mexe no Pokégear sem ligar.',
    '"E ele não me conhece direito, cara. Eu compro pão lá."'
  ],
  ef:{flag:['sabe_dos_tres_de_trilha','tem_gente_atras_do_mew'],
      npc:{nome:'Téo', opiniao:5, memoria:'O dono da mercearia fechou a loja às 11h da manhã para ir avisá-lo.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou como eram'},
      moral:8,
      registrar:'Três pessoas com roupa de trilha nova procuraram Téo. O dono da mercearia fechou a loja para avisá-lo.',
      presagio:'Ele compra pão lá. Foi o suficiente.'},
  escolhas:[
    {texto:'"Apaga as fotos."', vai:'c17_apagar'},
    {texto:'"Então a gente vai lá agora."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Vem comigo pro Planalto depois."', vai:'c17_convidou_teo'},
    {texto:'"A gente não vai. E você esquece."', vai:'c17_esqueceu'}
  ]
},

c17_apagar:{
  texto:[
    '"Apaga essas fotos."',
    'Ele apaga as nove na sua frente, uma por uma, e o Pokégear pergunta "apagar?" nove vezes e ele responde nove vezes.',
    'Na sétima — a que ela está olhando pra câmera — ele para uns três segundos antes de confirmar.',
    'Na nona, a mão dele treme um pouco.',
    '"Isso era a coisa mais importante que já aconteceu comigo."',
    '"Eu sei."',
    '"Você tá certo. Eu sei que você tá certo."',
    'Ele guarda o Pokégear no bolso.',
    '"Mas isso era a coisa mais importante que já aconteceu comigo."',
    'E ele fala isso duas vezes porque ele precisa que fique claro que ele sabe as duas coisas ao mesmo tempo.'
  ],
  ef:{flag:'fotos_apagadas', limpaFlag:'foto_vazou',
      rep:{eixo:'bom',delta:3,motivo:'Protegeu um lendário apagando a única prova dele'},
      npc:{nome:'Téo', opiniao:4, memoria:'Apagou as nove fotos de Mew, uma por uma, porque você pediu.'},
      moral:-5,
      registrar:'Téo apagou as nove fotos.',
      presagio:'Ele falou duas vezes. Ele precisava que ficasse claro.'},
  escolhas:[
    {texto:'"Agora me leva lá. Só nós dois."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"E agora a gente esquece que isso existiu."', vai:'c17_esqueceu'},
    {texto:'"Me descreve tudo. Pra mim."', vai:'c17_descreveu'},
    {texto:'"Vem comigo pro Planalto."', vai:'c17_convidou_teo'}
  ]
},

c17_descreveu:{
  texto:[
    '"Me descreve tudo. Pra mim. Agora, antes de você esquecer."',
    '"Por quê?"',
    '"Porque você apagou as fotos e daqui a dez anos você vai achar que inventou."',
    'Ele para.',
    '"Ah."',
    'E aí ele descreve.',
    'Por quarenta minutos, na calçada de um Centro Pokémon, um garoto de quinze anos descreve dois minutos da vida dele pra outro garoto de quinze anos que está anotando num caderno.',
    'O tamanho: menor que um Meowth, com a cauda mais comprida que o corpo. A cor: rosa, mas rosa de pele e não de pelo. O som: nenhum. Nenhum som nenhuma vez.',
    'A grama embaixo dela não mexia.',
    'Ela pairava a um metro e dez do chão e ele sabe a altura porque ele é de um metro e setenta e ela batia no peito dele.',
    'E na sétima foto ela olhou pra câmera e ele conta que naquele momento ele parou de respirar e que ele lembra disso melhor do que lembra do rosto do avô dele.',
    'Você anota tudo.',
    'Doze páginas.'
  ],
  ef:{flag:['descreveu_mew','registro_do_teo'],
      itens:{'Doze páginas de descrição':1},
      npc:{nome:'Téo', opiniao:7, memoria:'Ditou por quarenta minutos a descrição do que viu, para você anotar, depois de apagar as fotos.'},
      rep:{eixo:'bom',delta:5,motivo:'Transformou uma foto apagada em registro escrito'},
      moral:15,
      registrar:'Téo ditou doze páginas de descrição de Mew, depois de apagar as fotos.',
      presagio:'Doze páginas. Isso não é prova. É melhor que prova: é testemunho anotado na hora.'},
  escolhas:[
    {texto:'"Agora me leva lá."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"E agora a gente esquece."', vai:'c17_esqueceu'},
    {texto:'"Vem comigo pro Planalto."', vai:'c17_convidou_teo'},
    {texto:'"Assina embaixo."', vai:'c17_assinou'}
  ]
},

c17_assinou:{
  texto:[
    '"Assina embaixo."',
    '"Como assim assina?"',
    '"Assina, põe a data e a hora."',
    'Ele olha as doze páginas.',
    '"Isso vira o quê?"',
    '"Vira uma coisa que existe."',
    'Ele pega a caneta e assina, e escreve a data e a hora, e a letra dele é ruim.',
    'E depois ele fica olhando a própria assinatura.',
    '"Eu nunca assinei nada na vida."',
    '"Você tem quinze anos."',
    '"É." Ele devolve a caneta. "Mas eu nunca assinei nada na vida."',
    'E ele fala isso do jeito de quem acabou de descobrir que assinar é uma coisa que existe e que ele pode fazer.'
  ],
  ef:{flag:['teo_assinou','registro_do_teo'],
      npc:{nome:'Téo', opiniao:9, memoria:'Assinou as doze páginas com data e hora. Foi a primeira coisa que ele assinou na vida.'},
      rep:{eixo:'bom',delta:5,motivo:'Fez um depoimento virar documento'},
      moral:15,
      registrar:'Téo assinou o depoimento com data e hora.',
      presagio:'"Eu nunca assinei nada na vida." Agora ele sabe que pode.'},
  escolhas:[
    {texto:'"Agora me leva lá."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"E agora a gente esquece."', vai:'c17_esqueceu'},
    {texto:'"Vem comigo pro Planalto."', vai:'c17_convidou_teo'},
    {texto:'Guardar as doze páginas e ir pra rota.', vai:'c17_rota23'}
  ]
},

c17_esqueceu:{
  texto:[
    'Vocês não vão à clareira.',
    'Téo volta pra cidade dele de ônibus, quatro horas, no mesmo dia.',
    'Você segue pro Planalto.',
    'Nenhum dos dois toca no assunto de novo — não naquele mês, não naquele ano.',
    'E é exatamente por isso que funciona.',
    'A única coisa que protege Mew é ninguém saber, e a única forma de ninguém saber é ninguém contar, e a única forma de ninguém contar é duas pessoas de quinze anos decidirem carregar uma coisa grande demais em silêncio pelo resto da vida.',
    'É a decisão mais madura da sua jornada inteira.',
    'E ela não tem recompensa nenhuma, porque decisão madura nunca tem, e é por isso que quase ninguém toma.'
  ],
  ef:{flag:'protegeu_mew_pelo_silencio',
      rep:{eixo:'bom',delta:4,motivo:'Protegeu Mew da melhor forma possível: não indo'},
      moral:10,
      executar:d=>{ const L=Estado.lend(151); if(L) L.disposicao='passivo'; return []; },
      npc:{nome:'Téo', opiniao:6, memoria:'Voltou para casa de ônibus sem ir à clareira. Vocês nunca mais tocaram no assunto.'},
      registrar:'Escolheu nunca procurar Mew. É a proteção mais eficaz que existe.',
      presagio:'Decisão madura nunca tem recompensa. É por isso que quase ninguém toma.'},
  escolhas:[
    {texto:'Seguir para o Planalto.', vai:'c17_fim'},
    {texto:'Mudar de ideia e ir.', vai:'c17_rota23'},
    {texto:'Convidar o Téo pro Planalto antes.', vai:'c17_convidou_teo'},
    {texto:'Ir com ele até a rodoviária.', vai:'c17_rodoviaria'}
  ]
},

c17_rodoviaria:{
  texto:[
    'Você vai com ele até a rodoviária, que fica a seis quarteirões, e vocês andam os seis quarteirões falando de coisa nenhuma.',
    'De time. De uma partida de quatro anos atrás. De uma professora que os dois tiveram e que os dois odiavam e que agora, com a distância, os dois acham que era boa.',
    'Na plataforma, com o ônibus já com o motor ligado, ele fala:',
    '"Eu vou contar pra minha mãe."',
    '"Conta."',
    '"Ela não vai acreditar."',
    '"Não vai."',
    'Ele sobe o primeiro degrau do ônibus e para.',
    '"Mas ela vai fingir que acredita, porque ela é minha mãe."',
    'Ele sobe.',
    '"E isso já é bom."'
  ],
  ef:{flag:'levou_o_teo_na_rodoviaria',
      npc:{nome:'Téo', opiniao:7, memoria:'Vocês andaram seis quarteirões falando de coisa nenhuma até a rodoviária.'},
      rep:{eixo:'bom',delta:2,motivo:'Andou seis quarteirões com alguém até a rodoviária'},
      moral:12,
      presagio:'"Ela vai fingir que acredita, porque ela é minha mãe. E isso já é bom." Guarde.'},
  escolhas:[
    {texto:'Seguir para o Planalto.', vai:'c17_fim'},
    {texto:'Ir pra Rota 23 assim mesmo.', vai:'c17_rota23'},
    {texto:'Pegar o ônibus com ele.', vai:'c17_fim'},
    {texto:'Ficar na plataforma até o ônibus sair.', vai:'c17_fim'}
  ]
},

/* ─────────────── A ROTA 23 ─────────────── */

c17_rota23:{
  texto:[
    'A Rota 23 é a última antes do Caminho da Vitória.',
    'É uma faixa de mato fechado de nove quilômetros entre duas paredes de rocha, com uma trilha de terra batida no meio e quatro postos de controle de alvenaria a cada dois quilômetros e meio.',
    'Os quatro estão vazios.',
    'Porta aberta, luz apagada, cadeira virada pra fora, e num deles uma garrafa térmica em cima da mesa.',
    'Você abre a garrafa térmica do terceiro posto.',
    'Tem café dentro. Frio, mas ainda líquido, ainda com cheiro.',
    'Isso não está vazio há semanas.',
    'Isso está vazio há dias.',
    d=>d.flags.teo_leva ? 'Téo vai na frente. Ele fez esse caminho três vezes desde terça e ele não acha nenhum dos postos estranho, porque ele nunca viu eles ocupados.' :
       'Você encontra o desvio por acaso, o que é impossível, e você sabe que é impossível.'
  ],
  ef:{flag:['entrou_na_rota_23','postos_vazios_ha_dias'],
      registrar:'Os quatro postos de controle da Rota 23 estão vazios há dias, não semanas.',
      presagio:'Café ainda líquido. Eles saíram com pressa e faz pouco tempo.'},
  escolhas:[
    {texto:'Revistar o posto direito.', vai:'c17_o_posto'},
    {texto:'Ir direto pra clareira.', vai:'c17_a_clareira'},
    {texto:'Procurar marca de pneu na trilha.', vai:'c17_pneus_na_trilha'},
    {texto:'Subir até a boca do Caminho da Vitória e olhar.', vai:'c17_boca_do_caminho'}
  ]
},

c17_o_posto:{
  texto:[
    'O terceiro posto tem quatro por quatro metros, uma mesa, duas cadeiras, um rádio na parede e um quadro de avisos.',
    'O rádio está ligado e sem sinal — só chiado, no volume três, há sabe-se lá quantos dias.',
    'No quadro de avisos tem três coisas.',
    'A escala de plantão do mês, com os nomes riscados a caneta a partir do dia doze.',
    'Um cartaz de procedimento de revista, de mil novecentos e noventa e um.',
    'E um bilhete, escrito à mão, preso com percevejo, que claramente não é oficial:',
    '**"Quem passar aqui: a gente foi realocado. Não tem ninguém na 22 nem na 23. Se der problema no Caminho da Vitória não tem quem buscar. Não é brincadeira. — Osmar, posto 23-A"**',
    'Alguém saiu do plantão dele, sabendo que ia embora, e parou pra escrever um bilhete pra desconhecidos.',
    'E prendeu com percevejo num quadro que ninguém mandou ele usar.'
  ],
  ef:{flag:['achou_o_bilhete_do_osmar','sabe_dos_postos_vazios'],
      itens:{'Bilhete do posto 23-A':1},
      rep:{eixo:'bom',delta:3,motivo:'Revistou o posto em vez de passar'},
      registrar:'Um servidor deixou um bilhete avisando que não há ninguém nas rotas 22 e 23.',
      presagio:'"Não é brincadeira." Um servidor escreveu isso à mão e prendeu com percevejo.'},
  escolhas:[
    {texto:'Levar o bilhete.', vai:'c17_a_clareira', ef:{flag:'tem_o_bilhete'}},
    {texto:'Tentar o rádio.', vai:'c17_o_radio'},
    {texto:'Ir pra clareira.', vai:'c17_a_clareira'},
    {texto:'Subir até a boca do Caminho da Vitória.', vai:'c17_boca_do_caminho'}
  ]
},

c17_o_radio:{
  texto:[
    'Você aperta o botão do rádio.',
    '"Alô? Posto vinte e três."',
    'Chiado.',
    'Você tenta mais três vezes e na quarta uma voz responde, e responde tão rápido que dá pra ouvir que tinha alguém do outro lado sentado esperando.',
    '"Posto vinte e três? Osmar?"',
    '"Não. Eu sou um desafiante. O posto tá vazio."',
    'Silêncio de uns quatro segundos.',
    '"Quantos são vocês?"',
    d=>d.flags.teo_leva ? '"Dois."' : '"Um."',
    'Mais silêncio.',
    '"Escuta aqui, garoto. Aqui é a central do Planalto. A gente tá com quatro pessoas onde devia ter quarenta e a gente não pode mandar ninguém."',
    '"Por quê?"',
    '"Isso eu não posso falar no rádio."',
    'Uma pausa.',
    '"Mas eu vou te falar uma coisa que eu posso: não sobe o Caminho da Vitória essa semana."',
    '"E a convocação?"',
    '"Foi mandada por um sistema automático que ninguém desligou."'
  ],
  ef:{flag:['falou_na_central','convocacao_automatica'],
      rep:{eixo:'bom',delta:4,motivo:'Insistiu no rádio até alguém responder'},
      instabilidade:1,
      registrar:'A central do Planalto tem 4 pessoas onde deveria ter 40. A convocação foi enviada por sistema automático.',
      presagio:'Um sistema automático que ninguém desligou. É assim que você foi chamado.'},
  escolhas:[
    {texto:'"O que tá acontecendo aí em cima?"', vai:'c17_o_que_acontece'},
    {texto:'Ir pra clareira.', vai:'c17_a_clareira'},
    {texto:'Subir mesmo assim.', vai:'c17_boca_do_caminho'},
    {texto:'Desligar o rádio e ir pra clareira.', vai:'c17_a_clareira'}
  ]
},

c17_o_que_acontece:{
  texto:[
    '"O que tá acontecendo aí em cima?"',
    'Chiado.',
    'Uns oito segundos de chiado, que num rádio é uma eternidade.',
    '"Eu vou responder porque eu tô sozinho nessa sala e porque eu tenho vinte e três anos de casa."',
    'A voz baixa um pouco.',
    '"Desde agosto, três membros da Elite dos Quatro não se apresentam. Não pediram licença, não pediram demissão, não avisaram."',
    '"Sumiram?"',
    '"Não sumiram. Estão vivos, a gente sabe onde estão, e estão em casa."',
    'Pausa.',
    '"Eles só não vêm."',
    '"E o Campeão?"',
    'Uma pausa mais longa.',
    '"O Campeão vem todo dia."',
    'A voz fica ainda mais baixa.',
    '"O Campeão vem todo dia, senta na cadeira dele, e fica lá o expediente inteiro numa sala onde não chega desafiante nenhum desde julho."',
    'Chiado.',
    '"Garoto, eu tô com quatro pessoas aqui e uma delas sou eu, e a convocação que te mandaram foi um sistema."',
    '"E se eu subir?"',
    '"Se você subir, você vai ser o primeiro em cinco meses."'
  ],
  ef:{flag:['sabe_da_elite','sabe_do_campeao'],
      rep:{eixo:'bom',delta:5,motivo:'Perguntou o que estava acontecendo e alguém respondeu'},
      instabilidade:2, moral:-8,
      registrar:'Três membros da Elite dos Quatro não se apresentam desde agosto. O Campeão vai todo dia a uma sala vazia.',
      presagio:'Ele vai todo dia. Numa sala onde não chega ninguém desde julho.'},
  escolhas:[
    {texto:'Ir pra clareira.', vai:'c17_a_clareira'},
    {texto:'Subir agora.', vai:'c17_boca_do_caminho'},
    {texto:'"Qual é o seu nome?"', vai:'c17_o_nome_dele'},
    {texto:'Desligar e pensar.', vai:'c17_a_clareira'}
  ]
},

c17_o_nome_dele:{
  texto:[
    '"Qual é o seu nome?"',
    'Chiado.',
    '"Por quê?"',
    '"Porque eu tô anotando tudo num caderno desde o primeiro capítulo e eu aprendi que nome importa."',
    'Uma risada curta no rádio, distorcida pelo chiado.',
    '"Anselmo. Central de comunicação do Planalto Indigo, vinte e três anos de casa, matrícula quatro mil cento e nove."',
    'Ele diz a matrícula sem você pedir.',
    '"Anota a matrícula também, garoto."',
    '"Por quê?"',
    'Pausa.',
    '"Porque eu falei uma coisa por rádio que eu não devia, e se alguém perguntar depois quem falou, eu quero que tenha resposta."',
    'Ele desliga.',
    'E você fica com o botão do rádio na mão, num posto vazio, com o chiado de volta no volume três.'
  ],
  ef:{flag:['sabe_do_anselmo','provas_do_planalto'],
      itens:{'Matrícula 4.109 anotada':1},
      npc:{nome:'Anselmo (central do Planalto)', opiniao:5, memoria:'Te deu o nome e a matrícula dele por rádio, para que houvesse resposta se alguém perguntasse.'},
      rep:{eixo:'bom',delta:5,motivo:'Perguntou o nome e recebeu a matrícula junto'},
      registrar:'Anselmo, matrícula 4.109, central do Planalto Indigo.',
      presagio:'Ele deu a matrícula. Ele quer que tenha resposta.'},
  escolhas:[
    {texto:'Ir pra clareira.', vai:'c17_a_clareira'},
    {texto:'Subir até a boca do Caminho da Vitória.', vai:'c17_boca_do_caminho'},
    {texto:'Procurar marca de pneu na trilha.', vai:'c17_pneus_na_trilha'},
    {texto:'Levar o bilhete do Osmar também.', vai:'c17_a_clareira', ef:{flag:'tem_o_bilhete'}}
  ]
},

c17_boca_do_caminho:{
  texto:[
    'Você sobe os últimos dois quilômetros da Rota 23 até onde ela acaba.',
    'E ela acaba numa coisa que não é porta e que funciona como porta: uma fenda na parede de rocha, de uns quatro metros de largura, com uma escada de pedra que sobe pra dentro do escuro.',
    'Ao lado dela, uma placa de metal esmaltado, parafusada na rocha, com a tinta descascando:',
    '**CAMINHO DA VITÓRIA — ACESSO RESTRITO A PORTADORES DE OITO INSÍGNIAS — APRESENTE-SE AO POSTO 23-B**',
    'O posto 23-B fica a trinta metros e está vazio como os outros.',
    'Não tem ninguém pra apresentar nada.',
    'Não tem catraca, não tem corrente, não tem cadeado.',
    'Só uma placa e uma fenda na rocha e quatro quilômetros de escuro lá dentro.',
    d=>d.flags.teo_leva ? 'Téo para do seu lado e olha a placa.\nE depois olha a fenda.\nE depois a placa de novo.\n"Cara."\nEle não fala mais nada por um tempo bem longo.\n"Eu podia entrar."' :
       'Você fica parado na frente da fenda uns dois minutos.'
  ],
  ef:{flag:['viu_a_boca_do_caminho'],
      registrar:'A entrada do Caminho da Vitória está sem guarda, sem catraca e sem cadeado.',
      presagio:'Só uma placa. A regra inteira era uma pessoa numa cadeira.'},
  escolhas:[
    {texto:'"Podia. E não vai."', vai:'c17_nao_vai', cond:d=>!!d.flags.teo_leva},
    {texto:'Ir pra clareira antes.', vai:'c17_a_clareira'},
    {texto:'Entrar agora.', vai:'c17_fim'},
    {texto:'Voltar e procurar marca de pneu.', vai:'c17_pneus_na_trilha'}
  ]
},

c17_nao_vai:{
  texto:[
    '"Podia. E não vai."',
    'Ele vira pra você.',
    '"Por quê? Não tem ninguém."',
    '"Não tem ninguém hoje."',
    'Você aponta a placa.',
    '"E daqui a três meses vai ter, e a placa vai continuar aí, e você vai ter atravessado."',
    '"E daí?"',
    '"E daí que aí a placa não vale mais nada pra mais ninguém."',
    'Ele fica olhando a fenda por um tempo.',
    '"Cara, isso é a coisa mais chata que alguém já me falou."',
    '"Eu sei."',
    '"E é certo."',
    '"Eu sei."',
    'Ele dá dois passos pra trás.',
    '"Eu vou pegar as outras quatro."',
    'E ele fala isso do jeito de quem acabou de decidir uma coisa grande numa frente de rocha, aos quinze anos, sem ninguém vendo além de você.'
  ],
  ef:{flag:['teo_vai_pegar_as_quatro'],
      npc:{nome:'Téo', opiniao:9, memoria:'Ficou na frente da entrada aberta do Caminho da Vitória e decidiu voltar para pegar as outras quatro insígnias.'},
      rep:{eixo:'bom',delta:5,motivo:'Convenceu alguém a não atravessar uma porta aberta'},
      moral:20,
      registrar:'Téo decidiu buscar as outras quatro insígnias em vez de atravessar a entrada desguarnecida.',
      presagio:'"Aí a placa não vale mais nada pra mais ninguém." É essa a tese de dezessete capítulos.'},
  escolhas:[
    {texto:'Ir pra clareira com ele.', vai:'c17_a_clareira'},
    {texto:'Entrar você, que tem as oito.', vai:'c17_fim'},
    {texto:'Voltar os dois pela rota.', vai:'c17_a_clareira'},
    {texto:'Ficar mais um pouco olhando a fenda.', vai:'c17_a_clareira'}
  ]
},

c17_pneus_na_trilha:{
  texto:[
    'Você procura marca de pneu na trilha da Rota 23, que é uma trilha de terra batida de nove quilômetros onde não devia passar veículo nenhum.',
    'Você acha em quarenta minutos.',
    'Van. Pneu de van, carregada, com o sulco cheio de barro seco de dois dias.',
    'Ela entrou pela estrada de manutenção — que tem uma corrente com cadeado, e o cadeado está cortado com alicate e pendurado na própria corrente, do jeito que se deixa cadeado cortado quando se pretende voltar.',
    'As marcas descem da trilha principal pra dentro do mato, na direção sudeste.',
    'E a direção sudeste é a direção da clareira.'
  ],
  ef:{flag:['achou_os_pneus','tem_gente_atras_do_mew'],
      rep:{eixo:'bom',delta:3,motivo:'Procurou marca de pneu numa trilha onde não passa veículo'},
      registrar:'Uma van entrou na Rota 23 pela estrada de manutenção, com o cadeado cortado, na direção da clareira.',
      presagio:'Cadeado cortado e pendurado de volta. Eles pretendem voltar.'},
  escolhas:[
    {texto:'Seguir as marcas até a van.', vai:'c17_pneus'},
    {texto:'Ir direto pra clareira, antes deles.', vai:'c17_a_clareira'},
    {texto:'Voltar e chamar a Liga pelo rádio do posto.', vai:'c17_denunciou_van'},
    {texto:'Revistar o posto primeiro.', vai:'c17_o_posto'}
  ]
},

c17_a_clareira:{
  texto:[
    'A clareira fica fora da trilha, a quarenta minutos de mato fechado, e não tem caminho pra ela.',
    'Você chega e para na borda.',
    'É redonda. Redonda de verdade — uns vinte metros de diâmetro, com a borda regular, num mato que não faz nada regular.',
    'A grama de dentro é mais alta e mais verde que a de fora.',
    'E não tem árvore caída, não tem toca, não tem trilha de bicho, não tem formigueiro, não tem cupinzeiro, não tem osso.',
    'Você já andou muito mato nesses dezessete capítulos e você sabe o que tem em vinte metros de mato: tem osso, tem casca roída, tem penugem, tem merda de bicho.',
    'Aqui não tem nada.',
    'É um lugar onde nada acontece há muito tempo.',
    d=>d.flags.tem_gente_atras_do_mew || d.flags.achou_os_pneus ? 'E tem marca de pneu na entrada do mato, a uns cem metros. De ontem.' : 'E não tem marca de ninguém além da sua.'
  ],
  ef:{flag:'chegou_na_clareira', registrar:'Chegou à clareira da Rota 23. Vinte metros redondos onde não tem nada.',
      presagio:'Não tem osso. Em vinte metros de mato, não tem um osso.'},
  escolhas:[
    {texto:'Entrar e olhar as plantas de perto.', vai:'c17_as_plantas'},
    {texto:'Sentar no meio e esperar.', vai:'c17_esperou_mew'},
    {texto:'Procurar as marcas de pneu.', vai:'c17_pneus', cond:d=>!!d.flags.tem_gente_atras_do_mew || !!d.flags.achou_os_pneus},
    {texto:'Ir embora. Isso não devia ter dono.', vai:'c17_foi_embora_clareira'}
  ]
},

c17_as_plantas:{
  texto:[
    'Você entra e agacha e olha as plantas de perto, porque você passou um capítulo inteiro andando com uma mulher que conta espécie há trinta e um anos e alguma coisa pegou.',
    'E a clareira fica muito pior.',
    'Tem samambaia de encosta úmida ao lado de capim de terreno seco.',
    'Tem um pé de café — café, arbusto de cultivo, que não existe em mato nativo — de um metro e vinte, carregado.',
    'Tem três espécies de orquídea que você reconhece de placa de mirante e que crescem em altitudes diferentes.',
    'E tem um pé de goiaba, no canto leste, carregado de fruta madura, com fruta caída embaixo apodrecendo.',
    'Nenhuma dessas plantas deveria estar a menos de duzentos quilômetros das outras.',
    'Todas estão saudáveis.',
    'E o pé de goiaba tem fruta caída apodrecendo embaixo dele, o que quer dizer que ninguém come.',
    'Você já viu esse pé de goiaba antes.',
    'Não esse. Um igual, numa rota vazia, com uma mulher de sessenta e três anos anotando zero.'
  ],
  ef:{flag:['viu_as_plantas','entendeu_a_clareira'],
      rep:{eixo:'bom',delta:5,motivo:'Agachou e olhou as plantas'},
      instabilidade:1,
      registrar:'A clareira tem espécies vegetais de biomas incompatíveis, todas saudáveis, e ninguém come a fruta.',
      presagio:'Um jardim. Alguém plantou isso, e o que planta não come.'},
  escolhas:[
    {texto:'Sentar no meio e esperar.', vai:'c17_esperou_mew'},
    {texto:'Contar as espécies.', vai:'c17_contou_as_especies'},
    {texto:'Procurar as marcas de pneu.', vai:'c17_pneus', cond:d=>!!d.flags.tem_gente_atras_do_mew || !!d.flags.achou_os_pneus},
    {texto:'Sair da clareira sem pisar em mais nada.', vai:'c17_foi_embora_clareira'}
  ]
},

c17_contou_as_especies:{
  texto:[
    'Você conta as espécies vegetais da clareira.',
    'Leva duas horas e você desenha as que não sabe o nome, o que é a maior parte delas, e você desenha mal.',
    'Quarenta e uma.',
    'Quarenta e uma espécies em vinte metros redondos.',
    'Uma mata nativa de Kanto tem, num raio de vinte metros, entre oito e quinze.',
    'E aí, na quadragésima primeira, você acha a que quebra tudo.',
    'É pequena, rasteira, com folha carnuda e flor branca minúscula, crescendo em moita rente à borda leste.',
    'Você conhece essa planta.',
    'Você conhece ela porque ela está desenhada na parede de um corredor de um museu em Pewter, num painel sobre flora do período em que os fósseis do museu foram formados, com uma legenda que diz **"espécie extinta — reconstituição a partir de impressão fóssil"**.',
    'Você senta na grama alta de vinte metros de clareira com uma planta extinta na mão.'
  ],
  ef:{flag:['contou_as_especies','achou_a_extinta'],
      itens:{'Muda de flor branca':1},
      rep:{eixo:'bom',delta:7,motivo:'Contou quarenta e uma espécies e reconheceu a que não devia existir'},
      instabilidade:2, moral:-5,
      registrar:'Há 41 espécies vegetais na clareira, incluindo uma que só existe como impressão fóssil no museu de Pewter.',
      presagio:'Reconstituição a partir de impressão fóssil. E ela está crescendo, viva, na borda leste.'},
  escolhas:[
    {texto:'Sentar no meio e esperar.', vai:'c17_esperou_mew'},
    {texto:'Levar a muda.', vai:'c17_levou_a_muda'},
    {texto:'Não levar nada e esperar.', vai:'c17_esperou_mew'},
    {texto:'Sair da clareira agora.', vai:'c17_foi_embora_clareira'}
  ]
},

c17_levou_a_muda:{
  texto:[
    'Você tira a muda com um pouco de terra em volta e enrola num saco plástico, do jeito que a Dra. Yara ensinou sem saber que estava ensinando.',
    'E fica com ela na mão.',
    'Uma planta extinta, viva, numa mão de quinze anos, no meio de um mato da Rota 23.',
    'E aí você pensa, e é um pensamento ruim:',
    'se você levar isso pra qualquer pessoa em Kanto que saiba o que é, essa clareira vira um sítio de pesquisa em três semanas.',
    'E se você não levar, ela continua sendo vinte metros de mato que ninguém acha.',
    'Você fica de pé no meio da clareira com a muda na mão por uns quatro minutos.',
    'Não tem resposta boa. Tem duas respostas e as duas custam.'
  ],
  ef:{flag:'tem_a_muda',
      presagio:'Duas respostas e as duas custam. É assim que todas as decisões boas são.'},
  escolhas:[
    {texto:'Replantar no mesmo lugar.', vai:'c17_replantou'},
    {texto:'Guardar e esperar Mew aparecer.', vai:'c17_esperou_mew'},
    {texto:'Guardar e levar embora.', vai:'c17_esperou_mew'},
    {texto:'Replantar e sair da clareira.', vai:'c17_foi_embora_clareira'}
  ]
},

c17_replantou:{
  texto:[
    'Você replanta.',
    'Cava o buraco com as mãos, põe a muda, aperta a terra em volta, e rega com a água da sua garrafa.',
    'Leva dez minutos e é a coisa mais idiota que dá pra fazer com uma descoberta científica de primeira grandeza.',
    'Você senta ao lado dela depois, com as mãos sujas.',
    d=>d.flags.teo_leva ? 'Téo senta do seu lado.\n"O que era aquilo?"\n"Uma planta que não existe mais."\n"E você replantou."\n"Eu replantei."\nEle assente devagar.\n"Beleza."' :
       'E fica ali, sozinho, no meio de vinte metros de grama alta, com as mãos sujas de terra.'
  ],
  ef:{flag:['replantou_a_muda'], perdeItens:{'Muda de flor branca':1},
      rep:{eixo:'bom',delta:5,motivo:'Replantou uma descoberta científica de primeira grandeza'},
      moral:15,
      registrar:'Replantou a muda no mesmo lugar.',
      presagio:'A coisa mais idiota que dá pra fazer. E você fez.'},
  escolhas:[
    {texto:'Sentar no meio e esperar.', vai:'c17_esperou_mew'},
    {texto:'Ir embora sem esperar.', vai:'c17_foi_embora_clareira'},
    {texto:'Procurar as marcas de pneu.', vai:'c17_pneus', cond:d=>!!d.flags.tem_gente_atras_do_mew || !!d.flags.achou_os_pneus},
    {texto:'Ficar sentado ao lado dela.', vai:'c17_esperou_mew'}
  ]
},

c17_pneus:{
  texto:[
    'As marcas levam a uma estrada de terra a oitocentos metros da clareira, onde tem uma van parada e quatro pessoas montando alguma coisa.',
    'Não é a equipe da Silph. Não é a expedição da ilha.',
    'Estes são diferentes: mais jovens, equipamento mais barato, e mais animados — do jeito errado.',
    'Uma rede de nylon de pesca esticada entre duas árvores. Um cooler. Duas cadeiras dobráveis. Um rádio tocando música.',
    '"...se a gente pegar, a gente não vende pra empresa nenhuma, a gente vende pra comissão, que é quem paga mais..."',
    '"Comissão?", pergunta um deles. "Que comissão?"',
    '"Sei lá, cara. Foi o nome que tava no anúncio."',
    '"E tinha telefone?"',
    '"Tinha uma caixa postal."',
    'Eles não são organizados.',
    'São quatro pessoas que viram uma foto num grupo e vieram, com uma rede de pesca e um cooler.',
    'Isso é pior.',
    'Organização tem procedimento, tem ética de fachada, tem alguém que responde. Eles não têm nada.'
  ],
  ef:{flag:['achou_os_caçadores_de_mew','sabe_do_anuncio'],
      registrar:'Quatro pessoas acamparam perto da clareira com uma rede de pesca, atrás de uma recompensa anunciada por uma "comissão".',
      presagio:'Uma caixa postal. É esse o endereço da coisa que você persegue há dezessete capítulos.'},
  escolhas:[
    {texto:'"Que anúncio?" — aparecer e perguntar.', vai:'c17_que_anuncio'},
    {texto:'Sabotar a van e sair.', vai:'c17_sabotou_van'},
    {texto:'Denunciar por rádio à Liga e voltar à clareira.', vai:'c17_denunciou_van'},
    {texto:'Enfrentar os quatro.', vai:'c17_luta_cacadores_mew'}
  ]
},

c17_que_anuncio:{
  texto:[
    'Você sai do mato e aparece.',
    'Os quatro levam um susto e um deles derruba o cooler, e por uns dez segundos é a cena menos ameaçadora que você já viu.',
    '"Que anúncio?"',
    '"Como assim?"',
    '"Vocês falaram de um anúncio. Que anúncio?"',
    'O mais velho — que tem uns vinte e seis — pega uma folha dobrada do bolso de trás.',
    'É um recorte de classificado de jornal, de um jornal de cidade pequena.',
    '**"COMPRA-SE. Informação verificável sobre avistamento de espécime raro não catalogado, região central de Kanto. Pagamento à vista, sigilo garantido. Resposta para Caixa Postal 11, agência central de Saffron."**',
    'Caixa Postal onze.',
    'Agência central de Saffron.',
    'Você fica olhando o recorte de classificado na mão de um rapaz de vinte e seis anos numa estrada de terra da Rota 23.',
    'Onze.'
  ],
  ef:{flag:['viu_o_anuncio','provas_do_mew'],
      itens:{'Recorte de classificado':1},
      rep:{eixo:'bom',delta:5,motivo:'Saiu do mato e perguntou'},
      instabilidade:1,
      registrar:'O anúncio manda responder para a Caixa Postal 11 da agência central de Saffron.',
      presagio:'Caixa Postal onze. Eles nem mudam o número.'},
  escolhas:[
    {texto:'"Deixa eu te contar o que é a caixa postal onze."', vai:'c17_contou_pros_quatro'},
    {texto:'"Me dá esse recorte."', vai:'c17_pegou_o_recorte'},
    {texto:'Sabotar a van depois de sair.', vai:'c17_sabotou_van'},
    {texto:'Denunciar à Liga pelo rádio.', vai:'c17_denunciou_van'}
  ]
},

c17_contou_pros_quatro:{
  texto:[
    '"Deixa eu te contar o que é a caixa postal onze."',
    'E você conta.',
    'Quatro pessoas com um cooler e uma rede de pesca numa estrada de terra ouvem um garoto de quinze anos contar sobre um subsolo em Saffron com doze tanques, sobre um armazém em Celadon com quarenta e uma gaiolas, sobre uma reserva em Fuchsia com uma planilha de mil novecentos e setenta e um.',
    'Leva vinte minutos.',
    'Ninguém interrompe.',
    'No fim, o de vinte e seis anos está sentado na cadeira dobrável com o recorte na mão e não olha pra cima.',
    '"A gente ia ganhar oito mil."',
    '"Cada um?"',
    '"Os quatro."',
    'Ele dobra o recorte.',
    '"Dois mil cada."',
    'Ele olha a rede de nylon esticada entre as duas árvores.',
    '"Eu larguei a firma pra vir."'
  ],
  ef:{flag:['contou_pros_quatro'],
      npc:{nome:'Caçadores da Rota 23', opiniao:3, memoria:'Ouviram por vinte minutos o que era a caixa postal 11, sentados em cadeiras dobráveis.'},
      rep:{eixo:'bom',delta:6,motivo:'Contou tudo a quem ia entregar'},
      moral:10,
      registrar:'Contou aos quatro caçadores o que era a Caixa Postal 11. Eles iam ganhar dois mil cada.',
      presagio:'Dois mil cada. Foi esse o preço.'},
  escolhas:[
    {texto:'"Desmonta e vai embora."', vai:'c17_desmontaram'},
    {texto:'"Me dá o recorte."', vai:'c17_pegou_o_recorte'},
    {texto:'"Vocês podem ganhar mais contando isso."', vai:'c17_testemunhas'},
    {texto:'Voltar pra clareira e deixar eles decidirem.', vai:'c17_esperou_mew'}
  ]
},

c17_desmontaram:{
  texto:[
    '"Desmonta e vai embora."',
    'Eles desmontam.',
    'Leva quarenta minutos e você fica ali os quarenta minutos, e no meio deles você acaba ajudando a enrolar a rede de nylon porque enrolar rede de nylon sozinho é impossível.',
    'O de vinte e seis anos guarda a rede no bagageiro.',
    '"Se a gente não pegar, outro pega."',
    '"Provavelmente."',
    '"E aí?"',
    'Você pensa na frase antes de falar, porque essa frase você já ouviu numa ilha e ela é perigosa.',
    '"E aí não vai ter sido você."',
    'Ele fecha o bagageiro.',
    'E fica com a mão em cima dele por uns cinco segundos.',
    '"É pouco."',
    '"É."',
    'Ele entra na van.',
    '"Mas é alguma coisa."'
  ],
  ef:{flag:['caçadores_foram_embora'],
      npc:{nome:'Caçadores da Rota 23', opiniao:5, memoria:'Desmontaram o acampamento e foram embora. Você ajudou a enrolar a rede.'},
      rep:{eixo:'bom',delta:6,motivo:'Convenceu quatro pessoas a irem embora e ajudou a desmontar'},
      moral:15, instabilidade:-1,
      registrar:'Os quatro caçadores desmontaram e foram embora.',
      presagio:'"Não vai ter sido você." É a única resposta que existe pra "se eu não fizer, outro faz".'},
  escolhas:[
    {texto:'Voltar pra clareira.', vai:'c17_esperou_mew'},
    {texto:'"Me dá o recorte antes."', vai:'c17_pegou_o_recorte'},
    {texto:'"Vocês topam testemunhar?"', vai:'c17_testemunhas'},
    {texto:'Ir pro Planalto.', vai:'c17_fim'}
  ]
},

c17_testemunhas:{
  texto:[
    '"Vocês podem ganhar mais contando isso."',
    '"Contando pra quem?"',
    '"Pra quem publica."',
    'Você explica: quatro pessoas que responderam a um anúncio de classificado, com o recorte na mão, dispostas a dizer o nome do jornal, a data da edição e o valor oferecido.',
    'Isso não é boato.',
    'Isso é quatro testemunhas com documento.',
    'O de vinte e seis anos olha os outros três.',
    '"A gente vai ter que dar nome?"',
    '"Vai."',
    '"E aí o pessoal da caixa postal descobre que foi a gente."',
    '"Descobre."',
    'Silêncio comprido na estrada de terra.',
    'E aí a única mulher do grupo, que não falou nada até agora, fala:',
    '"Eu dou."',
    'Os outros três olham pra ela.',
    '"Eu tenho quarenta e um anos e eu tô aqui porque eu perdi o emprego em agosto." Ela dobra a cadeira. "E eu não vou explicar pra minha filha que eu vim caçar bicho e nem que eu me escondi depois."'
  ],
  ef:{flag:['tem_testemunhas','provas_do_mew'],
      npc:{nome:'Caçadores da Rota 23', opiniao:7, memoria:'Uma delas se ofereceu para testemunhar com nome e recorte, porque não ia explicar isso à filha.'},
      rep:{eixo:'bom',delta:7,motivo:'Transformou quatro caçadores em quatro testemunhas'},
      moral:20,
      registrar:'Ao menos uma dos quatro vai testemunhar sobre o anúncio, com nome e recorte.',
      presagio:'Ela perdeu o emprego em agosto. Guarde o mês: é o mesmo dos postos vazios.'},
  escolhas:[
    {texto:'Anotar os nomes e os contatos.', vai:'c17_anotou_os_nomes'},
    {texto:'Voltar pra clareira.', vai:'c17_esperou_mew'},
    {texto:'"Me dá o recorte."', vai:'c17_pegou_o_recorte'},
    {texto:'Ir pro Planalto com isso.', vai:'c17_fim'}
  ]
},

c17_anotou_os_nomes:{
  texto:[
    'Você anota os quatro nomes, os quatro endereços, os quatro telefones, e o nome e a data do jornal.',
    'E depois você faz uma coisa que a Dra. Ivone fez na sua frente e que ficou:',
    'você lê tudo em voz alta pra eles conferirem, e eles corrigem duas coisas, e você anota as correções.',
    'E no fim você pergunta se pode escrever, ao lado de cada nome, se a pessoa autoriza ser citada.',
    'Três autorizam.',
    'Um não.',
    'E você anota "não autoriza" do lado do quarto nome, com a mesma caneta, sem discutir.',
    'E o quarto — um rapaz de uns vinte anos, o mais quieto — olha você anotar isso e fala a única coisa que ele fala o dia inteiro:',
    '"Valeu."'
  ],
  ef:{flag:['anotou_os_quatro','tem_testemunhas'],
      itens:{'Quatro depoimentos com autorização':1},
      rep:{eixo:'bom',delta:6,motivo:'Anotou, leu em voz alta e respeitou quem não autorizou'},
      moral:15,
      registrar:'Anotou quatro depoimentos sobre o anúncio, três autorizados.',
      presagio:'Você anotou "não autoriza" sem discutir. Foi por isso que ele disse valeu.'},
  escolhas:[
    {texto:'Voltar pra clareira.', vai:'c17_esperou_mew'},
    {texto:'Ir pro Planalto com isso.', vai:'c17_fim'},
    {texto:'"Me dá o recorte também."', vai:'c17_pegou_o_recorte'},
    {texto:'Ajudar a desmontar o acampamento.', vai:'c17_desmontaram'}
  ]
},

c17_pegou_o_recorte:{
  texto:[
    '"Me dá esse recorte."',
    'Ele olha o papel dobrado na mão.',
    '"Isso aqui é meu."',
    '"É."',
    'Ele fica olhando.',
    'E depois entrega.',
    '"Toma."',
    'Um recorte de classificado de jornal de cidade pequena, dobrado em quatro, com uma dobra já rasgando no vinco central de tanto ser aberto e fechado.',
    'Alguém abriu e fechou esse papel muitas vezes.'
  ],
  ef:{flag:['tem_o_recorte','provas_do_mew'],
      itens:{'Recorte de classificado':1},
      rep:{eixo:'bom',delta:3,motivo:'Saiu com o anúncio na mão'},
      registrar:'Ficou com o recorte do classificado da Caixa Postal 11.',
      presagio:'A dobra já está rasgando. Ele abriu e fechou muitas vezes.'},
  escolhas:[
    {texto:'Voltar pra clareira.', vai:'c17_esperou_mew'},
    {texto:'"Desmonta e vai embora."', vai:'c17_desmontaram'},
    {texto:'"Vocês topam testemunhar?"', vai:'c17_testemunhas'},
    {texto:'Ir pro Planalto.', vai:'c17_fim'}
  ]
},

c17_luta_cacadores_mew:{
  texto:[
    'Quatro pessoas, um de você.',
    'Eles não lutam bem — o time deles é de rota, sem estratégia, com bicho cansado —, mas são quatro, e quatro é quatro.'
  ],
  ef:{moral:-5},
  batalha:{dex:34, nivel:48, tipo:'treinador', treinador:'Caçadores de recompensa', fuga:true,
           timeExtra:[{dex:31, nivel:48},{dex:73, nivel:47}],
           vitoria:'c17_venceu_cacadores', derrota:'c17_perdeu_cacadores', fuga2:'c17_esperou_mew', gameover:'gameover'}
},

c17_venceu_cacadores:{
  texto:[
    'Você derruba os três times e o quarto nem solta bola.',
    '"A gente só queria..." começa um.',
    '"Eu sei o que vocês queriam."',
    'Eles recolhem os Pokémon caídos e guardam o cooler e enrolam a rede em silêncio, e a mulher de quarenta e um anos não olha pra você uma vez.',
    'Eles vão embora na van.',
    'Você fica na estrada de terra com a sensação exata de que eles vão voltar daqui a três semanas.',
    'E vão.',
    'E da próxima eles vão vir com mais gente e vão vir sabendo que tem alguém defendendo, o que muda tudo pra pior.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Enfrentou caçadores de recompensa sozinho'},
      flag:'espantou_cacadores_mew', moral:-5,
      registrar:'Espantou os quatro caçadores. Eles vão voltar.',
      presagio:'Da próxima eles vêm sabendo que tem alguém defendendo.'},
  escolhas:[
    {texto:'Voltar à clareira.', vai:'c17_esperou_mew'},
    {texto:'Ir atrás deles e conversar.', vai:'c17_contou_pros_quatro'},
    {texto:'Sabotar a van antes que saiam.', vai:'c17_sabotou_van'},
    {texto:'Denunciar à Liga pelo rádio.', vai:'c17_denunciou_van'}
  ]
},

c17_perdeu_cacadores:{
  texto:[
    'Quatro contra um é quatro contra um.',
    'Eles te deixam sentado na estrada de terra, pegam o que quiserem da sua mochila — e pegam pouco, o que é pior, porque quer dizer que eles não são ladrões, só estão com pressa —, e seguem pra clareira.',
    'Você chega lá depois deles.',
    'E a clareira está vazia.',
    'Completamente vazia — e a grama alta do meio está pisada em círculo, como se quatro pessoas tivessem procurado alguma coisa ali por horas.',
    d=>d.flags.viu_as_plantas ? 'E o pé de goiaba do canto leste está com dois galhos quebrados, porque alguém subiu nele pra olhar de cima.' : ''
  ],
  ef:{hp:-7, causa:'Quatro contra um na Rota 23', dinheiro:-1500,
      flag:'cacadores_chegaram_primeiro', instabilidade:1, moral:-10,
      registrar:'Os caçadores chegaram à clareira antes de você. A grama está pisada em círculo.',
      presagio:'Alguém subiu na goiabeira pra olhar de cima.'},
  escolhas:[
    {texto:'Esperar mesmo assim.', vai:'c17_esperou_mew'},
    {texto:'Ir atrás deles e conversar.', vai:'c17_contou_pros_quatro'},
    {texto:'Denunciar à Liga pelo rádio.', vai:'c17_denunciou_van'},
    {texto:'Ir embora da clareira.', vai:'c17_foi_embora_clareira'}
  ]
},

c17_sabotou_van:{
  texto:[
    'Você corta duas mangueiras e leva a chave que estava na ignição — porque gente animada demais deixa a chave na ignição.',
    'A van não sai do lugar.',
    'Eles vão levar meio dia pra resolver, e meio dia é tudo de que você precisa.',
    'Você joga a chave no mato a duzentos metros e depois volta e pega ela de novo, porque deixar quatro pessoas sem carro numa estrada de terra a trinta quilômetros da cidade mais próxima é uma coisa que você não consegue fazer.',
    'Você deixa a chave em cima do pneu dianteiro esquerdo.',
    'Eles vão achar. Depois.'
  ],
  ef:{flag:'sabotou_a_van',
      rep:{eixo:'bom',delta:2,motivo:'Ganhou meio dia e deixou a chave em cima do pneu'},
      registrar:'Sabotou a van dos caçadores e deixou a chave em cima do pneu.',
      presagio:'Você voltou pra pegar a chave. Repara nisso sobre você.'},
  escolhas:[
    {texto:'Voltar à clareira.', vai:'c17_esperou_mew'},
    {texto:'Ir falar com eles depois.', vai:'c17_contou_pros_quatro'},
    {texto:'Denunciar à Liga pelo rádio.', vai:'c17_denunciou_van'},
    {texto:'Ir pro Planalto.', vai:'c17_fim'}
  ]
},

c17_denunciou_van:{
  texto:[
    'Você volta ao posto vazio e denuncia pelo rádio.',
    d=>d.flags.sabe_do_anselmo ? 'O Anselmo atende na primeira chamada.\n"Já?"\n"Já."\n"Quantos?"\n"Quatro, numa van, estrada de manutenção, quilômetro seis."\nChiado.\n"Eu tenho quatro pessoas aqui, garoto, e uma delas sou eu, e outra é o motorista."\nMais chiado.\n"Vai dar uma hora e quarenta."' :
       'A Liga responde em quatro horas, porque a Rota 23 é área de acesso controlado ao Planalto e ali eles têm jurisdição imediata, mesmo com os postos vazios.',
    'Os quatro são detidos por acampamento irregular em área restrita — não por caça, porque não dá pra provar caça.',
    'Multa e liberação em dois dias.',
    'Mas a van fica apreendida por três semanas, e três semanas é uma coisa real.',
    d=>d.flags.sabe_do_anselmo ? 'E no fim, pelo rádio, o Anselmo fala uma coisa:\n"Anota no seu caderno que a gente veio."\n"Por quê?"\n"Porque quando escreverem sobre isso depois, vão escrever que ninguém veio."' : ''
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Usou o sistema onde o sistema ainda funcionava'},
      flag:'liga_pegou_a_van',
      registrar:'A Liga deteve os quatro por acampamento irregular. A van ficou apreendida por três semanas.',
      presagio:'"Anota que a gente veio." Anota mesmo.'},
  escolhas:[
    {texto:'Voltar à clareira.', vai:'c17_esperou_mew'},
    {texto:'Ir falar com os quatro antes de irem.', vai:'c17_contou_pros_quatro'},
    {texto:'Ir pro Planalto.', vai:'c17_fim'},
    {texto:'Ficar na clareira até o fim do dia.', vai:'c17_esperou_mew'}
  ]
},

c17_foi_embora_clareira:{
  texto:[
    'Você chega na borda da clareira, olha o meio dela, e não entra.',
    d=>d.flags.teo_leva ? 'Téo te olha sem entender.\n"Você não vai nem..."\n"Não."\nEle demora uns dez segundos, e acompanha você de volta, e não pergunta mais nada no caminho inteiro.\nE na metade do caminho ele fala uma coisa só: "Tá certo."' :
       'Você fica na borda uns dois minutos e vira as costas.',
    'Você nunca vai saber se ela estava lá naquele dia.',
    'E é essa a parte do custo: não é que você abriu mão de ver.',
    'É que você abriu mão de saber se teria visto.'
  ],
  ef:{flag:'nao_entrou_na_clareira',
      rep:{eixo:'bom',delta:3,motivo:'Chegou até a borda e escolheu não entrar'},
      moral:5,
      executar:d=>{ const L=Estado.lend(151); if(L) L.disposicao='passivo'; return []; },
      registrar:'Chegou à borda da clareira e não entrou.',
      presagio:'Você abriu mão de saber se teria visto. É o preço mais caro que existe.'},
  escolhas:[
    {texto:'Ir para o Planalto.', vai:'c17_fim'},
    {texto:'Mudar de ideia e entrar.', vai:'c17_esperou_mew'},
    {texto:'Ir procurar os caçadores primeiro.', vai:'c17_pneus', cond:d=>!!d.flags.tem_gente_atras_do_mew || !!d.flags.achou_os_pneus},
    {texto:'Subir até a boca do Caminho da Vitória.', vai:'c17_boca_do_caminho'}
  ]
},

/* ─────────────── MEW ─────────────── */

c17_esperou_mew:{
  texto:[
    'Você senta no meio da clareira.',
    d=>d.flags.teo_leva ? 'Téo senta a três metros e fica quieto, o que pra ele é um esforço físico visível. Ele mexe no cadarço quatro vezes na primeira meia hora e depois para.' :
       'Você fica sozinho no meio de vinte metros de grama alta.',
    'Duas horas.',
    'Duas horas de verdade: você tem formiga na perna aos quarenta minutos, e cãibra na panturrilha aos setenta, e aos cem você já está pensando em desistir e ficando só por teimosia.',
    'E aí, sem nenhum aviso e sem nenhum som, tem uma coisa pairando a um metro e dez do chão, a quatro metros de você.',
    'Mew é menor do que qualquer foto sugere.',
    'É do tamanho de um Meowth. A cauda é mais comprida que o corpo inteiro e fica parada no ar, sem enrolar, sem balançar.',
    'A grama embaixo dela não mexe.',
    'E ela não está te observando com cautela.',
    'Ela está te observando com curiosidade — que é uma coisa completamente diferente e muito mais perigosa, porque quer dizer que ela não tem medo, e não ter medo de uma pessoa é a coisa que mata mais bicho em Kanto.'
  ],
  ef:{executar:d=>{ Estado.lend(151).encontros++; return []; },
      flag:'viu_mew',
      registrar:'Mew apareceu na clareira da Rota 23, depois de duas horas.',
      presagio:'Ela não tem medo. Isso é o que mata mais bicho em Kanto.'},
  escolhas:[
    {texto:'Ficar parado.', vai:'c17_mew_brinca'},
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Avisar em voz alta que tem gente atrás dela.', vai:'c17_avisou_mew'},
    {texto:'Tentar capturar.', vai:'c17_captura_mew'}
  ]
},

c17_mew_brinca:{
  texto:[
    'Você fica parado e ela se aproxima.',
    'O que acontece nos vinte minutos seguintes é a coisa mais absurda da sua jornada inteira, e você passou por doze tanques, uma caverna de gelo e uma cratera de vulcão:',
    'Mew brinca.',
    'Ela copia.',
    'Você coça o nariz, ela coça o nariz. Você cruza os braços, ela cruza os braços — com as patinhas, do jeito errado, porque as patinhas dela não cruzam direito, e ela tenta três vezes até ficar mais ou menos.',
    'E você ri.',
    'E ela imita o riso, sem som nenhum, só a cara.',
    'Ela levanta a sua mochila do chão sem tocar nela, olha por baixo, e coloca de volta no lugar exato — no lugar exato, com o vinco da grama batendo.',
    'Ela tira a sua boné da sua cabeça e põe na dela e a boné cai porque a cabeça dela é pequena demais, e ela olha a boné no chão com uma cara de quem foi enganada.',
    d=>d.flags.teo_leva ? 'Téo está chorando a três metros e nem percebeu que está.' :
       'Você percebe, em algum momento, que está sorrindo de um jeito que você não sorri desde o capítulo dois.',
    'Ela não está te avaliando. Ela nunca esteve.',
    'Ela só achou você interessante por vinte minutos, do jeito que criança acha uma poça interessante.'
  ],
  ef:{flag:'brincou_com_mew',
      rep:{eixo:'bom',delta:3,motivo:'Passou vinte minutos brincando com Mew'},
      moral:25,
      executar:d=>{ const L=Estado.lend(151); L.disposicao='passivo'; L.aliado=true; return []; },
      registrar:'Mew brincou com você por vinte minutos na clareira.',
      presagio:'Do jeito que criança acha uma poça interessante. Sem nenhum peso.'},
  escolhas:[
    {texto:'Avisar que tem gente atrás dela.', vai:'c17_avisou_mew'},
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'},
    {texto:'Tentar capturar agora, que ela confia.', vai:'c17_captura_mew',
     ef:{rep:{eixo:'ruim',delta:4,motivo:'Traiu Mew depois de vinte minutos de brincadeira'}, flag:'traiu_mew', moral:-25}}
  ]
},

c17_mew_mao:{
  texto:[
    'Você estende a mão.',
    'Ela olha a mão. Depois olha você. Depois olha a mão de novo.',
    'E chega perto muito devagar — mais devagar do que ela se moveu em tudo o mais — e encosta a testa nela.',
    'Não a pata: a testa.',
    'E fica ali talvez dois segundos.',
    'Nesses dois segundos você vê uma coisa que não é imagem e não é som e que você vai tentar descrever pelo resto da vida sem conseguir:',
    'é a sensação física de um lugar muito velho e muito quieto onde nada nunca precisou de nome.',
    'Não é bonito. Não é assustador.',
    'É antigo de um jeito que faz tudo o que você fez em dezessete capítulos parecer uma coisa que aconteceu hoje de manhã.',
    'Depois ela recua.',
    'E você fica com a mão estendida por mais tempo do que devia.'
  ],
  ef:{flag:'tocou_mew',
      rep:{eixo:'bom',delta:3,motivo:'Mew encostou a testa na sua mão'},
      moral:20,
      executar:d=>{ const L=Estado.lend(151); L.disposicao='passivo'; L.aliado=true; return []; },
      registrar:'Mew encostou a testa na sua mão por dois segundos.',
      presagio:'Um lugar onde nada nunca precisou de nome. Guarde — é o oposto de tudo que você fez.'},
  escolhas:[
    {texto:'Avisar que tem gente atrás dela.', vai:'c17_avisou_mew'},
    {texto:'Ficar parado e ver o que ela faz.', vai:'c17_mew_brinca'},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'},
    {texto:'Capturar.', vai:'c17_captura_mew', ef:{flag:'traiu_mew', moral:-25, rep:{eixo:'ruim',delta:4,motivo:'Capturou Mew depois que ela te tocou'}}}
  ]
},

c17_avisou_mew:{
  texto:[
    '"Tem gente te procurando."',
    'Você diz isso em voz alta numa clareira, pra uma criatura que provavelmente entende tudo e provavelmente não liga.',
    'Ela inclina a cabeça.',
    'E aí faz uma coisa desconcertante: ela sobe uns três metros, olha na direção exata da estrada de terra onde estavam as marcas de pneu — a direção exata, não uma direção qualquer — e volta.',
    'Ela já sabia.',
    'Ela sabia antes de você chegar, provavelmente antes deles chegarem.',
    'Ela só não considera isso um problema.',
    'E você percebe, com um arrepio que não é de frio, que provavelmente ela está certa:',
    'ela já viu isso muitas vezes, e ela vai continuar aqui muito tempo depois de todos nós.',
    d=>d.flags.achou_a_extinta ? 'E você olha a moita de flor branca na borda leste — a planta que só existe como impressão fóssil num museu — e entende de uma vez que ela não está certa por otimismo.\nEla está certa porque ela mede o tempo em outra escala, e nessa escala a moita de flor branca é recente.' : ''
  ],
  ef:{flag:'avisou_mew',
      rep:{eixo:'bom',delta:3,motivo:'Avisou Mew sobre os caçadores'},
      executar:d=>{ const L=Estado.lend(151); L.disposicao='passivo'; L.aliado=true; return []; },
      registrar:'Avisou Mew. Ela já sabia, e não se importava.',
      presagio:'Ela mede o tempo em outra escala. Nessa escala, você não aconteceu.'},
  escolhas:[
    {texto:'"E isso não te incomoda?"', vai:'c17_nao_te_incomoda'},
    {texto:'Ficar parado e ver o que ela faz.', vai:'c17_mew_brinca'},
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'}
  ]
},

c17_nao_te_incomoda:{
  texto:[
    '"E isso não te incomoda?"',
    'Ela paira.',
    'E aí ela faz a única coisa em todo o encontro que parece resposta:',
    'ela desce até o chão, pousa na grama — pousa, com as quatro patas, o que ela não tinha feito nenhuma vez —, e cava.',
    'Cava um buraquinho na terra com a pata dianteira, uns dez centímetros, do jeito que Meowth cava.',
    'E olha pra você.',
    'E aí ela empurra terra de volta e tapa o buraquinho.',
    'E olha pra você de novo.',
    'E faz isso mais duas vezes: cava, tapa, olha.',
    'Você não faz ideia do que isso quer dizer.',
    'Você vai passar anos sem fazer ideia.',
    'E aos vinte e poucos anos, numa conversa qualquer sobre coisa nenhuma, você vai entender de repente e vai ter que sair da mesa.'
  ],
  ef:{flag:['mew_respondeu'],
      rep:{eixo:'bom',delta:4,motivo:'Fez uma pergunta e recebeu uma resposta que não cabe agora'},
      moral:15, instabilidade:-1,
      registrar:'Mew cavou um buraco, tapou, e olhou para você. Três vezes.',
      presagio:'Você vai entender aos vinte e poucos anos, numa conversa sobre coisa nenhuma.'},
  escolhas:[
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'},
    {texto:'Ficar parado e ver o que mais ela faz.', vai:'c17_mew_brinca'},
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Anotar exatamente o que ela fez.', vai:'c17_anotou_o_gesto'}
  ]
},

c17_anotou_o_gesto:{
  texto:[
    'Você tira o caderno e anota exatamente o que ela fez, na ordem, com os detalhes:',
    'pousou com as quatro patas. Cavou com a dianteira direita. Dez centímetros. Tapou com a mesma pata. Olhou. Repetiu três vezes. Intervalo de uns quatro segundos entre uma e outra.',
    'Você anota sem interpretar, porque você aprendeu num quintal de Fuchsia e numa cabine de pedágio que interpretar é a parte que a gente faz depois e errado.',
    'Ela assiste você escrever.',
    'Ela paira a um metro do caderno e olha o lápis se mexer, e a cauda dela fica parada no ar.',
    'E quando você termina de escrever e levanta a cabeça, ela está muito mais perto do que estava.',
    'A uns quarenta centímetros.',
    'E ela está olhando o caderno.',
    'Não você.',
    'O caderno.'
  ],
  ef:{flag:['anotou_o_gesto','mew_viu_o_caderno'],
      rep:{eixo:'bom',delta:5,motivo:'Anotou sem interpretar'},
      moral:15,
      registrar:'Anotou o gesto de Mew sem interpretar. Ela ficou olhando o caderno.',
      presagio:'Ela estava olhando o caderno. Pensa no que um caderno é pra uma coisa que não tem nome pra nada.'},
  escolhas:[
    {texto:'Mostrar o caderno pra ela.', vai:'c17_mostrou_o_caderno'},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'},
    {texto:'Ficar parado.', vai:'c17_mew_brinca'},
    {texto:'Estender a mão.', vai:'c17_mew_mao'}
  ]
},

c17_mostrou_o_caderno:{
  texto:[
    'Você vira o caderno pra ela.',
    'É uma coisa idiota de fazer. Ela não lê. Ninguém lê. Não tem nenhum motivo pra isso funcionar.',
    'Ela olha as páginas.',
    'E aí ela estica a pata e encosta na folha — encosta de verdade, com a almofadinha, na página, em cima de uma palavra.',
    'Você olha qual palavra.',
    'Não é uma palavra. É um desenho.',
    d=>d.flags.contou_as_especies ? 'É o desenho que você fez da flor branca, mal feito, na página de duas horas atrás.' :
       'É um desenho mal feito que você fez de uma planta que você não soube nomear.',
    'Ela mantém a pata ali uns três segundos.',
    'E depois recua, e sobe, e fica pairando a dois metros olhando você.',
    'E você não tem a menor ideia se isso foi uma resposta, um acaso, ou uma pata numa folha de papel.'
  ],
  ef:{flag:['mostrou_o_caderno','mew_tocou_o_desenho'],
      rep:{eixo:'bom',delta:4,motivo:'Mostrou o caderno a uma coisa que não lê'},
      moral:15,
      registrar:'Mew encostou a pata no desenho da flor branca no seu caderno.',
      presagio:'Acaso, resposta, ou uma pata numa folha. Você nunca vai saber e vai contar mesmo assim.'},
  escolhas:[
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'},
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Ficar parado.', vai:'c17_mew_brinca'},
    {texto:'Ficar na clareira até escurecer.', vai:'c17_deixou_mew'}
  ]
},

c17_deixou_mew:{
  texto:[
    'Ela vai embora do jeito que chegou: sem aviso, sem som, sem transição.',
    'Num instante está a quatro metros. No seguinte, a clareira tem vinte metros de grama alta e mais nada.',
    'Não tem deslocamento. Não tem borrão. Não tem ar mexendo.',
    'Ela estava e não está.',
    d=>d.flags.teo_leva ? 'Téo fica sentado mais uns dez minutos, sem falar nada.\nDepois:\n"Ninguém vai acreditar."\n"Não."\n"Ótimo."\nEle se levanta e bate a terra da calça.\n"Ótimo mesmo."' :
       'Você fica sentado mais uns dez minutos, sozinho, no lugar mais comum do mundo: vinte metros de grama alta numa rota de Kanto.'
  ],
  ef:{flag:'deixou_mew_ir',
      rep:{eixo:'bom',delta:2,motivo:'Encontrou Mew e não pegou nada'},
      moral:10,
      registrar:'Mew foi embora. Você não pegou nada.'},
  escolhas:[
    {texto:'Ir para o Planalto.', vai:'c17_fim'},
    {texto:'Ficar até escurecer.', vai:'c17_ate_escurecer'},
    {texto:'Ir procurar os caçadores.', vai:'c17_pneus', cond:d=>!!d.flags.tem_gente_atras_do_mew || !!d.flags.achou_os_pneus},
    {texto:'Voltar pela Rota 23 sem contar a ninguém.', vai:'c17_fim'}
  ]
},

c17_ate_escurecer:{
  texto:[
    'Você fica na clareira até escurecer.',
    'Ela não volta.',
    'O que acontece, em vez disso, é que a clareira fica escura como qualquer mato fica escuro, e fria como qualquer mato fica frio, e às sete e quarenta começa a cantar um bicho qualquer no mato de fora.',
    'Um bicho qualquer, cantando, do lado de fora da clareira.',
    'De dentro dela, nada.',
    'E aí você entende uma última coisa, e ela é a pior de todas:',
    'a clareira não é um lugar onde tem coisa demais.',
    'É um lugar de onde tudo saiu, porque ela é o jardim de alguém, e jardim é um lugar onde não deixam bicho entrar.',
    'Quarenta e uma espécies de planta e nenhuma de bicho.',
    'É a coisa mais solitária que você já viu, e ela foi construída de propósito, por uma coisa que esteve aqui antes de tudo, e que passa a tarde brincando com um garoto que apareceu porque se perdeu.'
  ],
  ef:{flag:['ficou_ate_escurecer','entendeu_o_jardim'],
      rep:{eixo:'bom',delta:4,motivo:'Ficou até escurecer e entendeu o que era'},
      moral:-10, instabilidade:1,
      registrar:'A clareira é um jardim: 41 espécies de planta e nenhuma de bicho. Ela é vazia de propósito.',
      presagio:'Jardim é um lugar onde não deixam bicho entrar. Pensa em quanto tempo ela está sozinha.'},
  escolhas:[
    {texto:'Ir para o Planalto.', vai:'c17_fim'},
    {texto:'Voltar amanhã.', vai:'c17_esperou_mew'},
    {texto:'Ir procurar os caçadores.', vai:'c17_pneus', cond:d=>!!d.flags.tem_gente_atras_do_mew || !!d.flags.achou_os_pneus},
    {texto:'Dormir na clareira.', vai:'c17_fim'}
  ]
},

c17_captura_mew:{
  texto:[
    'Você joga a bola.',
    'Mew não desvia, não se defende, não foge.',
    'Ela olha a bola vindo com exatamente a mesma curiosidade com que olhou tudo o mais — a sua mochila, o seu boné, o seu rosto.',
    'Com a mesma cara.'
  ],
  ef:{moral:-15},
  batalha:{dex:151, nivel:55, tipo:'lendario', fuga:true, ambiente:'floresta',
           vitoria:'c17_pos_mew', derrota:'c17_pos_mew', fuga2:'c17_deixou_mew',
           captura:'c17_capturou_mew', gameover:'gameover'}
},

c17_pos_mew:{
  texto:[
    'Ela some no meio do combate.',
    'Não foge — some, no sentido literal, e a clareira fica vazia entre dois piscares.',
    'Você fica de pé ali por um tempo com uma bola na mão.',
    d=>d.flags.brincou_com_mew||d.flags.tocou_mew ? 'E pensando nos vinte minutos anteriores, que agora significam uma coisa completamente diferente, e que vão continuar significando essa coisa diferente pro resto da sua vida, porque não tem como desfazer os vinte minutos e não tem como desfazer o que veio depois.' :
       'A grama alta volta ao normal em alguns minutos, levantando devagar onde vocês pisaram.',
    d=>d.flags.teo_leva ? 'Téo não fala nada.\nEle não fala nada o caminho inteiro de volta, que são quarenta minutos de mato fechado.' : ''
  ],
  ef:{executar:d=>{ const L=Estado.lend(151); L.ataquesSofridos++; L.disposicao='desconfiado'; return []; },
      rep:{eixo:'ruim',delta:2,motivo:'Atacou Mew'},
      npc:{nome:'Téo', opiniao:-4, memoria:'Viu você jogar a bola em Mew e não falou nada nos quarenta minutos de volta.'},
      moral:-15},
  escolhas:[
    {texto:'Esperar ela voltar.', vai:'c17_esperou_mew'},
    {texto:'Ir embora.', vai:'c17_fim'},
    {texto:'Ir embora e não contar pra ninguém.', vai:'c17_fim'},
    {texto:'Pedir desculpa em voz alta pra clareira vazia.', vai:'c17_pediu_desculpa'}
  ]
},

c17_pediu_desculpa:{
  texto:[
    '"Desculpa."',
    'Você fala isso em voz alta numa clareira vazia de vinte metros.',
    'Não acontece nada.',
    'Não tem resposta, não tem sinal, não tem vento mexendo a grama.',
    'Você fica ali uns quinze minutos falando sozinho — e não é bonito, e você não fala nada de bonito: você fala coisa embolada, repetida, com frase começada e não terminada, do jeito que gente fala quando está pedindo desculpa de verdade e não em discurso.',
    d=>d.flags.teo_leva ? 'E o Téo fica a três metros o tempo inteiro e não sai e não fala nada, e ficar é a única coisa que ele pode fazer, e ele faz.' : '',
    'E no fim você levanta e vai embora.',
    'E o pedido de desculpa não serviu pra ela.',
    'Serviu pra você conseguir levantar.'
  ],
  ef:{flag:'pediu_desculpa_pra_mew',
      rep:{eixo:'bom',delta:2,motivo:'Pediu desculpa a uma clareira vazia'},
      moral:10,
      registrar:'Pediu desculpa em voz alta na clareira vazia.',
      presagio:'Não serviu pra ela. Serviu pra você conseguir levantar. É pra isso que serve.'},
  escolhas:[
    {texto:'Ir para o Planalto.', vai:'c17_fim'},
    {texto:'Esperar ela voltar.', vai:'c17_esperou_mew'},
    {texto:'Ficar até escurecer.', vai:'c17_ate_escurecer'},
    {texto:'Voltar amanhã.', vai:'c17_esperou_mew'}
  ]
},

c17_capturou_mew:{
  texto:[
    'A bola fecha e cai na grama alta.',
    'E não acontece nada.',
    'Não tem tremor no céu, não tem clima mudando, não tem lendário nenhum vindo caçar você, não tem luz, não tem som.',
    'Isso é o assustador de Mew: capturar ela não quebra nada.',
    'O mundo não reage.',
    d=>d.flags.teo_leva ? 'Téo olha a bola no chão. Depois olha você.\nEle não fala nada.\nE não falar nada é a coisa mais alta que ele já fez na vida.' :
       'A clareira fica exatamente igual. A grama, as quarenta e uma espécies, a goiabeira com fruta caída.',
    'Mas em algum lugar, alguém vai descobrir.',
    'E a partir daí você deixa de ser uma pessoa e vira um endereço.'
  ],
  ef:{flag:'capturou_mew', moral:-20, instabilidade:2,
      npc:{nome:'Téo', opiniao:-5, memoria:'Viu você capturar Mew e não disse uma palavra.'},
      registrar:'Capturou Mew. O mundo não reagiu, o que é pior.',
      presagio:'Você deixa de ser uma pessoa e vira um endereço.'},
  escolhas:[
    {texto:'Soltar. Agora.', vai:'c17_soltou_mew'},
    {texto:'Ficar com ela.', vai:'c17_ficou_com_mew'},
    {texto:'Soltar e pedir desculpa.', vai:'c17_soltou_mew'},
    {texto:'Ficar sentado com a bola na mão.', vai:'c17_soltou_mew'}
  ]
},

c17_soltou_mew:{
  texto:[
    'Você abre a bola na mesma clareira, menos de um minuto depois.',
    'Ela sai e paira no mesmo lugar de antes, na mesma altura, a um metro e dez do chão.',
    'E aí faz a coisa que te derruba:',
    'ela inclina a cabeça de novo, com a mesma curiosidade de antes.',
    'Igual.',
    'Exatamente igual.',
    'Ela não ficou com raiva. Ela não entendeu como ofensa. Ela não registrou.',
    'Você fez a pior coisa possível com ela e ela te perdoou instantaneamente porque nem chegou a considerar que houvesse o que perdoar.',
    'Isso é muito pior do que raiva.',
    'Raiva teria te dado alguma coisa pra segurar.'
  ],
  ef:{executar:d=>{
        const avisos=[];
        const p=[...d.time,...d.pc].find(x=>x.dex===151);
        if(p) Captura.soltar(p).forEach(e=>avisos.push({tipo:e.tipo,texto:e.texto}));
        const L=Estado.lend(151); L.disposicao='passivo';
        return avisos;
      },
      rep:{eixo:'bom',delta:3,motivo:'Soltou Mew um minuto depois de capturar'},
      flag:'soltou_mew', limpaFlag:'capturou_mew',
      moral:5,
      registrar:'Soltou Mew um minuto depois. Ela não registrou como ofensa.',
      presagio:'Raiva teria te dado alguma coisa pra segurar.'},
  escolhas:[
    {texto:'Ir para o Planalto.', vai:'c17_fim'},
    {texto:'Pedir desculpa em voz alta.', vai:'c17_pediu_desculpa'},
    {texto:'Ficar até escurecer.', vai:'c17_ate_escurecer'},
    {texto:'Ficar parado e ver o que ela faz.', vai:'c17_mew_brinca'}
  ]
},

c17_ficou_com_mew:{
  texto:[
    'Você segue com Mew no cinto.',
    'Nos dias seguintes, nada acontece.',
    'Nenhum lendário te caça. O clima não muda. A Liga não sabe. Ninguém te para na estrada.',
    'O que acontece é mais silencioso.',
    'Você começa a reparar em carros que passam devagar. Em gente que olha demais num Centro Pokémon. Em telefonemas que caem no segundo toque.',
    'Numa loja de Celadon, o atendente demora a devolver o seu troco porque está olhando o seu cinto.',
    'E na quinta-feira, no Centro Pokémon da Rota 22, um homem de jaleco senta na mesa ao lado da sua e diz, sem olhar pra você, mexendo o café:',
    '"Nós pagamos qualquer valor. Literalmente qualquer valor. Você define."',
    'Ele não ameaça.',
    'Ele nem precisa.',
    'Ele está oferecendo, e a oferta é a ameaça, e os dois sabem disso, e é por isso que ele não olha pra você.'
  ],
  ef:{flag:['ficou_com_mew','cientistas_atras'], instabilidade:2,
      rep:{eixo:'ruim',delta:3,motivo:'Manteve Mew em cativeiro'},
      moral:-20,
      registrar:'Ficou com Mew. Um homem de jaleco ofereceu qualquer valor.',
      presagio:'Ele não olha pra você. É por isso que ele não precisa ameaçar.'},
  escolhas:[
    {texto:'"Não."', vai:'c17_recusou_cientistas'},
    {texto:'"Quem te mandou?"', vai:'c17_quem_te_mandou'},
    {texto:'Voltar à clareira e soltar.', vai:'c17_soltou_mew'},
    {texto:'"Quanto é qualquer valor?"', vai:'c17_vendeu_mew'}
  ]
},

c17_quem_te_mandou:{
  texto:[
    '"Quem te mandou?"',
    'Ele mexe o café.',
    '"Ninguém me manda. Eu recebo uma solicitação de aquisição e eu executo."',
    '"Solicitação de quem?"',
    '"Do setor que solicitou."',
    'Ele bebe.',
    '"Olha, moço. Eu tenho cinquenta e dois anos e eu faço aquisição há dezenove. Eu já comprei equipamento de ressonância, já comprei um prédio inteiro em Vermilion e já comprei uma coleção particular de fósseis de um viúvo em Pewter."',
    'Ele põe a xícara na mesa.',
    '"Eu não pergunto o que a gente vai fazer com o que eu compro."',
    '"Nunca?"',
    '"Uma vez."',
    'Ele olha a xícara.',
    '"Em noventa e seis. E aí me disseram, e aí eu passei quatro anos sem dormir direito, e aí eu parei de perguntar."',
    'Ele levanta.',
    '"Pensa na oferta."'
  ],
  ef:{flag:['sabe_do_comprador','ouviu_o_de_jaleco'],
      npc:{nome:'Comprador de jaleco', opiniao:1, memoria:'Perguntou uma vez, em 1996, o que faziam com o que ele comprava. Nunca mais perguntou.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou quem mandava'},
      moral:-8,
      registrar:'O comprador perguntou uma vez, em 1996, e passou quatro anos sem dormir direito.',
      presagio:'Ele perguntou uma vez. E parou. Você não parou. Ainda.'},
  escolhas:[
    {texto:'"Pergunta de novo."', vai:'c17_pergunta_de_novo'},
    {texto:'"Não."', vai:'c17_recusou_cientistas'},
    {texto:'Voltar à clareira e soltar.', vai:'c17_soltou_mew'},
    {texto:'"Quanto é qualquer valor?"', vai:'c17_vendeu_mew'}
  ]
},

c17_pergunta_de_novo:{
  texto:[
    '"Pergunta de novo."',
    'Ele para com a mão na cadeira.',
    '"Como?"',
    '"Você perguntou uma vez em noventa e seis. Pergunta de novo."',
    '"Pra quê?"',
    '"Porque agora você já sabe a resposta, então perguntar de novo não é pra descobrir. É pra ficar registrado que você perguntou."',
    'Ele fica de pé ao lado da mesa por um tempo desconfortável pra um homem de cinquenta e dois anos num Centro Pokémon.',
    '"Registrado onde?"',
    '"No sistema deles. Por escrito."',
    'Ele solta um ar pelo nariz que é quase riso.',
    '"Você tem quinze anos."',
    '"Eu tenho quinze anos e eu já vi uns quatro adultos descobrirem que a arma deles era um campo de formulário."',
    'Ele pega a maleta.',
    'E antes de sair ele fala, sem virar:',
    '"Solicitação de aquisição tem campo de justificativa."',
    'Pausa.',
    '"Nunca preenchido."'
  ],
  ef:{flag:['comprador_vai_perguntar','provas_do_mew'],
      npc:{nome:'Comprador de jaleco', opiniao:4, memoria:'Lembrou que a solicitação de aquisição tem campo de justificativa, nunca preenchido.'},
      rep:{eixo:'bom',delta:6,motivo:'Mandou um comprador de dezenove anos de casa perguntar por escrito'},
      moral:15,
      registrar:'A solicitação de aquisição da empresa tem campo de justificativa, nunca preenchido.',
      presagio:'Campo de justificativa nunca preenchido. É a quinta vez que a resposta é um campo de formulário.'},
  escolhas:[
    {texto:'"Preenche o seu."', vai:'c17_recusou_cientistas'},
    {texto:'Voltar à clareira e soltar.', vai:'c17_soltou_mew'},
    {texto:'"Não."', vai:'c17_recusou_cientistas'},
    {texto:'"Quanto é qualquer valor?"', vai:'c17_vendeu_mew'}
  ]
},

c17_recusou_cientistas:{
  texto:[
    '"Não."',
    'Ele assente, levanta, e vai embora sem insistir uma única vez.',
    'Isso devia te tranquilizar.',
    'Não tranquiliza, porque gente que não insiste é gente que tem outro plano, e você já viu isso em Celadon e em Saffron e numa ilha sem nome.',
    'Três dias depois, num Centro Pokémon diferente, tem uma mulher de terno na mesa ao lado.',
    'Ela não fala com você.',
    'Ela só senta na mesa ao lado, todo dia, por quatro dias, em quatro Centros diferentes.',
    'E no quinto dia ela não está.',
    'E a ausência dela é pior que a presença.'
  ],
  ef:{flag:'recusou_venda_mew',
      rep:{eixo:'bom',delta:3,motivo:'Recusou "qualquer valor" por Mew'},
      instabilidade:1,
      registrar:'Recusou a oferta. Uma mulher de terno sentou na mesa ao lado por quatro dias.',
      presagio:'No quinto dia ela não estava. A ausência é pior.'},
  escolhas:[
    {texto:'Voltar à clareira e soltar.', vai:'c17_soltou_mew'},
    {texto:'Ir pro Planalto com ela.', vai:'c17_fim'},
    {texto:'Procurar a mulher de terno.', vai:'c17_fim'},
    {texto:'Soltar em qualquer lugar, agora.', vai:'c17_soltou_mew'}
  ]
},

c17_vendeu_mew:{
  texto:[
    'Ele escreve um número num guardanapo e empurra pela mesa.',
    'O número tem dígitos suficientes pra comprar uma casa em Celadon, e ainda sobra pra comprar outra.',
    'A transferência acontece num estacionamento, numa terça-feira, às seis e quarenta da manhã.',
    'Tem três pessoas: ele, você, e um motorista que não desce do carro.',
    'Ele leva a bola numa maleta com controle de temperatura, e ele confere a temperatura antes de fechar, e ele confere de novo depois.',
    'Antes de ir, ele diz uma coisa gentil, que é a pior parte:',
    '"Ela vai ser muito bem cuidada. Isso não é mentira. Nós precisamos dela viva e saudável por décadas."',
    'Décadas.',
    'Ele entra no carro.',
    'E você fica num estacionamento às seis e quarenta e sete da manhã com uma quantia de dinheiro que não cabe em nenhuma conta que você saiba abrir.'
  ],
  ef:{dinheiro:200000, flag:['vendeu_mew','tem_sangue_nas_maos'],
      rep:{eixo:'ruim',delta:6,motivo:'Vendeu Mew para um laboratório'},
      moral:-45, instabilidade:3,
      executar:d=>{
        const p=[...d.time,...d.pc].find(x=>x.dex===151);
        if(p){ Estado.removerDoTime(p.uid); const i=d.pc.findIndex(x=>x.uid===p.uid); if(i>=0) d.pc.splice(i,1); }
        const L=Estado.lend(151); L.estado='vendido'; L.disposicao='prisioneiro';
        return [{tipo:'morte', texto:'Mew saiu da sua vida numa maleta com controle de temperatura.'}];
      },
      registrar:'Vendeu Mew para um laboratório. Décadas.',
      presagio:'Ele conferiu a temperatura duas vezes. Ele é bom no que faz.'},
  escolhas:[
    {texto:'Ir para o Planalto com o dinheiro.', vai:'c17_fim'},
    {texto:'Ir atrás do carro.', vai:'c17_foi_atras'},
    {texto:'Ficar no estacionamento.', vai:'c17_fim'},
    {texto:'Ligar pra Dra. Ivone e contar.', vai:'c17_contou_pra_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c17_foi_atras:{
  texto:[
    'Você corre atrás do carro.',
    'Você corre atrás de um carro num estacionamento às seis e quarenta e sete da manhã, com duzentos mil no bolso, e você alcança ele na saída porque tem uma cancela.',
    'Ele abaixa o vidro.',
    '"Eu quero de volta."',
    'Ele olha a maleta no banco de trás.',
    '"Quanto?"',
    '"Eu devolvo o dinheiro."',
    'Ele olha pra você por um tempo comprido e depois fala uma coisa que é a verdade e que é a pior coisa que dava pra falar:',
    '"A operação já foi lançada no sistema às seis e quarenta e três."',
    'A cancela abre.',
    '"Eu não posso desfazer. Não porque eu não queira. Porque não tem como."',
    'Ele sobe o vidro.',
    'E você fica na saída do estacionamento com a cancela abaixando na sua frente.'
  ],
  ef:{flag:'tentou_desfazer',
      rep:{eixo:'bom',delta:1,motivo:'Correu atrás do carro'},
      moral:-15,
      registrar:'Tentou desfazer a venda. A operação já estava no sistema.',
      presagio:'Quatro minutos entre o pagamento e o sistema. Foi essa a sua janela.'},
  escolhas:[
    {texto:'Ligar pra Dra. Ivone.', vai:'c17_contou_pra_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir pro Planalto.', vai:'c17_fim'},
    {texto:'Ficar no estacionamento.', vai:'c17_fim'},
    {texto:'Anotar a placa do carro.', vai:'c17_fim', ef:{flag:'placa_do_comprador', rep:{eixo:'bom',delta:2,motivo:'Anotou a placa quando não dava pra fazer mais nada'}}}
  ]
},

c17_contou_pra_ivone:{
  texto:[
    'Você liga pra Dra. Ivone de um orelhão, às sete e dez da manhã, e conta.',
    'Tudo: a clareira, os vinte minutos, a bola, o guardanapo, o estacionamento, a maleta com controle de temperatura, os duzentos mil.',
    'Ela ouve inteiro sem interromper.',
    'E no fim ela não te repreende, e não te consola, e não fala nada sobre o que você fez.',
    'Ela faz três perguntas:',
    '"Qual era a cor da maleta?"',
    '"Que horas exatamente a operação foi lançada no sistema?"',
    '"Você anotou a placa?"',
    'E quando você responde as três, ela diz:',
    '"Ótimo. Agora escreve tudo isso num papel, com data e hora, e assina."',
    '"Pra quê?"',
    '"Porque uma venda documentada é rastreável e uma venda não documentada some."',
    'Ela desliga.',
    'E você fica com o fone na mão entendendo que ela acabou de te transformar em testemunha do seu próprio crime, de propósito, porque é a única coisa que ainda dá pra fazer por ela.'
  ],
  ef:{flag:['documentou_a_venda','ivone_sabe_da_venda'],
      itens:{'Declaração assinada da venda':1},
      npc:{nome:'Dra. Ivone', opiniao:4, memoria:'Te fez documentar e assinar a venda de Mew, para que ela fosse rastreável.'},
      rep:{eixo:'bom',delta:4,motivo:'Virou testemunha do próprio crime, de propósito'},
      moral:10,
      registrar:'Documentou e assinou a venda de Mew, com data, hora, placa e descrição da maleta.',
      presagio:'Venda documentada é rastreável. Venda não documentada some.'},
  escolhas:[
    {texto:'Ir para o Planalto.', vai:'c17_fim'},
    {texto:'Escrever e assinar agora.', vai:'c17_fim'},
    {texto:'Ir atrás do carro mesmo assim.', vai:'c17_foi_atras'},
    {texto:'Ficar no orelhão um tempo.', vai:'c17_fim'}
  ]
},

c17_fim:{
  texto:[
    'O Caminho da Vitória começa na Rota 23 e sobe quatro quilômetros de rocha por dentro da montanha.',
    'No alto dele fica o Planalto Indigo, e no Planalto Indigo fica a Liga Pokémon, e a Liga Pokémon te mandou um envelope com timbre em relevo.',
    d=>{
      if (d.flags.convocacao_automatica) return 'Mandou um sistema automático que ninguém desligou, e tem quatro pessoas onde deveria ter quarenta, e três dos quatro da Elite não se apresentam desde agosto.';
      if (d.flags.sabe_dos_postos_vazios) return 'E avisou, em corpo oito, na segunda folha, que tirou a segurança do caminho.';
      return 'E não disse por quê.';
    },
    d=>{
      if (d.flags.vendeu_mew) return 'Você sobe com uma quantia de dinheiro que não cabe em nenhuma conta que você saiba abrir e uma coisa na garganta que não passa desde terça-feira às seis e quarenta da manhã.';
      if (d.flags.brincou_com_mew||d.flags.tocou_mew) return 'Você sobe pensando em vinte minutos numa clareira, e nenhuma das coisas que vão te dizer lá em cima vai ser maior que aqueles vinte minutos, e você já sabe disso, e isso muda como você vai ouvir tudo.';
      if (d.flags.protegeu_mew_pelo_silencio) return 'Você sobe sem ter visto nada, sabendo que essa foi a parte certa, e carregando a única prova que vai existir dela: que você não tem prova nenhuma.';
      if (d.flags.entendeu_o_jardim) return 'Você sobe pensando num jardim de vinte metros com quarenta e uma espécies de planta e nenhuma de bicho, construído de propósito por uma coisa que está sozinha há mais tempo do que Kanto tem nome.';
      return 'Você sobe.';
    },
    d=>d.flags.teo_vai_junto ? 'E o Téo sobe do seu lado, com quatro insígnias e um crachá de acompanhante que ninguém conferiu, falando sem parar nos primeiros oitocentos metros e calado no resto.' :
       d.flags.teo_vai_pegar_as_quatro ? 'E lá embaixo, na base da rocha, tem um garoto de quinze anos voltando pela Rota 23 pra pegar quatro insígnias que ele podia ter pulado hoje de manhã.' : '',
    'A subida leva o dia inteiro.',
    'E nos quatro quilômetros de escuro por dentro da montanha você não encontra ninguém, o que é a informação mais importante do capítulo:',
    'o Caminho da Vitória, na semana em que a Liga convoca desafiantes, está vazio.'
  ],
  fim:true, resumo:'Capítulo 17 concluído — Mew não precisava de você, e a Liga precisa.'

}

}}

);
