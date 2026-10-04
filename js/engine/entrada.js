/* ============================================================
   AÇÃO LIVRE
   O jogador escreve o que faz. O jogo lê, entende a intenção e
   encaixa na trilha mais próxima — ou improvisa por conta.
   ============================================================ */

const VAZIAS = new Set(['a','o','as','os','um','uma','de','da','do','das','dos','em','no','na','nos','nas',
  'e','ou','que','se','com','sem','por','para','pra','pro','ao','aos','à','às','meu','minha','seu','sua',
  'eu','ele','ela','isso','isto','aquilo','lhe','me','te','the','vou','vai','ir','ficar','fica','estar',
  'tá','ta','é','são','ser','tem','ter','mais','muito','bem','só','já','então','aí','lá','aqui','não','sim']);

/* Intenções — cada uma com o vocabulário que a denuncia */
const INTENCOES = {
  violencia:{
    peso:1.0,
    palavras:['atacar','ataco','bater','bato','brigar','brigo','lutar','luto','enfrentar','enfrento','matar',
      'mato','destruir','destruo','quebrar','quebro','derrubar','socar','soco','chutar','chuto','agredir',
      'arrebentar','partir','acabar','queimar','queimo','incendiar','explodir','forçar','arrombar','invadir']
  },
  captura:{
    peso:1.0,
    palavras:['capturar','capturo','pegar','pego','bola','ball','poké','pokebola','prender','prendo',
      'jogar a Pokébola','arremessar','tentar pegar']
  },
  fuga:{
    peso:1.0,
    palavras:['fugir','fujo','correr','corro','escapar','escapo','sair','saio','vazar','recuar','recuo',
      'voltar','volto','abandonar','desistir','desisto','ir embora','me mandar','dar no pé','evitar']
  },
  dialogo:{
    peso:1.0,
    palavras:['falar','falo','conversar','converso','perguntar','pergunto','dizer','digo','responder',
      'respondo','explicar','explico','contar','conto','negociar','negocio','propor','proponho','pedir',
      'peço','convencer','persuadir','discutir','argumentar','chamar','gritar','avisar','aviso','saudar']
  },
  ajuda:{
    peso:1.1,
    palavras:['ajudar','ajudo','salvar','salvo','socorrer','curar','curo','cuidar','proteger','protejo',
      'defender','defendo','soltar','solto','libertar','liberto','resgatar','resgato','carregar','carrego',
      'acolher','alimentar','dar','doar','devolver','devolvo','consolar','ficar com','acompanhar']
  },
  furto:{
    peso:1.0,
    palavras:['roubar','roubo','pegar escondido','furtar','surrupiar','levar','levo','saquear','vender',
      'vendo','chantagear','extorquir','cobrar','enganar','mentir','minto','blefar','blefe','trapacear',
      'subornar','comprar']
  },
  observacao:{
    peso:0.9,
    palavras:['olhar','olho','observar','observo','esperar','espero','analisar','analiso','estudar','ver',
      'vejo','examinar','examino','investigar','investigo','procurar','procuro','vasculhar','revistar',
      'checar','conferir','escutar','ouvir','ouço','cheirar','seguir','sigo','rastrear','fotografar',
      'anotar','ler','leio','documentar','registrar','memorizar']
  },
  furtividade:{
    peso:0.9,
    palavras:['esconder','escondo','disfarçar','fingir','finjo','espiar','espreitar','sorrateiro','silêncio',
      'quieto','devagar','sem barulho','de fininho','despistar']
  },
  passividade:{
    peso:0.8,
    palavras:['nada','parado','paro','quieto','ignorar','ignoro','deixar','deixo','seguir em frente',
      'passar reto','não fazer','continuar','esperar quieto']
  },
  item:{
    peso:0.9,
    palavras:['usar','uso','item','poção','potion','remédio','antídoto','revive','comida','ração','mochila',
      'aplicar','beber','comer']
  }
};

function normalizar(txt){
  return String(txt||'').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^\w\s]/g,' ')
    .split(/\s+/).filter(p => p && !VAZIAS.has(p));
}

/* sem acento, para casar com o texto normalizado */
const INTENCOES_NORM = {};
for (const [k,v] of Object.entries(INTENCOES)){
  INTENCOES_NORM[k] = {peso:v.peso, palavras:v.palavras.map(p =>
    p.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase())};
}

/* radical: portugues conjuga demais para casar palavra inteira */
function radical(p){
  if (p.length <= 4) return p;
  return p.slice(0, Math.min(5, Math.max(4, p.length - 3)));
}

function intencoesDe(texto){
  const bruto = normalizar(texto).join(' ');
  const radicais = normalizar(texto).map(radical);
  const marcadas = {};
  for (const [nome, def] of Object.entries(INTENCOES_NORM)){
    let n = 0;
    for (const palavra of def.palavras){
      if (palavra.includes(' ')){ if (bruto.includes(palavra.replace(/\s+/g,' '))) n += 2; continue; }
      const r = radical(palavra);
      if (radicais.some(x => x === r || x.startsWith(r) || r.startsWith(x))) n++;
    }
    if (n) marcadas[nome] = Math.min(4, n) * def.peso;
  }
  return marcadas;
}


