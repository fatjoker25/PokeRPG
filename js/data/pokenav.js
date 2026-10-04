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
  nome:d=>nomeCasa(), papel:d=>`${artigoDe(casaQuem())} ${casaQuem()}`,
  automatico:true,
  oferece:['favor','prova','missao'],
  missao:{
    rotulo:'Perguntar se {casa:ela|ele} precisa de alguma coisa',
    rotuloEntrega:'Ligar e dizer que está consertado',
    dica:'{casa:Ela|Ele} está esperando você em casa.',
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
        fala(nomeCasa(), '{Campeão|Campeã}.', 'baixo', '{casa:Ela|Ele} repete a palavra três vezes antes de conseguir dizer outra coisa.'),
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
  id:'ushio', tipo:'figura', nome:d=>vz().nome, papel:'', cidade:d=>d.jogador.cidade,
  requer:d=>{ const n = d.npcs[vz().nome]; return !!(n && n.opiniao >= 2); },
  oferece:['favor','missao'],
  missao:{
    rotulo:'Perguntar se precisa de alguma coisa',
    rotuloEntrega:'Ligar e contar da medalha',
    dica:'A medalha. Ele não vai perguntar de novo.',
    pedido:[
      d=>fala(vz().nome, 'Precisar eu não preciso. Mas tem uma coisa que me incomoda há uns dois anos.'),
      d=>fala(vz().nome, 'A filha do Vernon ganhou uma medalha de natação em 94. Estadual. A cidade inteira foi ver.'),
      d=>fala(vz().nome, 'Ela morreu em 95 e o Vernon vendeu tudo que tinha dentro da casa, inclusive a medalha.'),
      d=>fala(vz().nome, 'Ele se arrependeu no mesmo mês. Faz dois anos que ele procura e ele não sabe procurar.', 'baixo'),
      d=>fala(vz().nome, 'Você anda por aí. Se aparecer, você vai saber que é.')
    ],
    objetivo:d=>Estado.contaItem('Medalha de natação da filha do Vernon') > 0,
    entregue:[
      d=>fala(d.jogador.nome, 'Eu achei.'),
      'Silêncio do outro lado por uns quatro segundos.',
      d=>fala(vz().nome, 'Não me diz onde.'),
      d=>fala(vz().nome, 'Eu não quero saber onde estava, eu não quero saber quem tinha, eu não quero saber quanto custou.'),
      d=>fala(vz().nome, 'Leva na casa dele. Bate na porta, entrega, e não fica pra conversa.', 'baixo'),
      d=>fala(vz().nome, 'Ele vai querer conversar. Não fica.')
    ],
    recompensa:d=>{ Estado.usarItem('Medalha de natação da filha do Vernon');
      Estado.subirStatus('carisma');
      return [{tipo:'rep', texto:'CARISMA +1 — você aprendeu a entregar uma coisa e ir embora.'}]; },
    rep:{eixo:'bom', delta:3, motivo:'Achou e devolveu a medalha da filha do Vernon', notorio:true},
    marca:'devolveu_a_medalha'
  },
  favor:{
    rotulo:'Perguntar o que anda ouvindo',
    limite:99, esperaCap:2,
    texto:d=>[
      fala(vz().nome, `Eu fico aqui na frente de casa ${vz().fazer.replace(/^\S+/, m => m.replace(/r$/, 'ndo'))}, {menino|menina}. A frente de casa é onde a cidade fala.`),
      d=>fala(vz().nome, 'Passou gente aqui perguntando de você. Não era da Liga. Eu não dei linha nenhuma.'),
      d=>fala(vz().nome, 'E olha: quando alguém te oferecer coisa demais de graça, conta quantas saídas tem a sala.')
    ],
    efeito:d=>{ Estado.subirStatus('percepcao'); return [{tipo:'rep', texto:'PERCEPÇÃO +1 — você passou a contar as saídas das salas.'}]; }
  }
},
{
  id:'goro', tipo:'figura', nome:'Célio', papel:'dirige a perua do laboratório', cidade:'estrada',
  requer:d=>!!d.flags.numero_do_goro,
  oferece:['favor','prova'],
  favor:{
    rotulo:'Perguntar onde ele está este mês',
    limite:99, esperaCap:2,
    texto:d=>{
      const paradas = ['Viridian','Pewter','Cerulean','Vermilion','Lavender','Celadon','Saffron','Fuchsia','Cinnabar'];
      const onde = paradas[(d.capitulo + 3) % paradas.length];
      return [
        fala('Célio', 'Hoje? Hoje eu tô em ' + onde + '. Amanhã cedo eu saio.'),
        fala('Célio', 'Se você tiver por perto aparece, que eu sempre tenho coisa sobrando na caixa. Coisa boa não, mas sobrando.', 'riso'),
        fala('Célio', 'Deixei um pacote pra você no balcão do Centro da última cidade que você passou. Tá no seu nome.')
      ];
    },
    /* o pacote fica no balcão: chega na próxima vez que você entrar num Centro */
    efeito:d=>{ d.flags.pacote_celio = (d.flags.pacote_celio || 0) + 1;
      return [{tipo:'info', texto:'Tem um pacote no seu nome esperando no balcão de um Centro Pokémon.'}]; }
  },
  prova:{
    rotulo:'Contar como ele está',
    esperaCap:3,
    texto:d=>{
      const p = (d.time || []).find(x => x.dex === d.jogador.inicialDex) || d.time[0];
      if (!p) return [
        fala('Célio', 'E o Pokémon?'),
        'Você demora pra responder e a demora responde por você.',
        fala('Célio', '…tá. Não precisa falar. Eu já ouvi essa pausa antes.', 'baixo'),
        fala('Célio', 'Liga pra mim quando quiser, viu. Não é só pra notícia boa.')
      ];
      return [
        fala('Célio', 'E o Pokémon?'),
        d=>`Você conta: ${nomeExib(p)}, nível ${p.nivel}, e conta uma coisa específica que ele faz e que ninguém pediu pra ele fazer.`,
        fala('Célio', 'Eu anotei numa caderneta que eu tenho aqui, e não é a de trabalho.'),
        fala('Célio', 'Essa é a minha. Eu anoto o que volta.', 'baixo')
      ];
    },
    rep:{eixo:'bom', delta:1, motivo:'Deu notícia a quem entregou a primeira Pokébola'}
  }
},
{
  id:'odete', tipo:'figura', nome:'Sra. Perla', papel:'a vizinha do dezoito', cidade:d=>d.jogador.cidade,
  requer:d=>!!d.npcs['Sra. Perla'],
  oferece:['favor','missao'],
  missao:{
    rotulo:'Perguntar por que ela ligou duas vezes',
    rotuloEntrega:'Contar o que tem no cais',
    dica:'Ela quer saber do cais de Vermilion.',
    pedido:[
      fala('Sra. Perla', 'Eu liguei duas vezes ontem e desliguei nas duas. Você deve ter visto no aparelho.'),
      fala('Sra. Perla', 'Você vai passar por Vermilion uma hora. Todo mundo passa.'),
      fala('Sra. Perla', 'Quando passar, vai no cais, o de carga, não o de turista. Fica um tempo lá.', 'baixo'),
      fala('Sra. Perla', 'Depois me liga e me conta o que tem lá. Só isso. Não precisa perguntar nada pra ninguém.'),
      fala('Sra. Perla', 'E não precisa me perguntar por quê.', 'frio')
    ],
    objetivo:d=>!!d.visitados.vermilion,
    entregue:[
      fala('Sra. Perla', 'Fala.', null, 'Ela atendeu no primeiro toque. Estava sentada perto do telefone.'),
      'Você conta: guindaste velho, três galpões, o de número dois fechado com chapa, e um quadro de avisos com nome de gente que embarcou.',
      fala('Sra. Perla', 'Tinha nome no quadro?'),
      'Você diz que tinha. Ela fica quieta o tempo de quatro respirações.',
      fala('Sra. Perla', 'Tá bom. Obrigada, {meu filho|minha filha}.', 'baixo'),
      fala('Sra. Perla', 'Passa aqui quando voltar que eu separo uma coisa pra você.'),
      'Ela desliga antes de você responder.'
    ],
    recompensa:d=>{ Estado.darItem('Super Potion', 3); Estado.darItem('Revive', 1);
      return [{tipo:'item', texto:'Recebeu 3× Super Potion e 1× Revive.'}]; },
    rep:{eixo:'bom', delta:1, motivo:'Foi até o cais de Vermilion olhar uma coisa que não era sua'},
    marca:'odete_soube_do_cais'
  },
  favor:{
    rotulo:'Perguntar da caixa',
    limite:99, esperaCap:3,
    texto:d=>[
      fala('Sra. Perla', 'A caixa? A caixa eu quero de volta, mas já desencanei.', 'riso'),
      fala('Sra. Perla', 'Olha, eu separei umas coisas aqui que estavam no armário e que não servem pra mim. Passa um dia.')
    ],
    efeito:d=>{ Estado.darItem('Super Potion', 2); Estado.darItem('Great Ball', 1);
      return [{tipo:'item', texto:'Recebeu 2× Super Potion e 1× Great Ball.'}]; }
  }
},
{
  id:'enfermeira', tipo:'figura', nome:'Enfermeira do Centro', papel:'seis insígnias, e parou', cidade:'Viridian',
  /* como ela aparece no balão das cenas: é por aqui que o PokéNav
     descobre que o jogador já perguntou o nome dela */
  falaComo:'a enfermeira',
  requer:d=>!!d.flags.historia_da_enfermeira,
  oferece:['favor','missao'],
  missao:{
    rotulo:'Perguntar o que ela não conseguiu fazer',
    rotuloEntrega:'Ligar e contar das seis',
    dica:'Ela quer ver o que você prometeu.',
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
  requer:d=>d.insignias.includes('Insígnia Pedra'),
  ginasio:'pewter',
  oferece:['revanche','favor','missao'],
  missao:{
    rotulo:'Perguntar o que ele quer ver',
    rotuloEntrega:'Dizer que já dá pra ver',
    dica:'Ele quer ver um Pokémon de pedra criado, não comprado.',
    pedido:[
      fala('Brock', 'Quer fazer uma coisa por mim? Não é favor. É uma coisa que eu quero ver.'),
      fala('Brock', 'Todo mundo que me enfrenta chega com alguma coisa de pedra pega na semana passada, já grande, já forte.'),
      fala('Brock', 'Eu quero ver um que você tenha levantado do chão. Do começo.', 'baixo'),
      fala('Brock', 'Me liga quando tiver. Eu sei diferenciar, então não tenta me enrolar.')
    ],
    objetivo:d=>(d.time||[]).some(p => !p.morto && (p.tipos||[]).some(t => t==='Pedra' || t==='Terrestre') && p.nivel >= 25),
    entregue:[
      fala('Brock', 'Fala o nome e o nível.'),
      'Você fala. Do outro lado dá pra ouvir ele largando alguma coisa pesada em cima de uma bancada.',
      fala('Brock', 'Vinte e cinco. E tá com você desde quando?'),
      'Você responde. Ele não comenta.',
      fala('Brock', 'Eu criei nove irmãos. Você aprende a ver quando uma coisa foi feita com tempo ou comprada pronta.', 'baixo'),
      fala('Brock', 'Essa foi feita com tempo. Tá anotado aqui do meu lado.')
    ],
    recompensa:d=>{ Estado.darItem('Punho de Ferro', 1); Estado.darItem('Hyper Potion', 1);
      return [{tipo:'item', texto:'Recebeu 1× Punho de Ferro e 1× Hyper Potion.'}]; },
    rep:{eixo:'bom', delta:1, motivo:'Criou do começo um Pokémon que o líder de Pewter quis ver', notorio:true},
    marca:'brock_viu_a_pedra'
  },
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
  requer:d=>d.insignias.includes('Insígnia Cascata'),
  ginasio:'cerulean', oferece:['revanche','prova','missao'],
  missao:{
    rotulo:'Perguntar da ponte',
    rotuloEntrega:'Contar como está a ponte',
    dica:'A ponte ao norte. Ela quer saber quem está lá.',
    pedido:[
      fala('Misty', 'Você conhece a ponte? A estreita, ao norte daqui.'),
      fala('Misty', 'Tem cinco que ficam lá cobrando pedágio de menino de doze anos. Cinco. Eu já fui lá duas vezes.'),
      fala('Misty', 'Na segunda vez eles me chamaram de senhora e fugiram, o que é pior, porque quer dizer que eles só somem enquanto eu estou olhando.', 'riso'),
      fala('Misty', 'Passa na ponte. Não precisa bater em ninguém. Passa e olha.', 'baixo'),
      fala('Misty', 'Depois me diz se eles ainda estão lá.')
    ],
    objetivo:d=>!!d.visitados.rota24,
    entregue:[
      fala('Misty', 'E aí? Cinco?'),
      'Você conta o que viu na ponte.',
      fala('Misty', '…tá. Então eu vou ter que ir uma terceira vez.'),
      fala('Misty', 'Obrigada por ter olhado. Sério. Ninguém olha.', 'baixo'),
      fala('Misty', 'Toma isso aqui e some, antes que eu te peça pra ir junto.')
    ],
    recompensa:d=>{ Estado.darItem('Great Ball', 3); Estado.j.dinheiro += 2000;
      return [{tipo:'item', texto:'Recebeu 3× Great Ball e 2000 ₽.'}]; },
    rep:{eixo:'bom', delta:1, motivo:'Foi olhar a ponte por uma líder que já foi lá duas vezes'},
    marca:'misty_soube_da_ponte'
  },
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
  requer:d=>d.insignias.includes('Insígnia Trovão'),
  ginasio:'vermilion', oferece:['revanche','favor','missao'],
  missao:{
    rotulo:'Perguntar o que ele quer contar',
    rotuloEntrega:'Dizer que ninguém ficou pra trás',
    dica:'Ele conta cabeça, não insígnia.',
    aoAceitar:d=>{ d.flags.surge_contou = (d.cemiterio||[]).length; },
    pedido:[
      fala('Tenente Surge', 'Vou te falar uma coisa e você vai achar que é frescura de veterano.'),
      fala('Tenente Surge', 'Eu não conto insígnia. Eu conto cabeça. Quantos saíram comigo e quantos voltaram.'),
      fala('Tenente Surge', 'Chega em cinco insígnias sem perder ninguém no caminho. Ninguém. Desmaiar não conta, desmaiar é parte.', 'baixo'),
      fala('Tenente Surge', 'Aí você me liga. Se perder alguém antes disso, me liga do mesmo jeito. Eu atendo as duas ligações.')
    ],
    objetivo:d=>d.insignias.filter(i=>i!=='Título de Campeão').length >= 5
               && (d.cemiterio||[]).length <= (d.flags.surge_contou || 0),
    entregue:[
      fala('Tenente Surge', 'Cinco. E o número?'),
      'Você diz o número. É o mesmo de quando ele pediu.',
      'Do outro lado tem um silêncio que dura mais do que devia.',
      fala('Tenente Surge', 'Bom.', 'baixo'),
      fala('Tenente Surge', 'Eu saí com seis, uma vez, e voltei com quatro. Faz dezenove anos e eu ainda conto de novo às vezes, de noite, pra ver se dá outro número.'),
      fala('Tenente Surge', 'Tem um aqui comigo que eu não uso mais. Ele é barulhento e explode quando se assusta, e eu não tenho paciência pra isso hoje em dia.'),
      fala('Tenente Surge', 'Vai com você. Não deixa ele virar número.', 'baixo')
    ],
    recompensa:d=>{
      const p = criarPokemon(100, Math.max(20, 16 + d.insignias.length * 2), {
        moral: 60, historia: 'Era do Tenente Surge. Ele parou de usar e não explicou por quê.'
      });
      const onde = Estado.adicionar(p);
      Estado.marcar('ganhou_o_voltorb_do_surge');
      return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv ${p.nivel}) saiu da Pokébola.${notaDestino(onde)}`}];
    },
    rep:{eixo:'bom', delta:2, motivo:'Chegou a cinco insígnias sem enterrar ninguém', notorio:true},
    marca:'surge_contou_a_cabeca'
  },
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
  requer:d=>d.insignias.includes('Insígnia Arco-Íris'),
  ginasio:'celadon', oferece:['revanche','favor','missao'],
  missao:{
    rotulo:'Perguntar o que a estufa precisa',
    rotuloEntrega:'Ligar e falar do time',
    dica:'Ela quer ver, não ouvir.',
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
  requer:d=>d.insignias.includes('Insígnia Alma'),
  ginasio:'fuchsia', oferece:['revanche','favor','missao'],
  missao:{
    rotulo:'Perguntar o que ele não pôde fazer',
    rotuloEntrega:'Ligar e dizer que está no papel',
    dica:'Papel, não conversa.',
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
      fala('Koga', 'Onze anos e {um moleque|uma moleca} com uma licença de um ano conseguiu em quantos meses? Não responde. Eu não quero saber.')
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
  requer:d=>d.insignias.includes('Insígnia Pântano'),
  ginasio:'saffron', oferece:['revanche','favor','missao'],
  missao:{
    rotulo:'Perguntar o que ela viu',
    rotuloEntrega:'Ligar da torre',
    dica:'Ela falou de Lavender.',
    pedido:[
      fala('Sabrina', 'Você não ligou pra perguntar isso, mas eu vou responder assim mesmo.', 'frio'),
      fala('Sabrina', 'Tem um andar da torre de Lavender onde as pessoas param de falar sozinhas. O último.'),
      fala('Sabrina', 'Sobe lá. Não leva ninguém pra fora da Pokébola, não acende lanterna, não fala.', 'baixo'),
      fala('Sabrina', 'Fica o tempo que você aguentar. Depois me liga de lá mesmo.'),
      fala('Sabrina', 'Eu não vou te dizer o que você vai ouvir. Se eu disser, você ouve o que eu falei.')
    ],
    objetivo:d=>!!d.visitados.lavender,
    entregue:[
      fala('Sabrina', 'Está ligando de lá.', 'frio', 'Não é pergunta.'),
      'Você fica quiet{o|a}. Ela também. O telefone sustenta os dois silêncios sem reclamar.',
      fala('Sabrina', 'Então você ouviu.'),
      fala('Sabrina', 'Todo mundo ouve uma coisa diferente e todo mundo tem certeza de que é a mesma coisa. Isso me interessa mais do que fantasma.', 'baixo'),
      fala('Sabrina', 'Obrigada. Eu não podia subir de novo.'),
      'Ela desliga. Você percebe, com atraso, que ela disse obrigada.'
    ],
    recompensa:d=>{ Estado.subirStatus('percepcao'); Estado.darItem('Sino Calmante', 1);
      return [{tipo:'rep', texto:'PERCEPÇÃO +1.'}, {tipo:'item', texto:'Recebeu 1× Sino Calmante.'}]; },
    rep:{eixo:'bom', delta:1, motivo:'Subiu a torre de Lavender calado, porque pediram'},
    marca:'sabrina_ouviu_a_torre'
  },
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
  requer:d=>d.insignias.includes('Insígnia Vulcão'),
  ginasio:'cinnabar', oferece:['revanche','favor','missao'],
  missao:{
    rotulo:'Aceitar a pergunta difícil',
    rotuloEntrega:'Dar a resposta',
    dica:'Ele quer o número da Pokédex, não a resposta bonita.',
    pedido:[
      fala('Blaine', 'Essa aqui não é charada. Essa é serviço.', 'riso'),
      fala('Blaine', 'A ilha tinha um laboratório e o laboratório tinha uma lista de espécies. A lista queimou junto com o resto.'),
      fala('Blaine', 'Eu não quero a lista de volta. Eu quero saber se dá pra refazer uma sozinho, andando.', 'baixo'),
      fala('Blaine', 'Cataloga oitenta e me liga. Oitenta é o número que eu nunca passei.')
    ],
    objetivo:d=>Estado.contagemDex().catalogados >= 80,
    entregue:[
      fala('Blaine', 'Oitenta?'),
      'Você confirma. Ele pede pra você ler cinco de cabeça, sem olhar. Você lê.',
      fala('Blaine', 'Não é decoreba, é convivência. Dá pra ouvir a diferença.'),
      fala('Blaine', 'Eu parei em setenta e nove porque eu quis provar uma coisa e queimei uma ilha inteira provando.', 'baixo'),
      fala('Blaine', 'Você fez andando. Isso responde a pergunta que eu te fiz no ginásio, aliás.')
    ],
    recompensa:d=>{ Estado.darItem('Pedra do Fogo', 1); Estado.darItem('Ultra Ball', 2);
      return [{tipo:'item', texto:'Recebeu 1× Pedra do Fogo e 2× Ultra Ball.'}]; },
    rep:{eixo:'bom', delta:2, motivo:'Passou de oitenta espécies catalogadas a pé', notorio:true},
    marca:'blaine_ouviu_os_oitenta'
  },
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
  requer:d=>d.insignias.includes('Insígnia Terra'),
  ginasio:'viridian', oferece:['revanche','prova'],
  prova:{
    rotulo:'Ligar só pra ligar',
    texto:d=>d.flags.campeao_de_kanto
      ? [fala('Blue', 'Eu soube. A cidade inteira soube.', null, 'Uma pausa longa demais pra ser casual.'),
         fala('Blue', 'Aproveita. Eu falo por experiência: aproveita, porque é curto.')]
      : [fala('Blue', 'Você ligou pra quê? Fala logo.', 'frio'),
         fala('Blue', '…tá. Tá bom. Também é bom ouvir você.', 'baixo')],
    rep:{eixo:'bom', delta:1, motivo:'Manteve contato com quem já sentou na cadeira'}
  }
},

{
  id:'nadia', tipo:'treinador', nome:'Nadia Arden', papel:'segunda licença, aos quarenta e um', cidade:'Lavender',
  requer:d=>!!d.flags.numero_da_nadia,
  oferece:['revanche','prova','missao'],
  rivalExtra:null,
  missao:{
    rotulo:'Perguntar onde ela parou da primeira vez',
    rotuloEntrega:'Contar de Saffron',
    dica:'Saffron. Foi onde ela parou aos dezenove.',
    pedido:[
      fala('Nadia', 'Da primeira vez eu parei em Saffron. Você já sabia disso?'),
      fala('Nadia', 'Eu tinha dezenove anos, quatro insígnias e um Raticate que era a melhor coisa que já aconteceu comigo.'),
      fala('Nadia', 'Eu entrei naquele ginásio e ela olhou pra mim e eu entendi, no meio do primeiro turno, que eu não ia conseguir. E eu fui embora e demorei vinte e dois anos pra voltar.', 'baixo'),
      fala('Nadia', 'Não é revanche. Eu não quero que você bata nela por mim, isso seria ridículo.'),
      fala('Nadia', 'Eu só quero que alguém que eu conheço ganhe aquela insígnia e me ligue contando como foi lá dentro. Eu nunca vi o final.', 'baixo')
    ],
    objetivo:d=>d.insignias.includes('Insígnia Pântano'),
    entregue:[
      fala('Nadia', 'Conta. Conta tudo, do começo, e não pula a parte do chão.'),
      'Você conta: o chão que engana, as portas, o silêncio dela antes de cada ordem.',
      fala('Nadia', 'O chão. Eu lembro do chão.'),
      'Ela fica um tempo sem falar nada e você não interrompe.',
      fala('Nadia', 'Vinte e dois anos e eu tinha guardado o chão errado na cabeça. Era do outro lado.', 'riso'),
      fala('Nadia', 'Obrigada. Agora eu sei como termina.', 'baixo'),
      fala('Nadia', 'Eu vou chegar lá. Mais devagar que você, mas eu chego.')
    ],
    recompensa:d=>{ Estado.j.dinheiro += 4000; Estado.darItem('Hyper Potion', 2);
      Estado.dados.time.forEach(p=>{ if(!p.morto) p.moral = Math.min(100,(p.moral||50)+5); });
      return [{tipo:'item', texto:'Recebeu 4000 ₽ e 2× Hyper Potion. O time inteiro subiu 5 de moral.'}]; },
    rep:{eixo:'bom', delta:2, motivo:'Terminou por alguém uma história parada há vinte e dois anos', notorio:true},
    marca:'nadia_soube_do_final'
  },
  prova:{
    rotulo:'Perguntar como vai a segunda',
    esperaCap:2,
    texto:d=>[
      fala('Nadia', 'Duas! Eu tenho duas agora!', 'grita'),
      fala('Nadia', 'A de Pewter eu levei três tentativas. Três. E na terceira eu chorei na frente do Brock.', 'riso'),
      fala('Nadia', 'Ele fingiu que não viu. Eu vou ser grata a esse homem pelo resto da vida.')
    ],
    rep:{eixo:'bom', delta:1, motivo:'Acompanhou a segunda licença de alguém'}
  }
},

{
  /* ============================================================
     O CURADOR — ele pergunta uma coisa sobre você e some
     A resposta decide o que ele te manda meses depois. Ele nunca
     fala em Pokémon, nem na pergunta, nem na entrega.
     ============================================================ */
  id:'curador', tipo:'figura', nome:'Fabre', papel:'curador de coisa que ninguém guarda', cidade:'Lavender',
  requer:d=>!!d.flags.a_pergunta_do_curador,
  oferece:['missao'],
  missao:{
    rotulo:'Perguntar por que ele anotou aquilo',
    rotuloEntrega:'Ligar e dizer que você chegou em Lavender',
    dica:'Ele espera você em Lavender.',
    pedido:[
      fala('Fabre', 'Eu não anotei pra nada. Eu anoto tudo.'),
      fala('Fabre', 'Eu tenho oitenta e três cadernos de capa dura com resposta de gente que passou por aqui em dezenove anos.'),
      fala('Fabre', 'Quando você tiver quatro insígnias, aparece. Lavender, o abrigo, qualquer hora.'),
      d=>fala(d.jogador.nome, 'Pra quê?'),
      fala('Fabre', 'Pra eu te devolver uma coisa que não é minha.', 'baixo'),
      fala('Fabre', 'Não pergunta o que é. Se eu falar, estraga.')
    ],
    objetivo:d=>d.insignias.filter(i=>i!=='Título de Campeão').length >= 4,
    entregue:d=>{
      /* a resposta que você deu meses atrás decide o que chega */
      const guarda = d.flags.respondeu_guardar;
      return [
        'O abrigo do Sr. Fuji tem uma sala nos fundos que você nunca tinha visto, com oitenta e três cadernos de capa dura numa estante feita à mão.',
        fala('Fabre', 'Caderno setenta e um, página quatro.', null, 'Ele acha em onze segundos.'),
        d=>fala('Fabre', `Eu te perguntei uma coisa e você respondeu: "${guarda ? 'guardar' : 'passar adiante'}".`),
        fala('Fabre', 'Eu não escolho o que dar. A resposta escolhe.'),
        guarda
          ? 'Ele volta com uma Pokébola velha, dessas de antes do padrão atual, com o lacre da Liga de 1989 ainda intacto.'
          : 'Ele volta com uma Pokébola velha, dessas de antes do padrão atual, com o lacre já rompido e um pedaço de fita no lugar.',
        guarda
          ? fala('Fabre', 'Esse aqui ficou. Ficou porque ninguém veio buscar e porque eu não devolvi pro sistema.', 'baixo')
          : fala('Fabre', 'Esse aqui passou por quatro pessoas antes de você. Nenhuma delas ficou com ele, e todas as quatro fizeram certo.', 'baixo'),
        fala('Fabre', 'Não abre aqui. Abre na estrada.')
      ];
    },
    recompensa:d=>{
      const guarda = !!d.flags.respondeu_guardar;
      /* guardar → Haunter (fica com você, e não vira Gengar sem troca)
         passar adiante → Kadabra (a linha dele só se completa passando por outra mão) */
      const dex = guarda ? 93 : 64;
      const p = criarPokemon(dex, Math.max(22, 18 + Estado.dados.insignias.length * 2), {
        moral: 55,
        historia: guarda
          ? 'Veio do abrigo de Lavender, numa Pokébola lacrada desde 1989. Ninguém foi buscar.'
          : 'Veio do abrigo de Lavender. Passou por quatro pessoas antes de você, e nenhuma delas ficou.'
      });
      const onde = Estado.adicionar(p);
      Estado.marcar(guarda ? 'ganhou_do_curador_guardando' : 'ganhou_do_curador_passando');
      return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv ${p.nivel}) saiu da Pokébola.${notaDestino(onde)}`},
              {tipo:'eco', texto: guarda
                ? 'Ele não vai mudar de forma sozinho. Coisa que fica, fica como está.'
                : 'A linha dele só se completa passando por outra mão. Você vai ter que decidir isso um dia.'}];
    },
    rep:{eixo:'bom', delta:2, motivo:'Voltou em Lavender porque tinha prometido, sem saber pra quê'},
    marca:'o_curador_entregou'
  }
},

