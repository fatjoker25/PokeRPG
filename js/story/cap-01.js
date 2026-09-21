/* ============================================================
   CAPÍTULO 1 — A ÚLTIMA MANHÃ
   A saída de casa, sem pressa. A mochila começa vazia: licença,
   Pokédex, cartão e bolas saem do Centro Pokémon, com papel.
   ============================================================ */
/* A mesma manhã, começando de seis jeitos. O jogo sorteia um
   por partida, então duas jornadas nunca abrem igual. */
const ABERTURAS_C1 = ['c1_acorda','c1_chuva','c1_dormiu_demais','c1_nao_dormiu','c1_no_telhado',
                      'c1_vizinha','c1_apagao','c1_mala_trocada','c1_festa','c1_ele_sumiu'];

CAPITULOS.push(

{
num:1, titulo:'A Última Manhã', local:d=>d.jogador.cidade, ambiente:'campo', nivelArea:4,
tom:'leve',
entradas: ABERTURAS_C1,
inicio: () => Dados.escolher(ABERTURAS_C1),
cenas:{

c1_acorda:{
  texto:[
    'Você acorda catorze minutos antes do despertador, que é o que acontece com quem dormiu mal por antecipação.',
    'O quarto é o mesmo de sempre e hoje parece menor. A mochila está no chão, arrumada desde ontem, com a fivela de baixo que você nunca conseguiu consertar direito.',
    d=>{
      const p = d.time[0];
      if (!p) return 'Você está sozinho no quarto, o que não era o plano.';
      return `${nomeExib(p)} está aos pés da cama, acordado antes de você, com o olho fixo na mochila como se ela pudesse sair andando sozinha.`;
    },
    'Lá embaixo a panela bate na pia, o rádio toca baixo, e a voz que atravessa o assoalho é a mesma de todos os dias da sua vida.',
    d=>fala(nomeCasa(), `${d.jogador.nome.toUpperCase()}! Se o café esfriar eu não esquento de novo, e dessa vez eu falo sério!`, 'grita'),
    'Ela fala sério todo dia. Nunca foi sério nenhum dia. Hoje talvez seja.',
    d=>{
      const p = d.time[0];
      if (!p) return 'Você tem quinze anos e hoje é o dia.';
      return `${nomeExib(p)} levanta de uma vez, vai até a porta, volta, vai de novo. Ele entendeu antes de você que hoje é o dia.`;
    }
  ],
  escolhas:[
    {texto:'Ficar deitado mais cinco minutos. Você tem o resto da vida pra ter pressa.', vai:'c1_cinco_minutos'},
    {texto:'Levantar e olhar as coisas do quarto uma última vez.', vai:'c1_quarto'},
    {texto:'Conferir a mochila de novo, pela quarta vez.', vai:'c1_mochila'},
    {texto:'Descer direto. Enrolar só piora.', vai:'c1_cozinha'}
  ]
},

/* ── outras maneiras de a mesma manhã começar ─────────────── */

c1_chuva:{
  texto:[
    'Choveu a noite inteira e ainda está chovendo, daquele jeito fino que não molha de uma vez e molha tudo no fim.',
    'Você acorda com o barulho da calha entupida batendo na lata do quintal, um pingo a cada dois segundos, e com a certeza incômoda de que era hoje que você ia sair de casa.',
    d=>{
      const p = d.time[0];
      if (!p) return 'A mochila está no chão, arrumada desde ontem, encostada na parede que dá pro lado da chuva.';
      return `${nomeExib(p)} está sentado na janela, olhando a água escorrer no vidro, com aquela atenção de bicho que não entende chuva e nunca vai entender.`;
    },
    'Lá embaixo a porta dos fundos abre e fecha duas vezes seguidas, que é o barulho de alguém decidindo se ainda vale a pena salvar a roupa do varal.',
    d=>fala(nomeCasa(), 'Chuva de março não dura! Isso aí limpa até as dez!', 'grita',
            'Ela não faz ideia. Ninguém faz. Mas é o que se diz em março.'),
    'Ninguém vai falar em adiar. Você também não vai. Mas todo mundo nesta casa está pensando nisso.'
  ],
  ef:{flag:'comecou_na_chuva', registrar:'Saiu de casa num dia de chuva fina.'},
  escolhas:[
    {texto:'Descer e consertar a calha antes de qualquer coisa.', vai:'c1_calha'},
    {texto:'Ficar na janela um tempo, junto com ele.', vai:'c1_janela_chuva'},
    {texto:'Conferir a mochila: chuva estraga papel.', vai:'c1_mochila'},
    {texto:'Descer. Chuva não é motivo.', vai:'c1_cozinha'}
  ]
},

c1_calha:{
  texto:[
    'Você desce de chinelo, arrasta o banquinho, sobe e enfia a mão na calha.',
    'É folha. É sempre folha. Sai um punhado marrom e pesado e a água desce de uma vez, num jorro, e molha você da cabeça aos pés.',
    'Da porta dos fundos vem uma gargalhada que começa e não consegue parar.',
    d=>fala(nomeCasa(), 'Quinze anos esperando essa calha e você vai embora no dia que resolve mexer nela!', 'riso'),
    d=>fala(nomeCasa(), 'Deixa. Deixa que o resto eu limpo.', null, 'E não é da calha que ela está falando.'),
    'Você desce do banquinho encharcado no dia em que ia sair de casa, e por algum motivo isso melhora tudo.'
  ],
  ef:{moral:3, rep:{eixo:'bom',delta:1,motivo:'Consertou a calha antes de ir embora'},
      registrar:'Desentupiu a calha da casa antes de sair.'},
  escolhas:[
    {texto:'Entrar e tomar café molhado mesmo.', vai:'c1_cozinha'},
    {texto:'Trocar de roupa primeiro e conferir a mochila.', vai:'c1_mochila'}
  ]
},

c1_janela_chuva:{
  texto:[
    'Você senta no chão do lado da janela e fica.',
    d=>{
      const p = d.time[0];
      if (!p) return 'A água desce no vidro em linhas que se encontram e viram uma linha só. Dá pra ficar olhando isso por muito tempo.';
      return `${nomeExib(p)} não desgruda do vidro. De vez em quando ele encosta o focinho e o vidro embaça e ele tira, e o embaçado some, e ele encosta de novo.`;
    },
    'Duas gotas que descem separadas se encontram no meio do vidro e viram uma gota só, mais rápida, e chegam embaixo antes de todas as outras.',
    'Você fica uns bons dez minutos nisso e depois percebe que está adiando.'
  ],
  ef:{moral:2},
  escolhas:[
    {texto:'Levantar e olhar o quarto uma última vez.', vai:'c1_quarto'},
    {texto:'Descer para a cozinha.', vai:'c1_cozinha'},
    {texto:'Descer e consertar a calha.', vai:'c1_calha'}
  ]
},

c1_dormiu_demais:{
  texto:[
    'Você acorda às nove e quarenta com a luz batendo toda errada no quarto e leva três segundos inteiros para entender o que isso significa.',
    'O despertador está desligado. Não tocou, ou tocou e alguém desligou, e você sabe qual das duas foi.',
    d=>{
      const p = d.time[0];
      if (!p) return 'A casa está silenciosa de um jeito que casa com gente dentro nunca fica.';
      return `${nomeExib(p)} está acordado há horas, sentado ao lado da mochila, com a paciência de quem não tem relógio e não precisa de um.`;
    },
    'Lá embaixo não tem barulho de panela, nem rádio, nem ninguém. A casa está do tamanho errado.',
    'Na mesa da cozinha, um prato com um pano por cima e um papel dobrado ao lado.'
  ],
  ef:{flag:'dormiu_demais', registrar:'Acordou às 9h40 do dia de sair de casa. A casa estava vazia.'},
  escolhas:[
    {texto:'Ler o papel.', vai:'c1_o_papel'},
    {texto:'Comer primeiro. O papel não vai embora.', vai:'c1_comeu_frio'},
    {texto:'Conferir a mochila enquanto pensa.', vai:'c1_mochila'},
    {texto:'Sair sem ler e sem comer.', vai:'c1_rua'}
  ]
},

c1_o_papel:{
  texto:[
    'É meia folha de caderno, escrita com a letra que você conhece desde que aprendeu a ler.',
    d=>fala(nomeCasa(), 'Eu não te acordei de propósito. Dormir era a única coisa que eu ainda podia te dar hoje.'),
    d=>fala(nomeCasa(), 'O café está embaixo do pano. Tem mais no armário de cima — o de cima mesmo, não o que você sempre abre.'),
    d=>fala(nomeCasa(), 'E não volta por obrigação. Volta quando der vontade. É diferente, e é melhor.'),
    'Embaixo, sem assinatura, numa letra menor e mais apertada, como se tivesse sido escrita depois de dobrar o papel uma vez:',
    d=>fala(nomeCasa(), 'Eu fui trabalhar porque eu não ia aguentar a porta.', 'baixo')
  ],
  ef:{moral:4, flag:'leu_o_bilhete',
      rep:{eixo:'bom',delta:1,motivo:'Leu o bilhete antes de sair'},
      registrar:'O bilhete: eu fui trabalhar porque eu não ia aguentar a porta.'},
  escolhas:[
    {texto:'Escrever uma resposta no verso e deixar na mesa.', vai:'c1_resposta_bilhete'},
    {texto:'Dobrar o papel e guardar no bolso de dentro.', vai:'c1_guardou_bilhete'},
    {texto:'Comer o que está embaixo do pano.', vai:'c1_comeu_frio'}
  ]
},

c1_resposta_bilhete:{
  texto:[
    'Você vira a folha e escreve no verso, e leva muito mais tempo do que uma linha deveria levar.',
    'Você escreve três versões na cabeça e escreve a quarta no papel, que é a mais curta.',
    'Eu vou voltar. Não por obrigação.',
    'Depois você encosta o papel embaixo do açucareiro, que é onde esta casa deixa recado desde sempre, e olha uma última vez para ter certeza de que está bem visível.',
    'Está.'
  ],
  ef:{moral:4, flag:'respondeu_o_bilhete',
      rep:{eixo:'bom',delta:1,motivo:'Deixou resposta escrita antes de sair'},
      registrar:'Deixou uma resposta embaixo do açucareiro.'},
  escolhas:[
    {texto:'Comer e sair.', vai:'c1_comeu_frio'},
    {texto:'Sair agora.', vai:'c1_rua'}
  ]
},

c1_guardou_bilhete:{
  texto:[
    'Você dobra o papel em quatro e põe no bolso de dentro da jaqueta, contra o peito, onde não amassa e não molha.',
    'Ele vai ficar aí por muito tempo. Vai amassar assim mesmo, nas dobras, de tanto você abrir e fechar.'
  ],
  ef:{itens:{'Bilhete dobrado em quatro':1}, moral:3,
      registrar:'Guardou o bilhete no bolso de dentro.'},
  escolhas:[
    {texto:'Comer o que ficou embaixo do pano.', vai:'c1_comeu_frio'},
    {texto:'Sair.', vai:'c1_rua'}
  ]
},

c1_comeu_frio:{
  texto:[
    'Você levanta o pano e é ovo com arroz, frio, e tem mais comida do que uma pessoa come de manhã.',
    'Você come tudo, em pé, na bancada, olhando a cozinha vazia.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} ganha o que sobra, por baixo da bancada, e dessa vez não precisa ser segredo de ninguém.`
               : 'O relógio da parede está três minutos adiantado, como sempre esteve, e ninguém nunca acertou.';
    },
    'Depois você lava o prato, seca e guarda no lugar, o que é a coisa mais boba e mais necessária que você vai fazer hoje.'
  ],
  ef:{moral:2, registrar:'Comeu e lavou o prato numa cozinha vazia.'},
  escolhas:[
    {texto:'Olhar o quarto uma última vez.', vai:'c1_quarto'},
    {texto:'Conferir a mochila.', vai:'c1_mochila'},
    {texto:'Sair.', vai:'c1_rua'}
  ]
},

c1_nao_dormiu:{
  texto:[
    'Você não dormiu.',
    'Não foi insônia, não foi medo e não foi ansiedade. Você deitou às onze, ficou olhando o teto, e em algum momento parou de tentar e passou a só esperar clarear.',
    'Você viu a janela mudar de preto para azul e do azul para o cinza, e o cinza demora mais do que as pessoas imaginam.',
    d=>{
      const p = d.time[0];
      if (!p) return 'Às quatro e meia passou um caminhão na estrada, e depois não passou mais nada.';
      return `${nomeExib(p)} acordou às quatro e vinte, olhou você, entendeu na hora que você estava acordado, e ficou acordado também. Não fez nada. Só ficou.`;
    },
    'Às seis e dez o Dodrio do vizinho grita as três cabeças ao mesmo tempo, como faz todo dia, e como todo dia ele erra a hora.',
    'Você senta na cama. Está cansado de um jeito que não vai passar com sono.'
  ],
  ef:{flag:'nao_dormiu', hp:-2, causa:'Noite em claro antes de sair de casa',
      registrar:'Passou a última noite em casa acordado.'},
  escolhas:[
    {texto:'Tentar dormir mais quarenta minutos.', vai:'c1_quarenta_minutos'},
    {texto:'Levantar e olhar o quarto com calma, já que dá tempo.', vai:'c1_quarto'},
    {texto:'Descer antes de todo mundo e fazer o café.', vai:'c1_fez_o_cafe'},
    {texto:'Sair de casa agora, antes de alguém acordar.', vai:'c1_saiu_no_escuro'}
  ]
},

c1_quarenta_minutos:{
  texto:[
    'Você deita de novo e dorme em quatro minutos, que é o que acontece quando a gente para de tentar.',
    'E aí você sonha com uma coisa que não faz sentido nenhum e que você vai esquecer em duas horas: uma estrada que sobe e não tem fim, e você não está cansado no sonho, e isso é a parte boa.',
    'Batem na porta do quarto às sete e meia, de leve, com dois dedos.',
    d=>fala(nomeCasa(), 'Tá na hora.', 'baixo', 'Duas palavras. Ela ensaiou a noite inteira e escolheu duas palavras.')
  ],
  ef:{hp:2, moral:2},
  escolhas:[
    {texto:'Descer para a cozinha.', vai:'c1_cozinha'},
    {texto:'Conferir a mochila antes.', vai:'c1_mochila'}
  ]
},

c1_fez_o_cafe:{
  texto:[
    'Você desce às seis e vinte e faz o café, o que é uma coisa que nesta casa você nunca fez.',
    'Você erra a medida, faz forte demais, e não tem como consertar.',
    d=>`Quando ${casaCompleto()} desce, vinte minutos depois, ela para na porta da cozinha e não diz nada por uns bons cinco segundos.`,
    'Depois senta. Toma o café forte demais até o fim, sem fazer careta, sem pôr água, sem falar da medida.',
    d=>fala(nomeCasa(), 'Tá bom.'),
    'Não estava. Estava horrível. Mas estava.'
  ],
  ef:{moral:5, rep:{eixo:'bom',delta:1,motivo:'Fez o café no último dia em casa'},
      flag:'fez_o_cafe',
      registrar:'Fez o café da manhã pela primeira vez, no dia de sair.'},
  escolhas:[
    {texto:'Sentar e comer junto.', vai:'c1_cozinha'},
    {texto:'Ir conferir a mochila enquanto ela toma.', vai:'c1_mochila'}
  ]
},

c1_saiu_no_escuro:{
  texto:[
    'Você pega a mochila, desce a escada pisando nas beiradas dos degraus que rangem, e abre a porta às seis e vinte e dois.',
    'A rua está vazia e fria e tem um Growlithe dormindo na porta do mercado que abre tarde.',
    'Você anda quatro casas.',
    'E aí você para.',
    'Você para porque sair assim é a única coisa que não dá pra desfazer depois, e porque você já sabe exatamente como vai ser o resto da sua vida lembrando disso.'
  ],
  ef:{flag:'tentou_sair_no_escuro'},
  escolhas:[
    {texto:'Voltar. Entrar de novo. Fazer direito.', vai:'c1_voltou_pra_dentro'},
    {texto:'Continuar andando.', vai:'c1_foi_sem_despedir'}
  ]
},

c1_voltou_pra_dentro:{
  texto:[
    d=>`Você volta as quatro casas, abre a porta, e ${casaCompleto()} está em pé na cozinha, de costas, colocando água no fogo.`,
    'Ela não se vira.',
    d=>fala(nomeCasa(), 'Eu ouvi a porta.', 'frio'),
    'O fósforo risca. O fogo pega. Ela ajusta a chama como se aquilo fosse a coisa mais importante da manhã.',
    d=>fala(nomeCasa(), 'Eu ia deixar você ir assim, se fosse isso que você quisesse. Eu ia ficar aqui e ia deixar.'),
    d=>fala(nomeCasa(), 'Senta.'),
    'Você senta.'
  ],
  ef:{moral:5, limpaFlag:'tentou_sair_no_escuro',
      rep:{eixo:'bom',delta:2,motivo:'Voltou para se despedir direito'},
      registrar:'Saiu no escuro, andou quatro casas e voltou.'},
  escolhas:[
    {texto:'Tomar o café.', vai:'c1_cozinha'},
    {texto:'Olhar o quarto uma última vez antes.', vai:'c1_quarto'},
    {texto:'Conferir a mochila antes de descer.', vai:'c1_mochila'}
  ]
},

c1_foi_sem_despedir:{
  texto:[
    'Você continua andando.',
    'Passa o mercado, passa a escola, passa a placa da saída da cidade, e não olha pra trás em nenhum dos três.',
    'É mais fácil. É muito mais fácil, e é por isso que tanta gente faz assim.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} olha pra trás por vocês dois, três vezes, e na terceira você puxa ele pelo ombro sem falar nada.`
               : 'Você olha pra trás uma vez, na placa, e depois não olha mais.';
    },
    'Você vai carregar essa manhã por muito tempo, e não do jeito bonito.',
    'No bolso de fora da mochila, onde você não põe nada, tem uma coisa que você não pôs ali: um aparelho azul de tampa, do tamanho da sua palma, com a tinta gasta nos cantos.',
    'Um PokéNav. Foi guardado aí em algum momento da noite, por alguém que não te acordou pra dizer que tinha guardado.',
    d=>fala(nomeCasa(), 'o número daqui já tá gravado', 'baixo',
            'Escrito a lápis numa tira de papel enrolada na tampa, em letra apressada.')
  ],
  ef:{flag:'foi_sem_despedir', moral:-6,
      rep:{eixo:'ruim',delta:1,motivo:'Saiu de casa sem se despedir de ninguém'},
      registrar:'Saiu de casa sem se despedir.',
      executar:d=>{
        Estado.ganharPokenav();
        return [{tipo:'item', texto:'Ganhou um PokéNav. Estava no bolso de fora desde a noite passada.'}];
      }},
  escolhas:[
    {texto:'Seguir para o Centro Pokémon.', vai:'c1_saida_pro_centro'},
    {texto:'Dar uma volta na rua antes de ir ao Centro.', vai:'c1_rua', cond:d=>!d.npcs['Sr. Ushio']}
  ]
},

c1_no_telhado:{
  texto:[
    'Você passou a noite no telhado, o que é uma coisa que se faz nesta casa desde que você tem doze anos e que ninguém nunca proibiu direito.',
    'Sobe-se pela janela do corredor, pisa-se na caixa d’água, e dali dá pra ver a cidade inteira, que não é grande coisa e é tudo.',
    d=>{
      const p = d.time[0];
      if (!p) return 'A telha esquenta com o corpo da gente e depois esfria de novo quando a gente muda de posição, e a noite inteira é isso.';
      return `${nomeExib(p)} subiu junto, do jeito desengonçado de sempre, e dormiu encaixado entre você e a chaminé que não funciona.`;
    },
    'Do telhado, às cinco e quarenta, dá pra ver a luz da cozinha acender antes de todas as outras da rua.',
    'É a sua casa acordando, e você está em cima dela, e é a última vez que essas duas coisas vão ser verdade ao mesmo tempo por muito tempo.'
  ],
  ef:{flag:'noite_no_telhado', hp:-1, causa:'Noite no telhado', moral:3,
      registrar:'Passou a última noite em cima do telhado de casa.'},
  escolhas:[
    {texto:'Ficar até o sol subir de verdade.', vai:'c1_sol_no_telhado'},
    {texto:'Descer agora, antes de darem pela sua falta.', vai:'c1_cozinha'},
    {texto:'Contar as casas da cidade, uma por uma.', vai:'c1_contou_as_casas'},
    {texto:'Descer e conferir a mochila.', vai:'c1_mochila'}
  ]
},

c1_sol_no_telhado:{
  texto:[
    'O sol sobe atrás do morro às seis e quarenta e nove e leva uns quatro minutos pra ficar inteiro.',
    'Primeiro as telhas do outro lado da rua ficam laranja. Depois a placa do mercado. Depois o seu joelho.',
    'Você fica olhando isso e pensa, sem querer pensar, que o sol vai fazer isso todo dia aqui, com ou sem você, e que essa é a coisa mais tranquila e mais insuportável que existe.',
    'Lá embaixo, a porta da cozinha abre e alguém chama o seu nome sem levantar a voz, do jeito de quem já sabe onde você está.'
  ],
  ef:{moral:3},
  escolhas:[
    {texto:'Responder e descer.', vai:'c1_cozinha'},
    {texto:'Ficar quieto mais um minuto.', vai:'c1_mais_um_minuto'}
  ]
},

c1_mais_um_minuto:{
  texto:[
    'Você fica quieto.',
    'Lá embaixo, a pessoa espera. Não chama de novo, não sobe, não vai embora.',
    'Passa um minuto inteiro assim: você em cima sem responder, ela embaixo sem insistir.',
    'Depois você ouve a porta da cozinha fechar, e o barulho da panela recomeçar, e entende que ela sabia que você ia descer e resolveu deixar o minuto ser seu.'
  ],
  ef:{moral:2, registrar:'Ficou mais um minuto no telhado. Deixaram o minuto ser seu.'},
  escolhas:[
    {texto:'Descer.', vai:'c1_cozinha'},
    {texto:'Gritar de cima que já vai, só pra ela parar de esperar em silêncio.', vai:'c1_gritou_de_cima'},
    {texto:'Conferir a mochila mais uma vez antes.', vai:'c1_mochila'}
  ]
},

c1_gritou_de_cima:{
  texto:[
    d=>fala(d.jogador.nome, 'JÁ VOU!', 'grita'),
    'Lá embaixo, a resposta demora dois segundos.',
    d=>fala(nomeCasa(), 'EU NÃO PERGUNTEI NADA!', 'grita'),
    'Vocês dois estão gritando de andares diferentes de uma casa de dois andares, sobre uma coisa que ninguém perguntou, no último dia.',
    'É exatamente assim que esta casa funciona, e você vai sentir falta disso de um jeito que não dá pra explicar pra ninguém.'
  ],
  ef:{moral:3, rep:{eixo:'bom',delta:1,motivo:'Gritou de volta, que é como esta casa conversa'},
      registrar:'Gritou de cima que já ia. Ela gritou de volta que não tinha perguntado.'},
  escolhas:[
    {texto:'Descer rindo.', vai:'c1_cozinha'},
    {texto:'Conferir a mochila enquanto o riso passa.', vai:'c1_mochila'}
  ]
},

c1_contou_as_casas:{
  texto:[
    'Você conta as casas da cidade do telhado, o que já fez mil vezes e nunca terminou igual.',
    'Dá quarenta e uma. Já deu trinta e nove e já deu quarenta e três, dependendo do que você resolve chamar de casa.',
    'O galpão dos fundos do mercado conta? A casa que caiu e viraram duas contam como duas?',
    'Você decide que sim para as duas coisas e chega em quarenta e quatro, e escreve o número na parte de dentro do braço com a caneta, porque não quer esquecer.',
    'Você não vai esquecer.'
  ],
  ef:{flag:'contou_as_casas', moral:2,
      registrar:'Quarenta e quatro casas, contadas do telhado na última manhã.'},
  escolhas:[
    {texto:'Ficar até o sol subir.', vai:'c1_sol_no_telhado'},
    {texto:'Descer.', vai:'c1_cozinha'}
  ]
},

c1_vizinha:{
  texto:[
    'Socam a porta da frente às seis e cinquenta. Ninguém soca a porta desta casa às seis e cinquenta.',
    'É a Sra. Chiyo, do número dezoito, de camisola e casaco por cima, com uma caixa de papelão nos braços e cara de quem não vai negociar.',
    fala('Sra. Chiyo', 'Passou a noite inteira embaixo do meu carro. A NOITE INTEIRA.', 'grita',
         'Ela te empurra a caixa antes de qualquer bom dia.'),
    fala('Sra. Chiyo', 'E eu pego o ônibus das oito pra Cerulean. Eu não levo bicho no ônibus, menino, e nem a pau eu deixo ele aqui sozinho.'),
    'Dentro da caixa, em cima de um pano de prato, tem um Pokémon pequeno e molhado, acordado, olhando pra cima.',
    'Ele não está ferido. Está com fome, com frio, e com a expressão exata de quem já foi devolvido antes.'
  ],
  ef:{flag:'a_caixa_da_odete',
      npc:{nome:'Sra. Chiyo', opiniao:1, memoria:'Bateu na sua porta às 6h50 do dia em que você ia sair de casa.'},
      registrar:'A Sra. Chiyo apareceu com uma caixa e um bicho molhado dentro.'},
  escolhas:[
    {texto:'"Eu fico com ele."', vai:'c1_ficou_com_ele'},
    {texto:'"Eu levo ao Centro Pokémon. É pra lá que eu vou de qualquer jeito."', vai:'c1_leva_ao_centro'},
    {texto:'"Eu não posso, dona Chiyo. Eu saio hoje."', vai:'c1_recusou_a_caixa'},
    {texto:d=>`Chamar ${nomeCasa()} pra decidir junto.`, vai:'c1_chamou_de_dentro'}
  ]
},

c1_ficou_com_ele:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu fico com ele.'),
    'A Sra. Chiyo tinha três argumentos prontos e acabou de perder todos de uma vez. Fica um segundo inteiro de boca aberta.',
    fala('Sra. Chiyo', 'Você sai hoje.'),
    d=>fala(d.jogador.nome, 'Saio.'),
    fala('Sra. Chiyo', 'E vai levar ele.'),
    d=>fala(d.jogador.nome, 'Vou.'),
    fala('Sra. Chiyo', '...Tá.', 'baixo',
         'Ela entrega o pano de prato junto, que não era pra entregar. Depois pede de volta. Depois deixa.')
  ],
  ef:{flag:'ficou_com_o_bicho', moral:4,
      rep:{eixo:'bom',delta:2,motivo:'Assumiu um bicho encontrado no dia em que saiu de casa'},
      executar:d=>{
        const especies = [19, 16, 10, 13, 21, 41, 52];       // os que vivem debaixo de carro
        const dex = Dados.escolher(especies);
        const p = criarPokemon(dex, Dados.entre(3,5), {moral:40});
        p.historia = 'Passou a noite embaixo do carro da Sra. Chiyo. Já tinha sido devolvido antes.';
        const onde = Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv ${p.nivel}) entrou no seu time. Moral 40 — ele ainda não confia em ninguém.${notaDestino(onde)}`}];
      },
      registrar:'Ficou com o Pokémon da caixa.'},
  escolhas:[
    {texto:'Levar ele para a cozinha e dar comida.', vai:'c1_cozinha'},
    {texto:'Conferir a mochila: agora são dois.', vai:'c1_mochila'}
  ]
},

c1_leva_ao_centro:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu levo ao Centro Pokémon. É pra lá que eu vou de qualquer jeito.'),
    'A Sra. Chiyo bate na caixa duas vezes, como quem fecha negócio, e já está descendo o degrau antes de você terminar a frase.',
    fala('Sra. Chiyo', 'A caixa eu quero de volta, viu! É a caixa do meu ventilador!', 'grita',
         'Ela grita isso da calçada, já de costas.'),
    'Você fica na porta de casa, de pijama, às seis e cinquenta e dois, segurando a caixa de um ventilador com um bicho dentro.',
    'A sua jornada começou tecnicamente agora, e não foi nada do que você imaginou nos últimos três anos.'
  ],
  ef:{flag:'leva_a_caixa', itens:{'Caixa de ventilador com um bicho dentro':1},
      rep:{eixo:'bom',delta:1,motivo:'Aceitou levar o bicho ao Centro Pokémon'},
      registrar:'Vai levar o bicho da Sra. Chiyo ao Centro Pokémon. A caixa tem que voltar.'},
  escolhas:[
    {texto:'Entrar e tomar café antes.', vai:'c1_cozinha'},
    {texto:'Trocar de roupa e ir direto.', vai:'c1_saida_pro_centro'}
  ]
},

c1_recusou_a_caixa:{
  texto:[
    d=>fala(d.jogador.nome, 'Eu não posso, dona Chiyo. Eu saio hoje.'),
    'Ela olha pra você por um tempo que passa do confortável.',
    fala('Sra. Chiyo', 'Eu sei que você sai hoje. A rua inteira sabe que você sai hoje.', 'frio'),
    'Ela ajeita a caixa nos braços. A caixa não mudou de peso. Alguma coisa ali mudou de peso.',
    fala('Sra. Chiyo', 'Tudo bem, filho. Eu deixo na porta do Centro antes de pegar o ônibus.'),
    'E vai embora. E é justamente o tudo bem que fica atravessado.'
  ],
  ef:{flag:'recusou_a_caixa', moral:-3,
      registrar:'Recusou a caixa da Sra. Chiyo.'},
  escolhas:[
    {texto:'Chamar ela de volta.', vai:'c1_chamou_de_volta'},
    {texto:'Fechar a porta e descer para a cozinha.', vai:'c1_cozinha'}
  ]
},

c1_chamou_de_volta:{
  texto:[
    d=>fala(d.jogador.nome, 'DONA ODETE!', 'grita'),
    'Ela para no meio da rua e se vira. Não parece nem um pouco surpresa, e é isso que pega.',
    d=>fala(d.jogador.nome, 'Eu levo.'),
    'Ela volta os oito passos e entrega a caixa sem dizer uma palavra.',
    fala('Sra. Chiyo', '...eu sabia. Eu sabia, eu sabia, eu sabia.', 'baixo',
         'Ela vai falando sozinha o caminho inteiro de volta.')
  ],
  ef:{limpaFlag:'recusou_a_caixa', flag:'leva_a_caixa', moral:3,
      itens:{'Caixa de ventilador com um bicho dentro':1},
      rep:{eixo:'bom',delta:1,motivo:'Chamou de volta e assumiu'},
      registrar:'Chamou a Sra. Chiyo de volta e ficou com a caixa.'},
  escolhas:[
    {texto:'Entrar e se arrumar.', vai:'c1_cozinha'},
    {texto:'Olhar o quarto uma última vez antes.', vai:'c1_quarto'},
    {texto:'Conferir a mochila antes de descer.', vai:'c1_mochila'}
  ]
},

c1_chamou_de_dentro:{
  texto:[
    d=>`Você chama pra dentro e ${casaCompleto()} vem até a porta secando a mão no pano.`,
    'As duas conversam por cima de você, do jeito que adulto de rua pequena conversa: sem cumprimento, direto no assunto, duas frases cada uma.',
    fala('Sra. Chiyo', 'E o menino sai hoje.'),
    d=>fala(nomeCasa(), 'Sai.'),
    'Um silêncio de quatro segundos que decide tudo.',
    d=>fala(nomeCasa(), 'Então deixa aqui. Eu cuido até ele achar dono.', null,
            'Ela pega a caixa e olha pra você por cima dela. Não diz mais nada, porque não precisa.')
  ],
  ef:{flag:'a_caixa_ficou_em_casa', moral:2,
      registrar:'O bicho da caixa ficou em casa. Alguém vai cuidar até achar dono.'},
  escolhas:[
    {texto:'Entrar com ela.', vai:'c1_cozinha'},
    {texto:'Ficar mais um pouco na porta, olhando a rua.', vai:'c1_rua'}
  ]
},

/* ── abertura 7: a cidade sem luz ─────────────────────────── */
c1_apagao:{
  texto:[
    'Acabou a luz da cidade inteira às cinco e quarenta da manhã, e a primeira coisa que você entende, antes mesmo de acordar direito, é que o ventilador parou.',
    'A segunda coisa que você entende é que hoje é o dia, e que o seu despertador é elétrico.',
    d=>{
      const p = d.time[0];
      if (!p) return 'No escuro, a sua mochila está exatamente onde você deixou, o que é a única coisa confiável desta manhã.';
      return `${nomeExib(p)} está em pé no meio do quarto, tenso, olhando pro teto como se a escuridão fosse uma coisa que dá pra encarar.`;
    },
    d=>fala(nomeCasa(), 'É a rua toda! Não mexe no disjuntor que não é o disjuntor!', 'grita',
            'A voz vem lá de baixo, no escuro, com uma certeza que só quem já passou por isso tem.'),
    'Pela janela dá pra ver a cidade sem um poste aceso, e o céu com mais estrela do que você lembrava que tinha.'
  ],
  ef:{flag:'comecou_no_apagao', registrar:'Saiu de casa no dia em que a cidade amanheceu sem luz.'},
  escolhas:[
    {texto:'Descer no escuro e ajudar a achar a vela.', vai:'c1_vela'},
    {texto:'Ficar na janela olhando as estrelas enquanto dá.', vai:'c1_estrelas'},
    {texto:'Conferir a mochila no escuro, pelo tato.', vai:'c1_mochila_escuro'},
    {texto:'Descer direto. Luz volta ou não volta.', vai:'c1_cozinha'}
  ]
},
c1_vela:{
  texto:[
    'A vela fica na terceira gaveta, atrás do barbante, e você acha ela de primeira porque você é quem sempre acha.',
    d=>fala(nomeCasa(), 'Como é que você acha essas coisas no escuro, criatura.', 'riso'),
    d=>fala(nomeCasa(), 'Vai fazer falta, isso. Isso aí vai fazer falta nesta casa.', 'baixo'),
    'E aí ela fica quieta, porque falou uma coisa que não pretendia falar hoje.'
  ],
  ef:{moral:3, rep:{eixo:'bom',delta:1,motivo:'Achou a vela no escuro, no último dia em casa'},
      registrar:'Achou a vela no apagão.'},
  escolhas:[
    {texto:'Fazer o café na chama da vela.', vai:'c1_fez_o_cafe'},
    {texto:'Sentar e esperar a luz voltar junto.', vai:'c1_cozinha'}
  ]
},
c1_estrelas:{
  texto:[
    'Você abre a janela inteira e senta no parapeito, que é largo o suficiente e que sua casa nunca achou perigoso.',
    'Sem poste nenhum aceso, o céu de Kanto é uma coisa completamente diferente. Tem faixa de estrela onde você jurava que era só escuro.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} sobe no parapeito com você, atrapalhando, e fica olhando pra cima porque você está olhando pra cima.`
               : 'Passa um Hoothoot em algum lugar e você não vê, só ouve.';
    },
    'Você fica ali até o céu começar a clarear, e quando a luz volta — às seis e vinte, de uma vez, com a cidade inteira acendendo junto — é quase uma pena.'
  ],
  ef:{moral:4, flag:'viu_o_ceu_sem_poste',
      registrar:'Viu o céu de Pallet sem um poste aceso.'},
  escolhas:[
    {texto:'Descer para a cozinha.', vai:'c1_cozinha'},
    {texto:'Olhar o quarto uma última vez.', vai:'c1_quarto'},
    {texto:'Conferir a mochila.', vai:'c1_mochila'}
  ]
},
c1_mochila_escuro:{
  texto:[
    'Você confere a mochila inteira no escuro, só pelo tato, e é a quarta vez que você confere e a primeira em que você acerta tudo de primeira.',
    'Cantil. Casaco. A muda de roupa enrolada. O mapa que já estava velho quando te deram.',
    'Você conhece cada coisa dessa mochila pelo formato, o que significa que você arrumou ela mais vezes do que admitiria em voz alta.'
  ],
  ef:{moral:2, rep:{eixo:'bom',delta:1,motivo:'Conhece a própria mochila no escuro'},
      registrar:'Conferiu a mochila no escuro, de cor.'},
  escolhas:[
    {texto:'Descer.', vai:'c1_cozinha'},
    {texto:'Ficar na janela até clarear.', vai:'c1_estrelas'}
  ]
},

