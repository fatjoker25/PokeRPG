/* ============================================================
   AGENDA — o que acontece num dia e numa hora marcados
   Quem marca é a cidade: o papel vai pro mural do Centro, com o
   dia e a hora. O jogador que tem Relógio sabe quando ir; o que
   não tem só acerta passando por acaso na hora certa.
   Cada coisa marcada acontece uma vez por data: voltar no mesmo
   dia não repete.
   ============================================================ */

/* A volta da perua do laboratório: dia do mês em cada cidade.
   É o que o Célio conta no capítulo 1, e é o que vale no mural,
   no PokéNav e na praça. */
const DIA_DA_PERUA = {pallet:1, viridian:2, pewter:4, cerulean:6, vermilion:8,
                      lavender:10, celadon:12, saffron:14, fuchsia:15, cinnabar:16};

function _hora(){ const r = Estado.dados.relogio; sincronizarHora(r); return r.hora; }
function _entre(de, ate){ const h = _hora(); return h >= de && h <= ate; }
function _semana(s){ return Calendario.diaDaSemana() === s; }

/* onde a perua está hoje, pelo dia do mês */
function ondeEstaAPerua(){
  const hoje = Calendario.diaDoMes();
  if (hoje > 22) return {onde:'pallet', parado:true};
  if (hoje > 16) return {onde:null, voltando:true};
  let onde = 'pallet';
  Object.entries(DIA_DA_PERUA).forEach(([c, n]) => { if (n <= hoje) onde = c; });
  const prox = Object.entries(DIA_DA_PERUA).find(([c, n]) => n > hoje);
  return {onde, hoje: DIA_DA_PERUA[onde] === hoje, proximo: prox ? {onde:prox[0], dia:prox[1]} : null};
}

