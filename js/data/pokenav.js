/* ============================================================
   POKÉNAV — a agenda de quem te atende o telefone
   Presente de quem ficou em casa, no dia em que você saiu.
   Guarda número de treinador e de gente importante. Cada número
   serve pra uma coisa: revanche, favor, missão, ou só pra
   ligar e provar que você chegou onde disse que ia chegar.
   ============================================================ */

/* O que um contato pode oferecer:
   revanche — ele luta de novo, com o time subido
   favor    — uma ajuda material, com limite
   missao   — um pedido que vira cena
   prova    — você liga pra mostrar o que conquistou */

const CONTATOS = [

/* ── casa e primeira rua ─────────────────────────────────── */
{
  id:'casa', tipo:'figura', cidade:d=>d.jogador.cidade,
  nome:d=>nomeCasa(), papel:d=>`a sua ${casaQuem()}`.replace('a sua pai','o seu pai').replace(/^a sua (avô|tio|irmão)/, 'o seu $1'),
  desde:'O primeiro número gravado no aparelho. Já estava lá quando ele chegou na sua mão.',
  automatico:true,
  oferece:['favor','prova','missao'],
  missao:{
    rotulo:'Perguntar se ela precisa de alguma coisa',
    rotuloEntrega:'Ligar e dizer que está consertado',
    dica:'Voltar em casa e consertar o telhado dos fundos. Três telhas.',
    pedido:[
      d=>fala(nomeCasa(), 'Eu não preciso de nada.'),
      'Pausa de quatro segundos, que nesta casa quer dizer o contrário.',
      d=>fala(nomeCasa(), 'O telhado dos fundos pinga. São três telhas, duas fora do lugar e uma rachada.'),
      d=>fala(nomeCasa(), 'Eu não subo mais em telhado e o rapaz que subia mudou pra Cerulean.'),
      d=>fala(nomeCasa(), 'E não vem correndo. Eu ponho balde. Eu ponho balde há dois invernos.', 'baixo')
    ],
    objetivo:d=>!!d.flags.consertou_o_telhado,
    entregue:[
      d=>fala(d.jogador.nome, 'Tá consertado.'),
      d=>fala(nomeCasa(), 'Eu sei que tá. Eu tava no quintal gritando pra você descer, lembra.', 'riso'),
      d=>fala(nomeCasa(), 'Eu tirei os baldes ontem. Todos. Guardei no armário de cima.'),
      d=>fala(nomeCasa(), 'Dois invernos com balde no chão da sala e ontem eu guardei os baldes.', 'baixo')
    ],
    recompensa:d=>{ Estado.curarJogador(20); Estado.j.dinheiro += 3000;
      return [{tipo:'item', texto:'+3000 ₽ — "é o que eu ia gastar com o pedreiro."'},
              {tipo:'cura', texto:'Alguma coisa em você assenta de volta no lugar.'}]; },
    rep:{eixo:'bom', delta:2, motivo:'Consertou o telhado da própria casa'},
    marca:'o_telhado_ficou_pronto'
  },
  favor:{
    rotulo:'Pedir um dinheiro emprestado',
    limite:3,
    texto:d=>[
      fala(nomeCasa(), 'Quanto é que você precisa?', null, 'Sem "oi". Sem "como você está". Direto na pergunta que importa.'),
      d.jogador.dinheiro < 500
        ? fala(nomeCasa(), 'Não me responde. Eu já sei. Eu deposito hoje.', 'baixo')
        : fala(nomeCasa(), 'Tá. Eu mando. E não é pra gastar em bola, que bola você compra com o que ganha.')
    ],
    efeito:d=>{ Estado.j.dinheiro += 2500; return [{tipo:'item', texto:'+2500 ₽ — veio de um lugar que não sobrava.'}]; }
  },
  prova:{
    rotulo:'Contar onde você chegou',
    texto:d=>{
      const n = d.insignias.filter(i=>i!=='Título de Campeão').length;
      if (d.flags.campeao_de_kanto) return [
        fala(nomeCasa(), 'Campeão.', 'baixo', 'Ela repete a palavra três vezes antes de conseguir dizer outra coisa.'),
        fala(nomeCasa(), 'Eu vou ter que sentar. Espera. Espera um pouco.')
      ];
      if (n >= 6) return [
        fala(nomeCasa(), `${n} insígnias. ${n}!`, 'grita'),
        fala(nomeCasa(), 'A rua inteira já sabe. Eu contei pra rua inteira. Eu não me arrependo.', 'riso')
      ];
      if (n >= 1) return [
        fala(nomeCasa(), `${n === 1 ? 'A primeira' : n + ' insígnias'}.`, null, 'Silêncio do outro lado por uns três segundos.'),
        fala(nomeCasa(), 'Eu sabia. Eu não sabia nada, mas eu falei que sabia, e agora eu sabia mesmo.', 'riso')
      ];
      return [
        fala(nomeCasa(), 'Nenhuma ainda? Tudo bem. Tá comendo?'),
        fala(nomeCasa(), 'Responde a pergunta da comida, que a insígnia eu espero.')
      ];
    },
    rep:{eixo:'bom', delta:1, motivo:'Ligou para casa para contar'}
  }
},
{
  id:'rufino', tipo:'figura', nome:'Sr. Rufino', papel:'o velho da vassoura', cidade:'Pallet',
  desde:'Varre a mesma calçada há vinte anos e não esquece nada.',
  requer:d=>!!(d.npcs['Sr. Rufino'] && d.npcs['Sr. Rufino'].opiniao >= 2),
  oferece:['favor','missao'],
  missao:{
    rotulo:'Perguntar se ele precisa de alguma coisa',
    rotuloEntrega:'Ligar e contar da medalha',
    dica:'Achar a medalha de natação da filha do Nogueira. Ela foi vendida, e quem vende vende pra quem compra.',
    pedido:[
      fala('Sr. Rufino', 'Precisar eu não preciso. Mas tem uma coisa que me incomoda há uns dois anos.'),
      fala('Sr. Rufino', 'A filha do Nogueira ganhou uma medalha de natação em 94. Estadual. A cidade inteira foi ver.'),
      fala('Sr. Rufino', 'Ela morreu em 95 e o Nogueira vendeu tudo que tinha dentro da casa, inclusive a medalha.'),
      fala('Sr. Rufino', 'Ele se arrependeu no mesmo mês. Faz dois anos que ele procura e ele não sabe procurar.', 'baixo'),
      fala('Sr. Rufino', 'Você anda por aí. Se aparecer, você vai saber que é.')
    ],
    objetivo:d=>Estado.contaItem('Medalha de natação da filha do Nogueira') > 0,
    entregue:[
      d=>fala(d.jogador.nome, 'Eu achei.'),
      'Silêncio do outro lado por uns quatro segundos.',
      fala('Sr. Rufino', 'Não me diz onde.'),
      fala('Sr. Rufino', 'Eu não quero saber onde estava, eu não quero saber quem tinha, eu não quero saber quanto custou.'),
      fala('Sr. Rufino', 'Leva na casa dele. Bate na porta, entrega, e não fica pra conversa.', 'baixo'),
      fala('Sr. Rufino', 'Ele vai querer conversar. Não fica.')
    ],
    recompensa:d=>{ Estado.usarItem('Medalha de natação da filha do Nogueira');
      Estado.subirStatus('carisma');
      return [{tipo:'rep', texto:'CARISMA +1 — você aprendeu a entregar uma coisa e ir embora.'}]; },
    rep:{eixo:'bom', delta:3, motivo:'Achou e devolveu a medalha da filha do Nogueira', notorio:true},
    marca:'devolveu_a_medalha'
  },
  favor:{
    rotulo:'Perguntar o que ele ouviu falar',
    limite:99, esperaCap:2,
    texto:d=>[
      fala('Sr. Rufino', 'Eu varro calçada, menino. Calçada é onde a cidade fala.'),
      fala('Sr. Rufino', 'Passou gente aqui perguntando de você. Não era da Liga. Eu não dei linha nenhuma.'),
      fala('Sr. Rufino', 'E olha: quando alguém te oferecer coisa demais de graça, conta quantas saídas tem a sala.')
    ],
    efeito:d=>{ Estado.subirStatus('percepcao'); return [{tipo:'rep', texto:'PERCEPÇÃO +1 — você passou a contar as saídas das salas.'}]; }
  }
},
{
  id:'odete', tipo:'figura', nome:'Sra. Odete', papel:'a vizinha do dezoito', cidade:'Pallet',
  desde:'Bateu na sua porta às seis e cinquenta com uma caixa nos braços.',
  requer:d=>!!d.npcs['Sra. Odete'],
  oferece:['favor'],
  favor:{
    rotulo:'Perguntar da caixa',
    limite:99, esperaCap:3,
    texto:d=>[
      fala('Sra. Odete', 'A caixa? A caixa eu quero de volta, mas já desencanei.', 'riso'),
      fala('Sra. Odete', 'Olha, eu separei umas coisas aqui que estavam no armário e que não servem pra mim. Passa um dia.')
    ],
    efeito:d=>{ Estado.darItem('Super Potion', 2); Estado.darItem('Great Ball', 1);
      return [{tipo:'item', texto:'Recebeu 2× Super Potion e 1× Great Ball.'}]; }
  }
},
{
  id:'enfermeira', tipo:'figura', nome:'Enfermeira do Centro', papel:'seis insígnias, e parou', cidade:'Viridian',
  desde:'Te entregou a licença e contou por que parou.',
  requer:d=>!!d.flags.historia_da_enfermeira,
  oferece:['favor','missao'],
  missao:{
    rotulo:'Perguntar o que ela não conseguiu fazer',
    rotuloEntrega:'Ligar e contar das seis',
    dica:'Chegar a seis insígnias. Ela parou em seis e quer ver alguém passar disso.',
    pedido:[
      fala('a enfermeira', 'Eu parei em seis. Eu já te contei isso.'),
      fala('a enfermeira', 'O que eu não te contei é que eu fiquei quatro anos achando que seis era o meu teto. Que era o máximo que uma pessoa como eu chegava.'),
      fala('a enfermeira', 'Aí eu vi você entrar naquele balcão com uma cara de quem não sabe nada.', 'baixo'),
      fala('a enfermeira', 'Chega em seis. Só isso. Chega em seis e me liga, que eu preciso saber se o número tem alguma coisa de especial ou se era só eu.')
    ],
    objetivo:d=>d.insignias.filter(i=>i!=='Título de Campeão').length >= 6,
    entregue:[
      d=>{
        const n = d.insignias.filter(i=>i!=='Título de Campeão').length;
        return fala(d.jogador.nome, n > 6 ? `${n}. Eu passei de seis faz um tempo.` : 'Seis.');
      },
      'Ela não fala nada por um tempo tão longo que você acha que a ligação caiu.',
      fala('a enfermeira', 'E aí? Tem alguma coisa de especial no seis?'),
      d=>fala(d.jogador.nome, 'Não. É só um número.'),
      fala('a enfermeira', 'É só um número.', 'baixo'),
      fala('a enfermeira', 'Trinta e seis anos, e é só um número. Obrigada. Eu falo sério: obrigada.')
    ],
    recompensa:d=>{ Estado.darItem('Hyper Potion', 2); Estado.darItem('Revive', 2);
      return [{tipo:'item', texto:'Chegou pelo malote: 2× Hyper Potion e 2× Revive.'}]; },
    rep:{eixo:'bom', delta:2, motivo:'Provou a alguém que o teto dela não era teto', notorio:true},
    marca:'a_enfermeira_soube_das_seis'
  },
  favor:{
    rotulo:'Pedir o que ela mandaria comprar',
    limite:99, esperaCap:2,
    texto:d=>[
      fala('a enfermeira', 'Potion. Eu falei. Eu SEMPRE falo.', 'riso'),
      fala('a enfermeira', 'Vou mandar pelo malote do Centro daqui. Chega em qualquer cidade, é o mesmo sistema.')
    ],
    efeito:d=>{ Estado.darItem('Potion', 3); Estado.darItem('Revive', 1);
      return [{tipo:'item', texto:'Recebeu 3× Potion e 1× Revive pelo malote.'}]; }
  }
},

/* ── os oito líderes: número dado depois da insígnia ─────── */
{
  id:'brock', tipo:'treinador', nome:'Brock', papel:'líder de Pewter · Pedra', cidade:'Pewter',
  desde:'Te deu a Insígnia Pedra e o número junto.',
  requer:d=>d.insignias.includes('Insígnia Pedra'),
  ginasio:'pewter',
  oferece:['revanche','favor'],
  favor:{
    rotulo:'Perguntar de pedra',
    limite:99, esperaCap:3,
    texto:d=>[
      fala('Brock', 'Pedra não é sobre aguentar. Todo mundo acha que é sobre aguentar.'),
      fala('Brock', 'É sobre estar no lugar certo quando o outro cansa. Leva isso pro Planalto.')
    ],
    efeito:d=>{ Estado.darItem('Faixa Firme', 1); return [{tipo:'item', texto:'Recebeu 1× Faixa Firme.'}]; }
  }
},
{
  id:'misty', tipo:'treinador', nome:'Misty', papel:'líder de Cerulean · Água', cidade:'Cerulean',
  desde:'Te deu a Insígnia Cascata e não gostou nem um pouco.',
  requer:d=>d.insignias.includes('Insígnia Cascata'),
  ginasio:'cerulean', oferece:['revanche','prova'],
  prova:{
    rotulo:'Contar quantas você tem agora',
    texto:d=>{
      const n = d.insignias.filter(i=>i!=='Título de Campeão').length;
      return n >= 7
        ? [fala('Misty', 'Sete. Tá bom, tá bom.', null, 'Dá pra ouvir ela sorrindo contra a vontade.'),
           fala('Misty', 'Quando você perder pro Blue, me liga. Eu quero ouvir isso da sua boca.')]
        : [fala('Misty', `${n}? Eu tenho oito e mais um ginásio, mas parabéns.`, 'riso'),
           fala('Misty', 'Liga de novo quando tiver mais. Eu atendo.')];
    },
    rep:{eixo:'bom', delta:1, motivo:'Ligou para uma líder de ginásio para dar notícia'}
  }
},
{
  id:'surge', tipo:'treinador', nome:'Tenente Surge', papel:'líder de Vermilion · Elétrico', cidade:'Vermilion',
  desde:'Te deu a Insígnia Trovão e um aperto de mão que doeu.',
  requer:d=>d.insignias.includes('Insígnia Trovão'),
  ginasio:'vermilion', oferece:['revanche','favor'],
  favor:{
    rotulo:'Pedir o contato do porto',
    limite:2, esperaCap:4,
    texto:d=>[
      fala('Tenente Surge', 'Você quer entrar em algum lugar. Eu conheço esse tom de voz.'),
      fala('Tenente Surge', 'Fala o meu nome na guarita três. Ninguém vai te fazer pergunta.')
    ],
    efeito:d=>{ Estado.marcar('contato_do_porto'); Estado.darItem('Great Ball', 2);
      return [{tipo:'item', texto:'Recebeu 2× Great Ball. O nome dele abre a guarita três.'}]; }
  }
},
{
  id:'erika', tipo:'treinador', nome:'Erika', papel:'líder de Celadon · Grama', cidade:'Celadon',
  desde:'Te deu a Insígnia Arco-Íris com as duas mãos.',
  requer:d=>d.insignias.includes('Insígnia Arco-Íris'),
  ginasio:'celadon', oferece:['revanche','favor','missao'],
  missao:{
    rotulo:'Perguntar o que a estufa precisa',
    rotuloEntrega:'Ligar e falar do time',
    dica:'Levar o time inteiro com moral alta (acima de 70). Ela quer ver, não ouvir.',
    pedido:[
      fala('Erika', 'A estufa não precisa de nada. Eu preciso.'),
      fala('Erika', 'Eu recebo desafiante todo dia e eu vejo time cansado todo dia. Time que obedece por hábito.'),
      fala('Erika', 'Traz o seu time aqui quando ele estiver inteiro. Não curado — inteiro. É diferente e você sabe que é.', 'baixo'),
      fala('Erika', 'Eu quero ver um time que quer estar com a pessoa. Faz uns dois anos que eu não vejo.')
    ],
    objetivo:d=>d.time.length >= 3 && d.time.filter(p=>!p.morto).every(p => (p.moral||0) >= 70),
    entregue:[
      'Você não liga. Você vai até lá, que é a única forma de entregar isso.',
      'Ela olha o seu time solto na estufa por uns dez minutos sem falar nada.',
      fala('Erika', 'Aquele ali dorme colado em você.'),
      fala('Erika', 'E aquele outro ficou entre você e a porta quando eu me mexi rápido. Ele nem percebeu que fez isso.'),
      fala('Erika', 'Obrigada. Eu precisava lembrar que isso existe.', 'baixo')
    ],
    recompensa:d=>{ d.time.forEach(p=>{ if(!p.morto) p.moral = Math.min(100,(p.moral||50)+8); });
      Estado.darItem('Sino Calmante', 1);
      return [{tipo:'item', texto:'Recebeu 1× Sino Calmante. O time inteiro subiu 8 de moral.'}]; },
    rep:{eixo:'bom', delta:2, motivo:'Mostrou à líder de Celadon um time que quer estar ali', notorio:true},
    marca:'erika_viu_o_time'
  },
  favor:{
    rotulo:'Pedir da estufa',
    limite:99, esperaCap:3,
    texto:d=>[
      fala('Erika', 'Eu separo e deixo na portaria. Você não precisa subir.'),
      fala('Erika', 'E descansa. Eu vi o seu time. Eles estão andando demais.', 'baixo')
    ],
    efeito:d=>{ Estado.darItem('Ração', 2); Estado.dados.time.forEach(p=>{ if(!p.morto) p.moral = Math.min(100,(p.moral||50)+6); });
      return [{tipo:'item', texto:'Recebeu 2× Ração. O time inteiro subiu 6 de moral.'}]; }
  }
},
{
  id:'koga', tipo:'treinador', nome:'Koga', papel:'líder de Fuchsia · Venenoso', cidade:'Fuchsia',
  desde:'Te deu a Insígnia Alma sem te dizer onde ficava a saída.',
  requer:d=>d.insignias.includes('Insígnia Alma'),
  ginasio:'fuchsia', oferece:['revanche','favor','missao'],
  missao:{
    rotulo:'Perguntar o que ele não pôde fazer',
    rotuloEntrega:'Ligar e dizer que está no papel',
    dica:'Conseguir por escrito alguma coisa da reserva de Fuchsia. Papel, não conversa.',
    pedido:[
      fala('Koga', 'Eu assinei papel naquela reserva por onze anos. Eu já te disse isso.', 'frio'),
      fala('Koga', 'O que eu não disse é que eu nunca consegui tirar um papel de lá. Nenhum. Em onze anos.'),
      fala('Koga', 'Eu sou líder de ginásio. Eu pedi por ofício três vezes e as três vezes me responderam com protocolo.'),
      fala('Koga', 'Você não é ninguém, e ninguém passa por onde autoridade não passa.', 'baixo'),
      fala('Koga', 'Traz um papel. Qualquer papel de lá dentro, com carimbo.')
    ],
    objetivo:d=>['Ficha técnica de triagem','Relatório de manejo (cópia do Koga)','Ficha do lote 41-C',
                 'Lista do que depende do diretor de área','Anexo técnico do relatório','Ata da 41ª reunião']
                .some(x => Estado.contaItem(x) > 0),
    entregue:[
      d=>fala(d.jogador.nome, 'Eu tenho um papel de lá. Com carimbo.'),
      'Longuíssimo silêncio.',
      fala('Koga', 'Lê o cabeçalho.'),
      'Você lê o cabeçalho.',
      fala('Koga', 'De novo.'),
      'Você lê de novo.',
      fala('Koga', 'Onze anos.', 'baixo'),
      fala('Koga', 'Onze anos e um moleque com uma licença de um ano conseguiu em quantos meses? Não responde. Eu não quero saber.')
    ],
    recompensa:d=>{ Estado.darItem('Ultra Ball', 3); Estado.subirStatus('percepcao');
      return [{tipo:'item', texto:'Recebeu 3× Ultra Ball.'},
              {tipo:'rep', texto:'PERCEPÇÃO +1 — ele te ensinou o que procurar num cabeçalho.'}]; },
    rep:{eixo:'bom', delta:3, motivo:'Tirou da reserva um papel que nem líder de ginásio conseguiu', notorio:true},
    marca:'koga_tem_o_papel'
  },
  favor:{
    rotulo:'Perguntar do Setor 7',
    limite:1, esperaCap:2,
    texto:d=>[
      fala('Koga', 'Eu assinei papel naquela reserva por onze anos.', 'frio'),
      fala('Koga', 'Se você for perguntar lá dentro, não pergunta em voz alta. E leva Antidote.')
    ],
    efeito:d=>{ Estado.darItem('Antidote', 3); Estado.marcar('koga_avisou_do_setor7');
      return [{tipo:'item', texto:'Recebeu 3× Antidote.'}]; }
  }
},
{
  id:'sabrina', tipo:'treinador', nome:'Sabrina', papel:'líder de Saffron · Psíquico', cidade:'Saffron',
  desde:'Te deu a Insígnia Pântano antes de você pedir.',
  requer:d=>d.insignias.includes('Insígnia Pântano'),
  ginasio:'saffron', oferece:['revanche','favor'],
  favor:{
    rotulo:'Deixar ela falar primeiro',
    limite:99, esperaCap:4,
    texto:d=>[
      fala('Sabrina', 'Eu sei por que você ligou.', 'frio', 'Ela atende antes do primeiro toque terminar.'),
      fala('Sabrina', 'Vai dar certo. Não do jeito que você está imaginando. Mas vai.')
    ],
    efeito:d=>{ Estado.subirStatus('intelecto'); return [{tipo:'rep', texto:'INTELECTO +1.'}]; }
  }
},
{
  id:'blaine', tipo:'treinador', nome:'Blaine', papel:'líder de Cinnabar · Fogo', cidade:'Cinnabar',
  desde:'Te deu a Insígnia Vulcão depois de uma pergunta.',
  requer:d=>d.insignias.includes('Insígnia Vulcão'),
  ginasio:'cinnabar', oferece:['revanche','favor'],
  favor:{
    rotulo:'Pedir outra pergunta',
    limite:99, esperaCap:3,
    texto:d=>[
      fala('Blaine', 'Uma: o que um treinador leva que não cabe na mochila?', 'riso'),
      fala('Blaine', 'Não me responde agora. Responde quando chegar no Planalto.')
    ],
    efeito:d=>{ Estado.darItem('Hyper Potion', 1); return [{tipo:'item', texto:'Recebeu 1× Hyper Potion pelo correio da ilha.'}]; }
  }
},
{
  id:'blue', tipo:'treinador', nome:'Blue', papel:'líder de Viridian · Terra', cidade:'Viridian',
  desde:'Te deu a Insígnia Terra e o número no mesmo gesto.',
  requer:d=>d.insignias.includes('Insígnia Terra'),
  ginasio:'viridian', oferece:['revanche','prova'],
  prova:{
    rotulo:'Ligar só pra ligar',
    texto:d=>d.flags.campeao_de_kanto
      ? [fala('Blue', 'Eu soube. A cidade inteira soube.', null, 'Uma pausa longa demais pra ser casual.'),
         fala('Blue', 'Aproveita. Eu falo por experiência: aproveita, porque é curto.')]
      : [fala('Blue', 'Você ligou pra quê? Fala logo.', 'frio'),
         fala('Blue', '...tá. Tá bom. Também é bom ouvir você.', 'baixo')],
    rep:{eixo:'bom', delta:1, motivo:'Manteve contato com quem já sentou na cadeira'}
  }
},

{
  id:'nadia', tipo:'treinador', nome:'Nádia Bragança', papel:'segunda licença, aos quarenta e um', cidade:'Lavender',
  desde:'Perdeu (ou ganhou) a final do aberto contra você e pediu o seu número na arena.',
  requer:d=>!!d.flags.numero_da_nadia,
  oferece:['revanche','prova'],
  rivalExtra:null,
  prova:{
    rotulo:'Perguntar como vai a segunda',
    esperaCap:2,
    texto:d=>[
      fala('Nádia', 'Duas! Eu tenho duas agora!', 'grita'),
      fala('Nádia', 'A de Pewter eu levei três tentativas. Três. E na terceira eu chorei na frente do Brock.', 'riso'),
      fala('Nádia', 'Ele fingiu que não viu. Eu vou ser grata a esse homem pelo resto da vida.')
    ],
    rep:{eixo:'bom', delta:1, motivo:'Acompanhou a segunda licença de alguém'}
  }
},

/* ── rivais ──────────────────────────────────────────────── */
{
  id:'teo', tipo:'treinador', nome:'Téo', papel:'o seu rival', cidade:'estrada',
  desde:'Trocou número com você no meio de uma discussão.',
  requer:d=>!!d.npcs['Téo'],
  rival:'teo', oferece:['revanche','prova','missao'],
  missao:{
    rotulo:'Perguntar por que ele anda estranho',
    rotuloEntrega:'Ligar e contar quantas espécies você registrou',
    dica:'Catalogar 60 espécies na Pokédex. Ele quer perder nisso pra alguém.',
    pedido:[
      fala('Téo', 'Eu não ando estranho.'),
      fala('Téo', '...tá. Eu tô em quarenta e uma espécies na Pokédex e eu travei.'),
      fala('Téo', 'Eu passo o dia catalogando e não sobe. E aí eu olho e todo mundo que eu conheço tá em vinte e poucas e acha que eu sou doente.', 'baixo'),
      fala('Téo', 'Chega em sessenta. Chega em sessenta pra eu ter com quem perder, porque perder pra ninguém não vale nada.')
    ],
    objetivo:d=>Estado.contagemDex().catalogados >= 60,
    entregue:[
      d=>fala(d.jogador.nome, `Sessenta e ${Math.max(0, Estado.contagemDex().catalogados - 60)}.`),
      fala('Téo', 'Mentira.'),
      d=>fala(d.jogador.nome, 'Confere no seu aparelho. A Liga sincroniza.'),
      'Você ouve ele digitando. Você ouve ele parando de digitar.',
      fala('Téo', 'Você tá em sessenta e eu tô em quarenta e três.'),
      fala('Téo', 'Isso é a melhor coisa que aconteceu comigo esse mês e eu odeio isso.', 'riso'),
      fala('Téo', 'Agora eu tenho de quem correr atrás. Você não faz ideia do que isso vale.')
    ],
    recompensa:d=>{ Estado.darItem('Great Ball', 5); Estado.darItem('Ultra Ball', 2);
      return [{tipo:'item', texto:'Ele manda 5× Great Ball e 2× Ultra Ball pelo Centro. "Pra você não parar."'}]; },
    rep:{eixo:'bom', delta:2, motivo:'Deu ao rival alguém de quem correr atrás'},
    marca:'teo_tem_de_quem_correr'
  },
  prova:{
    rotulo:'Contar o que você fez',
    texto:d=>{
      const n = d.insignias.filter(i=>i!=='Título de Campeão').length;
      const meu = d.npcs['Téo'] || {};
      return (meu.opiniao||0) >= 2
        ? [fala('Téo', `${n} já? Cara.`, null, 'Ele não esconde que ficou feliz, e detesta não ter escondido.'),
           fala('Téo', 'Eu tô em quatro. Eu vou te alcançar. Tô avisando com antecedência.')]
        : [fala('Téo', `${n}. Legal.`, 'frio'),
           fala('Téo', 'Eu não liguei pra você. Você que ligou pra mim.')];
    },
    rep:{eixo:'bom', delta:1, motivo:'Manteve o rival por perto em vez de sumir'}
  }
}

];

/* rivais extras entram na agenda sozinhos, pelo arquivo deles */
/* A Nádia não é rival de arco: o time dela é montado na hora */
function timeDaNadia(){
  const n = Math.max(40, 34 + Estado.dados.insignias.length * 3);
  return [59, 26, 94, 103].map((dex, i) => criarPokemon(dex, n + i, {}));
}

function contatosDeRivaisExtras(){
  if (typeof RIVAIS_EXTRA === 'undefined') return [];
  return RIVAIS_EXTRA.map(R => ({
    id:'rival_' + R.id, tipo:'treinador', nome:R.nome, papel:'rival · desde ' + (R.desde || 'a estrada'),
    cidade:R.cidade || 'estrada',
    desde:R.origem || 'Virou seu rival por uma coisa que você escolheu fazer.',
    requer:d=>(d.rivaisExtra||[]).includes(R.id),
    rivalExtra:R.id, oferece:['revanche']
  }));
}

function todosContatos(){ return CONTATOS.concat(contatosDeRivaisExtras()); }
function contatoPorId(id){ return todosContatos().find(c => c.id === id) || null; }
function textoContato(c, campo){ const v = c[campo]; return typeof v === 'function' ? v(Estado.dados) : v; }
