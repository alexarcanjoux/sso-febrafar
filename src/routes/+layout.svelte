<script>
  /**
   * Layout raiz — o que é igual em todas as telas de acesso.
   *
   * O produto já vem resolvido do `+layout.js`, e é dele que sai o favicon: a
   * aba precisa dizer em qual sistema a pessoa está entrando antes mesmo de ela
   * olhar para a tela, e numa janela com o produto aberto ao lado é o ícone
   * que emparelha as duas abas.
   *
   * ⚠️ O ÍCONE SAI DAQUI E NÃO DO `app.html`. O `<link rel="icon">` fixo que
   * morava lá venceria por vir antes? Não — venceria o último, e o
   * `%sveltekit.head%` vem depois; mas manter os dois deixaria um favicon
   * genérico carregando primeiro e trocando na sequência, uma piscada de marca
   * errada em toda navegação. Um só, e ele é o do produto.
   *
   * O `?produto=` desconhecido cai no guarda-chuva Febrafar (ver
   * `resolverProduto`), então nunca falta ícone.
   */
  import '../app.css';

  let { data, children } = $props();
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href={data.produto.icone} />
</svelte:head>

{@render children()}
