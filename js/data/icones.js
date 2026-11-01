/* ============================================================
   ÍCONES DESENHADOS
   Duas coisas que não têm arte nos jogos e por isso são desenhadas
   aqui:

   - ITEM_PIXEL: o ícone de 30×30, em pixel, de cada item que não tem
     equivalente exato nos jogos (Machado, Lanterna, as mochilas…) e,
     pelo nome, o papel de enredo (bilhete, foto, mapa, caixa, chave).
     caminhoItem() cai aqui quando ITEM_SPRITE não tem o item. O item
     que tem equivalente nos jogos continua com a arte dos jogos.
   - ICONE: os ícones de traço dos lugares e das ações (Ginásio,
     Centro, Loja, Treinar, Vasculhar…) e das opções do Centro, na cor
     do texto do botão (currentColor).
   ============================================================ */

/* ---------- itens: 30×30, em pixel ---------- */
/* O item sem equivalente nos jogos tem ícone em pixel, no jeito dos
   ícones de mochila de HG/SS que ficam do lado dele: 30×30, contorno
   escuro, luz de cima à esquerda (ferramentas/desenhar-itens.py, em
   sprites_nds/items/nossos/). Item novo sem arte entra lá e aqui. */
const ITEM_PIXEL = {
  'Bandagem':'bandagem', 'Cantil':'cantil', 'Ração':'racao', 'Colete de Lona':'colete', 'Botina Leve':'botina',
  'Bota de borracha':'bota_borracha', 'Machado':'machado', 'Picareta':'picareta', 'Lanterna':'lanterna',
  'Pilha':'pilha', 'Máscara de pó':'mascara', 'Cobertor térmico':'cobertor', 'Câmera descartável':'camera',
  'Caderno de campo':'caderno', 'Isca':'isca', 'Relógio':'relogio',
  /* o que a rede te dá */
  'Uniforme preto da rede':'uniforme_rede', 'Caderno de lote':'caderno_lote',
  'Chave do subsolo':'chave_subsolo', 'Broche da letra antiga':'broche'
};
/* mochila e bolsa: uma por cor, com o nome da cor do item */
const CORES_DE_MOCHILA = ['Preta', 'Vermelha', 'Azul', 'Verde', 'Amarela', 'Marrom', 'Laranja', 'Roxa',
  'Branca', 'Cinza', 'Rosa', 'Prateada', 'Dourada'];

/* o arquivo do desenho: o do item, o da mochila pela cor ou, pro papel
   de enredo, o genérico pelo nome (bilhete, foto, mapa, caixa, chave) */
function arquivoDoDesenho(nome){
  if (ITEM_PIXEL[nome]) return ITEM_PIXEL[nome];
  const m = /^(Mochila|Bolsa) (\S+)/.exec(nome);
  if (m && CORES_DE_MOCHILA.includes(m[2])) return m[1].toLowerCase() + '_' + m[2].toLowerCase();
  const n = nome.toLowerCase();
  return /foto/.test(n) ? 'foto'
       : /mapa|croqui|planta/.test(n) ? 'mapa'
       : /caixa|lacre|engradado/.test(n) ? 'caixa'
       : /chave|cart[ãa]o-chave|crach/.test(n) ? 'chave'
       : /bilhete|carta|papel|recibo|folha|caderno|caderneta|relat|ficha|guia|documento|c[óo]pia|lista|anota|passagem|envelope|di[áa]rio|livro|jornal|panfleto|cartaz|recorte|declara|depoimento|p[áa]ginas/.test(n) ? 'papel'
       : 'pacote';
}
function desenhoDoItem(nome){
  const rel = SPRITES_BASE + ITENS_PASTA + 'nossos/' + arquivoDoDesenho(nome) + '.png';
  return (typeof SPRITES_EMBUTIDOS !== 'undefined' && SPRITES_EMBUTIDOS[rel]) || rel;
}

