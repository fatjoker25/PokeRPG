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
/* a final era com cinco, e o título saía em 2% a 5% das vezes (a final
   em 15% a 22%): com quatro, a final fica em 36% a 51% e o título em 6% a
   11%, e as rodadas de antes não mudam. Quem atravessa de Kanto também
   leva um a menos na final (a Odette e o Dax, que caíam fácil, não) */
const TAM_COPA = [3, 4, 4, 4];               // o time de cada um, por rodada: os do fim da ficha
const ERRO_IA_COPA = [14, 12, 10, 8];        // a escolha errada de golpe, por rodada
/* quem atravessa de Kanto traz o time das linhas (liga.js), sem a
   ficha montada do elenco: o Pokémon a mais por rodada é o que segura
   a curva no lugar dela (medido no sim-sevii com PARTIU=1). Quem tem
   time que o jogador comum não aguenta (a água e o gelo do Ewan, os
   fantasmas da Morwen) leva menos (`mais` na entrada dele); quem tem
   espécie que cai fácil, mais. */
const TAM_VIAJANTE = [1, 1, 1, 1];
const DIA_DA_COPA = 6;                       // domingo (0 = segunda, como o Calendario)
const INSCRICAO_COPA = 3000;
const PREMIO_COPA = [
  {rodada:'Oitavas',   dinheiro:4000,  rep:0, itens:{'Hyper Potion':2}},
  {rodada:'Quartas',   dinheiro:8000,  rep:0, itens:{'Full Heal':2, 'Revive':1}},
  {rodada:'Semifinal', dinheiro:15000, rep:1, itens:{'Ultra Ball':3, 'Max Potion':1}},
  {rodada:'Final',     dinheiro:40000, rep:2, itens:{'Full Restore':2, 'Max Revive':1}}
];

/* Depois que quem veio de Johto e de Hoenn embarca no Anne
   (Sevii.partiu), o domingo da Ilha Sete é de quem atravessa de Kanto
   na balsa: os inscritos de sempre do Torneio Aberto (liga.js), com o
   time das linhas deles e as falas daqui, o Magnus e a Noa. `ajuste` é o
   acerto de nível na chave das ilhas, medido no sim-sevii (PARTIU=1). */
