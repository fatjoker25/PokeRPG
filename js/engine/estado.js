/* ============================================================
   ESTADO — o mundo lembra de tudo
   ============================================================ */
const NIVEIS_BOM = [
  {n:1, nome:'Desconhecido', ef:'Ninguém te conhece.'},
  {n:2, nome:'Familiar',     ef:'Sua cidade te reconhece. Pequenas cortesias.'},
  {n:3, nome:'Reconhecido',  ef:'Descontos, informação de graça, selvagens menos agressivos por perto.'},
  {n:4, nome:'Respeitado',   ef:'NPCs te ouvem antes de agir. Lojas te priorizam.'},
  {n:5, nome:'Famoso',       ef:'Seu nome corre em várias cidades. Convites e rivais.'},
  {n:6, nome:'Admirado',     ef:'Favores sem cobrança. A Liga te consulta. Selvagens fracos fogem de você.'},
  {n:7, nome:'Ídolo Regional', ef:'Cidades te recebem com festa. Cargos oferecidos sem pedir.'},
  {n:8, nome:'Lendário',     ef:'Kanto inteira sabe seu nome. A Liga te trata como autoridade.'}
];
const NIVEIS_RUIM = [
  {n:1, nome:'Desconhecido', ef:'Ninguém te conhece.'},
  {n:2, nome:'Suspeito',     ef:'Olhares desconfiados. Lojistas te observam.'},
  {n:3, nome:'Indesejado',   ef:'NPCs evitam te abordar. Atendimento a contragosto.'},
  {n:4, nome:'Temido',       ef:'Vozes baixam quando você entra. Selvagens atacam primeiro.'},
  {n:5, nome:'Notório',      ef:'NPCs fogem. A Liga manda oficiais "conversar".'},
  {n:6, nome:'Proscrito',    ef:'Banido de cidades. Recompensa por informações sobre você.'},
  {n:7, nome:'Caçado',       ef:'Ordem de detenção ativa. Treinadores da Liga autorizados a te capturar.'},
  {n:8, nome:'Monstro Lendário', ef:'Seu nome é terror. A Elite 4 é mobilizada contra você.'}
];

/* ============================================================
   REPUTAÇÃO — pontos, não degraus
   Consertar a calha da vizinha é uma coisa boa e não é notícia.
   Um nível só muda quando o que você fez foi grande o bastante
   para ser contado, ou aconteceu na frente de quem conta.
   ============================================================ */
/* subir de fama custa: ~30% mais que antes do pedido de deixar mais difícil */
const LIMIARES_REP = [0, 36, 114, 257, 458, 715, 1030, 1430];

/* Gente que, quando está na cena, faz a história correr sozinha.
   Fazer alguma coisa na frente de um deles vale o dobro. */
const TITULOS_INFLUENTES = [
  'líder','lider','conselheir','auditor','diretor','dr.','dra.','professor','professora',
  'curador','chefe','presidente','delegad','capitão','capitao','comissári','comissari',
  'secretári','secretari','juiz','juíza','juiza','prefeit','vereador','coronel','inspetor',
  'repórter','reporter','jornalista'
];
const NOMES_INFLUENTES = [
  'Brock','Misty','Tenente Surge','Erika','Koga','Sabrina','Blaine','Blue','Giovanni',
  'Lance','Giselle','A.J.','Mandi','Red','Rhea Ashford','Maren Kestrel','Dra. Cordell',
  'Curador Fabre','Auditora Brill','Diretor Quince','Conselheira Thistle'
];
function ehInfluente(nome){
  if (!nome) return false;
  if (NOMES_INFLUENTES.includes(nome)) return true;
  const n = String(nome).toLowerCase();
  return TITULOS_INFLUENTES.some(t => n.startsWith(t) || n.includes(' ' + t));
}

const CIDADES = ['Pallet','Viridian','Pewter','Cerulean','Vermilion','Lavender','Celadon','Fuchsia','Saffron','Cinnabar','Indigo'];

/* ============================================================
   QUEM FICA EM CASA
   A pessoa que te acorda no primeiro capítulo e que vai ficar
   esperando notícia. O jogador escolhe nome e parentesco; se
   deixar em branco, a casa ganha alguém mesmo assim, porque
   "alguém lá embaixo" não é personagem, é neblina.
   ============================================================ */
/* Perla não entra: é a vizinha do dezoito, e as duas se falam */
const NOMES_DE_CASA_F = ['Delia','Alma','Dalva','Elda','Flora','Hilda','Nora','Vera'];
const NOMES_DE_CASA_M = ['Aldo','Bruno','Dino','Marco','Otto','Vito'];
const NOMES_DE_CASA = NOMES_DE_CASA_F.concat(NOMES_DE_CASA_M);
const PARENTESCOS_F = ['mãe','avó','tia','irmã mais velha','madrinha'];
const PARENTESCOS_M = ['pai','avô','tio','irmão mais velho','padrinho'];
const PARENTESCOS   = PARENTESCOS_F.concat(PARENTESCOS_M);
/* O que o jogador deixou em branco é sorteado de um jeito que combina
   com o que ele escreveu: nome de mulher não vira "seu tio". */
function casaDaFicha(ficha){
  let nome = (ficha && ficha.casaNome || '').trim();
  let quem = (ficha && ficha.casaQuem || '').trim();
  if (!quem){
    const fem = nome ? !NOMES_DE_CASA_M.includes(nome) && !/o$/i.test(nome) : Math.random() < 0.5;
    quem = Dados.escolher(fem ? PARENTESCOS_F : PARENTESCOS_M);
  }
  if (!nome) nome = Dados.escolher(parentescoEhMulher(quem) ? NOMES_DE_CASA_F : NOMES_DE_CASA_M);
  return {nome, quem};
}
/* Parentesco escrito à mão: mãe, avó, tia, irmã, madrinha, madrasta,
   prima, vizinha… é mulher; o resto é homem. */
function parentescoEhMulher(quem){
  const q = String(quem || '').trim().toLowerCase();
  /* \b não serve: pra regex, o ô de "avô" não é letra e a borda some */
  if (/^(pai|avô|avo|tio|irmão|irmao|padrinho|padrasto|primo|vizinho|tutor|dono)(?![a-zà-ú])/.test(q)) return false;
  return true;
}
function casaEhMulher(){ return parentescoEhMulher(casaDe().quem); }
/* Usados na escrita das cenas: nomeCasa() é "Delia", casaQuem() é "mãe",
   casaCompleto() é "Delia, sua mãe". Nunca devolvem vazio. */
function casaDe(){
  const c = (Estado.dados && Estado.dados.jogador && Estado.dados.jogador.casa) || null;
  if (!(c && c.nome)) return {nome:'Delia', quem:'mãe'};
  /* save de antes da lista: no campo do parentesco às vezes foi um nome
     ("Sonia"), e o contato virava "a sua Sonia". O que não é parentesco
     conhecido vira mãe ou pai, pelo nome. */
  if (!PARENTESCOS.includes(c.quem) && !/^(madrinha|padrinho|madrasta|padrasto|prima|primo|vizinha|vizinho|tutora|tutor)$/i.test(c.quem || ''))
    c.quem = (NOMES_DE_CASA_M.includes(c.nome) || /o$/i.test(c.nome)) ? 'pai' : 'mãe';
  return c;
}
function nomeCasa(){ return casaDe().nome; }
function casaQuem(){ return casaDe().quem; }
function casaCompleto(){ const c = casaDe(); return `${c.nome}, ${artigoDe(c.quem)} ${c.quem}`; }
function artigoDe(parentesco){
  return parentescoEhMulher(parentesco) ? 'sua' : 'seu';
}

