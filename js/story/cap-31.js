/* ============================================================
   CAPÍTULO 31 — QUEM ASSINA O FAX  (Celadon)  · CONDICIONAL

   Só acontece pra quem foi seguido por segurança privada em
   Celadon e descobriu que existe uma lista que chega por fax na
   sede da Associação Comercial toda segunda-feira.

   O fax tem cabeçalho. Ninguém nunca perguntou de quem é.
   ============================================================ */
const C31_ABERTURAS = ['c31_a_sede', 'c31_a_loja', 'c31_o_papel_termico'];
function c31_cabe(id, d){
  if (id === 'c31_o_papel_termico') return !!d.flags.o_fax_tem_cabecalho;
  return true;
}
function c31_abertura(d){ return Dados.escolher(C31_ABERTURAS.filter(id => c31_cabe(id, d))); }

CAPITULOS.push(
{
num:31, titulo:'Quem Assina o Fax', local:'Celadon — Associação Comercial da Avenida Cinco', ambiente:'cidade', nivelArea:33,
tom:'muito sombrio',
requer: d => !!(d.flags.a_lista_da_associacao || d.flags.o_fax_tem_cabecalho ||
                d.flags.seguranca_privada_te_seguiu),
proximo: d => 10,
entradas:C31_ABERTURAS,
inicio: d => c31_abertura(d),
cenas:{

c31_a_sede:{
  texto:[
    'A Associação Comercial da Avenida Cinco funciona no sobrado de uma loja de tecido e tem uma placa de bronze do tamanho de uma folha de caderno, gasta no canto de baixo de tanto ser limpa.',
    'Lá em cima é uma sala só: quatro mesas, um bebedouro, um quadro com o retrato de doze presidentes anteriores, e um aparelho de fax numa mesinha separada, no canto, com uma cesta embaixo.',
    'Quem atende é uma mulher de uns sessenta anos que é a secretária da associação há vinte e dois, e que tem uma placa de mesa de acrílico com o nome: MAUDE LAUREL — SECRETARIA EXECUTIVA.',
    fala('Sra. Laurel', 'Associado?'),
    d=>fala(d.jogador.nome, 'Não.'),
    fala('Sra. Laurel', 'Vendedor?'),
    d=>fala(d.jogador.nome, 'Não.'),
    'Ela tira os óculos de leitura.',
    fala('Sra. Laurel', 'Então {o senhor|a senhora} é do terceiro tipo, que é o que vem reclamar de alguma coisa.'),
    fala('Sra. Laurel', 'Senta aí que eu faço um café.')
  ],
  ef:{flag:'achou_a_associacao',
      npc:{nome:'Sra. Laurel', opiniao:1, viuVoce:'Te classificou como o terceiro tipo e foi fazer café.'},
      registrar:'A Associação Comercial da Avenida Cinco funciona no sobrado de uma loja de tecido.'},
  escolhas:[
    {texto:'Perguntar da lista que chega por fax.', vai:'c31_a_lista'},
    {texto:'Perguntar da segurança de polo azul.', vai:'c31_a_seguranca'},
    {texto:'Olhar o aparelho de fax e a cesta embaixo.', vai:'c31_o_papel_termico'}
  ]
},

c31_a_loja:{
  texto:[
    'Vinte e duas lojas pagam a segurança de polo azul da Avenida Cinco e você entra na primeira que tem a porta aberta, que é uma papelaria.',
    'O dono tem uns cinquenta anos, chama-se Alder — está escrito na fachada, em letra de fachada de papelaria de bairro — e está remarcando preço de caderno com uma etiquetadora.',
    d=>fala(d.jogador.nome, 'O senhor paga a segurança da associação?'),
    fala('Sr. Alder', 'Pago. Quarenta e dois por mês.'),
    d=>fala(d.jogador.nome, 'E o senhor sabe o que eles fazem?'),
    'Ele para a etiquetadora.',
    fala('Sr. Alder', 'Andam na calçada.'),
    d=>fala(d.jogador.nome, 'E a lista?'),
    'Ele volta a etiquetar, dois cadernos, e só responde no terceiro.',
    fala('Sr. Alder', 'Ah. Você sabe da lista.'),
    fala('Sr. Alder', 'Eu perguntei da lista numa assembleia, faz uns dois anos.'),
    d=>fala(d.jogador.nome, 'E?'),
    fala('Sr. Alder', 'E me explicaram que é um serviço de prevenção e que vinte e uma lojas acham ótimo.'),
    'Ele põe a etiquetadora na bancada.',
    fala('Sr. Alder', 'Vinte e uma de vinte e duas. Faz dois anos que eu sou a vigésima segunda em tudo.', 'baixo')
  ],
  ef:{flag:['o_dono_da_papelaria','a_lista_da_associacao'],
      npc:{nome:'Sr. Alder', opiniao:2, viuVoce:'É o único dos vinte e dois que já questionou a lista em assembleia.'},
      registrar:'Um dos 22 lojistas questionou a lista em assembleia há dois anos e perdeu por 21 a 1.'},
  escolhas:[
    {texto:'Perguntar se ele tem a ata daquela assembleia.', vai:'c31_a_ata_da_assembleia'},
    {texto:'Ir até a sede da associação.', vai:'c31_a_sede'},
    {texto:'Perguntar se ele já viu a lista.', vai:'c31_ele_viu_a_lista'}
  ]
},

c31_a_ata_da_assembleia:{
  texto:[
    d=>fala(d.jogador.nome, 'O senhor tem a ata daquela assembleia?'),
    fala('Sr. Alder', 'Tenho a de todas. Vinte e seis anos de associado.'),
    'Ele sobe no banquinho e tira uma pasta de arquivo morto de cima do armário, e a pasta é pesada e levanta poeira.',
    'Ele acha a ata em quatro minutos porque ele sabe exatamente qual é.',
    'É uma folha datilografada, com a assinatura de dezesseis presentes, e no item quatro da pauta:',
    '**"4. Manifestação do associado sobre a relação de acompanhamento recebida semanalmente. Esclarecido que o serviço é prestado por convênio e que a relação é fornecida por entidade conveniada. Aprovada a manutenção por 21 votos a 1."**',
    'Entidade conveniada.',
    'A ata não diz qual. A ata não precisou dizer qual, porque ninguém perguntou depois do "21 a 1".',
    fala('Sr. Alder', 'Leva. Eu tenho cópia.')
  ],
  ef:{flag:['a_ata_da_associacao','reika_precisa_de_papel','sabe_do_lote_unico'],
      registrar:'A ata da associação registra que a lista é fornecida por "entidade conveniada", sem nomear qual.',
      presagio:'Entidade conveniada. Quem não quer ser nomeado assina como categoria.'},
  escolhas:[
    {texto:'Ir até a sede da associação com a ata.', vai:'c31_a_sede'},
    {texto:'Perguntar se ele já viu a lista.', vai:'c31_ele_viu_a_lista'}
  ]
},

c31_ele_viu_a_lista:{
  texto:[
    fala('Sr. Alder', 'Vi uma vez. Caiu no chão da sede e eu peguei.'),
    d=>fala(d.jogador.nome, 'E o que tinha?'),
    fala('Sr. Alder', 'Nome, idade, cidade de origem e uma coluna de observação.'),
    'Ele tira os óculos e limpa na barra da camisa, o que é o gesto dele pra ganhar tempo.',
    fala('Sr. Alder', 'Uns quarenta nomes. Quase tudo gente nova.'),
    d=>fala(d.jogador.nome, 'O que tinha na coluna de observação?'),
    fala('Sr. Alder', 'Coisa curta. "Perguntou por carga." "Esteve no terminal." "Fotografou."'),
    'Ele põe os óculos de volta.',
    fala('Sr. Alder', 'E num tinha uma coisa que eu não esqueci: "acompanhar até sair da cidade".'),
    fala('Sr. Alder', 'É uma lista de quem anda perguntando, {moço|moça}.', 'baixo')
  ],
  ef:{flag:['o_que_tem_na_lista','sabe_do_lote_unico'],
      registrar:'A lista tem nome, idade, cidade e observações como "perguntou por carga" e "acompanhar até sair da cidade".',
      presagio:'Não é lista de ladrão. É lista de quem pergunta.'},
  escolhas:[
    {texto:'Ir até a sede e pedir pra ver a lista.', vai:'c31_a_lista'},
    {texto:'Pedir a ata da assembleia.', vai:'c31_a_ata_da_assembleia'}
  ]
},

c31_a_seguranca:{
  texto:[
    fala('Sra. Laurel', 'A segurança é terceirizada. Tem contrato, tem nota, tem tudo.'),
    'Ela serve o café em copo de vidro grosso e senta do outro lado da mesa dela.',
    fala('Sra. Laurel', 'São quatro rapazes em dois turnos. Todos daqui.'),
    d=>fala(d.jogador.nome, 'E a lista que eles recebem?'),
    'Ela toma o café dela.',
    fala('Sra. Laurel', 'Eu recebo o fax e eu tiro quatro cópias e eu ponho no escaninho dos quatro.'),
    d=>fala(d.jogador.nome, 'E a senhora lê?'),
    fala('Sra. Laurel', 'Eu leio tudo que passa pela minha mão. É o meu serviço.'),
    'Ela põe o copo na mesa.',
    fala('Sra. Laurel', 'Eu leio há dois anos e três meses e eu vou te falar uma coisa que eu não falo em assembleia.'),
    fala('Sra. Laurel', 'Semana passada tinha uma menina de treze anos naquela lista.', 'baixo')
  ],
  ef:{flag:['a_menina_de_treze_na_lista','a_lista_da_associacao'],
      npc:{nome:'Sra. Laurel', opiniao:2, viuVoce:'Te contou da menina de treze anos que apareceu na lista semana passada.'},
      registrar:'Havia uma menina de treze anos na lista de acompanhamento da semana passada.'},
  escolhas:[
    {texto:'Pedir pra ver a lista.', vai:'c31_a_lista'},
    {texto:'Perguntar o que estava escrito na observação dela.', vai:'c31_a_observacao_da_menina'},
    {texto:'Olhar o aparelho de fax.', vai:'c31_o_papel_termico'}
  ]
},

c31_a_observacao_da_menina:{
  texto:[
    'Ela levanta, vai até um escaninho e volta com uma folha, sem pedir licença pra ninguém, porque ela é a secretária há vinte e dois anos e o escaninho é dela.',
    'Passa o dedo pela coluna e para.',
    fala('Sra. Laurel', '"Perguntou na banca sobre os caminhões brancos."'),
    'Ela vira a folha pra você ver.',
    'Nome, treze anos, Celadon. E a observação.',
    fala('Sra. Laurel', 'Treze anos. Perguntou numa banca de jornal.'),
    d=>fala(d.jogador.nome, 'E o que a segurança faz com isso?'),
    fala('Sra. Laurel', 'Acompanha. É o que está escrito no contrato: acompanhamento preventivo.'),
    'Ela dobra a folha em quatro, sem pressa, e põe na sua mão.',
    fala('Sra. Laurel', 'Eu tenho uma neta de doze.', 'baixo')
  ],
  ef:{flag:['tem_a_lista_da_semana','reika_precisa_de_papel','sabe_do_lote_unico'],
      rep:{eixo:'bom', delta:1, motivo:'Uma secretária de vinte e dois anos de casa te entregou a lista da semana.'},
      npc:{nome:'Sra. Laurel', opiniao:4, viuVoce:'Te entregou a lista da semana, com a menina de treze anos nela.'},
      registrar:'Está com a lista de acompanhamento da semana, com uma menina de treze anos e a observação dela.'},
  escolhas:[
    {texto:'Perguntar de onde vem o fax.', vai:'c31_o_papel_termico'},
    {texto:'Ir procurar a menina na banca de jornal.', vai:'c31_a_banca'}
  ]
},

c31_a_lista:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu posso ver a lista?'),
    'A secretária não hesita, e é isso que te desmonta.',
    fala('Sra. Laurel', 'Pode. É documento da associação e {o senhor|a senhora} pode pedir vista.'),
    'Ela traz a última e põe na mesa, virada pra você, e senta do outro lado com o café dela.',
    'Quarenta e um nomes. Nome, idade, cidade de origem, observação.',
    d=>{
      const r = Estado.nomeRep();
      if (Estado.rep.eixo === 'ruim' && Estado.rep.ruim >= 3)
        return `O seu nome está na linha dezenove. Na observação: "${r} — acompanhar até sair da cidade."`;
      return 'O seu nome não está. Você procura três vezes, de cima pra baixo, e não está, e é um alívio e é uma decepção ao mesmo tempo e você não vai contar isso pra ninguém.';
    },
    'Das quarenta e uma observações, trinta e quatro são variações da mesma coisa: perguntou, olhou, esteve, fotografou.',
    'As outras sete são "acompanhar até sair da cidade".'
  ],
  ef:{flag:['viu_a_lista_inteira','a_lista_da_associacao'],
      registrar:'A lista tem 41 nomes. 34 observações são de perguntar ou olhar; 7 são "acompanhar até sair da cidade".'},
  escolhas:[
    {texto:'Pedir uma cópia.', vai:'c31_a_copia_da_lista'},
    {texto:'Perguntar de onde vem o fax.', vai:'c31_o_papel_termico'},
    {texto:'Perguntar o que acontece com os sete.', vai:'c31_os_sete_acompanhados'}
  ]
},

c31_os_sete_acompanhados:{
  texto:[
    d=>fala(d.jogador.nome, 'O que acontece com os sete?'),
    fala('Sra. Laurel', 'Os rapazes andam atrás até eles pegarem estrada.'),
    d=>fala(d.jogador.nome, 'Só isso?'),
    fala('Sra. Laurel', 'Até onde eu sei, só isso.'),
    'Ela gira o copo de café na mesa, meia volta.',
    fala('Sra. Laurel', 'E eu faço questão de dizer "até onde eu sei" porque eu não sei.'),
    fala('Sra. Laurel', 'Eu tiro quatro cópias e ponho em quatro escaninhos. O que acontece depois não passa pela minha mão e eu escolhi não perguntar por dois anos.'),
    'Ela olha pro quadro dos doze presidentes anteriores.',
    fala('Sra. Laurel', 'Eu trabalhei com todos esses doze. Nenhum deles teria assinado esse convênio.'),
    fala('Sra. Laurel', 'O décimo terceiro assinou em quarenta minutos de assembleia.', 'frio')
  ],
  ef:{flag:'o_decimo_terceiro_presidente',
      registrar:'O convênio da lista foi assinado pelo 13º presidente da associação, em quarenta minutos de assembleia.'},
  escolhas:[
    {texto:'Pedir cópia da lista e do convênio.', vai:'c31_a_copia_da_lista'},
    {texto:'Perguntar de onde vem o fax.', vai:'c31_o_papel_termico'}
  ]
},

c31_a_copia_da_lista:{
  texto:[
    'Ela tira a cópia na copiadora da sala, que é uma máquina de mesa que faz barulho de secador, e carimba com o carimbo da associação.',
    fala('Sra. Laurel', 'Confere com o original. É a fórmula.'),
    'Ela assina embaixo do carimbo, com o nome completo e o cargo, em letra de quem assina cinquenta coisas por dia: **Maude Laurel, Secretária Executiva**.',
    d=>fala(d.jogador.nome, 'A senhora não tem medo?'),
    'Ela guarda a caneta no porta-lápis, de pé, com a ponta pra cima.',
    fala('Sra. Laurel', 'Eu tenho sessenta e um anos e vinte e dois de associação e um contrato que não me deixa ser demitida sem justa causa.'),
    fala('Sra. Laurel', 'E eu acabei de carimbar um documento público a pedido de um cidadão, que é literalmente o meu cargo.'),
    'Ela empurra a cópia.',
    fala('Sra. Laurel', 'Se isso for justa causa, eu quero muito ver escrito.')
  ],
  ef:{flag:['copia_da_lista_carimbada','reika_precisa_de_papel'],
      rep:{eixo:'bom', delta:1, motivo:'Obteve a lista de acompanhamento carimbada e assinada pela secretária da associação.'},
      npc:{nome:'Sra. Laurel', opiniao:5, viuVoce:'Carimbou e assinou a cópia da lista com nome e cargo.'},
      registrar:'Está com a cópia carimbada e assinada da lista de acompanhamento da Avenida Cinco.'},
  escolhas:[
    {texto:'Perguntar de onde vem o fax.', vai:'c31_o_papel_termico'},
    {texto:'Ir procurar a menina de treze anos.', vai:'c31_a_banca'},
    {texto:'Sair de Celadon com isso.', vai:'c31_fim'}
  ]
},

c31_o_papel_termico:{
  texto:[
    'O aparelho de fax fica numa mesinha no canto e é um modelo de papel térmico, daqueles de rolo, que já era antigo quando foi comprado.',
    'Papel térmico apaga. Em dois anos vira uma folha cinza em branco, e é por isso que quem trabalha com papel térmico tira cópia de tudo.',
    'Embaixo da mesinha tem uma cesta de lixo de vime.',
    'E na cesta tem o rolo usado da semana, enrolado, porque o rolo só é trocado quando acaba e o acabado fica na cesta até a faxina de sexta.',
    'Hoje é quinta.',
    'O rolo usado de um fax térmico guarda, em negativo, tudo que passou por ele desde a última troca.',
    'Você olha pra secretária.',
    'Ela olha pro rolo. Depois pra você. Depois volta pro computador dela e começa a digitar uma coisa com muita atenção.'
  ],
  ef:{flag:'o_rolo_na_cesta',
      presagio:'Ela está digitando com atenção demais. Isso é uma permissão.'},
  escolhas:[
    {texto:'Pegar o rolo.', vai:'c31_pegou_o_rolo'},
    {texto:'Perguntar antes se pode pegar.', vai:'c31_pediu_o_rolo'},
    {texto:'Não pegar. Pedir cópia da lista da semana.', vai:'c31_a_copia_da_lista'}
  ]
},

c31_pediu_o_rolo:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu posso levar o rolo do lixo?'),
    'Ela para de digitar.',
    fala('Sra. Laurel', 'Ai, {meu filho|minha filha}.'),
    'Ela tira os óculos.',
    fala('Sra. Laurel', 'Você tinha que ter pegado.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('Sra. Laurel', 'Porque agora eu sei que você pegou, e eu não posso dizer que não sabia.'),
    'Ela suspira e põe os óculos de volta.',
    fala('Sra. Laurel', 'Leva. Eu não vou mentir se me perguntarem, e ninguém vai me perguntar, porque ninguém nesse prédio sabe o que é papel térmico.'),
    fala('Sra. Laurel', 'E da próxima vez que alguém te deixar sozinh{o|a} numa sala com uma cesta de lixo, entende o favor.', 'baixo')
  ],
  ef:{flag:['tem_o_rolo_termico','reika_precisa_de_papel'],
      npc:{nome:'Sra. Laurel', opiniao:3, viuVoce:'Te deixou levar o rolo depois de você estragar o favor perguntando.'},
      registrar:'Está com o rolo usado do fax térmico da associação.'},
  escolhas:[
    {texto:'Perguntar o que fazer com o rolo.', vai:'c31_o_que_tem_no_rolo'},
    {texto:'Sair de Celadon com ele.', vai:'c31_fim'}
  ]
},

