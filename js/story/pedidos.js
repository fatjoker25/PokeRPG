/* ============================================================
   PEDIDOS — quem tem o seu número às vezes liga pedindo um favor
   Foi pedido assim: o contato liga pedindo ajuda (o Pokémon que
   fugiu numa rota, uma encomenda pra outra cidade, se você viu tal
   espécie), e o favor vira missão no jeito do PokéNav: pedir na
   ligação, cumprir no mundo, ligar de volta pra contar, com
   afinidade e presente no fim.
   Quem decide que a ligação à toa é um pedido é o
   Recados.escolherToque; aqui mora o resto: o que se pede e onde, o
   que aparece no lugar, a linha na ficha do PokéNav, o prazo e o que
   a pessoa dá. Um pedido aberto por vez, em nav.recados.pedido.
   ============================================================ */

const CHANCE_DO_PEDIDO = 30;          // % das ligações à toa que viram pedido, quando a pessoa pode pedir
const PEDIDO_MIN_AFINIDADE = 1;       // quem pede tem afinidade 1 ou mais com você
const PEDIDO_ESPERA_DIAS = 14;        // a mesma pessoa pede de novo só depois disso
const AFINIDADE_DO_PEDIDO = 2;        // cumprido e contado
const AFINIDADE_TETO_PEDIDO = 10;     // o favor feito no mundo aproxima até aqui, acima do teto do telefone
const REP_DO_PEDIDO = 1;              // reputação boa por pedido cumprido
const DIFICULDADE_DA_PROCURA = 5;     // procurar o Pokémon que fugiu: teste de Percepção
const PRAZO_DO_PEDIDO = {perdido:5, entrega:10, avistar:20};   // dias até a pessoa desistir de esperar
const TIPOS_DE_PEDIDO = ['perdido', 'entrega', 'avistar'];
const FORA_DO_AVISTAR = new Set([144, 145, 146, 150, 151]);    // lendário não é boato de vizinho
const ROTA_SEM_PERDIDO = new Set(['rota23', 'caminho_vitoria']);

/* o Pokémon que fugiu: o de quem treina no ginásio é do tipo do líder;
   o resto é de estimação, de porta de casa */
const PERDIDO_DO_GINASIO = {brock:[74, 27], misty:[54, 79], surge:[25, 100, 81], erika:[43, 69, 46],
  koga:[48, 109, 88], sabrina:[63, 122], blaine:[37, 58, 77], blue:[16, 133, 52]};
const PERDIDO_DE_ESTIMACAO = [58, 37, 52, 25, 133, 77, 16, 54, 35, 39, 21, 27, 60];

/* onde ele estava, pelo chão da rota */
const ONDE_ESTAVA = {
  campo:['encolhido debaixo de uma moita', 'deitado na sombra de uma placa, olhando a estrada'],
  floresta:['enfiado num tronco oco', 'quieto no meio das raízes de uma árvore grande'],
  montanha:['numa fenda entre duas pedras, longe do caminho', 'em cima de um barranco, sem saber descer'],
  caverna:['num canto da galeria, longe da luz da entrada', 'atrás de uma pedra, quieto, com medo do próprio eco'],
  agua:['na beira da água, debaixo de um tronco caído', 'num banco de areia, olhando a água'],
  outro:['atrás de uma pedra grande']
};

/* a encomenda: o nome diz o que a coisa é (o desenho sai do nome) */
const ENCOMENDAS = [
  {item:'Pote de geleia', o:'o pote', um:'um pote de geleia', f:false},
  {item:'Garrafa de chá', o:'a garrafa', um:'uma garrafa de chá', f:true},
  {item:'Caixa de ferramentas', o:'a caixa', um:'uma caixa de ferramentas', f:true},
  {item:'Lata de biscoito', o:'a lata', um:'uma lata de biscoito', f:true},
  {item:'Sacola de roupa', o:'a sacola', um:'uma sacola de roupa', f:true},
  {item:'Rede de pesca', o:'a rede', um:'uma rede de pesca', f:true}
];
/* pra quem vai: gente da pessoa, numa casa que se acha na rua */
const DESTINATARIOS = [
  {quem:'uma amiga minha', pron:'ela', casa:'a casa de portão verde perto da praça', onde:'mora na casa de portão verde, perto da praça'},
  {quem:'um primo meu', pron:'ele', casa:'o sobrado amarelo da esquina', onde:'mora no sobrado amarelo da esquina'},
  {quem:'uma conhecida', pron:'ela', casa:'a casa com o varal no quintal', onde:'mora na casa com o varal no quintal'},
  {quem:'um amigo antigo', pron:'ele', casa:'a casa de janela azul no fim da rua', onde:'mora na casa de janela azul, no fim da rua'}
];
/* quem passa a encomenda na sua mão fecha assim */
const FECHO_DA_ENCOMENDA = {
  casa:x => [x.diz('Não precisa correr. Só não esquece.')],
  lider:x => [x.diz('Se perguntarem por que eu não fui, diz que o ginásio não deixa.')],
  treinador:x => [x.diz('Vai na boa. Eu fico te devendo essa.')],
  figura:x => [x.diz('Cuidado no caminho. Pesa mais do que parece.')]
};

