/* ============================================================
   EXPLORAÇÃO — a tela onde você decide o que fazer e pra onde ir
   ============================================================ */
const Exploracao = {

  tela(avisos){
    Estado.dados.modo = 'mundo';
    UI.limpar();
    UI.add(UI.topo());
    const L = Mundo.atual();
    const d = Estado.dados;
    const arco = Historia.arcoAqui();

    /* Lugar e ação não são a mesma coisa e não merecem o mesmo botão:
       lugar é porta que você abre, ação é tempo que você gasta. */
    const todos = afazeresDoLocal();
    const lugares = todos.filter(a => a.lugar).map(a =>
      `<button class="porta" onclick="Exploracao.fazer('${a.id}')">
        <span class="porta-nome">${UI.esc(a.titulo)}</span>
        <span class="porta-sub">${UI.esc(a.sub)}</span></button>`).join('');
    const afazeres = todos.filter(a => !a.lugar).map(a =>
      `<button class="escolha" onclick="Exploracao.fazer('${a.id}')">
        ${UI.esc(a.titulo)}<br><span class="pd">${UI.esc(a.sub)}</span></button>`).join('');

    const vizinhos = Mundo.vizinhos().map(id => {
      const v = LOCAIS[id];
      const conhecido = Mundo.visitado(id);
      return `<button class="escolha" onclick="Exploracao.viajar('${id}')">
        ${conhecido ? 'Ir para ' + UI.esc(v.nome) : 'Seguir o caminho — ' + UI.esc(v.nome)}
        <br><span class="pd">${conhecido ? UI.esc(v.tipo === 'cidade' ? v.porte || 'cidade' : 'rota') : 'você nunca foi lá'}${v.perigosa ? ' · dizem que é perigoso' : ''}</span></button>`;
    }).join('');

    UI.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">${UI.esc(d.relogio.periodo)} · dia ${d.relogio.dia}</div>
        <div class="tit">${UI.esc(L.nome)}</div>
        <div class="loc">${UI.esc(L.tipo === 'cidade' ? (L.porte||'cidade') : (L.tipo==='rota'?'rota':'lugar'))}</div>
      </div>
      <div class="narrativa">${(L.desc||[]).map(t=>`<p>${UI.esc(t)}</p>`).join('')}${
        (() => { const r = (typeof comoOlugarTeRecebe === 'function') ? comoOlugarTeRecebe() : null;
                 return r ? `<p class="recepcao">${UI.esc(r)}</p>` : ''; })()}</div>
      <div id="avisos" class="avisos"></div>

      ${arco ? `<h3>Aqui</h3>
        <div id="escolhas" class="escolhas">
          <button class="escolha" style="border-color:var(--destaque)" onclick="Exploracao.entrarNoArco()">
            ${UI.esc(arco.chamada)}<br><span class="pd">Isso vai tomar o seu tempo e provavelmente mudar alguma coisa.</span></button>
        </div>` : ''}

      ${lugares ? `<h3>Onde entrar</h3>
        <div class="portas">${lugares}</div>` : ''}

      <h3>O que fazer</h3>
      <div class="escolhas">${afazeres}</div>

      <h3 class="com-mapa">Para onde ir
        ${Estado.contaItem('Mapa de Kanto')
          ? `<button class="btn mini abre-mapa" onclick="Exploracao.mapa()">${imgItem('Mapa de Kanto')}Mapa</button>`
          : (this.temCentro(L) ? `<button class="btn mini abre-mapa" onclick="Exploracao.mapa('parede')">${imgItem('Mapa de Kanto')}Mapa do Centro</button>` : '')}</h3>
      <div class="escolhas">${vizinhos}</div>
    </div>`);

    if (avisos && avisos.length) UI.avisos(avisos);
    UI.rolarTopo();
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

  mapa(origem){
    const aqui = Estado.dados.local;
    const viz = new Set(Mundo.vizinhos());
    /* Voar, sem HM: um Voador de porte grande que voe de verdade te leva
       a qualquer cidade onde você já pisou. Sem ele, o mapa diz o que falta. */
    const voo = (typeof Campo !== 'undefined' && Campo.voar) ? Campo.voar() : {pode:false};
    const pos = this.POS_MAPA;
    const sabe = id => Mundo.visitado(id) || id === aqui;
    const conhecidos = new Set(Object.keys(LOCAIS).filter(sabe));
    /* a estrada que sai de um lugar conhecido existe, mesmo sem nome */
    const avistados = new Set();
    for (const id of conhecidos) (LOCAIS[id].conexoes || []).forEach(v => { if (!conhecidos.has(v)) avistados.add(v); });
    const mostra = id => pos[id] && (conhecidos.has(id) || avistados.has(id));

    const linhas = [], feitas = new Set();
    for (const id of Object.keys(LOCAIS)){
      if (!mostra(id)) continue;
      for (const v of (LOCAIS[id].conexoes || [])){
        const k = [id, v].sort().join('|');
        if (feitas.has(k) || !mostra(v) || !(conhecidos.has(id) || conhecidos.has(v))) continue;
        feitas.add(k);
        const [x1, y1] = pos[id], [x2, y2] = pos[v];
        const firme = conhecidos.has(id) && conhecidos.has(v);
        linhas.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="mp-via${firme ? '' : ' incerta'}"/>`);
      }
    }
    const pontos = Object.keys(LOCAIS).filter(mostra).map(id => {
      const L = LOCAIS[id], [x, y] = pos[id];
      const conhecido = conhecidos.has(id);
      const nome = conhecido ? L.nome : 'caminho que você ainda não fez';
      const ir = viz.has(id);
      const voa = !ir && voo.pode && conhecido && L.tipo === 'cidade' && id !== aqui;
      const cls = `mp-no ${L.tipo}${conhecido ? '' : ' desconhecido'}${id === aqui ? ' aqui' : ''}${ir ? ' vizinho' : ''}${voa ? ' voo' : ''}`;
      const forma = L.tipo === 'cidade' ? `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" rx="1.5"/>`
                  : L.tipo === 'especial' ? `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" transform="rotate(45 ${x} ${y})"/>`
                  : `<circle cx="${x}" cy="${y}" r="3"/>`;
      const rotulo = conhecido && L.tipo !== 'rota'
        ? `<text x="${x}" y="${y - 8}" text-anchor="middle">${UI.esc(L.nome.replace(/^Floresta de /, 'Fl. '))}</text>` : '';
      const acao = ir ? ` onclick="UI.fecharModal(true);Exploracao.viajar('${id}')" role="button" tabindex="0"`
                 : voa ? ` onclick="UI.fecharModal(true);Exploracao.voarPara('${id}')" role="button" tabindex="0"` : '';
      return `<g class="${cls}"${acao}><title>${UI.esc(nome)}${ir ? ' — ir pra lá' : voa ? ' — voar até lá' : ''}</title>${forma}${rotulo}</g>`;
    });
    const L = Mundo.atual();
    UI.modal('', `<div class="mapa-kanto">
      <div class="mapa-topo">${imgItem('Mapa de Kanto')}<b>Kanto</b><span>${origem === 'parede'
        ? `na parede do Centro Pokémon de ${UI.esc(L.nome)}` : `você está em ${UI.esc(L.nome)}`}</span></div>
      <svg viewBox="0 0 200 162" role="img" aria-label="Mapa de Kanto">
        <path class="mp-terra" d="M4 24 Q4 14 14 14 L184 14 Q194 14 194 24 L194 112 Q194 124 182 128 L130 134 Q112 138 96 136 L60 132 Q48 130 34 132 L10 130 Q4 128 4 118 Z"/>
        <path class="mp-ilha" d="M30 144 Q40 140 50 144 Q52 154 40 157 Q28 156 30 144 Z"/>
        <path class="mp-ilha" d="M62 142 Q72 140 78 146 Q76 154 68 154 Q60 152 62 142 Z"/>
        ${linhas.join('')}${pontos.join('')}
      </svg>
      <p class="sussurro">Quadrado é cidade, ponto é rota, losango é lugar à parte. Toque num lugar vizinho pra ir.</p>
      <p class="sussurro mapa-voo">${voo.pode
        ? `Voar: ${UI.esc(nomeExib(voo.quem))} te leva a qualquer cidade onde você já pisou (as de borda dourada).`
        : `Voar até uma cidade distante pede ${UI.esc(voo.falta || 'um Pokémon voador de grande porte')}.`}</p>
    </div>`, false, 'mapa');
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
    if (!arco) return this.tela();
    Estado.dados.modo = 'cena';
    const cena = Historia.iniciarCapitulo(arco.num);
    Estado.salvar('auto');
    UI.telaCena(cena);
  },

  /* ---------- viagem ---------- */
  viajar(id){
    const novo = Mundo.viajar(id);
    Estado.salvar('auto');
    const primeiraVez = !Estado.dados.visitados['__v_'+id];
    Estado.dados.visitados['__v_'+id] = true;
    const avisos = [];
    // algo acontece no caminho, de vez em quando — quem sabe ler a
    // estrada escolhe melhor a hora de passar e topa com menos coisa
    if (novo.tipo !== 'cidade'){
      const t = Dados.teste(Estado.j.status.intelecto, 5, 'Rota');
      const risco = {critico:10, sucesso:18, parcial:28, falha:40}[t.grau];
      if (Dados.chance(risco)){
        const enc = sortearSelvagem(novo.ambiente, novo.nivel, id);
        return this.encontro(enc, [Estado.conheceu(enc.dex)
          ? `No meio do caminho, um ${enc.nome} sai do mato e não desvia.`
          : 'No meio do caminho, um Pokémon sai do mato e não desvia.']);
      }
    }
    this.tela(primeiraVez ? [{tipo:'info', texto:'Você nunca esteve aqui.'}] : null);
  },

  /* ---------- ações ---------- */
  repelenteAtivo(){
    const d = Estado.dados;
    if (!d.repelenteAte) return false;
    const agora = d.relogio.dia * 4;
    if (agora >= d.repelenteAte){ d.repelenteAte = 0; return false; }
    return true;
  },

  fazer(acao){
    const L = Mundo.atual();
    const d = Estado.dados;

    if (acao === 'troca'){ return Trocas.tela(); }

    if (acao === 'procurar'){
      Mundo.passar(1);
      if (Exploracao.repelenteAtivo()){
        return this.tela([
          {tipo:'info', texto:'Você procura por um período inteiro e não acha nada. O cheiro do repelente anda com você e o mato se afasta antes de você chegar.'},
          {tipo:'eco', texto:'Funciona. É esse o problema de funcionar.'}
        ]);
      }
      if (Dados.chance(78)){
        const p = sortearSelvagem(L.ambiente, L.nivel);
        return this.encontro(p, [
          'Você anda devagar pelo mato alto, parando a cada poucos passos.',
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
        texto = ['Você vasculha a área inteira com método e acha o que sobra quando alguém já passou antes: nada de valor e muita informação sobre quem passou.'];
      }
    } else if (t.grau === 'parcial'){
      texto = ['Você acha rastro, pegada e lixo, e nada disso vira coisa nenhuma hoje.',
               'Mas agora você conhece esse pedaço de chão melhor do que conhecia.'];
    } else {
      texto = ['Você passa um período procurando no lugar errado.',
               'Quando percebe, já escureceu um pouco e você está com fome.'];
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
    /* E o lugar ensina até onde ele vai: numa rota de bicho de nível 4
       não se aprende a brigar como nível 30. Treino rende até 5 níveis
       acima da área, e cada nível acima rende menos. */
    const teto = L.nivel + 5;
    const aprendem = vivos.filter(p => p.nivel < teto);
    if (!aprendem.length)
      return this.tela([{tipo:'info', texto:'Não tem mais o que aprender aqui. O que vive neste mato não desafia o seu time: pra render, só lugar mais difícil.'}]);
    d.treinoDia = d.relogio.dia;
    Mundo.passar(2);
    /* Treinar é dar ordem o dia inteiro. Quem sabe mandar rende mais,
       e o time inteiro sai do dia gostando mais ou menos de você. */
    const t = Dados.teste(Estado.j.status.carisma, 6, 'Carisma');
    const fator = {critico:1.6, sucesso:1.25, parcial:1, falha:0.6}[t.grau];
    const ganho = Math.round((40 + L.nivel * 9) * fator);
    const eventos = [];
    aprendem.forEach(p => {
      const acima = Math.max(0, p.nivel - L.nivel);
      let q = Math.round(ganho * Math.max(0.2, 1 - acima / 6));
      /* nunca passa do teto num dia só, por maior que seja o ganho */
      let falta = p.expProx - p.exp;
      for (let n = p.nivel + 1; n < teto; n++) falta += expNecessaria(n);
      q = Math.min(q, Math.max(0, falta));
      ganharExp(p, q).forEach(e => { if (e.tipo!=='exp') eventos.push(e); });
    });
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
    Jogo.resolverPendencias(() => this.tela(avisos.slice(0,5)));
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

  acampar(){
    Mundo.passar(1);
    /* Dormir no chão é um teste de corpo. Resistência decide quanto
       do dia seguinte você recupera de verdade. */
    const t = Dados.teste(Estado.j.status.resistencia, 5, 'Resistência');
    const prop = {critico:0.55, sucesso:0.42, parcial:0.30, falha:0.18}[t.grau];
    const meu  = {critico:8, sucesso:6, parcial:4, falha:2}[t.grau];
    Estado.dados.time.forEach(p => { if (!p.morto) p.hp = Math.min(p.hpMax, p.hp + Math.ceil(p.hpMax * prop)); });
    Estado.curarJogador(meu);
    Estado.salvar('auto');
    const texto = {
      critico:'Vocês param, e por algum motivo essa noite funciona: o fogo pega de primeira, o chão não incomoda, e você acorda antes do sol sem estar cansad{o|a}.',
      sucesso:'Vocês param. Fogo pequeno, comida ruim, chão duro. Ninguém dorme direito e todo mundo melhora um pouco.',
      parcial:'Vocês param. Você acorda três vezes e uma delas é por nada.',
      falha:'Vocês param, e a noite é ruim. Frio pelas costas, raiz nas costelas, e de manhã você está pior do que deitou.'
    }[t.grau];
    this.tela([{tipo:'cura', texto}]);
  },

  andar(){
    Mundo.passar(1);
    const id = Mundo.id();
    if (typeof Jogo !== 'undefined' && Jogo.talvezToque && Dados.chance(30) && Jogo.talvezToque()) return;
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