c31_pegou_o_rolo:{
  texto:[
    'Você abaixa, tira o rolo da cesta de vime e guarda na mochila, e leva quatro segundos.',
    'A secretária continua digitando com muita atenção e não olha uma vez.',
    'Quando você levanta, ela fala, pra tela do computador:',
    fala('Sra. Laurel', 'A faxina é sexta e a cesta é esvaziada antes das oito.'),
    'Ela digita mais uma linha.',
    fala('Sra. Laurel', 'Eu não vi nada e ninguém me perguntou nada.'),
    'E continua digitando, e você sai, e essa é a última coisa que ela te diz.'
  ],
  ef:{flag:['tem_o_rolo_termico','reika_precisa_de_papel'],
      npc:{nome:'Sra. Laurel', opiniao:4, viuVoce:'Digitou de costas enquanto você pegava o rolo da cesta.'},
      registrar:'Está com o rolo usado do fax térmico da associação.',
      presagio:'Ela falou o horário da faxina antes de você perguntar. Ela planejou isso.'},
  escolhas:[
    {texto:'Procurar alguém que saiba ler papel térmico usado.', vai:'c31_o_que_tem_no_rolo'},
    {texto:'Ir procurar a menina de treze anos.', vai:'c31_a_banca'},
    {texto:'Sair de Celadon com o rolo.', vai:'c31_fim'}
  ]
},

