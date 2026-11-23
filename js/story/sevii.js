/* ============================================================
   O PÓS-JOGO DAS ILHAS SEVII
   Foi pedido assim: depois do fim, quem venceu a Liga fala com o Blue
   na casa dele, em Pallet; ele conta do Torneio das Ilhas e entrega a
   passagem; o S.S. Anne leva de Vermilion às ilhas; lá, antes do
   torneio, um roubo de Pokémon por umas gangues, que você resolve
   passando pelas ilhas — investigando, lutando, com as escolhas e o
   jeito de quem joga pesando como na história; e um rival novo, em
   potencial. O torneio traz gente de Johto e de Hoenn (o elenco, em
   sevii-elenco.js), e a chave dele mora em sevii-torneio.js.

   Os capítulos são 33 a 38, `posJogo:true`: não entram na sequência
   da história (Historia.proximoCapitulo os pula) e só existem pra
   quem chegou ao fim (d.depoisDoFim) com o título de Campeão. Depois
   do fim, o próximo capítulo é o daqui (Sevii.proximo), e a âncora de
   cada um põe o chamado dourado no lugar certo do mapa:
     33 A Passagem       — Pallet, a casa do Blue
     34 O Navio          — o cais de Vermilion, o S.S. Anne, o roubo
     35 A Maré           — Ilha Um e Ilha Dois: a turma do cais
     36 Os Faróis        — Ilha Três: a gangue das motos
     37 O Armazém        — a campina da Ilha Cinco, a noite da troca
     38 O Torneio das Ilhas — Ilha Sete
   O número não é posição de jornada nenhuma: a história já acabou, e
   capNaJornada dá 33 a 38, que é "depois de tudo".

   As ilhas abrem uma de cada vez, pela balsa (Sevii.trava): a Ilha Um
   e a Dois na chegada, a Três depois da Maré, a Quatro e a Cinco
   depois dos Faróis, a Seis e a Sete depois do armazém. No caminho,
   entre um capítulo e outro, cada ilha do meio tem o que contar
   (`pista_*`, nos afazeres).

   O que a história guarda (flags `sv_*`):
     sv_passagem, sv_chegou                  a passagem do Blue e a chegada
     sv_conheceu_<id>                        quem você ouviu no navio
     sv_rec_milotic / _etta / _ovos / _turma o que voltou pro dono
     sv_noa_rival / _ajudou / _entregue      o jeito com a Noa
     sv_jory_*, sv_kaspar_preso / _fugiu / _acordo, sv_penrose_preso /
     _pagou / _fugiu                         quem caiu e como
     sv_viu_o_barco, sv_oona_ajudou          o que se achou no caminho
   ============================================================ */
const SEVII_CAPS = [33, 34, 35, 36, 37, 38];
/* o que a gangue levou, de quem, e a flag de quando volta */
const ROUBOS_DE_SEVII = {
  milotic:{dono:'esme',    dex:[350],      flag:'sv_rec_milotic', o:'a Milotic da Esme'},
  etta:   {dono:'etta',    dex:[214, 291], flag:'sv_rec_etta',    o:'a mochila da Etta, com o Heracross e o Ninjask'},
  ovos:   {dono:'florian', dex:[],         flag:'sv_rec_ovos',    o:'a caixa térmica do Florian, com seis ovos'},
  turma:  {dono:'brody',   dex:[],         flag:'sv_rec_turma',   o:'os Pokémon de trabalho da turma do Brody'}
};
/* a fase (capítulos das ilhas fechados) em que cada lugar abre */
const ILHA_ABRE_NA_FASE = {
  ilha_um:2, estrada_brasa:2, monte_brasa:2, ilha_dois:2, cabo:2,
  ilha_tres:3, ponte:3, floresta_frutas:3,
  ilha_quatro:4, gruta_gelada:4, ilha_cinco:4, campina:4,
  ilha_seis:5, vale_ruinas:5, ilha_sete:5, canion:5
};
/* por que a balsa não leva: o que a ilha diz, na língua dela */
const BALSA_FECHADA = {
  3:'O barqueiro da Ilha Dois não leva ninguém pra Ilha Três. "Lá tem moto no cais, e eu tenho filho."',
  4:'O barco que desce pro sul não sai: o mestre diz que só desamarra quando o cais da Ilha Três voltar a ser cais.',
  5:'A balsa do norte, a da Ilha Seis e da Ilha Sete, só sai na semana do torneio, com a lista dos inscritos, e a lista ainda não fechou.'
};
/* os cais da balsa direta: Vermilion e a vila de cada ilha. Depois da
   chegada ela sai de qualquer um pra qualquer cais aberto, sem parar
   nas ilhas do meio; o cais fechado é o da balsa de ilha em ilha */
