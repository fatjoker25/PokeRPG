/* ============================================================
   DEFENDER O POSTO — o seu ginásio e a sua porta na Elite
   Foi pedido assim: quem vira líder de ginásio fica com o ginásio
   que está vago, sorteado, e quem senta na Elite fica com uma das
   portas cujo dono não voltou; e o posto se defende: desafiante
   marca desafio, com prazo, e você vai lá lutar.

   - O ginásio sai no `aoAssumir('lider')`, chamado pelo
     Cargos.assumir: o que o final já te deu (`assumiu_viridian`,
     depois.js), Viridian se o Blue foi embora no 23, ou o dado entre
     os oito. A porta sai no `aoAssumir('elite')`, no dado entre as
     três do meio cujo titular não voltou (titulares.js): o
     substituto desce pro corredor, o titular dela não volta mais
     (`Titulares.visitavel`) e a ala pula a sua porta
     (`Jogo.batalhaElite`). O ginásio de quem saiu deixa de ser dele:
     o telefone dele não fala mais de desafiante e a revanche fecha.
   - O desafio: `Defesa.conferir`, na tela do mapa, marca o próximo
     `ESPERA_ENTRE_DESAFIOS` dias depois do último, com
     `PRAZO_DA_DEFESA` dias de prazo, e a secretária do Planalto avisa
     pelo PokéNav (o contato `secretaria`, que só avisa). Capítulo que
     anda no meio do prazo remarca o prazo: a história te levou.
   - O tipo do ginásio (foi pedido assim): quem fica com o ginásio escolhe
     o tipo do ginásio (`telaTipo`, que a tela do mapa abre e só deixa sair
     escolhendo), entre os que os outros sete não usam: o de quem saiu
     fica livre, e Sombrio e Metálico entram com a Pokédex Nacional. O
     ginásio reabre `REABRE_EM_DIAS` depois da ficha assinada, e ginásio
     novo é ficha nova.
   - No ginásio, quem desafia é gente da estrada (estrada-dados.js), com
     zero a sete insígnias no dado, e você defende como os líderes de
     Kanto: só com o tipo do ginásio, do cinto ou do PC, no tamanho e até o
     nível do ás que o líder de antes usaria contra aquelas insígnias
     (`regra`, pela tabela de ginasios.js). O desafiante traz o time do
     escalão dele, no nível desse líder (`desafianteDaQuadra`). Sem
     ninguém que sirva, entregar a insígnia é desistir. Na quadra ninguém ganha
     experiência (`semExp` na luta): senão o time de baixo passava do
     teto, e você perdia o que montou.
   - Na porta, o desafiante sai dos inscritos do Torneio Aberto
     (liga.js), com as linhas, os golpes e o item dele, mas no tamanho e
     no nível da defesa (`DEFESAS.elite`: o ás `nivel` acima da média dos
     seus três mais fortes, `tam` Pokémon). O Ezra vem com o time de
     rival dele. Medido no sim-torneio (FASE=8, NIVEL e EXTRA da
     defesa): o jogador ingênuo no nível da área vence 57% na porta.
   - Ganhou: a Liga paga `DEFESAS[tipo].bonus` e tira uma advertência.
     Faltou ou desistiu: uma advertência. Perdeu: na porta, advertência;
     no ginásio, a insígnia vai e a fama zera, e só no Difícil vale
     advertência (`Dificuldade.derrotaNaQuadra`): quem ainda está
     montando os times não perde o ginásio por isso. Com
     `ADVERTENCIAS_PRA_PERDER`, a Liga tira o posto. A máquina do
     ginásio cura quem batalha antes e depois da luta; a da ala, depois.
   ============================================================ */
const ESPERA_ENTRE_DESAFIOS = [3, 6];   // dias entre um desafio e o próximo, no dado
const PRAZO_DA_DEFESA = 3;              // dias que o desafiante espera
const ADVERTENCIAS_PRA_PERDER = 3;      // com elas, a Liga tira o posto
const REABRE_EM_DIAS = 14;              // o ginásio reabre duas semanas depois da ficha assinada
/* no ginásio quem desafia é gente da estrada e luta como ela (erra o
   que a estrada erra, e gasta Vontade sem o critério cheio); o `nivel`
   e o `tam` dele são do desafio de antes da especialidade, que o save
   velho ainda pode ter. Na porta, o inscrito do torneio, com critério */
const DEFESAS = {
  lider:{nivel:-3, tam:4, erroIA:22, vontadeIA:false, bonus:1500},
  elite:{nivel:-5, tam:5, erroIA:8, vontadeIA:true, bonus:3000}
};
/* a fama da quadra: cada defesa ganha seguida sobe um degrau, até o
   último da tabela, e quem marca o desafio seguinte vem mais preparado:
   `itens` Pokémon dele segurando Leftovers (os mais fortes, fora o ás,
   que já segura o dele) e, no alto, `tam` Pokémon a mais no time.
   Perder, desistir ou faltar zera. Medido no sim-defesa.js, cada
   alavanca sozinha: o Pokémon a mais tira uns 16 pontos da vitória, cada
   Leftovers uns 5 (eram 9 antes de a sobra acabar, REGEN_TETO em
   batalha.js), e o resto quase nada — o erro da IA, o nível (um ponto de
   atributo a cada 7), o Muscle Band, o Wise Glasses e o Quick Claw. Com
   a escada: o forte vai de 84% a 55% no ginásio e de 71% a 45% na porta;
   o ingênuo, de 70% a 37% e de 52% a 26% */
const FAMA_DA_QUADRA = [
  {tam:0, itens:0},
  {tam:0, itens:2},
  {tam:0, itens:3},
  {tam:1, itens:3}
];
const ITEM_DA_FAMA = 'Leftovers';
/* quem ouviu falar da lousa diz (s: as seguidas, de duas em diante) */
const FALAS_DA_FAMA = {
  lider:[
    s => `Me falaram dos traços na lousa da entrada. ${cap1(porExtensoF(s))} seguidas. Vim apagar.`,
    s => `${cap1(porExtensoF(s))} defesas seguidas, é o que dizem na estrada. Trouxe o que eu tinha de melhor.`
  ],
  elite:[
    s => `Disseram lá embaixo que ninguém passa da sua porta: ${porExtenso(s)} desafios seguidos. Eu vim mudar a conta.`,
    s => `${cap1(porExtensoF(s))} defesas seguidas nessa porta. Eu treinei pensando nisso.`
  ]
};
const SECRETARIA_DO_PLANALTO = 'a secretária do Planalto';
const ORDINAL_DA_PORTA = ['primeira', 'segunda', 'terceira', 'quarta'];

/* quem sentava na porta e desce pro corredor quando ela vira sua */
/* uma narração e uma fala, sempre as duas: o posto (cargos.js) lê uma por linha */
const QUEM_DEIXA_A_PORTA = {
  giselle:['A Giselle anota a data no caderno antes de te entregar a chave.',
    fala('Giselle', 'Era pra ser a minha placa. Eu já tinha medido o furo.')],
  aj:['O A.J. tira a chave do chaveiro e põe na sua mão sem cerimônia nenhuma.',
    fala('A.J.', 'Eu segurei essa porta esperando o Bruno voltar pra me tirar dela. Veio você.')],
  mandi:['O Mandi fica um tempo parado na soleira antes de sair.',
    fala('Mandi', 'A Agatha ia me xingar por ter deixado. Eu ia gostar.')]
};

/* o que o desafiante diz na quadra (o do Ezra, pelo humor dele). No
   ginásio: c, a cidade; n, as insígnias dele; t, o tipo do ginásio */
