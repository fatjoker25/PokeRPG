/* ============================================================
   RECADOS — quem tem o seu número também procura você
   As ligações escritas (CHAMADAS, em pokenav.js) tocam uma vez cada.
   Aqui mora o resto do telefone:
   - cada ação no mapa rola o PokéNav (DADOS_DO_TOQUE, rolado no
     Jogo.talvezToque): no 6, ele toca, e sem chamada escrita
     esperando, alguém da agenda liga à toa, pra conversar, e o que
     você responde aproxima ou afasta (a afinidade);
   - quem gosta de você às vezes manda recado de que separou alguma
     coisa, e espera na cidade dele até você passar ("Encontrar", no
     que fazer do lugar);
   - e quem mora na cidade, depois de uma conversa, pode te dar alguma
     coisa, pelo seu Carisma.
   O que vem sai das tabelas daqui (a folha de regras lê as mesmas).
   A conversa à toa usa a tela da chamada: Chamadas manda pra cá o que
   tem id começando com 'rec_'.
   ============================================================ */

const DADOS_DO_TOQUE = 1;               // dados de chance que cada ação no mapa rola: no 6, o PokéNav toca
const RECADO_POR_CONTATO_DIAS = 7;      // a mesma pessoa não procura de novo antes disso
/* ligação à toa, recado ou pedido: no máximo isso por dia, de qualquer
   pessoa. Três robôs, do capítulo 1 ao 17, mediram um toque a cada 2,8
   dias de jogo (4,1 no começo, 2,2 no fim, com a agenda cheia), mas um
   em cada sete vinha colado no anterior, e no capítulo 14 três pessoas
   ligaram em três voltas seguidas por Vermilion. O limite tira 12% dos
   toques à toa, os do mesmo dia. A chamada escrita e a casa com notícia
   que não espera ficam de fora. */
const TOQUES_A_TOA_POR_DIA = 1;
const AFINIDADE_DA_NOTICIA = 3;         // quem gosta assim de você liga quando um Pokémon seu morre
const AFINIDADE_TETO_LIGACAO = 6;       // conversa de telefone aproxima até aqui; acima, só a história
const AFINIDADE_PISO_LIGACAO = -3;      // e afasta até aqui
const AFINIDADE_DA_ESTRADA = 1;         // quem te deu o número sem cena com você começa aqui
const AFINIDADE_DE_CASA = 5;            // quem ficou em casa
const PRESENTE_MIN_AFINIDADE = 1;
const PRESENTE_ESPERA_DIAS = 12;        // depois de buscar, outro presente da mesma pessoa só depois disso
const PRESENTE_DA_CIDADE_DIFICULDADE = 9;      // 3 sucessos no teste de Carisma
const PRESENTE_DA_CIDADE_ESPERA_DIAS = 14;     // o mesmo morador dá de novo só depois disso

/* O que a pessoa separa pra você, pela afinidade: vale o primeiro degrau
   que cabe, de cima pra baixo. Cada item é [nome, quantidade, peso]. */
const PRESENTES_POR_AFINIDADE = [
  {min:8, nome:'de confiança', itens:[['Pedra do Sol', 1, 2], ['Moon Stone', 1, 2], ['PP Up', 1, 2], ['Elixir', 2, 2], ['Revive', 2, 2], ['Max Revive', 1, 1], ['Ultra Ball', 3, 2]]},
  {min:5, nome:'próximo', itens:[['Hyper Potion', 2, 3], ['Max Potion', 1, 1], ['Ultra Ball', 2, 3], ['Revive', 1, 2], ['Moon Stone', 1, 1],
    ['Pedra do Fogo', 1, 1], ['Pedra da Água', 1, 1], ['Pedra do Trovão', 1, 1], ['Pedra da Folha', 1, 1]]},
  {min:3, nome:'amigo', itens:[['Super Potion', 2, 3], ['Great Ball', 3, 3], ['Repelente', 2, 2], ['Full Heal', 2, 2], ['Éter', 1, 1], ['Ração', 4, 2]]},
  {min:1, nome:'conhecido', itens:[['Potion', 2, 3], ['Poké Ball', 3, 3], ['Ração', 2, 3], ['Antidote', 2, 2], ['Água Fresca', 2, 1]]}
];

/* O que quem mora na cidade te dá depois de uma conversa, pelo seu
   Carisma: vale o primeiro degrau que cabe, e o crítico sobe um. */
const PRESENTES_DA_CIDADE = [
  {min:5, itens:[['Moon Stone', 1, 1], ['Pedra do Fogo', 1, 1], ['Pedra da Água', 1, 1], ['Pedra do Trovão', 1, 1], ['Pedra da Folha', 1, 1], ['PP Up', 1, 1], ['Elixir', 1, 1]]},
  {min:4, itens:[['Hyper Potion', 1, 3], ['Ultra Ball', 1, 3], ['Revive', 1, 2], ['Éter', 1, 2]]},
  {min:3, itens:[['Super Potion', 1, 3], ['Great Ball', 1, 3], ['Repelente', 1, 2], ['Full Heal', 1, 2]]},
  {min:1, itens:[['Potion', 1, 3], ['Poké Ball', 1, 3], ['Ração', 1, 3], ['Antidote', 1, 2], ['Água Fresca', 1, 2]]}
];

/* o líder que chega ao degrau das pedras separa, metade das vezes, a do tipo dele */
const PEDRA_DO_CONTATO = {brock:'Moon Stone', misty:'Pedra da Água', surge:'Pedra do Trovão', erika:'Pedra da Folha', blaine:'Pedra do Fogo'};

/* o item na boca de quem conta: a Pokébola é Pokébola na narração (o
   aviso diz qual), e o resto vai com artigo */
const ITEM_NA_NARRACAO = {
  'Poké Ball':'uma Pokébola', 'Great Ball':'uma Pokébola', 'Ultra Ball':'uma Pokébola',
  'Ração':'um pacote de Ração', 'Água Fresca':'uma garrafa de Água Fresca',
  'Antidote':'um Antidote', 'Repelente':'um Repelente', 'Full Heal':'um Full Heal', 'Revive':'um Revive',
  'Éter':'um Éter', 'Elixir':'um Elixir', 'PP Up':'um PP Up'
};
function coisaDoPresente(item, qtd){
  if (qtd > 1) return Dados.escolher(['um saquinho de papel', 'um pacote amarrado com barbante', 'uma sacola dobrada']);
  return ITEM_NA_NARRACAO[item] || 'uma ' + item;
}

/* sorteio por peso: [nome, quantidade, peso] */
function sortearPeso(lista){
  const total = lista.reduce((s, x) => s + (x[2] || 1), 0);
  let r = Math.random() * total;
  for (const x of lista){ r -= (x[2] || 1); if (r < 0) return x; }
  return lista[lista.length - 1];
}

/* ------------------------------------------------------------
   O que se fala numa ligação à toa. Cada tópico diz pra quem serve
   (para), o que a pessoa fala e as três respostas, com o quanto cada
   uma aproxima (afeto). Texto que fala do seu Pokémon concorda com ele
   (x.pr); o que fala de você, com a marca {o|a}.
   ------------------------------------------------------------ */
const PERDEU_PRA = [
  ['Magikarp', 'que alguém jurou que não sabia fazer nada'],
  ['Paras', 'numa trilha de terra batida'],
  ['Psyduck', 'com dor de cabeça e tudo'],
  ['Pidgey', 'que nem era de ninguém'],
  ['Rattata', 'no meio da rua, na frente de todo mundo'],
  ['Caterpie', 'no mato da beira da estrada']
];
const TEMPO_DA_CIDADE = ['Choveu', 'Ventou', 'Fez um sol de rachar'];
const NOTICIA_DE_CASA = [
  'O vizinho do lado trocou o portão. Ficou pior.',
  'Caiu um galho no quintal com a chuva de ontem. Ninguém se machucou, nem o galho.',
  'Abriu uma padaria nova na esquina. O pão é igual ao da velha.',
  'Um Pidgey fez ninho na calha. Deixei.'
];

