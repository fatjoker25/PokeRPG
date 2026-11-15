/* ============================================================
   A PATRULHA NA ESTRADA — o que está na sua ficha vem te buscar
   Os avisos da Patrulha de Kanto (d.liga: o campo ainda se chama
   assim, de quando era a Liga) eram só uma linha da Ficha. Agora,
   andando por rota (Exploracao.viajar), o oficial te para, na chance
   do que a ficha diz (CHANCE_PATRULHA), uma vez por dia no máximo, e
   nunca onde não tem ninguém (SEM_PATRULHA):
   - conversa: lendário preso que alguém viu entrar na Pokébola.
     Devolver fecha a ocorrência; recusar vira ordem de devolução;
   - ordem de devolução: devolver fecha a ordem; recusar vira ordem
     de detenção;
   - detenção: a ordem de prender (Captura.ligaReage, ou quem saiu do
     fim procurado, depois.js). Se entregar é a custódia: dias numa
     sala (DIAS_DE_CUSTODIA; DIAS_DE_CUSTODIA_DO_FIM pra quem saiu do
     fim com a ordem), a multa e o lendário preso apreendido; devolver
     antes de se entregar encurta a custódia e corta a multa pela
     metade. Lutar com o oficial: vencendo, você passa, com a ordem
     ainda aberta e a fama pior; perdendo, é a custódia com a multa em
     dobro.
   A custódia fecha a ordem, e com ela a casa volta a abrir.
   Só pesa o lendário que alguém viu: o segredo a Patrulha não sabe,
   até alguém falar (Estado.tickLendarios).
   Está na folha de regras; mudou número, muda lá.
   ============================================================ */
const CHANCE_PATRULHA = {conversa:8, devolucao:12, detencao:18};   // % por trecho de rota andado
const MULTA_PATRULHA = 2000;          // metade pra quem devolve, o dobro pra quem perde a briga
const DIAS_DE_CUSTODIA = 3;           // um terço pra quem devolve (ou já tinha soltado) antes
const DIAS_DE_CUSTODIA_DO_FIM = 30;   // a ordem que veio do fim: a ficha é mais grossa
const LINHAS_DA_PATRULHA = [58, 66, 75];   // Growlithe, Machop e Geodude, pela linha, no nível do seu time
const SEM_PATRULHA = ['norte', 'ilha_sem_nome'];
const OFICIAL_DA_ESTRADA = 'o oficial da viatura';

