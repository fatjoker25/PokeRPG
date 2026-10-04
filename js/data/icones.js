/* ============================================================
   ÍCONES DESENHADOS
   Duas coisas que não têm arte nos jogos e por isso são desenhadas
   aqui, em SVG, sem arquivo:

   - ITEM_DESENHADO: o ícone de 30×30 de cada item que não tem
     equivalente exato nos jogos (Machado, Lanterna, as mochilas…) e,
     pelo nome, o papel de enredo (bilhete, foto, mapa, caixa, chave).
     caminhoItem() cai aqui quando ITEM_SPRITE não tem o item. O item
     que tem equivalente nos jogos continua com a arte dos jogos.
   - ICONE: os ícones de traço dos lugares e das ações (Ginásio,
     Centro, Loja, Treinar, Vasculhar…) e das opções do Centro, na cor
     do texto do botão (currentColor).
   ============================================================ */

/* ---------- itens: 30×30, cor própria ---------- */
const _CONT = 'stroke="#20242c" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';
function _mochilaSVG(cor, bolsa){
  return bolsa
    ? `<path d="M8 12 Q15 3 22 12" fill="none" ${_CONT}/><rect x="5" y="11" width="20" height="14" rx="4" fill="${cor}" ${_CONT}/><rect x="12" y="15" width="6" height="4" rx="1" fill="#fff" opacity=".7"/>`
    : `<rect x="7" y="7" width="16" height="19" rx="5" fill="${cor}" ${_CONT}/><path d="M11 7 Q15 2 19 7" fill="none" ${_CONT}/><rect x="10" y="15" width="10" height="7" rx="2" fill="#000" opacity=".18" ${_CONT}/><path d="M10 12h10" ${_CONT}/>`;
}
const CORES_DE_BOLSA = {Preta:'#3a3d44', Vermelha:'#d8433b', Azul:'#3b74d8', Verde:'#3fa55a', Amarela:'#e9c33a',
  Marrom:'#8a5a35', Laranja:'#ea8a2e', Roxa:'#8b55c9', Branca:'#eef0f2', Cinza:'#9aa1aa', Rosa:'#ec8fb6',
  Prateada:'#c9d1da', Dourada:'#e2b64a'};

