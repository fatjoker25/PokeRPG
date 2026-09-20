/* ============================================================
   MERCADO E TROCAS — cada cidade vende o que cada cidade é
   ============================================================ */

/* Preço de referência. A cidade mexe nisso pra cima ou pra baixo. */
const PRECO_BASE = {
  'Poké Ball':200, 'Great Ball':600, 'Ultra Ball':1200,
  'Potion':300, 'Super Potion':700, 'Hyper Potion':1500,
  'Revive':1500, 'Antidote':250, 'Full Heal':600,
  'Bandagem':400, 'Ração':350, 'Água Fresca':250, 'Cantil':500,
  'Éter':900, 'Elixir':2000, 'Boneco':700, 'Repelente':400,
  'Corda':450, 'Lanterna':600, 'Pilha':180, 'Isca':150,
  'Máscara de pó':300, 'Bota de borracha':900, 'Cobertor térmico':1100,
  'Câmera descartável':800, 'Caderno de campo':350, 'Mapa de Kanto':600,
  'Pedra do Fogo':4000, 'Pedra da Água':4000, 'Pedra do Trovão':4000,
  'Pedra da Folha':4000, 'Moon Stone':6000,
  /* segurados */
  'Resto de Ração':2800, 'Faixa Firme':3200, 'Punho de Ferro':2600,
  'Óculos Grossos':2600, 'Colete de Couro':2400, 'Botina Leve':2200,
  'Sino Calmante':1800, 'Amuleto de Moeda':3600,
  /* bolsas */
  'Mochila Preta':1400, 'Mochila Vermelha':1300, 'Mochila Azul':1200, 'Mochila Verde':1200,
  'Mochila Amarela':1300, 'Mochila Marrom':1800, 'Mochila Laranja':1500,
  'Bolsa Roxa':1400, 'Bolsa Branca':1100, 'Bolsa Cinza':1200, 'Bolsa Rosa':900,
  'Bolsa Prateada':2200, 'Bolsa Dourada':3200
};

/* O que a loja de cada cidade tem, e por quanto (multiplicador local).
   A ideia: ninguém em Pewter vende bola barata, e ninguém em Lavender
   vende repelente, porque ninguém em Lavender vai pro mato. */
