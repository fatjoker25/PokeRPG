/* ------------------------------------------------------------
   ABERTURAS — Lavender é a única cidade de Kanto onde a hora do
   dia muda o que a cidade é. E quem chega carregando morte não
   chega na mesma Lavender de quem chega curioso.
   ------------------------------------------------------------ */
const C7_ABERTURAS = ['c7_chegada', 'c7_ab_cortejo', 'c7_ab_de_noite', 'c7_ab_encomenda', 'c7_ab_de_cracha'];
function c7_cabe(id, d){
  if (id === 'c7_ab_cortejo')   return (d.cemiterio || []).length > 0;
  if (id === 'c7_ab_de_noite')  return d.relogio && (d.relogio.periodo === 'noite' || d.relogio.periodo === 'tarde');
  if (id === 'c7_ab_encomenda') return Estado.rep.eixo === 'bom' && Estado.rep.bom >= 3;
  if (id === 'c7_ab_de_cracha') return typeof Cargos !== 'undefined' && Cargos.lista().length >= 1;
  return true;
}
function c7_abertura(d){
  const cand = C7_ABERTURAS.filter(id => c7_cabe(id, d));
  return Dados.escolher(cand);
}

/* ============================================================
   CAPÍTULO 7 — A TORRE  (Lavender)
   ============================================================ */
