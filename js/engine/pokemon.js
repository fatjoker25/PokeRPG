/* ============================================================
   POKÉMON — instâncias, stats por nível, experiência, evolução
   ============================================================ */

/* Fórmula padrão dos jogos (IVs aleatórios, sem EVs) */
function calcularStats(base, nivel, ivs, natureza){
  const nat = NATUREZAS[natureza] || NATUREZAS['Hardy'];
  const s = {};
  s.hp = Math.floor(((2*base.hp + ivs.hp) * nivel) / 100) + nivel + 10;
  for (const k of ['atk','def','spa','spd','spe']){
    let v = Math.floor(((2*base[k] + ivs[k]) * nivel) / 100) + 5;
    if (nat.mais === k)  v = Math.floor(v * 1.1);
    if (nat.menos === k) v = Math.floor(v * 0.9);
    s[k] = v;
  }
  return s;
}

function ivsAleatorios(){
  const o = {};
  for (const k of ['hp','atk','def','spa','spd','spe']) o[k] = Dados.entre(0,31);
  return o;
}

/* ============================================================
   BRILHANTES
   A mesma espécie com a cor errada. Não muda um único status —
   muda o que você sente quando aquilo aparece no mato.
   A Sorte do treinador pesa: quem tem sorte encontra mais.
   ============================================================ */
function chanceShiny(){
  let sorte = 0;
  try { sorte = (Estado.dados && Estado.j && Estado.j.status.sorte) || 0; } catch(e){}
  return Math.max(300, 1000 - sorte * 70);      /* 1 em 1000, até 1 em 300 */
}
function rolarShiny(){ return Dados.entre(1, chanceShiny()) === 1; }
function ehShiny(p){ return !!(p && p.shiny); }

/* Manhã e tarde contam como dia; noite e madrugada, como noite. */
function ehDeDia(){
  try {
    const per = Estado.dados.relogio.periodo;
    return per === 'manhã' || per === 'tarde';
  } catch(e){ return true; }
}

let _uidPokemon = 1;

function criarPokemon(dexId, nivel, opcoes={}){
  const esp = DEX[dexId];
  if (!esp) throw new Error('Pokémon inexistente: ' + dexId);
  /* Quem já evoluiu não existe abaixo do nível em que evoluiu.
     Vale para selvagem, time de treinador e cena escrita à mão. */
  nivel = Math.max(1, Math.min(100, Math.round(nivel)));
  const piso = (typeof nivelMinimoDe === 'function') ? nivelMinimoDe(dexId) : (esp.nivelMin || 1);
  if (nivel < piso) nivel = piso;
  const natureza = opcoes.natureza || Dados.escolher(NOMES_NATUREZAS);
  const shiny = (opcoes.shiny !== undefined) ? !!opcoes.shiny : rolarShiny();
  const ivs = opcoes.ivs || ivsAleatorios();
  const stats = calcularStats(esp.base, nivel, ivs, natureza);
  const genero = opcoes.genero !== undefined ? opcoes.genero : sortearGenero(dexId);
  return {
    uid: 'p' + (_uidPokemon++) + '_' + Date.now().toString(36),
    dex: dexId,
    nome: esp.nome,
    apelido: opcoes.apelido || null,
    tipos: esp.tipos.slice(),
    nivel,
    natureza,
    ivs,
    stats,
    hp: stats.hp,
    hpMax: stats.hp,
    golpes: opcoes.golpes || montarGolpes(dexId, nivel),
    status: null,          // 'veneno'|'queimadura'|'paralisia'|'sono'|'congelamento'
    statusTurnos: 0,
    exp: 0,
    expProx: expNecessaria(nivel),
    moral: opcoes.moral !== undefined ? opcoes.moral : 70,  // vínculo com o treinador
    lendario: esp.lendario,
    shiny,
    selvagem: !!opcoes.selvagem,
    morto: false,
    historia: opcoes.historia ? concordar(opcoes.historia, genero) : null,
    capturadoEm: opcoes.capturadoEm || null,
    segurando: opcoes.segurando || null,   // item segurado
    faixaUsada: false,                     // Faixa Firme já salvou nesta batalha?
    convivencia: 0,                        // combates junto — leva à leitura da natureza
    naturezaVista: !!opcoes.naturezaVista, // você sabe qual é o jeito dele?
    genero                                 // 'm' | 'f' | null
  };
}

