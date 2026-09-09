<script>
  /**
   * Button — Fideliza Mais Design System
   *
   * Variantes : primary · secondary · ghost · text
   * Tamanhos  : xs (24px) · sm (30px) · md (32px) · lg (40px, padrão) · xl (52px)
   * Ícone     : left · right · only (quadrado, requer ariaLabel)
   * Estados   : hover, pressed e disabled controlados por CSS pseudo-classes
   *
   * @typedef {Object} Props
   * @property {'primary'|'secondary'|'ghost'|'text'} [variant]
   * @property {'xs'|'sm'|'md'|'lg'|'xl'} [size]   Padrão: lg
   * @property {'button'|'submit'|'reset'} [type]
   * @property {'left'|'right'|'only'} [iconPosition]
   * @property {number} [count]               Retorno de dados — exibido como " (n)" após o label
   * @property {boolean} [fullWidth]
   * @property {boolean} [disabled]
   * @property {string} [ariaLabel]           Obrigatório quando iconPosition === 'only'
   * @property {(event: MouseEvent) => void} [onclick]
   * @property {import('svelte').Snippet} [children]
   * @property {import('svelte').Snippet} [icon]
   */

  /** @type {Props} */
  let {
    variant = 'primary',
    size = 'lg',
    type = 'button',
    iconPosition = 'left',
    count,
    fullWidth = false,
    disabled = false,
    ariaLabel,
    onclick,
    children,
    icon,
  } = $props();

  const isIconOnly = $derived(iconPosition === 'only');

  // `text-brand-contraste` em vez de branco fixo: o SSO troca a marca por
  // produto e nem toda marca aceita texto branco (o âmbar do PEC dá 2.15:1).
  // O token vive em themes/produtos.css, ao lado da escala de cada marca.
  const variantClasses = {
    primary:
      'bg-brand-500 text-brand-contraste border-transparent ' +
      'hover:bg-brand-600 active:bg-brand-700 ' +
      'disabled:bg-slate-200 disabled:text-slate-400 disabled:border-transparent',
    secondary:
      'bg-suporte-branco border-slate-100 text-brand-500 shadow-base ' +
      'hover:bg-brand-50 ' +
      'active:bg-brand-100 active:border-brand-700 active:text-brand-700 active:shadow-none ' +
      'disabled:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400 disabled:shadow-none',
    ghost:
      'bg-transparent border-brand-500 text-brand-500 ' +
      'hover:bg-brand-50 ' +
      'active:bg-brand-100 active:border-brand-700 active:text-brand-700 ' +
      'disabled:bg-transparent disabled:border-slate-200 disabled:text-slate-400',
    text:
      'bg-transparent border-transparent text-brand-500 ' +
      'hover:text-brand-600 ' +
      'active:text-brand-700 ' +
      'disabled:text-slate-400',
  };

  const sizeClasses = {
    xs: 'h-24px text-xs px-8px py-2px gap-4px rounded-6px',
    sm: 'h-[30px] text-sm px-12px py-4px gap-4px rounded-6px',
    md: 'h-32px text-sm px-16px py-6px gap-8px rounded-6px',
    lg: 'h-40px text-sm px-20px py-10px gap-8px rounded-8px',
    xl: 'h-52px text-base px-24px py-12px gap-8px rounded-8px',
  };

  // Icon-only: força quadrado e zera padding horizontal
  const iconOnlyOverride = 'aspect-square px-0! py-0!';

  const iconSizeMap = {
    xs: 'w-16px h-16px',
    sm: 'w-16px h-16px',
    md: 'w-24px h-24px',
    lg: 'w-24px h-24px',
    xl: 'w-24px h-24px',
  };
</script>

<button
  {type}
  {disabled}
  {onclick}
  aria-label={isIconOnly ? ariaLabel : undefined}
  aria-disabled={disabled}
  class="inline-flex items-center justify-center border font-medium transition-colors duration-150 ease-out cursor-pointer
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-suporte-branco
         disabled:cursor-not-allowed
         {variantClasses[variant]} {sizeClasses[size]}
         {fullWidth ? 'w-full' : ''}
         {isIconOnly ? iconOnlyOverride : ''}"
>
  {#if icon && iconPosition === 'left'}
    <span class="shrink-0 inline-flex items-center justify-center {iconSizeMap[size]}">
      {@render icon()}
    </span>
  {/if}

  {#if !isIconOnly && children}
    <span class="inline-flex items-center">
      {@render children()}{#if typeof count === 'number'}<span class="ms-[2px]">({count})</span>{/if}
    </span>
  {/if}

  {#if icon && iconPosition === 'right'}
    <span class="shrink-0 inline-flex items-center justify-center {iconSizeMap[size]}">
      {@render icon()}
    </span>
  {/if}

  {#if isIconOnly && icon}
    <span class="shrink-0 inline-flex items-center justify-center {iconSizeMap[size]}">
      {@render icon()}
    </span>
  {/if}
</button>