CAPITULOS.push(
{
num:7, titulo:'A Torre', local:'Lavender', ambiente:'cemiterio', nivelArea:28,
tom:'muito sombrio', entradas:C7_ABERTURAS,
inicio: d => c7_abertura(d),
cenas:{

c7_ab_cortejo:{
  texto:[
    'Você entra em Lavender atrás de um cortejo e leva onze minutos pra perceber que é um cortejo, porque ninguém está chorando e ninguém está de preto.',
    'São nove pessoas andando devagar no meio da rua. Na frente, um homem de uns sessenta anos carrega uma caixa de madeira do tamanho de uma caixa de sapato, com as duas mãos, na altura do peito.',
    'Os carros param. Não tem guarda mandando parar. Eles param.',
    d=>{
      const m = d.cemiterio[d.cemiterio.length - 1];
      const nome = m && m.apelido ? m.apelido : (m && m.nome ? m.nome : 'o seu');
      return `Você não consegue olhar pra caixa sem pensar em ${nome}, e não consegue parar de olhar pra caixa.`;
    },
    'O cortejo entra na rua da torre. Você para na esquina porque seguir seria invadir alguma coisa.',
    'Uma mulher mais velha, que ficou pra trás do grupo, para do seu lado sem falar nada por um tempo.',
    fala('a mulher do cortejo', 'Você pode ir junto, sabia.'),
    d=>fala(d.jogador.nome, 'Eu não conheço vocês.'),
    fala('a mulher do cortejo', 'Ninguém conhece ninguém aqui. Essa cidade é feita disso.'),
    fala('a mulher do cortejo', 'A gente enterra junto porque enterrar sozinho é pior. É só isso.')
  ],
  ef:{flag:'viu_o_cortejo', registrar:'Chegou a Lavender atrás de um cortejo de nove pessoas.',
      presagio:'Em Lavender o luto é obra coletiva. Quem recusa a companhia carrega sozinho de propósito.'},
  escolhas:[
    {texto:'Ir junto.', vai:'c7_ab_foi_junto'},
    {texto:'Não ir. Ficar na esquina e deixar passar.', vai:'c7_ab_ficou_na_esquina'},
    {texto:'Perguntar o que tem na caixa.', vai:'c7_ab_a_caixa'}
  ]
},

c7_ab_a_caixa:{
  texto:[
    fala('a mulher do cortejo', 'Um Growlithe. Dezessete anos.'),
    'Ela fala a idade primeiro porque a idade é a parte boa.',
    fala('a mulher do cortejo', 'Do meu irmão, aquele da frente. Era de patrulha, aposentou com nove, viveu mais oito de sofá.'),
    fala('a mulher do cortejo', 'Ele não chorou nenhuma vez ainda. Vai chorar lá em cima, no quarto andar, que é onde todo mundo chora.'),
    d=>fala(d.jogador.nome, 'Por que o quarto andar?'),
    fala('a mulher do cortejo', 'Porque do quarto andar dá pra ver a casa da gente.')
  ],
  ef:{registrar:'No quarto andar da Torre Pokémon dá pra ver a cidade inteira. É onde as pessoas choram.'},
  escolhas:[
    {texto:'Ir junto com eles.', vai:'c7_ab_foi_junto'},
    {texto:'Deixar passar e andar pela cidade.', vai:'c7_cidade'}
  ]
},

c7_ab_foi_junto:{
  texto:[
    'Você anda no fim do grupo, a três passos de todo mundo, que é a distância de quem foi convidado mas não pertence.',
    'Ninguém olha pra você com estranheza. Duas pessoas acenam com a cabeça.',
    'Na base da torre tem um homem de camisa cinza com uma prancheta, e ele não pergunta nome de ninguém: ele conta.',
    fala('o homem da prancheta', 'Dez.'),
    'Ele escreve dez. Você virou o décimo de um luto que não é seu, e de alguma forma isso não é uma mentira.',
    'Lá dentro é fresco e cheira a incenso queimado há muito tempo, não agora. O grupo sobe. Você fica no térreo.',
    'Do térreo dá pra ouvir nove pares de pé subindo, e depois, quatro andares acima, um homem de sessenta anos chorando de um jeito que é melhor não ouvir de perto.'
  ],
  ef:{flag:'subiu_com_o_cortejo', moral:1,
      rep:{eixo:'bom', delta:1, motivo:'Acompanhou o enterro de um Growlithe que não era seu.'},
      registrar:'Acompanhou um cortejo desconhecido até a base da Torre Pokémon.'},
  escolhas:[
    {texto:'Subir também.', vai:'c7_base'},
    {texto:'Sair e andar pela cidade.', vai:'c7_cidade'}
  ]
},

c7_ab_ficou_na_esquina:{
  texto:[
    'Você fica. O cortejo entra na rua da torre e some atrás do primeiro quarteirão, e a rua volta a ter carro em menos de dez segundos.',
    'É assustador como volta rápido.',
    d=>{
      const m = d.cemiterio[d.cemiterio.length - 1];
      const nome = m && m.apelido ? m.apelido : (m && m.nome ? m.nome : 'o seu');
      return `Você fica pensando que ${nome} não teve nove pessoas. Teve você.`;
    },
    'Lavender não tem música. Você repara nisso agora, parado numa esquina sem nada pra fazer, e quando repara não consegue mais deixar de reparar.'
  ],
  ef:{flag:'nao_foi_no_cortejo', registrar:'Viu o cortejo passar e não foi junto.'},
  escolhas:[
    {texto:'Ir até a base da torre mesmo assim.', vai:'c7_base'},
    {texto:'Andar pela cidade.', vai:'c7_cidade'},
    {texto:'Procurar onde dormir.', vai:'c7_pousada'}
  ]
},

c7_ab_de_noite:{
  texto:[
    'Você chega em Lavender com o sol já baixo, e Lavender ao entardecer faz uma coisa que nenhuma outra cidade de Kanto faz: ela acende as janelas antes de acender a rua.',
    'Primeiro as casas. Depois, com uns vinte minutos de atraso, os postes.',
    'Nesses vinte minutos a cidade inteira é só quadradinhos amarelos de janela com gente dentro, e a torre no fim da rua principal sem nenhuma luz nenhuma, porque a Torre Pokémon não tem luz externa.',
    'Sete andares de concreto cinza que somem no escuro de baixo pra cima.',
    'Um homem passa de bicicleta com um saco de pão no guidão e freia do seu lado sem você pedir.',
    fala('o homem da bicicleta', 'Não sobe hoje.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('o homem da bicicleta', 'Porque não tem luz lá dentro e porque eu moro aqui há quarenta anos e é o que eu falo pra todo mundo que chega nesse horário.'),
    'Ele volta a pedalar.',
    fala('o homem da bicicleta', 'Metade sobe mesmo assim. Eu falo do mesmo jeito.')
  ],
  ef:{flag:'avisaram_pra_nao_subir_de_noite', registrar:'Chegou a Lavender ao anoitecer. Avisaram para não subir a torre hoje.'},
  escolhas:[
    {texto:'Subir hoje mesmo assim.', vai:'c7_base'},
    {texto:'Procurar onde dormir e deixar a torre pra amanhã.', vai:'c7_pousada'},
    {texto:'Andar pela cidade enquanto ainda tem gente na rua.', vai:'c7_cidade'}
  ]
},

c7_ab_encomenda:{
  texto:[
    'Você ainda não chegou na cidade direito — está na entrada, na altura da última curva da Rota 8 — e já tem alguém te esperando na beira da estrada.',
    'É uma menina de uns treze anos, sentada numa mochila, com uma caixa de papelão no colo amarrada com barbante. A caixa tem um nome escrito no barbante com caneta de retroprojetor: ELSA.',
    d=>{
      const r = Estado.nomeRep();
      return `Ela levanta quando te vê e fala o seu nome inteiro, com sobrenome e tudo, do jeito de quem ensaiou. "${r}", ela acrescenta, como se precisasse confirmar que é você mesmo.`;
    },
    fala('Elsa', 'Me falaram que você ia passar por aqui essa semana.'),
    d=>fala(d.jogador.nome, 'Quem falou?'),
    fala('Elsa', 'Todo mundo. Você é o assunto de duas cidades, você não sabe disso?'),
    'Ela estende a caixa. É leve. Chacoalha um pouco.',
    fala('Elsa', 'É pra levar pro quarto andar da torre. Eu não consigo subir.'),
    fala('Elsa', 'Eu tentei três vezes.', 'baixo')
  ],
  ef:{flag:'tem_a_caixa_da_menina',
      npc:{nome:'Elsa', opiniao:1, viuVoce:'Te esperou na entrada de Lavender com uma encomenda.'},
      registrar:'Uma menina te entregou uma caixa para levar ao quarto andar da Torre Pokémon.'},
  escolhas:[
    {texto:'Aceitar. Perguntar o que tem dentro depois.', vai:'c7_ab_aceitou'},
    {texto:'Perguntar o que tem dentro antes de aceitar.', vai:'c7_ab_o_que_tem'},
    {texto:'Dizer que ela tem que subir. Você vai junto.', vai:'c7_ab_vai_junto'}
  ]
},

c7_ab_o_que_tem:{
  texto:[
    'Ela demora. Olha pra caixa como se a caixa fosse responder por ela.',
    fala('Elsa', 'Coleira, uma bola vazia e um chinelo.'),
    d=>fala(d.jogador.nome, 'Um chinelo?'),
    fala('Elsa', 'Ele dormia em cima do chinelo do meu pai. Todo dia. Oito anos.'),
    'Ela diz "oito anos" e a voz não quebra, porque ela já contou isso muitas vezes e treinou.',
    fala('Elsa', 'Meu pai falou que a gente não ia guardar. Falou que guardar faz mal.'),
    fala('Elsa', 'Eu concordo com ele. Só não consigo jogar fora. Na torre não é jogar fora.')
  ],
  ef:{registrar:'A caixa tem uma coleira, uma bola vazia e um chinelo.'},
  escolhas:[
    {texto:'Aceitar levar.', vai:'c7_ab_aceitou'},
    {texto:'Dizer que ela tem que subir. Você vai junto.', vai:'c7_ab_vai_junto'}
  ]
},

c7_ab_aceitou:{
  texto:[
    'Você pega a caixa e põe debaixo do braço, e ela é leve de um jeito que incomoda.',
    'A menina agradece três vezes, o que é duas vezes mais do que a situação pede, e vai embora rápido pra estrada, no sentido de Saffron.',
    'Ela some na curva e você fica na entrada de Lavender segurando a caixa de outra pessoa.',
    'A cidade não tem música. Você repara nisso agora.'
  ],
  ef:{flag:'levou_a_caixa_sozinho', registrar:'Aceitou levar a caixa da menina até a torre.'},
  escolhas:[
    {texto:'Ir direto até a base da torre.', vai:'c7_base'},
    {texto:'Andar pela cidade primeiro.', vai:'c7_cidade'}
  ]
},

c7_ab_vai_junto:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu levo. Mas você sobe comigo.'),
    'Ela balança a cabeça antes de você terminar a frase.',
    fala('Elsa', 'Não.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('Elsa', 'Porque eu já subi três vezes e nas três eu voltei no segundo andar.'),
    'Ela senta na mochila de novo.',
    fala('Elsa', 'Não é medo de fantasma. Todo mundo acha que é medo de fantasma.'),
    fala('Elsa', 'É que subindo a escada eu ainda tô levando ele pra algum lugar. Quando eu chegar em cima acabou de levar.', 'baixo'),
    'Você fica um tempo sem saber o que dizer, o que é a resposta certa.',
    d=>fala(d.jogador.nome, 'Então a gente sobe devagar.'),
    'Ela levanta.'
  ],
  ef:{flag:'a_menina_vai_subir', moral:1,
      rep:{eixo:'bom', delta:1, motivo:'Convenceu a menina a subir a torre em vez de levar a caixa por ela.'},
      npc:{nome:'Elsa', opiniao:2, viuVoce:'Subiu a Torre Pokémon com você.'},
      registrar:'A menina da caixa vai subir a torre com você.'},
  escolhas:[
    {texto:'Ir até a base da torre com ela.', vai:'c7_base'}
  ]
},

c7_ab_de_cracha:{
  texto:[
    'Tem um posto da prefeitura na entrada de Lavender que não existe em nenhuma outra cidade de Kanto: uma guarita de dois metros por dois com uma janelinha, e dentro dela uma mulher com um livro de registro.',
    'Não é fiscalização. É outra coisa.',
    fala('a funcionária da guarita', 'Bom dia. Veio visitar ou veio sepultar?'),
    'É a pergunta mais direta que alguém já te fez.',
    d=>{
      const c = Cargos.principal();
      return `Você mostra o crachá de ${c ? c.nome : 'serviço'} sem saber muito bem por quê, e ela lê com atenção de quem lê tudo.`;
    },
    fala('a funcionária da guarita', 'Ah. Do serviço.'),
    'Ela fecha o livro de registro. Não guarda: fecha, e deixa a mão em cima.',
    fala('a funcionária da guarita', 'Então eu vou te falar uma coisa que eu não falo pra visitante.', 'baixo'),
    fala('a funcionária da guarita', 'Esse livro aqui registra quem sobe a torre desde mil novecentos e setenta e quatro.'),
    fala('a funcionária da guarita', 'Nos últimos dois meses subiu gente que não desceu, e eu reportei três vezes, e ninguém veio.')
  ],
  ef:{flag:'o_livro_da_guarita',
      npc:{nome:'a funcionária da guarita', opiniao:1, viuVoce:'Te contou do livro de registro porque você tinha crachá.'},
      registrar:'O livro da guarita registra quem sobe a torre desde 1974. Nos últimos dois meses, subiu gente que não desceu.',
      presagio:'Ela reportou três vezes e ninguém veio. Isso é informação sobre quem devia vir.'},
  escolhas:[
    {texto:'Pedir pra ver o livro.', vai:'c7_ab_o_livro'},
    {texto:'Perguntar pra quem exatamente ela reportou.', vai:'c7_ab_pra_quem'},
    {texto:'Agradecer e ir direto pra torre.', vai:'c7_base'}
  ]
},

c7_ab_o_livro:{
  texto:[
    'Ela abre o livro nas últimas páginas e vira pra você sem entregar.',
    'Cada linha tem data, hora de subida e hora de descida. A terceira coluna é preenchida a lápis, porque a terceira coluna é a que às vezes não acontece.',
    'Nos últimos dois meses tem onze linhas com a terceira coluna vazia.',
    'Das onze, oito são da mesma hora do dia: entre três e quatro da manhã.',
    fala('a funcionária da guarita', 'A guarita fecha às dez.'),
    d=>fala(d.jogador.nome, 'Então quem anotou essas oito?'),
    'Ela vira o livro de volta e não responde na hora.',
    fala('a funcionária da guarita', 'Elas aparecem escritas quando eu abro de manhã.', 'baixo'),
    fala('a funcionária da guarita', 'Com a minha letra.')
  ],
  ef:{flag:'oito_linhas_de_madrugada',
      registrar:'Onze pessoas subiram a torre nos últimos dois meses e não desceram. Oito subiram entre três e quatro da manhã.',
      presagio:'Alguém escreve no livro com a letra dela, de madrugada, com a guarita fechada.'},
  escolhas:[
    {texto:'Ir até a base da torre.', vai:'c7_base'},
    {texto:'Andar pela cidade primeiro e perguntar por aí.', vai:'c7_cidade'}
  ]
},

c7_ab_pra_quem:{
  texto:[
    fala('a funcionária da guarita', 'Primeiro pra prefeitura. A prefeitura falou que a torre é da Liga.'),
    fala('a funcionária da guarita', 'Aí eu liguei pra Liga. A Liga falou que a torre é patrimônio, quem cuida é a Fundação.'),
    d=>fala(d.jogador.nome, 'E a Fundação?'),
    fala('a funcionária da guarita', 'A Fundação não existe desde oitenta e seis.'),
    'Ela fala isso sem drama nenhum, como quem já passou da parte de achar isso absurdo.',
    fala('a funcionária da guarita', 'Eu tenho as três respostas por escrito. Se você quiser cópia eu tiro.'),
    'Você diz que quer, e ela já tinha tirado. Estava numa pasta embaixo do livro, esperando alguém pedir há dois meses.'
  ],
  ef:{flag:'copia_das_tres_respostas',
      registrar:'Tem cópia por escrito: prefeitura aponta pra Liga, Liga aponta pra Fundação, Fundação não existe desde 1986.'},
  escolhas:[
    {texto:'Pedir pra ver o livro de registro também.', vai:'c7_ab_o_livro'},
    {texto:'Ir até a base da torre.', vai:'c7_base'}
  ]
},


c7_chegada:{
  texto:[
    'Lavender não tem música.',
    'Você só percebe isso depois de meia hora na cidade, e quando percebe não consegue mais deixar de perceber. Nenhum rádio numa janela. Nenhuma loja com alto-falante. Nenhum carro passando com som.',
    'Não tem placa proibindo nada. É uma decisão coletiva que ninguém tomou e que todo mundo cumpre.',
    'As casas são de dois andares, geminadas, com fachada pintada em cores que já foram fortes. Tem flor em quase toda janela.',
    'E no fim da rua principal, a Torre Pokémon: sete andares, concreto cinza, a coisa mais alta num raio de quilômetros.',
    'Não é um prédio bonito. Ninguém tentou fazer ela ser bonita. Ela não foi feita pra ser vista de fora.'
  ],
  ef:{registrar:'Chegou a Lavender Town.'},
  escolhas:[
    {texto:'Ir direto até a base da torre.', vai:'c7_base'},
    {texto:'Andar pela cidade primeiro.', vai:'c7_cidade'},
    {texto:'Procurar onde dormir e deixar a torre pra amanhã.', vai:'c7_pousada'},
    {texto:'Perguntar pra alguém por que não tem música.', vai:'c7_a_musica'}
  ]
},

c7_a_musica:{
  texto:[
    'Você pergunta pra primeira pessoa, uma mulher regando vaso numa varanda baixa.',
    'Ela para de regar.',
    '"Como assim não tem música?"',
    'E aí ela fica ouvindo. De verdade: ela para, e escuta a rua dela, e o rosto dela muda.',
    '"Ah." Ela volta a regar. "Eu não tinha reparado."',
    'Ela mora aqui há vinte e dois anos e não tinha reparado.',
    '"Deve ser por causa da torre", ela diz, sem convicção nenhuma. "Não é uma regra. Ninguém proibiu."'
  ],
  ef:{flag:'perguntou_da_musica',
      presagio:'Ninguém proibiu. As piores regras são as que ninguém precisou escrever.'},
  escolhas:[
    {texto:'"Quando foi que parou?"', vai:'c7_quando_parou'},
    {texto:'Ir até a base da torre.', vai:'c7_base'},
    {texto:'Andar pela cidade.', vai:'c7_cidade'},
    {texto:'Agradecer e procurar pousada.', vai:'c7_pousada'}
  ]
},

c7_quando_parou:{
  texto:[
    '"Quando foi que parou?"',
    'Ela pensa com a regador na mão.',
    '"Eu acho que nunca teve."',
    'Ela mexe as folhas de uma samambaia, procurando bicho.',
    '"Meu pai era daqui. O pai dele era daqui. A torre é de mil oitocentos e alguma coisa." Ela dá de ombros. "Talvez a gente nunca tenha ligado rádio nessa rua desde que rádio existe."',
    'Ela fecha a torneira.',
    '"Tem gente que muda pra cá e traz som. Dura uns dois meses."',
    '"E aí?"',
    '"E aí não dura."'
  ],
  ef:{flag:'nunca_teve_musica',
      presagio:'"E aí não dura." Ela não explicou por quê, e você também não vai conseguir explicar quando sair daqui.'},
  escolhas:[
    {texto:'Ir até a base da torre.', vai:'c7_base'},
    {texto:'Andar pela cidade.', vai:'c7_cidade'},
    {texto:'Procurar pousada.', vai:'c7_pousada'}
  ]
},

c7_cidade:{
  texto:[
    'Lavender tem uma rua principal, quatro transversais e uma praça com um coreto que claramente nunca teve banda.',
    'O comércio é específico de um jeito que você leva um tempo pra entender: tem três floriculturas numa cidade de duas mil pessoas. Tem uma loja que vende incenso, vela e Potion no mesmo balcão.',
    'Tem uma marcenaria com uma placa escrita "URNAS — TODOS OS TAMANHOS", e na vitrine tem urnas de todos os tamanhos, e as menores são muito pequenas.',
    'E tem gente. Muita gente de fora — dá pra reconhecer pela roupa e pelo jeito de andar, mais devagar, olhando as fachadas.',
    'Essa cidade vive de luto. É a indústria dela.'
  ],
  ef:{flag:'viu_a_cidade',
      executar:d=>{ Mundo.descobrir('loja_lavender'); Mundo.descobrir('achou_loja_lavender'); return []; }},
  escolhas:[
    {texto:'Entrar na marcenaria.', vai:'c7_marcenaria'},
    {texto:'Entrar numa das floriculturas.', vai:'c7_flores'},
    {texto:'Ir até a base da torre.', vai:'c7_base'},
    {texto:'Procurar onde dormir.', vai:'c7_pousada'}
  ]
},

c7_marcenaria:{
  texto:[
    'O marceneiro tem umas sessenta anos e serragem no braço até o cotovelo.',
    'Ele te vê entrar e não pergunta o que você quer, porque ele já sabe as duas possibilidades.',
    '"Pra hoje ou pra guardar?"',
    '"Como assim?"',
    'Ele aponta duas prateleiras diferentes.',
    '"Essas aqui é pra hoje. Essas de cá é pra guardar." Ele limpa as mãos num pano. "Tem gente que compra antes. Treinador, principalmente. Compra do tamanho e leva na mochila."',
    'Você olha a prateleira "pra guardar".',
    '"Isso não é mórbido, moço", ele diz, lendo sua cara. "É que quem tá em rota não tem onde comprar."'
  ],
  ef:{flag:'viu_as_urnas',
      presagio:'Tem gente que compra antes. Você vai entender por quê, e vai ser tarde demais pra voltar aqui.'},
  escolhas:[
    {texto:'Comprar uma pequena. (900 ₽)', vai:'c7_comprou_urna', cond:d=>d.jogador.dinheiro>=900,
     ef:{dinheiro:-900, flag:'tem_urna'}},
    {texto:'"Quanto o senhor vende por mês?"', vai:'c7_quantas_urnas'},
    {texto:'Sair sem comprar.', vai:'c7_cidade2'},
    {texto:'"Já veio treinador comprar depois?"', vai:'c7_urna_depois'}
  ]
},

c7_comprou_urna:{
  texto:[
    'É de cedro, do tamanho de uma caixa de sapato de criança, com a tampa encaixando por atrito e sem nenhum enfeite.',
    'Ele embrulha em papel pardo e barbante e entrega com as duas mãos, e não diz "volte sempre".',
    'Você guarda no fundo da mochila, embaixo de tudo.',
    'Ela pesa quatrocentos gramas. Você vai carregar quatrocentos gramas por muito tempo esperando não precisar.'
  ],
  ef:{presagio:'Quatrocentos gramas no fundo da mochila. Toda vez que você reorganizar a mochila, você vai encostar nela.'},
  escolhas:[
    {texto:'Sair.', vai:'c7_cidade2'},
    {texto:'"Já veio treinador comprar depois?"', vai:'c7_urna_depois'}
  ]
},

c7_quantas_urnas:{
  texto:[
    '"Quanto o senhor vende por mês?"',
    '"Depende do mês."',
    'Ele ajeita as urnas pequenas na prateleira, alinhando as bordas.',
    '"Novembro e dezembro é forte. Sabe por quê?"',
    'Você não sabe.',
    '"Porque em janeiro tem a leva nova." Ele continua alinhando. "Sai todo mundo de casa em janeiro. Aí em novembro tem dez, onze meses de estrada nas costa de gente que saiu com quinze anos."',
    'Ele para de alinhar.',
    'Você faz a conta de quando você saiu de casa e de que mês é hoje.'
  ],
  ef:{flag:'a_conta_de_novembro',
      presagio:'Novembro e dezembro. Faz a conta de quantos meses faltam.'},
  escolhas:[
    {texto:'Comprar uma pequena. (900 ₽)', vai:'c7_comprou_urna', cond:d=>d.jogador.dinheiro>=900,
     ef:{dinheiro:-900, flag:'tem_urna'}},
    {texto:'"Já veio treinador comprar depois?"', vai:'c7_urna_depois'},
    {texto:'Sair.', vai:'c7_cidade2'}
  ]
},

c7_urna_depois:{
  texto:[
    '"Já veio treinador comprar depois? Com o bicho já—"',
    '"Vem." Ele corta antes de você terminar. "Vem toda semana."',
    'Ele apoia as duas mãos no balcão.',
    '"E esses eu atendo primeiro. Eu paro o que eu tô fazendo." Ele olha pra oficina nos fundos. "Porque quem chega aqui com o bicho na mochila chega numa condição que não dá pra deixar esperando."',
    'Ele volta a lixar uma tampa.',
    '"Tem um banco ali. Eu boto água. Eles ficam sentado ali um tempo e eu deixo."'
  ],
  ef:{flag:'o_banco_da_marcenaria',
      npc:{nome:'Marceneiro de Lavender', opiniao:2, memoria:'Te explicou que atende primeiro quem chega com o Pokémon na mochila.'},
      presagio:'Tem um banco na marcenaria com água em cima. Espera nunca sentar nele.'},
  escolhas:[
    {texto:'Comprar uma pequena. (900 ₽)', vai:'c7_comprou_urna', cond:d=>d.jogador.dinheiro>=900,
     ef:{dinheiro:-900, flag:'tem_urna'}},
    {texto:'Sair.', vai:'c7_cidade2'},
    {texto:'Ir até a torre.', vai:'c7_base'}
  ]
},

c7_flores:{
  texto:[
    'A floricultura não tem rosa, não tem buquê de festa, não tem nada com fita colorida.',
    'Tem crisântemo branco, lírio e uma flor pequena e amarela que você não conhece.',
    'A moça do balcão tem uns vinte e cinco anos e está fazendo um arranjo com uma velocidade impressionante.',
    '"Pra levar na torre?"',
    '"Eu não sei."',
    'Ela para de amarrar.',
    '"Todo mundo que vem aqui sabe." Ela olha pra você com atenção. "Você não veio enterrar ninguém."',
    '"Não."',
    '"Então você veio subir." Ela volta ao arranjo, e agora o jeito dela mudou. "Compra a amarela."'
  ],
  ef:{flag:'floricultura'},
  escolhas:[
    {texto:'"Por que a amarela?"', vai:'c7_a_amarela'},
    {texto:'Comprar a amarela. (200 ₽)', vai:'c7_comprou_flor', cond:d=>d.jogador.dinheiro>=200,
     ef:{dinheiro:-200, flag:'tem_a_flor'}},
    {texto:'"Subir por quê? O que tem lá em cima?"', vai:'c7_o_que_tem'},
    {texto:'Sair.', vai:'c7_cidade2'}
  ]
},

c7_a_amarela:{
  texto:[
    '"Por que a amarela?"',
    '"Porque ela é a única que cresce aqui." Ela corta um caule. "As outras vêm de caminhão de Celadon. A amarela nasce sozinha no morro atrás da torre."',
    '"E isso importa?"',
    'Ela levanta a cabeça.',
    '"Pra quem tá enterrado, não. Pra quem enterra, importa muito."',
    'Ela amarra o arranjo.',
    '"Tem gente que sobe com flor de caminhão e desce chorando. Tem gente que sobe com a amarela e desce chorando também. É a mesma choradeira." Ela dá de ombros. "Mas a amarela a pessoa foi buscar."'
  ],
  ef:{flag:'entendeu_a_flor',
      presagio:'A diferença não é a flor. É ter ido buscar.'},
  escolhas:[
    {texto:'Comprar a amarela. (200 ₽)', vai:'c7_comprou_flor', cond:d=>d.jogador.dinheiro>=200,
     ef:{dinheiro:-200, flag:'tem_a_flor'}},
    {texto:'"Onde é o morro atrás da torre?"', vai:'c7_morro'},
    {texto:'"O que tem lá em cima?"', vai:'c7_o_que_tem'},
    {texto:'Sair.', vai:'c7_cidade2'}
  ]
},

c7_morro:{
  texto:[
    '"Onde é o morro atrás da torre?"',
    'Ela te olha como se você tivesse dito uma bobagem, e depois entende, e depois acha graça.',
    '"Você vai colher?"',
    '"Vou."',
    '"Ninguém faz isso." Ela ri. "Sério, ninguém faz isso, eu vendo por duzentos justamente porque ninguém quer subir o morro."',
    'Ela desenha um mapa num pedaço de papel de embrulho. É um mapa péssimo.',
    '"Sai pelos fundos da torre, passa a cerca baixa, e sobe. Vinte minutos. Tem muita."'
  ],
  ef:{flag:'mapa_do_morro'},
  escolhas:[
    {texto:'Ir colher agora.', vai:'c7_colheu'},
    {texto:'Comprar a amarela mesmo assim. (200 ₽)', vai:'c7_comprou_flor', cond:d=>d.jogador.dinheiro>=200,
     ef:{dinheiro:-200, flag:'tem_a_flor'}},
    {texto:'Ir até a torre primeiro.', vai:'c7_base'},
    {texto:'Sair.', vai:'c7_cidade2'}
  ]
},

c7_colheu:{
  texto:[
    'Vinte e cinco minutos de subida por um morro de capim alto atrás da torre, com a cidade ficando pequena embaixo.',
    'A flor amarela está em todo lugar. É uma flor feia, na verdade: caule fino, pétala irregular, nada de especial.',
    'Você colhe umas quinze e faz um maço com um fio de capim porque não tem barbante.',
    'Lá de cima, sentado no capim com o maço na mão, dá pra ver a torre inteira de lado.',
    'Dá pra ver que ela tem sete andares e que só os três primeiros têm janela.'
  ],
  ef:{flag:['tem_a_flor','colheu_a_flor','viu_a_torre_de_lado'],
      rep:{eixo:'bom',delta:1,motivo:'Subiu o morro pra colher a flor em vez de comprar'},
      hp:2,
      presagio:'Só os três primeiros andares têm janela. Alguém construiu isso de propósito.'},
  escolhas:[
    {texto:'Descer e ir até a base da torre.', vai:'c7_base'},
    {texto:'Ficar aqui em cima um pouco.', vai:'c7_morro_ficou'},
    {texto:'Voltar na floricultura e contar.', vai:'c7_voltou_flor'}
  ]
},

c7_morro_ficou:{
  texto:[
    'Você fica sentado no morro por quase uma hora com um maço de flor feia na mão.',
    'Daqui dá pra ver a cidade inteira e a torre e, além dela, a estrada que sai pro sul.',
    'Passa um enterro lá embaixo: seis pessoas andando devagar da rua principal até a base da torre, e uma delas carregando uma caixa pequena.',
    'Daqui não dá pra ouvir nada. Você assiste um enterro inteiro em silêncio absoluto, de um morro, a quinhentos metros.',
    'Dura onze minutos. Depois eles entram na torre e a rua fica vazia de novo.'
  ],
  ef:{flag:'viu_o_enterro_de_longe',
      presagio:'Onze minutos. É quanto dura, e depois a rua fica vazia de novo.'},
  escolhas:[
    {texto:'Descer e ir até a torre.', vai:'c7_base'},
    {texto:'Voltar na floricultura.', vai:'c7_voltou_flor'},
    {texto:'Procurar pousada.', vai:'c7_pousada'}
  ]
},

c7_voltou_flor:{
  texto:[
    'Você volta na floricultura com o maço feito com fio de capim.',
    'A moça olha, e olha mais um pouco, e não diz nada por um tempo desconfortável.',
    '"Você subiu mesmo."',
    '"Subi."',
    'Ela pega o maço da sua mão, desmancha o fio de capim, refaz o arranjo em quarenta segundos com uma técnica que você não consegue acompanhar, e amarra com barbante de verdade.',
    'Devolve.',
    '"Não cobro." Ela já está no próximo arranjo. "E leva a boa notícia: você é o primeiro em dois anos."'
  ],
  ef:{npc:{nome:'Moça da floricultura', opiniao:5, memoria:'Você subiu o morro pra colher a flor amarela. Primeiro em dois anos.'},
      flag:'tem_a_flor',
      rep:{eixo:'bom',delta:1,motivo:'Fez o caminho mais longo por nada'}},
  escolhas:[
    {texto:'Ir até a base da torre.', vai:'c7_base'},
    {texto:'"O que tem lá em cima?"', vai:'c7_o_que_tem'},
    {texto:'Procurar pousada.', vai:'c7_pousada'}
  ]
},

c7_comprou_flor:{
  texto:[
    'Ela amarra com barbante e te entrega, e é uma flor feia e amarela e você não sabe muito bem o que vai fazer com ela.',
    '"Leva na mão", ela diz. "Não põe na mochila. Fica feio chegar lá em cima com flor amassada."'
  ],
  escolhas:[
    {texto:'Ir até a base da torre.', vai:'c7_base'},
    {texto:'"O que tem lá em cima?"', vai:'c7_o_que_tem'},
    {texto:'Andar mais pela cidade.', vai:'c7_cidade2'}
  ]
},

c7_o_que_tem:{
  texto:[
    '"Subir por quê? O que tem lá em cima?"',
    'A moça da floricultura para o que está fazendo.',
    '"Do quarto pra cima?"',
    '"É."',
    'Ela pensa em como responder.',
    '"Tem Gastly." Ela volta ao arranjo. "Do quarto pro sétimo tem Gastly, e Haunter, e o zelador diz que tem um Gengar no sétimo, mas ninguém viu."',
    '"E eles atacam?"',
    '"Eles mostram."',
    'Ela corta um caule com mais força do que precisava.',
    '"Eles não inventam nada. Eles pegam o que já tá em você e põem na sua frente. Se você não tem nada podre, não tem o que ver."'
  ],
  ef:{flag:'aviso_dos_gastly'},
  escolhas:[
    {texto:'"E a senhora subiu?"', vai:'c7_ela_subiu'},
    {texto:'Ir até a base da torre.', vai:'c7_base'},
    {texto:'Comprar a amarela. (200 ₽)', vai:'c7_comprou_flor', cond:d=>d.jogador.dinheiro>=200,
     ef:{dinheiro:-200, flag:'tem_a_flor'}},
    {texto:'Sair.', vai:'c7_cidade2'}
  ]
},

c7_ela_subiu:{
  texto:[
    '"E a senhora subiu?"',
    '"Uma vez. Com dezesseis anos, com dois amigos, de brincadeira."',
    'Ela para.',
    '"A gente subiu até o quinto."',
    '"E viu o quê?"',
    'Ela mexe nos crisântemos por uns cinco segundos.',
    '"Eu vi uma coisa que eu tinha feito no ano anterior e que ninguém sabia."',
    'Ela olha pra você.',
    '"E o pior não foi ver. O pior foi que os meus dois amigos tavam do meu lado e eles não viram nada. Cada um viu a própria coisa."'
  ],
  ef:{flag:'cada_um_ve_a_sua',
      presagio:'Cada um vê a própria coisa. E cada um sabe qual é a sua antes de subir.'},
  escolhas:[
    {texto:'Ir até a base da torre.', vai:'c7_base'},
    {texto:'"E a senhora voltou lá depois?"', vai:'c7_voltou_depois'},
    {texto:'Sair.', vai:'c7_cidade2'}
  ]
},

c7_voltou_depois:{
  texto:[
    '"E a senhora voltou lá depois?"',
    '"Nunca mais."',
    'Ela ri de leve.',
    '"Eu moro a duzentos metros e eu não entro naquele prédio faz nove anos. Eu vendo flor pra quem entra."',
    'Ela amarra o arranjo.',
    '"E antes que você pergunte: não, eu não consertei a coisa que eu vi. Eu só parei de subir."'
  ],
  ef:{presagio:'Ela parou de subir. Você tem duas opções aqui, e uma delas é essa.'},
  escolhas:[
    {texto:'Ir até a base da torre.', vai:'c7_base'},
    {texto:'Sair.', vai:'c7_cidade2'}
  ]
},

c7_cidade2:{
  texto:[
    'A rua principal continua sem música.',
    'A torre continua no fim dela, cinza, com os três primeiros andares com janela e os outros quatro sem.',
    'Começa a escurecer, e Lavender escurecendo é uma coisa específica: as luzes das casas acendem, e a torre não acende nenhuma.'
  ],
  escolhas:[
    {texto:'Ir até a base da torre.', vai:'c7_base'},
    {texto:'Procurar onde dormir.', vai:'c7_pousada'},
    {texto:'Entrar na marcenaria.', vai:'c7_marcenaria'},
    {texto:'Entrar na floricultura.', vai:'c7_flores'}
  ]
},

c7_pousada:{
  texto:[
    'A pousada de Lavender fica em cima de uma das floriculturas e tem seis quartos.',
    'O dono é um homem de uns trinta e cinco anos com olheiras permanentes.',
    '"Uma noite?"',
    '"Uma."',
    'Ele anota num caderno. Não pede documento.',
    '"Quarto três. O chuveiro demora." Ele entrega a chave. "E se você ouvir alguma coisa de madrugada, é do quarto cinco, e é normal."'
  ],
  ef:{dinheiro:-600, hp:5},
  escolhas:[
    {texto:'"O que tem no quarto cinco?"', vai:'c7_quarto_cinco'},
    {texto:'Subir, dormir, e ir à torre de manhã.', vai:'c7_dormiu'},
    {texto:'Largar a mochila e ir à torre agora.', vai:'c7_base'},
    {texto:'Perguntar do trabalho dele.', vai:'c7_dono_pousada'}
  ]
},

c7_quarto_cinco:{
  texto:[
    '"O que tem no quarto cinco?"',
    '"Gente."',
    'Ele guarda o caderno.',
    '"Metade dos meus hóspedes tá aqui pra enterrar alguma coisa. Eles chegam de tarde, enterram, e ficam a noite porque ninguém volta dirigindo depois disso."',
    'Ele ajeita as chaves no quadro.',
    '"Então de madrugada tem choro. Todo dia tem choro em algum quarto." Ele fala isso sem nenhum peso. "Eu já não escuto mais. Você vai escutar, porque é a primeira vez."'
  ],
  ef:{flag:'o_quarto_cinco',
      presagio:'Ele já não escuta mais. Isso aconteceu com ele em algum ponto, e ele nem sabe quando.'},
  escolhas:[
    {texto:'Subir e dormir.', vai:'c7_dormiu'},
    {texto:'"Como o senhor aguenta isso?"', vai:'c7_dono_pousada'},
    {texto:'Largar a mochila e ir à torre agora.', vai:'c7_base'}
  ]
},

c7_dono_pousada:{
  texto:[
    '"Como o senhor aguenta isso?"',
    'Ele demora pra responder e você acha que ofendeu.',
    '"Eu não aguento." Ele dá de ombros. "Eu tô vendendo a pousada faz três anos."',
    '"E ninguém compra?"',
    '"Compram. Já teve dois interessado." Ele limpa o balcão. "Aí eles vêm passar um fim de semana pra conhecer, e ouvem o choro do quarto cinco, e no dia seguinte inventam uma desculpa."',
    'Ele guarda o pano.',
    '"Eu nasci nessa cidade. Todo mundo que nasce aqui acha que vai sair."'
  ],
  ef:{npc:{nome:'Dono da pousada', opiniao:2, memoria:'Está tentando vender a pousada de Lavender há três anos.'},
      presagio:'Todo mundo que nasce aqui acha que vai sair.'},
  escolhas:[
    {texto:'Subir e dormir.', vai:'c7_dormiu'},
    {texto:'Ir à torre agora.', vai:'c7_base'}
  ]
},

c7_dormiu:{
  texto:[
    'O quarto três tem uma cama, uma cadeira e uma janela que dá pra torre.',
    'Você fecha a cortina. A cortina é fina e a torre continua ali.',
    'Você dorme quatro horas e acorda às duas e quarenta com um som.',
    'É do quarto cinco. É uma mulher, e ela não está chorando alto, e é por isso que dá pra ouvir a respiração dela, e é isso que não deixa você dormir de novo.',
    'Você fica olhando o teto até clarear.',
    'Às seis da manhã, quando você desce, tem uma senhora tomando café na copa, de olhos vermelhos, e ela te dá bom dia com uma educação impecável.'
  ],
  ef:{hp:3, flag:'a_noite_na_pousada',
      presagio:'Ela te deu bom dia com educação impecável. As pessoas fazem isso. Todo dia, em todo lugar.'},
  escolhas:[
    {texto:'Sentar e tomar café com ela.', vai:'c7_cafe_senhora'},
    {texto:'Dar bom dia e ir pra torre.', vai:'c7_base'},
    {texto:'Perguntar se ela precisa de alguma coisa.', vai:'c7_cafe_senhora'},
    {texto:'Sair sem falar nada.', vai:'c7_base'}
  ]
},

c7_cafe_senhora:{
  texto:[
    'Você senta. Ela empurra a garrafa de café na sua direção sem você pedir.',
    'Vocês dois tomam café por uns três minutos sem falar nada.',
    '"Era um Growlithe", ela diz do nada. "Catorze anos."',
    '"Sinto muito."',
    '"Obrigada." Ela mexe o café. "Catorze anos é muito, sabia? A gente teve sorte."',
    'Ela fala isso e o rosto dela desmonta por dois segundos e depois volta, do jeito que rosto de gente adulta faz.',
    '"Desculpa."',
    '"Não precisa."',
    '"Precisa sim", ela diz, e sorri. "Você tem quinze anos e tá tomando café com uma velha chorando. Isso não é coisa de férias."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Sentou pra tomar café com uma desconhecida de luto'},
      hp:3, npc:{nome:'Senhora do Growlithe', opiniao:4, memoria:'Tomou café com você na copa da pousada na manhã seguinte ao enterro.'},
      flag:'cafe_com_a_senhora',
      presagio:'Catorze anos é muito. Faz a conta com os seus, e depois tenta esquecer que fez.'},
  escolhas:[
    {texto:'"Como era o nome dele?"', vai:'c7_nome_do_growlithe'},
    {texto:'"A senhora vai subir de novo hoje?"', vai:'c7_subir_de_novo'},
    {texto:'Ficar em silêncio com ela.', vai:'c7_silencio_copa'},
    {texto:'Se despedir e ir pra torre.', vai:'c7_base'}
  ]
},

c7_nome_do_growlithe:{
  texto:[
    '"Como era o nome dele?"',
    'Ela levanta a cabeça rápido.',
    '"Ninguém pergunta isso."',
    'Ela diz o nome. É um nome bobo, de bicho de estimação, do tipo que se dá quando se tem vinte e poucos anos e nenhuma ideia de que vai durar catorze.',
    'Depois ela conta a história do nome, que leva sete minutos, e é uma história sem graça nenhuma sobre uma vizinha e um programa de televisão.',
    'Ela ri no meio. Ri de verdade.',
    'Quando acaba, ela segura a sua mão em cima da mesa por dois segundos e solta.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Perguntou o nome'},
      npc:{nome:'Senhora do Growlithe', opiniao:7, memoria:'Você perguntou o nome do Growlithe dela. Ninguém pergunta isso.'},
      moral:10, hp:3,
      presagio:'Ninguém pergunta o nome. Lembra disso quando for a sua vez de ouvir.'},
  escolhas:[
    {texto:'"A senhora vai subir de novo hoje?"', vai:'c7_subir_de_novo'},
    {texto:'Ficar mais um pouco.', vai:'c7_silencio_copa'},
    {texto:'Se despedir e ir pra torre.', vai:'c7_base'}
  ]
},

c7_subir_de_novo:{
  texto:[
    '"A senhora vai subir de novo hoje?"',
    '"Vou. Pra escrever no mural."',
    '"Não escreveu ontem?"',
    '"Ontem eu não consegui segurar o giz." Ela fala isso simplesmente. "A mão tremia. Aí eu falei que voltava hoje."',
    'Ela olha pra janela.',
    '"Só que hoje eu não sei se eu consigo entrar de novo."'
  ],
  escolhas:[
    {texto:'"Eu vou com a senhora."', vai:'c7_foi_com_ela',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Acompanhou alguém que não conseguia entrar sozinha'}, flag:'acompanhou_a_senhora'}},
    {texto:'"Eu escrevo pra senhora."', vai:'c7_escreveu_por_ela'},
    {texto:'"A senhora consegue."', vai:'c7_base'},
    {texto:'Se despedir e ir pra torre sozinho.', vai:'c7_base'}
  ]
},

c7_foi_com_ela:{
  texto:[
    'Vocês dois andam da pousada até a base da torre. São quatrocentos metros e levam onze minutos porque ela anda devagar.',
    'Na porta ela para.',
    'Fica parada uns quarenta segundos. Você não fala nada, não empurra, não segura o braço dela.',
    'Aí ela entra.',
    'Ela escreve no mural com uma letra grande e firme e não treme nenhuma vez, e quando acaba fica olhando o próprio nome escrito ali por muito tempo.',
    'Depois vira pra você.',
    '"Pronto." Ela devolve o giz na caixinha. "Agora você faz o que veio fazer."'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Andou onze minutos devagar do lado de quem precisava'},
      npc:{nome:'Senhora do Growlithe', opiniao:9, memoria:'Você a acompanhou até o mural da torre quando ela não conseguia entrar sozinha.'},
      flag:'entrou_com_a_senhora', moral:10,
      registrar:'Acompanhou a senhora do Growlithe até o mural.',
      presagio:'Você não empurrou, não segurou o braço, não falou nada. Guarda essa técnica.'},
  escolhas:[
    {texto:'Ir até o mural você também.', vai:'c7_mural', cond:d=>d.cemiterio.length>0},
    {texto:'Procurar quem cuida daqui.', vai:'c7_zelador'},
    {texto:'Entrar na torre.', vai:'c7_torre'},
    {texto:'Ler os nomes do mural.', vai:'c7_leu_o_mural'}
  ]
},

c7_escreveu_por_ela:{
  texto:[
    '"Eu escrevo pra senhora."',
    'Ela pensa nisso seriamente, o que já é doloroso.',
    '"Não."',
    'Ela mexe o café.',
    '"Obrigada. De verdade. Mas não." Ela sorri. "Se outra pessoa escrever, não conta."',
    '"Conta pra quem?"',
    '"Pra mim." Ela dá de ombros. "Só tem eu."'
  ],
  ef:{flag:'so_tem_eu',
      presagio:'"Conta pra quem?" "Pra mim. Só tem eu." Quase tudo o que importa funciona assim.'},
  escolhas:[
    {texto:'"Então eu vou junto."', vai:'c7_foi_com_ela',
     ef:{rep:{eixo:'bom',delta:2,motivo:'Acompanhou em vez de substituir'}, flag:'acompanhou_a_senhora'}},
    {texto:'Se despedir e ir pra torre.', vai:'c7_base'}
  ]
},

c7_silencio_copa:{
  texto:[
    'Vocês dois ficam na copa da pousada tomando café sem falar nada por vinte minutos.',
    'O dono passa duas vezes e não interrompe.',
    'Em algum momento entra outro hóspede, um homem de uns cinquenta, e ele olha vocês dois e entende tudo na hora e senta na outra mesa e não fala nada também.',
    'Três pessoas em silêncio numa copa de pousada às seis e meia da manhã.',
    'É a coisa mais parecida com um ritual que essa cidade tem, e ninguém organizou.'
  ],
  ef:{hp:4, moral:5},
  escolhas:[
    {texto:'"Como era o nome dele?"', vai:'c7_nome_do_growlithe'},
    {texto:'"A senhora vai subir hoje?"', vai:'c7_subir_de_novo'},
    {texto:'Se despedir e ir pra torre.', vai:'c7_base'}
  ]
},

/* ─────────────── A BASE ─────────────── */

c7_base:{
  texto:[
    'A base da torre é um saguão com pé-direito alto e nenhuma decoração.',
    'Na parede da esquerda, um mural. Uma parede inteira, de uns doze metros, pintada de preto fosco, com nomes escritos a giz.',
    'Muitos nomes. Em camadas — dá pra ver os antigos apagados por baixo dos novos, e por baixo desses outros mais antigos ainda.',
    'Alguns têm duas datas na mesma linha: a de um Pokémon e a de um treinador.',
    'Tem uma caixinha de madeira pregada na parede com giz branco dentro. Ninguém vigia a caixinha.',
    d=>d.cemiterio.length
      ? `Você encontra espaço em branco. ${d.cemiterio.map(p=>nomeExib(p)).join(', ')} não está escrito em lugar nenhum de Kanto.`
      : 'Você não tem nenhum nome pra escrever aí. Ainda.'
  ],
  ef:{registrar:'Chegou à base da Torre Pokémon de Lavender.'},
  escolhas:[
    {texto:'Escrever no mural.', vai:'c7_mural', cond:d=>d.cemiterio.length>0,
     ef:{rep:{eixo:'bom',delta:2,motivo:'Honrou os próprios mortos'}, flag:'escreveu_mural', moral:10}},
    {texto:'Ler os nomes.', vai:'c7_leu_o_mural'},
    {texto:'Procurar quem cuida daqui.', vai:'c7_zelador'},
    {texto:'Entrar na torre.', vai:'c7_torre'}
  ]
},

c7_leu_o_mural:{
  texto:[
    'Você lê. Não dá pra ler tudo — são milhares —, mas você lê uma faixa na altura dos olhos, uns três metros.',
    'A maioria é só um nome. Alguns têm uma palavra junto: "meu amigo". "13 anos". "obrigado".',
    'Um deles tem uma frase inteira, escrita miúdo pra caber: "ele não gostava de água e entrou mesmo assim".',
    'E tem um canto, embaixo, perto do chão, onde alguém escreveu uma lista de onze nomes, todos com a mesma letra, todos com a mesma data.',
    'Onze nomes, uma data.',
    'Você fica olhando esse canto por um tempo longo.'
  ],
  ef:{flag:'os_onze_nomes',
      presagio:'Onze nomes e uma data só. Alguém escreveu isso ajoelhado no chão, e você vai descobrir o que foi.'},
  escolhas:[
    {texto:'Perguntar ao zelador sobre os onze nomes.', vai:'c7_zelador'},
    {texto:'Escrever no mural.', vai:'c7_mural', cond:d=>d.cemiterio.length>0,
     ef:{rep:{eixo:'bom',delta:2,motivo:'Honrou os próprios mortos'}, flag:'escreveu_mural', moral:10}},
    {texto:'Entrar na torre.', vai:'c7_torre'},
    {texto:'Deixar a flor embaixo do canto dos onze nomes.', vai:'c7_deixou_flor', cond:d=>!!d.flags.tem_a_flor}
  ]
},

c7_deixou_flor:{
  texto:[
    'Você põe o maço de flor amarela no chão, embaixo do canto onde estão os onze nomes.',
    'Não tem vaso, não tem nada. É só uma flor no chão de concreto encostada numa parede preta.',
    'Você fica ali agachado por uns segundos e depois levanta e não olha pra trás.',
    'Duas horas depois, quando você descer, a flor ainda vai estar lá e vai ter mais duas do lado.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Deixou flor para mortos de quem não sabia o nome'},
      flag:'deixou_a_flor', limpaFlag:'tem_a_flor', moral:8,
      presagio:'Vai ter mais duas do lado. As pessoas seguem quem começa.'},
  escolhas:[
    {texto:'Procurar o zelador.', vai:'c7_zelador'},
    {texto:'Entrar na torre.', vai:'c7_torre'}
  ]
},

c7_mural:{
  texto:[
    'O giz range.',
    'Você escreve devagar, com a letra melhor que consegue, o que é pior do que se escrevesse rápido.',
    'Uma senhora de luto, dois metros à sua direita, espera você terminar. Quando você abaixa a mão ela diz:',
    '"O primeiro é o pior. Depois você aprende a escrever mais rápido."',
    'Ela não está sendo cruel. Ela está sendo verdadeira, o que é diferente e muito pior.',
    'Ela devolve o giz na caixinha por você, porque você não está conseguindo soltar.'
  ],
  ef:{presagio:'"Depois você aprende a escrever mais rápido." Essa é a ameaça real dessa cidade.'},
  escolhas:[
    {texto:'"E a senhora escreveu quantos?"', vai:'c7_quantos_ela'},
    {texto:'Ler o resto dos nomes.', vai:'c7_leu_o_mural'},
    {texto:'Procurar o zelador.', vai:'c7_zelador'},
    {texto:'Entrar na torre.', vai:'c7_torre'}
  ]
},

c7_quantos_ela:{
  texto:[
    '"E a senhora escreveu quantos?"',
    'Ela olha o mural, procurando, e aponta com o queixo em três lugares diferentes.',
    '"Três."',
    '"Sinto muito."',
    '"Não sinta. Foi em quarenta anos." Ela ajeita o casaco. "Três em quarenta anos é uma vida boa, moço. Muito boa."',
    'Ela olha pra você.',
    '"Você tem quantos? De bicho, digo."',
    d=>`"${d.time.length}."`,
    '"Então você tem muito giz pela frente."'
  ],
  ef:{flag:'muito_giz_pela_frente',
      presagio:'Muito giz pela frente. Ela falou isso sem maldade nenhuma e é a coisa mais dura que te disseram hoje.'},
  escolhas:[
    {texto:'Procurar o zelador.', vai:'c7_zelador'},
    {texto:'Entrar na torre.', vai:'c7_torre'},
    {texto:'Ler o resto dos nomes.', vai:'c7_leu_o_mural'}
  ]
},

c7_zelador:{
  texto:[
    'O zelador da torre é um homem magro de uns sessenta anos com as mãos manchadas de incenso e um molho de chaves que ele não usa, porque a torre não tranca.',
    'Ele está repondo vela numa nicho do primeiro andar quando você chega.',
    '"Você é treinador." Ele olha o seu cinto sem interromper o que está fazendo. "Sobe se quiser. Aqui não proíbe ninguém."',
    'Ele acende o pavio novo com o toco do velho.',
    '"Mas escuta uma coisa antes."'
  ],
  ef:{npc:{nome:'Zelador da Torre', opiniao:1, memoria:'O zelador da Torre Pokémon de Lavender.'}},
  escolhas:[
    {texto:'Escutar.', vai:'c7_aviso'},
    {texto:'"Não precisa. Eu já sei."', vai:'c7_ja_sei'},
    {texto:'"Quem escreveu os onze nomes lá embaixo?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes},
    {texto:'"Como o senhor foi parar aqui?"', vai:'c7_historia_zelador'}
  ]
},

c7_aviso:{
  texto:[
    '"Do quarto andar pra cima, os Gastly te mostram coisa."',
    'Ele apaga o toco velho entre dois dedos molhados.',
    '"Eles não inventam. Isso é o que as pessoas não entendem. Eles não inventam nada — eles pegam o que já tá em você e põem na sua frente."',
    'Ele guarda o toco no bolso do avental, porque ele guarda os tocos.',
    '"Se você não tem nada podre, não tem o que ver. Você sobe, é frio, tem barulho, você desce."',
    'Ele te olha com um interesse desconfortável.',
    '"Você tem alguma coisa podre?"'
  ],
  ef:{flag:'aviso_zelador'},
  escolhas:[
    {texto:'"Não."', vai:'c7_negou', ef:{flag:'negou_podre'}},
    {texto:'"Tenho."', vai:'c7_admitiu',
     ef:{flag:'admitiu_podre', rep:{eixo:'bom',delta:2,motivo:'Foi honesto sobre si mesmo sem precisar'}}},
    {texto:'"Todo mundo tem."', vai:'c7_todo_mundo_tem'},
    {texto:'Não responder.', vai:'c7_nao_respondeu'}
  ]
},

c7_negou:{
  texto:[
    '"Não."',
    'O zelador não discute. Faz que sim com a cabeça e volta pras velas.',
    '"Então vai ser tranquilo."',
    'Ele fala isso de um jeito que não é sarcasmo e não é acusação, e que por isso mesmo fica pendurado no ar por muito mais tempo do que devia.',
    'Ele repõe mais duas velas.',
    '"Ninguém nunca respondeu sim, sabia? Em vinte e três anos, ninguém."'
  ],
  ef:{presagio:'Em vinte e três anos, ninguém respondeu sim. O quarto andar é o único lugar onde a resposta aparece.'},
  escolhas:[
    {texto:'Voltar atrás. "Talvez eu tenha."', vai:'c7_admitiu',
     ef:{limpaFlag:'negou_podre', flag:'admitiu_podre', rep:{eixo:'bom',delta:1,motivo:'Voltou atrás de uma mentira pequena'}}},
    {texto:'"Quem escreveu os onze nomes?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"Como o senhor foi parar aqui?"', vai:'c7_historia_zelador'}
  ]
},

c7_admitiu:{
  texto:[
    '"Tenho."',
    'O zelador para de mexer nas velas.',
    'Ele vira e olha pra você de um jeito completamente diferente, como quem reavalia uma pessoa inteira.',
    '"Então sobe devagar." Ele fala baixo. "E quando você vir, você não corre. Fica e olha até acabar."',
    '"Por quê?"',
    '"Porque eles mostram uma vez." Ele volta pras velas. "Quem corre tem que subir de novo depois. E depois é sempre pior."'
  ],
  ef:{flag:'conselho_de_ficar',
      npc:{nome:'Zelador da Torre', opiniao:4, memoria:'Você admitiu ter uma coisa podre. Ninguém tinha admitido em vinte e três anos.'},
      presagio:'Fica e olha até acabar. Você vai querer correr.'},
  escolhas:[
    {texto:'"Quem escreveu os onze nomes?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes},
    {texto:'"O senhor já subiu?"', vai:'c7_ele_subiu'},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"Como o senhor foi parar aqui?"', vai:'c7_historia_zelador'}
  ]
},

c7_todo_mundo_tem:{
  texto:[
    '"Todo mundo tem."',
    'O zelador ri. É uma risada curta e real, a primeira coisa espontânea dessa cidade inteira.',
    '"Essa é a melhor resposta que eu já ouvi."',
    'Ele acende mais uma vela.',
    '"E é errada." Ele sopra o fósforo. "Todo mundo tem alguma coisa. Nem todo mundo tem coisa podre. Podre é específico: é coisa que você não conta e não conserta."',
    'Ele olha pra você de lado.',
    '"Coisa que você conta pra alguém não apodrece. Coisa que você conserta também não. Só apodrece o que fica guardado sem conserto."'
  ],
  ef:{flag:'definicao_de_podre',
      presagio:'Coisa que você conta não apodrece. Tem alguém em Kanto pra quem você ainda pode contar.'},
  escolhas:[
    {texto:'"Tenho, então."', vai:'c7_admitiu',
     ef:{flag:'admitiu_podre', rep:{eixo:'bom',delta:2,motivo:'Foi honesto sobre si mesmo'}}},
    {texto:'"Quem escreveu os onze nomes?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"O senhor já subiu?"', vai:'c7_ele_subiu'}
  ]
},

c7_nao_respondeu:{
  texto:[
    'Você não responde.',
    'O zelador espera. Espera tempo demais — uns oito segundos — e o silêncio fica insuportável antes de ele desistir.',
    '"Certo."',
    'Ele volta pras velas.',
    '"Sobe devagar."'
  ],
  ef:{flag:'nao_respondeu_ao_zelador'},
  escolhas:[
    {texto:'"Quem escreveu os onze nomes?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes},
    {texto:'"O senhor já subiu?"', vai:'c7_ele_subiu'},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"Como o senhor foi parar aqui?"', vai:'c7_historia_zelador'}
  ]
},

c7_ja_sei:{
  texto:[
    '"Não precisa. Eu já sei."',
    '"Sabe o quê?"',
    '"Que eles mostram coisa."',
    'O zelador faz que sim.',
    '"Todo mundo sabe que eles mostram coisa. Isso não é o aviso."',
    'Ele acende a vela.',
    '"O aviso é: fica e olha até acabar. Não corre. Eles mostram uma vez só, e quem corre tem que subir de novo, e de novo é sempre pior."'
  ],
  ef:{flag:'conselho_de_ficar'},
  escolhas:[
    {texto:'"O senhor já subiu?"', vai:'c7_ele_subiu'},
    {texto:'"Quem escreveu os onze nomes?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"Como o senhor foi parar aqui?"', vai:'c7_historia_zelador'}
  ]
},

c7_ele_subiu:{
  texto:[
    '"O senhor já subiu?"',
    '"Todo dia."',
    'Ele diz isso sem nenhum peso.',
    '"Eu reponho vela do primeiro ao sétimo. Todo dia, de manhã. Faz vinte e três anos."',
    '"E eles mostram coisa pro senhor?"',
    '"Mostravam."',
    'Ele apaga o fósforo.',
    '"Nos primeiros dois anos, todo dia. A mesma coisa, todo dia, no quarto andar."',
    '"E agora?"',
    '"Agora não mostram mais nada." Ele guarda a caixa de fósforo no avental. "Eu subo o prédio inteiro e é só escada."'
  ],
  ef:{flag:'o_zelador_subiu'},
  escolhas:[
    {texto:'"Por que pararam?"', vai:'c7_porque_pararam'},
    {texto:'"O que eles mostravam?"', vai:'c7_o_que_mostravam'},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"Quem escreveu os onze nomes?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes}
  ]
},

c7_porque_pararam:{
  texto:[
    '"Por que pararam?"',
    'O zelador demora.',
    '"Duas explicação." Ele levanta um dedo. "Uma: eu resolvi o que tinha pra resolver."',
    'Ele levanta o segundo dedo.',
    '"Duas: eu olhei aquilo todo dia por dois anos e agora não me faz mais nada."',
    'Ele abaixa a mão.',
    '"E eu não sei qual das duas é, moço. Faz vinte e um anos que eu não sei qual das duas é."'
  ],
  ef:{flag:'as_duas_explicacoes',
      presagio:'Resolver e acostumar produzem exatamente o mesmo silêncio. Você não vai conseguir distinguir os dois de dentro.'},
  escolhas:[
    {texto:'"O que eles mostravam?"', vai:'c7_o_que_mostravam'},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"Quem escreveu os onze nomes?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes}
  ]
},

c7_o_que_mostravam:{
  texto:[
    '"O que eles mostravam?"',
    'O zelador olha pra escada do segundo andar por um tempo.',
    '"Uma porta fechada."',
    'Ele não elabora. Você espera. Ele continua repondo vela.',
    'Depois de quase um minuto:',
    '"Era a porta do quarto do meu irmão. Eu tinha dezenove anos e eu não abri aquela porta quando eu devia ter aberto."',
    'Ele acende.',
    '"Só isso. Uma porta. No corredor da torre, fechada, igualzinha."',
    'Ele sopra o fósforo.',
    '"Eu nunca abri ela lá também."'
  ],
  ef:{flag:'a_porta_do_zelador',
      npc:{nome:'Zelador da Torre', opiniao:5, memoria:'Te contou o que os Gastly mostravam pra ele: a porta fechada do quarto do irmão.'},
      presagio:'Ele nunca abriu a porta lá também. Vinte e três anos subindo e nunca abriu.'},
  escolhas:[
    {texto:'"Por que o senhor nunca abriu?"', vai:'c7_porque_nunca_abriu'},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"Quem escreveu os onze nomes?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes},
    {texto:'Não dizer nada.', vai:'c7_torre'}
  ]
},

c7_porque_nunca_abriu:{
  texto:[
    '"Por que o senhor nunca abriu? Lá em cima, digo."',
    'Ele fica quieto tanto tempo que você acha que ele não vai responder.',
    '"Porque não é ele."',
    'Ele guarda o toco no avental.',
    '"Eu sei que não é ele. Eu sei que é um Gastly fazendo o formato de uma porta." Ele bate no próprio peito. "Eu sei aqui."',
    'Ele dá um sorriso péssimo.',
    '"Mas se eu abrir e não tiver nada, aí eu perco a porta também."'
  ],
  ef:{flag:'se_eu_abrir_perco_a_porta', moral:5,
      presagio:'"Se eu abrir e não tiver nada, aí eu perco a porta também." Você vai entender isso lá em cima.'},
  escolhas:[
    {texto:'"Eu abro pro senhor."', vai:'c7_abre_por_ele',
     ef:{flag:'prometeu_abrir_a_porta'}},
    {texto:'Subir sem prometer nada.', vai:'c7_torre'},
    {texto:'"Quem escreveu os onze nomes?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes}
  ]
},

c7_abre_por_ele:{
  texto:[
    '"Eu abro pro senhor."',
    'Ele te olha com um susto de verdade.',
    '"Você não vai ver a minha porta, moço. Você vai ver a sua."',
    '"Mas se eu vir a sua—"',
    '"Você não vai ver." Ele é categórico. "Vinte e três anos. Nunca duas pessoas viram a mesma coisa."',
    'Ele volta pras velas e, mais baixo, quase não pra você:',
    '"Mas obrigado por oferecer. Ninguém nunca ofereceu."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Ofereceu carregar o que não era seu'},
      npc:{nome:'Zelador da Torre', opiniao:4, memoria:'Você se ofereceu pra abrir a porta dele. Ninguém nunca ofereceu.'},
      flag:'ofereceu_abrir'},
  escolhas:[
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"Quem escreveu os onze nomes?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes}
  ]
},

c7_historia_zelador:{
  texto:[
    '"Como o senhor foi parar aqui?"',
    '"Vaga."',
    'Ele ri da própria resposta.',
    '"Sério. Abriu vaga de zelador, eu precisava de emprego, eu peguei. Não tem história bonita."',
    'Ele repõe mais uma vela.',
    '"Todo mundo acha que tem história. Vem gente de Celadon me entrevistar de vez em quando, achando que eu sou místico." Ele faz uma careta. "Eu reponho vela e varro escada. Faz vinte e três anos que eu reponho vela e varro escada."',
    'Ele para.',
    '"O místico é o prédio. Eu sou o que varre."'
  ],
  ef:{npc:{nome:'Zelador da Torre', opiniao:2, memoria:'Insiste que não tem história: pegou a vaga e repõe vela há vinte e três anos.'}},
  escolhas:[
    {texto:'"O senhor já subiu?"', vai:'c7_ele_subiu'},
    {texto:'"Quem escreveu os onze nomes?"', vai:'c7_os_onze', cond:d=>!!d.flags.os_onze_nomes},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'Escutar o aviso dele antes.', vai:'c7_aviso'}
  ]
},

c7_os_onze:{
  texto:[
    '"Quem escreveu os onze nomes? Lá embaixo, no canto, perto do chão."',
    'O zelador para de mexer nas velas de vez.',
    '"Ah."',
    'Ele senta num banco de concreto do primeiro andar, o que ele claramente não faz com frequência.',
    '"Foi ano retrasado. Uma moça. Vinte e poucos anos, de Fuchsia."',
    '"Onze?"',
    '"Onze." Ele esfrega o joelho. "Era criadora. Ela tinha onze e perderam todos de uma vez."',
    '"Perderam como? Doença?"',
    'Ele balança a cabeça devagar.',
    '"Recolhimento."'
  ],
  ef:{flag:'sabe_dos_onze', registrar:'Os onze nomes do mural: uma criadora de Fuchsia perdeu todos os Pokémon num "recolhimento".',
      presagio:'Recolhimento. A palavra do Art. 11. Ela chegou até esse mural.'},
  escolhas:[
    {texto:'"O que é recolhimento?"', vai:'c7_o_que_e_recolhimento'},
    {texto:'"Eles morreram?"', vai:'c7_morreram'},
    {texto:'"Qual era o nome dela?"', vai:'c7_nome_dela'},
    {texto:'Subir.', vai:'c7_torre'}
  ]
},

c7_o_que_e_recolhimento:{
  texto:[
    '"O que é recolhimento?"',
    '"Foi a palavra que ela usou." O zelador dá de ombros. "Ela chegou aqui com um papel na mão e escreveu os onze nomes ajoelhada no chão."',
    '"Ela mostrou o papel?"',
    '"Mostrou. Eu não entendi nada. Era papel de gente que estudou." Ele coça a cabeça. "Tinha um desenho no alto. Uma balança."',
    d=>d.flags.papel_com_brasao || d.flags.leu_o_estatuto
      ? 'Você para de respirar por um segundo e ele repara.'
      : 'Você não faz ideia do que isso quer dizer, mas alguma coisa em você registra.'
  ],
  ef:{flag:'a_balanca_no_mural',
      presagio:'A balança chegou até aqui, num mural de giz, numa cidade sem música.'},
  escolhas:[
    {texto:'"Eles morreram?"', vai:'c7_morreram'},
    {texto:'"Qual era o nome dela?"', vai:'c7_nome_dela'},
    {texto:'Mostrar o que você tem.', vai:'c7_mostrou_ao_zelador', cond:d=>!!d.flags.papel_com_brasao || !!d.flags.leu_o_estatuto},
    {texto:'Subir.', vai:'c7_torre'}
  ]
},

c7_morreram:{
  texto:[
    '"Eles morreram?"',
    'O zelador fica em silêncio por um tempo horrível.',
    '"Ela não sabia."',
    'Ele olha pra escada.',
    '"É por isso que ela escreveu no mural, entende? Ela me perguntou se podia escrever nome de bicho que ela não sabia se tinha morrido."',
    '"E o senhor deixou?"',
    '"Eu deixei." Ele levanta do banco com dificuldade. "Eu não sou dono do giz."',
    'Ele volta pras velas.',
    '"Ela ficou três horas nesse saguão depois de escrever. Sentada no chão, olhando a parede. Eu levei água duas vezes."'
  ],
  ef:{flag:'ela_nao_sabia',
      presagio:'Ela escreveu nomes de quem talvez estivesse vivo. Esse é o formato exato do que a Comissão faz.'},
  escolhas:[
    {texto:'"Qual era o nome dela?"', vai:'c7_nome_dela'},
    {texto:'Mostrar o que você tem.', vai:'c7_mostrou_ao_zelador', cond:d=>!!d.flags.papel_com_brasao || !!d.flags.leu_o_estatuto},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"O que é recolhimento?"', vai:'c7_o_que_e_recolhimento'}
  ]
},

c7_nome_dela:{
  texto:[
    '"Qual era o nome dela?"',
    '"Eu não perguntei."',
    'Ele diz isso com uma vergonha que atravessa dois anos.',
    '"Eu levei água duas vezes e eu não perguntei o nome dela."',
    'Ele repõe uma vela que não precisava ser reposta.',
    '"Mas ela falou de um sítio. Do irmão dela, ou do pai, eu não lembro." Ele franze a testa. "Em Fuchsia. Na estrada da reserva."',
    d=>d.flags.sabe_do_ulisses
      ? 'Portão azul. Do lado esquerdo da estrada da Zona Safári. Você tem o endereço no verso de um panfleto de horário de piscina.'
      : 'Você guarda: Fuchsia, estrada da reserva, um sítio.'
  ],
  ef:{flag:'ligou_os_onze_a_fuchsia', registrar:'A moça dos onze nomes é de um sítio na estrada da reserva, em Fuchsia.',
      presagio:'Fuchsia. O portão azul. Duas pessoas diferentes te mandaram pro mesmo lugar sem saber.'},
  escolhas:[
    {texto:'Mostrar o que você tem pro zelador.', vai:'c7_mostrou_ao_zelador', cond:d=>!!d.flags.papel_com_brasao || !!d.flags.leu_o_estatuto},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"Eles morreram?"', vai:'c7_morreram'}
  ]
},

c7_mostrou_ao_zelador:{
  texto:[
    'Você mostra o que tem: a folha, ou a pasta, ou o documento grampeado com capa dura.',
    'O zelador não pega. Põe as mãos pra trás, como quem não quer encostar.',
    '"É esse desenho."',
    'Ele olha por muito tempo sem tocar.',
    '"Guarda."',
    '"O senhor não quer—"',
    '"Guarda." Ele é firme. "Eu varro escada, moço. Eu não sirvo pra isso."',
    'Ele volta pras velas, e as mãos dele estão tremendo um pouco, e ele repõe três velas seguidas que não precisavam.',
    'Depois, sem virar:',
    '"Se você achar ela, fala o nome dos onze em voz alta. Ela vai querer ouvir de alguém."'
  ],
  ef:{flag:'a_missao_dos_onze',
      npc:{nome:'Zelador da Torre', opiniao:6, memoria:'Reconheceu o brasão da balança. Te pediu pra falar os onze nomes em voz alta se você a encontrar.'},
      rep:{eixo:'bom',delta:1,motivo:'Carregou um pedido que ninguém podia cobrar'},
      registrar:'O zelador pediu: se encontrar a moça dos onze nomes, dizer os onze em voz alta.',
      presagio:'Onze nomes numa parede preta. Agora você tem que decorar.'},
  escolhas:[
    {texto:'Descer e copiar os onze nomes no seu caderno.', vai:'c7_copiou_os_onze'},
    {texto:'Subir.', vai:'c7_torre'},
    {texto:'"Eu não sei se eu vou achar ela."', vai:'c7_nao_sei_achar'}
  ]
},

c7_copiou_os_onze:{
  texto:[
    'Você desce e copia os onze nomes no seu caderno, ajoelhado no chão do saguão, do mesmo jeito que ela escreveu.',
    'Leva vinte minutos porque a letra dela é apertada e alguns nomes estão borrados de dois anos de gente encostando.',
    'Onze nomes. Você lê em voz baixa uma vez pra conferir e não consegue ler os dois últimos sem parar.',
    'Quando você levanta, o zelador está parado na porta do saguão, olhando, e ele não diz nada e você não diz nada.'
  ],
  ef:{flag:'copiou_os_onze_nomes',
      rep:{eixo:'bom',delta:2,motivo:'Copiou onze nomes de um mural de giz ajoelhado no chão'},
      registrar:'Copiou os onze nomes do mural no caderno.',
      presagio:'Tem onze nomes no seu caderno agora. Um dia alguém vai pedir pra ouvir.'},
  escolhas:[
    {texto:'Subir a torre.', vai:'c7_torre'},
    {texto:'Deixar a flor embaixo do canto.', vai:'c7_deixou_flor', cond:d=>!!d.flags.tem_a_flor}
  ]
},

c7_nao_sei_achar:{
  texto:[
    '"Eu não sei se eu vou achar ela."',
    '"Eu também não."',
    'Ele continua repondo velas.',
    '"Mas se eu não pedir pra ninguém, aí a chance é zero." Ele sopra o fósforo. "Eu já pedi pra sete pessoas em dois anos."',
    '"E?"',
    '"E você é a primeira que perguntou o nome dela."'
  ],
  ef:{flag:'setimo_pedido'},
  escolhas:[
    {texto:'Descer e copiar os onze nomes.', vai:'c7_copiou_os_onze'},
    {texto:'Subir.', vai:'c7_torre'}
  ]
},

/* ─────────────── A SUBIDA ─────────────── */

c7_torre:{
  texto:[
    'Os três primeiros andares são só andares.',
    'Lápides pequenas em fileira, no chão, cada uma com um nome e uma data. Velas nos nichos das paredes. Incenso — muito incenso, o ar é denso.',
    'Tem gente rezando baixo em dois lugares. Uma família inteira sentada no chão do segundo andar em volta de uma lápide nova, comendo alguma coisa que trouxeram de casa.',
    'Ninguém olha pra você. Aqui ninguém olha pra ninguém, e isso é gentileza.',
    'No quarto andar, a temperatura cai de verdade. Não é impressão: dá pra ver a sua respiração.',
    'E começam as vozes. Não palavras. Só o formato de uma voz conhecida, sem o conteúdo, como quando se ouve alguém falando através de uma parede.'
  ],
  ef:{registrar:'Subiu ao quarto andar da Torre Pokémon.'},
  escolhas:[
    {texto:'Subir.', vai:'c7_visao'},
    {texto:'Parar aqui e escutar as vozes.', vai:'c7_escutou'},
    {texto:'Descer. Chega.', vai:'c7_desceu_antes'},
    {texto:'Chamar em voz alta.', vai:'c7_chamou'}
  ]
},

c7_escutou:{
  texto:[
    'Você para no meio do corredor do quarto andar e escuta.',
    'Leva quase dois minutos até você conseguir identificar de quem é o formato da voz.',
    d=>{
      const n = Object.keys(d.npcs);
      if (d.cemiterio.length) return 'Não é voz de gente.';
      if (d.flags.ligou_pra_casa) return 'É a sua mãe. É exatamente o ritmo dela ao telefone, com aquela pausa antes de perguntar se você comeu.';
      if (n.includes('Ezra')) return 'É o Ezra. É o ritmo dele — as frases todas curtas e uma comprida no fim.';
      return 'É a sua mãe. Ou é o que você lembra do jeito dela falar, que não é a mesma coisa.';
    },
    'Não dá pra entender uma palavra. É só o formato.',
    'E o formato é suficiente pra você ficar dois minutos parado num corredor gelado com a respiração saindo branca.'
  ],
  ef:{flag:'escutou_as_vozes', moral:-5,
      presagio:'Só o formato. Você vai reconhecer esse formato de novo numa outra escada, muito pior.'},
  escolhas:[
    {texto:'Subir.', vai:'c7_visao'},
    {texto:'Descer.', vai:'c7_desceu_antes'},
    {texto:'Responder em voz alta.', vai:'c7_chamou'}
  ]
},

c7_chamou:{
  texto:[
    'Você fala em voz alta no corredor do quarto andar.',
    'Não uma frase — só um "ô", que é o que sai.',
    'As vozes param.',
    'Todas, ao mesmo tempo, imediatamente. O silêncio que vem depois é de uma qualidade que você não conhecia: não é ausência de som, é presença de atenção.',
    'Alguma coisa nesse andar acabou de perceber que você está aqui.',
    'E aí as vozes voltam, e agora tem uma a mais, e a que sobrou é a sua.'
  ],
  ef:{flag:'chamou_na_torre', hp:-2, causa:'O quarto andar da Torre',
      presagio:'Agora tem uma voz a mais no quarto andar e ela tem o seu formato.'},
  escolhas:[
    {texto:'Subir.', vai:'c7_visao'},
    {texto:'Descer correndo.', vai:'c7_desceu_antes'},
    {texto:'Ficar e escutar a sua própria voz.', vai:'c7_propria_voz'}
  ]
},

c7_propria_voz:{
  texto:[
    'Você fica.',
    'Escutar o formato da própria voz sem o conteúdo é a coisa mais desagradável que já te aconteceu, e você fica.',
    'Dura uns quarenta segundos.',
    'O que você aprende: você fala mais rápido do que achava. Você tem um tique de subir o tom no fim das frases. E você fala pouco.',
    'Depois para.',
    'Não some: para. Como quem decidiu que já mostrou o suficiente.'
  ],
  ef:{flag:'ouviu_a_propria_voz', moral:-8,
      rep:{eixo:'bom',delta:1,motivo:'Ficou e olhou até acabar, como pediram'},
      presagio:'Como quem decidiu que já mostrou o suficiente. Eles decidem. Isso devia assustar mais do que assusta.'},
  escolhas:[
    {texto:'Subir.', vai:'c7_visao'},
    {texto:'Descer.', vai:'c7_desceu_antes'}
  ]
},

c7_desceu_antes:{
  texto:[
    'Você desce.',
    'Os três primeiros andares na volta são mais curtos do que na ida, e no saguão a temperatura normal parece quente.',
    'O zelador está repondo vela e não pergunta nada.',
    'Você fica no saguão por uns minutos, com as mãos nos bolsos, sem saber o que fazer com o corpo.',
    'E aí, porque você não consegue não fazer, você vira e sobe de novo.'
  ],
  ef:{flag:'desceu_e_voltou',
      presagio:'Quem desce tem que subir de novo. E de novo é sempre pior. Ele avisou.'},
  escolhas:[
    {texto:'Subir de novo, até o fim.', vai:'c7_visao'},
    {texto:'Não. Ir embora de Lavender.', vai:'c7_fim'},
    {texto:'Falar com o zelador antes.', vai:'c7_zelador'}
  ]
},

c7_visao:{
  texto:[
    d=>{
      const f = d.flags;
      if (f.entregou_o_rapaz) return 'No quinto andar tem um formulário em cima de uma cadeira. Só isso: uma folha preenchida, com uma assinatura embaixo, numa cadeira de plástico no meio de um corredor de pedra. A assinatura não é sua. O nome que está preenchido no campo do meio, sim.';
      if (f.agrediu_envenenador) return 'No quinto andar tem uma tigela de ração no meio do chão. Só isso. E o som das suas próprias mãos, que você reconhece na hora, e que não devia dar pra reconhecer de fora.';
      if (f.usou_escudo) return 'No quinto andar tem um cinto de treinador estendido no chão, aberto, com cinco bolas e um espaço vazio. O espaço vazio é do tamanho certo.';
      if (f.ignorou_pikachu) return 'No quinto andar, no meio do corredor, tem uma estaca fincada no chão de pedra e um fio de aço amarrado nela. O fio se mexe sozinho, girando, girando, girando o mesmo círculo que você viu na terra da floresta.';
      if (f.trabalhou_rocket) return 'No quinto andar tem duas caixas plásticas azuis empilhadas, do tipo que você carregou. A de cima está aberta. Você sabe que não deve olhar dentro. Você olha dentro.';
      if (f.ignorou_marta) return 'No quinto andar tem uma mulher sentada de costas com alguma coisa no colo. Ela não vira. Você já sabe que ela não vai virar, e mesmo assim fica esperando, e o tempo passa errado.';
      if (f.deixou_os_ovos_irem) return 'No quinto andar tem uma caixa plástica aberta no chão, com palha dentro, e a palha está se mexendo. Você fica olhando a palha se mexer. Ela não para de se mexer o tempo todo em que você está lá.';
      if (f.vendeu_um_do_time) return 'No quinto andar tem uma caixa forrada de veludo azul no chão, com seis espumas, e cinco delas estão vazias. Na sexta tem uma bola, e a plaquinha de acrílico na frente dela tem a sua letra.';
      if (f.vendeu_para_cacadores) return 'No quinto andar alguém conta dinheiro. Nota por nota, devagar, olhando pra você o tempo todo. Você conhece as mãos. São as suas.';
      if (d.cemiterio.length) return `No quinto andar, ${nomeExib(d.cemiterio[0])} está esperando você no meio do corredor. Inteiro. Sem marca nenhuma. Ele não te ataca e não foge — só senta e espera, do jeito que esperava.`;
      if (f.saiu_sem_despedir) return 'No quinto andar tem uma cortina de cozinha se mexendo, sem janela em volta, sem vento nenhum.';
      if (f.recusou_ivone) return 'No quinto andar tem um cartão de cartolina cortado à mão caído no chão, com um número escrito a caneta. Você não pega. Ele continua ali quando você passa de volta.';
      return 'No quinto andar não tem nada. Você anda o corredor inteiro e não tem nada, e de alguma forma isso é o mais perturbador que podia acontecer.';
    },
    d=>d.flags.conselho_de_ficar
      ? 'O zelador disse pra ficar e olhar até acabar. Você fica.'
      : 'Todo instinto que você tem diz pra sair desse corredor.',
    'Alguma coisa respira atrás de você.'
  ],
  ef:{registrar:'A Torre mostrou o que você trouxe.'},
  batalha:{dex:92, nivel:30, tipo:'selvagem', ambiente:'cemiterio', fuga:true,
           vitoria:'c7_pos_visao', derrota:'c7_pos_visao', fuga2:'c7_pos_visao', captura:'c7_pos_visao', gameover:'gameover'}
},

c7_pos_visao:{
  texto:[
    'Quando acaba, o corredor é só um corredor.',
    'A coisa que estava ali não está mais. Não foi embora — parou de estar, que é diferente e você não sabe explicar a diferença.',
    d=>d.flags.conselho_de_ficar && !d.flags.fugiu_da_visao
      ? 'Você ficou e olhou até acabar, como ele disse. Alguma coisa em você fica mais leve de um jeito que não faz sentido nenhum.'
      : 'Você não sabe se ficou tempo suficiente. Vai ficar com essa dúvida.',
    'O sexto andar começa na escada seguinte.',
    'E da escada seguinte vem um som que não é fantasma nenhum: é osso batendo em pedra, ritmado, três vezes, pausa, três vezes.'
  ],
  ef:{moral:5},
  escolhas:[
    {texto:'Subir.', vai:'c7_marowak'},
    {texto:'Subir devagar, sem fazer barulho.', vai:'c7_marowak', ef:{flag:'subiu_em_silencio'}},
    {texto:'Descer e chamar o zelador.', vai:'c7_chamou_zelador'},
    {texto:'Descer e ir embora.', vai:'c7_fim'}
  ]
},

c7_chamou_zelador:{
  texto:[
    'Você desce os cinco andares correndo e acha o zelador no saguão.',
    '"Tem alguma coisa no sexto."',
    'Ele larga a vela.',
    '"Osso batendo?"',
    '"É."',
    '"Faz quatro dias."' ,
    'Ele fala isso e o rosto dele fica com uma culpa muito antiga.',
    '"Eu não subo desde terça. Eu tenho sessenta e um anos, moço, e aquilo lá em cima não é Gastly."'
  ],
  ef:{flag:'zelador_sabe_do_sexto',
      presagio:'Quatro dias. Alguma coisa está batendo osso em pedra há quatro dias e a cidade toda ouve e ninguém sobe.'},
  escolhas:[
    {texto:'Subir de novo, sozinho.', vai:'c7_marowak'},
    {texto:'"Sobe comigo."', vai:'c7_subiu_com_zelador'},
    {texto:'"Ninguém chamou ninguém em quatro dias?"', vai:'c7_ninguem_chamou'},
    {texto:'Ir embora de Lavender.', vai:'c7_fim'}
  ]
},

c7_ninguem_chamou:{
  texto:[
    '"Ninguém chamou ninguém em quatro dias?"',
    '"Chamou."',
    'Ele senta no banco de concreto.',
    '"Eu liguei pra Liga na quarta. Eles anotaram." Ele esfrega o joelho. "Disseram que ia ser designado um oficial."',
    'Ele olha pra escada.',
    '"Isso foi quarta. Hoje é sábado."'
  ],
  ef:{flag:'a_liga_nao_veio',
      presagio:'Quarta. Hoje é sábado. Você já conhece esse ritmo.'},
  escolhas:[
    {texto:'Subir sozinho.', vai:'c7_marowak'},
    {texto:'"Sobe comigo."', vai:'c7_subiu_com_zelador'},
    {texto:'Ir embora.', vai:'c7_fim'}
  ]
},

c7_subiu_com_zelador:{
  texto:[
    '"Sobe comigo."',
    'Ele olha pra escada por uns bons dez segundos.',
    '"Tá."',
    'Ele leva quatorze minutos pra subir seis andares, parando duas vezes, com a mão no corrimão.',
    'No quinto andar ele não olha pros lados nenhuma vez. Anda o corredor inteiro olhando o próprio pé.',
    'No topo da escada do sexto, ele para e põe a mão no seu ombro.',
    '"Se der errado, você desce e me deixa." Ele fala sem drama. "Sério. Você tem quinze anos e eu tenho sessenta e um e isso é aritmética."'
  ],
  ef:{flag:'zelador_subiu_junto',
      npc:{nome:'Zelador da Torre', opiniao:6, memoria:'Subiu ao sexto andar com você depois de quatro dias sem subir.'},
      rep:{eixo:'bom',delta:2,motivo:'Não subiu sozinho quando não precisava'},
      presagio:'"Isso é aritmética." Ele já fez essa conta antes, sobre outra pessoa.'},
  escolhas:[
    {texto:'Subir.', vai:'c7_marowak'}
  ]
},

c7_marowak:{
  texto:[
    'No sexto andar, você para de subir sem decidir parar.',
    'Tem um Marowak no fim do corredor. Não é fantasma — é um Marowak, sólido, de pé, com o osso na mão e a respiração visível no ar frio.',
    'O nível dele está errado pra essa torre. Muito errado.',
    'Atrás dele, encolhido contra a parede, um Cubone. Pequeno. Uma das patas traseiras está dobrada de um jeito que pata não dobra. Ele está respirando rápido.',
    'O Marowak não é a mãe dele. A mãe dele está enterrada no terceiro andar — você passou pela lápide na subida, tem uma lápide nova no terceiro andar com data de cinco dias atrás.',
    'Esse Marowak é de outro treinador. E tem uma bola no chão, vazia, a cinco metros.',
    'O treinador está caído ao lado da bola. Vivo. Inconsciente. O Marowak não deixa ninguém chegar perto de nenhum dos dois.'
  ],
  ef:{registrar:'Encontrou o Marowak no sexto andar da Torre, com um Cubone ferido e um treinador inconsciente.'},
  escolhas:[
    {texto:'Batalhar. Derrubar o Marowak e tirar os dois de lá.', vai:'c7_luta_marowak'},
    {texto:'Tentar acalmar. Chegar devagar, sem bola na mão.', vai:'c7_acalmar'},
    {texto:'Usar um dos seus como escudo pra chegar até o treinador caído.', vai:'c7_escudo'},
    {texto:'Olhar a cena inteira antes de fazer qualquer coisa.', vai:'c7_olhou_a_cena'}
  ]
},

c7_olhou_a_cena:{
  texto:[
    'Você não faz nada por dois minutos. Só olha.',
    'E o que você vê muda tudo:',
    'O Marowak não está entre você e o treinador. Ele está entre o treinador e o Cubone.',
    'Ele não está protegendo o Cubone do treinador. Ele está impedindo o Cubone de chegar no treinador caído.',
    'E o Cubone tenta. A cada dez ou quinze segundos ele tenta arrastar a pata quebrada em direção ao corpo, e o Marowak o empurra de volta com o lado do osso, sem machucar.',
    'O treinador caído é quem o Cubone quer alcançar.',
    'E o Marowak sabe de alguma coisa sobre aquele corpo que o Cubone ainda não sabe.'
  ],
  ef:{flag:'entendeu_a_cena',
      rep:{eixo:'bom',delta:2,motivo:'Olhou antes de agir'},
      presagio:'O Marowak sabe de alguma coisa sobre aquele corpo. Ele está poupando o filhote.'},
  escolhas:[
    {texto:'Chegar devagar, sem bola na mão.', vai:'c7_acalmar', ef:{flag:'sabe_o_que_o_marowak_faz'}},
    {texto:'Ir direto no treinador caído.', vai:'c7_foi_no_treinador'},
    {texto:'Batalhar.', vai:'c7_luta_marowak'},
    {texto:'Descer e chamar ajuda. Leva quarenta minutos.', vai:'c7_ajuda'}
  ]
},

c7_foi_no_treinador:{
  texto:[
    'Você anda direto pro corpo caído, e o Marowak não te impede — ele se desloca de lado pra continuar entre o Cubone e você, mas não ataca.',
    'Você ajoelha ao lado do treinador.',
    'É um rapaz de uns vinte anos. Está respirando. Tem um galo grande na têmpora e uma cor de pele que você não sabe nomear mas que o seu corpo entende na hora.',
    'E tem um frasco de remédio aberto no chão, ao lado da mão dele, com comprimidos espalhados.',
    'Ele não apanhou do Marowak. Ele passou mal e caiu, e derrubou o frasco, e o Marowak ficou.',
    'Quatro dias de osso batendo em pedra, três vezes, pausa, três vezes.',
    'Não era ameaça. Era chamado.'
  ],
  ef:{flag:['era_chamado','sabe_o_que_o_marowak_faz'],
      registrar:'O Marowak batia osso há quatro dias chamando ajuda para o treinador dele.',
      presagio:'Quatro dias batendo. A cidade inteira ouvia e achava que era assombração.'},
  escolhas:[
    {texto:'Carregar o treinador pra baixo agora.', vai:'c7_carregou_o_treinador'},
    {texto:'Pegar o Cubone primeiro. Ele está pior.', vai:'c7_cubone_primeiro'},
    {texto:'Gritar pro zelador subir.', vai:'c7_gritou_zelador'},
    {texto:'Dar um dos seus itens de cura pro treinador.', vai:'c7_curou_o_treinador', cond:d=>Estado.contaItem('Bandagem')>0||Estado.contaItem('Full Heal')>0}
  ]
},

c7_curou_o_treinador:{
  texto:[
    'Você usa o que tem. Não é remédio de gente, mas é o que existe a seis andares de escada de qualquer coisa.',
    'Não acorda ele. Mas a respiração muda de ritmo — fica mais funda — e você vai ficar o resto da vida sem saber se foi o que você fez ou se teria acontecido de qualquer jeito.',
    'O Marowak dá um passo pra trás.',
    'Um passo. Depois de quatro dias, ele dá um passo pra trás.'
  ],
  ef:{executar:d=>{ if(Estado.contaItem('Full Heal')) Estado.usarItem('Full Heal'); else Estado.usarItem('Bandagem'); return []; },
      rep:{eixo:'bom',delta:2,motivo:'Usou o que tinha em quem precisava'},
      flag:'cuidou_do_treinador'},
  escolhas:[
    {texto:'Carregar o treinador pra baixo.', vai:'c7_carregou_o_treinador'},
    {texto:'Gritar pro zelador subir.', vai:'c7_gritou_zelador'},
    {texto:'Pegar o Cubone.', vai:'c7_cubone_primeiro'}
  ]
},

c7_gritou_zelador:{
  texto:[
    'Você grita da escada do sexto andar e a sua voz desce os seis andares e volta.',
    d=>d.flags.zelador_subiu_junto
      ? 'O zelador já está no topo da escada. Ele viu tudo. Ele desce pra chamar ambulância mais rápido do que um homem de sessenta e um anos devia descer escada.'
      : 'Leva sete minutos até o zelador chegar. Ele sobe seis andares em sete minutos aos sessenta e um anos, e chega sem conseguir falar.',
    'Ele olha a cena e entende em dois segundos o que você levou dois minutos pra entender.',
    '"Ah, meu Deus." Ele se ajoelha. "Ah, meu Deus, ele tava chamando."',
    'Ele desce de novo pra ligar. A ambulância de Lavender leva onze minutos porque a cidade é pequena e o hospital é o de Celadon, mas tem uma van.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Chamou ajuda em vez de resolver sozinho'},
      flag:'chamou_a_van', registrar:'A van de Lavender veio buscar o treinador do sexto andar.'},
  escolhas:[
    {texto:'Descer carregando o Cubone.', vai:'c7_cubone_primeiro'},
    {texto:'Ficar com o Marowak enquanto levam o treinador.', vai:'c7_ficou_com_marowak'},
    {texto:'Ajudar a carregar o treinador.', vai:'c7_carregou_o_treinador'}
  ]
},

c7_ficou_com_marowak:{
  texto:[
    'Levam o treinador numa maca improvisada. O Marowak acompanha com os olhos até a escada e não segue.',
    'Você fica.',
    'Senta no chão de pedra do sexto andar a uns três metros dele, e não fala nada, e não faz nada.',
    'Dez minutos. Quinze.',
    'Aí o Marowak senta também. Não deita: senta, com o osso atravessado no colo, do jeito que alguém pousa uma ferramenta.',
    'E o Cubone se arrasta até ele e encosta, e ele deixa.',
    'Vocês três ficam ali no escuro do sexto andar por quase uma hora sem nada acontecer, e é uma das coisas mais importantes que você faz nessa jornada inteira.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Sentou no chão e esperou uma hora sem fazer nada'},
      flag:['acalmou_marowak','ficou_com_marowak'], moral:15,
      npc:{nome:'Zelador da Torre', opiniao:5, memoria:'Você ficou uma hora sentado no chão do sexto andar com o Marowak. Ele conta isso pra todo mundo.'},
      registrar:'Ficou uma hora sentado com o Marowak e o Cubone depois que levaram o treinador.',
      presagio:'Você não fez nada por uma hora. Foi a coisa certa. Quase nunca é.'},
  escolhas:[
    {texto:'Levar o Cubone com você.', vai:'c7_cubone'},
    {texto:'Deixar os dois juntos e descer.', vai:'c7_fim',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Deixou os dois juntos'}}},
    {texto:'Perguntar ao Marowak, em voz alta, se ele quer descer.', vai:'c7_perguntou_ao_marowak'}
  ]
},

c7_perguntou_ao_marowak:{
  texto:[
    'Você pergunta em voz alta, num corredor vazio, pra um Pokémon que não fala:',
    '"Você quer descer?"',
    'É ridículo. Você tem consciência plena do ridículo enquanto fala.',
    'O Marowak levanta a cabeça.',
    'E depois levanta, e pega o Cubone com o braço livre — do jeito desajeitado de quem tem uma das mãos ocupada com um osso que não larga —, e anda até a escada.',
    'E espera você.',
    'Vocês descem seis andares juntos e ninguém no saguão diz uma palavra quando passam.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Perguntou em vez de decidir'},
      flag:['acalmou_marowak','marowak_desceu'], moral:15,
      registrar:'O Marowak desceu a torre por vontade própria, carregando o Cubone.',
      presagio:'Ele esperou você. Isso não é obediência. É outra coisa e ela não tem nome em português.'},
  escolhas:[
    {texto:'Levar o Cubone com você.', vai:'c7_cubone'},
    {texto:'Deixar os dois na base e seguir viagem.', vai:'c7_fim'},
    {texto:'Levar os dois até o hospital de Celadon.', vai:'c7_levou_os_dois'}
  ]
},

c7_levou_os_dois:{
  texto:[
    'Você paga a van de Lavender pra levar os três — você, o Marowak e o Cubone — até Celadon, o que custa quase tudo que você tem e leva cinco horas.',
    'O Cubone é operado. A pata vai ficar torta e vai funcionar.',
    'O treinador acorda no dia seguinte. Chama-se Hideo, tem vinte e dois anos, e a primeira coisa que ele pergunta é pelo Marowak.',
    'Você fala. Ele chora de um jeito que adulto nenhum devia chorar num corredor de hospital.',
    'Depois ele pergunta quantos dias foram.',
    'Você diz quatro.',
    'E ele fica calado por um tempo muito longo.'
  ],
  ef:{dinheiro:-2500, rep:{eixo:'bom',delta:4,motivo:'Pagou a van e levou os três até Celadon'},
      flag:['salvou_treinador_torre','conhece_o_hideo'],
      npc:{nome:'Hideo', opiniao:8, memoria:'Você o tirou do sexto andar da Torre de Lavender depois de quatro dias caído. Ele não esquece.'},
      registrar:'Levou o treinador, o Marowak e o Cubone até o hospital de Celadon.',
      presagio:'Hideo, vinte e dois anos. Você vai reencontrar ele, e não vai ser num hospital.'},
  escolhas:[
    {texto:'Seguir viagem.', vai:'c7_fim'},
    {texto:'Ficar até ele ter alta.', vai:'c7_ficou_ate_alta'}
  ]
},

c7_ficou_ate_alta:{
  texto:[
    'Você fica três dias em Celadon esperando a alta de um desconhecido.',
    'Dorme no Centro Pokémon. Visita todo dia. Traz café ruim de máquina.',
    'No terceiro dia ele conta: epilepsia. Diagnosticada aos dezessete. Ele não contou pra ninguém porque a Liga pede laudo médico pra licença e ele achou que iam recusar.',
    '"Eles não iam recusar", você diz, sem ter a menor ideia.',
    '"Eu sei que não." Ele olha o soro. "Mas eu achei. E aí eu subi seis andares sozinho numa torre."',
    'Ele passa a mão na cara.',
    '"Quatro dias, cara. Ele bateu osso por quatro dias."'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Ficou três dias esperando a alta de um desconhecido'},
      flag:'sabe_do_hideo', hp:-2, causa:'Três dias dormindo em Centro Pokémon',
      npc:{nome:'Hideo', opiniao:10, memoria:'Você ficou três dias em Celadon até ele ter alta. Ele te contou da epilepsia.'},
      presagio:'Ele escondeu um laudo por medo de uma exigência que talvez nem existisse. Isso vai acontecer com muita gente nessa história.'},
  escolhas:[
    {texto:'Seguir viagem.', vai:'c7_fim'}
  ]
},

c7_cubone_primeiro:{
  texto:[
    'Você vai no Cubone. O Marowak deixa — ele se desloca pra dar passagem, e essa é a primeira vez em quatro dias que ele deixa alguém chegar no filhote.',
    'A pata está quebrada em dois lugares e fria. Ele não reage quando você pega.',
    'Você improvisa uma tala com uma vela de nicho quebrada ao meio e a fita da sua mochila. É uma tala péssima. É melhor que nada.',
    'Enquanto você faz isso, o Marowak fica a um metro, olhando, com o osso abaixado pela primeira vez.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Cuidou do menor primeiro'},
      flag:'talou_o_cubone'},
  escolhas:[
    {texto:'Carregar o treinador agora.', vai:'c7_carregou_o_treinador'},
    {texto:'Gritar pro zelador subir.', vai:'c7_gritou_zelador'},
    {texto:'Ficar sentado com os dois.', vai:'c7_ficou_com_marowak'},
    {texto:'Levar o Cubone com você.', vai:'c7_cubone'}
  ]
},

