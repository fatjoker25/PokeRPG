/* ============================================================
   PERGUNTAR O NOME

   O jogo chama quase todo mundo pela função: "a enfermeira",
   "o guarda da primeira", "a dona do armazém". Isso está certo —
   é assim que a gente enxerga desconhecido.

   O que estava faltando era o jogador poder desfazer isso. Agora
   dá pra perguntar o nome de quem quer que esteja falando com
   você, em qualquer cena, e a partir daí o balão passa a usar o
   nome — nessa cena e em todas as outras.

   Quem tem nome escrito na história (Kenta, Reika Ando, Sr. Fuji)
   não entra aqui: já tem nome. Quem é papel e não pessoa (a folha,
   a página do caderno) também não.

   E tem gente que não diz. Essa parte é escrita à mão, porque
   recusar é caracterização e não pode ser sorteada.
   ============================================================ */

/* rótulos que são documento falando, não gente */
const NAO_E_GENTE = /^(a|o)\s+(folha|p[áa]gina|placa|carta[zZ]?|aviso|bilhete|manchete|ata|ficha|linha do caderno|uma linha)/i;

/* quem não diz o nome, e por quê. A recusa é o personagem. */
const RECUSAM_O_NOME = {
  'o fumante': () => [
    'Ele leva a mão até o crachá e para no meio do caminho.',
    fala('o fumante', 'O sigilo é sobre espécimes, procedimentos, instalações e pessoas.'),
    fala('o fumante', 'Eu sou uma pessoa. Pessoa tá na cláusula.', 'baixo')
  ],
  'a mulher da pasta': () => [
    'Ela olha o relógio de pulso antes de responder, e o relógio dela não atrasa.',
    fala('a mulher da pasta', 'Meu nome está na procuração, que é pública.'),
    fala('a mulher da pasta', 'Se o senhor quiser, protocola um pedido de vista.', 'frio')
  ],
  'a mulher da pasta de couro': () => [
    'Ela ajeita a pasta debaixo do braço.',
    fala('a mulher da pasta de couro', 'Eu não vim aqui como pessoa.'),
    fala('a mulher da pasta de couro', 'Vim como parte.', 'frio')
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
  'o perseguidor': () => [
    'Ele continua andando no mesmo passo, a quinze metros, sem virar a cabeça.'
  ]
};

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

const NOMES_F = ['Aya','Emi','Hana','Harumi','Kaori','Keiko','Mari','Michiko','Naoko','Rei',
                 'Sachiko','Shizu','Tomoe','Yoko','Yumi','Kiyo','Fumi','Ritsu','Sae','Nao'];
const NOMES_M = ['Akira','Daisuke','Eiji','Hiroshi','Jun','Kazuo','Makoto','Noboru','Ryo','Satoshi',
                 'Shin','Takeshi','Wataru','Yuji','Hideki','Masa','Tooru','Kenzo','Rei','Sho'];
const SOBRENOMES = ['Aoki','Ebina','Fukui','Hayashi','Ikeda','Kawase','Maruyama','Nomura','Ogawa','Saito',
                    'Takada','Uchida','Wada','Yamashita','Shimizu','Morita','Hirano','Kondo','Ando','Sato',
                    'Ishii','Noda','Kimura','Oda','Tamura','Fujita','Mori','Hara','Kubota','Sugimoto'];

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

function nomeSorteado(rotulo){
  const s = _semente(rotulo);
  const f = ehFeminino(rotulo);
  if (_formal(rotulo)) return (f ? 'Sra. ' : 'Sr. ') + SOBRENOMES[s % SOBRENOMES.length];
  /* guarda e oficial se apresentam pelo sobrenome */
  if (/guarda|oficial|policial|seguran|fiscal|vigia/i.test(rotulo)) return SOBRENOMES[s % SOBRENOMES.length];
  const pool = f ? NOMES_F : NOMES_M;
  return pool[s % pool.length];
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
    const nome = nomeSorteado(r);
    this.sabidos()[r] = nome;
    const f = ehFeminino(r);
    const jeito = JEITOS.find(j => j.quando.test(r)) || JEITOS[JEITOS.length - 1];
    const linhas = (f ? jeito.linhas : jeito.linhasM)(r, nome);
    if (typeof Estado.lembrarNPC === 'function')
      Estado.lembrarNPC(nome, {nome, conhece:true, viuVoce:'Você perguntou o nome dela ou dele, e ela ou ele disse.'});
    return {nome, linhas};
  },

  /* como o balão deve chamar essa pessoa agora */
  comoChamar(rotulo){ return this.nomeDe(rotulo) || rotulo; }
};

/* o jogador escreveu alguma coisa que é "qual é o seu nome?" */
const _PERGUNTA_NOME = /\b(qual|como)\b.{0,18}\b(seu|teu|o seu|o teu)?\s*nome\b|\bcomo\b.{0,12}\b(voc[êe]|tu)\b.{0,12}\bchama\b|\bqual\b.{0,10}\bgraça\b|\bme diz o (seu|teu) nome\b|\bseu nome\?/i;
function perguntaDeNome(texto){ return _PERGUNTA_NOME.test(String(texto || '')); }
