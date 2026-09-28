/* ============================================================
   JOGO — controle de fluxo
   ============================================================ */
/* Prêmio de cada batalha, num lugar só. O log de fim de batalha mostra
   o número ANTES de a tela de resultado pagar, e os dois têm que bater:
   se cada lado fizesse a própria conta, um dia um diria 1.200 e o outro
   pagaria 1.260. Mudou prêmio? Muda aqui, e a folha de regras junto. */
function premioGinasio(g, fim){
  const p = (g && g.premio) || {};
  return p.dinheiro ? Math.round(p.dinheiro * ((fim && fim.bonusDinheiro) || 1)) : 0;
}
function premioRevanche(){ return 900 + 420 * numInsignias(); }
function premioTorneio(t, venceu){
  const pr = PREMIO_TORNEIO[t.rodada];
  return venceu ? pr.dinheiro : Math.round(pr.dinheiro * 0.3);
}
/* Batalha de cena contra treinador paga como nos jogos: o valor da
   classe × o nível do último Pokémon dele (× o Amuleto de Moeda). Quando
   a própria cena de vitória já te entrega dinheiro (o Ezra que tira do
   bolso, o envelope do torneio), o prêmio é esse — não paga em dobro. */
function premioCena(b){
  if (!b || b.tipo !== 'treinador') return {valor:0};
  const cap = (typeof Historia !== 'undefined') ? Historia.capAtual : null;
  const v = cap && cap.cenas ? cap.cenas[b.vitoria] : null;
  const d = v && v.ef ? v.ef.dinheiro : null;
  if (typeof d === 'number' && d > 0) return {valor:d, pelaCena:true};
  const nivel = (Batalha.inimigo && Batalha.inimigo.nivel) || 1;
  return {valor: Math.round(pagaPorNivel(b.treinador || Batalha.treinador) * nivel * (Batalha.bonusDinheiro || 1))};
}

/* rival de estrada: perder pra ele custa isto */
function perdaRivalExtra(id){ return id === 'vasco' ? 1200 : 700; }

/* A primeira coisa que o adversário DIZ numa lista de falas: fala() com
   dono, ou frase inteira entre aspas numa linha de narração. É o que o
   log do fim de batalha cita, como a frase de derrota dos jogos. */
function primeiraFala(linhas, quem){
  for (const l0 of (linhas || [])){
    const l = (typeof l0 === 'function') ? l0(Estado.dados) : l0;
    if (!l) continue;
    if (typeof l === 'object' && l.diz) return `${l.quem || quem}: "${l.diz}"`;
    const m = /["\u201C]([^"\u201D]{3,}?[.!?\u2026])["\u201D]/.exec(String(l));
    if (m) return `${quem}: "${m[1]}"`;
  }
  return null;
}

const PERDA_RIVAL = 800;
const PREMIO_RIVAL_PARCEIRO = 3000;
const PREMIO_CAMPEAO = 80000;

