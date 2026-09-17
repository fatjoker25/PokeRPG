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

let _uidPokemon = 1;

function criarPokemon(dexId, nivel, opcoes={}){
  const esp = DEX[dexId];
  if (!esp) throw new Error('Pokémon inexistente: ' + dexId);
  const natureza = opcoes.natureza || Dados.escolher(NOMES_NATUREZAS);
  const ivs = opcoes.ivs || ivsAleatorios();
  const stats = calcularStats(esp.base, nivel, ivs, natureza);
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
    selvagem: !!opcoes.selvagem,
    morto: false,
    historia: opcoes.historia || null,
    capturadoEm: opcoes.capturadoEm || null
  };
}

function nomeExib(p){ return p.apelido ? p.apelido + ' (' + p.nome + ')' : p.nome; }

function expNecessaria(nivel){ return Math.floor(Math.pow(nivel, 3) * 0.08) + nivel * 12 + 20; }

function expGanha(vencido, venceu){
  const esp = DEX[vencido.dex];
  const bruto = Math.floor((esp.total * vencido.nivel) / 22);
  return Math.max(6, bruto);
}

/* Sobe de nível, recalcula stats, aprende golpes novos. Retorna eventos. */
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
    p.hp += (p.stats.hp - antes.hp);
    p.expProx = expNecessaria(p.nivel);
    eventos.push({tipo:'nivel', nivel:p.nivel});

    // aprender golpe novo
    const ideal = montarGolpes(p.dex, p.nivel);
    const atuais = p.golpes.map(g => g.nome);
    const novo = ideal.find(g => !atuais.includes(g.nome));
    if (novo){
      if (p.golpes.length < 4){
        p.golpes.push({...novo});
        eventos.push({tipo:'golpe', golpe:novo.nome});
      } else {
        // troca o golpe mais fraco se o novo for claramente melhor
        const poder = (n) => GOLPES[n].c === 'status' ? 20 : (GOLPES[n].p || 45);
        let iPior = 0;
        p.golpes.forEach((g,i) => { if (poder(g.nome) < poder(p.golpes[iPior].nome)) iPior = i; });
        if (poder(novo.nome) > poder(p.golpes[iPior].nome) + 15){
          const velho = p.golpes[iPior].nome;
          p.golpes[iPior] = {...novo};
          eventos.push({tipo:'golpe', golpe:novo.nome, esqueceu:velho});
        }
      }
    }

    // evolução por nível
    const esp = DEX[p.dex];
    if (esp.evo && esp.nivelEvo && p.nivel >= esp.nivelEvo){
      const antigo = p.nome;
      evoluir(p, esp.evo);
      eventos.push({tipo:'evolucao', de:antigo, para:p.nome});
    }
  }
  return eventos;
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
  const tiposPref = VIES_AMBIENTE[ambiente] || [];
  let dexId;
  if (tiposPref.length && Dados.chance(65)){
    const candidatos = POOL_SELVAGEM.filter(d => DEX[d].tipos.some(t => tiposPref.includes(t)));
    dexId = Dados.escolher(candidatos.length ? candidatos : POOL_SELVAGEM);
  } else {
    dexId = Dados.escolher(POOL_SELVAGEM);   // qualquer um, em qualquer lugar
  }
  // nível: normalmente perto da faixa da área, mas com cauda longa (Lv30 na Rota 1 acontece)
  let nivel;
  const r = Dados.d20('Nível do selvagem');
  if (r === 20)      nivel = Dados.entre(nivelBase + 12, nivelBase + 28);
  else if (r >= 17)  nivel = Dados.entre(nivelBase + 5, nivelBase + 12);
  else if (r <= 2)   nivel = Math.max(2, Dados.entre(nivelBase - 6, nivelBase - 2));
  else               nivel = Math.max(2, Dados.entre(nivelBase - 3, nivelBase + 4));
  nivel = Math.min(70, nivel);
  return criarPokemon(dexId, nivel, {selvagem:true});
}
