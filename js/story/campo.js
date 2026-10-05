/* ============================================================
   O MUNDO PEDE O QUE VOCÊ TEM

   Seis lugares do mapa que só abrem com uma capacidade de campo.
   Nenhum deles é obrigatório pra terminar a jornada — todos são
   coisa que fica fechada pra quem não tem, e que o jogo mostra
   fechada, dizendo o que falta, em vez de esconder a opção.

   Isso é de propósito. Ver a porta que você não pode abrir é o
   que faz você querer o machado.
   ============================================================ */

function enxertarCampo(num, cenas, portas){
  const cap = CAPITULOS.find(c => c.num === num);
  if (!cap) return;
  for (const id of Object.keys(cenas)){
    if (cap.cenas[id]) { console.warn('campo: cena repetida, ignorada —', id); delete cenas[id]; }
  }
  Object.assign(cap.cenas, cenas);
  (portas || []).forEach(p => {
    const cena = cap.cenas[p.de];
    if (!cena || !cena.escolhas) return;
    if (cena.escolhas.some(e => e.vai === p.para)) return;
    cena.escolhas.push({texto:p.texto, vai:p.para, cond:p.cond});
  });
}

/* rótulo de escolha que muda conforme você tem ou não a capacidade:
   quem não tem lê o que falta, e a opção continua clicável pra
   explicar por quê. */
function portaDeCampo(rotulo, teste, falta){
  return d => {
    const r = teste();
    return r.pode ? rotulo : `${rotulo} — falta ${falta}`;
  };
}

/* ------------------------------------------------------------
   1. CORTAR — Floresta de Viridian, capítulo 3
   ------------------------------------------------------------ */
enxertarCampo(3, {

c3_o_corte:{
  texto:[
    'Saindo da trilha, a uns quarenta metros, o mato fecha de um jeito diferente do resto da floresta: não é samambaia, é bambu fino, em pé, muito junto.',
    'Bambu fino em touceira não cresce sozinho desse jeito. Alguém plantou isso, faz tempo, e depois ninguém mais cuidou.',
    'E atrás do bambu tem estrutura. Dá pra ver o vulto de um telhado de duas águas por cima das pontas.',
    d=>{
      const c = Campo.cortar();
      return c.pode
        ? 'O machado sai da mochila e resolve em quatro minutos o que a mão não resolveria em uma hora. Bambu corta fácil e corta limpo, e cada talo cai de lado com um barulho oco.'
        : 'Você tenta abrir com a mão e com o pé e com o ombro, e depois de dez minutos entende que bambu em touceira não é mato: é parede. Sem uma lâmina, não passa.';
    }
  ],
  ef:{flag:'achou_o_bambu',
      registrar:'Há um bambuzal plantado na Floresta de Viridian, com uma construção atrás.'},
  escolhas:[
    {texto:'Atravessar o bambuzal.', vai:'c3_atras_do_bambu', cond:d=>Campo.cortar().pode, ef:{desgaste:'Machado'}},
    {texto:'Marcar o lugar e voltar quando tiver como abrir.', vai:'c3_entrada'},
    {texto:'Dar a volta e procurar outra entrada.', vai:'c3_entrada'}
  ]
},

c3_atras_do_bambu:{
  texto:[
    'Atrás do bambu tem uma casa de pesquisa de campo do tamanho de um quarto, com telhado de duas águas, parede de tábua e uma porta que não tranca.',
    'Dentro: uma mesa, um banco, um armário de metal e vinte e dois anos de poeira.',
    'No armário, em três prateleiras, cadernos de capa dura, numerados, com o mesmo nome na lombada.',
    'São contagens de população. Espécie, quadrante, data, número de indivíduos, todo mês, de setenta e quatro a noventa e seis.',
    'Vinte e dois anos de alguém contando Pokémon na floresta e anotando, sozinho, à mão.',
    'O último caderno para no meio de uma página, no meio de uma linha, em março de noventa e seis.'
  ],
  ef:{flag:['a_casa_do_bambuzal','reika_precisa_de_papel'],
      rep:{eixo:'bom', delta:2, motivo:'Achou vinte e dois anos de contagem de população na floresta.'},
      registrar:'Uma casa de pesquisa atrás do bambuzal guarda 22 anos de contagem de população, de 1974 a 1996.',
      presagio:'Para no meio de uma linha. Ninguém termina uma linha e para: quem parou foi interrompido.'},
  escolhas:[
    {texto:'Levar o último caderno.', vai:'c3_entrada'},
    {texto:'Levar os três primeiros, pra ter a linha de base.', vai:'c3_entrada'},
    {texto:'Deixar tudo onde está e seguir.', vai:'c3_entrada'}
  ]
}

}, [
  {de:'c3_entrada', para:'c3_o_corte',
   texto:portaDeCampo('Sair da trilha na direção daquele bambu fechado.', ()=>Campo.cortar(), 'um machado')}
]);