c31_o_que_tem_no_rolo:{
  texto:[
    'Quem sabe ler rolo térmico usado, em Celadon, é quem trabalha com revelação.',
    'Tem um laboratório fotográfico na avenida sete que revela em uma hora e que tem um quarto escuro nos fundos, e o dono tem uns quarenta e cinco anos e uma paciência infinita pra explicar coisa técnica.',
    fala('o revelador', 'Isso aqui não é foto.'),
    d=>fala(d.jogador.nome, 'Eu sei. É rolo de fax usado.'),
    'Ele desenrola vinte centímetros e vira contra a luz da bancada.',
    fala('o revelador', 'Ó, dá pra ler. Fica ao contrário e fica fraco, mas dá.'),
    'Ele prende o rolo em dois clipes e acende uma luminária de mesa por baixo.',
    'E ali, em negativo, ao contrário, fraco, está tudo que passou pelo fax da Associação Comercial da Avenida Cinco nas últimas nove semanas.',
    'Nove listas. Nove cabeçalhos.',
    'E o cabeçalho é o mesmo nas nove: um número de origem, uma data, uma hora, e um nome de aparelho, que é aquele nome que a pessoa cadastra no fax e que ninguém nunca troca.',
    'O nome do aparelho é uma sigla de cinco caracteres.',
    d=>d.flags.livro_de_destinos ? 'Você já viu essa sigla escrita à mão num livro de destinos.' : 'Cinco caracteres, e nenhum deles é uma palavra.'
  ],
  ef:{flag:['leu_o_rolo','sabe_o_nome_da_comissao','sabe_do_lote_unico'],
      npc:{nome:'o revelador', opiniao:2, viuVoce:'Leu com você nove semanas de fax num rolo térmico usado.'},
      registrar:'O rolo térmico traz nove semanas de listas, todas com o mesmo nome de aparelho: a sigla.'},
  escolhas:[
    {texto:'Pedir pra ele fotografar o rolo inteiro.', vai:'c31_fotografou_o_rolo'},
    {texto:'Ir procurar a menina de treze anos.', vai:'c31_a_banca'},
    {texto:'Sair de Celadon com isso.', vai:'c31_fim'}
  ]
},

