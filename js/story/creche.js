/* ============================================================
   A CRECHE DA ROTA 5 E OS OVOS
   Um casal de idosos cuida de até dois Pokémon numa casa de quintal
   cercado na beira da Rota 5. Dois da mesma linha de evolução, macho e
   fêmea — ou qualquer um com Ditto — às vezes deixam um ovo. O ovo
   anda na mochila e choca com as horas do relógio; quem nasce é a
   primeira forma da linha e, com a Pokédex Nacional, o bebê de Johto
   que só sai de ovo (Pichu, Cleffa, Igglybuff, Togepi, Tyrogue,
   Smoochum, Elekid, Magby). Sem a creche, esses oito não tinham de
   onde sair, e a Pokédex Nacional nunca fechava. O Togepi não tem pai
   em Kanto: sai do ovo sem dono que o casal guarda, entregue a quem
   chega com a Pokédex Nacional.
   Tudo na folha de regras; mudou número, muda lá.
   ============================================================ */
const LUGAR_DA_CRECHE = 'rota5';
const VAGAS_DA_CRECHE = 2;
const PRECO_DIA_CRECHE = 100;
const HORAS_DO_OVO = 72;
const NIVEL_DO_OVO = 5;
const MORAL_DO_OVO = 80;
/* a cada dia junto, 1d6: o quanto pede pra aparecer um ovo */
const OVO_NO_D6 = {especie:3, linha:4, ditto:5};
/* o bebê de Johto de cada linha: só sai de ovo, e só com a Pokédex Nacional */
const BEBE_DA_LINHA = {25:172, 35:173, 39:174, 176:175, 106:236, 107:236, 124:238, 125:239, 126:240};
/* Nidoran macho e Nidoran fêmea são duas linhas no arquivo e uma família só na creche */
const FAMILIA_DA_LINHA = {32:29};
const DITTO = 132;
const NOME_DO_OVO = 'Ovo';
/* o ovo sem dono que o casal guarda: é de onde sai o Togepi, que não tem
   linha nenhuma em Kanto (como o ovo do Water Labyrinth em FireRed) */
const OVO_GUARDADO = 175;