/* ── abertura 8: a mochila errada ─────────────────────────── */
c1_mala_trocada:{
  texto:[
    'Você acorda às sete com a casa já em movimento e desce achando que está tudo resolvido.',
    'A mochila está na porta, arrumada, fechada, com a fivela de baixo consertada com arame — coisa que ninguém te avisou que ia fazer.',
    'Você abre pra conferir e para.',
    'Não é a sua mochila. É a mochila de quem saiu desta casa antes de você, guardada no armário de cima há tempo demais, e alguém passou a noite transferindo as suas coisas pra dentro dela.',
    d=>fala(nomeCasa(), 'A sua não ia aguentar Viridian.', null, 'Dito da cozinha, sem se virar, no tom de quem decidiu sozinha e não vai discutir.'),
    d=>fala(nomeCasa(), 'Essa aqui aguentou coisa pior.')
  ],
  ef:{flag:'mochila_herdada', moral:5,
      registrar:'Saiu com a mochila de quem saiu desta casa antes.'},
  escolhas:[
    {texto:'Perguntar de quem era.', vai:'c1_de_quem_era'},
    {texto:'Não perguntar. Fechar a fivela e agradecer.', vai:'c1_nao_perguntou'},
    {texto:'Olhar os bolsos de dentro antes de qualquer coisa.', vai:'c1_bolso_de_dentro'},
    {texto:'Descer e tomar café com ela na mesa.', vai:'c1_cozinha'}
  ]
},
c1_de_quem_era:{
  texto:[
    d=>fala(d.jogador.nome, 'De quem era essa mochila?'),
    'Silêncio de cozinha. Colher no fundo da xícara, duas vezes.',
    d=>fala(nomeCasa(), 'De gente que saiu daqui e não voltou.', 'baixo'),
    d=>fala(nomeCasa(), 'Não é maldição, menino. É mochila. Mochila boa não tem culpa de quem carregou.'),
    d=>fala(nomeCasa(), 'Mas se você quiser trocar, tem a sua ali no canto, e eu não vou achar ruim.'),
    'Você olha a sua, de lona fina, com a fivela quebrada. Olha a outra, de lona grossa, com arame novo.'
  ],
  ef:{flag:'sabe_da_mochila',
      rep:{eixo:'bom',delta:1,motivo:'Perguntou o que era mais fácil não perguntar'},
      registrar:'Perguntou de quem era a mochila.'},
  escolhas:[
    {texto:'Ficar com a mochila herdada.', vai:'c1_cozinha',
     ef:{moral:4, flag:'ficou_com_a_mochila', registrar:'Ficou com a mochila herdada.'}},
    {texto:'Trocar pela sua, mesmo ruim.', vai:'c1_cozinha',
     ef:{flag:'recusou_a_mochila', rep:{eixo:'bom',delta:1,motivo:'Preferiu carregar o próprio peso'},
         registrar:'Recusou a mochila herdada e ficou com a dele.'}}
  ]
},
c1_nao_perguntou:{
  texto:[
    'Você fecha a fivela de arame, testa o peso no ombro, e não pergunta nada.',
    'Tem perguntas que a gente não faz porque já sabe a resposta, e tem perguntas que a gente não faz porque hoje não é o dia.',
    'Esta é das duas coisas ao mesmo tempo.',
    d=>fala(nomeCasa(), 'Obrigada.', 'baixo', 'Por não ter perguntado. Ela agradece isso, e você entende que ela está agradecendo isso.')
  ],
  ef:{moral:4, flag:'ficou_com_a_mochila',
      registrar:'Ficou com a mochila herdada sem perguntar de quem era.'},
  escolhas:[
    {texto:'Descer para a cozinha.', vai:'c1_cozinha'},
    {texto:'Olhar o quarto uma última vez.', vai:'c1_quarto'}
  ]
},
c1_bolso_de_dentro:{
  texto:[
    'Você vira a mochila e abre o bolso de dentro, o que ninguém abre porque ninguém lembra que existe.',
    'Tem um mapa de Kanto de nove anos atrás, dobrado errado, com quatro rotas marcadas a caneta e uma quinta rasurada.',
    'Tem meio pacote de biscoito que virou pó.',
    'E tem um bilhete de ônibus de Viridian para Pewter, sem data, nunca usado.',
    'Alguém comprou uma passagem e não foi.'
  ],
  ef:{itens:{'Mapa de nove anos atrás':1}, flag:'achou_o_bilhete_de_onibus',
      rep:{eixo:'bom',delta:1,motivo:'Olhou onde ninguém olha'},
      registrar:'Achou um mapa antigo e uma passagem nunca usada no bolso de dentro.'},
  escolhas:[
    {texto:'Descer e perguntar sobre a passagem.', vai:'c1_de_quem_era'},
    {texto:'Guardar tudo de volta e descer.', vai:'c1_cozinha'}
  ]
},