const PORTOS_DA_BALSA = ['vermilion', 'ilha_um', 'ilha_dois', 'ilha_tres', 'ilha_quatro', 'ilha_cinco', 'ilha_seis', 'ilha_sete'];
/* quem fala nos capítulos e não é do elenco nem luta: rosto e nome */
const PESSOAS_DE_SEVII = {
  'Sargento Lund':'sevii_lund', 'Sr. Penrose':'sevii_penrose'
};
/* a música das brigas da história: a gangue toca radical, quem manda nela
   toca a do chefe (som.js lê daqui) */
const FAIXA_DE_SEVII = {mare:'bw2-homika-dogars', jory:'bw2-homika-dogars', farol:'bw2-homika-dogars',
  kaspar:'xd-miror-b', dekker:'colosseum-miror-b', blue:'bw2-kanto-gym-leader'};

const Sevii = {
  /* quem pode ir: o fim da história e o título de Campeão */
  aberto(d){
    d = d || (typeof Estado !== 'undefined' ? Estado.dados : null);
    return !!(d && d.depoisDoFim && d.flags && d.flags.campeao_de_kanto);
  },
  feitos(d){ return ((d || Estado.dados).capitulosFechados || []).filter(n => SEVII_CAPS.includes(n)); },
  /* quantos capítulos das ilhas já fecharam: 0 a 6 */
  fase(d){
    d = d || (typeof Estado !== 'undefined' ? Estado.dados : null);
    return d ? this.feitos(d).length : 0;
  },
  /* o próximo capítulo do pós-jogo, ou null */
  proximo(d){
    if (!this.aberto(d)) return null;
    const feitos = this.feitos(d);
    for (const n of SEVII_CAPS){
      if (feitos.includes(n)) continue;
      return (typeof Historia !== 'undefined' && Historia.capitulo(n)) ? n : null;
    }
    return null;
  },
  /* está numa cena de capítulo das ilhas agora */
  noArco(d){ d = d || Estado.dados; return !!(d && SEVII_CAPS.includes(d.capitulo) && d.modo === 'cena'); },
  aqui(d){ d = d || Estado.dados; return !!(d && ehSevii(d.local)); },
  /* o arco inteiro acabou: o torneio da história já foi */
  acabou(d){ return this.fase(d) >= SEVII_CAPS.length; },

  /* Quem não tem a passagem não sabe que as ilhas existem no mapa: a
     Ilha Um aparece com a passagem na mão, o resto com a chegada */
  conhecido(id){
    const d = Estado.dados;
    if (!d || !this.aberto(d)) return false;
    return id === 'ilha_um' ? !!d.flags.sv_passagem : !!d.flags.sv_chegou;
  },

  /* A travessia: a primeira é a do S.S. Anne, na história (capítulo 34),
     e depois dela a balsa vai e volta entre Vermilion e a Ilha Um. Entre
     as ilhas, cada uma abre na vez dela. */
  trava(de, para){
    const d = Estado.dados;
    if (!d) return null;
    const cruza = (de === 'vermilion' && para === 'ilha_um') || (de === 'ilha_um' && para === 'vermilion');
    if (cruza){
      if (d.flags.sv_chegou) return null;
      return d.flags.sv_passagem
        ? 'O S.S. Anne sai do cais três com quem tem passagem marcada. É lá que se embarca, não na bilheteria da balsa.'
        : 'A balsa das ilhas só sai com passagem marcada, e a bilheteria do porto não vende pra quem não tem convite.';
    }
    if (!ehSevii(para) || !ehSevii(de)) return null;
    const precisa = ILHA_ABRE_NA_FASE[para] || 0, f = this.fase(d);
    if (f >= precisa) return null;
    /* dentro da mesma ilha a trilha é a pé: só a balsa trava */
    if (ILHA_ABRE_NA_FASE[de] === precisa) return null;
    return BALSA_FECHADA[precisa] || 'A balsa não sai pra lá hoje.';
  },

  /* o que voltou pro dono: true, false (não voltou) ou null (ainda não se sabe) */
  recuperou(chave, d){
    d = d || Estado.dados;
    const r = ROUBOS_DE_SEVII[chave];
    if (!r || !d) return null;
    if (d.flags[r.flag]) return true;
    return this.fase(d) >= 5 ? false : null;
  },
  quantosVoltaram(d){ return Object.keys(ROUBOS_DE_SEVII).filter(k => this.recuperou(k, d) === true).length; },
  /* os Pokémon que a pessoa não tem na mão no torneio */
  semDoDono(id, d){
    d = d || Estado.dados;
    return Object.values(ROUBOS_DE_SEVII).filter(r => r.dono === id && !(d && d.flags[r.flag])).flatMap(r => r.dex);
  },

  /* o lado de quem joga, pras escolhas que leem isso */
  lado(d){ return (typeof caminhoAtual === 'function') ? caminhoAtual(d || Estado.dados) : 'andarilho'; },
  daLei(d){
    d = d || Estado.dados;
    return this.lado(d) === 'lei' || (typeof Cargos !== 'undefined' && ['guarda_rota', 'investigador'].some(c => Cargos.tem(c)));
  },
  daRede(d){ d = d || Estado.dados; return this.lado(d) === 'rocket' || !!(d.rede && d.rede.escalao); },
  procurado(d){ d = d || Estado.dados; return !!(d && d.liga && d.liga.detencao); },
  /* o que quem joga escreveu na ficha: o objetivo (j.meta) e os traços */
  meta(d){ d = d || Estado.dados; return (d.jogador && d.jogador.meta) || null; },
  traco(rad, d){
    d = d || Estado.dados;
    const j = d.jogador || {};
    const t = [].concat(j.tracos || [], j.personalidade || []).join(' ');
    return new RegExp(rad, 'i').test(t);
  },
  /* a Noa está livre pra se inscrever: largou a gangue, ou a gangue caiu */
  noaInscrita(d){
    d = d || Estado.dados;
    return !!(d.flags.sv_noa_rival && (d.flags.sv_noa_ajudou || d.flags.sv_kaspar_preso || d.flags.sv_penrose_preso));
  },

  /* time de quem luta nas ilhas fora do torneio: as gangues pelas
     linhas, gente do elenco pela ficha. O nível acompanha o seu time,
     como o dos caminhos: luta de pós-jogo não fica de graça. */
  nivel(d, extra){
    const vivos = ((d || Estado.dados).time || []).filter(p => !p.morto).map(p => p.nivel).sort((a, b) => b - a);
    const tres = vivos.slice(0, 3);
    const ref = tres.length ? Math.round(tres.reduce((s, n) => s + n, 0) / tres.length) : 60;
    return Math.max(58, ref + (extra || 0));
  },
  /* `tam` é o tamanho do time de quem é do elenco (os do fim da ficha) */
  timeDaLuta(chave, nivel, tam){
    if (chave === 'blue') return this.timeDoBlue(nivel);
    const f = typeof fichaSevii === 'function' ? fichaSevii(chave) : null;
    if (f) return timeDaFicha(f, nivel, tam || 6, this.semDoDono(f.id));
    const l = LUTAS_DE_SEVII[chave];
    if (!l) return [criarPokemon(19, nivel)];
    return timeDeLinhas(l.times, nivel + (l.ajuste || 0), l.times.length, l.golpes || [], 80);
  },
  /* o Blue no quintal de casa: o time do ginásio, fechado com o inicial
     que vence o seu, como na porta de Viridian */
  timeDoBlue(nivel){
    const contra = {1:6, 4:9, 7:3};
    const ace = contra[Estado.j.inicialDex] || 6;
    const time = timeDeLinhas([18, 65, 112, 130, 59, ace], nivel, 6, ['Earthquake', 'Psychic', 'Fire Blast', 'Ice Beam'], 95);
    if (time.length) time[time.length - 1].segurando = 'Leftovers';
    return time;
  },
  nomeDaLuta(chave){
    if (chave === 'blue') return 'Blue';
    const f = typeof fichaSevii === 'function' ? fichaSevii(chave) : null;
    return f ? f.nome : ((LUTAS_DE_SEVII[chave] || {}).nome || chave);
  },

  /* ---------- o que fazer em cada ilha ----------
     Entre um capítulo e outro, a ilha do meio do caminho tem uma coisa
     pra contar; depois do arco, a arena aos domingos, a pousada onde
     quem veio de longe ficou, e a Noa no cais. */
  afazeres(id){
    const d = Estado.dados, lista = [];
    if (!d) return lista;
    /* o cais da balsa: em Vermilion e na vila de cada ilha, depois da chegada */
    if (PORTOS_DA_BALSA.includes(id) && this.balsaAberta(d))
      lista.push({lugar:true, id:'sevii_balsa', titulo:'Cais da balsa'});
    if (!ehSevii(id)) return lista;
    const f = this.fase(d);
    if (id === 'ilha_quatro' && f === 4 && !d.flags.sv_pista_quatro)
      lista.push({id:'sevii_pista_quatro', titulo:'O cais dos pescadores do gelo',
        sub:'Três velhos de luva consertando rede em volta de um fogareiro. Um deles olha pro sul e cospe.'});
    if (id === 'ilha_seis' && f === 5 && !d.flags.sv_pista_seis)
      lista.push({id:'sevii_pista_seis', titulo:'A moça de cabelo branco no muro',
        sub:'Ela pergunta a todo mundo a mesma coisa, mostrando uma Pokébola velha, e todo mundo diz que não sabe.'});
    if (id === 'ilha_sete' && f >= 6){
      lista.push({lugar:true, id:'sevii_arena', titulo:'A arena da Ilha Sete',
        sub:'O Torneio das Ilhas volta todo domingo. Quem veio de longe ficou mais um pouco.',
        fechada:(typeof CopaSevii !== 'undefined' ? CopaSevii.fechada() : null)});
      lista.push({lugar:true, id:'sevii_pousada', titulo:'A pousada da arena',
        sub:'Quem veio pro torneio ainda está por aqui, e de noite a varanda enche.'});
    }
    /* a Noa, depois do arco: uma vez por semana no fim do cais */
    const rn = typeof registroRival === 'function' ? registroRival('noa') : null;
    if (id === 'ilha_um' && f >= 6 && rn && (d.relogio.dia - (rn.ultimoDia || 0)) >= 7)
      lista.push({id:'sevii_noa', titulo:'A Noa está no fim do cais',
        sub:'Sentada na beirada, com o Murkrow no ombro e o Sharpedo rodando na água embaixo.'});
    return lista;
  },
  fazer(x){
    if (x === 'balsa') return this.balsa();
    if (x.startsWith('balsa_')) return this.embarcar(x.slice(6));
    if (x === 'arena') return CopaSevii.tela();
    if (x === 'pousada') return this.pousada();
    if (x.startsWith('sentar_')) return this.sentar(x.slice(7));
    if (x === 'pista_quatro') return this.pistaQuatro();
    if (x === 'pista_seis') return this.pistaSeis();
    if (x === 'noa'){
      const rn = typeof registroRival === 'function' ? registroRival('noa') : null;
      if (!rn) return Exploracao.tela([{tipo:'info', texto:'A beirada do cais está vazia. Só um Murkrow no poste, olhando pra você.'}]);
      rn.ultimoDia = Estado.dados.relogio.dia;
      Jogo.encontroRival = {tipo:'extra', id:'noa', nome:'Noa'};
      return UI.telaRival();
    }
    return Exploracao.tela();
  },

  /* ── a balsa direta: do cais de Vermilion e de cada vila, pra
     qualquer cais aberto, sem descer nas ilhas do meio. A primeira
     travessia é a do S.S. Anne (capítulo 34); depois dela a balsa é de
     quem está na lista do torneio, e depois do torneio as sete ilhas
     ficam abertas pra sempre. Leva um período, como uma viagem ── */
  balsaAberta(d){ d = d || Estado.dados; return !!(d && this.aberto(d) && d.flags.sv_chegou); },
  /* o cais aonde a balsa ainda não vai: o que a ilha diz, na língua dela */
  portoFechado(id, d){
    d = d || Estado.dados;
    if (!PORTOS_DA_BALSA.includes(id)) return 'A balsa não para lá.';
    const fim = (typeof Depois !== 'undefined') ? Depois.trava(Mundo.id(), id) : null;
    if (fim) return fim;
    if (id === 'vermilion') return null;
    const precisa = ILHA_ABRE_NA_FASE[id] || 0;
    return this.fase(d) >= precisa ? null : (BALSA_FECHADA[precisa] || 'A balsa não sai pra lá hoje.');
  },
  balsa(av){
    const d = Estado.dados, aqui = Mundo.id();
    if (!this.balsaAberta(d) || !PORTOS_DA_BALSA.includes(aqui)) return Exploracao.tela();
    const botoes = PORTOS_DA_BALSA.filter(id => id !== aqui).map(id => ({
      texto:LOCAIS[id].nome, icone:'balsa', trava:this.portoFechado(id, d), acao:`Sevii.fazer('balsa_${id}')`}));
    botoes.push({texto:`Ficar ${emLocal(aqui)}.`, classe:'fim', acao:'Exploracao.tela()'});
    const falas = aqui === 'vermilion'
      ? ['A balsa das ilhas sai do fim do porto, depois do cais três, onde o S.S. Anne encosta. É um barco baixo e rápido, de casco branco e cabine azul, que faz a linha inteira: as sete ilhas, de uma ponta à outra.',
         'O barqueiro tem a lista do Torneio das Ilhas pregada na parede da cabine, com o seu nome no meio, e não cobra de quem está nela.']
      : ['O cais da balsa fica na ponta do píer, com a placa das sete ilhas pintada à mão e Vermilion embaixo, do outro lado do mar.',
         'A balsa encosta uma vez por período e faz a linha inteira. Quem não quer descer em cada ilha fica sentado até a sua.'];
    UI.telaConversa({num: aqui === 'vermilion' ? 'Vermilion' : 'Ilhas Sevii', titulo:'O cais da balsa', loc:LOCAIS[aqui].nome,
      falas, botoes, avisos:av});
  },
  embarcar(id){
    const d = Estado.dados, aqui = Mundo.id();
    if (!this.balsaAberta(d) || !PORTOS_DA_BALSA.includes(aqui) || id === aqui || !LOCAIS[id]) return this.balsa();
    const trava = this.portoFechado(id, d);
    if (trava) return this.balsa([{tipo:'info', texto:trava}]);
    const primeira = !Mundo.visitado(id);
    d.local = id;
    Mundo.marcarVisitado(id);
    Mundo.passar(1);
    Estado.registrar(`Pegou a balsa até ${LOCAIS[id].nome}.`);
    Estado.salvar('auto');
    /* a viagem é uma ação: rola o PokéNav, que espera a tela nova */
    Exploracao.toque();
    Exploracao.tela([{tipo:'info', texto: id === 'vermilion'
      ? 'A balsa encosta no fim do porto de Vermilion, do lado dos guindastes, e o cheiro de óleo volta antes do cais.'
      : `A balsa encosta no cais da ${LOCAIS[id].nome}${primeira ? ', e você desce numa ilha onde nunca pisou' : ''}.`}]);
  },

  /* ── Ilha Quatro, entre os Faróis e o armazém: quem viu o barco ── */
  pistaQuatro(){
    const d = Estado.dados;
    Mundo.passar(1);
    const visto = d.flags.sv_sabe_do_armazem;
    UI.telaConversa({num:'Ilhas Sevii', titulo:'O cais do gelo', loc:'Ilha Quatro',
      falas:[
        'O fogareiro está aceso no meio do cais, e os três velhos consertam a mesma rede, cada um de um lado, sem pressa nenhuma.',
        fala('o pescador mais velho', 'Turista não vem pra Ilha Quatro. Turista passa.'),
        fala('o pescador mais velho', visto ? 'Você é {o|a} que foi atrás das motos na Três. Senta.' : 'Mas você tem cara de quem perguntou alguma coisa a alguém. Senta.'),
        'Ele aponta o sul com a agulha de costurar rede.',
        fala('o pescador mais velho', 'Faz três semanas que passa um barco de noite, sem luz nenhuma, descendo pro sul. Sempre perto das duas da manhã. Sempre com o motor baixo, como quem não quer acordar ninguém.'),
        fala('o pescador mais velho', 'Barco sem luz não é de pesca. Pescador acende até lanterna de bolso, porque pescador tem medo de bater.'),
        'O segundo velho fala sem levantar a cabeça da rede.',
        fala('o pescador do meio', 'Encosta na Cinco. Do lado do armazém velho da conserva. Eu vi a sombra dele no telhado de zinco, com a lua por trás.')
      ],
      botoes:[
        {texto:'Agradecer e deixar uma Ração pro fogareiro.', classe:'fim', acao:'Sevii.fimPistaQuatro(true)'},
        {texto:'Agradecer e seguir.', classe:'fim', acao:'Sevii.fimPistaQuatro(false)'}
      ]});
  },
  fimPistaQuatro(deu){
    const d = Estado.dados, av = [];
    Estado.marcar('sv_pista_quatro'); Estado.marcar('sv_viu_o_barco');
    Estado.registrar('Os pescadores da Ilha Quatro viram um barco sem luz descendo pro sul de madrugada, até o armazém da Ilha Cinco.');
    if (deu && (d.itens['Ração'] || 0) > 0){
      Estado.usarItem('Ração');
      av.push({tipo:'item', texto:'Perdeu 1× Ração.'});
      av.push(...Historia.aplicar({npc:{nome:'o pescador mais velho', opiniao:2, memoria:'Você deixou uma Ração no fogareiro do cais.'}, moral:2}));
    }
    av.push({tipo:'mundo', texto:'Um barco sem luz, às duas da manhã, no armazém da Ilha Cinco.'});
    Estado.salvar('auto');
    Exploracao.tela(av);
  },

  /* ── Ilha Seis, entre o armazém e o torneio: a Oona e a Pokébola velha ── */
  pistaSeis(){
    const d = Estado.dados;
    Mundo.passar(1);
    /* quem ouviu o Gideon no navio sabe quem é M. H. */
    const sabe = !!d.flags.sv_conheceu_gideon;
    UI.telaConversa({num:'Ilhas Sevii', titulo:'A Pokébola velha', loc:'Ilha Seis',
      falas:[
        'Ela está sentada no muro de pedra, do lado do Natu que não pisca, com um vestido roxo comprido demais pra muro e uma Pokébola gasta nas duas mãos.',
        fala('Oona', 'Você não é daqui. Ótimo. Quem é daqui já disse que não sabe.'),
        'Ela vira a Pokébola. Na tampa, riscado com ponta de faca, tem duas letras e uma palavra: M. H. — SETE.',
        fala('Oona', 'Alguém deixou isso num túmulo do cume do Monte Pyre, faz dezenove anos. Lá em casa, o que se deixa num túmulo volta pra casa dezenove anos depois. Eu sou quem leva.'),
        fala('Oona', 'Sete eu acho que é a ilha. M. H. eu não sei quem é. Eu perguntei pra metade da Ilha Seis.'),
        sabe ? 'Você lembra do navio: um velho de chapéu de pano contando de uma final perdida, faz mais de cinquenta anos, pra um homem da Ilha Sete.' : 'Você olha as letras. Não querem dizer nada pra você.'
      ],
      botoes:[
        sabe ? {texto:'"Magnus Holm. O Gideon disse que ele é da Ilha Sete."', acao:'Sevii.fimPistaSeis(true)'} : null,
        {texto:'"Eu vou pra Ilha Sete. Se eu ouvir essas letras, eu te aviso."', acao:'Sevii.fimPistaSeis(false)'}
      ].filter(Boolean)});
  },
  fimPistaSeis(sabia){
    const av = [];
    Estado.marcar('sv_pista_seis');
    if (sabia){
      Estado.marcar('sv_oona_ajudou');
      av.push(...Historia.aplicar({npc:{nome:'Oona', opiniao:3, memoria:'Você disse a ela quem era M. H.: Magnus Holm, da Ilha Sete.'}, moral:2,
        registrar:'Disse à Oona, na Ilha Seis, que M. H. era Magnus Holm, da Ilha Sete.'}));
      av.push({tipo:'info', texto:'Ela fecha a mão em volta da Pokébola e olha pro sul, pra Ilha Sete. "Holm." Ela repete o nome baixo, como quem experimenta o peso.'});
    } else {
      av.push(...Historia.aplicar({npc:{nome:'Oona', opiniao:1, memoria:'Você prometeu avisar se ouvisse as letras M. H. na Ilha Sete.'},
        registrar:'Conheceu a Oona na Ilha Seis, com uma Pokébola velha marcada M. H. — SETE.'}));
      av.push({tipo:'info', texto:'Ela concorda com a cabeça, sem acreditar muito, e volta a olhar o horizonte junto com o Natu.'});
    }
    Estado.salvar('auto');
    Exploracao.tela(av);
  },

  /* ── a pousada da arena: quem veio de longe conta da jornada ──
     Cada pessoa senta com você uma vez por dia; a primeira vez conta de
     onde veio, a segunda por que veio, a terceira o que vem depois. */
  presentes(d){
    d = d || Estado.dados;
    return ELENCO_SEVII.filter(f => f.id !== 'magnus' && (f.id !== 'noa' || this.noaInscrita(d)));
  },
  reg(d){ d = d || Estado.dados; return (d.sevii = d.sevii || {conversas:{}, diaConversa:{}}); },
  pousada(av){
    const d = Estado.dados, r = this.reg(d);
    const botoes = this.presentes(d).map(f => {
      const n = r.conversas[f.id] || 0, hoje = r.diaConversa[f.id] === d.relogio.dia;
      return {texto: hoje ? `${f.nome} (de novo amanhã)` : n >= 3 ? `Sentar de novo com ${f.nome}` : `Sentar com ${f.nome}`,
        acao: hoje ? 'Sevii.pousada()' : `Sevii.sentar('${f.id}')`};
    });
    botoes.push({texto:'Sair da pousada.', classe:'fim', acao:'Exploracao.tela()'});
    UI.telaConversa({num:'Ilhas Sevii', titulo:'A pousada da arena', loc:'Ilha Sete',
      falas:['A varanda da pousada dá pro cânion, e de noite cada mesa é de uma região: Johto numa ponta, Hoenn na outra, e no meio quem ainda não decidiu de que lado senta.'],
      botoes, avisos:av});
  },
  sentar(id){
    const d = Estado.dados, r = this.reg(d), f = fichaSevii(id);
    if (!f || r.diaConversa[id] === d.relogio.dia) return this.pousada();
    const n = Math.min(3, (r.conversas[id] || 0) + 1);
    r.conversas[id] = n; r.diaConversa[id] = d.relogio.dia;
    Mundo.passar(1);
    const ele = f.f ? 'ela' : 'ele', Ele = f.f ? 'Ela' : 'Ele';
    const de = f.regiao === 'Ilhas Sevii' ? `${f.de}, aqui mesmo` : `${f.de}, em ${f.regiao}`;
    const falas = n === 1
      ? [`${f.nome} ${f.sobrenome} puxa uma cadeira pra você antes de você pedir. ${Ele} é de ${de}, e conta de lá devagar, de quem não conta isso faz tempo.`]
          .concat(f.jornada)
      : n === 2
      ? [`Na segunda noite ${ele} já guarda o seu lugar. Você pergunta por que ${ele} atravessou o mar pra isso.`, f.porque]
      : [`${f.nome} está na varanda olhando o cânion, e fala sem olhar pra você.`, f.gancho];
    const av = Historia.aplicar({npc:{nome:f.nome, opiniao:1, memoria: n === 1 ? 'Sentou com você na varanda da pousada da Ilha Sete e contou de onde veio.'
      : n === 2 ? 'Contou pra você por que veio pro Torneio das Ilhas.' : 'Contou pra você o que pretende fazer depois das ilhas.'}});
    if (n === 1) Estado.registrar(`${f.nome} ${f.sobrenome}, de ${f.de}, contou da jornada na varanda da pousada da Ilha Sete.`);
    Estado.salvar('auto');
    /* a fala que vem entre aspas no meio da conta é de quem conta */
    UI.telaConversa({num:'A pousada da arena', titulo:`${f.nome} ${f.sobrenome}`, loc:`${f.classe} · ${f.de}`,
      falas, quem:f.nome, avisos:av,
      botoes:[{texto:'Voltar pra varanda.', acao:'Sevii.pousada()'}]});
  }
};