/* ------------------------------------------------------------
   O que se fala. Cada jeito de pedido diz o que a pessoa fala ao
   pedir (pede, por tipo de contato), o que você responde (sim, nao),
   o que ela diz quando você aceita, o que você conta na ligação de
   volta (conto) e o agradecimento, a mensagem de quando passou do
   prazo, o passo que falta (pra ficha do PokéNav) e quando está
   pronto. p é o pedido montado; x, o contexto do Recados.
   ------------------------------------------------------------ */
const PEDIDOS = {
  perdido:{
    resumo:p => `achar o ${p.esp} que fugiu ${emLocal(p.onde)} e deixar no Centro ${Pedidos.de(p.centro)}`,
    pede:{
      casa:(x, p) => [x.diz(`O ${p.esp} da vizinha fugiu ontem de noite e não voltou.`),
        x.diz(`Disseram que viram um igual ${emLocal(p.onde)}. Ela está de pé na porta desde cedo.`),
        x.diz(`Se você achar, leva no Centro ${Pedidos.de(p.centro)}. Eu já liguei pra lá e deixei o nome dela.`)],
      lider:(x, p) => [x.diz(`Um menino que treina aqui perdeu o ${p.esp} dele ${emLocal(p.onde)}.`),
        x.diz('Eu não posso largar o ginásio esta semana, e ele não sai do vestiário.'),
        x.diz(`Se você passar por lá e achar, deixa no Centro ${Pedidos.de(p.centro)}. A enfermeira sabe de quem é.`)],
      treinador:(x, p) => [x.diz(`O meu ${p.esp} saiu correndo atrás de um bando ${emLocal(p.onde)} e não voltou.`),
        x.diz('Eu estou longe, e só volto pra aqueles lados na semana que vem.'),
        x.diz(`Se achar, deixa no Centro ${Pedidos.de(p.centro)}. Eu passo lá pra buscar.`)],
      figura:(x, p) => [x.diz(`Desculpa ligar pra isso. O ${p.esp} que dorme na minha porta sumiu.`),
        x.diz(`Uma pessoa viu um igual ${emLocal(p.onde)}.`),
        x.diz(`Se for ele, leva no Centro ${Pedidos.de(p.centro)}? Eu deixei recado no balcão.`)]
    },
    sim:'"Eu procuro."',
    nao:'"Agora não vai dar."',
    aceitou:{
      casa:x => [x.diz('Eu sabia que podia contar com você. Vai com cuidado.')],
      lider:x => [x.diz('Fico te devendo. E ele também, só que ele ainda não sabe.')],
      treinador:x => [x.diz('Valeu. De verdade.')],
      figura:x => [x.diz('Que bom. Eu não sabia pra quem mais ligar.')]
    },
    conto:p => `Achei o ${p.esp}. Ficou no Centro ${Pedidos.de(p.centro)}.`,
    agradece:{
      casa:x => [x.diz('A vizinha já foi buscar. Veio aqui me abraçar antes, e eu nem fiz nada.'), x.diz('E não discute: tem uma coisa pra você.')],
      lider:x => [x.diz('O menino dormiu com ele no colo, no banco do vestiário. Ninguém teve coragem de acordar.'), x.diz('Isso é pra você. Não é pagamento.')],
      treinador:x => [x.diz('Ele já está comigo, e não sai do meu lado.'), x.diz('Fica com isso. Eu insisto.')],
      figura:x => [x.diz('Ele voltou pra porta. Dormiu lá a noite inteira, como se nada.'), x.diz('Guardei isso pra você.')]
    },
    prazo:(x, p) => [x.diz(`Acharam o ${p.esp}. Pode parar de procurar.`)],
    passo:(x, p) => !p.achou ? `O ${p.esp} ainda não apareceu ${emLocal(p.onde)}.`
                             : `O ${p.esp} está com você. Falta o Centro ${Pedidos.de(p.centro)}.`,
    pronto:p => !!p.pronto,
    contar:p => `Contar que o ${p.esp} está no Centro`
  },

  entrega:{
    resumo:p => `levar ${p.um} ${Pedidos.de(p.pega)} até ${p.dest.casa}, ${emLocal(p.leva)}`,
    pede:{
      casa:(x, p) => [x.diz(`Eu queria mandar ${p.um} pra ${p.dest.quem} ${emLocal(p.leva)}.`),
        x.diz('Pelo correio demora uma semana, e eu não confio no correio.'),
        x.diz(`Passa em casa e pega? Fica aqui ${emLocal(p.pega)} te esperando.`)],
      lider:(x, p) => [x.diz(`Prometi ${p.um} pra ${p.dest.quem} ${emLocal(p.leva)}, e eu não saio do ginásio esta semana.`),
        x.diz(`Está comigo ${emLocal(p.pega)}. Me acha na rua e leva pra mim?`)],
      treinador:(x, p) => [x.diz(`Estou ${emLocal(p.pega)} com ${p.um} que é pra ${p.dest.quem}, ${emLocal(p.leva)}.`),
        x.diz('Só que eu vou pro outro lado. Você leva?')],
      figura:(x, p) => [x.diz(`Preciso mandar ${p.um} pra ${p.dest.quem} ${emLocal(p.leva)}.`),
        x.diz(`Você vai pra aqueles lados? Eu estou ${emLocal(p.pega)}, te passo na rua.`)]
    },
    sim:'"Eu levo."',
    nao:'"Não vou pra aqueles lados agora."',
    aceitou:{
      casa:x => [x.diz('Então vem. Eu embrulho enquanto você chega.')],
      lider:x => [x.diz('Fechado. Eu fico pela rua, perto do ginásio.')],
      treinador:x => [x.diz('Valeu mesmo. Eu fico pela cidade até você aparecer.')],
      figura:x => [x.diz('Ah, que bom. Eu fico por aqui, andando.')]
    },
    conto:p => `Entreguei. Chegou inteir${p.f ? 'a' : 'o'}.`,
    agradece:{
      casa:x => [x.diz('Já me ligaram agradecendo. Disseram que você tem cara de quem come pouco.'), x.diz('Isso é pra você.')],
      lider:x => [x.diz('Me ligaram de lá. Chegou do jeito que saiu daqui, que é mais do que o correio faz.'), x.diz('Fica com isso.')],
      treinador:x => [x.diz('Me avisaram que chegou. Você é rápid{o|a}.'), x.diz('Toma, é seu.')],
      figura:x => [x.diz('Já me contaram. Que alívio.'), x.diz('Separei uma coisa pra você.')]
    },
    prazo:x => [x.diz('Deixa a entrega. Eu resolvi de outro jeito.')],
    passo:(x, p) => !p.pegou ? `${cap1(p.o)} ainda está com ${x.nome} ${emLocal(p.pega)}.`
                             : `${cap1(p.o)} está na mochila. Falta ${p.dest.casa}, ${emLocal(p.leva)}.`,
    pronto:p => !!p.pronto,
    contar:() => 'Contar que entregou'
  },

  avistar:{
    resumo:p => `contar se vir um ${p.esp}`,
    pede:{
      casa:(x, p) => [x.diz(`O vizinho jura que viu um ${p.esp} ${emLocal(p.onde)}. Ninguém acredita.`),
        x.diz('Se você vir um, me conta. Eu quero ver a cara dele quando eu contar.')],
      lider:(x, p) => [x.diz(`Um aluno jura que viu ${p.esp} ${emLocal(p.onde)}, e ninguém aqui acredita nele.`),
        x.diz('Se você vir um, me liga. Eu quero poder dizer pra ele que era verdade.')],
      treinador:(x, p) => [x.diz(`Me falaram que aparece ${p.esp} ${emLocal(p.onde)}. Eu fui duas vezes e nada.`),
        x.diz('Se você topar com um, me liga. Aí eu vou de novo.')],
      figura:(x, p) => [x.diz(`Uma pessoa me disse que viu ${p.esp} ${emLocal(p.onde)}.`),
        x.diz('Se você vir um também, me conta. Eu sou de acreditar nessas coisas.')]
    },
    sim:'"Se eu vir, te ligo."',
    nao:'"Não vou passar por lá tão cedo."',
    aceitou:{
      casa:x => [x.diz('Combinado. E não inventa, que eu conheço essa voz.')],
      lider:x => [x.diz('Combinado. E repara onde foi.')],
      treinador:x => [x.diz('Combinado. Se for mentira, a culpa não é sua.')],
      figura:x => [x.diz('Combinado. Eu fico esperando.')]
    },
    conto:p => `Vi um ${p.esp}.`,
    agradece:{
      casa:(x, p) => [x.diz(`Um ${p.esp} mesmo? Eu vou contar pro vizinho agora.`), x.diz('Ele vai fingir que sabia. Isso é pra você.')],
      lider:x => [x.diz('Então ele não inventou. Vou contar pra ele na frente de todo mundo.'), x.diz('Fica com isso. Informação boa vale.')],
      treinador:(x, p) => [x.diz(`Eu sabia. Eu sabia que tinha ${p.esp} por lá.`), x.diz('Toma. Agora eu vou de novo.')],
      figura:x => [x.diz('Então eu não inventei.'), x.diz('Isso é pra você.')]
    },
    prazo:(x, p) => [x.diz(`Esquece o ${p.esp}. Eu perguntei pra outra pessoa.`)],
    passo:(x, p) => `Nenhum ${p.esp} ainda.`,
    pronto:p => !!(Estado.pdex().vistos || {})[p.dex],
    contar:p => `Contar que viu um ${p.esp}`
  }
};
const NEGOU_O_PEDIDO = x => [x.diz('Tudo bem. Eu dou um jeito.')];
const DESISTIU_DO_PEDIDO = {eu:'Não vou conseguir. Desculpa.', ela:x => [x.diz('Tudo bem. Você avisou, e muita gente nem isso.')]};

