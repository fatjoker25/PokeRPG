/* ============================================================
   MOTOR NARRATIVO — resolve cenas, efeitos e progressão
   ============================================================ */
const NOME_VIA = {
  neutro:'mais um treinador na estrada',
  heroi:'alguém que aparece quando as coisas dão errado',
  mercenario:'alguém que se resolve com dinheiro',
  foragido:'um problema com nome e sobrenome',
  pesquisador:'alguém que faz perguntas demais'
};

const Historia = {
  capAtual: null,
  cenaAtual: null,

  capitulo(n){ return CAPITULOS.find(c => c.num === n) || null; },

  iniciarCapitulo(n){
    const cap = this.capitulo(n);
    if (!cap) return null;
    Estado.dados.capitulo = n;
    /* inicio pode ser uma função: capítulos que abrem de jeitos
       diferentes escolhem a cena de entrada na hora de entrar. */
    const entrada = (typeof cap.inicio === 'function') ? cap.inicio(Estado.dados) : cap.inicio;
    Estado.dados.cena = entrada;
    this.capAtual = cap;
    Estado.registrar(`=== ${typeof numeroDoCapitulo === 'function' ? numeroDoCapitulo(cap) : 'Capítulo ' + n}: ${cap.titulo} ===`);
    return this.ir(entrada, true);
  },

  /* aplicarEfeitos: só na PRIMEIRA vez que se entra na cena.
     Re-renderizações (ação livre, observar) passam false e não repetem nada. */
  ir(idCena, aplicarEfeitos){
    const cap = this.capAtual || this.capitulo(Estado.dados.capitulo);
    this.capAtual = cap;
    /* Desvio declarado no capítulo: antes de entrar em certa cena, se a
       condição valer, passa por outra primeiro (o Professor que te para
       na rua). A cena de desvio sabe pra onde voltar por desvioVolta. */
    const desvio = cap && cap.desvios && cap.desvios[idCena];
    if (desvio){
      let vale = false;
      try { vale = !!desvio.se(Estado.dados); } catch (e) { vale = false; }
      if (vale){ Estado.dados.desvioVolta = idCena; idCena = desvio.vai; }
    }
    let cena = cap && cap.cenas[idCena];
    /* Save antigo pode apontar para uma cena que mudou de nome numa versão
       nova. Em vez de morrer numa tela em branco, o capítulo recomeça do
       começo — perde-se a cena, não a jornada. */
    if (!cena){
      console.warn('Cena inexistente:', idCena, '— voltando ao começo do capítulo', Estado.dados.capitulo);
      if (!cap) return null;
      const entrada = (typeof cap.inicio === 'function') ? cap.inicio(Estado.dados) : cap.inicio;
      cena = cap.cenas[entrada];
      if (!cena) return null;
      idCena = entrada;
      aplicarEfeitos = false;
    }
    Estado.dados.cena = idCena;
    this.cenaAtual = Object.assign({id:idCena}, cena);
    this.avisosCena = [];
    /* Efeito de cena acontece uma vez. Voltar pra mesma cena não dá
       o item de novo, não sobe reputação de novo e não conta como
       uma coisa nova ter acontecido. Cena que É pra repetir avisa
       com `repetivel:true`. */
    const chave = Estado.dados.capitulo + ':' + idCena;
    const vistas = Estado.dados.cenasAplicadas || (Estado.dados.cenasAplicadas = {});
    if (aplicarEfeitos && !cena.repetivel && vistas[chave]) aplicarEfeitos = false;
    if (aplicarEfeitos){
      vistas[chave] = true;
      if (cena.aoEntrar) this.avisosCena = this.avisosCena.concat(this.aplicar(cena.aoEntrar));
      if (cena.ef)       this.avisosCena = this.avisosCena.concat(this.aplicar(cena.ef));
    }
    return this.cenaAtual;
  },

  /* Essa cena já aconteceu nesta jornada? */
  jaAconteceu(idCena){
    const v = Estado.dados.cenasAplicadas || {};
    return !!v[Estado.dados.capitulo + ':' + idCena];
  },

  /* Já parou pra olhar essa cena? */
  jaOlhou(idCena){
    const o = Estado.dados.olhadas || {};
    return !!o[Estado.dados.capitulo + ':' + idCena];
  },
  marcarOlhada(idCena){
    const o = Estado.dados.olhadas || (Estado.dados.olhadas = {});
    o[Estado.dados.capitulo + ':' + idCena] = true;
  },

  /* Essa opção já foi escolhida daqui? */
  jaEscolheu(idCena, i){
    const f = Estado.dados.escolhasFeitas || {};
    return !!f[Estado.dados.capitulo + ':' + idCena + ':' + i];
  },
  marcarEscolha(idCena, i){
    const f = Estado.dados.escolhasFeitas || (Estado.dados.escolhasFeitas = {});
    f[Estado.dados.capitulo + ':' + idCena + ':' + i] = true;
  },

  /* Resumo interno do estado — o Mestre "lembra" antes de narrar */
  resumo(){
    const d = Estado.dados, j = d.jogador;
    const linhas = [];
    linhas.push(`${j.nome}, ${typeof idadeJogador === 'function' ? idadeJogador() : j.idade} anos, de ${j.cidade}. ${j.personalidade}.`);
    linhas.push(`Reputação: ${Estado.nomeRep()} (eixo ${d.reputacao.eixo}). HP ${j.hp}/${Estado.hpMaxJogador()}.`);
    if (d.time.length) linhas.push(`Time: ${d.time.map(p => `${nomeExib(p)} Nv${p.nivel}${p.hp<=0?' (desmaiado)':''}`).join(', ')}.`);
    if (d.cemiterio.length) linhas.push(`Mortos: ${d.cemiterio.map(p => `${nomeExib(p)} (${p.causaMorte})`).join(', ')}. Isso não some.`);
    const presos = Estado.lendariosCapturados();
    if (presos.length) linhas.push(`Lendários em cativeiro: ${presos.map(l => DEX[l.dex].nome).join(', ')}.`);
    const caçando = Object.values(d.lendarios).filter(l => l.caçandoVoce);
    if (caçando.length) linhas.push(`Te caçando: ${caçando.map(l => DEX[l.dex].nome).join(', ')}.`);
    if (d.via && d.via !== 'neutro') linhas.push(`Kanto te trata como: ${NOME_VIA[d.via] || d.via}.`);
    if (d.liga.detencao) linhas.push('A Liga Pokémon tem uma ordem de detenção com o seu nome.');
    else if (d.liga.ordemDevolucao) linhas.push('A Liga exigiu formalmente a devolução do que você pegou.');
    if (d.mundo.clima !== 'normal') linhas.push(`O clima de Kanto está ${d.mundo.clima}.`);
    const nomesNPC = Object.keys(d.npcs);
    if (nomesNPC.length) linhas.push(`Gente que lembra de você: ${nomesNPC.join(', ')}.`);
    return linhas;
  },

  /* O mundo não anuncia o que a escolha vai render: nada de "isso vai
     voltar pra você". O número exato fica no Diário; o resto o jogador
     descobre quando acontecer. */
  presagio(){ return null; },

  /* ---------- EFEITOS ---------- */
  aplicar(ef){
    if (!ef) return [];
    /* Efeito de uma vez só: cenas podem ser revisitadas, presentes não se repetem. */
    if (ef.umaVez){
      const d = Estado.dados;
      d.umaVez = d.umaVez || {};
      if (d.umaVez[ef.umaVez]) return [];
      d.umaVez[ef.umaVez] = true;
    }
    const avisos = [];
    if (ef.flag) { (Array.isArray(ef.flag)?ef.flag:[ef.flag]).forEach(f => Estado.marcar(f)); }
    /* a entrevista do Sr. Juniper: cada resposta pesa pra um lado */
    if (ef.juniper){
      const d = Estado.dados, j = d.juniper = d.juniper || {guarda:0, passa:0};
      j[ef.juniper] = (j[ef.juniper] || 0) + 1;
      if (!j.primeira) j.primeira = ef.juniper;
    }
    if (ef.limpaFlag){ (Array.isArray(ef.limpaFlag)?ef.limpaFlag:[ef.limpaFlag]).forEach(f => Estado.marcar(f,false)); }
    if (ef.rep){
      /* o efeito inteiro vai junto: quem estava na cena pesa na conta */
      const r = Estado.mudarRep(ef.rep.eixo, ef.rep.delta, ef.rep.motivo, ef);
      if (r && r.mudou) { const p = this.presagio(ef.rep.eixo, ef); if (p) avisos.push(p); }
    } else if (ef.npc){
      /* tudo pesa: quem mudou de opinião sobre você conta pra alguém */
      for (const r of repDaOpiniao(ef)) Estado.mudarRep(r.eixo, 1, r.motivo, {});
    }
    if (ef.itens){
      let algum = false;
      for (const [nome,q] of Object.entries(ef.itens)){ Estado.darItem(nome,q); algum = true; }
      if (algum){ const p = this.presagio('item', ef); if (p) avisos.push(p); }
    }
    if (ef.perdeItens){
      for (const [nome,q] of Object.entries(ef.perdeItens)){
        for (let i=0;i<q;i++) Estado.usarItem(nome);
        avisos.push({tipo:'item', texto:`Perdeu ${q}× ${nome}.`});
      }
    }
    if (ef.dinheiro){
      Estado.j.dinheiro = Math.max(0, Estado.j.dinheiro + ef.dinheiro);
      Estado.registrar(`${ef.dinheiro>0?'+':''}${fmtDin(ef.dinheiro)} ₽ (total: ${fmtDin(Estado.j.dinheiro)} ₽)`);
    }
    if (ef.hp){
      if (ef.hp < 0){
        const morreu = Estado.ferir(-ef.hp, ef.causa || 'ferimento');
        const prop = Estado.j.hp / Estado.hpMaxJogador();
        avisos.push({tipo:'dano', texto: prop > 0.66 ? 'Dói, e vai doer mais amanhã.'
          : prop > 0.33 ? 'Você sente isso de um jeito que não passa rápido. Precisa parar em algum lugar.'
          : 'Você está mal. Mal de precisar de ajuda, não de precisar descansar.'});
        if (morreu) avisos.push({tipo:'gameover', texto:'Você não aguentou.'});
      } else {
        Estado.curarJogador(ef.hp);
        avisos.push({tipo:'cura', texto:'Alguma coisa em você assenta de volta no lugar.'});
      }
    }
    if (ef.pokemon){
      const p = criarPokemon(ef.pokemon.dex, ef.pokemon.nivel, ef.pokemon.opcoes||{});
      const onde = Estado.adicionar(p);
      avisos.push({tipo:'pokemon', texto:`${nomeExib(p)} (Nv ${p.nivel}) ${
        onde === 'pc' ? 'foi direto para o PC — o seu cinto já tem seis.' : 'entrou para o seu time.'}`});
      Estado.registrar(`Recebeu ${p.nome} Nv${p.nivel}.`);
    }
    if (ef.mataPrimeiro){
      const alvo = Estado.dados.time.find(p => estaVivo(p));
      if (alvo){
        const par = Estado.matar(alvo, ef.mataPrimeiro);
        avisos.push({tipo:'morte', texto:`${nomeExib(alvo)} morreu. ${ef.mataPrimeiro}`});
        if (par) avisos.push({tipo:'morte', texto:`${nomeExib(par)} fica cheirando o lugar onde ${nomeExib(alvo)} estava e não deixa ninguém chegar perto.`});
      }
    }
    if (ef.mataEscolhido && ef.uidAlvo){
      const alvo = Estado.dados.time.find(p => p.uid === ef.uidAlvo);
      if (alvo){
        const par = Estado.matar(alvo, ef.mataEscolhido);
        avisos.push({tipo:'morte', texto:`${nomeExib(alvo)} morreu. ${ef.mataEscolhido}`});
        if (par) avisos.push({tipo:'morte', texto:`${nomeExib(par)} fica cheirando o lugar onde ${nomeExib(alvo)} estava e não deixa ninguém chegar perto.`});
      }
    }
    if (ef.moral){
      const vivos = Estado.dados.time.filter(p => !p.morto);
      vivos.forEach(p => { p.moral = Math.max(0, Math.min(100, p.moral + ef.moral)); });
      /* sem ninguém no cinto não tem "time" pra confiar em nada; com um
         só, é ele, pelo nome */
      if (vivos.length === 1)
        avisos.push({tipo:'info', texto: ef.moral > 0 ? `${nomeExib(vivos[0])} confia mais em você.` : `${nomeExib(vivos[0])} te olha diferente agora.`});
      else if (vivos.length)
        avisos.push({tipo:'info', texto: ef.moral > 0 ? 'O time confia mais em você.' : 'O time te olha diferente agora.'});
    }
    /* npc pode vir de função: o vizinho da rua muda com a cidade natal */
    if (ef.npc){ const npc = typeof ef.npc === 'function' ? ef.npc(Estado.dados) : ef.npc; if (npc) Estado.lembrarNPC(npc.nome, npc); }
    if (ef.insignia && !Estado.dados.insignias.includes(ef.insignia)){
      Estado.dados.insignias.push(ef.insignia);
      avisos.push({tipo:'insignia', texto:`Você sai com a ${ef.insignia} no bolso. Ela pesa menos do que devia.`});
    }
    if (ef.curaTime){ Estado.dados.time.forEach(curarTotal); avisos.push({tipo:'cura', texto:'Seu time foi curado por completo.'}); }
    if (ef.instabilidade){ Estado.dados.mundo.instabilidade += ef.instabilidade; }
    if (ef.presagio){
      /* presságio pode depender do caminho: função recebe os dados e
         devolve o texto, ou vazio pra não dizer nada */
      (Array.isArray(ef.presagio)?ef.presagio:[ef.presagio]).forEach(t => {
        const txt = typeof t === 'function' ? t(Estado.dados) : t;
        if (txt) avisos.push({tipo:'eco', texto:txt});
      });
    }
    if (ef.registrar) Estado.registrar(typeof ef.registrar === 'function' ? ef.registrar(Estado.dados) : ef.registrar);
    if (ef.executar) { const extra = ef.executar(Estado.dados); if (Array.isArray(extra)) extra.forEach(a => avisos.push(a)); }
    return avisos;
  },

  /* Uma escolha está disponível? */
  disponivel(escolha, idCena, i){
    if (escolha.cond){
      let ok = false;
      try { ok = !!escolha.cond(Estado.dados); } catch(e){ ok = false; }
      if (!ok) return false;
    }
    /* Opção já escolhida, que leva a uma cena que já aconteceu, não
       tem mais nada pra dar. Some, em vez de ficar ali convidando o
       jogador a clicar de novo esperando alguma coisa. */
    if (idCena != null && !escolha.repetivel && escolha.vai
        && this.jaEscolheu(idCena, i) && this.jaAconteceu(escolha.vai)) return false;
    return true;
  },

  /* Qual arco da história espera por você NESTE lugar, agora.
     Quem decide qual é o próximo é proximoCapitulo(), porque ele é
     o único que sabe de desvio explícito e de capítulo condicional —
     contar +1 aqui apontava a bússola pro capítulo errado sempre que
     a rota desviava. */
  arcoAqui(){
    const n = this.proximoCapitulo(false);
    if (!n) return null;
    const cap = this.capitulo(n);
    const a = ANCORAS[n];
    if (!cap || !a) return null;
    /* a volta pra casa (capítulo 21) espera na SUA cidade, não em Pallet */
    const local = typeof a.local === 'function' ? a.local(Estado.dados) : a.local;
    if (local === '*' || local === Mundo.id()) return {num:n, chamada:a.chamada, cap};
    return null;
  },

  /* Onde o próximo arco espera — para a bússola da interface */
  proximoDestino(){
    const n = this.proximoCapitulo(false);
    if (!n) return null;
    const a = ANCORAS[n];
    if (!a) return null;
    const local = typeof a.local === 'function' ? a.local(Estado.dados) : a.local;
    return {num:n, local, nome:(LOCAIS[local]||{}).nome};
  },

  /* Fim de capítulo: 1 ponto e consequências acumuladas do mundo.
     Cada capítulo fecha uma vez só: recarregar na tela de encerramento
     mostrava o botão de novo, e o ponto vinha em dobro. */
  fecharCapitulo(){
    const d = Estado.dados;
    d.capitulosFechados = d.capitulosFechados || [];
    if (d.capitulosFechados.includes(d.capitulo)) return [];
    d.capitulosFechados.push(d.capitulo);
    Estado.j.pontos += 1;
    const avisos = Estado.tickLendarios();
    /* o capítulo durou o que durou: a última manhã é uma manhã só, e
       os outros levam um ou dois dias entre uma cena e outra */
    if (d.capitulo > 1) Estado.dados.relogio.dia += Dados.entre(1,2);
    Estado.salvar('auto');
    return avisos;
  },

  /* Próximo capítulo — respeita desvios de rota e capítulos condicionais.
     Um capítulo pode definir:
       proximo: d => numero   (desvio explícito, decidido pelas escolhas)
       requer:  d => bool     (capítulo só existe em certas rotas) */
  proximoCapitulo(registrando){
    const atual = this.capitulo(Estado.dados.capitulo);
    if (atual && typeof atual.proximo === 'function'){
      let alvo = null;
      try { alvo = atual.proximo(Estado.dados); } catch(e){ alvo = null; }
      if (alvo && this.capitulo(alvo)) return alvo;
    }
    let n = Estado.dados.capitulo + 1;
    while (this.capitulo(n)){
      const c = this.capitulo(n);
      /* capítulo de caminho só entra pelo desvio (caminhos.js), nunca em sequência */
      if (c.caminho){ n++; continue; }
      if (!c.requer || this.testaRequisito(c)) return n;
      /* a bússola consulta isto a cada tela: só o avanço de verdade escreve no diário */
      if (registrando) Estado.registrar(`(Capítulo ${n} — "${c.titulo}" — não aconteceu nesta jornada.)`);
      n++;
    }
    return null;
  },

  testaRequisito(cap){
    try { return !!cap.requer(Estado.dados); } catch(e){ return true; }
  },

  /* Quais capítulos ficaram de fora — usado no epílogo */
  capitulosPulados(){
    return CAPITULOS.filter(c => c.requer && !c.caminho && !this.testaRequisito(c)).map(c => c.titulo);
  },

  /* A "via" é o jeito que o mundo passou a te enxergar. Ela abre e fecha caminhos. */
  definirVia(via, motivo){
    const d = Estado.dados;
    if (d.via === via) return;
    d.viaAnterior = d.via;
    d.via = via;
    Estado.registrar(`Rota narrativa: ${via}${motivo ? ' — ' + motivo : ''}`);
  },

  via(){ return Estado.dados.via || 'neutro'; }
};