/* ── abertura 9: a casa cheia ─────────────────────────────── */
c1_festa:{
  texto:[
    'Tem gente demais na sua casa às sete da manhã e você não foi consultado sobre isso.',
    'São sete pessoas na cozinha de quatro lugares: três vizinhos, dois primos que você vê uma vez por ano, a Sra. Chiyo e alguém que você tem quase certeza de que mora na outra rua.',
    'Tem bolo. Tem bolo às sete da manhã, e o bolo tem o seu nome escrito errado de glacê.',
    d=>fala(nomeCasa(), 'Eu falei pra não fazer nada. Eu falei. Quatro vezes.', 'baixo',
            'Ela fala isso ao seu lado, sem tirar o sorriso da cara, e está claramente muito feliz.'),
    d=>fala('Sra. Chiyo', 'Deixa o menino comer! DEIXA O MENINO COMER!', 'grita'),
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} sumiu debaixo da mesa no primeiro minuto e não vai sair de lá nem por bolo.`
               : 'Alguém trouxe um Growlithe e ele já está dormindo debaixo da mesa.';
    }
  ],
  ef:{flag:'a_casa_estava_cheia', moral:4,
      npc:{nome:'Sra. Chiyo', opiniao:2, memoria:'Apareceu na despedida às sete da manhã e mandou todo mundo deixar você comer.'},
      registrar:'A casa amanheceu cheia de gente no dia da partida.'},
  escolhas:[
    {texto:'Fazer um discurso. Todo mundo está esperando um.', vai:'c1_discurso'},
    {texto:'Comer o bolo e não falar nada.', vai:'c1_comeu_o_bolo'},
    {texto:'Escapar pro quintal cinco minutos.', vai:'c1_quintal'},
    {texto:'Ir embora no meio, sem alarde.', vai:'c1_saiu_da_festa'}
  ]
},
c1_discurso:{
  texto:[
    'Você bate na xícara com a colher e a cozinha inteira cala de uma vez, o que é muito pior do que quando estava barulhento.',
    'Você tem sete pessoas olhando pra você e nenhuma frase pronta.',
    d=>fala(d.jogador.nome, d.jogador.objetivo, null, 'É o que sai. É a coisa mais sincera que você já disse em voz alta nesta casa.'),
    'Ninguém aplaude na hora. Demora uns dois segundos.',
    'E aí a Sra. Chiyo começa a chorar de um jeito absolutamente desproporcional, e a partir daí ninguém mais consegue levar a manhã a sério.'
  ],
  ef:{moral:6, flag:'fez_discurso',
      rep:{eixo:'bom',delta:2,motivo:'Falou o que queria na frente da rua inteira', rep:{notorio:true}},
      registrar:'Fez um discurso na própria cozinha, às sete da manhã.'},
  escolhas:[
    {texto:'Terminar o café e ir.', vai:'c1_despedida'},
    {texto:'Pedir pra todo mundo falar uma coisa também. Não pode ser só você.', vai:'c1_todo_mundo_falou'}
  ]
},

c1_todo_mundo_falou:{
  texto:[
    d=>fala(d.jogador.nome, 'Agora cada um fala uma.'),
    'A cozinha reclama, a cozinha se recusa, a cozinha fala.',
    fala('o primo que você vê uma vez por ano', 'Não empresta dinheiro pra treinador. Nunca. Nem pra você mesmo.'),
    fala('o vizinho do quatorze', 'Leva meia mais grossa do que você acha que precisa.'),
    fala('Sra. Chiyo', 'ESCREVE. Escreve, menino, que ninguém escreve e todo mundo devia escrever.', 'grita'),
    d=>fala(nomeCasa(), 'Come sentado. Pelo menos uma vez por dia, come sentado.', 'baixo'),
    'A criança que ninguém sabe de quem é fala por último e fala a melhor de todas:',
    fala('a criança', 'Se você achar um shiny você TEM que voltar aqui pra mostrar.')
  ],
  ef:{moral:7, flag:'todo_mundo_falou_uma',
      rep:{eixo:'bom',delta:2,motivo:'Fez a própria despedida virar a despedida de todo mundo'},
      registrar:'Pediu que cada um falasse uma coisa. A criança pediu pra ver o shiny.'},
  escolhas:[
    {texto:'Terminar o café e ir.', vai:'c1_despedida'},
    {texto:'Subir e olhar o quarto uma última vez.', vai:'c1_quarto'},
    {texto:'Conferir a mochila antes de ir.', vai:'c1_mochila'}
  ]
},

c1_comeu_o_bolo:{
  texto:[
    'Você come duas fatias e meia de bolo às sete da manhã, o que é a coisa mais próxima de um discurso que você consegue fazer hoje.',
    'As sete pessoas conversam por cima de você sobre rotas que nenhuma delas andou, perigos que nenhuma delas viu, e um primo distante que virou treinador em 1989 e de quem ninguém lembra o nome.',
    'Você não precisa falar nada. Você precisa só estar ali, e estar ali é a parte que eles vieram ver.'
  ],
  ef:{moral:4, registrar:'Comeu bolo às sete da manhã com a cozinha cheia.'},
  escolhas:[
    {texto:'Terminar e se despedir.', vai:'c1_despedida'},
    {texto:'Escapar pro quintal cinco minutos.', vai:'c1_quintal'}
  ]
},
c1_quintal:{
  texto:[
    'Você sai pelos fundos e senta no degrau do quintal, e a cozinha continua barulhenta do outro lado da porta, sem sentir a sua falta ainda.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} aparece trinta segundos depois, porque ele sempre aparece trinta segundos depois, e senta encostado na sua perna.`
               : 'O quintal tem uma corda de varal, um balde e um pé de alguma coisa que nunca deu fruta.';
    },
    'Dá pra ouvir a sua casa inteira rindo de uma coisa que você não ouviu.',
    'Você vai lembrar deste degrau, e não da cozinha.'
  ],
  ef:{moral:3, flag:'o_degrau_do_quintal',
      registrar:'Sentou no degrau do quintal no meio da própria despedida.'},
  escolhas:[
    {texto:'Voltar pra dentro.', vai:'c1_despedida'},
    {texto:'Sair pelo portão dos fundos, sem voltar.', vai:'c1_saiu_da_festa'}
  ]
},
c1_saiu_da_festa:{
  texto:[
    'Você pega a mochila encostada na porta dos fundos e sai pelo portão sem ninguém ver, com a casa rindo às suas costas.',
    'Você anda meio quarteirão e a risada ainda dá pra ouvir, o que é pior do que se não desse.',
    'Ninguém vai entender. Você mesmo não entende direito, e você é o que fez.'
  ],
  ef:{flag:'saiu_no_meio_da_festa', moral:-4,
      rep:{eixo:'ruim',delta:1,motivo:'Sumiu no meio da própria despedida'},
      registrar:'Saiu no meio da festa de despedida, sem avisar.'},
  escolhas:[
    {texto:'Voltar. Ainda dá tempo.', vai:'c1_voltou_pra_festa'},
    {texto:'Continuar.', vai:'c1_rua'}
  ]
},
c1_voltou_pra_festa:{
  texto:[
    'Você volta o meio quarteirão e entra pela porta da frente, o que é diferente de nunca ter saído, e todo mundo percebe.',
    d=>fala('Sra. Chiyo', 'ELE VOLTOU! EU FALEI QUE ELE VOLTAVA!', 'grita'),
    d=>fala(nomeCasa(), 'Você não falou nada disso, Chiyo.', 'riso'),
    'E aí a cozinha volta a ser barulhenta, e ninguém cobra nada de você, e é assim que se perdoa em casa de rua pequena: fingindo que não houve o que houve.'
  ],
  ef:{moral:5, limpaFlag:'saiu_no_meio_da_festa',
      rep:{eixo:'bom',delta:1,motivo:'Voltou pra própria despedida'},
      registrar:'Saiu no meio da festa e voltou.'},
  escolhas:[
    {texto:'Terminar direito dessa vez.', vai:'c1_despedida'},
    {texto:'Subir e olhar o quarto uma última vez.', vai:'c1_quarto'},
    {texto:'Conferir a mochila antes de ir.', vai:'c1_mochila'}
  ]
},