/* Quanto o texto do jogador se parece com o texto de uma escolha */
function semelhanca(txtJogador, txtEscolha){
  const a = new Set(normalizar(txtJogador));
  const b = normalizar(txtEscolha);
  if (!a.size || !b.length) return 0;
  let comuns = 0;
  const vistos = new Set();
  for (const p of b){
    if (vistos.has(p)) continue;
    vistos.add(p);
    if (a.has(p)) comuns += 1;
    else { const rp = radical(p); for (const q of a){ const rq = radical(q); if (rp === rq || rp.startsWith(rq) || rq.startsWith(rp)){ comuns += 0.7; break; } } }
  }
  return comuns / Math.max(3, vistos.size);
}

function afinidadeIntencao(intA, intB){
  let s = 0;
  for (const k of Object.keys(intA)) if (intB[k]) s += Math.min(intA[k], intB[k]);
  return s;
}

/* ============================================================
   INTERPRETAR: casa o que o jogador escreveu com as trilhas
   ============================================================ */
const Entrada = {
  interpretar(texto, escolhas){
    const t = String(texto||'').trim();
    if (!t) return null;
    const intJog = intencoesDe(t);

    let melhor = null, melhorNota = 0;
    escolhas.forEach((e, i) => {
      const rotulo = typeof e.texto === 'function' ? txt(e.texto) : e.texto;
      const alvo = rotulo + ' ' + (e.palavras || []).join(' ');
      const nota = semelhanca(t, alvo) * 2.2
                 + afinidadeIntencao(intJog, intencoesDe(alvo)) * 0.85;
      if (nota > melhorNota){ melhorNota = nota; melhor = {indice:i, escolha:e, nota, rotulo}; }
    });

    // encaixou numa trilha existente
    if (melhor && melhorNota >= 1.05) return {tipo:'trilha', ...melhor, intencoes:intJog};

    // não encaixou: o jogo improvisa a partir da intenção
    const dominante = Object.keys(intJog).sort((a,b)=>intJog[b]-intJog[a])[0] || null;
    return {tipo:'livre', intencao:dominante, intencoes:intJog, texto:t,
            sugestao: melhor, nota: melhorNota};
  },

  /* O que acontece quando o jogador faz algo que a cena não previu */
  improviso(intencao, cena){
    const L = Mundo.atual ? Mundo.atual() : null;
    const base = {
      violencia:{
        texto:['Você parte pra cima antes de pensar direito.',
               'Não tem nada aqui que resolva desse jeito — e o que tem, resolve pior.',
               'Sobra a sensação de ter gasto uma coisa que você não tinha de sobra.'],
        rep:{eixo:'ruim', delta:1, motivo:'Partiu para cima sem necessidade'}},
      fuga:{
        texto:['Você recua uns passos e o mundo não recua junto.',
               'A cena continua exatamente onde estava, esperando.'],
        rep:null},
      dialogo:{
        texto:['Você fala. Não é a coisa certa e não é a coisa errada — é só falar.',
               'Alguma coisa muda de lugar na conversa, um centímetro.'],
        rep:null},
      ajuda:{
        texto:['O gesto não cabe aqui, mas você faz assim mesmo.',
               'Quem está por perto repara. Gente repara nesse tipo de coisa mais do que em qualquer outra.'],
        rep:{eixo:'bom', delta:1, motivo:'Um gesto que ninguém pediu'}},
      observacao:{
        texto:['Você para e presta atenção de verdade, que é uma coisa que quase ninguém faz.',
               'Não aparece nenhuma revelação. Aparece detalhe, que é melhor e mais lento.'],
        rep:null},
      furtividade:{
        texto:['Você se mexe devagar, encostad{o|a}, sem fazer barulho.',
               'Funciona. Por enquanto funciona.'],
        rep:null},
      furto:{
        texto:['Sua mão chega antes da sua decisão.',
               'Você fica com isso — com a coisa e com o resto.'],
        rep:{eixo:'ruim', delta:1, motivo:'Pegou o que não era seu'}},
      passividade:{
        texto:['Você não faz nada.',
               'Isso também é uma coisa que você fez, e ela conta igual.'],
        rep:null},
      captura:{
        texto:['Você leva a mão ao cinto e para no meio do movimento.',
               'Não é hora. Uma parte de você sabia disso antes da mão.'],
        rep:null},
      item:{
        texto:['Você mexe na mochila e não acha o que estava procurando, ou acha e não serve.',
               'Mochila é assim: ela nunca tem a coisa do momento.'],
        rep:null}
    };
    return base[intencao] || {
      texto:['Você faz isso.',
             'O mundo registra e segue — do jeito que o mundo faz com quase tudo.'],
      rep:null};
  }
};
