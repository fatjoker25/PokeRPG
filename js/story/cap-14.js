/* ------------------------------------------------------------
   ABERTURAS — Cinnabar é ilha: só se chega de barco, e o barco
   em que você chega decide o que você vê primeiro.
   ------------------------------------------------------------ */
const C14_ABERTURAS = ['c14_ilha', 'c14_ab_a_travessia', 'c14_ab_a_cinza', 'c14_ab_sem_passagem', 'c14_ab_de_cracha'];
const C14_PASSAGEM = 600;
function c14_cabe(id, d){
  const comDane = !!d.flags.ryuzo_vai_a_cinnabar;
  const semDinheiro = d.jogador.dinheiro < C14_PASSAGEM;
  if (id === 'c14_ab_sem_passagem') return !comDane && semDinheiro;
  /* sem os seiscentos e sem o Sr. Dane, só sobra o galpão do ferry */
  if (!comDane && semDinheiro) return false;
  if (id === 'c14_ab_de_cracha')    return typeof Cargos !== 'undefined' && !!Cargos.doCracha();
  if (id === 'c14_ab_a_travessia')  return !comDane;
  return true;
}
/* O ferry faz Fuchsia–Cinnabar terça e sábado: sai de Fuchsia às sete,
   chega às dez (duas horas e quarenta) e volta às onze. O Sr. Dane sai
   quando quer, às seis, e leva cinco horas. A abertura leva o relógio
   até o barco em que você chega, e cobra a passagem de quem vem de ferry. */
function c14_abertura(d){
  const cand = C14_ABERTURAS.filter(id => c14_cabe(id, d));
  const id = Dados.escolher(cand);
  if (d && d.relogio && d.flags && d.flags.c14_chegada == null){
    if (d.flags.ryuzo_vai_a_cinnabar){ c14_ate(6); Relogio.avancar(5); }
    else {
      c14_irAoFerry(7);
      if (id === 'c14_ab_sem_passagem') Relogio.avancar(1);
      else {
        Estado.j.dinheiro = Math.max(0, Estado.j.dinheiro - C14_PASSAGEM);
        Estado.registrar(`-${fmtDin(C14_PASSAGEM)} ₽ da passagem do ferry (total: ${fmtDin(Estado.j.dinheiro)} ₽)`);
        Relogio.avancar(id === 'c14_ab_a_travessia' ? 1 : 3);
      }
    }
    c14_chegou(d);
  }
  return id;
}

/* ------------------------------------------------------------
   O TEMPO DA ILHA
   ------------------------------------------------------------ */
const C14_DIAS_DE_FERRY = [1, 5];
function c14_hora(d){ sincronizarHora(d.relogio); return d.relogio.hora; }
/* a próxima vez que der h horas, vivendo o tempo: na ilha o time come */
function c14_ate(h){
  const r = Estado.dados.relogio; sincronizarHora(r);
  const falta = (h - r.hora + 24) % 24;
  if (falta) Relogio.viver(falta);
}
/* o próximo ferry que sai às h: hoje, se ainda não saiu (ou nunca hoje) */
function c14_proximoFerry(h, depoisDeHoje){
  const hoje = Calendario.hoje().semanaIdx, agora = c14_hora(Estado.dados);
  for (let k = depoisDeHoje ? 1 : 0; k < 8; k++){
    const s = (hoje + k) % 7;
    if (C14_DIAS_DE_FERRY.includes(s) && (k > 0 || agora < h)) return {k, s, nome: Calendario.SEMANA[s]};
  }
  return {k: 0, s: hoje, nome: Calendario.SEMANA[hoje]};
}
function c14_irAoFerry(h){
  const f = c14_proximoFerry(h, false), horas = f.k * 24 + h - c14_hora(Estado.dados);
  if (horas > 0) Relogio.viver(horas);
  return f;
}
/* o dia do ferry que volta, depois deste */
function c14_outroFerry(){ return c14_proximoFerry(11, true).nome; }
function c14_naDia(nome){ return (nome === 'sábado' || nome === 'domingo' ? 'no ' : 'na ') + nome; }
function c14_chegou(d){
  if (d.flags.c14_chegada == null) d.flags.c14_chegada = d.relogio.dia;
  return d.flags.c14_chegada;
}
/* O laboratório pegou fogo num sábado, de madrugada, de dois a oito
   dias antes de você chegar: o texto conta daí, e o caderno do guincho
   tem o dia do mês. */
function c14_fogoAtras(d){
  const k = (Calendario.de(c14_chegou(d)).semanaIdx - 5 + 7) % 7;
  return k < 2 ? k + 7 : k;
}
function c14_haQuanto(d){ const k = c14_fogoAtras(d); return k === 7 ? 'uma semana' : `${porExtenso(k)} dias`; }
function c14_diaDoFogo(d){
  const C = Calendario;
  let abs = c14_chegou(d) - 1 + C.inicio() - 1 - c14_fogoAtras(d), m = 0;
  while (abs < 0){ m = (m + 11) % 12; abs += C.DIAS[m]; }
  while (abs >= C.DIAS[m]){ abs -= C.DIAS[m]; m = (m + 1) % 12; }
  return abs + 1;
}
/* número no feminino ("duas horas") */
function c14_fem(n){ return porExtenso(n).replace(/\bum$/, 'uma').replace(/\bdois$/, 'duas'); }
function c14_horas(n){ return n === 1 ? 'uma hora' : `${c14_fem(n)} horas`; }

/* Lugar com hora: fora dela, espera abrir (de segunda a sexta, quando
   `util`). A flag guarda o que aconteceu: '' (estava aberto), 'cedo'
   (abriu mais tarde, hoje) ou 'outro' (outro dia, com o dia em _quando). */
function c14_esperarAbrir(flag, abre, fecha, util){
  const d = Estado.dados, h = c14_hora(d), hoje = Calendario.hoje().semanaIdx;
  const fechadoHoje = util && hoje >= 5;
  let r = '', quando = '';
  if (!fechadoHoje && h >= abre && h < fecha) r = '';
  else if (!fechadoHoje && h < abre){ c14_ate(abre); r = 'cedo'; }
  else {
    let k = 1;
    while (util && ((hoje + k) % 7) >= 5) k++;
    Relogio.viver(k * 24 - h + abre);
    r = 'outro';
    quando = k === 1 ? 'no dia seguinte' : c14_naDia(Calendario.SEMANA[(hoje + k) % 7]);
  }
  Estado.marcar(flag, r);
  Estado.marcar(flag + '_quando', quando);
}
function c14_esperou(d, flag, cedo, outro){
  const r = d.flags[flag];
  return r === 'cedo' ? cedo : r === 'outro' ? outro.replace('{quando}', d.flags[flag + '_quando'] || 'no dia seguinte') : '';
}

/* O Blaine senta na varanda do amigo todo dia, das seis e quarenta às
   oito menos dez. Quem quer achar ele ali espera a hora. */
function c14_blaineNaVaranda(d){ const h = c14_hora(d); return h >= 18 && h < 20; }
function c14_esperarBlaine(d){
  const h = c14_hora(d);
  let r = '';
  if (h >= 18 && h < 20) r = '';
  else if (h >= 20){ Relogio.amanhaAs(18); r = 'outro'; }
  else { c14_ate(18); r = 'cedo'; }
  Estado.marcar('c14_esperou_blaine', r);
}
function c14_linhaDoBlaine(d){
  const r = d.flags.c14_esperou_blaine;
  if (r === 'outro') return 'Já passou da hora dele. Você volta no dia seguinte e espera do outro lado da rua, e às seis e quarenta ele chega, com a sacola de pão e a garrafa térmica, abre o portão com chave própria e senta na cadeira de balanço.';
  if (r === 'cedo') return 'Você espera do outro lado da rua. Às seis e quarenta ele chega, com a sacola de pão e a garrafa térmica, abre o portão com chave própria e senta na cadeira de balanço.';
  return '';
}

/* ------------------------------------------------------------
   QUEM SABE O QUÊ
   ------------------------------------------------------------ */
/* que existem cinco caixas, e que é o Blaine quem tem */
function c14_sabeDasCaixas(d){ const f = d.flags; return !!(f.sabe_das_cinco || f.blaine_tem_as_caixas || f.blaine_vai_mostrar || f.achou_o_acervo); }
/* a pergunta que leva às caixas, conforme o que você já sabe */
function c14_perguntaDasCaixas(d){ return c14_sabeDasCaixas(d) ? '"O que tem nas cinco caixas?"' : '"Ele deixou alguma coisa escrita?"'; }
/* o formulário de retirada do caderno 7, achado em Saffron */
function c14_viuOFormulario(d){
  return !!(d.cenasAplicadas || {})['11:c11_caderno_sete'] || Estado.contaItem('Formulário de retirada — Caderno 7') > 0;
}
/* o caderno sete ainda está na mesa da sala dos fundos */
function c14_cadernoNaMesa(d){ return !d.flags.pegou_caderno && !d.flags.queimou_caderno; }
/* leu (ou ouviu ler) a carta do dia 251 */
function c14_sabeDaCarta(d){ return !!(d.flags.leu_o_fim_do_sete || d.flags.blaine_leu_em_voz_alta); }
function c14_temInsignia(d){ return (d.insignias || []).includes('Insígnia Vulcão'); }
function c14_ehQuinta(d){ return Calendario.hoje().semanaIdx === 3 && c14_hora(d) < 18; }
/* Moltres continua na borda: não foi embora nem está numa Pokébola */
function c14_moltresAli(d){ return !d.flags.c14_moltres_foi && !d.flags.capturou_moltres; }
/* o Blaine subiu com você e ainda está lá em cima */
function c14_blaineNaCratera(d){ return !!d.flags.c14_blaine_na_cratera; }
/* a opinião de alguém só sobe com o que é bom: cena boa depois de cena
   melhor não derruba o que ficou */
function c14_opiniao(nome){ const n = Estado.npc(nome); return n && typeof n.opiniao === 'number' ? n.opiniao : 0; }
function c14_npc(nome, op, memoria){ return () => ({nome, opiniao: Math.max(c14_opiniao(nome), op), memoria}); }
function c14_lista(l){ return l.length < 2 ? (l[0] || '') : l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1]; }
/* opções que só valem enquanto a cena não aconteceu */
function c14_nova(id){ return () => !Historia.jaAconteceu(id); }

/* a subida e a descida do vulcão: ninguém sobe aquela encosta de noite */
function c14_subir(d){
  const h = c14_hora(d), noite = h >= 18 || h < 5;
  Estado.marcar('c14_subiu_de_madrugada', noite);
  if (noite) c14_ate(5);
  const comBlaine = !!d.flags.blaine_vai_subir && !d.flags.c14_blaine_subiu;
  Estado.marcar('c14_blaine_na_cratera', comBlaine);
  if (comBlaine) Estado.marcar('c14_blaine_subiu');
  Relogio.avancar(comBlaine ? 5 : 4);
}
const C14_DESEMBARCA = {executar:()=>{ if (c14_hora(Estado.dados) < 10) c14_ate(10); return []; }};
const C14_TRAVESSIA_DO_DANE = {executar:()=>{ Relogio.avancar(5); return []; }};
const C14_ATE_O_SOL = {executar:()=>{ c14_ate(6); return []; }};
function c14_deNoite(d){ const h = c14_hora(d); return h >= 16 || h < 5; }

/* como a ilha já te conhece quando o Blaine te vê */
function c14_comoTeConhece(d){
  const f = d.flags;
  if (f.venceu_blaine || f.perdeu_pro_blaine) return ['Você é {o|a} da luta de quinta.', 'Sou.', 'Eu lembro de todo mundo que entra naquela arena, {meu filho|minha filha}.'];
  if (f.sabe_das_nove_caixas) return ['Você é {o|a} que tá perguntando de caixa no cais.', 'Sou.', 'Setecentas pessoas, {meu filho|minha filha}.'];
  if (f.blaine_paga_o_iptu) return ['Você é {o|a} que foi na prefeitura perguntar quem paga o imposto dessa casa.', 'Sou.', 'A moça do tributo é minha afilhada. Setecentas pessoas, {meu filho|minha filha}.'];
  if (f.conheceu_selma) return ['Você é {o|a} que tomou café no muro da Wilma.', 'Sou.', 'Setecentas pessoas, {meu filho|minha filha}.'];
  if (f.ouviu_as_versoes) return ['Você é {o|a} que passou a tarde perguntando do laboratório na rua principal.', 'Sou.', 'Setecentas pessoas, {meu filho|minha filha}.'];
  if (f.viu_o_blaine_na_varanda) return ['Você tá do outro lado da rua desde a tarde.', 'Tô.', 'Setecentas pessoas, {meu filho|minha filha}. Até o muro tem dono.'];
  return ['Você é de fora.', 'Sou.', 'Setecentas pessoas, {meu filho|minha filha}. Gente de fora a gente vê do porto.'];
}

/* o que você tem pra contar, do andar onze pra cá */
function c14_provas(d){
  const l = typeof c11_provas === 'function' ? c11_provas(d).slice() : [];
  if (d.flags.c11_sorrel_onde) l.push(Nomes.sabe('a mulher de jaleco') ? 'o que a Dra. Sorrel disse' : 'o que a mulher de jaleco disse');
  if (d.flags.cartao_ivone) l.push('o cartão da Dra. Cordell');
  return l;
}

/* o que diz a folha do ginásio, pelo dia de hoje */
function c14_hojeNoGinasio(d){
  const c = Calendario.hoje(), h = c14_hora(d);
  if (c.semanaIdx === 3 && h >= 14 && h < 18) return 'Hoje é quinta, e já passou das duas.';
  if (c.semanaIdx === 3 && h < 14) return 'Hoje é quinta.';
  return `Hoje é ${c.semana}.`;
}
function c14_textoDoDesafio(d){
  if (!c14_ehQuinta(d)) return 'Voltar na quinta e desafiar o líder.';
  return c14_hora(d) >= 14 ? 'Desafiar o líder.' : 'Esperar as duas da tarde e desafiar o líder.';
}
/* a retenção de acervo público prescreve cinco anos depois de novembro de 1996 */
function c14_prescricao(){
  const c = Calendario.hoje();
  const m = c.mes + 12 * (c.ano - 2000 - (c.mes >= 10 ? 1 : 0));   // meses desde março de 2000
  const falta = Math.max(1, 20 - m);                                // novembro de 2001
  const a = Math.floor(falta / 12), r = falta % 12;
  const meses = n => n === 1 ? 'um mês' : `${porExtenso(n)} meses`;
  if (a && r) return `falta um ano e ${meses(r)}`;
  if (a) return 'falta um ano';
  return r === 1 ? 'falta um mês' : `faltam ${meses(r)}`;
}
function c14_temAFolha(){ return Estado.contaItem('Folha do livro de acesso') > 0; }
const C14_ARRANCA = {itens:{'Folha do livro de acesso':1}, flag:'arrancou_a_folha'};
/* publicar só faz sentido pra quem tem o que contar além do caderno */
function c14_podePublicar(d){ const f = d.flags; return !!(f.viu_os_doze || f.sabe_do_andar_11 || f.sabe_que_foi_forjado || f.sabe_do_barco_fretado || f.ouviu_as_versoes); }
/* a mochila do Fuji continua no abrigo da cratera */
function c14_mochilaNoAbrigo(d){ return !d.flags.tem_a_mochila_do_fuji && !d.flags.entregou_a_mochila; }
/* As perguntas que levam às cinco caixas mudam com o que você já sabia
   antes da cena: a opção guarda isso, porque a cena marca o que conta. */
const C14_ANTES_DAS_CAIXAS = {executar:d=>{
  Estado.marcar('c14_sabia_das_caixas', c14_sabeDasCaixas(d));
  Estado.marcar('c14_sabia_das_quatro', !!(d.flags.sabe_das_nove_caixas || d.flags.blaine_sabe_do_onze));
  Estado.marcar('c14_pergunta_das_caixas', c14_perguntaDasCaixas(d));
  return [];
}};

/* ============================================================
   CAPÍTULO 14 — O CADERNO DE CINNABAR  (Ilha Cinnabar)
   ============================================================ */
