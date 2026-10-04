/* ============================================================
   BARREIRAS_DE_ESCOLHA — o caminho que a sua escolha fechou
   Escolha tem endereço. Quem virou inimigo dos caçadores da floresta
   acha gente deles na boca do Túnel de Pedra; quem foi expulso do
   cassino acha os seguranças na entrada da Ciclovia; quem Kanto já
   conta como gente ruim acha o próprio nome na prancheta da guarita
   norte de Saffron.

   Cada barreira fecha uma passagem nos dois sentidos e nunca é a
   única: o mapa tem sempre outro caminho, mais comprido. As que têm
   `luta` abrem de vez quando você vence quem está parado ali — a luta
   aparece na lista do lugar, dos dois lados. As outras abrem quando
   a razão delas deixa de valer.
   ============================================================ */
const BARREIRAS_DE_ESCOLHA = [
  {id:'cacadores_tunel', entre:['rota9', 'tunel_rocha'],
   fecha:d => !!d.flags.inimigo_cacadores,
   texto:'Dois homens de roupa boa demais pra estrada sentados na boca do túnel, e um deles anota o seu rosto. Não passa.',
   luta:{estrada:'roque_tunel', titulo:'Encarar o caçador na boca do túnel'}},
  {id:'cassino_ciclovia', entre:['celadon', 'rota16'],
   fecha:d => !!d.flags.atacou_no_cassino,
   texto:'Os seguranças do cassino fazem plantão na entrada da Ciclovia. Eles lembram de você.',
   luta:{estrada:'brutus_ciclovia', titulo:'Encarar o chefe da segurança na Ciclovia'}},
  {id:'guarita_norte', entre:['rota5', 'saffron'],
   fecha:d => { const r = Estado.rep; return !!(r && r.eixo === 'ruim' && (r.ruim || 0) >= 4); },
   texto:'O guarda da guarita norte confere uma prancheta, acha o seu nome e não levanta a cancela.'}
];

const Barreiras = {
  aberta(b){
    const d = Estado.dados;
    if (b.luta && typeof Estrada !== 'undefined' && Estrada.registro(b.luta.estrada).vitorias > 0) return true;
    try { return !b.fecha(d); } catch(e){ return true; }
  },
  /* a barreira entre dois lugares, se estiver fechada */
  entre(de, para){
    return BARREIRAS_DE_ESCOLHA.find(b => b.entre.includes(de) && b.entre.includes(para) && !this.aberta(b)) || null;
  },
  /* a luta que abre a barreira, nos dois lados dela */
  afazeres(id){
    return BARREIRAS_DE_ESCOLHA.filter(b => b.luta && b.entre.includes(id) && !this.aberta(b))
      .map(b => ({id:'barr_' + b.id, titulo:b.luta.titulo}));
  },
  fazer(id){
    const b = BARREIRAS_DE_ESCOLHA.find(x => x.id === id);
    if (!b || !b.luta || !Estado.primeiroApto()) return Exploracao.tela();
    Estrada.desafiar(b.luta.estrada, 'barreira');
  }
};
