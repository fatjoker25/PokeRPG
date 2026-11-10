/* ============================================================
   DEPOIS DO FIM — a estrada continua, do jeito que o final deixou
   Todo final tem "Continuar pela estrada" (UI.telaFinal): a história
   fecha — não tem mais capítulo, nem chamado no mapa — e você volta
   pro mapa com o time, a mochila e o que o final fez de você. Os
   finais contam o que acontece em anos; o que se joga depois é o
   tempo logo depois do fim, na situação em que ele te deixou.

   Quem decide é o final (DEPOIS_DO_FIM, pelo id dele), e a situação
   fecha as portas que ele fechou — sempre na tela, fechadas, com o
   motivo, nunca escondidas:
   - procurado: a Patrulha tem ordem de detenção no seu nome
     (d.liga.detencao) e vigia a sua rua, e a casa fecha;
   - jurado: quem você enganou sabe onde fica a sua casa;
   - em casa: você parou de competir (ginásio, ala da Elite, arena e
     Conferência fecham) e recomeça em casa;
   - licença suspensa: até ela voltar, o Centro cobra como de quem não
     tem licença, o balcão não emite outra e a Liga não te inscreve;
   - lugar fechado: o Planalto pra quem ficou na pedra da guarita,
     Celadon pra quem fugiu pela porta dos fundos;
   - cargo: o que você virou, na Ficha; o ginásio que é seu não se
     desafia;
   - sem troca: quem parou de trocar não troca mais.
   E o que vinha de antes do final continua valendo: quem chega ao fim
   com ordem de detenção (o lendário preso na frente de testemunha, o
   mandado do Foragido) sai do fim procurado, seja qual for o final —
   menos nos finais que resolvem isso (`limpa`).
   ============================================================ */

const DEPOIS_DO_FIM = {
  /* capítulo 19 */
  ficou_dentro:{cargo:'Conferente da Estação 4'},
  /* 20 */
  sentou_na_cadeira:{cargo:'{Conselheiro|Conselheira} da Comissão'},
  /* 21 */
  ficou_em_casa:{s:'em_casa', semLiga:'O cartão de treinador ficou na caixa de sapato, em cima do armário.'},
  ficou_no_centro:{s:'em_casa', cargo:'Turno da noite do Centro da sua cidade',
    semLiga:'Você faz o turno da noite do Centro. Competir ficou pra quem não tem plantão.'},
  /* 23 */
  assumiu_viridian:{cargo:'Titular do ginásio de Viridian', ginasio:'viridian'},
  /* 24 */
  a_pedra_da_primeira:{fecha:{planalto:'Você ficou na pedra da primeira guarita. O Planalto Indigo não é mais o seu caminho.'}},
  /* 26 */
  aceitou_a_coordenacao:{cargo:'{Coordenador|Coordenadora} de campo da Comissão'},
  /* 28 */
  tratado_frio:{cargo:'Carreira na Liga'},
  entrega:{cargo:'Cargo na Liga'},
  socio:{cargo:'À frente da rede'},
  posse:{s:'procurado', linha:'Você recusou a ordem de devolução, e a Patrulha emitiu a detenção.'},
  arrependimento:{limpa:true, linha:'A Liga registrou a captura e a soltura no mesmo dia: uma advertência, e nenhuma punição.'},
  a_troca:{semTroca:'Você parou de trocar. Quem oferece, ouve não.'},
  /* caminhos (25.x) */
  lei_farda:{cargo:'De farda, por dentro'},
  lei_dura:{s:'procurado', linha:'A Delegada tirou a sua foto do mural da equipe e pôs na outra parede.'},
  rocket_quarto:{cargo:'À frente da rede'},
  rocket_porta:{fecha:{celadon:'Você nunca mais volta a Celadon.'}},
  ciencia_campo:{comeca:'rota13', cargo:'A barraca da Rota 13'},
  imprensa_primeira:{comeca:'fuchsia', cargo:'Jornal de Fuchsia'},
  imprensa_processada:{comeca:'fuchsia', cargo:'A folha semanal de Fuchsia'},
  imprensa_nao_saiu:{comeca:'fuchsia', cargo:'Jornal de Fuchsia'},
  criacao_criadouro:{comeca:'cerulean', cargo:'O Criadouro Aberto'},
  liga_plenario:{cargo:'Comitê técnico da Liga'},
  liga_comprada:{cargo:'Rosto da campanha da Liga'},
  liga_quadra:{comeca:'casa', cargo:'A quadra de terra da sua cidade'},
  heroi_ninguem:{comeca:'fuchsia', cargo:'Brigadista em Fuchsia'},
  merc_calote:{s:'jurado', linha:'Dois lados de Kanto querem o seu nome, e um deles sabe onde fica a sua casa.'},
  foragido_rendicao:{s:'suspenso', dias:365, limpa:true, comeca:'cerulean',
    linha:'A licença está suspensa por um ano, e o serviço comunitário é no abrigo de Cerulean.'},
  foragido_estrada:{s:'procurado', linha:'A ficha da Patrulha continua aberta. Voltar pra Kanto é voltar com ela.'},
  foragido_pensao:{s:'procurado', comeca:'lavender', linha:'Você mora no porão da Pensão Briar, e a ficha da Patrulha continua aberta.'},
  andarilho_casa:{s:'em_casa', semLiga:'Você não volta pra Liga, nem pro Planalto.'},
  andarilho_junto:{comeca:'rota22'}
};