c7_carregou_o_treinador:{
  texto:[
    'Você carrega o treinador escada abaixo. Seis andares.',
    'Ele pesa mais que o Vaporeon, mais que o Paras, mais que qualquer coisa que você já carregou, e escada em espiral é a pior geometria possível pra carregar gente.',
    'Você para duas vezes. Na segunda você senta no degrau com ele em cima de você e fica assim por dois minutos.',
    d=>d.flags.zelador_subiu_junto ? 'O zelador desce na frente iluminando os degraus com uma vela, e é a coisa mais inútil e mais necessária do mundo.' : '',
    'No saguão, o zelador chama a van. Ela leva onze minutos.',
    'O Marowak não desceu. Você ouve o osso batendo lá em cima quando a van sai.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Carregou um desconhecido por seis andares'},
      hp:-5, causa:'Carregar um homem por seis andares',
      flag:'salvou_treinador_torre',
      registrar:'Carregou o treinador do sexto andar até a base da torre.',
      presagio:'O osso continuou batendo depois que a van saiu. Ninguém contou pra ele.'},
  escolhas:[
    {texto:'Subir de novo, contar pro Marowak.', vai:'c7_contou_pro_marowak'},
    {texto:'Ir com a van até Celadon.', vai:'c7_levou_os_dois'},
    {texto:'Subir de novo buscar o Cubone.', vai:'c7_cubone'},
    {texto:'Descansar. Você não aguenta mais.', vai:'c7_fim'}
  ]
},

