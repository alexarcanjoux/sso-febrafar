<script>
  /**
   * LoadingButton — Fideliza Mais Design System
   *
   * Botão que exibe um spinner ao processar uma ação. Quando `loading` é true,
   * troca o conteúdo por um spinner + label opcional e bloqueia novos cliques.
   *
   * Espelha as variantes/tamanhos do atom Button.
   *
   * @typedef {Object} Props
   * @property {'primary' | 'secondary'} [variant]
   * @property {'sm' | 'md' | 'lg' | 'xl'} [size]
   * @property {'button' | 'submit'} [type]   Telas de acesso enviam formulário: use 'submit'
   * @property {boolean} [loading]            Estado de carregamento
   * @property {string} [loadingLabel]        Texto exibido durante o loading (opcional)
   * @property {boolean} [disabled]
   * @property {boolean} [fullWidth]
   * @property {(e: MouseEvent) => void} [onclick]
   * @property {import('svelte').Snippet} [children]
   */
  /** @type {Props} */
  let {
    variant = 'primary',
    size = 'lg',
    type = 'button',
    loading = false,
    loadingLabel,
    disabled = false,
    fullWidth = false,
    onclick,
    children,
  } = $props();

  // `text-brand-contraste` em vez de branco fixo — ver a nota no Button.
  const variants = {
    primary:
      'bg-brand-500 text-brand-contraste border-transparent hover:bg-brand-600 active:bg-brand-700',
    secondary:
      'bg-suporte-branco border-slate-100 text-brand-500 shadow-base hover:bg-brand-50',
  };

  const sizes = {
    sm: 'h-[30px] text-sm px-12px gap-6px rounded-6px',
    md: 'h-32px text-sm px-16px gap-8px rounded-6px',
    lg: 'h-40px text-sm px-20px gap-8px rounded-8px',
    // xl espelha o Button: é o tamanho da ação principal das telas de acesso.
    xl: 'h-52px text-base px-24px gap-8px rounded-8px',
  };

  /** Diâmetro do spinner por tamanho do botão. */
  const spinnerSize = {
    sm: 'w-16px h-16px',
    md: 'w-16px h-16px',
    lg: 'w-20px h-20px',
    xl: 'w-20px h-20px',
  };

  // Cor do spinner: claro no primary, brand no secondary.
  const spinnerTone = $derived(
    variant === 'primary'
      ? 'border-brand-400 border-t-brand-contraste'
      : 'border-brand-200 border-t-brand-500',
  );

  const isBlocked = $derived(loading || disabled);
</script>

<button
  {type}
  {onclick}
  disabled={isBlocked}
  aria-busy={loading}
  class="inline-flex items-center justify-center border font-medium transition-control cursor-pointer
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
         disabled:cursor-not-allowed disabled:opacity-60
         {variants[variant]} {sizes[size]} {fullWidth ? 'w-full' : ''}"
>
  {#if loading}
    <span class="rounded-full border-2 {spinnerTone} {spinnerSize[size]} animate-spin-loading"></span>
    {#if loadingLabel}{loadingLabel}{/if}
  {:else if children}
    {@render children()}
  {/if}
</button>
