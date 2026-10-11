/* roteiro — escreve o texto do jogo como o jogador lê, cena por cena, com
   o dono de cada balão, pra quem vai revisar a história de ponta a ponta.

   Renderiza de verdade (UI.narrar, com o falante, as vozes e o dono da
   conversa que o jogo usa) e escreve, em <saida>/:
     cap-<n>.txt    um arquivo por capítulo (linha principal, condicionais
                    e caminhos), cena por cena;
     eventos.txt    os eventos de cidade e de rota;
     linhas.txt     as cenas de linha;
     pokenav.txt    as ligações do PokéNav;
     alertas.txt    só os alertas, pra começar por eles.

   Cada fala sai numerada, na ordem das aspas da cena (a mesma ordem de
   `vozes`), com o nome de quem o jogo acha que falou e de onde veio essa
   certeza:
     =  o autor disse (fala(), vozes, monólogo)
     ~  a opção que o jogador escolheu, ou "ele diz" logo depois da aspa
     ?  adivinhada pelo motor (alternância e sujeito da narração)
   Linha que sai de função (muda com o estado) leva ƒ, e a função vai
   escrita embaixo, pra ler os dois ramos.

   Alertas:
     QA      a mesma pessoa pergunta e responde (duas falas seguidas da
             mesma boca, a primeira terminando em "?", uma delas adivinhada)
     NOME    você diz o seu próprio nome
     SI      alguém se chama pelo próprio nome ("Rook, ...", dito pelo Rook)
     LONGO   fala sua adivinhada com mais de 220 letras
     ANON    fala sem dono

   Uso: NODE_PATH=<playwright> node ferramentas/roteiro.js <pasta de saída> */
