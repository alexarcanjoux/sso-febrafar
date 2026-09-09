/**
 * Contagem regressiva para reenvio de e-mail e de código.
 *
 * Duas telas precisam da mesma coisa — bloquear o "reenviar" por alguns
 * segundos e mostrar quanto falta. Duplicar `setInterval` em cada uma é
 * como se esquece de limpar um timer.
 *
 * Chame durante a inicialização do componente: o `$effect` interno cuida de
 * limpar o intervalo quando a tela sai.
 *
 * @param {number} [segundos] Duração da espera — padrão 60s
 */
export function criarContagem(segundos = 60) {
  let restante = $state(0);
  /** @type {ReturnType<typeof setInterval> | undefined} */
  let timer;

  function parar() {
    clearInterval(timer);
    timer = undefined;
  }

  $effect(() => parar);

  return {
    get restante() {
      return restante;
    },
    /** Enquanto true, o botão de reenvio fica bloqueado. */
    get aguardando() {
      return restante > 0;
    },
    iniciar() {
      parar();
      restante = segundos;
      timer = setInterval(() => {
        restante -= 1;
        if (restante <= 0) parar();
      }, 1000);
    },
    parar,
  };
}