const ITEM_DESENHADO = {
  'Bandagem': `<rect x="4" y="11" width="22" height="9" rx="4.5" fill="#f1e2c6" ${_CONT}/><rect x="12" y="11" width="6" height="9" fill="#e3c99b"/><path d="M15 13v5M12.5 15.5h5" stroke="#d8433b" stroke-width="2"/>`,
  'Cantil': `<circle cx="15" cy="17" r="9" fill="#3d7fbf" ${_CONT}/><rect x="12.5" y="4" width="5" height="5" rx="1" fill="#8a8f98" ${_CONT}/><path d="M9 16q6 4 12 0" fill="none" stroke="#9fd0ff" stroke-width="1.6"/>`,
  'Ração': `<path d="M7 9h16l-2 17H9z" fill="#c9965a" ${_CONT}/><path d="M7 9l3-4h10l3 4" fill="#e0b47a" ${_CONT}/><circle cx="15" cy="18" r="2.4" fill="#7a4c22"/><circle cx="11.6" cy="14.6" r="1.3" fill="#7a4c22"/><circle cx="15" cy="13.4" r="1.3" fill="#7a4c22"/><circle cx="18.4" cy="14.6" r="1.3" fill="#7a4c22"/>`,
  'Colete de Lona': `<path d="M9 5l3 3h6l3-3 4 4v16H5V9z" fill="#b39a62" ${_CONT}/><path d="M15 8v17" ${_CONT}/><rect x="7.5" y="15" width="5" height="4" fill="#9a824d" ${_CONT}/><rect x="17.5" y="15" width="5" height="4" fill="#9a824d" ${_CONT}/>`,
  'Botina Leve': `<path d="M9 4h8v13l7 3v5H6V19z" fill="#8a5a35" ${_CONT}/><path d="M6 23h18" ${_CONT}/><path d="M11 8h4M11 11h4" stroke="#e0b47a" stroke-width="1.4"/>`,
  'Bota de borracha': `<path d="M9 3h9v15l6 3v5H6V19z" fill="#e9c33a" ${_CONT}/><path d="M6 24h18" stroke="#20242c" stroke-width="2"/>`,
  'Machado': `<path d="M18 4l7 7-3 3-7-7z" fill="#b8c1cc" ${_CONT}/><path d="M17 9L5 25" stroke="#8a5a35" stroke-width="3" stroke-linecap="round"/><path d="M17 9L5 25" stroke="#20242c" stroke-width=".8" fill="none"/>`,
  'Picareta': `<path d="M4 10 Q15 2 26 10 Q15 6 4 10z" fill="#b8c1cc" ${_CONT}/><path d="M15 7v19" stroke="#8a5a35" stroke-width="3" stroke-linecap="round"/>`,
  'Lanterna': `<rect x="11" y="11" width="8" height="15" rx="2" fill="#4c5563" ${_CONT}/><path d="M9 5h12l-2 6h-8z" fill="#d7dde4" ${_CONT}/><path d="M11 5l-3-3M15 4V1M19 5l3-3" stroke="#f7d84a" stroke-width="1.6"/>`,
  'Pilha': `<rect x="8" y="7" width="14" height="19" rx="2" fill="#2f3440" ${_CONT}/><rect x="12" y="4" width="6" height="3" fill="#b8c1cc" ${_CONT}/><rect x="8" y="7" width="14" height="6" fill="#e9a23a" ${_CONT}/><path d="M15 16v6M12 19h6" stroke="#fff" stroke-width="1.6"/>`,
  'Máscara de pó': `<path d="M5 13q10-6 20 0v4q-10 8-20 0z" fill="#eef0f2" ${_CONT}/><path d="M5 14L2 11M25 14l3-3" ${_CONT}/><path d="M10 15h10M10 18h10" stroke="#9aa1aa" stroke-width="1.2"/>`,
  'Cobertor térmico': `<rect x="4" y="9" width="22" height="14" rx="2" fill="#c9d1da" ${_CONT}/><path d="M4 14h22M4 18h22" stroke="#8a95a3" stroke-width="1.2"/><path d="M8 9v14" stroke="#e2b64a" stroke-width="1.4"/>`,
  'Câmera descartável': `<rect x="4" y="9" width="22" height="14" rx="2" fill="#e9c33a" ${_CONT}/><circle cx="17" cy="16" r="4.5" fill="#2f3440" ${_CONT}/><circle cx="17" cy="16" r="1.8" fill="#9fd0ff"/><rect x="7" y="11" width="5" height="3" fill="#fff" ${_CONT}/>`,
  'Caderno de campo': `<rect x="7" y="4" width="17" height="22" rx="2" fill="#3fa55a" ${_CONT}/><path d="M7 4v22" stroke="#20242c" stroke-width="3"/><rect x="12" y="9" width="9" height="4" fill="#eef0f2" ${_CONT}/>`,
  'Isca': `<path d="M15 3v13a5 5 0 1 1-6-5" fill="none" stroke="#9aa1aa" stroke-width="2" stroke-linecap="round"/><circle cx="19" cy="20" r="4" fill="#d8433b" ${_CONT}/><path d="M19 16l1-3" stroke="#3fa55a" stroke-width="1.6"/>`,
  'Relógio': `<rect x="11" y="2" width="8" height="26" rx="3" fill="#4c5563" ${_CONT}/><circle cx="15" cy="15" r="7" fill="#eef0f2" ${_CONT}/><path d="M15 15V11M15 15l3 2" stroke="#20242c" stroke-width="1.6" stroke-linecap="round"/>`,
  /* papel de enredo, pelo nome */
  _papel: `<path d="M8 4h11l4 4v18H8z" fill="#f4efe2" ${_CONT}/><path d="M19 4v4h4" fill="none" ${_CONT}/><path d="M11 12h9M11 15h9M11 18h6" stroke="#9aa1aa" stroke-width="1.3"/>`,
  _foto: `<rect x="5" y="7" width="20" height="17" rx="1.5" fill="#f4efe2" ${_CONT}/><rect x="8" y="10" width="14" height="10" fill="#9fd0ff"/><path d="M8 20l5-5 4 3 5-5v7z" fill="#3fa55a"/>`,
  _mapa: `<path d="M4 7l7-3 8 3 7-3v19l-7 3-8-3-7 3z" fill="#e8dcb8" ${_CONT}/><path d="M11 4v19M19 7v19" stroke="#b8a77a" stroke-width="1.2"/><path d="M7 15q4-4 8 0t8-2" fill="none" stroke="#d8433b" stroke-width="1.4" stroke-dasharray="2 2"/>`,
  _caixa: `<path d="M4 11l11-5 11 5v12l-11 5-11-5z" fill="#c9965a" ${_CONT}/><path d="M4 11l11 5 11-5M15 16v12" fill="none" ${_CONT}/>`,
  _chave: `<circle cx="10" cy="15" r="5" fill="#e2b64a" ${_CONT}/><circle cx="10" cy="15" r="1.8" fill="#20242c"/><path d="M15 15h11M22 15v4M25 15v3" stroke="#e2b64a" stroke-width="3" stroke-linecap="round"/><path d="M15 15h11" stroke="#20242c" stroke-width=".6"/>`,
  _pacote: `<path d="M6 10h18l-2 16H8z" fill="#b39a62" ${_CONT}/><path d="M10 10q5-7 10 0" fill="none" ${_CONT}/>`
};

