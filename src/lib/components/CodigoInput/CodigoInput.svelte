<script>
  /**
   * CodigoInput — campo de código de verificação (MFA), um dígito por caixa.
   *
   * Comportamento que o usuário espera e costuma faltar: colar o código
   * inteiro preenche todas as caixas, backspace em caixa vazia volta para a
   * anterior, setas navegam, e o foco avança sozinho ao digitar.
   *
   * O estado real é o array de caixas — apagar o dígito do meio deixa um
   * buraco no meio, não empurra os outros. `bind:valor` expõe a string
   * concatenada para quem consome.
   *
   * @typedef {Object} Props
   * @property {string} [valor]                  Código atual (bindable)
   * @property {number} [tamanho]                Nº de dígitos — padrão 6
   * @property {boolean} [erro]                  Pinta as caixas como inválidas
   * @property {boolean} [disabled]
   * @property {string} [label]                  Rótulo acessível do grupo
   * @property {(codigo: string) => void} [oncompleto]  Disparado ao completar o código
   */

  import { untrack } from 'svelte';

  /** @type {Props} */
  let {
    valor = $bindable(''),
    tamanho = 6,
    erro = false,
    disabled = false,
    label = 'Código de verificação',
    oncompleto,
  } = $props();

  /** @type {string[]} */
  // svelte-ignore state_referenced_locally
  // Capturar o valor inicial é o certo aqui: `tamanho` é fixo por instância,
  // o número de caixas não muda no meio de uma verificação.
  let digitos = $state(Array.from({ length: tamanho }, (_, i) => valor[i] ?? ''));

  /** @type {HTMLInputElement[]} */
  let caixas = $state([]);

  // Reset vindo de fora (ex.: o pai limpa o código após um erro). Só reage a
  // `valor`; sem untrack a escrita em `digitos` realimentaria o efeito.
  $effect(() => {
    const externo = valor;
    untrack(() => {
      if (externo !== digitos.join('')) {
        digitos = Array.from({ length: tamanho }, (_, i) => externo[i] ?? '');
      }
    });
  });

  function publicar() {
    valor = digitos.join('');
    if (digitos.every((d) => d !== '')) {
      oncompleto?.(valor);
    }
  }

  /**
   * Só dígitos, no máximo o número de caixas.
   * @param {string} texto
   */
  function normalizar(texto) {
    return String(texto ?? '').replace(/\D/g, '').slice(0, tamanho);
  }

  /**
   * Distribui `texto` a partir da caixa `inicio` e foca a próxima vazia.
   * @param {number} inicio
   * @param {string} texto
   */
  function distribuir(inicio, texto) {
    const entrada = normalizar(texto);
    for (let i = 0; i < entrada.length && inicio + i < tamanho; i += 1) {
      digitos[inicio + i] = entrada[i];
    }
    const proxima = Math.min(inicio + entrada.length, tamanho - 1);
    caixas[proxima]?.focus();
    publicar();
  }

  /**
   * @param {number} indice
   * @param {Event & { currentTarget: HTMLInputElement }} event
   */
  function aoDigitar(indice, event) {
    const entrada = normalizar(event.currentTarget.value);

    // Autofill do SMS entrega o código inteiro numa caixa só.
    if (entrada.length > 1) {
      event.currentTarget.value = entrada[0] ?? '';
      distribuir(indice, entrada);
      return;
    }

    digitos[indice] = entrada;
    event.currentTarget.value = entrada;

    if (entrada && indice < tamanho - 1) {
      caixas[indice + 1]?.focus();
    }
    publicar();
  }

  /**
   * @param {number} indice
   * @param {KeyboardEvent} event
   */
  function aoTeclar(indice, event) {
    if (event.key === 'Backspace' && !digitos[indice] && indice > 0) {
      event.preventDefault();
      digitos[indice - 1] = '';
      caixas[indice - 1]?.focus();
      publicar();
      return;
    }
    if (event.key === 'ArrowLeft' && indice > 0) {
      event.preventDefault();
      caixas[indice - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && indice < tamanho - 1) {
      event.preventDefault();
      caixas[indice + 1]?.focus();
    }
  }

  /**
   * @param {number} indice
   * @param {ClipboardEvent} event
   */
  function aoColar(indice, event) {
    event.preventDefault();
    distribuir(indice, event.clipboardData?.getData('text') ?? '');
  }

  const caixaClasse = $derived(
    erro
      ? 'border-suporte-vermelho focus:border-suporte-vermelho focus:shadow-[inset_0_0_0_1px_var(--color-red-500)]'
      : 'border-slate-200 focus:border-brand-500 focus:shadow-[inset_0_0_0_1px_var(--color-brand-500)]'
  );
</script>

<div role="group" aria-label={label} class="flex items-center gap-8px">
  {#each digitos as digito, i (i)}
    <input
      bind:this={caixas[i]}
      type="text"
      inputmode="numeric"
      autocomplete={i === 0 ? 'one-time-code' : 'off'}
      maxlength={tamanho}
      value={digito}
      {disabled}
      aria-label="Dígito {i + 1} de {tamanho}"
      aria-invalid={erro}
      oninput={(e) => aoDigitar(i, e)}
      onkeydown={(e) => aoTeclar(i, e)}
      onpaste={(e) => aoColar(i, e)}
      onfocus={(e) => e.currentTarget.select()}
      class="h-56px w-full min-w-0 rounded-8px border bg-suporte-branco text-center text-xl font-semibold
             text-slate-900 outline-none transition-state
             disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
             {caixaClasse}"
    />
  {/each}
</div>
