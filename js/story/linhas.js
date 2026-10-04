/* ============================================================
   LINHAS — a história anda em cima do que você virou
   A linha é o lado em que você está: o posto de maior peso que você
   assinou (Patrulha e Polícia são a Lei; o envelope sem timbre é a
   Rocket; o Laboratório é a Ciência…) ou, sem posto, a via — o jeito
   que Kanto passou a te enxergar (herói, mercenário, foragido).

   Na virada de capítulo, quem é da sua linha te acha: uma cena curta,
   com escolha e consequência. As cenas de uma linha vêm em ordem e
   lembram o que você fez na anterior. Trocou de linha no meio? A
   primeira coisa que acontece é a linha antiga reagindo a isso (a
   virada); depois a nova começa do começo, porque lá você é
   {novato|novata}.

   Nada aqui diz o que vai acontecer. Cada cena é o que está na frente
   de você agora.
   ============================================================ */

const LINHA_DO_CARGO = {
  guarda_rota:'lei', policial:'lei', investigador:'lei', comissao:'lei',
  rocket:'rocket',
  auxiliar:'ciencia', pesquisador:'ciencia', professor:'ciencia',
  reporter:'imprensa',
  criador:'criacao',
  instrutor:'liga', lider:'liga', elite:'liga', conselheiro:'liga'
};
const LINHA_DA_VIA = {heroi:'heroi', mercenario:'mercenario', foragido:'foragido', pesquisador:'ciencia'};
const NOME_DA_LINHA = {
  lei:'Patrulha de Kanto', rocket:'sem timbre', ciencia:'Laboratório de Pallet', imprensa:'Jornal de Fuchsia',
  criacao:'Associação de Criadores', liga:'Liga Pokémon', heroi:'quem precisa de ajuda',
  mercenario:'quem paga', foragido:'quem te esconde'
};

function linhaAtual(d){
  d = d || Estado.dados;
  if (!d) return null;
  if (typeof Cargos !== 'undefined'){
    let melhor = null;
    for (const id of Cargos.lista()){
      const c = Cargos.porId(id);
      if (c && LINHA_DO_CARGO[id] && (!melhor || c.peso > melhor.peso)) melhor = c;
    }
    if (melhor) return LINHA_DO_CARGO[melhor.id];
  }
  return LINHA_DA_VIA[d.via] || null;
}

/* ============================================================
   AS CENAS. cap é o capítulo mínimo; quem é o rótulo de quem fala.
   ============================================================ */