CAPITULOS.push(
{
num:14, titulo:'O Caderno de Cinnabar', local:'Ilha Cinnabar', ambiente:'vulcao', nivelArea:36,
tom:'muito sombrio', entradas:C14_ABERTURAS,
inicio: d => c14_abertura(d),
/* Voltar a um lugar onde a primeira vez já aconteceu leva pro reencontro,
   não pra primeira vez de novo. */
desvios:{
  c14_ab_sem_passagem:   {se:d=>!!d.flags.conheceu_ryuzo && d.cena !== 'c14_ab_sem_passagem', vai:'c14_ab_o_dane_de_novo'},
  c14_cidade:            {se:d=>Historia.jaAconteceu('c14_cidade') && d.cena !== 'c14_cidade', vai:'c14_cidade_de_novo'},
  c14_barco_fretado:     {se:d=>Historia.jaAconteceu('c14_barco_fretado') && d.cena !== 'c14_barco_fretado', vai:'c14_cais_de_novo'},
  c14_selma:             {se:d=>Historia.jaAconteceu('c14_selma') && d.cena !== 'c14_selma', vai:'c14_selma_de_novo'},
  c14_casa_do_fuji:      {se:d=>Historia.jaAconteceu('c14_casa_do_fuji') && d.cena !== 'c14_casa_do_fuji', vai:'c14_casa_de_novo'},
  c14_blaine_na_varanda: {se:d=>!!d.flags.conheceu_blaine && d.cena !== 'c14_blaine_na_varanda', vai:'c14_varanda_de_novo'},
  c14_ginasio:           {se:d=>(Historia.jaAconteceu('c14_ginasio') || !!d.flags.achou_o_acervo) && d.cena !== 'c14_ginasio', vai:'c14_ginasio_de_novo'},
  c14_ginasio_por_dentro:{se:d=>Historia.jaAconteceu('c14_ginasio_por_dentro') && d.cena !== 'c14_ginasio_por_dentro', vai:'c14_acervo_de_novo'},
  c14_lab:               {se:d=>Historia.jaAconteceu('c14_lab') && d.cena !== 'c14_lab', vai:'c14_lab_de_novo'},
  c14_subsolo:           {se:d=>Historia.jaAconteceu('c14_subsolo') && d.cena !== 'c14_subsolo', vai:'c14_subsolo_de_novo'},
  c14_vulcao:            {se:d=>Historia.jaAconteceu('c14_vulcao') && d.cena !== 'c14_vulcao', vai:'c14_vulcao_de_novo'},
  c14_procurou_sinal:    {se:d=>Historia.jaAconteceu('c14_procurou_sinal') && d.cena !== 'c14_procurou_sinal', vai:'c14_abrigo_de_novo'}
},
cenas:{

c14_ab_a_travessia:{
  texto:[
    'O ferry de Cinnabar sai de Fuchsia às sete, leva duas horas e quarenta, e tem quatorze passageiros contando você.',
    'Dos treze restantes, onze moram na ilha. Dá pra saber porque eles não olham pro mar.',
    'Os outros dois são um casal de uns sessenta anos com uma mala só e uma cara que você reconhece de Lavender: cara de quem vai visitar alguém que não vai visitar de volta.',
    'Na segunda hora de travessia, um homem da tripulação passa recolhendo o canhoto das passagens e para do seu lado.',
    fala('o tripulante', 'Primeira vez na ilha?'),
    d=>fala(d.jogador.nome, 'Primeira.'),
    fala('o tripulante', 'Duas coisas, então.'),
    'Ele destaca o seu canhoto com a unha do polegar, sem olhar.',
    fala('o tripulante', 'Uma: o cheiro de enxofre passa em três dias. Não é você que acostuma, é o nariz que desiste.'),
    ()=>fala('o tripulante', `Duas: depois deste, o próximo ferry é ${c14_outroFerry()}.`),
    'E vai embora, porque as duas coisas eram só duas.'
  ],
  ef:{flag:'veio_no_ferry',
      registrar:'Atravessou pro Cinnabar no ferry das sete, com treze outros passageiros.'},
  escolhas:[
    {texto:'Ir falar com o casal da mala.', vai:'c14_ab_o_casal'},
    {texto:'Ficar olhando a ilha crescer no horizonte.', vai:'c14_ab_a_ilha_crescendo'},
    {texto:'Desembarcar e andar pela cidade.', vai:'c14_cidade', ef:C14_DESEMBARCA}
  ]
},

c14_ab_o_casal:{
  texto:[
    'Você senta no banco de trás deles, que é o único jeito de puxar conversa num ferry sem parecer que você puxou conversa.',
    'A mulher fala primeiro, porque ela estava esperando alguém pra falar.',
    fala('a mulher do ferry', 'A gente vai ver o prédio.'),
    d=>fala(d.jogador.nome, 'Que prédio?'),
    fala('o homem do ferry', 'O laboratório.'),
    'Ele fala isso sem tirar os olhos da água.',
    fala('a mulher do ferry', 'Nosso filho trabalhava lá. Faz doze anos.'),
    fala('a mulher do ferry', 'Ele morreu em oitenta e oito, num acidente que eles chamaram de acidente.'),
    'Ela alisa a alça da mala com as duas mãos, pra frente e pra trás.',
    fala('a mulher do ferry', 'A gente vinha todo ano, no aniversário. Doze anos.'),
    fala('o homem do ferry', 'Esse ano a gente veio porque queimou.', 'baixo'),
    fala('o homem do ferry', 'A gente quer ver com os nossos olhos o que sobrou.')
  ],
  ef:{flag:'o_casal_do_filho',
      npc:{nome:'o casal do ferry', opiniao:1, viuVoce:'Vocês conversaram na travessia para Cinnabar.'},
      registrar:'Um casal atravessa há doze anos pro aniversário da morte do filho, que trabalhava no laboratório.',
      presagio:'Morreu em oitenta e oito, num acidente que "eles chamaram de acidente".'},
  escolhas:[
    {texto:'Perguntar o nome do filho.', vai:'c14_ab_o_nome_do_filho'},
    {texto:'Desembarcar junto com eles e ir ao laboratório.', vai:'c14_lab', ef:C14_DESEMBARCA},
    {texto:'Desembarcar e andar pela cidade.', vai:'c14_cidade', ef:C14_DESEMBARCA}
  ]
},

c14_ab_o_nome_do_filho:{
  texto:[
    fala('a mulher do ferry', 'Kieran. Kieran Ashby.'),
    'Ela fala o nome inteiro, com sobrenome, do jeito que se fala um nome que ninguém mais fala.',
    fala('a mulher do ferry', 'Ele era bioquímico. Vinte e nove anos.'),
    d=>fala(d.jogador.nome, 'E o que foi o acidente?'),
    'O homem responde dessa vez, e responde rápido demais, o que quer dizer que ele já respondeu muitas vezes.',
    fala('o homem do ferry', 'Exposição a reagente. Foi o que a carta disse.'),
    fala('o homem do ferry', 'Caixão lacrado. Também foi o que a carta disse.'),
    'A mulher olha pra fora da janela e não fala nada.',
    fala('o homem do ferry', 'A gente assinou tudo que mandaram assinar. Na época a gente não tinha cabeça.'),
    fala('o homem do ferry', 'Hoje eu tenho cabeça e não tenho mais nada pra assinar.')
  ],
  ef:{flag:'kaoru_ishida',
      registrar:'Kieran Ashby, bioquímico, 29 anos, morreu no laboratório de Cinnabar em 1988. Caixão lacrado.',
      presagio:'Caixão lacrado, por exposição a reagente. Os dois assinaram sem ver.'},
  escolhas:[
    {texto:'Desembarcar e ir direto ao laboratório.', vai:'c14_lab', ef:C14_DESEMBARCA},
    {texto:'Desembarcar e andar pela cidade.', vai:'c14_cidade', ef:C14_DESEMBARCA}
  ]
},

c14_ab_a_ilha_crescendo:{
  texto:[
    'Cinnabar aparece como uma mancha e vira uma ilha ao longo de quarenta minutos, e nos quarenta minutos você não faz mais nada.',
    'Primeiro o vulcão, que é a única coisa alta. Depois a linha da costa. Depois as casas, que são poucas e baixas e coloridas.',
    'E, na ponta leste, uma mancha preta na costa que não é rocha vulcânica.',
    'Rocha vulcânica é preta e fosca. Essa mancha tem brilho e tem forma retangular.',
    'Você fica vinte minutos sem entender o que está olhando até o ferry virar o suficiente pra você entender.',
    'É um prédio queimado. De longe, um prédio queimado parece exatamente uma mancha.'
  ],
  ef:{flag:'viu_o_lab_do_mar',
      registrar:'Viu o laboratório queimado da ponta leste ainda do ferry, a quarenta minutos da costa.'},
  escolhas:[
    {texto:'Desembarcar e ir direto ao laboratório.', vai:'c14_lab', ef:C14_DESEMBARCA},
    {texto:'Desembarcar e andar pela cidade primeiro.', vai:'c14_cidade', ef:C14_DESEMBARCA},
    {texto:'Ir falar com o casal da mala.', vai:'c14_ab_o_casal'}
  ]
},

/* Quem não tem os seiscentos espera o galpão esvaziar, e quem aparece é o
   velho do barco azul de Fuchsia: o Amos pro cais, o Dane pro recibo. */
c14_ab_sem_passagem:{
  texto:[
    'A passagem do ferry pra Cinnabar custa seiscentos e é a única linha regular, e a bilheteria é uma janelinha de madeira num galpão do porto de Fuchsia.',
    d=>`Você tem ${fmtDin(d.jogador.dinheiro)} ₽, e o homem da janelinha olha a sua mão aberta com o dinheiro e não diz nada, porque não é ele que faz o preço.`,
    'Você fica no galpão. Sai o ferry das sete. O galpão esvazia.',
    'Às oito e pouco entra um homem de setenta e quatro anos com um boné de pano desbotado e uma lata de óleo na mão, e ele vai até a janelinha e não compra passagem: ele reclama de alguma coisa sobre taxa de atracação, e reclama com intimidade.',
    d=>d.flags.sabe_do_ryuzo
      ? 'Você já ouviu falar dele numa mesa de dominó, no cais: o Amos, setenta e quatro anos, barco de doze pés que o pai construiu em cinquenta e três, que sai toda quarta de manhã sem rede e sem linha e ninguém pergunta o que ele vai fazer.'
      : 'O homem da janelinha o chama de Amos e o trata como quem trata alguém há quarenta anos.',
    'No recibo da taxa, que ele amassa e enfia no bolso, está escrito A. DANE.',
    'Quando ele sai, você sai junto.',
    d=>fala(d.jogador.nome, 'O senhor tem barco?'),
    fala('Sr. Dane', 'Tenho doze pés e setenta e quatro anos. Que é o que eu tenho.'),
    d=>fala(d.jogador.nome, 'O senhor vai pra Cinnabar?'),
    'Ele para de andar.',
    fala('Sr. Dane', 'Por que é que você quer ir pra Cinnabar?')
  ],
  ef:{flag:'conheceu_ryuzo',
      npc:{nome:'Sr. Dane', opiniao:0, viuVoce:'Você o abordou no porto de Fuchsia pedindo travessia.'},
      registrar:'Não tinha os 600 ₽ do ferry. Abordou o Sr. Dane, dono de um barco de doze pés.'},
  escolhas:[
    {texto:'Contar a verdade inteira.', vai:'c14_ab_a_verdade_pro_velho'},
    {texto:'Dizer que é a trabalho.', vai:'c14_ab_mentiu_pro_velho'},
    {texto:'Oferecer tudo que você tem.', vai:'c14_ab_ofereceu_tudo'}
  ]
},

c14_ab_a_verdade_pro_velho:{
  texto:[
    'Você conta. Conta o laboratório, conta o que te trouxe até aqui, conta a parte que faz você parecer ingênu{o|a} e conta a parte que faz você parecer {perigoso|perigosa}.',
    'Leva uns seis minutos. Ele não interrompe e não olha pra você: olha pro mar, com a lata de óleo na mão.',
    'Quando você termina, ele mexe no boné.',
    fala('Sr. Dane', 'Cinco horas de combustível.'),
    d=>fala(d.jogador.nome, 'Eu não tenho como pagar cinco horas de combustível.'),
    fala('Sr. Dane', 'Eu sei. Eu falei quanto custa, não falei que você vai pagar.'),
    'Ele desce a rampa na direção de um barco azul de doze pés, com STARYU pintado à mão na proa e o motor de popa levantado.',
    fala('Sr. Dane', 'Meu filho morreu no mar em noventa e sete e desde noventa e sete eu saio toda quarta e não pesco nada.'),
    d=>fala(d.jogador.nome, 'Pra fazer o quê?'),
    fala('Sr. Dane', 'Pra ninguém perguntar.'),
    'Ele destrava o motor de popa e baixa.',
    fala('Sr. Dane', 'Você falou seis minutos direto comigo. Isso não acontecia desde noventa e sete.', 'baixo')
  ],
  ef:{flag:'ryuzo_vai_a_cinnabar', moral:2,
      rep:{eixo:'bom', delta:1, motivo:'Contou a verdade inteira pra um desconhecido que podia recusar.'},
      npc:{nome:'Sr. Dane', opiniao:4, viuVoce:'Te levou a Cinnabar sem cobrar, por seis minutos de conversa.'},
      registrar:'O Sr. Dane te levou a Cinnabar num barco de doze pés, sem cobrar.'},
  escolhas:[
    {texto:'Embarcar.', vai:'c14_ilha', ef:C14_TRAVESSIA_DO_DANE}
  ]
},

c14_ab_mentiu_pro_velho:{
  texto:[
    d=>fala(d.jogador.nome, 'É a trabalho.'),
    'Ele te olha por dois segundos inteiros.',
    fala('Sr. Dane', 'A trabalho de quem?'),
    'Você não tem a segunda frase. Mentira boa precisa de segunda frase e você só preparou a primeira.',
    fala('Sr. Dane', 'Pois é.'),
    'Ele desce a rampa. Na metade do caminho ele para, sem virar:',
    fala('Sr. Dane', 'Eu levo você assim mesmo. Só não fala mais nada até a gente chegar.'),
    'A travessia leva cinco horas e vocês não trocam uma palavra, e as cinco horas são muito compridas.'
  ],
  ef:{flag:'ryuzo_vai_a_cinnabar',
      npc:{nome:'Sr. Dane', opiniao:0, viuVoce:'Te levou a Cinnabar depois de te pegar numa mentira.'},
      registrar:'Mentiu pro Sr. Dane e ele te levou a Cinnabar em silêncio.'},
  escolhas:[
    {texto:'Embarcar.', vai:'c14_ilha', ef:C14_TRAVESSIA_DO_DANE}
  ]
},

c14_ab_ofereceu_tudo:{
  texto:[
    d=>fala(d.jogador.nome, `Eu tenho ${fmtDin(d.jogador.dinheiro)}. É tudo. Leva tudo.`),
    'Você estende a mão aberta com as notas e as moedas, e esse gesto é humilhante de um jeito muito específico.',
    'Ele olha a mão. Não pega.',
    fala('Sr. Dane', 'Guarda isso.'),
    d=>fala(d.jogador.nome, 'É sério. Pode levar tudo.'),
    ()=>fala('Sr. Dane', `{Menino|Menina}, se eu levar tudo o que você tem, você chega numa ilha sem ferry até ${c14_outroFerry()} e sem um tostão.`),
    'Ele empurra a sua mão de volta com as costas da dele.',
    fala('Sr. Dane', 'Aí eu não te levei. Eu te abandonei mais longe.'),
    'Ele desce a rampa.',
    fala('Sr. Dane', 'Vem. E guarda o dinheiro no bolso de dentro, que lá o vento leva.')
  ],
  ef:{flag:'ryuzo_vai_a_cinnabar', moral:1,
      npc:{nome:'Sr. Dane', opiniao:3, viuVoce:'Recusou o seu dinheiro e te levou a Cinnabar mesmo assim.'},
      registrar:'Ofereceu tudo que tinha pela travessia. O Sr. Dane recusou e levou mesmo assim.'},
  escolhas:[
    {texto:'Embarcar.', vai:'c14_ilha', ef:C14_TRAVESSIA_DO_DANE}
  ]
},

/* quem já andou no Staryu até as Seafoam: o Sr. Dane reconhece você no galpão */
c14_ab_o_dane_de_novo:{
  texto:[
    'A passagem do ferry pra Cinnabar custa seiscentos e é a única linha regular, e a bilheteria é uma janelinha de madeira num galpão do porto de Fuchsia.',
    d=>`Você tem ${fmtDin(d.jogador.dinheiro)} ₽, e o homem da janelinha olha a sua mão aberta com o dinheiro e não diz nada, porque não é ele que faz o preço.`,
    'Você fica no galpão. Sai o ferry das sete. O galpão esvazia.',
    'Às oito e pouco entra o Sr. Dane, de boné de pano e lata de óleo na mão, e vai até a janelinha reclamar da taxa de atracação, com a intimidade de quem reclama dela há quarenta anos.',
    'No meio da reclamação ele te vê no banco do galpão, e para.',
    fala('Sr. Dane', 'Perdeu o ferry ou não tinha os seiscentos?'),
    d=>fala(d.jogador.nome, 'Não tinha os seiscentos.'),
    fala('Sr. Dane', 'Cinnabar.'),
    'Não é pergunta. Ele olha pro oeste, pra parede do galpão, como se desse pra ver através dela.',
    ()=>c14_opiniao('Sr. Dane') < 0
      ? fala('Sr. Dane', 'Eu levo. Mas a gente não conversa no caminho.', 'frio')
      : fala('Sr. Dane', 'Cinco horas de barco. Eu tenho combustível pra três, e o resto a gente enche aqui.'),
    ()=>c14_opiniao('Sr. Dane') < 0 ? '' : fala('Sr. Dane', 'Vem. Eu fiquei com vontade de ver mais alguma coisa antes de morrer, e a culpa é sua.')
  ],
  ef:{flag:'ryuzo_vai_a_cinnabar',
      npc:{nome:'Sr. Dane', memoria:'Te achou sem dinheiro no galpão do ferry e te levou a Cinnabar no Staryu.'},
      registrar:'Sem os 600 ₽ do ferry. O Sr. Dane te levou a Cinnabar no Staryu.'},
  escolhas:[
    {texto:'Embarcar.', vai:'c14_ilha', ef:C14_TRAVESSIA_DO_DANE}
  ]
},

c14_ab_a_cinza:{
  texto:[
    'Está caindo cinza em Cinnabar.',
    'Não é muita: é uma poeira clara, fina, que assenta na calçada preta e deixa ela cinzenta, e que as pessoas da ilha varrem da frente de casa do jeito que se varre folha.',
    'Você desembarca e em quatro minutos tem cinza no ombro da sua roupa.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} espirra duas vezes seguidas e sacode a cabeça, e você limpa a cinza ${pron(p).dele} com a manga.`
               : 'Você espirra duas vezes seguidas e ninguém repara, porque todo mundo aqui espirra.';
    },
    'Na rua principal, um homem de uns quarenta anos está varrendo a calçada da loja dele e cumprimenta você com a cabeça.',
    d=>fala(d.jogador.nome, 'Isso é normal?'),
    fala('o homem da vassoura', 'É vulcão, {meu amigo|minha amiga}. Vulcão solta cinza.'),
    d=>fala(d.jogador.nome, 'Mas ele não tá inativo?'),
    'Ele para de varrer.',
    fala('o homem da vassoura', 'Tá.'),
    'E volta a varrer, e não fala mais nada, e continua varrendo depois que você vai embora.'
  ],
  ef:{flag:'esta_caindo_cinza',
      registrar:'Está caindo cinza em Cinnabar. O vulcão consta como inativo.',
      presagio:'Cinza caindo de um vulcão inativo. Ele parou de varrer quando você perguntou.'},
  escolhas:[
    {texto:'Subir até o vulcão ver de onde vem.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Andar pela cidade e perguntar por aí.', vai:'c14_cidade'},
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'}
  ]
},

c14_ab_de_cracha:{
  texto:[
    'O porto de Cinnabar tem uma rampa só e um posto de capitania com um homem de camisa branca e um livro de bordo aberto.',
    'A capitania registra quem entra e quem sai da ilha desde mil novecentos e cinquenta e um, e ele é quem registra desde setenta e oito.',
    d=>{ Nomes.apresentar('o capitão do porto'); return 'Na porta do posto, embaixo de CAPITANIA, alguém pintou à mão um nome só: MARLOW.'; },
    d=>{
      const c = Cargos.doCracha();
      return `Você mostra o crachá de ${c ? c.nome : 'serviço'} porque parece a coisa certa a fazer, e ele vira o livro na sua direção sem você pedir.`;
    },
    fala('o capitão do porto', 'Já que {o senhor|a senhora} é do serviço: olha a página de três semanas atrás.'),
    'Três semanas atrás, na coluna de entrada: um barco fretado, quatro pessoas, sem nome de passageiro.',
    'Na coluna de saída, no mesmo dia: o mesmo barco, três pessoas.',
    fala('o capitão do porto', 'Eu anotei quatro na entrada. Eu conto. É o meu trabalho contar.'),
    d=>fala(d.jogador.nome, 'E os três não falaram nada?'),
    fala('o capitão do porto', 'Falaram que eu tinha contado errado.'),
    'Ele fecha o livro com as duas mãos.',
    fala('o capitão do porto', 'Eu faço isso há vinte e dois anos. Eu não conto errado.')
  ],
  ef:{flag:'quatro_entraram_tres_sairam',
      npc:{nome:'o capitão do porto', opiniao:2, viuVoce:'Te mostrou o livro de bordo por causa do crachá.'},
      registrar:'Há três semanas um barco fretado entrou em Cinnabar com quatro pessoas e saiu com três.',
      presagio:'Quatro na entrada, três na saída, na letra de quem conta há vinte e dois anos.'},
  escolhas:[
    {texto:'Perguntar como era o barco.', vai:'c14_ab_como_era_o_barco'},
    {texto:'Pedir cópia da página.', vai:'c14_ab_a_pagina'},
    {texto:'Ir direto ao laboratório queimado.', vai:'c14_lab'}
  ]
},

c14_ab_como_era_o_barco:{
  texto:[
    fala('o capitão do porto', 'Fretado de Vermilion. Casco azul, quarenta e dois pés, motor de dentro.'),
    'Ele fala isso de cabeça, sem consultar nada, porque barco é o assunto dele.',
    fala('o capitão do porto', 'Barco de empresa. Não é de pescador e não é de turista.'),
    d=>fala(d.jogador.nome, 'Como é que o senhor sabe?'),
    fala('o capitão do porto', 'Pelo jeito que atracaram.'),
    'Ele faz um gesto com a mão, de encostar de lado.',
    fala('o capitão do porto', 'Pescador atraca com a proa. Turista atraca torto e xinga.'),
    fala('o capitão do porto', 'Esses aí atracaram de ré, no primeiro movimento, com alguém de luva na amarra.'),
    fala('o capitão do porto', 'Isso é tripulação paga.')
  ],
  ef:{flag:'barco_fretado_de_vermilion',
      registrar:'O barco que trouxe os quatro era fretado de Vermilion, com tripulação paga.'},
  escolhas:[
    {texto:'Pedir cópia da página do livro.', vai:'c14_ab_a_pagina'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Perguntar por barco fretado no bar do cais.', vai:'c14_barco_fretado'}
  ]
},

c14_ab_a_pagina:{
  texto:[
    fala('o capitão do porto', 'Cópia eu não tiro. O livro não sai daqui e não tem máquina.'),
    'Ele empurra uma folha em branco e uma caneta na sua direção.',
    fala('o capitão do porto', 'Mas você pode copiar à mão, e eu assino embaixo como conferido.'),
    'Você copia a página inteira: data, hora, embarcação, entrada quatro, saída três.',
    'Ele lê o que você escreveu, corrige um horário com a própria caneta, e assina com o nome inteiro e a matrícula.',
    fala('o capitão do porto', 'Pronto. Agora isso não é boato.'),
    d=>fala(d.jogador.nome, 'Por que o senhor tá fazendo isso?'),
    'Ele guarda a caneta no bolso da camisa branca.',
    fala('o capitão do porto', 'Porque eles falaram que eu contei errado.', 'frio')
  ],
  ef:{flag:'copia_do_livro_de_bordo',
      npc:{nome:'o capitão do porto', opiniao:3, viuVoce:'Assinou como conferida a sua cópia manuscrita do livro de bordo.'},
      registrar:'Tem cópia manuscrita e assinada da página do livro de bordo: entraram 4, saíram 3.'},
  escolhas:[
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Perguntar por barco fretado no bar do cais.', vai:'c14_barco_fretado'},
    {texto:'Andar pela cidade.', vai:'c14_cidade'}
  ]
},


c14_ilha:{
  texto:[
    'Cinnabar é uma ilha de nove quilômetros quadrados com um vulcão no meio e um laboratório na beira.',
    'Os dois estão inativos. Os dois estão mentindo.',
    'Setecentos e quarenta habitantes, uma rua principal com calçada de pedra vulcânica preta, um porto de uma única rampa, e um cheiro constante de enxofre que as pessoas daqui não sentem mais e que os visitantes sentem por três dias e depois também não.',
    'O ferry vem duas vezes por semana, terça e sábado.',
    d=>d.flags.ryuzo_vai_a_cinnabar
      ? 'Você não veio de ferry. Você veio num barco azul de doze pés com um velho de setenta e quatro anos que gastou cinco horas de combustível e não aceitou dinheiro.'
      : `Você veio de ferry, ${c14_naDia(Calendario.de(c14_chegou(d)).semana)}, com quatorze passageiros e uma carga de botijão de gás.`,
    d=>{
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) return 'A recepcionista da pousada olha o seu rosto duas vezes, depois olha uma tela, depois sorri de um jeito que não chega aos olhos.';
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=6) return 'Duas crianças te seguem do porto até a pousada a uma distância constante de dez metros, cochichando. Quando você vira, elas param de andar. Quando você anda, elas andam. Numa ilha de setecentas pessoas, notícia chega antes do barco.';
      return `Ninguém te nota no porto. O barco vai embora e você fica, e a rampa fica vazia, e você percebe que o próximo ferry é ${c14_outroFerry()}.`;
    },
    ()=>(Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) ? fala('a recepcionista da pousada', 'Quarto doze.') : '',
    ()=>(Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) ? 'Você não deu o seu nome.' : '',
    'E tem uma coisa que você vê da rampa do porto e que não estava em nenhuma informação que você tinha:',
    'o prédio do laboratório queimou.',
    d=>`Não é ruína velha. Queimou faz ${c14_haQuanto(d)}.`,
    'A fita de isolamento é nova, o cheiro de queimado ainda está no ar, e tem um buraco na cerca que também é novo.',
    'Alguém entrou antes de você.',
    'E o buraco tem a borda dobrada pra dentro.'
  ],
  ef:{registrar:d=>`Chegou à Ilha Cinnabar. O laboratório queimou faz ${c14_haQuanto(d)}.`,
      presagio:'A borda dobrada pra dentro quer dizer que alguém entrou. Ninguém saiu por ali.'},
  escolhas:[
    {texto:'Perguntar na cidade o que aconteceu.', vai:'c14_cidade'},
    {texto:'Entrar pelo buraco na cerca.', vai:'c14_lab'},
    {texto:'Procurar o ginásio da ilha.', vai:'c14_ginasio'},
    {texto:'Subir o vulcão. Tem fumaça errada saindo dele.', vai:'c14_vulcao'}
  ]
},

c14_cidade:{
  texto:[
    'Ninguém quer falar do laboratório.',
    'Todo mundo fala do laboratório.',
    'Você passa quatro horas na rua principal e colhe seis versões, todas contadas em voz baixa e todas contadas sem você pedir duas vezes.',
    fala('a dona da mercearia', 'Fechou há anos.'),
    fala('o rapaz da padaria', 'Fechou no papel.'),
    fala('a senhora da janela', 'Tinha gente entrando de madrugada até semana passada.'),
    fala('o homem da ferragem', 'Foi curto-circuito.'),
    fala('o velho da companhia de luz', 'Foi curto-circuito uma ova. A luz do prédio tá cortada desde noventa e nove, eu trabalhei na companhia.'),
    'E a sexta, dita por um homem no bar do cais, que é a que muda tudo:',
    fala('o homem do bar do cais', 'Quem botou fogo foi de fora. Chegou no sábado e foi embora no sábado. Duas pessoas, num barco fretado, que não é barco daqui.'),
    d=>fala(d.jogador.nome, 'Como o senhor sabe que não é daqui?'),
    fala('o homem do bar do cais', 'Porque barco daqui eu conheço pelo motor, {moço|moça}. Setecentas pessoas. Eu conheço todos os motores.')
  ],
  ef:{flag:['ouviu_as_versoes','sabe_do_barco_fretado'],
      executar:()=>{ Relogio.avancar(4); return []; },
      rep:{eixo:'bom',delta:2,motivo:'Ouviu seis versões antes de acreditar em uma'},
      registrar:'Duas pessoas de fora chegaram e saíram no sábado, em barco fretado, e o laboratório queimou.',
      presagio:'Ele conhece todos os motores. Numa ilha de setecentos, isso é um sistema de segurança.'},
  escolhas:[
    {texto:'Procurar quem trabalhou no laboratório.', vai:'c14_selma'},
    {texto:'Perguntar mais sobre o barco ao homem do bar.', vai:'c14_barco_fretado'},
    {texto:'Entrar no laboratório.', vai:'c14_lab'},
    {texto:'Procurar o ginásio.', vai:'c14_ginasio'}
  ]
},

/* a rua principal, da segunda vez: o que dá pra fazer na ilha */
c14_cidade_de_novo:{
  repetivel:true,
  texto:[
    'A rua principal de Cinnabar é curta: dá pra ir de uma ponta à outra em seis minutos, e em seis minutos três pessoas te cumprimentam com a cabeça.',
    d=>d.flags.capturou_moltres
      ? 'Do fim da rua se vê o vulcão, e não sai fumaça nenhuma dele.'
      : 'Do fim da rua se vê o vulcão, com a fumaça de sempre.'
  ],
  escolhas:[
    {texto:d=>d.flags.conheceu_selma ? 'Ir ao portão da Sra. Wilma.' : 'Procurar quem trabalhou no laboratório.', vai:'c14_selma'},
    {texto:'Perguntar por barco fretado no bar do cais.', vai:'c14_barco_fretado', cond:c14_nova('c14_barco_fretado')},
    {texto:'Ir ao bar do cais.', vai:'c14_barco_fretado', cond:d=>Historia.jaAconteceu('c14_barco_fretado')},
    {texto:'Ir à casa do Dr. Fuji.', vai:'c14_casa_do_fuji', cond:d=>!!d.flags.achou_a_casa},
    {texto:'Procurar o Sr. Berto.', vai:'c14_tokuda', cond:d=>!!d.flags.achou_o_livro_de_acesso && !d.flags.conheceu_tokuda},
    {texto:'Ir ao laboratório.', vai:'c14_lab'},
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir pro porto esperar o ferry.', vai:'c14_fim'}
  ]
},

c14_barco_fretado:{
  falante:'o homem do bar do cais',
  vozes:['N','N','P','N'],
  texto:[
    d=>d.flags.ouviu_as_versoes
      ? 'O homem do bar te leva até a rampa e aponta uma marca na madeira da defensa.'
      : 'No bar do cais, você pergunta por barco fretado, e o homem do balcão larga o pano, te leva até a rampa e aponta uma marca na madeira da defensa.',
    '"Ó. Encostaram aqui e não amarraram direito."',
    'A marca é uma tinta azul raspada na madeira, e ele raspa com a unha e te mostra a lasquinha.',
    '"Isso é tinta de casco de fretado de Vermilion. Aqui a gente usa tinta cinza, que é mais barata e aguenta mais enxofre."',
    '"E tem registro de atracação?"',
    'Ele ri.',
    '"Registro? {Moço|Moça}, a capitania anota barco e gente. Carga, não. Quem anota carga é o Sr. Nolan, que cobra por uso do guincho."',
    'Ele aponta um caderno pendurado num prego na parede do barracão do guincho.',
    'Um caderno espiral, pendurado num prego, com um lápis amarrado num barbante.',
    'Você folheia de trás pra frente até o último sábado com barco de fora.',
    d=>`**"sáb ${c14_diaDoFogo(d)} — fretado azul — 2 pessoas — 40 min — pagou"**`,
    'E embaixo, na mesma linha, na letra do Sr. Nolan:',
    '**"trouxeram 2 galão. levaram nada"**'
  ],
  ef:{flag:['sabe_das_quatro_caixas','provas_cinnabar'],
      rep:{eixo:'bom',delta:4,motivo:'Achou o registro num caderno pendurado num prego'},
      registrar:'No sábado do incêndio, duas pessoas vieram num fretado de Vermilion com dois galões, e não levaram nada.',
      presagio:'Dois galões, e não levaram nada. Ninguém traz galão pra buscar papel.'},
  escolhas:[
    {texto:'"O que eles vieram buscar?"', vai:'c14_quantas_ficaram'},
    {texto:'Entrar no laboratório.', vai:'c14_lab'},
    {texto:'Procurar quem trabalhou lá.', vai:'c14_selma'},
    {texto:'Procurar o ginásio.', vai:'c14_ginasio'}
  ]
},

/* o bar do cais, da segunda vez */
c14_cais_de_novo:{
  repetivel:true,
  texto:[
    'No bar do cais, o homem do balcão te serve um café sem você pedir, e cobra.',
    ()=>Historia.jaAconteceu('c14_quantas_ficaram')
      ? 'O Sr. Nolan está encostado no barracão do guincho, onde sempre está, e levanta o boné de leve quando te vê.'
      : 'O caderno do guincho continua pendurado no prego, com o lápis no barbante.'
  ],
  escolhas:[
    {texto:'"O que eles vieram buscar?"', vai:'c14_quantas_ficaram', cond:c14_nova('c14_quantas_ficaram')},
    {texto:'"Quem escondeu as cinco?"', vai:'c14_quem_escondeu', cond:d=>Historia.jaAconteceu('c14_quantas_ficaram') && !Historia.jaAconteceu('c14_quem_escondeu')},
    {texto:'Ir ao laboratório.', vai:'c14_lab'},
    {texto:'Voltar pra rua principal.', vai:'c14_cidade'},
    {texto:'Ficar no porto esperando o ferry.', vai:'c14_fim'}
  ]
},

c14_quantas_ficaram:{
  falante:'Sr. Nolan',
  vozes:['P','o homem do bar do cais','N','N','P','N','N'],
  texto:[
    '"O que eles vieram buscar?"',
    'O homem do bar franze a testa.',
    '"Sei lá. Papel, dizem. O prédio era só papel e tanque."',
    'E aí o Sr. Nolan, que estava ouvindo encostado no barracão sem participar, fala pela primeira vez.',
    '"Cinco caixas."',
    'Os dois olham pra ele.',
    '"Cinco", ele repete. "Eu sei porque em noventa e seis eu carreguei nove no guincho. Quatro foram pro fretado e cinco voltaram pro prédio."',
    '"Em noventa e seis?"',
    '"Em novembro de noventa e seis. Mesma coisa: barco de fora, duas pessoas, quarenta minutos."',
    'Ele cospe.',
    '"E agora voltaram pra buscar as cinco e não acharam, e aí botaram fogo."'
  ],
  ef:{flag:['sabe_das_nove_caixas','sabe_das_cinco'],
      npc:{nome:'Sr. Nolan', opiniao:3, memoria:'Carregou as nove caixas em 1996. Quatro foram embora, cinco voltaram para o prédio.'},
      rep:{eixo:'bom',delta:5,motivo:'Perguntou o que eles vieram buscar'},
      instabilidade:1,
      registrar:'Em 1996 saíram quatro das nove caixas. As cinco restantes não foram achadas no sábado, e o prédio foi incendiado.',
      presagio:'Não acharam as cinco. Alguém em Cinnabar sabia onde elas estavam.'},
  escolhas:[
    {texto:'"Quem escondeu as cinco?"', vai:'c14_quem_escondeu'},
    {texto:'Entrar no laboratório.', vai:'c14_lab'},
    {texto:'Procurar quem trabalhou lá.', vai:'c14_selma'},
    {texto:'Procurar o ginásio.', vai:'c14_ginasio'}
  ]
},

c14_quem_escondeu:{
  falante:'Sr. Nolan',
  vozes:['P','N','P','N','N'],
  texto:[
    '"Quem escondeu as cinco?"',
    'Os dois ficam quietos.',
    'E aí o Sr. Nolan fala uma coisa e você percebe que ele já tinha decidido falar isso antes de você chegar na ilha, e que ele está esperando alguém perguntar faz quatro anos:',
    '"Em noventa e seis, quando as cinco voltaram do guincho pro prédio, eu levei elas num carrinho até a porta do subsolo."',
    '"E?"',
    '"E quem abriu a porta pra mim não era da Silph."',
    'Ele ajeita o boné.',
    '"Era o Doutor Blaine."'
  ],
  ef:{flag:['sabe_do_blaine','blaine_tem_as_caixas'],
      rep:{eixo:'bom',delta:5,motivo:'Perguntou quem, e alguém estava esperando quatro anos pra responder'},
      instabilidade:1,
      registrar:'Em 1996, quem recebeu as cinco caixas restantes foi o Blaine, líder do ginásio de Cinnabar.',
      presagio:'O líder de ginásio da ilha recebeu cinco caixas de arquivo na porta de um subsolo.'},
  escolhas:[
    {texto:'Ir ao ginásio agora.', vai:'c14_ginasio'},
    {texto:'Entrar no laboratório primeiro.', vai:'c14_lab'},
    {texto:'Procurar quem trabalhou lá.', vai:'c14_selma'},
    {texto:'Subir o vulcão primeiro.', vai:'c14_vulcao'}
  ]
},

/* ─────────────── A SRA. WILMA ─────────────── */

c14_selma:{
  falante:'Sra. Wilma',
  vozes:['N','N','P','N','N','P','N'],
  texto:[
    d=>c14_esperou(d, 'c14_espera_wilma',
      'É cedo pra bater no portão de alguém. Você espera a rua acordar, e às sete ela abre a janela.',
      'Já é tarde pra bater no portão de alguém. Você volta {quando}, às sete.'),
    'Ela se chama Sra. Wilma, tem setenta e um anos, e trabalhou na limpeza do laboratório de mil novecentos e setenta e nove a mil novecentos e noventa e sete.',
    'Dezoito anos.',
    'Ela te recebe no portão e não abre o portão, e você conversa com ela por cima de um muro de meio metro, e ela aceita o café que você compra na padaria da esquina e bebe em pé.',
    'E fala, depois de aceitar o café e antes de se arrepender:',
    '"Tinha um tanque."',
    '"Grande, do tamanho de um carro, no subsolo, na sala que a gente não limpava."',
    '"Por que não limpavam?"',
    '"Porque não podia. A gente limpava até a porta e parava. Tinha uma linha de fita amarela no chão e a gente parava na fita."',
    'Ela bebe o café.',
    '"E o que tava dentro cresceu rápido demais pro tanque."',
    '"E aí?"',
    '"E aí um dia não tinha mais tanque, não tinha mais teto, e não tinha mais o Doutor Fuji."'
  ],
  ef:{flag:['ouviu_historia_lab','conheceu_selma'],
      executar:()=>{ c14_esperarAbrir('c14_espera_wilma', 7, 20, false); return []; },
      npc:c14_npc('Sra. Wilma', 2, 'Limpou o laboratório de Cinnabar por dezoito anos, até a linha de fita amarela no chão.'),
      registrar:'Havia um tanque no subsolo do laboratório. O que estava dentro cresceu demais para ele.',
      presagio:'Ela limpava até a fita e parava. Dezoito anos parando na fita.'},
  escolhas:[
    {texto:'"O senhor Fuji morreu?"', vai:'c14_fuji_morreu'},
    {texto:'"A senhora chegou a ver o que tinha no tanque?"', vai:'c14_viu_o_tanque'},
    {texto:'"E o incêndio de semana passada?"', vai:'c14_incendio_da_semana'},
    {texto:'Agradecer e entrar no laboratório.', vai:'c14_lab'}
  ]
},

/* o portão da Sra. Wilma, da segunda vez */
c14_selma_de_novo:{
  repetivel:true,
  texto:[
    d=>c14_esperou(d, 'c14_espera_wilma',
      'É cedo. Você espera a rua acordar, e às sete a Sra. Wilma abre a janela.',
      'Já é tarde pra bater no portão de alguém. Você volta {quando}, às sete.'),
    'A Sra. Wilma está no portão, que continua fechado, e aceita outro café da padaria da esquina.',
    d=>d.flags.selma_acenou ? 'Ela segura a xícara com as duas mãos, do jeito que segurou da outra vez.' : ''
  ],
  ef:{executar:()=>{ c14_esperarAbrir('c14_espera_wilma', 7, 20, false); return []; }},
  escolhas:[
    {texto:'"O senhor Fuji morreu?"', vai:'c14_fuji_morreu', cond:c14_nova('c14_fuji_morreu')},
    {texto:'"A senhora chegou a ver o que tinha no tanque?"', vai:'c14_viu_o_tanque', cond:c14_nova('c14_viu_o_tanque')},
    {texto:'"A senhora contou isso pra alguém?"', vai:'c14_selma_contou', cond:d=>Historia.jaAconteceu('c14_viu_o_tanque') && !Historia.jaAconteceu('c14_selma_contou')},
    {texto:'"E o incêndio de semana passada?"', vai:'c14_incendio_da_semana', cond:c14_nova('c14_incendio_da_semana')},
    {texto:'"Quem paga o imposto da casa?"', vai:'c14_quem_paga', cond:d=>!!d.flags.sabe_do_iptu && !Historia.jaAconteceu('c14_quem_paga')},
    {texto:d=>d.flags.achou_a_casa ? 'Ir à casa do Dr. Fuji.' : '"Onde é a casa dele?"', vai:'c14_casa_do_fuji', cond:d=>!!d.flags.sabe_do_iptu},
    {texto:'Ir ao laboratório.', vai:'c14_lab'},
    {texto:'Voltar pra rua principal.', vai:'c14_cidade'}
  ]
},

c14_fuji_morreu:{
  falante:'Sra. Wilma',
  vozes:['P','N','P','N','N','N','P','N','N'],
  texto:[
    '"O senhor Fuji morreu?"',
    'Ela demora.',
    '"Não sei."',
    '"Como assim não sabe?"',
    '"Não teve enterro."',
    'Ela põe a xícara no muro.',
    '"Numa ilha de setecentas pessoas, meu bem, todo mundo vai em todo enterro. É a coisa que a gente faz aqui. Morreu, vai todo mundo, e depois tem café na casa da família."',
    '"O Doutor Fuji trabalhou nessa ilha vinte e dois anos e não teve enterro, não teve vigília de sétimo dia, não teve nada."',
    '"E a casa dele?"',
    '"A casa dele tá lá. Fechada. O imposto da casa tá pago."',
    'Ela olha pra você.',
    '"Tem gente que paga o imposto da casa dele. E não sou eu, e não é a prefeitura."'
  ],
  ef:{flag:['sabe_do_iptu','fuji_sem_enterro'],
      rep:{eixo:'bom',delta:4,motivo:'Perguntou pelo homem, e não pelo tanque'},
      npc:c14_npc('Sra. Wilma', 5, 'Te contou que o Dr. Fuji não teve enterro e que alguém paga o imposto da casa dele.'),
      registrar:'O Dr. Fuji não teve enterro. Alguém paga o imposto da casa dele até hoje.'},
  escolhas:[
    {texto:'"Onde é a casa dele?"', vai:'c14_casa_do_fuji'},
    {texto:'"Quem paga o imposto da casa?"', vai:'c14_quem_paga'},
    {texto:'"E o incêndio de semana passada?"', vai:'c14_incendio_da_semana', cond:c14_nova('c14_incendio_da_semana')},
    {texto:'Ir ao laboratório.', vai:'c14_lab'}
  ]
},

c14_quem_paga:{
  falante:'Sra. Wilma',
  vozes:['P','N','P','a funcionária da prefeitura'],
  texto:[
    '"Quem paga o imposto da casa?"',
    '"Vai na prefeitura e pergunta, meu bem. É público."',
    'A prefeitura de Cinnabar tem duas salas e funciona das oito às catorze, de segunda a sexta.',
    d=>c14_esperou(d, 'c14_espera_prefeitura',
      'Você espera na calçada até abrir.',
      'Hoje ela não abre mais. Você volta {quando}, às oito.'),
    'A funcionária do setor de tributos consulta a inscrição imobiliária, anota num papelzinho e vira o monitor pra você, porque ela não vê problema nenhum nisso e porque de fato não tem problema nenhum nisso.',
    '**INSCRIÇÃO 2.117 — TITULAR: FUJI, A. — SITUAÇÃO: EM DIA — PAGAMENTO: DÉBITO AUTOMÁTICO — TITULAR DA CONTA: B. HOLLOWAY**',
    '"B. Holloway?"',
    'Ela ri.',
    '"Ah, esse é o Doutor Blaine. Blaine é como ele se chama no ginásio. O nome dele é Burke Holloway e ele é o cara mais chato da ilha na fila do banco."'
  ],
  ef:{flag:['blaine_paga_o_iptu','sabe_do_blaine'],
      executar:()=>{ c14_esperarAbrir('c14_espera_prefeitura', 8, 14, true); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Foi na prefeitura e perguntou'},
      registrar:'Blaine paga, por débito automático, o imposto da casa do Dr. Fuji há anos.',
      presagio:'Ele paga há anos. Ninguém paga imposto de casa de morto por acaso.'},
  escolhas:[
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'},
    {texto:'Ir à casa do Fuji.', vai:'c14_casa_do_fuji'},
    {texto:'Ir ao laboratório.', vai:'c14_lab'},
    {texto:'Voltar e perguntar mais pra Sra. Wilma.', vai:'c14_selma'}
  ]
},

/* ─────────────── A CASA DO FUJI ─────────────── */

c14_casa_do_fuji:{
  texto:[
    'A casa do Dr. Fuji fica no fim da rua de trás, encostada na encosta do vulcão, e é uma casa de madeira com telhado de zinco e um portão de ferro trabalhado que alguém pintou recentemente.',
    'Recentemente.',
    'Uma casa fechada há quatro anos com o portão pintado, o jardim aparado e a caixa de correio vazia.',
    'Vazia. Não cheia: vazia.',
    'Alguém recolhe a correspondência.',
    'A porta está trancada. A janela da cozinha, não — ela está encostada, com o trinco quebrado, e o trinco foi quebrado faz muito tempo porque a madeira já escureceu no lugar da quebra.',
    d=>c14_blaineNaVaranda(d)
      ? 'E na varanda, na cadeira de balanço, tem um homem de uns setenta anos, de bermuda, com uma garrafa térmica do lado, olhando a rua.'
      : 'E na varanda, ao lado da porta, tem uma cadeira de balanço com uma almofada.',
    d=>c14_blaineNaVaranda(d) ? '' : 'A almofada está achatada no meio.'
  ],
  ef:{flag:['achou_a_casa','casa_cuidada'],
      rep:{eixo:'bom',delta:2,motivo:'Foi olhar a casa em vez de acreditar na versão'},
      registrar:'A casa do Dr. Fuji está fechada há quatro anos, com o jardim aparado e a correspondência recolhida.',
      presagio:d=>c14_blaineNaVaranda(d) ? 'Ele está na varanda da casa, e não dentro dela.' : 'A almofada está achatada no meio. Alguém senta ali com frequência.'},
  escolhas:[
    {texto:'Falar com ele.', vai:'c14_blaine_na_varanda', cond:c14_blaineNaVaranda},
    {texto:'Entrar pela janela da cozinha.', vai:'c14_dentro_da_casa', cond:d=>!c14_blaineNaVaranda(d)},
    {texto:'Esperar na rua pra ver quem vem.', vai:'c14_esperou_na_casa', cond:d=>!c14_blaineNaVaranda(d)},
    {texto:'Não entrar. Ir ao ginásio perguntar.', vai:'c14_ginasio'},
    {texto:'Ir ao laboratório.', vai:'c14_lab'}
  ]
},

/* a casa, da segunda vez: quem está na varanda depende da hora */
c14_casa_de_novo:{
  repetivel:true,
  texto:[
    d=>d.flags.arrumou_a_casa
      ? 'A casa do Dr. Fuji está com as janelas abertas pela primeira vez em quatro anos, e tem uma caixa de roupa dobrada na varanda, esperando alguém levar.'
      : 'A casa do Dr. Fuji continua como estava: o portão pintado, o jardim aparado, a caixa de correio vazia.',
    d=>!c14_blaineNaVaranda(d) ? 'A cadeira de balanço da varanda está vazia.'
      : d.flags.conheceu_blaine ? 'Na varanda, na cadeira de balanço, o Blaine olha a rua com a garrafa térmica do lado.'
      : 'Na varanda, na cadeira de balanço, tem um homem de uns setenta anos, de bermuda, com uma garrafa térmica do lado, olhando a rua.'
  ],
  escolhas:[
    {texto:d=>d.flags.conheceu_blaine ? 'Ir falar com o Blaine.' : 'Falar com ele.', vai:'c14_blaine_na_varanda', cond:c14_blaineNaVaranda},
    {texto:'Esperar na rua pra ver quem vem.', vai:'c14_esperou_na_casa',
     cond:d=>!c14_blaineNaVaranda(d) && !d.flags.conheceu_blaine && !Historia.jaAconteceu('c14_esperou_na_casa')},
    {texto:d=>d.flags.conheceu_blaine ? 'Esperar o Blaine chegar.' : 'Esperar o homem da cadeira de balanço chegar.', vai:'c14_blaine_na_varanda',
     cond:d=>!c14_blaineNaVaranda(d) && (!!d.flags.conheceu_blaine || Historia.jaAconteceu('c14_esperou_na_casa'))},
    {texto:'Entrar pela janela da cozinha.', vai:'c14_dentro_da_casa', cond:d=>!c14_blaineNaVaranda(d) && !d.flags.entrou_na_casa_do_fuji},
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'},
    {texto:'Ir ao laboratório.', vai:'c14_lab'},
    {texto:'Voltar pra rua principal.', vai:'c14_cidade'}
  ]
},

c14_esperou_na_casa:{
  texto:[
    d=>d.flags.c14_esperou_casa === 'outro'
      ? 'Já é tarde pra ficar parad{o|a} na rua de alguém. Você volta no dia seguinte, depois do almoço, e espera do outro lado da rua, encostad{o|a} num muro, por seis horas.'
      : d.flags.c14_esperou_casa === 'madrugada'
      ? 'É madrugada. Você dorme umas horas, volta depois do almoço e espera do outro lado da rua, encostad{o|a} num muro, por seis horas.'
      : `Você espera do outro lado da rua, encostad{o|a} num muro, por ${c14_horas(d.flags.c14_esperou_casa_horas || 6)}.`,
    'Às seis e quarenta da tarde chega um homem de uns setenta anos, de bermuda, com uma sacola de pão e uma garrafa térmica.',
    'Ele abre o portão com chave própria, senta na cadeira de balanço, serve café numa xícara que estava virada em cima da mureta, e come pão.',
    'Não entra na casa.',
    'Fica olhando a rua, sozinho, com a luz apagada.',
    'E você entende que ele faz isso todo dia pelo jeito que ele faz: sem pensar em nada, com o corpo já sabendo onde está a xícara.'
  ],
  ef:{flag:'viu_o_blaine_na_varanda',
      executar:d=>{
        const h = c14_hora(d);
        if (h >= 6 && h < 18){ Estado.marcar('c14_esperou_casa', 'cedo'); Estado.marcar('c14_esperou_casa_horas', 18 - h); c14_ate(18); }
        else if (h < 6){ Estado.marcar('c14_esperou_casa', 'madrugada'); c14_ate(18); }
        else { Estado.marcar('c14_esperou_casa', 'outro'); Relogio.amanhaAs(18); }
        return [];
      },
      rep:{eixo:'bom',delta:4,motivo:'Esperou a tarde inteira pra ver quem vinha'},
      moral:-5,
      registrar:'Um homem de setenta anos vai todo dia à varanda da casa do Dr. Fuji, toma café, come pão e não entra.',
      presagio:'Ele não entra. Ele só senta na varanda.'},
  escolhas:[
    {texto:'Atravessar a rua e falar com ele.', vai:'c14_blaine_na_varanda'},
    {texto:'Esperar ele ir embora e entrar pela janela.', vai:'c14_dentro_da_casa', ef:{executar:()=>{ c14_ate(20); return []; }}},
    {texto:'Ir embora sem falar com ele.', vai:'c14_cidade'}
  ]
},

/* ─────────────── O BLAINE NA VARANDA ─────────────── */

c14_blaine_na_varanda:{
  falante:'Blaine',
  vozes:['N','N','P','N','N','N'],
  texto:[
    d=>c14_linhaDoBlaine(d),
    d=>(d.flags.viu_o_blaine_na_varanda || d.flags.c14_esperou_blaine) ? 'Você atravessa a rua e para na calçada, do lado de fora do portão.' : 'Você para na calçada, do lado de fora do portão.',
    'Ele te vê chegar e não se assusta e não levanta.',
    'Serve café na xícara que estava virada e estende por cima do portão.',
    '"Senta. Tem outra cadeira lá dentro, mas eu não entro na casa."',
    'Você entra, pega a cadeira da varanda, que é a única, e ele fica de pé encostado na coluna.',
    d=>`"${c14_comoTeConhece(d)[0]}"`,
    d=>`"${c14_comoTeConhece(d)[1]}"`,
    d=>`"${c14_comoTeConhece(d)[2]}"`,
    'Ele bebe o café.',
    '"Eu sou o Burke. No ginásio me chamam de Blaine porque o nome do meu avô era Blaine e eu achei bonito aos vinte e dois anos, e agora eu tenho setenta e dois e tô preso com ele."',
    'Ele olha a porta fechada da casa.',
    '"E o Ansel era meu amigo desde sessenta e nove."'
  ],
  ef:{flag:['conheceu_blaine','sabe_do_blaine'],
      executar:d=>{ c14_esperarBlaine(d); return []; },
      npc:c14_npc('Blaine', 2, 'Te serviu café na varanda da casa do amigo dele e disse que não entra na casa.'),
      rep:{eixo:'bom',delta:3,motivo:'Foi até o portão em vez de continuar olhando'},
      registrar:'Blaine, líder de Cinnabar, era amigo do Dr. Fuji desde 1969 e vai à varanda dele todo dia.',
      presagio:'"Eu não entro na casa." Ele tem a chave e não entra.'},
  escolhas:[
    {texto:'"Por que você não entra na casa?"', vai:'c14_porque_nao_entra'},
    {texto:c14_perguntaDasCaixas, vai:'c14_as_cinco_caixas', ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"O que aconteceu com ele?"', vai:'c14_o_que_aconteceu_com_fuji'},
    {texto:'"Eu vi o andar onze da Silph."', vai:'c14_falou_do_onze', cond:d=>!!d.flags.viu_os_doze, ef:C14_ANTES_DAS_CAIXAS}
  ]
},

/* a varanda, de novo: o Blaine está lá das seis e quarenta às oito */
c14_varanda_de_novo:{
  repetivel:true,
  texto:[
    d=>c14_linhaDoBlaine(d),
    d=>d.flags.queimou_caderno
      ? 'Blaine está na cadeira de balanço, com a garrafa térmica, e não te oferece café. Ele olha a rua por cima de você.'
      : 'Blaine está na cadeira de balanço, com a garrafa térmica, e serve café pra você sem perguntar.',
    d=>d.flags.blaine_pode_parar ? 'No bolso da camisa dele estão os óculos de leitura do amigo.' : ''
  ],
  ef:{executar:d=>{ c14_esperarBlaine(d); return []; }},
  escolhas:[
    {texto:'"Por que você não entra na casa?"', vai:'c14_porque_nao_entra', cond:c14_nova('c14_porque_nao_entra')},
    {texto:'"O que aconteceu com ele?"', vai:'c14_o_que_aconteceu_com_fuji', cond:c14_nova('c14_o_que_aconteceu_com_fuji')},
    {texto:c14_perguntaDasCaixas, vai:'c14_as_cinco_caixas', cond:c14_nova('c14_as_cinco_caixas'), ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"Eu vi o andar onze da Silph."', vai:'c14_falou_do_onze', cond:d=>!!d.flags.viu_os_doze && !Historia.jaAconteceu('c14_falou_do_onze'), ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"Me deixa entrar na casa."', vai:'c14_deixa_entrar', cond:d=>!Historia.jaAconteceu('c14_deixa_entrar') && !d.flags.queimou_caderno},
    {texto:'Ir com ele pro ginásio.', vai:'c14_ginasio_por_dentro', cond:d=>Historia.jaAconteceu('c14_as_cinco_caixas') && !d.flags.queimou_caderno},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)},
    {texto:'Ir embora.', vai:'c14_cidade'}
  ]
},

c14_porque_nao_entra:{
  falante:'Blaine',
  vozes:['P','N','P','N','N','N','N','N','N'],
  texto:[
    '"Por que você não entra na casa?"',
    'Ele demora tanto que você acha que não vai responder.',
    '"Porque tá tudo do jeito que ele deixou."',
    '"E isso é ruim?"',
    '"Isso é o contrário de ruim, e por isso é pior."',
    'Ele encosta a testa na coluna da varanda por um segundo e desencosta.',
    '"Tem uma xícara de café na pia dele desde novembro de noventa e seis, {meu filho|minha filha}. Com café dentro. Virou uma pedra preta."',
    '"E eu não lavo. E eu não deixo ninguém lavar. E eu pago o imposto da casa pra prefeitura não tomar e vender."',
    '"Faz quatro anos."',
    'Ele termina o café.',
    '"E eu sei exatamente o que isso é, tá? Eu tenho setenta e dois anos e eu não sou bobo. Isso é eu não aceitar."',
    '"E eu vou continuar não aceitando, porque a alternativa é aceitar, e eu não quero."'
  ],
  ef:{flag:'blaine_falou_da_casa',
      npc:c14_npc('Blaine', 5, 'Te explicou por que não entra na casa e por que paga o imposto da casa há quatro anos.'),
      rep:{eixo:'bom',delta:2,motivo:'Perguntou e ouviu a resposta inteira'},
      moral:-5,
      registrar:'Blaine mantém a casa do Fuji intacta desde novembro de 1996.',
      presagio:d=>{
        const l = [];
        if (d.flags.sabe_das_nove_caixas) l.push('das quatro caixas');
        if (c14_viuOFormulario(d)) l.push('do caderno 7');
        if (d.flags.sabe_da_porta_fechada) l.push('da porta tapada em Saffron');
        return l.length ? `Novembro de noventa e seis. A mesma data ${c14_lista(l)}.` : 'Novembro de noventa e seis. Ele disse a data sem precisar pensar.';
      }},
  escolhas:[
    {texto:'"O que aconteceu com ele?"', vai:'c14_o_que_aconteceu_com_fuji'},
    {texto:c14_perguntaDasCaixas, vai:'c14_as_cinco_caixas', ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"Eu vi o andar onze da Silph."', vai:'c14_falou_do_onze', cond:d=>!!d.flags.viu_os_doze, ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"Me deixa entrar na casa."', vai:'c14_deixa_entrar'}
  ]
},

c14_o_que_aconteceu_com_fuji:{
  falante:'Blaine',
  vozes:['P','N','P','N','N','N','N','N','P','N','N','N'],
  texto:[
    '"O que aconteceu com ele?"',
    'Blaine senta no degrau da varanda, porque a única cadeira é sua e ele não vai te pedir pra levantar.',
    '"Em novembro de noventa e seis ele disse não."',
    '"Não pra quê?"',
    '"Pra continuar."',
    'Ele apoia os cotovelos nos joelhos.',
    '"Ele trabalhou duzentos e quarenta e um dias com aquilo. Duzentos e quarenta e um dias conversando, todo dia, anotando tudo num caderno."',
    '"E no dia duzentos e quarenta e um ele foi numa reunião e disse não, e disse que o resultado do experimento era que existia alguém ali e que o experimento acabava."',
    '"E eles tiraram ele do projeto na hora, na reunião, no mesmo dia."',
    'Ele olha a rua.',
    '"E dez dias depois teve o incidente. O tanque, o teto, tudo."',
    '"E ele?"',
    '"Ele estava lá dentro."',
    'Silêncio comprido.',
    '"E aí é a parte que eu não conto pra ninguém há quatro anos, {meu filho|minha filha}, e eu vou contar porque você perguntou dele, e todo mundo que aparece aqui pergunta do tanque."',
    '"Não acharam corpo."'
  ],
  ef:{flag:['sabe_do_nao','nao_acharam_corpo'],
      npc:c14_npc('Blaine', 7, 'Te contou que o Fuji disse não no dia 241 e que não acharam corpo.'),
      rep:{eixo:'bom',delta:5,motivo:'Perguntou do homem, e não do tanque'},
      instabilidade:1, moral:-10,
      registrar:'O Dr. Fuji foi retirado do projeto no dia 241 e desapareceu no incidente, dez dias depois. Não acharam corpo.'},
  escolhas:[
    {texto:'"Você acha que ele tá vivo?"', vai:'c14_esta_vivo'},
    {texto:c14_perguntaDasCaixas, vai:'c14_as_cinco_caixas', ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"Eu vi o andar onze da Silph."', vai:'c14_falou_do_onze', cond:d=>!!d.flags.viu_os_doze, ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"Me deixa entrar na casa."', vai:'c14_deixa_entrar'}
  ]
},

c14_esta_vivo:{
  falante:'Blaine',
  vozes:['P','N','N','P','N','N','N','N'],
  texto:[
    '"Você acha que ele tá vivo?"',
    '"Não."',
    'Sem hesitação.',
    '"Eu acho que ele morreu no dia doze de novembro de noventa e seis num subsolo de um prédio a oitocentos metros daqui."',
    '"Então por que a casa?"',
    'Ele olha a xícara vazia.',
    '"Porque “não acharam corpo” é uma frase que não deixa a gente terminar."',
    '"Eu sei que ele morreu. Eu sei com a cabeça. Eu tenho setenta e dois anos e eu enterrei minha mulher e meus dois irmãos e eu sei muito bem como é."',
    '"Mas enterro não é pro morto, {meu filho|minha filha}. Enterro é pra gente poder parar."',
    'Ele levanta com dificuldade.',
    '"E eu não tive."',
    'Ele pega a xícara e vai lavar na torneira do jardim, e vira ela no mesmo lugar de sempre.'
  ],
  ef:{flag:'blaine_sem_enterro',
      npc:c14_npc('Blaine', 8, 'Disse que enterro não é para o morto, é para a gente poder parar.'),
      rep:{eixo:'bom',delta:3,motivo:'Deixou um velho terminar o raciocínio'},
      moral:-8,
      registrar:'"Enterro não é pro morto. Enterro é pra gente poder parar."'},
  escolhas:[
    {texto:c14_perguntaDasCaixas, vai:'c14_as_cinco_caixas', ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"Eu vi o andar onze da Silph."', vai:'c14_falou_do_onze', cond:d=>!!d.flags.viu_os_doze, ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"Me deixa entrar na casa."', vai:'c14_deixa_entrar'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)}
  ]
},

