/* ============================================================
   ROBÔ JOGADOR
   Joga o jogo pela própria tela, como gente: lê a luta e escolhe o
   golpe que mais machuca, troca quem está em desvantagem ou com
   pouco HP (recua), usa Potion, foge de selvagem muito acima, captura
   pra completar o time, cura no Centro ou em casa, compra Potion e
   Pokébola quando tem dinheiro, treina quando o time está abaixo do
   capítulo seguinte e segue a história. Nada de mexer no estado por
   fora: tudo passa pelas funções que os botões chamam.

   Em cada tela ele lê o texto e anota o que parece quebrado:
   marca de gênero sem resolver, "undefined", "NaN", HTML vazando,
   "bicho"/"bola" fora do lugar, balão sem nome.

   Uso:  node ferramentas/bot-jogador.js [minutos] [saida.json]
         CIDADE=Cerulean GENERO=Mulher node ferramentas/bot-jogador.js 20
   ============================================================ */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const MIN = +(process.argv[2] || 15);
const OUT = process.argv[3] || path.join(__dirname, '..', 'bot-jogador.json');
const CIDADE = process.env.CIDADE || 'Pallet';
const GENERO = process.env.GENERO || 'Mulher';
const RAIZ = 'file://' + path.resolve(__dirname, '..', 'index.html');

