import { redirect } from '@sveltejs/kit';

/**
 * A raiz do SSO não tem tela própria: quem chega aqui quer entrar.
 * A query segue junto para não perder `produto` nem `retorno`.
 *
 * @type {import('./$types').PageLoad}
 */
export function load({ url }) {
  redirect(307, `/login${url.search}`);
}
