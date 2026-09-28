/* ============================================================
   DESFECHOS ANTECIPADOS — a campanha não termina só na caverna
   do norte.

   Oito arcos curtos de encerramento, cada um enxertado no
   capítulo onde a escolha faz sentido. Nenhum deles é acidente:
   todos são uma opção escrita, visível, que só aparece quando o
   caminho até ali pagou por ela.

   Quem para aqui viu um fim de verdade, com epílogo e tudo. A
   história não fica pela metade: ela fecha em outro lugar.
   ============================================================ */

/* enxerta cenas num capítulo e pendura as portas de saída
   nas cenas que já existem */
function enxertarDesfecho(num, cenas, portas){
  const cap = CAPITULOS.find(c => c.num === num);
  if (!cap) return;
  /* enxertar nunca pode sobrescrever cena que já existe: isso apaga
     as escolhas dela e deixa as filhas órfãs sem avisar ninguém. */
  for (const id of Object.keys(cenas)){
    if (cap.cenas[id]) { console.warn('desfechos: cena repetida, ignorada —', id); delete cenas[id]; }
  }
  Object.assign(cap.cenas, cenas);
  (portas || []).forEach(p => {
    const cena = cap.cenas[p.de];
    if (!cena || !cena.escolhas) return;
    if (cena.escolhas.some(e => e.vai === p.para)) return;
    cena.escolhas.push({texto:p.texto, vai:p.para, cond:p.cond});
  });
}

/* ------------------------------------------------------------
   1. CAP 18 — PUBLICAR AGORA
   Você tem papel com carimbo e uma repórter que precisa de papel.
   Dá pra entregar tudo e deixar a matéria fazer o resto, o que
   encerra a sua parte e começa a de outra pessoa.
   ------------------------------------------------------------ */
enxertarDesfecho(18, {

c18_entregar_tudo:{
  texto:[
    'Você espalha tudo que tem na mesa do banco de praça e leva onze minutos só pra pôr em ordem.',
    d=>{
      const n = ['copia_dos_oito_convenios','copia_das_onze_ocorrencias','tem_os_relatorios_da_nishino',
                 'copia_do_hideo','copia_do_livro_de_bordo','tem_a_via_rosa','provas_navio',
                 'tem_a_caderneta_do_binoculo','imprimiu_do_terminal','tem_a_lista_dos_trinta_e_um']
                .filter(f => d.flags[f]).length;
      return `São ${n} documentos com carimbo, assinatura ou brasão, juntados em cidades que não se falam.`;
    },
    'Rhea Ashford lê tudo em silêncio por quarenta minutos e não faz uma anotação, porque anotar atrapalha a primeira leitura.',
    fala('Rhea Ashford', 'Você entende o que acontece se eu publicar isso.'),
    d=>fala(d.jogador.nome, 'Não.'),
    fala('Rhea Ashford', 'Nem eu. É por isso que eu perguntei.'),
    'Ela empilha os documentos e bate na mesa pra alinhar, do jeito que todo mundo que lida com papel faz.',
    fala('Rhea Ashford', 'Se eu publicar, você vira fonte. Fonte tem nome, endereço e uma vida que continua depois da matéria.'),
    fala('Rhea Ashford', 'Se eu não publicar, isso aqui envelhece na minha gaveta e daqui a quatro anos é história antiga.'),
    'Ela põe a mão em cima da pilha.',
    fala('Rhea Ashford', 'Eu não vou decidir por você.')
  ],
  ef:{flag:'entregou_tudo_pra_imprensa',
      registrar:'Entregou toda a documentação a Rhea Ashford.'},
  escolhas:[
    {texto:'"Publica." — e sair de cena.', vai:'c18_fim_publicou'},
    {texto:'"Publica, e põe o meu nome."', vai:'c18_fim_com_nome'},
    {texto:'Pegar os papéis de volta. Ainda não.', vai:'c18_cartorio'}
  ]
},

c18_fim_publicou:{
  texto:[
    d=>fala(d.jogador.nome, 'Publica.'),
    fala('Rhea Ashford', 'E o seu nome?'),
    d=>fala(d.jogador.nome, 'Não põe.'),
    'Ela assente uma vez e guarda a pilha na pasta de papelão e fecha o elástico, e o elástico faz um estalo pequeno.',
    fala('Rhea Ashford', 'Então a partir de agora eu não te conheço, e você não me conhece, e a gente nunca se viu em três cidades.'),
    'Ela levanta.',
    fala('Rhea Ashford', 'Isso não é frieza. É o jeito de você continuar tendo uma vida.'),
    'Ela vai embora pela praça e você fica sentad{o|a} no banco.',
    'E é aqui que a sua parte acaba, num banco de praça em Saffron, às quatro da tarde de uma quarta-feira, sem ninguém por perto pra ver.'
  ],
  final:{id:'publicou_sem_nome', titulo:'A FONTE QUE NÃO TEM NOME', texto:[
    'A matéria sai em três partes, no Correio de Kanto, começando numa terça.',
    'A primeira parte tem oito páginas e reproduz doze documentos em fac-símile, porque documento reproduzido é mais difícil de desmentir do que documento citado.',
    'A segunda parte é a que quebra: ela cruza o convênio do banco com o rodapé da auditoria da Zona Safári e com a folha de manifesto do porto de Vermilion, e mostra que os três falam do mesmo lote, com o mesmo número, em três documentos de órgãos que não se comunicam.',
    'A terceira parte é só a lista de quem assinou cada papel.',
    'A CGRB emite uma nota de resposta com onze parágrafos. O nono parágrafo admite a existência do programa continuado e é o único que qualquer pessoa lê.',
    'Abre-se uma comissão parlamentar de inquérito em quarenta dias. Ela dura dois anos e três meses e ouve cento e nove pessoas.',
    'Você não é uma delas, porque ninguém sabe que você existe.',
    'Você lê a CPI pelo jornal, como todo mundo, num Centro Pokémon de uma cidade qualquer, com um time cansado e nenhuma insígnia a mais do que tinha.',
    'Kanto muda devagar, do jeito que Kanto muda: por lei, por dois anos de audiência, e por um parágrafo nono que ninguém consegue retirar.',
    'E em nenhum lugar dessa história de dois anos aparece o seu nome.',
    'Foi o que você pediu.'
  ]}
},

c18_fim_com_nome:{
  texto:[
    d=>fala(d.jogador.nome, 'Publica, e põe o meu nome.'),
    'Ela para com a mão na pasta.',
    fala('Rhea Ashford', 'Você tem quinze anos.'),
    d=>fala(d.jogador.nome, 'Eu sei.'),
    fala('Rhea Ashford', 'Fonte identificada de quinze anos vira o assunto. Aí a matéria deixa de ser sobre o lote e passa a ser sobre você.'),
    d=>fala(d.jogador.nome, 'Então que seja sobre mim, se é isso que faz alguém ler.'),
    'Ela fica olhando pra você por um tempo comprido e você aguenta o olhar, o que é mais difícil do que parece.',
    fala('Rhea Ashford', 'Tá.'),
    'Ela tira o gravador da bolsa, apoia na mesa do banco de praça, e aperta o botão vermelho.',
    fala('Rhea Ashford', 'Diz seu nome inteiro e sua idade pra fita.')
  ],
  final:{id:'publicou_com_nome', titulo:'FONTE IDENTIFICADA, QUINZE ANOS', texto:[
    'A matéria sai numa terça e o seu nome está no terceiro parágrafo.',
    'Rhea tinha razão sobre tudo. Em quatro dias a história deixa de ser sobre o lote e passa a ser sobre você: a idade, a cidade onde você nasceu, a foto do cartão de treinador, a opinião de gente que nunca te viu sobre o que você devia ou não devia ter feito.',
    'Três programas de rádio discutem se um menor de idade pode ser fonte. Nenhum deles discute o convênio.',
    'E aí, na segunda semana, acontece a coisa que Rhea não tinha previsto.',
    'Uma auditora de manejo em Fuchsia dá entrevista com o nome dela. Depois um gerente de agência bancária em Saffron. Depois um conferente do porto de Vermilion, um capitão de porto em Cinnabar, uma funcionária de guarita em Lavender e o superintendente de uma concessão rodoviária, que pede demissão no mesmo dia.',
    'Seis pessoas adultas, com emprego e família, dizem o próprio nome em voz alta porque um garoto de quinze anos disse primeiro.',
    'A CPI ouve os seis. A CPI não te ouve: você é menor e depõe a portas fechadas, em quarenta minutos, num sábado.',
    'A lei que sai dois anos depois leva o número 9.431 e não leva o nome de ninguém.',
    'Mas em Fuchsia, na parede de uma sala de auditoria de manejo, tem uma cópia da primeira página daquela terça-feira presa com fita adesiva.',
    'A Brill nunca tirou.'
  ]}
}

}, [
  {de:'c18_ab_copia_dos_oito', para:'c18_entregar_tudo',
   texto:'Parar de investigar e entregar tudo à imprensa agora.',
   cond:d=>!!d.flags.reika_te_abordou || !!d.flags.reika_precisa_de_papel || !!d.flags.falou_com_a_imprensa},
  {de:'c18_ab_imprimiu', para:'c18_entregar_tudo',
   texto:'Parar de investigar e entregar tudo à imprensa agora.',
   cond:d=>!!d.flags.reika_te_abordou || !!d.flags.reika_precisa_de_papel || !!d.flags.falou_com_a_imprensa},
  {de:'c18_ab_as_tres_citacoes', para:'c18_entregar_tudo',
   texto:'Entregar tudo que você tem e deixar a matéria fazer o resto.'},
  {de:'c18_ab_a_reporter', para:'c18_entregar_tudo',
   texto:'Entregar tudo que você tem agora, em vez de ir ao cartório.'}
]);

