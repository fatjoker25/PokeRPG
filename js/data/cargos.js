/* ============================================================
   CARGOS — Kanto tem postos, e posto é papel assinado.

   Cada um muda alguma coisa concreta: o que você paga, o que
   você recebe todo capítulo, onde você entra. Uns se pegam no
   segundo capítulo; outros só depois de oito insígnias, e um
   deles só depois de sentar na cadeira.

   `veta` é quem não pode andar junto: crachá da Liga e crachá
   da Rocket não cabem no mesmo bolso.
   ============================================================ */
const CARGOS = [
{
  id:'treinador', falante:'a atendente', nome:'{Treinador licenciado|Treinadora licenciada}', orgao:'Liga Pokémon', peso:1, cap:1,
  requer:d=>!!d.flags.tem_licenca,
  resumo:'A licença anual. Sem ela você é uma pessoa andando com um bicho.',
  beneficios:{centro:true},
  fala:['A licença é uma folha plastificada com a sua foto ruim e um número de oito dígitos.',
        '"Atendimento sem custo em qualquer Centro de Kanto", diz a atendente, batendo o carimbo. "É o que ela serve, e é bastante."']
},
{
  id:'auxiliar', nome:'Auxiliar de campo', orgao:'Laboratório de Pallet', peso:1, cap:2,
  requer:d=>Estado.contagemDex().catalogados >= 20,
  resumo:'Quem anda com a Pokédex ligada e manda o que vê de volta.',
  beneficios:{loja:0.92, status:'percepcao'},
  fala:['O crachá chega pelo correio da perua, dentro de um envelope pardo com o seu nome escrito à mão.',
        '"Vinte espécies", diz o bilhete junto. "Continua mandando. — Oak."',
        'Tem um desconto de convênio que funciona em qualquer loja de Kanto e que ninguém nunca explicou direito.']
},
{
  id:'guarda_rota', falante:'o sargento', nome:'Guarda de rota', orgao:'Patrulha de Kanto', peso:2, cap:5,
  requer:d=>d.reputacao.eixo === 'bom' && d.reputacao.bom >= 2
         && d.insignias.filter(i=>i!=='Título de Campeão').length >= 2,
  veta:['rocket'],
  resumo:'Voluntário fardado de meio período. Abre guarita e fecha mato.',
  beneficios:{renda:500, guarita:true},
  fala:['Não é emprego. É um colete refletivo, um apito e um número de registro.',
        '"O colete não te dá autoridade nenhuma", explica o sargento, entregando o colete. "Ele dá passagem. As duas coisas se parecem e não são a mesma."',
        'Quinhentos por capítulo, pago em dinheiro, sem recibo.']
},
{
  id:'criador', falante:'a avaliadora', nome:'{Criador registrado|Criadora registrada}', orgao:'Associação de Criadores', peso:2, cap:6,
  requer:d=>d.time.length >= 4 && d.time.filter(p=>!p.morto).every(p=>(p.moral||0) >= 70),
  resumo:'Quem é avaliado pelo time que leva, não pelo que ganha.',
  beneficios:{loja:0.95, moral:3},
  fala:['A avaliação dura quarenta minutos e nenhum deles é sobre batalha.',
        '"Eu olho pata, pelagem, peso e o jeito que ele olha pra você quando você não está olhando", diz a avaliadora.',
        '"Passou. E não é todo mundo que passa, então não faz essa cara de quem já sabia."']
},
{
  id:'reporter', falante:'a editora', nome:'Repórter {credenciado|credenciada}', orgao:'Jornal de Fuchsia', peso:2, cap:7,
  requer:d=>Object.keys(d.descobertas || {}).length >= 40,
  resumo:'Crachá de imprensa. Entra onde tem fila e sai com o nome anotado.',
  beneficios:{renda:400, status:'intelecto', fila:true},
  fala:['"Você anda mais que meus repórteres e vê mais que meus repórteres", diz a editora, sem levantar os olhos.',
        '"Isso aqui não te dá razão. Te dá acesso. O que você faz com acesso é problema seu e vira problema meu."',
        'O crachá é de papel laminado e vence em um ano.']
},
{
  id:'rocket', falante:'a voz do outro lado', nome:'Informante', orgao:'sem timbre', peso:3, cap:8,
  requer:d=>d.reputacao.eixo === 'ruim' && d.reputacao.ruim >= 3,
  veta:['guarda_rota','investigador','comissao','instrutor','lider','elite','professor','conselheiro'],
  resumo:'Ninguém assina nada. O dinheiro chega e as perguntas não.',
  beneficios:{renda:1200, loja:0.75, repRuim:1},
  fala:['Não tem crachá, não tem contrato e não tem aperto de mão.',
        'Tem um envelope no armário 14 do Centro de Vermilion toda vez que vira o mês, e tem uma lista de coisas que você não pergunta.',
        '"Você já fez de graça", diz a voz do outro lado. "A gente só está formalizando o que já era."'],
  aviso:'Enquanto você carregar isso, a sua reputação piora sozinha todo capítulo.'
},
{
  id:'investigador', falante:'a auditora', nome:'{Investigador|Investigadora} de campo', orgao:'Auditoria da Liga', peso:3, cap:10,
  requer:d=>d.reputacao.eixo === 'bom' && d.reputacao.bom >= 4
         && d.insignias.filter(i=>i!=='Título de Campeão').length >= 4,
  veta:['rocket'],
  resumo:'Quem entra nos lugares e depois escreve o que viu.',
  beneficios:{renda:900, centro:true, status:'carisma', guarita:true},
  fala:['A credencial é azul-escura e tem um número de processo em vez de cargo.',
        '"Você não manda em ninguém", avisa a auditora. "Você pergunta, e a diferença entre perguntar com crachá e perguntar sem é a única coisa que eu te dou."',
        '"Use com vergonha. Quem usa sem vergonha eu cancelo em seis meses."']
},
{
  id:'pesquisador', falante:'Professor Oak', nome:'{Pesquisador associado|Pesquisadora associada}', orgao:'Laboratório de Pallet', peso:3, cap:12,
  requer:d=>Estado.contagemDex().catalogados >= 90,
  resumo:'Noventa espécies andando. Ninguém faz isso de carro.',
  beneficios:{loja:0.85, status:'intelecto', renda:600},
  fala:['"Noventa", diz o Professor no telefone, e dá pra ouvir ele conferindo a lista com o dedo.',
        '"Eu tenho gente de jaleco que faz sessenta em dez anos. Você fez noventa andando, comendo mal e dormindo em acostamento."',
        '"Então eu vou pedir uma bolsa pra você e ela vai ser pequena, porque bolsa é sempre pequena."']
},
{
  id:'comissao', falante:'a secretária', nome:'{Perito|Perita} da Comissão', orgao:'Comissão de Gestão de Risco', peso:4, cap:16,
  requer:d=>d.insignias.filter(i=>i!=='Título de Campeão').length >= 6
         && ['heroi','pesquisador'].includes(d.via || 'neutro'),
  veta:['rocket'],
  resumo:'Assento na sala onde a regra é escrita. Sem voto, mas com ata.',
  beneficios:{renda:1500, centro:true, guarita:true},
  fala:['"Perito não vota", explica a secretária, já entregando a pasta. "Perito fala antes da votação."',
        '"Na prática, quem fala antes da votação decide a votação em oito de dez casos. Na prática."',
        'A pasta tem trinta e uma páginas e a primeira é um termo de sigilo.']
},
{
  id:'instrutor', falante:'o coordenador', nome:'{Instrutor|Instrutora} do Planalto', orgao:'Liga Pokémon', peso:4, cap:20,
  requer:d=>d.insignias.filter(i=>i!=='Título de Campeão').length >= 8,
  veta:['rocket'],
  resumo:'Ensina quem chega. Salário, sala e um crachá que abre tudo do Planalto.',
  beneficios:{renda:2000, centro:true, semEspera:true, moral:2},
  fala:['A sala é pequena, tem janela pro corredor e não pro vale, e é sua.',
        '"Você vai receber gente que apanhou em oito ginásios e acha que o problema é o time", diz o coordenador.',
        '"Quase nunca é o time."']
},
{
  id:'lider', falante:'a conselheira', nome:'Líder de ginásio', orgao:'Liga Pokémon', peso:5, cap:24,
  requer:d=>d.insignias.filter(i=>i!=='Título de Campeão').length >= 8
         && d.reputacao.eixo === 'bom' && d.reputacao.bom >= 5,
  veta:['rocket'],
  resumo:'Uma cidade, uma porta e uma insígnia que passa a ser sua de dar.',
  beneficios:{renda:3000, centro:true, loja:0.9, semEspera:true},
  fala:['O convite chega num papel timbrado que pesa mais que papel devia pesar.',
        '"Ginásio não é prêmio por ser forte", diz a conselheira. "É um posto de trabalho com horário fixo e uma criança chorando na sua sala toda quinta."',
        '"Pensa bem. E depois assina, porque a gente precisa."']
},
{
  id:'elite', falante:'quem estava na porta antes de você', nome:'Elite dos Quatro', orgao:'Planalto Indigo', peso:5, cap:27,
  requer:d=>!!d.flags.campeao_de_kanto || !!d.flags.venceu_a_elite,
  veta:['rocket'],
  resumo:'Uma das quatro portas. Você passa a ser a parede de alguém.',
  beneficios:{renda:5000, centro:true, semEspera:true},
  fala:['Os quatro nomes estão nas portas desde sempre e um deles agora é o seu, impresso na mesma fonte dos outros três.',
        '"A parte difícil não é ganhar", diz quem estava na porta antes de você. "É ganhar de gente que treinou um ano pra te enfrentar e ver a cara delas depois."']
},
{
  id:'professor', falante:'Professor Oak', nome:'{Professor|Professora} de Kanto', orgao:'rede de laboratórios', peso:5, cap:27,
  requer:d=>Estado.contagemDex().catalogados >= 140,
  veta:['rocket'],
  resumo:'A cadeira que entrega bola pra quem está saindo de casa.',
  beneficios:{renda:4000, loja:0.8, centro:true},
  fala:['"Cento e quarenta", diz o Professor, e não completa a frase por uns bons cinco segundos.',
        '"Eu levei trinta e um anos. Você levou uma jornada."',
        '"Tem uma cadeira aqui que não é minha, é do cargo, e o cargo precisa de gente que ainda ande."']
},
{
  id:'conselheiro', falante:'a conselheira mais velha', nome:'{Conselheiro|Conselheira} de Kanto', orgao:'Conselho Regional', peso:5, cap:28,
  requer:d=>d.reputacao.eixo === 'bom' && d.reputacao.bom >= 6
         && (!!d.flags.campeao_de_kanto || !!d.flags.oito_insignias),
  veta:['rocket'],
  resumo:'Onde a regra é escrita. Não é o lugar mais forte de Kanto, é o mais lento.',
  beneficios:{renda:2500, centro:true, loja:0.9, lei:true},
  fala:['A cadeira é de madeira, desconfortável de propósito, e tem uma plaquinha de latão com o nome de quem sentou antes.',
        '"Aqui dentro nada acontece em menos de dois anos", avisa a conselheira mais velha.',
        '"E quando acontece, acontece pra todo mundo de uma vez. É esse o troco pela lentidão."']
}
];

