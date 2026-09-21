/* ============================================================
   CAPÍTULO 29 — O PORTÃO VERDE  (Cerulean)  · CONDICIONAL

   Só acontece pra quem saiu do capítulo 6 sabendo que existe uma
   casa depois da segunda ponte que compra Pokémon de quem está
   precisando, ou que caminhão-gaiola atravessa a cidade terça,
   quinta e sábado com nota de material de pesca.

   Quem não descobriu isso segue direto pra Lavender e nunca fica
   sabendo que essa casa existe. É de propósito.
   ============================================================ */
const C29_ABERTURAS = ['c29_a_rua', 'c29_o_vizinho', 'c29_de_madrugada'];
function c29_cabe(id, d){
  if (id === 'c29_de_madrugada') return !!d.flags.caminhao_gaiola_terca_quinta_sabado;
  return true;
}
function c29_abertura(d){ return Dados.escolher(C29_ABERTURAS.filter(id => c29_cabe(id, d))); }

CAPITULOS.push(
{
num:29, titulo:'O Portão Verde', local:'Cerulean — depois da segunda ponte', ambiente:'cidade', nivelArea:24,
tom:'sombrio',
requer: d => !!(d.flags.sabe_do_portao_verde || d.flags.caminhao_gaiola_terca_quinta_sabado ||
                d.flags.sabe_da_tabela || d.flags.ninguem_fiscaliza_a_venda),
proximo: d => 7,
entradas:C29_ABERTURAS,
inicio: d => c29_abertura(d),
cenas:{

c29_a_rua:{
  texto:[
    'Depois da segunda ponte, Cerulean muda de textura em menos de um quarteirão.',
    'Some a banca, some a vitrine, some o barulho de água, e começa uma rua de casa baixa com muro alto e cachorro que late de dentro.',
    'A casa do portão verde é a quarta. Não tem placa, não tem número visível e o portão é de chapa, com uma janelinha de correspondência que está vedada por dentro com fita.',
    'Do outro lado da rua tem um poste com uma lâmpada quebrada e um meio-fio onde dá pra sentar.',
    'Você senta.',
    'Em quarenta minutos entram duas pessoas pelo portão. Nenhuma das duas bate: as duas dão três toques curtos com a palma na chapa, e o portão abre.',
    'Três toques. Com a palma, não com o nó do dedo. Isso é uma senha que ninguém combinou de chamar de senha.'
  ],
  ef:{flag:'achou_o_portao_verde',
      registrar:'A casa do portão verde fica na quarta casa depois da segunda ponte. Três toques com a palma abrem.',
      presagio:'Ninguém bate. Todo mundo sabe bater de um jeito só.'},
  escolhas:[
    {texto:'Dar os três toques.', vai:'c29_bateu'},
    {texto:'Esperar sair alguém e seguir.', vai:'c29_seguiu_quem_saiu'},
    {texto:'Procurar quem more nessa rua.', vai:'c29_o_vizinho'},
    {texto:'Dar a volta pelo quarteirão e ver os fundos.', vai:'c29_os_fundos'}
  ]
},

c29_o_vizinho:{
  texto:[
    'A casa do lado do portão verde tem uma senhora regando vaso na calçada às sete da manhã, que é o horário de quem rega vaso a sério.',
    'O portão dela tem o sobrenome em ferro fundido, do jeito que se fazia em mil novecentos e setenta: FUJINO.',
    'Ela te vê olhando o portão e fala primeiro, do jeito de quem estava esperando alguém pra falar disso há muito tempo.',
    fala('Sra. Fujino', 'Você não é da prefeitura.'),
    d=>fala(d.jogador.nome, 'Não.'),
    fala('Sra. Fujino', 'Pena.'),
    'Ela move o regador pro vaso seguinte.',
    fala('Sra. Fujino', 'Eu liguei quatro vezes. Quatro. Pra prefeitura, pra zoonoses e pra delegacia.'),
    d=>fala(d.jogador.nome, 'Por causa do quê?'),
    fala('Sra. Fujino', 'Do barulho.'),
    'Ela para de regar.',
    fala('Sra. Fujino', 'Não é barulho de festa, meu filho. É barulho de bicho. De madrugada, das duas às quatro, e não é sempre, é terça, quinta e sábado.'),
    fala('Sra. Fujino', 'E eu moro aqui há trinta e um anos e eu sei diferenciar cachorro de vizinho de o que quer que seja aquilo.', 'baixo')
  ],
  ef:{flag:['a_senhora_do_vaso','achou_o_portao_verde'],
      npc:{nome:'Sra. Fujino', opiniao:2, viuVoce:'Te contou das quatro ligações que ela fez e que ninguém atendeu.'},
      registrar:'A vizinha do portão verde ligou quatro vezes para três órgãos diferentes. Ninguém foi.'},
  escolhas:[
    {texto:'Perguntar o que responderam nas quatro vezes.', vai:'c29_as_quatro_ligacoes'},
    {texto:'Perguntar se ela já viu quem entra.', vai:'c29_quem_entra_ali'},
    {texto:'Ir bater no portão.', vai:'c29_bateu'},
    {texto:'Dar a volta e ver os fundos.', vai:'c29_os_fundos'}
  ]
},

c29_as_quatro_ligacoes:{
  texto:[
    fala('Sra. Fujino', 'Anotei todas. Eu anoto tudo, é o meu defeito.'),
    'Ela entra em casa e volta com uma agenda de capa de couro sintético, dessas de banco, e abre numa página marcada com um elástico.',
    fala('Sra. Fujino', 'Prefeitura: "não é competência, é zoonoses".'),
    fala('Sra. Fujino', 'Zoonoses: "zoonoses trata de animal doméstico, Pokémon é outra pasta".'),
    fala('Sra. Fujino', 'Delegacia: "sem flagrante não tem ocorrência, a senhora pode registrar um boletim informativo".'),
    d=>fala(d.jogador.nome, 'E a quarta?'),
    'Ela vira a página.',
    fala('Sra. Fujino', 'A quarta foi na Liga.'),
    fala('Sra. Fujino', 'A Liga foi a única que mandou alguém.'),
    d=>fala(d.jogador.nome, 'E?'),
    fala('Sra. Fujino', 'Veio um moço de cinza. Ficou vinte minutos lá dentro, saiu, e me disse que estava tudo regular.'),
    'Ela fecha a agenda.',
    fala('Sra. Fujino', 'Eu perguntei regular como. Ele disse que eu não precisava me preocupar.'),
    fala('Sra. Fujino', 'Isso foi em maio. Aí o barulho de madrugada aumentou.', 'frio')
  ],
  ef:{flag:['a_agenda_da_senhora','sabe_do_lote_unico'],
      registrar:'A Liga mandou um oficial ao portão verde em maio. Ele disse que estava tudo regular. O barulho aumentou depois.',
      presagio:'Três órgãos não vieram e um veio e disse que estava regular. Esse é o pior dos quatro.'},
  escolhas:[
    {texto:'Pedir a agenda emprestada.', vai:'c29_pediu_a_agenda'},
    {texto:'Ir bater no portão.', vai:'c29_bateu'},
    {texto:'Dar a volta e ver os fundos.', vai:'c29_os_fundos'}
  ]
},

c29_pediu_a_agenda:{
  texto:[
    d=>fala(d.jogador.nome, 'A senhora me empresta essa agenda?'),
    'Ela segura a agenda com as duas mãos e você já viu esse gesto antes, num banco em frente a uma cerca em Fuchsia.',
    fala('Sra. Fujino', 'Eu copio pra você.'),
    d=>fala(d.jogador.nome, 'A senhora não precisa.'),
    fala('Sra. Fujino', 'Preciso sim, porque eu não vou te dar a minha agenda e você não vai sair daqui sem nada.'),
    'Ela senta na cadeira da calçada e copia à mão, em letra de professora, as quatro ligações com data, hora, número discado, nome de quem atendeu e o que foi dito.',
    'Leva vinte e dois minutos.',
    'No fim ela assina — Ayako Fujino, num traço firme —, põe a data e escreve embaixo: "declaro que copiei do meu próprio caderno e que é verdade".',
    'Ninguém ensinou isso pra ela. Ela só sabe que uma coisa escrita à mão vale mais quando tem alguém assumindo que escreveu.'
  ],
  ef:{flag:['copia_da_agenda','reika_precisa_de_papel'],
      rep:{eixo:'bom', delta:1, motivo:'Uma vizinha copiou à mão quatro ligações e assinou embaixo, por você.'},
      npc:{nome:'Sra. Fujino', opiniao:4, viuVoce:'Copiou e assinou as quatro ligações para você levar.'},
      registrar:'Está com a cópia manuscrita e assinada das quatro ligações da vizinha do portão verde.'},
  escolhas:[
    {texto:'Ir bater no portão.', vai:'c29_bateu'},
    {texto:'Dar a volta e ver os fundos.', vai:'c29_os_fundos'},
    {texto:'Voltar de madrugada, numa terça.', vai:'c29_de_madrugada'}
  ]
},

c29_quem_entra_ali:{
  texto:[
    fala('Sra. Fujino', 'Gente nova, quase sempre. Da sua idade e pouco mais.'),
    'Ela recomeça a regar, porque as plantas não têm culpa.',
    fala('Sra. Fujino', 'Entram com bicho e saem sem.'),
    d=>fala(d.jogador.nome, 'Todos?'),
    fala('Sra. Fujino', 'Não. Uns saem com o bicho e com a cara de quem não gostou do preço.'),
    'Ela move o regador.',
    fala('Sra. Fujino', 'Esses eu fico contente. Eu fico na janela torcendo, que é uma coisa ridícula de se fazer aos setenta anos.'),
    fala('Sra. Fujino', 'E uns saem sem o bicho e sem olhar pra trás, e andam rápido.'),
    fala('Sra. Fujino', 'Esses eu não consigo esquecer a cara, e são muitos, e eu lembro de todas.', 'baixo')
  ],
  ef:{flag:'entram_com_bicho_saem_sem',
      registrar:'No portão verde entra gente nova com Pokémon e sai sem.'},
  escolhas:[
    {texto:'Perguntar das quatro ligações dela.', vai:'c29_as_quatro_ligacoes'},
    {texto:'Ir bater no portão.', vai:'c29_bateu'},
    {texto:'Dar a volta e ver os fundos.', vai:'c29_os_fundos'}
  ]
},

c29_os_fundos:{
  texto:[
    'O quarteirão dá a volta em seis minutos e os fundos da casa do portão verde dão num beco de serviço com três latões de lixo e um muro de dois metros e meio.',
    'O muro tem caco de vidro em cima, o que é normal, e uma coisa que não é normal: um exaustor industrial embutido, desses de cozinha de restaurante, com a grade suja de gordura e poeira.',
    'Casa de família não tem exaustor industrial.',
    'Você encosta a mão na grade. Está desligado e está morno, o que quer dizer que esteve ligado há pouco.',
    'E nos latões de lixo tem, em cima de tudo, seis sacos de ração de vinte quilos vazios e dobrados.',
    'Seis, da mesma marca, da mesma semana.',
    'Seis sacos de vinte quilos é cento e vinte quilos de ração por semana numa casa de rua residencial com um portão que só abre com três toques.'
  ],
  ef:{flag:'os_fundos_do_portao_verde',
      registrar:'Nos fundos do portão verde: exaustor industrial e seis sacos de ração de 20 kg vazios por semana.',
      presagio:'Cento e vinte quilos por semana. Isso não alimenta um bicho nem dez.'},
  escolhas:[
    {texto:'Pular o muro.', vai:'c29_pulou_o_muro'},
    {texto:'Levar um saco vazio como prova.', vai:'c29_pegou_o_saco'},
    {texto:'Voltar pra frente e bater no portão.', vai:'c29_bateu'},
    {texto:'Voltar de madrugada, numa terça.', vai:'c29_de_madrugada'}
  ]
},

c29_pegou_o_saco:{
  texto:[
    'Você tira um dos sacos dobrados de cima do latão e abre.',
    'É saco de ração de granja, cinquenta por setenta, com impressão em três cores e — na lateral, onde ninguém olha — uma etiqueta de expedição colada.',
    'A etiqueta tem: número de lote, data, o nome de uma distribuidora de Celadon, e um campo de destinatário preenchido à máquina.',
    'O destinatário não é um nome de pessoa e não é um nome de empresa.',
    'É uma sigla de cinco caracteres que você já viu escrita à mão num livro de destinos.',
    'Você dobra o saco em oito e enfia dentro da mochila, e ele não cabe direito, e você força.'
  ],
  ef:{flag:['tem_o_saco_de_racao','reika_precisa_de_papel','sabe_do_lote_unico'],
      registrar:'Está com um saco de ração vazio do portão verde, com etiqueta de expedição e destinatário em sigla.',
      presagio:'Uma sigla de cinco caracteres numa etiqueta de ração. Ninguém falsifica nota de ração.'},
  escolhas:[
    {texto:'Pular o muro agora que você tem certeza.', vai:'c29_pulou_o_muro'},
    {texto:'Ir bater no portão pela frente.', vai:'c29_bateu'},
    {texto:'Sair com o que você tem e não voltar.', vai:'c29_fim'}
  ]
},

c29_bateu:{
  texto:[
    'Você dá os três toques com a palma.',
    'O portão abre quarenta centímetros e atrás dele tem um homem de uns trinta anos de camiseta regata, descalço, com um copo de café na mão.',
    'O nome dele é Mitsuo e você só descobre isso porque a Sra. Fujino grita do portão ao lado, no meio da conversa, que ele precisa tirar o carro da frente da garagem dela.',
    'Ele olha você de cima a baixo em menos de um segundo e chega a uma conclusão.',
    fala('Mitsuo', 'Traz?'),
    d=>fala(d.jogador.nome, 'Trago o quê?'),
    'Ele suspira, do jeito de quem já explicou isso hoje.',
    fala('Mitsuo', 'Bicho, moço. Você bateu no portão certo pelo motivo errado ou pelo motivo certo?'),
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} está do seu lado e ele olha pro ${nomeExib(p)} e faz uma conta na cabeça, e dá pra ver o número na cara dele.`
               : 'Ele olha pros seus ombros procurando uma bola no cinto e não acha.';
    },
    fala('Mitsuo', 'Tabela tá na parede. Entra ou não entra, mas decide aí que tá frio.')
  ],
  ef:{flag:'o_portao_abriu',
      registrar:'O portão verde abriu. Tem uma tabela de preço na parede de dentro.'},
  escolhas:[
    {texto:'Entrar.', vai:'c29_dentro'},
    {texto:'"Eu vim ver a tabela." — entrar dizendo a verdade.', vai:'c29_dentro_verdade'},
    {texto:'Não entrar. Sair andando.', vai:'c29_nao_entrou'}
  ]
},

c29_dentro:{
  texto:[
    'A sala da frente é uma sala. Sofá, televisão, um calendário de posto de gasolina, e cheiro de café.',
    'Na parede, num quadro de cortiça, a tabela.',
    'É datilografada, plastificada e organizada por três colunas: espécie, faixa de nível e valor.',
    'Os valores são bons. São muito melhores do que você imaginava, e é isso que você não tinha previsto: a coisa toda funciona porque paga bem.',
    'E na quarta coluna, sem cabeçalho, tem uma letra em cada linha: C, C, C, R, C, R, R, C.',
    d=>fala(d.jogador.nome, 'O que é a última coluna?'),
    fala('Mitsuo', 'Destino.'),
    d=>fala(d.jogador.nome, 'C e R.'),
    'Ele toma o café dele.',
    fala('Mitsuo', 'Criação e Recurso.'),
    'Ele diz as duas palavras sem nenhum peso, do jeito de quem repete uma classificação de manual que ele nunca parou pra ouvir.'
  ],
  ef:{flag:['viu_a_tabela','sabe_do_lote_unico'],
      registrar:'A tabela do portão verde classifica cada espécie como "Criação" ou "Recurso".',
      presagio:'Criação e Recurso. Ele não sabe o que está dizendo, e é por isso que ele diz.'},
  escolhas:[
    {texto:'Perguntar o que é Recurso.', vai:'c29_o_que_e_recurso'},
    {texto:'Fotografar ou copiar a tabela.', vai:'c29_copiou_a_tabela'},
    {texto:'Perguntar quem paga.', vai:'c29_quem_paga'},
    {texto:'Sair.', vai:'c29_nao_entrou'}
  ]
},

c29_dentro_verdade:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu não vim vender nada. Eu vim ver a tabela.'),
    'Ele para com o copo de café na metade do caminho.',
    'E aí ele faz uma coisa que desmonta a cena inteira: ele dá de ombros e abre mais o portão.',
    fala('Mitsuo', 'Tá na parede. Pode ver.'),
    d=>fala(d.jogador.nome, 'Assim?'),
    fala('Mitsuo', 'Moço, eu não tô escondendo nada. Eu tenho alvará.'),
    'Ele aponta com o queixo pra uma moldura na parede da sala e tem mesmo um alvará ali, emitido, com brasão, dentro da validade.',
    fala('Mitsuo', 'Compra e venda de espécimes, atividade licenciada, código quatro dois sete.'),
    'Ele toma o café.',
    fala('Mitsuo', 'Você achou que era o quê? Que eu ia te bater?'),
    'E você achou, e ele viu que você achou, e é humilhante de um jeito muito específico.'
  ],
  ef:{flag:['viu_a_tabela','o_alvara_quatro_dois_sete','sabe_do_lote_unico'],
      registrar:'A casa do portão verde tem alvará: compra e venda de espécimes, código 427, dentro da validade.',
      presagio:'É licenciado. O problema nunca foi a ilegalidade.'},
  escolhas:[
    {texto:'Perguntar o que é a coluna C e R.', vai:'c29_o_que_e_recurso'},
    {texto:'Copiar a tabela e o número do alvará.', vai:'c29_copiou_a_tabela'},
    {texto:'Perguntar quem paga.', vai:'c29_quem_paga'},
    {texto:'Sair.', vai:'c29_nao_entrou'}
  ]
},

c29_o_que_e_recurso:{
  texto:[
    d=>fala(d.jogador.nome, 'O que é Recurso?'),
    fala('Mitsuo', 'É a classificação. Vem na tabela que eles mandam.'),
    d=>fala(d.jogador.nome, 'Eu sei que vem. Eu tô perguntando o que quer dizer.'),
    'Ele olha pra tabela. É a primeira vez na conversa que ele olha pra tabela.',
    fala('Mitsuo', 'Criação é o que vai pra criadouro. Pra reprodução, entende?'),
    d=>fala(d.jogador.nome, 'E Recurso?'),
    'Silêncio.',
    fala('Mitsuo', 'Recurso é o que não vai pra criadouro.'),
    'Ele põe o copo de café na mesinha do sofá e fica com as duas mãos livres e não sabe o que fazer com elas.',
    fala('Mitsuo', 'Eu faço isso há seis anos e você é o primeiro que pergunta.'),
    fala('Mitsuo', 'E eu tô ouvindo a minha resposta agora, em voz alta, pela primeira vez.', 'baixo')
  ],
  ef:{flag:'a_coluna_recurso', moral:1,
      npc:{nome:'Mitsuo', opiniao:1, viuVoce:'Você o fez dizer em voz alta, depois de seis anos, o que a coluna significa.'},
      registrar:'"Recurso é o que não vai pra criadouro." Ele nunca tinha dito isso em voz alta.',
      presagio:'Seis anos. E bastou alguém perguntar uma vez.'},
  escolhas:[
    {texto:'Perguntar quem manda a tabela.', vai:'c29_quem_paga'},
    {texto:'Copiar a tabela.', vai:'c29_copiou_a_tabela'},
    {texto:'Sair sem falar mais nada.', vai:'c29_nao_entrou'}
  ]
},

c29_quem_paga:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem manda a tabela?'),
    fala('Mitsuo', 'Chega por malote.'),
    d=>fala(d.jogador.nome, 'De onde?'),
    fala('Mitsuo', 'Do escritório.'),
    d=>fala(d.jogador.nome, 'Que escritório?'),
    'Ele abre uma gaveta do móvel da sala, tira um envelope pardo usado e vira o verso pra você, onde tem o carimbo de expedição.',
    'Rua do Comércio, 118 — sala 704.',
    'Você lê duas vezes e a sala fica com um zumbido que não existe.',
    fala('Mitsuo', 'Eu nunca fui lá. Eu recebo malote, eu pago à vista, eu entrego na terça, quinta e sábado.'),
    fala('Mitsuo', 'Você tá me olhando como se eu fosse o dono disso.'),
    'Ele guarda o envelope.',
    fala('Mitsuo', 'Eu ganho oito por cento.', 'baixo')
  ],
  ef:{flag:['o_endereco_no_envelope','sabe_do_lote_unico'],
      registrar:'Os malotes do portão verde vêm da Rua do Comércio, 118, sala 704.',
      presagio:'Um endereço de rua comercial com número de sala. Guarde: ele é o primeiro endereço desta jornada que não é de uma cidade, é de uma porta.'},
  escolhas:[
    {texto:'Pedir o envelope.', vai:'c29_pediu_o_envelope'},
    {texto:'Copiar a tabela antes de sair.', vai:'c29_copiou_a_tabela'},
    {texto:'Sair.', vai:'c29_nao_entrou'}
  ]
},

c29_pediu_o_envelope:{
  texto:[
    d=>fala(d.jogador.nome, 'Me dá esse envelope.'),
    fala('Mitsuo', 'Não.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('Mitsuo', 'Porque eu tenho dois filhos e um alvará.'),
    'Ele fecha a gaveta com a mão espalmada, devagar.',
    fala('Mitsuo', 'Mas eu não vou te expulsar e eu não vou te vigiar, e eu preciso ir no banheiro.'),
    'E ele sai da sala.',
    'Leva quatro minutos.',
    'A gaveta não tem chave.'
  ],
  ef:{flag:'ele_saiu_da_sala',
      presagio:'Ele disse o que não podia fazer e foi embora da sala. Isso é uma frase inteira.'},
  escolhas:[
    {texto:'Abrir a gaveta e pegar o envelope.', vai:'c29_pegou_o_envelope'},
    {texto:'Não abrir. Copiar o endereço à mão e sair.', vai:'c29_copiou_a_tabela'},
    {texto:'Não abrir e não copiar. Sair.', vai:'c29_nao_entrou'}
  ]
},

c29_pegou_o_envelope:{
  texto:[
    'Você abre a gaveta e pega o envelope e fecha a gaveta e sai da sala antes dos quatro minutos.',
    'Do portão, antes de sair, você ouve a descarga.',
    'Ele calculou o tempo. Ele calculou o tempo de descarga pra você ter o tempo de decidir sozinho, e isso é o tipo de cumplicidade que não deixa rastro e que nenhum processo vai conseguir provar.',
    'Na rua, com o envelope pardo na mão, você entende que acabou de receber uma prova de alguém que precisa poder jurar que não deu.'
  ],
  ef:{flag:['tem_o_envelope_do_malote','reika_precisa_de_papel'],
      rep:{eixo:'ruim', delta:1, motivo:'Levou um envelope da casa de outra pessoa, mesmo com a porta aberta de propósito.'},
      npc:{nome:'Mitsuo', opiniao:2, viuVoce:'Saiu da sala de propósito e deixou a gaveta sem chave.'},
      registrar:'Está com o envelope de malote carimbado: Rua do Comércio, 118, sala 704.'},
  escolhas:[
    {texto:'Sair de Cerulean com isso.', vai:'c29_fim'},
    {texto:'Voltar de madrugada, numa terça, ver o caminhão.', vai:'c29_de_madrugada'}
  ]
},

c29_copiou_a_tabela:{
  texto:[
    'Você copia a tabela inteira no verso de um papel qualquer: trinta e uma linhas, três colunas, e a quarta coluna sem cabeçalho.',
    'Leva dezoito minutos e ele não te atrapalha uma vez. Ele assiste televisão com o som baixo enquanto você escreve.',
    'Quando você termina, ele fala sem tirar os olhos da televisão:',
    fala('Mitsuo', 'Vinte e dois "R".'),
    d=>fala(d.jogador.nome, 'O quê?'),
    fala('Mitsuo', 'Das trinta e uma linhas, vinte e dois são "R".'),
    'Ele muda de canal.',
    fala('Mitsuo', 'Eu também nunca tinha contado.'),
    'Você olha a sua cópia e conta.',
    'Vinte e dois.'
  ],
  ef:{flag:['copia_da_tabela','reika_precisa_de_papel','sabe_do_lote_unico'],
      registrar:'Copiou a tabela do portão verde: 31 espécies, 22 classificadas como "Recurso".',
      presagio:'Vinte e duas de trinta e uma. Isso não é exceção: é a regra da tabela.'},
  escolhas:[
    {texto:'Sair de Cerulean com isso.', vai:'c29_fim'},
    {texto:'Perguntar quem manda a tabela antes de sair.', vai:'c29_quem_paga'},
    {texto:'Voltar de madrugada, numa terça.', vai:'c29_de_madrugada'}
  ]
},

c29_nao_entrou:{
  texto:[
    'Você sai andando e não olha pra trás, e o portão fecha atrás de você com o barulho de chapa que chapa faz.',
    'Na esquina você para.',
    'Não tem nada de heroico em não entrar. Você não salvou nada e não impediu nada, e amanhã é terça.',
    'Mas você sabe onde é a casa, sabe que abre com três toques, e sabe que a vizinha da esquerda anota tudo numa agenda de capa de couro sintético.',
    'Isso é mais do que você tinha ontem.'
  ],
  ef:{flag:'nao_entrou_no_portao_verde',
      registrar:'Não entrou na casa do portão verde.'},
  escolhas:[
    {texto:'Voltar de madrugada, numa terça.', vai:'c29_de_madrugada'},
    {texto:'Falar com a vizinha da esquerda.', vai:'c29_o_vizinho'},
    {texto:'Dar a volta e ver os fundos.', vai:'c29_os_fundos'},
    {texto:'Ir embora de Cerulean.', vai:'c29_fim'}
  ]
},

c29_pulou_o_muro:{
  texto:[
    'Dois metros e meio com caco de vidro em cima é um muro sério, e a solução é a de sempre: o cobertor dobrado em quatro por cima do vidro e a força dos braços, que você não tem toda.',
    'Você cai do outro lado num quintal cimentado e machuca o tornozelo na aterrissagem, não muito.',
    'O quintal tem: um varal sem roupa, um tanque, e uma construção baixa de alvenaria no fundo, sem janela, com uma porta de ferro e um exaustor.',
    'A porta de ferro não tem cadeado. Tem tranca do lado de fora, que é a informação: quem tranca por fora não está se protegendo do que está dentro. Está impedindo de sair.',
    'E de dentro vem o som.',
    'Muita coisa viva no mesmo lugar, abafada por alvenaria, parando toda de uma vez quando você põe a mão na tranca.'
  ],
  ef:{hp:-3, causa:'Queda do muro do portão verde',
      flag:['pulou_o_muro_verde','sabe_do_lote_unico'],
      rep:{eixo:'ruim', delta:1, motivo:'Invadiu o quintal de uma casa em Cerulean.'},
      registrar:'Pulou o muro do portão verde. Nos fundos há uma construção sem janela, trancada por fora.'},
  escolhas:[
    {texto:'Abrir a tranca.', vai:'c29_abriu_a_tranca'},
    {texto:'Não abrir. Olhar pelo exaustor.', vai:'c29_pelo_exaustor'},
    {texto:'Sair do quintal do jeito que entrou.', vai:'c29_os_fundos'}
  ]
},

c29_pelo_exaustor:{
  texto:[
    'O exaustor está na altura do seu peito e a grade tem vãos de um centímetro e meio.',
    'Você encosta o olho e leva uns vinte segundos pra pupila abrir.',
    'Lá dentro tem quatro fileiras de gaiola empilhadas em três alturas, com corredor entre elas, piso de cimento com ralo central e uma lâmpada de tubo apagada.',
    'Você conta as que dá pra ver: trinta e uma ocupadas.',
    'Trinta e uma, que é o número de linhas da tabela da sala da frente, e você não sabe se isso é coincidência e desconfia que não.',
    'E aí acontece a pior parte, que é uma coisa muito pequena.',
    'Um deles, na gaiola de baixo da segunda fileira, vira a cabeça na direção do exaustor e olha pro seu olho.',
    'E não faz barulho nenhum.',
    'Porque ele aprendeu que barulho não adianta.'
  ],
  ef:{flag:['contou_trinta_e_uma','sabe_do_lote_unico'], moral:-2,
      registrar:'Há 31 gaiolas ocupadas na construção dos fundos do portão verde.',
      presagio:'Ele olhou e não fez barulho. Isso leva tempo pra aprender.'},
  escolhas:[
    {texto:'Abrir a tranca.', vai:'c29_abriu_a_tranca'},
    {texto:'Sair, e sair com isso.', vai:'c29_fim'}
  ]
},

c29_abriu_a_tranca:{
  texto:[
    'Você puxa a tranca e ela corre fácil, porque tranca de porta usada corre fácil.',
    'A porta abre pra fora e a luz do quintal entra no galpão pela primeira vez no dia.',
    'Trinta e uma gaiolas. Quatro fileiras. Corredor no meio. Ralo no centro do piso.',
    'E aí você ouve o portão da frente e passos no corredor lateral da casa, e você tem uns doze segundos pra decidir a coisa mais difícil do capítulo:',
    'abrir trinta e uma gaiolas leva mais de doze segundos.'
  ],
  ef:{flag:'a_porta_aberta_do_galpao'},
  escolhas:[
    {texto:'Abrir todas. Que dê o que der.', vai:'c29_abriu_todas'},
    {texto:'Abrir as que der e correr.', vai:'c29_abriu_as_que_deu'},
    {texto:'Fechar a porta e sair sem ser visto.', vai:'c29_fechou_a_porta'}
  ]
},

c29_abriu_todas:{
  texto:[
    'Você começa pela fileira de baixo porque é a mais rápida e não conta mais nada depois da quarta.',
    'Trava de gaveta, trava de gaveta, trava de gaveta. É tudo igual e é tudo rápido e nenhum deles sai correndo, porque nenhum deles esperava que a porta fosse abrir.',
    'Eles ficam.',
    'Essa é a parte que você não tinha previsto: você abre trinta e uma gaiolas e trinta e uma criaturas continuam sentadas.',
    'O homem do portão aparece na porta do galpão no meio da segunda fileira e não avança.',
    fala('Mitsuo', 'Ah, moleque.'),
    'Ele não grita. Ele fala do jeito de quem viu um copo cair e sabe que não dá pra pegar.',
    fala('Mitsuo', 'Você sabe que eu vou ter que pagar por cada um desses?'),
    d=>fala(d.jogador.nome, 'Eu sei.'),
    'E você continua abrindo.'
  ],
  ef:{flag:'abriu_as_trinta_e_uma', moral:8,
      rep:{eixo:'bom', delta:4, motivo:'Abriu trinta e uma gaiolas num galpão de Cerulean.', notorio:true},
      registrar:'Abriu as 31 gaiolas do galpão do portão verde.'},
  escolhas:[
    {texto:'Enfrentar ele.', vai:'c29_luta'},
    {texto:'Passar por ele e sair.', vai:'c29_passou_por_ele'}
  ]
},

c29_abriu_as_que_deu:{
  texto:[
    'Você abre onze e os passos chegam no quintal e você sai pela porta antes deles virarem a esquina da casa.',
    'Onze de trinta e uma.',
    'Você pula o muro pelo mesmo lugar, com o cobertor ainda em cima do vidro, e cai na rua de trás e anda rápido sem correr.',
    'E nas semanas seguintes você vai refazer a conta de onze contra trinta e uma muitas vezes, e a conta nunca vai ficar boa.',
    'Mas onze é onze.'
  ],
  ef:{flag:'abriu_onze', moral:4,
      rep:{eixo:'bom', delta:2, motivo:'Abriu onze gaiolas e saiu antes de ser visto.'},
      registrar:'Abriu onze das 31 gaiolas do galpão do portão verde.'},
  escolhas:[
    {texto:'Sair de Cerulean.', vai:'c29_fim'}
  ]
},

c29_fechou_a_porta:{
  texto:[
    'Você fecha a porta e corre a tranca de volta e o som da tranca é o som mais alto do dia.',
    'Você pula o muro pelo mesmo lugar e cai na rua de trás e anda rápido sem correr, e ninguém te vê.',
    'Você fez a coisa sensata e a coisa sensata deixa trinta e uma criaturas onde elas estavam.',
    'Você tem um endereço, uma tabela, uma agenda copiada à mão e um saco de ração com etiqueta.',
    'Isso derruba a coisa toda daqui a três anos, se derrubar.',
    'Trinta e uma gaiolas não têm três anos.'
  ],
  ef:{flag:'fechou_a_tranca', moral:-3,
      registrar:'Fechou a tranca do galpão e saiu sem ser visto.',
      presagio:'A conta certa e a conta possível não são a mesma conta, e você escolheu uma.'},
  escolhas:[
    {texto:'Sair de Cerulean.', vai:'c29_fim'}
  ]
},

c29_luta:{
  texto:[
    'Ele não quer brigar e briga do mesmo jeito, porque tem dois filhos e um alvará e trinta e uma gaiolas abertas.',
    'Ele solta o dele sem nenhum entusiasmo, e a falta de entusiasmo não tira nada do nível.'
  ],
  batalha:{dex:24, nivel:26, tipo:'treinador', treinador:'o homem do portão', fuga:true,
           timeExtra:[{dex:20, nivel:25}],
           vitoria:'c29_venceu', derrota:'c29_perdeu', gameover:'gameover'}
},

c29_venceu:{
  texto:[
    'Ele recolhe o dele e senta no batente da porta do galpão com as costas na ombreira.',
    'Atrás dele, trinta e uma gaiolas abertas e trinta e uma criaturas que ainda não entenderam que podem sair.',
    fala('Mitsuo', 'Eles não vão embora.'),
    d=>fala(d.jogador.nome, 'Vão.'),
    fala('Mitsuo', 'Hoje não.'),
    'E ele tem razão, e vocês dois ficam ali, sentados em pontos diferentes do mesmo quintal, esperando a primeira sair.',
    'Leva quarenta minutos.',
    'A primeira é da gaiola de baixo da segunda fileira, que é a que olhou pro exaustor, e quando ela passa pela porta as outras trinta entendem de uma vez.'
  ],
  ef:{flag:'as_trinta_e_uma_sairam', moral:6,
      rep:{eixo:'bom', delta:3, motivo:'Ficou até as trinta e uma saírem.'},
      registrar:'As 31 saíram do galpão do portão verde. A primeira levou quarenta minutos.'},
  escolhas:[
    {texto:'Ir embora de Cerulean.', vai:'c29_fim'}
  ]
},

c29_perdeu:{
  texto:[
    'Você perde, e perder aqui não é apanhar: é ele recolher o seu time do chão do quintal, com cuidado até, e te pôr na rua pelo portão da frente.',
    fala('Mitsuo', 'Some.'),
    'Ele fecha o portão verde e você ouve, de fora, a tranca do galpão correndo de volta.',
    'Uma por uma. Trinta e uma vezes.',
    'Leva quatro minutos e você fica na calçada ouvindo os quatro minutos inteiros porque ir embora antes seria pior.'
  ],
  ef:{flag:'perdeu_no_quintal', moral:-4,
      registrar:'Perdeu no quintal do portão verde. Ele trancou as 31 de volta.',
      presagio:'Você ouviu as trinta e uma trancas. Guarde esse som.'},
  escolhas:[
    {texto:'Ir embora de Cerulean.', vai:'c29_fim'}
  ]
},

c29_passou_por_ele:{
  texto:[
    'Você passa por ele e ele deixa passar, e os dois sabem que ele deixou.',
    'No portão da frente, antes de você sair, ele fala:',
    fala('Mitsuo', 'Terça que vem chega outro caminhão.'),
    d=>fala(d.jogador.nome, 'Eu sei.'),
    fala('Mitsuo', 'E eu vou receber.'),
    d=>fala(d.jogador.nome, 'Eu sei.'),
    'Ele segura o portão aberto.',
    fala('Mitsuo', 'Então não volta aqui. Vai no endereço do carimbo.', 'baixo')
  ],
  ef:{flag:'ele_mandou_ir_no_endereco',
      npc:{nome:'Mitsuo', opiniao:2, viuVoce:'Deixou você passar e mandou ir ao endereço do carimbo.'},
      registrar:'Ele mandou você ir ao endereço do carimbo em vez de voltar ali.'},
  escolhas:[
    {texto:'Ir embora de Cerulean.', vai:'c29_fim'}
  ]
},

c29_de_madrugada:{
  texto:[
    'Terça, duas e dez da manhã. A rua de casa baixa não tem um poste funcionando e você já sabia disso.',
    'Você está sentado no meio-fio do outro lado, encostado no poste da lâmpada quebrada, há uma hora e quarenta.',
    'Às duas e dezoito entra o caminhão.',
    'Não é caminhão-baú: é caminhonete de cabine dupla com gaiola na caçamba, coberta com lona, com os vãos amarrados com corda de nylon amarela.',
    'Você já viu essa corda, num caminhão, numa zona industrial, em outra cidade.',
    'O portão verde abre inteiro, o que ele não faz de dia, e a caminhonete entra de ré.',
    'A descarga leva dezoito minutos e é silenciosa de um jeito que custa treino: ninguém fala, ninguém bate gaiola, ninguém acende luz de fora.',
    'Às duas e trinta e seis o portão fecha e a rua volta a ser uma rua.'
  ],
  ef:{flag:['viu_a_descarga','caminhao_gaiola_terca_quinta_sabado','sabe_do_lote_unico'],
      hp:-1, causa:'Noite inteira acordado num meio-fio',
      registrar:'Viu a descarga da madrugada de terça no portão verde: dezoito minutos, sem uma palavra.',
      presagio:'Dezoito minutos em silêncio absoluto não é discrição. É procedimento treinado.'},
  escolhas:[
    {texto:'Anotar a placa.', vai:'c29_a_placa'},
    {texto:'Ir bater no portão agora.', vai:'c29_bateu'},
    {texto:'Dar a volta e ver os fundos com a descarga fresca.', vai:'c29_os_fundos'},
    {texto:'Seguir a caminhonete quando ela sair.', vai:'c29_seguiu_quem_saiu'}
  ]
},

c29_a_placa:{
  texto:[
    'A placa está suja de barro, o que é normal numa caminhonete, e suja de barro só na placa, o que não é.',
    'Você atravessa a rua e se agacha atrás do para-choque e limpa com o polegar, três dígitos por vez, e leva mais tempo do que devia.',
    'Anota no braço, a caneta, porque papel na mão tremendo não funciona.',
    'E quando você está levantando, a porta do motorista abre.',
    'Você fica agachado.',
    'Ele desce, acende um cigarro, fuma metade encostado na lateral da caminhonete a um metro e meio da sua cabeça, e sobe de novo.',
    'Cinco minutos e quarenta.',
    'Você conta cada um.'
  ],
  ef:{flag:['anotou_a_placa_de_cerulean','reika_precisa_de_papel'], hp:-1,
      registrar:'Anotou a placa da caminhonete de descarga do portão verde.'},
  escolhas:[
    {texto:'Seguir a caminhonete.', vai:'c29_seguiu_quem_saiu'},
    {texto:'Ir embora com a placa e o resto.', vai:'c29_fim'},
    {texto:'Dar a volta e ver os fundos.', vai:'c29_os_fundos'}
  ]
},

c29_seguiu_quem_saiu:{
  texto:[
    'Seguir veículo a pé é uma coisa que só funciona em duas situações: trânsito parado e cidade pequena.',
    'Cerulean, às três da manhã, é a segunda.',
    'A caminhonete anda devagar porque a rua é de paralelepípedo e você anda rápido pela calçada, duas quadras atrás, encostado no muro.',
    'Ela atravessa a segunda ponte, pega a marginal do rio e para num posto de gasolina de vinte e quatro horas.',
    'O motorista desce, abastece, entra na conveniência e compra café e um salgado, e fica dez minutos conversando com o frentista do jeito de quem conversa com o mesmo frentista toda terça.',
    'Você entra na conveniência atrás dele e compra um salgado também, porque comprar um salgado é a coisa mais invisível que existe.',
    'E ouve os dez minutos inteiros.'
  ],
  ef:{flag:'seguiu_a_caminhonete',
      registrar:'Seguiu a caminhonete até um posto 24 horas na marginal do rio.'},
  escolhas:[
    {texto:'Ouvir a conversa com o frentista.', vai:'c29_o_frentista'},
    {texto:'Falar com o frentista depois que ele sair.', vai:'c29_o_frentista'},
    {texto:'Voltar e ver os fundos da casa enquanto ele não está.', vai:'c29_os_fundos'}
  ]
},

c29_o_frentista:{
  texto:[
    'A conversa é sobre futebol por sete minutos e sobre o preço do diesel por dois, e no último minuto é sobre outra coisa.',
    fala('o motorista', 'Semana que vem eu não venho terça.'),
    fala('o frentista', 'Férias?'),
    fala('o motorista', 'Que férias. Mudou a rota.'),
    'Ele mexe o café com o palito.',
    fala('o motorista', 'Agora é direto pra Saffron. Corta Cerulean.'),
    fala('o frentista', 'E o cara daqui?'),
    fala('o motorista', 'Sei lá. Fecharam.'),
    'Ele joga o copo no lixo e sai, e o sino da porta toca, e o frentista fica com a expressão de quem perdeu um cliente de terça.',
    'E você fica com a informação de que a casa do portão verde tem os dias contados e de que o que está lá dentro vai pra algum lugar antes de fechar.'
  ],
  ef:{flag:['a_rota_mudou','sabe_do_lote_unico'],
      registrar:'A rota vai mudar: passa a ir direto para Saffron e o ponto de Cerulean fecha.',
      presagio:'Fecham a casa. Trinta e uma gaiolas não desaparecem sozinhas quando uma casa fecha.'},
  escolhas:[
    {texto:'Voltar correndo pros fundos da casa.', vai:'c29_os_fundos'},
    {texto:'Voltar e bater no portão de manhã.', vai:'c29_bateu'},
    {texto:'Ir embora de Cerulean com o que você tem.', vai:'c29_fim'}
  ]
},

c29_fim:{
  texto:[
    'Você sai de Cerulean pela estrada do sul, de manhã cedo, com o barulho de água ficando pra trás pela primeira vez em dias.',
    d=>{
      if (d.flags.as_trinta_e_uma_sairam) return 'Trinta e uma saíram por uma porta de ferro que estava trancada por fora, e a primeira levou quarenta minutos pra entender que podia.';
      if (d.flags.abriu_onze) return 'Onze saíram. Vinte não. Você vai refazer essa conta por um tempo.';
      if (d.flags.fechou_a_tranca) return 'Você ouviu a tranca correndo de volta e foi você que correu, e ninguém nunca vai saber disso além de você.';
      if (d.flags.contou_trinta_e_uma) return 'Trinta e uma gaiolas ocupadas, quatro fileiras, ralo no meio do piso. Você não abriu nenhuma.';
      return 'Você não entrou no galpão e não sabe quantas são, e não saber é pior do que saber, o que é uma descoberta desagradável.';
    },
    d=>{
      const papeis = ['copia_da_agenda','tem_o_saco_de_racao','copia_da_tabela',
                      'tem_o_envelope_do_malote','anotou_a_placa_de_cerulean'].filter(f=>d.flags[f]).length;
      if (papeis >= 3) return `Na mochila tem ${papeis} coisas que, sozinhas, não provam nada, e que juntas são um endereço.`;
      if (papeis >= 1) return `Na mochila tem ${papeis === 1 ? 'uma coisa' : papeis + ' coisas'} que não prova nada sozinha.`;
      return 'Na mochila não tem nada. Só o que você viu, e o que você viu não é documento.';
    },
    'Lavender fica a três dias a pé, e dizem que lá tem uma torre de sete andares.',
    'Dizem também que a cidade não tem música, e ninguém explica isso direito.'
  ],
  fim:true, resumo:'A casa do portão verde: alvará na parede, trinta e uma gaiolas no fundo e um carimbo da Rua do Comércio, 118.'
}

}
});
