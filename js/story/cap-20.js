/* ============================================================
   CAPÍTULO 20 — A PRESIDENTE
   ============================================================ */
CAPITULOS.push(
{
num:20, titulo:'A Presidente', local:'Saffron — sala 704', ambiente:'cidade', nivelArea:60,
tom:'muito sombrio', inicio:'c20_predio',
cenas:{

c20_predio:{
  texto:[
    'O prédio é comercial, de dezesseis andares, com uma farmácia no térreo.',
    'No sétimo andar, a sala 704 tem uma placa de acrílico com a sigla CGRB em Arial.',
    'A porta está aberta. Tem café numa garrafa térmica numa mesinha do lado de fora, com copos descartáveis e um saquinho de açúcar.',
    'Lá dentro, doze pessoas sentadas em volta de uma mesa oval, com pasta e caneta.',
    'Uma delas está falando sobre o cronograma de liberação. A pauta está escrita num flip chart.',
    'Eles param quando você entra. Não com susto. Com a pausa educada de quem foi interrompido numa reunião.',
    '"Boa manhã." A mulher na cabeceira tem cinquenta e poucos anos e tailleur cinza. "O senhor é...?"'
  ],
  ef:{registrar:'Entrou na reunião ordinária do conselho da CGRB.'},
  escolhas:[
    {texto:'Dizer seu nome.', vai:'c20_nome'},
    {texto:'Pedir a palavra, pelo Art. 27.', vai:'c20_palavra'},
    {texto:'Não dizer nada e olhar quem está na mesa.', vai:'c20_mesa'}
  ]
},

c20_mesa:{
  texto:[
    'Você olha a mesa antes de falar.',
    'Doze pessoas. Nenhuma de uniforme. Uma de jaleco — Dr. Sena. Um de terno com um crachá nível 2 no bolso — Adnan, que não levanta os olhos da pasta.',
    d=>{
      const L = [];
      if (d.flags.liga_infiltrada || d.flags.liga_aliada) L.push('E, na terceira cadeira da direita, uma mulher que você conhece: a conselheira da Liga Pokémon que te mandou ao norte.');
      if (d.flags.sabe_da_terceira) L.push('Não tem ninguém de Celadon aqui. A Terceira vende pra eles e não senta com eles. Isso, agora, faz muito sentido.');
      return L.join(' ');
    },
    'A mulher da cabeceira espera você terminar de olhar. Ela deixa você olhar. Isso é escolha dela.'
  ],
  ef:{executar:d=>{
        if (d.flags.liga_infiltrada || d.flags.liga_aliada){
          Estado.marcar('viu_a_liga_na_mesa');
          return [{tipo:'liga', texto:'A conselheira da Liga que te equipou para o norte tem assento no conselho da Comissão.'}];
        }
        return [];
      }},
  escolhas:[
    {texto:'Pedir a palavra, pelo Art. 27.', vai:'c20_palavra'},
    {texto:'"Você." — apontando para a conselheira da Liga.', vai:'c20_conselheira', cond:d=>!!d.flags.viu_a_liga_na_mesa},
    {texto:'Dizer seu nome.', vai:'c20_nome'}
  ]
},

c20_conselheira:{
  texto:[
    '"Você."',
    'A conselheira da Liga não desvia o olhar e não parece constrangida.',
    '"Eu tenho assento de observadora." Ela fala com a mesma calma da sala do Planalto. "Sem direito a voto. Consta na ata, e a ata é pública, e você leu."',
    '"Você me mandou pro norte."',
    '"Mandei."',
    '"Pra quê?"',
    'Pela primeira vez em duas conversas, ela hesita.',
    '"Porque eu queria que alguém de fora chegasse lá antes de nós." Ela olha a Presidente do outro lado da mesa. "E porque eu não podia ser eu."'
  ],
  ef:{flag:'conselheira_confrontada', instabilidade:1,
      npc:{nome:'Conselheira da Liga', opiniao:1, memoria:'Admitiu, na frente do conselho da Comissão, que te mandou ao norte para chegar antes deles.'},
      registrar:'A conselheira da Liga te mandou ao norte para chegar antes da Comissão.'},
  escolhas:[{texto:'Pedir a palavra.', vai:'c20_palavra'}]
},

c20_nome:{
  texto:[
    'Você diz seu nome.',
    'Metade da mesa reage. A Presidente, não.',
    d=>{
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=6) return '"Ah." Ela fecha a pasta. "Você é bem mais novo do que o relatório sugere."';
      if (Estado.rep.eixo==='ruim' && Estado.rep.ruim>=5) return '"Ah." Ela fecha a pasta. "Nós temos uma pasta sua. É mais grossa que a de qualquer conselheiro aqui."';
      return '"Ah." Ela fecha a pasta. "Nós esperávamos você em algum momento. Não hoje, mas em algum momento."';
    },
    '"Senta, por favor. Tem café lá fora."'
  ],
  escolhas:[{texto:'Sentar e pedir a palavra.', vai:'c20_palavra'}]
},

c20_palavra:{
  texto:[
    '"Art. 27. Eu quero a palavra."',
    'A Presidente olha para a secretária da mesa, que confere o estatuto, assente, e anota na ata.',
    '"Concedida. Cinco minutos, prorrogáveis."',
    'E é isso que quebra você: eles te dão a palavra. Formalmente. Em ata.',
    'Você fala. Fala do galpão 4, da planilha de quatro dígitos, das trinta e poucas unidades que não sabem o que é uma borda, do Rattata que corre até a parede e volta.',
    'Ninguém interrompe. Uma conselheira anota. Adnan não levanta a cabeça uma vez.',
    'Quando você termina, a Presidente espera cinco segundos inteiros antes de responder.'
  ],
  ef:{flag:'falou_no_conselho',
      rep:{eixo:'bom',delta:2,motivo:'Falou no conselho da Comissão e foi ouvido em ata'}},
  escolhas:[{texto:'Ouvir a resposta.', vai:'c20_resposta'}]
},

c20_resposta:{
  texto:[
    '"Obrigada." Ela diz isso sem ironia nenhuma. "É a primeira manifestação de interessado em um ano e oito meses. Vai constar na ata com o seu nome."',
    '"Agora eu vou te responder, e eu peço que você me ouça com a mesma atenção, porque eu ouvi."',
    COMISSAO.doutrina[0],
    COMISSAO.doutrina[1],
    COMISSAO.doutrina[2],
    '"Eu fui diretora de fiscalização da Liga por nove anos. Eu assinei setenta e um relatórios sobre risco populacional. Nenhum virou política pública."',
    '"No septuagésimo segundo, eu pedi demissão e fundei isto aqui."',
    'Ela junta as mãos.',
    '"O galpão 4 é indefensável. Eu sei. Eu votei a favor do Art. 19 e eu durmo mal por causa dele, e eu votaria de novo, porque a alternativa era não produzir, e não produzir é aceitar o número que a gente tinha antes."',
    '"Eu não vou te pedir que concorde. Eu vou te fazer uma pergunta, e ela é honesta:"',
    d=>`"${d.jogador.nome}, o que você faria no meu lugar?"`
  ],
  ef:{flag:'presidente_perguntou'},
  escolhas:[
    {texto:'"Eu fecharia. Hoje. E aceitaria o número."', vai:'c20_fechar'},
    {texto:'"Eu manteria os viveiros e acabaria com o Art. 19."', vai:'c20_reforma'},
    {texto:'"Eu não sei. Mas isso não te autoriza."', vai:'c20_nao_autoriza'},
    {texto:'"Eu faria exatamente o que você faz."', vai:'c20_concordar'},
    {texto:'Não responder. Derrubar tudo agora.', vai:'c20_luta_presidente'}
  ]
},

c20_fechar:{
  texto:[
    '"Eu fecharia. Hoje. E aceitaria o número."',
    '"O número são pessoas." A voz dela não muda. "Trinta e uma ocorrências graves por ano. Onze crianças em 2019."',
    '"Eu sei."',
    '"Você aceitaria isso."',
    '"Eu aceitaria isso, porque o outro lado do número está numa planilha pendurada num prego, e ele tem quatro dígitos, e ninguém nunca votou nele."',
    'Silêncio na sala oval.',
    'Uma conselheira anota. Outra olha para a Presidente. Adnan, pela primeira vez, levanta a cabeça.'
  ],
  ef:{flag:'defendeu_fechar', rep:{eixo:'bom',delta:2,motivo:'Defendeu o fim do programa diante do conselho inteiro'}},
  escolhas:[
    {texto:'Pedir votação. Pelo estatuto.', vai:'c20_votacao'},
    {texto:'Sair e publicar tudo.', vai:'c20_publicar_tudo'}
  ]
},

c20_reforma:{
  texto:[
    '"Eu manteria os viveiros e acabaria com o Art. 19."',
    'A Presidente inclina a cabeça um grau.',
    '"Trinta e um por cento das unidades não atingem viabilidade. Sem descarte, elas vivem — com dor, sem autonomia, consumindo recurso de viveiro."',
    '"Então vocês param de produzir trinta e um por cento a mais."',
    '"Isso reduz a liberação em um terço e aumenta o custo por unidade em 44%."',
    '"Eu sei. Eu li a ata."',
    'Pela primeira vez, alguém na mesa fala além da Presidente. É Adnan.',
    '"O custo por unidade não é argumento moral", ele diz, olhando a mesa, não ela. "Isso está na minha declaração de voto de onze meses atrás. Página quatro."'
  ],
  ef:{flag:'defendeu_reforma',
      rep:{eixo:'bom',delta:2,motivo:'Propôs uma reforma viável no conselho, em vez de um discurso'},
      npc:{nome:'Curador Adnan', opiniao:3, memoria:'Falou na mesa pela primeira vez depois da sua proposta.'}},
  escolhas:[
    {texto:'Pedir votação. Pelo estatuto.', vai:'c20_votacao'},
    {texto:'Sair. Você plantou o que dava.', vai:'c20_saiu_sala'}
  ]
},

c20_nao_autoriza:{
  texto:[
    '"Eu não sei. Mas isso não te autoriza."',
    'A Presidente fica em silêncio por muito tempo.',
    '"Não", ela concorda. "Não autoriza."',
    '"Eu não tenho autorização de ninguém. Eu tenho um estatuto que eu mesma escrevi e doze pessoas que concordaram comigo."',
    '"Isso não é legitimidade. Isso é organização."',
    'Ela olha para a janela.',
    '"Eu penso nisso todo domingo à noite, e toda segunda às dez da manhã eu abro esta reunião assim mesmo, porque a alternativa é ninguém fazer nada, e eu já vi como é ninguém fazer nada por nove anos."'
  ],
  ef:{flag:'desarmou_presidente',
      rep:{eixo:'bom',delta:2,motivo:'Encontrou a frase que a Presidente não tem resposta'}},
  escolhas:[
    {texto:'Pedir votação.', vai:'c20_votacao'},
    {texto:'Sair e publicar.', vai:'c20_publicar_tudo'},
    {texto:'"Então eu te paro."', vai:'c20_luta_presidente'}
  ]
},

c20_concordar:{
  texto:[
    '"Eu faria exatamente o que você faz."',
    'A sala fica quieta.',
    '"Isso é uma coisa muito séria de se dizer numa reunião que está sendo gravada em ata", diz a Presidente.',
    '"Eu sei."',
    'Ela olha para a secretária. "Registra."',
    'Depois para você. "Tem uma cadeira vaga nesta mesa desde março. Ela é de conselheiro titular, com direito a voto."',
    '"Você tem quinze anos, o que é um problema jurídico que eu consigo resolver em três semanas."'
  ],
  ef:{flag:'aceitou_cadeira_conselho',
      rep:{eixo:'ruim',delta:3,motivo:'Aceitou uma cadeira no conselho da Comissão'},
      executar:d=>{ Historia.definirVia('foragido','assumiu uma cadeira no conselho da Comissão'); return []; },
      registrar:'Aceitou a cadeira de conselheiro titular da CGRB.'},
  escolhas:[
    {texto:'Aceitar a cadeira.', vai:'c20_virou_conselheiro'},
    {texto:'"Não. Eu menti pra ver o que você ia oferecer."', vai:'c20_mentiu_conselho'}
  ]
},

c20_mentiu_conselho:{
  texto:[
    '"Não. Eu menti pra ver o que você ia oferecer."',
    'A Presidente não se irrita. Ela parece, de todas as coisas possíveis, aliviada.',
    '"Bom." Ela anota alguma coisa na pasta. "Eu ia ter que conviver com isso."',
    '"Com o quê?"',
    '"Com ter recrutado a única pessoa em um ano e oito meses que apareceu por conta própria." Ela fecha a caneta. "Isso teria sido a coisa mais feia que eu já fiz, e eu aprovei o Art. 19."'
  ],
  ef:{limpaFlag:'aceitou_cadeira_conselho',
      rep:{eixo:'bom',delta:3,motivo:'Recusou uma cadeira no conselho depois de arrancar a oferta'},
      flag:'recusou_a_cadeira',
      executar:d=>{ Historia.definirVia(d.viaAnterior || 'heroi', 'recusou a cadeira do conselho'); return []; }},
  escolhas:[{texto:'Pedir votação.', vai:'c20_votacao'}]
},

c20_virou_conselheiro:{
  texto:[
    'Você assina a ata como interessado e, três semanas depois, como conselheiro titular com direito a voto.',
    'A primeira reunião de que você participa vota a Fase II-B: ampliação para a Rota 14.',
    'Você levanta a mão junto com os outros onze.',
    'Adnan vota contra. Sozinho. Como sempre.',
    'Na saída, ele te espera no corredor e não diz nada. Só olha.',
    'Você vai lembrar desse olhar por muito tempo, e vai continuar votando.'
  ],
  ef:{flag:['conselheiro_da_comissao','tem_sangue_nas_maos'],
      dinheiro:60000, moral:-25, instabilidade:2,
      rep:{eixo:'ruim',delta:3,motivo:'Passou a votar a expansão dos viveiros'},
      npc:{nome:'Curador Adnan', opiniao:-6, memoria:'Te viu levantar a mão a favor da Fase II-B.'},
      registrar:'Tornou-se conselheiro titular da CGRB e votou a favor da expansão.'},
  escolhas:[{texto:'Seguir.', vai:'c20_fim'}]
},

c20_votacao:{
  texto:[
    '"Eu quero votação."',
    'A Presidente olha a secretária, que confere o estatuto.',
    '"Art. 27, §3º: interessado pode propor matéria, que será submetida a voto na mesma sessão, a critério da mesa."',
    '"A critério da mesa", repete a Presidente.',
    'Ela olha a sala inteira, uma pessoa por vez, e leva quase meio minuto pra fazer isso.',
    '"Submeto." Ela assente para a secretária. "Matéria: revogação do Art. 19 e suspensão da Fase II até revisão do protocolo de descarte."',
    'Doze cadeiras. Onze votos, mais o dela em caso de empate.'
  ],
  ef:{flag:'votacao_aberta'},
  escolhas:[{texto:'Ouvir a votação.', vai:'c20_contagem'}]
},

c20_contagem:{
  texto:[
    'A votação leva quatro minutos e é a coisa mais tensa que já te aconteceu sem nenhuma bola envolvida.',
    'Adnan vota a favor da revogação. Primeiro, alto, sem esperar.',
    d=>{
      let votos = 1; // Adnan
      const razoes = [];
      if (d.flags.provas_do_galpao4){ votos += 2; razoes.push('Duas conselheiras que viram as fotos do galpão 4 votam a favor, e uma delas não consegue terminar a frase.'); }
      if (d.flags.provas_do_viveiro || d.flags.provas_do_11){ votos += 1; razoes.push('Uma conselheira que passou a sessão inteira olhando o material que você trouxe vota a favor.'); }
      if (d.flags.desarmou_presidente || d.flags.defendeu_reforma){ votos += 1; razoes.push('Uma conselheira diz, antes de votar, que a sua proposta é a primeira que não é um discurso.'); }
      if (d.flags.publicou_as_atas){ votos += 1; razoes.push('Um conselheiro que passou dezenove dias sendo perguntado sobre isso em jantares de família vota a favor.'); }
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=6){ votos += 1; razoes.push('Um conselheiro vota a favor e diz o seu nome como justificativa, o que é constrangedor para todo mundo na sala, inclusive para você.'); }
      if (d.flags.conselheira_confrontada){ razoes.push('A conselheira da Liga não vota: assento de observadora, sem direito a voto. Ela fecha os olhos quando a contagem chega.'); }
      if (Historia.via()==='mercenario' || Historia.via()==='foragido'){ votos -= 1; razoes.push('Um conselheiro lembra, em voz alta e com documentos, de onde vem o seu dinheiro. Dois votos mudam de lado.'); }
      Estado.dados.votosComissao = Math.max(0, votos);
      return razoes.join(' ');
    },
    d=>`Contagem final: ${Estado.dados.votosComissao} votos pela revogação, ${Math.max(0, 11 - Estado.dados.votosComissao)} contra.`
  ],
  escolhas:[
    {texto:'Ver o resultado.', vai:'c20_resultado_votacao'}
  ]
},

c20_resultado_votacao:{
  texto:[
    d=>{
      const v = Estado.dados.votosComissao || 0;
      if (v >= 6) return 'Aprovada.';
      if (v === 5) return 'Empate em cinco a cinco, com uma abstenção. O desempate é da Presidente.';
      return 'Rejeitada.';
    },
    d=>{
      const v = Estado.dados.votosComissao || 0;
      if (v >= 6) return 'A Presidente ouve a contagem, assente uma vez, e diz "revogado" com a mesma voz com que abriu a reunião. A secretária anota. Acabou assim, numa sala comercial, num prédio com farmácia no térreo.';
      if (v === 5) return 'A sala inteira olha para ela. Ela fica quieta por onze segundos.\n\n"Eu voto pela revogação do Art. 19 e contra a suspensão da Fase II."\n\nMeia vitória. A pior de todas, porque agora ninguém pode dizer que não foi ouvido.';
      return 'A Presidente ouve a contagem e não comemora. Ela agradece a sua manifestação, registra em ata, e retoma a pauta de onde parou — item 4, cronograma de liberação.';
    }
  ],
  ef:{executar:d=>{
        const v = d.votosComissao || 0;
        const avisos = [];
        if (v >= 6){
          Estado.marcar('art19_revogado'); Estado.marcar('fase2_suspensa');
          Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade - 2);
          Estado.mudarRep('bom', 4, 'Revogou o Art. 19 pelo voto, dentro da sala');
          avisos.push({tipo:'rep', texto:'O Art. 19 foi revogado e a Fase II, suspensa. Você fez isso com uma votação.'});
        } else if (v === 5){
          Estado.marcar('art19_revogado');
          Estado.mudarRep('bom', 2, 'Revogou o Art. 19, mas não parou a Fase II');
          avisos.push({tipo:'rep', texto:'O Art. 19 caiu. A Fase II continua no cronograma.'});
        } else {
          Estado.marcar('votacao_perdida');
          Estado.mudarRep('bom', 1, 'Perdeu a votação e ficou até o fim da sessão');
          avisos.push({tipo:'info', texto:'Você perdeu. E ficou sentado até o fim da sessão, que durou mais uma hora e quarenta.'});
        }
        return avisos;
      }},
  escolhas:[
    {texto:'Sair da sala.', vai:'c20_saiu_sala'},
    {texto:'"Então eu resolvo do meu jeito."', vai:'c20_luta_presidente',
     cond:d=>!d.flags.art19_revogado}
  ]
},

