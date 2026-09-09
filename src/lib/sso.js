/**
 * Ponto de integração com o backend do SSO.
 *
 * ⚠️ TUDO AQUI É SIMULAÇÃO. As funções têm a assinatura que as telas usam e
 * respondem com atraso para exercitar os estados de carregamento, mas não
 * falam com servidor nenhum. Trocar o corpo de cada função por `fetch` é a
 * única mudança necessária nas telas — elas só conhecem este módulo.
 *
 * Regras da simulação, para conseguir demonstrar os caminhos de erro:
 *   · senha `errada`          → credencial recusada
 *   · código `000000`         → código inválido
 *   · token/convite ausente   → link inválido ou expirado
 *
 * Contrato de erro: as funções rejeitam com `Error` cuja `message` é o texto
 * que a tela mostra. Mensagem de login é deliberadamente genérica — dizer
 * "esse e-mail não existe" entrega a existência da conta para quem sonda.
 */

/** @param {number} ms */
const espera = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Texto a exibir para uma falha. Rejeição que não é `Error` (queda de rede,
 * timeout do fetch) não tem mensagem apresentável — cai no genérico.
 *
 * @param {unknown} erro
 * @returns {string}
 */
export function mensagemDeErro(erro) {
  return erro instanceof Error && erro.message
    ? erro.message
    : 'Não foi possível concluir agora. Tente de novo em instantes.';
}

/**
 * Valida e-mail e senha.
 *
 * @param {{ email: string, senha: string, jornada?: import('./produtos.js').Jornada }} credenciais
 * @returns {Promise<{ precisaMfa: boolean }>}
 */
export async function autenticar({ email, senha, jornada }) {
  await espera(900);

  if (senha === 'errada') {
    throw new Error('E-mail ou senha incorretos. Verifique e tente de novo.');
  }

  // Na simulação, quem manda é a flag do produto. Em produção quem decide é o
  // backend (política do produto + risco da sessão) — a tela só obedece à
  // resposta, e é por isso que o dado vem daqui e não de um `if` na página.
  return { precisaMfa: jornada?.mfa ?? false };
}

/**
 * Dispara o e-mail de recuperação de senha.
 *
 * Sempre resolve, mesmo para e-mail inexistente: a tela de confirmação não
 * pode revelar quais endereços têm conta.
 *
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function solicitarRecuperacao(email) {
  await espera(900);
}

/**
 * Grava a nova senha a partir do token do e-mail.
 *
 * @param {{ token: string, senha: string }} dados
 * @returns {Promise<void>}
 */
export async function redefinirSenha({ token, senha }) {
  await espera(900);

  if (!token) {
    throw new Error('Este link de redefinição não é mais válido.');
  }
}

/**
 * Define a primeira senha de um usuário convidado.
 *
 * @param {{ convite: string, senha: string }} dados
 * @returns {Promise<void>}
 */
export async function ativarPrimeiroAcesso({ convite, senha }) {
  await espera(900);

  if (!convite) {
    throw new Error('Este convite não é mais válido.');
  }
}

/**
 * Confere o código de verificação em duas etapas.
 *
 * @param {{ codigo: string }} dados
 * @returns {Promise<void>}
 */
export async function verificarCodigo({ codigo }) {
  await espera(800);

  if (codigo === '000000') {
    throw new Error('Código inválido. Confira os dígitos e tente de novo.');
  }
}

/**
 * Reenvia o código de verificação.
 *
 * @returns {Promise<void>}
 */
export async function reenviarCodigo() {
  await espera(600);
}
