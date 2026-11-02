/* ============================================================
   TAMANHO DA LETRA — a letra de ler
   Quem joga escolhe nos Ajustes (Pequena, Normal, Grande, Maior), e a
   escolha fica neste navegador ('jc-letra'). Cresce o que se lê: a
   história, as falas, as opções, a descrição do lugar, os avisos e a
   conversa do PokéNav. Quem manda é a variável --letra-ler, posta na
   raiz, que o CSS usa como zoom desses blocos: o rosto do balão e a
   bolinha da tecla crescem junto, e a caixa não desanda. O alto da
   tela, a luta, as fichas e as janelas de número ficam do tamanho
   delas, porque são de relance.
   ============================================================ */
const TAMANHOS_DA_LETRA = [
  {id:'pequena', nome:'Pequena', f:.9},
  {id:'normal',  nome:'Normal',  f:1},
  {id:'grande',  nome:'Grande',  f:1.15},
  {id:'maior',   nome:'Maior',   f:1.3}
];

const Letra = {
  atual(){
    let v = null;
    try { v = localStorage.getItem('jc-letra'); } catch (e) {}
    return TAMANHOS_DA_LETRA.some(t => t.id === v) ? v : 'normal';
  },
  fator(id){
    return (TAMANHOS_DA_LETRA.find(t => t.id === (id || this.atual())) || {f:1}).f;
  },
  aplicar(){
    const raiz = typeof document !== 'undefined' && document.documentElement;
    if (raiz && raiz.style && typeof raiz.style.setProperty === 'function')
      raiz.style.setProperty('--letra-ler', String(this.fator()));
  },
  definir(id){
    if (!TAMANHOS_DA_LETRA.some(t => t.id === id)) return;
    try { localStorage.setItem('jc-letra', id); } catch (e) {}
    this.aplicar();
    document.querySelectorAll('.letra-opcoes button').forEach(b => {
      const sel = b.dataset.letra === id;
      b.classList.toggle('sel', sel);
      b.setAttribute('aria-checked', String(sel));
    });
  },
  /* a escolha nos Ajustes, com uma amostra que cresce na hora */
  ajustes(){
    const a = this.atual();
    return `<h3>Leitura</h3>
      <div class="ajuste-vel ajuste-letra">
        <div class="ajuste-vel-linha">
          <span class="ajuste-vel-rot" id="letra-rot">Tamanho da letra</span>
          <div class="vel-opcoes letra-opcoes" role="radiogroup" aria-labelledby="letra-rot">
            ${TAMANHOS_DA_LETRA.map(t => `<button type="button" role="radio" data-letra="${t.id}" class="${t.id === a ? 'sel' : ''}"
              aria-checked="${t.id === a}" onclick="Letra.definir('${t.id}')">${t.nome}</button>`).join('')}
          </div>
        </div>
        <div class="narrativa letra-amostra"><p>A Rota 1 sai de Pallet pelo norte, entre cercas baixas e mato alto. Um Pidgey levanta do capim quando você passa.</p></div>
        <p class="sussurro">Muda a história, as falas, as opções e os avisos. O alto da tela, a luta e as fichas ficam do tamanho delas.</p>
      </div>`;
  }
};

Letra.aplicar();