const Creche = {
  afazeres(localId){
    return localId === LUGAR_DA_CRECHE ? [{lugar:true, id:'creche', titulo:'Creche'}] : [];
  },

  _agora(){
    const r = Estado.dados.relogio;
    if (typeof sincronizarHora === 'function') sincronizarHora(r);
    return r.dia * 24 + r.hora;
  },

  dados(){
    const d = Estado.dados;
    if (!d.creche) d.creche = {pk:[], desde:null, ovo:null, entregues:{}};
    if (!d.creche.entregues) d.creche.entregues = {};
    if (!Array.isArray(d.ovos)) d.ovos = [];
    return d.creche;
  },

  /* a primeira forma da linha (Nidoran ♂ conta como a família do ♀) */
  base(dex){
    let x = dex, g = 0;
    while (DEX[x] && DEX[x].preEvo && g++ < 6) x = DEX[x].preEvo;
    return FAMILIA_DA_LINHA[x] || x;
  },
  podeCriar(p){
    return !!p && !p.morto && !BEBES_JOHTO.includes(p.dex) && !(DEX[p.dex] || {}).lendario;
  },
  /* que par os dois fazem: 'especie', 'linha', 'ditto' ou nenhum */
  par(a, b){
    if (!this.podeCriar(a) || !this.podeCriar(b)) return null;
    const da = a.dex === DITTO, db = b.dex === DITTO;
    if (da && db) return null;
    if (da || db) return 'ditto';
    if (this.base(a.dex) !== this.base(b.dex)) return null;
    const ga = generoDe(a), gb = generoDe(b);
    if (!ga || !gb || ga === gb) return null;
    return a.dex === b.dex ? 'especie' : 'linha';
  },
  especieDoOvo(a, b){
    const mae = a.dex === DITTO ? b : b.dex === DITTO ? a : (generoDe(a) === 'f' ? a : b);
    let x = this.base(mae.dex);
    if (x === 29) x = Math.random() < .5 ? 29 : 32;         /* Nidoran: sai um dos dois */
    if (typeof dexNacional === 'function' && dexNacional() && BEBE_DA_LINHA[x]) x = BEBE_DA_LINHA[x];
    return x;
  },

  /* o tempo da creche anda só quando alguém olha: um 1d6 por dia que
     os dois passaram juntos, até sair um ovo — e o ovo espera no
     quintal, um de cada vez */
  atualizar(){
    const c = this.dados();
    if (c.ovo || c.pk.length < 2) return;
    const tipo = this.par(c.pk[0], c.pk[1]);
    if (!tipo) return;
    const agora = this._agora();
    if (c.desde == null) c.desde = agora;
    while (agora - c.desde >= 24){
      c.desde += 24;
      const dado = 1 + Math.floor(Math.random() * 6);
      if (dado >= OVO_NO_D6[tipo]){ c.ovo = {dex:this.especieDoOvo(c.pk[0], c.pk[1])}; c.desde = null; break; }
    }
  },

  conta(p){
    const dias = Math.max(1, Math.ceil((this._agora() - (p.naCreche || this._agora())) / 24));
    return dias * PRECO_DIA_CRECHE;
  },

  sincronizarOvos(){
    const d = Estado.dados;
    if (d.ovos.length) d.itens[NOME_DO_OVO] = d.ovos.length;
    else delete d.itens[NOME_DO_OVO];
  },

  /* ---------- a casa ---------- */
  abertura(){
    const d = Estado.dados;
    if (d.flags.conhece_a_creche) return 'O quintal cercado, a placa pintada à mão, o casal na varanda. O senhor levanta a xícara quando te vê chegar.';
    return 'Na beira da Rota 5, uma casa baixa de quintal cercado, com uma placa pintada à mão: CRECHE. No quintal, meia dúzia de Pokémon que não são de ninguém dali dormem no sol, e um casal de idosos toma café na varanda como quem tem o dia inteiro.';
  },
  /* o senhor repara nos dois, do jeito dele */
  comentario(){
    const c = this.dados();
    if (!c.pk.length) return null;
    if (c.pk.length === 1){
      const p = c.pk[0];
      return fala('o senhor da creche', `${nomeExib(p)} fica quiet${pron(p).o} no canto, sozinh${pron(p).o}. Mas come bem.`);
    }
    const [a, b] = c.pk;
    const tipo = this.par(a, b);
    if (tipo === 'especie') return fala('o senhor da creche', 'Esses dois não desgrudam.');
    if (tipo === 'linha') return fala('o senhor da creche', 'Esses dois se dão bem.');
    if (tipo === 'ditto') return fala('o senhor da creche', 'O Ditto passa o dia imitando o outro. O outro deixa.');
    return fala('o senhor da creche', 'Esses dois não querem saber um do outro. Cada um no seu canto do quintal.');
  },

  tela(){
    const d = Estado.dados, c = this.dados();
    this.atualizar();
    /* ovo no quintal: a senhora entrega antes de qualquer conversa */
    if (c.ovo){
      const primeiro = !c.entregues.algum;
      d.ovos.push({dex:c.ovo.dex, choca:this._agora() + HORAS_DO_OVO});
      c.entregues.algum = (c.entregues.algum || 0) + 1;
      c.ovo = null;
      c.desde = this._agora();
      this.sincronizarOvos();
      Estado.marcar('conhece_a_creche');
      Estado.registrar('Recebeu um ovo na creche da Rota 5.');
      Estado.salvar('auto');
      return Exploracao.tela([
        {tipo:'info', texto:'A senhora da creche já está no portão quando você chega, com alguma coisa embrulhada num pano de prato.'},
        {tipo:'info', texto:fala('a senhora da creche', primeiro
          ? 'Apareceu um ovo no quintal. A gente não sabe como eles chegam, ninguém nunca viu. Mas é seu.'
          : 'Mais um. Leva com cuidado e não deixa esfriar.')},
        {tipo:'info', texto:fala('a senhora da creche', 'Anda com ele. Ovo gosta de ser carregado.')},
        {tipo:'item', texto:`Recebeu 1× ${NOME_DO_OVO}.`}
      ]);
    }
    /* o ovo sem dono, uma vez, pra quem chega com a Pokédex Nacional */
    if (!c.entregues.guardado && typeof dexNacional === 'function' && dexNacional()){
      c.entregues.guardado = 1;
      d.ovos.push({dex:OVO_GUARDADO, choca:this._agora() + HORAS_DO_OVO});
      this.sincronizarOvos();
      Estado.marcar('conhece_a_creche');
      Estado.registrar('Recebeu na creche da Rota 5 o ovo que ninguém veio buscar.');
      Estado.salvar('auto');
      return Exploracao.tela([
        {tipo:'info', texto:'A senhora da creche entra em casa quando te vê e volta com um ovo no colo, enrolado numa toalha de banho.'},
        {tipo:'info', texto:fala('a senhora da creche', 'Esse apareceu no quintal faz dois invernos, sozinho, sem par nenhum por perto. Ninguém veio buscar.')},
        {tipo:'info', texto:fala('o senhor da creche', 'Ela não deixa ninguém levar. Diz que tem que ser alguém que anda muito.')},
        {tipo:'info', texto:fala('a senhora da creche', 'Você anda.')},
        {tipo:'item', texto:`Recebeu 1× ${NOME_DO_OVO}.`}
      ]);
    }
    Estado.marcar('conhece_a_creche');
    const linhas = [];
    const fichaDe = p => `<span class="creche-pk">${imgSprite(p, 'icone')}<span>${UI.esc(nomeExib(p))} <small>Nv ${p.nivel}</small></span></span>`;
    const buscar = c.pk.map((p, i) => `<button class="escolha com-item" onclick="Creche.buscar(${i})">
        ${fichaDe(p)}<span class="esc-custo">Buscar · ${fmtDin(this.conta(p))} ₽</span></button>`).join('');
    const vivos = (d.time || []).filter(p => !p.morto);
    const podeDeixar = c.pk.length < VAGAS_DA_CRECHE && vivos.length > 1;
    const deixar = podeDeixar ? vivos.map(p => `<button class="escolha com-item" onclick="Creche.deixar('${p.uid}')">
        ${fichaDe(p)}</button>`).join('') : '';
    const com = this.comentario();
    if (com) linhas.push(com);
    const html = `<p class="narrativa" style="margin:0 0 10px">${UI.esc(this.abertura())}</p>
      ${c.pk.length ? `<h4 class="creche-sec">No quintal</h4><div class="escolhas">${buscar}</div>` : ''}
      ${deixar ? `<h4 class="creche-sec">Deixar com eles</h4><div class="escolhas">${deixar}</div>` : ''}
      ${!c.pk.length && vivos.length <= 1 ? `<p class="sussurro">Com um Pokémon só no cinto, não tem quem deixar.</p>` : ''}`;
    if (linhas.length) Exploracao.tela(linhas.map(t => ({tipo:'info', texto:t})));
    UI.modal('Creche da Rota 5', html, false, 'creche');
  },

  deixar(uid){
    const d = Estado.dados, c = this.dados();
    const vivos = (d.time || []).filter(p => !p.morto);
    const i = d.time.findIndex(p => p.uid === uid);
    if (i < 0 || c.pk.length >= VAGAS_DA_CRECHE || vivos.length <= 1) return;
    const [p] = d.time.splice(i, 1);
    p.naCreche = this._agora();
    c.pk.push(p);
    if (c.pk.length === 2) c.desde = this._agora();
    Estado.registrar(`Deixou ${nomeExib(p)} na creche da Rota 5.`);
    Estado.salvar('auto');
    UI.fecharModal(true);
    Exploracao.tela([
      {tipo:'info', texto:fala('o senhor da creche', c.pk.length === 1
        ? 'Deixa com a gente. Aqui ninguém treina e ninguém briga. A gente cuida e cobra a diária.'
        : 'Os dois no quintal, então. A gente fica de olho.')},
      {tipo:'info', texto:fala('a senhora da creche', `Cem por dia. Paga quando vier buscar.`)},
      {tipo:'info', texto:`${nomeExib(p)} atravessa o portão do quintal e não olha pra trás.`}
    ]);
  },

  buscar(i){
    const d = Estado.dados, c = this.dados();
    const p = c.pk[i];
    if (!p) return;
    const conta = this.conta(p);
    const pago = Math.min(conta, Estado.j.dinheiro);
    Estado.j.dinheiro -= pago;
    c.pk.splice(i, 1);
    c.desde = null;
    delete p.naCreche;
    curarTotal(p);
    const vaiPro = d.time.length < 6 ? 'time' : 'pc';
    (vaiPro === 'time' ? d.time : d.pc).push(p);
    Estado.registrar(`Buscou ${nomeExib(p)} na creche da Rota 5.`);
    Estado.salvar('auto');
    UI.fecharModal(true);
    Exploracao.tela([
      {tipo:'info', texto:fala('o senhor da creche', pago < conta
        ? `Tá aqui. Fica o que você tem, e a gente se acerta outro dia.`
        : `Tá aqui. Comeu bem, dormiu bem.`)},
      {tipo:'item', texto:`−${fmtDin(pago)} ₽`},
      {tipo:'pokemon', texto:`${nomeExib(p)} voltou.${notaDestino(vaiPro)}`}
    ]);
  },

  /* ---------- o ovo na mochila ---------- */
  /* chamada na tela do mapa: choca o que já deu a hora */
  nascer(){
    const d = Estado.dados;
    if (!d || !Array.isArray(d.ovos) || !d.ovos.length) return null;
    const agora = this._agora();
    const prontos = d.ovos.filter(o => agora >= o.choca);
    if (!prontos.length) return null;
    d.ovos = d.ovos.filter(o => agora < o.choca);
    this.sincronizarOvos();
    const avisos = [];
    prontos.forEach(o => {
      const p = criarPokemon(o.dex, NIVEL_DO_OVO, {historia:'Nasceu de um ovo da creche da Rota 5, na sua mochila.'});
      p.moral = Math.max(p.moral || 0, MORAL_DO_OVO);
      const onde = Estado.adicionar(p);
      Estado.registrar(`Do ovo da creche nasceu ${p.nome}.`);
      avisos.push({tipo:'info', texto:'O ovo da mochila está quente demais, e mexe. Você tira ele, põe no chão, e a casca racha de cima pra baixo.'});
      avisos.push({tipo:'pokemon', texto:`Do ovo saiu ${p.nome} (Nv ${p.nivel}).${notaDestino(onde)}`});
    });
    Estado.salvar('auto');
    return avisos;
  },
  /* a ficha do ovo na mochila: quanto falta, sem conta exata */
  notaDosOvos(){
    const d = Estado.dados;
    if (!d || !Array.isArray(d.ovos) || !d.ovos.length) return '';
    const falta = Math.min(...d.ovos.map(o => o.choca - this._agora()));
    const quando = falta <= 6 ? 'está quase' : falta <= 24 ? 'choca hoje ou amanhã' : `choca em uns ${Math.ceil(falta / 24)} dias`;
    return d.ovos.length > 1 ? `O mais adiantado ${quando}.` : `Esse ${quando}.`;
  }
};