/* ============================================================
   O MOTOR
   ============================================================ */
const Cargos = {
  /* antes de existir jogo, não existe cargo — e ninguém pode explodir por isso */
  lista(){
    if (typeof Estado === 'undefined' || !Estado.dados) return [];
    return Estado.dados.cargos || (Estado.dados.cargos = []);
  },
  tem(id){ return this.lista().indexOf(id) !== -1; },
  porId(id){ return CARGOS.find(c => c.id === id) || null; },

  /* o título que aparece no cartão: o de maior peso */
  principal(){
    let melhor = null;
    for (const id of this.lista()){
      const c = this.porId(id);
      if (c && (!melhor || c.peso > melhor.peso)) melhor = c;
    }
    return melhor;
  },

  /* quem te veta: crachá da Liga e envelope sem timbre não cabem juntos */
  vetadoPor(id){
    for (const outro of this.lista()){
      const c = this.porId(outro);
      if (c && (c.veta || []).indexOf(id) !== -1) return c;
      const alvo = this.porId(id);
      if (alvo && (alvo.veta || []).indexOf(outro) !== -1) return c;
    }
    return null;
  },

  estado(id){
    const c = this.porId(id);
    const d = (typeof Estado !== 'undefined') ? Estado.dados : null;
    if (!c) return {ok:false, motivo:'Esse posto não existe.'};
    if (!d) return {ok:false, motivo:'Ainda não começou.'};
    if (this.tem(id)) return {ok:false, tem:true, motivo:'Você já tem.'};
    const v = this.vetadoPor(id);
    if (v) return {ok:false, motivo:'Não com ' + v.nome + ' no bolso.'};
    if (d.capitulo < c.cap) return {ok:false, motivo:'Ainda não é hora disso.'};
    let pode = false;
    try { pode = !!c.requer(d); } catch(e){ pode = false; }
    if (!pode) return {ok:false, motivo:'Você ainda não preenche o que eles pedem.'};
    return {ok:true};
  },

  assumir(id){
    const e = this.estado(id);
    if (!e.ok) return {ok:false, motivo:e.motivo};
    const c = this.porId(id);
    this.lista().push(id);
    const avisos = [];
    const b = c.beneficios || {};
    if (b.status && Estado.subirStatus) { Estado.subirStatus(b.status); avisos.push({tipo:'rep', texto:b.status.toUpperCase() + ' +1.'}); }
    if (b.renda) avisos.push({tipo:'item', texto:`${b.renda} ₽ por capítulo — quem tem dois postos recebe o maior, não os dois.`});
    if (b.loja) avisos.push({tipo:'info', texto:`Desconto de ${Math.round((1 - b.loja) * 100)}% em qualquer loja de Kanto.`});
    if (b.centro) avisos.push({tipo:'cura', texto:'Atendimento sem custo em qualquer Centro.'});
    if (c.aviso) avisos.push({tipo:'dano', texto:c.aviso});
    Estado.j.cargo = (this.principal() || c).nome;
    Estado.marcar('cargo_' + id);
    Estado.registrar(`Assumiu o posto: ${c.nome} (${c.orgao}).`);
    return {ok:true, cargo:c, avisos};
  },

  largar(id){
    const i = this.lista().indexOf(id);
    if (i < 0) return false;
    this.lista().splice(i, 1);
    const p = this.principal();
    Estado.j.cargo = p ? p.nome : null;
    Estado.registrar(`Largou o posto: ${(this.porId(id)||{}).nome || id}.`);
    return true;
  },

  /* ---- benefícios somados ---- */
  _somar(){
    const r = {loja:1, centro:false, renda:0, moral:0, repRuim:0,
               guarita:false, fila:false, semEspera:false, lei:false};
    for (const id of this.lista()){
      const b = (this.porId(id) || {}).beneficios || {};
      if (b.loja) r.loja = Math.min(r.loja, b.loja);
      if (b.centro) r.centro = true;
      /* quem tem dois postos não recebe dois salários: recebe o maior */
      if (b.renda) r.renda = Math.max(r.renda, b.renda);
      if (b.moral) r.moral = Math.max(r.moral, b.moral);
      if (b.repRuim) r.repRuim += b.repRuim;
      ['guarita','fila','semEspera','lei'].forEach(k => { if (b[k]) r[k] = true; });
    }
    return r;
  },
  desconto(){ return this._somar().loja; },
  centroGratis(){ return this._somar().centro; },
  renda(){ return this._somar().renda; },
  temBeneficio(k){ return !!this._somar()[k]; },

  /* pago na virada de capítulo */
  pagarCapitulo(){
    const b = this._somar();
    const avisos = [];
    if (b.renda){
      Estado.j.dinheiro += b.renda;
      avisos.push({tipo:'item', texto:`+${b.renda} ₽ — o que os seus postos pagam por capítulo.`});
    }
    if (b.moral){
      (Estado.dados.time || []).forEach(p => { if (!p.morto) p.moral = Math.min(100, (p.moral || 50) + b.moral); });
      avisos.push({tipo:'info', texto:`O time inteiro subiu ${b.moral} de moral.`});
    }
    if (b.repRuim){
      const r = Estado.mudarRep('ruim', b.repRuim, 'O envelope do armário 14 continua chegando');
      if (r && r.mudou) avisos.push({tipo:'rep', texto:`Reputação: ${r.de} → ${r.para}`});
    }
    return avisos;
  },

  /* o que o balcão mostra */
  quadro(){
    const d = Estado.dados;
    return CARGOS.map(c => {
      const e = this.estado(c.id);
      return {cargo:c, tem:this.tem(c.id), ok:e.ok, motivo:e.motivo,
              cedo: d.capitulo < c.cap};
    });
  }
};
