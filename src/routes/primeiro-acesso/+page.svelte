<script>
  /**
   * Primeiro acesso — usuário convidado define a senha inicial.
   *
   * Etapa opcional: só existe para produtos com `jornada.primeiroAcesso`.
   * Quando o produto não usa convite, a tela não finge que existe — explica
   * e devolve para o login.
   */
  import { goto } from '$app/navigation';
  import { AuthShell, FormNovaSenha, Button, Aviso } from '$lib/index.js';
  import { ativarPrimeiroAcesso } from '$lib/sso.js';
  import { rota } from '$lib/rotas.js';

  let { data } = $props();
  const produto = $derived(data.produto);
  const convite = $derived(data.convite);
  const habilitado = $derived(produto.jornada.primeiroAcesso);

  /** @param {string} senha */
  async function ativar(senha) {
    await ativarPrimeiroAcesso({ convite, senha });
    await goto(rota('/senha-alterada', produto.id, { origem: 'primeiro-acesso' }));
  }
</script>

<svelte:head>
  <title>Primeiro acesso · {produto.nome}</title>
</svelte:head>

<AuthShell
  {produto}
  titulo={habilitado && convite ? `Bem-vindo ao ${produto.nome}` : 'Convite não encontrado'}
  descricao={habilitado && convite
    ? 'Crie sua senha para ativar o acesso. Ela vale para todas as soluções Febrafar.'
    : 'Este link de convite não está mais válido ou não pertence a este produto.'}
  voltarHref={rota('/login', produto.id)}
>
  {#if !habilitado}
    <div class="flex flex-col gap-24px">
      <Aviso tom="info" titulo="{produto.nome} não usa convite por e-mail">
        O acesso é liberado pelo administrador da sua rede. Assim que ele
        cadastrar você, entre com e-mail e senha na tela de login.
      </Aviso>

      <Button variant="primary" size="xl" fullWidth onclick={() => goto(rota('/login', produto.id))}>
        Ir para o login
      </Button>
    </div>
  {:else if !convite}
    <div class="flex flex-col gap-24px">
      <Aviso tom="atencao" titulo="Não conseguimos validar este convite">
        Convites expiram em 7 dias. Peça um novo ao administrador da sua rede.
      </Aviso>

      <Button variant="secondary" size="xl" fullWidth onclick={() => goto(rota('/login', produto.id))}>
        Voltar para o login
      </Button>
    </div>
  {:else}
    <FormNovaSenha
      onConfirmar={ativar}
      rotuloBotao="Ativar meu acesso"
      rotuloCarregando="Ativando…"
    />
  {/if}
</AuthShell>
