/* ============================================================
   CAPÍTULOS 12–13 — A Zona e o gelo
   ============================================================ */
CAPITULOS.push(

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 12 — NOVE MIL HECTARES
   ══════════════════════════════════════════════════════════ */
{
num:12, titulo:'Nove Mil Hectares', local:'Fuchsia / Zona Safári', ambiente:'campo', nivelArea:38,
tom:'muito sombrio', inicio:'c12_fuchsia',
cenas:{

c12_fuchsia:{
  texto:[
    'Fuchsia é uma cidade pequena que existe por causa de uma coisa grande: a Zona Safári tem nove mil hectares e uma cerca de trinta e um quilômetros.',
    'A entrada custa quinhentos, dá trinta bolas especiais e meia hora de caminhada guiada. É turismo.',
    'A cerca existe pra manter gente fora. Foi isso que te disseram.',
    d=>{
      const via = Historia.via();
      if (via==='mercenario'||via==='foragido') return 'E a sua entrega desta semana tem origem escrita na etiqueta: ZS-SETOR 7. Você veio buscar na fonte.';
      if (via==='pesquisador') return 'E no livro de destinos, quatro linhas tinham origem "ZS-7". Você veio ver o setor 7.';
      if (via==='heroi') return 'E três Pokémon que você soltou em Celadon tinham marca de brinco numerado na orelha. Brinco de reserva. Desta reserva.';
      return 'E na recepção tem um cartaz desbotado: "AJUDE-NOS — Pokémon avistados fora da cerca devem ser reportados."';
    }
  ],
  ef:{registrar:'Chegou a Fuchsia e à Zona Safári.'},
  escolhas:[
    {texto:'Pagar a entrada e fazer o passeio guiado.', vai:'c12_passeio', cond:d=>d.jogador.dinheiro>=500,
     ef:{dinheiro:-500}},
    {texto:'Procurar o setor 7 por fora da cerca.', vai:'c12_cerca'},
    {texto:'Falar com o diretor da reserva.', vai:'c12_diretor'},
    {texto:'Procurar os guardas-parque no bar da cidade.', vai:'c12_bar'}
  ]
},

c12_passeio:{
  texto:[
    'O guia tem vinte e dois anos, uniforme cáqui e um texto decorado que ele recita há quatro meses.',
    'O passeio é honesto e bonito. Você vê Nidorino em bando, um Kangaskhan com filhote, Scyther a distância segura.',
    'Na volta, o grupo passa por uma trilha lateral que o guia contorna sem comentar.',
    'Na trilha lateral, no chão, tem trilho. Trilho de carrinho de carga, novo, indo na direção oposta à saída.'
  ],
  ef:{flag:'viu_o_trilho'},
  escolhas:[
    {texto:'Perguntar ao guia sobre o trilho, na frente do grupo.', vai:'c12_guia_perguntado'},
    {texto:'Voltar sozinho à noite.', vai:'c12_noite_zona'},
    {texto:'Ficar para trás e seguir o trilho agora.', vai:'c12_setor7'}
  ]
},

c12_guia_perguntado:{
  texto:[
    'Ele congela por um segundo e meio. Os outros turistas nem percebem.',
    '"Manutenção", ele diz. "Área técnica."',
    'No fim do passeio, quando o grupo já está indo embora, ele te segura pelo braço.',
    '"Não volta aqui de noite." Ele fala olhando pra frente, sorrindo pro grupo. "Sério. Eu sou de Fuchsia, meu pai trabalhou aqui trinta anos. Não volta."',
    'Ele solta o seu braço e vai embora quase correndo.'
  ],
  ef:{npc:{nome:'Guia Nico', opiniao:1, memoria:'Te avisou, apavorado, para não voltar à Zona à noite.'},
      flag:'aviso_do_guia'},
  escolhas:[
    {texto:'Voltar à noite.', vai:'c12_noite_zona'},
    {texto:'Procurar o Nico depois do expediente.', vai:'c12_nico'},
    {texto:'Falar com o diretor.', vai:'c12_diretor'}
  ]
},

c12_nico:{
  texto:[
    'Você espera o Nico na saída dos funcionários. Ele te vê e quase volta pra dentro.',
    'Vocês conversam encostados num muro, no escuro, e ele fala muito rápido.',
    '"Setor 7 é fechado há dois anos por \'recuperação ambiental\'. Ninguém recupera nada lá. Entra carrinho vazio e sai carrinho cheio."',
    '"Eu contei pro diretor. O diretor disse que ia apurar. Isso foi em março."',
    '"Eu tenho esse emprego e mais nada, cara. Eu tenho isso e mais nada."'
  ],
  ef:{flag:['sabe_do_setor7','nico_falou'],
      npc:{nome:'Guia Nico', opiniao:4, memoria:'Te contou tudo sobre o setor 7 encostado num muro, no escuro.'},
      registrar:'Nico contou: o setor 7 é uma operação de captura em massa.'},
  escolhas:[
    {texto:'"Eu não vou falar seu nome pra ninguém."', vai:'c12_noite_zona',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Protegeu a fonte'}, flag:'protegeu_nico'}},
    {texto:'"Você vai comigo hoje à noite."', vai:'c12_nico_vai'},
    {texto:'"Então você é cúmplice."', vai:'c12_nico_acusado'}
  ]
},

c12_nico_vai:{
  texto:[
    'Ele diz não quatro vezes e vai.',
    'É isso que acontece quando alguém quer muito que alguém insista.'
  ],
  ef:{flag:['nico_junto'], npc:{nome:'Guia Nico', opiniao:6, memoria:'Foi com você ao setor 7, de noite, apesar de tudo.'}},
  escolhas:[{texto:'Ir à noite.', vai:'c12_noite_zona'}]
},

c12_nico_acusado:{
  texto:[
    'Ele recebe a frase como um soco.',
    '"Sou." Ele nem se defende. "Sou mesmo."',
    'Ele vai embora sem dizer mais nada. Você nunca mais fala com ele nesta história.',
    'Três meses depois, você lê num jornal que um guia da Zona Safári testemunhou numa audiência. Não diz o nome.'
  ],
  ef:{npc:{nome:'Guia Nico', opiniao:-2, memoria:'Você o chamou de cúmplice. Ele concordou e sumiu.'},
      flag:'afastou_nico'},
  escolhas:[{texto:'Ir sozinho à noite.', vai:'c12_noite_zona'}]
},

c12_diretor:{
  texto:[
    'O diretor da Zona Safári tem sessenta e poucos anos e uma sala com fotos dele ao lado de gente importante ao longo de trinta anos.',
    'Ele te recebe com uma cordialidade desarmante e ouve a sua pergunta sobre o setor 7 inteira.',
    '"Recuperação ambiental." Ele nem hesita. "Pastagem degradada. Estamos replantando."',
    'Atrás dele, na parede, entre as fotos, tem uma planta baixa da reserva emoldurada.',
    'O setor 7 está marcado nela. E na marcação, escrito à mão numa caligrafia antiga: "área de manejo".'
  ],
  ef:{npc:{nome:'Diretor Aloísio', opiniao:0, memoria:'Te disse que o setor 7 é recuperação ambiental.'},
      flag:'falou_com_diretor'},
  escolhas:[
    {texto:'"O que é área de manejo?"', vai:'c12_manejo'},
    {texto:'Agradecer e ir embora. Voltar à noite.', vai:'c12_noite_zona'},
    {texto:'"Eu sei o que tem lá." Blefar.', vai:'c12_blefe_diretor'}
  ]
},

c12_manejo:{
  texto:[
    'A cordialidade dele não some. Ela fica igual, e é isso que muda tudo.',
    '"Manejo é o controle populacional de uma reserva fechada." Ele fala devagar, como professor. "Nove mil hectares suportam um número. Acima dele, a população colapsa sozinha — por fome, por doença, por briga territorial."',
    '"Nós retiramos o excedente."',
    '"Retiram pra onde?"',
    'Ele abre as mãos. "Para onde tem quem receba."'
  ],
  ef:{flag:['sabe_do_manejo','sabe_do_setor7'],
      registrar:'O diretor admitiu: o setor 7 é retirada de "excedente populacional".'},
  escolhas:[
    {texto:'"Isso tem outro nome."', vai:'c12_confronto_diretor'},
    {texto:'"E se a reserva fosse maior?"', vai:'c12_pergunta_dificil'},
    {texto:'Sair e voltar à noite.', vai:'c12_noite_zona'}
  ]
},

c12_pergunta_dificil:{
  texto:[
    'Ele para. É a primeira vez que ele para.',
    '"Se a reserva fosse maior, o problema mudava de lugar e ficava maior também." Ele olha a planta baixa na parede. "Eu peço ampliação há dezenove anos."',
    '"Dezenove anos, três governos, quatro diretores de Liga. Nenhum disse não. Todos disseram depois."',
    'Ele volta pra você. "Eu não estou pedindo sua compreensão. Eu estou te explicando por que um homem honesto vira isso aqui em dezenove anos."'
  ],
  ef:{flag:'diretor_humanizado',
      npc:{nome:'Diretor Aloísio', opiniao:2, memoria:'Te contou dos dezenove anos pedindo ampliação da reserva.'}},
  escolhas:[
    {texto:'"Ainda assim eu vou lá hoje à noite."', vai:'c12_noite_zona'},
    {texto:'"Me dá os dezenove anos de papel. Eu levo pra imprensa."', vai:'c12_papelada'},
    {texto:'"Então não tem o que fazer." E ir embora de Fuchsia.', vai:'c12_desistiu_zona'}
  ]
},

c12_papelada:{
  texto:[
    'Ele te dá. Uma pasta de dezenove anos de ofícios, protocolos e respostas padrão.',
    'A última é de fevereiro deste ano: "Solicitação em análise."',
    '"Isso não me inocenta", ele diz, entregando. "Isso só explica. Eu sei a diferença."',
    'É a segunda vez nesta jornada que alguém te diz exatamente essa frase. A primeira foi o capitão do S.S. Anne.'
  ],
  ef:{flag:['pasta_do_diretor','provas_zona'],
      rep:{eixo:'bom',delta:2,motivo:'Conseguiu dezenove anos de documentação da reserva'},
      npc:{nome:'Diretor Aloísio', opiniao:4, memoria:'Te entregou dezenove anos de papelada sabendo o que você ia fazer com ela.'},
      registrar:'Recebeu dezenove anos de ofícios sobre a Zona Safári.'},
  escolhas:[{texto:'Ir ao setor 7 hoje à noite mesmo assim.', vai:'c12_noite_zona'}]
},

c12_confronto_diretor:{
  texto:[
    '"Tem", ele concorda. "Tem outro nome e o outro nome é mais honesto."',
    'Ele se levanta e olha pela janela.',
    '"Quer saber o que eu acho, de verdade? Eu acho que eu sou a pior pessoa desta cidade e a única que impede isso de ser muito pior."',
    '"As duas coisas ao mesmo tempo. É possível. Eu sou a prova."'
  ],
  ef:{flag:'diretor_confrontado'},
  escolhas:[
    {texto:'Ir ao setor 7 à noite.', vai:'c12_noite_zona'},
    {texto:'Pedir a papelada dos dezenove anos.', vai:'c12_papelada'}
  ]
},

c12_blefe_diretor:{
  texto:['"Eu sei o que tem lá."'],
  teste:{status:'carisma', dificuldade:9, nomeStatus:'Carisma',
         critico:'c12_manejo', sucesso:'c12_manejo', parcial:'c12_diretor_frio', falha:'c12_diretor_frio'}
},

c12_diretor_frio:{
  texto:[
    'A cordialidade some de uma vez.',
    '"Não, você não sabe." Ele se senta. "Se soubesse, não estaria sentado na minha sala me contando."',
    'Ele toca um botão do telefone. "Por favor, acompanhe nosso visitante até a saída."',
    'Você é acompanhado até a saída. Educadamente. Até a saída da cidade.'
  ],
  ef:{flag:'diretor_alerta', npc:{nome:'Diretor Aloísio', opiniao:-3, memoria:'Você blefou mal na sala dele. Ele mandou te acompanharem até fora da cidade.'}},
  escolhas:[
    {texto:'Voltar à noite mesmo assim.', vai:'c12_noite_zona'},
    {texto:'Desistir da Zona.', vai:'c12_desistiu_zona'}
  ]
},

c12_bar:{
  texto:[
    'O bar de Fuchsia tem seis mesas e é onde os guardas-parque bebem depois do turno.',
    'Você paga uma rodada. Isso compra vinte minutos de conversa e nada mais.',
    '"Setor 7?" O mais velho ri sem alegria. "Setor 7 é onde a gente aprende que não existe emprego limpo."',
    'Outro, mais novo, bate na mesa. "Fala menos."',
    '"Fala menos por quê? O moleque já sabe. Todo mundo sabe. Fuchsia inteira sabe e Fuchsia inteira come do que sai de lá."'
  ],
  ef:{flag:'sabe_do_setor7', dinheiro:-400,
      registrar:'Os guardas-parque confirmaram, no bar, o que é o setor 7.'},
  escolhas:[
    {texto:'"Algum de vocês me leva lá?"', vai:'c12_guarda_leva'},
    {texto:'Ir sozinho à noite.', vai:'c12_noite_zona'}
  ]
},

c12_guarda_leva:{
  texto:[
    'Silêncio na mesa.',
    'Depois o mais velho empurra o copo pra longe. "Eu levo."',
    '"Você tá bêbado."',
    '"Eu tô bêbado há quatro anos." Ele levanta. "Vamo."'
  ],
  ef:{flag:'guarda_junto', npc:{nome:'Guarda Elias', opiniao:3, memoria:'Te levou ao setor 7 bêbado, depois de quatro anos calado.'}},
  escolhas:[{texto:'Ir.', vai:'c12_setor7'}]
},

c12_cerca:{
  texto:[
    'A cerca tem trinta e um quilômetros e você não vai andar trinta e um quilômetros.',
    'Você anda quatro, seguindo a linha, até achar uma coisa que não faz sentido: um portão de serviço com asfalto do lado de fora.',
    'Asfalto no meio do mato só existe onde caminhão passa muito.'
  ],
  ef:{flag:'achou_o_portao'},
  escolhas:[
    {texto:'Pular a cerca aqui.', vai:'c12_setor7'},
    {texto:'Esperar um caminhão passar.', vai:'c12_esperou_caminhao'}
  ]
},

c12_esperou_caminhao:{
  texto:[
    'Você espera cinco horas e quarenta na beira do asfalto.',
    'Às 3h20, um caminhão baú sai do portão. Sem placa iluminada, sem logotipo.',
    'Você tem três segundos pra decidir: entrar pelo portão aberto ou seguir o caminhão.'
  ],
  escolhas:[
    {texto:'Entrar pelo portão.', vai:'c12_setor7'},
    {texto:'Seguir o caminhão.', vai:'c12_seguiu_caminhao_zona'}
  ]
},

c12_seguiu_caminhao_zona:{
  texto:[
    'Você segue o caminhão por seis quilômetros de estrada vicinal até ele parar num posto de combustível fechado.',
    'Lá, a carga é transferida pra outro caminhão. Esse segundo tem placa, nota fiscal e logotipo de transportadora.',
    'É aqui que a coisa deixa de ser crime e vira logística.',
    'Você fotografa a transferência inteira: os dois caminhões, as placas, o rosto de quem assina.'
  ],
  ef:{flag:['provas_zona','viu_a_transferencia'],
      rep:{eixo:'bom',delta:2,motivo:'Documentou onde o crime vira logística'},
      registrar:'Fotografou a transferência de carga da Zona Safári para transporte legalizado.'},
  escolhas:[
    {texto:'Voltar e entrar no setor 7 mesmo assim.', vai:'c12_setor7'},
    {texto:'Sair de Fuchsia com as fotos.', vai:'c12_fim'}
  ]
},

c12_noite_zona:{
  texto:[
    'A Zona Safári à noite é outra coisa. Sem guia, sem trilha marcada, sem trinta bolas especiais.',
    'Nove mil hectares no escuro, com bicho que não te conhece.',
    d=>d.flags.nico_junto ? 'Nico anda na sua frente e conhece cada curva. Ele não fala nada o caminho inteiro.' :
       d.flags.guarda_junto ? 'O guarda Elias anda na sua frente, bêbado e absolutamente seguro do caminho.' :
       'Você anda sozinho, guiado por um trilho de carrinho que brilha de leve no escuro.'
  ],
  escolhas:[{texto:'Seguir o trilho.', vai:'c12_setor7'}]
},

c12_setor7:{
  texto:[
    'O setor 7 não é mato. É uma clareira de três hectares, cercada por dentro, com iluminação de obra.',
    'No centro: um curral. Não é gaiola. É curral — estrutura de tubo, com corredor de contenção, exatamente como se faz com gado.',
    'Está cheio.',
    'Não dá pra contar. Você tenta contar e desiste na casa dos oitenta.',
    'E o som — o som é a coisa. Não é pânico. É o som de animal que já se cansou de ter pânico.'
  ],
  ef:{flag:'viu_o_curral', instabilidade:1,
      registrar:'Encontrou o curral do setor 7 da Zona Safári. Mais de oitenta Pokémon.'},
  escolhas:[
    {texto:'Abrir o curral agora.', vai:'c12_abriu_curral'},
    {texto:'Fotografar tudo e sair.', vai:'c12_fotografou_zona'},
    {texto:'Procurar quem está de plantão.', vai:'c12_plantao'},
    {texto:'Destruir o corredor de contenção — sem isso não dá pra embarcar ninguém.', vai:'c12_sabotou'}
  ]
},

c12_plantao:{
  texto:[
    'Tem uma pessoa de plantão. Uma só, num contêiner com ar-condicionado, dormindo numa cadeira.',
    'É uma mulher de uns cinquenta anos com um uniforme de guarda-parque. Do lado dela, um rádio, uma marmita e um livro de palavra cruzada.',
    'Nada nela é de vilão. Tudo nela é de turno da noite.'
  ],
  escolhas:[
    {texto:'Acordar e conversar.', vai:'c12_conversa_plantao'},
    {texto:'Não acordar. Fazer o que veio fazer.', vai:'c12_abriu_curral'},
    {texto:'Amarrar antes que ela acorde.', vai:'c12_amarrou',
     ef:{rep:{eixo:'ruim',delta:2,motivo:'Rendeu uma funcionária dormindo'}, flag:'amarrou_plantao'}}
  ]
},

c12_conversa_plantao:{
  texto:[
    'Ela acorda e não grita, não corre, não pega o rádio.',
    'Olha pra você, olha pro curral, e volta a olhar pra você.',
    '"Você é o terceiro em quatro anos." Ela fecha a palavra cruzada. "Os outros dois eu chamei o rádio."',
    'Ela não chama o rádio.',
    '"Eu vou no banheiro." Ela levanta. "Demoro uns doze minutos. Eu sou lenta."',
    'Ela sai do contêiner sem olhar pra trás.'
  ],
  ef:{flag:'plantao_ajudou', rep:{eixo:'bom',delta:1,motivo:'Foi tratado com humanidade e retribuiu'},
      npc:{nome:'Guarda do turno da noite', opiniao:5, memoria:'Foi ao banheiro por doze minutos para você poder abrir o curral.'},
      registrar:'A guarda do plantão te deu doze minutos.'},
  escolhas:[{texto:'Abrir o curral.', vai:'c12_abriu_curral'}]
},

c12_amarrou:{
  texto:[
    'Ela acorda no meio e não reage direito porque estava dormindo.',
    'Depois entende, e para de se debater, e fica muito quieta, o que é pior.',
    '"Eu ia te deixar abrir", ela diz, da cadeira. "Eu ia no banheiro."',
    'Você não sabe se é verdade. Nunca vai saber.'
  ],
  escolhas:[{texto:'Abrir o curral.', vai:'c12_abriu_curral'}]
},

c12_abriu_curral:{
  texto:[
    'O corredor de contenção tem um portão de guilhotina com contrapeso. Você levanta com o corpo inteiro.',
    'Nada acontece por sete segundos.',
    'Depois sai o primeiro. Depois saem todos, e "todos" é uma palavra que você nunca entendeu de verdade até agora.',
    'Oitenta e poucos Pokémon atravessando uma clareira de três hectares no escuro, na mesma direção, ao mesmo tempo.',
    'Você sobe na estrutura do curral pra não ser atropelado e fica lá em cima vendo aquilo passar embaixo de você por quase dois minutos.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Abriu o curral do setor 7'},
      flag:'abriu_o_curral', instabilidade:1,
      registrar:'Abriu o curral do setor 7. Mais de oitenta Pokémon voltaram à reserva.'},
  escolhas:[
    {texto:'Destruir o corredor de contenção antes de sair.', vai:'c12_sabotou'},
    {texto:'Sair. Isso já foi muito.', vai:'c12_saiu_zona'},
    {texto:'Pegar dois pra você, no meio da confusão.', vai:'c12_aproveitou'}
  ]
},

c12_aproveitou:{
  texto:[
    'No meio dos oitenta saindo, você joga duas bolas.',
    'Pega dois. Eles nem percebem direito o que aconteceu — sai de um curral, entra numa bola.',
    'Você libertou oitenta e ficou com dois. A matemática é boa e o gosto é péssimo.'
  ],
  ef:{flag:'aproveitou_a_fuga',
      executar:d=>{
        const avisos=[];
        for(let i=0;i<2;i++){
          const p = criarPokemon(Dados.escolher([115,113,123,127,128,31,34,55,80,112]), Dados.entre(30,38),
            {moral:25, historia:'Saiu de um curral no setor 7 e entrou numa bola sua no mesmo minuto.'});
          Estado.adicionar(p);
          avisos.push({tipo:'pokemon', texto:`${p.nome} (Nv ${p.nivel}) — moral 25.`});
        }
        return avisos;
      },
      rep:{eixo:'ruim',delta:1,motivo:'Capturou no meio de uma libertação'}},
  escolhas:[{texto:'Sair.', vai:'c12_saiu_zona'}]
},

c12_sabotou:{
  texto:[
    'O corredor de contenção é a peça insubstituível: sem ele, não dá pra embarcar oitenta Pokémon em caminhão nenhum.',
    'Você destrói as travas, entorta os tubos de guia e arrebenta o mecanismo de guilhotina.',
    'Reconstruir isso leva meses e passa por orçamento, licitação e assinatura de gente que não quer assinar.',
    'É a coisa mais eficiente que você fez na jornada inteira e não teve nenhum momento bonito.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Inutilizou a estrutura de captura em massa do setor 7'},
      flag:'sabotou_o_setor7', instabilidade:1,
      registrar:'Destruiu o corredor de contenção do setor 7.'},
  escolhas:[{texto:'Sair.', vai:'c12_saiu_zona'}]
},

c12_fotografou_zona:{
  texto:[
    'Você fotografa: o curral cheio, o corredor de contenção, o trilho, a placa de identificação da estrutura com nome de fornecedor e ano.',
    'Depois sai sem abrir nada.',
    'Oitenta e poucos ficam. Você olha pra eles quando sai e eles olham de volta, todos, ao mesmo tempo, porque você é a única coisa que se move.',
    'Essa é a pior imagem da sua jornada até aqui e você escolheu ela conscientemente, por um motivo que continua sendo bom: uma noite abre um curral, uma foto fecha uma estrutura.'
  ],
  ef:{flag:['provas_zona','escolha_fria'],
      rep:{eixo:'bom',delta:2,motivo:'Documentou o setor 7 em vez de esvaziá-lo'},
      registrar:'Fotografou o curral do setor 7 e saiu sem abrir.'},
  escolhas:[
    {texto:'Mudar de ideia. Voltar e abrir.', vai:'c12_abriu_curral'},
    {texto:'Ir embora com as fotos.', vai:'c12_saiu_zona'}
  ]
},

c12_saiu_zona:{
  texto:[
    'Você sai da Zona pelo mesmo buraco por onde entrou.',
    d=>{
      if (d.flags.abriu_o_curral) return 'Atrás de você, nove mil hectares estão com oitenta e poucos habitantes a mais do que tinham ontem, e nenhum deles sabe que foi você.';
      if (d.flags.provas_zona) return 'Atrás de você, o curral continua cheio. No seu bolso tem o que pode esvaziar ele de vez — daqui a meses.';
      return 'Atrás de você, tudo continua exatamente igual.';
    },
    'Em Fuchsia, às cinco da manhã, a padaria abre. A cidade inteira vai acordar e viver um dia normal.'
  ],
  escolhas:[
    {texto:'Entregar as provas.', vai:'c12_entregar', cond:d=>!!d.flags.provas_zona},
    {texto:'Ir embora de Fuchsia.', vai:'c12_fim'}
  ]
},

c12_entregar:{
  texto:['Você tem material. Agora precisa escolher as mãos.'],
  escolhas:[
    {texto:'Dra. Ivone.', vai:'c12_ivone_zona', cond:d=>!!d.flags.cartao_ivone},
    {texto:'A Liga Pokémon.', vai:'c12_liga_zona'},
    {texto:'A imprensa de Fuchsia, direto.', vai:'c12_imprensa_zona'},
    {texto:'A Terceira — ela paga por informação assim.', vai:'c12_vendeu_zona',
     cond:d=>!!d.flags.conheceu_terceira}
  ]
},

c12_ivone_zona:{
  texto:[
    '"Dezenove anos de ofício e um curral." Ela junta o material da Zona com o do andar 11 e o de Celadon numa mesa só.',
    '"Isso aqui é um sistema. Não é um crime, é um sistema, e sistema você não denuncia — você audita."',
    'Ela liga pra uma advogada em Saffron. A conversa dura quarenta minutos e usa palavras que você não entende.',
    'No fim: "Vai demorar. Vai demorar muito. Mas agora existe um caso."'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Juntou as peças de um sistema inteiro'},
      npc:{nome:'Dra. Ivone', opiniao:10, memoria:'Montou um caso jurídico com o material da Zona, de Celadon e do andar 11.'},
      flag:'caso_montado', registrar:'Dra. Ivone montou um caso com todo o material reunido.'},
  escolhas:[{texto:'Seguir.', vai:'c12_fim'}]
},

c12_liga_zona:{
  texto:[
    'A Liga move mais rápido quando o assunto é uma reserva pública, porque reserva pública é jurisdição clara.',
    'Em nove dias, o setor 7 é interditado. Em vinte, o diretor é afastado.',
    d=>d.flags.diretor_humanizado ? 'Você acompanha a notícia do afastamento do diretor Aloísio e não sente absolutamente nada do que esperava sentir.' :
       'O diretor sai nas fotos do jornal com a pasta na mão, e a legenda chama ele de "o homem por trás do esquema".',
    'A ampliação da reserva, pedida há dezenove anos, continua "em análise".'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Interditou o setor 7 pela via institucional'},
      flag:'setor7_interditado', registrar:'O setor 7 foi interditado e o diretor, afastado.'},
  escolhas:[{texto:'Seguir.', vai:'c12_fim'}]
},

c12_imprensa_zona:{
  texto:[
    'O jornal de Fuchsia tem quatro funcionários e uma tiragem de mil e duzentos exemplares.',
    'A editora olha suas fotos, olha você, e faz uma pergunta melhor que qualquer outra que te fizeram nessa cidade:',
    '"Você entende que metade dessa cidade trabalha direta ou indiretamente na Zona?"',
    '"Entendo."',
    '"Tá." Ela pega o material. "Só queria ter certeza de que você entendia antes de eu publicar."',
    'Sai na quinta-feira. Fuchsia se divide ao meio em uma semana.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Publicou a verdade numa cidade que vivia dela'},
      flag:'publicou_zona', instabilidade:1,
      registrar:'A denúncia saiu no jornal de Fuchsia. A cidade se dividiu.'},
  escolhas:[{texto:'Sair da cidade antes que fique feio.', vai:'c12_fim'}]
},

c12_vendeu_zona:{
  texto:[
    'A Terceira ouve a oferta por telefone e não pergunta nada por vinte segundos.',
    '"Você está me oferecendo a localização e a rotina de um fornecedor que eu já uso." A voz dela não tem raiva nenhuma. "Isso é você me vendendo a minha própria casa."',
    'Pausa.',
    '"Mas você me trouxe o horário do plantão e o modelo do corredor de contenção. Isso eu não tinha."',
    'Ela paga. Menos do que você esperava e mais do que você merecia.'
  ],
  ef:{dinheiro:6000, rep:{eixo:'ruim',delta:3,motivo:'Vendeu a rotina do setor 7 para quem compra do setor 7'},
      flag:'vendeu_a_zona',
      npc:{nome:'A Terceira', opiniao:3, memoria:'Comprou de você a rotina do setor 7.'},
      registrar:'Vendeu à Terceira a rotina do setor 7.'},
  escolhas:[{texto:'Sair de Fuchsia.', vai:'c12_fim'}]
},

c12_desistiu_zona:{
  texto:[
    'Você sai de Fuchsia sem entrar na Zona.',
    'Na estrada, um caminhão baú passa por você no sentido contrário, vindo do lado do portão de serviço.',
    'Você não olha. Isso é uma habilidade que você desenvolveu nesta jornada e não é uma boa habilidade.'
  ],
  ef:{flag:'ignorou_a_zona', rep:{eixo:'ruim',delta:2,motivo:'Deu as costas para a Zona Safári'},
      instabilidade:1},
  escolhas:[{texto:'Seguir.', vai:'c12_fim'}]
},

c12_fim:{
  texto:[
    'A estrada ao sul de Fuchsia termina no mar.',
    'Do cais, dá pra ver duas coisas no horizonte: a silhueta de Cinnabar, com o vulcão, e — mais perto, mais baixo, quase invisível — duas ilhas de pedra branca.',
    'As Ilhas Seafoam. Os pescadores não vão lá desde o inverno passado.',
    'Quando você pergunta por quê, o que você recebe não é resposta. É uma palavra:',
    '"Congelou."'
  ],
  fim:true, resumo:'Capítulo 12 concluído — você viu o tamanho industrial da coisa.'
}
}},