/* Nome completo: o que você usa quando conhece a espécie */
function nomeExib(p){ return p.apelido ? p.apelido + ' (' + p.nome + ')' : p.nome; }

/* Nome que aparece na tela: o que VOCÊ pode saber neste momento.
   Seu → nome completo. De treinador com apelido → só o apelido, até catalogar.
   Selvagem não catalogado → ???. */
function nomeVisivel(p){
  if (!p) return '';
  if (typeof Estado === 'undefined' || !Estado.dados) return nomeExib(p);
  const d = Estado.dados;
  const meu = (d.time || []).some(x => x.uid === p.uid)
           || (d.pc || []).some(x => x.uid === p.uid)
           || (d.cemiterio || []).some(x => x.uid === p.uid);
  if (meu) return nomeExib(p);
  if (Estado.conheceu(p.dex)) return nomeExib(p);
  /* Líder de ginásio grita o nome do próprio Pokémon ao soltar a bola.
     Ouvir o nome não preenche a Pokédex: para isso ainda é preciso escanear. */
  if (p.nomeAnunciado) return nomeExib(p);
  if (p.apelido) return p.apelido;
  return '???';
}

/* A natureza dele é conhecida? A sua, por convivência; a dos outros, pela Pokédex. */
function naturezaVisivel(p){
  if (!p) return '???';
  return p.naturezaVista ? p.natureza : '???';
}

function expNecessaria(nivel){ return Math.floor(Math.pow(nivel, 3) * 0.08) + nivel * 12 + 20; }

/* ---------- SEXO ----------
   A proporção é a dos jogos. Sem sexo, só macho e só fêmea são os de
   Gold/Silver; os iniciais, os fósseis, Eevee e Togepi nascem 7 machos
   pra cada fêmea; Growlithe, Abra, Machop e os bebês de fogo e raio são
   3 pra 1; Clefairy, Vulpix, Jigglypuff e Snubbull são 1 pra 3. O resto
   é meio a meio. Sorteado quando o Pokémon nasce e guardado nele.

   Sexo não mexe em atributo nem em jeito — o jeito é a natureza. O que
   ele muda é com quem o bicho se importa (o par, logo abaixo), o
   Attract, e como a história fala dele. */
const SEM_SEXO = new Set([81,82,100,101,120,121,132,137,144,145,146,150,151,201,233,243,244,245,249,250,251]);
const SO_MACHO = new Set([32,33,34,106,107,128,236,237]);
const SO_FEMEA = new Set([29,30,31,113,115,124,238,241,242]);
const QUASE_MACHO = new Set([1,2,3,4,5,6,7,8,9,133,134,135,136,138,139,140,141,142,143,152,153,154,155,156,157,158,159,160,175,176,196,197]);
const TRES_MACHOS = new Set([58,59,63,64,65,66,67,68,125,126,239,240]);
const TRES_FEMEAS = new Set([35,36,37,38,39,40,173,174,209,210]);

