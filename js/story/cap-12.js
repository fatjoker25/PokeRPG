/* ------------------------------------------------------------
   ABERTURAS — Fuchsia vive de uma cerca. Quem chega pagando,
   quem chega sem os quinhentos, quem chega de excursão e quem
   chega com crachá veem lados diferentes dela.
   ------------------------------------------------------------ */
const C12_ABERTURAS = ['c12_fuchsia', 'c12_ab_ciclovia', 'c12_ab_excursao', 'c12_ab_sem_os_quinhentos', 'c12_ab_de_cracha'];
function c12_cabe(id, d){
  if (id === 'c12_ab_sem_os_quinhentos') return d.jogador.dinheiro < 500;
  if (id === 'c12_ab_de_cracha') return typeof Cargos !== 'undefined' && !!Cargos.doCracha();
  /* a excursão volta no ônibus das quatro */
  if (id === 'c12_ab_excursao') return c12_hora(d) < 14;
  return true;
}
function c12_abertura(d){
  /* toda abertura é de dia (a ciclovia, a padaria aberta, a bilheteria,
     o escritório): quem chega de noite dorme na pousada e começa às oito */
  if (d && d.relogio){ const h = c12_hora(d); if (h < 7 || h >= 17) Relogio.ate(8); }
  const cand = C12_ABERTURAS.filter(id => c12_cabe(id, d));
  return Dados.escolher(cand);
}

/* ------------------------------------------------------------
   O TEMPO EM FUCHSIA. A médica trabalha no setor 7 terça o dia
   inteiro e quinta de manhã; o ginásio abre quarta e sexta, das
   duas às seis; os guardas-parque bebem depois do turno das seis;
   a diretoria abre às oito; o setor 7 se visita no escuro. Quem
   chega fora da hora espera, e o relógio anda junto.
   ------------------------------------------------------------ */
function c12_hora(d){ sincronizarHora(d.relogio); return d.relogio.hora; }
function c12_deDia(d){ const h = c12_hora(d); return h >= 7 && h < 18; }
function c12_saudacao(d){ const h = c12_hora(d); return h >= 5 && h < 12 ? 'Bom dia' : h >= 12 && h < 18 ? 'Boa tarde' : 'Boa noite'; }
function c12_ginasioAberto(d){ const s = Calendario.hoje().semanaIdx, h = c12_hora(d); return (s === 2 || s === 4) && h >= 14 && h < 18; }
/* o próximo atendimento do ginásio, contado de hoje: s é o dia da semana, k quantos dias faltam */
function c12_proximoGinasio(d){
  const hoje = Calendario.hoje().semanaIdx, h = c12_hora(d);
  for (let k = 0; k < 8; k++){
    const s = (hoje + k) % 7;
    if ((s === 2 || s === 4) && (k > 0 || h < 14)) return {s, k};
  }
  return {s:2, k:7};
}
/* a médica: terça no setor 7 o dia inteiro, quinta de manhã; de noite ninguém atende */
function c12_esperaPia(d){
  let espera = null, h = c12_hora(d);
  if (h >= 21 || h < 7){ Relogio.ate(8); espera = 'noite'; }
  const s = Calendario.hoje().semanaIdx; h = c12_hora(d);
  if (s === 1 && h < 19){ Relogio.ate(19); espera = espera ? 'noite_terca' : 'terca'; }
  else if (s === 3 && h < 13){ Relogio.ate(13); espera = espera ? 'noite_quinta' : 'quinta'; }
  Estado.marcar('c12_espera_pia', espera || false);
}
function c12_linhaDaEspera(d){
  switch (d.flags.c12_espera_pia){
    case 'noite': return 'De noite a luz da casa está apagada e ninguém atende portão de médica. Você volta de manhã.';
    case 'terca': return 'A van branca não está na frente da casa: é terça. Você senta no meio-fio e espera, e ela volta com o céu escurecendo, às sete.';
    case 'noite_terca': return 'De noite ninguém atende, e de manhã a van já saiu: é terça. Ela só volta às sete da noite, e você espera.';
    case 'quinta': return 'A van branca não está na frente da casa: é quinta de manhã. Ela volta à uma da tarde, e você espera.';
    case 'noite_quinta': return 'De noite ninguém atende, e de manhã a van já saiu: é quinta. Ela volta à uma da tarde, e você espera.';
    default: return '';
  }
}
/* os guardas-parque bebem depois do turno, das seis da tarde até de madrugada */
function c12_esperaBar(d){
  const h = c12_hora(d), espera = h >= 4 && h < 18;
  if (espera) Relogio.ate(19);
  Estado.marcar('c12_espera_bar', espera);
}
/* a diretoria abre às oito e fecha às seis */
function c12_esperaExpediente(d){
  const h = c12_hora(d);
  const espera = h >= 18 || h < 5 ? 'noite' : h < 8 ? 'cedo' : false;
  if (espera) Relogio.ate(8);
  Estado.marcar('c12_espera_diretor', espera);
}
function c12_linhaDoExpediente(d){
  return d.flags.c12_espera_diretor === 'noite' ? 'A diretoria fecha às seis. Você volta de manhã, às oito, quando a secretária abre a porta.'
       : d.flags.c12_espera_diretor === 'cedo' ? 'A diretoria só abre às oito. Você espera no banco do corredor.' : '';
}
/* o passeio guiado sai das nove às três */
function c12_esperaPasseio(d){
  const h = c12_hora(d);
  const espera = h >= 16 ? 'tarde' : h < 8 ? 'cedo' : false;
  if (espera) Relogio.ate(9);
  Estado.marcar('c12_espera_passeio', espera);
}
/* o setor 7 de perto, só no escuro */
function c12_esperaEscuro(d){
  const h = c12_hora(d), espera = h >= 6 && h < 19;
  if (espera) Relogio.ate(20);
  Estado.marcar('c12_esperou_escurecer', espera);
}

/* a reunião extraordinária do conselho: onze dias da convocação, por regimento */
function c12_convocar(d){ if (d.flags.c12_convocou == null) Estado.marcar('c12_convocou', d.relogio.dia); }
function c12_diasPraReuniao(d){
  if (d.flags.c12_convocou == null) return 11;
  return Math.max(1, 11 - (d.relogio.dia - d.flags.c12_convocou));
}
function c12_dias(n){ return n === 1 ? 'um dia' : porExtenso(n) + ' dias'; }
function c12_Dias(n){ const t = c12_dias(n); return t.charAt(0).toUpperCase() + t.slice(1); }
function c12_emDias(n){ return n === 1 ? 'amanhã' : 'em ' + c12_dias(n); }

/* o que o jogador já viu e ouviu: a cena não supõe mais do que isso */
function c12_sabeDoSete(d){
  const f = d.flags;
  return !!(f.viu_o_setor_sete || f.o_setor_sete_nao_existe_no_mapa || f.sabe_do_setor7
    || (Historia.jaAconteceu('c12_fuchsia') && ['mercenario','foragido','pesquisador'].includes(Historia.via())));
}
/* o Armazém Geral 7, em Celadon, no capítulo 9 */
function c12_viuOGalpao(d){ const f = d.flags; return !!(f.viu_o_alvara || f.chegou_no_armazem || f.dentro_do_deposito); }
/* o curral já foi esvaziado: soltura, porta aberta ou barreira da Liga */
function c12_esvaziado(d){ return !!d.flags.esvaziou_o_setor7; }
function c12_contouGaiolas(d){ const f = d.flags; return !!(f.contou_gaiolas || f.dentro_do_deposito); }
function c12_perguntaDoSete(d){ return c12_sabeDoSete(d) ? 'Me fala do setor 7.' : 'Tem algum pedaço da reserva onde você nunca entrou?'; }

/* o que você pergunta ao diretor depende do que você viu antes de entrar */
function c12_perguntaAoDiretor(d){
  const f = d.flags;
  if (f.c12_perguntou_do_sete) return 'a sua pergunta sobre o setor 7';
  if (f.o_galpao_do_setor_sete) return 'a sua pergunta sobre o galpão de telha que dá pra ver do banco de fora';
  if (f.viu_o_trilho) return 'a sua pergunta sobre o trilho de carga da trilha lateral';
  if (f.quatrocentos_e_doze) return 'a sua pergunta sobre os quatrocentos e doze da auditoria';
  if (f.a_terceira_regra || f.a_regra_veio_num_comunicado) return 'a sua pergunta sobre os setores fechados';
  if (f.ouviu_manejo) return 'a sua pergunta sobre o manejo';
  if (Historia.via() === 'heroi' && Historia.jaAconteceu('c12_fuchsia')) return 'a sua pergunta sobre os brincos amarelos';
  return 'a sua pergunta sobre o que a reserva não mostra';
}

/* o guarda-parque mais velho só é o Kell depois que alguém chama ele pelo nome */
function c12_kell(d){ return typeof Nomes !== 'undefined' && Nomes.sabe('o guarda-parque mais velho') ? 'o guarda Kell' : 'o guarda mais velho do bar'; }
function c12_horas(n){ return n === 1 ? 'uma hora' : n === 2 ? 'duas horas' : porExtenso(n) + ' horas'; }
function c12_lista(t){ return t.length === 1 ? t[0] : t.slice(0, -1).join(', ') + ' e ' + t[t.length - 1]; }

/* a edição do jornal de Fuchsia sai com o número que você levou */
function c12_edicao(d){
  const f = d.flags;
  if (f.provou_o_erro) return {
    oque: f.sabe_da_linha_verde ? 'o mapa fundiário e a área de setenta e um' : 'a área de setenta e um',
    titulo: 'A CONTA ESTÁ ERRADA DESDE 1985',
    quadro: (f.sabe_da_linha_verde ? 'o mapa fundiário reproduzido em meia página e ' : '') + 'um quadro comparativo de duas colunas: ÁREA DE REFERÊNCIA — 8.160 ha / ÁREA REAL — 9.000 ha',
    assunto: 'hectare', leitura: 'o quadro comparativo'};
  if (f.tem_as_vias) return {
    oque: 'a conta das vias amarelas',
    titulo: 'OITENTA POR TERÇA',
    quadro: 'a conta das vias amarelas em duas colunas: APROVADO PELO CONSELHO — 240 / SAÍDO NA PRÁTICA — 4.160',
    assunto: 'multiplicação', leitura: 'a conta'};
  if (f.sabe_da_linha_verde) return {
    oque: 'o mapa fundiário',
    titulo: 'QUATRO FAZENDAS, UM DONO',
    quadro: 'o mapa fundiário reproduzido em meia página, com as quatro fazendas pintadas de preto',
    assunto: 'cerca e escritura', leitura: 'o mapa'};
  return {
    oque: 'o que o material tem de número',
    titulo: 'O QUE SAI DA CERCA',
    quadro: 'a foto da cerca tirada da estrada e os números da reserva numa coluna só',
    assunto: 'a cerca', leitura: 'a coluna de números'};
}

/* a pilha: o que o jogador tem na mão e é documento */
function c12_pilha(d){
  const f = d.flags, t = [];
  if (f.tem_as_vias) t.push('cento e doze vias amarelas');
  if (f.tem_a_ficha_tecnica) t.push('a ficha técnica com o timbre do receptor');
  if (Estado.contaItem('Anexo técnico do relatório') > 0) t.push('o anexo com a área de 1971');
  if (f.tem_o_relatorio) t.push('o relatório de manejo amarrado com o barbante do Koga');
  if (f.pasta_do_diretor) t.push('dezenove anos de ofícios');
  if (f.tem_os_vinculos) t.push('doze folhas de vínculos escritas à mão');
  if (f.sabe_da_linha_verde) t.push('o mapa fundiário');
  if (f.ligou_fuchsia_celadon) t.push('a ata da 41ª reunião');
  if (f.tem_os_relatorios_da_nishino) t.push('três relatórios de auditoria arquivados');
  if (f.tem_a_caderneta_do_binoculo) t.push('a caderneta com quatro anos de caminhões');
  if (f.fotos_do_setor7) t.push('vinte e uma fotos do setor 7');
  if (f.viu_a_transferencia) t.push('nove fotos de uma transferência de carga num posto fechado');
  if (f.tem_foto_da_doacao) t.push('a foto da nota de doação do asfalto');
  if (f.placa_do_caminhao_zona) t.push('a placa e o pneu de um caminhão baú, anotados de madrugada');
  return t;
}

/* ============================================================
   CAPÍTULO 12 — NOVE MIL HECTARES  (Fuchsia / Zona Safári)
   ============================================================ */
