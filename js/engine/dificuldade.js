/* ============================================================
   DIFICULDADE — Fácil, Normal e Difícil
   Escolhida na inscrição (Casa e começo) e trocada a qualquer hora nos
   Ajustes; mora na jornada (d.config.dificuldade), e save de antes
   dela é Normal. Normal é o jogo como ele foi medido: os simuladores e
   os robôs medem Normal, e nada daqui mexe nele.

   Os sistemas são os mesmos nas três (fome, moral, Vontade, caminhos):
   o que muda é quanto eles pesam e quem está do outro lado.
   - Fácil, pra quem quer aproveitar a história: o lado de lá vem mais
     fraco e mais distraído, a experiência rende mais, e a fome e a
     moral pesam menos.
   - Difícil, pra quem quer desafio: o lado de lá vem mais forte, erra
     menos, gasta Vontade com critério e o ás chega segurando item.

   Toda luta passa por Batalha.iniciar, que chama ajustarLuta: vale pro
   mato, estrada, ginásio, rival, veterano, torneio, Conferência, Elite,
   Campeão e luta de cena. Os números estão na folha de regras.
   ============================================================ */
const DIFICULDADES = {
  facil: {
    nome:'Fácil',
    curta:'Pra aproveitar a história: lutas mais leves, mais experiência, e a fome e a moral pesam menos.',
    nota:'Pra quem quer aproveitar a história. O lado de lá vem mais fraco e mais distraído, a experiência rende mais, e a fome e a moral pesam menos.',
    nivelTreinador:-3, nivelSelvagem:-2,   // níveis no lado de lá
    erroMais:15, erroVezes:1,              // % a mais de erro na escolha do golpe
    vontadePeso:false,                     // ninguém gasta Vontade com critério cheio
    asSegura:false,
    xp:1.3,                                // experiência de luta e de treino
    fomeMoral:false, fomeDistrai:0,        // a fome não tira moral nem distrai na luta
    moralCenaTeto:5,                       // o que uma cena tira, no máximo
    desobedece:0.5                         // a chance de recusar uma ordem
  },
  normal: {
    nome:'Normal',
    curta:'A experiência original, do jeito que o jogo foi medido.',
    nota:'A experiência original: o jogo como ele foi medido e calibrado.',
    nivelTreinador:0, nivelSelvagem:0, erroMais:0, erroVezes:1, vontadePeso:null, asSegura:false,
    xp:1, fomeMoral:true, fomeDistrai:1, moralCenaTeto:null, desobedece:1
  },
  dificil: {
    nome:'Difícil',
    curta:'Pra quem quer desafio: o lado de lá vem mais forte, erra menos e o ás segura item.',
    nota:'Pra quem quer desafio. O lado de lá vem mais forte, erra menos, todo treinador gasta Vontade com critério e o ás chega segurando item.',
    nivelTreinador:3, nivelSelvagem:2, erroMais:0, erroVezes:0.5, vontadePeso:true, asSegura:true,
    xp:1, fomeMoral:true, fomeDistrai:1, moralCenaTeto:null, desobedece:1
  }
};
const ORDEM_DAS_DIFICULDADES = ['facil', 'normal', 'dificil'];