c7_contou_pro_marowak:{
  texto:[
    'Você sobe os seis andares de novo, com as pernas tremendo, uma hora depois.',
    'O Marowak está no mesmo lugar. Batendo.',
    'Você senta a três metros e fala em voz alta, num corredor vazio, pra um Pokémon que não entende português:',
    '"Ele tá vivo. Levaram pro hospital. Ele tá vivo."',
    'Você fala isso umas quatro vezes, de jeitos diferentes, porque não sabe o que mais fazer.',
    'O Marowak para de bater.',
    'Não porque entendeu as palavras. Porque alguém subiu.',
    'Quatro dias batendo, e a coisa que fez parar foi alguém subir e sentar.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Subiu seis andares de novo só pra avisar'},
      flag:['acalmou_marowak','contou_pro_marowak'], moral:15,
      hp:-3, causa:'Subir a torre duas vezes no mesmo dia',
      registrar:'Subiu de novo só pra avisar o Marowak que o treinador dele estava vivo.',
      presagio:'A coisa que fez parar foi alguém subir e sentar. Guarda isso: é quase sempre isso.'},
  escolhas:[
    {texto:'Levar o Cubone pro hospital.', vai:'c7_cubone'},
    {texto:'Ficar sentado com os dois.', vai:'c7_ficou_com_marowak'},
    {texto:'Perguntar ao Marowak se ele quer descer.', vai:'c7_perguntou_ao_marowak'},
    {texto:'Descer e seguir viagem.', vai:'c7_fim'}
  ]
},

