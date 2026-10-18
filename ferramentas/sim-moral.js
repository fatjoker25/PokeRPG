/* ============================================================
   SIMULADOR DE MORAL E FOME
   Anda a história do capítulo 1 ao 20 com o motor do jogo (cenas,
   escolhas ao acaso, testes e lutas resolvidos no sorteio, o relógio
   andando como anda pra quem lê) e mede, no fim de cada capítulo, a
   moral do time, quanto a história tirou, quanto a fome tirou, quanto
   entrou, quantas Rações o time comeu e a chance de desobedecer.

   Dois jogadores: o cuidadoso sai de todo Centro com três Rações na
   mochila; o distraído nunca compra. Entre um capítulo e outro, os
   dois andam de 4 a 10 horas e param num Centro sete vezes em dez.

   Uso:  node ferramentas/sim-moral.js [voltas por jogador]

   O alvo (o pedido foi "importante, mas sem atrapalhar"): moral média
   entre 50 e 90 a jornada inteira, desobediência pela moral abaixo
   de 3%, e a fome só aparecendo pra quem anda sem Ração.
   ============================================================ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const raiz = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
global.window = {addEventListener(){}, removeEventListener(){}};
global.document = {addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; }, querySelectorAll(){ return []; }, body:{classList:{add(){}, remove(){}, toggle(){}}}, documentElement:{style:{setProperty(){}}}};
global.localStorage = {getItem(){ return null; }, setItem(){}, removeItem(){}};
for (const m of html.matchAll(/<script src="([^"]+)"/g)){ if (m[1].startsWith('http')) continue; vm.runInThisContext(fs.readFileSync(path.join(raiz, m[1]), 'utf8'), {filename:m[1]}); }

const VOLTAS = +process.argv[2] || 60;
Estado.salvar = () => true;
const PERFIS = {cuidadoso:{racao:3}, distraido:{racao:0}};
/* insígnias típicas de quem chega a cada capítulo */
const INSIGNIAS = n => Math.min(8, Math.floor((n + 1) / 2.2));
const med = a => a.length ? +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : 0;

for (const nomePerfil in PERFIS){
  const perfil = PERFIS[nomePerfil];
  const porCap = {};
  for (let v = 0; v < VOLTAS; v++){
    Estado.novo({nome:'Sim', genero:v % 2 ? 'Homem' : 'Mulher', cidade:'Pallet', casaNome:'Ivo', casaQuem:'pai',
      nascimento:{dia:3, mes:9}, objetivo:'Ver o Planalto Indigo de perto', personalidade:'teimosa e curiosa'});
    const d = Estado.dados;
    d.time = [criarPokemon(7, 8, {moral:50})];
    Fome.alimentarTime();
    const vivos = () => d.time.filter(x => !x.morto);
    const media = () => vivos().reduce((a, x) => a + x.moral, 0) / Math.max(1, vivos().length);
    let cap = 1, guarda = 0;
    while (cap && cap <= 20 && guarda++ < 60){
      /* quem entra pro time pelo caminho chega como se chega: capturado */
      if ((cap === 3 || cap === 6) && d.time.length < 3){ const n = criarPokemon(16, 10 + cap * 2, {moral:40}); Fome.alimentar(n); d.time.push(n); }
      const acc = porCap[cap] = porCap[cap] || {moral:[], min:[], desob:[], historia:[], fome:[], ganho:[], racoes:[]};
      let perdaHist = 0, perdaFome = 0, ganho = 0, racoes = 0;
      const aplicarOrig = Historia.aplicar;
      Historia.aplicar = function(ef){
        const a = media(); let res = [];
        try { res = aplicarOrig.call(Historia, ef); } catch (e){}
        const b = media(); if (b < a) perdaHist += a - b; else ganho += b - a;
        return res;
      };
      const passarOrig = Fome.passar;
      Fome.passar = function(){
        const a = media(), r0 = Estado.contaItem('Ração');
        const res = passarOrig.call(Fome);
        const b = media(); if (b < a) perdaFome += a - b; else ganho += b - a;
        racoes += Math.max(0, r0 - Estado.contaItem('Ração'));
        return res;
      };
      let cena = null;
      try { cena = Historia.iniciarCapitulo(cap); } catch (e){ cena = null; }
      let passos = 0;
      while (cena && passos++ < 400){
        const c = Historia.capAtual.cenas[cena.id];
        /* ler uma cena leva uns quarenta segundos: dois terços de hora do relógio */
        if (Math.random() < 0.65) Relogio.avancar(1);
        if (c.fim || c.final) break;
        let prox = null;
        if (c.teste){
          const g = Dados.escolher(['critico', 'sucesso', 'sucesso', 'parcial', 'falha']);
          prox = c.teste[g] || c.teste.sucesso || c.teste.falha;
        } else if (c.batalha){
          prox = Math.random() < 0.85 ? c.batalha.vitoria : (c.batalha.derrota || c.batalha.vitoria);
        } else {
          const ops = (c.escolhas || []).map((e, i) => ({e, i}))
            .filter(o => { try { return Historia.disponivel(o.e, cena.id, o.i); } catch (er){ return false; } });
          if (!ops.length) break;
          const o = Dados.escolher(ops);
          Historia.marcarEscolha(cena.id, o.i);
          if (o.e.ef) Historia.aplicar(o.e.ef);
          prox = typeof o.e.vai === 'function' ? o.e.vai(d) : o.e.vai;
        }
        if (!prox || prox === 'gameover') break;
        try { cena = Historia.ir(prox, true); } catch (er){ cena = null; }
      }
      Historia.aplicar = aplicarOrig;
      Fome.passar = passarOrig;
      /* fecha o capítulo e anda até o próximo: estrada, e às vezes um Centro */
      try { Historia.fecharCapitulo(); } catch (e){}
      const a0 = media(), r0 = Estado.contaItem('Ração');
      Relogio.avancar(Dados.entre(4, 10));
      if (Math.random() < 0.7){
        d.time.forEach(x => curarTotal(x));
        const falta = perfil.racao - Estado.contaItem('Ração');
        if (falta > 0) Estado.darItem('Ração', falta);
      }
      const a1 = media();
      if (a1 < a0) perdaFome += a0 - a1; else ganho += a1 - a0;
      racoes += Math.max(0, r0 - Estado.contaItem('Ração'));
      const ins = INSIGNIAS(cap), car = 2;
      const desob = vivos().reduce((a, x) => a + Math.max(0, (60 - x.moral) / 2 - ins * 3 - car * 1.5) + Fome.distrai(x), 0) / Math.max(1, vivos().length);
      acc.moral.push(media()); acc.min.push(Math.min(...vivos().map(x => x.moral)));
      acc.desob.push(desob); acc.historia.push(perdaHist); acc.fome.push(perdaFome); acc.ganho.push(ganho); acc.racoes.push(racoes);
      cap = Historia.proximoCapitulo(false);
      if (cap && cap !== Math.floor(cap)) cap = Math.floor(cap) + 1;   // caminho: segue a linha principal
    }
  }
  console.log(`\n== ${nomePerfil} (${VOLTAS} jornadas) ==`);
  console.log('cap  moral   min  desob%  −hist  −fome  +ganho  rações');
  Object.keys(porCap).sort((a, b) => a - b).forEach(k => {
    const a = porCap[k];
    console.log(String(k).padStart(3), String(med(a.moral)).padStart(6), String(med(a.min)).padStart(5), String(med(a.desob)).padStart(7),
      String(med(a.historia)).padStart(6), String(med(a.fome)).padStart(6), String(med(a.ganho)).padStart(7), String(med(a.racoes)).padStart(7));
  });
}
