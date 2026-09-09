/**
 * `origem=primeiro-acesso` troca o texto para o de ativação de conta.
 *
 * @type {import('./$types').PageLoad}
 */
export function load({ url }) {
  return { origem: url.searchParams.get('origem') ?? '' };
}
