/* ============================================================
   O VIZINHO DA RUA — um por cidade natal
   Toda cidade tem alguém que cuida da mesma coisa na frente de
   casa há vinte anos e que lembra do estrago que você fez quando
   era criança. Em Pallet é o Sr. Ives e a janela; em Cerulean é
   a Dona Coral e a rede; em Cinnabar, o Sr. Basil e as telhas.
   A forma da cena é a mesma (a dívida, os jeitos de acertar, a
   volta no capítulo 21); a pessoa, o ofício e a história, não.

   Campos: nome, f (mulher), trat (como você chama), coisa (do que
   cuida), ferr (a ferramenta, com artigo), faz (o que faz agora),
   fazer (infinitivo), divida (o que você quebrou, com artigo), como
   (como quebrou), preco, conserto, trabalho (você fazendo o serviço
   dela), sempre (como a coisa está quando você volta), parou (o que
   o corpo não deixa mais fazer).
   ============================================================ */
const VIZINHOS = {
  Pallet:{nome:'Sr. Ives', f:false, trat:'seu Ives', coisa:'calçada', ferr:'a vassoura',
    faz:'varre a calçada da própria casa', fazer:'varrer a calçada',
    divida:'a janela', como:'Você quebrou porque você chutou a bola.',
    preco:'vinte pokedólares em 1989', conserto:'eu consertei no mesmo dia com um vidro que eu já tinha',
    trabalho:'Você varre a calçada inteira. Leva doze minutos. Ela já estava varrida.',
    sempre:'A calçada está varrida. Ela sempre está varrida.',
    parou:'a calçada já tá varrida desde as seis, e antes eu varria de novo às onze só pra ter o que fazer'},
  Viridian:{nome:'Dona Magnólia', f:true, trat:'dona Magnólia', coisa:'fileira de vasos', ferr:'o regador',
    faz:'rega os vasos que ocupam metade da calçada', fazer:'regar os vasos',
    divida:'o vaso da samambaia', como:'Você derrubou porque subiu no muro atrás de um Caterpie.',
    preco:'doze pokedólares em 1990', conserto:'eu replantei a samambaia num balde, e ela gostou mais do balde',
    trabalho:'Você rega os trinta e um vasos, um por um. Leva doze minutos. Ela tinha regado às seis.',
    sempre:'Os vasos estão regados. Eles sempre estão regados.',
    parou:'os vasos já tão regados desde as seis, e antes eu regava de novo às onze só pra ter o que fazer'},
  Pewter:{nome:'Sr. Moss', f:false, trat:'seu Moss', coisa:'soleira de pedra', ferr:'a escova',
    faz:'escova a soleira de pedra da porta de casa', fazer:'escovar a soleira',
    divida:'a placa da porta', como:'Você riscou o seu nome inteiro nela com um prego.',
    preco:'trinta pokedólares em 1988', conserto:'eu virei a placa do avesso, e o nome do outro lado ficou até melhor',
    trabalho:'Você escova a soleira inteira de joelho. Leva doze minutos. Ela já estava limpa.',
    sempre:'A soleira está escovada. Ela sempre está escovada.',
    parou:'a soleira já tá escovada desde as seis, e antes eu escovava de novo às onze só pra ter o que fazer'},
  Cerulean:{nome:'Dona Coral', f:true, trat:'dona Coral', coisa:'rede', ferr:'a agulha de rede',
    faz:'remenda uma rede de pesca estendida na calçada', fazer:'remendar a rede',
    divida:'a rede', como:'Você cortou pra soltar um Goldeen que tinha ficado preso.',
    preco:'quinze pokedólares em 1990', conserto:'eu remendei na mesma noite, e aquele Goldeen merecia sair',
    trabalho:'Você remenda um palmo de rede. Leva doze minutos e fica torto. A rede já estava remendada.',
    sempre:'A rede está estendida e remendada. Ela sempre está remendada.',
    parou:'a rede já tá remendada desde as seis, e antes eu remendava de novo às onze só pra ter o que fazer'},
  Vermilion:{nome:'Sr. Hale', f:false, trat:'seu Hale', coisa:'bote virado', ferr:'a espátula',
    faz:'raspa a tinta de um bote virado de cabeça pra baixo na calçada', fazer:'raspar o bote',
    divida:'o remo', como:'Você usou de taco de beisebol e ele partiu no meio.',
    preco:'dezoito pokedólares em 1989', conserto:'eu colei com resina, e ele rema melhor torto',
    trabalho:'Você raspa o casco inteiro. Leva doze minutos. Ele já estava raspado.',
    sempre:'O bote está raspado. Ele sempre está raspado.',
    parou:'o bote já tá raspado desde as seis, e antes eu raspava de novo às onze só pra ter o que fazer'},
  Lavender:{nome:'Dona Sálvia', f:true, trat:'dona Sálvia', coisa:'velas do portão', ferr:'a caixa de fósforo',
    faz:'acende as velas do portão, uma por uma, como toda manhã', fazer:'acender as velas',
    divida:'o sino de vento', como:'Você arrancou pra ver se ele tocava mais alto na mão.',
    preco:'dez pokedólares em 1991', conserto:'eu pendurei de novo com barbante, e ele toca desafinado desde então',
    trabalho:'Você acende as vinte e duas velas. Leva doze minutos. Estavam todas acesas.',
    sempre:'As velas do portão estão acesas. Elas sempre estão acesas.',
    parou:'as velas já tão acesas desde as seis, e antes eu trocava de novo às onze só pra ter o que fazer'},
  Celadon:{nome:'Sr. Rudd', f:false, trat:'seu Rudd', coisa:'canteiro do prédio', ferr:'a mangueira',
    faz:'rega o canteiro na frente do prédio', fazer:'regar o canteiro',
    divida:'o canteiro de tulipas', como:'Você arrancou dezesseis bulbos procurando uma bola de brinquedo que tinha enterrado.',
    preco:'vinte e cinco pokedólares em 1990', conserto:'eu replantei na primavera seguinte, e ninguém do prédio notou',
    trabalho:'Você rega o canteiro inteiro. Leva doze minutos. A terra já estava molhada.',
    sempre:'O canteiro está regado. Ele sempre está regado.',
    parou:'o canteiro já tá regado desde as seis, e antes eu regava de novo às onze só pra ter o que fazer'},
  Saffron:{nome:'Dona Hera', f:true, trat:'dona Hera', coisa:'vitrine da oficina', ferr:'o rodo',
    faz:'lava a vitrine da oficina de conserto de rádio', fazer:'lavar a vitrine',
    divida:'a vitrine', como:'Você rachou com uma bola de borracha que nem era sua.',
    preco:'quarenta pokedólares em 1989', conserto:'eu pus uma fita por dentro, e a rachadura virou enfeite',
    trabalho:'Você lava a vitrine inteira. Leva doze minutos. Ela já estava limpa.',
    sempre:'A vitrine está limpa, com a rachadura de sempre. Ela sempre está limpa.',
    parou:'a vitrine já tá limpa desde as seis, e antes eu lavava de novo às onze só pra ter o que fazer'},
  Fuchsia:{nome:'Sr. Olin', f:false, trat:'seu Olin', coisa:'ração dos Slowpoke', ferr:'o saco de ração',
    faz:'dá ração pros Slowpoke da praça, mesmo com a placa da prefeitura pedindo pra não dar', fazer:'dar ração pros Slowpoke',
    divida:'o portão', como:'Você deixou aberto, e o meu Doduo passou dois dias no mato.',
    preco:'doze pokedólares em 1990', conserto:'o Doduo voltou sozinho no terceiro dia, com mais fome que culpa',
    trabalho:'Você dá a ração a onze Slowpoke. Leva doze minutos. Eles já tinham comido.',
    sempre:'Os Slowpoke da praça estão alimentados. Eles sempre estão.',
    parou:'os Slowpoke já comeram às seis, e antes eu dava de novo às onze só pra ter o que fazer'},
  Cinnabar:{nome:'Sr. Basil', f:false, trat:'seu Basil', coisa:'escada', ferr:'o rastelo',
    faz:'rastela a cinza do vulcão da escada de casa', fazer:'rastelar a escada',
    divida:'a telha do quarto', como:'Você subiu no telhado pra ver o vulcão de perto e pisou onde não devia.',
    preco:'vinte pokedólares em 1989', conserto:'eu troquei no mesmo dia, que aqui telha é o que não falta',
    trabalho:'Você rastela a escada inteira. Leva doze minutos. Não tinha cinza.',
    sempre:'A escada está sem cinza. Ela sempre está sem cinza.',
    parou:'a escada já tá limpa desde as seis, e antes eu rastelava de novo às onze só pra ter o que fazer'},
  Indigo:{nome:'Sr. Brenn', f:false, trat:'seu Brenn', coisa:'escadaria da pousada', ferr:'a vassoura',
    faz:'varre a escadaria da pousada do planalto', fazer:'varrer a escadaria',
    divida:'o letreiro', como:'Você acertou o P com uma pedra, e ficou escrito OUSADA.',
    preco:'vinte pokedólares em 1990', conserto:'o letreiro ficou OUSADA dois anos e ninguém reclamou',
    trabalho:'Você varre os quarenta degraus. Leva doze minutos. Estavam varridos.',
    sempre:'A escadaria está varrida. Ela sempre está varrida.',
    parou:'a escadaria já tá varrida desde as seis, e antes eu varria de novo às onze só pra ter o que fazer'}
};