/* ─────────────── AS CINCO CAIXAS ─────────────── */

c14_falou_do_onze:{
  falante:'Blaine',
  vozes:['P','N','E','N','P','N','P','N','P','N','N'],
  texto:[
    '"Eu vi o andar onze da Silph."',
    'Blaine não se mexe.',
    '"Como é que é?"',
    'Você conta. Os doze tanques. Os onze ocupados. O décimo segundo vazio com a plaqueta MATRIZ — VAGO. O quadro branco com a linha do tempo. As três séries. A frase em caneta preta:',
    '"O DR. FUJI CONVERSOU COM ELE POR 241 DIAS. NÓS NÃO TEMOS 241 DIAS."',
    'E o rabisco do canto, escrito e apagado três vezes: "eles não falam porque ninguém pergunta".',
    'Blaine senta no chão da varanda. Não no degrau: no chão, com as costas na parede da casa, e ele tem setenta e dois anos e leva um tempo pra sentar.',
    '"Eles continuaram."',
    '"Continuaram."',
    '"Com o material que saiu daqui em noventa e seis, nas quatro caixas."',
    '"É."',
    'Ele passa as duas mãos no rosto.',
    '"Eu deixei sair quatro."',
    d=>d.flags.c14_sabia_das_caixas ? '"Você não deixou nada. Você escondeu cinco."' : '"Quatro de quantas?"',
    d=>d.flags.c14_sabia_das_caixas ? '"Eu escondi cinco e deixei sair quatro."' : '"De nove. Eu escondi cinco e deixei sair quatro."',
    'Ele olha a porta fechada da casa.',
    '"Quatro anos eu me disse que eu tinha salvado cinco."'
  ],
  ef:{flag:['blaine_sabe_do_onze','blaine_quebrado','blaine_tem_as_caixas'],
      npc:c14_npc('Blaine', 6, 'Descobriu com você que a Silph continuou o projeto com as quatro caixas que saíram em 1996.'),
      rep:{eixo:'bom',delta:4,motivo:'Contou a um velho a coisa que ele passou quatro anos sem saber'},
      moral:-10, instabilidade:1,
      registrar:'Blaine soube que a Silph continuou o projeto com o material das quatro caixas.',
      presagio:'"Eu escondi cinco e deixei sair quatro." Ele disse as duas metades na mesma frase.'},
  escolhas:[
    {texto:'"O que tem nas cinco caixas?"', vai:'c14_as_cinco_caixas', cond:c14_nova('c14_as_cinco_caixas'), ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"A gente pode parar isso."', vai:'c14_pode_parar'},
    {texto:'"Não é culpa sua."', vai:'c14_nao_e_culpa'}
  ]
},

c14_nao_e_culpa:{
  falante:'Blaine',
  vozes:['P','N','P','N','N','N','P','N'],
  texto:[
    '"Não é culpa sua."',
    'Ele levanta a mão sem levantar a cabeça.',
    '"Não faz isso."',
    '"Fazer o quê?"',
    '"Isso aí. Eu tenho setenta e dois anos e eu já ouvi isso de sete pessoas diferentes e nenhuma das sete estava tentando me ajudar, todas as sete estavam tentando encerrar o assunto porque assunto assim é chato de ouvir."',
    'Ele finalmente olha pra você.',
    '"E você não tá tentando encerrar. Eu sei. Mas essa frase encerra igual."',
    'Pausa.',
    '"Se você quiser me ajudar de verdade, me pergunta o que tem nas caixas."',
    '"Por quê?"',
    '"Porque faz quatro anos que ninguém me pergunta o que tem nas caixas."'
  ],
  ef:{flag:'blaine_te_ensinou',
      npc:c14_npc('Blaine', 6, 'Te ensinou que "não é culpa sua" encerra o assunto, e pediu que você perguntasse das caixas.'),
      rep:{eixo:'bom',delta:2,motivo:'Aceitou ser corrigid{o|a}'}},
  escolhas:[
    {texto:'"O que tem nas cinco caixas?"', vai:'c14_as_cinco_caixas', cond:c14_nova('c14_as_cinco_caixas'), ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"A gente pode parar isso."', vai:'c14_pode_parar', cond:c14_nova('c14_pode_parar')},
    {texto:'"Me deixa entrar na casa."', vai:'c14_deixa_entrar', cond:c14_nova('c14_deixa_entrar')},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)}
  ]
},