/* ============================================================
   TUDO PESA NA REPUTAÇÃO
   Escolha que muda em 2 ou mais a opinião de alguém e que a cena não
   escreveu com rep própria mexe na reputação pelo lado da pessoa:
   gente comum que sai melhor da conversa conta bem de você, e a que
   sai pior conta mal. Com quem vive do crime é o contrário: ganhar a
   confiança dela é má fama, virar inimigo dela é boa. Quem trabalha
   pra Comissão, ou fica no meio, não entra na conta sozinho — a cena
   é que diz. Uma vez por pessoa, por lado, por capítulo.
   ============================================================ */
const NPC_DO_CRIME = new Set(['Caçador Roque', 'Otto', 'A Terceira', 'Rook', 'o da aliança',
  'Encarregado do Armazém 7', 'Comprador de jaleco', 'Caçadores da Rota 23']);
const NPC_NO_MEIO = new Set(['Curador Fabre', 'Auditora Brill', 'Hester Colman', 'Dr. Hollis', 'Dra. Sorrel',
  'Kira', 'Dr. Bramble', 'Diretor Quince', 'Fenna (crachá azul)', 'Mulher de crachá azul', 'a mulher de crachá azul',
  'Conselheira do broche', 'o intermediário', 'Homem da banca', 'Rapaz da fenda', 'o fumante', 'Assessora da Silph',
  'a advogada do conselho', 'Dra. Pia', 'Sr. Cosmo', 'Contramestre Varo', 'o pai do patrocínio']);
