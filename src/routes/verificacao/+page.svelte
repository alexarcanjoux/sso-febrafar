<script>
  /**
   * Verificação em duas etapas — segunda etapa do login.
   *
   * Etapa opcional: só produtos com `jornada.mfa` chegam aqui pelo login.
   * Quem cair na URL sem o produto usar MFA vê o desvio, não um código
   * que nunca vai chegar.
   *
   * O código confere sozinho ao completar os 6 dígitos — obrigar um clique
   * depois de digitar o último número é atrito puro.
   */
  import { goto } from '$app/navigation';
  import { AuthShell, CodigoInput, LoadingButton, Button, Aviso } from '$lib/index.js';
  import { verificarCodigo, reenviarCodigo, mensagemDeErro } from '$lib/sso.js';
  import { criarContagem } from '$lib/contagem.svelte.js';
  import { rota } from '$lib/rotas.js';

  let { data } = $props();
  const produto = $derived(data.produto);
  const email = $derived(data.email);
  const habilitado = $derived(produto.jornada.mfa);

  const contagem = criarContagem(45);

  // O código foi enviado ao chegar aqui — a espera do reenvio começa junto.
  $effect(() => {
    contagem.iniciar();
  });

  let codigo = $state('');
  let erro = $state('');
  let verificando = $state(false);
  let reenviado = $state(false);

  async function verificar() {
    erro = '';
    if (codigo.length < 6) {
      erro = 'Digite os 6 dígitos do código.';
      return;
    }

    verificando = true;
    try {
      await verificarCodigo({ codigo });
      window.location.assign(produto.retorno);
    } catch (falha) {
      erro = mensagemDeErro(falha);
      codigo = '';
    } finally {
      verificando = false;
    }
  }

  async function reenviar() {
    await reenviarCodigo();
    reenviado = true;
    erro = '';
    contagem.iniciar();
  }
</script>

<svelte:head>
  <title>Verificação em duas etapas · {produto.nome}</title>
</svelte:head>

<AuthShell
  {produto}
  titulo={habilitado ? 'Confirme que é você' : 'Verificação não necessária'}
  descricao={habilitado
    ? `Enviamos um código de 6 dígitos para ${email || 'seu e-mail'}.`
    : `${produto.nome} não usa verificação em duas etapas.`}
  voltarHref={rota('/login', produto.id)}
>
  {#if !habilitado}
    <Button variant="primary" size="xl" fullWidth onclick={() => goto(rota('/login', produto.id))}>
      Ir para o login
    </Button>
  {:else}
    <form class="flex flex-col gap-20px" novalidate onsubmit={(e) => { e.preventDefault(); verificar(); }}>
      {#if erro}
        <Aviso tom="erro">{erro}</Aviso>
      {:else if reenviado}
        <Aviso tom="sucesso">Código reenviado. Ele vale por 10 minutos.</Aviso>
      {/if}

      <CodigoInput
        bind:valor={codigo}
        erro={!!erro}
        disabled={verificando}
        oncompleto={verificar}
      />

      <LoadingButton
        type="submit"
        size="xl"
        fullWidth
        loading={verificando}
        loadingLabel="Verificando…"
      >
        Verificar código
      </LoadingButton>

      <div class="flex items-center justify-center gap-6px text-sm text-slate-500">
        <span>Não recebeu?</span>
        {#if contagem.aguardando}
          <span class="font-medium text-slate-400">Reenviar em {contagem.restante}s</span>
        {:else}
          <button
            type="button"
            onclick={reenviar}
            class="font-medium text-brand-700 transition-control cursor-pointer hover:text-brand-800 rounded-4px
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Reenviar código
          </button>
        {/if}
      </div>
    </form>
  {/if}
</AuthShell>
