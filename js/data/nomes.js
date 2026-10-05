/* ============================================================
   PERGUNTAR O NOME

   O jogo chama quase todo mundo pela função: "a enfermeira",
   "o guarda da primeira", "a dona do armazém". Isso está certo —
   é assim que a gente enxerga desconhecido.

   O que estava faltando era o jogador poder desfazer isso. Agora
   dá pra perguntar o nome de quem quer que esteja falando com
   você, em qualquer cena, e a partir daí o balão passa a usar o
   nome — nessa cena e em todas as outras.

   Quem tem nome escrito na história (Ezra, Rhea Ashford, Sr. Fuji)
   não entra aqui: já tem nome. Quem é papel e não pessoa (a folha,
   a página do caderno) também não.

   E tem gente que não diz. Essa parte é escrita à mão, porque
   recusar é caracterização e não pode ser sorteada.
   ============================================================ */

/* rótulos que são documento falando, não gente */
const NAO_E_GENTE = /^(a|o)\s+(folha|p[áa]gina|placa|carta[zZ]?|aviso|bilhete|manchete|ata|ficha|linha do caderno|uma linha)/i;

/* quem não diz o nome, e por quê. A recusa é o personagem. */
const RECUSAM_O_NOME = {
  'a voz da lavanderia': () => [
    'Ela vira o crachá mais um pouco pro lado do peito, como quem fecha uma porta.',
    fala('a voz da lavanderia', 'O meu nome está trinta vezes nesse envelope, de caneta azul.', 'baixo'),
    fala('a voz da lavanderia', 'Uma vez a mais e ele vira de todo mundo. Deixa ele ser só meu mais um pouco.', 'baixo')
  ],
  'o fumante': () => [
    'Ele leva a mão até o crachá e para no meio do caminho.',
    fala('o fumante', 'O sigilo é sobre espécimes, procedimentos, instalações e pessoas.'),
    fala('o fumante', 'Eu sou uma pessoa. Pessoa tá na cláusula.', 'baixo')
  ],
  'a mulher da pasta': () => [
    'Ela olha o relógio de pulso antes de responder, e o relógio dela não atrasa.',
    fala('a mulher da pasta', 'Meu nome está na procuração, que é pública.'),
    fala('a mulher da pasta', 'Se {o senhor|a senhora} quiser, protocola um pedido de vista.', 'frio')
  ],
  'a mulher da pasta de vinil': () => [
    'Ela ajeita a pasta debaixo do braço.',
    fala('a mulher da pasta de vinil', 'Eu não vim aqui como pessoa.'),
    fala('a mulher da pasta de vinil', 'Vim como parte.', 'frio')
  ],
  'a mulher de crachá azul': () => [
    'Ela vira o crachá com dois dedos, e o crachá tem foto, número e nenhum nome.',
    fala('a mulher de crachá azul', 'A empresa emite por matrícula.'),
    fala('a mulher de crachá azul', 'É pra isso mesmo.', 'baixo')
  ],
  'o homem sem crachá': () => [
    'Ele sorri com a boca.',
    fala('o homem sem crachá', 'Eu sou o que não está na folha.')
  ],
  'a pessoa da sombra': () => [
    'Ela não responde e não se mexe, e o silêncio dura tempo demais pra ser hesitação.',
    'É recusa, e é treinada.'
  ],
  'a voz do outro lado': () => [
    'Do outro lado, um silêncio curto, de quem cobre o bocal com a mão.',
    fala('a voz do outro lado', 'Nome é o que vocês têm. A gente tem número.', 'frio')
  ],
  'o intermediário': () => [
    'Ele tira o chapéu, coça a cabeça e põe o chapéu de volta.',
    fala('o intermediário', 'Nome atrapalha negócio. Me chama de quem paga.')
  ],
  'o perseguidor': () => [
    'Ele continua andando no mesmo passo, a quinze metros, sem virar a cabeça.'
  ]
};