/* Chance de nascer macho, de 0 a 1. null = a espécie não tem sexo. */
function chanceDeMacho(dex){
  if (SEM_SEXO.has(dex)) return null;
  if (SO_MACHO.has(dex)) return 1;
  if (SO_FEMEA.has(dex)) return 0;
  if (QUASE_MACHO.has(dex)) return 0.875;
  if (TRES_MACHOS.has(dex)) return 0.75;
  if (TRES_FEMEAS.has(dex)) return 0.25;
  return 0.5;
}
function sortearGenero(dex){
  const c = chanceDeMacho(dex);
  if (c === null) return null;
  return Math.random() < c ? 'm' : 'f';
}
/* Save antigo não tem o campo: sorteia na primeira vez que alguém pergunta. */
function generoDe(p){
  if (!p) return null;
  if (p.genero === undefined) p.genero = sortearGenero(p.dex);
  return p.genero;
}
/* Como a Pokédex escreve a proporção da espécie. */
function proporcaoGenero(dex){
  const c = chanceDeMacho(dex);
  if (c === null) return 'sem sexo';
  if (c === 1) return 'só machos';
  if (c === 0) return 'só fêmeas';
  if (c === 0.5) return 'meio a meio';
  if (c === 0.875) return '7 machos pra 1 fêmea';
  if (c === 0.75) return '3 machos pra 1 fêmea';
  return '1 macho pra 3 fêmeas';
}
function simboloGenero(p){
  const g = generoDe(p);
  return g === 'm' ? '♂' : g === 'f' ? '♀' : '';
}

/* Os pronomes dele. Quem não tem sexo fica no masculino, que é o
   gênero da palavra "Pokémon" — o jeito como qualquer um falaria.
   Uso: const g = pron(p); `${g.Ele} está sentad${g.o}`. */
function pron(p){
  const f = generoDe(p) === 'f';
  return f
    ? {ele:'ela', Ele:'Ela', dele:'dela', nele:'nela', o:'a', um:'uma', do:'da', ao:'à', pro:'pra', f:true}
    : {ele:'ele', Ele:'Ele', dele:'dele', nele:'nele', o:'o', um:'um', do:'do', ao:'ao', pro:'pro', f:false};
}

/* Texto escrito antes de saber o sexo: {o}, {ele}, {Ele}, {dele}, {um}
   viram a forma certa. Serve pra história de origem que o roteiro
   passa pro criarPokemon ("Comprad{o} de um menino…"). Aceita o
   Pokémon ou só o sexo. */
function concordar(txt, quem){
  if (typeof txt !== 'string') return txt;
  const g = (quem && typeof quem === 'object') ? pron(quem) : pron({genero: quem || null});
  return txt.replace(/\{(o|ele|Ele|dele|nele|um|do|ao|pro)\}/g, (_, k) => g[k]);
}

/* ---------- O PAR ----------
   Dois do mesmo grupo (a mesma linha de evolução, com os dois Nidoran
   contando como um grupo só), de sexo oposto, no mesmo time. Sem
   sexo não forma par. Cada um tem no máximo um par: o primeiro que
   aparecer na ordem do time. */
/* O bebê de Johto não é forma anterior no DEX (quebraria o piso de
   nível do adulto), então a ponte até a linha de Kanto vem daqui. */
const BEBE_DE = {172:25, 173:35, 174:39, 238:124, 239:125, 240:126};
function raizDaLinha(dex){
  let d = BEBE_DE[dex] || dex, guarda = 0;
  while (DEX[d] && DEX[d].preEvo && guarda++ < 5) d = DEX[d].preEvo;
  return d === 32 ? 29 : d;       // Nidoran♂ e Nidoran♀ são um grupo
}
function formamPar(a, b){
  if (!a || !b || a.uid === b.uid || a.morto || b.morto) return false;
  const ga = generoDe(a), gb = generoDe(b);
  if (!ga || !gb || ga === gb) return false;
  return raizDaLinha(a.dex) === raizDaLinha(b.dex);
}
function parDe(p, lista){
  if (!p) return null;
  if (!lista && typeof Estado !== 'undefined' && Estado.dados) lista = Estado.dados.time;
  return (lista || []).find(x => formamPar(p, x)) || null;
}
/* Todos os pares do time, sem repetir. */
function paresDoTime(lista){
  const vistos = new Set(), pares = [];
  (lista || []).forEach(a => {
    if (vistos.has(a.uid)) return;
    const b = (lista || []).find(x => !vistos.has(x.uid) && formamPar(a, x));
    if (b){ vistos.add(a.uid); vistos.add(b.uid); pares.push([a, b]); }
  });
  return pares;
}

