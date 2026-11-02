/* ============================================================
   VITÓRIA — a festa depois da luta grande
   Ginásio, cada porta da Elite, o Campeão, cada rodada do Torneio
   Aberto e da Conferência, e as finais de torneio da história: antes
   da tela de resultado, a tela inteira acende na cor da luta. O
   "Vitória!" bate, o rosto de quem perdeu entra, e a peça do meio
   chega — a insígnia que cai girando e acende a casa dela no estojo
   das oito, a placa da porta da Elite que leva o carimbo, o troféu do
   título —, e depois o que você ganhou, um cartão por vez.

   A tela de resultado (falas e avisos) já está desenhada por baixo:
   Continuar só tira a festa da frente. Tocar em qualquer lugar, Enter,
   espaço ou A adiantam tudo; com tudo na tela, levam adiante. A música
   do lugar espera a fanfarra (Som.segurar).
   ============================================================ */
const Vitoria = {
  /* o que entrou na mochila, do jeito que a festa mostra */
  premios(dinheiro, itens){
    const out = [];
    if (dinheiro) out.push({dinheiro});
    for (const [nome, q] of Object.entries(itens || {})) if (q > 0) out.push({nome, q});
    return out;
  },

  /* o estojo das oito, na ordem dos ginásios; a casa nova acende por último */
  estojo(nova){
    const tem = new Set((Estado.dados.insignias || []));
    return `<div class="vt-estojo vt-e" aria-hidden="true">${GINASIOS.map(g => {
      const src = caminhoInsignia(g.id);
      const esta = tem.has(g.insignia) && src;
      return `<span class="vt-casa${esta ? ' tem' : ''}${g.id === nova ? ' nova' : ''}">${esta ? `<img src="${src}" alt="">` : ''}</span>`;
    }).join('')}</div>`;
  },

  METAIS: {
    ouro:['#7a4d00', '#f2c94c', '#fff4c2', '#d99a1e', '#6b4300'],
    prata:['#5d6470', '#c9d0da', '#ffffff', '#9aa3b0', '#4a515c'],
    bronze:['#5a3214', '#c9824a', '#ffd6ae', '#a8642e', '#4a2810']
  },
  /* o troféu dos títulos, desenhado (ouro, prata) */
  trofeu(metal){
    const c = this.METAIS[metal] || this.METAIS.ouro;
    return `<svg class="vt-trofeu-svg" viewBox="0 0 120 150" aria-hidden="true">
      <defs>
        <linearGradient id="vt-metal" x1="0" x2="1">
          <stop offset="0" stop-color="${c[0]}"/><stop offset=".3" stop-color="${c[1]}"/><stop offset=".5" stop-color="${c[2]}"/>
          <stop offset=".72" stop-color="${c[3]}"/><stop offset="1" stop-color="${c[4]}"/>
        </linearGradient>
        <linearGradient id="vt-base" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4a3424"/><stop offset="1" stop-color="#22160d"/></linearGradient>
      </defs>
      <path d="M30 28 C8 28 8 64 38 70" fill="none" stroke="url(#vt-metal)" stroke-width="8" stroke-linecap="round"/>
      <path d="M90 28 C112 28 112 64 82 70" fill="none" stroke="url(#vt-metal)" stroke-width="8" stroke-linecap="round"/>
      <path d="M27 16 H93 V40 C93 66 78 84 60 86 C42 84 27 66 27 40 Z" fill="url(#vt-metal)"/>
      <rect x="22" y="11" width="76" height="9" rx="4.5" fill="url(#vt-metal)"/>
      <path d="M53 85 H67 L64 104 H56 Z" fill="url(#vt-metal)"/>
      <ellipse cx="60" cy="104" rx="13" ry="4.5" fill="url(#vt-metal)"/>
      <path d="M36 118 H84 L91 140 H29 Z" fill="url(#vt-base)"/>
      <rect x="33" y="108" width="54" height="11" rx="3" fill="url(#vt-metal)"/>
      <rect x="47" y="124" width="26" height="9" rx="1.5" fill="url(#vt-metal)" opacity=".9"/>
      <path d="M60 30 l4.6 9.3 10.2 1.5 -7.4 7.2 1.8 10.2 -9.2-4.8 -9.2 4.8 1.8-10.2 -7.4-7.2 10.2-1.5z" fill="${c[2]}" opacity=".9"/>
      <path d="M36 22 C36 50 44 70 56 80" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>
    </svg>`;
  },

  /* a medalha de fita das rodadas que não são a final: a roseta na cor
     da competição, o disco no metal da rodada */
  medalha(metal){
    const c = this.METAIS[metal] || this.METAIS.bronze;
    const dentes = Array.from({length:36}, (_, i) => {
      const r = i % 2 ? 41 : 47, a = i / 36 * Math.PI * 2;
      return `${(60 + r * Math.cos(a)).toFixed(1)},${(56 + r * Math.sin(a)).toFixed(1)}`;
    }).join(' ');
    return `<svg class="vt-trofeu-svg" viewBox="0 0 120 150" aria-hidden="true">
      <defs>
        <linearGradient id="vt-metal" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${c[1]}"/><stop offset=".45" stop-color="${c[2]}"/><stop offset=".7" stop-color="${c[3]}"/><stop offset="1" stop-color="${c[4]}"/>
        </linearGradient>
      </defs>
      <path d="M44 84 L30 146 L46 134 L56 148 L64 90Z" fill="var(--vt)"/>
      <path d="M44 84 L30 146 L46 134 L56 148 L64 90Z" fill="#000" opacity=".22"/>
      <path d="M76 84 L90 146 L74 134 L64 148 L56 90Z" fill="var(--vt)"/>
      <polygon points="${dentes}" fill="var(--vt)"/>
      <circle cx="60" cy="56" r="41" fill="#000" opacity=".16"/>
      <circle cx="60" cy="56" r="31" fill="url(#vt-metal)"/>
      <circle cx="60" cy="56" r="25" fill="none" stroke="${c[2]}" stroke-opacity=".55" stroke-width="2"/>
      <path d="M60 41 l4.4 8.9 9.8 1.4 -7.1 6.9 1.7 9.8 -8.8-4.6 -8.8 4.6 1.7-9.8 -7.1-6.9 9.8-1.4z" fill="${c[4]}" opacity=".55"/>
    </svg>`;
  },

  peca(o){
    const esc = s => UI.esc(s);
    if (o.insignia){
      const src = caminhoInsignia(o.insignia.id);
      return `<div class="vt-peca vt-insignia">
        <span class="vt-halo"></span>
        ${src ? `<img class="vt-ins vt-e" src="${src}" alt="${esc(o.insignia.nome)}"><img class="vt-ins-brilho" src="${src}" alt="">` : ''}
        ${this.faiscas()}
      </div>`;
    }
    if (o.placa){
      return `<div class="vt-peca vt-porta vt-e">
        <span class="vt-porta-ordem">${esc(o.placa.ordem)}</span>
        <span class="vt-placa">${esc(o.placa.nome.toUpperCase())}</span>
        ${o.placa.rosto ? `<span class="vt-porta-rosto"><img src="${o.placa.rosto}" alt=""></span>` : ''}
        <span class="vt-selo vt-e">Vencida</span>
      </div>`;
    }
    if (o.trofeu || o.medalha){
      return `<div class="vt-peca vt-trofeu"><span class="vt-halo"></span><div class="vt-trofeu-corpo vt-e">${o.trofeu ? this.trofeu(o.trofeu) : this.medalha(o.medalha)}</div>${this.faiscas()}</div>`;
    }
    return '';
  },

  faiscas(){
    const pos = [[8, 22], [86, 16], [92, 62], [12, 70], [48, 2], [70, 88], [26, 92]];
    return pos.map(([x, y], i) => `<span class="vt-faisca" style="left:${x}%;top:${y}%;--d:${(i * .27).toFixed(2)}s"></span>`).join('');
  },

  cartao(p, i){
    const corpo = p.dinheiro
      ? `<span class="vt-pr-ic moeda">${svgIcone('moeda')}</span><span class="vt-pr-nome">₽ ${p.dinheiro.toLocaleString('pt-BR')}</span>`
      : `<span class="vt-pr-ic">${imgItem(p.nome)}</span><span class="vt-pr-nome">${UI.esc(p.nome)}</span>${p.q > 1 ? `<span class="vt-pr-q">×${p.q}</span>` : ''}`;
    return `<div class="vt-premio vt-e" style="--i:${i}">${corpo}</div>`;
  },

  mostrar(o, seguir){
    const esc = s => UI.esc(s);
    const confete = Array.from({length:34}, (_, i) =>
      `<i style="left:${(i * 29 + 7) % 100}%;--d:${((i * 37) % 23 / 10).toFixed(2)}s;--x:${((i * 53) % 9) - 4}vw;--r:${(i * 71) % 360}deg;--c:${['var(--vt)', '#ffd84a', '#fff', '#5fd38a', '#ff7aa8', '#6fb6ff'][i % 6]}"></i>`).join('');
    const premios = (o.premios || []).map((p, i) => this.cartao(p, i)).join('');
    UI.modal('', `<div class="vt" data-tipo="${o.tipo}" style="--vt:${o.cor || '#e8b923'}">
      <div class="vt-palco">
        <div class="vt-luz" aria-hidden="true"></div>
        <div class="vt-confete" aria-hidden="true">${confete}</div>
        <div class="vt-miolo">
          <div class="vt-titulo vt-e">${esc(o.titulo || 'Vitória!')}</div>
          ${o.quem ? `<div class="vt-contra vt-e">${o.rosto ? `<span class="vt-rosto"><img src="${o.rosto}" alt=""></span>` : ''}<span><b>${esc(o.quem)}</b>${o.sub ? `<small>${esc(o.sub)}</small>` : ''}</span></div>`
                   : (o.sub ? `<div class="vt-contra vt-e"><span><b>${esc(o.sub)}</b></span></div>` : '')}
          ${this.peca(o)}
          ${o.legenda ? `<div class="vt-legenda vt-e"><b>${esc(o.legenda)}</b>${o.conta ? `<span>${esc(o.conta)}</span>` : ''}</div>` : ''}
          ${o.insignia ? this.estojo(o.insignia.id) : ''}
          ${o.etapas ? `<div class="vt-etapas vt-e" aria-hidden="true">${o.etapas}</div>` : ''}
          ${premios ? `<div class="vt-premios">${premios}</div>` : ''}
        </div>
      </div>
      <div class="evo-caixa vt-caixa">
        <p class="evo-texto">${concordaJogador(o.frase || '')}</p>
        <div class="evo-botoes"><button class="evo-btn a vt-seguir" data-sem-toque><span class="evo-tecla">A</span>Continuar</button></div>
      </div>
    </div>`, true, 'vitoria');

    const M = document.querySelector('#modal .modal.vitoria');
    if (!M) return seguir && seguir();
    const V = M.querySelector('.vt');
    const botao = M.querySelector('.vt-seguir');
    const reduzido = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers = [];
    let pronto = false, saiu = false;

    if (typeof Som !== 'undefined' && Som.segurar){ Som.segurar(true); Som.efeito('fanfarra'); }

    const passo = (cls, ms, som) => timers.push(setTimeout(() => {
      V.classList.add(cls);
      if (som && typeof Som !== 'undefined') Som.efeito(som);
    }, ms));
    const tudo = () => {
      if (pronto) return;
      pronto = true;
      timers.forEach(clearTimeout);
      V.classList.add('f1', 'f2', 'f3', 'f4', 'f5', 'ja');
      botao.focus({preventScroll:true});
    };
    const sair = () => {
      if (saiu) return;
      saiu = true;
      timers.forEach(clearTimeout);
      UI.fecharModal();
      if (seguir) seguir();
    };
    /* saiu da tela (Continuar, ou outra janela por cima): a tecla solta
       e a trilha do lugar volta */
    const vigia = new MutationObserver(() => {
      if (document.body.contains(M)) return;
      vigia.disconnect();
      timers.forEach(clearTimeout);
      document.removeEventListener('keydown', tecla);
      if (typeof Som !== 'undefined' && Som.segurar && Som._segura) Som.segurar(false);
    });
    vigia.observe(document.body, {childList:true});
    const tecla = ev => {
      if (!document.body.contains(M)) return document.removeEventListener('keydown', tecla);
      if (!/^(Enter| |a|A|Escape)$/.test(ev.key)) return;
      ev.preventDefault();
      pronto ? sair() : tudo();
    };
    document.addEventListener('keydown', tecla);
    botao.onclick = ev => { ev.stopPropagation(); pronto ? sair() : tudo(); };
    M.querySelector('.vt-palco').onclick = () => { pronto ? sair() : tudo(); };

    if (reduzido) return tudo();
    /* o compasso da festa: título, peça do meio, legenda e estojo, os
       prêmios (cada cartão espera o de antes pelo --i) e o botão */
    const n = (o.premios || []).length;
    const somPeca = o.insignia || o.trofeu || o.medalha ? 'insignia' : o.placa ? 'carimbo' : null;
    passo('f1', 60);
    passo('f2', 650, null);
    if (somPeca) timers.push(setTimeout(() => { if (typeof Som !== 'undefined') Som.efeito(somPeca); }, o.placa ? 1500 : 1550));
    passo('f3', 1900);
    passo('f4', 2500);
    timers.push(setTimeout(() => { V.classList.add('f5'); pronto = true; botao.focus({preventScroll:true}); }, 2700 + n * 260));
  },

  /* ---------- quem chama ---------- */
  ginasio(g, ganho, itens){
    const n = (Estado.dados.insignias || []).filter(i => GINASIOS.some(x => x.insignia === i)).length;
    return {
      tipo:'ginasio', cor:COR_TIPO[g.tipo] || '#e8b923',
      quem:`Líder ${g.lider}`, sub:`Ginásio de ${g.cidade}`, rosto:retratoDe(g.lider),
      insignia:{id:g.id, nome:g.insignia}, legenda:g.insignia, conta:`${n} de 8`,
      premios:this.premios(ganho, itens),
      frase:`Você recebeu a <b>${UI.esc(g.insignia)}</b> de <b>${UI.esc(g.lider)}</b>!`
    };
  },
  elite(alvo){
    const titular = alvo.titular || alvo.nome;
    return {
      tipo:'elite', cor:COR_TIPO[alvo.tipo] || '#a884d4',
      quem:alvo.nome, sub:`Elite 4 · ${alvo.ordem} de 4`, rosto:retratoDe(alvo.nome),
      placa:{nome:titular, ordem:`${['Primeira', 'Segunda', 'Terceira', 'Quarta'][alvo.ordem - 1] || ''} porta`},
      legenda:`A porta de ${titular}`, conta:alvo.ordem >= 4 ? 'A do fundo está aberta' : `${alvo.ordem} de 4`,
      frase: alvo.ordem >= 4
        ? `A última porta da ala fica para trás. <b>O Salão do Campeão</b> está aberto.`
        : `<b>${UI.esc(alvo.nome)}</b> está fora do caminho. Faltam ${['', 'três', 'duas', 'uma'][alvo.ordem]} ${alvo.ordem === 3 ? 'porta' : 'portas'}.`
    };
  },
  campeao(ganho, itens){
    return {
      tipo:'campeao', cor:'#e8b923', titulo:'{Campeão|Campeã}!',
      quem:CAMPEAO.nome, sub:'Salão do Campeão', rosto:retratoDe(CAMPEAO.nome),
      trofeu:'ouro', legenda:'{Campeão|Campeã} de Kanto',
      premios:this.premios(ganho, itens),
      frase:'A cadeira do Salão do Campeão tem dono de novo. <b>É você.</b>'
    };
  },
  /* final de torneio da história (luta de cena com festa:{…} no
     batalha): o prêmio é o que o ef da cena de vitória dá */
  daCena(f, b){
    return {
      tipo:'taca', cor:f.cor || '#e8b923', titulo:f.titulo || '{Campeão|Campeã}!',
      quem:b.treinador, sub:f.sub, rosto:retratoDe(b.treinador),
      trofeu:f.trofeu || 'ouro', legenda:f.legenda, conta:f.conta,
      premios:this.premios(f.dinheiro, f.itens), frase:f.frase
    };
  },
  /* rodada de torneio ou de Conferência; a última vem com o troféu */
  rodada(o){
    const etapas = o.rodadas.map((r, i) => `<span class="vt-etapa${i < o.feitas ? ' feita' : ''}${i === o.feitas - 1 ? ' agora' : ''}">${UI.esc(r)}</span>`).join('');
    const titulo = o.feitas >= o.rodadas.length;
    const rodada = o.rodadas[o.feitas - 1];
    return {
      tipo: titulo ? 'taca' : 'rodada', cor:o.cor,
      titulo: titulo ? '{Campeão|Campeã}!' : 'Vitória!',
      quem:o.adversario, sub:`${rodada} · ${o.nome}`, rosto:retratoDe(o.adversario),
      /* a medalha da rodada: bronze até a que vem antes da final, prata nela */
      trofeu: titulo ? o.metal : null, medalha: titulo ? null : (o.feitas >= o.rodadas.length - 1 ? 'prata' : 'bronze'),
      legenda: titulo ? o.nome : rodada, conta: titulo ? o.conta : `${o.feitas} de ${o.rodadas.length}`,
      etapas, premios:this.premios(o.ganho, o.itens),
      frase: titulo ? `${o.f ? 'A' : 'O'} <b>${UI.esc(o.nome)}</b> é ${o.f ? 'sua' : 'seu'}.`
                    : `<b>${UI.esc(rodada)}</b> ${/s$/.test(rodada) ? 'vencidas' : 'vencida'}. Próxima: ${UI.esc(o.rodadas[o.feitas])}.`
    };
  }
};