/* ---------- lugares e ações: traço, cor do botão ---------- */
const ICONE = {
  ginasio:'<path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M9 21v-6h6v6"/><circle cx="12" cy="10" r="1.6"/>',
  centro:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><circle cx="12" cy="12" r="2.6"/><path d="M17 5.5h3M18.5 4v3"/>',
  loja:'<path d="M4 8h16l-1.5 12h-13z"/><path d="M8.5 8a3.5 3.5 0 0 1 7 0"/>',
  /* as duas abas do balcão: sacola com +, moeda saindo da mão */
  comprar:'<path d="M4 8h16l-1.5 12h-13z"/><path d="M8.5 8a3.5 3.5 0 0 1 7 0"/><path d="M12 11.5v5M9.5 14h5"/>',
  vender:'<circle cx="15.5" cy="7.5" r="3.5"/><path d="M15.5 6v3"/><path d="M3 15h3l3.5-1.5c1-.4 2 .1 2.3 1l.2.5h-4M6 15v5H3M6 19.5h7.5l6-3.5a1.6 1.6 0 0 0-1.7-2.7L13 15.8"/>',
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
  /* o ponto da rede: o envelope sem timbre */
  rede:'<rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
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
  lua:'<path d="M14.6 3.8a8.4 8.4 0 1 0 5.6 13.9 7.2 7.2 0 0 1-5.6-13.9z"/><path d="M18.6 4.2l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6z"/>',
  telefone:'<path d="M7.2 3.5H5.4c-1 0-1.9.9-1.8 1.9.6 7.6 6.6 13.6 14.2 14.2 1 .1 1.9-.8 1.9-1.8v-1.8c0-.7-.5-1.3-1.2-1.5l-2.6-.6c-.6-.1-1.2.1-1.5.6l-.8 1.1c-2.4-1.1-4.3-3-5.4-5.4l1.1-.8c.5-.4.7-1 .6-1.5l-.6-2.6c-.2-.7-.8-1.2-1.5-1.2z"/>',
  cartao:'<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="8.5" cy="12" r="2"/><path d="M14 10h5M14 13h4M14 16h3"/>',
  /* os comandos da luta: o time é a Pokébola, fugir é correr, o
     Desistir é a bandeira branca e a Vontade é a chama */
  bola:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h5.4M15.1 12h5.4"/><circle cx="12" cy="12" r="3.1"/>',
  correr:'<circle cx="15" cy="4.6" r="1.7"/><path d="M13.6 7.6L11 13M7.6 9.8l4.2-1.8 3.4 2.6 2.8-.4M11 13l3.4 2.6-.6 4.6M11 13l-2.1 3.6-3.6.6M2.5 9.5h3M2 13h2.5"/>',
  bandeira:'<path d="M6 21V3.5"/><path d="M6 4.6c3-1.7 5.5 1.7 8.5 0s4-1 4-1v8.2s-1-.6-4 1-5.5-1.7-8.5 0"/>',
  chama:'<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.3 2.4-5 3.6-7.6.9 1.6 1.4 2.8 1.4 4 1.4-1.2 2.3-3.4 2.1-6.2 3.4 2.3 5.9 5.8 5.9 9.8 0 3.6-2.6 6.2-6.5 6.2z"/><path d="M12 21c-1.6 0-2.8-1.1-2.8-2.7 0-1.6 1.3-2.5 2.2-3.9.9 1.4 3.4 2.3 3.4 3.9 0 1.6-1.2 2.7-2.8 2.7z"/>',
  /* o alto da tela: onde, que horas, dinheiro, Ração, diário e ajustes */
  alfinete:'<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  relogio:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  moeda:'<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2c-.6-.9-1.6-1.4-2.8-1.4-1.6 0-2.8.9-2.8 2.1 0 2.9 5.8 1.4 5.8 4.3 0 1.2-1.2 2.1-2.9 2.1-1.3 0-2.4-.6-3-1.5M12 6.2v1.6M12 16.3v1.6"/>',
  tigela:'<path d="M3.5 11h17a8.5 8.5 0 0 1-17 0z"/><path d="M8 8.5c1-1 2.5-1.5 4-1.5s3 .5 4 1.5"/>',
  diario:'<path d="M12 6.5c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5z"/><path d="M12 6.5V20.5"/>',
  /* salvar é o disquete (baixa o save num .json); carregar, o arquivo
     subindo da bandeja */
  salvar:'<path d="M5 3.5h11.5l4 4V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5z"/><path d="M8 3.5v5h7.5v-5M7 20.5v-6h10v6"/>',
  carregar:'<path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15"/><path d="M12 15.5V4.5M7.5 9L12 4.5 16.5 9"/>',
  engrenagem:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.6"/><path d="M12 2.6v2.8M12 18.6v2.8M2.6 12h2.8M18.6 12h2.8M5.4 5.4l2 2M16.6 16.6l2 2M5.4 18.6l2-2M16.6 7.4l2-2"/>',
  /* o dado da ficha de inscrição: sorteia uma sugestão */
  dado:'<rect x="4" y="4" width="16" height="16" rx="3.5"/><circle cx="8.6" cy="8.6" r=".9" fill="currentColor"/><circle cx="15.4" cy="8.6" r=".9" fill="currentColor"/><circle cx="12" cy="12" r=".9" fill="currentColor"/><circle cx="8.6" cy="15.4" r=".9" fill="currentColor"/><circle cx="15.4" cy="15.4" r=".9" fill="currentColor"/>',
  /* o menu da história: a placa de estrada (a seta gira pro lado em
     que o lugar fica no mapa), parar e olhar, o capítulo que espera
     aqui e perguntar o nome de quem fala */
  seta:'<path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5"/>',
  /* duas aves no céu: o voo do mapa (Campo.voar) */
  voar:'<path d="M2.5 9.5c2.4-1.6 5-1.8 7.5 0 2.5-1.8 5.1-1.6 7.5 0"/><path d="M6 15.5c1.6-1 3.3-1.1 5 0 1.7-1.1 3.4-1 5 0"/>',
  olho:'<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  exclama:'<path d="M12 4.5v10"/><circle cx="12" cy="19" r="1.1" fill="currentColor"/>',
  pergunta:'<path d="M4 5h16v11H10l-4 3.5V16H4z"/><path d="M10.2 8.6a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1v.4"/><circle cx="12" cy="13.6" r=".7" fill="currentColor"/>',
  /* os avisos do que a escolha mudou: cura, alerta, luto (a vela da
     vigília da Torre), o mundo, uma nota e o brilho da evolução */
  cura:'<rect x="4" y="4" width="16" height="16" rx="4.5"/><path d="M12 8v8M8 12h8"/>',
  alerta:'<path d="M12 3.8L21.2 19.8H2.8z"/><path d="M12 10v4.6"/><circle cx="12" cy="17.1" r=".95" fill="currentColor"/>',
  luto:'<path d="M8.5 21h7M10 21V11.5h4V21"/><path d="M12 11.5V9.4"/><path d="M12 9c-1.4-1-1.4-2.7 0-4.3 1.4 1.6 1.4 3.3 0 4.3z"/>',
  mundo:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.7 5.2 3.7 8.5s-1.2 6.1-3.7 8.5c-2.5-2.4-3.7-5.2-3.7-8.5s1.2-6.1 3.7-8.5z"/>',
  info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.4"/><circle cx="12" cy="7.9" r=".95" fill="currentColor"/>',
  brilho:'<path d="M11 3.5c.6 4.3 1.9 5.6 6.2 6.2-4.3.6-5.6 1.9-6.2 6.2-.6-4.3-1.9-5.6-6.2-6.2 4.3-.6 5.6-1.9 6.2-6.2z"/><path d="M18 14.6c.3 1.7.8 2.2 2.5 2.5-1.7.3-2.2.8-2.5 2.5-.3-1.7-.8-2.2-2.5-2.5 1.7-.3 2.2-.8 2.5-2.5z"/>'
};

