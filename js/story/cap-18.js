/* ------------------------------------------------------------
   ABERTURAS — o capítulo do papel. Ele começa onde a ficha cai:
   numa fila de banco, num arquivo público, na mesa de quem já
   tinha o nome e não tinha papel, no terminal de quem tem crachá,
   ou na pasta de quem já é perito da própria Comissão.
   ------------------------------------------------------------ */
const C18_ABERTURAS = ['c18_fio', 'c18_ab_a_fila_do_banco', 'c18_ab_o_diario_oficial', 'c18_ab_a_reporter', 'c18_ab_de_cracha', 'c18_ab_o_perito'];
function c18_cabe(id, d){
  /* perito não sai procurando o nome do próprio crachá */
  if (id === 'c18_ab_o_perito') return c18_perito();
  if (c18_perito()) return false;
  if (id === 'c18_ab_a_reporter') return !!d.flags.reika_te_abordou;
  if (id === 'c18_ab_de_cracha'){
    const c = typeof Cargos !== 'undefined' && Cargos.doCracha();
    return !!c && c.id !== 'comissao';
  }
  return true;
}
function c18_abertura(d){
  const cand = C18_ABERTURAS.filter(id => c18_cabe(id, d));
  const id = Dados.escolher(cand);
  if (d && d.relogio && d.flags && d.flags.c18_chegada == null){
    /* o que era verdade ao chegar: as cenas do 18 marcam as mesmas
       flags, e o texto precisa saber o que o jogador já sabia antes */
    d.flags.c18_sabia_da_comissao = !!d.flags.sabe_da_comissao;
    d.flags.c18_conhecia_brill = !!(d.npcs && d.npcs['Auditora Brill']);
    /* banco, biblioteca, praça e terminal são de dia */
    const h = c18_hora(d);
    if (h < 9 || h >= 16) c18_ate(10, true);
    d.flags.c18_chegada = d.relogio.dia;
  }
  return id;
}

/* ------------------------------------------------------------
   O RELÓGIO. O cartório fecha às cinco, a leitura entra pela noite
   e a matéria sai na quinta: cena que diz a hora leva o relógio até
   ela, no executar.
   ------------------------------------------------------------ */
function c18_hora(d){ sincronizarHora(d.relogio); return d.relogio.hora; }
/* a próxima vez que der h horas; na cidade o time come (viver) */
function c18_ate(h, emTerra){
  const r = Estado.dados.relogio; sincronizarHora(r);
  const falta = (h - r.hora + 24) % 24;
  if (falta){ if (emTerra) Relogio.viver(falta); else Relogio.avancar(falta); }
  return falta;
}
/* "quinta que vem": nunca amanhã nem depois de amanhã */
function c18_diasAteQuinta(){
  let n = (3 - Calendario.hoje().semanaIdx + 7) % 7;
  if (n < 3) n += 7;
  return n;
}
/* o cartório só atende das nove às cinco */
function c18_cartorioAberto(d){ const h = c18_hora(d); return h >= 9 && h < 17; }

/* ------------------------------------------------------------
   QUEM SABE O QUÊ. O 18 chega depois de muita estrada: tem quem
   leu o estatuto velho no mato da Rota 25 (6), quem ouviu o Fabre
   no S.S. Anne (8), quem copiou os onze nomes em Celadon (9), quem
   conhece a Brill do pregão (9) ou da Zona Safári (12), e quem é
   perito da própria Comissão. O texto não finge que é novidade.

   A associação tem nove anos (é a que aparece na junta do 9). Há um
   ano e oito meses ela reformou o estatuto e passou a se chamar
   CGRB; é dessa reforma que vêm o Art. 19 de agora, as 34 atas e o
   nome que está no banco, no cartório e no jornal.
   ------------------------------------------------------------ */
function c18_eu(t){ return d => fala(d.jogador.nome, t); }
function c18_perito(){ return typeof Cargos !== 'undefined' && Cargos.tem('comissao'); }
/* cena de outro capítulo que aconteceu nesta jornada */
function c18_cena(d, cap, id){ return !!(d.cenasAplicadas && d.cenasAplicadas[cap + ':' + id]); }
/* "a Comissão", dita assim, antes de o 18 começar */
function c18_sabiaComissao(d){
  if (c18_perito()) return true;
  return d.flags.c18_chegada != null ? !!d.flags.c18_sabia_da_comissao : !!d.flags.sabe_da_comissao;
}
function c18_conheciaBrill(d){
  if (c18_perito()) return true;
  return d.flags.c18_chegada != null ? !!d.flags.c18_conhecia_brill : !!(d.npcs && d.npcs['Auditora Brill']);
}
/* o estatuto velho, de antes da reforma, lido no mato da Rota 25 */
function c18_leuEstatutoVelho(d){ return c18_cena(d, 6, 'c6_leu_estatuto'); }
/* o Fabre do S.S. Anne: de terno, sapato limpo, e nome só se você perguntou */
function c18_viuFabreNoAnne(d){ return c18_cena(d, 8, 'c8_ganhou_torneio'); }
function c18_sabeNomeFabre(d){
  const f = d.flags;
  return c18_perito() || !!(f.sabe_do_adnan || f.conhece_o_nome_adnan || f.conheceu_adnan);
}
/* sabe que existe um Fabre: pelo nome, pelo navio ou pelo papel */
function c18_sabeDeFabre(d){ return c18_sabeNomeFabre(d) || c18_viuFabreNoAnne(d); }
/* o balão do homem de barba da 704 */
function c18_rotuloFabre(d){
  if (c18_sabeNomeFabre(d)) return 'Curador Fabre';
  return c18_viuFabreNoAnne(d) ? 'o homem de sapato limpo' : 'o homem de barba';
}
function c18_sabeColman(d){ const f = d.flags; return !!(f.sabe_de_renno || f.sabe_do_renno || f.a_mesma_gente); }
function c18_sabeDosOnze(d){ const f = d.flags; return !!(f.os_onze_nomes_da_comissao || f.tem_os_onze_nomes); }
function c18_bolsista(d){ return !!d.flags.assinou_com_a_comissao; }
/* o que conversava com o Dr. Fuji: o caderno de Cinnabar ou o tanque vago do andar 11 */
function c18_sabeDoUm(d){ return !!(d.flags.leu_caderno || d.flags.viu_os_doze); }
/* quantos lendários você já teve na frente */
function c18_lendariosVistos(d){ return Object.values(d.lendarios || {}).filter(l => l && l.encontros > 0).length; }
/* mexeu em coisa deles pela estrada: o que uma ata chama de interferência */
function c18_interferiu(d){
  const f = d.flags;
  return !!(f.papel_com_brasao || f.livro_de_destinos || f.provas_zona || f.achou_equipe_na_ilha
         || f.tem_gente_atras_do_mew || f.koga_descredencia || f.queimou_o_portao);
}
/* papel com carimbo, assinatura ou brasão que dá pra pôr na mesa de uma repórter */
const C18_DOCUMENTOS = ['copia_dos_oito_convenios','copia_das_onze_ocorrencias','tem_os_relatorios_da_nishino',
  'copia_do_hideo','copia_do_livro_de_bordo','tem_a_via_rosa','provas_navio',
  'tem_a_caderneta_do_binoculo','imprimiu_do_terminal','tem_a_lista_dos_trinta_e_um'];
function c18_documentos(d){ return C18_DOCUMENTOS.filter(f => d.flags[f]).length; }
/* comprou as atas no balcão, com recibo */
function c18_comprou(d){ return !!(Historia.jaAconteceu('c18_quintela_copia') || Historia.jaAconteceu('c18_voltou_amanha')); }
/* ir ao cartório: a primeira vez é a fila; depois, o balcão da Sra. Cybil */
function c18_aoCartorio(texto, volta){
  return [
    {texto, vai:'c18_cartorio', cond:d => !d.flags.tem_as_atas && !Historia.jaAconteceu('c18_quintela_achou')},
    {texto:volta, vai:'c18_quintela_copia', cond:d => !d.flags.tem_as_atas && Historia.jaAconteceu('c18_quintela_achou')}
  ];
}
/* quem trouxe você até o balcão do Fabre: a cena de lá marca o jeito */
function c18_comoFabre(d){
  const f = d.flags;
  if (f.c18_fabre_quarto) return 'quarto';
  if (f.c18_fabre_elevador) return 'elevador';
  if (f.c18_fabre_telefone) return 'telefone';
  if (f.c18_fabre_almoco) return 'almoco';
  if (f.c18_fabre_brill) return 'brill';
  if (f.c18_fabre_procurou) return 'procurou';
  return 'bilhete';
}

/* a noite da leitura: quantas partes do calhamaço você abriu */
const C18_LEITURA = ['c18_estatuto','c18_art4_2','c18_art11','c18_art19','c18_regulamento','c18_quantos_formularios',
  'c18_atas','c18_31a','c18_voto_vencido','c18_outros_votos_adnan','c18_34a','c18_risco_02','c18_matriz_original',
  'c18_item_44','c18_seu_nome_nas_atas','c18_anexos','c18_anexo_orcamento','c18_tres_empresas','c18_centro_de_custo',
  'c18_art33','c18_anexo_fornecedores','c18_vigilancia','c18_anexo_pessoal','c18_anexo_campo','c18_croqui_estacao4',
  'c18_indice_silph','c18_indice_safari','c18_indice_cinnabar','c18_indice_seafoam'];
function c18_lidas(){ return C18_LEITURA.filter(id => Historia.jaAconteceu(id)).length; }
/* o estatuto lido no poste, sem as atas: o resto do papel ainda está no cartório */
function c18_semAsAtas(){
  return [
    {texto:'Voltar amanhã e comprar as atas.', vai:'c18_voltou_amanha', cond:d => !d.flags.tem_as_atas && Historia.jaAconteceu('c18_so_estatuto')},
    {texto:'Ir atrás da sala 704 hoje mesmo.', vai:'c18_direto_na_704', cond:d => !d.flags.tem_as_atas && !Historia.jaAconteceu('c18_direto_na_704')}
  ];
}

/* ============================================================
   CAPÍTULO 18 — ATAS
   O que veio depois da Rocket não usa uniforme. Usa estatuto.
   ============================================================ */