const LOJAS = {
  pallet: {
    nome:'Mercado do Sr. Elpídio',
    ar:'Um mercado de bairro que vende Poké Ball atrás do balcão, junto com pilha e anzol. Ele te conhece desde pequeno e cobra o mesmo de todo mundo.',
    mult:1.0,
    itens:['Poké Ball','Potion','Antidote','Isca','Ração','Pilha','Cantil']
  },
  viridian: {
    nome:'Loja de Viridian',
    ar:'Fachada sem graça, prateleira organizada, e a atendente sabe exatamente o que um treinador de três dias esqueceu de comprar.',
    mult:1.0,
    itens:['Poké Ball','Great Ball','Potion','Super Potion','Antidote','Full Heal','Repelente','Corda','Bandagem','Mapa de Kanto','Sino Calmante','Mochila Verde','Bolsa Cinza']
  },
  pewter: {
    nome:'Casa de Ferragens Bacelar',
    ar:'Vende mais equipamento de escalada que item de treinador. A dona explica que é questão de demanda: aqui todo mundo trabalha em pedra.',
    mult:1.15,
    itens:['Poké Ball','Potion','Corda','Lanterna','Pilha','Máscara de pó','Bandagem','Caderno de campo','Punho de Ferro','Colete de Couro','Mochila Marrom']
  },
  cerulean: {
    nome:'Balcão da Ponte Sul',
    ar:'Atende pela janela, sem ninguém entrar. Tem geladeira de bebida e uma vitrine pequena com uma pedra azul que fica ali há anos.',
    mult:1.05,
    itens:['Poké Ball','Great Ball','Potion','Super Potion','Água Fresca','Full Heal','Revive','Isca','Pedra da Água','Botina Leve']
  },
  vermilion: {
    nome:'Armazém do Cais',
    ar:'Abre às cinco da manhã e vende comida, corda e Poké Ball no mesmo balcão. Metade do estoque é importado e entra sem imposto por um caminho que ninguém comenta.',
    mult:0.9,
    itens:['Poké Ball','Great Ball','Ultra Ball','Potion','Super Potion','Éter','Bota de borracha','Cobertor térmico','Câmera descartável','Corda','Cantil','Faixa Firme','Resto de Ração','Mochila Laranja','Bolsa Prateada']
  },
  lavender: {
    nome:'Casa Boa Memória',
    ar:'Vende incenso, vela e Potion no mesmo balcão, o que faz um sentido triste. Ninguém aqui vende repelente: ninguém daqui vai pro mato.',
    mult:1.1,
    itens:['Potion','Super Potion','Hyper Potion','Full Heal','Revive','Bandagem','Caderno de campo','Ração','Sino Calmante']
  },
  celadon: {
    nome:'Shopping de Celadon — 4º andar',
    ar:'Sete andares, e o quarto inteiro é item de treinador. Você fica quinze minutos parado só olhando prateleira. É o lugar mais barato de Kanto e o que menos te olha na cara.',
    mult:0.85,
    itens:['Poké Ball','Great Ball','Ultra Ball','Potion','Super Potion','Hyper Potion','Revive','Antidote','Full Heal','Éter','Elixir','Boneco','Repelente','Ração','Mapa de Kanto',
           'Pedra do Fogo','Pedra da Água','Pedra do Trovão','Pedra da Folha',
           'Resto de Ração','Faixa Firme','Punho de Ferro','Óculos Grossos','Colete de Couro','Botina Leve','Sino Calmante','Amuleto de Moeda','Mochila Preta','Mochila Vermelha','Mochila Azul','Mochila Amarela','Bolsa Roxa','Bolsa Branca','Bolsa Rosa','Bolsa Dourada']
  },
  fuchsia: {
    nome:'Posto da Zona Safári',
    ar:'Vende mais repelente que Poké Ball, e tem um cartaz explicando por quê. A fila é de gente de bermuda com chapéu novo.',
    mult:1.0,
    itens:['Poké Ball','Great Ball','Repelente','Isca','Máscara de pó','Corda','Água Fresca','Mapa de Kanto','Antidote','Full Heal','Resto de Ração']
  },
  saffron: {
    nome:'Conveniência Silph — térreo',
    ar:'Fica no térreo de um prédio comercial e tem fila de gente de crachá na hora do almoço. Tudo é caro e tudo tem nota fiscal.',
    mult:1.3,
    itens:['Poké Ball','Great Ball','Ultra Ball','Super Potion','Hyper Potion','Full Heal','Revive','Elixir','Éter','Caderno de campo','Câmera descartável','Óculos Grossos','Amuleto de Moeda','Mochila Preta','Bolsa Cinza']
  },
  cinnabar: {
    nome:'Vitrine da Sra. Zuca',
    ar:'É uma casa com uma vitrine. A dona atende de chinelo e leva tudo o que chega de barco, o que quer dizer que às vezes falta tudo.',
    mult:1.25,
    itens:['Poké Ball','Potion','Hyper Potion','Revive','Full Heal','Cobertor térmico','Bandagem','Pedra do Fogo','Punho de Ferro']
  }
};

function precoNaCidade(nome, idCidade){
  const L = LOJAS[idCidade];
  const base = PRECO_BASE[nome] || 500;
  const m = L ? L.mult : 1;
  return Math.round(base * m / 10) * 10;
}

function catalogoDaCidade(idCidade){
  const L = LOJAS[idCidade];
  if (!L) return [];
  return L.itens.map(n => [n, precoNaCidade(n, idCidade)]);
}

/* ============================================================
   TROCAS — uma por cidade, e cada uma tem gente dentro
   ============================================================ */
