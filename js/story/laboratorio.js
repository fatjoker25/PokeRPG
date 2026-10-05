/* ============================================================
   O LABORATÓRIO DE CINNABAR E O BALCÃO DE PRÊMIOS DE CELADON
   Dois jeitos de ter Pokémon que o mato não dá:
   - fóssil (Fóssil de Hélice, Fóssil de Domo, Âmbar Antigo) se
     acha vasculhando caverna e se entrega no laboratório da ilha.
     Um de cada vez; fica pronto depois de HORAS_DO_FOSSIL horas do
     jogo e sai no NIVEL_DO_FOSSIL;
   - Porygon é programa, não bicho de mato: está na vitrine do
     balcão de prêmios do cassino, por PRECO_PORYGON.
   As duas coisas estão na folha de regras; mudou número, muda lá.
   ============================================================ */
const HORAS_DO_FOSSIL = 24;
const NIVEL_DO_FOSSIL = 30;
const PRECO_PORYGON = 9800;

const Laboratorio = {
  afazeres(localId){
    const L = LOCAIS[localId] || {};
    const out = [];
    if ((L.lugares || []).includes('laboratorio'))
      out.push({lugar:true, id:'lab_fossil', titulo:'Laboratório da ilha'});
    if ((L.lugares || []).includes('cassino'))
      out.push({lugar:true, id:'lab_premios', titulo:'Balcão de prêmios do cassino'});
    return out;
  },

  fazer(id){
    if (id === 'fossil') return this.laboratorio();
    if (id === 'premios') return this.premios();
    Exploracao.tela();
  },

  _agora(){
    const r = Estado.dados.relogio;
    if (typeof sincronizarHora === 'function') sincronizarHora(r);
    return r.dia * 24 + r.hora;
  },

  fosseisNaMochila(){
    return Object.keys(ITENS_INFO).filter(n => ITENS_INFO[n].tipo === 'fossil' && Estado.contaItem(n));
  },

  /* ---------- o laboratório ---------- */
  laboratorio(){
    const d = Estado.dados;
    const quem = 'a pesquisadora do laboratório';
    const f = d.labFossil;
    if (f){
      if (this._agora() < f.pronto){
        const falta = f.pronto - this._agora();
        return Exploracao.tela([
          {tipo:'info', texto:'O laboratório fica na beira da ilha, num prédio baixo com as janelas cobertas de papel por dentro.'},
          {tipo:'info', texto:fala(quem, falta > 12
            ? `O seu ${f.item} ainda está no banho. Volta amanhã.`
            : 'Falta pouco. Hoje ainda, se nada der errado. Não fica parad{o|a} na porta, que dá azar.')}
        ]);
      }
      d.labFossil = null;
      const p = criarPokemon(f.dex, NIVEL_DO_FOSSIL,
        {historia:`Revivid{o} no laboratório de Cinnabar, de um ${f.item} que você achou numa caverna.`});
      const onde = Estado.adicionar(p);
      Estado.registrar(`O laboratório de Cinnabar reviveu o ${f.item}: ${p.nome}.`);
      Estado.salvar('auto');
      return Exploracao.tela([
        {tipo:'info', texto:fala(quem, 'Deu. Eu nunca garanto, e deu.')},
        {tipo:'info', texto:`Ela te entrega uma Pokébola morna. Dentro dela, uma coisa que não andava em Kanto desde antes de existir Kanto olha pra luz da sala como quem não entende de onde vem tanta.`},
        {tipo:'pokemon', texto:`${p.nome} (Nv ${p.nivel}) é seu.${notaDestino(onde)}`}
      ]);
    }
    const tem = this.fosseisNaMochila();
    const abre = [
      'O laboratório fica na beira da ilha, num prédio baixo com as janelas cobertas de papel por dentro. A porta está aberta e tem um balcão logo na entrada, com uma campainha e um aviso: "Aceitamos fóssil para análise. Não garantimos resultado. Não devolvemos a pedra."'
    ];
    if (!tem.length)
      return Exploracao.tela([{tipo:'info', texto:abre[0]},
        {tipo:'info', texto:fala(quem, 'Sem pedra, eu não tenho o que fazer por você. E eu tenho muita coisa pra fazer.')}]);
    const botoes = tem.map(n => `<button class="escolha com-item" onclick="Laboratorio.entregar('${n.replace(/'/g, "\\'")}')">
        ${imgItem(n)}Entregar ${UI.esc(n)}</button>`).join('');
    UI.modal('Laboratório da ilha', `<p class="narrativa" style="margin:0 0 10px">${UI.esc(abre[0])}</p>
      <div class="escolhas">${botoes}
        <button class="escolha" onclick="UI.fecharModal()">Ficar com a pedra.</button></div>`);
  },

  entregar(nome){
    const d = Estado.dados, info = ITENS_INFO[nome];
    if (!info || info.tipo !== 'fossil' || !Estado.contaItem(nome) || d.labFossil) return;
    Estado.usarItem(nome);
    d.labFossil = {item:nome, dex:info.dex, pronto:this._agora() + HORAS_DO_FOSSIL};
    Estado.registrar(`Deixou o ${nome} no laboratório de Cinnabar.`);
    Estado.salvar('auto');
    UI.fecharModal(true);
    Exploracao.tela([
      {tipo:'info', texto:'Ela pega a pedra com as duas mãos, vira contra a luz e anota alguma coisa num formulário de três vias sem te perguntar nada.'},
      {tipo:'info', texto:fala('a pesquisadora do laboratório', 'Amanhã. Se não for amanhã, não vai ser.')},
      {tipo:'item', texto:`−1× ${nome}`}
    ]);
  },

  /* ---------- o balcão de prêmios ---------- */
  premios(){
    const din = Estado.j.dinheiro;
    const quem = 'o caixa do balcão de prêmios';
    const html = `<p class="narrativa" style="margin:0 0 10px">${UI.esc(
      'No fundo do cassino, entre a máquina de troco e a porta do banheiro, um balcão de vidro com os prêmios. Boneco, relógio de pulso, uma bicicleta de criança. E, numa vitrine só dela, uma Pokébola com etiqueta de preço.')}</p>
      <p class="sussurro" style="margin:0 0 12px">Porygon: ${fmtDin(PRECO_PORYGON)} ₽. Você tem ${fmtDin(din)} ₽.</p>
      <div class="escolhas">
        <button class="escolha" ${din < PRECO_PORYGON ? 'disabled' : ''} onclick="Laboratorio.comprarPorygon()">Levar o Porygon.</button>
        <button class="escolha" onclick="UI.fecharModal()">Só olhar.</button>
      </div>`;
    UI.modal('Balcão de prêmios', html);
  },

  comprarPorygon(){
    const d = Estado.dados;
    if (Estado.j.dinheiro < PRECO_PORYGON) return;
    Estado.j.dinheiro -= PRECO_PORYGON;
    const p = criarPokemon(137, Math.max(18, (LOCAIS.celadon.nivel || 26) - 4),
      {historia:'Saiu da vitrine do balcão de prêmios do cassino de Celadon, com etiqueta de preço colada na Pokébola.'});
    const onde = Estado.adicionar(p);
    const primeira = !d.flags.comprou_porygon;
    d.flags.comprou_porygon = true;
    const av = [
      {tipo:'info', texto:'O caixa tira a Pokébola da vitrine sem olhar pra ela, descola a etiqueta com a unha e põe outra, igual, na vitrine vazia.'},
      {tipo:'info', texto:fala('o caixa do balcão de prêmios', 'Tem sempre um. Não me pergunta de onde.')},
      {tipo:'pokemon', texto:`${p.nome} (Nv ${p.nivel}) é seu.${notaDestino(onde)}`}
    ];
    if (primeira) Estado.mudarRep('ruim', 1, 'Comprou um Pokémon de prêmio no cassino de Celadon', {});
    Estado.registrar('Comprou um Porygon no balcão de prêmios do cassino de Celadon.');
    Estado.salvar('auto');
    UI.fecharModal(true);
    Exploracao.tela(av);
  }
};