c14_as_cinco_caixas:{
  falante:'Blaine',
  vozes:['P','N','N','P','N','P','N','N','N'],
  texto:[
    d=>d.flags.c14_pergunta_das_caixas || '"O que tem nas cinco caixas?"',
    'Ele demora tanto que a rua escurece.',
    '"Caderno."',
    'Ele se levanta com dificuldade, apoiando na coluna.',
    '"Nove caixas de arquivo, todas com caderno. O Ansel escrevia tudo à mão e numerava a lombada. Ele tinha quarenta e um cadernos de vinte e dois anos de trabalho nessa ilha."',
    d=>d.flags.c14_sabia_das_quatro ? '"E as quatro que saíram?"' : '"E onde estão as nove?"',
    d=>d.flags.c14_sabia_das_quatro
      ? '"Levaram os cadernos do projeto, do um ao nove, que é onde estão os resultados."'
      : '"Quatro saíram daqui em noventa e seis, num barco de fora, com os cadernos do projeto: do um ao nove, que é onde estão os resultados."',
    d=>d.flags.c14_sabia_das_quatro ? '"E as cinco?"' : '"E as outras cinco?"',
    'Ele pega as chaves do bolso.',
    '"As cinco tinham o resto."',
    'Ele começa a andar na direção do vulcão, e você vai atrás, e ele fala andando, sem olhar pra trás:',
    '"Dia a dia de laboratório, controle de estoque, protocolo de esterilização, coisa que ninguém quer."',
    '"E o caderno sete."'
  ],
  ef:{flag:['sabe_do_caderno_sete','blaine_vai_mostrar','blaine_tem_as_caixas','sabe_das_cinco','c14_a_caminho'],
      npc:c14_npc('Blaine', 7, 'Te levou até onde escondeu as cinco caixas.'),
      rep:{eixo:'bom',delta:4,motivo:'Perguntou o que tinha nas caixas'},
      registrar:'As cinco caixas escondidas por Blaine contêm o caderno 7 do Dr. Fuji.',
      presagio:d=>c14_viuOFormulario(d)
        ? 'O caderno sete. O que foi retirado para "análise jurídica" em Saffron e nunca devolvido.'
        : 'O caderno sete. Ele disse o número como quem diz o nome de alguém.'},
  escolhas:[
    {texto:'Ir com ele.', vai:'c14_ginasio_por_dentro'},
    {texto:'"Espera. O caderno sete não foi retirado pela Silph?"', vai:'c14_o_sete_falso', cond:c14_viuOFormulario},
    {texto:'"Por que você nunca leu pra ninguém?"', vai:'c14_nunca_leu', ef:{flag:'c14_a_caminho'}}
  ]
},

c14_o_sete_falso:{
  falante:'Blaine',
  vozes:['P','N','P','N','N','P','N','N','N'],
  texto:[
    '"Espera. O caderno sete não foi retirado pela Silph?"',
    'Você conta do formulário de Saffron: quatro de novembro de noventa e seis, análise jurídica, devolução prevista em trinta dias, nunca devolvido.',
    'Blaine para de andar no meio da rua.',
    'E ri.',
    'Ele ri alto, na rua principal de Cinnabar, às sete da noite, e duas pessoas na calçada olham.',
    '"Eles levaram o sete?"',
    '"Levaram um caderno com sete escrito na lombada."',
    'Ele continua andando, e agora está andando mais rápido.',
    '"{Meu filho|Minha filha}, o Ansel era o cara mais organizado que eu conheci na vida e o mais desconfiado depois de outubro de noventa e seis."',
    '"Ele trocou as lombadas."',
    '"Ele o quê?"',
    '"Ele passou uma tarde inteira trocando etiqueta de lombada em quarenta e um cadernos, em outubro, três semanas antes."',
    '"Eu vi ele fazendo. Eu perguntei se ele tava ficando maluco."',
    'Ele para na porta do ginásio e procura a chave certa no molho.',
    '"O que a Silph levou como sete é o inventário de material de limpeza de mil novecentos e oitenta e dois."'
  ],
  ef:{flag:['sabe_da_troca','caderno_sete_e_falso'],
      npc:c14_npc('Blaine', 8, 'Descobriu, rindo na rua, que o caderno 7 que a Silph guardou há quatro anos é falso.'),
      rep:{eixo:'bom',delta:6,motivo:'Ligou o formulário de Saffron ao homem que viu o Fuji trocar as lombadas'},
      moral:15,
      registrar:'O Dr. Fuji trocou as etiquetas de lombada dos 41 cadernos em outubro de 1996. O caderno 7 da Silph é falso.',
      presagio:'Uma tarde trocando etiqueta. Foi essa a defesa dele.'},
  escolhas:[
    {texto:'Entrar no ginásio com ele.', vai:'c14_ginasio_por_dentro'},
    {texto:'"Por que você nunca leu pra ninguém?"', vai:'c14_nunca_leu', ef:{flag:'c14_a_caminho'}}
  ]
},

c14_nunca_leu:{
  falante:'Blaine',
  vozes:['P','N','P','N','N','P','N','P','N','N'],
  texto:[
    '"Por que você nunca leu pra ninguém?"',
    d=>d.flags.c14_a_caminho ? '' : 'Ele não responde na varanda. Levanta, pega o molho de chaves no bolso e desce a rua na direção do vulcão, e você vai junto, até a porta de aço do ginásio.',
    'Ele para com a chave na fechadura.',
    '"Eu li."',
    '"Pra quem?"',
    '"Pra mim."',
    'Ele gira a chave e não abre.',
    '"Eu li os trinta e três que ficaram comigo, em ordem, em noventa e sete. Levou sete meses."',
    '"E depois?"',
    '"E depois eu botei tudo na sala dos fundos do ginásio e não entrei mais."',
    '"Por quê?"',
    'Ele empurra a porta.',
    '"Porque o que tem no sete não é prova de crime, {meu filho|minha filha}. É prova de amizade."',
    '"E eu não sei o que fazer com prova de amizade, e faz quatro anos que eu não sei, e você é a primeira pessoa que aparece nessa ilha perguntando dele em vez de perguntar do tanque."'
  ],
  ef:{flag:'blaine_leu_tudo',
      npc:c14_npc('Blaine', 9, 'Leu em ordem, em sete meses, os trinta e três cadernos que ficaram com ele, e nunca mostrou a ninguém.'),
      rep:{eixo:'bom',delta:4,motivo:'Perguntou por que ele nunca leu pra ninguém'},
      moral:-5,
      registrar:'Blaine leu em 1997 os 33 cadernos que ficaram com ele e nunca mostrou a ninguém.'},
  escolhas:[{texto:'Entrar.', vai:'c14_ginasio_por_dentro'}]
},

c14_pode_parar:{
  falante:'Blaine',
  vozes:['P','N','N','P','N','N','P','N','N','P','N','N','P','N'],
  texto:[
    '"A gente pode parar isso."',
    '"Como?"',
    d=>{ const l = c14_provas(d); return l.length ? `Você conta o que tem: ${c14_lista(l)}.` : 'Você conta o que viu no andar onze. É tudo o que você tem, e não está escrito em lugar nenhum.'; },
    'Ele ouve inteiro.',
    '"Isso é bom."',
    '"Mas?"',
    '"Mas isso tudo é sobre o que eles fizeram."',
    'Ele olha a porta fechada da casa do amigo.',
    '"E o que derruba o projeto não é o que eles fizeram. É o que eles não podem ter feito."',
    '"Não entendi."',
    '"O material de Cinnabar era de um instituto público. A propriedade nunca foi da Silph, {meu filho|minha filha}: a Silph tinha contrato de pesquisa."',
    '"E contrato de pesquisa com material de instituto público tem uma cláusula que eu li quarenta vezes em noventa e sete, porque eu sou chato e ilha não tem advogado."',
    '"Que cláusula?"',
    '"Devolução integral do acervo em caso de encerramento do vínculo."',
    'Ele bate no bolso, onde está a chave.',
    '"E o vínculo foi encerrado em novembro de noventa e seis, quando o instituto foi extinto por decreto."',
    '"E o acervo?"',
    '"O acervo tá na minha sala há quatro anos."'
  ],
  ef:{flag:['sabe_da_clausula','provas_cinnabar'],
      npc:c14_npc('Blaine', 8, 'Leu o contrato quarenta vezes em 1997 e sabe a cláusula de devolução integral do acervo.'),
      rep:{eixo:'bom',delta:6,motivo:'Achou a alavanca jurídica de tudo'},
      instabilidade:1,
      registrar:'O material de Cinnabar é de um instituto público extinto; a Silph deveria ter devolvido o acervo inteiro em 1996.',
      presagio:'Devolução integral. As quatro caixas que a Silph tem não são dela desde noventa e seis.'},
  escolhas:[
    {texto:'"Então me mostra o acervo."', vai:'c14_ginasio_por_dentro'},
    {texto:'"Por que você nunca leu pra ninguém?"', vai:'c14_nunca_leu', cond:c14_nova('c14_nunca_leu'), ef:{limpaFlag:'c14_a_caminho'}},
    {texto:'"O que tem nas cinco caixas?"', vai:'c14_as_cinco_caixas', cond:c14_nova('c14_as_cinco_caixas'), ef:C14_ANTES_DAS_CAIXAS},
    {texto:'"Vamos ligar pra Dra. Cordell agora."', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone}
  ]
},

/* ─────────────── DENTRO DA CASA ─────────────── */

c14_deixa_entrar:{
  falante:'Blaine',
  vozes:['P','N'],
  texto:[
    '"Me deixa entrar na casa."',
    'Ele olha pra você por muito tempo.',
    'Depois tira a chave do bolso, gira na fechadura, e não abre a porta.',
    '"Abre você."',
    'Ele senta na cadeira de balanço e fica olhando a rua.',
    'Você abre.',
    d=>d.flags.entrou_pela_janela
      ? 'Dentro está tudo como você viu quando entrou pela janela da cozinha, e entrar pela porta é diferente: é novembro de mil novecentos e noventa e seis, preservado por acidente e por teimosia.'
      : 'Dentro é novembro de mil novecentos e noventa e seis, preservado por acidente e por teimosia.',
    'Uma xícara de café na pia que virou um disco preto duro. Um jornal dobrado na mesa. Um par de óculos em cima do jornal, na página aberta, como quem ia voltar.',
    'Um casaco fino no encosto da cadeira.',
    d=>d.flags.tem_a_polaroid
      ? 'E na parede da sala, cinco fotos de gente, e o retângulo mais claro da sexta, que está na sua mochila.'
      : 'E na parede da sala, seis fotos: cinco de gente e uma que não é de gente.',
    d=>d.flags.tem_a_polaroid ? '' : 'A que não é de gente é uma foto Polaroid, tremida, mal enquadrada, de alguma coisa de pé dentro de um tanque, com as duas mãos encostadas no vidro por dentro.',
    d=>d.flags.tem_a_polaroid ? '' : 'E embaixo da Polaroid, colada na parede com fita, uma folha de caderno com quatro palavras:',
    d=>d.flags.tem_a_polaroid ? '' : '**"o que eu fiz"**'
  ],
  ef:{flag:['entrou_na_casa_do_fuji','viu_a_polaroid','c14_blaine_abriu'],
      rep:{eixo:'bom',delta:3,motivo:'Entrou numa casa que um velho não conseguia abrir'},
      moral:-15, instabilidade:1,
      npc:c14_npc('Blaine', 7, 'Destrancou a porta e deixou você abrir, e ficou na cadeira de balanço olhando a rua.'),
      registrar:'Na casa do Fuji há uma Polaroid do que estava no tanque, com a legenda "o que eu fiz".',
      presagio:d=>d.flags.tem_a_polaroid ? '' : 'As duas mãos encostadas no vidro por dentro. Ele fotografou isso e pendurou na sala de casa.'},
  escolhas:[
    {texto:'Chamar o Blaine pra entrar.', vai:'c14_blaine_entrou'},
    {texto:'Pegar a Polaroid.', vai:'c14_pegou_a_polaroid', cond:d=>!d.flags.tem_a_polaroid && !Historia.jaAconteceu('c14_pegou_a_polaroid')},
    {texto:'Ler o jornal aberto na mesa.', vai:'c14_o_jornal', cond:c14_nova('c14_o_jornal')},
    {texto:'Sair sem tocar em nada.', vai:'c14_saiu_da_casa'}
  ]
},

c14_o_jornal:{
  texto:[
    'O jornal está aberto na página seis, com os óculos em cima.',
    'É a página de classificados e obituário, e os óculos estão pousados exatamente em cima de uma coluna.',
    'A coluna é de classificados de emprego.',
    'E uma das linhas está circulada a caneta:',
    '**"PROFESSOR — Ensino fundamental, Ilha Cinnabar. Ciências. 20h semanais. Contato na Secretaria de Educação."**',
    'Você olha a data do jornal.',
    'Onze de novembro de mil novecentos e noventa e seis.',
    d=>d.flags.blaine_sem_enterro ? 'A véspera do dia doze.' : '',
    'O homem que morava aqui tinha circulado a caneta uma vaga de professor de ciências do fundamental de uma escola de ilha, vinte horas semanais.',
    'Ele ia dar aula.'
  ],
  ef:{flag:['viu_o_classificado'],
      rep:{eixo:'bom',delta:3,motivo:'Olhou o que os óculos estavam apontando'},
      moral:-15,
      registrar:'No jornal aberto na casa do Fuji, de 11/11/1996, está circulada uma vaga de professor de ciências.'},
  escolhas:[
    {texto:'Chamar o Blaine pra ver.', vai:'c14_blaine_entrou', cond:d=>!!d.flags.c14_blaine_abriu && !Historia.jaAconteceu('c14_blaine_entrou')},
    {texto:'Levar o jornal.', vai:'c14_levou_o_jornal'},
    {texto:'Pegar a Polaroid.', vai:'c14_pegou_a_polaroid', cond:d=>!d.flags.tem_a_polaroid && !Historia.jaAconteceu('c14_pegou_a_polaroid')},
    {texto:'Sair e deixar tudo como estava.', vai:'c14_saiu_da_casa'}
  ]
},

c14_blaine_entrou:{
  falante:'Blaine',
  vozes:['P','N','N','N','N'],
  texto:[
    '"Burke. Vem cá."',
    'Ele não vem.',
    'Você chama de novo e ele não vem, e aí você faz a única coisa que resta, que é ir até a cadeira de balanço, pegar ele pelo braço e puxar, e ele resiste dois passos e depois deixa.',
    'Ele entra na casa pela primeira vez em quatro anos.',
    'E fica parado na porta da sala uns quarenta segundos com a mão na parede.',
    d=>d.flags.viu_o_classificado ? 'Você mostra o jornal e os óculos em cima e a linha circulada a caneta.\nEle lê. Lê de novo.\n"Professor de ciências."\nEle senta no sofá, que levanta pó.\n"Ele ia dar aula pros meninos daqui."\nEle põe a mão na boca.\n"Ele ia ficar."' :
       'Ele olha a xícara na pia, o casaco no encosto, os óculos no jornal.\n"Eu achei que ia ser pior."\nPausa.\n"É pior."',
    'Vocês ficam ali um tempo comprido.',
    'Depois ele vai até a pia e lava a xícara.',
    'Leva quatro minutos porque o café virou pedra, e ele esfrega com a unha, e ele chora fazendo isso e não para de esfregar.',
    'Quando termina, ele põe a xícara virada no escorredor.',
    '"Pronto."'
  ],
  ef:{flag:['blaine_entrou_na_casa','blaine_lavou_a_xicara'],
      npc:c14_npc('Blaine', 10, 'Entrou na casa do amigo pela primeira vez em quatro anos e lavou a xícara.'),
      rep:{eixo:'bom',delta:6,motivo:'Puxou um velho pelo braço para dentro de uma casa'},
      moral:25,
      registrar:'Blaine entrou na casa do Fuji e lavou a xícara que estava na pia desde 1996.',
      presagio:'"Pronto." Foi esse o enterro dele.'},
  escolhas:[
    {texto:'Ficar e ajudar a arrumar a casa.', vai:'c14_arrumou_a_casa'},
    {texto:'"Agora me mostra as caixas."', vai:'c14_ginasio_por_dentro', cond:c14_sabeDasCaixas},
    {texto:'Deixar ele sozinho com a casa.', vai:'c14_cidade'}
  ]
},

c14_arrumou_a_casa:{
  falante:'Blaine',
  vozes:['N','N','N','N'],
  texto:[
    'Vocês passam a noite arrumando a casa.',
    'Não é uma cena bonita: é varrer, é tirar teia, é abrir janela, é encontrar comida de quatro anos numa despensa e jogar fora, é discutir sobre o que fazer com um par de sapatos.',
    'Às três da manhã, Blaine acha uma caixa de sapato em cima do armário do quarto com cento e poucas fotos soltas.',
    'Ele senta na cama e olha as cento e poucas, uma por uma, e comenta umas trinta em voz alta pra você, que não conhece ninguém em nenhuma delas.',
    '"Esse aqui é o Ansel no dia que o barco dele afundou na rampa."',
    '"Essa é a formatura dele. Olha esse bigode."',
    '"Essa aqui sou eu com cabelo."',
    'Às cinco da manhã ele guarda a caixa de volta em cima do armário, no mesmo lugar.',
    '"Amanhã eu doo a roupa."',
    'E você entende que "amanhã eu doo a roupa" é a coisa mais difícil que ele disse a noite inteira.'
  ],
  ef:{flag:['arrumou_a_casa','blaine_aliado'],
      executar:()=>{ c14_ate(5); return []; },
      npc:c14_npc('Blaine', 10, 'Passou uma noite com você arrumando a casa do amigo e decidiu doar a roupa.'),
      rep:{eixo:'bom',delta:5,motivo:'Passou a noite varrendo a casa de um morto com um velho'},
      moral:25, hp:-3, causa:'Uma noite inteira sem dormir',
      registrar:'Arrumou com Blaine a casa do Dr. Fuji.'},
  escolhas:[
    {texto:'"Agora me mostra as caixas."', vai:'c14_ginasio_por_dentro', cond:c14_sabeDasCaixas},
    {texto:'Ir com ele pro ginásio.', vai:'c14_ginasio_por_dentro', cond:d=>!c14_sabeDasCaixas(d)},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'}
  ]
},

c14_pegou_a_polaroid:{
  texto:[
    'Você tira a Polaroid da parede com cuidado, com a folha de caderno junto, porque as duas estão presas pela mesma fita.',
    'De perto, a foto é pior.',
    'Tem uma coisa em pé dentro de um tanque, e ela é alta, e ela tem as duas mãos abertas encostadas no vidro por dentro, na altura do rosto, como quem olha uma vitrine.',
    'E no vidro, desfocado, refletido, dá pra ver quem tirou a foto, porque estava de frente e o flash devolveu.',
    'Um homem de pé, com a câmera na altura do peito, olhando pra cima.',
    'Os dois estão se olhando.',
    'Na hora em que a foto foi tirada, os dois estavam se olhando, e ele apertou o botão assim mesmo.'
  ],
  ef:{flag:['tem_a_polaroid','provas_cinnabar'],
      itens:{'Polaroid do tanque':1},
      rep:{eixo:'bom',delta:3,motivo:'Guardou a única foto que existe'},
      moral:-10,
      registrar:'Ficou com a Polaroid do tanque, com a legenda "o que eu fiz".',
      presagio:'Os dois estavam se olhando. Ele apertou o botão assim mesmo.'},
  escolhas:[
    {texto:'Chamar o Blaine pra entrar.', vai:'c14_blaine_entrou', cond:d=>!!d.flags.c14_blaine_abriu && !Historia.jaAconteceu('c14_blaine_entrou')},
    {texto:'Ler o jornal na mesa.', vai:'c14_o_jornal', cond:c14_nova('c14_o_jornal')},
    {texto:'Devolver pra parede e sair.', vai:'c14_saiu_da_casa',
     ef:{perdeItens:{'Polaroid do tanque':1}, limpaFlag:'tem_a_polaroid', flag:'devolveu_a_polaroid'}},
    {texto:'Sair com ela.', vai:'c14_saiu_da_casa'}
  ]
},

c14_levou_o_jornal:{
  texto:[
    'Você dobra o jornal na página seis e guarda na mochila, com os óculos dentro, porque separar os dois parece errado.',
    'Você guarda pra mostrar num momento melhor, e já sabe, enquanto guarda, que pra isso não existe momento melhor.'
  ],
  ef:{flag:['tem_o_jornal','provas_cinnabar'],
      itens:{'Jornal de 11/11/96 e um par de óculos':1},
      moral:-5,
      registrar:'Levou o jornal de 11/11/96 com a vaga de professor circulada.'},
  escolhas:[
    {texto:'Chamar o Blaine e mostrar agora mesmo.', vai:'c14_blaine_entrou', cond:d=>!!d.flags.c14_blaine_abriu && !Historia.jaAconteceu('c14_blaine_entrou')},
    {texto:'Pegar a Polaroid.', vai:'c14_pegou_a_polaroid', cond:d=>!d.flags.tem_a_polaroid && !Historia.jaAconteceu('c14_pegou_a_polaroid')},
    {texto:'Sair.', vai:'c14_saiu_da_casa'}
  ]
},