CAPITULOS.push(
{
num:12, titulo:'Nove Mil Hectares', local:'Fuchsia / Zona Safári', ambiente:'campo', nivelArea:38,
tom:'muito sombrio', entradas:C12_ABERTURAS,
inicio: d => c12_abertura(d),
/* voltar a quem você já conheceu não repete o primeiro encontro */
desvios:{
  c12_koga:    {se:d => Historia.jaAconteceu('c12_koga')    && d.cena !== 'c12_koga',    vai:'c12_koga_de_novo'},
  c12_yara:    {se:d => Historia.jaAconteceu('c12_yara')    && d.cena !== 'c12_yara',    vai:'c12_pia_de_novo'},
  c12_diretor: {se:d => Historia.jaAconteceu('c12_diretor') && d.cena !== 'c12_diretor', vai:'c12_diretor_de_novo'},
  c12_bar:     {se:d => Historia.jaAconteceu('c12_bar')     && d.cena !== 'c12_bar',     vai:'c12_bar_de_novo'},
  c12_marido:  {se:d => Historia.jaAconteceu('c12_marido')  && d.cena !== 'c12_marido',  vai:'c12_zane_de_novo'},
  c12_setor7:  {se:d => Historia.jaAconteceu('c12_setor7')  && d.cena !== 'c12_setor7',  vai:'c12_setor7_de_novo'}
},
cenas:{

c12_ab_ciclovia:{
  texto:[
    'A ciclovia da Rota 17 é a obra pública mais bonita de Kanto e a mais inútil: dezenove quilômetros de asfalto liso descendo um morro, com guarda-corpo dos dois lados, e nenhuma cidade no fim que precise dela.',
    'Você desce a pé porque não tem bicicleta, e descer dezenove quilômetros a pé num asfalto feito pra bicicleta é uma humilhação lenta.',
    'Passam por você catorze ciclistas. Onze são turistas de capacete colorido. Três não são.',
    'Os três não usam capacete, vão em fila, e o terceiro leva uma caixa térmica amarrada no bagageiro com extensor elástico.',
    'Caixa térmica branca, sem identificação, do tamanho de uma caixa de feira.',
    'Eles não desaceleram pra te ultrapassar. Um dos três olha pra você de cima a baixo sem virar a cabeça.',
    'No fim da descida, Fuchsia aparece de uma vez, e a cerca da Zona Safári aparece junto: alambrado de três metros que sai da cidade e some na curva do horizonte.'
  ],
  ef:{flag:'os_tres_da_caixa_termica',
      registrar:'Três ciclistas sem capacete desceram a Rota 17 com uma caixa térmica branca no bagageiro.'},
  escolhas:[
    {texto:'Tentar ver onde os três pararam.', vai:'c12_ab_onde_pararam'},
    {texto:'Ir direto à recepção da Zona Safári.', vai:'c12_fuchsia'},
    {texto:'Andar pela cidade primeiro.', vai:'c12_cidade'},
    {texto:'Ir ao bar. É onde se sabe das coisas.', vai:'c12_bar'}
  ]
},

c12_ab_onde_pararam:{
  texto:[
    'Você apressa o passo nos últimos dois quilômetros, o que não adianta nada contra bicicleta, e chega na cidade quinze minutos depois deles.',
    'As três bicicletas estão encostadas numa parede na lateral de um prédio baixo da avenida principal.',
    'O prédio é uma padaria. Tem cheiro de pão saindo e tem uma placa de "ABERTO" virada pro certo.',
    'Três homens de bicicleta com uma caixa térmica entraram numa padaria e as bicicletas estão do lado de fora e a caixa térmica não está.',
    'Você fica olhando a padaria por uns quatro minutos e uma senhora sai de lá com um saco de pão e um cumprimento pro balconista, e é a coisa mais normal que existe.'
  ],
  ef:{flag:'a_padaria_da_avenida',
      registrar:'Os três da caixa térmica entraram numa padaria da avenida principal de Fuchsia. Saíram sem a caixa.'},
  escolhas:[
    {texto:'Entrar na padaria.', vai:'c12_manejo_padaria'},
    {texto:'Não entrar ainda. Ir à recepção da Zona Safári.', vai:'c12_fuchsia'},
    {texto:'Ir ao bar perguntar sobre a padaria.', vai:'c12_bar'}
  ]
},

c12_ab_excursao:{
  texto:[
    'Você chega na recepção da Zona Safári exatamente junto com um ônibus escolar, o que é a pior sorte possível e a melhor cobertura possível.',
    'Quarenta e dois alunos de uns onze anos, quatro professores e um guia com colete verde e um megafone que ele não precisa usar e usa.',
    fala('o guia do colete verde', 'Turma! Turma! Regra número um da Zona Safári!'),
    'Quarenta e duas vozes, sem entusiasmo nenhum, decoradas de alguma aula anterior:',
    fala('a turma', 'Não passar da faixa amarela.'),
    fala('o guia do colete verde', 'Regra número dois!'),
    fala('a turma', 'Não alimentar.'),
    fala('o guia do colete verde', 'Regra número três!'),
    'Silêncio. Ninguém sabe a três.',
    fala('o guia do colete verde', 'Não fotografar os setores fechados.'),
    'Ele fala a três no tom exato das outras duas, o que é como se esconde uma regra no meio de duas normais.',
    'Um aluno do fundo pergunta o que é setor fechado e o guia já está falando de outra coisa.'
  ],
  ef:{flag:'a_terceira_regra',
      registrar:'A terceira regra da Zona Safári é não fotografar os setores fechados.',
      presagio:'Uma reserva que proíbe foto de parte de si mesma tem parte de si mesma que não é reserva.'},
  escolhas:[
    {texto:'Entrar junto com a excursão.', vai:'c12_ab_com_a_turma', cond:d=>d.jogador.dinheiro >= 500},
    {texto:'Perguntar ao guia o que é setor fechado.', vai:'c12_ab_perguntou_o_setor'},
    {texto:'Deixar a turma entrar e fazer do seu jeito.', vai:'c12_fuchsia'}
  ]
},

c12_ab_perguntou_o_setor:{
  texto:[
    'Você espera a turma passar pela catraca e pergunta pro guia quando ele está sozinho, enrolando o fio do megafone.',
    d=>fala(d.jogador.nome, 'O que é setor fechado?'),
    'Ele responde sem hesitar, porque a resposta é oficial e ele a decorou:',
    fala('o guia do colete verde', 'Áreas em recuperação ambiental. Reflorestamento, ninhal, coisas assim. Fecha por temporada.'),
    d=>fala(d.jogador.nome, 'E por que não pode fotografar área em recuperação?'),
    'Aí ele hesita, e a hesitação dura um segundo e meio.',
    fala('o guia do colete verde', 'Porque flash estressa.'),
    d=>fala(d.jogador.nome, 'Eu não falei em flash.'),
    'Ele enrola o resto do fio do megafone e olha pra catraca, onde a turma dele está indo embora sem ele.',
    fala('o guia do colete verde', 'Olha, eu trabalho aqui há dois anos e essa regra veio num comunicado.', 'baixo'),
    fala('o guia do colete verde', 'Eu não escrevi ela. Eu só falo ela.')
  ],
  ef:{flag:'a_regra_veio_num_comunicado',
      npc:{nome:'o guia do colete verde', opiniao:0, viuVoce:'Você pegou ele numa resposta decorada.'},
      registrar:'A proibição de fotografar setores fechados chegou por comunicado. O guia não sabe de quem.'},
  escolhas:[
    {texto:'Entrar junto com a excursão.', vai:'c12_ab_com_a_turma', cond:d=>d.jogador.dinheiro >= 500},
    {texto:'Procurar o diretor da reserva.', vai:'c12_diretor'},
    {texto:'Ir andar pela cerca por fora.', vai:'c12_cerca'}
  ]
},

c12_ab_com_a_turma:{
  texto:[
    'Você paga a entrada e entra colad{o|a} na excursão, e ninguém pergunta nada, porque uma pessoa a mais em quarenta e sete é invisível.',
    'O passeio guiado dura meia hora e é honestamente bom. Tem um Nidoran fêmea a doze metros da trilha que não liga pra quarenta e sete pessoas, e quarenta e sete pessoas ficam em silêncio ao mesmo tempo, o que é bonito.',
    'Na volta, a trilha passa por uma bifurcação com uma corrente de ferro atravessada e uma placa de madeira: SETOR 7 — ACESSO TÉCNICO.',
    'A trilha do setor 7 é de terra batida e tem marca de pneu. Pneu largo, de veículo pesado, fresco.',
    'Uma reserva em recuperação ambiental não recebe caminhão.',
    'Você olha pro guia. O guia está olhando pro lado oposto com muita atenção pra uma árvore que não tem nada de especial.'
  ],
  ef:{dinheiro:-500, flag:['viu_o_setor_sete','sabe_do_lote_unico'],
      registrar:'A trilha do Setor 7 da Zona Safári tem marca fresca de pneu de veículo pesado.',
      presagio:'O guia olhou pro outro lado na hora exata. Ele sabe onde não olhar.'},
  escolhas:[
    {texto:'Perguntar ao guia na frente da turma.', vai:'c12_ab_na_frente_da_turma'},
    {texto:'Não falar nada e voltar sozinh{o|a} depois.', vai:'c12_cerca'},
    {texto:'Procurar o diretor da reserva.', vai:'c12_diretor'}
  ]
},

c12_ab_na_frente_da_turma:{
  texto:[
    d=>fala(d.jogador.nome, 'Por que tem marca de caminhão numa área em recuperação?'),
    'Você fala alto. Quarenta e dois alunos de onze anos viram ao mesmo tempo, o que é o som de quarenta e duas mochilas.',
    'O guia sorri com a boca.',
    fala('o guia do colete verde', 'Manutenção, {meu amigo|minha amiga}. Tem que levar muda, tem que levar cerca.'),
    'Uma menina do meio da turma, sem levantar a mão:',
    fala('a aluna', 'Mas a marca tá pra dentro e não tem marca voltando.'),
    'Silêncio geral.',
    'Ela tem onze anos e acabou de ver uma coisa que o guia passou dois anos sem ver, ou vendo.',
    fala('o guia do colete verde', 'Vamos, turma. Ônibus às quatro.', 'frio')
  ],
  ef:{flag:'a_menina_da_excursao', moral:1,
      registrar:'Uma aluna de onze anos reparou que a marca de pneu entra no Setor 7 e não volta.',
      presagio:'A marca entra e não sai. Ou o caminhão está lá dentro, ou tem outra saída.'},
  escolhas:[
    {texto:'Procurar o diretor da reserva.', vai:'c12_diretor'},
    {texto:'Andar a cerca por fora e achar a outra saída.', vai:'c12_cerca'},
    {texto:'Ir ao bar da cidade.', vai:'c12_bar'}
  ]
},

c12_ab_sem_os_quinhentos:{
  texto:[
    'A recepção da Zona Safári tem uma catraca, uma bilheteria e um painel de preço em letra grande, e o preço é quinhentos.',
    d=>`Você tem ${Number(d.jogador.dinheiro).toLocaleString('pt-BR')} ₽.`,
    'Você fica na frente do painel o tempo suficiente pra a moça da bilheteria entender, e ela entende, e faz uma coisa gentil: olha pro lado e finge conferir uma papelada.',
    'Do lado de fora tem um banco de concreto de frente pra cerca, e nesse banco tem um homem de uns quarenta anos com um binóculo velho pendurado no pescoço.',
    'O binóculo tem uma fita de lona com o nome gravado a fogo, do jeito que se marcava ferramenta de trabalho: IVO.',
    fala('Ivo', 'Também não vai pagar?'),
    d=>fala(d.jogador.nome, 'Também não vou pagar.'),
    fala('Ivo', 'Senta. Daqui dá pra ver quase a mesma coisa.'),
    'Ele empresta o binóculo sem você pedir, o que é o gesto mais direto que alguém fez com você hoje.'
  ],
  ef:{flag:'o_banco_da_cerca',
      npc:{nome:'Ivo', opiniao:1, viuVoce:'Te emprestou o binóculo no banco em frente à cerca.'},
      registrar:'Não pagou a entrada da Zona Safári. Ficou no banco de fora, com um binóculo emprestado.'},
  escolhas:[
    {texto:'Olhar a reserva pelo binóculo.', vai:'c12_ab_pelo_binoculo'},
    {texto:'Perguntar há quanto tempo ele senta aqui.', vai:'c12_ab_quanto_tempo_ele_senta'},
    {texto:'Agradecer e ir andar a cerca por fora.', vai:'c12_cerca'}
  ]
},

c12_ab_pelo_binoculo:{
  texto:[
    'O binóculo é velho, de metal, pesado, com a pintura descascada, e a lente é absurdamente boa.',
    'Você vê, a uns oitocentos metros: capim alto, três Nidorino parados, uma árvore caída que virou passagem.',
    'E, mais à direita, uma estrutura que não é natureza: um galpão comprido de telha metálica com quatro veículos estacionados do lado.',
    d=>{ const s = Calendario.hoje().semanaIdx;
         return `Quatro veículos ${s >= 5 ? 'num ' + Calendario.SEMANA[s] : 'numa ' + Calendario.SEMANA[s] + '-feira'}, numa área em recuperação ambiental.`; },
    fala('Ivo', 'Achou o galpão.'),
    'Ele não pergunta. Constata.',
    fala('Ivo', 'Todo mundo que pega esse binóculo acha o galpão em menos de dois minutos.'),
    fala('Ivo', 'Eu sento aqui há quatro anos. Sabe quanta gente perguntou pra recepção o que é aquilo?'),
    d=>fala(d.jogador.nome, 'Quanta?'),
    fala('Ivo', 'Eu.')
  ],
  ef:{flag:['o_galpao_do_setor_sete','sabe_do_lote_unico'],
      registrar:'Do banco de fora dá pra ver um galpão de telha metálica com quatro veículos dentro da reserva.'},
  escolhas:[
    {texto:'Perguntar o que a recepção respondeu pra ele.', vai:'c12_ab_o_que_responderam'},
    {texto:'Ir andar a cerca por fora até chegar perto do galpão.', vai:'c12_cerca'},
    {texto:'Ir procurar o diretor da reserva.', vai:'c12_diretor'}
  ]
},

c12_ab_o_que_responderam:{
  texto:[
    fala('Ivo', 'Que era depósito de ração.'),
    'Ele pega o binóculo de volta, ajusta e olha ele mesmo, sem pressa.',
    fala('Ivo', 'Nove mil hectares de reserva com Pokémon selvagem que come sozinho, e um depósito de ração de sessenta metros de comprimento.'),
    fala('Ivo', 'Eu perguntei isso também. Aí eles pararam de responder.'),
    d=>fala(d.jogador.nome, 'Por que você não desiste?'),
    'Ele abaixa o binóculo.',
    fala('Ivo', 'Eu trabalhei lá dentro. Onze anos, manejo.'),
    fala('Ivo', 'Me mandaram embora no dia em que o galpão ficou pronto.', 'baixo')
  ],
  ef:{flag:'o_homem_do_binoculo_trabalhou_la',
      npc:{nome:'Ivo', opiniao:2, viuVoce:'Te contou que foi demitido no dia em que o galpão ficou pronto.'},
      registrar:'Ivo trabalhou onze anos no manejo da reserva. Foi demitido quando o galpão ficou pronto.'},
  escolhas:[
    {texto:'Ir andar a cerca por fora.', vai:'c12_cerca'},
    {texto:'Ir procurar o diretor da reserva.', vai:'c12_diretor'},
    {texto:'Ir ao bar da cidade com isso na cabeça.', vai:'c12_bar'}
  ]
},

c12_ab_quanto_tempo_ele_senta:{
  texto:[
    fala('Ivo', 'Quatro anos. Quase todo dia.'),
    d=>fala(d.jogador.nome, 'Fazendo o quê?'),
    fala('Ivo', 'Contando.'),
    'Ele tira do bolso de trás uma caderneta de capa dura, dessas de armazém, gasta nas quinas.',
    'Cada página tem uma data e uma coluna de traços.',
    fala('Ivo', 'Caminhão que entra pelo portão técnico. Eu conto desde noventa e seis.'),
    fala('Ivo', 'Noventa e seis: dezenove no ano. Noventa e sete: vinte e quatro.'),
    'Ele vira pra última página preenchida.',
    fala('Ivo', 'Esse ano, até agora: cento e quarenta e um.')
  ],
  ef:{flag:['a_caderneta_do_binoculo','sabe_do_lote_unico'],
      registrar:'Uma caderneta conta os caminhões que entram no portão técnico da reserva: 19 em 1996, 141 este ano.',
      presagio:'Dezenove pra cento e quarenta e um em quatro anos. Isso não cresceu: isso virou outra coisa.'},
  escolhas:[
    {texto:'Pedir a caderneta emprestada.', vai:'c12_ab_a_caderneta'},
    {texto:'Olhar a reserva pelo binóculo.', vai:'c12_ab_pelo_binoculo'},
    {texto:'Ir procurar o diretor da reserva.', vai:'c12_diretor'}
  ]
},

c12_ab_a_caderneta:{
  texto:[
    d=>fala(d.jogador.nome, 'Me empresta isso.'),
    'Ele segura a caderneta com as duas mãos e não entrega na hora.',
    fala('Ivo', 'Isso aqui é quatro anos da minha vida.'),
    d=>fala(d.jogador.nome, 'Eu sei. Por isso eu quero.'),
    'Ele entrega.',
    fala('Ivo', 'Se você perder, eu não tenho cópia.'),
    fala('Ivo', 'E se você mostrar pra pessoa errada, eu também não tenho cópia.'),
    'Você guarda a caderneta na parte de dentro da mochila, que é onde vai o que não pode molhar.'
  ],
  ef:{flag:'tem_a_caderneta_do_binoculo',
      npc:{nome:'Ivo', opiniao:3, viuVoce:'Te entregou quatro anos de contagem sem ter cópia.'},
      registrar:'Está com a caderneta de contagem de caminhões. Não existe cópia.',
      presagio:'Ele não tem cópia. Agora o caderno só existe na sua mochila.'},
  escolhas:[
    {texto:'Procurar o diretor da reserva.', vai:'c12_diretor'},
    {texto:'Andar a cerca por fora.', vai:'c12_cerca'},
    {texto:'Ir ao bar da cidade.', vai:'c12_bar'}
  ]
},

c12_ab_de_cracha:{
  texto:[
    d=>{
      const c = Cargos.doCracha();
      return `A recepção da Zona Safári tem uma catraca pra visitante e uma porta lateral com interfone pra quem não é visitante, e o seu crachá de ${c ? c.nome : 'serviço'} te põe na porta lateral.`;
    },
    'Do lado de dentro não é a reserva. É um escritório: quatro mesas, dois computadores, um mapa mural de nove mil hectares com alfinete colorido.',
    d=>d.flags.conheceu_prado
      ? 'A mulher que levanta de uma das mesas é a da prancheta do pregão de Celadon, e ela te reconhece antes de você reconhecer ela.'
      : 'Uma mulher de uns cinquenta anos levanta de uma das mesas e vem te receber com a mão estendida e o nome já pronto.',
    d=>fala('Auditora Brill', d.flags.conheceu_prado ? 'Brill. Hoje é auditoria de manejo.' : 'Brill. Auditoria de manejo.'),
    d=>fala(d.jogador.nome, 'Auditoria?'),
    fala('Auditora Brill', 'Eu chego antes de vocês e saio depois. É o serviço.'),
    'Ela olha o seu crachá, depois a sua cara, e faz a conta da sua idade em silêncio.',
    fala('Auditora Brill', 'Você é {novo|nova}. Quanto tempo de casa?'),
    'A resposta honesta é constrangedora e você dá ela mesmo assim.'
  ],
  ef:{flag:'conheceu_a_nishino',
      npc:{nome:'Auditora Brill', opiniao:1, viuVoce:'Te recebeu pela porta lateral da Zona Safári.'},
      registrar:'Conheceu a Auditora Brill, da auditoria de manejo, no escritório da Zona Safári.'},
  escolhas:[
    {texto:'Perguntar o que ela está auditando.', vai:'c12_ab_o_que_ela_audita'},
    {texto:'Olhar o mapa mural de perto.', vai:'c12_ab_perguntou_o_sete'},
    {texto:'Pedir pra falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_ab_o_que_ela_audita:{
  texto:[
    'Ela volta pra mesa dela e vira uma pasta na sua direção sem entregar.',
    fala('Auditora Brill', 'Balanço de espécimes. Entrou, nasceu, morreu, saiu.'),
    fala('Auditora Brill', 'É a conta mais simples que existe. E é a única conta que essa reserva não fecha.'),
    d=>fala(d.jogador.nome, 'Não fecha por quanto?'),
    fala('Auditora Brill', 'Por quatrocentos e doze.'),
    'Ela diz o número devagar, como quem já disse esse número pra muita gente que não reagiu.',
    fala('Auditora Brill', 'Quatrocentos e doze Pokémon que entraram na conta e não saíram por nenhuma das três portas: nem morte, nem transferência, nem soltura.'),
    fala('Auditora Brill', 'Eu escrevi isso em três relatórios. Os três foram arquivados como "divergência metodológica".')
  ],
  ef:{flag:['quatrocentos_e_doze','sabe_do_lote_unico'],
      registrar:'A auditoria aponta 412 espécimes que entraram na Zona Safári e não saíram por nenhuma das três portas.'},
  escolhas:[
    {texto:'Olhar o mapa mural de perto.', vai:'c12_ab_perguntou_o_sete'},
    {texto:'Pedir cópia de um dos relatórios.', vai:'c12_ab_a_copia_do_relatorio'},
    {texto:'Pedir pra falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_ab_perguntou_o_sete:{
  texto:[
    'O mapa mural tem os setores numerados a tinta, com um alfinete colorido em cada um. Você conta sem querer: 1, 2, 3, 4, 5, 6. E 8.',
    'Entre o 6 e o 8, a nordeste, tem uma área do tamanho de dois setores pintada da cor do fundo do mapa, sem número e sem alfinete.',
    d=>fala(d.jogador.nome, 'Cadê o setor 7?'),
    'Ela não se assusta. Ela fica satisfeita, que é pior.',
    fala('Auditora Brill', 'Você contou. Quase ninguém que entra nessa sala conta.'),
    fala('Auditora Brill', 'No mapa oficial o Setor 7 não existe. Tem setor 1 a 6 e setor 8.'),
    d=>fala(d.jogador.nome, 'E o oito fica onde?'),
    fala('Auditora Brill', 'Do outro lado do sete.')
  ],
  ef:{flag:'o_setor_sete_nao_existe_no_mapa',
      registrar:'O mapa oficial da Zona Safári vai do setor 1 ao 6 e pula direto pro 8.'},
  escolhas:[
    {texto:'Pedir cópia de um relatório da auditoria.', vai:'c12_ab_a_copia_do_relatorio'},
    {texto:'Pedir pra falar com o diretor.', vai:'c12_diretor'},
    {texto:'Sair e andar a cerca por fora, a nordeste.', vai:'c12_cerca'}
  ]
},

c12_ab_a_copia_do_relatorio:{
  texto:[
    fala('Auditora Brill', 'Você sabe o que acontece se eu te der cópia?'),
    d=>fala(d.jogador.nome, 'Não.'),
    fala('Auditora Brill', 'Nada. Absolutamente nada.'),
    'Ela abre a gaveta e tira três pastas já separadas, com elástico, prontas.',
    fala('Auditora Brill', 'Relatório de auditoria é documento público. Qualquer pessoa pode pedir.'),
    fala('Auditora Brill', 'Em quatro anos, você é a segunda pessoa a pedir.'),
    d=>fala(d.jogador.nome, 'E a primeira?'),
    fala('Auditora Brill', 'Uma repórter de Saffron. Ano passado.'),
    'Ela empurra as três pastas.',
    fala('Auditora Brill', 'Ela pediu, eu dei, e não saiu nada. Eu não sei por quê e parei de perguntar.')
  ],
  ef:{flag:['tem_os_relatorios_da_nishino','reika_precisa_de_papel'],
      npc:{nome:'Auditora Brill', opiniao:3, viuVoce:'Te entregou três relatórios de auditoria arquivados.'},
      registrar:'Está com três relatórios de auditoria da Zona Safári, arquivados como "divergência metodológica".',
      presagio:'Documento público que ninguém pede é o esconderijo mais seguro que existe.'},
  escolhas:[
    {texto:'Pedir pra falar com o diretor.', vai:'c12_diretor'},
    {texto:'Sair e andar a cerca por fora.', vai:'c12_cerca'},
    {texto:'Sair e ir ao bar da cidade.', vai:'c12_bar'}
  ]
},


c12_fuchsia:{
  texto:[
    'Fuchsia é uma cidade pequena que existe por causa de uma coisa grande.',
    'Quatro mil habitantes, uma avenida principal de setecentos metros, duas pousadas, uma escola, um posto de saúde que fecha às dezoito, e do outro lado da rua: uma cerca de alambrado de três metros que continua por trinta e um quilômetros.',
    'A Zona Safári tem nove mil hectares. É a maior área protegida de Kanto e a única que gera receita própria.',
    'A entrada custa quinhentos, dá trinta Pokébolas especiais, meia hora de caminhada guiada e um folheto plastificado com o nome das espécies.',
    'É turismo. É bom turismo, inclusive: a reserva é linda, o folheto é bem-feito, o dinheiro fica na cidade.',
    'Na fachada da recepção tem um painel com uma frase em letra garrafal, dessas de placa de rodovia:',
    '**A CERCA EXISTE PARA MANTER VOCÊ FORA, NÃO ELES DENTRO.**',
    'É uma frase bonita. Você lê duas vezes, e na segunda ela já não diz a mesma coisa.',
    d=>{
      const via = Historia.via();
      if (via==='mercenario'||via==='foragido') return 'E a sua entrega desta semana tem origem escrita na etiqueta, em caneta, no canto de baixo: **ZS-SETOR 7**. Você veio buscar na fonte, o que é uma frase que você não gostaria de estar pensando.';
      if (via==='pesquisador') return 'E no livro de destinos que você tirou de Celadon, quatro linhas tinham origem "ZS-7". Você veio ver o que é o setor 7.';
      if (via==='heroi') return 'E três Pokémon que você soltou em Celadon tinham brinco numerado na orelha. Brinco amarelo de plástico, de identificação de reserva. Desta reserva.';
      return 'E na parede da recepção tem um cartaz desbotado, de uns dez anos atrás:';
    },
    d=>['mercenario','foragido','pesquisador','heroi'].includes(Historia.via()) ? '' : '**AJUDE-NOS — POKÉMON AVISTADOS FORA DA CERCA DEVEM SER REPORTADOS.**',
    d=>['mercenario','foragido','pesquisador','heroi'].includes(Historia.via()) ? '' : 'Fora. Não dentro.'
  ],
  ef:{registrar:'Chegou a Fuchsia e à Zona Safári.'},
  escolhas:[
    {texto:'Pagar a entrada e fazer o passeio guiado.', vai:'c12_passeio', cond:d=>d.jogador.dinheiro>=500 && !Historia.jaAconteceu('c12_passeio'),
     ef:{dinheiro:-500}},
    {texto:'Andar pela cidade e entender de que ela vive.', vai:'c12_cidade'},
    {texto:'Seguir a cerca por fora até achar por onde sai caminhão.', vai:'c12_cerca'},
    {texto:'Falar com o diretor da reserva.', vai:'c12_diretor'}
  ]
},

c12_cidade:{
  falante:'a dona da padaria',
  vozes:['N'],
  texto:[
    'Você anda Fuchsia inteira em uma hora e quarenta, porque Fuchsia inteira dá uma hora e quarenta.',
    'A cidade vive da reserva de um jeito que não é sutil.',
    'A pousada se chama Pousada do Safári. A padaria vende pão de queijo em saquinho com a silhueta de um Kangaskhan. O posto de gasolina tem um outdoor da reserva. A escola municipal se chama Escola Municipal Reserva Fuchsia.',
    'E tem um detalhe que você leva quarenta minutos pra notar e depois não consegue desnotar:',
    'não tem nenhum Pokémon selvagem na cidade.',
    'Nenhum. Nem Pidgey, nem Rattata, nem inseto. Em Pewter tinha. Em Cerulean tinha. Em Lavender tinha muito.',
    'Aqui, do lado de nove mil hectares de reserva, dentro de uma cidade de quatro mil pessoas, não tem um.',
    'Você pergunta pra dona da padaria e ela responde com orgulho genuíno:',
    '"Ah, aqui é limpo. A gente tem manejo."'
  ],
  ef:{flag:['viu_fuchsia','ouviu_manejo'],
      rep:{eixo:'bom',delta:1,motivo:'Reparou no que não estava lá'},
      registrar:'Não há um único Pokémon selvagem em Fuchsia. A cidade chama isso de "manejo".'},
  escolhas:[
    {texto:'"O que é manejo?" — perguntar na padaria mesmo.', vai:'c12_manejo_padaria'},
    {texto:'Procurar o ginásio da cidade.', vai:'c12_ginasio'},
    {texto:'Seguir a cerca por fora.', vai:'c12_cerca'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'}
  ]
},

c12_manejo_padaria:{
  falante:'a dona da padaria',
  vozes:['P','N','P','N','P','N','N'],
  texto:[
    '"O que é manejo?"',
    'Ela para de embalar o pão de queijo com a silhueta do Kangaskhan.',
    '"Manejo é… é o controle, né? Pra não ter Pokémon demais."',
    '"E quando tem Pokémon demais?"',
    '"Aí eles tiram."',
    '"Tiram pra onde?"',
    'E aí acontece uma coisa que dá pra ver de fora:',
    'ela abre a boca pra responder, e não tem a resposta, e percebe que não tem a resposta, e a cara dela muda.',
    '"Sabe que eu nunca perguntei?"',
    'Ela mexe no saquinho.',
    '"Meu marido trabalhou lá dezesseis anos. Eu nunca perguntei."'
  ],
  ef:{flag:'ninguem_pergunta',
      rep:{eixo:'bom',delta:2,motivo:'Fez uma pergunta que a cidade inteira não fazia'},
      npc:{nome:'Dona da padaria', opiniao:2, memoria:'Percebeu, falando com você, que nunca perguntou para onde levam o excedente.'},
      registrar:'Ninguém em Fuchsia sabe para onde vai o "excedente" da reserva.',
      presagio:'Dezesseis anos com o marido lá dentro, e ela nunca perguntou. Não é descuido — é conveniência.'},
  escolhas:[
    {texto:'"Seu marido pode me contar?"', vai:'c12_marido'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Fazer o passeio guiado.', vai:'c12_passeio', cond:d=>d.jogador.dinheiro>=500 && !Historia.jaAconteceu('c12_passeio'), ef:{dinheiro:-500}}
  ]
},

c12_marido:{
  falante:'Sr. Zane',
  vozes:['N','P','N','N','P','N','P','N','N'],
  texto:[
    'O marido dela se chama Edwin Zane — Sr. Zane, como a cidade inteira o trata — e está na sala dos fundos da padaria assistindo televisão, porque se aposentou da reserva faz quatro anos e não sabe o que fazer com o dia.',
    'Ele desliga a televisão sozinho quando você pergunta, o que já é resposta.',
    '"Dezesseis anos. Eu era da equipe de captura."',
    '"Captura de quê?"',
    '"De excedente." Ele fala a palavra do jeito que se fala palavra que a gente usou tanto que não significa mais nada. "A gente saía com rede, com Pokébola, com carrinho, e trazia."',
    '"E a conta era feita como?"',
    'E aí ele te dá a informação mais útil que alguém te deu em Fuchsia, e dá porque ninguém nunca perguntou:',
    '"Censo. Todo mês de março tem censo. Sobrevoo com helicóptero, contagem por setor, e uma planilha."',
    '"E a planilha diz quanto é demais."',
    '"A planilha diz quanto o setor suporta. Se tá acima, tira."',
    'Ele coça o joelho.',
    '"Só que a planilha é de mil novecentos e setenta e um."'
  ],
  ef:{flag:['sabe_do_censo','sabe_da_planilha_71'],
      npc:{nome:'Sr. Zane', opiniao:3, memoria:'Dezesseis anos na equipe de captura da Zona. Desligou a televisão sozinho quando você perguntou.'},
      rep:{eixo:'bom',delta:3,motivo:'Achou quem fazia a captura e perguntou como a conta era feita'},
      registrar:'A capacidade de suporte da Zona Safári é calculada por uma planilha de 1971.',
      presagio:'Uma planilha de mil novecentos e setenta e um. Ninguém refez a conta em trinta anos.'},
  escolhas:[
    {texto:'"E se a planilha estiver errada?"', vai:'c12_planilha_errada', cond:d=>!Historia.jaAconteceu('c12_planilha_errada')},
    {texto:'"Pra onde vai o excedente?"', vai:'c12_pra_onde_vai', cond:d=>!Historia.jaAconteceu('c12_pra_onde_vai')},
    {texto:d=>'"' + c12_perguntaDoSete(d) + '"', vai:'c12_vandir_setor7', cond:d=>!Historia.jaAconteceu('c12_vandir_setor7')},
    {texto:'Agradecer e ir falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_planilha_errada:{
  falante:'Sr. Zane',
  vozes:['P','N','P','N','N','N','P','P','N','P','N'],
  texto:[
    '"E se a planilha estiver errada?"',
    'Ele ri primeiro. Depois para de rir.',
    '"Como assim errada?"',
    '"Setenta e um. A reserva tinha o mesmo tamanho em setenta e um?"',
    '"Tinha menos. Em setenta e um ia só até o córrego. A fazenda da beira do rio entrou na reserva em oitenta e cinco, quando o dono morreu sem herdeiro."',
    'Silêncio.',
    '"Então a área aumentou e a conta não mudou."',
    'Ele olha a televisão desligada.',
    '"E isso quer dizer o quê?"',
    '"Quer dizer que a conta acha que cabe menos do que cabe." Você fala devagar, porque você mesm{o|a} está entendendo enquanto fala. "O censo conta os Pokémon de nove mil hectares e a planilha divide pela área de setenta e um, que é menor. A densidade dá mais alta do que é. Aí todo ano a planilha acusa excedente."',
    '"Todo ano."',
    '"Todo ano."',
    'Sr. Zane fica muito quieto.',
    '"Dezesseis anos, {moço|moça}."'
  ],
  ef:{flag:['entendeu_a_conta','sabe_da_planilha_71'],
      rep:{eixo:'bom',delta:5,motivo:'Desmontou trinta anos de política pública num fundo de padaria'},
      moral:-10, instabilidade:1,
      npc:{nome:'Sr. Zane', opiniao:5, memoria:'Descobriu com você que a planilha que justificou dezesseis anos de captura estava errada desde 1985.'},
      registrar:'A reserva cresceu em 1985 e a planilha de 1971 nunca foi refeita: o "excedente" é um erro de cálculo.',
      presagio:'Todo ano acusa excedente. Todo ano. Não tem vilão nessa conta.'},
  escolhas:[
    {texto:'"Pra onde vai o excedente?"', vai:'c12_pra_onde_vai', cond:d=>!Historia.jaAconteceu('c12_pra_onde_vai')},
    {texto:d=>'"' + c12_perguntaDoSete(d) + '"', vai:'c12_vandir_setor7', cond:d=>!Historia.jaAconteceu('c12_vandir_setor7')},
    {texto:'Levar isso pro diretor.', vai:'c12_diretor'},
    {texto:'Ir ao setor 7 à noite e ver com os olhos.', vai:'c12_noite_zona'}
  ]
},

c12_pra_onde_vai:{
  falante:'Sr. Zane',
  vozes:['P','N','P','P','N','N'],
  texto:[
    '"Pra onde vai o excedente?"',
    'Ele demora.',
    '"Nos meus primeiros anos ia pra soltura. A gente levava de caminhão pro norte, pra Rota 14, e soltava, e voltava."',
    '"E depois?"',
    fala('Sr. Zane', 'Depois a Rota 14 encheu, aí a gente levava mais longe. Aí a gente levava até Cerulean. Aí um ano o supervisor disse que não ia ter mais caminhão pra soltura porque era caro, e que a partir dali a retirada ia ser “entregue a receptor credenciado”.'),
    '"E o que é receptor credenciado?"',
    '"Eu perguntei uma vez."',
    'Ele olha pra você.',
    '"Ele disse que era gente que tem depósito com alvará."'
  ],
  ef:{flag:['sabe_do_receptor','sabe_do_deposito'],
      rep:{eixo:'bom',delta:3,motivo:'Puxou o fio até o depósito com alvará'},
      moral:-8,
      registrar:'O "excedente" da Zona Safári vai para "receptor credenciado" — depósito com alvará.',
      presagio:d=>c12_contouGaiolas(d) ? 'Depósito com alvará. Você já esteve em um. Tinha quarenta e uma gaiolas.'
        : c12_viuOGalpao(d) ? 'Depósito com alvará. Você já esteve na porta de um, em Celadon.'
        : 'Depósito com alvará. Alvará é papel: alguém assinou.'},
  escolhas:[
    {texto:d=>'"' + c12_perguntaDoSete(d) + '"', vai:'c12_vandir_setor7', cond:d=>!Historia.jaAconteceu('c12_vandir_setor7')},
    {texto:'"Você levaria a soltura de volta?"', vai:'c12_vandir_soltura', cond:d=>!Historia.jaAconteceu('c12_vandir_soltura')},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_vandir_setor7:{
  texto:[
    d=>fala(d.jogador.nome, d.flags.c12_zane_ja_sabia ? 'Me fala do setor 7.' : 'Tem algum pedaço da reserva onde você nunca entrou?'),
    d=>d.flags.c12_zane_ja_sabia ? '' : fala('Sr. Zane', 'Agora tem. O setor 7.'),
    'Ele não hesita.',
    fala('Sr. Zane', 'Setor 7 era pasto. Pasto degradado de uma fazenda que virou reserva em sessenta e nove. A gente usava como área de manobra.'),
    d=>fala(d.jogador.nome, 'E hoje?'),
    fala('Sr. Zane', 'Hoje eu não sei, porque fecharam dois anos atrás pra “recuperação ambiental” e eu já tinha me aposentado.'),
    'Ele pensa.',
    fala('Sr. Zane', 'Mas eu vou te dizer uma coisa de quem trabalhou lá dezesseis anos: recuperação ambiental de pasto é plantio. Plantio precisa de muda, de trator, de irrigação e de gente.'),
    fala('Sr. Zane', 'E eu moro nessa cidade de quatro mil pessoas e não conheço ninguém que tenha sido contratado pra plantar nada.'),
    fala('Sr. Zane', 'E eu conheço todo mundo.')
  ],
  ef:{flag:'sabe_que_nao_tem_plantio',
      rep:{eixo:'bom',delta:2,motivo:'Perguntou a quem conhece a cidade inteira'},
      registrar:'O setor 7 está fechado há dois anos para "recuperação ambiental" e ninguém foi contratado para plantar nada.',
      presagio:'Ele conhece todo mundo numa cidade de quatro mil. Isso é um banco de dados.',
      /* o que você sabia antes de perguntar decide a pergunta */
      executar:d=>{ Estado.marcar('c12_zane_ja_sabia', c12_sabeDoSete(d)); Estado.marcar('sabe_do_setor7'); return []; }},
  escolhas:[
    {texto:'"Quem entra e sai do setor 7, então?"', vai:'c12_quem_entra', cond:d=>!Historia.jaAconteceu('c12_quem_entra')},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Fazer o passeio guiado primeiro.', vai:'c12_passeio', cond:d=>d.jogador.dinheiro>=500 && !Historia.jaAconteceu('c12_passeio'), ef:{dinheiro:-500}}
  ]
},

c12_quem_entra:{
  falante:'Sr. Zane',
  vozes:['P','N','P','N','P','N','P','N','N','N'],
  texto:[
    '"Quem entra e sai do setor 7, então?"',
    'Ele coça o joelho de novo, que é o gesto que ele faz quando está prestes a dizer uma coisa que não queria.',
    '"Caminhão. Duas ou três vezes por mês, de madrugada."',
    '"Você viu?"',
    '"Eu ouço. Eu moro na saída sul e o portão de serviço é a oitocentos metros da minha casa, e caminhão de madrugada acorda velho."',
    '"E o que mais?"',
    '"Tem uma van branca que entra toda terça de manhã e sai toda terça de tarde."',
    '"Van de quê?"',
    '"Da médica de Pokémon." Ele fala isso como se fosse óbvio. "A doutora Pia. Ela atende a reserva há uns oito anos, mora em Fuchsia mesmo, casa da rua da escola."',
    'Ele olha pra você com uma cara nova.',
    '"Ela entra no setor 7 toda terça, {moço|moça}. Toda terça, há dois anos, num setor que tá fechado pra recuperação ambiental."'
  ],
  ef:{flag:['sabe_da_yara','endereco_yara'],
      rep:{eixo:'bom',delta:3,motivo:'Achou a pessoa que entra no setor fechado toda semana'},
      registrar:'A Dra. Pia, médica de Pokémon da reserva, entra no setor 7 toda terça-feira há dois anos.',
      presagio:'Toda terça. Uma médica de Pokémon. Num lugar onde supostamente só se planta grama.'},
  escolhas:[
    {texto:'Ir procurar a Dra. Pia.', vai:'c12_yara'},
    {texto:'Ir falar com o diretor primeiro.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_vandir_soltura:{
  falante:'Sr. Zane',
  vozes:['P','N','P','N','P','N','N','N'],
  texto:[
    '"Você levaria a soltura de volta?"',
    'A pergunta pega ele num lugar que nenhuma outra pegou.',
    '"Eu tenho sessenta e sete anos e uma hérnia."',
    '"Não perguntei se você aguenta. Perguntei se você levaria."',
    'Ele fica quieto uns dez segundos.',
    '"Eu tenho carteira de caminhão e eu dirigi caminhão de soltura por nove anos."',
    '"Isso é sim."',
    '"Isso é sim."',
    'Ele liga a televisão de novo e desliga na mesma hora, que é uma coisa que gente faz quando está mexida.',
    '"Se você conseguir que aquilo abra, {moço|moça}, eu dirijo. Eu conheço os pontos de soltura todos, eu tenho o mapa na cabeça, e eu sei qual espécie vai pra qual lugar sem precisar de livro."',
    '"E eu tô com a hérnia, e eu dirijo."'
  ],
  ef:{flag:['vandir_dirige','tem_quem_leve'],
      npc:{nome:'Sr. Zane', opiniao:8, memoria:'Se ofereceu para dirigir o caminhão de soltura, com hérnia e sessenta e sete anos.'},
      rep:{eixo:'bom',delta:4,motivo:'Perguntou a coisa certa ao homem certo'},
      moral:15,
      registrar:'Sr. Zane dirige o caminhão de soltura, se um dia aquilo abrir.'},
  escolhas:[
    {texto:d=>'"' + c12_perguntaDoSete(d) + '"', vai:'c12_vandir_setor7', cond:d=>!Historia.jaAconteceu('c12_vandir_setor7')},
    {texto:'"Quem entra e sai do setor 7, então?"', vai:'c12_quem_entra', cond:d=>Historia.jaAconteceu('c12_vandir_setor7') && !Historia.jaAconteceu('c12_quem_entra')},
    {texto:'Ir procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

/* voltar ao Sr. Zane: a televisão já está desligada */
c12_zane_de_novo:{
  repetivel:true,
  texto:[
    'O Sr. Zane abre a porta dos fundos da padaria antes de você bater, com a televisão desligada atrás dele.',
    d=>d.flags.vandir_dirige ? fala('Sr. Zane', 'Eu disse que dirijo. É só me dizer a hora, {moço|moça}.')
      : d.flags.entendeu_a_conta ? fala('Sr. Zane', 'Desde aquela conta eu não consigo mais assistir televisão direito.')
      : fala('Sr. Zane', 'Pode perguntar. Ninguém pergunta nada nessa cidade.')
  ],
  escolhas:[
    {texto:'"E se a planilha estiver errada?"', vai:'c12_planilha_errada', cond:d=>!Historia.jaAconteceu('c12_planilha_errada')},
    {texto:'"Pra onde vai o excedente?"', vai:'c12_pra_onde_vai', cond:d=>!Historia.jaAconteceu('c12_pra_onde_vai')},
    {texto:d=>'"' + c12_perguntaDoSete(d) + '"', vai:'c12_vandir_setor7', cond:d=>!Historia.jaAconteceu('c12_vandir_setor7')},
    {texto:'"Quem entra e sai do setor 7, então?"', vai:'c12_quem_entra', cond:d=>Historia.jaAconteceu('c12_vandir_setor7') && !Historia.jaAconteceu('c12_quem_entra')},
    {texto:'"Você levaria a soltura de volta?"', vai:'c12_vandir_soltura', cond:d=>Historia.jaAconteceu('c12_pra_onde_vai') && !Historia.jaAconteceu('c12_vandir_soltura')},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona', repetivel:true},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor', repetivel:true},
    {texto:'Ir procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara, repetivel:true}
  ]
},

c12_ginasio:{
  falante:'a filha do Koga',
  vozes:['E','N','N'],
  texto:[
    'O ginásio de Fuchsia fica na ponta leste da avenida e é a única construção da cidade que não menciona a reserva no nome.',
    'É uma casa baixa de madeira com telhado curvo, jardim de pedra, e um portão de correr que faz barulho de portão de correr.',
    'Na placa: **KOGA — VENENO**. E embaixo, menor: "Atendimento: quarta e sexta, 14h às 18h."',
    d=>{ const s = Calendario.hoje().semanaIdx, h = c12_hora(d), dia = Calendario.SEMANA[s];
         if (c12_ginasioAberto(d)) return `Hoje é ${dia}, e o portão está aberto.`;
         if ((s === 2 || s === 4) && h < 14) return `Hoje é ${dia}, e ainda não são duas.`;
         if ((s === 2 || s === 4) && h >= 18) return `Hoje é ${dia}, e já passou das seis.`;
         return `Hoje é ${dia}.`; },
    'Tem uma menina de uns treze anos varrendo o jardim de pedra com um ancinho de bambu, fazendo as linhas paralelas, do jeito certo.',
    'Ela te olha, olha as insígnias que você tem, e volta a varrer.',
    d=>c12_ginasioAberto(d) ? fala('a filha do Koga', 'Tá aberto. A porta é aquela.') : fala('a filha do Koga', 'Quarta e sexta.'),
    d=>fala(d.jogador.nome, c12_ginasioAberto(d) ? 'Eu tô só olhando.' : 'Eu sei. Eu tô só olhando.'),
    '"Todo mundo tá só olhando." Ela não para de varrer. "Meu pai diz que veneno é o tipo mais honesto porque ele avisa o que vai fazer e faz devagar."'
  ],
  ef:{flag:'achou_ginasio_fuchsia',
      executar:d=>{ Mundo.descobrir('ginasio_fuchsia'); return []; },
      npc:d=>({nome:'Filha do Koga', opiniao:1, memoria:`Varria o jardim de pedra do ginásio de Fuchsia numa ${Calendario.hoje().semanaIdx >= 5 ? Calendario.hoje().semana : Calendario.hoje().semana + '-feira'}.`}),
      registrar:'O ginásio de Fuchsia abre quarta e sexta, das 14h às 18h.'},
  escolhas:[
    {texto:'"Seu pai trabalha com a reserva?"', vai:'c12_koga_reserva'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Fazer o passeio guiado.', vai:'c12_passeio', cond:d=>d.jogador.dinheiro>=500 && !Historia.jaAconteceu('c12_passeio'), ef:{dinheiro:-500}}
  ]
},

c12_koga_reserva:{
  falante:'a filha do Koga',
  vozes:['P','N','P','N','N','P','N','N','P','N'],
  texto:[
    '"Seu pai trabalha com a reserva?"',
    'Ela para de varrer pela primeira vez.',
    '"Meu pai é conselheiro da reserva. Tem um conselho com sete pessoas e ele é uma."',
    '"E o que o conselho faz?"',
    '"Aprova o relatório de manejo todo ano." Ela apoia o ancinho. "Meu pai lê o relatório inteiro todo ano e ele é o único que lê, porque os outros seis assinam na reunião sem abrir."',
    '"Como você sabe?"',
    '"Porque ele reclama disso na mesa de jantar todo ano, quando chega o relatório, desde que eu nasci."',
    'Ela volta a varrer.',
    '"Dessa vez ele não reclamou. Dessa vez ele leu o relatório, ficou três dias sem falar com ninguém, e não assinou."',
    '"Ele não assinou?"',
    '"Ele não assinou. E a reunião aprovou do mesmo jeito, porque seis é mais que um."'
  ],
  ef:{flag:['sabe_do_conselho','koga_nao_assinou'],
      rep:{eixo:'bom',delta:3,motivo:'Descobriu que alguém já tinha tentado, por dentro'},
      npc:{nome:'Filha do Koga', opiniao:4, memoria:'Te contou que o pai dela leu o relatório de manejo e se recusou a assinar.'},
      registrar:'Koga, líder de Fuchsia, é conselheiro da reserva e se recusou a assinar o último relatório de manejo.',
      presagio:'Seis é mais que um. E mesmo assim ele não assinou.'},
  escolhas:[
    {texto:'"Eu preciso falar com ele."', vai:'c12_koga'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara}
  ]
},

c12_koga:{
  falante:'Koga',
  vozes:['N','P','N','N','P','N','N'],
  texto:[
    d=>d.flags.achou_ginasio_fuchsia ? 'A menina do ancinho te leva até os fundos sem perguntar nada.' : 'Quem abre o portão é uma menina de uns treze anos, que te leva até os fundos sem perguntar nada.',
    fala('Koga', 'Obrigado, Janine.'),
    'Koga te recebe na varanda dos fundos, sentado no chão de tábua, com chá e sem cerimônia nenhuma.',
    'Ele é mais velho do que as fotos sugerem e muito mais quieto.',
    'Ele não pergunta o que você quer. Ele espera.',
    'Quando você termina de falar, ele bebe o chá inteiro antes de responder.',
    '"O relatório deste ano pede a retirada de duzentos e quarenta."',
    '"Duzentos e quarenta?"',
    '"Duzentos e quarenta. O do ano passado pediu cento e noventa. O de dois anos atrás, cento e trinta."',
    'Ele põe a xícara no chão.',
    '"Uma população que está sendo retirada todo ano deveria diminuir a pressão sobre a área. A retirada deveria cair."',
    '"E ela sobe."',
    '"Ela sobe, todo ano, há seis anos."',
    'Ele olha o jardim.',
    '"Ou a planilha está errada, ou alguém está enchendo a reserva para poder esvaziar."'
  ],
  ef:{flag:['conheceu_koga','sabe_dos_240'],
      executar:d=>{ Nomes.apresentar('a filha do Koga'); return []; },
      npc:{nome:'Koga', opiniao:3, memoria:'Te disse na varanda que a retirada da reserva sobe todo ano há seis anos.'},
      rep:{eixo:'bom',delta:3,motivo:'Chegou ao único conselheiro que lia o relatório'},
      instabilidade:1,
      registrar:'A retirada anual da Zona Safári subiu de 130 para 240 em seis anos.'},
  escolhas:[
    {texto:'"A planilha é de 1971 e a reserva cresceu em 85."', vai:'c12_koga_planilha', cond:d=>(!!d.flags.entendeu_a_conta) && !Historia.jaAconteceu('c12_koga_planilha')},
    {texto:'"Me dá o relatório."', vai:'c12_koga_relatorio', cond:d=>!Historia.jaAconteceu('c12_koga_relatorio')},
    {texto:'"Como assim enchendo a reserva?"', vai:'c12_enchendo', cond:d=>!Historia.jaAconteceu('c12_enchendo')},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c12_desafio_koga', cond:d=>!Historia.jaAconteceu('c12_desafio_koga')}
  ]
},

c12_koga_planilha:{
  falante:'Koga',
  vozes:['P','N','P','N'],
  texto:[
    '"A planilha é de setenta e um. E a reserva ganhou a fazenda do rio em oitenta e cinco."',
    'Koga não se move por uns cinco segundos.',
    'Depois ele levanta, entra na casa, e volta com uma pasta de papel pardo amarrada com barbante — não um arquivo, uma pasta de verdade, dessas que gente que lê guarda.',
    'Ele abre no chão da varanda e procura, e acha, e vira pra você.',
    'É o anexo técnico do relatório. E na primeira página do anexo, no campo "área de referência", está escrito:',
    '**8.160 ha (ref. levantamento 1971)**',
    'E a reserva hoje tem nove mil.',
    'Oitocentos e quarenta hectares de diferença, usados numa conta de densidade populacional, todo ano, por quinze anos.',
    'Koga fecha a pasta com cuidado.',
    '"Eu li esse relatório vinte e três vezes e eu nunca conferi a área."',
    '"Ninguém confere a área."',
    '"Eu deveria."'
  ],
  ef:{flag:['provou_o_erro','provas_zona'],
      itens:{'Anexo técnico do relatório':1},
      npc:{nome:'Koga', opiniao:7, memoria:'Você mostrou a ele o erro de área que ele não conferiu em vinte e três leituras.'},
      rep:{eixo:'bom',delta:6,motivo:'Provou documentalmente que o excedente é um erro de planilha'},
      instabilidade:1,
      registrar:'O relatório usa área de referência de 8.160 ha; a reserva tem 9.000. O excedente é erro de cálculo.',
      presagio:'Oitocentos e quarenta hectares de diferença. Quinze anos. Ninguém confere a área.'},
  escolhas:[
    {texto:'"Então a gente derruba o relatório."', vai:'c12_derrubar_relatorio', cond:d=>!Historia.jaAconteceu('c12_derrubar_relatorio')},
    {texto:'"Como assim enchendo a reserva?"', vai:'c12_enchendo', cond:d=>!Historia.jaAconteceu('c12_enchendo')},
    {texto:'"Me dá o relatório inteiro. Eu levo."', vai:'c12_koga_relatorio', cond:d=>!Historia.jaAconteceu('c12_koga_relatorio')},
    {texto:'"Eu vou ao setor 7 hoje à noite."', vai:'c12_noite_zona'}
  ]
},

c12_derrubar_relatorio:{
  falante:'Koga',
  vozes:['P','N','P','N','N','P','N','N','N','P'],
  texto:[
    '"Então a gente derruba o relatório."',
    'Ele balança a cabeça devagar.',
    '"Derrubar o relatório suspende a retirada do ano que vem."',
    '"Isso é bom."',
    '"Isso é bom e não resolve o que já está no setor 7 esta noite."',
    'Ele serve mais chá, pra você e pra ele.',
    d=>{ const n = c12_diasPraReuniao(d);
         return d.flags.c12_ja_convocado ? `"A reunião extraordinária já está convocada. Por regimento, falta${n === 1 ? '' : 'm'} ${c12_dias(n)}."`
           : '"Eu convoco reunião extraordinária do conselho. Leva onze dias entre convocação e realização, por regimento."'; },
    d=>`"${c12_Dias(c12_diasPraReuniao(d))}."`,
    d=>`"${c12_Dias(c12_diasPraReuniao(d))}." Ele te olha. "Eu faço a parte que leva ${c12_dias(c12_diasPraReuniao(d))}. Alguém tem que fazer a parte de hoje à noite."`,
    'E ele diz isso sem nenhum peso, sem nenhuma insinuação heroica, do jeito que se distribui tarefa.',
    '"Eu tenho sessenta e dois anos e um assento em conselho. Você tem {idade} anos e nada a perder num regimento."',
    '"A gente é bem complementar."'
  ],
  ef:{flag:['koga_convoca','koga_aliado'],
      executar:d=>{ Estado.marcar('c12_ja_convocado', d.flags.c12_convocou != null); c12_convocar(d); return []; },
      npc:{nome:'Koga', opiniao:9, memoria:'Convocou reunião extraordinária do conselho e dividiu as tarefas com você.'},
      rep:{eixo:'bom',delta:5,motivo:'Conseguiu que o caminho lento e o caminho rápido andassem juntos'},
      moral:12,
      registrar:d=>`Koga convocou reunião extraordinária do conselho: ${c12_emDias(c12_diasPraReuniao(d))}.`},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia antes.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor antes.', vai:'c12_diretor'},
    {texto:'Desafiar o ginásio antes.', vai:'c12_desafio_koga', cond:d=>!Historia.jaAconteceu('c12_desafio_koga')}
  ]
},

c12_enchendo:{
  falante:'Koga',
  vozes:['P','N','N','P','N','N','P','N','P','N','N'],
  texto:[
    '"Como assim enchendo a reserva?"',
    '"Solturas."',
    'Ele espera você entender sozinh{o|a} e você não entende, e ele explica sem impaciência.',
    '"A reserva recebe solturas. Apreensão de Liga, resgate de maus-tratos, entrega voluntária. São umas duzentas por ano e elas entram na população."',
    '"E isso é bom."',
    '"Isso é ótimo. É o que uma reserva deve fazer."',
    'Ele vira a xícara vazia de boca pra baixo.',
    '"A não ser que a mesma pessoa aprove as solturas e as retiradas, e ganhe por unidade nas duas pontas."',
    'Silêncio na varanda.',
    '"Isso existe?"',
    '"Eu não sei. Eu sou conselheiro, não sou auditor."',
    '"Mas você desconfia."',
    '"Eu não assinei o relatório." Ele levanta e recolhe as xícaras. "Isso é o que um homem da minha idade faz quando desconfia."'
  ],
  ef:{flag:['sabe_das_solturas','desconfia_do_ciclo'],
      rep:{eixo:'bom',delta:2,motivo:'Entendeu que a entrada e a saída podem ser o mesmo negócio'},
      registrar:'A reserva recebe ~200 solturas por ano. Se quem aprova a entrada aprova a saída, dá pra ganhar nas duas pontas.'},
  escolhas:[
    {texto:'"Quem assina as duas coisas?"', vai:'c12_quem_assina', cond:d=>!Historia.jaAconteceu('c12_quem_assina')},
    {texto:'"Me dá o relatório."', vai:'c12_koga_relatorio', cond:d=>!Historia.jaAconteceu('c12_koga_relatorio')},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_quem_assina:{
  falante:'Koga',
  vozes:['P','N','P','N','N','N','P','N','N','P','N','P','N'],
  texto:[
    '"Quem assina as duas coisas?"',
    'Koga para com as xícaras na mão.',
    '"A entrada, o diretor. A saída, o diretor."',
    '"E ele ganha por unidade?"',
    '"Não." Ele fala isso com firmeza. "O Quince ganha salário de servidor há trinta e um anos e mora numa casa de dois quartos a quatro quadras daqui, e eu conheço a casa porque eu já entreguei remédio lá quando a mulher dele estava doente."',
    'Ele leva as xícaras pra dentro e volta.',
    '"Quem ganha por unidade é o receptor credenciado."',
    '"E quem credencia o receptor?"',
    'Koga senta de novo.',
    '"O conselho."',
    'Pausa.',
    '"Nós. Sete pessoas. Eu, inclusive."',
    '"Você assinou o credenciamento?"',
    '"Eu assinei o credenciamento em noventa e sete, junto com os outros seis, numa reunião de quarenta minutos, com um parecer técnico de duas páginas que eu li."',
    '"E o nome da empresa?"',
    'Ele fecha os olhos.',
    '"Eu não lembro. E eu lembro de tudo."'
  ],
  ef:{flag:['koga_assinou_o_credenciamento','sabe_do_credenciamento'],
      npc:{nome:'Koga', opiniao:6, memoria:'Admitiu que assinou em 1997 o credenciamento do receptor e não lembra o nome da empresa.'},
      rep:{eixo:'bom',delta:3,motivo:'Chegou até a assinatura que começou tudo'},
      moral:-8,
      registrar:'O conselho credenciou o receptor em 1997. Koga assinou e não lembra o nome da empresa.'},
  escolhas:[
    {texto:'"Procura o nome. Eu espero."', vai:'c12_procurou_o_nome', cond:d=>!Historia.jaAconteceu('c12_procurou_o_nome')},
    {texto:'"Me dá o relatório inteiro."', vai:'c12_koga_relatorio', cond:d=>!Historia.jaAconteceu('c12_koga_relatorio')},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_procurou_o_nome:{
  texto:[
    'Ele procura por duas horas e vinte.',
    'Você fica sentad{o|a} na varanda, e a Janine traz chá duas vezes e não pergunta nada, e na segunda vez ela senta do seu lado e fica.',
    'Quando ele volta, com uma folha fotocopiada e a mão um pouco trêmula, é a única vez em que Koga parece velho.',
    '**ATA DA 41ª REUNIÃO ORDINÁRIA — 14/08/1997 — ITEM 4: CREDENCIAMENTO DE RECEPTOR DE FAUNA EXCEDENTE**',
    '**DELIBERAÇÃO: APROVADO POR UNANIMIDADE**',
    '**RECEPTOR: ARMAZÉM GERAL 7 — CELADON — ALVARÁ MUNICIPAL 3.318**',
    'Você lê o número do alvará três vezes.',
    'Três mil trezentos e dezoito.',
    d=>c12_viuOGalpao(d)
      ? 'É o número da placa de esmalte parafusada na parede de um galpão cinza com portão de enrolar azul, numa zona de serviço de Celadon' + (c12_contouGaiolas(d) ? ', onde você contou quarenta e uma gaiolas.' : '.')
      : 'Um armazém em Celadon, com alvará da prefeitura de lá, credenciado por sete pessoas numa cidade que vive de uma cerca.',
    d=>c12_contouGaiolas(d) ? 'Você esteve lá. Você viu as plaquetas com número de processo. E o número de alvará que autoriza tudo aquilo foi assinado por sete pessoas numa reunião de quarenta minutos em Fuchsia, em noventa e sete.' : '',
    'Koga olha a sua cara e entende antes de você falar.',
    d=>c12_viuOGalpao(d) ? fala('Koga', 'Você conhece.') : fala('Koga', 'Você sabe onde fica isso.'),
    d=>fala(d.jogador.nome, c12_viuOGalpao(d) ? 'Eu conheço.' : 'Agora eu sei o nome.')
  ],
  ef:{flag:['ligou_fuchsia_celadon','provas_zona'],
      itens:{'Ata da 41ª reunião':1},
      npc:{nome:'Koga', opiniao:10, memoria:'Achou a ata de 1997 e descobriu, com você, que credenciou o Armazém Geral 7 de Celadon.'},
      rep:{eixo:'bom',delta:6,motivo:'Ligou a reserva de Fuchsia ao armazém de Celadon com um número de alvará'},
      instabilidade:2, moral:-10,
      registrar:'O receptor credenciado da Zona Safári é o Armazém Geral 7 de Celadon, alvará 3.318.',
      presagio:d=>c12_viuOGalpao(d) ? 'Alvará 3.318. A mesma placa de esmalte. O círculo fechou e ele tem três anos de idade.' : 'Alvará 3.318. Um número numa ata de três anos atrás, e um galpão em algum lugar com o mesmo número na parede.',
      executar:d=>{ Relogio.avancar(2); return []; }},
  escolhas:[
    {texto:'"Então a gente descredencia."', vai:'c12_descredenciar', cond:d=>!Historia.jaAconteceu('c12_descredenciar')},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar a ata pra Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir falar com o diretor com a ata na mão.', vai:'c12_diretor'}
  ]
},

c12_descredenciar:{
  falante:'Koga',
  vozes:['P','N','N','P','N','N','N'],
  texto:[
    '"Então a gente descredencia."',
    '"Sim."',
    'Ele guarda a folha fotocopiada na pasta com barbante.',
    d=>d.flags.c12_ja_convocado ? '"Descredenciamento é item de pauta de reunião extraordinária, e a extraordinária já está convocada. Exige maioria simples: quatro dos sete."' : '"Descredenciamento é item de pauta de reunião extraordinária, que leva onze dias, e exige maioria simples: quatro dos sete."',
    '"E você tem quatro?"',
    '"Eu tenho um."',
    'Ele amarra o barbante.',
    d=>`"Mas eu tenho ${c12_dias(c12_diasPraReuniao(d))} e o telefone de seis pessoas que assinaram uma coisa sem ler, e nenhuma delas quer estar na ata que credenciou o galpão de Celadon quando isso virar assunto."`,
    'Ele te olha.',
    '"Vergonha é o instrumento político mais subestimado de Kanto."'
  ],
  ef:{flag:['koga_descredencia','koga_aliado'],
      executar:d=>{ Estado.marcar('c12_ja_convocado', d.flags.c12_convocou != null); c12_convocar(d); return []; },
      npc:{nome:'Koga', opiniao:10, memoria:'Vai pautar o descredenciamento do Armazém Geral 7 em reunião extraordinária.'},
      rep:{eixo:'bom',delta:5,motivo:'O caminho lento virou um plano com data'},
      moral:12,
      registrar:d=>`Koga vai pautar o descredenciamento do Armazém Geral 7. A reunião é ${c12_emDias(c12_diasPraReuniao(d))}.`,
      presagio:'"Vergonha é o instrumento político mais subestimado de Kanto." Ele está certo.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Desafiar o ginásio.', vai:'c12_desafio_koga', cond:d=>!Historia.jaAconteceu('c12_desafio_koga')}
  ]
},

c12_koga_relatorio:{
  falante:'Koga',
  vozes:['N','N','N','P','N'],
  texto:[
    'Ele te dá o relatório inteiro: setenta e duas páginas, com anexo técnico, mapa por setor e a tabela de censo dos últimos seis anos.',
    '"Isso é cópia minha. Eu tenho direito a uma e eu peço todo ano."',
    'Ele amarra a pasta com barbante antes de entregar, e o barbante é a coisa que te desmonta: ele amarra porque é assim que ele guarda, e agora essa coisa é sua.',
    '"Uma advertência." Ele segura a pasta mais um segundo. "Isso não prova crime nenhum."',
    '"Prova o quê, então?"',
    '"Prova que a conta está errada. Crime é uma pessoa fazer de propósito. Conta errada é uma instituição fazendo de bom grado."',
    'Ele solta a pasta.',
    d=>fala('Koga', `A segunda mata mais e ninguém vai preso. ${c12_saudacao(d)}.`)
  ],
  ef:{flag:['tem_o_relatorio','provas_zona'],
      itens:{'Relatório de manejo (cópia do Koga)':1},
      npc:{nome:'Koga', opiniao:6, memoria:'Te entregou a cópia pessoal dele do relatório de manejo, amarrada com barbante.'},
      rep:{eixo:'bom',delta:4,motivo:'Saiu com setenta e duas páginas que provam o erro'},
      registrar:'Recebeu de Koga a cópia do relatório de manejo com anexo técnico e censos.',
      presagio:'"Conta errada é uma instituição fazendo de bom grado." Essa é a tese de tudo o que você viu aqui.'},
  escolhas:[
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_desafio_koga:{
  texto:[
    d=>fala(d.jogador.nome, 'Me deixa desafiar o ginásio.'),
    'Ele olha o relógio de parede.',
    d=>c12_ginasioAberto(d)
      ? fala('Koga', 'Hoje é dia, e o horário é agora. Mas ninguém desafia ginásio pela varanda dos fundos.')
      : fala('Koga', 'Quarta e sexta, das duas às seis.'),
    d=>{ if (c12_ginasioAberto(d)) return '';
         const p = c12_proximoGinasio(d), dia = Calendario.SEMANA[p.s];
         return fala(d.jogador.nome, p.k === 0 ? 'Eu posso não estar aqui às duas.' : p.k === 1 ? 'Eu posso não estar aqui amanhã.' : `Eu posso não estar aqui na ${dia}.`); },
    d=>c12_ginasioAberto(d) ? '' : fala('Koga', 'Então você não desafia.'),
    d=>c12_ginasioAberto(d) ? 'Ele aponta o portão da frente, do outro lado da casa.' : 'Ele diz isso sem nenhuma dureza, e depois faz uma coisa inesperada: sorri.',
    fala('Koga', 'Horário existe pra que as pessoas possam contar com ele. Um ginásio que abre quando dá é um ginásio que ninguém pode planejar visitar, e aí só desafia quem mora perto.'),
    d=>fala(d.jogador.nome, 'Isso é sobre a reserva também?'),
    d=>{ if (c12_ginasioAberto(d)) return fala('Koga', 'Tudo aqui é sobre a reserva. Dá a volta e entra pela porta, como todo mundo. Eu chego lá antes de você, e eu não vou pegar leve.');
         const p = c12_proximoGinasio(d), dia = Calendario.SEMANA[p.s];
         const quando = p.k === 0 ? 'Hoje' : p.k === 1 ? 'Amanhã' : dia.charAt(0).toUpperCase() + dia.slice(1);
         return fala('Koga', `Tudo aqui é sobre a reserva. ${quando}, duas da tarde. Se você estiver viv{o|a} e na cidade, eu luto com você, pela porta da frente, e eu não vou pegar leve.`); }
  ],
  ef:{flag:'koga_marcou',
      npc:{nome:'Koga', opiniao:4, memoria:'Recusou lutar fora do horário: o ginásio abre quarta e sexta, das 14h às 18h.'},
      registrar:'Koga luta no ginásio, pela porta da frente, quarta e sexta, das 14h às 18h. Sem exceção.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'}
  ]
},

/* voltar ao Koga: o chá já servido, e o que ainda falta conversar */
c12_koga_de_novo:{
  repetivel:true,
  texto:[
    d=>d.flags.koga_tem_tudo
      ? 'Koga te recebe na varanda dos fundos com a sua pilha amarrada com barbante do lado dele, esperando a reunião.'
      : 'Koga te recebe de novo na varanda dos fundos, com o chá já servido, como se estivesse esperando.',
    fala('Koga', 'O que você trouxe?'),
    'Você conta o que tem. Ele ouve tudo antes de responder, como da outra vez.'
  ],
  escolhas:[
    {texto:'"A planilha é de 1971 e a reserva cresceu em 85."', vai:'c12_koga_planilha', cond:d=>!!d.flags.entendeu_a_conta && !Historia.jaAconteceu('c12_koga_planilha')},
    {texto:'"Me dá o relatório."', vai:'c12_koga_relatorio', cond:d=>!Historia.jaAconteceu('c12_koga_relatorio')},
    {texto:'"Como assim enchendo a reserva?"', vai:'c12_enchendo', cond:d=>!Historia.jaAconteceu('c12_enchendo')},
    {texto:'"Quem assina as duas coisas?"', vai:'c12_quem_assina', cond:d=>Historia.jaAconteceu('c12_enchendo') && !Historia.jaAconteceu('c12_quem_assina')},
    {texto:'"Procura o nome. Eu espero."', vai:'c12_procurou_o_nome', cond:d=>Historia.jaAconteceu('c12_quem_assina') && !Historia.jaAconteceu('c12_procurou_o_nome')},
    {texto:'"Então a gente derruba o relatório."', vai:'c12_derrubar_relatorio', cond:d=>!!d.flags.provou_o_erro && !Historia.jaAconteceu('c12_derrubar_relatorio')},
    {texto:'"Então a gente descredencia."', vai:'c12_descredenciar', cond:d=>!!d.flags.ligou_fuchsia_celadon && !Historia.jaAconteceu('c12_descredenciar')},
    {texto:'Entregar a pilha inteira, para a reunião do conselho.', vai:'c12_entregou_koga', cond:d=>c12_pilha(d).length > 0 && !Historia.jaAconteceu('c12_entregou_koga')},
    {texto:'"Me deixa desafiar o ginásio."', vai:'c12_desafio_koga', cond:d=>!Historia.jaAconteceu('c12_desafio_koga')},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona', repetivel:true},
    {texto:'Falar com o diretor.', vai:'c12_diretor', repetivel:true},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara, repetivel:true}
  ]
},

/* ─────────────── O PASSEIO, A MÉDICA E O DIRETOR ─────────────── */

c12_passeio:{
  texto:[
    d=>d.flags.c12_espera_passeio === 'tarde' ? 'O último passeio do dia já saiu. O ingresso vale pro primeiro de amanhã, às nove, e você volta na hora.'
      : d.flags.c12_espera_passeio === 'cedo' ? 'O primeiro passeio sai às nove. Você espera na catraca.' : '',
    'O guia tem vinte e dois anos, uniforme cáqui com o nome bordado — ORIN — e um texto decorado que ele recita há um ano e que ainda não ficou automático, porque ele ainda olha pra ver se as pessoas estão gostando.',
    'O grupo tem onze pessoas: um casal de idosos, uma família com duas crianças, quatro adolescentes e você.',
    'O passeio é honesto e bonito, e essa é a parte que complica tudo.',
    'Você vê Nidorino em bando, na borda de um capinzal, a uns quarenta metros. Vê um Kangaskhan com filhote, e o Orin faz todo mundo parar e falar baixo, e a criança de seis anos chora de emoção e o pai fica com vergonha e o Orin diz "pode chorar, eu chorei na primeira vez".',
    'Vê Scyther a distância segura, dois, num tronco caído.',
    'E o folheto plastificado é bom: tem a classificação da Pokédex, tem o que a espécie come, tem em que setor costuma estar.',
    'Alguém fez isso com cuidado.',
    'Na volta, o grupo passa por uma trilha lateral que o Orin contorna sem comentar — ele nem desacelera, ele só faz a curva um pouco mais aberta.',
    'Na trilha lateral, no chão, tem trilho.',
    'Trilho de carrinho de carga, de bitola estreita, novo, com a superfície polida de uso, indo na direção oposta à saída.'
  ],
  ef:{flag:['viu_o_trilho','fez_o_passeio'],
      registrar:'No passeio guiado há uma trilha lateral com trilho de carga novo, que o guia contorna.',
      presagio:'Trilho polido de uso. Não é obra: é rotina.',
      executar:d=>{ c12_esperaPasseio(d); return []; }},
  escolhas:[
    {texto:'Perguntar ao guia sobre o trilho, na frente do grupo.', vai:'c12_guia_perguntado'},
    {texto:'Procurar o guia depois do expediente.', vai:'c12_nico'},
    {texto:'Ficar para trás e seguir o trilho agora.', vai:'c12_ficou_pra_tras'},
    {texto:'Não perguntar nada e voltar à noite.', vai:'c12_noite_zona'}
  ]
},

c12_ficou_pra_tras:{
  falante:'Guia Orin',
  vozes:['N','N'],
  texto:[
    'Você fica pra trás na curva e deixa o grupo seguir, e ninguém conta cabeça num passeio de onze pessoas até o fim.',
    'Você anda o trilho por setecentos metros.',
    'E aí o trilho passa por baixo de um portão de tela com placa de **ÁREA TÉCNICA — ACESSO RESTRITO**, e do outro lado do portão tem uma clareira, e na clareira tem estrutura de tubo galvanizado.',
    'Você não chega a ver o que tem dentro da estrutura porque uma mão fecha no seu ombro por trás.',
    'É o Orin.',
    'Ele está branco e está ofegante de ter corrido setecentos metros, e a primeira coisa que ele faz não é te repreender.',
    'É te puxar pra trás de uma moita.',
    '"Fica quiet{o|a}", ele sussurra. "Tem plantão."'
  ],
  ef:{flag:['quase_viu_o_setor7','nico_te_salvou'],
      npc:{nome:'Guia Orin', opiniao:3, memoria:'Correu setecentos metros para te puxar de trás de uma moita antes do plantão te ver.'},
      registrar:'O guia Orin te impediu de ser visto pelo plantão do setor 7.',
      presagio:'Ele correu. Ele não gritou, não chamou ninguém, não te entregou. Ele correu.'},
  escolhas:[
    {texto:'"O que tem ali?"', vai:'c12_nico'},
    {texto:'Ir embora com ele e conversar fora.', vai:'c12_nico'},
    {texto:'Ignorar e continuar.', vai:'c12_setor7'},
    {texto:'Voltar e vir à noite.', vai:'c12_noite_zona'}
  ]
},

c12_guia_perguntado:{
  falante:'Guia Orin',
  vozes:['P','N','N','N','N'],
  texto:[
    '"Pra onde vai esse trilho?"',
    'Ele congela por um segundo e meio. Os outros dez turistas não percebem porque estão tirando foto de um Doduo.',
    '"Manutenção", ele diz, e o texto volta a ser recitado. "Área técnica."',
    'E ele emenda direto na próxima parte do roteiro, e aponta pro Doduo, e fala do hábito alimentar do Doduo com muito mais entusiasmo do que ele tinha falado dos outros.',
    'No fim do passeio, quando o grupo já está indo pra van, ele te segura pelo braço.',
    'Ele continua sorrindo, porque tem turista olhando, e fala olhando pra frente:',
    '"Não volta aqui de noite."',
    '"Sério. Eu sou de Fuchsia, meu pai trabalhou aqui trinta anos, meu avô trabalhou aqui."',
    '"Não volta."',
    'Ele solta o seu braço e vai embora quase correndo, e acena pro casal de idosos, e o casal acena de volta.'
  ],
  ef:{npc:{nome:'Guia Orin', opiniao:1, memoria:'Te avisou, apavorado e sorrindo, para não voltar à Zona à noite.'},
      flag:'aviso_do_guia',
      presagio:'Ele sorriu o tempo inteiro. Todo mundo aqui sorri o tempo inteiro.'},
  escolhas:[
    {texto:'Procurar o Orin depois do expediente.', vai:'c12_nico'},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Voltar à noite.', vai:'c12_noite_zona'}
  ]
},

c12_nico:{
  falante:'Guia Orin',
  vozes:['N','N','N','P','N','N','N'],
  texto:[
    d=>d.flags.quase_viu_o_setor7 ? 'Atrás da moita, ele não responde nada. Ele te devolve pro grupo por uma trilha de fora, e na catraca, sem olhar pra você, diz uma coisa só.' : '',
    d=>d.flags.quase_viu_o_setor7 ? fala('Guia Orin', 'Saída dos funcionários. Seis e quarenta.', 'baixo') : '',
    d=>d.flags.quase_viu_o_setor7 ? 'Às seis e quarenta ele sai pela porta dos funcionários e vem direto até você, sem olhar pros lados.' : 'Você espera o Orin na saída dos funcionários, às dezoito e quarenta.',
    d=>d.flags.quase_viu_o_setor7 ? '' : 'Ele te vê e quase volta pra dentro, e não volta porque a porta já fechou atrás dele e reabrir daria mais na vista.',
    'Vocês conversam encostados num muro, no escuro, do lado de um contêiner de lixo, e ele fala muito rápido e muito baixo.',
    '"Setor 7 é fechado há dois anos por “recuperação ambiental”. Ninguém recupera nada lá."',
    '"Entra carrinho vazio e sai carrinho cheio. Eu levo turista trezentos metros dali quatro vezes por dia."',
    '"Eu contei pro diretor. Faz quatro meses. Eu marquei hora, eu fui de camisa, eu ensaiei."',
    '"E?"',
    '"E ele me ouviu inteiro, anotou, agradeceu, e disse que ia apurar."',
    'Ele passa a mão no rosto.',
    '"Isso foi faz quatro meses, cara. Quatro meses, e eu ainda tô levando turista trezentos metros dali."',
    '"Eu tenho esse emprego e mais nada. Eu tenho isso e mais nada, e meu pai tá com problema de coluna, e a gente mora nos fundos da casa da minha tia."'
  ],
  ef:{flag:['sabe_do_setor7','nico_falou'],
      npc:{nome:'Guia Orin', opiniao:4, memoria:'Te contou tudo sobre o setor 7 encostado num muro, no escuro, ao lado de um contêiner de lixo.'},
      moral:-5,
      registrar:'Orin denunciou o setor 7 ao diretor há quatro meses e nada aconteceu.',
      executar:d=>{ if (c12_hora(d) < 19) Relogio.ate(19); return []; }},
  escolhas:[
    {texto:'"Eu não vou falar seu nome pra ninguém."', vai:'c12_protegeu_nico'},
    {texto:'"Você vai comigo hoje à noite."', vai:'c12_nico_vai'},
    {texto:'"Então você é cúmplice."', vai:'c12_nico_acusado'},
    {texto:'"Me desenha o mapa e fica em casa."', vai:'c12_mapa_do_nico'}
  ]
},

c12_protegeu_nico:{
  falante:'Guia Orin',
  vozes:['P','N','P','N','N','N','N','N'],
  texto:[
    '"Eu não vou falar seu nome pra ninguém."',
    'Ele para de falar rápido pela primeira vez.',
    '"Por quê?"',
    '"Porque você tem esse emprego e mais nada."',
    'Ele olha o contêiner de lixo por um tempo.',
    '"Todo mundo que aparece aqui quer que eu seja testemunha." Ele fala mais devagar agora. "Ninguém nunca falou isso."',
    'Ele tira uma chave do bolso — uma chave só, numa argolinha, sem chaveiro — e põe na sua mão.',
    '"Portão de serviço da trilha três. Não é o do asfalto, é o de pedestre, que fica na curva depois do bebedouro."',
    '"Devolve amanhã na recepção, no balcão, dentro de um envelope, sem falar comigo."',
    'Ele já está andando.',
    '"E se te pegarem com ela, essa chave você achou no chão."'
  ],
  ef:{flag:['protegeu_nico','tem_a_chave_do_nico'],
      itens:{'Chave do portão de pedestre':1},
      npc:{nome:'Guia Orin', opiniao:7, memoria:'Te deu a chave do portão de pedestre depois que você prometeu não usar o nome dele.'},
      rep:{eixo:'bom',delta:3,motivo:'Protegeu a fonte antes de usar a fonte'},
      registrar:'Orin te deu a chave do portão de pedestre da trilha três.',
      presagio:'"Essa chave você achou no chão." Ele pensou nisso antes de oferecer.'},
  escolhas:[
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia antes.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor antes.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'}
  ]
},

c12_mapa_do_nico:{
  falante:'Guia Orin',
  vozes:['P','N','P','N','P','N','N','P'],
  texto:[
    '"Me desenha o mapa e fica em casa."',
    'Ele pisca.',
    '"Como assim fica em casa?"',
    '"Você não precisa ir. Você precisa que alguém vá."',
    'Ele encosta na parede e respira fundo e faz uma coisa que você não esperava: ele senta no chão, no meio-fio, do lado do contêiner.',
    '"Eu levei meses ensaiando pra falar com o diretor."',
    '"Eu sei."',
    '"E faz quatro meses que eu ensaio pra ir lá sozinho, e eu sei que eu não vou, e eu sei que eu não vou porque eu já sei que eu não vou."',
    'Ele pega o folheto plastificado do bolso, vira do lado branco, e desenha.',
    'Desenha bem: ele conhece cada curva, cada bebedouro, cada mourão de cerca, e marca os três pontos de plantão com X e a hora da ronda ao lado de cada um.',
    'Quando termina, ele entrega e não solta na hora.',
    '"Se der errado, eu vou dizer que não te conheço."',
    '"Diz mesmo."'
  ],
  ef:{flag:['tem_o_mapa_do_nico','protegeu_nico'],
      itens:{'Mapa do Orin (no verso do folheto)':1},
      npc:{nome:'Guia Orin', opiniao:6, memoria:'Desenhou o mapa do setor 7 no verso de um folheto e ficou em casa, com a sua permissão.'},
      rep:{eixo:'bom',delta:3,motivo:'Deixou alguém ajudar sem se destruir'},
      moral:8,
      registrar:'Orin desenhou o mapa do setor 7 com os três pontos de plantão e os horários de ronda.'},
  escolhas:[
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'}
  ]
},

c12_nico_vai:{
  falante:'Guia Orin',
  vozes:['P'],
  texto:[
    '"Você vai comigo hoje à noite."',
    'Ele diz não quatro vezes.',
    'Na primeira, alto. Na segunda, explicando o emprego. Na terceira, explicando o pai e a coluna. Na quarta, já baixinho, olhando pro chão.',
    'E vai.',
    'É isso que acontece quando alguém quer muito que alguém insista, e passou quatro meses esperando que alguém insistisse.',
    'Ele passa em casa, troca o uniforme cáqui por uma camisa escura, e volta em onze minutos com uma lanterna e duas garrafas de água, porque ele é guia e guia sempre leva água.'
  ],
  ef:{flag:['nico_junto'],
      itens:{'Garrafa de água':1},
      npc:{nome:'Guia Orin', opiniao:6, memoria:'Foi com você ao setor 7, de noite, depois de dizer não quatro vezes.'},
      rep:{eixo:'bom',delta:1,motivo:'Convenceu alguém a fazer o que ele queria fazer'},
      presagio:'Ele levou água pra dois. Guia sempre leva água.'},
  escolhas:[{texto:'Ir à noite.', vai:'c12_noite_zona'}]
},

c12_nico_acusado:{
  falante:'Guia Orin',
  vozes:['P','N','N'],
  texto:[
    '"Então você é cúmplice."',
    'Ele recebe a frase como um soco, no lugar exato onde ela foi mirada.',
    '"Sou."',
    'Ele nem se defende.',
    '"Sou mesmo. Eu levo onze pessoas por vez a trezentos metros daquilo e eu falo do hábito alimentar do Doduo."',
    'Ele vai embora sem dizer mais nada, sem correr, sem olhar pra trás.',
    'Fica você, o muro, o contêiner e a frase, que agora é sua.'
  ],
  ef:{npc:{nome:'Guia Orin', opiniao:-2, memoria:'Você o chamou de cúmplice. Ele concordou e foi embora.'},
      flag:'afastou_nico', moral:-8,
      registrar:'Chamou o Orin de cúmplice. Ele concordou.'},
  escolhas:[
    {texto:'Ir sozinh{o|a} à noite.', vai:'c12_noite_zona'},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Ir atrás dele e pedir desculpa.', vai:'c12_pediu_desculpa_nico'}
  ]
},

c12_pediu_desculpa_nico:{
  falante:'Guia Orin',
  vozes:['P','N','P','N'],
  texto:[
    'Você anda Fuchsia inteira à noite procurando e acha ele nos fundos da casa da tia, sentado num degrau, sem lanterna, no escuro.',
    '"Desculpa."',
    'Ele não olha pra cima.',
    '"Você tava cert{o|a}."',
    '"Eu tava cert{o|a} e eu não devia ter falado."',
    'Ele ri sem nenhum humor.',
    '"Essas duas coisas juntas são a coisa mais adulta que alguém me falou esse ano, e você tem {idade} anos, e isso me deixa muito mal."',
    'Ele dá um espaço no degrau com o quadril e você senta.',
    'Ficam ali um tempo.',
    'Depois ele entra em casa e volta com o folheto plastificado e uma caneta, e desenha o mapa, e não fala mais nada enquanto desenha.'
  ],
  ef:{flag:['tem_o_mapa_do_nico'], limpaFlag:'afastou_nico',
      itens:{'Mapa do Orin (no verso do folheto)':1},
      npc:{nome:'Guia Orin', opiniao:5, memoria:'Você voltou para pedir desculpa. Ele te deu o mapa em silêncio, sentado num degrau.'},
      rep:{eixo:'bom',delta:3,motivo:'Voltou para pedir desculpa'},
      moral:10,
      registrar:'Pediu desculpa ao Orin e recebeu o mapa.',
      executar:d=>{ Relogio.avancar(1); return []; },
      presagio:'"Essas duas coisas juntas." Ele reparou que você não usou o certo como desculpa.'},
  escolhas:[
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Falar com o diretor.', vai:'c12_diretor'},
    {texto:'Ir pro bar.', vai:'c12_bar'}
  ]
},

c12_yara:{
  falante:'Dra. Pia',
  vozes:['N','P','N','P','N','N','N'],
  texto:[
    c12_linhaDaEspera,
    d=>`A casa da rua da escola tem um portão baixo, um Growlithe velho dormindo ${c12_deDia(d) ? 'no sol' : 'no degrau'} e uma van branca com o adesivo **MÉDICA DE POKÉMON — ATEND. FAUNA** na porta.`,
    'A Dra. Pia tem uns quarenta e cinco anos e atende no quintal, porque o consultório dela é o quintal.',
    'Ela está fazendo curativo num Pidgey de asa quebrada quando você chega, e não para de fazer pra conversar.',
    '"Eu atendo a reserva por contrato. Doze horas por semana, terça inteira e quinta de manhã."',
    '"O que você faz nas terças?"',
    'E ela responde na hora, sem hesitar, porque pra ela não é segredo:',
    '"Marcação e triagem."',
    '"Marcação?"',
    '"Brinco. Brinco auricular numerado, de plástico, amarelo." Ela mostra um, no bolso do avental, porque ela anda com eles. "Todo Pokémon que entra no setor de triagem recebe um número antes de sair."',
    'Ela termina o curativo.',
    '"Eu marco entre cinquenta e oitenta por terça."'
  ],
  ef:{flag:['conheceu_yara','sabe_do_brinco'],
      npc:{nome:'Dra. Pia', opiniao:1, memoria:'Médica de Pokémon contratada da reserva; marca de 50 a 80 Pokémon por terça-feira.'},
      registrar:'A Dra. Pia faz marcação e triagem no setor 7 todas as terças: 50 a 80 por dia.',
      presagio:'Ela anda com brinco no bolso do avental. Isso é rotina, não crime.',
      executar:d=>{ c12_esperaPia(d); return []; }},
  escolhas:[
    {texto:'"Oitenta por terça dá quatro mil por ano."', vai:'c12_a_conta_da_yara', cond:d=>!Historia.jaAconteceu('c12_a_conta_da_yara')},
    {texto:'"O que é triagem?"', vai:'c12_triagem', cond:d=>!Historia.jaAconteceu('c12_triagem')},
    {texto:'"Você sabe pra onde eles vão?"', vai:'c12_yara_pra_onde', cond:d=>!Historia.jaAconteceu('c12_yara_pra_onde')},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva', cond:d=>!Historia.jaAconteceu('c12_yara_leva')}
  ]
},

/* voltar à Dra. Pia: o mesmo quintal, outro Pokémon na mesa */
c12_pia_de_novo:{
  repetivel:true,
  texto:[
    c12_linhaDaEspera,
    d=>`A Dra. Pia está no quintal, com outro Pokémon na mesa e o mesmo avental, e o Growlithe ${c12_deDia(d) ? 'continua dormindo no sol' : 'continua no degrau'}.`,
    d=>d.flags.yara_aliada ? fala('Dra. Pia', 'Entra. O portão está aberto pra você.')
      : fala('Dra. Pia', 'Pode falar. Eu não paro de trabalhar, mas eu ouço.')
  ],
  ef:{executar:d=>{ c12_esperaPia(d); return []; }},
  escolhas:[
    {texto:'"Oitenta por terça dá quatro mil por ano."', vai:'c12_a_conta_da_yara', cond:d=>!Historia.jaAconteceu('c12_a_conta_da_yara')},
    {texto:'"O que é triagem?"', vai:'c12_triagem', cond:d=>!Historia.jaAconteceu('c12_triagem')},
    {texto:'"Me dá essa ficha técnica."', vai:'c12_ficha_tecnica', cond:d=>!!d.flags.ficha_do_receptor && !Historia.jaAconteceu('c12_ficha_tecnica')},
    {texto:'"Você sabe pra onde eles vão?"', vai:'c12_yara_pra_onde', cond:d=>!Historia.jaAconteceu('c12_yara_pra_onde')},
    {texto:'"Me dá os formulários que você assina."', vai:'c12_formularios', cond:d=>!!(d.flags.sabe_do_apto || d.flags.viu_as_vias) && !Historia.jaAconteceu('c12_formularios')},
    {texto:'"Para de assinar."', vai:'c12_yara_para', cond:d=>!!(d.flags.sabe_do_apto || d.flags.sabe_da_triagem) && !Historia.jaAconteceu('c12_yara_para')},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva', cond:d=>!Historia.jaAconteceu('c12_yara_leva')},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona', repetivel:true},
    {texto:'Falar com o diretor.', vai:'c12_diretor', repetivel:true},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia, repetivel:true}
  ]
},

c12_a_conta_da_yara:{
  falante:'Dra. Pia',
  vozes:['P','N','P','N','N','P','N','N','P','N'],
  texto:[
    '"Oitenta por terça dá quatro mil por ano."',
    'Ela para com o Pidgey na mão.',
    '"Não dá não."',
    '"Cinquenta e duas terças. Oitenta. Quatro mil cento e sessenta."',
    'Ela olha pro lado.',
    '"O relatório fala em duzentos e quarenta."',
    'Você não diz nada, porque não precisa.',
    'Ela põe o Pidgey na caixa de transporte com muito cuidado e fecha a portinha e fica com a mão na portinha.',
    '"Duzentos e quarenta é o número de retirada aprovada."',
    '"E os outros três mil e novecentos?"',
    '"Os outros três mil e novecentos são “manejo sanitário”, que é outra rubrica, que não vai a conselho, que é decisão técnica, e a decisão técnica é minha."',
    'Ela tira a mão da portinha.',
    '"Eu assino um formulário por lote. Eu assino uns oito por terça."',
    '"E o formulário diz o quê?"',
    '"Diz “apto para transporte”."'
  ],
  ef:{flag:['sabe_dos_quatro_mil','sabe_do_apto'],
      npc:{nome:'Dra. Pia', opiniao:3, memoria:'Fez com você a conta de quatro mil por ano e percebeu o que ela assina.'},
      rep:{eixo:'bom',delta:5,motivo:'Fez uma conta de multiplicação que desmontou um sistema inteiro'},
      instabilidade:2, moral:-12,
      registrar:'A retirada real da Zona Safári é ~4.160/ano; só 240 passam pelo conselho. O resto é "manejo sanitário".',
      presagio:'Duzentos e quarenta é o que se discute. Quatro mil é o que acontece.'},
  escolhas:[
    {texto:'"Para de assinar."', vai:'c12_yara_para', cond:d=>!Historia.jaAconteceu('c12_yara_para')},
    {texto:'"Me dá os formulários."', vai:'c12_formularios', cond:d=>!Historia.jaAconteceu('c12_formularios')},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva', cond:d=>!Historia.jaAconteceu('c12_yara_leva')},
    {texto:'"Você sabe pra onde eles vão?"', vai:'c12_yara_pra_onde', cond:d=>!Historia.jaAconteceu('c12_yara_pra_onde')}
  ]
},

c12_triagem:{
  falante:'Dra. Pia',
  vozes:['P','N','N','P','N','P','N','P','P','N','P','N','P','N'],
  texto:[
    '"O que é triagem?"',
    '"Separar por destino."',
    'Ela lava as mãos numa torneira de quintal enquanto explica, e a naturalidade é a parte difícil.',
    '"Categoria A: saudável, idade reprodutiva, espécie com demanda. Categoria B: saudável, fora do perfil. Categoria C: com problema clínico."',
    d=>{
      const p = d.time[0];
      if (!p) return '';
      const n = nomeExib(p), g = pron(p);
      if (!generoDe(p)) return `Você olha ${g.pro} ${n} sem querer. Sem sexo, sem idade reprodutiva: pela ficha que ela recebeu, categoria B. É a primeira vez que uma coisa dessas te alivia.`;
      return `Você olha ${g.pro} ${n} sem querer, e faz a conta sem querer: saudável, ${g.f ? 'fêmea' : 'macho'}, na idade. Pela ficha que ela recebeu, categoria A.`;
    },
    '"E cada categoria vai pra onde?"',
    '"A, para receptor credenciado. B, para soltura em área externa. C, para tratamento."',
    '"E quantos por cento são A?"',
    'Ela fecha a torneira.',
    '"Uns noventa."',
    '"Noventa por cento dos Pokémon de uma reserva são saudáveis, em idade reprodutiva e de espécie com demanda?"',
    'Ela seca as mãos no avental por muito mais tempo do que uma mão leva pra secar.',
    '"A triagem é feita por quem?", você pergunta.',
    '"Por mim."',
    '"Com que critério?"',
    '"Com o critério que está na ficha técnica que eu recebi quando entrei."',
    'Pausa.',
    '"E a ficha técnica veio de quem?"',
    'Ela para de secar as mãos.',
    '"Do receptor."'
  ],
  ef:{flag:['sabe_da_triagem','ficha_do_receptor'],
      npc:{nome:'Dra. Pia', opiniao:4, memoria:'Percebeu, respondendo a você, que o critério de triagem dela foi escrito pelo próprio comprador.'},
      rep:{eixo:'bom',delta:5,motivo:'Perguntou de onde vinha o critério'},
      moral:-15, instabilidade:1,
      registrar:'O critério de triagem da reserva foi escrito pelo próprio receptor credenciado. 90% caem na categoria A.',
      presagio:'O comprador escreveu a régua. Ninguém precisou subornar ninguém.'},
  escolhas:[
    {texto:'"Me dá essa ficha técnica."', vai:'c12_ficha_tecnica', cond:d=>!Historia.jaAconteceu('c12_ficha_tecnica')},
    {texto:'"Para de assinar."', vai:'c12_yara_para', cond:d=>!Historia.jaAconteceu('c12_yara_para')},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva', cond:d=>!Historia.jaAconteceu('c12_yara_leva')},
    {texto:'"Oitenta por terça dá quatro mil por ano."', vai:'c12_a_conta_da_yara', cond:d=>!Historia.jaAconteceu('c12_a_conta_da_yara')}
  ]
},

c12_ficha_tecnica:{
  falante:'Dra. Pia',
  vozes:['N','N'],
  texto:[
    'Ela entra em casa e volta com uma pasta plástica de quatro furos.',
    'A ficha técnica tem seis páginas, é datilografada, tem timbre, e o timbre é de uma empresa.',
    'Você vira pra última página e lá está o rodapé, em corpo oito:',
    '**Elaborado por: Departamento Técnico — Armazém Geral 7 — Celadon**',
    d=>d.flags.ligou_fuchsia_celadon ? 'O mesmo alvará. A mesma empresa que sete conselheiros credenciaram em quarenta minutos em noventa e sete.' :
       c12_contouGaiolas(d) ? 'Você conhece esse nome. Você esteve naquele galpão. Você contou quarenta e uma gaiolas lá dentro.' :
       c12_viuOGalpao(d) ? 'Você conhece esse nome. Você esteve na porta daquele galpão, em Celadon.' :
       'Um armazém em Celadon escreveu o manual médico de uma reserva de Kanto em Fuchsia.',
    'A Dra. Pia olha o rodapé com você, e ela já leu essa página, e ela nunca leu essa página.',
    '"Oito anos", ela diz. "Eu uso essa ficha há oito anos."'
  ],
  ef:{flag:['tem_a_ficha_tecnica','provas_zona','sabe_do_deposito'],
      itens:{'Ficha técnica de triagem':1},
      npc:{nome:'Dra. Pia', opiniao:6, memoria:'Te entregou a ficha técnica e viu, com você, de quem era o timbre.'},
      rep:{eixo:'bom',delta:5,motivo:'Achou o documento que liga o comprador ao critério'},
      moral:-10,
      registrar:'A ficha técnica de triagem da reserva foi elaborada pelo Armazém Geral 7, de Celadon.',
      presagio:'Oito anos usando uma régua que o comprador fez. E ela é boa no que faz.'},
  escolhas:[
    {texto:'"Para de assinar."', vai:'c12_yara_para', cond:d=>!Historia.jaAconteceu('c12_yara_para')},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva', cond:d=>!Historia.jaAconteceu('c12_yara_leva')},
    {texto:'Levar isso pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'}
  ]
},

c12_yara_pra_onde:{
  falante:'Dra. Pia',
  vozes:['P','N','P','N'],
  texto:[
    '"Você sabe pra onde eles vão?"',
    '"Receptor credenciado."',
    '"Isso é um endereço?"',
    'Ela abre a boca e fecha.',
    '"Isso é um campo de formulário."',
    'E aí ela faz a coisa que faz dela uma boa médica e uma pessoa que dormiu mal por oito anos:',
    'ela vai buscar os formulários.',
    'Volta com uma caixa de papelão e senta no chão do quintal com você e abre.',
    'Centenas de vias amarelas, em ordem, presas com clipe por mês.',
    'As de antes de agosto de noventa e sete têm o campo DESTINO preenchido só com **RECEPTOR CREDENCIADO**. As de depois ganharam um carimbo novo: **RECEPTOR CREDENCIADO — CONF. ATA 41/1997**.',
    'Nenhuma com endereço. Nenhuma com nome. Nenhuma com registro comercial.',
    'Oito anos de via amarela apontando pra lugar nenhum, e três deles pra uma ata que ela nunca leu.'
  ],
  ef:{flag:['viu_as_vias','sabe_da_ata_41'],
      npc:{nome:'Dra. Pia', opiniao:5, memoria:'Sentou no chão do quintal com você e abriu oito anos de vias amarelas.'},
      rep:{eixo:'bom',delta:4,motivo:'Fez a pergunta "isso é um endereço?"'},
      instabilidade:1,
      registrar:'Oito anos de formulários de destino dizem só "receptor credenciado"; desde 1997, "conf. ata 41/1997".',
      presagio:'Tudo aponta pra uma ata. Alguém precisa ler a ata.'},
  escolhas:[
    {texto:'"Me dá um maço dessas vias."', vai:'c12_formularios', cond:d=>!Historia.jaAconteceu('c12_formularios')},
    {texto:'Procurar quem guarda as atas do conselho.', vai:'c12_koga', cond:d=>!!d.flags.sabe_do_conselho},
    {texto:'"Para de assinar."', vai:'c12_yara_para', cond:d=>!Historia.jaAconteceu('c12_yara_para')},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva', cond:d=>!Historia.jaAconteceu('c12_yara_leva')}
  ]
},

c12_formularios:{
  falante:'Dra. Pia',
  vozes:['N','N','P','N','N'],
  texto:[
    'Ela te dá um maço de cento e doze vias amarelas, presas com clipe, de janeiro até hoje.',
    'E te dá de um jeito que você não esquece: ela conta uma por uma antes de entregar, em voz alta, e no meio da contagem a voz falha e ela continua contando.',
    'Cento e doze.',
    '"Isso é cópia minha. Eu tenho direito."',
    'Ela põe o elástico.',
    '"E se alguém te perguntar quem te deu, você fala que fui eu."',
    '"Não precisa."',
    '"Precisa." Ela entrega. "Porque se eu não falar isso agora, eu vou passar os próximos meses torcendo pra ninguém perguntar, e eu já passei oito anos torcendo pra ninguém perguntar."'
  ],
  ef:{flag:['tem_as_vias','provas_zona','yara_aliada'],
      itens:{'112 vias amarelas de triagem':1},
      npc:{nome:'Dra. Pia', opiniao:9, memoria:'Te deu cento e doze vias amarelas e autorizou você a dar o nome dela.'},
      rep:{eixo:'bom',delta:5,motivo:'Recebeu uma prova com o nome de quem deu, autorizado'},
      moral:12,
      registrar:'Recebeu 112 vias amarelas de triagem da Dra. Pia, com autorização de citar o nome dela.',
      presagio:'Ela contou uma por uma em voz alta. Cada uma é um Pokémon.'},
  escolhas:[
    {texto:'Levar pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva', cond:d=>!Historia.jaAconteceu('c12_yara_leva')}
  ]
},

c12_yara_para:{
  falante:'Dra. Pia',
  vozes:['P','N','P','N','P','N','P','N','N','P','N','N'],
  texto:[
    '"Para de assinar."',
    '"Se eu parar de assinar, eles contratam outro médico de Pokémon."',
    '"Provavelmente."',
    '"E o outro não vai fazer curativo em Pidgey de graça no quintal."',
    '"Provavelmente não."',
    'Ela sorri sem nenhuma alegria.',
    '"Você não tá me convencendo muito bem."',
    '"Eu não tô tentando te convencer. Você perguntou o que acontece e eu respondi."',
    'Ela olha a caixa de transporte com o Pidgey.',
    '"Eu vou assinar terça."',
    'Pausa.',
    '"E eu vou escrever no campo de observação de cada um, com a minha letra, que o critério de triagem aplicado é de elaboração do receptor."',
    '"Isso muda alguma coisa?"',
    '"Isso não muda nada e fica registrado em cento e poucos documentos que passam por três setores."',
    'Ela olha pra você.',
    '"Você tem {idade} anos e eu tenho quarenta e cinco, e a gente acabou de descobrir junto que a minha arma é o campo de observação."'
  ],
  ef:{flag:['yara_vai_registrar','yara_aliada'],
      npc:{nome:'Dra. Pia', opiniao:8, memoria:'Vai escrever no campo de observação de cada formulário que o critério é do receptor.'},
      rep:{eixo:'bom',delta:5,motivo:'Não pediu heroísmo — deixou alguém achar a própria arma'},
      moral:12,
      registrar:'A Dra. Pia vai registrar no campo de observação a origem do critério de triagem.',
      presagio:'O campo de observação. Não é pouco: passa por três setores.'},
  escolhas:[
    {texto:'"Me leva lá na terça."', vai:'c12_yara_leva', cond:d=>!Historia.jaAconteceu('c12_yara_leva')},
    {texto:'"Me dá um maço das vias."', vai:'c12_formularios', cond:d=>!Historia.jaAconteceu('c12_formularios')},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia}
  ]
},

c12_yara_leva:{
  falante:'Dra. Pia',
  vozes:['P','N','P','N','P','N','P','N'],
  texto:[
    '"Me leva lá na terça."',
    'Ela pensa.',
    '"Eu levo auxiliar. Eu tenho direito a um auxiliar e eu nunca uso porque ninguém aguenta."',
    '"Eu aguento."',
    '"Você não sabe o que é."',
    '"Eu aguento."',
    'Ela te olha de cima a baixo.',
    '"Terça, seis e meia da manhã, aqui na porta. Camisa de manga comprida, bota fechada, e não come nada antes."',
    '"Por quê?"',
    '"Você vai entender às nove da manhã."'
  ],
  ef:{flag:['vai_com_a_yara','sabe_do_setor7'],
      npc:{nome:'Dra. Pia', opiniao:6, memoria:'Te credenciou como auxiliar dela para a terça no setor 7.'},
      rep:{eixo:'bom',delta:3,motivo:'Vai entrar pela porta da frente, de dia, com crachá'},
      registrar:'Vai entrar no setor 7 como auxiliar da médica, terça às 6h30.'},
  escolhas:[
    {texto:'Ir na terça, como auxiliar.', vai:'c12_terca'},
    {texto:'Ir hoje à noite, antes da terça.', vai:'c12_noite_zona'},
    {texto:'Falar com o diretor antes.', vai:'c12_diretor'},
    {texto:'Falar com o Koga antes.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia}
  ]
},

c12_terca:{
  falante:'Dra. Pia',
  vozes:['N'],
  texto:[
    'Terça, seis e meia. Você entra pela portaria, de van, com crachá de AUXILIAR TÉCNICO preso na camisa, e o porteiro levanta a cancela sem olhar duas vezes.',
    'É assim que se entra num lugar: com crachá, de manhã, de van.',
    'O setor 7 de dia é pior do que seria de noite, e demora um pouco pra você entender por quê.',
    'De noite seria clandestino. De dia é um expediente.',
    'Tem café numa garrafa térmica em cima de uma caixa. Tem rádio tocando baixinho numa estação de Fuchsia. Tem dois rapazes de luva conversando sobre o final de semana enquanto passam Pokémon do corredor de contenção pra baia de triagem.',
    'Tem uma balança. Tem uma prancheta. Tem uma caixa de brincos amarelos numerados.',
    'E tem fila.',
    'A Dra. Pia calça a luva, liga a lanterna de cabeça, e olha pra você.',
    '"Você segura, eu marco. Se você quiser sair a qualquer momento, você sai e ninguém comenta."',
    'São seis e quarenta e dois da manhã.'
  ],
  ef:{flag:['entrou_no_setor7_de_dia','viu_o_curral'],
      registrar:'Entrou no setor 7 de dia, como auxiliar da médica, com crachá.',
      executar:d=>{ Relogio.ateODia(1, 6); return []; }},
  escolhas:[
    {texto:'Segurar. Ficar o dia inteiro.', vai:'c12_o_dia_inteiro'},
    {texto:'Ficar até as nove e ver o que ela disse.', vai:'c12_nove_da_manha'},
    {texto:'Sair agora, antes de começar.', vai:'c12_saiu_da_terca'},
    {texto:'Fotografar tudo escondid{o|a}.', vai:'c12_fotografou_zona', cond:d=>(Estado.contaItem('Câmera descartável')>0) && !Historia.jaAconteceu('c12_fotografou_zona')}
  ]
},

c12_nove_da_manha:{
  falante:'Dra. Pia',
  vozes:['N'],
  texto:[
    'Às nove da manhã você entende.',
    'Não tem crueldade. Isso é o que ninguém te prepara pra ver.',
    'Os dois rapazes de luva são cuidadosos. Um deles conversa com os Pokémon — não baixinho, normal, do jeito que se conversa com Pokémon de estimação. A Dra. Pia é rápida e boa e o brinco leva menos de um segundo e o Pokémon reage mais ao susto do que à dor.',
    'Ninguém grita com ninguém. Ninguém chuta nada.',
    'E às nove da manhã chega o lote da baia 3, e a baia 3 é a baia dos filhotes, e a triagem de filhote é por peso, porque filhote abaixo de um peso não é “apto para transporte”.',
    'E aí você vê o que acontece com os que não são aptos.',
    'Eles voltam pra reserva. Eles são soltos.',
    'Sozinhos.',
    'Porque a mãe foi triada como categoria A às sete e quarenta.',
    'Você pergunta e a Dra. Pia responde sem parar de trabalhar, porque se ela parar ela não recomeça:',
    '"A ficha técnica não tem campo de vínculo."'
  ],
  ef:{flag:['viu_a_baia_tres','entendeu_o_horror'],
      moral:-25, instabilidade:2, hp:-3, causa:'Uma manhã na baia 3',
      rep:{eixo:'bom',delta:3,motivo:'Ficou até as nove da manhã'},
      registrar:'Filhotes fora do peso voltam sozinhos para a reserva. A ficha técnica não tem campo de vínculo.',
      executar:d=>{ Relogio.ate(9); return []; },
      presagio:'Não tem campo de vínculo. Um formulário decidiu isso, e ninguém decidiu o formulário.'},
  escolhas:[
    {texto:'Ficar o dia inteiro.', vai:'c12_o_dia_inteiro'},
    {texto:'Parar tudo agora, na frente de todo mundo.', vai:'c12_parou_a_triagem'},
    {texto:'Sair e voltar à noite para abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Fotografar a baia 3.', vai:'c12_fotografou_zona', cond:d=>(Estado.contaItem('Câmera descartável')>0) && !Historia.jaAconteceu('c12_fotografou_zona')}
  ]
},

c12_o_dia_inteiro:{
  falante:'Dra. Pia',
  vozes:['N'],
  texto:[
    'Você fica o dia inteiro.',
    'Doze horas. Setenta e um Pokémon marcados. Oito formulários assinados.',
    'Na metade da tarde você já está fazendo direito: você aprendeu a segurar sem apertar, a virar a orelha sem torcer, a falar baixo do jeito que ajuda.',
    'Você fica bom nisso.',
    'Essa é a parte que fica: você ficou bom nisso em seis horas.',
    'Às dezoito e quarenta a Dra. Pia tira a luva, senta no chão encostada na balança, e não fala nada por cinco minutos.',
    'Depois ela fala uma coisa só:',
    '"Todo mundo que entra aqui aguenta. Esse é o problema. Eu esperei oito anos por alguém que não aguentasse."',
    d=>d.flags.yara_vai_registrar ? 'E ela escreveu, nos oito formulários do dia, com a letra dela, que o critério aplicado é de elaboração do receptor.' : ''
  ],
  ef:{flag:['ficou_o_dia_inteiro','ficou_bom_nisso'],
      moral:-20, hp:-5, causa:'Doze horas no setor 7',
      rep:{eixo:'bom',delta:4,motivo:'Ficou as doze horas e não desviou o olho'},
      npc:{nome:'Dra. Pia', opiniao:8, memoria:'Passou doze horas com você no setor 7 e te disse que todo mundo aguenta.'},
      registrar:'Ficou as doze horas do turno de triagem. Setenta e um marcados.',
      executar:d=>{ if (c12_hora(d) < 19) Relogio.ate(19); return []; }},
  escolhas:[
    {texto:'Voltar à noite e abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir falar com o diretor agora, com o dia inteiro na cabeça.', vai:'c12_diretor'},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c12_parou_a_triagem:{
  falante:'Peão do setor 7',
  vozes:['P','N','N','N'],
  texto:[
    'Você para.',
    'Larga o Pokémon com cuidado na baia — você tem esse cuidado, mesmo agora — e fica de pé no meio do setor 7 e fala alto o suficiente pra todo mundo ouvir.',
    '"A mãe desse aqui saiu às sete e quarenta."',
    'Silêncio.',
    'O rádio continua tocando.',
    'Um dos rapazes de luva olha pro outro. A Dra. Pia não levanta a cabeça.',
    'E o mais velho dos dois — o que conversa com os Pokémon — responde, sem agressividade nenhuma, e a resposta dele é a coisa mais devastadora da semana:',
    '"Eu sei."',
    '"Eu sei qual é a mãe de qual há quatro anos, {moço|moça}. Eu sei todas."',
    'Ele ajeita a luva.',
    '"Eu só não tenho onde anotar."'
  ],
  ef:{flag:['parou_a_triagem','sabe_que_eles_sabem'],
      moral:-15, instabilidade:1,
      rep:{eixo:'bom',delta:3,motivo:'Falou alto no meio de um expediente'},
      npc:{nome:'Peão do setor 7', opiniao:3, memoria:'Sabe de cabeça, há quatro anos, qual filhote é de qual mãe. Não tem onde anotar.'},
      registrar:'Os peões do setor 7 sabem os vínculos de cabeça. Não existe campo no formulário.',
      presagio:'"Eu só não tenho onde anotar." Um campo de formulário. Era só isso.'},
  escolhas:[
    {texto:'"Então anota. Eu arrumo onde."', vai:'c12_arrumou_onde'},
    {texto:'Voltar à noite e abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Ficar o dia inteiro mesmo assim.', vai:'c12_o_dia_inteiro'},
    {texto:'Sair.', vai:'c12_saiu_da_terca'}
  ]
},

c12_arrumou_onde:{
  falante:'Peão do setor 7',
  vozes:['P','N','P','E','E','N','P'],
  texto:[
    '"Então anota. Eu arrumo onde."',
    'Você tira o seu caderno da mochila — o caderno em que você anota tudo desde que saiu de casa, o que já viu coisa demais.',
    'E arranca as folhas do meio, em branco, e dá pra ele.',
    'Ele olha as folhas.',
    '"Eu não escrevo bem."',
    '"Não precisa escrever bem."',
    'Ele senta na caixa da garrafa térmica com as folhas no joelho e começa.',
    'Leva quarenta minutos e ele não usa nome de espécie nem número de brinco.',
    'Ele escreve assim: "o de orelha rasgada é filho da que manca da pata de trás." "Os dois pequenos listrados são irmãos, do mesmo ninho, vieram juntos em abril."',
    'Quatro anos de memória de um homem que não escreve bem, em doze folhas de caderno.',
    'Quando acaba, ele entrega e não solta na hora.',
    '"Isso vale alguma coisa?"',
    '"Isso vale mais do que tudo que eu tenho na mochila."'
  ],
  ef:{flag:['tem_os_vinculos','provas_zona'],
      itens:{'Doze folhas de vínculos':1},
      npc:{nome:'Peão do setor 7', opiniao:8, memoria:'Escreveu quatro anos de vínculos familiares em doze folhas do seu caderno.'},
      rep:{eixo:'bom',delta:6,motivo:'Deu papel a quem tinha os dados e nenhum lugar para pôr'},
      moral:20,
      registrar:'Um peão do setor 7 escreveu quatro anos de vínculos familiares em doze folhas do seu caderno.',
      presagio:'"O de orelha rasgada é filho da que manca." Nenhum sistema de Kanto tem esse campo.'},
  escolhas:[
    {texto:'Voltar à noite e abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar tudo pro diretor.', vai:'c12_diretor'},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c12_saiu_da_terca:{
  texto:[
    'Você sai.',
    'Anda até a van, senta no banco do carona com a porta aberta e os pés pra fora, e fica ali.',
    'Ninguém comenta, exatamente como ela disse.',
    'Às dezoito e quarenta ela termina o turno, tira a luva, e senta no banco do motorista sem ligar o carro.',
    fala('Dra. Pia', 'Eu avisei.'),
    d=>fala(d.jogador.nome, 'Avisou.'),
    fala('Dra. Pia', 'Você durou quanto?'),
    d=>fala(d.jogador.nome, d.flags.viu_a_baia_tres ? 'Duas horas e meia.' : 'Doze minutos.'),
    'Ela liga o carro.',
    d=>d.flags.viu_a_baia_tres ? fala('Dra. Pia', 'É o recorde.')
      : fala('Dra. Pia', 'Os outros esperaram ver alguma coisa pra sair. Você saiu antes. Eu não sei se isso é melhor.')
  ],
  ef:{flag:'saiu_do_setor7', moral:-10,
      npc:d=>({nome:'Dra. Pia', opiniao:5, memoria:d.flags.viu_a_baia_tres
        ? 'Você durou duas horas e meia no setor 7. É o recorde de auxiliar dela.'
        : 'Você saiu do setor 7 antes de começar e esperou o dia inteiro na van.'}),
      registrar:d=>d.flags.viu_a_baia_tres ? 'Saiu do turno de triagem depois de duas horas e meia.' : 'Saiu do turno de triagem antes de começar e esperou na van.',
      presagio:d=>d.flags.viu_a_baia_tres ? 'É o recorde. Pensa em quantos auxiliares ela já levou.' : 'Ela não disse se era pior ou melhor. Ela ligou o carro.',
      executar:d=>{ if (c12_hora(d) < 19) Relogio.ate(19); return []; }},
  escolhas:[
    {texto:'Voltar à noite e abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor'},
    {texto:'Pedir os formulários a ela.', vai:'c12_formularios', cond:d=>!Historia.jaAconteceu('c12_formularios')}
  ]
},

/* ─────────────── O DIRETOR ─────────────── */

c12_diretor:{
  texto:[
    c12_linhaDoExpediente,
    'O diretor da Zona Safári, Quince na plaquinha da porta, tem sessenta e poucos anos e uma sala com fotos dele ao lado de gente importante ao longo de trinta e um anos.',
    'As fotos são dispostas em ordem cronológica e você consegue ver o cabelo mudando de cor da esquerda pra direita.',
    'A sala é pequena, o ar-condicionado é de janela, e a cadeira dele tem um remendo de fita adesiva no braço.',
    d=>`Ele te recebe com uma cordialidade desarmante — levanta, aperta a sua mão, oferece café, pergunta se você quer açúcar — e ouve inteira ${c12_perguntaAoDiretor(d)}, sem interromper, com as duas mãos apoiadas na mesa.`,
    d=>d.flags.c12_perguntou_do_sete ? '' : fala('Diretor Quince', 'Você está perguntando do setor 7.'),
    d=>d.flags.c12_perguntou_do_sete ? '' : 'Não é pergunta.',
    fala('Diretor Quince', 'Recuperação ambiental.'),
    'Ele nem hesita.',
    fala('Diretor Quince', 'Pastagem degradada, herança da fazenda que virou reserva em sessenta e nove. Estamos replantando.'),
    'Atrás dele, na parede, entre as fotos, tem uma planta baixa da reserva emoldurada, dessas que se manda emoldurar quando se tem orgulho.',
    'O setor 7 está marcado nela.',
    'E na marcação, escrito à mão, numa caligrafia antiga de caneta-tinteiro:',
    '**área de manejo**'
  ],
  ef:{npc:{nome:'Diretor Quince', opiniao:0, memoria:'Te disse que o setor 7 é recuperação ambiental.'},
      flag:'falou_com_diretor',
      presagio:'Caligrafia antiga, caneta-tinteiro, numa planta emoldurada. Ele mandou emoldurar sabendo.',
      /* a hora da diretoria, e o que você sabia antes de entrar */
      executar:d=>{ c12_esperaExpediente(d); Estado.marcar('c12_perguntou_do_sete', c12_sabeDoSete(d)); Estado.marcar('sabe_do_setor7'); return []; }},
  escolhas:[
    {texto:'"O que é área de manejo?"', vai:'c12_manejo', cond:d=>!Historia.jaAconteceu('c12_manejo')},
    {texto:'"Um guia te procurou faz quatro meses."', vai:'c12_o_nico_te_procurou', cond:d=>(!!d.flags.nico_falou) && !Historia.jaAconteceu('c12_o_nico_te_procurou')},
    {texto:'"A planilha é de 1971 e a reserva cresceu em 85."', vai:'c12_planilha_pro_diretor', cond:d=>(!!d.flags.entendeu_a_conta) && !Historia.jaAconteceu('c12_planilha_pro_diretor')},
    {texto:'"Eu sei o que tem lá." Blefar.', vai:'c12_blefe_diretor'}
  ]
},

/* voltar ao diretor: ele lembra do açúcar, e do que aconteceu desde então */
c12_diretor_de_novo:{
  repetivel:true,
  texto:[
    c12_linhaDoExpediente,
    d=>d.flags.diretor_alerta ? 'O diretor te recebe de pé, sem oferecer café, com a porta aberta atrás de você.'
      : c12_esvaziado(d) ? 'O diretor te recebe com a mesma cordialidade e uma olheira nova.'
      : 'O diretor te recebe de novo, oferece café de novo, e lembra do açúcar.',
    d=>d.flags.diretor_alerta ? fala('Diretor Quince', 'Você tem cinco minutos. Se trouxe documento, eu leio.', 'frio')
      : c12_esvaziado(d) ? fala('Diretor Quince', 'O setor 7 está vazio. Eu registrei a ocorrência, como o regulamento manda.')
      : fala('Diretor Quince', 'Sente. O que mais?'),
    d=>c12_esvaziado(d) && !d.flags.diretor_alerta ? 'Ele te olha por cima dos óculos e não pergunta nada.' : ''
  ],
  ef:{executar:d=>{ c12_esperaExpediente(d); return []; }},
  escolhas:[
    {texto:'"A planilha é de 1971 e a reserva cresceu em 85."', vai:'c12_planilha_pro_diretor', cond:d=>!!d.flags.entendeu_a_conta && !Historia.jaAconteceu('c12_planilha_pro_diretor')},
    {texto:'"O receptor escreveu o critério de triagem."', vai:'c12_critico_do_receptor', cond:d=>!!d.flags.tem_a_ficha_tecnica && !Historia.jaAconteceu('c12_critico_do_receptor')},
    {texto:'"O que é área de manejo?"', vai:'c12_manejo', cond:d=>!d.flags.diretor_alerta && !Historia.jaAconteceu('c12_manejo')},
    {texto:'"Um guia te procurou faz quatro meses."', vai:'c12_o_nico_te_procurou', cond:d=>!d.flags.diretor_alerta && !!d.flags.nico_falou && !Historia.jaAconteceu('c12_o_nico_te_procurou')},
    {texto:'"E se a reserva fosse maior?"', vai:'c12_pergunta_dificil', cond:d=>!d.flags.diretor_alerta && !Historia.jaAconteceu('c12_pergunta_dificil')},
    {texto:'"Quem é o dono da terra ao lado?"', vai:'c12_dono_da_terra', cond:d=>!d.flags.diretor_alerta && !Historia.jaAconteceu('c12_dono_da_terra')},
    {texto:'"Me dá os dezenove anos de papel."', vai:'c12_papelada', cond:d=>!d.flags.diretor_alerta && !Historia.jaAconteceu('c12_papelada')},
    {texto:'"Então suspende a retirada."', vai:'c12_suspende', cond:d=>!!(d.flags.diretor_viu_o_erro || d.flags.diretor_viu_a_ficha || d.flags.diretor_confrontado) && !Historia.jaAconteceu('c12_suspende')},
    {texto:'"E se eu abrir o curral hoje?"', vai:'c12_se_eu_abrir', cond:d=>Historia.jaAconteceu('c12_suspende') && !Historia.jaAconteceu('c12_se_eu_abrir') && !c12_esvaziado(d)},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona', repetivel:true},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia, repetivel:true},
    {texto:'Sair de Fuchsia.', vai:'c12_fim'}
  ]
},

c12_manejo:{
  falante:'Diretor Quince',
  vozes:['N','N','N','P','N','N'],
  texto:[
    'A cordialidade dele não some. Ela fica exatamente igual, e é isso que muda tudo.',
    '"Manejo é o controle populacional de uma reserva fechada."',
    'Ele fala devagar, como professor que já deu essa aula muitas vezes e ainda gosta de dar.',
    '"Nove mil hectares suportam um número. Acima desse número, a população colapsa sozinha — por fome, por doença, por briga territorial, por parasitose. Não é ameaça: é curva. Toda população fechada faz a mesma curva."',
    '"Nós retiramos o excedente antes da curva virar."',
    '"Retiram pra onde?"',
    'Ele abre as mãos.',
    '"Para onde tem quem receba."',
    'E aí ele diz a frase que faz dele uma pessoa muito difícil de odiar:',
    '"Se você conhece um lugar melhor, eu escrevo o ofício hoje. Eu escrevo mesmo. Eu tenho o modelo salvo."'
  ],
  ef:{flag:['sabe_do_manejo','sabe_do_setor7'],
      registrar:'O diretor admitiu: o setor 7 é retirada de "excedente populacional".',
      presagio:'"Eu tenho o modelo salvo." Ele já escreveu esse ofício antes, muitas vezes.'},
  escolhas:[
    {texto:'"Isso tem outro nome."', vai:'c12_confronto_diretor', cond:d=>!Historia.jaAconteceu('c12_confronto_diretor')},
    {texto:'"E se a reserva fosse maior?"', vai:'c12_pergunta_dificil', cond:d=>!Historia.jaAconteceu('c12_pergunta_dificil')},
    {texto:'"O receptor escreveu o critério de triagem."', vai:'c12_critico_do_receptor', cond:d=>(!!d.flags.tem_a_ficha_tecnica) && !Historia.jaAconteceu('c12_critico_do_receptor')},
    {texto:'"Um guia te procurou faz quatro meses."', vai:'c12_o_nico_te_procurou', cond:d=>(!!d.flags.nico_falou) && !Historia.jaAconteceu('c12_o_nico_te_procurou')}
  ]
},

c12_o_nico_te_procurou:{
  falante:'Diretor Quince',
  vozes:['P','N','P','N','P','N','N','N'],
  texto:[
    '"Um guia te procurou faz quatro meses."',
    'Ele não pergunta qual guia.',
    '"Procurou."',
    '"E você disse que ia apurar."',
    '"Eu disse."',
    '"E apurou?"',
    'Ele abre a segunda gaveta da mesa e tira uma pasta fina, e abre na sua frente, e vira pra você.',
    'É um ofício, datado de uma semana depois da visita do guia. Endereçado ao Conselho Gestor da Reserva.',
    '**"Solicito instauração de apuração preliminar sobre as atividades do Setor 7, em razão de relato de servidor."**',
    'Assinado por ele.',
    'E grampeada atrás, a resposta, de duas semanas depois, meia página:',
    '**"Indeferido. Matéria já apreciada na 41ª Reunião Ordinária."**',
    '"Eu apurei", ele diz. "Eu apuro desde noventa e sete, toda vez que alguém me procura. Eu tenho catorze desses."',
    'Ele fecha a pasta.',
    '"Eu só não conto pro rapaz, porque contar pro rapaz que eu tentei e não deu é pior do que ele achar que eu não liguei."'
  ],
  ef:{flag:['viu_os_oficios','diretor_humanizado'],
      npc:{nome:'Diretor Quince', opiniao:5, memoria:'Te mostrou o ofício que pediu apuração do setor 7 e a negativa do conselho. Tem catorze iguais.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou a coisa que fez o homem abrir a gaveta'},
      moral:-8,
      registrar:'O diretor tem catorze ofícios de apuração indeferidos pelo conselho desde 1997.',
      presagio:'Ele deixou o rapaz achar que ele não ligava. Por gentileza.'},
  escolhas:[
    {texto:'"Me dá os catorze."', vai:'c12_papelada', cond:d=>!Historia.jaAconteceu('c12_papelada')},
    {texto:'"Conta pro rapaz."', vai:'c12_conta_pro_nico', cond:d=>!Historia.jaAconteceu('c12_conta_pro_nico')},
    {texto:'"E se a reserva fosse maior?"', vai:'c12_pergunta_dificil', cond:d=>!Historia.jaAconteceu('c12_pergunta_dificil')},
    {texto:'"A planilha é de 1971."', vai:'c12_planilha_pro_diretor', cond:d=>(!!d.flags.entendeu_a_conta) && !Historia.jaAconteceu('c12_planilha_pro_diretor')}
  ]
},

c12_conta_pro_nico:{
  falante:'Diretor Quince',
  vozes:['P','N','P','N','P'],
  texto:[
    '"Conta pro rapaz."',
    '"Pra quê?"',
    '"Porque ele levou meses ensaiando pra falar com você, e ele acha que você não ligou, e ele vai continuar achando isso pelo resto da vida."',
    'O diretor olha a pasta fechada.',
    '"E se eu contar, ele descobre que o lugar onde ele trabalha é pior do que ele pensava. Ele pensava que era um homem. É uma estrutura."',
    '"Ele já sabe que é uma estrutura. Ele só acha que você faz parte dela de má vontade."',
    'Silêncio.',
    'Ele levanta, abre a porta da sala, e chama a secretária pelo nome, e pede pra chamar o guia Orin.',
    'Você sai antes do Orin chegar, porque essa conversa não é sua.',
    'Da janela do corredor você vê os dois na sala por dezenove minutos, e o diretor mostrando a pasta, e o Orin sentado com as duas mãos no rosto.'
  ],
  ef:{flag:['diretor_contou_pro_nico'],
      npc:{nome:'Guia Orin', opiniao:5, memoria:'Descobriu que o diretor tentou catorze vezes. Chorou na sala dele.'},
      rep:{eixo:'bom',delta:4,motivo:'Fez duas pessoas que estavam do mesmo lado descobrirem isso'},
      moral:15,
      registrar:'O diretor contou ao Orin sobre os catorze ofícios indeferidos.',
      presagio:'Dezenove minutos. Duas pessoas do mesmo lado descobrindo isso com quatro meses de atraso.'},
  escolhas:[
    {texto:'Pedir os catorze ofícios.', vai:'c12_papelada', cond:d=>!Historia.jaAconteceu('c12_papelada')},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir falar com a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara}
  ]
},

c12_planilha_pro_diretor:{
  falante:'Diretor Quince',
  vozes:['P','N'],
  texto:[
    '"A planilha é de setenta e um. E a reserva ganhou a fazenda do rio em oitenta e cinco."',
    d=>d.flags.diretor_alerta ? 'Ele não muda de cara, porque a cordialidade já tinha ido embora antes.' : 'A cordialidade some.',
    'Não vira raiva. Vira outra coisa: ele fica muito quieto e olha a planta baixa emoldurada atrás dele, sem virar o corpo, só os olhos.',
    'Depois ele levanta, tira a planta da parede — com cuidado, com as duas mãos, do jeito que se tira uma coisa que a gente mandou emoldurar — e põe em cima da mesa.',
    'No canto inferior direito da planta, em letra pequena de desenhista técnico:',
    '**LEVANTAMENTO AEROFOTOGRAMÉTRICO — 1971 — 8.160 ha**',
    'Está escrito ali. Na parede da sala dele. Há trinta e um anos. Do lado da cabeça dele, todo dia, em todas as fotos.',
    'Ele senta.',
    'E fica uns dois minutos sem falar nada, e você deixa.',
    '"Eu olhei pra essa planta todo dia útil da minha vida adulta."'
  ],
  ef:{flag:['diretor_viu_o_erro','provou_o_erro'],
      npc:{nome:'Diretor Quince', opiniao:6, memoria:'Tirou a planta da parede e leu, com você, a área que ele nunca conferiu em 31 anos.'},
      rep:{eixo:'bom',delta:6,motivo:'Mostrou a um homem o erro que estava emoldurado na parede dele'},
      moral:-10, instabilidade:1,
      registrar:'O diretor confrontou a área de 1971 emoldurada na própria sala.',
      presagio:'Estava na parede. Em letra pequena. Do lado da cabeça dele.'},
  escolhas:[
    {texto:'"Então suspende a retirada."', vai:'c12_suspende', cond:d=>!Historia.jaAconteceu('c12_suspende')},
    {texto:'"Me dá os catorze ofícios."', vai:'c12_papelada', cond:d=>!Historia.jaAconteceu('c12_papelada')},
    {texto:'"E o que tem no setor 7 hoje à noite?"', vai:'c12_confronto_diretor', cond:d=>!Historia.jaAconteceu('c12_confronto_diretor')},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_suspende:{
  falante:'Diretor Quince',
  vozes:['P','N','P','N','N','P','N','P','N','N'],
  texto:[
    '"Então suspende a retirada."',
    '"Eu não posso."',
    '"Você é o diretor."',
    '"Eu sou o diretor executivo. A retirada é deliberação de conselho e eu executo deliberação de conselho."',
    'Ele passa a mão na planta em cima da mesa.',
    '"Mas eu posso uma coisa."',
    '"O quê?"',
    '"Eu posso instaurar revisão técnica da capacidade de suporte, porque isso é matéria técnica e matéria técnica é minha."',
    '"E o que a revisão faz?"',
    '"A revisão suspende a aplicação do índice até a conclusão."',
    'Ele já está puxando papel da gaveta.',
    '"Quer dizer: se eu assinar isso agora, hoje, a retirada de duzentos e quarenta deste ano não tem base legal a partir de amanhã de manhã."',
    'Ele para com a caneta no ar.',
    d=>c12_esvaziado(d) ? fala('Diretor Quince', 'O que estava no setor 7 já não está, e isso não foi papel nenhum.')
      : fala('Diretor Quince', 'E o que já está no setor 7 continua onde está, porque o que já foi triado já foi triado, e eu não tenho competência pra desfazer triagem.'),
    d=>c12_esvaziado(d) ? 'Ele olha pra você por cima dos óculos e não pergunta nada.' : fala(d.jogador.nome, 'Quantos estão lá hoje?'),
    d=>c12_esvaziado(d) ? '' : 'Ele olha a agenda.',
    d=>c12_esvaziado(d) ? '' : fala('Diretor Quince', 'Oitenta e sete. Embarque quinta.')
  ],
  ef:{flag:['diretor_suspende','sabe_dos_oitenta_e_sete'],
      npc:{nome:'Diretor Quince', opiniao:8, memoria:'Assinou a revisão técnica que derruba a base legal da retirada do ano.'},
      rep:{eixo:'bom',delta:6,motivo:'Conseguiu a suspensão administrativa da retirada anual'},
      instabilidade:1,
      registrar:d=>c12_esvaziado(d) ? 'O diretor instaurou revisão técnica: a retirada anual perde base legal.' : 'O diretor instaurou revisão técnica: a retirada anual perde base legal. Restam 87 no setor 7, embarque quinta.',
      presagio:d=>c12_esvaziado(d) ? 'O papel resolve o ano que vem. O deste ano já se resolveu de outro jeito.' : 'Oitenta e sete. Embarque quinta. O papel resolve o ano que vem.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'"E se eu abrir o curral hoje?"', vai:'c12_se_eu_abrir', cond:d=>(!c12_esvaziado(d)) && !Historia.jaAconteceu('c12_se_eu_abrir')},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir falar com o Sr. Zane sobre a soltura.', vai:'c12_marido', cond:d=>!!d.flags.ninguem_pergunta}
  ]
},

c12_se_eu_abrir:{
  falante:'Diretor Quince',
  vozes:['P','N','P','N','N','N','N'],
  texto:[
    '"E se eu abrir o curral hoje?"',
    'Ele põe a caneta na mesa.',
    'Olha pra você por um tempo desconfortável.',
    '"Se você abrir o curral hoje, eu tenho que registrar ocorrência, acionar a segurança patrimonial e comunicar o receptor."',
    '"E você faria?"',
    '"Eu faria. Eu sou servidor há trinta e um anos."',
    'Pausa.',
    '"E eu comunico o receptor por ofício postado, que leva de três a cinco dias úteis, porque comunicação a terceiro credenciado é por ofício postado, conforme o regulamento interno que eu mesmo escrevi em noventa e quatro."',
    'Ele olha a janela.',
    '"E a segurança patrimonial é uma empresa contratada que atende das dezoito às seis, e a escala de hoje à noite é de um vigia só, e o vigia de hoje é o Sr. Ulric, que tem setenta e um anos e uma catarata."',
    'Ele volta a olhar pra você.',
    '"Eu não te disse nada disso."'
  ],
  ef:{flag:['diretor_te_deu_a_janela','sabe_do_seu_jorge'],
      npc:{nome:'Diretor Quince', opiniao:9, memoria:'Te explicou, em forma de regulamento, exatamente como abrir o curral sem ser pego.'},
      rep:{eixo:'bom',delta:5,motivo:'Fez um burocrata de trinta e um anos usar o regulamento a favor'},
      moral:12,
      registrar:'O diretor explicou os prazos e a escala de vigia: hoje à noite é um vigia só, o Sr. Ulric.',
      presagio:'"Eu não te disse nada disso." Ele passou trinta e um anos aprendendo esses prazos.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Chamar o Sr. Zane para dirigir.', vai:'c12_marido', cond:d=>!!d.flags.ninguem_pergunta},
    {texto:'Chamar o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Chamar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara}
  ]
},

c12_pergunta_dificil:{
  falante:'Diretor Quince',
  vozes:['P','N','N','N','N','N','N','N'],
  texto:[
    '"E se a reserva fosse maior?"',
    'Ele para. É a primeira vez que ele para.',
    '"Se a reserva fosse maior, o problema mudava de lugar e ficava maior também, porque população cresce pra ocupar a área."',
    'Ele olha a planta baixa na parede.',
    '"Mas mudaria a ordem de grandeza do que a gente chama de excedente. E a ordem de grandeza é tudo."',
    '"Eu peço ampliação há dezenove anos."',
    '"Dezenove anos, três prefeitos, quatro diretores de Liga e dois presidentes de Comissão. Nenhum disse não."',
    '"Todos disseram depois."',
    'Ele volta pra você.',
    '"Eu não estou pedindo sua compreensão. Compreensão é barata e eu já recebi muita."',
    '"Eu estou te explicando por que um homem honesto vira isso aqui em dezenove anos, porque você tem {idade} e vai encontrar muitos de mim pela frente e vai ser útil saber como a gente é feito."'
  ],
  ef:{flag:'diretor_humanizado',
      npc:{nome:'Diretor Quince', opiniao:3, memoria:'Te contou dos dezenove anos pedindo ampliação da reserva.'},
      rep:{eixo:'bom',delta:2,motivo:'Perguntou a pergunta que fez o homem parar'},
      registrar:'O diretor pede ampliação da reserva há dezenove anos.'},
  escolhas:[
    {texto:'"Me dá os dezenove anos de papel."', vai:'c12_papelada', cond:d=>!Historia.jaAconteceu('c12_papelada')},
    {texto:'"Por que não ampliaram? Quem é o dono da terra ao lado?"', vai:'c12_dono_da_terra', cond:d=>!Historia.jaAconteceu('c12_dono_da_terra')},
    {texto:'"Ainda assim eu vou lá hoje à noite."', vai:'c12_noite_zona'},
    {texto:'"Então não tem o que fazer." E ir embora de Fuchsia.', vai:'c12_desistiu_zona'}
  ]
},

c12_dono_da_terra:{
  falante:'Diretor Quince',
  vozes:['P','N','N','P','N'],
  texto:[
    '"Quem é o dono da terra ao lado?"',
    'Ele levanta uma sobrancelha, e é a primeira vez que ele parece surpreso com uma pergunta sua.',
    '"Boa."',
    'Ele abre a terceira gaveta e tira um mapa fundiário dobrado, desses de cartório, amarelado nos vincos.',
    'A reserva é o polígono grande no meio. Em volta, quinze propriedades.',
    'Onze são pequenas: sítio, chácara, fazendinha de leite.',
    'Quatro são grandes e fazem fronteira com o setor 7. E as quatro têm o mesmo nome no campo de proprietário.',
    '**AGROPECUÁRIA LINHA VERDE**',
    '"Eu pedi ampliação pra esse lado dezenove vezes porque é o lado que faz sentido — é contínuo, é o mesmo bioma, tem nascente."',
    '"E essas quatro foram compradas quando?"',
    'Ele passa o dedo nas datas de registro.',
    'Noventa e cinco. Noventa e seis. Noventa e seis. Noventa e sete.',
    '"Ah", ele diz.',
    'Só isso. "Ah."'
  ],
  ef:{flag:['sabe_da_linha_verde','provas_zona'],
      itens:{'Mapa fundiário':1},
      npc:{nome:'Diretor Quince', opiniao:7, memoria:'Descobriu com você que a terra da ampliação foi comprada por uma só empresa entre 95 e 97.'},
      rep:{eixo:'bom',delta:6,motivo:'Perguntou quem era o dono da terra ao lado'},
      instabilidade:2,
      registrar:'As quatro propriedades vizinhas ao setor 7 foram compradas pela Agropecuária Linha Verde entre 1995 e 1997.'},
  escolhas:[
    {texto:'"Quem é a Linha Verde?"', vai:'c12_quem_e_linha_verde'},
    {texto:'"Me dá os dezenove anos de papel."', vai:'c12_papelada', cond:d=>!Historia.jaAconteceu('c12_papelada')},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar isso pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia}
  ]
},

c12_quem_e_linha_verde:{
  falante:'Diretor Quince',
  vozes:['P','N','N','N','N','N'],
  texto:[
    '"Quem é a Linha Verde?"',
    '"Não faço ideia. Nunca precisei saber."',
    'Ele olha o mapa.',
    '"Mas o cartório de registro comercial de Celadon é público e fica a quatro horas daqui de ônibus, e eu tenho férias acumuladas desde noventa e nove."',
    'Ele dobra o mapa e te entrega.',
    '"Leva. Eu tenho o original digitalizado."',
    d=>d.flags.achou_a_junta ? 'O cartório de registro comercial de Celadon. Você já esteve lá: terceiro andar, elevador quebrado, uma hora e quarenta de senha.'
       : 'O cartório de registro comercial de Celadon. Você anota.',
    '"Eu vou tirar quinze dias", ele diz, e é a primeira vez que ele sorri de verdade desde que você entrou na sala. "Trinta e um anos e eu nunca tirei quinze dias seguidos."'
  ],
  ef:{flag:['diretor_vai_a_junta','sabe_do_cartorio'],
      npc:{nome:'Diretor Quince', opiniao:8, memoria:'Vai tirar quinze dias de férias acumuladas para ir ao cartório de registro comercial de Celadon.'},
      rep:{eixo:'bom',delta:4,motivo:'Colocou um servidor de trinta e um anos na estrada atrás da resposta'},
      moral:10,
      registrar:'O diretor vai ao cartório de registro comercial de Celadon investigar a Agropecuária Linha Verde.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Pedir os catorze ofícios antes.', vai:'c12_papelada', cond:d=>!Historia.jaAconteceu('c12_papelada')},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir falar com a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara}
  ]
},

c12_papelada:{
  falante:'Diretor Quince',
  vozes:['E'],
  texto:[
    'Ele te dá.',
    'Uma pasta de dezenove anos de ofícios, protocolos, respostas padrão e catorze pedidos de apuração indeferidos.',
    'Ele não entrega rápido. Ele tira folha por folha do arquivo, confere, junta, e leva vinte minutos, e você fica ali os vinte minutos.',
    'A última folha é de fevereiro deste ano: "Solicitação em análise."',
    fala('Diretor Quince', 'Isso não me inocenta.'),
    'Ele entrega a pasta com as duas mãos.',
    fala('Diretor Quince', 'Isso só explica. Eu sei a diferença.'),
    d=>d.flags.tem_as_comunicacoes ? 'Um capitão de navio te disse quase isso, com outras palavras, numa ponte de comando.' : '',
    d=>d.flags.tem_as_comunicacoes ? 'Você começa a achar que é uma frase que as pessoas aprendem quando chegam numa certa idade dentro de uma certa estrutura.'
      : 'Parece uma frase que as pessoas aprendem quando chegam numa certa idade dentro de uma certa estrutura.'
  ],
  ef:{flag:['pasta_do_diretor','provas_zona'],
      itens:{'Pasta de dezenove anos de ofícios':1},
      rep:{eixo:'bom',delta:4,motivo:'Conseguiu dezenove anos de documentação da reserva'},
      npc:{nome:'Diretor Quince', opiniao:6, memoria:'Te entregou dezenove anos de papelada sabendo o que você ia fazer com ela.'},
      registrar:'Recebeu dezenove anos de ofícios sobre a Zona Safári.'},
  escolhas:[
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar tudo à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'"Quem é o dono da terra ao lado?"', vai:'c12_dono_da_terra', cond:d=>!Historia.jaAconteceu('c12_dono_da_terra')}
  ]
},

c12_critico_do_receptor:{
  falante:'Diretor Quince',
  vozes:['P','N','N','P','N','N','P'],
  texto:[
    '"O receptor escreveu o critério de triagem."',
    'Ele para de mexer no papel.',
    '"Como?"',
    'Você põe a ficha técnica na mesa dele, aberta na última página, no rodapé em corpo oito.',
    'Ele lê. Tira os óculos, limpa no paletó, põe de volta, lê de novo.',
    '"Eu aprovei essa ficha."',
    '"Eu sei."',
    '"Eu aprovei essa ficha em noventa e dois porque ela veio com parecer favorável de um médico de Pokémon credenciado e porque eu não sou médico de Pokémon."',
    'Ele empurra a ficha de volta, devagar.',
    '"E a pergunta que eu não fiz em noventa e dois é: por que o receptor tem departamento técnico?"',
    '"Um armazém não tem departamento técnico."'
  ],
  ef:{flag:['diretor_viu_a_ficha'],
      npc:{nome:'Diretor Quince', opiniao:6, memoria:'Descobriu com você que aprovou uma ficha técnica escrita pelo próprio comprador.'},
      rep:{eixo:'bom',delta:4,motivo:'Mostrou ao diretor de quem era o timbre'},
      moral:-8,
      registrar:'O diretor aprovou em 1992 a ficha técnica escrita pelo departamento técnico do receptor.'},
  escolhas:[
    {texto:'"Então suspende."', vai:'c12_suspende', cond:d=>!Historia.jaAconteceu('c12_suspende')},
    {texto:'"Quem é o dono da terra ao lado?"', vai:'c12_dono_da_terra', cond:d=>!Historia.jaAconteceu('c12_dono_da_terra')},
    {texto:'"Me dá os dezenove anos de papel."', vai:'c12_papelada', cond:d=>!Historia.jaAconteceu('c12_papelada')},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_confronto_diretor:{
  falante:'Diretor Quince',
  vozes:['P','N','N','P','N','N','N','N','N'],
  texto:[
    '"Isso tem outro nome."',
    '"Tem", ele concorda na hora. "Tem outro nome e o outro nome é mais honesto."',
    'Ele se levanta e vai até a janela, que dá pro estacionamento de funcionários e nada mais.',
    '"Quer saber o que eu acho, de verdade, depois de trinta e um anos?"',
    '"Quero."',
    '"Eu acho que eu sou a pior pessoa desta cidade e a única que impede isso de ser muito pior."',
    '"As duas coisas ao mesmo tempo. É possível. Eu sou a prova viva."',
    'Ele olha o estacionamento.',
    '"Se eu sair amanhã, entra alguém que não escreve ofício, que não guarda catorze indeferimentos numa gaveta, e que não faz questão de que o Pokémon chegue vivo no caminhão."',
    '"E eu fico. E ficar é o que me torna a pior pessoa desta cidade."',
    'Ele volta pra mesa.',
    '"Não tem saída dessa frase. Eu procuro há dezenove anos."'
  ],
  ef:{flag:'diretor_confrontado',
      npc:{nome:'Diretor Quince', opiniao:4, memoria:'Te disse que é a pior pessoa da cidade e a única que impede que seja pior.'},
      moral:-8,
      registrar:'"Eu sou a pior pessoa desta cidade e a única que impede isso de ser muito pior."'},
  escolhas:[
    {texto:'"Tem saída. Suspende."', vai:'c12_suspende', cond:d=>!Historia.jaAconteceu('c12_suspende')},
    {texto:'"Me dá os dezenove anos de papel."', vai:'c12_papelada', cond:d=>!Historia.jaAconteceu('c12_papelada')},
    {texto:'"Quem é o dono da terra ao lado?"', vai:'c12_dono_da_terra', cond:d=>!Historia.jaAconteceu('c12_dono_da_terra')},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_blefe_diretor:{
  falante:'Diretor Quince',
  vozes:['P'],
  texto:['"Eu sei o que tem lá."'],
  teste:{status:'carisma', dificuldade:9, nomeStatus:'Carisma',
         critico:'c12_manejo', sucesso:'c12_manejo', parcial:'c12_diretor_frio', falha:'c12_diretor_frio'}
},

c12_diretor_frio:{
  falante:'Diretor Quince',
  vozes:['N','N','N'],
  texto:[
    'A cordialidade some de uma vez, e o que sobra é um servidor de trinta e um anos que já viu muita gente sentar naquela cadeira.',
    '"Não, você não sabe."',
    'Ele se senta.',
    '"Se soubesse, não estaria sentad{o|a} na minha sala me contando. Quem sabe, vai lá."',
    'Ele toca um botão do telefone.',
    '"Por favor, acompanhe {nosso visitante|nossa visitante} até a saída."',
    'Você é acompanhad{o|a} até a saída. Educadamente, com um "obrigado pela visita" na porta.',
    'Até a saída da cidade.'
  ],
  ef:{flag:'diretor_alerta',
      npc:{nome:'Diretor Quince', opiniao:-3, memoria:'Você blefou mal na sala dele. Ele mandou te acompanharem até fora da cidade.'}},
  escolhas:[
    {texto:'Voltar à noite mesmo assim.', vai:'c12_noite_zona'},
    {texto:'Procurar a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar'},
    {texto:'Desistir da Zona.', vai:'c12_desistiu_zona'}
  ]
},

/* ─────────────── O BAR, A CERCA E A NOITE ─────────────── */

c12_bar:{
  falante:'o guarda-parque mais velho',
  vozes:['o guarda-parque mais novo','N','N','P','N'],
  texto:[
    d=>d.flags.c12_espera_bar ? 'De dia o bar é o dono e o freezer. Os guardas-parque só chegam depois das seis, quando o turno acaba, e você espera.' : '',
    'O bar de Fuchsia tem seis mesas, um freezer de sorvete que não tem sorvete, e é onde os guardas-parque bebem depois do turno.',
    'Você paga uma rodada. Isso compra vinte minutos de conversa e nada mais, e os vinte minutos começam na hora em que a garrafa chega.',
    d=>fala(d.jogador.nome, d.flags.c12_bar_ja_sabia ? 'Setor 7?' : 'O que acontece dentro dessa reserva que não sai no folheto?'),
    'O mais velho ri sem alegria nenhuma.',
    d=>fala('o guarda-parque mais velho', d.flags.c12_bar_ja_sabia ? 'Setor 7 é onde a gente aprende que não existe emprego limpo.' : 'Setor 7. Setor 7 é onde a gente aprende que não existe emprego limpo.'),
    'Outro, mais novo, bate na mesa com a mão espalmada. "Fala menos."',
    '"Fala menos por quê? {O moleque|A menina} já sabe. Todo mundo sabe."',
    'Ele vira o copo.',
    '"Fuchsia inteira sabe e Fuchsia inteira come do que sai de lá. A padaria, a escola, o posto. Cinquenta e dois por cento do orçamento desta cidade vem de repasse da reserva e a reserva só tem superávit por causa do setor 7."',
    '"Cinquenta e dois?"',
    '"Cinquenta e dois. Tá no mural da prefeitura, {moço|moça}. Tá no mural, em cartaz, com gráfico de pizza."'
  ],
  ef:{flag:'sabe_dos_cinquenta_e_dois', dinheiro:-400,
      registrar:'52% do orçamento de Fuchsia vem de repasse da reserva, e o superávit vem do setor 7.',
      presagio:'Tem gráfico de pizza no mural da prefeitura. Isso não está escondido de ninguém.',
      /* a hora dos guardas, e o que você sabia antes de perguntar */
      executar:d=>{ c12_esperaBar(d); Estado.marcar('c12_bar_ja_sabia', c12_sabeDoSete(d)); Estado.marcar('sabe_do_setor7'); return []; }},
  escolhas:[
    {texto:'"Algum de vocês me leva lá?"', vai:'c12_guarda_leva', cond:d=>!Historia.jaAconteceu('c12_guarda_leva')},
    {texto:'"Quantos ficam no caminho?"', vai:'c12_quantos_ficam', cond:d=>!Historia.jaAconteceu('c12_quantos_ficam')},
    {texto:d=>d.flags.viu_o_curral ? '"E ninguém nunca abriu aquele curral?"' : '"E ninguém nunca tentou soltar o que tem lá?"', vai:'c12_ja_abriram', cond:d=>!Historia.jaAconteceu('c12_ja_abriram')},
    {texto:'Ir sozinh{o|a} à noite.', vai:'c12_noite_zona'}
  ]
},

/* voltar ao bar: a mesma mesa */
c12_bar_de_novo:{
  repetivel:true,
  texto:[
    d=>d.flags.c12_espera_bar ? 'De dia o bar é o dono e o freezer. Os guardas-parque só chegam depois das seis, e você espera.' : '',
    'Os mesmos guardas, a mesma mesa, o mesmo freezer sem sorvete.',
    d=>c12_esvaziado(d) ? fala('o guarda-parque mais novo', 'O curral está vazio. A cidade inteira só fala disso, e ninguém fala alto.', 'baixo')
      : fala('o guarda-parque mais velho', 'Voltou. Paga outra rodada ou vai embora, {moço|moça}.')
  ],
  ef:{executar:d=>{ c12_esperaBar(d); return []; }},
  escolhas:[
    {texto:'"Quantos ficam no caminho?"', vai:'c12_quantos_ficam', cond:d=>!Historia.jaAconteceu('c12_quantos_ficam')},
    {texto:d=>d.flags.viu_o_curral ? '"E ninguém nunca abriu aquele curral?"' : '"E ninguém nunca tentou soltar o que tem lá?"', vai:'c12_ja_abriram', cond:d=>!Historia.jaAconteceu('c12_ja_abriram')},
    {texto:'"Então eu preciso de caminhão."', vai:'c12_precisa_de_caminhao', cond:d=>Historia.jaAconteceu('c12_ja_abriram') && !Historia.jaAconteceu('c12_precisa_de_caminhao') && !c12_esvaziado(d)},
    {texto:'"Algum de vocês me leva lá?"', vai:'c12_guarda_leva', cond:d=>!Historia.jaAconteceu('c12_guarda_leva') && !c12_esvaziado(d)},
    {texto:'Pedir ajuda pra levar os caminhões de soltura.', vai:'c12_soltura_organizada', ef:{flag:'plano_de_soltura'},
     cond:d=>!!d.flags.tem_a_chave_dos_caminhoes && !c12_esvaziado(d)},
    {texto:'Ir sozinh{o|a} ao setor 7 à noite.', vai:'c12_noite_zona', repetivel:true},
    {texto:'Ir falar com o diretor.', vai:'c12_diretor', repetivel:true},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia, repetivel:true}
  ]
},

c12_quantos_ficam:{
  falante:'o guarda-parque mais velho',
  vozes:['P','N','P','N','N','P','N','N','P','N','N'],
  texto:[
    '"Quantos ficam no caminho?"',
    'A mesa fica quieta.',
    'O mais velho olha o copo.',
    '"Depende do caminhão."',
    '"Depende do caminhão como?"',
    '"Caminhão baú fechado, sem ventilação forçada, em dia de sol, com quatro horas até Celadon." Ele fala devagar. "A gente chama de perda de transporte."',
    '"E é quanto?"',
    '"Entre oito e catorze por cento."',
    'Ele finalmente olha pra você.',
    '"E a perda de transporte não sai da conta de ninguém, porque a retirada já foi baixada da população da reserva no momento do embarque, e o recebimento no destino é por cabeça entregue."',
    '"Então quem perde?"',
    '"Ninguém perde, {moço|moça}. Esse é o desenho."',
    'Ele empurra o copo.',
    '"Eles somem entre uma planilha e outra e as duas planilhas fecham."'
  ],
  ef:{flag:['sabe_da_perda_de_transporte','provas_zona'],
      rep:{eixo:'bom',delta:4,motivo:'Perguntou quantos ficam no caminho'},
      moral:-15, instabilidade:1,
      registrar:'A "perda de transporte" é de 8% a 14% e não aparece em nenhuma planilha.',
      presagio:'Somem entre uma planilha e outra e as duas fecham. É o crime perfeito e ninguém o planejou.'},
  escolhas:[
    {texto:'"Algum de vocês me leva lá?"', vai:'c12_guarda_leva', cond:d=>!Historia.jaAconteceu('c12_guarda_leva')},
    {texto:d=>d.flags.viu_o_curral ? '"E ninguém nunca abriu aquele curral?"' : '"E ninguém nunca tentou soltar o que tem lá?"', vai:'c12_ja_abriram', cond:d=>!Historia.jaAconteceu('c12_ja_abriram')},
    {texto:'Ir sozinh{o|a} à noite.', vai:'c12_noite_zona'},
    {texto:'Levar isso pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia}
  ]
},

c12_ja_abriram:{
  falante:'o guarda-parque mais novo',
  vozes:['N','P','N','N','P','N','P','N','o guarda-parque mais velho','P','o guarda-parque mais velho'],
  texto:[
    d=>fala(d.jogador.nome, d.flags.viu_o_curral ? 'E ninguém nunca abriu aquele curral?' : 'E ninguém nunca tentou soltar o que tem lá?'),
    'O mais novo responde antes do velho, o que é a primeira vez na conversa.',
    '"Abriram."',
    '"Quando?"',
    '"Noventa e nove. Um guarda. O Garth."',
    'O mais velho fecha os olhos.',
    '"Ele abriu o corredor de contenção às três da manhã e soltou uns sessenta."',
    '"E?"',
    '"E sessenta Pokémon saíram correndo pro mato, e trinta e poucos voltaram pro curral sozinhos em três dias, porque estavam com fome e o curral é onde tem comida."',
    'Silêncio.',
    '"E os outros?"',
    '"Uns morreram. Uns foram recapturados na semana seguinte com a operação de rotina. Uns devem ter conseguido, sei lá."',
    'O velho abre os olhos.',
    '"E o Garth foi demitido por justa causa e mora em Cinnabar desde então, e ele não fez nada errado, e ele fez tudo errado, e as duas coisas são verdade."',
    '"Errado por quê?"',
    '"Porque ele abriu a porta e não tinha pra onde levar."'
  ],
  ef:{flag:['sabe_do_beto','sabe_que_voltam'],
      rep:{eixo:'bom',delta:3,motivo:'Perguntou se alguém já tinha tentado'},
      moral:-10,
      npc:{nome:'Guarda Kell', opiniao:2, memoria:'Te contou do Garth, que abriu o curral em 1999 e não tinha para onde levar.'},
      registrar:'Em 1999 um guarda abriu o curral. Metade voltou sozinha em três dias, por fome.',
      presagio:'Ele abriu a porta e não tinha pra onde levar. A porta era a parte fácil.'},
  escolhas:[
    {texto:'"Então eu preciso de caminhão."', vai:'c12_precisa_de_caminhao', cond:d=>!Historia.jaAconteceu('c12_precisa_de_caminhao')},
    {texto:'"Algum de vocês me leva lá?"', vai:'c12_guarda_leva', cond:d=>!Historia.jaAconteceu('c12_guarda_leva')},
    {texto:'Ir sozinh{o|a} à noite.', vai:'c12_noite_zona'},
    {texto:'Ir procurar o Sr. Zane.', vai:'c12_marido', cond:d=>!!d.flags.ninguem_pergunta}
  ]
},

c12_precisa_de_caminhao:{
  falante:'o guarda-parque mais velho',
  vozes:['P','P','P','N','P','N','o guarda-parque mais novo','o guarda-parque mais novo'],
  texto:[
    '"Então eu preciso de caminhão."',
    'Os quatro olham pra você ao mesmo tempo.',
    '"Caminhão de soltura", você continua. "Com quem conheça os pontos. Pra levar longe o suficiente pra não voltar."',
    'O mais velho põe o copo na mesa com cuidado.',
    '"A reserva tem dois caminhões de soltura parados no galpão de máquinas desde noventa e cinco, quando cortaram a rubrica."',
    '"Funcionam?"',
    '"Funcionavam em noventa e cinco. Bateria descarregada, pneu vazio, e eu sei onde está a chave porque eu sou o guarda que confere o galpão de máquinas."',
    'Ele olha os outros três.',
    'O mais novo já está balançando a cabeça, mas balançando de um jeito que não é não — é o balanço de quem está fazendo conta.',
    '"Bateria a gente arruma", diz o mais novo. "Meu cunhado tem oficina."'
  ],
  ef:{flag:['sabe_dos_caminhoes','plano_de_soltura'],
      rep:{eixo:'bom',delta:4,motivo:'Transformou uma invasão num plano de logística'},
      npc:{nome:'Guarda Kell', opiniao:5, memoria:'Sabe onde está a chave do galpão de máquinas com os dois caminhões de soltura.'},
      moral:10,
      registrar:'A reserva tem dois caminhões de soltura parados desde 1995, no galpão de máquinas.',
      presagio:'"Meu cunhado tem oficina." É assim que as coisas acontecem de verdade.'},
  escolhas:[
    {texto:'Chamar o Sr. Zane para dirigir.', vai:'c12_marido', cond:d=>!!d.flags.ninguem_pergunta},
    {texto:'Ir ao setor 7 hoje à noite com eles.', vai:'c12_guarda_leva', cond:d=>!Historia.jaAconteceu('c12_guarda_leva')},
    {texto:'Falar com o diretor sobre os caminhões.', vai:'c12_diretor'},
    {texto:'Ir sozinh{o|a} à noite.', vai:'c12_noite_zona'}
  ]
},

c12_guarda_leva:{
  falante:'o guarda-parque mais velho',
  vozes:['P','N','o guarda-parque mais novo','N','N','o guarda-parque mais novo','N','o guarda-parque mais novo','o guarda-parque mais novo'],
  texto:[
    '"Algum de vocês me leva lá?"',
    'Silêncio na mesa. Longo. O suficiente pro dono do bar olhar.',
    'Depois o mais velho empurra o copo pra longe — não bebe o resto, empurra pra longe, que é diferente.',
    '"Eu levo."',
    '"Você tá bêbado."',
    '"Eu tô bêbado há quatro anos." Ele levanta e pega o chapéu do encosto da cadeira. "Vamo."',
    'Os outros três não dizem nada.',
    'Na porta, o mais novo fala, sem levantar da mesa:',
    '"Kell."',
    '"Que é?"',
    '"Nada não." Pausa. "Boa sorte."'
  ],
  ef:{flag:'guarda_junto',
      /* o mais novo chama ele pelo nome na porta */
      executar:d=>{ Nomes.apresentar('o guarda-parque mais velho'); return []; },
      npc:{nome:'Guarda Kell', opiniao:5, memoria:'Te levou ao setor 7 depois de quatro anos calado, e empurrou o copo pra longe antes.'},
      rep:{eixo:'bom',delta:2,motivo:'Alguém decidiu parar de esperar'},
      presagio:'Ele empurrou o copo pra longe. Não terminou. Isso é uma decisão inteira num gesto.'},
  escolhas:[{texto:'Ir.', vai:'c12_setor7'}]
},

c12_cerca:{
  texto:[
    'A cerca tem trinta e um quilômetros e você não vai andar trinta e um quilômetros.',
    'Você anda quatro, seguindo a linha do alambrado por fora, no capim alto.',
    'E acha uma coisa que não faz sentido: um portão de serviço com asfalto do lado de fora.',
    'Asfalto. No meio do mato. Numa reserva.',
    'Uns oitenta metros de asfalto que saem do portão e vão dar numa estrada vicinal de terra.',
    'Asfalto no meio do mato só existe onde caminhão passa muito e onde caminhão atolando custaria caro.',
    'Alguém pavimentou oitenta metros pra não perder carga no barro.'
  ],
  ef:{flag:'achou_o_portao',
      rep:{eixo:'bom',delta:2,motivo:'Andou quatro quilômetros de cerca e leu o chão'},
      registrar:'Há um portão de serviço com 80 metros de asfalto do lado de fora da cerca.',
      presagio:'Ninguém pavimenta oitenta metros por acaso. É orçamento aprovado.',
      executar:d=>{ Relogio.avancar(1); return []; }},
  escolhas:[
    {texto:'Pular a cerca aqui.', vai:'c12_setor7'},
    {texto:'Esperar um caminhão passar.', vai:'c12_esperou_caminhao'},
    {texto:'Voltar à noite pela trilha.', vai:'c12_noite_zona'},
    {texto:'Pedir por escrito o empenho desses oitenta metros.',
     vai:'c12_empenho', cond:d=>typeof Cargos !== 'undefined'
       && (Cargos.tem('comissao') || Cargos.tem('investigador') || Cargos.tem('reporter'))},
    {texto:'Voltar e procurar quem aprovou esse asfalto.', vai:'c12_diretor'}
  ]
},

c12_empenho:{
  texto:[
    'Você não pula a cerca. Você anda de volta os quatro quilômetros até a administração da reserva.',
    d=>d.flags.c12_espera_diretor === 'noite' ? 'A administração fecha às seis. Você volta às oito da manhã.'
      : d.flags.c12_espera_diretor === 'cedo' ? 'A administração só abre às oito. Você espera na porta.' : '',
    'Você entra pela porta da frente e pede uma coisa que ninguém nunca pediu ali:',
    d=>fala(d.jogador.nome, 'O empenho do serviço de pavimentação do acesso de serviço. Ano, número e valor.'),
    'A funcionária do balcão pede pra você repetir. Você repete.',
    'Ela some por onze minutos e volta com uma pasta fina e uma expressão que não estava no rosto dela antes.',
    fala('a funcionária da reserva', 'Não tem empenho.'),
    d=>fala(d.jogador.nome, 'Como não tem?'),
    fala('a funcionária da reserva', 'Tem uma nota de doação. O asfalto foi doado.'),
    'Ela vira a pasta pra você. É uma folha só, com um logotipo pequeno no canto superior e um campo de "doador" preenchido a máquina.',
    'O campo diz: SOLICITANTE PREFERE NÃO SE IDENTIFICAR.',
    'Oitenta metros de asfalto de grau industrial, doados por alguém que preferiu não se identificar, dentro de uma reserva de Kanto.'
  ],
  ef:{flag:['sabe_da_doacao_do_asfalto','achou_o_portao'],
      rep:{eixo:'bom', delta:3, motivo:'Pediu o empenho no balcão em vez de pular a cerca', notorio:true},
      npc:{nome:'Funcionária da reserva', opiniao:2, memoria:'Procurou um empenho que não existia e te mostrou a nota de doação.'},
      registrar:'O asfalto do acesso de serviço foi doado por quem "prefere não se identificar".',
      presagio:'Doação anônima a órgão público tem um nome técnico e o nome técnico não é doação.',
      executar:d=>{ c12_esperaExpediente(d); return []; }},
  escolhas:[
    {texto:'"Tem cópia dessa folha?"', vai:'c12_copia_da_folha', cond:d=>!Historia.jaAconteceu('c12_copia_da_folha')},
    {texto:'"Quem recebeu a doação assinou?"', vai:'c12_quem_recebeu', cond:d=>!Historia.jaAconteceu('c12_quem_recebeu')},
    {texto:'Agradecer e voltar pra cerca de noite.', vai:'c12_noite_zona'},
    {texto:'Ir falar com o diretor com isso na mão.', vai:'c12_diretor'}
  ]
},

c12_copia_da_folha:{
  texto:[
    d=>fala(d.jogador.nome, 'Tem cópia dessa folha?'),
    'Ela olha pra pasta, pra você, pra porta da sala do diretor, que está fechada.',
    fala('a funcionária da reserva', 'A copiadora tá quebrada faz três semanas.'),
    'Uma pausa exatamente longa demais.',
    fala('a funcionária da reserva', 'Mas o seu aparelho tem câmera.'),
    'Ela empurra a pasta dois centímetros na sua direção e vai olhar uma coisa muito interessante no outro lado do balcão.',
    'Você fotografa em quatro segundos e devolve a pasta fechada.',
    fala('a funcionária da reserva', 'Eu não vi nada.'),
    d=>fala(d.jogador.nome, 'Não viu mesmo.')
  ],
  ef:{flag:['tem_foto_da_doacao'],
      rep:{eixo:'bom', delta:2, motivo:'Saiu da reserva com prova em vez de indignação'},
      npc:{nome:'Funcionária da reserva', opiniao:4, memoria:'Empurrou a pasta dois centímetros e olhou pro outro lado.'},
      registrar:'Você tem foto da nota de doação do asfalto.'},
  escolhas:[
    {texto:'Ir falar com o diretor com a foto na mão.', vai:'c12_diretor'},
    {texto:'Guardar e ir ver o setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_quem_recebeu:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem recebeu a doação assinou?'),
    'Ela vira a folha. No rodapé tem um campo de recebimento com uma rubrica e um carimbo.',
    'A rubrica é de três letras. O carimbo é da direção da reserva.',
    fala('a funcionária da reserva', 'É o diretor.'),
    d=>fala(d.jogador.nome, 'Ele recebeu asfalto de alguém que não quis dizer o nome e assinou.'),
    fala('a funcionária da reserva', 'Ele recebeu, assinou e mandou arquivar em doações diversas, que é a pasta onde vai camiseta de evento e cesta de fim de ano.'),
    'Ela fecha a pasta.',
    fala('a funcionária da reserva', 'Eu trabalho aqui há nove anos e essa é a única folha dessa pasta que eu já reli.', 'baixo')
  ],
  ef:{flag:['diretor_assinou_a_doacao'],
      rep:{eixo:'bom', delta:2, motivo:'Foi atrás de quem assinou embaixo, não de quem doou em cima'},
      npc:{nome:'Funcionária da reserva', opiniao:3, memoria:'Te disse que releu aquela folha uma vez em nove anos.'},
      registrar:'O diretor da reserva assinou o recebimento do asfalto e mandou arquivar em "doações diversas".'},
  escolhas:[
    {texto:'"Tem cópia dessa folha?"', vai:'c12_copia_da_folha', cond:d=>!Historia.jaAconteceu('c12_copia_da_folha')},
    {texto:'Ir falar com o diretor agora.', vai:'c12_diretor'},
    {texto:'Ir ver o setor 7 à noite.', vai:'c12_noite_zona'}
  ]
},

c12_esperou_caminhao:{
  texto:[
    d=>{ const n = d.flags.c12_espera_caminhao;
         return n > 8 ? 'Caminhão de madrugada não passa de dia. Você volta pra beira do asfalto quando escurece e espera, deitad{o|a} no capim, com Weedle passando.'
           : n > 0 ? `Você espera ${c12_horas(n)} na beira do asfalto, deitad{o|a} no capim, com Weedle passando.`
           : 'Você espera na beira do asfalto, deitad{o|a} no capim, com Weedle passando.'; },
    'Às três e vinte da manhã, um caminhão baú sai do portão.',
    'Sem placa iluminada, sem logotipo, com a lona amarrada por cima da carroceria porque é baú com sobrecarga.',
    'E o som.',
    'O som que sai daquele baú às três da manhã numa estrada vicinal não é grito.',
    'É um som contínuo e baixo de muitas coisas se ajeitando num espaço pequeno.',
    'Você tem três segundos pra decidir.'
  ],
  ef:{flag:'viu_o_caminhao', moral:-10,
      executar:d=>{ Estado.marcar('c12_espera_caminhao', (3 - c12_hora(d) + 24) % 24); Relogio.ate(3); return []; }},
  escolhas:[
    {texto:'Entrar pelo portão aberto.', vai:'c12_setor7'},
    {texto:'Seguir o caminhão.', vai:'c12_seguiu_caminhao_zona'},
    {texto:'Anotar placa, horário e sentido.', vai:'c12_anotou_o_caminhao'},
    {texto:'Ficar. Você não consegue se mexer.', vai:'c12_ficou_parado'}
  ]
},

c12_ficou_parado:{
  texto:[
    'Você não se mexe.',
    'O caminhão passa a vinte metros de você e você fica deitad{o|a} no capim, com um Weedle no braço, sem fazer absolutamente nada.',
    'Dois minutos depois ele já é uma luz vermelha na curva. Quatro minutos depois não é nada.',
    'Você não fez nada errado. Não tinha nada que você pudesse fazer com um caminhão em movimento numa estrada vicinal.',
    'E mesmo assim, ali no capim, "não tinha o que fazer" e "eu não fiz nada" ocupam o mesmo lugar.',
    'Você levanta às quatro e dez da manhã, com o corpo dormente de um lado, e anda de volta pra cidade.'
  ],
  ef:{flag:'ficou_parado_no_capim', moral:-15, instabilidade:1,
      registrar:'Viu o caminhão passar e não fez nada.',
      executar:d=>{ Relogio.ate(4); return []; }},
  escolhas:[
    {texto:'Voltar e entrar pelo portão.', vai:'c12_setor7'},
    {texto:'Ir falar com o diretor de manhã.', vai:'c12_diretor'},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir embora de Fuchsia.', vai:'c12_desistiu_zona'}
  ]
},

c12_anotou_o_caminhao:{
  texto:[
    'Você anota tudo: placa, horário, sentido, modelo, cor da lona e a marca do pneu.',
    'Três e vinte e dois. Sentido norte. Baú branco, lona verde, pneu recauchutado na esquerda traseira, com uma cicatriz de reparo que dá pra reconhecer de longe.',
    'É pouco.',
    'Mas caminhão com pneu recauchutado reparado é caminhão que alguém consertou, e conserto tem nota, e nota tem registro comercial.'
  ],
  ef:{flag:['placa_do_caminhao_zona','provas_zona'],
      rep:{eixo:'bom',delta:3,motivo:'Anotou quando não dava pra fazer mais nada'},
      registrar:'Anotou placa, horário e a marca do pneu recauchutado do caminhão do setor 7.'},
  escolhas:[
    {texto:'Entrar pelo portão.', vai:'c12_setor7'},
    {texto:'Seguir o caminhão a pé enquanto der.', vai:'c12_seguiu_caminhao_zona'},
    {texto:'Voltar pra cidade e falar com o diretor.', vai:'c12_diretor'},
    {texto:'Voltar pra cidade e falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia}
  ]
},

c12_seguiu_caminhao_zona:{
  texto:[
    'Você segue o caminhão por seis quilômetros de estrada vicinal, correndo nos trechos retos e andando nos de curva, até ele parar num posto de combustível fechado às três e quarenta.',
    'Lá, a carga é transferida.',
    'Do baú sem placa pra outro caminhão, e esse segundo tem placa, tem logotipo de transportadora, tem adesivo de rastreamento via satélite, e o motorista assina uma nota fiscal em duas vias apoiada no capô.',
    'É aqui que a coisa deixa de ser crime e vira logística.',
    'A transferência leva quarenta minutos e os dois motoristas conversam sobre a Liga e um deles come um sanduíche em pé.',
    'Você fotografa tudo: os dois caminhões, as duas placas, a nota no capô, o rosto de quem assina, o adesivo de rastreamento.',
    'Nove fotos.'
  ],
  ef:{flag:['provas_zona','viu_a_transferencia'],
      rep:{eixo:'bom',delta:4,motivo:'Documentou o ponto exato em que o crime vira logística'},
      moral:-8,
      registrar:'Fotografou a transferência de carga da Zona Safári para transporte legalizado, num posto fechado.',
      executar:d=>{ Relogio.ate(4); return []; },
      presagio:'Quarenta minutos e um sanduíche. É esse o tamanho moral da operação pra quem trabalha nela.'},
  escolhas:[
    {texto:'Voltar e entrar no setor 7.', vai:'c12_setor7'},
    {texto:'Levar as fotos pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Sair de Fuchsia com as fotos.', vai:'c12_fim'}
  ]
},

c12_noite_zona:{
  repetivel:true,
  texto:[
    d=>d.flags.c12_esperou_escurecer ? 'Você espera a noite cair antes de entrar.' : '',
    'A Zona Safári à noite é outra coisa.',
    'Sem guia, sem trilha marcada, sem trinta Pokébolas especiais, sem folheto plastificado.',
    'Nove mil hectares no escuro, com Pokémon que não te conhece e que aqui, diferente de todo o resto de Kanto, não foi ensinado a ter medo de gente — o que é bonito de dia e é um problema sério de noite.',
    'Faz frio e tem orvalho e o capim molha a calça até o joelho em quarenta metros.',
    d=>d.flags.tem_a_chave_do_nico ? 'A chave do Orin abre o portão de pedestre da trilha três na primeira tentativa, e o portão não range, porque o Orin passa óleo nele.' :
       d.flags.tem_o_mapa_do_nico ? 'O mapa do Orin está no seu bolso, no verso de um folheto plastificado, e ele marcou os três plantões com X e a hora da ronda ao lado.' :
       d.flags.nico_junto ? 'Orin anda na sua frente e conhece cada curva, cada bebedouro e cada mourão. Ele não fala nada o caminho inteiro.' :
       d.flags.viu_o_trilho ? 'Você anda sozinh{o|a}, guiad{o|a} pelo trilho de carrinho que você viu de dia, que brilha de leve no escuro porque metal polido brilha de leve no escuro.' :
       'Você anda sozinh{o|a} até achar, no meio do mato, um trilho de carrinho de carga, e segue o trilho, que brilha de leve no escuro porque metal polido brilha de leve no escuro.'
  ],
  ef:{flag:'entrou_de_noite',
      executar:d=>{ c12_esperaEscuro(d); return []; }},
  escolhas:[{texto:d=>c12_sabeDoSete(d) ? 'Seguir o trilho até o setor 7.' : 'Seguir o trilho até onde ele vai.', vai:'c12_setor7', repetivel:true}]
},

c12_setor7:{
  texto:[
    d=>d.flags.c12_esperou_escurecer ? 'Você espera escurecer antes de chegar perto. De dia, sem crachá, ninguém chega perto do setor 7.' : '',
    d=>d.flags.entrou_no_setor7_de_dia ? 'De noite o setor 7 é a mesma clareira da terça, agora com os quatro refletores acesos e o gerador ligado.' : 'O setor 7 não é mato.',
    d=>d.flags.entrou_no_setor7_de_dia ? '' : 'É uma clareira de três hectares, cercada por dentro com tela de dois metros e meio, com iluminação de obra em quatro postes de refletor e um gerador que você ouve a cem metros.',
    d=>d.flags.entrou_no_setor7_de_dia ? '' : 'No centro: um curral.',
    d=>d.flags.entrou_no_setor7_de_dia ? '' : 'Não é gaiola. É curral — estrutura de tubo galvanizado, com brete, corredor de contenção, balança de passagem e rampa de embarque.',
    d=>d.flags.entrou_no_setor7_de_dia ? '' : 'Exatamente como se faz com rebanho de Tauros, porque foi feito por quem faz com rebanho de Tauros, porque a firma que instalou é a mesma que instala em fazenda e o catálogo é o mesmo.',
    d=>c12_esvaziado(d) ? 'Está vazio.' : 'Está cheio.',
    d=>!c12_esvaziado(d) ? 'Você tenta contar e desiste na casa dos oitenta.'
      : d.flags.barreira_funcionou ? 'Os oitenta e sete estão sob custódia da Liga, no quilômetro quatro. Aqui sobrou o cheiro e um bebedouro pingando.'
      : 'Sobrou o cheiro e um bebedouro pingando.',
    d=>c12_esvaziado(d) ? '' : 'E o som — o som é a coisa.',
    d=>c12_esvaziado(d) ? '' : 'Não é pânico. Pânico você reconheceria.',
    d=>c12_esvaziado(d) ? '' : 'É o som de Pokémon que já se cansou de ter pânico, que é um som mais baixo, mais regular, e infinitamente pior.'
  ],
  ef:{flag:'viu_o_curral', instabilidade:1, moral:-15,
      registrar:d=>c12_esvaziado(d) ? 'Encontrou o curral do setor 7 da Zona Safári, vazio.' : 'Encontrou o curral do setor 7 da Zona Safári. Mais de oitenta.',
      presagio:'Instalado pela mesma firma que instala em fazenda. Do catálogo. Com nota fiscal.',
      executar:d=>{ c12_esperaEscuro(d); return []; }},
  escolhas:[
    {texto:'Procurar quem está de plantão.', vai:'c12_plantao'},
    {texto:'Fotografar tudo e sair.', vai:'c12_fotografou_zona', cond:d=>!Historia.jaAconteceu('c12_fotografou_zona')},
    {texto:'Destruir o corredor de contenção — sem ele não dá pra embarcar ninguém.', vai:'c12_sabotou', cond:d=>(!c12_esvaziado(d)) && !Historia.jaAconteceu('c12_sabotou')},
    {texto:'Abrir o curral agora.', vai:'c12_abriu_curral', cond:d=>(!c12_esvaziado(d)) && !Historia.jaAconteceu('c12_abriu_curral')},
    {texto:'Ir embora.', vai:'c12_saiu_zona', cond:d=>c12_esvaziado(d)}
  ]
},

/* voltar ao setor 7: o mesmo curral, no estado em que você deixou */
c12_setor7_de_novo:{
  repetivel:true,
  texto:[
    d=>d.flags.c12_esperou_escurecer ? 'Você espera escurecer antes de chegar perto.' : '',
    'De novo o setor 7: a clareira, os quatro refletores, o gerador que você ouve a cem metros.',
    d=>c12_esvaziado(d)
      ? (d.flags.sabotou_o_curral ? 'O curral está vazio, e o corredor de contenção continua no chão, em seções de tubo.' : 'O curral está vazio. Alguém já lavou o chão.')
      : (d.flags.sabotou_o_curral ? 'O curral continua cheio, e o corredor de contenção continua no chão, em seções de tubo.' : 'O curral continua cheio.'),
    d=>d.flags.conheceu_seu_jorge ? 'O Sr. Ulric está na mesma cadeira, com o mesmo rádio, e a segunda cadeira continua ali.'
      : 'Na cadeira de plástico encostada no contêiner, o vigia de plantão mexe no rádio.'
  ],
  ef:{executar:d=>{ c12_esperaEscuro(d); return []; }},
  escolhas:[
    {texto:'Ir até o vigia.', vai:'c12_plantao', cond:d=>!d.flags.conheceu_seu_jorge},
    {texto:'Sentar com o Sr. Ulric.', vai:'c12_conversa_plantao', cond:d=>!!d.flags.conheceu_seu_jorge && !Historia.jaAconteceu('c12_conversa_plantao')},
    {texto:'"Me ajuda a arrumar pra onde levar."', vai:'c12_jorge_ajuda', cond:d=>!!d.flags.conheceu_seu_jorge && !Historia.jaAconteceu('c12_jorge_ajuda') && !c12_esvaziado(d)},
    {texto:'Buscar os caminhões e organizar a soltura.', vai:'c12_soltura_organizada',
     cond:d=>!!(d.flags.tem_a_chave_dos_caminhoes || d.flags.sabe_dos_caminhoes || d.flags.vandir_dirige) && !c12_esvaziado(d)},
    {texto:'Abrir o curral.', vai:'c12_abriu_curral', cond:d=>(!c12_esvaziado(d)) && !Historia.jaAconteceu('c12_abriu_curral')},
    {texto:'Destruir o corredor de contenção.', vai:'c12_sabotou', cond:d=>(!d.flags.sabotou_o_curral) && !Historia.jaAconteceu('c12_sabotou')},
    {texto:'Fotografar tudo e sair.', vai:'c12_fotografou_zona', cond:d=>!Historia.jaAconteceu('c12_fotografou_zona')},
    {texto:'Ir embora.', vai:'c12_saiu_zona', repetivel:true}
  ]
},

c12_plantao:{
  falante:'Sr. Ulric',
  vozes:['N','N','N'],
  texto:[
    'O plantão é um homem só, de uns setenta anos, numa cadeira de plástico encostada no contêiner de ferramentas, com um rádio ligado numa estação de Fuchsia e um copo de café.',
    d=>d.flags.diretor_te_deu_a_janela ? 'O Sr. Ulric. O diretor disse o nome sem dizer nada.' : 'No bolso da camisa, um crachá de plástico da empresa de vigilância: **ULRIC**.',
    'Ele tem catarata num olho e uma lanterna que ele não usa porque ele conhece o terreno melhor com o pé do que com a luz.',
    'Ele te vê a uns quinze metros — porque ele te ouve antes de ver — e não levanta.',
    '"Boa noite."',
    'Você fica parad{o|a}.',
    '"Pode chegar, {moço|moça}. Eu tenho setenta e um anos e uma perna ruim. Se você quiser fazer alguma coisa aqui, você vai fazer."',
    'Ele mexe no rádio pra pegar melhor.',
    '"Senta aí que a cadeira tem duas."'
  ],
  ef:{flag:'conheceu_seu_jorge',
      npc:{nome:'Sr. Ulric', opiniao:1, memoria:'Vigia do setor 7, setenta e um anos, catarata, te convidou para sentar.'},
      presagio:'"A cadeira tem duas." Ele deixou a segunda cadeira ali de propósito.'},
  escolhas:[
    {texto:'Sentar.', vai:'c12_conversa_plantao'},
    {texto:'"Por que tem duas cadeiras?"', vai:'c12_duas_cadeiras'},
    {texto:'Amarrar ele e abrir o curral.', vai:'c12_amarrou'},
    {texto:'Ignorar e abrir o curral.', vai:'c12_abriu_curral', cond:d=>!Historia.jaAconteceu('c12_abriu_curral')}
  ]
},

c12_duas_cadeiras:{
  falante:'Sr. Ulric',
  vozes:['P','N','P','N','N','P','N','N','P','N','N','P','N','N','P'],
  texto:[
    '"Por que tem duas cadeiras?"',
    'Ele ri, e a risada dele é boa e velha e vem de longe.',
    '"Porque de vez em quando aparece um."',
    '"Um o quê?"',
    '"Um que nem você." Ele bebe o café. "Uns três por ano, mais ou menos. Uns choram, uns gritam comigo, uns tiram foto, uns querem me bater e desistem porque eu tenho setenta e um anos."',
    '"E você faz o quê?"',
    '"Eu ofereço café."',
    'Ele serve num copo plástico de uma garrafa térmica e estende.',
    '"Eu tô aqui há onze anos, {moço|moça}. Onze anos nessa cadeira, três turnos por semana, das dezoito às seis."',
    '"E nenhum deles conseguiu nada?"',
    '"Um conseguiu."',
    'Ele olha o curral.',
    '"Em noventa e nove. Chamava Garth, trabalhava aqui. Abriu tudo."',
    '"E?"',
    '"E metade voltou porque tava com fome." Ele bebe. "Mas metade não voltou, {moço|moça}."',
    '"Metade não voltou."'
  ],
  ef:{flag:['sabe_do_beto','jorge_conversou'],
      npc:{nome:'Sr. Ulric', opiniao:5, memoria:'Te ofereceu café e contou que metade dos que o Garth soltou em 1999 não voltou.'},
      rep:{eixo:'bom',delta:3,motivo:'Perguntou em vez de agir'},
      moral:8,
      registrar:'Sr. Ulric: em 1999 metade dos soltos não voltou. Metade conseguiu.',
      presagio:'Metade não voltou. Ele guarda essa metade desde noventa e nove, numa cadeira de plástico.'},
  escolhas:[
    {texto:'"Me ajuda a abrir."', vai:'c12_jorge_ajuda', cond:d=>!Historia.jaAconteceu('c12_jorge_ajuda')},
    {texto:'"Você me deixaria abrir?"', vai:'c12_conversa_plantao'},
    {texto:'Abrir o curral.', vai:'c12_abriu_curral', cond:d=>!Historia.jaAconteceu('c12_abriu_curral')},
    {texto:'Fotografar e sair.', vai:'c12_fotografou_zona', cond:d=>!Historia.jaAconteceu('c12_fotografou_zona')}
  ]
},

c12_conversa_plantao:{
  falante:'Sr. Ulric',
  vozes:['N','P','N','N','P','N','P','N','N'],
  texto:[
    'Você senta na segunda cadeira e ele te dá café sem perguntar se você quer.',
    'É café com muito açúcar, do jeito que se faz café pra passar a noite.',
    'Vocês ficam uns quarenta minutos ali, com o rádio tocando, e ele fala de coisa nenhuma — da Liga, do preço do gás, da neta que passou em concurso.',
    'Depois, sem mudar o tom, ele fala:',
    '"Você quer abrir."',
    '"Quero."',
    '"E eu não posso deixar, porque eu assino uma folha."',
    'Ele bebe.',
    '"Mas eu vou te falar uma coisa que eu falo pra todo mundo que senta nessa cadeira e que ninguém escuta, porque quando a pessoa senta nessa cadeira ela já decidiu."',
    '"Fala."',
    '"Abrir sem ter pra onde levar é o mesmo que não abrir, e custa mais caro pra eles."',
    '"Eles quem?"',
    '"Eles." Ele aponta o curral com o queixo. "Sair e voltar em três dias com fome é uma coisa que quebra Pokémon por dentro, {moço|moça}. Eu já vi. O Pokémon que saiu e voltou não é o mesmo."'
  ],
  ef:{flag:['jorge_conversou','sabe_que_precisa_levar'],
      npc:{nome:'Sr. Ulric', opiniao:4, memoria:'Passou quarenta minutos conversando com você sobre a Liga e o preço do gás antes de falar do curral.'},
      rep:{eixo:'bom',delta:3,motivo:'Sentou e ouviu antes de agir'},
      moral:5,
      registrar:'Sr. Ulric: abrir sem ter para onde levar quebra os Pokémon por dentro.',
      presagio:'"O Pokémon que saiu e voltou não é o mesmo." Ele viu isso em noventa e nove.'},
  escolhas:[
    {texto:'"Então me ajuda a arrumar pra onde levar."', vai:'c12_jorge_ajuda', cond:d=>!Historia.jaAconteceu('c12_jorge_ajuda')},
    {texto:'"Eu tenho caminhão."', vai:'c12_soltura_organizada', cond:d=>(!!d.flags.vandir_dirige || !!d.flags.sabe_dos_caminhoes) && !Historia.jaAconteceu('c12_soltura_organizada')},
    {texto:'Abrir mesmo assim.', vai:'c12_abriu_curral', cond:d=>!Historia.jaAconteceu('c12_abriu_curral')},
    {texto:'Fotografar e sair.', vai:'c12_fotografou_zona', cond:d=>!Historia.jaAconteceu('c12_fotografou_zona')}
  ]
},

c12_jorge_ajuda:{
  texto:[
    d=>fala(d.jogador.nome, 'Então me ajuda a arrumar pra onde levar.'),
    'Ele demora muito tempo pra responder, e no meio do tempo ele desliga o rádio, o que é a coisa mais séria que ele faz a noite inteira.',
    fala('Sr. Ulric', 'Os caminhão de soltura tão no galpão de máquinas.'),
    d=>fala(d.jogador.nome, d.flags.sabe_dos_caminhoes ? 'Eu sei.' : 'Que caminhões?'),
    d=>d.flags.sabe_dos_caminhoes ? '' : fala('Sr. Ulric', 'Dois. A reserva tinha soltura, antes. A soltura parou e os caminhão ficou.'),
    fala('Sr. Ulric', 'Bateria descarregada.'),
    d=>fala(d.jogador.nome, d.flags.sabe_dos_caminhoes ? 'Eu sei.' : 'Bateria a gente arruma.'),
    fala('Sr. Ulric', 'E a chave do galpão de máquinas tá na chaveira do posto de vigilância, que é aqui, nessa parede atrás de mim, e quem assina a retirada de chave sou eu.'),
    'Ele olha a parede.',
    fala('Sr. Ulric', 'Eu assino a retirada de chave há onze anos e ninguém nunca conferiu o livro.'),
    'Ele se levanta pela primeira vez, com dificuldade, apoiando na cadeira.',
    fala('Sr. Ulric', 'Eu vou assinar a retirada pro meu nome. E eu vou anotar no livro que eu retirei pra conferência de rotina, que é uma coisa que eu tenho competência pra fazer.'),
    fala('Sr. Ulric', 'E o que acontecer depois eu não vi, porque eu tenho catarata.')
  ],
  ef:{flag:['jorge_ajuda','tem_a_chave_dos_caminhoes'],
      itens:{'Chave do galpão de máquinas':1},
      npc:{nome:'Sr. Ulric', opiniao:9, memoria:'Assinou a retirada da chave do galpão de máquinas para você, em nome dele.'},
      rep:{eixo:'bom',delta:6,motivo:'Um vigia de setenta e um anos assinou o próprio nome por você'},
      moral:15,
      registrar:'Sr. Ulric retirou, em nome dele, a chave do galpão dos caminhões de soltura.',
      presagio:'Ele assinou o próprio nome. Onze anos naquela cadeira e ele assinou o próprio nome.'},
  escolhas:[
    {texto:'Buscar os caminhões e organizar a soltura.', vai:'c12_soltura_organizada', cond:d=>!Historia.jaAconteceu('c12_soltura_organizada')},
    {texto:'Chamar o Sr. Zane para dirigir.', vai:'c12_marido', cond:d=>!!d.flags.ninguem_pergunta},
    {texto:'Chamar os guardas do bar.', vai:'c12_bar'},
    {texto:'Abrir agora e resolver o transporte depois.', vai:'c12_abriu_curral', cond:d=>!Historia.jaAconteceu('c12_abriu_curral')}
  ]
},

c12_amarrou:{
  falante:'Sr. Ulric',
  vozes:['N','P','N'],
  texto:[
    'Você amarra o Sr. Ulric na cadeira de plástico com a corda do contêiner de ferramentas.',
    'Ele não resiste. Ele tem setenta e um anos e uma perna ruim e ele te avisou disso quinze metros atrás.',
    'Enquanto você amarra, ele fala, com a voz normal:',
    '"Aperta mais o pulso, {moço|moça}."',
    '"O quê?"',
    '"Aperta mais o pulso. Se ficar frouxo demais, eles vão dizer que eu deixei."',
    'Você aperta mais o pulso de um homem de setenta e um anos porque ele pediu, pra ele não perder o emprego.',
    'E ele agradece.',
    'E essa é a coisa mais difícil que aconteceu com você em Fuchsia.'
  ],
  ef:{flag:'amarrou_o_jorge',
      npc:{nome:'Sr. Ulric', opiniao:3, memoria:'Pediu para você apertar mais a corda, para não perderem o emprego dele.'},
      rep:{eixo:'ruim',delta:1,motivo:'Amarrou um velho numa cadeira'},
      moral:-10,
      registrar:'Amarrou o vigia — que pediu para apertar mais, para não ser demitido.'},
  escolhas:[
    {texto:'Abrir o curral.', vai:'c12_abriu_curral', cond:d=>!Historia.jaAconteceu('c12_abriu_curral')},
    {texto:'Destruir o corredor de contenção.', vai:'c12_sabotou', cond:d=>!Historia.jaAconteceu('c12_sabotou')},
    {texto:'Desamarrar e conversar.', vai:'c12_conversa_plantao'},
    {texto:'Fotografar tudo e sair.', vai:'c12_fotografou_zona', cond:d=>!Historia.jaAconteceu('c12_fotografou_zona')}
  ]
},

/* ─────────────── O QUE FAZER COM OITENTA E SETE ─────────────── */

c12_soltura_organizada:{
  texto:[
    'Leva quatro horas.',
    'Não tem nada de ação nisso. É uma operação logística feita por gente cansada de madrugada, e é a coisa mais bonita da semana exatamente por isso.',
    d=>(d.flags.tem_a_chave_dos_caminhoes ? 'O galpão de máquinas abre com a chave que o Sr. Ulric assinou.'
       : d.flags.sabe_dos_caminhoes ? `O galpão de máquinas abre com a chave que ${c12_kell(d)} sabe onde fica, porque é ele quem confere o galpão.`
       : 'O galpão de máquinas abre com a chave reserva que o Sr. Zane sabe onde fica, porque nessa reserva ninguém muda nada de lugar.')
       + ' Os dois caminhões de soltura estão lá, com pneu vazio e bateria morta e poeira de cinco anos.',
    d=>d.flags.plano_de_soltura ? 'O cunhado do guarda mais novo chega às duas e vinte da manhã com uma caminhonete, duas baterias e um compressor, e não pergunta nada, e a única coisa que ele diz a noite inteira é "cabe mais dois de cada lado se você virar o de cima".' :
       'Você e quem estiver com você trocam a bateria de um deles com a bateria do gerador da obra, que é a única bateria de doze volts num raio de dez quilômetros.',
    d=>d.flags.vandir_dirige ? 'O Sr. Zane chega às três com uma camisa social e um mapa na cabeça, e ele dirige o primeiro caminhão, com hérnia e sessenta e sete anos, e ele não erra uma curva.' :
       'Você dirige devagar e mal, e a estrada de serviço ajuda.',
    d=>d.flags.tem_os_vinculos ? 'E você tem doze folhas de caderno escritas por um peão que não escreve bem, e por causa dessas doze folhas o embarque é feito por grupo familiar, e o de orelha rasgada vai no mesmo caminhão que a que manca da pata de trás.' :
       'E o embarque é feito por espécie, porque é o único critério que vocês têm.',
    'Às seis e quarenta da manhã, o curral do setor 7 está vazio e os dois caminhões estão a quarenta e dois quilômetros dali, na borda norte, num ponto de soltura que só existe num mapa de mil novecentos e oitenta e nove.',
    'Oitenta e sete.',
    'Nenhum vai voltar por fome, porque a quarenta e dois quilômetros não dá pra voltar por fome.',
    'No ponto de soltura, um Kangaskhan não desce do segundo caminhão. Ele fica no canto do baú olhando pra você, e na volta continua lá.'
  ],
  ef:{flag:['soltou_organizado','esvaziou_o_setor7'],
      rep:{eixo:'bom',delta:8,motivo:'Esvaziou o setor 7 com caminhão, mapa e grupo familiar'},
      moral:30, hp:-6, causa:'Quatro horas de operação de madrugada',
      instabilidade:1,
      umaVez:'c12_p1', pokemon:{dex:115, nivel:32, opcoes:{moral:50, historia:'Estava no curral do setor 7. No ponto de soltura, não quis descer do caminhão, e voltou com você.'}},
      registrar:'Esvaziou o setor 7: 87 soltos a 42 km, por grupo familiar, em caminhão de soltura da própria reserva.',
      executar:d=>{ Relogio.ate(7); return []; }},
  escolhas:[
    {texto:'Voltar e devolver as chaves ao Sr. Ulric.', vai:'c12_devolveu_a_chave', cond:d=>(!!d.flags.tem_a_chave_dos_caminhoes) && !Historia.jaAconteceu('c12_devolveu_a_chave')},
    {texto:'Ir direto ao diretor, de manhã, sem dormir.', vai:'c12_diretor'},
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Sair de Fuchsia antes de amanhecer de vez.', vai:'c12_fim'}
  ]
},

c12_devolveu_a_chave:{
  falante:'Sr. Ulric',
  vozes:['N','P','N','P','N','N'],
  texto:[
    'Você volta ao posto de vigilância às sete e dez da manhã, quando o turno do Sr. Ulric já acabou, e ele ainda está lá porque ele não foi embora.',
    'Você devolve a chave.',
    'Ele assina a devolução no livro, com data e hora, em letra de quem assina livro há onze anos.',
    'Depois ele fecha o livro e olha o curral vazio por um tempo longo.',
    '"Oitenta e sete?"',
    '"Oitenta e sete."',
    'Ele assente devagar.',
    '"Eu vou ser demitido."',
    '"Você vai."',
    '"Eu tenho setenta e um anos e aposentadoria integral desde os sessenta e cinco, {moço|moça}. Eu trabalho aqui porque eu não sabia o que fazer com o dia."',
    'Ele guarda a caneta no bolso da camisa.',
    '"Agora eu sei."'
  ],
  ef:{flag:'jorge_demitido',
      npc:{nome:'Sr. Ulric', opiniao:10, memoria:'Assinou a devolução da chave às 7h10 e disse que agora sabe o que fazer com o dia.'},
      rep:{eixo:'bom',delta:4,motivo:'Voltou para devolver a chave e encarar quem pagou a conta'},
      moral:20,
      registrar:'Sr. Ulric devolveu a chave no livro e sabe que vai ser demitido.',
      presagio:'"Agora eu sei." Ele esperou onze anos numa cadeira de plástico por essa frase.'},
  escolhas:[
    {texto:'Ir ao diretor.', vai:'c12_diretor'},
    {texto:'Ir ao Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar tudo à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Sair de Fuchsia.', vai:'c12_fim'}
  ]
},

c12_abriu_curral:{
  texto:[
    'Você abre o brete e o corredor de contenção e o portão de manejo, os três, e sai da frente.',
    'Não acontece na hora.',
    'Leva quase dois minutos até o primeiro sair, e o primeiro é um Nidorino, e ele sai andando e não correndo, e para na saída pra cheirar o chão.',
    'Depois é tudo ao mesmo tempo.',
    'Oitenta e sete atravessam três hectares de clareira iluminada por refletor de obra e somem no mato em menos de quatro minutos.',
    'E o silêncio depois é absurdo.',
    d=>d.flags.jorge_conversou
      ? 'E você fica parad{o|a} no meio do curral vazio sabendo o que o Sr. Ulric te disse: que em três dias metade volta, porque é aqui que tem comida, e que o Pokémon que sai e volta não é o mesmo.'
      : d.flags.sabe_que_voltam
      ? 'E você fica parad{o|a} no meio do curral vazio sabendo o que os guardas do bar te disseram: que em três dias metade volta, porque é aqui que tem comida.'
      : 'Você fica parad{o|a} no meio do curral vazio com a sensação de ter feito a coisa mais certa da sua vida.',
    d=>d.flags.sabe_do_beto ? 'Em noventa e nove um guarda chamado Garth fez exatamente isso, sozinho, às três da manhã. Metade voltou.' : ''
  ],
  ef:{flag:['abriu_o_curral','esvaziou_o_setor7'],
      rep:{eixo:'bom',delta:4,motivo:'Abriu o curral do setor 7'},
      moral:10, instabilidade:2,
      registrar:'Abriu o curral do setor 7. Oitenta e sete saíram.'},
  escolhas:[
    {texto:'Arrumar caminhão em três dias antes deles voltarem.', vai:'c12_tres_dias', cond:d=>!Historia.jaAconteceu('c12_tres_dias')},
    {texto:'Destruir o corredor de contenção pra não dar pra reembarcar.', vai:'c12_sabotou', cond:d=>(!d.flags.sabotou_o_curral) && !Historia.jaAconteceu('c12_sabotou')},
    {texto:'Fotografar o curral vazio e sair.', vai:'c12_fotografou_zona', cond:d=>!Historia.jaAconteceu('c12_fotografou_zona')},
    {texto:'Ir embora. Você fez o que dava.', vai:'c12_saiu_zona'}
  ]
},

c12_tres_dias:{
  texto:[
    'Você tem três dias e usa os três.',
    d=>{ const quem = [];
         if (Historia.jaAconteceu('c12_marido')) quem.push('na porta do Sr. Zane às seis da manhã');
         if (Historia.jaAconteceu('c12_yara')) quem.push('na porta da Dra. Pia às sete');
         if (Historia.jaAconteceu('c12_bar')) quem.push('no bar dos guardas às seis da tarde, quando o turno acaba');
         return quem.length ? 'Dia um: você acorda a cidade. Literalmente — você bate ' + c12_lista(quem) + '.'
           : 'Dia um: você bate de porta em porta numa cidade de quatro mil pessoas até alguém saber de caminhão, e quem sabe é um guarda-parque de folga, que te leva até o galpão de máquinas.'; },
    d=>'Dia dois: os dois caminhões de soltura saem do galpão de máquinas com bateria nova e pneu calibrado' + (d.flags.plano_de_soltura ? ', e o cunhado do guarda mais novo cobra o conserto e depois não aceita o dinheiro.' : '.'),
    'Dia três: vocês voltam ao setor 7 e o curral tem trinta e um dentro.',
    d=>d.flags.jorge_conversou ? 'Trinta e um voltaram por fome, em três dias, exatamente como o Sr. Ulric disse.'
      : d.flags.sabe_que_voltam ? 'Trinta e um voltaram por fome, em três dias, exatamente como os guardas do bar disseram.'
      : 'Trinta e um voltaram por fome, em três dias.',
    'E vocês embarcam os trinta e um e levam a quarenta e dois quilômetros, e não é uma vitória, é uma correção.',
    'No ponto de soltura, um Kangaskhan, dos trinta e um, não desce do caminhão. Ele fica.',
    'Os outros cinquenta e seis ninguém sabe.',
    d=>d.flags.tem_os_vinculos ? 'E nas doze folhas de caderno do peão você confere: dos trinta e um que voltaram, dezenove eram filhotes.' : ''
  ],
  ef:{flag:['corrigiu_a_soltura','soltou_organizado'],
      rep:{eixo:'bom',delta:6,motivo:'Voltou e consertou a própria pressa'},
      moral:20, hp:-5, causa:'Três dias sem parar',
      umaVez:'c12_p1', pokemon:{dex:115, nivel:32, opcoes:{moral:45, historia:'Voltou ao curral do setor 7 por fome, em três dias. No ponto de soltura, da segunda vez, não quis descer do caminhão.'}},
      registrar:'Trinta e um voltaram por fome em três dias e foram levados a 42 km na segunda tentativa.',
      presagio:'Não é vitória, é correção. A maior parte do que se faz de bom é correção.',
      executar:d=>{ Relogio.viver(72); return []; }},
  escolhas:[
    {texto:'Ir ao diretor.', vai:'c12_diretor'},
    {texto:'Ir ao Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar tudo à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Sair de Fuchsia.', vai:'c12_fim'}
  ]
},

c12_sabotou:{
  texto:[
    'Você destrói o corredor de contenção.',
    'É trabalho braçal e leva uma hora e quarenta: você tira os pinos de travamento das seções de tubo com uma marreta encontrada no contêiner, e sem os pinos a estrutura não fica de pé, e sem a estrutura não existe corredor, e sem corredor ninguém embarca oitenta e sete Pokémon em caminhão.',
    'Você também quebra a célula de carga da balança de passagem, que é uma peça pequena e cara, e a marreta resolve.',
    d=>c12_esvaziado(d) ? 'O curral já está vazio. Isso é pro que voltar por fome: sem corredor, ninguém reembarca.' : 'Isso não solta ninguém.',
    'Isso compra tempo: seis a nove semanas, entre orçamento, licitação e instalação, porque a firma é de fora e a reserva compra por licitação.',
    d=>{ const f = d.flags, t = [];
         if (f.koga_convoca || f.koga_descredencia || f.koga_tem_tudo) t.push('uma reunião extraordinária de conselho');
         if (f.diretor_suspende) t.push('uma revisão técnica de capacidade de suporte');
         if (f.diretor_vai_a_junta) t.push('quinze dias de férias de um diretor no cartório de Celadon');
         return t.length ? (t.length === 1 ? 'Em seis a nove semanas cabe ' : 'Em seis a nove semanas cabem ') + c12_lista(t) + '.'
           : 'Seis a nove semanas é tempo de alguém, em algum lugar, fazer a parte que leva tempo.'; },
    d=>c12_esvaziado(d) ? '' : 'Você não salvou ninguém hoje.',
    d=>(d.flags.koga_convoca || d.flags.koga_descredencia || d.flags.koga_tem_tudo || d.flags.diretor_suspende || d.flags.diretor_vai_a_junta)
      ? 'Você fez caber o que já estava andando devagar.' : 'Você comprou tempo pra uma coisa que ainda não começou.'
  ],
  ef:{flag:['sabotou_o_curral','comprou_tempo'],
      rep:{eixo:'bom',delta:5,motivo:'Comprou seis a nove semanas com uma marreta'},
      instabilidade:1,
      registrar:'Destruiu o corredor de contenção e a balança: 6 a 9 semanas até nova licitação.',
      presagio:'Uma marreta e uma célula de carga. O que é lento ganhou semanas.',
      executar:d=>{ Relogio.avancar(2); return []; }},
  escolhas:[
    {texto:'Abrir o curral também.', vai:'c12_abriu_curral', cond:d=>(!c12_esvaziado(d)) && !Historia.jaAconteceu('c12_abriu_curral')},
    {texto:'Fotografar tudo e sair.', vai:'c12_fotografou_zona', cond:d=>!Historia.jaAconteceu('c12_fotografou_zona')},
    {texto:'Ir ao Koga contar que comprou tempo.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Ir ao diretor.', vai:'c12_diretor'},
    {texto:'Ir embora.', vai:'c12_saiu_zona'}
  ]
},

c12_fotografou_zona:{
  texto:[
    'Você fotografa tudo.',
    d=>`${c12_esvaziado(d) ? 'O curral vazio' : 'O curral cheio'}, em três ângulos. O brete. A balança de passagem com a etiqueta de aferição, válida, em dia. A rampa de embarque. A caixa de brincos numerados. A prancheta pendurada no mourão com a escala da semana.`,
    'E um detalhe: a placa de identificação da estrutura, parafusada no tubo do brete, com o nome da firma que instalou e o número da nota de empenho da compra.',
    'Nota de empenho é dinheiro público com número.',
    'Vinte e uma fotos.',
    d=>c12_esvaziado(d) ? 'Depois você sai.'
      : d.flags.jorge_conversou ? 'Depois você sai sem abrir nada, porque o Sr. Ulric disse que abrir sem ter pra onde levar é o mesmo que não abrir — e você não sabe se repetir a frase dele é sabedoria ou covardia.'
      : 'Depois você sai sem abrir nada.'
  ],
  ef:{flag:['provas_zona','escolha_fria','fotos_do_setor7'],
      rep:{eixo:'bom',delta:3,motivo:'Documentou o setor 7 inteiro com número de nota de empenho'},
      moral:-10,
      registrar:'Fotografou o setor 7: 21 fotos, incluindo a placa com a nota de empenho da estrutura.'},
  escolhas:[
    {texto:'Levar tudo pro Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Levar à Dra. Cordell.', vai:'c12_entregar', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Levar à Liga.', vai:'c12_liga_zona', cond:d=>!Historia.jaAconteceu('c12_liga_zona')},
    {texto:'Vender a rota à Terceira.', vai:'c12_vendeu_zona', cond:d=>(['mercenario','foragido'].includes(Historia.via())) && !Historia.jaAconteceu('c12_vendeu_zona')},
    {texto:'Voltar e abrir o curral mesmo assim.', vai:'c12_abriu_curral', cond:d=>(!c12_esvaziado(d)) && !Historia.jaAconteceu('c12_abriu_curral')}
  ]
},

c12_saiu_zona:{
  repetivel:true,
  texto:[
    'Você sai do setor 7 no escuro e anda os três quilômetros de volta sem lanterna, porque a lanterna atrai.',
    d=>d.flags.c12_esperou_amanhecer ? 'Você espera no mato até o céu começar a clarear, porque sair da reserva pela estrada no meio da noite é pedir pra ser visto.' : '',
    'Na cidade, às cinco da manhã, a padaria já está com a luz acesa e o cheiro já está na rua, e a dona está sovando massa na bancada da frente e te vê passar pelo vidro.',
    'Ela levanta a mão.',
    'Você levanta a mão de volta.',
    d=>{ const c = d.flags.sabe_dos_cinquenta_e_dois, n = d.flags.ninguem_pergunta;
         if (c && n) return 'Cinquenta e dois por cento do orçamento desta cidade vem daquela cerca, e a mulher está sovando massa às cinco da manhã, e ela nunca perguntou pra onde levam, e as duas coisas são verdade ao mesmo tempo e nenhuma delas é culpa dela.';
         if (c) return 'Cinquenta e dois por cento do orçamento desta cidade vem daquela cerca, e a mulher está sovando massa às cinco da manhã, e as duas coisas são verdade ao mesmo tempo.';
         if (n) return 'A mulher está sovando massa às cinco da manhã e nunca perguntou pra onde levam, e você não consegue achar a parte disso que é culpa dela.';
         return 'Uma cidade inteira dormindo do lado de uma cerca, e a primeira luz acesa é a de quem faz pão.'; }
  ],
  ef:{flag:'saiu_do_setor7', moral:-5,
      executar:d=>{ const h = c12_hora(d); Estado.marcar('c12_esperou_amanhecer', h >= 19 || h < 4); if (h >= 19 || h < 5) Relogio.ate(5); return []; }},
  escolhas:[
    {texto:'Ir ao Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia, repetivel:true},
    {texto:'Ir ao diretor.', vai:'c12_diretor', repetivel:true},
    {texto:'Ir à Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara, repetivel:true},
    {texto:'Sair de Fuchsia.', vai:'c12_fim'}
  ]
},

c12_entregar:{
  texto:[
    'Você reúne tudo que tem numa mesa de pousada em Fuchsia e olha a pilha.',
    d=>{ const t = c12_pilha(d); return t.length ? 'Você tem: ' + c12_lista(t) + '.' : 'Você tem o que viu e mais nada, e o que você viu não é documento.'; },
    d=>c12_pilha(d).length ? 'É mais material do que a Liga juntou sobre a Zona Safári em vinte anos, e você juntou em poucos dias porque perguntou às pessoas que estavam ali o tempo todo.' : ''
  ],
  escolhas:[
    {texto:'Levar à Dra. Cordell.', vai:'c12_ivone_zona', cond:d=>(!!d.flags.cartao_ivone) && !Historia.jaAconteceu('c12_ivone_zona')},
    {texto:'Levar à Liga.', vai:'c12_liga_zona', cond:d=>!Historia.jaAconteceu('c12_liga_zona')},
    {texto:'Levar à imprensa de Fuchsia.', vai:'c12_imprensa_zona', cond:d=>(c12_pilha(d).length > 0) && !Historia.jaAconteceu('c12_imprensa_zona')},
    {texto:'Entregar ao Koga, para a reunião do conselho.', vai:'c12_entregou_koga', cond:d=>(!!d.flags.conheceu_koga && c12_pilha(d).length > 0) && !Historia.jaAconteceu('c12_entregou_koga')},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona', repetivel:true},
    {texto:'Guardar tudo e seguir viagem.', vai:'c12_fim'}
  ]
},

c12_entregou_koga:{
  texto:[
    d=>'Koga recebe a pilha no chão da varanda, senta de pernas cruzadas, e organiza por tipo antes de ler: documento oficial de um lado, documento interno de outro, foto de outro'
      + (d.flags.tem_os_vinculos ? ', e as doze folhas de caderno escritas à mão num lugar só delas.' : '.'),
    'Ele leva duas horas.',
    d=>d.flags.tem_os_vinculos ? 'Na hora e quarenta ele para nas doze folhas e lê elas três vezes.' : '',
    d=>d.flags.tem_os_vinculos ? fala('Koga', 'Quem escreveu isso?') : fala('Koga', 'Isso aqui é tudo procedimento. Procedimento o conselho responde com regimento.'),
    d=>fala(d.jogador.nome, d.flags.tem_os_vinculos ? 'Um peão do setor 7. O que conversa com eles.' : 'Então não adianta?'),
    d=>d.flags.tem_os_vinculos ? 'Koga põe a mão em cima das folhas.' : '',
    d=>d.flags.tem_os_vinculos ? fala('Koga', 'Isso aqui é a única coisa nessa pilha que o conselho não vai conseguir responder com regimento.')
      : fala('Koga', 'Adianta. Regimento também se lê em voz alta, e ninguém gosta de ouvir o próprio nome numa ata.'),
    d=>d.flags.tem_os_vinculos ? fala(d.jogador.nome, 'Por quê?') : '',
    d=>d.flags.tem_os_vinculos ? fala('Koga', 'Porque tudo o resto é sobre procedimento e isso aqui é sobre parentesco.') : '',
    'Ele junta tudo e amarra com barbante.',
    d=>{ const quando = c12_emDias(c12_diasPraReuniao(d));
         return d.flags.tem_os_vinculos
           ? fala('Koga', `Reunião extraordinária ${quando}. Eu vou ler as doze folhas em voz alta, inteiras, na frente dos seis, e eu vou levar quarenta minutos, e ninguém vai poder me interromper porque leitura de documento é direito de conselheiro.`)
           : fala('Koga', `Reunião extraordinária ${quando}. Eu leio a ata de noventa e sete em voz alta, inteira, com os sete nomes, na frente dos seis, e ninguém pode me interromper, porque leitura de documento é direito de conselheiro.`); },
    d=>fala(d.jogador.nome, 'E depois?'),
    fala('Koga', 'E depois eu peço o descredenciamento e a votação é nominal.')
  ],
  ef:{flag:['koga_tem_tudo','koga_aliado'],
      npc:d=>({nome:'Koga', opiniao:10, memoria:d.flags.tem_os_vinculos
        ? 'Recebeu todo o material e vai ler as doze folhas de vínculos em voz alta na reunião.'
        : 'Recebeu todo o material e vai ler a ata de 1997 em voz alta na reunião.'}),
      rep:{eixo:'bom',delta:6,motivo:'Entregou tudo a quem sabia usar o regimento'},
      moral:15,
      registrar:d=>d.flags.tem_os_vinculos
        ? 'Koga vai ler as doze folhas de vínculos em voz alta na reunião extraordinária e pedir votação nominal.'
        : 'Koga vai ler a ata de 1997 em voz alta na reunião extraordinária e pedir votação nominal.',
      executar:d=>{ c12_convocar(d); Relogio.avancar(2); return []; }},
  escolhas:[
    {texto:'Ficar em Fuchsia até a reunião.', vai:'c12_ficou_pra_reuniao', cond:d=>!Historia.jaAconteceu('c12_ficou_pra_reuniao')},
    {texto:'Ir ao setor 7 hoje à noite mesmo assim.', vai:'c12_noite_zona'},
    {texto:'Levar cópia à Dra. Cordell também.', vai:'c12_ivone_zona', cond:d=>(!!d.flags.cartao_ivone) && !Historia.jaAconteceu('c12_ivone_zona')},
    {texto:'Seguir viagem.', vai:'c12_fim'}
  ]
},

c12_ficou_pra_reuniao:{
  texto:[
    d=>{ const n = d.flags.c12_dias_ate_reuniao || 11; return n === 1 ? 'Você fica mais um dia em Fuchsia.' : `Você fica ${porExtenso(n)} dias em Fuchsia.`; },
    d=>{ const n = d.flags.c12_dias_ate_reuniao || 11, coisas = [];
         if (d.flags.conheceu_yara) coisas.push('ajuda a Dra. Pia no quintal');
         coisas.push('come na padaria', 'dorme na pousada');
         let t = `${n === 1 ? 'É um dia chato' : 'São dias chatos'} e você faz coisa de gente: ${c12_lista(coisas)}`;
         if (n >= 7) t += ', e numa quarta, às duas da tarde, você passa na frente do ginásio só pra ver o portão abrir na hora marcada';
         return t + '.'; },
    'No dia marcado tem a reunião.',
    'É numa sala de escola, com cadeira de plástico e ventilador de teto, porque o conselho não tem sede.',
    d=>d.flags.tem_os_vinculos ? 'Koga lê as doze folhas em voz alta. Leva quarenta e três minutos e ninguém interrompe.'
      : 'Koga lê em voz alta, inteira, a ata de noventa e sete, com os sete nomes, o dele primeiro. Ninguém interrompe.',
    d=>d.flags.tem_os_vinculos ? 'Na parte do "os dois pequenos listrados são irmãos, do mesmo ninho, vieram juntos em abril", uma conselheira sai da sala e volta depois de cinco minutos com o olho vermelho.'
      : 'Na parte dos nomes, uma conselheira sai da sala e volta depois de cinco minutos com o olho vermelho.',
    'A votação é nominal.',
    'Quatro a três pelo descredenciamento.',
    'A que saiu da sala vota a favor.'
  ],
  ef:{flag:['descredenciou','venceu_fuchsia'],
      rep:{eixo:'bom',delta:8,motivo:'Ficou até a reunião e viu a votação nominal'},
      moral:30, instabilidade:-2,
      executar:d=>{
        c12_convocar(d);
        const n = c12_diasPraReuniao(d);
        Estado.marcar('c12_dias_ate_reuniao', n);
        Relogio.viver(n * 24);
        return [{tipo:'mundo', texto:'O Armazém Geral 7 de Celadon perdeu o credenciamento como receptor de fauna excedente.'}]; },
      registrar:'O conselho descredenciou o Armazém Geral 7 por quatro votos a três, em votação nominal.',
      presagio:'Quatro a três. Uma pessoa saiu da sala e voltou, e essa pessoa decidiu.'},
  escolhas:[
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Ir agradecer à Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.conheceu_yara},
    {texto:'Desafiar o ginásio antes de ir.', vai:'c12_desafio_koga', cond:d=>!Historia.jaAconteceu('c12_desafio_koga')}
  ]
},

c12_ivone_zona:{
  falante:'Dra. Cordell',
  vozes:['N','N','N','P','N'],
  texto:[
    'A Dra. Cordell chega em Fuchsia de ônibus, como sempre, e como sempre não traz nada além de um caderno e uma câmera.',
    'Ela lê tudo em quatro horas, na mesa da pousada, e a dona da pousada traz café três vezes sem cobrar.',
    'No fim, ela separa a pilha em dois montes.',
    '"Esse monte aqui vira matéria."',
    'É o monte pequeno.',
    '"E esse monte grande é o que eu chamo de “insuportável, mas legal”. Não dá reportagem. Dá tristeza."',
    'Ela bate no monte pequeno.',
    '"Esse aqui dá capa."',
    '"O que tem nesse?"',
    d=>d.flags.sabe_da_linha_verde ? fala('Dra. Cordell', 'O mapa fundiário. Quatro fazendas compradas por uma empresa entre noventa e cinco e noventa e sete, exatamente do lado da área que o diretor pede pra ampliar desde oitenta e um.') :
       d.flags.provou_o_erro ? fala('Dra. Cordell', 'A área de referência. Oito mil cento e sessenta hectares num documento que rege uma reserva de nove mil. Isso é erro material em ato administrativo e derruba quinze anos de decisão.') :
       fala('Dra. Cordell', 'O que você trouxe de documento oficial. É pouco e é bom.'),
    'Ela fecha o caderno.',
    '"O resto eu entrego junto pro jornal, porque tristeza também informa. Mas a capa é o número."'
  ],
  ef:{flag:['ivone_tem_zona','provas_zona'],
      npc:{nome:'Dra. Cordell', opiniao:8, memoria:'Recebeu o material de Fuchsia e separou o que dá capa do que dá tristeza.'},
      rep:{eixo:'bom',delta:5,motivo:'Entregou a Fuchsia inteira a quem publica'},
      instabilidade:-1,
      registrar:'A Dra. Cordell recebeu o material da Zona Safári.',
      executar:d=>{ Relogio.avancar(4); return []; }},
  escolhas:[
    {texto:'Ficar até a reunião do conselho.', vai:'c12_ficou_pra_reuniao', cond:d=>(!!d.flags.koga_convoca || !!d.flags.koga_descredencia) && !Historia.jaAconteceu('c12_ficou_pra_reuniao')},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Levar cópia à Liga também.', vai:'c12_liga_zona', cond:d=>!Historia.jaAconteceu('c12_liga_zona')}
  ]
},

c12_liga_zona:{
  falante:'a oficial da Liga',
  vozes:['N','P','N','N','N','P','N'],
  texto:[
    'O posto da Liga mais próximo fica em Fuchsia mesmo, numa sala do prédio da prefeitura, e é uma mesa e um armário.',
    'A oficial é uma mulher de uns trinta e cinco anos que atende a região inteira sozinha.',
    'Ela lê tudo com atenção real, faz anotação, pede para você repetir duas coisas, e no fim ela fala a verdade, que é o melhor e o pior que ela podia fazer:',
    '"Zona Safári é área de Kanto com gestão por conselho autônomo. A Liga não tem competência aqui."',
    '"Nenhuma?"',
    '"Nenhuma sobre manejo. Eu tenho competência sobre captura ilegal por particular, sobre maus-tratos em flagrante, e sobre trânsito de espécime sem guia."',
    'Ela bate na pilha.',
    '"E nada disso aqui é ilegal, e essa é a parte que eu odeio no meu trabalho."',
    'Depois ela olha pros lados numa sala em que não tem mais ninguém.',
    '"Mas trânsito sem guia eu posso fiscalizar. E eu posso montar barreira na vicinal, e eu não preciso de autorização de ninguém pra isso, e a barreira é aleatória por definição."',
    '"Você faria isso?"',
    '"Na quinta de manhã eu não tenho nada marcado."'
  ],
  ef:{flag:['liga_vai_fiscalizar','liga_tem_provas'],
      npc:{nome:'Oficial da Liga (Fuchsia)', opiniao:6, memoria:'Não tem competência sobre manejo, mas vai montar barreira aleatória na vicinal na quinta de manhã.'},
      rep:{eixo:'bom',delta:4,motivo:'Achou a única competência que a Liga tinha e usou ela'},
      registrar:'A Liga vai montar barreira de fiscalização de trânsito na vicinal, quinta de manhã.',
      presagio:'A barreira é aleatória por definição. E ela escolheu a quinta depois de ler a sua pilha.'},
  escolhas:[
    {texto:'Ficar para ver a barreira na quinta.', vai:'c12_barreira', cond:d=>(!c12_esvaziado(d) && !d.flags.sabotou_o_curral) && !Historia.jaAconteceu('c12_barreira')},
    {texto:'Ir ao setor 7 hoje à noite.', vai:'c12_noite_zona'},
    {texto:'Levar cópia à Dra. Cordell.', vai:'c12_ivone_zona', cond:d=>(!!d.flags.cartao_ivone) && !Historia.jaAconteceu('c12_ivone_zona')},
    {texto:'Seguir viagem.', vai:'c12_fim'}
  ]
},

c12_barreira:{
  texto:[
    'Quinta, sete e dez da manhã, quilômetro quatro da estrada vicinal.',
    'Dois cones, uma viatura atravessada e uma oficial da Liga com prancheta.',
    'O caminhão baú encosta às sete e vinte e dois.',
    'Ela pede a guia de trânsito de fauna.',
    'O motorista entrega a nota fiscal.',
    'Ela devolve a nota fiscal e pede a guia de trânsito de fauna.',
    'O motorista entrega a autorização de manejo.',
    'Ela devolve a autorização de manejo e pede a guia de trânsito de fauna, e explica, com paciência de professora, que guia de trânsito de fauna é documento individual por espécime, emitido pelo órgão ambiental, e que ele está transportando oitenta e sete espécimes vivos.',
    'O motorista liga pra alguém.',
    'Às oito e cinquenta chega um advogado de Celadon de carro.',
    'Às onze e quarenta a carga é desembarcada ali mesmo, na beira da estrada, em recinto provisório, por decisão de fiscalização.',
    'E às catorze horas, oitenta e sete Pokémon que iam pra Celadon estão numa área de pastagem cercada no quilômetro quatro, com água, sob custódia da Liga, porque ninguém tem guia pra nenhum deles.',
    'Ninguém nunca teve guia pra nenhum deles.',
    'Quinze anos.'
  ],
  ef:{flag:['barreira_funcionou','esvaziou_o_setor7'],
      rep:{eixo:'bom',delta:8,motivo:'Parou um embarque inteiro com um documento que ninguém nunca pediu'},
      moral:30, instabilidade:-1,
      executar:d=>{ Relogio.ateODia(3, 7); Relogio.ate(14);
        return [{tipo:'liga', texto:'Oitenta e sete espécimes estão sob custódia da Liga por ausência de guia de trânsito.'}]; },
      registrar:'A barreira da Liga parou o embarque: ninguém nunca emitiu guia de trânsito em quinze anos.',
      presagio:'Ninguém nunca pediu o documento. Quinze anos. Foi só pedir.'},
  escolhas:[
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Ficar para a reunião do conselho.', vai:'c12_ficou_pra_reuniao', cond:d=>(!!d.flags.koga_convoca || !!d.flags.koga_descredencia) && !Historia.jaAconteceu('c12_ficou_pra_reuniao')}
  ]
},

c12_imprensa_zona:{
  falante:'a editora do jornal',
  vozes:['N','P','N','P','N','N'],
  texto:[
    'O jornal de Fuchsia tem três funcionários e sai duas vezes por semana, segunda e quinta, e fica numa sala com uma impressora do tamanho de um armário.',
    'A editora tem sessenta anos e é dona do jornal e escreve tudo.',
    'Ela lê o material inteiro e depois olha pra você por um tempo.',
    fala('a editora do jornal', 'Você sabe que cinquenta e dois por cento do orçamento desta cidade vem de lá.'),
    d=>fala(d.jogador.nome, d.flags.sabe_dos_cinquenta_e_dois ? 'Sei.' : 'Não sabia.'),
    '"E que a minha banca vende quatrocentos exemplares e que trezentos deles são comprados por gente que trabalha na reserva ou é casada com quem trabalha."',
    '"Imagino."',
    'Ela põe o material na mesa.',
    '"Eu publico."',
    '"Você publica?"',
    '"Eu tenho sessenta anos e esse jornal desde os vinte e sete, e eu já publiquei coisa que fechou porta de comércio nessa cidade."',
    'Ela pega a caneta.',
    d=>fala('a editora do jornal', `Mas eu não publico foto de curral. Eu publico ${c12_edicao(d).oque}, porque foto de curral vira briga sobre sentimento, e número vira briga sobre conta.`),
    '"E briga sobre conta é a única que a gente ganha em cidade pequena."'
  ],
  ef:{flag:['imprensa_zona','provas_zona'],
      npc:d=>({nome:'Editora do jornal de Fuchsia', opiniao:6, memoria:`Vai publicar ${c12_edicao(d).oque}, e não a foto do curral.`}),
      rep:{eixo:'bom',delta:5,motivo:'Levou a Fuchsia inteira pro jornal da própria Fuchsia'},
      instabilidade:1,
      registrar:d=>`O jornal de Fuchsia vai publicar ${c12_edicao(d).oque}.`,
      presagio:'"Briga sobre conta é a única que a gente ganha em cidade pequena." Ela tem trinta e três anos de prática.'},
  escolhas:[
    {texto:'Ficar até sair a edição.', vai:'c12_saiu_a_edicao', cond:d=>!Historia.jaAconteceu('c12_saiu_a_edicao')},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Levar cópia à Dra. Cordell.', vai:'c12_ivone_zona', cond:d=>(!!d.flags.cartao_ivone) && !Historia.jaAconteceu('c12_ivone_zona')},
    {texto:'Seguir viagem.', vai:'c12_fim'}
  ]
},

c12_saiu_a_edicao:{
  texto:[
    d=>`Sai na ${Calendario.SEMANA[d.flags.c12_edicao_dia === 0 ? 0 : 3]}.`,
    d=>`Manchete de primeira página, corpo setenta e dois, com ${c12_edicao(d).quadro}.`,
    d=>`O título é: **${c12_edicao(d).titulo}**.`,
    'Quatrocentos exemplares.',
    d=>`Na manhã seguinte a padaria está cheia e o assunto é um só, e é um assunto de conta, e as pessoas estão discutindo ${c12_edicao(d).assunto} no balcão da padaria com pão de queijo na mão.`,
    'Duas mulheres brigam feio na fila.',
    d=>`Um homem de uns cinquenta anos fica lendo ${c12_edicao(d).leitura} por muito tempo e depois dobra o jornal e leva pra casa em vez de deixar no balcão.`,
    'Não muda nada nesta semana.',
    'E é a primeira vez em quinze anos que Fuchsia discute em voz alta o que sai da cerca, no balcão de uma padaria, com pão de queijo.'
  ],
  ef:{flag:['fuchsia_discutiu','provas_zona'],
      rep:{eixo:'bom',delta:6,motivo:'Fez uma cidade discutir a própria conta em voz alta'},
      moral:20, instabilidade:1,
      registrar:'O jornal de Fuchsia publicou o que você levou. A cidade discutiu.',
      /* a próxima edição: segunda ou quinta, a que vier primeiro depois de hoje */
      executar:d=>{
        const hoje = Calendario.hoje().semanaIdx, falta = s => ((s - hoje + 7) % 7) || 7;
        const s = falta(0) < falta(3) ? 0 : 3;
        Estado.marcar('c12_edicao_dia', s);
        Relogio.ateODia(s, 7, true); Relogio.amanhaAs(8);
        return []; }},
  escolhas:[
    {texto:'Ficar para a reunião do conselho.', vai:'c12_ficou_pra_reuniao', cond:d=>(!!d.flags.koga_convoca || !!d.flags.koga_descredencia) && !Historia.jaAconteceu('c12_ficou_pra_reuniao')},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Ir ao ginásio.', vai:'c12_desafio_koga', cond:d=>(!!d.flags.conheceu_koga) && !Historia.jaAconteceu('c12_desafio_koga')}
  ]
},

c12_vendeu_zona:{
  texto:[
    'Você vende.',
    'A informação sobre o setor 7 vale porque é operacional: escala de plantão, horário de embarque, rota da vicinal, e o nome do receptor credenciado.',
    'A Terceira paga bem e paga na hora e não faz nenhuma pergunta sobre a sua consciência, o que é uma cortesia profissional.',
    'O contato dela conta as notas duas vezes na sua frente e não diz o que vão fazer com a rota. Não precisa.',
    'Você ganhou dinheiro numa transação em que o outro lado também ganhou.',
    'É assim que funciona quando você vende informação: ninguém perde, menos quem já estava perdendo.'
  ],
  ef:{dinheiro:18000, flag:['vendeu_a_zona','trabalha_para_terceira'],
      rep:{eixo:'ruim',delta:4,motivo:'Vendeu a rota da Zona Safári'},
      moral:-30, instabilidade:1,
      npc:{nome:'A Terceira', opiniao:5, memoria:'Comprou de você a escala, a rota e o horário do setor 7.'},
      registrar:'Vendeu à Terceira a operação inteira do setor 7.',
      presagio:'Ninguém perde, menos quem já estava perdendo. É a definição de mercado.'},
  escolhas:[
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Voltar e abrir o curral mesmo assim.', vai:'c12_noite_zona'},
    {texto:'Devolver o dinheiro.', vai:'c12_devolveu_o_dinheiro'},
    {texto:'Levar cópia à Dra. Cordell assim mesmo.', vai:'c12_ivone_zona', cond:d=>(!!d.flags.cartao_ivone) && !Historia.jaAconteceu('c12_ivone_zona')}
  ]
},

c12_devolveu_o_dinheiro:{
  falante:'o contato da Terceira',
  vozes:['N','P','N','N','P','N'],
  texto:[
    'Você volta ao contato e devolve os dezoito mil.',
    'Ele conta. Duas vezes. E depois liga pra alguém e fala baixo e desliga.',
    '"Ela disse pra você ficar com o dinheiro."',
    '"Eu não quero."',
    '"Ela disse que sabia que você ia dizer isso e que você fica com o dinheiro do mesmo jeito, porque informação entregue não volta e pagamento recusado não desfaz entrega."',
    'Ele põe o maço na sua mão.',
    '"E ela mandou dizer mais uma coisa."',
    '"O quê?"',
    '"Que agora você sabe exatamente quanto custa, e que isso é mais útil pra você do que pra ela."'
  ],
  ef:{flag:'tentou_devolver',
      rep:{eixo:'bom',delta:1,motivo:'Tentou desfazer o que não desfaz'},
      moral:5,
      npc:{nome:'A Terceira', opiniao:4, memoria:'Recusou receber de volta o pagamento pela rota do setor 7.'},
      registrar:'Tentou devolver o pagamento da Terceira. Ela recusou.'},
  escolhas:[
    {texto:'Voltar e abrir o curral.', vai:'c12_noite_zona'},
    {texto:'Levar tudo à Dra. Cordell.', vai:'c12_ivone_zona', cond:d=>(!!d.flags.cartao_ivone) && !Historia.jaAconteceu('c12_ivone_zona')},
    {texto:'Levar tudo ao Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia},
    {texto:'Seguir viagem.', vai:'c12_fim'}
  ]
},

c12_desistiu_zona:{
  texto:[
    'Você vai embora de Fuchsia.',
    'Pega o primeiro ônibus, o das seis e vinte, e senta na janela do lado esquerdo, que é o lado da cerca.',
    'Trinta e um quilômetros de alambrado passando devagar, com o sol nascendo por cima.',
    'É lindo. Essa é a parte que não deveria ser verdade e é.',
    'Aos vinte minutos de estrada você vê, do outro lado do vidro, uma clareira com refletor de obra apagado e uma estrutura de tubo galvanizado que daqui parece coisa de fazenda.',
    'Aos vinte e dois minutos não dá mais pra ver.'
  ],
  ef:{flag:'desistiu_de_fuchsia', moral:-15,
      rep:{eixo:'ruim',delta:2,motivo:'Foi embora de Fuchsia sem fazer nada'},
      registrar:'Saiu de Fuchsia sem agir.',
      presagio:'Aos vinte e dois minutos não dá mais pra ver. É essa a tecnologia da cerca.',
      executar:d=>{ Relogio.ate(6); return []; }},
  escolhas:[
    {texto:'Descer na próxima parada e voltar.', vai:'c12_voltou_do_onibus', ef:{limpaFlag:'desistiu_de_fuchsia'}},
    {texto:'Seguir viagem.', vai:'c12_fim'},
    {texto:'Descer e voltar só para falar com o Koga.', vai:'c12_koga', ef:{limpaFlag:'desistiu_de_fuchsia'}},
    {texto:'Descer e voltar só para falar com a Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara, ef:{limpaFlag:'desistiu_de_fuchsia'}}
  ]
},

c12_voltou_do_onibus:{
  texto:[
    'Você desce na parada seguinte, atravessa a pista e espera o ônibus que vem no sentido contrário.',
    'Fuchsia continua do mesmo tamanho. A cerca também.'
  ],
  escolhas:[
    {texto:'Falar com o diretor da reserva.', vai:'c12_diretor', repetivel:true},
    {texto:'Ir falar com o Koga.', vai:'c12_koga', cond:d=>!!d.flags.achou_ginasio_fuchsia, repetivel:true},
    {texto:'Ir à Dra. Pia.', vai:'c12_yara', cond:d=>!!d.flags.sabe_da_yara, repetivel:true},
    {texto:'Ir pro bar dos guardas.', vai:'c12_bar', repetivel:true},
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona', repetivel:true}
  ]
},

c12_fim:{
  texto:[
    d=>{
      if (d.flags.barreira_funcionou) return 'Oitenta e sete estão numa pastagem cercada no quilômetro quatro, sob custódia, porque uma oficial da Liga pediu um papel que ninguém tinha pedido em quinze anos.';
      if (d.flags.soltou_organizado) return 'Oitenta e sete estão a quarenta e dois quilômetros dali, num ponto de soltura que só existe num mapa de mil novecentos e oitenta e nove, e nenhum vai voltar por fome.';
      if (d.flags.sabotou_o_curral) return 'O corredor de contenção do setor 7 está no chão em seções de tubo, e a licitação de reposição leva seis a nove semanas, e você comprou essas semanas com uma marreta.';
      if (d.flags.abriu_o_curral) return 'O curral do setor 7 está aberto e vazio, e você não sabe quantos vão voltar em três dias.';
      if (d.flags.provou_o_erro) return 'Você tem uma pilha de papel que prova que a conta está errada desde oitenta e cinco, e papel demora, e você já aprendeu isso em duas cidades.';
      if (d.flags.provas_zona) return 'Você tem uma pilha de papel sobre a Zona Safári, e papel demora, e você já aprendeu isso em duas cidades.';
      return 'A cerca continua com trinta e um quilômetros e o curral continua com oitenta e sete dentro.';
    },
    d=>d.flags.descredenciou ? 'E o Armazém Geral 7 de Celadon não é mais receptor credenciado de fauna excedente da Zona Safári, por quatro votos a três, em votação nominal, numa sala de escola com ventilador de teto.' :
       d.flags.koga_convoca || d.flags.koga_descredencia || d.flags.koga_tem_tudo ? `E ${c12_emDias(c12_diasPraReuniao(d))} tem reunião extraordinária de conselho numa sala de escola, e Koga tem um voto e seis telefones.` :
       d.flags.diretor_suspende ? 'E a retirada anual de duzentos e quarenta perdeu base legal, por uma revisão técnica que um servidor de trinta e um anos assinou na mesa dele.' :
       d.flags.entendeu_a_conta || d.flags.provou_o_erro ? 'E ninguém refez a planilha de setenta e um.' :
       'E a planilha que diz quanto a reserva suporta continua numa gaveta, sem ninguém conferir.',
    'Você desce pro cais de Fuchsia pela estrada que contorna a reserva, cinco quilômetros de cerca até o mar.',
    'Nos cinco quilômetros, de dentro do ônibus, você vê mais Pokémon do que viu em todo o resto de Kanto somado.',
    'Um bando de Nidorino na borda do capinzal. Um Kangaskhan com filhote, a uns quarenta metros da pista, que levanta a cabeça quando o ônibus passa e não sai do lugar.',
    'É lindo.',
    'Isso é o que ninguém te prepara pra sentir: é lindo, é bem cuidado, é a maior área protegida de Kanto, e nada disso é mentira.',
    'A próxima coisa no seu mapa é o mar.',
    'Ao sul de Fuchsia ficam as Ilhas Seafoam, duas ilhas de rocha branca furadas por dentro, e os pescadores dizem que a água em volta delas está esfriando há meses.'
  ],
  fim:true, resumo:'Capítulo 12 concluído — a Zona Safári te ensinou que a conta errada mata mais que o crime.'

}

}}

);