/* ── gente da estrada que a história deixou na agenda ──────
   Quem gostou de você o bastante passa o número. A condição é a
   opinião dela (o que você fez na cena), e a pessoa só entra depois
   do capítulo em que vocês se conheceram — o número é dado na
   despedida, não no meio da conversa. */
{
  id:'cosmo', tipo:'figura', nome:'Sr. Cosmo', papel:'', cidade:'Cerulean',
  requer:d=>opiniaoDe('Sr. Cosmo') >= 3 && d.capitulo > 6,
  oferece:['prova','missao'],
  prova:{
    rotulo:'Perguntar se ele pegou alguma coisa',
    esperaCap:2,
    texto:[
      fala('Sr. Cosmo', 'Não.'),
      'Um silêncio comprido, do tipo que tem água correndo no fundo.',
      fala('Sr. Cosmo', 'Mas o rio tá da cor certa essa semana. Isso eu anoto.', 'baixo')
    ],
    rep:{eixo:'bom', delta:1, motivo:'Ligou pra um pescador que não pega nada só pra perguntar'}
  },
  missao:{
    rotulo:'Perguntar se ele quer alguma coisa do rio',
    rotuloEntrega:'Contar que você viu um Goldeen',
    dica:'Um Goldeen. Ele quer saber se ainda tem.',
    pedido:[
      fala('Sr. Cosmo', 'Quatro anos e eu nunca vi um Goldeen nesse rio. Meu pai via todo dia.'),
      fala('Sr. Cosmo', 'Eu não quero pegar. Eu quero saber se ainda tem.'),
      fala('Sr. Cosmo', 'Se você vir um, em qualquer água de Kanto, me conta. Só isso.', 'baixo')
    ],
    objetivo:d=>Estado.conheceu(118) || Estado.conheceu(119),
    entregue:[
      fala('Sr. Cosmo', 'Viu?'),
      d=>fala(d.jogador.nome, 'Vi. Com o chifre e tudo.'),
      fala('Sr. Cosmo', 'Então ainda tem.'),
      'Você ouve ele largar alguma coisa no chão, devagar.',
      fala('Sr. Cosmo', 'Amanhã eu venho mais cedo.', 'baixo')
    ],
    recompensa:d=>{ Estado.darItem('Isca', 5); Estado.darItem('Super Potion', 2);
      return [{tipo:'item', texto:'Ele manda pelo Centro 5× Isca e 2× Super Potion. "Isca boa. Não funciona comigo, mas é boa."'}]; },
    rep:{eixo:'bom', delta:2, motivo:'Contou a um pescador velho que o Pokémon do pai dele ainda existe'},
    marca:'cosmo_soube_do_goldeen'
  }
},
{
  id:'zelador', tipo:'figura', nome:'Zelador da Torre', falaComo:'Zelador da Torre', papel:'', cidade:'Lavender',
  requer:d=>opiniaoDe('Zelador da Torre') >= 4 && d.capitulo > 7,
  oferece:['favor','prova'],
  favor:{
    rotulo:'Perguntar como está a Torre',
    limite:3, esperaCap:3,
    texto:[
      fala('Zelador da Torre', 'Vela nova no sexto andar. Todo dia.'),
      fala('Zelador da Torre', 'Tá quieto lá em cima. Quieto de verdade, não aquele quieto de antes.', 'baixo'),
      fala('Zelador da Torre', 'Deixei uma coisa pra você no Centro daqui. O povo que sobe esquece remédio no banco da entrada, e eu guardo pra quem precisa.')
    ],
    efeito:d=>{ Estado.darItem('Full Heal', 1); Estado.darItem('Revive', 1);
      return [{tipo:'item', texto:'No balcão do Centro: 1× Full Heal e 1× Revive, embrulhados em papel de vela.'}]; }
  },
  prova:{
    rotulo:'Contar onde você está',
    texto:d=>[
      fala('Zelador da Torre', `${d.insignias.filter(i=>i!=='Título de Campeão').length} insígnias. Eu vou contar pro pessoal da pousada.`),
      fala('Zelador da Torre', 'Eles não te conhecem. Eu conto mesmo assim.', 'riso')
    ],
    rep:{eixo:'bom', delta:1, motivo:'Deu notícia a quem repõe vela na Torre de Lavender'}
  }
},
{
  id:'elias', tipo:'figura', nome:'Elias', papel:'', cidade:'Celadon',
  requer:d=>opiniaoDe('Elias') >= 6 && d.capitulo > 9,
  oferece:['prova','favor'],
  prova:{
    rotulo:'Perguntar como ele está',
    esperaCap:2,
    texto:[
      fala('Elias', 'Cara! Tô bem. Tô bem de verdade, não bem de hospital.'),
      fala('Elias', 'Tô ajudando no Centro de Celadon, na recepção. Dá pra ver gente chegando com o time machucado e saber o que fazer.'),
      fala('Elias', 'Torre eu não subo mais. Mas escada de Centro eu subo.', 'riso')
    ],
    rep:{eixo:'bom', delta:1, motivo:'Ligou pra saber de quem tirou da Torre'}
  },
  favor:{
    rotulo:'Pedir uma ajuda do balcão do Centro',
    limite:2, esperaCap:3,
    texto:[
      fala('Elias', 'Ajuda? Pra você? Sempre.'),
      fala('Elias', 'O Centro dá o remédio de quem esquece de buscar. Eu separei os seus.')
    ],
    efeito:d=>{ Estado.darItem('Hyper Potion', 2);
      return [{tipo:'item', texto:'Chegou 2× Hyper Potion no seu nome, com um bilhete: "Tô te devendo pra sempre. — E."'}]; }
  }
},
{
  id:'edric', tipo:'figura', nome:'Sr. Edric', papel:'', cidade:'Rota 10',
  requer:d=>opiniaoDe('Sr. Edric') >= 5 && d.capitulo > 10,
  oferece:['prova','favor'],
  prova:{
    rotulo:'Perguntar se ele foi no primeiro sábado',
    esperaCap:2,
    texto:[
      fala('Sr. Edric', 'Fui. Cadeira de praia, garrafa térmica, de frente pro portão.'),
      fala('Sr. Edric', 'Alguém tem que estar olhando. Eu te disse pra ser o exagerado, lembra?'),
      fala('Sr. Edric', 'Eu tô sendo também.', 'riso')
    ],
    rep:{eixo:'bom', delta:1, motivo:'Não deixou quem vigia a usina vigiar sozinho'}
  },
  favor:{
    rotulo:'Pedir o croqui dele de novo',
    limite:1,
    texto:[
      fala('Sr. Edric', 'O croqui? Eu fiz uma cópia pra você. À mão, como o primeiro.'),
      fala('Sr. Edric', 'Não é da usina. É do resto da serra. Quem anda por lá precisa mais de mapa do que quem entra no portão.')
    ],
    efeito:d=>{ Estado.subirStatus('intelecto');
      return [{tipo:'rep', texto:'INTELECTO +1 — você passou a ler encosta como quem lê planta de casa.'}]; }
  }
},
{
  id:'rhea', tipo:'figura', nome:'Rhea Ashford', papel:'', cidade:'Saffron',
  requer:d=>opiniaoDe('Rhea Ashford') >= 2 && d.capitulo > 11,
  oferece:['prova','favor'],
  prova:{
    rotulo:'Contar uma coisa que você viu',
    esperaCap:2,
    texto:[
      fala('Rhea Ashford', 'Fala. Eu tô com o gravador desligado, pode falar.'),
      'Você conta. Ela não interrompe e você ouve a caneta correndo.',
      fala('Rhea Ashford', 'Isso não sai amanhã. Isso sai quando eu tiver a segunda fonte.'),
      fala('Rhea Ashford', 'Mas sai.', 'baixo')
    ],
    rep:{eixo:'bom', delta:1, motivo:'Contou o que viu pra quem escreve'}
  },
  favor:{
    rotulo:'Perguntar o que ela anda ouvindo',
    limite:3, esperaCap:3,
    texto:[
      fala('Rhea Ashford', 'Ouvindo? Muita coisa. Publicando, pouca.'),
      fala('Rhea Ashford', 'Um conselho de quem entrevista gente todo dia: quem fala demais no primeiro minuto tá escondendo o segundo.')
    ],
    efeito:d=>{ Estado.subirStatus('percepcao');
      return [{tipo:'rep', texto:'PERCEPÇÃO +1 — você passou a reparar no segundo minuto das conversas.'}]; }
  }
},
{
  id:'pia', tipo:'figura', nome:'Dra. Pia', papel:'', cidade:'Fuchsia',
  requer:d=>opiniaoDe('Dra. Pia') >= 5 && d.capitulo > 12,
  oferece:['favor','prova'],
  favor:{
    rotulo:'Pedir remédio pro time',
    limite:3, esperaCap:2,
    texto:[
      fala('Dra. Pia', 'Descreve.'),
      'Você descreve. Ela faz duas perguntas curtas e certeiras.',
      fala('Dra. Pia', 'Nada grave. Mas eu mando o que eu mandaria pra qualquer paciente meu, e você não discute.')
    ],
    efeito:d=>{ Estado.darItem('Full Heal', 2); Estado.darItem('Hyper Potion', 1);
      return [{tipo:'item', texto:'Chegou no Centro, com receita dobrada em quatro: 2× Full Heal e 1× Hyper Potion.'}]; }
  },
  prova:{
    rotulo:'Contar como o time está',
    texto:d=>{
      const vivos = Estado.timeVivo().length;
      return [
        fala('Dra. Pia', `${vivos} de pé. Bom.`),
        fala('Dra. Pia', 'Eu anoto. Eu anoto todo mundo agora, no campo de observação.', 'baixo')
      ];
    },
    rep:{eixo:'bom', delta:1, motivo:'Manteve a médica de Fuchsia sabendo do time'}
  }
},
{
  id:'wilma', tipo:'figura', nome:'Sra. Wilma', papel:'', cidade:'Cinnabar',
  requer:d=>opiniaoDe('Sra. Wilma') >= 5 && d.capitulo > 14,
  oferece:['prova','favor'],
  prova:{
    rotulo:'Ligar pra conversar',
    esperaCap:2,
    texto:[
      fala('Sra. Wilma', 'Você ligou pra velha de Cinnabar? Senta, senta. Quer dizer, você não tá aqui. Mas senta.', 'riso'),
      fala('Sra. Wilma', 'Aqui tá igual. O vulcão dorme, a maré sobe, o laboratório continua fechado.'),
      fala('Sra. Wilma', 'Dezoito anos limpando aquele chão e eu ainda acordo na hora de ir.', 'baixo')
    ],
    rep:{eixo:'bom', delta:1, motivo:'Ligou pra uma senhora de Cinnabar só pra conversar'}
  },
  favor:{
    rotulo:'Perguntar se ela precisa de alguma coisa',
    limite:2, esperaCap:3,
    texto:[
      fala('Sra. Wilma', 'Eu? Não. Você é que precisa comer.'),
      fala('Sra. Wilma', 'Mandei um bolo pro Centro. E um dinheirinho dentro, que você não vai recusar porque eu já mandei.')
    ],
    efeito:d=>{ Estado.j.dinheiro += 1500; Estado.curarJogador(10);
      return [{tipo:'item', texto:'+1500 ₽, dobrados dentro de um guardanapo, e um bolo de fubá que dura dois dias.'}]; }
  }
},
{
  id:'xavi', tipo:'figura', nome:'Xavi', papel:'', cidade:'Rota 16',
  requer:d=>opiniaoDe('Xavi') >= 4 && d.capitulo > 15,
  oferece:['prova','favor'],
  prova:{
    rotulo:'Contar quantas espécies você registrou',
    esperaCap:2,
    texto:d=>[
      fala('Xavi', 'Espera. Deixa eu pegar a caneta.'),
      fala('Xavi', `${Estado.contagemDex().catalogados}. Anotado, com data e hora.`),
      fala('Xavi', 'A Ylva vai perguntar se foi você mesm{o|a} que viu tudo isso ou se você leu em algum lugar. Ela pergunta isso de todo mundo.', 'riso')
    ],
    rep:{eixo:'bom', delta:1, motivo:'Mandou a sua contagem pra quem conta a fauna das rotas'}
  },
  favor:{
    rotulo:'Perguntar o que passou pela cabine',
    limite:3, esperaCap:3,
    texto:[
      fala('Xavi', 'Passou pouca gente e muito Pokémon. Semana boa.'),
      fala('Xavi', 'A Ylva achou repelente jogado no trecho 17, lacrado ainda. A gente não usa. Vai pra você.')
    ],
    efeito:d=>{ Estado.darItem('Repelente', 2);
      return [{tipo:'item', texto:'Ele manda 2× Repelente pelo Centro, com a data em que foram achados escrita na tampa.'}]; }
  }
},
{
  id:'greta', tipo:'treinador', nome:'Sra. Greta Nettle', papel:'', cidade:'Planalto Indigo',
  requer:d=>opiniaoDe('Sra. Greta Nettle') >= 3 && d.capitulo > 26,
  oferece:['revanche','favor'],
  timeRevanche:d=>{
    const nv = Math.max(50, Math.round(Estado.timeVivo().reduce((a,p)=>a+p.nivel,0) / Math.max(1, Estado.timeVivo().length)) + 2);
    return [62, 91, 94, 112, 130, 143].map((dex, i) => criarPokemon(dex, nv + (i === 5 ? 2 : 0), {}));
  },
  favor:{
    rotulo:'Pedir mais uma regra',
    limite:3, esperaCap:2,
    texto:[
      fala('Sra. Greta Nettle', 'Mais uma? Tá. Quem só ganha não sabe o que fazer quando perde. Perde de propósito, de vez em quando, no treino.'),
      fala('Sra. Greta Nettle', 'Quarenta e um anos ensinando isso e eu nunca segui. Segue você.', 'baixo')
    ],
    efeito:d=>{ Estado.dados.time.forEach(p=>{ if(!p.morto) p.moral = Math.min(100,(p.moral||50)+4); });
      return [{tipo:'info', texto:'O time inteiro subiu 4 de moral. Ela tem esse efeito até pelo telefone.'}]; }
  }
},

