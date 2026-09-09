/**
 * O e-mail vem do login, só para dizer ao usuário para onde o código foi.
 *
 * @type {import('./$types').PageLoad}
 */
export function load({ url }) {
  return { email: url.searchParams.get('email') ?? '' };
}