const CENAS_DE_LINHA = {

/* ---------------- LEI ---------------- */
lei:[
{
  cap:5, titulo:'A primeira ronda', quem:'o sargento de Viridian',
  texto:d => [
    `Na saída da cidade tem um Tauros parado no meio da estrada, de lado, bufando, e uma fila de carroça esperando.`,
    d2 => { Nomes.apresentar('o sargento de Viridian'); return `O sargento que te deu o colete está lá, de braço cruzado. No bolso do uniforme, bordado torto: HOLT.`; },
    fala('o sargento de Viridian', `Sem dono, sem marca, sem pressa. O regulamento manda chamar o controle de Pokémon e esperar.`),
    fala('o sargento de Viridian', `O controle leva quatro horas pra chegar. O regulamento não fala nada sobre as quatro horas.`, 'baixo')
  ],
  escolhas:[
    {texto:`Esperar o controle com ele, pelo regulamento.`,
     ef:{flag:'ln_lei_regra', rep:{eixo:'bom', delta:1, motivo:'Segurou uma estrada pelo regulamento, quatro horas'}},
     resultado:[`Vocês esperam. O Tauros deita no asfalto na segunda hora e dorme na terceira.`,
       fala('o sargento de Viridian', `Chato, né. É isso que é. Quem aguenta o chato é quem fica.`)]},
    {texto:`Mandar o seu time abrir caminho devagar e levar o Tauros pro pasto.`,
     ef:{flag:'ln_lei_jeito', moral:3, rep:{eixo:'bom', delta:1, motivo:'Desfez um bloqueio na estrada com o próprio time'}},
     resultado:[`Leva vinte minutos e um empurrão de ombro. O Tauros entra no pasto achando que a ideia foi dele.`,
       fala('o sargento de Viridian', `Eu não vi nada disso. Vou escrever que resolveu sozinho.`, 'riso')]},
    {texto:`Dizer que hoje não dá e seguir viagem.`,
     ef:{flag:'ln_lei_seguiu'},
     resultado:[fala('o sargento de Viridian', `Vai. O colete não é corrente.`), `Ele não olha pra você de novo enquanto você passa pela fila.`]}
  ]
},
{
  cap:9, titulo:'O relatório', quem:'o sargento de Viridian',
  texto:d => [
    `O PokéNav apita com uma foto de um formulário de três folhas.`,
    d.flags.ln_lei_jeito
      ? fala('o sargento de Viridian', `Lembra do Tauros? Agora é uma briga de treinador numa ponte. Você estava lá, você assina como testemunha.`)
      : fala('o sargento de Viridian', `Briga de treinador na ponte, você estava lá. Testemunha assina.`),
    `Você lê. Diz que o rapaz que começou a briga "reagiu a uma provocação". Você viu. Não teve provocação.`,
    `O rapaz é filho do dono da maior criação de Ponyta da região, e isso está escrito numa folha que não devia estar grampeada junto.`
  ],
  escolhas:[
    {texto:`Assinar como está.`,
     ef:{flag:'ln_lei_assinou', dinheiro:300, rep:{eixo:'ruim', delta:1, motivo:'Assinou um relatório que você sabia que estava torto'}},
     resultado:[`Trezentos caem na sua conta no fim do dia, como "diária de testemunha". Ninguém te avisou que existia diária.`]},
    {texto:`Riscar a frase e escrever o que você viu.`,
     ef:{flag:'ln_lei_corrigiu', rep:{eixo:'bom', delta:2, motivo:'Corrigiu um relatório de próprio punho'}},
     resultado:[fala('o sargento de Viridian', `Você riscou.`), fala('o sargento de Viridian', `Tá. Eu protocolo assim. Vai dar problema, e o problema vai ser meu, e tudo bem.`, 'baixo')]},
    {texto:`Assinar e guardar uma foto da página de baixo.`,
     ef:{flag:['ln_lei_assinou', 'ln_lei_copia'], rep:{eixo:'ruim', delta:1, motivo:'Assinou e guardou a prova'}},
     resultado:[`Você assina. A foto fica no fundo da galeria do PokéNav, entre uma de Pidgey e uma de nuvem.`]}
  ]
},
{
  cap:14, titulo:'O posto da rota', quem:'o sargento de Viridian',
  texto:d => [
    `Você está de plantão na guarita quando chega um menino de uns doze anos, sem licença, carregando um Nidoran no colo enrolado numa toalha.`,
    `O Nidoran respira rápido e curto. O Centro mais perto fica depois do posto.`,
    d.flags.ln_lei_corrigiu
      ? fala('o sargento de Viridian', `Desde o relatório da ponte me mandam pros postos que ninguém quer. Te mandaram junto. Faz o que você acha.`)
      : fala('o sargento de Viridian', `Sem licença não passa. Isso não sou eu falando, é a placa.`)
  ],
  escolhas:[
    {texto:`Abrir a cancela e deixar o menino passar correndo.`,
     ef:{flag:'ln_lei_deixou', rep:{eixo:'bom', delta:1, motivo:'Abriu a cancela pra um Pokémon ferido'}},
     resultado:[`Ele passa sem agradecer, que é o certo: não tinha tempo pra isso.`,
       fala('o sargento de Viridian', `Eu assino o livro. Se perguntarem, fui eu.`, 'baixo')]},
    {texto:`Segurar o menino e chamar a enfermeira pelo rádio.`,
     ef:{flag:'ln_lei_segurou', rep:{eixo:'bom', delta:1, motivo:'Chamou socorro sem abrir a cancela'}},
     resultado:[`A enfermeira chega de bicicleta em quinze minutos. O Nidoran aguenta os quinze minutos. O menino não te olha durante nenhum deles.`]},
    {texto:`Pegar o Nidoran e levar você mesm{o|a} até o Centro.`,
     ef:{flag:'ln_lei_levou', moral:2, rep:{eixo:'bom', delta:2, motivo:'Largou o posto pra levar um Pokémon ferido ao Centro'}},
     resultado:[`Você corre. O posto fica sem ninguém por quarenta minutos, e no livro da guarita esses quarenta minutos ficam em branco.`]}
  ]
}
],

/* ---------------- ROCKET ---------------- */
rocket:[
{
  cap:8, titulo:'O primeiro pedido', quem:'a voz do outro lado',
  texto:d => [
    `O aparelho que veio no envelope toca. Número nenhum na tela.`,
    fala('a voz do outro lado', `Nada difícil. Quantas pessoas ficam no Centro daqui depois das dez da noite?`),
    fala('a voz do outro lado', `Só o número. A gente não pergunta o que você faz com o seu dia.`, 'frio')
  ],
  escolhas:[
    {texto:`Contar quantas são.`,
     ef:{flag:'ln_rocket_contou', dinheiro:600, rep:{eixo:'ruim', delta:1, motivo:'Contou gente pra quem não devia'}},
     resultado:[fala('a voz do outro lado', `Obrigado.`), `Seiscentos aparecem na sua conta. O extrato diz "reembolso".`]},
    {texto:`Dar um número errado de propósito.`,
     ef:{flag:'ln_rocket_mentiu', dinheiro:600},
     resultado:[`Você diz onze. Eram três.`, fala('a voz do outro lado', `Onze. Anotado.`), `O dinheiro cai igual. Isso incomoda mais do que se não caísse.`]},
    {texto:`Não responder e desligar.`,
     ef:{flag:'ln_rocket_calou'},
     resultado:[`O aparelho toca de novo um minuto depois. Uma vez só.`, fala('a voz do outro lado', `Silêncio também é resposta. Anotado.`)]}
  ]
},
{
  cap:12, titulo:'A caixa', quem:'a voz do outro lado',
  texto:d => [
    `Uma caixa de papelão lacrada te espera no guarda-volumes da estação, no seu nome. Leve, mas não vazia.`,
    `Dentro, alguma coisa muda de lugar quando você levanta.`,
    fala('a voz do outro lado', `Entrega na saída leste da cidade. Não abre. Abrir não muda o que tem dentro e muda o que a gente acha de você.`)
  ],
  escolhas:[
    {texto:`Entregar sem abrir.`,
     ef:{flag:'ln_rocket_entregou', dinheiro:900, rep:{eixo:'ruim', delta:2, motivo:'Entregou uma caixa que se mexia'}},
     resultado:[`Quem recebe é um rapaz de boné que conta o dinheiro na sua frente e não diz nada.`, `A caixa fez um barulho baixinho quando trocou de mão.`]},
    {texto:`Abrir. Dentro, um Vulpix de olho tapado com pano. Soltar.`,
     ef:{flag:'ln_rocket_soltou', moral:4, rep:{eixo:'bom', delta:1, motivo:'Abriu a caixa e soltou o Vulpix'}},
     resultado:[`O Vulpix fica parado meio minuto, cheirando o ar, e depois some no mato sem olhar pra trás.`,
       `A caixa vazia você entrega assim mesmo. O rapaz de boné olha pra dentro, olha pra você e vai embora sem pagar.`]},
    {texto:`Entregar, mas abrir um furo de ar no papelão antes.`,
     ef:{flag:['ln_rocket_entregou', 'ln_rocket_furo'], dinheiro:900, rep:{eixo:'ruim', delta:1, motivo:'Entregou a caixa com um furo de ar'}},
     resultado:[`Um furo do tamanho de uma moeda, com a ponta da chave. Do lado de dentro, alguma coisa encosta o focinho nele.`]}
  ]
},
{
  cap:17, titulo:'O lugar à mesa', quem:'a voz do outro lado',
  texto:d => [
    d.flags.ln_rocket_soltou
      ? fala('a voz do outro lado', `A caixa chegou vazia. A gente achou isso interessante, não ruim. Quem pensa é útil.`)
      : fala('a voz do outro lado', `Você entrega o que pedem e não pergunta. Isso está ficando raro.`),
    fala('a voz do outro lado', `Tem um lugar. Uniforme, número, gente que responde a você. Você deixa de ser informante e passa a ser alguém.`),
    `Pela janela do Centro você vê dois policiais tomando café. Um deles você já viu de colete numa guarita.`
  ],
  escolhas:[
    {texto:`Aceitar o lugar.`,
     ef:{flag:'ln_rocket_dentro', dinheiro:1500, rep:{eixo:'ruim', delta:3, motivo:'Aceitou um lugar dentro'}},
     resultado:[fala('a voz do outro lado', `Bem-vind{o|a}. Amanhã alguém te entrega o resto.`), `Você desliga e o café dos policiais ainda está fumegando.`]},
    {texto:`Aceitar, e atravessar a rua pra falar com os policiais.`,
     ef:{flag:['ln_rocket_dentro', 'ln_rocket_duplo'], rep:{eixo:'bom', delta:2, motivo:'Começou a passar informação pra polícia de dentro'}},
     resultado:[`O policial ouve sem levantar os olhos do copo.`, `"Continua lá dentro", ele diz. "Liga desse número. Só desse."`]},
    {texto:`Pedir pra sair.`,
     ef:{flag:'ln_rocket_pediu_saida', executar:d => { if (typeof Cargos !== 'undefined' && Cargos.tem('rocket')) Cargos.largar('rocket'); return [{tipo:'info', texto:'O aparelho do envelope para de funcionar no dia seguinte.'}]; }},
     resultado:[fala('a voz do outro lado', `Ninguém sai. A gente só para de ligar.`, 'frio'), `E para.`]}
  ]
}
],

/* ---------------- CIÊNCIA ---------------- */
ciencia:[
{
  cap:3, titulo:'A primeira nota de campo', quem:'Professor Oak',
  texto:d => [
    `O PokéNav recebe uma mensagem longa, sem parágrafo, de quem digita com dois dedos.`,
    fala('Professor Oak', `Preciso de uma nota de campo daí. Qualquer espécie. O que ela come, a que horas sai, com quem anda.`),
    fala('Professor Oak', `Nota boa é a que outra pessoa consegue repetir. Nota ruim é a que só você entende.`)
  ],
  escolhas:[
    {texto:`Passar a tarde olhando um ninho de Pidgey e anotar tudo, com hora.`,
     ef:{flag:'ln_ciencia_nota_boa', rep:{eixo:'bom', delta:1, motivo:'Mandou ao laboratório uma nota de campo que dá pra repetir'}},
     resultado:[`Duas páginas. A mãe sai às seis e quarenta, volta às sete e dez, sai de novo. Você anota as sete voltas.`,
       fala('Professor Oak', `Sete voltas. Isso é ciência. O resto é palpite bem escrito.`)]},
    {texto:`Escrever o que você sentiu vendo o lugar.`,
     ef:{flag:'ln_ciencia_nota_sentida'},
     resultado:[fala('Professor Oak', `Não serve pra tabela nenhuma.`), fala('Professor Oak', `Guardei assim mesmo. Não conta pra ninguém que eu guardo essas.`, 'riso')]}
  ]
},
{
  cap:8, titulo:'A amostra', quem:'Professor Oak',
  texto:d => [
    `Uma caixinha de vidro chega pela perua do laboratório, com etiqueta: MUDA DE PELE — ARBOK — SE ACHAR.`,
    `Na beira da trilha você acha: uma pele inteira de Ekans, recém-largada, ainda com o desenho do rosto.`,
    `Na mesma pedra, um Ekans enrolado no sol, de olho em você.`
  ],
  escolhas:[
    {texto:`Esperar ele ir embora e pegar só a pele.`,
     ef:{flag:'ln_ciencia_amostra', rep:{eixo:'bom', delta:1, motivo:'Coletou uma amostra sem incomodar o dono'}},
     resultado:[`Ele vai embora em quarenta minutos. Você pega a pele com as duas mãos, como quem segura papel molhado.`]},
    {texto:`Pegar a pele e vender metade pro colecionador da cidade.`,
     ef:{flag:['ln_ciencia_amostra', 'ln_ciencia_vendeu'], dinheiro:700, rep:{eixo:'ruim', delta:1, motivo:'Vendeu metade da amostra do laboratório'}},
     resultado:[`O colecionador paga setecentos sem pechinchar. Pro laboratório vai a metade com a cabeça, que é a que mostra menos.`]},
    {texto:`Deixar a pele onde está.`,
     ef:{flag:'ln_ciencia_deixou'},
     resultado:[`O Ekans desenrola, passa por cima da pele velha e vai embora. Fica pra próxima chuva.`]}
  ]
},
{
  cap:14, titulo:'O dado que não fecha', quem:'Professor Oak',
  texto:d => [
    `Nas suas notas tem um Pokémon morando onde o livro do laboratório diz que ele não mora. Três vezes, em três dias.`,
    `O livro é do Professor. Está na segunda edição.`,
    d.flags.ln_ciencia_nota_boa
      ? `Você tem hora e lugar das três vezes, do jeito que ele te ensinou a anotar.`
      : `Você tem o lugar das três vezes. A hora você não anotou.`
  ],
  escolhas:[
    {texto:`Mandar as notas pro Professor do jeito que estão.`,
     ef:{flag:'ln_ciencia_corrigiu', rep:{eixo:'bom', delta:2, motivo:'Mostrou que o livro do laboratório estava errado'}},
     resultado:[fala('Professor Oak', `Errado. Eu estava errado na segunda edição.`), fala('Professor Oak', `Faz trinta anos que ninguém me escreve isso. Obrigado.`, 'baixo')]},
    {texto:`Guardar as notas. Não é hora de envergonhar ninguém.`,
     ef:{flag:'ln_ciencia_guardou'},
     resultado:[`O caderno vai pro fundo da mochila. Na quarta vez que você vê o Pokémon onde ele não devia estar, você não anota.`]}
  ]
}
],

/* ---------------- IMPRENSA ---------------- */
imprensa:[
{
  cap:7, titulo:'A pauta', quem:'a editora do Jornal',
  texto:d => [
    d2 => { Nomes.apresentar('a editora do Jornal'); return `O PokéNav mostra o nome da editora em maiúscula, como ela assina: HAZEL MOSS.`; },
    fala('a editora do Jornal', `Trezentas palavras sobre o que estiver acontecendo aí. Até amanhã às seis.`),
    `O que está acontecendo aqui é uma feira de Pokémon de troca na praça, com uma barraca que vende Magikarp "que já evoluiu duas vezes".`
  ],
  escolhas:[
    {texto:`Escrever exatamente o que você viu, barraca incluída.`,
     ef:{flag:'ln_imprensa_seco', rep:{eixo:'bom', delta:1, motivo:'Publicou o que viu, sem enfeite'}},
     resultado:[fala('a editora do Jornal', `Seco. Bom. A barraca já foi fechada, aliás. Isso é jornal.`)]},
    {texto:`Exagerar um pouco pra vender.`,
     ef:{flag:'ln_imprensa_exagerou', dinheiro:400},
     resultado:[`Sai na página dois com o título "GOLPE DO MAGIKARP DOURADO". O Magikarp não era dourado.`, fala('a editora do Jornal', `Vendeu. Não repete.`, 'frio')]},
    {texto:`Antes de escrever, conversar com o dono da barraca.`,
     ef:{flag:'ln_imprensa_ouviu', moral:1, rep:{eixo:'bom', delta:1, motivo:'Ouviu o outro lado antes de escrever'}},
     resultado:[`Ele diz que comprou os Magikarp de um sujeito que garantiu. Mostra o recibo. O recibo vai pra matéria junto.`]}
  ]
},
{
  cap:11, titulo:'A fonte', quem:'a editora do Jornal',
  texto:d => [
    `Alguém deixa um bilhete debaixo da sua porta no Centro: uma criação perto daqui estaria vendendo Pokémon doente como saudável.`,
    `Sem assinatura. Com endereço.`,
    fala('a editora do Jornal', d.flags.ln_imprensa_exagerou ? `Dessa vez com prova. Da outra vez eu paguei a correção.` : `Bilhete sem nome é começo, não é matéria.`)
  ],
  escolhas:[
    {texto:`Ir ao endereço e ver com os próprios olhos.`,
     ef:{flag:'ln_imprensa_foi', rep:{eixo:'bom', delta:1, motivo:'Foi conferir uma denúncia antes de publicar'}},
     resultado:[`Os Pokémon estão magros e a ração está vencida há três meses. O dono te expulsa com o rodo na mão. Você já tinha visto o bastante.`]},
    {texto:`Publicar a denúncia como chegou.`,
     ef:{flag:'ln_imprensa_publicou_cru', dinheiro:500, rep:{eixo:'ruim', delta:1, motivo:'Publicou um bilhete sem nome'}},
     resultado:[`A matéria sai. No dia seguinte a criação está fechada, e no outro uma criação errada, do mesmo nome, na cidade vizinha, também.`]},
    {texto:`Levar o bilhete à polícia antes de publicar.`,
     ef:{flag:'ln_imprensa_policia'},
     resultado:[`O policial lê, dobra e guarda. "Agradecido", ele diz, de um jeito que quer dizer que você não vai saber o resto.`]}
  ]
},
{
  cap:16, titulo:'O pedido', quem:'a filha do criador',
  texto:d => [
    `Uma moça te espera na porta do Centro. É filha do criador da matéria.`,
    fala('a filha do criador', `Meu pai errou. Eu sei. Mas se sair a segunda parte, ele perde a casa, e os Pokémon que sobraram vão junto.`),
    fala('a filha do criador', `Eu tô cuidando deles agora. Pode ir lá ver.`, 'baixo')
  ],
  escolhas:[
    {texto:`Ir ver. Se estiver como ela diz, segurar a segunda parte.`,
     ef:{flag:'ln_imprensa_segurou', moral:2, rep:{eixo:'bom', delta:1, motivo:'Segurou uma matéria pra ver o que tinha mudado'}},
     resultado:[`Os Pokémon estão comendo. A ração é nova. Ela pintou o cercado sozinha, dá pra ver pelos pingos.`,
       fala('a editora do Jornal', `Você segurou a segunda parte. Tá. Eu também teria. Não conta pra ninguém.`)]},
    {texto:`Publicar a segunda parte. O que aconteceu, aconteceu.`,
     ef:{flag:'ln_imprensa_publicou', dinheiro:600, rep:{eixo:'ruim', delta:1, motivo:'Publicou mesmo com o pedido'}},
     resultado:[`Ela lê no Centro, na sua frente, e dobra o jornal em quatro com muito cuidado antes de ir embora.`]}
  ]
}
],

/* ---------------- CRIAÇÃO ---------------- */
criacao:[
{
  cap:6, titulo:'A visita', quem:'a avaliadora da Associação',
  texto:d => [
    d2 => { Nomes.apresentar('a avaliadora da Associação'); return `A avaliadora chega sem avisar, que é como ela avisa. Na prancheta, presa com elástico: SRA. LINDEN.`; },
    fala('a avaliadora da Associação', `Vim ver o time. Não as batalhas, o time: pata, pelo, dente, sono.`),
    d2 => { const p = (d2.time || [])[0]; return p ? `Ela se agacha na frente de ${nomeExib(p)} e espera ${pron(p).o} se aproximar, em vez de se aproximar.` : 'Ela se agacha e espera.'; }
  ],
  escolhas:[
    {texto:`Mostrar tudo, inclusive o que você ainda não resolveu.`,
     ef:{flag:'ln_criacao_mostrou', rep:{eixo:'bom', delta:1, motivo:'Mostrou o time inteiro pra avaliadora, com os defeitos'}},
     resultado:[fala('a avaliadora da Associação', `Criador bom não é o que não tem problema. É o que me mostra o problema primeiro.`)]},
    {texto:`Mostrar só os que estão bem.`,
     ef:{flag:'ln_criacao_escondeu'},
     resultado:[`Ela anota alguma coisa e vira a folha antes de você conseguir ler.`]}
  ]
},
{
  cap:10, titulo:'A ninhada da feira', quem:'a avaliadora da Associação',
  texto:d => [
    `Na feira, um criador sem selo vende Growlithe filhote em caixa de fruta, cinco por caixa, a preço de Potion.`,
    `Dois deles estão com o olho remelento.`,
    fala('a avaliadora da Associação', `Eu não posso fazer nada. Ele não é associado. Você é.`, 'baixo')
  ],
  escolhas:[
    {texto:`Comprar os dois doentes e levar ao Centro.`,
     ef:{flag:'ln_criacao_comprou', dinheiro:-400, moral:3, rep:{eixo:'bom', delta:1, motivo:'Comprou os filhotes doentes pra tratar'}},
     resultado:[`O Centro trata os dois em uma tarde. Um volta com o criador da feira, que veio buscar com a cara mais lavada do mundo. O outro fica com a enfermeira.`]},
    {texto:`Denunciar à Associação, com foto.`,
     ef:{flag:'ln_criacao_denunciou', rep:{eixo:'bom', delta:1, motivo:'Denunciou uma criação sem selo'}},
     resultado:[fala('a avaliadora da Associação', `Com foto vira processo. Sem foto vira conversa. Obrigada pela foto.`)]},
    {texto:`Não é problema seu.`,
     ef:{flag:'ln_criacao_passou'},
     resultado:[`Você passa pela barraca. Um dos filhotes espirra quando você passa, e você ouve.`]}
  ]
},
{
  cap:15, titulo:'O selo', quem:'a avaliadora da Associação',
  texto:d => [
    fala('a avaliadora da Associação', d.flags.ln_criacao_mostrou ? `A Associação quer te dar o selo regional. Eu indiquei. Por causa daquele dia que você me mostrou o problema primeiro.` : `A Associação quer te dar o selo regional. Eu não indiquei. Também não vetei.`),
    fala('a avaliadora da Associação', `Com selo, você assina laudo. Laudo vale dinheiro. Tem gente que vai querer comprar a sua assinatura.`)
  ],
  escolhas:[
    {texto:`Aceitar o selo.`,
     ef:{flag:'ln_criacao_selo', dinheiro:800, rep:{eixo:'bom', delta:1, motivo:'Recebeu o selo regional de criação'}},
     resultado:[`O selo é um carimbo de metal pesado que fica numa bolsinha de pano. Você guarda no bolso de dentro da mochila.`]},
    {texto:`Recusar. Você ainda não sabe o bastante.`,
     ef:{flag:'ln_criacao_recusou_selo', rep:{eixo:'bom', delta:2, motivo:'Recusou um selo por achar que não sabia o bastante'}},
     resultado:[fala('a avaliadora da Associação', `É a primeira vez que alguém recusa.`), fala('a avaliadora da Associação', `Eu também recusei, da primeira vez.`, 'riso')]}
  ]
}
],

/* ---------------- LIGA ---------------- */
liga:[
{
  cap:20, titulo:'A turma da manhã', quem:'a coordenadora da quadra',
  texto:d => [
    d2 => { Nomes.apresentar('a coordenadora da quadra'); return `A coordenadora te espera na quadra de treino, de agasalho da Liga. Na pasta, em letra de máquina: COORDENADORA MAPLE.`; },
    fala('a coordenadora da quadra', `Doze crianças, sete anos cada, nenhuma com licença. Os pais pagaram a aula. Você dá.`),
    `Na primeira fila, um menino segura um Caterpie como quem segura um troféu.`
  ],
  escolhas:[
    {texto:`Ensinar a cuidar antes de ensinar a lutar.`,
     ef:{flag:'ln_liga_cuidar', moral:2, rep:{eixo:'bom', delta:1, motivo:'Ensinou a cuidar antes de ensinar a lutar'}},
     resultado:[`A aula é sobre água, sombra e sono. Ninguém luta. O menino do Caterpie aprende a ver se a folha está fresca.`]},
    {texto:`Dar a aula que os pais pagaram: tática.`,
     ef:{flag:'ln_liga_tatica', dinheiro:500},
     resultado:[`As crianças decoram três combinações de tipo e saem gritando "superefetivo" no estacionamento.`]}
  ]
},
{
  cap:24, titulo:'O desafiante', quem:'a coordenadora da quadra',
  texto:d => [
    `Um desafiante aparece com um Pokémon que segura um item que não está na lista oficial. Pequeno, escondido na pata.`,
    fala('a coordenadora da quadra', `O patrocinador do torneio é o pai dele. Você é quem confere o equipamento. Confere.`)
  ],
  escolhas:[
    {texto:`Mandar tirar o item, como manda a regra.`,
     ef:{flag:'ln_liga_regra', rep:{eixo:'bom', delta:2, motivo:'Fez cumprir a regra do torneio contra o filho do patrocinador'}},
     resultado:[`O desafiante tira. Perde na segunda rodada. O pai dele não aplaude ninguém.`]},
    {texto:`Deixar passar.`,
     ef:{flag:'ln_liga_deixou', dinheiro:1000, rep:{eixo:'ruim', delta:2, motivo:'Deixou passar um item proibido'}},
     resultado:[`Ele ganha duas rodadas. No fim do dia, um envelope com o logotipo do patrocinador aparece no seu armário.`]}
  ]
},
{
  cap:27, titulo:'A votação', quem:'a coordenadora da quadra',
  texto:d => [
    `A Liga vota se treinador de dez anos pode sair sozinho em jornada ou só a partir dos doze.`,
    fala('a coordenadora da quadra', d.flags.ln_liga_cuidar ? `Você deu aula pra criança de sete. Você sabe o que é uma criança de dez. Seu voto vale.` : `Seu voto vale um. Igual ao meu. Igual ao de todo mundo aqui.`),
    `Lá fora tem fila de criança com Pokémon no colo, esperando pra ver o resultado.`
  ],
  escolhas:[
    {texto:`Votar pelos dez anos, como sempre foi.`,
     ef:{flag:'ln_liga_dez', rep:{eixo:'bom', delta:1, motivo:'Votou pela jornada aos dez anos'}},
     resultado:[`Passa por um voto. A fila lá fora grita quando sai a placa.`]},
    {texto:`Votar pelos doze.`,
     ef:{flag:'ln_liga_doze', rep:{eixo:'bom', delta:1, motivo:'Votou pela jornada aos doze anos'}},
     resultado:[`Passa por um voto. A fila lá fora fica em silêncio, e uma menina chora sem barulho.`]}
  ]
}
],

/* ---------------- HERÓI ---------------- */
heroi:[
{
  cap:3, titulo:'Quem pede', quem:'a senhora do portão',
  texto:d => [
    `Uma senhora te para no portão da cidade, porque você tem cara de quem ajuda e porque não tem mais ninguém na rua.`,
    fala('a senhora do portão', `O meu Meowth subiu na caixa d'água e não desce. Faz dois dias. Eu levo comida, ele não desce.`)
  ],
  escolhas:[
    {texto:`Subir na caixa d'água.`,
     ef:{flag:'ln_heroi_subiu', moral:2, rep:{eixo:'bom', delta:1, motivo:'Subiu numa caixa d’água pra buscar o Meowth de alguém'}},
     resultado:[`O Meowth te arranha duas vezes e desce no seu ombro na terceira. A senhora chora e te dá um pote de doce de leite.`]},
    {texto:`Mandar o seu Pokémon mais leve subir.`,
     ef:{flag:'ln_heroi_time', moral:3, rep:{eixo:'bom', delta:1, motivo:'Mandou o time buscar o Meowth de alguém'}},
     resultado:[`Os dois descem juntos. O Meowth fica do lado do seu Pokémon o resto da tarde, como se tivessem combinado.`]}
  ]
},
{
  cap:8, titulo:'Todo mundo sabe', quem:'o rapaz da mercearia',
  texto:d => [
    `Na entrada da cidade tem três pessoas esperando por você. Você não conhece nenhuma.`,
    fala('o rapaz da mercearia', `Falaram que você ajuda. Meu Pidgey sumiu, a escada da dona Rita quebrou e o poço da praça tá com um Psyduck preso.`),
    `É um dia inteiro de coisa pequena.`
  ],
  escolhas:[
    {texto:`Fazer as três coisas.`,
     ef:{flag:'ln_heroi_tudo', moral:2, rep:{eixo:'bom', delta:2, motivo:'Passou um dia inteiro resolvendo coisa pequena de desconhecido'}},
     resultado:[`Escurece quando você termina. O Pidgey estava no telhado da mercearia o tempo todo.`]},
    {texto:`Escolher uma e dizer não pras outras duas.`,
     ef:{flag:'ln_heroi_escolheu', rep:{eixo:'bom', delta:1, motivo:'Ajudou no que dava e disse não pro resto'}},
     resultado:[`Você tira o Psyduck do poço. As outras duas pessoas vão embora sem reclamar, o que é pior do que se reclamassem.`]}
  ]
},
{
  cap:14, titulo:'O menino da fila', quem:'o menino do Caterpie',
  texto:d => [
    `Um menino te segue por três ruas, com um Caterpie no ombro, tomando coragem.`,
    fala('o menino do Caterpie', `Eu quero ser igual você. Você pode me dizer como?`),
    d.flags.ln_heroi_tudo ? `Você pensa no dia das três coisas pequenas, e em como as suas pernas doíam.` : `Você pensa no que você deixou de fazer, e em quem foi embora sem reclamar.`
  ],
  escolhas:[
    {texto:`"Faz o que tiver na sua frente. Depois o próximo."`,
     ef:{flag:'ln_heroi_conselho', rep:{eixo:'bom', delta:1, motivo:'Deu um conselho a quem queria ser igual a você'}},
     resultado:[`Ele repete em voz alta pra decorar. O Caterpie dele repete junto, do jeito dele.`]},
    {texto:`"Não seja igual a mim. Seja melhor."`,
     ef:{flag:'ln_heroi_melhor', moral:2},
     resultado:[`Ele fica sério de repente, como se tivesse recebido uma tarefa. Talvez tenha.`]}
  ]
}
],

/* ---------------- MERCENÁRIO ---------------- */
mercenario:[
{
  cap:3, titulo:'O primeiro serviço', quem:'o intermediário',
  texto:d => [
    `Um homem de chapéu se senta do seu lado no banco do Centro sem pedir licença.`,
    fala('o intermediário', `Escolta. Um comerciante de Moon Stone precisa atravessar a rota amanhã cedo. Paga bem. Não pergunta.`)
  ],
  escolhas:[
    {texto:`Aceitar.`,
     ef:{flag:'ln_merc_escolta', dinheiro:800},
     resultado:[`O comerciante não fala uma palavra a rota inteira. Paga na saída, em nota nova, contada duas vezes.`]},
    {texto:`Cobrar o dobro.`,
     ef:{flag:['ln_merc_escolta', 'ln_merc_dobro'], dinheiro:1600, rep:{eixo:'ruim', delta:1, motivo:'Cobrou o dobro por uma escolta'}},
     resultado:[fala('o intermediário', `O dobro.`), `Ele paga sem discutir. Isso quer dizer que o primeiro preço já era barato demais.`]}
  ]
},
{
  cap:8, titulo:'A cobrança', quem:'o intermediário',
  texto:d => [
    fala('o intermediário', d.flags.ln_merc_dobro ? `Gostei de você cobrar o dobro. Agora é cobrança. Um sujeito deve e não paga.` : `Agora é cobrança. Um sujeito deve e não paga.`),
    `O sujeito é um treinador velho, com um Machoke velho, numa casa sem cortina.`
  ],
  escolhas:[
    {texto:`Cobrar. Dívida é dívida.`,
     ef:{flag:'ln_merc_cobrou', dinheiro:1000, rep:{eixo:'ruim', delta:2, motivo:'Cobrou a dívida de um treinador velho'}},
     resultado:[`Ele paga com as economias de uma lata de biscoito. O Machoke fica olhando pra lata o tempo todo.`]},
    {texto:`Voltar e dizer que não achou ninguém.`,
     ef:{flag:'ln_merc_mentiu'},
     resultado:[fala('o intermediário', `Não achou.`), `Ele anota alguma coisa num caderninho preto que não tinha aparecido até agora.`]}
  ]
},
{
  cap:14, titulo:'O preço de verdade', quem:'o intermediário',
  texto:d => [
    fala('o intermediário', `Tem um serviço grande. Não é escolta, não é cobrança. É ficar parado num lugar, olhando pro outro lado, por uma hora.`),
    fala('o intermediário', `Paga o que você ganhou até agora, junto.`)
  ],
  escolhas:[
    {texto:`Aceitar.`,
     ef:{flag:'ln_merc_grande', dinheiro:3000, rep:{eixo:'ruim', delta:3, motivo:'Ficou uma hora olhando pro outro lado'}},
     resultado:[`É uma hora. Do outro lado, alguma coisa acontece num armazém. Você não olha. Era isso que pagaram.`]},
    {texto:`Recusar. Tem preço que não é preço.`,
     ef:{flag:'ln_merc_recusou', rep:{eixo:'bom', delta:1, motivo:'Recusou o serviço grande'}},
     resultado:[fala('o intermediário', `Todo mundo tem preço. O seu é que é diferente.`), `Ele levanta e esquece o chapéu no banco. De propósito, você acha.`]}
  ]
}
],

/* ---------------- FORAGIDO ---------------- */
foragido:[
{
  cap:3, titulo:'A pensão', quem:'a dona da pensão',
  texto:d => [
    d2 => { Nomes.apresentar('a dona da pensão'); return `Na porta da pensão, em tinta azul que já foi azul mais forte: PENSÃO BRIAR — QUARTO E CAFÉ.`; },
    fala('a dona da pensão', `Não pergunto nome, não pergunto de onde. Pergunto se paga.`),
    `Atrás dela, na parede, tem um mural de recados. Você conta três papéis com rosto.`
  ],
  escolhas:[
    {texto:`Pagar adiantado e não falar mais nada.`,
     ef:{flag:'ln_foragido_pagou', dinheiro:-200},
     resultado:[`Ela pega o dinheiro e te entrega uma chave de número rasurado. Ninguém bate na sua porta a noite inteira.`]},
    {texto:`Contar a sua história pra ela.`,
     ef:{flag:'ln_foragido_contou', moral:1},
     resultado:[fala('a dona da pensão', `Já ouvi pior.`), fala('a dona da pensão', `Já ouvi melhor também. Fica. Café é às seis.`, 'baixo')]}
  ]
},
{
  cap:8, titulo:'O papel no poste', quem:'a dona da pensão',
  texto:d => [
    `Tem um papel com um desenho parecido com você colado no poste da esquina. Parecido o bastante.`,
    d.flags.ln_foragido_contou
      ? fala('a dona da pensão', `Eu vi o papel. Vi também que o desenho errou o seu nariz. Usa isso.`)
      : fala('a dona da pensão', `Tem papel novo no poste. Não é da minha conta. Só tô falando.`)
  ],
  escolhas:[
    {texto:`Arrancar o papel.`,
     ef:{flag:'ln_foragido_arrancou', rep:{eixo:'ruim', delta:1, motivo:'Arrancou um aviso de procura do poste'}},
     resultado:[`Você arranca e amassa. No dia seguinte tem dois.`]},
    {texto:`Deixar. Cortar o cabelo diferente e seguir.`,
     ef:{flag:'ln_foragido_mudou'},
     resultado:[`Ninguém te olha duas vezes na rua. Isso é bom e é um pouco triste.`]}
  ]
},
{
  cap:14, titulo:'Quem te reconhece', quem:'o rapaz da estação',
  texto:d => [
    `Na estação, um rapaz te olha, olha o PokéNav dele, olha você de novo.`,
    fala('o rapaz da estação', `Eu sei quem você é. Eu não falo nada. Mas eu tô sem dinheiro, sabe.`, 'baixo')
  ],
  escolhas:[
    {texto:`Pagar.`,
     ef:{flag:'ln_foragido_pagou_silencio', dinheiro:-600},
     resultado:[`Ele conta o dinheiro e some no meio da gente. Você vai olhar pra trás em toda estação daqui pra frente.`]},
    {texto:`Encarar e dizer que ele pode falar o que quiser.`,
     ef:{flag:'ln_foragido_encarou', rep:{eixo:'bom', delta:1, motivo:'Não pagou pra ninguém ficar quieto'}},
     resultado:[`Ele hesita. Você entra no trem. Quando o trem sai, ele ainda está na plataforma, com o PokéNav na mão e sem ligar pra ninguém.`]}
  ]
}
]
};

