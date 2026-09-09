/**
 * Registry dos produtos conectados ao SSO Febrafar.
 *
 * O SSO é uma tela só. O que muda entre uma solução e outra é este registro:
 * a logo, a escala de cor (em themes/produtos.css, sob a mesma chave `id`)
 * e quais etapas da jornada de acesso aquele produto usa.
 *
 * O produto chega pela URL — `/login?produto=pec`. Sem parâmetro, ou com um
 * id desconhecido, cai no guarda-chuva Febrafar.
 *
 * Para conectar um produto novo:
 *   1. escala `brand` em src/lib/themes/produtos.css, sob `[data-produto='<id>']`;
 *   2. logo em static/logos/<id>.svg e o recorte do símbolo em
 *      static/logos/icones/<id>.svg;
 *   3. entrada aqui.
 *
 * @typedef {Object} Jornada
 * @property {boolean} primeiroAcesso  Usuário convidado define a senha no SSO
 * @property {boolean} mfa             Exige código de verificação após a senha
 *
 * @typedef {Object} Produto
 * @property {string} id
 * @property {string} nome
 * @property {string} logo         Caminho da logo colorida (fundo claro)
 * @property {string} icone        Símbolo sozinho, sem a marca escrita — o painel
 * @property {string} [logoAlt]    Texto alternativo — default: nome
 * @property {Jornada} jornada
 * @property {string} retorno      Para onde devolver o usuário após autenticar
 */

/** @type {Record<string, Produto>} */
export const PRODUTOS = {
  febrafar: {
    id: 'febrafar',
    nome: 'Febrafar',
    logo: '/logos/febrafar.svg',
    icone: '/logos/icones/febrafar.svg',
    logoAlt: 'Febrafar',
    jornada: { primeiroAcesso: true, mfa: false },
    retorno: 'https://febrafar.com.br',
  },
  pec: {
    id: 'pec',
    nome: 'PEC',
    logo: '/logos/pec.svg',
    icone: '/logos/icones/pec.svg',
    logoAlt: 'PEC',
    jornada: { primeiroAcesso: true, mfa: true },
    retorno: 'https://pec.febrafar.com.br',
  },
  'fideliza-mais': {
    id: 'fideliza-mais',
    nome: 'Fideliza Mais',
    logo: '/logos/fideliza-mais.svg',
    icone: '/logos/icones/fideliza-mais.svg',
    logoAlt: 'Fideliza Mais',
    jornada: { primeiroAcesso: true, mfa: false },
    retorno: 'https://fidelizamais.febrafar.com.br',
  },
  orion: {
    id: 'orion',
    nome: 'Orion',
    logo: '/logos/orion.svg',
    icone: '/logos/icones/orion.svg',
    logoAlt: 'Orion',
    jornada: { primeiroAcesso: true, mfa: true },
    retorno: 'https://orion.febrafar.com.br',
  },
  trade: {
    id: 'trade',
    nome: 'Trade',
    logo: '/logos/trade.svg',
    icone: '/logos/icones/trade.svg',
    logoAlt: 'Trade',
    jornada: { primeiroAcesso: true, mfa: true },
    retorno: 'https://trade.febrafar.com.br',
  },
  pulse: {
    id: 'pulse',
    nome: 'Pulse',
    logo: '/logos/pulse.svg',
    icone: '/logos/icones/pulse.svg',
    logoAlt: 'Pulse',
    jornada: { primeiroAcesso: false, mfa: true },
    retorno: 'https://pulse.febrafar.com.br',
  },
};

/** Produto assumido quando a URL não diz qual é. */
export const PRODUTO_PADRAO = 'febrafar';

/**
 * Reduz um id ao que ele tem de significativo: minúsculas e só letras e
 * dígitos. É o que faz `fidelizamais`, `fideliza-mais` e `Fideliza_Mais`
 * chegarem no mesmo produto.
 *
 * ⚠️ A TOLERÂNCIA É DE PROPÓSITO. O parâmetro é escrito à mão por quem monta o
 * link de saída de cada produto, e errar o hífen manda a pessoa para a tela da
 * Febrafar com a marca errada no topo — um erro silencioso, que só aparece
 * depois, na tela de quem ia entrar. Aceitar as duas grafias custa uma linha.
 *
 * @param {string | null | undefined} id
 * @returns {string}
 */
function normalizar(id) {
  return String(id ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Índice por id normalizado, montado uma vez a partir do registry. */
const POR_ID_NORMALIZADO = Object.fromEntries(
  Object.values(PRODUTOS).map((p) => [normalizar(p.id), p]),
);

/**
 * Resolve o produto a partir do id vindo da URL.
 * Nunca lança: id ausente ou desconhecido cai no guarda-chuva Febrafar.
 *
 * @param {string | null | undefined} id
 * @returns {Produto}
 */
export function resolverProduto(id) {
  return POR_ID_NORMALIZADO[normalizar(id)] ?? PRODUTOS[PRODUTO_PADRAO];
}

/**
 * Produtos conectados, sem o guarda-chuva Febrafar.
 *
 * @returns {Produto[]}
 */
export function listarProdutos() {
  return Object.values(PRODUTOS).filter((p) => p.id !== PRODUTO_PADRAO);
}