/* ── abertura 10: ele não está ────────────────────────────── */
c1_ele_sumiu:{
  texto:[
    'Você acorda às seis e meia e a primeira coisa que você faz é a mesma de todo dia: olhar o pé da cama.',
    d=>{
      const p = d.time[0];
      if (!p) return 'E o pé da cama está vazio, o que faz sentido, porque você não tem ninguém.';
      return `O pé da cama está vazio. ${nomeExib(p)} não está lá, e ${nomeExib(p)} está lá todo dia desde a primeira noite em que apareceu nesta casa.`;
    },
    'Você chama uma vez, baixo. Depois alto. Depois desce a escada de dois em dois degraus.',
    'A porta dos fundos está encostada, não fechada.',
    d=>fala(nomeCasa(), 'Ele saiu antes de eu acordar. Eu achei que tinha sido você que soltou.', null,
            'Ela está com o pano na mão, parada no meio da cozinha, e não está calma.')
  ],
  ef:{flag:'ele_sumiu_no_ultimo_dia',
      registrar:'No dia de sair de casa, o seu Pokémon não estava no pé da cama.'},
  escolhas:[
    {texto:'Sair procurando agora, de pijama.', vai:'c1_procura_pijama'},
    {texto:'Pensar. Onde é que ele iria?', vai:'c1_onde_ele_iria'},
    {texto:'Esperar. Ele volta.', vai:'c1_esperou_ele'},
    {texto:'Pedir ajuda aos vizinhos.', vai:'c1_pediu_ajuda'}
  ]
},
c1_procura_pijama:{
  texto:[
    'Você sai de pijama e de chinelo às seis e quarenta e cinco e percorre a rua inteira chamando, sem se importar com janela nenhuma.',
    'Duas janelas abrem. Uma fecha de novo. A outra é a Sra. Chiyo, que olha você de cima a baixo e entra sem dizer nada — e volta um minuto depois, de casaco, pra procurar junto.',
    'Vocês dois acham ele em onze minutos, na saída da cidade, sentado exatamente em cima da placa que diz PALLET, olhando a estrada.',
    'Ele não fugiu. Ele foi esperar por você no lugar certo.'
  ],
  ef:{moral:8, flag:'ele_estava_na_placa',
      npc:{nome:'Sra. Chiyo', opiniao:3, memoria:'Saiu de casaco por cima da camisola pra procurar um bicho que não era dela.'},
      rep:{eixo:'bom',delta:2,motivo:'Saiu de pijama pela rua atrás de quem sumiu'},
      registrar:'Ele estava sentado em cima da placa da saída da cidade.'},
  escolhas:[
    {texto:'Voltar pra casa com ele e fazer tudo direito.', vai:'c1_cozinha'},
    {texto:'Sentar na placa junto e ficar um pouco.', vai:'c1_sentou_na_placa'}
  ]
},
c1_onde_ele_iria:{
  texto:[
    'Você senta no degrau da escada e pensa, que é a coisa mais difícil de fazer quando o corpo inteiro quer correr.',
    'Ele não gosta da praça. Ele tem medo do carro da Sra. Chiyo. Ele nunca foi pro mercado sozinho.',
    'Mas ele te viu arrumando a mochila a noite inteira.'
  ],
  teste:{status:'percepcao', dificuldade:6, nomeStatus:'Percepção',
    critico:'c1_achou_na_placa', sucesso:'c1_achou_na_placa',
    parcial:'c1_procura_pijama', falha:'c1_procura_pijama'},
  ef:{registrar:'Parou pra pensar onde ele teria ido.'}
},
c1_achou_na_placa:{
  texto:[
    'Você sai andando direto, sem chamar, sem olhar pros lados, porque você já sabe.',
    'Ele está sentado em cima da placa da saída da cidade, de costas pra Pallet, olhando a estrada que sobe.',
    'Ele não se assusta quando você chega. Ele olha pra você, olha pra estrada, e olha pra você de novo.',
    'A pergunta é tão clara que quase dá pra ouvir.'
  ],
  ef:{moral:10, flag:'ele_estava_na_placa',
      rep:{eixo:'bom',delta:1,motivo:'Sabia exatamente onde ele estaria'},
      registrar:'Sabia onde ele estava antes de sair procurando.'},
  escolhas:[
    {texto:'Sentar na placa junto e ficar um pouco.', vai:'c1_sentou_na_placa'},
    {texto:'Voltar pra casa com ele. Tem café esperando.', vai:'c1_cozinha'}
  ]
},
c1_sentou_na_placa:{
  texto:[
    'Você senta em cima da placa, de pijama, às sete da manhã, com a cidade inteira acordando atrás de vocês dois.',
    'A estrada sobe e some numa curva a uns quinhentos metros. Depois da curva pode ter qualquer coisa. É isso que faz ela ser uma estrada e não um quintal.',
    'Vocês ficam ali até dar sete e meia.',
    'Depois vocês voltam pra casa, porque ainda tem café, ainda tem despedida, e ainda tem uma mochila no chão do quarto.',
    'Mas agora vocês dois já sabem como é sentar naquela placa, e isso não vai embora.'
  ],
  ef:{moral:6, flag:'sentou_na_placa',
      registrar:'Sentou na placa da saída da cidade antes de sair de verdade.'},
  escolhas:[
    {texto:'Voltar e tomar o café.', vai:'c1_cozinha'},
    {texto:'Andar até a curva, os quinhentos metros, e voltar.', vai:'c1_foi_ate_a_curva'},
    {texto:'Perguntar em voz alta se ele quer ir agora, sem despedida nenhuma.', vai:'c1_perguntou_se_ia_agora'}
  ]
},