const TOPICOS_DE_LIGACAO = [
/* As notícias: o que mudou desde a última conversa com a pessoa
   (Recados.eventoPara). Têm a vez na frente dos assuntos à toa, e quem
   atende conta: a pessoa não liga de novo pela mesma notícia. */
{
  id:'noticia_morte', noticia:'morte', para:x => !!x.evento && x.evento.tipo === 'morte',
  falas:x => {
    const p = x.evento.p, de = `${pron(p).do} ${nomeExib(p)}`;
    if (x.casa) return (x.madrugada ? [x.voceLigou ? x.diz('Eu também não estava dormindo.') : x.diz('Desculpa a hora. Eu não consegui dormir.')] : [])
      .concat([x.diz(`Me contaram ${de}.`), x.diz('Eu não vou perguntar como foi. Só queria ouvir a sua voz.', 'baixo')]);
    if (x.lider) return [x.diz(`Fiquei sabendo ${de}.`), x.diz('Quem treina aprende a perder luta. Isso não se aprende.', 'baixo')];
    if (x.treinador) return [x.diz(`Soube ${de}. Na estrada todo mundo sabe de todo mundo.`), x.diz('Eu sinto muito. De verdade.')];
    return [x.diz(`Me disseram ${de}.`), x.voceLigou
      ? x.diz('Eu não sei o que se diz numa hora dessas. Que bom que você ligou.')
      : x.diz('Eu não sei o que se diz numa hora dessas. Liguei assim mesmo.')];
  },
  escolhas:x => [
    {texto:'Contar como foi.', afeto:1, resultado:[x.diz('Fico contente que você contou. Ninguém devia carregar isso sozinh{o|a}.')]},
    {texto:'"Agora não dá pra falar disso."', afeto:0, resultado:[x.diz('Tudo bem. Eu fico aqui.')]},
    {texto:'"Acontece."', afeto:0, resultado:[x.diz('Não precisa fingir comigo.', 'baixo')]}
  ]
},
{
  id:'noticia_custodia', noticia:'custodia', para:x => !!x.evento && x.evento.tipo === 'custodia',
  falas:x => x.casa
    ? (x.madrugada ? [x.voceLigou ? x.diz('Eu também não estava dormindo.') : x.diz('Desculpa a hora. Eu não ia aguentar esperar o dia.')] : [])
      .concat([x.diz('Disseram que a Patrulha te segurou.'), x.diz('Eu não vou gritar. Já gritei com a parede a noite inteira.')])
    : [x.diz('Soube que a Patrulha te segurou uns dias.'), x.diz('Não vou perguntar o que foi. Só queria saber se você saiu inteir{o|a}.')],
  escolhas:x => [
    {texto:'"Saí. Estou bem."', afeto:1, resultado:[x.diz('Então está bom. Cuida pra não voltar lá.')]},
    {texto:'Contar o que aconteceu.', afeto:1, resultado:[x.diz('Eu ouvi. Agora vai descansar.')]},
    {texto:'"Não é da sua conta."', afeto:-1, resultado:[x.diz('Tá bom.', 'frio')]}
  ]
},
{
  id:'noticia_insignia', noticia:'insignia', para:x => !!x.evento && x.evento.tipo === 'insignia',
  falas:x => {
    const n = x.evento.nome;
    if (x.casa) return [x.diz(`Saiu no jornal daqui: a ${n}.`), x.diz('Eu recortei. Está presa na porta da geladeira.')];
    if (x.lider) return [x.diz(`Soube da ${n}. Notícia de ginásio corre rápido entre a gente.`), x.diz('Quero ver como você chega na próxima.')];
    if (x.treinador) return [x.diz(`Vi que você pegou a ${n}.`), x.diz('Tem gente aqui na estrada que nunca passou dessa.')];
    return [x.diz(`Me contaram da ${n}.`), x.diz('Eu não entendo nada de ginásio, mas fiquei contente.')];
  },
  escolhas:x => [
    {texto:'"Foi apertado."', afeto:1, resultado:[x.diz('O apertado é o que ensina.')]},
    {texto:'"Ainda falta muito."', afeto:1, resultado:[x.diz('Falta. Mas uma de cada vez, e essa já foi.')]},
    {texto:'"Foi fácil."', afeto:0, resultado:[x.diz('Então a próxima vai ser difícil. Sempre é.')]}
  ]
},
{
  id:'o_time', para:x => !!x.p,
  falas:x => [x.diz(`Lembrei ${x.pr.do} ${x.chamado} hoje. Como ${x.pr.ele} tá?`)],
  escolhas:x => [
    {texto:`"Forte. ${x.pr.Ele} não para quiet${x.pr.o}."`, afeto:1,
     resultado:[x.diz(`Então tá bem cuidad${x.pr.o}.`), x.diz(`Dá um oi ${x.pr.pro} ${x.chamado} por mim.`)]},
    {texto:'Contar a última luta, do começo ao fim.', afeto:1,
     resultado:['Você conta. Do outro lado, ninguém interrompe.',
       x.treinador ? x.diz('Eu teria trocado antes. Mas eu não estava lá.', 'riso') : x.diz('Não entendi metade. Gostei de ouvir.')]},
    {texto:'"Por que você quer saber?"', afeto:-1, resultado:[x.diz('Por nada. Só perguntei.', 'frio')]}
  ]
},
{
  id:'onde', para:x => true,
  falas:x => [x.periodo === 'madrugada' && !x.voceLigou ? x.diz('Te acordei? Desculpa. Onde você tá?') : x.diz('Onde você tá agora?')],
  escolhas:x => [
    {texto:`"${cap1(x.emLugar)}."`, afeto:1,
     resultado:[x.naCidade ? x.diz('Come alguma coisa quente aí, que estrada não tem.') : x.diz('No meio do caminho? Olha onde pisa, então.')]},
    {texto:'"Por aí."', afeto:0, resultado:[x.diz('Por aí é um lugar grande.', 'riso')]},
    {texto:'Dizer que está no meio de uma coisa e desligar.', afeto:-1, resultado:['Você desliga antes da resposta.']}
  ]
},
{
  id:'perdeu', para:x => x.treinador && !x.lider,
  falas:x => { const [esp, como] = x.sorteio(PERDEU_PRA);
    return [x.diz(`Perdi hoje cedo. Pra um ${esp}.`), x.diz(`Um ${esp}, ${como}.`, 'baixo')]; },
  escolhas:x => [
    {texto:'"Acontece. Na próxima você pega."', afeto:1, resultado:[x.diz('Pego. Já sei onde ele treina.')]},
    {texto:'Perguntar que golpe derrubou.', afeto:1, resultado:[x.diz('Um golpe só, logo no começo. Eu travei antes do meu Pokémon.')]},
    {texto:'"Treina mais."', afeto:-1, resultado:[x.diz('Valeu. Ajudou muito.', 'frio')]}
  ]
},
{
  id:'treinando', para:x => x.treinador,
  falas:x => [x.diz('Tô treinando desde as cinco da manhã.'), x.diz('Da próxima vez que a gente se cruzar, não vai ser igual.')],
  escolhas:x => [
    {texto:'"Vou estar esperando."', afeto:1, resultado:[x.diz('Melhor assim.', 'riso')]},
    {texto:'"Treinando o quê, exatamente?"', afeto:1, resultado:[x.diz('Esquiva. Eu caio em toda finta que aparece.')]},
    {texto:'"Você já perdeu uma vez."', afeto:-1, resultado:[x.diz('Eu sei. Por isso as cinco da manhã.', 'frio')]}
  ]
},
{
  id:'desafiante', para:x => x.lider,
  falas:x => [x.diz('Entrou um desafiante hoje de manhã. Seis Pokémon e nenhum plano.'), x.diz('Lembrei de quando você entrou aqui.')],
  escolhas:x => [
    {texto:'"E passou?"', afeto:1, resultado:[x.diz('Hoje não. Se voltar com um plano, eu abro a porta de novo.')]},
    {texto:'"Eu tinha plano?"', afeto:1, resultado:[x.diz('Tinha cara de quem tinha. Às vezes basta.', 'riso')]},
    {texto:'"Não tenho tempo pra isso agora."', afeto:-1, resultado:[x.diz('Ninguém tem. Boa estrada.', 'frio')]}
  ]
},
{
  id:'insignias', para:x => x.lider,
  falas:x => [x.diz('Quantas insígnias já?')],
  escolhas:x => [
    {texto:`"${cap1(insigniasDitas(x.insig))}."`, afeto:1,
     resultado:[x.insig >= 8 ? x.diz('Então o Planalto já sabe o seu nome.')
       : x.insig >= 5 ? x.diz('Daqui pra frente fica perigoso. É a parte boa.')
       : x.diz('Ainda é o começo. Aproveita, que passa.')]},
    {texto:'"Perdi a conta."', afeto:0, resultado:[x.diz('Mentira. Ninguém perde a conta disso.', 'riso')]},
    {texto:'Mudar de assunto.', afeto:0, resultado:[x.voceLigou ? x.diz('Tá. Então fala você.', 'riso') : x.diz('Tá. Liguei por nada, mesmo.')]}
  ]
},
{
  id:'o_tempo', para:x => x.figura,
  falas:x => [x.diz(`${x.sorteio(TEMPO_DA_CIDADE)} o dia inteiro aqui ${x.emCidadeDele}.`), x.diz('Fiquei pensando se pegou você na estrada.')],
  escolhas:x => [
    {texto:'"Aqui também."', afeto:1, resultado:[x.diz('Então seca o time antes de dormir.')]},
    {texto:'Contar onde você está e como está o céu daí.', afeto:1, resultado:['Você conta.', x.diz('Daqui não dá pra ver. Mas agora eu sei.')]},
    x.voceLigou
      ? {texto:'"Tá. Era só isso."', afeto:-1, resultado:[x.diz('Ah. Tá bom, então.', 'frio')]}
      : {texto:'"Você ligou pra falar do tempo?"', afeto:-1, resultado:[x.diz('Às vezes a gente liga pra isso, sim.', 'baixo')]}
  ]
},
{
  id:'parecido', para:x => x.figura && !!x.p,
  falas:x => [x.diz(`Passou um treinador aqui hoje com um ${x.especie}.`), x.diz('Lembrei de você na hora.')],
  escolhas:x => [
    {texto:'"Era maior que o meu?"', afeto:1, resultado:[x.diz('Menor. O seu tem outra cara.', 'riso')]},
    {texto:'"Que bom que lembrou."', afeto:1, resultado:[x.diz('Eu lembro de quem passa por aqui. É o que eu faço da vida.')]},
    {texto:`"Tem muito ${x.especie} por aí."`, afeto:0, resultado:[x.diz('Tem. Mas eu lembrei de você.')]}
  ]
},
{
  id:'casa_comida', para:x => x.casa,
  falas:x => [x.diz('Comeu hoje?'), x.diz('Comida de verdade. Não lanche de Centro.')],
  escolhas:x => [
    {texto:'"Comi."', afeto:0, resultado:[x.diz('Tá bom. Vou fingir que acredito.', 'riso')]},
    {texto:'Contar o que comeu, de verdade.', afeto:1, resultado:['Você conta. Não é muito.', x.diz('Amanhã come mais. Promete.')]},
    {texto:'Desligar rápido.', afeto:-1, resultado:['Você diz que tá tudo bem e desliga antes da próxima pergunta.']}
  ]
},
{
  id:'casa_rua', para:x => x.casa,
  falas:x => [x.diz(x.sorteio(NOTICIA_DE_CASA)), x.diz('Pronto, contei. Agora conta você.')],
  escolhas:x => [
    {texto:'Contar onde você está e o que aconteceu desde a última ligação.', afeto:1,
     resultado:[x.diz('Guardei tudo de cabeça. Amanhã a rua inteira fica sabendo.', 'riso')]},
    {texto:'"Tá tudo bem. Sem novidade."', afeto:0, resultado:[x.diz('Sem novidade é novidade boa.')]},
    x.voceLigou
      ? {texto:'"Liguei só pra dar um oi. Tenho que ir."', afeto:-1, resultado:[x.diz('Um oi de três segundos. Tá bom.', 'baixo')]}
      : {texto:'"Depois eu ligo."', afeto:-1, resultado:[x.diz('Liga mesmo, então.', 'baixo')]}
  ]
},
{
  id:'jornal', para:x => !x.casa && x.insig >= 4,
  falas:x => [x.diz('Seu nome saiu no jornal de Fuchsia. Numa notinha, embaixo da previsão do tempo.')],
  escolhas:x => [
    {texto:'"Saiu certo, pelo menos?"', afeto:1, resultado:[x.diz('Erraram a sua cidade. O resto tava certo.', 'riso')]},
    {texto:'"Guarda pra mim?"', afeto:1, resultado:[x.diz('Já recortei.')]},
    {texto:'"Não leio jornal."', afeto:0, resultado:[x.diz('Eu também não. Me mostraram.')]}
  ]
},
{
  id:'rumo', para:x => true,
  falas:x => [x.diz('Pra onde você vai depois daí?')],
  escolhas:x => [
    {texto:'Dizer pra onde vai.', afeto:1, resultado:[x.diz('Então vai com calma. Lá é outro ritmo.')]},
    {texto:'"Ainda não sei."', afeto:0, resultado:[x.diz('Também serve. Quem sabe demais anda menos.')]},
    {texto:'"Por quê? Vai me seguir?"', afeto:-1, resultado:[x.diz('Calma. Só perguntei.', 'frio')]}
  ]
}
];

