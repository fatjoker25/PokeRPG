/* ------------------------------------------------------------
   ABERTURAS — a convocação da Liga chega de cinco jeitos, todos no
   Centro Pokémon de Viridian, e o jeito que ela chega já diz o que a
   Liga acha de você. A clareira fica na Rota 23, duas rotas a oeste.
   ------------------------------------------------------------ */
const C17_ABERTURAS = ['c17_envelope', 'c17_ab_no_quadro', 'c17_ab_sem_insignias', 'c17_ab_de_cracha', 'c17_ab_o_oficial'];
function c17_cabe(id, d){
  if (id === 'c17_ab_sem_insignias') return (d.insignias || []).length < 8;
  if (id === 'c17_ab_de_cracha')     return typeof Cargos !== 'undefined' && !!Cargos.doCracha();
  if (id === 'c17_ab_o_oficial')     return Estado.rep.eixo === 'ruim' && Estado.rep.ruim >= 3 || d.liga.avisos >= 2;
  return true;
}
function c17_abertura(d){
  const cand = C17_ABERTURAS.filter(id => c17_cabe(id, d));
  const id = Dados.escolher(cand);
  if (d && d.relogio && d.flags && d.flags.c17_chegada == null){
    /* o Centro, o mural e a rodoviária são de dia */
    const h = c17_hora(d);
    if (h < 7 || h >= 17) c17_ate(8, true);
    d.flags.c17_chegada = d.relogio.dia;
  }
  return id;
}

/* ------------------------------------------------------------
   O TEMPO DA ROTA 23, contado do dia de hoje. O comunicado que
   suspendeu os plantões saiu C17_COMUNICADO dias atrás, e os postos
   esvaziaram C17_VAZIO dias atrás; o Ezra fotografou Mew
   C17_FOTOS dias atrás, à tarde, postou à noite, e na manhã seguinte
   tinha gente perguntando por ele. A Elite parou de aparecer
   C17_ELITE meses atrás, o último desafiante subiu C17_DESAFIANTE
   meses atrás, e a mulher dos quatro perdeu o emprego C17_DEMISSAO
   meses atrás.
   ------------------------------------------------------------ */
const C17_COMUNICADO = 12, C17_VAZIO = 4, C17_FOTOS = 3;
const C17_ELITE = 4, C17_DESAFIANTE = 5, C17_DEMISSAO = 3;
function c17_hora(d){ sincronizarHora(d.relogio); return d.relogio.hora; }
/* a próxima vez que der h horas; na cidade o time come (viver) */
function c17_ate(h, emTerra){
  const r = Estado.dados.relogio; sincronizarHora(r);
  const falta = (h - r.hora + 24) % 24;
  if (falta){ if (emTerra) Relogio.viver(falta); else Relogio.avancar(falta); }
  return falta;
}
function c17_deDia(d){ const h = c17_hora(d); return h >= 6 && h < 18; }
/* "terça", "quarta": o dia da semana de `atras` dias antes de hoje */
function c17_semana(d, atras){ return Calendario.de(Math.max(1, d.relogio.dia - atras)).semana; }
function c17_Semana(d, atras){ const s = c17_semana(d, atras); return s.charAt(0).toUpperCase() + s.slice(1); }
function c17_naSemana(s){ return (s === 'sábado' || s === 'domingo' ? 'no ' : 'na ') + s; }
/* o mês de `n` meses antes deste (0 é o de agora) */
function c17_mes(d, n){ const c = Calendario.hoje(); return Calendario.MESES[(((c.mes - (n || 0)) % 12) + 12) % 12]; }
/* a escala riscada a partir do dia em que os postos esvaziaram, se foi neste mês */
function c17_diaRiscado(d){
  const a = Calendario.de(Math.max(1, d.relogio.dia - C17_VAZIO)), h = Calendario.hoje();
  return a.mes === h.mes ? a.diaMes : null;
}
function c17_fem(n){ return porExtenso(n).replace(/\bum$/, 'uma').replace(/\bdois$/, 'duas'); }
/* O Ezra mora na sua cidade: até Viridian é ônibus, pela distância de verdade */
function c17_horasDoEzra(){ const n = distanciaEntre(localDoCapitulo(1), 'viridian'); return n === 0 ? 0 : Math.max(1, Math.round(n * 0.7)); }
function c17_veioComo(){
  const h = c17_horasDoEzra();
  if (h === 0) return 'Eu atravessei a cidade inteira a pé.';
  return h === 1 ? 'Eu vim de ônibus. Uma hora.' : `Eu vim de ônibus. ${(s => s.charAt(0).toUpperCase() + s.slice(1))(c17_fem(h))} horas.`;
}

/* ------------------------------------------------------------
   QUEM SABE O QUÊ
   ------------------------------------------------------------ */
function c17_eu(t){ return d => fala(d.jogador.nome, t); }
function c17_opiniao(nome){ const n = Estado.npc(nome); return n && typeof n.opiniao === 'number' ? n.opiniao : 0; }
/* a opinião só sobe com o que é bom: cena boa depois de cena melhor não derruba o que ficou */
function c17_npc(nome, op, memoria){ return () => ({nome, opiniao: Math.max(c17_opiniao(nome), op), memoria}); }
function c17_temEzra(d){ return !!d.npcs['Ezra']; }
/* sair do Centro: com o Ezra esperando na porta, ou sozinh{o|a} pra Rota 23 */
function c17_sair(){
  return [
    {texto:'Seguir sozinh{o|a} pela Rota 23.', vai:'c17_rota23', cond:d=>!c17_temEzra(d)},
    {texto:'Sair do Centro.', vai:'c17_ezra_na_porta', cond:d=>c17_temEzra(d)}
  ];
}
/* o que a pessoa sabe sobre gente atrás de Mew */
function c17_temGente(d){ return !!d.flags.tem_gente_atras_do_mew || !!d.flags.achou_os_pneus; }
/* o comprador fala com quem ficou com Mew por dias */
function c17_comMew(d){ return !!d.flags.ficou_com_mew && !d.flags.soltou_mew && !d.flags.vendeu_mew; }
function c17_temOito(d){ return (d.insignias || []).length >= 8; }
/* já pisou na clareira (pela trilha, ou caído atrás dos caçadores) */
function c17_jaNaClareira(d){ return Historia.jaAconteceu('c17_a_clareira') || Historia.jaAconteceu('c17_perdeu_cacadores'); }
/* entrou na grama, e não só olhou da borda */
function c17_entrouNaClareira(d){ return Historia.jaAconteceu('c17_as_plantas') || Historia.jaAconteceu('c17_perdeu_cacadores'); }
/* os quatro da van ainda estão acampados na estrada de terra */
function c17_vanLa(d){
  return !d.flags.liga_pegou_a_van && !d.flags['caçadores_foram_embora']
      && !d.flags.espantou_cacadores_mew && !d.flags.cacadores_chegaram_primeiro;
}
/* o onze que a pessoa já viu em Saffron */
function c17_sabeDoOnze(d){ return !!d.flags.sabe_do_andar_11 || !!d.flags.ivone_tem_o_11; }
/* de Viridian de volta à clareira: quatro horas de estrada e mato */
const C17_NAO_FOI = {rep:{eixo:'bom', delta:4, motivo:'Protegeu Mew do melhor jeito: não indo'}};
function c17_voltarPraSoltar(){ return {flag:'c17_voltou_pra_soltar', executar:()=>{ Relogio.avancar(4); return []; }}; }

/* O chão da cena: o Centro de Viridian, a trilha da Rota 23, a
   clareira; quem ficou com Mew volta pra cidade. */
const C17_NA_CIDADE = /^c17_(ab_|ezra_na_porta|envelope|leu_o_envelope|perguntou_no_centro|pulou|voltou_no_teo|teo_mostra|o_que_fazia|convidou_teo|quem_viu|nao_foi_merda|as_tres_pessoas|apagar|descreveu|assinou|esqueceu|rodoviaria|ficou_com_mew|quem_te_mandou|pergunta_de_novo|recusou_cientistas|vendeu_mew|foi_atras|contou_pra_ivone)/;
const C17_NA_TRILHA = /^c17_(rota23|o_posto|o_radio|o_que_acontece|o_nome_dele|boca_do_caminho|nao_vai|pneus_na_trilha|denunciou_van)$/;
function c17_ambiente(d){
  const c = (d && d.cena) || '';
  if (C17_NA_CIDADE.test(c)) return 'cidade';
  if (C17_NA_TRILHA.test(c)) return 'montanha';
  if (c === 'c17_fim'){
    const f = d.flags || {};
    if (f.c17_entrou_no_caminho) return 'caverna';
    if (f.c17_soltou_longe || (f.ficou_com_mew && !f.c17_voltou_pra_soltar) || !f.entrou_na_rota_23) return 'cidade';
    return 'montanha';
  }
  return 'floresta';
}

/* ============================================================
   CAPÍTULO 17 — O JARDIM  (Viridian / Rota 23)
   ============================================================ */
