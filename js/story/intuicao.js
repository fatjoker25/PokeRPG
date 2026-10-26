/* ============================================================
   A INTUIÇÃO — o que puxa você de volta a Lavender
   A figura de capuz não tem PokéNav, não diz o nome e não marca
   hora: faz as três perguntas na neblina e some. Quando chega a
   hora (quatro insígnias, que ninguém diz), o jogo avisa só que
   a intuição pede pra voltar a Lavender, e lá ela aparece de
   novo pra entregar o que as respostas escolheram. Mais tarde, a
   intuição volta mais uma vez: o Haunter ou o Kadabra que ela deu
   só se completa passando pela mão dela, como numa troca.
   O aviso sai uma vez quando a hora chega e, se você não foi, uma
   vez a cada capítulo, mais baixo.
   ============================================================ */
const INSIGNIAS_DA_INTUICAO = 4;     // pra entrega; o jogo não diz o número
const CAPS_ATE_COMPLETAR = 2;        // capítulos entre a entrega e a volta

/* o Pokémon que a figura de capuz deu: pela marca, ou pela história
   de quem recebeu antes da marca existir */
function pokemonDoJuniper(d){
  const todos = [...(d.time || []), ...(d.pc || [])].filter(p => p && !p.morto);
  return todos.find(p => p.doJuniper)
      || todos.find(p => [93, 94, 64, 65].includes(p.dex) && /(abrigo|neblina) de Lavender/.test(p.historia || ''))
      || null;
}

const Intuicao = {
  insignias(d){ return (d.insignias || []).filter(i => i !== 'Título de Campeão').length; },

  /* o que a intuição pede agora: 'entrega', 'completa' ou nada */
  pendente(d){
    d = d || Estado.dados;
    if (!d || !d.flags) return null;
    const f = d.flags;
    if (f.a_pergunta_do_curador && !f.o_curador_entregou && this.insignias(d) >= INSIGNIAS_DA_INTUICAO) return 'entrega';
    if (f.o_curador_entregou && !f.capuz_completou && !f.capuz_recusou){
      const p = pokemonDoJuniper(d);
      const noCinto = p && (d.time || []).includes(p);
      if (noCinto && evoluiPorTroca(p.dex) && d.capitulo >= (f.capuz_cap_entrega || 0) + CAPS_ATE_COMPLETAR) return 'completa';
    }
    return null;
  },

  /* o aviso da tela do mapa: a primeira vez, inteiro; depois, um por capítulo */
  talvez(){
    const d = Estado.dados;
    const p = this.pendente(d);
    if (!p) return null;
    const reg = d.intuicao || (d.intuicao = {});
    const visto = reg[p];
    if (visto != null && visto >= Math.floor(d.capitulo)) return null;
    reg[p] = Math.floor(d.capitulo);
    const primeira = visto == null;
    const TEXTO = {
      entrega: primeira
        ? 'Uma coisa sem nome puxa você de volta a Lavender. Não é lembrança e não é pressa. É intuição, e intuição não explica.'
        : 'A intuição ainda puxa pra Lavender, mais baixo, do jeito de quem sabe esperar.',
      completa: primeira
        ? 'A intuição volta, do mesmo jeito da outra vez, e aponta pra Lavender de novo.'
        : 'Lavender. A intuição insiste, sem levantar a voz.'
    };
    return {tipo:'intuicao', texto:TEXTO[p]};
  },

  /* em Lavender, a intuição vira uma coisa a fazer */
  afazeres(id){
    if (id !== 'lavender') return [];
    const p = this.pendente();
    if (!p) return [];
    return [{id:'intu_' + p, titulo:'Seguir a intuição até a porta do abrigo'}];
  },
  fazer(qual){
    const ev = Eventos.porId(qual === 'completa' ? 'lav_capuz_completa' : 'lav_capuz_volta');
    if (!ev || this.pendente() !== qual) return Exploracao.tela();
    UI.telaEvento(ev);
  },

  /* as três respostas escolhem: guardar → Haunter, que fica como está;
     passar adiante → Kadabra, que só se completa passando por outra mão */
  entregar(d){
    if (d.flags.o_curador_entregou) return [];
    const guarda = indoleDoJuniper(d) === 'guarda';
    const dex = guarda ? 93 : 64;
    const p = criarPokemon(dex, Math.max(22, 18 + this.insignias(d) * 2), {
      moral: 55,
      historia: guarda
        ? 'Veio de uma figura de capuz, na neblina de Lavender, numa Pokébola velha de lacre intacto.'
        : 'Veio de uma figura de capuz, na neblina de Lavender, numa Pokébola velha de lacre rompido. Passou por outras mãos antes da sua.'
    });
    p.doJuniper = true;
    const onde = Estado.adicionar(p);
    Estado.marcar('o_curador_entregou');
    Estado.marcar(guarda ? 'ganhou_do_curador_guardando' : 'ganhou_do_curador_passando');
    d.flags.capuz_cap_entrega = Math.floor(d.capitulo);
    Estado.registrar('Voltou a Lavender seguindo a intuição. A figura de capuz deixou uma Pokébola velha na sua mão.');
    return [{tipo:'pokemon', texto:`Uma Pokébola velha no cinto: ${nomeExib(p)} (Nv ${p.nivel}).${notaDestino(onde)}`},
            {tipo:'eco', texto: guarda ? 'Coisa que fica, fica como está.' : 'Tem coisa que só se completa passando por outra mão.'}];
  },

  /* a troca sem troca: o Pokémon passa pela mão dela e volta outro */
  completar(d){
    const p = pokemonDoJuniper(d);
    if (!p || !evoluiPorTroca(p.dex)) return [{tipo:'info', texto:'A neblina passa, e não tem nada pra devolver.'}];
    const antes = nomeExib(p), novo = evoluiPorTroca(p.dex);
    evoluir(p, novo);
    if (typeof golpesAoEvoluir === 'function') golpesAoEvoluir(p);
    Estado.marcar('capuz_completou');
    Estado.registrar(`${antes} passou pela mão da figura de capuz, na neblina de Lavender, e voltou ${p.nome}.`);
    return [{tipo:'evolucao', texto:`${antes} passou pela mão da figura de capuz e voltou ${p.nome}. Ninguém sabe explicar por que isso acontece. Todo mundo já viu acontecer.`}];
  }
};
