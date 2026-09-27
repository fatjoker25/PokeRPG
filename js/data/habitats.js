/* ============================================================
   HABITATS — quem vive onde
   Cada lugar do mapa tem a sua tabela, com peso: o que é comum
   aparece muito, o que é raro aparece pouco. A base são as tabelas
   de FireRed/LeafGreen (e de Red/Blue/Yellow onde as duas brigam),
   com o que nos jogos era presente ou troca posto como raridade no
   lugar onde a história da espécie mora — o Squirtle perto do porto
   de Vermilion, o Eevee na cidade grande, o Lapras no mar gelado.

   Não aparece no mato, nunca:
   - fóssil (Omanyte, Kabuto, Aerodactyl e as evoluções): só renasce
     de fóssil, no laboratório de Cinnabar;
   - lendário: a história decide quando;
   - Porygon: é programa, não bicho de mato.

   A cidade usa as rotas em volta dela, e o mar usa o que a vara e a
   prancha acham. Lugar sem tabela cai no ambiente (habitatPorAmbiente),
   que é a soma das tabelas de mesmo ambiente.
   ============================================================ */
const FOSSEIS = [138, 139, 140, 141, 142];

const ENCONTROS = {
  pallet:          [[16,45],[19,45],[129,10]],
  rota1:           [[16,50],[19,50]],
  viridian:        [[16,40],[19,40],[21,10],[129,10]],
  rota22:          [[19,30],[21,25],[56,20],[29,12],[32,12],[129,1]],
  rota2:           [[16,30],[19,30],[10,15],[13,15],[29,4],[32,4],[122,2]],
  floresta:        [[10,24],[13,24],[11,16],[14,16],[25,6],[16,10],[12,2],[15,2]],
  pewter:          [[16,30],[19,30],[21,30],[39,10]],
  rota3:           [[21,30],[19,20],[39,12],[56,12],[23,8],[27,8],[29,5],[32,5]],
  monte_lua:       [[41,50],[74,30],[46,12],[35,6],[27,2]],
  rota4:           [[19,25],[21,25],[23,15],[27,15],[56,15],[129,5]],
  cerulean:        [[118,30],[60,25],[54,20],[129,20],[79,5]],
  rota24:          [[43,16],[69,16],[16,14],[63,10],[48,6],[10,6],[13,6],[54,8],[60,8],[118,6],[1,2],[4,2]],
  rota9:           [[19,22],[21,22],[23,12],[27,12],[29,8],[32,8],[100,8],[20,4],[22,4]],
  usina:           [[25,22],[81,26],[100,22],[82,8],[101,6],[88,8],[125,6],[26,2]],
  tunel_rocha:     [[41,35],[74,30],[66,18],[95,12],[56,5]],
  lavender:        [[92,50],[104,25],[93,10],[16,10],[52,5]],
  rota5:           [[16,24],[43,18],[69,18],[52,16],[56,14],[63,10]],
  saffron:         [[16,30],[19,20],[52,30],[122,10],[106,5],[107,5]],
  rota6:           [[16,22],[43,16],[69,16],[52,16],[56,14],[54,8],[60,8]],
  rota7:           [[16,20],[37,15],[58,15],[43,12],[69,12],[52,12],[56,8],[63,6]],
  rota8:           [[16,18],[23,12],[27,12],[37,14],[58,14],[52,12],[56,10],[63,6],[64,2]],
  vermilion:       [[98,26],[72,24],[129,20],[116,14],[90,10],[7,2],[52,4]],
  rota11:          [[21,24],[23,18],[27,18],[96,24],[19,10],[20,4],[122,2]],
  rota12:          [[43,14],[69,14],[48,12],[16,10],[17,4],[83,4],[44,3],[70,3],[72,12],[98,10],[116,8],[129,5],[143,1]],
  rota13:          [[43,14],[69,14],[48,14],[16,12],[17,6],[44,6],[70,6],[49,4],[132,6],[83,5],[108,3],[1,1]],
  celadon:         [[52,25],[58,15],[37,15],[43,12],[69,12],[88,10],[133,3],[54,8]],
  rota16:          [[19,18],[20,10],[21,18],[22,10],[84,22],[77,10],[88,6],[143,1],[108,5]],
  fuchsia:         [[29,10],[32,10],[30,5],[33,5],[46,8],[48,8],[102,10],[111,8],[104,6],[84,6],[113,3],[115,3],[123,3],[127,3],[128,4],[147,2],[79,6]],
  rota19:          [[72,30],[73,6],[90,12],[116,14],[120,12],[98,10],[118,8],[129,8]],
  seafoam:         [[86,24],[41,18],[42,8],[54,10],[79,10],[90,8],[98,8],[87,4],[55,4],[80,3],[124,3],[131,2]],
  cinnabar:        [[88,14],[109,16],[19,12],[20,8],[77,10],[58,8],[37,8],[132,8],[89,4],[110,4],[126,4],[72,4]],
  rota21:          [[114,20],[16,14],[17,6],[19,14],[20,6],[72,20],[90,8],[120,6],[116,6]],
  rota23:          [[21,16],[22,10],[23,10],[24,6],[27,10],[28,6],[56,10],[57,6],[30,6],[33,6],[106,2],[107,2],[132,2]],
  caminho_vitoria: [[41,14],[42,12],[74,12],[75,10],[95,10],[66,8],[67,8],[105,6],[57,6],[28,6],[24,4],[49,4]],
  planalto:        [[42,20],[75,16],[67,14],[95,12],[22,12],[24,8],[28,8],[57,10]],
  norte:           [[42,14],[47,10],[64,10],[26,8],[82,8],[101,8],[85,8],[112,8],[105,6],[132,8],[40,4],[113,4],[108,4]],
  ilha_sem_nome:   [[22,14],[85,12],[112,10],[115,8],[128,10],[143,4],[123,6],[127,6],[131,4],[106,4],[107,4],[83,6],[122,4],[124,4]]
};

