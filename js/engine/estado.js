/* ============================================================
   ESTADO — o mundo lembra de tudo
   ============================================================ */
const NIVEIS_BOM = [
  {n:1, nome:'Desconhecido', ef:'Ninguém te conhece.'},
  {n:2, nome:'Familiar',     ef:'Sua cidade te reconhece. Pequenas cortesias.'},
  {n:3, nome:'Reconhecido',  ef:'Descontos, informação de graça, selvagens menos agressivos por perto.'},
  {n:4, nome:'Respeitado',   ef:'NPCs te ouvem antes de agir. Lojas te priorizam.'},
  {n:5, nome:'Famoso',       ef:'Seu nome corre em várias cidades. Convites e rivais.'},
  {n:6, nome:'Admirado',     ef:'Favores sem cobrança. A Liga te consulta. Selvagens fracos fogem de você.'},
  {n:7, nome:'Ídolo Regional', ef:'Cidades te recebem com festa. Cargos oferecidos sem pedir.'},
  {n:8, nome:'Lendário',     ef:'Kanto inteira sabe seu nome. A Liga te trata como autoridade.'}
];
const NIVEIS_RUIM = [
  {n:1, nome:'Desconhecido', ef:'Ninguém te conhece.'},
  {n:2, nome:'Suspeito',     ef:'Olhares desconfiados. Lojistas te observam.'},
  {n:3, nome:'Indesejado',   ef:'NPCs evitam te abordar. Atendimento a contragosto.'},
  {n:4, nome:'Temido',       ef:'Vozes baixam quando você entra. Selvagens atacam primeiro.'},
  {n:5, nome:'Notório',      ef:'NPCs fogem. A Liga manda oficiais "conversar".'},
  {n:6, nome:'Proscrito',    ef:'Banido de cidades. Recompensa por informações sobre você.'},
  {n:7, nome:'Caçado',       ef:'Ordem de detenção ativa. Treinadores da Liga autorizados a te capturar.'},
  {n:8, nome:'Monstro Lendário', ef:'Seu nome é terror. A Elite 4 é mobilizada contra você.'}
];

const CIDADES = ['Pallet','Viridian','Pewter','Cerulean','Vermilion','Lavender','Celadon','Fuchsia','Saffron','Cinnabar','Indigo'];

