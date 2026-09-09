<script>
  /**
   * Redefinir senha — destino do link enviado por e-mail.
   *
   * Sem token na URL não há o que fazer aqui: em vez do formulário, mostra o
   * caminho de volta (pedir um link novo). O token real é validado no
   * servidor; a checagem daqui só evita um formulário que já nasce morto.
   */
  import { goto } from '$app/navigation';
  import { AuthShell, FormNovaSenha, Button, Aviso } from '$lib/index.js';
  import { redefinirSenha } from '$lib/sso.js';
  import { rota } from '$lib/rotas.js';

  let { data } = $props();
  const produto = $derived(data.produto);
  const token = $derived(data.token);

  /** @param {string} senha */
  async function salvar(senha) {
    await redefinirSenha({ token, senha });
    await goto(rota('/senha-alterada', produto.id));
  }
</script>

<svelte:head>
  <title>Nova senha · {produto.nome}</title>
</svelte:head>

<AuthShell
  {produto}
  titulo={token ? 'Crie uma nova senha' : 'Link expirado'}
  descricao={token
    ? 'Esta senha passa a valer em todas as soluções Febrafar que você acessa.'
    : 'Links de redefinição valem por 30 minutos e só podem ser usados uma vez.'}
  voltarHref={rota('/login', produto.id)}
>
  {#if token}
    <FormNovaSenha onConfirmar={salvar} rotuloBotao="Salvar nova senha" />
  {:else}
    <div class="flex flex-col gap-24px">
      <Aviso tom="atencao" titulo="Não conseguimos validar este link">
        Ele pode ter expirado ou já ter sido usado. Peça um novo para continuar.
      </Aviso>

      <Button
        variant="primary"
        size="xl"
        fullWidth
        onclick={() => goto(rota('/esqueci-senha', produto.id))}
      >
        Pedir um novo link
      </Button>
    </div>
  {/if}
</AuthShell>
