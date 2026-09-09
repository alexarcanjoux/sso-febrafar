<script>
  /**
   * FormNovaSenha — formulário de definição de senha.
   *
   * Serve às duas telas que criam senha: primeiro acesso e redefinição.
   * O que muda entre elas é o texto do botão e o que acontece no envio —
   * as regras, a checklist e a confirmação são as mesmas, e é justamente
   * isso que não pode divergir entre uma tela e outra.
   *
   * @typedef {Object} Props
   * @property {(senha: string) => Promise<void> | void} onConfirmar  Envio — pode lançar para exibir erro
   * @property {string} [rotuloBotao]
   * @property {string} [rotuloCarregando]
   * @property {import('svelte/elements').HTMLInputAttributes['autocomplete']} [autocomplete]  'new-password' na maioria dos casos
   */

  import { FormField } from '../FormField/index.js';
  import { LoadingButton } from '../LoadingButton/index.js';
  import { ForcaSenha } from '../ForcaSenha/index.js';
  import { Aviso } from '../Aviso/index.js';
  import { senhaValida, erroConfirmacao } from '../../validacao.js';
  import { mensagemDeErro } from '../../sso.js';

  /** @type {Props} */
  let {
    onConfirmar,
    rotuloBotao = 'Salvar nova senha',
    rotuloCarregando = 'Salvando…',
    autocomplete = 'new-password',
  } = $props();

  let senha = $state('');
  let confirmacao = $state('');

  let erroSenha = $state('');
  let erroConfirma = $state('');
  let erroEnvio = $state('');
  let enviando = $state(false);

  async function confirmar() {
    erroEnvio = '';
    erroSenha = senhaValida(senha) ? '' : 'A senha ainda não atende às regras abaixo.';
    erroConfirma = erroConfirmacao(senha, confirmacao);

    if (erroSenha || erroConfirma) return;

    enviando = true;
    try {
      await onConfirmar(senha);
    } catch (erro) {
      erroEnvio = mensagemDeErro(erro);
    } finally {
      enviando = false;
    }
  }
</script>

{#snippet iconeCadeado()}
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <rect x="5" y="10.5" width="14" height="9" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke-linecap="round" />
  </svg>
{/snippet}

<form class="flex flex-col gap-20px" novalidate onsubmit={(e) => { e.preventDefault(); confirmar(); }}>
  {#if erroEnvio}
    <Aviso tom="erro">{erroEnvio}</Aviso>
  {/if}

  <div class="flex flex-col gap-12px">
    <FormField
      label="Nova senha"
      type="password"
      placeholder="Crie uma senha"
      {autocomplete}
      bind:value={senha}
      error={erroSenha}
      oninput={() => (erroSenha = '')}
      iconLeft={iconeCadeado}
    />
    <ForcaSenha {senha} />
  </div>

  <FormField
    label="Confirme a nova senha"
    type="password"
    placeholder="Repita a senha"
    {autocomplete}
    bind:value={confirmacao}
    error={erroConfirma}
    oninput={() => (erroConfirma = '')}
    iconLeft={iconeCadeado}
  />

  <LoadingButton type="submit" size="xl" fullWidth loading={enviando} loadingLabel={rotuloCarregando}>
    {rotuloBotao}
  </LoadingButton>
</form>
