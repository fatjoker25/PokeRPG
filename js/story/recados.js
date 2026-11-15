/* ============================================================
   RECADOS — quem tem o seu número também procura você
   As ligações escritas (CHAMADAS, em pokenav.js) tocam uma vez cada.
   Aqui mora o resto do telefone:
   - de vez em quando alguém da agenda liga à toa, pra conversar, e o
     que você responde aproxima ou afasta (a afinidade);
   - quem gosta de você às vezes manda recado de que separou alguma
     coisa, e espera na cidade dele até você passar ("Encontrar", no
     que fazer do lugar);
   - e quem mora na cidade, depois de uma conversa, pode te dar alguma
     coisa, pelo seu Carisma.
   O que vem sai das tabelas daqui (a folha de regras lê as mesmas).
   A conversa à toa usa a tela da chamada: Chamadas manda pra cá o que
   tem id começando com 'rec_'.
   ============================================================ */

const RECADO_INTERVALO_DIAS = 2;        // entre um contato à toa e outro, de qualquer pessoa
const RECADO_POR_CONTATO_DIAS = 7;      // a mesma pessoa não procura de novo antes disso
const CHANCE_RECADO_NA_CHEGADA = 30;    // chegando num lugar, o telefone pode tocar
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
  {min:8, nome:'de confiança', itens:[['Pedra do Sol', 1, 2], ['Moon Stone', 1, 2], ['PP Up', 1, 2], ['Elixir', 2, 2], ['Revive', 2, 2], ['Ultra Ball', 3, 2]]},
  {min:5, nome:'próximo', itens:[['Hyper Potion', 2, 3], ['Ultra Ball', 2, 3], ['Revive', 1, 2], ['Moon Stone', 1, 1],
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
  falas:x => [x.periodo === 'madrugada' ? x.diz('Te acordei? Desculpa. Onde você tá?') : x.diz('Onde você tá agora?')],
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
    {texto:'Mudar de assunto.', afeto:0, resultado:[x.diz('Tá. Liguei por nada, mesmo.')]}
  ]
},
{
  id:'o_tempo', para:x => x.figura,
  falas:x => [x.diz(`${x.sorteio(TEMPO_DA_CIDADE)} o dia inteiro aqui ${x.emCidadeDele}.`), x.diz('Fiquei pensando se pegou você na estrada.')],
  escolhas:x => [
    {texto:'"Aqui também."', afeto:1, resultado:[x.diz('Então seca o time antes de dormir.')]},
    {texto:'Contar onde você está e como está o céu daí.', afeto:1, resultado:['Você conta.', x.diz('Daqui não dá pra ver. Mas agora eu sei.')]},
    {texto:'"Você ligou pra falar do tempo?"', afeto:-1, resultado:[x.diz('Às vezes a gente liga pra isso, sim.', 'baixo')]}
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
    {texto:'"Depois eu ligo."', afeto:-1, resultado:[x.diz('Liga mesmo, então.', 'baixo')]}
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

const Recados = {
  atual:null,      // a ligação à toa que está tocando agora
  _n:0,

  /* ---------- o registro, dentro do PokéNav ---------- */
  reg(){
    const nav = Estado.nav();
    if (!nav.recados) nav.recados = {ultimoDia:null, contatos:{}, presentes:{}};
    if (!nav.recados.contatos) nav.recados.contatos = {};
    if (!nav.recados.presentes) nav.recados.presentes = {};
    return nav.recados;
  },
  doContato(id){ const r = this.reg(); return r.contatos[id] || (r.contatos[id] = {}); },

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
  mudarAfinidade(c, delta){
    if (!c || !delta) return 0;
    const atual = this.afinidade(c);
    let novo;
    if (delta > 0) novo = atual >= AFINIDADE_TETO_LIGACAO ? atual : Math.min(AFINIDADE_TETO_LIGACAO, atual + delta);
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
  candidatos(){
    if (!Estado.temPokenav()) return [];
    const d = Estado.dados;
    return Estado.contatosNaAgenda().filter(c => {
      try { if (c.requer && !c.requer(d)) return false; } catch(e){ return false; }
      const u = this.doContato(c.id).ultimoDia;
      return u == null || d.relogio.dia - u >= RECADO_POR_CONTATO_DIAS;
    });
  },
  /* quem gosta mais liga mais */
  quemLiga(){
    const cs = this.candidatos();
    if (!cs.length) return null;
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

  /* chegando num lugar: o telefone pode tocar */
  talvezNaChegada(){ return Dados.chance(CHANCE_RECADO_NA_CHEGADA) && this.talvez(); },

  /* o telefone toca, ou chega recado: no máximo um contato à toa a cada
     RECADO_INTERVALO_DIAS dias. Abre por cima da tela, depois que ela
     desenha, como as chamadas escritas. */
  talvez(){
    if (typeof Estado === 'undefined' || !Estado.dados || !Estado.temPokenav() || emLuta()) return false;
    const d = Estado.dados;
    const r = this.reg();
    if (r.ultimoDia != null && d.relogio.dia - r.ultimoDia < RECADO_INTERVALO_DIAS) return false;
    const c = this.quemLiga();
    if (!c) return false;
    r.ultimoDia = d.relogio.dia;
    this.doContato(c.id).ultimoDia = d.relogio.dia;
    if (this.podeMandarPresente(c) && Dados.chance(this.chanceDoPresente(c)) && this.separarPresente(c)){
      Estado.salvar('auto');
      setTimeout(() => UI.telaRecado(c), 80);
      return true;
    }
    const ch = this.montarLigacao(c);
    if (!ch) return false;
    Estado.salvar('auto');
    setTimeout(() => UI.telaChamada(ch), 80);
    return true;
  },

  /* ---------- o que se diz ---------- */
  contexto(c){
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
      periodo:d.relogio.periodo,
      lider:!!c.ginasio, treinador:c.tipo === 'treinador', figura:c.tipo !== 'treinador' && !casa,
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
  topicosDe(c){
    const x = this.contexto(c);
    return TOPICOS_DE_LIGACAO.filter(t => { try { return t.para(x); } catch(e){ return false; } });
  },
  montarLigacao(c, topicoId){
    if (!c) return null;
    const x = this.contexto(c);
    const pool = this.topicosDe(c);
    if (!pool.length) return null;
    let t = topicoId ? pool.find(z => z.id === topicoId) : null;
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
    if (c) Estado.registrar(`Conversou com ${this.nomeNaNarracao(c)} pelo PokéNav.`);
    Estado.salvar('auto');
    return {chamada:ch, esc, avisos:[]};
  },
  recusar(id){
    const ch = this.chamada(id);
    if (!ch) return null;
    this.atual = null;
    const c = contatoPorId(ch.de);
    this.mudarAfinidade(c, -1);
    if (c) Estado.registrar(`Não atendeu ${this.nomeNaNarracao(c)}.`);
    Estado.salvar('auto');
    return {chamada:ch, recusou:true};
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
    const onde = Dados.escolher(ONDE_ACHA[tipo] || ONDE_ACHA.outro)(x);
    const falas = [onde].concat(Dados.escolher(ENTREGA[tipo])(x));
    Estado.salvar('auto');
    const L = Mundo.atual();
    UI.telaConversa({num:L.nome, titulo:x.Nome, loc:'pela cidade', falas,
      avisos:[{tipo:'item', texto:`Recebeu ${p.qtd}× ${p.item}.`}],
      botoes:[{texto:'Agradecer e seguir.', acao:'Exploracao.tela()'},
              {texto:'Ficar mais um período conversando.', acao:`Recados.ficar('${cid}')`}]});
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
        let ok = false; try { ok = t.para(x); } catch(e){ ok = false; }
        if (!ok) continue;
        out.push({onde:`recado/${c.id}/${t.id}`, dono, linhas:t.falas(x)});
        t.escolhas(x).forEach((e, i) => out.push({onde:`recado/${c.id}/${t.id}>${i}`, dono, linhas:e.resultado || []}));
      }
      const tipo = this.tipoDe(x);
      RECADO_DE_PRESENTE[tipo].forEach((f, i) => out.push({onde:`recado/${c.id}/msg${i}`, dono, linhas:f(x)}));
      ENTREGA[tipo].forEach((f, i) => out.push({onde:`recado/${c.id}/entrega${i}`, dono, linhas:f(x)}));
    }
    return out;
  }
};