/* ── rivais ──────────────────────────────────────────────── */
{
  id:'teo', tipo:'treinador', nome:'Ezra', papel:'o seu rival', cidade:'estrada',
  requer:d=>!!d.npcs['Ezra'],
  rival:'teo', oferece:['revanche','prova','missao'],
  missao:{
    rotulo:'Perguntar por que ele anda estranho',
    rotuloEntrega:'Ligar e contar quantas espécies você registrou',
    dica:'Ele quer ver o seu número passar o dele.',
    pedido:[
      fala('Ezra', 'Eu não ando estranho.'),
      fala('Ezra', '…tá. Eu tô em quarenta e uma espécies na Pokédex e eu travei.'),
      fala('Ezra', 'Eu passo o dia catalogando e não sobe. E aí eu olho e todo mundo que eu conheço tá em vinte e poucas e acha que eu sou doente.', 'baixo'),
      fala('Ezra', 'Chega em sessenta. Chega em sessenta pra eu ter com quem perder, porque perder pra ninguém não vale nada.')
    ],
    objetivo:d=>Estado.contagemDex().catalogados >= 60,
    entregue:[
      d=>fala(d.jogador.nome, `Sessenta e ${Math.max(0, Estado.contagemDex().catalogados - 60)}.`),
      fala('Ezra', 'Mentira.'),
      d=>fala(d.jogador.nome, 'Confere no seu aparelho. A Liga sincroniza.'),
      'Você ouve ele digitando. Você ouve ele parando de digitar.',
      fala('Ezra', 'Você tá em sessenta e eu tô em quarenta e três.'),
      fala('Ezra', 'Isso é a melhor coisa que aconteceu comigo esse mês e eu odeio isso.', 'riso'),
      fala('Ezra', 'Agora eu tenho de quem correr atrás. Você não faz ideia do que isso vale.')
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
      const meu = d.npcs['Ezra'] || {};
      return (meu.opiniao||0) >= 2
        ? [fala('Ezra', `${n} já? Cara.`, null, 'Ele não esconde que ficou feliz, e detesta não ter escondido.'),
           fala('Ezra', 'Eu tô em quatro. Eu vou te alcançar. Tô avisando com antecedência.')]
        : [fala('Ezra', `${n}. Legal.`, 'frio'),
           fala('Ezra', 'Eu não liguei pra você. Você que ligou pra mim.')];
    },
    rep:{eixo:'bom', delta:1, motivo:'Manteve o rival por perto em vez de sumir'}
  }
}

];

