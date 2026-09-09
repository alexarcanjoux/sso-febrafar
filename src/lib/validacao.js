/**
 * Regras de validação das telas de acesso.
 *
 * Ficam num módulo só porque as mesmas regras aparecem em três telas
 * (primeiro acesso, redefinição e — no caso do e-mail — login e recuperação),
 * e regra de senha divergente entre telas é bug garantido.
 *
 * ⚠️ Validação de cliente é conveniência, não segurança. O backend do SSO
 * precisa reaplicar cada uma destas regras.
 */

/** Formato de e-mail — deliberadamente permissivo, quem valida de fato é o envio. */
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param {string} valor
 * @returns {boolean}
 */
export function emailValido(valor) {
  return RE_EMAIL.test(String(valor ?? '').trim());
}

/**
 * Regras da senha. A ordem é a que o usuário vê na checklist.
 *
 * @type {{ id: string, texto: string, testa: (senha: string) => boolean }[]}
 */
export const REGRAS_SENHA = [
  { id: 'tamanho', texto: 'No mínimo 8 caracteres', testa: (s) => s.length >= 8 },
  { id: 'maiuscula', texto: 'Uma letra maiúscula', testa: (s) => /[A-Z]/.test(s) },
  { id: 'minuscula', texto: 'Uma letra minúscula', testa: (s) => /[a-z]/.test(s) },
  { id: 'numero', texto: 'Um número', testa: (s) => /\d/.test(s) },
  { id: 'especial', texto: 'Um caractere especial (!@#$…)', testa: (s) => /[^A-Za-z0-9]/.test(s) },
];

/**
 * Avalia a senha contra cada regra.
 *
 * @param {string} senha
 * @returns {{ id: string, texto: string, ok: boolean }[]}
 */
export function avaliarSenha(senha) {
  const valor = String(senha ?? '');
  return REGRAS_SENHA.map(({ id, texto, testa }) => ({ id, texto, ok: testa(valor) }));
}

/**
 * Senha só é válida com TODAS as regras atendidas — não há "senha média
 * aceitável" aqui, o medidor serve para orientar, não para liberar.
 *
 * @param {string} senha
 * @returns {boolean}
 */
export function senhaValida(senha) {
  return avaliarSenha(senha).every((r) => r.ok);
}

/**
 * Força da senha, para o medidor visual.
 * Divide as regras atendidas em três faixas.
 *
 * @param {string} senha
 * @returns {{ nivel: 'vazia' | 'fraca' | 'media' | 'forte', atendidas: number, total: number }}
 */
export function forcaSenha(senha) {
  const avaliacao = avaliarSenha(senha);
  const atendidas = avaliacao.filter((r) => r.ok).length;
  const total = avaliacao.length;

  const nivel = !String(senha ?? '').length
    ? 'vazia'
    : atendidas === total
      ? 'forte'
      : atendidas >= 3
        ? 'media'
        : 'fraca';

  return { nivel, atendidas, total };
}

/**
 * Mensagem de erro do campo de confirmação de senha.
 *
 * @param {string} senha
 * @param {string} confirmacao
 * @returns {string} Vazio quando está tudo certo
 */
export function erroConfirmacao(senha, confirmacao) {
  if (!confirmacao) return 'Repita a senha para confirmar.';
  return senha === confirmacao ? '' : 'As senhas não são iguais.';
}