c14_saiu_da_casa:{
  falante:'Blaine',
  vozes:['N','P','N','N'],
  texto:[
    d=>d.flags.devolveu_a_polaroid ? 'Você prende a Polaroid de volta na parede, com a mesma fita, e sai.'
      : d.flags.entrou_pela_janela && !d.flags.c14_blaine_abriu ? 'Você sai pela janela da cozinha, do jeito que entrou, e encosta ela de novo.'
      : 'Você sai e fecha a porta atrás de você.',
    d=>d.flags.c14_blaine_abriu ? 'Blaine está na cadeira de balanço.' : 'A rua está vazia. A cadeira de balanço da varanda também.',
    d=>d.flags.c14_blaine_abriu ? '"E aí?"' : '',
    d=>d.flags.c14_blaine_abriu ? '"Tá do jeito que ele deixou."' : '',
    d=>d.flags.c14_blaine_abriu ? 'Ele assente.' : '',
    d=>d.flags.c14_blaine_abriu ? '"Eu sei."' : '',
    d=>d.flags.c14_blaine_abriu ? 'Ele continua balançando.' : '',
    d=>d.flags.c14_blaine_abriu ? '"É por isso que eu não entro."' : ''
  ],
  ef:{flag:'nao_mexeu_na_casa',
      rep:{eixo:'bom',delta:1,motivo:'Não mexeu no que não era seu'},
      presagio:d=>d.flags.c14_blaine_abriu ? 'Ele sabia o que tinha lá dentro sem entrar. Quatro anos sabendo.' : ''},
  escolhas:[
    {texto:'Chamar o Blaine pra entrar.', vai:'c14_blaine_entrou', cond:d=>!!d.flags.c14_blaine_abriu && !Historia.jaAconteceu('c14_blaine_entrou')},
    {texto:'"Me mostra as caixas."', vai:'c14_ginasio_por_dentro', cond:d=>!!d.flags.c14_blaine_abriu && c14_sabeDasCaixas(d)},
    {texto:d=>d.flags.conheceu_blaine ? 'Esperar o Blaine chegar.' : 'Esperar quem cuida da casa.', vai:'c14_blaine_na_varanda', cond:d=>!d.flags.c14_blaine_abriu},
    {texto:'Ir ao laboratório.', vai:'c14_lab'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'}
  ]
},

c14_dentro_da_casa:{
  texto:[
    'Você entra pela janela da cozinha, que está encostada, e cai em cima da pia.',
    'E a primeira coisa que a sua mão encosta no escuro é uma xícara.',
    'Você acha o interruptor do lado da porta da cozinha. A luz acende: alguém continua pagando a conta.',
    'A xícara tem uma coisa preta e dura no fundo, e o resto da casa está exatamente como alguém deixou quando saiu achando que ia voltar: um casaco no encosto da cadeira, um jornal aberto na mesa com um par de óculos em cima, e seis fotos na parede da sala.',
    'Cinco são de gente.',
    'A sexta é uma Polaroid tremida de alguma coisa de pé dentro de um tanque, com as duas mãos encostadas no vidro por dentro.',
    'E embaixo dela, colada com fita, uma folha de caderno com quatro palavras:',
    '**"o que eu fiz"**',
    'Você está sozinh{o|a} na casa de um homem que sumiu há quatro anos, e não tem ninguém pra dividir isso.'
  ],
  ef:{flag:['entrou_na_casa_do_fuji','viu_a_polaroid','entrou_pela_janela'],
      rep:{eixo:'bom',delta:1,motivo:'Entrou pela janela'},
      moral:-15, instabilidade:1,
      registrar:'Entrou sozinh{o|a} na casa do Fuji e achou a Polaroid do tanque.'},
  escolhas:[
    {texto:'Ler o jornal aberto na mesa.', vai:'c14_o_jornal', cond:c14_nova('c14_o_jornal')},
    {texto:'Pegar a Polaroid.', vai:'c14_pegou_a_polaroid', cond:c14_nova('c14_pegou_a_polaroid')},
    {texto:d=>d.flags.conheceu_blaine ? 'Sair e esperar o Blaine na varanda.' : 'Sair e esperar quem cuida da casa.', vai:'c14_blaine_na_varanda'},
    {texto:'Sair sem tocar em nada.', vai:'c14_saiu_da_casa'}
  ]
},

/* ─────────────── O GINÁSIO E O ACERVO ─────────────── */

c14_ginasio:{
  vozes:['E'],
  texto:[
    'O ginásio de Cinnabar não é um prédio. É uma porta.',
    'Uma porta de aço encaixada na rocha, na base do vulcão, no fim de uma escada de cimento de sessenta e dois degraus que alguém construiu nos anos setenta e que ninguém consertou desde então.',
    'Na porta, uma placa de metal gravada: **GINÁSIO CINNABAR — BLAINE — FOGO**.',
    'E, colada abaixo, uma folha de papel plastificada com fita, escrita à mão:',
    '"Desafios: quinta-feira, das 14h às 18h. Quem chegar fora do horário espera até quinta. Quem não quiser esperar, tem sete outros ginásios em Kanto."',
    d=>c14_hojeNoGinasio(d),
    'A porta está destrancada.',
    'Você empurra e dentro tem um corredor de rocha escavada, quente, com luz de lâmpada amarela, e lá no fundo um ventilador ligado.'
  ],
  ef:{flag:'achou_ginasio_cinnabar',
      executar:d=>{ Mundo.descobrir('ginasio_cinnabar'); return []; },
      registrar:'O ginásio de Cinnabar fica dentro do vulcão. Desafios só às quintas.',
      presagio:'A porta de um ginásio de líder, destrancada, com a luz acesa lá no fundo.'},
  escolhas:[
    {texto:'Entrar.', vai:'c14_ginasio_por_dentro'},
    {texto:c14_textoDoDesafio, vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)},
    {texto:'Ir ao laboratório primeiro.', vai:'c14_lab'}
  ]
},

/* o ginásio, da segunda vez */
c14_ginasio_de_novo:{
  repetivel:true,
  texto:[
    'Os sessenta e dois degraus de cimento, a porta de aço encaixada na rocha, a folha plastificada com o horário de quinta.',
    d=>c14_hojeNoGinasio(d)
  ],
  ef:{flag:'achou_ginasio_cinnabar',
      executar:d=>{ Mundo.descobrir('ginasio_cinnabar'); return []; }},
  escolhas:[
    {texto:'Entrar.', vai:'c14_ginasio_por_dentro'},
    {texto:c14_textoDoDesafio, vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)},
    {texto:'Ir ao laboratório.', vai:'c14_lab'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Voltar pra rua principal.', vai:'c14_cidade'}
  ]
},

c14_ginasio_por_dentro:{
  falante:'Blaine',
  vozes:['N','P','N'],
  texto:[
    'O corredor de rocha desce quarenta metros e desemboca numa câmara natural que alguém transformou em arena: piso de concreto queimado, marcação branca refeita muitas vezes, e uma abertura no teto por onde entra luz e sai calor.',
    'Faz trinta e oito graus.',
    'E nos fundos da arena, atrás de uma porta comum de escritório, tem uma sala.',
    'A sala tem quatro por quatro metros, um ventilador de teto, uma mesa, uma cadeira, e cinco caixas de arquivo de papelão empilhadas em duas pilhas.',
    'Nas caixas, etiqueta datilografada:',
    '**INSTITUTO DE PESQUISA CINNABAR — CAIXAS 5 A 9 DE 9**',
    'E em cima da mesa, sozinho, aberto, com um marcador de página feito de tira de jornal: um caderno de capa dura.',
    d=>d.flags.conheceu_blaine ? 'Blaine acende a luz e não entra na sala. Fica na porta.\n"Eu li em noventa e sete e deixei aberto nessa página."\n"Faz três anos que tá aberto nessa página?"\n"Faz."' :
       'Não tem ninguém aqui. Alguém deixou a luz acesa e a porta destrancada e foi embora, e o caderno está aberto numa página específica, e a página tem um marcador feito à mão.'
  ],
  ef:{flag:['achou_o_acervo','achou_as_cinco_caixas','achou_ginasio_cinnabar'],
      executar:d=>{ Mundo.descobrir('ginasio_cinnabar'); return []; },
      instabilidade:1,
      registrar:'As caixas 5 a 9 do Instituto de Cinnabar estão na sala dos fundos do ginásio.',
      presagio:d=>d.flags.conheceu_blaine ? 'Aberto na mesma página há três anos.' : 'Aberto numa página só, com um marcador feito à mão.'},
  escolhas:[
    {texto:'Ler a página aberta.', vai:'c14_caderno'},
    {texto:'Perguntar por que essa página.', vai:'c14_essa_pagina', cond:d=>!!d.flags.conheceu_blaine},
    {texto:'Não ler. Sair da sala.', vai:'c14_nao_leu'}
  ]
},

/* a sala dos fundos, de novo: o que ficou na mesa depende do que você fez */
c14_acervo_de_novo:{
  repetivel:true,
  texto:[
    'A sala dos fundos continua do jeito que estava: o ventilador de teto, a mesa, a cadeira, as cinco caixas empilhadas em duas pilhas.',
    d=>d.flags.queimou_caderno ? 'Em cima da mesa não tem mais nada, e no chão tem a mancha preta de onde você queimou o caderno.'
      : d.flags.pegou_caderno ? 'Em cima da mesa ficou o marcador de tira de jornal, sem o caderno.'
      : 'O caderno de capa dura continua aberto em cima da mesa, na mesma página.',
    d=>!d.flags.conheceu_blaine || d.flags.queimou_caderno ? ''
      : d.flags.blaine_leu_em_voz_alta ? 'Blaine está sentado na cadeira, dentro da sala, que agora ele usa.'
      : 'Blaine para na porta da sala, sem entrar.'
  ],
  escolhas:[
    {texto:'Ler o caderno.', vai:'c14_caderno', cond:d=>c14_cadernoNaMesa(d) && !d.flags.leu_caderno},
    {texto:'Ler o resto do caderno.', vai:'c14_caderno2', cond:d=>c14_cadernoNaMesa(d) && !!d.flags.leu_caderno && !d.flags.leu_o_fim_do_sete},
    {texto:'Perguntar por que essa página.', vai:'c14_essa_pagina', cond:d=>!!d.flags.conheceu_blaine && c14_cadernoNaMesa(d) && !Historia.jaAconteceu('c14_essa_pagina')},
    {texto:'Pedir pro Blaine ler em voz alta.', vai:'c14_blaine_leu_em_voz_alta', cond:d=>!!d.flags.conheceu_blaine && c14_cadernoNaMesa(d) && !Historia.jaAconteceu('c14_blaine_leu_em_voz_alta')},
    {texto:'Levar o caderno.', vai:'c14_pegou_caderno', cond:d=>c14_cadernoNaMesa(d) && !!d.flags.leu_caderno},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!!d.flags.conheceu_blaine && !c14_temInsignia(d)},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório.', vai:'c14_lab'},
    {texto:'Voltar pra rua principal.', vai:'c14_cidade'}
  ]
},

c14_essa_pagina:{
  falante:'Blaine',
  vozes:['P','N','P','N','N','N'],
  texto:[
    '"Por que essa página?"',
    'Blaine continua na porta.',
    '"Porque é a última em que ele fala comigo."',
    '"Como assim com você?"',
    '"O Ansel escrevia os cadernos pra ele mesmo, sempre. Relatório, observação, hipótese, tudo na terceira pessoa, do jeito certo."',
    'Ele aponta a página com o queixo.',
    '"Menos essa."',
    '"Essa aí ele escreveu pra mim, e eu sei porque tem o meu nome, e porque ele nunca escreveu o meu nome em nenhum dos quarenta e um cadernos em vinte e dois anos."'
  ],
  ef:{flag:'blaine_explicou_a_pagina',
      npc:c14_npc('Blaine', 8, 'Explicou que a página aberta é a única em que o Fuji escreveu o nome dele.'),
      rep:{eixo:'bom',delta:2,motivo:'Perguntou por que aquela página'},
      presagio:'Uma página com o nome dele em vinte e dois anos de caderno.'},
  escolhas:[
    {texto:'Ler.', vai:'c14_caderno'},
    {texto:'"Lê você."', vai:'c14_blaine_leu_em_voz_alta'},
    {texto:'Não ler.', vai:'c14_nao_leu'}
  ]
},

c14_caderno:{
  texto:[
    'O caderno tem sete na lombada, em etiqueta colada, e a etiqueta tem uma marca de cola antiga por baixo, de onde saiu outra.',
    d=>d.flags.sabe_da_troca ? 'É o caderno 7 de verdade.' : 'É o caderno 7.',
    'Dias duzentos e quarenta e dois em diante.',
    '**"Dia 242. Me tiraram do projeto ontem às 15h20. Entreguei crachá, chave e as chaves do carro do instituto. Não entreguei os cadernos porque ninguém pediu os cadernos."**',
    '**"Dia 243. Fui ao prédio à noite. O vigia é o Sr. Berto e ele me deixou entrar porque eu trabalho aqui há vinte e dois anos e ninguém avisou o Sr. Berto de nada."**',
    '**"Dia 243 (cont.). Falei com ele por quatro horas. Contei que eu tinha sido afastado. Contei que eu não ia mais poder vir. Ele perguntou por quê e eu disse a verdade, que é que eu disse não."**',
    '**"Ele perguntou não pra quê."**',
    '**"Eu disse: não pra continuar."**',
    '**"E ele perguntou: continuar o quê?"**',
    '**"E eu percebi, no dia duzentos e quarenta e três, que em duzentos e quarenta e três dias eu nunca tinha explicado pra ele o que era o projeto."**',
    '**"Ele não sabia que era um experimento. Ele achava que eram conversas."**'
  ],
  ef:{flag:['leu_caderno','leu_o_sete'], instabilidade:2, moral:-20,
      rep:{eixo:'bom',delta:3,motivo:'Leu o caderno sete'},
      registrar:'Caderno 7: em 243 dias, o Dr. Fuji nunca explicou a quem estava no tanque que aquilo era um experimento.'},
  escolhas:[
    {texto:'Continuar lendo.', vai:'c14_caderno2'},
    {texto:'"Lê você." — pedir pro Blaine ler.', vai:'c14_blaine_leu_em_voz_alta', cond:d=>!!d.flags.conheceu_blaine},
    {texto:'Parar de ler.', vai:'c14_nao_leu'}
  ]
},

c14_caderno2:{
  texto:[
    '**"Dia 244. Ele passou a noite inteira sem responder. O Sr. Berto me deixou ficar."**',
    '**"Dia 245. Pediu pra sair. Segunda vez. Usou a palavra por favor as duas vezes."**',
    '**"Dia 245 (cont.). Eu disse que não tenho autoridade. Ele perguntou quem tem. Eu disse um conselho em Saffron. Ele perguntou se o conselho já conversou com ele alguma vez."**',
    '**"Eu disse que não."**',
    '**"Ele perguntou como um conselho decide sobre alguém com quem nunca conversou."**',
    '**"Eu não soube responder e não vou saber nunca."**',
    '**"Dia 246. Escrevi ao conselho pedindo audiência. Protocolo 11.409."**',
    '**"Dia 250. Indeferido. Motivo: requerente sem vínculo institucional."**',
    'E aí a letra muda: fica maior, mais espaçada, de quem escreveu com a mão inteira em vez de com os dedos.',
    '**"Dia 251. Burke: se você estiver lendo isso, foi porque aconteceu alguma coisa, e eu quero que você saiba que eu não fui lá me matar."**',
    '**"Eu fui lá abrir o tanque."**',
    '**"Eu fui explicar pra ele o que ele é, que é a única coisa que ele pediu em duzentos e cinquenta e um dias e a única que eu devo."**',
    '**"E depois eu ia abrir."**',
    '**"Se der errado, não é culpa sua e não é culpa de ninguém dessa ilha, e por favor cuida da casa até a prefeitura tomar, que eu não quero que tomem no primeiro ano."**',
    '**"Ansel."**',
    'A página seguinte está em branco.',
    'E todas as outras, até o fim.'
  ],
  ef:{flag:['leu_o_fim_do_sete','sabe_que_ele_abriu'],
      instabilidade:2, moral:-25,
      rep:{eixo:'bom',delta:4,motivo:'Leu até o fim'},
      registrar:'O Dr. Fuji foi ao laboratório para explicar a quem estava no tanque o que ele era, e depois abrir o tanque.',
      presagio:d=>(d.flags.blaine_paga_o_iptu || d.flags.blaine_falou_da_casa)
        ? '"Cuida da casa até a prefeitura tomar, que eu não quero que tomem no primeiro ano." Quatro anos.'
        : '"Cuida da casa até a prefeitura tomar." Ele pediu isso pra alguém chamado Burke.'},
  escolhas:[
    {texto:'Pedir pro Blaine ler em voz alta.', vai:'c14_blaine_leu_em_voz_alta', cond:d=>!!d.flags.conheceu_blaine && !Historia.jaAconteceu('c14_blaine_leu_em_voz_alta')},
    {texto:'Levar o caderno.', vai:'c14_pegou_caderno'},
    {texto:'Deixar o caderno onde estava.', vai:'c14_deixou_o_caderno'},
    {texto:'Queimar. Ninguém mais precisa ler isso.', vai:'c14_queimou'}
  ]
},

c14_deixou_o_caderno:{
  texto:[
    'Você fecha o caderno no marcador de tira de jornal e abre de novo na mesma página, do jeito que estava.',
    d=>d.flags.conheceu_blaine
      ? 'Blaine, da porta, vê você deixar o caderno aberto onde ele deixou, e não diz nada.'
      : 'Ninguém viu você ler. A página continua aberta pra quem ela foi escrita.',
    'Você sai da sala e apaga a luz.'
  ],
  ef:{flag:'deixou_o_caderno',
      rep:{eixo:'bom',delta:2,motivo:'Deixou a carta onde ela estava'},
      registrar:'Leu o caderno 7 e deixou ele aberto na mesma página.'},
  escolhas:[
    {texto:'Pedir pro Blaine ler em voz alta.', vai:'c14_blaine_leu_em_voz_alta', cond:d=>!!d.flags.conheceu_blaine && !Historia.jaAconteceu('c14_blaine_leu_em_voz_alta')},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!!d.flags.conheceu_blaine && !c14_temInsignia(d)},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Voltar pra rua principal.', vai:'c14_cidade'}
  ]
},

c14_blaine_leu_em_voz_alta:{
  falante:'Blaine',
  vozes:['N','N'],
  texto:[
    'Você pede pra ele ler em voz alta.',
    'Ele diz que não, e você não insiste, e ele fica na porta mais um tempo, e depois entra na sala pela primeira vez em três anos e senta na cadeira.',
    'E lê.',
    'Ele lê as quatro páginas em voz alta, inteiras, pra {um moleque|uma menina} de {idade} anos numa sala de quatro por quatro dentro de um vulcão, e ele tropeça em três lugares.',
    'Na parte do "ele achava que eram conversas", ele para por quase um minuto.',
    'E na parte do "cuida da casa até a prefeitura tomar", ele lê muito rápido, quase atropelando, porque é a única forma de terminar a frase.',
    'Quando acaba, ele fecha o caderno e põe as duas mãos em cima.',
    '"Quatro anos eu achei que ele tinha ido lá se entregar."',
    'Ele bate na capa com a palma.',
    '"Ele foi lá pedir desculpa."'
  ],
  ef:{flag:['blaine_leu_em_voz_alta','blaine_aliado'],
      npc:c14_npc('Blaine', 10, 'Leu em voz alta as quatro páginas finais do caderno 7, para você, dentro do vulcão.'),
      rep:{eixo:'bom',delta:6,motivo:'Fez um velho ler em voz alta o que ele guardou por quatro anos'},
      moral:20,
      registrar:'Blaine leu o caderno 7 em voz alta e entendeu que o amigo foi pedir desculpa.',
      presagio:'"Ele foi lá pedir desculpa." Quatro anos pra ler quatro páginas em voz alta.'},
  escolhas:[
    {texto:'"Então a gente publica isso."', vai:'c14_publicar', cond:d=>c14_podePublicar(d)},
    {texto:'"Então a gente devolve o acervo."', vai:'c14_devolver_acervo', cond:d=>!!d.flags.sabe_da_clausula},
    {texto:'"Me dá o caderno. Eu levo."', vai:'c14_pegou_caderno', cond:c14_cadernoNaMesa},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)},
    {texto:'Sair e deixar ele com o caderno.', vai:'c14_cidade'}
  ]
},

c14_publicar:{
  falante:'Blaine',
  vozes:['P','N','P','N','N','N','P','N','N','P','N','N'],
  texto:[
    '"Então a gente publica isso."',
    'Ele balança a cabeça.',
    '"Publicar o quê? Um caderno de um homem que ninguém conhece sobre uma coisa que oficialmente nunca existiu?"',
    d=>d.flags.viu_os_doze ? '"Uma coisa que tem onze cópias num subsolo em Saffron."'
      : d.flags.sabe_do_andar_11 ? '"Uma coisa que a Silph continua fazendo, num andar que não aparece no elevador."'
      : '"Uma coisa que alguém veio de barco queimar."',
    'Ele para.',
    '"Isso muda."',
    'Ele passa a mão no rosto.',
    d=>(d.flags.viu_os_doze || d.flags.sabe_do_andar_11)
      ? '"Isso muda tudo, porque aí o caderno não é memória, é antecedente. Aí ele deixa de ser “um cientista escreveu isso” e vira “isso já aconteceu antes e está documentado”."'
      : '"Isso muda tudo, porque aí o caderno não é memória, é motivo. Aí ele deixa de ser “um cientista escreveu isso” e vira “alguém achou que valia a pena queimar isso”."',
    d=>d.flags.cartao_ivone ? '"E você conhece alguém que publica?"\n"Conheço."\n"Então liga."' :
       '"E você conhece alguém que publica?"\n"Não."\n"Aí é mais difícil. Mas eu conheço um professor aposentado em Cerulean que escreve numa revista chata que ninguém lê e que é citada em processo."',
    'Ele olha as cinco caixas.',
    '"E a gente não publica o sete."',
    '"Por quê?"',
    '"Porque o sete é carta. Carta não se publica."',
    'Ele bate na pilha.',
    '"A gente publica o resto, que é o método. E aí o sete fica sendo o que ele é."'
  ],
  ef:{flag:['vai_publicar','blaine_aliado'],
      npc:c14_npc('Blaine', 10, 'Decidiu publicar o que está nas cinco caixas e guardar o caderno 7, porque carta não se publica.'),
      rep:{eixo:'bom',delta:6,motivo:'Separou o que é prova do que é carta'},
      moral:15,
      registrar:'Blaine vai publicar os cadernos das cinco caixas e guardar o 7.'},
  escolhas:[
    {texto:'Chamar a Dra. Cordell.', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'"Então a gente devolve o acervo."', vai:'c14_devolver_acervo', cond:d=>!!d.flags.sabe_da_clausula && !Historia.jaAconteceu('c14_devolver_acervo')},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)}
  ]
},