/* ============================================================
   A SEGUNDA METADE — do capítulo 18 em diante
   Cada linha continua de onde parou, e o que você escolheu nas
   primeiras cenas muda o que as pessoas dela fazem agora.
   ============================================================ */
const MAIS_CENAS_DE_LINHA = {

lei:[
{
  cap:18, titulo:'O depósito', quem:'o sargento de Viridian',
  texto:d => [
    `O depósito da polícia de Saffron guarda Pokémon apreendido até alguém decidir o que fazer com eles. O livro de entrada tem onze nomes este mês. A baia tem oito Pokémon.`,
    fala('o sargento de Viridian', `Me mandaram conferir. Me mandaram conferir porque acham que fui eu.`, 'baixo'),
    d.flags.ln_lei_copia
      ? `Você lembra da foto no fundo do PokéNav, da folha que não devia estar grampeada. O nome do dono da criação de Ponyta aparece três vezes no livro de saída.`
      : `No livro de saída, três retiradas com a mesma letra e nenhum carimbo.`
  ],
  escolhas:[
    {texto:`Conferir o livro com ele, de noite, folha por folha.`,
     ef:{flag:'ln_lei_investigou', rep:{eixo:'bom', delta:2, motivo:'Passou a noite conferindo o livro do depósito com quem estava sob suspeita'}},
     resultado:[`Às três da manhã vocês têm as três assinaturas lado a lado. Nenhuma é a dele.`,
       fala('o sargento de Viridian', `Obrigado. Não pelo que achou. Por ter vindo.`)]},
    {texto:`Levar o que você sabe direto à delegada.`,
     ef:{flag:'ln_lei_delegada', rep:{eixo:'bom', delta:1, motivo:'Levou à delegada o que viu no depósito'}},
     resultado:[fala('a delegada de Saffron', `Você pulou o seu sargento.`), fala('a delegada de Saffron', `Fez certo. Ele ia te mandar fazer isso, e ia ficar com vergonha de mandar.`)]},
    {texto:`Ficar fora disso.`,
     ef:{flag:'ln_lei_fora'},
     resultado:[fala('o sargento de Viridian', `Tá. Eu entendo.`), `Ele não entende, e os dois sabem.`]}
  ]
},
{
  cap:22, titulo:'A ordem', quem:'o sargento de Viridian',
  texto:d => [
    `Chega uma ordem com carimbo azul: desocupar o acampamento de treinadores sem licença que cresceu debaixo da ponte da rota. Até o meio-dia.`,
    `São vinte e poucas barracas. Tem criança. Tem um Snorlax dormindo atravessado na entrada, que ninguém vai mover até meio-dia nenhum.`,
    fala('o sargento de Viridian', d.flags.ln_lei_jeito ? `Você resolveu um Tauros na estrada sem regulamento nenhum. Resolve isso.` : `O regulamento diz como. Não diz com que cara.`)
  ],
  escolhas:[
    {texto:`Cumprir a ordem, devagar, barraca por barraca, ajudando a carregar.`,
     ef:{flag:'ln_lei_cumpriu', rep:{eixo:'bom', delta:1, motivo:'Cumpriu uma ordem dura com as mãos ocupadas ajudando'}},
     resultado:[`Leva até as quatro da tarde. O meio-dia passou e ninguém reclamou, porque todo mundo estava carregando alguma coisa.`]},
    {texto:`Avisar o acampamento na véspera, e chegar no horário com o lugar já vazio.`,
     ef:{flag:'ln_lei_avisou', rep:{eixo:'bom', delta:2, motivo:'Avisou antes de cumprir a ordem'}},
     resultado:[`De manhã só sobrou o Snorlax. Alguém amarrou um bilhete na pata dele: "OBRIGADO, COLETE".`]},
    {texto:`Devolver a ordem sem cumprir.`,
     ef:{flag:'ln_lei_recusou_ordem', rep:{eixo:'ruim', delta:1, motivo:'Recusou uma ordem com carimbo azul'}},
     resultado:[fala('o sargento de Viridian', `Isso vai pra sua ficha.`), fala('o sargento de Viridian', `Vai pra minha também. Eu assino embaixo de você.`, 'baixo')]}
  ]
},
{
  cap:26, titulo:'O apito', quem:'o sargento de Viridian',
  texto:d => [
    `Holt te espera na guarita de Viridian, a primeira, sem colete.`,
    fala('o sargento de Viridian', `Trinta e um anos. Me aposentaram ontem, com bolo.`),
    d.flags.ln_lei_investigou
      ? fala('o sargento de Viridian', `Se não fosse aquela noite do livro, tinham me aposentado de outro jeito. Sem bolo.`, 'baixo')
      : fala('o sargento de Viridian', `Ninguém nunca soube direito quem tirou os Pokémon do depósito. Eu fiquei com essa.`, 'baixo'),
    `Ele estende o apito de metal, amassado de um lado.`
  ],
  escolhas:[
    {texto:`Aceitar o apito.`,
     ef:{flag:'ln_lei_apito', itens:{'Apito da patrulha':1}, rep:{eixo:'bom', delta:1, motivo:'Ficou com o apito de quem te ensinou a guarita'}},
     resultado:[fala('o sargento de Viridian', `Não sopra à toa. Ele tem um som só, e todo mundo da patrulha conhece.`)]},
    {texto:`Pedir que ele fique com o apito e venha tomar café na guarita de vez em quando.`,
     ef:{flag:'ln_lei_cafe', moral:2},
     resultado:[`Ele ri pela primeira vez desde que você conhece ele.`, fala('o sargento de Viridian', `Café de guarita é horrível. Eu venho.`, 'riso')]}
  ]
}
],

rocket:[
{
  cap:20, titulo:'O armazém', quem:'a voz do outro lado',
  texto:d => [
    `Te entregam um uniforme preto sem letra nenhuma e uma chave de armazém, perto do porto.`,
    `Dentro, gaiola em cima de gaiola. Growlithe, Ponyta, um Lapras filhote numa caixa d'água rasa demais.`,
    d.flags.ln_rocket_duplo
      ? `O PokéNav vibra no bolso com o número do policial do café. Uma mensagem só: "Foto."`
      : fala('a voz do outro lado', `Você vigia até amanhã. Ninguém entra, ninguém sai, nada sai.`, 'frio')
  ],
  escolhas:[
    {texto:`Fotografar as gaiolas e mandar pro policial.`,
     ef:{flag:'ln_rocket_foto', rep:{eixo:'bom', delta:2, motivo:'Mandou à polícia as fotos do armazém'}},
     resultado:[`Doze fotos. O PokéNav mostra "entregue" e depois mais nada a noite inteira.`]},
    {texto:`Trocar a água do Lapras e vigiar como mandaram.`,
     ef:{flag:'ln_rocket_vigiou', dinheiro:1200, rep:{eixo:'ruim', delta:1, motivo:'Vigiou o armazém'}},
     resultado:[`O Lapras te olha a noite inteira por cima da borda da caixa. De manhã, alguém leva todas as gaiolas e te paga na porta.`]},
    {texto:`Abrir a caixa do Lapras e deixar ele ir pelo cais.`,
     ef:{flag:'ln_rocket_lapras', moral:3, rep:{eixo:'bom', delta:2, motivo:'Soltou um Lapras filhote do armazém'}},
     resultado:[`Ele escorrega da plataforma pra água sem barulho nenhum. Lá fora, mais longe do que devia dar pra ouvir, um canto curto.`]}
  ]
},
{
  cap:24, titulo:'A lista', quem:'a voz do outro lado',
  texto:d => [
    d.flags.ln_rocket_lapras || d.flags.ln_rocket_soltou
      ? fala('a voz do outro lado', `Coisas somem quando você está de turno. A gente reparou.`, 'frio')
      : fala('a voz do outro lado', `Você tem sido correto. Correto é raro.`),
    fala('a voz do outro lado', `Queremos a lista de contatos do seu PokéNav. Só nome e número. É assim que a gente confia.`)
  ],
  escolhas:[
    {texto:`Mandar a lista.`,
     ef:{flag:'ln_rocket_lista', rep:{eixo:'ruim', delta:2, motivo:'Entregou a lista de contatos do PokéNav'}},
     resultado:[`Você manda. Por uma semana, toda ligação que você recebe começa com um segundo de silêncio a mais.`]},
    {texto:`Mandar uma lista inventada.`,
     ef:{flag:'ln_rocket_lista_falsa'},
     resultado:[`Quarenta nomes de rua de Celadon e números que não existem. A voz demora dois dias pra ligar de novo.`]},
    {texto:`Recusar.`,
     ef:{flag:'ln_rocket_recusou_lista', rep:{eixo:'bom', delta:1, motivo:'Recusou entregar quem confia em você'}},
     resultado:[fala('a voz do outro lado', `Anotado.`), `É a terceira vez que você ouve essa palavra dela, e é a primeira que ela soa cansada.`]}
  ]
},
{
  cap:27, titulo:'A voz tem rosto', quem:'a voz do outro lado',
  texto:d => [
    `Uma mulher de casaco cinza se senta na sua frente na lanchonete da estação e pede dois cafés. Você reconhece a voz no "dois".`,
    fala('a voz do outro lado', `Eu comecei como você. Contando gente no Centro de Vermilion.`),
    fala('a voz do outro lado', `Vim ver se você vai terminar como eu.`, 'baixo')
  ],
  escolhas:[
    {texto:`Perguntar por que ela nunca saiu.`,
     ef:{flag:'ln_rocket_perguntou'},
     resultado:[fala('a voz do outro lado', `Porque ninguém sai. A gente só para de ligar. Eu nunca parei.`), `Ela paga os dois cafés e deixa o dela inteiro.`]},
    {texto:`Dizer que entregou tudo à polícia e que ela tem dez minutos.`,
     ef:{flag:'ln_rocket_denunciou', rep:{eixo:'bom', delta:2, motivo:'Deu dez minutos a quem te recrutou'}, executar:d => { if (typeof Cargos !== 'undefined' && Cargos.tem('rocket')) Cargos.largar('rocket'); return []; }},
     resultado:[`Ela olha o relógio de parede. Levanta. Na porta, se vira.`, fala('a voz do outro lado', `Dez minutos é mais do que me deram.`)]},
    {texto:`Pedir um lugar mais alto.`,
     ef:{flag:'ln_rocket_subiu', dinheiro:2500, rep:{eixo:'ruim', delta:3, motivo:'Pediu pra subir'}},
     resultado:[fala('a voz do outro lado', `Então é assim que termina.`), `Ela empurra o café dela pra você e vai embora.`]}
  ]
}
],

ciencia:[
{
  cap:18, titulo:'O estagiário', quem:'o estagiário do laboratório',
  texto:d => [
    `O laboratório te manda um estagiário de catorze anos, com caderno novo e caneta de quatro cores.`,
    fala('o estagiário do laboratório', `O Professor disse que você anota direito e que era pra eu aprender com você.`),
    d.flags.ln_ciencia_nota_boa ? `Você lembra das sete voltas do Pidgey.` : `Você lembra que, da primeira vez, escreveu o que sentiu.`
  ],
  escolhas:[
    {texto:`Ensinar a anotar hora e lugar antes de qualquer coisa.`,
     ef:{flag:'ln_ciencia_ensinou', rep:{eixo:'bom', delta:1, motivo:'Ensinou um estagiário a anotar'}},
     resultado:[`No fim da semana o caderno dele tem uma coluna de hora em cada página, e ele usa as quatro cores pra separar dia, tarde, noite e "não sei".`]},
    {texto:`Deixar ele olhar sozinho e anotar do jeito dele.`,
     ef:{flag:'ln_ciencia_soltou_estagiario', moral:1},
     resultado:[`Ele volta com um desenho de Oddish andando de noite que ninguém no laboratório tinha. Sem hora. Com a lua.`]}
  ]
},
{
  cap:23, titulo:'A cor errada', quem:'Professor Oak',
  texto:d => [
    `No fundo de uma trilha você vê um Pokémon de uma cor que não é a dele. A Pokédex apita duas vezes e escreve: ANOMALIA CROMÁTICA.`,
    `Ninguém mais viu. O lugar é pequeno, e quem souber vai vir com Pokébola.`,
    fala('Professor Oak', d.flags.ln_ciencia_corrigiu ? `Você já me corrigiu uma vez. Me diz onde, que eu confio no seu mapa.` : `Se você souber de alguma coisa rara, me fala primeiro. Primeiro.`)
  ],
  escolhas:[
    {texto:`Mandar o lugar só pro Professor, com pedido de sigilo.`,
     ef:{flag:'ln_ciencia_anomalia_oak', rep:{eixo:'bom', delta:1, motivo:'Mandou o lugar da anomalia só pro laboratório'}},
     resultado:[fala('Professor Oak', `Sigilo. Eu sei guardar. Guardo coisa sua faz tempo.`)]},
    {texto:`Não contar pra ninguém. O lugar é dele.`,
     ef:{flag:'ln_ciencia_anomalia_segredo', moral:2},
     resultado:[`Você apaga o registro da Pokédex com o dedo, devagar, e anota no caderno só "trilha, de manhã, bonito".`]},
    {texto:`Vender o lugar pra um colecionador.`,
     ef:{flag:'ln_ciencia_anomalia_vendeu', dinheiro:3000, rep:{eixo:'ruim', delta:2, motivo:'Vendeu o lugar de uma anomalia cromática'}},
     resultado:[`Três mil. Uma semana depois a trilha tem placa, guarita e fila.`]}
  ]
},
{
  cap:27, titulo:'A terceira edição', quem:'Professor Oak',
  texto:d => [
    fala('Professor Oak', `Terceira edição do livro. Tem um capítulo inteiro que é seu. Eu quero o seu nome na capa, do lado do meu.`),
    d.flags.ln_ciencia_vendeu || d.flags.ln_ciencia_anomalia_vendeu
      ? `Você pensa na metade da pele de Ekans que foi pro colecionador. Ou na trilha com fila. Ele não sabe. Ou sabe e não diz.`
      : `Você pensa em todas as páginas de hora e lugar que ele leu sem reclamar.`
  ],
  escolhas:[
    {texto:`Aceitar o nome na capa.`,
     ef:{flag:'ln_ciencia_capa', rep:{eixo:'bom', delta:2, motivo:'Assinou um livro com o Professor Oak'}},
     resultado:[fala('Professor Oak', `Ótimo. Agora você vai receber carta de gente dizendo que está errado. É a melhor parte.`, 'riso')]},
    {texto:`Pedir que ponha o nome do seu time nos agradecimentos em vez do seu na capa.`,
     ef:{flag:'ln_ciencia_agradecimentos', moral:3},
     resultado:[d => { const p = (d.time || [])[0]; return p ? `Na última página, em letra pequena: "E ${nomeExib(p)}, que viu primeiro."` : 'Na última página, em letra pequena: "E ao time, que viu primeiro."'; }]}
  ]
}
],

imprensa:[
{
  cap:19, titulo:'A carta do advogado', quem:'a editora do Jornal',
  texto:d => [
    d.flags.ln_imprensa_publicou
      ? `Chega um envelope com timbre de escritório: o criador da matéria processa o Jornal pela segunda parte.`
      : `Chega um envelope sem timbre: a filha do criador manda uma foto dos Pokémon gordos e do cercado pintado de novo.`,
    fala('a editora do Jornal', d.flags.ln_imprensa_publicou ? `A gente tem tudo documentado. Você foi lá ver, não foi?` : `Você segurou a matéria e ganhou uma foto. Às vezes é isso que se ganha.`)
  ],
  escolhas:[
    {texto:d => d.flags.ln_imprensa_publicou ? `Depor a favor do Jornal, com o que você viu.` : `Pendurar a foto na parede da redação.`,
     ef:{flag:'ln_imprensa_depos', rep:{eixo:'bom', delta:1, motivo:'Sustentou o que escreveu'}},
     resultado:[d => d.flags.ln_imprensa_publicou ? `O juiz arquiva em vinte minutos. O criador não olha pra você na saída.` : `Fica do lado da janela. A editora endireita o quadro toda vez que passa.`]},
    {texto:`Escrever uma nota sobre o que mudou desde a matéria.`,
     ef:{flag:'ln_imprensa_nota', rep:{eixo:'bom', delta:1, motivo:'Voltou à história pra contar o que mudou'}},
     resultado:[`Quatro linhas na página seis. A filha do criador recorta e cola na porta da criação.`]}
  ]
},
{
  cap:23, titulo:'A coluna', quem:'a editora do Jornal',
  texto:d => [
    fala('a editora do Jornal', `Uma coluna toda sexta, com o seu nome em cima. Você escolhe o assunto. Escolhe direito, porque não dá pra trocar.`)
  ],
  escolhas:[
    {texto:`A estrada: quem anda, quem para, quem não volta.`,
     ef:{flag:'ln_imprensa_coluna_estrada', rep:{eixo:'bom', delta:1, motivo:'Ganhou coluna sobre a estrada'}},
     resultado:[`Na terceira sexta chega carta de uma treinadora de Lavender dizendo que leu em voz alta pro time.`]},
    {texto:`Os Centros: quem atende, quem espera, o que se ouve no balcão.`,
     ef:{flag:'ln_imprensa_coluna_centros', rep:{eixo:'bom', delta:1, motivo:'Ganhou coluna sobre os Centros'}},
     resultado:[`As enfermeiras de três cidades começam a guardar histórias pra te contar quando você passa.`]},
    {texto:`Quem ninguém escuta.`,
     ef:{flag:'ln_imprensa_coluna_ninguem', rep:{eixo:'bom', delta:2, motivo:'Ganhou coluna sobre quem ninguém escuta'}},
     resultado:[fala('a editora do Jornal', `Essa vai dar trabalho.`), fala('a editora do Jornal', `Boa.`)]}
  ]
},
{
  cap:27, titulo:'Do outro lado da entrevista', quem:'a editora do Jornal',
  texto:d => [
    `Um jornal de Saffron quer fazer uma matéria sobre você. Mandaram um repórter de vinte anos com o gravador ainda na caixa.`,
    fala('a editora do Jornal', `Agora você sabe como é. Seja melhor com ele do que foram com você.`)
  ],
  escolhas:[
    {texto:`Dar a entrevista e responder tudo.`,
     ef:{flag:'ln_imprensa_entrevista', rep:{eixo:'bom', delta:1, motivo:'Deu entrevista sem fugir de pergunta'}},
     resultado:[`Ele esquece de ligar o gravador nos primeiros dez minutos. Você espera ele perceber e começa de novo.`]},
    {texto:d => `Mandar ele falar com ${nomeCasa()} primeiro.`,
     ef:{flag:'ln_imprensa_mandou_casa', moral:2},
     resultado:[d => `A matéria sai com uma foto da porta da sua casa e uma frase de ${nomeCasa()} em destaque. Você nunca vai saber como ele conseguiu essa frase.`]}
  ]
}
],

criacao:[
{
  cap:18, titulo:'O primeiro laudo', quem:'a avaliadora da Associação',
  texto:d => [
    `Uma criadora de Celadon pede um laudo seu pra vender uma ninhada de Eevee. Paga bem e manda foto bonita.`,
    fala('a avaliadora da Associação', d.flags.ln_criacao_selo ? `O carimbo é seu. Eu não assino por você.` : `Sem selo, a sua assinatura vale como opinião. Opinião boa vale muito.`)
  ],
  escolhas:[
    {texto:`Ir até Celadon ver a ninhada antes de assinar.`,
     ef:{flag:'ln_criacao_visitou', rep:{eixo:'bom', delta:2, motivo:'Foi ver a ninhada antes de assinar o laudo'}},
     resultado:[`Os Eevee estão ótimos. A mãe deles também, o que é a parte que ninguém pergunta e que você pergunta.`]},
    {texto:`Assinar pela foto.`,
     ef:{flag:'ln_criacao_assinou_foto', dinheiro:900, rep:{eixo:'ruim', delta:1, motivo:'Assinou um laudo pela foto'}},
     resultado:[`Novecentos. A foto é bonita mesmo.`]}
  ]
},
{
  cap:22, titulo:'O Growlithe da feira', quem:'a avaliadora da Associação',
  texto:d => [
    d.flags.ln_criacao_comprou
      ? `O Growlithe que ficou com a enfermeira, lá da feira, cresceu. Ela te manda foto dele dormindo em cima do balcão do Centro.`
      : `A feira daquela vez fechou. Ninguém sabe pra onde foram os filhotes.`,
    fala('a avaliadora da Associação', `A Associação quer escrever uma regra pra feira. Querem que alguém que viu escreva.`)
  ],
  escolhas:[
    {texto:`Escrever a regra: nenhum Pokémon vendido em caixa de fruta, nunca.`,
     ef:{flag:'ln_criacao_regra', rep:{eixo:'bom', delta:2, motivo:'Escreveu a regra da feira'}},
     resultado:[`A regra tem uma linha. Leva quatro reuniões pra ser aprovada exatamente como você escreveu.`]},
    {texto:`Dizer que regra não resolve, e ir pra feira toda semana.`,
     ef:{flag:'ln_criacao_feira', moral:2, rep:{eixo:'bom', delta:1, motivo:'Passou a ir à feira toda semana'}},
     resultado:[`Na terceira semana os vendedores já guardam as caixas de fruta quando te veem chegando.`]}
  ]
},
{
  cap:26, titulo:'A prancheta', quem:'a avaliadora da Associação',
  texto:d => [
    fala('a avaliadora da Associação', `Vou parar. O joelho não agacha mais na altura de um Pokémon, e avaliadora que não agacha avalia errado.`),
    `Ela estende a prancheta. O elástico está velho e a prancheta, lisa de tanto uso.`
  ],
  escolhas:[
    {texto:`Aceitar a prancheta e o lugar dela.`,
     ef:{flag:'ln_criacao_prancheta', itens:{'Prancheta da Associação':1}, rep:{eixo:'bom', delta:2, motivo:'Ficou com a prancheta da avaliadora'}},
     resultado:[d => fala('a avaliadora da Associação', d.flags.ln_criacao_mostrou ? `Você me mostrou o problema primeiro, lá no começo. Faz isso com todo mundo.` : `Agacha. Sempre. O resto você aprende.`)]},
    {texto:`Recusar e indicar alguém que você viu trabalhar.`,
     ef:{flag:'ln_criacao_indicou', rep:{eixo:'bom', delta:1, motivo:'Indicou outra pessoa pro lugar da avaliadora'}},
     resultado:[`Ela anota o nome que você deu e sublinha duas vezes.`]}
  ]
}
],

liga:[
{
  cap:28, titulo:'O último dia de aula', quem:'a coordenadora da quadra',
  texto:d => [
    `Na quadra de treino, um rapaz de licença nova na mão te espera com um Butterfree no ombro.`,
    d.flags.ln_liga_cuidar
      ? `É o menino do Caterpie, da turma da manhã. Ele ainda vê se a folha está fresca antes de deixar o Butterfree comer.`
      : `É o menino do Caterpie, da turma da manhã. Ele ainda grita "superefetivo" quando acerta.`,
    fala('a coordenadora da quadra', `Ele pediu pra lutar com você antes de sair em jornada. Só isso.`)
  ],
  escolhas:[
    {texto:`Lutar a sério.`,
     ef:{flag:'ln_liga_serio', rep:{eixo:'bom', delta:1, motivo:'Lutou a sério com quem aprendeu com você'}},
     resultado:[`Ele perde em três turnos e levanta a mão pra apertar a sua antes de recolher o Butterfree.`]},
    {texto:`Deixar ele ganhar.`,
     ef:{flag:'ln_liga_deixou_ganhar', moral:2},
     resultado:[`Ele percebe. Não fala nada. Na saída da quadra ele se vira e diz que da próxima vez você não vai precisar deixar.`]}
  ]
}
],

heroi:[
{
  cap:18, titulo:'O cansaço', quem:'a mulher do mercado',
  texto:d => [
    `Você chega na cidade com o corpo pesado e o time dormindo no cinto. Na entrada já tem alguém esperando, de novo.`,
    fala('a mulher do mercado', `Desculpa. Eu sei que você acabou de chegar. É o telhado do mercado, e chove hoje à noite.`)
  ],
  escolhas:[
    {texto:`Subir no telhado assim mesmo.`,
     ef:{flag:'ln_heroi_telhado', rep:{eixo:'bom', delta:1, motivo:'Consertou um telhado cansado'}},
     resultado:[`Você termina com chuva caindo nas costas. Dorme no chão do mercado, em cima de uma pilha de saco de ração.`]},
    {texto:`Dizer que hoje não, e indicar quem pode ajudar.`,
     ef:{flag:'ln_heroi_descansou', moral:2},
     resultado:[`Ela não fica brava. Você dorme dez horas, e acorda sem saber se fez certo. Fez.`]}
  ]
},
{
  cap:22, titulo:'A placa', quem:'o prefeito da vila',
  texto:d => [
    `A vila quer pregar uma placa com o seu nome na praça. Já mandaram fazer. Só falta você deixar.`,
    fala('o prefeito da vila', d.flags.ln_heroi_tudo ? `Você fez três coisas num dia aqui. A gente não esquece.` : `Você ajudou quando ninguém ajudava. A gente não esquece.`)
  ],
  escolhas:[
    {texto:`Deixar.`,
     ef:{flag:'ln_heroi_placa', rep:{eixo:'bom', delta:1, motivo:'Ganhou uma placa na praça'}},
     resultado:[`A placa é de bronze e a letra é torta. Dois dias depois tem uma flor do lado dela, e ninguém admite ter posto.`]},
    {texto:`Pedir que a placa tenha o nome do seu time, não o seu.`,
     ef:{flag:'ln_heroi_placa_time', moral:3},
     resultado:[d => { const p = (d.time || [])[0]; return p ? `A placa sai com o nome de ${nomeExib(p)} em letra maior que a dos outros. Você não pediu isso. Você também não reclama.` : 'A placa sai com o nome de cada um do time.'; }]}
  ]
},
{
  cap:26, titulo:'Quem ajuda quem', quem:'o menino do Caterpie',
  texto:d => [
    `O seu Pokémon cai num barranco na beira da rota, e você não alcança.`,
    `Alguém alcança: um rapaz com um Butterfree, que desce pela raiz como quem já fez isso muitas vezes.`,
    fala('o menino do Caterpie', d.flags.ln_heroi_conselho ? `Faz o que tiver na sua frente. Depois o próximo. Você que falou.` : `Seja melhor. Você que falou. Tô tentando.`)
  ],
  escolhas:[
    {texto:`Agradecer e deixar ele te ajudar a subir.`,
     ef:{flag:'ln_heroi_ajudado', moral:3, rep:{eixo:'bom', delta:1, motivo:'Deixou alguém te ajudar'}},
     resultado:[`É estranho ser {o|a} de baixo do barranco. É bom também.`]}
  ]
}
],

mercenario:[
{
  cap:18, titulo:'O caderninho preto', quem:'o intermediário',
  texto:d => [
    d.flags.ln_merc_mentiu
      ? fala('o intermediário', `O treinador velho da casa sem cortina. Você disse que não achou. Eu fui lá. Ele estava em casa.`)
      : fala('o intermediário', `Serviço novo. Tem gente que vai querer Moon Stone sem passar pela loja. Você leva.`),
    `O caderninho preto está aberto na mesa, numa página com o seu nome.`
  ],
  escolhas:[
    {texto:d => d.flags.ln_merc_mentiu ? `Dizer a verdade: você não quis cobrar.` : `Aceitar o serviço.`,
     ef:{flag:'ln_merc_verdade', dinheiro:600},
     resultado:[d => d.flags.ln_merc_mentiu ? fala('o intermediário', `Eu sei. Ele pagou do mesmo jeito, pra mim, no dia seguinte. E pediu pra te agradecer.`) : `As pedras chegam embrulhadas em jornal velho. Ninguém confere.`]},
    {texto:`Fechar o caderninho e ir embora.`,
     ef:{flag:'ln_merc_fechou'},
     resultado:[fala('o intermediário', `Fecha. Eu tenho cópia.`)]}
  ]
},
{
  cap:22, titulo:'Concorrência', quem:'o intermediário',
  texto:d => [
    `Tem um mercenário novo na região cobrando metade do seu preço e fazendo o serviço pela metade.`,
    fala('o intermediário', d.flags.ln_merc_dobro ? `Você cobra o dobro desde o primeiro dia. Agora alguém cobra a metade. O mercado te achou.` : `Alguém está cobrando metade. O mercado é assim.`)
  ],
  escolhas:[
    {texto:`Baixar o preço.`,
     ef:{flag:'ln_merc_baixou', dinheiro:-300},
     resultado:[`Você perde dinheiro por três semanas e o outro desiste na quarta.`]},
    {texto:`Propor sociedade ao novato.`,
     ef:{flag:'ln_merc_socio', dinheiro:800},
     resultado:[`Ele aceita na hora. Tem dezessete anos e um Machop que obedece melhor do que ele.`]},
    {texto:`Deixar o serviço ruim dele falar por si.`,
     ef:{flag:'ln_merc_esperou'},
     resultado:[`Em um mês, os clientes voltam pedindo desculpa. Você cobra o mesmo de antes.`]}
  ]
},
{
  cap:26, titulo:'O chapéu', quem:'o intermediário',
  texto:d => [
    fala('o intermediário', `Vou parar. Comprei uma casa na praia com uma rede e um Slowpoke que veio junto com a casa.`),
    `Ele empurra o caderninho preto pela mesa.`,
    fala('o intermediário', d.flags.ln_merc_recusou ? `Você é a única pessoa que recusou o serviço grande. É por isso que eu tô te dando isso.` : `Tem tudo aqui. Quem paga, quanto, e quem não paga.`)
  ],
  escolhas:[
    {texto:`Ficar com o caderninho.`,
     ef:{flag:'ln_merc_caderninho', dinheiro:1500, rep:{eixo:'ruim', delta:1, motivo:'Herdou o caderninho do intermediário'}},
     resultado:[`É mais pesado do que parece. Tem nome de gente que você cumprimenta na rua.`]},
    {texto:`Queimar o caderninho na frente dele.`,
     ef:{flag:'ln_merc_queimou', rep:{eixo:'bom', delta:2, motivo:'Queimou o caderninho preto'}},
     resultado:[`Ele olha o fogo até o fim, tira o chapéu e põe na sua cabeça.`, fala('o intermediário', `Fica melhor em você.`, 'riso')]}
  ]
}
],

foragido:[
{
  cap:18, titulo:'A carta na pensão', quem:'a dona da pensão',
  texto:d => [
    fala('a dona da pensão', `Chegou isso. Pro seu nome de verdade, que eu não sabia que era esse.`),
    d => `A letra no envelope é de ${nomeCasa()}.`
  ],
  escolhas:[
    {texto:`Ler e responder na mesma noite.`,
     ef:{flag:'ln_foragido_respondeu', moral:2},
     resultado:[d => `Três páginas. Você não conta onde está. Conta de cada um do time, pelo nome, e pergunta se a porta de casa ainda emperra.`]},
    {texto:`Guardar a carta fechada.`,
     ef:{flag:'ln_foragido_guardou'},
     resultado:[`Ela fica no fundo da mochila, ainda colada, junto do caderno.`]}
  ]
},
{
  cap:22, titulo:'O guarda que sabe', quem:'o guarda da ponte',
  texto:d => [
    `Na ponte, um guarda pede a sua licença, lê, olha pra você, lê de novo.`,
    fala('o guarda da ponte', d.flags.ln_foragido_encarou ? `Me contaram de alguém que não pagou pra ninguém ficar quieto numa estação. Parecido com você.` : `Tem um papel com um desenho parecido com você no posto.`)
  ],
  escolhas:[
    {texto:`Esperar o que ele vai fazer.`,
     ef:{flag:'ln_foragido_esperou'},
     resultado:[`Ele devolve a licença.`, fala('o guarda da ponte', `O desenho errou o nariz.`), `Você passa.`]},
    {texto:`Contar a sua versão, inteira.`,
     ef:{flag:'ln_foragido_contou_guarda', rep:{eixo:'bom', delta:1, motivo:'Contou a sua versão a um guarda'}},
     resultado:[`Ele escuta em pé, sem anotar. No fim, tira o papel do bolso, dobra em quatro e joga no rio.`]}
  ]
},
{
  cap:26, titulo:'O depoimento', quem:'a dona da pensão',
  texto:d => [
    `Abre uma chance de você depor e acabar com o papel do poste de uma vez. Precisa ir até Saffron, entrar pela porta da frente e contar tudo.`,
    fala('a dona da pensão', d.flags.ln_foragido_contou ? `Eu ouvi a sua história no primeiro dia. Ela aguenta um juiz.` : `Eu nunca perguntei a sua história. Agora acho que você devia contar.`)
  ],
  escolhas:[
    {texto:`Ir a Saffron e depor.`,
     ef:{flag:'ln_foragido_depos', rep:{eixo:'bom', delta:3, motivo:'Entrou pela porta da frente e contou tudo'}},
     resultado:[`Leva a manhã inteira. Na saída, o poste da esquina está sem papel nenhum.`]},
    {texto:`Continuar como está.`,
     ef:{flag:'ln_foragido_continuou'},
     resultado:[`Você paga mais um mês adiantado na pensão. A dona pega o dinheiro e, dessa vez, não conta.`]}
  ]
}
]
};
for (const k in MAIS_CENAS_DE_LINHA) (CENAS_DE_LINHA[k] = CENAS_DE_LINHA[k] || []).push(...MAIS_CENAS_DE_LINHA[k]);

