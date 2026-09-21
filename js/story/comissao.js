/* ============================================================
   A COMISSÃO
   Comissão de Gestão de Risco Biológico de Kanto — CGRB.
   Não é uma gangue. É uma entidade registrada, com estatuto,
   atas publicadas e linha orçamentária. É por isso que é pior.
   ============================================================ */

const COMISSAO = {
  nome:'Comissão de Gestão de Risco Biológico de Kanto',
  sigla:'CGRB',
  fundacao:'quatro meses depois da queda da Equipe Rocket',

  /* Trechos do estatuto — o horror deles é que está tudo escrito */
  estatuto:[
    'Art. 1º — A Comissão tem por finalidade a mitigação de risco biológico regional não gerenciado.',
    'Art. 4º — Considera-se risco não gerenciado toda população silvestre cuja densidade, agressividade ou capacidade destrutiva não esteja sujeita a controle institucional.',
    'Art. 4º, §2º — Incluem-se, para todos os efeitos, os indivíduos classificados como lendários.',
    'Art. 11 — A substituição gradual de populações de risco por populações de comportamento previsível constitui método preferencial, por ser reversível, auditável e de menor custo social.',
    'Art. 19 — Unidades que não atinjam os parâmetros de viabilidade serão objeto de descarte, na forma do regulamento interno.'
  ],

  /* O argumento deles, dito em voz alta. É bom. É esse o problema. */
  doutrina:[
    '"Em dois anos, Kanto quase acabou duas vezes."',
    '"Na primeira, uma organização criminosa controlou uma corporação, uma cidade e metade das rotas, e quem resolveu isso foi uma criança de onze anos. Sozinha. Por acaso."',
    '"Na segunda, um indivíduo fabricado em laboratório saiu andando de Cinnabar e ninguém — ninguém — sabe onde ele está nem o que ele quer."',
    '"A resposta institucional a essas duas coisas foi emitir notas de esclarecimento."',
    '"Nós não somos vilões. Nós somos o que sobra quando ninguém faz o trabalho."'
  ],

  cargos:{
    presidente:'Presidente do Conselho',
    curador:'Curador',
    auditor:'Auditor de Campo',
    tecnico:'Técnico de Viveiro'
  }
};

/* ── Pessoas ─────────────────────────────────────────────── */
const GENTE_COMISSAO = {
  presidente:{
    nome:'a Presidente', nomeReal:'Rhea Colman', cargo:'Presidente do Conselho',
    descricao:'Cinquenta e poucos anos, tailleur cinza, fala baixo e nunca repete uma frase. Foi diretora de fiscalização da Liga por nove anos antes de pedir demissão para fundar a Comissão.'
  },
  curador:{
    nome:'Curador Fabre', cargo:'Curador',
    descricao:'Faz o recrutamento. Simpático de um jeito que funciona, porque não é falso — ele acredita.'
  },
  auditora:{
    nome:'Auditora Brill', cargo:'Auditora de Campo',
    descricao:'Faz o trabalho de rua. Não gosta do trabalho de rua. Faz mesmo assim, bem, todos os dias.'
  },
  tecnico:{
    nome:'Dr. Hollis', cargo:'Técnico-chefe de Viveiro',
    descricao:'Trabalhou na Silph até o andar 11 ser lacrado. Migrou com o projeto, como se muda de sala.'
  }
};

/* ── Unidades fabricadas ─────────────────────────────────── */
/* Elas não têm nome. Têm código de lote. É de propósito. */
function unidadeComissao(dex, nivel, codigo){
  const p = criarPokemon(dex, nivel, {moral:0});
  p.apelido = 'Unidade ' + codigo;
  p.fabricada = true;
  p.historia = 'Produzida em viveiro. Lote ' + codigo + '. Sem registro de origem silvestre.';
  return p;
}

/* Times por agente — usados nas batalhas dos capítulos 18–20 */
function timeComissao(quem, nivel){
  const L = n => Math.max(5, nivel + n);
  if (quem === 'auditora')
    return [
      unidadeComissao(82, L(0), '3-A'),   // Magneton
      unidadeComissao(110, L(1), '3-B'),  // Weezing
      unidadeComissao(97, L(2), '3-C')    // Hypno
    ];
  if (quem === 'seguranca')
    return [
      unidadeComissao(42, L(-1), '5-K'),  // Golbat
      unidadeComissao(89, L(0), '5-L')    // Muk
    ];
  if (quem === 'tecnico')
    return [
      unidadeComissao(101, L(0), '7-D'),  // Electrode
      unidadeComissao(94, L(2), '7-E'),   // Gengar
      unidadeComissao(103, L(1), '7-F'),  // Exeggutor
      unidadeComissao(65, L(3), '7-G')    // Alakazam
    ];
  if (quem === 'presidente')
    return [
      unidadeComissao(112, L(0), '1-A'),  // Rhydon
      unidadeComissao(130, L(1), '1-B'),  // Gyarados
      unidadeComissao(143, L(2), '1-C'),  // Snorlax
      unidadeComissao(149, L(3), '1-D'),  // Dragonite
      unidadeComissao(150, L(5), '01')    // a matriz que finalmente pegou
    ];
  return [unidadeComissao(89, L(0), '9-Z')];
}

/* Quanto o jogador já sabe sobre a Comissão — muda falas na campanha */
function conhecimentoComissao(){
  const d = Estado.dados;
  let n = 0;
  ['sabe_do_andar_11','viu_os_doze','livro_de_destinos','provas_zona','entendeu_o_proximo_projeto',
   'achou_equipe_na_ilha','tem_gente_atras_do_mew'].forEach(f => { if (d.flags[f]) n++; });
  return n;
}