/* o desenho de um item, se ele não tem arte dos jogos */
function desenhoDoItem(nome){
  let corpo = ITEM_DESENHADO[nome];
  if (!corpo){
    const m = /^(Mochila|Bolsa) (\w+)/.exec(nome);
    if (m && CORES_DE_BOLSA[m[2]]) corpo = _mochilaSVG(CORES_DE_BOLSA[m[2]], m[1] === 'Bolsa');
  }
  if (!corpo){
    const n = nome.toLowerCase();
    corpo = /foto/.test(n) ? ITEM_DESENHADO._foto
          : /mapa|croqui|planta/.test(n) ? ITEM_DESENHADO._mapa
          : /caixa|lacre|engradado/.test(n) ? ITEM_DESENHADO._caixa
          : /chave|cart[ãa]o-chave|crach/.test(n) ? ITEM_DESENHADO._chave
          : /bilhete|carta|papel|recibo|folha|caderno|caderneta|relat|ficha|guia|documento|c[óo]pia|lista|anota|passagem|envelope|di[áa]rio|livro|jornal|panfleto|cartaz/.test(n) ? ITEM_DESENHADO._papel
          : ITEM_DESENHADO._pacote;
  }
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30">${corpo}</svg>`);
}

/* ---------- lugares e ações: traço, cor do botão ---------- */
const ICONE = {
  ginasio:'<path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M9 21v-6h6v6"/><circle cx="12" cy="10" r="1.6"/>',
  centro:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><circle cx="12" cy="12" r="2.6"/><path d="M17 5.5h3M18.5 4v3"/>',
  loja:'<path d="M4 8h16l-1.5 12h-13z"/><path d="M8.5 8a3.5 3.5 0 0 1 7 0"/>',
  casa:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  laboratorio:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/>',
  mural:'<rect x="3" y="4" width="18" height="15" rx="1.5"/><path d="M7 8h5M7 12h8M14 8h3"/><circle cx="12" cy="4" r="1.2"/>',
  pc:'<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
  credenciais:'<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="8.5" cy="12" r="2"/><path d="M5.5 16.5a3 3 0 0 1 6 0M14 10h5M14 13h4"/>',
  mapa:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  dormir:'<path d="M3 18V8M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.8"/>',
  torneio:'<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
  liga:'<path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.1l1-5.8-4.3-4.1 5.9-.9z"/>',
  onibus:'<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16M8 17v3M16 17v3"/><circle cx="8" cy="14" r=".8"/><circle cx="16" cy="14" r=".8"/>',
  doar:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  relembrar:'<path d="M4 5h11a3 3 0 0 1 3 3v12H7a3 3 0 0 1-3-3z"/><path d="M18 8h2v12h-2M8 9h6M8 12h6"/>',
  vasculhar:'<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
  procurar:'<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M10.5 7.5v6M7.5 10.5h6"/>',
  andar:'<path d="M8 21l2-6-2-3 2-5 3 2 3 1M10 15l4 2 1 4M12 4.5a1.5 1.5 0 1 0 0-.1"/>',
  conversar:'<path d="M4 5h11v8H8l-4 3z"/><path d="M15 9h5v8l-3-2h-6v-2"/>',
  treinar:'<path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/>',
  pescar:'<path d="M4 20L17 4"/><path d="M17 4v12a3 3 0 1 1-3-3"/>',
  acampar:'<path d="M3 20L12 5l9 15z"/><path d="M12 5v15M9.5 20l2.5-5 2.5 5"/>',
  esperar:'<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9"/>',
  lutar:'<path d="M5 19L17 7M14 4h6v6M19 19L7 7M10 4H4v6"/>',
  troca:'<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
  agenda:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3"/>',
  convite:'<rect x="3" y="6" width="18" height="13" rx="1.5"/><path d="M3 7l9 6 9-6"/>',
  revanche:'<path d="M4 12a8 8 0 0 1 14-5.3M20 4v5h-5M20 12a8 8 0 0 1-14 5.3M4 20v-5h5"/>',
  porta:'<rect x="5" y="3" width="14" height="18" rx="1"/><circle cx="15" cy="12" r="1"/>',
  trancado:'<rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  arco:'<path d="M5 4h11l3 3v13H5z"/><path d="M9 9h6M9 13h6M9 17h3"/>',
  ferragem:'<path d="M14 4l6 6-3 3-6-6zM11 7L4 20"/>',
  itens:'<rect x="5" y="8" width="14" height="13" rx="3"/><path d="M9 8V6a3 3 0 0 1 6 0v2M8 13h8"/>',
  pokedex:'<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="9" cy="7" r="1.6"/><rect x="8" y="11" width="8" height="6" rx="1"/>',
  pokenav:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10 6h4M11 18h2"/><rect x="9" y="8" width="6" height="7" rx="1"/>',
  cartao:'<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="8.5" cy="12" r="2"/><path d="M14 10h5M14 13h4M14 16h3"/>'
};