/* ------------------------------------------------------------
   2. CAP 19 — FICAR DENTRO
   Você entrou na Estação 4 como auxiliar de campo. Dá pra não
   sair: assinar o contrato, ficar, e mudar o lugar por dentro,
   que é mais lento e menos heroico e às vezes funciona.
   ------------------------------------------------------------ */
enxertarDesfecho(19, {

c19_ficar_dentro:{
  texto:[
    'O contrato está na mesa do setor de pessoal, com a cláusula de sigilo no verso da segunda folha, e tem uma caneta em cima dele.',
    d=>d.flags.a_clausula_do_contrato ? 'Você já conhece a cláusula. Um rapaz de vinte e dois anos leu ela em voz alta num ônibus, e foi ficando mais devagar conforme lia.' : 'Você lê a cláusula duas vezes antes de tocar na caneta.',
    'A mulher do setor de pessoal tem uns quarenta e cinco anos e não está te pressionando. Ela está mexendo numa planilha e te deixando ler.',
    fala('a mulher do pessoal', 'Sem pressa. Tem gente que leva dois dias.'),
    d=>fala(d.jogador.nome, 'Tem gente que não assina?'),
    'Ela para de mexer na planilha.',
    fala('a mulher do pessoal', 'Tem. Uns três por ano.'),
    fala('a mulher do pessoal', 'E eu levo os três até o portão e eu fico contente pelos três, e eu não sei explicar isso pra você e nem pra mim.'),
    'Ela volta pra planilha.',
    fala('a mulher do pessoal', 'Eu tô aqui desde que abriu.', 'baixo')
  ],
  ef:{flag:'o_contrato_na_mesa',
      registrar:'O contrato da Estação 4 está na sua frente, com a caneta em cima.'},
  escolhas:[
    {texto:'Assinar. Ficar. Mudar isso por dentro.', vai:'c19_fim_assinou'},
    {texto:'Não assinar e deixar ela te levar até o portão.', vai:'c19_fim_nao_assinou'},
    {texto:'Não assinar e não ir pro portão. Ir pro setor de baixo.', vai:'c19_perimetro'}
  ]
},

c19_fim_assinou:{
  texto:[
    'Você assina as duas vias e rubrica as quatro páginas e ela carimba, e leva menos de dois minutos.',
    fala('a mulher do pessoal', '{Bem-vindo|Bem-vinda}. Armário quarenta e um. A chave fica na portaria e você devolve todo dia.'),
    'Você desce pro setor de baixo às treze e dez, de macacão, com um crachá que abre a porta.',
    'É limpo. É muito limpo: piso epóxi, luz boa, temperatura certa, e trezentas e onze baias numeradas em ordem.',
    'Nada está errado. Tudo está em ordem.',
    'E você vai passar os próximos anos aqui dentro.'
  ],
  final:{id:'ficou_dentro', titulo:'ONZE MESES É MAIS QUE A MÉDIA', texto:[
    'Você dura mais que a média. Você dura muito mais que a média.',
    'No sexto mês você aprende a ler a planilha de lote. No nono, descobre que a planilha de lote e o livro de entrada não fecham e que ninguém nunca cruzou os dois porque os dois ficam em salas diferentes.',
    'No décimo quarto mês você é promovid{o|a} a conferente, o que te dá acesso às duas salas.',
    'Você não denuncia nada. Você anota. Por três anos e sete meses você anota, num caderno de capa dura que mora dentro do armário quarenta e um, e a cada seis meses você tira uma cópia e manda pelo correio pra um endereço em Saffron que não é o seu.',
    'Quando a comissão parlamentar finalmente chega à Estação 4, ela chega com mandado e com uma lista de perguntas boas demais pra terem sido escritas por quem nunca esteve lá dentro.',
    'Você depõe por seis horas. Depois volta a trabalhar, porque a estação não fecha: ela é reestruturada, e reestruturada quer dizer que alguém tem que ficar cuidando das trezentas e onze baias enquanto os advogados discutem.',
    'Você fica. Por mais quatro anos.',
    'Não tem nada de heroico nisso e você nunca vai aparecer em jornal nenhum.',
    'Mas em algum ponto do sétimo ano alguém na sua equipe desce pela primeira vez, olha as baias e pergunta se aquilo é normal.',
    'E você é {o encarregado|a encarregada}. E você responde que não.'
  ]}
},

c19_fim_nao_assinou:{
  texto:[
    'Você põe a caneta em cima do contrato sem ter usado ela.',
    d=>fala(d.jogador.nome, 'Eu não vou assinar.'),
    'Ela não pergunta por quê. Ela fecha a planilha, pega o molho de chaves e levanta.',
    fala('a mulher do pessoal', 'Vem, eu te levo até o portão. É regra.'),
    'São quatrocentos metros até a portaria e vocês fazem os quatrocentos metros em silêncio, e na metade ela fala uma coisa só:',
    fala('a mulher do pessoal', 'Quatro esse ano.'),
    'E na catraca ela para, e destrava, e segura a catraca aberta com o quadril, e não te deixa passar ainda.',
    fala('a mulher do pessoal', 'Ó. Quando você contar isso pra alguém — e você vai contar.'),
    fala('a mulher do pessoal', 'Conta que aqui dentro tem gente. Tem quarenta e tantas pessoas com filho e prestação e almoço marcado.', 'baixo'),
    fala('a mulher do pessoal', 'Não é um monstro. É um emprego. É pior.'),
    'Ela solta a catraca.'
  ],
  final:{id:'saiu_pelo_portao', titulo:'É UM EMPREGO. É PIOR.', texto:[
    'Você sai da Estação 4 às onze e quarenta da manhã, a pé, e anda os quatro quilômetros até a estrada porque o ônibus fretado só volta às dezoito.',
    'Nos quatro quilômetros você entende que não tem nada na sua mochila. Nenhum documento, nenhuma foto, nenhum lote numerado. Só uma frase dita numa catraca por uma mulher que trabalha lá desde que abriu.',
    'Você conta essa frase, nos anos seguintes, pra todo mundo que quer ouvir.',
    'Conta numa mesa de bar em Fuchsia, conta num Centro Pokémon em Celadon, conta pra dois repórteres e pra uma auditora e pra um rapaz de vinte e dois anos que você encontra por acaso dois anos depois e que te reconhece do ônibus.',
    'A frase viaja melhor que documento, porque documento precisa de carimbo e frase só precisa de alguém que tenha estado lá.',
    'Quando a comissão parlamentar é instalada, seis anos depois, o relatório final abre com uma citação que não tem autor identificado e que qualquer pessoa que trabalhou numa estação de manejo reconhece na hora.',
    '"Não é um monstro. É um emprego. É pior."',
    'Você lê isso num jornal, numa cidade qualquer, com o time cansado e nenhuma insígnia a mais.',
    'E você sabe exatamente de quem é a frase, e ela nunca vai saber que você contou.'
  ]}
}

}, [
  {de:'c19_ab_o_rapaz_novo', para:'c19_ficar_dentro',
   texto:'Descer do ônibus e ir ao setor de pessoal assinar contrato também.'},
  {de:'c19_ab_nao_e_normal', para:'c19_ficar_dentro',
   texto:'Descer e ir ao setor de pessoal. Se é pra entender, é por dentro.'},
  {de:'c19_ab_o_que_faz', para:'c19_ficar_dentro',
   texto:'Aceitar a vaga e ir assinar o contrato.'}
]);