function repDaOpiniao(ef){
  const n = ef && ef.npc;
  if (!n || typeof n === 'function') return [];
  const out = [];
  for (const x of [].concat(n)){
    if (!x || !x.nome || typeof x.opiniao !== 'number' || Math.abs(x.opiniao) < 2) continue;
    if (NPC_NO_MEIO.has(x.nome)) continue;
    const quem = (typeof Nomes !== 'undefined' && Nomes.comoChamar) ? Nomes.comoChamar(x.nome) : x.nome;
    const Quem = quem.charAt(0).toUpperCase() + quem.slice(1);
    const subiu = x.opiniao > 0;
    if (NPC_DO_CRIME.has(x.nome))
      out.push(subiu ? {eixo:'ruim', motivo:`${Quem} passou a confiar em você`}
                     : {eixo:'bom',  motivo:`${Quem} passou a te ver como problema`});
    else
      out.push(subiu ? {eixo:'bom',  motivo:`${Quem} saiu da conversa falando bem de você`}
                     : {eixo:'ruim', motivo:`${Quem} saiu da conversa falando mal de você`});
  }
  return out;
}

/* A índole que o Sr. Juniper anotou: guarda (fica com o que chega, não
   larga a lembrança, não empresta) ou passa (o contrário). Empate fica
   com a primeira resposta; save de antes das três perguntas, com a flag. */
