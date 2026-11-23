/* ============================================================
   O TORNEIO DAS ILHAS — a chave de dezesseis da Ilha Sete
   A terceira competição no motor de chave do Torneio Aberto e da
   Conferência (liga.js): o sorteio, as lutas das outras quadras e a
   chave que anda são os mesmos, e aqui mora só o que é das ilhas.

   - Quem se inscreve é o elenco (sevii-elenco.js): sete de Johto, sete
     de Hoenn, a Noa se estiver livre da gangue (Sevii.noaInscrita) e o
     Magnus quando falta um pra fechar os dezesseis.
   - O time de cada um é o da ficha (timeDaFicha), seis Pokémon, menos
     o que a gangue levou e não voltou (Sevii.semDoDono): a Esme sem a
     Milotic, a Etta sem o Heracross e o Ninjask.
   - O nível acompanha os seus três mais fortes, como na Conferência,
     com piso por rodada (PISO_COPA) e o acerto de cada ficha (`ajuste`,
     medido no sim-sevii).
   - Na história, a primeira chave é a do capítulo 38: a cena entrega a
     vez pra chave (a opção com `copa`, no Jogo.escolher) e a chave
     devolve pra cena quando a tarde acaba, ganhando ou perdendo. Depois
     do arco, a arena abre todo domingo (DIA_DA_COPA), com inscrição.
   ============================================================ */
/* Medido no sim-sevii (o jogador ingênuo, com o inicial e o mato das
   ilhas, nos níveis 60, 66 e 72): aqui o nível pesa pouco, e o que pesa
   é o time montado, então quem mexe na curva é o tamanho do time */
const PISO_COPA = [56, 58, 60, 62];          // o nível mínimo do ás, por rodada
const SUBIDA_COPA = [-6, -5, -4, -3];        // em cima dos seus três mais fortes
const TAM_COPA = [3, 4, 4, 5];               // o time de cada um, por rodada: os do fim da ficha
const ERRO_IA_COPA = [14, 12, 10, 8];        // a escolha errada de golpe, por rodada
const DIA_DA_COPA = 6;                       // domingo (0 = segunda, como o Calendario)
const INSCRICAO_COPA = 3000;
const PREMIO_COPA = [
  {rodada:'Oitavas',   dinheiro:4000,  rep:0, itens:{'Hyper Potion':2}},
  {rodada:'Quartas',   dinheiro:8000,  rep:0, itens:{'Full Heal':2, 'Revive':1}},
  {rodada:'Semifinal', dinheiro:15000, rep:1, itens:{'Ultra Ball':3, 'Max Potion':1}},
  {rodada:'Final',     dinheiro:40000, rep:2, itens:{'Full Restore':2, 'Max Revive':1}}
];

/* o inscrito, pela ficha: a vaga dele no save é o id */
function inscritoDaCopa(f){
  return {id:f.id, nome:f.nome, curto:f.nome, classe:f.classe, f:!!f.f,
    de: f.regiao === 'Ilhas Sevii' ? f.de : `${f.de}, ${f.regiao}`, fala:f.torneio};
}
function inscritosDaCopa(){
  const d = Estado.dados;
  const gente = ELENCO_SEVII.filter(f => f.id !== 'magnus' && (f.id !== 'noa' || Sevii.noaInscrita(d)));
  /* o Magnus fecha os dezesseis quando falta um */
  if (gente.length < VAGAS_TORNEIO - 1) gente.push(fichaSevii('magnus'));
  return gente.slice(0, VAGAS_TORNEIO - 1).map(inscritoDaCopa);
}
function nivelDaCopa(rodada, f){
  return Math.max(PISO_COPA[rodada], nivelDeReferencia() + SUBIDA_COPA[rodada]) + ((f && f.ajuste) || 0);
}
function adversarioDaCopa(ins, rodada){
  const f = fichaSevii(ins.id);
  if (!f) return null;
  const time = timeDaFicha(f, nivelDaCopa(rodada, f), TAM_COPA[rodada], Sevii.semDoDono(f.id));
  return Object.assign(inscritoDaCopa(f), {time});
}
if (typeof CHAVES !== 'undefined') CHAVES.sevii = {
  nome:'Torneio das Ilhas',
  premios: () => PREMIO_COPA,
  inscritos: () => inscritosDaCopa(),
  adversario: (ins, rodada) => adversarioDaCopa(ins, rodada)
};

