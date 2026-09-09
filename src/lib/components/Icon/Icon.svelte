<script>
  /**
   * Icon — Fideliza Mais Design System
   *
   * Renderiza um ícone do catálogo (src/lib/icons.js). Todos os ícones são
   * preenchidos (`fill`), nunca stroke.
   *
   * Token: `{variant}_{name}_{size}` — ex.: `solid_check_24`. O ícone padrão
   * é 24px; variações de 16 e 20px. Quando a variante pedida não existe para
   * o ícone, faz fallback para a outra (outline ↔ solid).
   *
   * Cor: herda `currentColor` — controle pelo `text-*` do elemento pai.
   *
   * @typedef {import('../../icons.js').IconName} IconName
   * @typedef {import('../../icons.js').IconVariant} IconVariant
   *
   * @typedef {Object} Props
   * @property {IconName} name              Ícone do catálogo
   * @property {IconVariant} [variant]      Estilo: outline ou solid
   * @property {16 | 20 | 24} [size]        Tamanho em px — padrão 24
   * @property {string} [title]             Texto acessível; sem ele o ícone é decorativo
   * @property {string} [class]             Classes extras — tipicamente `text-*` para a cor
   */
  import { ICONS } from '../../icons.js';

  /** @type {Props} */
  let { name, variant = 'outline', size = 24, title, class: klass = '' } = $props();

  const entry = $derived(ICONS[name] ?? {});
  // Variante pedida; se faltar, faz fallback para a que existir.
  const path = $derived(entry[variant] ?? entry.outline ?? entry.solid ?? '');

  // Token canônico do ícone — ex.: solid_check_24.
  const token = $derived(`${variant}_${name}_${size}`);
</script>

{#if path}
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    class="inline-block shrink-0 {klass}"
    role={title ? 'img' : 'presentation'}
    aria-label={title}
    aria-hidden={title ? undefined : 'true'}
    data-icon={token}
  >
    {#if title}<title>{title}</title>{/if}
    <path d={path} fill-rule="evenodd" clip-rule="evenodd" />
  </svg>
{/if}
