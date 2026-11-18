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
   - O desafiante sai dos inscritos do Torneio Aberto (liga.js), com as
     linhas, os golpes e o item dele, mas no tamanho e no nível da
     defesa (`DEFESAS[tipo]`: o ás `nivel` acima da média dos seus três
     mais fortes, `tam` Pokémon). O Ezra vem com o time de rival dele.
     Medido no sim-torneio (FASE=8, NIVEL e EXTRA da defesa): o jogador
     ingênuo no nível da área vence 70% no ginásio e 57% na porta.
   - Ganhou: a Liga paga `DEFESAS[tipo].bonus` e tira uma advertência.
     Perdeu, desistiu ou não apareceu até o prazo: uma advertência. Com
     `ADVERTENCIAS_PRA_PERDER`, a Liga tira o posto. A máquina do
     ginásio (e a da ala) cura o time depois da luta.
   ============================================================ */
const ESPERA_ENTRE_DESAFIOS = [3, 6];   // dias entre um desafio e o próximo, no dado
const PRAZO_DA_DEFESA = 3;              // dias que o desafiante espera
const ADVERTENCIAS_PRA_PERDER = 3;      // com elas, a Liga tira o posto
const DEFESAS = {
  lider:{nivel:-3, tam:4, erroIA:12, bonus:1500},
  elite:{nivel:-5, tam:5, erroIA:8, bonus:3000}
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

/* o que o desafiante diz na quadra (o do Ezra, pelo humor dele) */
const FALAS_DO_DESAFIANTE = {
  lider:[
    c => `Vim pela insígnia de ${c}.`,
    () => 'Me disseram que o ginásio trocou de dono. Vim ver se trocou pra melhor.',
    () => 'Seis Pokémon e nenhum plano B. Pode descer.',
    () => 'Três semanas treinando pra este ginásio. Não me faz perder a viagem.'
  ],
  elite:[
    () => 'Me disseram que tem gente nova numa dessas portas. Vim conferir.',
    () => 'Oito insígnias e um ano de estrada até esta sala.',
    () => 'Eu não subi até o Planalto pra voltar no primeiro corredor.'
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
  ganhou:['Valeu a viagem.', 'Eu sabia que dava.', 'Foi apertado. Foi justo.']
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

  /* o estado de um posto, com o ginásio do final aberto na primeira olhada */
  estado(tipo, d){
    d = d || Estado.dados;
    const r = this.reg(d);
    if (tipo === 'lider' && !r.lider){
      const x = d.depoisDoFim;
      if (x && x.ginasio && !r.perdeuDoFim) this.regGravar(d).lider = this.novo(d, {ginasio:x.ginasio, doFim:true});
    }
    return this.reg(d)[tipo] || null;
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
    const fora = r.perdidos || [];
    /* o Blue foi embora no 23 (aceitando ou não ficar com o ginásio
       dele): a vaga que todo mundo sabe que existe é Viridian */
    if ((d.flags.recusou_o_ginasio || d.flags.blue_ofereceu_o_ginasio) && !fora.includes('viridian')) return 'viridian';
    const ids = GINASIOS.map(g => g.id).filter(g => !fora.includes(g));
    return Dados.escolher(ids.length ? ids : GINASIOS.map(g => g.id));
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
    if (id === 'lider' && !this.estado('lider', d)){
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
    return `A vaga é em ${cidadeDoGinasio(g)}. Quem estava lá pediu afastamento, e ginásio fechado manda desafiante pra cidade do lado.`;
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
      if (dia >= r.proximo) this.marcar(tipo);
    }
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
  falaDoDesafiante(tipo, ins){
    const d = Estado.dados;
    if (ins.id === 'ezra'){
      const amigo = !d.npcs['Ezra'] || d.npcs['Ezra'].opiniao >= 0;
      return FALAS_DO_EZRA[tipo][amigo ? 'amigo' : 'frio'];
    }
    return Dados.escolher(FALAS_DO_DESAFIANTE[tipo])(cidadeDoGinasio(this.meuGinasio(d)));
  },

  marcar(tipo){
    const d = Estado.dados, r = this.estado(tipo, d);
    if (!r) return;
    const ins = this.sortearDesafiante(r);
    if (!ins){ r.proximo = d.relogio.dia + this.espera(); return; }
    r.desafio = {quem:ins.id, nome:ins.nome, curto:ins.curto || ins.nome, f:!!ins.f, de:ins.de || '',
      fala:this.falaDoDesafiante(tipo, ins), dia:d.relogio.dia, ate:d.relogio.dia + PRAZO_DA_DEFESA, cap:capNaJornada(d)};
    r.recentes = [ins.id].concat(r.recentes || []).slice(0, 3);
    Estado.registrar(`${ins.nome} marcou desafio ${tipo === 'lider' ? 'no seu ginásio' : 'na sua porta da ala'}.`);
    Estado.salvar('auto');
    this.avisar(tipo, 'marcado');
  },

  /* não apareceu até o prazo: a insígnia vai (a porta passa) sem luta */
  falta(tipo){
    const d = Estado.dados, r = this.estado(tipo, d), x = r && r.desafio;
    if (!x) return;
    r.desafio = null; r.faltas++; r.adv++;
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
      Estado.registrar(`A Liga tirou o ginásio de ${onde}.`);
    } else {
      (reg.portasPerdidas = reg.portasPerdidas || []).push(r.porta);
      reg.elite = null;
      if (Cargos.tem('elite')) Cargos.largar('elite');
      Estado.registrar(`A Liga tirou a ${onde} da ala da Elite.`);
    }
    return onde;
  },

  /* ---------- o PokéNav ---------- */
  avisar(tipo, qual, extra){
    if (!Estado.temPokenav() || typeof Jogo === 'undefined' || !Jogo.tocarOuGuardar) return;
    Estado.registrarNumero('secretaria');
    const r = this.reg()[tipo] || {}, x = r.desafio || {};
    const aviso = Object.assign({tipo, qual, nome:x.nome || null, ate:x.ate || null,
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
      ? [fala(S, `${a.nome} marcou desafio no ginásio de ${onde}.`), fala(S, `Espera até ${this.diaDito(a.ate)}.`)]
      : [fala(S, `${a.nome} marcou a ala e pediu a sua porta.`), fala(S, `Espera no corredor até ${this.diaDito(a.ate)}.`)];
    if (a.qual === 'falta'){
      const l = a.tipo === 'lider'
        ? [fala(S, `${a.nome} esperou o prazo inteiro no ginásio e foi embora com a insígnia.`), fala(S, 'A Liga anotou a falta.')]
        : [fala(S, `${a.nome} passou pela sua porta sem ninguém do outro lado.`), fala(S, 'A Liga anotou a falta.')];
      if (a.perdeu) l.push(a.tipo === 'lider'
        ? fala(S, `E a Liga decidiu hoje cedo: o ginásio de ${a.perdeu} vai pra outra pessoa. A chave fica na portaria.`)
        : fala(S, `E a Liga decidiu hoje cedo: a ${a.perdeu} volta pra quem sentava nela antes. O seu nome sai da placa amanhã.`));
      return l;
    }
    return [];
  },

  /* ---------- o lugar ---------- */
  /* a porta do ginásio, na cidade dele (mundo.js) */
  afazerDoGinasio(id){
    const r = this.estado('lider');
    const x = r && r.desafio;
    return {lugar:true, id:'ginasio', titulo:'Seu ginásio',
      sub:x ? `${x.curto} marcou desafio. Espera até ${this.diaDito(x.ate)}.` : 'Ninguém marcou desafio.'};
  },
  /* a sua porta, no Planalto */
  afazeres(local){
    if (local !== 'planalto' || this.minhaPorta() == null) return [];
    const r = this.estado('elite'), x = r && r.desafio;
    return [{lugar:true, id:'defesa_elite', titulo:'Sua porta na ala',
      sub:x ? `${x.curto} marcou a ala. Espera até ${this.diaDito(x.ate)}.` : 'Ninguém marcou a ala.'}];
  },
  /* a linha do cartão do posto no balcão de credenciais */
  notaDoCartao(id){
    if (id === 'lider'){ const g = this.meuGinasio(); return g ? `Ginásio de ${cidadeDoGinasio(g)}` : null; }
    if (id === 'elite'){ const p = this.minhaPorta(); return p != null ? `${cap1(ORDINAL_DA_PORTA[p])} porta da ala` : null; }
    return null;
  },
  /* quem tem desafio marcado, e onde (o robô vai atrás) */
  pendente(){
    for (const tipo of ['lider', 'elite']){
      const r = this.estado(tipo);
      if (r && r.desafio) return {tipo, lugar:tipo === 'lider' ? r.ginasio : 'planalto'};
    }
    return null;
  },

  tela(tipo, avisos){
    const d = Estado.dados, r = this.estado(tipo, d);
    if (!r) return Exploracao.tela();
    const x = r.desafio, falas = [];
    const adv = r.adv ? `No quadro da secretaria, do lado do seu nome: ${porExtensoF(r.adv)} advertência${r.adv > 1 ? 's' : ''}.` : null;
    if (tipo === 'lider'){
      const cidade = cidadeDoGinasio(r.ginasio);
      falas.push(r.doFim ? 'A chave pequena do segundo andar continua no seu chaveiro.'
        : 'O quadro da entrada tem o seu nome escrito por cima do nome de quem saiu.');
      if (x){
        falas.push(`${x.nome}${x.de ? ', ' + x.de + ',' : ''} espera na arquibancada com o cinto cheio.`);
        falas.push(fala(x.nome, x.fala));
      } else falas.push('A quadra está limpa e as luzes estão acesas. Ninguém marcou desafio.');
      if (adv) falas.push(adv);
      return UI.telaConversa({num:'Seu ginásio', titulo:`Ginásio de ${cidade}`, loc:'a quadra', falas, avisos,
        botoes:(x ? [{texto:`Defender o ginásio — ${x.curto}`, acao:"Defesa.lutar('lider')", classe:'luta', icone:'lutar'}] : [])
          .concat([{texto:'Sair do ginásio', acao:'Exploracao.tela()'}])});
    }
    const p = r.porta;
    falas.push('A placa de bronze da porta tem o seu nome, na mesma fonte das outras três.');
    if (x){
      falas.push(`${x.nome}${x.de ? ', ' + x.de + ',' : ''} marcou a ala e espera no corredor.`);
      falas.push(fala(x.nome, x.fala));
    } else falas.push('O corredor está vazio. Ninguém marcou a ala.');
    if (adv) falas.push(adv);
    return UI.telaConversa({num:'Elite dos Quatro', titulo:'A sua porta', loc:`${cap1(ORDINAL_DA_PORTA[p])} porta`, falas, avisos,
      botoes:(x ? [{texto:`Defender a porta — ${x.curto}`, acao:"Defesa.lutar('elite')", classe:'luta', icone:'lutar'}] : [])
        .concat([{texto:'Ir pro corredor da Liga', acao:'Jogo.abrirLiga()'}, {texto:'Sair', acao:'Exploracao.tela()'}])});
  },

  /* ---------- a luta ---------- */
  /* o time de quem desafia: o do inscrito do torneio, no tamanho e no
     nível da defesa; o Ezra vem com o time de rival dele */
  desafiante(ins, tipo){
    const D = DEFESAS[tipo], d = Estado.dados;
    if (ins.id === 'ezra' && d.rival) return {id:'ezra', nome:'Ezra', curto:'Ezra', f:false, time:timeRival()};
    let linhas = ins.linhas, golpes = ins.golpes;
    if (ins.veterano && typeof veterano === 'function'){ const v = veterano(ins.veterano); linhas = v.times; golpes = v.golpes; }
    if (!linhas) return null;
    const nivel = Math.max(5, Math.min(85, nivelDeReferencia() + D.nivel) + (ins.ajuste || 0));
    const time = timeDeLinhas(linhas, nivel, D.tam, golpes, MORAL_TORNEIO);
    if (ins.segura && time.length) time[time.length - 1].segurando = ins.segura;
    return {id:ins.id, nome:ins.nome, curto:ins.curto || ins.nome, f:!!ins.f, time};
  },

  lutar(tipo){
    const d = Estado.dados, r = this.estado(tipo, d), x = r && r.desafio;
    if (!x) return Exploracao.tela();
    const meu = Estado.primeiroApto();
    if (!meu) return this.tela(tipo, [{tipo:'info', texto:'Nenhum Pokémon em pé. Cure o time antes de descer pra quadra.'}]);
    const ins = inscritoDoTorneio(x.quem);
    const adv = ins ? this.desafiante(ins, tipo) : null;
    if (!adv || !adv.time || !adv.time.length){
      /* quem marcou não existe mais (save de outra versão): o desafio cai */
      r.desafio = null; r.proximo = d.relogio.dia + this.espera();
      return this.tela(tipo);
    }
    adv.time.forEach(p => { p.nomeAnunciado = true; });
    Jogo.cenaBatalha = null; Jogo.ginasioAtual = null; Jogo.eliteAtual = null; Jogo.torneioAtual = null;
    Jogo.rivalAtual = null; Jogo.revancheAtual = null; Jogo.estradaAtual = null; Jogo.conferenciaAtual = null;
    Jogo.veteranoAtual = null; Jogo.redeAtual = null; Jogo.patrulhaAtual = null;
    Jogo.defesaAtual = {tipo, quem:x.quem, ginasio:r.ginasio || null};
    Jogo.batalhaLivre = true;
    UI.limparDados();
    Batalha.iniciar(meu, adv.time[0], {
      tipo:'treinador', fuga:false, treinador:adv.nome, arena:'ginasio',
      erroIA:DEFESAS[tipo].erroIA, vontadeIA:true,
      timeInimigo:adv.time.slice(1),
      introducao:`${adv.nome} enviou ${nomeVisivel(adv.time[0])} (Nv ${adv.time[0].nivel})!`
    });
    UI.telaBatalha(tipo === 'lider'
      ? [`${adv.nome} desce pra quadra do seu ginásio.`, `${adv.nome} quer a insígnia!`]
      : [`${adv.nome} abre a sua porta.`, `${adv.nome} quer passar!`]);
  },

  resultado(fim){
    const ctx = Jogo.defesaAtual;
    Jogo.defesaAtual = null;
    Jogo.batalhaLivre = false;
    if (fim.resultado === 'gameover') return UI.telaGameOver('Você caiu na quadra do seu próprio posto.');
    const d = Estado.dados, tipo = ctx && ctx.tipo, r = tipo ? this.estado(tipo, d) : null;
    const x = r && r.desafio;
    if (!x) return Jogo.resolverPendencias(() => Exploracao.tela());
    const venceu = fim.resultado === 'vitoria';
    r.desafio = null;
    r.proximo = d.relogio.dia + this.espera();
    /* a máquina do ginásio (e a da ala) cura o time depois da luta */
    d.time.forEach(p => { if (!p.morto) curarTotal(p); });
    const av = [], falas = [], ezra = x.quem === 'ezra';
    const de = x.f ? 'da' : 'do';
    let titulo;
    if (venceu){
      r.ganhas++;
      const b = DEFESAS[tipo].bonus;
      Estado.j.dinheiro += b;
      av.push({tipo:'item', texto:`+${fmtDin(b)} ₽ — o que a Liga paga por desafio defendido.`});
      if (r.adv > 0){ r.adv--; av.push({tipo:'liga', texto:'A Liga tirou uma advertência do seu nome.'}); }
      falas.push(tipo === 'lider' ? `${x.curto} recolhe a última Pokébola e fica um tempo olhando pra quadra.`
        : `${x.curto} recolhe a última Pokébola e desce o corredor de volta, sem olhar pras outras portas.`);
      falas.push(fala(x.nome, ezra ? SAIDA_DO_EZRA.perdeu : Dados.escolher(SAIDA_DO_DESAFIANTE.perdeu)));
      titulo = tipo === 'lider' ? 'Ginásio defendido' : 'Porta defendida';
      Estado.registrar(`Defendeu ${tipo === 'lider' ? 'o seu ginásio' : 'a sua porta da ala'} contra ${x.nome}.`);
    } else {
      r.perdidas++; r.adv++;
      falas.push(tipo === 'lider' ? `Você tira uma insígnia da caixa e põe na mão ${de} ${x.curto}.`
        : `${x.curto} passa pela sua porta e segue pro fundo do corredor.`);
      falas.push(fala(x.nome, ezra ? SAIDA_DO_EZRA.ganhou[tipo] : Dados.escolher(SAIDA_DO_DESAFIANTE.ganhou)));
      titulo = tipo === 'lider' ? `${x.curto} levou a insígnia` : `${x.curto} passou`;
      Estado.registrar(`${x.nome} venceu ${tipo === 'lider' ? 'no seu ginásio' : 'na sua porta da ala'}.`);
      if (r.adv >= ADVERTENCIAS_PRA_PERDER){
        const onde = this.perderPosto(tipo);
        av.push({tipo:'dano', texto:tipo === 'lider' ? `A Liga tirou o ginásio de ${onde} de você.` : `A Liga tirou a ${onde} da ala de você.`});
        falas.push(fala(SECRETARIA_DO_PLANALTO, tipo === 'lider'
          ? 'A Liga decidiu: o ginásio vai pra outra pessoa. Pode deixar a chave na portaria.'
          : 'A Liga decidiu: a porta volta pra quem sentava nela antes.'));
      } else av.push({tipo:'liga', texto:`A Liga anotou uma advertência: ${r.adv} de ${ADVERTENCIAS_PRA_PERDER}.`});
    }
    av.push({tipo:'cura', texto:'A máquina da quadra cura o time.'});
    Estado.salvar('auto');
    const num = tipo === 'lider' ? `Ginásio de ${cidadeDoGinasio(ctx.ginasio || r.ginasio)}` : 'Elite dos Quatro';
    Jogo.resolverPendencias(() => UI.telaConversa({num, titulo, loc:tipo === 'lider' ? 'a quadra' : 'a sua porta',
      falas, avisos:av, botoes:[{texto:'Seguir', acao:'Exploracao.tela()'}]}));
  },

  /* tudo que se fala aqui, pra conferência (chk-baloes) */
  amostras(){
    const S = SECRETARIA_DO_PLANALTO, out = [];
    ['lider', 'elite'].forEach(tipo => {
      ['marcado', 'falta'].forEach(qual => out.push(...this.falasDoAviso({tipo, qual, nome:'Domador de Dragões Ronan',
        ate:Estado.dados.relogio.dia + PRAZO_DA_DEFESA, ginasio:'pewter', porta:1, perdeu:qual === 'falta' ? 'Pewter' : null})));
    });
    out.push(fala(S, this.falaDaVaga(Estado.dados)));
    Object.values(QUEM_DEIXA_A_PORTA).forEach(l => out.push(...l));
    return out;
  }
};
