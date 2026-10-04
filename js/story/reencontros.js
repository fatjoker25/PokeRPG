/* ============================================================
   REENCONTROS — quem já te viu, lembra
   Toda pessoa que a história registrou (`ef:{npc:…}`, guardada em
   d.npcs) e com quem você teve peso de verdade — opinião 3 ou mais,
   pra cima ou pra baixo, ou duas lembranças — te reconhece quando
   aparece de novo num capítulo seguinte: antes da primeira fala dela
   na cena entra o reconhecimento, pelo seu nome, com a cara que a
   opinião manda.

   Não repete: uma vez por capítulo e por pessoa, e nunca no mesmo
   capítulo em que ela te conheceu (aí é a mesma conversa). Cena que
   já trata você como conhecido (diz o seu nome, "de novo", "lembra")
   fica como está. Quem tem cena própria de reconhecimento (o Célio,
   quem ficou em casa, o rival) também.
   ============================================================ */
const REENCONTRO_OPINIAO = 3;
const JA_TE_CONHECE = /\b(de novo|outra vez|lembr\w*|voltou|você aqui|você de novo|te conheço)\b/i;

const Reencontros = {
  /* a pessoa por trás de um balão: pelo nome que o balão mostra ou pelo rótulo */
  quem(f){
    const d = Estado.dados;
    if (!d || !d.npcs || !f) return null;
    const rot = typeof f.quem === 'function' ? f.quem(d) : f.quem;
    if (!rot) return null;
    const nome = (typeof Nomes !== 'undefined' && Nomes.comoChamar) ? Nomes.comoChamar(rot) : rot;
    const n = d.npcs[nome] || d.npcs[rot];
    if (!n) return null;
    const nm = n.nome || nome;
    /* na narração o nome abre a frase: rótulo ("a atendente") ganha maiúscula */
    return {n, rotulo:rot, nome:nm, Nome:nm.charAt(0).toUpperCase() + nm.slice(1)};
  },

  pesa(n){
    return Math.abs(n.opiniao || 0) >= REENCONTRO_OPINIAO || (n.memorias || []).length >= 2;
  },

  /* quem não entra no reconhecimento genérico */
  tem_cena_propria(nome){
    const d = Estado.dados;
    if (nome === 'Célio') return true;
    if (typeof nomeCasa === 'function' && nome === nomeCasa()) return true;
    if (d.rival && nome === d.rival.nome) return true;
    return false;
  },

  /* devolve as linhas da cena com o reconhecimento antes da primeira
     fala de cada conhecido; `chave` é a cena, pra redesenhar igual */
  prefaciar(linhas, chave){
    const d = Estado.dados;
    if (!d || !d.npcs || !Array.isArray(linhas) || !linhas.length) return linhas;
    d.reencontros = d.reencontros || {};
    const meu = (d.jogador && d.jogador.nome) || '';
    const saida = [];
    const vistos = new Set();
    let antes = '';
    for (const t of linhas){
      let f = null;
      try { f = typeof t === 'function' ? t(d) : t; } catch(e){}
      if (f && typeof f === 'object' && f.diz != null){
        const q = this.quem(f);
        if (q && !vistos.has(q.nome)){
          vistos.add(q.nome);
          const g = this.saudacao(q, chave, antes + ' ' + txt(f.diz), meu);
          if (g) g.forEach(x => saida.push(x));
        }
      }
      antes += ' ' + (typeof f === 'string' ? f : (f && f.diz != null ? txt(f.diz) : ''));
      saida.push(t);
    }
    return saida;
  },

  saudacao(q, chave, contexto, meu){
    const d = Estado.dados, n = q.n;
    if (!this.pesa(n) || this.tem_cena_propria(q.nome)) return null;
    const mem = n.memorias || [];
    const ultimaCap = mem.length ? Math.max(...mem.map(m => m.cap || 0)) : 0;
    const reg = d.reencontros[q.nome];
    /* já saudou neste capítulo, noutra cena */
    if (reg && reg.cap === d.capitulo && reg.cena !== chave) return null;
    /* ainda é o capítulo em que se conheceram */
    if (!reg && ultimaCap >= d.capitulo) return null;
    if (reg && reg.cena !== chave && ultimaCap >= d.capitulo) return null;
    /* a cena já trata você como conhecido, ou é uma apresentação */
    if ((meu && contexto.includes(meu)) || JA_TE_CONHECE.test(contexto)) return null;
    if (/\b(prazer|me chamo|meu nome é|sou (o|a) )/i.test(contexto)) return null;
    d.reencontros[q.nome] = {cap:d.capitulo, cena:chave};

    const op = n.opiniao || 0;
    const faz = d.capitulo - ultimaCap;
    const semeia = (lista) => lista[(q.nome.length + d.capitulo) % lista.length];
    if (op <= -REENCONTRO_OPINIAO) return [
      semeia([`${q.Nome} te reconhece no mesmo instante, e a cara fecha.`,
              `${q.Nome} te vê e para por meio segundo. Lembra de você, e não é coisa boa.`]),
      fala(q.rotulo, semeia([`${meu}. Você de novo.`, `${meu}. Eu lembro de você.`]), 'frio')
    ];
    if (op >= REENCONTRO_OPINIAO) return [
      semeia([`${q.Nome} te reconhece antes de você chegar perto, e o rosto abre.`,
              `${q.Nome} levanta a cabeça, te vê, e sorri do jeito de quem reencontra alguém.`,
              `${q.Nome} te chama pelo nome antes de você dizer qualquer coisa.`]),
      fala(q.rotulo, semeia(faz >= 4
        ? [`${meu}! Quanto tempo. Achei que você nem lembrava mais de mim.`, `${meu}! Olha quem voltou. Faz tempo.`]
        : [`${meu}! Que bom te ver de novo.`, `${meu}! Eu sabia que você ia passar por aqui de novo.`]), 'riso')
    ];
    return [
      `${q.Nome} te olha um segundo a mais que o normal, tentando lembrar de onde.`,
      fala(q.rotulo, `${meu}, né? A gente já se viu.`)
    ];
  }
};