/* A cor de cada desenho no menu: a porta na cor da casa, como o
   ícone do mapa dos jogos de hoje (Centro vermelho, loja azul, ginásio
   dourado, a sua casa verde), e a ação na cor do que ela é. Quem lê é
   o CSS, pela variável --ac; desenho sem cor fica na cor da linha. */
const COR_DO_ICONE = {
  centro:'#ef5350', loja:'#3d8bfd', ginasio:'#e8b923', casa:'#43b581', laboratorio:'#26c6da',
  onibus:'#2bb3a3', doar:'#f06292', relembrar:'#9575cd', liga:'#b18cf0', torneio:'#ff8a3d',
  credenciais:'#7e8ce0', rede:'#c2414f', porta:'#8d97bd', ferragem:'#d4893b',
  procurar:'#4caf50', vasculhar:'#f0b429', andar:'#4fc3f7', conversar:'#f48fb1', treinar:'#ff7043',
  pescar:'#42a5f5', acampar:'#c49a6c', esperar:'#90a4ae', lutar:'#ef5350', troca:'#26a69a',
  agenda:'#ffca28', convite:'#ffb74d', revanche:'#ff7043', trancado:'#7d88a8',
  mural:'#ffb74d', pc:'#4dd0e1', mapa:'#66bb6a', dormir:'#7986cb', diario:'#e8b923',
  bola:'#4cc38a', pokedex:'#ef5350', itens:'#d9a35b', telefone:'#43b581', lua:'#b39ddb',
  seta:'#5aa7ff', voar:'#9fa8ff', alfinete:'#ffd54f', olho:'#90caf9', pergunta:'#8c9eff', dado:'#4dd0e1', chama:'#a77bff', tigela:'#d9a35b',
  salvar:'#64b5f6', carregar:'#81c784'
};