CAPITULOS.push(
{
num:18, titulo:'Atas', local:'Saffron / Celadon', ambiente:'cidade', nivelArea:52,
tom:'muito sombrio', entradas:C18_ABERTURAS,
inicio: d => c18_abertura(d),
desvios:{
  /* perito entra na 704 como perito, não como gente de fora */
  c18_entrou_cedo_demais:{se:d => c18_perito() && d.cena !== 'c18_entrou_cedo_demais', vai:'c18_704_perito'}
},
cenas:{

c18_ab_a_fila_do_banco:{
  texto:[
    'A ficha cai numa fila de banco em Saffron, o que é o lugar mais banal possível pra uma ficha cair.',
    'Você está lá por um motivo à toa, trocar uma nota rasgada, e a fila tem dezenove pessoas e leva quarenta minutos.',
    'Na parede, ao lado do caixa, tem um quadro emoldurado com dizeres em letra de fôrma:',
    '**PRESTAÇÃO DE CONTAS — CONVÊNIOS E REPASSES — EXERCÍCIO ANTERIOR**',
    'É uma folha de papel almaço datilografada, pendurada porque a lei obriga a pendurar, num lugar onde todo mundo fica quarenta minutos parado sem nada pra ler.',
    'Você lê porque não tem nada pra fazer.',
    'Tem quatorze linhas. Nome do convenente, objeto, valor.',
    'Na décima primeira, entre um convênio de merenda e um de pavimentação, o convenente é um nome comprido que termina em sigla:',
    '**COMISSÃO DE GESTÃO DE RISCO BIOLÓGICO DE KANTO — CGRB**',
    d=>c18_sabiaComissao(d)
      ? 'Comissão. Você já ouviu essa palavra pela estrada, dita com artigo e sem complemento, do jeito que se diz o banco ou o cartório. O complemento você nunca tinha visto.'
      : 'Você não conhece o nome. Mas risco biológico, num quadro de banco, entre merenda e asfalto, faz você ler a linha duas vezes.'
  ],
  ef:{flag:['viu_a_sigla_no_quadro','sabe_o_nome_da_comissao'],
      registrar:'A Comissão de Gestão de Risco Biológico de Kanto aparece num quadro de prestação de contas pendurado numa agência bancária de Saffron.',
      presagio:'Estava num quadro na parede de um banco o tempo todo. Ninguém precisa esconder o que ninguém lê.'},
  escolhas:[
    {texto:'Anotar a linha inteira e sair da fila.', vai:'c18_ab_anotou_a_linha'},
    {texto:'Perguntar ao gerente o que é aquele quadro.', vai:'c18_ab_o_gerente'},
    {texto:'Ir direto ao cartório de pessoas jurídicas.', vai:'c18_cartorio'}
  ]
},

c18_ab_anotou_a_linha:{
  texto:[
    'Você copia a linha inteira no verso da nota rasgada, que é o único papel que você tem na mão.',
    'Convenente: CGRB. Objeto: "gestão de fauna — programa continuado". Valor: um número de sete dígitos.',
    'Sete dígitos. Um número que precisa de vírgula pra ser lido em voz alta.',
    'Você sai da fila sem trocar a nota, e a nota rasgada agora vale mais rasgada do que valia inteira.',
    'Na calçada, você lê de novo.',
    '"Programa continuado" quer dizer que não é um contrato: é uma rotina de orçamento que se renova sozinha todo ano, até alguém cancelar.',
    'E ninguém cancela o que ninguém lê.'
  ],
  ef:{flag:['tem_a_linha_do_convenio','reika_precisa_de_papel','sabe_o_nome_da_comissao'],
      registrar:'Anotou a linha do convênio da CGRB: gestão de fauna, programa continuado, valor de sete dígitos.',
      presagio:'Programa continuado se renova sozinho. Isso não começou ano passado.'},
  escolhas:[
    {texto:'Ir ao cartório de registro de pessoas jurídicas.', vai:'c18_cartorio'},
    {texto:'Ir à hemeroteca procurar o nome em jornal velho.', vai:'c18_hemeroteca'},
    {texto:'Ir à Liga e perguntar oficialmente.', vai:'c18_liga'}
  ]
},

c18_ab_o_gerente:{
  texto:[
    'O gerente tem uns quarenta e cinco anos e uma mesa com três porta-retratos virados pra ele e nenhum pra você.',
    d=>fala(d.jogador.nome, 'Aquele quadro da parede. O que é?'),
    'Ele olha pro quadro como quem olha pra um móvel.',
    fala('o gerente', 'Prestação de contas. Convênio público passa por agência bancária e agência publica.'),
    d=>fala(d.jogador.nome, 'E alguém lê?'),
    fala('o gerente', 'Você.'),
    'Ele diz isso sem ironia nenhuma, o que é pior que ironia.',
    fala('o gerente', 'Eu trabalho aqui há onze anos. Você é a primeira pessoa que pergunta desse quadro.'),
    d=>fala(d.jogador.nome, 'E onde ficam os quadros dos anos anteriores?'),
    'Aí ele para.',
    fala('o gerente', 'No arquivo morto. Por dez anos, por lei.'),
    'Ele olha pro quadro de novo, dessa vez de verdade.',
    fala('o gerente', 'Você quer ver os dez?')
  ],
  ef:{flag:'o_gerente_ofereceu_os_dez',
      npc:{nome:'o gerente', opiniao:1, viuVoce:'Você foi a primeira pessoa em onze anos a perguntar do quadro.'},
      registrar:'O banco guarda dez anos de prestações de contas no arquivo morto, por lei.'},
  escolhas:[
    {texto:'Ver os dez anos.', vai:'c18_ab_os_dez_anos'},
    {texto:'Só anotar a linha deste ano e ir embora.', vai:'c18_ab_anotou_a_linha'},
    {texto:'Ir ao cartório de pessoas jurídicas.', vai:'c18_cartorio'}
  ]
},

c18_ab_os_dez_anos:{
  texto:[
    'O arquivo morto do banco é uma sala de dois por três com prateleira de metal e uma lâmpada fluorescente que pisca.',
    'Ele tira dez pastas e põe na mesinha, e senta com você, o que ele não precisava fazer.',
    'Vocês passam quarenta minutos abrindo pasta, e ele te ensina a procurar pelo número do convênio, que é o que não muda.',
    'O número aparece em oito dos dez anos. Nos seis primeiros, o convenente tem outro nome, comprido e esquecível, com o mesmo número de registro. Nos dois últimos, a sigla.',
    'E o valor cresce numa curva que não é curva de convênio de fauna: noventa e dois, quatro dígitos. Noventa e seis, cinco. Ano passado, sete.',
    fala('o gerente', 'Isso aqui não é reajuste.'),
    c18_eu('Não.'),
    fala('o gerente', 'Reajuste é dez por cento, quinze por cento.'),
    'Ele fecha a pasta do ano passado com cuidado, do jeito que se fecha uma coisa que assusta.',
    fala('o gerente', 'Isso multiplicou por mil em sete anos, passou por essa agência, e eu assinei o recebimento de todas.', 'baixo')
  ],
  ef:{flag:['oito_anos_de_convenio','reika_precisa_de_papel','tem_a_linha_do_convenio'],
      npc:{nome:'o gerente', opiniao:3, viuVoce:'Sentou com você no arquivo morto e abriu dez anos de pasta.'},
      registrar:'O convênio aparece em oito dos dez anos, com dois nomes e o mesmo número de registro, e multiplicou por mil em sete anos.'},
  escolhas:[
    {texto:'Pedir cópia dos oito.', vai:'c18_ab_copia_dos_oito'},
    {texto:'Ir ao cartório de pessoas jurídicas com o nome.', vai:'c18_cartorio'},
    {texto:'Ir à hemeroteca.', vai:'c18_hemeroteca'}
  ]
},

c18_ab_copia_dos_oito:{
  texto:[
    'Ele tira as cópias ele mesmo, na máquina da sala dele, com a porta fechada.',
    'Oito folhas. Ele não carimba e não assina.',
    fala('o gerente', 'Eu não posso autenticar. Se eu autenticar, fica meu nome.'),
    d=>fala(d.jogador.nome, 'Seu nome já tá nas oito originais.'),
    'Ele para com a última folha na mão.',
    fala('o gerente', 'É.'),
    'E assina. E carimba. E data.',
    fala('o gerente', 'Pronto. Agora tá duas vezes.'),
    'Ele entrega as oito e volta pra mesa dele e vira um dos porta-retratos pra frente, o que não tem nada a ver e tem tudo a ver.'
  ],
  ef:{flag:['copia_dos_oito_convenios','reika_precisa_de_papel'],
      rep:{eixo:'bom', delta:1, motivo:'Um gerente de banco autenticou, com o próprio nome, oito anos de convênio.'},
      npc:{nome:'o gerente', opiniao:5, viuVoce:'Autenticou as oito cópias com nome, carimbo e data.'},
      registrar:'Tem oito prestações de contas autenticadas pelo gerente da agência.'},
  escolhas:[
    {texto:'Ir ao cartório de pessoas jurídicas.', vai:'c18_cartorio'},
    {texto:'Ir à hemeroteca.', vai:'c18_hemeroteca'},
    {texto:'Ir à Liga e perguntar oficialmente.', vai:'c18_liga'}
  ]
},

c18_ab_o_diario_oficial:{
  texto:[
    'A biblioteca municipal de Saffron tem, no subsolo, duas salas: a hemeroteca, com jornal, e uma menor, com uma plaquinha de madeira na porta: PERIÓDICOS OFICIAIS.',
    'É uma sala com onze estantes de diário oficial encadernado por semestre, desde mil novecentos e cinquenta e dois, e uma mesa comprida com seis cadeiras.',
    'Tem uma pessoa na sala, o atendente, um senhor de uns setenta anos, e ele está cochilando sentado.',
    'Ele acorda quando você entra e fica genuinamente feliz, o que é constrangedor. No crachá de pano preso no colete está escrito PELL.',
    fala('Sr. Pell', 'Pesquisa? {O senhor|A senhora} está pesquisando?'),
    c18_eu('Tô procurando um nome.'),
    fala('Sr. Pell', 'Nome de quê? Empresa, pessoa, associação, fundação, autarquia?'),
    'Ele já está de pé e já está andando pra uma estante.',
    fala('Sr. Pell', 'Porque cada um sai numa seção diferente e num dia diferente da semana, e se {o senhor|a senhora} não souber a seção, vai ler quarenta e oito anos de diário, e eu vou ter que ver {o senhor|a senhora} fazendo isso.')
  ],
  ef:{flag:'achou_a_hemeroteca_oficial',
      npc:{nome:'Sr. Pell', opiniao:2, viuVoce:'Você foi a primeira pessoa a entrar na sala de periódicos oficiais em muito tempo.'},
      registrar:'A sala de periódicos oficiais da biblioteca de Saffron tem 48 anos de diário oficial encadernado. Quem cuida é o Sr. Pell.'},
  escolhas:[
    {texto:'"Associação. Ou fundação. Alguma coisa com conselho."', vai:'c18_ab_a_secao_certa'},
    {texto:'"Eu não sei. Me ensina a procurar."', vai:'c18_ab_ensina_a_procurar'},
    {texto:'Agradecer e ir ao cartório em vez disso.', vai:'c18_cartorio'}
  ]
},

c18_ab_a_secao_certa:{
  texto:[
    fala('Sr. Pell', 'Então é a seção três. Sai às quintas.'),
    'Ele puxa um volume de uma estante sem precisar procurar, o que é um truque de vinte anos de sala vazia.',
    fala('Sr. Pell', 'Constituição, alteração e extinção de pessoa jurídica de direito privado sem fins lucrativos.'),
    fala('Sr. Pell', 'Tudo que é conselho, comissão, instituto e fundação nasce numa dessas páginas, e muda de nome numa dessas páginas. Tem que ser. É lei.'),
    c18_eu('E se não nasceu?'),
    'Ele para com o dedo no volume.',
    fala('Sr. Pell', 'Aí não existe.'),
    fala('Sr. Pell', 'E se não existe e mesmo assim manda em alguma coisa, {meu jovem|minha jovem}, aí o problema não é de biblioteca.')
  ],
  ef:{flag:'a_secao_tres_das_quintas',
      registrar:'Toda comissão, conselho ou fundação nasce e muda de nome na seção 3 do diário oficial, publicada às quintas.'},
  escolhas:[
    {texto:'Procurar na seção três.', vai:'c18_hemero_legais'},
    {texto:'Ir ao cartório de pessoas jurídicas primeiro.', vai:'c18_cartorio'},
    {texto:'Ir à Liga e perguntar oficialmente.', vai:'c18_liga'}
  ]
},

c18_ab_ensina_a_procurar:{
  texto:[
    'Ele te ensina por mais de uma hora e não olha pro relógio uma vez.',
    'Você aprende: que diário oficial tem índice onomástico no último volume do semestre; que o índice remete à página e à coluna; que ato de constituição traz sempre o nome dos fundadores e o objeto social; e que o objeto social é onde as pessoas mentem com mais criatividade.',
    'Você aprende também uma coisa que não estava no plano dele ensinar.',
    fala('Sr. Pell', 'Se o nome não estiver no índice, tenta o índice do semestre seguinte.'),
    c18_eu('Por quê?'),
    fala('Sr. Pell', 'Porque o que sai na última semana do semestre cai no índice do semestre seguinte, por erro de fechamento.'),
    'Ele arruma os volumes na mesa, alinhados.',
    fala('Sr. Pell', 'Quem quer publicar sem ninguém ver, publica na última semana.', 'baixo')
  ],
  ef:{flag:['aprendeu_a_ler_diario','a_secao_tres_das_quintas'],
      npc:{nome:'Sr. Pell', opiniao:4, viuVoce:'Passou mais de uma hora te ensinando a ler diário oficial.'},
      registrar:'Quem publica um ato sem querer ser visto publica na última semana do semestre, e ele cai no índice do semestre seguinte.',
      presagio:'Ele alinhou os volumes antes de dizer a última frase, e falou olhando pro de dezembro.',
      executar:()=>{ Relogio.avancar(1); return []; }},
  escolhas:[
    {texto:'Procurar com o que você aprendeu.', vai:'c18_hemero_legais'},
    {texto:'Ir ao cartório de pessoas jurídicas.', vai:'c18_cartorio'}
  ]
},

c18_ab_a_reporter:{
  texto:[
    'Rhea Ashford te encontra primeiro, o que é a função dela.',
    'Ela está sentada num banco de praça em Saffron com uma pasta de papelão no colo e duas xícaras de café, e uma delas é sua antes de você sentar.',
    d=>c18_cena(d, 11, 'c11_ab_o_que_ela_tem')
      ? fala('Rhea Ashford', 'Eu tinha quarenta e uma páginas e nenhum documento. Você lembra.')
      : fala('Rhea Ashford', 'Você lembra de mim. Da última vez, eu tinha quarenta e uma páginas de depoimento e nenhum documento.'),
    d=>c18_cena(d, 11, 'c11_ab_o_que_ela_tem') ? fala(d.jogador.nome, 'Lembro.') : '',
    fala('Rhea Ashford', 'Agora eu tenho quarenta e uma páginas e um nome.'),
    'Ela abre a pasta e tira uma folha com uma única linha datilografada no meio, e o resto em branco, o que é um jeito teatral de mostrar uma coisa, e ela sabe disso.',
    '**COMISSÃO DE GESTÃO DE RISCO BIOLÓGICO DE KANTO**',
    d=>c18_sabiaComissao(d)
      ? 'Comissão. Você já ouviu essa palavra pela estrada, dita com artigo e sem complemento, do jeito que se diz o banco. O complemento é novo.'
      : 'Você lê duas vezes. Risco biológico. Escrito assim, parece nome de departamento de hospital.',
    fala('Rhea Ashford', 'Esse nome apareceu em três lugares diferentes das minhas quarenta e uma páginas, e eu levei nove meses pra ver que era o mesmo.'),
    c18_eu('E o que você quer de mim?'),
    fala('Rhea Ashford', 'Eu quero que você vá ao cartório e peça a ficha.'),
    c18_eu('Por que eu?'),
    fala('Rhea Ashford', 'Porque se eu pedir, em quarenta minutos alguém sabe que o Correio de Kanto pediu.')
  ],
  ef:{flag:['reika_te_deu_o_nome','sabe_o_nome_da_comissao'],
      npc:{nome:'Rhea Ashford', opiniao:3, viuVoce:'Te entregou o nome e pediu que você fosse ao cartório no lugar dela.'},
      registrar:'Rhea Ashford te entregou o nome, Comissão de Gestão de Risco Biológico de Kanto, e pediu que você pedisse a ficha no cartório.',
      presagio:'Ela não pode pedir. Isso diz o tamanho de quem está do outro lado.'},
  escolhas:[
    {texto:'Ir ao cartório pedir a ficha.', vai:'c18_cartorio'},
    {texto:'Perguntar onde ela achou o nome as três vezes.', vai:'c18_ab_as_tres_vezes'},
    {texto:'Recusar. Não é a sua briga.', vai:'c18_ab_recusou_a_reika'}
  ]
},

c18_ab_as_tres_vezes:{
  texto:[
    'Ela abre a pasta em cima do banco e mostra as três, com marcador amarelo em cada uma.',
    fala('Rhea Ashford', 'Um: ata de reunião da Liga, do ano passado. Manifestação da Comissão sobre o pleito.'),
    fala('Rhea Ashford', 'Dois: nota de rodapé de um relatório de auditoria da Zona Safári. Rodapé, tamanho seis.'),
    fala('Rhea Ashford', 'Três: uma procuração juntada num processo trabalhista de um ex-funcionário da Silph.'),
    'Ela alinha as três folhas.',
    fala('Rhea Ashford', 'Liga, reserva e empresa privada. Três mundos que não se falam.'),
    c18_eu('E o mesmo nome nos três.'),
    fala('Rhea Ashford', 'O mesmo nome nos três, e nos três aparece como se todo mundo já soubesse quem é.'),
    'Ela fecha a pasta.',
    fala('Rhea Ashford', 'Ninguém explica o que é. Todo mundo cita.')
  ],
  ef:{flag:['as_tres_citacoes','sabe_o_nome_da_comissao'],
      registrar:'O mesmo nome aparece em ata da Liga, rodapé de auditoria da Zona Safári e procuração num processo da Silph.'},
  escolhas:[
    {texto:'Ir ao cartório pedir a ficha.', vai:'c18_cartorio'},
    {texto:'Ir à hemeroteca procurar o ato publicado.', vai:'c18_hemeroteca'},
    {texto:'Ir à Liga e perguntar oficialmente.', vai:'c18_liga'}
  ]
},

c18_ab_recusou_a_reika:{
  texto:[
    c18_eu('Não. Eu não sou {o seu estagiário|a sua estagiária}.'),
    'Ela recebe isso melhor do que você esperava. Toma um gole do café e concorda com a cabeça.',
    fala('Rhea Ashford', 'Justo.'),
    'Ela guarda a folha de volta na pasta e fecha o elástico.',
    fala('Rhea Ashford', 'Eu vou pedir eu mesma, então. Provavelmente não vai dar em nada e eu vou queimar o nome.'),
    'Ela levanta.',
    fala('Rhea Ashford', 'Da primeira vez, eu te esperei com um gravador. Hoje eu te esperei com café.'),
    c18_eu('Eu reparei.'),
    fala('Rhea Ashford', 'Da próxima, eu não espero.'),
    'Ela vai embora e deixa a segunda xícara no banco, e você fica sentad{o|a} do lado dela.'
  ],
  ef:{flag:'recusou_a_reika',
      npc:{nome:'Rhea Ashford', opiniao:0, viuVoce:'Você recusou ir ao cartório por ela.'},
      registrar:'Recusou ajudar Rhea Ashford. Ela foi pedir a ficha sozinha.',
      presagio:'A segunda xícara ficou no banco, cheia.'},
  escolhas:[
    {texto:'Ir ao cartório mesmo assim, por conta própria.', vai:'c18_cartorio'},
    {texto:'Ir à hemeroteca.', vai:'c18_hemeroteca'},
    {texto:'Ir à Liga e perguntar oficialmente.', vai:'c18_liga'}
  ]
},

c18_ab_de_cracha:{
  texto:[
    d=>{
      const c = Cargos.doCracha();
      return `Ser ${c ? c.nome : 'do serviço'} dá acesso a uma coisa que você descobriu tarde: o terminal de consulta do serviço público.`;
    },
    'É um terminal de tela verde numa sala sem janela, com um teclado de membrana e uma etiqueta colada no monitor com a senha escrita à caneta, o que é proibido e é universal.',
    'O sistema consulta três bases: pessoa jurídica, convênio público e processo administrativo.',
    'Você senta. A sala é sua por quanto tempo você quiser, e é a primeira vez em meses que você tem tempo e não tem pressa.',
    'O cursor pisca no campo de busca.',
    d=>c18_sabiaComissao(d)
      ? 'E é aí que você percebe o problema: pra buscar um nome, você precisa do nome inteiro, e a Comissão, com artigo e sem complemento, não é nome que um sistema aceite.'
      : 'E é aí que você percebe o problema que ninguém te avisou: pra buscar um nome, você precisa do nome.'
  ],
  ef:{flag:'tem_acesso_ao_terminal',
      registrar:'Tem acesso ao terminal de consulta do serviço: pessoa jurídica, convênio público e processo administrativo.'},
  escolhas:[
    {texto:'Buscar pela palavra que todo mundo usa: comissão.', vai:'c18_ab_buscou_a_sigla'},
    {texto:'Buscar pelos nomes de quem você já conheceu.', vai:'c18_ab_buscou_pessoas'},
    {texto:'Desligar e ir ao cartório, onde tem gente.', vai:'c18_cartorio'}
  ]
},

c18_ab_buscou_a_sigla:{
  texto:[
    'Você digita a única palavra que tem, COMISSÃO, na base de pessoa jurídica, e aperta a tecla.',
    'O terminal pensa por onze segundos, que é muito tempo pra um terminal.',
    '**37 REGISTROS ENCONTRADOS.**',
    'Comissão de formatura, comissão de moradores, comissão de festas de bairro. E, na vigésima linha:',
    '**COMISSÃO DE GESTÃO DE RISCO BIOLÓGICO DE KANTO — CGRB — REG. 11.402 — DENOMINAÇÃO ATUAL DESDE A REFORMA ESTATUTÁRIA DE UM ANO E OITO MESES ATRÁS**',
    'Você leva o número de registro pra base de convênio.',
    '**4 REGISTROS.**',
    'Quatro convênios públicos com o número 11.402. O mais antigo tem oito anos, assinado com o nome velho; o número é o mesmo.',
    'Kanto paga essa gente há oito anos, e há quase dois chama ela por outro nome.'
  ],
  ef:{flag:['quatro_convenios_sem_registro','sabe_o_nome_da_comissao'],
      registrar:'Registro 11.402: a CGRB tem esse nome há um ano e oito meses, e quatro convênios públicos com o mesmo número, o mais antigo de oito anos atrás.',
      presagio:'O nome mudou. O número, não.'},
  escolhas:[
    {texto:'Imprimir as telas.', vai:'c18_ab_imprimiu'},
    {texto:'Ir ao cartório conferir na fonte de papel.', vai:'c18_cartorio'},
    {texto:'Ir à hemeroteca procurar o ato publicado.', vai:'c18_hemeroteca'}
  ]
},

c18_ab_buscou_pessoas:{
  texto:[
    'Você digita os nomes que juntou pelo caminho, um por um, na base de processo administrativo.',
    'A maioria não dá nada. Duas dão.',
    'E a segunda te faz parar.',
    'Um processo administrativo aberto há quatro anos, arquivado há três, com uma única movimentação registrada.',
    'Objeto: "apuração de denúncia — transporte irregular de espécimes".',
    'Motivo do arquivamento: "ausência de interesse público superveniente".',
    d=>d.flags.ordens_assinadas_por_conselho
      ? 'E o campo do solicitante do arquivamento traz uma palavra sozinha, sem sigla e sem número, do jeito que você já viu numa ordem de serviço:'
      : 'E o campo do solicitante do arquivamento traz uma palavra sozinha, sem sigla e sem número:',
    '**CONSELHO**'
  ],
  ef:{flag:['o_processo_arquivado','sabe_o_nome_da_comissao'],
      registrar:'Um processo de apuração de transporte irregular foi arquivado por "ausência de interesse público superveniente", a pedido do "conselho".',
      presagio:d=>d.flags.ordens_assinadas_por_conselho
        ? 'A mesma palavra sozinha, no mesmo campo, em dois papéis de lugares diferentes.'
        : 'Uma palavra sozinha, no campo onde devia ter um nome.'},
  escolhas:[
    {texto:'Imprimir as telas.', vai:'c18_ab_imprimiu'},
    {texto:'Buscar pela palavra comissão também.', vai:'c18_ab_buscou_a_sigla'},
    {texto:'Ir ao cartório.', vai:'c18_cartorio'}
  ]
},

c18_ab_imprimiu:{
  texto:[
    'A impressora é matricial e faz um barulho que ocupa a sala inteira e o corredor.',
    'Leva quatro minutos pra imprimir o que a tela mostra em um segundo, e nos quatro minutos você fica olhando a porta.',
    'Ninguém vem.',
    'O papel sai contínuo, com furo nas duas bordas, e você destaca as bordas devagar pra não rasgar.',
    'No rodapé de cada folha, o sistema imprime automaticamente: data, hora, terminal e matrícula de quem consultou.',
    'A sua matrícula.',
    'Você lê isso e entende que a partir de agora existe, num log em algum lugar, uma linha dizendo exatamente quem procurou esse nome e quando.'
  ],
  ef:{flag:['imprimiu_do_terminal','reika_precisa_de_papel'],
      registrar:'Imprimiu as consultas. O rodapé traz a sua matrícula, a data e a hora.',
      presagio:'Você deixou o seu nome escrito no rastro. Isso não dá pra desfazer.'},
  escolhas:[
    {texto:'Ir ao cartório conferir no papel.', vai:'c18_cartorio'},
    {texto:'Ir à hemeroteca.', vai:'c18_hemeroteca'},
    {texto:'Ir à Liga e perguntar oficialmente.', vai:'c18_liga'}
  ]
},


c18_ab_o_perito:{
  texto:[
    'A pasta de perito tem trinta e uma páginas, e você leu as trinta e uma. A primeira é o termo de sigilo.',
    'Perito fala antes da votação e sai da sala quando ela abre. Você já falou antes de mais de uma, e nunca viu um resultado sair da sala com você.',
    'Na semana passada você perguntou à secretária onde ficam as atas, e ela respondeu sem levantar os olhos da máquina:',
    fala('a secretária', 'No cartório, como as de qualquer associação. Ata é pública.'),
    'Pública quer dizer que qualquer pessoa pode ler, e você também é qualquer pessoa.',
    'É estranho ir ao cartório ler o que a sala onde você trabalha decidiu. Mais estranho é você nunca ter ido.'
  ],
  ef:{registrar:'Perito da Comissão, decidiu ler as atas no cartório, como qualquer pessoa.'},
  escolhas:[
    {texto:'Ir ao cartório de pessoas jurídicas.', vai:'c18_cartorio'},
    {texto:'Subir à sala 704 e pedir as atas lá mesmo.', vai:'c18_direto_na_704'},
    {texto:'Ir à hemeroteca ver o que saiu em jornal.', vai:'c18_hemeroteca'}
  ]
},

c18_fio:{
  texto:[
    'Você passou meses puxando fios diferentes, e todos eles davam nó no mesmo lugar.',
    d=>{
      const f = d.flags, t = [];
      if (f.livro_de_destinos) t.push('Sete cargas do depósito de Celadon com destino SPH-11.');
      if (f.sabe_do_andar_11) t.push('Um andar onze num prédio de dez.');
      if (f.provas_zona) t.push('Uma pilha de papel sobre a Zona Safári que não fecha a conta.');
      if (f.achou_equipe_na_ilha) t.push('Uma expedição com caixa da Silph numa ilha que não está em mapa nenhum.');
      if (f.tem_gente_atras_do_mew) t.push('Gente de bota atrás de uma coisa que brinca, paga por alguém que não aparece em folha nenhuma.');
      if (f.ordens_assinadas_por_conselho) t.push('Ordens de serviço assinadas por uma palavra só.');
      return t.length ? t.slice(0, 4).join(' ') : 'Você tem pedaços: um papel aqui, um prazo ali, uma palavra que ninguém explica. É pouco, mas os pedaços apontam todos pro mesmo lugar.';
    },
    d=>c18_sabiaComissao(d)
      ? 'E por cima de tudo, a palavra que todo mundo usa sem explicar: a Comissão. Sempre no singular, sempre com artigo, sempre dita como se fosse óbvio de quem se trata, do jeito que se fala do banco, do cartório, da prefeitura.'
      : 'Um conselho. Uma comissão. Sempre no singular, sempre sem nome, sempre dito como se fosse óbvio de quem se trata, do jeito que se fala do banco, do cartório, da prefeitura.',
    d=>c18_bolsista(d)
      ? 'Você recebe uma bolsa deles todo mês desde uma mesa de salão no S.S. Anne e nunca leu uma linha do que eles escrevem.'
      : '',
    'E é aí que você percebe uma coisa que vinha te incomodando havia semanas sem conseguir dizer o quê.',
    'Ninguém fala assim de uma quadrilha. Ninguém diz o pessoal, a turma, aqueles caras. Todo mundo que te contou alguma coisa falou como quem fala de uma instituição.',
    'Instituição tem endereço. Tem registro. Tem papel.',
    d=>c18_sabiaComissao(d)
      ? 'Você decide fazer a coisa mais óbvia que ninguém fez até agora: ler o que eles mesmos escreveram, no lugar onde isso fica guardado.'
      : 'Você decide fazer a coisa mais óbvia que ninguém fez até agora: procurar o nome.'
  ],
  ef:{registrar:'Decidiu procurar o papel da organização em vez de procurar o esconderijo dela.'},
  escolhas:[
    {texto:'Ir ao cartório de registro de pessoas jurídicas de Saffron.', vai:'c18_cartorio'},
    {texto:'Ir direto à sala 704. O endereço você já tem.', vai:'c18_direto_na_704', cond:d=>!!d.flags.sabe_da_sala704},
    {texto:'Procurar a Dra. Cordell. Pesquisadora sabe onde se procura papel.', vai:'c18_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Procurar a Terceira. Quem vende sabe para quem vendeu.', vai:'c18_terceira', cond:d=>!!d.flags.conheceu_terceira},
    {texto:'Ir à hemeroteca. Jornal velho e paciência.', vai:'c18_hemeroteca'},
    {texto:'Ir à Liga e perguntar oficialmente.', vai:'c18_liga'}
  ]
},

/* ── Cartório ───────────────────────────────────────────── */
c18_cartorio:{
  texto:[
    'O cartório de registro de pessoas jurídicas de Saffron fica no quarto andar de um prédio que também abriga um consultório de dentista e uma escola de datilografia.',
    'Fecha às cinco. Você chega às quatro e pouco, o que em cartório é quase em cima da hora.',
    'A sala é pequena, com seis cadeiras de plástico e um ventilador de teto que faz um barulho rítmico que dá sono.',
    'Tem três pessoas na sua frente. Uma delas está abrindo uma padaria e trouxe a família inteira.'
  ],
  ef:{registrar:'Chegou ao cartório de pessoas jurídicas de Saffron perto da hora de fechar.',
      executar:d=>{ const h = c18_hora(d); if (h >= 17) Relogio.amanhaAs(16); else if (h < 16) c18_ate(16, true); return []; }},
  escolhas:[
    {texto:'Esperar a fila.', vai:'c18_cartorio_fila'},
    {texto:'Ir direto ao balcão e dizer que é urgente.', vai:'c18_cartorio_furou'},
    {texto:'Ler o mural enquanto espera.', vai:'c18_cartorio_mural'},
    {texto:'Puxar assunto com a família da padaria.', vai:'c18_cartorio_padaria'}
  ]
},

c18_cartorio_mural:{
  texto:[
    'O mural tem avisos de tabela de emolumentos, um cartaz sobre a obrigatoriedade de publicação de atas de associações civis, e um papel escrito à mão avisando que a copiadora quebra se você insistir.',
    'O cartaz sobre associações civis é o que te interessa, e você o lê duas vezes.',
    'Associação civil sem fins lucrativos é obrigada a registrar estatuto, registrar alterações do estatuto, registrar a composição da diretoria e depositar ata de assembleia.',
    'Tudo público. Tudo copiável. Tudo por preço tabelado.',
    'Você fica com uma sensação esquisita, meio entre alívio e vergonha: você passou meses tentando arrombar uma porta que estava aberta e tinha horário de atendimento.'
  ],
  ef:{flag:'entendeu_o_registro', registrar:'Associação civil é obrigada a publicar estatuto e atas. Tudo público.'},
  escolhas:[
    {texto:'Esperar a fila com isso na cabeça.', vai:'c18_cartorio_fila'},
    {texto:'Anotar a tabela de emolumentos.', vai:'c18_cartorio_tabela'},
    {texto:'Conversar com a família da padaria.', vai:'c18_cartorio_padaria'}
  ]
},

c18_cartorio_tabela:{
  texto:[
    'Você anota a tabela num canto do caderno, porque tabela é a coisa mais honesta que existe: ela diz exatamente quanto custa cada coisa e não faz cara de que está te fazendo um favor.',
    'Busca por denominação: dez.',
    'Certidão de inteiro teor: quarenta.',
    'Cópia reprográfica simples, por página: um.',
    'Você faz a conta de cabeça pra cem páginas, pra duzentas, e para de fazer conta.'
  ],
  ef:{registrar:'Anotou a tabela de emolumentos do cartório.'},
  escolhas:[{texto:'Voltar para a fila.', vai:'c18_cartorio_fila'}]
},

c18_cartorio_padaria:{
  texto:[
    'O homem que está abrindo a padaria se chama Sr. Dunmore, diz ele a quem quiser ouvir, e está no quinto dia de burocracia.',
    fala('Sr. Dunmore', 'Quinto.'),
    'Ele levanta cinco dedos.',
    fala('Sr. Dunmore', 'Eu já vim aqui cinco vezes por causa de uma palavra no objeto social. Uma palavra.'),
    c18_eu('Qual?'),
    fala('Sr. Dunmore', 'Fabricação. Eu pus fabricação e comercialização. Aí é indústria e comércio, e aí muda tudo.'),
    'Ele ri sem alegria nenhuma.',
    fala('Sr. Dunmore', 'Eu vou pôr só comércio e vou fabricar do mesmo jeito, porque ninguém vem conferir.'),
    'A mulher dele olha pra ele com a cara de quem já disse isso na terça.',
    'Você guarda a frase sem saber direito por quê. Ninguém vem conferir.'
  ],
  ef:{flag:'ninguem_vem_conferir',
      registrar:'O Sr. Dunmore, da padaria: o que está escrito no papel e o que se faz são coisas diferentes, porque ninguém vem conferir.'},
  escolhas:[
    {texto:'Perguntar se ele já ouviu falar em associação sem fins lucrativos.', vai:'c18_belchior_associacao'},
    {texto:'Desejar sorte e voltar para a fila.', vai:'c18_cartorio_fila'}
  ]
},

c18_belchior_associacao:{
  texto:[
    c18_eu('O senhor já ouviu falar de associação sem fins lucrativos?'),
    'Ele faz que sim com a cabeça, devagar.',
    fala('Sr. Dunmore', 'Associação é o melhor negócio do mundo, {moço. Digo, senhor. Digo — o senhor entendeu|moça. Digo, senhora. Digo — a senhora entendeu}.'),
    c18_eu('Por quê?'),
    fala('Sr. Dunmore', 'Porque não paga o que empresa paga, e porque ninguém desconfia de associação.'),
    'Ele encolhe os ombros.',
    fala('Sr. Dunmore', 'Meu cunhado tem uma. É de batalha de bairro e é de verdade, mas se não fosse, também dava.'),
    'Ele volta a olhar o formulário dele.',
    fala('Sr. Dunmore', 'O que dá trabalho é o objeto social. Tem que escrever bonito. Depois disso é só assembleia e ata.')
  ],
  ef:{registrar:'Associação não paga o que empresa paga e ninguém desconfia dela.'},
  escolhas:[{texto:'Voltar para a fila.', vai:'c18_cartorio_fila'}]
},

c18_cartorio_furou:{
  texto:[
    'Você vai direto ao balcão e diz que é urgente.',
    'A escrevente levanta os olhos por dois segundos, olha a fila, olha você de novo.',
    fala('a escrevente', 'Urgente aqui é um regime especial, custa quatro vezes mais e tem que ser pedido por advogado.'),
    'Ela volta a digitar.',
    fala('a escrevente', '{O senhor|A senhora} quer isso?'),
    c18_eu('Não.'),
    fala('a escrevente', 'Então são três pessoas na sua frente.'),
    'Você volta pra cadeira de plástico. A família da padaria tira as sacolas da cadeira do lado pra você sentar, o que é uma gentileza que você não merecia.'
  ],
  ef:{rep:{eixo:'ruim',delta:1,motivo:'Tentou furar fila em cartório'}},
  escolhas:[
    {texto:'Esperar direito.', vai:'c18_cartorio_fila'},
    {texto:'Ler o mural para não pensar na vergonha.', vai:'c18_cartorio_mural'}
  ]
},

c18_cartorio_fila:{
  texto:[
    'A padaria termina e sai com quatro pessoas e uma pasta. Os outros dois da fila só vieram buscar certidão pronta e saem em cinco minutos.',
    d=>{ Nomes.apresentar('a escrevente'); return 'A escrevente se chama Sra. Cybil, e isso está numa plaquinha de acrílico que ela mesma deve ter mandado fazer, porque é mais bonita que o resto do balcão.'; },
    fala('a escrevente', 'Pois não.'),
    d=>c18_perito()
      ? 'Você dá o nome inteiro, o do seu crachá, e pede o que estiver depositado.'
      : d.flags.sabe_o_nome_da_comissao
        ? 'Você dá o nome inteiro, que agora você sabe de cor, e a sigla.'
        : c18_sabiaComissao(d)
          ? 'Você explica o que quer com a única palavra que tem: a Comissão. Uma comissão que cuida de risco, de fauna, de controle, e que todo mundo chama assim, sem mais nada.'
          : 'Você explica o que quer sem saber direito o que quer: uma comissão, um conselho, alguma coisa registrada em Kanto, relacionada a risco, a fauna, a controle.',
    'Ela não faz cara de nada. Ela digita.'
  ],
  ef:{npc:{nome:'Sra. Cybil', opiniao:0, memoria:'Escrevente do cartório de pessoas jurídicas de Saffron.'}},
  escolhas:[
    {texto:'Esperar em silêncio.', vai:'c18_quintela_achou'},
    {texto:'"A senhora já ouviu falar dessa organização?"', vai:'c18_quintela_ja_ouviu'},
    {texto:'"Quanta coisa dá para achar aqui, na verdade?"', vai:'c18_quintela_o_que_da'}
  ]
},

c18_quintela_ja_ouviu:{
  texto:[
    fala('Sra. Cybil', 'Eu ouço falar de tudo e não presto atenção em nada.'),
    'Ela continua digitando.',
    fala('Sra. Cybil', 'Se eu prestasse atenção eu não dormia.'),
    'Um silêncio.',
    fala('Sra. Cybil', 'Mas se {o senhor|a senhora} quer saber: passa gente aqui todo mês pedindo certidão de coisa que depois sai no jornal. Ninguém repara em cartório.'),
    d=>fala(d.jogador.nome, 'E a senhora repara?'),
    fala('Sra. Cybil', 'Eu reparo em quem paga em dinheiro.'),
    'Ela aperta uma tecla.',
    fala('Sra. Cybil', 'Achei.')
  ],
  escolhas:[{texto:'Ver a tela.', vai:'c18_quintela_achou'}]
},

c18_quintela_o_que_da:{
  texto:[
    fala('Sra. Cybil', 'Tudo o que a lei manda publicar, e é mais coisa do que {o senhor|a senhora} imagina.'),
    'Ela conta nos dedos sem parar de olhar a tela.',
    fala('Sra. Cybil', 'Estatuto. Alteração de estatuto. Ata de assembleia de fundação. Ata de eleição de diretoria. Endereço da sede. Nome, qualificação e endereço de quem assina.'),
    d=>fala(d.jogador.nome, 'Endereço de quem assina?'),
    fala('Sra. Cybil', 'Endereço de quem assina.'),
    'Ela dá de ombros.',
    fala('Sra. Cybil', 'Não é segredo. É o contrário de segredo. É o que faz a coisa existir.'),
    'Ela aperta uma tecla.',
    fala('Sra. Cybil', 'Achei.')
  ],
  ef:{flag:'sabe_que_tem_endereco', registrar:'O registro público traz o endereço de quem assina pela associação.'},
  escolhas:[{texto:'Ver a tela.', vai:'c18_quintela_achou'}]
},

c18_quintela_achou:{
  texto:[
    'Ela vira o monitor quarenta e cinco graus pra você. A tela é verde sobre preto e a fonte é horrível.',
    '**COMISSÃO DE GESTÃO DE RISCO BIOLÓGICO DE KANTO — CGRB**',
    '**Associação civil sem fins lucrativos. Registro nº 11.402. Constituída há nove anos. Denominação e estatuto atuais desde a reforma de um ano e oito meses atrás.**',
    '**Sede: Saffron, Rua do Comércio, 118, sala 704.**',
    '**Estatuto arquivado. Atas depositadas desde a reforma: 34.**',
    d=>{
      const t = [];
      if (c18_sabeDosOnze(d)) t.push('Nove anos e o mesmo número: é a associação que a moça do cartório de Celadon te mostrou, a do conselho de onze. Só o nome é novo.');
      if (d.flags.sabe_da_sala704 && !c18_perito()) t.push('Sala 704. Esse número você já tinha. Agora ele tem rua.');
      return t.join(' ');
    },
    fala('Sra. Cybil', 'Trinta e quatro atas em um ano e oito meses.'),
    'Ela fala isso quase com admiração.',
    fala('Sra. Cybil', 'Essa gente se reúne toda quinzena. Isso é raro, {moço|moça}. Associação normal esquece de fazer assembleia.')
  ],
  ef:{flag:['sabe_da_comissao','sabe_do_endereco_704','sabe_o_nome_da_comissao'],
      rep:{eixo:'bom',delta:1,motivo:'Encontrou a Comissão num cartório, com um número de registro'},
      registrar:'CGRB — Comissão de Gestão de Risco Biológico de Kanto. Registro 11.402, constituída há nove anos, com esse nome desde a reforma de um ano e oito meses atrás. Sala 704, Rua do Comércio, 118, Saffron. 34 atas depositadas.'},
  escolhas:[
    {texto:'"Quero cópia de tudo."', vai:'c18_quintela_copia'},
    {texto:'"Quero só o estatuto."', vai:'c18_so_estatuto'},
    {texto:'"Quem assina?"', vai:'c18_quem_assina'},
    {texto:'"A senhora pode me dar isso sem registrar que fui eu que pedi?"', vai:'c18_pedido_discreto'}
  ]
},

c18_quem_assina:{
  texto:[
    'Ela rola a tela.',
    fala('Sra. Cybil', 'Presidente do conselho: Hester Colman. Endereço na própria sede.'),
    d=>c18_sabeColman(d) ? 'Colman. A mesma Colman da presidência, de assinatura em papel que você já teve na mão.' : '',
    fala('Sra. Cybil', 'Conselho fiscal: três nomes. Um deles é escritório de contabilidade.'),
    fala('Sra. Cybil', 'E o conselho que assinou a reforma: onze assinaturas.'),
    'Onze.',
    d=>d.flags.o_conselho_de_onze
      ? 'O homem de sapato limpo disse esse número numa mesa do S.S. Anne, na hora, sem precisar pensar.'
      : c18_sabeDosOnze(d)
        ? 'Os mesmos onze que você copiou em Celadon.'
        : d.flags.sabe_do_andar_11
          ? 'Você já viu esse número em outro lugar, num andar que não devia existir, e não gostou dele lá.'
          : 'Um número redondo de gente pra decidir uma coisa sozinha.'
  ],
  ef:{flag:['sabe_o_nome_da_presidente','onze_fundadores'],
      registrar:'Presidente do conselho: Hester Colman. Onze conselheiros assinaram a reforma do estatuto.'},
  escolhas:[
    {texto:'"Os onze nomes, por favor."', vai:'c18_os_onze_nomes'},
    {texto:'"Quero cópia de tudo."', vai:'c18_quintela_copia'},
    {texto:'"Quanto custa a certidão de inteiro teor?"', vai:'c18_so_estatuto'}
  ]
},

c18_os_onze_nomes:{
  texto:[
    'Ela imprime a lista numa matricial que chia.',
    d=>c18_sabeDosOnze(d)
      ? 'São os mesmos onze que você copiou em Celadon, na mesma ordem alfabética. O que esta lista tem e a de lá não tinha é uma coluna a mais.'
      : 'Você lê os onze nomes e não conhece nenhum, o que é decepcionante por meio segundo e assustador logo depois.',
    'Ao lado de cada nome tem a qualificação profissional, e as qualificações você conhece muito bem.',
    'Uma ex-diretora de fiscalização, na presidência. Dois advogados. Um representante de federação de batalha. E sete técnicos: bióloga, médico de Pokémon, engenheiro agrônomo, auditor, professor titular aposentado, um técnico-chefe de viveiro e um curador de acervo vivo.',
    'Nenhum criminoso. Nenhum químico maluco. Nenhum uniforme.',
    'Um corpo técnico.'
  ],
  ef:{flag:'viu_os_onze_fundadores', instabilidade:1,
      registrar:'O conselho da CGRB: uma ex-diretora de fiscalização, dois advogados, um representante de federação de batalha e sete técnicos.'},
  escolhas:[
    {texto:'"Quero cópia de tudo."', vai:'c18_quintela_copia'},
    {texto:'Perguntar se algum deles já esteve na Liga.', vai:'c18_algum_da_liga'}
  ]
},

c18_algum_da_liga:{
  texto:[
    fala('Sra. Cybil', 'Eu não sei o que é a Liga para efeito de registro.'),
    'A Sra. Cybil é literal do jeito que só quem trabalha com papel é.',
    fala('Sra. Cybil', 'Aqui diz ex-diretora de fiscalização. Não diz de onde.'),
    d=>fala(d.jogador.nome, 'E a senhora acha que é de onde?'),
    fala('Sra. Cybil', 'Eu acho que quando é da Liga eles escrevem da Liga, porque dá orgulho.'),
    'Ela ajeita os óculos.',
    fala('Sra. Cybil', 'Quando não escrevem, é porque saíram brigados.'),
    'Você anota isso também.'
  ],
  ef:{flag:'presidente_saiu_brigada',
      registrar:'A presidente é ex-diretora de fiscalização e não quis escrever de onde.'},
  escolhas:[{texto:'"Quero cópia de tudo."', vai:'c18_quintela_copia'}]
},

c18_pedido_discreto:{
  texto:[
    'Ela para de digitar pela primeira vez e olha você de verdade.',
    fala('Sra. Cybil', 'Não.'),
    'Não é ríspido. É só definitivo.',
    fala('Sra. Cybil', '{O senhor|A senhora} pode pedir sem se identificar, porque é público e eu não sou obrigada a perguntar quem {o senhor|a senhora} é. Mas o pedido fica no livro com data e hora, sempre, e é isso que faz o livro valer alguma coisa.'),
    'Ela espera.',
    fala('Sra. Cybil', 'Se {o senhor|a senhora} quer uma coisa que não deixa rastro, {o senhor|a senhora} veio no lugar errado. Aqui é só rastro.')
  ],
  ef:{flag:'pedido_fica_no_livro',
      npc:{nome:'Sra. Cybil', opiniao:1, memoria:'Te explicou que cartório é feito de rastro e que isso é o valor dele.'},
      registrar:'O pedido de certidão fica registrado com data e hora. A Comissão pode descobrir que foi você.'},
  escolhas:[
    {texto:'"Tudo bem. Registra."', vai:'c18_quintela_copia'},
    {texto:'"Então só o estatuto."', vai:'c18_so_estatuto'},
    {texto:'Desistir e sair.', vai:'c18_saiu_sem_nada'}
  ]
},

c18_so_estatuto:{
  texto:[
    'Ela imprime o estatuto: dezoito páginas.',
    'Você paga, dobra em três e enfia no bolso de dentro.',
    'Na calçada, encostad{o|a} no poste, você lê o Art. 1º e o Art. 4º e fecha os olhos por um instante.',
    'Dezoito páginas te dizem o que eles são. Cento e vinte e duas páginas de ata te diriam o que eles fizeram.',
    'O relógio da esquina já passou das cinco. A porta do cartório fechou atrás de você.'
  ],
  ef:{flag:['tem_o_estatuto','sabe_da_comissao'], dinheiro:-58,
      registrar:'Comprou só o estatuto: 18 páginas. As atas ficaram lá.',
      executar:d=>{ c18_ate(17, true); return []; }},
  escolhas:[
    {texto:'Voltar amanhã e comprar as atas.', vai:'c18_voltou_amanha'},
    {texto:'Ler o estatuto agora, no poste mesmo.', vai:'c18_estatuto'},
    {texto:'Ir atrás da sala 704 hoje mesmo.', vai:'c18_direto_na_704'}
  ]
},

c18_voltou_amanha:{
  texto:[
    'Você volta no dia seguinte antes de o cartório abrir, e é a primeira pessoa da fila, o que não te dá vantagem nenhuma, porque o sistema só entra no ar meia hora depois.',
    'A Sra. Cybil reconhece você e não comenta.',
    'Cento e vinte e duas páginas de ata e de anexo saem da matricial em vinte e dois minutos de chiado.',
    'Ela grampeia em quatro blocos, porque um grampo só não pega.'
  ],
  ef:{flag:'tem_as_atas', dinheiro:-122,
      registrar:'Comprou as 122 páginas de atas no dia seguinte.',
      executar:()=>{ Relogio.amanhaAs(9); return []; }},
  escolhas:[{texto:'Sair com o pacote debaixo do braço.', vai:'c18_leitura'}]
},

c18_quintela_copia:{
  texto:[
    d=>d.flags.c18_copia_no_outro_dia
      ? 'O cartório está fechado, e você volta no dia seguinte, quando ele abre. A Sra. Cybil reconhece você e não comenta.'
      : '',
    d=>Historia.jaAconteceu('c18_so_estatuto')
      ? 'Ela digita, confere, e anuncia o total como quem anuncia o preço do pão: trinta e quatro atas e os anexos, cento e vinte e duas páginas, um pokedólar a página.'
      : 'Ela digita, confere, e anuncia o total como quem anuncia o preço do pão: estatuto, trinta e quatro atas e os anexos, cento e quarenta páginas, um pokedólar a página, mais a certidão.',
    'A matricial chia por vinte e dois minutos. Ninguém na sala parece achar aquilo demorado.',
    'Ela grampeia em quatro blocos, porque um grampo só não pega, e empurra o calhamaço pelo balcão.',
    fala('Sra. Cybil', 'Boa leitura.'),
    'Sem ironia nenhuma.',
    'Você sai dali com cento e quarenta páginas de atas de reunião de uma organização que quase ninguém em Kanto leu, e com um recibo.'
  ],
  ef:{flag:['tem_as_atas','tem_o_estatuto'], dinheiro:d => Historia.jaAconteceu('c18_so_estatuto') ? -122 : -180,
      rep:{eixo:'bom',delta:1,motivo:'Comprou a verdade no balcão, por preço tabelado'},
      registrar:'Comprou o estatuto e as 34 atas da CGRB, com os anexos: 140 páginas, com recibo.',
      executar:d=>{
        /* fora do horário, o balcão é o de amanhã; dentro, a matricial passa das cinco */
        d.flags.c18_copia_no_outro_dia = !c18_cartorioAberto(d);
        if (d.flags.c18_copia_no_outro_dia) Relogio.amanhaAs(9); else c18_ate(17, true);
        return [];
      }},
  escolhas:[
    {texto:'Ler hoje mesmo, à noite.', vai:'c18_leitura'},
    {texto:'Antes de ler, passar na sala 704 só para ver o prédio.', vai:'c18_direto_na_704'}
  ]
},

c18_saiu_sem_nada:{
  texto:[
    'Você agradece e sai sem pedir nada, o que a Sra. Cybil recebe com um aceno de cabeça e nenhuma curiosidade.',
    'Na rua, você fica parad{o|a} tempo demais no mesmo lugar.',
    'Você sabe o nome. Sabe o número do registro. Sabe o endereço.',
    'E não tem uma linha escrita para provar que sabe.'
  ],
  ef:{registrar:'Saiu do cartório sem pedir cópia de nada.'},
  escolhas:[
    {texto:'Voltar e pedir tudo.', vai:'c18_quintela_copia'},
    {texto:'Ir direto à sala 704.', vai:'c18_direto_na_704'},
    {texto:'Procurar a Dra. Cordell.', vai:'c18_ivone', cond:d=>!!d.flags.cartao_ivone}
  ]
},

c18_direto_na_704:{
  texto:[
    'Rua do Comércio, 118. Prédio comercial de dezesseis andares, com uma farmácia no térreo e um elevador que demora.',
    'No sétimo andar, a sala 704 tem uma placa de acrílico com a sigla CGRB em letra comum.',
    d=>c18_perito() ? 'Você conhece o corredor: é a sala onde você fala antes da votação, e hoje ninguém te chamou.' : '',
    'A porta está aberta. Do lado de fora, numa mesinha, tem uma garrafa térmica de café, copos descartáveis e um saquinho de açúcar.',
    'Dá pra ouvir gente conversando lá dentro, no tom de quem discute um item de pauta.',
    'Você fica parad{o|a} no corredor por um tempo que passa dos limites do razoável.'
  ],
  ef:{flag:'viu_a_704', instabilidade:1,
      registrar:'Viu a sala 704 por fora. A porta estava aberta e tinha café na entrada.'},
  escolhas:[
    {texto:'Entrar.', vai:'c18_entrou_cedo_demais'},
    {texto:'Descer e ler as atas primeiro.', vai:'c18_leitura', cond:d=>!!d.flags.tem_as_atas},
    ...c18_aoCartorio('Descer e ir ao cartório.', 'Descer e voltar ao cartório.'),
    {texto:'Anotar quem entra e quem sai, do café da esquina.', vai:'c18_vigia_o_predio'}
  ]
},

c18_vigia_o_predio:{
  texto:[
    'Você senta no café da esquina com vista pra porta do prédio e fica.',
    'Em duas horas, entram e saem dezenove pessoas.',
    'Nenhuma delas parece qualquer coisa. Duas carregam pastas de papelão. Uma é uma mulher de uns sessenta anos com uma sacola de feira.',
    'No fim da segunda hora, sai um homem de camisa polo carregando uma caixa de papelão com furos laterais.',
    'Furo lateral é como se transporta Pokémon vivo.'
  ],
  ef:{flag:'viu_a_caixa_com_furos', instabilidade:1,
      registrar:'Um homem saiu do prédio da sala 704 com uma caixa de papelão com furos laterais.',
      executar:()=>{ Relogio.avancar(2); return []; }},
  escolhas:[
    {texto:'Seguir o homem da caixa.', vai:'c18_seguiu_a_caixa'},
    {texto:'Ficar. Contar mais.', vai:'c18_contou_mais'},
    {texto:'Ir embora ler as atas.', vai:'c18_leitura', cond:d=>!!d.flags.tem_as_atas},
    ...c18_aoCartorio('Ir ao cartório atrás das atas.', 'Ir ao cartório buscar as atas.')
  ]
},

c18_seguiu_a_caixa:{
  texto:[
    'Ele anda quatro quadras sem pressa nenhuma, entra numa transportadora de encomendas que fica aberta até as oito e sai sem a caixa.',
    'Você entra depois dele e olha a etiqueta no balcão antes que alguém leve.',
    '**DESTINATÁRIO: ESTAÇÃO 4 — ROTA 21. REMETENTE: CGRB.**',
    '**CONTEÚDO DECLARADO: MATERIAL BIOLÓGICO VIVO — TRANSPORTE AUTORIZADO, LICENÇA 2.117.**',
    'Licença. Eles têm licença pra mandar Pokémon vivo pelo balcão de encomendas.'
  ],
  ef:{flag:['sabe_da_rota21','sabe_da_estacao4'], instabilidade:1,
      registrar:'Estação 4, Rota 21. Material biológico vivo com licença 2.117.'},
  escolhas:[
    {texto:'Perguntar ao atendente com que frequência sai carga pra lá.', vai:'c18_atendente_encomenda'},
    {texto:'Sair sem tocar em nada.', vai:'c18_leitura', cond:d=>!!d.flags.tem_as_atas},
    ...c18_aoCartorio('Ir ao cartório atrás das atas.', 'Ir ao cartório buscar as atas.')
  ]
},

c18_atendente_encomenda:{
  texto:[
    c18_eu('Rota 21?'),
    'O atendente nem consulta.',
    fala('o atendente da encomenda', 'Terça e sexta. Sempre os mesmos.'),
    c18_eu('Sempre Pokémon?'),
    fala('o atendente da encomenda', 'Sempre caixa com furo.'),
    'Ele encolhe os ombros.',
    fala('o atendente da encomenda', 'Eu não abro. Tem licença, tem nota, tem lacre. Meu trabalho é o lacre estar inteiro.'),
    'Ele olha o relógio da parede.',
    fala('o atendente da encomenda', 'Terça e sexta, {moço|moça}. Se {o senhor|a senhora} quiser ver, é só estar aqui às onze.')
  ],
  ef:{flag:'sabe_terca_e_sexta',
      registrar:'Sai carga viva para a Estação 4 toda terça e sexta, às 11h.'},
  escolhas:[
    {texto:'Agradecer e ir ler as atas.', vai:'c18_leitura', cond:d=>!!d.flags.tem_as_atas},
    ...c18_aoCartorio('Ir ao cartório atrás das atas.', 'Ir ao cartório buscar as atas.')
  ]
},

c18_contou_mais:{
  texto:[
    'Você fica até o café fechar e conta mais onze pessoas.',
    'Quando escurece, a luz da sala 704 fica acesa e as outras do andar apagam.',
    'Mais tarde, uma mulher desce com a garrafa térmica vazia, pede pro dono do café encher e leva também um pacote de copos novos.',
    fala('a mulher da garrafa', 'É pra reunião de amanhã.'),
    'Ninguém tinha perguntado.',
    'Isso te incomoda mais que qualquer outra coisa que você viu hoje, e você leva um tempo pra entender por quê.',
    'Porque é cuidado. Porque alguém ali se importa que o café esteja quente pra próxima reunião.'
  ],
  ef:{instabilidade:1, registrar:'Alguém da Comissão se importa que o café da reunião esteja quente.',
      executar:()=>{ c18_ate(22, true); return []; }},
  escolhas:[
    {texto:'Ir embora ler as atas.', vai:'c18_leitura', cond:d=>!!d.flags.tem_as_atas},
    ...c18_aoCartorio('Ir ao cartório atrás das atas.', 'Ir ao cartório buscar as atas.')
  ]
},

c18_entrou_cedo_demais:{
  texto:[
    'Você empurra a porta e entra.',
    'É uma sala de reunião com uma mesa oval, oito cadeiras e um quadro branco escrito com pauta em letra caprichada.',
    'Tem seis pessoas sentadas. Todas param de falar e olham pra você sem nenhum susto.',
    d=>c18_viuFabreNoAnne(d)
      ? 'Na ponta da mesa, de barba agora e sem o terno, está o homem de sapato limpo do S.S. Anne. Ele te reconhece e não disfarça.'
      : '',
    'Uma mulher de tailleur cinza, na cabeceira, fecha a caneta.',
    fala('a mulher de tailleur', '{O senhor|A senhora} procura alguém?'),
    'E você percebe que não trouxe pergunta nenhuma. Você trouxe raiva, e raiva não é pergunta.'
  ],
  ef:{flag:'entrou_na_704_cedo',
      npc:{nome:'Hester Colman', opiniao:0, memoria:'Você entrou na sala de reunião sem saber o que perguntar.'},
      registrar:'Entrou na sala 704 no meio de uma reunião.'},
  escolhas:[
    {texto:'"Eu sei o que vocês fazem."', vai:'c18_704_sei_o_que_fazem'},
    {texto:'"Desculpa. Sala errada." E sair.', vai:'c18_704_saiu'},
    {texto:'"Quem é a senhora?"', vai:'c18_704_quem_e'},
    {texto:'Ficar em pé, calad{o|a}, e esperar.', vai:'c18_704_esperou'}
  ]
},

c18_704_perito:{
  texto:[
    'Você empurra a porta e entra.',
    'É a sala de sempre: a mesa oval, as oito cadeiras, o quadro branco com a pauta em letra caprichada. Só que hoje você não está na pauta.',
    d=>{ Nomes.apresentar('a mulher de tailleur'); return 'A Presidente, na cabeceira, fecha a caneta.'; },
    fala('a mulher de tailleur', '{Perito|Perita}. Hoje a pauta não tem item seu.'),
    'Ela não está te mandando embora. Está te informando.',
    fala('a mulher de tailleur', 'Se quiser ficar, fica. Perito pode assistir. Só não fala depois que a votação abre.')
  ],
  ef:{flag:'entrou_na_704_cedo',
      npc:{nome:'Hester Colman', opiniao:0, memoria:'Você entrou numa reunião em que não tinha item de pauta.'},
      registrar:'Entrou na sala 704 numa reunião sem item seu na pauta.'},
  escolhas:[
    {texto:'Sentar no canto.', vai:'c18_704_sentou'},
    {texto:'"Eu quero as atas."', vai:'c18_704_pediu_atas'},
    {texto:'Sair.', vai:'c18_704_saiu'}
  ]
},

c18_704_sei_o_que_fazem:{
  texto:[
    c18_eu('Eu sei o que vocês fazem.'),
    d=>c18_viuFabreNoAnne(d)
      ? 'A mulher de tailleur não reage. Na ponta da mesa, o homem do S.S. Anne chega a parecer aliviado.'
      : 'A mulher de tailleur não reage. Um homem de barba, na ponta da mesa, chega a parecer aliviado.',
    fala('a mulher de tailleur', 'Ótimo.'),
    fala('a mulher de tailleur', 'Então {o senhor|a senhora} sabe mais que a maior parte das pessoas pra quem a gente tenta explicar.'),
    'Ela puxa uma cadeira com o pé.',
    fala('a mulher de tailleur', 'Senta. A pauta de hoje é orçamento de viveiro e a gente está atrasado. Se {o senhor|a senhora} souber mesmo, vai achar chato.'),
    'E é essa a coisa mais assustadora que já te disseram: senta.'
  ],
  ef:{flag:'foi_convidado_a_sentar', instabilidade:1,
      registrar:'A presidente te ofereceu uma cadeira no meio da reunião.'},
  escolhas:[
    {texto:'Sentar.', vai:'c18_704_sentou'},
    {texto:'Não sentar. Sair.', vai:'c18_704_saiu'},
    {texto:'"Eu quero as atas."', vai:'c18_704_pediu_atas'}
  ]
},

c18_704_sentou:{
  texto:[
    'Você senta.',
    'Eles retomam a pauta como se você fosse {um estagiário atrasado|uma estagiária atrasada}.',
    'Item 3: readequação do orçamento da Estação 4 em função do aumento do custo de ração.',
    'Item 4: prazo de entrega da Fase II.',
    'Item 5: descarte.',
    'Ninguém baixa a voz no item 5. Ninguém olha para você. Duas pessoas anotam.'
  ],
  ef:{flag:['sabe_da_fase2','ouviu_descarte'], instabilidade:2,
      registrar:'Assistiu a uma reunião da CGRB. Item 5 da pauta: descarte.'},
  escolhas:[
    {texto:'"O que é descarte?"', vai:'c18_704_o_que_e_descarte'},
    {texto:'Anotar tudo e não abrir a boca.', vai:'c18_704_anotou'},
    {texto:'Levantar e sair no meio.', vai:'c18_704_saiu'}
  ]
},

c18_704_o_que_e_descarte:{
  texto:[
    'A pergunta cai na mesa e não faz barulho nenhum.',
    d=>c18_viuFabreNoAnne(d)
      ? 'Quem responde é o homem do S.S. Anne, e ele responde olhando pras mãos.'
      : 'Quem responde é o homem de barba, e ele responde olhando pras mãos.',
    d=>fala(c18_rotuloFabre(d), 'Unidade que não atinge parâmetro de viabilidade. Malformação, agressividade fora de faixa, doença que não compensa tratar.'),
    c18_eu('Vocês matam.'),
    d=>fala(c18_rotuloFabre(d), 'Eu sacrifico.'),
    'Ele levanta os olhos.',
    d=>fala(c18_rotuloFabre(d), 'E antes de {o senhor|a senhora} dizer que é a mesma coisa: é a mesma coisa. Eu uso a palavra que consta no regulamento, porque a palavra que consta no regulamento é a que me obriga a preencher um formulário pra cada um.'),
    'Ele volta a olhar as mãos.',
    d=>fala(c18_rotuloFabre(d), 'Eu preenchi quatrocentos e dezenove formulários.')
  ],
  ef:{flag:['sabe_do_art19','sabe_dos_419'], instabilidade:2,
      npc:{nome:'Curador Fabre', opiniao:1, memoria:'Te disse quantos formulários já preencheu.'},
      registrar:'419 formulários de descarte preenchidos até hoje.'},
  escolhas:[
    {texto:'"Qual o seu nome?"', vai:'c18_704_nome_do_adnan', cond:d=>!c18_sabeNomeFabre(d)},
    {texto:'"A gente já se conhece, Fabre."', vai:'c18_704_nome_do_adnan', cond:d=>c18_sabeNomeFabre(d),
     ef:{flag:'c18_fabre_ja_conhecido'}},
    {texto:'Sair sem dizer mais nada.', vai:'c18_704_saiu'},
    {texto:'"Eu quero as atas."', vai:'c18_704_pediu_atas'}
  ]
},

c18_704_nome_do_adnan:{
  texto:[
    d=>{
      Nomes.apresentar('o homem de barba');
      if (c18_viuFabreNoAnne(d)) Nomes.apresentar('o homem de sapato limpo');
      return d.flags.c18_fabre_ja_conhecido ? 'Ele levanta os olhos das mãos e faz que sim, devagar.' : fala('Curador Fabre', 'Fabre.');
    },
    d=>d.flags.c18_fabre_ja_conhecido
      ? fala('Curador Fabre', c18_viuFabreNoAnne(d) ? 'O navio. Eu lembro. Eu lembro de todo mundo que recusa ou que pensa.' : 'Curador. Eu sei que {o senhor|a senhora} sabe.')
      : 'Ele estende a mão por cima da mesa e você aperta sem querer apertar.',
    d=>d.flags.c18_fabre_ja_conhecido ? '' : fala('Curador Fabre', 'Curador.'),
    d=>d.flags.c18_fabre_ja_conhecido ? '' : fala(d.jogador.nome, 'Curador de quê?'),
    d=>d.flags.c18_fabre_ja_conhecido ? '' : fala('Curador Fabre', 'De acervo vivo.'),
    d=>d.flags.c18_fabre_ja_conhecido ? '' : 'Ele ouve a própria frase e faz uma careta.',
    d=>d.flags.c18_fabre_ja_conhecido ? '' : fala('Curador Fabre', 'É o nome do cargo. Eu sei como soa.'),
    'A presidente fecha a pasta.',
    fala('a mulher de tailleur', 'O Curador Fabre vai te acompanhar até o elevador e responder o que {o senhor|a senhora} quiser no caminho. Nós temos mais dois itens.'),
    'Não é ameaça. É agenda.'
  ],
  ef:{flag:['conheceu_adnan','sabe_da_comissao'],
      npc:{nome:'Curador Fabre', opiniao:1, memoria:'Se apresentou no meio de uma reunião.'},
      registrar:'Conheceu o Curador Fabre, curador de acervo vivo da CGRB.'},
  escolhas:[{texto:'Ir até o elevador com ele.', vai:'c18_adnan', ef:{flag:'c18_fabre_elevador'}}]
},

c18_704_anotou:{
  texto:[
    'Você anota tudo, em letra pequena, com a mão firme por teimosia.',
    'Sete páginas de caderno em quarenta minutos.',
    'Quando a reunião acaba, a presidente se levanta, guarda a caneta no bolso do paletó e diz, sem olhar pra você:',
    fala('a mulher de tailleur', '{O senhor|A senhora} vai descobrir que o problema não é a gente esconder. É a gente não esconder e ninguém ler.'),
    'Ela sai. Os outros saem atrás. Alguém recolhe a garrafa térmica do corredor.',
    'Você fica sozinh{o|a} numa sala de reunião com um quadro branco escrito PAUTA.'
  ],
  ef:{flag:['anotou_a_reuniao','sabe_da_comissao'], instabilidade:1,
      rep:{eixo:'bom',delta:1,motivo:'Assistiu calad{o|a} e anotou tudo'},
      registrar:'Anotou sete páginas de uma reunião da CGRB.'},
  escolhas:[
    {texto:'Apagar o quadro depois de copiar a pauta.', vai:'c18_copiou_a_pauta'},
    ...c18_aoCartorio('Sair e ir atrás das atas no cartório.', 'Sair e voltar ao cartório atrás das atas.'),
    {texto:'Sair e ler as atas que você já tem.', vai:'c18_leitura', cond:d=>!!d.flags.tem_as_atas}
  ]
},

c18_copiou_a_pauta:{
  texto:[
    'Você copia a pauta inteira e depois apaga o quadro, o que é uma vingança pequena e satisfatória.',
    'O item 7, que ninguém chegou a discutir, diz: Risco 01 — atualização de busca.',
    'Você fica olhando essas quatro palavras e o número.',
    d=>c18_sabeDoUm(d)
      ? 'Você sabe quem eles procuram. Eles numeraram ele. Ele é o primeiro item de uma lista.'
      : 'Eles procuram alguma coisa e deram um número pra ela. É o primeiro item de uma lista.'
  ],
  ef:{flag:'sabe_do_risco01', instabilidade:1,
      registrar:'Item 7 da pauta da CGRB: Risco 01, atualização de busca.'},
  escolhas:[
    ...c18_aoCartorio('Sair e ir atrás das atas.', 'Sair e buscar as atas.'),
    {texto:'Sair e ler as atas.', vai:'c18_leitura', cond:d=>!!d.flags.tem_as_atas}
  ]
},

c18_704_pediu_atas:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu quero as atas.'),
    'A presidente aponta a parede com a caneta, e na parede tem um armário de aço com porta de vidro, cheio de pastas com etiqueta.',
    fala('a mulher de tailleur', 'Estão ali, e também estão no cartório, e ali é mais perto.'),
    'Ela volta para a pauta.',
    fala('a mulher de tailleur', 'Pega.'),
    'Você atravessa a sala, abre o armário na frente de seis pessoas e tira um calhamaço de cento e quarenta páginas. Ninguém levanta.'
  ],
  ef:{flag:['tem_as_atas','tem_o_estatuto','sabe_da_comissao'], instabilidade:1,
      registrar:'Pegou as 140 páginas de atas do armário da própria sala de reunião.'},
  escolhas:[
    {texto:'Sair com elas.', vai:'c18_leitura'},
    {texto:'"Por que vocês estão me deixando?"', vai:'c18_704_porque_deixam'}
  ]
},

c18_704_porque_deixam:{
  texto:[
    d=>fala(d.jogador.nome, 'Por que vocês estão me deixando?'),
    'A presidente termina de escrever uma palavra antes de responder.',
    fala('a mulher de tailleur', 'Porque isso é público, porque {o senhor|a senhora} pagaria um pokedólar a página por elas de qualquer jeito, e porque eu prefiro que {o senhor|a senhora} leia o documento inteiro a que {o senhor|a senhora} leia três linhas que alguém te vendeu.'),
    'Ela levanta os olhos.',
    fala('a mulher de tailleur', 'E porque eu quero que {o senhor|a senhora} volte aqui depois de ler. Aí a conversa presta.')
  ],
  ef:{flag:'convite_da_presidente',
      npc:{nome:'Hester Colman', opiniao:1, memoria:'Te entregou as atas e pediu que você voltasse depois de ler.'},
      registrar:'A presidente quer conversar depois que você ler tudo.'},
  escolhas:[{texto:'Sair com o calhamaço.', vai:'c18_leitura'}]
},

c18_704_quem_e:{
  texto:[
    c18_eu('Quem é a senhora?'),
    d=>{ Nomes.apresentar('a mulher de tailleur'); return fala('a mulher de tailleur', 'Hester Colman. Presidente do conselho.'); },
    'Ela responde como quem atende o telefone.',
    fala('a mulher de tailleur', 'E {o senhor|a senhora}?'),
    'Você diz o seu nome. Ela repete uma vez, baixo, guardando.',
    fala('a mulher de tailleur', 'Eu sei quem é {o senhor|a senhora}.'),
    'Ela não diz isso de um jeito ameaçador. Diz de um jeito administrativo.',
    fala('a mulher de tailleur', 'Consta em três atas.'),
    'Três atas.',
    'Você entrou nessa sala achando que ia descobrir quem eles são, e descobre que você já é um item de pauta.'
  ],
  ef:{flag:['sabe_o_nome_da_presidente','voce_esta_nas_atas'], instabilidade:1,
      npc:{nome:'Hester Colman', opiniao:0, memoria:'Te informou que você consta em três atas.'},
      registrar:'Você aparece em três atas da CGRB.'},
  escolhas:[
    {texto:'"Em quais?"', vai:'c18_704_em_quais'},
    {texto:'"Eu quero as atas."', vai:'c18_704_pediu_atas'},
    {texto:'Sair.', vai:'c18_704_saiu'}
  ]
},

c18_704_em_quais:{
  texto:[
    'Ela não precisa consultar.',
    fala('a mulher de tailleur', 'Vigésima segunda: deliberação sobre a conveniência de abordagem. Ficou vencida.'),
    fala('a mulher de tailleur', 'Vigésima nona: comunicação da Auditoria sobre interferência em operação de campo.'),
    d=>c18_interferiu(d) ? '' : 'Você repassa a estrada de cabeça atrás de que operação seria, e não acha nenhuma. Alguém achou.',
    fala('a mulher de tailleur', 'Trigésima terceira: {o senhor|a senhora} entrou como item de risco reputacional, e eu voto contra essa classificação toda vez.'),
    c18_eu('Por quê?'),
    fala('a mulher de tailleur', 'Porque risco reputacional é o nome que a gente dá quando tem medo de gente honesta.'),
    'Ela fecha a caneta.',
    fala('a mulher de tailleur', 'E eu não tenho.')
  ],
  ef:{flag:'presidente_te_defende', instabilidade:1,
      npc:{nome:'Hester Colman', opiniao:2, memoria:'Vota contra te classificarem como risco reputacional.'},
      registrar:'A presidente vota contra te tratarem como risco reputacional.'},
  escolhas:[
    {texto:'"Eu quero as atas."', vai:'c18_704_pediu_atas'},
    {texto:'"E o descarte? Quem me explica?"', vai:'c18_704_o_que_e_descarte', cond:d=>!!(d.flags.sabe_do_art19 || d.flags.livro_de_destinos || d.flags.ouviu_descarte)},
    {texto:'"E o que vocês fazem com o que não serve?"', vai:'c18_704_o_que_e_descarte', cond:d=>!(d.flags.sabe_do_art19 || d.flags.livro_de_destinos || d.flags.ouviu_descarte)},
    {texto:'Sair.', vai:'c18_704_saiu'}
  ]
},

c18_704_esperou:{
  texto:[
    'Você fica em pé, calad{o|a}, encostad{o|a} no batente.',
    'Leva quarenta segundos para eles voltarem a falar, e quando voltam, falam normal.',
    'Custo de ração. Reforma de telhado. Um problema com um fornecedor de incubadora que atrasou a entrega três vezes.',
    'Ninguém encena nada para você. Ninguém abaixa a voz.',
    'Aos poucos, ficar em pé ali vira constrangedor, e o constrangimento é todo seu.',
    'É assim que eles ganham: não escondendo.'
  ],
  ef:{flag:'ficou_em_pe_na_reuniao', instabilidade:1,
      registrar:'Ficou em pé no canto de uma reunião da CGRB, ouvindo pauta de orçamento.'},
  escolhas:[
    {texto:'"Eu quero as atas."', vai:'c18_704_pediu_atas'},
    {texto:'Sentar.', vai:'c18_704_sentou'},
    {texto:'Sair.', vai:'c18_704_saiu'}
  ]
},

c18_704_saiu:{
  texto:[
    'Você sai. A porta fica aberta atrás de você, porque ninguém se levanta pra fechar.',
    'No elevador, você olha pro próprio reflexo na chapa de aço e não gosta do que vê.',
    'Não porque você fugiu. Porque você chegou sem pergunta.',
    'Pergunta se faz com papel na mão.'
  ],
  ef:{registrar:'Saiu da sala 704 sem perguntar nada.'},
  escolhas:[
    ...c18_aoCartorio('Ir ao cartório atrás das atas.', 'Ir ao cartório buscar as atas.'),
    {texto:'Ler as atas que você tem.', vai:'c18_leitura', cond:d=>!!d.flags.tem_as_atas}
  ]
},

/* ── Dra. Cordell ─────────────────────────────────────────── */
c18_ivone:{
  texto:[
    'A Dra. Cordell agora trabalha numa sala emprestada em Saffron, em cima de uma loja de tecidos, com uma mesa, um arquivo de aço e uma pilha de pastas que chega na altura da janela.',
    'Ela te reconhece na porta e não faz cerimônia, como quem lembra de quem ficou de voltar.',
    'Ela ouve você por quatro minutos sem interromper, o que é a coisa mais rara que alguém com doutorado faz.',
    fala('Dra. Cordell', 'CGRB.'),
    'Ela diz a sigla antes de você terminar.',
    fala('Dra. Cordell', 'Eu sei o que é.'),
    c18_eu('A senhora sabe e não me falou?'),
    fala('Dra. Cordell', 'Eu não te falei porque eu não tinha prova, e falar sem prova é exatamente como a gente perde a matéria.'),
    'Ela puxa uma pasta da terceira pilha, sem procurar.',
    fala('Dra. Cordell', 'Comissão de Gestão de Risco Biológico de Kanto. Associação civil. Registrada. Legal.')
  ],
  ef:{flag:['sabe_da_comissao','ivone_sabia','sabe_o_nome_da_comissao'],
      npc:{nome:'Dra. Cordell', opiniao:1, memoria:'Já conhecia a CGRB e esperou você chegar sozinh{o|a} até lá.'},
      registrar:'A Dra. Cordell já conhecia a CGRB e tinha as atas havia seis meses.'},
  escolhas:[
    {texto:'"Por que a senhora esperou eu chegar sozinh{o|a}?"', vai:'c18_ivone_esperou'},
    {texto:'"O que tem na pasta?"', vai:'c18_ivone_pasta'},
    {texto:'"A senhora pode processar essa gente?"', vai:'c18_ivone_processo'},
    {texto:'"Me dá as atas."', vai:'c18_ivone_da_as_atas'}
  ]
},

c18_ivone_esperou:{
  texto:[
    fala('Dra. Cordell', 'Porque informação que a gente recebe vale menos que informação que a gente acha.'),
    'Ela tira os óculos e limpa com a barra da blusa, o que piora.',
    fala('Dra. Cordell', 'Eu já vi advogado entregar coisa pronta pra testemunha. A testemunha repete bonito na primeira audiência e desmonta na segunda, porque ela nunca soube de verdade, ela só decorou.'),
    c18_eu('E eu?'),
    fala('Dra. Cordell', 'Você andou de Pewter a Cinnabar com isso no bolso. Você não vai desmontar.'),
    'Ela põe os óculos de volta.',
    fala('Dra. Cordell', 'Agora senta, porque a parte ruim é longa.')
  ],
  ef:{npc:{nome:'Dra. Cordell', opiniao:2, memoria:'Explicou por que não te entregou a resposta de bandeja.'},
      registrar:'Informação que a gente acha vale mais que informação que a gente recebe.'},
  escolhas:[
    {texto:'Sentar e ouvir a parte ruim.', vai:'c18_ivone_pasta'},
    {texto:'"Me dá as atas antes."', vai:'c18_ivone_da_as_atas'}
  ]
},

c18_ivone_pasta:{
  texto:[
    'A pasta tem três coisas.',
    'Uma: uma cópia do estatuto, com o Art. 19 marcado de amarelo e um ponto de interrogação a lápis na margem.',
    'Duas: um parecer que um advogado amigo dela escreveu e não protocolou em lugar nenhum, com uma frase sublinhada duas vezes: não há, no ordenamento, dispositivo que proíba expressamente o que descrevem.',
    'Três: uma lista de doze nomes de gente que trabalhou nos viveiros e saiu, com telefone, e ao lado de quatro deles a palavra morto.',
    c18_eu('Os quatro morreram de quê?'),
    fala('Dra. Cordell', 'De coisa de gente.'),
    'Ela fecha a pasta.',
    fala('Dra. Cordell', 'Infarto, câncer, um acidente de carro e uma queda. Eu conferi todos. É isso que me deixa acordada.')
  ],
  ef:{flag:['viu_a_pasta_da_ivone','sabe_do_art19'], instabilidade:1,
      registrar:'A Dra. Cordell tem um parecer não protocolado e uma lista de doze ex-funcionários de viveiro, quatro deles mortos de causas comuns.'},
  escolhas:[
    {texto:'"Nenhum deles foi morto por eles?"', vai:'c18_ivone_nenhum_morto'},
    {texto:'"Me dá as atas."', vai:'c18_ivone_da_as_atas'},
    {texto:'"A senhora pode processar essa gente?"', vai:'c18_ivone_processo'}
  ]
},

c18_ivone_nenhum_morto:{
  texto:[
    fala('Dra. Cordell', 'Não.'),
    'Ela fala isso com um cansaço que não é fingido.',
    fala('Dra. Cordell', 'E é pior.'),
    c18_eu('Como é pior?'),
    fala('Dra. Cordell', 'Porque se eles matassem gente, a gente ganhava. Homicídio qualquer promotor sabe processar.'),
    'Ela bate na pasta com dois dedos.',
    fala('Dra. Cordell', 'Eles não matam gente. Eles fazem uma coisa que não tem nome no código, e o que não tem nome ninguém sabe pedir ao juiz.'),
    'Ela olha a janela.',
    fala('Dra. Cordell', 'Eu passei seis meses, com um advogado, tentando achar o nome. A gente não achou.')
  ],
  ef:{flag:'nao_tem_nome_no_codigo', instabilidade:1,
      registrar:'O que a CGRB faz não tem tipo penal. A Dra. Cordell procurou seis meses e não achou.'},
  escolhas:[
    {texto:'"E se a gente não usar tribunal?"', vai:'c18_ivone_sem_tribunal'},
    {texto:'"Me dá as atas."', vai:'c18_ivone_da_as_atas'},
    {texto:'"Então não tem o que fazer."', vai:'c18_ivone_desanimo'}
  ]
},

c18_ivone_sem_tribunal:{
  texto:[
    'Ela levanta uma sobrancelha, e por um segundo parece dez anos mais nova.',
    fala('Dra. Cordell', 'Continua.'),
    d=>fala(d.jogador.nome, 'Se não dá para processar, dá para publicar.'),
    fala('Dra. Cordell', 'Dá.'),
    'Ela pesa a palavra.',
    fala('Dra. Cordell', 'E publicar tem três problemas: jornal não publica sem documento, documento sozinho não vira notícia, e notícia sem gente que se importe morre em dois dias.'),
    d=>fala(d.jogador.nome, 'E com documento, e com gente?'),
    fala('Dra. Cordell', 'Aí é campanha, e campanha é uma coisa que dura anos e desgasta quem faz.'),
    'Ela volta a olhar você.',
    fala('Dra. Cordell', 'Você tem estômago para anos?')
  ],
  ef:{flag:'plano_publicar', registrar:'Publicar exige documento, veículo e gente que se importe. E anos.'},
  escolhas:[
    {texto:'"Tenho."', vai:'c18_ivone_tem_estomago'},
    {texto:'"Não sei."', vai:'c18_ivone_nao_sei_estomago'},
    {texto:'"Me dá as atas primeiro."', vai:'c18_ivone_da_as_atas'}
  ]
},

c18_ivone_tem_estomago:{
  texto:[
    d=>fala(d.jogador.nome, 'Tenho.'),
    'Ela anota alguma coisa num papel e empurra para você. É um nome e um telefone.',
    fala('Dra. Cordell', 'Livia Gale. Editora de cidades do jornal de Celadon. É a única pessoa naquela redação que lê documento inteiro antes de escrever.'),
    d=>fala(d.jogador.nome, 'E o resto?'),
    fala('Dra. Cordell', 'O resto pergunta se tem foto.'),
    'Ela guarda a caneta.',
    fala('Dra. Cordell', 'Leva o calhamaço inteiro para ela. Não leva resumo. Resumo é o que a gente faz quando quer que acreditem em nós; documento é o que a gente faz quando quer que acreditem no documento.')
  ],
  ef:{flag:['contato_isaura','plano_publicar'],
      npc:{nome:'Dra. Cordell', opiniao:2, memoria:'Te deu o contato da editora Livia Gale.'},
      registrar:'Livia Gale, editora de cidades do jornal de Celadon.'},
  escolhas:[{texto:'"Me dá as atas."', vai:'c18_ivone_da_as_atas'}]
},

c18_ivone_nao_sei_estomago:{
  texto:[
    c18_eu('Não sei.'),
    fala('Dra. Cordell', 'Boa resposta.'),
    'Ela fala sério.',
    fala('Dra. Cordell', 'Quem diz que tem, na hora, costuma sumir no terceiro mês.'),
    'Ela escreve um nome e um telefone e dobra o papel antes de entregar.',
    fala('Dra. Cordell', 'Guarda e não usa até saber. Livia Gale, jornal de Celadon. Quando você souber, ela vai estar lá, porque ela está lá há vinte e dois anos.')
  ],
  ef:{flag:'contato_isaura',
      npc:{nome:'Dra. Cordell', opiniao:2, memoria:'Preferiu a sua dúvida à sua certeza.'},
      registrar:'Guardou o contato de Livia Gale sem prometer nada.'},
  escolhas:[{texto:'"Me dá as atas."', vai:'c18_ivone_da_as_atas'}]
},

c18_ivone_desanimo:{
  texto:[
    c18_eu('Então não tem o que fazer.'),
    'Ela bate a mão na mesa uma vez, seca, e a pilha de processos balança.',
    fala('Dra. Cordell', 'Tem. Tem ler.'),
    'Ela põe a mão em cima do calhamaço dela.',
    fala('Dra. Cordell', 'Antes de decidir que não tem o que fazer, leia as cento e quarenta páginas. Você não tem direito de desanimar antes da página nove.'),
    c18_eu('O que tem na nove?'),
    fala('Dra. Cordell', 'O Art. 19.'),
    'Ela se recosta.',
    fala('Dra. Cordell', 'E eu quero ver a sua cara.')
  ],
  ef:{registrar:'A Dra. Cordell te proibiu de desanimar antes da página nove.'},
  escolhas:[{texto:'Pegar o calhamaço.', vai:'c18_ivone_da_as_atas'}]
},

c18_ivone_processo:{
  texto:[
    c18_eu('A senhora pode processar essa gente?'),
    fala('Dra. Cordell', 'Por quê?'),
    'Você abre a boca e não sai nada, porque você não sabe por quê. Você sabe que é errado. Você não sabe qual artigo.',
    fala('Dra. Cordell', 'Exato.'),
    'Ela nem parece satisfeita com isso.',
    fala('Dra. Cordell', 'Maus-tratos exige ato de crueldade contra Pokémon identificado, e eles têm parecer médico pra cada sacrifício. Crime ambiental exige dano a espécie protegida, e eles soltam espécie nativa. Associação criminosa exige fim ilícito, e o fim deles está escrito no estatuto e é lícito.'),
    'Ela levanta três dedos e vai abaixando um por um.',
    fala('Dra. Cordell', 'A gente tentou os três com o advogado. Não protocolou nenhum, porque perder abre precedente, e precedente perdido vale mais pra eles do que a vitória valeria pra nós.')
  ],
  ef:{flag:'sabe_que_nao_da_processo', instabilidade:1,
      registrar:'Maus-tratos, crime ambiental e associação criminosa: nenhum encaixa. A Dra. Cordell e o advogado não protocolaram pra não criar precedente.'},
  escolhas:[
    {texto:'"E se a gente não usar tribunal?"', vai:'c18_ivone_sem_tribunal'},
    {texto:'"Me dá as atas."', vai:'c18_ivone_da_as_atas'},
    {texto:'"O que tem na pasta?"', vai:'c18_ivone_pasta'}
  ]
},

c18_ivone_da_as_atas:{
  texto:[
    'Ela empurra o calhamaço pela mesa. Cento e quarenta páginas, grampeadas em quatro blocos, com as margens já cheias de anotação a lápis dela.',
    fala('Dra. Cordell', 'Essas são as minhas. Estão sujas.'),
    c18_eu('Tudo bem.'),
    fala('Dra. Cordell', 'Não está tudo bem. O certo era você ler as suas, limpas, compradas no balcão.'),
    'Ela segura o calhamaço por mais um segundo antes de soltar.',
    fala('Dra. Cordell', 'Se você ler as minhas, vai ler o que eu achei importante. Lê com a mão em cima das minhas anotações e confere depois com as suas.'),
    'Ela solta.'
  ],
  ef:{flag:['tem_as_atas','tem_o_estatuto'],
      npc:{nome:'Dra. Cordell', opiniao:1, memoria:'Te emprestou a cópia anotada dela.'},
      registrar:'A Dra. Cordell te emprestou a cópia anotada das atas.'},
  escolhas:[{texto:'Ler.', vai:'c18_leitura'}]
},

/* ── A Terceira ─────────────────────────────────────────── */
c18_terceira:{
  texto:[
    'A Terceira atende em Celadon, num galpão de material de construção que é de verdade um galpão de material de construção, com areia, cimento e um funcionário chamado Ned que não olha pra ninguém.',
    d=>d.flags.trabalha_para_terceira
      ? 'Ela te recebe como recebe quem já trabalhou pra ela: sem levantar, e lembrando.'
      : 'Ela lembra de você do cassino e não faz festa por isso.',
    'Você diz a palavra comissão, e ela faz uma careta de quem mordeu limão.',
    fala('A Terceira', 'Comissão.'),
    'Ela sopra o ar.',
    fala('A Terceira', 'Eles são o pior tipo de cliente.'),
    c18_eu('Por quê? Pagam mal?'),
    fala('A Terceira', 'Pagam ótimo, no prazo, com nota.'),
    'Ela cospe no chão de terra.',
    fala('A Terceira', 'Com nota. Você entende o que é um cliente que exige nota fiscal de mim?')
  ],
  ef:{flag:'sabe_da_comissao',
      npc:{nome:'A Terceira', opiniao:0, memoria:'Falou da Comissão como quem fala de um cliente insuportável.'},
      registrar:'A Terceira vende para a CGRB, e eles exigem nota fiscal.',
      executar:()=>{ Relogio.avancar(1); return []; }},
  escolhas:[
    {texto:'"O que eles compram de você?"', vai:'c18_terceira_compra'},
    {texto:'"Por que ter nota é ruim pra você?"', vai:'c18_terceira_nota'},
    {texto:'"Quem assina as ordens?"', vai:'c18_terceira_quem_assina'},
    {texto:'"Me vende o que você tem sobre eles."', vai:'c18_terceira_preco'}
  ]
},

c18_terceira_nota:{
  texto:[
    fala('A Terceira', 'Porque nota é laço.'),
    'Ela mostra os dentes num quase-sorriso.',
    fala('A Terceira', 'Se eu emito nota, eu existo. Se eu existo, eu declaro. Se eu declaro, eu tenho dono.'),
    d=>fala(d.jogador.nome, 'E eles fazem isso de propósito?'),
    fala('A Terceira', 'Eles fazem tudo de propósito, {garoto|garota}.'),
    'Ela chuta um saco de cimento para endireitar.',
    fala('A Terceira', 'Eles não me compraram. Eles me legalizaram. Metade do meu movimento hoje é nota deles, e no dia em que eu falar demais, a nota vira o processo.'),
    'Ela olha para o lado, para o Ned, que continua não olhando para ninguém.',
    fala('A Terceira', 'Eu já vi gente ser presa por gente pior. Eu nunca vi ser presa por gente mais organizada.')
  ],
  ef:{flag:'terceira_esta_presa', instabilidade:1,
      registrar:'A Comissão legalizou a Terceira de propósito. A nota fiscal dela é a coleira.'},
  escolhas:[
    {texto:'"E se eu te tirar dessa?"', vai:'c18_terceira_tirar'},
    {texto:'"Quem assina as ordens?"', vai:'c18_terceira_quem_assina'},
    {texto:'"Me vende o que você tem."', vai:'c18_terceira_preco'}
  ]
},

c18_terceira_tirar:{
  texto:[
    'Ela ri de verdade, a primeira vez que você a ouve rir.',
    fala('A Terceira', 'Me tirar.'),
    'Ela seca o olho com o pulso.',
    fala('A Terceira', '{Moço|Moça}, eu tenho quarenta e um anos e catorze pessoas comendo do que eu faço. Eu não quero sair. Eu quero saber antes.'),
    d=>fala(d.jogador.nome, 'Antes de quê?'),
    fala('A Terceira', 'Antes de eles decidirem que eu também sou risco não gerenciado.'),
    'Ela para de rir.',
    fala('A Terceira', 'Está no estatuto deles. Art. 4º. Densidade, agressividade ou capacidade destrutiva não sujeita a controle institucional.'),
    d=>fala(d.jogador.nome, 'Isso é sobre Pokémon.'),
    fala('A Terceira', 'É sobre o que eles quiserem que seja. Está escrito assim de propósito.')
  ],
  ef:{flag:'art4_serve_pra_gente', instabilidade:1,
      npc:{nome:'A Terceira', opiniao:2, memoria:'Te contou do que ela tem medo.'},
      registrar:'A Terceira acha que o Art. 4º foi escrito largo o bastante para servir para gente.'},
  escolhas:[
    {texto:'"Me vende o que você tem."', vai:'c18_terceira_preco'},
    {texto:'"Quem assina as ordens?"', vai:'c18_terceira_quem_assina'}
  ]
},

c18_terceira_compra:{
  texto:[
    'Ela conta no dedo, sem esforço nenhum de memória.',
    fala('A Terceira', 'Gaiola de transporte, modelo grande, oito por mês. Rede de contenção. Ração de alto teor, que eu compro de fora porque aqui não tem. Anestésico para Pokémon, que é controlado, e eles me mandam a receita antes de pedir.'),
    d=>fala(d.jogador.nome, 'Mandam a receita antes.'),
    fala('A Terceira', 'Antes. Com carimbo de médico de Pokémon e número de conselho.'),
    'Ela olha para você.',
    fala('A Terceira', 'Sabe o que é isso? É gente que não quer que eu tenha problema. Eu não sei lidar com isso.'),
    'Ela cospe de novo.',
    fala('A Terceira', 'Bandido que te protege é dono.')
  ],
  ef:{flag:'sabe_o_que_compram',
      registrar:'A CGRB compra gaiola, rede, ração de alto teor e anestésico com receita carimbada.'},
  escolhas:[
    {texto:'"Quem assina as ordens?"', vai:'c18_terceira_quem_assina'},
    {texto:'"Me vende o que você tem."', vai:'c18_terceira_preco'},
    {texto:'"Para onde vai a entrega?"', vai:'c18_terceira_entrega'}
  ]
},

c18_terceira_entrega:{
  texto:[
    fala('A Terceira', 'Estação 4, Rota 21.'),
    'Ela diz isso com um desprezo profissional.',
    fala('A Terceira', 'Endereço fixo, recebedor fixo, horário fixo. É o cliente mais chato de Kanto e o único que nunca me deu calote.'),
    d=>fala(d.jogador.nome, 'Você já entrou lá?'),
    fala('A Terceira', 'Até a guarita. Da guarita para dentro, ninguém entra sem crachá, e o crachá tem foto e validade.'),
    'Ela pensa um segundo.',
    fala('A Terceira', 'Tem uma coisa. A cerca do lado do mar é mais baixa, porque ali o barranco já é cerca. Eu reparei porque eu reparo em cerca.')
  ],
  ef:{flag:['sabe_da_rota21','sabe_da_estacao4','sabe_da_cerca_do_mar'],
      registrar:'Estação 4, Rota 21. A cerca do lado do mar é mais baixa.'},
  escolhas:[
    {texto:'"Me vende o que você tem."', vai:'c18_terceira_preco'},
    {texto:'"Quem assina as ordens?"', vai:'c18_terceira_quem_assina'}
  ]
},

c18_terceira_quem_assina:{
  texto:[
    'Ela vai até um arquivo de aço, abre a segunda gaveta e tira uma pasta sanfonada cheia de segundas vias.',
    fala('A Terceira', 'Ordem de compra assinada por Fabre, curador. Sempre ele. Letra pequena, assinatura de quem assina muito.'),
    d=>fala(d.jogador.nome, 'E o pagamento?'),
    fala('A Terceira', 'Transferência do centro de custo 11.'),
    'Ela vira a folha para você.',
    fala('A Terceira', 'Todo mês. Sempre o 11.'),
    'Onze de novo.'
  ],
  ef:{flag:['conhece_o_nome_adnan','centro_de_custo_11'],
      registrar:'As ordens de compra são assinadas pelo Curador Fabre e pagas pelo centro de custo 11.'},
  escolhas:[
    {texto:'"Me vende o que você tem."', vai:'c18_terceira_preco'},
    {texto:'"Me dá uma segunda via."', vai:'c18_terceira_segunda_via'}
  ]
},

c18_terceira_segunda_via:{
  texto:[
    'Ela hesita pela primeira vez desde que você a conheceu.',
    fala('A Terceira', 'Se eu te der uma segunda via e ela aparecer em algum lugar, eu sei de onde saiu e eles também.'),
    'Ela olha para o Ned. O Ned continua não olhando para ninguém.',
    fala('A Terceira', 'Eu te dou uma.'),
    'Ela separa uma folha.',
    fala('A Terceira', 'Uma de dezenove meses atrás, de quando eles ainda erravam. Nessa aqui o campo destinatário está preenchido à mão.'),
    'Você lê o campo. Diz: Estação 4 — via Instituto de Cinnabar.',
    fala('A Terceira', 'Eles não usam mais esse caminho.'),
    fala('A Terceira', 'Então essa aqui não me mata.')
  ],
  ef:{flag:['tem_segunda_via','liga_cinnabar_comissao'], itens:{'Segunda via de ordem de compra':1},
      npc:{nome:'A Terceira', opiniao:2, memoria:'Te deu uma segunda via antiga, calculando exatamente o risco.'},
      registrar:'Segunda via: Estação 4 via Instituto de Cinnabar, de 19 meses atrás.'},
  escolhas:[
    {texto:'"Me vende o resto do que você tem."', vai:'c18_terceira_preco'},
    {texto:'Agradecer e ir ao cartório.', vai:'c18_cartorio'}
  ]
},

c18_terceira_preco:{
  texto:[
    c18_eu('Me vende o que você tem sobre eles.'),
    'Ela ri pelo nariz.',
    fala('A Terceira', 'Eu não tenho o que te vender, porque o que eu tenho é público.'),
    'Ela aponta o teto com o queixo.',
    fala('A Terceira', 'É associação registrada, {garoto|garota}. Estatuto no cartório. Ata no cartório. Eu descobri isso pagando oito pokedólares a página e me senti uma idiota por um mês inteiro.'),
    c18_eu('Você me diria isso de graça?'),
    fala('A Terceira', 'Eu acabei de dizer.'),
    'Ela volta pro cimento.',
    fala('A Terceira', 'Vai no cartório de pessoas jurídicas de Saffron. Pede por denominação. Leva dinheiro trocado, que a máquina deles não funciona.')
  ],
  ef:{flag:'sabe_que_e_publico',
      registrar:'A Terceira mandou você ao cartório: é tudo público.'},
  escolhas:[
    {texto:'Ir ao cartório.', vai:'c18_cartorio'},
    {texto:'"Quem assina as ordens?"', vai:'c18_terceira_quem_assina'}
  ]
},

/* ── Hemeroteca ─────────────────────────────────────────── */
c18_hemeroteca:{
  texto:[
    d=>Historia.jaAconteceu('c18_ab_o_diario_oficial')
      ? 'O Sr. Pell atravessa o corredor do subsolo com você, da sala dos diários pra hemeroteca, contente de ter alguém pra quem abrir a outra porta.'
      : 'A hemeroteca fica no subsolo da biblioteca municipal de Saffron e cheira a papel e a desumidificador.',
    d=>Historia.jaAconteceu('c18_ab_o_diario_oficial')
      ? 'A sala cheira a papel e a desumidificador.'
      : 'O atendente tem uns setenta anos, se chama Sr. Pell, diz o crachá de pano, e fica visivelmente feliz por alguém ter descido.',
    fala('Sr. Pell', 'Jornal de quando?'),
    c18_eu('Desde que a Rocket caiu.'),
    'Ele bate as mãos uma na outra.',
    fala('Sr. Pell', 'Isso é jornal que não acaba mais. {O senhor|A senhora} tem a tarde inteira?'),
    c18_eu('Tenho.'),
    fala('Sr. Pell', 'Então {o senhor|a senhora} vai achar.'),
    'Ele já está puxando as caixas.',
    fala('Sr. Pell', 'Todo mundo que desce aqui acha. O problema é que quase ninguém desce.')
  ],
  ef:{npc:{nome:'Sr. Pell', opiniao:1, viuVoce:'Atendente da hemeroteca. Feliz por alguém ter descido.'},
      registrar:'Começou a varrer jornal velho na hemeroteca de Saffron.'},
  escolhas:[
    {texto:'Procurar por notícia sobre fauna e controle.', vai:'c18_hemero_fauna'},
    {texto:'Procurar nos classificados.', vai:'c18_hemero_classificados'},
    {texto:'Procurar nas publicações legais.', vai:'c18_hemero_legais'},
    {texto:'Procurar nas notas sociais.', vai:'c18_hemero_social'}
  ]
},

c18_hemero_legais:{
  texto:[
    d=>Historia.jaAconteceu('c18_ab_a_secao_certa') || Historia.jaAconteceu('c18_ab_ensina_a_procurar')
      ? 'A seção três sai às quintas, e o índice do semestre remete à página e à coluna.'
      : 'A página de publicações legais é a última do caderno de economia, corpo seis, e ninguém lê.',
    d=>Historia.jaAconteceu('c18_ab_ensina_a_procurar')
      ? 'No índice do semestre não tem nada. No do semestre seguinte, como o Sr. Pell disse, por erro de fechamento, tem.'
      : 'Na quarta caixa, você acha.',
    '**ATA DE ASSEMBLEIA GERAL EXTRAORDINÁRIA — REFORMA DO ESTATUTO E ALTERAÇÃO DE DENOMINAÇÃO — COMISSÃO DE GESTÃO DE RISCO BIOLÓGICO DE KANTO — CGRB**',
    'Um ano e oito meses atrás. O nome é novo, o número de registro não: a associação tem nove anos e trocou de nome e de estatuto na mesma tarde.',
    'Onze assinaturas. Endereço da sede. Objeto social em quatro linhas.',
    'Está ali desde então, num papel que qualquer pessoa em Kanto podia ter lido, na página que ninguém lê.'
  ],
  ef:{flag:['sabe_da_comissao','sabe_do_endereco_704','onze_fundadores','sabe_o_nome_da_comissao'],
      rep:{eixo:'bom',delta:1,motivo:'Achou a Comissão na página que ninguém lê'},
      registrar:'A reforma do estatuto e a troca de nome da CGRB foram publicadas, na página que ninguém lê.'},
  escolhas:[
    {texto:'Pedir cópia dessa página.', vai:'c18_hemero_copia'},
    {texto:'Continuar procurando nos classificados.', vai:'c18_hemero_classificados'},
    {texto:'Ir ao cartório com o nome na mão.', vai:'c18_cartorio'}
  ]
},

c18_hemero_copia:{
  texto:[
    'O Sr. Pell tira a cópia numa máquina antiga que esquenta a folha.',
    fala('Sr. Pell', '{O senhor|A senhora} é {o segundo|a segunda} a pedir essa página.'),
    'Você congela.',
    c18_eu('Quem foi a primeira pessoa?'),
    fala('Sr. Pell', 'Uma doutora, faz uns seis meses. Baixinha, óculos, brava.'),
    'Ele dá de ombros.',
    fala('Sr. Pell', 'Pediu essa e mais três. Voltou três vezes.')
  ],
  ef:{flag:['tem_recorte_constituicao','ivone_esteve_aqui'], itens:{'Recorte da ata da CGRB':1},
      registrar:'A Dra. Cordell pediu a mesma página seis meses antes de você.'},
  escolhas:[
    {texto:'"Ela pediu mais o quê?"', vai:'c18_hemero_o_que_ela_pediu'},
    {texto:'Continuar procurando sozinh{o|a}.', vai:'c18_hemero_classificados'},
    {texto:'Ir falar com a Dra. Cordell.', vai:'c18_ivone', cond:d=>!!d.flags.cartao_ivone},
    {texto:'Ir ao cartório.', vai:'c18_cartorio'}
  ]
},

c18_hemero_o_que_ela_pediu:{
  texto:[
    'O Sr. Pell tem um caderno de pedidos, porque é de uma geração que anota.',
    'Ele acha a página e vira pra você.',
    'Quatro recortes: a ata da reforma da CGRB; uma nota de falecimento; um anúncio de vaga pra técnico de viveiro; e uma reportagem de meia página sobre a reintrodução de Rattata em área urbana de Celadon, assinada por Livia Gale.',
    c18_eu('A nota de falecimento é de quem?'),
    'Ele confere.',
    fala('Sr. Pell', 'Harold Colman. Cinquenta e nove anos. Faz dois anos.'),
    'Colman.'
  ],
  ef:{flag:['sabe_do_helio','contato_isaura'], instabilidade:1,
      registrar:'Harold Colman morreu quatro meses antes da reforma que fez a CGRB. A presidente se chama Hester Colman.'},
  escolhas:[
    {texto:'Pedir a nota de falecimento.', vai:'c18_hemero_falecimento'},
    {texto:'Pedir o anúncio de vaga.', vai:'c18_hemero_classificados'},
    {texto:'Ir ao cartório.', vai:'c18_cartorio'}
  ]
},

c18_hemero_falecimento:{
  texto:[
    'A nota é de três linhas, paga, no formato mais barato.',
    '**HAROLD COLMAN, 59. Falecido em decorrência de ferimentos. Deixa esposa. Vigília de sétimo dia na Torre de Lavender.**',
    'Em decorrência de ferimentos.',
    'Você vira a página e, na coluna do lado, na mesma edição, tem uma nota de duas linhas sobre um homem ferido por um bando de Mankey num parque público de Saffron.',
    'A nota não dá o nome do homem. Não precisava.'
  ],
  ef:{flag:['sabe_como_helio_morreu','entende_a_presidente'], instabilidade:1,
      registrar:'O marido da presidente morreu ferido por um bando de Mankey num parque público de Saffron.'},
  escolhas:[
    {texto:'Copiar as duas notas.', vai:'c18_hemero_copiou_as_duas'},
    {texto:'Fechar a caixa e ir ao cartório.', vai:'c18_cartorio'},
    {texto:'Procurar o anúncio de vaga.', vai:'c18_hemero_classificados'}
  ]
},

c18_hemero_copiou_as_duas:{
  texto:[
    'Você copia as duas notas e as guarda na mesma dobra do caderno, uma em cima da outra.',
    'Elas não vão te servir de prova de nada. Não é prova o que você tem na mão.',
    'É o motivo.',
    'E motivo é uma coisa mais perigosa de carregar que prova, porque prova você mostra e motivo você entende.'
  ],
  ef:{flag:'tem_as_duas_notas', itens:{'Duas notas de jornal':1},
      registrar:'Guardou a nota de falecimento e a nota do ataque no parque.'},
  escolhas:[
    {texto:'Ir ao cartório.', vai:'c18_cartorio'},
    {texto:'Procurar o anúncio de vaga.', vai:'c18_hemero_classificados'}
  ]
},

c18_hemero_classificados:{
  texto:[
    'Nos classificados, na coluna de empregos, repetido quatorze vezes ao longo de um ano:',
    '**PRECISA-SE: técnico de viveiro. Experiência comprovada em manejo de fauna. Exige-se registro em conselho profissional. Não aceitamos currículo sem referência. Caixa Postal 11.**',
    'Caixa Postal 11.',
    d=>d.flags.sabe_do_andar_11 || d.flags.centro_de_custo_11
      ? 'Onze de novo. Você já viu esse número em outro lugar, e não gostou dele lá.'
      : 'Um anúncio que se repete quatorze vezes num ano é uma vaga que ninguém aguenta ocupar, ou uma vaga que nunca fecha.'
  ],
  ef:{flag:['viu_o_anuncio_de_vaga','caixa_postal_11'],
      registrar:'A CGRB recruta por classificado, com exigência de registro profissional, pela Caixa Postal 11.'},
  escolhas:[
    {texto:'Procurar nas publicações legais.', vai:'c18_hemero_legais'},
    {texto:'Responder ao anúncio.', vai:'c18_respondeu_anuncio'},
    {texto:'Ir ao cartório.', vai:'c18_cartorio'}
  ]
},

c18_respondeu_anuncio:{
  texto:[
    'Você escreve uma carta de próprio punho e manda pra Caixa Postal 11, sem mentir em nada: seu nome, o que você faz, quantos meses de estrada.',
    'A resposta chega em quatro dias, num envelope comum, com timbre discreto.',
    '**Prezado(a): agradecemos o interesse. Sua candidatura não se enquadra na vaga anunciada. Entretanto, gostaríamos de conversar.**',
    'Embaixo, à mão, numa letra pequena de quem assina muito: Curador Fabre. E um telefone.'
  ],
  ef:{flag:['conhece_o_nome_adnan','adnan_quer_conversar'],
      registrar:'Respondeu ao anúncio e recebeu um convite manuscrito do Curador Fabre.',
      executar:()=>{ Relogio.viver(4 * 24); return []; }},
  escolhas:[
    {texto:'Ligar.', vai:'c18_adnan', ef:{flag:'c18_fabre_telefone'}},
    {texto:'Não ligar. Ir ao cartório primeiro.', vai:'c18_cartorio'}
  ]
},

c18_hemero_fauna:{
  texto:[
    'Você procura por fauna, controle, ataque, manejo, e acha mais do que esperava e menos do que queria.',
    'Vinte e dois registros de ataque de Pokémon a pessoa em área urbana em dezoito meses. Três mortes.',
    'Nenhum deles vira reportagem. Todos são nota de canto, três linhas, sem nome.',
    'E em nenhum lugar, em dezoito meses de jornal, existe uma linha sobre o que a Liga fez a respeito.',
    'Você começa a entender uma coisa que não queria entender: alguém contou essas notinhas antes de você.'
  ],
  ef:{flag:'contou_as_notas_de_ataque', instabilidade:1,
      registrar:'22 ataques de fauna a pessoas em área urbana em 18 meses, 3 mortes. Nenhuma reportagem.'},
  escolhas:[
    {texto:'Procurar nas publicações legais.', vai:'c18_hemero_legais'},
    {texto:'Procurar nos classificados.', vai:'c18_hemero_classificados'},
    {texto:'Ir à Liga com essa conta.', vai:'c18_liga'}
  ]
},

c18_hemero_social:{
  texto:[
    'As notas sociais são inúteis pra tudo, menos pra uma coisa: elas publicam foto.',
    'Numa coluna sobre um jantar beneficente de uma clínica de Pokémon, você acha uma mesa de oito pessoas com legenda completa.',
    d=>c18_sabeDosOnze(d) || d.flags.viu_os_onze_fundadores
      ? 'Quatro dos nomes da legenda estão na lista dos onze.'
      : 'Você anota os oito nomes da legenda, por anotar.',
    'Na foto, todos estão rindo. Uma mulher de tailleur cinza está olhando pro lado, pra fora do quadro, com a cara de quem está calculando o custo por cabeça do jantar.'
  ],
  ef:{flag:'viu_a_foto_do_jantar', itens:{'Recorte com foto do jantar':1},
      registrar:'Achou uma foto de um jantar beneficente com gente do conselho da CGRB na mesa.'},
  escolhas:[
    {texto:'Procurar nas publicações legais.', vai:'c18_hemero_legais'},
    {texto:'Procurar nos classificados.', vai:'c18_hemero_classificados'},
    {texto:'Ir ao cartório.', vai:'c18_cartorio'}
  ]
},

/* ── Liga ───────────────────────────────────────────────── */
c18_liga:{
  texto:[
    'A sede regional da Liga em Saffron atende das nove às três, com uma hora de almoço que na prática é uma e meia.',
    'Você faz o pedido de informação no balcão, por escrito, no formulário certo, e a atendente protocola com carimbo e devolve a segunda via.',
    'Protocolo 4.881. Prazo de resposta: trinta dias.',
    c18_eu('Trinta dias?'),
    fala('a atendente da Liga', 'Trinta dias.'),
    'Ela já está olhando o próximo da fila.',
    fala('a atendente da Liga', 'Se {o senhor|a senhora} quiser, pode perguntar informalmente ao setor técnico, no terceiro andar. Informalmente eles falam hoje. Formalmente é trinta dias.')
  ],
  ef:{flag:'protocolou_na_liga',
      registrar:'Protocolou pedido de informação na Liga. Protocolo 4.881, prazo de 30 dias.',
      executar:d=>{ const h = c18_hora(d); if (h >= 15) Relogio.amanhaAs(9); else if (h < 9) c18_ate(9, true); return []; }},
  escolhas:[
    {texto:'Subir ao terceiro andar e perguntar informalmente.', vai:'c18_liga_tecnico'},
    {texto:'Esperar os trinta dias.', vai:'c18_liga_esperou'},
    {texto:'Desistir e ir ao cartório.', vai:'c18_cartorio'}
  ]
},

c18_liga_tecnico:{
  texto:[
    'O setor técnico é uma sala com quatro mesas e três pessoas, uma delas comendo um sanduíche por cima de um relatório.',
    'Você diz a palavra comissão e as três param.',
    fala('Técnica da Liga', 'CGRB.'),
    'Quem diz é a do sanduíche, sem levantar os olhos.',
    fala('Técnica da Liga', 'É o que {o senhor|a senhora} quer saber.'),
    c18_eu('É.'),
    fala('Técnica da Liga', 'A gente tem convênio com eles.'),
    'Ela dobra o papel do sanduíche.',
    fala('Técnica da Liga', 'Está publicado. Convênio de cooperação técnica, assinado pela diretoria anterior, renovado automaticamente.'),
    'Ela finalmente olha pra você.',
    fala('Técnica da Liga', 'Eu sou contra. Eu sou uma pessoa, e eles são um convênio.')
  ],
  ef:{flag:['sabe_do_convenio','sabe_da_comissao','sabe_o_nome_da_comissao'], instabilidade:1,
      npc:{nome:'Técnica da Liga', opiniao:1, memoria:'Te contou do convênio e disse que é contra ele.'},
      registrar:'A Liga tem convênio de cooperação técnica com a CGRB, renovado automaticamente.'},
  escolhas:[
    {texto:'"Me dá uma cópia do convênio."', vai:'c18_liga_copia_convenio'},
    {texto:'"Por que a senhora é contra?"', vai:'c18_liga_porque_contra'},
    {texto:'"Quem assinou?"', vai:'c18_liga_quem_assinou'},
    {texto:'Sair e ir ao cartório.', vai:'c18_cartorio'}
  ]
},

c18_liga_porque_contra:{
  texto:[
    fala('Técnica da Liga', 'Porque eles resolvem.'),
    'Ela vê a sua cara e levanta a mão antes que você fale.',
    fala('Técnica da Liga', 'Eu sei como soa. Escuta.'),
    'Ela empurra o relatório para o seu lado da mesa.',
    fala('Técnica da Liga', 'Trinta e um chamados de ataque em área urbana no último ano. A Liga atendeu nove. A CGRB atendeu vinte e dois, de graça, em média em quatro horas, com relatório.'),
    d=>fala(d.jogador.nome, 'E daí que eles resolvem?'),
    fala('Técnica da Liga', 'E daí que daqui a três anos ninguém vai ligar para a Liga.'),
    'Ela pega o relatório de volta.',
    fala('Técnica da Liga', 'E aí eles não vão precisar mais pedir licença para nada, porque licença é uma coisa que se pede a quem tem trabalho, e a gente não vai mais ter.')
  ],
  ef:{flag:'entendeu_o_convenio', instabilidade:1,
      registrar:'A CGRB atendeu 22 dos 31 chamados de ataque urbano no último ano. A Liga atendeu 9.'},
  escolhas:[
    {texto:'"Me dá uma cópia do convênio."', vai:'c18_liga_copia_convenio'},
    {texto:'"Quem assinou?"', vai:'c18_liga_quem_assinou'},
    {texto:'Ir ao cartório.', vai:'c18_cartorio'}
  ]
},

c18_liga_quem_assinou:{
  texto:[
    fala('Técnica da Liga', 'A diretoria anterior.'),
    'Ela diz isso com um cuidado que não passa despercebido.',
    fala('Técnica da Liga', 'A diretora de fiscalização assinou pela Liga. Hester Colman. Nove anos no cargo.'),
    c18_eu('E ela está onde hoje?'),
    'A técnica olha pras outras duas mesas. Ninguém levanta a cabeça.',
    fala('Técnica da Liga', 'Ela pediu demissão quatro meses depois e foi presidir a outra ponta do convênio.'),
    'Você fica um tempo processando isso.',
    'A mesma pessoa assinou dos dois lados, com quatro meses de intervalo, e não é crime.'
  ],
  ef:{flag:['sabe_o_nome_da_presidente','presidente_saiu_brigada'], instabilidade:1,
      registrar:'Hester Colman assinou o convênio pela Liga e quatro meses depois foi presidir a CGRB.'},
  escolhas:[
    {texto:'"Me dá uma cópia do convênio."', vai:'c18_liga_copia_convenio'},
    {texto:'Ir ao cartório.', vai:'c18_cartorio'}
  ]
},

c18_liga_copia_convenio:{
  texto:[
    'Ela tira a cópia ela mesma, na máquina do corredor, e volta com onze páginas ainda quentes.',
    fala('Técnica da Liga', 'Isso é público, então eu não estou fazendo nada.'),
    'Ela entrega e segura sua mão por um segundo em cima do papel.',
    fala('Técnica da Liga', 'Cláusula sexta. Lê a cláusula sexta hoje, não amanhã.'),
    'A cláusula sexta diz que a Liga se compromete a não duplicar esforço em áreas objeto de plano de manejo apresentado pela Comissão.',
    'Não duplicar esforço. É assim que se escreve sair de perto.'
  ],
  ef:{flag:'tem_o_convenio', itens:{'Cópia do convênio Liga–CGRB':1},
      rep:{eixo:'bom',delta:1,motivo:'Saiu da Liga com o convênio na mão'},
      registrar:'Cláusula sexta: a Liga se compromete a não duplicar esforço onde a CGRB apresentar plano de manejo.'},
  escolhas:[
    {texto:'Ir ao cartório buscar o resto.', vai:'c18_cartorio'},
    {texto:'Ir à hemeroteca ver o que saiu em jornal.', vai:'c18_hemeroteca'}
  ]
},

c18_liga_esperou:{
  texto:[
    'Você espera os trinta dias, porque decidiu fazer do jeito certo.',
    'No vigésimo oitavo dia chega um envelope pardo com o brasão da Liga.',
    '**Resposta ao protocolo 4.881: informamos que a entidade mencionada é pessoa jurídica de direito privado, não integrante da estrutura da Liga, cujos atos constitutivos encontram-se disponíveis no registro competente.**',
    'Traduzido: procura no cartório, como qualquer pessoa.',
    'Vinte e oito dias pra te mandarem ao lugar certo. E o pior é que é o lugar certo.'
  ],
  ef:{flag:'resposta_da_liga', itens:{'Resposta oficial da Liga':1},
      registrar:'A Liga levou 28 dias para dizer que a CGRB é privada e está no cartório.',
      executar:()=>{ Relogio.viver(28 * 24); return []; }},
  escolhas:[
    {texto:'Ir ao cartório.', vai:'c18_cartorio'},
    {texto:'Voltar à Liga e falar com o setor técnico.', vai:'c18_liga_tecnico'}
  ]
},

/* ── A leitura ──────────────────────────────────────────── */
c18_leitura:{
  texto:[
    d=>d.flags.c18_leu_de_dia
      ? 'Você começa de dia, no quarto do Centro Pokémon, com um lápis, porque caneta você já sabe que não presta pra ler documento. Quando levanta os olhos, já precisa da luminária de cabeceira.'
      : 'Você lê num quarto de Centro Pokémon, com a luminária de cabeceira e um lápis, porque caneta você já sabe que não presta pra ler documento.',
    'Cento e quarenta páginas.',
    'Não tem código. Não tem cifra. Não tem uma linha escrita em linguagem de crime.',
    'Tem pauta, deliberação, voto, quórum, justificativa de ausência e assinatura do secretário.',
    'É chato. É de uma chatice tão completa que leva quase uma hora pra você entender que a chatice é o método.'
  ],
  ef:{flag:'comecou_a_ler', registrar:'Começou a ler as 140 páginas.',
      executar:d=>{
        const h = c18_hora(d);
        d.flags.c18_leu_de_dia = h >= 6 && h < 17;
        if (h >= 6 && h < 21) c18_ate(21, true);
        return [];
      }},
  escolhas:[
    {texto:'Ler o estatuto primeiro. Saber o que eles dizem que são.', vai:'c18_estatuto'},
    {texto:'Ir direto às atas de reunião. Saber o que eles fizeram.', vai:'c18_atas'},
    {texto:'Ler os anexos. O dinheiro está sempre nos anexos.', vai:'c18_anexos'},
    {texto:'Procurar por um nome específico no índice.', vai:'c18_procurar_nome'}
  ]
},

c18_estatuto:{
  texto:[
    'Dezoito páginas, cinco capítulos, quarenta e um artigos.',
    d=>c18_leuEstatutoVelho(d)
      ? 'Você já leu um estatuto deles, no mato da Rota 25, com a mão tremendo de frio. Não é este. No rodapé de cada página: redação dada pela reforma de um ano e oito meses atrás.'
      : '',
    '**' + COMISSAO.estatuto[0] + '**',
    'Você lê isso três vezes. Mitigação de risco biológico regional não gerenciado.',
    'Cada palavra dessa frase é uma palavra que você usaria. Juntas, elas são outra coisa.',
    '**' + COMISSAO.estatuto[1] + '**',
    'Densidade, agressividade ou capacidade destrutiva não sujeita a controle institucional.',
    'Você pensa no primeiro mato em que entrou sozinh{o|a}, com {idade-3} anos, e entende que ele caberia inteiro nessa frase.'
  ],
  ef:{flag:['leu_o_estatuto','entendeu_a_comissao'], instabilidade:1,
      registrar:'Art. 1º e Art. 4º: risco não gerenciado é toda população fora de controle institucional.'},
  escolhas:[
    {texto:'Continuar no Art. 4º, §2º.', vai:'c18_art4_2'},
    {texto:'Pular para o Art. 11.', vai:'c18_art11'},
    {texto:'Pular para o Art. 19, na página nove.', vai:'c18_art19'},
    {texto:'Fechar e ir para as atas.', vai:'c18_atas', cond:d=>!!d.flags.tem_as_atas},
    ...c18_semAsAtas()
  ]
},

c18_art4_2:{
  texto:[
    '**' + COMISSAO.estatuto[2] + '**',
    'Para todos os efeitos.',
    d=>{
      const n = c18_lendariosVistos(d);
      if (!n) return 'Você nunca esteve na frente de um deles. E mesmo assim eles já estão numerados.';
      if (n === 1) return 'Você já esteve na frente de um deles. Você já teve um olhando pra você de um jeito que você não vai conseguir explicar pra ninguém pelo resto da vida.';
      return 'Você já esteve na frente de mais de um deles. Você já teve um olhando pra você de um jeito que você não vai conseguir explicar pra ninguém pelo resto da vida.';
    },
    d=>Historia.jaAconteceu('c18_cartorio')
      ? 'E aqui está: um parágrafo segundo, num artigo quarto, num estatuto de dezoito páginas, arquivado num cartório de quarto andar, ao lado de uma escola de datilografia.'
      : 'E aqui está: um parágrafo segundo, num artigo quarto, num estatuto de dezoito páginas que qualquer pessoa compra num cartório de Saffron.'
  ],
  ef:{flag:'sabe_do_paragrafo_segundo', instabilidade:2,
      registrar:'Art. 4º, §2º: lendários entram na definição de risco não gerenciado.'},
  escolhas:[
    {texto:'Ler o Art. 11.', vai:'c18_art11'},
    {texto:'Ir para o Art. 19.', vai:'c18_art19'},
    {texto:'Fechar o estatuto.', vai:'c18_fechou_estatuto', cond:d=>!!d.flags.tem_as_atas},
    ...c18_semAsAtas()
  ]
},

c18_art11:{
  texto:[
    '**' + COMISSAO.estatuto[3] + '**',
    'Substituição gradual de populações de risco por populações de comportamento previsível.',
    'Reversível, auditável e de menor custo social.',
    'Você fica um tempo com essa expressão: menor custo social.',
    'Custo social é uma medida do quanto dói nas pessoas. Não do quanto dói.',
    'Eles escolheram o método que machuca menos gente. Não o que machuca menos.'
  ],
  ef:{flag:'entendeu_o_art11', instabilidade:1,
      registrar:'Art. 11: substituição gradual de populações, por ser reversível, auditável e de menor custo social.'},
  escolhas:[
    {texto:'Ir para o Art. 19.', vai:'c18_art19'},
    {texto:'Ler o Art. 4º, §2º.', vai:'c18_art4_2'},
    {texto:'Ir para as atas.', vai:'c18_atas', cond:d=>!!d.flags.tem_as_atas},
    ...c18_semAsAtas()
  ]
},

c18_art19:{
  texto:[
    'Página nove.',
    '**' + COMISSAO.estatuto[4] + '**',
    d=>c18_leuEstatutoVelho(d)
      ? 'O Art. 19 que você leu no mato da Rota 25 dizia que não há prazo para a deliberação final. A deliberação final, agora, tem nome.'
      : '',
    'Descarte.',
    d=>d.flags.livro_de_destinos
      ? 'A mesma palavra que estava nas últimas três páginas do livro de destinos de Celadon, com uma data ao lado de cada linha.'
      : 'Uma palavra de almoxarifado. A palavra que se usa pra material de escritório vencido.',
    d=>d.flags.tem_as_atas
      ? 'Você fica olhando essa página por muito tempo. A luminária esquenta o papel. Em algum lugar do corredor alguém ri de alguma coisa.'
      : 'Você fica olhando essa página por muito tempo, encostad{o|a} no poste. Passa um ônibus, passa outro.'
  ],
  ef:{flag:['leu_as_atas','sabe_do_art19','entendeu_a_comissao'], instabilidade:2,
      registrar:'Art. 19: descarte de unidades que não atingem parâmetros de viabilidade.'},
  escolhas:[
    {texto:'Procurar o regulamento interno nos anexos.', vai:'c18_regulamento', cond:d=>!!d.flags.tem_as_atas},
    {texto:'Continuar para as atas de reunião.', vai:'c18_atas', cond:d=>!!d.flags.tem_as_atas},
    {texto:'Fechar tudo e parar por hoje.', vai:'c18_fechou_estatuto', cond:d=>!!d.flags.tem_as_atas},
    ...c18_semAsAtas()
  ]
},

c18_regulamento:{
  texto:[
    'O regulamento interno é o Anexo III, seis páginas, e é o documento mais bem escrito do calhamaço.',
    'Ele define parâmetro de viabilidade em quatro critérios objetivos, exige parecer de médico de Pokémon registrado, exige dupla assinatura e exige formulário individual numerado.',
    'Exige também — e isso te faz parar — que o formulário registre a data, a hora e o método, e que seja arquivado por dez anos.',
    'Eles guardam por dez anos o papel de cada Pokémon que mataram.',
    'Não por medo. Por método.'
  ],
  ef:{flag:'leu_o_regulamento', instabilidade:1,
      registrar:'Anexo III: cada descarte tem formulário numerado, dupla assinatura e arquivo por dez anos.'},
  escolhas:[
    {texto:'Procurar quantos formulários já existem.', vai:'c18_quantos_formularios'},
    {texto:'Ir para as atas.', vai:'c18_atas'},
    {texto:'Ir para os anexos de orçamento.', vai:'c18_anexos'}
  ]
},

c18_quantos_formularios:{
  texto:[
    'Está num quadro de controle, na última página do Anexo III, atualizado à mão e depois datilografado.',
    'Formulários emitidos no exercício: 419.',
    'Quatrocentos e dezenove.',
    'Você passa o dedo pelo número como se ele pudesse estar errado por causa de uma mancha de tinta.'
  ],
  ef:{flag:'sabe_dos_419', instabilidade:2,
      registrar:'419 formulários de descarte emitidos no exercício.'},
  escolhas:[
    {texto:'Ir para as atas.', vai:'c18_atas'},
    {texto:'Fechar tudo.', vai:'c18_fechou_estatuto'}
  ]
},

c18_fechou_estatuto:{
  texto:[
    'Você fecha o calhamaço, apaga a luminária e fica deitad{o|a} olhando o teto do quarto do Centro Pokémon.',
    d=>d.flags.leu_o_regulamento
      ? 'Lá fora tem uma cidade inteira dormindo, e ninguém nela sabe que existe um documento de dezoito páginas e um anexo de seis que decidem, com quatro critérios objetivos, o que vale a pena continuar vivo.'
      : d.flags.sabe_do_art19
        ? 'Lá fora tem uma cidade inteira dormindo, e ninguém nela sabe que existe um documento de dezoito páginas que decide, num artigo de duas linhas, o que vale a pena continuar vivo.'
        : 'Lá fora tem uma cidade inteira dormindo, e ninguém nela sabe que existe um documento de dezoito páginas que põe, num parágrafo segundo, até o que é lendário na conta do risco.',
    'E o documento está num cartório, e custa um pokedólar a página.',
    'Você acende a luminária de novo.'
  ],
  ef:{instabilidade:1},
  escolhas:[
    {texto:'Ler as atas de reunião.', vai:'c18_atas'},
    {texto:'Ler os anexos.', vai:'c18_anexos'},
    {texto:'Dormir. Amanhã tem mais.', vai:'c18_a_manha', ef:{flag:'c18_dormiu'}}
  ]
},

c18_atas:{
  texto:[
    'Trinta e quatro atas. Todas no mesmo formato, todas assinadas pelo mesmo secretário, todas com o quórum anotado no alto.',
    'Você começa pela primeira e desiste na sexta, porque as seis primeiras são sobre mudar a sede pra sala 704 e trocar o nome na conta do banco.',
    'Então você faz o que se faz com documento: procura pelas palavras.',
    'Você procura fase. Procura unidade. Procura descarte. Procura risco.'
  ],
  ef:{registrar:'Passou a ler as atas procurando palavras em vez de ler em ordem.'},
  escolhas:[
    {texto:'Procurar fase.', vai:'c18_31a'},
    {texto:'Procurar risco.', vai:'c18_34a'},
    {texto:'Procurar voto vencido.', vai:'c18_voto_vencido'},
    {texto:'Procurar o seu próprio nome.', vai:'c18_seu_nome_nas_atas'}
  ]
},

c18_31a:{
  texto:[
    'Página 103. Ata da 31ª reunião ordinária.',
    '**Deliberação 4: aprovada, por dez votos a um, a Fase II do programa de substituição populacional na Rota 21, com meta de liberação de 400 unidades no primeiro semestre.**',
    'Quatrocentas unidades.',
    'Liberação em ambiente aberto de quatrocentos Pokémon criados pra serem previsíveis, num trecho de litoral de doze quilômetros onde hoje mora outra coisa.',
    'A ata não diz o que acontece com a outra coisa. A ata não precisa dizer: está no Art. 11.'
  ],
  ef:{flag:['sabe_da_fase2','sabe_da_rota21'], instabilidade:2,
      registrar:'Fase II: liberar 400 unidades na Rota 21 no primeiro semestre.'},
  escolhas:[
    {texto:'Procurar o voto vencido dessa deliberação.', vai:'c18_voto_vencido'},
    {texto:'Procurar risco.', vai:'c18_34a'},
    {texto:'Procurar onde é a Rota 21 no anexo de campo.', vai:'c18_anexo_campo'}
  ]
},

c18_voto_vencido:{
  texto:[
    'Está logo abaixo da deliberação, em corpo menor, porque voto vencido se registra mas não se destaca.',
    '**Voto em separado do Curador Fabre: manifesta preocupação com a irreversibilidade da liberação em ambiente aberto, uma vez que o Art. 11 fundamenta o método na reversibilidade, e a liberação em campo não é reversível. Requer que conste em ata. Voto vencido, 10 a 1.**',
    'Dez a um.',
    d=>d.flags.sabe_do_adnan
      ? 'Fabre. O curador do S.S. Anne, o que disse que pensa nisso. Ele pensa por escrito, e perde.'
      : 'Tem uma pessoa lá dentro que leu o próprio estatuto com atenção e perdeu.',
    'Você marca a página com o dedo e fica um tempo assim, com o dedo na página.'
  ],
  ef:{flag:['conhece_o_nome_adnan','sabe_do_voto_vencido'],
      registrar:'O Curador Fabre votou contra a Fase II e perdeu por 10 a 1.'},
  escolhas:[
    {texto:'Procurar outros votos dele.', vai:'c18_outros_votos_adnan'},
    {texto:'Procurar risco.', vai:'c18_34a'},
    {texto:'Procurar o nome dele no quadro de pessoal.', vai:'c18_anexo_pessoal'}
  ]
},

c18_outros_votos_adnan:{
  texto:[
    'Ele tem sete votos vencidos em trinta e quatro atas, e você lê os sete.',
    'Contra a ampliação da meta. Contra a redução do prazo de observação. Contra a dispensa de parecer médico em lote. Contra a compra de uma incubadora mais barata.',
    'E um, na 28ª, que não é contra nada: requer que conste em ata que o curador solicitou, pela terceira vez, a revisão dos critérios do Art. 19.',
    'Pela terceira vez.',
    'Você fecha o bloco. Existe um homem que pediu três vezes, perdeu três vezes e continuou indo às reuniões.'
  ],
  ef:{flag:'entende_o_adnan',
      registrar:'Fabre pediu três vezes a revisão dos critérios do Art. 19 e perdeu as três.'},
  escolhas:[
    {texto:'Procurar risco.', vai:'c18_34a'},
    {texto:'Procurar o nome dele no quadro de pessoal.', vai:'c18_anexo_pessoal'},
    {texto:'Fechar as atas.', vai:'c18_a_manha'}
  ]
},

c18_34a:{
  texto:[
    'Página 118. Ata da 34ª, a mais recente.',
    '**Comunicação da Presidência: o indivíduo classificado como Risco 01 permanece não localizado. Reitera-se que a Fase III depende de material da matriz original.**',
    'Risco 01.',
    d=>c18_sabeDoUm(d)
      ? (d.flags.leu_caderno
        ? 'Você sabe quem é. É o que conversava com o Dr. Fuji e achava que eram conversas.'
        : 'Você sabe quem é. É o original do andar 11, o que respondia.')
      : 'A ata não diz o que é. Diz que não acharam e que precisam achar.',
    d=>c18_sabeDoUm(d)
      ? 'Eles numeraram. Ele não é o monstro deles, não é o inimigo deles, não é a obsessão deles. Ele é o item número um de uma lista, e listas têm item número dois.'
      : 'É o item número um de uma lista, e listas têm item número dois.',
    d=>d.flags.viu_os_doze ? 'E matriz é a palavra da plaqueta do décimo segundo tanque do andar 11: MATRIZ — VAGO.' : ''
  ],
  ef:{flag:['sabe_do_risco01','sabe_da_fase3'], instabilidade:2,
      registrar:'Risco 01 não localizado. A Fase III depende de material da matriz original.'},
  escolhas:[
    {texto:'Procurar o item número dois.', vai:'c18_risco_02'},
    {texto:'Procurar o que é matriz original.', vai:'c18_matriz_original'},
    {texto:'Procurar fase.', vai:'c18_31a'}
  ]
},

c18_risco_02:{
  texto:[
    'Está no Anexo I, numa tabela de duas colunas, sem nenhum destaque.',
    'Risco 01 — indivíduo único, origem laboratorial, não localizado.',
    'Risco 02 — colônia insular, Seafoam, população estimada 1 a 3.',
    'Risco 03 — indivíduo migratório, avistamentos esparsos, não confirmado.',
    'Risco 04 — ninho subterrâneo, Rota 23, acesso restrito.',
    d=>{
      const n = c18_lendariosVistos(d);
      if (!n) return 'A lista continua até o Risco 09, cada linha com um número e uma localização, e nenhuma com nome.';
      return n === 1
        ? 'A lista continua até o Risco 09, e uma das linhas descreve uma coisa que você já viu com os próprios olhos.'
        : 'A lista continua até o Risco 09, e mais de uma linha descreve uma coisa que você já viu com os próprios olhos.';
    }
  ],
  ef:{flag:['viu_a_lista_de_riscos','sabe_da_lista_09'], instabilidade:2,
      registrar:'Anexo I: nove riscos numerados, com número e localização.'},
  escolhas:[
    {texto:'Copiar a tabela inteira no seu caderno.', vai:'c18_copiou_a_tabela'},
    {texto:'Procurar o que é matriz original.', vai:'c18_matriz_original'},
    {texto:'Fechar. Você já leu demais por hoje.', vai:'c18_a_manha'}
  ]
},

c18_copiou_a_tabela:{
  texto:[
    'Você copia os nove, com as colunas, do jeito que está.',
    d=>c18_lendariosVistos(d)
      ? 'E, sem pensar direito, escreve ao lado de cada um que você reconhece o nome que você usa.'
      : 'Você não reconhece nenhum. Copia assim mesmo, com uma terceira coluna em branco do lado, esperando nome.',
    'Quando termina, olha pras colunas: a deles e a sua.',
    'A deles diz colônia insular, população estimada 1 a 3.',
    d=>c18_lendariosVistos(d)
      ? 'A sua, onde tem alguma coisa escrita, diz o nome de um Pokémon.'
      : 'A sua não diz nada ainda. Mas está ali, do lado, do mesmo tamanho.'
  ],
  ef:{flag:'tem_a_lista_copiada', itens:{'Cópia da tabela de riscos':1}, instabilidade:1,
      rep:{eixo:'bom',delta:1,motivo:'Copiou a tabela deles com espaço pro nome ao lado do número'},
      registrar:'Copiou a tabela dos nove riscos, com uma coluna pro nome de cada um.'},
  escolhas:[
    {texto:'Procurar o que é matriz original.', vai:'c18_matriz_original'},
    {texto:'Fechar e dormir.', vai:'c18_a_manha', ef:{flag:'c18_dormiu'}}
  ]
},

c18_matriz_original:{
  texto:[
    'A expressão aparece quatro vezes e nunca é definida, o que num documento tão cuidadoso só pode ser de propósito.',
    'Na quarta vez, num anexo de patrimônio, tem uma linha:',
    '**Item 44 — acervo documental e material biológico conservado, proveniente do Instituto de Cinnabar, recebido por doação, em depósito no Armazém Geral 7, alvará 3.318.**',
    'Armazém Geral 7. Alvará 3.318.',
    d=>d.flags.dentro_do_deposito
      ? 'Você já entrou nesse armazém.'
      : (d.flags.viu_o_alvara || d.flags.chegou_no_armazem)
        ? 'Você já esteve na calçada desse armazém, de frente pra placa de esmalte.'
        : d.flags.ligou_fuchsia_celadon
          ? 'O mesmo alvará do receptor credenciado da Zona Safári.'
          : 'Você anota o endereço com a letra mais firme que consegue.'
  ],
  ef:{flag:['sabe_da_matriz','liga_cinnabar_comissao'], instabilidade:2,
      registrar:'A matriz original está no Armazém Geral 7, alvará 3.318, vinda do Instituto de Cinnabar.'},
  escolhas:[
    {texto:'Procurar o inventário completo do Item 44.', vai:'c18_item_44'},
    {texto:'Fechar e dormir.', vai:'c18_a_manha', ef:{flag:'c18_dormiu'}},
    {texto:'Ler os anexos de orçamento.', vai:'c18_anexos'}
  ]
},

c18_item_44:{
  texto:[
    'O inventário do Item 44 é uma lista de trinta e uma linhas, e trinta delas são caixas de papel.',
    'A trigésima primeira diz: 1 (um) recipiente criogênico, conteúdo conforme laudo anexo, laudo não localizado.',
    'Laudo não localizado.',
    'Alguém, num anexo de patrimônio de uma associação civil, registrou com toda a honestidade do mundo que tem um tanque congelado cujo conteúdo ninguém sabe.',
    'E registrou porque o regulamento manda registrar.'
  ],
  ef:{flag:'sabe_do_recipiente', instabilidade:2,
      registrar:'Item 44: um recipiente criogênico com laudo não localizado.'},
  escolhas:[
    {texto:'Fechar tudo.', vai:'c18_a_manha'},
    {texto:'Ler os anexos de orçamento.', vai:'c18_anexos'}
  ]
},

c18_seu_nome_nas_atas:{
  texto:[
    'Você procura o seu próprio nome, se sentindo ridícul{o|a}, e acha.',
    'Três vezes.',
    '**22ª: deliberação sobre a conveniência de abordagem do indivíduo citado. Rejeitada, 7 a 4.**',
    '**29ª: comunicação da Auditoria de Campo sobre interferência em operação. Sem deliberação.**',
    d=>c18_interferiu(d) ? '' : 'Você repassa a estrada de cabeça atrás de que operação seria, e não acha nenhuma. Alguém achou.',
    '**33ª: inclusão do indivíduo em acompanhamento de risco reputacional. Aprovada, 9 a 2, com voto contrário da Presidência.**',
    'Com voto contrário da Presidência.',
    'A pessoa que preside votou contra te vigiarem e perdeu.',
    d=>c18_bolsista(d)
      ? 'E uma quarta vez, sem número de ata, num anexo: a lista de bolsistas do acompanhamento de espécimes, com o seu nome e, do lado, o valor que cai na sua conta todo mês.'
      : ''
  ],
  ef:{flag:['voce_esta_nas_atas','presidente_te_defende'], instabilidade:1,
      registrar:'Você aparece em três atas. A presidente votou contra te colocarem em acompanhamento.'},
  escolhas:[
    {texto:'Procurar fase.', vai:'c18_31a'},
    {texto:'Procurar risco.', vai:'c18_34a'},
    {texto:'Fechar e dormir.', vai:'c18_a_manha', ef:{flag:'c18_dormiu'}}
  ]
},

c18_anexos:{
  texto:[
    'Os anexos são a parte que ninguém lê e a parte que diz tudo.',
    'Orçamento, prestação de contas, relação de fornecedores, patrimônio, quadro de pessoal.',
    'Números não mentem, não porque sejam honestos, mas porque precisam fechar.'
  ],
  escolhas:[
    {texto:'Orçamento e prestação de contas.', vai:'c18_anexo_orcamento'},
    {texto:'Relação de fornecedores.', vai:'c18_anexo_fornecedores'},
    {texto:'Quadro de pessoal.', vai:'c18_anexo_pessoal'},
    {texto:'Anexo de campo — as áreas.', vai:'c18_anexo_campo'}
  ]
},

c18_anexo_orcamento:{
  texto:[
    'A receita anual da CGRB é maior que a de duas cidades de Kanto juntas.',
    'Doação de pessoa jurídica: sessenta e um por cento. Doação de pessoa física: nove. Convênios: dezoito. Rendimento de aplicação: doze.',
    'Sessenta e um por cento de pessoa jurídica, e a prestação de contas é obrigada a listar quem doa acima de um certo valor.',
    'Tem quatro nomes na lista. Três são empresas que você nunca ouviu falar.',
    'A quarta é a Silph.'
  ],
  ef:{flag:['sabe_quem_paga','silph_financia'], instabilidade:1,
      registrar:'61% da receita da CGRB vem de pessoa jurídica. A Silph está na lista de doadores.'},
  escolhas:[
    {texto:'Ver as três empresas que você não conhece.', vai:'c18_tres_empresas'},
    {texto:'Ver a relação de fornecedores.', vai:'c18_anexo_fornecedores'},
    {texto:'Ver o centro de custo 11.', vai:'c18_centro_de_custo'}
  ]
},

c18_tres_empresas:{
  texto:[
    'Você anota os três nomes e os endereços.',
    'Duas são do mesmo endereço em Saffron, um andar de diferença.',
    'A terceira é Agropecuária Linha Verde, com sede em Fuchsia.',
    d=>d.flags.provas_zona
      ? 'Você conhece esse nome. Esse nome comprava da Zona Safári.'
      : 'Agropecuária. Em Fuchsia. Onde tem uma reserva de sessenta quilômetros quadrados.'
  ],
  ef:{flag:'linha_verde_doa', instabilidade:1,
      registrar:'A Agropecuária Linha Verde, de Fuchsia, é uma das doadoras da CGRB.'},
  escolhas:[
    {texto:'Ver o centro de custo 11.', vai:'c18_centro_de_custo'},
    {texto:'Ver os fornecedores.', vai:'c18_anexo_fornecedores'},
    {texto:'Fechar os anexos.', vai:'c18_a_manha'}
  ]
},

c18_centro_de_custo:{
  texto:[
    'O plano de contas tem doze centros de custo e onze deles têm nome descritivo: administração, campo, saúde, transporte, comunicação.',
    'O décimo segundo se chama apenas 11.',
    'Onze não é nome. Onze é o que sobra quando alguém decidiu não escrever o nome.',
    'A dotação do centro de custo 11 é a segunda maior do orçamento inteiro.',
    'E a prestação de contas dele tem uma nota de rodapé: despesas de natureza sigilosa, aprovadas em reunião fechada, conforme Art. 33 do estatuto.'
  ],
  ef:{flag:['centro_de_custo_11','sabe_do_art33'], instabilidade:2,
      registrar:'Centro de custo 11: segunda maior dotação, despesas sigilosas pelo Art. 33.'},
  escolhas:[
    {texto:'Procurar o Art. 33 no estatuto.', vai:'c18_art33'},
    {texto:'Ver os fornecedores.', vai:'c18_anexo_fornecedores'},
    {texto:'Fechar os anexos.', vai:'c18_a_manha'}
  ]
},

c18_art33:{
  texto:[
    'Art. 33 — As deliberações relativas a operações de campo de risco iminente poderão ser tomadas em reunião fechada, dispensada a publicação da ata, mediante registro em livro próprio, de acesso restrito ao Conselho.',
    'Livro próprio, de acesso restrito.',
    'Existe um segundo livro. Cento e quarenta páginas são o que eles publicam, e existe outro que eles não publicam, e o estatuto diz onde ele está e quem pode ler.',
    'Você fecha os olhos.',
    'Eles não esconderam nem isso. Eles escreveram, em documento público, exatamente onde fica a parte secreta.'
  ],
  ef:{flag:['sabe_do_livro_fechado'], instabilidade:2,
      registrar:'Art. 33: existe um livro de atas fechadas, de acesso restrito ao Conselho.'},
  escolhas:[
    {texto:'Fechar tudo. Chega.', vai:'c18_a_manha'},
    {texto:'Ver os fornecedores.', vai:'c18_anexo_fornecedores'},
    {texto:'Ver o quadro de pessoal.', vai:'c18_anexo_pessoal'}
  ]
},

c18_anexo_fornecedores:{
  texto:[
    'Trinta e um fornecedores, com nome, endereço e objeto.',
    'Ração. Medicamento pra Pokémon. Material de construção. Manutenção predial. Vigilância.',
    d=>Historia.jaAconteceu('c18_terceira')
      ? 'E, na décima nona linha, uma loja de material de construção de Celadon cujo endereço você conhece, porque esteve lá: é o galpão da Terceira, registrado com nome de gente, com registro comercial e tudo.'
      : 'E, na décima nona linha, uma loja de material de construção de Celadon cujo objeto declarado é gaiola de transporte, rede de contenção e material de contenção diverso.',
    'Está tudo no papel. Está tudo com nota.'
  ],
  ef:{flag:'viu_os_fornecedores',
      registrar:'31 fornecedores listados, com nome, endereço e objeto.'},
  escolhas:[
    {texto:'Ver o contrato de vigilância.', vai:'c18_vigilancia'},
    {texto:'Ver o quadro de pessoal.', vai:'c18_anexo_pessoal'},
    {texto:'Ver o anexo de campo.', vai:'c18_anexo_campo'}
  ]
},

c18_vigilancia:{
  texto:[
    'O contrato de vigilância é o único do calhamaço que não tem objeto descrito.',
    'Diz apenas: serviços de segurança patrimonial e apoio operacional, conforme proposta técnica em anexo, anexo não publicado.',
    'Apoio operacional.',
    'Você já ouviu essas duas palavras na boca de gente que carregava coisa no escuro.',
    'O valor mensal é quatro vezes o que a Comissão gasta com ração.'
  ],
  ef:{flag:'sabe_da_vigilancia', instabilidade:1,
      registrar:'O contrato de vigilância custa quatro vezes a ração e tem a proposta técnica não publicada.'},
  escolhas:[
    {texto:'Ver o quadro de pessoal.', vai:'c18_anexo_pessoal'},
    {texto:'Ver o anexo de campo.', vai:'c18_anexo_campo'},
    {texto:'Fechar tudo.', vai:'c18_a_manha'}
  ]
},

c18_anexo_pessoal:{
  texto:[
    'Quarenta e sete pessoas. Nome, cargo, carga horária, data de admissão.',
    'Nove médicos de Pokémon. Quatro biólogos. Dezenove técnicos de viveiro. Seis motoristas. Um secretário. Um contador. Uma auditora de campo. Um curador. Cinco em vigilância, terceirizados.',
    'Auditora de Campo: M. Brill.',
    d=>c18_conheciaBrill(d) ? 'Brill. A prancheta, a voz que não sobe meio grau. Você conhece.' : '',
    'Curador: J. Fabre. Admitido no segundo mês depois da reforma, o primeiro contratado depois do contador. É também conselheiro: o único dos onze que aparece nas duas listas.',
    'Você fica com essa informação: antes de qualquer médico, antes de qualquer técnico, eles contrataram um curador.'
  ],
  ef:{flag:['conhece_o_nome_adnan','conhece_o_nome_prado'],
      registrar:'47 funcionários. Fabre, curador e conselheiro, foi o primeiro contratado depois do contador.'},
  escolhas:[
    {texto:'Ver o anexo de campo.', vai:'c18_anexo_campo'},
    {texto:'Ver o orçamento.', vai:'c18_anexo_orcamento'},
    {texto:'Fechar tudo.', vai:'c18_a_manha'}
  ]
},

c18_anexo_campo:{
  texto:[
    'O anexo de campo é um mapa mimeografado de Kanto com quatro polígonos hachurados e uma legenda.',
    'Estação 1 — Rota 3, desativada.',
    'Estação 2 — Rota 11, em manutenção.',
    'Estação 3 — Zona de amortecimento de Fuchsia, em operação.',
    'Estação 4 — Rota 21, em operação, Fase II.',
    'Ao lado da Estação 4, a lápis: trecho de litoral de doze quilômetros, curva grande, praia de pedra. Quem passa de barco não vê nada.'
  ],
  ef:{flag:['sabe_da_rota21','sabe_da_estacao4'],
      registrar:'Quatro estações. A Estação 4, na Rota 21, é onde roda a Fase II.'},
  escolhas:[
    {texto:'Procurar o croqui da Estação 4.', vai:'c18_croqui_estacao4'},
    {texto:'Fechar tudo.', vai:'c18_a_manha'},
    {texto:'Ver o quadro de pessoal.', vai:'c18_anexo_pessoal'}
  ]
},

c18_croqui_estacao4:{
  texto:[
    'O croqui é um desenho de engenheiro, com escala e norte.',
    'Guarita. Administração. Seis galpões de incubadora, numerados de 1 a 6. Um galpão sem número, ao fundo, com a legenda G.',
    'G não tem nada escrito na legenda. Todos os outros têm.',
    'A cerca do perímetro é de três metros, exceto no trecho leste, onde o desenho anota: barranco natural, cerca de 1,20 m.',
    'Barranco natural. Do lado do mar.'
  ],
  ef:{flag:['sabe_do_galpao_do_fundo','sabe_da_cerca_do_mar'],
      registrar:'Croqui da Estação 4: seis galpões numerados, um galpão G sem legenda, cerca baixa no trecho leste.'},
  escolhas:[
    {texto:'Copiar o croqui.', vai:'c18_copiou_croqui'},
    {texto:'Fechar tudo.', vai:'c18_a_manha'}
  ]
},

c18_copiou_croqui:{
  texto:[
    'Você copia o croqui no seu caderno de campo, com a escala, com o norte, com o barranco.',
    'Fica torto. Não importa.',
    'É a primeira coisa desta noite inteira que você fez com as mãos em vez de com os olhos, e isso te faz sentir menos inútil do que você estava se sentindo havia seis horas.'
  ],
  ef:{flag:'tem_croqui_estacao4', itens:{'Croqui da Estação 4':1},
      registrar:'Copiou o croqui da Estação 4 no caderno.'},
  escolhas:[{texto:'Fechar tudo.', vai:'c18_a_manha'}]
},

c18_procurar_nome:{
  texto:[
    'O calhamaço tem índice remissivo, porque claro que tem.',
    'Você passa o dedo pela coluna e para em cada nome que reconhece.',
    'Você tem a noite inteira. Escolhe por onde começa.'
  ],
  escolhas:[
    {texto:'Silph.', vai:'c18_indice_silph'},
    {texto:'Safári.', vai:'c18_indice_safari'},
    {texto:'Cinnabar.', vai:'c18_indice_cinnabar'},
    {texto:'Seafoam.', vai:'c18_indice_seafoam'},
    {texto:'Voltar e ler na ordem.', vai:'c18_estatuto'}
  ]
},

c18_indice_silph:{
  texto:[
    'Silph aparece onze vezes.',
    'Nove como doadora. Uma como cedente de equipamento de laboratório em comodato.',
    'E uma, na ata da 27ª, como destinatária de um ofício da Comissão solicitando a suspensão de linha de pesquisa por incompatibilidade com o Art. 4º.',
    'A Comissão mandou a Silph parar.',
    d=>d.flags.sabe_do_andar_11
      ? 'E a Silph parou, e demitiu, e deu noventa dias pro resto do andar 11.'
      : 'A ata seguinte registra a resposta: linha suspensa, equipe dispensada em noventa dias.'
  ],
  ef:{flag:['entendeu_o_andar_11','silph_financia'], instabilidade:1,
      registrar:'Foi a Comissão que mandou a Silph suspender uma linha de pesquisa, com noventa dias de prazo.'},
  escolhas:[
    {texto:'Procurar outro nome.', vai:'c18_procurar_nome'},
    {texto:'Fechar tudo.', vai:'c18_a_manha'}
  ]
},

c18_indice_safari:{
  texto:[
    'Safári aparece sete vezes, sempre como Estação 3 — zona de amortecimento.',
    'Uma delas traz o número de uma ata de terceiro: ata 41/1997 do conselho gestor da reserva, autorizando manejo de excedente por entidade credenciada.',
    'Mil novecentos e noventa e sete.',
    d=>d.flags.koga_assinou_o_credenciamento
      ? 'O ano em que o Koga assinou o credenciamento do receptor, junto com os outros seis, e não lembra o nome da empresa.'
      : '',
    'A Comissão tem esse nome há um ano e oito meses e opera com uma autorização de noventa e sete, dada ao nome velho, que nunca foi revogada porque ninguém leu.',
    'O papel não expirou. O papel nunca expira. É isso que o papel faz.'
  ],
  ef:{flag:['sabe_da_ata_41','provas_zona'], instabilidade:1,
      registrar:'A CGRB opera na Zona Safári com base na ata 41/1997, dada à associação antes da troca de nome, que ninguém revogou.'},
  escolhas:[
    {texto:'Procurar outro nome.', vai:'c18_procurar_nome'},
    {texto:'Fechar tudo.', vai:'c18_a_manha'}
  ]
},

c18_indice_cinnabar:{
  texto:[
    'Cinnabar aparece quatro vezes, três delas no anexo de patrimônio.',
    '**Item 44 — acervo documental e material biológico conservado, proveniente do Instituto de Cinnabar, recebido por doação.**',
    'Recebido por doação.',
    'Alguém que sobrou daquele instituto assinou um termo de doação e entregou tudo o que restou pra uma associação civil.',
    'E o termo está anexado, com duas assinaturas e uma data.'
  ],
  ef:{flag:['sabe_da_matriz','liga_cinnabar_comissao'], instabilidade:1,
      registrar:'O acervo de Cinnabar foi doado à CGRB por termo assinado.'},
  escolhas:[
    {texto:'Ler o Item 44 inteiro.', vai:'c18_item_44'},
    {texto:'Procurar outro nome.', vai:'c18_procurar_nome'},
    {texto:'Fechar tudo.', vai:'c18_a_manha'}
  ]
},

c18_indice_seafoam:{
  texto:[
    'Seafoam aparece duas vezes, as duas no Anexo I.',
    '**Risco 02 — colônia insular, Seafoam, população estimada 1 a 3. Status: monitoramento passivo. Observação: acesso difícil, custo operacional elevado, prioridade baixa.**',
    'Prioridade baixa.',
    'Você fica um tempo aliviad{o|a} antes de entender que alívio não é a palavra.',
    'Prioridade baixa quer dizer que está na lista. Quer dizer que alguém, numa reunião de pauta comprida, olhou pra uma linha escrita Seafoam e disse: esse a gente deixa pra depois.'
  ],
  ef:{flag:['viu_a_lista_de_riscos','sabe_do_risco02'], instabilidade:2,
      registrar:'Risco 02: colônia insular de Seafoam, monitoramento passivo, prioridade baixa.'},
  escolhas:[
    {texto:'Ver a lista inteira.', vai:'c18_risco_02'},
    {texto:'Procurar outro nome.', vai:'c18_procurar_nome'},
    {texto:'Fechar tudo.', vai:'c18_a_manha'}
  ]
},

c18_a_manha:{
  texto:[
    d=>d.flags.c18_dormiu
      ? 'Você dorme pouco e mal, com o calhamaço no chão do lado da cama, e acorda com a luz.'
      : 'A luz muda antes de você perceber que a noite acabou.',
    d=>d.flags.c18_dormiu
      ? 'As cento e quarenta páginas estão onde você deixou, em quatro pilhas, com um lápis sem ponta em cima.'
      : 'Você está sentad{o|a} na cama com cento e quarenta páginas espalhadas em quatro pilhas e um lápis sem ponta, e não dormiu.',
    'Do outro lado da janela, Saffron começa: ônibus, portão de loja subindo, alguém varrendo calçada.',
    'Você olha pras quatro pilhas e entende que a parte difícil não vai ser provar.',
    'A parte difícil vai ser convencer qualquer pessoa de que um documento chato importa.'
  ],
  ef:{instabilidade:1,
      registrar:()=>c18_lidas() >= 10 ? 'Leu as 140 páginas em uma noite.' : 'Leu parte das 140 páginas numa noite comprida.',
      executar:d=>{
        if (c18_lidas() >= 10){
          Estado.marcar('leu_tudo');
          Estado.mudarRep('bom', 1, 'Leu as 140 páginas inteiras, a noite toda', {});
        }
        c18_ate(d.flags.c18_dormiu ? 7 : 6, true);
        return [];
      }},
  escolhas:[{texto:'Levantar.', vai:'c18_auditora'}]
},

/* ── A Auditora Brill ───────────────────────────────────── */
c18_auditora:{
  texto:[
    'Tem uma mulher sentada na cadeira do outro lado do quarto.',
    'Não arrombou nada. A porta está intacta e trancada por dentro.',
    'Ela tem uma chave, porque a Comissão tem contrato de manutenção com a rede de Centros Pokémon, porque é uma associação civil registrada, e contrato de manutenção dá chave.',
    d=>c18_conheciaBrill(d)
      ? 'É a Auditora Brill, de novo: a mesma voz que não sobe meio grau, o mesmo bloco no bolso interno.'
      : 'Ela mostra um crachá que é real, com foto, validade e número.',
    d=>c18_conheciaBrill(d)
      ? fala('Auditora Brill', 'Auditora Brill. Eu me apresento toda vez, porque é o procedimento.')
      : fala('Auditora Brill', 'Auditora Brill.'),
    d=>fala('Auditora Brill', c18_comprou(d)
      ? '{O senhor|A senhora} comprou material público. Eu não vim te acusar de nada.'
      : '{O senhor|A senhora} está com material público. Eu não vim te acusar de nada.'),
    'Ela cruza as mãos no colo.',
    fala('Auditora Brill', 'Eu vim fazer uma pergunta e vou aceitar qualquer resposta, inclusive a que eu não quero. O que {o senhor|a senhora} pretende fazer com isso?')
  ],
  ef:{npc:{nome:'Auditora Brill', opiniao:0, memoria:'Apareceu no seu quarto de Centro Pokémon com um crachá de verdade.'},
      flag:'conheceu_auditora'},
  escolhas:[
    {texto:'"Publicar. Tudo."', vai:'c18_publicar'},
    {texto:'"Ainda não sei."', vai:'c18_nao_sei'},
    {texto:'"Nada. Eu li e vou seguir a minha vida."', vai:'c18_nada'},
    {texto:'"Eu quero conversar com quem manda."', vai:'c18_conversar'},
    {texto:'"E o que a senhora pretende fazer comigo?"', vai:'c18_pergunta_de_volta'},
    {texto:'Atacar. Ela entrou no seu quarto.', vai:'c18_luta_auditora'}
  ]
},

c18_pergunta_de_volta:{
  texto:[
    d=>fala(d.jogador.nome, 'E o que a senhora pretende fazer comigo?'),
    'Ela levanta as sobrancelhas, e por um segundo parece quase satisfeita.',
    fala('Auditora Brill', 'Relatório.'),
    'Ela tira um bloco do bolso interno.',
    fala('Auditora Brill', 'Eu sou auditora. Eu faço relatório.'),
    d=>fala(d.jogador.nome, 'E o relatório diz o quê?'),
    fala('Auditora Brill', 'Depende do que {o senhor|a senhora} responder.'),
    'Ela destampa a caneta.',
    fala('Auditora Brill', 'Se {o senhor|a senhora} disser que vai publicar, eu escrevo que {o senhor|a senhora} vai publicar, e o jurídico vai preparar uma resposta e a assessoria vai preparar uma nota. Se {o senhor|a senhora} disser que não vai fazer nada, eu escrevo isso, e ninguém mais lê o meu relatório até o ano que vem.'),
    d=>fala(d.jogador.nome, 'E se eu mentir?'),
    fala('Auditora Brill', 'Aí o relatório fica errado e o erro é meu.'),
    'Ela dá de ombros.',
    fala('Auditora Brill', 'Já aconteceu.')
  ],
  ef:{flag:'entendeu_a_prado',
      npc:{nome:'Auditora Brill', opiniao:1, memoria:'Te explicou exatamente o que ela faz e o que acontece depois.'},
      registrar:'A Auditora Brill faz relatório. É isso que ela faz.'},
  escolhas:[
    {texto:'"Publicar. Tudo."', vai:'c18_publicar'},
    {texto:'"Ainda não sei."', vai:'c18_nao_sei'},
    {texto:'"Nada."', vai:'c18_nada'},
    {texto:'"Eu quero conversar com quem manda."', vai:'c18_conversar'}
  ]
},

c18_publicar:{
  texto:[
    d=>fala(d.jogador.nome, 'Publicar. Tudo.'),
    'Ela anota. Leva quatro segundos e ela anota tudo, inclusive a palavra tudo.',
    fala('Auditora Brill', 'Certo.'),
    'Ela guarda o bloco.',
    fala('Auditora Brill', 'Então três coisas, e nenhuma delas é ameaça.'),
    fala('Auditora Brill', 'Primeira: é material público, {o senhor|a senhora} pode. Segunda: a gente vai emitir uma nota no mesmo dia, porque é o procedimento, e a nota vai dizer a verdade, que é o que a torna eficaz.'),
    d=>fala(d.jogador.nome, 'E a terceira?'),
    fala('Auditora Brill', 'A terceira é que nada vai acontecer.'),
    'Ela se levanta e ajeita a bainha do casaco.',
    fala('Auditora Brill', 'Vai sair na página sete do caderno de cidades e no dia seguinte vai ter outra coisa na página sete. Eu não estou te desanimando, eu estou te informando, porque eu já vi acontecer duas vezes.')
  ],
  ef:{flag:['quer_publicar'],
      npc:{nome:'Auditora Brill', opiniao:1, memoria:'Você disse que ia publicar e ela anotou a palavra tudo.'},
      registrar:'Disse à Auditora Brill que vai publicar tudo.'},
  escolhas:[
    {texto:'"Duas vezes? Quem foram os outros?"', vai:'c18_os_outros_dois'},
    {texto:'"Veremos." E ir atrás da Livia Gale.', vai:'c18_isaura', cond:d=>!!d.flags.contato_isaura},
    {texto:'"Veremos." E procurar um jornal.', vai:'c18_procura_jornal', cond:d=>!d.flags.contato_isaura},
    {texto:'"Antes disso, eu quero falar com quem manda."', vai:'c18_conversar'}
  ]
},

c18_os_outros_dois:{
  texto:[
    fala('Auditora Brill', 'Um professor e uma servidora.'),
    'Ela responde na hora, sem consultar.',
    fala('Auditora Brill', 'Ele publicou um artigo em revista científica, que é o lugar onde as coisas vão morrer em paz. Ela publicou numa rádio de Fuchsia, e foi melhor: durou onze dias.'),
    d=>fala(d.jogador.nome, 'E depois?'),
    fala('Auditora Brill', 'Depois a rádio mudou de dono, por motivo comercial mesmo, sem a nossa mão.'),
    'Ela abre as palmas.',
    fala('Auditora Brill', 'E ela continuou falando, e continua até hoje, e ninguém mais liga, e isso é a pior parte.'),
    'Ela para na porta.',
    fala('Auditora Brill', 'Se {o senhor|a senhora} for publicar, publica com nome e com documento e com alguém que aguente três anos. Sem isso é só barulho, e barulho a gente aprendeu a esperar passar.')
  ],
  ef:{flag:'sabe_dos_dois_anteriores',
      registrar:'Duas pessoas já publicaram sobre a CGRB. Uma em revista científica, outra numa rádio de Fuchsia.'},
  escolhas:[
    {texto:'"Quem é a mulher da rádio?"', vai:'c18_mulher_da_radio'},
    {texto:'Ir atrás da Livia Gale.', vai:'c18_isaura', cond:d=>!!d.flags.contato_isaura},
    {texto:'Procurar um jornal.', vai:'c18_procura_jornal', cond:d=>!d.flags.contato_isaura}
  ]
},

c18_mulher_da_radio:{
  texto:[
    fala('Auditora Brill', 'Maeve Bracken.'),
    'A Auditora Brill escreve o nome num pedaço do próprio bloco e destaca.',
    fala('Auditora Brill', 'Rádio comunitária de Fuchsia, programa das seis da manhã.'),
    c18_eu('A senhora está me dando uma testemunha.'),
    fala('Auditora Brill', 'Eu estou te dando o nome público de uma pessoa que fala na rádio toda manhã.'),
    'Ela entrega o papel.',
    fala('Auditora Brill', 'Se isso é te dar uma testemunha, o problema não é meu.'),
    'Ela fecha a porta com cuidado ao sair, do jeito que a gente fecha porta de quarto de gente que dormiu mal.'
  ],
  ef:{flag:'contato_nadia', itens:{'Papel com o nome de Maeve Bracken':1},
      npc:{nome:'Auditora Brill', opiniao:2, memoria:'Te deu o nome da mulher da rádio de Fuchsia.'},
      registrar:'Maeve Bracken, rádio comunitária de Fuchsia, programa das 6h.'},
  escolhas:[
    {texto:'Ir atrás da Livia Gale.', vai:'c18_isaura', cond:d=>!!d.flags.contato_isaura},
    {texto:'Procurar um jornal.', vai:'c18_procura_jornal', cond:d=>!d.flags.contato_isaura},
    {texto:'Ir pra Rota 21 ver com os próprios olhos.', vai:'c18_fim'}
  ]
},

c18_procura_jornal:{
  texto:[
    'A redação do jornal de Celadon fica num sobrado com escada de madeira e cheiro de tinta.',
    'Você é atendid{o|a} por um repórter de vinte e poucos anos que escuta três minutos, olha o calhamaço e faz a única pergunta que ele foi treinado a fazer.',
    fala('o repórter', 'Tem foto?'),
    c18_eu('Tem ata.'),
    fala('o repórter', 'Ata não é foto.'),
    'Ele não está sendo cínico. Ele está sendo exato.',
    fala('o repórter', 'Eu levo isso pra editora e ela vai perguntar a mesma coisa, e eu vou ter que responder que não tem.'),
    'Ele pensa um pouco.',
    fala('o repórter', 'Deixa eu levar mesmo assim.')
  ],
  ef:{registrar:'Levou o calhamaço à redação do jornal de Celadon.',
      executar:()=>{ Relogio.avancar(1); return []; }},
  escolhas:[
    {texto:'Deixar o calhamaço e esperar.', vai:'c18_isaura'},
    {texto:'"Eu falo com a editora direto."', vai:'c18_isaura'},
    {texto:'Pegar de volta e desistir do jornal.', vai:'c18_desistiu_do_jornal'}
  ]
},

c18_isaura:{
  texto:[
    d=>d.flags.contato_isaura
      ? 'Livia Gale tem vinte e dois anos de redação e uma mesa com quatro pilhas e nenhum enfeite.'
      : 'A editora de cidades se chama Livia Gale, está há vinte e dois anos na redação e tem uma mesa com quatro pilhas e nenhum enfeite.',
    'Ela lê por quarenta minutos sem falar com você, o que é a coisa mais educada que alguém fez por você em meses.',
    'Depois fecha o bloco e faz três perguntas seguidas.',
    fala('Livia Gale', 'Isso é público?'),
    c18_eu('É.'),
    fala('Livia Gale', 'Você pagou?'),
    d=>c18_comprou(d)
      ? fala(d.jogador.nome, 'Paguei. Tenho o recibo.')
      : Historia.jaAconteceu('c18_ivone_da_as_atas')
        ? fala(d.jogador.nome, 'Não. São da Dra. Cordell, com as anotações dela na margem.')
        : fala(d.jogador.nome, 'Não. Eu peguei do armário deles, na frente deles.'),
    fala('Livia Gale', 'Você entende que eles vão dizer que é tudo público e que isso vai fazer a matéria parecer boba?'),
    c18_eu('Entendo.'),
    fala('Livia Gale', 'Então eu publico.')
  ],
  ef:{flag:['isaura_vai_publicar','contato_isaura'],
      npc:{nome:'Livia Gale', opiniao:2, memoria:'Leu 140 páginas antes de decidir.'},
      registrar:'Livia Gale vai publicar.'},
  escolhas:[
    {texto:'"Publica o Art. 19 na primeira linha."', vai:'c18_publica_art19'},
    {texto:'"Publica a lista dos nove riscos."', vai:'c18_publica_lista', cond:d=>!!d.flags.viu_a_lista_de_riscos},
    {texto:'"Publica os quatrocentos e dezenove formulários."', vai:'c18_publica_419', cond:d=>!!d.flags.sabe_dos_419},
    {texto:'"A senhora decide. A jornalista é a senhora."', vai:'c18_ela_decide'}
  ]
},

c18_publica_art19:{
  texto:[
    'Sai na quinta, no caderno de cidades, página cinco, com três colunas.',
    '**ASSOCIAÇÃO REGISTRADA PREVÊ DESCARTE DE POKÉMON EM ESTATUTO PÚBLICO**',
    'A matéria é boa. É sóbria, é checada, cita o número do registro e o número do artigo, e traz a resposta da Comissão em dois parágrafos no fim.',
    'A resposta da Comissão diz que o documento é público, que o procedimento tem parecer médico e que a entidade está à disposição para esclarecimentos.',
    'E é verdade. É por isso que funciona.'
  ],
  ef:{flag:['publicou','publicou_art19'], instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Publicou o Art. 19 num jornal de Kanto'},
      registrar:'Saiu no jornal de Celadon: o Art. 19 e o descarte.',
      executar:()=>{ Relogio.ateODia(3, 7, true); return []; }},
  escolhas:[{texto:'Esperar pra ver o que acontece.', vai:'c18_depois_da_materia'}]
},

c18_publica_lista:{
  texto:[
    'Sai na quinta, no caderno de cidades, com a tabela reproduzida inteira, as duas colunas.',
    'A da esquerda diz Risco 01, Risco 02, Risco 03.',
    'A da direita, porque a Livia fez questão, diz os nomes.',
    'É a primeira vez em toda a história de Kanto que um jornal imprime, lado a lado, o número que uma instituição deu a um Pokémon e o nome que as pessoas dão a ele.',
    'Três leitores escrevem cartas na semana seguinte. Duas são elogios. Uma é de um médico de Pokémon dizendo que a tabela está tecnicamente correta e perguntando qual é o problema.'
  ],
  ef:{flag:['publicou','publicou_a_lista'], instabilidade:2,
      rep:{eixo:'bom',delta:2,motivo:'Fez um jornal imprimir os nomes ao lado dos números'},
      registrar:'Saiu no jornal a tabela dos nove riscos, com os nomes ao lado dos números.',
      executar:()=>{ Relogio.ateODia(3, 7, true); return []; }},
  escolhas:[{texto:'Esperar pra ver o que acontece.', vai:'c18_depois_da_materia'}]
},

c18_publica_419:{
  texto:[
    'Sai na quinta, e o título é um número: 419.',
    'Foi ideia da Livia, e ela brigou com o chefe de redação por causa disso durante quarenta minutos.',
    'Ele disse que título com número ninguém lê. Ela disse que título com esse número, lê.',
    'A matéria explica, em linguagem simples, o que é um formulário de descarte, quem assina, e quantos foram emitidos no ano.',
    'E, no último parágrafo, transcreve uma frase inteira do regulamento interno: arquivar por dez anos.'
  ],
  ef:{flag:['publicou','publicou_419'], instabilidade:2,
      rep:{eixo:'bom',delta:2,motivo:'Pôs um número de três dígitos no alto do caderno de cidades'},
      registrar:'Saiu no jornal: 419 formulários de descarte em um ano.',
      executar:()=>{ Relogio.ateODia(3, 7, true); return []; }},
  escolhas:[{texto:'Esperar pra ver o que acontece.', vai:'c18_depois_da_materia'}]
},

c18_ela_decide:{
  texto:[
    c18_eu('A senhora decide.'),
    'Ela não agradece e não comemora. Ela puxa a quarta pilha pro lado e abre espaço na mesa, que é o jeito dela de dizer que aceitou.',
    'A matéria começa a sair na quinta, em três partes, ao longo de três semanas.',
    'A primeira é sobre o convênio com a Liga. A segunda é sobre o orçamento. A terceira é sobre o Art. 19.',
    'Ela escolheu terminar pelo que dói, porque é assim que se faz quando se quer que alguém chegue ao fim.'
  ],
  ef:{flag:['publicou','publicou_serie'], instabilidade:2,
      rep:{eixo:'bom',delta:2,motivo:'Deixou uma jornalista fazer o trabalho de jornalista'},
      registrar:'Uma série de três matérias no jornal de Celadon, terminando no Art. 19.',
      executar:()=>{ Relogio.ateODia(3, 7, true); return []; }},
  escolhas:[{texto:'Esperar pra ver o que acontece.', vai:'c18_depois_da_materia'}]
},

c18_depois_da_materia:{
  texto:[
    'O que acontece é quase nada, e o quase é a parte que importa.',
    'A Liga emite uma nota de esclarecimento de quatro linhas. Duas prefeituras pedem informações. Um conselheiro da prefeitura de Celadon protocola um requerimento e depois viaja.',
    'A Comissão publica no boletim dela o inteiro teor do estatuto, com um texto de apresentação dizendo que sempre esteve disponível.',
    'E aí, na segunda semana, chegam as cartas.',
    'Onze cartas de leitores. Nove são contra você.'
  ],
  ef:{flag:'sofreu_as_cartas', instabilidade:1,
      registrar:'A matéria saiu. Nove das onze cartas de leitores foram contra você.',
      executar:()=>{ Relogio.viver(9 * 24); return []; }},
  escolhas:[
    {texto:'Ler as nove.', vai:'c18_as_nove_cartas'},
    {texto:'Ler as duas.', vai:'c18_as_duas_cartas'},
    {texto:'Não ler nenhuma.', vai:'c18_adnan'}
  ]
},

c18_as_nove_cartas:{
  texto:[
    'São educadas. Isso é o pior.',
    'Uma é de uma mãe de Saffron cujo filho foi mordido num parque e que pergunta, de verdade, o que {o senhor|a senhora} propõe no lugar.',
    'Outra é de um produtor rural da Rota 6 que perdeu três anos de plantação e que diz, com todas as letras, que nunca ninguém veio.',
    'Outra é de um médico de Pokémon que explica, com termos técnicos, o que é eutanásia e pergunta se você sabe a diferença.',
    'Nenhuma delas é comprada. Nenhuma delas é estúpida.',
    'Você fica com as nove cartas na mão e entende, tarde, que não estava brigando com uma organização. Você estava brigando com um problema que existe.'
  ],
  ef:{flag:'leu_as_nove_cartas', instabilidade:1, moral:-3,
      registrar:'Nove cartas contra você, todas de gente com motivo.'},
  escolhas:[
    {texto:'Responder a todas.', vai:'c18_respondeu_as_cartas'},
    {texto:'Ler as duas a favor.', vai:'c18_as_duas_cartas'},
    {texto:'Guardar tudo e ir andar.', vai:'c18_adnan'}
  ]
},

c18_respondeu_as_cartas:{
  texto:[
    'Você responde as nove à mão, uma por uma, em quatro dias.',
    'Você não tem resposta pra mãe do parque e escreve isso: eu não tenho resposta pra senhora, e quem tem resposta é exatamente quem eu estou denunciando, e é por isso que é difícil.',
    'Seis não respondem.',
    'Duas respondem agradecendo.',
    'A mãe do parque responde com uma linha só: então {o senhor|a senhora} pelo menos escuta.',
    'Você guarda essa.'
  ],
  ef:{flag:'respondeu_as_cartas', moral:4,
      rep:{eixo:'bom',delta:2,motivo:'Respondeu à mão cada carta que discordava de você'},
      registrar:'Respondeu as nove cartas à mão. A mãe do parque respondeu de volta.',
      executar:()=>{ Relogio.viver(6 * 24); return []; }},
  escolhas:[{texto:'Seguir.', vai:'c18_adnan'}]
},

c18_as_duas_cartas:{
  texto:[
    'A primeira é de um menino de doze anos de Pewter que quer saber se é verdade que existe uma lista com números e se o dele está nela, e por dele ele quer dizer o Geodude que ele encontrou no ano passado.',
    'Você lê essa carta três vezes.',
    'A segunda é de uma mulher que assina só com as iniciais e diz que trabalhou na Estação 2 por sete meses, que saiu, e que se você quiser conversar ela conversa, mas não por carta.',
    'Tem um telefone.'
  ],
  ef:{flag:['contato_ex_funcionaria'], itens:{'Carta com iniciais e um telefone':1},
      registrar:'Uma ex-funcionária da Estação 2 quer conversar, mas não por carta.'},
  escolhas:[
    {texto:'Ligar para ela.', vai:'c18_ex_funcionaria'},
    {texto:'Ler as nove contra.', vai:'c18_as_nove_cartas'},
    {texto:'Guardar e seguir.', vai:'c18_adnan'}
  ]
},

c18_ex_funcionaria:{
  texto:[
    'Ela marca num ponto de ônibus na saída de Saffron, às seis da manhã, antes do turno dela num emprego novo, e chega antes de você.',
    'Tem uns trinta anos, jaqueta de brim, e fala rápido porque ensaiou.',
    fala('a ex-técnica da Estação 2', 'Eu fui técnica de viveiro sete meses. Eu não vi nada ilegal, e é isso que eu quero te dizer.'),
    c18_eu('Então por que a senhora saiu?'),
    fala('a ex-técnica da Estação 2', 'Porque no sexto mês eu percebi que eu tinha parado de dar nome.'),
    'Ela olha o ponto de ônibus, não você.',
    fala('a ex-técnica da Estação 2', 'Nos dois primeiros meses eu dava nome pra todos. No sexto eu falava a matrícula. Ninguém me mandou parar. Eu parei sozinha, porque fica mais fácil.'),
    'O ônibus dela chega. Ela levanta.',
    fala('a ex-técnica da Estação 2', 'É isso que eles fazem. Não é maldade. É ficar mais fácil.')
  ],
  ef:{flag:['depoimento_ex_funcionaria'], instabilidade:1, moral:-2,
      npc:{nome:'a ex-técnica da Estação 2', opiniao:2, memoria:'Te contou que parou de dar nome sozinha.'},
      registrar:'A ex-técnica da Estação 2 saiu quando percebeu que tinha parado de dar nome aos Pokémon.',
      executar:()=>{ c18_ate(6, true); return []; }},
  escolhas:[{texto:'Ficar no ponto de ônibus mais um pouco.', vai:'c18_adnan'}]
},

c18_desistiu_do_jornal:{
  texto:[
    'Você pega o calhamaço de volta e desce a escada de madeira com ele debaixo do braço.',
    'Na calçada, o repórter de vinte e poucos anos alcança você.',
    fala('o repórter', 'Ô.'),
    'Ele está sem fôlego.',
    fala('o repórter', 'Eu não estava sendo babaca. Eu estava dizendo como funciona.'),
    c18_eu('Eu sei.'),
    fala('o repórter', 'Se você achar uma foto, volta.'),
    'Ele estende um papel com o telefone da redação.',
    fala('o repórter', 'Eu volto a perguntar pra editora.')
  ],
  ef:{flag:'jornal_quer_foto',
      registrar:'O jornal quer uma foto. Sem foto, não há matéria.'},
  escolhas:[
    {texto:'Ir pra Rota 21 tirar a foto.', vai:'c18_fim'},
    {texto:'Procurar o Curador Fabre.', vai:'c18_adnan', cond:d=>c18_sabeDeFabre(d), ef:{flag:'c18_fabre_procurou'}}
  ]
},

c18_nao_sei:{
  texto:[
    d=>fala(d.jogador.nome, 'Ainda não sei.'),
    'Ela anota, e demora mais anotando isso do que demoraria anotando qualquer outra coisa.',
    fala('Auditora Brill', 'Essa é a resposta que eu não sei o que fazer com.'),
    'Ela guarda o bloco.',
    fala('Auditora Brill', 'Publicar eu sei. Guardar eu sei. Vender eu sei, já compraram de mim.'),
    'Ela se levanta.',
    fala('Auditora Brill', 'Não saber é a única que eu tenho que voltar para conferir.'),
    'Ela para com a mão na maçaneta.',
    fala('Auditora Brill', 'Eu vou voltar.')
  ],
  ef:{flag:'prado_vai_voltar',
      npc:{nome:'Auditora Brill', opiniao:2, memoria:'Você disse que não sabia e ela respeitou isso.'},
      registrar:'Disse à Auditora Brill que ainda não sabe. Ela vai voltar.'},
  escolhas:[
    {texto:'"Espera. Por que a senhora faz isso?"', vai:'c18_prado_porque'},
    {texto:'"Me apresenta a quem manda."', vai:'c18_conversar'},
    {texto:'Deixá-la ir.', vai:'c18_adnan'}
  ]
},

c18_prado_porque:{
  texto:[
    'Ela solta a maçaneta e pensa antes de responder, o que ninguém faz.',
    fala('Auditora Brill', 'Eu fui auditora de rede de farmácia por nove anos, e depois de seguradora. Eu achava desvio e escrevia relatório, e ninguém lia.'),
    c18_eu('E aqui leem?'),
    fala('Auditora Brill', 'Aqui leem.'),
    'Ela diz isso com um orgulho que te dá nojo e que você entende ao mesmo tempo.',
    fala('Auditora Brill', 'Aqui, quando eu escrevo que um procedimento foi feito errado, alguém é advertido na reunião seguinte, e consta em ata.'),
    'Ela abre a porta.',
    fala('Auditora Brill', '{O senhor|A senhora} acha que eu trabalho pra monstros. Eu trabalho pro único lugar onde o meu trabalho serve pra alguma coisa. Foi assim que eles me pegaram, e eu sei que foi assim.')
  ],
  ef:{flag:'entendeu_a_prado', instabilidade:1,
      npc:{nome:'Auditora Brill', opiniao:2, memoria:'Te contou como foi pega.'},
      registrar:'A Auditora Brill sabe exatamente como a Comissão a conquistou.'},
  escolhas:[
    {texto:'"Me apresenta a quem manda."', vai:'c18_conversar'},
    {texto:'Deixá-la ir.', vai:'c18_adnan'}
  ]
},

c18_nada:{
  texto:[
    c18_eu('Nada. Eu li e vou seguir a minha vida.'),
    'Ela anota, fecha o bloco, guarda a caneta e se levanta.',
    fala('Auditora Brill', 'Certo.'),
    'E é só isso. Nenhuma ameaça, nenhum alívio, nenhuma pergunta de confirmação.',
    'Ela vai até a porta e destranca.',
    fala('Auditora Brill', '{O senhor|A senhora} sabe que a gente não precisa da ajuda de ninguém, né? A gente só precisa que ninguém atrapalhe. Ficar parad{o|a} já serve.'),
    'A porta fecha.'
  ],
  ef:{flag:'disse_que_nao_faz_nada', instabilidade:1, moral:-4,
      npc:{nome:'Auditora Brill', opiniao:0, memoria:'Você disse que não ia fazer nada. Ela anotou e foi embora.'},
      registrar:'Disse à Comissão que não ia fazer nada.'},
  escolhas:[
    {texto:'Ficar sentad{o|a} na cama com as quatro pilhas.', vai:'c18_ficou_sentado'},
    {texto:'Correr atrás dela e dizer que mentiu.', vai:'c18_correu_atras'},
    {texto:'Ir embora de Saffron hoje mesmo.', vai:'c18_foi_embora_de_saffron'}
  ]
},

c18_ficou_sentado:{
  texto:[
    'Você fica sentad{o|a} na cama por mais de uma hora, com cento e quarenta páginas ao redor.',
    'Em algum momento você começa a empilhar. Em algum momento você para de empilhar.',
    'Você pensa em cada pessoa que te contou alguma coisa nos últimos meses sabendo o risco, e em cada uma que pediu pra não ter o nome anotado.',
    'Nenhuma delas ganhou nada com isso.',
    'Você levanta.'
  ],
  ef:{limpaFlag:'disse_que_nao_faz_nada', flag:'mentiu_pra_prado', moral:4,
      registrar:'Mentiu para a Auditora Brill e decidiu continuar.',
      executar:()=>{ Relogio.avancar(1); return []; }},
  escolhas:[
    {texto:'Ir atrás de um jornal.', vai:'c18_procura_jornal'},
    {texto:'Ir atrás do Curador Fabre.', vai:'c18_adnan', cond:d=>c18_sabeDeFabre(d), ef:{flag:'c18_fabre_procurou'}},
    {texto:'Ir direto pra Rota 21.', vai:'c18_fim'}
  ]
},

c18_correu_atras:{
  texto:[
    'Você alcança a Auditora Brill na calçada.',
    c18_eu('Eu menti.'),
    'Ela para. Tira o bloco de novo. Abre na mesma página.',
    fala('Auditora Brill', 'Eu sei.'),
    'Ela risca uma linha e escreve outra.',
    fala('Auditora Brill', '{O senhor|A senhora} demorou quatro minutos. A média é dois dias.'),
    c18_eu('A senhora sabia?'),
    fala('Auditora Brill', 'Eu sou auditora, {moço|moça}. O meu trabalho inteiro é saber quando a resposta é boa demais.'),
    'Ela fecha o bloco.',
    fala('Auditora Brill', 'Agora está certo. Boa sorte, e eu digo isso sério, e isso também vai no relatório.')
  ],
  ef:{limpaFlag:'disse_que_nao_faz_nada', flag:'prado_respeita',
      npc:{nome:'Auditora Brill', opiniao:3, memoria:'Você voltou em quatro minutos pra desmentir a si mesm{o|a}.'},
      rep:{eixo:'bom',delta:1,motivo:'Voltou para corrigir a própria mentira'},
      registrar:'Corrigiu a mentira na calçada. A auditora anotou.'},
  escolhas:[
    {texto:'"Me apresenta a quem manda."', vai:'c18_conversar'},
    {texto:'Ir atrás do Curador Fabre.', vai:'c18_adnan', cond:d=>c18_sabeDeFabre(d), ef:{flag:'c18_fabre_procurou'}},
    {texto:'Ir pra Rota 21.', vai:'c18_fim'}
  ]
},

c18_foi_embora_de_saffron:{
  texto:[
    'Você faz a mochila em nove minutos e pega a estrada do norte no primeiro ônibus.',
    'Por três dias funciona.',
    'Na quarta noite, numa pensão da Rota 5, você acorda de madrugada com a frase inteira na cabeça, do jeito que ela estava escrita, com o número do artigo e tudo.',
    'Você senta na beira da cama no escuro.',
    'Tem coisa que a gente não consegue desler.'
  ],
  ef:{flag:'ignorou_a_comissao', instabilidade:2, moral:-5,
      registrar:'Saiu de Saffron tentando esquecer.',
      executar:()=>{ Relogio.viver(3 * 24); c18_ate(4, true); return []; }},
  escolhas:[
    {texto:'Voltar.', vai:'c18_voltou'},
    {texto:'Continuar pro norte.', vai:'c18_fim'}
  ]
},

c18_voltou:{
  texto:[
    'Você volta no ônibus das seis, com a mesma mochila e uma decisão que não precisou de argumento.',
    'Saffron está igual. As pessoas estão indo trabalhar.',
    'Você atravessa a cidade a pé até a Rua do Comércio, 118, e desta vez não sobe.',
    d=>c18_sabeDeFabre(d)
      ? 'Você senta no café da esquina, pede um pingado e espera o Curador Fabre sair pro almoço, porque todo mundo almoça.'
      : 'Você senta no café da esquina, pede um pingado e espera alguém da sala 704 descer pro almoço.'
  ],
  ef:{limpaFlag:'ignorou_a_comissao', flag:'voltou_pra_saffron', moral:5,
      rep:{eixo:'bom',delta:1,motivo:'Voltou'},
      registrar:'Voltou a Saffron.',
      executar:()=>{ c18_ate(6, false); Relogio.avancar(2); return []; }},
  escolhas:[
    {texto:'Esperar o Fabre.', vai:'c18_adnan', cond:d=>c18_sabeDeFabre(d), ef:{flag:'c18_fabre_almoco'}},
    {texto:'Esperar quem descer.', vai:'c18_adnan', cond:d=>!c18_sabeDeFabre(d), ef:{flag:['c18_fabre_almoco','c18_fabre_estranho']}}
  ]
},

c18_conversar:{
  texto:[
    c18_eu('Eu quero conversar com quem manda.'),
    'A Auditora Brill fecha o bloco.',
    fala('Auditora Brill', 'A Presidente atende terça e quinta, das quatorze às dezesseis, com hora marcada.'),
    'Você acha que é ironia. Não é.',
    fala('Auditora Brill', '{O senhor|A senhora} marca comigo agora ou marca na 704 com a secretária, e na 704 demora mais, porque ela é meticulosa.'),
    'Ela tira uma agenda de bolso.',
    fala('Auditora Brill', 'Quinta que vem, quatorze e trinta. Anota.')
  ],
  ef:{flag:['marcou_com_a_presidente','convite_da_presidente'],
      registrar:'Marcou com a Presidente: quinta que vem, 14h30, sala 704.'},
  escolhas:[
    {texto:'"Antes disso, eu quero ver o viveiro."', vai:'c18_adnan', ef:{flag:'c18_fabre_brill'}},
    {texto:'"Antes disso, eu vou publicar."', vai:'c18_publicar'},
    {texto:'Aceitar e esperar a quinta.', vai:'c18_espera_a_quinta'}
  ]
},

c18_espera_a_quinta:{
  texto:[
    d=>`Faltam ${porExtenso(d.flags.c18_faltam || 6)} dias.`,
    'Você passa a primeira metade deles conferindo o que leu contra o que viu, e a segunda num estado que não é medo e não é ansiedade e pro qual você não tem palavra.',
    'Na quarta à noite, alguém bate na porta do seu quarto.',
    d=>d.flags.c18_fabre_conhecido
      ? 'É o Curador Fabre, de novo, de camisa polo, com uma sacola de padaria na mão e a cara de quem não dorme bem há tempo.'
      : 'É um homem de uns cinquenta anos, camisa polo, com uma sacola de padaria na mão e a cara de quem não dorme bem há tempo.',
    d=>d.flags.c18_fabre_conhecido ? '' : fala('Curador Fabre', 'Curador Fabre.'),
    'Ele levanta a sacola.',
    fala('Curador Fabre', 'Eu trouxe pão de queijo porque eu não sabia como começar.'),
    fala('Curador Fabre', 'A Presidente pediu pra avisar que a quinta caiu: virou reunião do conselho, e reunião do conselho não é lugar pra conversa. Eu me ofereci pra vir avisar. Era a desculpa que eu precisava.'),
    fala('Curador Fabre', 'Aqui não. Tem uma lanchonete aberta na esquina.')
  ],
  ef:{npc:{nome:'Curador Fabre', opiniao:1, memoria:'Apareceu na porta do seu quarto com uma sacola de pão de queijo.'},
      registrar:'O Curador Fabre bateu no seu quarto pra avisar que a reunião com a Presidente caiu.',
      executar:d=>{
        /* quem já viu a cara dele: no navio, na 704 ou na sala onde você é perito */
        d.flags.c18_fabre_conhecido = c18_viuFabreNoAnne(d) || Historia.jaAconteceu('c18_704_o_que_e_descarte') || c18_perito();
        Estado.marcar('conheceu_adnan');
        const n = c18_diasAteQuinta();
        d.flags.c18_faltam = n;
        Relogio.viver((n - 1) * 24 + 20 - c18_hora(d));
        return [];
      }},
  escolhas:[{texto:'Ir com ele até a lanchonete.', vai:'c18_adnan', ef:{flag:'c18_fabre_quarto'}}]
},

/* ── Luta com a Auditora ────────────────────────────────── */
c18_luta_auditora:{
  texto:[
    d=>d.flags.c18_dormiu
      ? 'Você manda o primeiro antes de pensar, porque ela entrou no seu quarto e porque você dormiu mal.'
      : 'Você manda o primeiro antes de pensar, porque ela entrou no seu quarto e porque você não dormiu.',
    'Ela não se assusta e não grita. Ela abre uma Pokébola sem levantar da cadeira, e sai um Magneton com um código de lote pintado no casco: 3-A.',
    fala('Auditora Brill', 'Isso vai constar.'),
    'Ela parece cansada.'
  ],
  batalha:{comissao:'auditora', nivel:50, tipo:'treinador', treinador:'Auditora Brill', fuga:true,
           vitoria:'c18_venceu_auditora', derrota:'c18_perdeu_auditora', fuga2:'c18_adnan', gameover:'gameover'}
},

c18_venceu_auditora:{
  texto:[
    'A última unidade cai, e ela recolhe as três sem pressa nenhuma.',
    'Ela não saca outra Pokébola. Ela senta de novo na cadeira e abre o bloco.',
    fala('Auditora Brill', 'Agressão a auditor em exercício, com resistência.'),
    'Ela escreve.',
    fala('Auditora Brill', 'Isso não é crime, porque eu não sou autoridade pública. É só um fato que vai pro meu relatório.'),
    'Ela levanta os olhos.',
    fala('Auditora Brill', 'E o relatório vai dizer que {o senhor|a senhora} bate primeiro e pergunta depois, e no mês que vem, quando eu propuser que a gente converse com {o senhor|a senhora} em vez de te classificar, eu vou perder essa votação por causa de hoje.'),
    'Ela fecha o bloco e sai. Você fica com as mãos tremendo e sem nada resolvido.'
  ],
  ef:{flag:['bateu_na_auditora'], instabilidade:2, moral:-4,
      rep:{eixo:'ruim',delta:2,motivo:'Agrediu uma auditora que tinha entrado para conversar'},
      npc:{nome:'Auditora Brill', opiniao:-2, memoria:'Você atacou primeiro.'},
      registrar:'Atacou a Auditora Brill. Vai constar no relatório dela.'},
  escolhas:[
    {texto:'Ir atrás do Curador Fabre.', vai:'c18_adnan', cond:d=>c18_sabeDeFabre(d), ef:{flag:'c18_fabre_procurou'}},
    {texto:'Ir direto pra Rota 21.', vai:'c18_fim'},
    {texto:'Correr atrás dela e pedir desculpa.', vai:'c18_pediu_desculpa'}
  ]
},

c18_pediu_desculpa:{
  texto:[
    'Você desce as escadas correndo e alcança ela no saguão.',
    c18_eu('Desculpa.'),
    'Ela para. Considera. Tira o bloco.',
    fala('Auditora Brill', 'Desculpa aceita, e vai constar também.'),
    'Ela escreve duas linhas.',
    fala('Auditora Brill', 'Não porque eu seja boa pessoa. Porque relatório incompleto é relatório errado.'),
    'Ela guarda o bloco.',
    fala('Auditora Brill', 'E porque, das duas coisas que {o senhor|a senhora} fez hoje, a segunda é a mais difícil.')
  ],
  ef:{flag:'pediu_desculpa_prado', moral:3,
      npc:{nome:'Auditora Brill', opiniao:1, memoria:'Você desceu correndo pra pedir desculpa.'},
      registrar:'Pediu desculpa à Auditora Brill. Vai constar.'},
  escolhas:[
    {texto:'Ir atrás do Curador Fabre.', vai:'c18_adnan', cond:d=>c18_sabeDeFabre(d), ef:{flag:'c18_fabre_procurou'}},
    {texto:'Ir pra Rota 21.', vai:'c18_fim'}
  ]
},

c18_perdeu_auditora:{
  texto:[
    'Você acorda na enfermaria do Centro, com seus Pokémon já atendidos e uma ficha preenchida.',
    'Na mesinha do lado tem um envelope.',
    'Dentro, a conta do atendimento, paga, e um bilhete em letra pequena.',
    '**Eu não denuncio, porque denúncia gera boletim e boletim gera imprensa. Recupere-se. A conversa continua valendo. M. Brill.**',
    'Embaixo, um cartão com o endereço da sala 704 e um horário: quinta, quatorze e trinta.'
  ],
  ef:{flag:['perdeu_pra_auditora','marcou_com_a_presidente'], moral:-3,
      npc:{nome:'Auditora Brill', opiniao:1, memoria:'Pagou o seu atendimento e não registrou boletim.'},
      registrar:'Perdeu para a Auditora Brill. Ela pagou a conta e deixou um horário.',
      executar:()=>{ Relogio.avancar(3); return []; }},
  escolhas:[
    {texto:'Ir atrás do Curador Fabre.', vai:'c18_adnan', cond:d=>c18_sabeDeFabre(d), ef:{flag:'c18_fabre_procurou'}},
    {texto:'Esperar a quinta.', vai:'c18_espera_a_quinta'},
    {texto:'Ir pra Rota 21 sem esperar ninguém.', vai:'c18_fim'}
  ]
},

/* ── O Curador Fabre ────────────────────────────────────── */
c18_adnan:{
  texto:[
    d=>{
      if (c18_viuFabreNoAnne(d)) Nomes.apresentar('o homem de sapato limpo');
      return ({
        quarto:'A lanchonete da esquina do Centro fica aberta até tarde. A sacola de pão de queijo vai fechada pro balcão, entre vocês dois.',
        elevador:'No elevador ele aperta o térreo e não fala nada até a porta abrir. Na calçada, ele aponta a lanchonete da esquina.',
        telefone:'Ele atende no segundo toque, marca na lanchonete da esquina da Rua do Comércio, ao meio-dia, e chega antes de você.',
        almoco:'Ao meio-dia e pouco, um homem de camisa polo sai do prédio, atravessa a rua e entra na lanchonete da esquina. Você entra atrás.',
        brill:'Na saída, a Auditora Brill tinha deixado anotado no seu caderno um nome e um horário: Curador Fabre, lanchonete da esquina da Rua do Comércio, meio-dia. Embaixo, sublinhado: viveiro é com ele.',
        procurou:'Você liga pra 704 e pede pra falar com o Curador Fabre. Ele atende, marca na lanchonete da esquina da Rua do Comércio, ao meio-dia, e chega antes de você.',
        bilhete:'Tem um bilhete pra você na recepção do Centro, em letra pequena de quem assina muito: lanchonete da esquina da Rua do Comércio, meio-dia, eu pago. Fabre, curador.'
      })[c18_comoFabre(d)];
    },
    d=>c18_comoFabre(d) === 'elevador' ? fala('Curador Fabre', 'Eu não almocei.') : '',
    'A lanchonete tem seis banquetas e um balcão de fórmica.',
    d=>{
      /* a cara dele: do navio, da 704 ou da porta do quarto */
      if (Historia.jaAconteceu('c18_704_o_que_e_descarte') || d.flags.c18_fabre_quarto || c18_perito()) return '';
      if (c18_viuFabreNoAnne(d))
        return 'Você lembra dele antes de lembrar de onde: é o homem de sapato limpo do S.S. Anne, sem o terno, de barba, de camisa polo e tênis de caminhada.';
      return 'O Curador Fabre tem uns cinquenta anos, camisa polo, tênis de caminhada e mãos de quem mexe com Pokémon: unha curta, um arranhão velho no antebraço.';
    },
    d=>d.flags.c18_fabre_estranho ? 'Ele te vê no balcão, para do seu lado e diz o nome antes de pedir.' : '',
    d=>d.flags.c18_fabre_estranho ? fala('Curador Fabre', 'Fabre. Curador. {O senhor|A senhora} é quem leu as cento e quarenta páginas.') : '',
    'Ele pede um queijo quente e um café e paga os dois antes de perguntar o que você quer.',
    fala('Curador Fabre', 'Eu vou te falar tudo o que {o senhor|a senhora} perguntar.'),
    fala('Curador Fabre', 'Isso não é generosidade. Está no meu contrato: transparência ativa. Eu sou obrigado.'),
    'Ele morde o sanduíche.',
    fala('Curador Fabre', 'E é ruim, porque quando eu falo tudo as pessoas param de acreditar que é ruim.')
  ],
  ef:{flag:'conheceu_adnan',
      npc:{nome:'Curador Fabre', opiniao:1, memoria:'Pagou o seu café e disse que é obrigado a falar tudo.'},
      registrar:'Conversa com o Curador Fabre numa lanchonete de Saffron.',
      executar:d=>{
        /* quem marca, marca pro meio-dia; quem desce do elevador ou da porta do quarto já está lá */
        const como = c18_comoFabre(d);
        if (como !== 'quarto' && como !== 'elevador'){
          if (c18_hora(d) < 11) c18_ate(12, true); else Relogio.amanhaAs(12);
        }
        return [];
      }},
  escolhas:[
    {texto:'"Por que você votou contra a Fase II?"', vai:'c18_adnan_voto', cond:d=>!!d.flags.sabe_do_voto_vencido},
    {texto:'"Quantos você matou?"', vai:'c18_adnan_quantos'},
    {texto:'"Por que você entrou nisso?"', vai:'c18_adnan_porque_entrou'},
    {texto:'"Me convence. Sério. Tenta."', vai:'c18_adnan_doutrina'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'}
  ]
},

c18_adnan_voto:{
  texto:[
    fala('Curador Fabre', 'Porque está errado.'),
    'Ele fala de boca cheia e não pede desculpa.',
    fala('Curador Fabre', 'E não errado moralmente. Errado tecnicamente.'),
    'Ele empurra o prato e usa o guardanapo para desenhar.',
    fala('Curador Fabre', 'O Art. 11 justifica o método pela reversibilidade. É esse o argumento inteiro: a gente faz porque dá para desfazer.'),
    'Ele risca o guardanapo.',
    fala('Curador Fabre', 'Soltar quatrocentos em ambiente aberto não é reversível. Nunca foi. Em dois anos não tem como recolher, em cinco você não sabe mais quem é seu e quem não é.'),
    d=>fala(d.jogador.nome, 'E eles responderam o quê?'),
    fala('Curador Fabre', 'Que reversível, no estatuto, é conceito jurídico e não ecológico.'),
    'Ele amassa o guardanapo.',
    fala('Curador Fabre', 'E eles estão certos. Está escrito assim mesmo. Eu perdi por dez a um porque eu estava errado sobre o que a palavra queria dizer.')
  ],
  ef:{flag:'entende_o_adnan', instabilidade:1,
      npc:{nome:'Curador Fabre', opiniao:2, memoria:'Te explicou por que perdeu por dez a um.'},
      registrar:'Fabre perdeu a discussão porque reversível, no estatuto deles, é conceito jurídico.'},
  escolhas:[
    {texto:'"Quantos você matou?"', vai:'c18_adnan_quantos'},
    {texto:'"E por que você continua?"', vai:'c18_adnan_porque_continua'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'}
  ]
},

c18_adnan_quantos:{
  texto:[
    'Ele mastiga até o fim, engole, toma um gole de café e responde com um número exato.',
    fala('Curador Fabre', 'Quatrocentos e dezenove.'),
    'Silêncio de fórmica.',
    fala('Curador Fabre', 'Eu sei o número porque eu assino cada um. É dupla assinatura, e a segunda é sempre minha, porque eu fiz questão que fosse na reunião de posse.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('Curador Fabre', 'Porque se for sempre minha, alguém está contando.'),
    'Ele gira a xícara.',
    fala('Curador Fabre', 'Se rodar entre quatro pessoas, ninguém sabe quantos foram, e no dia em que ninguém souber quantos foram, o número pode ser qualquer um.')
  ],
  ef:{flag:'sabe_dos_419', instabilidade:2,
      npc:{nome:'Curador Fabre', opiniao:2, memoria:'Assina todos os formulários de propósito, para alguém estar contando.'},
      registrar:'Fabre assina todos os 419 para que sempre haja alguém contando.'},
  escolhas:[
    {texto:'"Isso não te absolve."', vai:'c18_adnan_nao_absolve'},
    {texto:'"E por que você continua?"', vai:'c18_adnan_porque_continua'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'}
  ]
},

c18_adnan_nao_absolve:{
  texto:[
    fala('Curador Fabre', 'Não.'),
    'Ele concorda antes de você terminar.',
    fala('Curador Fabre', 'Não absolve nada. Eu não estou pedindo absolvição, {moço|moça}, eu estou te explicando o desenho.'),
    'Ele limpa a boca.',
    fala('Curador Fabre', 'Se eu sair hoje, amanhã tem outro curador, e o outro curador vai aceitar a rotação de assinatura porque é mais prático, e o número some.'),
    d=>fala(d.jogador.nome, 'Isso é o argumento mais velho do mundo.'),
    fala('Curador Fabre', 'É.'),
    'Ele olha para você sem raiva nenhuma.',
    fala('Curador Fabre', 'E é o argumento mais velho do mundo porque às vezes é verdade, e o problema é exatamente esse: não dá para saber de dentro.')
  ],
  ef:{instabilidade:1, moral:-2,
      registrar:'Fabre sabe que o argumento dele é o argumento mais velho do mundo.'},
  escolhas:[
    {texto:'"Então sai e conta tudo."', vai:'c18_adnan_sai_e_conta'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'},
    {texto:'"Me convence. Tenta."', vai:'c18_adnan_doutrina'}
  ]
},

c18_adnan_sai_e_conta:{
  texto:[
    'Ele fica quieto por um tempo comprido, olhando o balcão.',
    fala('Curador Fabre', 'Eu já escrevi a carta de demissão quatro vezes.'),
    'Ele tira a carteira, abre, e tira um papel dobrado em quatro que está claramente ali há muito tempo.',
    'É uma carta de demissão datilografada, com a data em branco.',
    fala('Curador Fabre', 'Eu carrego desde o oitavo mês. Eu não assino porque toda vez eu penso na mesma coisa: eu saio e vira o quê, uma entrevista? Um dia de jornal?'),
    'Ele dobra e guarda de volta.',
    fala('Curador Fabre', 'Se {o senhor|a senhora} me der um motivo melhor que o que eu tenho, eu assino hoje. Eu falo sério.')
  ],
  ef:{flag:['adnan_tem_a_carta'], instabilidade:1,
      npc:{nome:'Curador Fabre', opiniao:3, memoria:'Te mostrou a carta de demissão que carrega na carteira.'},
      registrar:'Fabre carrega uma carta de demissão sem data na carteira desde o oitavo mês.'},
  escolhas:[
    {texto:'"O motivo é que eu vou publicar, e você vai ser fonte com nome."', vai:'c18_adnan_fonte', cond:d=>!!d.flags.quer_publicar || !!d.flags.publicou},
    {texto:'"O motivo é a Fase II. Ela solta no primeiro semestre."', vai:'c18_adnan_fase2', cond:d=>!!d.flags.sabe_da_fase2},
    {texto:'"Eu não tenho motivo melhor."', vai:'c18_adnan_sem_motivo'},
    {texto:'"Não assina. Fica lá dentro e me passa informação."', vai:'c18_adnan_fica_dentro'}
  ]
},

c18_adnan_fonte:{
  texto:[
    d=>fala(d.jogador.nome, 'Você vai ser fonte com nome, e com nome eles não conseguem dizer que é boato.'),
    'Ele pega a carta de novo. Olha para o campo da data.',
    fala('Curador Fabre', 'Com nome eu não trabalho mais com Pokémon nunca mais na vida.'),
    'Ele fala isso sem drama.',
    fala('Curador Fabre', 'Registro em conselho, {moço|moça}. Eu viro o técnico que denunciou o empregador. Ninguém contrata.'),
    d=>fala(d.jogador.nome, 'Eu sei.'),
    fala('Curador Fabre', '{O senhor|A senhora} sabe e está pedindo do mesmo jeito.'),
    'Ele ri curto.',
    fala('Curador Fabre', 'Tudo bem. Eu gosto mais assim do que se {o senhor|a senhora} fingisse que não custa nada.'),
    'Ele preenche a data com a caneta do balcão.'
  ],
  ef:{flag:['adnan_assinou','adnan_e_fonte'], instabilidade:1,
      npc:{nome:'Curador Fabre', opiniao:4, memoria:'Assinou a carta de demissão na sua frente, num balcão de lanchonete.'},
      rep:{eixo:'bom',delta:2,motivo:'Convenceu um curador a sair com nome e cara'},
      registrar:'Fabre assinou a demissão e aceitou ser fonte com nome.'},
  escolhas:[
    {texto:'"Então me leva no viveiro antes de entregar."', vai:'c18_pedido_viveiro'},
    {texto:'"Traz tudo o que você tiver."', vai:'c18_adnan_traz_tudo'}
  ]
},

c18_adnan_traz_tudo:{
  texto:[
    'Ele volta duas horas depois com uma sacola de supermercado.',
    'Dentro: cópia de sessenta e um formulários de descarte, o croqui atualizado da Estação 4, três atas de reunião fechada, as do livro que não se publica, e um envelope com fotos.',
    'As fotos são de incubadora, de galpão, de cerca. São ruins, tremidas, de máquina descartável.',
    'A nona foto é de dentro do galpão do fundo, o que não tem número.',
    fala('Curador Fabre', 'Essa aí é o motivo pelo qual eu escrevi a carta a primeira vez.')
  ],
  ef:{flag:['tem_as_atas_fechadas','tem_a_foto_do_g'],
      itens:{'Sacola do Fabre':1}, instabilidade:2,
      registrar:'Fabre entregou 61 formulários, 3 atas fechadas e fotos do galpão do fundo.',
      executar:()=>{ Relogio.avancar(2); return []; }},
  escolhas:[
    {texto:'Olhar a nona foto.', vai:'c18_nona_foto'},
    {texto:'Não olhar. Levar tudo pra Livia.', vai:'c18_fim', cond:d=>!!d.flags.contato_isaura},
    {texto:'Não olhar. Guardar tudo e ir pra Rota 21.', vai:'c18_fim', cond:d=>!d.flags.contato_isaura},
    {texto:'"Me leva lá."', vai:'c18_pedido_viveiro'}
  ]
},

c18_nona_foto:{
  texto:[
    'É uma sala comprida com piso de cimento, com ralo no meio e mangueira enrolada na parede.',
    'Na parede do fundo tem um quadro branco, e no quadro, em três colunas, os cabeçalhos: LOTE / MOTIVO / DATA.',
    'A coluna do motivo está preenchida até embaixo, sempre com abreviação: MALF., AGR., DOEN., N/VIÁV.',
    'A última linha diz N/VIÁV, e a data é de anteontem.',
    'Não tem Pokémon nenhum na foto. É uma sala limpa e organizada, e é a coisa mais insuportável que você viu em toda a sua vida, e você já viu coisas.'
  ],
  ef:{instabilidade:2, moral:-4,
      registrar:'A foto do galpão do fundo: uma sala limpa, com ralo, mangueira e um quadro de lote, motivo e data.'},
  escolhas:[
    {texto:'"Me leva lá."', vai:'c18_pedido_viveiro'},
    {texto:'Levar tudo pra Livia.', vai:'c18_fim', cond:d=>!!d.flags.contato_isaura},
    {texto:'Guardar tudo e ir pra Rota 21.', vai:'c18_fim', cond:d=>!d.flags.contato_isaura}
  ]
},

c18_adnan_fase2:{
  texto:[
    c18_eu('A Fase II solta quatrocentos no primeiro semestre. Você votou contra e perdeu, e quando soltar, a discussão acabou pra sempre, porque não dá pra recolher.'),
    'Ele para de mexer no café.',
    fala('Curador Fabre', '{O senhor|A senhora} acabou de usar o meu argumento contra mim.'),
    c18_eu('Eu usei o seu argumento porque ele é bom.'),
    'Ele olha a carta dobrada.',
    fala('Curador Fabre', 'Primeiro semestre.'),
    'Ele repete duas vezes, baixinho, como quem confere uma conta.',
    fala('Curador Fabre', 'Tudo bem. Tudo bem.'),
    'Ele preenche a data.'
  ],
  ef:{flag:['adnan_assinou','adnan_e_fonte'], instabilidade:1,
      npc:{nome:'Curador Fabre', opiniao:4, memoria:'Assinou por causa do prazo da Fase II.'},
      rep:{eixo:'bom',delta:2,motivo:'Usou o argumento dele contra ele, e ele aceitou'},
      registrar:'Fabre assinou a demissão por causa do prazo da Fase II.'},
  escolhas:[
    {texto:'"Traz tudo o que você tiver."', vai:'c18_adnan_traz_tudo'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'}
  ]
},

c18_adnan_sem_motivo:{
  texto:[
    c18_eu('Eu não tenho motivo melhor.'),
    'Ele acena com a cabeça, devagar, e guarda a carta de volta na carteira.',
    fala('Curador Fabre', 'Obrigado por não inventar um.'),
    'Ele termina o café.',
    fala('Curador Fabre', '{O senhor|A senhora} é a primeira pessoa que não tentou me convencer com uma frase bonita. Todo mundo tenta a frase bonita, e eu já ouvi todas.'),
    'Ele paga a conta dos dois.',
    fala('Curador Fabre', 'Eu vou continuar lá dentro, contando. Quando eu tiver motivo, eu assino. E se {o senhor|a senhora} arrumar o motivo, me procura.')
  ],
  ef:{flag:'adnan_espera_motivo',
      npc:{nome:'Curador Fabre', opiniao:3, memoria:'Você não inventou uma frase bonita para convencê-lo.'},
      registrar:'Fabre continua na Comissão, contando, esperando um motivo.'},
  escolhas:[
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'},
    {texto:'"Me arruma um crachá."', vai:'c18_pedir_cracha', cond:d=>!c18_perito()}
  ]
},

c18_adnan_fica_dentro:{
  texto:[
    c18_eu('Não assina. Fica lá dentro e me passa informação.'),
    'Ele para com a xícara no meio do caminho.',
    fala('Curador Fabre', '{O senhor|A senhora} está me pedindo pra virar o que eu passei um ano e meio me convencendo de que eu não sou.'),
    c18_eu('Estou.'),
    'Ele pousa a xícara.',
    fala('Curador Fabre', 'Tudo bem.'),
    'Ele diz isso, e alguma coisa no rosto dele afrouxa.',
    fala('Curador Fabre', 'Sabe por quê? Porque assim eu continuo contando, e {o senhor|a senhora} passa a contar comigo. Dois contando é mais difícil de perder a conta.'),
    'Ele escreve um número de telefone no guardanapo.',
    fala('Curador Fabre', 'Nunca liga antes das oito da noite. Depois das oito eu estou em casa, e a casa é minha.')
  ],
  ef:{flag:['adnan_e_infiltrado','telefone_do_adnan'],
      npc:{nome:'Curador Fabre', opiniao:3, memoria:'Aceitou continuar dentro e te passar informação.'},
      registrar:'Fabre fica dentro da Comissão e passa informação. Ligar só depois das 20h.'},
  escolhas:[
    {texto:'"Me arruma um crachá."', vai:'c18_pedir_cracha', cond:d=>!c18_perito()},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'}
  ]
},

c18_adnan_porque_entrou:{
  texto:[
    fala('Curador Fabre', 'Eu trabalhava no zoológico de Celadon.'),
    'Ele fala isso como quem fala de outra vida.',
    fala('Curador Fabre', 'Dezoito anos. Eu era bom.'),
    c18_eu('E aí?'),
    fala('Curador Fabre', 'E aí o zoológico fechou, porque zoológico não dá dinheiro e ninguém quer pagar. Distribuíram os Pokémon, e eu fui junto com três deles pra um sítio particular em Fuchsia, e no sítio particular eu fiquei quatro meses vendo gente rica achar graça.'),
    'Ele mexe o café que já acabou.',
    fala('Curador Fabre', 'Aí me ligaram. Salário melhor, contrato de verdade, e a frase que me pegou foi: aqui o senhor vai decidir, não vai só executar.'),
    'Ele sorri sem alegria.',
    fala('Curador Fabre', 'Eu decidi uma vez e perdi por dez a um.')
  ],
  ef:{npc:{nome:'Curador Fabre', opiniao:2, memoria:'Te contou do zoológico de Celadon que fechou.'},
      registrar:'Fabre trabalhou 18 anos no zoológico de Celadon antes de o zoológico fechar.'},
  escolhas:[
    {texto:'"Quantos você matou?"', vai:'c18_adnan_quantos'},
    {texto:'"Me convence. Tenta."', vai:'c18_adnan_doutrina'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'}
  ]
},

c18_adnan_porque_continua:{
  texto:[
    d=>fala(d.jogador.nome, 'Por que você continua?'),
    'Ele respira fundo e responde com uma coisa que você não esperava.',
    fala('Curador Fabre', 'No mês passado chegou uma fêmea de Nidorina com fratura exposta na pata, de armadilha. Parâmetro de viabilidade não atende: fratura exposta é descarte.'),
    d=>fala(d.jogador.nome, 'E?'),
    fala('Curador Fabre', 'E eu passei duas horas na reunião argumentando redução de perda funcional com imobilização de oito semanas, com literatura, com custo estimado.'),
    'Ele levanta os olhos.',
    fala('Curador Fabre', 'E eu ganhei. Sete a quatro.'),
    d=>fala(d.jogador.nome, 'E ela está?'),
    fala('Curador Fabre', 'Mancando. Viva. Num galpão.'),
    'Ele pousa as duas mãos no balcão.',
    fala('Curador Fabre', 'É por isso que eu continuo. Por uma. E eu sei exatamente o que isso soa e eu não tenho resposta melhor.')
  ],
  ef:{instabilidade:1, moral:-1,
      npc:{nome:'Curador Fabre', opiniao:3, memoria:'Ganhou uma votação, uma vez, e é por isso que continua.'},
      registrar:'Fabre continua porque ganhou uma votação, uma vez, por uma Nidorina.'},
  escolhas:[
    {texto:'"Então sai e conta tudo."', vai:'c18_adnan_sai_e_conta'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'},
    {texto:'"Me convence. Tenta."', vai:'c18_adnan_doutrina'}
  ]
},

c18_adnan_doutrina:{
  texto:[
    fala('Curador Fabre', '{O senhor|A senhora} pediu.'),
    'Ele afasta o prato e fica sério de um jeito diferente.',
    ...COMISSAO.doutrina.map(t => fala('Curador Fabre', t.replace(/^"|"$/g, ''))),
    'Ele para. Não tem triunfo nenhum na cara dele.',
    fala('Curador Fabre', '{O senhor|A senhora} tem resposta?')
  ],
  ef:{flag:'ouviu_a_doutrina', instabilidade:1,
      registrar:'Ouviu o argumento inteiro da Comissão, dito por quem acredita nele.'},
  escolhas:[
    {texto:'"Tenho: quem decide quem é risco?"', vai:'c18_resposta_quem_decide'},
    {texto:'"Tenho: a criança de onze anos era uma pessoa. Vocês são um estatuto."', vai:'c18_resposta_pessoa'},
    {texto:'"Não tenho."', vai:'c18_sem_resposta'},
    {texto:'"Tenho: vocês numeraram eles."', vai:'c18_resposta_numero', cond:d=>!!d.flags.viu_a_lista_de_riscos}
  ]
},

c18_resposta_quem_decide:{
  texto:[
    c18_eu('Quem decide quem é risco?'),
    fala('Curador Fabre', 'O conselho, por maioria, em reunião com quórum, e consta em ata.'),
    'Ele responde na hora, porque a resposta existe.',
    c18_eu('E quem elege o conselho?'),
    'Ele para.',
    fala('Curador Fabre', 'Os associados.'),
    c18_eu('E quem são os associados?'),
    'Ele demora bem mais desta vez.',
    fala('Curador Fabre', 'Onze pessoas.'),
    'Ele diz baixo.',
    fala('Curador Fabre', 'As mesmas onze.'),
    'Você não diz mais nada. Ele também não. O sanduíche esfria.'
  ],
  ef:{flag:'acertou_a_pergunta', instabilidade:1,
      npc:{nome:'Curador Fabre', opiniao:3, memoria:'Você fez a pergunta que ele não sabia responder.'},
      rep:{eixo:'bom',delta:1,motivo:'Fez a pergunta certa e esperou em silêncio'},
      registrar:'Onze pessoas elegem o conselho que elege as onze pessoas.'},
  escolhas:[
    {texto:'"Então sai e conta tudo."', vai:'c18_adnan_sai_e_conta'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'},
    {texto:'"Me arruma um crachá."', vai:'c18_pedir_cracha', cond:d=>!c18_perito()}
  ]
},

c18_resposta_pessoa:{
  texto:[
    c18_eu('A criança de onze anos era uma pessoa. Vocês são um estatuto.'),
    fala('Curador Fabre', 'Sim.'),
    'Ele concorda sem hesitar.',
    fala('Curador Fabre', 'E é essa a nossa vantagem, e é esse o nosso problema.'),
    c18_eu('Explica.'),
    fala('Curador Fabre', 'A criança de onze anos resolveu uma vez, por acaso, e isso não se repete de propósito. Se ela tivesse morrido no meio, a gente estava perdido.'),
    'Ele abre as mãos.',
    fala('Curador Fabre', 'Estatuto não morre no meio. Estatuto continua.'),
    'Ele junta as mãos de novo.',
    fala('Curador Fabre', 'E estatuto também não muda de ideia quando vê uma coisa bonita. É isso que {o senhor|a senhora} está tentando dizer, e {o senhor|a senhora} está cert{o|a}.')
  ],
  ef:{instabilidade:1,
      npc:{nome:'Curador Fabre', opiniao:2, memoria:'Admitiu que estatuto não muda de ideia quando vê uma coisa bonita.'},
      registrar:'Estatuto não morre no meio. E também não muda de ideia.'},
  escolhas:[
    {texto:'"Então sai e conta tudo."', vai:'c18_adnan_sai_e_conta'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'},
    {texto:'"Me arruma um crachá."', vai:'c18_pedir_cracha', cond:d=>!c18_perito()}
  ]
},

c18_resposta_numero:{
  texto:[
    c18_eu('Vocês numeraram eles.'),
    'Ele não entende no primeiro segundo. No segundo, entende, e a cara dele muda.',
    c18_eu('Risco 01. Risco 02. Eu vi a tabela. Nove linhas.'),
    fala('Curador Fabre', 'É classificação de prioridade operacional.'),
    d=>c18_lendariosVistos(d)
      ? fala(d.jogador.nome, 'Eu sei o que é. Eu vi um deles de perto.')
      : fala(d.jogador.nome, 'Eu sei o que é.'),
    'Você fala baixo, porque não precisa falar alto.',
    d=>c18_lendariosVistos(d)
      ? fala(d.jogador.nome, 'Respirando. E ele tem um jeito de virar a cabeça.')
      : fala(d.jogador.nome, 'E sei que cada linha dessas respira em algum lugar.'),
    'Ele olha o balcão por um tempo comprido.',
    fala('Curador Fabre', 'Eu nunca vi nenhum dos nove.'),
    fala('Curador Fabre', 'Essa é a coisa mais desonesta do meu trabalho.')
  ],
  ef:{instabilidade:2, moral:2,
      npc:{nome:'Curador Fabre', opiniao:4, memoria:'Admitiu que nunca viu nenhum dos nove que classifica.'},
      rep:{eixo:'bom',delta:1,motivo:'Contou a um burocrata como um deles vira a cabeça'},
      registrar:'Fabre nunca viu nenhum dos nove riscos que ajuda a classificar.'},
  escolhas:[
    {texto:'"Então vem ver comigo."', vai:'c18_adnan_vem_ver'},
    {texto:'"Então sai e conta tudo."', vai:'c18_adnan_sai_e_conta'},
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'}
  ]
},

c18_adnan_vem_ver:{
  texto:[
    c18_eu('Vem ver comigo.'),
    'Ele ri sem querer, uma risada curta de susto.',
    fala('Curador Fabre', 'Eu tenho quarenta e sete anos e uma hérnia de disco.'),
    c18_eu('Eu não perguntei a sua idade.'),
    'Ele fica quieto.',
    fala('Curador Fabre', 'Se eu for, eu não consigo mais assinar.'),
    'Ele diz isso como constatação técnica.',
    fala('Curador Fabre', 'É por isso que ninguém lá dentro vai a campo. Não é preguiça. É desenho.'),
    'Ele bate no balcão uma vez, decidindo.',
    fala('Curador Fabre', 'Depois da Rota 21. Se {o senhor|a senhora} voltar de lá, eu vou com {o senhor|a senhora} aonde {o senhor|a senhora} quiser, e aí eu não assino mais nada.')
  ],
  ef:{flag:['adnan_promete_ir'], instabilidade:1,
      npc:{nome:'Curador Fabre', opiniao:4, memoria:'Prometeu ir a campo com você depois da Rota 21.'},
      registrar:'Fabre prometeu ir ver com os próprios olhos, depois da Rota 21.'},
  escolhas:[
    {texto:'"Me leva no viveiro, então."', vai:'c18_pedido_viveiro'},
    {texto:'"Me arruma um crachá."', vai:'c18_pedir_cracha', cond:d=>!c18_perito()}
  ]
},

c18_sem_resposta:{
  texto:[
    c18_eu('Não tenho.'),
    'Ele não comemora. Ele parece, pela primeira vez, decepcionado.',
    fala('Curador Fabre', 'Eu queria que {o senhor|a senhora} tivesse.'),
    'Ele empurra a xícara pra beirada do balcão, pro moço recolher.',
    fala('Curador Fabre', 'Eu faço esse discurso há um ano e meio, e eu já ganhei doze vezes e perdi zero. E cada vez que eu ganho, eu fico um pouco pior.'),
    'Ele levanta.',
    fala('Curador Fabre', 'Pensa numa. Pensa numa e me procura. Eu estou falando sério, e eu não deveria.')
  ],
  ef:{instabilidade:1, moral:-3,
      npc:{nome:'Curador Fabre', opiniao:2, memoria:'Queria que você tivesse resposta e você não tinha.'},
      registrar:'Fabre já venceu doze vezes esse debate e piora a cada vitória.'},
  escolhas:[
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'},
    {texto:'"Espera. Quem decide quem é risco?"', vai:'c18_resposta_quem_decide'},
    {texto:'Deixá-lo ir.', vai:'c18_oferta'}
  ]
},

c18_oferta:{
  texto:[
    'Ele já está de pé quando volta e senta de novo.',
    fala('Curador Fabre', 'Eu vou fazer uma coisa que eu tenho que fazer e que eu odeio.'),
    'Ele tira do bolso um envelope e põe no balcão sem empurrar.',
    fala('Curador Fabre', 'Proposta. Técnico de campo sênior, com registro, com salário, com plano de saúde. Está no meu contrato oferecer a quem tem perfil, e {o senhor|a senhora} tem o melhor perfil que eu vi desde que entrei.'),
    d=>c18_perito()
      ? fala('Curador Fabre', 'Perito fala antes da votação. Técnico de campo vai a campo e assina embaixo. É outra cadeira.')
      : c18_bolsista(d)
        ? fala('Curador Fabre', 'A bolsa {o senhor|a senhora} já recebe. Isso aqui é outra coisa.')
        : '',
    c18_eu('Vocês estão me contratando.'),
    fala('Curador Fabre', 'Nós estamos te convidando, e a diferença entre as duas coisas é exatamente o que {o senhor|a senhora} decidir agora.')
  ],
  ef:{flag:'recebeu_a_oferta',
      registrar:'A CGRB te ofereceu uma vaga de técnico de campo sênior.'},
  escolhas:[
    {texto:'Aceitar.', vai:'c18_entrou_na_comissao'},
    {texto:'Recusar.', vai:'c18_recusou_a_oferta'},
    {texto:'"Eu aceito o crachá e não o emprego."', vai:'c18_pedir_cracha', cond:d=>!c18_perito()},
    {texto:'Rasgar o envelope em cima do balcão.', vai:'c18_rasgou'}
  ]
},

c18_entrou_na_comissao:{
  texto:[
    d=>c18_perito()
      ? 'Você assina o segundo contrato da sua vida com a Comissão. O primeiro era de quem fala antes da votação.'
      : 'Você assina.',
    'Leva quatro minutos e uma cópia de documento, e ele já estava com o carbono preparado, o que diz alguma coisa sobre a expectativa dele.',
    'A matrícula sai em dois dias. O crachá tem sua foto, sua validade e um número.',
    'No verso do crachá, em letra miúda, está impresso o Art. 4º inteiro.',
    'Você passa o polegar nele sem querer e percebe que já sabe de cor.'
  ],
  ef:{flag:['trabalha_para_comissao','tem_cracha_proprio'], instabilidade:1, moral:-3,
      rep:{eixo:'ruim',delta:1,motivo:'Entrou para a Comissão'},
      itens:{'Crachá da CGRB':1},
      registrar:'Assinou contrato com a CGRB. Técnico de campo sênior.',
      executar:()=>{ Relogio.viver(2 * 24); return []; }},
  escolhas:[
    {texto:'"Qual o meu primeiro serviço?"', vai:'c18_primeiro_servico'},
    {texto:'"Eu assinei pra entrar, não pra servir."', vai:'c18_era_teste'}
  ]
},

c18_primeiro_servico:{
  texto:[
    fala('Curador Fabre', 'Estação 4, Rota 21.'),
    'Ele diz na hora, porque já estava escrito.',
    fala('Curador Fabre', 'Apoio à Fase II. Três semanas.'),
    d=>fala(d.jogador.nome, 'O que eu vou fazer lá?'),
    fala('Curador Fabre', 'Contagem, pesagem e liberação.'),
    'Ele engole.',
    fala('Curador Fabre', 'E, se der um problema, {o senhor|a senhora} vai preencher o formulário e eu vou assinar embaixo.'),
    'Ele estende a mão.',
    fala('Curador Fabre', 'E se {o senhor|a senhora} for o que eu acho que {o senhor|a senhora} é, no fim das três semanas {o senhor|a senhora} vai ter uma decisão para tomar, e eu não vou poder te ajudar.')
  ],
  ef:{flag:['vai_pro_viveiro','sabe_da_rota21','sabe_da_estacao4'],
      registrar:'Primeiro serviço: Estação 4, Rota 21, apoio à Fase II, três semanas.'},
  escolhas:[{texto:'Ir para a Rota 21.', vai:'c18_fim'}]
},

c18_era_teste:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu assinei para entrar, não para servir.'),
    'Ele guarda o carbono com cuidado.',
    fala('Curador Fabre', 'Eu sei.'),
    'Você fica sem chão por um segundo.',
    fala('Curador Fabre', '{O senhor|A senhora} acha que a gente não previu?'),
    'Ele não está debochando.',
    fala('Curador Fabre', 'Está no meu relatório de recrutamento: candidatos de alto perfil frequentemente ingressam com intenção de obstrução. Recomenda-se contratar assim mesmo.'),
    d=>fala(d.jogador.nome, 'Por quê?'),
    fala('Curador Fabre', 'Porque de dentro {o senhor|a senhora} vai ver a planilha inteira, e quem vê a planilha inteira ou sai destruído ou concorda.'),
    'Ele levanta.',
    fala('Curador Fabre', 'E os dois servem pra gente.')
  ],
  ef:{flag:['trabalha_para_comissao','sabe_que_e_teste'], instabilidade:2,
      registrar:'A Comissão contrata de propósito quem entra para obstruir.'},
  escolhas:[
    {texto:'Ir para a Rota 21 mesmo assim.', vai:'c18_primeiro_servico'},
    {texto:'Rasgar o contrato agora.', vai:'c18_rasgou'}
  ]
},

c18_recusou_a_oferta:{
  texto:[
    c18_eu('Não.'),
    'Ele guarda o envelope no bolso, sem insistir, e paga a conta.',
    fala('Curador Fabre', 'Anotado. Eu vou escrever que {o senhor|a senhora} recusou por convicção e não por preço, porque é o que eu acho, e o relatório é meu.'),
    'Na porta da lanchonete, ele para.',
    fala('Curador Fabre', 'Uma coisa. {O senhor|A senhora} recusando não me irrita. {O senhor|A senhora} recusando e indo embora, sim.'),
    'Ele enfia as mãos no bolso.',
    fala('Curador Fabre', 'Porque aí sobra eu, e eu perco por dez a um.')
  ],
  ef:{flag:'recusou_comissao',
      rep:{eixo:'bom',delta:1,motivo:'Recusou a vaga na Comissão'},
      npc:{nome:'Curador Fabre', opiniao:2, memoria:'Você recusou por convicção e ele fez questão de escrever isso.'},
      registrar:'Recusou a vaga na CGRB.'},
  escolhas:[
    {texto:'"Me leva no viveiro, então."', vai:'c18_pedido_viveiro'},
    {texto:'"Me arruma um crachá."', vai:'c18_pedir_cracha', cond:d=>!c18_perito()},
    {texto:'Ir embora.', vai:'c18_fim'}
  ]
},

c18_rasgou:{
  texto:[
    'Você rasga o envelope no meio, em cima do balcão de fórmica, e as duas metades ficam ali.',
    'O moço da lanchonete olha e não fala nada, porque em lanchonete de esquina já se viu de tudo.',
    'O Curador Fabre junta os pedaços, alinha, e guarda no bolso.',
    fala('Curador Fabre', 'Eu vou ter que anexar.'),
    'Ele não está sendo irônico. Ele vai anexar mesmo. Vai grampear os pedaços num formulário, e alguém vai arquivar por dez anos.'
  ],
  ef:{flag:'rasgou_a_oferta', limpaFlag:'trabalha_para_comissao',
      rep:{eixo:'bom',delta:1,motivo:'Rasgou o contrato na frente de quem o ofereceu'},
      registrar:'Rasgou a proposta da CGRB. Ele juntou os pedaços para anexar.'},
  escolhas:[
    {texto:'"Me leva no viveiro."', vai:'c18_pedido_viveiro'},
    {texto:'Ir embora pra Rota 21 sozinh{o|a}.', vai:'c18_fim'}
  ]
},

c18_pedir_cracha:{
  texto:[
    d=>fala(d.jogador.nome, 'Me arruma um crachá.'),
    'Ele olha para o teto da lanchonete por uns três segundos, fazendo uma conta que você não vê.',
    fala('Curador Fabre', 'O meu tem foto.'),
    d=>fala(d.jogador.nome, 'O seu não. Outro.'),
    fala('Curador Fabre', 'Tem o da Elda, que está de licença.'),
    'Ele fala devagar, ouvindo a si mesmo cometer o erro.',
    fala('Curador Fabre', 'Ela deixou na gaveta porque licença-maternidade não devolve crachá.'),
    'Ele passa a mão na cara.',
    fala('Curador Fabre', 'Quarenta e oito horas. Se não voltar em quarenta e oito horas, eu comunico o extravio e a culpa é minha, não dela. Isso não é negociável.')
  ],
  ef:{flag:['cracha_adnan','prazo_48h'], itens:{'Crachá da Elda (CGRB)':1},
      npc:{nome:'Curador Fabre', opiniao:2, memoria:'Te emprestou o crachá de uma colega em licença, assumindo a culpa.'},
      registrar:'Crachá emprestado da CGRB. 48 horas.'},
  escolhas:[
    {texto:'"Combinado. Quarenta e oito horas."', vai:'c18_pedido_viveiro'},
    {texto:'"Me leva junto."', vai:'c18_adnan_vem_ver'}
  ]
},

c18_pedido_viveiro:{
  texto:[
    c18_eu('Me leva no viveiro.'),
    fala('Curador Fabre', 'Eu não posso.'),
    'Ele diz isso rápido, decorado.',
    fala('Curador Fabre', 'Mas eu também não posso te impedir de andar pela Rota 21, porque é rota pública e eu não sou autoridade.'),
    'Ele deixa o dinheiro do lanche na fórmica e se levanta.',
    fala('Curador Fabre', 'Estação 4. Depois da curva grande, do lado do mar. Tem cerca, tem placa e tem câmera, e nada disso é ilegal.'),
    'Ele põe a banqueta no lugar, porque é o tipo de pessoa que põe a banqueta no lugar.',
    fala('Curador Fabre', 'Uma coisa só.'),
    'Ele para.',
    fala('Curador Fabre', 'Quando {o senhor|a senhora} entrar, não olha as incubadoras primeiro. Olha o galpão do fundo. As incubadoras são o que a gente mostra pra imprensa.')
  ],
  ef:{flag:['sabe_da_rota21','sabe_do_galpao_do_fundo','vai_pro_viveiro','sabe_da_estacao4'],
      npc:{nome:'Curador Fabre', opiniao:3, memoria:'Te disse onde é a Estação 4 e o que olhar primeiro.'},
      registrar:'Estação 4, Rota 21. Olhar o galpão do fundo, não as incubadoras.'},
  escolhas:[
    {texto:'"Por que você está me ajudando?"', vai:'c18_porque_ajuda'},
    {texto:'Ir pra Rota 21.', vai:'c18_fim'}
  ]
},

c18_porque_ajuda:{
  texto:[
    'Ele fica de costas por um tempo antes de responder.',
    fala('Curador Fabre', 'Porque eu assino quatrocentos e dezenove formulários e nenhum deles me acorda de noite, e isso me assusta muito mais do que se acordasse.'),
    'Ele se vira.',
    fala('Curador Fabre', 'Eu preciso que alguém de fora olhe, porque eu já não consigo. Eu vejo lote. Eu vejo motivo. Eu vejo data.'),
    'Ele põe a mão no batente da porta.',
    fala('Curador Fabre', '{O senhor|A senhora} ainda vê Pokémon. Vai lá e olha enquanto {o senhor|a senhora} ainda vê.')
  ],
  ef:{flag:'entende_o_adnan', moral:3, instabilidade:1,
      npc:{nome:'Curador Fabre', opiniao:4, memoria:'Te mandou olhar enquanto você ainda vê Pokémon.'},
      registrar:'Fabre já não vê Pokémon. Vê lote, motivo e data.'},
  escolhas:[{texto:'Ir pra Rota 21.', vai:'c18_fim'}]
},

/* ── Fim ────────────────────────────────────────────────── */
c18_fim:{
  texto:[
    d=>{
      if (d.flags.trabalha_para_comissao) return 'Você pega a estrada pra Rota 21 com um contrato assinado, um número de matrícula que ainda não decorou e um crachá com o Art. 4º impresso no verso.';
      if (d.flags.cracha_adnan) return 'Você pega a estrada pra Rota 21 com o crachá de outra pessoa no bolso e quarenta e oito horas correndo contra ela.';
      if (d.flags.ignorou_a_comissao) return 'Você continua pro norte por mais dois dias, e a frase vai junto, com o número do artigo e tudo. No terceiro, sem ter decidido nada, você está de novo na rodoviária de Saffron, olhando o quadro de horários do sul.';
      if (d.flags.publicou) return 'Você pega a estrada pra Rota 21 com um recorte de jornal dobrado no bolso e a sensação exata de quanto isso pesa, que é quase nada.';
      return 'Você pega a estrada pra Rota 21 sem crachá, sem convite e sem plano.';
    },
    d=>d.flags.ignorou_a_comissao
      ? 'O ônibus do sul passa por Fuchsia. A Rota 21 fica depois, de barco ou a pé pela costa.'
      : 'Até a Rota 21 é meio Kanto de estrada, descendo pro sul até o mar.',
    d=>d.flags.marcou_com_a_presidente && !Historia.jaAconteceu('c18_espera_a_quinta')
      ? 'Na agenda de bolso da Auditora Brill tem uma quinta-feira com o seu nome. A Rota 21 vem antes.'
      : '',
    d=>d.flags.tem_as_atas
      ? 'As cento e quarenta páginas vão no fundo da mochila, em quatro blocos, porque um grampo só não pega.'
      : ''
  ],
  ef:{executar:d=>{ if (d.flags.ignorou_a_comissao) Relogio.viver(2 * 24); return []; }},
  fim:true, resumo:'Capítulo 18 concluído — o que veio depois da Rocket tem estatuto, ata e café na entrada.'
},

}}

);
