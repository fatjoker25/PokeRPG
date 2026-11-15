/* ============================================================
   RELATÓRIO DE UMA RODADA DE ROBÔS
   Lê a pasta de uma rodada (rodada-de-robos.js): o plano.json e, de cada
   robô, a saída da última etapa (<posto>.json) e o ponto de parada
   (<posto>.ponto.json, com o save inteiro). Abre cada save no jogo,
   sem tela, e pergunta o que só o jogo sabe: a foto nas cores da ficha,
   o que cada posto ainda pede e o quadro de postos. Escreve uma página
   só, com as imagens embutidas, no formato dos relatórios das rodadas
   anteriores (o estilo mora em relatorio-de-robos.css): a tabela dos
   robôs, os postos, o quadro dos jeitos, o que a rodada mostrou e uma
   seção por robô (ficha, jeito, posto, inicial, ginásios, Elite, time,
   PC, formação do time, dificuldades, passo a passo e diário).

   Uso:  node ferramentas/relatorio-de-robos.js <pasta> <saida.html> [notas.json]

   notas.json é o que quem vigiou a rodada escreveu à mão, tudo
   opcional: {titulo, eyebrow, intro:[html], geral:[html], defeitos:[html],
   longas:{<chave>:'classe'}, robos:{<posto>:{dificuldades:[html], nota:html}}}.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = path.resolve(__dirname, '..');
const PASTA = path.resolve(process.argv[2] || '.');
const SAIDA = path.resolve(process.argv[3] || path.join(PASTA, 'relatorio.html'));
const NOTAS = process.argv[4] && fs.existsSync(process.argv[4]) ? JSON.parse(fs.readFileSync(process.argv[4], 'utf8')) : {};
const SHELL = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';

/* os jeitos do robô, lidos do próprio robô */
const botSrc = fs.readFileSync(path.join(__dirname, 'bot-jogador.js'), 'utf8');
const JEITOS = eval('(' + botSrc.match(/const JEITOS = (\{[\s\S]*?\n\});\nconst NEUTRO/)[1] + ')');

const ler = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c]));
const num = n => Number(n || 0).toLocaleString('pt-BR');
const pct = (a, b) => b ? (100 * a / b).toFixed(1).replace('.', ',') + '%' : '—';
const uma = (n, s, p) => `${num(n)} ${n === 1 ? s : (p || s + 's')}`;

/* imagens embutidas */
const cacheImg = {};
const img64 = rel => {
  if (rel in cacheImg) return cacheImg[rel];
  const f = path.join(RAIZ, 'sprites_nds', rel);
  return (cacheImg[rel] = fs.existsSync(f) ? 'data:image/png;base64,' + fs.readFileSync(f).toString('base64') : null);
};
const icone = dex => img64('party_icons/' + dex + '.png');
const frente = dex => img64('battle/front_full/' + dex + '.png');
const INSIGNIA_ARQ = {pewter:'boulder', cerulean:'cascade', vermilion:'thunder', celadon:'rainbow', fuchsia:'soul',
  saffron:'marsh', cinnabar:'volcano', viridian:'earth'};
const insigniaImg = gid => INSIGNIA_ARQ[gid] ? img64('badges/' + INSIGNIA_ARQ[gid] + '_badge.png') : null;

const NOME_DO_JEITO_META = {campeao:'Ser campeão', pokedex:'Completar a Pokédex', heroi:'Proteger quem precisa', poder:'Ter poder e dinheiro',
  vinculo:'Crescer junto com o time', explorar:'Conhecer Kanto inteira', casa:'Voltar pra casa com orgulho'};

/* o jeito em palavras, pelos números dele */
function descreveJeito(J){
  const p = [];
  p.push(`Cura abaixo de ${Math.round((J.cura || .6) * 100)}% do HP`);
  p.push(J.abaixo > 0 ? `aceita seguir até ${J.abaixo} níveis abaixo da área` : J.abaixo < 0 ? `treina até ${-J.abaixo} acima da área antes de seguir` : 'treina até o nível da área');
  p.push(`foge de selvagem ${J.foge} níveis acima`);
  p.push({nova:'captura toda espécie que a Pokédex não tem', forte:'captura o que melhora o time', time:'fica com os primeiros que capturar'}[J.captura] || 'captura pouco');
  if (J.lendario) p.push('tenta lendário');
  p.push(J.troca ? 'usa PC, pedra e troca' : 'não troca ninguém');
  if (J.ginasio) p.push('vai atrás de ginásio antes de o capítulo pedir');
  if (J.liga) p.push(`tenta a Elite quando passa pelo Planalto com as oito (até ${J.eliteVezes || 6} entradas)`);
  if (J.rep) p.push(`puxa a reputação pro lado ${J.rep === 'bom' ? 'bom' : 'ruim'} nas cenas`);
  if (J.via) p.push(`prefere a via ${J.via.join(' ou ')}`);
  if (J.racaoMoral) p.push(`dá Ração na mão abaixo de moral ${J.racaoMoral}`);
  if (J.andar) p.push('passeia pela cidade');
  if (J.extras) p.push(`pega outro posto que abrir na cidade (chance ${Math.round(J.extras * 100)}%)`);
  return p.join(', ') + '.';
}

/* ---------- leitura dos passos ---------- */
function metricas(x){
  const ps = (x.out.reg && x.out.reg.passos) || [];
  const lutas = ps.filter(p => p.t === 'luta');
  const sel = lutas.filter(l => l.tipo === 'selvagem');
  const V = lutas.filter(l => l.res === 'vitoria' || l.res === 'captura').length;
  const D = lutas.filter(l => l.res === 'derrota' || l.res === 'gameover' || l.res === 'desistiu').length;
  const capturas = lutas.filter(l => l.capturou);
  const curas = ps.filter(p => (p.t === 'mapa' && (p.f === 'centro' || p.f === 'casa' || p.f === 'acampar'))
    || (p.t === 'janela' && /enfermeira|Descansar|curar/i.test(p.texto || ''))).length;
  const fugas = sel.filter(l => l.res === 'fuga').length;
  const caps = ps.filter(p => p.t === 'capitulo');
  const fechou = ps.filter(p => p.t === 'fechou');
  const ginasios = {};
  lutas.filter(l => l.ctx && l.ctx.de === 'ginásio').forEach(l => {
    const g = ginasios[l.ctx.id] || (ginasios[l.ctx.id] = {id:l.ctx.id, lider:l.ctx.lider, cidade:(l.ctx.nome || '').replace(/^Ginásio de /, ''), tent:0, venceu:null});
    g.tent++;
    if (l.res === 'vitoria' && !g.venceu) g.venceu = {dia:l.dia, cap:l.cap, turnos:l.turnos, tent:g.tent};
  });
  /* a Elite: cada entrada começa na primeira porta */
  const entradas = [];
  lutas.filter(l => l.ctx && l.ctx.de === 'Liga').forEach(l => {
    const nome = l.ctx.nome || '';
    const porta = /porta (\d)/.exec(nome);
    const i = porta ? +porta[1] : (/Campeão/.test(nome) ? 5 : 0);
    if (i === 1 || !entradas.length) entradas.push({cap:l.cap, dia:l.dia, portas:[]});
    entradas[entradas.length - 1].portas.push({i, quem:l.treinador || nome, res:l.res, turnos:l.turnos, caidos:l.caidos, de:l.de});
  });
  const longas = ps.filter(p => p.t === 'luta30');
  return {ps, lutas, sel, V, D, capturas, curas, fugas, caps, fechou, ginasios, entradas, longas,
    racao:ps.filter(p => p.t === 'racao').length, trocas:ps.filter(p => p.t === 'troca'), pedras:ps.filter(p => p.t === 'pedra'),
    mortes:ps.filter(p => p.t === 'morte'), postos:ps.filter(p => p.t === 'posto'), largou:ps.filter(p => p.t === 'largou'),
    nacional:ps.filter(p => p.t === 'nacional'), fim:ps.filter(p => p.t === 'fim'), depois:ps.filter(p => p.t === 'depois'),
    rivais:ps.filter(p => p.t === 'rival'), linhas:ps.filter(p => p.t === 'linha')};
}

