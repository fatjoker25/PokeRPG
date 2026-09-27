/* ============================================================
   EPÍLOGOS — o final conta o que aconteceu com o mundo.
   O epílogo conta o que aconteceu com VOCÊ.

   Quem escolhe é a soma de três coisas que a campanha inteira
   vem medindo em silêncio: o crachá que você carrega, o caminho
   que Kanto viu você seguir, e o que Kanto conta sobre você.

   `peso` desempata: crachá de peso 5 fala mais alto que via, e
   via fala mais alto que reputação. O último da lista é o que
   sobra pra quem não virou nada — e esse também é um final.
   ============================================================ */
const EPILOGOS = [

/* ─── pelo cargo (o que fala mais alto) ─────────────────── */
{
  id:'ep_conselheiro', peso:60, titulo:'A CADEIRA DESCONFORTÁVEL',
  requer:d=>Cargos.tem('conselheiro'),
  texto:[
    'Você tem dezesseis anos e uma plaquinha de latão com o seu nome numa cadeira que foi feita desconfortável de propósito.',
    'A primeira coisa que você descobre é que ninguém ali é vilão. São onze pessoas cansadas com pautas longas demais e prazos que ninguém cumpre, e é por isso que demora dois anos pra mudar qualquer coisa.',
    'A segunda coisa você descobre em abril: um parágrafo que você escreveu numa quarta-feira à tarde vira regra em Pewter, em Fuchsia e numa ilha que você nunca visitou, de uma vez, sem você estar lá.',
    'Você nunca mais bate numa porta pedindo pra alguém fazer alguma coisa. Agora batem na sua.',
    'É pior do que a estrada e é mais útil, e você vai passar a vida sabendo que as duas coisas são verdade ao mesmo tempo.'
  ]
},
{
  id:'ep_elite', peso:58, titulo:'A PAREDE DE ALGUÉM',
  requer:d=>Cargos.tem('elite'),
  texto:[
    'A sua porta tem uma placa de bronze parafusada na altura dos olhos, e a fonte é a mesma dos outros três.',
    'A parte difícil não é ganhar. É a cara das pessoas depois.',
    'Chega gente que treinou um ano inteiro pra te enfrentar, e você ganha, e elas descem o corredor em silêncio, e você fica sozinh{o|a} numa sala ouvindo o passo delas sumir.',
    'Você começou a fazer uma coisa que ninguém ali fazia: desce atrás. Alcança na escada. Fala duas frases.',
    'Em quatro anos, seis das pessoas que perderam pra você voltaram. Três ganharam.',
    'Ninguém escreveu isso em regulamento nenhum, e é a única coisa que você mudou no Planalto.'
  ]
},
{
  id:'ep_professor', peso:57, titulo:'A CADEIRA QUE NÃO É SUA',
  requer:d=>Cargos.tem('professor'),
  texto:[
    'O laboratório de Pallet tem um pátio, uma prateleira que ninguém gosta de olhar e uma cadeira que é do cargo, não da pessoa.',
    'Você senta nela e a primeira coisa que faz é uma que o Professor anterior nunca teve coragem: esvazia a prateleira.',
    'Os onze que ninguém foi buscar vão pra onze casas em quatro meses. Você acompanha os onze pessoalmente, o que é ineficiente e é o ponto.',
    'A segunda coisa é que a perua ganha um segundo motorista, porque a volta de onze cidades num carro de vinte e seis anos sempre foi uma aposta e você conhece bem quem apostava.',
    'A terceira você demora três anos pra fazer: sai do laboratório e vai a campo, e volta com noventa páginas que ninguém pediu.',
    'Quem mandou fazer isso foi você, porque agora é você que manda. Demora pra acostumar.'
  ]
},
{
  id:'ep_lider', peso:56, titulo:'QUINTA-FEIRA',
  requer:d=>Cargos.tem('lider'),
  texto:[
    'Ginásio não é prêmio. É um posto de trabalho com horário fixo e uma criança chorando na sua sala toda quinta.',
    'Você descobre, na terceira semana, que noventa por cento do trabalho não é batalhar. É dizer a alguém de doze anos que o problema não é o time.',
    'Quase nunca é o time.',
    'Você começa a anotar num caderno de capa dura quem passa, quem volta e quanto tempo demora entre as duas coisas. A média é catorze meses.',
    'Na sua sala tem uma janela que dá pro corredor e não pro vale, e você nunca pediu pra trocar.',
    'De vez em quando alguém chega com uma insígnia sua num cartão e não lembra do seu rosto, e tudo bem. A insígnia é que tinha que ficar.'
  ]
},
{
  id:'ep_rocket', peso:55, titulo:'ARMÁRIO 14',
  requer:d=>Cargos.tem('rocket'),
  texto:[
    'O envelope continua chegando no armário 14 do Centro de Vermilion toda virada de mês, e você continua não perguntando de onde.',
    'A quantia sobe devagar, do jeito que sobe salário de quem é útil e não é insubstituível.',
    'Você tem dinheiro, tem trânsito e tem gente que atende o seu telefone em três cidades. Não tem uma única pessoa pra quem contar o que faz.',
    'Numa terça de março você passa na frente do Centro e vê uma menina de treze anos abrir o armário 12, do lado do seu, e tirar de lá uma mochila com um adesivo de Pidgey.',
    'Você fica olhando tempo demais e ela percebe e sorri pra você, do jeito que gente de treze anos sorri pra estranho.',
    'Você vai embora sem pegar o seu envelope naquele mês. No mês seguinte você pega.'
  ]
},
{
  id:'ep_comissao', peso:50, titulo:'PERITO NÃO VOTA',
  requer:d=>Cargos.tem('comissao'),
  texto:[
    'Perito não vota. Perito fala antes da votação, e em oito de dez casos é quem fala antes que decide.',
    'Você aprende a redigir. Aprende que uma frase com "poderá" perde pra uma frase com "deverá", e que a diferença entre as duas é dois anos da vida de alguém.',
    'Aprende também que a pasta tem trinta e uma páginas e que a primeira é um termo de sigilo, e que assinar aquilo foi a decisão mais pesada que você tomou sem ninguém olhando.',
    'Tem uma pauta que você segurou por catorze meses e que teria passado sem você.',
    'Não tem placa pra isso. Tem uma ata, e a ata é pública, e custa oito pokedólares.'
  ]
},
{
  id:'ep_instrutor', peso:48, titulo:'A SALA PEQUENA',
  requer:d=>Cargos.tem('instrutor'),
  texto:[
    'A sala é pequena, tem janela pro corredor e é sua.',
    'Chega gente que apanhou em oito ginásios e acha que o problema é o time, e você diz a mesma frase que alguém disse pra você e que na hora você achou inútil.',
    'Uns entendem. A maioria não entende na hora e entende dois anos depois, e desses você nunca fica sabendo.',
    'Você guarda uma lista com os nomes de quem passou pela sala. Não é lista de alunos. É lista de gente, com uma linha do lado de cada um.',
    'Em nove anos a lista tem trezentos e quarenta e um nomes e você lembra de todos, o que é impossível e é verdade.'
  ]
},
{
  id:'ep_investigador', peso:44, titulo:'USE COM VERGONHA',
  requer:d=>Cargos.tem('investigador'),
  texto:[
    '"Use com vergonha", disse a auditora. "Quem usa sem vergonha eu cancelo em seis meses."',
    'Você usou com vergonha por nove anos e a credencial nunca foi cancelada.',
    'O trabalho é entrar em lugar onde ninguém quer que você entre e depois escrever o que viu, e a parte difícil é a segunda: escrever sem raiva o que você viu com raiva.',
    'Três relatórios seus viraram processo. Um virou lei. Dois viraram nada e são os dois de que você mais se lembra.',
    'Você continua batendo na porta antes de entrar, mesmo quando a credencial dispensa.'
  ]
},
{
  id:'ep_pesquisador', peso:42, titulo:'NOVENTA, ANDANDO',
  requer:d=>Cargos.tem('pesquisador'),
  texto:[
    'A bolsa é pequena, porque bolsa é sempre pequena.',
    'Você passa os anos seguintes fazendo o que já fazia de graça, agora com número de processo: andar, olhar, anotar, e mandar de volta.',
    'A sua contribuição não é uma descoberta. É um método: você prova, em cento e sessenta páginas, que dado de campo colhido por uma pessoa que dorme no acostamento vale mais que dado de campo colhido por uma equipe que volta pro hotel.',
    'Metade da academia acha isso ofensivo. A outra metade começa a dormir no acostamento.',
    'Em doze anos o jeito de fazer pesquisa de campo em Kanto mudou, e quase ninguém sabe que mudou por causa de {um menino|uma menina} de quinze anos que catalogou noventa espécies a pé.'
  ]
},
{
  id:'ep_reporter', peso:38, titulo:'ACESSO NÃO É RAZÃO',
  requer:d=>Cargos.tem('reporter'),
  texto:[
    '"Isso não te dá razão", disse a editora. "Te dá acesso."',
    'Você demorou uns quatro anos pra entender inteiro o que ela quis dizer, e entendeu numa matéria que você não publicou.',
    'Tinha tudo: documento, fonte, data. E tinha uma pessoa no meio que ia perder o emprego e não tinha feito nada além de assinar onde mandaram.',
    'Você segurou, foi atrás de quem mandou, e publicou quatro meses depois com o nome certo na manchete.',
    'A editora leu, não elogiou, e passou a te mandar as pautas difíceis. É assim que se elogia ali.'
  ]
},
{
  id:'ep_guarda', peso:34, titulo:'O COLETE NÃO DÁ AUTORIDADE',
  requer:d=>Cargos.tem('guarda_rota'),
  texto:[
    'O colete não dá autoridade. Dá passagem. As duas coisas se parecem e não são a mesma.',
    'Você passou anos usando a passagem e nunca a autoridade, o que fez de você uma pessoa estranha de se ter numa patrulha.',
    'Sua especialidade virou uma coisa que não tem nome no regulamento: chegar antes. Em trilha que ia cair, em cerca que ia abrir, em criança que ia entrar no mato sozinha às cinco da tarde.',
    'Ninguém te condecora por acidente que não aconteceu.',
    'Você sabe contar sete. Ninguém mais sabe, e é melhor assim.'
  ]
},
{
  id:'ep_criador', peso:32, titulo:'PATA, PELAGEM, PESO',
  requer:d=>Cargos.tem('criador'),
  texto:[
    'A avaliadora olhou pata, pelagem, peso e o jeito que eles olhavam pra você quando você não estava olhando.',
    'Você passou. E passou a vida seguinte fazendo isso com os bichos dos outros.',
    'Não é treino, não é medicina e não é ginásio. É a profissão mais invisível de Kanto e é a única em que a nota é dada por quem não fala.',
    'Você atende num galpão com piso de terra batida, e a fila é de gente que já tentou tudo e chegou aqui por indicação de alguém.',
    'A sua taxa de acerto é alta e a explicação é chata: você passa os primeiros quarenta minutos sem tocar em nada, só olhando.'
  ]
},
{
  id:'ep_auxiliar', peso:24, titulo:'CONTINUA MANDANDO',
  requer:d=>Cargos.tem('auxiliar') || Cargos.tem('treinador'),
  texto:[
    'Você nunca virou nada com nome grande. Ficou treinador, e ficou bem.',
    'A licença renova todo ano numa fila de balcão, e todo ano a atendente pergunta se mudou alguma coisa no cadastro, e todo ano você diz que não.',
    'O que mudou fica fora do cadastro: a Pokédex, que continua enchendo devagar; a agenda do aparelho azul, que virou uma lista de gente que atende quando você liga; e o cinto, que é o mesmo de sempre e nunca foi de seis.',
    'Em Kanto tem umas quarenta pessoas que lembram do seu nome por um motivo específico. Nenhuma delas é famosa.',
    'É uma vida pequena e é inteiramente sua, e você não trocaria por nenhuma das outras — o que, tendo visto as outras de perto, é uma informação e não um consolo.'
  ]
},

/* ─── pela via, quando não tem crachá que mande ──────────── */
{
  id:'ep_via_heroi', peso:20, titulo:'QUEM FOI SEM ESPERAR',
  requer:d=>(d.via === 'heroi'),
  texto:[
    'Kanto te tratou como quem vai sem esperar autorização, e Kanto tinha razão.',
    'Você resolveu três coisas que o sistema ia resolver em nove meses, e resolveu em quatro dias cada uma, e em duas delas quebrou uma regra que existia por um bom motivo.',
    'Ninguém te processou. Ninguém te agradeceu por escrito, também.',
    'O que sobrou foi uma reputação de que você aparece — e gente que sabe disso te liga primeiro, antes de ligar pra quem tem crachá.',
    'É um lugar desconfortável de ocupar. Você ocupa mesmo assim, porque o telefone toca e do outro lado tem alguém.'
  ]
},
{
  id:'ep_via_pesquisador', peso:20, titulo:'QUEM PAROU PRA OLHAR',
  requer:d=>(d.via === 'pesquisador'),
  texto:[
    'Você foi a pessoa que parou pra olhar quando todo mundo estava andando, e isso te custou tempo em todas as ocasiões em que você fez.',
    'Em compensação, você é a única pessoa que viu certas coisas — e viu inteiras, do começo ao fim, em vez de chegar no meio.',
    'Seus cadernos não valem nada como documento: não têm data padronizada, não têm metodologia e têm desenho no canto.',
    'Valem como testemunho, que é outra coisa, e que ninguém pediu.',
    'Um dia alguém vai abrir esses cadernos procurando uma data e vai encontrar, no meio delas, o único registro que existe de uma coisa que já não existe mais.'
  ]
},
{
  id:'ep_via_mercenario', peso:20, titulo:'O PREÇO ESTAVA CERTO',
  requer:d=>(d.via === 'mercenario'),
  texto:[
    'Você cobrou pelo que fez e o preço estava certo em todas as vezes, o que é mais do que a maioria consegue dizer.',
    'A parte que ninguém te avisou é que preço certo cria um tipo específico de relação: as pessoas te chamam quando precisam e não te chamam quando não precisam, e isso é limpo e é exatamente tão solitário quanto parece.',
    'Você tem economia, contatos e nenhuma dívida em aberto com ninguém.',
    'Também não tem ninguém com dívida em aberto com você, e dívida em aberto é o que faz gente aparecer na sua porta sem motivo.',
    'Aos vinte e poucos você começa a fazer um serviço por ano de graça, e não conta pra ninguém, e nem você sabe direito por quê.'
  ]
},
{
  id:'ep_via_foragido', peso:20, titulo:'SEM ENDEREÇO FIXO',
  requer:d=>(d.via === 'foragido'),
  texto:[
    'Existe uma pasta com o seu nome numa sala de Saffron, e a pasta não é grossa, e é isso que te mantém livre: ninguém alocou orçamento pra te procurar de verdade.',
    'Você dorme em cidade pequena, paga em dinheiro e conhece o horário das guaritas de Kanto inteira de cor.',
    'A liberdade é real e o preço também: você não volta pra casa há anos, e a pessoa que ficou lá não sabe se você está viv{o|a}, e você decidiu que não saber é melhor que saber.',
    'Talvez seja. Você não tem como conferir.',
    'De vez em quando alguém te reconhece numa rodoviária e não fala nada, e você passa a semana inteira tentando decidir o que aquilo significou.'
  ]
},

/* ─── pela reputação, quando não tem nem crachá nem via ──── */
{
  id:'ep_rep_bom_alto', peso:12, titulo:'CONTAM DE VOCÊ',
  requer:d=>d.reputacao.eixo === 'bom' && d.reputacao.bom >= 4,
  texto:[
    'Kanto é pequena e fala, e o que Kanto fala de você é bom de um jeito específico: não é que você é forte. É que você aparece.',
    'Você entra num Centro Pokémon de uma cidade em que nunca pisou e a atendente sabe o seu nome, porque alguém contou.',
    'Isso abre porta. Também cria uma expectativa que não te deixa em paz: gente chega em você com problema já pronto, por indicação, e olha na sua cara esperando.',
    'Você atende quase sempre. Nas vezes em que não atendeu, você lembra qual foi cada uma.'
  ]
},
{
  id:'ep_rep_ruim_alto', peso:12, titulo:'CONTAM DE VOCÊ, TAMBÉM',
  requer:d=>d.reputacao.eixo === 'ruim' && d.reputacao.ruim >= 4,
  texto:[
    'Kanto é pequena e fala, e o que Kanto fala de você não é bom.',
    'A coisa engraçada da má reputação é que ela é útil em lugares específicos: portas que não abrem pra gente correta abrem pra você na primeira batida.',
    'A coisa não engraçada é que ela não se desfaz. Você pode passar dez anos sem fazer nada errado e continuar sendo, numa cidade que você visitou uma vez, o que você foi lá.',
    'Você tentou consertar em duas cidades. Numa deu certo e na outra você desistiu no meio.',
    'A que deu certo você visita todo ano. A outra você não visita mais.'
  ]
},
{
  id:'ep_rep_neutro', peso:5, titulo:'SEM NADA A REGISTRAR',
  requer:d=>true,
  texto:[
    'Você atravessou Kanto inteira e Kanto não formou opinião.',
    'Não é fracasso. É a condição normal de quase todo mundo: fazer o que tinha que fazer, sem plateia, e ir embora antes que alguém precisasse decidir o que achava de você.',
    'Tem umas seis pessoas que lembram do seu rosto e nenhuma lembra do seu nome. Tem uma que lembra dos dois, e mora na casa de onde você saiu.',
    'Você volta pra lá em algum momento, e a porta dos fundos continua abrindo e fechando duas vezes, do jeito que sempre abriu.'
  ]
}
];