/* rosto de quem fala nos capítulos e não é do elenco */
(function(){
  if (typeof RETRATO_POR_NOME === 'undefined') return;
  for (const [nome, arq] of Object.entries(PESSOAS_DE_SEVII)){
    if (!RETRATO_POR_NOME[nome]) RETRATO_POR_NOME[nome] = 'trainers/' + arq;
    if (typeof NOMES_DA_HISTORIA !== 'undefined') NOMES_DA_HISTORIA.add(nome.replace(/^(Sargento|Sr\.) /, ''));
  }
  /* o primeiro nome dele, que ele diz no armazém, e o da filha do Magnus */
  if (typeof NOMES_DA_HISTORIA !== 'undefined'){ NOMES_DA_HISTORIA.add('Conrad'); NOMES_DA_HISTORIA.add('Mira'); NOMES_DA_HISTORIA.add('Kelp'); }
})();

/* as âncoras dos capítulos das ilhas, do campo `ancora` de cada um */
(function(){
  if (typeof ANCORAS === 'undefined' || typeof CAPITULOS === 'undefined') return;
  for (const c of CAPITULOS) if (c.posJogo && c.ancora) ANCORAS[c.num] = c.ancora;
})();

/* ============================================================
   A NOA — o rival em potencial
   Nasce do capítulo 35 (a moça do cais que você pegou com a Pokébola
   da Esme na mão), em qualquer das três respostas: entregar pra Guarda,
   ajudar ou deixar ir. Te para na saída do 35 e do 36, entra no torneio
   se estiver livre da gangue, e depois do arco fica no fim do cais da
   Ilha Um, uma vez por semana.
   ============================================================ */
