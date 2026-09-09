/**
 * Mostra para qual endereço o link foi — sem isso o usuário não tem como
 * perceber que errou o e-mail.
 *
 * @type {import('./$types').PageLoad}
 */
export function load({ url }) {
  return { email: url.searchParams.get('email') ?? '' };
}