c7_luta_marowak:{
  texto:[
    'O Marowak grita quando você dá o primeiro passo.',
    'É um som que não devia sair de um corpo daquele tamanho, e ele para no meio, e recomeça.',
    d=>d.flags.entendeu_a_cena ? 'E você já sabe que ele não está defendendo território. Você faz isso sabendo.' : 'Você não sabe o que ele está defendendo. Você vai descobrir depois.'
  ],
  batalha:{dex:105, nivel:34, tipo:'selvagem', fuga:false, ambiente:'cemiterio',
           vitoria:'c7_pos_luta', derrota:'c7_pos_luta', captura:'c7_pos_luta', gameover:'gameover'}
},

c7_pos_luta:{
  texto:[
    'Quando acaba, o Marowak está caído e o Cubone não sai de perto dele.',
    'Você vai até o treinador. Ajoelha.',
    'E aí você vê o frasco de remédio aberto no chão, com os comprimidos espalhados, ao lado da mão dele.',
    'Ele não apanhou de ninguém. Ele passou mal, caiu, e o Marowak ficou quatro dias batendo osso em pedra chamando alguém.',
    'Três vezes, pausa, três vezes.',
    'Você carrega o treinador escada abaixo, seis andares, parando duas vezes.',
    'O zelador chama a van. O treinador acorda três horas depois e a primeira coisa que ele pergunta é pelo Marowak.',
    'Você diz a verdade, e a verdade é uma frase curta e feia.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Salvou um treinador inconsciente na Torre Pokémon'},
      hp:-5, causa:'Esforço na Torre Pokémon',
      flag:['salvou_treinador_torre','bateu_no_marowak'],
      registrar:'Derrotou o Marowak. Ele estava chamando ajuda há quatro dias.',
      presagio:'Era chamado, não ameaça. Você vai ter que decidir o que fazer com essa informação.'},
  escolhas:[
    {texto:'Voltar no sexto andar buscar o Cubone.', vai:'c7_cubone'},
    {texto:'Voltar no sexto andar buscar o Marowak.', vai:'c7_voltou_pelo_marowak'},
    {texto:'Contar ao treinador exatamente o que aconteceu.', vai:'c7_contou_a_verdade'},
    {texto:'Deixar como está. Ele escolheu ficar.', vai:'c7_fim'}
  ]
},

