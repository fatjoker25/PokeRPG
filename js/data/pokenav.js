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
  oferece:['favor','prova'],
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
  oferece:['favor'],
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
  oferece:['favor'],
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
  ginasio:'celadon', oferece:['revanche','favor'],
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
  ginasio:'fuchsia', oferece:['revanche','favor'],
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

/* ── rivais ──────────────────────────────────────────────── */
{
  id:'teo', tipo:'treinador', nome:'Téo', papel:'o seu rival', cidade:'estrada',
  desde:'Trocou número com você no meio de uma discussão.',
  requer:d=>!!d.npcs['Téo'],
  rival:'teo', oferece:['revanche','prova'],
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