/* ------------------------------------------------------------
   2. QUEBRAR — Monte da Lua, capítulo 5
   ------------------------------------------------------------ */
enxertarCampo(5, {

c5_a_pedra:{
  texto:[
    'A galeria da direita termina num desabamento, e o desabamento é antigo: a poeira em cima das pedras já virou crosta.',
    'Mas não é rocha da caverna. É alvenaria.',
    'Tijolo, argamassa e um pedaço de canto com reboco pintado de verde-água, dessa tinta de repartição pública que existia em todo lugar nos anos setenta.',
    'Alguém construiu uma parede aqui dentro e alguém derrubou ela depois, e as duas coisas aconteceram antes de você nascer.',
    d=>{
      const q = Campo.quebrar();
      return q.pode
        ? 'A picareta entra na argamassa velha como colher em bolo. Vinte minutos de trabalho e um buraco do tamanho de um ombro.'
        : 'Você empurra, chuta e tenta com a alavanca que não tem. Alvenaria velha cede — mas cede pra quem trouxe ferramenta, e você não trouxe.';
    }
  ],
  ef:{flag:'a_parede_de_alvenaria',
      registrar:'No Monte da Lua há uma parede de alvenaria desabada, com reboco de repartição dos anos setenta.',
      presagio:'Tinta verde-água de repartição, dentro de uma caverna. Isso foi obra oficial.'},
  escolhas:[
    {texto:'Abrir a passagem.', vai:'c5_atras_da_parede', cond:d=>Campo.quebrar().pode, ef:{desgaste:'Picareta'}},
    {texto:'Anotar onde é e voltar depois.', vai:'c5_entrada'},
    {texto:'Deixar pra lá.', vai:'c5_entrada'}
  ]
},

c5_atras_da_parede:{
  texto:[
    'Do outro lado tem uma sala escavada de uns quatro por seis, com piso de cimento liso e duas luminárias de teto sem lâmpada.',
    'Tem uma bancada de concreto na parede do fundo e, em cima dela, parafusado, um suporte de metal com o formato de alguma coisa que não está mais ali.',
    'O formato é oval, do tamanho de uma melancia, com quatro pontos de fixação.',
    'Na parede, em tinta estêncil desbotada, um número de patrimônio e três letras.',
    'E, no chão, sob a bancada, uma placa de identificação caída de frente pra baixo. Você vira.',
    '**ESTAÇÃO DE CAMPO 2 — ACESSO RESTRITO — 1977**',
    'Estação 2. Você já ouviu esse número, dito por alguém, em outro lugar, sobre outra coisa.'
  ],
  ef:{flag:['a_estacao_dois','sabe_do_lote_unico'],
      rep:{eixo:'bom', delta:2, motivo:'Achou a Estação de Campo 2 atrás de uma parede no Monte da Lua.'},
      registrar:'Atrás da parede do Monte da Lua há a Estação de Campo 2, de 1977, com um suporte vazio na bancada.',
      presagio:'Se existe uma Estação 2, existe uma Estação 1. E você já ouviu falar de uma Estação 4.'},
  escolhas:[
    {texto:'Levar a placa.', vai:'c5_entrada'},
    {texto:'Copiar o número de patrimônio e as três letras.', vai:'c5_entrada'},
    {texto:'Sair e não contar pra ninguém ainda.', vai:'c5_entrada'}
  ]
}

}, [
  {de:'c5_entrada', para:'c5_a_pedra',
   texto:portaDeCampo('Entrar na galeria da direita, que termina num desabamento.', ()=>Campo.quebrar(), 'uma picareta')}
]);