c20_publicar_tudo:{
  texto:[
    'Você sai da sala 704 no meio da reunião e publica tudo o que tem.',
    d=>d.flags.provas_do_galpao4
       ? 'Dessa vez é diferente, porque dessa vez você tem a planilha. Trinta e nove páginas, dois anos, quatro dígitos, com assinatura de responsável em cada linha.'
       : 'Você tem as atas, que são públicas, e a sua palavra, que não é prova.',
    d=>{
      if (d.flags.provas_do_galpao4 && d.flags.provas_do_viveiro)
        return 'A Comissão emite uma nota. A nota não funciona dessa vez. Em nove dias, o Ministério Público abre inquérito. Em quarenta, a Estação 4 é interditada. Em quatro meses, três conselheiros são indiciados.';
      if (d.flags.provas_do_galpao4)
        return 'A planilha sozinha sustenta a manchete por dois meses. A Estação 4 suspende o descarte "para revisão de protocolo" e nunca retoma oficialmente.';
      return 'Sem a planilha, a Comissão responde citando o próprio estatuto e o endereço do cartório. Em três semanas o assunto morre outra vez.';
    }
  ],
  ef:{executar:d=>{
        const avisos=[];
        if (d.flags.provas_do_galpao4 && d.flags.provas_do_viveiro){
          Estado.marcar('comissao_derrubada'); Estado.marcar('fase2_suspensa');
          Estado.dados.mundo.instabilidade = Math.max(0, Estado.dados.mundo.instabilidade-3);
          const r = Estado.mudarRep('bom', 4, 'Derrubou a Comissão com a planilha do galpão 4');
          avisos.push({tipo:'rep', texto:'A Estação 4 foi interditada. Três conselheiros indiciados.'});
        } else if (d.flags.provas_do_galpao4){
          Estado.marcar('descarte_suspenso');
          Estado.mudarRep('bom', 3, 'Suspendeu o descarte com a planilha');
          avisos.push({tipo:'rep', texto:'O descarte foi suspenso "para revisão de protocolo".'});
        } else {
          Estado.mudarRep('bom', 1, 'Publicou o que tinha, que não era o bastante');
          avisos.push({tipo:'info', texto:'Sem prova material, durou três semanas.'});
        }
        return avisos;
      },
      flag:'publicou_o_viveiro',
      registrar:'Publicou o material sobre a Estação 4.'},
  escolhas:[{texto:'Seguir.', vai:'c20_fim'}]
},

