/* ============================================================
   SAVE EM ARQUIVO — a jornada num .json
   O jogo se salva sozinho no navegador (Estado.salvar, a cada passo,
   por cima do anterior). O arquivo é uma cópia desse save com uma
   etiqueta por fora — {jogo, formato, salvoEm, save, finais} —, pra
   continuar noutro aparelho ou noutro navegador, ou guardar uma de
   reserva. O códice de finais não é da jornada, é do navegador, mas
   vai junto: quem muda de aparelho não perde o que já descobriu.

   O Salvar do alto da tela (e dos Ajustes) baixa (UI.modalSalvar); o
   Carregar jogo da abertura lê de volta (UI.modalCarregar). O arquivo
   lido entra no lugar do save automático e quem segue é o
   Jogo.continuar, como num recarregar: a conversão de save velho
   (Estado.abrir) e a luta pela metade (LutaSalva.retomar) valem igual.
   ============================================================ */
const ArquivoSave = {
  MARCA: 'PokéRPG',
  /* sobe quando o jeito de guardar mudar de um modo que a conversão do
     Estado.abrir não cobre: arquivo de formato maior que o do jogo é
     recusado, com o motivo */
  FORMATO: 1,

  /* o save de agora, com a luta se tiver uma (o Estado.salvar passa
     pelo LutaSalva.anotar antes de gravar) */
  montar(){
    Estado.salvar('auto');
    return {jogo:this.MARCA, formato:this.FORMATO, salvoEm:new Date().toISOString(), save:Estado.dados,
            finais:Estado.finaisDescobertos()};
  },
  texto(){ return JSON.stringify(this.montar(), null, 1); },

  /* pokerpg-lia-cap12-2026-10-27-1403.json: de quem, até onde e quando */
  nomeDoArquivo(d){
    d = d || Estado.dados;
    const quem = String((d && d.jogador && d.jogador.nome) || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'jornada';
    const cap = String((d && d.capitulo) || 0).replace('.', '-');
    const t = new Date(), z = n => String(n).padStart(2, '0');
    return `pokerpg-${quem}-cap${cap}-${t.getFullYear()}-${z(t.getMonth() + 1)}-${z(t.getDate())}-${z(t.getHours())}${z(t.getMinutes())}.json`;
  },

  /* Baixa pelo navegador e devolve o nome do arquivo, ou null se nem
     deu pra montar. O navegador ainda pode barrar o download calado (a
     página publicada barra): por isso a janela também copia o texto. */
  baixar(){
    try {
      const nome = this.nomeDoArquivo();
      const url = URL.createObjectURL(new Blob([this.texto()], {type:'application/json'}));
      const a = document.createElement('a');
      a.href = url; a.download = nome; a.style.display = 'none';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      return nome;
    } catch(e){ return null; }
  },

  /* copia pro que o navegador deixar: a área de transferência, ou o
     comando antigo de copiar numa caixa de texto escondida */
  async copiar(texto){
    try { await navigator.clipboard.writeText(texto); return true; } catch(e){}
    try {
      const ta = document.createElement('textarea');
      ta.value = texto; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.top = '0'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return !!ok;
    } catch(e){ return false; }
  },

  /* Lê o texto de um arquivo: {dados, salvoEm, finais} ou {erro}, com
     o motivo dito pra quem joga. Aceita o arquivo do Salvar (com a
     etiqueta) e o save cru, do jeito que o navegador guarda. */
  ler(texto){
    let obj;
    try { obj = JSON.parse(String(texto == null ? '' : texto).replace(/^﻿/, '').trim()); }
    catch(e){ return {erro:'O arquivo não é um JSON inteiro: falta um pedaço, ou ele foi editado e quebrou.'}; }
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {erro:'Esse arquivo não é um save do PokéRPG.'};
    let d = obj, salvoEm = null, finais = [];
    if ('save' in obj || 'jogo' in obj){
      if (obj.jogo !== this.MARCA || !obj.save || typeof obj.save !== 'object') return {erro:'Esse arquivo não é um save do PokéRPG.'};
      if (+obj.formato > this.FORMATO) return {erro:'Esse save foi feito numa versão mais nova do jogo. Abra ele na versão nova.'};
      d = obj.save;
      if (typeof obj.salvoEm === 'string' && !isNaN(Date.parse(obj.salvoEm))) salvoEm = obj.salvoEm;
      if (Array.isArray(obj.finais)) finais = obj.finais.filter(f => f && typeof f.id === 'string' && typeof f.titulo === 'string');
    }
    const falta = this.falta(d);
    if (falta) return {erro:`Esse arquivo não é um save inteiro: ${falta}.`};
    if (this.temCodigo(d) || this.temCodigo(finais)) return {erro:'Esse arquivo tem código escondido no meio do texto. O jogo não carrega save assim.'};
    return {dados:d, salvoEm, finais};
  },

  /* o mínimo que um save tem, com o motivo do que faltou */
  falta(d){
    if (!d || typeof d !== 'object' || Array.isArray(d)) return 'não tem jornada dentro';
    if (!d.jogador || typeof d.jogador !== 'object' || typeof d.jogador.nome !== 'string') return 'falta o treinador';
    if (!Array.isArray(d.time)) return 'falta o time';
    if (!d.itens || typeof d.itens !== 'object' || Array.isArray(d.itens)) return 'falta a mochila';
    if (!d.flags || typeof d.flags !== 'object') return 'falta o que já aconteceu na história';
    for (const k of ['pc', 'cemiterio']) if (d[k] != null && !Array.isArray(d[k])) return 'o PC está danificado';
    for (const p of [].concat(d.time, d.pc || [], d.cemiterio || []))
      if (!p || typeof p !== 'object' || !Number.isInteger(p.dex) || !(typeof DEX === 'undefined' || DEX[p.dex])
          || typeof p.uid !== 'string' || !/^[\w.:-]{1,80}$/.test(p.uid))
        return 'um dos Pokémon está danificado';
    return null;
  },

  /* Texto do save vai pra tela de muitos jeitos, e o arquivo pode ter
     vindo de outra pessoa: etiqueta de HTML ou gatilho de script em
     qualquer texto (ou nome de campo) recusa o arquivo inteiro. Save
     de verdade não guarda nada disso. */
  temCodigo(v){
    const RUIM = /<\s*\/?\s*[a-z!?]|\bon[a-z]+\s*=|javascript\s*:/i;
    const andar = (x, fundo) => {
      if (typeof x === 'string') return RUIM.test(x);
      if (!x || typeof x !== 'object') return false;
      if (fundo > 60) return true;
      for (const k of Object.keys(x)) if (RUIM.test(k) || andar(x[k], fundo + 1)) return true;
      return false;
    };
    return andar(v, 0);
  },

  /* a jornada que está num lugar do navegador, pra dizer o que vai sair */
  doNavegador(slot='auto'){
    return Estado.saveCru(slot);
  },

  /* O arquivo entra no lugar do save do navegador e a jornada segue
     como num recarregar; o códice do arquivo soma com o daqui.
     Navegador que não deixa gravar roda a jornada direto da memória
     (devolve false, e o Jogo.continuar avisa pra salvar antes de
     fechar). */
  usar(dados, finais, jornada){
    if (jornada) Estado.usarJornada(jornada);
    Estado.somarFinais(finais);
    const gravou = Estado.gravar(dados);
    if (typeof UI !== 'undefined' && UI.fecharModal) UI.fecharModal(true);
    Jogo.continuar(gravou ? null : dados);
    return gravou;
  }
};