c1_foi_ate_a_curva:{
  texto:[
    'Você anda os quinhentos metros até a curva, de pijama, com ele do lado, e para exatamente no ponto onde a estrada vira.',
    'Depois da curva tem mais estrada. Só isso. Mais estrada, subindo, com mato dos dois lados e um poste caído no acostamento.',
    'Nenhum mistério. Nenhuma revelação. Mais estrada.',
    'E é um alívio tão grande que você tem que sentar no acostamento por um minuto.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} senta junto e olha pra você com aquela cara de quem não entende por que a gente para de andar quando ninguém mandou parar.`
               : 'Você fica um minuto sozinho no acostamento e depois volta.';
    }
  ],
  ef:{moral:5, flag:'foi_ate_a_curva', hp:-1,
      rep:{eixo:'bom',delta:1,motivo:'Foi olhar o que tinha depois da curva antes de sair'},
      registrar:'Andou até a curva de pijama pra ver o que tinha depois. Tinha mais estrada.'},
  escolhas:[
    {texto:'Voltar pra casa e fazer tudo direito.', vai:'c1_cozinha'},
    {texto:'Voltar correndo, que agora deu vontade de começar.', vai:'c1_mochila'}
  ]
},

c1_perguntou_se_ia_agora:{
  texto:[
    d=>{
      const p = d.time[0];
      return p ? fala(d.jogador.nome, 'Você quer ir agora? Assim, sem voltar?')
               : fala(d.jogador.nome, 'A gente podia ir agora. Assim, sem voltar.');
    },
    d=>{
      const p = d.time[0];
      if (!p) return 'Você fala isso pra ninguém, o que é pior do que falar pra alguém.';
      return `${nomeExib(p)} olha pra você. Olha pra estrada. Olha pra você de novo.`;
    },
    'E aí ele pula da placa e anda na direção de casa, e para, e olha pra trás pra ver se você vem.',
    'A resposta foi bem clara.'
  ],
  ef:{moral:6, flag:'ele_escolheu_voltar',
      registrar:'Perguntou se ele queria ir sem voltar. Ele andou na direção de casa.'},
  escolhas:[
    {texto:'Ir atrás dele.', vai:'c1_cozinha'},
    {texto:'Olhar o quarto uma última vez antes.', vai:'c1_quarto'},
    {texto:'Conferir a mochila antes de descer.', vai:'c1_mochila'}
  ]
},

c1_esperou_ele:{
  texto:[
    'Você senta na porta dos fundos e espera, porque é o que faz sentido e porque é o que dói mais.',
    'Quarenta minutos. Você conta os quarenta.',
    d=>{
      const p = d.time[0];
      if (!p) return 'Ninguém volta, porque não tinha ninguém pra voltar.';
      return `Aos quarenta e um, ${nomeExib(p)} entra pelo buraco da cerca, tranquilo, como quem foi dar uma volta.`;
    },
    'Você não briga. Você não chega nem a levantar.',
    d=>fala(nomeCasa(), 'Esperar é a parte que ninguém conta que é a mais difícil.', 'baixo',
            'Ela estava na porta da cozinha o tempo todo, e você não tinha percebido.')
  ],
  ef:{moral:2, flag:'esperou_ele_voltar',
      registrar:'Esperou quarenta e um minutos sentado na porta dos fundos.'},
  escolhas:[
    {texto:'Entrar e tomar café.', vai:'c1_cozinha'},
    {texto:'Ir conferir a mochila, agora que dá.', vai:'c1_mochila'}
  ]
},
c1_pediu_ajuda:{
  texto:[
    'Você bate em três portas antes das sete da manhã, o que numa rua desta não é pedir ajuda: é convocar.',
    'Em oito minutos tem cinco pessoas na calçada, duas com lanterna que não precisa e uma com um Growlithe que claramente não sabe rastrear nada.',
    d=>fala('Sr. Ushio', 'Cada um pega uma rua. Quem achar grita. Ninguém corre atrás, que correndo atrás o bicho foge mais.', null,
            'Ele organiza a rua inteira em quarenta segundos, de vassoura na mão, e ninguém questiona.'),
    'Quem acha é uma criança de nove anos que nem foi chamada e que estava só olhando.',
    'Estava sentado em cima da placa da saída da cidade, olhando a estrada.'
  ],
  ef:{moral:6, flag:'ele_estava_na_placa',
      npc:{nome:'Sr. Ushio', opiniao:2, memoria:'Organizou a rua inteira pra procurar um bicho seu às sete da manhã.'},
      rep:{eixo:'bom',delta:2,motivo:'Pediu ajuda em vez de resolver sozinho'},
      registrar:'A rua inteira ajudou a procurar. Uma criança de nove anos achou.'},
  escolhas:[
    {texto:'Agradecer um por um antes de qualquer outra coisa.', vai:'c1_agradeceu_a_rua'},
    {texto:'Pegar ele e voltar correndo pra casa.', vai:'c1_cozinha'}
  ]
},
c1_agradeceu_a_rua:{
  texto:[
    'Você agradece um por um, inclusive a criança de nove anos, que fica absolutamente sem graça e sai correndo.',
    'Leva vinte minutos. Você ia sair hoje de qualquer jeito, e agora vai sair vinte minutos mais tarde.',
    'Ninguém nessa rua vai esquecer isso, e é exatamente por causa de vinte minutos que as pessoas lembram da gente.'
  ],
  ef:{moral:4,
      rep:{eixo:'bom',delta:2,motivo:'Agradeceu um por um, com a estrada esperando', rep:{notorio:true}},
      registrar:'Agradeceu cada pessoa da rua antes de ir embora.'},
  escolhas:[
    {texto:'Ir pra casa tomar café.', vai:'c1_cozinha'},
    {texto:'Procurar a criança de nove anos e agradecer de novo, direito.', vai:'c1_a_crianca_de_nove'}
  ]
},

c1_a_crianca_de_nove:{
  texto:[
    'Você acha ela três casas adiante, escondida atrás de um portão, fingindo muito mal que está fazendo outra coisa.',
    d=>fala(d.jogador.nome, 'Foi você que achou.'),
    fala('a criança de nove anos', 'Eu só tava olhando.', 'baixo'),
    d=>fala(d.jogador.nome, 'Foi você que achou.'),
    'Ela pensa nisso por uns quatro segundos e você vê a coisa mudar de lugar na cabeça dela.',
    fala('a criança de nove anos', 'Foi eu que achei.'),
    'Ela vai contar essa história por anos. Ela vai contar errado, cada vez mais bonita, e ninguém vai corrigir.'
  ],
  ef:{moral:5, flag:'a_crianca_que_achou',
      rep:{eixo:'bom',delta:2,motivo:'Devolveu o crédito a quem tinha achado', rep:{notorio:true}},
      registrar:'Voltou pra dizer à criança de nove anos que foi ela que achou.'},
  escolhas:[
    {texto:'Ir pra casa.', vai:'c1_cozinha'},
    {texto:'Olhar o quarto uma última vez antes.', vai:'c1_quarto'},
    {texto:'Conferir a mochila antes de descer.', vai:'c1_mochila'}
  ]
},

c1_cinco_minutos:{
  texto:[
    'Você fica. Cinco minutos viram onze.',
    d=>{
      const p = d.time[0];
      if (!p) return 'O teto do quarto tem uma rachadura que você conhece melhor que o próprio rosto.';
      return `${nomeExib(p)} sobe na cama, o que ele quase nunca faz, e se encaixa do seu lado num espaço que claramente não existe. Ele fica assim mesmo.`;
    },
    'O teto tem uma rachadura em forma de rio que você olha desde os seis anos e que hoje você vai olhar pela última vez de dentro desta cama.',
    'Você não chora. Chega bem perto.'
  ],
  ef:{moral:5},
  escolhas:[
    {texto:'Levantar e olhar as coisas do quarto.', vai:'c1_quarto'},
    {texto:'Descer para a cozinha.', vai:'c1_cozinha'}
  ]
},

c1_quarto:{
  texto:[
    'O quarto tem doze anos de coisa acumulada e você não vai levar quase nada.',
    'Na parede, um mapa de Kanto que você ganhou aos oito e preencheu de caneta com lugares onde nunca foi. Alguns nomes estão escritos errado.',
    'Na estante, um caderno de desenho que para na página quatorze. Uma medalha de uma corrida da escola que você não ganhou, e sim terminou. Uma foto da sua mãe muito mais nova, com o cabelo diferente, rindo de uma coisa que ninguém registrou.',
    'Nada disso vai servir pra nada em Kanto. Você sabe disso e continua olhando.'
  ],
  escolhas:[
    {texto:'Levar a foto.', vai:'c1_levou_foto',
     ef:{flag:'levou_a_foto', moral:5}},
    {texto:'Levar o mapa da parede.', vai:'c1_levou_mapa', ef:{flag:'levou_o_mapa'}},
    {texto:'Não levar nada. Você não vai precisar.', vai:'c1_cozinha', ef:{flag:'nao_levou_nada'}},
    {texto:'Conferir a mochila de novo.', vai:'c1_mochila'}
  ]
},

c1_levou_foto:{
  texto:[
    'Você tira a foto da moldura sem quebrar a moldura, que é um cuidado que ninguém pediu, e enrola num pedaço de pano.',
    'Guarda no bolso de dentro da mochila, que é o bolso das coisas que não podem amassar.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} olha você fazer isso da porta do quarto e não entende nada, o que é justo, porque nem você entende direito.` : 'Ninguém vê você fazer isso.';
    },
    'É a coisa mais inútil que você vai carregar por Kanto inteira.'
  ],
  escolhas:[{texto:'Descer.', vai:'c1_cozinha'}]
},

c1_levou_mapa:{
  texto:[
    'Você tira o mapa da parede com cuidado e as quatro tachinhas deixam quatro furos que agora você não pode mais esconder.',
    'Dobrado, ele cabe no bolso lateral. Vai ficar ilegível em três semanas de chuva e você vai continuar carregando.',
    'Nas margens dele tem sua letra de criança escrevendo coisas como "AQUI TEM VULCÃO" e "PERIGO???" em lugares completamente aleatórios.'
  ],
  ef:{flag:'tem_mapa_de_crianca'},
  escolhas:[
    {texto:'Descer.', vai:'c1_cozinha'},
    {texto:'Olhar o quarto uma última vez antes.', vai:'c1_quarto'},
    {texto:'Conferir a mochila antes de descer.', vai:'c1_mochila'}
  ]
},

c1_mochila:{
  texto:[
    'Você abre a mochila e confere pela quarta vez o que já sabe que está lá: duas mudas de roupa, um casaco, uma lanterna, uma garrafa, uma faca pequena, sabonete.',
    'E é só isso. Não tem Poké Ball, não tem remédio, não tem nada de treinador.',
    'Porque nada disso se compra: se cadastra. Tem um balcão, tem formulário e tem fila.',
    'Você fecha a mochila. A fivela de baixo continua quebrada.'
  ],
  ef:{flag:'conferiu_a_mochila'},
  escolhas:[
    {texto:'Olhar as coisas do quarto antes de descer.', vai:'c1_quarto'},
    {texto:'Descer para a cozinha.', vai:'c1_cozinha'}
  ]
},

c1_cozinha:{
  texto:[
    'A mesa tem comida para quatro e nesta casa mora gente que dá pra contar numa mão. É assim que se pede pra alguém ficar sem pedir.',
    d=>fala(nomeCasa(), 'Senta.', null, 'Não é ordem. É a palavra que esta casa usa pra dizer umas dez outras coisas.'),
    'Você senta. Come mais do que queria e menos do que colocaram no prato.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} ganha um pedaço por baixo da mesa, como sempre, com o mesmo cuidado de sempre, como se ainda fosse segredo de alguém.` : 'O rádio na bancada fala de chuva no norte.';
    },
    d=>fala(nomeCasa(), 'E aí. Você já sabe pra onde vai?')
  ],
  escolhas:[
    {texto:'"Sei." (mesmo que não saiba)', vai:'c1_mentira_gentil'},
    {texto:'"Não faço ideia."', vai:'c1_verdade'},
    {texto:d=>`"${d.jogador.objetivo}"`, vai:'c1_objetivo'},
    {texto:'Não responder e continuar comendo.', vai:'c1_silencio_mesa'}
  ]
},