c31_fotografou_o_rolo:{
  texto:[
    'Ele monta o rolo numa mesa de luz com o vidro fosco, prende com clipe, e fotografa em trechos de trinta centímetros com uma máquina de fole em cima de um tripé.',
    'Quarenta e uma fotos.',
    'Revela na hora, no quarto escuro dos fundos, e sai com quarenta e uma cópias em papel brilhante, ainda cheirando a fixador.',
    'Nas quarenta e uma dá pra ler o cabeçalho.',
    d=>fala(d.jogador.nome, 'Quanto é?'),
    'Ele empilha as fotos e bate na bancada pra alinhar.',
    fala('o revelador', 'Nada.'),
    d=>fala(d.jogador.nome, 'Como assim nada?'),
    fala('o revelador', 'Eu revelo foto de casamento e foto de formatura há dezenove anos.'),
    'Ele põe a pilha na sua mão.',
    fala('o revelador', 'Hoje eu revelei outra coisa. Deixa comigo.', 'baixo')
  ],
  ef:{flag:['fotografou_o_rolo','reika_precisa_de_papel'],
      rep:{eixo:'bom', delta:1, motivo:'Um revelador de Celadon fotografou nove semanas de fax e não cobrou.'},
      npc:{nome:'o revelador', opiniao:4, viuVoce:'Fotografou e revelou o rolo inteiro e não cobrou nada.'},
      registrar:'Tem 41 fotografias legíveis do rolo térmico, com o cabeçalho em todas.'},
  escolhas:[
    {texto:'Ir procurar a menina de treze anos.', vai:'c31_a_banca'},
    {texto:'Sair de Celadon com as quarenta e uma.', vai:'c31_fim'}
  ]
},