c7_voltou_pelo_marowak:{
  texto:[
    'Você sobe de novo e o Marowak ainda está caído no corredor do sexto andar, respirando.',
    'Não dá pra carregar um Marowak e um Cubone por seis andares. Você tenta e desiste no terceiro.',
    'Então você faz duas viagens.',
    'Doze andares. As suas pernas param de funcionar no meio da segunda e você senta num degrau do quarto andar com um Marowak inconsciente em cima de você, num corredor gelado, e chora um pouco de exaustão e um pouco do resto.',
    'O zelador te encontra ali e ajuda na última metade.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Desceu duas vezes carregando quem você derrubou'},
      hp:-7, causa:'Doze andares de escada carregando peso',
      flag:'carregou_o_marowak',
      npc:{nome:'Zelador da Torre', opiniao:6, memoria:'Te achou chorando de exaustão no quarto andar com um Marowak em cima. Ajudou na última metade.'},
      presagio:'Você derrubou e carregou. Isso não anula, mas é a única coisa que dá pra fazer depois.'},
  escolhas:[
    {texto:'Contar ao treinador exatamente o que aconteceu.', vai:'c7_contou_a_verdade'},
    {texto:'Buscar o Cubone também.', vai:'c7_cubone'},
    {texto:'Levar os três a Celadon.', vai:'c7_levou_os_dois'}
  ]
},

