/**
 * O convite chega pelo link do e-mail — `/primeiro-acesso?convite=…`.
 *
 * @type {import('./$types').PageLoad}
 */
export function load({ url }) {
  return { convite: url.searchParams.get('convite') ?? '' };
}
