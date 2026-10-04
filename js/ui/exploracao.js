/* ============================================================
   EXPLORAÇÃO — a tela onde você decide o que fazer e pra onde ir
   ============================================================ */
/* Treino custa comida e corpo: cada dia de treino gasta uma Ração (o
   time come no fim), e entre um treino e outro tem que passar tempo de
   verdade — dormir no acampamento pula a noite do jogo, não o cansaço. */
const TREINO_RACAO = 1;
const TREINO_ESPERA_MIN = 6;      // minutos reais entre dois treinos
const ACAMPAR_RACAO = 1;

const Exploracao = {

  tela(avisos){
    /* a viagem de ônibus do fim do capítulo 1 aparece na primeira tela
       de mapa, mesmo que o rival tenha aparecido antes dela */
    if (!avisos && typeof Jogo !== 'undefined' && Jogo.avisoOnibus){ avisos = Jogo.avisoOnibus; Jogo.avisoOnibus = null; }
    if (typeof Jogo !== 'undefined' && Jogo.tocarAdiada) Jogo.tocarAdiada();
    /* o aniversário chega na primeira tela de mapa do dia */
    if (typeof Aniversario !== 'undefined' && Aniversario.pendente()) return Aniversario.festejar();
    Estado.dados.modo = 'mundo';
    UI.limpar();
    UI.add(UI.topo());
    const L = Mundo.atual();
    const d = Estado.dados;
    const arco = Historia.arcoAqui();
    const travaArco = arco ? travaDoCapitulo(arco.num) : null;

    /* Lugar e ação não são a mesma coisa e não merecem o mesmo botão:
       lugar é porta que você abre, ação é tempo que você gasta. */
    const todos = afazeresDoLocal();
    const lugares = todos.filter(a => a.lugar).map(a =>
      `<button class="porta" onclick="Exploracao.fazer('${a.id}')">
        <span class="porta-nome">${UI.esc(a.titulo)}</span></button>`).join('');
    const afazeres = todos.filter(a => !a.lugar).map(a =>
      `<button class="escolha" onclick="Exploracao.fazer('${a.id}')">
        ${UI.esc(a.titulo)}</button>`).join('');

    const vizinhos = Mundo.vizinhos().map(id => {
      const v = LOCAIS[id];
      const conhecido = Mundo.visitado(id);
      /* passagem que cobra insígnia aparece fechada, dizendo o que falta */
      const trava = travaDaPassagem(Mundo.id(), id);
      return `<button class="escolha" ${trava ? 'disabled' : `onclick="Exploracao.viajar('${id}')"`}>
        ${conhecido ? 'Ir para ' + UI.esc(v.nome) : 'Seguir o caminho — ' + UI.esc(v.nome)}${
          trava ? `<br><span class="pd">${UI.esc(textoTrava(trava))}</span>` : ''}</button>`;
    }).join('');

    UI.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">${UI.esc(Relogio.cabecalho())}</div>
        <div class="tit">${UI.esc(L.nome)}</div>
        <div class="loc">${UI.esc(L.tipo === 'cidade' ? (L.porte||'cidade') : (L.tipo==='rota'?'rota':'lugar'))}${
          L.tipo !== 'cidade' && L.nivel ? ' · posto ' + UI.esc(nomePosto(L.nivel)) : ''}</div>
      </div>
      <div class="narrativa">${(L.desc||[]).map(t=>`<p>${UI.esc(txt(t))}</p>`).join('')}${
        (() => { const r = (typeof comoOlugarTeRecebe === 'function') ? comoOlugarTeRecebe() : null;
                 return r ? `<p class="recepcao">${UI.esc(r)}</p>` : ''; })()}</div>
      <div id="avisos" class="avisos"></div>

      ${arco ? `<h3>Aqui</h3>
        <div id="escolhas" class="escolhas">
          <button class="escolha" style="border-color:var(--destaque)" ${travaArco ? 'disabled' : 'onclick="Exploracao.entrarNoArco()"'}>
            ${UI.esc(arco.chamada)}${travaArco ? `<br><span class="pd">${UI.esc(textoTrava(travaArco))}</span>` : ''}</button>
        </div>` : ''}

      ${lugares ? `<h3>Onde entrar</h3>
        <div class="portas">${lugares}</div>` : ''}

      <h3>O que fazer</h3>
      <div class="escolhas">${afazeres}</div>

      <h3 class="com-mapa">Para onde ir
        ${!Estado.contaItem('Mapa de Kanto') && this.temCentro(L)
          ? `<button class="btn mini abre-mapa" onclick="Exploracao.mapa('parede')">${imgItem('Mapa de Kanto')}Mapa do Centro</button>` : ''}</h3>
      <div class="escolhas">${vizinhos}</div>
    </div>`);

    if (avisos && avisos.length) UI.avisos(avisos);
    UI.rolarTopo();
    UI.talvezApelido();
  },

  /* ---------- o mapa da região ----------
     Desenhado, não fotografado: o town-map.png do roteiro é o ícone
     30×30 do item, não um mapa. As posições seguem o Town Map de
     FireRed/LeafGreen. O mapa só mostra o que você já sabe: lugar
     visitado tem nome; o vizinho de um lugar visitado aparece como
     estrada que existe, sem nome; o resto não aparece. */
  POS_MAPA: {
    pallet:[40,126], rota1:[40,108], viridian:[40,90], rota22:[25,90], rota23:[12,72],
    caminho_vitoria:[12,54], planalto:[12,36], rota2:[40,75], floresta:[40,62], pewter:[40,46],
    rota3:[60,46], monte_lua:[80,40], rota4:[100,46], cerulean:[120,46], rota24:[120,30],
    norte:[146,28], rota9:[146,46], usina:[172,38], tunel_rocha:[172,56], lavender:[172,74],
    rota5:[120,60], saffron:[120,74], rota6:[120,90], vermilion:[120,104], rota7:[100,74],
    celadon:[80,74], rota8:[146,74], rota11:[146,104], rota12:[172,96], rota13:[160,120],
    fuchsia:[104,128], rota16:[80,100], rota19:[92,146], seafoam:[70,148], cinnabar:[40,150],
    rota21:[40,138], ilha_sem_nome:[16,150]
  },
  /* Todo Centro Pokémon tem um mapa da região na parede do saguão: quem
     não comprou o dele olha o de lá. */
  temCentro(L){ return !!(L && (L.lugares || []).includes('centro')); },

  /* O mapa é completo, como o Town Map dos jogos e o da parede do
     Centro: toda cidade e toda rota de Kanto, com nome. O que não está
     em mapa nenhum (a ilha sem nome, o norte da Rota 10, a travessia
     da Rota 21) só aparece depois que você descobre. Tocar num lugar
     abre a ficha dele embaixo; ir e voar são botões da ficha. */
  mapaVisivel(id){
    const L = LOCAIS[id];
    return !!(L && this.POS_MAPA[id] && (!L.oculto || Mundo.descobriu('local_' + id) || Mundo.visitado(id)));
  },

  /* o nome inteiro está na ficha; no desenho vai o que cabe */
  rotuloMapa(L){
    if (L.tipo !== 'rota') return L.nome.replace(/^Ilhas? /, '').replace(/^Planalto Indigo$/, 'Planalto')
      .replace(/^Usina Abandonada$/, 'Usina').replace(/^A ilha sem nome$/, 'ilha sem nome').replace(/^Norte da Rota 10$/, 'Norte');
    const n = /^Rota (\d+)/.exec(L.nome);
    return n ? n[1] : L.nome.replace(/^Monte da /, 'Mt. ').replace(/^Túnel da Rocha$/, 'Túnel')
      .replace(/^Caminho da Vitória$/, 'C. Vitória').replace(/^Floresta de Viridian$/, 'Floresta');
  },
  /* rota cujo número à direita cairia em cima do nome de uma cidade */
  ROTULO_A_ESQUERDA: new Set(['rota5','rota6','floresta','tunel_rocha','rota12','rota13']),

  mapa(origem){
    const aqui = Estado.dados.local;
    /* Voar, sem HM: um Voador de porte grande que voe de verdade te leva
       a qualquer cidade onde você já pisou. Sem ele, o mapa diz o que falta. */
    const voo = (typeof Campo !== 'undefined' && Campo.voar) ? Campo.voar() : {pode:false};
    this._voo = voo;
    const pos = this.POS_MAPA;
    const mostra = id => this.mapaVisivel(id);

    const linhas = [], feitas = new Set();
    for (const id of Object.keys(LOCAIS)){
      if (!mostra(id)) continue;
      for (const v of (LOCAIS[id].conexoes || [])){
        const k = [id, v].sort().join('|');
        if (feitas.has(k) || !mostra(v)) continue;
        feitas.add(k);
        const [x1, y1] = pos[id], [x2, y2] = pos[v];
        const andada = Mundo.visitado(id) && Mundo.visitado(v);
        linhas.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="mp-via${andada ? ' andada' : ''}"/>`);
      }
    }
    const viz = new Set(Mundo.vizinhos());
    const pontos = Object.keys(LOCAIS).filter(mostra).map(id => {
      const L = LOCAIS[id], [x, y] = pos[id];
      const pisou = Mundo.visitado(id) || id === aqui;
      const ir = viz.has(id);
      const voa = !ir && voo.pode && pisou && L.tipo === 'cidade' && id !== aqui;
      const cls = `mp-no ${L.tipo}${pisou ? '' : ' nao-pisado'}${id === aqui ? ' aqui' : ''}${ir ? ' vizinho' : ''}${voa ? ' voo' : ''}`;
      const forma = L.tipo === 'cidade' ? `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" rx="1.5"/>`
                  : L.tipo === 'especial' ? `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" transform="rotate(45 ${x} ${y})"/>`
                  : `<circle cx="${x}" cy="${y}" r="3.2"/>`;
      const rot = this.rotuloMapa(L);
      const esq = this.ROTULO_A_ESQUERDA.has(id);
      /* perto da borda o nome não centraliza, senão sai do quadro */
      const ancora = x < 30 ? 'start' : x > 170 ? 'end' : 'middle';
      const rotulo = L.tipo === 'rota'
        ? `<text class="mp-rota" x="${esq ? x - 5 : x + 5}" y="${y + 2.2}" text-anchor="${esq ? 'end' : 'start'}">${UI.esc(rot)}</text>`
        : `<text x="${ancora === 'start' ? x - 6 : ancora === 'end' ? x + 6 : x}" y="${y - 8}" text-anchor="${ancora}">${UI.esc(rot)}</text>`;
      return `<g class="${cls}" data-id="${id}" onclick="Exploracao.mapaInfo('${id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();Exploracao.mapaInfo('${id}')}"
        role="button" tabindex="0" aria-label="${UI.esc(L.nome)}"><title>${UI.esc(L.nome)}</title>${forma}${rotulo}</g>`;
    });
    const L = Mundo.atual();
    UI.modal('', (origem === 'mochila' ? UI.abasMochila('mapa') : '') + `<div class="mapa-kanto">
      <div class="mapa-topo">${imgItem('Mapa de Kanto')}<b>Kanto</b><span>${origem === 'parede'
        ? `na parede do Centro Pokémon de ${UI.esc(L.nome)}` : `você está ${UI.esc(emLocal(aqui))}`}</span></div>
      <svg viewBox="0 0 200 162" role="img" aria-label="Mapa de Kanto">
        <path class="mp-terra" d="M4 24 Q4 14 14 14 L184 14 Q194 14 194 24 L194 112 Q194 124 182 128 L130 134 Q112 138 96 136 L60 132 Q48 130 34 132 L10 130 Q4 128 4 118 Z"/>
        <path class="mp-ilha" d="M30 144 Q40 140 50 144 Q52 154 40 157 Q28 156 30 144 Z"/>
        <path class="mp-ilha" d="M62 142 Q72 140 78 146 Q76 154 68 154 Q60 152 62 142 Z"/>
        ${linhas.join('')}${pontos.join('')}
      </svg>
      <div class="mapa-legenda">
        <span><i class="lg cidade"></i>cidade</span><span><i class="lg rota"></i>rota</span>
        <span><i class="lg especial"></i>lugar à parte</span><span><i class="lg nao-pisado"></i>onde você nunca foi</span>
      </div>
      <div id="mapa-info" class="mapa-info" aria-live="polite"></div>
    </div>`, false, 'mapa');
    this.mapaInfo(aqui);
  },

  /* a ficha do lugar tocado no mapa: o que é, o que liga, se você já
     foi e, quando dá, o botão de ir ou de voar */
  mapaInfo(id){
    const box = document.getElementById('mapa-info');
    const L = LOCAIS[id];
    if (!box || !L) return;
    document.querySelectorAll('.mapa-kanto .mp-no.sel').forEach(g => g.classList.remove('sel'));
    const g = document.querySelector(`.mapa-kanto .mp-no[data-id="${id}"]`);
    if (g) g.classList.add('sel');

    const aqui = Estado.dados.local;
    const pisou = Mundo.visitado(id) || id === aqui;
    const voo = this._voo || {pode:false};
    const ir = Mundo.vizinhos().includes(id);
    const voa = !ir && voo.pode && pisou && L.tipo === 'cidade' && id !== aqui;
    const tipo = L.tipo === 'cidade' ? (L.porte || 'cidade') : L.tipo === 'rota' ? 'rota' : 'lugar à parte';
    const liga = (L.conexoes || []).filter(v => this.mapaVisivel(v)).map(v => LOCAIS[v].nome);
    /* o que o mapa de parede diria: o Centro tem placa. Loja e ginásio
       não têm — só aparecem aqui depois que você acha andando. */
    const tem = [];
    if ((L.lugares || []).includes('centro')) tem.push('Centro Pokémon');
    if ((L.lugares || []).includes('loja') && Mundo.descobriu('loja_' + id)) tem.push('loja');
    if (Mundo.descobriu('ginasio_' + id)) tem.push('ginásio');
    const desc = pisou && L.desc && L.desc.length ? txt(L.desc[0]) : null;
    const botao = id === aqui
      ? `<span class="mapa-aqui">Você está aqui.</span>`
      : ir && travaDaPassagem(aqui, id) ? `<span class="mapa-longe">${UI.esc(textoTrava(travaDaPassagem(aqui, id)))}</span>`
      : ir ? `<button class="btn" onclick="UI.fecharModal(true);Exploracao.viajar('${id}')">${pisou ? 'Ir para ' : 'Seguir o caminho até '}${UI.esc(L.nome)}</button>`
      : voa ? `<button class="btn" onclick="UI.fecharModal(true);Exploracao.voarPara('${id}')">Voar até ${UI.esc(L.nome)}</button>`
      : `<span class="mapa-longe">${L.tipo === 'cidade' && pisou
          ? `Longe daqui. Voar até lá pede ${UI.esc(voo.falta || 'um Pokémon voador de grande porte')}.`
          : 'Longe daqui: dá pra chegar andando pelas rotas do caminho.'}</span>`;
    box.innerHTML = `
      <div class="mi-cab"><b>${UI.esc(L.nome)}</b><span>${UI.esc(tipo)}${L.perigosa ? ' · dizem que é perigoso' : ''}</span></div>
      ${desc ? `<p class="mi-desc">${UI.esc(desc)}</p>` : `<p class="mi-desc fraco">${pisou ? '' : 'Você nunca foi lá.'}</p>`}
      <div class="mi-linhas">
        ${liga.length ? `<div><span class="k">Liga com</span> ${UI.esc(liga.join(', '))}</div>` : ''}
        ${tem.length ? `<div><span class="k">Tem</span> ${UI.esc(tem.join(', '))}</div>` : ''}
        ${pisou && id !== aqui ? '<div><span class="k">Você</span> já esteve aqui</div>' : ''}
      </div>
      <div class="mi-acao">${botao}</div>`;
  },

  /* Voo: sai daqui e desce na cidade escolhida, sem atravessar as rotas
     do meio. Leva um período do dia, como qualquer viagem curta. */
  voarPara(id){
    const v = (typeof Campo !== 'undefined') ? Campo.voar() : {pode:false};
    const L = LOCAIS[id];
    if (!v.pode || !L || !Mundo.visitado(id)) return this.tela();
    Mundo.viajar(id);
    Estado.registrar(`Voou até ${L.nome} ${v.como || ''}.`.replace(/\s+\./, '.'));
    Estado.salvar('auto');
    this.tela([{tipo:'info', texto:`${nomeExib(v.quem)} pousa em ${L.nome}. As rotas do caminho passaram lá embaixo.`}]);
  },

  /* ---------- entrar no arco que espera neste lugar ---------- */
  entrarNoArco(){
    const arco = Historia.arcoAqui();
    if (!arco || travaDoCapitulo(arco.num)) return this.tela();
    Estado.dados.modo = 'cena';
    const cena = Historia.iniciarCapitulo(arco.num);
    Estado.salvar('auto');
    UI.telaCena(cena, typeof avisosDeRumo === 'function' ? avisosDeRumo() : []);
  },

  /* ---------- viagem ---------- */
  viajar(id){
    const de = Mundo.id();
    if (travaDaPassagem(de, id)) return this.tela();
    const velho = Mundo.atual();
    const novo = Mundo.viajar(id);
    Estado.salvar('auto');
    const primeiraVez = !Estado.dados.visitados['__v_'+id];
    Estado.dados.visitados['__v_'+id] = true;
    /* Andar por rota é estar sujeito a ela: quem treina ali te para, e
       o que vive no mato sai sem pedir licença. Vale entrando numa rota
       e saindo dela — o trecho andado é o mesmo. Quem sabe ler a
       estrada escolhe melhor a hora de passar e topa com menos coisa. */
    const naRota = novo.tipo !== 'cidade' ? id : (velho && velho.tipo !== 'cidade' ? de : null);
    if (naRota){
      const L = LOCAIS[naRota];
      const onde = naRota === id ? null : naRota;
      /* saindo de uma rota pra cidade, a luta acontece ainda na rota
         e você chega depois dela */
      const chegar = (avisos) => { if (onde) Estado.dados.local = id; Estado.salvar('auto'); this.tela(avisos); };
      if (onde) Estado.dados.local = onde;
      if (Estrada.talvez('chegar', naRota)){ Jogo.depoisDaEstrada = chegar; return; }
      const t = Dados.teste(Estado.j.status.intelecto, 5, 'Rota');
      const risco = {critico:15, sucesso:25, parcial:35, falha:45}[t.grau];
      if (!this.repelenteAtivo() && Dados.chance(risco)){
        const enc = sortearSelvagem(L.ambiente, L.nivel, naRota);
        Jogo.depoisDaEstrada = chegar;
        return this.encontro(enc, [Estado.conheceu(enc.dex)
          ? `No meio do caminho, um ${enc.nome} sai ${Arenas.terreno(L.ambiente).sai} e não desvia.`
          : `No meio do caminho, um Pokémon sai ${Arenas.terreno(L.ambiente).sai} e não desvia.`]);
      }
      if (onde) Estado.dados.local = id;
    }
    this.tela(primeiraVez ? [{tipo:'info', texto:'Você nunca esteve aqui.'}] : null);
  },

  /* Um selvagem que aparece enquanto você faz outra coisa. Repelente
     segura; gente da estrada, não. Devolve true se a tela virou briga. */
  surge(situacao){
    const L = Mundo.atual();
    if (L.tipo === 'cidade') return false;
    if (Estrada.talvez(situacao)) return true;
    const ch = CHANCE_SELVAGEM_SURGE[situacao] || 0;
    if (!ch || this.repelenteAtivo() || !Dados.chance(ch)) return false;
    const p = sortearSelvagem(L.ambiente, L.nivel);
    const intro = {
      vasculhar:'Você levanta uma pedra, afasta um galho, e o que estava debaixo não gosta nada disso.',
      treinar:'O barulho do treino chama atenção de quem mora ali, e um deles vem tirar satisfação.',
      acampar:'No meio da noite, alguma coisa mexe na mochila. Quando você acende a luz, ela não foge.'
    }[situacao] || 'Um Pokémon sai do mato sem ninguém chamar.';
    this.encontro(p, [intro]);
    return true;
  },

  /* ---------- ações ---------- */
  repelenteAtivo(){
    const d = Estado.dados;
    if (!d.repelenteAte) return false;
    sincronizarHora(d.relogio);
    const agora = d.relogio.dia * 24 + d.relogio.hora;
    if (agora >= d.repelenteAte){ d.repelenteAte = 0; return false; }
    return true;
  },

  fazer(acao){
    const L = Mundo.atual();
    const d = Estado.dados;

    if (acao === 'troca'){ return Trocas.tela(); }
    if (acao.startsWith('vet_'))  return Veteranos.abordar(acao.slice(4));
    if (acao.startsWith('conv_')) return Veteranos.abrirConvite(acao.slice(5));
    if (acao.startsWith('rev_'))  return Jogo.lutarRevanche(acao.slice(4));
    if (acao.startsWith('ag_'))   return Agenda.fazer(acao.slice(3));
    if (acao.startsWith('barr_')) return Barreiras.fazer(acao.slice(5));
    if (acao.startsWith('idade_')) return PortasDaIdade.fazer(acao.slice(6));
    if (acao === 'esperar')       return this.esperar();
    if (acao.startsWith('posto_')){
      const x = Cargos.lugaresEm(Mundo.id())[+acao.slice(6)];
      return x ? UI.modalCredenciais(x.lugar) : this.tela();
    }

    if (acao === 'desafiar'){
      const pend = Estrada.pendentes();
      if (!pend.length) return this.tela([{tipo:'info', texto:'Quem treinava por aqui já lutou com você. Com mais insígnias, eles voltam a querer.'}]);
      Mundo.passar(1);
      return Estrada.desafiar(Dados.escolher(pend).id, 'procurar');
    }

    if (acao === 'procurar'){
      Mundo.passar(1);
      if (Estrada.talvez('procurar')) return;
      if (Exploracao.repelenteAtivo()){
        return this.tela([
          {tipo:'info', texto:'Você procura por um período inteiro e não acha nada. O cheiro do repelente anda com você e tudo que é Pokémon se afasta antes de você chegar.'},
          {tipo:'eco', texto:'Funciona. É esse o problema de funcionar.'}
        ]);
      }
      if (Dados.chance(78)){
        const p = sortearSelvagem(L.ambiente, L.nivel);
        return this.encontro(p, [
          Arenas.terreno(L.ambiente).andar,
          'Leva um tempo. Sempre leva mais tempo do que parece que vai levar.'
        ]);
      }
      Estado.salvar('auto');
      return this.tela([{tipo:'info', texto:'Você procura por um período inteiro e não encontra nada. Acontece.'}]);
    }

    if (acao === 'vasculhar')  return this.vasculhar();
    if (acao === 'treinar')    return this.treinar();
    if (acao === 'pescar')     return this.pescar();
    if (acao === 'acampar')    return this.acampar();
    if (acao === 'andar')      return this.andar();
    if (acao === 'conversar')  return this.conversar();
    if (acao === 'centro')     return Cidade.centro();
    if (acao === 'casa')       return Cidade.casa();
    if (acao === 'onibus')     return Cidade.onibus();
    if (acao === 'pc')         return UI.modalPC();
    if (acao === 'credenciais') return UI.modalCredenciais();
    if (acao === 'doar')       return Cidade.doar();
    if (acao === 'loja')       return Cidade.loja();
    if (acao === 'relembrar')  return Cidade.relembrar();
    if (acao === 'ginasio')    return Cidade.ginasio();
    if (acao === 'liga'){ Jogo.voltarDeGinasio = 'exploracao'; return Jogo.abrirLiga('exploracao'); }
    if (acao === 'torneio'){ Jogo.voltarDeGinasio = 'exploracao'; return Jogo.abrirLiga('exploracao'); }
    this.tela();
  },

  vasculhar(){
    const L = Mundo.atual();
    Mundo.passar(1);
    if (this.surge('vasculhar')) return;
    /* estrada também tem situação acontecendo, e nela o temperamento
       do seu time pesa mais do que em cidade */
    if (typeof Eventos !== 'undefined' && Dados.chance(40)){
      const ev = Eventos.sortear(Mundo.id());
      if (ev){ Estado.salvar('auto'); return UI.telaEvento(ev); }
    }
    const t = Dados.teste(Estado.j.status.percepcao, 5, 'Percepção');
    const avisos = [];
    let texto;

    if (t.grau === 'critico' || t.grau === 'sucesso'){
      /* Percepção acha o lugar certo; Sorte decide se tinha algo nele. */
      const sorte = Dados.teste(Estado.j.status.sorte, 5, 'Sorte');
      const achado = (sorte.grau === 'falha') ? null : Descobertas.sortear(Mundo.id(), L);
      if (achado){
        texto = achado.texto;
        if (achado.ef) Historia.aplicar(achado.ef);
        if (achado.descobre) Mundo.descobrir(achado.descobre);
      } else {
        Estado.salvar('auto');
        return this.tela(achadoDeVasculhar(L.ambiente, sorte.grau === 'critico', false, Mundo.id()));
      }
    } else if (t.grau === 'parcial'){
      /* parcial: só o rastro, sem achado */
      const av = achadoDeVasculhar(L.ambiente, false, true, Mundo.id());
      Estado.salvar('auto');
      return this.tela(av.length ? av : [{tipo:'info', texto:'Você acha rastro e pegada, e nada disso vira coisa nenhuma hoje.'}]);
    } else {
      texto = [falhaDeVasculhar(L.ambiente)];
    }
    Estado.salvar('auto');
    this.tela(texto.map(x => ({tipo:'info', texto:x})));
  },

  treinar(){
    const L = Mundo.atual();
    const d = Estado.dados;
    const vivos = Estado.timeVivo();
    if (!vivos.length) return this.tela([{tipo:'dano', texto:'Não tem ninguém em pé pra treinar.'}]);
    /* Um dia de treino por dia: o corpo precisa do resto do dia. */
    if (d.treinoDia === d.relogio.dia)
      return this.tela([{tipo:'info', texto:'O time já treinou hoje. Eles estão deitados na grama, e forçar agora é ensinar a odiar treino.'}]);
    const faltaMin = Math.ceil(((d.treinoReal || 0) + TREINO_ESPERA_MIN * 60000 - Date.now()) / 60000);
    if (faltaMin > 0)
      return this.tela([{tipo:'info', texto:'O relógio diz que é outro dia, mas o corpo deles não acredita. Ainda estão moles do último treino.'},
                        {tipo:'eco', texto:`Mais uns ${faltaMin} minuto${faltaMin > 1 ? 's' : ''} de descanso de verdade.`}]);
    if (Estado.contaItem('Ração') < TREINO_RACAO)
      return this.tela([{tipo:'info', texto:'Treinar o dia inteiro sem ter o que dar de comer no fim é pedir pra ser odiado. Falta Ração na mochila.'}]);
    /* E o lugar ensina até onde ele vai: numa rota de bicho de nível 4
       não se aprende a brigar como nível 30. Treino rende até 5 níveis
       acima da área, e cada nível acima rende menos. */
    const teto = L.nivel + 5;
    const aprendem = vivos.filter(p => p.nivel < teto);
    if (!aprendem.length)
      return this.tela([{tipo:'info', texto:'Não tem mais o que aprender aqui. O que vive neste mato não desafia o seu time: pra render, só lugar mais difícil.'}]);
    /* treino em rota é barulho, e barulho chama gente e bicho: se
       alguém aparece, a luta é o treino do dia */
    if (this.surge('treinar')){ d.treinoDia = d.relogio.dia; d.treinoReal = Date.now(); Mundo.passar(1); return; }
    d.treinoDia = d.relogio.dia; d.treinoReal = Date.now();
    Estado.usarItem('Ração', TREINO_RACAO);
    Mundo.passar(2);
    Fome.alimentarTime();
    /* Treinar é dar ordem o dia inteiro. Quem sabe mandar rende mais,
       e o time inteiro sai do dia gostando mais ou menos de você. */
    const t = Dados.teste(Estado.j.status.carisma, 6, 'Carisma');
    const fator = {critico:1.6, sucesso:1.25, parcial:1, falha:0.6}[t.grau];
    const ganho = Math.round((40 + L.nivel * 9) * fator);
    const eventos = [];
    /* de onde cada barra de XP sai, pra tela mostrar ela enchendo */
    const xpAntes = aprendem.map(p => ({uid:p.uid, nivel:p.nivel, exp:p.exp, expProx:p.expProx}));
    aprendem.forEach(p => {
      const acima = Math.max(0, p.nivel - L.nivel);
      let q = Math.round(ganho * Math.max(0.2, 1 - acima / 6));
      /* nunca passa do teto num dia só, por maior que seja o ganho */
      let falta = p.expProx - p.exp;
      for (let n = p.nivel + 1; n < teto; n++) falta += expNecessaria(n);
      q = Math.min(q, Math.max(0, falta));
      ganharExp(p, q).forEach(e => { if (e.tipo!=='exp') eventos.push(e); });
    });
    /* treinar devolve 2 de Vontade (é a regra do livro) */
    vivos.forEach(p => recuperarVontade(p, 2));
    Estado.recuperarVontadeJogador(2);
    const dMoral = {critico:4, sucesso:2, parcial:0, falha:-2}[t.grau];
    if (dMoral) vivos.forEach(p => { p.moral = Math.max(0, Math.min(100, p.moral + dMoral)); });
    const abertura = {
      critico:'Sai tudo certo hoje. Você fala pouco e eles entendem na primeira, e num certo momento você percebe que está rindo sozinh{o|a} no meio de um campo.',
      sucesso:'Vocês passam o resto do dia repetindo a mesma coisa até sair certo. É assim que fica bom, e é chato, e ninguém conta isso.',
      parcial:'Metade do dia rende e a outra metade é você explicando a mesma coisa de quatro jeitos diferentes.',
      falha:'Não engata. Você manda, eles fazem quase, você manda de novo, e no fim do dia todo mundo está de mau humor por motivo nenhum.'
    }[t.grau];
    const avisos = [{tipo:'info', texto:abertura}];
    eventos.forEach(e => {
      if (e.tipo === 'nivel') avisos.push({tipo:'info', texto:'Alguma coisa no time endureceu hoje.'});
      if (e.tipo === 'golpe') avisos.push({tipo:'info', texto:`Um deles acertou um movimento novo: ${e.golpe}.`});
    });
    Estado.salvar('auto');
    /* Golpe que não coube e evolução que chegou no treino: pergunta e
       evolui antes de voltar pro mapa, que é quando os jogos fariam. */
    Jogo.resolverPendencias(() => { this.tela(avisos.slice(0,5)); UI.barrasDeXP(xpAntes); });
  },

  pescar(){
    Mundo.passar(1);
    const L = Mundo.atual();
    /* Pescar é sorte com vara na mão. A Sorte decide se fisga e o
       quanto vale o que veio. */
    const t = Dados.teste(Estado.j.status.sorte, 5, 'Sorte');
    const chance = {critico:85, sucesso:70, parcial:50, falha:25}[t.grau];
    if (Dados.chance(chance)){
      /* o que a vara acha é o que vive na água DAQUI; sem água na
         tabela do lugar, vale a água de Kanto (lago, poça, córrego) */
      const daqui = (ENCONTROS[Mundo.id()] || []).map(x => x[0]).filter(d => DEX[d].tipos.includes('Água'));
      const aquaticos = daqui.length ? daqui : [129, 60, 118, 54, 72];
      const bonus = {critico:6, sucesso:2, parcial:0, falha:-2}[t.grau];
      const p = criarPokemon(Dados.escolher(aquaticos), Math.max(3, L.nivel + bonus + Dados.entre(-4,3)), {selvagem:true});
      return this.encontro(p, [t.grau === 'critico'
        ? 'A linha estica de uma vez só e a vara verga de um jeito que você não esperava hoje.'
        : 'A linha fica parada por muito tempo. Depois não fica.']);
    }
    Estado.salvar('auto');
    this.tela([{tipo:'info', texto:'Você pesca um período inteiro e não fisga nada. Pescador de verdade diz que isso também é pescar.'}]);
  },

  /* sentar e esperar um período: na rota, quem passa pode parar */
  esperar(){
    const L = Mundo.atual();
    Mundo.passar(1);
    if (this.surge('esperar')) return;
    Estado.salvar('auto');
    const r = Estado.dados.relogio;
    const fala = L.tipo === 'cidade'
      ? Dados.escolher(['Você senta num banco da praça e deixa a cidade passar.', 'Você encosta numa parede na sombra e conta quem entra e quem sai do Centro.', 'Você fica olhando a rua até a luz mudar de lado.'])
      : Dados.escolher(['Você senta numa pedra e deixa o tempo andar sozinho.', 'Você deita no chão com a mochila de travesseiro e fica ouvindo o lugar.', 'O time se espalha em volta. Ninguém tem pressa.']);
    this.tela([{tipo:'info', texto:fala}, {tipo:'eco', texto:`Agora é ${r.periodo}.`}]);
  },

  acampar(){
    const L = Mundo.atual();
    if (!ehNoite())
      return this.tela([{tipo:'info', texto:'Ainda está claro. Acampar é pra quando escurece.'}]);
    if (Estado.contaItem('Ração') < ACAMPAR_RACAO)
      return this.tela([{tipo:'info', texto:'Passar a noite fora sem nada pra dar de comer ao time não é acampar, é castigo. Falta Ração na mochila.'}]);
    Estado.usarItem('Ração', ACAMPAR_RACAO);
    Fome.alimentarTime();
    /* dorme até o sol: acorda às seis */
    const r = Estado.dados.relogio;
    Mundo.passarHoras(r.hora >= 18 ? 30 - r.hora : 6 - r.hora);
    if (this.surge('acampar')) return;
    /* Dormir no chão é um teste de corpo. Resistência decide quanto
       do dia seguinte você recupera de verdade. */
    const t = Dados.teste(Estado.j.status.resistencia, 5, 'Resistência');
    const prop = {critico:0.55, sucesso:0.42, parcial:0.30, falha:0.18}[t.grau];
    const meu  = {critico:8, sucesso:6, parcial:4, falha:2}[t.grau];
    Estado.dados.time.forEach(p => { if (!p.morto) p.hp = Math.min(p.hpMax, p.hp + Math.ceil(p.hpMax * prop)); });
    Estado.curarJogador(meu);
    Estado.salvar('auto');
    /* monta, a noite, acorda: o lugar muda o acampamento, e o time
       aparece na noite pelo nome */
    const linhas = textoDoAcampamento(L.ambiente, t.grau);
    this.tela(linhas.map((texto, i) => ({tipo: i === linhas.length - 1 ? 'cura' : 'info', texto})));
  },

  andar(){
    Mundo.passar(1);
    const id = Mundo.id();
    Mundo.descobrir('andou_' + id);
    if (typeof Jogo !== 'undefined' && Jogo.talvezToque && Dados.chance(30)) Jogo.talvezToque();
    /* Cidade não é cenário: tem gente no meio de alguma coisa. Antes de
       procurar lugar, vê se tem situação acontecendo. */
    if (typeof Eventos !== 'undefined' && Dados.chance(55)){
      const ev = Eventos.sortear(id);
      if (ev){ Estado.salvar('auto'); return UI.telaEvento(ev); }
    }
    /* Andar por uma cidade sem destino só rende para quem lê o
       lugar: placa, horário de porta, que rua tem movimento. */
    const t = Dados.teste(Estado.j.status.intelecto, 5, 'Intelecto');
    const achado = (t.grau === 'falha') ? null : Descobertas.sortear(id, Mundo.atual(), true);
    Estado.salvar('auto');
    if (achado){
      if (achado.ef) Historia.aplicar(achado.ef);
      if (achado.descobre) Mundo.descobrir(achado.descobre);
      return this.tela(achado.texto.map(x => ({tipo:'info', texto:x})));
    }
    this.tela([{tipo:'info', texto:'Você anda pela cidade sem destino por um período. Não acontece nada, e não acontecer nada também é uma informação sobre um lugar.'}]);
  },

  conversar(){
    Mundo.passar(1);
    const falas = Conversas.sortear(Mundo.id());
    Estado.salvar('auto');
    this.tela(falas.map(x => ({tipo:'info', texto:x})));
  },

  /* ---------- encontro selvagem ---------- */
  encontro(selvagem, intro){
    const meu = Estado.primeiroApto();
    if (!meu){
      return this.tela([{tipo:'dano', texto:'Um Pokémon se mexe no mato e você não tem ninguém em pé. Você recua devagar até o barulho ficar para trás.'}]);
    }
    Jogo.cenaBatalha = null; Jogo.ginasioAtual = null; Jogo.eliteAtual = null;
    Jogo.torneioAtual = null; Jogo.rivalAtual = null;
    Jogo.batalhaLivre = true;
    UI.limparDados();
    /* Um brilhante muda a entrada da cena antes de mudar a batalha. */
    const linhas = (intro || []).slice();
    if (selvagem.shiny) linhas.push('E aí você para, porque tem alguma coisa errada com a cor.');
    Batalha.iniciar(meu, selvagem, {tipo:'selvagem', fuga:true});
    UI.telaBatalha(linhas);
  }
};