const AGENDA = [
  /* ── a perua do laboratório: uma por cidade ── */
  ...Object.entries(DIA_DA_PERUA).map(([cidade, n]) => ({
    id:'perua_' + cidade, local:cidade, mural:cidade,
    quando:() => Calendario.diaDoMes() === n && _entre(6, 17),
    anuncio:{t:`A perua do Laboratório de Pallet passa aqui todo dia ${n}, das 8h às 17h, na praça. Inscrição feita: traga documento e quem assinou.`,
             nota:'impresso, com o carimbo verde do laboratório e o dia escrito à mão por cima de outro dia riscado'},
    titulo:'A perua do laboratório, na praça',
    fazer(){
      const ev = (typeof Eventos !== 'undefined') ? Eventos.porId('ger_a_perua') : null;
      if (!ev) return Exploracao.tela();
      return UI.telaEvento(ev);
    }
  })),

  /* ── segunda à noite, no Monte da Lua ── */
  {id:'clefairy', local:'monte_lua', mural:'pewter',
   quando:() => _semana('segunda') && _entre(18, 23),
   anuncio:{t:'Clube de Astronomia de Pewter: observação no Monte da Lua toda segunda, das 18h à meia-noite. Lanterna coberta com papel vermelho. Silêncio.',
            nota:'impresso em casa, com uma lua desenhada à mão no canto'},
   titulo:'Seguir as lanternas vermelhas pro fundo da caverna',
   fazer(){
     const d = Estado.dados;
     const pedra = !d.flags.ag_pedra_da_roda;
     if (d.flags.tem_pokedex) Estado.pdex().vistos[35] = true;
     return UI.telaConversa({
       num:'Monte da Lua', titulo:'Segunda à noite', loc:'uma galeria que você não tinha achado',
       falas:[
         'Três pessoas do clube de astronomia, de lanterna coberta com papel vermelho, sentadas numa pedra lisa no fundo de uma galeria que você nunca tinha achado sozinh{o|a}.',
         'Ninguém fala. Uma delas aponta pra cima, onde a rocha abre um buraco redondo e a lua entra inteira.',
         'Debaixo do buraco, no círculo de luz, uns dez Clefairy giram devagar, de mãos dadas, em volta de uma pedra que brilha do mesmo jeito que a lua.',
         'Não é briga e não é caça. Eles só giram. O seu time inteiro fica parado olhando.',
         ...(pedra ? [] : ['A pedra do meio não está mais lá. Eles giram em volta do lugar onde ela estava, do mesmo jeito.'])
       ],
       botoes:[
         {texto:'Chegar mais perto', acao:"Agenda.depois('clefairy','perto')"},
         {texto:'Ficar olhando até a roda desfazer', acao:"Agenda.depois('clefairy','olhar')"}
       ]
     });
   },
   depois(como){
     const d = Estado.dados, L = Mundo.atual();
     Mundo.passar(1);
     if (como === 'perto'){
       const p = criarPokemon(35, L.nivel, {selvagem:true});
       return Exploracao.encontro(p, ['A roda desfaz no mesmo instante. Os outros somem no escuro, e um deles fica, olhando pra você com a cabeça torta.'], {fixo:true});
     }
     const av = [{tipo:'info', texto:'A roda desfaz sozinha lá pela meia-noite. Um a um, os Clefairy entram nas frestas da parede, e as lanternas vermelhas vão embora atrás.'}];
     Estado.dados.time.forEach(p => { if (!p.morto) p.moral = Math.min(100, p.moral + 3); });
     av.push({tipo:'cura', texto:'O time sai da caverna mais quieto do que entrou, e mais perto de você.'});
     if (!d.flags.ag_pedra_da_roda){
       d.flags.ag_pedra_da_roda = true;
       Estado.darItem('Moon Stone', 1);
       av.push({tipo:'item', texto:'A pedra do meio ficou pra trás. Ninguém do clube pega. Você pega.'});
     }
     Estado.registrar('Viu a roda dos Clefairy no fundo do Monte da Lua, numa segunda à noite.');
     Estado.salvar('auto');
     Exploracao.tela(av);
   }},

  /* ── terça, o museu de Pewter abre de graça ── */
  {id:'museu', local:'pewter', mural:'pewter',
   quando:() => _semana('terça') && _entre(9, 17),
   anuncio:{t:'Museu de Pewter: entrada franca toda terça, das 9h às 17h. Não encoste nos ossos.', nota:'impresso, com o carimbo do museu'},
   titulo:'O museu, de portas abertas',
   fazer(){
     const d = Estado.dados;
     d.flags.sabe_da_lona_do_museu = true;
     Mundo.passar(1);
     Estado.registrar('Entrou de graça no museu de Pewter, numa terça.');
     Estado.salvar('auto');
     return UI.telaConversa({
       num:'Pewter', titulo:'Terça de portas abertas', loc:'o museu',
       falas:[
         'A sala grande tem um esqueleto de Aerodactyl pendurado em cabo de aço, de asa aberta, e uma lona azul esticada no teto logo acima dele.',
         'A lona tem uma data pintada a pincel: 1994. Embaixo dela, num balde no chão, pinga uma gota a cada tanto.',
         'A sala do fundo continua fechada, com o aviso FÓSSEIS — REFORMA amarelando na porta. Pela fresta dá pra ver duas conchas de pedra do tamanho de uma roda, uma enrolada e uma achatada.',
         'Uma mulher de jaleco passa pano no chão entre as vitrines, sozinha, e para pra esvaziar o balde sem que ninguém peça.',
         'Tem uma criança de nariz colado no vidro do Aerodactyl. Ela não fala nada a visita inteira.'
       ],
       botoes:[{texto:'Sair', acao:'Exploracao.tela()'}]
     });
   }},

  /* ── sexta à noite, na pedra grande da Rota 19 ── */
  {id:'lapras', local:'rota19', mural:'fuchsia',
   quando:() => _semana('sexta') && _entre(18, 23),
   anuncio:{t:'Pescadores da Rota 19: sexta, das 18h em diante, NADA de rede perto da pedra grande.', nota:'escrito a pincel num pedaço de lona, e embaixo, a caneta, outra letra: "deixa ela"'},
   titulo:'Ir até a pedra grande',
   fazer(){
     const d = Estado.dados;
     if (d.flags.tem_pokedex) Estado.pdex().vistos[131] = true;
     return UI.telaConversa({
       num:'Rota 19', titulo:'Sexta à noite', loc:'a pedra grande',
       falas:[
         'A pedra grande fica a uns cem metros da praia, e de noite é só uma mancha mais escura no mar.',
         'Você senta na areia. Por um tempo é só onda.',
         'Aí vem o som: comprido, baixo, subindo no fim, que nem uma pergunta. Ele vem da pedra e volta da pedra.',
         'Um pescoço comprido sai da água ao lado dela, e uma carapaça que pega a luz da lua, e o som de novo, agora perto.',
         'O seu time inteiro está de pé na beira da água, quieto.'
       ],
       botoes:[
         {texto:'Entrar na água e chegar perto', acao:"Agenda.depois('lapras','perto')"},
         {texto:'Ficar na areia ouvindo', acao:"Agenda.depois('lapras','ouvir')"}
       ]
     });
   },
   depois(como){
     const L = Mundo.atual();
     Mundo.passar(1);
     if (como === 'perto'){
       const p = criarPokemon(131, Math.max(L.nivel - 2, 25), {selvagem:true});
       return Exploracao.encontro(p, ['A água bate no seu peito quando ela vira a cabeça pra você. O canto para.'], {fixo:true});
     }
     Estado.dados.time.forEach(p => { if (!p.morto) p.moral = Math.min(100, p.moral + 3); });
     Estado.registrar('Ouviu o canto na pedra grande da Rota 19, numa sexta à noite.');
     Estado.salvar('auto');
     Exploracao.tela([
       {tipo:'info', texto:'Ela canta até a lua passar do meio do céu. Depois afunda devagar, sem fazer onda, e o mar fica do tamanho de antes.'},
       {tipo:'cura', texto:'Ninguém do time quer ir embora primeiro.'}
     ]);
   }},

  /* ── domingo de dia, o bazar do terraço em Celadon ── */
  {id:'bazar', local:'celadon', mural:'celadon',
   quando:() => _semana('domingo') && _entre(8, 17),
   anuncio:{t:'Bazar de domingo no terraço da Grande Loja, das 8h às 17h. Coisa de fora, coisa velha e coisa que não volta.', nota:'impresso em papel amarelo, com o desenho de uma barraca'},
   titulo:'O bazar do terraço',
   fazer(){ return Cidade.loja(0, 'bazar_celadon'); }},

  /* ── domingo à noite, a vigília na torre ── */
  {id:'vigilia', local:'lavender', mural:'lavender',
   quando:() => _semana('domingo') && _entre(18, 23),
   anuncio:{t:'Vigília pelos que se foram, todo domingo, das 18h à meia-noite, na escada da torre. Traga uma vela.', nota:'papel roxo, sem assinatura'},
   titulo:'A vigília, na escada da torre',
   fazer(){
     const d = Estado.dados;
     Mundo.passar(1);
     const mortos = (d.cemiterio || []).map(p => nomeExib(p));
     const vela = mortos.length
       ? `Você acende uma vela pra ${mortos.length === 1 ? mortos[0] : mortos.slice(0, -1).join(', ') + ' e ' + mortos[mortos.length - 1]}, e põe no degrau, junto das outras.`
       : 'Você acende uma vela pra ninguém em especial e põe no degrau, junto das outras. Ninguém pergunta pra quem é.';
     d.time.forEach(p => { if (!p.morto) p.moral = Math.min(100, p.moral + 2); });
     if (d.flags.tem_pokedex) Estado.pdex().vistos[92] = true;
     Estado.registrar(mortos.length ? `Acendeu uma vela na torre de Lavender por ${mortos.join(', ')}.` : 'Foi à vigília de domingo na torre de Lavender.');
     Estado.salvar('auto');
     return UI.telaConversa({
       num:'Lavender', titulo:'Domingo à noite', loc:'a escada da torre',
       falas:[
         'Umas trinta pessoas na escada de fora da torre, cada uma com uma vela, e ninguém falando mais alto que o vento.',
         'Uma senhora segura uma Pokébola vazia no colo, aberta. Um menino segura uma coleira de Growlithe sem Growlithe.',
         vela,
         'Lá em cima, numa janela da torre, uma sombra passa por cima da luz das velas e não é de ninguém que está aqui.',
         'Ninguém olha pra cima. Todo mundo viu.'
       ],
       botoes:[{texto:'Descer a escada', acao:'Exploracao.tela()'}]
     });
   }}
];