const VIAJANTES_DA_COPA = {
  ronan:{torneio:'"Vim de balsa. Dragão não gosta de balsa, e eu não gosto de dragão enjoado. Vamos logo."',
    vence:'"Vou contar isso no Planalto. Vão dizer que eu inventei."', perde:'"Perdi longe de casa. Pelo menos ninguém do Planalto viu."'},
  sabine:{torneio:'"Sonhei com esta arena antes de saber que ela existia. A pedra era desta cor."',
    vence:'"No sonho você ganhava. Sonho também erra."', perde:'"Eu sabia. Vim assim mesmo. É o que eu faço."'},
  ewan:{torneio:'"Atravessei pela pesca: diz que no cabo da Ilha Dois o Mantine sobe na linha. O torneio é pra pagar a balsa."',
    vence:'"Paguei a balsa de volta. E a de ida."', perde:'"Tudo bem. A pesca daqui compensa."', mais:[0, 0, 0, 0]},
  felix:{torneio:'"De Cinnabar até aqui é uma balsa e meia. Faltei na aula de sexta pra chegar a tempo."',
    vence:'"Vou escrever isso na redação de segunda."', perde:'"Anotei tudo. Na próxima eu chego com a lição feita."'},
  kaia:{torneio:'"Dormi três noites na praia da Ilha Quatro pra economizar a pousada. A areia daqui é melhor que a de Kanto."',
    vence:'"Pronto: a pousada desta noite está paga."', perde:'"Volto pra praia, então. Eu gosto da praia."'},
  rocco:{torneio:'"O dojô me mandou ver se o torneio das ilhas é sério. Se eu voltar de mão vazia, varro o tatame um mês."',
    vence:'"Isso eu levo pro dojô. A vassoura fica com outro."', perde:'"Um mês de vassoura. Valeu ver isso de perto."', mais:[0, 0, 0, 0]},
  marina:{torneio:'"Hoje de manhã eu nadei até a pedra do farol e voltei. A água daqui é outra coisa. Agora eu estou quente."',
    vence:'"Amanhã eu nado até a outra pedra. Comemoração."', perde:'"Vou nadar um pouco. Faz bem pra cabeça."', mais:[0, 0, 0, 0]},
  avery:{torneio:'"Vim contar Pokémon voador nas ilhas. Já são onze espécies que Kanto não tem. A arena é o intervalo."',
    vence:'"Dia de sorte: um Noctowl de manhã e uma vitória de tarde."', perde:'"Tudo bem. Na balsa de volta eu conto o que passar voando."', mais:[2, 2, 2, 1]},
  morwen:{torneio:'"O cânion da Ilha Sete é quieto como a Torre de madrugada. Eu gostei daqui."',
    vence:'"A arquibancada fez silêncio na hora certa. Agradeço a quem fez."', perde:'"Foi bonito. Eu vou lembrar do barulho da pedra."', mais:[0, 0, 0, -1]},
  freya:{torneio:'"Lá em casa é gelo. Aqui é pedra quente e sol. Vim ver se o meu time derrete."',
    vence:'"Não derreteu."', perde:'"Derreteu um pouco. Volto no inverno."', mais:[0, 0, 0, 0]},
  odette:{torneio:'"Trouxe chapéu, sombrinha e os meus melhores. Os meus melhores enjoaram na balsa. Eu não."',
    vence:'"Que tarde agradável."', perde:'"Que tarde agradável, mesmo assim. Quase."', mais:[2, 2, 2, 2]},
  willa:{torneio:'"Folga de três dias, e eu passo dois aqui. O meu chefe acha que eu fui pra casa da minha mãe."',
    vence:'"Valeu a folga."', perde:'"Ainda tem um dia de folga. Vou passar na praia."'},
  dax:{torneio:'"O monte da Ilha Um esquenta a sola do sapato. Me senti em casa."',
    vence:'"Isso aquece mais que forno."', perde:'"Volto pro forno. Lá pelo menos eu sei mexer no fogo."', mais:[2, 2, 2, 2]},
  zara:{torneio:'"Eu danço no cais pra quem chega de barco. Dessa vez quem chegou de barco fui eu."',
    vence:'"Agora eu danço pra mim."', perde:'"Dança de despedida, então. Você mereceu."'},
  remy:{torneio:'"Fechei a cozinha no domingo pra vir. Se eu cair cedo, ainda pego a balsa e abro pro jantar."',
    vence:'"Hoje o jantar é por minha conta. Na cozinha, não aqui."', perde:'"Tudo bem. Ainda dá tempo de abrir pro jantar."', mais:[0, 0, 0, 0]},
  ambrose:{torneio:'"Eu atravesso pra cá todo verão desde antes de você nascer. O torneio é novo pra mim; a balsa, não."',
    vence:'"Um velho também ganha uma de vez em quando."', perde:'"Perdi quase todas, a vida inteira. Esta foi das boas de perder."'},
  abel:{torneio:'"Eu crio, não batalho. Mas os meus queriam ver o mar, e o mar é aqui."',
    vence:'"Viu? Os meus batalham."', perde:'"Eles se divertiram. Eu também, um pouco."'},
  quincy:{torneio:'"Vim pela vitrine: aqui tinha time de Johto e de Hoenn. Foram embora, e sobrou você."',
    vence:'"Anotei o seu time inteiro. Pra coleção."', perde:'"Vi de perto. Valeu a balsa."'},
};
/* quem está na chave: a ficha do elenco, ou o viajante de Kanto, com os
   campos que a arena lê (nome, classe, de, f, torneio, vence, perde) */