/* ------------------------------------------------------------
   3. ILUMINAR — a Torre de Lavender, capítulo 7
   ------------------------------------------------------------ */
enxertarCampo(7, {

c7_o_subsolo:{
  texto:[
    'Atrás da escada do térreo da Torre tem uma porta de ferro sem placa, entreaberta, e atrás dela uma escada que desce.',
    'A Torre tem sete andares pra cima. Ninguém nunca te falou de um pra baixo.',
    'O ar que sobe é frio e seco e cheira a pedra, não a incenso.',
    d=>{
      const l = Campo.iluminar();
      if (!l.pode) return 'E escuro. Escuro de verdade: você desce quatro degraus, olha pra trás, e a porta lá em cima já é só um retângulo cinza. Sem luz nenhuma, descer isso é besteira, e você sabe.';
      return l.semPilha
        ? `E escuro — mas ${nomeExib(l.quem)} desce na sua frente e a luz ${pron(l.quem).dele} não pisca, não esquenta e não acaba, e isso muda completamente o que dá pra fazer aqui embaixo.`
        : 'E escuro. A lanterna dá conta, com a luz amarelada de pilha meio gasta que ilumina três metros e faz o resto parecer mais fundo do que é.';
    }
  ],
  ef:{flag:'achou_o_subsolo_da_torre',
      registrar:'A Torre Pokémon tem um subsolo. Ninguém menciona ele.'},
  escolhas:[
    {texto:'Descer.', vai:'c7_ossario', cond:d=>Campo.iluminar().pode,
     ef:{desgaste:d=>Campo.iluminar().semPilha ? null : 'Lanterna'}},
    {texto:'Voltar quando tiver luz.', vai:'c7_base'},
    {texto:'Fechar a porta e esquecer.', vai:'c7_base'}
  ]
},

c7_ossario:{
  texto:[
    'A escada desce nove metros e dá numa sala abobadada de pedra, com nichos escavados na parede do chão ao teto.',
    'É um ossário. Dos antigos, de antes de a Torre existir, de quando isto aqui era só a colina.',
    'Os nichos estão quase todos vazios. Nos que não estão, tem osso pequeno e osso grande, misturados, sem identificação nenhuma.',
    d=>{
      const l = Campo.iluminar();
      return l.semPilha
        ? `${nomeExib(l.quem)} para no meio da sala e a luz ${pron(l.quem).dele} bate uniforme nas paredes, e é aí que você vê o que a lanterna não mostraria: a abóbada inteira é escrita.`
        : 'Você varre a parede com a lanterna em trechos de três metros e leva vinte minutos pra entender o que está vendo: a abóbada inteira é escrita.';
    },
    'Nomes. Riscados na pedra com prego, uns por cima dos outros, em camadas, séculos de gente entrando aqui e escrevendo o nome de quem enterrou.',
    'Não tem data, não tem sobrenome, não tem nada além do nome.',
    'Você fica olhando muito tempo, e em algum momento repara que está procurando um nome específico, e que não faz ideia de qual.'
  ],
  ef:{flag:'o_ossario', moral:2,
      rep:{eixo:'bom', delta:1, motivo:'Desceu ao ossário sob a Torre e leu a abóbada.'},
      registrar:'Sob a Torre de Lavender há um ossário com a abóbada coberta de nomes riscados a prego.',
      presagio:'Séculos de gente escrevendo nome de Pokémon em pedra. Lavender não começou com a Torre.'},
  escolhas:[
    {texto:'Escrever um nome na pedra.', vai:'c7_escreveu_na_pedra', cond:d=>(d.cemiterio||[]).length > 0},
    {texto:'Subir sem escrever nada.', vai:'c7_base'}
  ]
},

c7_escreveu_na_pedra:{
  texto:[
    d=>{
      const m = d.cemiterio[d.cemiterio.length - 1];
      const nome = m && m.apelido ? m.apelido : (m && m.nome ? m.nome : 'o seu');
      return `Você acha um prego no chão, porque tem pregos no chão — muita gente precisou de um antes de você —, e escreve ${nome} num nicho vazio da fileira de baixo.`;
    },
    'Leva onze minutos. Pedra é dura e o prego escapa.',
    'No fim está torto e está raso e daqui a vinte anos ninguém vai conseguir ler.',
    'E está lá.'
  ],
  ef:{flag:'escreveu_no_ossario', moral:6,
      rep:{eixo:'bom', delta:2, motivo:'Escreveu na pedra do ossário o nome de quem não voltou.'},
      registrar:'Escreveu no ossário sob a Torre o nome de quem ficou pelo caminho.'},
  escolhas:[
    {texto:'Subir.', vai:'c7_base'}
  ]
}

}, [
  {de:'c7_base', para:'c7_o_subsolo',
   texto:portaDeCampo('Entrar pela porta de ferro atrás da escada, que desce.', ()=>Campo.iluminar(), 'luz')}
]);