function svgIcone(chave, cls){
  const c = ICONE[chave];
  if (!c) return '';
  return `<svg class="icone${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c}</svg>`;
}

/* o ícone de cada coisa da lista de um lugar, pelo id do afazer */
function iconeDoAfazer(a){
  const id = String(a.id || '');
  const direto = {centro:'centro', loja:'loja', ginasio:'ginasio', casa:'casa', liga:'liga', torneio:'torneio',
    onibus:'onibus', doar:'doar', relembrar:'relembrar', vasculhar:'vasculhar', procurar:'procurar', andar:'andar',
    conversar:'conversar', treinar:'treinar', pescar:'pescar', acampar:'acampar', esperar:'esperar', desafiar:'lutar', troca:'troca'};
  if (direto[id]) return direto[id];
  if (/^posto_/.test(id)) return 'credenciais';
  if (/^vet_/.test(id)) return 'lutar';
  if (/^conv_/.test(id)) return 'convite';
  if (/^rev_/.test(id)) return 'revanche';
  if (/^ag_/.test(id)) return 'agenda';
  if (/^barr_/.test(id)) return 'lutar';
  if (/^idade_/.test(id)) return 'porta';
  const t = String(a.titulo || '').toLowerCase();
  if (/laborat/.test(t)) return 'laboratorio';
  if (/ferragem/.test(t)) return 'ferragem';
  if (/loja|mercado|bazar|armaz/.test(t)) return 'loja';
  return 'porta';
}