/* rivais extras entram na agenda sozinhos, pelo arquivo deles */
/* A Nadia não é rival de arco: o time dela é montado na hora */
function timeDaNadia(){
  const n = Math.max(40, 34 + Estado.dados.insignias.length * 3);
  return [59, 26, 94, 103].map((dex, i) => criarPokemon(dex, n + i, {}));
}

function contatosDeRivaisExtras(){
  if (typeof RIVAIS_EXTRA === 'undefined') return [];
  return RIVAIS_EXTRA.map(R => ({
    id:'rival_' + R.id, tipo:'treinador', nome:R.nome, papel:'rival · desde ' + (R.desde || 'a estrada'),
    cidade:R.cidade || 'estrada',
    requer:d=>(d.rivaisExtra||[]).includes(R.id),
    rivalExtra:R.id, oferece:['revanche']
  }));
}

/* A opinião de alguém da história, pelo rótulo da cena ou pelo nome que
   o jogador perguntou depois: lembrarNPC junta os dois no nome real. */
function opiniaoDe(rotulo){
  const d = Estado.dados;
  let n = d.npcs[rotulo];
  if (!n && typeof Nomes !== 'undefined' && Nomes.sabe && Nomes.sabe(rotulo)) n = d.npcs[Nomes.nomeDe(rotulo)];
  return n ? (n.opiniao || 0) : -99;
}