/* ------------------------------------------------------------
   4. ATRAVESSAR — Cerulean, capítulo 6
   ------------------------------------------------------------ */
enxertarCampo(6, {

c6_a_ilhota:{
  texto:[
    'O rio de Cerulean tem uma ilhota no meio, a uns setenta metros da margem, com três árvores e mato alto.',
    'Não tem ponte, não tem barco amarrado e ninguém da cidade fala dela.',
    'Você pergunta pra um senhor na mureta e ele responde sem tirar os olhos da água:',
    fala('o senhor da mureta', 'Aquilo ali é do município. Ninguém vai porque não tem como ir.'),
    d=>fala(d.jogador.nome, 'E a nado?'),
    fala('o senhor da mureta', 'A correnteza no meio puxa. Já morreu gente.'),
    d=>{
      const s = Campo.surfar();
      return s.pode
        ? `Ele olha pro seu cinto, depois pra você, e muda de assunto sozinho: "A não ser que você tenha um grande, né."`
        : 'Setenta metros de água funda com correnteza no meio. Sem alguma coisa grande embaixo de você, não dá.';
    }
  ],
  ef:{flag:'a_ilhota_do_rio',
      registrar:'Há uma ilhota no meio do rio de Cerulean. Ninguém vai porque não tem como ir.'},
  escolhas:[
    {texto:'Atravessar.', vai:'c6_na_ilhota', cond:d=>Campo.surfar().pode},
    {texto:'Voltar quando tiver como atravessar.', vai:'c6_chegada'},
    {texto:'Deixar pra lá.', vai:'c6_chegada'}
  ]
},

c6_na_ilhota:{
  texto:[
    d=>{
      const s = Campo.surfar();
      return `Setenta metros ${s.como}. A correnteza do meio existe e puxa e não chega perto de ser um problema pra quem tem esse tamanho embaixo.`;
    },
    'A ilhota tem uns quarenta metros de comprimento e é mais alta do que parecia da margem.',
    'No meio do mato tem uma laje de concreto de dois por dois com quatro parafusos e nada em cima, e do lado da laje uma caixa de passagem de energia com a tampa arrancada.',
    'Dentro da caixa, cabo cortado. Corte limpo, de alicate, não de tempo.',
    'Alguém tinha alguma coisa instalada aqui e alguém desmontou com pressa.',
    'E no tronco da árvore do meio, na altura do peito, um número de patrimônio a estêncil, igual ao de repartição.'
  ],
  ef:{flag:['a_laje_da_ilhota','sabe_do_lote_unico'],
      rep:{eixo:'bom', delta:2, motivo:'Atravessou até a ilhota que ninguém visita e achou a laje.'},
      registrar:'Na ilhota do rio de Cerulean há uma laje com quatro parafusos, cabo cortado a alicate e número de patrimônio numa árvore.',
      presagio:'Número de patrimônio em árvore quer dizer que a árvore fazia parte da instalação.'},
  escolhas:[
    {texto:'Anotar o número de patrimônio.', vai:'c6_chegada'},
    {texto:'Voltar pra margem sem tocar em nada.', vai:'c6_chegada'}
  ]
}

}, [
  {de:'c6_beira', para:'c6_a_ilhota',
   texto:portaDeCampo('Olhar a ilhota no meio do rio.', ()=>Campo.surfar(), 'um Pokémon de água grande')},
  {de:'c6_chegada', para:'c6_a_ilhota',
   texto:portaDeCampo('Ir ver a ilhota no meio do rio.', ()=>Campo.surfar(), 'um Pokémon de água grande')}
]);

