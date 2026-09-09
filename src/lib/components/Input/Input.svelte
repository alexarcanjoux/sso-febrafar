<script>
  /**
   * Input — Fideliza Mais Design System
   *
   * Átomo: o campo de texto estilizado (container + input + ícones).
   * Não inclui label, helper nem mensagens — para isso use a molécula
   * `FormField`, que compõe este Input.
   *
   * Tipos   : text · email · password · number · search · tel · url · date · time · datetime-local
   * Tamanhos: sm (40px) · md (48px, default) · lg (56px)
   * Estados : default · error · success · disabled (via prop `status`/`disabled`)
   *
   * @typedef {Object} Props
   * @property {string} [value]
   * @property {'text'|'email'|'password'|'number'|'search'|'tel'|'url'|'date'|'time'|'datetime-local'} [type]
   * @property {'none'|'text'|'decimal'|'numeric'|'tel'|'search'|'email'|'url'} [inputmode]  Teclado virtual sugerido (ex.: 'decimal' p/ moeda)
   * @property {string} [placeholder]
   * @property {'sm'|'md'|'lg'} [size]
   * @property {'default'|'error'|'success'} [status]
   * @property {'flat'|'shadow'} [elevation]
   * @property {boolean} [disabled]
   * @property {boolean} [required]
   * @property {boolean} [readonly]
   * @property {string} [id]
   * @property {string} [name]
   * @property {import('svelte/elements').HTMLInputAttributes['autocomplete']} [autocomplete]
   * @property {string} [ariaDescribedby]
   * @property {(event: Event) => void} [oninput]
   * @property {(event: FocusEvent) => void} [onfocus]
   * @property {(event: FocusEvent) => void} [onblur]
   * @property {import('svelte').Snippet} [iconLeft]
   * @property {import('svelte').Snippet} [iconRight]
   * @property {import('svelte').Snippet} [trailing]
   * @property {import('svelte').Snippet} [prefix]    Bloco destacado encostado no canto esquerdo (ex.: "R$")
   */

  /** @type {Props} */
  let {
    value = $bindable(''),
    type = 'text',
    inputmode,
    placeholder,
    size = 'md',
    status = 'default',
    elevation = 'flat',
    disabled = false,
    required = false,
    readonly = false,
    id,
    name,
    autocomplete,
    ariaDescribedby,
    oninput,
    onfocus,
    onblur,
    iconLeft,
    iconRight,
    trailing,
    prefix,
  } = $props();

  const fallbackId = `in-${Math.random().toString(36).slice(2, 8)}`;
  const fieldId = $derived(id ?? fallbackId);

  let showPassword = $state(false);
  const actualType = $derived(type === 'password' && showPassword ? 'text' : type);
  const isPassword = $derived(type === 'password');

  /** Dimensão+tipografia por tamanho (sem padding horizontal — esse é
   *  calculado à parte conforme houver prefix). */
  const sizeBase = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-base',
  };

  /** Padding horizontal do container por tamanho. */
  const padX = {
    sm: { left: 'pl-12px', right: 'pr-12px', both: 'px-12px' },
    md: { left: 'pl-16px', right: 'pr-16px', both: 'px-16px' },
    lg: { left: 'pl-20px', right: 'pr-20px', both: 'px-20px' },
  };

  // Compatibilidade — algumas chamadas antigas leem `sizeMap`. Mantém o
  // nome com a composição equivalente ao comportamento anterior.
  const sizeMap = {
    sm: `${sizeBase.sm} ${padX.sm.both}`,
    md: `${sizeBase.md} ${padX.md.both}`,
    lg: `${sizeBase.lg} ${padX.lg.both}`,
  };

  // Quando há `prefix`, o container zera o padding esquerdo pra o bloco
  // encostar na borda. Padding direito continua igual.
  const containerSize = $derived(
    prefix
      ? `${sizeBase[size]} ${padX[size].right}`
      : sizeMap[size]
  );

  const stateClass = $derived.by(() => {
    if (disabled) {
      return 'border-slate-200 bg-slate-200';
    }
    if (status === 'error') {
      return 'border-suporte-vermelho bg-suporte-branco focus-within:border-suporte-vermelho focus-within:shadow-[inset_0_0_0_1px_var(--color-red-500)]';
    }
    if (status === 'success') {
      return 'border-suporte-fideliza-mais-verde bg-suporte-branco focus-within:border-suporte-fideliza-mais-verde focus-within:shadow-[inset_0_0_0_1px_var(--color-suporte-fideliza-mais-verde)]';
    }
    return 'border-slate-200 bg-suporte-branco focus-within:border-brand-500 focus-within:shadow-[inset_0_0_0_1px_var(--color-brand-500)]';
  });
</script>

<div
  class="relative flex items-center gap-8px rounded-8px border overflow-hidden transition-state {containerSize} {stateClass} {elevation === 'shadow' && !disabled ? 'shadow-base' : ''}"
>
  {#if prefix}
    <!-- Bloco prefix em destaque: encosta na borda esquerda, fundo slate-50,
         divisor 1px à direita. O `overflow-hidden` do container garante que
         o background respeite o raio externo. -->
    <span
      class="shrink-0 self-stretch inline-flex items-center justify-center
             bg-slate-50 border-r border-slate-200 text-slate-600 font-bold
             {padX[size].both}"
    >
      {@render prefix()}
    </span>
  {/if}

  {#if iconLeft}
    <span class="shrink-0 inline-flex items-center justify-center text-slate-400">
      {@render iconLeft()}
    </span>
  {/if}

  <input
    id={fieldId}
    type={actualType}
    {inputmode}
    {placeholder}
    {disabled}
    {required}
    {readonly}
    {name}
    {autocomplete}
    bind:value
    {oninput}
    {onfocus}
    {onblur}
    aria-invalid={status === 'error'}
    aria-disabled={disabled}
    aria-describedby={ariaDescribedby}
    class="flex-1 min-w-0 bg-transparent outline-none border-0 font-normal {disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-900'} placeholder:text-slate-400 placeholder:font-normal"
  />

  {#if isPassword && !iconRight && !trailing}
    <button
      type="button"
      onclick={() => (showPassword = !showPassword)}
      tabindex={disabled ? -1 : 0}
      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
      aria-pressed={showPassword}
      class="shrink-0 inline-flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
    >
      {#if showPassword}
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.477 10.477a3 3 0 004.046 4.046M9.88 4.61A10.05 10.05 0 0112 4.5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411M6.59 6.59A10.025 10.025 0 002.458 12c1.274 4.057 5.064 7 9.542 7a10.05 10.05 0 005.41-1.59" />
        </svg>
      {:else}
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      {/if}
    </button>
  {/if}

  {#if iconRight}
    <span class="shrink-0 inline-flex items-center justify-center text-slate-400">
      {@render iconRight()}
    </span>
  {/if}

  {#if trailing}
    <div class="shrink-0 inline-flex items-center">
      {@render trailing()}
    </div>
  {/if}
</div>
