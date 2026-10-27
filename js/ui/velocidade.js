/* ============================================================
   VELOCIDADE DA LUTA — 1×, 2× ou 3×
   Quem joga escolhe no botão do canto da arena (ou nos Ajustes), e a
   escolha fica neste navegador ('jc-vel-luta'). Só a encenação anda
   mais rápido: o turno, os dados e a conta são os mesmos, nada é
   pulado, tudo só dura menos.

   Todo tempo da luta passa por aqui:
   - espera (setTimeout): Velocidade.ms(ms);
   - Web Animations: Velocidade.acelerar(el.animate(…)), que põe o
     playbackRate — atraso e duração encolhem juntos e o `finished`
     chega na hora certa, sem mexer em conta nenhuma de quadro;
   - CSS da luta: a variável --vel-luta, posta na raiz
     (calc(.55s / var(--vel-luta, 1))); só regra da luta lê.
   Loop sem fim (a respiração, a chuva caindo) fica no ritmo dele: é o
   Pokémon parado, não a luta andando.
   ============================================================ */
const VELOCIDADES_DA_LUTA = [1, 2, 3];

const Velocidade = {
  _f: 0,
  fator(){
    if (!this._f){
      let v = 1;
      try { v = Number(localStorage.getItem('jc-vel-luta')) || 1; } catch (e) {}
      this._f = VELOCIDADES_DA_LUTA.includes(v) ? v : 1;
    }
    return this._f;
  },
  /* uma espera da luta, na velocidade escolhida */
  ms(t){ return t / this.fator(); },
  /* a animação que acabou de nascer anda na velocidade escolhida */
  acelerar(anim){
    if (anim && this.fator() !== 1) anim.playbackRate = this.fator();
    return anim;
  },
  definir(v){
    if (!VELOCIDADES_DA_LUTA.includes(v)) return;
    this._f = v;
    try { localStorage.setItem('jc-vel-luta', String(v)); } catch (e) {}
    this.aplicar();
  },
  /* o botão da arena gira: 1× → 2× → 3× → 1× */
  proxima(){
    const L = VELOCIDADES_DA_LUTA;
    return L[(L.indexOf(this.fator()) + 1) % L.length];
  },
  alternar(){ this.definir(this.proxima()); },

  /* A escolha vale na hora: a variável do CSS, os botões que estão na
     tela e o que já está andando na arena — apertar no meio do golpe
     acelera o golpe. Animação de CSS lê a variável sozinha; a de
     Web Animations troca de ritmo aqui. */
  aplicar(){
    if (typeof document === 'undefined' || !document.documentElement) return;
    const f = this.fator();
    document.documentElement.style.setProperty('--vel-luta', f);
    document.querySelectorAll('.vel-luta').forEach(b => {
      b.dataset.vel = f;
      b.setAttribute('aria-label', this.rotulo());
      const n = b.querySelector('.vel-n'); if (n) n.textContent = f + '×';
    });
    document.querySelectorAll('.ajuste-vel [data-vel]').forEach(b => {
      const sel = Number(b.dataset.vel) === f;
      b.classList.toggle('sel', sel); b.setAttribute('aria-checked', sel);
    });
    const a = document.getElementById('arena');
    if (!a || !a.getAnimations) return;
    for (const x of a.getAnimations({subtree:true})){
      if ('animationName' in x || 'transitionProperty' in x) continue;
      const t = x.effect && x.effect.getTiming ? x.effect.getTiming() : null;
      if (!t || t.iterations === Infinity) continue;
      try { x.updatePlaybackRate(f); } catch (e) {}
    }
  },

  rotulo(){ return `Velocidade da luta: ${this.fator()}×. Tocar muda pra ${this.proxima()}×.`; },
  /* No canto da arena, fora dos comandos: o menu fica apagado enquanto
     o turno é encenado, e é justo aí que se quer apertar. As três setas
     são o marcador — acendem tantas quantas a velocidade. */
  botao(){
    const f = this.fator();
    return `<button type="button" class="vel-luta" data-vel="${f}" onclick="Velocidade.alternar()"
      aria-label="${this.rotulo()}" title="Velocidade da luta"><span class="vel-setas" aria-hidden="true"><i></i><i></i><i></i></span><b class="vel-n">${f}×</b></button>`;
  },
  /* a mesma escolha nos Ajustes, com as três à vista */
  ajustes(){
    const f = this.fator();
    return `<h3>Luta</h3>
      <div class="ajuste-vel">
        <div class="ajuste-vel-linha">
          <span class="ajuste-vel-rot" id="vel-rot">Velocidade da luta</span>
          <div class="vel-opcoes" role="radiogroup" aria-labelledby="vel-rot">
            ${VELOCIDADES_DA_LUTA.map(v => `<button type="button" role="radio" data-vel="${v}" class="${v === f ? 'sel' : ''}"
              aria-checked="${v === f}" onclick="Velocidade.definir(${v})">${v}×</button>`).join('')}
          </div>
        </div>
        <p class="sussurro">Golpes, bolas, barras e entradas andam mais rápido; os dados e a conta são os mesmos. O botão no canto da arena muda isso no meio da luta.</p>
      </div>`;
  }
};

Velocidade.aplicar();