const Patrulha = {
  /* os lendários presos que a Patrulha sabe que estão com você */
  conhecidos(){
    const d = Estado.dados;
    return Estado.lendariosCapturados().filter(L => Estado.tem('captura_vista_' + L.dex))
      .map(L => [...d.time, ...d.pc].find(p => p.dex === L.dex && !p.morto)).filter(Boolean);
  },
  /* "Zapdos e Moltres"; com artigo, "o Zapdos e o Moltres" */
  nomes(ps, artigo){
    const n = ps.map(p => (artigo ? 'o ' : '') + DEX[p.dex].nome);
    return n.length > 1 ? n.slice(0, -1).join(', ') + ' e ' + n[n.length - 1] : (n[0] || '');
  },
  /* o que a ficha pede hoje: null quando não tem nada pra cobrar */
  tipo(){
    const l = Estado.dados.liga;
    if (l.detencao) return 'detencao';
    if (!this.conhecidos().length) return null;
    return l.ordemDevolucao ? 'devolucao' : 'conversa';
  },
  /* a ordem veio do fim (depois.js): a custódia é a do fim */
  doFim(){ return typeof Depois !== 'undefined' && Depois.ativo() && Depois.dados().s === 'procurado'; },

  /* no meio de um trecho de rota: devolve true se a tela virou a parada */
  talvez(localId){
    const d = Estado.dados;
    if (!d || d.modo === 'cena' || SEM_PATRULHA.includes(localId)) return false;
    const t = this.tipo();
    if (!t || d.liga.paradaDia === d.relogio.dia || !Dados.chance(CHANCE_PATRULHA[t])) return false;
    d.liga.paradaDia = d.relogio.dia;
    this.onde = localId;
    Estado.registrar(t === 'detencao' ? 'A Patrulha te parou na estrada, com a ordem de detenção.' : 'A Patrulha te parou na estrada.');
    Estado.salvar('auto');
    this.tela(t);
    return true;
  },

  conversa(o){
    const L = LOCAIS[this.onde] || Mundo.atual();
    UI.telaConversa(Object.assign({num:'A Patrulha', titulo:'Na estrada', loc:L.nome, quem:OFICIAL_DA_ESTRADA}, o));
  },

  tela(t){
    const ps = this.conhecidos(), nomes = this.nomes(ps), oNome = this.nomes(ps, true), Q = OFICIAL_DA_ESTRADA, varios = ps.length > 1;
    const falas = {
      conversa:[
        'No meio do trecho, uma viatura cinza parada no acostamento e um oficial sozinho, de braços cruzados, esperando você chegar.',
        fala(Q, `Tem uma ocorrência no seu nome. ${cap1(oNome)} ${varios ? 'foram vistos entrando' : 'foi visto entrando'} numa Pokébola sua.`),
        fala(Q, 'Hoje é conversa. Devolvendo agora, a ocorrência fecha aqui, e ninguém sobe com papel nenhum.')
      ],
      devolucao:[
        'A viatura cinza está parada no meio da estrada, e o oficial tem uma prancheta. Na prancheta está o seu nome.',
        fala(Q, `Ordem de devolução: ${nomes}. Por escrito, assinada.`),
        fala(Q, 'Devolvendo agora, a ordem fecha. Não devolvendo, a próxima folha é de detenção.')
      ],
      detencao:[
        'Uma viatura atravessada na estrada, dois oficiais de cinza e nenhuma pressa.',
        fala(Q, 'Tem ordem de detenção no seu nome. Dá pra vir andando.', null, 'Ele não põe a mão no cinto. Não precisa.'),
        ps.length ? fala(Q, `E ${oNome} ${varios ? 'vão junto, apreendidos' : 'vai junto, apreendido'}.`) : ''
      ]
    }[t].filter(Boolean);
    const botoes = t === 'detencao' ? [
      ...(ps.length ? [{texto:`Devolver ${oNome} e se entregar`, acao:"Patrulha.custodia('devolveu')"}] : []),
      {texto:'Se entregar', acao:"Patrulha.custodia('entregou')"},
      {texto:'Lutar pra passar', acao:'Patrulha.lutar()'}
    ] : [
      {texto:`Devolver ${oNome}`, acao:`Patrulha.devolver('${t}')`},
      {texto:'Não devolver', acao:'Patrulha.recusar()'}
    ];
    this.conversa({falas, botoes});
  },

  devolver(t){
    const d = Estado.dados, ps = this.conhecidos(), av = [];
    ps.forEach(p => Captura.soltar(p).forEach(e => av.push({tipo:e.tipo, texto:e.texto})));
    d.liga.ordemDevolucao = false;
    Estado.registrar(`Devolveu ${this.nomes(ps, true)} na frente da Patrulha.`);
    Estado.salvar('auto');
    this.conversa({falas:[
      ps.length > 1 ? 'Você abre as Pokébolas ali mesmo, na frente da viatura.' : 'Você abre a Pokébola ali mesmo, na frente da viatura.',
      fala(OFICIAL_DA_ESTRADA, 'Fechado.', null, 'Ele risca uma linha na prancheta.'),
      fala(OFICIAL_DA_ESTRADA, t === 'devolucao' ? 'A ocorrência fica no sistema. A ordem, não.' : 'Fica a ocorrência no sistema, e só.')
    ], avisos:av, botoes:[{texto:'Seguir', acao:'Exploracao.tela()'}]});
  },

  recusar(){
    const l = Estado.dados.liga, av = [];
    this.subir(av);
    Estado.registrar(l.detencao ? 'Não devolveu, e a Patrulha emitiu ordem de detenção.' : 'Não devolveu, e a Patrulha emitiu ordem de devolução.');
    Estado.salvar('auto');
    this.conversa({falas:[
      fala(OFICIAL_DA_ESTRADA, 'Anotado.', null, 'Ele não discute. Ele escreve.'),
      'A viatura sai devagar, e você fica na estrada com a Pokébola no cinto.'
    ], avisos:av, botoes:[{texto:'Seguir', acao:'Exploracao.tela()'}]});
  },

  /* recusar sobe um degrau: da conversa pra ordem de devolução, da
     ordem pra detenção (as mesmas marcas do Captura.ligaReage) */
  subir(av){
    const l = Estado.dados.liga;
    l.avisos++;
    if (!l.ordemDevolucao){
      l.ordemDevolucao = true;
      Estado.marcar('liga_aviso_2');
      av.push({tipo:'lei', texto:'Ordem formal de devolução, por escrito, com o seu nome.'});
      return;
    }
    l.detencao = true;
    Estado.marcar('liga_detencao');
    av.push({tipo:'lei', texto:'Ordem de detenção emitida. Qualquer oficial da Patrulha pode te deter.'});
    Estado.mudarRep('ruim', 1, 'Ordem de detenção da Patrulha', {rep:{notorio:true, peso:4}});
  },

  /* o lendário que a Patrulha leva: solto longe, e sem fama pra você */
  apreender(p, av){
    const d = Estado.dados;
    Estado.removerDoTime(p.uid);
    const i = d.pc.findIndex(x => x.uid === p.uid);
    if (i >= 0) d.pc.splice(i, 1);
    const L = Estado.lend(p.dex);
    L.estado = 'solto';
    L.disposicao = 'desconfiado';
    d.mundo.instabilidade = Math.max(0, d.mundo.instabilidade - 1);
    /* os do grupo param de caçar, como quando você solta (Captura.soltar) */
    [...GRUPO_CAES, ...GRUPO_AVES].forEach(dx => {
      const o = d.lendarios[dx];
      if (o && o.caçandoVoce && Estado.lend(dx).estado !== 'capturado'){ o.caçandoVoce = false; o.disposicao = 'desconfiado'; }
    });
    av.push({tipo:'mundo', texto:`O ${DEX[p.dex].nome} sai numa caixa com o distintivo da Patrulha. Soltam longe, num lugar que ninguém te conta.`});
    Estado.registrar(`O ${DEX[p.dex].nome} foi apreendido pela Patrulha.`);
  },

  /* quantos dias e quanto de multa, pelo jeito que você chegou na sala */
  conta(como){
    const doFim = this.doFim();
    const base = doFim ? DIAS_DE_CUSTODIA_DO_FIM : DIAS_DE_CUSTODIA;
    const multa = doFim ? MULTA_PATRULHA * 2 : MULTA_PATRULHA;
    return {
      dias: como === 'devolveu' ? Math.max(1, Math.round(base / 3)) : base,
      multa: como === 'devolveu' ? multa / 2 : como === 'perdeu' ? multa * 2 : multa
    };
  },

  /* como: 'devolveu' (devolveu e se entregou), 'entregou' ou 'perdeu' (a briga) */
  custodia(como){
    const d = Estado.dados, ps = this.conhecidos(), av = [];
    /* já soltou o que a Patrulha queria: vale o mesmo que devolver */
    if (como === 'entregou' && !ps.length && !this.doFim()) como = 'devolveu';
    const c = this.conta(como);
    const multa = Math.min(d.jogador.dinheiro, c.multa);
    if (como === 'devolveu') ps.forEach(p => Captura.soltar(p).forEach(e => av.push({tipo:e.tipo, texto:e.texto})));
    else ps.forEach(p => this.apreender(p, av));
    d.jogador.dinheiro -= multa;
    if (multa) av.push({tipo:'dano', texto:`−${fmtDin(multa)} ₽ de multa da Patrulha`});
    /* os dias na sala contam como vividos: o time come */
    Relogio.viver(c.dias * 24);
    d.time.forEach(curarTotal);
    Estado.curarJogador(30);
    d.liga.detencao = false;
    d.liga.ordemDevolucao = false;
    d.liga.custodias = (d.liga.custodias || 0) + 1;
    const vez = d.liga.custodias > 1 ? ` (${d.liga.custodias}ª vez)` : '';
    const quanto = c.dias === 1 ? 'um dia' : `${porExtenso(c.dias)} dias`;
    const r = Estado.mudarRep('ruim', 1, `Passou ${quanto} na custódia da Patrulha${vez}`);
    if (r && r.mudou) av.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
    if (this.doFim()) Depois.cumpriu();
    av.push({tipo:'lei', texto:'A ordem de detenção está fechada.'});
    Estado.registrar(`Saiu da custódia da Patrulha depois de ${quanto}. A ordem está fechada.`);
    Estado.salvar('auto');
    this.conversa({titulo:'A custódia', loc:'Uma sala da Patrulha', falas:[
      `${cap1(quanto)} numa sala com uma janela alta e um banco de concreto.`,
      'O time fica numa sala do lado, e alguém de cinza cuida dele com mais cuidado do que você esperava.',
      'No fim, alguém assina um papel, devolve o seu cinto e diz que a ordem está fechada.',
      fala(OFICIAL_DA_ESTRADA, 'A ficha continua. A ordem, não. Não volta pra ela.')
    ], avisos:av, botoes:[{texto:'Sair', acao:'Exploracao.tela()'}]});
  },

  lutar(){
    const meu = Estado.primeiroApto();
    /* ninguém em pé no cinto: a viatura leva */
    if (!meu) return this.custodia('perdeu');
    const nv = Math.min(85, nivelDeReferencia() + 2);
    const time = timeDeLinhas(LINHAS_DA_PATRULHA, nv, LINHAS_DA_PATRULHA.length, [], 80);
    time.forEach(x => { x.nomeAnunciado = true; });
    Jogo.cenaBatalha = null; Jogo.ginasioAtual = null; Jogo.eliteAtual = null; Jogo.torneioAtual = null;
    Jogo.rivalAtual = null; Jogo.revancheAtual = null; Jogo.estradaAtual = null; Jogo.conferenciaAtual = null;
    Jogo.veteranoAtual = null; Jogo.redeAtual = null;
    Jogo.patrulhaAtual = {local:Mundo.id()};
    Jogo.batalhaLivre = true;
    UI.limparDados();
    Batalha.iniciar(meu, time[0], {
      tipo:'treinador', fuga:false, treinador:'Oficial da Patrulha',
      erroIA:ERRO_IA_VETERANO, vontadeIA:true,
      timeInimigo:time.slice(1),
      introducao:`Oficial da Patrulha enviou ${nomeVisivel(time[0])} (Nv ${time[0].nivel})!`
    });
    UI.telaBatalha(['O oficial solta a primeira Pokébola sem tirar o olho de você.']);
  },

  resultado(fim){
    Jogo.patrulhaAtual = null;
    Jogo.batalhaLivre = false;
    if (fim.resultado === 'gameover') return UI.telaGameOver('Você caiu na estrada, brigando com a Patrulha.');
    /* desistir no meio é levantar a mão: a custódia de quem se entrega */
    if (fim.desistiu) return Jogo.resolverPendencias(() => this.custodia('entregou'));
    if (fim.resultado !== 'vitoria') return Jogo.resolverPendencias(() => this.custodia('perdeu'));
    const d = Estado.dados, av = [];
    d.liga.avisos++;
    d.liga.brigas = (d.liga.brigas || 0) + 1;
    const vez = d.liga.brigas > 1 ? ` (${d.liga.brigas}ª vez)` : '';
    const r = Estado.mudarRep('ruim', 1, `Brigou com a Patrulha pra passar${vez}`, {rep:{notorio:true}});
    if (r && r.mudou) av.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
    av.push({tipo:'lei', texto:'A ordem de detenção continua no seu nome.'});
    Estado.registrar('Brigou com a Patrulha e passou. A ordem de detenção continua.');
    Estado.salvar('auto');
    Jogo.resolverPendencias(() => this.conversa({falas:[
      'O último Pokémon do oficial cai, e ele recolhe sem pressa.',
      fala(OFICIAL_DA_ESTRADA, 'Vai. A ordem continua no seu nome, agora com mais uma linha.'),
      'Você passa pela viatura atravessada. Ninguém te segue, hoje.'
    ], avisos:av, botoes:[{texto:'Seguir', acao:'Exploracao.tela()'}]}));
  }
};