/* estilo: mais alguma coisa inline (a seta da placa gira por ele) */
function svgIcone(chave, cls, estilo){
  const c = ICONE[chave];
  if (!c) return '';
  const cor = COR_DO_ICONE[chave];
  const st = [cor ? '--ac:' + cor : '', estilo || ''].filter(Boolean).join(';');
  return `<svg class="icone${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${st ? ` style="${st}"` : ''}>${c}</svg>`;
}
function corDoIcone(chave){ return COR_DO_ICONE[chave] || ''; }

/* o ícone de cada coisa da lista de um lugar, pelo id do afazer */
function iconeDoAfazer(a){
  const id = String(a.id || '');
  const direto = {centro:'centro', loja:'loja', ginasio:'ginasio', casa:'casa', liga:'liga', torneio:'torneio',
    onibus:'onibus', doar:'doar', relembrar:'relembrar', vasculhar:'vasculhar', procurar:'procurar', andar:'andar',
    conversar:'conversar', treinar:'treinar', pescar:'pescar', acampar:'acampar', esperar:'esperar', desafiar:'lutar', troca:'troca',
    rede:'rede'};
  if (direto[id]) return direto[id];
  if (/^posto_/.test(id)) return 'credenciais';
  if (/^vet_/.test(id)) return 'lutar';
  if (/^conv_/.test(id)) return 'convite';
  if (/^rev_/.test(id)) return 'revanche';
  if (/^ag_/.test(id)) return 'agenda';
  if (/^barr_/.test(id)) return 'lutar';
  if (id === 'lab_fossil') return 'laboratorio';
  if (id === 'lab_premios') return 'loja';
  if (/^idade_/.test(id)) return 'porta';
  if (/^intu_/.test(id)) return 'lua';
  if (/^tit_/.test(id)) return 'porta';
  const t = String(a.titulo || '').toLowerCase();
  if (/laborat/.test(t)) return 'laboratorio';
  if (/ferragem/.test(t)) return 'ferragem';
  if (/loja|mercado|bazar|armaz/.test(t)) return 'loja';
  return 'porta';
}