c7_contou_a_verdade:{
  texto:[
    'Você conta tudo. Sem melhorar nada.',
    'Que você achou que era ameaça. Que você atacou. Que ele estava chamando há quatro dias e você atacou.',
    'O treinador — Hideo, vinte e dois anos — escuta inteiro, com soro no braço, olhando o teto.',
    'Quando você acaba, ele demora.',
    '"Você subiu."',
    '"Eu bati nele."',
    '"Você subiu", ele repete, mais firme. "Quatro dias. Duas mil pessoa nessa cidade ouvindo osso batendo, e você subiu."',
    'Ele vira a cabeça pra você.',
    '"Eu não vou te absolver, cara. Eu não tenho energia pra isso agora. Mas eu ia morrer lá em cima."'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Contou a verdade sem melhorar nada'},
      flag:'contou_a_verdade_ao_hideo',
      npc:{nome:'Hideo', opiniao:6, memoria:'Você contou que atacou o Marowak dele antes de entender. Ele não te absolveu e agradeceu.'},
      presagio:'"Eu não vou te absolver." Você vai precisar disso quando alguém te absolver rápido demais.'},
  escolhas:[
    {texto:'Buscar o Cubone.', vai:'c7_cubone'},
    {texto:'Buscar o Marowak.', vai:'c7_voltou_pelo_marowak'},
    {texto:'Ficar até ele ter alta.', vai:'c7_ficou_ate_alta'},
    {texto:'Seguir viagem.', vai:'c7_fim'}
  ]
},

c7_acalmar:{
  texto:[
    'Você solta o cinto no chão, com todas as bolas, e mostra as mãos vazias.',
    'Depois anda.',
    d=>d.flags.sabe_o_que_o_marowak_faz
      ? 'E você não anda na direção dele. Você anda na direção do Cubone, devagar, pelo lado — porque você entendeu que o problema dele não é você.'
      : 'Você anda na direção dele, que é a direção errada, mas você ainda não sabe disso.'
  ],
  teste:{status:'carisma', dificuldade:9, nomeStatus:'Carisma',
         critico:'c7_acalmou_bem', sucesso:'c7_acalmou_bem', parcial:'c7_acalmou_meio', falha:'c7_acalmou_mal'}
},

c7_acalmou_bem:{
  texto:[
    'Leva doze minutos pra andar cinco metros.',
    'Você não fala. Só continua indo, devagar, com as mãos abertas, parando toda vez que ele tensiona.',
    'A um metro, o Marowak abaixa o osso. Não solta. Só abaixa.',
    'Você senta no chão frio ao lado dele — sentar é a parte importante, porque sentado você fica menor — e vocês dois ficam ali olhando o Cubone machucado.',
    'Depois de um tempo ele deixa você chegar no menor.',
    'O treinador acorda sozinho enquanto isso. Vê a cena. Não se mexe, porque entendeu o que está acontecendo, e fica quieto no chão por mais dez minutos pra não estragar.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Acalmou um Pokémon enlouquecido sem violência na Torre'},
      flag:['acalmou_marowak','salvou_treinador_torre'], moral:15,
      npc:{nome:'Zelador da Torre', opiniao:5, memoria:'Ele ouviu o que você fez no sexto andar. Não acreditou até ver.'},
      registrar:'Acalmou o Marowak sem lutar. A torre inteira comentou.'},
  escolhas:[
    {texto:'Levar o Cubone com você — com a permissão dos dois.', vai:'c7_cubone'},
    {texto:'Perguntar ao Marowak se ele quer descer.', vai:'c7_perguntou_ao_marowak'},
    {texto:'Gritar pro zelador subir.', vai:'c7_gritou_zelador'},
    {texto:'Deixar os dois juntos e descer.', vai:'c7_fim',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Deixou os dois juntos'}}}
  ]
},

c7_acalmou_meio:{
  texto:[
    'Você chega a dois metros. O Marowak não ataca, mas não cede — e o osso continua no alto.',
    'Vocês ficam nesse impasse por vinte minutos.',
    'Em algum momento você senta. Isso ajuda um pouco. Não o suficiente.',
    'No fim, ele decide que você não vale o esforço e recua pro canto com o Cubone, e o canto é longe o bastante do treinador caído.',
    'Dá pra arrastar o corpo pela escada. É o que você consegue.',
    'É pouco e é o que existe.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Evitou violência na Torre'}, hp:-3, causa:'Tensão na Torre',
      flag:['impasse_marowak','salvou_treinador_torre']},
  escolhas:[
    {texto:'Descer com o treinador.', vai:'c7_carregou_o_treinador'},
    {texto:'Tentar de novo, mais devagar.', vai:'c7_acalmar'},
    {texto:'Gritar pro zelador subir.', vai:'c7_gritou_zelador'},
    {texto:'Subir de novo depois pra buscar o Cubone.', vai:'c7_cubone'}
  ]
},

c7_acalmou_mal:{
  texto:[
    'Você chega perto demais rápido demais.',
    'O osso acerta você acima da orelha e o mundo inclina. Você cai de joelhos e vê o chão de pedra muito de perto, e por uns três segundos não sabe onde está.',
    'O Marowak não continua.',
    'Ele recua, tremendo, e volta pro canto com o Cubone — e é isso que faz você entender que ele nunca quis brigar com ninguém.',
    'Ele bate o osso no chão três vezes. Pausa. Três vezes.',
    'Do chão, com a cabeça latejando, você finalmente ouve o que aquilo é.'
  ],
  ef:{hp:-11, causa:'Golpe de osso na Torre Pokémon', flag:['ferido_marowak','era_chamado'],
      registrar:'Levou um golpe de osso no sexto andar e entendeu que o Marowak estava chamando.',
      presagio:'Você precisou apanhar pra ouvir. Quase todo mundo precisa.'},
  escolhas:[
    {texto:'Levantar e tentar de novo, mais devagar.', vai:'c7_acalmar', ef:{flag:'sabe_o_que_o_marowak_faz'}},
    {texto:'Ir direto no treinador caído.', vai:'c7_foi_no_treinador'},
    {texto:'Gritar pro zelador subir.', vai:'c7_gritou_zelador'},
    {texto:'Chega de gentileza. Batalhar.', vai:'c7_luta_marowak'}
  ]
},

c7_escudo:{
  texto:[
    'Você escolhe um dos seus e o coloca na frente. Não pra lutar — pra absorver.',
    'A ideia é simples e funciona no papel: o Marowak bate em alguma coisa enquanto você chega no treinador caído.',
    'Você olha pro seu time.',
    'E escolhe quem vai apanhar.'
  ],
  sacrificio:{
    pergunta:'Quem você põe na frente?',
    causa:'Usado como escudo contra o Marowak na Torre Pokémon',
    vai:'c7_escudo_resultado'
  }
},

c7_escudo_resultado:{
  texto:[
    'Funciona. É importante registrar isso: funciona.',
    'Você chega no treinador, arrasta ele pelo colarinho até a escada e desce seis andares com ele.',
    'O que ficou pra trás no sexto andar ficou pra trás no sexto andar.',
    'O zelador olha o seu cinto quando você chega embaixo. Conta as bolas com os olhos. Não diz nada.',
    'O não-dizer-nada dele é a coisa mais alta dessa cidade sem música.'
  ],
  ef:{rep:{eixo:'ruim',delta:4,motivo:'Sacrificou o próprio Pokémon como escudo'},
      moral:-30, flag:['usou_escudo','salvou_treinador_torre'],
      npc:{nome:'Zelador da Torre', opiniao:-6, memoria:'Ele contou as bolas no seu cinto quando você desceu. Faltava uma.'},
      registrar:'Usou um Pokémon como escudo. O time viu.',
      presagio:'O time viu. Eles não conseguem te dizer nada. Isso não quer dizer que não mudou.'},
  escolhas:[
    {texto:'Subir de novo. Buscar o que ficou.', vai:'c7_buscou_o_escudo'},
    {texto:'Escrever o nome no mural.', vai:'c7_mural', cond:d=>d.cemiterio.length>0,
     ef:{rep:{eixo:'bom',delta:1,motivo:'Escreveu o nome de quem sacrificou'}, flag:'escreveu_mural'}},
    {texto:'Ir embora de Lavender agora.', vai:'c7_fim'},
    {texto:'Ficar sentado no saguão.', vai:'c7_saguao_depois'}
  ]
},

c7_buscou_o_escudo:{
  texto:[
    'Você sobe de novo.',
    'O sexto andar está vazio. O Marowak não está lá. O Cubone não está lá.',
    'E o que você deixou também não.',
    'Você procura o andar inteiro, duas vezes, com a lanterna, olhando embaixo de tudo.',
    'Nada.',
    'Quando você desce, o zelador está no saguão, e antes de você perguntar ele diz:',
    '"Eles levam."',
    '"Levam pra onde?"',
    '"Pra cima."'
  ],
  ef:{flag:'levaram_pra_cima',
      presagio:'Pra cima. Tem um sétimo andar, e ele é o único que ninguém descreve.'},
  escolhas:[
    {texto:'Subir ao sétimo andar.', vai:'c7_setimo'},
    {texto:'Escrever o nome no mural.', vai:'c7_mural', cond:d=>d.cemiterio.length>0,
     ef:{rep:{eixo:'bom',delta:1,motivo:'Escreveu o nome de quem sacrificou'}, flag:'escreveu_mural'}},
    {texto:'Ir embora de Lavender.', vai:'c7_fim'}
  ]
},