c20_luta_presidente:{
  texto:[
    'Você saca uma bola dentro de uma reunião de conselho.',
    'Onze pessoas saem da sala em ordem, sem correr, porque existe um procedimento para isso e eles treinaram.',
    'A Presidente não sai. Ela tira o paletó e o dobra sobre o encosto da cadeira.',
    '"Eu fui treinadora antes de ser diretora." Ela solta a primeira bola. "Todo mundo foi. É esse o problema deste país."',
    'As unidades dela não têm nome. Têm código de lote: 1-A, 1-B, 1-C, 1-D.',
    'E a última tem só dois dígitos.'
  ],
  ef:{flag:'atacou_o_conselho',
      rep:{eixo:'ruim',delta:2,motivo:'Atacou uma reunião de conselho'}},
  batalha:{comissao:'presidente', nivel:58, tipo:'treinador', treinador:'a Presidente', fuga:false,
           vitoria:'c20_venceu_presidente', derrota:'c20_perdeu_presidente', gameover:'gameover'}
},

c20_venceu_presidente:{
  texto:[
    'A Unidade 01 cai por último.',
    'Você olha ela caída no carpete de uma sala comercial e entende, com um atraso de quatro segundos, o que ela é.',
    'É o décimo segundo tanque. Eles conseguiram.',
    'Não é Mewtwo. É uma coisa com o rosto dele, nível 63, código de lote e nenhuma pergunta na cabeça.',
    'A Presidente recolhe a bola com cuidado profissional.',
    '"Ela não fala", diz a Presidente, respondendo à pergunta que você não fez. "Nenhuma das quatro tentativas falou. Nós acertamos o corpo e nunca acertamos a outra parte."',
    '"E vocês continuam."',
    '"E nós continuamos." Ela dobra o paletó de novo. "Porque a Fase III não precisa que ela fale. Precisa que ela obedeça."'
  ],
  ef:{flag:['viu_a_unidade01','sabe_da_fase3'], instabilidade:2,
      rep:{eixo:'bom',delta:1,motivo:'Derrotou a Presidente da Comissão na sala dela'},
      registrar:'A Unidade 01 existe: uma cópia de Mewtwo que não fala. A Fase III só precisa que ela obedeça.'},
  escolhas:[
    {texto:'Levar a Unidade 01 embora.', vai:'c20_levou_unidade01'},
    {texto:'Destruir a Unidade 01.', vai:'c20_destruiu_unidade01'},
    {texto:'Sair. Você já sabe o que precisava.', vai:'c20_saiu_sala'}
  ]
},

