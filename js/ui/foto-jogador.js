/* ============================================================
   A FOTO DO JOGADOR — a mesma foto, nas cores que você escolheu
   A foto (js/data/fotos-jogador.js, gerado por
   ferramentas/fotos-do-jogador.py) é um PNG de paleta em que cada cor
   de cada parte (cabelo, olhos, pele, camisa, calça, sapatos e
   detalhes) tem casa própria. Trocar a cor é escrever
   as cores novas nessas casas e refazer o CRC do pedaço da paleta
   (PLTE): o desenho não muda um pixel, e a imagem sai como data: sem
   passar por canvas, que em file:// suja e não deixa ler de volta.
   A cor nova é a escala da cor escolhida (CORES_DA_FOTO, em
   inscricao.js), no mesmo ponto do escuro ao claro em que a cor do
   desenho estava, então sombra e brilho ficam onde o artista pôs.
   ============================================================ */
const FotoJogador = {
  _cache: new Map(),
  _tabela: null,

  /* matiz, claro e saturação (0 a 1) → [r, g, b] de 0 a 255; a conta
     do colorsys.hls_to_rgb do Python, que o gerador usa pra conferir */
  rgb(h, l, s){
    if (!s){ const v = Math.round(l * 255); return [v, v, v]; }
    const m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
    const m1 = 2 * l - m2;
    const canal = x => {
      x = ((x % 1) + 1) % 1;
      const v = x < 1 / 6 ? m1 + (m2 - m1) * x * 6
              : x < .5    ? m2
              : x < 2 / 3 ? m1 + (m2 - m1) * (2 / 3 - x) * 6
              : m1;
      return Math.round(Math.min(1, Math.max(0, v)) * 255);
    };
    return [canal(h + 1 / 3), canal(h), canal(h - 1 / 3)];
  },
  /* a cor no ponto t (0 o escuro, 1 o claro) da escala de uma cor da lista */
  naEscala(cor, t){
    return this.rgb(cor.h / 360, cor.l[0] + (cor.l[1] - cor.l[0]) * t, cor.s);
  },
  /* a amostra da cor na ficha: o claro e o escuro dela, em CSS */
  amostra(cor){
    const css = c => `rgb(${c.join(',')})`;
    return `linear-gradient(135deg, ${css(this.naEscala(cor, .85))}, ${css(this.naEscala(cor, .5))} 55%, ${css(this.naEscala(cor, .12))})`;
  },

  crc(b, de, ate){
    if (!this._tabela){
      this._tabela = new Uint32Array(256);
      for (let n = 0; n < 256; n++){
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
        this._tabela[n] = c >>> 0;
      }
    }
    let c = 0xFFFFFFFF;
    for (let i = de; i < ate; i++) c = this._tabela[(c ^ b[i]) & 255] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  },

  /* a foto como veio, do arquivo */
  original(arq){
    return typeof caminhoNPC === 'function' ? caminhoNPC(PASTA_DOS_RETRATOS + arq) : PASTA_DOS_RETRATOS + arq;
  },

  /* o endereço da foto nas cores escolhidas ({cabelo, olhos, pele, camisa,
     calca, sapatos, detalhes}, ids de CORES_DA_FOTO; o que falta fica
     como o desenho tem) */
  url(arq, cores){
    const f = typeof FOTOS_DO_JOGADOR !== 'undefined' && FOTOS_DO_JOGADOR[arq];
    const ok = coresDaFotoValidas(arq, cores);
    const partes = PARTES_DA_FOTO.map(([p]) => p).filter(p => ok[p]);
    if (!f || !partes.length) return this.original(arq);
    const chave = arq + '|' + partes.map(p => p + ':' + ok[p]).join('|');
    if (this._cache.has(chave)) return this._cache.get(chave);
    let url = this.original(arq);
    try {
      const bin = atob(f.png);
      const b = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
      /* os pedaços do PNG: tamanho, tipo, dados e CRC; acha a paleta */
      let p = 8, plte = -1, tam = 0;
      while (p + 8 <= b.length){
        const n = ((b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3]) >>> 0;
        if (b[p + 4] === 0x50 && b[p + 5] === 0x4C && b[p + 6] === 0x54 && b[p + 7] === 0x45){ plte = p; tam = n; break; }
        p += 12 + n;
      }
      if (plte < 0) throw new Error('foto sem paleta');
      for (const parte of partes){
        const cor = corDaFoto(parte, ok[parte]);
        for (const [casa, t] of f[parte].i){
          const o = plte + 8 + casa * 3;
          if (o + 2 >= plte + 8 + tam) continue;
          const [r, g, bl] = this.naEscala(cor, t);
          b[o] = r; b[o + 1] = g; b[o + 2] = bl;
        }
      }
      const c = this.crc(b, plte + 4, plte + 8 + tam);
      const o = plte + 8 + tam;
      b[o] = c >>> 24; b[o + 1] = (c >>> 16) & 255; b[o + 2] = (c >>> 8) & 255; b[o + 3] = c & 255;
      let s = '';
      for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192));
      url = 'data:image/png;base64,' + btoa(s);
    } catch (e) {
      /* foto que não abre fica como veio: melhor a cor do desenho que foto nenhuma */
    }
    this._cache.set(chave, url);
    return url;
  },

  /* a foto de quem joga, pelo save (que pode ter vindo de arquivo de
     outra pessoa: só passa foto e cor que existem) */
  doSave(j){
    if (!j || typeof j.retrato !== 'string' || !/^[\w\/.-]+$/.test(j.retrato)) return null;
    const arq = j.retrato.startsWith(PASTA_DOS_RETRATOS) ? j.retrato.slice(PASTA_DOS_RETRATOS.length) : null;
    if (arq && retratoDaFicha(arq) && j.retratoCores) return this.url(arq, j.retratoCores);
    return typeof caminhoNPC === 'function' ? caminhoNPC(j.retrato) : null;
  }
};