/* O recado de quem separou alguma coisa: chega no aparelho como
   mensagem, com o lugar onde a pessoa vai estar. */
const RECADO_DE_PRESENTE = {
  casa:[
    x => [x.diz('Separei uma coisa pra você. Tá em cima da mesa.'), x.diz('Passa em casa quando der. Não precisa avisar.')],
    x => [x.diz('Chegou uma coisa aqui que é mais sua do que minha.'), x.diz('Fica em casa te esperando.')]
  ],
  lider:[
    x => [x.diz(`Sobrou uma coisa aqui no ginásio, e ela tem o seu nome. Passa ${x.emOnde} quando der.`)],
    x => [x.diz(`Guardei uma coisa pra você. Tô ${x.emOnde}; me acha na rua, que no ginásio eu não paro.`)]
  ],
  treinador:[
    x => [x.diz('Ganhei uma coisa que serve mais pra você do que pra mim.'), x.diz(`Tô ${x.emOnde} esses dias. Me acha na rua.`)],
    x => [x.diz(`Separei uma coisa pra você. Tô ${x.emOnde}, andando por aí.`)]
  ],
  figura:[
    x => [x.diz('Separei uma coisa pra você.'), x.diz(`Quando passar ${x.emOnde}, me procura. Eu ando por aí.`)],
    x => [x.diz(`Tem uma coisa aqui com o seu nome. Passa ${x.emOnde}, que eu te acho ou você me acha.`)]
  ]
};

/* onde você acha a pessoa, andando pela cidade (sem dizer como ela está
   vestida nem o gênero dela, que o jogo não sabe de todo mundo) */
const ONDE_ACHA = {
  casa:[x => `A porta de casa abre antes de você bater. ${x.Nome} já estava olhando pela janela.`],
  lider:[
    x => `Você acha ${x.nome} na porta do ginásio, conversando com quem limpa a quadra.`,
    x => `${x.Nome} está no banco da praça, longe do ginásio, comendo alguma coisa de pé.`
  ],
  outro:[
    x => `Você acha ${x.nome} na frente do Centro, lendo o mural.`,
    x => `${x.Nome} está no banco da praça, com uma sacola no colo, olhando quem passa.`,
    x => `Você quase passa direto: ${x.nome} está na fila da padaria e acena com o pacote.`,
    x => `${x.Nome} sai de uma loja bem na hora em que você passa, como se fosse combinado.`
  ]
};
const ENTREGA = {
  casa:[x => [x.diz('Leva. E come alguma coisa antes de ir.')]],
  lider:[x => [x.diz('Guardei pra quem soubesse usar.')], x => [x.diz('Não agradece. Usa.')]],
  treinador:[x => [x.diz('Pega. Eu ia usar, mas você vai usar melhor.')], x => [x.diz('Toma. Não é nada, mas é seu.')]],
  figura:[x => [x.diz('Toma. Achei que ia servir mais na sua mão.')], x => [x.diz('Não é nada demais. Mas é pra você.')]]
};

/* o morador que dá alguma coisa depois da conversa */
const DA_A_COISA = [
  (Q, q, c) => `${Q} te chama de volta antes de você ir e põe ${c} na sua mão.`,
  (Q, q, c) => `Quando você já está indo, ${q} te alcança na esquina com ${c}.`,
  (Q, q, c) => `${Q} entra em casa e volta com ${c}. Não deixa você recusar.`,
  (Q, q, c) => `${Q} tira ${c} do bolso e põe na sua mão sem dizer nada.`
];

/* quem atende a ligação de volta: a primeira coisa que a pessoa diz */
const ABRE_O_RETORNO = {
  casa:[x => x.diz('Ah, é você. Eu tinha te ligado.'), x => x.diz('Achei que você ia esquecer de retornar.')],
  lider:[x => x.diz('Você retornou. Bom.'), x => x.diz('Liguei mais cedo. É coisa rápida.')],
  treinador:[x => x.diz('Ah, é você! Te liguei mais cedo.'), x => x.diz('Achei que você estava no meio de uma luta.')],
  figura:[x => x.diz('Ah, é você. Eu tinha te ligado.'), x => x.diz('Que bom que você ligou de volta.')]
};
/* a notícia que pesa (a morte, a custódia) não começa com pressa nem com festa */
const ABRE_O_RETORNO_GRAVE = x => x.diz('Que bom que você ligou de volta.', 'baixo');
/* quem atende a ligação que você faz à toa ("Só conversar") */
const ABRE_A_CONVERSA = {
  casa:[x => x.diz('Oi! Aconteceu alguma coisa?'), x => x.diz('Que bom ouvir você.')],
  lider:[x => x.diz('Pois não? Ah, é você.'), x => x.diz('Tenho um minuto entre um desafiante e outro. Fala.')],
  treinador:[x => x.diz('Opa! Nem acreditei quando vi o seu nome.'), x => x.diz('Ei! Achei que você tinha perdido o meu número.')],
  figura:[x => x.diz('Alô? Ah, é você!'), x => x.diz('Que surpresa boa.')]
};
const ABRE_A_CONVERSA_GRAVE = x => x.diz('Eu ia te ligar agora.', 'baixo');
const PERIODO_DITO = {madrugada:'de madrugada', 'manhã':'de manhã', tarde:'à tarde', noite:'de noite'};