const FALAS_DO_DESAFIANTE = {
  lider:[
    (c, n) => n === 0 ? `A insígnia de ${c} vai ser a minha primeira.` : `Vim pela insígnia de ${c}. Tenho ${insigniasDitas(n)}.`,
    () => 'Me disseram que o ginásio trocou de dono. Vim ver se trocou pra melhor.',
    (c, n, t) => t ? `Ouvi dizer que o ginásio agora é do tipo ${t}. Montei o time pensando nisso.`
      : 'Três semanas treinando pra este ginásio. Não me faz perder a viagem.',
    (c, n) => n === 7 ? 'Esta é a última insígnia que me falta pro Planalto. Não vou parar aqui.'
      : n === 6 ? 'Depois desta, só falta uma pro Planalto.'
      : n === 0 ? 'Nunca batalhei num ginásio. Pode vir com tudo.'
      : 'Três semanas treinando pra este ginásio. Não me faz perder a viagem.'
  ],
  elite:[
    () => 'Me disseram que tem gente nova numa dessas portas. Vim conferir.',
    () => 'Oito insígnias e um ano de estrada pra chegar nesta porta.',
    () => 'Eu não subi até o Planalto pra parar na sua porta.'
  ]
};
const FALAS_DO_EZRA = {
  lider:{amigo:'VOCÊ VIROU LÍDER E NÃO ME CONTOU?! Eu quero essa insígnia. Da sua mão.',
         frio:'Vim tirar a insígnia de você. É a única que eu quero.'},
  elite:{amigo:'Uma porta da Elite com o seu nome! Cara! Eu vou passar por ela, tá?',
         frio:'Uma porta com o seu nome. Eu vou passar por ela.'}
};
const SAIDA_DO_DESAFIANTE = {
  perdeu:['Volto com outro plano.', 'Tá. Ainda não é a minha vez.', 'Anotado. Até a próxima.'],
  ganhou:['Valeu a viagem.', 'Eu sabia que dava.', 'Foi apertado. Foi justo.'],
  /* a insígnia entregue sem ninguém batalhar */
  semLuta:['Assim? Tá. Eu levo.', 'Não era assim que eu queria ganhar essa.', 'Eu treinei pra isso. Queria ter batalhado.']
};
const SAIDA_DO_EZRA = {
  perdeu:'De novo?! Tá. TÁ. Eu volto.',
  ganhou:{lider:'EU GANHEI DE VOCÊ! No SEU ginásio!', elite:'Passei pela sua porta! Eu passei!'}
};

function cidadeDoGinasio(id){ return (GINASIOS.find(g => g.id === id) || {}).cidade || id; }