c31_a_banca:{
  texto:[
    'A banca de jornal é na esquina da Avenida Cinco com a rua do mercado e o jornaleiro tem uns quarenta anos e uma televisãozinha ligada no balcão.',
    d=>fala(d.jogador.nome, 'Tem uma menina de uns treze que veio aqui semana passada perguntar de caminhão branco?'),
    'Ele demora meio segundo.',
    fala('o jornaleiro da cinco', 'A Cleo.'),
    d=>fala(d.jogador.nome, 'Você conhece?'),
    fala('o jornaleiro da cinco', 'Ela compra revista de Pokémon aqui desde os oito anos. Toda quinta.'),
    'Ele aponta com o queixo pra prateleira de revista, onde tem uma publicação de capa colorida sobre criação.',
    fala('o jornaleiro da cinco', 'Ela perguntou porque viu os caminhões passando no fim da rua dela de madrugada.'),
    'E aí ele olha pros lados, o que ele não tinha feito até agora.',
    fala('o jornaleiro da cinco', 'E ela não veio essa quinta.', 'baixo')
  ],
  ef:{flag:'a_kazu',
      registrar:'A menina da lista se chama Cleo, compra revista na banca desde os oito anos, e não apareceu esta quinta.'},
  escolhas:[
    {texto:'Perguntar onde ela mora.', vai:'c31_a_casa_da_kazu'},
    {texto:'Voltar à associação e cobrar a segurança.', vai:'c31_cobrou_a_seguranca'},
    {texto:'Sair de Celadon com o que você tem.', vai:'c31_fim'}
  ]
},

