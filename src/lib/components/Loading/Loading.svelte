<script>
  /**
   * Loading — Fideliza Mais Design System
   *
   * Indicadores de carregamento. 4 tipos via prop `type`:
   *  - shimmer      → placeholder com varredura de brilho (abertura de páginas)
   *  - spinner      → anel girando (carregamentos longos); base slate-200, arco brand
   *  - spinner-icon → mesmo spinner, com ícone ilustrativo no centro
   *  - custom       → anéis orbitando + ilustração central (efeito tipo Lottie, em CSS)
   *
   * Para o spinner em botão, ver o componente LoadingButton.
   *
   * @typedef {Object} Props
   * @property {'shimmer' | 'spinner' | 'spinner-icon' | 'custom'} [type]
   * @property {'sm' | 'md' | 'lg'} [size]   Tamanho do spinner/custom
   * @property {string} [label]              Texto abaixo do indicador
   * @property {number} [lines]              Nº de linhas do shimmer (type=shimmer)
   * @property {string} [image]              URL da ilustração central (type=custom)
   * @property {string} [imageAlt]           Texto alternativo da ilustração
   * @property {import('svelte').Snippet} [icon]   Ícone central (type=spinner-icon)
   */
  /** @type {Props} */
  let {
    type = 'spinner',
    size = 'md',
    label,
    lines = 3,
    image,
    imageAlt = '',
    icon,
  } = $props();

  /** Diâmetro do spinner por tamanho. */
  const spinnerSize = {
    sm: 'w-24px h-24px',
    md: 'w-40px h-40px',
    lg: 'w-64px h-64px',
  };

  /** Espessura do anel por tamanho. */
  const ringWidth = {
    sm: 'border-2',
    md: 'border-[3px]',
    lg: 'border-4',
  };

  /** Caixa do tipo custom — diâmetro do anel externo. */
  const customSize = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };
</script>

{#if type === 'shimmer'}
  <!-- Placeholder: barras com varredura de brilho. -->
  <div class="space-y-12px w-full" role="status" aria-label={label ?? 'Carregando'}>
    {#each Array(lines) as _, i}
      <div
        class="relative overflow-hidden rounded-6px bg-slate-100 h-12px
               {i === lines - 1 ? 'w-2/3' : 'w-full'}"
      >
        <div
          class="absolute inset-0 -translate-x-full
                 bg-gradient-to-r from-transparent via-suporte-branco/70 to-transparent"
          style="animation: fideliza-shimmer 1.4s ease-in-out infinite"
        ></div>
      </div>
    {/each}
  </div>
{:else}
  <div class="inline-flex flex-col items-center gap-12px" role="status" aria-label={label ?? 'Carregando'}>
    {#if type === 'custom'}
      <!-- Anéis com bolinha orbitando + ilustração central. -->
      <div class="relative flex items-center justify-center {customSize[size]}">
        <!-- Anel externo -->
        <span
          class="absolute inset-0 rounded-full border border-slate-100"
          style="animation: fideliza-orbit 8s linear infinite"
        >
          <span class="absolute -top-3px left-1/2 -translate-x-1/2 w-8px h-8px rounded-full border border-slate-200 bg-suporte-branco"></span>
        </span>
        <!-- Anel intermediário -->
        <span
          class="absolute inset-[16%] rounded-full border border-slate-100"
          style="animation: fideliza-orbit 5s linear infinite reverse"
        >
          <span class="absolute top-1/2 -right-3px -translate-y-1/2 w-8px h-8px rounded-full border border-slate-200 bg-suporte-branco"></span>
        </span>
        <!-- Ilustração central: imagem (prod) ou fallback de ícone. -->
        <span class="relative z-10 flex items-center justify-center w-1/2 h-1/2">
          {#if image}
            <img src={image} alt={imageAlt} class="w-full h-full object-contain" />
          {:else if icon}
            <span class="text-brand-500 w-full h-full flex items-center justify-center">
              {@render icon()}
            </span>
          {/if}
        </span>
      </div>
    {:else}
      <!-- Spinner: base slate-200, arco superior brand. -->
      <div class="relative {spinnerSize[size]}">
        <div
          class="absolute inset-0 rounded-full {ringWidth[size]}
                 border-slate-200 border-t-brand-500 animate-spin-loading"
        ></div>
        {#if type === 'spinner-icon' && icon}
          <span class="absolute inset-0 flex items-center justify-center text-brand-500">
            {@render icon()}
          </span>
        {/if}
      </div>
    {/if}

    {#if label}
      <p class="text-sm font-semibold text-slate-600">{label}</p>
    {/if}
  </div>
{/if}
