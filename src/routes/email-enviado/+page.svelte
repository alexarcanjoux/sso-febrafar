<script>
  /**
   * E-mail enviado — confirmação da solicitação de redefinição.
   *
   * Tela sem formulário, mas não sem função: é onde o usuário confere se
   * digitou o endereço certo e onde reenvia sem recomeçar o fluxo.
   */
  import { AuthShell, Button, Aviso } from '$lib/index.js';
  import { solicitarRecuperacao } from '$lib/sso.js';
  import { criarContagem } from '$lib/contagem.svelte.js';
  import { rota } from '$lib/rotas.js';

  let { data } = $props();
  const produto = $derived(data.produto);
  const email = $derived(data.email);

  const contagem = criarContagem(60);
  let reenviando = $state(false);
  let reenviado = $state(false);

  // O e-mail acabou de sair: a espera começa junto com a tela, senão o
  // usuário pede reenvio antes de o primeiro sequer chegar. Efeito sem
  // dependências — roda uma vez, e só no browser.
  $effect(() => {
    contagem.iniciar();
  });

  async function reenviar() {
    reenviando = true;
    try {
      await solicitarRecuperacao(email);
      reenviado = true;
      contagem.iniciar();
    } finally {
      reenviando = false;
    }
  }
</script>

<svelte:head>
  <title>Verifique seu e-mail · {produto.nome}</title>
</svelte:head>

<AuthShell
  {produto}
  titulo="Verifique seu e-mail"
  descricao="Se existir uma conta Febrafar para este endereço, o link de redefinição chega em instantes."
  voltarHref={rota('/login', produto.id)}
>
  <div class="flex flex-col gap-24px">
    <div class="flex items-center gap-16px rounded-12px border border-slate-200 bg-slate-50 p-16px">
      <span class="shrink-0 inline-flex items-center justify-center w-40px h-40px rounded-full bg-brand-500/10 text-brand-700">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="m3.8 7 8.2 6 8.2-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <div class="min-w-0">
        <p class="text-xs text-slate-500">Enviado para</p>
        <p class="truncate text-sm font-semibold text-slate-800">{email || 'seu e-mail'}</p>
      </div>
    </div>

    {#if reenviado}
      <Aviso tom="sucesso">Reenviamos o link. Confira também a caixa de spam.</Aviso>
    {/if}

    <p class="text-sm text-slate-500">
      O link vale por 30 minutos. Não chegou? Confira a caixa de spam antes de
      pedir um novo envio.
    </p>

    <div class="flex flex-col gap-12px">
      <Button
        variant="secondary"
        size="xl"
        fullWidth
        disabled={contagem.aguardando || reenviando}
        onclick={reenviar}
      >
        {contagem.aguardando ? `Reenviar em ${contagem.restante}s` : 'Reenviar e-mail'}
      </Button>

      <a
        href={rota('/esqueci-senha', produto.id, { email })}
        class="self-center text-sm font-medium text-brand-700 transition-control hover:text-brand-800 rounded-4px
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        Usar outro e-mail
      </a>
    </div>
  </div>
</AuthShell>