/* O vizinho da sua cidade, com as palavras que mudam com o sexo dele.
   Guarda o nome escolhido no save: mudar a tabela depois não troca a
   pessoa de quem você já é devedor. */
function vz(){
  const d = (typeof Estado !== 'undefined' && Estado.dados) || null;
  const cidade = d && d.jogador ? d.jogador.cidade : 'Pallet';
  const v = Object.assign({}, VIZINHOS[cidade] || VIZINHOS.Pallet);
  const F = v.f;
  v.ele = F ? 'ela' : 'ele'; v.Ele = F ? 'Ela' : 'Ele';
  v.dele = F ? 'dela' : 'dele'; v.o = F ? 'a' : 'o';
  v.do = F ? 'da' : 'do';                     // "da Dona Coral"
  v.velho = F ? 'Uma velha' : 'Um velho';
  v.senhor = F ? 'A senhora' : 'O senhor';
  v.Ferr = v.ferr[0].toUpperCase() + v.ferr.slice(1);
  v.Divida = v.divida[0].toUpperCase() + v.divida.slice(1);
  v.uma = /^a /.test(v.ferr) ? 'uma ' + v.ferr.slice(2) : /^o /.test(v.ferr) ? 'um ' + v.ferr.slice(2) : v.ferr;
  return v;
}