const TROCAS = {
  viridian: {
    quem:'Ademir, o do posto',
    onde:'atrás do posto de gasolina, com um rádio ligado no jogo',
    pede:19, da:{dex:52, nivel:[14,18], apelido:'Bigode', natureza:'Jolly'},
    fala:'"Eu preciso de um Rattata. Sério. Meu sogro tem alergia a Meowth e eu tenho um Meowth."',
    depois:'Ele solta o Rattata no quintal e o Rattata some no muro em quatro segundos. Ele não parece incomodado. "Era só pra ele sair de casa mesmo."',
    memoria:'Trocou o Meowth dele por um Rattata seu, por causa do sogro.'
  },
  pewter: {
    quem:'Nilton da pedreira',
    onde:'no portão de funcionários, no fim do turno da tarde',
    pede:75, da:{dex:67, nivel:[26,30], apelido:'Bloco', natureza:'Adamant'},
    trocaEvolui:true,
    fala:'"Eu tenho um Machoke e nenhuma pedra pra ele quebrar. Você tem Graveler? Aqui ele ia ser feliz."',
    depois:'Duas semanas depois chega um bilhete pelo Centro Pokémon: "O seu virou Golem no dia seguinte. Eu chorei um pouco. Nilton."',
    memoria:'Trocou um Machoke pelo seu Graveler no portão da pedreira.'
  },
  cerulean: {
    quem:'Lígia, da escola de natação',
    onde:'na borda rasa, depois da aula das crianças',
    pede:61, da:{dex:86, nivel:[24,28], apelido:'Bolha', natureza:'Calm'},
    fala:'"Meu Seel não gosta de água parada. Ele nasceu aqui e ele odeia piscina, dá pra acreditar?"',
    depois:'Ela leva o Poliwhirl pra piscina rasa e as crianças gritam de alegria, e é o som mais alto que essa cidade produziu o mês inteiro.',
    memoria:'Trocou o Seel dela pelo seu Poliwhirl, na escola de natação.'
  },
  vermilion: {
    quem:'Tunico ou outro menino do cais',
    onde:'na pedra do quebra-mar, no fim da tarde',
    pede:98, da:{dex:90, nivel:[22,26], apelido:'Tampa', natureza:'Impish'},
    fala:'"Eu acho Shellder demais e Krabby quase nunca. Você troca? É troca de igual, eu não tô querendo levar vantagem."',
    depois:'Ele guarda o Krabby na caixa de isopor com o pano molhado por cima, do jeito certo, e você entende que ele nunca ia vender aquele.',
    memoria:'Trocou um Shellder pelo seu Krabby, na pedra do quebra-mar.'
  },
  lavender: {
    quem:'o zelador da torre',
    onde:'no primeiro andar, entre as velas',
    pede:104, da:{dex:93, nivel:[30,34], apelido:'Sete', natureza:'Quiet'},
    trocaEvolui:true,
    fala:'"Tem um Haunter que mora no sétimo andar e que quer ir embora daqui. Eu não sei explicar como eu sei. Eu sei."\n"E ele quer o quê?"\n"Ele quer um Cubone. Não me pergunta por quê."',
    depois:'O zelador leva o Cubone pra dentro do terceiro andar e volta sem ele, e não explica, e você decide não perguntar.',
    memoria:'Trocou um Cubone pelo Haunter do sétimo andar da Torre.'
  },
  celadon: {
    quem:'a florista do térreo',
    onde:'na banca de flor da entrada de serviço do shopping',
    pede:29, da:{dex:32, nivel:[20,24], apelido:'Espeto', natureza:'Naughty'},
    fala:'"Eu tenho macho, você tem fêmea. Eu não vou explicar melhor que isso, moço, eu tenho quarenta e três anos e eu trabalho com planta."',
    depois:'Ela põe o Nidoran♀ numa caixa de papelão com furo e um pratinho de água e sai carregando pelo corredor de serviço, falando com ela o caminho inteiro.',
    memoria:'Trocou o Nidoran♂ dela pelo seu Nidoran♀, na banca de flor.'
  },
  fuchsia: {
    quem:'um guarda-parque de folga',
    onde:'no bar da esquina da reserva, na terceira dose',
    pede:102, da:{dex:113, nivel:[26,30], apelido:'Dona Chansey', natureza:'Gentle'},
    fala:'"Você acha que eu tô bêbado e eu tô, mas escuta: eu troco essa Chansey por um Exeggcute e eu não tô te enganando. Ela é boa demais pra mim. Eu durmo em alojamento."',
    depois:'No dia seguinte, sóbrio, ele te procura no Centro Pokémon. Você acha que ele vai voltar atrás. Ele só quer saber se ela comeu.',
    memoria:'Trocou a Chansey dele pelo seu Exeggcute. No dia seguinte ele foi perguntar se ela tinha comido.'
  },
  saffron: {
    quem:'uma mulher de crachá azul',
    onde:'na praça de alimentação, na hora do almoço, sozinha',
    pede:122, da:{dex:64, nivel:[30,34], apelido:'Sete e meia', natureza:'Modest'},
    trocaEvolui:true,
    fala:'"Eu tenho um Kadabra e eu não consigo mais ficar com ele."\n"Por quê?"\n"Porque ele sabe o que eu penso e eu trabalho onde eu trabalho."',
    depois:'Ela pega o Mr. Mime e vai embora sem terminar o almoço, e você repara que a bandeja dela estava intacta desde o começo.',
    memoria:'Trocou o Kadabra dela pelo seu Mr. Mime, na praça de alimentação. Ela não queria mais alguém lendo o que ela pensa.'
  },
  cinnabar: {
    quem:'o dono da pousada',
    onde:'na varanda, de frente pro vulcão',
    pede:77, da:{dex:126, nivel:[30,34], apelido:'Brasa', natureza:'Brave'},
    fala:'"Esse Magmar apareceu na cratera há dois anos e não foi mais embora. Ele dorme na minha lavanderia. Eu não posso mais pagar a conta de luz do ventilador."',
    depois:'Ele solta o Ponyta na encosta e o Ponyta fica parado olhando o mar por muito tempo, do jeito de quem nunca viu tanta água junta.',
    memoria:'Trocou o Magmar da lavanderia dele pelo seu Ponyta.'
  }
};