/* O epílogo fecha a sua linha: uma frase por lado onde você viveu
   alguma coisa, a partir do que você escolheu lá. */
function rodapeDaLinha(d){
  const f = d.flags || {}, L = [];
  const viveu = k => ((d.linhas || {})[k] || 0) > 0;
  if (viveu('lei')){
    if (f.ln_lei_apito) L.push('O apito de Holt fica numa gaveta. Você nunca soprou. Uma vez quase soprou.');
    else if (f.ln_lei_cafe) L.push('Holt aparece na guarita de Viridian toda terça, reclama do café e fica duas horas.');
    else if (f.ln_lei_corrigiu) L.push('Em algum arquivo de Viridian tem um relatório com uma frase riscada à mão, e a letra é a sua.');
    else L.push('O colete da Patrulha ficou dobrado num armário, e você sabe exatamente qual.');
  }
  if (viveu('rocket')){
    if (f.ln_rocket_denunciou || f.ln_rocket_foto) L.push('Tem um armazém no porto de Vermilion com o portão soldado. Quem soldou sabe quem mandou as fotos.');
    else if (f.ln_rocket_subiu || f.ln_rocket_dentro) L.push('O aparelho do envelope ainda toca às vezes. Você ainda atende.');
    else L.push('Um número sem nome continua salvo no seu PokéNav. Você nunca apagou e nunca ligou.');
  }
  if (viveu('ciencia')){
    if (f.ln_ciencia_capa) L.push('A terceira edição do livro do Professor tem dois nomes na capa. O seu está escrito menor, por escolha sua.');
    else if (f.ln_ciencia_agradecimentos) L.push('Na última página do livro do Professor, em letra pequena, tem o nome do seu time.');
    else L.push('O laboratório de Pallet guarda uma caixa com as suas notas de campo. Ninguém jogou nenhuma fora.');
  }
  if (viveu('imprensa')){
    if (f.ln_imprensa_coluna_ninguem) L.push('A sua coluna de sexta continua saindo. Ainda dá trabalho.');
    else if (f.ln_imprensa_segurou) L.push('Uma criação perto de Fuchsia tem uma matéria de quatro linhas colada na porta.');
    else L.push('Hazel Moss guarda o seu crachá numa gaveta da redação, com bilhete ou sem.');
  }
  if (viveu('criacao')){
    if (f.ln_criacao_prancheta) L.push('A prancheta da Associação agora é sua. O elástico é novo. A prancheta, não.');
    else if (f.ln_criacao_regra) L.push('Na feira de Kanto não se vende Pokémon em caixa de fruta. A regra tem uma linha, e é sua.');
    else L.push('Os Pokémon que passaram pela sua mão não sabem o que é selo. Eles sabem quem agachava pra falar com eles.');
  }
  if (viveu('liga')){
    if (f.ln_liga_regra) L.push('O torneio de Kanto confere item na pata desde o dia em que você mandou tirar um.');
    else L.push('A cadeira da quadra de treino ainda tem o seu agasalho pendurado.');
  }
  if (viveu('heroi')) L.push(f.ln_heroi_ajudado ? 'Um rapaz com um Butterfree ajuda gente na estrada. Ele diz que aprendeu com alguém.' : 'Na entrada de uma cidade pequena, de vez em quando, alguém ainda espera por você.');
  if (viveu('mercenario')) L.push(f.ln_merc_queimou ? 'Um chapéu velho fica pendurado no prego da porta. Às vezes você usa.' : 'O caderninho preto continua aberto em alguma mesa, numa página com o seu nome.');
  if (viveu('foragido')) L.push(f.ln_foragido_depos ? 'O poste da esquina da pensão está sem papel faz tempo. Dona Briar ainda não pergunta nome.' : 'Você ainda escolhe a rua de trás sem pensar, mesmo quando não precisa mais.');
  return L;
}

