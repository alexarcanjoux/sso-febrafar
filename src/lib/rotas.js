import { PRODUTO_PADRAO } from './produtos.js';

/**
 * Monta um link interno do SSO preservando o produto.
 *
 * Todo link entre telas precisa carregar o `?produto=` adiante — perder o
 * parâmetro no meio do fluxo faz a marca do usuário sumir na próxima tela.
 * O guarda-chuva Febrafar é o default, então não vai na URL.
 *
 * @param {string} caminho            Ex.: '/esqueci-senha'
 * @param {string} [produtoId]        Id do produto atual
 * @param {Record<string, string | null | undefined>} [extras]  Query extra (token, email…)
 * @returns {string}
 */
export function rota(caminho, produtoId, extras = {}) {
  const params = new URLSearchParams();

  if (produtoId && produtoId !== PRODUTO_PADRAO) {
    params.set('produto', produtoId);
  }
  for (const [chave, valor] of Object.entries(extras)) {
    if (valor) params.set(chave, String(valor));
  }

  const query = params.toString();
  return query ? `${caminho}?${query}` : caminho;
}