/* Quem carrega cena e se arrisca tem nome escrito à mão, não sorteado.
   A cena em que a pessoa entra apresenta o nome (Nomes.apresentar), e
   perguntar antes disso dá o mesmo nome — nunca um sorteado que a cena
   depois desmentiria. */
const NOMES_FIXOS = {
  'o capitão do porto':        'Capitão Marlow',
  'a funcionária da guarita':  'Sra. Myrtle',
  'o rapaz do protocolo':      'Tito',
  'o guarda da primeira':      'Pike',
  'o entregador de pão':       'Rufo',
  'a recepcionista da Liga':   'Lena',
  'a balconista da farmácia':  'Gina',
  'Chefe da expedição':        'Dra. Sallow',
  'a voz do rádio':            'Roland',
  'a escrevente':              'Sra. Cybil',
  'o homem de barba':          'Curador Fabre',
  'a mulher de tailleur':      'Hester Colman',
  'a mulher de trinta':        'Tessa Rue',
  'a mulher almoçando':       'Thea Larkin',
  'o rapaz da enfermaria':     'Janus',
  'o colega da enfermaria':    'Pascal',
  'a técnica de jaleco':       'Kira',
  'a Presidente':              'Hester Colman',
  'a recepcionista do Planalto': 'Sra. Ada',
  /* as linhas (js/story/linhas.js): quem acompanha você no seu lado */
  'o sargento de Viridian':    'Sargento Holt',
  'a editora do Jornal':       'Hazel Moss',
  'a avaliadora da Associação': 'Sra. Linden',
  'a coordenadora da quadra':  'Coordenadora Maple',
  'a dona da pensão':          'Dona Briar',
  /* os caminhos (js/story/caminhos/) */
  'o delegado de Fuchsia':     'Delegado Crane',
  'a delegada de Saffron':     'Delegada Thorne',
  'a delegada':                'Delegada Thorne',
  'o advogado da Comissão':    'Dr. Bramble',
  'o contato da Terceira':     'Rook',
  'a pesquisadora de bota':    'Dra. Quill',
  'o fotógrafo do Jornal':     'Bastian Fern',
  'a tratadora da Associação': 'Mina Bray'
};

/* Cargo que fica cargo de propósito, mesmo passando de doze falas: é a
   função que aparece em cidade atrás de cidade, não uma pessoa só
   ("Cargo fica como cargo", no CLAUDE.md). O jogador ainda pode perguntar. */
const CARGO_DE_PROPOSITO = ['a enfermeira', 'o barqueiro', 'a atendente'];

/* como a pessoa responde, pelo que ela faz da vida. O primeiro que
   casar manda. */