c31_a_casa_da_kazu:{
  texto:[
    'É uma casa de vila, com portão de grade e uma bicicleta rosa encostada na parede da garagem.',
    'Quem atende é a mãe dela, de uns trinta e cinco anos, com um pano de prato no ombro.',
    d=>fala(d.jogador.nome, 'A Cleo tá?'),
    fala('a mãe da Cleo', 'Tá. Ela tá de castigo.'),
    'A resposta mais banal possível derruba metade da tensão da sua barriga de uma vez.',
    d=>fala(d.jogador.nome, 'De castigo por quê?'),
    fala('a mãe da Cleo', 'Porque ela saiu de madrugada pra tirar foto de caminhão.'),
    'A mãe suspira do jeito que só mãe de menina de treze anos suspira.',
    fala('a mãe da Cleo', 'Semana passada. Duas da manhã, com a máquina do pai dela.'),
    d=>fala(d.jogador.nome, 'Ela tirou foto?'),
    fala('a mãe da Cleo', 'Tirou. E o filme tá lá, e ela não quer que ninguém revele porque ela acha que é prova de alguma coisa.'),
    'Ela vira pra dentro de casa.',
    fala('a mãe da Cleo', 'Cleo! Tem {um menino|uma menina} aqui perguntando do teu caminhão!', 'grita')
  ],
  ef:{flag:'achou_a_kazu',
      npc:{nome:'a mãe da Cleo', opiniao:1, viuVoce:'Te recebeu no portão e chamou a filha.'},
      registrar:'Cleo está bem, de castigo, e tem um filme não revelado com fotos dos caminhões.'},
  escolhas:[
    {texto:'Falar com a Cleo.', vai:'c31_falou_com_a_kazu'},
    {texto:'Avisar a mãe da lista antes.', vai:'c31_avisou_a_mae'}
  ]
},

c31_avisou_a_mae:{
  texto:[
    d=>fala(d.jogador.nome, 'A senhora precisa saber de uma coisa antes.'),
    'Você conta da lista. Conta do fax, conta da observação, e conta que tem quatro rapazes de polo azul com o nome e a idade da filha dela num escaninho.',
    'A mãe ouve sem interromper e o pano de prato do ombro dela desce pra mão e ela torce o pano de prato o tempo todo.',
    'Quando você termina, ela fica quieta uns dez segundos.',
    fala('a mãe da Cleo', 'Ela tem treze anos.'),
    d=>fala(d.jogador.nome, 'Eu sei.'),
    fala('a mãe da Cleo', 'Ela tem treze anos e um aparelho nos dentes e dorme com a luz do corredor acesa.'),
    'Ela solta o pano de prato.',
    fala('a mãe da Cleo', 'Onde é essa associação?'),
    'E é assim que você descobre uma coisa sobre esses três dias: você passou três dias juntando papel e a mãe da Cleo vai resolver isso numa tarde.'
  ],
  ef:{flag:['a_mae_vai_na_associacao','sabe_do_lote_unico'], moral:2,
      rep:{eixo:'bom', delta:2, motivo:'Avisou a mãe de uma menina de treze anos que o nome dela estava numa lista de acompanhamento.'},
      npc:{nome:'a mãe da Cleo', opiniao:5, viuVoce:'Você contou da lista antes de falar com a filha dela.'},
      registrar:'A mãe da Cleo vai à Associação Comercial cobrar explicação.',
      presagio:'Vinte e uma lojas votaram a favor da lista. Nenhuma delas tinha uma mãe na porta.'},
  escolhas:[
    {texto:'Falar com a Cleo.', vai:'c31_falou_com_a_kazu'},
    {texto:'Ir junto com a mãe até a associação.', vai:'c31_cobrou_a_seguranca'}
  ]
},

c31_falou_com_a_kazu:{
  texto:[
    'Ela tem treze anos, aparelho nos dentes e uma revista de criação dobrada no bolso de trás, e ela te olha com a desconfiança exata de quem já foi chamada de criança hoje.',
    fala('Cleo', 'Você é da polícia?'),
    d=>fala(d.jogador.nome, 'Não.'),
    fala('Cleo', 'Da associação?'),
    d=>fala(d.jogador.nome, 'Não.'),
    fala('Cleo', 'Então você é o quê?'),
    d=>fala(d.jogador.nome, 'Eu também tô perguntando dos caminhões.'),
    'A cara dela muda completamente.',
    fala('Cleo', 'ESPERA.', 'grita'),
    'Ela some pra dentro de casa e volta em quarenta segundos com um filme de trinta e seis poses numa caixinha preta, e com um caderno.',
    'O caderno tem data, hora e placa. Onze entradas, nas últimas cinco semanas, todas entre uma e três da manhã.',
    fala('Cleo', 'Eu comecei em setembro. Ninguém acreditou em mim.')
  ],
  ef:{flag:['o_caderno_da_kazu','reika_precisa_de_papel','sabe_do_lote_unico'],
      npc:{nome:'Cleo', opiniao:4, viuVoce:'Você foi a primeira pessoa a acreditar nela.'},
      registrar:'Cleo tem onze registros de placa, data e hora dos caminhões, e um filme de 36 poses não revelado.'},
  escolhas:[
    {texto:'Levar o filme pro revelador da avenida sete.', vai:'c31_revelou_o_filme'},
    {texto:'Dizer pra ela parar de sair de madrugada.', vai:'c31_mandou_parar'},
    {texto:'Copiar o caderno e deixar o filme com ela.', vai:'c31_copiou_o_caderno'}
  ]
},