/* Qual epílogo é o seu: o de maior peso entre os que se aplicam. */
function epilogoDaJornada(){
  const d = Estado.dados;
  let melhor = null;
  for (const e of EPILOGOS){
    let vale = false;
    try { vale = !!e.requer(d); } catch(err){ vale = false; }
    if (!vale) continue;
    if (!melhor || e.peso > melhor.peso) melhor = e;
  }
  return melhor;
}

/* Linhas curtas que entram no epílogo conforme o que ficou pelo
   caminho. Não são epílogo inteiro — são o rodapé dele. */
function rodapeDaJornada(){
  const d = Estado.dados;
  const L = [];
  if (d.cemiterio.length)
    L.push(d.cemiterio.length === 1
      ? `Você carrega o nome de ${nomeExib(d.cemiterio[0])} pelo resto disso, e não conta a história pra qualquer um.`
      : `Você carrega ${d.cemiterio.length} nomes pelo resto disso, e não conta a história pra qualquer um.`);
  else
    L.push('Ninguém do seu cinto ficou pelo caminho, o que é raro o bastante pra você só entender quanto tempo depois.');

  if (d.flags.promessa_voltar && d.flags.campeao_de_kanto)
    L.push('Você prometeu voltar e voltou, e a pessoa que abriu a porta já sabia, porque em cidade pequena todo mundo já sabe.');
  else if (d.flags.promessa_voltar)
    L.push('Você prometeu voltar. Levou mais tempo do que devia, e voltou.');
  else if (d.flags.sem_promessa)
    L.push('Você não prometeu voltar. Voltou assim mesmo, o que conta mais do que a promessa teria contado.');

  const dex = Estado.contagemDex().catalogados;
  if (dex >= 140) L.push(`${dex} espécies catalogadas a pé. Existem três pessoas em Kanto com esse número e as outras duas têm laboratório.`);
  else if (dex >= 80) L.push(`${dex} espécies na Pokédex — mais do que a maioria de quem faz isso por profissão.`);

  if ((d.cargos || []).length >= 3)
    L.push(`Você acumulou ${d.cargos.length} credenciais diferentes, o que em Kanto é quase uma acusação.`);

  const presos = Estado.lendariosCapturados();
  if (presos.length) L.push('E tem uma bola no seu cinto que nunca devia ter sido lacrada, e você sabe disso desde o dia em que lacrou.');
  return L;
}
