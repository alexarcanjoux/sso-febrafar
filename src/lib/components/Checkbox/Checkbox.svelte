<script>
  /**
   * Checkbox — Fideliza Mais Design System
   *
   * Tamanhos  : sm (16px) · md (20px, default) · lg (24px)
   * Variantes : brand (default) · success · danger
   * Estados   : default · hover · focus · checked · indeterminate · disabled · error
   *
   * @typedef {Object} Props
   * @property {boolean} [checked]
   * @property {boolean} [indeterminate]       Tri-state — sobrepõe visualmente o checked
   * @property {'sm'|'md'|'lg'} [size]
   * @property {'brand'|'success'|'danger'} [variant]
   * @property {string} [label]
   * @property {string} [helper]               Texto auxiliar abaixo do label
   * @property {string} [error]                Mensagem de erro — ativa estado error (substitui helper)
   * @property {boolean} [disabled]
   * @property {boolean} [required]
   * @property {string} [id]
   * @property {string} [name]
   * @property {string} [value]
   * @property {(event: Event) => void} [onchange]
   */

  /** @type {Props} */
  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    size = 'md',
    variant = 'brand',
    label,
    helper,
    error,
    disabled = false,
    required = false,
    id,
    name,
    value,
    onchange,
  } = $props();

  const fallbackId = `cb-${Math.random().toString(36).slice(2, 8)}`;
  const fieldId = $derived(id ?? fallbackId);
  const helperId = $derived(`${fieldId}-helper`);

  const hasError = $derived(!!error);
  const helperMessage = $derived(error ?? helper);
  const isActive = $derived(checked || indeterminate);

  const sizeMap = {
    sm: { box: 'w-16px h-16px rounded-4px', icon: 'w-12px h-12px', label: 'text-sm', gap: 'gap-8px' },
    md: { box: 'w-20px h-20px rounded-4px', icon: 'w-16px h-16px', label: 'text-base', gap: 'gap-8px' },
    lg: { box: 'w-24px h-24px rounded-6px', icon: 'w-20px h-20px', label: 'text-base', gap: 'gap-12px' },
  };

  const variantActive = {
    // Ver Button: o "branco" sobre a marca é o token brand-contraste.
    brand: 'bg-brand-500 border-brand-500 text-brand-contraste',
    success: 'bg-suporte-fideliza-mais-verde border-suporte-fideliza-mais-verde text-suporte-branco',
    danger: 'bg-suporte-vermelho border-suporte-vermelho text-suporte-branco',
  };

  const variantRing = {
    brand: 'focus-visible:ring-brand-500',
    success: 'focus-visible:ring-suporte-fideliza-mais-verde',
    danger: 'focus-visible:ring-suporte-vermelho',
  };

  const boxStateClass = $derived.by(() => {
    if (disabled) {
      return isActive
        ? 'bg-slate-200 border-slate-200 text-slate-400'
        : 'bg-slate-100 border-slate-200 text-transparent';
    }
    if (hasError) {
      return isActive
        ? 'bg-suporte-vermelho border-suporte-vermelho text-suporte-branco'
        : 'bg-suporte-branco border-suporte-vermelho text-transparent hover:bg-rose-50';
    }
    if (isActive) {
      return variantActive[variant];
    }
    return 'bg-suporte-branco border-slate-300 text-transparent hover:border-slate-400';
  });

  const labelClass = $derived(disabled ? 'text-slate-400' : 'text-slate-700');

  const helperClass = $derived(
    hasError ? 'text-suporte-vermelho' : 'text-slate-500'
  );

  /** @param {Event & { currentTarget: HTMLInputElement }} event */
  function handleChange(event) {
    if (indeterminate) {
      indeterminate = false;
    }
    checked = event.currentTarget.checked;
    onchange?.(event);
  }
</script>

<label
  for={fieldId}
  class="inline-flex items-start {sizeMap[size].gap} {disabled ? 'cursor-not-allowed' : 'cursor-pointer'}"
>
  <span class="relative inline-flex shrink-0 items-center justify-center">
    <input
      id={fieldId}
      type="checkbox"
      {name}
      {value}
      {required}
      {disabled}
      checked={checked}
      indeterminate={indeterminate}
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-invalid={hasError}
      aria-describedby={helperMessage ? helperId : undefined}
      onchange={handleChange}
      class="peer absolute inset-0 m-0 opacity-0 {disabled ? 'cursor-not-allowed' : 'cursor-pointer'}"
    />
    <span
      aria-hidden="true"
      class="relative inline-flex items-center justify-center border transition-state
             peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-suporte-branco
             {variantRing[variant]} {sizeMap[size].box} {boxStateClass}"
    >
      <!-- Ícones sempre no DOM: aparecem com fade + scale suave (transition-state). -->
      <span class="absolute inline-flex transition-state {indeterminate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class={sizeMap[size].icon} aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12" />
        </svg>
      </span>
      <span class="absolute inline-flex transition-state {checked && !indeterminate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class={sizeMap[size].icon} aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12l5 5L20 7" />
        </svg>
      </span>
    </span>
  </span>

  {#if label || helperMessage}
    <span class="flex flex-col gap-2px">
      {#if label}
        <span class="{sizeMap[size].label} font-normal {labelClass}">
          {label}
          {#if required}
            <span class="text-suporte-vermelho" aria-hidden="true">*</span>
          {/if}
        </span>
      {/if}
      {#if helperMessage}
        <span id={helperId} class="text-xs font-normal {helperClass}">
          {helperMessage}
        </span>
      {/if}
    </span>
  {/if}
</label>
