<script>
  /**
   * Aviso — mensagem inline no topo de um formulário.
   *
   * Complementa o `error` do FormField, que fala de um campo. O Aviso fala
   * do envio inteiro: credencial recusada, link expirado, e-mail enviado.
   *
   * Não usa a cor da marca de propósito — o significado (erro, sucesso) não
   * pode depender de qual produto abriu a tela.
   *
   * @typedef {Object} Props
   * @property {'erro' | 'sucesso' | 'atencao' | 'info'} [tom]
   * @property {string} [titulo]
   * @property {import('svelte').Snippet} [children]  Texto da mensagem
   */

  /** @type {Props} */
  let { tom = 'info', titulo, children } = $props();

  /** Container por tom — fundo, borda e cor do texto. */
  const tomClasses = {
    erro: 'bg-red-50 border-red-200 text-red-900',
    sucesso: 'bg-green-50 border-green-200 text-green-900',
    atencao: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    info: 'bg-slate-50 border-slate-200 text-slate-700',
  };

  /** Cor do ícone — um passo mais saturada que o texto. */
  const iconeClasses = {
    erro: 'text-red-500',
    sucesso: 'text-green-600',
    atencao: 'text-yellow-600',
    info: 'text-slate-400',
  };

  /** Paths no viewBox 24 — check para sucesso, alerta para o resto. */
  const paths = {
    erro: 'M12 2L1 21h22L12 2zm0 6a1 1 0 011 1v5a1 1 0 01-2 0V9a1 1 0 011-1zm0 9a1.2 1.2 0 110 2.4A1.2 1.2 0 0112 17z',
    atencao:
      'M12 2L1 21h22L12 2zm0 6a1 1 0 011 1v5a1 1 0 01-2 0V9a1 1 0 011-1zm0 9a1.2 1.2 0 110 2.4A1.2 1.2 0 0112 17z',
    sucesso:
      'M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.3l-4-4 1.4-1.4 2.6 2.6 5.6-5.6L17.8 9l-7 7z',
    info: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4.8a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM11 11h2v6h-2z',
  };

  /** Erro precisa chegar ao leitor de tela na hora; o resto é educado. */
  const papel = $derived(tom === 'erro' ? 'alert' : 'status');
</script>

<div
  role={papel}
  class="flex items-start gap-12px rounded-8px border p-16px {tomClasses[tom]}"
>
  <svg viewBox="0 0 24 24" fill="currentColor" class="shrink-0 w-20px h-20px {iconeClasses[tom]}" aria-hidden="true">
    <path d={paths[tom]} />
  </svg>

  <div class="min-w-0 flex flex-col gap-2px">
    {#if titulo}
      <span class="text-sm font-semibold">{titulo}</span>
    {/if}
    {#if children}
      <span class="text-sm font-normal">{@render children()}</span>
    {/if}
  </div>
</div>
