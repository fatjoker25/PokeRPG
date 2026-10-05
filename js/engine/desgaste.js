/* ============================================================
   DESGASTE — ferramenta que se usa, gasta
   Machado, Picareta e Lanterna aguentam um número de usos
   (DURABILIDADE). No meio do caminho a ficha da mochila diz como
   ela está: nova, meio desgastada, desgastada, quebrando. No último
   uso ela quebra e fica na mochila, quebrada, até você descartar —
   e quebrada não serve pra nada: não abre porta, não dá dado, não
   vende. A loja deixa comprar outra.

   Onde gasta:
   - vasculhar no ambiente dela dá +1 dado de Percepção e gasta um
     uso (machado em floresta e campo; picareta em caverna, montanha
     e vulcão; lanterna em caverna, e aí também gasta uma Pilha);
   - as portas de campo da história (ef.desgaste na escolha).
   Uma unidade se gasta por vez: quem tem duas usa uma até quebrar.
   Está na folha de regras; mudou número, muda lá.
   ============================================================ */
const DURABILIDADE = {'Machado':15, 'Picareta':15, 'Lanterna':20};
const AMBIENTE_DA_FERRAMENTA = {
  'Machado':  ['floresta', 'campo'],
  'Picareta': ['caverna', 'montanha', 'vulcao'],
  'Lanterna': ['caverna']
};
/* o gênero da palavra, pra "quebrado"/"quebrada" */
const FERRAMENTA_FEMININA = new Set(['Picareta', 'Lanterna']);
const QUEBROU = {
  'Machado':  'O cabo do machado racha de ponta a ponta no meio de um golpe. A lâmina fica pendurada, torta.',
  'Picareta': 'A ponta da picareta encontra uma pedra mais dura do que ela e perde. Lasca, entorta, e o cabo afrouxa.',
  'Lanterna': 'A lanterna pisca três vezes e apaga. Você bate nela com a mão, como todo mundo bate, e ela não volta.'
};

const Desgaste = {
  _d(){
    const d = Estado.dados;
    d.desgaste = d.desgaste || {};
    d.quebrados = d.quebrados || {};
    return d;
  },
  dura(nome){ return !!DURABILIDADE[nome]; },
  quebrados(nome){ return this.dura(nome) ? (this._d().quebrados[nome] || 0) : 0; },
  /* quantas ainda funcionam */
  inteiros(nome){ return Math.max(0, Estado.contaItem(nome) - this.quebrados(nome)); },
  fracao(nome){ return this.dura(nome) ? (this._d().desgaste[nome] || 0) / DURABILIDADE[nome] : 0; },
  /* como a que está em uso está */
  estado(nome){
    if (!this.dura(nome)) return null;
    if (!this.inteiros(nome)) return 'quebrado';
    const f = this.fracao(nome);
    return f < .25 ? 'novo' : f < .5 ? 'meio desgastado' : f < .75 ? 'desgastado' : 'quebrando';
  },
  /* "nova", "meio desgastada" — concorda com o nome da ferramenta */
  rotulo(nome, estado){
    const e = estado || this.estado(nome);
    if (!e) return '';
    if (!FERRAMENTA_FEMININA.has(nome)) return e;
    return {'novo':'nova', 'meio desgastado':'meio desgastada', 'desgastado':'desgastada', 'quebrado':'quebrada'}[e] || e;
  },

  /* um uso; devolve os avisos (mudou de estado, quebrou) */
  usar(nome){
    if (!this.dura(nome) || !this.inteiros(nome)) return [];
    const d = this._d();
    const antes = this.estado(nome);
    d.desgaste[nome] = (d.desgaste[nome] || 0) + 1;
    if (d.desgaste[nome] >= DURABILIDADE[nome]){
      d.quebrados[nome] = (d.quebrados[nome] || 0) + 1;
      d.desgaste[nome] = 0;          // se tiver outra, ela entra nova
      Estado.registrar(`${nome} quebrou.`);
      return [{tipo:'dano', texto:QUEBROU[nome] || `${nome} quebrou.`},
              {tipo:'info', texto:`${nome}: ${this.rotulo(nome, 'quebrado')}. Fica na mochila até você descartar.`}];
    }
    const depois = this.estado(nome);
    return depois !== antes ? [{tipo:'info', texto:`${nome}: ${this.rotulo(nome, depois)}.`}] : [];
  },

  /* tirar uma quebrada da mochila */
  descartar(nome){
    const d = this._d();
    if (!this.quebrados(nome)) return false;
    d.quebrados[nome]--;
    if (!d.quebrados[nome]) delete d.quebrados[nome];
    Estado.usarItem(nome);
    Estado.registrar(`Descartou ${FERRAMENTA_FEMININA.has(nome) ? 'a' : 'o'} ${nome.toLowerCase()} quebrad${FERRAMENTA_FEMININA.has(nome) ? 'a' : 'o'}.`);
    return true;
  },

  /* a ferramenta que serve pra vasculhar aqui, se tiver uma inteira
     (lanterna só com pilha) */
  doAmbiente(ambiente){
    for (const [nome, ambs] of Object.entries(AMBIENTE_DA_FERRAMENTA)){
      if (!ambs.includes(ambiente) || !this.inteiros(nome)) continue;
      if (nome === 'Lanterna' && !Estado.contaItem('Pilha')) continue;
      return nome;
    }
    return null;
  },
  /* gasta o uso de vasculhar: a ferramenta, e a pilha se for lanterna */
  usarNoVasculhar(nome){
    const av = [];
    if (nome === 'Lanterna'){ Estado.usarItem('Pilha'); av.push({tipo:'info', texto:'−1 Pilha'}); }
    return av.concat(this.usar(nome));
  }
};