/* Quem treina na estrada e perdeu pra você passa o número (estrada-dados.js).
   A fala entre aspas vira balão com o nome dele. */
function contatosDaEstrada(){
  if (typeof TREINADORES_ESTRADA === 'undefined') return [];
  const falas = (t, lista) => d => (typeof lista === 'function' ? lista(d) : lista).map(x =>
    (typeof x === 'string' && /^"[^"]*"$/.test(x)) ? fala(t.nome, x.slice(1, -1)) : x);
  return TREINADORES_ESTRADA.filter(t => t.numero).map(t => {
    const c = {id:'rt_' + t.id, tipo:'treinador', nome:t.nome, papel:'',
      cidade:(LOCAIS[t.local] || {}).nome || 'estrada', estrada:t.id,
      requer:d=>Estrada.deuNumero(t.id), oferece:t.numero.oferece || ['revanche']};
    ['favor','prova'].forEach(k => {
      const def = t.numero[k];
      if (def) c[k] = Object.assign({}, def, {texto: falas(t, def.texto)});
    });
    if (c.prova && !c.prova.rep) c.prova.rep = {eixo:'bom', delta:1, motivo:`Manteve contato com ${t.nome}, da estrada`};
    return c;
  });
}

function todosContatos(){
  return CONTATOS.concat(contatosDeRivaisExtras(), contatosDaEstrada(),
    typeof contatosVeteranos === 'function' ? contatosVeteranos() : [],
    typeof contatosDasTrocas === 'function' ? contatosDasTrocas() : []);
}
function contatoPorId(id){ return todosContatos().find(c => c.id === id) || null; }
function textoContato(c, campo){
  /* A agenda não descreve ninguém: quem é quem está na conversa em que
     você conheceu a pessoa. Só a casa diz o parentesco, porque é assim
     que se grava o número de casa. */
  if (campo === 'papel' && c.id !== 'casa') return '';
  const v = c[campo];
  const t = typeof v === 'function' ? v(Estado.dados) : v;
  /* Contato gravado pela função ("Enfermeira do Centro") passa a aparecer
     pelo nome depois que o jogador perguntou. O PokéNav é a agenda dele:
     não faz sentido a agenda continuar chamando de "a enfermeira" alguém
     de quem ele já sabe o nome. */
  if (campo === 'nome' && typeof Nomes !== 'undefined' && t){
    /* o contato pode ser gravado por uma função ("Enfermeira do Centro")
       e falar nas cenas por outro rótulo ("a enfermeira"): falaComo liga
       os dois, senão a agenda nunca fica sabendo do nome. */
    if (c.falaComo && Nomes.sabe(c.falaComo)) return Nomes.nomeDe(c.falaComo);
    return Nomes.comoChamar(t);
  }
  return t;
}

/* ============================================================
   CHAMADAS RECEBIDAS — o telefone toca sozinho
   Até aqui o PokéNav só ligava pra fora. Quem tem o seu número
   também liga, e liga na hora errada, que é quando telefone
   toca. Cada chamada tem condição, e uma vez atendida não volta.
   ============================================================ */
const CHAMADAS = [
{
  id:'cha_casa_primeira',
  de:'casa',
  cond:d=>Estado.temNumero('casa') && d.capitulo >= 3 && !d.flags.voltou_pra_casa,
  peso:3,
  falas:d=>[
    d=>fala(nomeCasa(), 'Oi! Oi, é você? É você mesm{o|a}?', 'grita'),
    d=>fala(nomeCasa(), 'Eu apertei o botão errado umas quatro vezes. A Perla que me ensinou.'),
    d=>fala(nomeCasa(), 'Não é nada. Não aconteceu nada aqui, tá tudo bem, eu só queria ouvir.', 'baixo'),
    d=>fala(nomeCasa(), 'Tá comendo?')
  ],
  escolhas:[
    {texto:'"Tô comendo."',
     ef:{moral:4, rep:{eixo:'bom',delta:1,motivo:'Atendeu e respondeu a pergunta da comida'}},
     resultado:[d=>fala(nomeCasa(), 'Mentiroso.', 'riso'),
                d=>fala(nomeCasa(), 'Tá bom. Vai lá. Eu desligo primeiro, que eu sempre desligo primeiro.')]},
    {texto:'Contar onde você está e o que aconteceu até agora.',
     ef:{moral:6, rep:{eixo:'bom',delta:2,motivo:'Parou o que estava fazendo pra contar a viagem por telefone'}},
     resultado:['Você fala por onze minutos e ela não interrompe uma vez.',
                d=>fala(nomeCasa(), 'Onze minutos. Eu cronometrei no relógio do fogão.', 'baixo'),
                d=>fala(nomeCasa(), 'Onze minutos é mais do que a gente falava na mesma casa.')]},
    {texto:'"Agora não dá." E desligar.',
     ef:{moral:-4, rep:{eixo:'ruim',delta:1,motivo:'Desligou na cara de casa'}},
     resultado:['Você desliga.', d=>fala(nomeCasa(), 'Tá bo—', 'baixo', 'A ligação cai no meio.'),
                'Ela não liga de novo hoje. Nem amanhã.']}
  ]
},
{
  id:'cha_ushio_cobra',
  de:'ushio',
  cond:d=>Estado.temNumero('ushio') && !!d.flags.divida_pendente && d.capitulo >= 5,
  peso:2,
  falas:d=>[
    fala(vz().nome, 'Não é cobrança.'),
    fala(vz().nome, 'Eu sei que parece cobrança, ligar do nada, mas não é.'),
    fala(vz().nome, 'É que eu tô com a caixa de metal aqui na mão e eu não sei mais o que eu tô guardando ela pra quê.', 'baixo')
  ],
  escolhas:[
    {texto:'"Eu volto. Eu prometi e eu volto."',
     ef:{moral:3, rep:{eixo:'bom',delta:1,motivo:'Repetiu a promessa no telefone quando podia ter mudado de assunto'}},
     resultado:[d=>fala(vz().nome, 'Eu sei.'), d=>fala(vz().nome, 'Eu ligo de novo daqui uns meses só pra te irritar.', 'riso')]},
    {texto:d=>`Perguntar como vai o joelho ${vz().dele}.`,
     ef:{moral:4, rep:{eixo:'bom',delta:2,motivo:'Perguntou do joelho em vez de falar da dívida'},
         npc:d=>({nome:vz().nome, opiniao:3, memoria:`Você perguntou do joelho ${vz().dele} numa ligação em que ${vz().ele} ia falar de dívida.`})},
     resultado:[
       'Silêncio de uns quatro segundos.',
       d=>fala(vz().nome, 'Como é que você sabe do joelho?'),
       d=>fala(vz().nome, 'Eu não falei do joelho pra ninguém.', 'baixo'),
       d=>fala(vz().nome, `Tá ruim. Tá ruim mesmo. ${vz().f ? 'Obrigada' : 'Obrigado'} por perguntar.`)
     ]},
    {texto:d=>`"Vende a caixa, ${vz().trat}. Eu não mereço."`,
     ef:{rep:{eixo:'ruim',delta:1,motivo:'Mandou vender o que guardavam pra você'}},
     resultado:[d=>fala(vz().nome, 'Não é sobre merecer.', 'frio'), d=>fala(vz().nome, 'Boa viagem, {menino|menina}.')]}
  ]
},
{
  id:'cha_teo_perdeu',
  de:'teo',
  cond:d=>Estado.temNumero('teo') && d.insignias.filter(i=>i!=='Título de Campeão').length >= 3,
  peso:2,
  falas:d=>[
    fala('Ezra', 'Não é nada. Eu só liguei.'),
    'Silêncio de três segundos, que no Ezra é muita coisa.',
    fala('Ezra', 'Eu perdi hoje. Pro ginásio. Terceira vez no mesmo.', 'baixo'),
    fala('Ezra', 'Eu não sei por que eu tô te contando isso justo pra você.')
  ],
  escolhas:[
    {texto:'Perguntar qual foi o time dele e onde travou.',
     ef:{moral:2, rep:{eixo:'bom',delta:2,motivo:'Tratou a derrota do rival como problema e não como vitória sua'},
         npc:{nome:'Ezra', opiniao:4, memoria:'Ligou pra você depois de perder três vezes e você quis saber onde ele travou.'}},
     resultado:[
       'Vocês passam vinte minutos no telefone falando de ordem de troca e de um golpe que ele insiste em manter.',
       fala('Ezra', 'Você acha que eu devia tirar o Leer?'),
       d=>fala(d.jogador.nome, 'Eu acho que você devia tirar o Leer desde Pewter.'),
       fala('Ezra', 'Você é um péssimo amigo e você tem razão.', 'riso')
     ]},
    {texto:'"Três vezes é teimosia. Muda o time."',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Foi direto com o rival em vez de consolar'},
         npc:{nome:'Ezra', opiniao:1, memoria:'Você chamou a teimosia dele de teimosia por telefone.'}},
     resultado:[fala('Ezra', 'Valeu. Muito obrigado. Que apoio.', 'frio'),
                'Ele desliga.','Duas semanas depois ele ganha, com o time trocado, e não te liga pra contar. Você fica sabendo por outra pessoa.']},
    {texto:'Não falar nada e deixar ele falar.',
     ef:{moral:3, rep:{eixo:'bom',delta:2,motivo:'Ficou calado no telefone enquanto o outro precisava falar'}},
     resultado:['Ele fala por catorze minutos.',
                'Você diz "é" quatro vezes e "hum" duas, e não diz mais nada.',
                fala('Ezra', 'Valeu.', 'baixo'), fala('Ezra', 'Sério.')]}
  ]
},
{
  id:'cha_enfermeira_estrada',
  de:'enfermeira',
  cond:d=>Estado.temNumero('enfermeira') && d.cemiterio.length > 0,
  peso:3,
  falas:d=>[
    fala('a enfermeira', 'Eu soube.'),
    fala('a enfermeira', 'A gente fica sabendo. Centro Pokémon fala com Centro Pokémon.', 'baixo'),
    d=>{
      const m = d.cemiterio[d.cemiterio.length-1];
      return fala('a enfermeira', `Eu não vou falar que eu sinto muito, porque todo mundo já falou. Eu vou perguntar o nome dele.`);
    }
  ],
  escolhas:[
    {texto:'Dizer o nome.',
     ef:{moral:4, rep:{eixo:'bom',delta:2,motivo:'Disse em voz alta o nome de quem morreu'}},
     resultado:[
       d=>{ const m = d.cemiterio[d.cemiterio.length-1]; return fala(d.jogador.nome, nomeExib(m) + '.'); },
       'Você ouve ela escrevendo.',
       fala('a enfermeira', 'Anotado. Eu tenho um caderno.'),
       fala('a enfermeira', 'Não é o caderno de Lavender, é o meu. Eu tenho quarenta e um nomes nele desde 1989 e agora tenho quarenta e dois.', 'baixo')
     ]},
    {texto:'"Eu não quero falar disso."',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Foi honesto sobre não querer falar'}},
     resultado:[fala('a enfermeira', 'Então não fala.'),
                fala('a enfermeira', 'Eu ligo de novo em duas semanas e a gente fala de outra coisa. Pode ser?')]}
  ]
},
{
  id:'cha_curador_lembra',
  de:'curador',
  /* vale tanto pra lembrar quanto pra cutucar quem já podia ter ido */
  cond:d=>Estado.temNumero('curador')
          && ['fazendo','entregar'].includes(Estado.faseDaMissao('curador'))
          && d.insignias.filter(i=>i!=='Título de Campeão').length >= 2,
  peso:2,
  falas:d=>[
    fala('Fabre', 'Não desliga, é rápido.'),
    fala('Fabre', 'Eu reli o caderno setenta e um ontem. Eu releio todos, por ordem, um por mês.'),
    fala('Fabre', 'A sua resposta continua lá e continua a mesma, e isso é a coisa mais óbvia do mundo e mesmo assim me surpreende toda vez.', 'baixo'),
    fala('Fabre', 'Quatro insígnias. Lavender. Eu tô sempre aqui.')
  ],
  escolhas:[
    {texto:'Perguntar se alguém já mudou de resposta.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Perguntou ao curador se alguém já tinha mudado de resposta'},
         flag:'sabe_dos_que_mudaram'},
     resultado:[
       fala('Fabre', 'Onze pessoas voltaram pra mudar.'),
       fala('Fabre', 'Em dezenove anos, onze. Todas as onze mudaram de "guardar" pra "passar adiante".'),
       fala('Fabre', 'Nenhuma foi no sentido contrário. Nenhuma, nunca.', 'frio'),
       fala('Fabre', 'Eu não sei o que fazer com essa informação e eu penso nela todo dia.')
     ]},
    {texto:'"Eu vou aparecer."',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Confirmou ao curador que ia aparecer'}},
     resultado:[fala('Fabre', 'Todo mundo fala isso.'), fala('Fabre', 'Umas trezentas aparecem. De mil e setecentas.', 'baixo')]}
  ]
},
{
  id:'cha_nadia_segunda',
  de:'nadia',
  cond:d=>Estado.temNumero('nadia'),
  peso:2,
  falas:d=>[
    fala('Nadia', 'É a Nadia! Da arena! Eu consegui ligar!', 'grita'),
    fala('Nadia', 'Minha filha configurou tudo de novo. Ela ficou com pena de mim.', 'riso'),
    fala('Nadia', 'Eu queria te contar uma coisa e agora eu esqueci o que era.'),
    'Pausa.',
    fala('Nadia', 'Ah! Eu voltei pro ginásio de Pewter. Terceira vez.')
  ],
  escolhas:[
    {texto:'"E aí?"',
     ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Quis saber como tinha sido'}},
     resultado:[
       fala('Nadia', 'Eu ganhei.', 'baixo'),
       fala('Nadia', 'Eu chorei na frente do Brock. Eu tenho quarenta e um anos e eu chorei na frente do Brock.'),
       fala('Nadia', 'Ele fingiu que não viu. Eu vou ser grata a esse homem pelo resto da vida.')
     ]},
    {texto:'Contar quantas você tem, antes de ela perguntar.',
     ef:{rep:{eixo:'ruim',delta:1,motivo:'Falou das próprias insígnias na ligação de outra pessoa'}},
     resultado:[fala('Nadia', 'Ah. Que bom!'),
                'Ela fala "que bom" de um jeito que é verdade e que também é o fim da conversa.',
                'Ela ia contar que ganhou. Você não perguntou.']}
  ]
}
];

