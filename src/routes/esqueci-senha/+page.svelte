<script>
  /**
   * Esqueci minha senha — pede o e-mail e dispara o link de redefinição.
   *
   * Vai sempre para a mesma tela de confirmação, exista a conta ou não:
   * a resposta não pode servir para descobrir quem tem cadastro.
   */
  import { goto } from '$app/navigation';
  import { AuthShell, FormField, LoadingButton, Aviso } from '$lib/index.js';
  import { emailValido } from '$lib/validacao.js';
  import { solicitarRecuperacao, mensagemDeErro } from '$lib/sso.js';
  import { rota } from '$lib/rotas.js';

  let { data } = $props();
  const produto = $derived(data.produto);

  // O login passa o e-mail já digitado adiante — não faz o usuário repetir.
  // svelte-ignore state_referenced_locally
  // Valor inicial do campo, de propósito: a partir daqui quem manda é o que
  // o usuário digitar, não a URL.
  let email = $state(data.emailInicial ?? '');
  let erroEmail = $state('');
  let erroEnvio = $state('');
  let enviando = $state(false);

  async function enviar() {
    erroEnvio = '';
    erroEmail = !email.trim()
      ? 'Informe seu e-mail.'
      : !emailValido(email)
        ? 'Digite um e-mail válido.'
        : '';

    if (erroEmail) return;

    enviando = true;
    try {
      await solicitarRecuperacao(email);
      await goto(rota('/email-enviado', produto.id, { email: email.trim() }));
    } catch (erro) {
      erroEnvio = mensagemDeErro(erro);
    } finally {
      enviando = false;
    }
  }
</script>

{#snippet iconeEnvelope()}
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m3.8 7 8.2 6 8.2-6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
{/snippet}

<svelte:head>
  <title>Recuperar senha · {produto.nome}</title>
</svelte:head>

<AuthShell
  {produto}
  titulo="Esqueceu sua senha?"
  descricao="Informe o seu e-mail abaixo para recuperar a senha."
  voltarHref={rota('/login', produto.id)}
>
  <form class="flex flex-col gap-20px" novalidate onsubmit={(e) => { e.preventDefault(); enviar(); }}>
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
      iconLeft={iconeEnvelope}
    />

    <LoadingButton type="submit" size="xl" fullWidth loading={enviando} loadingLabel="Enviando…">
      Enviar link de redefinição
    </LoadingButton>
  </form>
</AuthShell>
