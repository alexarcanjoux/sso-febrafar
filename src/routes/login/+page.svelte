<script>
  /**
   * Login — porta de entrada do SSO.
   *
   * Depois da senha o fluxo bifurca conforme a resposta do backend: com MFA
   * ligado vai para /verificacao, sem MFA volta para o produto de origem.
   * A tela não sabe a política, só reage ao `precisaMfa`.
   */
  import { goto } from '$app/navigation';
  import { AuthShell, FormField, LoadingButton, Aviso } from '$lib/index.js';
  import { emailValido } from '$lib/validacao.js';
  import { autenticar, mensagemDeErro } from '$lib/sso.js';
  import { rota } from '$lib/rotas.js';

  let { data } = $props();
  const produto = $derived(data.produto);

  let email = $state('');
  let senha = $state('');

  let erroEmail = $state('');
  let erroSenha = $state('');
  let erroEnvio = $state('');
  let enviando = $state(false);

  async function entrar() {
    erroEnvio = '';
    erroEmail = !email.trim()
      ? 'Informe seu e-mail.'
      : !emailValido(email)
        ? 'Digite um e-mail válido.'
        : '';
    erroSenha = !senha ? 'Informe sua senha.' : '';

    if (erroEmail || erroSenha) return;

    enviando = true;
    try {
      const { precisaMfa } = await autenticar({ email, senha, jornada: produto.jornada });

      if (precisaMfa) {
        await goto(rota('/verificacao', produto.id, { email }));
        return;
      }
      // Sem MFA a sessão está feita: devolve o usuário ao produto de origem.
      window.location.assign(produto.retorno);
    } catch (erro) {
      erroEnvio = mensagemDeErro(erro);
    } finally {
      enviando = false;
    }
  }
</script>

{#snippet iconeUsuario()}
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 19.5a7 7 0 0 1 14 0" stroke-linecap="round" />
  </svg>
{/snippet}

{#snippet iconeCadeado()}
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <rect x="5" y="10.5" width="14" height="9" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke-linecap="round" />
  </svg>
{/snippet}

<svelte:head>
  <title>Entrar · {produto.nome}</title>
</svelte:head>

<AuthShell
  {produto}
  titulo="Entre na sua conta"
  descricao="Use seu e-mail e senha para acessar."
>
  <form class="flex flex-col gap-20px" novalidate onsubmit={(e) => { e.preventDefault(); entrar(); }}>
    {#if erroEnvio}
      <Aviso tom="erro">{erroEnvio}</Aviso>
    {/if}

    <FormField
      label="E-mail"
      type="email"
      placeholder="voce@empresa.com.br"
      autocomplete="email"
      bind:value={email}
      error={erroEmail}
      oninput={() => (erroEmail = '')}
      iconLeft={iconeUsuario}
    />

    <div class="flex flex-col gap-8px">
      <FormField
        label="Senha"
        type="password"
        placeholder="Sua senha"
        autocomplete="current-password"
        bind:value={senha}
        error={erroSenha}
        oninput={() => (erroSenha = '')}
        iconLeft={iconeCadeado}
      />

      <div class="flex justify-end">
        <a
          href={rota('/esqueci-senha', produto.id, { email: email.trim() })}
          class="text-sm font-medium text-brand-700 transition-control hover:text-brand-800 rounded-4px
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          Esqueci minha senha
        </a>
      </div>
    </div>

    <LoadingButton type="submit" size="xl" fullWidth loading={enviando} loadingLabel="Entrando…">
      Entrar
    </LoadingButton>
  </form>
</AuthShell>