const SUSPEITO = [
  [/\{[^{}]*\|[^{}]*\}/, 'marca de gênero sem resolver'],
  [/\bundefined\b/, 'undefined'],
  [/\bNaN\b/, 'NaN'],
  [/\[object /, '[object]'],
  [/<\/?(p|div|span|b)\b/, 'HTML vazando'],
  [/\bbichos?\b/i, '"bicho"'],
  [/(?<![A-Za-zÀ-ÿ-])bolas?(?![A-Za-zÀ-ÿ-])/i, '"bola" sozinha']
];

(async () => {
  const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--no-sandbox'] });
  const page = await browser.newPage({ viewport:{width:1000, height:1100} });
  const erros = [], achados = {}, log = [];
  const anota = (tipo, txt) => { const k = tipo + ' :: ' + txt.slice(0, 140); achados[k] = (achados[k] || 0) + 1; };
  page.on('pageerror', e => erros.push(e.message + ' @ ' + (e.stack || '').split('\n').slice(1, 3).join(' | ')));
  page.on('dialog', d => /Soltar|permanente|Vender|Largar/.test(d.message()) ? d.dismiss() : d.accept());
  await page.goto(RAIZ);
  await page.waitForTimeout(400);
  await page.locator('button:has-text("Começar"), button:has-text("Nova jornada")').first().click();
  await page.waitForTimeout(200);
  await page.fill('#f-nome', 'Íris');
  await page.locator(`#f-genero button[data-v="${GENERO}"]`).click();
  await page.fill('#f-personalidade', 'teimosa, leal, curiosa').catch(() => {});
  await page.fill('#f-objetivo', 'Vencer a Liga e ser campeã').catch(() => {});
  await page.fill('#f-gosta', 'mar, Pokémon de fogo').catch(() => {});
  await page.fill('#f-nao-gosta', 'escuro, Zubat').catch(() => {});
  await page.selectOption('#f-cidade', CIDADE).catch(() => {});
  await page.locator('button:has-text("Sair de casa")').click();
  await page.waitForTimeout(400);

  /* o que aconteceu, pra conferir depois */
  await page.evaluate(() => {
    window.__reg = {lutas:[], caps:[]};
    const fb = Jogo.finalizarBatalha.bind(Jogo);
    Jogo.finalizarBatalha = function(fim){
      try { const d = Estado.dados, B = Batalha;
        __reg.lutas.push({cap:d.capitulo, res:fim.resultado, tipo:B.tipo, ini:B.inimigo ? B.inimigo.nome + ' ' + B.inimigo.nivel : '?',
          top:Math.max(0, ...d.time.map(p => p.nivel)), local:d.local, turnos:B.turno});
      } catch(e){}
      return fb(fim);
    };
    const fc = Historia.fecharCapitulo.bind(Historia);
    Historia.fecharCapitulo = function(){ const r = fc();
      try { const d = Estado.dados; __reg.caps.push({cap:d.capitulo, dia:d.relogio.dia, ins:d.insignias.length,
        time:d.time.map(p => p.nome + ' ' + p.nivel), dinheiro:d.jogador.dinheiro}); } catch(e){}
      return r; };
  });

  const lerTela = async () => {
    const t = await page.evaluate(() => {
      const partes = [...document.querySelectorAll('#app .narrativa, #app .avisos, #modal, #app .cap-cabecalho, #log')]
        .map(e => e.innerText);
      const anon = [...document.querySelectorAll('.fala.anonima')].length;
      return {txt:partes.join('\n'), anon};
    }).catch(() => ({txt:'', anon:0}));
    for (const [re, nome] of SUSPEITO){
      const m = t.txt.match(re);
      if (m){ const i = t.txt.indexOf(m[0]); anota(nome, t.txt.slice(Math.max(0, i - 60), i + 60).replace(/\s+/g, ' ')); }
    }
    if (t.anon) anota('balão sem nome', t.txt.slice(0, 80).replace(/\s+/g, ' '));
  };

  let passos = 0, parado = 0, ultima = '', empacou = 0, ultimoRetrato = '';
  const t0 = Date.now();
  while ((Date.now() - t0) < MIN * 60000 && passos++ < 20000){
    if (erros.length > 8) break;
    await page.waitForTimeout(40);
    if (await page.evaluate(() => !!(Jogo.encenando || Jogo.animandoBola)).catch(() => false)){ await page.waitForTimeout(120); continue; }
    if (passos % 5 === 0) await lerTela();
    if (passos % 100 === 0){
      const s = await page.evaluate(() => ({c:Estado.dados.capitulo, l:Estado.dados.local, h:Relogio.texto(),
        t:Estado.dados.time.map(p => p.nivel).join('/'), $:Estado.j.dinheiro, ins:Estado.dados.insignias.length,
        modo:Estado.dados.modo, luta:!!Batalha.ativo, enc:!!Jogo.encenando, bola:!!Jogo.animandoBola,
        tela:(document.querySelector('#app') || {innerText:''}).innerText.replace(/\s+/g, ' ').slice(0, 90)}));
      console.log(`[${Math.round((Date.now() - t0) / 1000)}s] ${JSON.stringify(s)}`);
      log.push(s);
      /* empacou: o mesmo retrato três vezes seguidas é tela que não anda */
      const retrato = JSON.stringify([s.c, s.l, s.t, s.$, s.luta, s.tela.replace(/\d+h · \S+ do dia \d+/, '')]);
      empacou = retrato === ultimoRetrato ? empacou + 1 : 0; ultimoRetrato = retrato;
      if (empacou === 2){
        const dump = await page.evaluate(() => ({
          app:(document.querySelector('#app') || {innerText:''}).innerText.slice(0, 900),
          modal:(document.querySelector('#modal') || {innerText:''}).innerText.slice(0, 400),
          batalha:Batalha.ativo ? {tipo:Batalha.tipo, fase:Batalha.fase, turno:Batalha.turno, aliado:Batalha.aliado && Batalha.aliado.nome + ' ' + Batalha.aliado.hp,
            inimigo:Batalha.inimigo && Batalha.inimigo.nome + ' ' + Batalha.inimigo.hp, botoes:[...document.querySelectorAll('#app button')].map(b => b.innerText.trim() + (b.disabled ? '(off)' : '')).slice(0, 20)} : null
        })).catch(e => ({erro:e.message}));
        console.log('EMPACOU', JSON.stringify(dump));
        anota('empacou', JSON.stringify(dump).slice(0, 140));
        log.push({empacou:dump});
      }
    }
    if (await page.locator('.gameover').count()){ log.push({gameover:await page.locator('.gameover').innerText()}); break; }
    if (await page.locator('.final').count()) break;

    /* apelido: às vezes dá, às vezes não */
    if (await page.locator('#campo-apelido').count()){
      if (Math.random() < 0.5){ await page.fill('#campo-apelido', 'Faísca'); await page.locator('#modal button:has-text("Dar o apelido")').click(); }
      else await page.locator('#modal button:has-text("Não")').click();
      continue;
    }
    if (await page.locator('.aprender-op').count()){ await page.locator('.aprender-op').first().click(); continue; }
    if (await page.locator('#modal .escolha:has-text("Nv")').count() && await page.evaluate(() => Batalha.ativo).catch(() => false)){
      await page.locator('#modal .escolha:has-text("Nv")').first().click({timeout:3000}).catch(() => {}); continue;
    }
    if (await page.locator('.continuar-batalha').count()){ await page.locator('.continuar-batalha').first().click({timeout:3000}).catch(() => {}); await page.waitForTimeout(120); continue; }
    if (await page.locator('#modal .evo').count()){
      if (await page.locator('#evo-seguir:visible').count()) await page.locator('#evo-seguir').click(); else await page.waitForTimeout(300);
      continue;
    }

    /* luta: lê a situação e decide */
    if (await page.evaluate(() => Batalha.ativo && !!document.querySelector('.acoes-combate, #acoes')).catch(() => false)){
      const a = await page.evaluate(() => {
        const B = Batalha, p = B.aliado, alvo = B.inimigo, d = Estado.dados;
        if (!p || !alvo) return null;
        if (B.fase === 'ameaca') return {tipo:'fugirAmeaca'};
        const golpeBom = (quem) => {
          let melhor = -1, idx = 0;
          quem.golpes.forEach((g, i) => {
            if (g.pp <= 0) return; const G = GOLPES[g.nome] || {}; if (G.c === 'status') return;
            const ef = eficacia(G.t, alvo.tipos); const PR = PR_GOLPE[g.nome] || {};
            const s = ef === 0 ? -1 : ((PR.p || 1) + (quem.tipos.includes(G.t) ? 1 : 0)) * ef * ((G.a || 100) / 100);
            if (s > melhor){ melhor = s; idx = i; }
          });
          return {idx, melhor};
        };
        /* selvagem muito acima: foge */
        if (B.tipo === 'selvagem' && alvo.nivel > p.nivel + 8 && B.fuga !== false) return {tipo:'fugir'};
        /* captura pra completar o time */
        const bola = ['Ultra Ball', 'Great Ball', 'Poké Ball'].find(n => Estado.contaItem(n) > 0);
        if (B.tipo === 'selvagem' && bola && d.time.length < 6 && alvo.hp <= alvo.hpMax * 0.5 && !alvo.lendario) return {tipo:'bola', nome:bola};
        /* cura quem está quase caindo */
        const pot = ['Hyper Potion', 'Super Potion', 'Potion'].find(n => Estado.contaItem(n) > 0);
        if (pot && p.hp <= p.hpMax * 0.25 && p.hp > 0) return {tipo:'item', nome:pot, alvoUid:p.uid};
        /* recua: se o golpe dele é ruim e tem alguém melhor no banco */
        /* Vontade: com pouco HP, esquiva o próximo golpe */
        if (p.hp <= p.hpMax * 0.5 && vontadeDe(p) >= 2 && B.podeGastarVontade('esquiva')) B.gastarVontade('esquiva');
        const meu = golpeBom(p);
        const banco = d.time.filter(x => x.uid !== p.uid && x.hp > x.hpMax * 0.4 && !x.morto);
        const melhorBanco = banco.map(x => ({x, s:golpeBom(x).melhor})).sort((u, v) => v.s - u.s)[0];
        if (melhorBanco && (meu.melhor < 1 || p.hp <= p.hpMax * 0.2) && melhorBanco.s > meu.melhor * 1.5 && !(B.estAliado && B.estAliado.presoTurnos))
          return {tipo:'trocar', uid:melhorBanco.x.uid};
        return {tipo:'golpe', indice:meu.idx};
      }).catch(() => null);
      if (a){ await page.evaluate(x => { UI.modoBatalha = 'menu'; Jogo.acaoBatalha(x); }, a).catch(e => erros.push('acao: ' + e.message)); await page.waitForTimeout(150); continue; }
    }
    /* troca obrigatória depois de desmaio */
    if (await page.locator('#modal .escolha:has-text("Nv")').count() && await page.evaluate(() => Batalha.ativo).catch(() => false)){
      await page.locator('#modal .escolha:has-text("Nv")').first().click(); continue;
    }

    /* fim de capítulo: distribui pontos e segue */
    if (await page.locator('#btn-seguir').count()){
      const ups = page.locator('button[id^="up-"]:not([disabled])');
      for (let i = 0; i < 4 && await ups.count(); i++){ await ups.first().click(); await page.waitForTimeout(60); }
      await page.locator('#btn-seguir').click(); await page.waitForTimeout(200); continue;
    }

    /* no mapa: cuidar do time, comprar, treinar, seguir a história */
    const noMapa = await page.evaluate(() => Estado.dados.modo === 'mundo' && !Batalha.ativo && !!document.querySelector('.porta, button[onclick^="Exploracao.viajar"]')).catch(() => false);
    if (noMapa){
      if (await page.locator('#modal').count()) await page.evaluate(() => UI.fecharModal(true));
      const dec = await page.evaluate(() => {
        const d = Estado.dados, L = Mundo.atual(), id = Mundo.id();
        const vivos = d.time.filter(p => !p.morto);
        const hp = vivos.reduce((s, p) => s + Math.max(0, p.hp), 0) / Math.max(1, vivos.reduce((s, p) => s + p.hpMax, 0));
        const afz = afazeresDoLocal().map(a => a.id);
        if (hp < 0.6 || !Estado.primeiroApto()){
          if (afz.includes('casa')) return {f:'casa'};
          if (afz.includes('centro')) return {f:'centro'};
          if (ehNoite()) return {f:'acampar'};
          /* sem cura aqui e de dia: anda até o Centro mais perto */
          const centros = Object.keys(LOCAIS).filter(k => Exploracao.temCentro(LOCAIS[k]) && !travaDaPassagem(id, k))
            .map(k => caminhoEntre(id, k)).filter(c => c && c[1] && !travaDaPassagem(id, c[1])).sort((x, y) => x.length - y.length);
          if (centros.length) return {f:'viajar', id:centros[0][1]};
        }
        /* compra o básico */
        if (afz.includes('loja') && d.jogador.dinheiro > 1500 && (Estado.contaItem('Potion') < 3 || Estado.contaItem('Poké Ball') < 5)) return {f:'loja'};
        const destino = Historia.proximoDestino && Historia.proximoDestino();
        const cap = destino ? Historia.capitulo(destino.num) : null;
        const alvo = Math.max(L.nivel || 5, cap ? (cap.nivelArea || 0) - 2 : 0);
        if (nivelDeReferencia() < alvo && L.tipo !== 'cidade' && d.treinoDia !== d.relogio.dia && vivos.some(p => p.nivel < (L.nivel || 5) + 5)) return {f:'treinar'};
        if (nivelDeReferencia() < alvo && L.tipo !== 'cidade') return {f:'procurar'};
        if (Historia.arcoAqui() && !travaDoCapitulo(Historia.arcoAqui().num)) return {f:'arco'};
        const g = GINASIOS.find(x => x.id === id && statusGinasio(x).estado === 'disponivel');
        if (g && nivelDeReferencia() >= nivelGinasio(g) - 1 && hp > 0.9) return {f:'ginasio'};
        if (destino && destino.local && destino.local !== '*' && destino.local !== id){
          const cam = caminhoEntre(id, destino.local);
          if (cam && cam[1] && !travaDaPassagem(id, cam[1])) return {f:'viajar', id:cam[1]};
        }
        const viz = Mundo.vizinhos().filter(v => !travaDaPassagem(id, v));
        return {f:'viajar', id:Dados.escolher(viz)};
      }).catch(e => ({f:'erro', e:e.message}));
      const assin = JSON.stringify(dec) + await page.evaluate(() => Estado.dados.local + Relogio.texto());
      if (assin === ultima && ++parado > 12){ anota('travou no mapa', assin); parado = 0; await page.evaluate(() => Exploracao.fazer('vasculhar')); continue; }
      if (assin !== ultima) parado = 0; ultima = assin;
      if (dec.f === 'loja'){
        await page.evaluate(() => Exploracao.fazer('loja')); await page.waitForTimeout(150);
        await page.evaluate(() => {
          for (const n of ['Potion', 'Poké Ball']){
            if (!catalogoDaCidade(Mundo.id()).some(([x]) => x === n)) continue;
            for (let k = 0; k < 3; k++){ try { Cidade.comprar(n, precoNaCidade(n, Mundo.id())); } catch(e){} }
          }
          UI.fecharModal(true); Exploracao.tela();
        });
      } else if (dec.f === 'viajar') await page.evaluate(i => Exploracao.viajar(i), dec.id);
      else if (dec.f === 'arco') await page.evaluate(() => Exploracao.entrarNoArco());
      else if (dec.f === 'centro'){ await page.evaluate(() => Cidade.atenderAqui()); }
      else if (dec.f !== 'erro') await page.evaluate(f => Exploracao.fazer(f), dec.f);
      await page.waitForTimeout(150);
      continue;
    }

    /* modal com escolha / fechar */
    if (await page.locator('#modal .escolha:not([disabled])').count()){ await page.locator('#modal .escolha:not([disabled])').first().click(); continue; }
    if (await page.locator('#modal').count()){
      const f = page.locator('#modal button:visible:has-text("Fechar"), #modal button:visible:has-text("Voltar"), #modal button:visible:has-text("Desligar"), #modal button:visible:has-text("Continuar")');
      if (await f.count()){ await f.first().click(); continue; }
      await page.evaluate(() => UI.fecharModal(true)); continue;
    }
    /* cena: escolhe uma opção (evita soltar e vender) */
    const esc = page.locator('#escolhas .escolha:not([disabled])').filter({hasNotText:/Soltar|Vender|Não atender/});
    const ne = await esc.count();
    if (ne){ await esc.nth(Math.floor(Math.random() * ne)).click(); await page.waitForTimeout(90); continue; }
    const outros = page.locator('.painel button.btn:not([disabled]), .painel .escolha:not([disabled])');
    if (await outros.count()){ await outros.first().click(); continue; }
    anota('tela sem ação', await page.evaluate(() => document.querySelector('#app').innerText.slice(0, 120)));
    await page.evaluate(() => Exploracao.tela()).catch(() => {});
  }

  const reg = await page.evaluate(() => window.__reg).catch(() => null);
  const fim = await page.evaluate(() => ({cap:Estado.dados.capitulo, ins:Estado.dados.insignias.length, local:Estado.dados.local,
    time:Estado.dados.time.map(p => nomeExib(p) + ' ' + p.nivel), dia:Estado.dados.relogio.dia})).catch(() => null);
  fs.writeFileSync(OUT, JSON.stringify({fim, erros, achados, reg, log}, null, 1));
  console.log('FIM', JSON.stringify(fim));
  console.log('ERROS', erros.length ? erros.slice(0, 8).join('\n') : 'nenhum');
  console.log('ACHADOS', Object.keys(achados).length);
  Object.entries(achados).sort((a, b) => b[1] - a[1]).slice(0, 40).forEach(([k, n]) => console.log(' ', n, k));
  await browser.close();
})();