/* ------------------------------------------------------------
   5. FORÇAR — o porto de Vermilion, capítulo 8
   ------------------------------------------------------------ */
enxertarCampo(8, {

c8_o_conteiner:{
  texto:[
    'No canto do pátio, encostado no muro, tem um contêiner de vinte pés fora de pilha, sozinho, com a porta virada pro muro.',
    'Virada pro muro é o detalhe. Contêiner em pátio fica com a porta pro corredor, sempre, porque é assim que se confere carga.',
    'Esse está a quarenta centímetros do muro e não abre de jeito nenhum sem sair do lugar.',
    'Vazio, um contêiner de vinte pés pesa duas toneladas e duzentos.',
    d=>{
      const f = Campo.forcar();
      return f.pode
        ? `${nomeExib(f.quem)} encosta o ombro no canto e empurra, e não é rápido e não é bonito, e em quatro minutos o contêiner girou o suficiente pra passar uma pessoa.`
        : 'Você empurra com tudo que tem e ele não faz nada. Não é teimosia: são duas toneladas e duzentos, e nenhuma pessoa move isso.';
    }
  ],
  ef:{flag:'o_conteiner_virado',
      registrar:'Há um contêiner no pátio de Vermilion com a porta virada para o muro.',
      presagio:'Ninguém vira a porta pro muro por acaso. Viraram pra não conferirem.'},
  escolhas:[
    {texto:'Abrir o contêiner.', vai:'c8_dentro_do_conteiner', cond:d=>Campo.forcar().pode},
    {texto:'Voltar depois com quem consiga mover isso.', vai:'c8_cais'},
    {texto:'Deixar pra lá.', vai:'c8_cais'}
  ]
},

c8_dentro_do_conteiner:{
  texto:[
    'A porta abre com o rangido de dobradiça que não abre há muito tempo.',
    'Lá dentro não tem carga. Tem instalação.',
    'Piso de compensado, duas fileiras de suporte de gaiola parafusadas na parede — vazias —, um exaustor pequeno ligado a uma bateria de caminhão, e um ralo improvisado furado no piso do contêiner.',
    'É uma baia móvel. Alguém transformou um contêiner num lugar de guardar Pokémon vivo e depois esvaziou.',
    'Na parede, presa com fita, uma folha plastificada com uma tabela de horário: alimentação, limpeza, troca de água. Três vezes ao dia.',
    'Quem fez isso não estava maltratando nada. Estava cuidando com método, que é o que assusta.',
    'E no canto, caído atrás de um suporte, um brinco amarelo de identificação de reserva, com número.'
  ],
  ef:{flag:['a_baia_movel','reika_precisa_de_papel','sabe_do_lote_unico'],
      rep:{eixo:'bom', delta:3, motivo:'Abriu o contêiner que ninguém conferia, no pátio de Vermilion.'},
      registrar:'O contêiner virado para o muro é uma baia móvel, com tabela de alimentação três vezes ao dia e um brinco de reserva no chão.'},
  escolhas:[
    {texto:'Levar o brinco.', vai:'c8_cais'},
    {texto:'Levar a tabela de horário.', vai:'c8_cais'},
    {texto:'Fechar e não dizer nada a ninguém ainda.', vai:'c8_cais'}
  ]
}

}, [
  {de:'c8_olhou_o_porto', para:'c8_o_conteiner',
   texto:portaDeCampo('Ir até aquele contêiner sozinho, com a porta virada pro muro.', ()=>Campo.forcar(), 'um Pokémon de grande porte')},
  {de:'c8_cais', para:'c8_o_conteiner',
   texto:portaDeCampo('Olhar o contêiner sozinho no canto do pátio.', ()=>Campo.forcar(), 'um Pokémon de grande porte')}
]);