/* ── chamadas da estrada e da gente nova da agenda ─────────── */
CHAMADAS.push(
{
  id:'cha_joey_rattata',
  de:'rt_joey',
  cond:d=>Estado.temNumero('rt_joey') && numInsignias() >= 2,
  peso:3,
  falas:d=>[
    fala('Joey', 'Alô? É o Joey! Da Rota 1!', 'grita'),
    fala('Joey', 'Eu tava pensando aqui. O meu Rattata. Ele tá entre os melhores Rattata que existem.'),
    fala('Joey', 'Só isso. Eu queria que você soubesse.')
  ],
  escolhas:[
    {texto:'"Eu sei, Joey. Eu lembro."',
     ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Deixou o Joey falar do Rattata dele'}},
     resultado:[fala('Joey', 'Sabia que você ia entender!', 'grita'), fala('Joey', 'Vem pra Rota 1 que ele te mostra.')]},
    {texto:'"Quantos Rattata você já viu na vida, Joey?"',
     resultado:[fala('Joey', 'Uns… quatro?'), 'Silêncio.', fala('Joey', 'Entre os quatro, ele é o melhor. Isso é fato.', 'baixo')]}
  ]
},
{
  id:'cha_kelsey_rio',
  de:'rt_kelsey',
  cond:d=>Estado.temNumero('rt_kelsey') && d.capitulo >= 9,
  peso:2,
  falas:d=>[
    fala('Kelsey', 'O rio subiu! Eu falei que eu sabia antes. Eu sabia.'),
    fala('Kelsey', 'A ponte norte ficou fechada meio dia. Os da fila da ponte ficaram sem ter com quem lutar e vieram lutar comigo.', 'riso')
  ],
  escolhas:[
    {texto:'"E você ganhou de todos?"',
     resultado:[fala('Kelsey', 'De quase todos. O Timmy tá ficando bom. Não conta pra ele.')]},
    {texto:'Perguntar se alguém se machucou com a cheia.',
     ef:{rep:{eixo:'bom',delta:1,motivo:'Perguntou da cheia antes de perguntar da luta'}},
     resultado:[fala('Kelsey', 'Ninguém. Só uma cabana de pescador que já tava torta.'), fala('Kelsey', 'Obrigada por perguntar. Quase ninguém pergunta.', 'baixo')]}
  ]
},
{
  id:'cha_cosmo_manha',
  de:'cosmo',
  cond:d=>Estado.temNumero('cosmo') && !!d.flags.cosmo_soube_do_goldeen,
  peso:2,
  falas:d=>[
    fala('Sr. Cosmo', 'Peguei.'),
    'Você espera o resto da frase. Não vem.',
    fala('Sr. Cosmo', 'Um Goldeen. Pequeno. Soltei na hora.'),
    fala('Sr. Cosmo', 'Quatro anos.', 'baixo')
  ],
  escolhas:[
    {texto:'"Quatro anos e soltou?"',
     resultado:[fala('Sr. Cosmo', 'Eu não queria pegar. Eu queria saber se ainda tinha.'), fala('Sr. Cosmo', 'Tem.')]},
    {texto:'Ficar em silêncio com ele, na linha.',
     ef:{moral:3, rep:{eixo:'bom',delta:1,motivo:'Ficou em silêncio com um pescador velho pelo telefone'}},
     resultado:['Vocês ficam um minuto sem falar nada. Do lado de lá tem rio correndo.', fala('Sr. Cosmo', 'Pronto. Era isso.')]}
  ]
},
{
  id:'cha_rolando_subida',
  de:'rt_rolando',
  cond:d=>Estado.temNumero('rt_rolando') && numInsignias() >= 8,
  peso:2,
  falas:d=>[
    fala('Rolando', 'Posto de controle da Rota 23, guarda informal falando.', 'riso'),
    fala('Rolando', 'Tá subindo quando? Eu quero estar no posto na hora. Alguém tem que ver você passar.')
  ],
  escolhas:[
    {texto:'"Logo. Fica no posto."',
     ef:{moral:3},
     resultado:[fala('Rolando', 'Fico. Sempre fico.')]},
    {texto:'"Ainda não sei se eu subo."',
     resultado:[fala('Rolando', 'Justo. Quem sobe sem saber volta no meio do Caminho.'), fala('Rolando', 'Quando souber, eu tô aqui.')]}
  ]
},
{
  id:'cha_pia_terca',
  de:'pia',
  cond:d=>Estado.temNumero('pia') && d.capitulo >= 14,
  peso:2,
  falas:d=>[
    fala('Dra. Pia', 'Terça-feira. Eu atendi, preenchi, e escrevi no campo de observação.'),
    fala('Dra. Pia', 'Ninguém me ligou pra reclamar. Eu esperava que ligassem.', 'baixo'),
    fala('Dra. Pia', 'Eu queria que alguém soubesse que eu escrevi.')
  ],
  escolhas:[
    {texto:'"Eu sei. Obrigad{o|a}."',
     ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Foi quem soube, quando alguém precisava que alguém soubesse'}},
     resultado:[fala('Dra. Pia', 'Não agradece. Eu que agradeço.'), fala('Dra. Pia', 'Semana que vem eu escrevo de novo.')]},
    {texto:'"E se ligarem?"',
     resultado:[fala('Dra. Pia', 'Aí eu atendo e escrevo isso também.', 'frio')]}
  ]
}
);