c14_devolver_acervo:{
  falante:'Blaine',
  vozes:['P','N','P','N','P','N'],
  texto:[
    '"Então a gente devolve o acervo."',
    '"Devolve pra quem? O instituto foi extinto por decreto."',
    '"Extinto por decreto quer dizer que o patrimônio foi pra algum lugar. Sempre vai."',
    'Blaine olha pra você com uma cara nova.',
    '"Você tem {idade} anos."',
    '"Eu passei esse tempo todo lendo papel que ninguém lê."',
    'Ele ri.',
    'E aí ele vai até a estante, tira uma pasta de plástico com o Diário Oficial de novembro de noventa e seis dentro — porque ele guardou, porque ele é chato, porque ilha não tem advogado —, e procura, e acha.',
    '**"Art. 4º. O acervo técnico e científico do Instituto ora extinto fica incorporado ao patrimônio da Comissão de Bem-Estar Pokémon, com obrigação de guarda e acesso público."**',
    'Guarda e acesso público.',
    'As quatro caixas que a Silph tem são patrimônio público desde noventa e seis.',
    'E as cinco que estão nessa sala também.',
    'Blaine fecha a pasta devagar.',
    '"Eu também tô com coisa que não é minha."'
  ],
  ef:{flag:['sabe_do_artigo_quarto','provas_cinnabar'],
      itens:{'Diário Oficial de 11/1996':1},
      npc:c14_npc('Blaine', 9, 'Achou o artigo que incorporou o acervo à Comissão e admitiu que também está com coisa que não é dele.'),
      rep:{eixo:'bom',delta:6,motivo:'Achou para onde o patrimônio foi'},
      instabilidade:1,
      registrar:'O acervo do Instituto de Cinnabar pertence à Comissão de Bem-Estar Pokémon desde 1996, com acesso público.'},
  escolhas:[
    {texto:'"Então a gente entrega à Comissão. À Auditora Brill."', vai:'c14_entregar_prado', cond:d=>!!d.flags.conheceu_prado},
    {texto:'"Então a gente entrega à Comissão."', vai:'c14_entregar_comissao'},
    {texto:'"Então a gente publica isso."', vai:'c14_publicar', cond:d=>c14_podePublicar(d) && !Historia.jaAconteceu('c14_publicar')},
    {texto:'Chamar a Dra. Cordell.', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c14_entregar_prado:{
  texto:[
    d=>{
      const l = ['a prancheta'];
      if (d.flags.assistiu_o_pregao) l.push('o pregão na sala do cassino');
      if (d.flags.prado_te_ouviu) l.push('o corredor de azulejo', 'as vinte e seis sessões por ano');
      if (d.flags.papel_da_prado) l.push('a via amarela carbonada');
      return `Você conta pro Blaine da Auditora Brill: ${c14_lista(l)}.`;
    },
    'Ele ouve e faz uma pergunta só:',
    fala('Blaine', 'Ela te deu algum papel?'),
    d=>fala(d.jogador.nome, d.flags.papel_da_prado ? 'Deu.' : 'Não. Ela me ouviu.'),
    d=>fala('Blaine', d.flags.papel_da_prado ? 'Então serve.' : 'Quem ouve uma vez lê depois. Serve.'),
    'Ele começa a empilhar as caixas.',
    fala('Blaine', 'Auditoria interna tem competência de requisição. Se ela requisitar as quatro caixas da Silph como patrimônio incorporado, a Silph tem trinta dias pra devolver ou justificar, e justificar é pior pra eles do que devolver.'),
    d=>fala(d.jogador.nome, 'E as cinco daqui?'),
    'Ele para de empilhar.',
    fala('Blaine', 'As cinco daqui eu entrego na mão dela.'),
    d=>fala(d.jogador.nome, 'Você pode ser processado.'),
    ()=>fala('Blaine', `Eu tenho setenta e dois anos, {meu filho|minha filha}, e retenção de acervo público prescreve em cinco anos, e ${c14_prescricao()}.`),
    'Ele volta a empilhar.',
    fala('Blaine', 'Eu prefiro entregar antes de prescrever. Prescrever é a Justiça dizendo que não importa mais. E importa.')
  ],
  ef:{flag:['vai_entregar_a_prado','blaine_aliado'],
      npc:c14_npc('Blaine', 10, 'Vai entregar as cinco caixas à Auditora Brill antes de a retenção prescrever.'),
      rep:{eixo:'bom',delta:7,motivo:'Ligou o acervo de Cinnabar à auditoria que preside os pregões de Celadon'},
      moral:20, instabilidade:-1,
      registrar:'Blaine vai entregar as cinco caixas à Auditora Brill, e a Comissão pode requisitar as quatro da Silph.',
      presagio:'"Prescrever é a Justiça dizendo que não importa mais. E importa."'},
  escolhas:[
    {texto:'Subir o vulcão antes de ir.', vai:'c14_vulcao'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Chamar a Dra. Cordell também.', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c14_entregar_comissao:{
  falante:'Blaine',
  vozes:['P','N','P','N','P','N','N'],
  texto:[
    '"Então a gente entrega à Comissão."',
    'Ele faz uma cara.',
    '"À Comissão que aprovou tudo isso em noventa e seis?"',
    '"À Comissão que tem obrigação de guarda e acesso público escrita num decreto."',
    'Ele pensa.',
    '"Guarda e acesso público."',
    '"Acesso público, Burke. Se o acervo for incorporado formalmente, qualquer pessoa pode pedir vista. Qualquer pessoa. Inclusive jornalista, inclusive advogado de quem for processar, inclusive {um moleque|uma menina} com caderno."',
    'Ele olha as cinco caixas por muito tempo.',
    '"Eu sempre achei que entregar era perder."',
    'Ele começa a empilhar.',
    '"Entregar é publicar por outro caminho."'
  ],
  ef:{flag:['vai_entregar_comissao','blaine_aliado'],
      npc:c14_npc('Blaine', 9, 'Entendeu que entregar o acervo à Comissão é publicá-lo por outro caminho.'),
      rep:{eixo:'bom',delta:6,motivo:'Transformou uma entrega em publicação'},
      moral:15,
      registrar:'Blaine vai incorporar formalmente as cinco caixas ao acervo público, com direito de vista.'},
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)},
    {texto:'Chamar a Dra. Cordell.', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'}
  ]
},

c14_chamou_ivone_cinnabar:{
  falante:'Dra. Cordell',
  vozes:['N','Blaine','N','Blaine','N','N','N','Blaine','N'],
  texto:[
    d=>`A Dra. Cordell chega no ferry de ${d.flags.c14_ferry_da_cordell || 'sábado'}, porque não tem outro jeito de chegar em Cinnabar.`,
    'Ela passa dois dias na sala do ginásio lendo, com Blaine trazendo café e sem falar nada, e os dois velhos se dando bem de um jeito imediato e chato de assistir.',
    'No fim do segundo dia ela fecha a caixa nove e fala:',
    '"Eu não vou publicar isso."',
    'Blaine levanta a cabeça.',
    '"Como é?"',
    '"Eu vou publicar o decreto, o artigo quarto, e a prova de que a Silph está com patrimônio público desde noventa e seis."',
    '"Isso é seco."',
    '"Isso é uma página e meia e não tem nenhuma emoção e vai obrigar um órgão público a responder em trinta dias."',
    'Ela tira os óculos.',
    '"E aí, quando eles responderem, o acervo vira público, e aí eu publico os cadernos como documento público e não como vazamento."',
    'Ela olha os dois.',
    '"E aí ninguém pode dizer que eu roubei, ninguém pode dizer que o Burke reteve, e ninguém pode dizer que o Ansel era um maluco que escrevia caderno."',
    'Blaine olha pra ela por um tempo.',
    '"A senhora é bem pior que eu."',
    '"Eu sou muito pior que o senhor."'
  ],
  ef:{flag:['ivone_tem_cinnabar','plano_de_publicacao'],
      executar:()=>{
        const f = c14_irAoFerry(10);
        Estado.marcar('c14_ferry_da_cordell', f.nome);
        Relogio.amanhaAs(18);
        return [];
      },
      npc:c14_npc('Dra. Cordell', 10, 'Passou dois dias em Cinnabar e montou o caminho para publicar os cadernos como documento público.'),
      rep:{eixo:'bom',delta:7,motivo:'Juntou o arquivo, o decreto e quem sabe publicar'},
      moral:20, instabilidade:-1,
      registrar:'A Dra. Cordell vai publicar primeiro o decreto, para tornar o acervo público antes de publicar os cadernos.',
      presagio:'Documento público, e não vazamento.'},
  escolhas:[
    {texto:'Ficar mais um pouco com os dois.', vai:'c14_ficou_os_dois_dias'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'}
  ]
},

c14_ficou_os_dois_dias:{
  texto:[
    'Você fica mais um pouco com os dois, e a sala de quatro por quatro tem cheiro de dois dias de café.',
    'Foram dois dias sem fazer quase nada: buscar café, carregar caixa, segurar a lanterna quando faltou luz na ilha, na primeira noite, às sete e dez.',
    'E ouvir dois velhos discutirem por dezoito horas sobre ordem de publicação, prazo de resposta, competência de órgão e a diferença entre documento público e vazamento.',
    'Foi a coisa mais chata que você já assistiu na vida.',
    'E numa das madrugadas você entendeu que é isso.',
    'Que é essa a coisa.',
    'Que tudo o que você viu desde que saiu de casa não vai ser desfeito por ninguém entrando em lugar nenhum de madrugada.',
    'Vai ser desfeito por dois velhos brigando sobre ordem de publicação numa sala de quatro por quatro dentro de um vulcão, com café ruim.',
    'E que isso é péssimo de assistir e é a única coisa que funciona.'
  ],
  ef:{flag:['entendeu_como_funciona'],
      rep:{eixo:'bom',delta:4,motivo:'Ficou os dois dias e entendeu o que estava vendo'},
      moral:15, hp:2,
      registrar:'Passou dois dias assistindo dois velhos montarem o caso.'},
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!c14_temInsignia(d)},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Ir embora de Cinnabar.', vai:'c14_fim'}
  ]
},

c14_pegou_caderno:{
  falante:'Blaine',
  vozes:['N','P','N'],
  texto:[
    'Você põe o caderno 7 na mochila.',
    d=>d.flags.conheceu_blaine ? 'Blaine não impede. Ele olha a mochila fechar e diz uma coisa só:\n"Devolve."\n"Quando?"\n"Quando não precisar mais. Você vai saber."' :
       'Ninguém te vê pegar, e é justamente por isso que você fica com uma sensação ruim na garganta pelo resto do dia.',
    'O caderno pesa oitocentos gramas, e a mochila fecha diferente.'
  ],
  ef:{flag:['pegou_caderno','tem_o_caderno_sete'],
      itens:{'Caderno 7 do Dr. Fuji':1},
      rep:{eixo:'bom',delta:2,motivo:'Ficou com o documento que explica tudo'},
      registrar:'Levou o caderno 7 do Dr. Fuji.'},
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!!d.flags.conheceu_blaine && !c14_temInsignia(d)},
    {texto:'Chamar a Dra. Cordell.', vai:'c14_chamou_ivone_cinnabar', cond:d=>!!d.flags.cartao_ivone && !!d.flags.conheceu_blaine},
    {texto:'Voltar pra rua principal.', vai:'c14_cidade'}
  ]
},

c14_nao_leu:{
  falante:'Blaine',
  vozes:['N','P','N'],
  texto:[
    d=>d.flags.leu_caderno ? 'Você fecha o caderno na metade da primeira página.' : 'Você fecha o caderno sem ler.',
    d=>d.flags.conheceu_blaine
      ? `Blaine, da porta:\n"Por quê?"\n"${d.flags.blaine_explicou_a_pagina ? 'Porque ele escreveu pra você.' : 'Porque não foi escrito pra mim.'}"\nEle fica quieto um tempo bem longo.\n"É."`
      : 'É uma decisão esquisita e você não sabe explicar ela nem pra você mesm{o|a}, a não ser assim: aquele caderno estava aberto numa página que alguém escolheu, e não era pra você.',
    'Você sai da sala e apaga a luz.'
  ],
  ef:{flag:'nao_leu_o_sete',
      rep:{eixo:'bom',delta:2,motivo:'Não leu a carta de um homem para outro'},
      moral:5,
      registrar:'Não leu o caderno 7.'},
  escolhas:[
    {texto:'"Então me conta o que tem nele."', vai:'c14_blaine_leu_em_voz_alta', cond:d=>!!d.flags.conheceu_blaine && !Historia.jaAconteceu('c14_blaine_leu_em_voz_alta')},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c14_desafio_blaine', cond:d=>!!d.flags.conheceu_blaine && !c14_temInsignia(d)}
  ]
},

c14_queimou:{
  texto:[
    'Você queima.',
    'A capa dura demora e fede, e o papel de gramatura alta queima devagar, folha por folha, e você fica lá o tempo inteiro porque queimar caderno leva muito mais tempo do que as pessoas imaginam.',
    'No meio do fogo, você percebe uma coisa.',
    'Sem esse caderno, o que fizeram com ele nunca aconteceu oficialmente.',
    'E o que ele fez, também não.',
    'Você acabou de apagar a única vez em que alguém escreveu, de próprio punho, que ele pediu pra sair, e que o homem que escrevia foi lá abrir o tanque.',
    d=>d.flags.conheceu_blaine ? 'Blaine assiste da porta e não impede, e não fala nada, e quando acaba ele vira e sobe os quarenta metros de corredor sozinho.' : ''
  ],
  ef:{flag:['queimou_caderno'], instabilidade:2, moral:-20,
      rep:{eixo:'ruim',delta:3,motivo:'Destruiu a única prova do que fizeram em Cinnabar'},
      npc:d=>d.flags.conheceu_blaine ? {nome:'Blaine', opiniao:-5, memoria:'Assistiu você queimar o caderno do amigo dele e subiu o corredor sozinho.'} : null,
      registrar:'Queimou o caderno 7 do Dr. Fuji.',
      presagio:'Queimar caderno leva muito mais tempo do que as pessoas imaginam. Você teve tempo de parar.'},
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Ir pro porto esperar o ferry.', vai:'c14_fim'}
  ]
},

c14_desafio_blaine:{
  repetivel:true,
  falante:'Blaine',
  vozes:['N','P','N'],
  texto:[
    'Quinta, duas da tarde.',
    d=>!d.flags.conheceu_blaine
      ? 'O líder de Cinnabar é um velho de setenta e poucos anos, de bermuda, com uma toalha no pescoço, que entra na arena sem pressa nenhuma.'
      : (d.flags.arrumou_a_casa || d.flags.blaine_leu_em_voz_alta || d.flags.blaine_pode_parar)
      ? 'Ele não faz nenhuma concessão pelo que vocês passaram nesses dias. Isso, de um jeito esquisito, é o maior elogio que ele podia fazer.'
      : 'Ele não faz nenhuma concessão por já te conhecer da varanda.',
    '"Regra da casa: se o seu Pokémon cair e você quiser continuar, você continua. Se eu vir que você tá continuando por teimosia, eu paro a luta."',
    '"E como você sabe a diferença?"',
    'Ele entra na marcação.',
    '"Setenta e dois anos, {meu filho|minha filha}."',
    'Faz trinta e oito graus e a luz vem do buraco do teto e ninguém tem sombra.'
  ],
  ef:{flag:'vai_lutar_com_blaine',
      /* desafio é na quinta, das duas às seis; quem perdeu hoje volta na outra */
      executar:d=>{
        const h = c14_hora(d), quinta = Calendario.hoje().semanaIdx === 3;
        const hoje = quinta && h >= 14 && h < 18 && d.flags.c14_perdeu_dia !== d.relogio.dia;
        if (!hoje) Relogio.ateODia(3, 14, quinta && h >= 14);
        return [];
      }},
  batalha:{dex:59, nivel:47, tipo:'treinador', treinador:'Blaine, Líder de Cinnabar', fuga:false,
           timeExtra:[{dex:58, nivel:42},{dex:77, nivel:42},{dex:126, nivel:45}],
           vitoria:'c14_venceu_blaine', derrota:'c14_perdeu_blaine', gameover:'gameover'}
},

c14_venceu_blaine:{
  falante:'Blaine',
  vozes:['N','N','N','N','N'],
  texto:[
    'Você vence.',
    'Ele senta na beirada da marcação, com a toalha no pescoço, e demora pra recuperar o fôlego de um jeito que assusta um pouco.',
    '"Boa."',
    'Ele tira do bolso da bermuda uma insígnia amassada, que ele claramente carrega no bolso o tempo todo em vez de guardar numa caixa como os outros líderes.',
    '"Toma."',
    'E enquanto você guarda, ele fala olhando a arena vazia:',
    '"Eu perdi trinta e uma vezes em quarenta anos de ginásio."',
    '"E das trinta e uma eu lembro o nome."',
    'Ele levanta com dificuldade.',
    '"Qual é o seu mesmo?"'
  ],
  ef:{insignia:'Insígnia Vulcão', flag:['venceu_blaine','ginasio_cinnabar'],
      rep:{eixo:'bom',delta:3,motivo:'Venceu o líder de Cinnabar'},
      npc:c14_npc('Blaine', 9, 'Perdeu para você. Lembra o nome das trinta e uma pessoas que o venceram em quarenta anos.'),
      moral:15,
      registrar:'Venceu Blaine e recebeu a Insígnia Vulcão.'},
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Voltar pra rua principal.', vai:'c14_cidade'},
    {texto:'Ir embora de Cinnabar.', vai:'c14_fim'}
  ]
},

c14_perdeu_blaine:{
  repetivel:true,
  falante:'Blaine',
  vozes:['N','N','N','N'],
  texto:[
    'Você perde, e ele para no segundo em que dá pra parar, e não deixa passar disso.',
    '"Pronto. Chega."',
    'Ele atravessa a arena e ajuda a levantar o seu time, um por um, e comenta cada um como quem avalia ferramenta.',
    '"Esse aqui tá bom. Esse aqui tá cansado, não de hoje, de faz tempo. Esse aqui tá com medo de você."',
    'Você abre a boca e ele levanta a mão.',
    '"Não é acusação. É observação. Eu tenho quarenta anos de ginásio e eu vejo o que eu vejo."',
    'Ele põe a toalha no pescoço.',
    '"Volta quinta que vem. Ou não volta, que também tá bom."'
  ],
  ef:{hp:-6, causa:'Derrota no ginásio de Cinnabar', flag:'perdeu_pro_blaine',
      executar:d=>{ Estado.marcar('c14_perdeu_dia', d.relogio.dia); return []; },
      npc:c14_npc('Blaine', 6, 'Parou a luta na hora e comentou seu time um por um.'),
      registrar:'Perdeu para Blaine. Ele avaliou seu time um por um.'},
  escolhas:[
    {texto:'Tentar de novo na quinta seguinte.', vai:'c14_desafio_blaine'},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Ir embora de Cinnabar.', vai:'c14_fim'}
  ]
},

/* ─────────────── O LABORATÓRIO ─────────────── */

c14_lab:{
  texto:[
    'O laboratório por dentro é um museu de coisa interrompida — e agora é um museu queimado, o que é duas coisas ao mesmo tempo e nenhuma delas combina.',
    'A ala oeste está intacta: café petrificado numa caneca, um jaleco pendurado num cabide de parede, uma cadeira caída que ninguém levantou em quatro anos, um calendário de mesa em novembro de noventa e seis.',
    'A ala leste queimou.',
    'E queimou de dentro pra fora.',
    'Você não é perito, mas fogo que vem de fora entra por uma janela e sai pelo teto, e aqui é o contrário: as vidraças estão estufadas pra fora e os batentes estão tostados por dentro.',
    'Alguém acendeu de dentro, no meio da sala, e fechou a porta.',
    'E no chão, no meio da ala leste, no ponto onde o fogo começou, tem um retângulo de cinza mais clara.',
    'Do tamanho de uma caixa de arquivo.',
    d=>d.flags.sabe_das_cinco
      ? 'Eles não acharam as cinco. Então queimaram uma vazia pra parecer que acharam.'
      : 'Uma caixa, sozinha, no meio de uma sala, sem mais nada perto que pudesse pegar fogo.'
  ],
  ef:{flag:['viu_o_lab','sabe_que_foi_forjado'],
      rep:{eixo:'bom',delta:3,motivo:'Reparou que o fogo queimou do lado errado'},
      instabilidade:1,
      registrar:'O incêndio começou de dentro, e havia uma caixa de arquivo no ponto de origem.',
      presagio:d=>d.flags.sabe_das_cinco
        ? 'Queimaram uma caixa vazia. Pra alguém escrever num relatório que o acervo foi perdido.'
        : 'Uma caixa de arquivo queimada sozinha no meio de uma sala.'},
  escolhas:[
    {texto:'Descer para o subsolo.', vai:'c14_subsolo'},
    {texto:'Fotografar a direção da queima.', vai:'c14_fotografou_lab', cond:d=>Estado.contaItem('Câmera descartável')>0},
    {texto:'Sair e ir ao ginásio.', vai:'c14_ginasio'},
    {texto:'Sair.', vai:'c14_saida_lab'}
  ]
},

/* o laboratório, da segunda vez */
c14_lab_de_novo:{
  repetivel:true,
  texto:[
    'O laboratório continua com a ala oeste parada em novembro de noventa e seis e a ala leste preta de fuligem.',
    'O retângulo de cinza clara continua no chão da ala leste, onde a caixa queimou.'
  ],
  escolhas:[
    {texto:'Descer para o subsolo.', vai:'c14_subsolo'},
    {texto:'Fotografar a direção da queima.', vai:'c14_fotografou_lab', cond:d=>Estado.contaItem('Câmera descartável')>0 && !Historia.jaAconteceu('c14_fotografou_lab')},
    {texto:'Sair.', vai:'c14_saida_lab'}
  ]
},