c1_mentira_gentil:{
  texto:[
    d=>fala(d.jogador.nome, 'Sei.'),
    'Dois segundos de silêncio que dizem, com todas as letras, que ninguém acreditou e que ninguém vai discutir.',
    d=>fala(nomeCasa(), 'Tá bom. Então come.', null,
            'Ela mexe o café que já está mexido há um minuto.'),
    'É uma mentira gentil e hoje todo mundo nesta mesa prefere ela.'
  ],
  ef:{flag:'mentiu_no_cafe'},
  escolhas:[
    {texto:'Terminar o café.', vai:'c1_despedida'},
    {texto:'Subir e olhar o quarto uma última vez.', vai:'c1_quarto'},
    {texto:'Conferir a mochila antes de ir.', vai:'c1_mochila'}
  ]
},

c1_verdade:{
  texto:[
    d=>fala(d.jogador.nome, 'Não faço a menor ideia.'),
    'Dessa vez o silêncio é diferente. Mais longo e muito mais fácil.',
    d=>fala(nomeCasa(), 'Ótimo.', null, 'A resposta te pega completamente desprevenido.'),
    d=>fala(nomeCasa(), 'Quem sai daqui sabendo exatamente pra onde vai volta em três semanas. Eu já vi isso acontecer quatro vezes nesta rua.'),
    d=>fala(d.jogador.nome, 'E quem não sabe?'),
    d=>fala(nomeCasa(), 'Esse demora.', null, 'Um gole de café, sem pressa nenhuma.'),
    d=>fala(nomeCasa(), 'Mas volta diferente. E aí a demora valeu.')
  ],
  ef:{flag:'foi_honesto_no_cafe', moral:5},
  escolhas:[
    {texto:'Terminar o café.', vai:'c1_despedida'},
    {texto:'Subir e olhar o quarto uma última vez.', vai:'c1_quarto'},
    {texto:'Conferir a mochila antes de ir.', vai:'c1_mochila'}
  ]
},

c1_objetivo:{
  texto:[
    d=>fala(d.jogador.nome, d.jogador.objetivo),
    'Você fala isso em voz alta, na sua cozinha, de manhã, com a boca meio cheia — e soa muito mais sério do que soava dentro da sua cabeça.',
    'Do outro lado da mesa, a colher para no meio do café.',
    d=>fala(nomeCasa(), 'Então vai.'),
    d=>fala(nomeCasa(), 'E quando isso mudar — porque isso muda, sempre muda — não trata como derrota.')
  ],
  ef:{flag:'disse_o_objetivo', moral:5},
  escolhas:[
    {texto:'Terminar o café.', vai:'c1_despedida'},
    {texto:'Subir e olhar o quarto uma última vez.', vai:'c1_quarto'},
    {texto:'Conferir a mochila antes de ir.', vai:'c1_mochila'}
  ]
},

c1_silencio_mesa:{
  texto:[
    'Você não responde. Continua comendo.',
    'Ninguém insiste. A cozinha faz barulho de cozinha por mais uns quatro minutos e isso é suficiente pros dois.',
    'Tem conversa que é melhor não ter, e tem gente que sabe disso — e é uma sorte enorme morar com gente que sabe disso.'
  ],
  escolhas:[
    {texto:'Terminar o café.', vai:'c1_despedida'},
    {texto:'Subir e olhar o quarto uma última vez.', vai:'c1_quarto'},
    {texto:'Conferir a mochila antes de ir.', vai:'c1_mochila'}
  ]
},

c1_despedida:{
  texto:[
    d=>`Na porta, ${casaCompleto()} te enfia um embrulho pequeno e um envelope na mão, nessa ordem, sem cerimônia.`,
    d=>fala(nomeCasa(), 'O embrulho é comida pra estrada. O envelope é dinheiro, não é muito, e não é pra gastar em besteira.'),
    'Você abre o envelope depois, já na rua, e descobre que é mais do que esta casa podia dar.',
    'E aí vem a terceira coisa, que não estava na mão nenhuma até agora: um aparelho azul de tampa, do tamanho da sua palma, com a tinta gasta nos cantos.',
    d=>fala(nomeCasa(), 'Isso aqui é um PokéNav. Era do seu tio e ele não usava, e eu mandei consertar a tampa.'),
    d=>fala(nomeCasa(), 'Serve pra guardar número. O número de quem te atender, de quem te dever alguma coisa, de quem quiser revanche.'),
    d=>fala(nomeCasa(), 'Tem um número já gravado nele. É o daqui. Não precisa usar todo dia.', 'baixo'),
    d=>fala(nomeCasa(), 'Mas usa.'),
    d=>fala(nomeCasa(), 'Uma coisa só.', null, 'A mão fecha no batente da porta.'),
    d=>fala(nomeCasa(), 'Volta. Não precisa voltar campeão. Só volta.')
  ],
  ef:{dinheiro:3000, itens:{'Ração':1},
      executar:d=>{
        Estado.ganharPokenav();
        return [{tipo:'item', texto:'Ganhou um PokéNav. O número de casa já está gravado nele.'}];
      }},
  escolhas:[
    {texto:'"Eu volto." Prometer.', vai:'c1_rua',
     ef:{flag:'promessa_voltar', moral:10, registrar:'Prometeu voltar para casa.'}},
    {texto:'"Não dá pra prometer isso." Ser honesto.', vai:'c1_rua',
     ef:{flag:'sem_promessa', registrar:'Recusou-se a prometer que voltaria.'}},
    {texto:'Abraçar e não falar nada.', vai:'c1_rua',
     ef:{flag:'abraco_calado', moral:10}},
    {texto:'Sair rápido, antes que fique pior.', vai:'c1_rua', ef:{flag:'saiu_rapido'}}
  ]
},

c1_rua:{
  texto:[
    d=>`${d.jogador.cidade} de manhã cedo é pequena de um jeito bom. Poucas ruas, um mercado que abre tarde, gente que sabe o seu nome porque viu você aprender a andar.`,
    'O ar está frio de um jeito que não vai durar mais de uma hora.',
    'Um velho varre a calçada da própria casa, como faz há vinte anos. A vassoura para no meio do movimento quando você passa.',
    fala('Sr. Ushio', 'Ei. Ei! Você.', null, 'A vassoura aponta pra você. Não tem hostilidade nenhuma no gesto.'),
    fala('Sr. Ushio', 'Você me deve uma.')
  ],
  ef:{npc:{nome:'Sr. Ushio', opiniao:0, memoria:'Cobrou uma dívida de infância no dia da partida.'}},
  escolhas:[
    {texto:'"Eu sei. A janela." Encarar o assunto.', vai:'c1_divida_assume', ef:{flag:'assumiu_divida'}},
    {texto:'"Deve nada, seu Ushio." Fingir que esqueceu.', vai:'c1_divida_nega', ef:{flag:'negou_divida'}},
    {texto:'Perguntar quanto custa resolver isso hoje.', vai:'c1_divida_paga', cond:d=>d.jogador.dinheiro >= 800},
    {texto:'"Hoje não dá. Mas eu volto e resolvo."', vai:'c1_divida_adiada', ef:{flag:'adiou_divida'}},
    {texto:'"O senhor organizou a rua inteira hoje de manhã. A gente tá quites."',
     vai:'c1_divida_quites', cond:d=>!!d.flags.ele_estava_na_placa && !!d.npcs['Sr. Ushio']},
    {texto:'Oferecer a vassoura de volta: varrer a calçada agora, no lugar do dinheiro.',
     vai:'c1_varreu_no_lugar', cond:d=>!d.flags.varreu_a_calcada_do_ushio}
  ]
},

c1_divida_quites:{
  texto:[
    d=>fala(d.jogador.nome, 'O senhor organizou a rua inteira hoje de manhã pra procurar um bicho que não é seu.'),
    d=>fala(d.jogador.nome, 'Eu acho que a gente tá quites.'),
    'Ele fica olhando pra você por um tempo que passa do confortável, e depois olha pra vassoura, e depois pro chão.',
    fala('Sr. Ushio', 'Não é assim que funciona.'),
    fala('Sr. Ushio', 'Eu ajudei porque eu quis. Você quebrou porque você chutou. São coisas diferentes e você sabe disso.'),
    'Ele tem razão, e você odeia que ele tenha razão às sete e meia da manhã.',
    fala('Sr. Ushio', 'Mas eu gostei da tentativa. Vai. Tá pago.', 'riso')
  ],
  ef:{moral:4, flag:'quitou_na_lábia',
      npc:{nome:'Sr. Ushio', opiniao:3, memoria:'Tentou quitar a janela com o favor da manhã. Ele riu e perdoou.'},
      registrar:'Tentou quitar a dívida da janela com o favor da manhã. Funcionou, meio sem querer.'},
  escolhas:[
    {texto:'Insistir que a dívida continua de pé.', vai:'c1_divida_adiada'},
    {texto:'Aceitar e seguir.', vai:'c1_saida_pro_centro'}
  ]
},

c1_varreu_no_lugar:{
  texto:[
    'Você tira a vassoura da mão dele sem pedir licença, o que é a única maneira de tirar uma vassoura da mão do Sr. Ushio.',
    'Você varre a calçada inteira. Leva doze minutos. Ela já estava varrida.',
    'Ele reclama do jeito que você segura o cabo. Reclama do canto perto do portão. Reclama que você levanta poeira em vez de juntar.',
    'Quando você devolve a vassoura, ele não fala nada da calçada.',
    fala('Sr. Ushio', 'A janela era vinte pokedólares em 1989.', 'baixo'),
    fala('Sr. Ushio', 'E doze minutos de calçada hoje vale mais do que vinte pokedólares. Vai embora, menino, antes que eu fique bobo.')
  ],
  ef:{moral:6, flag:'varreu_a_calcada_do_ushio', limpaFlag:'divida_pendente',
      npc:{nome:'Sr. Ushio', opiniao:5, memoria:'Pagou a janela varrendo a calçada no dia em que saiu de casa.'},
      rep:{eixo:'bom',delta:2,motivo:'Pagou uma dívida de dinheiro com doze minutos de trabalho', rep:{notorio:true}},
      registrar:'Pagou a janela varrendo a calçada do Sr. Ushio.'},
  escolhas:[
    {texto:'Seguir para o Centro Pokémon.', vai:'c1_saida_pro_centro'},
    {texto:'Dar uma volta na rua antes de ir ao Centro.', vai:'c1_rua', cond:d=>!d.npcs['Sr. Ushio']}
  ]
},

c1_entregou_a_caixa:{
  texto:[
    'Você põe a caixa de ventilador no balcão antes de entrar na fila, e a enfermeira olha a caixa, olha você, e não pergunta nada.',
    'Ela levanta o pano de prato com dois dedos.',
    fala('a enfermeira', 'Ah.'),
    fala('a enfermeira', 'Terceiro esse mês. Sempre em caixa, sempre com pano de prato por cima, sempre trazido por outra pessoa.'),
    d=>fala(d.jogador.nome, 'E o que acontece com eles?'),
    fala('a enfermeira', 'A gente cuida até alguém querer. Às vezes alguém quer.'),
    fala('a enfermeira', 'Se você mudar de ideia nos próximos dez minutos, ele ainda tá aqui.', 'baixo')
  ],
  ef:{flag:'entregou_a_caixa_no_centro',
      registrar:'Entregou a caixa da Sra. Chiyo no Centro. Era o terceiro do mês.'},
  escolhas:[
    {texto:'Mudar de ideia. Ficar com ele.', vai:'c1_mudou_de_ideia_no_balcao'},
    {texto:'Não mudar. Entrar na fila.', vai:'c1_fila'},
    {texto:'Perguntar quantos deles ninguém nunca quis.', vai:'c1_quantos_ninguem_quis'}
  ]
},

c1_mudou_de_ideia_no_balcao:{
  texto:[
    'Você pega a caixa de volta do balcão antes dos dez minutos e a enfermeira nem finge surpresa.',
    fala('a enfermeira', 'Quarenta segundos. É o recorde do mês.', 'riso'),
    'Ela puxa uma ficha, preenche em trinta segundos e empurra pra você assinar.',
    fala('a enfermeira', 'Vamos registrar ele no seu nome junto com a sua licença, que aí você só faz fila uma vez.')
  ],
  ef:{flag:'ficou_com_o_bicho', moral:5,
      rep:{eixo:'bom',delta:2,motivo:'Voltou ao balcão em quarenta segundos para ficar com ele'},
      executar:d=>{
        Estado.usarItem('Caixa de ventilador com um bicho dentro');
        const dex = Dados.escolher([19, 16, 10, 13, 21, 41, 52]);
        const p = criarPokemon(dex, Dados.entre(3,5), {moral:45});
        p.historia = 'Passou a noite embaixo do carro da Sra. Chiyo. Você deixou ele no balcão e voltou em quarenta segundos.';
        const onde = Estado.adicionar(p);
        return [{tipo:'pokemon', texto:`${nomeExib(p)} (Nv ${p.nivel}) é seu.${notaDestino(onde)}`}];
      },
      registrar:'Deixou o bicho no balcão e voltou em quarenta segundos.'},
  escolhas:[
    {texto:'Entrar na fila.', vai:'c1_fila'},
    {texto:'Conversar com os outros três da fila antes.', vai:'c1_fila_conversa'},
    {texto:'Perguntar na recepção o que exatamente é preciso.', vai:'c1_pergunta_recepcao'}
  ]
},