function indoleDoJuniper(d){
  const j = d.juniper;
  if (!j) return d.flags.respondeu_guardar ? 'guarda' : 'passa';
  if (j.guarda !== j.passa) return j.guarda > j.passa ? 'guarda' : 'passa';
  return j.primeira || (d.flags.respondeu_guardar ? 'guarda' : 'passa');
}

/* Resolve texto que pode ser função do estado */
/* ============================================================
   VOCÊ, NO SEU GÊNERO
   O texto é escrito em segunda pessoa, mas adjetivo e tratamento
   concordam com quem joga: "você fica sentad{o|a}", "{o senhor|a
   senhora}", "{filho|filha}". A marca é {forma de Homem|forma de
   Mulher}, resolvida quando o texto vai pra tela (UI.esc), então o
   diário e o que foi guardado antes também saem certos.
   ============================================================ */
function concordaJogador(s){
  if (typeof s !== 'string' || s.indexOf('{') < 0) return s;
  /* idade antes de tudo: {menor:A|B} senão seria lido como forma de Homem */
  if (typeof marcasDeIdade === 'function') s = marcasDeIdade(s);
  /* {pico}: a espécie do parceiro do Ezra, que é sorteada */
  if (s.indexOf('{pico}') >= 0)
    s = s.replace(/\{pico\}/g, () => { try { return especieDoPico(); } catch(e){ return 'Pokémon'; } });
  if (s.indexOf('|') < 0) return s;
  let fem = false;
  try { fem = !!(Estado.dados && Estado.j && /^mulher/i.test(Estado.j.genero || '')); } catch(e){}
  /* A pessoa que ficou em casa tem a marca dela, {casa:ela|ele}, com a
     forma feminina primeiro porque as cenas foram escritas pra ela. Vem
     antes da do jogador, que senão leria "casa:ela" como forma de Homem. */
  const casaF = (typeof casaEhMulher === 'function') ? casaEhMulher() : true;
  /* {pk:ele|ela}: o Pokémon da frente do time, em cena escrita sem
     variável (o que sumiu de casa na última manhã). */
  let pkF = false;
  try { const p = Estado.dados && Estado.dados.time && Estado.dados.time[0]; pkF = !!p && generoDe(p) === 'f'; } catch(e){}
  return s.replace(/\{casa:([^{}|]*)\|([^{}|]*)\}/g, (_, f, m) => casaF ? f : m)
          .replace(/\{pk:([^{}|]*)\|([^{}|]*)\}/g, (_, m, f) => pkF ? f : m)
          .replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, m, f) => fem ? f : m);
}