/* Quando você sai de uma linha, ela reage. Uma vez por saída. */
const VIRADAS_DE_LINHA = {
  lei:{quem:'o sargento de Viridian', texto:d => [
    `O PokéNav toca com o número da guarita.`,
    fala('o sargento de Viridian', `Vi que você devolveu o colete.`),
    fala('o sargento de Viridian', `Colete é colete. Quem vestiu sabe onde fica a guarita. Se precisar, sabe.`, 'baixo')]},
  rocket:{quem:'a voz do outro lado', texto:d => [
    `O aparelho do envelope acende uma última vez, sem tocar.`,
    `Na tela, uma frase: "O NÚMERO CONTINUA O MESMO."`]},
  ciencia:{quem:'Professor Oak', texto:d => [
    `Chega uma carta do laboratório, escrita à mão.`,
    fala('Professor Oak', `Laboratório não é prisão. A porta é de vidro justamente pra dar pra ver de fora quando a pessoa quiser voltar.`)]},
  imprensa:{quem:'a editora do Jornal', texto:d => [
    fala('a editora do Jornal', `Recebi o crachá de volta pelo correio. Sem bilhete. Você é a primeira pessoa que devolve sem bilhete.`),
    fala('a editora do Jornal', `Tira o crachá. O olho você não consegue tirar, isso eu te garanto.`)]},
  criacao:{quem:'a avaliadora da Associação', texto:d => [
    fala('a avaliadora da Associação', `Você saiu da Associação. Tudo bem. Os Pokémon que você cuidou não sabem disso.`)]},
  liga:{quem:'a coordenadora da quadra', texto:d => [
    fala('a coordenadora da quadra', `A cadeira fica vazia até a próxima votação. Ninguém senta nela, por costume.`)]},
  heroi:{quem:null, texto:d => [
    `Na entrada da cidade não tem ninguém esperando por você. Pela primeira vez em muito tempo.`,
    `Você não sabe se isso é alívio.`]},
  mercenario:{quem:'o intermediário', texto:d => [
    `Um chapéu aparece pendurado no prego da porta do seu quarto no Centro. Sem bilhete.`,
    `Quando você volta da janta, ele não está mais lá.`]},
  foragido:{quem:null, texto:d => [
    `Os papéis do poste desbotaram. Ninguém colou outro.`,
    `Você anda pela rua da frente pela primeira vez em semanas.`]}
};

