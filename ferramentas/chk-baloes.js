/* chk-baloes — renderiza de verdade toda cena com fala e confere cada balão:
   tem dono (nome em cima), tem rosto, e o rosto existe no disco.
   Complementa o chk-rostos, que lê o código: aqui entra também o balão
   que nasce de aspa na narração, com o falante adivinhado pela cena
   (falante, vozes, npc dono da conversa). Cobre capítulos (linha
   principal, condicionais e caminhos), eventos de cidade, cenas de
   linha e ligações do PokéNav. Linha que depende de estado (cemitério,
   presente do Juniper) só conta como "falha de função" se não tiver
   condição protegendo — confira à mão as que aparecerem.
   Precisa do playwright: NODE_PATH=<onde ele está> node ferramentas/chk-baloes.js */
const {chromium}=require('playwright'); const fs=require('fs'), path=require('path');
const raiz=path.resolve(__dirname,'..');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.join(raiz,'index.html')); await p.waitForTimeout(800);
const r=await p.evaluate(()=>{
  const out={nomes:{}, srcs:{}, anonimos:[], cenas:0, falhas:0};
  const montar=(gen)=>{ Estado.novo({nome:'Ana',genero:gen,cidade:'Pallet',casaNome:'Delia',casaQuem:'mãe',nascimento:{dia:3,mes:9}});
    const d=Estado.dados; d.time=[criarPokemon(7,30)]; d.flags.tem_pokedex=true; d.capitulo=10; return d; };
  const d=montar('Mulher');
  const meu=Estado.j.nome;
  const res = l => { try { return typeof l==='function' ? l(Estado.dados) : l; } catch(e){ out.falhas++; (out.erros=out.erros||[]).push(String(e.message).slice(0,90)+' :: '+String(l).slice(0,110)); return null; } };
  const lista = x => { const v=res(x); return Array.isArray(v) ? v.map(res).filter(y=>y!=null) : (v==null?[]:[v]); };
  function varre(linhas, onde, dono, falante, vozes, proprio, minhas){
    out.cenas++;
    UI.npcDaCena=dono||null; UI.npcEhProprio=!!proprio; UI.falanteDaCena=falante||null; UI.vozesDaCena=vozes||null; UI.minhasFalasDaCena=minhas||null;
    let h=''; try{ h=UI.narrar(linhas); }catch(e){ out.falhas++; return; }
    const div=document.createElement('div'); div.innerHTML=h;
    div.querySelectorAll('.fala').forEach(e=>{
      if (e.classList.contains('voce')||e.classList.contains('minha')||e.classList.contains('jogador')) return;
      const q=e.querySelector('.fala-quem'); if(!q) { out.anonimos.push(onde+': (sem .fala-quem) '+e.innerText.slice(0,60)); return; }
      const n=q.innerText.trim();
      if(!n){ return; } // repetição do mesmo falante: o balão não repete nome nem rosto
      if (n===meu || /^você$/i.test(n)) return;
      if (/^\?+$/.test(n)) { out.anonimos.push(onde+': ??? '+e.innerText.slice(0,60)); return; }
      const img=q.querySelector('img.fala-retrato');
      const o=out.nomes[n]=out.nomes[n]||{n:0,rosto:0,onde:[]}; o.n++; if(img){ o.rosto++; out.srcs[img.getAttribute('src')]=1; }
      if(!img && o.onde.length<4 && !o.onde.includes(onde)) o.onde.push(onde);
    });
  }
  /* capítulos (linha principal, condicionais e caminhos) */
  for(const cap of CAPITULOS){ const mapa=UI.donosDoCapitulo(cap); Estado.dados.capitulo=Math.floor(cap.num);
    for(const id in cap.cenas){ const c=cap.cenas[id]; const onde='c'+cap.num+'/'+id;
      const pr=!!mapa.proprio[id], mi=mapa.minhas&&mapa.minhas[id];
      varre(lista(c.texto), onde, mapa.dono[id], c.falante, c.vozes, pr, mi);
      for(const e of (c.escolhas||[])) if(e.resultado) varre(lista(e.resultado), onde+'>', mapa.dono[id], c.falante, null, pr, mi);
    }}
  /* eventos de cidade */
  for(const [cid, evs] of Object.entries(EVENTOS_CIDADE)) for(const ev of evs){ const onde='ev/'+ev.id;
    const dono = ev.npc && ev.npc.nome || (ev.escolhas||[]).map(e=>e.ef&&e.ef.npc&&e.ef.npc.nome).find(Boolean);
    varre(lista(ev.texto), onde, dono, ev.falante, ev.vozes);
    for(const e of (ev.escolhas||[])){ for (const ramo of [e, e.bom, e.ruim].filter(Boolean)) if(ramo.resultado) varre(lista(ramo.resultado), onde+'>', (e.ef&&e.ef.npc&&e.ef.npc.nome)||dono, ev.falante, null); }
  }
  /* cenas de linha */
  for (const tab of [CENAS_DE_LINHA, typeof MAIS_CENAS_DE_LINHA!=='undefined'?MAIS_CENAS_DE_LINHA:{}]) for(const [ln, cenas] of Object.entries(tab)) for(const c of cenas){
    const onde='linha/'+ln+'/'+c.titulo; varre(lista(c.texto), onde, c.quem, c.falante, c.vozes);
    for(const e of (c.escolhas||[])) if(e.resultado) varre(lista(e.resultado), onde+'>', c.quem, c.falante, null);
  }
  /* ligações do PokéNav */
  for(const ch of CHAMADAS){ const ct=(typeof contatoPorId==='function')&&contatoPorId(ch.de); const dono=ct&&(ct.falaComo||textoContato(ct,'nome'));
    const onde='nav/'+ch.id; varre(lista(ch.falas), onde, dono, null, null);
    for(const e of (ch.escolhas||[])) if(e.resultado) varre(lista(e.resultado), onde+'>', dono, null, null);
  }
  return out;
});
const sem=Object.entries(r.nomes).filter(([n,o])=>o.rosto===0).sort((a,b)=>b[1].n-a[1].n);
const quebrados=Object.keys(r.srcs).filter(s=>!s.startsWith('data:') && !fs.existsSync(path.join(raiz, decodeURI(s))));
console.log('cenas renderizadas:', r.cenas, '| nomes em balão:', Object.keys(r.nomes).length, '| falhas de função:', r.falhas);
console.log('\nBALÃO SEM ROSTO ('+sem.length+'):'); sem.forEach(([n,o])=>console.log('  '+String(o.n).padStart(3)+'  '+n+'   ['+o.onde.join(', ')+']'));
console.log('\nROSTO QUE NÃO EXISTE ('+quebrados.length+'):'); quebrados.forEach(s=>console.log('  '+s));
console.log('\nBALÃO SEM DONO ('+r.anonimos.length+'):'); r.anonimos.slice(0,40).forEach(s=>console.log('  '+s));
console.log('\nFALHAS:', (r.erros||[]).join('\n  ')); console.log('\nerros de página:', errs.slice(0,5)); await b.close();
process.exit(sem.length||quebrados.length||r.anonimos.length||errs.length ? 1 : 0);})();