const {chromium} = require('playwright');
const fs = require('fs'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const SAIDA = path.resolve(process.argv[2] || path.join(raiz, 'roteiro'));

(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  if (process.env.ROTEIRO_HOMEM) await p.addInitScript(() => { window.__roteiroHomem = true; });
  /* ROTEIRO_SO=<regex do nome do arquivo> escreve só o que casar (ex.: '^cap-2$', 'eventos') */
  const so = process.env.ROTEIRO_SO || '';
  await p.addInitScript(s => { window.__roteiroSo = s; }, so);
  /* o outro ramo das linhas que são função: ROTEIRO_FLAGS='a,b,c10_onde=subestacao'
     liga flags, ROTEIRO_ITENS='Lanterna de cabeça' põe na mochila, ROTEIRO_VIA='heroi'
     troca a via e ROTEIRO_NOMES='o homem do boné' dá o nome como já dito */
  await p.addInitScript(o => { window.__roteiroRamo = o; }, {
    flags: process.env.ROTEIRO_FLAGS || '', itens: process.env.ROTEIRO_ITENS || '',
    via: process.env.ROTEIRO_VIA || '', nomes: process.env.ROTEIRO_NOMES || ''});
  await p.goto('file://' + path.join(raiz, 'index.html'));
  await p.waitForTimeout(800);

  const r = await p.evaluate(() => {
    /* o caso que mais denuncia gênero escrito à mão: jogadora mulher, quem
       ficou em casa é o pai e o inicial é fêmea. Com ROTEIRO_HOMEM=1 no
       ambiente, o contrário (pra comparar as duas leituras). */
    const homem = !!window.__roteiroHomem;
    const NOME = homem ? 'Davi' : 'Lia';
    Estado.novo({nome:NOME, genero: homem ? 'Homem' : 'Mulher', cidade:'Pallet',
      casaNome: homem ? 'Delia' : 'Ivo', casaQuem: homem ? 'mãe' : 'pai', nascimento:{dia:3, mes:9},
      objetivo:'Ver o Planalto Indigo de perto', personalidade:'teimosa e curiosa'});
    const d = Estado.dados;
    const ini = criarPokemon(7, 30); ini.genero = homem ? 'm' : 'f';
    d.time = [ini]; d.flags.tem_pokedex = true; d.capitulo = 10;
    const ramo = window.__roteiroRamo || {};
    const itens = t => String(t || '').split(',').map(x => x.trim()).filter(Boolean);
    itens(ramo.flags).forEach(f => { const [k, v] = f.split('='); d.flags[k.trim()] = v === undefined ? true : v.trim(); });
    itens(ramo.itens).forEach(n => Estado.darItem(n, 1));
    if (ramo.via) d.via = ramo.via;
    itens(ramo.nomes).forEach(r => Nomes.apresentar(r));
    const arquivos = {}, alertas = [];
    const filtro = window.__roteiroSo ? new RegExp(window.__roteiroSo) : null;
    const escreve = (arq, s) => { if (filtro && !filtro.test(arq)) return; (arquivos[arq] = arquivos[arq] || []).push(s); };
    const compacta = f => String(f).replace(/\s+/g, ' ').slice(0, 900);

    const resolve = l => { try { return typeof l === 'function' ? l(Estado.dados) : l; } catch(e){ return '[ERRO NA FUNÇÃO: ' + e.message + ']'; } };
    const lista = x => {
      const v = resolve(x);
      return Array.isArray(v) ? v : (v == null ? [] : [v]);
    };

    /* renderiza um bloco de linhas e devolve as linhas do roteiro e os alertas */
    const roteiro = (linhas, cfg) => {
      const dinamicas = [];
      const prontas = [];
      for (const l of linhas){
        const v = resolve(l);
        if (typeof l === 'function') dinamicas.push({fonte:compacta(l), valor:v});
        if (v == null || v === '') continue;
        prontas.push(v);
      }
      UI.npcDaCena = cfg.dono || null; UI.npcEhProprio = !!cfg.proprio;
      UI.falanteDaCena = cfg.falante || null; UI.vozesDaCena = cfg.vozes || null;
      UI.minhasFalasDaCena = cfg.minhas || null; UI.falaDoJogador = null;
      let h = '';
      try { h = cfg.monologo ? UI.narrarMonologo(prontas, cfg.monologo) : UI.narrar(prontas); }
      catch(e){ return {linhas:['  [ERRO AO RENDERIZAR: ' + e.message + ']'], alertas:['ERRO']}; }
      finally { UI.vozesDaCena = null; UI.falanteDaCena = null; UI.npcDaCena = null; }
      const div = document.createElement('div'); div.innerHTML = h;
      const textoDin = dinamicas.map(x => typeof x.valor === 'string' ? x.valor : (x.valor && x.valor.diz) || '').filter(Boolean);
      const ehDin = t => textoDin.some(s => s.indexOf(t.slice(0, 40)) !== -1);
      const out = [], als = [];
      let n = 0, aspa = 0, ultimo = null;
      for (const el of div.children){
        if (el.classList.contains('fala')){
          n++;
          const q = el.querySelector('.fala-quem');
          const quem = q ? q.innerText.trim() : '';
          const diz = (el.querySelector('.fala-diz') || el).innerText.trim();
          const voz = el.getAttribute('data-voz') || 'fala';
          /* f = fala() escrita pelo autor; o resto é aspa, e só aspa conta em `vozes` */
          const marca = voz === 'fala' ? 'f' : (voz === 'vozes' || voz === 'monologo') ? '=' : (voz === 'adivinhada' ? '?' : '~');
          const idx = voz === 'fala' ? '     ' : `[a${String(++aspa).padStart(2)}]`;
          const dono = el.classList.contains('voce') ? 'VOCÊ' : (quem || '(SEM DONO)');
          out.push(`  ${String(n).padStart(2)}${marca}${idx} ${dono}: ${diz}${ehDin(diz) ? '  ƒ' : ''}`);
          if (!quem && !el.classList.contains('voce')) als.push('ANON ' + n);
          if (dono === 'VOCÊ' && diz.indexOf(NOME) !== -1) als.push('NOME ' + n);
          if (dono !== 'VOCÊ' && quem){
            const curto = quem.split(' ').filter(x => x.length > 2).pop() || quem;
            if (new RegExp('^' + curto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ',', 'i').test(diz)) als.push('SI ' + n);
          }
          if (dono === 'VOCÊ' && marca === '?' && diz.length > 220) als.push('LONGO ' + n);
          if (ultimo && ultimo.dono === dono && /\?$/.test(ultimo.diz) && (ultimo.marca === '?' || marca === '?'))
            als.push(`QA ${ultimo.n}→${n}`);
          ultimo = {dono, diz, marca, n};
        } else {
          /* papel que veio de aspa (não de linha **...**) também ocupa lugar em `vozes` (como 'E') */
          const t = el.innerText.trim();
          if (!t) continue;
          const papel = el.classList.contains('escrito');
          const daAspa = papel && el.getAttribute('data-voz');
          out.push(`     ${papel ? (daAspa ? `[papel a${String(++aspa).padStart(2)}${daAspa === 'vozes' ? '=E' : '?'}] ` : '[papel] ') : ''}${t}${!papel && ehDin(t) ? '  ƒ' : ''}`);
          /* narração não quebra a sequência de quem fala */
        }
      }
      for (const x of dinamicas) out.push('     ƒ ' + x.fonte);
      return {linhas:out, alertas:als};
    };

    const bloco = (arq, titulo, linhas, cfg, extra) => {
      const rr = roteiro(linhas, cfg);
      const meta = [cfg.falante ? 'falante: ' + cfg.falante : '', cfg.vozes ? 'vozes: ' + cfg.vozes.map(v => /^[PNE]$/.test(v) ? v : `'${v}'`).join(' ') : '',
                    cfg.dono ? 'dono: ' + cfg.dono + (cfg.proprio ? ' (da cena)' : '') : '', cfg.monologo ? 'monólogo: ' + cfg.monologo : '']
                   .filter(Boolean).join(' · ');
      escreve(arq, `\n### ${titulo}${meta ? '   [' + meta + ']' : ''}${rr.alertas.length ? '   ⚠ ' + rr.alertas.join(' · ') : ''}`);
      rr.linhas.forEach(l => escreve(arq, l));
      (extra || []).forEach(l => escreve(arq, l));
      if (rr.alertas.length && !(filtro && !filtro.test(arq))) alertas.push(`${arq} :: ${titulo} :: ${rr.alertas.join(' · ')}`);
    };

    /* ---- capítulos ---- */
    const caps = CAPITULOS.slice().sort((a, b) => a.num - b.num);
    for (const cap of caps){
      const arq = 'cap-' + String(cap.num).replace('.', '_');
      const mapa = UI.donosDoCapitulo(cap);
      Estado.dados.capitulo = Math.floor(cap.num);
      Historia.capAtual = cap;
      escreve(arq, `# CAPÍTULO ${cap.num} — ${cap.titulo}   (${txt(cap.local)} · ${cap.ambiente || ''})`);
      for (const id in cap.cenas){
        const c = cap.cenas[id];
        Estado.dados.cena = id;
        const escolhas = (c.escolhas || []).map(e => `     > ${txt(e.texto)}${e.vai ? '  → ' + e.vai : ''}${e.cond ? '  (cond)' : ''}`);
        if (c.teste) escolhas.unshift(`     [teste de ${c.teste.nomeStatus || c.teste.status} ${c.teste.dificuldade}: crítico → ${c.teste.critico || '-'} · sucesso → ${c.teste.sucesso || '-'} · parcial → ${c.teste.parcial || '-'} · falha → ${c.teste.falha || '-'}]`);
        if (c.batalha) escolhas.unshift(`     [luta: ${c.batalha.treinador || c.batalha.tipo || ''} · vitória → ${c.batalha.vitoria || '-'} · derrota → ${c.batalha.derrota || '-'}]`);
        if (c.fim) escolhas.push('     [fim do capítulo]');
        if (c.final) escolhas.push('     [FINAL: ' + (c.final.titulo || c.final.id) + ']');
        bloco(arq, id, lista(c.texto), {dono:mapa.dono[id], proprio:!!mapa.proprio[id], falante:c.falante, vozes:c.vozes, minhas:mapa.minhas && mapa.minhas[id]}, escolhas);
        if (c.final && c.final.texto) bloco(arq, id + ' (final)', lista(c.final.texto), {dono:mapa.dono[id]});
      }
    }

    /* ---- eventos ---- */
    const todosEventos = [];
    for (const [k, evs] of Object.entries(EVENTOS_CIDADE)) evs.forEach(ev => todosEventos.push(['cidade ' + k, ev]));
    for (const [k, evs] of Object.entries(typeof EVENTOS_ROTA !== 'undefined' ? EVENTOS_ROTA : {})) evs.forEach(ev => todosEventos.push(['rota ' + k, ev]));
    (typeof EVENTOS_GERAIS !== 'undefined' ? EVENTOS_GERAIS : []).forEach(ev => todosEventos.push(['geral', ev]));
    for (const [onde, ev] of todosEventos){
      const dono = ev.npc && ev.npc.nome || (ev.escolhas || []).map(e => e.ef && e.ef.npc && e.ef.npc.nome).find(Boolean);
      bloco('eventos', `${ev.id}  (${onde})${ev.titulo ? ' — ' + txt(ev.titulo) : ''}`, lista(ev.texto), {dono, falante:ev.falante, vozes:ev.vozes},
        (ev.escolhas || []).map(e => `     > ${txt(e.texto)}`));
      (ev.escolhas || []).forEach((e, i) => [['', e], [' (bom)', e.bom], [' (ruim)', e.ruim]].forEach(([rot, ramo]) => {
        if (ramo && ramo.resultado) bloco('eventos', `${ev.id} > ${i + 1}${rot}`, lista(ramo.resultado),
          {dono:(e.ef && e.ef.npc && e.ef.npc.nome) || dono, falante:ev.falante});
      }));
    }

    /* ---- cenas de linha ---- */
    for (const tab of [CENAS_DE_LINHA, typeof MAIS_CENAS_DE_LINHA !== 'undefined' ? MAIS_CENAS_DE_LINHA : {}])
      for (const [ln, cenas] of Object.entries(tab)) for (const c of cenas){
        if (!c || !c.texto) continue;
        bloco('linhas', `${ln} · cap ${c.cap} · ${c.titulo}`, lista(c.texto), {dono:c.quem, falante:c.falante, vozes:c.vozes},
          (c.escolhas || []).map(e => `     > ${txt(e.texto)}`));
        (c.escolhas || []).forEach((e, i) => { if (e.resultado) bloco('linhas', `${ln} · ${c.titulo} > ${i + 1}`, lista(e.resultado), {dono:c.quem, falante:c.falante}); });
      }

    /* ---- PokéNav ---- */
    for (const ch of CHAMADAS){
      const ct = (typeof contatoPorId === 'function') && contatoPorId(ch.de);
      const dono = ct && (ct.falaComo || textoContato(ct, 'nome'));
      bloco('pokenav', `${ch.id}  (de ${ch.de})`, lista(ch.falas), {dono}, (ch.escolhas || []).map(e => `     > ${txt(e.texto)}`));
      (ch.escolhas || []).forEach((e, i) => { if (e.resultado) bloco('pokenav', `${ch.id} > ${i + 1}`, lista(e.resultado), {dono}); });
    }

    const resumo = {};
    for (const a of alertas){ const tipo = a.split(' :: ')[2].split(' ')[0]; resumo[tipo] = (resumo[tipo] || 0) + 1; }
    return {arquivos, alertas, resumo};
  });

  fs.mkdirSync(SAIDA, {recursive:true});
  let total = 0;
  for (const [arq, ls] of Object.entries(r.arquivos)){
    fs.writeFileSync(path.join(SAIDA, arq + '.txt'), ls.join('\n') + '\n');
    total += ls.length;
  }
  if (!so) fs.writeFileSync(path.join(SAIDA, 'alertas.txt'), r.alertas.join('\n') + '\n');
  console.log(`roteiro: ${Object.keys(r.arquivos).length} arquivos, ${total} linhas, em ${SAIDA}`);
  console.log(`alertas: ${r.alertas.length}`, r.resumo);
  if (errs.length) console.log('erros de página:', errs.slice(0, 5));
  await b.close();
})();
