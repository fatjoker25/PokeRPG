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
    Estado.dados.cena = cap.inicio;
    this.capAtual = cap;
    Estado.registrar(`=== Capítulo ${n}: ${cap.titulo} ===`);
    return this.ir(cap.inicio, true);
  },

  /* aplicarEfeitos: só na PRIMEIRA vez que se entra na cena.
     Re-renderizações (ação livre, observar) passam false e não repetem nada. */
  ir(idCena, aplicarEfeitos){
    const cap = this.capAtual || this.capitulo(Estado.dados.capitulo);
    this.capAtual = cap;
    const cena = cap.cenas[idCena];
    if (!cena){ console.error('Cena inexistente:', idCena); return null; }
    Estado.dados.cena = idCena;
    this.cenaAtual = Object.assign({id:idCena}, cena);
    this.avisosCena = [];
    if (aplicarEfeitos){
      if (cena.aoEntrar) this.avisosCena = this.avisosCena.concat(this.aplicar(cena.aoEntrar));
      if (cena.ef)       this.avisosCena = this.avisosCena.concat(this.aplicar(cena.ef));
    }
    return this.cenaAtual;
  },

  /* Resumo interno do estado — o Mestre "lembra" antes de narrar */
  resumo(){
    const d = Estado.dados, j = d.jogador;
    const linhas = [];
    linhas.push(`${j.nome}, ${j.idade} anos, de ${j.cidade}. ${j.personalidade}.`);
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

  /* O que o mundo deixa escapar em vez de anunciar o que você ganhou.
     O número exato fica no Diário; aqui fica o que vem por aí. */
  presagio(tipo, ef){
    const bom = [
      'Alguém viu isso. Gente lembra desse tipo de coisa por muito mais tempo do que parece.',
      'Isso vai voltar pra você. Do jeito bom, e provavelmente quando você não estiver esperando.',
      'Uma pessoa que você nem reparou vai contar isso pra outra pessoa hoje à noite.',
      'Não muda nada agora. Muda uma coisa depois, num lugar que você ainda não conhece.'
    ];
    const ruim = [
      'Isso vai voltar. Coisa assim sempre volta, e nunca no mesmo formato.',
      'Ninguém falou nada. Todo mundo viu.',
      'Alguém vai lembrar disso numa hora em que você precisar que ninguém lembre.',
      'Você vai reencontrar essa escolha. Ela não tem pressa.'
    ];
    const item = [
      'Você guarda na mochila sem pensar muito.',
      'Entra na mochila junto com o resto.'
    ];
    if (tipo === 'bom')  return {tipo:'rep', texto: Dados.escolher(bom)};
    if (tipo === 'ruim') return {tipo:'dano', texto: Dados.escolher(ruim)};
    if (tipo === 'item') return {tipo:'info', texto: Dados.escolher(item)};
    return null;
  },

  /* ---------- EFEITOS ---------- */
  aplicar(ef){
    if (!ef) return [];
    const avisos = [];
    if (ef.flag) { (Array.isArray(ef.flag)?ef.flag:[ef.flag]).forEach(f => Estado.marcar(f)); }
    if (ef.limpaFlag){ (Array.isArray(ef.limpaFlag)?ef.limpaFlag:[ef.limpaFlag]).forEach(f => Estado.marcar(f,false)); }
    if (ef.rep){
      const r = Estado.mudarRep(ef.rep.eixo, ef.rep.delta, ef.rep.motivo);
      if (r) { const p = this.presagio(ef.rep.eixo, ef); if (p) avisos.push(p); }
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
      Estado.registrar(`${ef.dinheiro>0?'+':''}${ef.dinheiro} ₽ (total: ${Estado.j.dinheiro} ₽)`);
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
      Estado.adicionar(p);
      avisos.push({tipo:'pokemon', texto:`${nomeExib(p)} (Nv ${p.nivel}, ${p.natureza}) entrou para o seu time.`});
      Estado.registrar(`Recebeu ${p.nome} Nv${p.nivel}.`);
    }
    if (ef.mataPrimeiro){
      const alvo = Estado.dados.time.find(p => estaVivo(p));
      if (alvo){
        Estado.matar(alvo, ef.mataPrimeiro);
        avisos.push({tipo:'morte', texto:`${nomeExib(alvo)} morreu. ${ef.mataPrimeiro}`});
      }
    }
    if (ef.mataEscolhido && ef.uidAlvo){
      const alvo = Estado.dados.time.find(p => p.uid === ef.uidAlvo);
      if (alvo){
        Estado.matar(alvo, ef.mataEscolhido);
        avisos.push({tipo:'morte', texto:`${nomeExib(alvo)} morreu. ${ef.mataEscolhido}`});
      }
    }
    if (ef.moral){
      Estado.dados.time.forEach(p => { p.moral = Math.max(0, Math.min(100, p.moral + ef.moral)); });
      avisos.push({tipo:'info', texto: ef.moral > 0 ? 'O time confia mais em você.' : 'O time te olha diferente agora.'});
    }
    if (ef.npc) Estado.lembrarNPC(ef.npc.nome, ef.npc);
    if (ef.insignia && !Estado.dados.insignias.includes(ef.insignia)){
      Estado.dados.insignias.push(ef.insignia);
      avisos.push({tipo:'insignia', texto:`Você sai com a ${ef.insignia} no bolso. Ela pesa menos do que devia.`});
    }
    if (ef.curaTime){ Estado.dados.time.forEach(curarTotal); avisos.push({tipo:'cura', texto:'Seu time foi curado por completo.'}); }
    if (ef.instabilidade){ Estado.dados.mundo.instabilidade += ef.instabilidade; }
    if (ef.presagio){ (Array.isArray(ef.presagio)?ef.presagio:[ef.presagio]).forEach(t => avisos.push({tipo:'eco', texto:t})); }
    if (ef.registrar) Estado.registrar(ef.registrar);
    if (ef.executar) { const extra = ef.executar(Estado.dados); if (Array.isArray(extra)) extra.forEach(a => avisos.push(a)); }
    return avisos;
  },

  /* Uma escolha está disponível? */
  disponivel(escolha){
    if (!escolha.cond) return true;
    try { return !!escolha.cond(Estado.dados); } catch(e){ return false; }
  },

  /* Qual arco da história espera por você NESTE lugar, agora */
  arcoAqui(){
    const d = Estado.dados;
    let n = d.capitulo + 1;
    while (this.capitulo(n)){
      const cap = this.capitulo(n);
      if (cap.requer && !this.testaRequisito(cap)){ n++; continue; }
      const a = ANCORAS[n];
      if (!a) return null;
      if (a.local === '*' || a.local === Mundo.id()) return {num:n, chamada:a.chamada, cap};
      return null;
    }
    return null;
  },

  /* Onde o próximo arco espera — para a bússola da interface */
  proximoDestino(){
    const d = Estado.dados;
    let n = d.capitulo + 1;
    while (this.capitulo(n)){
      const cap = this.capitulo(n);
      if (cap.requer && !this.testaRequisito(cap)){ n++; continue; }
      const a = ANCORAS[n];
      return a ? {num:n, local:a.local, nome:(LOCAIS[a.local]||{}).nome} : null;
    }
    return null;
  },

  /* Fim de capítulo: 2 pontos e consequências acumuladas do mundo */
  fecharCapitulo(){
    Estado.j.pontos += 2;
    const avisos = Estado.tickLendarios();
    Estado.dados.relogio.dia += Dados.entre(2,5);
    Estado.salvar('auto');
    return avisos;
  },

  /* Próximo capítulo — respeita desvios de rota e capítulos condicionais.
     Um capítulo pode definir:
       proximo: d => numero   (desvio explícito, decidido pelas escolhas)
       requer:  d => bool     (capítulo só existe em certas rotas) */
  proximoCapitulo(){
    const atual = this.capitulo(Estado.dados.capitulo);
    if (atual && typeof atual.proximo === 'function'){
      let alvo = null;
      try { alvo = atual.proximo(Estado.dados); } catch(e){ alvo = null; }
      if (alvo && this.capitulo(alvo)) return alvo;
    }
    let n = Estado.dados.capitulo + 1;
    while (this.capitulo(n)){
      const c = this.capitulo(n);
      if (!c.requer || this.testaRequisito(c)) return n;
      Estado.registrar(`(Capítulo ${n} — "${c.titulo}" — não aconteceu nesta jornada.)`);
      n++;
    }
    return null;
  },

  testaRequisito(cap){
    try { return !!cap.requer(Estado.dados); } catch(e){ return true; }
  },

  /* Quais capítulos ficaram de fora — usado no epílogo */
  capitulosPulados(){
    return CAPITULOS.filter(c => c.requer && !this.testaRequisito(c)).map(c => c.titulo);
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

/* Resolve texto que pode ser função do estado */
function txt(t){
  if (typeof t === 'function'){ try { return t(Estado.dados); } catch(e){ return ''; } }
  return t;
}