/* A frase que o jogo mostra pra cada coisa que a experiência causou. */
function linhaDeExp(p, e){
  const n = nomeVisivel(p);
  if (e.tipo === 'nivel') return `${n} subiu para o nível ${e.nivel}!`;
  if (e.tipo === 'golpe') return `${n} aprendeu ${e.golpe}!`;
  if (e.tipo === 'querAprender') return `${n} quer aprender ${e.golpe}, mas já sabe quatro golpes.`;
  return null;
}

function expGanha(vencido, venceu){
  const esp = DEX[vencido.dex];
  const bruto = Math.floor((esp.total * vencido.nivel) / 22);
  return Math.max(6, bruto);
}

/* Sobe de nível e recalcula stats. Retorna eventos.

   Como nos jogos, o motor não decide nada pelo jogador:
   - aprende TODOS os golpes que a espécie aprende naquele nível, não só
     o primeiro;
   - se o golpe não cabe (já tem quatro), marca em p.aprenderPendente e
     quem desenha pergunta qual esquecer — ou se desiste;
   - não puxa golpe de nível anterior pra preencher buraco: nos jogos
     isso não existe, e o Relembrador de Golpes está aí pra isso;
   - evolução não acontece aqui dentro. Marca p.evoPendente e a tela
     de evolução roda DEPOIS da luta, onde dá pra cancelar. */
function ganharExp(p, qtd){
  const eventos = [];
  if (p.morto) return eventos;
  p.exp += qtd;
  eventos.push({tipo:'exp', qtd});
  while (p.exp >= p.expProx && p.nivel < 100){
    p.exp -= p.expProx;
    p.nivel++;
    const antes = p.stats;
    p.stats = calcularStats(DEX[p.dex].base, p.nivel, p.ivs, p.natureza);
    /* HP máximo sobe junto. Antes só o HP atual subia, e um Pokémon de
       vida cheia passava a mostrar 51/49 depois de subir de nível. */
    p.hpMax = p.stats.hp;
    p.hp = Math.min(p.hpMax, p.hp + (p.stats.hp - antes.hp));
    p.expProx = expNecessaria(p.nivel);
    eventos.push({tipo:'nivel', nivel:p.nivel});

    if (typeof golpesDoNivel === 'function')
      for (const nome of golpesDoNivel(p.dex, p.nivel))
        ofertarGolpe(p, nome).forEach(e => eventos.push(e));

    const destino = destinoDeEvolucao(p);
    if (destino && !p.evoPendente){
      p.evoPendente = destino;
      eventos.push({tipo:'vaiEvoluir', para:DEX[destino].nome});
    }
  }
  return eventos;
}

/* Oferece um golpe: entra se tiver vaga; se não tiver, fica pendente
   pra o jogador escolher. Golpe que ele já sabe não conta. */
function ofertarGolpe(p, nome){
  if (!GOLPES[nome] || p.golpes.some(g => g.nome === nome)) return [];
  if (p.golpes.length < 4){
    p.golpes.push({nome, pp:GOLPES[nome].pp, ppMax:GOLPES[nome].pp});
    registrarGolpeNaDex(p.dex, nome);
    return [{tipo:'golpe', golpe:nome}];
  }
  p.aprenderPendente = p.aprenderPendente || [];
  if (!p.aprenderPendente.includes(nome)) p.aprenderPendente.push(nome);
  return [{tipo:'querAprender', golpe:nome}];
}

/* Troca o golpe do índice i pelo novo. i < 0 = desistiu de aprender. */
function aprenderNoLugar(p, nome, i){
  p.aprenderPendente = (p.aprenderPendente || []).filter(n => n !== nome);
  if (i < 0 || !GOLPES[nome]) return null;
  const velho = p.golpes[i] ? p.golpes[i].nome : null;
  p.golpes[i] = {nome, pp:GOLPES[nome].pp, ppMax:GOLPES[nome].pp};
  registrarGolpeNaDex(p.dex, nome);
  return velho;
}