c1_quantos_ninguem_quis:{
  texto:[
    d=>fala(d.jogador.nome, 'Quantos deles ninguém nunca quis?'),
    'Ela para de mexer na prancheta.',
    fala('a enfermeira', 'Essa é uma pergunta muito ruim pra sete e quarenta da manhã.'),
    fala('a enfermeira', 'Dos que passaram por este balcão nos três anos que eu estou aqui: a maioria.'),
    fala('a enfermeira', 'A maioria vai pro abrigo de Lavender, que tem onze e cabe dezoito.', 'baixo'),
    'Lavender. Você vai acabar em Lavender uma hora, todo mundo acaba, e agora você vai chegar lá sabendo disso.'
  ],
  ef:{flag:'sabe_do_abrigo_de_lavender',
      rep:{eixo:'bom',delta:1,motivo:'Perguntou o que acontece com os que ninguém quer'},
      registrar:'A maioria dos bichos entregues vai pro abrigo de Lavender, que tem onze e cabe dezoito.'},
  escolhas:[
    {texto:'Mudar de ideia. Ficar com ele.', vai:'c1_mudou_de_ideia_no_balcao'},
    {texto:'Entrar na fila.', vai:'c1_fila'}
  ]
},

c1_carregou_o_nav:{
  texto:[
    'Você pergunta se dá pra carregar e a enfermeira aponta uma tomada atrás do balcão com quatro aparelhos já ligados nela.',
    fala('a enfermeira', 'Todo Centro tem. É serviço obrigatório e ninguém sabe.'),
    'Enquanto carrega, você mexe no aparelho pela primeira vez com calma.',
    d=>fala(nomeCasa(), 'CASA', 'baixo', 'É o único número gravado. Está escrito em maiúsculo, o que quer dizer que foi ela que digitou.'),
    'Tem também, na memória, três chamadas não atendidas de nove anos atrás, para um número que não existe mais.',
    'Você não apaga.'
  ],
  ef:{flag:'viu_as_chamadas_antigas', moral:2,
      rep:{eixo:'bom',delta:1,motivo:'Mexeu no aparelho com calma antes de precisar dele'},
      registrar:'O PokéNav tem três chamadas não atendidas de nove anos atrás, para um número que não existe mais.'},
  escolhas:[
    {texto:'Perguntar à enfermeira se dá pra descobrir de quem era o número.', vai:'c1_de_quem_era_o_numero'},
    {texto:'Entrar na fila.', vai:'c1_fila'}
  ]
},

c1_de_quem_era_o_numero:{
  texto:[
    'Ela digita o número no terminal do balcão e espera, e o terminal responde em quatro segundos.',
    fala('a enfermeira', 'Linha cancelada em 1989. Titular...', null, 'Ela para de ler em voz alta.'),
    fala('a enfermeira', 'Titular com o mesmo sobrenome que o seu.', 'baixo'),
    'Ela vira a tela pra você e não é uma tela que explique muita coisa: é um nome, uma data de cancelamento e um campo de motivo em branco.',
    'Você fecha o aparelho e põe no bolso e entra na fila, e leva exatamente onze minutos pra conseguir prestar atenção em outra coisa.'
  ],
  ef:{flag:'o_numero_de_1989', moral:-2,
      rep:{eixo:'bom',delta:1,motivo:'Puxou um fio de nove anos atrás numa fila de balcão'},
      registrar:'O número das chamadas antigas foi cancelado em 1989. O titular tinha o seu sobrenome.'},
  escolhas:[
    {texto:'Entrar na fila.', vai:'c1_fila'},
    {texto:'Conversar com os outros três da fila antes.', vai:'c1_fila_conversa'},
    {texto:'Perguntar na recepção o que exatamente é preciso.', vai:'c1_pergunta_recepcao'}
  ]
},

c1_divida_assume:{
  texto:[
    fala('Sr. Ushio', 'A janela.', null, 'Ele repete a palavra e quase sorri. Quase.'),
    fala('Sr. Ushio', 'Doze anos e você ainda lembra. Isso aí me diz mais de você do que qualquer insígnia vai dizer.'),
    'Ele apoia a vassoura na parede e entra em casa. Demora o suficiente pra você achar que ele esqueceu que você existe.',
    'Volta com uma caixa de metal amassada, do tipo que já foi de biscoito.',
    fala('Sr. Ushio', 'Peguei isso de um treinador que passou aqui faz uns anos e nunca voltou pra buscar. Guardei achando que um dia ia aparecer alguém que merecesse.'),
    'Dentro tem duas Great Balls e um frasco de Super Potion, tudo dentro da validade por pouco.'
  ],
  ef:{itens:{'Great Ball':2,'Super Potion':1},
      rep:{eixo:'bom',delta:1,motivo:'Assumiu uma dívida antiga no dia em que podia simplesmente ir embora'},
      npc:{nome:'Sr. Ushio', opiniao:3, memoria:'Foi honesto sobre a janela quebrada. Ganhou a caixa de metal.'}},
  escolhas:[
    {texto:'Agradecer e seguir.', vai:'c1_saida_pro_centro'},
    {texto:'Dar uma volta na rua antes de ir ao Centro.', vai:'c1_rua', cond:d=>!d.npcs['Sr. Ushio']}
  ]
},

c1_divida_nega:{
  texto:[
    'O velho te olha por tempo demais. Depois abaixa a cabeça e volta a varrer.',
    fala('Sr. Ushio', 'Tá certo. Vai com Deus.', 'frio', 'Ele não levanta a cabeça uma vez sequer.'),
    'Ele não vai esquecer. Gente que varre a mesma calçada há vinte anos não esquece nada — e essa cidade é pequena, e você vai voltar um dia.'
  ],
  ef:{rep:{eixo:'ruim',delta:1,motivo:'Negou uma dívida na própria cidade'},
      npc:{nome:'Sr. Ushio', opiniao:-3, memoria:'Mentiu sobre a janela. Ele sabe.'}},
  escolhas:[
    {texto:'Seguir em frente.', vai:'c1_saida_pro_centro'},
    {texto:'Dar uma volta na rua antes de ir ao Centro.', vai:'c1_rua', cond:d=>!d.npcs['Sr. Ushio']}
  ]
},

c1_divida_paga:{
  texto:[
    'Você tira o dinheiro do bolso antes que ele termine a frase. Ele olha a nota. Olha você. Olha a nota de novo.',
    fala('Sr. Ushio', 'Eu ia te dar uma coisa. Agora fica estranho.', 'baixo'),
    'Ele pega o dinheiro mesmo assim, porque recusar seria mais estranho ainda. Não te dá nada.',
    'Você resolveu um problema e criou um assunto.'
  ],
  ef:{dinheiro:-800, npc:{nome:'Sr. Ushio', opiniao:-1, memoria:'Pagou a janela em dinheiro. Ficou estranho.'}},
  escolhas:[
    {texto:'Seguir.', vai:'c1_saida_pro_centro'},
    {texto:'Dar uma volta na rua antes de ir ao Centro.', vai:'c1_rua', cond:d=>!d.npcs['Sr. Ushio']}
  ]
},

c1_divida_adiada:{
  texto:[
    d=>fala(d.jogador.nome, 'Hoje não dá. Mas eu volto e resolvo.'),
    'Ele para de varrer e te olha com atenção de verdade pela primeira vez na sua vida inteira.',
    fala('Sr. Ushio', 'Todo mundo que sai daqui fala que volta.', null, 'A vassoura encosta na parede.'),
    fala('Sr. Ushio', 'Você é o primeiro que fala que volta pra pagar alguma coisa.'),
    fala('Sr. Ushio', 'Tá anotado. Aqui.', null, 'Ele bate duas vezes na própria testa.')
  ],
  ef:{flag:'divida_pendente',
      npc:{nome:'Sr. Ushio', opiniao:2, memoria:'Você prometeu voltar para pagar a janela. Ele anotou.'},
      rep:{eixo:'bom',delta:1,motivo:'Assumiu uma dívida sem pagar na hora'}},
  escolhas:[
    {texto:'Seguir.', vai:'c1_saida_pro_centro'},
    {texto:'Dar uma volta na rua antes de ir ao Centro.', vai:'c1_rua', cond:d=>!d.npcs['Sr. Ushio']}
  ]
},

c1_saida_pro_centro:{
  texto:[
    'Você chega no fim da rua e para, porque tem uma coisa que você precisa resolver antes de qualquer outra e que ninguém nunca conta nas histórias.',
    'Não dá pra sair por aí com um Pokémon. Tecnicamente, não dá.',
    d=>d.jogador.cidade === 'Pallet'
      ? 'O posto do Centro Pokémon de Pallet funciona numa sala dos fundos do mercado, três manhãs por semana. Hoje é uma delas.'
      : `O Centro Pokémon de ${d.jogador.cidade} abre às sete. São sete e vinte.`,
    'Tem uma fila de três pessoas e todas as três têm a sua idade.'
  ],
  ef:{registrar:'Foi ao Centro Pokémon fazer o cadastro de treinador.'},
  escolhas:[
    {texto:'Entrar na fila.', vai:'c1_fila'},
    {texto:'Ir embora sem cadastro. Papel é problema de quem tem medo.', vai:'c1_sem_cadastro'},
    {texto:'Conversar com os outros três da fila antes.', vai:'c1_fila_conversa'},
    {texto:'Perguntar na recepção o que exatamente é preciso.', vai:'c1_pergunta_recepcao'},
    {texto:'Entregar a caixa da Sra. Chiyo primeiro. É pra isso que você veio.',
     vai:'c1_entregou_a_caixa', cond:d=>Estado.contaItem('Caixa de ventilador com um bicho dentro') > 0},
    {texto:'Perguntar se dá pra recarregar o aparelho aqui. Ele veio sem carga.',
     vai:'c1_carregou_o_nav', cond:d=>Estado.temPokenav()}
  ]
},

c1_fila_conversa:{
  texto:[
    'Os três da fila são: uma menina que decorou o formulário inteiro e está recitando baixinho de olhos fechados, um garoto que claramente não dormiu, e uma pessoa de uns dezesseis que já está no terceiro cadastro e não quer falar sobre isso.',
    fala('o garoto que não dormiu', 'Terceiro?! Como assim terceiro?'),
    fala('a pessoa do terceiro cadastro', 'Terceiro.', 'frio', 'Ela não desenvolve.'),
    fala('a pessoa do terceiro cadastro', 'Vocês vão ver.'),
    'Ninguém ali tem coragem de perguntar o que é que a gente vai ver.'
  ],
  ef:{flag:'ouviu_o_terceiro_cadastro'},
  escolhas:[
    {texto:'Perguntar mesmo assim.', vai:'c1_terceiro_explica'},
    {texto:'Entrar na fila e calar a boca.', vai:'c1_fila'}
  ]
},

c1_terceiro_explica:{
  texto:[
    d=>fala(d.jogador.nome, 'O que a gente vai ver?'),
    'A pessoa te olha de cima a baixo, decide que você aguenta, e responde.',
    fala('a pessoa do terceiro cadastro', 'Que a licença é anual. Que ela cai se você passar seis meses sem registrar batalha. E que, quando cai, você recomeça do zero — inclusive devolvendo a Pokédex.'),
    fala('a pessoa do terceiro cadastro', 'Eu perdi duas vezes. Voltei pra casa duas vezes. Tô aqui de novo.', null,
         'Ela dá de ombros como quem já chorou o que tinha que chorar.'),
    'Você não sabia de nada disso. E, pensando bem, você acha que ninguém que você conhece sabia.'
  ],
  ef:{flag:'sabe_da_licenca_anual',
      rep:{eixo:'bom',delta:1,motivo:'Perguntou o que os outros tiveram medo de perguntar'}},
  escolhas:[
    {texto:'Entrar na fila.', vai:'c1_fila'},
    {texto:'Conversar com os outros três da fila antes.', vai:'c1_fila_conversa'},
    {texto:'Perguntar na recepção o que exatamente é preciso.', vai:'c1_pergunta_recepcao'}
  ]
},

c1_pergunta_recepcao:{
  texto:[
    'A enfermeira do balcão tem uns trinta anos e a paciência exata de quem explica a mesma coisa quatro vezes por dia desde 1993.',
    fala('a enfermeira', 'Documento com foto, um Pokémon registrado no seu nome, e a assinatura de um responsável se você tiver menos de dezesseis.'),
    d=>fala(d.jogador.nome, 'E se eu não tiver responsável?'),
    fala('a enfermeira', 'Aí tem um formulário.', null, 'Ela já está puxando a gaveta antes de terminar a frase.'),
    fala('a enfermeira', 'Tem sempre um formulário.')
  ],
  ef:{flag:'perguntou_antes'},
  escolhas:[
    {texto:'Entrar na fila.', vai:'c1_fila'},
    {texto:'Conversar com os outros três da fila antes.', vai:'c1_fila_conversa'}
  ]
},