/* ------------------------------------------------------------
   3. CAP 20 — A CADEIRA VAZIA
   Na sala 704 tem treze cadeiras e doze ocupadas. Dá pra sentar
   na décima terceira, e isso é um fim.
   ------------------------------------------------------------ */
enxertarDesfecho(20, {

c20_a_cadeira:{
  texto:[
    'A mesa oval tem treze cadeiras e doze pessoas.',
    'Você contou duas vezes porque não acreditou na primeira.',
    'A décima terceira está na ponta oposta à presidente, puxada pra trás uns vinte centímetros, do jeito de cadeira que alguém levantou e não empurrou de volta.',
    fala('a presidente', 'Aquela é a vaga de representação externa.'),
    'Ela diz isso sem você perguntar, o que quer dizer que ela viu você contando.',
    fala('a presidente', 'Está vaga há três anos e dois meses.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('a presidente', 'Porque o regimento diz que ela é preenchida por indicação de entidade da sociedade civil, e nenhuma entidade da sociedade civil indicou ninguém.'),
    'Ela junta as mãos em cima da pasta.',
    fala('a presidente', 'Nós publicamos o edital sete vezes. Sete. Está tudo no diário oficial.'),
    'Ninguém na mesa está sorrindo e ninguém está constrangido. É uma informação administrativa e eles a tratam como tal.',
    fala('a presidente', '{O senhor|A senhora} tem uma entidade que o indique?')
  ],
  ef:{flag:'a_cadeira_vaga',
      registrar:'A 13ª cadeira do conselho está vaga há três anos: representação externa, por indicação de entidade civil.',
      presagio:'Sete editais publicados e nenhuma indicação. O buraco na parede sempre esteve aberto.'},
  escolhas:[
    {texto:'"Tenho." — e você tem, e é a coisa mais improvável do capítulo.', vai:'c20_fim_sentou',
     cond:d=>!!(d.flags.reika_te_abordou || d.flags.conheceu_a_nishino || d.flags.os_trinta_e_nove_juntos ||
                d.flags.a_manifestacao_do_porto || (typeof Cargos!=='undefined' && Cargos.lista().length >= 2))},
    {texto:'"Não tenho." — e pedir a palavra pelo Art. 27 mesmo assim.', vai:'c20_palavra'},
    {texto:'Perguntar quem foi o último a sentar ali.', vai:'c20_o_ultimo_da_cadeira'}
  ]
},

c20_o_ultimo_da_cadeira:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem foi o último a sentar aí?'),
    'A presidente olha pra um homem de uns sessenta anos na metade da mesa, e ele é quem responde.',
    fala('o conselheiro mais velho', 'Uma senhora de Lavender. Associação de moradores.'),
    fala('o conselheiro mais velho', 'Ela veio às treze primeiras reuniões. Não faltou uma.'),
    d=>fala(d.jogador.nome, 'E parou de vir por quê?'),
    'Ele mexe na caneta.',
    fala('o conselheiro mais velho', 'Porque ela votou contra sete vezes e perdeu as sete por doze a um.'),
    'A sala fica quieta e a quietude não é constrangida: é a quietude de doze pessoas que já pensaram nisso.',
    fala('o conselheiro mais velho', 'E na décima quarta reunião ela mandou uma carta dizendo que a cadeira dela servia pra fazer parecer que a gente ouvia alguém.'),
    fala('o conselheiro mais velho', 'A carta está anexa à ata. É pública. Custa oito pokedólares.', 'baixo')
  ],
  ef:{flag:'a_carta_da_senhora_de_lavender',
      registrar:'A última ocupante da 13ª cadeira votou contra sete vezes, perdeu por 12 a 1 nas sete, e renunciou por carta.',
      presagio:'Doze a um, sete vezes. A cadeira existe e não muda o placar.'},
  escolhas:[
    {texto:'"Tenho quem me indique." — sentar mesmo assim.', vai:'c20_fim_sentou',
     cond:d=>!!(d.flags.reika_te_abordou || d.flags.conheceu_a_nishino || d.flags.os_trinta_e_nove_juntos ||
                d.flags.a_manifestacao_do_porto || (typeof Cargos!=='undefined' && Cargos.lista().length >= 2))},
    {texto:'Pedir a palavra pelo Art. 27.', vai:'c20_palavra'},
    {texto:'Não dizer nada e olhar quem está na mesa.', vai:'c20_mesa'}
  ]
},

c20_fim_sentou:{
  texto:[
    d=>{
      if (d.flags.reika_te_abordou) return fala(d.jogador.nome, 'O Correio de Kanto me indica.');
      if (d.flags.conheceu_a_nishino) return fala(d.jogador.nome, 'A auditoria de manejo da Zona Safári me indica.');
      if (d.flags.os_trinta_e_nove_juntos) return fala(d.jogador.nome, 'A colônia de pescadores de Fuchsia me indica.');
      if (d.flags.a_manifestacao_do_porto) return fala(d.jogador.nome, 'O sindicato dos estivadores de Vermilion me indica.');
      return fala(d.jogador.nome, 'Eu tenho quem me indique, e eu trouxe o papel.');
    },
    'Você põe a carta de indicação na mesa oval e ela desliza uns quinze centímetros no verniz.',
    'A presidente lê. Passa pro conselheiro da esquerda, que lê, que passa adiante.',
    'A carta dá a volta na mesa inteira, doze pessoas, e leva quatro minutos, e ninguém fala nada nos quatro minutos.',
    'A presidente é a última a receber de volta.',
    fala('a presidente', 'Está em ordem.'),
    'Ela diz isso sem nenhuma emoção e com uma precisão que é a coisa mais assustadora do capítulo.',
    fala('a presidente', 'Secretária, registre em ata a posse do conselheiro de representação externa.'),
    'E a cadeira vinte centímetros pra trás é puxada pra frente pela primeira vez em três anos e dois meses.',
    'Por você.'
  ],
  final:{id:'sentou_na_cadeira', titulo:'DOZE A UM', texto:[
    'Você perde a primeira votação por doze a um.',
    'Perde a segunda por doze a um. A terceira, a quarta, a quinta.',
    'Na sexta, alguém se abstém, e doze a um vira onze a um com uma abstenção, e você passa a semana inteira pensando nessa abstenção.',
    'Você descobre, nos primeiros seis meses, três coisas que ninguém te contou.',
    'Uma: conselheiro tem direito a vista de processo, e vista de processo é o direito de levar a pasta pra casa por dez dias.',
    'Duas: pedido de vista suspende a votação, e não existe limite de quantas vezes um conselheiro pode pedir vista, porque ninguém imaginou que alguém quisesse.',
    'Três: ata de reunião é pública e custa oito pokedólares, e uma ata em que um conselheiro registra voto em separado, por escrito, com fundamentação, vira documento citável em qualquer processo judicial de Kanto.',
    'Você perde todas as votações por quatro anos.',
    'E em quatro anos você produz cento e nove votos em separado, todos públicos, todos citáveis, todos assinados, e uma advogada em Saffron que você nunca conheceu pessoalmente usa quarenta e um deles numa ação civil pública que suspende o programa continuado por liminar numa quinta-feira de março.',
    'Você não estava lá. Você estava numa reunião ordinária, perdendo por doze a um.',
    'A senhora de Lavender estava certa: a cadeira serve pra fazer parecer que eles ouvem alguém.',
    'Ela só não imaginou o que dá pra fazer com uma cadeira que faz parecer.'
  ]}
}

}, [
  {de:'c20_predio', para:'c20_a_cadeira', texto:'Contar as cadeiras da mesa.'},
  {de:'c20_ab_a_mulher_da_cabeceira', para:'c20_a_cadeira', texto:'Subir e contar as cadeiras da mesa.'},
  {de:'c20_ab_devem', para:'c20_a_cadeira', texto:'Subir e contar as cadeiras da mesa.'},
  {de:'c20_ab_disse_setimo', para:'c20_a_cadeira', texto:'Entrar e contar as cadeiras da mesa.'}
]);