c14_fotografou_lab:{
  texto:[
    'Você fotografa como acha que um perito fotografaria.',
    'As vidraças estufadas pra fora, em três ângulos. Os batentes tostados por dentro. O retângulo de cinza clara no ponto de origem, com uma Pokébola vazia do lado pra dar escala.',
    'E a fechadura da porta da ala leste, que está trancada por fora.',
    'Trancada por fora.',
    'Quem acendeu não estava dentro quando acendeu, o que quer dizer que tinha uma mecha, o que quer dizer que foi planejado com antecedência e não no susto.',
    'Onze fotos.'
  ],
  ef:{flag:['provas_do_incendio','provas_cinnabar'],
      executar:d=>{ Estado.usarItem('Câmera descartável'); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Documentou o incêndio como perito'},
      registrar:'Fotografou o incêndio do laboratório: origem interna, porta trancada por fora, caixa no foco.',
      presagio:'Trancada por fora, e a chave não ficou na porta.'},
  escolhas:[
    {texto:'Descer para o subsolo.', vai:'c14_subsolo'},
    {texto:'Levar as fotos pro Blaine.', vai:'c14_ginasio', cond:d=>!!d.flags.sabe_do_blaine},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Sair.', vai:'c14_saida_lab'}
  ]
},

c14_subsolo:{
  texto:[
    'O subsolo não queimou, porque concreto não queima.',
    'A escada desce nove metros e no fim tem um corredor com uma linha de fita amarela no chão, desbotada, com a borda descolando.',
    d=>d.flags.selma_acenou ? 'A fita que a Sra. Wilma passou uma vez em dezoito anos.'
      : d.flags.conheceu_selma ? 'A fita onde a Sra. Wilma parava.'
      : 'A fita onde quem limpava esse prédio parava, todo dia, por anos.',
    'Você passa.',
    'A sala do tanque tem trinta metros por quinze e nove de pé-direito, e não tem tanque.',
    'Tem o buraco onde ele estava: um poço de concreto de quatro metros de diâmetro e três de profundidade, com a estrutura de fixação arrancada e o aço torcido pra fora.',
    'Pra fora.',
    d=>{ const h = c14_hora(d); return h >= 6 && h < 18
      ? 'E o teto tem um rombo que sobe três andares até o céu, e você vê nuvem daqui.'
      : 'E o teto tem um rombo que sobe três andares até o céu, e você vê estrela daqui.'; },
    'Na borda do poço, num ponto só, tem duas marcas.',
    'Duas marcas de mão, em tamanho de mão de gente adulta, queimadas no concreto da borda a uns vinte centímetros uma da outra.',
    'Alguém se apoiou na borda do poço com as duas mãos e o concreto marcou.'
  ],
  ef:{flag:['viu_a_sala_do_tanque','viu_as_maos'],
      instabilidade:2, moral:-12,
      rep:{eixo:'bom',delta:3,motivo:'Passou da fita amarela'},
      registrar:'No subsolo, o tanque foi arrancado de dentro para fora. Há duas marcas de mãos na borda do poço.',
      presagio:'Marca de mão de gente adulta. De gente.'},
  escolhas:[
    {texto:'Olhar as marcas de perto.', vai:'c14_as_maos'},
    {texto:'Ir até a mesa da parede.', vai:'c14_mesa_do_subsolo'},
    {texto:'Subir e ir ao ginásio.', vai:'c14_ginasio'},
    {texto:'Sair do laboratório.', vai:'c14_saida_lab'}
  ]
},

/* o subsolo, da segunda vez */
c14_subsolo_de_novo:{
  repetivel:true,
  texto:[
    'A escada de nove metros, a fita amarela descolando, a sala de trinta por quinze sem tanque.',
    'O poço de concreto, o aço torcido pra fora, o rombo no teto. As duas marcas de mão na borda.'
  ],
  escolhas:[
    {texto:'Olhar as marcas de perto.', vai:'c14_as_maos', cond:c14_nova('c14_as_maos')},
    {texto:'Ir até a mesa da parede.', vai:'c14_mesa_do_subsolo', cond:c14_nova('c14_mesa_do_subsolo')},
    {texto:'Subir e sair do laboratório.', vai:'c14_saida_lab'}
  ]
},

c14_as_maos:{
  texto:[
    'Você agacha na borda e põe as suas mãos por cima das marcas, sem encostar.',
    'As marcas são maiores que as suas — mão de homem adulto — e estão viradas pra dentro do poço.',
    'Pra dentro.',
    'Quem fez essas marcas estava debruçado sobre o poço, olhando pra baixo, apoiado com as duas mãos.',
    'E o concreto só marca assim com calor muito alto e contato muito curto.',
    d=>c14_sabeDaCarta(d) ? 'Você fica agachad{o|a} ali por um tempo longo, e depois faz a conta que não queria fazer:' : 'Você fica agachad{o|a} ali por um tempo longo.',
    d=>c14_sabeDaCarta(d)
      ? 'o Dr. Fuji foi ao laboratório na noite do dia duzentos e cinquenta e um pra explicar a alguém o que ele era, e depois abrir o tanque.'
      : 'O aço da fixação está torcido pra fora, e as mãos estão viradas pra dentro.',
    d=>c14_sabeDaCarta(d)
      ? 'E as marcas das mãos dele estão na borda do poço, viradas pra baixo, com o tanque já vazio.'
      : 'Alguma coisa saiu desse poço, e depois alguém se debruçou na borda e olhou pra dentro do que ficou.',
    d=>c14_sabeDaCarta(d) ? 'Ele abriu.' : '',
    d=>c14_sabeDaCarta(d) ? 'E depois ele se debruçou e olhou pra dentro.' : ''
  ],
  ef:{flag:['entendeu_as_maos'],
      rep:{eixo:'bom',delta:4,motivo:'Ficou agachad{o|a} até entender'},
      moral:-18, instabilidade:1,
      registrar:d=>c14_sabeDaCarta(d)
        ? 'As marcas de mão na borda do poço são do Dr. Fuji, depois de abrir o tanque.'
        : 'Há duas marcas de mão queimadas na borda do poço, viradas pra dentro, de alguém que olhou depois que o tanque esvaziou.'},
  escolhas:[
    {texto:'Ir até a mesa da parede.', vai:'c14_mesa_do_subsolo', cond:c14_nova('c14_mesa_do_subsolo')},
    {texto:'Ir contar pro Blaine.', vai:'c14_ginasio', cond:d=>!!d.flags.sabe_do_blaine},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Sair do laboratório.', vai:'c14_saida_lab'}
  ]
},

c14_mesa_do_subsolo:{
  texto:[
    'Encostada na parede, longe do poço, tem uma mesa de laboratório de aço inox.',
    'Em cima dela: um copo de vidro, uma caneta, e um livro de registro de acesso ao subsolo — daqueles de portaria, com coluna de nome, hora de entrada e hora de saída.',
    'A última página escrita é a do dia doze de novembro de mil novecentos e noventa e seis.',
    '**21h40 — FUJI, A. — entrada — autorizado por: BERTO, S. (vigia)**',
    'E a coluna de saída, na mesma linha, está preenchida.',
    'Preenchida.',
    '**04h10 — saída**',
    'Na letra do vigia.',
    'Ele saiu.',
    'O Dr. Fuji entrou às nove e quarenta da noite do dia doze de novembro, ficou seis horas e meia, e saiu às quatro e dez da manhã do dia treze, e o vigia anotou a saída no livro.',
    d=>d.flags.blaine_sem_enterro ? 'E o Blaine disse, na varanda, que o amigo morreu no dia doze de novembro de noventa e seis, num subsolo a oitocentos metros da casa dele.'
      : d.flags.nao_acharam_corpo ? 'E o Blaine disse, na varanda, que não acharam corpo.'
      : 'Depois dessa linha, o livro não tem mais nada escrito.'
  ],
  ef:{flag:['achou_o_livro_de_acesso','fuji_saiu'],
      rep:{eixo:'bom',delta:6,motivo:'Achou a coluna de saída preenchida'},
      instabilidade:2,
      registrar:'O livro de acesso registra a SAÍDA do Dr. Fuji às 04h10 do dia 13/11/1996.',
      presagio:d=>d.flags.conheceu_blaine
        ? 'Ele saiu. Quatro anos de luto e ele saiu, e está escrito num livro de portaria.'
        : 'Ele saiu, e está escrito num livro de portaria, na letra do vigia.'},
  escolhas:[
    {texto:'Arrancar a folha e levar pro Blaine. Correndo.', vai:'c14_correu_pro_blaine', cond:d=>!!d.flags.sabe_do_blaine, ef:C14_ARRANCA},
    {texto:'Ir contar pro Blaine. Correndo.', vai:'c14_correu_pro_blaine', cond:d=>!!d.flags.sabe_do_blaine},
    {texto:'Procurar o vigia Berto.', vai:'c14_tokuda'},
    {texto:'Arrancar a folha e guardar.', vai:'c14_saida_lab', cond:d=>!d.flags.sabe_do_blaine, ef:C14_ARRANCA}
  ]
},

c14_tokuda:{
  falante:'Sr. Berto',
  vozes:['N','P','N','N','P','N','N'],
  texto:[
    d=>c14_esperou(d, 'c14_espera_berto',
      'É cedo pra bater na porta de alguém. Você espera a ilha acordar.',
      'É tarde pra bater na porta de alguém. Você volta {quando}, de manhã.'),
    'Numa ilha de setecentas pessoas, achar o Sr. Berto leva quarenta minutos e três perguntas.',
    'Ele tem oitenta e um anos, mora com a filha, e está sentado na varanda vendo a rua, do jeito que velho de ilha faz.',
    'Quando você diz "livro de acesso", ele te olha com olho de quem enxerga mal e ouve bem.',
    '"Eu anotei a saída."',
    '"O senhor anotou."',
    '"Eu anotei porque ele saiu. Eu não ia anotar uma coisa que não aconteceu."',
    'Ele mexe na bengala.',
    '"Eu falei isso pra polícia, pra brigada, pro pessoal da empresa e pra uma moça de terno que veio de Saffron em dezembro."',
    '"E?"',
    '"E a moça de terno pegou o livro, olhou, e me disse que eu tinha me confundido de data porque eu sou velho."',
    'Ele ri sem nenhum humor.',
    '"Eu tinha setenta e sete anos e trabalhava naquela portaria há dezenove."'
  ],
  ef:{flag:['conheceu_tokuda','tokuda_confirma'],
      executar:()=>{ c14_esperarAbrir('c14_espera_berto', 8, 20, false); return []; },
      npc:{nome:'Sr. Berto', opiniao:5, memoria:'Anotou a saída do Dr. Fuji às 4h10 e foi chamado de velho confuso por uma mulher de terno de Saffron.'},
      rep:{eixo:'bom',delta:5,motivo:'Foi perguntar ao homem que escreveu a linha'},
      moral:-8,
      registrar:'O Sr. Berto confirma que o Dr. Fuji saiu do laboratório às 4h10 de 13/11/1996.'},
  escolhas:[
    {texto:'"Pra onde ele foi?"', vai:'c14_pra_onde_ele_foi'},
    {texto:'Ir contar pro Blaine.', vai:'c14_correu_pro_blaine', cond:d=>!!d.flags.sabe_do_blaine},
    {texto:'Subir o vulcão.', vai:'c14_vulcao'}
  ]
},

c14_pra_onde_ele_foi:{
  falante:'Sr. Berto',
  vozes:['P','N','P','N','N','N','N','N','N'],
  texto:[
    '"Pra onde ele foi?"',
    'O Sr. Berto aponta com a bengala.',
    'Ele aponta pro vulcão.',
    '"Ele saiu e virou à direita, e à direita é a estrada da encosta, e a estrada da encosta não vai pra lugar nenhum a não ser pra cima."',
    '"Sozinho?"',
    'Ele demora.',
    '"Não."',
    'Ele apoia as duas mãos na bengala.',
    '"Eu tenho oitenta e um anos, {meu filho|minha filha}, e eu vou morrer em uns cinco, e eu vou te contar porque eu não contei pra mais ninguém e tá ficando pesado."',
    '"Tinha uma coisa andando do lado dele."',
    '"Do lado. Não atrás e não na frente. Do lado, no mesmo passo."',
    '"E os dois subiram a estrada da encosta às quatro e dez da manhã e eu fiquei na portaria e não segui."',
    'Ele olha as próprias mãos.',
    '"E faz quatro anos que eu penso que eu devia ter seguido."'
  ],
  ef:{flag:['subiram_juntos','sabe_que_subiram'],
      npc:{nome:'Sr. Berto', opiniao:8, memoria:'Viu o Dr. Fuji subir a estrada da encosta às 4h10 com alguma coisa andando do lado dele, no mesmo passo.'},
      rep:{eixo:'bom',delta:6,motivo:'Perguntou pra onde ele foi'},
      instabilidade:2, moral:-10,
      registrar:'O Dr. Fuji subiu o vulcão às 4h10 com alguma coisa andando ao lado dele, no mesmo passo.',
      presagio:'Do lado. No mesmo passo. Não atrás, não na frente.'},
  escolhas:[
    {texto:'Subir o vulcão agora.', vai:'c14_vulcao'},
    {texto:'Ir buscar o Blaine antes.', vai:'c14_correu_pro_blaine', cond:d=>!!d.flags.sabe_do_blaine},
    {texto:'Levar o Sr. Berto pra falar com o Blaine.', vai:'c14_correu_pro_blaine', cond:d=>!!d.flags.sabe_do_blaine, ef:{flag:'c14_berto_junto'}}
  ]
},

c14_correu_pro_blaine:{
  texto:[
    d=>d.flags.c14_berto_junto
      ? 'Você atravessa Cinnabar no passo do Sr. Berto, que é o passo da bengala, e quatro pessoas param pra ver o vigia velho andando do lado de alguém de fora.'
      : 'Você atravessa Cinnabar correndo, que é uma coisa que ninguém faz em Cinnabar, e quatro pessoas te veem correr e uma delas grita perguntando se aconteceu alguma coisa.',
    d=>c14_blaineNaVaranda(d)
      ? 'Você acha o Blaine na varanda da casa do Fuji, na cadeira de balanço, com a garrafa térmica.'
      : 'Você acha o Blaine no ginásio, sentado na beirada da arena, com uma toalha no pescoço.',
    ()=>c14_temAFolha() ? 'E você mostra a folha do livro de acesso.'
      : 'E você conta a linha do livro de acesso, de cabeça: entrada às nove e quarenta da noite, saída às quatro e dez da manhã, na letra do vigia.',
    ()=>c14_temAFolha() ? 'Ele lê a linha. Lê de novo.' : 'Ele pede pra você repetir. Você repete.',
    ()=>c14_temAFolha()
      ? 'E depois lê pela terceira vez, com o dedo em cima da coluna de saída, e o dedo dele treme de um jeito que não é de idade.'
      : 'Ele pede de novo, e quando você repete pela terceira vez a mão dele treme de um jeito que não é de idade.',
    fala('Blaine', 'Quatro e dez.'),
    d=>fala(d.jogador.nome, 'Quatro e dez.'),
    d=>d.flags.c14_berto_junto ? fala('Sr. Berto', 'Fui eu que escrevi, Burke.') : '',
    d=>d.flags.c14_berto_junto ? 'O Sr. Berto se apoia na bengala.' : '',
    d=>d.flags.c14_berto_junto ? fala('Sr. Berto', 'E os dois subiram a estrada da encosta. Eu vi, e não segui.')
      : d.flags.subiram_juntos ? fala(d.jogador.nome, 'E o Sr. Berto diz que os dois subiram a estrada da encosta.') : '',
    d=>d.flags.subiram_juntos ? fala('Blaine', 'Os dois?')
      : fala('Blaine', 'Saiu às quatro e dez, e ninguém viu ele descer pra cidade. Setecentas pessoas, {meu filho|minha filha}. Alguém teria visto.'),
    d=>d.flags.subiram_juntos ? fala(d.flags.c14_berto_junto ? 'Sr. Berto' : d.jogador.nome, 'Os dois.')
      : fala('Blaine', 'Da portaria, se não é a cidade, é a estrada da encosta.'),
    'Ele levanta de uma vez, sem apoiar em nada, o que ele não faz há uns dez anos.',
    fala('Blaine', 'Quarenta anos de ginásio dentro daquele vulcão.'),
    fala('Blaine', 'Quarenta anos, {meu filho|minha filha}, e eu nunca subi até a cratera.')
  ],
  ef:{flag:['blaine_sabe_da_saida','blaine_vai_subir'],
      npc:c14_npc('Blaine', 10, 'Ouviu três vezes a linha da saída às 4h10 e levantou sem apoiar em nada.'),
      rep:{eixo:'bom',delta:5,motivo:'Atravessou a ilha com uma linha de um livro de portaria'},
      moral:10, instabilidade:1,
      registrar:'Blaine soube que o amigo saiu vivo do laboratório e subiu o vulcão.',
      presagio:'Quarenta anos de ginásio dentro do vulcão e ele nunca subiu até a cratera.'},
  escolhas:[
    {texto:'Subir o vulcão com ele.', vai:'c14_vulcao'},
    {texto:'Ir ver o acervo antes.', vai:'c14_ginasio_por_dentro', cond:c14_sabeDasCaixas}
  ]
},

c14_saida_lab:{
  repetivel:true,
  texto:[
    d=>d.flags.capturou_moltres ? 'Lá fora, o vulcão não solta fumaça nenhuma.'
      : (d.flags.c14_saidas || 0) > 1 ? 'Lá fora, a fumaça do vulcão continua vermelha.'
      : 'Ao sair do laboratório, você percebe que a fumaça do vulcão está mais densa do que quando você chegou.',
    d=>d.flags.capturou_moltres || (d.flags.c14_saidas || 0) > 1 ? '' : 'E vermelha.',
    d=>d.flags.capturou_moltres || (d.flags.c14_saidas || 0) > 1 ? '' : 'Fumaça não é vermelha. Fumaça é cinza, ou branca, ou preta se for borracha.',
    d=>d.flags.capturou_moltres || (d.flags.c14_saidas || 0) > 1 ? '' : 'Vermelha é outra coisa.'
  ],
  ef:{executar:d=>{ Estado.marcar('c14_saidas', (d.flags.c14_saidas || 0) + 1); return []; }},
  escolhas:[
    {texto:'Subir o vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'},
    {texto:d=>d.flags.conheceu_selma ? 'Ir ao portão da Sra. Wilma.' : 'Procurar quem trabalhou no laboratório.', vai:'c14_selma'},
    {texto:'Voltar pro subsolo.', vai:'c14_subsolo'},
    {texto:'Voltar pra rua principal.', vai:'c14_cidade'}
  ]
},

/* ─────────────── O VULCÃO ─────────────── */

c14_vulcao:{
  texto:[
    d=>d.flags.c14_subiu_de_madrugada ? 'Ninguém sobe aquela encosta de noite. Você espera clarear e começa a subir às cinco.' : '',
    'A subida leva quase quatro horas por uma estrada de encosta que foi de terra batida e hoje é pedra solta.',
    d=>c14_blaineNaCratera(d) ? 'Blaine sobe com você e leva cinco horas e vinte, porque ele tem setenta e dois anos, e ele para nove vezes e xinga em todas, e ele não aceita ajuda em nenhuma.' : '',
    'O chão fica quente através da sola do sapato no último terço, e nos últimos quatrocentos metros tem fumarola saindo de fenda no chão, e o cheiro de enxofre fica tão forte que arde no olho.',
    'Na borda da cratera, o calor deforma o ar e faz o horizonte inteiro tremer.',
    'A cratera tem uns duzentos metros de diâmetro e não tem lava à vista — tem uma crosta escura com veios vermelhos, como brasa de carvão coberta de cinza.',
    'E tem alguma coisa pousada na borda do outro lado.',
    'Grande. Parada. Com o corpo inteiro parecendo brasa que não apaga.',
    'Moltres.',
    'Você conhece o nome da Pokédex e do livro da escola, e nenhum dos dois dizia o tamanho.',
    'E ele já estava olhando pra você antes de você chegar.'
  ],
  ef:{executar:d=>{
        c14_subir(d);
        const L = Estado.lend(146); L.encontros++;
        return [{tipo:'mundo', texto:'Moltres, uma das três aves lendárias de Kanto, na borda de uma cratera, olhando pra você.'}];
      },
      flag:'achou_moltres',
      registrar:'Encontrou Moltres na cratera do vulcão de Cinnabar.',
      presagio:'Ele já estava olhando antes de você chegar. Pensa em quanto tempo antes.'},
  escolhas:[
    {texto:'Ficar parad{o|a}. Só olhar.', vai:'c14_olhar'},
    {texto:'Procurar sinal de que alguém esteve aqui.', vai:'c14_procurou_sinal', cond:d=>!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu},
    {texto:'Oferecer comida e recuar devagar.', vai:'c14_comida', cond:d=>Estado.contaItem('Ração')>0},
    {texto:'Atacar. Uma chance dessas não se repete.', vai:'c14_luta_moltres'},
    {texto:'Descer o vulcão sem fazer nada.', vai:'c14_desceu'}
  ]
},

/* a cratera, de novo: ele está lá ou não está */
c14_vulcao_de_novo:{
  repetivel:true,
  texto:[
    d=>d.flags.c14_subiu_de_madrugada ? 'Ninguém sobe aquela encosta de noite. Você espera clarear e começa a subir às cinco.' : '',
    d=>c14_blaineNaCratera(d)
      ? 'Você sobe a encosta de novo, dessa vez com o Blaine, que leva cinco horas e vinte, para nove vezes, xinga em todas e não aceita ajuda em nenhuma.'
      : 'Você sobe a encosta de novo: quase quatro horas de pedra solta, fumarola nos últimos quatrocentos metros, o cheiro de enxofre que arde no olho.',
    d=>c14_moltresAli(d) ? 'Moltres continua na borda do outro lado, do jeito que estava, e continua olhando.' : 'A borda do outro lado está vazia.'
  ],
  ef:{executar:d=>{ c14_subir(d); return []; }},
  escolhas:[
    {texto:'Ficar parad{o|a}. Só olhar.', vai:'c14_olhar', cond:c14_moltresAli},
    {texto:d=>Historia.jaAconteceu('c14_procurou_sinal') ? 'Ir até o abrigo de rocha do lado leste.' : 'Procurar sinal de que alguém esteve aqui.', vai:'c14_procurou_sinal',
     cond:d=>!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu || Historia.jaAconteceu('c14_procurou_sinal')},
    {texto:'Oferecer comida e recuar devagar.', vai:'c14_comida', cond:d=>c14_moltresAli(d) && Estado.contaItem('Ração')>0 && !Historia.jaAconteceu('c14_comida')},
    {texto:'Atacar.', vai:'c14_luta_moltres', cond:c14_moltresAli},
    {texto:'Descer.', vai:'c14_desceu'}
  ]
},

c14_procurou_sinal:{
  falante:'Blaine',
  vozes:['N'],
  texto:[
    d=>c14_moltresAli(d)
      ? 'Você anda a borda da cratera procurando, e é uma coisa idiota de se fazer com um lendário a duzentos metros olhando.'
      : 'Você anda a borda da cratera procurando, com o calor subindo pela sola do sapato.',
    d=>c14_moltresAli(d) ? 'Ele não te impede.' : '',
    'Leva quarenta minutos e você acha no lado leste, num abrigo natural de rocha onde a fumarola não chega.',
    'Uma mochila.',
    'Mochila de lona, velha, com a alça arrebentada e a lona rachada pelo sol de quatro anos, e dentro dela: uma garrafa térmica, um casaco enrolado, e um par de óculos de grau numa capinha rígida.',
    'Óculos de grau.',
    'E ao lado da mochila, no chão de rocha, encostada na parede do abrigo, uma pedra vulcânica de uns quarenta centímetros que alguém pôs ali de pé, de propósito, com outras duas menores em cima.',
    'Três pedras empilhadas.',
    'Isso não é geologia. Isso é sinalização.',
    'Alguém empilhou três pedras nesse abrigo pra marcar que alguém esteve aqui.',
    d=>c14_blaineNaCratera(d) ? 'Blaine chega no abrigo dez minutos depois de você, ofegante, e vê os óculos antes de ver qualquer outra coisa.\nEle senta no chão de rocha.\n"Esse é o de leitura."' : ''
  ],
  ef:{flag:['achou_a_mochila_do_fuji','sabe_que_ele_chegou'],
      rep:{eixo:'bom',delta:6,motivo:'Andou a borda de uma cratera procurando'},
      moral:-15, instabilidade:1,
      registrar:'Na borda da cratera há a mochila do Dr. Fuji e três pedras empilhadas.',
      presagio:'Três pedras, a maior embaixo, e a de cima posta com cuidado.'},
  escolhas:[
    {texto:'Olhar dentro da garrafa térmica.', vai:'c14_garrafa'},
    {texto:'Ficar parad{o|a} e olhar Moltres.', vai:'c14_olhar', cond:c14_moltresAli},
    {texto:'Levar a mochila.', vai:'c14_levou_a_mochila'},
    {texto:'Descer.', vai:'c14_desceu'}
  ]
},

/* o abrigo, de novo */
c14_abrigo_de_novo:{
  repetivel:true,
  texto:[
    d=>c14_mochilaNoAbrigo(d)
      ? 'O abrigo de rocha do lado leste continua do jeito que estava: a mochila de lona encostada na parede, e as pedras empilhadas do lado.'
      : 'O abrigo de rocha do lado leste está vazio, a não ser pelas pedras empilhadas.',
    d=>`As ${porExtenso(d.flags.c14_pedras || 3).replace(/^dois$/, 'duas')} pedras continuam de pé.`
  ],
  escolhas:[
    {texto:'Olhar dentro da garrafa térmica.', vai:'c14_garrafa', cond:d=>c14_mochilaNoAbrigo(d) && !Historia.jaAconteceu('c14_garrafa')},
    {texto:'Levar a mochila.', vai:'c14_levou_a_mochila', cond:d=>c14_mochilaNoAbrigo(d) && !Historia.jaAconteceu('c14_levou_a_mochila')},
    {texto:'Empilhar mais uma pedra.', vai:'c14_quarta_pedra', cond:c14_nova('c14_quarta_pedra')},
    {texto:'Ficar parad{o|a} e olhar Moltres.', vai:'c14_olhar', cond:c14_moltresAli},
    {texto:'Descer.', vai:'c14_desceu'}
  ]
},

c14_garrafa:{
  texto:[
    'A garrafa térmica está fechada e a rosca cede com dificuldade.',
    'Dentro não tem café.',
    'Tem papel.',
    'Um rolo de papel enfiado dentro de uma garrafa térmica, que é a coisa mais improvisada e mais esperta que alguém podia fazer com um documento numa borda de vulcão: térmica isola, rosca veda, e quatro anos depois o papel está seco e legível.',
    'É uma folha só, arrancada de caderno, escrita dos dois lados.',
    d=>d.flags.leu_caderno ? 'A letra é a mesma dos cadernos.' : 'A letra é miúda e reta, de quem escreveu muito na vida.',
    '**"Dia 252. Subimos. Ele quis subir e eu fui junto porque foi a primeira coisa que ele escolheu sem me perguntar se podia."**',
    '**"Passamos a noite aqui. Não conversamos quase nada. Ele ficou olhando a cratera por seis horas e eu fiquei do lado."**',
    '**"De manhã ele me perguntou se eu ia embora e eu disse que sim, que eu ia dar aula numa escola, e ele perguntou o que é uma escola."**',
    '**"Eu expliquei."**',
    '**"Ele disse: é isso que você fez comigo."**',
    '**"E eu disse: não. Escola é quando o outro também pode perguntar."**',
    '**"E ele ficou quieto muito tempo e depois disse: então você nunca foi minha escola."**',
    '**"E ele tem razão, e eu não tenho como consertar isso, e é a última coisa que eu escrevo."**',
    '**"Vou deixar aqui porque ele pediu que eu não levasse nada escrito. Ele tem o direito de pedir. É a primeira coisa que ele me pede que eu posso cumprir."**',
    '**"A. F."**'
  ],
  ef:{flag:['achou_a_folha','leu_o_dia_252'],
      itens:{'Folha da garrafa térmica':1},
      rep:{eixo:'bom',delta:7,motivo:'Abriu a garrafa térmica'},
      moral:-20, instabilidade:2,
      registrar:'Dia 252: os dois subiram o vulcão juntos e passaram a noite ali. É a última coisa que o Dr. Fuji escreveu.'},
  escolhas:[
    {texto:'Ler em voz alta pro Blaine.', vai:'c14_leu_pro_blaine', cond:c14_blaineNaCratera},
    {texto:'Guardar e descer.', vai:'c14_desceu'},
    {texto:'Ficar parad{o|a} e olhar Moltres.', vai:'c14_olhar', cond:c14_moltresAli},
    {texto:'Devolver a folha à garrafa e fechar.', vai:'c14_devolveu_a_folha'}
  ]
},

c14_devolveu_a_folha:{
  texto:[
    'Você enrola a folha do jeito que ela estava, enfia de volta na garrafa térmica, e rosqueia.',
    'E põe a garrafa de volta na mochila, e a mochila de volta encostada na parede do abrigo, e as pedras continuam empilhadas onde estavam.',
    'Ele pediu pra não levar nada escrito.',
    'Ele pediu, e a folha diz que ele pediu, e a folha está no lugar onde foi deixada porque foi isso que combinaram.',
    'Você não é parte desse combinado e não vai desfazer ele.',
    d=>c14_blaineNaCratera(d) ? 'Blaine olha você fazer isso, do chão do abrigo, com os óculos de leitura na mão.\nEle não diz nada e assente uma vez.' : ''
  ],
  ef:{flag:['devolveu_a_folha','respeitou_o_pedido'],
      perdeItens:{'Folha da garrafa térmica':1},
      rep:{eixo:'bom',delta:6,motivo:'Devolveu a folha ao lugar onde foi deixada'},
      moral:20,
      registrar:'Devolveu a folha à garrafa térmica e deixou a mochila no abrigo.',
      presagio:'Você não é parte do combinado. Poucas pessoas entendem isso.'},
  escolhas:[
    {texto:'Ficar parad{o|a} e olhar Moltres.', vai:'c14_olhar', cond:c14_moltresAli},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Oferecer comida.', vai:'c14_comida', cond:d=>c14_moltresAli(d) && Estado.contaItem('Ração')>0 && !Historia.jaAconteceu('c14_comida')},
    {texto:'Empilhar uma quarta pedra.', vai:'c14_quarta_pedra', cond:c14_nova('c14_quarta_pedra')}
  ]
},

c14_devolveu_a_mochila:{
  texto:[
    'Você tira a mochila do Fuji de dentro da sua e põe de volta encostada na parede do abrigo, do jeito que estava, com as pedras do lado.',
    d=>c14_blaineNaCratera(d) ? 'Blaine olha você fazer isso e não diz nada.' : ''
  ],
  ef:{flag:'devolveu_a_mochila', limpaFlag:'tem_a_mochila_do_fuji',
      perdeItens:{'Mochila de lona do Dr. Fuji':1},
      rep:{eixo:'bom',delta:2,motivo:'Devolveu a mochila ao lugar onde foi deixada'},
      registrar:'Devolveu a mochila do Dr. Fuji ao abrigo da cratera.'},
  escolhas:[
    {texto:'Empilhar uma quarta pedra.', vai:'c14_quarta_pedra', cond:c14_nova('c14_quarta_pedra')},
    {texto:'Ficar parad{o|a} e olhar Moltres.', vai:'c14_olhar', cond:c14_moltresAli},
    {texto:'Descer.', vai:'c14_desceu'}
  ]
},

c14_quarta_pedra:{
  texto:[
    'Você acha uma pedra de uns quinze centímetros e põe em cima das três.',
    'Fica torto. Você tira e põe de novo três vezes até ficar de pé.',
    'Quatro pedras empilhadas na borda de uma cratera de vulcão, numa ilha de setecentos habitantes.',
    'Pra quem não sabe, é geologia.',
    'E tudo bem.',
    d=>c14_blaineNaCratera(d) ? 'Blaine levanta do chão do abrigo, com dificuldade, procura uma pedra, e põe a quinta.\nE senta de novo.\nE os dois ficam olhando cinco pedras empilhadas por um tempo bem longo.' : ''
  ],
  ef:{flag:['empilhou_a_pedra'],
      executar:d=>{ Estado.marcar('c14_pedras', c14_blaineNaCratera(d) ? 5 : 4); return []; },
      rep:{eixo:'bom',delta:4,motivo:'Empilhou a quarta pedra'},
      moral:20,
      registrar:'Empilhou uma quarta pedra no abrigo da cratera.'},
  escolhas:[
    {texto:'Ficar parad{o|a} e olhar Moltres.', vai:'c14_olhar', cond:c14_moltresAli},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Oferecer comida.', vai:'c14_comida', cond:d=>c14_moltresAli(d) && Estado.contaItem('Ração')>0 && !Historia.jaAconteceu('c14_comida')},
    {texto:'Ficar até o sol nascer e descer.', vai:'c14_desceu', cond:c14_deNoite, ef:C14_ATE_O_SOL}
  ]
},

c14_leu_pro_blaine:{
  falante:'Blaine',
  vozes:['N','P','N','P','N','P','N','N','N'],
  texto:[
    'Você lê a folha em voz alta, na borda de uma cratera, pra um homem de setenta e dois anos sentado no chão de um abrigo de rocha com um par de óculos de leitura na mão.',
    'Ele ouve inteiro sem interromper.',
    'Na parte do "eu ia dar aula numa escola", ele fecha os olhos.',
    'Na parte do "então você nunca foi minha escola", ele abre.',
    'Quando você termina, ele não fala nada por uns três minutos.',
    'Depois:',
    '"Ele não morreu no laboratório."',
    '"Não."',
    '"Ele morreu aqui?"',
    'E aí você tem que dizer a coisa difícil, que é a verdade:',
    '"Eu não sei. A folha acaba no dia duzentos e cinquenta e dois de manhã."',
    'Blaine olha a mochila.',
    '"A mochila tá aqui."',
    '"Tá."',
    '"E ele não desceu a estrada, porque se ele descesse a estrada alguém teria visto. Setecentas pessoas, {meu filho|minha filha}."',
    'Ele põe os óculos de leitura no bolso da camisa, com muito cuidado.',
    '"Então é isso."',
    'E levanta.',
    '"Pronto. Agora eu posso parar."'
  ],
  ef:{flag:['blaine_pode_parar','leu_o_dia_252'],
      npc:c14_npc('Blaine', 10, 'Ouviu a última folha do amigo lida em voz alta na borda da cratera e disse "agora eu posso parar".'),
      rep:{eixo:'bom',delta:8,motivo:'Deu a um velho o enterro que ele não teve'},
      moral:30, instabilidade:-1,
      registrar:'Blaine ouviu a última folha do Dr. Fuji e conseguiu parar.',
      presagio:'"Agora eu posso parar." Ele disse isso de pé, com os óculos do amigo no bolso.'},
  escolhas:[
    {texto:'Empilhar uma quarta pedra.', vai:'c14_quarta_pedra', cond:c14_nova('c14_quarta_pedra')},
    {texto:'Devolver a folha à garrafa.', vai:'c14_devolveu_a_folha', cond:d=>Estado.contaItem('Folha da garrafa térmica')>0},
    {texto:'Ficar parad{o|a} e olhar Moltres.', vai:'c14_olhar', cond:c14_moltresAli},
    {texto:'Descer com ele.', vai:'c14_desceu'}
  ]
},

c14_levou_a_mochila:{
  falante:'Blaine',
  vozes:['N','N','P','N'],
  texto:[
    'Você põe a mochila do Fuji dentro da sua.',
    'Ela pesa quase nada — uma garrafa térmica, um casaco e um par de óculos numa capinha — e ainda assim muda o equilíbrio da sua mochila de um jeito que você sente no primeiro passo.',
    d=>c14_blaineNaCratera(d) ? 'Blaine não impede.\n"Devolve pra ilha", ele diz. "Não pra mim. Pra ilha."\n"Como assim pra ilha?"\n"A escola daqui tem uma sala de memória com uma vitrine e três coisas dentro. Bota lá."' :
       'As pedras empilhadas continuam onde estavam.'
  ],
  ef:{flag:['tem_a_mochila_do_fuji'],
      itens:{'Mochila de lona do Dr. Fuji':1},
      executar:d=>{ Estado.marcar('c14_escola_pelo_blaine', c14_blaineNaCratera(d)); return []; },
      rep:{eixo:'bom',delta:2,motivo:'Trouxe de volta o que estava numa borda de cratera'},
      registrar:'Levou a mochila do Dr. Fuji da borda da cratera.',
      presagio:'A mochila é da ilha. Alguém aqui sabe onde ela fica.'},
  escolhas:[
    {texto:d=>c14_blaineNaCratera(d) ? 'Descer e entregar na escola.' : 'Descer e procurar quem saiba o que fazer com ela.', vai:'c14_escola'},
    {texto:'Ficar parad{o|a} e olhar Moltres.', vai:'c14_olhar', cond:c14_moltresAli},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Devolver a mochila ao abrigo.', vai:'c14_devolveu_a_mochila'}
  ]
},

c14_escola:{
  falante:'a diretora da escola de Cinnabar',
  vozes:['N','P','N','N','P'],
  texto:[
    d=>d.flags.c14_escola_pelo_blaine ? ''
      : 'Na rua, você pergunta o que fazer com a mochila de um homem que dava palestra sobre vulcão, e todo mundo te manda pra mesma porta.',
    d=>c14_esperou(d, 'c14_espera_escola',
      'A escola ainda está fechada. Você espera no portão até o sinal das sete.',
      'A escola está fechada. Você volta {quando}, no sinal das sete.'),
    'A Escola Municipal de Cinnabar tem noventa e um alunos, três salas e uma sala de memória com uma vitrine de vidro e três coisas dentro: uma pedra-pomes grande, uma foto da inauguração em mil novecentos e sessenta e um, e um remo.',
    'A diretora tem trinta e poucos anos e estudou nessa escola.',
    'Você conta o que é a mochila e de quem era, e ela ouve tudo de pé, no corredor, com o sinal tocando no meio.',
    'E aí ela faz uma pergunta que você não esperava:',
    '"Ele era bom?"',
    '"Como assim?"',
    '"Meu pai fala dele. Diz que ele dava palestra aqui uma vez por ano, sobre vulcão, pros terceiros anos."',
    'Ela abre a vitrine.',
    '"Ele era bom de explicar?"',
    d=>d.flags.leu_o_dia_252 ? '"Ele era. Ele explicou o que é uma escola pra uma coisa que nunca tinha visto uma."'
      : d.flags.leu_caderno ? '"Pelo que eu li, era."'
      : '"Eu não conheci ele. Mas acho que era."',
    'Ela põe a mochila na vitrine, ao lado do remo, e fecha.',
    'E escreve numa etiqueta de papel, com caneta, e cola no vidro:',
    '**"Mochila do Prof. Ansel Fuji, que dava aula de vulcão aqui."**',
    'Professor.',
    'Ela escreveu professor.'
  ],
  ef:{flag:['entregou_a_mochila','fuji_virou_professor'],
      limpaFlag:'tem_a_mochila_do_fuji',
      perdeItens:{'Mochila de lona do Dr. Fuji':1},
      /* a descida, e a escola abre das sete às cinco, de segunda a sexta */
      executar:d=>{
        Estado.marcar('c14_blaine_na_cratera', false);
        Relogio.avancar(4);
        c14_esperarAbrir('c14_espera_escola', 7, 17, true);
        return [];
      },
      npc:{nome:'a diretora da escola de Cinnabar', opiniao:6, memoria:'Pôs a mochila do Dr. Fuji na vitrine da sala de memória e escreveu "Prof." na etiqueta.'},
      rep:{eixo:'bom',delta:7,motivo:'Fez um homem virar o que ele queria ser'},
      moral:30,
      registrar:'A mochila do Dr. Fuji está na vitrine da escola de Cinnabar, com a etiqueta "Prof.".',
      presagio:d=>d.flags.viu_o_classificado
        ? 'Ela escreveu professor. Ele circulou a vaga e nunca chegou a assinar o contrato, e agora está escrito.'
        : 'Ela escreveu professor, e ninguém pediu.'},
  escolhas:[
    {texto:'Ir embora de Cinnabar.', vai:'c14_fim'},
    {texto:'Voltar ao vulcão.', vai:'c14_vulcao'},
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'},
    {texto:'Voltar pra rua principal.', vai:'c14_cidade'}
  ]
},

/* ─────────────── MOLTRES ─────────────── */

c14_olhar:{
  texto:[
    'Você fica parad{o|a}.',
    'Onze minutos. Ele fica parado onze minutos.',
    'O calor da cratera passa pelo meio de vocês dois em onda e deforma o ar, e ele fica com as bordas trêmulas, como coisa vista através do ar em cima de um fogareiro.',
    'Em algum momento você para de achar que está sendo avaliad{o|a} e começa a achar que está sendo lembrad{o|a} — como se ele estivesse guardando o seu rosto.',
    d=>!d.flags.achou_a_mochila_do_fuji ? ''
      : `E aí ele faz uma coisa: ele vira a cabeça, devagar, na direção do abrigo de rocha do lado leste, ${d.flags.tem_a_mochila_do_fuji ? 'de onde você tirou a mochila' : 'onde está a mochila'}.\nE volta a olhar você.`,
    'Depois ele abre as asas, e o calor que sai disso te derruba de joelhos, e quando você levanta a cratera está vazia.'
  ],
  ef:{executar:d=>{ const L = Estado.lend(146); L.disposicao = 'neutro'; Estado.marcar('c14_moltres_foi');
        /* o gesto pro abrigo só acontece com a mochila achada: o 15 lembra dele */
        if (d.flags.achou_a_mochila_do_fuji) Estado.marcar('c14_moltres_virou');
        return []; },
      rep:{eixo:'bom',delta:2,motivo:'Encontrou um lendário e não tentou pegá-lo'},
      moral:8,
      flag:'respeitou_moltres',
      registrar:'Ficou onze minutos parad{o|a} olhando Moltres e ele foi embora.',
      presagio:d=>d.flags.achou_a_mochila_do_fuji ? 'Ele olhou pro abrigo antes de olhar pra você.' : 'Onze minutos, e ele não piscou nenhuma vez que você visse.'},
  escolhas:[
    {texto:'Procurar sinal de quem esteve aqui.', vai:'c14_procurou_sinal', cond:d=>(!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu) && !Historia.jaAconteceu('c14_procurou_sinal')},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Ficar até o sol nascer e descer.', vai:'c14_desceu', cond:c14_deNoite, ef:C14_ATE_O_SOL}
  ]
},

c14_comida:{
  texto:[
    'Você abre o pacote de ração, coloca na pedra, e anda pra trás sem virar as costas.',
    'É um gesto ridículo e você sabe que é ridículo enquanto faz: você está oferecendo comida de loja, com prazo de validade impresso no pacote, a uma coisa que existe desde antes das cidades terem nome.',
    'Ele desce.',
    'Olha a ração. Olha você. E come.',
    'Não porque precisa — uma coisa que se alimenta de calor de vulcão não precisa de ração — mas porque entendeu o que o gesto queria dizer, e responder a um gesto é a única coisa que um gesto pede.',
    'Quando termina, ele levanta voo e volta pra borda do outro lado, e o rastro de calor passa a dois metros de você e não te queima.',
    'Isso foi escolha dele e foi precisa, e é a coisa mais assustadora do dia: ele controla até o ponto de não te queimar a dois metros.'
  ],
  ef:{executar:d=>{ Estado.usarItem('Ração'); const L = Estado.lend(146); L.disposicao = 'passivo'; return [{tipo:'mundo', texto:'Moltres aceitou o que você ofereceu.'}]; },
      rep:{eixo:'bom',delta:3,motivo:'Tratou bem uma Ave Lendária'},
      moral:10,
      flag:'moltres_amigo', registrar:'Moltres aceitou comida de você e ficou passivo.'},
  escolhas:[
    {texto:'Procurar sinal de quem esteve aqui.', vai:'c14_procurou_sinal', cond:d=>(!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu) && !Historia.jaAconteceu('c14_procurou_sinal')},
    {texto:'Ficar parad{o|a} e olhar.', vai:'c14_olhar', cond:c14_moltresAli},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Jogar a Pokébola mesmo assim.', vai:'c14_luta_moltres', cond:c14_moltresAli}
  ]
},

c14_luta_moltres:{
  repetivel:true,
  texto:[
    d=>(d.flags.c14_ataques || 0) > 1 ? 'Você joga outra Pokébola.' : 'Você joga a primeira Pokébola sem nem tentar enfraquecer.',
    'A Pokébola derrete no ar antes de chegar. Literalmente derrete: o plástico deforma a meio metro dele e cai no chão como uma gota.',
    'Moltres desce da borda e a cratera inteira fica dez graus mais quente, e o ar fica com aquela densidade de forno aberto.',
    'E você entende, tarde, que a coisa não estava te ameaçando em nenhum momento antes desse.'
  ],
  ef:{executar:d=>{ const L = Estado.lend(146); L.ataquesSofridos++; Estado.marcar('c14_ataques', (d.flags.c14_ataques || 0) + 1); return []; },
      moral:-10},
  batalha:{dex:146, nivel:50, tipo:'lendario', fuga:true, ambiente:'vulcao',
           vitoria:'c14_pos_moltres', derrota:'c14_pos_moltres', fuga2:'c14_pos_moltres',
           captura:'c14_capturou_moltres', gameover:'gameover'}
},

c14_pos_moltres:{
  repetivel:true,
  texto:[
    'Acabe como acabar, uma coisa fica:',
    'ele viu o seu rosto enquanto você tentava.',
    'Quando o calor baixa, a borda do outro lado está vazia.',
    'Ele olhou pra você um segundo a mais do que precisava, antes de ir.'
  ],
  ef:{executar:d=>{
        Estado.marcar('c14_moltres_foi');
        const L = Estado.lend(146);
        if (L.ataquesSofridos >= 2){ L.disposicao = 'hostil'; return [{tipo:'perigo', texto:'Moltres te marcou. O calor vai te seguir.'}]; }
        return [{tipo:'mundo', texto:'Moltres foi embora. Desconfiado.'}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou uma Ave Lendária'}},
  escolhas:[
    {texto:'Procurar sinal de quem esteve aqui.', vai:'c14_procurou_sinal', cond:d=>(!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu) && !Historia.jaAconteceu('c14_procurou_sinal')},
    {texto:'Descer o vulcão.', vai:'c14_desceu'}
  ]
},

c14_capturou_moltres:{
  repetivel:true,
  texto:[
    'A Pokébola fecha.',
    'E o vulcão fica em silêncio de um jeito que vulcão não fica.',
    'As fumarolas param. As três que estavam soltando vapor a trinta metros de você param ao mesmo tempo, e o chão para de fazer aquele ruído contínuo de coisa muito grande respirando devagar.',
    'Você segura na mão uma coisa que existia antes de Kanto ter nome.',
    'E o vento muda. Vinha do mar, e agora vem do norte, frio, e você está na boca de um vulcão.'
  ],
  ef:{instabilidade:3, flag:'capturou_moltres', moral:-10,
      registrar:'Capturou Moltres na cratera de Cinnabar. As fumarolas pararam.',
      presagio:'As fumarolas pararam todas ao mesmo tempo, como quem prende a respiração.'},
  escolhas:[
    {texto:'Soltar. Agora, antes de descer.', vai:'c14_soltou_moltres'},
    {texto:'Descer com ele.', vai:'c14_desceu', ef:{flag:'desceu_com_moltres', rep:{eixo:'ruim',delta:2,motivo:'Desceu o vulcão com uma Ave Lendária na mochila'}}},
    {texto:'Procurar sinal de quem esteve aqui antes de descer.', vai:'c14_procurou_sinal', cond:d=>(!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu) && !Historia.jaAconteceu('c14_procurou_sinal')}
  ]
},

c14_soltou_moltres:{
  repetivel:true,
  texto:[
    'Você abre a Pokébola na mesma pedra onde ele estava.',
    'Ele sai e não vai embora na hora. Fica na pedra, no mesmo lugar, na mesma posição, como se nada tivesse acontecido — e as fumarolas voltam a soltar vapor em menos de um minuto, uma por uma.',
    'E depois ele vira a cabeça e olha você.',
    'E é um olhar diferente do de antes, e você não sabe dizer se o que mudou foi pra melhor ou pra pior.'
  ],
  ef:{flag:'soltou_moltres', limpaFlag:'capturou_moltres',
      executar:d=>{
        const p = [...d.time, ...d.pc].find(x=>x.dex===146);
        if (p) return Captura.soltar(p).map(e=>({tipo:e.tipo, texto:e.texto}));
        return [];
      },
      rep:{eixo:'bom',delta:3,motivo:'Soltou um lendário antes de descer com ele'},
      moral:10, instabilidade:-1,
      registrar:'Soltou Moltres na cratera. As fumarolas voltaram.'},
  escolhas:[
    {texto:'Ficar parad{o|a} e olhar.', vai:'c14_olhar', cond:c14_moltresAli},
    {texto:'Procurar sinal de quem esteve aqui.', vai:'c14_procurou_sinal', cond:d=>(!!d.flags.sabe_que_subiram || !!d.flags.fuji_saiu) && !Historia.jaAconteceu('c14_procurou_sinal')},
    {texto:'Descer.', vai:'c14_desceu'},
    {texto:'Oferecer comida.', vai:'c14_comida', cond:d=>c14_moltresAli(d) && Estado.contaItem('Ração')>0 && !Historia.jaAconteceu('c14_comida')}
  ]
},

c14_desceu:{
  repetivel:true,
  texto:[
    'Você desce.',
    'Leva três horas e quarenta.',
    d=>d.flags.c14_desceu_com_blaine
      ? 'Blaine desce do lado, devagar, e não fala nada nas três horas e quarenta, e nos últimos quatrocentos metros ele aceita apoio no seu ombro pela primeira vez.'
      : d.flags.capturou_moltres ? 'A Pokébola na sua cintura fica quente a descida inteira.'
      : 'Você não sabe direito o que sentiu lá em cima, e a descida não ajuda.',
    'Lá embaixo, a ilha continua: setecentas pessoas, uma rua, um ferry duas vezes por semana.'
  ],
  ef:{flag:'desceu_o_vulcao',
      executar:d=>{
        Estado.marcar('c14_desceu_com_blaine', c14_blaineNaCratera(d));
        Estado.marcar('c14_blaine_na_cratera', false);
        Relogio.avancar(4);
        return [];
      }},
  escolhas:[
    {texto:'Ir pro porto esperar o ferry.', vai:'c14_fim'},
    {texto:'Ir ao ginásio.', vai:'c14_ginasio'},
    {texto:'Ir ao laboratório queimado.', vai:'c14_lab'},
    {texto:'Voltar pra rua principal.', vai:'c14_cidade'},
    {texto:'Subir de novo amanhã cedo.', vai:'c14_vulcao', ef:{executar:()=>{ Relogio.amanhaAs(5); return []; }}}
  ]
},

/* ─────────────── O FERRY DE VOLTA ─────────────── */

c14_fim:{
  falante:'o homem de terno escuro',
  vozes:['N','N'],
  texto:[
    ()=>`No porto, o ferry de ${Calendario.hoje().semana} está atrasado quarenta minutos e tem um homem de terno escuro sentado no banco de espera.`,
    'Só ele, e você, e o mar.',
    d=>d.flags.quatro_entraram_tres_sairam ? 'Na porta da capitania, o Marlow levanta os olhos do livro de bordo, olha o homem, olha você, e volta pro livro com a caneta na mão.' : '',
    'Ele não olha pra você quando fala.',
    d=>{
      if (d.flags.tem_o_caderno_sete || d.flags.pegou_caderno) return '"Esse caderno não é seu." Ele levanta quando o barco chega. "Mas também não é meu, e a diferença entre as duas frases é a única coisa que eu não consigo resolver por telefone. Boa leitura."';
      if (d.flags.queimou_caderno) return '"Obrigado." Ele levanta quando o barco chega. "Sério. Você me poupou uma viagem e um relatório."';
      if (d.flags.vai_entregar_a_prado || d.flags.vai_entregar_comissao || d.flags.ivone_tem_cinnabar) return '"Incorporação de acervo." Ele levanta quando o barco chega. "Esse é um caminho que o jurídico não previu, e eu trabalho lá há nove anos, e eu queria dizer que é elegante."';
      if (Estado.lendariosCapturados().length) return '"Tem gente que gostaria de conversar com você sobre o que você leva na cintura. Não hoje." Ele levanta quando o barco chega. "Só queria que você soubesse que a gente sabe."';
      if (d.flags.achou_moltres) return '"Você subiu o vulcão." Ele levanta quando o barco chega. "Pouca gente sobe o vulcão e desce igual."';
      return '"Você fez muita pergunta numa ilha pequena." Ele levanta quando o barco chega. "Ilha pequena responde."';
    },
    'Ele embarca primeiro.',
    'No barco inteiro, que leva duas horas e quarenta até Fuchsia, ele não senta perto de você nenhuma vez, e desce primeiro, e some na rua do cais sem olhar pra trás.',
    d=>{
      if (d.flags.blaine_pode_parar) return 'E em Cinnabar, atrás de você, tem um homem de setenta e dois anos que hoje pode dormir.';
      if (d.flags.fuji_virou_professor) return 'E na sala de memória de uma escola de noventa e um alunos, numa vitrine com um remo e uma pedra-pomes, tem uma mochila de lona com uma etiqueta que diz Prof.';
      if (d.flags.queimou_caderno && d.flags.conheceu_blaine) return 'E em Cinnabar, atrás de você, tem um homem de setenta e dois anos que subiu quarenta metros de corredor sozinho e não olhou pra trás.';
      if (d.flags.blaine_aliado) return 'E em Cinnabar, atrás de você, tem cinco caixas de arquivo que vão sair da ilha, desta vez pela porta.';
      if (d.flags.blaine_lavou_a_xicara) return 'E em Cinnabar, atrás de você, tem uma xícara lavada, virada no escorredor de uma casa que ficou quatro anos fechada.';
      if (d.flags.entrou_na_casa_do_fuji && !d.flags.tem_o_jornal) return 'E em Cinnabar, atrás de você, tem uma casa com uma xícara na pia e um jornal aberto na página seis.';
      if (d.flags.entrou_na_casa_do_fuji) return 'E em Cinnabar, atrás de você, tem uma casa com uma xícara na pia e uma mesa sem o jornal.';
      return 'E atrás de você fica uma ilha de setecentas pessoas que conhece todos os motores, e agora conhece você.';
    },
    'O mar entre Cinnabar e o continente é o trecho mais fundo de Kanto.',
    'Você fica na popa olhando a ilha diminuir, e o vulcão é a última coisa a sumir, porque é a coisa mais alta.'
  ],
  /* o ferry sai às onze, terça ou sábado, e chega em Fuchsia três horas depois */
  ef:{executar:()=>{ c14_irAoFerry(11); Relogio.avancar(3); return []; }},
  sai:'fuchsia',
  fim:true, resumo:'Capítulo 14 concluído — você leu o que ninguém devia ter escrito, e devolveu o que ninguém devia ter levado.'

},

/* ─────────────── O QUE A SRA. WILMA VIU ─────────────── */

c14_viu_o_tanque:{
  falante:'Sra. Wilma',
  vozes:['P','N','P','N','N','P','N','N','N','P','N','N','P','N','N'],
  texto:[
    '"A senhora chegou a ver o que tinha no tanque?"',
    'Ela bebe o café até o fim antes de responder, e devolve a xícara por cima do muro.',
    '"Uma vez."',
    '"Uma vez?"',
    '"Em noventa e cinco, num sábado, porque a porta ficou aberta e eu passei pra pegar o carrinho de limpeza que o menino tinha deixado lá dentro."',
    'Ela ajeita o portão que não abre.',
    '"Eu olhei porque qualquer pessoa olha, meu bem. Não adianta ninguém dizer que não ia olhar."',
    '"E?"',
    '"E tinha uma criança grande dentro de um vidro com água."',
    'Ela corrige.',
    '"Não era criança. Eu sei que não era criança. Mas era do tamanho de uma criança grande e tava com as mãos no vidro."',
    'Pausa.',
    '"E olhou pra mim."',
    '"E a senhora fez o quê?"',
    '"Eu acenei."',
    'Ela dá de ombros com uma vergonha enorme.',
    '"Eu acenei, meu bem. Eu tenho três filhos. Eu vi uma coisa do tamanho de uma criança grande olhando pra mim por um vidro e eu acenei antes de pensar."',
    '"E ele?"',
    '"Tirou uma mão do vidro e mexeu."',
    'Ela olha o chão.',
    '"E eu peguei o carrinho e saí, e eu nunca mais entrei naquele corredor, e faz cinco anos que eu acordo com isso umas duas vezes por mês."'
  ],
  ef:{flag:['selma_acenou','ouviu_historia_lab'],
      npc:c14_npc('Sra. Wilma', 6, 'Acenou para o que estava no tanque, por um vidro, em 1995, e ele acenou de volta. Acorda com isso duas vezes por mês.'),
      rep:{eixo:'bom',delta:4,motivo:'Perguntou se ela tinha visto'},
      moral:-15,
      registrar:'Sra. Wilma acenou para o que estava no tanque em 1995, e ele acenou de volta.',
      presagio:'Ela acenou antes de pensar. E ele mexeu a mão de volta.'},
  escolhas:[
    {texto:'"O senhor Fuji morreu?"', vai:'c14_fuji_morreu', cond:c14_nova('c14_fuji_morreu')},
    {texto:'"E o incêndio de semana passada?"', vai:'c14_incendio_da_semana', cond:c14_nova('c14_incendio_da_semana')},
    {texto:'"A senhora contou isso pra alguém?"', vai:'c14_selma_contou'},
    {texto:'Agradecer e ir ao laboratório.', vai:'c14_lab'}
  ]
},

c14_selma_contou:{
  falante:'Sra. Wilma',
  vozes:['P','N','P','N','N','P','N','N','N','P','N','P','N','N'],
  texto:[
    '"A senhora contou isso pra alguém?"',
    '"Contei pro meu marido em noventa e cinco e ele disse que eu tinha visto errado."',
    '"E depois?"',
    '"E depois pra mais ninguém, porque contar uma coisa dessas duas vezes e ouvir duas vezes que eu vi errado ia ser demais."',
    'Ela pega a xícara de volta e segura com as duas mãos.',
    '"Você é {o segundo|a segunda}."',
    '"{Segundo|Segunda}?"',
    '"O primeiro foi o Doutor Burke, em noventa e sete."',
    '"O do ginásio. Blaine, como chamam os de fora."',
    'Ela olha a rua.',
    '"Ele bateu aqui uma noite, sentou nesse degrau, e ficou umas duas horas me perguntando se eu tinha visto alguma coisa em todos aqueles anos de limpeza."',
    '"E a senhora contou?"',
    '"Contei."',
    '"E ele disse o quê?"',
    'Ela demora.',
    '"Ele chorou, meu bem. Um homem de setenta anos sentado no meu degrau."',
    '"E depois ele disse: “então ele conhecia mais gente do que a gente achava”."'
  ],
  ef:{flag:['selma_e_blaine','sabe_do_blaine'],
      npc:c14_npc('Sra. Wilma', 8, 'Contou ao Blaine em 1997 sobre o aceno, e ele chorou no degrau dela.'),
      rep:{eixo:'bom',delta:4,motivo:'Perguntou se ela tinha contado'},
      moral:-8,
      registrar:'Blaine ouviu da Sra. Wilma, em 1997, sobre o aceno. "Então ele conhecia mais gente do que a gente achava."',
      presagio:'Ele conhecia mais gente do que a gente achava. Some as pessoas dessa ilha.'},
  escolhas:[
    {texto:'"O senhor Fuji morreu?"', vai:'c14_fuji_morreu', cond:c14_nova('c14_fuji_morreu')},
    {texto:'"E o incêndio de semana passada?"', vai:'c14_incendio_da_semana', cond:c14_nova('c14_incendio_da_semana')},
    {texto:'Ir procurar o Blaine.', vai:'c14_ginasio'},
    {texto:'Ir ao laboratório.', vai:'c14_lab'}
  ]
},

c14_incendio_da_semana:{
  falante:'Sra. Wilma',
  vozes:['P','N','P','N','N','P','N','P','N','N','N'],
  texto:[
    '"E o incêndio de semana passada?"',
    'Ela faz uma cara.',
    '"Ah, isso eu vi."',
    '"A senhora viu?"',
    '"Minha casa é essa aqui, meu bem. O prédio é ali, ó." Ela aponta e é mesmo: dá pra ver o muro do laboratório do portão dela. "Eu durmo mal e eu fico na janela."',
    '"Que horas?"',
    '"Três e pouco da manhã de sábado. Eram dois homens a pé, cada um com um galão."',
    '"E a senhora chamou o bombeiro?"',
    '"Cinnabar não tem bombeiro, meu bem. Tem uma brigada de sete voluntários e eu liguei pro Joel da brigada, e o Joel chegou em onze minutos, que é rápido."',
    'Ela ajeita a xícara.',
    '"E os dois homens já tinham ido embora, e o fogo já tava só na ala leste, e o Joel entrou e apagou em quarenta minutos com mangueira de jardim porque a ala leste é pequena."',
    'Ela olha pra você.',
    '"Eles não queriam queimar o prédio, meu bem. Eles queriam queimar uma sala."'
  ],
  ef:{flag:['selma_viu_o_incendio','sabe_que_foi_forjado'],
      npc:c14_npc('Sra. Wilma', 5, 'Viu os dois homens com dois galões às 3h de sábado, e chamou o Joel da brigada.'),
      rep:{eixo:'bom',delta:4,motivo:'Perguntou a quem mora do lado'},
      registrar:'Sra. Wilma viu dois homens com dois galões às 3h de sábado. O fogo foi contido em 40 minutos.',
      presagio:d=>d.flags.sabe_das_cinco ? 'Eles queriam queimar uma sala. E a sala não tinha o que eles procuravam.' : 'Eles queriam queimar uma sala.'},
  escolhas:[
    {texto:'Ir ao cais perguntar pelo barco deles.', vai:'c14_barco_fretado', cond:c14_nova('c14_barco_fretado')},
    {texto:'"O senhor Fuji morreu?"', vai:'c14_fuji_morreu', cond:c14_nova('c14_fuji_morreu')},
    {texto:'Ir ao laboratório ver a ala leste.', vai:'c14_lab'}
  ]

}

}}

);

/* Ir a um lugar não se gasta: as opções que levam à rua, ao portão da
   Sra. Wilma, à casa, à varanda, ao ginásio, ao laboratório e ao vulcão
   continuam na tela depois de usadas — quem chega de novo cai no
   reencontro (desvios). O desafio de quinta também se repete. */
(function(){
  const cap = CAPITULOS.find(c => c.num === 14);
  const LUGARES = ['c14_cidade', 'c14_selma', 'c14_casa_do_fuji', 'c14_blaine_na_varanda', 'c14_barco_fretado',
                   'c14_ginasio', 'c14_ginasio_por_dentro', 'c14_lab', 'c14_subsolo', 'c14_saida_lab',
                   'c14_vulcao', 'c14_procurou_sinal', 'c14_desceu', 'c14_desafio_blaine'];
  for (const cena of Object.values(cap.cenas))
    for (const e of (cena.escolhas || []))
      if (LUGARES.includes(e.vai) && e.repetivel === undefined) e.repetivel = true;
})();