c7_setimo:{
  texto:[
    'O sétimo andar não tem lápide, não tem vela, não tem nicho.',
    'É uma sala vazia com o pé-direito duas vezes mais alto que os outros andares e nenhuma janela.',
    'Não está frio. É a única coisa dessa torre que não está fria.',
    'No meio do chão tem um círculo de coisas.',
    'Não é altar, não é armadilha, não é nada organizado. É um monte de objetos deixados no chão em forma de círculo: uma coleira. Um chinelo. Uma bola quebrada. Uma fita de cabelo. Uma lanterna sem pilha. Um caderno molhado.',
    'Coisas que gente deixou cair na torre nos últimos cem anos, catadas e postas em círculo por alguma coisa que mora aqui.',
    'No centro do círculo tem um espaço vazio do tamanho de uma coisa.'
  ],
  ef:{flag:'viu_o_setimo', registrar:'O sétimo andar da torre tem um círculo de objetos com um espaço vazio no centro.',
      presagio:'Tem um espaço vazio no centro. Não é uma pergunta: é um convite.'},
  escolhas:[
    {texto:'Pôr alguma coisa sua no centro.', vai:'c7_deixou_no_centro'},
    {texto:'Não pôr nada. Descer.', vai:'c7_desceu_do_setimo'},
    {texto:'Pegar alguma coisa do círculo.', vai:'c7_pegou_do_circulo'},
    {texto:'Sentar na borda do círculo e ficar.', vai:'c7_sentou_no_circulo'}
  ]
},

c7_deixou_no_centro:{
  texto:[
    'Você tira alguma coisa da mochila e põe no centro.',
    d=>d.flags.tem_a_flor ? 'A flor amarela do morro.' : d.flags.tem_urna ? 'A urna de cedro, embrulhada em papel pardo.' : 'Uma coisa sua que você não vai conseguir explicar depois por que escolheu.',
    'Nada acontece.',
    'Você fica em pé no meio de um círculo de tralha numa sala vazia de um prédio sem janela, e nada acontece, e você se sente completamente idiota.',
    'E aí a temperatura do sétimo andar cai de uma vez, e volta ao normal em dois segundos, e é a única coisa que acontece.',
    'Foi um agradecimento. Você tem certeza absoluta disso e não tem nenhuma prova.'
  ],
  ef:{limpaFlag:['tem_a_flor'], flag:'deixou_no_centro', moral:12,
      rep:{eixo:'bom',delta:2,motivo:'Deixou uma coisa sua num círculo que ninguém entende'},
      presagio:'Foi um agradecimento e você não tem nenhuma prova. Você vai acabar acumulando um monte dessas.'},
  escolhas:[
    {texto:'Descer.', vai:'c7_desceu_do_setimo'},
    {texto:'Sentar na borda e ficar.', vai:'c7_sentou_no_circulo'}
  ]
},

c7_pegou_do_circulo:{
  texto:[
    'Você pega o caderno molhado.',
    'A temperatura da sala cai e não volta.',
    'Você põe o caderno de volta. A temperatura não volta.',
    'Você põe o caderno exatamente na posição em que estava, ajeitando o ângulo, e a temperatura não volta.',
    'Você desce os sete andares com a sensação exata e inconfundível de estar sendo acompanhado, e não é sensação, e você não olha pra trás nenhuma vez.',
    'No saguão, o zelador olha pra você e depois olha pra escada atrás de você, e a cara dele muda.',
    '"Você mexeu no círculo."'
  ],
  ef:{flag:'mexeu_no_circulo', hp:-4, causa:'Alguma coisa do sétimo andar',
      rep:{eixo:'ruim',delta:2,motivo:'Mexeu no que era dos mortos'},
      registrar:'Mexeu no círculo do sétimo andar e desceu acompanhado.',
      presagio:'O zelador olhou pra escada atrás de você. Ele viu alguma coisa.'},
  escolhas:[
    {texto:'Subir de novo e devolver de verdade.', vai:'c7_devolveu_de_verdade'},
    {texto:'"Mexi. E agora?"', vai:'c7_e_agora_circulo'},
    {texto:'Ir embora de Lavender imediatamente.', vai:'c7_fim'}
  ]
},

c7_devolveu_de_verdade:{
  texto:[
    'Você sobe de novo, e é a subida mais difícil das três, e não é por cansaço.',
    'No sétimo, você não devolve só o caderno.',
    'Você tira uma coisa sua da mochila e põe no centro do círculo, e fala em voz alta, sozinho, numa sala vazia:',
    '"Desculpa."',
    'A temperatura volta ao normal.',
    'Não devagar. De uma vez, como quem desliga alguma coisa.'
  ],
  ef:{limpaFlag:'mexeu_no_circulo', flag:'pediu_desculpa_no_setimo',
      rep:{eixo:'bom',delta:2,motivo:'Voltou sete andares pra pedir desculpa a ninguém'},
      moral:10,
      presagio:'Você subiu sete andares pra pedir desculpa a uma sala vazia. Anota isso na lista das coisas que você virou.'},
  escolhas:[
    {texto:'Descer.', vai:'c7_desceu_do_setimo'},
    {texto:'Sentar na borda e ficar.', vai:'c7_sentou_no_circulo'}
  ]
},

c7_e_agora_circulo:{
  texto:[
    '"Mexi. E agora?"',
    'O zelador não parece bravo. Parece preocupado de um jeito muito prático.',
    '"Agora você sobe e devolve."',
    '"Eu devolvi."',
    '"Você pôs de volta." Ele balança a cabeça. "Não é a mesma coisa. Devolver é pôr de volta e deixar outra no lugar."',
    '"Isso é regra de quê?"',
    '"De nada." Ele dá de ombros. "É o que funciona. Eu já vi funcionar quatro vezes em vinte e três anos."'
  ],
  escolhas:[
    {texto:'Subir e devolver de verdade.', vai:'c7_devolveu_de_verdade'},
    {texto:'Ir embora assim mesmo.', vai:'c7_fim'}
  ]
},

c7_sentou_no_circulo:{
  texto:[
    'Você senta na borda do círculo, de pernas cruzadas, numa sala vazia sem janela no alto de uma torre.',
    'Fica quarenta minutos.',
    'Não acontece nada de sobrenatural. Não tem voz, não tem frio, não tem aparição.',
    'O que acontece é que você pensa. Por quarenta minutos seguidos, sem Pokégear, sem gente, sem nada acontecendo, você pensa em tudo o que aconteceu desde que você saiu de casa.',
    'E em algum momento você percebe que está contando. Contando coisas que você fez, uma por uma, como quem confere.',
    'Talvez seja isso o sétimo andar. Talvez não tenha nada aqui e seja só o único lugar de Kanto onde ninguém te interrompe.'
  ],
  ef:{flag:'sentou_no_setimo', hp:4, moral:10,
      rep:{eixo:'bom',delta:1,motivo:'Passou quarenta minutos sozinho fazendo as contas'},
      presagio:'Talvez não tenha nada aqui. Isso não deixa de ser a coisa mais importante do prédio.'},
  escolhas:[
    {texto:'Deixar alguma coisa sua no centro.', vai:'c7_deixou_no_centro'},
    {texto:'Descer.', vai:'c7_desceu_do_setimo'}
  ]
},

c7_desceu_do_setimo:{
  texto:[
    'Você desce os sete andares.',
    'No quinto, o corredor está vazio — não tem nada ali, nem o que tinha antes.',
    'No quarto, não tem vozes.',
    'Nos três primeiros, tem gente rezando baixo, vela e incenso, e uma família comendo no chão em volta de uma lápide nova.',
    'No saguão, o zelador está repondo velas, do jeito que estava quando você chegou.',
    'Ele não pergunta nada. Você não conta nada.',
    'Ele repõe mais uma vela e diz, sem virar: "Boa viagem."'
  ],
  ef:{flag:'desceu_inteiro'},
  escolhas:[
    {texto:'Sair da torre.', vai:'c7_fim'},
    {texto:'Ficar sentado no saguão um pouco.', vai:'c7_saguao_depois'}
  ]
},

c7_saguao_depois:{
  texto:[
    'Você senta no banco de concreto do saguão, de frente pro mural de doze metros.',
    'Fica ali por um tempo que você não consegue medir.',
    'Entra gente. Sai gente. Duas pessoas escrevem no mural enquanto você está ali, e as duas devolvem o giz na caixinha.',
    'Uma delas é uma menina de uns onze anos, sozinha, com uma mochila de escola. Ela escreve um nome, fica olhando, e vai embora andando rápido.',
    'Você não fala com ela. Você não sabe se devia.'
  ],
  ef:{hp:3, presagio:'Você não sabe se devia. Vai ficar com isso.'},
  escolhas:[
    {texto:'Ir atrás da menina.', vai:'c7_a_menina_do_mural'},
    {texto:'Sair da torre.', vai:'c7_fim'},
    {texto:'Escrever no mural.', vai:'c7_mural', cond:d=>d.cemiterio.length>0,
     ef:{rep:{eixo:'bom',delta:2,motivo:'Honrou os próprios mortos'}, flag:'escreveu_mural', moral:10}}
  ]
},

c7_a_menina_do_mural:{
  texto:[
    'Você alcança ela na rua.',
    '"Ô."',
    'Ela para e olha pra trás com uma cara de quem está pronta pra levar bronca.',
    '"Eu só queria saber se você tá bem."',
    'Ela olha pra você por uns três segundos.',
    '"Tô."',
    'E aí, porque você não vai embora: "Era da minha vó. Minha vó morreu ano passado e ele ficou comigo e aí ele morreu também."',
    'Ela ajeita a mochila de escola.',
    '"Minha mãe falou que não precisava escrever no mural porque não era meu."',
    '"Você escreveu."',
    '"Eu escrevi." Ela levanta o queixo. "Era meu também."'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Foi atrás de uma menina de onze anos na rua'},
      flag:'a_menina_do_mural', moral:8,
      npc:{nome:'Menina do mural', opiniao:3, memoria:'Escreveu no mural o nome do Pokémon da avó. Você foi atrás perguntar se ela estava bem.'},
      presagio:'"Era meu também." Ela tem onze anos e ganhou uma discussão com a mãe sem estar lá.'},
  escolhas:[
    {texto:'"Era seu sim."', vai:'c7_era_seu_sim',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Disse a coisa certa em vinte palavras'}}},
    {texto:'Ficar em silêncio com ela.', vai:'c7_fim'},
    {texto:'Sair de Lavender.', vai:'c7_fim'}
  ]
},

c7_era_seu_sim:{
  texto:[
    '"Era seu sim."',
    'Ela faz que sim com a cabeça, rápido, três vezes.',
    'E depois vai embora sem se despedir, andando rápido, e na esquina ela corre.',
    'Você fica na rua principal de uma cidade sem música vendo uma menina de onze anos correr.',
    'Não dá pra saber se foi bom ou se foi pior. Provavelmente as duas coisas.'
  ],
  ef:{moral:5, presagio:'Provavelmente as duas coisas. É quase sempre as duas coisas.'},
  escolhas:[
    {texto:'Sair de Lavender.', vai:'c7_fim'}
  ]
},

c7_ajuda:{
  texto:[
    'Você desce correndo.',
    'Leva onze minutos pra achar o zelador, mais quinze pra ele reunir três pessoas, mais catorze pra subir de volta.',
    'Quarenta minutos.',
    'O treinador está morto quando vocês chegam.',
    'Não foi o Marowak — foi o que ele já tinha, que ninguém sabia, e que quarenta minutos decidiram.',
    'O Marowak está sentado do lado dele. Parou de defender. Deixou todo mundo chegar perto.',
    'Ele para de bater o osso no chão no momento em que vocês chegam, e não bate mais nunca.'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Buscou ajuda na Torre Pokémon'},
      flag:['treinador_morreu_torre','era_chamado'], instabilidade:1,
      npc:{nome:'Zelador da Torre', opiniao:2, memoria:'Subiu com você e viu o treinador morto no sexto andar.'},
      registrar:'O treinador do sexto andar morreu enquanto você buscava ajuda.',
      presagio:'Quarenta minutos. Você vai refazer essa conta com resultados diferentes, e nenhum vai importar.'},
  escolhas:[
    {texto:'Ficar com o Cubone.', vai:'c7_cubone'},
    {texto:'Ficar com o Marowak.', vai:'c7_ficou_com_marowak'},
    {texto:'Escrever o nome dele no mural.', vai:'c7_mural_do_treinador'},
    {texto:'Descer.', vai:'c7_fim'}
  ]
},

c7_mural_do_treinador:{
  texto:[
    'Você desce e pergunta o nome dele pro zelador, que confere na carteira que estava no bolso do rapaz.',
    'Hideo. Vinte e dois anos.',
    'Você escreve o nome dele no mural com giz. Não é o lugar certo — o mural é pra Pokémon —, mas você escreve mesmo assim, e o zelador vê e não impede.',
    'Depois você escreve, embaixo, com letra menor:',
    '"O Marowak dele chamou por quatro dias."',
    'Isso não conserta nada. É o único registro que vai existir dessa parte.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Deixou registrado o que ninguém ia registrar'},
      flag:'hideo_escreveu', moral:10,
      registrar:'Escreveu no mural: "O Marowak dele chamou por quatro dias."',
      presagio:'Isso vai ficar nessa parede até alguém apagar. Ninguém vai apagar.'},
  escolhas:[
    {texto:'Ficar com o Cubone.', vai:'c7_cubone'},
    {texto:'Ficar com o Marowak.', vai:'c7_ficou_com_marowak'},
    {texto:'Sair de Lavender.', vai:'c7_fim'}
  ]
},

c7_cubone:{
  texto:[
    'O Cubone tem a perna quebrada e não pesa quase nada.',
    'Ele não luta contra a bola. Não é aceitação — é uma coisa mais triste, que é não ter mais preferência nenhuma.',
    d=>d.flags.acalmou_marowak
      ? 'O Marowak olha e não impede. Antes de você descer, ele encosta a testa na cabeça do Cubone por um segundo, e depois vira de costas.'
      : 'Ninguém autoriza nada. Você só leva.',
    'Vai levar semanas pra perna sarar. Vai levar mais tempo pro resto.'
  ],
  ef:{umaVez:'c07_p1', pokemon:{dex:104, nivel:24, opcoes:{natureza:'Lonely', moral:25, historia:'Resgatado do sexto andar da Torre Pokémon de Lavender.'}},
      rep:{eixo:'bom',delta:2,motivo:'Resgatou um Pokémon órfão na Torre'},
      flag:'salvou_cubone',
      presagio:'Ele não tem mais preferência nenhuma. Isso muda, e muda devagar, e depende quase inteiramente de você.'},
  escolhas:[
    {texto:'Descer.', vai:'c7_fim'},
    {texto:'Subir ao sétimo andar antes de ir.', vai:'c7_setimo'},
    {texto:'Escrever no mural antes de ir.', vai:'c7_mural', cond:d=>d.cemiterio.length>0,
     ef:{rep:{eixo:'bom',delta:2,motivo:'Honrou os próprios mortos'}, flag:'escreveu_mural', moral:10}}
  ]
},

c7_fim:{
  texto:[
    'Você sai da torre e a rua de Lavender está do jeito que estava: sem música.',
    'Agora você entende o porquê. Não é superstição, não é respeito, não é regra.',
    'É que numa cidade onde todo dia alguém sobe uma escada carregando uma caixa pequena, som alto é uma coisa que ninguém consegue querer.',
    d=>{
      if (d.flags.usou_escudo) return 'Você olha pro cinto. Tem um espaço. Você vai olhar pra esse espaço todo dia pelo resto da jornada.';
      if (d.flags.acalmou_marowak) return 'Alguma coisa mudou em você lá em cima, e pela primeira vez em muito tempo é uma mudança pra melhor.';
      if (d.flags.treinador_morreu_torre) return 'Quarenta minutos. Você vai fazer essa conta muitas vezes, com resultados diferentes, e nenhum deles vai importar.';
      if (d.flags.bateu_no_marowak) return 'Três vezes, pausa, três vezes. Você vai ouvir esse ritmo em coisas que não têm nada a ver: numa torneira, num motor, numa porta batendo.';
      return 'Você não é a mesma pessoa que entrou. Não tem uma cena específica pra apontar. É só verdade.';
    },
    d=>d.flags.copiou_os_onze_nomes
      ? 'No seu caderno tem onze nomes copiados de um mural, e um endereço em Fuchsia com portão azul, e as duas coisas são a mesma coisa e você ainda não sabe provar.'
      : 'Lá embaixo, naquela parede preta, tem um canto perto do chão com onze nomes e uma data só.',
    'No dia seguinte, sai uma notícia de Cinnabar: incêndio numa instalação abandonada do laboratório. Ninguém ferido. Ninguém consegue explicar o que causou.',
    'E, muito menor, no pé da mesma página: a Liga Pokémon informa que "procedimentos de avaliação de custódia" passarão a ser comunicados por via postal.'
  ],
  fim:true, resumo:'A Torre te mostrou o que você trouxe — e um osso batendo em pedra há quatro dias.'
}
}}

);