/* ------------------------------------------------------------
   4. CAP 21 — NÃO SAIR DE NOVO
   Você voltou pra casa com oito insígnias. Dá pra não pegar a
   estrada outra vez, e isso não é desistência: é uma escolha
   com consequência escrita.
   ------------------------------------------------------------ */
enxertarDesfecho(21, {

c21_ficar_de_vez:{
  texto:[
    d=>`A mochila está encostada na parede do seu quarto e faz quatro dias que você não mexe nela.`,
    'Não é preguiça. Você já arrumou e desarrumou ela duas vezes essa semana.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} dorme no tapete do corredor, que é um lugar que ${pron(p).ele} escolheu sozinh${pron(p).o} no segundo dia e do qual ${pron(p).ele} não saiu mais.`
               : 'A casa tem um barulho de fundo que você tinha esquecido: geladeira, rua, alguém na cozinha.';
    },
    d=>fala(nomeCasa(), 'Você vai voltar quando?'),
    'É a primeira vez que perguntam isso desde que você chegou, e perguntaram da porta do quarto, sem entrar, o que é um cuidado.',
    d=>fala(d.jogador.nome, 'Não sei.'),
    d=>fala(nomeCasa(), 'Tá.'),
    'E vai embora, porque a pergunta era de verdade e a resposta foi aceita.',
    'Você fica sentad{o|a} na cama olhando uma mochila encostada numa parede.'
  ],
  ef:{flag:'a_mochila_encostada',
      registrar:'Faz quatro dias que a mochila está encostada na parede sem ser tocada.'},
  escolhas:[
    {texto:'Desfazer a mochila. Ficar.', vai:'c21_fim_ficou'},
    {texto:'Desfazer a mochila e procurar trabalho na cidade.', vai:'c21_fim_ficou_trabalhando'},
    {texto:'Arrumar de novo e sair amanhã.', vai:'c21_a_rua'}
  ]
},

c21_fim_ficou:{
  texto:[
    'Você esvazia a mochila em cima da cama e separa em três pilhas: o que é seu, o que é de viagem e o que você não sabe por que carregou esse tempo todo.',
    'A terceira pilha é a maior.',
    'Tem um toco de vela de sete centímetros, uma folha de manifesto de carga dobrada em quatro, um canhoto de protocolo, uma pedra que você não lembra de ter pegado, e um punhado de coisas que tiveram um motivo e perderam.',
    'Você guarda tudo numa caixa de sapato e põe a caixa em cima do armário.',
    'A mochila vazia vai pro fundo do armário, dobrada.',
    'E acabou. Sem cena, sem despedida, sem ninguém pra avisar.'
  ],
  final:{id:'ficou_em_casa', titulo:'A CAIXA EM CIMA DO ARMÁRIO', texto:[
    'Você fica.',
    'Não tem drama nisso e não tem alívio: tem a vida que estava acontecendo aqui o tempo todo e que continua acontecendo, e você entra nela no meio, como quem entra num filme começado.',
    'As oito insígnias ficam na caixa de sapato. Você tira uma vez, no primeiro ano, pra mostrar pra alguém, e depois não tira mais — não por vergonha, por falta de ocasião.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} vive mais dez anos e morre no tapete do corredor, que continuou sendo o lugar ${pron(p).dele}.`
               : 'O time envelhece com você, no quintal, e isso é uma frase que você não teria entendido aos quinze.';
    },
    'A parte que ninguém te avisa é esta: o que você viu não sai de você por ficar parad{o|a}.',
    'Em algum momento do terceiro ano, um caminhão-gaiola passa na estrada da sua cidade, de madrugada, e você acorda com o barulho.',
    'E você levanta, e anota a placa, e volta pra cama.',
    'E na manhã seguinte você manda a placa por carta pra um endereço em Saffron, e paga o selo, e não conta pra ninguém.',
    'Você faz isso por quatorze anos.',
    'Quando a comissão parlamentar finalmente é instalada, uma das provas anexadas ao relatório é uma série de duzentas e sete cartas manuscritas, enviadas de uma cidade pequena, com placas, datas e horários, assinadas com o mesmo nome.',
    'Ninguém nunca foi te entrevistar.',
    'Ninguém precisou.'
  ]}
},

c21_fim_ficou_trabalhando:{
  texto:[
    'Você desfaz a mochila de manhã e sai de tarde, e na terceira porta em que você bate tem uma vaga.',
    'É no Centro Pokémon da cidade: auxiliar de atendimento, turno da noite, salário de auxiliar de atendimento de turno da noite.',
    'A enfermeira que te contrata tem uns cinquenta anos e te conhece desde criança, e ela faz uma pergunta e só uma:',
    fala('a enfermeira do Centro', 'Você aguenta ver bicho machucado a noite inteira?'),
    d=>fala(d.jogador.nome, 'Aguento.'),
    fala('a enfermeira do Centro', 'Todo mundo fala isso.'),
    'Ela te dá um jaleco que é um número maior que o seu.',
    fala('a enfermeira do Centro', 'Você começa hoje. Eu preciso de alguém hoje.')
  ],
  final:{id:'ficou_no_centro', titulo:'TURNO DA NOITE', texto:[
    'Você faz o turno da noite do Centro Pokémon da sua cidade por dezenove anos.',
    'Um Centro de cidade pequena atende umas quarenta pessoas por noite em mês bom. A maioria é bobagem: arranhão, cansaço, um garoto de treze anos que acha que o Rattata dele está morrendo e não está.',
    'Você é muito bom com os garotos de treze anos. Isso vira a sua fama, na medida em que existe fama nessa profissão.',
    'E umas quatro ou cinco vezes por ano chega uma coisa que não é bobagem.',
    'Chega um bicho com brinco amarelo de identificação de reserva na orelha, a duzentos quilômetros de qualquer reserva. Chega alguém com a marca de gaiola no pelo. Chega, uma vez, um Seel filhote com metade do peso.',
    'Você anota todas. Ficha, data, procedência declarada e procedência provável.',
    'Dezenove anos de fichas.',
    'A comissão parlamentar pede os arquivos de trinta e um Centros Pokémon de Kanto e recebe de trinta deles a resposta padrão: "registros descartados após cinco anos, conforme norma".',
    'Do trigésimo primeiro chegam quatro caixas.',
    'O relatório final cita o seu Centro cento e doze vezes.',
    'Você nunca saiu da sua cidade.'
  ]}
}

}, [
  {de:'c21_a_rua', para:'c21_ficar_de_vez', texto:'Não decidir hoje. Ficar mais uns dias e ver o que acontece.'},
  {de:'c21_ab_ninguem_sabia', para:'c21_ficar_de_vez', texto:'Ir pra casa e não decidir nada por uns dias.'},
  {de:'c21_ab_a_faixa', para:'c21_ficar_de_vez', texto:'Ir pra casa e ficar uns dias antes de decidir qualquer coisa.'}
]);