const ITENS_INFO = {
  /* ─────────── bolas ─────────── */
  'Poké Ball':   {tipo:'bola', mult:1, cat:'Captura',
                  ficha:'Modificador de captura ×1,0 · consumida no arremesso',
                  desc:'A Pokébola comum. É o que a Liga entrega e o que todo mundo usa.',
                  sabido:{bola_fraca_em_lendario:'Você já viu uma dessas ricochetear numa coisa grande demais. Não insista.'}},
  'Great Ball':  {tipo:'bola', mult:1.5, cat:'Captura',
                  ficha:'Modificador de captura ×1,5 · consumida no arremesso',
                  desc:'Mais firme que a comum. Custa o triplo e a diferença aparece.',
                  sabido:{bola_fraca_em_lendario:'Firme, mas não o bastante para o que você viu.'}},
  'Ultra Ball':  {tipo:'bola', mult:2, cat:'Captura',
                  ficha:'Modificador de captura ×2,0 · consumida no arremesso',
                  desc:'Cara. Quem vende fala dela em voz baixa, como se fosse favor.',
                  sabido:{ultra_prende_lendario:'É a única comprável que já prendeu uma coisa daquelas — e mesmo assim, quase nunca.'}},
  'Master Ball': {tipo:'bola', mult:255, cat:'Captura',
                  ficha:'Modificador de captura ×255 · consumida no arremesso',
                  desc:'Você não devia ter uma dessas. Quase ninguém devia.',
                  sabido:{master_quase_sempre:'Ela não falha. Você já viu.'}},

  /* ─────────── cura ─────────── */
  'Potion':      {tipo:'cura', valor:2, cat:'Recuperação',
                  ficha:'+2 HP em um Pokémon · em combate gasta o turno · não age em desmaiado',
                  desc:'Fecha corte e tira dor. Não faz milagre.'},
  'Super Potion':{tipo:'cura', valor:4, cat:'Recuperação',
                  ficha:'+4 HP em um Pokémon · em combate gasta o turno · não age em desmaiado',
                  desc:'A mesma coisa, mais forte e mais cara.'},
  'Hyper Potion':{tipo:'cura', valor:14, cat:'Recuperação',
                  ficha:'+14 HP em um Pokémon · em combate gasta o turno · não age em desmaiado',
                  desc:'Do tipo que hospital usa. Ninguém carrega por acaso.'},
  'Água Fresca': {tipo:'cura', valor:4, cat:'Recuperação',
                  ficha:'+4 HP em um Pokémon · em combate gasta o turno',
                  desc:'Garrafa de máquina. Funciona melhor que devia, e ninguém sabe explicar.'},
  'Revive':      {tipo:'revive', cat:'Recuperação',
                  ficha:'Levanta um Pokémon desmaiado com HP máximo ÷ 2 · não age em morto',
                  desc:'Traz de volta quem desmaiou, na metade das forças. Não faz mais que isso.',
                  sabido:{revive_nao_ressuscita:'Quem morreu de verdade não volta com isso. Você aprendeu do jeito ruim.'}},
  'Antidote':    {tipo:'status', cura:'veneno', cat:'Recuperação',
                  ficha:'Remove veneno · 1 alvo',
                  desc:'Frasco pequeno, gosto horrível, funciona.'},
  'Full Heal':   {tipo:'status', cura:'todos', cat:'Recuperação',
                  ficha:'Remove qualquer condição (veneno, queimadura, paralisia, sono, confusão) · 1 alvo',
                  desc:'Resolve o que o Antidote não resolve, e o resto junto.'},
  'PP Up':       {tipo:'vontadeMais', cat:'Recuperação',
                  ficha:'+1 de Vontade máxima num Pokémon, pra sempre · até 3 vezes no mesmo',
                  desc:'Um pó num frasquinho que ninguém sabe explicar direito e que funciona.'},
  'Éter':        {tipo:'vontade', valor:1, cat:'Recuperação',
                  ficha:'+1 de Vontade num Pokémon',
                  desc:'Frasco pequeno. Devolve um pouco da teimosia que a luta gastou.'},
  'Elixir':      {tipo:'vontade', valor:2, cat:'Recuperação',
                  ficha:'+2 de Vontade num Pokémon',
                  desc:'Repõe mais. Caro pelo que é.'},
  'Bandagem':    {tipo:'curaJogador', valor:10, cat:'Treinador',
                  ficha:'+10 HP no treinador · o HP do treinador não regenera sozinho',
                  desc:'Pra você, não pra eles. Você também se machuca.'},
  'Cantil':      {tipo:'curaJogador', valor:16, cat:'Treinador',
                  ficha:'+16 HP no treinador · uso único',
                  desc:'Cheio. Você vai esvaziar num lugar em que não tem onde encher.'},
  'Ração':       {tipo:'moral', valor:10, cat:'Vínculo',
                  ficha:'+10 de moral e mata a fome de um Pokémon · uma só alimenta o time inteiro (+2 de moral) · moral baixa causa desobediência',
                  desc:'Comida boa de verdade. Muda o humor de quem come.'},

  /* ─────────── campo ─────────── */
  'Boneco':      {tipo:'fuga', cat:'Campo',
                  ficha:'Fuga garantida de encontro selvagem · não funciona contra treinador',
                  desc:'Um boneco de pano com cara de Substitute. Serve pra jogar e sair andando.'},
  'Repelente':   {tipo:'repelente', valor:3, cat:'Campo',
                  ficha:'Nenhum encontro ao procurar por 3 períodos',
                  desc:'Cheiro forte, dura uns três períodos. O mato fica mais quieto em volta.'},

  /* ─────────── pedras ─────────── */
  'Moon Stone':      {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Nidorina, Nidorino, Clefairy e Jigglypuff · consumida no uso',
                      desc:'Morna ao toque, pesada demais para o tamanho, com superfície de vidro fosco.',
                      sabido:{viu_o_circulo:'Trinta e dois ficaram em círculo olhando uma dessas por quarenta minutos.',
                              usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra do Fogo':   {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Vulpix, Growlithe e Eevee (→ Flareon) · consumida no uso',
                      desc:'Alaranjada, com um ponto de luz no meio que não vem de lugar nenhum.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra da Água':   {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Poliwhirl, Shellder, Staryu e Eevee (→ Vaporeon) · consumida no uso',
                      desc:'Azul-escura. Fria mesmo depois de horas no bolso.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra do Trovão': {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Pikachu e Eevee (→ Jolteon) · consumida no uso',
                      desc:'Amarela, com estática. Ela levanta o pelo do seu braço de dez centímetros.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra da Folha':  {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Gloom, Weepinbell e Exeggcute · consumida no uso',
                      desc:'Verde e lascada como pedra de rio. Cheira a mato cortado.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},
  'Pedra do Sol':    {tipo:'pedra', cat:'Evolução',
                      ficha:'Evolui Sunkern e Gloom (→ Bellossom) · consumida no uso',
                      desc:'Laranja e morna por dentro, como seixo que passou o dia inteiro no sol. Não esfria.',
                      sabido:{usou_pedra:'Você já viu uma dessas mudar um corpo inteiro em quatro segundos.'}},

  /* ─────────── segurados ─────────── */
  'Resto de Ração':  {tipo:'equipar', cat:'Segurado', efeito:{regen:1},
                      ficha:'SEGURADO · recupera 1 de HP no fim de cada turno',
                      desc:'Um saquinho amarrado no cinto com o que sobra da ração boa. Some devagar.'},
  'Faixa Firme':     {tipo:'equipar', cat:'Segurado', efeito:{aguenta:true},
                      ficha:'SEGURADO · uma vez por combate, sobrevive a um golpe fatal com 1 HP',
                      desc:'Faixa de algodão grossa amarrada no punho ou na pata. Não protege de nada. Aperta.'},
  'Punho de Ferro':  {tipo:'equipar', cat:'Segurado', efeito:{fis:1},
                      ficha:'SEGURADO · +1 dado de dano em golpes físicos',
                      desc:'Um peso de chumbo costurado numa tira de lona. Pesa e cansa e funciona.'},
  'Óculos Grossos':  {tipo:'equipar', cat:'Segurado', efeito:{esp:1},
                      ficha:'SEGURADO · +1 dado de dano em golpes especiais',
                      desc:'Lente de vidro grosso numa armação torta. Foi de alguém.'},
  'Colete de Lona': {tipo:'equipar', cat:'Segurado', efeito:{defesa:1},
                      ficha:'SEGURADO · +1 de Vitalidade e de Instinto contra dano',
                      desc:'Lona rachada, fivela de metal, remendo nas costas. Já levou pancada por outro.'},
  'Botina Leve':     {tipo:'equipar', cat:'Segurado', efeito:{vel:2},
                      ficha:'SEGURADO · +2 de iniciativa pra ordem dos turnos',
                      desc:'Sola fina, quase gasta. Quem usa isso não planeja apanhar.'},
  'Sino Calmante':   {tipo:'equipar', cat:'Segurado', efeito:{moral:3},
                      ficha:'SEGURADO · +3 de moral ao fim de cada combate',
                      desc:'Um sino de latão do tamanho de uma unha. O som é ridículo e acalma.'},
  'Exp. Share':  {tipo:'equipar', cat:'Segurado', efeito:{expShare:true},
                  ficha:'SEGURADO · fica com metade da experiência de cada nocaute, mesmo sem entrar na luta',
                  desc:'Um aparelhinho de plástico no pescoço dele. Ele assiste e aprende junto.'},
  'Amuleto de Moeda':{tipo:'equipar', cat:'Segurado', efeito:{dinheiro:1.5},
                      ficha:'SEGURADO · +50% de dinheiro em vitórias contra treinador',
                      desc:'Moeda antiga furada e pendurada num barbante. Não vale nada como moeda.'},

  /* ─────────── ferramenta ─────────── */
  'Machado':        {tipo:'ferramenta', cat:'Ferramenta', ficha:'Abre mato fechado, cerca viva e tapume de madeira',
                     desc:'Cabo curto, lâmina de um palmo. Não é arma e não serve como arma: é do tamanho certo pra galho e do tamanho errado pra qualquer outra coisa.'},
  'Picareta':       {tipo:'ferramenta', cat:'Ferramenta', ficha:'Quebra pedra solta, reboco e parede fina',
                     desc:'Bico de um lado, pá do outro, cabo de madeira com a marca de quem segurou por anos. Pesa mais do que você imagina até levantar.'},
  'Corda':          {tipo:'ferramenta', cat:'Ferramenta', ficha:'12 m · usada em cenas de escalada, descida e resgate',
                     desc:'Doze metros. Serve pra mais coisa do que parece e pesa mais do que devia.'},
  'Lanterna':       {tipo:'ferramenta', cat:'Ferramenta', ficha:'Pilha média · usada em caverna, porão e área sem luz',
                     desc:'Pilha média. A luz amarela antes de acabar, e esse é o único aviso que você tem.'},
  'Pilha':          {tipo:'ferramenta', cat:'Ferramenta', ficha:'Par · repõe a carga da Lanterna',
                     desc:'Duas, embaladas. Você vai lembrar delas exatamente quando não tiver.'},
  'Máscara de pó':  {tipo:'ferramenta', cat:'Ferramenta', ficha:'Evita dano de poeira em pedreira e caverna seca',
                     desc:'De pedreira. Não é bonita e é a diferença entre tossir uma semana ou não.'},
  'Bota de borracha':{tipo:'ferramenta', cat:'Ferramenta', ficha:'Isola choque em área com cabo energizado',
                     desc:'Cano alto, solado grosso. Quem trabalha com cabo não pisa em chão molhado sem isso.'},
  'Cobertor térmico':{tipo:'ferramenta', cat:'Ferramenta', ficha:'Evita dano de frio em área congelada e acampamento noturno',
                     desc:'Dobra do tamanho de um livro. Prateado dos dois lados, e mais quente do que parece possível.'},
  'Câmera descartável':{tipo:'ferramenta', cat:'Ferramenta', ficha:'24 poses · registra prova em cenas de documentação · consumida no uso',
                     desc:'Vinte e quatro poses. Revelar custa mais que a câmera.'},
  'Caderno de campo':{tipo:'ferramenta', cat:'Ferramenta', ficha:'Permite copiar documento e anotar número de processo em cena',
                     desc:'Capa dura, elástico, papel que aguenta sereno. É o que gente séria usa.'},
  'Isca':           {tipo:'ferramenta', cat:'Ferramenta', ficha:'+20 pontos percentuais de chance ao pescar · consumida no uso',
                     desc:'Massa de farinha e coisa que cheira mal. Quem pesca sério faz a própria.'},
  'Relógio':        {tipo:'ferramenta', cat:'Ferramenta', ficha:'Mostra o dia da semana, a data e a hora no alto da tela',
                     desc:'De pulso, de ponteiro, com o dia do mês numa janelinha. Atrasa dois minutos por semana.'},
  'Mapa de Kanto':  {tipo:'mapa', cat:'Ferramenta', ficha:'Abre o mapa da região: onde você já pisou e as estradas que saem de lá',
                     desc:'Dobrado em dezesseis. As estradas estão certas e os tempos estão otimistas.'}
};

/* ─────────── bolsas: o que você carrega, e de que cor ───────────
   A cor lida no nome é a cor que a interface usa quando você abre. */
const BOLSAS_VENDIDAS = {
  'Mochila Preta':    'Lona grossa encerada, alça reforçada, sem marca nenhuma. Quem anda de noite prefere não devolver luz.',
  'Mochila Vermelha': 'Vermelha de sinalização, do tipo que se acha num barranco de longe. Feita pra quem trabalha em altura.',
  'Mochila Azul':     'Azul de uniforme, costura dupla no fundo. Sobra de um lote encomendado por uma escola que fechou.',
  'Mochila Verde':    'Verde de mato, com bolso lateral pra cantil. Cheira a barraca guardada úmida e ninguém consegue tirar.',
  'Mochila Amarela':  'Amarela de estrada, com faixa refletiva na aba. Quem acampa perto de rodovia compra essa e nenhuma outra.',
  'Mochila Marrom':   'Lona grossa e encerada, fivela de latão, e pesa vazia. Dura trinta anos e os trinta aparecem nela.',
  'Mochila Laranja':  'Laranja de resgate, costurada pra abrir com uma mão só. Veio de um lote de brigada de incêndio.',
  'Bolsa Roxa':       'Roxa escura, de tecido acetinado que marca o dedo. Vendida como bolsa de cidade e usada como mochila mesmo assim.',
  'Bolsa Branca':     'Branca de algodão cru, que suja no primeiro dia e não desbota nunca mais.',
  'Bolsa Cinza':      'Cinza chumbo, discreta, com forro removível. É a que some mais rápido da prateleira.',
  'Bolsa Rosa':       'Rosa desbotada de sol de vitrine. Está mais barata por isso e a costura é a melhor do balcão.',
  'Bolsa Prateada':   'Tecido metalizado sobre espuma fina. Reflete calor e faz um barulho seco quando você mexe.',
  'Bolsa Dourada':    'Dourada de festa, com ferragem pesada. Ninguém que trabalha usa isso, e ela aguenta mais que parece.'
};
for (const [nome, desc] of Object.entries(BOLSAS_VENDIDAS)){
  ITENS_INFO[nome] = {
    tipo:'bolsa', cat:'Vestuário',
    ficha:'Vestuário · passa a ser a bolsa que você carrega · não ocupa espaço de item',
    desc: desc
  };
}

/* Pedra → pares de evolução (só espécies de nivelEvo 0) */
const PEDRAS = {
  'Pedra do Fogo':   {37:38, 58:59, 133:136},
  'Pedra da Água':   {61:62, 90:91, 120:121, 133:134},
  'Pedra do Trovão': {25:26, 133:135},
  'Pedra da Folha':  {44:45, 70:71, 102:103},
  'Moon Stone':      {30:31, 33:34, 35:36, 39:40}
};

/* Evoluções que só acontecem numa troca */
const EVO_TROCA = {64:65, 67:68, 75:76, 93:94};

/* ============================================================
   O QUE A POKÉDEX NACIONAL DESTRAVA
   As pedras e as trocas de Johto existem no arquivo desde
   sempre e não valem nada antes da hora: consultar por função
   garante que um Onix trocado em Kanto volte Onix.
   ============================================================ */
const PEDRAS_JOHTO = {
  'Pedra do Sol':    {44:182, 191:192}  /* Gloom -> Bellossom, Sunkern -> Sunflora */
};

function pedrasDe(nome){
  const base = PEDRAS[nome] || null;
  const extra = (typeof dexNacional === 'function' && dexNacional()) ? PEDRAS_JOHTO[nome] : null;
  if (!base && !extra) return null;
  return Object.assign({}, base || {}, extra || {});
}
function nomesDePedra(){
  const n = Object.keys(PEDRAS);
  if (typeof dexNacional === 'function' && dexNacional())
    Object.keys(PEDRAS_JOHTO).forEach(k => { if (!n.includes(k)) n.push(k); });
  return n;
}
function evoluiPorTroca(dexId){
  if (EVO_TROCA[dexId]) return EVO_TROCA[dexId];
  if (typeof dexNacional === 'function' && dexNacional() && typeof EVO_JOHTO_TROCA !== 'undefined')
    return EVO_JOHTO_TROCA[dexId] || 0;
  return 0;
}

/* O que o jogador já aprendeu na prática ou porque alguém contou */
/* Quando o cinto já tem seis, o que chega vai para o PC — e o texto da cena
   precisa dizer isso, senão promete um Pokémon que não está lá. */
function notaDestino(onde){
  return onde === 'pc' ? ' O seu cinto já tinha seis: ele foi direto para o PC do Centro Pokémon.' : '';
}
function fichaItem(nome){
  const i = ITENS_INFO[nome];
  return i && i.ficha ? i.ficha : '';
}
/* O que a mochila deixa usar no meio de uma briga. Papel, crachá e prova
   de processo continuam na mochila — só não servem de nada com um Onix
   na sua frente. */
const TIPOS_USAVEIS_EM_BATALHA = ['cura','revive','status','curaJogador','vontade','moral','fuga'];
function usavelEmBatalha(nome){
  const i = ITENS_INFO[nome];
  return !!i && TIPOS_USAVEIS_EM_BATALHA.includes(i.tipo);
}
function categoriaItem(nome){
  const i = ITENS_INFO[nome];
  return i && i.cat ? i.cat : 'Outro';
}
function efeitoSegurado(p){
  if (!p || !p.segurando) return null;
  const i = ITENS_INFO[p.segurando];
  return (i && i.tipo === 'equipar') ? (i.efeito || {}) : null;
}

function descricaoItem(nome){
  const i = ITENS_INFO[nome];
  if (!i) return '';
  let d = i.desc;
  for (const [flag, extra] of Object.entries(i.sabido || {})){
    if (Estado.dados && Estado.dados.flags && Estado.dados.flags[flag]) d += ' ' + extra;
  }
  return d;
}


/* ============================================================
   COR DA MOCHILA
   A bolsa padrão é bege, igual à de fábrica da Liga. Se o jogador
   estiver carregando uma bolsa com cor no nome — "Mochila Preta",
   "Bolsa Roxa" —, a cor lida ali é a cor que a interface usa.
   ============================================================ */
const COR_MOCHILA_PADRAO = '#c8ab74';
const CORES_MOCHILA = {
  bege:'#c8ab74', creme:'#e0d3b4', caqui:'#9d9268', areia:'#d2bd90',
  preta:'#26262d', preto:'#26262d',
  branca:'#e9e5db', branco:'#e9e5db',
  vermelha:'#bf3a2f', vermelho:'#bf3a2f',
  azul:'#2f6fb5', 'azul marinho':'#22406e', 'azul clara':'#7fb0e0', 'azul claro':'#7fb0e0',
  verde:'#3d8b56', 'verde musgo':'#5d6b3a', 'verde escura':'#255c3a', 'verde escuro':'#255c3a',
  amarela:'#d9b53a', amarelo:'#d9b53a',
  roxa:'#7a4fa3', roxo:'#7a4fa3',
  rosa:'#d1688f',
  laranja:'#d2762b',
  cinza:'#878d96',
  marrom:'#6e4b2f', castanha:'#6e4b2f', castanho:'#6e4b2f',
  dourada:'#c39b28', dourado:'#c39b28',
  prateada:'#b4bac3', prateado:'#b4bac3',
  vinho:'#6d2233',
  turquesa:'#2ea39a',
  bordo:'#5c1f27'
};

function _semAcento(s){
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
/* "Mochila Preta" -> '#26262d'. Nome que não é bolsa -> null. */
function corDaMochila(nome){
  const m = _semAcento(nome).match(/^(?:mochila|bolsa|sacola|mala|bornal|cartucheira)\s+(.+)$/);
  if (!m) return null;
  const resto = m[1].replace(/\s+/g, ' ').trim();
  if (CORES_MOCHILA[resto]) return CORES_MOCHILA[resto];
  const primeira = resto.split(' ')[0];
  return CORES_MOCHILA[primeira] || null;
}
/* A bolsa que o jogador está carregando agora — a última que ele arranjou. */
function mochilaAtual(){
  const d = Estado.dados;
  let cor = COR_MOCHILA_PADRAO, nome = 'Mochila da Liga';
  const saida = () => ({cor, nome, rotulo: nome.split(' ')[0]});
  if (!d || !d.itens) return saida();
  const escolhida = d.jogador && d.jogador.bolsa;
  if (escolhida && d.itens[escolhida] > 0){
    const c = corDaMochila(escolhida);
    if (c){ cor = c; nome = escolhida; return saida(); }
  }
  let achou = false;
  for (const [n, q] of Object.entries(d.itens)){
    if (q <= 0) continue;
    const c = corDaMochila(n);
    if (c){ cor = c; nome = n; achou = true; }
  }
  /* Sem bolsa comprada: a que você descreveu na ficha ("uma mochila
     preta", "bolsa verde musgo nas costas") é a que você carrega. */
  if (!achou && d.jogador){
    const texto = _semAcento([d.jogador.vestimenta, d.jogador.aparencia].filter(Boolean).join(' . '));
    const lida = corNaDescricao(texto);
    if (lida){ cor = lida.cor; nome = lida.nome; }
  }
  return saida();
}

/* A cor da bolsa numa descrição livre. A cor não vem sempre colada no
   nome: "mochila velha vermelha", "bolsa de lado cinza", "mochila
   azul-marinho". Procura nas palavras seguintes até a frase mudar de
   assunto (vírgula, ponto, " e ", " com "), pra não pegar a cor do
   casaco que vem depois. */
function corNaDescricao(texto){
  const t = _semAcento(texto).replace(/-/g, ' ');
  const re = /\b(mochila|bolsa|sacola|mala|bornal)\b([^,.;]*)/g;
  let m;
  while ((m = re.exec(t))){
    const trecho = m[2].split(/\s(?:e|com|mas|que)\s/)[0];
    const palavras = trecho.trim().split(/\s+/).filter(Boolean).slice(0, 5);
    for (let i = 0; i < palavras.length; i++){
      const duas = palavras[i] + ' ' + (palavras[i + 1] || '');
      const achada = CORES_MOCHILA[duas] ? duas : (CORES_MOCHILA[palavras[i]] ? palavras[i] : null);
      if (achada){
        const tipo = m[1][0].toUpperCase() + m[1].slice(1);
        return {cor: CORES_MOCHILA[achada], nome: tipo + ' ' + achada};
      }
    }
  }
  return null;
}

/* --- mistura de cor, para tirar as sombras e o forro da cor lida --- */
function _rgb(hex){
  const h = hex.replace('#','');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function _hex(r,g,b){
  return '#' + [r,g,b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2,'0')).join('');
}
function misturaCor(hex, alvo, p){
  const a = _rgb(hex), b = _rgb(alvo);
  return _hex(a[0]+(b[0]-a[0])*p, a[1]+(b[1]-a[1])*p, a[2]+(b[2]-a[2])*p);
}
function luminancia(hex){
  const [r,g,b] = _rgb(hex);
  return (0.2126*r + 0.7152*g + 0.0722*b) / 255;
}
/* Todas as variáveis de estilo que uma cor de bolsa gera.
   O forro é sempre mais escuro que o lado de fora — dentro de bolsa
   é sombra —, então o texto de dentro é sempre claro. */
function paletaMochila(cor){
  const clara  = luminancia(cor) > .5;
  const escuro = misturaCor(cor, '#000000', clara ? .58 : .44);
  const forro  = misturaCor(cor, '#191a1e', .64);
  const txt    = '#f4f1ea';
  const realce = clara ? misturaCor(cor, '#000000', .66) : misturaCor(cor, '#ffffff', .58);
  return {
    '--moch':        cor,
    '--moch-esc':    escuro,
    '--moch-claro':  misturaCor(cor, '#ffffff', .24),
    '--moch-forro':  forro,
    '--moch-forro-2':misturaCor(forro, '#ffffff', .08),
    '--moch-linha':  misturaCor(forro, '#ffffff', .24),
    '--moch-txt':    txt,
    '--moch-txt-2':  misturaCor(txt, forro, .34),
    '--moch-txt-3':  misturaCor(txt, forro, .52),
    '--moch-realce': realce,
    '--moch-titulo': luminancia(misturaCor(cor, '#ffffff', .24)) > .52
                       ? misturaCor(cor, '#000000', .74) : '#f6f3ec',
    '--moch-btn-txt':luminancia(escuro) > .5 ? '#1b1c20' : '#f4f1ea'
  };
}

/* dinheiro sempre com ponto de milhar: 23.400 ₽, nunca 23400 ₽ */
function fmtDin(n){ return Number(n || 0).toLocaleString('pt-BR'); }

/* depois da história, quanto vale um capítulo de espera no PokéNav */
const DIAS_POR_CAPITULO_NAV = 7;

const Estado = {
  dados: null,

  novo(ficha){
    const resistencia = 1;
    this.dados = {
      versao: 1,
      criadoEm: Date.now(),
      jogador: {
        nome: ficha.nome,
        casa: casaDaFicha(ficha),
        genero: ficha.genero,
        aparencia: ficha.aparencia,
        personalidade: ficha.personalidade,
        vestimenta: ficha.vestimenta,
        cidade: ficha.cidade,
        objetivo: ficha.objetivo,
        gosta: ficha.gosta || '',
        naoGosta: ficha.naoGosta || '',
        idade: ficha.idade || 15,
        nascimento: ficha.nascimento || null,
        hp: 30, hpMax: 30,
        status: {forca:1, percepcao:1, intelecto:1, carisma:1, sorte:1, resistencia:1},
        pontos: 0,
        dinheiro: 3000,
        cargo: null,
        ferimentos: []
      },
      reputacao: {eixo:'bom', bom:1, ruim:1, pontosBom:0, pontosRuim:0, historico:[]},
      time: [],
      pc: [],                 // Pokémon depositados
      cemiterio: [],          // mortes permanentes — nunca some
      itens: {},              // a mochila começa vazia: tudo se recebe ou se compra
      insignias: [],
      capitulo: 0,
      cena: null,
      modo: 'cena',
      local: 'pallet',
      visitados: {},
      cargos: [],             // postos assumidos — cada um muda alguma coisa
      cenasAplicadas: {},     // cena cujo efeito já aconteceu — não repete
      escolhasFeitas: {},     // opção já escolhida — some se não tiver mais nada
      olhadas: {},            // cena em que você já parou pra olhar
      nomesSabidos: {},       // "a enfermeira" -> "Emi": você perguntou e ela disse
      nomesRecusados: {},     // quem você perguntou e não quis dizer
      descobertas: {},
      pokedex: {vistos:{}, catalogados:{}, brilhantes:{}},
      pokenav: {tem:false, contatos:{}, ligacoes:[]},   // a agenda e o histórico de ligações
      flags: {},
      npcs: {},               // memória: {nome:{conhece:true, opiniao:n, viuVoce:'...'}}
      rivais: {},             // rivais conquistados pelo caminho: {id:{vitorias,derrotas,...}}
      lendarios: {},          // {dex:{estado:'livre|capturado|solto|morto', disposicao:'neutro|hostil|passivo|desconfiado', encontros:n}}
      liga: {avisos:0, ordemDevolucao:false, detencao:false},
      mundo: {clima:'normal', instabilidade:0, eventos:[]},
      config: {ritmo:'fiel'},   // 'fiel' = HP do Pokérole · 'longo' = HP base em dobro
      via: 'neutro',          // heroi | mercenario | foragido | pesquisador
      viaAnterior: null,
      finaisVistos: [],
      log: [],
      relogio: {dia:1, periodo:'manhã', hora:7}
    };
    return this.dados;
  },

  get j(){ return this.dados.jogador; },

  /* Como as pessoas te descrevem quando precisam te descrever.
     A aparência e a roupa da criação de personagem existem para
     isto: aparecer na boca dos outros, não só na sua ficha. */
  descricaoFisica(){
    const j = this.j;
    const partes = [];
    if (j.aparencia)  partes.push(j.aparencia);
    if (j.vestimenta) partes.push(j.vestimenta);
    return partes.join(', ');
  },
  comoTeVeem(){
    const j = this.j;
    const fisico = this.descricaoFisica() || 'nada que chame atenção';
    if (this.rep.eixo === 'ruim' && this.rep.ruim >= 3)
      return `Perguntam por alguém de ${typeof idadeJogador === 'function' ? idadeJogador() : j.idade} anos, ${fisico}. Perguntam baixo.`;
    if (this.rep.eixo === 'bom' && this.rep.bom >= 4)
      return `A descrição que corre de você é curta e certeira: ${fisico}. E o nome vem junto agora.`;
    return `Se alguém tivesse que te descrever, diria: ${fisico}.`;
  },
  get rep(){ return this.normalizarRep ? this.normalizarRep() : this.dados.reputacao; },

  /* ---------- REPUTAÇÃO ---------- */
  /* Saves antigos guardavam só o degrau. Converte para pontos. */
  normalizarRep(){
    const r = this.dados.reputacao;          /* direto: o getter passa por aqui */
    if (!r) return r;
    if (r.pontosBom === undefined || r.pontosRuim === undefined){
      r.pontosBom  = LIMIARES_REP[Math.max(0, (r.bom  || 1) - 1)] || 0;
      r.pontosRuim = LIMIARES_REP[Math.max(0, (r.ruim || 1) - 1)] || 0;
      if (r.eixo === 'ruim') r.pontosBom = 0; else r.pontosRuim = 0;
    }
    return r;
  },
  nivelDePontos(p){
    let n = 1;
    for (let i = 0; i < LIMIARES_REP.length; i++) if (p >= LIMIARES_REP[i]) n = i + 1;
    return Math.max(1, Math.min(8, n));
  },
  recalcularRep(){
    const r = this.rep;
    r.bom  = this.nivelDePontos(r.pontosBom);
    r.ruim = this.nivelDePontos(r.pontosRuim);
    r.eixo = r.pontosRuim > r.pontosBom ? 'ruim' : 'bom';
  },
  nivelRep(){
    const r = this.normalizarRep();
    return r.eixo === 'bom' ? NIVEIS_BOM[r.bom-1] : NIVEIS_RUIM[r.ruim-1];
  },
  nomeRep(){ return this.nivelRep().nome; },

  /* Quanto um ato vale de fato. O delta que a cena declara é o
     tamanho do ato; quem estava olhando é o resto da conta. */
  pesoRep(delta, ef){
    const d = Math.max(1, Math.abs(delta));
    let pontos = d * (d + 1) / 2;                    /* 1, 3, 6, 10, 15… ato pequeno quase não move */
    const c = ef || {};
    if (c.rep && c.rep.notorio) pontos *= 1.5;       /* a cena diz que virou notícia */
    if (c.npc && ehInfluente(c.npc.nome)) pontos *= 2;
    if (c.insignia) pontos *= 1.5;                   /* ginásio cheio de gente vendo */
    if (c.rep && c.rep.peso) pontos *= c.rep.peso;   /* ajuste manual da cena */
    return Math.max(1, Math.round(pontos));
  },

  /* Progresso dentro do degrau atual — para a barra do cartão */
  progressoRep(){
    const r = this.normalizarRep();
    const p = r.eixo === 'bom' ? r.pontosBom : r.pontosRuim;
    const n = r.eixo === 'bom' ? r.bom : r.ruim;
    if (n >= 8) return {pontos:p, atual:1, falta:0, prox:null};
    const piso = LIMIARES_REP[n-1], teto = LIMIARES_REP[n];
    return {pontos:p, atual:(p - piso) / Math.max(1, teto - piso), falta:teto - p, prox:n+1};
  },

  /* O mesmo feito não é contado duas vezes. Cenas se revisitam e
     algumas escolhas voltam para onde começaram — sem isso, dava
     para consertar a mesma calha a tarde inteira e virar Famoso.
     A trava é por capítulo, porque laço de cena não atravessa
     capítulo: prometer voltar para alguém em Pewter e prometer de
     novo para outra pessoa em Celadon continuam sendo duas coisas.
     E os motivos que se repetem de verdade já vêm parametrizados
     (a cidade do ginásio, a rodada do torneio, a espécie). */
  jaContou(motivo){
    if (!motivo) return false;
    const cap = this.dados.capitulo;
    return (this.rep.historico || []).some(h => h.motivo === motivo && h.cap === cap);
  },

  /* ---------- teto de fama por capítulo ----------
     A campanha inteira oferece muito mais feito do que oito degraus
     comportam, e os capítulos do meio oferecem dez vezes mais que os
     do começo. Sem teto, varrer um capítulo valia mais que a Liga
     inteira e todo mundo travava no topo antes da metade.
     Cada capítulo tem um orçamento; o que passa dele ainda conta,
     mas conta pouco — Kanto só fala de você na medida em que Kanto
     te viu. Marcos ficam de fora: ginásio, Liga e cadeira de Campeão
     são notícia por definição, em qualquer altura da história. */
  orcamentoDoCapitulo(){
    return 20 + 2 * (this.dados.capitulo || 1);
  },
  gastoNoCapitulo(eixo){
    const cap = this.dados.capitulo;
    return (this.rep.historico || [])
      .filter(h => h.cap === cap && h.eixo === eixo && !h.marco)
      .reduce((soma, h) => soma + (h.pontos || 0), 0);
  },
  dentroDoOrcamento(eixo, brutos){
    const orc = this.orcamentoDoCapitulo();
    const gasto = this.gastoNoCapitulo(eixo);
    if (gasto + brutos <= orc) return brutos;
    if (gasto >= orc) return Math.max(1, Math.round(brutos * 0.15));
    return (orc - gasto) + Math.max(0, Math.round((gasto + brutos - orc) * 0.15));
  },

  mudarRep(eixo, delta, motivo, ef){
    const r = this.normalizarRep();
    if (!delta) return null;
    if (this.jaContou(motivo)) return null;
    const antes = this.nomeRep();
    const marco = !!(ef && ef.rep && ef.rep.notorio);
    const pontos = marco ? this.pesoRep(delta, ef)
                         : this.dentroDoOrcamento(eixo, this.pesoRep(delta, ef));

    /* O eixo contrário é pago primeiro: você não vira santo enquanto
       ainda deve. Só o que sobra é que começa a subir do outro lado. */
    if (eixo === 'bom'){
      const gasto = Math.min(r.pontosRuim, pontos);
      r.pontosRuim -= gasto;
      r.pontosBom  += (pontos - gasto);
    } else {
      const gasto = Math.min(r.pontosBom, pontos);
      r.pontosBom  -= gasto;
      r.pontosRuim += (pontos - gasto);
    }
    this.recalcularRep();

    const depois = this.nomeRep();
    r.historico.push({motivo, eixo, delta, pontos, marco, de:antes, para:depois, cap:this.dados.capitulo});
    if (antes !== depois) this.registrar(`Reputação: ${antes} → ${depois} (${motivo})`);
    return {de:antes, para:depois, mudou:antes !== depois, pontos};
  },

  /* ---------- MEMÓRIA ---------- */
  registrar(texto){
    /* a idade fica a do dia em que aconteceu */
    if (typeof marcasDeIdade === 'function') texto = marcasDeIdade(texto);
    this.dados.log.push({cap:this.dados.capitulo, texto, dia:this.dados.relogio.dia});
    if (this.dados.log.length > 400) this.dados.log.shift();
  },
  marcar(flag, valor=true){
    const tinha = !!this.dados.flags[flag];
    this.dados.flags[flag] = valor;
    /* A Pokédex chega no capítulo 1, e o inicial chegou antes dela. Quem
       já está com você entra no aparelho no dia em que ele é seu —
       senão o seu próprio inicial ficava "???" na Pokédex. Os outros
       iniciais continuam de fora até você encontrar um. */
    if (flag === 'tem_pokedex' && valor && !tinha) this.catalogarQuemJaTenho();
  },
  catalogarQuemJaTenho(){
    [...(this.dados.time || []), ...(this.dados.pc || [])].forEach(p => {
      if (!p || p.dex == null) return;
      this.catalogou(p.dex);
      if (typeof registrarGolpeNaDex === 'function')
        (p.golpes || []).forEach(g => registrarGolpeNaDex(p.dex, g.nome));
    });
  },
  tem(flag){ return !!this.dados.flags[flag]; },

  /* ============================================================
     POKÉNAV — a agenda
     Um número entra quando a pessoa te dá. Cada uso tem limite
     e espera: ninguém atende a mesma pergunta três vezes no
     mesmo dia, e favor pedido demais deixa de ser favor.
     ============================================================ */
  nav(){
    const d = this.dados;
    if (!d.pokenav) d.pokenav = {tem:false, contatos:{}, ligacoes:[]};
    if (!d.pokenav.contatos) d.pokenav.contatos = {};
    if (!d.pokenav.ligacoes) d.pokenav.ligacoes = [];
    return d.pokenav;
  },
  temPokenav(){ return !!this.nav().tem; },
  ganharPokenav(){
    const nav = this.nav();
    if (nav.tem) return false;
    nav.tem = true;
    this.registrarNumero('casa');
    this.registrar('Ganhou um PokéNav de casa.');
    return true;
  },
  temNumero(id){ return !!this.nav().contatos[id]; },
  registrarNumero(id){
    const nav = this.nav();
    if (nav.contatos[id]) return false;
    const c = (typeof contatoPorId === 'function') ? contatoPorId(id) : null;
    if (!c) return false;
    nav.contatos[id] = {id, desdeCap: this.dados.capitulo, usos:{}};
    this.registrar(`Registrou o número de ${textoContato(c, 'nome')} no PokéNav.`);
    return true;
  },
  /* Avisa uma vez só que alguém te passou o número. Sem isso o jogador
     tem que abrir o aparelho no chute pra descobrir que apareceu gente. */
  numerosNovos(){
    if (!this.temPokenav()) return [];
    const nav = this.nav();
    if (!nav.oferecidos) nav.oferecidos = [];
    const novos = this.numerosDisponiveis().filter(c => !nav.oferecidos.includes(c.id));
    novos.forEach(c => nav.oferecidos.push(c.id));
    return novos;
  },

  /* números que a pessoa já te deu mas que você ainda não gravou */
  numerosDisponiveis(){
    if (!this.temPokenav()) return [];
    const d = this.dados;
    return (typeof todosContatos === 'function' ? todosContatos() : [])
      .filter(c => !this.temNumero(c.id) && !c.automatico)
      .filter(c => { try { return !c.requer || c.requer(d); } catch(e){ return false; } });
  },
  contatosNaAgenda(){
    const nav = this.nav();
    return Object.keys(nav.contatos)
      .map(id => (typeof contatoPorId === 'function') ? contatoPorId(id) : null)
      .filter(Boolean);
  },
  /* ---------- MISSÕES ----------
     Uma missão tem três tempos: pedir, cumprir, voltar. O objetivo é
     lido do estado, então não tem como "entregar" sem ter feito. */
  missoes(){
    const nav = this.nav();
    if (!nav.missoes) nav.missoes = {};
    return nav.missoes;
  },
  missaoDe(id){ return this.missoes()[id] || null; },
  aceitarMissao(id){
    const m = this.missoes();
    if (m[id]) return false;
    m[id] = {estado:'aberta', desdeCap:this.dados.capitulo};
    const c = (typeof contatoPorId === 'function') ? contatoPorId(id) : null;
    if (c) this.registrar(`Aceitou o pedido de ${textoContato(c,'nome')}.`);
    return true;
  },
  missaoCumprida(id){
    const c = (typeof contatoPorId === 'function') ? contatoPorId(id) : null;
    if (!c || !c.missao || typeof c.missao.objetivo !== 'function') return false;
    try { return !!c.missao.objetivo(this.dados); } catch(e){ return false; }
  },
  fecharMissao(id){
    const m = this.missoes();
    if (!m[id] || m[id].estado === 'feita') return false;
    m[id].estado = 'feita';
    m[id].fechadaCap = this.dados.capitulo;
    const c = (typeof contatoPorId === 'function') ? contatoPorId(id) : null;
    if (c) this.registrar(`Cumpriu o pedido de ${textoContato(c,'nome')}.`);
    return true;
  },
  /* em que ponto está: null (não oferecida), 'pedir', 'fazendo', 'entregar', 'feita' */
  faseDaMissao(id){
    const c = (typeof contatoPorId === 'function') ? contatoPorId(id) : null;
    if (!c || !c.missao) return null;
    const m = this.missaoDe(id);
    if (!m) return 'pedir';
    if (m.estado === 'feita') return 'feita';
    return this.missaoCumprida(id) ? 'entregar' : 'fazendo';
  },

  /* pode ligar pra esse contato pedindo esse serviço? */
  podeLigar(id, servico){
    const nav = this.nav();
    const reg = nav.contatos[id];
    const c = (typeof contatoPorId === 'function') ? contatoPorId(id) : null;
    if (!reg || !c) return {ok:false, motivo:'Esse número não está na agenda.'};
    if (!(c.oferece||[]).includes(servico)) return {ok:false, motivo:'Não é pra isso que se liga pra essa pessoa.'};
    if (servico === 'missao'){
      const fase = this.faseDaMissao(id);
      if (fase === 'feita')   return {ok:false, motivo:'Já está resolvido. Ele não vai pedir de novo.'};
      if (fase === 'fazendo') return {ok:false, motivo: (c.missao && c.missao.dica) || 'Ainda não. Você sabe o que falta.'};
      return {ok:true, fase};
    }
    if (servico === 'revanche' && (this.dados.revanches || {})[id])
      return {ok:false, motivo:`Já está marcada ${emLocal(this.dados.revanches[id].local)}.`};
    const def = c[servico] || {};
    const u = reg.usos[servico] || {vezes:0, ultimoCap:-99};
    const limite = def.limite === undefined ? 99 : def.limite;
    if (u.vezes >= limite)
      return {ok:false, motivo:'Já deu o que tinha pra dar. Pedir de novo seria outra coisa.'};
    const espera = def.esperaCap === undefined ? 1 : def.esperaCap;
    /* Depois do último capítulo o número do capítulo não anda mais, e a
       espera em capítulos virava uso único: aí cada capítulo vale
       DIAS_POR_CAPITULO_NAV dias de relógio. */
    const acabou = typeof Historia !== 'undefined' && !Historia.proximoCapitulo(false);
    if (acabou && u.ultimoDia != null){
      const faltaDias = (u.ultimoDia + espera * DIAS_POR_CAPITULO_NAV) - this.dados.relogio.dia;
      if (faltaDias > 0)
        return {ok:false, motivo:`Vocês falaram faz pouco. Deixa passar ${faltaDias} dia${faltaDias===1?'':'s'}.`};
      return {ok:true};
    }
    const falta = (u.ultimoCap + espera) - this.dados.capitulo;
    if (falta > 0 && !acabou)
      return {ok:false, motivo:`Vocês falaram faz pouco. Deixa passar ${falta} capítulo${falta===1?'':'s'}.`};
    return {ok:true};
  },
  marcarLigacao(id, servico){
    const nav = this.nav();
    const reg = nav.contatos[id];
    if (!reg) return;
    const u = reg.usos[servico] || {vezes:0, ultimoCap:-99};
    u.vezes++; u.ultimoCap = this.dados.capitulo; u.ultimoDia = this.dados.relogio.dia;
    reg.usos[servico] = u;
    nav.ligacoes.push({id, servico, cap:this.dados.capitulo, dia:this.dados.relogio.dia});
    if (nav.ligacoes.length > 60) nav.ligacoes.shift();
  },

  lembrarNPC(nome, dados){
    /* "a enfermeira do Centro" e "Nao" são a mesma pessoa depois que o
       jogador perguntou o nome. Sem isso ela aparecia duas vezes em
       "quem lembra de você", com duas opiniões separadas. */
    if (typeof Nomes !== 'undefined' && Nomes.sabe && Nomes.sabe(nome)){
      const real = Nomes.nomeDe(nome);
      const velho = this.dados.npcs[nome];
      if (velho && real && real !== nome){
        const novo = this.dados.npcs[real] || {nome:real, opiniao:0, memorias:[]};
        novo.opiniao = (novo.opiniao || 0) + (velho.opiniao || 0);
        novo.memorias = (novo.memorias || []).concat(velho.memorias || []);
        if (velho.viuVoce && !novo.viuVoce) novo.viuVoce = velho.viuVoce;
        this.dados.npcs[real] = novo;
        delete this.dados.npcs[nome];
      }
      nome = real || nome;
    }
    const n = this.dados.npcs[nome] || {nome, opiniao:0, memorias:[]};
    Object.assign(n, dados);
    if (dados.memoria){ n.memorias.push({cap:this.dados.capitulo, texto:dados.memoria}); delete n.memoria; }
    this.dados.npcs[nome] = n;
    return n;
  },
  npc(nome){ return this.dados.npcs[nome] || null; },

  /* ---------- TIME ---------- */
  /* ---------- PC: o time cabe seis, o resto fica guardado ---------- */
  depositar(uid){
    const d = this.dados;
    const i = d.time.findIndex(p => p.uid === uid);
    if (i < 0) return {ok:false, motivo:'Esse não está no seu time.'};
    const vivosNoTime = d.time.filter(p => !p.morto).length;
    const morto = d.time[i].morto;
    if (!morto && vivosNoTime <= 1)
      return {ok:false, motivo:'Esse é o único que você tem em pé. Ninguém anda por Kanto de cinto vazio.'};
    const p = d.time.splice(i, 1)[0];
    d.pc.push(p);
    this.registrar(`${nomeExib(p)} ficou no PC.`);
    return {ok:true, pokemon:p};
  },
  retirar(uid){
    const d = this.dados;
    if (d.time.length >= 6) return {ok:false, motivo:'O seu cinto já tem seis. Guarde um antes de tirar outro.'};
    const i = d.pc.findIndex(p => p.uid === uid);
    if (i < 0) return {ok:false, motivo:'Esse não está no PC.'};
    const p = d.pc.splice(i, 1)[0];
    d.time.push(p);
    this.registrar(`${nomeExib(p)} voltou do PC para o time.`);
    return {ok:true, pokemon:p};
  },

  adicionar(p){
    /* Bicho que entra pro seu time entra pra Pokédex. Você convive com
       ele: não faz sentido o aparelho não saber o que ele é só porque
       você não apontou a lente. Vale pra captura, troca e presente. */
    if (p && p.dex != null){
      this.catalogou(p.dex);
      if (typeof registrarGolpeNaDex === 'function')
        (p.golpes || []).forEach(g => registrarGolpeNaDex(p.dex, g.nome));
    }
    /* quem chega por captura ou presente pode ganhar apelido; de troca,
       não: o nome veio com ele */
    if (p && !p.trocado && !p.apelido && !p.apelidoPerguntado)
      (this.dados.apelidar = this.dados.apelidar || []).push(p.uid);
    /* do que você gosta chega com mais moral; do que não gosta, com menos */
    if (p && !p.moralDeGosto && typeof moralDeGosto === 'function'){
      p.moralDeGosto = true;
      const m = moralDeGosto(p);
      if (m) p.moral = Math.max(0, Math.min(100, (p.moral || 50) + m));
    }
    if (this.dados.time.length < 6){ this.dados.time.push(p); return 'time'; }
    this.dados.pc.push(p); return 'pc';
  },
  removerDoTime(uid){
    const i = this.dados.time.findIndex(p => p.uid === uid);
    if (i >= 0) return this.dados.time.splice(i,1)[0];
    return null;
  },
  /* Devolve o par que ficou, se tinha um no time: é ele que sente. */
  matar(p, causa){
    const par = (typeof parDe === 'function') ? parDe(p, this.dados.time) : null;
    p.morto = true;
    p.hp = 0;
    p.causaMorte = causa;
    p.morreuNoCap = this.dados.capitulo;
    this.removerDoTime(p.uid);
    this.dados.cemiterio.push(p);
    this.registrar(`${nomeExib(p)} morreu. Causa: ${causa}`);
    if (par){
      par.moral = Math.max(0, (par.moral !== undefined ? par.moral : 70) - 20);
      par.luto = {uid:p.uid, nome:nomeExib(p), cap:this.dados.capitulo};
      this.registrar(`${nomeExib(par)} perdeu ${nomeExib(p)}.`);
    }
    return par;
  },
  timeVivo(){ return this.dados.time.filter(p => estaVivo(p)); },
  primeiroApto(){ return this.dados.time.find(p => estaVivo(p)) || null; },

  /* ---------- ITENS ---------- */
  darItem(nome, qtd=1){
    this.dados.itens[nome] = (this.dados.itens[nome]||0) + qtd;
    /* bolsa nova passa a ser a bolsa usada */
    if (corDaMochila(nome)) this.dados.jogador.bolsa = nome;
  },
  usarItem(nome){
    if (!this.dados.itens[nome]) return false;
    this.dados.itens[nome]--;
    if (this.dados.itens[nome] <= 0) delete this.dados.itens[nome];
    return true;
  },
  contaItem(nome){ return this.dados.itens[nome] || 0; },

  /* ---------- ITEM SEGURADO ---------- */
  equipar(uid, nome){
    const p = this.dados.time.find(x => x.uid === uid);
    if (!p || !this.contaItem(nome)) return null;
    const info = ITENS_INFO[nome];
    if (!info || info.tipo !== 'equipar') return null;
    if (p.segurando) this.darItem(p.segurando, 1);   // devolve o anterior à mochila
    this.usarItem(nome);
    p.segurando = nome;
    p.faixaUsada = false;
    this.registrar(`${nomeExib(p)} passou a segurar ${nome}.`);
    return p;
  },
  desequipar(uid){
    const p = this.dados.time.find(x => x.uid === uid);
    if (!p || !p.segurando) return null;
    const nome = p.segurando;
    this.darItem(nome, 1);
    p.segurando = null;
    p.faixaUsada = false;
    this.registrar(`${nomeExib(p)} devolveu ${nome} à mochila.`);
    return p;
  },

  /* ---------- NATUREZA: só se sabe com convivência ---------- */
  revelarNatureza(p, motivo){
    if (!p || p.naturezaVista) return false;
    p.naturezaVista = true;
    this.registrar(`Você entendeu o jeito de ${nomeExib(p)}: ${p.natureza}.${motivo ? ' ('+motivo+')' : ''}`);
    return true;
  },
  /* chamada no fim de cada combate: convivência + Percepção */
  tickNatureza(){
    const avisos = [];
    (this.dados.time || []).forEach(p => {
      if (p.naturezaVista || p.morto) return;
      p.convivencia = (p.convivencia || 0) + 1;
      if (p.convivencia < 3) return;
      const t = Dados.teste(this.j.status.percepcao + Math.floor(p.convivencia / 3), 7, 'Percepção');
      if (t.grau === 'sucesso' || t.grau === 'critico'){
        p.naturezaVista = true;
        this.registrar(`Natureza de ${nomeExib(p)} percebida: ${p.natureza}.`);
        avisos.push({tipo:'natureza', texto:`Você convive o bastante com ${nomeExib(p)} pra botar um nome no jeito ${pron(p).dele}: ${p.natureza}.`});
      }
    });
    return avisos;
  },

  /* ---------- JOGADOR ---------- */
  hpMaxJogador(){ return 30 + (this.j.status.resistencia - 1) * 2; },
  /* Vontade do treinador (Will): 2 + Resistência. Gasta-se nos testes de
     cena (um sucesso a mais); save antigo começa cheio. */
  vontadeMaxJogador(){ return 2 + ((this.j && this.j.status && this.j.status.resistencia) || 1); },
  vontadeJogador(){
    if (!this.j) return 0;
    if (this.j.vontade == null) this.j.vontade = this.vontadeMaxJogador();
    return Math.max(0, Math.min(this.j.vontade, this.vontadeMaxJogador()));
  },
  recuperarVontadeJogador(n){
    if (!this.j) return;
    this.j.vontade = Math.min(this.vontadeMaxJogador(), this.vontadeJogador() + (n == null ? 99 : n));
  },
  ferir(qtd, causa){
    this.j.hp = Math.max(0, this.j.hp - qtd);
    if (causa) this.j.ferimentos.push({causa, qtd, cap:this.dados.capitulo});
    this.registrar(`Você sofreu ${qtd} de dano (${causa||'?'}). HP: ${this.j.hp}/${this.hpMaxJogador()}`);
    return this.j.hp <= 0;
  },
  curarJogador(qtd){
    this.j.hp = Math.min(this.hpMaxJogador(), this.j.hp + qtd);
  },
  subirStatus(chave){
    const st = this.j.status;
    if (st[chave] >= 10) return false;
    st[chave]++;
    if (chave === 'resistencia') this.j.hp += 2;
    return true;
  },

  /* ---------- POKÉDEX ---------- */
  pdex(){
    const d = this.dados;
    if (!d.pokedex) d.pokedex = {vistos:{}, catalogados:{}, brilhantes:{}};
    if (!d.pokedex.brilhantes) d.pokedex.brilhantes = {};   /* saves antigos */
    return d.pokedex;
  },
  viu(dex){
    if (!this.dados.flags.tem_pokedex) return false;
    const p = this.pdex();
    if (p.vistos[dex]) return false;
    p.vistos[dex] = true;
    return true;
  },
  catalogou(dex){
    if (!this.dados.flags.tem_pokedex) return false;
    const p = this.pdex();
    p.vistos[dex] = true;
    if (p.catalogados[dex]) return false;
    p.catalogados[dex] = true;
    this.registrar(`Pokédex: ${DEX[dex].nome} catalogado.`);
    return true;
  },
  conheceu(dex){ return !!this.pdex().catalogados[dex]; },

  /* Um brilhante visto fica registrado mesmo que escape. */
  viuBrilhante(dex){
    const p = this.pdex();
    if (p.brilhantes[dex] === 'capturado') return false;
    const novo = !p.brilhantes[dex];
    if (novo){ p.brilhantes[dex] = 'visto'; this.registrar(`Pokédex: um ${DEX[dex].nome} brilhante.`); }
    return novo;
  },
  pegouBrilhante(dex){
    const p = this.pdex();
    const novo = p.brilhantes[dex] !== 'capturado';
    p.brilhantes[dex] = 'capturado';
    if (novo) this.registrar(`Pokédex: ${DEX[dex].nome} brilhante registrado no time.`);
    return novo;
  },
  brilhanteDe(dex){ return this.pdex().brilhantes[dex] || null; },

  contagemDex(){
    const p = this.pdex();
    const b = Object.values(p.brilhantes || {});
    return {vistos:Object.keys(p.vistos).length, catalogados:Object.keys(p.catalogados).length,
            brilhantes:b.length, brilhantesPegos:b.filter(v => v === 'capturado').length};
  },

  /* ---------- LENDÁRIOS ---------- */
  lend(dex){
    if (!this.dados.lendarios[dex]){
      this.dados.lendarios[dex] = {dex, estado:'livre', disposicao:'neutro', encontros:0, ataquesSofridos:0};
    }
    return this.dados.lendarios[dex];
  },
  lendariosCapturados(){
    return Object.values(this.dados.lendarios).filter(l => l.estado === 'capturado');
  },

  /* Manter lendário preso pesa com o tempo. Chamado ao fim de cada capítulo. */
  tickLendarios(){
    const avisos = [];
    const presos = this.lendariosCapturados();
    for (const L of presos){
      L.turnosPreso = (L.turnosPreso || 0) + 1;
      // segredo tem prazo de validade
      if (this.tem('lendario_oculto_' + L.dex) && L.turnosPreso >= 2){
        this.marcar('lendario_oculto_' + L.dex, false);
        this.marcar('captura_vista_' + L.dex);
        avisos.push(`Alguém falou. A captura de ${DEX[L.dex].nome} deixou de ser segredo.`);
        this.mudarRep('ruim', 2, `Descobriram ${DEX[L.dex].nome} com você`);
        this.dados.liga.avisos++;
      } else if (L.turnosPreso % 2 === 0){
        avisos.push(`${DEX[L.dex].nome} continua na sua Pokébola. O mundo continua pagando por isso.`);
        this.mudarRep('ruim', 1, `Mantém ${DEX[L.dex].nome} em cativeiro`);
        this.dados.mundo.instabilidade++;
      }
      // o próprio lendário tenta fugir
      const p = [...this.dados.time, ...this.dados.pc].find(x => x.dex === L.dex);
      if (p && p.moral < 30 && Dados.chance(15)){
        avisos.push(`${DEX[L.dex].nome} rompeu a Pokébola durante a noite e sumiu. Não deixou nada.`);
        this.removerDoTime(p.uid);
        const i = this.dados.pc.findIndex(x => x.uid === p.uid);
        if (i >= 0) this.dados.pc.splice(i,1);
        L.estado = 'livre';
        L.disposicao = 'hostil';
      }
    }
    return avisos;
  },

  /* ---------- SAVE / LOAD ---------- */
  salvar(slot='auto'){
    /* luta em andamento vai junto (js/engine/luta-salva.js) */
    if (typeof LutaSalva !== 'undefined') LutaSalva.anotar(this.dados);
    try {
      localStorage.setItem('pokerpg_save_' + slot, JSON.stringify(this.dados));
      return true;
    } catch(e){ return false; }
  },
  carregar(slot='auto'){
    try {
      const raw = localStorage.getItem('pokerpg_save_' + slot);
      if (!raw) return false;
      this.dados = JSON.parse(raw);
      /* save de antes do Pokérole: atributos dos jogos viram os do livro */
      const d = this.dados;
      for (const p of [].concat(d.time || [], d.pc || [], d.cemiterio || []))
        if (p && p.stats && p.stats.vit === undefined) atualizarAtributos(p);
      /* nomes que mudaram depois que o save foi gravado: o item e a
         pessoa continuam os mesmos, só o nome na tela é outro */
      const ITEM_NOVO = {'Colete de Couro':'Colete de Lona', 'Cobertor de lã':'Cobertor de flanela',
        'Caixa de ventilador com um bicho dentro':'Caixa de ventilador com um Pokémon dentro',
        'Mapa de nove anos atrás':'Mapa velho de Kanto'};
      for (const [velho, novo] of Object.entries(ITEM_NOVO)){
        if (d.itens && d.itens[velho]){ d.itens[novo] = (d.itens[novo] || 0) + d.itens[velho]; delete d.itens[velho]; }
        for (const p of [].concat(d.time || [], d.pc || [])) if (p && p.segurando === velho) p.segurando = novo;
      }
      const NPC_NOVO = {'a mulher da pasta de couro':'a mulher da pasta', 'Mulher da pasta de couro':'a mulher da pasta',
                        'a recepcionista':'a moça da recepção', 'a balconista':'a balconista da farmácia',
                        'o veterinário do conselho':'o médico do conselho', 'a veterinária de Cerulean':'a médica de Cerulean',
                        'Sr. Roland Poplar':'Sr. Emory Poplar', 'Garoto de Fuchsia':'Rory', 'Ivy Calder':'Tess Calder'};
      /* a mesma pessoa gravada com duas grafias virava duas pessoas, com
         opinião separada: junta na grafia certa */
      const MESMA_PESSOA = {'a Terceira':'A Terceira', 'Mulher da pasta de vinil':'a mulher da pasta',
                            'a mulher da pasta de vinil':'a mulher da pasta'};
      for (const [errado, certo] of Object.entries(MESMA_PESSOA)){
        if (!d.npcs || !d.npcs[errado]) continue;
        const a = d.npcs[errado], b = d.npcs[certo] || {nome:certo, opiniao:0, memorias:[]};
        b.opiniao = (b.opiniao || 0) + (a.opiniao || 0); b.memorias = (b.memorias || []).concat(a.memorias || []);
        d.npcs[certo] = b; delete d.npcs[errado];
      }
      for (const [velho, novo] of Object.entries(NPC_NOVO))
        if (d.npcs && d.npcs[velho] && !d.npcs[novo]){ d.npcs[novo] = d.npcs[velho]; d.npcs[novo].nome = novo; delete d.npcs[velho]; }
      /* o rival guardou o nome de quando ainda não tinha um */
      if (d.rivais && d.rivais.fuchsia) d.rivais.fuchsia.nome = 'Rory';
      /* o homem da pergunta de Lavender era gravado como o Fabre da
         Comissão: o que é dele (o caderno setenta e um) vai pro Sr. Juniper */
      const fab = d.npcs && d.npcs['Curador Fabre'];
      if (fab && !d.npcs['Sr. Juniper']){
        const dele = (fab.memorias || []).filter(m => /caderno setenta e um/.test(String(m && m.texto || m)));
        if (dele.length){
          fab.memorias = fab.memorias.filter(m => !dele.includes(m));
          fab.opiniao = (fab.opiniao || 0) - 2;
          d.npcs['Sr. Juniper'] = {nome:'Sr. Juniper', opiniao:2, memorias:dele};
        }
      }
      /* o homem das perguntas virou a figura de capuz: quem já sabia o
         nome dele continua sabendo */
      if (d.npcs && d.npcs['Sr. Juniper'] && !d.npcs['a figura de capuz']){
        d.npcs['a figura de capuz'] = Object.assign(d.npcs['Sr. Juniper'], {nome:'a figura de capuz'});
        delete d.npcs['Sr. Juniper'];
        (d.nomesSabidos = d.nomesSabidos || {})['a figura de capuz'] = 'Sr. Juniper';
        d.flags.juniper_sem_capuz = true;
      }
      /* o parceiro do Ezra passou a ser sorteado: quem já conhecia o
         Pidgey dele continua com o Pidgey */
      if (d.rival && !d.rival.picoDex) d.rival.picoDex = (d.npcs && d.npcs['Ezra']) ? 16 : 0;
      return true;
    } catch(e){ return false; }
  },
  existeSave(slot='auto'){
    try { return !!localStorage.getItem('pokerpg_save_' + slot); } catch(e){ return false; }
  },
  apagarSave(slot='auto'){
    try { localStorage.removeItem('pokerpg_save_' + slot); } catch(e){}
  },

  /* ---------- CÓDICE DE FINAIS (sobrevive entre partidas) ---------- */
  registrarFinal(id, titulo){
    try {
      const raw = localStorage.getItem('pokerpg_finais');
      const lista = raw ? JSON.parse(raw) : [];
      if (!lista.find(f => f.id === id)){
        lista.push({id, titulo, quando: Date.now()});
        localStorage.setItem('pokerpg_finais', JSON.stringify(lista));
      }
      return lista;
    } catch(e){ return []; }
  },
  finaisDescobertos(){
    try { const raw = localStorage.getItem('pokerpg_finais'); return raw ? JSON.parse(raw) : []; }
    catch(e){ return []; }
  }
};
