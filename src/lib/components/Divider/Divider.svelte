<script>
  /**
   * Divider — Fideliza Mais Design System
   *
   * Separador de 1px para dividir informações sem recorrer a cards. Pode ser
   * horizontal (padrão) ou vertical, sólido ou tracejado, e exibir um rótulo
   * centralizado — nesse caso a linha se quebra dos dois lados do texto.
   *
   * Com `collapsible`, o rótulo vira um botão-pílula clicável sobre a linha —
   * usado como toggle para abrir/fechar uma seção escondida.
   *
   * @typedef {Object} Props
   * @property {'horizontal' | 'vertical'} [orientation]  Direção da linha
   * @property {'solid' | 'dashed'} [variant]             Estilo da linha
   * @property {string} [label]                          Rótulo central (só horizontal)
   * @property {'left' | 'center' | 'right'} [align]      Posição do rótulo/pílula na linha
   * @property {'none' | 'sm' | 'md' | 'lg'} [spacing]   Margem ao redor do divisor (none = sem margem)
   * @property {boolean} [collapsible]                   Rótulo vira botão-pílula de collapse
   * @property {boolean} [expanded]                      Estado do collapse (controlado)
   * @property {string} [labelCollapsed]                Texto da pílula quando fechado
   * @property {string} [labelExpanded]                 Texto da pílula quando aberto
   * @property {() => void} [onToggle]                  Callback ao clicar na pílula
   * @property {import('svelte').Snippet} [children]      Rótulo customizado — sobrepõe `label`
   */
  /** @type {Props} */
  let {
    orientation = 'horizontal',
    variant = 'solid',
    label,
    align = 'center',
    spacing = 'md',
    collapsible = false,
    expanded = false,
    labelCollapsed = 'Mostrar detalhes',
    labelExpanded = 'Ocultar detalhes',
    onToggle,
    children,
  } = $props();

  const isVertical = $derived(orientation === 'vertical');
  const hasLabel = $derived(!isVertical && (collapsible || !!label || !!children));

  /** Margem ao redor — eixo conforme a orientação. */
  const spacingMap = {
    horizontal: { none: 'my-0', sm: 'my-8px', md: 'my-16px', lg: 'my-24px' },
    vertical:   { none: 'mx-0', sm: 'mx-8px', md: 'mx-12px', lg: 'mx-16px' },
  };

  // Borda usada na linha — cor neutra do DS.
  const lineColor = 'border-slate-200';
  const lineStyle = $derived(variant === 'dashed' ? 'border-dashed' : 'border-solid');

  /**
   * Larguras dos segmentos de linha por alinhamento. O lado "curto" recebe
   * largura fixa de 24px; o lado "longo" preenche o resto (flex-1).
   */
  const sideWidth = {
    left:   { start: 'w-24px', end: 'flex-1' },
    center: { start: 'flex-1', end: 'flex-1' },
    right:  { start: 'flex-1', end: 'w-24px' },
  };
  const sides = $derived(sideWidth[align]);
</script>

{#if isVertical}
  <!-- Vertical: borda à esquerda, altura herda do contêiner pai (flex). -->
  <div
    class="self-stretch border-l {lineColor} {lineStyle} {spacingMap.vertical[spacing]}"
    role="separator"
    aria-orientation="vertical"
  ></div>
{:else if hasLabel}
  <!-- Horizontal com rótulo: linha quebrada dos dois lados do conteúdo. -->
  <div
    class="flex items-center gap-12px {spacingMap.horizontal[spacing]}"
    role="separator"
    aria-orientation="horizontal"
  >
    <span class="{sides.start} border-t {lineColor} {lineStyle}"></span>

    {#if collapsible}
      <!-- Botão-pílula de collapse sobre a linha. -->
      <button
        type="button"
        onclick={() => onToggle?.()}
        aria-expanded={expanded}
        class="shrink-0 inline-flex items-center gap-6px h-40px pl-16px pr-12px rounded-full
               bg-suporte-branco border border-slate-100 shadow-base
               text-sm font-semibold text-slate-700 cursor-pointer transition-control
               hover:bg-slate-50
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        {expanded ? labelExpanded : labelCollapsed}
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          class="w-16px h-16px text-brand-500 transition-transform duration-150 {expanded ? 'rotate-180' : ''}"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
    {:else}
      <span class="shrink-0 text-xs font-semibold text-slate-500 whitespace-nowrap">
        {#if children}{@render children()}{:else}{label}{/if}
      </span>
    {/if}

    <span class="{sides.end} border-t {lineColor} {lineStyle}"></span>
  </div>
{:else}
  <!-- Horizontal simples: linha contínua. -->
  <hr class="border-0 border-t {lineColor} {lineStyle} {spacingMap.horizontal[spacing]}" />
{/if}