if (typeof RIVAIS_EXTRA !== 'undefined') RIVAIS_EXTRA.push({
  id:'noa', nome:'Noa', npc:'Noa', desde:'Ilha Um', caps:[36, 37],
  f:true, formasFixas:true, aceFixo:true,
  origem:'A moça do cais da Ilha Um. Trabalhava pra gangue, e você decidiu o que fazer com ela.',
  gatilho:d => !!d.flags.sv_noa_rival,
  nascimento:'A Noa voltou pro cais. Ela anota o seu nome com faca na madeira da beirada, do lado do nome do pai.',
  pool:[198, 215, 211, 222, 264],             // Murkrow, Sneasel, Qwilfish, Corsola, Linoone
  ace:319, nivelExtra:1, moral:80,           // o Sharpedo, o Dente, que o pai tirou ainda Carvanha da rede
  golpes:['Crunch', 'Surf', 'Ice Beam', 'Shadow Ball'],
  cor:'#2fb5a3',
  gameover:'Você caiu numa luta contra a Noa, no cais da Ilha Um, e a maré levou o resto.',
  arco:(d, r) => {
    if (d.flags.sv_noa_entregue && !d.flags.sv_noa_ajudou) return 'raiva';
    if (d.flags.sv_noa_ajudou) return 'parceira';
    return 'desafio';
  },
  arcos:{
    desafio:{nome:'Desafio', resumo:'Quer ganhar {do Campeão|da Campeã} de Kanto pra provar que é do torneio.'},
    parceira:{nome:'Parceira', resumo:'Você ajudou quando ninguém ajudava. Ela luta pra te agradecer do único jeito que sabe.',
      nivelExtra:2, moral:95},
    raiva:{nome:'Raiva', resumo:'Você entregou ela pra Guarda. Ela saiu, e veio direto atrás de você.',
      nivelExtra:2, moral:70}
  },
  fala:(d, r, arco) => {
    if (arco === 'raiva') return [
      'No fim do caminho tem alguém sentada num poste de amarrar barco, de jaqueta preta grande demais, com um Murkrow no ombro.',
      fala('Noa', r.encontros ? 'De novo eu. Acostuma.' : 'O sargento me soltou de manhã. Disse que eu tinha dezesseis anos e que a ilha precisava de mim mais que a cela.'),
      fala('Noa', 'Eu não vim agradecer. Eu vim te ganhar na frente de todo mundo, e aí a gente fica quite.', 'frio'),
      'Embaixo do píer, na água, uma barbatana escura dá uma volta e para.'
    ];
    if (arco === 'parceira') return [
      'A Noa está te esperando no caminho com dois sanduíches de alga embrulhados em jornal, e te joga um antes de dizer oi.',
      fala('Noa', r.encontros ? `${cap1(porExtenso(r.derrotas))} a ${porExtenso(r.vitorias)}. Eu conto. Você finge que não conta.` : 'Não é favor. Eu fiz dois porque sobrou.'),
      fala('Noa', 'Agora levanta. Eu não aprendo nada te vendo comer.', 'riso'),
      'O Murkrow dela desce do ombro e rouba metade do seu sanduíche. Ela não pede desculpa por ele.'
    ];
    return [
      'Tem alguém sentada no caminho, com o tênis sem cadarço balançando e um Murkrow no ombro que encara você antes dela.',
      fala('Noa', r.encontros ? 'Você de novo. Ótimo. Eu estava com saudade de perder. Não.' : 'O pessoal do cais disse que você é {o Campeão|a Campeã} de Kanto. Eu disse que nunca vi campeão de perto.'),
      fala('Noa', 'Torneio é daqui a pouco. Eu quero saber se eu presto antes, e não depois.'),
      'Ela pula do lugar e cai de pé, e embaixo dela, na água, o Sharpedo sobe pra ver.'
    ];
  },
  vitoria:(d, r, arco) => [
    'O Sharpedo dela afunda devagar, contrariado, e volta só com a barbatana de fora.',
    arco === 'raiva'
      ? fala('Noa', 'Isso não acabou. Isso só ficou mais longe de acabar.', 'frio')
      : fala('Noa', `${cap1(porExtensoF(r.derrotas + 1))} pra você. Eu anoto com faca. Faca não apaga.`),
    'Ela vai embora pelo lado da água, sem olhar pra trás, e o Murkrow olha por ela.'
  ],
  derrota:(d, r, arco) => [
    'O seu último Pokémon cai, e a Noa fica parada um segundo, sem acreditar.',
    fala('Noa', '…eu ganhei. Eu ganhei de você.', null, 'Ela diz isso baixo, primeiro pra ela.'),
    arco === 'parceira'
      ? fala('Noa', 'Levanta. Toma. Agora a gente come o outro sanduíche.', 'riso')
      : fala('Noa', 'Alguém viu isso? Ninguém viu isso. Tudo bem. Eu vi.')
  ]
});