/* a luta longa, pelo retrato: por que ela durou */
function porQueDurou(l){
  const a = l.aliado || {}, i = l.inimigo || {};
  const k = (NOTAS.longas || {})[`${l.cap}|${l.dia}|${a.nome}|${i.nome}`];
  if (k) return k;
  const so = (a.golpes || []).length && (a.golpes || []).every(g => /^(Harden|Growl|Tail Whip|Leer|String Shot|Sand Attack|Defense Curl|Withdraw|Splash|Screech|Thunder Wave|Sleep Powder|Poison Powder|Stun Spore|Supersonic|Smokescreen|Agility|Teleport|Kinesis|Focus Energy|Minimize|Double Team|Barrier|Amnesia|Reflect|Light Screen|Haze|Mist|Rest|Recover|Softboiled|Transform|Conversion|Substitute|Sweet Scent|Charm|Swords Dance|Growth|Sing|Hypnosis|Glare|Confuse Ray|Disable|Roar|Whirlwind|Mimic|Metronome|Lovely Kiss|Spore|Flash|Meditate|Sharpen|Acid Armor|Calm Mind|Bulk Up|Iron Defense|Cotton Spore|Scary Face|Spite|Protect|Detect|Endure|Sandstorm|Rain Dance|Sunny Day|Safeguard|Baton Pass|Encore|Attract|Curse|Belly Drum|Mean Look|Spider Web|Lock-On|Mind Reader|Foresight|Perish Song|Synthesis|Moonlight|Morning Sun|Psych Up|Heal Bell|Milk Drink|Nightmare|Pain Split|Sleep Talk|Destiny Bond|Defense Curl)$/.test(g));
  if (so) return 'ninguém fere';
  if ((a.nv || 0) <= (i.nv || 0) - 6) return 'fora de nível';
  return 'dano mínimo';
}

