/* ============================================================
   O FIO — o que está em aberto num capítulo grande
   Capítulo de cento e tantas cenas espalha a investigação pela cidade
   inteira, e quem volta depois de três dias não lembra onde estava. O
   Diário mostra o fio do capítulo: a pergunta dele e as pontas que você
   já puxou, cada uma no ponto mais longe a que você chegou, com a linha
   que a própria cena escreveu no diário.

   Ponta que você nunca tocou não aparece: o fio é memória, não mapa. A
   pergunta não conta nada que o capítulo ainda não contou, e nenhuma
   ponta diz o que fazer ("vá ao porto"): ela só lembra o que você já
   sabe. O nome da ponta sai da primeira cena dela, nunca de uma que
   vem depois ("O torneio", não "A fundação" que aparece no fim dele).
   Cena nova que avança uma ponta entra na lista dela, na ordem da
   história; a cena precisa ter `registrar`.
   ============================================================ */
const FIO_DOS_CAPITULOS = {
  4: {pergunta:'Pewter está mandando alguma coisa embora. O quê, e pra quem?',
      pontas:[
        {nome:'O museu', cenas:['c4_museu', 'c4_senhora_comprar', 'c4_senhora_quem_perguntou', 'c4_ivone_onze_anos',
          'c4_delmo_oferta', 'c4_delmo_terno', 'c4_ivone_compradores', 'c4_ivone_gaveta', 'c4_ivone_cinnabar']},
        {nome:'A pedreira', cenas:['c4_rua2', 'c4_setor_quatro', 'c4_ab_quem_atravessou']},
        {nome:'A fenda', cenas:['c4_pedreira_borda', 'c4_fenda', 'c4_encarou', 'c4_comprador', 'c4_acordo_rapaz', 'c4_sexta']}
      ]},
  6: {pergunta:'Em Cerulean, Pokémon tem preço. Quem compra, e pra levar aonde?',
      pontas:[
        {nome:'A banca da ponte', cenas:['c6_ab_o_que_mudou', 'c6_ponte_norte', 'c6_nao_vende', 'c6_quem_compra_lote']},
        {nome:'A van', cenas:['c6_acampou', 'c6_estrada_velha', 'c6_cascalho', 'c6_espera_van', 'c6_abre_as_caixas',
          'c6_pra_onde_vai', 'c6_quem_recebe']},
        {nome:'O rio', cenas:['c6_rio_cor', 'c6_contou_bilac', 'c6_misty_diesel']},
        {nome:'A Misty', cenas:['c6_misty_processos', 'c6_misty_folha', 'c6_misty_oficio', 'c6_quem_respondeu', 'c6_nome_criador']},
        {nome:'A Rota 25', cenas:['c6_marta', 'c6_foi_sozinho_tigelas', 'c6_marta_conta', 'c6_veneno', 'c6_venceu_veneno',
          'c6_vira_voce', 'c6_juntos', 'c6_pai_depois']}
      ]},
  8: {pergunta:'O que o S.S. Anne leva quando sai de Vermilion?',
      pontas:[
        {nome:'Os contêineres', cenas:['c8_ab_conferencia', 'c8_deixou_falarem', 'c8_que_horas', 'c8_portao_cinco', 'c8_de_colete',
          'c8_anotou_lacre', 'c8_balanca_dois', 'c8_etiquetas', 'c8_abriu_caixa', 'c8_soltou_caixas']},
        {nome:'Quem embarca', cenas:['c8_carga_viva', 'c8_nem_sempre', 'c8_a_mulher_do_balcao', 'c8_quantas_bandejas',
          'c8_bandejas_vazias', 'c8_conferiu_de_novo', 'c8_segundo_bilhete', 'c8_bateu_no_40', 'c8_entrou_no_40', 'c8_saiu_andando']},
        {nome:'O menino do cais', cenas:['c8_porque_vender', 'c8_avisou_o_menino', 'c8_atras_do_menino', 'c8_a_carta_do_denis',
          'c8_amigo_do_cais']},
        {nome:'O torneio', cenas:['c8_torneio', 'c8_ganhou_torneio', 'c8_sobre_o_que', 'c8_a_conversa', 'c8_a_regua',
          'c8_quem_segura', 'c8_o_nome_dele']},
        {nome:'O capitão', cenas:['c8_capitao', 'c8_ele_continuou', 'c8_nao_faz_nada', 'c8_registrou_no_diario']}
      ]},
  9: {pergunta:'Celadon compra. De onde vem o que ela compra?',
      pontas:[
        {nome:'A tabela', cenas:['c9_ab_a_mesa', 'c9_compra_se', 'c9_quem_emite', 'c9_onde_e_o_leilao', 'c9_compram_de_onde']},
        {nome:'O leilão', cenas:['c9_proximo_leilao', 'c9_cassino_por_baixo', 'c9_olhou_o_leilao', 'c9_o_que_e_o_pregao',
          'c9_nao_tenho_credencial', 'c9_o_lote_41']},
        {nome:'O depósito', cenas:['c9_pra_onde_vai_o_lote', 'c9_certidao', 'c9_achou_meio', 'c9_achou_deposito',
          'c9_dentro_limpo', 'c9_gaiola_41', 'c9_livro']},
        {nome:'Quem assina', cenas:['c9_anotou_certificado', 'c9_quem_e_renno', 'c9_busca_renno', 'c9_os_dois_juntos', 'c9_leu_as_certidoes']},
        {nome:'O cassino', cenas:['c9_cassino', 'c9_e_legal']}
      ]},
  11: {pergunta:'O que tem no andar 11?',
       pontas:[
         {nome:'A Sabrina', cenas:['c11_ab_quem_e_s', 'c11_ginasio', 'c11_acampados', 'c11_porque_eu', 'c11_sabrina',
           'c11_sabrina_oque', 'c11_eles_sabem', 'c11_noventa_e_seis_bate']},
         {nome:'O prédio', cenas:['c11_quarteirao', 'c11_parede_cega', 'c11_teve_porta', 'c11_marca_da_porta', 'c11_estranho_no_predio',
           'c11_livro_visitantes']},
         {nome:'Quem trabalha lá', cenas:['c11_fila', 'c11_terceirizado', 'c11_quem_limpa', 'c11_cracha_azul', 'c11_o_que_ela_assina']},
         {nome:'O dinheiro', cenas:['c11_bar', 'c11_seguiu_o_orcamento']},
         {nome:'O caminhão', cenas:['c11_ab_pelo_norte', 'c11_ab_vigiou']}
       ]},
  18: {pergunta:'Quem decide, e onde isso fica escrito?',
       pontas:[
         {nome:'A sala 704', cenas:['c18_quintela_achou', 'c18_quem_assina', 'c18_704_nome_do_adnan', 'c18_704_quem_e']},
         {nome:'A carga', cenas:['c18_seguiu_a_caixa', 'c18_atendente_encomenda', 'c18_as_onze', 'c18_o_motorista']},
         {nome:'As atas', cenas:['c18_so_estatuto', 'c18_704_pediu_atas', 'c18_matriz_original', 'c18_croqui_estacao4']},
         {nome:'O dinheiro', cenas:['c18_anexo_orcamento', 'c18_terceira', 'c18_terceira_compra']},
         {nome:'A Liga', cenas:['c18_liga_tecnico', 'c18_liga_quem_assinou']}
       ]}
};

const Fio = {
  /* o fio do capítulo de agora: a pergunta e as pontas puxadas */
  doCapitulo(d){
    d = d || (typeof Estado !== 'undefined' ? Estado.dados : null);
    if (!d) return null;
    const F = FIO_DOS_CAPITULOS[d.capitulo];
    const cap = typeof Historia !== 'undefined' ? Historia.capitulo(d.capitulo) : null;
    if (!F || !cap) return null;
    const viu = id => !!(d.cenasAplicadas && d.cenasAplicadas[d.capitulo + ':' + id]);
    const pontas = F.pontas.map(p => {
      const ate = p.cenas.filter(viu);
      if (!ate.length) return null;
      const ultima = ate[ate.length - 1];
      const cena = cap.cenas[ultima] || {};
      const ef = cena.ef || {};
      const r = typeof ef.registrar === 'function' ? ef.registrar(d) : ef.registrar;
      return r ? {nome:p.nome, texto:String(r), passos:ate.length, de:p.cenas.length} : null;
    }).filter(Boolean);
    return {pergunta:F.pergunta, pontas};
  }
};