const Linhas = {
  depois: null,
  atual: null,

  /* na virada de capítulo: se a sua linha tem cena pra agora, ela entra
     antes do capítulo. Devolve true se ocupou a tela. */
  talvez(cena, avisos){
    const d = Estado.dados;
    if (!d || d.capitulo < 2) return false;
    d.linhas = d.linhas || {};
    const agora = linhaAtual(d);
    const antes = d.linhaUltima || null;
    /* saiu de uma linha onde já tinha vivido alguma coisa: a antiga reage */
    if (antes && antes !== agora && (d.linhas[antes] || 0) > 0 && !d.flags['ln_virada_' + antes]){
      d.flags['ln_virada_' + antes] = true;
      d.linhaUltima = agora;
      const v = VIRADAS_DE_LINHA[antes];
      if (v){ this.mostrar({titulo:'Quem ficou pra trás', quem:v.quem, texto:v.texto, escolhas:null, linha:antes}, cena, avisos); return true; }
    }
    d.linhaUltima = agora;
    if (!agora) return false;
    const lista = CENAS_DE_LINHA[agora] || [];
    const i = d.linhas[agora] || 0;
    const c = lista[i];
    if (!c || d.capitulo < c.cap) return false;
    /* uma cena por virada de capítulo, e nunca duas seguidas na mesma */
    if (d.linhaCapVisto === d.capitulo) return false;
    d.linhaCapVisto = d.capitulo;
    d.linhas[agora] = i + 1;
    this.mostrar(Object.assign({linha:agora}, c), cena, avisos);
    return true;
  },

  mostrar(c, cena, avisos){
    this.depois = {cena, avisos:avisos || []};
    this.atual = c;
    const d = Estado.dados;
    const falas = (typeof c.texto === 'function' ? c.texto(d) : c.texto) || [];
    UI.limpar();
    UI.add(UI.topo());
    const opcoes = (c.escolhas || []).map((o, i) => `<button class="escolha" onclick="Linhas.escolher(${i})">${UI.esc(txt(o.texto))}</button>`).join('');
    UI.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">${UI.esc(NOME_DA_LINHA[c.linha] || '')}</div>
        <div class="tit">${UI.esc(c.titulo)}</div>
      </div>
      <div class="narrativa">${UI.narrar(falas, c.quem)}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas">
        ${opcoes || `<button class="escolha" onclick="Linhas.seguir()">Seguir.</button>`}
      </div>
    </div>`);
    UI.rolarTopo();
  },

  escolher(i){
    const c = this.atual;
    const o = c && c.escolhas && c.escolhas[i];
    if (!o) return this.seguir();
    const avisos = Historia.aplicar(o.ef) || [];
    Estado.registrar(`${c.titulo}: ${txt(o.texto)}`);
    Estado.salvar('auto');
    UI.limpar();
    UI.add(UI.topo());
    UI.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">${UI.esc(NOME_DA_LINHA[c.linha] || '')}</div>
        <div class="tit">${UI.esc(c.titulo)}</div>
      </div>
      <div class="narrativa">${UI.narrar(o.resultado || [], c.quem)}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas" style="margin-top:16px">
        <button class="escolha" onclick="Linhas.seguir()">Seguir.</button>
      </div>
    </div>`);
    if (avisos.length) UI.avisos(avisos);
    UI.rolarTopo();
  },

  seguir(){
    const dep = this.depois;
    this.depois = null; this.atual = null;
    if (dep && dep.cena) return UI.telaCena(dep.cena, dep.avisos);
    if (Estado.dados.modo === 'cena' && Historia.cenaAtual) return UI.telaCena(Historia.cenaAtual);
    return Exploracao.tela();
  }
};