c31_revelou_o_filme:{
  texto:[
    'O revelador da avenida sete revela em uma hora e vocês esperam a uma hora inteira sentados no meio-fio da frente, porque a Cleo se recusa a ir embora e deixar o filme dela com um estranho.',
    'Trinta e seis poses. Vinte e nove saem pretas, porque fotografar de madrugada com filme comum e sem tripé dá nisso.',
    'Sete prestam.',
    'Em quatro dá pra ver a traseira de um caminhão com gaiola sob lona.',
    'Em duas dá pra ver a placa.',
    'E numa — a última do rolo, que ela tirou correndo — dá pra ver o portão de um galpão subindo e, do lado de dentro, sob a luz, três fileiras de gaiola empilhadas.',
    'Ela olha essa foto por um tempo longo e não fala nada.',
    fala('Cleo', 'Eu achei que era ração.'),
    'Ela guarda a foto no bolso da frente, não no de trás, que é onde ela guarda o que é importante.'
  ],
  ef:{flag:['as_fotos_da_kazu','reika_precisa_de_papel','sabe_do_lote_unico'], moral:1,
      rep:{eixo:'bom', delta:2, motivo:'Revelou com a Cleo o filme que ninguém tinha acreditado nela.'},
      npc:{nome:'Cleo', opiniao:6, viuVoce:'Estava do seu lado quando a foto do galpão saiu da revelação.'},
      registrar:'Sete fotos legíveis: quatro da traseira com gaiola, duas da placa e uma do interior de um galpão.'},
  escolhas:[
    {texto:'Dizer pra ela parar de sair de madrugada.', vai:'c31_mandou_parar'},
    {texto:'Sair de Celadon com as fotos.', vai:'c31_fim'}
  ]
},

c31_copiou_o_caderno:{
  texto:[
    'Você copia as onze entradas à mão e devolve o caderno, e devolver o caderno é a parte que importa.',
    fala('Cleo', 'Você não vai levar?'),
    d=>fala(d.jogador.nome, 'É seu.'),
    'Ela fica com o caderno nas duas mãos e não sabe o que fazer com a cara.',
    fala('Cleo', 'Todo mundo que eu mostrei falou pra eu parar.'),
    d=>fala(d.jogador.nome, 'Eu também vou falar. Só não agora.'),
    'Ela ri, e é a primeira coisa de treze anos que ela faz na conversa inteira.'
  ],
  ef:{flag:['copia_do_caderno_da_kazu','reika_precisa_de_papel'], moral:1,
      npc:{nome:'Cleo', opiniao:5, viuVoce:'Você copiou o caderno e devolveu em vez de levar.'},
      registrar:'Copiou as onze entradas do caderno da Cleo e devolveu o caderno.'},
  escolhas:[
    {texto:'Dizer pra ela parar de sair de madrugada.', vai:'c31_mandou_parar'},
    {texto:'Levar o filme pra revelar.', vai:'c31_revelou_o_filme'},
    {texto:'Sair de Celadon.', vai:'c31_fim'}
  ]
},

c31_mandou_parar:{
  texto:[
    d=>fala(d.jogador.nome, 'Para de sair de madrugada.'),
    fala('Cleo', 'Por quê? Você sai.'),
    'É a melhor resposta possível e você não tem contra-argumento nenhum que não seja a idade dela, que é exatamente o argumento que todo adulto usou com você nos últimos meses.',
    d=>fala(d.jogador.nome, 'Porque tem uma lista com o seu nome nela.'),
    'Isso funciona. Não do jeito que você queria: ela não fica com medo.',
    fala('Cleo', 'Tem uma lista com o MEU nome?'),
    'Ela fala isso com um orgulho que você reconhece imediatamente porque você já sentiu ele.',
    d=>fala(d.jogador.nome, 'Cleo.'),
    fala('Cleo', 'Tá bom, tá bom.'),
    'E você sabe, e ela sabe que você sabe, que ela vai sair de madrugada de novo.',
    'A única coisa que você consegue é fazer ela prometer anotar pra quem ligar se alguma coisa acontecer, e ela promete, e anota o nome de três pessoas, e a terceira é você.'
  ],
  ef:{flag:'a_kazu_prometeu', moral:1,
      npc:{nome:'Cleo', opiniao:5, viuVoce:'Anotou o seu nome como terceira pessoa pra quem ligar.'},
      registrar:'Cleo anotou três nomes pra ligar se algo acontecer. O terceiro é o seu.',
      presagio:'Você é o terceiro nome de uma lista de emergência de uma menina de treze anos.'},
  escolhas:[
    {texto:'Levar o filme pra revelar antes de sair.', vai:'c31_revelou_o_filme'},
    {texto:'Sair de Celadon.', vai:'c31_fim'}
  ]
},

