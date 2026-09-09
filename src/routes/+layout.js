import { resolverProduto } from '$lib/produtos.js';

/**
 * O produto vem da URL (`?produto=pec`) e vale para toda a jornada.
 * Resolver no layout garante que qualquer tela — inclusive quando o usuário
 * abre direto o link de redefinição vindo do e-mail — já nasce com a marca
 * certa, sem flash de tema.
 *
 * @type {import('./$types').LayoutLoad}
 */
export function load({ url }) {
  return { produto: resolverProduto(url.searchParams.get('produto')) };
}
