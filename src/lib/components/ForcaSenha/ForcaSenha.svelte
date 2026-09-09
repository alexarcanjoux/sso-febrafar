<script>
  /**
   * ForcaSenha — medidor + checklist das regras de senha.
   *
   * Usado nas telas de primeiro acesso e redefinição. As regras vêm de
   * lib/validacao.js, que é a mesma fonte que libera o botão — o que o
   * usuário lê aqui é literalmente o que o formulário exige.
   *
   * A cor do medidor é semântica (vermelho/amarelo/verde), não da marca:
   * "senha fraca" precisa significar o mesmo em todos os produtos.
   *
   * @typedef {Object} Props
   * @property {string} senha
   */

  /** @type {Props} */
  let { senha = '' } = $props();

  import { avaliarSenha, forcaSenha } from '../../validacao.js';

  const regras = $derived(avaliarSenha(senha));
  const forca = $derived(forcaSenha(senha));

  const rotulo = {
    vazia: '',
    fraca: 'Senha fraca',
    media: 'Senha média',
    forte: 'Senha forte',
  };

  const barra = {
    vazia: 'bg-slate-200',
    fraca: 'bg-red-500',
    media: 'bg-yellow-500',
    forte: 'bg-green-500',
  };

  const textoForca = {
    vazia: 'text-slate-400',
    fraca: 'text-red-600',
    media: 'text-yellow-700',
    forte: 'text-green-700',
  };

  const preenchimento = $derived(Math.round((forca.atendidas / forca.total) * 100));
</script>

<div class="flex flex-col gap-12px">
  <div class="flex flex-col gap-6px">
    <div class="h-4px w-full overflow-hidden rounded-full bg-slate-200">
      <div
        class="h-full rounded-full transition-state {barra[forca.nivel]}"
        style="width: {preenchimento}%"
      ></div>
    </div>
    <!-- aria-live: o medidor muda enquanto o usuário digita, o leitor de tela
         precisa acompanhar sem que o foco saia do campo. O rótulo só aparece
         com algo digitado — campo vazio não é "senha fraca", é campo vazio. -->
    <div aria-live="polite">
      {#if forca.nivel !== 'vazia'}
        <span class="text-xs font-medium {textoForca[forca.nivel]}">{rotulo[forca.nivel]}</span>
      {/if}
    </div>
  </div>

  <ul class="flex flex-col gap-4px">
    {#each regras as regra (regra.id)}
      <li class="flex items-center gap-8px text-xs {regra.ok ? 'text-green-700' : 'text-slate-500'}">
        <svg viewBox="0 0 24 24" fill="currentColor" class="shrink-0 w-16px h-16px" aria-hidden="true">
          {#if regra.ok}
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.3l-4-4 1.4-1.4 2.6 2.6 5.6-5.6L17.8 9l-7 7z" />
          {:else}
            <circle cx="12" cy="12" r="4" class="text-slate-300" fill="currentColor" />
          {/if}
        </svg>
        <span>{regra.texto}</span>
      </li>
    {/each}
  </ul>
</div>
