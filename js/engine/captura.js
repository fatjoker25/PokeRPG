/* ============================================================
   CAPTURA
   Comuns: Poké/Great/Ultra/Master Ball
   Lendários: SÓ Ultra Ball (1d20: 1-2 captura) e Master Ball
   Mewtwo e Ho-Oh: 1d20 antes de tudo — 1-5 a bola QUEBRA
   ============================================================ */
const Captura = {
  /* O que a tela precisa mostrar do último arremesso. Fica aqui, e não
     no texto, porque a animação tem que obedecer ao dado: se a bola
     balançou duas vezes e abriu, são duas chacoalhadas e depois abre —
     não um genérico. Quem desenha lê isto e zera. */
  ultimo: null,

  tentar(alvo, nomeBola, batalha){
    this.ultimo = null;
    const anima = (desfecho, sacudidas) => {
      this.ultimo = {bola:nomeBola, desfecho, sacudidas:sacudidas || 0};
    };
    const eventos = [];
    const ev = (t, txt) => eventos.push({tipo:t, texto:txt});
    const esp = DEX[alvo.dex];

    if (!Estado.contaItem(nomeBola)){
      ev('erro', `Você não tem ${nomeBola}.`);
      return {eventos, capturou:false};
    }

    // ---- lendários recusam bolas fracas
    if (esp.lendario && (nomeBola === 'Poké Ball' || nomeBola === 'Great Ball')){
      Estado.usarItem(nomeBola);
      ev('erro', `A ${nomeBola} bate em ${esp.nome} e cai no chão, aberta. Ela nem chega a tentar.`);
      ev('info', 'Agora você sabe uma coisa que não estava escrita em lugar nenhum.');
      Estado.marcar('bola_fraca_em_lendario');
      const L = Estado.lend(alvo.dex);
      L.ataquesSofridos++;
      anima('recusou', 0);
      return {eventos, capturou:false};
    }

    Estado.usarItem(nomeBola);

    // ---- QUEBRA-BOLAS: Mewtwo e Ho-Oh
    if (QUEBRA_BOLA.includes(alvo.dex)){
      const d = Dados.d20('A bola aguenta?');
      ev('info', `${esp.nome} é forte demais para uma bola comum suportar. 1d20 = ${d} (1-5 quebra)`);
      if (d <= 5){
        ev('perigo', `A esfera racha no ar. Um estalo seco — e ${esp.nome} está livre, com os olhos em você.`);
        const L = Estado.lend(alvo.dex);
        L.disposicao = 'hostil';
        L.quebrouBola = true;
        Estado.marcar('lendario_furioso_' + alvo.dex);
        Estado.registrar(`${esp.nome} quebrou uma ${nomeBola} e passou a te caçar.`);
        Estado.mudarRep('ruim', 1, `Provocou ${esp.nome}`);
        anima('quebrou', 0);
        return {eventos, capturou:false, enfurecido:true};
      }
      ev('info', 'A bola aguenta. Por enquanto.');
    }

    // ---- Master Ball
    if (nomeBola === 'Master Ball'){
      ev('captura', 'A Master Ball se fecha. Um clique. Só isso.');
      Estado.marcar('master_quase_sempre');
      anima('captura', 0);
      return this.concluir(alvo, nomeBola, eventos);
    }

    // ---- lendário com Ultra Ball: 1d20, só 1-2 prende
    if (esp.lendario){
      const d = Dados.d20('Captura de lendário');
      ev('info', `Ultra Ball em um lendário: 1d20 = ${d} — só 1 ou 2 prendem.`);
      if (d <= 2){
        ev('captura', `Contra tudo que é provável, a bola para de tremer.`);
        Estado.marcar('ultra_prende_lendario');
        anima('captura', 3);
        return this.concluir(alvo, nomeBola, eventos);
      }
      ev('erro', `${esp.nome} rompe a bola sem esforço aparente.`);
      Estado.marcar('ultra_prende_lendario');
      const L = Estado.lend(alvo.dex);
      L.ataquesSofridos++;
      if (L.ataquesSofridos >= 3 && L.disposicao === 'neutro'){
        L.disposicao = 'hostil';
        ev('perigo', `${esp.nome} decorou seu rosto. Agora é pessoal.`);
        Estado.registrar(`${esp.nome} tornou-se hostil por insistência.`);
      }
      /* "rompe sem esforço": entra, e sai antes da primeira chacoalhada */
      anima('rompeu', 0);
      return {eventos, capturou:false};
    }

    // ---- captura comum (estilo jogos)
    const bola = ITENS_INFO[nomeBola].mult;
    const propHP = alvo.hp / alvo.hpMax;
    let bonusStatus = 1;
    if (alvo.status === 'sono' || alvo.status === 'congelamento') bonusStatus = 2;
    else if (alvo.status) bonusStatus = 1.5;

    const taxa = esp.captura;
    const a = ((3 * alvo.hpMax - 2 * alvo.hp) / (3 * alvo.hpMax)) * taxa * bola * bonusStatus;
    const chance = Math.min(100, (a / 255) * 100);

    ev('info', `HP em ${Math.round(propHP*100)}%${alvo.status ? ', com '+alvo.status : ''} — chance de captura ≈ ${Math.round(chance)}%`);

    let sacudidas = 0;
    for (let i = 0; i < 3; i++){
      const d = Dados.d20('Sacudida ' + (i+1));
      const limite = Math.max(1, Math.round((chance / 100) * 20));
      if (d <= limite) sacudidas++;
      else break;
    }
    const nomes = ['A bola balança uma vez...', 'Duas vezes...', 'Três vezes...'];
    for (let i = 0; i < sacudidas; i++) ev('info', nomes[i]);

    if (sacudidas >= 3){
      ev('captura', 'CLIQUE.');
      anima('captura', 3);
      return this.concluir(alvo, nomeBola, eventos);
    }
    ev('erro', `${alvo.nome} escapou da bola!`);
    anima('escapou', sacudidas);
    return {eventos, capturou:false};
  },

  concluir(alvo, nomeBola, eventos){
    const ev = (t, txt) => eventos.push({tipo:t, texto:txt});
    const esp = DEX[alvo.dex];
    alvo.selvagem = false;
    alvo.capturadoEm = {cap:Estado.dados.capitulo, bola:nomeBola, dia:Estado.dados.relogio.dia};
    alvo.moral = esp.lendario ? 10 : 40;
    const destino = Estado.adicionar(alvo);
    ev('captura', `${esp.nome} (Nv ${alvo.nivel}, ${alvo.natureza}) foi capturado!` + (destino === 'pc' ? ' Foi direto para o PC — seu time está cheio.' : ''));
    Estado.registrar(`Capturou ${esp.nome} Nv${alvo.nivel} com ${nomeBola}.`);
    if (alvo.shiny){
      Estado.pegouBrilhante(alvo.dex);
      ev('brilhante', 'E ele é brilhante. Você vai contar essa história mal, porque ninguém conta essa história bem.');
    }

    if (esp.lendario) this.consequenciasLendario(alvo, eventos);
    return {eventos, capturou:true};
  },

  /* ============================================================
     CONSEQUÊNCIAS EM CASCATA
     ============================================================ */
  consequenciasLendario(alvo, eventos){
    const ev = (t, txt) => eventos.push({tipo:t, texto:txt});
    const dex = alvo.dex;
    const L = Estado.lend(dex);
    L.estado = 'capturado';
    L.disposicao = 'prisioneiro';
    Estado.dados.mundo.instabilidade++;

    // reputação: capturar lendário SEMPRE move 2 níveis
    const testemunhado = Dados.chance(60) || Estado.rep.bom >= 5 || Estado.rep.ruim >= 4;
    if (testemunhado){
      Estado.marcar('captura_vista_' + dex);
      ev('mundo', 'Alguém viu. Sempre tem alguém vendo.');
      // como a comunidade reage depende de quem você era antes disso
      if (Estado.rep.eixo === 'bom' && Estado.rep.bom >= 4){
        Estado.mudarRep('bom', 2, `Capturou ${DEX[dex].nome} — e te chamaram de herói por isso`, {rep:{notorio:true, peso:5}});
        ev('mundo', 'Por enquanto, chamam de feito. Enquanto ele continuar na sua bola, vão mudar de ideia.');
      } else {
        Estado.mudarRep('ruim', 2, `Capturou ${DEX[dex].nome} diante de testemunhas`, {rep:{notorio:true, peso:5}});
      }
    } else {
      // ninguém viu: nenhuma reputação ainda — mas o segredo tem prazo de validade
      Estado.marcar('lendario_oculto_' + dex);
      ev('mundo', 'Ninguém viu. Ainda assim, o mundo sentiu — e o mundo conta depois.');
    }

    // --- Cães Lendários
    if (GRUPO_CAES.includes(dex)){
      const outros = GRUPO_CAES.filter(d => d !== dex);
      const presos = GRUPO_CAES.filter(d => Estado.lend(d).estado === 'capturado');
      outros.forEach(d => {
        const o = Estado.lend(d);
        if (o.estado !== 'capturado'){ o.disposicao = 'hostil'; o.caçandoVoce = true; }
      });
      ev('mundo', `Em algum lugar de Kanto, ${outros.map(d=>DEX[d].nome).join(' e ')} param de correr ao mesmo tempo. E mudam de direção — na sua.`);
      Estado.registrar(`Cães lendários começaram a caçar você.`);
      if (presos.length === 2){
        ev('mundo', 'O terceiro cão não vai só te caçar. Vai abrir caminho até você, pelo meio do que estiver na frente.');
        Estado.dados.mundo.instabilidade += 2;
      }
      if (presos.length === 3){
        ev('mundo', 'O equilíbrio quebrou. Incêndios sem fonte. Tempestades sem nuvem. Rotas congeladas em pleno verão.');
        Estado.dados.mundo.clima = 'caotico';
        Estado.dados.mundo.instabilidade += 5;
        Estado.marcar('equilibrio_rompido');
      }
    }

    // --- Aves Lendárias
    if (GRUPO_AVES.includes(dex)){
      const outras = GRUPO_AVES.filter(d => d !== dex);
      const presas = GRUPO_AVES.filter(d => Estado.lend(d).estado === 'capturado');
      outras.forEach(d => {
        const o = Estado.lend(d);
        if (o.estado !== 'capturado'){ o.disposicao = 'hostil'; o.caçandoVoce = true; }
      });
      ev('mundo', `O céu muda de cor. ${outras.map(d=>DEX[d].nome).join(' e ')} sentiram a ausência.`);
      Estado.dados.mundo.clima = 'instavel';
      if (presas.length === 3){
        ev('mundo', 'Kanto não tem mais estações. Só episódios.');
        Estado.dados.mundo.clima = 'permanentemente instável';
        Estado.dados.mundo.instabilidade += 5;
        Estado.marcar('clima_quebrado');
      }
    }

    // --- Ho-Oh
    if (dex === 250){
      ev('mundo', 'O mundo sente a falta. Pokémon que ninguém vê há décadas aparecem em lugares errados, confusos.');
      Estado.dados.mundo.instabilidade += 3;
      Estado.marcar('ho_oh_capturado');
      ev('mundo', 'E algo enorme, que nunca pertenceu a Kanto, começa a se mover em direção à costa.');
      Estado.marcar('lugia_chamado');
    }

    // --- Mewtwo
    if (dex === 150){
      ev('mundo', 'Em Cinnabar, um computador que ninguém liga há anos acende sozinho.');
      Estado.marcar('mewtwo_capturado');
      Estado.dados.mundo.instabilidade += 4;
    }

    // --- Mew
    if (dex === 151){
      ev('mundo', 'Mew cabe na sua mão e não parece preso. Isso é pior.');
      Estado.marcar('mew_capturado');
      ev('mundo', 'Três dias depois, gente de jaleco começa a perguntar seu nome em postos de estrada.');
      Estado.marcar('cientistas_atras');
    }

    // --- A Liga reage
    if (testemunhado) this.ligaReage(eventos);
  },

  ligaReage(eventos){
    const ev = (t, txt) => eventos.push({tipo:t, texto:txt});
    const liga = Estado.dados.liga;
    liga.avisos++;
    if (liga.avisos === 1){
      ev('liga', 'A Liga Pokémon vai querer conversar. Eles sempre começam conversando.');
      Estado.marcar('liga_aviso_1');
    } else if (liga.avisos === 2){
      liga.ordemDevolucao = true;
      ev('liga', 'Segunda vez. Ordem formal de devolução — e alguém de terno te seguindo a três quarteirões de distância.');
      Estado.marcar('liga_aviso_2');
    } else if (liga.avisos >= 3){
      liga.detencao = true;
      ev('liga', 'Terceira vez. Ordem de detenção emitida. Treinadores da Liga estão autorizados a te capturar.');
      Estado.marcar('liga_detencao');
      Estado.mudarRep('ruim', 1, 'Ordem de detenção da Liga', {rep:{notorio:true, peso:4}});
    }
  },

  /* ---------- soltar um lendário ---------- */
  soltar(p){
    const eventos = [];
    const ev = (t, txt) => eventos.push({tipo:t, texto:txt});
    const esp = DEX[p.dex];
    /* o par fica, e vê o outro ir embora */
    const par = parDe(p, Estado.dados.time);
    Estado.removerDoTime(p.uid);
    const i = Estado.dados.pc.findIndex(x => x.uid === p.uid);
    if (i >= 0) Estado.dados.pc.splice(i,1);

    if (esp.lendario){
      const L = Estado.lend(p.dex);
      L.estado = 'solto';
      L.disposicao = 'desconfiado';
      Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade - 1);
      ev('mundo', `${esp.nome} sai da bola e não ataca. Fica parado, te olhando, tempo demais. Depois vai embora.`);
      ev('mundo', 'Ele não vai te ajudar. Mas também não vai te caçar.');
      // os outros do grupo param de caçar, mas não esquecem
      [...GRUPO_CAES, ...GRUPO_AVES].forEach(d => {
        const o = Estado.dados.lendarios[d];
        if (o && o.caçandoVoce && Estado.lend(d).estado !== 'capturado'){
          o.caçandoVoce = false;
          o.disposicao = 'desconfiado';
        }
      });
      Estado.mudarRep('bom', 1, `Libertou ${esp.nome}`);
      ev('mundo', 'A notícia corre mais rápido que a da captura. Mas o trauma fica — as pessoas lembram das duas coisas.');
      Estado.registrar(`Soltou ${esp.nome}.`);
      Estado.marcar('soltou_lendario_' + p.dex);
    } else {
      ev('info', `${nomeExib(p)} foi solt${pron(p).o}. ${pron(p).Ele} olha para trás uma vez antes de sumir.`);
      Estado.registrar(`Soltou ${nomeExib(p)}.`);
      if (par){
        par.moral = Math.max(0, (par.moral !== undefined ? par.moral : 70) - 10);
        ev('info', `${nomeExib(par)} vai atrás até a beira do mato, para, e demora pra voltar pra você.`);
      }
    }
    return eventos;
  }
};