/* ══════════════════════════════════════════════════════════
   CAPÍTULO 13 — CONGELOU
   ══════════════════════════════════════════════════════════ */
{
num:13, titulo:'Congelou', local:'Ilhas Seafoam', ambiente:'agua', nivelArea:42,
tom:'muito sombrio', inicio:'c13_barco',
cenas:{

c13_barco:{
  texto:[
    'Nenhum pescador de Fuchsia te leva às Seafoam. Nenhum, por nenhum dinheiro.',
    'O único que aceita é um homem de setenta e quatro anos que já não pesca mais e que diz, com toda a calma do mundo: "Eu vou porque eu quero ver antes de morrer."',
    'A travessia leva três horas. Nas últimas quarenta minutos, a temperatura da água cai — dá pra sentir com a mão na borda.',
    'A duzentos metros da ilha, tem gelo. Gelo no mar, em Kanto, em outubro.'
  ],
  ef:{npc:{nome:'Seu Bento', opiniao:2, memoria:'Te levou às Seafoam porque queria ver antes de morrer.'},
      registrar:'Atravessou até as Ilhas Seafoam. O mar está congelando.'},
  escolhas:[
    {texto:'Desembarcar.', vai:'c13_ilha'},
    {texto:'"Seu Bento, volta. Isso não é lugar."', vai:'c13_voltou'}
  ]
},

c13_voltou:{
  texto:[
    'Ele te olha muito tempo. Depois vira o barco sem discutir.',
    'No caminho de volta ele diz uma coisa só: "Meu pai dizia que o mar avisa três vezes. Essa foi a segunda."',
    'Duas semanas depois, o gelo alcança a costa de Fuchsia e a cidade perde a safra de pesca do trimestre.'
  ],
  ef:{flag:'nao_foi_seafoam', instabilidade:2,
      rep:{eixo:'ruim',delta:1,motivo:'Recuou das Seafoam e o gelo chegou à costa'},
      registrar:'Não desembarcou nas Seafoam. O gelo avançou.'},
  escolhas:[{texto:'Seguir para Cinnabar.', vai:'c13_fim'}]
},

c13_ilha:{
  texto:[
    'As Ilhas Seafoam são duas formações de rocha branca furadas por dentro — a água entra por baixo e sai pelo outro lado.',
    'Por dentro, elas são um sistema de cavernas que some e reaparece com a maré.',
    'Hoje não some. Hoje está tudo congelado — a água parada virou chão.',
    'Você entra andando por onde barco entrava.',
    'E nas paredes, no gelo, tem coisa dentro. Peixe. Tentacool. Um Dewgong inteiro, de olhos abertos, a dois metros de profundidade no gelo.'
  ],
  ef:{flag:'entrou_nas_seafoam', registrar:'Entrou nas cavernas congeladas das Seafoam.'},
  escolhas:[
    {texto:'Ir mais fundo.', vai:'c13_fundo'},
    {texto:'Tentar quebrar o gelo e tirar o Dewgong.', vai:'c13_dewgong'},
    {texto:'Voltar. Isso é maior do que uma pessoa.', vai:'c13_voltou_da_caverna'}
  ]
},

c13_dewgong:{
  texto:[
    'Você quebra gelo por quarenta minutos com o que tem.',
    'Chega até ele. Ele está vivo — em torpor, com batimento tão lento que você precisa encostar o ouvido pra ter certeza.',
    'Tirar do gelo é fácil. Manter vivo fora do gelo é outra coisa: sem o torpor, ele precisa de água, e a água aqui é gelo.'
  ],
  escolhas:[
    {texto:'Carregar até o barco. Seu Bento tem tanque de vivo.', vai:'c13_salvou_dewgong'},
    {texto:'Colocar de volta no gelo. O torpor era o que estava salvando ele.', vai:'c13_deixou_dewgong',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Entendeu que salvar não é sempre tirar de onde está'}, flag:'entendeu_o_torpor'}}
  ]
},

c13_salvou_dewgong:{
  texto:[
    'Você carrega um Dewgong de cento e vinte quilos por cento e setenta metros de caverna congelada.',
    'Não dá. Você faz mesmo assim, arrastando os últimos setenta.',
    'Seu Bento vê você chegar e não faz uma pergunta — só abre o tanque.',
    'O Dewgong acorda em Fuchsia, três dias depois, num aquário municipal, e vive.'
  ],
  ef:{rep:{eixo:'bom',delta:2,motivo:'Arrastou um Dewgong por cento e setenta metros de gelo'},
      hp:-6, causa:'Esforço extremo nas Seafoam',
      flag:'salvou_dewgong',
      npc:{nome:'Seu Bento', opiniao:6, memoria:'Te viu arrastar um Dewgong de 120 kg por 170 metros de gelo.'}},
  escolhas:[{texto:'Voltar à caverna.', vai:'c13_fundo'}]
},

c13_deixou_dewgong:{
  texto:[
    'Você recoloca ele na cavidade e empurra os pedaços de gelo de volta.',
    'Em quarenta minutos, a cavidade fecha de novo sozinha.',
    'Você fez a coisa mais difícil que existe: entendeu que a ajuda certa era não ajudar.'
  ],
  escolhas:[{texto:'Ir mais fundo.', vai:'c13_fundo'}]
},

c13_voltou_da_caverna:{
  texto:[
    'Você sai. Seu Bento não pergunta nada, e a viagem de volta é silenciosa.',
    'A três quilômetros da ilha, ele desliga o motor e fica olhando pra trás por um tempo.',
    '"Eu vi", ele diz, finalmente. "Tá bom. Eu vi."'
  ],
  ef:{flag:'recuou_seafoam', instabilidade:1},
  escolhas:[{texto:'Seguir para Cinnabar.', vai:'c13_fim'}]
},

c13_fundo:{
  texto:[
    'Quanto mais fundo, mais frio e mais claro. O gelo aqui é transparente como vidro de janela.',
    'A caverna se abre numa câmara enorme onde a água — a água antiga, de antes do congelamento — formou colunas do chão ao teto.',
    'No centro da câmara, num pilar de gelo que subiu do chão como se tivesse crescido, está Articuno.',
    'Ele não está preso. Ele está pousado. E ao redor dele, num raio de dez metros, o gelo é diferente: tem camada, como tronco de árvore.',
    'Ele está aqui há meses. Sem sair. Sem caçar.'
  ],
  ef:{executar:d=>{ Estado.lend(144).encontros++; return []; },
      registrar:'Encontrou Articuno no fundo das Seafoam. Ele está parado há meses.'},
  escolhas:[
    {texto:'Chegar perto devagar.', vai:'c13_perto'},
    {texto:'Atacar. Ele está enfraquecido.', vai:'c13_luta_articuno'},
    {texto:'Ficar parado e observar.', vai:'c13_observar_articuno'},
    {texto:'Sair. Deixar ele em paz.', vai:'c13_saiu_articuno'}
  ]
},

c13_observar_articuno:{
  texto:[
    'Você senta no gelo e espera. Vinte minutos. Quarenta.',
    'Ele não se move. Não uma vez. Nem para respirar de forma visível.',
    'Na hora e dez, você percebe: ele está olhando pra uma direção específica, e não muda.',
    'Você segue a linha do olhar dele. Do outro lado da câmara, congelado numa parede, tem outro Articuno.',
    'Não é reflexo. É outro. Menor. Mais novo.',
    'E o gelo em volta dele tem as mesmas camadas — a mesma contagem de meses.'
  ],
  ef:{flag:'viu_o_segundo_articuno', instabilidade:1,
      registrar:'Existe um segundo Articuno, menor, congelado na parede. O primeiro está velando.'},
  escolhas:[
    {texto:'Tentar libertar o segundo.', vai:'c13_libertar_filhote'},
    {texto:'Perguntar em voz alta o que aconteceu.', vai:'c13_perguntou_articuno'},
    {texto:'Sair sem tocar em nada.', vai:'c13_saiu_articuno'}
  ]
},

c13_perto:{
  texto:[
    'Você anda pelo gelo em camadas, e a cada passo a temperatura cai mais.',
    'A cinco metros, sua respiração congela no ar e cai como pó.',
    'A três metros, ele finalmente se move: vira a cabeça, devagar, e olha.',
    'E você entende, na hora, que ele não está te ameaçando nem te aceitando. Ele está te avaliando pra uma tarefa.',
    'Ele olha pra você, depois olha pra parede do outro lado da câmara, depois olha pra você de novo.',
    'Na parede, congelado, tem outro Articuno. Menor.'
  ],
  ef:{flag:'viu_o_segundo_articuno',
      registrar:'Articuno te mostrou o segundo, congelado na parede.'},
  escolhas:[
    {texto:'Tentar libertar o menor.', vai:'c13_libertar_filhote'},
    {texto:'"Eu não sei como."', vai:'c13_perguntou_articuno'},
    {texto:'Jogar a bola nele agora, que está distraído.', vai:'c13_traicao_articuno'}
  ]
},

c13_perguntou_articuno:{
  texto:[
    '"O que aconteceu aqui?"',
    'Não vem resposta em palavra. Vem em temperatura.',
    'O gelo embaixo dos seus pés fica levemente morno por dois segundos — e você vê, por dentro dele, como um filme preso em âmbar: um barco. Uma rede. Gente.',
    'Depois frio de novo, e a imagem some.',
    'Alguém pescou o menor. Alguém o feriu. E o maior congelou tudo — o mar, a caverna, o tempo — pra que nada piorasse enquanto ele não sabia o que fazer.',
    'Ele não está atacando Kanto. Ele está segurando uma coisa no lugar há meses porque não sabe o que mais fazer.'
  ],
  ef:{flag:['entendeu_articuno','sabe_do_barco'], instabilidade:1,
      rep:{eixo:'bom',delta:2,motivo:'Perguntou a um lendário o que tinha acontecido — e ele respondeu'},
      registrar:'Articuno congelou as Seafoam para preservar o menor, ferido por uma rede.'},
  escolhas:[
    {texto:'Tentar libertar o menor.', vai:'c13_libertar_filhote'},
    {texto:'"Eu vou buscar quem sabe fazer isso."', vai:'c13_buscar_ajuda'},
    {texto:'Sair. Você não tem como ajudar nisso.', vai:'c13_saiu_articuno'}
  ]
},

c13_libertar_filhote:{
  texto:[
    'O gelo em volta do menor tem dois metros de espessura e é duro como pedra.',
    'Você começa a quebrar com o que tem. O maior te observa sem ajudar e sem impedir.'
  ],
  teste:{status:'forca', dificuldade:9, nomeStatus:'Força',
         critico:'c13_libertou', sucesso:'c13_libertou', parcial:'c13_libertou_tarde', falha:'c13_nao_libertou'}
},

c13_libertou:{
  texto:[
    'Quatro horas. Você quebra gelo por quatro horas com as mãos sangrando dentro da luva.',
    'Na quarta, o bloco cede.',
    'O menor cai de lado no chão da caverna e não se mexe por muito tempo — tempo suficiente pra você achar que fez tudo isso por nada.',
    'Depois ele respira.',
    'E o maior, pela primeira vez em meses, sai do pilar.',
    'O que acontece com a temperatura da caverna nos trinta segundos seguintes é a coisa mais bonita que você vai ver na vida: o gelo das paredes começa a rachar e correr, e a água volta, e a caverna volta a ser caverna.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Libertou o segundo Articuno e descongelou as Seafoam'},
      hp:-8, causa:'Quatro horas quebrando gelo nas Seafoam',
      flag:'salvou_o_filhote', instabilidade:-2,
      executar:d=>{
        const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true;
        Estado.dados.mundo.clima = 'normal';
        return [{tipo:'mundo', texto:'Articuno passou a te dever uma. Lendários não esquecem isso também.'}];
      },
      registrar:'Libertou o segundo Articuno. As Seafoam descongelaram.'},
  escolhas:[{texto:'Sair da caverna.', vai:'c13_depois_salvou'}]
},

c13_libertou_tarde:{
  texto:[
    'Cinco horas e meia. Você consegue.',
    'O menor cai no chão e respira — mas a asa esquerda ficou no gelo tempo demais e não abre.',
    'O maior desce do pilar e fica ao lado dele. O gelo da caverna começa a ceder, devagar, em vez de de uma vez.',
    'Ele vai viver. Não vai voar.',
    'Você conseguiu o suficiente e não conseguiu tudo, e essa é a forma mais comum de vitória que existe.'
  ],
  ef:{rep:{eixo:'bom',delta:3,motivo:'Libertou o segundo Articuno, tarde demais para a asa'},
      hp:-9, causa:'Cinco horas e meia quebrando gelo',
      flag:'salvou_o_filhote_tarde', instabilidade:-1,
      executar:d=>{ const L=Estado.lend(144); L.disposicao='passivo'; return []; },
      registrar:'Libertou o segundo Articuno, mas a asa esquerda não abre mais.'},
  escolhas:[{texto:'Sair.', vai:'c13_depois_salvou'}]
},

c13_nao_libertou:{
  texto:[
    'Seis horas e você não chega nem na metade.',
    'Suas mãos param de funcionar direito. Você senta no gelo e admite em voz alta: "Eu não consigo."',
    'O maior te olha por muito tempo. Depois volta pro pilar, se acomoda, e recomeça a esperar.',
    'Ele já esperou meses. Ele pode esperar mais.',
    'Isso é infinitamente pior do que se ele tivesse te atacado.'
  ],
  ef:{hp:-7, causa:'Exaustão nas Seafoam', flag:'nao_conseguiu_libertar',
      registrar:'Não conseguiu quebrar o gelo. Articuno voltou a esperar.'},
  escolhas:[
    {texto:'Ir buscar quem sabe fazer isso.', vai:'c13_buscar_ajuda'},
    {texto:'Sair e não voltar.', vai:'c13_saiu_articuno'}
  ]
},

c13_buscar_ajuda:{
  texto:[
    'Você sai da caverna e volta a Fuchsia com Seu Bento na mesma noite.',
    d=>{
      if (d.flags.cartao_ivone) return 'A Dra. Ivone chega em dois dias com uma equipe de resgate de fauna marinha e equipamento de corte térmico.';
      if (Estado.rep.eixo==='bom' && Estado.rep.bom>=5) return 'Você pede ajuda em Fuchsia e — pela primeira vez na jornada — a sua reputação faz o trabalho: onze pessoas aparecem. Onze.';
      return 'Você pede ajuda em Fuchsia. Duas pessoas aparecem: Seu Bento e um veterinário aposentado.';
    },
    'A operação leva um dia e meio. Corte térmico, corda, três turnos.',
    'Quando o bloco cede, tem gente chorando numa caverna congelada e ninguém se envergonha disso.'
  ],
  ef:{rep:{eixo:'bom',delta:4,motivo:'Mobilizou gente para libertar o segundo Articuno'},
      flag:['salvou_o_filhote','mobilizou_gente'], instabilidade:-2,
      executar:d=>{ const L=Estado.lend(144); L.disposicao='passivo'; L.aliado=true; Estado.dados.mundo.clima='normal'; return []; },
      npc:{nome:'Seu Bento', opiniao:8, memoria:'Participou do resgate do segundo Articuno. Viu antes de morrer.'},
      registrar:'Uma equipe libertou o segundo Articuno. As Seafoam descongelaram.'},
  escolhas:[{texto:'Ver o gelo derreter.', vai:'c13_depois_salvou'}]
},

c13_traicao_articuno:{
  texto:[
    'Ele está te mostrando o filho preso na parede e você joga a bola.',
    'Não tem como suavizar isso.'
  ],
  ef:{executar:d=>{ const L=Estado.lend(144); L.disposicao='hostil'; L.ataquesSofridos+=2; return []; },
      rep:{eixo:'ruim',delta:3,motivo:'Atacou um lendário no momento em que ele pediu ajuda'},
      flag:'traiu_articuno'},
  escolhas:[{texto:'Encarar o que vem.', vai:'c13_luta_articuno'}]
},

c13_luta_articuno:{
  texto:[
    'A câmara inteira baixa dez graus de uma vez.',
    'As colunas de gelo começam a rachar no teto.'
  ],
  batalha:{dex:144, nivel:52, tipo:'lendario', fuga:true, ambiente:'agua',
           vitoria:'c13_pos_articuno', derrota:'c13_pos_articuno', fuga2:'c13_saiu_articuno',
           captura:'c13_capturou_articuno', gameover:'gameover'}
},

c13_pos_articuno:{
  texto:[
    'Ele volta pro pilar.',
    'Não porque venceu ou perdeu. Porque o lugar dele é ali, e ele tem uma coisa pra fazer, e você foi só uma interrupção de vinte minutos numa vigília de meses.'
  ],
  ef:{executar:d=>{
        const L=Estado.lend(144); L.ataquesSofridos++;
        if (L.ataquesSofridos>=2){ L.disposicao='hostil'; return [{tipo:'perigo', texto:'Articuno te marcou. O frio vai te seguir.'}]; }
        return [];
      },
      rep:{eixo:'ruim',delta:1,motivo:'Atacou Articuno nas Seafoam'}, instabilidade:1},
  escolhas:[
    {texto:'Tentar de novo.', vai:'c13_luta_articuno'},
    {texto:'Parar e olhar em volta.', vai:'c13_observar_articuno'},
    {texto:'Sair.', vai:'c13_saiu_articuno'}
  ]
},

c13_capturou_articuno:{
  texto:[
    'A bola fecha.',
    'E o gelo — o gelo que ele estava segurando — começa a ceder no mesmo segundo, porque não tem mais ninguém segurando.',
    'A caverna inteira racha. Colunas caem. A água volta com força de maré represada por meses.',
    'Do outro lado da câmara, na parede que está se partindo, tem outro Articuno congelado.',
    'Você só vê ele durante um segundo e meio, quando a parede cede, antes da água levar tudo.'
  ],
  ef:{instabilidade:3, flag:'capturou_articuno_e_perdeu_o_outro',
      rep:{eixo:'ruim',delta:2,motivo:'Capturou o guardião e a caverna cedeu'},
      registrar:'Capturou Articuno. A caverna cedeu e o segundo Articuno foi levado pela água.'},
  escolhas:[
    {texto:'Mergulhar atrás.', vai:'c13_mergulhou'},
    {texto:'Correr para a saída.', vai:'c13_correu_da_agua'}
  ]
},

c13_mergulhou:{
  texto:[
    'Você mergulha em água de dois graus dentro de uma caverna desabando.',
    'Você não acha nada. Você quase não volta.',
    'Seu Bento te tira da água na entrada da caverna, sozinho, com setenta e quatro anos.',
    '"Burrice", ele diz, enrolando você num cobertor. "Burrice bonita, mas burrice."'
  ],
  ef:{hp:-12, causa:'Mergulho em água de dois graus nas Seafoam',
      rep:{eixo:'bom',delta:1,motivo:'Arriscou a própria vida tentando consertar o próprio erro'},
      flag:'mergulhou_nas_seafoam',
      npc:{nome:'Seu Bento', opiniao:4, memoria:'Te tirou da água gelada sozinho, aos setenta e quatro anos.'}},
  escolhas:[{texto:'Voltar para o barco.', vai:'c13_fim'}]
},

c13_correu_da_agua:{
  texto:[
    'Você corre. Cento e setenta metros de caverna desabando com uma bola no bolso.',
    'Você chega no barco. Seu Bento arranca antes de você sentar.',
    'De cinquenta metros, vocês veem a entrada da caverna sumir.',
    'Seu Bento não pergunta o que tem no seu bolso. Ele vê o seu rosto e decide não perguntar, e esse é um tipo específico de gentileza.'
  ],
  ef:{flag:'saiu_com_articuno'},
  escolhas:[{texto:'Voltar a Fuchsia.', vai:'c13_fim'}]
},

c13_saiu_articuno:{
  texto:[
    'Você sai da câmara e refaz os cento e setenta metros de volta.',
    'Na saída, o ar de fora parece quente, o que é absurdo, porque está fazendo nove graus.',
    d=>d.flags.viu_o_segundo_articuno ? 'Você sabe o que tem lá dentro. Você sabe exatamente o que tem lá dentro, e está indo embora.' :
       'Você não sabe o que viu. Sabe que viu.'
  ],
  ef:{flag:'saiu_das_seafoam'},
  escolhas:[{texto:'Voltar para o barco.', vai:'c13_fim'}]
},

c13_depois_salvou:{
  texto:[
    'Você sai da caverna com água até o joelho — água, não gelo.',
    'Os dois Articuno saem pelo alto, pelo furo natural no teto da ilha, com dez minutos de diferença.',
    'Seu Bento está no barco, de pé, olhando pra cima, e não diz nada por muito tempo.',
    'Depois: "Eu queria ver antes de morrer." Ele senta. "Agora eu não sei mais o que fazer com o resto."'
  ],
  ef:{rep:{eixo:'bom',delta:1,motivo:'Devolveu o inverno ao lugar dele'}},
  escolhas:[{texto:'Voltar a Fuchsia.', vai:'c13_fim'}]
},

c13_fim:{
  texto:[
    d=>{
      if (d.flags.salvou_o_filhote) return 'Em Fuchsia, na semana seguinte, a pesca volta. Ninguém liga uma coisa à outra — ninguém sabe. Só você, Seu Bento e dois Articuno.';
      if (d.flags.capturou_articuno_e_perdeu_o_outro) return 'O gelo continua avançando na costa. Sem o guardião segurando, ele avança mais rápido, não menos. Você entendeu isso tarde demais.';
      if (d.flags.nao_conseguiu_libertar) return 'O gelo fica. Você sabe por quê, sabe onde, e não conseguiu. Isso é uma coisa que você vai carregar.';
      return 'O gelo continua onde estava. Fuchsia continua sem pesca.';
    },
    'Do cais de Fuchsia, Cinnabar é visível num dia limpo. Hoje está limpo.',
    'O vulcão está soltando fumaça. Vermelha.'
  ],
  fim:true, resumo:'Capítulo 13 concluído — o inverno tinha um motivo.'
}
}}

);
