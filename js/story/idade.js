/* ============================================================
   IDADE E ANIVERSÁRIO
   Todo mundo sai de casa com quinze anos. A ficha pede só o dia e o
   mês do aniversário: o ano sai sozinho, o que dá quinze no dia da
   perua (o calendário começa em março de 2010, numa segunda). Se o
   aniversário cai durante a jornada, você faz dezesseis na estrada, e
   quem te conhece manda parabéns; quem ficou em casa, sempre.

   A idade não abre nem fecha porta nenhuma: a história foi escrita pra
   alguém de quinze.

   No texto, {idade} é a idade de hoje por extenso, {Idade} com
   maiúscula, {IDADE} toda em maiúscula, {idade+N} daqui a N anos e
   {saida} a idade com que você saiu de casa. {menor:A|B} escolhe A
   pra menor de 18 e B pra maior (dentro de A e B só cabem as marcas de número).
   ============================================================ */
const ANO_DO_JOGO = 2010;
const IDADE_SAIDA = 15;
const MAIORIDADE = 18;
const MESES_DO_ANO = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

function porExtenso(n){
  const U = ['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze',
             'quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
  const D = {2:'vinte', 3:'trinta', 4:'quarenta', 5:'cinquenta', 6:'sessenta', 7:'setenta', 8:'oitenta', 9:'noventa'};
  n = Math.max(0, Math.round(n));
  if (n < 20) return U[n];
  if (n < 100){ const d = Math.floor(n / 10), u = n % 10; return D[d] + (u ? ' e ' + U[u] : ''); }
  return String(n);
}

/* a data de hoje no jogo, com ano */
function dataDoJogo(){
  const c = Calendario.hoje();
  return {dia:c.diaMes, mes:((c.mes + 2) % 12) + 1, ano:c.ano};
}

/* O dia em que a jornada começa: o primeiro dia do calendário, ou, na
   ficha, o dia da perua na cidade escolhida. */
function diaDaSaida(cidadeNome){
  if (!cidadeNome && typeof Calendario !== 'undefined' && typeof Estado !== 'undefined' && Estado.dados && Estado.dados.relogio){
    const c = Calendario.de(1);
    return {dia:c.diaMes, mes:((c.mes + 2) % 12) + 1, ano:c.ano};
  }
  const id = cidadeNome && Object.keys(LOCAIS).find(k => LOCAIS[k].nome === cidadeNome);
  const dia = (id && typeof DIA_DA_PERUA !== 'undefined' && DIA_DA_PERUA[id]) || 1;
  return {dia, mes:3, ano:ANO_DO_JOGO};
}

/* O ano que dá quinze no dia da saída: quem faz aniversário depois
   dela ainda vai fazer dezesseis nesse ano. */
function anoQueDaQuinze(nasc, saida){
  const depois = nasc.mes > saida.mes || (nasc.mes === saida.mes && nasc.dia > saida.dia);
  return saida.ano - IDADE_SAIDA - (depois ? 1 : 0);
}

/* A data de nascimento é dia e mês; o ano é sempre o calculado (save
   antigo com ano escolhido volta pros quinze). Save sem data sorteia. */
function nascimentoDe(d){
  d = d || Estado.dados;
  const j = d && d.jogador;
  if (!j) return null;
  if (!j.nascimento) j.nascimento = {dia:Dados.entre(1, 28), mes:Dados.entre(1, 12)};
  j.nascimento.ano = anoQueDaQuinze(j.nascimento, diaDaSaida());
  j.idade = IDADE_SAIDA;
  return j.nascimento;
}

function idadeNaData(nasc, data){
  let n = data.ano - nasc.ano;
  if (data.mes < nasc.mes || (data.mes === nasc.mes && data.dia < nasc.dia)) n--;
  return n;
}

function idadeJogador(d){
  d = d || (typeof Estado !== 'undefined' && Estado.dados);
  if (!d || !d.jogador) return 15;
  if (!d.relogio || typeof Calendario === 'undefined') return d.jogador.idade || 15;
  const n = nascimentoDe(d);
  return idadeNaData(n, dataDoJogo());
}
function ehMenor(d){ return idadeJogador(d) < MAIORIDADE; }

/* a idade no dia em que a jornada começou */
function idadeDeSaida(){ return IDADE_SAIDA; }

function textoNascimento(n){
  return n ? `${n.dia === 1 ? '1º' : n.dia} de ${MESES_DO_ANO[n.mes - 1]}` : '';
}

/* as marcas de idade, resolvidas antes das de gênero */
function marcasDeIdade(s){
  if (typeof s !== 'string' || s.indexOf('{') < 0) return s;
  if (!/\{(idade|Idade|IDADE|saida|menor:)/.test(s)) return s;
  let id = 15, sai = 15, menor = true;
  try { id = idadeJogador(); sai = idadeDeSaida(); menor = id < MAIORIDADE; } catch(e){}
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  /* os números primeiro: {menor:…} pode ter {idade} dentro */
  /* lembrança: "faz {idade-3} anos" é a primeira coisa de que se lembra
     (a regra das memórias: idade − 3, nunca menos de um) */
  return s.replace(/\{idade\+(\d+)\}/g, (_, k) => porExtenso(id + (+k)))
          .replace(/\{Idade-(\d+)\}/g, (_, k) => cap(porExtenso(Math.max(1, id - (+k)))))
          .replace(/\{idade-(\d+)\}/g, (_, k) => porExtenso(Math.max(1, id - (+k))))
          .replace(/\{IDADE\}/g, () => porExtenso(id).toUpperCase())
          .replace(/\{Idade\}/g, () => cap(porExtenso(id)))
          .replace(/\{idade\}/g, () => porExtenso(id))
          .replace(/\{saida\}/g, () => porExtenso(sai))
          .replace(/\{menor:([^{}|]*)\|([^{}|]*)\}/g, (_, a, b) => menor ? a : b);
}

/* ============================================================
   O ANIVERSÁRIO
   Aparece na primeira tela de mapa do dia (ou depois, se o dia
   passou no meio de um capítulo), uma vez por ano.
   ============================================================ */
const PARABENS_DE_CONHECIDO = [
  'Feliz aniversário. Não faz besteira hoje. Amanhã pode.',
  'Parabéns! Você comentou a data uma vez e eu anotei. Eu anoto tudo.',
  'Mais um ano. Tá mais alto? Manda foto.',
  'Feliz aniversário. Come alguma coisa doce, é obrigatório.',
  'Parabéns. Passa aqui quando puder, que tem um pedaço de bolo guardado no congelador com o seu nome.'
];

const Aniversario = {
  /* o aniversário deste ano já chegou e ainda não foi festejado? */
  pendente(){
    const d = Estado.dados;
    if (!d || !d.jogador || !d.relogio || !d.capitulo || d.capitulo < 2) return false;
    const n = nascimentoDe(d), h = dataDoJogo();
    d.aniversarios = d.aniversarios || {};
    if (d.aniversarios[h.ano]) return false;
    /* este ano: chegou no dia ou depois, e a jornada já tinha começado */
    const chegou = h.mes > n.mes || (h.mes === n.mes && h.dia >= n.dia);
    if (!chegou) return false;
    /* aniversário antes da saída (já passou quando você saiu): não conta este ano */
    const c1 = Calendario.de(1);
    const sai = {dia:c1.diaMes, mes:((c1.mes + 2) % 12) + 1, ano:c1.ano};
    if (h.ano === sai.ano && (n.mes < sai.mes || (n.mes === sai.mes && n.dia <= sai.dia))){
      d.aniversarios[h.ano] = 'antes';
      return false;
    }
    return true;
  },

  /* a cena: quem lembra de você, nessa ordem */
  festejar(){
    const d = Estado.dados;
    const h = dataDoJogo(), n = nascimentoDe(d);
    d.aniversarios[h.ano] = true;
    const idade = idadeJogador(d);
    const atrasado = !(h.mes === n.mes && h.dia === n.dia);
    const falas = [];
    falas.push(atrasado
      ? `Você só se dá conta no meio do caminho: o seu aniversário passou ${h.dia - n.dia === 1 && h.mes === n.mes ? 'ontem' : 'faz uns dias'}, no meio de tudo. ${cap1(porExtenso(idade))} anos.`
      : Dados.escolher([
          `Você acorda e demora um minuto pra lembrar que dia é hoje. ${cap1(porExtenso(idade))} anos.`,
          `Hoje você faz ${porExtenso(idade)} anos, longe de casa pela primeira vez num aniversário.`,
          `${cap1(porExtenso(idade))} anos. Você conta nos dedos só pra ter certeza, e ninguém está olhando.`]));

    /* Comunicação é no PokéNav: com ele, a ligação de casa e as
       mensagens abrem no próprio aparelho, por cima desta tela. Sem
       ele, chega tudo em papel no balcão do Centro. */
    const temNav = Estado.temPokenav();
    const nav = [];
    const papel = f => (typeof f === 'object' && f && f.diz != null) ? `**"${txt(f.diz)}"**` : f;
    const deCasa = falaDaCasa('aniversario', d);
    if (temNav){
      falas.push('O PokéNav não para de vibrar no bolso o dia inteiro.');
      nav.push(atrasado
        ? `Uma chamada perdida de ${nomeCasa()}, de ${h.mes === n.mes && h.dia - n.dia === 1 ? 'ontem' : 'uns dias atrás'}. Você liga de volta.`
        : `${nomeCasa()} liga antes das sete.`);
      deCasa.forEach(f => nav.push(f));
      nav.push('No fim da tarde chega um pacote no Centro mais perto, com dinheiro dobrado em quatro e duas Super Potion.');
    } else {
      falas.push(`No balcão do Centro mais próximo tem um envelope no seu nome, com a letra de ${nomeCasa()}.`);
      deCasa.forEach(f => falas.push(papel(f)));
      falas.push('Dentro do envelope tem dinheiro dobrado em quatro e duas Super Potion.');
    }

    /* o Célio, que anota tudo no caderno */
    if (temNav && typeof conheceOCelio === 'function' && conheceOCelio(d) && (Estado.temNumero('goro') || d.flags.numero_do_goro))
      nav.push(fala('Célio', `Tá no caderno: ${n.dia === 1 ? '1º' : n.dia} de ${MESES_DO_ANO[n.mes - 1]}. Parabéns, ${d.jogador.nome}! ${(() => { const p = typeof inicialDoJogador === 'function' && inicialDoJogador(d); return p ? `Dá um abraço n${pron(p).o} ${p.apelido || p.nome} por mim.` : 'Eu lembro de todo mundo.'; })()}`, 'riso'));

    /* quem te conhece bem: mensagem no aparelho, ou bilhete no balcão */
    const amigos = Object.values(d.npcs || {})
      .filter(x => x && x.nome && x.nome !== 'Célio' && (x.opiniao || 0) >= 4)
      .sort((a, b) => (b.opiniao || 0) - (a.opiniao || 0)).slice(0, 2);
    amigos.forEach((x, i) => {
      const msg = PARABENS_DE_CONHECIDO[(h.ano + i + x.nome.length) % PARABENS_DE_CONHECIDO.length];
      if (temNav) nav.push(fala(x.nome, msg));
      else { falas.push(`Junto do envelope, um bilhete dobrado de ${x.nome}:`); falas.push(`**"${msg}"**`); }
    });

    /* o rival, se já cruzou com você (e só tem como saber pelo aparelho) */
    const r = d.rival;
    if (temNav && r && r.encontros > 0)
      nav.push(fala(r.nome, r.vitorias > r.derrotas
        ? 'Parabéns. Um ano mais velh{o|a} e ainda atrás de mim.'
        : 'Parabéns. Aproveita, que no próximo encontro eu ganho.', 'riso'));

    /* o time */
    const vivos = d.time.filter(p => !p.morto);
    if (vivos.length){
      const p = Dados.escolher(vivos);
      falas.push(`O time não sabe o que é aniversário. Mas ${nomeExib(p)} passa o dia inteiro mais perto de você que o normal, e ninguém explicou nada pra ${pron(p).ele}.`);
    }


    const efeitos = () => {
      Estado.j.dinheiro += 1000;
      Estado.darItem('Super Potion', 2);
      vivos.forEach(p => { p.moral = Math.min(100, p.moral + 5); });
      Estado.registrar(`Fez ${porExtenso(idade)} anos na estrada${atrasado ? ', e só lembrou depois' : ''}.`);
      Estado.salvar('auto');
    };
    efeitos();
    UI.telaConversa({
      num: `${h.dia === 1 ? '1º' : h.dia} de ${MESES_DO_ANO[h.mes - 1]}`, titulo:`${cap1(porExtenso(idade))} anos`, loc:(Mundo.atual() || {}).nome || '',
      falas,
      avisos:[{tipo:'item', texto:'+1.000 ₽ e 2× Super Potion.'}, {tipo:'cura', texto:'O time inteiro fica mais perto de você.'}],
      botoes:[{texto:'Seguir', acao:'Exploracao.tela()'}]
    });
    if (temNav && nav.length) setTimeout(() => UI.navMensagens('Feliz aniversário', nav), 80);
  }
};
function cap1(t){ return t.charAt(0).toUpperCase() + t.slice(1); }

/* ============================================================
   BICO NA CIDADE
   A estiva de Vermilion e o cassino de Celadon. Ninguém pergunta a
   idade: o capataz pergunta se você aguenta, e o cassino, se você tem
   ficha. (O id 'idade_' das ações ficou do tempo em que a idade abria
   porta, e não foi trocado pra não quebrar save.)
   ============================================================ */
const PORTAS_DA_IDADE = [
  {id:'estiva', local:'vermilion', titulo:'A estiva do cais',
   quando:() => { const h = Estado.dados.relogio; sincronizarHora(h); return h.hora >= 5 && h.hora <= 11; },
   foraDeHora:'A estiva contrata às cinco da manhã. Depois disso o cais já está cheio.'},
  {id:'cassino', local:'celadon', titulo:'O cassino da avenida',
   quando:() => true}
];

const PortasDaIdade = {
  afazeres(localId){
    return PORTAS_DA_IDADE.filter(p => p.local === localId).map(p => ({lugar:true, id:'idade_' + p.id, titulo:p.titulo}));
  },
  fazer(id){
    const p = PORTAS_DA_IDADE.find(x => x.id === id);
    if (!p) return Exploracao.tela();
    if (!p.quando()) return Exploracao.tela([{tipo:'info', texto:p.foraDeHora}]);
    return this[id]();
  },

  /* a estiva: um período de carga pesada, pago no fim */
  estiva(){
    Mundo.passar(1);
    const t = Dados.teste(Estado.j.status.forca, 5, 'Força');
    const paga = {critico:1800, sucesso:1300, parcial:900, falha:500}[t.grau];
    Estado.j.dinheiro += paga;
    if (t.grau === 'falha') Estado.dados.jogador.hp = Math.max(1, Estado.dados.jogador.hp - 3);
    Estado.registrar('Trabalhou um turno na estiva do cais de Vermilion.');
    Estado.salvar('auto');
    Exploracao.tela([
      {tipo:'info', texto:'O capataz te põe de ajudante, que é como ele chama quem tem {idade} anos e pede serviço às cinco da manhã.'},
      {tipo:'info', texto:{
        critico:'Você carrega no ritmo dos mais velhos desde a primeira hora. No fim do turno o capataz paga e pergunta se você volta amanhã.',
        sucesso:'Seis horas de saco, caixa e corda. O Machamp do cais carrega quatro de cada vez e você carrega uma, e todo mundo acha isso justo.',
        parcial:'Você aguenta o turno, mas pela metade do ritmo. O capataz paga a metade que você aguentou.',
        falha:'No meio da manhã uma caixa escorrega e você segura com o ombro. Ele paga o que você fez e manda você pra casa.'}[t.grau]},
      {tipo:'item', texto:`+${fmtDin(paga)} ₽`}
    ]);
  },

  /* o cassino: uma rodada de ficha, a Sorte decide */
  cassino(){
    const d = Estado.dados;
    const aposta = Math.min(1000, Estado.j.dinheiro);
    if (aposta < 100) return Exploracao.tela([{tipo:'info', texto:'O caixa olha o que você tem no bolso e nem abre a gaveta de fichas.'}]);
    Mundo.passar(1);
    const t = Dados.teste(Estado.j.status.sorte, 6, 'Sorte');
    const ganho = {critico:aposta * 2, sucesso:Math.round(aposta * 0.6), parcial:-Math.round(aposta * 0.5), falha:-aposta}[t.grau];
    Estado.j.dinheiro = Math.max(0, Estado.j.dinheiro + ganho);
    Estado.registrar(ganho > 0 ? 'Saiu do cassino de Celadon com mais do que entrou.' : 'Deixou dinheiro no cassino de Celadon.');
    Estado.salvar('auto');
    Exploracao.tela([
      {tipo:'info', texto:`O segurança da porta não pergunta a sua idade. Ninguém aqui pergunta nada a quem tem dinheiro na mão. Você troca ${fmtDin(aposta)} ₽ em fichas. A sala não tem janela nem relógio, de propósito, e o barulho das máquinas não para nunca.`},
      {tipo:'info', texto:ganho > 0
        ? 'A máquina do canto acende inteira e cospe ficha no chão. Duas pessoas olham pra você com raiva.'
        : 'As fichas vão embora numa velocidade que você não acreditaria se contassem.'},
      {tipo: ganho > 0 ? 'item' : 'dano', texto:`${ganho > 0 ? '+' : '−'}${fmtDin(Math.abs(ganho))} ₽`}
    ]);
  }
};