const Agenda = {
  porId(id){ return AGENDA.find(a => a.id === id) || null; },
  feitoHoje(a){ return ((Estado.dados.agenda || {})[a.id]) === Estado.dados.relogio.dia; },

  /* o que está acontecendo aqui, agora */
  afazeres(localId){
    return AGENDA.filter(a => a.local === localId && !this.feitoHoje(a) && (() => { try { return a.quando(); } catch(e){ return false; } })())
      .map(a => ({id:'ag_' + a.id, titulo:a.titulo}));
  },

  fazer(id){
    const a = this.porId(id);
    if (!a) return Exploracao.tela();
    const d = Estado.dados;
    d.agenda = d.agenda || {};
    d.agenda[a.id] = d.relogio.dia;
    return a.fazer();
  },
  depois(id, como){
    const a = this.porId(id);
    return a && a.depois ? a.depois(como) : Exploracao.tela();
  },

  /* os papéis que a agenda prega no mural de uma cidade */
  muralDe(cidadeId){
    return AGENDA.filter(a => a.mural === cidadeId && a.anuncio).map(a => a.anuncio);
  }
};

/* o mural do Centro: recado de gente e o que tem dia marcado, junto */
function muralDoCentro(id){
  return (MURAIS[id] || []).concat(Agenda.muralDe(id));
}