/* Pra onde a espécie evolui agora, se evolui. Evolução cancelada volta
   a tentar no nível seguinte, como apertar B nos jogos. */
function destinoDeEvolucao(p){
  if (p.evoCanceladaEm === p.nivel) return null;
  const esp = DEX[p.dex];
  if (esp.evo && esp.nivelEvo && p.nivel >= esp.nivelEvo) return esp.evo;
  /* O que a 2ª Geração pendurou em espécies antigas. Nada disso
     acontece antes da Pokédex Nacional: até lá, um Golbat que
     gosta de você continua sendo só um Golbat que gosta de você. */
  if (typeof dexNacional === 'function' && dexNacional()){
    const porAmizade = EVO_JOHTO_AMIZADE[p.dex];
    /* Eevee é o único que olha o relógio: Espeon de dia, Umbreon de noite */
    if (porAmizade && p.moral >= 90) return (p.dex === 133) ? (ehDeDia() ? 196 : 197) : porAmizade;
    const porNivelJohto = EVO_JOHTO_NIVEL[p.dex];
    if (porNivelJohto && p.nivel >= 30) return porNivelJohto;
  }
  return null;
}

/* Depois de evoluir, a forma nova pode ter golpe no nível atual — só os
   da espécie nova, que os da anterior já foram oferecidos na subida. */
function golpesAoEvoluir(p){
  const eventos = [];
  for (const [nv, nome] of ((typeof APRENDE !== 'undefined' && APRENDE[p.dex]) || []))
    if (nv === p.nivel) ofertarGolpe(p, nome).forEach(e => eventos.push(e));
  return eventos;
}

/* O cardápio do Relembrador de Golpes: tudo o que a linha aprende por
   nível até o nível atual, menos o que ele sabe agora. Inclui a forma
   anterior, que é de onde vem o golpe que ficou pelo caminho. */
function golpesParaRelembrar(p){
  const sabe = new Set(p.golpes.map(g => g.nome));
  const vistos = new Set(), saida = [];
  for (const d of fontesDeGolpe(p.dex))
    for (const [nv, nome] of ((typeof APRENDE !== 'undefined' && APRENDE[d]) || []))
      if (nv <= p.nivel && GOLPES[nome] && !sabe.has(nome) && !vistos.has(nome)){
        vistos.add(nome); saida.push({nome, nv});
      }
  return saida.sort((a, b) => a.nv - b.nv);
}

/* Pokédex: cada golpe que a espécie aprende na sua mão fica cadastrado. */
function registrarGolpeNaDex(dex, nome){
  if (typeof Estado === 'undefined' || !Estado.dados || !Estado.pdex) return;
  /* sem o aparelho não tem cadastro: quando ele chega, registra o que
     o time sabe naquele dia (Estado.catalogarQuemJaTenho) */
  if (!Estado.dados.flags || !Estado.dados.flags.tem_pokedex) return;
  const pd = Estado.pdex();
  pd.golpes = pd.golpes || {};
  const lista = pd.golpes[dex] = pd.golpes[dex] || [];
  if (!lista.includes(nome)) lista.push(nome);
}

function evoluir(p, novoDex){
  const prop = p.hp / p.hpMax;
  p.dex = novoDex;
  p.nome = DEX[novoDex].nome;
  p.tipos = DEX[novoDex].tipos.slice();
  p.stats = calcularStats(DEX[novoDex].base, p.nivel, p.ivs, p.natureza);
  p.hpMax = p.stats.hp;
  p.hp = Math.max(1, Math.round(p.hpMax * prop));
  p.moral = Math.min(100, p.moral + 5);
  p.evoPendente = null;
  p.evoCanceladaEm = null;
  /* Brilhante continua brilhante do outro lado — e abre o registro da nova forma. */
  if (p.shiny && typeof Estado !== 'undefined' && Estado.dados) Estado.pegouBrilhante(novoDex);
  /* Evoluiu na sua mão: a forma nova entra catalogada, com os golpes que sabe. */
  if (typeof Estado !== 'undefined' && Estado.dados && Estado.pdex){
    Estado.pdex().catalogados[novoDex] = true;
    p.golpes.forEach(g => registrarGolpeNaDex(novoDex, g.nome));
  }
}