/* ---------- a página ---------- */
(async () => {
  const plano = ler(path.join(PASTA, 'plano.json'));
  if (!plano) throw new Error('sem plano.json em ' + PASTA);
  const robos = plano.robos.map(r => ({r, out:ler(path.join(PASTA, r.cargo + '.json')), ponto:ler(path.join(PASTA, r.cargo + '.ponto.json'))}))
    .filter(x => x.out && x.out.ficha && !x.out.ficha.erro);

  /* o jogo, sem tela, pra perguntar o que só ele sabe */
  const browser = await chromium.launch({executablePath:fs.existsSync(SHELL) ? SHELL : '/opt/pw-browsers/chromium', args:['--no-sandbox']});
  const page = await browser.newPage();
  await page.goto('file://' + path.join(RAIZ, 'index.html'));
  await page.waitForTimeout(400);
  const base = await page.evaluate(() => ({
    ginasios:GINASIOS.map(g => ({id:g.id, lider:g.lider, cidade:g.cidade, insignia:g.insignia})),
    cargos:CARGOS.map(c => ({id:c.id, nome:c.nome, orgao:c.orgao, cap:c.cap, lugar:c.lugar, onde:c.onde, resumo:c.resumo || '', veta:c.veta || []})),
    locais:Object.fromEntries(Object.entries(LOCAIS).map(([k, L]) => [k, L.nome])),
    capitulos:CAPITULOS.map(c => ({num:c.num, titulo:c.titulo, nome:typeof numeroDoCapitulo === 'function' ? numeroDoCapitulo(c) : 'Capítulo ' + c.num})),
    dexNome:Object.fromEntries(Object.entries(DEX).map(([k, v]) => [k, v.nome]))
  }));
  for (const x of robos){
    if (!x.ponto || !x.ponto.save) continue;
    x.jogo = await page.evaluate(texto => {
      const r = ArquivoSave.ler(texto);
      if (r.erro) return {erro:r.erro};
      Estado.abrir(r.dados);
      const d = Estado.dados, j = d.jogador;
      let foto = null; try { foto = FotoJogador.doSave(j, d); } catch (e) {}
      const quadro = CARGOS.map(c => { const e = Cargos.estado(c.id);
        return {id:c.id, nome:concordaJogador(c.nome), tem:Cargos.tem(c.id), ok:!!e.ok, motivo:e.motivo ? concordaJogador(e.motivo) : null,
          pedidos:Cargos.pedidos(c).map(p => ({t:concordaJogador(p.t), ok:p.ok}))}; });
      const rep = Estado.nivelRep ? Estado.nivelRep() : null;
      const st = j.status || {};
      return {foto, quadro, rep:rep ? concordaJogador(rep.nome) : null, cargo:j.cargo ? concordaJogador(j.cargo) : null,
        personalidade:j.personalidade || null, objetivo:j.objetivo || null, casa:j.casa || null, status:st, forte:j.forte,
        gostos:j.gostos && j.gostos.texto || null, desgostos:j.desgostos && j.desgostos.texto || null,
        nomes:Object.fromEntries([].concat(d.time || [], d.pc || []).map(p => [p.uid, nomeExib(p)])),
        moral:(d.time || []).map(p => p.moral || 0), diario:(d.log || []).map(l => typeof l === 'string' ? l : (l.texto || JSON.stringify(l)))};
    }, x.ponto.save).catch(e => ({erro:e.message}));
    /* a foto: endereço de arquivo vira imagem embutida */
    if (x.jogo && typeof x.jogo.foto === 'string' && !/^data:/.test(x.jogo.foto)){
      const rel = x.jogo.foto.replace(/^.*sprites_nds\//, '');
      x.jogo.foto = img64(rel);
    }
  }
  await browser.close();

  const capDe = n => base.capitulos.find(c => c.num === n) || {nome:'Capítulo ' + n, titulo:''};
  const lugar = id => base.locais[id] || id || '?';
  const cargoDe = id => base.cargos.find(c => c.id === id) || {id, nome:id};
  for (const x of robos){
    x.m = metricas(x);
    x.J = JEITOS[x.r.jeito] || {};
    x.mulher = x.out.ficha.genero === 'Mulher';
    x.g = t => String(t || '').replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (m, a, b) => x.mulher ? b : a);
    x.id = x.r.cargo;
  }

  /* ---------- os postos ---------- */
  const postoTomado = (x, id) => x.m.postos.find(p => p.cargo === id);
  const blocoPostos = () => {
    const linhas = base.cargos.map(c => {
      const quem = robos.find(x => x.r.cargo === c.id);
      const outros = robos.filter(x => x.r.cargo !== c.id && postoTomado(x, c.id));
      let res = '<td>—</td>';
      if (quem){
        const t = postoTomado(quem, c.id);
        const q = quem.jogo && quem.jogo.quadro ? quem.jogo.quadro.find(z => z.id === c.id) : null;
        const falta = q ? q.pedidos.filter(p => !p.ok).map(p => esc(quem.g(p.t))) : [];
        res = t ? `<td class="final">✓ capítulo ${esc(capDe(t.cap).nome.replace(/^Capítulo /, ''))}, dia ${num(t.dia)}<span class="r-det">${esc(lugar(t.local))}</span></td>`
          : `<td><span class="ruim">✗</span> ${falta.length ? esc('faltou: ') + falta.join(' · ') : esc(q && q.motivo ? q.motivo : 'não chegou')}</td>`;
      }
      const nomeP = quem ? quem.g(c.nome) : String(c.nome).replace(/\{([^{}|]*)\|([^{}|]*)\}/g, '$1');
      /* a licença todo mundo tira: ali vai só a conta */
      const passagem = !outros.length ? '—' : c.id === 'treinador' ? `${outros.length} dos outros ${robos.length - 1}`
        : outros.map(o => { const t = postoTomado(o, c.id); return `<a href="#${o.id}">${esc(o.out.ficha.nome)}</a> <small>(cap. ${esc(String(t.cap))}, dia ${num(t.dia)})</small>`; }).join(', ');
      return `<tr><th scope="row">${esc(nomeP)}<small class="r-det">${esc(c.orgao || '')} · capítulo ${c.cap}</small></th>
        <td>${quem ? `<a href="#${quem.id}">${esc(quem.out.ficha.nome)}</a><span class="r-det">${esc(quem.J.nome || quem.r.jeito)}</span>` : '—'}</td>${res}
        <td class="passagem">${passagem}</td></tr>`;
    }).join('');
    return `<section class="bloco postos"><h3>Os postos</h3>
      <p class="nota">Cada robô tinha um posto pra buscar: quando o posto abre (Cargos.estado), ele anda até o lugar e assume. O policial pede ter sido guarda de rota antes. A última coluna é quem pegou o posto de passagem, sem ser o alvo dele. Quando não conseguiu, a linha diz o que o balcão ainda pedia no último save.</p>
      <div class="tabela"><table class="comparar rodadas-t"><thead><tr><th scope="col">Posto</th><th scope="col">Quem buscou</th><th scope="col">Conseguiu?</th><th scope="col">Pegou de passagem</th></tr></thead>
      <tbody>${linhas}</tbody></table></div></section>`;
  };

  /* ---------- o jeito: o que se esperava e o que fez ---------- */
  const todos = robos;
  const rank = (fn, x, menor) => { const v = todos.map(fn).filter(z => z != null); const s = v.slice().sort((a, b) => menor ? a - b : b - a); return s.indexOf(fn(x)) + 1; };
  function itensDoJeito(x){
    const J = x.J, m = x.m, f = x.out.ficha, it = [];
    const add = (cls, rot, txt) => it.push({cls, rot, txt});
    /* o posto */
    const t = postoTomado(x, x.r.cargo);
    const q = x.jogo && x.jogo.quadro ? x.jogo.quadro.find(z => z.id === x.r.cargo) : null;
    const nomePosto = x.g(cargoDe(x.r.cargo).nome);
    if (t) add('sim', 'Posto', `assumiu ${nomePosto} no capítulo ${capDe(t.cap).nome.replace(/^Capítulo /, '')}, dia ${num(t.dia)}, em ${lugar(t.local)}.`);
    else add('nao', 'Posto', `não chegou a ${nomePosto}${q && q.pedidos.some(p => !p.ok) ? ': faltou ' + q.pedidos.filter(p => !p.ok).map(p => x.g(p.t)).join('; ') : q && q.motivo ? ': ' + q.motivo : ''}.`);
    const extras = m.postos.filter(p => p.cargo !== x.r.cargo && p.cargo !== 'treinador');
    if (J.extras) add(extras.length ? 'sim' : 'parte', 'De passagem', extras.length ? `pegou ${extras.map(p => x.g(cargoDe(p.cargo).nome)).join(', ')}.` : 'não pegou outro posto além da licença.');
    if (J.rep) add(f.eixo === J.rep ? 'sim' : 'nao', 'Reputação', `terminou ${esc(x.jogo && x.jogo.rep || f.reputacao || '?')}, lado ${f.eixo === 'ruim' ? 'ruim' : 'bom'} (o jeito puxa pro ${J.rep}).`);
    if (J.via) add(J.via.includes(f.via) ? 'sim' : f.via && f.via !== 'neutro' ? 'nao' : 'parte', 'Via', `${f.via && f.via !== 'neutro' ? 'via ' + f.via : 'sem via'} (o jeito prefere ${J.via.join(' ou ')}).`);
    const c100 = m.lutas.length ? 100 * m.curas / m.lutas.length : 0;
    const rc = rank(y => y.m.lutas.length ? 100 * y.m.curas / y.m.lutas.length : null, x, true);
    add((J.cura || .6) >= .7 ? (rc > todos.length / 2 ? 'sim' : 'parte') : (rc <= todos.length / 2 ? 'sim' : 'parte'), 'Cura',
      `${c100.toFixed(1).replace('.', ',')} curas a cada 100 lutas (${rc}º menor de ${todos.length}).`);
    const fug = m.sel.length ? 100 * m.fugas / m.sel.length : 0;
    add('sim', 'Fuga', `${fug.toFixed(1).replace('.', ',')}% das lutas no mato terminaram em fuga.`);
    const cat = f.pokedex ? f.pokedex.catalogados : 0, rcat = rank(y => y.out.ficha.pokedex ? y.out.ficha.pokedex.catalogados : null, x);
    if (J.captura === 'nova') add(rcat <= 5 ? 'sim' : 'parte', 'Pokédex', `${cat} catalogadas e ${f.pokedex ? f.pokedex.vistos : 0} só vistas (${rcat}ª maior de ${todos.length})${f.pokedex && f.pokedex.nacional ? ', com a Pokédex Nacional' : ''}.`);
    else add('sim', 'Pokédex', `${cat} catalogadas${f.pokedex && f.pokedex.nacional ? ', com a Pokédex Nacional' : ''}.`);
    if (J.ginasio){
      const g4 = Object.values(m.ginasios).filter(g => g.venceu).sort((a, b) => a.venceu.dia - b.venceu.dia);
      add(g4.length >= 4 ? 'sim' : g4.length ? 'parte' : 'nao', 'Ginásios', `${uma(g4.length, 'insígnia')} de ginásio${g4.length >= 4 ? `, a quarta no capítulo ${capDe(g4[3].venceu.cap).nome.replace(/^Capítulo /, '')}` : ''}.`);
    }
    if (J.liga) add(m.entradas.length ? (f.campeao ? 'sim' : 'parte') : 'nao', 'Elite', m.entradas.length
      ? `${uma(m.entradas.length, 'entrada')} na ala; a melhor passou de ${Math.max(...m.entradas.map(e => e.portas.filter(p => p.res === 'vitoria').length))} porta(s)${f.campeao ? ', e saiu Campeão' : ''}.` : 'não entrou na ala.');
    if (J.racaoMoral){
      const mor = (x.jogo && x.jogo.moral) || [];
      const media = mor.length ? Math.round(mor.reduce((s, v) => s + v, 0) / mor.length) : 0;
      add(media >= 70 ? 'sim' : media >= 50 ? 'parte' : 'nao', 'Moral', `deu Ração na mão ${uma(m.racao, 'vez', 'vezes')}; o time terminou com moral média ${media}.`);
    }
    if (J.andar) add(f.descobertas >= 40 ? 'sim' : 'parte', 'Descobertas', `${f.descobertas} descobertas (o posto de repórter pede quarenta).`);
    if (J.lendario){ const l = (f.lendarios || []).filter(y => y.capturado); add(l.length ? 'sim' : 'parte', 'Lendário', l.length ? `pegou ${l.map(y => y.nome).join(', ')}.` : 'não pegou nenhum.'); }
    return it;
  }
  const veredito = it => {
    const s = it.filter(i => i.cls === 'sim').length, n = it.filter(i => i.cls === 'nao').length;
    const posto = it[0].cls === 'sim';
    return posto && n <= 1 ? 'sim' : !posto && n >= Math.ceil(it.length / 2) ? 'nao' : 'parte';
  };
  const VER = {sim:['Fez', 'Fez o que se esperava'], parte:['Em parte', 'Fez parte do que se esperava'], nao:['Não fez', 'Não fez o que se esperava']};

  /* ---------- a tabela dos robôs ---------- */
  const comoAcabou = x => {
    const f = x.m.fim[x.m.fim.length - 1];
    if (f && f.como === 'final') return {cls:'final', txt:f.titulo || 'final', citacao:f.texto || ''};
    if (f && f.como === 'morte') return {cls:'morte', txt:'morte', citacao:f.texto || ''};
    return {cls:'tempo', txt:`parou no ${capDe(x.out.ficha.capitulo).nome}`, citacao:''};
  };
  const miniTime = x => `<span class="mini-time">${(x.out.ficha.time || []).map(p =>
    `<span title="${esc(p.especie + ' ' + p.nivel)}">${icone(p.dex) ? `<img src="${icone(p.dex)}" alt="${esc(p.especie)}" width="32" height="24">` : ''}<i>${p.nivel}</i></span>`).join('')}</span>`;
  const inicialTxt = x => { const i = x.out.ficha.inicial || {}; const a = i.especie || '?', b = i.agora ? i.agora.especie : null;
    return b && b !== a ? `${esc(a)} → ${esc(b)}` : i.agora ? esc(a) : `${esc(a)} <span class="r-det">não está mais no cinto</span>`; };
  const tabela = `<div class="tabela"><table class="comparar">
    <thead><tr><th scope="col">Robô</th><th scope="col">Posto buscado</th><th scope="col">Jeito</th><th scope="col">Inicial</th><th scope="col">Time no fim</th><th scope="col">No PC</th><th scope="col">Insígnias</th><th scope="col">Capítulo</th><th scope="col">Vitórias / derrotas</th><th scope="col">Dia</th><th scope="col">Como acabou</th></tr></thead>
    <tbody>${robos.map(x => { const f = x.out.ficha, a = comoAcabou(x), t = postoTomado(x, x.r.cargo);
      return `<tr><th scope="row"><a href="#${x.id}">${esc(f.nome)}</a></th>
      <td>${esc(x.g(cargoDe(x.r.cargo).nome))}<small class="t-elite">${t ? '✓ cap. ' + esc(String(t.cap)) : '✗ não chegou'}</small></td>
      <td>${esc(x.J.nome || x.r.jeito)}</td><td>${inicialTxt(x)}<small class="t-elite">${x.r.inicial === 'classico' ? 'clássico' : 'o de casa'}</small></td>
      <td>${miniTime(x)}</td><td class="pc-conta">${(f.pc || []).length}</td>
      <td>${(f.insignias || []).filter(i => !/Campeão/.test(i)).length}${x.m.entradas.length ? `<small class="t-elite${f.campeao ? ' camp' : ''}">${f.campeao ? 'Campeão' : 'Elite: ' + Math.max(...x.m.entradas.map(e => e.portas.filter(p => p.res === 'vitoria').length)) + ' de 4'}</small>` : ''}</td>
      <td>${esc(capDe(f.capitulo).nome.replace(/^Capítulo /, ''))}</td><td>${num(x.m.V)} / ${num(x.m.D)}</td><td>${num(f.dia)}</td>
      <td class="${a.cls === 'final' ? 'final' : a.cls === 'morte' ? 'ruim' : 'tempo'}">${esc(a.txt)}</td></tr>`; }).join('')}</tbody></table></div>`;

  const quadroJeitos = `<section class="bloco quadro-jeitos"><h3>Cada um fez o que o jeito dele pedia?</h3>
    <p class="nota">Cada robô foi desenhado pelo posto que busca: o jeito diz quando ele cura, quanto treina, de quem foge, o que captura, pra que lado puxa a reputação e o que pesa mais nas escolhas de cena. As marcas contam o que ele fez (✓), fez em parte (~) e não fez (✗), medido no registro da jornada. A primeira marca é sempre o posto.</p>
    <ul class="q-lista">${robos.map(x => { const it = (x.itens = itensDoJeito(x)); const v = (x.ver = veredito(it));
      return `<li class="${v}"><a href="#${x.id}"><span class="q-nome">${esc(x.out.ficha.nome)}</span><span class="q-jeito">${esc(x.J.nome || x.r.jeito)} · ${esc(x.g(cargoDe(x.r.cargo).nome))}</span>
      <span class="q-veredito"><span class="selo">${VER[v][0]}</span>${esc(it[0].txt.replace(/\.$/, ''))}</span>
      <span class="q-conta"><i class="sim">✓ ${it.filter(i => i.cls === 'sim').length}</i><i class="parte">~ ${it.filter(i => i.cls === 'parte').length}</i><i class="nao">✗ ${it.filter(i => i.cls === 'nao').length}</i></span></a></li>`; }).join('')}</ul></section>`;

  /* ---------- a Nacional ---------- */
  const comNac = robos.filter(x => x.out.ficha.pokedex && x.out.ficha.pokedex.nacional);
  const blocoNacional = `<section class="bloco nacional"><h3>A Pokédex Nacional</h3>
    <p class="nota">Desde esta rodada a Nacional vem por dois caminhos: o título de Campeão, como antes, e o Professor, em Pallet, pra quem traz sessenta espécies de Kanto catalogadas depois das oito insígnias (ou do capítulo 22). Todo robô aponta a Pokédex pra espécie que ainda não catalogou, e vai a Pallet quando a conta fecha.</p>
    <div class="tabela"><table class="comparar"><thead><tr><th scope="col">Robô</th><th scope="col">Kanto catalogadas</th><th scope="col">Catalogadas</th><th scope="col">Vistas</th><th scope="col">Nacional</th></tr></thead><tbody>
    ${robos.slice().sort((a, b) => (b.out.ficha.pokedex || {}).deKanto - (a.out.ficha.pokedex || {}).deKanto).map(x => { const p = x.out.ficha.pokedex || {}, n = x.m.nacional[0];
      return `<tr><th scope="row"><a href="#${x.id}">${esc(x.out.ficha.nome)}</a></th><td>${p.deKanto || 0}</td><td>${p.catalogados || 0}</td><td>${p.vistos || 0}</td>
      <td class="${p.nacional ? 'final' : ''}">${p.nacional ? `✓ ${esc(n && n.como ? n.como : '')}${n ? ` · cap. ${esc(String(n.cap))}, dia ${num(n.dia)}` : ''}` : '—'}</td></tr>`; }).join('')}
    </tbody></table></div>${comNac.length ? '' : '<p class="nota">Ninguém chegou à Nacional nesta rodada.</p>'}</section>`;

  /* ---------- as lutas longas ---------- */
  const longas = [];
  robos.forEach(x => x.m.longas.forEach(l => longas.push({x, l, por:porQueDurou(l)})));
  const POR = {'ninguém fere':'O lado do robô não tinha golpe que ferisse o de lá (só golpe de status, ou tipo que não pega)',
    'fora de nível':'O robô em campo estava seis níveis ou mais abaixo do de lá', 'dano mínimo':'Paradas pequenas dos dois lados: golpe que erra e dano mínimo de 1'};
  const grupos = {};
  longas.forEach(z => (grupos[z.por] = grupos[z.por] || []).push(z));
  const blocoLongas = `<section class="bloco longas"><h3>As lutas que passaram de 30 turnos</h3>
    <p class="nota">O robô avisa quando uma luta passa de 30, 60 e 100 turnos, com o retrato dos dois lados e os últimos eventos, e cada aviso foi olhado durante a rodada. ${uma(longas.filter(z => z.l.marca === 30).length, 'luta')} passaram de 30 turnos, ${longas.filter(z => z.l.marca === 60).length} de 60 e ${longas.filter(z => z.l.marca === 100).length} de 100.</p>
    ${Object.entries(grupos).map(([k, zs]) => `<h4 class="sub-pc">${esc(POR[k] || k)} <small>${uma(zs.filter(z => z.l.marca === 30).length, 'luta')}</small></h4>
      <ol class="elite-l">${zs.filter(z => z.l.marca === 30 || !zs.some(w => w.x === z.x && w.l.cap === z.l.cap && w.l.dia === z.l.dia && w.l.marca === 30 && (w.l.aliado || {}).nome === (z.l.aliado || {}).nome)).slice(0, 40).map(z => {
        const mais = zs.filter(w => w.x === z.x && w.l.dia === z.l.dia && w.l.cap === z.l.cap && w.l.marca > z.l.marca && (w.l.inimigo || {}).nome === (z.l.inimigo || {}).nome).map(w => w.l.marca);
        return `<li><span class="quando">${esc(z.x.out.ficha.nome)} · cap. ${esc(String(z.l.cap))}, dia ${num(z.l.dia)}</span><span>${esc(z.l.aliado ? z.l.aliado.nome + ' ' + z.l.aliado.nv : '?')} contra ${esc(z.l.inimigo ? z.l.inimigo.nome + ' ' + z.l.inimigo.nv : '?')}
          <span class="onde">${esc(z.l.treinador || z.l.tipo)} · ${esc(String(z.l.ctx || ''))}${mais.length ? ' · passou de ' + Math.max(...mais) : ''}</span></span></li>`; }).join('')}</ol>`).join('')}
    ${(NOTAS.longasNota || []).map(n => `<p class="nota">${n}</p>`).join('')}</section>`;

  /* ---------- a seção de cada robô ---------- */
  const evento = p => {
    const q = `dia ${num(p.dia)} · ${String(p.hora == null ? '?' : p.hora).padStart(2, '0')}h`;
    let cls = 'p-' + p.t, txt = '';
    switch (p.t){
      case 'escolha': txt = `<span class="cena">${esc(p.cena)}</span> ${esc(p.texto)}`; break;
      case 'luta': {
        const r = {vitoria:'venceu', derrota:'perdeu', captura:'capturou', fuga:'fugiu', desistiu:'desistiu', gameover:'caiu'}[p.res] || p.res;
        cls += p.res === 'derrota' || p.res === 'desistiu' ? ' perdeu' : p.res === 'vitoria' ? ' venceu' : '';
        txt = `<b>${esc(r)}</b> ${esc(p.treinador || (p.capturou ? p.capturou : p.ultimo) || p.tipo)} <span class="onde">${esc((p.ctx && (p.ctx.lider || p.ctx.nome)) || '')} · ${uma(p.turnos || 0, 'turno')}${p.caidos ? ` · ${p.caidos} de ${p.de} no chão` : ''}</span>`; break;
      }
      case 'viagem': txt = `${esc(lugar(p.de))} → ${esc(lugar(p.para))}`; break;
      case 'mapa': txt = `no mapa: ${esc(p.f)}`; break;
      case 'compra': txt = `comprou ${esc((p.itens || []).join(', '))}`; break;
      case 'venda': txt = `vendeu ${esc((p.itens || []).join ? p.itens.join(', ') : p.itens)}`; break;
      case 'fechou': txt = `<b>fechou o capítulo</b> · time ${esc((p.time || []).join(', '))} · ${num(p.dinheiro)} ₽`; break;
      case 'posto': cls += ' p-fim'; txt = `<b>assumiu o posto: ${esc(p.nome && p.nome.replace(/\{([^{}|]*)\|([^{}|]*)\}/g, '$1'))}</b>${p.alvo ? ' (o que buscava)' : ''}`; break;
      case 'largou': txt = `<b>largou o posto</b> ${esc(p.cargo)}`; break;
      case 'nacional': cls += ' p-fim'; txt = `<b>Pokédex Nacional</b> ${esc(p.como || '')}`; break;
      case 'luta30': txt = `luta passou de ${p.marca} turnos: ${esc(p.aliado && p.aliado.nome)} contra ${esc(p.inimigo && p.inimigo.nome)} <span class="onde">${esc(p.treinador || p.tipo)}</span>`; break;
      case 'rival': txt = `o rival na saída: <b>${esc(p.quem)}</b>`; break;
      case 'linha': txt = `cena da linha: ${esc(p.titulo)}`; break;
      case 'chamada': txt = `atendeu o PokéNav: ${esc(p.resposta)}`; break;
      case 'janela': txt = `${esc(p.janela)}: ${esc(p.texto)}`; break;
      case 'evoluiu': txt = `<b>${esc(p.de)}</b> evoluiu para <b>${esc(p.para)}</b> no nível ${p.nivel}`; break;
      case 'tm': txt = `ensinou ${esc(p.nome)} a ${esc(p.quem)}`; break;
      case 'racao': txt = `Ração na mão: ${esc(p.quem)} (moral ${esc((p.moral || []).join(' → '))})`; break;
      case 'troca': txt = `trocou ${esc(p.deu)} por ${esc(p.veio)} com ${esc(p.com)}`; break;
      case 'ordem': txt = `pôs ${esc(p.quem)} na frente`; break;
      case 'pc': txt = `PC: guardou ${esc(p.guardou || '—')}, levou ${esc(p.levou || '—')}`; break;
      case 'pedra': txt = `usou ${esc(p.nome)}: ${esc(p.de)} → ${esc(p.para)}`; break;
      case 'segurar': txt = `deu ${esc(p.nome)} pra segurar a ${esc(p.quem)}`; break;
      case 'mochila': txt = `mochila entre as portas: ${esc(p.entre_portas)}`; break;
      case 'cadastro': txt = `fez o cadastro de treinador em ${esc(lugar(p.local))}`; break;
      case 'morte': txt = `<b>${esc(p.quem)}</b> morreu (${esc(p.especie)} ${p.nivel}) · ${esc(p.causa || '')}`; break;
      case 'fim': txt = `<b>${p.como === 'final' ? 'FINAL: ' + esc(p.titulo) : 'fim: ' + esc(p.como)}</b>`; break;
      case 'depois': txt = `continuou pela estrada depois do fim${p.situacao ? ' · ' + esc(p.situacao) : ''}`; break;
      default: txt = esc(JSON.stringify(p).slice(0, 200));
    }
    return `<li class="${cls}"><span class="quando">${q}</span><span class="o-que">${txt}</span></li>`;
  };
  /* um capítulo por bloco: luta comum seguida no mato vira uma linha, e
     viagem seguida vira um trajeto */
  const passoAPasso = x => {
    const ps = x.m.ps.filter(p => p.t !== 'luta30');
    const blocos = [];
    let atual = {cab:{titulo:'Capítulo 1 · a inscrição e a última manhã'}, itens:[]};
    for (const p of ps){
      if (p.t === 'capitulo'){ blocos.push(atual); atual = {cab:p, itens:[]}; continue; }
      atual.itens.push(p);
    }
    blocos.push(atual);
    return blocos.filter(b => b.itens.length || b.cab.num).map(b => {
      const li = [];
      for (let i = 0; i < b.itens.length; i++){
        const p = b.itens[i];
        if (p.t === 'luta' && p.tipo === 'selvagem' && !(p.ctx && p.ctx.de === 'história')){
          let j = i; const grupo = [];
          while (j < b.itens.length && b.itens[j].t === 'luta' && b.itens[j].tipo === 'selvagem' && !(b.itens[j].ctx && b.itens[j].ctx.de === 'história')){ grupo.push(b.itens[j]); j++; }
          if (grupo.length > 1){
            const c = grupo.filter(g => g.capturou), f = grupo.filter(g => g.res === 'fuga'), d = grupo.filter(g => g.res === 'derrota');
            li.push(`<li class="p-mato"><span class="quando">dia ${num(p.dia)}–${num(grupo[grupo.length - 1].dia)}</span><span class="o-que">${grupo.length} lutas no mato em ${esc(lugar(p.local))}: ${grupo.length - c.length - f.length - d.length} vitórias${c.length ? `, capturou ${esc(c.map(g => g.capturou).join(', '))}` : ''}${f.length ? `, ${f.length} fugas` : ''}${d.length ? `, ${d.length} derrotas` : ''}</span></li>`);
            i = j - 1; continue;
          }
        }
        if (p.t === 'viagem'){
          let j = i; const rota = [p.de];
          while (j < b.itens.length && b.itens[j].t === 'viagem'){ rota.push(b.itens[j].para); j++; }
          if (rota.length > 2){ li.push(`<li class="p-viagem"><span class="quando">dia ${num(p.dia)}</span><span class="o-que">${rota.map(r => esc(lugar(r))).join(' → ')}</span></li>`); i = j - 1; continue; }
        }
        if (p.t === 'mapa'){
          let j = i; while (j + 1 < b.itens.length && b.itens[j + 1].t === 'mapa' && b.itens[j + 1].f === p.f) j++;
          if (j > i){ li.push(`<li class="p-mapa"><span class="quando">dia ${num(p.dia)}</span><span class="o-que">no mapa: ${esc(p.f)}<span class="vezes">×${j - i + 1}</span></span></li>`); i = j; continue; }
        }
        li.push(evento(p));
      }
      const c = b.cab, lutas = b.itens.filter(p => p.t === 'luta').length;
      const tit = c.num ? `${esc(capDe(c.num).nome)}: ${esc(c.titulo || capDe(c.num).titulo)}` : esc(c.titulo);
      const meta = c.num ? `${esc(c.onde || '')} · área ${esc(String(c.nivelArea || '?'))} · chegou no dia ${num(c.dia)} · time ${esc((c.time || []).join('/'))} · ${uma(lutas, 'luta')}` : uma(lutas, 'luta');
      return `<details class="cap"><summary><span class="cap-tit">${tit}</span><span class="cap-meta">${meta}</span></summary><ol class="passos">${li.join('')}</ol></details>`;
    }).join('');
  };

  const formacao = x => {
    const ev = x.m.ps.filter(p => (p.t === 'luta' && p.capturou) || ['evoluiu', 'pc', 'troca', 'morte', 'pedra'].includes(p.t));
    const dexDe = nome => { const k = Object.keys(base.dexNome).find(k => base.dexNome[k] === String(nome || '').replace(/ \d+$/, '').replace(/^.*\(/, '').replace(/\).*$/, '')); return k ? +k : null; };
    return ev.slice(0, 160).map(p => {
      let cls = 'f-captura', txt = '', dex = null;
      if (p.t === 'luta'){ dex = dexDe(p.capturou); txt = `capturou <b>${esc(p.capturou)}</b> em ${esc(lugar(p.local))}${p.bolas ? ` (${uma(p.bolas, 'Pokébola')})` : ''}`; }
      else if (p.t === 'evoluiu'){ cls = 'f-evoluiu'; dex = dexDe(p.para); txt = `<b>${esc(p.de)}</b> evoluiu para <b>${esc(p.para)}</b> no nível ${p.nivel}`; }
      else if (p.t === 'pc'){ cls = 'f-pc'; txt = `PC: guardou ${esc(p.guardou || '—')}, levou ${esc(p.levou || '—')}`; }
      else if (p.t === 'troca'){ cls = 'f-pc'; txt = `trocou ${esc(p.deu)} por <b>${esc(p.veio)}</b> com ${esc(p.com)}`; }
      else if (p.t === 'pedra'){ cls = 'f-evoluiu'; dex = dexDe(p.para); txt = `${esc(p.nome)}: ${esc(p.de)} → <b>${esc(p.para)}</b>`; }
      else if (p.t === 'morte'){ cls = 'f-morte'; dex = dexDe(p.especie); txt = `<b>${esc(p.quem)}</b> morreu · ${esc(p.causa || '')}`; }
      const im = dex && icone(dex) ? `<img src="${icone(dex)}" alt="" width="32" height="24">` : '<span class="sem"></span>';
      return `<li class="${cls}">${im}<span class="quando">cap. ${esc(String(p.cap))} · dia ${num(p.dia)}</span><span>${txt}</span></li>`;
    }).join('');
  };

  const secao = x => {
    const f = x.out.ficha, m = x.m, J = x.J, jg = x.jogo || {}, a = comoAcabou(x);
    const st = jg.status || f.status || {};
    const nomesSt = {forca:'Força', percepcao:'Percepção', intelecto:'Intelecto', carisma:'Carisma', sorte:'Sorte', resistencia:'Resistência'};
    const maxSt = Math.max(5, ...Object.values(st).map(Number).filter(n => !isNaN(n)));
    const status = Object.entries(st).filter(([, v]) => typeof v === 'number').map(([k, v]) =>
      `<div class="st${k === (jg.forte || f.forte) ? ' forte' : ''}"><span>${esc(nomesSt[k] || k)}${k === (jg.forte || f.forte) ? '<i>forte</i>' : ''}</span><b>${v}</b><span class="barra"><span style="width:${Math.round(100 * v / maxSt)}%"></span></span></div>`).join('');
    const ini = f.inicial || {}, iniA = ini.agora;
    const gins = base.ginasios.map(g => { const v = m.ginasios[g.id];
      return `<li class="${v && v.venceu ? 'tem' : 'falta'}">${insigniaImg(g.id) ? `<img src="${insigniaImg(g.id)}" alt="" width="28" height="28">` : ''}<span>${esc(g.insignia.replace(/^Insígnia /, ''))}
        <small>${esc(g.lider)} · ${esc(g.cidade)}</small>${v && v.venceu ? `<small class="det">dia ${num(v.venceu.dia)}, cap. ${esc(String(v.venceu.cap))}, ${uma(v.venceu.turnos || 0, 'turno')}${v.venceu.tent > 1 ? ` · ${v.venceu.tent} tentativas` : ''}</small>` : v ? `<small class="det">${uma(v.tent, 'tentativa')}, sem vitória</small>` : ''}</span></li>`; }).join('');
    const postoQ = jg.quadro ? jg.quadro.find(z => z.id === x.r.cargo) : null;
    const t = postoTomado(x, x.r.cargo);
    const outrosP = m.postos.filter(p => p.cargo !== x.r.cargo);
    const rede = f.rede;
    const blocoPosto = `<div class="bloco posto"><h3>O posto</h3>
      <p class="j-veredito"><span class="selo">${t ? 'Assumiu' : 'Não chegou'}</span><b>${esc(x.g(cargoDe(x.r.cargo).nome))}</b> <span class="onde">${esc(cargoDe(x.r.cargo).orgao || '')} · ${esc(cargoDe(x.r.cargo).lugar || '')}</span></p>
      ${t ? `<p class="nota">Assumiu no capítulo ${esc(capDe(t.cap).nome.replace(/^Capítulo /, ''))}, dia ${num(t.dia)}, em ${esc(lugar(t.local))}.</p>` : ''}
      ${postoQ ? `<ul class="j-itens">${postoQ.pedidos.map(p => `<li class="${p.ok ? 'sim' : 'nao'}"><span class="marca">${p.ok ? '✓' : '✗'}</span><span>${esc(x.g(p.t))}</span></li>`).join('')}${!t && postoQ.motivo ? `<li class="nao"><span class="marca">✗</span><span>${esc(postoQ.motivo)}</span></li>` : ''}</ul>` : ''}
      ${outrosP.length ? `<p class="nota">Outros postos: ${outrosP.map(p => `${esc(x.g(cargoDe(p.cargo).nome))} (cap. ${esc(String(p.cap))}, dia ${num(p.dia)})`).join('; ')}.</p>` : ''}
      ${m.largou.length ? `<p class="nota">Largou: ${m.largou.map(p => `${esc(x.g(cargoDe(p.cargo).nome))} (dia ${num(p.dia)})`).join('; ')}.</p>` : ''}
      ${rede ? `<p class="nota">Na rede: degrau ${rede.escalao}, ${rede.pontos || 0} pontos de serviço${rede.fora ? ', e já não é mais dela' : ''}${rede.provas && Object.keys(rede.provas).length ? ` · provas: ${Object.entries(rede.provas).map(([k, v]) => `${k} ${v && v.venceu ? 'vencida' : 'perdida'}`).join(', ')}` : ''}.</p>` : ''}
      ${f.lei && (f.lei.avisos || f.lei.ordem || f.lei.detencao) ? `<p class="nota">Com a Patrulha: ${uma(f.lei.avisos, 'aviso')}${f.lei.ordem ? ', ordem de devolução' : ''}${f.lei.detencao ? ', ordem de detenção' : ''}.</p>` : ''}
    </div>`;
    const elite = m.entradas.length ? `<div class="bloco elite${f.campeao ? ' campeao' : ''}"><h3>A Elite</h3>
      <p class="e-res">${f.campeao ? '<span class="selo">Campeão</span>' : ''}<span>${uma(m.entradas.length, 'entrada')} na ala; a mais longa passou de ${Math.max(...m.entradas.map(e => e.portas.filter(p => p.res === 'vitoria').length))} das quatro portas.</span></p>
      <ol class="elite-l">${m.entradas.map(e => `<li><span class="quando">${esc(capDe(e.cap).nome)} · dia ${num(e.dia)}</span><span class="portas">${e.portas.map(p =>
        `<span class="porta ${p.res === 'vitoria' ? 'v' : 'd'}${p.i === 5 ? ' camp' : ''}" title="${uma(p.turnos || 0, 'turno')} · ${p.caidos || 0} de ${p.de || '?'} no chão no fim">${p.res === 'vitoria' ? '✓' : '✗'} ${esc(String(p.quem).replace(/^(Elite|Campeão) /, ''))}</span>`).join('')}</span></li>`).join('')}</ol></div>` : '';
    const pokes = (f.time || []).map(p => `<li class="${p.morto ? 'morto' : ''}">${icone(p.dex) ? `<img src="${icone(p.dex)}" alt="" width="40" height="30">` : ''}<div>
      <b>${esc(p.apelido || p.especie)}</b>${p.apelido ? ` <small>${esc(p.especie)}</small>` : ''}${iniA && iniA.dex === p.dex && iniA.nivel === p.nivel ? ' <small class="selo-ini">inicial</small>' : ''}
      <span class="nv">Nv ${p.nivel}</span><span class="mini">${p.genero === 'm' ? '♂' : p.genero === 'f' ? '♀' : ''} ${esc(p.natureza || '')} · HP ${p.hp}/${p.hpMax} · moral ${p.moral}${p.segurando ? ' · segura ' + esc(p.segurando) : ''}${p.shiny ? ' · brilhante' : ''}</span>
      <span class="golpes">${(p.golpes || []).map(g => `<i>${esc(g)}</i>`).join('')}</span></div></li>`).join('');
    const pc = (f.pc || []).map(p => `<li>${icone(p.dex) ? `<img src="${icone(p.dex)}" alt="" width="32" height="24">` : ''}<span class="pc-n"><b>${esc(p.apelido || p.especie)}</b>${p.apelido ? `<small>${esc(p.especie)}</small>` : ''}</span><span class="nv">Nv ${p.nivel}</span></li>`).join('');
    const dif = [];
    /* o capítulo mais longo, em dias */
    const durs = m.caps.map((c, i) => ({c, dias:(m.caps[i + 1] ? m.caps[i + 1].dia : f.dia) - c.dia})).sort((u, v) => v.dias - u.dias);
    if (durs[0] && durs[0].dias > 20) dif.push(`<b>${esc(capDe(durs[0].c.num).nome)}, ${num(durs[0].dias)} dias:</b> o capítulo mais longo da jornada.`);
    const derrotas = {};
    m.lutas.filter(l => l.res === 'derrota' || l.res === 'desistiu').forEach(l => { const k = l.treinador || (l.ctx && l.ctx.lider) || 'selvagem'; derrotas[k] = (derrotas[k] || 0) + 1; });
    const piores = Object.entries(derrotas).sort((u, v) => v[1] - u[1]).slice(0, 3);
    if (piores.length && piores[0][1] >= 2) dif.push(`<b>Quem mais venceu ${x.mulher ? 'ela' : 'ele'}:</b> ${piores.map(([k, n]) => `${esc(k)} (${n})`).join(', ')}.`);
    if (m.mortes.length) dif.push(`<b>${uma(m.mortes.length, 'morte')}:</b> ${m.mortes.map(p => `${esc(p.quem)} (${esc(p.especie)} ${p.nivel}, cap. ${esc(String(p.cap))})`).join(', ')}.`);
    if (m.longas.length) dif.push(`<b>${uma(m.longas.filter(l => l.marca === 30).length, 'luta')} de mais de 30 turnos</b>${m.longas.some(l => l.marca >= 60) ? `, ${m.longas.filter(l => l.marca === 60).length} de mais de 60` : ''}.`);
    ((NOTAS.robos || {})[x.id] || {}).dificuldades && dif.push(...NOTAS.robos[x.id].dificuldades);
    const gostos = jg.gostos || (f.gostos && f.gostos.texto) || '';
    const desgostos = jg.desgostos || (f.desgostos && f.desgostos.texto) || '';
    const casa = jg.casa || f.casa;
    return `<section class="robo" id="${x.id}">
    <header class="robo-cab"><div class="robo-id">
      <span class="eyebrow">${esc(J.nome || x.r.jeito)} · ${esc(NOME_DO_JEITO_META[x.r.meta] || x.r.meta)} · busca ${esc(x.g(cargoDe(x.r.cargo).nome))}</span>
      <h2>${esc(f.nome)}</h2>
      <p class="acabou ${a.cls}"><span class="selo">${a.cls === 'final' ? 'Final' : a.cls === 'morte' ? 'Morte' : 'Tempo'}</span><b>${esc(a.txt)}</b>${a.citacao ? ` <span class="citacao">${esc(a.citacao.slice(0, 220))}</span>` : ''}</p>
      ${m.depois.length ? `<p class="acabou"><span class="selo">Depois do fim</span>continuou pela estrada${m.depois[0].situacao ? ': ' + esc(m.depois[0].situacao) : ''}.</p>` : ''}
    </div><dl class="numeros">
      <div><dt>Capítulos</dt><dd>${(f.fechados || []).length}</dd></div><div><dt>Insígnias</dt><dd>${(f.insignias || []).filter(i => !/Campeão/.test(i)).length}</dd></div>
      <div><dt>Lutas</dt><dd>${num(m.lutas.length)}</dd></div><div><dt>Derrotas</dt><dd class="ruim">${num(m.D)}</dd></div>
      <div><dt>Capturas</dt><dd>${num(m.capturas.length)}</dd></div><div><dt>Dias</dt><dd>${num(f.dia)}</dd></div></dl></header>
    <div class="cartao"><div class="cartao-foto">${jg.foto ? `<img src="${jg.foto}" alt="Foto de ${esc(f.nome)}" width="80" height="80">` : ''}</div>
      <div class="cartao-dados"><dl class="campos">
        <div><dt>Gênero</dt><dd>${esc(f.genero)}</dd></div><div><dt>Cidade natal</dt><dd>${esc(f.cidade)}</dd></div>
        <div><dt>Quem ficou em casa</dt><dd>${esc(casa ? [casa.nome, casa.quem || casa.parentesco].filter(Boolean).join(', ') : '—')}</dd></div>
        <div><dt>Jeito</dt><dd>${esc(x.g(jg.personalidade || f.personalidade || '—'))}</dd></div>
        <div><dt>Objetivo</dt><dd>${esc(NOME_DO_JEITO_META[x.r.meta] || x.r.meta)}${jg.objetivo || f.objetivo ? `<small>${esc(x.g(jg.objetivo || f.objetivo))}</small>` : ''}</dd></div>
        <div><dt>Gosta de</dt><dd>${esc(gostos || '—')}</dd></div><div><dt>Não gosta de</dt><dd>${esc(desgostos || '—')}</dd></div>
        <div><dt>Reputação</dt><dd>${esc(jg.rep || x.g(f.reputacao) || '—')} <small>lado ${f.eixo === 'ruim' ? 'ruim' : 'bom'}</small></dd></div>
        <div><dt>Via · linha</dt><dd>${esc(f.via || '—')} · ${esc(f.linha || '—')}</dd></div>
        <div><dt>Posto</dt><dd>${esc(jg.cargo || x.g(f.cargo) || '—')}</dd></div>
        <div><dt>Dinheiro no fim</dt><dd>${num(f.dinheiro)} ₽</dd></div>
        <div><dt>Pokédex</dt><dd>${f.pokedex ? `${f.pokedex.catalogados} catalogados · ${f.pokedex.vistos} vistos${f.pokedex.nacional ? '<small>com a Pokédex Nacional</small>' : ''}` : '—'}</dd></div>
        <div><dt>Inicial</dt><dd>${x.r.inicial === 'classico' ? 'um dos três clássicos' : 'o que já estava em casa'}</dd></div>
        <div><dt>Tempo de jogo do robô</dt><dd>${num(Math.round(x.out.minutos || 0))} min reais <small>${num(f.dia)} dias de jornada · ${uma(x.r.etapas, 'etapa')}</small></dd></div>
      </dl><div class="status">${status}</div></div></div>
    <div class="bloco jeito ${x.ver}"><h3>O jeito: o que se esperava e o que fez</h3>
      <p class="j-veredito"><span class="selo">${VER[x.ver][0]}</span><b>${VER[x.ver][1]}</b></p>
      <p class="j-esperado"><span class="eyebrow">${esc(J.nome || x.r.jeito)} · desenhado pra</span>${esc(descreveJeito(J))}</p>
      <ul class="j-itens">${x.itens.map(i => `<li class="${i.cls}"><span class="marca" aria-label="${i.cls === 'sim' ? 'Fez' : i.cls === 'parte' ? 'Em parte' : 'Não fez'}">${i.cls === 'sim' ? '✓' : i.cls === 'parte' ? '~' : '✗'}</span><span><b>${esc(i.rot)}:</b> ${esc(i.txt)}</span></li>`).join('')}</ul>
      ${((NOTAS.robos || {})[x.id] || {}).nota ? `<p class="nota">${NOTAS.robos[x.id].nota}</p>` : ''}</div>
    ${blocoPosto}
    <div class="blocos"><div class="bloco inicial"><h3>Inicial</h3><div class="ini">
      ${frente((iniA && iniA.dex) || ini.dex) ? `<img class="frente" src="${frente((iniA && iniA.dex) || ini.dex)}" alt="${esc((iniA && iniA.especie) || ini.especie || '')}" width="96" height="96">` : ''}
      <div><b>${esc(ini.especie || '?')}</b>${iniA && iniA.especie !== ini.especie ? ` <span class="seta">→</span> <b>${esc(iniA.especie)}</b>` : ''}
      <p>${iniA ? `Nível ${iniA.nivel} no fim${iniA.nome && iniA.nome !== iniA.especie ? `, com o apelido ${esc(iniA.nome)}` : ''}.` : 'Não está mais no cinto nem no PC.'}
      ${x.r.inicial === 'classico' ? 'Um dos três clássicos, escolhido no capítulo 1.' : 'Sorteado na inscrição pela tabela da casa (“O que já estava em casa”).'}</p></div></div></div>
      <div class="bloco insignias"><h3>Ginásios</h3><ul class="ins">${gins}</ul></div></div>
    ${elite}
    <div class="bloco time"><h3>Time no fim</h3><ul class="pokes">${pokes}</ul>
      ${pc ? `<h4 class="sub-pc">Ficaram no PC <small>${uma((f.pc || []).length, 'Pokémon', 'Pokémon')}</small></h4><ul class="pc-lista">${pc}</ul>` : ''}
      ${(f.cemiterio || []).length ? `<h4 class="sub-pc">Cemitério <small>${uma(f.cemiterio.length, 'Pokémon', 'Pokémon')}</small></h4><ul class="pc-lista">${f.cemiterio.map(p => `<li><span class="pc-n"><b>${esc(p.nome)}</b><small>${esc(p.especie)} · ${esc(p.causa || '')}</small></span></li>`).join('')}</ul>` : ''}
    </div>
    <div class="bloco formou"><h3>Como o time se formou</h3><ol class="formacao">${formacao(x)}</ol></div>
    ${dif.length ? `<div class="bloco dif"><h3>Principais dificuldades</h3><ul>${dif.map(d => `<li>${d}</li>`).join('')}</ul></div>` : ''}
    <div class="bloco passo"><h3>Passo a passo</h3><p class="nota">Um capítulo por bloco. Lutas comuns seguidas no mato viram uma linha, e viagens seguidas viram um trajeto.</p>${passoAPasso(x)}</div>
    <div class="bloco"><details class="diario"><summary><h3>O diário do jogo</h3><span class="cap-meta">${uma(((jg.diario || f.diario) || []).length, 'linha')}</span></summary>
      <ol class="diario-l">${((jg.diario || f.diario) || []).slice(-400).map(l => `<li><span class="quando"></span><span>${esc(x.g(typeof l === 'string' ? l : (l.texto || JSON.stringify(l))))}</span></li>`).join('')}</ol></details></div>
  </section>`;
  };

  const css = fs.readFileSync(path.join(__dirname, 'relatorio-de-robos.css'), 'utf8');
  const extra = `
.bloco.postos .final, .bloco.nacional .final{color:var(--amarelo)}
.bloco.posto{border-left:4px solid var(--borda-forte)}
.bloco.posto .j-veredito .selo{background:var(--painel-2);border:1px solid var(--borda-forte);color:var(--fraco)}
.p-posto, .p-nacional{border-left-color:var(--amarelo)}
.p-largou{border-left-color:var(--vermelho)}
.p-luta30{border-left-color:var(--roxo)}
.bloco.postos td{white-space:normal;min-width:9rem}
.bloco.postos td.passagem{max-width:22rem}
.bloco.postos td.passagem small{color:var(--fraco)}
`;
  const titulo = NOTAS.titulo || 'Robôs de Kanto III';
  const html = `<title>${esc(titulo)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Press+Start+2P&display=swap">
<style>
${css}${extra}</style>
<div class="pagina">
  <header class="topo">
    <span class="eyebrow">${esc(NOTAS.eyebrow || 'PokéRPG · robô jogador · terceira rodada')}</span>
    <h1>${esc(NOTAS.h1 || 'Robôs de Kanto, terceira rodada')}</h1>
    ${(NOTAS.intro || []).map(p => `<p>${p}</p>`).join('\n')}
  </header>
  ${tabela}
  ${blocoPostos()}
  ${quadroJeitos}
  ${NOTAS.geral ? `<section class="bloco geral"><h3>${esc(NOTAS.geralTitulo || 'O que os quinze mostraram')}</h3><ul>${NOTAS.geral.map(g => `<li>${g}</li>`).join('')}</ul></section>` : ''}
  ${blocoNacional}
  ${blocoLongas}
  ${NOTAS.defeitos ? `<section class="bloco geral"><h3>Defeitos achados e consertados durante a rodada</h3><ul>${NOTAS.defeitos.map(g => `<li>${g}</li>`).join('')}</ul></section>` : ''}
  ${robos.map(secao).join('\n')}
  <footer>${NOTAS.rodape || 'Gerado por ferramentas/relatorio-de-robos.js a partir das saídas dos robôs (ferramentas/rodada-de-robos.js).'}</footer>
</div>`;
  fs.writeFileSync(SAIDA, html);
  console.log('relatório:', SAIDA, Math.round(html.length / 1024) + ' KB', robos.length + ' robôs');
})().catch(e => { console.error(e); process.exit(1); });