c31_cobrou_a_seguranca:{
  texto:[
    'Você volta na sede da associação e dessa vez tem gente: três lojistas e o presidente, que é um homem de uns cinquenta anos de camisa social azul-clara com o punho dobrado duas vezes.',
    'Ele é simpático. Ele é muito simpático, e ele é simpático do jeito que se é simpático com alguém que a gente pretende não levar a sério.',
    fala('o presidente da associação', '{Rapaz|Moça}, eu entendo a preocupação. Eu entendo mesmo.'),
    fala('o presidente da associação', 'Mas o acompanhamento preventivo é um serviço contratado por vinte e duas lojas que foram assaltadas quarenta e uma vezes em dois anos.'),
    d=>fala(d.jogador.nome, 'E a menina de treze anos?'),
    'Ele abre as mãos.',
    fala('o presidente da associação', 'Eu não faço a lista. A lista vem da entidade conveniada.'),
    d=>fala(d.jogador.nome, 'Qual entidade?'),
    'E aí ele faz uma coisa que resume a tarde: ele olha pra secretária.',
    'E a secretária, que está sentada na mesa dela há vinte e dois anos, responde antes dele:',
    fala('Sra. Laurel', 'Está no convênio, doutor. Eu pego pro senhor.', 'baixo')
  ],
  ef:{flag:'a_secretaria_foi_pegar',
      registrar:'O presidente da associação não sabe qual é a entidade conveniada. A secretária foi buscar o convênio.'},
  escolhas:[
    {texto:'Esperar ela voltar com o convênio.', vai:'c31_o_convenio'},
    {texto:'Ir embora antes que ele mude de ideia.', vai:'c31_fim'}
  ]
},

c31_o_convenio:{
  texto:[
    'Ela volta com uma pasta de elástico e tira três folhas grampeadas e põe na mesa do presidente, virada pra você.',
    'O presidente lê a primeira página pela primeira vez na vida dele, o que dá pra ver pelo jeito que ele acompanha com o dedo.',
    'Na cláusula primeira, o objeto: "fornecimento de relação de acompanhamento preventivo".',
    'No preâmbulo, as partes.',
    d=>{
      const onde = [];
      if (d.flags.livro_de_destinos) onde.push('num livro de destinos');
      if (d.flags.tem_o_saco_de_racao) onde.push('num saco de ração');
      if (d.flags.leu_o_rolo) onde.push('no cabeçalho de nove semanas de fax');
      return onde.length
        ? `E no lugar do nome da segunda parte, a sigla de cinco caracteres que você já viu ${onde.length > 1 ? onde.slice(0, -1).join(', ') + ' e ' + onde[onde.length - 1] : onde[0]}.`
        : 'E no lugar do nome da segunda parte, uma sigla de cinco caracteres, sem nome nenhum por extenso.';
    },
    'O presidente lê a sigla em voz alta, devagar, soletrando, e fica claro que é a primeira vez que ele soletra aquilo.',
    fala('o presidente da associação', 'Isso é a… quem é isso?'),
    'E a sala inteira olha pra você, porque você é {o único|a única} ali que não perguntou.'
  ],
  ef:{flag:['o_convenio_da_associacao','sabe_o_nome_da_comissao','reika_precisa_de_papel'],
      rep:{eixo:'bom', delta:2, motivo:'Fez um presidente de associação comercial ler em voz alta, pela primeira vez, com quem ele assinou convênio.'},
      registrar:'O convênio da lista traz a sigla como segunda parte. O presidente nunca tinha lido.',
      presagio:'Ele assinou e nunca leu. Essa é a resposta pra metade das perguntas desta jornada.'},
  escolhas:[
    {texto:'Pedir cópia do convênio.', vai:'c31_a_copia_da_lista'},
    {texto:'Sair de Celadon com isso.', vai:'c31_fim'}
  ]
},

c31_fim:{
  texto:[
    'Você sai de Celadon pela avenida dois, de manhã, passando pelo terminal de carga onde todo mundo que tem nota descarrega.',
    d=>{
      if (d.flags.fotografou_o_rolo) return 'Na mochila tem quarenta e uma fotografias de um rolo de papel térmico que ia pro lixo na sexta-feira.';
      if (d.flags.tem_o_rolo_termico) return 'Na mochila tem um rolo de papel térmico usado que ia pro lixo na sexta-feira, e que guarda nove semanas de cabeçalho em negativo.';
      if (d.flags.copia_da_lista_carimbada) return 'Na mochila tem uma lista de quarenta e um nomes, carimbada e assinada por uma secretária de sessenta e um anos.';
      return 'Na mochila não tem papel nenhum e na cabeça tem quarenta e um nomes, sete deles com a observação "acompanhar até sair da cidade".';
    },
    d=>d.flags.as_fotos_da_kazu
      ? 'E sete fotografias tiradas às duas da manhã por uma menina de treze anos com a máquina do pai, das quais uma mostra três fileiras de gaiola empilhadas dentro de um galpão.'
      : (d.flags.a_kazu ? 'E o nome de uma menina de treze anos que ninguém quis acreditar desde setembro.' : ''),
    'A Rota 10 fica a um dia de estrada e, no fim dela, tem uma usina desligada há onze anos que não para de zumbir.'
  ],
  fim:true, resumo:'A lista que chega por fax toda segunda: quarenta e um nomes, um convênio que o presidente nunca leu e uma menina de treze anos que anota placa desde setembro.'
}

}
});