/* ------------------------------------------------------------
   5. CAP 23 — O GINÁSIO
   O segundo andar de Viridian estava lacrado por um motivo. Dá
   pra assumir o ginásio e parar aqui.
   ------------------------------------------------------------ */
enxertarDesfecho(23, {

c23_ficar_com_o_ginasio:{
  texto:[
    fala('Blue', 'Eu vou embora.'),
    'Ele fala isso de costas, olhando a linha pintada do chão do próprio ginásio.',
    d=>fala(d.jogador.nome, 'Embora pra onde?'),
    fala('Blue', 'Não é da sua conta e eu também não sei.'),
    'Ele vira.',
    fala('Blue', 'A Liga vai precisar de um titular aqui em quarenta e cinco dias, que é o prazo do regimento. Se não tiver titular, o ginásio fecha e os desafiantes são redirecionados pra Pewter.'),
    fala('Blue', 'Aí Pewter atende o dobro e o Brock atende mal, porque ninguém atende o dobro bem.'),
    'Ele pega uma folha dobrada do bolso de trás e desdobra. É um formulário da Liga, já preenchido, com um campo em branco.',
    fala('Blue', 'Eu preenchi o resto. Falta o nome.'),
    d=>fala(d.jogador.nome, 'Por que eu?'),
    fala('Blue', 'Porque você subiu a escada.'),
    fala('Blue', 'E porque eu levei dois anos pra subir, e você levou um dia, e isso responde a sua pergunta melhor do que eu conseguiria.', 'frio')
  ],
  ef:{flag:'blue_ofereceu_o_ginasio',
      npc:{nome:'Blue', opiniao:4, memoria:'Te ofereceu o ginásio de Viridian com o formulário já preenchido.'},
      registrar:'Blue vai embora e te ofereceu o posto de titular do ginásio de Viridian.'},
  escolhas:[
    {texto:'Escrever o seu nome no campo em branco.', vai:'c23_fim_assumiu'},
    {texto:'"Escreve o seu nome de novo e fica." — recusar.', vai:'c23_recusou_o_ginasio'},
    {texto:'Perguntar o que ele vai fazer com o arquivo do segundo andar.', vai:'c23_perguntou_antes'}
  ]
},

c23_recusou_o_ginasio:{
  texto:[
    d=>fala(d.jogador.nome, 'Escreve o seu nome de novo e fica.'),
    fala('Blue', 'Não.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    'Ele demora. Dobra o formulário de volta, na dobra que já existia.',
    fala('Blue', 'Porque eu obedeci por dois anos e eu não consigo mais entrar aqui sem lembrar disso.'),
    fala('Blue', 'Isso não é humildade, é o contrário. Eu não aguento.'),
    'Ele guarda o formulário no bolso de trás.',
    fala('Blue', 'Tudo bem. Em quarenta e cinco dias a Liga arruma alguém ou fecha.'),
    'E não fala mais nisso, e o assunto fica pendurado no ar do ginásio pelo resto da conversa.'
  ],
  ef:{flag:'recusou_o_ginasio',
      npc:{nome:'Blue', opiniao:1, memoria:'Você recusou o ginásio e mandou ele ficar.'},
      registrar:'Recusou o posto de titular do ginásio de Viridian.'},
  escolhas:[
    {texto:'Subir e ver o arquivo.', vai:'c23_subiu_com_blue'},
    {texto:'Perguntar o que tem lá em cima.', vai:'c23_perguntou_antes'}
  ]
},

c23_fim_assumiu:{
  texto:[
    'Você escreve o seu nome no campo em branco com a caneta dele.',
    'É um formulário. Tem três vias, papel carbono e um campo de rubrica no rodapé de cada página, e a coisa mais definitiva da sua vida acontece com a mesma burocracia de trocar de plano de telefone.',
    fala('Blue', 'Rubrica as três.'),
    'Você rubrica as três.',
    'Ele destaca a segunda via e dobra e guarda, e te entrega a primeira e a terceira, e aí faz a única coisa cerimonial do dia inteiro: tira a chave do ginásio do chaveiro dele, anel por anel, e põe na sua mão.',
    fala('Blue', 'A do segundo andar é a pequena.'),
    'E vai embora pela porta da frente, sem mochila, sem se despedir do prédio, e não olha pra trás uma vez.'
  ],
  final:{id:'assumiu_viridian', titulo:'TITULAR, GINÁSIO DE VIRIDIAN', texto:[
    'Você é o titular mais novo da história da Liga Pokémon e isso vira notícia por três semanas e depois deixa de ser notícia, que é o melhor que podia acontecer.',
    'Um ginásio atende, em média, quatrocentos desafiantes por ano. Você atende quatrocentos desafiantes por ano.',
    'A maior parte do trabalho não é lutar: é manutenção elétrica, escala de funcionário, prestação de contas trimestral e uma quantidade de papel que ninguém menciona quando fala de líder de ginásio.',
    'O arquivo do segundo andar continua lá.',
    'Você não entrega ele à imprensa, não entrega à Liga e não queima. Você faz outra coisa, que leva onze anos e que ninguém repara acontecendo.',
    'Você organiza.',
    'Cataloga caixa por caixa, cruza com o que você juntou pelo caminho, e abre requerimento atrás de requerimento — porque titular de ginásio é autoridade da Liga, e autoridade da Liga tem legitimidade pra requerer, e requerimento de autoridade é respondido em quinze dias.',
    'Onze anos de requerimentos de quinze dias.',
    'Quando a comissão parlamentar é instalada, ela não precisa investigar nada: ela recebe do titular do ginásio de Viridian um índice remissivo de oitocentas e quarenta páginas, com referência cruzada e cópia autenticada de tudo.',
    'O deputado relator pergunta, na primeira sessão, há quanto tempo você vinha preparando aquilo.',
    'E você responde que desde o dia em que subiu uma escada atrás de um biombo.'
  ]}
}

}, [
  {de:'c23_ab_chegou_antes', para:'c23_ficar_com_o_ginasio', texto:'Perguntar por que ele parece estar se despedindo do lugar.'},
  {de:'c23_ab_o_biombo', para:'c23_ficar_com_o_ginasio', texto:'Perguntar, daqui de baixo, por que ele abriu hoje e não amanhã.'},
  {de:'c23_ab_de_cracha', para:'c23_ficar_com_o_ginasio', texto:'Perguntar por que ele está te entregando papel em vez de te mandar embora.'}
]);

/* ------------------------------------------------------------
   6. CAP 24 — VOLTAR DA SÉTIMA
   Sete guaritas. Dá pra não passar da sétima, e transformar isso
   em outra coisa.
   ------------------------------------------------------------ */
enxertarDesfecho(24, {

c24_a_setima_barrou:{
  texto:[
    'A sétima guarita é igual às outras seis: pedra, telhado de duas águas, uma cancela de madeira pintada de branco e vermelho.',
    'O guarda passa o leitor. A máquina apita uma vez, igual às outras seis.',
    'E ele olha uma segunda tela.',
    'Você vê o reflexo dela no vidro lateral da guarita e não consegue ler nada, só ver que tem texto.',
    fala('o guarda da sétima', 'Hoje não.'),
    d=>fala(d.jogador.nome, 'Eu passei em seis.'),
    fala('o guarda da sétima', 'Passou.'),
    d=>fala(d.jogador.nome, 'E a sétima é diferente por quê?'),
    'Ele fecha a segunda tela com um clique.',
    fala('o guarda da sétima', 'Porque a sétima é a última.'),
    'E não tem nada de ameaçador no jeito que ele diz. Ele parece cansado e parece que já disse isso hoje e que vai dizer de novo.',
    fala('o guarda da sétima', 'Desculpa, {moço|moça}. É de verdade.')
  ],
  ef:{flag:'barrado_na_setima',
      registrar:'Passou em seis guaritas e foi barrado na sétima, pela segunda tela.',
      presagio:'Seis pra deixar você subir quatro quilômetros. A sétima pra te mandar de volta.'},
  escolhas:[
    {texto:'Voltar. E fazer disso o assunto.', vai:'c24_fim_voltou'},
    {texto:'Voltar até a curva e contornar pelo mato à noite.', vai:'c24_contornou'},
    {texto:'Exigir ver a segunda tela.', vai:'c24_ab_exigiu_a_tela'}
  ]
},

c24_ab_exigiu_a_tela:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu quero ver a segunda tela.'),
    fala('o guarda da sétima', 'Não pode.'),
    d=>fala(d.jogador.nome, 'Tem base legal pra não poder?'),
    'Ele para. É uma pergunta que ninguém faz pra um guarda de cancela e ele não tem resposta pronta.',
    fala('o guarda da sétima', 'Tem instrução de serviço.'),
    d=>fala(d.jogador.nome, 'Instrução de serviço assinada por quem?'),
    'Silêncio.',
    'Ele abre uma gaveta da guarita, tira uma folha plastificada e vira ela na sua direção sem soltar da mão.',
    'É uma instrução de meia página. No campo de quem assina, uma palavra sozinha, sem sigla e sem número:',
    '**CONSELHO**',
    fala('o guarda da sétima', 'Pronto. Viu. Agora volta, por favor.'),
    'E ele diz "por favor" e é por isso que você volta.'
  ],
  ef:{flag:['a_instrucao_da_setima','ordens_assinadas_por_conselho'],
      registrar:'A instrução de serviço que barra desafiantes na sétima guarita é assinada apenas como "CONSELHO".'},
  escolhas:[
    {texto:'Voltar. E fazer disso o assunto.', vai:'c24_fim_voltou'},
    {texto:'Voltar até a curva e contornar pelo mato à noite.', vai:'c24_contornou'}
  ]
},

c24_fim_voltou:{
  texto:[
    'Você desce os quatro quilômetros e não volta pra casa: para na primeira guarita e senta na pedra em frente a ela.',
    'Sentar na pedra em frente à primeira guarita da Rota 23 não é crime nenhum. É uma pedra numa estrada pública.',
    'Às onze da manhã passa uma pessoa subindo e você conta pra ela o que tem na sétima.',
    'Às onze e quarenta passam duas.',
    'À uma da tarde o guarda da primeira sai da guarita e vem falar com você, e você está preparad{o|a} pra briga e não é briga.',
    fala('o guarda da primeira', 'Você vai ficar aí o dia inteiro?'),
    d=>fala(d.jogador.nome, 'Vou.'),
    'Ele olha a estrada. Depois a guarita. Depois a estrada de novo.',
    fala('o guarda da primeira', 'Então pega uma sombra. Aí onde você tá bate sol das duas em diante.')
  ],
  final:{id:'a_pedra_da_primeira', titulo:'A PEDRA EM FRENTE À PRIMEIRA', texto:[
    'Você senta naquela pedra por cento e quarenta e um dias.',
    'Não todos os dias e não o dia inteiro: você desce pra comer, dorme num Centro Pokémon a onze quilômetros, e em quatro ocasiões some por uma semana pra ganhar dinheiro. Mas você volta, e a pedra continua lá, e a estrada continua sendo pública.',
    'O que você faz é muito simples e ninguém consegue te impedir: você conta pra quem sobe o que tem na sétima guarita. E anota o nome de quem desce barrado.',
    'No dia quarenta e dois, alguém senta na pedra com você.',
    'No dia noventa, são seis pessoas, e alguém levou um guarda-sol.',
    'No dia cento e nove, uma repórter sobe e passa a tarde inteira, e no dia cento e doze sai uma matéria de página inteira com uma fotografia de nove pessoas sentadas numa pedra de beira de estrada.',
    'A Liga suspende o controle de acesso da Rota 23 no dia cento e quarenta e um, por "reavaliação de procedimento", numa nota de quatro linhas que não menciona a pedra, a matéria, nem ninguém.',
    'Você nunca chega ao Planalto Indigo. Nunca enfrenta a Elite dos Quatro. Nunca é campeão de nada.',
    'A sua lista tem trezentos e dezenove nomes de gente que foi barrada sem motivação escrita, e ela é anexada, sete anos depois, à comissão parlamentar, como anexo 14.',
    'Trezentas e dezenove pessoas.',
    'Você tem o nome de todas.'
  ]}
}

}, [
  {de:'c24_a_terceira', para:'c24_a_setima_barrou', texto:'Seguir até a sétima e tentar passar.'},
  {de:'c24_ab_a_fila', para:'c24_a_setima_barrou', texto:'Passar as seis primeiras e tentar a sétima.'},
  {de:'c24_ab_quem_voltou', para:'c24_a_setima_barrou', texto:'Subir e ir direto tentar a sétima.'}
]);

