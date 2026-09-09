/**
 * O token vem no link do e-mail — `/redefinir-senha?token=…`.
 * Quem o valida de fato é o backend, no envio da nova senha.
 *
 * @type {import('./$types').PageLoad}
 */
export function load({ url }) {
  return { token: url.searchParams.get('token') ?? '' };
}
