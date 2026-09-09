<script>
  /**
   * Senha alterada — fim do fluxo de senha.
   *
   * Serve tanto à redefinição quanto ao primeiro acesso (`?origem=`): muda o
   * texto, não a estrutura. O aviso sobre as outras sessões não é decoração —
   * é o que explica por que o usuário vai ser deslogado no celular.
   */
  import { goto } from '$app/navigation';
  import { AuthShell, Button } from '$lib/index.js';
  import { rota } from '$lib/rotas.js';

  let { data } = $props();
  const produto = $derived(data.produto);
  const primeiroAcesso = $derived(data.origem === 'primeiro-acesso');
</script>

<svelte:head>
  <title>Senha definida · {produto.nome}</title>
</svelte:head>

<AuthShell
  {produto}
  titulo={primeiroAcesso ? 'Acesso ativado!' : 'Senha alterada!'}
  descricao={primeiroAcesso
    ? `Sua conta Febrafar está pronta. Entre para começar a usar ${produto.nome}.`
    : 'Sua nova senha já vale para todas as soluções Febrafar.'}
>
  <div class="flex flex-col gap-24px">
    <div class="flex items-start gap-16px rounded-12px border border-green-200 bg-green-50 p-16px">
      <span class="shrink-0 inline-flex items-center justify-center w-40px h-40px rounded-full bg-green-100 text-green-600">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.3l-4-4 1.4-1.4 2.6 2.6 5.6-5.6L17.8 9l-7 7z" />
        </svg>
      </span>
      <p class="text-sm text-green-900">
        Por segurança, encerramos as sessões abertas nos outros dispositivos.
        Você vai precisar entrar de novo neles com a senha nova.
      </p>
    </div>

    <Button variant="primary" size="xl" fullWidth onclick={() => goto(rota('/login', produto.id))}>
      Ir para o login
    </Button>
  </div>
</AuthShell>