/* ------------------------------------------------------------
   7. CAP 25 — O ACORDO
   Na audiência dá pra fechar acordo. É o fim mais confortável e
   o mais difícil de defender depois.
   ------------------------------------------------------------ */
enxertarDesfecho(25, {

c25_o_acordo:{
  texto:[
    'A mulher da pasta de couro te chama no corredor às dez e vinte e três, no meio da audiência, durante um intervalo que ninguém pediu.',
    'Ela não se apresenta e não precisa: você já entendeu quem ela é pela maneira como a recepcionista parou de digitar quando ela passou.',
    fala('a mulher da pasta', 'Eu vou ser breve porque a gente tem nove minutos.'),
    fala('a mulher da pasta', 'Existe um termo de ajustamento. Já está redigido. Falta uma assinatura e não é a minha.'),
    d=>fala(d.jogador.nome, 'Ajustamento de quê?'),
    fala('a mulher da pasta', 'De conduta. Da Comissão.'),
    'Ela abre a pasta de couro e mostra o documento, sem entregar, virado na sua direção.',
    fala('a mulher da pasta', 'Quatro compromissos. Cessação do programa continuado em cento e oitenta dias. Auditoria externa anual. Publicidade das atas. E devolução dos espécimes identificáveis.'),
    'É mais do que você conseguiria numa vida inteira de requerimentos.',
    fala('a mulher da pasta', 'E uma cláusula final: quitação recíproca. Ninguém processa ninguém, nada do que passou é apurado, e os arquivos anteriores a este ano são incinerados como parte do saneamento.'),
    'Ela fecha a pasta.',
    fala('a mulher da pasta', 'Você assina como parte interessada. Sem você, não tem termo: tem processo de seis anos e nenhum prazo de cento e oitenta dias.', 'baixo')
  ],
  ef:{flag:'o_termo_de_ajustamento',
      registrar:'Existe um termo de ajustamento pronto: quatro compromissos reais e uma cláusula de quitação recíproca.',
      presagio:'Cento e oitenta dias contra seis anos. E, no meio, o incinerador.'},
  escolhas:[
    {texto:'Assinar o termo.', vai:'c25_fim_assinou_o_termo'},
    {texto:'Recusar e voltar pra audiência.', vai:'c25_fim_recusou_o_termo'},
    {texto:'Perguntar quantos arquivos são incinerados.', vai:'c25_quantos_arquivos'}
  ]
},

c25_quantos_arquivos:{
  texto:[
    d=>fala(d.jogador.nome, 'Quantos arquivos?'),
    'Ela não hesita, o que é pior do que se hesitasse.',
    fala('a mulher da pasta', 'Quarenta e um anos.'),
    d=>fala(d.jogador.nome, 'Quarenta e um anos de quê?'),
    fala('a mulher da pasta', 'De tudo. Desde a constituição da comissão.'),
    'Ela olha o relógio de pulso, que não atrasa.',
    fala('a mulher da pasta', 'Eu vou te dizer uma coisa que eu não deveria dizer e que você vai usar contra mim ou não.'),
    fala('a mulher da pasta', 'Nesses quarenta e um anos tem nome de gente que já morreu e de gente que hoje é respeitável.'),
    fala('a mulher da pasta', 'A cláusula de incineração não é sobre a comissão. É sobre eles.'),
    'Ela endireita a pasta de couro debaixo do braço.',
    fala('a mulher da pasta', 'E é por isso que o termo existe, e é por isso que ele é tão bom pro seu lado.', 'frio')
  ],
  ef:{flag:'quarenta_e_um_anos_de_arquivo',
      registrar:'A cláusula de incineração cobre 41 anos de arquivo, com nomes de gente hoje respeitável.',
      presagio:'O prazo de 180 dias é o preço que alguém está disposto a pagar pelo incinerador.'},
  escolhas:[
    {texto:'Assinar mesmo assim. Cento e oitenta dias valem os quarenta e um anos.', vai:'c25_fim_assinou_o_termo'},
    {texto:'Recusar. Os quarenta e um anos valem os seis.', vai:'c25_fim_recusou_o_termo'}
  ]
},

c25_fim_assinou_o_termo:{
  texto:[
    'Você assina na antessala, em cima da pasta de couro dela, com a planta que precisa de água a meio metro do seu cotovelo.',
    'Duas vias. Rubrica em cada folha. Leva três minutos.',
    'Às dez e trinta e um a audiência é retomada e a presidente da mesa registra em ata a celebração de termo de ajustamento de conduta e a extinção do feito.',
    'A sessão dura mais quatro minutos.',
    'Você sai do prédio às dez e quarenta e três da manhã de uma segunda-feira, com uma via carimbada na mochila, tendo conseguido em cinquenta e nove minutos mais do que qualquer pessoa conseguiu em quarenta e um anos.',
    'E leva quatro quarteirões pra entender por que você não está bem.'
  ],
  final:{id:'assinou_o_termo', titulo:'CENTO E OITENTA DIAS', texto:[
    'O termo é cumprido. Essa é a parte que ninguém esperava e que muda tudo.',
    'O programa continuado é encerrado no dia cento e setenta e sete, três dias antes do prazo, porque encerrar antes do prazo é melhor pra ata.',
    'A auditoria externa acontece todo ano, com relatório público, e o primeiro relatório é devastador e ninguém pode fazer nada com ele porque a quitação é recíproca.',
    'As atas passam a ser publicadas. Quatrocentas e onze pessoas se cadastram para recebê-las no primeiro ano. No quinto ano, são onze mil.',
    'E mil novecentos e quarenta e dois espécimes identificáveis são devolvidos, ao longo de dois anos, com acompanhamento veterinário e registro fotográfico, e você acompanha a devolução do primeiro lote porque te convidam e porque você vai.',
    'Você vê mil novecentas e quarenta e duas criaturas voltarem pra algum lugar por causa de uma assinatura sua.',
    'E também: quarenta e um anos de arquivo queimam num incinerador industrial em Celadon, num sábado, com laudo de destruição assinado por três pessoas.',
    'Você não sabe o que tinha lá dentro. Ninguém nunca vai saber.',
    'Essa é a conta que você fez aos quinze anos em cinquenta e nove minutos, em pé numa antessala, com uma planta seca do lado.',
    'Você refaz essa conta a vida inteira e ela dá o mesmo resultado todas as vezes, e você continua refazendo.'
  ]}
},

c25_fim_recusou_o_termo:{
  texto:[
    d=>fala(d.jogador.nome, 'Não.'),
    fala('a mulher da pasta', 'Você entende que sem a sua assinatura não existe prazo de cento e oitenta dias.'),
    d=>fala(d.jogador.nome, 'Entendo.'),
    fala('a mulher da pasta', 'E que o processo vai durar anos e você vai ter quase vinte quando acabar.'),
    d=>fala(d.jogador.nome, 'Entendo.'),
    'Ela fecha a pasta de couro e o fecho faz um estalo seco no corredor vazio.',
    fala('a mulher da pasta', 'Então você está escolhendo o arquivo em vez dos bichos.'),
    'E essa frase é exata, e é injusta, e é exata.',
    d=>fala(d.jogador.nome, 'Eu tô escolhendo que ninguém decida isso numa antessala em nove minutos.'),
    'Ela olha pra você por dois segundos.',
    fala('a mulher da pasta', 'Tá.'),
    'E volta pra sala de audiência, e a audiência é retomada às dez e trinta e um, e o feito não é extinto.'
  ],
  final:{id:'recusou_o_termo', titulo:'SEIS ANOS', texto:[
    'O processo dura seis anos e dois meses.',
    'Não tem nada de emocionante em seis anos de processo. Tem prazo, tem juntada, tem perícia, tem três mudanças de relator e um período de catorze meses em que absolutamente nada acontece.',
    'Você tem quinze anos quando recusa e vinte e um quando sai a decisão.',
    'Nesses seis anos o programa continuado continua funcionando. Essa é a parte que você carrega: mil novecentos e quarenta e dois espécimes identificáveis, que teriam voltado em dois anos, não voltam.',
    'Muitos não existem mais quando a decisão sai.',
    'E os quarenta e um anos de arquivo não queimam.',
    'Eles são periciados, digitalizados e juntados aos autos, e os autos são públicos, e o que está neles alcança dezenove pessoas que ninguém jamais teria alcançado — quatro delas em cargos que exigiram renúncia, duas em processos criminais próprios, e uma que morreu em mil novecentos e noventa e um e cujo nome estava numa rua, numa escola e num prêmio de mérito da Liga.',
    'A rua foi renomeada. A escola não.',
    'O prêmio de mérito da Liga deixou de existir.',
    'Você não sabe, e nunca vai saber, se escolheu certo. Ninguém sabe.',
    'O que você sabe é que a decisão não foi tomada por quatro pessoas num corredor em nove minutos, e que essa era a única coisa que estava nas suas mãos.'
  ]}
}

}, [
  {de:'c25_esperou_dar_dez', para:'c25_o_acordo', texto:'Atender a mulher da pasta de couro, que te chamou no corredor.'},
  {de:'c25_a_mulher_da_pasta', para:'c25_o_acordo', texto:'Sair pro corredor com ela.'},
  {de:'c25_ab_em_cima_da_hora', para:'c25_o_acordo', texto:'Aceitar o chamado da mulher da pasta, no corredor.'}
]);