const Jogo = {
  /* o que já subiu neste capítulo fica no save: recarregar não zera a trava */
  get subidosNoCap(){
    const d = Estado.dados; if (!d) return [];
    if (!d.subidos || d.subidos.cap !== d.capitulo) d.subidos = {cap:d.capitulo, lista:[]};
    return d.subidos.lista;
  },
  cenaBatalha: null,
  ginasioAtual: null,
  voltarDeGinasio: 'hub',
  eliteAtual: null,
  revancheAtual: null,
  torneioAtual: null,
  rivalAtual: null,
  encontroRival: null,
  estradaAtual: null,
  depoisDaEstrada: null,
  capDepoisDaViagem: null,
  destinoDaViagem: null,
  proxCapPendente: null,

  /* ---------- início ---------- */
  iniciar(){
    UI.init();
    UI.telaInicial();
  },

  novo(){
    if (Estado.existeSave('auto') && !confirm('Isso apaga a jornada atual. Continuar?')) return;
    Estado.apagarSave('auto');
    Estado.dados = null;
    UI.telaCriacao();
  },

  continuar(){
    if (!Estado.carregar('auto')) return UI.telaInicial();
    if (Estado.dados.modo === 'mundo' || !Estado.dados.cena){
      return Exploracao.tela([{tipo:'info', texto:'Você retoma o caminho de onde parou.'}]);
    }
    Historia.capAtual = Historia.capitulo(Estado.dados.capitulo);
    if (!Historia.capAtual) return Exploracao.tela();
    const cena = Historia.ir(Estado.dados.cena, false);
    UI.telaCena(cena, [{tipo:'info', texto:'Você retoma o caminho de onde parou.'}]);
  },

  criar(){
    const f = UI.lerCriacao();
    const erro = document.getElementById('f-erro');
    if (!f.nome){ erro.textContent = 'Seu personagem precisa de um nome.'; return; }
    if (!f.objetivo){ erro.textContent = 'Defina um objetivo — ele aparece na narrativa.'; return; }
    if (!f.personalidade) f.personalidade = 'reservado';
    if (!f.aparencia) f.aparencia = 'nada que chame atenção';
    if (!f.vestimenta) f.vestimenta = 'roupa comum e um casaco';

    Estado.novo(f);
    Estado.dados.config.ritmo = f.ritmo;

    Mundo.iniciar(f.cidade);
    Estado.dados.itens = {};                     // a mochila começa vazia

    let inicial;
    if (f.inicial === 'rand'){
      /* O que já estava na casa é bicho de primeiro estágio de uma
         linha que tem evolução pela frente: o tipo de Pokémon que
         circula por uma cidade pequena e acaba ficando. Espécie de
         estágio único em Kanto — Electabuzz, Magmar, Tauros, Lapras,
         Onix — não aparece no quintal de ninguém em Pallet. Fóssil
         está extinto e só existe revivido em laboratório. Lendário e
         Ditto ficam de fora por motivo óbvio. */
      const FOSSEIS = [138,139,140,141,142];
      /* O Eevee guarda três destinos e por isso o campo evo dele está
         vazio: quem evolui por pedra entra pela tabela das pedras. */
      const porPedra = new Set();
      Object.values(PEDRAS).forEach(t => Object.keys(t).forEach(k => porPedra.add(+k)));
      const temFuturo = p => !!p.evo || porPedra.has(p.dex);
      const base = POOL_KANTO.filter(d => {
        const p = DEX[d];
        return temFuturo(p) && !p.preEvo && !FOSSEIS.includes(d) && ![132,151,150].includes(d);
      });
      inicial = criarPokemon(Dados.escolher(base), 5, {
        moral:100, naturezaVista:true,
        historia:'Já morava na sua casa quando você decidiu sair. Vínculo máximo.'
      });
    } else if (f.cidade !== 'Pallet'){
      /* Quem não nasceu em Pallet não recebe da mão do Professor: o
         laboratório manda alguém, uma vez por mês, com uma caixa
         térmica e um caderno. O bicho ainda não é seu — o capítulo 1
         começa na manhã da entrega. */
      Estado.dados.entrega = {};                 // a espécie se escolhe na frente da caixa
      Estado.marcar('espera_o_assistente');
      Estado.registrar(`${Estado.j.nome} se inscreveu em fevereiro e espera a perua do laboratório em ${Estado.j.cidade}.`);
      Estado.salvar('auto');
      return UI.telaCena(Historia.iniciarCapitulo(1), []);
    } else {
      /* Em Pallet quem entrega é o Professor, na rua, na manhã em que
         você sai de casa. Até lá o bicho não é seu: a manhã em casa
         começa sem ele, como começa pra quem espera a perua. */
      Estado.dados.entrega = {pallet:true};      // a espécie se escolhe na bandeja do Professor
      Estado.marcar('espera_o_professor');
      Estado.registrar(`${Estado.j.nome} vai escolher o primeiro Pokémon na bandeja do Professor, em Pallet.`);
      Estado.salvar('auto');
      return UI.telaCena(Historia.iniciarCapitulo(1), []);
    }
    Estado.adicionar(inicial);
    Estado.j.inicialDex = inicial.dex;          // Blue escolhe o contra do seu inicial
    iniciarRival();                             // e o rival escolhe o contra do seu também
    Estado.registrar(`${Estado.j.nome} saiu de ${Estado.j.cidade} com ${inicial.nome}.`);
    Estado.salvar('auto');

    const cena = Historia.iniciarCapitulo(1);
    UI.telaCena(cena, [{tipo:'pokemon', texto:`${inicial.nome} (Nv 5, ${inicial.natureza}).`}]);
  },

  /* ---------- navegação ---------- */
  irPara(id, avisos){
    /* Experiência dada pela história (treino, semanas no Planalto) pode
       deixar golpe pra decidir ou evolução pendente: resolve antes de
       mostrar a cena, que é quando os jogos fariam. */
    const pendente = (Estado.dados.time || []).some(p => (p.aprenderPendente && p.aprenderPendente.length) || (p.evoPendente && !p.morto));
    if (pendente && !Batalha.ativo && !this._resolvendoCena){
      this._resolvendoCena = true;
      return this.resolverPendencias(() => { this._resolvendoCena = false; this.irPara(id, avisos); });
    }
    const cena = Historia.ir(id, true);
    avisos = (avisos||[]).concat(Historia.avisosCena||[]);
    Estado.salvar('auto');
    if (Estado.j.hp <= 0) return UI.telaGameOver('Você não aguentou os ferimentos.');
    if (this.ecoLivre){
      avisos = [{tipo:'eco', texto:this.ecoLivre}].concat(avisos||[]);
      this.ecoLivre = null;
    }
    UI.telaCena(cena, avisos);
  },

  escolher(i){
    const cena = Historia.cenaAtual;
    const e = (cena.escolhas||[])[i];
    if (!e) return;

    if (e.trocaNPC) return this.trocaComNPC(e);
    if (e.vendaTime) return this.venderDoTime(e);

    /* a opção conta como feita, e o efeito dela também só vale uma vez */
    const idCena = Estado.dados.cena;
    const repetida = !e.repetivel && Historia.jaEscolheu(idCena, i);
    Historia.marcarEscolha(idCena, i);

    /* se a opção escolhida era uma frase entre aspas, era a SUA boca:
       guarda a frase pra próxima cena saber de quem é aquele balão */
    const dito = /^[\u201C\"](.+)[\u201D\"]$/.exec(txt(e.texto).trim());
    UI.falaDoJogador = dito ? dito[1].trim() : null;

    const avisos = repetida ? [] : Historia.aplicar(e.ef);
    if (Estado.j.hp <= 0) return UI.telaGameOver('Você não aguentou os ferimentos.');
    this.irPara(e.vai, avisos);
  },

  /* ---------- AÇÃO LIVRE: o jogador escreve o que faz ---------- */
  acaoLivre(){
    const campo = document.getElementById('acao-livre');
    if (!campo) return;
    const texto = campo.value.trim();
    if (!texto) return;
    campo.value = '';

    const cena = Historia.cenaAtual;
    const disponiveis = (cena.escolhas||[])
      .map((e,i)=>({e,i}))
      .filter(x => Historia.disponivel(x.e, Estado.dados.cena, x.i));

    /* "qual é o seu nome?" é pergunta, não trilha: se tem alguém
       anônimo falando nesta cena, ela vira a ação de perguntar. */
    if (typeof perguntaDeNome === 'function' && perguntaDeNome(texto)){
      const alvos = this.anonimosDaCena();
      if (alvos.length){ this.ecoLivre = null; return this.perguntarNome(alvos[0]); }
    }

    const r = Entrada.interpretar(texto, disponiveis.map(x => x.e));
    if (!r) return;

    if (r.tipo === 'trilha'){
      const alvo = disponiveis[r.indice];
      this.ecoLivre = texto;
      return this.escolher(alvo.i);
    }

    // o jogo improvisa
    const imp = Entrada.improviso(r.intencao, cena);
    const avisos = [{tipo:'eco', texto:texto}];
    imp.texto.forEach(t => avisos.push({tipo:'info', texto:t}));
    if (imp.rep) Historia.aplicar({rep:imp.rep}).forEach(a => avisos.push(a));
    Estado.registrar(`Ação livre: "${texto}"`);
    Estado.salvar('auto');
    if (Estado.j.hp <= 0) return UI.telaGameOver('Você não aguentou.');
    UI.telaCena(Historia.ir(Estado.dados.cena, false), avisos);
  },

  /* Quem está falando nesta cena e ainda não tem nome. O jogo chama
     quase todo mundo pela função; perguntar o nome desfaz isso. */
  anonimosDaCena(){
    const cena = Historia.cenaAtual;
    if (!cena || typeof Nomes === 'undefined') return [];
    const vistos = [];
    for (const linha of (cena.texto || [])){
      const f = falaDe(linha);
      if (!f) continue;
      const rot = f.rotulo || f.quem;
      if (rot === Estado.j.nome) continue;
      if (!Nomes.podePerguntar(rot)) continue;
      if (!vistos.includes(rot)) vistos.push(rot);
    }
    return vistos;
  },

  perguntarNome(rotulo){
    const alvos = this.anonimosDaCena();
    const alvo = rotulo || alvos[0];
    if (!alvo) return;
    const r = Nomes.perguntar(alvo);
    /* avisos() já transforma em balão o que falaDe() reconhecer, então
       a fala vai crua e a narração vai como info. */
    const avisos = [{tipo:'eco', texto:'Como é o seu nome?'}];
    r.linhas.forEach(l => avisos.push(falaDe(l) ? {tipo:'info', texto:l}
                                                : {tipo:'info', texto: txt(l)}));
    Estado.registrar(r.nome
      ? `Perguntou o nome de "${alvo}". É ${r.nome}.`
      : `Perguntou o nome de "${alvo}". Não quis dizer.`);
    Estado.salvar('auto');
    UI.telaCena(Historia.ir(Estado.dados.cena, false), avisos);
  },

  observarCena(){
    Historia.marcarOlhada(Estado.dados.cena);
    const t = Dados.testeComTime(Estado.j.status.percepcao, 5, 'Percepção', 'cuidado');
    const cap = Historia.capAtual;
    const bons = [
      'Você para. Repara numa coisa que estava ali desde o começo e que você não tinha visto — e ela muda um pouco o peso do resto.',
      'Um detalhe que não muda o que dá pra fazer, mas muda o que significa fazer.',
      'Você olha as mãos das pessoas em vez do rosto. Mão mente menos.'
    ];
    const meios = [
      'Você olha mais um pouco e o que aparece é só o tempo passando.',
      'Nada novo. Mas você deixa de ter pressa, e isso vale alguma coisa.'
    ];
    const ruins = [
      'Você fica parad{o|a} tempo demais e perde o fio.',
      'Olhar sem saber o que procurar é só demorar.'
    ];
    const linha = (t.grau==='critico'||t.grau==='sucesso') ? Dados.escolher(bons)
                : t.grau==='parcial' ? Dados.escolher(meios) : Dados.escolher(ruins);
    UI.telaCena(Historia.ir(Estado.dados.cena, false), [{tipo:'info', texto:linha}]);
  },

  /* ---------- teste de perícia ---------- */
  rolarTeste(){
    const t = Historia.cenaAtual.teste;
    UI.limparDados();
    /* o cinto conta: quem está com você pesa no teste, e quem te
       entende pesa mais ainda */
    const eixo = t.eixo || (typeof EIXO_DO_STATUS !== 'undefined' ? EIXO_DO_STATUS[t.status] : null);
    const r = eixo ? Dados.testeComTime(Estado.j.status[t.status], t.dificuldade, t.nomeStatus, eixo)
                   : Dados.teste(Estado.j.status[t.status], t.dificuldade, t.nomeStatus);
    const destino = t[r.grau] || t.falha || t.parcial;
    const soma = `1d10(${r.dado}) + ${t.nomeStatus||t.status}(${r.bonus})`
               + (r.temperamento ? ` ${r.temperamento > 0 ? '+' : '−'} ${Math.abs(r.temperamento)}` : '');
    const aviso = [{tipo: (r.grau==='falha'?'dano':r.grau==='critico'?'rep':'info'),
      texto:`${soma} = ${r.total} contra ${t.dificuldade} — ${r.texto}.`}];
    /* uma frase por bicho: se o temperamento já falou dele, a afinidade
       não fala de novo (e não desdiz) */
    const jaFalou = r.linhaTime && r.afinidade && r.afinidade.nome && r.linhaTime.includes(r.afinidade.nome);
    if (r.afinidade && r.afinidade.linha && !jaFalou) aviso.push({tipo:'natureza', texto:r.afinidade.linha});
    if (r.linhaTime) aviso.push({tipo:'natureza', texto:r.linhaTime});
    this.irPara(destino, aviso);
  },

  /* ---------- sacrifício ---------- */
  sacrificar(uid){
    const cena = Historia.cenaAtual;
    const avisos = Historia.aplicar({mataEscolhido: cena.sacrificio.causa, uidAlvo: uid});
    this.irPara(cena.sacrificio.vai, avisos);
  },

  /* ---------- batalha ---------- */
  iniciarBatalhaDaCena(){
    const cena = Historia.cenaAtual;
    const b = cena.batalha;
    this.cenaBatalha = b;

    const meu = Estado.primeiroApto();
    if (!meu){
      Estado.dados.ultimaBatalha = {resultado:'semLuta'};
      return this.irPara(b.derrota || b.vitoria,
        [{tipo:'dano', texto:'Você não tem nenhum Pokémon em pé. Não dá para lutar.'}]);
    }

    let inimigo, timeInimigo;
    if (b.comissao){
      // time de unidades fabricadas da Comissão
      const unidades = timeComissao(b.comissao, b.nivel || Historia.capAtual.nivelArea);
      inimigo = unidades[0];
      timeInimigo = unidades.slice(1);
    } else {
      /* nível pode ser função: capítulo alcançável com progresso diferente
         não pode ter adversário de nível fixo. */
      const nvBase = txt(b.nivel) || Historia.capAtual.nivelArea;
      if (b.aleatorio) inimigo = sortearSelvagem(b.ambiente || Historia.capAtual.ambiente, b.nivelBase || Historia.capAtual.nivelArea);
      else inimigo = criarPokemon(b.dex, nvBase, {selvagem: b.tipo === 'selvagem' || b.tipo === 'lendario'});
      timeInimigo = (b.timeExtra||[]).map(x => criarPokemon(x.dex,
        x.nivel !== undefined ? txt(x.nivel) : Math.max(2, nvBase + (x.mais || 0)), {}));
    }
    const permiteFuga = (typeof b.fuga === 'boolean') ? b.fuga : true;

    UI.limparDados();
    Batalha.iniciar(meu, inimigo, {
      tipo: b.tipo || 'selvagem',
      fuga: permiteFuga,
      treinador: b.treinador,
      timeInimigo,
      introducao: b.intro,
      arena: b.arena || null
    });
    UI.telaBatalha();
  },

  acaoBatalha(acao){
    /* A leitura da Pokédex tem tela própria: varredura animada e ficha. */
    if (acao.tipo === 'pokedex') return UI.escaneamento();
    /* clique no meio do voo da bola: o turno já foi resolvido, espera */
    if (this.animandoBola || this.encenando) return;
    const r = Batalha.acao(acao);

    /* O turno é tocado um evento por vez (golpe, dano, cura, condição);
       só depois a arena se acerta com o fim do turno. */
    const seguir = async () => {
      this.encenando = true;
      try {
        await Efeitos.encenar(r.eventos);
        const m = UI.atualizarArena();
        if (m && m.trocouA) await Efeitos.entrada(Batalha.aliado);
      } finally { this.encenando = false; }
      /* Golpe que não coube: a pergunta é na hora, na tela de batalha,
         antes de qualquer outra coisa — como nos jogos. */
      this.resolverGolpes('batalha', () => {
        if (r.precisaTrocar){ UI.trocaObrigatoria(r.reservas); return; }
        if (r.fim) return this.fimDeBatalha(r.fim);
        UI.acoesCombate();
        Estado.salvar('auto');
      });
    };

    /* Bola: primeiro a tela mostra o que aconteceu, depois o texto
       explica. O contrário entregaria o desfecho antes da chacoalhada. */
    const arremesso = (acao.tipo === 'bola' && typeof Captura !== 'undefined') ? Captura.ultimo : null;
    if (typeof Captura !== 'undefined') Captura.ultimo = null;
    if (!arremesso) return seguir();
    this.animandoBola = true;
    UI.animarArremesso(arremesso).then(() => { this.animandoBola = false; seguir(); });
  },

  /* ============================================================
     FIM DE BATALHA — a tela não fecha na hora
     O log conta o resultado como nos jogos: quem venceu, a fala do
     treinador, o dinheiro, e se a captura foi pro PC. Só o botão
     Continuar leva adiante — e antes disso rodam as evoluções.
     ============================================================ */
  fimDeBatalha(fim){
    const res = this.resumoFimDeBatalha(fim);
    UI.escreverLog(res.linhas);
    Estado.salvar('auto');
    UI.mostrarContinuar(() => {
      if (fim.resultado === 'gameover') return this.finalizarBatalha(fim);
      this.resolverEvolucoes(() => this.finalizarBatalha(fim));
    });
  },

  resumoFimDeBatalha(fim){
    const linhas = [];
    const nomeTrein = Batalha.treinador;
    const L = (tipo, texto) => linhas.push({tipo, texto});
    /* frase de derrota do treinador: a primeira fala do diálogo que a
       tela seguinte mostraria — e ela passa a começar da segunda */
    this.citacaoMostrada = false;
    const citar = (falas) => {
      const f = (falas || []).filter(Boolean)[0];
      if (!f) return;
      const t = (typeof f === 'string') ? f : (f.diz ? `${f.quem}: "${f.diz}"` : '');
      if (t){ L('citacao', t); this.citacaoMostrada = true; }
    };
    const dinheiro = (v) => {
      if (!v) return;
      L('premio', v > 0 ? `Você recebeu ${v.toLocaleString('pt-BR')} ₽.` : `Você entregou ${(-v).toLocaleString('pt-BR')} ₽.`);
    };
    const venceu = fim.resultado === 'vitoria';

    switch (fim.resultado){
      case 'vitoria':
        L('fim', nomeTrein ? `Você venceu ${nomeTrein}!` : 'Você venceu!');
        break;
      case 'captura': {
        const p = fim.pokemon;
        const noTime = p && (Estado.dados.time || []).some(x => x.uid === p.uid);
        L('fim', 'Captura concluída!');
        if (p && !noTime)
          L('pc', `O seu time já tem seis. ${nomeExib(p)} foi enviado para o PC do Centro Pokémon.`);
        break;
      }
      case 'derrota':
        L('fimRuim', nomeTrein ? `${nomeTrein} venceu.` : 'Você perdeu essa.');
        break;
      case 'gameover':
        L('fimRuim', 'Não sobrou ninguém em pé.');
        break;
      case 'fuga': case 'escapou':
        L('fim', 'Você fugiu em segurança.');
        break;
      case 'encarou':
        L('fim', 'Ele recuou.');
        break;
    }

    /* o que cada tipo de batalha paga — pelas mesmas funções que pagam */
    if (this.ginasioAtual){
      const g = this.ginasioAtual;
      citar(((venceu ? g.vitoria : g.derrota) || (() => []))(Estado.dados));
      if (venceu) dinheiro(premioGinasio(g, fim));
    } else if (this.revancheAtual){
      if (venceu) dinheiro(premioRevanche());
    } else if (this.torneioAtual){
      if (fim.resultado !== 'gameover') dinheiro(premioTorneio(this.torneioAtual, venceu));
    } else if (this.rivalAtual && !this.rivalAtual.extra){
      /* as falas saem ANTES do placar mudar: o texto já soma o resultado
         de agora ("${r.derrotas + 1}"), e a tela de resultado usa esta
         mesma lista */
      this.falasRival = (fim.resultado === 'gameover') ? null : (venceu ? falaVitoriaRival() : falaDerrotaRival());
      const c = primeiraFala(this.falasRival, rival().nome);
      if (c){ L('citacao', c); }
      if (venceu && this.rivalAtual.arco === 'parceiro') dinheiro(PREMIO_RIVAL_PARCEIRO);
      if (fim.resultado === 'derrota') dinheiro(-Math.min(PERDA_RIVAL, Estado.j.dinheiro));
    } else if (this.rivalAtual && this.rivalAtual.extra){
      const R = defRival(this.rivalAtual.extra);
      this.falasRival = (fim.resultado === 'gameover') ? null : (venceu ? falaVitoriaRivalExtra(R) : falaDerrotaRivalExtra(R));
      const c = primeiraFala(this.falasRival, R.nome);
      if (c){ L('citacao', c); }
      if (fim.resultado === 'derrota') dinheiro(-Math.min(perdaRivalExtra(R.id), Estado.j.dinheiro));
    } else if (this.estradaAtual){
      const c = Estrada.citacao(venceu);
      if (c && fim.resultado !== 'gameover') L('citacao', c);
      if (venceu) dinheiro(Estrada.premio());
      else if (fim.resultado === 'derrota') dinheiro(-Estrada.perda());
    } else if (this.cenaBatalha && Batalha.tipo === 'treinador' && !this.eliteAtual){
      if (venceu) dinheiro(premioCena(this.cenaBatalha).valor);
    } else if (this.eliteAtual){
      const e = this.eliteAtual;
      const alvo = e.campeao ? CAMPEAO : ELITE4[e.indice];
      const falas = venceu ? (alvo.vitoria && alvo.vitoria(Estado.dados))
                           : (alvo.derrota && alvo.derrota(Estado.dados));
      /* Red não fala, nunca falou: qualquer aspas no salão é de outra pessoa */
      const c = e.campeao ? null : primeiraFala(falas, alvo.nome);
      if (c){ L('citacao', c); }
      else if (e.campeao && fim.resultado !== 'gameover') L('citacao', `${alvo.nome} não diz nada.`);
      if (e.campeao && venceu) dinheiro(PREMIO_CAMPEAO);
    }
    return {linhas};
  },

  /* ============================================================
     PENDÊNCIAS — golpe que não coube e evolução que chegou
     Ficam marcadas no próprio Pokémon (aprenderPendente, evoPendente)
     por quem deu o XP, e são resolvidas aqui, no lugar certo: golpe
     na hora, evolução depois da luta. Qualquer lugar que dá XP fora
     de batalha passa por resolverPendencias antes da tela seguinte.
     ============================================================ */
  resolverGolpes(onde, aoFim){
    const p = (Estado.dados.time || []).find(x => x.aprenderPendente && x.aprenderPendente.length);
    if (!p) return aoFim();
    const nome = p.aprenderPendente[0];
    UI.perguntarGolpe(p, nome, onde, (i) => {
      const esqueceu = aprenderNoLugar(p, nome, i);
      const quem = nomeExib(p);
      const linhas = esqueceu
        ? [{tipo:'golpeNovo', texto:`1, 2 e… pronto! ${quem} esqueceu ${esqueceu}.`},
           {tipo:'golpeNovo', texto:`E… ${quem} aprendeu ${nome}!`}]
        : [{tipo:'info', texto:`${quem} não aprendeu ${nome}.`}];
      if (onde === 'batalha') UI.escreverLog(linhas);
      else UI.avisar && UI.avisar(linhas);
      this.resolverGolpes(onde, aoFim);
    });
  },

  resolverEvolucoes(aoFim){
    const p = (Estado.dados.time || []).find(x => x.evoPendente && !x.morto);
    if (!p) return aoFim();
    const destino = p.evoPendente;
    UI.telaEvolucao(p, destino, (evoluiu) => {
      if (evoluiu){
        evoluir(p, destino);
        golpesAoEvoluir(p);
        Estado.registrar(`${nomeExib(p)} evoluiu para ${p.nome}.`);
      } else {
        p.evoPendente = null;
        p.evoCanceladaEm = p.nivel;
      }
      Estado.salvar('auto');
      /* a forma nova pode ter golpe no nível atual — pergunta já */
      this.resolverGolpes('modal', () => this.resolverEvolucoes(aoFim));
    });
  },

  resolverPendencias(aoFim){
    this.resolverGolpes('modal', () => this.resolverEvolucoes(aoFim));
  },

  finalizarBatalha(fim){
    if (this.estradaAtual)  return Estrada.resultado(fim);
    if (this.revancheAtual) return this.resultadoRevanche(fim);
    if (this.ginasioAtual)  return this.resultadoGinasio(fim);
    if (this.eliteAtual)    return this.resultadoElite(fim);
    if (this.torneioAtual)  return this.resultadoTorneio(fim);
    if (this.rivalAtual)    return this.resultadoRival(fim);
    this.registrarBriga(fim);
    const b = this.cenaBatalha || {};
    const rotaFuga = b.fuga2 || (typeof b.fuga === 'string' ? b.fuga : null);
    let destino, aviso;

    switch (fim.resultado){
      case 'gameover':
        return UI.telaGameOver('Um Pokémon selvagem te matou. Não tinha mais ninguém entre você e ele.');
      case 'vitoria': {
        destino = b.vitoria; aviso = {tipo:'info', texto:'Você venceu.'};
        const pr = premioCena(b);
        if (pr.valor && !pr.pelaCena){
          Estado.j.dinheiro += pr.valor;
          aviso = {tipo:'item', texto:`Você venceu. +${pr.valor.toLocaleString('pt-BR')} ₽`};
        }
        break;
      }
      case 'captura':
        destino = b.captura || b.vitoria; aviso = {tipo:'pokemon', texto:'Captura concluída.'}; break;
      case 'derrota':
        destino = b.derrota || b.vitoria; aviso = {tipo:'dano', texto:'Você perdeu essa.'}; break;
      case 'fuga': case 'escapou': case 'encarou':
        destino = rotaFuga || b.derrota || b.vitoria;
        aviso = {tipo:'info', texto: fim.resultado === 'encarou' ? 'Você encarou e ele recuou.' : 'Você escapou.'}; break;
      default:
        destino = b.vitoria || b.derrota;
    }

    // batalha que não pertence a nenhuma cena: veio da exploração
    if (!destino){
      const avisos = [aviso].filter(Boolean);
      Estado.salvar('auto');
      this.batalhaLivre = false;
      this.seguirDaEstrada(avisos);
      return;
    }
    this.irPara(destino, [aviso].filter(Boolean));
  },

  /* Depois de uma briga que não é de cena (selvagem que surgiu, gente
     da estrada): volta pro mapa, ou segue a viagem que ela interrompeu. */
  seguirDaEstrada(avisos){
    const depois = this.depoisDaEstrada;
    this.depoisDaEstrada = null;
    if (depois) return depois(avisos);
    Exploracao.tela(avisos);
  },

  /* Como a última briga de cena terminou. A cena seguinte lê isso pra
     contar o que aconteceu de verdade, em vez de um texto só pra quatro
     finais diferentes. */
  registrarBriga(fim){
    const B = Batalha, al = B.aliado, ini = B.inimigo;
    Estado.dados.ultimaBatalha = {
      resultado: fim.resultado,
      dex: ini ? ini.dex : null,
      turnos: B.turno || 0,
      aliadoUid: al ? al.uid : null,
      hpAliado: al && al.hpMax ? Math.max(0, al.hp) / al.hpMax : 0,
      feriuVoce: !!(Estado.j && Estado.j.hp < (B.hpJogadorInicio || 0)),
      capturado: fim.pokemon ? fim.pokemon.uid : null
    };
  },

  /* ---------- fim de capítulo ---------- */
  fecharCapitulo(){
    const avisos = Historia.fecharCapitulo();
    /* Rede: nenhuma rota do primeiro capítulo termina sem o aparelho.
       Quem saiu por uma porta que não passa por casa recebe do balcão. */
    const pend = [];
    this.avisarNumeros(pend);
    pend.forEach(a => avisos.push(a.texto));
    /* e nenhuma termina sem o inicial: se o Professor ficou esperando
       (rota que não passou pela rua), a bola chega pelo balcão */
    if (Estado.dados.capitulo === 1 && Estado.dados.flags.espera_o_professor && typeof entregarDoProfessor === 'function'){
      entregarDoProfessor(Estado.dados);
      avisos.push('O Professor mandou a bola pelo balcão do Centro, com o seu nome na etiqueta.');
    }
    if (Estado.dados.capitulo === 1 && Estado.dados.flags.espera_o_assistente && typeof entregarInicial === 'function'){
      entregarInicial(Estado.dados);
      avisos.push('O Célio deixou uma bola no balcão do Centro, com o seu nome na etiqueta.');
    }
    if (Estado.dados.capitulo === 1 && !Estado.temPokenav()){
      Estado.ganharPokenav();
      avisos.push('Deixaram um PokéNav no balcão do Centro com o seu nome num papel. O número de casa já está gravado.');
    }
    /* o que você fez neste capítulo pode ter rendido um rival */
    const novos = (typeof conquistarRivais === 'function') ? conquistarRivais() : [];
    UI.telaFimCapitulo(avisos.concat(novos.map(a => a.texto)));
  },

  gastarPonto(chave){
    const j = Estado.j;
    if (j.pontos <= 0 || this.subidosNoCap.includes(chave)) return;
    if (!Estado.subirStatus(chave)) return;
    j.pontos--;
    this.subidosNoCap.push(chave);
    Estado.salvar('auto');
    UI.telaFimCapitulo();
    // repinta mantendo o estado de travas
  },

  voltarAoMundo(){
    if (Estado.j.pontos > 0 && !confirm('Você ainda tem pontos para distribuir. Seguir mesmo assim? (Eles ficam guardados.)')) return;
    /* Quem nasceu longe da estrada dos ginásios não faz Kanto de trás
       pra frente a pé com um bicho de nível 5: a licença vem com a
       passagem do ônibus da Liga até Viridian, como nos jogos em que
       tudo começa entre Pallet e Viridian. */
    const d = Estado.dados;
    if (d.capitulo === 1 && !d.flags.onibus_da_liga && !['Pallet','Viridian'].includes(d.jogador.cidade)){
      d.flags.onibus_da_liga = true;
      Mundo.viajar('viridian');
      /* sai na manhã seguinte, desce no fim da tarde */
      Estado.dados.relogio.dia += 1;
      Estado.dados.relogio.periodo = 'tarde';
      this.avisoOnibus = [
        {tipo:'info', texto: d.flags.tem_licenca
          ? 'A passagem veio grampeada na licença. O ônibus da Liga sai da rodoviária de manhã cedo, cheio de gente da sua idade com mochila nova, e para em cada cidade grande do caminho.'
          : 'Sem licença não tem passagem de graça: você paga o ônibus da rodoviária do próprio bolso, sentad{o|a} no fundo, do lado de uma senhora com uma gaiola de Pidgey no colo.'},
        {tipo:'info', texto:'Você desce em Viridian no fim da tarde. Daqui pra frente a estrada é sua, e é a pé.'}
      ];
    }
    const prox = Estado.dados.capitulo + 1;
    const enc = rivalDeveAparecer(prox);
    if (enc){
      this.encontroRival = enc;
      this.proxCapPendente = null;
      return UI.telaRival();
    }
    Estado.salvar('auto');
    const av = this.avisoOnibus; this.avisoOnibus = null;
    Exploracao.tela(av || undefined);
  },

  avancarCapitulo(){
    if (Estado.j.pontos > 0 && !confirm('Você ainda tem pontos para distribuir. Seguir mesmo assim? (Eles ficam guardados.)')) return;
    const prox = Historia.proximoCapitulo(true);
    if (!prox){
      return UI.telaFinal({titulo:'A JORNADA CONTINUA', texto:[
        'Você chegou ao fim do que está escrito. O resto é estrada.',
        'Kanto continua exatamente do jeito que você deixou — e essa é a parte que importa.'
      ]});
    }
    // um rival aparece na estrada entre um capítulo e outro
    const enc = rivalDeveAparecer(prox);
    if (enc){
      this.encontroRival = enc;
      this.proxCapPendente = prox;
      return UI.telaRival();
    }
    return this.viajarParaCapitulo(prox);
  },

  /* O capítulo seguinte acontece em algum lugar. Se você não está
     nele, existe estrada no meio — e a estrada é contada. */
  viajarParaCapitulo(prox){
    const destino = localDoCapitulo(prox);
    const aqui = Estado.dados.local;
    if (!destino || destino === aqui) return this.entrarNoCapitulo(prox);

    /* o caminho de verdade: você passa por cada lugar do trajeto, e o
       tempo é o tempo do trajeto e não um número arredondado */
    const rota = caminhoEntre(aqui, destino) || [aqui, destino];
    const dias = Math.max(1, rota.length - 1);
    this.capDepoisDaViagem = prox;
    this.destinoDaViagem = destino;
    this.rotaDaViagem = rota;
    UI.telaViagem(aqui, destino, dias, 'Jogo.chegarDaViagem()', rota);
  },

  chegarDaViagem(){
    const prox = this.capDepoisDaViagem;
    const destino = this.destinoDaViagem;
    const rota = this.rotaDaViagem;
    this.capDepoisDaViagem = null; this.destinoDaViagem = null; this.rotaDaViagem = null;
    if (destino){
      const caminho = rota || caminhoEntre(Estado.dados.local, destino) || [Estado.dados.local, destino];
      /* cada trecho andado custa um dia e fica marcado como visitado:
         você passou por ali, então aquilo passa a existir no seu mapa */
      for (const id of caminho){
        Mundo.marcarVisitado(id);
        Mundo.descobrir('passou_' + id);
      }
      Mundo.passar(Math.max(1, caminho.length - 1) * 4);
      Estado.dados.local = destino;
      Estado.registrar(caminho.length > 2
        ? `Viajou até ${(LOCAIS[destino]||{}).nome || destino}, passando por ${caminho.slice(1,-1).map(x=>(LOCAIS[x]||{}).nome||x).join(', ')}.`
        : `Viajou até ${(LOCAIS[destino]||{}).nome || destino}.`);
      /* Quem anda pela rota topa com o que vive nela. Uma parada por
         viagem, no máximo, num trecho de estrada do caminho: você não
         escolhe, só acontece. Depois da briga, a viagem continua. */
      const trechos = caminho.filter(id => LOCAIS[id] && LOCAIS[id].tipo !== 'cidade');
      if (trechos.length && this.pararNaEstrada(Dados.escolher(trechos), () => this.entrarNoCapitulo(prox), destino)) return;
    }
    this.entrarNoCapitulo(prox);
  },

  /* A estrada te para: gente que treina ali, ou um selvagem que sai do
     mato. Devolve true se parou (a tela é da batalha). `seguir` roda
     depois da briga; `destino`, se houver, é onde você termina. */
  pararNaEstrada(trecho, seguir, destino){
    const L = LOCAIS[trecho];
    if (!L || !Estado.primeiroApto()) return false;
    const voltar = () => { if (destino) Estado.dados.local = destino; };
    const continuar = (avisos) => { voltar(); Estado.salvar('auto'); seguir(avisos); };
    const antes = Estado.dados.local;
    Estado.dados.local = trecho;
    if (Estrada.talvez('viagem', trecho)){ this.depoisDaEstrada = continuar; return true; }
    const t = Dados.teste(Estado.j.status.intelecto, 5, 'Rota');
    const risco = {critico:15, sucesso:25, parcial:35, falha:45}[t.grau];
    if (!Exploracao.repelenteAtivo() && Dados.chance(risco)){
      const enc = sortearSelvagem(L.ambiente, L.nivel, trecho);
      this.depoisDaEstrada = continuar;
      Exploracao.encontro(enc, [Estado.conheceu(enc.dex)
        ? `No meio da viagem, ${emLocal(trecho)}, um ${enc.nome} sai ${Arenas.terreno(L.ambiente).sai} e não desvia.`
        : `No meio da viagem, ${emLocal(trecho)}, um Pokémon sai ${Arenas.terreno(L.ambiente).sai} e não desvia.`]);
      return true;
    }
    Estado.dados.local = antes;
    return false;
  },

  entrarNoCapitulo(prox){
    const cena = Historia.iniciarCapitulo(prox);
    /* o que os seus postos pagam (ou cobram) na virada do capítulo */
    const daCredencial = (typeof Cargos !== 'undefined') ? Cargos.pagarCapitulo() : [];
    Estado.salvar('auto');
    /* telefone toca na hora errada, que é quando telefone toca */
    if (this.talvezToque()) { this.cenaDepoisDaChamada = cena; return; }
    /* Nada de repetir nome, reputação e time na abertura de cada capítulo:
       isso já está no topo da tela, na Ficha e no Time. A cena abre na cena. */
    UI.telaCena(cena, daCredencial);
  },

  /* ---------- BALCÃO DE CREDENCIAIS ---------- */
  assumirCargo(id){
    const r = Cargos.assumir(id);
    if (!r.ok) return UI.modal('Credenciais', `<p class="nada">${UI.esc(r.motivo)}</p>`, false, 'credencial');
    Estado.salvar('auto');
    UI.telaCargo(r.cargo, r.avisos);
  },
  largarCargo(id){
    const c = Cargos.porId(id);
    if (!c) return;
    if (!confirm(`Largar ${c.nome}? Você perde o que ele te dá.`)) return;
    Cargos.largar(id);
    Estado.salvar('auto');
    UI.modalCredenciais();
  },

  mostrarFinal(){
    const cena = Historia.cenaAtual;
    Estado.registrar('FIM: ' + cena.final.titulo);
    Estado.salvar('auto');
    UI.telaFinal(cena.final);
  },

  /* ---------- HUB ---------- */
  hubCentro(){
    Estado.dados.time.forEach(curarTotal);
    Estado.curarJogador(8);
    Estado.dados.relogio.dia++;
    Estado.salvar('auto');
    UI.telaHub();
    UI.avisos([{tipo:'cura', texto:'Time curado. Você dormiu em cama de verdade e recuperou 8 de HP.'}]);
  },

  hubLoja(){ return Cidade.loja(); },
  comprar(nome, preco){ return Cidade.comprar(nome, preco); },

  hubTreinar(){
    const meu = Estado.primeiroApto();
    if (!meu){ UI.modal('Treinar', '<p class="nada">Nenhum Pokémon em pé. Cure o time antes.</p>'); return; }
    const cap = Historia.capitulo(Estado.dados.capitulo) || Historia.capitulo(1);
    const wild = sortearSelvagem(cap.ambiente, cap.nivelArea);
    this.cenaBatalha = null;
    Estado.dados.relogio.dia++;
    UI.limparDados();
    Batalha.iniciar(meu, wild, {tipo:'selvagem', fuga:true});
    UI.telaBatalha();
  },

  hubSoltar(){
    const time = Estado.dados.time;
    if (!time.length) return UI.modal('Soltar', '<p class="nada">Você não tem ninguém.</p>');
    UI.modal('Soltar quem?', time.map(p =>
      `<button class="escolha" onclick="Jogo.confirmarSoltar('${p.uid}')">
        ${UI.esc(nomeExib(p))} — Nv ${p.nivel}, moral ${p.moral}${p.lendario?' · LENDÁRIO':''}</button>`).join('') +
      '<p class="sussurro" style="margin-top:12px">Soltar é permanente. Soltar um lendário muda o mundo.</p>');
  },

  confirmarSoltar(uid){
    const p = Estado.dados.time.find(x => x.uid === uid);
    if (!p) return;
    if (!confirm('Soltar ' + nomeExib(p) + '? Isso é permanente.')) return;
    const eventos = Captura.soltar(p);
    UI.fecharModal();
    Estado.salvar('auto');
    UI.telaHub();
    UI.avisos(eventos.map(e => ({tipo:e.tipo, texto:e.texto})));
  },

  /* ---------- GINÁSIOS ---------- */
  abrirGinasios(de){
    this.voltarDeGinasio = de || 'hub';
    UI.telaGinasios();
  },

  voltarDosGinasios(){
    if (this.voltarDeGinasio === 'exploracao') return Exploracao.tela();
    if (this.voltarDeGinasio === 'cena' && Historia.cenaAtual){
      UI.telaCena(Historia.ir(Estado.dados.cena));
    } else if (this.voltarDeGinasio === 'fimCapitulo'){
      UI.telaFimCapitulo();
    } else {
      UI.telaHub();
    }
  },

  desafiarGinasio(id){
    const g = ginasioPorId(id);
    if (!g) return;
    const st = statusGinasio(g);
    if (st.estado !== 'disponivel') return UI.telaGinasios();

    const meu = Estado.primeiroApto();
    if (!meu) return UI.modal('Ginásio', '<p class="nada">Nenhum Pokémon em pé. Cure o time antes de desafiar um líder.</p>');

    const time = timeGinasio(g).map(x => criarPokemon(x.dex, x.nivel, {}));
    /* o líder grita o nome ao soltar a bola — a entrada já sai com o nome certo */
    time.forEach(x => { x.nomeAnunciado = true; });
    this.ginasioAtual = g;
    this.cenaBatalha = null;
    /* entrou uma vez, viu o time: a ficha do ginásio abre daqui pra frente */
    Estado.marcar('enfrentou_' + g.id);
    Estado.registrar(`Desafiou ${g.lider} no Ginásio de ${g.cidade}.`);
    UI.limparDados();
    Batalha.iniciar(meu, time[0], {
      tipo:'treinador', fuga:false, treinador:`Líder ${g.lider}`,
      timeInimigo: time.slice(1),
      revelarNatureza: true,   // líder e nome grande falam do próprio time
      introducao: `${g.lider} enviou ${nomeVisivel(time[0])} (Nv ${time[0].nivel})!`
    });
    UI.telaBatalha(g.intro ? g.intro(Estado.dados).filter(Boolean) : null);
  },

  resultadoGinasio(fim){
    const g = this.ginasioAtual;
    this.ginasioAtual = null;
    if (fim.resultado === 'gameover'){
      return UI.telaGameOver('Você caiu num ginásio. Não devia ser possível, e foi.');
    }
    const venceu = fim.resultado === 'vitoria';
    const avisos = [];

    if (venceu){
      Estado.dados.insignias.push(g.insignia);
      avisos.push({tipo:'insignia', texto:`Insígnia conquistada: ${g.insignia} (${Estado.dados.insignias.length}/8)`});
      const p = g.premio || {};
      if (p.dinheiro){
        const mult = (fim && fim.bonusDinheiro) || 1;
        const val = premioGinasio(g, fim);
        Estado.j.dinheiro += val;
        avisos.push({tipo:'item', texto:`+${val} ₽${mult > 1 ? ' (Amuleto de Moeda)' : ''}`});
      }
      if (p.itens) for (const [n,q] of Object.entries(p.itens)){ Estado.darItem(n,q); avisos.push({tipo:'item', texto:`Recebeu ${q}× ${n}.`}); }
      if (p.rep){
        const r = Estado.mudarRep('bom', p.rep, `Venceu o Ginásio de ${g.cidade}`, {rep:{notorio:true, peso:10}});
        if (r && r.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
      }
      if (p.status && Estado.subirStatus(p.status)){
        avisos.push({tipo:'rep', texto:`${p.status.toUpperCase()} +1 — ${g.efeito}`});
      } else if (g.efeito){
        avisos.push({tipo:'info', texto:g.efeito});
      }
      Estado.registrar(`Venceu ${g.lider} e conquistou a ${g.insignia}.`);
      this.avisarNumeros(avisos);
      if (Estado.dados.insignias.length === 8){
        avisos.push({tipo:'rep', texto:'Oito insígnias. Kanto inteira está aberta para você.'});
        Estado.marcar('oito_insignias');
        const r = Estado.mudarRep('bom', 2, 'Conquistou as oito insígnias de Kanto', {rep:{notorio:true, peso:4}});
        if (r && r.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
      }
    } else {
      Estado.registrar(`Perdeu para ${g.lider} no Ginásio de ${g.cidade}.`);
    }
    Estado.salvar('auto');
    UI.telaResultadoGinasio(g, venceu, avisos);
  },

  /* ============================================================
     POKÉNAV — ligar para alguém
     Revanche cai em combate. Favor, missão e notícia caem numa
     tela de conversa, que é onde a fala com dono aparece.
     ============================================================ */
  responderChamada(id, i){
    const r = Chamadas.atender(id, i);
    if (!r) return this.voltarDaLigacao();
    UI.telaResultadoChamada(r);
  },
  recusarChamada(id){
    const r = Chamadas.recusar(id);
    if (!r) return this.voltarDaLigacao();
    UI.telaResultadoChamada(r);
  },

  /* o telefone toca na virada de capítulo e ao chegar num lugar novo */
  talvezToque(){
    if (typeof Chamadas === 'undefined' || !Estado.temPokenav()) return false;
    if (!Dados.chance(38)) return false;
    const c = Chamadas.sortear();
    if (!c) return false;
    UI.telaChamada(c);
    return true;
  },

  resolverEvento(eid, i){
    const r = Eventos.resolver(eid, i);
    if (!r) return Exploracao.tela();
    UI.telaResultadoEvento(r);
  },

  /* de onde a ligação saiu: cena, exploração ou hub */
  /* acrescenta aos avisos da tela quem passou o número agora */
  avisarNumeros(avisos){
    (Estado.numerosNovos() || []).forEach(c => avisos.push({tipo:'item',
      texto:`${textoContato(c,'nome')} te passou o número. Está esperando no PokéNav.`}));
    return avisos;
  },

  voltarDaLigacao(){
    const d = Estado.dados;
    if (this.cenaDepoisDaChamada){
      const cena = this.cenaDepoisDaChamada;
      this.cenaDepoisDaChamada = null;
      return UI.telaCena(cena);
    }
    if (d.modo === 'cena' && Historia.cenaAtual) return UI.telaCena(Historia.cenaAtual);
    return Exploracao.tela();
  },

  ligarPara(id, servico){
    const c = contatoPorId(id);
    if (!c) return;
    const r = Estado.podeLigar(id, servico);
    if (!r.ok) return UI.modal('PokéNav', `<p class="nada">${UI.esc(r.motivo)}</p>`);

    if (servico === 'revanche') return this.revanche(c);
    if (servico === 'missao')   return this.missao(c);

    const def = c[servico] || {};
    const falas = (typeof def.texto === 'function' ? def.texto(Estado.dados) : def.texto) || [];
    let avisos = [];
    if (typeof def.efeito === 'function'){
      try { avisos = def.efeito(Estado.dados) || []; } catch(e){ avisos = []; }
    }
    if (def.rep){
      const m = Estado.mudarRep(def.rep.eixo, def.rep.delta, def.rep.motivo, {rep:def.rep});
      if (m && m.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${m.de} → ${m.para}`});
    }
    if (def.marca) Estado.marcar(def.marca);
    Estado.marcarLigacao(id, servico);
    Estado.salvar('auto');
    UI.telaLigacao(c, falas, avisos);
  },

  /* missão: pedir numa ligação, cumprir no mundo, voltar pra entregar */
  missao(c){
    const fase = Estado.faseDaMissao(c.id);
    const m = c.missao || {};
    if (fase === 'pedir'){
      Estado.aceitarMissao(c.id);
      if (typeof m.aoAceitar === 'function'){ try { m.aoAceitar(Estado.dados); } catch(e){} }
      Estado.marcarLigacao(c.id, 'missao');
      Estado.salvar('auto');
      return UI.telaLigacao(c, txt(m.pedido) || [], []);
    }
    if (fase === 'entregar'){
      let avisos = [];
      if (typeof m.recompensa === 'function'){
        try { avisos = m.recompensa(Estado.dados) || []; } catch(e){ avisos = []; }
      }
      if (m.rep){
        const r = Estado.mudarRep(m.rep.eixo, m.rep.delta, m.rep.motivo, {rep:m.rep});
        if (r && r.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
      }
      if (m.marca) Estado.marcar(m.marca);
      Estado.fecharMissao(c.id);
      Estado.marcarLigacao(c.id, 'missao');
      Estado.salvar('auto');
      return UI.telaLigacao(c, txt(m.entregue) || [], avisos);
    }
    return UI.modal('PokéNav', `<p class="nada">${UI.esc(txt(m.dica) || 'Ainda não.')}</p>`);
  },

  /* revanche: o mesmo adversário, com o time subido junto com você */
  revanche(c){
    const meu = Estado.primeiroApto();
    if (!meu) return UI.modal('PokéNav', '<p class="nada">Nenhum Pokémon em pé. Cure o time antes de marcar revanche.</p>');

    let time = null, nome = textoContato(c, 'nome');
    if (c.ginasio){
      const g = ginasioPorId(c.ginasio);
      if (!g) return;
      /* na revanche o líder vem com o escalão de quem já tem tudo */
      time = timeGinasio(g, Math.min(8, numInsignias() + 2)).map(x => criarPokemon(x.dex, x.nivel + 2, {}));
      nome = 'Líder ' + g.lider;
    } else if (c.rivalExtra){
      const R = defRival(c.rivalExtra);
      if (!R) return;
      time = timeRivalExtra(R).map(p => { p.nivel += 2; return p; });
    } else if (c.rival === 'teo'){
      time = timeRival().map(p => { p.nivel += 2; return p; });
    } else if (c.id === 'nadia' && typeof timeDaNadia === 'function'){
      time = timeDaNadia();
    } else if (c.estrada){
      const t = treinadorEstrada(c.estrada);
      if (!t) return;
      time = timeEstrada(t, Math.min(8, numInsignias() + 2), 2);
      nome = nomeDeLuta(t);
    } else if (typeof c.timeRevanche === 'function'){
      time = c.timeRevanche(Estado.dados);
    }
    if (!time || !time.length) return;
    time.forEach(x => { x.nomeAnunciado = true; });

    this.revancheAtual = {id:c.id, nome};
    this.ginasioAtual = null; this.eliteAtual = null; this.torneioAtual = null;
    this.rivalAtual = null; this.cenaBatalha = null;
    Estado.marcarLigacao(c.id, 'revanche');
    Estado.registrar(`Marcou revanche com ${nome}.`);
    UI.limparDados();
    Batalha.iniciar(meu, time[0], {
      tipo:'treinador', fuga:false, treinador:nome,
      timeInimigo: time.slice(1), revelarNatureza:true,
      introducao:`${nome} enviou ${nomeVisivel(time[0])} (Nv ${time[0].nivel})!`
    });
    UI.telaBatalha([
      `<p>Revanche marcada pelo PokéNav. ${UI.esc(nome)} veio com o time subido — quem aceita revanche não vem pra repetir o resultado.</p>`
    ].map(h => UI.el(h).outerHTML ? h : h));
  },

  resultadoRevanche(fim){
    const rev = this.revancheAtual;
    this.revancheAtual = null;
    if (fim.resultado === 'gameover') return UI.telaGameOver('Você caiu numa revanche que você mesm{o|a} marcou.');
    const venceu = fim.resultado === 'vitoria';
    const avisos = [];
    if (venceu){
      const premio = premioRevanche();
      Estado.j.dinheiro += premio;
      avisos.push({tipo:'item', texto:`+${premio} ₽`});
      const m = Estado.mudarRep('bom', 2, `Venceu a revanche contra ${rev.nome}`, {rep:{notorio:true, peso:3}});
      if (m && m.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${m.de} → ${m.para}`});
      Estado.registrar(`Venceu a revanche contra ${rev.nome}.`);
    } else {
      avisos.push({tipo:'dano', texto:'Você marcou, você perdeu. O número continua na agenda.'});
      Estado.registrar(`Perdeu a revanche contra ${rev.nome}.`);
    }
    Estado.salvar('auto');
    UI.telaLigacao(contatoPorId(rev.id), venceu
      ? [{quem:rev.nome, diz:'Foi. Foi mesmo. Liga de novo quando estiver melhor ainda.'}]
      : [{quem:rev.nome, diz:'Ainda não. Mas você marcou, e marcar já é alguma coisa.'}], avisos);
  },

  /* ---------- O RIVAL ---------- */
  lutarRival(){
    const enc = this.encontroRival || {tipo:'teo'};
    const R = enc.tipo === 'extra' ? defRival(enc.id) : null;
    const nome = R ? R.nome : 'Ezra';
    const meu = Estado.primeiroApto();
    if (!meu) return UI.modal(nome, '<p class="nada">Nenhum Pokémon em pé. Ele espera — mas cure o time antes.</p>');
    const time = R ? timeRivalExtra(R) : timeRival();
    this.rivalAtual = R ? {extra:R.id} : {arco: arcoRival()};
    this.cenaBatalha = null; this.ginasioAtual = null; this.eliteAtual = null; this.torneioAtual = null;
    UI.limparDados();
    Batalha.iniciar(meu, time[0], {
      tipo:'treinador', fuga:false, treinador:nome,
      timeInimigo: time.slice(1),
      introducao: `${nome} enviou ${nomeVisivel(time[0])} (Nv ${time[0].nivel})!`
    });
    UI.telaBatalha(R ? falaRivalExtra(R) : falaRival());
  },

  resultadoRival(fim){
    /* rival conquistado tem caminho próprio */
    if (this.rivalAtual && this.rivalAtual.extra) return this.resultadoRivalExtra(fim, this.rivalAtual.extra);
    const arco = this.rivalAtual ? this.rivalAtual.arco : arcoRival();
    this.rivalAtual = null;
    if (fim.resultado === 'gameover') return UI.telaGameOver('Você caiu numa batalha contra alguém que te conhece desde a Rota 1.');

    const venceu = fim.resultado === 'vitoria';
    const falas = this.falasRival || (venceu ? falaVitoriaRival() : falaDerrotaRival());
    this.falasRival = null;
    registrarResultadoRival(venceu);
    const avisos = [];
    const npc = Estado.dados.npcs['Ezra'];

    if (venceu){
      if (arco === 'parceiro'){ Estado.j.dinheiro += PREMIO_RIVAL_PARCEIRO; avisos.push({tipo:'item', texto:`+${PREMIO_RIVAL_PARCEIRO.toLocaleString('pt-BR')} ₽ — ele dividiu o que tinha no bolso.`}); }
      if (arco === 'perseguidor'){
        Estado.lembrarNPC('Ezra', {opiniao:(npc?npc.opiniao:0)-1, memoria:'Tentou te parar e perdeu. Ajoelhou no chão e pediu para você parar.'});
        avisos.push({tipo:'dano', texto:'Ele pediu para você parar. Você venceu a batalha.'});
      } else {
        Estado.lembrarNPC('Ezra', {memoria:`Perdeu para você de novo. Placar ${rival().derrotas}×${rival().vitorias}.`});
      }
      const evs = ganharExp(Estado.primeiroApto() || Estado.dados.time[0], 400);
    } else {
      if (arco === 'perseguidor'){
        Estado.lembrarNPC('Ezra', {opiniao:(npc?npc.opiniao:0)+1, memoria:'Te venceu e mandou você voltar para casa.'});
        avisos.push({tipo:'info', texto:'Ele ficou entre você e o caminho.'});
      }
      Estado.j.dinheiro = Math.max(0, Estado.j.dinheiro - PERDA_RIVAL);
      avisos.push({tipo:'item', texto:`−${PERDA_RIVAL} ₽`});
    }
    Estado.salvar('auto');
    this.resolverPendencias(() => UI.telaResultadoRival(venceu, avisos, null, falas));
  },

  resultadoRivalExtra(fim, id){
    this.rivalAtual = null;
    const R = defRival(id);
    if (fim.resultado === 'gameover')
      return UI.telaGameOver(`Você caiu numa batalha contra ${R.nome}, que virou seu rival por causa de uma escolha sua.`);

    const venceu = fim.resultado === 'vitoria';
    const falas = this.falasRival || (venceu ? falaVitoriaRivalExtra(R) : falaDerrotaRivalExtra(R));
    this.falasRival = null;
    registrarResultadoRivalExtra(id, venceu);
    const avisos = [];
    const npc = Estado.dados.npcs[R.npc];
    const op = npc ? npc.opiniao : 0;

    if (venceu){
      Estado.lembrarNPC(R.npc, {memoria:`Perdeu para você de novo. ${R.nome} continua vindo.`});
      ganharExp(Estado.primeiroApto() || Estado.dados.time[0], 380);
      if (id === 'vasco'){
        Estado.lembrarNPC(R.npc, {opiniao: op - 1, memoria:'Perdeu de novo e não pareceu se importar com isso.'});
        avisos.push({tipo:'dano', texto:'Ele vai voltar. Ele disse isso de um jeito que não é ameaça e é pior.'});
      }
    } else {
      Estado.lembrarNPC(R.npc, {opiniao: op + 1, memoria:`Te venceu. Placar ${registroRival(id).derrotas}×${registroRival(id).vitorias}.`});
      const perda = perdaRivalExtra(id);
      Estado.j.dinheiro = Math.max(0, Estado.j.dinheiro - perda);
      avisos.push({tipo:'item', texto:`−${perda} ₽`});
    }
    Estado.salvar('auto');
    this.resolverPendencias(() => UI.telaResultadoRival(venceu, avisos, id, falas));
  },

  seguirDepoisDoRival(){
    this.encontroRival = null;
    const prox = this.proxCapPendente;
    this.proxCapPendente = null;
    if (!prox) return Exploracao.tela();
    this.viajarParaCapitulo(prox);
  },

  evitarRival(){
    const enc = this.encontroRival || {tipo:'teo'};
    const cap = this.proxCapPendente || Estado.dados.capitulo;
    if (enc.tipo === 'extra'){
      const R = defRival(enc.id);
      const reg = registroRival(enc.id);
      if (reg) reg.ultimoCap = cap;
      const npc = Estado.dados.npcs[R.npc];
      Estado.lembrarNPC(R.npc, {opiniao:(npc?npc.opiniao:0)-1, memoria:'Você passou por ele sem parar.'});
      Estado.registrar(`Evitou o encontro com ${R.nome}.`);
    } else {
      const r = rival();
      r.ultimoCap = cap;
      const npc = Estado.dados.npcs['Ezra'];
      Estado.lembrarNPC('Ezra', {opiniao:(npc?npc.opiniao:0)-1, memoria:'Você passou por ele sem parar.'});
      Estado.registrar('Evitou o encontro com Ezra.');
    }
    Estado.salvar('auto');
    this.seguirDepoisDoRival();
  },

  /* ---------- LIGA: ELITE 4, CAMPEÃO E TORNEIO ---------- */
  abrirLiga(de){
    this.voltarDeGinasio = de || 'hub';
    UI.telaLiga();
  },

  /* ── Elite 4 ── */
  iniciarElite4(){
    if (statusElite4().estado !== 'disponivel') return UI.telaLiga();
    const meu = Estado.primeiroApto();
    if (!meu) return UI.modal('Elite 4', '<p class="nada">Nenhum Pokémon em pé. A ala não tem Centro Pokémon — cure antes de entrar.</p>');
    this.eliteAtual = {indice:0, campeao:false};
    Estado.registrar('Entrou na ala da Elite 4.');
    this.batalhaElite();
  },

  batalhaElite(){
    const e = this.eliteAtual;
    const meu = Estado.primeiroApto();
    if (!meu) return this.resultadoElite({resultado:'derrota'});

    const alvo = e.campeao ? CAMPEAO : ELITE4[e.indice];
    const nivel = alvo.nivelBase;
    const time = alvo.especies.map((dex,i) =>
      criarPokemon(dex, nivel + i, {apelido: (alvo.apelidos||{})[dex] || null}));
    if (time.length) time[time.length-1].nivel += 2;
    time.forEach(x => { x.nomeAnunciado = true; });

    this.cenaBatalha = null; this.ginasioAtual = null; this.torneioAtual = null;
    UI.limparDados();
    Batalha.iniciar(meu, time[0], {
      tipo:'treinador', fuga:false,
      treinador: e.campeao ? 'Red' : alvo.nome,
      timeInimigo: time.slice(1),
      revelarNatureza: true,   // líder e nome grande falam do próprio time
      introducao: `${alvo.nome} enviou ${nomeVisivel(time[0])} (Nv ${time[0].nivel})!`
    });
    UI.telaBatalha(alvo.intro(Estado.dados).filter(Boolean));
  },

  resultadoElite(fim){
    const e = this.eliteAtual;
    if (fim.resultado === 'gameover'){ this.eliteAtual = null; return UI.telaGameOver('Você caiu dentro do Planalto Indigo.'); }

    const venceu = fim.resultado === 'vitoria';
    const alvo = e.campeao ? CAMPEAO : ELITE4[e.indice];

    if (!venceu){
      this.eliteAtual = null;
      Estado.registrar(`Perdeu para ${alvo.nome} na Elite 4.`);
      Estado.salvar('auto');
      return UI.telaResultadoLiga({
        titulo: e.campeao ? 'O Campeão' : `${alvo.nome} venceu`,
        sub: e.campeao ? 'Salão do Campeão' : `Elite 4 · ${alvo.ordem} de 4`,
        falas: e.campeao ? CAMPEAO.derrota(Estado.dados) : [
          `Você perde para ${alvo.nome}.`,
          'A ala da Elite 4 tem uma regra só e a regra é essa: perdeu, sai. Do começo.',
          'Alguém do staff te acompanha até o corredor principal com uma educação que dói mais que deboche.'
        ],
        avisos: [], venceu:false
      });
    }

    const avisos = [];
    if (e.campeao){
      // CAMPEÃO DE KANTO
      this.eliteAtual = null;
      Estado.marcar('campeao_de_kanto');
      Estado.j.cargo = '{Campeão|Campeã} de Kanto';
      Estado.dados.insignias.push('Título de Campeão');
      Estado.j.dinheiro += PREMIO_CAMPEAO;
      Estado.darItem('Master Ball', 1);
      Estado.darItem('Hyper Potion', 5);
      Estado.darItem('Full Heal', 5);
      const r = Estado.mudarRep('bom', 3, 'Venceu Red e assumiu a cadeira de Campeão de Kanto', {rep:{notorio:true, peso:8}});
      avisos.push({tipo:'insignia', texto:'Você é o Campeão de Kanto. A cadeira estava vaga há dois anos.'});
      avisos.push({tipo:'item', texto:'+80.000 ₽ · Master Ball · 5× Hyper Potion · 5× Full Heal'});
      /* A carta de atualização. Ela é a última coisa que a Liga faz
         por você como desafiante e a primeira que faz como Campeão. */
      Estado.marcar('dex_nacional');
      Estado.marcar('johto_liberado');
      avisos.push({tipo:'pokedex', texto:'A Pokédex trava por quatro segundos e reinicia sozinha. Quando volta, a lista não termina mais no 151.'});
      avisos.push({tipo:'mundo', texto:'Cem registros novos, todos vazios. E a fronteira do norte, que ninguém cruzava sem autorização da Liga, agora é sua para autorizar.'});
      Estado.registrar('Pokédex Nacional liberada: 251 registros. Johto aberto.');
      if (r && r.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
      Estado.registrar('Venceu Red. Tornou-se Campeão de Kanto.');
      Estado.salvar('auto');
      return UI.telaResultadoLiga({
        titulo:'CAMPEÃO DE KANTO', sub:'Salão do Campeão',
        falas: CAMPEAO.vitoria(Estado.dados), avisos, venceu:true, campeao:true
      });
    }

    // próximo membro da Elite 4
    e.indice++;
    Estado.registrar(`Venceu ${alvo.nome} na Elite 4.`);
    const acabou = e.indice >= ELITE4.length;
    if (acabou) e.campeao = true;
    Estado.salvar('auto');
    UI.telaResultadoLiga({
      titulo: `${alvo.nome} derrotado`,
      sub: acabou ? 'A porta do fundo está aberta' : `Elite 4 · ${alvo.ordem} de 4`,
      falas: alvo.vitoria(Estado.dados),
      avisos: [{tipo:'info', texto:'Seu time NÃO é curado entre as salas. Use itens se precisar.'}],
      venceu:true, continuar:true
    });
  },

  continuarElite(){
    if (!this.eliteAtual) return UI.telaLiga();
    this.batalhaElite();
  },

  sairDaElite(){
    this.eliteAtual = null;
    UI.telaLiga();
  },

  /* ── Torneio ── */
  iniciarTorneio(){
    const st = statusTorneio();
    if (st.estado !== 'disponivel') return UI.telaLiga();
    const meu = Estado.primeiroApto();
    if (!meu) return UI.modal('Torneio', '<p class="nada">Nenhum Pokémon em pé. Cure o time antes de se inscrever.</p>');
    Estado.j.dinheiro -= INSCRICAO_TORNEIO;
    this.torneioAtual = {rodada:0, adversarios: montarChaveamento()};
    Estado.registrar('Inscreveu-se no Torneio Aberto da Liga.');
    UI.telaTorneio();
  },

  lutarRodadaTorneio(){
    const t = this.torneioAtual;
    if (!t) return UI.telaLiga();
    const meu = Estado.primeiroApto();
    if (!meu) return this.resultadoTorneio({resultado:'derrota'});
    const adv = t.adversarios[t.rodada];
    adv.time.forEach(x => { x.nomeAnunciado = true; });
    this.cenaBatalha = null; this.ginasioAtual = null; this.eliteAtual = null;
    UI.limparDados();
    Batalha.iniciar(meu, adv.time[0], {
      tipo:'treinador', fuga:false, treinador: adv.nome,
      timeInimigo: adv.time.slice(1),
      revelarNatureza: true,   // líder e nome grande falam do próprio time
      introducao: `${adv.nome} enviou ${nomeVisivel(adv.time[0])} (Nv ${adv.time[0].nivel})!`
    });
    UI.telaBatalha([`${PREMIO_TORNEIO[t.rodada].rodada} — ${adv.nome}`, adv.fala]);
  },

  resultadoTorneio(fim){
    const t = this.torneioAtual;
    if (fim.resultado === 'gameover'){ this.torneioAtual = null; return UI.telaGameOver('Você caiu numa arena de torneio, na frente de todo mundo.'); }

    const adv = t.adversarios[t.rodada];
    const premio = PREMIO_TORNEIO[t.rodada];
    const venceu = fim.resultado === 'vitoria';
    const avisos = [];

    if (!venceu){
      this.torneioAtual = null;
      const consolo = premioTorneio(t, false);
      Estado.j.dinheiro += consolo;
      avisos.push({tipo:'item', texto:`Premiação por participação: +${consolo} ₽`});
      Estado.registrar(`Eliminado do torneio por ${adv.nome} nas ${premio.rodada}.`);
      Estado.salvar('auto');
      return UI.telaResultadoLiga({
        titulo:'Eliminado', sub:`${premio.rodada} · ${adv.nome}`,
        falas:[
          `${adv.nome} vence e a arena bate palma pelo nome dele, não pelo seu.`,
          'Torneio é assim: o chaveamento não tem memória. Amanhã tem outro.',
          'Você recebe a premiação por participação num envelope com o logotipo da Liga e o seu nome escrito errado.'
        ],
        avisos, venceu:false
      });
    }

    const ganhoTorneio = premioTorneio(t, true);
    Estado.j.dinheiro += ganhoTorneio;
    avisos.push({tipo:'item', texto:`+${ganhoTorneio} ₽`});
    for (const [n,q] of Object.entries(premio.itens||{})){ Estado.darItem(n,q); avisos.push({tipo:'item', texto:`Recebeu ${q}× ${n}.`}); }
    if (premio.rep){
      const r = Estado.mudarRep('bom', premio.rep, `Avançou na ${premio.rodada} do Torneio da Liga`, {rep:{notorio:true, peso:3}});
      if (r && r.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
    }

    t.rodada++;
    const campeao = t.rodada >= t.adversarios.length;
    if (campeao){
      this.torneioAtual = null;
      Estado.dados.torneiosVencidos = (Estado.dados.torneiosVencidos||0) + 1;
      Estado.marcar('venceu_torneio');
      Estado.registrar(`Venceu o Torneio Aberto da Liga (${Estado.dados.torneiosVencidos}ª vez).`);
      Estado.salvar('auto');
      return UI.telaResultadoLiga({
        titulo:'CAMPEÃO DO TORNEIO', sub:`${Estado.dados.torneiosVencidos}º título`,
        falas:[
          `${adv.nome} aperta a sua mão antes do juiz anunciar, o que é o maior elogio possível.`,
          'A arena do Planalto tem quatrocentos lugares e hoje tinha umas oitenta pessoas. Torneio aberto é assim.',
          'Mesmo assim, quando anunciam o seu nome, oitenta pessoas fazem barulho de quatrocentas.',
          Estado.rep.eixo==='bom' && Estado.rep.bom>=5
            ? 'Três delas te esperam na saída pra pedir foto. Você não sabe o que fazer com as mãos.'
            : 'Você sai pela porta lateral antes da premiação terminar.'
        ],
        avisos, venceu:true
      });
    }

    Estado.salvar('auto');
    UI.telaResultadoLiga({
      titulo:`${adv.nome} derrotado`, sub:`${premio.rodada} vencida`,
      falas:[
        `${adv.nome} sai da arena sem drama. Torneio tem essa elegância que rota não tem.`,
        `Próxima: ${PREMIO_TORNEIO[t.rodada].rodada}, contra ${t.adversarios[t.rodada].nome}.`,
        'Você tem vinte minutos entre as lutas. Dá pra curar o time.'
      ],
      avisos, venceu:true, torneio:true
    });
  },

  curarNoTorneio(){
    Estado.dados.time.forEach(curarTotal);
    Estado.salvar('auto');
    UI.telaTorneio();
  },

  desistirTorneio(){
    this.torneioAtual = null;
    UI.telaLiga();
  },

  /* ---------- trocas e vendas com NPC ---------- */
  trocaComNPC(escolha){
    const time = Estado.dados.time;
    if (!time.length) return this.irPara(escolha.vai, [{tipo:'info', texto:'Você não tem nada para trocar.'}]);
    UI.modal('Quem você entrega?', time.map(p =>
      `<button class="escolha" onclick="Jogo.efetuarTroca('${p.uid}','${escolha.vai}')">
        ${UI.esc(nomeExib(p))} — Nv ${p.nivel}, ${UI.esc(p.natureza)}, moral ${p.moral}</button>`).join('') +
      '<p class="sussurro" style="margin-top:12px">Você não sabe o que vai receber.</p>');
  },

  efetuarTroca(uid, destino){
    const saiu = Estado.removerDoTime(uid);
    const dex = Dados.escolher(poolSelvagem());
    const nivel = Math.max(3, (saiu ? saiu.nivel : 8) + Dados.entre(-4, 7));
    const recebido = criarPokemon(dex, nivel, {
      moral:35,
      historia:'Recebid{o} numa troca. Teve outro treinador antes de você.'
    });
    Estado.adicionar(recebido);
    Estado.registrar(`Trocou ${saiu ? nomeExib(saiu) : '?'} por ${recebido.nome} Nv${recebido.nivel}.`);
    UI.fecharModal();
    this.irPara(destino, [
      {tipo:'item', texto:`Você entregou ${saiu ? nomeExib(saiu) : '?'}.`},
      {tipo:'pokemon', texto:`Recebeu ${recebido.nome} (Nv ${recebido.nivel}, ${recebido.natureza}) — moral 35. Ele não te conhece.`}
    ]);
  },

  venderDoTime(escolha){
    const time = Estado.dados.time;
    if (!time.length) return this.irPara(escolha.vai, [{tipo:'info', texto:'Você não tem nada para vender.'}]);
    UI.modal('Vender quem?', time.map(p => {
      const preco = Math.round((DEX[p.dex].total * p.nivel) / 6);
      return `<button class="escolha" onclick="Jogo.efetuarVenda('${p.uid}',${preco},'${escolha.vai}')">
        ${UI.esc(nomeExib(p))} — Nv ${p.nivel} · <b>${preco} ₽</b></button>`;
    }).join('') + '<p class="sussurro" style="margin-top:12px">Ele vai para a caixa de veludo. Isso é permanente.</p>');
  },

  efetuarVenda(uid, preco, destino){
    const p = Estado.dados.time.find(x => x.uid === uid);
    if (!p) return;
    const lendario = p.lendario;
    Estado.removerDoTime(uid);
    Estado.j.dinheiro += preco;
    Estado.registrar(`Vendeu ${nomeExib(p)} por ${preco} ₽.`);
    const avisos = Historia.aplicar({
      rep:{eixo:'ruim', delta: lendario ? 4 : 2, motivo:`Vendeu ${nomeExib(p)} numa banca de rua`},
      moral:-15
    });
    avisos.unshift({tipo:'item', texto:`+${preco} ₽`});
    UI.fecharModal();
    this.irPara(destino, avisos);
  }
};

window.addEventListener('DOMContentLoaded', () => Jogo.iniciar());