const Defesa = {
  /* ler não cria nada: o registro só nasce quando um posto entra no
     bolso (regGravar), senão todo save ganhava um, e a secretaria do
     Planalto aparecia pra quem nunca teve posto */
  reg(d){
    d = d || (typeof Estado !== 'undefined' && Estado.dados);
    return (d && d.defesa) || {};
  },
  regGravar(d){
    d = d || Estado.dados;
    return d.defesa || (d.defesa = {lider:null, elite:null});
  },

  /* o ginásio que é seu: o do posto, ou o que o final te deu */
  meuGinasio(d){
    d = d || (typeof Estado !== 'undefined' && Estado.dados);
    if (!d) return null;
    const r = this.reg(d);
    if (r.lider && r.lider.ginasio) return r.lider.ginasio;
    const x = d.depoisDoFim;
    return x && x.ginasio && !r.perdeuDoFim ? x.ginasio : null;
  },
  minhaPorta(d){
    d = d || (typeof Estado !== 'undefined' && Estado.dados);
    if (!d) return null;
    const r = this.reg(d);
    return r.elite && r.elite.porta != null ? r.elite.porta : null;
  },
  posto(d){ return !!this.meuGinasio(d) || this.minhaPorta(d) != null; },
  /* o ginásio de quem saiu: o telefone dele não fala mais de desafiante */
  deixouDeSer(ginasio, d){ return !!ginasio && this.meuGinasio(d) === ginasio; },

  /* o estado de um posto, com o ginásio do final aberto na primeira
     olhada. Save de antes da defesa com o posto no bolso também ganha a
     vaga aqui, na primeira olhada: sem isso o posto pagava e ninguém
     nunca desafiava */
  estado(tipo, d){
    d = d || Estado.dados;
    const r = this.reg(d);
    if (tipo === 'lider' && !r.lider){
      const x = d.depoisDoFim;
      if (x && x.ginasio && !r.perdeuDoFim) this.regGravar(d).lider = this.novo(d, {ginasio:x.ginasio, doFim:true});
      else if (d === Estado.dados && Cargos.tem('lider')) this.vagaDeAntes('lider', d);
    }
    if (tipo === 'elite' && !r.elite && d === Estado.dados && Cargos.tem('elite')) this.vagaDeAntes('elite', d);
    return this.reg(d)[tipo] || null;
  },
  /* a vaga de quem assumiu o posto antes da defesa existir: o mesmo
     sorteio do aoAssumir, sem aviso (o posto não é novo), com a linha no
     diário. O ginásio aparece na Ficha e no cartão do posto, e a
     secretaria diz qual é no primeiro desafio */
  vagaDeAntes(tipo, d){
    const r = this.regGravar(d);
    if (tipo === 'lider'){
      const g = this.sortearGinasio(d);
      if (!g) return;
      r.lider = this.novo(d, {ginasio:g});
      if (typeof Mundo !== 'undefined' && Mundo.descobrir) Mundo.descobrir('ginasio_' + g);
      Estado.registrar(`A Liga acertou a vaga do seu posto: o ginásio de ${cidadeDoGinasio(g)}.`);
    } else {
      const p = this.sortearPorta(d);
      if (p == null) return;
      r.elite = this.novo(d, {porta:p});
      const t = this.titularDaPorta(p);
      Estado.registrar(`A Liga acertou a vaga do seu posto: a ${ORDINAL_DA_PORTA[p]} porta da ala, a ${t.f ? 'da' : 'do'} ${t.nome}.`);
    }
  },
  novo(d, o){
    return Object.assign({desde:d.relogio.dia, proximo:d.relogio.dia + this.espera(), desafio:null,
      adv:0, ganhas:0, perdidas:0, faltas:0, recentes:[]}, o);
  },
  espera(){ return Dados.entre(ESPERA_ENTRE_DESAFIOS[0], ESPERA_ENTRE_DESAFIOS[1]); },

  /* ---------- a vaga ---------- */
  sortearGinasio(d){
    const r = this.reg(d), x = d.depoisDoFim;
    if (x && x.ginasio && !r.perdeuDoFim) return x.ginasio;
    /* a cidade que um final fechou pra você (depois.js) não entra:
       ginásio aonde você não chega é posto perdido na terceira falta */
    const aberta = g => !(x && x.fecha && x.fecha[g]);
    const fora = r.perdidos || [];
    /* o Blue foi embora no 23 (aceitando ou não ficar com o ginásio
       dele): a vaga que todo mundo sabe que existe é Viridian */
    if ((d.flags.recusou_o_ginasio || d.flags.blue_ofereceu_o_ginasio) && !fora.includes('viridian') && aberta('viridian')) return 'viridian';
    const todos = GINASIOS.map(g => g.id).filter(aberta);
    const ids = todos.filter(g => !fora.includes(g));
    return Dados.escolher(ids.length ? ids : todos.length ? todos : GINASIOS.map(g => g.id));
  },
  /* as três do meio cujo dono não voltou (a do Lance nunca ficou vaga) */
  portasVagas(d){
    return Titulares.todos().filter(t => !Titulares.voltou(t.id, d)).map(t => t.porta);
  },
  sortearPorta(d){
    const vagas = this.portasVagas(d), fora = this.reg(d).portasPerdidas || [];
    const boas = vagas.filter(p => !fora.includes(p));
    return boas.length ? Dados.escolher(boas) : vagas.length ? Dados.escolher(vagas) : null;
  },
  /* quem sentava na porta antes de você (o substituto) */
  substitutoDaPorta(p){ return p == null ? null : ELITE4[p] || null; },
  titularDaPorta(p){ return Titulares.todos().find(t => t.porta === p) || null; },

  /* o posto entrou no bolso (Cargos.assumir, e a oferta do 26): a vaga */
  aoAssumir(id){
    const d = Estado.dados, av = [];
    if (id !== 'lider' && id !== 'elite') return av;
    const r = this.regGravar(d);
    /* o registro direto, nunca o estado(): o posto já está na lista
       quando o Cargos.assumir chama aqui, e o estado() sortearia a vaga
       calado, como a de um save de antes */
    const x = d.depoisDoFim;
    if (id === 'lider' && !r.lider && x && x.ginasio && !r.perdeuDoFim) r.lider = this.novo(d, {ginasio:x.ginasio, doFim:true});
    if (id === 'lider' && !r.lider){
      const g = this.sortearGinasio(d);
      if (!g) return av;
      r.lider = this.novo(d, {ginasio:g});
      if (typeof Mundo !== 'undefined' && Mundo.descobrir) Mundo.descobrir('ginasio_' + g);
      av.push({tipo:'insignia', texto:`O ginásio de ${cidadeDoGinasio(g)} é seu.`});
      Estado.registrar(`Ficou com o ginásio de ${cidadeDoGinasio(g)}, que estava vago.`);
    }
    if (id === 'elite' && !r.elite){
      const p = this.sortearPorta(d);
      if (p == null) return av;
      r.elite = this.novo(d, {porta:p});
      const t = this.titularDaPorta(p);
      av.push({tipo:'liga', texto:`A ${ORDINAL_DA_PORTA[p]} porta da ala é sua: a ${t.f ? 'da' : 'do'} ${t.nome}.`});
      Estado.registrar(`Ficou com a ${ORDINAL_DA_PORTA[p]} porta da Elite, a ${t.f ? 'da' : 'do'} ${t.nome}.`);
    }
    if (av.length && Estado.temPokenav && Estado.temPokenav() && Estado.registrarNumero('secretaria'))
      av.push({tipo:'info', texto:'O número da secretaria do Planalto está no PokéNav.'});
    return av;
  },
  /* largou o posto: a vaga vai pra outra pessoa, e não volta no sorteio */
  aoLargar(id){
    const d = Estado.dados, r = this.reg(d);
    if (id === 'lider' && r.lider && !r.lider.doFim){ (r.perdidos = r.perdidos || []).push(r.lider.ginasio); r.lider = null; }
    if (id === 'elite' && r.elite){ (r.portasPerdidas = r.portasPerdidas || []).push(r.elite.porta); r.elite = null; }
  },

  /* o que a secretária diz na hora de entregar a chave (cargos.js) */
  falaDaVaga(d){
    const g = this.meuGinasio(d);
    if (!g) return 'Ginásio não é prêmio por ser forte. É um posto de trabalho com horário fixo e uma criança chorando na sua sala toda quinta.';
    if (g === 'viridian' && (d.flags.recusou_o_ginasio || d.flags.blue_ofereceu_o_ginasio))
      return 'A vaga é em Viridian. O titular de lá foi embora e deixou a chave na portaria, com o formulário pela metade.';
    return `A vaga é em ${cidadeDoGinasio(g)}. Quem estava lá pediu afastamento, e com o ginásio fechado os desafiantes iam todos pra cidade do lado.`;
  },
  /* quem sai da porta (cargos.js): o substituto, com a fala dele */
  falasDaPorta(d){
    const p = this.minhaPorta(d), s = this.substitutoDaPorta(p);
    return s ? (QUEM_DEIXA_A_PORTA[s.id] || []) : [];
  },
  quemSaiuDaPorta(d){
    const s = this.substitutoDaPorta(this.minhaPorta(d));
    return s ? s.nome : 'quem estava na porta antes de você';
  },

  /* ---------- o tipo do ginásio ---------- */
  /* o tipo de cada um dos outros sete: o de quem saiu do seu fica livre,
     e o variado do Blue não prende tipo nenhum */
  tiposDosOutros(g){
    return GINASIOS.filter(x => x.id !== g).map(x => x.tipo).filter(t => TIPOS.includes(t));
  },
  /* Sombrio e Metálico só existem de verdade com a Pokédex Nacional (types.js) */
  tiposLivres(d){
    d = d || Estado.dados;
    const nacional = typeof dexNacional === 'function' && dexNacional();
    const presos = this.tiposDosOutros(this.meuGinasio(d));
    return TIPOS_KANTO.concat(nacional ? TIPOS_JOHTO : []).filter(t => !presos.includes(t));
  },
  tipoDoGinasio(d){ const r = this.reg(d).lider; return (r && r.tipo) || null; },
  /* o ginásio é seu e a ficha ainda está em branco: a tela do mapa abre ela */
  precisaTipo(d){
    d = d || (typeof Estado !== 'undefined' && Estado.dados);
    const r = d && this.reg(d).lider;
    return !!(r && r.ginasio && !r.tipo);
  },
  /* o ginásio fechado pra reforma: o dia em que ele reabre, ou nada */
  fechadaAte(d){
    d = d || Estado.dados;
    const r = this.reg(d).lider;
    return r && r.tipo && r.abre && d.relogio.dia < r.abre ? r.abre : null;
  },
  daquiA(dia){
    const n = dia - Estado.dados.relogio.dia;
    return n <= 1 ? this.diaDito(dia) : `daqui a ${porExtenso(n)} dias`;
  },
  /* todo Pokémon seu que pode batalhar: o do cinto e o do PC, vivo */
  meusPokemon(d){
    d = d || Estado.dados;
    return (d.time || []).concat(d.pc || []).filter(p => p && !p.morto);
  },
  /* a ficha do ginásio: a tela do mapa abre, e só sai escolhendo.
     Com `escolha`, a confirmação: o tipo do ginásio não se troca no meio */
  telaTipo(escolha, avisos){
    const d = Estado.dados, r = this.estado('lider', d);
    if (!r || r.tipo) return Exploracao.tela(avisos);
    const g = r.ginasio, G = ginasioPorId(g) || {}, cidade = cidadeDoGinasio(g);
    const livres = this.tiposLivres(d);
    if (escolha && !livres.includes(escolha)) escolha = null;
    const meus = this.meusPokemon(d);
    const conta = t => meus.filter(p => (p.tipos || []).includes(t)).length;
    const cor = t => ` style="--ac:${COR_TIPO[t] || '#888'}"`;
    const falas = escolha
      ? [`**TIPO DO GINÁSIO: ${escolha.toUpperCase()}**`,
         'Falta a sua assinatura embaixo. Assinada, a ficha vale enquanto o ginásio for seu.']
      : [`Junto com a chave do Ginásio de ${cidade} veio uma ficha da Liga, com um campo só, em branco.`,
         '**TIPO DO GINÁSIO: ________**',
         'Do lado, a lista dos outros sete ginásios, cada um com o tipo dele. Embaixo, em letra pequena: o ginásio reabre duas semanas depois da ficha assinada.'];
    const botoes = escolha
      ? `<button class="escolha com-tipo"${cor(escolha)} onclick="Defesa.escolherTipo('${escolha}')">${UI.tipoTag(escolha)}<span class="esc-rot">Assinar a ficha</span></button>
         <button class="escolha discreta" onclick="Defesa.telaTipo()">Escolher outro tipo</button>`
      : livres.map(t => {
          const n = conta(t);
          const det = [n ? `Você tem ${n}` : 'Você não tem nenhum', t === G.tipo ? 'o tipo do ginásio até agora' : ''].filter(Boolean).join(' · ');
          return `<button class="escolha com-tipo"${cor(t)} aria-label="${UI.esc(t)}" onclick="Defesa.telaTipo('${t}')">${UI.tipoTag(t)}<span class="esc-rot">${UI.esc(det)}</span></button>`;
        }).join('');
    UI.limpar();
    UI.add(UI.topo());
    UI.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">Seu ginásio</div>
        <div class="tit">Ginásio de ${UI.esc(cidade)}</div>
        <div class="loc">a ficha do ginásio</div>
      </div>
      <div class="narrativa">${UI.narrar(falas, null)}</div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas ficha-tipo" style="margin-top:18px">${botoes}</div>
    </div>`);
    if (avisos && avisos.length) UI.avisos(avisos);
    UI.rolarTopo();
  },
  escolherTipo(t){
    const d = Estado.dados, r = this.estado('lider', d);
    if (!r || r.tipo || !this.tiposLivres(d).includes(t)) return Exploracao.tela();
    r.tipo = t;
    r.abre = d.relogio.dia + REABRE_EM_DIAS;
    r.proximo = Math.max(r.proximo || 0, r.abre);
    /* ginásio novo: o desafio marcado antes cai, e a lousa começa limpa */
    r.desafio = null; r.seguidas = 0;
    const cidade = cidadeDoGinasio(r.ginasio);
    Estado.registrar(`Assinou a ficha do Ginásio de ${cidade}: agora ele é do tipo ${t}.`);
    Estado.salvar('auto');
    return Exploracao.tela([{tipo:'insignia', texto:`O Ginásio de ${cidade} agora é do tipo ${t} e reabre daqui a duas semanas.`}]);
  },

  /* ---------- a regra da quadra ----------
     o tamanho e o nível que o líder de antes usaria contra quem tem n
     insígnias (ginasios.js: ESCALOES_NIVEL, a dificuldade e os escalões
     dele, sem o piso e o teto da sua jornada, que não são de quem
     desafia). O seu time desce até esse tamanho, ninguém acima do ás */
  escaloes(g){
    const G = ginasioPorId(g) || {};
    const l = (G.escaloes || []).map(e => ({min:e.min, tam:e.especies.length}));
    if ([0, 2, 4, 6].every(m => l.some(e => e.min === m))) return l;
    /* Viridian: o Blue só abria pra quem tinha sete, com seis; abaixo
       disso, o tamanho dos outros */
    const topo = l.reduce((m, e) => Math.max(m, e.tam), 5);
    return [{min:0, tam:2}, {min:2, tam:3}, {min:4, tam:4}, {min:6, tam:Math.min(6, topo)}];
  },
  regra(g, n){
    const G = ginasioPorId(g) || {};
    const esc = this.escaloes(g);
    let e = esc[0]; esc.forEach(x => { if (n >= x.min) e = x; });
    let f = ESCALOES_NIVEL[0]; ESCALOES_NIVEL.forEach(x => { if (n >= x.min) f = x; });
    const base = f.base + (G.dificuldade || 0) + (n - f.min) * 3;
    return {n, tam:e.tam, base, nivel:base + e.tam + 1};
  },
  /* quem pode batalhar contra n insígnias: o tipo do ginásio, até o nível do
     ás, do mais forte pro mais fraco */
  aptos(n, d){
    d = d || Estado.dados;
    const r = this.reg(d).lider;
    if (!r || !r.tipo) return [];
    const R = this.regra(r.ginasio, n);
    return this.meusPokemon(d).filter(p => (p.tipos || []).includes(r.tipo) && p.nivel <= R.nivel)
      .sort((a, b) => b.nivel - a.nivel);
  },
  /* o time que a quadra sugere: os mais fortes que servem, o mais forte
     por último, como o ás dos líderes */
  preSelecao(n, d){
    const r = this.reg(d).lider;
    if (!r || !r.tipo) return [];
    return this.aptos(n, d).slice(0, this.regra(r.ginasio, n).tam).reverse().map(p => p.uid);
  },
  /* o quadro da quadra: contra quantas insígnias, quantos descem, até que
     nível, e quantos seus servem. É a porta fechada que diz o que falta */
  quadro(d){
    d = d || Estado.dados;
    const r = this.reg(d).lider;
    if (!r || !r.tipo) return '';
    const linhas = [];
    for (let n = 0; n <= 7; n++){
      const R = this.regra(r.ginasio, n), tem = Math.min(R.tam, this.aptos(n, d).length);
      const falta = R.tam - tem;
      linhas.push(`<tr class="${tem ? (falta ? 'parcial' : 'cheio') : 'vazio'}"><td>${n === 0 ? 'Nenhuma' : n}</td>
        <td>${R.tam} · até o nível ${R.nivel}</td>
        <td>${tem}${falta ? ` <small>falta${falta > 1 ? 'm' : ''} ${falta}</small>` : ''}</td></tr>`);
    }
    return `<div class="quadro-quadra" style="--ac:${COR_TIPO[r.tipo] || '#888'}">
      <div class="qq-tit">${UI.tipoTag(r.tipo)}<span>Regulamento do ginásio</span></div>
      <table><thead><tr><th>Insígnias</th><th>Pokémon permitidos</th><th>Você tem</th></tr></thead>
      <tbody>${linhas.join('')}</tbody></table>
    </div>`;
  },

  /* ---------- o desafio ---------- */
  /* na tela do mapa: marca o próximo, e o prazo que passou é falta */
  conferir(){
    const d = Estado.dados;
    if (!d || !d.relogio) return;
    for (const tipo of ['lider', 'elite']){
      const r = this.estado(tipo, d);
      if (!r) continue;
      /* o posto saiu por outra porta (largou no balcão, a rede…) */
      if (tipo === 'lider' && !r.doFim && !Cargos.tem('lider')){ this.aoLargar('lider'); continue; }
      if (tipo === 'elite' && !Cargos.tem('elite')){ this.aoLargar('elite'); continue; }
      if (tipo === 'lider'){
        /* o time da quadra de uma luta que não chegou ao fim volta pro lugar */
        if (r.emprestimo && !(typeof Jogo !== 'undefined' && Jogo.defesaAtual) && !(typeof Batalha !== 'undefined' && Batalha.ativo)) this.devolver(d);
        /* o ginásio sem tipo não recebe desafio: a ficha abre na tela do mapa */
        if (!r.tipo) continue;
      }
      /* a mensagem espera o toque da vez, e ninguém manda de madrugada */
      if (typeof Jogo !== 'undefined' && Jogo.chamadaAdiada) continue;
      if (d.relogio.periodo === 'madrugada') continue;
      const dia = d.relogio.dia;
      if (r.desafio){
        /* a história andou no meio do prazo: quem esperava remarca */
        const cap = capNaJornada(d);
        if (r.desafio.cap !== cap){ r.desafio.cap = cap; r.desafio.ate = Math.max(r.desafio.ate, dia + PRAZO_DA_DEFESA); continue; }
        if (dia > r.desafio.ate) this.falta(tipo);
        continue;
      }
      if (dia >= r.proximo){
        /* com o ginásio e a porta, um desafio de cada vez: o segundo
           espera o primeiro acabar, senão os dois prazos caíam juntos, um
           em Vermilion e outro no Planalto, e um deles virava falta */
        const outro = this.reg(d)[tipo === 'lider' ? 'elite' : 'lider'];
        if (outro && outro.desafio){ r.proximo = outro.desafio.ate + 1; continue; }
        this.marcar(tipo);
      }
    }
  },

  /* no ginásio: gente da estrada que tem time pro escalão */
  sortearDaEstrada(r, n){
    const quer = this.tamDaQuadra(r, n, this.fama('lider'));
    const lista = (typeof TREINADORES_ESTRADA !== 'undefined' ? TREINADORES_ESTRADA : [])
      .filter(t => !t.barreira && this.linhasDe(t, n).length >= quer);
    const novos = lista.filter(t => !(r.recentes || []).includes(t.id));
    const l = novos.length ? novos : lista;
    return l.length ? Dados.escolher(l) : null;
  },
  /* as linhas de quem vem da estrada pra um escalão: as dele, a reserva e,
     se faltar, o que ele tinha antes e depois, do mais fraco pro mais
     forte (o último é o ás) */
  linhasDe(t, n){
    const k = escalaoEstradaDe(n), tm = t.times || [];
    const fontes = [tm[k] || tm[tm.length - 1] || [], t.reserva || []];
    for (let j = k - 1; j >= 0; j--) fontes.push(tm[j] || []);
    for (let j = k + 1; j < tm.length; j++) fontes.push(tm[j] || []);
    const vistos = new Set(), out = [];
    fontes.forEach(l => l.slice().reverse().forEach(dex => {
      const f = finalDaLinha(dex);
      if (!vistos.has(f)){ vistos.add(f); out.push(dex); }
    }));
    return out.reverse();
  },
  /* quantos ele traz: o tamanho da regra, mais o da fama */
  tamDaQuadra(r, n, fama){
    return Math.min(6, this.regra(r.ginasio, n).tam + (this.forca('lider', fama).extra || 0));
  },
  sortearDesafiante(r){
    const d = Estado.dados;
    const pode = x => { try { return (!x.cond || x.cond(d)) && !!(x.linhas || x.veterano || (x.id === 'ezra' && d.rival)); } catch(e){ return false; } };
    const unicos = l => { const ja = new Set(); return l.filter(x => !ja.has(x.id) && ja.add(x.id)); };
    const todos = unicos(RIVAIS_TORNEIO.filter(pode));
    const novos = todos.filter(x => !(r.recentes || []).includes(x.id));
    const lista = novos.length ? novos : todos;
    return lista.length ? Dados.escolher(lista) : null;
  },
  falaDoDesafiante(tipo, ins, n){
    const d = Estado.dados;
    if (ins.id === 'ezra'){
      const amigo = !d.npcs['Ezra'] || d.npcs['Ezra'].opiniao >= 0;
      return FALAS_DO_EZRA[tipo][amigo ? 'amigo' : 'frio'];
    }
    const s = ((this.reg(d)[tipo]) || {}).seguidas || 0;
    if (s >= 2 && Dados.chance(60)) return Dados.escolher(FALAS_DA_FAMA[tipo])(s);
    return Dados.escolher(FALAS_DO_DESAFIANTE[tipo])(cidadeDoGinasio(this.meuGinasio(d)), n || 0, this.tipoDoGinasio(d));
  },

  marcar(tipo){
    const d = Estado.dados, r = this.estado(tipo, d);
    if (!r) return;
    if (tipo === 'lider') return this.marcarNaQuadra(r);
    const ins = this.sortearDesafiante(r);
    if (!ins){ r.proximo = d.relogio.dia + this.espera(); return; }
    r.desafio = {quem:ins.id, nome:ins.nome, curto:ins.curto || ins.nome, f:!!ins.f, de:ins.de || '',
      fala:this.falaDoDesafiante(tipo, ins), fama:this.fama(tipo, d),
      dia:d.relogio.dia, ate:d.relogio.dia + PRAZO_DA_DEFESA, cap:capNaJornada(d)};
    r.recentes = [ins.id].concat(r.recentes || []).slice(0, 3);
    Estado.registrar(`${ins.nome} marcou desafio ${tipo === 'lider' ? 'no seu ginásio' : 'na sua porta da ala'}.`);
    Estado.salvar('auto');
    this.avisar(tipo, 'marcado');
  },

  /* o desafio do ginásio: gente da estrada, com zero a sete insígnias */
  marcarNaQuadra(r){
    const d = Estado.dados, n = Dados.entre(0, 7);
    const t = this.sortearDaEstrada(r, n);
    if (!t){ r.proximo = d.relogio.dia + this.espera(); return; }
    r.desafio = {quem:t.id, estrada:true, nome:nomeDeLuta(t), curto:t.nome, f:t.artigo === 'uma', de:'', ins:n,
      fala:this.falaDoDesafiante('lider', t, n), fama:this.fama('lider', d),
      dia:d.relogio.dia, ate:d.relogio.dia + PRAZO_DA_DEFESA, cap:capNaJornada(d)};
    r.recentes = [t.id].concat(r.recentes || []).slice(0, 3);
    Estado.registrar(`${nomeDeLuta(t)} marcou desafio no seu ginásio, ${this.comInsignias(n)}.`);
    Estado.salvar('auto');
    this.avisar('lider', 'marcado');
  },
  comInsignias(n){ return n ? `com ${insigniasDitas(n)}` : 'sem insígnia nenhuma'; },

  /* não apareceu até o prazo: a insígnia vai (a porta passa) sem luta */
  falta(tipo){
    const d = Estado.dados, r = this.estado(tipo, d), x = r && r.desafio;
    if (!x) return;
    r.desafio = null; r.faltas++; r.adv++; r.seguidas = 0;
    r.proximo = d.relogio.dia + this.espera();
    Estado.registrar(`${x.nome} esperou ${tipo === 'lider' ? 'no seu ginásio' : 'na sua porta da ala'}, e você não apareceu.`);
    const extra = {nome:x.nome};
    if (r.adv >= ADVERTENCIAS_PRA_PERDER) extra.perdeu = this.perderPosto(tipo);
    Estado.salvar('auto');
    this.avisar(tipo, 'falta', extra);
  },

  /* a Liga tira o posto: o ginásio vai pra outra pessoa, a porta volta
     pra quem sentava nela antes */
  perderPosto(tipo){
    const d = Estado.dados, reg = this.reg(d), r = reg[tipo];
    if (!r) return null;
    const onde = tipo === 'lider' ? cidadeDoGinasio(r.ginasio) : `${ORDINAL_DA_PORTA[r.porta]} porta`;
    if (tipo === 'lider'){
      (reg.perdidos = reg.perdidos || []).push(r.ginasio);
      if (r.doFim){
        reg.perdeuDoFim = true;
        if (d.depoisDoFim){ d.depoisDoFim.ginasio = null; d.depoisDoFim.cargo = `Ex-titular do ginásio de ${onde}`; }
      }
      reg.lider = null;
      if (Cargos.tem('lider')) Cargos.largar('lider');
      Estado.registrar(`A Liga tirou de você o ginásio de ${onde}.`);
    } else {
      (reg.portasPerdidas = reg.portasPerdidas || []).push(r.porta);
      reg.elite = null;
      if (Cargos.tem('elite')) Cargos.largar('elite');
      Estado.registrar(`A Liga tirou de você a ${onde} da ala.`);
    }
    return onde;
  },

  /* ---------- o PokéNav ---------- */
  avisar(tipo, qual, extra){
    if (!Estado.temPokenav() || typeof Jogo === 'undefined' || !Jogo.tocarOuGuardar) return;
    Estado.registrarNumero('secretaria');
    const r = this.reg()[tipo] || {}, x = r.desafio || {};
    const aviso = Object.assign({tipo, qual, nome:x.nome || null, f:!!x.f, ate:x.ate || null, ins:x.ins,
      ginasio:this.meuGinasio(), porta:this.minhaPorta()}, extra || {});
    setTimeout(() => Jogo.tocarOuGuardar({recados:'defesa', de:'secretaria', aviso}), 80);
  },
  mostrarAviso(c, toque){
    const a = toque && toque.aviso;
    if (!c || !a) return false;
    UI.telaMensagem(c, this.falasDoAviso(a));
    return true;
  },
  diaDito(dia){
    const hoje = Estado.dados.relogio.dia;
    if (dia === hoje) return 'hoje';
    if (dia === hoje + 1) return 'amanhã';
    return Calendario.de(dia).semana;
  },
  falasDoAviso(a){
    const S = SECRETARIA_DO_PLANALTO;
    const onde = a.tipo === 'lider' ? cidadeDoGinasio(a.ginasio) : `${ORDINAL_DA_PORTA[a.porta] || 'sua'} porta`;
    if (a.qual === 'marcado') return a.tipo === 'lider'
      ? [fala(S, `${a.nome} marcou desafio no ginásio de ${onde}${a.ins != null ? ', ' + this.comInsignias(a.ins) : ''}.`), fala(S, `${a.f ? 'Ela' : 'Ele'} espera até ${this.diaDito(a.ate)}.`)]
      : [fala(S, `${a.nome} marcou desafio na Elite e pediu a sua porta.`), fala(S, `${a.f ? 'Ela' : 'Ele'} espera no corredor até ${this.diaDito(a.ate)}.`)];
    if (a.qual === 'falta'){
      const l = a.tipo === 'lider'
        ? [fala(S, `${a.nome} esperou o prazo inteiro no ginásio e foi embora com a insígnia.`), fala(S, 'A Liga anotou a falta.')]
        : [fala(S, `${a.nome} passou pela sua porta sem ninguém do outro lado.`), fala(S, 'A Liga anotou a falta.')];
      if (a.perdeu) l.push(a.tipo === 'lider'
        ? fala(S, `E a Liga decidiu hoje cedo: o ginásio de ${a.perdeu} vai pra outra pessoa. Pode deixar a chave na portaria.`)
        : fala(S, `E a Liga decidiu hoje cedo: a ${a.perdeu} volta pra quem sentava nela antes. O seu nome sai da placa amanhã.`));
      return l;
    }
    return [];
  },

  /* ---------- o lugar ---------- */
  /* a porta do ginásio, na cidade dele (mundo.js) */
  afazerDoGinasio(id){
    const r = this.estado('lider');
    const x = r && r.desafio, ab = r && r.tipo ? this.fechadaAte() : null;
    return {lugar:true, id:'ginasio', titulo:'Seu ginásio',
      sub:r && !r.tipo ? 'Falta escolher o tipo do ginásio.'
        : ab ? `Fechado pra reforma. Reabre ${this.daquiA(ab)}.`
        : x ? `${x.curto} marcou desafio. Prazo até ${this.diaDito(x.ate)}.` : 'Ninguém marcou desafio.'};
  },
  /* a sua porta, no Planalto */
  afazeres(local){
    if (local !== 'planalto' || this.minhaPorta() == null) return [];
    const r = this.estado('elite'), x = r && r.desafio;
    return [{lugar:true, id:'defesa_elite', titulo:'Sua porta na ala',
      sub:x ? `${x.curto} pediu a sua porta. Prazo até ${this.diaDito(x.ate)}.` : 'Ninguém pediu a sua porta.'}];
  },
  /* a linha do cartão do posto no balcão de credenciais */
  notaDoCartao(id){
    if (id === 'lider'){ const g = this.meuGinasio(), t = this.tipoDoGinasio(); return g ? `Ginásio de ${cidadeDoGinasio(g)}${t ? ' · tipo ' + t : ''}` : null; }
    if (id === 'elite'){ const p = this.minhaPorta(); return p != null ? `${cap1(ORDINAL_DA_PORTA[p])} porta da ala` : null; }
    return null;
  },
  /* quem tem desafio marcado, e onde (o robô vai atrás): o que vence
     antes primeiro */
  pendente(){
    const l = ['lider', 'elite'].map(tipo => ({tipo, r:this.estado(tipo)})).filter(x => x.r && x.r.desafio)
      .sort((a, b) => a.r.desafio.ate - b.r.desafio.ate);
    return l.length ? {tipo:l[0].tipo, lugar:l[0].tipo === 'lider' ? l[0].r.ginasio : 'planalto', ate:l[0].r.desafio.ate} : null;
  },

  tela(tipo, avisos){
    const d = Estado.dados, r = this.estado(tipo, d);
    if (!r) return Exploracao.tela();
    const x = r.desafio, falas = [];
    const advs = `${porExtensoF(r.adv)} advertência${r.adv > 1 ? 's' : ''}`;
    const adv = !r.adv ? null : tipo === 'lider' ? `Em cima da mesa, a carta da Liga: ${advs} no seu nome.`
      : `No quadro da secretaria, do lado do seu nome: ${advs}.`;
    /* a sequência é coisa que a quadra mostra, não regra: o que ela faz
       com quem marca desafio está na folha */
    const rec = (r.recorde || 0) > (r.seguidas || 0) ? ` Embaixo, num canto, o recorde: ${porExtensoF(r.recorde)}.` : '';
    const tracos = n => n === 1 ? 'um traço' : `${porExtenso(n)} traços`;
    const seq = r.seguidas ? (tipo === 'lider'
      ? `Na lousa da entrada, a giz, ${tracos(r.seguidas)}: as suas defesas seguidas.`
      : `Do lado da placa, a giz, ${tracos(r.seguidas)}: as defesas seguidas da sua porta.`) + rec
      : rec ? (tipo === 'lider' ? 'A lousa da entrada foi apagada.' : 'Do lado da placa, os traços de giz foram apagados.') + rec : null;
    if (tipo === 'lider'){
      /* a ficha em branco vem antes de tudo */
      if (!r.tipo) return this.telaTipo(null, avisos);
      const cidade = cidadeDoGinasio(r.ginasio), ab = this.fechadaAte(d);
      falas.push(r.doFim ? 'A chave pequena do segundo andar continua no seu chaveiro.'
        : 'O quadro da entrada tem o seu nome escrito por cima do nome de quem saiu.');
      falas.push('Na parede, o regulamento da Liga, com o tipo do ginásio no alto.');
      if (ab) falas.push(`Na porta, o aviso da Liga: fechado pra reforma, reabre ${this.daquiA(ab)}.`);
      else if (x){
        falas.push(`${x.nome}${x.de ? ', ' + x.de + ',' : ''} espera na arquibancada, ${x.ins != null ? this.comInsignias(x.ins) + ' no estojo' : 'com o cinto cheio'}.`);
        falas.push(fala(x.nome, x.fala));
      } else falas.push('A quadra está limpa e as luzes estão acesas. Ninguém marcou desafio.');
      if (seq) falas.push(seq);
      if (adv) falas.push(adv);
      return UI.telaConversa({num:'Seu ginásio', titulo:`Ginásio de ${cidade}`, loc:`ginásio do tipo ${r.tipo}`, falas, avisos,
        extra:this.quadro(d),
        botoes:(x && !ab ? [{texto:`Montar o time — ${x.curto}`, acao:x.estrada ? 'Defesa.montar()' : "Defesa.lutar('lider')", classe:'luta', icone:'lutar'}] : [])
          .concat([{texto:'Sair do ginásio', acao:'Exploracao.tela()'}])});
    }
    const p = r.porta;
    falas.push('A placa de bronze da porta tem o seu nome, na mesma fonte das outras três.');
    if (x){
      falas.push(`${x.nome}${x.de ? ', ' + x.de + ',' : ''} pediu a sua porta e espera no corredor.`);
      falas.push(fala(x.nome, x.fala));
    } else falas.push('O corredor está vazio. Ninguém pediu a sua porta.');
    if (seq) falas.push(seq);
    if (adv) falas.push(adv);
    return UI.telaConversa({num:'Elite dos Quatro', titulo:'A sua porta', loc:`${cap1(ORDINAL_DA_PORTA[p])} porta`, falas, avisos,
      botoes:(x ? [{texto:`Defender a porta — ${x.curto}`, acao:"Defesa.lutar('elite')", classe:'luta', icone:'lutar'}] : [])
        .concat([{texto:'Ir pro corredor da Elite', acao:'Jogo.abrirLiga()'}, {texto:'Sair', acao:'Exploracao.tela()'}])});
  },

  /* ---------- a luta ---------- */
  /* o degrau de fama do posto: as defesas ganhas seguidas, até o teto */
  fama(tipo, d){ const r = this.estado(tipo, d); return Math.min(this.famaTeto(), (r && r.seguidas) || 0); },
  famaTeto(){ return FAMA_DA_QUADRA.length - 1; },
  /* a defesa no degrau: o nível, o tamanho, o erro e quantos seguram
     Leftovers do lado de quem desafia */
  forca(tipo, fama){
    const D = DEFESAS[tipo], F = FAMA_DA_QUADRA[Math.max(0, Math.min(this.famaTeto(), fama || 0))];
    return {nivel:D.nivel, tam:Math.min(6, D.tam + F.tam), extra:F.tam, erroIA:D.erroIA, itens:F.itens, bonus:D.bonus};
  },
  /* o time de quem desafia: o do inscrito do torneio, no tamanho e no
     nível da defesa e da fama; o Ezra vem com o time de rival dele, que
     já é de seis, e a fama só põe o item */
  desafiante(ins, tipo, fama){
    const D = this.forca(tipo, fama == null ? this.fama(tipo) : fama), d = Estado.dados;
    let out;
    if (ins.id === 'ezra' && d.rival) out = {id:'ezra', nome:'Ezra', curto:'Ezra', f:false, time:timeRival()};
    else {
      let linhas = ins.linhas, golpes = ins.golpes;
      if (ins.veterano && typeof veterano === 'function'){ const v = veterano(ins.veterano); linhas = v.times; golpes = v.golpes; }
      if (!linhas) return null;
      const nivel = Math.max(5, Math.min(85, nivelDeReferencia() + D.nivel) + (ins.ajuste || 0));
      const time = timeDeLinhas(linhas, nivel, D.tam, golpes, MORAL_TORNEIO);
      if (ins.segura && time.length) time[time.length - 1].segurando = ins.segura;
      out = {id:ins.id, nome:ins.nome, curto:ins.curto || ins.nome, f:!!ins.f, time};
    }
    /* quadra famosa: quem desafia vem mais preparado, os mais fortes
       (fora o ás) segurando Leftovers */
    out.time.slice(0, -1).filter(p => !p.segurando).sort((a, b) => b.nivel - a.nivel).slice(0, D.itens || 0)
      .forEach(p => { p.segurando = ITEM_DA_FAMA; });
    return out;
  },

  /* quem vem da estrada traz o time do escalão dele, no tamanho da regra
     (mais o da fama) e no nível que o líder de antes usaria: do base pra
     cima, um por um, e o ás dois acima, como em ginasios.js */
  desafianteDaQuadra(x, fama){
    const t = typeof treinadorEstrada === 'function' ? treinadorEstrada(x.quem) : null;
    const r = this.reg().lider;
    if (!t || !r) return null;
    const n = x.ins || 0, R = this.regra(r.ginasio, n), F = this.forca('lider', fama);
    const linhas = this.linhasDe(t, n).slice(-this.tamDaQuadra(r, n, fama));
    const time = [], usados = new Set();
    linhas.forEach((dex, i) => {
      const ultimo = i === linhas.length - 1;
      const nv = Math.max(3, R.base + i + (ultimo ? 2 : 0));
      const forma = formaDaEstrada(finalDaLinha(dex), nv);
      if (usados.has(forma) && !ultimo) return;
      usados.add(forma);
      time.push(criarPokemon(forma, nv, {moral:t.moral || 70}));
    });
    time.slice(0, -1).filter(p => !p.segurando).sort((a, b) => b.nivel - a.nivel).slice(0, F.itens || 0)
      .forEach(p => { p.segurando = ITEM_DA_FAMA; });
    return {id:t.id, nome:x.nome || nomeDeLuta(t), curto:x.curto || t.nome, f:t.artigo === 'uma', time};
  },

  /* a escolha do time: quem serve contra as insígnias de quem desafia,
     do cinto e do PC, até o tamanho da regra. A ordem dos toques é a
     ordem de entrar */
  montar(avisos){
    const d = Estado.dados, r = this.estado('lider', d), x = r && r.desafio;
    if (!x || !x.estrada || !r.tipo) return this.tela('lider', avisos);
    const n = x.ins || 0, R = this.regra(r.ginasio, n), aptos = this.aptos(n, d);
    const chave = `${x.dia}:${x.quem}`;
    if (!Array.isArray(this._sel) || this._selDe !== chave){ this._sel = this.preSelecao(n, d); this._selDe = chave; }
    this._sel = this._sel.filter(u => aptos.some(p => p.uid === u)).slice(0, R.tam);
    const falas = [n ? `${x.nome} tem ${insigniasDitas(n)}.` : `${x.nome} ainda não tem insígnia nenhuma.`,
      `Pelo regulamento, você pode usar até ${porExtenso(R.tam)} Pokémon do tipo ${r.tipo}, nenhum acima do nível ${R.nivel}.`];
    if (!aptos.length) falas.push(`Você não tem nenhum Pokémon do tipo ${r.tipo} até o nível ${R.nivel}, nem no cinto, nem no PC.`);
    UI.telaConversa({num:'Seu ginásio', titulo:'Montar o time', loc:`contra ${x.curto}`, falas, avisos,
      extra:aptos.length ? `<div id="quadra-lista" class="escolhas quadra-lista">${this.listaHTML(aptos, R)}</div>` : '',
      botoes:aptos.length ? [{texto:'Voltar', acao:"Defesa.tela('lider')"}]
        : [{texto:'Entregar a insígnia sem batalhar', acao:'Defesa.desistirSemTime()'}, {texto:'Sair do ginásio', acao:'Exploracao.tela()'}]});
  },
  listaHTML(aptos, R){
    const d = Estado.dados, sel = this._sel || [];
    return aptos.map(p => {
      const i = sel.indexOf(p.uid), onde = (d.time || []).includes(p) ? 'no cinto' : 'no PC';
      return `<button class="escolha com-item quadra-pk${i >= 0 ? ' escolhido' : ''}" data-uid="${UI.esc(p.uid)}" onclick="Defesa.alternar(this.dataset.uid)">
        <span class="creche-pk">${imgSprite(p, 'icone')}<span>${UI.esc(nomeExib(p))} <small>Nv ${p.nivel} · ${onde}</small></span></span>
        <span class="quadra-ordem">${i >= 0 ? `${i + 1}º` : ''}</span></button>`;
    }).join('') + `<button id="quadra-batalhar" class="escolha com-icone luta" onclick="Defesa.batalhar()"${sel.length ? '' : ' disabled'}>${svgIcone('lutar')}<span class="esc-rot">${
      sel.length ? `Batalhar com ${sel.length === 1 ? 'um Pokémon' : porExtenso(sel.length) + ' Pokémon'}` : 'Escolha quem vai batalhar'}</span></button>`;
  },
  alternar(uid){
    const d = Estado.dados, r = this.reg(d).lider, x = r && r.desafio;
    if (!x || !x.estrada) return;
    const n = x.ins || 0, R = this.regra(r.ginasio, n), aptos = this.aptos(n, d);
    this._sel = this._sel || [];
    const i = this._sel.indexOf(uid);
    if (i >= 0) this._sel.splice(i, 1);
    else if (this._sel.length < R.tam && aptos.some(p => p.uid === uid)) this._sel.push(uid);
    const el = document.getElementById('quadra-lista');
    if (el) el.innerHTML = this.listaHTML(aptos, R);
  },
  batalhar(){ return this.lutar('lider', (this._sel || []).slice()); },
  /* sem ninguém que sirva: a insígnia vai sem luta, e é desistir */
  desistirSemTime(){
    const d = Estado.dados, r = this.estado('lider', d), x = r && r.desafio;
    if (!x) return Exploracao.tela();
    if (this.aptos(x.ins || 0, d).length) return this.montar();
    return this.fechar('lider', r, x, 'desistiu', {tipo:'lider', ginasio:r.ginasio}, true);
  },

  /* quem batalha sai do cinto e do PC: o resto do cinto espera no PC
     durante a luta, e tudo volta pro lugar no fim (devolver) */
  emprestar(uids){
    const d = Estado.dados, r = this.reg(d).lider;
    const todos = d.time.concat(d.pc || []);
    const sel = uids.map(u => todos.find(p => p.uid === u)).filter(Boolean);
    if (!sel.length) return;
    r.emprestimo = {cinto:d.time.map(p => p.uid), pc:(d.pc || []).map(p => p.uid)};
    d.pc = (d.pc || []).filter(p => !uids.includes(p.uid)).concat(d.time.filter(p => !uids.includes(p.uid)));
    d.time = sel;
    /* a máquina da quadra: quem batalha entra inteiro */
    sel.forEach(p => curarTotal(p));
  },
  devolver(d){
    d = d || Estado.dados;
    const r = this.reg(d).lider, e = r && r.emprestimo;
    if (!e) return;
    /* a máquina cura quem batalhou, ganhando ou perdendo */
    (d.time || []).forEach(p => { if (!p.morto) curarTotal(p); });
    const todos = (d.time || []).concat(d.pc || []);
    const acha = u => todos.find(p => p.uid === u);
    const cinto = e.cinto.map(acha).filter(Boolean), pc = e.pc.map(acha).filter(Boolean);
    const resto = todos.filter(p => !cinto.includes(p) && !pc.includes(p));
    if (cinto.length){ d.time = cinto; d.pc = pc.concat(resto); }
    r.emprestimo = null;
  },
  limparContextos(){
    Jogo.cenaBatalha = null; Jogo.ginasioAtual = null; Jogo.eliteAtual = null; Jogo.torneioAtual = null;
    Jogo.rivalAtual = null; Jogo.revancheAtual = null; Jogo.estradaAtual = null; Jogo.conferenciaAtual = null;
    Jogo.veteranoAtual = null; Jogo.redeAtual = null; Jogo.patrulhaAtual = null;
  },
  lutarNaQuadra(r, x, uids){
    const d = Estado.dados, n = x.ins || 0;
    if (!uids) return this.montar();
    const R = this.regra(r.ginasio, n), aptos = this.aptos(n, d);
    const sel = uids.map(u => aptos.find(p => p.uid === u)).filter(Boolean).slice(0, R.tam);
    if (!sel.length) return this.montar();
    const fama = x.fama != null ? x.fama : this.fama('lider', d);
    const adv = this.desafianteDaQuadra(x, fama);
    if (!adv || !adv.time.length){
      /* quem marcou não existe mais (save de outra versão): o desafio cai */
      r.desafio = null; r.proximo = d.relogio.dia + this.espera();
      return this.tela('lider');
    }
    adv.time.forEach(p => { p.nomeAnunciado = true; });
    this.emprestar(sel.map(p => p.uid));
    this.limparContextos();
    Jogo.defesaAtual = {tipo:'lider', quem:x.quem, ginasio:r.ginasio, ins:n};
    Jogo.batalhaLivre = true;
    UI.limparDados();
    Batalha.iniciar(d.time[0], adv.time[0], {
      tipo:'treinador', fuga:false, treinador:adv.nome, arena:'ginasio',
      erroIA:DEFESAS.lider.erroIA, vontadeIA:DEFESAS.lider.vontadeIA, semExp:true,
      timeInimigo:adv.time.slice(1),
      introducao:`${adv.nome} enviou ${nomeVisivel(adv.time[0])} (Nv ${adv.time[0].nivel})!`
    });
    UI.telaBatalha([`${adv.nome} desce da arquibancada pra quadra.`, `${adv.nome} quer a insígnia!`]);
  },

  lutar(tipo, uids){
    const d = Estado.dados, r = this.estado(tipo, d), x = r && r.desafio;
    if (!x) return Exploracao.tela();
    if (tipo === 'lider' && x.estrada) return this.lutarNaQuadra(r, x, uids);
    const meu = Estado.primeiroApto();
    if (!meu) return this.tela(tipo, [{tipo:'info', texto:'Nenhum Pokémon em pé. Cure o time antes de batalhar.'}]);
    const ins = inscritoDoTorneio(x.quem);
    /* o degrau é o de quando ele marcou (desafio de antes da fama: o de agora) */
    const fama = x.fama != null ? x.fama : this.fama(tipo, d);
    const adv = ins ? this.desafiante(ins, tipo, fama) : null;
    if (!adv || !adv.time || !adv.time.length){
      /* quem marcou não existe mais (save de outra versão): o desafio cai */
      r.desafio = null; r.proximo = d.relogio.dia + this.espera();
      return this.tela(tipo);
    }
    adv.time.forEach(p => { p.nomeAnunciado = true; });
    this.limparContextos();
    Jogo.defesaAtual = {tipo, quem:x.quem, ginasio:r.ginasio || null};
    Jogo.batalhaLivre = true;
    UI.limparDados();
    Batalha.iniciar(meu, adv.time[0], {
      tipo:'treinador', fuga:false, treinador:adv.nome, arena:'ginasio',
      erroIA:this.forca(tipo, fama).erroIA, vontadeIA:DEFESAS[tipo].vontadeIA,
      timeInimigo:adv.time.slice(1),
      introducao:`${adv.nome} enviou ${nomeVisivel(adv.time[0])} (Nv ${adv.time[0].nivel})!`
    });
    UI.telaBatalha(tipo === 'lider'
      ? [`${adv.nome} desce da arquibancada pra quadra.`, `${adv.nome} quer a insígnia!`]
      : [`${adv.nome} abre a sua porta.`, `${adv.nome} quer passar!`]);
  },

  resultado(fim){
    const ctx = Jogo.defesaAtual;
    Jogo.defesaAtual = null;
    Jogo.batalhaLivre = false;
    /* o time da quadra volta pro lugar antes de tudo */
    if (ctx && ctx.tipo === 'lider') this.devolver();
    if (fim.resultado === 'gameover') return UI.telaGameOver(ctx && ctx.tipo === 'elite' ? 'Você caiu na sua própria porta da Elite.' : 'Você caiu no seu próprio ginásio.');
    const d = Estado.dados, tipo = ctx && ctx.tipo, r = tipo ? this.estado(tipo, d) : null;
    const x = r && r.desafio;
    if (!x) return Jogo.resolverPendencias(() => Exploracao.tela());
    return this.fechar(tipo, r, x, fim.resultado === 'vitoria' ? 'vitoria' : fim.desistiu ? 'desistiu' : 'derrota', ctx);
  },
  /* o fim do desafio: vitória, derrota ou desistência (na luta, ou sem
     batalhar, `semLuta`, quando ninguém do time servia) */
  fechar(tipo, r, x, desfecho, ctx, semLuta){
    const d = Estado.dados;
    r.desafio = null;
    r.proximo = d.relogio.dia + this.espera();
    /* a máquina do ginásio (e a da ala) cura o time depois da luta */
    if (!semLuta) d.time.forEach(p => { if (!p.morto) curarTotal(p); });
    const av = [], falas = [], ezra = x.quem === 'ezra';
    const de = x.f ? 'da' : 'do';
    let titulo;
    if (desfecho === 'vitoria'){
      r.ganhas++;
      r.seguidas = (r.seguidas || 0) + 1;
      r.recorde = Math.max(r.recorde || 0, r.seguidas);
      const giz = r.seguidas === 1 ? 'o primeiro traço' : 'mais um traço';
      const b = DEFESAS[tipo].bonus;
      Estado.j.dinheiro += b;
      av.push({tipo:'item', texto:`+${fmtDin(b)} ₽ — o que a Liga paga por desafio defendido.`});
      if (r.adv > 0){ r.adv--; av.push({tipo:'liga', texto:'A Liga tirou uma advertência do seu nome.'}); }
      falas.push(tipo === 'lider' ? `${x.curto} recolhe a última Pokébola e fica um tempo olhando pra quadra.`
        : `${x.curto} recolhe a última Pokébola e volta pelo corredor sem olhar pras outras portas.`);
      falas.push(fala(x.nome, ezra ? SAIDA_DO_EZRA.perdeu : Dados.escolher(SAIDA_DO_DESAFIANTE.perdeu)));
      falas.push(tipo === 'lider' ? `Na entrada, alguém do ginásio risca ${giz} na lousa, a giz.`
        : `Do lado da sua placa, alguém risca ${giz} a giz.`);
      titulo = tipo === 'lider' ? 'Ginásio defendido' : 'Porta defendida';
      Estado.registrar(`Defendeu ${tipo === 'lider' ? 'o seu ginásio' : 'a sua porta da ala'} contra ${x.nome}.`);
    } else {
      const tinha = r.seguidas || 0;
      /* no ginásio, perder é a insígnia que vai: a advertência é de quem
         falta ou desiste, e, no Difícil, de quem perde também */
      const conta = tipo === 'elite' || desfecho === 'desistiu'
        || (typeof Dificuldade !== 'undefined' && Dificuldade.derrotaNaQuadra());
      r.perdidas++; r.seguidas = 0;
      if (conta) r.adv++;
      falas.push(semLuta ? `Sem ninguém pra batalhar, você tira uma insígnia da caixa e põe na mão ${de} ${x.curto}.`
        : tipo === 'lider' ? `Você tira uma insígnia da caixa e põe na mão ${de} ${x.curto}.`
        : `${x.curto} passa pela sua porta e segue pro fundo do corredor.`);
      falas.push(fala(x.nome, ezra ? SAIDA_DO_EZRA.ganhou[tipo]
        : Dados.escolher(semLuta ? SAIDA_DO_DESAFIANTE.semLuta : SAIDA_DO_DESAFIANTE.ganhou)));
      if (tinha) falas.push(tipo === 'lider' ? 'Na entrada, alguém do ginásio passa a manga na lousa.'
        : 'Do lado da sua placa, os traços de giz somem debaixo de um pano.');
      titulo = tipo === 'lider' ? `${x.curto} levou a insígnia` : `${x.curto} passou`;
      Estado.registrar(semLuta ? `Entregou a insígnia do seu ginásio a ${x.nome} sem batalhar.`
        : `${x.nome} venceu ${tipo === 'lider' ? 'no seu ginásio' : 'na sua porta da ala'}.`);
      if (conta){
        if (r.adv >= ADVERTENCIAS_PRA_PERDER){
          const onde = this.perderPosto(tipo);
          av.push({tipo:'dano', texto:tipo === 'lider' ? `A Liga tirou de você o ginásio de ${onde}.` : `A Liga tirou de você a ${onde} da ala.`});
          falas.push(fala(SECRETARIA_DO_PLANALTO, tipo === 'lider'
            ? 'A Liga decidiu: o ginásio vai pra outra pessoa. Pode deixar a chave na portaria.'
            : 'A Liga decidiu: a porta volta pra quem sentava nela antes.'));
        } else av.push({tipo:'liga', texto:`A Liga anotou uma advertência: ${r.adv} de ${ADVERTENCIAS_PRA_PERDER}.`});
      }
    }
    if (!semLuta) av.push({tipo:'cura', texto:tipo === 'lider' ? 'A máquina do ginásio cura o time.' : 'A máquina da ala cura o time.'});
    Estado.salvar('auto');
    const num = tipo === 'lider' ? `Ginásio de ${cidadeDoGinasio((ctx && ctx.ginasio) || r.ginasio)}` : 'Elite dos Quatro';
    Jogo.resolverPendencias(() => UI.telaConversa({num, titulo, loc:tipo === 'lider' ? 'a quadra' : 'a sua porta',
      falas, avisos:av, botoes:[{texto:'Seguir', acao:'Exploracao.tela()'}]}));
  },

  /* tudo que se fala aqui, pra conferência (chk-baloes) */
  amostras(){
    const S = SECRETARIA_DO_PLANALTO, out = [];
    /* no ginásio quem desafia vem da estrada; na porta, do torneio */
    const est = (typeof TREINADORES_ESTRADA !== 'undefined' ? TREINADORES_ESTRADA : []).filter(t => !t.barreira);
    const quemDa = tipo => tipo === 'lider' && est.length ? nomeDeLuta(est[0]) : 'Domador de Dragões Ronan';
    ['lider', 'elite'].forEach(tipo => {
      ['marcado', 'falta'].forEach(qual => [0, 3].forEach(ins => out.push(...this.falasDoAviso({tipo, qual, nome:quemDa(tipo), ins, f:ins > 0,
        ate:Estado.dados.relogio.dia + PRAZO_DA_DEFESA, ginasio:'pewter', porta:1, perdeu:qual === 'falta' ? 'Pewter' : null}))));
    });
    est.slice(0, 3).forEach(t => FALAS_DO_DESAFIANTE.lider.forEach(f => [0, 1, 4, 7].forEach(n => [null, 'Gelo'].forEach(tp =>
      out.push(fala(nomeDeLuta(t), f('Pewter', n, tp)))))));
    SAIDA_DO_DESAFIANTE.semLuta.forEach(t => out.push(fala(quemDa('lider'), t)));
    out.push(fala(S, this.falaDaVaga(Estado.dados)));
    ['lider', 'elite'].forEach(tipo => FALAS_DA_FAMA[tipo].forEach(f => out.push(fala('Domador de Dragões Ronan', f(3)))));
    Object.values(QUEM_DEIXA_A_PORTA).forEach(l => out.push(...l));
    return out;
  }
};