/* o ambiente sem lugar certo (batalha de cena, treino fora do mapa):
   a soma das tabelas de quem tem aquele ambiente */
/* feita na primeira vez que é pedida: LOCAIS só existe depois do mundo.js */
let _habitatPorAmbiente = null;
function habitatPorAmbiente(){
  if (_habitatPorAmbiente) return _habitatPorAmbiente;
  const out = {};
  if (typeof LOCAIS === 'undefined') return out;
  for (const id in ENCONTROS){
    const L = LOCAIS[id]; if (!L) continue;
    const t = out[L.ambiente] = out[L.ambiente] || {};
    for (const [dex, peso] of ENCONTROS[id]) t[dex] = (t[dex] || 0) + peso;
  }
  for (const k in out) out[k] = Object.entries(out[k]).map(([d, p]) => [+d, p]);
  return (_habitatPorAmbiente = out);
}

/* Johto, depois que a região abre: entra pelos tipos do ambiente, num
   quarto dos encontros, e só a espécie de mato (sem bebê, sem Unown) */
function sorteioJohto(ambiente, cabe){
  if (typeof johtoLiberado !== 'function' || !johtoLiberado() || !Dados.chance(25)) return null;
  const tipos = VIES_AMBIENTE[ambiente] || [];
  const lista = POOL_JOHTO_SELVAGEM.filter(d => cabe(d) && DEX[d].tipos.some(t => tipos.includes(t)));
  return lista.length ? Dados.escolher(lista) : null;
}

/* Quem aparece aqui, neste nível. Só entra quem pode existir no nível
   (um Doduo, não um Dodrio, numa rota de nível 6) — e, se a tabela
   inteira for de forma evoluída acima do nível, vale a forma de antes. */
function sortearEspecie(localId, ambiente, nivel){
  const cabe = d => nivelMinimoDe(d) <= nivel;
  const j = sorteioJohto(ambiente, cabe);
  if (j) return j;
  const tabela = ENCONTROS[localId] || habitatPorAmbiente()[ambiente] || ENCONTROS.rota1;
  let opcoes = tabela.filter(([d]) => DEX[d] && !FOSSEIS.includes(d) && cabe(d));
  if (!opcoes.length) opcoes = tabela.map(([d, p]) => [formaAteONivel(d, nivel), p]);
  const total = opcoes.reduce((t, [, p]) => t + p, 0);
  let r = Math.random() * total;
  for (const [d, p] of opcoes){ if ((r -= p) < 0) return d; }
  return opcoes[0][0];
}
