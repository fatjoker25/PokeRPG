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
  'Poké Ball':   {tipo:'bola', mult:1,   desc:'A bola comum. É o que a Liga entrega e o que todo mundo usa.',
                  sabido:{bola_fraca_em_lendario:'Você já viu uma dessas ricochetear numa coisa grande demais. Não insista.'}},
  'Great Ball':  {tipo:'bola', mult:1.5, desc:'Mais firme que a comum. Custa o triplo e a diferença aparece.',
                  sabido:{bola_fraca_em_lendario:'Firme, mas não o bastante para o que você viu.'}},
  'Ultra Ball':  {tipo:'bola', mult:2,   desc:'Cara. Quem vende fala dela em voz baixa, como se fosse favor.',
                  sabido:{ultra_prende_lendario:'É a única comprável que já prendeu uma coisa daquelas — e mesmo assim, quase nunca.'}},
  'Master Ball': {tipo:'bola', mult:255, desc:'Você não devia ter uma dessas. Quase ninguém devia.',
                  sabido:{master_quase_sempre:'Ela não falha. Você já viu.'}},
  'Potion':      {tipo:'cura', valor:20, desc:'Fecha corte e tira dor. Não faz milagre.'},
  'Super Potion':{tipo:'cura', valor:50, desc:'A mesma coisa, mais forte e mais cara.'},
  'Hyper Potion':{tipo:'cura', valor:120,desc:'Do tipo que hospital usa. Ninguém carrega por acaso.'},
  'Revive':      {tipo:'revive', desc:'Traz de volta quem desmaiou, na metade das forças. Não faz mais que isso.',
                  sabido:{revive_nao_ressuscita:'Quem morreu de verdade não volta com isso. Você aprendeu do jeito ruim.'}},
  'Antidote':    {tipo:'status', cura:'veneno', desc:'Frasco pequeno, gosto horrível, funciona.'},
  'Full Heal':   {tipo:'status', cura:'todos', desc:'Resolve o que o Antidote não resolve, e o resto junto.'},
  'Bandagem':    {tipo:'curaJogador', valor:10, desc:'Pra você, não pra eles. Você também se machuca.'},
  'Ração':       {tipo:'moral', valor:10, desc:'Comida boa de verdade. Muda o humor de quem come.'},
  'Moon Stone':  {tipo:'lembranca', desc:'Morna ao toque, pesada demais para o tamanho, com superfície de vidro fosco.',
                  sabido:{viu_o_circulo:'Trinta e dois ficaram em círculo olhando uma dessas por quarenta minutos.'}},
  'Corda':       {tipo:'ferramenta', desc:'Doze metros. Serve pra mais coisa do que parece e pesa mais do que devia.'},
  'Lanterna':    {tipo:'ferramenta', desc:'Pilha média. A luz amarela antes de acabar, e esse é o único aviso que você tem.'}
};

/* O que o jogador já aprendeu na prática ou porque alguém contou */
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