const Trocas = {
  daCidade(id){ return TROCAS[id] || null; },
  jaFez(id){ return !!Estado.dados.trocasFeitas && !!Estado.dados.trocasFeitas[id]; },
  candidatos(id){
    const t = TROCAS[id];
    if (!t) return [];
    return Estado.dados.time.filter(p => p.dex === t.pede && !p.morto);
  },

  /* tela: quem é, o que quer, e o que você tem pra dar */
  tela(){
    const id = Mundo.id();
    const t = this.daCidade(id);
    if (!t) return Exploracao.tela([{tipo:'info', texto:'Ninguém aqui está querendo trocar nada hoje.'}]);
    if (this.jaFez(id))
      return Exploracao.tela([{tipo:'info', texto:`${t.quem} te vê de longe e levanta a mão. A troca já foi feita, e ela foi boa para os dois.`}]);

    const esp = DEX[t.da.dex], pedido = DEX[t.pede];
    const meus = this.candidatos(id);
    const lista = meus.length
      ? meus.map(p => `<button class="escolha" onclick="Trocas.fazer('${p.uid}')">
          Trocar ${UI.esc(nomeExib(p))} (Nv ${p.nivel}, ${UI.esc(p.natureza)})
          <br><span class="pd">Isso não tem desfazer.</span></button>`).join('')
      : `<p class="nada">Você não tem nenhum ${UI.esc(pedido.nome)}. ${UI.esc(t.quem)} diz que espera.</p>`;

    UI.limpar();
    UI.add(UI.topo());
    UI.add(`<div class="painel">
      <div class="cap-cabecalho">
        <div class="num">troca</div>
        <div class="tit">${UI.esc(t.quem)}</div>
        <div class="loc">${UI.esc(t.onde)}</div>
      </div>
      <div class="narrativa">
        ${t.fala.split('\n').map(l=>`<p>${UI.esc(l)}</p>`).join('')}
        <p class="sussurro">Ele quer um ${UI.esc(pedido.nome)}. Ele oferece um ${UI.esc(esp.nome)}${t.da.apelido?` chamado ${UI.esc(t.da.apelido)}`:''}.</p>
      </div>
      <div id="avisos" class="avisos"></div>
      <div id="escolhas" class="escolhas">
        ${lista}
        <button class="escolha" onclick="Exploracao.tela()">Deixar pra depois.</button>
      </div>
    </div>`);
  },

  fazer(uid){
    const id = Mundo.id();
    const t = this.daCidade(id);
    const d = Estado.dados;
    const meu = d.time.find(p => p.uid === uid);
    if (!t || !meu) return;

    /* sai o seu */
    d.time = d.time.filter(p => p.uid !== uid);
    d.trocasFeitas = d.trocasFeitas || {};
    d.trocasFeitas[id] = {deu:meu.dex, recebeu:t.da.dex, dia:d.relogio.dia};

    /* entra o dele */
    const nivel = Dados.entre(t.da.nivel[0], t.da.nivel[1]);
    let dexNovo = t.da.dex;
    let virou = null;
    if (t.trocaEvolui && EVO_TROCA[dexNovo]){ virou = DEX[dexNovo].nome; dexNovo = EVO_TROCA[dexNovo]; }
    const novo = criarPokemon(dexNovo, nivel, {
      natureza: t.da.natureza,
      apelido: t.da.apelido,
      moral: 45,
      historia: `Veio de uma troca em ${LOCAIS[id].nome}, com ${t.quem}.`
    });
    novo.trocado = true;
    Estado.adicionar(novo);
    Estado.lembrarNPC(t.quem, {nome:t.quem, opiniao:3, memoria:t.memoria});
    Estado.registrar(`Trocou ${meu.nome} por ${novo.nome} em ${LOCAIS[id].nome}.`);
    Estado.marcar('ja_trocou');
    Estado.salvar('auto');

    const avisos = [
      {tipo:'pokemon', texto:`${nomeExib(novo)} (Nv ${novo.nivel}, ${novo.natureza}) entrou para o seu time.`},
      {tipo:'eco', texto:t.depois}
    ];
    if (virou) avisos.push({tipo:'evolucao', texto:`No segundo em que a bola encostou na sua mão, ${virou} mudou de forma. Ninguém sabe explicar por que a troca faz isso. Todo mundo já viu acontecer.`});
    avisos.push({tipo:'info', texto:`${nomeExib(novo)} obedece pior do que os seus. Ele não te escolheu e ainda não sabe o seu nome.`});
    Exploracao.tela(avisos);
  }
};