const ITENS_INFO = {
  /* ─────────── bolas ─────────── */
  'Poké Ball':   {tipo:'bola', mult:1, cat:'Captura',
                  ficha:'Modificador de captura ×1,0 · consumida no arremesso',
                  desc:'A bola comum. É o que a Liga entrega e o que todo mundo usa.',
                  sabido:{bola_fraca_em_lendario:'Você já viu uma dessas ricochetear numa coisa grande demais. Não insista.'}},
  'Great Ball':  {tipo:'bola', mult:1.5, cat:'Captura',
                  ficha:'Modificador de captura ×1,5 · consumida no arremesso',
                  desc:'Mais firme que a comum. Custa o triplo e a diferença aparece.',
                  sabido:{bola_fraca_em_lendario:'Firme, mas não o bastante para o que você viu.'}},
  'Ultra Ball':  {tipo:'bola', mult:2, cat:'Captura',
                  ficha:'Modificador de captura ×2,0 · consumida no arremesso',
                  desc:'Cara. Quem vende fala dela em voz baixa, como se fosse favor.',
                  sabido:{ultra_prende_lendario:'É a única comprável que já prendeu uma coisa daquelas — e mesmo assim, quase nunca.'}},
  'Master Ball': {tipo:'bola', mult:255, cat:'Captura',
                  ficha:'Modificador de captura ×255 · consumida no arremesso',
                  desc:'Você não devia ter uma dessas. Quase ninguém devia.',
                  sabido:{master_quase_sempre:'Ela não falha. Você já viu.'}},

  /* ─────────── cura ─────────── */
  'Potion':      {tipo:'cura', valor:20, cat:'Recuperação',
                  ficha:'+20 HP em um Pokémon · em combate gasta o turno · não age em desmaiado',
                  desc:'Fecha corte e tira dor. Não faz milagre.'},
  'Super Potion':{tipo:'cura', valor:50, cat:'Recuperação',
                  ficha:'+50 HP em um Pokémon · em combate gasta o turno · não age em desmaiado',
                  desc:'A mesma coisa, mais forte e mais cara.'},
  'Hyper Potion':{tipo:'cura', valor:120, cat:'Recuperação',
                  ficha:'+120 HP em um Pokémon · em combate gasta o turno · não age em desmaiado',
                  desc:'Do tipo que hospital usa. Ninguém carrega por acaso.'},
  'Água Fresca': {tipo:'cura', valor:35, cat:'Recuperação',
                  ficha:'+35 HP em um Pokémon · em combate gasta o turno',
                  desc:'Garrafa de máquina. Funciona melhor que devia, e ninguém sabe explicar.'},
  'Revive':      {tipo:'revive', cat:'Recuperação',
                  ficha:'Levanta um Pokémon desmaiado com HP máximo ÷ 2 · não age em morto',
                  desc:'Traz de volta quem desmaiou, na metade das forças. Não faz mais que isso.',
                  sabido:{revive_nao_ressuscita:'Quem morreu de verdade não volta com isso. Você aprendeu do jeito ruim.'}},
  'Antidote':    {tipo:'status', cura:'veneno', cat:'Recuperação',
                  ficha:'Remove veneno · 1 alvo',
                  desc:'Frasco pequeno, gosto horrível, funciona.'},
  'Full Heal':   {tipo:'status', cura:'todos', cat:'Recuperação',
                  ficha:'Remove qualquer condição (veneno, queimadura, paralisia, sono, confusão) · 1 alvo',
                  desc:'Resolve o que o Antidote não resolve, e o resto junto.'},
  'Éter':        {tipo:'pp', valor:10, cat:'Recuperação',
                  ficha:'+10 PP no primeiro golpe incompleto do alvo',
                  desc:'Frasco pequeno. Repõe o que um golpe gastou.'},
  'Elixir':      {tipo:'ppTodos', valor:10, cat:'Recuperação',
                  ficha:'+10 PP em todos os golpes do alvo',
                  desc:'Repõe um pouco de tudo. Caro pelo que é.'},
  'Bandagem':    {tipo:'curaJogador', valor:10, cat:'Treinador',
                  ficha:'+10 HP no treinador · o HP do treinador não regenera sozinho',
                  desc:'Pra você, não pra eles. Você também se machuca.'},
  'Cantil':      {tipo:'curaJogador', valor:16, cat:'Treinador',
                  ficha:'+16 HP no treinador · uso único',
                  desc:'Cheio. Você vai esvaziar num lugar em que não tem onde encher.'},
  'Ração':       {tipo:'moral', valor:10, cat:'Vínculo',
                  ficha:'+10 de moral em um Pokémon (escala 0–100) · moral baixa causa desobediência',
                  desc:'Comida boa de verdade. Muda o humor de quem come.'},

  /* ─────────── campo ─────────── */
  'Boneco':      {tipo:'fuga', cat:'Campo',
                  ficha:'Fuga garantida de encontro selvagem · não funciona contra treinador',
                  desc:'Um boneco de pano com cara de Substitute. Serve pra jogar e sair andando.'},
  'Repelente':   {tipo:'repelente', valor:3, cat:'Campo',
                  ficha:'Nenhum encontro ao procurar por 3 períodos',
                  desc:'Cheiro forte, dura uns três períodos. O mato fica mais quieto em volta.'},

  /* ─────────── pedras ─────────── */
  'Moon Stone':      {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Nidorina, Nidorino, Clefairy e Jigglypuff · consumida no uso',
                      desc:'Morna ao toque, pesada demais para o tamanho, com superfície de vidro fosco.',
                      sabido:{viu_o_circulo:'Trinta e dois ficaram em círculo olhando uma dessas por quarenta minutos.',
                              usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra do Fogo':   {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Vulpix, Growlithe e Eevee (→ Flareon) · consumida no uso',
                      desc:'Alaranjada, com um ponto de luz no meio que não vem de lugar nenhum.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra da Água':   {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Poliwhirl, Shellder, Staryu e Eevee (→ Vaporeon) · consumida no uso',
                      desc:'Azul-escura. Fria mesmo depois de horas no bolso.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra do Trovão': {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Pikachu e Eevee (→ Jolteon) · consumida no uso',
                      desc:'Amarela, com estática. Ela levanta o pelo do seu braço de dez centímetros.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra da Folha':  {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Gloom, Weepinbell e Exeggcute · consumida no uso',
                      desc:'Verde e lascada como pedra de rio. Cheira a mato cortado.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},

  /* ─────────── segurados ─────────── */
  'Resto de Ração':  {tipo:'equipar', cat:'Segurado', efeito:{regen:0.07},
                      ficha:'SEGURADO · recupera 7% do HP máximo no fim de cada turno',
                      desc:'Um saquinho amarrado no cinto com o que sobra da ração boa. Some devagar.'},
  'Faixa Firme':     {tipo:'equipar', cat:'Segurado', efeito:{aguenta:true},
                      ficha:'SEGURADO · uma vez por combate, sobrevive a um golpe fatal com 1 HP',
                      desc:'Faixa de algodão grossa amarrada no punho ou na pata. Não protege de nada. Aperta.'},
  'Punho de Ferro':  {tipo:'equipar', cat:'Segurado', efeito:{fis:1.15},
                      ficha:'SEGURADO · +15% de dano em golpes físicos',
                      desc:'Um peso de chumbo costurado numa tira de couro. Pesa e cansa e funciona.'},
  'Óculos Grossos':  {tipo:'equipar', cat:'Segurado', efeito:{esp:1.15},
                      ficha:'SEGURADO · +15% de dano em golpes especiais',
                      desc:'Lente de vidro grosso numa armação torta. Foi de alguém.'},
  'Colete de Couro': {tipo:'equipar', cat:'Segurado', efeito:{defesa:0.88},
                      ficha:'SEGURADO · −12% de dano recebido',
                      desc:'Couro rachado, fivela de metal, remendo nas costas. Já levou pancada por outro.'},
  'Botina Leve':     {tipo:'equipar', cat:'Segurado', efeito:{vel:1.12},
                      ficha:'SEGURADO · +12% de Velocidade para a ordem dos turnos',
                      desc:'Sola fina, quase gasta. Quem usa isso não planeja apanhar.'},
  'Sino Calmante':   {tipo:'equipar', cat:'Segurado', efeito:{moral:3},
                      ficha:'SEGURADO · +3 de moral ao fim de cada combate',
                      desc:'Um sino de latão do tamanho de uma unha. O som é ridículo e acalma.'},
  'Amuleto de Moeda':{tipo:'equipar', cat:'Segurado', efeito:{dinheiro:1.5},
                      ficha:'SEGURADO · +50% de dinheiro em vitórias contra treinador',
                      desc:'Moeda antiga furada e pendurada num barbante. Não vale nada como moeda.'},

  /* ─────────── ferramenta ─────────── */
  'Corda':          {tipo:'ferramenta', cat:'Ferramenta', ficha:'12 m · usada em cenas de escalada, descida e resgate',
                     desc:'Doze metros. Serve pra mais coisa do que parece e pesa mais do que devia.'},
  'Lanterna':       {tipo:'ferramenta', cat:'Ferramenta', ficha:'Pilha média · usada em caverna, porão e área sem luz',
                     desc:'Pilha média. A luz amarela antes de acabar, e esse é o único aviso que você tem.'},
  'Pilha':          {tipo:'ferramenta', cat:'Ferramenta', ficha:'Par · repõe a carga da Lanterna',
                     desc:'Duas, embaladas. Você vai lembrar delas exatamente quando não tiver.'},
  'Máscara de pó':  {tipo:'ferramenta', cat:'Ferramenta', ficha:'Evita dano de poeira em pedreira e caverna seca',
                     desc:'De pedreira. Não é bonita e é a diferença entre tossir uma semana ou não.'},
  'Bota de borracha':{tipo:'ferramenta', cat:'Ferramenta', ficha:'Isola choque em área com cabo energizado',
                     desc:'Cano alto, solado grosso. Quem trabalha com cabo não pisa em chão molhado sem isso.'},
  'Cobertor térmico':{tipo:'ferramenta', cat:'Ferramenta', ficha:'Evita dano de frio em área congelada e acampamento noturno',
                     desc:'Dobra do tamanho de um livro. Prateado dos dois lados, e mais quente do que parece possível.'},
  'Câmera descartável':{tipo:'ferramenta', cat:'Ferramenta', ficha:'24 poses · registra prova em cenas de documentação · consumida no uso',
                     desc:'Vinte e quatro poses. Revelar custa mais que a câmera.'},
  'Caderno de campo':{tipo:'ferramenta', cat:'Ferramenta', ficha:'Permite copiar documento e anotar número de processo em cena',
                     desc:'Capa dura, elástico, papel que aguenta sereno. É o que gente séria usa.'},
  'Isca':           {tipo:'ferramenta', cat:'Ferramenta', ficha:'+20 pontos percentuais de chance ao pescar · consumida no uso',
                     desc:'Massa de farinha e coisa que cheira mal. Quem pesca sério faz a própria.'},
  'Mapa de Kanto':  {tipo:'ferramenta', cat:'Ferramenta', ficha:'Mostra o destino do próximo arco na bússola da tela de mundo',
                     desc:'Dobrado em dezesseis. As estradas estão certas e os tempos estão otimistas.'}
};

/* Pedra → pares de evolução (só espécies de nivelEvo 0) */
const PEDRAS = {
  'Pedra do Fogo':   {37:38, 58:59, 133:136},
  'Pedra da Água':   {61:62, 90:91, 120:121, 133:134},
  'Pedra do Trovão': {25:26, 133:135},
  'Pedra da Folha':  {44:45, 70:71, 102:103},
  'Moon Stone':      {30:31, 33:34, 35:36, 39:40}
};

/* Evoluções que só acontecem numa troca */
const EVO_TROCA = {64:65, 67:68, 75:76, 93:94};

/* O que o jogador já aprendeu na prática ou porque alguém contou */
function fichaItem(nome){
  const i = ITENS_INFO[nome];
  return i && i.ficha ? i.ficha : '';
}
function categoriaItem(nome){
  const i = ITENS_INFO[nome];
  return i && i.cat ? i.cat : 'Outro';
}
function efeitoSegurado(p){
  if (!p || !p.segurando) return null;
  const i = ITENS_INFO[p.segurando];
  return (i && i.tipo === 'equipar') ? (i.efeito || {}) : null;
}

function descricaoItem(nome){
  const i = ITENS_INFO[nome];
  if (!i) return '';
  let d = i.desc;
  for (const [flag, extra] of Object.entries(i.sabido || {})){
    if (Estado.dados && Estado.dados.flags && Estado.dados.flags[flag]) d += ' ' + extra;
  }
  return d;
}

const Estado = {
  dados: null,

  novo(ficha){
    const resistencia = 1;
    this.dados = {
      versao: 1,
      criadoEm: Date.now(),
      jogador: {
        nome: ficha.nome,
        genero: ficha.genero,
        aparencia: ficha.aparencia,
        personalidade: ficha.personalidade,
        vestimenta: ficha.vestimenta,
        cidade: ficha.cidade,
        objetivo: ficha.objetivo,
        idade: 15,
        hp: 30, hpMax: 30,
        status: {forca:1, percepcao:1, intelecto:1, carisma:1, sorte:1, resistencia:1},
        pontos: 0,
        dinheiro: 3000,
        cargo: null,
        ferimentos: []
      },
      reputacao: {eixo:'bom', bom:1, ruim:1, historico:[]},
      time: [],
      pc: [],                 // Pokémon depositados
      cemiterio: [],          // mortes permanentes — nunca some
      itens: {},              // a mochila começa vazia: tudo se recebe ou se compra
      insignias: [],
      capitulo: 0,
      cena: null,
      modo: 'cena',
      local: 'pallet',
      visitados: {},
      descobertas: {},
      pokedex: {vistos:{}, catalogados:{}},
      flags: {},
      npcs: {},               // memória: {nome:{conhece:true, opiniao:n, viuVoce:'...'}}
      lendarios: {},          // {dex:{estado:'livre|capturado|solto|morto', disposicao:'neutro|hostil|passivo|desconfiado', encontros:n}}
      liga: {avisos:0, ordemDevolucao:false, detencao:false},
      mundo: {clima:'normal', instabilidade:0, eventos:[]},
      config: {danoMult:1, ritmo:'fiel'},   // 'fiel' = 1d10×(poder÷10) puro
      via: 'neutro',          // heroi | mercenario | foragido | pesquisador
      viaAnterior: null,
      finaisVistos: [],
      log: [],
      relogio: {dia:1, periodo:'manhã'}
    };
    return this.dados;
  },

  get j(){ return this.dados.jogador; },
  get rep(){ return this.dados.reputacao; },

  /* ---------- REPUTAÇÃO ---------- */
  nivelRep(){
    const r = this.rep;
    return r.eixo === 'bom' ? NIVEIS_BOM[r.bom-1] : NIVEIS_RUIM[r.ruim-1];
  },
  nomeRep(){ return this.nivelRep().nome; },

  mudarRep(eixo, delta, motivo){
    const r = this.rep;
    if (delta === 0) return null;
    const antes = this.nomeRep();

    if (eixo === 'bom'){
      if (r.eixo === 'ruim' && r.ruim > 1){
        // ações boas primeiro lavam o eixo ruim
        r.ruim = Math.max(1, r.ruim - delta);
        if (r.ruim === 1){ r.eixo = 'bom'; r.bom = Math.max(r.bom, 2); }
      } else {
        r.eixo = 'bom';
        r.bom = Math.min(8, r.bom + delta);
      }
    } else {
      if (r.eixo === 'bom' && r.bom > 1){
        r.bom = Math.max(1, r.bom - delta);
        if (r.bom === 1){ r.eixo = 'ruim'; r.ruim = Math.max(r.ruim, 2); }
      } else {
        r.eixo = 'ruim';
        r.ruim = Math.min(8, r.ruim + delta);
      }
    }
    const depois = this.nomeRep();
    r.historico.push({motivo, eixo, delta, de:antes, para:depois, cap:this.dados.capitulo});
    this.registrar(`Reputação: ${antes} → ${depois} (${motivo})`);
    return {de:antes, para:depois, mudou:antes !== depois};
  },

  /* ---------- MEMÓRIA ---------- */
  registrar(texto){
    this.dados.log.push({cap:this.dados.capitulo, texto, dia:this.dados.relogio.dia});
    if (this.dados.log.length > 400) this.dados.log.shift();
  },
  marcar(flag, valor=true){ this.dados.flags[flag] = valor; },
  tem(flag){ return !!this.dados.flags[flag]; },

  lembrarNPC(nome, dados){
    const n = this.dados.npcs[nome] || {nome, opiniao:0, memorias:[]};
    Object.assign(n, dados);
    if (dados.memoria){ n.memorias.push({cap:this.dados.capitulo, texto:dados.memoria}); delete n.memoria; }
    this.dados.npcs[nome] = n;
    return n;
  },
  npc(nome){ return this.dados.npcs[nome] || null; },

  /* ---------- TIME ---------- */
  adicionar(p){
    if (this.dados.time.length < 6){ this.dados.time.push(p); return 'time'; }
    this.dados.pc.push(p); return 'pc';
  },
  removerDoTime(uid){
    const i = this.dados.time.findIndex(p => p.uid === uid);
    if (i >= 0) return this.dados.time.splice(i,1)[0];
    return null;
  },
  matar(p, causa){
    p.morto = true;
    p.hp = 0;
    p.causaMorte = causa;
    p.morreuNoCap = this.dados.capitulo;
    this.removerDoTime(p.uid);
    this.dados.cemiterio.push(p);
    this.registrar(`${nomeExib(p)} morreu. Causa: ${causa}`);
  },
  timeVivo(){ return this.dados.time.filter(p => estaVivo(p)); },
  primeiroApto(){ return this.dados.time.find(p => estaVivo(p)) || null; },

  /* ---------- ITENS ---------- */
  darItem(nome, qtd=1){ this.dados.itens[nome] = (this.dados.itens[nome]||0) + qtd; },
  usarItem(nome){
    if (!this.dados.itens[nome]) return false;
    this.dados.itens[nome]--;
    if (this.dados.itens[nome] <= 0) delete this.dados.itens[nome];
    return true;
  },
  contaItem(nome){ return this.dados.itens[nome] || 0; },

  /* ---------- ITEM SEGURADO ---------- */
  equipar(uid, nome){
    const p = this.dados.time.find(x => x.uid === uid);
    if (!p || !this.contaItem(nome)) return null;
    const info = ITENS_INFO[nome];
    if (!info || info.tipo !== 'equipar') return null;
    if (p.segurando) this.darItem(p.segurando, 1);   // devolve o anterior à mochila
    this.usarItem(nome);
    p.segurando = nome;
    p.faixaUsada = false;
    this.registrar(`${nomeExib(p)} passou a segurar ${nome}.`);
    return p;
  },
  desequipar(uid){
    const p = this.dados.time.find(x => x.uid === uid);
    if (!p || !p.segurando) return null;
    const nome = p.segurando;
    this.darItem(nome, 1);
    p.segurando = null;
    p.faixaUsada = false;
    this.registrar(`${nomeExib(p)} devolveu ${nome} à mochila.`);
    return p;
  },

  /* ---------- NATUREZA: só se sabe com convivência ---------- */
  revelarNatureza(p, motivo){
    if (!p || p.naturezaVista) return false;
    p.naturezaVista = true;
    this.registrar(`Você entendeu o jeito de ${nomeExib(p)}: ${p.natureza}.${motivo ? ' ('+motivo+')' : ''}`);
    return true;
  },
  /* chamada no fim de cada combate: convivência + Percepção */
  tickNatureza(){
    const avisos = [];
    (this.dados.time || []).forEach(p => {
      if (p.naturezaVista || p.morto) return;
      p.convivencia = (p.convivencia || 0) + 1;
      if (p.convivencia < 3) return;
      const t = Dados.teste(this.j.status.percepcao + Math.floor(p.convivencia / 3), 7, 'Percepção');
      if (t.grau === 'sucesso' || t.grau === 'critico'){
        p.naturezaVista = true;
        this.registrar(`Natureza de ${nomeExib(p)} percebida: ${p.natureza}.`);
        avisos.push({tipo:'natureza', texto:`Você finalmente entende o jeito de ${nomeExib(p)}. É ${p.natureza}: ${(NATUREZAS[p.natureza]||{}).traco || 'difícil de descrever.'}`});
      }
    });
    return avisos;
  },

  /* ---------- JOGADOR ---------- */
  hpMaxJogador(){ return 30 + (this.j.status.resistencia - 1) * 2; },
  ferir(qtd, causa){
    this.j.hp = Math.max(0, this.j.hp - qtd);
    if (causa) this.j.ferimentos.push({causa, qtd, cap:this.dados.capitulo});
    this.registrar(`Você sofreu ${qtd} de dano (${causa||'?'}). HP: ${this.j.hp}/${this.hpMaxJogador()}`);
    return this.j.hp <= 0;
  },
  curarJogador(qtd){
    this.j.hp = Math.min(this.hpMaxJogador(), this.j.hp + qtd);
  },
  subirStatus(chave){
    const st = this.j.status;
    if (st[chave] >= 10) return false;
    st[chave]++;
    if (chave === 'resistencia') this.j.hp += 2;
    return true;
  },

  /* ---------- POKÉDEX ---------- */
  pdex(){
    const d = this.dados;
    if (!d.pokedex) d.pokedex = {vistos:{}, catalogados:{}};
    return d.pokedex;
  },
  viu(dex){
    if (!this.dados.flags.tem_pokedex) return false;
    const p = this.pdex();
    if (p.vistos[dex]) return false;
    p.vistos[dex] = true;
    return true;
  },
  catalogou(dex){
    if (!this.dados.flags.tem_pokedex) return false;
    const p = this.pdex();
    p.vistos[dex] = true;
    if (p.catalogados[dex]) return false;
    p.catalogados[dex] = true;
    this.registrar(`Pokédex: ${DEX[dex].nome} catalogado.`);
    return true;
  },
  conheceu(dex){ return !!this.pdex().catalogados[dex]; },
  contagemDex(){
    const p = this.pdex();
    return {vistos:Object.keys(p.vistos).length, catalogados:Object.keys(p.catalogados).length};
  },

  /* ---------- LENDÁRIOS ---------- */
  lend(dex){
    if (!this.dados.lendarios[dex]){
      this.dados.lendarios[dex] = {dex, estado:'livre', disposicao:'neutro', encontros:0, ataquesSofridos:0};
    }
    return this.dados.lendarios[dex];
  },
  lendariosCapturados(){
    return Object.values(this.dados.lendarios).filter(l => l.estado === 'capturado');
  },

  /* Manter lendário preso pesa com o tempo. Chamado ao fim de cada capítulo. */
  tickLendarios(){
    const avisos = [];
    const presos = this.lendariosCapturados();
    for (const L of presos){
      L.turnosPreso = (L.turnosPreso || 0) + 1;
      // segredo tem prazo de validade
      if (this.tem('lendario_oculto_' + L.dex) && L.turnosPreso >= 2){
        this.marcar('lendario_oculto_' + L.dex, false);
        this.marcar('captura_vista_' + L.dex);
        avisos.push(`Alguém falou. A captura de ${DEX[L.dex].nome} deixou de ser segredo.`);
        this.mudarRep('ruim', 2, `Descobriram ${DEX[L.dex].nome} com você`);
        this.dados.liga.avisos++;
      } else if (L.turnosPreso % 2 === 0){
        avisos.push(`${DEX[L.dex].nome} continua na sua bola. O mundo continua pagando por isso.`);
        this.mudarRep('ruim', 1, `Mantém ${DEX[L.dex].nome} em cativeiro`);
        this.dados.mundo.instabilidade++;
      }
      // o próprio lendário tenta fugir
      const p = [...this.dados.time, ...this.dados.pc].find(x => x.dex === L.dex);
      if (p && p.moral < 30 && Dados.chance(15)){
        avisos.push(`${DEX[L.dex].nome} rompeu a bola durante a noite e sumiu. Não deixou nada.`);
        this.removerDoTime(p.uid);
        const i = this.dados.pc.findIndex(x => x.uid === p.uid);
        if (i >= 0) this.dados.pc.splice(i,1);
        L.estado = 'livre';
        L.disposicao = 'hostil';
      }
    }
    return avisos;
  },

  /* ---------- SAVE / LOAD ---------- */
  salvar(slot='auto'){
    try {
      localStorage.setItem('pokerpg_save_' + slot, JSON.stringify(this.dados));
      return true;
    } catch(e){ return false; }
  },
  carregar(slot='auto'){
    try {
      const raw = localStorage.getItem('pokerpg_save_' + slot);
      if (!raw) return false;
      this.dados = JSON.parse(raw);
      return true;
    } catch(e){ return false; }
  },
  existeSave(slot='auto'){
    try { return !!localStorage.getItem('pokerpg_save_' + slot); } catch(e){ return false; }
  },
  apagarSave(slot='auto'){
    try { localStorage.removeItem('pokerpg_save_' + slot); } catch(e){}
  },

  /* ---------- CÓDICE DE FINAIS (sobrevive entre partidas) ---------- */
  registrarFinal(id, titulo){
    try {
      const raw = localStorage.getItem('pokerpg_finais');
      const lista = raw ? JSON.parse(raw) : [];
      if (!lista.find(f => f.id === id)){
        lista.push({id, titulo, quando: Date.now()});
        localStorage.setItem('pokerpg_finais', JSON.stringify(lista));
      }
      return lista;
    } catch(e){ return []; }
  },
  finaisDescobertos(){
    try { const raw = localStorage.getItem('pokerpg_finais'); return raw ? JSON.parse(raw) : []; }
    catch(e){ return []; }
  }
};
