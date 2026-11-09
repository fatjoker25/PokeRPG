/* ============================================================
   O MEWTWO DECIDE
   Todo Mewtwo do cinto — a Unidade 01, que sai da sala 704 na mão
   de quem venceu a Presidente, e o que alguém pega no norte — olha
   quem carrega a Pokébola antes de emprestar o que tem. Estar no
   time não basta: até aceitar quem joga, ele decide a cada ordem
   (faz o que você pediu, escolhe o golpe sozinho ou não faz nada),
   e a moral dele não aparece em lugar nenhum.

   Ele aceita quando você tem as oito insígnias, o resto do time forte
   o bastante (FORCA_PRO_MEWTWO) e o juízo dele chega a
   JUIZO_PRA_ACEITAR. O juízo (0 a 100) é o que ele vê:
   - as insígnias;
   - a força do resto do time: os três mais fortes sem ele, contados
     como três (time pequeno não chega), até DISTANCIA_DO_MEWTWO
     níveis abaixo dele valem tudo. Quem precisa dele pra ganhar não
     está pronto pra ele;
   - as decisões: a reputação, como você trata os outros (a moral
     deles) e quem morreu no seu cinto desde que ele entrou.
   Antes de aceitar, a chance de seguir a ordem é o próprio juízo; o
   que sobra se divide entre escolher o golpe (sem errar a conta, que
   ele não erra) e não fazer nada.

   A folha de regras diz o que pesa e não dá a conta, como a dos
   titulares da Elite: a moral escondida foi o pedido. Aceitou, fica
   aceito (p.aceitou), a moral aparece com pelo menos o juízo daquele
   dia, e daí em diante ele obedece como qualquer outro.
   ============================================================ */
const JUIZO_PRA_ACEITAR = 70;
const INSIGNIAS_PRO_MEWTWO = 8;
const DISTANCIA_DO_MEWTWO = 15;
const FORCA_PRO_MEWTWO = 15;          /* de 30: o resto do time a até 20 níveis dele */

const Mewtwo = {
  eh(p){ return !!p && p.dex === 150; },
  /* já aceitou; quem não é Mewtwo não tem o que aceitar */
  aceitou(p){ return !this.eh(p) || !!p.aceitou; },
  /* a moral dele fica escondida até aceitar */
  escondeMoral(p){ return this.eh(p) && !p.aceitou && !p.morto; },

  insignias(d){ return (d.insignias || []).filter(i => i !== 'Título de Campeão').length; },

  /* a força do resto do time, de 0 a 30: os três mais fortes sem ele,
     contados como três, até DISTANCIA_DO_MEWTWO níveis abaixo dele valem
     tudo, e cada nível a mais de distância tira 3 */
  forca(p, d){
    const outros = (d.time || []).filter(x => x && x.uid !== p.uid && !x.morto);
    const fortes = outros.map(x => x.nivel || 0).sort((a, b) => b - a).slice(0, 3);
    const doResto = fortes.reduce((s, n) => s + n, 0) / 3;
    const falta = Math.max(0, (p.nivel - DISTANCIA_DO_MEWTWO) - doResto);
    return Math.max(0, 30 - 3 * falta);
  },

  juizo(p, d){
    d = d || (typeof Estado !== 'undefined' ? Estado.dados : null);
    if (!p || !d) return 0;
    if (p.desdeCap == null) p.desdeCap = d.capitulo || 0;
    const outros = (d.time || []).filter(x => x && x.uid !== p.uid && !x.morto);
    const forca = this.forca(p, d);
    const R = d.reputacao || {};
    const rep = Math.max(-15, Math.min(15, Math.round(((R.pontosBom || 0) - (R.pontosRuim || 0)) / 40)));
    const morais = outros.map(x => x.moral == null ? 50 : x.moral);
    const media = morais.length ? morais.reduce((s, n) => s + n, 0) / morais.length : 0;
    const cuida = media >= 70 ? 15 : media >= 50 ? 8 : media >= 30 ? 0 : -10;
    const mortes = (d.cemiterio || []).filter(x => (x.morreuNoCap || 0) >= p.desdeCap).length;
    const ins = Math.min(20, this.insignias(d) * 2.5);
    return Math.max(0, Math.min(100, Math.round(20 + ins + forca + rep + cuida - 10 * mortes)));
  },

  /* na luta, antes de aceitar: o que ele faz com a sua ordem. Devolve
     null (segue), {decide} (escolhe o golpe) ou {recusa} (não faz nada),
     com o texto, no formato do Batalha.vontade */
  decide(p){
    const j = this.juizo(p);
    const r = Dados.entre(1, 100);
    if (r <= j) return null;
    const n = nomeVisivel(p);
    if (r <= j + (100 - j) / 2)
      return {decide:true, texto:Dados.escolher([
        `${n} ouve a ordem e faz o que acha melhor.`,
        `${n} não usa o que você pediu. Escolhe sozinh${pron(p).o}.`,
        `${n} olha a ordem como quem lê uma sugestão, e faz outra coisa.`])};
    return {recusa:true, texto:Dados.escolher([
      `${n} olha pra você e não se mexe.`,
      `${n} fica parad${pron(p).o}, olhando o que você vai fazer.`,
      `${n} deixa a ordem passar.`])};
  },

  /* na tela do mapa: quem já pode aceitar aceita, e a moral aparece */
  conferir(){
    const d = typeof Estado !== 'undefined' ? Estado.dados : null;
    if (!d || !d.time) return [];
    const avisos = [];
    for (const p of d.time){
      if (!this.eh(p) || p.aceitou || p.morto) continue;
      if (p.desdeCap == null) p.desdeCap = d.capitulo || 0;
      /* as oito insígnias e o resto do time forte o bastante (a metade da
         força) são condição; o resto do juízo é o que ele viu você decidir */
      if (this.insignias(d) < INSIGNIAS_PRO_MEWTWO || this.forca(p, d) < FORCA_PRO_MEWTWO) continue;
      const j = this.juizo(p, d);
      if (j < JUIZO_PRA_ACEITAR) continue;
      p.aceitou = true;
      p.moral = Math.max(p.moral || 0, j);
      Estado.registrar(`${nomeExib(p)} saiu da Pokébola sem ninguém chamar e ficou olhando. Depois voltou sozinh${pron(p).o}.`);
      avisos.push({tipo:'pokemon', texto: p.fabricada
        ? `${nomeExib(p)} sai da Pokébola sem ninguém chamar. Fica de pé na sua frente, do jeito que ficava na sala 704, e dessa vez não está esperando nada: está olhando você. Depois de um tempo, volta sozinha.`
        : `${nomeExib(p)} sai da Pokébola sem ninguém chamar e fica olhando você por um tempo que você não consegue medir. Depois volta sozinho.`});
    }
    return avisos;
  }
};

/* a Unidade 01 aceitou quem a carrega (pros textos do capítulo 28) */
function unidadeAceitou(d){
  d = d || Estado.dados;
  const u = [...(d.time || []), ...(d.pc || [])].find(p => p && p.dex === 150 && p.fabricada);
  return !!(u && u.aceitou);
}