const JEITOS = [
  {quando:/enfermeir|atendente|recepcionist|balconist|secret[áa]ri|escriv|funcion[áa]ri|moça d|rapaz do protocolo|atendente da junta/i,
   linhas:(r,n)=>['Ela aponta o crachá, que estava ali o tempo todo e que você não tinha lido.',
                  fala(r, `${n}. Tá escrito aqui, ó.`)],
   linhasM:(r,n)=>['Ele aponta o crachá, que estava ali o tempo todo e que você não tinha lido.',
                   fala(r, `${n}. Tá escrito aqui, ó.`)]},

  {quando:/guarda|oficial|policial|seguran|guarita|vigia|fiscal/i,
   linhas:(r,n)=>[fala(r, `${n}.`), 'Ela dá o sobrenome e só o sobrenome, do jeito que se responde isso de uniforme.'],
   linhasM:(r,n)=>[fala(r, `${n}.`), 'Ele dá o sobrenome e só o sobrenome, do jeito que se responde isso de uniforme.']},

  {quando:/menin|criança|garot|aluna|aluno|rapaz de|moleque/i,
   linhas:(r,n)=>[fala(r, `${n}.`), fala(r, 'E o seu?'),
                  'Você diz. Ela repete o seu nome uma vez, baixinho, pra guardar.'],
   linhasM:(r,n)=>[fala(r, `${n}.`), fala(r, 'E o seu?'),
                   'Você diz. Ele repete o seu nome uma vez, baixinho, pra guardar.']},

  {quando:/senhora|senhor|velh|dona d|dono d/i,
   linhas:(r,n)=>[fala(r, `${n}.`),
                  'Ela fala o nome e depois fala de novo, mais devagar, porque acha que você não vai lembrar.',
                  'Você vai lembrar.'],
   linhasM:(r,n)=>[fala(r, `${n}.`),
                   'Ele fala o nome e depois fala de novo, mais devagar, porque acha que você não vai lembrar.',
                   'Você vai lembrar.']},

  {quando:/motorista|caminhon|barque|pescador|estivador|carregador|mec[âa]nico|ferrament|oper[áa]ri|peão|entregador|frentista|conferente|marcene/i,
   linhas:(r,n)=>['Ela limpa a mão na calça antes de responder, que é um gesto que ninguém decide fazer.',
                  fala(r, `${n}.`)],
   linhasM:(r,n)=>['Ele limpa a mão na calça antes de responder, que é um gesto que ninguém decide fazer.',
                   fala(r, `${n}.`)]},

  {quando:/rep[óo]rter|jornalista|editor/i,
   linhas:(r,n)=>[fala(r, `${n}.`), fala(r, 'Com esse "y" no fim, que todo mundo erra.')],
   linhasM:(r,n)=>[fala(r, `${n}.`), fala(r, 'Escreve certo, se for escrever.')]},

  {quando:/./,
   linhas:(r,n)=>[fala(r, `${n}.`),
                  'E é só isso: você perguntou e ela disse, e levou dois segundos, e podia ter sido no começo da conversa.'],
   linhasM:(r,n)=>[fala(r, `${n}.`),
                   'E é só isso: você perguntou e ele disse, e levou dois segundos, e podia ter sido no começo da conversa.']}
];

/* Registro das localizações dos jogos: Samuel Oak, Giovanni, Célio,
   Bill, Lorelei, Lance. Nem japonês, nem brasileiro — internacional,
   curto, fácil de ler em voz alta. Nada que colida com nome canônico
   de Kanto. */
const NOMES_F = ['Alba','Bianca','Carla','Cleo','Dalia','Elda','Elsa','Flora','Gina','Hilda',
                 'Lara','Lena','Lina','Mara','Nina','Nora','Petra','Sara','Tessa','Vera'];
const NOMES_M = ['Aldo','Bram','Dario','Dino','Elio','Enzo','Hugo','Ivo','Leo','Marco',
                 'Milo','Nico','Nilo','Otto','Rico','Rufo','Silas','Tito','Varo','Vito'];
/* Sobrenome no espírito dos professores de Pokémon, que são todos
   árvore ou planta: Oak, Elm, Birch, Rowan, Juniper. Serve pro
   "Sr." e pro "Sra." e pra quem se apresenta só pelo sobrenome. */
const SOBRENOMES = ['Alder','Ash','Aspen','Birch','Bram','Cedar','Elm','Hazel','Holly','Holt',
                    'Laurel','Linden','Lorca','Maple','Myrtle','Olive','Reed','Rowan','Sage','Thorn',
                    'Vale','Wren','Cross','Hart','Marlow','Tanner','Vance','Stone','Pike','Quill'];

/* o mesmo rótulo sempre dá o mesmo nome dentro de uma jornada, e
   jornadas diferentes dão nomes diferentes */
