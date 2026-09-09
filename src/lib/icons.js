/**
 * Catálogo de ícones do Design System.
 *
 * Todos os ícones são desenhados para `fill` (preenchidos), nunca stroke.
 * Cada entrada tem as variantes `outline` e `solid` — quando uma falta, o
 * componente Icon faz fallback para a que existir.
 *
 * Token do ícone: `{variant}_{name}_{size}` — ex.: `solid_check_24`.
 *
 * Paths normalizados para o viewBox 0 0 24 24.
 */

/**
 * @typedef {'check' | 'close' | 'minus' | 'alert' | 'edit' | 'tag' | 'help' | 'chevron'} IconName
 * @typedef {'outline' | 'solid'} IconVariant
 */

/** @type {Record<IconName, Partial<Record<IconVariant, string>>>} */
export const ICONS = {
  check: {
    solid:
      'M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.3l-4-4 1.4-1.4 2.6 2.6 5.6-5.6L17.8 9l-7 7z',
    outline:
      'M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-1.2 12.3l-4-4 1.4-1.4 2.6 2.6 5.6-5.6L16.8 9.4l-7 6.9z',
  },
  close: {
    solid:
      'M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 12.1L14.1 15.5 12 13.4l-2.1 2.1-1.4-1.4L10.6 12 8.5 9.9l1.4-1.4L12 10.6l2.1-2.1 1.4 1.4L13.4 12l2.1 2.1z',
    outline:
      'M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm3.5 10.1L14.1 15.5 12 13.4l-2.1 2.1-1.4-1.4L10.6 12 8.5 9.9l1.4-1.4L12 10.6l2.1-2.1 1.4 1.4L13.4 12l2.1 2.1z',
  },
  minus: {
    solid: 'M12 2a10 10 0 100 20 10 10 0 000-20zM7 11h10v2H7z',
    outline:
      'M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zM7 11h10v2H7z',
  },
  alert: {
    solid:
      'M12 2L1 21h22L12 2zm0 6a1 1 0 011 1v5a1 1 0 01-2 0V9a1 1 0 011-1zm0 9a1.2 1.2 0 110 2.4A1.2 1.2 0 0112 17z',
  },
  edit: {
    solid:
      'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.58z',
  },
  tag: {
    solid:
      'M11 2l9 9-9 9-9-9V2h9zm-3.5 5A1.5 1.5 0 106.5 8 1.5 1.5 0 008.5 6.5z',
  },
  help: {
    // Interrogação em círculo. outline = anel; solid = disco preenchido.
    outline:
      'M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm0 4a3 3 0 00-3 3 1 1 0 002 0 1 1 0 112 0c0 .7-.4 1-1 1.4-.7.5-1 1-1 2.1a1 1 0 002 0c0-.4.1-.5.8-1 .8-.6 1.2-1.3 1.2-2.5a3 3 0 00-3-3zm0 9.3a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z',
    solid:
      'M12 2a10 10 0 100 20 10 10 0 000-20zm0 6a3 3 0 013 3c0 1.2-.4 1.9-1.2 2.5-.7.5-.8.6-.8 1a1 1 0 01-2 0c0-1.1.3-1.6 1-2.1.6-.4 1-.7 1-1.4a1 1 0 10-2 0 1 1 0 01-2 0 3 3 0 013-3zm0 9.3a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
  },
  chevron: {
    // Seta para baixo (chevron). Gire via CSS (rotate) para cima/lados.
    solid: 'M6.7 9.3a1 1 0 011.4 0L12 13.2l3.9-3.9a1 1 0 111.4 1.4l-4.6 4.6a1 1 0 01-1.4 0L6.7 10.7a1 1 0 010-1.4z',
  },
};

/** Nomes disponíveis — útil para iterar em showcases. */
export const ICON_NAMES = /** @type {IconName[]} */ (Object.keys(ICONS));