function txt(t){
  if (typeof t === 'function'){ try { return t(Estado.dados); } catch(e){ return ''; } }
  if (t && typeof t === 'object' && t.diz != null) return txt(t.diz);
  return t;
}

/* ============================================================
   QUEM ESTÁ FALANDO
   Uma linha de cena pode ser texto puro (narração) ou uma fala
   com dono: {quem:'Sra. Perla', diz:'...'}. O terceiro campo,
   tom, muda só a cor do balão — 'grita', 'baixo', 'riso',
   'frio'. A função devolve null para narração.
   ============================================================ */
function falaDe(t){
  if (typeof t === 'function'){ try { t = t(Estado.dados); } catch(e){ return null; } }
  if (!t || typeof t !== 'object' || t.diz == null) return null;
  const quem = txt(t.quem);
  const diz = txt(t.diz);
  if (!quem || !diz) return null;
  /* se o jogador já perguntou o nome dessa pessoa, o balão passa a
     usar o nome — aqui e em qualquer cena depois. */
  const nome = (typeof Nomes !== 'undefined') ? Nomes.comoChamar(quem) : quem;
  return {quem: nome, rotulo: quem, diz, tom: t.tom || null, nota: txt(t.nota) || null};
}

/* Açúcar para escrever cena: fala('Sra. Perla', 'Bom dia.', 'grita') */
function fala(quem, diz, tom, nota){ return {quem, diz, tom, nota}; }