function _semente(rotulo){
  const base = String(rotulo) + '|' + ((Estado.dados && Estado.dados.jogador && Estado.dados.jogador.nome) || '');
  let h = 2166136261;
  for (let i = 0; i < base.length; i++){ h ^= base.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}

function ehFeminino(rotulo){ return /^(a|as|uma)\s/i.test(String(rotulo).trim()); }

/* Tratamento formal pra quem o texto já trata por senhor/senhora */
function _formal(rotulo){ return /senhora|senhor|velh|dona d|dono d|capit[ãa]o|doutor/i.test(rotulo); }

/* Nome que a história já usa, e que o sorteio não pode repetir: duas
   pessoas com o mesmo nome na mesma jornada confunde, e roubar o nome
   de um personagem escrito é pior ainda. */
const NOMES_DA_HISTORIA = new Set([
  'Amos','Aldous','Lena','Maude','Brandt','Tolliver','Aske','Ingram','Ebbs','Orme','Fenn','Emory','Poplar','Nell','Rufo','Quint','Mervin','Edda','Waldo','Maren','Maeve','Corwin','Ashford','Dunmore','Ivy','Merrick','Ned','Pell','Brill','Cleo','Colman','Harold','Hester','Célio','Cordell','Dane','Dario','Elsa','Enzo','Ezra',
  'Fabre','Gus','Hazel','Holt','Ives','Ivo','Laurel','Leo','Lina','Lorca','Milo','Nadia',
  'Nico','Nilo','Nina','Orso','Otto','Perla','Rhea','Rico','Vale','Wren','Alder','Bram',
  'Arden','Hart','Tanner','Tobin','Kieran','Ashby','Burke','Holloway','Ansel',
  /* o resto do elenco escrito, que só aparece em npc:{} e narração */
  'Ada','Arlo','Beatrix','Berto','Cosmo','Cybil','Dahl','Delmar','Dorian','Edda','Edric',
  'Elias','Falk','Fenna','Fenwick','Gale','Greta','Hedda','Hedda','Hollis','Isolde','Janus',
  'Juna','Kell','Kestrel','Kira','Larkin','Lior','Livia','Maren','Mervin','Nettle','Nolan',
  'Odile','Orin','Pascal','Pia','Poplar','Quince','Quint','Ridge','Rina','Roland','Roque',
  'Sibyl','Sorrel','Stellan','Thea','Thistle','Tobias','Ulla','Ulric','Varian','Vernon',
  'Vesna','Waldo','Wilma','Xavi','Yarrow','Ylva','Yves','Zane','Zelda','Hawthorn',
  /* os nomes fixos daqui de cima */
  'Marlow','Myrtle','Tito','Pike','Rufo','Lena','Gina',
  'Tessa','Rue',
  /* canônicos de Kanto */
  'Brock','Misty','Surge','Erika','Koga','Sabrina','Blaine','Blue','Red','Lance','Giovanni',
  'Fuji','Agatha','Bruno','Lorelei','Bill','Daisy','Oak','Célio','Kurt','Mandi','Giselle'
]);

/* anda na lista a partir do ponto sorteado até achar um nome que a
   jornada ainda não usou */
function _livre(pool, inicio, tomados){
  for (let i = 0; i < pool.length; i++){
    const c = pool[(inicio + i) % pool.length];
    if (!NOMES_DA_HISTORIA.has(c) && !tomados.has(c)) return c;
  }
  return pool[inicio % pool.length];
}

function nomeSorteado(rotulo){
  const s = _semente(rotulo);
  const f = ehFeminino(rotulo);
  /* o que já foi dado nesta jornada, pelo nome nu (sem Sr./Sra.) */
  const tomados = new Set(Object.values((typeof Nomes !== 'undefined' && Nomes.sabidos) ? Nomes.sabidos() : {})
                            .map(n => String(n).replace(/^Sr[ao]?\.\s*/, '')));
  /* e o nome do próprio jogador, que seria a repetição mais estranha */
  const eu = (Estado.dados && Estado.dados.jogador && Estado.dados.jogador.nome) || '';
  if (eu) tomados.add(String(eu).trim().split(/\s+/)[0]);
  const casa = (typeof nomeCasa === 'function') ? nomeCasa() : '';
  if (casa) tomados.add(casa);
  if (_formal(rotulo)) return (f ? 'Sra. ' : 'Sr. ') + _livre(SOBRENOMES, s, tomados);
  /* guarda e oficial se apresentam pelo sobrenome */
  if (/guarda|oficial|policial|seguran|fiscal|vigia/i.test(rotulo)) return _livre(SOBRENOMES, s, tomados);
  return _livre(f ? NOMES_F : NOMES_M, s, tomados);
}

const Nomes = {
  /* o que o jogo já sabe */
  sabidos(){
    if (typeof Estado === 'undefined' || !Estado.dados) return {};
    return Estado.dados.nomesSabidos || (Estado.dados.nomesSabidos = {});
  },
  sabe(rotulo){ return !!this.sabidos()[rotulo]; },
  nomeDe(rotulo){ return this.sabidos()[rotulo] || null; },

  /* dá pra perguntar? */
  ehGente(rotulo){
    const r = String(rotulo || '').trim();
    if (!r) return false;
    if (NAO_E_GENTE.test(r)) return false;
    return true;
  },
  ehAnonimo(rotulo){
    const r = String(rotulo || '').trim();
    /* rótulo que começa com artigo minúsculo é função, não nome */
    return /^(a|o|as|os|um|uma)\s/.test(r);
  },
  podePerguntar(rotulo){
    return this.ehGente(rotulo) && this.ehAnonimo(rotulo) && !this.sabe(rotulo)
        && !this.jaRecusou(rotulo);
  },
  jaRecusou(rotulo){
    const d = (typeof Estado !== 'undefined' && Estado.dados) || null;
    return !!(d && d.nomesRecusados && d.nomesRecusados[rotulo]);
  },

  /* pergunta de verdade: devolve as linhas da resposta */
  perguntar(rotulo){
    const r = String(rotulo);
    if (RECUSAM_O_NOME[r]){
      const d = Estado.dados;
      (d.nomesRecusados = d.nomesRecusados || {})[r] = true;
      return {nome:null, linhas: RECUSAM_O_NOME[r]()};
    }
    const nome = NOMES_FIXOS[r] || nomeSorteado(r);
    this.sabidos()[r] = nome;
    const f = ehFeminino(r);
    const jeito = JEITOS.find(j => j.quando.test(r)) || JEITOS[JEITOS.length - 1];
    const linhas = (f ? jeito.linhas : jeito.linhasM)(r, nome);
    /* Registra pelo RÓTULO de propósito: lembrarNPC já sabe que o rótulo
       virou nome e funde as duas entradas. Se registrasse direto pelo nome
       novo, uma cena que já tivesse guardado essa pessoa pelo rótulo
       ficaria como uma segunda pessoa, com opinião separada. */
    if (typeof Estado.lembrarNPC === 'function')
      Estado.lembrarNPC(r, {conhece:true, viuVoce:'Você perguntou o nome e ouviu a resposta.'});
    return {nome, linhas};
  },

  /* A cena apresenta a pessoa: dali em diante o balão usa o nome, aqui
     e em qualquer cena depois. Chamado de dentro de uma linha de texto,
     então tem que poder rodar de novo sem efeito. */
  apresentar(rotulo){
    const nome = NOMES_FIXOS[rotulo];
    if (!nome || this.sabe(rotulo)) return nome || null;
    this.sabidos()[rotulo] = nome;
    if (typeof Estado.lembrarNPC === 'function') Estado.lembrarNPC(rotulo, {conhece:true});
    return nome;
  },

  /* como o balão deve chamar essa pessoa agora */
  comoChamar(rotulo){ return this.nomeDe(rotulo) || rotulo; }
};

/* o jogador escreveu alguma coisa que é "qual é o seu nome?" */
const _PERGUNTA_NOME = /\b(qual|como)\b.{0,18}\b(seu|teu|o seu|o teu)?\s*nome\b|\bcomo\b.{0,12}\b(voc[êe]|tu)(?![a-zà-ú]).{0,12}\bchama\b|\bqual\b.{0,10}\bgraça\b|\bme diz o (seu|teu) nome\b|\bseu nome\?/i;
function perguntaDeNome(texto){ return _PERGUNTA_NOME.test(String(texto || '')); }