/* ------------------------------------------------------------
   8. CAP 26 — O QUE TE OFERECEM
   No Planalto te oferecem coisas. Dá pra aceitar, e aceitar é
   um fim.
   ------------------------------------------------------------ */
enxertarDesfecho(26, {

c26_aceitou_o_posto:{
  texto:[
    'A sala tem uma mesa comprida, oito cadeiras e uma janela com o vidro trincado remendado com fita, que você viu de fora quando chegou.',
    'Sentadas, quatro pessoas. Uma delas é da Liga, uma é da Comissão, e as outras duas você não consegue classificar, o que provavelmente é o ponto.',
    fala('a conselheira da Liga', 'Vamos ser diretos, porque {o senhor|a senhora} já perdeu bastante tempo com gente que não foi direta.'),
    'Ela empurra uma pasta fina pela mesa.',
    fala('a conselheira da Liga', 'Coordenação de campo. Cargo novo, criado no mês passado, com dotação orçamentária própria.'),
    d=>fala(d.jogador.nome, 'Criado no mês passado.'),
    fala('a conselheira da Liga', 'Criado no mês passado.'),
    'Ela não finge que isso é coincidência, o que é quase um elogio.',
    fala('a conselheira da Liga', '{O senhor|A senhora} teria acesso a todas as estações, a todos os manifestos e a todos os relatórios de manejo de Kanto. Legalmente. Com crachá.'),
    fala('a conselheira da Liga', 'E um dever funcional de sigilo, que é a parte que {o senhor|a senhora} está pensando agora.'),
    'Ela junta as mãos.',
    fala('a conselheira da Liga', 'Acesso total e boca fechada. É a oferta. Não vai ficar mais bonita se eu repetir.')
  ],
  ef:{flag:'a_oferta_da_coordenacao',
      registrar:'Te ofereceram uma coordenação de campo criada no mês passado: acesso total e dever de sigilo.',
      presagio:'Criaram o cargo depois de saber de você. Isso é o elogio e é a armadilha.'},
  escolhas:[
    {texto:'Aceitar.', vai:'c26_fim_aceitou'},
    {texto:'Recusar na frente dos quatro.', vai:'c26_fim_recusou'},
    {texto:'Perguntar quem criou o cargo.', vai:'c26_quem_criou_o_cargo'}
  ]
},

c26_quem_criou_o_cargo:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem criou o cargo?'),
    'Os quatro se olham, e é o homem que você não conseguiu classificar quem responde.',
    fala('o homem sem crachá', 'Resolução conjunta.'),
    d=>fala(d.jogador.nome, 'Conjunta de quem com quem?'),
    fala('o homem sem crachá', 'Da Liga com a Comissão.'),
    'Você olha pra conselheira da Liga, que não desvia.',
    d=>fala(d.jogador.nome, 'A Liga e a Comissão assinam resolução conjunta?'),
    'Silêncio de uns quatro segundos, e é o silêncio mais informativo do capítulo.',
    fala('a conselheira da Liga', 'Desde mil novecentos e sessenta e dois.'),
    'Ela diz isso sem nenhum constrangimento, e é aí que você entende que ela nunca achou que isso fosse segredo.',
    fala('a conselheira da Liga', '{O senhor|A senhora} passou meses procurando uma conspiração e o que existe é um convênio. Está publicado.', 'baixo')
  ],
  ef:{flag:'resolucao_conjunta_desde_sessenta_e_dois',
      registrar:'A Liga e a Comissão assinam resolução conjunta desde 1962. Está publicado.',
      presagio:'Não era escondido. Era só chato de ler.'},
  escolhas:[
    {texto:'Aceitar o cargo.', vai:'c26_fim_aceitou'},
    {texto:'Recusar na frente dos quatro.', vai:'c26_fim_recusou'}
  ]
},