const CopaSevii = {
  inscrito(id){ return fichaSevii(id); },

  /* a arena depois do arco: domingo à tarde, uma chave por domingo */
  fechada(){
    const d = Estado.dados;
    if (!d || !Sevii.acabou(d)) return 'A arena só abre na semana do torneio.';
    const tarde = tardeDaArena('sevii', DIA_DA_COPA);
    if (!tarde) return null;
    const hoje = Calendario.hoje();
    if (hoje.semanaIdx !== DIA_DA_COPA) return `O Torneio das Ilhas volta todo domingo, à tarde. Hoje é ${hoje.semana}.`;
    return /já foi/.test(tarde.texto) ? 'O deste domingo já foi. O próximo é no domingo que vem, à uma da tarde.' : tarde.texto;
  },

  /* a entrada da arena: a inscrição, ou a chave de quem já se inscreveu */
  tela(){
    const c = Jogo.copaAtual;
    if (c) return UI.telaDaChave(c, {num:'Torneio das Ilhas', loc:'Arena da Ilha Sete',
      sub: adv => [adv.classe, adv.de].filter(Boolean).join(' · '),
      lutar:'CopaSevii.lutar()', curar:'CopaSevii.curar()', desistir:'CopaSevii.desistir()', rotDesistir:'Desistir do torneio'});
    const fechada = this.fechada();
    if (fechada) return Exploracao.tela([{tipo:'info', texto:fechada}]);
    const d = Estado.dados;
    const conta = d.copasVencidas ? `O seu nome está no quadro da entrada ${d.copasVencidas === 1 ? 'uma vez' : porExtensoF(d.copasVencidas) + ' vezes'}.` : 'O quadro da entrada tem dois nomes repetidos, e nenhum é o seu.';
    UI.telaConversa({num:'Ilhas Sevii', titulo:'A arena da Ilha Sete', loc:'Ilha Sete',
      falas:['A arquibancada de pedra enche devagar, de gente das ilhas e de quem ficou depois da semana do torneio.', conta,
        fala('Magnus', 'Domingo é domingo. Quem quiser, se inscreve. Quem não quiser, assiste e reclama.')],
      botoes:[
        {texto:`Inscrever-se — ${fmtDin(INSCRICAO_COPA)} ₽`, classe:'luta', acao:'CopaSevii.iniciar()'},
        {texto:'Ficar na arquibancada.', classe:'fim', acao:'Exploracao.tela()'}
      ]});
  },
  iniciar(){
    const d = Estado.dados;
    if (this.fechada()) return this.tela();
    if (!Estado.primeiroApto()) return UI.modal('Torneio das Ilhas', '<p class="nada">Nenhum Pokémon em pé. Cure o time antes de se inscrever.</p>');
    if (d.jogador.dinheiro < INSCRICAO_COPA) return Exploracao.tela([{tipo:'info', texto:`A inscrição custa ${fmtDin(INSCRICAO_COPA)} ₽, e você não tem.`}]);
    d.jogador.dinheiro -= INSCRICAO_COPA;
    entrarNaArena('sevii');
    Jogo.copaAtual = novaChave('sevii');
    Estado.registrar('Inscreveu-se no Torneio das Ilhas, na Ilha Sete.');
    Estado.salvar('auto');
    this.tela();
  },
  /* a primeira chave, a da história: sem inscrição, e a cena espera o fim */
  daHistoria(volta){
    const d = Estado.dados;
    entrarNaArena('sevii');
    const c = novaChave('sevii');
    c.historia = {vitoria:volta.vitoria, derrota:volta.derrota};
    Estado.marcar('sv_copa_da_historia');
    Jogo.copaAtual = c;
    Estado.registrar('Entrou na chave do Torneio das Ilhas, na Ilha Sete.');
    Estado.salvar('auto');
    this.tela();
  },

  lutar(){
    const c = Jogo.copaAtual;
    if (!c) return this.tela();
    if (!Estado.primeiroApto()) return this.resultado({resultado:'derrota'});
    const adv = c.adv || (c.adv = adversarioDaVez(c));
    const f = fichaSevii(adv.id);
    Veteranos.iniciarLuta(adv.nome, adv.time, {id:adv.id, tipo:'copa', arena:'ginasio', erroIA:ERRO_IA_COPA[c.rodada]});
    const ja = (Estado.dados.npcs[f.nome] || {}).memorias;
    UI.telaBatalha([`${PREMIO_COPA[c.rodada].rodada} — ${adv.nome}`,
      `${f.nome}: ${txt(f.torneio)}`,
      ja ? null : `${f.nome} entra pelo túnel do outro lado, ${f.classe.toLowerCase()} de ${f.de}.`].filter(Boolean));
  },

  premio(venceu){
    const c = Jogo.copaAtual;
    if (!c) return 0;
    const pr = PREMIO_COPA[c.rodada];
    return venceu ? pr.dinheiro : Math.round(pr.dinheiro * 0.2);
  },

  /* fim da tarde: quem levou o título fica guardado (o capítulo conta) */
  guardarCampeao(c, quem){
    const d = Estado.dados;
    Sevii.reg(d).campeao = quem && quem.voce ? {voce:true} : {id:quem && quem.id, nome:quem && (quem.curto || quem.nome)};
  },
  botoesDoFim(c){
    return c && c.historia ? [{texto:'Sair da arena.', acao:'CopaSevii.voltarPraHistoria()', classe:'fim'}] : null;
  },
  /* a chave da história devolve pra cena */
  voltarPraHistoria(){
    const d = Estado.dados, v = d.copaVolta;
    delete d.copaVolta;
    if (!v) return Exploracao.tela();
    Jogo.irPara(v);
  },

  resultado(fim){
    const c = Jogo.copaAtual;
    Jogo.veteranoAtual = null;
    Jogo.batalhaLivre = false;
    if (!c) return Exploracao.tela();
    if (fim.resultado === 'gameover'){ Jogo.copaAtual = null; return UI.telaGameOver('Você caiu na arena da Ilha Sete, com a arquibancada de pedra inteira de pé.'); }
    const d = Estado.dados;
    const adv = c.adv || (c.adv = adversarioDaVez(c));
    const f = fichaSevii(adv.id);
    const R = PREMIO_COPA.length, pr = PREMIO_COPA[c.rodada];
    const diz = t => fala(f.nome, String(txt(t) || '').replace(/^["“]|["”]$/g, ''));
    const venceu = fim.resultado === 'vitoria';
    const avisos = [];
    const valor = this.premio(venceu);
    Estado.j.dinheiro += valor;
    Historia.aplicar({npc:{nome:f.nome, opiniao: venceu ? 1 : 0, memoria: venceu ? `Perdeu pra você ${naRodada(pr.rodada)} do Torneio das Ilhas.` : `Ganhou de você ${naRodada(pr.rodada)} do Torneio das Ilhas.`}});
    const historia = c.historia;

    if (!venceu){
      const rodada = c.rodada;
      const campeao = terminarSemVoce(c, rodada);
      const vice = c.chave[R - 1].map(x => c.inscritos[x]).find(x => x !== campeao && !x.voce) || null;
      const chave = UI.chaveDoTorneio(c);
      this.guardarCampeao(c, campeao);
      Jogo.copaAtual = null;
      sairDaArena();
      if (historia) d.copaVolta = historia.derrota;
      avisos.push({tipo:'item', texto:`Premiação por participação: +${valor.toLocaleString('pt-BR')} ₽`});
      Estado.registrar(`Eliminad{o|a} do Torneio das Ilhas por ${f.nome} ${naRodada(pr.rodada)}. O título ficou com ${campeao.curto || campeao.nome}.`);
      Estado.salvar('auto');
      const levou = rodada === R - 1
        ? `O título fica com ${f.nome}. O seu nome fica do lado, na lousa da final, até o rapaz da cal apagar.`
        : campeao.id === adv.id
          ? `${f.nome} vai até o fim: o título é ${f.f ? 'dela' : 'dele'}${vice ? `, numa final contra ${vice.curto || vice.nome}` : ''}.`
          : `A tarde segue sem você. O título fica com ${campeao.curto || campeao.nome}${vice ? `, que ganha de ${vice.curto || vice.nome} na final` : ''}.`;
      return Jogo.resolverPendencias(() => UI.telaResultadoLiga({
        titulo:'Eliminad{o|a}', sub:`Torneio das Ilhas · ${pr.rodada}`, loc:'Ilha Sete',
        quem:f.nome, falas:[diz(f.vence), levou,
          historia ? 'A arquibancada de pedra aplaude quem sai, como aplaude quem fica. Aqui ninguém vaia: a ilha é pequena demais pra isso.'
                   : 'O Torneio das Ilhas é todo domingo. Quem veio de longe ainda está por aqui.'],
        chave, avisos, venceu:false, botoes:this.botoesDoFim({historia})
      }));
    }

    avisos.push({tipo:'item', texto:`+${valor.toLocaleString('pt-BR')} ₽`});
    for (const [n, q] of Object.entries(pr.itens || {})){ Estado.darItem(n, q); avisos.push({tipo:'item', texto:`Recebeu ${q}× ${n}.`}); }
    const fama = repDaRodada('sevii', c.rodada, pr.rep);
    if (fama){
      const m = Estado.mudarRep('bom', fama, `Avançou ${naRodada(pr.rodada)} do Torneio das Ilhas`, {rep:{notorio:true, peso:3}});
      if (m && m.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${m.de} → ${m.para}`});
    }
    fecharRodada(c, c.rodada, true);
    c.rodada++;
    const ganhos = Object.assign({}, pr.itens || {});
    const festa = () => Vitoria.rodada({
      rodadas: PREMIO_COPA.map(r => r.rodada), feitas: c.rodada,
      adversario: f.nome, nome:'Torneio das Ilhas', f:false, cor:'#2fb5a3', metal:'ouro',
      conta: `${d.copasVencidas || 1}º título`, ganho: valor, itens: ganhos
    });
    if (c.rodada >= R){
      const chave = UI.chaveDoTorneio(c);
      this.guardarCampeao(c, {voce:true});
      Jogo.copaAtual = null;
      sairDaArena();
      d.copasVencidas = (d.copasVencidas || 0) + 1;
      if (d.copasVencidas === 1){
        /* a tradição do Florian: um ovo da linhagem pra quem chega na final,
           se a caixa térmica voltou pra ele */
        if (d.flags.sv_rec_ovos){
          d.ovos = d.ovos || [];
          d.ovos.push({dex:133, choca:Creche._agora() + HORAS_DO_OVO});
          Creche.sincronizarOvos();
          avisos.push({tipo:'item', texto:`O Florian desce da arquibancada com um ovo nas duas mãos. Recebeu 1× ${NOME_DO_OVO}.`});
        }
        Estado.darItem('Troféu das Ilhas', 1);
        ganhos['Troféu das Ilhas'] = 1;
        avisos.push({tipo:'item', texto:'Recebeu 1× Troféu das Ilhas.'});
      }
      Estado.marcar('sv_campeao_das_ilhas');
      Estado.registrar(`Venceu o Torneio das Ilhas, na Ilha Sete (${d.copasVencidas}ª vez).`);
      if (historia) d.copaVolta = historia.vitoria;
      Estado.salvar('auto');
      return Jogo.resolverPendencias(() => { UI.telaResultadoLiga({
        titulo:'{CAMPEÃO|CAMPEÃ} DAS ILHAS', sub:`Torneio das Ilhas · ${d.copasVencidas}º título`, loc:'Ilha Sete',
        quem:f.nome, falas:[diz(f.perde),
          'A arquibancada de pedra levanta inteira, e o barulho desce o morro até o cais.',
          d.copasVencidas === 1 ? 'O rapaz da cal já está na lousa da entrada, com o pincel molhado, esperando você dizer como se escreve o seu nome.' : 'Na lousa da entrada, o seu nome ganha mais um risco do lado.'],
        chave, avisos, venceu:true, botoes:this.botoesDoFim({historia})
      }); Vitoria.mostrar(festa()); });
    }
    c.adv = adversarioDaVez(c);
    const tirou = quemOProximoTirou(c);
    Estado.salvar('auto');
    Jogo.resolverPendencias(() => { UI.telaResultadoLiga({
      titulo:`${f.nome} derrotad${f.f ? 'a' : 'o'}`, sub:`Torneio das Ilhas · ${rodadaVencida(pr.rodada)}`, loc:'Ilha Sete',
      quem:f.nome, falas:[diz(f.perde),
        tirou ? `Na quadra de baixo, ${c.adv.nome} passou por ${tirou.nome}.` : null,
        `Próxima: ${PREMIO_COPA[c.rodada].rodada}, contra ${c.adv.nome}.`,
        'Meia hora entre uma luta e outra. Dá pra curar o time.'],
      avisos, venceu:true, copa:true
    }); Vitoria.mostrar(festa()); });
  },

  curar(){
    Estado.dados.time.forEach(curarTotal);
    Estado.salvar('auto');
    this.tela();
  },
  desistir(){
    const c = Jogo.copaAtual;
    if (c && c.historia){
      /* na história, desistir é perder a vez: a tarde segue sem você */
      const campeao = terminarSemVoce(c, c.rodada);
      this.guardarCampeao(c, campeao);
      Estado.dados.copaVolta = c.historia.derrota;
      Jogo.copaAtual = null;
      sairDaArena();
      Estado.registrar('Desistiu do Torneio das Ilhas.');
      Estado.salvar('auto');
      return this.voltarPraHistoria();
    }
    Jogo.copaAtual = null;
    sairDaArena();
    Estado.salvar('auto');
    Exploracao.tela([{tipo:'info', texto:'Você sai da chave. O rapaz da cal apaga o seu nome da lousa com a manga.'}]);
  }
};