const Chamadas = {
  atendidas(){
    const nav = Estado.nav();
    if (!nav.chamadas) nav.chamadas = {};
    return nav.chamadas;
  },
  jaAtendeu(id){ return !!this.atendidas()[id]; },
  porId(id){ return CHAMADAS.find(c => c.id === id) || null; },

  disponiveis(){
    if (!Estado.temPokenav()) return [];
    const d = Estado.dados;
    return CHAMADAS.filter(c => {
      if (this.jaAtendeu(c.id)) return false;
      try { return !c.cond || c.cond(d); } catch(e){ return false; }
    });
  },

  /* toca ou não toca — chamado nas transições, não em toda tela */
  sortear(){
    const pool = this.disponiveis();
    if (!pool.length) return null;
    const sacola = [];
    pool.forEach(c => { for (let i = 0; i < (c.peso || 1); i++) sacola.push(c); });
    return Dados.escolher(sacola);
  },

  atender(id, indice){
    const c = this.porId(id);
    if (!c) return null;
    const esc = (c.escolhas || [])[indice];
    if (!esc) return null;
    this.atendidas()[id] = {cap:Estado.dados.capitulo, escolha:indice};
    let avisos = [];
    if (esc.ef) avisos = Historia.aplicar(esc.ef) || [];
    Estado.salvar('auto');
    return {chamada:c, esc, avisos};
  },
  /* não atender também é uma escolha, e custa */
  recusar(id){
    const c = this.porId(id);
    if (!c) return null;
    this.atendidas()[id] = {cap:Estado.dados.capitulo, escolha:null, recusada:true};
    const contato = contatoPorId(c.de);
    Estado.registrar(`Não atendeu ${contato ? textoContato(contato,'nome') : 'uma chamada'}.`);
    Estado.salvar('auto');
    return {chamada:c, recusou:true};
  }
};