/* o Centro que fica com o Pokémon que fugiu */
const NO_CENTRO_COM_O_PERDIDO = p => [
  `A enfermeira reconhece o ${p.esp} antes de você abrir a boca.`,
  fala('a enfermeira', `É o ${p.esp} que estavam procurando. Tinha recado no balcão.`),
  fala('a enfermeira', 'Ele fica aqui com a gente até buscarem. Pode ir tranquil{o|a}.'),
  `O ${p.esp} sobe no balcão e fica quieto do lado da prancheta, como se o lugar fosse dele.`
];
/* a porta da encomenda: quem abre não fala com você, fala da pessoa */
const NA_PORTA_DA_ENCOMENDA = p => [
  `Você acha ${p.dest.casa} na segunda volta pelo quarteirão.`,
  `Quem abre a porta reconhece ${p.o} antes de você falar qualquer coisa.`,
  'Agradece duas vezes, pergunta se você quer entrar e, quando você diz que não pode, pede pra você mandar um abraço.'
];

const Pedidos = {

  /* ---------- o registro ---------- */
  atual(){
    if (typeof Estado === 'undefined' || !Estado.dados || !Estado.dados.pokenav || typeof Recados === 'undefined') return null;
    return Recados.reg().pedido || null;
  },
  pronto(p){ return !!(p && PEDIDOS[p.tipo] && PEDIDOS[p.tipo].pronto(p)); },
  /* com a encomenda na mochila ou o Pokémon atrás de você, o pedido
     não vence nem se larga: falta só chegar */
  travado(p){
    return !!p && !p.pronto && ((p.tipo === 'perdido' && p.achou) || (p.tipo === 'entrega' && p.pegou));
  },
  /* a bolinha da agenda: o pedido dessa pessoa pronto pra contar */
  temPronto(id){ const p = this.atual(); return !!p && p.quem === id && this.pronto(p); },

  /* "de Celadon", "da Ilha Cinnabar", "da Rota 7"; "até a Rota 7" */
  de(id){ return emLocal(id).replace(/^em /, 'de ').replace(/^na /, 'da ').replace(/^no /, 'do ').replace(/^nas /, 'das '); },
  ate(id){ return 'até ' + emLocal(id).replace(/^em /, '').replace(/^na /, 'a ').replace(/^no /, 'o ').replace(/^nas /, 'as '); },
  /* "do zelador da Torre", "de Misty" */
  deQuem(nome){ return /^o /.test(nome) ? 'do ' + nome.slice(2) : /^a /.test(nome) ? 'da ' + nome.slice(2) : 'de ' + nome; },

  /* ---------- quem pode pedir ---------- */
  rotulo(c){ return Recados.rotuloNPC(c) || falaComoDe(c) || textoContato(c, 'nome'); },
  podePedir(c){
    /* quem está do outro lado do mar não pede favor daqui */
    if (!c || c.soAvisa || c.longe || this.atual()) return false;
    if (typeof NPC_DO_CRIME !== 'undefined' && NPC_DO_CRIME.has(this.rotulo(c))) return false;
    if (Recados.afinidade(c) < PEDIDO_MIN_AFINIDADE) return false;
    const u = Recados.doContato(c.id).ultimoPedido;
    return u == null || Estado.dados.relogio.dia - u >= PEDIDO_ESPERA_DIAS;
  },

  /* ---------- onde ---------- */
  /* lugar onde você já pisou e onde dá pra chegar */
  alcancavel(id){
    const L = LOCAIS[id];
    if (!L || L.oculto || !Mundo.visitado(id)) return false;
    return (L.conexoes || []).some(n => !travaDaPassagem(n, id));
  },
  /* distância em passos de mapa a partir de um lugar, só pelo que você
     conhece: a Rota 21 escondida não deixa Cinnabar do lado de Pallet */
  distancias(de){
    const dist = {[de]:0}, fila = [de];
    while (fila.length){
      const a = fila.shift();
      for (const b of ((LOCAIS[a] || {}).conexoes || []))
        if (dist[b] == null && Mundo.conhecido(b)){ dist[b] = dist[a] + 1; fila.push(b); }
    }
    return dist;
  },
  planoPerdido(c){
    const de = Recados.ondeEncontrar(c), dist = this.distancias(de);
    const opcoes = [];
    for (const r of Object.keys(LOCAIS)){
      const L = LOCAIS[r];
      if (L.tipo !== 'rota' || ROTA_SEM_PERDIDO.has(r) || dist[r] == null || dist[r] > 3 || !this.alcancavel(r)) continue;
      const centros = (L.conexoes || []).filter(k => LOCAIS[k] && LOCAIS[k].tipo === 'cidade' && Exploracao.temCentro(LOCAIS[k]) && this.alcancavel(k));
      for (const k of centros) opcoes.push({r, k});
    }
    if (!opcoes.length) return null;
    const {r, k} = Dados.escolher(opcoes);
    const dex = Dados.escolher(PERDIDO_DO_GINASIO[c.id] || PERDIDO_DE_ESTIMACAO);
    return {tipo:'perdido', dex, esp:DEX[dex].nome, onde:r, centro:k,
      lugar:Dados.escolher(ONDE_ESTAVA[LOCAIS[r].ambiente] || ONDE_ESTAVA.outro)};
  },
  planoEntrega(c){
    const pega = Recados.ondeEncontrar(c);
    if (!LOCAIS[pega] || LOCAIS[pega].tipo !== 'cidade' || !this.alcancavel(pega)) return null;
    const dist = this.distancias(pega);
    const cands = Object.keys(LOCAIS).filter(k => k !== pega && LOCAIS[k].tipo === 'cidade' && this.alcancavel(k) && dist[k] >= 1 && dist[k] <= 4);
    if (!cands.length) return null;
    const enc = Dados.escolher(ENCOMENDAS);
    return {tipo:'entrega', pega, leva:Dados.escolher(cands), item:enc.item, o:enc.o, um:enc.um, f:enc.f, dest:Dados.escolher(DESTINATARIOS)};
  },
  planoAvistar(c){
    if (!Estado.dados.flags.tem_pokedex || typeof ENCONTROS === 'undefined') return null;
    const vistos = Estado.pdex().vistos || {}, dist = this.distancias(Recados.ondeEncontrar(c));
    const cands = [];
    for (const [lid, lista] of Object.entries(ENCONTROS)){
      if (dist[lid] == null || !this.alcancavel(lid)) continue;
      for (const [dex, peso] of lista){
        if (!DEX[dex] || dex > 151 || FORA_DO_AVISTAR.has(dex) || vistos[dex] || (peso || 0) < 5) continue;
        cands.push({dex, lid, d:dist[lid]});
      }
    }
    if (!cands.length) return null;
    const perto = Math.min(...cands.map(z => z.d));
    const k = Dados.escolher(cands.filter(z => z.d <= perto + 2));
    return {tipo:'avistar', dex:k.dex, esp:DEX[k.dex].nome, onde:k.lid};
  },
  planejar(tipo, c){
    if (tipo === 'perdido') return this.planoPerdido(c);
    if (tipo === 'entrega') return this.planoEntrega(c);
    if (tipo === 'avistar') return this.planoAvistar(c);
    return null;
  },

  /* ---------- a ligação que pede ----------
     a tela é a da chamada (telaChamada), com id rec_ como a ligação à
     toa: o Chamadas manda o atender e o recusar pro Recados, que manda
     a resposta pra cá (responder). tipo força o jeito (conferência) */
  montar(c, tipo, plano){
    /* o retorno da chamada perdida (recados.js): o mesmo pedido, se ainda
       der pra cumprir; senão outro do mesmo jeito, senão qualquer um */
    let p = plano && this.aindaServe(plano) ? Object.assign({}, plano) : null;
    const tipos = tipo ? [tipo] : plano ? [plano.tipo].concat(TIPOS_DE_PEDIDO.filter(t => t !== plano.tipo))
      : TIPOS_DE_PEDIDO.slice().sort(() => Math.random() - .5);
    for (const t of tipos){ if (p) break; p = this.planejar(t, c); }
    if (!p) return null;
    const x = Recados.contexto(c), k = Recados.tipoDe(x), T = PEDIDOS[p.tipo];
    const ch = {id:'rec_' + c.id + '_' + (++Recados._n), de:c.id, pedido:p, falas:T.pede[k](x, p),
      escolhas:[{texto:T.sim, aceita:true, afeto:0, resultado:T.aceitou[k](x, p)},
                {texto:T.nao, afeto:0, resultado:NEGOU_O_PEDIDO(x)}]};
    Recados.atual = ch;
    return ch;
  },
  aindaServe(p){
    if (!p || !PEDIDOS[p.tipo]) return false;
    if (p.tipo === 'perdido') return this.alcancavel(p.onde) && this.alcancavel(p.centro);
    if (p.tipo === 'entrega') return this.alcancavel(p.pega) && this.alcancavel(p.leva);
    if (p.tipo === 'avistar') return this.alcancavel(p.onde) && !(Estado.pdex().vistos || {})[p.dex];
    return false;
  },
  responder(c, p, esc){
    if (!c || !p) return;
    const d = Estado.dados, nome = Recados.nomeNaNarracao(c);
    if (esc.aceita && !this.atual()){
      Recados.reg().pedido = Object.assign({}, p, {quem:c.id, dia:d.relogio.dia, ate:d.relogio.dia + (PRAZO_DO_PEDIDO[p.tipo] || 10)});
      Estado.registrar(`Aceitou o pedido ${this.deQuem(nome)}: ${PEDIDOS[p.tipo].resumo(p)}.`);
    } else {
      Recados.doContato(c.id).ultimoPedido = d.relogio.dia;
      Estado.registrar(`Não aceitou o pedido ${this.deQuem(nome)}.`);
    }
  },
  fechar(p){
    if (!p) return;
    const r = Recados.reg();
    if (r.pedido === p) r.pedido = null;
    Recados.doContato(p.quem).ultimoPedido = Estado.dados.relogio.dia;
    /* a encomenda que ficou na mochila sem destino sai com o pedido */
    if (p.tipo === 'entrega' && p.pegou && !p.pronto && Estado.contaItem(p.item) > 0) Estado.usarItem(p.item, 1);
  },

  /* ---------- no mapa ---------- */
  passoNoMapa(p){
    if (!p || p.pronto) return null;
    if (p.tipo === 'perdido') return !p.achou ? {id:'procurar', lugar:p.onde} : {id:'centro', lugar:p.centro};
    if (p.tipo === 'entrega') return !p.pegou ? {id:'pegar', lugar:p.pega} : {id:'entregar', lugar:p.leva};
    return null;
  },
  /* pra onde o pedido manda agora (o robô lê daqui) */
  proximoLugar(){
    const p = this.atual();
    if (!p || this.pronto(p)) return null;
    const passo = this.passoNoMapa(p);
    return passo ? passo.lugar : (p.tipo === 'avistar' ? p.onde : null);
  },
  afazeres(localId){
    const p = this.atual(), passo = this.passoNoMapa(p);
    if (!passo || passo.lugar !== localId) return [];
    const c = contatoPorId(p.quem);
    if (!c) return [];
    const nome = Recados.nomeNaNarracao(c);
    const a = {
      procurar:() => ({titulo:`Procurar o ${p.esp} que fugiu`, sub:`Visto por aqui, segundo ${nome}.`}),
      centro:() => ({titulo:`Deixar o ${p.esp} no Centro`, sub:'Tem recado no balcão.'}),
      pegar:() => ({titulo:p.quem === 'casa' ? `Buscar ${p.o} em casa` : `Encontrar ${nome} e pegar ${p.o}`, sub:`Pra levar ${this.ate(p.leva)}.`}),
      entregar:() => ({titulo:`Levar ${p.o} até ${p.dest.casa}`, sub:`A encomenda ${this.deQuem(nome)}.`})
    }[passo.id]();
    return [{id:'pedido_' + passo.id, titulo:a.titulo, sub:a.sub}];
  },
  /* forcar ('critico' | 'sucesso' | 'parcial' | 'falha') é pra conferência */
  fazer(passo, forcar){
    const p = this.atual(), nx = this.passoNoMapa(p);
    if (!p || !nx || nx.id !== passo || nx.lugar !== Mundo.id()) return Exploracao.tela();
    const c = contatoPorId(p.quem);
    if (!c) return Exploracao.tela();
    if (passo === 'procurar') return this.procurar(c, p, forcar);
    if (passo === 'centro') return this.deixarNoCentro(c, p);
    if (passo === 'pegar') return this.pegar(c, p);
    if (passo === 'entregar') return this.entregar(c, p);
    Exploracao.tela();
  },
  /* procurar é vasculhar com um alvo: passa um período, a estrada
     pode te parar, e a Percepção acha; o rastro soma um dado depois */
  procurar(c, p, forcar){
    Mundo.passar(1);
    Exploracao.toque();
    if (!forcar && Exploracao.surge('vasculhar')){ Estado.salvar('auto'); return; }
    const t = forcar ? {grau:forcar}
      : Dados.teste((Estado.j.status.percepcao || 1) + (p.rastro ? 1 : 0), DIFICULDADE_DA_PROCURA, p.rastro ? 'Percepção + rastro' : 'Percepção');
    let linhas;
    if (t.grau === 'critico' || t.grau === 'sucesso'){
      p.achou = true;
      linhas = [`Você procura ${emLocal(p.onde)} com calma, olhando debaixo do que dá pra olhar.`,
        `O ${p.esp} está ${p.lugar || ONDE_ESTAVA.outro[0]}.`,
        'Ele não foge. Fica olhando um tempo, chega perto devagar e depois vem atrás de você, sem olhar pros lados.'];
      Estado.registrar(`Achou o ${p.esp} que tinha fugido, ${emLocal(p.onde)}.`);
    } else if (t.grau === 'parcial'){
      p.rastro = true;
      linhas = ['Você acha um rastro fresco e perde ele adiante, onde o chão endurece. Ele passou por aqui faz pouco.'];
    } else linhas = [`Você procura até o período virar e não acha nem rastro do ${p.esp}.`];
    const av = linhas.map(texto => ({tipo:'info', texto}));
    if (t.faces) av.push({tipo:'info', texto:`Percepção: ${Dados.contaDoTeste(t)}`});
    Estado.salvar('auto');
    Exploracao.tela(av);
  },
  deixarNoCentro(c, p){
    p.pronto = true;
    Estado.registrar(`Deixou o ${p.esp} no Centro ${this.de(p.centro)}.`);
    Estado.salvar('auto');
    UI.telaConversa({num:Mundo.atual().nome, titulo:'Centro Pokémon', loc:'o balcão', falas:NO_CENTRO_COM_O_PERDIDO(p),
      botoes:[{texto:'Seguir.', acao:'Exploracao.tela()'}]});
  },
  pegar(c, p){
    Mundo.passar(1);
    Exploracao.toque();
    p.pegou = true;
    Estado.darItem(p.item, 1);
    const x = Recados.contexto(c), k = Recados.tipoDe(x);
    const falas = [Recados.ondeAcha(x, k),
      x.diz(`É pra ${p.dest.quem}, ${emLocal(p.leva)}. ${cap1(p.dest.pron)} ${p.dest.onde}.`)].concat(FECHO_DA_ENCOMENDA[k](x));
    Estado.registrar(`Pegou ${p.um} com ${x.nome} pra levar ${this.ate(p.leva)}.`);
    Estado.salvar('auto');
    UI.telaConversa({num:Mundo.atual().nome, titulo:x.Nome, loc:'pela cidade', falas,
      avisos:[{tipo:'item', texto:`Recebeu 1× ${p.item}.`}], botoes:[{texto:'Seguir.', acao:'Exploracao.tela()'}]});
  },
  entregar(c, p){
    Mundo.passar(1);
    Exploracao.toque();
    if (Estado.contaItem(p.item) > 0) Estado.usarItem(p.item, 1);
    p.pronto = true;
    Estado.registrar(`Entregou ${p.um} ${emLocal(p.leva)}.`);
    Estado.salvar('auto');
    UI.telaConversa({num:Mundo.atual().nome, titulo:cap1(p.dest.casa), loc:'a encomenda', falas:NA_PORTA_DA_ENCOMENDA(p),
      avisos:[{tipo:'item', texto:`Entregou ${p.item}.`}], botoes:[{texto:'Seguir.', acao:'Exploracao.tela()'}]});
  },

  /* ---------- a ficha do PokéNav ----------
     a linha de contar, apagada com o que falta até estar pronta, e a
     de largar o pedido, enquanto ele ainda pode ser largado */
  linhasDaFicha(c){
    const p = this.atual();
    if (!c || !p || p.quem !== c.id) return [];
    const luta = emLuta(), pronto = this.pronto(p), T = PEDIDOS[p.tipo];
    let motivo = luta ? 'No meio da luta não dá pra ligar.' : T.passo(Recados.contexto(c), p);
    if (!luta && !pronto && !this.travado(p)){
      const falta = p.ate - Estado.dados.relogio.dia;
      motivo += falta >= 1 ? ` Faltam ${falta} dia${falta === 1 ? '' : 's'}.` : ' É o último dia.';
    }
    const linhas = [{acao:'contar', rot:T.contar(p), ok:!luta && pronto, motivo, pronta:pronto}];
    if (!pronto && !this.travado(p))
      linhas.push({acao:'desistir', rot:'Dizer que não vai dar', ok:!luta, motivo:luta ? 'No meio da luta não dá pra ligar.' : ''});
    return linhas;
  },
  /* ligar de volta: contar (o prêmio) ou largar (−1) */
  ligar(id, acao){
    const c = contatoPorId(id), p = this.atual();
    if (!c || !p || p.quem !== id) return;
    if (emLuta()) return UI.modal('PokéNav', '<p class="nada">No meio da luta não dá pra ligar.</p>');
    const d = Estado.dados, x = Recados.contexto(c), k = Recados.tipoDe(x), T = PEDIDOS[p.tipo];
    const nome = Recados.nomeNaNarracao(c);
    if (acao === 'contar'){
      if (!this.pronto(p)) return UI.modal('PokéNav', `<p class="nada">${UI.esc(T.passo(x, p))}</p>`);
      const falas = [fala(d.jogador.nome, T.conto(p))].concat(T.agradece[k](x, p));
      const avisos = this.recompensa(c, p);
      this.fechar(p);
      Estado.registrar(`Cumpriu o pedido ${this.deQuem(nome)}: ${T.resumo(p)}.`);
      Estado.marcarLigacao(c.id, 'pedido');
      Estado.salvar('auto');
      return UI.telaLigacao(c, falas, avisos);
    }
    if (acao === 'desistir' && !this.pronto(p) && !this.travado(p)){
      Recados.mudarAfinidade(c, -1);
      this.fechar(p);
      Estado.registrar(`Largou o pedido ${this.deQuem(nome)}.`);
      Estado.marcarLigacao(c.id, 'pedido');
      Estado.salvar('auto');
      return UI.telaLigacao(c, [fala(d.jogador.nome, DESISTIU_DO_PEDIDO.eu)].concat(DESISTIU_DO_PEDIDO.ela(x)), []);
    }
  },
  /* o que a pessoa dá: a afinidade sobe, o presente sai do degrau novo
     (o líder no degrau das pedras pode dar a dele) e a reputação boa
     sobe, menos com quem fica no meio */
  recompensa(c, p){
    const av = [];
    Recados.mudarAfinidade(c, AFINIDADE_DO_PEDIDO, AFINIDADE_TETO_PEDIDO);
    const t = Recados.degrau(Recados.afinidade(c)) || PRESENTES_POR_AFINIDADE[PRESENTES_POR_AFINIDADE.length - 1];
    let [item, qtd] = sortearPeso(t.itens);
    if (t.min >= 5 && PEDRA_DO_CONTATO[c.id] && Dados.chance(50)){ item = PEDRA_DO_CONTATO[c.id]; qtd = 1; }
    Estado.darItem(item, qtd);
    av.push({tipo:'item', texto:`Recebeu ${qtd}× ${item}.`});
    if (!(typeof NPC_NO_MEIO !== 'undefined' && NPC_NO_MEIO.has(this.rotulo(c)))){
      const motivo = `Fez um favor ${this.deQuem(Recados.nomeNaNarracao(c))}: ${PEDIDOS[p.tipo].resumo(p)}`;
      const m = Estado.mudarRep('bom', REP_DO_PEDIDO, motivo, {rep:{eixo:'bom', delta:REP_DO_PEDIDO, motivo}});
      if (m && m.mudou) av.push({tipo:'rep', texto:`Reputação: ${m.de} → ${m.para}`});
    }
    return av;
  },

  /* ---------- o prazo ----------
     na tela do mapa: o pedido que passou do prazo fecha (−1) e a
     pessoa manda mensagem. Pronto, ou com a encomenda e o Pokémon com
     você, ele espera. Quem a história tirou do mundo fecha calado. */
  conferir(){
    const p = this.atual();
    if (!p) return;
    const c = contatoPorId(p.quem), d = Estado.dados;
    let some = !c;
    if (c && c.requer){ try { if (!c.requer(d)) some = true; } catch(e){ some = true; } }
    if (some){ this.fechar(p); return; }
    if (this.pronto(p) || this.travado(p) || d.relogio.dia <= p.ate) return;
    /* um toque esperando a tela: a mensagem vem na próxima; e de
       madrugada ninguém manda mensagem, ela vem quando amanhecer */
    if (typeof Jogo !== 'undefined' && Jogo.chamadaAdiada) return;
    if (d.relogio.periodo === 'madrugada') return;
    Recados.mudarAfinidade(c, -1);
    this.fechar(p);
    Estado.registrar(`O pedido ${this.deQuem(Recados.nomeNaNarracao(c))} passou do prazo.`);
    Estado.salvar('auto');
    if (Estado.temPokenav() && typeof Jogo !== 'undefined' && Jogo.tocarOuGuardar)
      setTimeout(() => Jogo.tocarOuGuardar({recados:'prazo', de:c.id, pedido:p}), 80);
  },
  mostrarPrazo(c, toque){
    const p = toque && toque.pedido;
    if (!c || !p || !PEDIDOS[p.tipo]) return false;
    UI.telaMensagem(c, PEDIDOS[p.tipo].prazo(Recados.contexto(c), p));
    return true;
  },

  /* tudo que se fala aqui, pra conferência (chk-baloes) */
  amostras(c){
    const x = Recados.contexto(c), k = Recados.tipoDe(x), eu = Estado.dados.jogador.nome;
    const dono = c.id === 'casa' ? null : (falaComoDe(c) || textoContato(c, 'nome'));
    const planos = {
      perdido:{tipo:'perdido', dex:58, esp:'Growlithe', onde:'rota7', centro:'celadon', lugar:ONDE_ESTAVA.campo[0]},
      entrega:Object.assign({tipo:'entrega', pega:'cerulean', leva:'celadon', dest:DESTINATARIOS[0]}, ENCOMENDAS[0]),
      avistar:{tipo:'avistar', dex:77, esp:'Ponyta', onde:'rota16'}
    };
    const out = [];
    for (const [t, p] of Object.entries(planos)){
      const T = PEDIDOS[t];
      out.push({onde:`pedido/${c.id}/${t}`, dono, linhas:T.pede[k](x, p)});
      out.push({onde:`pedido/${c.id}/${t}>sim`, dono, linhas:T.aceitou[k](x, p)});
      out.push({onde:`pedido/${c.id}/${t}>contou`, dono, linhas:[fala(eu, T.conto(p))].concat(T.agradece[k](x, p))});
      out.push({onde:`pedido/${c.id}/${t}>prazo`, dono, linhas:T.prazo(x, p)});
    }
    const e = planos.entrega;
    out.push({onde:`pedido/${c.id}>nao`, dono, linhas:NEGOU_O_PEDIDO(x)});
    out.push({onde:`pedido/${c.id}>largou`, dono, linhas:[fala(eu, DESISTIU_DO_PEDIDO.eu)].concat(DESISTIU_DO_PEDIDO.ela(x))});
    out.push({onde:`pedido/${c.id}>pegar`, dono, linhas:[x.diz(`É pra ${e.dest.quem}, ${emLocal(e.leva)}. ${cap1(e.dest.pron)} ${e.dest.onde}.`)].concat(FECHO_DA_ENCOMENDA[k](x))});
    out.push({onde:`pedido/centro`, dono:null, linhas:NO_CENTRO_COM_O_PERDIDO(planos.perdido)});
    out.push({onde:`pedido/porta`, dono:null, linhas:NA_PORTA_DA_ENCOMENDA(e)});
    return out;
  }
};