/* ------------------------------------------------------------
   6. VOAR — a ilha sem nome, capítulo 16
   ------------------------------------------------------------ */
enxertarCampo(16, {

c16_por_cima:{
  texto:[
    'A ilha tem noventa e poucas milhas de mar entre ela e Fuchsia, e todo mundo que você procurou resolve isso do mesmo jeito: de barco, com quem aceitar levar.',
    'Tem outro jeito.',
    d=>{
      const v = Campo.voar();
      return v.pode
        ? `${nomeExib(v.quem)} não precisa de ninguém aceitar.`
        : 'Noventa milhas de mar aberto. Nenhum voador que te levante aguenta isso, e você não tem nenhum que te levante.';
    },
    d=>{
      const v = Campo.voar();
      if (!v.pode) return 'Você fica olhando o horizonte a sudoeste por mais tempo do que pretendia.';
      return 'Noventa milhas em linha reta, sem carta náutica, sem barqueiro, sem hora combinada de volta e sem ninguém sabendo onde você está.';
    }
  ],
  ef:{flag:'pensou_em_ir_voando',
      registrar:'Dá para chegar à ilha sem nome por cima, sem barco e sem ninguém sabendo.'},
  escolhas:[
    {texto:'Ir voando.', vai:'c16_chegou_voando', cond:d=>Campo.voar().pode},
    {texto:'Procurar barco, como todo mundo.', vai:'c16_travessia'},
    {texto:'Deixar pra quando tiver como.', vai:'c16_velho'}
  ]
},

c16_chegou_voando:{
  texto:[
    d=>`Noventa milhas ${Campo.voar().como || 'pelo ar'}. Leva quase quatro horas e as quatro horas são a coisa mais silenciosa que já te aconteceu.`,
    'Mar aberto visto de cima não tem escala: é a mesma superfície igual em todas as direções, e depois de uma hora você para de tentar medir distância porque não existe nada pra medir contra.',
    'A ilha aparece como uma mancha e vira pedra.',
    'E de cima você vê, antes de pousar, a coisa que quem chega de barco nunca vai ver:',
    'no platô do alto da ilha, o alicerce da torre não é um retângulo. É um octógono. E em volta dele, na rocha, queimadas no chão, tem oito marcas circulares de uns setenta centímetros, uma pra cada face, igualmente espaçadas.',
    'Do chão isso é mato e pedra solta. Do ar é um desenho.'
  ],
  ef:{flag:['chegou_voando_na_ilha','sabe_da_ilha','a_marca_na_pedra'],
      rep:{eixo:'bom', delta:3, motivo:'Chegou à ilha sem nome por cima, e viu de cima o que ninguém viu de baixo.'},
      registrar:'O alicerce da ilha é octogonal, com oito marcas circulares queimadas na rocha, uma por face.',
      presagio:d=>d.flags.viu_a_marca_da_ponta_sul ? 'Setenta centímetros de círculo queimado. Você já viu uma dessas marcas antes, numa pedra de praia.' : 'Oito círculos queimados, um por face. Do chão ninguém vê.'},
  escolhas:[
    {texto:'Pousar no platô, em cima do desenho.', vai:'c16_alicerce'},
    {texto:'Pousar e esperar a noite no meio do círculo.', vai:'c16_esperou_no_circulo'}
  ]
}

}, [
  {de:'c16_velho', para:'c16_por_cima',
   texto:portaDeCampo('Pensar em chegar lá sem barco nenhum.', ()=>Campo.voar(), 'um voador de grande porte')}
]);