CAPITULOS.push(
{
num:17, titulo:'O Jardim', local:'Viridian / Rota 23', ambiente:c17_ambiente, nivelArea:50,
tom:'muito sombrio', entradas:C17_ABERTURAS,
inicio: d => c17_abertura(d),
/* a volta à clareira não repete a chegada */
desvios:{
  c17_a_clareira: {se:d => c17_jaNaClareira(d) && d.cena !== 'c17_a_clareira', vai:'c17_clareira_de_novo'}
},
cenas:{

c17_ab_no_quadro:{
  texto:[
    'A convocação não chega pra você. Ela chega pro mural.',
    'No quadro de avisos do Centro Pokémon de Viridian tem uma folha impressa com trinta e um nomes em ordem alfabética, sob o título CONVOCADOS — TEMPORADA CORRENTE.',
    'O seu está na lista, entre dois nomes que você não conhece, em corpo doze, como todos os outros.',
    'Tem quatro pessoas lendo o mural com você, e uma delas está passando o dedo linha por linha, duas vezes, procurando um nome que não está lá.',
    'Ela para de procurar e fica olhando o quadro por mais tempo do que precisa.',
    'Embaixo da lista tem um parágrafo em corpo oito que ninguém está lendo:',
    '**"Em razão de reestruturação administrativa em curso, o acesso ao Planalto Indigo permanece por conta e risco do desafiante. Os postos de controle das Rotas 22 e 23 estão temporariamente desguarnecidos."**',
    'Trinta e uma pessoas foram convocadas e avisadas, em corpo oito, de que tiraram a segurança do caminho.'
  ],
  ef:{flag:['leu_o_anexo','sabe_dos_postos_vazios'],
      rep:{eixo:'bom', delta:1, motivo:'Leu o corpo oito do mural.'},
      registrar:'A convocação da Liga saiu no mural do Centro de Viridian: 31 nomes e um aviso em corpo oito sobre postos desguarnecidos.',
      presagio:'Publicar em mural é o jeito de avisar sem comunicar.'},
  escolhas:[
    {texto:'Falar com a mulher que não achou o nome dela.', vai:'c17_ab_a_mulher_do_mural'},
    {texto:'Arrancar a folha e levar.', vai:'c17_ab_arrancou_a_folha'},
    {texto:'Perguntar na recepção se tem envelope pra você.', vai:'c17_envelope'},
    ...c17_sair()
  ]
},

c17_ab_a_mulher_do_mural:{
  texto:[
    'Ela tem uns vinte e cinco anos e seis insígnias no estojo preso no cinto, o que é mais do que a maioria dos trinta e um nomes da folha.',
    c17_eu('Você não tá na lista?'),
    fala('a mulher do mural', 'Não.'),
    fala('a mulher do mural', 'E eu tenho seis. Tem gente com quatro nessa folha.'),
    'Ela não fala isso com revolta. Fala com a precisão de quem já conferiu.',
    c17_eu('Você reclamou?'),
    fala('a mulher do mural', 'Liguei pro Planalto. Uma moça muito educada me explicou que a convocação é por critério administrativo.'),
    c17_eu('Que critério?'),
    fala('a mulher do mural', 'Ela não soube dizer.'),
    'Ela dá um passo pra trás pra ver o mural inteiro de uma vez.',
    fala('a mulher do mural', 'Eu contei. Vinte e dois dos trinta e um são de Saffron, Celadon ou Vermilion.', 'baixo'),
    fala('a mulher do mural', 'Eu sou de Pewter.')
  ],
  ef:{flag:'o_criterio_administrativo',
      npc:{nome:'a mulher do mural', opiniao:1, viuVoce:'Você foi {o único|a única} a perguntar por que ela não estava na lista.'},
      registrar:'Vinte e dois dos 31 convocados são de Saffron, Celadon ou Vermilion. O critério é "administrativo".',
      presagio:'Convocação concentrada em três cidades é escolha, e escolha tem quem escolha.'},
  escolhas:[
    {texto:'Anotar os trinta e um nomes antes de sair.', vai:'c17_ab_arrancou_a_folha'},
    {texto:'Perguntar na recepção se tem envelope pra você.', vai:'c17_envelope'},
    ...c17_sair()
  ]
},

c17_ab_arrancou_a_folha:{
  texto:[
    'Você tira a folha do mural, e tirar folha de mural de Centro Pokémon é uma coisa que ninguém faz e que ninguém impede.',
    'A atendente vê. Não fala nada. Volta pro computador.',
    'Você dobra a folha em quatro e guarda junto do resto do papel que vem juntando há meses, e o resto do papel já é uma pilha que não cabe mais no bolso de fora.',
    'Trinta e um nomes, a cidade de cada um, e um parágrafo em corpo oito.',
    'Não é prova de nada. É a lista de quem a Liga decidiu mandar pra uma estrada que ela mesma desguarneceu.'
  ],
  ef:{flag:['tem_a_lista_dos_trinta_e_um','reika_precisa_de_papel'],
      registrar:'Está com a folha de convocação arrancada do mural: 31 nomes e o aviso dos postos desguarnecidos.'},
  escolhas:[
    {texto:'Perguntar na recepção se tem envelope pra você.', vai:'c17_envelope'},
    ...c17_sair()
  ]
},

c17_ab_sem_insignias:{
  texto:[
    d=>{ const n = (d.insignias || []).length;
         return `Você tem ${porExtenso(n)} insígnia${n === 1 ? '' : 's'}. O regulamento da Liga pede oito. E o envelope está na sua mão mesmo assim.`; },
    'Papel de gramatura alta, dobra em três, timbre em relevo. A atendente do Centro de Viridian estava com ele separado atrás do balcão havia três dias.',
    '**"Sua presença é solicitada no Planalto Indigo. Apresentar-se à recepção com as insígnias em mãos."**',
    'Com as insígnias em mãos. Não diz oito. Você lê a frase quatro vezes procurando o oito, e ele não está lá.',
    'Ou o regulamento mudou, ou a convocação não é sobre o regulamento.',
    c17_eu('Isso chegou pra mais alguém?'),
    fala('a atendente de Viridian', 'Chegaram sete aqui essa semana.'),
    c17_eu('E os sete têm oito insígnias?'),
    'Ela olha pro lado, pro arquivo de envelopes que ainda não foram entregues.',
    fala('a atendente de Viridian', 'Eu não confiro insígnia. Eu entrego envelope.', 'baixo')
  ],
  ef:{flag:['convocado_sem_as_oito','tem_a_convocacao'],
      registrar:'Recebeu a convocação da Liga sem ter as oito insígnias. A carta não fala em número.',
      presagio:'Convocação que não pede o requisito não está convocando por mérito.'},
  escolhas:[
    {texto:'Ler o envelope inteiro, inclusive a segunda folha.', vai:'c17_leu_o_envelope'},
    {texto:'Perguntar quem carimbou.', vai:'c17_ab_o_carimbo'},
    ...c17_sair()
  ]
},

c17_ab_o_carimbo:{
  texto:[
    'O carimbo é redondo, azul, com o brasão da Liga no meio e uma linha de texto na borda.',
    'Você lê a borda com o envelope inclinado contra a luz, porque a tinta está fraca:',
    '**SECRETARIA DE COMPETIÇÕES — USO INTERNO**',
    'Uso interno. Uma convocação a desafiantes carimbada com o carimbo de uso interno.',
    'Você mostra pra atendente, que olha com o interesse educado de quem tem fila.',
    fala('a atendente de Viridian', 'Esse é o carimbo que vem em tudo da Liga.'),
    c17_eu('Tudo o quê?'),
    fala('a atendente de Viridian', 'Tudo. Aviso de manutenção, mudança de horário, circular.'),
    'Ela puxa uma pasta de baixo do balcão e mostra quatro circulares dos últimos meses. As quatro com o mesmo carimbo azul.',
    fala('a atendente de Viridian', 'Faz uns dois anos que ninguém carimba nada com o carimbo de fora. Sumiu.')
  ],
  ef:{flag:'o_carimbo_de_uso_interno',
      registrar:'Há dois anos a Liga só usa o carimbo de "uso interno" — o carimbo de fora sumiu.',
      presagio:'Papel carimbado como interno não vale contra a Liga. Sempre coube a eles dizer que era rascunho.'},
  escolhas:[
    {texto:'Ler o envelope inteiro.', vai:'c17_leu_o_envelope'},
    ...c17_sair()
  ]
},

c17_ab_de_cracha:{
  texto:[
    d=>{ const c = Cargos.doCracha();
         return `O envelope não chega pelo balcão do Centro. Chega pelo serviço: vem junto com a correspondência ${c ? 'de ' + c.nome : 'de praxe'}, num malote lacrado, com protocolo de recebimento pra você assinar.`; },
    'Dentro do malote tem duas coisas.',
    'A convocação, igual à de todo mundo.',
    'E um segundo envelope, menor, sem timbre, com o seu nome escrito à mão.',
    'Dentro do segundo, meia folha datilografada, sem assinatura e sem carimbo:',
    '**"Os postos das Rotas 22 e 23 não estão desguarnecidos por reestruturação. O pessoal foi mandado pra Viridian. Pergunta pra quê."**',
    'Você lê duas vezes. Vira a folha. O verso está em branco.',
    'Alguém de dentro do serviço te mandou isso sabendo que você tem acesso ao malote, e sabendo que você ia subir.'
  ],
  ef:{flag:['o_bilhete_do_malote','sabe_dos_postos_vazios','tem_a_convocacao'],
      registrar:'Um bilhete anônimo no malote: o pessoal dos postos das Rotas 22 e 23 foi mandado para Viridian.',
      presagio:'Quem escreveu sabe pra onde mandaram o pessoal e não quer assinar.'},
  escolhas:[
    {texto:'Ler a convocação normal também.', vai:'c17_leu_o_envelope'},
    {texto:'Tentar descobrir quem pôs o bilhete no malote.', vai:'c17_ab_quem_pos'},
    {texto:'Perguntar na recepção pra onde foi o pessoal dos postos.', vai:'c17_perguntou_no_centro'},
    ...c17_sair()
  ]
},

c17_ab_quem_pos:{
  texto:[
    'O malote tem protocolo, e protocolo tem origem, e a origem está impressa na etiqueta: expedido pelo setor de correspondência do Planalto Indigo, às seis e quarenta da manhã de anteontem.',
    'Você liga pro setor pelo PokéNav. Atende um rapaz.',
    c17_eu('Quem fecha os malotes aí?'),
    fala('o rapaz do setor', 'Depende do turno. De manhã sou eu.'),
    c17_eu('Anteontem, seis e quarenta.'),
    'Papel sendo mexido.',
    fala('o rapaz do setor', 'Anteontem eu entrei às sete.'),
    'Silêncio dos dois lados.',
    fala('o rapaz do setor', 'O malote saiu às seis e quarenta?'),
    c17_eu('Tá na etiqueta.'),
    fala('o rapaz do setor', 'Então alguém entrou no setor antes de mim e lacrou um malote.'),
    'Ele para. Você ouve ele respirando.',
    fala('o rapaz do setor', '{Moço|Moça}, eu vou desligar. E eu não vou falar disso com ninguém daqui.', 'baixo')
  ],
  ef:{flag:'alguem_lacrou_antes_do_turno',
      registrar:'O malote foi lacrado no Planalto vinte minutos antes de o responsável pelo turno chegar.'},
  escolhas:[
    {texto:'Ler a convocação normal antes.', vai:'c17_leu_o_envelope'},
    ...c17_sair()
  ]
},

c17_ab_o_oficial:{
  texto:[
    'A convocação não chega em envelope. Chega na mão de um oficial da Liga, de uniforme cinza, que estava sentado na recepção do Centro de Viridian esperando você entrar.',
    'Ele levanta quando te vê. Não bloqueia a porta. Fica em pé e espera você chegar até ele, o que é uma escolha, e você repara nela.',
    fala('o oficial de cinza', 'Eu tenho duas coisas pra te entregar, e a ordem importa.'),
    'A primeira é a convocação, igual à de todo mundo: papel de gramatura alta, timbre em relevo.',
    'A segunda é uma folha comum, com o brasão impresso e não em relevo.',
    d=>{ const n = d.liga.avisos || 0;
         return n > 0
           ? `**"NOTIFICAÇÃO — ${n} ocorrência${n === 1 ? '' : 's'} registrada${n === 1 ? '' : 's'}. A presente convocação não suspende, anula ou substitui as ocorrências acima."**`
           : '**"NOTIFICAÇÃO — conduta do desafiante sob observação. A presente convocação não suspende, anula ou substitui a observação acima."**'; },
    fala('o oficial de cinza', 'Você pode subir. É o seu direito.'),
    fala('o oficial de cinza', 'E se você subir, isso aqui sobe com você.'),
    'Ele entrega as duas folhas juntas, uma em cima da outra, com a notificação por baixo.'
  ],
  ef:{flag:['convocado_com_notificacao','tem_a_convocacao'],
      registrar:'A Liga entregou a convocação em mão, junto com uma notificação sobre a sua conduta.',
      presagio:'Ele pôs a notificação por baixo. Foi cuidado, não descuido.'},
  escolhas:[
    {texto:'Perguntar quem mandou ele te esperar aqui.', vai:'c17_ab_quem_mandou'},
    {texto:'Ler o envelope inteiro, inclusive a segunda folha.', vai:'c17_leu_o_envelope'},
    ...c17_sair()
  ]
},

c17_ab_quem_mandou:{
  texto:[
    c17_eu('Quem mandou você me esperar?'),
    fala('o oficial de cinza', 'Ordem de serviço.'),
    c17_eu('Assinada por quem?'),
    'Ele tira a ordem do bolso do peito e mostra, e mostrar isso não é obrigação dele.',
    'É um formulário de meia página. No campo "solicitante" está escrito, à máquina: CONSELHO.',
    'Só isso. Sem nome, sem sigla, sem número.',
    c17_eu('Que conselho?'),
    fala('o oficial de cinza', 'Eu ia te perguntar a mesma coisa.'),
    'Ele dobra a ordem e guarda.',
    fala('o oficial de cinza', 'Eu tenho dezenove anos de Liga. Ordem de serviço sempre teve nome de quem assina.'),
    fala('o oficial de cinza', 'Nos últimos oito meses, quatro das minhas vieram assim.', 'baixo')
  ],
  ef:{flag:'ordens_assinadas_por_conselho',
      npc:{nome:'o oficial de cinza', opiniao:1, viuVoce:'Te mostrou a ordem de serviço assinada apenas por "conselho".'},
      registrar:'Quatro ordens de serviço da Liga, em oito meses, vieram assinadas só como "CONSELHO".',
      presagio:'Um solicitante sem nome que a própria Liga obedece.'},
  escolhas:[
    {texto:'Ler o envelope inteiro.', vai:'c17_leu_o_envelope'},
    ...c17_sair()
  ]
},

/* ─────────────── O EZRA NA PORTA ─────────────── */

c17_ezra_na_porta:{
  texto:[
    'Do lado de fora do Centro, encostado no poste, tem um garoto te esperando há pelo menos uma hora.',
    d=>{ const t = d.npcs['Ezra'] || {};
         if (t.opiniao >= 3) return fala('Ezra', 'Eu sabia que você ia passar por aqui.');
         if (t.opiniao <= -2) return fala('Ezra', 'Não vim te cumprimentar.');
         return fala('Ezra', 'Ô.'); },
    d=>{ const t = d.npcs['Ezra'] || {};
         if (t.opiniao >= 3) return 'Ezra fala rápido demais, do jeito dele.';
         if (t.opiniao <= -2) return 'Ezra não estende a mão.';
         return 'Ezra enfia as mãos no bolso.'; },
    d=>{ const t = d.npcs['Ezra'] || {};
         if (t.opiniao >= 3) return fala('Ezra', 'Cara, eu preciso te mostrar uma coisa, e você vai achar que eu tô louco.');
         if (t.opiniao <= -2) return fala('Ezra', 'Vim porque não tem mais ninguém pra quem contar isso, e isso me irrita muito.');
         return fala('Ezra', 'Eu preciso mostrar uma coisa pra alguém que não vai rir.'); }
  ],
  escolhas:[
    {texto:'"Mostra."', vai:'c17_teo_mostra'},
    {texto:'"Agora não. A Liga me chamou."', vai:'c17_pulou'},
    {texto:'Ler o envelope inteiro primeiro.', vai:'c17_leu_o_envelope', cond:d=>!!d.flags.tem_a_convocacao}
  ]
},

c17_envelope:{
  texto:[
    d=>Historia.jaAconteceu('c17_ab_no_quadro')
      ? 'Tem envelope, sim: a atendente estava com ele separado atrás do balcão havia três dias, e ninguém te avisou.'
      : 'O envelope tem timbre em relevo e chega na sua mão no Centro Pokémon de Viridian, entregue pela atendente, que estava com ele separado atrás do balcão havia três dias.',
    'Papel de gramatura alta, dobra em três, e uma frase:',
    '**"Sua presença é solicitada no Planalto Indigo. Apresentar-se à recepção com as insígnias em mãos."**',
    'Sem data. Sem prazo. Sem assinatura — só um carimbo.',
    d=>c17_temEzra(d)
      ? 'Você lê três vezes e guarda, porque tem um garoto encostado no poste do lado de fora do Centro, te esperando há pelo menos uma hora.'
      : 'Você lê três vezes e guarda.'
  ],
  ef:{flag:'tem_a_convocacao', registrar:'Recebeu a convocação da Liga.'},
  escolhas:[
    {texto:'Ler o envelope inteiro, inclusive a segunda folha.', vai:'c17_leu_o_envelope'},
    {texto:'Sair e ver o que o Ezra quer.', vai:'c17_ezra_na_porta', cond:d=>c17_temEzra(d)},
    {texto:'Seguir sozinh{o|a} pela Rota 23.', vai:'c17_rota23', cond:d=>!c17_temEzra(d)}
  ]
},

c17_leu_o_envelope:{
  texto:[
    'Você abre o envelope inteiro, que tem duas folhas e não uma.',
    'A primeira é a convocação.',
    d=>Historia.jaAconteceu('c17_ab_no_quadro')
      ? 'A segunda é o mesmo parágrafo do mural, em corpo oito, numa meia página que quase ninguém leria:'
      : 'A segunda é um anexo de meia página, em fonte menor, que quase ninguém leria:',
    '**"Comunicado aos convocados: em razão de reestruturação administrativa em curso, o acesso ao Planalto Indigo permanece por conta e risco do desafiante. Os postos de controle das Rotas 22 e 23 estão temporariamente desguarnecidos."**',
    'Você lê essa frase quatro vezes.',
    'Os postos de controle da Rota 23 — a última antes do Caminho da Vitória, a rota de acesso ao Planalto — estão desguarnecidos.',
    'A Liga Pokémon convocou desafiantes e avisou, em corpo oito, que tirou a segurança do caminho.',
    d=>c17_temEzra(d) && Historia.jaAconteceu('c17_ezra_na_porta') && !d.flags.pulou_o_teo
      ? 'Você levanta a cabeça e o Ezra está te olhando com as mãos no bolso, esperando você terminar de ler pra poder falar.' : ''
  ],
  ef:{flag:['leu_o_anexo','sabe_dos_postos_vazios','tem_a_convocacao'],
      rep:{eixo:'bom',delta:2,motivo:'Leu a segunda folha'},
      registrar:'Os postos de controle das Rotas 22 e 23 estão desguarnecidos por "reestruturação administrativa".'},
  escolhas:[
    {texto:'"Mostra o que você tem."', vai:'c17_teo_mostra', cond:d=>c17_temEzra(d) && Historia.jaAconteceu('c17_ezra_na_porta') && !d.flags.pulou_o_teo},
    {texto:'Sair do Centro.', vai:'c17_ezra_na_porta', cond:d=>c17_temEzra(d)},
    {texto:'Perguntar na recepção o que é reestruturação.', vai:'c17_perguntou_no_centro'},
    {texto:'Ir pra Rota 23.', vai:'c17_rota23', cond:d=>!c17_temEzra(d) || !!d.flags.pulou_o_teo}
  ]
},

c17_perguntou_no_centro:{
  texto:[
    'A atendente do Centro de Viridian tem uns trinta anos e já respondeu essa pergunta hoje.',
    fala('a atendente de Viridian', 'Eu não sei, e eu já perguntei.'),
    'Ela mostra um mural atrás do balcão com quatro comunicados afixados.',
    'O mais novo, de doze dias atrás, tem duas linhas:',
    '**"Suspensa até segunda ordem a escala de plantão dos postos 22-A, 22-B, 23-A, 23-B, 23-C e 23-D. Servidores realocados."**',
    c17_eu('Realocados pra onde?'),
    fala('a atendente de Viridian', 'Não diz.'),
    'Ela ajeita o comunicado no mural, que não precisava ser ajeitado.',
    fala('a atendente de Viridian', 'Eu conheço três dos servidores dos postos. Dois foram trabalhar aqui mesmo, em Viridian, e um tirou licença.'),
    c17_eu('E pra que tem gente vindo trabalhar em Viridian?'),
    'Ela olha pros lados, num Centro Pokémon vazio.',
    fala('a atendente de Viridian', 'Ninguém me disse. Mas o ginásio daqui vive de porta fechada, e alguém tá indo trabalhar lá.', 'baixo')
  ],
  ef:{flag:['sabe_de_viridian','sabe_dos_postos_vazios'],
      npc:c17_npc('a atendente de Viridian', 3, 'Te mostrou o comunicado de suspensão dos plantões e contou que servidores dos postos foram mandados para Viridian.'),
      rep:{eixo:'bom',delta:3,motivo:'Perguntou o que significava e conferiu no mural'},
      registrar:'Servidores dos postos das Rotas 22 e 23 foram mandados para Viridian, onde o ginásio vive de porta fechada.'},
  escolhas:[
    {texto:'Sair do Centro.', vai:'c17_ezra_na_porta', cond:d=>c17_temEzra(d)},
    {texto:'"Mostra o que você tem."', vai:'c17_teo_mostra', cond:d=>c17_temEzra(d) && Historia.jaAconteceu('c17_ezra_na_porta') && !d.flags.pulou_o_teo},
    {texto:'Ir pra Rota 23.', vai:'c17_rota23', cond:d=>!c17_temEzra(d) || !!d.flags.pulou_o_teo},
    {texto:'Anotar tudo e ir pra Rota 23.', vai:'c17_rota23', ef:{flag:'anotou_viridian'}, cond:d=>!c17_temEzra(d) || !!d.flags.pulou_o_teo}
  ]
},

c17_pulou:{
  texto:[
    c17_eu('Agora não. A Liga me chamou.'),
    'Ezra assente devagar.',
    fala('Ezra', 'Claro. Beleza.'),
    'Ele guarda o PokéNav sem te mostrar nada e enfia as duas mãos no bolso.',
    fala('Ezra', 'Boa sorte lá, hein.'),
    'Ele vai embora, e o jeito que ele vai embora — sem pressa, sem drama, olhando o chão — diz que você acabou de perder uma coisa que não volta fácil.',
    'Três quarteirões depois ele para na esquina e olha pra trás uma vez.',
    'E você já está de costas.'
  ],
  ef:{flag:'pulou_o_teo', moral:-10,
      npc:{nome:'Ezra', opiniao:-3, memoria:'Guardou o PokéNav sem te mostrar nada e foi embora olhando o chão.'},
      registrar:'Não quis ver o que o Ezra tinha pra mostrar.',
      presagio:'Ele parou na esquina e olhou pra trás. Você estava de costas.'},
  escolhas:[
    {texto:'Correr atrás dele.', vai:'c17_voltou_no_teo'},
    {texto:'Ler o envelope inteiro antes de ir.', vai:'c17_leu_o_envelope', cond:d=>!!d.flags.tem_a_convocacao},
    {texto:'Ir pro Planalto pela Rota 23.', vai:'c17_rota23'}
  ]
},

c17_voltou_no_teo:{
  texto:[
    'Você corre três quarteirões e alcança ele na esquina.',
    c17_eu('Mostra.'),
    'Ele não vira.',
    fala('Ezra', 'Agora você quer ver.'),
    c17_eu('Agora eu quero ver.'),
    'Ele fica de costas mais uns cinco segundos, que são cinco segundos longos, e depois vira e tira o PokéNav do bolso.',
    'E antes de ligar ele fala uma coisa:',
    d=>fala('Ezra', c17_veioComo()),
    c17_eu('Eu sei.'),
    fala('Ezra', 'Você não sabia.'),
    'Ele liga o PokéNav.',
    fala('Ezra', 'Agora você sabe.')
  ],
  ef:{flag:'voltou_no_teo', limpaFlag:'pulou_o_teo',
      npc:c17_npc('Ezra', 2, 'Você voltou correndo três quarteirões atrás dele.'),
      rep:{eixo:'bom',delta:3,motivo:'Voltou correndo'},
      moral:10,
      presagio:'Ele não falou isso pra te cobrar. Falou porque era verdade.'},
  escolhas:[{texto:'Ver o que ele tem.', vai:'c17_teo_mostra'}]
},

c17_teo_mostra:{
  texto:[
    'Ele mostra uma foto no PokéNav. Está tremida e é de longe.',
    'É uma clareira. No meio dela, pairando a um metro do chão, tem uma coisa pequena, rosa, com cauda comprida.',
    c17_eu('Isso é um borrão.'),
    fala('Ezra', 'Eu sei.'),
    'Ele passa pra próxima. E pra próxima.',
    'São nove.',
    'Na terceira dá pra ver que tem forma. Na quinta, que tem cauda, e que a cauda é mais comprida que o corpo.',
    'Na sétima, a coisa está olhando pra câmera.',
    'Na nona ela está muito mais perto — tão perto que ocupa metade do quadro, e a foto está desfocada porque o PokéNav não consegue focar tão perto.',
    fala('Ezra', 'Eu tirei nove fotos em dois minutos, e ela deixou.'),
    'Ele fica olhando a nona.',
    fala('Ezra', 'Ela ficou, cara. Ela foi chegando.'),
    c17_eu('E aí?'),
    fala('Ezra', 'E aí ela sumiu, e eu fiquei sentado no chão daquela clareira uma hora sem conseguir levantar.'),
    'Ele guarda o PokéNav.',
    d=>fala('Ezra', `Isso foi na Rota 23. ${c17_Semana(d, C17_FOTOS)} à tarde.`)
  ],
  ef:{flag:['viu_as_fotos','sabe_do_jardim'],
      npc:c17_npc('Ezra', 3, 'Te mostrou nove fotos de Mew numa clareira da Rota 23.'),
      registrar:d=>`Ezra fotografou Mew numa clareira da Rota 23, ${c17_naSemana(c17_semana(d, C17_FOTOS))} à tarde.`},
  escolhas:[
    {texto:'"Quem mais viu isso?"', vai:'c17_quem_viu'},
    {texto:'"O que você tava fazendo na Rota 23?"', vai:'c17_o_que_fazia'},
    {texto:'"Me leva lá."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Apaga essas fotos."', vai:'c17_apagar'}
  ]
},

c17_o_que_fazia:{
  texto:[
    c17_eu('O que você tava fazendo na Rota 23?'),
    'Ele demora.',
    fala('Ezra', 'Indo pro Planalto.'),
    c17_eu('Você tem oito insígnias?'),
    fala('Ezra', 'Eu tenho quatro.'),
    'Ele olha o chão.',
    fala('Ezra', 'Eu tava indo olhar.'),
    c17_eu('Olhar?'),
    fala('Ezra', 'Cara, eu sei que é besteira. Eu ia subir a Rota 23, chegar na boca do Caminho da Vitória, olhar, e voltar.'),
    'Ele chuta uma pedrinha.',
    fala('Ezra', 'Eu queria ver de perto uma vez. A entrada. Só isso.'),
    'Silêncio.',
    fala('Ezra', 'E aí eu me perdi da trilha, porque eu sou péssimo de mato, e achei uma clareira.'),
    'Ele levanta a cabeça.',
    fala('Ezra', 'A coisa mais importante que já aconteceu comigo aconteceu porque eu me perdi indo olhar uma porta que eu não podia atravessar.')
  ],
  ef:{flag:'sabe_do_teo',
      npc:c17_npc('Ezra', 5, 'Ia à Rota 23 só pra olhar a entrada do Caminho da Vitória, com quatro insígnias, e se perdeu.'),
      rep:{eixo:'bom',delta:3,motivo:'Perguntou o que ele estava fazendo lá'},
      moral:8,
      registrar:'Ezra tem quatro insígnias e ia à Rota 23 só pra olhar a entrada do Caminho.'},
  escolhas:[
    {texto:'"Quem mais viu isso?"', vai:'c17_quem_viu'},
    {texto:'"Me leva lá."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Quando eu subir, vem comigo."', vai:'c17_convidou_teo'},
    {texto:'"Apaga essas fotos."', vai:'c17_apagar'}
  ]
},

c17_convidou_teo:{
  texto:[
    c17_eu('Quando eu subir, vem comigo.'),
    fala('Ezra', 'Eu tenho quatro insígnias.'),
    c17_eu('Eu sei. Vem como acompanhante.'),
    'Ele abre a boca e fecha.',
    fala('Ezra', 'Pode?'),
    c17_eu('Não sei. Tá escrito que eu me apresento com as insígnias em mãos. Não tá escrito que eu me apresento sozinh{o|a}.'),
    'Ele ri — uma risada curta e feia, dessas de quem está tentando não fazer outra coisa com o rosto.',
    fala('Ezra', 'Cara.'),
    'Ele passa a mão no cabelo.',
    fala('Ezra', 'Cara.'),
    'E é só isso que ele consegue falar por uns quinze segundos.'
  ],
  ef:{flag:['teo_vai_junto','teo_acompanhante'],
      npc:c17_npc('Ezra', 8, 'Foi convidado a subir ao Planalto Indigo com você, como acompanhante, com quatro insígnias.'),
      rep:{eixo:'bom',delta:4,motivo:'Convidou quem não podia entrar'},
      moral:15,
      registrar:'Ezra vai subir ao Planalto Indigo com você, quando você for, como acompanhante.',
      presagio:'"Não tá escrito que eu me apresento sozinh{o|a}." Você está aprendendo a ler regulamento.'},
  escolhas:[
    {texto:'"Agora me leva na clareira."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Quem mais viu isso?"', vai:'c17_quem_viu'},
    {texto:'"Apaga as fotos antes."', vai:'c17_apagar'}
  ]
},

c17_quem_viu:{
  texto:[
    c17_eu('Quem mais viu isso?'),
    'Ezra fica branco.',
    'Não é figura de linguagem: a cor sai do rosto dele em tempo real, e você vê acontecer.',
    fala('Ezra', 'Eu postei uma.'),
    'Ele fala muito baixo.',
    d=>fala('Ezra', `A terceira. Num grupo de treinadores lá da cidade. ${c17_Semana(d, C17_FOTOS)} à noite, umas onze da noite.`),
    c17_eu('E?'),
    d=>fala('Ezra', `E ${c17_naSemana(c17_semana(d, C17_FOTOS - 1))} de manhã tinha três pessoas lá na cidade perguntando onde eu moro.`),
    'Ele olha em volta pela primeira vez na conversa inteira — a rua, os dois lados, o Centro atrás de vocês.',
    fala('Ezra', 'Cara.'),
    'Ele engole.',
    fala('Ezra', 'Eu acho que eu fiz merda.')
  ],
  ef:{flag:['foto_vazou','tem_gente_atras_do_mew'], instabilidade:1,
      npc:c17_npc('Ezra', 3, 'Postou uma das fotos num grupo, e na manhã seguinte tinha gente perguntando onde ele morava.'),
      registrar:'Ezra postou uma foto de Mew num grupo. Na manhã seguinte, três pessoas foram procurar por ele.'},
  escolhas:[
    {texto:'"Apaga tudo e some da cidade por uma semana."', vai:'c17_apagar'},
    {texto:'"Como eram as três pessoas?"', vai:'c17_as_tres_pessoas'},
    {texto:'"Então a gente vai lá agora, antes deles."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Não foi merda. Merda foi o grupo."', vai:'c17_nao_foi_merda'}
  ]
},

c17_nao_foi_merda:{
  texto:[
    c17_eu('Não foi merda.'),
    fala('Ezra', 'Foi.'),
    c17_eu('Você tirou nove fotos de uma coisa que ninguém nunca fotografou e mostrou pra gente que você achou que ia gostar. Isso é a coisa mais normal do mundo.'),
    'Ele não olha pra você.',
    c17_eu('Merda foi ter gente num grupo de treinadores que ganha com informação.'),
    'Ele fica quieto um tempo.',
    fala('Ezra', 'É a mesma coisa.'),
    c17_eu('Não é.'),
    'Você fala isso com uma firmeza que surpreende vocês dois.',
    c17_eu('Se fosse a mesma coisa, ninguém ia poder contar nada pra ninguém nunca, e aí quem vende informação ganhava de qualquer jeito.'),
    'Ele solta o ar.',
    fala('Ezra', 'Você melhorou de falar.'),
    c17_eu('Eu tive aula com umas pessoas.')
  ],
  ef:{flag:'consolou_o_teo',
      npc:c17_npc('Ezra', 6, 'Você separou o erro dele do erro do grupo, e ele reparou que você melhorou de falar.'),
      rep:{eixo:'bom',delta:3,motivo:'Não deixou alguém carregar culpa alheia'},
      moral:10,
      presagio:'"Eu tive aula com umas pessoas."'},
  escolhas:[
    {texto:'"Como eram as três pessoas?"', vai:'c17_as_tres_pessoas'},
    {texto:'"Apaga as fotos mesmo assim."', vai:'c17_apagar'},
    {texto:'"Me leva lá."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Quando eu subir, vem comigo."', vai:'c17_convidou_teo'}
  ]
},

c17_as_tres_pessoas:{
  texto:[
    c17_eu('Como eram as três pessoas?'),
    'Ele descreve o que conseguiu ver da janela da tia dele, que é de onde ele viu.',
    fala('Ezra', 'Dois homens e uma mulher. Vinte e poucos, trinta. Roupa de trilha nova demais, aquela que ainda tem vinco de loja.'),
    c17_eu('E eles perguntaram pra quem?'),
    fala('Ezra', 'Pro dono da mercearia da esquina. Perguntaram pelo "moleque das fotos".'),
    c17_eu('E ele falou?'),
    fala('Ezra', 'Falou que não sabia.'),
    'Ele finalmente olha pra você.',
    fala('Ezra', 'E aí ele fechou a mercearia às onze da manhã, coisa que ele não faz desde que a mulher dele morreu, e foi na casa da minha tia me avisar.'),
    'Ele mexe no PokéNav sem ligar.',
    fala('Ezra', 'E ele nem me conhece direito, cara. Eu compro pão lá.')
  ],
  ef:{flag:['sabe_dos_tres_de_trilha','tem_gente_atras_do_mew'],
      npc:c17_npc('Ezra', 5, 'O dono da mercearia fechou a loja às 11h da manhã pra ir avisá-lo.'),
      rep:{eixo:'bom',delta:2,motivo:'Perguntou como eram'},
      moral:8,
      registrar:'Três pessoas com roupa de trilha nova procuraram o Ezra. O dono da mercearia fechou a loja pra avisá-lo.',
      presagio:'Ele compra pão lá. Foi o suficiente.'},
  escolhas:[
    {texto:'"Apaga as fotos."', vai:'c17_apagar'},
    {texto:'"Então a gente vai lá agora."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Quando eu subir, vem comigo."', vai:'c17_convidou_teo'},
    {texto:'"A gente não vai. E você esquece."', vai:'c17_esqueceu'}
  ]
},

c17_apagar:{
  texto:[
    c17_eu('Apaga essas fotos.'),
    'Ele apaga as nove na sua frente, uma por uma, e o PokéNav pergunta **apagar?** nove vezes, e ele responde nove vezes.',
    'Na sétima — a que ela está olhando pra câmera — ele para uns três segundos antes de confirmar.',
    'Na nona, a mão dele treme um pouco.',
    fala('Ezra', 'Isso era a coisa mais importante que já aconteceu comigo.'),
    c17_eu('Eu sei.'),
    fala('Ezra', 'Você tá cert{o|a}. Eu sei que você tá cert{o|a}.'),
    'Ele guarda o PokéNav no bolso.',
    fala('Ezra', 'Mas isso era a coisa mais importante que já aconteceu comigo.'),
    'E ele fala isso duas vezes porque precisa que fique claro que ele sabe as duas coisas ao mesmo tempo.'
  ],
  ef:{flag:'fotos_apagadas', limpaFlag:'foto_vazou',
      rep:{eixo:'bom',delta:3,motivo:'Protegeu um lendário apagando a única prova dele'},
      npc:c17_npc('Ezra', 4, 'Apagou as nove fotos de Mew, uma por uma, porque você pediu.'),
      moral:-5,
      registrar:'Ezra apagou as nove fotos.',
      presagio:'Ele falou duas vezes. Ele precisava que ficasse claro.'},
  escolhas:[
    {texto:'"Agora me leva lá. Só nós dois."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"E agora a gente esquece que isso existiu."', vai:'c17_esqueceu'},
    {texto:'"Me descreve tudo. Pra mim."', vai:'c17_descreveu'},
    {texto:'"Quando eu subir, vem comigo."', vai:'c17_convidou_teo'}
  ]
},

c17_descreveu:{
  texto:[
    c17_eu('Me descreve tudo. Pra mim. Agora, antes de você esquecer.'),
    fala('Ezra', 'Por quê?'),
    c17_eu('Porque você apagou as fotos, e daqui a dez anos você vai achar que inventou.'),
    'Ele para.',
    fala('Ezra', 'Ah.'),
    'E aí ele descreve.',
    'Por quarenta minutos, na calçada de um Centro Pokémon, um garoto de quinze anos descreve dois minutos da vida dele pra {um garoto|uma garota} de {idade} anos que vai anotando num caderno.',
    'O tamanho: menor que um Meowth, com a cauda mais comprida que o corpo. A cor: rosa, mas rosa de pele e não de pelo. O som: nenhum. Nenhum som nenhuma vez.',
    'A grama embaixo dela não mexia.',
    'Ela pairava a um metro e dez do chão, e ele sabe a altura porque tem um metro e setenta e ela batia no peito dele.',
    'E na sétima foto ela olhou pra câmera, e ele conta que naquele momento parou de respirar e que lembra disso melhor do que lembra do rosto do avô.',
    'Você anota tudo.',
    'Doze páginas.'
  ],
  ef:{flag:['descreveu_mew','registro_do_teo'],
      itens:{'Doze páginas de descrição':1},
      npc:c17_npc('Ezra', 7, 'Ditou por quarenta minutos a descrição do que viu, pra você anotar, depois de apagar as fotos.'),
      rep:{eixo:'bom',delta:5,motivo:'Transformou uma foto apagada em registro escrito'},
      moral:15,
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'Ezra ditou doze páginas de descrição de Mew, depois de apagar as fotos.',
      presagio:'Doze páginas. Não é prova. É testemunho anotado na hora.'},
  escolhas:[
    {texto:'"Agora me leva lá."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"Assina embaixo."', vai:'c17_assinou'},
    {texto:'"E agora a gente esquece."', vai:'c17_esqueceu'},
    {texto:'"Quando eu subir, vem comigo."', vai:'c17_convidou_teo'}
  ]
},

c17_assinou:{
  texto:[
    c17_eu('Assina embaixo.'),
    fala('Ezra', 'Como assim, assina?'),
    c17_eu('Assina, põe a data e a hora.'),
    'Ele olha as doze páginas.',
    fala('Ezra', 'Isso vira o quê?'),
    c17_eu('Vira uma coisa que existe.'),
    'Ele pega a caneta e assina, e escreve a data e a hora, e a letra dele é ruim.',
    'Depois fica olhando a própria assinatura.',
    fala('Ezra', 'Eu nunca assinei nada na vida.'),
    c17_eu('Você tem quinze anos.'),
    fala('Ezra', 'É.'),
    'Ele devolve a caneta.',
    fala('Ezra', 'Mas eu nunca assinei nada na vida.'),
    'E ele fala isso do jeito de quem acabou de descobrir que assinar é uma coisa que existe, e que ele pode fazer.'
  ],
  ef:{flag:['teo_assinou','registro_do_teo'],
      npc:c17_npc('Ezra', 9, 'Assinou as doze páginas com data e hora. Foi a primeira coisa que ele assinou na vida.'),
      rep:{eixo:'bom',delta:5,motivo:'Fez um depoimento virar documento'},
      moral:15,
      registrar:'Ezra assinou o depoimento, com data e hora.',
      presagio:'"Eu nunca assinei nada na vida." Agora ele sabe que pode.'},
  escolhas:[
    {texto:'"Agora me leva lá."', vai:'c17_rota23', ef:{flag:'teo_leva'}},
    {texto:'"E agora a gente esquece."', vai:'c17_esqueceu'},
    {texto:'"Quando eu subir, vem comigo."', vai:'c17_convidou_teo'},
    {texto:'Guardar as doze páginas e ir pra Rota 23 sozinh{o|a}.', vai:'c17_rota23'}
  ]
},

c17_esqueceu:{
  texto:[
    'Vocês não vão à clareira.',
    d=>c17_horasDoEzra() ? 'O Ezra vai pegar o próximo ônibus de volta pra casa.' : 'O Ezra volta pra casa a pé, do outro lado da cidade.',
    'Nenhum dos dois toca no assunto de novo.',
    'E é exatamente por isso que funciona.',
    'A única coisa que protege Mew é ninguém saber, e a única forma de ninguém saber é ninguém contar, e a única forma de ninguém contar é dois treinadores novos demais decidirem carregar em silêncio uma coisa grande demais.',
    'É a decisão mais madura da sua jornada.',
    'E ela não tem recompensa nenhuma, porque decisão madura nunca tem, e é por isso que quase ninguém toma.'
  ],
  ef:{flag:'protegeu_mew_pelo_silencio',
      moral:10,
      executar:d=>{ const L = Estado.lend(151); if (L) L.disposicao = 'passivo'; return []; },
      npc:c17_npc('Ezra', 6, 'Decidiram juntos não ir à clareira.'),
      registrar:'Escolheu não procurar Mew.',
      presagio:'Decisão madura nunca tem recompensa.'},
  escolhas:[
    {texto:'Ir com ele até a rodoviária.', vai:'c17_rodoviaria', cond:()=>c17_horasDoEzra() > 0},
    {texto:'Mudar de ideia e ir pra Rota 23.', vai:'c17_rota23'},
    {texto:'Guardar o envelope e seguir.', vai:'c17_fim', ef:C17_NAO_FOI}
  ]
},

c17_rodoviaria:{
  texto:[
    'Você vai com ele até a rodoviária, que fica a seis quarteirões, e vocês andam os seis quarteirões falando de coisa nenhuma.',
    'De time. De uma partida de anos atrás. De uma professora que os dois tiveram, que os dois odiavam e que agora, com a distância, os dois acham que era boa.',
    'Na plataforma, com o ônibus já de motor ligado, ele fala:',
    fala('Ezra', 'Eu vou contar pra minha mãe.'),
    c17_eu('Conta.'),
    fala('Ezra', 'Ela não vai acreditar.'),
    c17_eu('Não vai.'),
    'Ele sobe o primeiro degrau do ônibus e para.',
    fala('Ezra', 'Mas ela vai fingir que acredita, porque ela é minha mãe.'),
    'Ele sobe.',
    fala('Ezra', 'E isso já é bom.')
  ],
  ef:{flag:'levou_o_teo_na_rodoviaria',
      npc:c17_npc('Ezra', 7, 'Vocês andaram seis quarteirões falando de coisa nenhuma até a rodoviária.'),
      rep:{eixo:'bom',delta:2,motivo:'Andou seis quarteirões com alguém até a rodoviária'},
      moral:12},
  escolhas:[
    {texto:'Ficar na plataforma até o ônibus sair.', vai:'c17_fim', ef:C17_NAO_FOI},
    {texto:'Ir pra Rota 23 assim mesmo.', vai:'c17_rota23'}
  ]
},
/* ─────────────── A ROTA 23 ─────────────── */

c17_rota23:{
  texto:[
    d=>d.flags.c17_dormiu_no_posto
      ? 'Você sai de Viridian pelo oeste e chega na Rota 23 já sem luz. Passa a noite no primeiro posto de controle, na cadeira virada pra fora, com a porta encostada, e sobe a trilha de manhã cedo.'
      : 'Você sai de Viridian pelo oeste, sobe a Rota 22 até o portão de pedra e entra na Rota 23.',
    'A Rota 23 é a última antes do Caminho da Vitória: nove quilômetros de mato fechado entre duas paredes de rocha, com uma trilha de terra batida no meio e quatro postos de controle de alvenaria, um a cada três quilômetros.',
    'Os três primeiros estão vazios.',
    'Porta aberta, luz apagada, cadeira virada pra fora — e no terceiro, uma garrafa térmica em cima da mesa.',
    'Você abre a garrafa térmica.',
    'Tem café dentro. Frio, mas ainda líquido, ainda com cheiro.',
    'Isso não está vazio há semanas.',
    'Isso está vazio há dias.',
    d=>d.flags.teo_leva
      ? 'O Ezra vai na frente e não acha nenhum posto estranho, porque nunca viu nenhum deles ocupado.'
      : 'Do lado leste da trilha, perto do terceiro posto, tem um desvio no mato que você só vê porque parou pra olhar. Não é trilha de gente e não é trilha de Pokémon: é mato deitado num lugar só, como se alguém tivesse passado de joelhos.',
    d=>d.flags.teo_leva
      ? 'Perto do terceiro posto ele para e aponta o mato do lado leste. Foi por ali que ele se perdeu.'
      : d.flags.viu_as_fotos ? 'O Ezra disse que se perdeu da trilha. Se ele se perdeu em algum lugar, foi aqui.' : ''
  ],
  ef:{flag:['entrou_na_rota_23','postos_vazios_ha_dias','sabe_dos_postos_vazios'],
      executar:d=>{
        /* de Viridian até o terceiro posto: três horas de estrada; de noite, dorme no primeiro */
        Relogio.avancar(3);
        const h = c17_hora(d);
        if (h >= 18 || h < 6){ d.flags.c17_dormiu_no_posto = true; c17_ate(7); }
        return [];
      },
      registrar:'Os postos de controle da Rota 23 estão vazios há dias, não semanas.',
      presagio:'Café ainda líquido. Saíram faz pouco tempo.'},
  escolhas:[
    {texto:'Revistar o posto.', vai:'c17_o_posto'},
    {texto:d=>d.flags.teo_leva ? 'Seguir o Ezra pelo mato.' : 'Seguir o desvio pelo mato.', vai:'c17_a_clareira'},
    {texto:'Procurar marca de pneu na trilha.', vai:'c17_pneus_na_trilha'},
    {texto:'Subir até a boca do Caminho da Vitória.', vai:'c17_boca_do_caminho'}
  ]
},

c17_o_posto:{
  texto:[
    'O terceiro posto, o 23-C, tem quatro por quatro metros, uma mesa, duas cadeiras, um rádio na parede e um quadro de avisos.',
    'O rádio está ligado e sem sinal — só chiado, no volume três, há sabe-se lá quantos dias.',
    'No quadro de avisos tem três coisas.',
    d=>{ const dia = c17_diaRiscado(d);
         return dia ? `A escala de plantão do mês, com os nomes riscados a caneta a partir do dia ${dia === 1 ? 'primeiro' : porExtenso(dia)}.`
                    : 'A escala de plantão do mês, com os nomes riscados a caneta de cima a baixo.'; },
    'Um cartaz de procedimento de revista, de mil novecentos e noventa e um.',
    'E um bilhete escrito à mão, preso com percevejo, que claramente não é oficial:',
    '**"Quem passar aqui: a gente foi realocado. Não tem ninguém na 22 nem na 23. Se der problema no Caminho da Vitória, não tem quem buscar. Não é brincadeira. — Oswin, posto 23-C"**',
    'Alguém saiu do plantão sabendo que ia embora e parou pra escrever um bilhete pra desconhecidos.',
    'E prendeu com percevejo num quadro que ninguém mandou ele usar.'
  ],
  ef:{flag:['achou_o_bilhete_do_oswin','sabe_dos_postos_vazios'],
      rep:{eixo:'bom',delta:3,motivo:'Revistou o posto em vez de passar'},
      registrar:'Um servidor do posto 23-C deixou um bilhete: não há ninguém nas Rotas 22 e 23 pra buscar quem se machucar no Caminho.',
      presagio:'"Não é brincadeira." Escrito à mão e preso com percevejo.'},
  escolhas:[
    {texto:'Tentar o rádio.', vai:'c17_o_radio'},
    {texto:d=>d.flags.teo_leva ? 'Levar o bilhete e seguir o Ezra pelo mato.' : 'Levar o bilhete e seguir o desvio pelo mato.', vai:'c17_a_clareira',
     ef:{flag:'tem_o_bilhete', itens:{'Bilhete do posto 23-C':1}}},
    {texto:'Procurar marca de pneu na trilha.', vai:'c17_pneus_na_trilha', cond:d=>!d.flags.achou_os_pneus},
    {texto:'Subir até a boca do Caminho da Vitória.', vai:'c17_boca_do_caminho'}
  ]
},

c17_o_radio:{
  texto:[
    'Você aperta o botão do rádio.',
    c17_eu('Alô? Posto vinte e três C.'),
    'Chiado.',
    'Você tenta mais três vezes, e na quarta uma voz responde, e responde tão rápido que dá pra ouvir que tinha alguém do outro lado sentado esperando.',
    fala('a voz do rádio', 'Vinte e três C? Oswin?'),
    c17_eu('Não. Eu sou {um desafiante|uma desafiante}. O posto tá vazio.'),
    'Silêncio de uns quatro segundos.',
    fala('a voz do rádio', 'Quantos são vocês?'),
    d=>fala(d.jogador.nome, d.flags.teo_leva ? 'Dois.' : 'Só eu.'),
    'Mais silêncio.',
    fala('a voz do rádio', 'Escuta aqui, {garoto|garota}. Aqui é a central do Planalto. A gente tá com quatro pessoas onde devia ter quarenta, e não pode mandar ninguém.'),
    c17_eu('Por quê?'),
    fala('a voz do rádio', 'Isso eu não posso falar no rádio.'),
    'Uma pausa.',
    fala('a voz do rádio', 'Mas eu vou te falar uma coisa que eu posso: não sobe o Caminho da Vitória essa semana.'),
    c17_eu('E a convocação?'),
    fala('a voz do rádio', 'Foi mandada por um sistema automático que ninguém desligou.'),
    d=>d.flags.convocado_com_notificacao ? fala(d.jogador.nome, 'A minha veio na mão de um oficial.') : '',
    d=>d.flags.convocado_com_notificacao ? 'Chiado.' : '',
    d=>d.flags.convocado_com_notificacao ? fala('a voz do rádio', 'Então eu não sei quem mandou a sua.', 'baixo') : ''
  ],
  ef:{flag:['falou_na_central','convocacao_automatica'],
      rep:{eixo:'bom',delta:4,motivo:'Insistiu no rádio até alguém responder'},
      instabilidade:1,
      registrar:'A central do Planalto tem quatro pessoas onde deveria ter quarenta. As convocações saíram de um sistema automático que ninguém desligou.',
      presagio:'Um sistema que ninguém desligou. Foi assim que chamaram você.'},
  escolhas:[
    {texto:'"O que tá acontecendo aí em cima?"', vai:'c17_o_que_acontece'},
    {texto:d=>d.flags.teo_leva ? 'Desligar e seguir o Ezra pelo mato.' : 'Desligar e seguir o desvio pelo mato.', vai:'c17_a_clareira'},
    {texto:'Desligar e subir até a boca do Caminho.', vai:'c17_boca_do_caminho'},
    {texto:'Desligar e procurar marca de pneu na trilha.', vai:'c17_pneus_na_trilha', cond:d=>!d.flags.achou_os_pneus}
  ]
},

c17_o_que_acontece:{
  texto:[
    c17_eu('O que tá acontecendo aí em cima?'),
    'Chiado.',
    'Uns oito segundos de chiado, que num rádio é uma eternidade.',
    fala('a voz do rádio', 'Eu vou responder porque eu tô sozinho nessa sala e porque eu tenho vinte e três anos de casa.'),
    'A voz baixa um pouco.',
    d=>fala('a voz do rádio', `Desde ${c17_mes(d, C17_ELITE)}, três dos quatro da Elite não se apresentam. Não pediram licença, não pediram demissão, não avisaram.`),
    c17_eu('Sumiram?'),
    fala('a voz do rádio', 'Não sumiram. Estão vivos, a gente sabe onde estão, e estão em casa.'),
    'Pausa.',
    fala('a voz do rádio', 'Eles só não vêm.'),
    c17_eu('E o quarto?'),
    'Uma pausa mais longa.',
    fala('a voz do rádio', 'O quarto vem todo dia.'),
    'A voz fica ainda mais baixa.',
    d=>fala('a voz do rádio', `Chega às oito e fica de pé no meio da sala dele o expediente inteiro, numa ala aonde não sobe desafiante nenhum desde ${c17_mes(d, C17_DESAFIANTE)}.`),
    'Chiado.',
    d=>d.flags.convocado_com_notificacao
      ? fala('a voz do rádio', '{Garoto|Garota}, eu tô com quatro pessoas aqui e uma delas sou eu. E não fui eu que mandei te chamar.')
      : fala('a voz do rádio', '{Garoto|Garota}, eu tô com quatro pessoas aqui e uma delas sou eu, e a convocação que te mandaram foi um sistema.'),
    c17_eu('E se eu subir?'),
    d=>fala('a voz do rádio', `Se você subir, você vai ser {o primeiro|a primeira} em ${porExtenso(C17_DESAFIANTE)} meses.`)
  ],
  ef:{flag:'sabe_da_elite_vazia',
      rep:{eixo:'bom',delta:5,motivo:'Perguntou o que estava acontecendo e alguém respondeu'},
      instabilidade:2, moral:-8,
      registrar:d=>`Três dos quatro da Elite não se apresentam desde ${c17_mes(d, C17_ELITE)}. O quarto vai todo dia a uma ala aonde não sobe ninguém.`},
  escolhas:[
    {texto:'"Qual é o seu nome?"', vai:'c17_o_nome_dele'},
    {texto:d=>d.flags.teo_leva ? 'Desligar e seguir o Ezra pelo mato.' : 'Desligar e seguir o desvio pelo mato.', vai:'c17_a_clareira'},
    {texto:'Desligar e subir até a boca do Caminho.', vai:'c17_boca_do_caminho'},
    {texto:'Desligar e procurar marca de pneu na trilha.', vai:'c17_pneus_na_trilha', cond:d=>!d.flags.achou_os_pneus}
  ]
},

c17_o_nome_dele:{
  texto:[
    c17_eu('Qual é o seu nome?'),
    'Chiado.',
    fala('a voz do rádio', 'Por quê?'),
    c17_eu('Porque eu tô anotando tudo num caderno desde o dia em que saí de casa, e eu aprendi que nome importa.'),
    'Uma risada curta no rádio, distorcida pelo chiado.',
    ()=>{ Nomes.apresentar('a voz do rádio'); return fala('a voz do rádio', 'Roland. Central de comunicação do Planalto Indigo, vinte e três anos de casa, matrícula quatro mil cento e nove.'); },
    'Ele diz a matrícula sem você pedir.',
    fala('a voz do rádio', 'Anota a matrícula também, {garoto|garota}.'),
    c17_eu('Por quê?'),
    'Pausa.',
    fala('a voz do rádio', 'Porque eu falei uma coisa no rádio que eu não devia, e se alguém perguntar depois quem falou, eu quero que tenha resposta.'),
    'Ele desliga.',
    'E você fica com o botão do rádio na mão, num posto vazio, com o chiado de volta no volume três.'
  ],
  ef:{flag:['sabe_do_anselmo','provas_do_planalto'],
      itens:{'Matrícula 4.109 anotada':1},
      npc:c17_npc('Roland', 5, 'Te deu o nome e a matrícula dele pelo rádio, para que houvesse resposta se alguém perguntasse.'),
      rep:{eixo:'bom',delta:5,motivo:'Perguntou o nome e recebeu a matrícula junto'},
      registrar:'Roland, matrícula 4.109, central de comunicação do Planalto Indigo.',
      presagio:'Ele deu a matrícula sem você pedir.'},
  escolhas:[
    {texto:d=>d.flags.teo_leva ? 'Levar o bilhete do Oswin e seguir o Ezra pelo mato.' : 'Levar o bilhete do Oswin e seguir o desvio pelo mato.', vai:'c17_a_clareira',
     cond:d=>!d.flags.tem_o_bilhete, ef:{flag:'tem_o_bilhete', itens:{'Bilhete do posto 23-C':1}}},
    {texto:d=>d.flags.teo_leva ? 'Seguir o Ezra pelo mato.' : 'Seguir o desvio pelo mato.', vai:'c17_a_clareira'},
    {texto:'Subir até a boca do Caminho da Vitória.', vai:'c17_boca_do_caminho'},
    {texto:'Procurar marca de pneu na trilha.', vai:'c17_pneus_na_trilha', cond:d=>!d.flags.achou_os_pneus}
  ]
},

c17_boca_do_caminho:{
  texto:[
    'Você sobe os últimos três quilômetros da Rota 23 até onde ela acaba.',
    'E ela acaba numa coisa que não é porta e que funciona como porta: uma fenda na parede de rocha, de uns quatro metros de largura, com uma escada de pedra que sobe pra dentro do escuro.',
    'Ao lado dela, uma placa de metal esmaltado, parafusada na rocha, com a tinta descascando:',
    '**CAMINHO DA VITÓRIA — ACESSO RESTRITO A PORTADORES DE OITO INSÍGNIAS — APRESENTE-SE AO POSTO 23-D**',
    'O posto 23-D fica a trinta metros, e está vazio como os outros.',
    'Não tem ninguém pra quem se apresentar.',
    'Não tem catraca, não tem corrente, não tem cadeado.',
    'Só uma placa e uma fenda na rocha, e quatro quilômetros de escuro lá dentro.',
    d=>d.flags.teo_leva ? 'O Ezra para do seu lado e olha a placa. Depois olha a fenda. Depois a placa de novo.' : 'Você fica parad{o|a} na frente da fenda uns dois minutos.',
    d=>d.flags.teo_leva ? fala('Ezra', 'Cara.') : '',
    d=>d.flags.teo_leva ? 'Ele não fala mais nada por um tempo bem longo.' : '',
    d=>!d.flags.teo_leva ? '' : d.flags.teo_vai_junto ? fala('Ezra', 'Quando você subir, eu subo junto. Você disse.') : fala('Ezra', 'Eu podia entrar.')
  ],
  ef:{flag:'viu_a_boca_do_caminho',
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'A entrada do Caminho da Vitória está sem guarda, sem catraca e sem cadeado.',
      presagio:'Só uma placa. A regra inteira era uma pessoa numa cadeira.'},
  escolhas:[
    {texto:'"Podia. E não vai."', vai:'c17_nao_vai', cond:d=>!!d.flags.teo_leva && !d.flags.teo_vai_junto},
    {texto:'Entrar e subir, os dois.', vai:'c17_fim', cond:d=>!!d.flags.teo_leva && !!d.flags.teo_vai_junto && c17_temOito(d),
     ef:{flag:'c17_entrou_no_caminho'}},
    {texto:'Entrar e subir.', vai:'c17_fim', cond:d=>!d.flags.teo_leva && c17_temOito(d),
     ef:{flag:'c17_entrou_no_caminho'}},
    {texto:'Descer até a clareira.', vai:'c17_a_clareira'},
    {texto:'Procurar marca de pneu na trilha.', vai:'c17_pneus_na_trilha', cond:d=>!d.flags.achou_os_pneus},
    {texto:'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

c17_nao_vai:{
  texto:[
    c17_eu('Podia. E não vai.'),
    'Ele vira pra você.',
    fala('Ezra', 'Por quê? Não tem ninguém.'),
    c17_eu('Não tem ninguém hoje.'),
    'Você aponta a placa.',
    c17_eu('Um dia vai ter de novo, e a placa vai continuar aí, e você vai ter atravessado.'),
    fala('Ezra', 'E daí?'),
    c17_eu('E daí que aí a placa não vale mais nada pra mais ninguém.'),
    'Ele fica olhando a fenda por um tempo.',
    fala('Ezra', 'Cara, isso é a coisa mais chata que alguém já me falou.'),
    c17_eu('Eu sei.'),
    fala('Ezra', 'E é certo.'),
    c17_eu('Eu sei.'),
    'Ele dá dois passos pra trás.',
    fala('Ezra', 'Eu vou pegar as outras quatro.'),
    'E ele fala isso do jeito de quem acabou de decidir uma coisa grande na frente de uma parede de rocha, aos quinze anos, sem ninguém vendo além de você.'
  ],
  ef:{flag:'teo_vai_pegar_as_quatro',
      npc:c17_npc('Ezra', 9, 'Ficou na frente da entrada aberta do Caminho da Vitória e decidiu voltar para pegar as outras quatro insígnias.'),
      rep:{eixo:'bom',delta:5,motivo:'Convenceu alguém a não atravessar uma porta aberta'},
      moral:20,
      registrar:'O Ezra decidiu buscar as outras quatro insígnias em vez de atravessar a entrada sem guarda.',
      presagio:'Ele deu dois passos pra trás e não olhou mais pra fenda.'},
  escolhas:[
    {texto:'Descer com ele até a clareira.', vai:'c17_a_clareira'},
    {texto:'Entrar você, que tem as oito.', vai:'c17_fim', cond:c17_temOito, ef:{flag:'c17_entrou_no_caminho'}},
    {texto:'Descer a Rota 23 com ele.', vai:'c17_fim'}
  ]
},

c17_pneus_na_trilha:{
  texto:[
    'Você procura marca de pneu na trilha da Rota 23, que é uma trilha de terra batida de nove quilômetros onde não devia passar veículo nenhum.',
    'Você acha em quarenta minutos.',
    'Van. Pneu de van, carregada, com o sulco cheio de barro seco de dois dias.',
    'Ela entrou pela estrada de manutenção — que tem uma corrente com cadeado, e o cadeado está cortado com alicate e pendurado na própria corrente, do jeito que se deixa cadeado cortado quando se pretende voltar.',
    'As marcas descem da trilha principal pra dentro do mato, na direção leste.',
    d=>d.flags.teo_leva ? 'O Ezra olha pra onde as marcas vão e fica quieto, porque é a direção em que ele se perdeu.'
      : c17_jaNaClareira(d) ? 'E a direção leste é a direção da clareira.'
      : 'E a direção leste é a direção do desvio no mato.'
  ],
  ef:{flag:['achou_os_pneus','tem_gente_atras_do_mew'],
      executar:()=>{ Relogio.avancar(1); return []; },
      rep:{eixo:'bom',delta:3,motivo:'Procurou marca de pneu numa trilha onde não passa veículo'},
      registrar:'Uma van entrou na Rota 23 pela estrada de manutenção, com o cadeado cortado, na direção leste.'},
  escolhas:[
    {texto:'Seguir as marcas até a van.', vai:'c17_pneus', cond:c17_vanLa},
    {texto:'Ir pra clareira antes deles.', vai:'c17_a_clareira'},
    {texto:'Voltar ao posto e chamar a central pelo rádio.', vai:'c17_denunciou_van', cond:c17_vanLa},
    {texto:'Revistar o posto primeiro.', vai:'c17_o_posto'}
  ]
},

/* ─────────────── A CLAREIRA ─────────────── */

c17_a_clareira:{
  texto:[
    d=>d.flags.teo_leva ? 'O Ezra sai da trilha sem avisar, e você anda quarenta minutos de mato fechado atrás dele, que erra o caminho duas vezes e acha nas duas.'
      : Historia.jaAconteceu('c17_pneus') ? 'A clareira fica a oitocentos metros da estrada de terra, mato adentro, e não tem caminho pra ela.'
      : 'A clareira fica fora da trilha, a quarenta minutos de mato fechado, e não tem caminho pra ela.',
    'Você chega e para na borda.',
    'É redonda. Redonda de verdade — uns vinte metros de diâmetro, com a borda regular, num mato que não faz nada regular.',
    'A grama de dentro é mais alta e mais verde que a de fora.',
    'E não tem árvore caída, não tem toca, não tem trilha de Pokémon, não tem casca de Kakuna, não tem ninho, não tem osso.',
    'Você já andou muito mato desde que saiu de casa, e sabe o que tem em vinte metros de mato: tem osso, tem casca roída, tem penugem, tem merda de Pokémon.',
    'Aqui não tem nada.',
    'É um lugar onde nada acontece há muito tempo.',
    d=>Historia.jaAconteceu('c17_pneus') ? 'Daqui não dá pra ouvir o rádio da van.' : 'E na entrada do mato, a uns cem metros, tem marca de pneu. De uns dois dias.'
  ],
  ef:{flag:['chegou_na_clareira','achou_os_pneus','tem_gente_atras_do_mew'], limpaFlag:'protegeu_mew_pelo_silencio',
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'Chegou à clareira da Rota 23: vinte metros redondos onde não tem nada.',
      presagio:'Não tem osso. Em vinte metros de mato, não tem um osso.'},
  escolhas:[
    {texto:'Entrar e olhar as plantas de perto.', vai:'c17_as_plantas'},
    {texto:'Sentar no meio e esperar.', vai:'c17_esperou_mew'},
    {texto:'Seguir as marcas de pneu.', vai:'c17_pneus', cond:c17_vanLa},
    {texto:'Ir embora sem entrar.', vai:'c17_foi_embora_clareira'}
  ]
},

/* a volta à clareira, depois da primeira vez */
c17_clareira_de_novo:{
  texto:[
    'Você volta à clareira pelo mesmo caminho, e ela está igual: redonda, a grama mais alta que a de fora, nenhum som de dentro.',
    d=>d.flags.cacadores_chegaram_primeiro ? 'A grama do meio continua pisada em círculo.' : '',
    d=>d.flags.viu_mew && !c17_comMew(d) ? 'Ela não está.' : '',
    d=>d.flags.teo_leva ? 'O Ezra senta na borda, do lado de fora, e espera.' : ''
  ],
  escolhas:[
    {texto:'Entrar e olhar as plantas de perto.', vai:'c17_as_plantas'},
    {texto:'Sentar no meio e esperar.', vai:'c17_esperou_mew'},
    {texto:'Ficar até escurecer.', vai:'c17_ate_escurecer', cond:d=>!!d.flags.viu_mew},
    {texto:'Seguir as marcas de pneu.', vai:'c17_pneus', cond:c17_vanLa},
    {texto:'Subir até a boca do Caminho da Vitória.', vai:'c17_boca_do_caminho'},
    {texto:'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

c17_as_plantas:{
  texto:[
    d=>d.flags.andou_com_a_nair ? 'Você entra, agacha e olha as plantas de perto, porque andou uma manhã com uma mulher que conta Pokémon naquela ciclovia há trinta e um anos, e alguma coisa pegou.' : 'Você entra, agacha e olha as plantas de perto.',
    'E a clareira fica muito pior.',
    'Tem samambaia de encosta úmida ao lado de capim de terreno seco.',
    'Tem um pé de café — café, arbusto de cultivo, que não existe em mato nativo — de um metro e vinte, carregado.',
    'Tem três espécies de orquídea que você reconhece de placa de mirante e que crescem em altitudes diferentes.',
    'E tem um pé de goiaba no canto leste, carregado de fruta madura.',
    'Nenhuma dessas plantas deveria estar a menos de duzentos quilômetros das outras.',
    'Todas estão saudáveis.',
    'E o pé de goiaba tem fruta caída apodrecendo embaixo dele, o que quer dizer que ninguém come.',
    d=>d.flags.andou_com_a_nair ? 'Você já viu esse pé de goiaba antes. Não esse: um igual, na beira de um capinzal, com a Ylva anotando zero na prancheta.' : ''
  ],
  ef:{flag:['viu_as_plantas','entendeu_a_clareira'],
      rep:{eixo:'bom',delta:5,motivo:'Agachou e olhou as plantas'},
      instabilidade:1,
      registrar:'A clareira tem plantas de lugares que não combinam, todas saudáveis, e ninguém come a fruta.',
      presagio:'Fruta madura no chão, e nenhuma bicada.'},
  escolhas:[
    {texto:'Contar as espécies.', vai:'c17_contou_as_especies'},
    {texto:'Sentar no meio e esperar.', vai:'c17_esperou_mew'},
    {texto:'Seguir as marcas de pneu.', vai:'c17_pneus', cond:c17_vanLa},
    {texto:'Sair da clareira sem pisar em mais nada.', vai:'c17_foi_embora_clareira'},
    {texto:'Descer a Rota 23.', vai:'c17_fim', cond:d=>Historia.jaAconteceu('c17_foi_embora_clareira')}
  ]
},

c17_contou_as_especies:{
  texto:[
    'Você conta as espécies de planta da clareira.',
    'Leva duas horas, e você desenha as que não sabe o nome, que são a maior parte, e desenha mal.',
    'Quarenta e uma.',
    'Quarenta e uma espécies em vinte metros redondos.',
    'Uma mata de Kanto tem, num raio de vinte metros, entre oito e quinze.',
    'E aí, na quadragésima primeira, você acha a que quebra tudo.',
    'É pequena, rasteira, com folha carnuda e flor branca minúscula, crescendo em moita rente à borda leste.',
    'Você conhece essa planta.',
    d=>d.flags.viu_o_museu
      ? 'Ela está no museu de Pewter, num painel na parede da sala do Kabutops, entre as plantas do tempo dos fósseis, com uma legenda que diz **"espécie extinta — reconstituição a partir de impressão fóssil"**.'
      : 'Ela está no livro de ciências da escola, na página das plantas do tempo dos fósseis, com uma legenda que diz **"espécie extinta — reconstituição a partir de impressão fóssil"**.',
    'Você senta na grama alta, do lado de uma planta extinta, viva.'
  ],
  ef:{flag:['contou_as_especies','achou_a_extinta'],
      executar:()=>{ Relogio.avancar(2); return []; },
      rep:{eixo:'bom',delta:7,motivo:'Contou quarenta e uma espécies e reconheceu a que não devia existir'},
      instabilidade:2, moral:-5,
      registrar:'Há 41 espécies de planta na clareira, e uma delas só existe como impressão fóssil.',
      presagio:'Reconstituição a partir de impressão fóssil. E ela está crescendo, viva, na borda leste.'},
  escolhas:[
    {texto:'Levar uma muda.', vai:'c17_levou_a_muda'},
    {texto:'Não levar nada, sentar no meio e esperar.', vai:'c17_esperou_mew'},
    {texto:'Sair da clareira.', vai:'c17_foi_embora_clareira'},
    {texto:'Descer a Rota 23.', vai:'c17_fim', cond:d=>Historia.jaAconteceu('c17_foi_embora_clareira')}
  ]
},

c17_levou_a_muda:{
  texto:[
    'Você tira uma muda com a terra junto, pra raiz não sentir, e enrola num saco plástico.',
    'E fica com ela na mão.',
    'Uma planta extinta, viva, numa mão de {idade} anos, no meio de um mato da Rota 23.',
    'E aí você pensa, e é um pensamento ruim:',
    'se você levar isso pra qualquer pessoa em Kanto que saiba o que é, essa clareira vira um sítio de pesquisa em três semanas.',
    'E se você não levar, ela continua sendo vinte metros de mato que ninguém acha.',
    'Você fica de pé no meio da clareira com a muda na mão uns quatro minutos.',
    'Não tem resposta boa. Tem duas respostas, e as duas custam.'
  ],
  ef:{flag:'tem_a_muda', itens:{'Muda de flor branca':1},
      presagio:'A terra da muda ainda está úmida dentro do saco.'},
  escolhas:[
    {texto:'Replantar no mesmo lugar.', vai:'c17_replantou'},
    {texto:'Guardar e sentar no meio pra esperar.', vai:'c17_esperou_mew'},
    {texto:'Guardar e sair da clareira.', vai:'c17_foi_embora_clareira'},
    {texto:'Guardar e descer a Rota 23.', vai:'c17_fim', cond:d=>Historia.jaAconteceu('c17_foi_embora_clareira')}
  ]
},

c17_replantou:{
  texto:[
    'Você replanta.',
    'Cava o buraco com as mãos, põe a muda, aperta a terra em volta e rega com a água da sua garrafa.',
    'Leva dez minutos, e é a coisa mais idiota que dá pra fazer com uma descoberta científica de primeira grandeza.',
    'Você senta do lado dela depois, com as mãos sujas.',
    d=>d.flags.teo_leva ? 'O Ezra senta do seu lado.' : 'E fica ali, sozinh{o|a}, no meio de vinte metros de grama alta, com as mãos sujas de terra.',
    d=>d.flags.teo_leva ? fala('Ezra', 'O que era aquilo?') : '',
    d=>d.flags.teo_leva ? fala(d.jogador.nome, 'Uma planta que não existe mais.') : '',
    d=>d.flags.teo_leva ? fala('Ezra', 'E você replantou.') : '',
    d=>d.flags.teo_leva ? fala(d.jogador.nome, 'Eu replantei.') : '',
    d=>d.flags.teo_leva ? 'Ele assente devagar.' : '',
    d=>d.flags.teo_leva ? fala('Ezra', 'Beleza.') : ''
  ],
  ef:{flag:'replantou_a_muda', limpaFlag:'tem_a_muda', perdeItens:{'Muda de flor branca':1},
      rep:{eixo:'bom',delta:5,motivo:'Replantou uma descoberta científica de primeira grandeza'},
      moral:15,
      registrar:'Replantou a muda no mesmo lugar.',
      presagio:'Terra apertada em volta de uma planta extinta, e as suas mãos sujas.'},
  escolhas:[
    {texto:'Sentar no meio e esperar.', vai:'c17_esperou_mew'},
    {texto:'Seguir as marcas de pneu.', vai:'c17_pneus', cond:c17_vanLa},
    {texto:'Sair da clareira.', vai:'c17_foi_embora_clareira'},
    {texto:'Descer a Rota 23.', vai:'c17_fim', cond:d=>Historia.jaAconteceu('c17_foi_embora_clareira')}
  ]
},

c17_foi_embora_clareira:{
  texto:[
    d=>c17_entrouNaClareira(d)
      ? 'Você sai da clareira pelo mesmo lugar por onde entrou, pisando nas próprias pegadas, sem sentar e sem esperar.'
      : 'Você fica na borda da clareira, olha o meio dela, e não entra.',
    d=>!d.flags.teo_leva ? 'Uns dois minutos depois, você vira as costas.'
      : c17_entrouNaClareira(d) ? 'O Ezra vem atrás sem perguntar nada.' : 'O Ezra te olha sem entender.',
    d=>d.flags.teo_leva && !c17_entrouNaClareira(d) ? fala('Ezra', 'Você não vai nem…') : '',
    d=>d.flags.teo_leva && !c17_entrouNaClareira(d) ? fala(d.jogador.nome, 'Não.') : '',
    d=>d.flags.teo_leva ? 'Ele te acompanha de volta, e na metade do caminho fala uma coisa só:' : '',
    d=>d.flags.teo_leva ? fala('Ezra', 'Tá certo.') : '',
    'Você não sabe se ela estava lá.',
    'E é essa a parte do custo: não é que você abriu mão de ver.',
    'É que você abriu mão de saber se teria visto.'
  ],
  ef:{flag:'saiu_sem_esperar',
      rep:{eixo:'bom',delta:3,motivo:'Saiu da clareira sem esperar por Mew'},
      moral:5,
      executar:d=>{
        if (!c17_entrouNaClareira(d)) d.flags.nao_entrou_na_clareira = true;
        const L = Estado.lend(151); if (L) L.disposicao = 'passivo';
        return [];
      },
      registrar:d=>c17_entrouNaClareira(d) ? 'Saiu da clareira sem esperar.' : 'Chegou à borda da clareira e não entrou.',
      presagio:'Atrás de você, a grama alta da clareira não mexe.'},
  escolhas:[
    {texto:'Mudar de ideia, voltar e sentar no meio.', vai:'c17_esperou_mew'},
    {texto:'Seguir as marcas de pneu.', vai:'c17_pneus', cond:c17_vanLa},
    {texto:'Subir até a boca do Caminho da Vitória.', vai:'c17_boca_do_caminho'},
    {texto:'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

/* ─────────────── A VAN ─────────────── */

c17_pneus:{
  texto:[
    'As marcas levam a uma estrada de terra a oitocentos metros da clareira, onde tem uma van parada e quatro pessoas montando alguma coisa.',
    'Não é gente de empresa. Não tem crachá, não tem caminhão, não tem ninguém de terno.',
    'É gente mais jovem, com equipamento mais barato, e mais animada — do jeito errado.',
    'Uma rede de náilon de pesca esticada entre duas árvores. Uma caixa térmica. Duas cadeiras dobráveis. Um rádio tocando música.',
    d=>d.flags.teo_leva ? 'O Ezra fica agachado do seu lado no mato, sem respirar alto.' : '',
    fala('o mais velho dos quatro', '…se a gente pegar, a gente não vende pra empresa nenhuma, a gente vende pra comissão, que é quem paga mais…'),
    fala('o mais novo dos quatro', 'Comissão? Que comissão?'),
    fala('o mais velho dos quatro', 'Sei lá, cara. Foi o nome que tava no anúncio.'),
    fala('o mais novo dos quatro', 'E se a foto for montagem?'),
    fala('o mais velho dos quatro', 'Montagem de quê? Você viu a grama.'),
    fala('o mais novo dos quatro', 'E o anúncio tinha telefone?'),
    fala('o mais velho dos quatro', 'Tinha uma caixa postal.'),
    'Eles não são organizados.',
    'São quatro pessoas que viram uma foto e vieram, com uma rede de pesca e uma caixa térmica.',
    'Isso é pior.',
    'Organização tem procedimento, tem ética de fachada, tem alguém que responde. Eles não têm nada.'
  ],
  ef:{flag:['achou_os_caçadores_de_mew','sabe_do_anuncio'],
      registrar:'Quatro pessoas acampadas perto da clareira, com uma rede de pesca, atrás de uma recompensa anunciada por uma "comissão".',
      presagio:'Uma caixa postal. É esse o endereço de quem está pagando.'},
  escolhas:[
    {texto:'Sair do mato e perguntar que anúncio é esse.', vai:'c17_que_anuncio'},
    {texto:'Sabotar a van sem eles verem.', vai:'c17_sabotou_van'},
    {texto:'Voltar ao posto e chamar a central pelo rádio.', vai:'c17_denunciou_van'},
    {texto:'Enfrentar os quatro.', vai:'c17_luta_cacadores_mew'},
    {texto:'Deixar os quatro e voltar pra clareira.', vai:'c17_a_clareira'}
  ]
},

c17_que_anuncio:{
  texto:[
    'Você sai do mato e aparece.',
    'Os quatro levam um susto, e um deles derruba a caixa térmica, e por uns dez segundos é a cena menos ameaçadora que você já viu.',
    c17_eu('Que anúncio?'),
    fala('o mais velho dos quatro', 'Como assim?'),
    c17_eu('Vocês falaram de um anúncio. Que anúncio?'),
    'O mais velho — que tem uns vinte e seis anos — pega uma folha dobrada do bolso de trás.',
    'É um recorte de classificado, de um jornal de cidade pequena.',
    '**"COMPRA-SE. Informação verificável sobre avistamento de espécime raro não catalogado, região central de Kanto. Pagamento à vista, sigilo garantido. Resposta para Caixa Postal 11, agência central de Saffron."**',
    d=>c17_sabeDoOnze(d) ? 'Caixa Postal onze. Agência central de Saffron.' : 'Uma caixa postal numa agência de Saffron, e mais nada: nem nome, nem telefone.',
    d=>c17_sabeDoOnze(d) ? 'Você fica olhando o recorte na mão de um rapaz de vinte e seis anos, numa estrada de terra da Rota 23.' : '',
    d=>c17_sabeDoOnze(d) ? 'Onze.' : ''
  ],
  ef:{flag:['viu_o_anuncio','provas_do_mew'],
      rep:{eixo:'bom',delta:5,motivo:'Saiu do mato e perguntou'},
      instabilidade:1,
      registrar:'O anúncio manda responder pra Caixa Postal 11 da agência central de Saffron.',
      presagio:d=>c17_sabeDoOnze(d) ? 'Onze, de novo.' : 'Pagamento à vista, sigilo garantido.'},
  escolhas:[
    {texto:'"Senta. Deixa eu contar o que eu vi esse ano."', vai:'c17_contou_pros_quatro'},
    {texto:'"Me dá esse recorte."', vai:'c17_pegou_o_recorte'},
    {texto:'Voltar ao posto e chamar a central pelo rádio.', vai:'c17_denunciou_van'},
    {texto:'Deixar os quatro e voltar pra clareira.', vai:'c17_a_clareira'}
  ]
},

c17_contou_pros_quatro:{
  texto:[
    c17_eu('Senta. Deixa eu contar o que eu vi esse ano.'),
    'E você conta.',
    d=>{
      const o = [];
      if (d.flags.viu_os_doze) o.push('um andar da Silph em Saffron com doze tanques');
      if (d.flags.sabe_do_deposito) o.push('um armazém em Celadon com gaiolas numeradas');
      if (d.flags.sabe_da_planilha_71) o.push('uma reserva em Fuchsia com uma planilha de mil novecentos e setenta e um');
      const tudo = o.length ? 'sobre ' + (o.length > 1 ? o.slice(0,-1).join(', sobre ') + ' e sobre ' + o[o.length-1] : o[0]) : 'tudo o que viu desde que saiu de casa';
      return `Quatro pessoas com uma caixa térmica e uma rede de pesca, numa estrada de terra, ouvem {um garoto|uma garota} de {idade} anos contar ${tudo}.`;
    },
    'Leva vinte minutos.',
    'Ninguém interrompe.',
    d=>d.flags.tem_o_recorte
      ? 'No fim, o de vinte e seis anos está sentado na cadeira dobrável, com as mãos vazias, e não olha pra cima.'
      : 'No fim, o de vinte e seis anos está sentado na cadeira dobrável com o recorte na mão, e não olha pra cima.',
    fala('o mais velho dos quatro', 'A gente ia ganhar oito mil.'),
    c17_eu('Cada um?'),
    fala('o mais velho dos quatro', 'Os quatro.'),
    d=>d.flags.tem_o_recorte ? 'Ele esfrega as mãos uma na outra.' : 'Ele dobra o recorte.',
    fala('o mais velho dos quatro', 'Dois mil cada.'),
    'Ele olha a rede de náilon esticada entre as duas árvores.',
    fala('o mais velho dos quatro', 'Eu larguei a firma pra vir.')
  ],
  ef:{flag:'contou_pros_quatro',
      npc:c17_npc('Caçadores da Rota 23', 3, 'Ouviram por vinte minutos o que você viu esse ano, sentados em cadeiras dobráveis.'),
      rep:{eixo:'bom',delta:6,motivo:'Contou tudo a quem ia entregar'},
      moral:10,
      registrar:'Contou aos quatro da van o que viu esse ano. Eles iam ganhar dois mil cada.',
      presagio:'Dois mil cada.'},
  escolhas:[
    {texto:'"Desmonta e vai embora."', vai:'c17_desmontaram'},
    {texto:'"Me dá o recorte."', vai:'c17_pegou_o_recorte'},
    {texto:'"Isso vale mais contado do que vendido."', vai:'c17_testemunhas'},
    {texto:'Voltar pra clareira e deixar eles decidirem.', vai:'c17_a_clareira'}
  ]
},

c17_desmontaram:{
  texto:[
    c17_eu('Desmonta e vai embora.'),
    'Eles desmontam.',
    'Leva quarenta minutos, e você fica ali os quarenta minutos, e no meio deles acaba ajudando a enrolar a rede de náilon, porque enrolar rede de náilon sozinho é impossível.',
    'O de vinte e seis anos guarda a rede no bagageiro.',
    fala('o mais velho dos quatro', 'Se a gente não pegar, outro pega.'),
    c17_eu('Provavelmente.'),
    fala('o mais velho dos quatro', 'E aí?'),
    d=>d.flags.equipe_devolveu_a_pena ? 'Você pensa na frase antes de falar, porque essa frase você já ouviu numa ilha e ela é perigosa.' : 'Você pensa na frase antes de falar, porque ela é perigosa.',
    c17_eu('E aí não vai ter sido você.'),
    'Ele fecha o bagageiro.',
    'E fica com a mão em cima dele uns cinco segundos.',
    fala('o mais velho dos quatro', 'É pouco.'),
    c17_eu('É.'),
    'Ele entra na van.',
    fala('o mais velho dos quatro', 'Mas é alguma coisa.')
  ],
  ef:{flag:'caçadores_foram_embora',
      npc:c17_npc('Caçadores da Rota 23', 5, 'Desmontaram o acampamento e foram embora. Você ajudou a enrolar a rede.'),
      rep:{eixo:'bom',delta:6,motivo:'Convenceu quatro pessoas a irem embora e ajudou a desmontar'},
      moral:15, instabilidade:-1,
      executar:()=>{ Relogio.avancar(1); return []; },
      registrar:'Os quatro da van desmontaram o acampamento e foram embora.'},
  escolhas:[
    {texto:'Voltar pra clareira.', vai:'c17_a_clareira'},
    {texto:'Subir até a boca do Caminho da Vitória.', vai:'c17_boca_do_caminho'},
    {texto:'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

c17_testemunhas:{
  texto:[
    c17_eu('Isso vale mais contado do que vendido.'),
    fala('o mais velho dos quatro', 'Contado pra quem?'),
    c17_eu('Pra quem publica.'),
    'Você explica: quatro pessoas que responderam a um anúncio de classificado, dispostas a dizer o nome do jornal, a data da edição e o valor oferecido.',
    'Isso não é boato.',
    'É gente com nome e com documento.',
    'O de vinte e seis anos olha os outros três.',
    fala('o mais velho dos quatro', 'A gente vai ter que dar nome?'),
    c17_eu('Vai.'),
    fala('o mais velho dos quatro', 'E aí o pessoal da caixa postal descobre que foi a gente.'),
    c17_eu('Descobre.'),
    'Silêncio comprido na estrada de terra.',
    'E aí a única mulher do grupo, que não tinha falado nada até agora, fala:',
    fala('a mulher dos quatro', 'Eu dou.'),
    'Os outros três olham pra ela.',
    ()=>{ Nomes.apresentar('a mulher dos quatro'); return fala('a mulher dos quatro', 'Marla Clover. Pode escrever.'); },
    d=>fala('a mulher dos quatro', `Eu tenho quarenta e um anos, e eu tô aqui porque perdi o emprego em ${c17_mes(d, C17_DEMISSAO)}.`),
    'Ela dobra a cadeira.',
    fala('a mulher dos quatro', 'E eu não vou explicar pra minha filha que eu vim caçar Pokémon, nem que eu me escondi depois.')
  ],
  ef:{flag:['tem_testemunhas','provas_do_mew'],
      npc:c17_npc('Caçadores da Rota 23', 7, 'Uma delas se ofereceu para testemunhar com nome, porque não ia explicar isso à filha.'),
      rep:{eixo:'bom',delta:7,motivo:'Transformou quatro caçadores em quatro testemunhas'},
      moral:20,
      registrar:'Ao menos uma das quatro pessoas da van vai testemunhar sobre o anúncio, com nome.'},
  escolhas:[
    {texto:'Anotar os nomes e os contatos.', vai:'c17_anotou_os_nomes'},
    {texto:'"Me dá o recorte."', vai:'c17_pegou_o_recorte'},
    {texto:'Deixar os quatro e voltar pra clareira.', vai:'c17_a_clareira'},
    {texto:'Descer a Rota 23 com isso.', vai:'c17_fim'}
  ]
},

c17_anotou_os_nomes:{
  texto:[
    'Você anota os quatro nomes, os quatro endereços, os quatro telefones, e o nome e a data do jornal.',
    ()=>{ Nomes.apresentar('o mais velho dos quatro'); return 'O primeiro da lista é o mais velho, Brent Fennel, que soletra o sobrenome duas vezes pra você não errar.'; },
    'E depois faz uma coisa que aprendeu vendo gente que anota pra viver:',
    'lê tudo em voz alta pra eles conferirem, e eles corrigem duas coisas, e você anota as correções.',
    'E no fim pergunta se pode escrever, do lado de cada nome, se a pessoa autoriza ser citada.',
    'Três autorizam.',
    'Um não.',
    'E você anota "não autoriza" do lado do quarto nome, com a mesma caneta, sem discutir.',
    'E o quarto — um rapaz de uns vinte anos, o mais quieto dos quatro — olha você anotar isso e fala a única coisa que ele fala o dia inteiro:',
    fala('o rapaz quieto', 'Valeu.')
  ],
  ef:{flag:['anotou_os_quatro','tem_testemunhas'],
      itens:{'Quatro depoimentos anotados':1},
      rep:{eixo:'bom',delta:6,motivo:'Anotou, leu em voz alta e respeitou quem não autorizou'},
      moral:15,
      registrar:'Anotou quatro depoimentos sobre o anúncio, três com autorização pra citar.',
      presagio:'"Não autoriza", com a mesma caneta.'},
  escolhas:[
    {texto:'"Me dá o recorte também."', vai:'c17_pegou_o_recorte'},
    {texto:'"Agora desmonta e vai embora."', vai:'c17_desmontaram'},
    {texto:'Deixar os quatro e voltar pra clareira.', vai:'c17_a_clareira'},
    {texto:'Descer a Rota 23 com os depoimentos.', vai:'c17_fim'}
  ]
},

c17_pegou_o_recorte:{
  texto:[
    c17_eu('Me dá esse recorte.'),
    'Ele olha o papel dobrado na mão.',
    fala('o mais velho dos quatro', 'Isso aqui é meu.'),
    c17_eu('É.'),
    'Ele fica olhando.',
    'E depois entrega.',
    fala('o mais velho dos quatro', 'Toma.'),
    'Um recorte de classificado de jornal de cidade pequena, dobrado em quatro, com o vinco do meio já rasgando de tanto ser aberto e fechado.',
    'Alguém abriu e fechou esse papel muitas vezes.'
  ],
  ef:{flag:['tem_o_recorte','provas_do_mew'],
      itens:{'Recorte de classificado':1},
      rep:{eixo:'bom',delta:3,motivo:'Saiu com o anúncio na mão'},
      registrar:'Ficou com o recorte do classificado da Caixa Postal 11.',
      presagio:'O vinco do meio já está rasgando.'},
  escolhas:[
    {texto:'"Desmonta e vai embora."', vai:'c17_desmontaram'},
    {texto:'"Isso vale mais contado do que vendido."', vai:'c17_testemunhas'},
    {texto:'Deixar os quatro e voltar pra clareira.', vai:'c17_a_clareira'},
    {texto:'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

c17_luta_cacadores_mew:{
  texto:[
    'Quatro pessoas contra você.',
    'Eles não lutam bem — o time deles é de rota, sem estratégia, com Pokémon cansado —, mas são quatro, e quatro é quatro.'
  ],
  ef:{moral:-5},
  batalha:{dex:34, nivel:48, tipo:'treinador', treinador:'Caçadores de recompensa', fuga:true,
           timeExtra:[{dex:31, nivel:48},{dex:73, nivel:47}],
           vitoria:'c17_venceu_cacadores', derrota:'c17_perdeu_cacadores', fuga2:'c17_a_clareira', gameover:'gameover'}
},

c17_venceu_cacadores:{
  texto:[
    'Você derruba os três times, e o quarto nem solta Pokébola.',
    fala('o mais velho dos quatro', 'A gente só queria…'),
    c17_eu('Eu sei o que vocês queriam.'),
    'Eles recolhem os Pokémon caídos, guardam a caixa térmica e enrolam a rede em silêncio, e a única mulher do grupo não olha pra você uma vez.',
    'Eles vão embora na van.',
    'Você fica na estrada de terra com a sensação de que não resolveu nada. Só mudou a data.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Enfrentou caçadores de recompensa sozinh{o|a}'},
      flag:'espantou_cacadores_mew', moral:-5,
      registrar:'Espantou os quatro da van na base da luta.'},
  escolhas:[
    {texto:'Voltar pra clareira.', vai:'c17_a_clareira'},
    {texto:'Voltar ao posto e chamar a central pelo rádio.', vai:'c17_denunciou_van'},
    {texto:'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

c17_perdeu_cacadores:{
  texto:[
    'Quatro contra um é quatro contra um.',
    'Eles te deixam sentad{o|a} na estrada de terra, pegam o que querem da sua mochila — e pegam pouco, o que é pior, porque quer dizer que eles não são ladrões, só estão com pressa —, e seguem pra clareira.',
    'Você leva duas horas pra conseguir andar direito e chegar lá.',
    'Quando você chega, eles já foram, e a clareira está vazia.',
    'Completamente vazia — e a grama alta do meio está pisada em círculo, como se quatro pessoas tivessem procurado alguma coisa ali a tarde inteira.',
    d=>d.flags.viu_as_plantas ? 'E o pé de goiaba do canto leste está com dois galhos quebrados, porque alguém subiu nele pra olhar de cima.' : ''
  ],
  ef:{hp:-7, causa:'Quatro contra um na Rota 23', dinheiro:-1500,
      flag:['cacadores_chegaram_primeiro','chegou_na_clareira','achou_os_pneus'], limpaFlag:'protegeu_mew_pelo_silencio',
      instabilidade:1, moral:-10,
      executar:()=>{ Relogio.avancar(2); return []; },
      registrar:'Os caçadores chegaram à clareira antes de você. A grama ficou pisada em círculo.',
      presagio:d=>d.flags.viu_as_plantas ? 'Alguém subiu na goiabeira pra olhar de cima.' : 'Grama pisada em círculo, e mais nada.'},
  escolhas:[
    {texto:'Sentar no meio e esperar mesmo assim.', vai:'c17_esperou_mew'},
    {texto:'Voltar ao posto e chamar a central pelo rádio.', vai:'c17_denunciou_van'},
    {texto:'Sair da clareira.', vai:'c17_foi_embora_clareira'},
    {texto:'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

c17_sabotou_van:{
  texto:[
    'Você espera os quatro ficarem de costas, corta duas mangueiras e leva a chave que estava na ignição — porque gente animada demais deixa a chave na ignição.',
    'A van não sai do lugar.',
    'Eles vão levar meio dia pra resolver, e meio dia é tudo de que você precisa.',
    'Você joga a chave no mato a duzentos metros e depois volta e pega de novo, porque deixar quatro pessoas sem carro numa estrada de terra, a duas rotas da cidade mais próxima, é uma coisa que você não consegue fazer.',
    'Você deixa a chave em cima do pneu dianteiro esquerdo.',
    'Uma hora eles acham.'
  ],
  ef:{flag:'sabotou_a_van',
      rep:{eixo:'bom',delta:2,motivo:'Ganhou meio dia e deixou a chave em cima do pneu'},
      registrar:'Sabotou a van dos caçadores e deixou a chave em cima do pneu.'},
  escolhas:[
    {texto:'Voltar pra clareira antes deles.', vai:'c17_a_clareira'},
    {texto:'Sair do mato e perguntar que anúncio é esse.', vai:'c17_que_anuncio'},
    {texto:'Voltar ao posto e chamar a central pelo rádio.', vai:'c17_denunciou_van'},
    {texto:'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

c17_denunciou_van:{
  texto:[
    'Você volta ao posto 23-C e chama a central pelo rádio.',
    d=>d.flags.sabe_do_anselmo ? 'O Roland atende na primeira chamada.' : d.flags.falou_na_central ? 'A mesma voz atende na primeira chamada.' : 'Na quarta chamada atende uma voz de homem, rápido, de quem estava sentado esperando.',
    fala('a voz do rádio', 'Central.'),
    d=>fala(d.jogador.nome, d.flags['achou_os_caçadores_de_mew']
      ? 'Tem quatro pessoas acampadas com uma van na estrada de manutenção da Rota 23, perto do posto 23-C. Com rede.'
      : 'Tem uma van na estrada de manutenção da Rota 23, perto do posto 23-C. Cortaram o cadeado.'),
    'Chiado.',
    fala('a voz do rádio', 'Eu tenho quatro pessoas aqui, e uma delas sou eu, e outra é o motorista.'),
    'Mais chiado.',
    fala('a voz do rádio', 'Vai dar uma hora e quarenta.'),
    'Dá duas horas.',
    d=>d.flags.espantou_cacadores_mew
      ? 'A caminhonete da Liga pega a van na saída da estrada de manutenção, antes do asfalto.'
      : 'A caminhonete da Liga sobe a estrada de manutenção e para atrás da van.',
    d=>d.flags['achou_os_caçadores_de_mew']
      ? 'Os quatro são detidos por acampamento irregular em área restrita — não por caça, porque não dá pra provar caça.'
      : 'Dentro dela tem quatro pessoas, uma rede de pesca e uma caixa térmica, e as quatro são detidas por acampamento irregular em área restrita — não por caça, porque não dá pra provar caça.',
    fala('a voz do rádio', 'Multa e liberação em dois dias. A van fica três semanas no pátio.'),
    'Três semanas é uma coisa real.',
    d=>d.flags.sabe_do_anselmo ? 'E no fim o Roland fala mais uma coisa:' : '',
    d=>d.flags.sabe_do_anselmo ? fala('a voz do rádio', 'Anota no seu caderno que a gente veio.') : '',
    d=>d.flags.sabe_do_anselmo ? fala(d.jogador.nome, 'Por quê?') : '',
    d=>d.flags.sabe_do_anselmo ? fala('a voz do rádio', 'Porque quando escreverem sobre isso depois, vão escrever que ninguém veio.') : ''
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Usou o sistema onde o sistema ainda funcionava'},
      flag:'liga_pegou_a_van',
      executar:()=>{ Relogio.avancar(2); return []; },
      registrar:'A Liga deteve as quatro pessoas da van por acampamento irregular. A van ficou apreendida por três semanas.'},
  escolhas:[
    {texto:d=>d.flags.teo_leva ? 'Seguir o Ezra pelo mato até a clareira.' : 'Voltar pra clareira.', vai:'c17_a_clareira'},
    {texto:'Subir até a boca do Caminho da Vitória.', vai:'c17_boca_do_caminho'},
    {texto:'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

/* ─────────────── MEW ─────────────── */

c17_esperou_mew:{
  texto:[
    'Você senta no meio da clareira.',
    d=>d.flags.teo_leva ? 'O Ezra senta a três metros e fica quieto, o que pra ele é um esforço físico visível. Ele mexe no cadarço quatro vezes na primeira meia hora e depois para.' : 'Você fica sozinh{o|a} no meio de vinte metros de grama alta.',
    'Duas horas.',
    'Duas horas de verdade: a perna dorme aos quarenta minutos, a panturrilha dá cãibra aos setenta, e aos cem você já está pensando em desistir e ficando só por teimosia.',
    d=>d.flags.c17_mew_de_manha ? 'Escurece antes de qualquer coisa acontecer, e você passa a noite ali mesmo, cochilando sentad{o|a} e acordando com frio.' : '',
    d=>d.flags.c17_mew_de_manha
      ? 'E com o dia clareando, sem nenhum aviso e sem nenhum som, tem uma coisa pairando a um metro e dez do chão, a quatro metros de você.'
      : 'E aí, sem nenhum aviso e sem nenhum som, tem uma coisa pairando a um metro e dez do chão, a quatro metros de você.',
    d=>d.flags.viu_as_fotos ? 'Mew é menor do que as fotos do Ezra davam a entender.' : 'Você já viu Mew desenhada em livro de lenda. Ela é menor do que qualquer desenho.',
    'É do tamanho de um Meowth. A cauda é mais comprida que o corpo inteiro e fica parada no ar, sem enrolar, sem balançar.',
    'A grama embaixo dela não mexe.',
    'E ela não está te observando com cautela.',
    'Ela está te observando com curiosidade — que é uma coisa completamente diferente e muito mais perigosa, porque quer dizer que ela não tem medo, e não ter medo de gente é a coisa que mata mais Pokémon em Kanto.'
  ],
  ef:{flag:'viu_mew', limpaFlag:'protegeu_mew_pelo_silencio',
      executar:d=>{
        Relogio.avancar(2);
        const h = c17_hora(d);
        /* passou da luz: ela aparece com o dia clareando */
        if (h >= 19 || h < 6){ d.flags.c17_mew_de_manha = true; c17_ate(6); }
        const L = Estado.lend(151); if (L) L.encontros++;
        return [];
      },
      registrar:'Mew apareceu na clareira da Rota 23.',
      presagio:'Ela não tem medo.'},
  escolhas:[
    {texto:'Ficar parad{o|a}.', vai:'c17_mew_brinca'},
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Avisar em voz alta que tem gente atrás dela.', vai:'c17_avisou_mew', cond:c17_temGente},
    {texto:'Tentar capturar.', vai:'c17_captura_mew'}
  ]
},

c17_mew_brinca:{
  texto:[
    'Você fica parad{o|a}, e ela se aproxima.',
    'O que acontece nos vinte minutos seguintes é a coisa mais absurda da sua jornada inteira, e a sua jornada não foi pouca coisa:',
    'Mew brinca.',
    'Ela copia.',
    'Você coça o nariz, ela coça o nariz. Você cruza os braços, ela cruza os braços — com as patinhas, do jeito errado, porque as patinhas dela não cruzam direito, e ela tenta três vezes até ficar mais ou menos.',
    'E você ri.',
    'E ela imita o riso, sem som nenhum, só a cara.',
    'Ela levanta a sua mochila do chão sem tocar nela, olha por baixo, e põe de volta no lugar exato — no lugar exato, com o vinco da grama batendo.',
    'Ela arranca uma folha de grama, segura na frente do rosto como você segura o caderno, e fica olhando a folha com a cara séria que você faz quando lê.',
    d=>d.flags.teo_leva ? 'O Ezra está chorando a três metros e nem percebeu.' : 'Você percebe, em algum momento, que está sorrindo de um jeito que não sorri desde que saiu de casa.',
    'Ela não está te avaliando. Nunca esteve.',
    'Ela só achou você interessante por vinte minutos, do jeito que criança acha uma poça interessante.'
  ],
  ef:{flag:'brincou_com_mew',
      rep:{eixo:'bom',delta:3,motivo:'Passou vinte minutos brincando com Mew'},
      moral:25,
      executar:()=>{ const L = Estado.lend(151); if (L){ L.disposicao = 'passivo'; L.aliado = true; } return []; },
      registrar:'Mew brincou com você por vinte minutos na clareira.',
      presagio:'Uma folha de grama segurada como um caderno.'},
  escolhas:[
    {texto:'Avisar que tem gente atrás dela.', vai:'c17_avisou_mew', cond:c17_temGente},
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'},
    {texto:'Tentar capturar agora, que ela confia.', vai:'c17_captura_mew',
     ef:{rep:{eixo:'ruim',delta:4,motivo:'Traiu Mew depois de vinte minutos de brincadeira'}, flag:'traiu_mew', moral:-25}}
  ]
},

c17_mew_mao:{
  texto:[
    'Você estende a mão.',
    'Ela olha a mão. Depois olha você. Depois olha a mão de novo.',
    'E chega perto muito devagar — mais devagar do que se moveu em todo o resto — e encosta a testa nela.',
    'Não a pata: a testa.',
    'E fica ali uns dois segundos.',
    'Nesses dois segundos você sente uma coisa que não é imagem e não é som, e que não tem palavra pra ela:',
    'a sensação física de um lugar muito velho e muito quieto, onde nada nunca precisou de nome.',
    'Não é bonito. Não é assustador.',
    'É antigo de um jeito que faz tudo o que você fez desde que saiu de casa parecer uma coisa que aconteceu hoje de manhã.',
    'Depois ela recua.',
    'E você fica com a mão estendida por mais tempo do que devia.'
  ],
  ef:{flag:'tocou_mew',
      rep:{eixo:'bom',delta:3,motivo:'Mew encostou a testa na sua mão'},
      moral:20,
      executar:()=>{ const L = Estado.lend(151); if (L){ L.disposicao = 'passivo'; L.aliado = true; } return []; },
      registrar:'Mew encostou a testa na sua mão por dois segundos.'},
  escolhas:[
    {texto:'Avisar que tem gente atrás dela.', vai:'c17_avisou_mew', cond:c17_temGente},
    {texto:'Ficar parad{o|a} e ver o que ela faz.', vai:'c17_mew_brinca'},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'},
    {texto:'Capturar.', vai:'c17_captura_mew', ef:{flag:'traiu_mew', moral:-25, rep:{eixo:'ruim',delta:4,motivo:'Capturou Mew depois que ela te tocou'}}}
  ]
},

c17_avisou_mew:{
  texto:[
    c17_eu('Tem gente te procurando.'),
    'Você diz isso em voz alta numa clareira, pra uma criatura que provavelmente entende tudo e provavelmente não liga.',
    'Ela inclina a cabeça.',
    'E aí faz uma coisa desconcertante: sobe uns três metros, olha na direção exata das marcas de pneu — a direção exata, não uma direção qualquer — e volta.',
    'Ela já sabia.',
    'Sabia antes de você chegar, provavelmente antes de eles chegarem.',
    'Ela só não considera isso um problema.',
    'E você percebe, com um arrepio que não é de frio, que provavelmente ela está certa:',
    'ela já viu isso muitas vezes, e estava aqui muito antes de todos nós.',
    d=>d.flags.achou_a_extinta ? 'Você olha a moita de flor branca na borda leste — a planta que só existe como impressão fóssil — e entende de uma vez que ela não está certa por otimismo.' : '',
    d=>d.flags.achou_a_extinta ? 'Ela está certa porque mede o tempo em outra escala, e nessa escala a moita de flor branca é recente.' : ''
  ],
  ef:{flag:'avisou_mew',
      rep:{eixo:'bom',delta:3,motivo:'Avisou Mew sobre os caçadores'},
      executar:()=>{ const L = Estado.lend(151); if (L){ L.disposicao = 'passivo'; L.aliado = true; } return []; },
      registrar:'Avisou Mew. Ela já sabia, e não se importava.',
      presagio:'Ela olhou na direção certa sem procurar.'},
  escolhas:[
    {texto:'"E isso não te incomoda?"', vai:'c17_nao_te_incomoda'},
    {texto:'Ficar parad{o|a} e ver o que ela faz.', vai:'c17_mew_brinca'},
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'}
  ]
},

c17_nao_te_incomoda:{
  texto:[
    c17_eu('E isso não te incomoda?'),
    'Ela paira.',
    'E aí faz a única coisa em todo o encontro que parece resposta:',
    'desce até o chão, pousa na grama — pousa, com as quatro patas, o que não tinha feito nenhuma vez —, e cava.',
    'Cava um buraquinho na terra com a pata dianteira, uns dez centímetros, do jeito que Meowth cava.',
    'E olha pra você.',
    'E empurra a terra de volta e tapa o buraquinho.',
    'E olha pra você de novo.',
    'E faz isso mais duas vezes: cava, tapa, olha.',
    'Você não faz ideia do que isso quer dizer.',
    'E ela não explica. Ela só olha.'
  ],
  ef:{flag:'mew_respondeu',
      rep:{eixo:'bom',delta:4,motivo:'Fez uma pergunta e recebeu uma resposta que não cabe agora'},
      moral:15, instabilidade:-1,
      registrar:'Mew cavou um buraco, tapou e olhou pra você. Três vezes.'},
  escolhas:[
    {texto:'Anotar exatamente o que ela fez.', vai:'c17_anotou_o_gesto'},
    {texto:'Ficar parad{o|a} e ver o que mais ela faz.', vai:'c17_mew_brinca'},
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'}
  ]
},

c17_anotou_o_gesto:{
  texto:[
    'Você tira o caderno e anota exatamente o que ela fez, na ordem, com os detalhes:',
    'pousou com as quatro patas. Cavou com a dianteira direita. Dez centímetros. Tapou com a mesma pata. Olhou. Três vezes. Uns quatro segundos entre uma e outra.',
    'Você anota sem interpretar, porque aprendeu no caminho que interpretar é a parte que a gente faz depois, e faz errado.',
    'Ela assiste você escrever.',
    'Ela paira a um metro do caderno e olha o lápis se mexer, e a cauda fica parada no ar.',
    'E quando você termina e levanta a cabeça, ela está muito mais perto do que estava.',
    'A uns quarenta centímetros.',
    'E está olhando o caderno.',
    'Não você.',
    'O caderno.'
  ],
  ef:{flag:['anotou_o_gesto','mew_viu_o_caderno'],
      rep:{eixo:'bom',delta:5,motivo:'Anotou sem interpretar'},
      moral:15,
      registrar:'Anotou o gesto de Mew sem interpretar. Ela ficou olhando o caderno.',
      presagio:'Ela estava olhando o caderno, não você.'},
  escolhas:[
    {texto:'Mostrar o caderno pra ela.', vai:'c17_mostrou_o_caderno'},
    {texto:'Ficar parad{o|a}.', vai:'c17_mew_brinca'},
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'}
  ]
},

c17_mostrou_o_caderno:{
  texto:[
    'Você vira o caderno pra ela.',
    'É uma coisa idiota de fazer. Ela não lê. Não tem nenhum motivo pra isso funcionar.',
    'Ela olha as páginas.',
    'E aí estica a pata e encosta na folha — encosta de verdade, com a almofadinha, na página, em cima de uma palavra.',
    'Você olha qual palavra.',
    'Não é uma palavra. É um desenho.',
    d=>d.flags.contou_as_especies ? 'É o desenho que você fez da flor branca, mal feito, na página da contagem.' : 'É um desenho mal feito que você fez de uma planta que não soube nomear.',
    'Ela mantém a pata ali uns três segundos.',
    'Depois recua, sobe, e fica pairando a dois metros, olhando você.',
    'E você não tem a menor ideia se isso foi uma resposta, um acaso, ou só uma pata numa folha de papel.'
  ],
  ef:{flag:['mostrou_o_caderno','mew_tocou_o_desenho'],
      rep:{eixo:'bom',delta:4,motivo:'Mostrou o caderno a quem não lê'},
      moral:15,
      registrar:d=>d.flags.contou_as_especies ? 'Mew encostou a pata no desenho da flor branca, no seu caderno.' : 'Mew encostou a pata num desenho de planta, no seu caderno.'},
  escolhas:[
    {texto:'Estender a mão.', vai:'c17_mew_mao'},
    {texto:'Ficar parad{o|a}.', vai:'c17_mew_brinca'},
    {texto:'Deixar ela ir.', vai:'c17_deixou_mew'}
  ]
},

c17_deixou_mew:{
  texto:[
    'Ela vai embora do jeito que chegou: sem aviso, sem som, sem transição.',
    'Num instante está a quatro metros. No seguinte, a clareira tem vinte metros de grama alta e mais nada.',
    'Não tem deslocamento. Não tem borrão. Não tem ar mexendo.',
    'Ela estava, e não está.',
    d=>d.flags.teo_leva ? 'O Ezra fica sentado mais uns dez minutos, sem falar nada. Depois:' : 'Você fica sentad{o|a} mais uns dez minutos, sozinh{o|a}, no lugar mais comum do mundo: vinte metros de grama alta numa rota de Kanto.',
    d=>d.flags.teo_leva ? fala('Ezra', 'Ninguém vai acreditar.') : '',
    d=>d.flags.teo_leva ? fala(d.jogador.nome, 'Não.') : '',
    d=>d.flags.teo_leva ? fala('Ezra', 'Ótimo.') : '',
    d=>d.flags.teo_leva ? 'Ele levanta e bate a terra da calça.' : '',
    d=>d.flags.teo_leva ? fala('Ezra', 'Ótimo mesmo.') : ''
  ],
  ef:{flag:'deixou_mew_ir',
      rep:{eixo:'bom',delta:2,motivo:'Encontrou Mew e não pegou nada'},
      moral:10,
      registrar:'Mew foi embora. Você não pegou nada.'},
  escolhas:[
    {texto:'Ficar até escurecer.', vai:'c17_ate_escurecer'},
    {texto:'Seguir as marcas de pneu.', vai:'c17_pneus', cond:c17_vanLa},
    {texto:'Subir até a boca do Caminho da Vitória.', vai:'c17_boca_do_caminho'},
    {texto:'Descer a Rota 23 sem contar a ninguém.', vai:'c17_fim'}
  ]
},

c17_ate_escurecer:{
  texto:[
    'Você fica na clareira até escurecer.',
    'Ela não volta.',
    'O que acontece, em vez disso, é que a clareira fica escura como qualquer mato fica escuro, e fria como qualquer mato fica frio, e quando já não dá pra ver a própria mão começa a cantar um Pokémon qualquer no mato de fora.',
    'Um Pokémon qualquer, cantando, do lado de fora da clareira.',
    'De dentro dela, nada.',
    'E aí você entende uma última coisa, e ela é a pior de todas:',
    'a clareira não é um lugar onde tem coisa demais.',
    'É um lugar de onde tudo saiu, porque ela é o jardim de alguém, e jardim é um lugar onde não deixam Pokémon entrar.',
    d=>d.flags.contou_as_especies ? 'Quarenta e uma espécies de planta e nenhuma de Pokémon.' : 'Um jardim inteiro de planta, e nenhum Pokémon.',
    d=>d.flags.viu_as_fotos
      ? 'É a coisa mais solitária que você já viu, e foi feita de propósito, por uma coisa que estava aqui antes de tudo e que passou dois minutos chegando perto de um garoto que apareceu porque se perdeu.'
      : 'É a coisa mais solitária que você já viu, e foi feita de propósito, por uma coisa que estava aqui antes de tudo e que ainda acha graça em quem aparece.'
  ],
  ef:{flag:['ficou_ate_escurecer','entendeu_o_jardim'],
      rep:{eixo:'bom',delta:4,motivo:'Ficou até escurecer e entendeu o que era'},
      moral:-10, instabilidade:1,
      executar:d=>{ const h = c17_hora(d); if (h >= 6 && h < 19) c17_ate(19); return []; },
      registrar:d=>d.flags.contou_as_especies
        ? 'A clareira é um jardim: 41 espécies de planta e nenhuma de Pokémon. É vazia de propósito.'
        : 'A clareira é um jardim onde nenhum Pokémon entra. É vazia de propósito.',
      presagio:'De dentro da clareira, nenhum som.'},
  escolhas:[
    {texto:'Descer a Rota 23 no escuro.', vai:'c17_fim'},
    {texto:'Dormir na clareira e descer de manhã.', vai:'c17_fim',
     ef:{flag:'c17_dormiu_na_clareira', executar:()=>{ c17_ate(6); return []; }}}
  ]
},

c17_captura_mew:{
  texto:[
    'Você joga a Pokébola.',
    'Mew não desvia, não se defende, não foge.',
    d=>Historia.jaAconteceu('c17_mew_brinca')
      ? 'Ela olha a Pokébola vindo com a mesma curiosidade com que olhou tudo o mais — a sua mochila, a folha de grama, o seu rosto.'
      : 'Ela olha a Pokébola vindo com a mesma curiosidade com que olhou você desde que apareceu.',
    'Com a mesma cara.'
  ],
  ef:{moral:-15},
  batalha:{dex:151, nivel:55, tipo:'lendario', fuga:true, ambiente:'floresta',
           vitoria:'c17_pos_mew', derrota:'c17_pos_mew', fuga2:'c17_deixou_mew',
           captura:'c17_capturou_mew', gameover:'gameover'}
},

c17_pos_mew:{
  texto:[
    'Ela some no meio da luta.',
    'Não foge: some, no sentido literal, e a clareira fica vazia entre duas piscadas.',
    'Você fica de pé ali um tempo, com uma Pokébola na mão.',
    d=>d.flags.brincou_com_mew || d.flags.tocou_mew
      ? 'E pensando nos minutos de antes, que agora querem dizer outra coisa, porque não tem como desfazer nem eles nem o que veio depois.'
      : 'A grama alta volta ao normal em alguns minutos, levantando devagar onde vocês pisaram.',
    d=>d.flags.teo_leva ? 'O Ezra não fala nada. Ele olha pro lugar onde ela estava, e não olha pra você.' : ''
  ],
  ef:{executar:()=>{ const L = Estado.lend(151); if (L){ L.ataquesSofridos++; L.disposicao = 'desconfiado'; } return []; },
      rep:{eixo:'ruim',delta:2,motivo:'Atacou Mew'},
      npc:d=>d.flags.teo_leva ? {nome:'Ezra', opiniao:-4, memoria:'Viu você jogar a Pokébola em Mew e não disse nada.'} : null,
      moral:-15},
  escolhas:[
    {texto:'Pedir desculpa em voz alta pra clareira vazia.', vai:'c17_pediu_desculpa'},
    {texto:'Ficar até escurecer.', vai:'c17_ate_escurecer'},
    {texto:'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

c17_pediu_desculpa:{
  texto:[
    c17_eu('Desculpa.'),
    'Você fala isso em voz alta numa clareira vazia de vinte metros.',
    'Não acontece nada.',
    'Não tem resposta, não tem sinal, não tem vento mexendo a grama.',
    'Você fica ali uns quinze minutos falando sozinh{o|a} — e não é bonito, e você não fala nada de bonito: fala coisa embolada, repetida, com frase começada e não terminada, do jeito que gente fala quando está pedindo desculpa de verdade e não fazendo discurso.',
    d=>d.flags.teo_leva ? 'E o Ezra fica a três metros o tempo inteiro, e não sai e não fala nada, e ficar é a única coisa que ele pode fazer, e ele faz.' : '',
    'E no fim você levanta.',
    'O pedido de desculpa não serviu pra ela.',
    'Serviu pra você conseguir levantar.'
  ],
  ef:{flag:'pediu_desculpa_pra_mew',
      rep:{eixo:'bom',delta:2,motivo:'Pediu desculpa a uma clareira vazia'},
      moral:10,
      registrar:'Pediu desculpa em voz alta na clareira vazia.'},
  escolhas:[
    {texto:'Ficar até escurecer.', vai:'c17_ate_escurecer'},
    {texto:'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

c17_capturou_mew:{
  texto:[
    'A Pokébola fecha e cai na grama alta.',
    'E não acontece nada.',
    'Não tem tremor no céu, não tem clima mudando, não tem lendário nenhum vindo atrás de você, não tem luz, não tem som.',
    'Isso é o assustador de Mew: capturar ela não quebra nada.',
    'O mundo não reage.',
    d=>d.flags.teo_leva ? 'O Ezra olha a Pokébola no chão. Depois olha você.' : 'A clareira fica exatamente igual. A grama, a borda redonda, a goiabeira com fruta caída.',
    d=>d.flags.teo_leva ? 'Ele não fala nada, e não falar nada é a coisa mais alta que ele já fez na vida.' : '',
    'Mas um Mew numa Pokébola é uma coisa que alguém, em algum lugar, está pagando pra saber onde está.'
  ],
  ef:{flag:'capturou_mew', moral:-20, instabilidade:2,
      npc:d=>d.flags.teo_leva ? {nome:'Ezra', opiniao:-5, memoria:'Viu você capturar Mew e não disse uma palavra.'} : null,
      registrar:'Capturou Mew. O mundo não reagiu.',
      presagio:'A Pokébola na grama alta não mexe.'},
  escolhas:[
    {texto:'Soltar. Agora.', vai:'c17_soltou_mew'},
    {texto:'Ficar com ela.', vai:'c17_ficou_com_mew'}
  ]
},

c17_soltou_mew:{
  texto:[
    d=>d.flags.c17_voltou_pra_soltar
      ? 'Você volta à clareira, entra até o meio da grama alta e abre a Pokébola.'
      : d.flags.c17_soltou_longe ? 'Você abre a Pokébola ali mesmo, longe da clareira.'
      : 'Você abre a Pokébola na mesma clareira, menos de um minuto depois.',
    d=>d.flags.c17_soltou_longe ? 'Ela sai e paira a um metro e dez do chão, na mesma altura de antes, num lugar que não é o dela.' : 'Ela sai e paira no mesmo lugar de antes, na mesma altura, a um metro e dez do chão.',
    'E aí faz a coisa que te derruba:',
    'inclina a cabeça de novo, com a mesma curiosidade de antes.',
    'Igual.',
    'Exatamente igual.',
    'Ela não ficou com raiva. Não entendeu como ofensa. Não registrou.',
    'Você fez a pior coisa possível com ela, e ela te perdoou na hora, porque nem chegou a considerar que houvesse o que perdoar.',
    'Isso é muito pior do que raiva.',
    'Raiva teria te dado alguma coisa pra segurar.',
    'Depois ela some, sem som e sem transição: estava, e não está.'
  ],
  ef:{executar:d=>{
        const avisos = [];
        const p = [...d.time, ...d.pc].find(x => x.dex === 151);
        if (p) Captura.soltar(p).forEach(e => avisos.push({tipo:e.tipo, texto:e.texto}));
        const L = Estado.lend(151); if (L) L.disposicao = 'passivo';
        return avisos;
      },
      rep:{eixo:'bom',delta:3,motivo:'Soltou Mew'},
      flag:'soltou_mew', limpaFlag:'capturou_mew',
      moral:5,
      registrar:'Soltou Mew. Ela não registrou como ofensa.',
      presagio:'Raiva teria te dado alguma coisa pra segurar.'},
  escolhas:[
    {texto:'Pedir desculpa em voz alta.', vai:'c17_pediu_desculpa', cond:d=>!d.flags.c17_soltou_longe},
    {texto:'Ficar até escurecer.', vai:'c17_ate_escurecer', cond:d=>!d.flags.c17_soltou_longe},
    {texto:d=>d.flags.c17_soltou_longe ? 'Seguir viagem.' : 'Descer a Rota 23.', vai:'c17_fim'}
  ]
},

/* ─────────────── QUEM FICA COM MEW ─────────────── */

c17_ficou_com_mew:{
  texto:[
    'Você desce a Rota 23 com Mew no cinto.',
    d=>!d.flags.teo_leva ? ''
      : c17_horasDoEzra() ? 'O Ezra desce do seu lado sem falar uma palavra, e em Viridian pega o primeiro ônibus de volta pra casa.'
      : 'O Ezra desce do seu lado sem falar uma palavra, e em Viridian vai embora a pé.',
    'Nos dias seguintes, nada acontece.',
    'Nenhum lendário vem atrás de você. O clima não muda. A Liga não sabe. Ninguém te para na estrada.',
    'O que acontece é mais silencioso.',
    'Você começa a reparar em carros que passam devagar. Em gente que olha demais num Centro Pokémon. Em chamadas no PokéNav que caem no segundo toque.',
    'Numa loja de Viridian, o atendente demora a devolver o seu troco porque está olhando o seu cinto.',
    'Três dias depois, no Centro Pokémon de Viridian, um homem de jaleco senta na mesa ao lado da sua e diz, sem olhar pra você, mexendo o café:',
    fala('Comprador de jaleco', 'Nós pagamos qualquer valor. Literalmente qualquer valor. Você define.'),
    'Ele não ameaça.',
    'Nem precisa.',
    'Ele está oferecendo, e a oferta é a ameaça, e os dois sabem disso, e é por isso que ele não olha pra você.'
  ],
  ef:{flag:['ficou_com_mew','cientistas_atras'], instabilidade:2,
      rep:{eixo:'ruim',delta:3,motivo:'Manteve Mew presa'},
      moral:-20,
      executar:()=>{ Relogio.viver(72); c17_ate(10, true); return []; },
      registrar:'Ficou com Mew. Três dias depois, um homem de jaleco ofereceu qualquer valor por ela.',
      presagio:'Ele não olha pra você.'},
  escolhas:[
    {texto:'"Não."', vai:'c17_recusou_cientistas'},
    {texto:'"Quem te mandou?"', vai:'c17_quem_te_mandou'},
    {texto:'"Quanto é qualquer valor?"', vai:'c17_vendeu_mew'},
    {texto:'Levantar, voltar à clareira e soltar.', vai:'c17_soltou_mew', ef:c17_voltarPraSoltar()}
  ]
},

c17_quem_te_mandou:{
  texto:[
    c17_eu('Quem te mandou?'),
    'Ele mexe o café.',
    fala('Comprador de jaleco', 'Ninguém me manda. Eu recebo uma solicitação de aquisição e eu executo.'),
    c17_eu('Solicitação de quem?'),
    fala('Comprador de jaleco', 'Do setor que solicitou.'),
    'Ele bebe.',
    fala('Comprador de jaleco', 'Olha, {moço|moça}. Eu tenho cinquenta e dois anos e faço aquisição há dezenove. Já comprei equipamento de ressonância, já comprei um prédio inteiro em Vermilion e já comprei uma coleção particular de fósseis de um viúvo em Pewter.'),
    'Ele põe a xícara na mesa.',
    fala('Comprador de jaleco', 'Eu não pergunto o que a gente vai fazer com o que eu compro.'),
    c17_eu('Nunca?'),
    fala('Comprador de jaleco', 'Uma vez.'),
    'Ele olha a xícara.',
    fala('Comprador de jaleco', 'Em noventa e seis. Aí me disseram, e aí eu passei quatro anos sem dormir direito, e aí eu parei de perguntar.'),
    'Ele levanta.',
    fala('Comprador de jaleco', 'Pensa na oferta.')
  ],
  ef:{flag:['sabe_do_comprador','ouviu_o_de_jaleco'],
      npc:{nome:'Comprador de jaleco', opiniao:1, memoria:'Perguntou uma vez, em 1996, o que faziam com o que ele comprava. Nunca mais perguntou.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou quem mandava'},
      moral:-8,
      registrar:'O comprador perguntou uma vez, em 1996, o que faziam com o que ele comprava, e passou quatro anos sem dormir direito.',
      presagio:'Ele perguntou uma vez, e parou.'},
  escolhas:[
    {texto:'"Pergunta de novo."', vai:'c17_pergunta_de_novo'},
    {texto:'"Não."', vai:'c17_recusou_cientistas'},
    {texto:'"Quanto é qualquer valor?"', vai:'c17_vendeu_mew'},
    {texto:'Levantar, voltar à clareira e soltar.', vai:'c17_soltou_mew', ef:c17_voltarPraSoltar()}
  ]
},

c17_pergunta_de_novo:{
  texto:[
    c17_eu('Pergunta de novo.'),
    'Ele para com a mão na cadeira.',
    fala('Comprador de jaleco', 'Como?'),
    c17_eu('Você perguntou uma vez, em noventa e seis. Pergunta de novo.'),
    fala('Comprador de jaleco', 'Pra quê?'),
    c17_eu('Porque agora você já sabe a resposta. Perguntar de novo não é pra descobrir. É pra ficar registrado que você perguntou.'),
    'Ele fica de pé do lado da mesa um tempo desconfortável pra um homem de cinquenta e dois anos num Centro Pokémon.',
    fala('Comprador de jaleco', 'Registrado onde?'),
    c17_eu('No sistema deles. Por escrito.'),
    'Ele solta um ar pelo nariz que é quase riso.',
    fala('Comprador de jaleco', 'Você tem {idade} anos.'),
    c17_eu('Tenho. E já vi uns quatro adultos descobrirem que a arma deles era um campo de formulário.'),
    'Ele pega a maleta.',
    'E antes de sair fala, sem virar:',
    fala('Comprador de jaleco', 'Solicitação de aquisição tem campo de justificativa.'),
    'Pausa.',
    fala('Comprador de jaleco', 'Nunca preenchido.')
  ],
  ef:{flag:['comprador_vai_perguntar','provas_do_mew'],
      npc:{nome:'Comprador de jaleco', opiniao:4, memoria:'Lembrou que a solicitação de aquisição tem campo de justificativa, nunca preenchido.'},
      rep:{eixo:'bom',delta:6,motivo:'Mandou um comprador de dezenove anos de casa perguntar por escrito'},
      moral:15,
      registrar:'A solicitação de aquisição da empresa tem campo de justificativa, nunca preenchido.'},
  escolhas:[
    {texto:'"Preenche o seu."', vai:'c17_recusou_cientistas', ef:{flag:'c17_preenche_o_seu'}},
    {texto:'"Não."', vai:'c17_recusou_cientistas'},
    {texto:'"Quanto é qualquer valor?"', vai:'c17_vendeu_mew'},
    {texto:'Levantar, voltar à clareira e soltar.', vai:'c17_soltou_mew', ef:c17_voltarPraSoltar()}
  ]
},

c17_recusou_cientistas:{
  texto:[
    d=>fala(d.jogador.nome, d.flags.c17_preenche_o_seu ? 'Preenche o seu.' : 'Não.'),
    'Ele assente e vai embora sem insistir uma única vez.',
    'Isso devia te tranquilizar.',
    'Não tranquiliza, porque gente que não insiste é gente que tem outro plano, e você já viu isso mais de uma vez nessa estrada.',
    'Três dias depois, no mesmo Centro Pokémon, tem uma mulher de terno na mesa ao lado.',
    'Ela não fala com você.',
    'Ela só senta na mesa ao lado, todo dia, por quatro dias, na mesma hora que você.',
    'E no quinto dia ela não está.',
    'E a ausência dela é pior que a presença.'
  ],
  ef:{flag:'recusou_venda_mew',
      rep:{eixo:'bom',delta:3,motivo:'Recusou "qualquer valor" por Mew'},
      instabilidade:1,
      executar:()=>{ Relogio.viver(7 * 24); return []; },
      registrar:'Recusou a oferta. Uma mulher de terno sentou na mesa ao lado por quatro dias, e no quinto não veio.',
      presagio:'No quinto dia, a cadeira ao lado está vazia.'},
  escolhas:[
    {texto:'Voltar à clareira e soltar.', vai:'c17_soltou_mew', ef:c17_voltarPraSoltar()},
    {texto:'Soltar em qualquer lugar, agora.', vai:'c17_soltou_mew', ef:{flag:'c17_soltou_longe'}},
    {texto:'Seguir com ela.', vai:'c17_fim'}
  ]
},

c17_vendeu_mew:{
  texto:[
    'Ele escreve um número num guardanapo e empurra pela mesa.',
    'O número tem dígitos suficientes pra comprar uma casa em Celadon, e ainda sobra pra comprar outra.',
    'A entrega acontece num estacionamento, na terça-feira seguinte, às seis e quarenta da manhã.',
    'Tem três pessoas: ele, você, e um motorista que não desce do carro.',
    'Ele leva a Pokébola numa maleta prateada com controle de temperatura, e confere a temperatura antes de fechar, e confere de novo depois.',
    'Antes de ir, ele diz uma coisa gentil, que é a pior parte:',
    fala('Comprador de jaleco', 'Ela vai ser muito bem cuidada. Isso não é mentira. Nós precisamos dela viva e saudável por décadas.'),
    'Décadas.',
    'Ele entra no carro.',
    'E você fica num estacionamento às seis e quarenta e sete da manhã, com uma quantia de dinheiro que não cabe em nenhuma conta que você saiba abrir.'
  ],
  ef:{dinheiro:200000, flag:['vendeu_mew','tem_sangue_nas_maos'],
      rep:{eixo:'ruim',delta:6,motivo:'Vendeu Mew para um laboratório'},
      moral:-45, instabilidade:3,
      executar:d=>{
        Relogio.ateODia(1, 6, true);
        const p = [...d.time, ...d.pc].find(x => x.dex === 151);
        if (p){ Estado.removerDoTime(p.uid); const i = d.pc.findIndex(x => x.uid === p.uid); if (i >= 0) d.pc.splice(i, 1); }
        const L = Estado.lend(151); if (L){ L.estado = 'vendido'; L.disposicao = 'prisioneiro'; }
        return [{tipo:'morte', texto:'Mew saiu da sua vida numa maleta com controle de temperatura.'}];
      },
      registrar:'Vendeu Mew para um laboratório. Décadas.',
      presagio:'Ele conferiu a temperatura duas vezes.'},
  escolhas:[
    {texto:'Correr atrás do carro.', vai:'c17_foi_atras'},
    {texto:'Ligar pra Dra. Cordell e contar.', vai:'c17_contou_pra_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ficar no estacionamento.', vai:'c17_fim'}
  ]
},

c17_foi_atras:{
  texto:[
    'Você corre atrás do carro.',
    'Você corre atrás de um carro num estacionamento às seis e quarenta e sete da manhã, com duzentos mil na mochila, e alcança ele na saída, porque tem uma cancela.',
    'Ele abaixa o vidro.',
    c17_eu('Eu quero de volta.'),
    'Ele olha a maleta no banco de trás.',
    fala('Comprador de jaleco', 'Quanto?'),
    c17_eu('Eu devolvo o dinheiro.'),
    'Ele olha pra você um tempo comprido, e depois fala uma coisa que é a verdade e que é a pior coisa que dava pra falar:',
    fala('Comprador de jaleco', 'A operação já foi lançada no sistema às seis e quarenta e três.'),
    'A cancela abre.',
    fala('Comprador de jaleco', 'Eu não posso desfazer. Não porque eu não queira. Porque não tem como.'),
    'Ele sobe o vidro.',
    'O carro passa, e você lê a placa enquanto ele sobe a rampa, e repete baixinho até decorar.',
    'E fica na saída do estacionamento, com a cancela abaixando na sua frente.'
  ],
  ef:{flag:['tentou_desfazer','placa_do_comprador'],
      rep:{eixo:'bom',delta:1,motivo:'Correu atrás do carro'},
      moral:-15,
      registrar:'Tentou desfazer a venda. A operação já estava no sistema. Decorou a placa do carro.',
      presagio:'Quatro minutos entre o pagamento e o sistema.'},
  escolhas:[
    {texto:'Ligar pra Dra. Cordell.', vai:'c17_contou_pra_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ficar no estacionamento.', vai:'c17_fim'}
  ]
},

c17_contou_pra_ivone:{
  texto:[
    'São sete e dez da manhã. Você liga pra Dra. Cordell de um telefone público, porque o PokéNav tem o seu número, e conta.',
    'Tudo: a clareira, a Pokébola, o guardanapo, o estacionamento, a maleta com controle de temperatura, os duzentos mil.',
    'Ela ouve inteiro, sem interromper.',
    'E no fim não te repreende, não te consola e não fala nada sobre o que você fez.',
    'Ela faz três perguntas:',
    fala('Dra. Cordell', 'Qual era a cor da maleta?'),
    fala('Dra. Cordell', 'Que horas exatamente a operação foi lançada no sistema?'),
    fala('Dra. Cordell', 'Você anotou a placa?'),
    d=>fala(d.jogador.nome, d.flags.placa_do_comprador ? 'Prata. Seis e quarenta e três. Decorei.' : 'Prata. Não sei. Não anotei.'),
    fala('Dra. Cordell', 'Agora escreve tudo isso num papel, com data e hora, e assina.'),
    c17_eu('Pra quê?'),
    fala('Dra. Cordell', 'Porque uma venda documentada é rastreável, e uma venda não documentada some.'),
    'Ela desliga.',
    'E você fica com o fone na mão, entendendo que ela acabou de te transformar em testemunha do seu próprio crime, de propósito, porque é a única coisa que ainda dá pra fazer por Mew.'
  ],
  ef:{flag:'ivone_sabe_da_venda',
      npc:{nome:'Dra. Cordell', opiniao:4, memoria:'Te mandou documentar e assinar a venda de Mew, para que ela fosse rastreável.'},
      rep:{eixo:'bom',delta:4,motivo:'Virou testemunha do próprio crime, de propósito'},
      moral:10,
      registrar:'Contou da venda de Mew à Dra. Cordell. Ela mandou escrever e assinar tudo.',
      presagio:'Venda documentada é rastreável.'},
  escolhas:[
    {texto:'Escrever e assinar ali mesmo, em cima do telefone.', vai:'c17_fim',
     ef:{flag:'documentou_a_venda', itens:{'Declaração assinada da venda':1},
         registrar:'Escreveu e assinou a venda de Mew, com data, hora e o que lembrava do carro.'}},
    {texto:'Pôr o fone no gancho e ir embora.', vai:'c17_fim'}
  ]
},

/* ─────────────── FIM ─────────────── */

c17_fim:{
  texto:[
    d=>{
      if (d.flags.c17_entrou_no_caminho) return 'O Caminho da Vitória começa na boca da Rota 23 e sobe quatro quilômetros de rocha por dentro da montanha, até o Planalto Indigo.';
      if (d.flags.c17_soltou_longe) return 'Você segue viagem com a Pokébola vazia no cinto.';
      if (d.flags.ficou_com_mew && !d.flags.c17_voltou_pra_soltar) return 'O Planalto Indigo fica a duas rotas e uma montanha de Viridian, e a convocação não tem prazo.';
      if (d.flags.c17_dormiu_na_clareira) return 'Você desce a Rota 23 de manhã cedo, com a roupa úmida da noite na clareira, passando pelos quatro postos vazios, um depois do outro.';
      if (d.flags.entrou_na_rota_23) return 'Você desce a Rota 23 pela trilha de terra batida, passando pelos quatro postos vazios, um depois do outro.';
      return 'A Rota 22 sai de Viridian pelo oeste, e depois dela vem a Rota 23, e depois dela o Caminho da Vitória, e no alto dele o Planalto Indigo.';
    },
    d=>{
      if (d.flags.convocacao_automatica && d.flags.convocado_com_notificacao)
        return 'A central acha que as convocações saíram de um sistema que ninguém desligou. A sua veio na mão de um oficial de cinza.';
      if (d.flags.convocacao_automatica)
        return d.flags.sabe_da_elite_vazia
          ? `A Liga te chamou por um sistema que ninguém desligou, e lá em cima tem quatro pessoas onde deveria ter quarenta, e três dos quatro da Elite não se apresentam desde ${c17_mes(d, C17_ELITE)}.`
          : 'A Liga te chamou por um sistema que ninguém desligou, e lá em cima tem quatro pessoas onde deveria ter quarenta.';
      if (d.flags.sabe_dos_postos_vazios) return 'A Liga te chamou e avisou, em corpo oito, que tirou a segurança do caminho.';
      return 'A Liga te chamou e não disse por quê.';
    },
    d=>{
      if (d.flags.vendeu_mew) return 'E você carrega uma quantia de dinheiro que não cabe em nenhuma conta que você saiba abrir, e uma coisa na garganta que não passa desde as seis e quarenta da manhã.';
      if (c17_comMew(d)) return 'E no seu cinto tem uma Pokébola que todo mundo que olha demais olha de novo.';
      if (d.flags.soltou_mew) return 'Você soltou o que tinha pegado, e ela não registrou como ofensa, e isso pesa mais do que raiva pesaria.';
      if (d.flags.tocou_mew) return 'E a sua mão ainda lembra dois segundos de uma testa encostada nela, e não tem nada na convocação que pese mais do que isso.';
      if (d.flags.brincou_com_mew) return 'E você leva vinte minutos numa clareira, e não tem nada na convocação que pese mais do que eles.';
      if (d.flags.entendeu_o_jardim) return d.flags.contou_as_especies
        ? 'E você pensa num jardim de vinte metros com quarenta e uma espécies de planta e nenhuma de Pokémon, feito de propósito por uma coisa que está sozinha há mais tempo do que Kanto tem nome.'
        : 'E você pensa num jardim de vinte metros onde nenhum Pokémon entra, feito de propósito por uma coisa que está sozinha há mais tempo do que Kanto tem nome.';
      if (d.flags.viu_mew) return 'E você viu Mew, e deixou ela ir.';
      if (d.flags.nao_entrou_na_clareira) return 'Você chegou na borda de um jardim e não entrou.';
      if (d.flags.protegeu_mew_pelo_silencio) return 'Você não viu nada, sabendo que essa era a parte certa. A única prova dela que você carrega é não ter prova nenhuma.';
      return '';
    },
    d=>{
      if (d.flags.c17_entrou_no_caminho && d.flags.teo_leva && d.flags.teo_vai_junto)
        return 'E o Ezra entra do seu lado como acompanhante, com quatro insígnias e ninguém pra conferir, falando sem parar nos primeiros quatrocentos metros e calado no resto.';
      if (d.flags.teo_vai_pegar_as_quatro)
        return d.flags.c17_entrou_no_caminho
          ? 'E lá embaixo, na Rota 23, tem um garoto de quinze anos descendo pra buscar quatro insígnias que ele podia ter pulado hoje.'
          : 'E do seu lado desce um garoto de quinze anos que vai buscar quatro insígnias que ele podia ter pulado hoje.';
      if (d.flags.teo_vai_junto) return 'E o Ezra disse que, quando você subir, ele sobe junto.';
      return '';
    },
    d=>{
      if (d.flags.c17_entrou_no_caminho) return 'Lá dentro, nos primeiros quatrocentos metros de escuro, você não encontra ninguém: nenhum guarda, nenhum desafiante.';
      if (d.flags.entrou_na_rota_23 && !d.flags.ficou_com_mew && !d.flags.c17_soltou_longe && d.flags.viu_a_boca_do_caminho)
        return c17_temOito(d) ? 'Você tem as oito insígnias, e a placa na boca do Caminho continua lá em cima, sem ninguém do lado.' : 'A placa na boca do Caminho pede oito insígnias, e continua lá em cima, sem ninguém do lado.';
      return '';
    },
    d=>d.flags.c17_entrou_no_caminho ? 'Na semana em que a Liga convoca desafiantes, o Caminho da Vitória está vazio.' : ''
  ],
  ef:{executar:d=>{
        /* quem desce no escuro chega lá embaixo de noite */
        if (d.flags.ficou_ate_escurecer && !d.flags.c17_dormiu_na_clareira && !d.flags.c17_desceu) Relogio.avancar(3);
        d.flags.c17_desceu = true;
        return [];
      }},
  sai:d=>d.flags.c17_entrou_no_caminho ? 'caminho_vitoria'
       : d.flags.c17_voltou_pra_soltar ? 'rota23'
       : (d.flags.ficou_com_mew || d.flags.c17_soltou_longe) ? 'viridian'
       : d.flags.entrou_na_rota_23 ? 'rota23'
       : 'viridian',
  fim:true,
  resumo:d=>d.flags.vendeu_mew ? 'Capítulo 17 concluído — Mew não precisava de você, e você vendeu ela.'
         : c17_comMew(d) ? 'Capítulo 17 concluído — Mew não precisava de você, e está no seu cinto.'
         : d.flags.viu_mew ? 'Capítulo 17 concluído — Mew não precisava de você, e a Liga precisa.'
         : 'Capítulo 17 concluído — a Liga chamou, e o caminho até ela está vazio.'
}

}}

);

/* Opção que leva à clareira e ao fim não some depois da primeira
   vez: a volta à clareira é outra cena (o `desvio`). Cena que só
   acontece uma vez some de todo menu depois que aconteceu, venha de
   onde vier a opção. */
(function(){
  const cap = CAPITULOS.find(c => c.num === 17);
  if (!cap) return;
  const VOLTA = new Set(['c17_a_clareira']);
  const SEMPRE = new Set([...VOLTA, 'c17_fim', 'c17_clareira_de_novo']);
  for (const cena of Object.values(cap.cenas))
    for (const e of (cena.escolhas || [])){
      if (VOLTA.has(e.vai)) e.repetivel = true;
      if (SEMPRE.has(e.vai)) continue;
      const antes = e.cond, alvo = e.vai;
      e.cond = d => !Historia.jaAconteceu(alvo) && (!antes || antes(d));
    }
})();