/* A forma que essa linha evolutiva tem NESTE nível.
   Serve para montar time de treinador sem cair no piso de evolução:
   em vez de um Krabby que virou Kingler Nv28 à força, um Krabby. */
function formaNoNivel(dexId, nivel){
  let atual = dexId, guarda = 0;
  while (guarda++ < 5){
    const esp = DEX[atual];
    if (!esp || !esp.evo) break;
    const destino = DEX[esp.evo];
    if (!destino) break;
    const piso = (typeof nivelMinimoDe === 'function') ? nivelMinimoDe(esp.evo) : (destino.nivelMin || 1);
    if (nivel < piso) break;
    atual = esp.evo;
  }
  return atual;
}

/* O caminho de volta: a forma mais alta da linha que cabe no nível,
   partindo da forma final que o roteiro pediu. */
function formaAteONivel(dexFinal, nivel){
  const linha = [];
  let d = dexFinal, guarda = 0;
  while (d && guarda++ < 5){ linha.unshift(d); d = DEX[d] ? DEX[d].preEvo : 0; }
  let escolhido = linha[0];
  for (const x of linha){
    const piso = (typeof nivelMinimoDe === 'function') ? nivelMinimoDe(x) : (DEX[x].nivelMin || 1);
    if (piso <= nivel) escolhido = x;
  }
  return escolhido;
}

function curarTotal(p){
  if (p.morto) return;
  p.hp = p.hpMax;
  p.status = null;
  p.statusTurnos = 0;
  p.golpes.forEach(g => g.pp = g.ppMax);
}

function estaVivo(p){ return !p.morto && p.hp > 0; }

/* Encontro selvagem: espécie e nível TOTALMENTE aleatórios,
   com o ambiente apenas enviesando a probabilidade. */
function sortearSelvagem(ambiente='campo', nivelBase=8){
  // nível: normalmente perto da faixa da área, mas com cauda longa (Lv30 na Rota 1 acontece)
  let nivel;
  const r = Dados.d20('Nível do selvagem');
  if (r === 20)      nivel = Dados.entre(nivelBase + 12, nivelBase + 28);
  else if (r >= 17)  nivel = Dados.entre(nivelBase + 5, nivelBase + 12);
  else if (r <= 2)   nivel = Math.max(2, Dados.entre(nivelBase - 6, nivelBase - 2));
  else               nivel = Math.max(2, Dados.entre(nivelBase - 3, nivelBase + 4));
  nivel = Math.min(70, nivel);

  /* Só entram no sorteio as espécies que podem existir neste nível.
     Numa rota de nível 6 não se encontra Dodrio: encontra-se Doduo. */
  const disponivel = (typeof poolSelvagem === 'function') ? poolSelvagem() : POOL_SELVAGEM;
  const cabe = d => nivelMinimoDe(d) <= nivel;
  const possiveis = disponivel.filter(cabe);
  const pool = possiveis.length ? possiveis : disponivel.filter(d => nivelMinimoDe(d) <= 1 + nivel);
  const base = pool.length ? pool : disponivel;

  const tiposPref = VIES_AMBIENTE[ambiente] || [];
  let dexId;
  if (tiposPref.length && Dados.chance(65)){
    const candidatos = base.filter(d => DEX[d].tipos.some(t => tiposPref.includes(t)));
    dexId = Dados.escolher(candidatos.length ? candidatos : base);
  } else {
    dexId = Dados.escolher(base);   // qualquer um, em qualquer lugar
  }
  return criarPokemon(dexId, nivel, {selvagem:true});
}
