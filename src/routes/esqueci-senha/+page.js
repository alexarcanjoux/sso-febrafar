/**
 * O e-mail já digitado no login chega por query, para o usuário não redigitar.
 *
 * @type {import('./$types').PageLoad}
 */
export function load({ url }) {
  return { emailInicial: url.searchParams.get('email') ?? '' };
}