c26_fim_aceitou:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu aceito.'),
    'Não tem aperto de mão. Tem formulário.',
    'Três páginas, duas vias, rubrica no rodapé, e um termo de sigilo funcional anexo que você lê inteiro na frente deles, o que leva onze minutos e que ninguém interrompe.',
    'Na página dois do termo tem uma frase que você relê três vezes: "o sigilo funcional não alcança comunicação dirigida a órgão de controle interno ou externo, nos termos da legislação aplicável".',
    'Está lá. Escrito. Em corpo dez, no meio do parágrafo terceiro.',
    'Você assina.',
    'A conselheira da Liga acompanha o seu dedo parando naquela linha e não fala nada, e você não sabe se ela reparou ou se ela sempre soube.'
  ],
  final:{id:'aceitou_a_coordenacao', titulo:'PARÁGRAFO TERCEIRO', texto:[
    'Você trabalha para eles por nove anos.',
    'Faz o serviço. Faz bem: é coordenador de campo, visita estação, confere manifesto, assina relatório de manejo. Tem sala, tem telefone, tem uma secretária que se chama Kaede e que faz o melhor café do andar.',
    'E, por nove anos, você usa o parágrafo terceiro.',
    'Comunicação dirigida a órgão de controle não é quebra de sigilo. Você manda quatrocentas e onze delas, todas formais, todas protocoladas, todas com número, ao longo de nove anos — pra auditoria, pra controladoria, pro ministério público, pra tudo que a legislação chame de órgão de controle.',
    'As primeiras duzentas não dão em nada.',
    'A de número trezentos e oitenta e nove dá.',
    'A comissão parlamentar, quando é instalada, é instalada com base em quatro comunicações protocoladas por um servidor da própria estrutura, o que retira de todo mundo a possibilidade de chamar aquilo de perseguição externa.',
    'Você depõe como coordenador de campo, de terno, com crachá, sobre fatos que você conheceu no exercício da função e comunicou tempestivamente.',
    'É o depoimento mais devastador da CPI inteira e é também o mais chato: quatro horas de número de protocolo.',
    'A Comissão é extinta por lei no ano seguinte.',
    'Você fica sem emprego, e você sabia disso desde o dia em que leu o parágrafo terceiro em pé, numa sala com a janela remendada com fita.'
  ]}
},

c26_fim_recusou:{
  texto:[
    d=>fala(d.jogador.nome, 'Não.'),
    fala('a conselheira da Liga', 'Não é uma oferta que se repete.'),
    d=>fala(d.jogador.nome, 'Eu sei.'),
    'Ela fecha a pasta fina.',
    fala('a conselheira da Liga', '{O senhor|A senhora} entende que, recusando, continua sem acesso a nada, e que tudo que {o senhor|a senhora} tem é papel juntado de forma irregular por um menor de idade.'),
    d=>fala(d.jogador.nome, 'Entendo.'),
    fala('a conselheira da Liga', 'E que {o senhor|a senhora} está escolhendo a versão mais difícil de todas.'),
    d=>fala(d.jogador.nome, 'Tô.'),
    'Ela assente uma vez, e é um gesto de quem registra, não de quem concorda.',
    'O homem sem crachá, que não falou desde o começo, é o único que fala quando você já está na porta:',
    fala('o homem sem crachá', 'Pra constar: eu achei que você ia aceitar.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('o homem sem crachá', 'Porque eu aceitei.', 'baixo')
  ],
  final:{id:'recusou_a_coordenacao', titulo:'A VERSÃO MAIS DIFÍCIL', texto:[
    'Você desce do Planalto Indigo a pé, no fim da tarde, sem cargo, sem acesso, sem crachá e sem plano.',
    'Os anos seguintes são exatamente tão difíceis quanto ela avisou.',
    'Você não consegue protocolo, porque protocolo de particular demora noventa dias e o de servidor demora quinze. Não consegue vista de processo. Não consegue pauta, não consegue reunião, não consegue nada que dependa de alguém te achar importante.',
    'O que você consegue é o que sempre conseguiu: gente.',
    'Uma auditora em Fuchsia. Um gerente de agência em Saffron. Um conferente em Vermilion. Um capitão de porto em Cinnabar. Uma funcionária de guarita em Lavender. Uma moça da administração de uma concessão rodoviária. Um barqueiro. Uma repórter. Um jornaleiro de esquina que conhece doze conselheiros de vista.',
    'Nenhuma dessas pessoas tem poder. Todas elas têm uma cópia de alguma coisa.',
    'Leva onze anos.',
    'Não existe um momento de virada, não existe uma manchete, não existe um dia em que tudo muda. Existem onze anos de gente comum guardando papel e passando adiante, até a pilha ficar grande demais pra caber numa gaveta.',
    'A comissão parlamentar de inquérito é instalada numa quarta-feira de setembro.',
    'Você tem vinte e seis anos e está sentad{o|a} na galeria, no meio do público, sem crachá nenhum.',
    'E quando o relator lê a lista de pessoas que contribuíram com documentação, ele leva dezenove minutos, porque são cento e quarenta e um nomes.',
    'O seu é um deles. É o de número oitenta e três, em ordem alfabética.',
    'É exatamente o tamanho que tinha que ter.'
  ]}
}

}, [
  {de:'c21_esperou_na_porta', para:'c26_aceitou_o_posto', texto:'Entrar quando chamarem.'},
  {de:'c21_saguao', para:'c26_aceitou_o_posto', texto:'Subir. Já é quase catorze.'},
  {de:'c21_refeitorio', para:'c26_aceitou_o_posto', texto:'Subir pra reunião.'}
]);