const NOME_DA_SITUACAO = {
  livre:'Na estrada', procurado:'{Procurado|Procurada} pela Patrulha', jurado:'{Jurado|Jurada}',
  em_casa:'Em casa', suspenso:'Licença suspensa'
};

const Depois = {
  /* a jornada já passou do fim */
  ativo(d){ d = d || Estado.dados; return !!(d && d.depoisDoFim); },
  dados(){ const d = Estado.dados; return d && d.depoisDoFim; },

  /* o que um final deixa, com o que veio de antes dele */
  situacao(id, d){
    d = d || Estado.dados;
    const b = DEPOIS_DO_FIM[id] || {};
    let s = b.s || 'livre';
    const liga = d.liga || {};
    /* a ordem que vinha de antes: o lendário visto, o mandado do Foragido */
    const ordem = !b.limpa && (liga.detencao || (d.flags.cm_foragido_3 && !d.flags.cm_foragido_se_entregou));
    const herdou = !!ordem && s !== 'procurado';
    if (ordem) s = 'procurado';
    const r = {s, herdou, cargo:b.cargo || null, ginasio:b.ginasio || null, semTroca:b.semTroca || null,
      fecha:Object.assign({}, b.fecha || {}), semCasa:null, semLiga:null, dias:0, comeca:b.comeca || null, linha:b.linha || null};
    if (s === 'procurado') r.semCasa = 'A Patrulha vigia a sua rua. Bater nessa porta é entregar quem ficou em casa.';
    if (s === 'jurado' || b.s === 'jurado') r.semCasa = 'Quem você enganou sabe onde fica a sua casa. Voltar lá é levar eles junto.';
    if (b.semLiga) r.semLiga = b.semLiga;
    if (b.s === 'suspenso') r.dias = b.dias || 365;
    /* quem não pode voltar pra casa não recomeça nela */
    if (r.semCasa && r.comeca === 'casa') r.comeca = null;
    return r;
  },

  /* o bloco "Depois do fim" da tela do final: linhas de chave e valor */
  linhas(final, d){
    d = d || Estado.dados;
    const r = this.situacao(final.id, d);
    const L = [];
    L.push(['Situação', NOME_DA_SITUACAO[r.s] || NOME_DA_SITUACAO.livre]);
    if (r.linha) L.push(['O que pesa', r.linha]);
    if (r.herdou) L.push(['O que vem de antes', 'A ordem de detenção da Patrulha continua no seu nome.']);
    const casa = Mundo.idDaCidade(d.jogador.cidade);
    const onde = r.comeca === 'casa' ? `Em casa, em ${(LOCAIS[casa] || {}).nome || d.jogador.cidade}`
      : r.comeca && LOCAIS[r.comeca] ? LOCAIS[r.comeca].nome : 'Onde o final te deixou';
    L.push(['Recomeça', onde]);
    if (r.semCasa) L.push(['Sua casa', r.semCasa]);
    if (r.semLiga) L.push(['Ginásio, Elite, arena e Conferência', r.semLiga]);
    if (r.dias) L.push(['A licença', `Volta em ${r.dias} dias. Até lá o Centro cobra como de quem não tem licença, o balcão não emite outra e a Liga não te inscreve.`]);
    for (const [id, motivo] of Object.entries(r.fecha)) L.push([(LOCAIS[id] || {}).nome || id, motivo]);
    if (r.semTroca) L.push(['Trocas', r.semTroca]);
    if (r.ginasio) L.push([`Ginásio de ${(LOCAIS[r.ginasio] || {}).nome || r.ginasio}`, 'É seu: ninguém desafia o próprio ginásio.']);
    if (r.cargo) L.push(['O que você virou', r.cargo]);
    return L;
  },

  /* "Continuar pela estrada": aplica a situação, uma vez */
  continuar(final){
    const d = Estado.dados;
    if (!final || d.depoisDoFim) return [];
    const b = DEPOIS_DO_FIM[final.id] || {};
    const r = this.situacao(final.id, d);
    d.depoisDoFim = {final:final.id, titulo:concordaJogador(String(txt(final.titulo) || '')), s:r.s,
      cargo:r.cargo ? concordaJogador(r.cargo) : null, ginasio:r.ginasio, semTroca:r.semTroca, fecha:r.fecha,
      semCasa:r.semCasa, semLiga:r.semLiga, desde:d.relogio.dia};
    if (b.limpa){ d.liga.detencao = false; d.liga.ordemDevolucao = false; }
    if (r.s === 'procurado') d.liga.detencao = true;
    if (r.dias){
      d.depoisDoFim.licencaVolta = d.relogio.dia + r.dias;
      d.flags.tem_licenca = false;
    }
    const destino = r.comeca === 'casa' ? Mundo.idDaCidade(d.jogador.cidade) : r.comeca;
    if (destino && LOCAIS[destino]){ d.local = destino; Mundo.marcarVisitado(destino); }
    d.modo = 'mundo';
    Estado.registrar(`Depois do fim: ${d.depoisDoFim.titulo}. A estrada continua.`);
    const av = [{tipo:'info', texto:'A história acabou. A estrada, não.'}];
    if (r.s === 'procurado') av.push({tipo:'lei', texto:'A Patrulha tem ordem de detenção no seu nome.'});
    return av;
  },

  /* a cada tela do mapa: a licença suspensa volta no dia dela */
  conferir(){
    const d = Estado.dados, x = d && d.depoisDoFim;
    if (!x || !x.licencaVolta || d.relogio.dia < x.licencaVolta) return [];
    delete x.licencaVolta;
    /* o final diz que ela volta pelo correio: volta, tivesse ou não antes */
    d.flags.tem_licenca = true;
    Estado.registrar('A licença de treinador voltou, pelo correio.');
    return [{tipo:'item', texto:'A licença volta num dia de chuva, pelo correio, dentro de um envelope que ninguém abriu.'}];
  },

  /* ── as portas que o final fechou (o motivo, ou null) ── */
  casaFechada(){ const x = this.dados(); return x && x.semCasa || null; },
  licencaSuspensa(){
    const d = Estado.dados, x = this.dados();
    return x && x.licencaVolta && d.relogio.dia < x.licencaVolta
      ? `A sua licença está suspensa. Ela volta no dia ${x.licencaVolta} da jornada; hoje é o ${d.relogio.dia}.` : null;
  },
  ligaFechada(){ const x = this.dados(); return x && (x.semLiga || this.licencaSuspensa()) || null; },
  portaDoGinasio(id){
    const x = this.dados();
    if (!x) return null;
    if (x.ginasio === id) return 'É o seu ginásio: aqui quem recebe desafio é você.';
    return this.ligaFechada();
  },
  trava(de, para){ const x = this.dados(); return x && x.fecha && x.fecha[para] || null; },
  semTroca(){ const x = this.dados(); return x && x.semTroca || null; },

  /* a Ficha: o que o fim deixou */
  ficha(){
    const d = Estado.dados, x = this.dados();
    if (!x) return [];
    const L = [['O final', x.titulo], ['Situação', NOME_DA_SITUACAO[x.s] || NOME_DA_SITUACAO.livre],
      ['Desde', `o dia ${x.desde} da jornada`]];
    if (x.cargo) L.push(['O que você virou', x.cargo]);
    if (x.semCasa) L.push(['Sua casa', 'fechada']);
    if (x.semLiga) L.push(['Liga', 'não compete mais']);
    if (this.licencaSuspensa()) L.push(['Licença', `suspensa até o dia ${x.licencaVolta}`]);
    for (const id of Object.keys(x.fecha || {})) L.push([(LOCAIS[id] || {}).nome || id, 'fechado pra você']);
    if (x.semTroca) L.push(['Trocas', 'parou de trocar']);
    return L;
  }
};
