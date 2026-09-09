<script>
  /**
   * Label — Fideliza Mais Design System
   *
   * Rótulo tipográfico para nomear uma seção ou item. Suporta ícone (com ou
   * sem container), sublabel acima ou abaixo do título, e um ícone de ajuda
   * clicável à direita.
   *
   * @typedef {Object} Props
   * @property {string} text                       Texto principal do rótulo
   * @property {string} [sublabel]                 Texto secundário
   * @property {'top' | 'bottom'} [sublabelPosition]  Posição do sublabel
   * @property {'sm' | 'md' | 'lg'} [size]         Tamanho tipográfico do título
   * @property {boolean} [iconContainer]           Exibe o ícone num container (quadrado roxo)
   * @property {() => void} [onHelp]               Callback do ícone de ajuda — se omitido, sem help
   * @property {string} [helpLabel]                Label acessível do botão de ajuda
   * @property {import('svelte').Snippet} [icon]   Ícone principal — opcional
   */
  /** @type {Props} */
  let {
    text,
    sublabel,
    sublabelPosition = 'bottom',
    size = 'md',
    iconContainer = false,
    onHelp,
    helpLabel = 'Ajuda',
    icon,
  } = $props();

  /**
   * Tipografia do título por tamanho. `md` usa o alias text-base-default
   * (16px semibold) — estilo padrão do DS; sm/lg ajustam só o tamanho.
   */
  const titleSize = {
    sm: 'text-sm font-semibold',
    md: 'text-base-default',
    lg: 'text-xl font-semibold',
  };

  /** Dimensões do ícone / container por tamanho. */
  const iconSize = {
    sm: { glyph: 'w-16px h-16px', box: 'w-28px h-28px rounded-6px' },
    md: { glyph: 'w-20px h-20px', box: 'w-32px h-32px rounded-8px' },
    lg: { glyph: 'w-24px h-24px', box: 'w-40px h-40px rounded-8px' },
  };

  const s = $derived(iconSize[size]);
</script>

<div class="inline-flex items-center gap-12px">
  {#if icon}
    {#if iconContainer}
      <span class="shrink-0 flex items-center justify-center bg-brand-50 text-brand-500 {s.box}">
        <span class={s.glyph}>{@render icon()}</span>
      </span>
    {:else}
      <span class="shrink-0 text-brand-500 {s.glyph}">{@render icon()}</span>
    {/if}
  {/if}

  <div class="min-w-0 flex flex-col">
    {#if sublabel && sublabelPosition === 'top'}
      <span class="text-sm text-slate-500">{sublabel}</span>
    {/if}

    <span class="text-slate-700 {titleSize[size]}">{text}</span>

    {#if sublabel && sublabelPosition === 'bottom'}
      <span class="text-sm text-slate-500">{sublabel}</span>
    {/if}
  </div>

  {#if onHelp}
    <button
      type="button"
      onclick={() => onHelp()}
      aria-label={helpLabel}
      class="shrink-0 inline-flex items-center justify-center w-20px h-20px rounded-full
             text-brand-500 transition-control cursor-pointer
             hover:text-brand-600
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-full h-full" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.5 9.5a2.5 2.5 0 114 2c-1 .8-1.5 1.3-1.5 2.5m0 3h.01" />
      </svg>
    </button>
  {/if}
</div>