function quemNaCopa(id){
  const f = fichaSevii(id);
  if (f) return f;
  const v = VIAJANTES_DA_COPA[id], r = v && typeof inscritoDoTorneio === 'function' ? inscritoDoTorneio(id) : null;
  if (!r || !r.linhas) return null;
  const lugar = String(r.de || '').replace(/^(do|da|de|dos|das) /, '');
  return {id, nome:r.nome, classe:r.classe || 'Treinador', f:!!r.f, de:lugar, deDito:r.de || '', regiao:'Kanto',
    torneio:v.torneio, vence:v.vence, perde:v.perde, ajuste:v.ajuste || 0, mais:v.mais || null, viajante:r};
}
/* o inscrito, pela ficha: a vaga dele no save é o id */
function inscritoDaCopa(f){
  return {id:f.id, nome:f.nome, curto:f.nome, classe:f.classe, f:!!f.f,
    de: f.regiao === 'Ilhas Sevii' ? f.de : `${f.de}, ${f.regiao}`, fala:f.torneio};
}
function inscritosDaCopa(){
  const d = Estado.dados;
  if (Sevii.partiu(d)){
    /* depois do Anne: o Magnus, a Noa se estiver livre, e quem atravessa de Kanto */
    const locais = ELENCO_SEVII.filter(f => f.regiao === 'Ilhas Sevii' && (f.id !== 'noa' || Sevii.noaInscrita(d)));
    const viajantes = _embaralhar(Object.keys(VIAJANTES_DA_COPA).map(quemNaCopa).filter(Boolean));
    return locais.concat(viajantes).slice(0, VAGAS_TORNEIO - 1).map(inscritoDaCopa);
  }
  const gente = ELENCO_SEVII.filter(f => f.id !== 'magnus' && (f.id !== 'noa' || Sevii.noaInscrita(d)));
  /* o Magnus fecha os dezesseis quando falta um */
  if (gente.length < VAGAS_TORNEIO - 1) gente.push(fichaSevii('magnus'));
  return gente.slice(0, VAGAS_TORNEIO - 1).map(inscritoDaCopa);
}
function nivelDaCopa(rodada, f){
  return Math.max(PISO_COPA[rodada], nivelDeReferencia() + SUBIDA_COPA[rodada]) + ((f && f.ajuste) || 0);
}
function adversarioDaCopa(ins, rodada){
  const f = quemNaCopa(ins.id);
  if (!f) return null;
  if (f.viajante){
    const r = f.viajante;
    const mais = (f.mais || TAM_VIAJANTE)[rodada];
    const time = timeDeLinhas(r.linhas, nivelDaCopa(rodada, f), Math.min(6, TAM_COPA[rodada] + mais), r.golpes || [], 90);
    if (r.segura && time.length) time[time.length - 1].segurando = r.segura;
    return Object.assign(inscritoDaCopa(f), {time});
  }
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
  inscrito(id){ return quemNaCopa(id); },

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
      falas:[Sevii.partiu(d)
          ? 'A arquibancada de pedra enche devagar, de gente das ilhas e de quem desce da balsa de Kanto com a mochila nas costas.'
          : 'A arquibancada de pedra enche devagar, de gente das ilhas e de quem ficou depois da semana do torneio.', conta,
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
    const f = quemNaCopa(adv.id);
    Veteranos.iniciarLuta(adv.nome, adv.time, {id:adv.id, tipo:'copa', arena:'ginasio', erroIA:ERRO_IA_COPA[c.rodada]});
    const ja = (Estado.dados.npcs[f.nome] || {}).memorias;
    UI.telaBatalha([`${PREMIO_COPA[c.rodada].rodada} — ${adv.nome}`,
      `${f.nome}: ${txt(f.torneio)}`,
      ja ? null : `${f.nome} entra pelo túnel do outro lado, ${f.classe.toLowerCase()} ${f.deDito || 'de ' + f.de}.`].filter(Boolean));
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
    const f = quemNaCopa(adv.id);
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
                   : Sevii.partiu(d) ? 'O Torneio das Ilhas é todo domingo, e a balsa de Kanto traz gente nova a cada um.'
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
    if (c.rodada === R - 1) this.ovoDoFlorian(d, avisos);
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

  /* a tradição do Florian (o jantar do Anne): um ovo da linhagem pra quem
     chega na final, uma vez, se a caixa térmica voltou pra ele. Depois do
     Anne, o ovo espera com a dona da pousada, pra quem o Florian conheceu.
     Quem já tinha o título de antes desta regra ganhou o ovo com ele */
  ovoDoFlorian(d, avisos){
    if (d.flags.sv_ovo_do_florian || (d.copasVencidas || 0) >= 1 || !d.flags.sv_rec_ovos) return;
    const foi = Sevii.partiu(d);
    if (foi && !Sevii.conheceu('florian', d)) return;
    Estado.marcar('sv_ovo_do_florian');
    d.ovos = d.ovos || [];
    d.ovos.push({dex:133, choca:Creche._agora() + HORAS_DO_OVO});
    Creche.sincronizarOvos();
    avisos.push({tipo:'item', texto: foi
      ? `A dona da pousada desce até a arena com uma caixa térmica. Dentro, um ovo e um bilhete na letra do Florian: "Pra quando você chegar na final." Recebeu 1× ${NOME_DO_OVO}.`
      : `O Florian desce da arquibancada com um ovo nas duas mãos, pra quem chegou na final. Recebeu 1× ${NOME_DO_OVO}.`});
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