c20_levou_unidade01:{
  texto:[
    'Você tira a bola da mão dela. Ela não impede — e não impedir, aqui, é uma decisão dela.',
    '"Ela vai te obedecer", diz a Presidente. "É pra isso que ela existe. Você vai descobrir que isso é a pior parte."'
  ],
  ef:{flag:'tem_a_unidade01',
      executar:d=>{
        const p = unidadeComissao(150, 63, '01');
        p.moral = 0;
        p.historia = 'Décima segunda tentativa. A primeira que vingou. Não fala, não pergunta, obedece.';
        Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv 63) entrou no seu time. Moral 0. Ela vai obedecer a tudo.`}];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Saiu com uma cópia de Mewtwo na mão'},
      registrar:'Levou a Unidade 01.'},
  escolhas:[{texto:'Sair.', vai:'c20_fim'}]
},

c20_destruiu_unidade01:{
  texto:[
    'Você destrói a Unidade 01 na sala 704, no carpete, com a Presidente olhando.',
    'Ela não tenta impedir. Anota alguma coisa na pasta quando acaba.',
    '"Quarta tentativa perdida", ela diz. "Dezoito meses de trabalho."',
    'E aí, pela única vez na manhã inteira, a voz dela falha:',
    '"Eu vou ter que aprovar a quinta. Você entende isso? Você acabou de me obrigar a aprovar a quinta."'
  ],
  ef:{flag:['destruiu_a_unidade01','tem_sangue_nas_maos'], instabilidade:1,
      rep:{eixo:'ruim',delta:2,motivo:'Destruiu uma criatura que não escolheu existir'},
      registrar:'Destruiu a Unidade 01. A quinta tentativa foi aprovada por causa disso.'},
  escolhas:[{texto:'Sair.', vai:'c20_fim'}]
},

c20_perdeu_presidente:{
  texto:[
    'Você perde numa sala comercial para uma mulher de tailleur cinza.',
    'Ela chama a enfermaria do prédio — o prédio tem enfermaria — e espera com você até chegarem.',
    '"Isso vai constar na ata como incidente", ela diz, vestindo o paletó de novo. "Com o seu nome. Eu sinto muito, mas ata é ata."',
    'Ela retoma a reunião no item 4 assim que te levam.'
  ],
  ef:{hp:-8, causa:'Derrota na sala 704',
      executar:d=>{ d.liga.avisos++; return [{tipo:'liga', texto:'O incidente foi registrado em ata, com o seu nome.'}]; },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou um conselho e perdeu'}},
  escolhas:[{texto:'Sair do prédio.', vai:'c20_fim'}]
},

c20_saiu_sala:{
  texto:[
    'Você sai da sala 704 e a reunião continua atrás de você.',
    'Dá pra ouvir, do corredor, a secretária lendo o item 4 da pauta em voz normal.',
    'No elevador, você divide o espaço com um conselheiro que desceu pra fumar. Ele te cumprimenta com a cabeça.',
    'No térreo tem uma farmácia e uma banca de jornal, e gente comprando coisa, e trânsito.'
  ],
  escolhas:[{texto:'Sair do prédio.', vai:'c20_fim'}]
},

c20_fim:{
  texto:[
    d=>{
      if (d.flags.comissao_derrubada) return 'A Comissão de Gestão de Risco Biológico de Kanto é dissolvida por decisão judicial sete meses depois. Três conselheiros respondem processo. A Presidente não foge, não se esconde e comparece a todas as audiências.';
      if (d.flags.art19_revogado && d.flags.fase2_suspensa) return 'O Art. 19 foi revogado numa segunda-feira de manhã, por votação, numa sala comercial. Nenhum jornal noticiou. É assim que as coisas mudam de verdade e é por isso que ninguém acredita.';
      if (d.flags.art19_revogado) return 'O Art. 19 caiu. A Fase II continua. Você conseguiu metade e vai passar anos decidindo se metade conta.';
      if (d.flags.conselheiro_da_comissao) return 'Você agora tem cadeira, voto e uma pasta com o seu nome numa mesa oval em Saffron. A reunião é toda segunda, às dez.';
      if (d.flags.ignorou_a_comissao) return 'A Fase II sai do papel no primeiro semestre, como previsto na ata, e ninguém nunca soube que você leu aquilo.';
      return 'A reunião terminou às 11h40, como todas as reuniões. O item 4 foi aprovado.';
    },
    d=>d.flags.sabe_do_risco01 || d.flags.sabe_da_fase3
       ? 'E em algum lugar de uma ata, numa linha só, existe um item que não foi resolvido hoje: "Risco 01 — não localizado."'
       : 'E em algum lugar existe uma coisa que eles numeraram e não acharam.',
    'A Liga te mandou uma carta enquanto você estava em Saffron. Papel bom, timbre em relevo.'
  ],
  fim:true, resumo:'Capítulo 20 concluído — o mal agora tem ata, pauta e café na entrada.'
}
}}

);
