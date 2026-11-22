/* ============================================================
   A ABERTURA: quem aparece nela
   A vitrine ("Quem é esse Pokémon?") passa por esses, um por vez, em
   silhueta e depois revelado; o desfile é quem fica no capim quando o
   navegador ainda não tem jornada. Os que qualquer um reconhece, sem
   lendário nem Mew.

   A arte é o sprite animado de Black/White (a GIF da luta). O artefato
   publicado não leva as GIFs do jogo, então o build.py lê estas duas
   listas e embute as GIFs delas à parte, só pra abertura
   (UI.arteDaAbertura). Quem entra aqui pesa no artefato: a lista
   inteira dá uns 1,3 MB.
   ============================================================ */
const VITRINE_DA_ABERTURA = [1, 3, 4, 6, 7, 9, 25, 35, 37, 39, 52, 54, 58, 59, 94, 123, 129, 130, 131, 133, 143, 147, 149];
const DESFILE_DA_ABERTURA = [1, 4, 25, 7, 133];