c1_fila:{
  texto:[
    'A fila leva quarenta minutos porque a máquina de foto quebrou e voltou a funcionar duas vezes.',
    'Quando chega a sua vez, a enfermeira empurra uma prancheta pela bancada com dois dedos.',
    fala('a enfermeira', 'Nome completo, cidade, idade. Assina embaixo. E coloca ele aqui em cima, por favor.'),
    d=>{
      const p = d.time[0];
      return p ? `Você coloca ${nomeExib(p)} na bancada. Ele não gosta da bancada. Fica quieto assim mesmo, porque é você que está pedindo.` : 'Você não tem nenhum Pokémon para colocar na bancada, e isso é um problema imediato.';
    },
    'Ela passa um leitor por cima dele. A máquina apita uma vez, seca.',
    fala('a enfermeira', 'Tudo certo. Nenhum registro anterior, nenhum chip de criador, nenhuma restrição.'),
    fala('a enfermeira', 'Ele é de casa mesmo, né?', null, 'Ela levanta os olhos da prancheta pela primeira vez.')
  ],
  escolhas:[
    {texto:'"É. Desde antes de eu lembrar."', vai:'c1_registro',
     ef:{moral:5, flag:'contou_a_historia_dele'}},
    {texto:'"É." E não explicar mais nada.', vai:'c1_registro'},
    {texto:'Perguntar o que acontece se ele tivesse registro anterior.', vai:'c1_registro_anterior'},
    {texto:'Perguntar por que isso importa.', vai:'c1_porque_importa'}
  ]
},

c1_registro_anterior:{
  texto:[
    d=>fala(d.jogador.nome, 'O que acontece se ele tivesse registro anterior?'),
    'A enfermeira não levanta os olhos da prancheta.',
    fala('a enfermeira', 'Aí eu teria que chamar o oficial de plantão. E o oficial ia perguntar como ele chegou em você. E você ia responder. E a partir da sua resposta esta manhã ia ser muito, muito diferente.', 'frio'),
    fala('a enfermeira', 'Boa sorte que não é o caso.', null, 'O carimbo desce com força.')
  ],
  ef:{flag:'sabe_do_registro_anterior'},
  escolhas:[{texto:'Assinar.', vai:'c1_registro'}]
},

c1_porque_importa:{
  texto:[
    d=>fala(d.jogador.nome, 'Por que isso importa?'),
    'Aí ela para. E olha pra você de verdade.',
    fala('a enfermeira', 'Porque tem gente vendendo Pokémon em banca de rua a duas cidades daqui. Com nota fiscal e tudo.'),
    fala('a enfermeira', 'E porque metade do que aparece nesta bancada não veio de casa nenhuma.', null, 'Ela volta ao carimbo.'),
    d=>fala(d.jogador.nome, 'E a senhora registra mesmo assim?'),
    fala('a enfermeira', 'Eu registro o que a máquina deixa registrar.', 'frio', 'Carimbo.'),
    fala('a enfermeira', 'O resto não é o meu balcão.')
  ],
  ef:{flag:'ouviu_sobre_as_bancas',
      rep:{eixo:'bom',delta:1,motivo:'Fez a pergunta certa numa fila de balcão'}},
  escolhas:[{texto:'Assinar.', vai:'c1_registro'}]
},

c1_registro:{
  texto:[
    'Você assina. A caneta é daquelas presas no balcão por um barbante.',
    'A impressora do fundo trabalha por quase um minuto inteiro e para.',
    'A enfermeira separa as coisas na bancada, uma por uma, e diz o nome de cada uma como se fosse a primeira vez na vida dela — e é, provavelmente, a quinta vez hoje.',
    fala('a enfermeira', 'Licença de treinador. Válida um ano, renovável no Centro de qualquer cidade.'),
    fala('a enfermeira', 'Cartão de treinador. Ele guarda as suas insígnias e o seu histórico. Não perde. Não perde mesmo.'),
    fala('a enfermeira', 'Pokédex. Ela é emprestada, não é sua. Registra o que você encontrar. Se você devolver com menos de vinte registros, eles vão te ligar.'),
    fala('a enfermeira', 'Kit inicial: cinco Poké Balls e dois frascos de Potion. É o que a Liga paga. O resto você compra.')
  ],
  ef:{flag:['tem_licenca','tem_pokedex','tem_cartao'],
      itens:{'Poké Ball':5,'Potion':2},
      registrar:'Licenciado como treinador. Recebeu Pokédex, cartão e kit inicial.'},
  escolhas:[
    {texto:'Perguntar o que ela faria no seu lugar.', vai:'c1_conselho'},
    {texto:'Perguntar sobre a Pokédex.', vai:'c1_pokedex'},
    {texto:'Agradecer e sair.', vai:'c1_saida'},
    {texto:'Perguntar se ela também foi treinadora.', vai:'c1_ela_foi'}
  ]
},

c1_conselho:{
  texto:[
    d=>fala(d.jogador.nome, 'O que a senhora faria no meu lugar?'),
    'Ela fecha a prancheta e pensa de verdade — o que é bem mais do que a pergunta merecia.',
    fala('a enfermeira', 'Eu andaria devagar.', null, 'Ela diz isso como quem já viu muita gente andar rápido.'),
    fala('a enfermeira', 'Todo mundo que chega neste balcão quer chegar em algum lugar. Quase ninguém repara no caminho. E o caminho é onde tudo acontece.'),
    fala('a enfermeira', 'E outra coisa.', null, 'Ela empurra a Pokédex na sua direção.'),
    fala('a enfermeira', 'Fala com as pessoas. Não com treinador — com as pessoas. Quem mora nos lugares sabe de tudo, e nunca ninguém pergunta.')
  ],
  ef:{flag:'conselho_da_enfermeira',
      rep:{eixo:'bom',delta:1,motivo:'Perguntou conselho a quem ninguém pergunta nada'}},
  escolhas:[
    {texto:'Perguntar sobre a Pokédex.', vai:'c1_pokedex'},
    {texto:'Agradecer e sair.', vai:'c1_saida'}
  ]
},

c1_ela_foi:{
  texto:[
    d=>fala(d.jogador.nome, 'A senhora também foi treinadora?'),
    'Pausa curta demais pra ser hesitação e longa demais pra ser nada.',
    fala('a enfermeira', 'Fui. Cheguei em seis insígnias.', null, 'Ela ajeita a prancheta que já estava ajeitada.'),
    d=>fala(d.jogador.nome, 'E aí?'),
    fala('a enfermeira', 'E aí o meu Rapidash morreu numa rota de madrugada, e eu não tinha Potion, porque eu tinha gastado tudo em Poké Ball.', 'baixo',
         'Ela sorri. O sorriso é completamente normal, e é essa a parte ruim.'),
    fala('a enfermeira', 'Compra Potion. Sempre mais Potion do que bola. Ninguém nunca escuta isso.')
  ],
  ef:{flag:'historia_da_enfermeira', itens:{'Potion':1},
      npc:{nome:'Enfermeira do Centro', opiniao:3, memoria:'Te contou por que parou de ser treinadora. Chegou em seis insígnias.'},
      rep:{eixo:'bom',delta:1,motivo:'Escutou a história de alguém que ninguém escuta'}},
  escolhas:[
    {texto:'Perguntar sobre a Pokédex.', vai:'c1_pokedex'},
    {texto:'Agradecer e sair.', vai:'c1_saida'}
  ]
},

c1_pokedex:{
  texto:[
    'A Pokédex é menor e mais pesada do que parece nas fotos. A tela tem um risco na diagonal que já estava lá.',
    fala('a enfermeira', 'É de segunda mão.', null, 'Ela confirma sem você ter perguntado nada.'),
    fala('a enfermeira', 'Todas são. A primeira leva de aparelho novo foi pro Professor e pros três que ele escolheu, faz uns anos.'),
    d=>fala(d.jogador.nome, 'E funcionou?'),
    fala('a enfermeira', 'Um deles derrubou a Equipe Rocket sozinho e sumiu.', null, 'Ela dá de ombros.'),
    fala('a enfermeira', 'Então sim. Mais ou menos.'),
    'Você segura na mão uma versão gasta do mesmo aparelho.'
  ],
  ef:{flag:'sabe_do_red'},
  escolhas:[
    {texto:'Perguntar quem sumiu.', vai:'c1_quem_sumiu'},
    {texto:'Agradecer e sair.', vai:'c1_saida'}
  ]
},

c1_quem_sumiu:{
  texto:[
    d=>fala(d.jogador.nome, 'Quem sumiu?'),
    fala('a enfermeira', 'O Red.', null, 'Ela fala o nome do jeito que se fala nome de parente distante que deu certo.'),
    fala('a enfermeira', 'Terminou o que tinha pra terminar e foi embora. Ninguém sabe pra onde.'),
    d=>fala(d.jogador.nome, 'E a Liga?'),
    fala('a enfermeira', 'A cadeira de Campeão tá vaga faz dois anos.', null, 'E aí ela finalmente sorri de verdade.'),
    fala('a enfermeira', 'Então, tecnicamente, tá aberta.'),
    'Ela diz isso pra você de um jeito muito específico, e você entende que ela diz isso pra todo mundo que passa por esse balcão, e que ela acerta uma vez a cada mil.'
  ],
  ef:{flag:'sabe_da_cadeira_vaga'},
  escolhas:[{texto:'Sair.', vai:'c1_saida'}]
},

c1_sem_cadastro:{
  texto:[
    'Você passa direto pelo Centro Pokémon.',
    'Sem licença, sem cartão, sem Pokédex, sem bola nenhuma, com uma mochila de roupa e comida.',
    'Isso é legal? Não exatamente. Isso acontece? O tempo todo.',
    'O que acontece de verdade é o seguinte: você vai chegar na primeira rota, encontrar um Pokémon selvagem, não ter nada pra jogar nele, e voltar.',
    'Você sabe disso enquanto anda. Anda mais uns cem metros sabendo disso.'
  ],
  ef:{flag:'recusou_o_cadastro'},
  escolhas:[
    {texto:'Voltar e fazer o cadastro.', vai:'c1_fila'},
    {texto:'Seguir assim mesmo. Você se vira.', vai:'c1_saida',
     ef:{rep:{eixo:'ruim',delta:1,motivo:'Saiu em jornada sem licença'}, flag:'sem_licenca'}}
  ]
},

c1_saida:{
  texto:[
    d=>`A placa na saída de ${d.jogador.cidade} está torta desde sempre. O nome da cidade em letra grande e uma seta apontando para o mato.`,
    'Daqui pra frente o chão não é mais conhecido.',
    d=>{
      if (d.flags.tem_licenca) return 'No bolso: uma licença com a sua foto ruim, um cartão sem nenhuma insígnia e uma Pokédex emprestada com risco na tela.';
      return 'No bolso: nada. Você está indo assim mesmo.';
    },
    d=>{
      const p = d.time[0];
      return p ? `Do seu lado, ${nomeExib(p)}, que nunca saiu desta cidade e que não faz ideia do que é uma rota, e que está indo do mesmo jeito.` : 'Do seu lado, ninguém.';
    },
    'Sete e cinquenta da manhã. Você não andou nem uma hora de casa e já é outra pessoa, o que é ridículo e verdadeiro.'
  ],
  escolhas:[
    {texto:'Entrar no mato.', vai:'c1_primeiro_encontro'},
    {texto:'Olhar a cidade uma última vez antes.', vai:'c1_olhar_pra_tras'}
  ]
},

c1_olhar_pra_tras:{
  texto:[
    'Você vira e olha.',
    d=>`${d.jogador.cidade} de longe é menor do que você imaginava que fosse, e você morou nela a vida inteira.`,
    'Tem fumaça saindo de uma chaminé. Tem alguém varrendo uma calçada.',
    'Você guarda essa imagem com atenção, de propósito, do jeito que se guarda uma coisa que se vai querer depois.',
    'Depois vira de volta.'
  ],
  ef:{flag:'olhou_pra_tras', moral:5},
  escolhas:[{texto:'Entrar no mato.', vai:'c1_primeiro_encontro'}]
},

c1_primeiro_encontro:{
  texto:[
    'O capim é mais alto do que parecia de longe. Na altura do peito, em alguns trechos.',
    'Alguma coisa se mexe nele a uns quatro passos.',
    'Não é medo o que você sente. É a coisa mais parecida com medo que já te aconteceu.',
    d=>d.flags.tem_licenca ? 'A mão vai sozinha para o cinto, onde tem cinco Poké Balls que há uma hora não existiam.' : 'A sua mão vai para o cinto e não acha nada, porque não tem nada.'
  ],
  batalha:{aleatorio:true, ambiente:'campo', nivelBase:4, tipo:'selvagem',
           vitoria:'c1_fim', derrota:'c1_fim', fuga:'c1_fim', captura:'c1_fim', gameover:'gameover'}
},

c1_fim:{
  texto:[
    'Você senta no chão quando acaba. As mãos tremem um pouco — a adrenalina indo embora, que é uma sensação nova e não é boa.',
    'Não foi bonito. Ninguém viu. Mas aconteceu, e foi você que fez.',
    d=>{
      const p = d.time[0];
      return p ? `${nomeExib(p)} senta do seu lado, encostado, respirando rápido. Vocês dois nunca fizeram isso antes.` : 'Você está sozinho no capim.';
    },
    'O sol ainda está subindo.',
    'Daqui pra frente, ninguém te diz mais pra onde ir. Você escolhe a rota, escolhe a hora, escolhe se vai parar numa cidade ou passar direto.',
    'É isso que ninguém explica sobre sair de casa: não é que o mundo fica grande. É que ele fica com você.'
  ],
  fim:true, resumo:'Você saiu de casa, e agora Kanto inteira é uma escolha por vez.'
}
}}

);