const Dificuldade = {
  id(){
    const d = typeof Estado !== 'undefined' ? Estado.dados : null;
    const v = d && d.config && d.config.dificuldade;
    return DIFICULDADES[v] ? v : 'normal';
  },
  atual(){ return DIFICULDADES[this.id()]; },
  nome(id){ return (DIFICULDADES[id || this.id()] || DIFICULDADES.normal).nome; },
  definir(v){
    const d = typeof Estado !== 'undefined' ? Estado.dados : null;
    if (!d || !DIFICULDADES[v]) return;
    d.config = d.config || {};
    d.config.dificuldade = v;
    try { Estado.salvar('auto'); } catch (e) {}
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.ajuste-dif [data-dif]').forEach(b => {
      const sel = b.dataset.dif === v;
      b.classList.toggle('sel', sel); b.setAttribute('aria-checked', sel);
    });
    const n = document.getElementById('dif-nota');
    if (n) n.textContent = DIFICULDADES[v].nota;
  },

  /* o lado de lá da luta, do jeito da dificuldade. No Normal não faz
     nada. Cada Pokémon guarda o quanto já subiu ou desceu (ajusteDif):
     time que volta pra outra luta não sobe de novo, e quem trocou de
     dificuldade no meio volta pro nível certo. */
  ajustarLuta(B, inimigo, opts){
    if (!inimigo) return;
    const D = this.atual(), normal = this.id() === 'normal';
    const todos = [inimigo].concat(B.timeInimigo || []).filter(Boolean);
    const selvagem = B.tipo === 'selvagem' || B.tipo === 'lendario';
    const delta = selvagem ? D.nivelSelvagem : D.nivelTreinador;
    let mudou = false;
    if (typeof renivelar === 'function') todos.forEach(p => {
      const ja = p.ajusteDif || 0;
      if (ja === delta) return;
      renivelar(p, p.nivel - ja + delta);
      if (delta) p.ajusteDif = delta; else delete p.ajusteDif;
      mudou = true;
    });
    /* a apresentação já vinha escrita com o nível de antes */
    if (mudou && opts && typeof opts.introducao === 'string')
      opts.introducao = opts.introducao.replace(/\(Nv \d+/, '(Nv ' + inimigo.nivel);
    if (normal) return;
    B.erroIA = Math.max(0, Math.min(70, Math.round(B.erroIA * D.erroVezes + D.erroMais)));
    if (D.vontadePeso !== null && !selvagem) B.vontadePeso = D.vontadePeso;
    if (D.asSegura && !selvagem){
      const as = todos[todos.length - 1];
      if (as && !as.segurando) as.segurando = this.itemDoAs(as);
    }
  },
  /* o nível que a história diz em voz alta e a tela mostra antes da
     luta, do jeito da dificuldade (com a espécie, o piso dela) */
  nivel(n, tipo, dex){
    const D = this.atual();
    const delta = (tipo === 'selvagem' || tipo === 'lendario') ? D.nivelSelvagem : D.nivelTreinador;
    const piso = dex && typeof nivelMinimoDe === 'function' ? nivelMinimoDe(dex) : 1;
    return Math.max(piso, 1, Math.min(100, Math.round(n + delta)));
  },
  /* o de um Pokémon do lado de lá que talvez já tenha sido ajustado */
  nivelDe(p, tipo){ return this.nivel(p.nivel - (p.ajusteDif || 0), tipo || 'treinador', p.dex); },
  /* o ás do Difícil segura o item que serve pra ele */
  itemDoAs(p){
    if (typeof aindaEvolui === 'function' && aindaEvolui(p)) return 'Eviolite';
    const s = p.stats || {};
    return (s.esp || 0) > (s.for || 0) ? 'Wise Glasses' : 'Muscle Band';
  },

  xp(){ return this.atual().xp; },
  fomeTiraMoral(){ return this.atual().fomeMoral; },
  fomeDistrai(){ return this.atual().fomeDistrai; },
  moralCenaTeto(padrao){ return this.atual().moralCenaTeto || padrao; },
  desobediencia(x){ return x * this.atual().desobedece; },

  /* a seção da folha de regras, com os números da própria tabela */
  regras(){
    const F = DIFICULDADES.facil, X = DIFICULDADES.dificil;
    const linha = (k, v) => `<div class="linha"><span class="k">${k}</span><span class="v">${v}</span></div>`;
    const niveis = n => `${Math.abs(n)} ${Math.abs(n) === 1 ? 'nível' : 'níveis'} ${n < 0 ? 'abaixo' : 'acima'}`;
    const lado = D => `treinador do lado de lá ${niveis(D.nivelTreinador)}, selvagem e lendário ${niveis(D.nivelSelvagem)}`;
    const vezes = x => String(x).replace('.', ',');
    const aberta = typeof Estado !== 'undefined' && Estado.dados;
    return `<h3>Dificuldade</h3>
      <p class="sussurro">Escolhida na inscrição e trocada a qualquer hora nos Ajustes, da próxima luta em diante. Os sistemas são os mesmos nas três: o que muda é quanto eles pesam e quem está do outro lado. O Normal é o jogo como ele foi medido, e todos os números desta folha são os dele.${aberta ? ` A desta jornada: <b>${this.nome()}</b>.` : ''}</p>
      ${linha('Fácil', `${lado(F)} · a IA erra ${F.erroMais} pontos a mais na escolha do golpe · nenhum treinador gasta Vontade com critério cheio · experiência de luta e de treino ×${vezes(F.xp)} · a fome não tira moral nem distrai na luta · uma cena tira no máximo ${F.moralCenaTeto} de moral · ${F.desobedece === 0.5 ? 'metade' : vezes(F.desobedece) + '×'} da chance de ignorar uma ordem`)}
      ${linha('Normal', 'nada muda: os números desta folha')}
      ${linha('Difícil', `${lado(X)} · a IA erra ${X.erroVezes === 0.5 ? 'metade' : vezes(X.erroVezes) + '×'} do que erraria · todo treinador gasta Vontade com critério cheio · o ás chega segurando item, se não tiver: Eviolite se ainda evolui, senão Wise Glasses ou Muscle Band, pelo que ele bate mais forte · o resto como no Normal`)}
      ${linha('O que a tela mostra', 'o nível de quem está do lado de lá já vem com a dificuldade: na apresentação da luta, nas portas da Liga e no chaveamento')}`;
  },

  /* nos Ajustes, com a jornada aberta: as três à vista */
  ajustes(){
    if (typeof Estado === 'undefined' || !Estado.dados) return '';
    const v = this.id();
    return `<h3>Dificuldade</h3>
      <div class="ajuste-vel ajuste-dif">
        <div class="ajuste-vel-linha">
          <span class="ajuste-vel-rot" id="dif-rot">Dificuldade da jornada</span>
          <div class="vel-opcoes" role="radiogroup" aria-labelledby="dif-rot">
            ${ORDEM_DAS_DIFICULDADES.map(k => `<button type="button" role="radio" data-dif="${k}" class="${k === v ? 'sel' : ''}"
              aria-checked="${k === v}" onclick="Dificuldade.definir('${k}')">${DIFICULDADES[k].nome}</button>`).join('')}
          </div>
        </div>
        <p class="sussurro" id="dif-nota">${DIFICULDADES[v].nota}</p>
        <p class="sussurro">Vale da próxima luta em diante: a que está andando termina como começou.</p>
      </div>`;
  }
};
