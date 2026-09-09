<script>
  /**
   * Form Field — Fideliza Mais Design System
   *
   * Molécula: compõe o átomo `Input` + label + helper/error/success.
   *
   * Estados: default · hover · focus · filled · disabled · error · success
   * Tamanhos: sm (40px) · md (48px, default) · lg (56px)
   *
   * @typedef {Object} Props
   * @property {string} [label]
   * @property {string} [placeholder]
   * @property {string} [value]
   * @property {string} [error]              Mensagem de erro — ativa estado error
   * @property {string} [success]            Mensagem de sucesso — ativa estado success
   * @property {string} [helper]             Helper text (substituído por error/success se presentes)
   * @property {'sm'|'md'|'lg'} [size]
   * @property {'flat'|'shadow'} [elevation]  flat (default) ou shadow-base aplicado ao container
   * @property {'text'|'email'|'password'|'number'|'search'|'tel'|'url'|'date'|'time'|'datetime-local'} [type]
   * @property {boolean} [disabled]
   * @property {boolean} [required]
   * @property {boolean} [readonly]
   * @property {string} [id]
   * @property {string} [name]
   * @property {import('svelte/elements').HTMLInputAttributes['autocomplete']} [autocomplete]
   * @property {(event: Event) => void} [oninput]
   * @property {(event: FocusEvent) => void} [onfocus]
   * @property {(event: FocusEvent) => void} [onblur]
   * @property {import('svelte').Snippet} [iconLeft]
   * @property {import('svelte').Snippet} [iconRight]
   * @property {import('svelte').Snippet} [trailing]
   */

  import { Input } from '../Input/index.js';

  /** @type {Props} */
  let {
    label,
    placeholder,
    value = $bindable(''),
    error,
    success,
    helper,
    size = 'md',
    elevation = 'flat',
    type = 'text',
    disabled = false,
    required = false,
    readonly = false,
    id,
    name,
    autocomplete,
    oninput,
    onfocus,
    onblur,
    iconLeft,
    iconRight,
    trailing,
  } = $props();

  const fallbackId = `ff-${Math.random().toString(36).slice(2, 8)}`;
  const fieldId = $derived(id ?? fallbackId);
  const helperId = $derived(`${fieldId}-helper`);

  const hasError = $derived(!!error);
  const hasSuccess = $derived(!hasError && !!success);
  const helperMessage = $derived(error ?? success ?? helper);

  const inputStatus = $derived(hasError ? 'error' : hasSuccess ? 'success' : 'default');

  const helperClass = $derived(
    hasError
      ? 'text-suporte-vermelho'
      : hasSuccess
      ? 'text-suporte-fideliza-mais-verde-escuro'
      : 'text-slate-500'
  );
</script>

<div class="flex flex-col gap-4px">
  {#if label}
    <label
      for={fieldId}
      class="text-base font-medium {disabled ? 'text-slate-400' : 'text-slate-700'}"
    >
      {label}
      {#if required}
        <span class="text-suporte-vermelho" aria-hidden="true">*</span>
      {/if}
    </label>
  {/if}

  <Input
    id={fieldId}
    {type}
    {placeholder}
    bind:value
    {size}
    status={inputStatus}
    {elevation}
    {disabled}
    {required}
    {readonly}
    {name}
    {autocomplete}
    ariaDescribedby={helperMessage ? helperId : undefined}
    {oninput}
    {onfocus}
    {onblur}
    {iconLeft}
    {iconRight}
    {trailing}
  />

  {#if helperMessage}
    <span id={helperId} class="text-xs font-normal {helperClass}">
      {helperMessage}
    </span>
  {/if}
</div>