const Recados = {
  atual:null,      // a ligação à toa que está tocando agora
  _n:0,

  /* ---------- o registro, dentro do PokéNav ---------- */
  reg(){
    const nav = Estado.nav();
    if (!nav.recados) nav.recados = {contatos:{}, presentes:{}};
    if (!nav.recados.contatos) nav.recados.contatos = {};
    if (!nav.recados.presentes) nav.recados.presentes = {};
    if (!nav.recados.perdidas) nav.recados.perdidas = {};    // chamada perdida, por contato: dá pra retornar até a meia-noite
    if (!nav.recados.naoLidas) nav.recados.naoLidas = {};    // mensagem que chegou no silencioso
    return nav.recados;
  },
  doContato(id){ const r = this.reg(); return r.contatos[id] || (r.contatos[id] = {}); },

  /* ---------- o que a pessoa sabe ----------
     Cada contato guarda o retrato de quando falou com você por último
     (sabe): quantos Pokémon seus morreram, quantas insígnias você tinha,
     quantas vezes a Patrulha te segurou. O que mudou desde então é a
     notícia, e quem liga fala dela antes de tudo. O retrato nasce quando
     o número entra na agenda (conhecer), e atender põe ele em dia. */
  retrato(){
    const d = Estado.dados;
    return {mortos:(d.cemiterio || []).length, insignias:this.insigniasDe(d).length, custodias:(d.liga && d.liga.custodias) || 0};
  },
  insigniasDe(d){ return (d.insignias || []).filter(i => i !== 'Título de Campeão'); },
  conhecer(id){ const r = this.doContato(id); if (!r.sabe) r.sabe = this.retrato(); },
  sabeDe(c){ const r = this.doContato(c.id); if (!r.sabe) r.sabe = this.retrato(); return r.sabe; },
  emDia(c){ if (c) this.doContato(c.id).sabe = this.retrato(); },
  /* a notícia que essa pessoa tem pra dar: a morte (a casa, e quem tem
     afinidade AFINIDADE_DA_NOTICIA), a custódia (a casa e quem não é
     treinador) e a insígnia nova (todo mundo, menos o líder que deu) */
  eventoPara(c){
    if (!c || typeof Estado === 'undefined' || !Estado.dados) return null;
    const d = Estado.dados, s = this.sabeDe(c), agora = this.retrato(), casa = c.id === 'casa';
    if (agora.mortos > s.mortos && (casa || this.afinidade(c) >= AFINIDADE_DA_NOTICIA)){
      const p = d.cemiterio[d.cemiterio.length - 1];
      if (p) return {tipo:'morte', p};
    }
    if (agora.custodias > s.custodias && (casa || c.tipo !== 'treinador')) return {tipo:'custodia'};
    if (agora.insignias > s.insignias){
      const lista = this.insigniasDe(d), nome = lista[lista.length - 1];
      const g = c.ginasio && typeof GINASIOS !== 'undefined' ? GINASIOS.find(z => z.id === c.ginasio) : null;
      if (nome && !(g && g.insignia === nome)) return {tipo:'insignia', nome};
    }
    return null;
  },
  /* notícia que não espera a semana: a casa, depois de uma morte ou da
     custódia — liga no mesmo dia, até de madrugada */
  urgente(c){
    if (!c || c.id !== 'casa') return false;
    const e = this.eventoPara(c);
    return !!e && (e.tipo === 'morte' || e.tipo === 'custodia');
  },

  /* ---------- afinidade ----------
     Quem a história conhece (d.npcs) tem a opinião de lá, e a conversa
     de telefone mexe nela; quem só te deu o número guarda o laço aqui,
     a partir de AFINIDADE_DA_ESTRADA; quem ficou em casa parte de
     AFINIDADE_DE_CASA. */
  rotuloNPC(c){
    if (!c || c.id === 'casa') return null;
    const d = Estado.dados;
    const cands = [falaComoDe(c), typeof c.nome === 'function' ? c.nome(d) : c.nome];
    for (const r of cands) if (r && opiniaoDe(r) > -99) return r;
    return null;
  },
  afinidade(c){
    if (!c) return 0;
    const laco = this.doContato(c.id).laco || 0;
    if (c.id === 'casa') return AFINIDADE_DE_CASA + laco;
    const r = this.rotuloNPC(c);
    if (r) return opiniaoDe(r);
    return AFINIDADE_DA_ESTRADA + laco;
  },
  /* teto: até onde isso aproxima (o telefone, AFINIDADE_TETO_LIGACAO;
     o pedido cumprido no mundo vai mais alto, pedidos.js) */
  mudarAfinidade(c, delta, teto = AFINIDADE_TETO_LIGACAO){
    if (!c || !delta) return 0;
    const atual = this.afinidade(c);
    let novo;
    if (delta > 0) novo = atual >= teto ? atual : Math.min(teto, atual + delta);
    else novo = atual <= AFINIDADE_PISO_LIGACAO ? atual : Math.max(AFINIDADE_PISO_LIGACAO, atual + delta);
    const mudou = novo - atual;
    if (!mudou) return 0;
    const r = this.rotuloNPC(c);
    if (r){ Estado.lembrarNPC(r, {opiniao:novo}); return mudou; }
    const x = this.doContato(c.id);
    x.laco = (x.laco || 0) + mudou;
    return mudou;
  },
  degrau(af){ return PRESENTES_POR_AFINIDADE.find(t => af >= t.min) || null; },

  /* ---------- quem procura você ---------- */
  /* está na agenda, a história ainda põe a pessoa no mundo (requer) e
     não falou com você faz pouco */
  candidatos(madrugada){
    if (!Estado.temPokenav()) return [];
    const d = Estado.dados;
    /* save de antes da notícia: quem não tem retrato ganha o de agora */
    Estado.contatosNaAgenda().forEach(c => this.sabeDe(c));
    return Estado.contatosNaAgenda().filter(c => {
      /* quem só avisa (a secretaria do Planalto) não liga à toa */
      if (c.soAvisa) return false;
      try { if (c.requer && !c.requer(d)) return false; } catch(e){ return false; }
      const u = this.doContato(c.id).ultimoDia;
      /* a notícia que não espera liga no mesmo dia, uma vez por dia; de
         madrugada, só ela */
      if (this.urgente(c)) return u == null || u !== d.relogio.dia;
      /* vocês já se falaram hoje (a ligação que você fez, ou a que você atendeu) */
      if (this.doContato(c.id).falouDia === d.relogio.dia) return false;
      /* alguém já procurou você hoje */
      if (this.toquesDeHoje() >= TOQUES_A_TOA_POR_DIA) return false;
      if (madrugada) return false;
      return u == null || d.relogio.dia - u >= RECADO_POR_CONTATO_DIAS;
    });
  },
  /* quem tem notícia que não espera liga primeiro; no resto, quem gosta
     mais liga mais */
  quemLiga(madrugada){
    const cs = this.candidatos(madrugada);
    if (!cs.length) return null;
    const urgentes = cs.filter(c => this.urgente(c));
    if (urgentes.length) return Dados.escolher(urgentes);
    const sacola = [];
    cs.forEach(c => { const n = Math.max(1, Math.min(6, this.afinidade(c) + 2)); for (let i = 0; i < n; i++) sacola.push(c); });
    return Dados.escolher(sacola);
  },
  podeMandarPresente(c){
    if (!c || this.afinidade(c) < PRESENTE_MIN_AFINIDADE) return false;
    if (this.reg().presentes[c.id]) return false;
    const u = this.doContato(c.id).ultimoPresente;
    return u == null || Estado.dados.relogio.dia - u >= PRESENTE_ESPERA_DIAS;
  },
  chanceDoPresente(c){ return Math.min(60, 20 + 5 * Math.max(0, this.afinidade(c))); },

  /* quantas vezes alguém da agenda procurou você hoje (o toque à toa) */
  toquesDeHoje(){
    const t = this.reg().toquesDia, hoje = Estado.dados.relogio.dia;
    return t && t.dia === hoje ? t.n : 0;
  },
  /* o PokéNav tocou (o dado do Jogo.talvezToque deu 6) e não tem
     chamada escrita esperando: quem liga é alguém da agenda, e a pessoa
     liga à toa, manda recado ou pede um favor (pedidos.js). Quem é se decide agora; o que ela diz
     só na hora de abrir o aparelho (mostrar), porque o toque que cai no
     meio da luta espera ela acabar, e até lá o time pode ter mudado.
     Devolve o toque ({recados, de}) pro Jogo abrir ou guardar. */
  escolherToque(madrugada){
    if (typeof Estado === 'undefined' || !Estado.dados || !Estado.temPokenav()) return null;
    const c = this.quemLiga(madrugada);
    if (!c) return null;
    this.doContato(c.id).ultimoDia = Estado.dados.relogio.dia;
    const r = this.reg(), hoje = Estado.dados.relogio.dia;
    r.toquesDia = {dia:hoje, n:this.toquesDeHoje() + 1};
    let tipo = 'ligacao';
    /* quem tem notícia fala dela antes de qualquer coisa, e de madrugada
       ninguém manda recado nem pede favor */
    if (madrugada || this.eventoPara(c)){ /* a ligação, com a notícia */ }
    else if (this.podeMandarPresente(c) && Dados.chance(this.chanceDoPresente(c)) && this.separarPresente(c)) tipo = 'recado';
    else if (typeof Pedidos !== 'undefined' && Pedidos.podePedir(c) && Dados.chance(CHANCE_DO_PEDIDO)) tipo = 'pedido';
    Estado.salvar('auto');
    return {recados:tipo, de:c.id};
  },
  /* abre o aparelho com o toque: o recado, a mensagem de quando o
     pedido venceu, ou a ligação montada agora — o pedido, se ainda der
     pra montar um, senão a ligação à toa */
  mostrar(id, tipo, toque){
    const c = contatoPorId(id);
    if (!c || !Estado.temPokenav()) return false;
    if (tipo === 'recado'){ UI.telaRecado(c); return true; }
    if (tipo === 'prazo') return typeof Pedidos !== 'undefined' && Pedidos.mostrarPrazo(c, toque);
    if (tipo === 'defesa') return typeof Defesa !== 'undefined' && Defesa.mostrarAviso(c, toque);
    const ch = (tipo === 'pedido' && typeof Pedidos !== 'undefined' && Pedidos.podePedir(c) && Pedidos.montar(c)) || this.montarLigacao(c);
    if (!ch) return false;
    UI.telaChamada(ch);
    return true;
  },

  /* ---------- o que se diz ---------- */
  contexto(c, o){
    const d = Estado.dados;
    const p = (Estado.primeiroApto && Estado.primeiroApto()) || (d.time || []).find(x => !x.morto) || null;
    const lugarId = Mundo.id(), L = LOCAIS[lugarId] || {};
    const casa = c.id === 'casa';
    const nome = this.nomeNaNarracao(c);
    const rot = casa ? null : (falaComoDe(c) || (typeof c.nome === 'function' ? c.nome(d) : c.nome));
    const ondeId = this.ondeEncontrar(c);
    const sorteados = {};
    return {
      c, d, p, nome, Nome:cap1(nome), casa,
      chamado:p ? (p.apelido || p.nome) : '', especie:p ? p.nome : '',
      pr:p ? pron(p) : {ele:'ele', Ele:'Ele', dele:'dele', nele:'nele', o:'o', um:'um', do:'do', ao:'ao', pro:'pro', f:false},
      emLugar:emLocal(lugarId), naCidade:L.tipo === 'cidade',
      insig:(d.insignias || []).filter(i => i !== 'Título de Campeão').length,
      periodo:d.relogio.periodo, madrugada:d.relogio.periodo === 'madrugada',
      evento:this.eventoPara(c),
      /* quem ligou foi você ("Só conversar"): a pessoa não diz "liguei" */
      voceLigou:!!(o && o.voceLigou),
      /* o líder cujo ginásio agora é seu (defesa.js) não fala mais de desafiante */
      lider:!!c.ginasio && !(typeof Defesa !== 'undefined' && Defesa.deixouDeSer(c.ginasio, d)),
      treinador:c.tipo === 'treinador', figura:c.tipo !== 'treinador' && !casa,
      ondeId, emOnde:emLocal(ondeId), emCidadeDele:emLocal(ondeId),
      diz:(t, tom, nota) => casa ? falaCasa(t, tom, nota) : fala(rot, t, tom, nota),
      /* o mesmo sorteio dentro da mesma ligação, se a fala for lida duas vezes */
      sorteio:lista => {
        const chave = lista.length + ':' + String(lista[0]);
        if (!(chave in sorteados)) sorteados[chave] = Dados.escolher(lista);
        return sorteados[chave];
      }
    };
  },
  tipoDe(x){ return x.casa ? 'casa' : x.lider ? 'lider' : x.treinador ? 'treinador' : 'figura'; },

  /* o nome no meio da frase: o nome de verdade, quando você sabe; quem
     é chamado pelo cargo vai com artigo ("o zelador da Torre", "a
     enfermeira"), que a agenda grava sem ("Zelador da Torre") */
  nomeNaNarracao(c){
    const fc = falaComoDe(c);
    if (fc && typeof Nomes !== 'undefined' && Nomes.sabe && Nomes.sabe(fc)) return Nomes.nomeDe(fc);
    if (fc && /^[ao] /.test(fc)) return fc;
    const n = textoContato(c, 'nome') || '';
    if (/^[AO] [a-zà-ú]/.test(n)) return n.charAt(0).toLowerCase() + n.slice(1);
    const m = /^(Zelador|Zeladora|Enfermeira|Enfermeiro|Assistente|Dono|Dona)\b/.exec(n);
    if (m) return (/a$/.test(m[1]) ? 'a ' : 'o ') + n.charAt(0).toLowerCase() + n.slice(1);
    return n;
  },

  /* a ligação à toa: um tópico que serve pra essa pessoa, nunca o mesmo
     da última vez com ela */
  topicosDe(c, o){
    const x = this.contexto(c, o);
    return TOPICOS_DE_LIGACAO.filter(t => { try { return t.para(x); } catch(e){ return false; } });
  },
  montarLigacao(c, topicoId, o){
    if (!c) return null;
    const x = this.contexto(c, o);
    const pool = this.topicosDe(c, o);
    if (!pool.length) return null;
    let t = topicoId ? pool.find(z => z.id === topicoId) : null;
    /* a notícia tem a vez na frente do assunto à toa */
    if (!t) t = pool.find(z => z.noticia) || null;
    if (!t){
      const ult = this.doContato(c.id).ultimoTopico;
      const sem = pool.filter(z => z.id !== ult);
      t = Dados.escolher(sem.length ? sem : pool);
    }
    const ch = {id:'rec_' + c.id + '_' + (++this._n), de:c.id, topico:t.id,
      falas:t.falas(x), escolhas:t.escolhas(x).map(e => Object.assign({afeto:0}, e))};
    this.atual = ch;
    this.doContato(c.id).ultimoTopico = t.id;
    return ch;
  },
  ehDaqui(id){ return /^rec_/.test(String(id || '')); },
  chamada(id){ return this.atual && this.atual.id === id ? this.atual : null; },

  /* atender e responder: a tela da chamada (telaResultadoChamada) mostra
     a resposta e o que vem depois; a afinidade muda calada */
  atender(id, i){
    const ch = this.chamada(id);
    if (!ch) return null;
    const esc = ch.escolhas[i];
    if (!esc) return null;
    this.atual = null;
    const c = contatoPorId(ch.de);
    this.mudarAfinidade(c, esc.afeto || 0);
    /* atendeu: a pessoa ficou sabendo de tudo até aqui, e a notícia não volta */
    this.emDia(c);
    if (c) this.doContato(c.id).falouDia = Estado.dados.relogio.dia;
    /* a ligação que pedia um favor: aceitar abre o pedido (pedidos.js) */
    if (ch.pedido && typeof Pedidos !== 'undefined') Pedidos.responder(c, ch.pedido, esc);
    else if (c) Estado.registrar(`Conversou com ${this.nomeNaNarracao(c)} pelo PokéNav.`);
    Estado.salvar('auto');
    return {chamada:ch, esc, avisos:[]};
  },
  recusar(id){
    const ch = this.chamada(id);
    if (!ch) return null;
    this.atual = null;
    const c = contatoPorId(ch.de);
    const custou = -this.mudarAfinidade(c, -1);
    if (c){
      this.perder(c, {tipo:ch.pedido ? 'pedido' : 'ligacao', topico:ch.topico || null, pedido:ch.pedido || null, custou});
      Estado.registrar(`Não atendeu ${this.nomeNaNarracao(c)}.`);
    }
    Estado.salvar('auto');
    return {chamada:ch, recusou:true};
  },

  /* ---------- a chamada perdida ----------
     Quem você não atendeu, e quem ligou com o aparelho no silencioso,
     fica na agenda até a meia-noite. Retornar no mesmo dia devolve o
     que o não atender custou, e a pessoa continua o assunto de onde
     parou; virou o dia, a chamada some e o custo fica. A mensagem que
     chegou no silencioso espera até ser lida. */
  perder(c, o){
    if (!c || !Estado.nav().contatos[c.id]) return;
    const d = Estado.dados, r = this.reg(), antes = r.perdidas[c.id];
    const doDia = antes && antes.dia === d.relogio.dia ? antes : null;
    /* o que as duas custaram volta junto no retorno */
    const custou = (o.custou || 0) + (doDia ? doDia.custou || 0 : 0);
    /* a chamada escrita do mesmo dia não dá lugar à ligação à toa */
    const fica = doDia && doDia.tipo === 'escrita' && o.tipo !== 'escrita' ? doDia
      : Object.assign({dia:d.relogio.dia, periodo:d.relogio.periodo}, o);
    fica.custou = custou;
    r.perdidas[c.id] = fica;
  },
  /* o que passou da meia-noite sai; a mensagem do presente que você já
     buscou também, e a de quem a história tirou do mundo */
  conferirPerdidas(){
    if (typeof Estado === 'undefined' || !Estado.dados || !Estado.temPokenav()) return;
    const r = this.reg(), d = Estado.dados, hoje = d.relogio.dia;
    const some = id => {
      const c = contatoPorId(id);
      if (!c) return true;
      try { return !!c.requer && !c.requer(d); } catch(e){ return true; }
    };
    for (const id of Object.keys(r.perdidas)) if (r.perdidas[id].dia !== hoje || some(id)) delete r.perdidas[id];
    for (const id of Object.keys(r.naoLidas)){
      const m = r.naoLidas[id];
      if (some(id) || (m.tipo === 'recado' && !r.presentes[id])) delete r.naoLidas[id];
    }
  },
  temPerdida(id){
    if (typeof Estado === 'undefined' || !Estado.dados || !Estado.temPokenav()) return false;
    const p = this.reg().perdidas[id];
    return !!p && p.dia === Estado.dados.relogio.dia;
  },
  temMensagem(id){
    if (typeof Estado === 'undefined' || !Estado.dados || !Estado.temPokenav()) return false;
    return !!this.reg().naoLidas[id];
  },
  /* "de Misty", "do zelador da Torre" */
  deQuem(nome){ return /^o /.test(nome) ? 'do ' + nome.slice(2) : /^a /.test(nome) ? 'da ' + nome.slice(2) : 'de ' + nome; },

  /* ---------- o silencioso ----------
     O aparelho no silencioso não toca: o dado do toque rola igual, a
     pessoa liga, e a ligação vira chamada perdida sem custo nenhum; o
     recado e a mensagem do prazo viram mensagem por ler. A tela do mapa
     diz numa linha o que chegou. */
  silencioso(){
    return typeof Estado !== 'undefined' && !!Estado.dados && Estado.temPokenav() && !!Estado.nav().silencioso;
  },
  alternarSilencio(){
    if (!Estado.temPokenav()) return false;
    const nav = Estado.nav();
    nav.silencioso = !nav.silencioso;
    Estado.salvar('auto');
    return nav.silencioso;
  },
  guardarNoSilencio(toque){
    if (!toque) return false;
    const c = contatoPorId(toque.de);
    if (!c) return false;
    const d = Estado.dados, r = this.reg();
    if (toque.recados === 'recado' || toque.recados === 'prazo' || toque.recados === 'defesa')
      r.naoLidas[c.id] = {tipo:toque.recados, pedido:toque.pedido || null, aviso:toque.aviso || null, dia:d.relogio.dia};
    else if (toque.recados)
      this.perder(c, {tipo:toque.recados === 'pedido' ? 'pedido' : 'ligacao', topico:null, pedido:null, custou:0, silencio:true});
    else
      /* a chamada escrita não se gasta no silencioso: a pessoa tenta de novo outro dia */
      this.perder(c, {tipo:'escrita', chamada:toque.id, custou:0, silencio:true});
    Estado.salvar('auto');
    this.pintarNotificacao();
    return true;
  },

  /* o aviso de uma linha da tela do mapa: quem ligou hoje e você não
     falou, e a mensagem por ler. Tocar abre a agenda em quem chegou primeiro. */
  notificacao(){
    if (typeof Estado === 'undefined' || !Estado.dados || !Estado.temPokenav()) return null;
    this.conferirPerdidas();
    const r = this.reg();
    const perdidas = Object.keys(r.perdidas).filter(id => this.temPerdida(id));
    const msgs = Object.keys(r.naoLidas).filter(id => contatoPorId(id));
    if (!perdidas.length && !msgs.length) return null;
    const nome = id => this.nomeNaNarracao(contatoPorId(id));
    const partes = [];
    if (perdidas.length === 1) partes.push(`Chamada perdida ${this.deQuem(nome(perdidas[0]))}`);
    else if (perdidas.length) partes.push(`${perdidas.length} chamadas perdidas`);
    if (msgs.length === 1) partes.push(`Mensagem nova ${this.deQuem(nome(msgs[0]))}`);
    else if (msgs.length) partes.push(`${msgs.length} mensagens novas`);
    return {texto:partes.join(' · '), abre:perdidas[0] || msgs[0]};
  },
  htmlDaNotificacao(){
    const n = this.notificacao();
    if (!n) return '<div id="nav-aviso" hidden></div>';
    const mudo = this.silencioso();
    return `<button id="nav-aviso" class="nav-aviso-mapa" onclick="UI.modalNav('${n.abre}')">${
      svgIcone(mudo ? 'sino_mudo' : 'telefone', '', mudo ? '' : '--ac:#e57373')}<span>${UI.esc(n.texto)}</span></button>`;
  },
  /* o toque no silencioso chega depois da tela desenhar: a linha muda no lugar */
  pintarNotificacao(){
    if (typeof document === 'undefined') return;
    const el = document.getElementById('nav-aviso');
    if (el) el.outerHTML = this.htmlDaNotificacao();
  },

  /* as linhas da ficha do PokéNav: ler a mensagem, retornar a ligação */
  linhasDaFicha(c){
    if (!c || typeof Estado === 'undefined' || !Estado.dados || !Estado.temPokenav()) return [];
    const r = this.reg(), luta = emLuta(), out = [];
    if (r.naoLidas[c.id]) out.push({acao:'ler', rot:'Ler a mensagem', nota:'Mensagem nova', ok:!luta,
      motivo:luta ? 'No meio da luta não dá pra ler.' : ''});
    if (this.temPerdida(c.id)) out.push({acao:'retornar', rot:'Retornar a ligação',
      nota:'Chamada perdida · ' + (PERIODO_DITO[r.perdidas[c.id].periodo] || 'hoje'), ok:!luta,
      motivo:luta ? 'No meio da luta não dá pra ligar.' : ''});
    return out;
  },

  /* ligar de volta no mesmo dia: o custo de não atender volta, e a
     pessoa retoma o assunto — a chamada escrita, o pedido, a notícia ou
     o assunto à toa de antes. Não tem "Não atender": quem ligou foi você. */
  retornar(id){
    const c = contatoPorId(id), r = this.reg(), pe = r.perdidas[id], d = Estado.dados;
    if (!c || !pe || !Estado.temPokenav() || emLuta()) return false;
    delete r.perdidas[id];
    if (pe.dia !== d.relogio.dia){ Estado.salvar('auto'); return false; }
    if (pe.custou) this.mudarAfinidade(c, pe.custou, Infinity);
    this.doContato(c.id).ultimoDia = d.relogio.dia;
    const x = this.contexto(c);
    let ch = null;
    if (pe.tipo === 'escrita' && typeof CHAMADAS !== 'undefined'){
      const esc = CHAMADAS.find(z => z.id === pe.chamada);
      let vale = !!esc;
      try { if (esc && esc.cond && !esc.cond(d)) vale = false; } catch(e){ vale = false; }
      if (vale){
        /* a recusa se desfaz: a conversa acontece agora */
        const at = Chamadas.atendidas()[esc.id];
        if (at && at.recusada) delete Chamadas.atendidas()[esc.id];
        if (!Chamadas.jaAtendeu(esc.id))
          ch = Object.assign({}, esc, {falas:typeof esc.falas === 'function' ? esc.falas(d) : (esc.falas || [])});
      }
    }
    if (!ch && pe.tipo === 'pedido' && typeof Pedidos !== 'undefined' && Pedidos.podePedir(c))
      ch = Pedidos.montar(c, null, pe.pedido);
    if (!ch) ch = this.montarLigacao(c, pe.topico);
    Estado.registrar(`Retornou a ligação ${this.deQuem(this.nomeNaNarracao(c))}.`);
    Estado.marcarLigacao(c.id, 'retorno');
    Estado.salvar('auto');
    if (!ch) return false;
    ch.falas = [this.aberturaDoRetorno(x, /^noticia_(morte|custodia)$/.test(ch.topico || ''))].concat(ch.falas || []);
    UI.telaChamada(ch, {retorno:true});
    return true;
  },
  aberturaDoRetorno(x, grave){ return grave ? ABRE_O_RETORNO_GRAVE(x) : x.sorteio(ABRE_O_RETORNO[this.tipoDe(x)])(x); },

  /* ---------- a ligação que você faz ("Só conversar") ----------
     Uma vez por dia por pessoa, menos de madrugada (a casa com notícia
     que não espera atende a qualquer hora), e nunca no meio da luta.
     É a mesma conversa da ligação à toa, montada agora, com quem atende
     falando primeiro: a resposta mexe na afinidade até o mesmo teto do
     telefone, e quem falou com você hoje não liga de novo no mesmo dia.
     A chamada perdida do dia tem a linha dela (retornar), e esta some. */
  podeConversar(c){
    if (!c || typeof Estado === 'undefined' || !Estado.dados || !Estado.temPokenav()) return {ok:false, mostra:false};
    if (c.soAvisa) return {ok:false, mostra:false};
    if (!Estado.nav().contatos[c.id] || this.temPerdida(c.id)) return {ok:false, mostra:false};
    if (!this.topicosDe(c, {voceLigou:true}).length) return {ok:false, mostra:false};
    const d = Estado.dados;
    if (emLuta()) return {ok:false, mostra:true, motivo:'No meio da luta não dá pra ligar.'};
    try { if (c.requer && !c.requer(d)) return {ok:false, mostra:true, motivo:'Ninguém atende.'}; }
    catch(e){ return {ok:false, mostra:true, motivo:'Ninguém atende.'}; }
    if (d.relogio.periodo === 'madrugada' && !this.urgente(c)) return {ok:false, mostra:true, motivo:'É madrugada. A essa hora ninguém atende.'};
    if (this.doContato(c.id).falouDia === d.relogio.dia) return {ok:false, mostra:true, motivo:'Vocês já se falaram hoje.'};
    return {ok:true, mostra:true};
  },
  linhaDeConversa(c){
    const r = this.podeConversar(c);
    return r.mostra ? {acao:'conversar', rot:'Só conversar', ok:r.ok, motivo:r.motivo || ''} : null;
  },
  conversar(id){
    const c = contatoPorId(id);
    if (!c || !this.podeConversar(c).ok) return false;
    const d = Estado.dados, o = {voceLigou:true};
    const ch = this.montarLigacao(c, null, o);
    if (!ch) return false;
    this.doContato(c.id).falouDia = d.relogio.dia;
    ch.falas = [this.aberturaDaConversa(this.contexto(c, o), /^noticia_(morte|custodia)$/.test(ch.topico || ''))].concat(ch.falas || []);
    Estado.marcarLigacao(c.id, 'conversa');
    Estado.salvar('auto');
    UI.telaChamada(ch, {retorno:true});
    return true;
  },
  aberturaDaConversa(x, grave){ return grave ? ABRE_A_CONVERSA_GRAVE(x) : x.sorteio(ABRE_A_CONVERSA[this.tipoDe(x)])(x); },
  /* a mensagem que esperou no silencioso */
  ler(id){
    const c = contatoPorId(id), r = this.reg(), m = r.naoLidas[id];
    if (!c || !m || !Estado.temPokenav() || emLuta()) return false;
    delete r.naoLidas[id];
    Estado.salvar('auto');
    if (m.tipo === 'prazo') return typeof Pedidos !== 'undefined' && Pedidos.mostrarPrazo(c, {pedido:m.pedido});
    if (m.tipo === 'defesa') return typeof Defesa !== 'undefined' && Defesa.mostrarAviso(c, {aviso:m.aviso});
    if (!r.presentes[id]) return false;
    UI.telaRecado(c);
    return true;
  },

  /* ---------- o presente ---------- */
  /* onde a pessoa espera: a cidade dela; quem vive na estrada (ou não
     tem cidade escrita), a cidade mais perto da rota dele, ou de você */
  ondeEncontrar(c){
    const d = Estado.dados;
    if (c.id === 'casa') return Mundo.idDaCidade(d.jogador.cidade) || 'pallet';
    let nome = null;
    try { nome = typeof c.cidade === 'function' ? c.cidade(d) : c.cidade; } catch(e){ nome = null; }
    let id = (nome && (Mundo.idDaCidade(nome) || Object.keys(LOCAIS).find(k => LOCAIS[k].nome === nome))) || null;
    if (id && LOCAIS[id] && LOCAIS[id].tipo === 'cidade') return id;
    if (!id && c.estrada && typeof TREINADORES_ESTRADA !== 'undefined'){ const t = TREINADORES_ESTRADA.find(z => z.id === c.estrada); id = t && t.local; }
    if (!id && c.veterano && typeof VETERANOS !== 'undefined'){ const v = VETERANOS.find(z => z.id === c.veterano); id = v && v.local; }
    return this.cidadeMaisPerto(id || Mundo.id());
  },
  /* a cidade mais perto pelo mapa, de preferência uma onde você já pisou */
  cidadeMaisPerto(de){
    if (LOCAIS[de] && LOCAIS[de].tipo === 'cidade' && Mundo.visitado(de)) return de;
    const vistos = new Set([de]), fila = [de];
    let primeira = null;
    while (fila.length){
      const a = fila.shift();
      const L = LOCAIS[a];
      if (L && L.tipo === 'cidade'){
        if (Mundo.visitado(a)) return a;
        if (!primeira) primeira = a;
      }
      for (const b of ((L && L.conexoes) || [])) if (!vistos.has(b)){ vistos.add(b); fila.push(b); }
    }
    return primeira || 'viridian';
  },
  separarPresente(c){
    const t = this.degrau(this.afinidade(c));
    if (!t) return null;
    let [item, qtd] = sortearPeso(t.itens);
    if (t.min >= 5 && PEDRA_DO_CONTATO[c.id] && Dados.chance(50)){ item = PEDRA_DO_CONTATO[c.id]; qtd = 1; }
    const onde = this.ondeEncontrar(c);
    if (!onde || !LOCAIS[onde]) return null;
    const p = {item, qtd, onde, dia:Estado.dados.relogio.dia};
    this.reg().presentes[c.id] = p;
    Estado.registrar(`${cap1(this.nomeNaNarracao(c))} mandou recado: separou uma coisa pra você ${emLocal(onde)}.`);
    return p;
  },
  /* o texto do recado, pro aparelho */
  textoDoRecado(c){
    const x = this.contexto(c);
    const p = this.reg().presentes[c.id];
    if (p){ x.ondeId = p.onde; x.emOnde = emLocal(p.onde); }
    return Dados.escolher(RECADO_DE_PRESENTE[this.tipoDe(x)])(x);
  },

  /* o que fazer no lugar: quem separou alguma coisa e está aqui */
  afazeres(localId){
    if (typeof Estado === 'undefined' || !Estado.dados || !Estado.dados.pokenav) return [];
    const out = [];
    for (const [cid, p] of Object.entries(this.reg().presentes)){
      if (p.onde !== localId) continue;
      const c = contatoPorId(cid);
      if (!c) continue;
      const nome = this.nomeNaNarracao(c);
      out.push(cid === 'casa'
        ? {id:'recado_' + cid, titulo:`Buscar o que ${nome} separou`, sub:'Em cima da mesa, segundo o recado.'}
        : {id:'recado_' + cid, titulo:`Encontrar ${nome}`, sub:'O recado dizia que ia estar pela cidade.'});
    }
    /* o pedido aberto: o passo dele que é aqui */
    if (typeof Pedidos !== 'undefined') out.push(...Pedidos.afazeres(localId));
    return out;
  },

  /* o encontro: a pessoa andando pela cidade, e o que ela separou */
  encontrar(cid){
    const c = contatoPorId(cid), p = this.reg().presentes[cid];
    if (!c || !p) return Exploracao.tela();
    Mundo.passar(1);
    const x = this.contexto(c);
    const tipo = this.tipoDe(x);
    delete this.reg().presentes[cid];
    this.doContato(cid).ultimoPresente = Estado.dados.relogio.dia;
    Estado.darItem(p.item, p.qtd);
    Estado.registrar(`Encontrou ${x.nome} ${emLocal(Mundo.id())} e saiu com ${p.qtd}× ${p.item}.`);
    const onde = this.ondeAcha(x, tipo);
    const falas = [onde].concat(Dados.escolher(ENTREGA[tipo])(x));
    Estado.salvar('auto');
    const L = Mundo.atual();
    UI.telaConversa({num:L.nome, titulo:x.Nome, loc:'pela cidade', falas,
      avisos:[{tipo:'item', texto:`Recebeu ${p.qtd}× ${p.item}.`}],
      botoes:[{texto:'Agradecer e seguir.', acao:'Exploracao.tela()'},
              {texto:'Ficar mais um período conversando.', acao:`Recados.ficar('${cid}')`}]});
  },
  /* onde você acha a pessoa, sem Centro nem loja onde a cidade não tem
     (Pallet tem a praça e a padaria) */
  ondeAcha(x, tipo){
    const L = Mundo.atual() || {}, tem = q => (L.lugares || []).includes(q);
    const linhas = (ONDE_ACHA[tipo] || ONDE_ACHA.outro).map(f => f(x))
      .filter(t => (tem('centro') || !/\bCentro\b/.test(t)) && (tem('loja') || !/\bloja\b/.test(t)));
    return linhas.length ? Dados.escolher(linhas) : ONDE_ACHA.outro[1](x);
  },
  ficar(cid){
    const c = contatoPorId(cid);
    Mundo.passar(1);
    this.mudarAfinidade(c, 1);
    Estado.salvar('auto');
    Exploracao.tela([{tipo:'info', texto:'Vocês ficam conversando até o período virar. Não é sobre nada, e é bom assim.'}]);
  },

  /* ---------- o morador que dá alguma coisa ---------- */
  /* quem falou na conversa: o primeiro balão com dono que não é você */
  quemFalou(linhas){
    const d = Estado.dados;
    const meu = d.jogador && d.jogador.nome;
    for (let l of (linhas || [])){
      if (typeof l === 'function'){ try { l = l(d); } catch(e){ l = null; } }
      if (l && typeof l === 'object' && l.quem && l.diz && l.quem !== meu && !l.casa) return l.quem;
    }
    return null;
  },
  /* depois da conversa da cidade: teste de Carisma, uma vez por dia em
     cada cidade, e a mesma pessoa só depois de PRESENTE_DA_CIDADE_ESPERA_DIAS.
     forcar ('sucesso' | 'critico') é pra conferência (chk-telas). */
  presenteDaConversa(localId, linhas, forcar){
    const d = Estado.dados, L = LOCAIS[localId];
    if (!L || L.tipo !== 'cidade') return [];
    const quem = this.quemFalou(linhas);
    if (!quem) return [];
    const reg = d.presentesDaCidade || (d.presentesDaCidade = {dias:{}, quem:{}});
    if (!forcar){
      if (reg.dias[localId] === d.relogio.dia) return [];
      const u = reg.quem[quem];
      if (u != null && d.relogio.dia - u < PRESENTE_DA_CIDADE_ESPERA_DIAS) return [];
    }
    const t = forcar ? {grau:forcar} : Dados.teste(Estado.j.status.carisma, PRESENTE_DA_CIDADE_DIFICULDADE, 'Carisma');
    if (t.grau !== 'sucesso' && t.grau !== 'critico') return [];
    reg.dias[localId] = d.relogio.dia;
    reg.quem[quem] = d.relogio.dia;
    const car = Estado.j.status.carisma || 1;
    let i = PRESENTES_DA_CIDADE.findIndex(z => car >= z.min);
    if (i < 0) i = PRESENTES_DA_CIDADE.length - 1;
    if (t.grau === 'critico' && i > 0) i--;
    const [item, qtd] = sortearPeso(PRESENTES_DA_CIDADE[i].itens);
    Estado.darItem(item, qtd);
    const q = (typeof Nomes !== 'undefined' && Nomes.comoChamar) ? Nomes.comoChamar(quem) : quem;
    Estado.registrar(`${cap1(q)} deu ${qtd}× ${item} ${emLocal(localId)}, depois de uma conversa.`);
    return [{tipo:'info', texto:Dados.escolher(DA_A_COISA)(cap1(q), q, coisaDoPresente(item, qtd))},
            {tipo:'item', texto:`Recebeu ${qtd}× ${item}.`}];
  },

  /* tudo que se fala aqui, pra conferência (chk-baloes): cada tópico
     com cada tipo de contato, o recado e o encontro */
  amostras(contatos){
    const out = [];
    for (const c of contatos){
      const x = this.contexto(c);
      const dono = c.id === 'casa' ? null : (falaComoDe(c) || textoContato(c, 'nome'));
      for (const t of TOPICOS_DE_LIGACAO){
        if (t.noticia) continue;
        let ok = false; try { ok = t.para(x); } catch(e){ ok = false; }
        if (!ok) continue;
        out.push({onde:`recado/${c.id}/${t.id}`, dono, linhas:t.falas(x)});
        t.escolhas(x).forEach((e, i) => out.push({onde:`recado/${c.id}/${t.id}>${i}`, dono, linhas:e.resultado || []}));
      }
      /* as notícias: cada uma, de dia e de madrugada */
      const d = Estado.dados, morto = (d.cemiterio || []).slice(-1)[0] || (d.time || [])[0];
      const eventos = [morto ? {tipo:'morte', p:morto} : null, {tipo:'custodia'}, {tipo:'insignia', nome:'Insígnia Cascata'}].filter(Boolean);
      for (const ev of eventos) for (const madrugada of [false, true]){
        const y = Object.assign({}, x, {evento:ev, madrugada});
        for (const t of TOPICOS_DE_LIGACAO){
          if (!t.noticia) continue;
          let ok = false; try { ok = t.para(y); } catch(e){ ok = false; }
          if (!ok) continue;
          out.push({onde:`recado/${c.id}/${t.id}${madrugada ? '/madrugada' : ''}`, dono, linhas:t.falas(y)});
          t.escolhas(y).forEach((e, i) => out.push({onde:`recado/${c.id}/${t.id}>${i}`, dono, linhas:e.resultado || []}));
        }
      }
      const tipo = this.tipoDe(x);
      /* quem atende o retorno da chamada perdida */
      ABRE_O_RETORNO[tipo].forEach((f, i) => out.push({onde:`recado/${c.id}/retorno${i}`, dono, linhas:[f(x)]}));
      out.push({onde:`recado/${c.id}/retorno grave`, dono, linhas:[ABRE_O_RETORNO_GRAVE(x)]});
      /* a ligação que você faz: quem atende, e os assuntos do lado de quem recebe */
      ABRE_A_CONVERSA[tipo].forEach((f, i) => out.push({onde:`recado/${c.id}/conversa${i}`, dono, linhas:[f(x)]}));
      out.push({onde:`recado/${c.id}/conversa grave`, dono, linhas:[ABRE_A_CONVERSA_GRAVE(x)]});
      const vl = this.contexto(c, {voceLigou:true});
      for (const t of TOPICOS_DE_LIGACAO){
        let ok = false; try { ok = !t.noticia && t.para(vl); } catch(e){ ok = false; }
        if (!ok) continue;
        out.push({onde:`recado/${c.id}/${t.id}/voce ligou`, dono, linhas:t.falas(vl)});
        t.escolhas(vl).forEach((e, i) => out.push({onde:`recado/${c.id}/${t.id}/voce ligou>${i}`, dono, linhas:e.resultado || []}));
      }
      for (const ev of eventos){
        const y = Object.assign({}, vl, {evento:ev, madrugada:true});
        for (const t of TOPICOS_DE_LIGACAO){
          let ok = false; try { ok = t.noticia && t.para(y); } catch(e){ ok = false; }
          if (ok) out.push({onde:`recado/${c.id}/${t.id}/voce ligou/madrugada`, dono, linhas:t.falas(y)});
        }
      }
      RECADO_DE_PRESENTE[tipo].forEach((f, i) => out.push({onde:`recado/${c.id}/msg${i}`, dono, linhas:f(x)}));
      ENTREGA[tipo].forEach((f, i) => out.push({onde:`recado/${c.id}/entrega${i}`, dono, linhas:f(x)}));
      if (typeof Pedidos !== 'undefined') out.push(...Pedidos.amostras(c));
    }
    return out;
  }
};
